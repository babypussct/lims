
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { StateService } from '../../core/services/state.service';
import { 
  doc, setDoc, updateDoc, deleteDoc, getDoc,
  collection, addDoc, serverTimestamp, writeBatch,
  query, where, orderBy, limit, startAfter, getDocs, 
  QueryConstraint, QueryDocumentSnapshot, QuerySnapshot, DocumentData, runTransaction, getCountFromServer, deleteField, documentId
} from 'firebase/firestore';
import { InventoryItem, StockHistoryItem } from '../../core/models/inventory.model';
import { ToastService } from '../../core/services/toast.service';
import { normalizeInventoryItem } from '../../shared/utils/utils';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
import { ActivityEventService } from '../../core/services/activity-event.service';
import { NotificationCenterService } from '../../core/services/notification-center.service';
import { crossedInventoryLowStockThreshold, resolveInventoryLowStockThreshold } from './inventory-low-stock';
import { AuthService } from '../../core/services/auth.service';


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
  private readMonitor = inject(FirestoreReadMonitor);
  private activityEvents = inject(ActivityEventService);
  private notificationCenter = inject(NotificationCenterService);
  private inFlightItemReads = new Map<string, Promise<InventoryItem[]>>();

  // ─── SINGLE SOURCE OF TRUTH ────────────────────────────────────────────────
  // getAllInventory() đọc từ state.inventory() signal (được cập nhật bởi DeltaSync
  // singleton trong state.service.ts). Không còn manual cache riêng.

  constructor() {}

  // ─── BACKWARD-COMPATIBLE STUB ─────────────────────────────────────────────
  // Xóa localStorage keys cũ nếu còn tồn tại từ version trước
  invalidateLocalInventoryCache(): void {
    localStorage.removeItem('lims_inv_list_cache_' + this.fb.APP_ID);
    localStorage.removeItem('lims_inv_sync_seconds_' + this.fb.APP_ID);
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

    const requestKey = validIds.slice().sort().join('\u001f');
    const existingRequest = this.inFlightItemReads.get(requestKey);
    if (existingRequest) return existingRequest;

    const request = this.fetchItemsByIds(validIds);
    this.inFlightItemReads.set(requestKey, request);
    void request.finally(() => {
      if (this.inFlightItemReads.get(requestKey) === request) {
        this.inFlightItemReads.delete(requestKey);
      }
    }).catch(() => {
      // The original caller receives the Firestore error; this cleanup branch
      // must not create a second unhandled rejection.
    });
    return request;
  }

  private async fetchItemsByIds(validIds: string[]): Promise<InventoryItem[]> {

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
            // Do not race a local timeout against Firestore: Promise.race would
            // release callers while the underlying read continued in the SDK,
            // allowing repeated clicks to create overlapping requests.
            const snapshot = await getDocs(q);
            this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory`, snapshot.size);
            snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() } as InventoryItem));
        } catch (e) {
            console.warn("Chunk fetch failed (skipping chunk):", chunk, e);
        }
    };

    await Promise.all(chunks.map(chunk => fetchChunk(chunk)));
    return results;
  }

  async getLowStockItems(limitCount = 5): Promise<InventoryItem[]> {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
      const q = query(colRef, orderBy('stock', 'asc'), limit(limitCount * 4)); 
      
      const snapshot = await getDocs(q);
      this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory`, snapshot.size);
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
      this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory`, snapGtin.size);
      if (!snapGtin.empty) {
          return { id: snapGtin.docs[0].id, ...snapGtin.docs[0].data() } as InventoryItem;
      }

      // Fallback: try querying by ref_code (some systems store GTIN there)
      const qRef = query(colRef, where('ref_code', '==', gtin), limit(1));
      const snapRef = await getDocs(qRef);
      this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory`, snapRef.size);
      if (!snapRef.empty) {
          return { id: snapRef.docs[0].id, ...snapRef.docs[0].data() } as InventoryItem;
      }

      return null;
  }

  // Đọc từ state.inventory() signal (single source of truth — DeltaSync managed)
  async getAllInventory(): Promise<InventoryItem[]> {
    return this.state.inventory();
  }

  /**
   * Reporting needs the persisted inventory snapshot, including soft-deleted
   * items that are intentionally filtered out of the operational state cache.
   * Keeping those rows is required to reconstruct historical N-X-T balances.
   */
  async getAllInventoryForReports(): Promise<InventoryItem[]> {
    if (!this.auth.canViewReports()) throw new Error('Bạn không có quyền xem dữ liệu kho của Báo Cáo.');

    const path = `artifacts/${this.fb.APP_ID}/inventory`;
    const colRef = collection(this.fb.db, path);
    const pageSize = 500;
    const items: InventoryItem[] = [];
    let cursor: QueryDocumentSnapshot | null = null;

    while (true) {
      const snapshot: QuerySnapshot<DocumentData> = await getDocs(query(
        colRef,
        orderBy(documentId()),
        ...(cursor ? [startAfter(cursor)] : []),
        limit(pageSize)
      ));
      this.readMonitor.record('getDocs', path, snapshot.size, {
        phase: 'report-inventory',
        fromCache: snapshot.metadata.fromCache
      });
      snapshot.forEach(document => items.push({ id: document.id, ...document.data() } as InventoryItem));
      if (snapshot.size < pageSize) break;
      cursor = snapshot.docs[snapshot.docs.length - 1];
    }

    return items;
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
    this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory`, snapshot.size);
    
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

  async getStockCard(itemId: string): Promise<StockHistoryItem[]> {
      const ref = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', itemId, 'history');
      const q = query(ref, orderBy('timestamp', 'desc'), limit(500));
      const snapshot = await getDocs(q);
      this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory/${itemId}/history`, snapshot.size);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StockHistoryItem));
  }

  // --- TRANSACTIONAL WRITE Operations ---

  async upsertItem(itemData: InventoryItem, isNew = false, reason = '', oldStock = 0) {
    // 1. NORMALIZE: Ensure Base Unit (ml, g)
    const item = normalizeInventoryItem(itemData);
    const currentUser = this.state.getCurrentUserName();

    const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.id);
    const globalLogRef = this.activityEvents.createRef();
    const lowStockActivityRef = this.activityEvents.createRef();
    const lowStockThreshold = resolveInventoryLowStockThreshold(item.threshold);
    const crossedLowStockThreshold = !isNew
      && crossedInventoryLowStockThreshold(oldStock, item.stock, lowStockThreshold);
    
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
            
        const activityEvent = this.activityEvents.build({
            eventId: globalLogRef.id,
            action,
            details,
            targetType: 'INVENTORY_ITEM',
            targetId: item.id,
            targetName: item.id,
            metadata: {
              oldValue: isNew ? undefined : oldStock,
              newValue: item.stock,
              unit: item.unit,
              reason
            },
            legacyFields: {
              reason,
              ...((isNew || item.stock !== oldStock) ? {
                inventoryDeltas: { [item.id]: isNew ? item.stock : item.stock - oldStock }
              } : {})
            }
        });
        this.activityEvents.setInTransaction(transaction, globalLogRef, activityEvent);

        if (crossedLowStockThreshold) {
            const lowStockEvent = this.activityEvents.build({
              eventId: lowStockActivityRef.id,
              action: 'INVENTORY_LOW_STOCK',
              details: `Tồn kho xuống ngưỡng thấp: ${item.id} còn ${item.stock} ${item.unit}`,
              targetType: 'INVENTORY_ITEM',
              targetId: item.id,
              targetName: item.id,
              metadata: {
                threshold: lowStockThreshold,
                oldValue: oldStock,
                newValue: item.stock,
                unit: item.unit,
                sourceAction: action
              }
            });
            this.activityEvents.setInTransaction(transaction, lowStockActivityRef, lowStockEvent);
        }
    });
    if (crossedLowStockThreshold) {
      await this.notificationCenter.dispatchActivityProjectionIfEnabled(lowStockActivityRef.id);
    }
    this.invalidateLocalInventoryCache();
    await this.fb.updateMetadata('inventory');
  }

  async deleteItem(id: string, reason = '') {
    const currentUser = this.state.getCurrentUserName();
    const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    const globalLogRef = this.activityEvents.createRef();
    
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
    
    const activityEvent = this.activityEvents.build({
        eventId: globalLogRef.id,
        action: 'SOFT_DELETE_ITEM',
        details: `Đưa vào Thùng rác: ${id} (Tồn cuối: ${finalStock})`,
        targetType: 'INVENTORY_ITEM',
        targetId: id,
        targetName: id,
        metadata: { oldValue: finalStock, reason },
        legacyFields: { reason }
    });
    this.activityEvents.setInBatch(finalBatch, globalLogRef, activityEvent);

    await finalBatch.commit();
    this.invalidateLocalInventoryCache();
    // Delta Sync doesn't require updateMetadata if we listen to onSnapshot, but keeping it for legacy components
    await this.fb.updateMetadata('inventory');
  }

  async restoreItem(id: string) {
      const currentUser = this.state.getCurrentUserName();
      const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
      const globalLogRef = this.activityEvents.createRef();
      
      const finalBatch = writeBatch(this.fb.db);
      finalBatch.update(invRef, {
          _isDeleted: deleteField(),
          status: 'ACTIVE',
          lastUpdated: serverTimestamp()
      });
      
      const activityEvent = this.activityEvents.build({
          eventId: globalLogRef.id,
          action: 'RESTORE_ITEM',
          details: `Khôi phục từ Thùng rác: ${id}`,
          targetType: 'INVENTORY_ITEM',
          targetId: id
      });
      this.activityEvents.setInBatch(finalBatch, globalLogRef, activityEvent);
  
      await finalBatch.commit();
      this.invalidateLocalInventoryCache();
  }

  async updateStock(id: string, _currentStock: number, adjustment: number, reason = '') {
    if (!Number.isFinite(adjustment)) throw new Error('Lượng điều chỉnh kho không hợp lệ.');
    const currentUser = this.state.getCurrentUserName();
    
    const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history'));
    const globalLogRef = this.activityEvents.createRef();
    const lowStockActivityRef = this.activityEvents.createRef();
    let crossedLowStockThreshold = false;

    await runTransaction(this.fb.db, async (transaction) => {
        const snapshot = await transaction.get(invRef);
        if (!snapshot.exists()) throw new Error(`Không tìm thấy vật tư "${id}".`);
        const freshStock = Number(snapshot.data()['stock'] || 0);
        const newStock = freshStock + adjustment;
        const threshold = resolveInventoryLowStockThreshold(snapshot.data()['threshold']);
        if (!Number.isFinite(newStock) || newStock < 0) {
            throw new Error(`Tồn kho "${id}" không đủ hoặc kết quả điều chỉnh không hợp lệ.`);
        }
        crossedLowStockThreshold = crossedInventoryLowStockThreshold(freshStock, newStock, threshold);

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
        const activityEvent = this.activityEvents.build({
            eventId: globalLogRef.id,
            action: actionType,
            details: `Điều chỉnh kho ${id}: ${adjustment > 0 ? '+' : ''}${adjustment}`,
            targetType: 'INVENTORY_ITEM',
            targetId: id,
            targetName: id,
            metadata: {
              oldValue: freshStock,
              newValue: newStock,
              reason
            },
            legacyFields: {
              reason,
              inventoryDeltas: { [id]: adjustment }
            }
        });
        this.activityEvents.setInTransaction(transaction, globalLogRef, activityEvent);

        if (crossedLowStockThreshold) {
          const lowStockEvent = this.activityEvents.build({
            eventId: lowStockActivityRef.id,
            action: 'INVENTORY_LOW_STOCK',
            details: `Tồn kho xuống ngưỡng thấp: ${id} còn ${newStock}`,
            targetType: 'INVENTORY_ITEM',
            targetId: id,
            targetName: id,
            metadata: {
              threshold,
              oldValue: freshStock,
              newValue: newStock,
              reason,
              sourceAction: actionType
            }
          });
          this.activityEvents.setInTransaction(transaction, lowStockActivityRef, lowStockEvent);
        }
    });
    if (crossedLowStockThreshold) {
      await this.notificationCenter.dispatchActivityProjectionIfEnabled(lowStockActivityRef.id);
    }
    this.invalidateLocalInventoryCache();
    await this.fb.updateMetadata('inventory');
  }

  async bulkZeroStock(ids: string[], reason = '') {
    if (!ids || ids.length === 0) return;
    const currentUser = this.state.getCurrentUserName();
    const globalLogRef = this.activityEvents.createRef();
    const uniqueIds = [...new Set(ids)];

    await runTransaction(this.fb.db, async transaction => {
      const rows: Array<{
        id: string;
        invRef: ReturnType<typeof doc>;
        stock: number;
        historyRef: ReturnType<typeof doc>;
      }> = [];
      for (const id of uniqueIds) {
        const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
        const snapshot = await transaction.get(invRef);
        if (!snapshot.exists()) throw new Error(`Không tìm thấy vật tư "${id}".`);
        rows.push({
          id,
          invRef,
          stock: Number(snapshot.data()['stock'] || 0),
          historyRef: doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history'))
        });
      }

      const inventoryDeltas: Record<string, number> = {};
      rows.forEach(row => {
        transaction.update(row.invRef, { stock: 0, lastUpdated: serverTimestamp() });
        transaction.set(row.historyRef, {
          timestamp: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          actionType: 'ADJUST',
          amountChange: -row.stock,
          stockAfter: 0,
          reference: reason || 'Bulk Zero Out',
          user: currentUser
        } as StockHistoryItem);
        if (row.stock !== 0) inventoryDeltas[row.id] = -row.stock;
      });

      const activityEvent = this.activityEvents.build({
        eventId: globalLogRef.id,
        action: 'BULK_ZERO',
        details: `Đặt tồn kho về 0 cho ${uniqueIds.length} mục.`,
        targetType: 'INVENTORY_BATCH',
        targetId: 'BATCH',
        metadata: { count: uniqueIds.length, reason },
        legacyFields: { reason, inventoryDeltas }
      });
      this.activityEvents.setInTransaction(transaction, globalLogRef, activityEvent);
    });
    await this.notificationCenter.dispatchActivityProjectionIfEnabled(globalLogRef.id);
    this.invalidateLocalInventoryCache();
    await this.fb.updateMetadata('inventory');
  }
}
