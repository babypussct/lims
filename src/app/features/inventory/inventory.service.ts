
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { StateService } from '../../core/services/state.service';
import { 
  doc, setDoc, updateDoc, deleteDoc, getDoc,
  collection, addDoc, serverTimestamp, writeBatch,
  query, where, orderBy, limit, startAfter, getDocs, 
  QueryConstraint, QueryDocumentSnapshot, runTransaction, getCountFromServer, deleteField, Timestamp
} from 'firebase/firestore';
import { effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
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
  private auth = inject(AuthService);

  // ─── Delta Sync Cache ───────────────────────────────────────────────────────
  private readonly INV_CACHE_KEY       = 'lims_inv_list_cache';
  private readonly INV_SYNC_SECONDS_KEY = 'lims_inv_sync_seconds';

  private _memInventory: InventoryItem[] | null = null;

  constructor() {
    // Tự động dọn dẹp khi user logout
    effect(() => {
      const user = this.auth.currentUser();
      if (!user) {
        this._memInventory = null;
      }
    });
  }

  // ─── INVALIDATE CACHE ───────────────────────────────────────────────────────
  invalidateLocalInventoryCache(): void {
    this._memInventory = null;
    localStorage.removeItem(this.INV_SYNC_SECONDS_KEY);
  }

  // ─── OPTIMIZED READ Operations ──────────────────────────────────────────────

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

  async getLowStockItems(limitCount = 5): Promise<InventoryItem[]> {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
      const q = query(colRef, orderBy('stock', 'asc'), limit(limitCount * 4)); 
      
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));
      const lowItems = items.filter(i => i.stock <= (i.threshold || 5));
      
      return lowItems.slice(0, limitCount);
  }

  async getItemByGtin(gtin: string): Promise<InventoryItem | null> {
      if (!gtin) return null;
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
      
      // Try querying by GTIN field
      const qGtin = query(colRef, where('gtin', '==', gtin), limit(1));
      const snapGtin = await getDocs(qGtin);
      if (!snapGtin.empty) {
          return { id: snapGtin.docs[0].id, ...snapGtin.docs[0].data() } as InventoryItem;
      }

      // Fallback: try querying by ref_code (some systems store GTIN there)
      const qRef = query(colRef, where('ref_code', '==', gtin), limit(1));
      const snapRef = await getDocs(qRef);
      if (!snapRef.empty) {
          return { id: snapRef.docs[0].id, ...snapRef.docs[0].data() } as InventoryItem;
      }

      return null;
  }

  async getAllInventory(): Promise<InventoryItem[]> {
      return this.loadInventoryWithDeltaSync();
  }

  async loadInventoryWithDeltaSync(): Promise<InventoryItem[]> {
      if (this._memInventory !== null) {
          return this._memInventory;
      }

      const localItems = this._loadInvFromCache();
      const lastSyncSec = Number(localStorage.getItem(this.INV_SYNC_SECONDS_KEY) || 0);

      if (!localItems || lastSyncSec === 0) {
          // COLD START
          return await this._fetchAllInvAndCache();
      }

      // WARM START
      this._memInventory = localItems;

      try {
          const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
          const deltaSnap = await getDocs(query(
              colRef,
              where('lastUpdated', '>', Timestamp.fromMillis(lastSyncSec * 1000))
          ));

          if (!deltaSnap.empty) {
              const changed: InventoryItem[] = [];
              const deletedIds: string[] = [];

              deltaSnap.docs.forEach(d => {
                  const data = d.data();
                  if (data['_isDeleted'] === true || data['status'] === 'DELETED') {
                      deletedIds.push(d.id);
                  } else {
                      changed.push({ id: d.id, ...data } as InventoryItem);
                  }
              });

              this._mergeAndSaveInv(changed, deletedIds);
          }
      } catch (e) {
          console.warn('[InventoryService] Delta sync error, using cached data:', e);
      }

      return this._memInventory!;
  }

  private _mergeAndSaveInv(changed: InventoryItem[], deletedIds: string[]): void {
      if (!this._memInventory) return;

      let items = this._memInventory.filter(i => !deletedIds.includes(i.id));

      changed.forEach(newDoc => {
          const idx = items.findIndex(i => i.id === newDoc.id);
          if (idx >= 0) {
              items[idx] = newDoc;
          } else {
              items.unshift(newDoc);
          }
      });

      this._memInventory = items;
      this._saveInvToCache(items);
  }

  private async _fetchAllInvAndCache(): Promise<InventoryItem[]> {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
      const snap = await getDocs(colRef);
      const items: InventoryItem[] = snap.docs
          .filter(d => d.data()['_isDeleted'] !== true && d.data()['status'] !== 'DELETED')
          .map(d => ({ id: d.id, ...d.data() } as InventoryItem));
      
      this._saveInvToCache(items);
      this._memInventory = items;
      return items;
  }

  private _loadInvFromCache(): InventoryItem[] | null {
      try {
          const raw = localStorage.getItem(this.INV_CACHE_KEY);
          return raw ? (JSON.parse(raw) as InventoryItem[]) : null;
      } catch {
          return null;
      }
  }

  private _saveInvToCache(items: InventoryItem[]): void {
      try {
          localStorage.setItem(this.INV_CACHE_KEY, JSON.stringify(items));
          const maxSec = items.reduce((max, i) => {
              const sec = (i.lastUpdated as any)?.seconds ?? 0;
              return sec > max ? sec : max;
          }, 0);
          if (maxSec > 0) {
              localStorage.setItem(this.INV_SYNC_SECONDS_KEY, maxSec.toString());
          }
      } catch (e: any) {
          console.warn('[InventoryService] Cache write failed:', e?.name);
          try { localStorage.removeItem(this.INV_CACHE_KEY); } catch {}
      }
  }

  async getInventoryPage(
    pageSize: number, 
    lastDoc: QueryDocumentSnapshot | null, 
    filterType: string, 
    searchTerm: string
  ): Promise<InventoryPage> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
    const constraints: QueryConstraint[] = [];

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
      const q = query(ref, orderBy('timestamp', 'desc'), limit(500));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StockHistoryItem));
  }

  // --- TRANSACTIONAL WRITE Operations ---

  async upsertItem(itemData: InventoryItem, isNew = false, reason = '', oldStock = 0) {
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
                lastUpdated: serverTimestamp(),
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
                lastUpdated: serverTimestamp(),
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
            lastUpdated: serverTimestamp(),
            user: currentUser,
            targetId: item.id,
            reason: reason
        });
    });
    this.invalidateLocalInventoryCache();
    await this.fb.updateMetadata('inventory');
  }

  async deleteItem(id: string, reason = '') {
    const currentUser = this.state.getCurrentUserName();
    const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    const globalLogRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
    
    let finalStock = 0;
    try {
        const docSnap = await getDoc(invRef);
        if (docSnap.exists()) {
            finalStock = docSnap.data()['stock'] || 0;
        }
    } catch (e) { console.warn("Failed to get stock before delete", e); }

    // SOFT DELETE: We do not touch history sub-collections, just update the document
    const finalBatch = writeBatch(this.fb.db);
    finalBatch.update(invRef, {
        _isDeleted: true,
        status: 'DELETED',
        lastUpdated: serverTimestamp()
    });
    
    finalBatch.set(globalLogRef, {
        action: 'SOFT_DELETE_ITEM',
        details: `Đưa vào Thùng rác: ${id} (Tồn cuối: ${finalStock})`,
        timestamp: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        user: currentUser,
        targetId: id,
        reason: reason
    });

    await finalBatch.commit();
    this.invalidateLocalInventoryCache();
    // Delta Sync doesn't require updateMetadata if we listen to onSnapshot, but keeping it for legacy components
    await this.fb.updateMetadata('inventory');
  }

  async restoreItem(id: string) {
      const currentUser = this.state.getCurrentUserName();
      const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
      const globalLogRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
      
      const finalBatch = writeBatch(this.fb.db);
      finalBatch.update(invRef, {
          _isDeleted: deleteField(),
          status: 'ACTIVE',
          lastUpdated: serverTimestamp()
      });
      
      finalBatch.set(globalLogRef, {
          action: 'RESTORE_ITEM',
          details: `Khôi phục từ Thùng rác: ${id}`,
          timestamp: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          user: currentUser,
          targetId: id
      });
  
      await finalBatch.commit();
      this.invalidateLocalInventoryCache();
  }

  async updateStock(id: string, currentStock: number, adjustment: number, reason = '') {
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
            lastUpdated: serverTimestamp(),
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
            lastUpdated: serverTimestamp(),
            user: currentUser,
            targetId: id,
            reason: reason
        });
    });
    this.invalidateLocalInventoryCache();
    await this.fb.updateMetadata('inventory');
  }

  async bulkZeroStock(ids: string[], reason = '') {
    if (!ids || ids.length === 0) return;
    const currentUser = this.state.getCurrentUserName();
    const batch = writeBatch(this.fb.db);
    
    ids.forEach(id => {
      const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
      const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history'));
      
      batch.update(invRef, { stock: 0, lastUpdated: serverTimestamp() });
      
      batch.set(historyRef, {
          timestamp: serverTimestamp(),
          lastUpdated: serverTimestamp(),
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
        lastUpdated: serverTimestamp(),
        user: currentUser,
        targetId: 'BATCH',
        reason: reason
    });

    await batch.commit();
    this.invalidateLocalInventoryCache();
    await this.fb.updateMetadata('inventory');
  }
}
