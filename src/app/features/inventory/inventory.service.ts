
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
import { Log, LogDiff } from '../../core/models/log.model';

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

  /**
   * Lấy tổng số lượng item trong kho (dùng cho thống kê dashboard)
   */
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

  /**
   * Lấy danh sách item theo mảng ID (dùng cho Calculator)
   * Tự động chia nhỏ batch nếu > 30 items
   * FIX: Added 5s Timeout to prevent infinite loading loops.
   */
  async getItemsByIds(ids: string[]): Promise<InventoryItem[]> {
    if (!ids || ids.length === 0) return [];
    
    // 1. Sanitize IDs: Remove empty, duplicates, and invalid chars ('/')
    const validIds = [...new Set(ids)].filter(id => {
        if (!id || typeof id !== 'string') return false;
        const trimmed = id.trim();
        return trimmed.length > 0 && !trimmed.includes('/'); 
    });

    if (validIds.length === 0) return [];
    
    const chunks = [];
    const chunkSize = 30; // Firestore 'in' limit

    for (let i = 0; i < validIds.length; i += chunkSize) {
        chunks.push(validIds.slice(i, i + chunkSize));
    }

    const results: InventoryItem[] = [];
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');

    // Helper to fetch one chunk with timeout
    const fetchChunk = async (chunk: string[]) => {
        try {
            // Using '__name__' is often safer for document ID queries in some contexts
            const q = query(colRef, where('__name__', 'in', chunk));
            
            // Race between fetch and a 5-second timeout
            const snapshot = await Promise.race([
                getDocs(q),
                new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout fetching inventory')), 5000)
                )
            ]);

            snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() } as InventoryItem));
        } catch (e) {
            console.warn("Chunk fetch failed or timed out (skipping chunk):", chunk, e);
            // We catch errors here to ensure partial results are returned instead of throwing
        }
    };

    // Execute all chunks
    await Promise.all(chunks.map(chunk => fetchChunk(chunk)));
    
    return results;
  }

  /**
   * Lấy danh sách sắp hết hàng (dùng cho Dashboard)
   */
  async getLowStockItems(limitCount: number = 5): Promise<InventoryItem[]> {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
      // Simple query: Lowest absolute stock first.
      const q = query(colRef, orderBy('stock', 'asc'), limit(limitCount * 4)); 
      
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));
      
      // Filter client-side để chính xác với threshold của từng item
      const lowItems = items.filter(i => i.stock <= (i.threshold || 5));
      
      return lowItems.slice(0, limitCount);
  }

  /**
   * Lấy TOÀN BỘ kho (Chỉ dùng cho Báo cáo NXT hoặc Phân tích Năng lực)
   * Cẩn thận khi dùng hàm này.
   */
  async getAllInventory(): Promise<InventoryItem[]> {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));
  }

  /**
   * Phân trang danh sách kho (Main List)
   */
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
    // Client-side filtering for 'low' if not searching (since threshold is dynamic)
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
    const start = new Date(startDate); start.setHours(0,0,0,0);
    const end = new Date(endDate); end.setHours(23,59,59,999);

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

  // --- WRITE Operations (With Audit) ---

  async upsertItem(item: InventoryItem, isNew: boolean = false, reason: string = '') {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.id);
    
    await runTransaction(this.fb.db, async (transaction) => {
        transaction.set(ref, { ...item, lastUpdated: serverTimestamp() }, { merge: true });
        if (isNew) {
            const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.id, 'history'));
            const historyEntry: StockHistoryItem = {
                timestamp: serverTimestamp(),
                actionType: 'CREATE',
                amountChange: item.stock,
                stockAfter: item.stock,
                reference: 'Khởi tạo',
                user: this.state.getCurrentUserName()
            };
            transaction.set(historyRef, historyEntry);
        }
    });
    
    if (isNew) {
      await this.logAction('CREATE_ITEM', `Tạo mới hóa chất: ${item.id}`, item.id, reason);
    } else {
      await this.logAction('UPDATE_INFO', `Cập nhật: ${item.id}`, item.id, reason);
    }
  }

  async deleteItem(id: string, reason: string = '') {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    await deleteDoc(ref);
    await this.logAction('DELETE_ITEM', `Xóa hóa chất: ${id}`, id, reason);
  }

  async updateStock(id: string, currentStock: number, adjustment: number, reason: string = '') {
    const newStock = currentStock + adjustment;
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    const currentUser = this.state.getCurrentUserName();

    await runTransaction(this.fb.db, async (transaction) => {
        transaction.update(ref, { stock: newStock, lastUpdated: serverTimestamp() });
        const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history'));
        const historyEntry: StockHistoryItem = {
            timestamp: serverTimestamp(),
            actionType: adjustment > 0 ? 'IMPORT' : 'EXPORT',
            amountChange: adjustment,
            stockAfter: newStock,
            reference: reason || 'Cập nhật nhanh',
            user: currentUser
        };
        transaction.set(historyRef, historyEntry);
    });

    const actionType = adjustment > 0 ? 'STOCK_IN' : 'STOCK_OUT';
    await this.logAction(actionType, `Điều chỉnh kho ${id}: ${adjustment > 0 ? '+' : ''}${adjustment}`, id, reason);
  }

  async bulkZeroStock(ids: string[], reason: string = '') {
    if (!ids || ids.length === 0) return;
    const batch = writeBatch(this.fb.db);
    const currentUser = this.state.getCurrentUserName();
    ids.forEach(id => {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
      const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history'));
      batch.update(ref, { stock: 0, lastUpdated: serverTimestamp() });
      batch.set(historyRef, {
          timestamp: serverTimestamp(),
          actionType: 'ADJUST',
          amountChange: 0, stockAfter: 0, reference: reason || 'Bulk Zero Out', user: currentUser
      } as StockHistoryItem);
    });
    await batch.commit();
    await this.logAction('BULK_ZERO', `Đặt tồn kho về 0 cho ${ids.length} mục.`, 'BATCH', reason);
  }

  private async logAction(action: string, details: string, targetId?: string, reason?: string) {
    try {
      const currentUser = this.state.getCurrentUserName();
      const logData: any = { action, details, timestamp: serverTimestamp(), user: currentUser };
      if (targetId) logData.targetId = targetId;
      if (reason) logData.reason = reason;
      await addDoc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'), logData);
    } catch (e) { console.error('Log error', e); }
  }
}
