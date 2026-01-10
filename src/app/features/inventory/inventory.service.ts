
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { StateService } from '../../core/services/state.service';
import { 
  doc, setDoc, updateDoc, deleteDoc, 
  collection, addDoc, serverTimestamp, writeBatch,
  query, where, orderBy, limit, startAfter, getDocs, 
  QueryConstraint, QueryDocumentSnapshot, runTransaction 
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

  // --- HELPER: Audit Diff Generator ---
  private generateDiff(oldItem: InventoryItem, newItem: InventoryItem): LogDiff[] {
      const diffs: LogDiff[] = [];
      const keys = ['name', 'stock', 'unit', 'category', 'threshold', 'location', 'supplier', 'notes'];
      
      keys.forEach(key => {
          const k = key as keyof InventoryItem;
          // Loose equality check for simple types
          if (oldItem[k] != newItem[k]) {
              diffs.push({
                  field: key,
                  oldValue: oldItem[k] ?? '(empty)',
                  newValue: newItem[k] ?? '(empty)'
              });
          }
      });
      return diffs;
  }

  // --- READ Operations (Paginated) ---

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
    
    // Retrieve old state for Diff (if not new)
    let diffs: LogDiff[] = [];
    if (!isNew) {
        const oldItem = this.state.inventoryMap()[item.id];
        if (oldItem) {
            diffs = this.generateDiff(oldItem, item);
        }
    }

    await runTransaction(this.fb.db, async (transaction) => {
        // Main Update
        transaction.set(ref, { ...item, lastUpdated: serverTimestamp() }, { merge: true });

        // History Log (Only if new, or if stock specifically changed via edit modal)
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
    
    this.state.updateLocalInventoryItem(item);

    if (isNew) {
      await this.logAction('CREATE_ITEM', `Tạo mới hóa chất: ${item.id}`, item.id, reason, []);
    } else if (diffs.length > 0) {
      const details = diffs.map(d => `${d.field}: ${d.oldValue} -> ${d.newValue}`).join(', ');
      await this.logAction('UPDATE_INFO', `Cập nhật: ${details}`, item.id, reason, diffs);
    }
  }

  async deleteItem(id: string, reason: string = '') {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    await deleteDoc(ref);
    this.state.deleteLocalInventoryItem(id);
    await this.logAction('DELETE_ITEM', `Xóa hóa chất: ${id}`, id, reason);
  }

  async updateStock(id: string, currentStock: number, adjustment: number, reason: string = '') {
    const newStock = currentStock + adjustment;
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    
    const currentUser = this.state.getCurrentUserName();

    await runTransaction(this.fb.db, async (transaction) => {
        // 1. Update Stock
        transaction.update(ref, { 
          stock: newStock,
          lastUpdated: serverTimestamp()
        });

        // 2. Add History
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

    const cachedItem = this.state.inventoryMap()[id];
    if (cachedItem) {
        this.state.updateLocalInventoryItem({ ...cachedItem, stock: newStock });
    }

    const actionType = adjustment > 0 ? 'STOCK_IN' : 'STOCK_OUT';
    const diffs: LogDiff[] = [{ field: 'stock', oldValue: currentStock, newValue: newStock }];
    
    await this.logAction(
        actionType, 
        `Điều chỉnh kho ${id}: ${adjustment > 0 ? '+' : ''}${adjustment} -> Tồn: ${newStock}`, 
        id, 
        reason,
        diffs
    );
  }

  async bulkZeroStock(ids: string[], reason: string = '') {
    if (!ids || ids.length === 0) return;

    const batch = writeBatch(this.fb.db);
    const currentUser = this.state.getCurrentUserName();
    
    ids.forEach(id => {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
      const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history'));
      
      batch.update(ref, { 
        stock: 0, 
        lastUpdated: serverTimestamp() 
      });

      batch.set(historyRef, {
          timestamp: serverTimestamp(),
          actionType: 'ADJUST',
          amountChange: 0, 
          stockAfter: 0,
          reference: reason || 'Bulk Zero Out',
          user: currentUser
      } as StockHistoryItem);
      
      const cached = this.state.inventoryMap()[id];
      if(cached) {
          this.state.updateLocalInventoryItem({...cached, stock: 0});
      }
    });

    await batch.commit();
    await this.logAction('BULK_ZERO', `Đặt tồn kho về 0 cho ${ids.length} mục.`, 'BATCH', reason);
  }

  // --- Enhanced Logging ---
  private async logAction(action: string, details: string, targetId?: string, reason?: string, diff?: LogDiff[]) {
    try {
      // Ensure we get the latest user from state
      const currentUser = this.state.getCurrentUserName();
      
      const logData: any = {
        action,
        details,
        timestamp: serverTimestamp(),
        user: currentUser // Removed "|| 'Admin'" to allow StateService to handle fallback
      };
      
      // Add optional ISO fields
      if (targetId) logData.targetId = targetId;
      if (reason) logData.reason = reason;
      if (diff) logData.diff = diff;

      await addDoc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'), logData);
    } catch (e) {
      console.error('Log error', e);
    }
  }
}
