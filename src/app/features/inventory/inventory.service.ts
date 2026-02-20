
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { StateService } from '../../core/services/state.service';
import {
  doc, setDoc, updateDoc, deleteDoc,
  collection, addDoc, serverTimestamp, writeBatch,
  query, where, orderBy, limit, startAfter, getDocs,
  QueryConstraint, QueryDocumentSnapshot, runTransaction, getCountFromServer
} from 'firebase/firestore';
import { InventoryItem, StockHistoryItem } from '../../core/models/inventory.model';
import { ToastService } from '../../core/services/toast.service';
import { Log } from '../../core/models/log.model';
import { normalizeInventoryItem } from '../../shared/utils/utils';

export interface InventoryPage {
  items: InventoryItem[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private fb = inject(FirebaseService);
  private state = inject(StateService);
  private toast = inject(ToastService);

  // --- OPTIMIZED READ Operations ---

  async getInventoryCount(): Promise<number> {
    try {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
      const snapshot = await getCountFromServer(colRef);
      return snapshot.data().count;
    } catch (e) {
      console.error("Count error:", e);
      return 0;
    }
  }

  async getItemsByIds(ids: string[]): Promise<InventoryItem[]> {
    if (!ids || ids.length === 0) return [];

    const validIds = [...new Set(ids)].filter(id => {
      if (!id || typeof id !== 'string') return false;
      const trimmed = id.trim();
      return trimmed.length > 0 && !trimmed.includes('/');
    });

    if (validIds.length === 0) return [];

    const chunks = [];
    const chunkSize = 30;

    for (let i = 0; i < validIds.length; i += chunkSize) {
      chunks.push(validIds.slice(i, i + chunkSize));
    }

    const results: InventoryItem[] = [];
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');

    const fetchChunk = async (chunk: string[]) => {
      try {
        const q = query(colRef, where('__name__', 'in', chunk));
        const snapshot = await Promise.race([
          getDocs(q),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout fetching inventory')), 5000)
          )
        ]);
        snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() } as InventoryItem));
      } catch (e) {
        console.warn("Chunk fetch failed or timed out (skipping chunk):", chunk, e);
      }
    };

    await Promise.all(chunks.map(chunk => fetchChunk(chunk)));
    return results;
  }

  async getLowStockItems(limitCount: number = 5): Promise<InventoryItem[]> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
    const q = query(colRef, orderBy('stock', 'asc'), limit(limitCount * 4));

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));
    const lowItems = items.filter(i => i.stock <= (i.threshold || 5));

    return lowItems.slice(0, limitCount);
  }

  async getAllInventory(): Promise<InventoryItem[]> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));
  }

  async getInventoryPage(
    pageSize: number,
    lastDoc: QueryDocumentSnapshot | null,
    filterType: string,
    searchTerm: string
  ): Promise<InventoryPage> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
    let constraints: QueryConstraint[] = [];

    if (searchTerm) {
      const term = searchTerm.trim();
      constraints.push(where('id', '>=', term));
      constraints.push(where('id', '<=', term + '\uf8ff'));
      constraints.push(orderBy('id'));
    } else {
      if (filterType !== 'all' && filterType !== 'low') {
        constraints.push(where('category', '==', filterType));
      }
      constraints.push(orderBy('lastUpdated', 'desc'));
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(pageSize));

    const q = query(colRef, ...constraints);
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));

    let finalItems = items;
    if (!searchTerm && filterType === 'low') {
      finalItems = items.filter(i => i.stock <= (i.threshold || 5));
    }

    return {
      items: finalItems,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === pageSize
    };
  }

  // --- REPORTING Operations ---

  async getLogsByDateRange(startDate: Date, endDate: Date): Promise<Log[]> {
    const start = new Date(startDate); start.setHours(0, 0, 0, 0);
    const end = new Date(endDate); end.setHours(23, 59, 59, 999);

    const logsRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs');
    const q = query(
      logsRef,
      where('timestamp', '>=', start),
      where('timestamp', '<=', end),
      orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Log));
  }

  async getStockCard(itemId: string): Promise<StockHistoryItem[]> {
    const ref = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', itemId, 'history');
    const q = query(ref, orderBy('timestamp', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StockHistoryItem));
  }

  // --- TRANSACTIONAL WRITE Operations ---

  async upsertItem(itemData: InventoryItem, isNew: boolean = false, reason: string = '', oldStock: number = 0) {
    // 1. NORMALIZE: Ensure Base Unit (ml, g)
    const item = normalizeInventoryItem(itemData);
    const currentUser = this.state.getCurrentUserName();

    const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.id);
    const globalLogRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));

    await runTransaction(this.fb.db, async (transaction) => {
      // A. Inventory Write
      transaction.set(invRef, { ...item, lastUpdated: serverTimestamp() }, { merge: true });

      // B. Item History
      if (isNew) {
        const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.id, 'history'));
        const historyEntry: StockHistoryItem = {
          timestamp: serverTimestamp(),
          actionType: 'CREATE',
          amountChange: item.stock,
          stockAfter: item.stock,
          reference: reason || 'Khởi tạo',
          user: currentUser
        };
        transaction.set(historyRef, historyEntry);
      } else if (item.stock !== oldStock) {
        const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.id, 'history'));
        const historyEntry: StockHistoryItem = {
          timestamp: serverTimestamp(),
          actionType: item.stock > oldStock ? 'IMPORT' : 'EXPORT',
          amountChange: item.stock - oldStock,
          stockAfter: item.stock,
          reference: reason || 'Cập nhật thông tin & tồn kho',
          user: currentUser
        };
        transaction.set(historyRef, historyEntry);
      }

      // C. Global Log (Atomic)
      const action = isNew ? 'CREATE_ITEM' : 'UPDATE_INFO';
      const details = isNew
        ? `Tạo mới: ${item.id} (${item.stock}${item.unit})`
        : (item.stock !== oldStock ? `Cập nhật: ${item.id} (Tồn kho: ${oldStock} -> ${item.stock})` : `Cập nhật: ${item.id}`);

      transaction.set(globalLogRef, {
        action,
        details,
        timestamp: serverTimestamp(),
        user: currentUser,
        targetId: item.id,
        reason: reason
      });
    });
  }

  async deleteItem(id: string, reason: string = '') {
    const currentUser = this.state.getCurrentUserName();
    const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    const globalLogRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));

    // Sub-collection cleanup (Batch)
    const historyRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history');

    const historySnapshot = await getDocs(historyRef);

    // Chunk history deletions to avoid 500 limit per batch
    const chunks: any[][] = [];
    let currentChunk: any[] = [];
    historySnapshot.forEach(doc => {
      currentChunk.push(doc.ref);
      if (currentChunk.length === 400) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
    });
    if (currentChunk.length > 0) chunks.push(currentChunk);

    for (const chunk of chunks) {
      const batch = writeBatch(this.fb.db);
      chunk.forEach(ref => batch.delete(ref));
      await batch.commit();
    }

    const finalBatch = writeBatch(this.fb.db);
    finalBatch.delete(invRef);

    finalBatch.set(globalLogRef, {
      action: 'DELETE_ITEM',
      details: `Xóa hóa chất: ${id}`,
      timestamp: serverTimestamp(),
      user: currentUser,
      targetId: id,
      reason: reason
    });

    await finalBatch.commit();
  }

  async updateStock(id: string, currentStock: number, adjustment: number, reason: string = '') {
    const newStock = currentStock + adjustment;
    const currentUser = this.state.getCurrentUserName();

    const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history'));
    const globalLogRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));

    await runTransaction(this.fb.db, async (transaction) => {
      // A. Update Stock
      transaction.update(invRef, { stock: newStock, lastUpdated: serverTimestamp() });

      // B. Write History
      const historyEntry: StockHistoryItem = {
        timestamp: serverTimestamp(),
        actionType: adjustment > 0 ? 'IMPORT' : 'EXPORT',
        amountChange: adjustment,
        stockAfter: newStock,
        reference: reason || 'Cập nhật nhanh',
        user: currentUser
      };
      transaction.set(historyRef, historyEntry);

      // C. Write Global Log
      const actionType = adjustment > 0 ? 'STOCK_IN' : 'STOCK_OUT';
      transaction.set(globalLogRef, {
        action: actionType,
        details: `Điều chỉnh kho ${id}: ${adjustment > 0 ? '+' : ''}${adjustment}`,
        timestamp: serverTimestamp(),
        user: currentUser,
        targetId: id,
        reason: reason
      });
    });
  }

  async bulkZeroStock(ids: string[], reason: string = '') {
    if (!ids || ids.length === 0) return;
    const currentUser = this.state.getCurrentUserName();
    const batch = writeBatch(this.fb.db);

    ids.forEach(id => {
      const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
      const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history'));

      batch.update(invRef, { stock: 0, lastUpdated: serverTimestamp() });

      batch.set(historyRef, {
        timestamp: serverTimestamp(),
        actionType: 'ADJUST',
        amountChange: 0, stockAfter: 0, reference: reason || 'Bulk Zero Out', user: currentUser
      } as StockHistoryItem);
    });

    // Add single global log for batch operation
    const globalLogRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
    batch.set(globalLogRef, {
      action: 'BULK_ZERO',
      details: `Đặt tồn kho về 0 cho ${ids.length} mục.`,
      timestamp: serverTimestamp(),
      user: currentUser,
      targetId: 'BATCH',
      reason: reason
    });

    await batch.commit();
  }
}
