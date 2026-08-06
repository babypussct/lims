import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { StateService } from '../../core/services/state.service';
import { doc, getDoc, collection, serverTimestamp, writeBatch, query, where, orderBy, limit, startAfter, getDocs, runTransaction, getCountFromServer, deleteField } from 'firebase/firestore';
import { ToastService } from '../../core/services/toast.service';
import { normalizeInventoryItem } from '../../shared/utils/utils';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
import * as i0 from "@angular/core";
export class InventoryService {
    // ─── SINGLE SOURCE OF TRUTH ────────────────────────────────────────────────
    // getAllInventory() đọc từ state.inventory() signal (được cập nhật bởi DeltaSync
    // singleton trong state.service.ts). Không còn manual cache riêng.
    constructor() {
        this.fb = inject(FirebaseService);
        this.state = inject(StateService);
        this.toast = inject(ToastService);
        this.readMonitor = inject(FirestoreReadMonitor);
        this.inFlightItemReads = new Map();
    }
    // ─── BACKWARD-COMPATIBLE STUB ─────────────────────────────────────────────
    // Xóa localStorage keys cũ nếu còn tồn tại từ version trước
    invalidateLocalInventoryCache() {
        localStorage.removeItem('lims_inv_list_cache_' + this.fb.APP_ID);
        localStorage.removeItem('lims_inv_sync_seconds_' + this.fb.APP_ID);
    }
    // ─── OPTIMIZED READ Operations ──────────────────────────────────────────────
    async getInventoryCount() {
        try {
            const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
            const snapshot = await getCountFromServer(colRef);
            return snapshot.data().count;
        }
        catch (e) {
            console.error("Count error:", e);
            return 0;
        }
    }
    async getItemsByIds(ids) {
        if (!ids || ids.length === 0)
            return [];
        const validIds = [...new Set(ids)].filter(id => {
            if (!id || typeof id !== 'string')
                return false;
            const trimmed = id.trim();
            return trimmed.length > 0 && !trimmed.includes('/');
        });
        if (validIds.length === 0)
            return [];
        const requestKey = validIds.slice().sort().join('\u001f');
        const existingRequest = this.inFlightItemReads.get(requestKey);
        if (existingRequest)
            return existingRequest;
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
    async fetchItemsByIds(validIds) {
        const chunks = [];
        const chunkSize = 30;
        for (let i = 0; i < validIds.length; i += chunkSize) {
            chunks.push(validIds.slice(i, i + chunkSize));
        }
        const results = [];
        const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
        const fetchChunk = async (chunk) => {
            try {
                const q = query(colRef, where('__name__', 'in', chunk));
                // Do not race a local timeout against Firestore: Promise.race would
                // release callers while the underlying read continued in the SDK,
                // allowing repeated clicks to create overlapping requests.
                const snapshot = await getDocs(q);
                this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory`, snapshot.size);
                snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            }
            catch (e) {
                console.warn("Chunk fetch failed (skipping chunk):", chunk, e);
            }
        };
        await Promise.all(chunks.map(chunk => fetchChunk(chunk)));
        return results;
    }
    async getLowStockItems(limitCount = 5) {
        const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
        const q = query(colRef, orderBy('stock', 'asc'), limit(limitCount * 4));
        const snapshot = await getDocs(q);
        this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory`, snapshot.size);
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const lowItems = items.filter(i => i.stock <= (i.threshold || 5));
        return lowItems.slice(0, limitCount);
    }
    async getItemByGtin(gtin) {
        if (!gtin)
            return null;
        const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
        // Try querying by GTIN field
        const qGtin = query(colRef, where('gtin', '==', gtin), limit(1));
        const snapGtin = await getDocs(qGtin);
        this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory`, snapGtin.size);
        if (!snapGtin.empty) {
            return { id: snapGtin.docs[0].id, ...snapGtin.docs[0].data() };
        }
        // Fallback: try querying by ref_code (some systems store GTIN there)
        const qRef = query(colRef, where('ref_code', '==', gtin), limit(1));
        const snapRef = await getDocs(qRef);
        this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory`, snapRef.size);
        if (!snapRef.empty) {
            return { id: snapRef.docs[0].id, ...snapRef.docs[0].data() };
        }
        return null;
    }
    // Đọc từ state.inventory() signal (single source of truth — DeltaSync managed)
    async getAllInventory() {
        return this.state.inventory();
    }
    async getInventoryPage(pageSize, lastDoc, filterType, searchTerm) {
        const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory');
        const constraints = [];
        if (searchTerm) {
            const term = searchTerm.trim();
            constraints.push(where('id', '>=', term));
            constraints.push(where('id', '<=', term + '\uf8ff'));
            constraints.push(orderBy('id'));
        }
        else {
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
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
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
    async getLogsByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const logsRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs');
        const q = query(logsRef, where('timestamp', '>=', start), where('timestamp', '<=', end), orderBy('timestamp', 'asc'));
        const snapshot = await getDocs(q);
        this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/logs`, snapshot.size);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    async getStockCard(itemId) {
        const ref = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', itemId, 'history');
        const q = query(ref, orderBy('timestamp', 'desc'), limit(500));
        const snapshot = await getDocs(q);
        this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/inventory/${itemId}/history`, snapshot.size);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    // --- TRANSACTIONAL WRITE Operations ---
    async upsertItem(itemData, isNew = false, reason = '', oldStock = 0) {
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
                const historyEntry = {
                    timestamp: serverTimestamp(),
                    lastUpdated: serverTimestamp(),
                    actionType: 'CREATE',
                    amountChange: item.stock,
                    stockAfter: item.stock,
                    reference: reason || 'Khởi tạo',
                    user: currentUser
                };
                transaction.set(historyRef, historyEntry);
            }
            else if (item.stock !== oldStock) {
                const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.id, 'history'));
                const historyEntry = {
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
    async deleteItem(id, reason = '') {
        const currentUser = this.state.getCurrentUserName();
        const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
        const globalLogRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
        let finalStock = 0;
        try {
            const docSnap = await getDoc(invRef);
            if (docSnap.exists()) {
                finalStock = docSnap.data()['stock'] || 0;
            }
        }
        catch (e) {
            console.warn("Failed to get stock before delete", e);
        }
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
    async restoreItem(id) {
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
    async updateStock(id, _currentStock, adjustment, reason = '') {
        if (!Number.isFinite(adjustment))
            throw new Error('Lượng điều chỉnh kho không hợp lệ.');
        const currentUser = this.state.getCurrentUserName();
        const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
        const historyRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id, 'history'));
        const globalLogRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
        await runTransaction(this.fb.db, async (transaction) => {
            const snapshot = await transaction.get(invRef);
            if (!snapshot.exists())
                throw new Error(`Không tìm thấy vật tư "${id}".`);
            const freshStock = Number(snapshot.data()['stock'] || 0);
            const newStock = freshStock + adjustment;
            if (!Number.isFinite(newStock) || newStock < 0) {
                throw new Error(`Tồn kho "${id}" không đủ hoặc kết quả điều chỉnh không hợp lệ.`);
            }
            // A. Update Stock
            transaction.update(invRef, { stock: newStock, lastUpdated: serverTimestamp() });
            // B. Write History
            const historyEntry = {
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
    async bulkZeroStock(ids, reason = '') {
        if (!ids || ids.length === 0)
            return;
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
            });
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
    static { this.ɵfac = function InventoryService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || InventoryService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: InventoryService, factory: InventoryService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InventoryService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
//# sourceMappingURL=inventory.service.js.map