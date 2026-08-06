import { Injectable, inject, effect } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { buildScopedDeltaKey, DeltaSyncService } from '../../../core/services/delta-sync.service';
import { isFefoCandidate, parseStandardDate } from '../../../shared/utils/standard-fefo';
import { timestampToMillis } from '../../../shared/utils/timestamp';
import * as i0 from "@angular/core";
/**
 * StandardCacheService — Quản lý cache cho ReferenceStandards.
 *
 * v2: Dùng DeltaSyncService singleton mode thay vì tự quản lý listener.
 * Chiến lược cache:
 *  L1: DeltaSync memCache (in-memory, 0 reads, mất khi F5)
 *  L2: DeltaSync localStorage (0 reads, sống qua F5)
 *  L3: DeltaSync delta listener (chỉ đọc docs THAY ĐỔI kể từ cursor)
 */
export class StandardCacheService {
    // Key thực sự DeltaSync đang dùng (computed sau khi APP_ID sẵn sàng)
    get _deltaCacheKey() {
        return buildScopedDeltaKey('lims_reference_standards_cache_' + this.fb.APP_ID, this.auth.getDeltaCacheScope());
    }
    get _deltaCursorKey() {
        return buildScopedDeltaKey('lims_reference_standards_sync_seconds_' + this.fb.APP_ID, this.auth.getDeltaCacheScope());
    }
    _deltaSyncConfig() {
        return {
            cacheKey: this._deltaCacheKey,
            cursorKey: this._deltaCursorKey,
            collectionPath: `artifacts/${this.fb.APP_ID}/reference_standards`,
            // Giữ toàn bộ danh mục trong L1 để tìm khóa import/idempotency chính xác.
            // localStorage có thể từ chối ở quy mô lớn, nhưng DeltaSync vẫn giữ L1 và
            // tự phục hồi từ Firestore thay vì âm thầm cắt danh mục ở 3.000 bản ghi.
            maxCacheSize: 10000,
            // OPTIMIZED (sau migration lastUpdated): cursor-based delta sync
            // Lần đầu: fetch toàn collection 1 lần → ghi cursor lastUpdated
            // Các lần sau: chỉ fetch docs có lastUpdated > cursor (~95% tiết kiệm reads)
            orderByField: 'lastUpdated',
            orderDirection: 'desc',
            initialCollectionScan: false,
            isDeletedFn: (doc) => doc._isDeleted === true || doc.status === 'DELETED'
        };
    }
    constructor() {
        this.fb = inject(FirebaseService);
        this.auth = inject(AuthService);
        this.deltaSync = inject(DeltaSyncService);
        /** @deprecated Không dùng trực tiếp, chỉ để tương thích ngược */
        this.STD_CACHE_KEY = 'lims_std_list_cache';
        this.STD_SYNC_SECONDS_KEY = 'lims_std_sync_seconds';
        // L1: In-memory — giờ quản lý bởi DeltaSync singleton
        // Giữ _memStandards chỉ cho fetchAllAndCache() (admin bulk operation)
        this._memStandards = null;
        // Trạng thái view (giữ lại khi Back từ detail)
        this.listState = {
            searchTerm: '',
            sortOption: 'received_desc',
            viewMode: ''
        };
        effect(() => {
            const user = this.auth.currentUser();
            if (!user)
                this._cleanupOnLogout();
        });
    }
    // ─── Cleanup khi logout ──────────────────────────────────────────────────────
    _cleanupOnLogout() {
        this.deltaSync.destroySingleton(this._deltaCacheKey);
        this._memStandards = null;
    }
    // ─── Singleton Listener (thay thế cả startRealtimeDeltaListener + listenToStandards) ──
    /**
     * Subscribe vào DeltaSync singleton cho reference_standards.
     *
     * Trước v2: Có 2 listener riêng biệt:
     *  - startRealtimeDeltaListener() → singleton tự xây (lastUpdated > now)
     *  - listenToStandards() → DeltaSync classic (cursor-based)
     * → 2 listener cho 1 collection = lãng phí.
     *
     * Sau v2: 1 singleton duy nhất, cursor-based, in-memory cache.
     */
    startRealtimeDeltaListener(cb) {
        // Wrap void callback thành data callback để phù hợp DeltaSync API
        return this.deltaSync.startSingletonListener(this._deltaSyncConfig(), (_data) => cb());
    }
    // ─── Delta Sync Listener (backward compat) ─────────────────────────────────
    listenToStandards(callback) {
        const unregister = this.deltaSync.startSingletonListener(this._deltaSyncConfig(), (data) => callback(data));
        // Trả về dưới dạng Unsubscribe để giữ type compatibility
        return unregister;
    }
    // ─── Cache Invalidation ──────────────────────────────────────────────────────
    /**
     * Xóa toàn bộ cache standards (memory + localStorage).
     * Buộc lần tải tiếp theo phải fetch lại từ Firestore.
     */
    invalidateLocalStandardsCache() {
        this._memStandards = null;
        this.deltaSync.destroySingleton(this._deltaCacheKey);
        this.deltaSync.clearCache(this._deltaCacheKey, this._deltaCursorKey);
        // Xóa cả key cũ (legacy)
        localStorage.removeItem(this.STD_SYNC_SECONDS_KEY);
        localStorage.removeItem(this.STD_CACHE_KEY);
    }
    /** @deprecated Dùng invalidateLocalStandardsCache() */
    invalidateStandardsCache() { this.invalidateLocalStandardsCache(); }
    // ─── Single Standard Lookup ──────────────────────────────────────────────────
    async getStandardById(stdId) {
        const cached = this.deltaSync.getCache(this._deltaCacheKey);
        if (cached) {
            const found = cached.find(s => s.id === stdId);
            if (found)
                return found;
        }
        try {
            const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards', stdId);
            const snap = await getDoc(ref);
            if (!snap.exists())
                return null;
            const data = snap.data();
            if (data['_isDeleted'] === true || data['status'] === 'DELETED')
                return null;
            return { id: snap.id, ...data };
        }
        catch (e) {
            console.error('[StandardCacheService] getStandardById error:', e);
            return null;
        }
    }
    getAllStandardsFromCache() {
        return this.deltaSync.getCache(this._deltaCacheKey) ?? [];
    }
    async getNearestExpiry() {
        if (!this.auth.canViewStandards())
            return null;
        let stds = this.deltaSync.getCache(this._deltaCacheKey);
        if (!stds || stds.length === 0)
            stds = await this.fetchAllAndCache();
        const active = stds.filter(standard => isFefoCandidate(standard) &&
            parseStandardDate(standard.expiry_date) !== null);
        if (active.length > 0) {
            return [...active].sort((a, b) => (parseStandardDate(a.expiry_date) || Number.MAX_SAFE_INTEGER) -
                (parseStandardDate(b.expiry_date) || Number.MAX_SAFE_INTEGER))[0];
        }
        return null;
    }
    // ─── Optimistic Cache Update ────────────────────────────────────────────────
    /**
     * Merge changed/deleted docs vào cache ngay lập tức (optimistic update).
     * Dùng sau khi write Firestore để UI cập nhật tức thì, không chờ live listener.
     */
    _mergeAndSave(changed, deletedIds) {
        const items = this.deltaSync.mergeSingletonCache(this._deltaCacheKey, changed, deletedIds);
        this._memStandards = items;
    }
    // ─── Admin Bulk Operations ──────────────────────────────────────────────────
    async fetchAllAndCache() {
        const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
        // Querying with orderBy excludes legacy documents that do not have received_date.
        const snap = await getDocs(colRef);
        const items = snap.docs
            .filter(d => d.data()['_isDeleted'] !== true && d.data()['status'] !== 'DELETED')
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (b.received_date || '').localeCompare(a.received_date || ''));
        this._saveStdToCache(items);
        this._memStandards = items;
        return items;
    }
    _saveStdToCache(items) {
        try {
            const json = JSON.stringify(items);
            localStorage.setItem(this._deltaCacheKey, json);
            const maxMillis = items.reduce((max, item) => {
                const millis = timestampToMillis(item.lastUpdated) ?? 0;
                return millis > max ? millis : max;
            }, 0);
            if (maxMillis > 0) {
                localStorage.setItem(this._deltaCursorKey, maxMillis.toString());
            }
        }
        catch (e) {
            console.warn('[StandardCacheService] Cache write failed:', e?.name);
            try {
                localStorage.removeItem(this._deltaCacheKey);
            }
            catch { }
        }
    }
    static { this.ɵfac = function StandardCacheService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardCacheService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: StandardCacheService, factory: StandardCacheService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardCacheService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
//# sourceMappingURL=standard-cache.service.js.map