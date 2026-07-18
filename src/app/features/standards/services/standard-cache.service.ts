import { Injectable, inject, effect } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  collection, getDocs, getDoc, doc,
  Unsubscribe
} from 'firebase/firestore';
import { ReferenceStandard, StandardRequest } from '../../../core/models/standard.model';
import { DeltaSyncService } from '../../../core/services/delta-sync.service';
import { isFefoCandidate, parseStandardDate } from '../../../shared/utils/standard-fefo';

/**
 * StandardCacheService — Quản lý cache cho ReferenceStandards.
 *
 * v2: Dùng DeltaSyncService singleton mode thay vì tự quản lý listener.
 * Chiến lược cache:
 *  L1: DeltaSync memCache (in-memory, 0 reads, mất khi F5)
 *  L2: DeltaSync localStorage (0 reads, sống qua F5)
 *  L3: DeltaSync delta listener (chỉ đọc docs THAY ĐỔI kể từ cursor)
 */
@Injectable({ providedIn: 'root' })
export class StandardCacheService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  deltaSync = inject(DeltaSyncService);

  /** @deprecated Không dùng trực tiếp, chỉ để tương thích ngược */
  readonly STD_CACHE_KEY        = 'lims_std_list_cache';
  readonly STD_SYNC_SECONDS_KEY = 'lims_std_sync_seconds';

  // Key thực sự DeltaSync đang dùng (computed sau khi APP_ID sẵn sàng)
  get _deltaCacheKey()  { return 'lims_reference_standards_cache_'        + this.fb.APP_ID; }
  get _deltaCursorKey() { return 'lims_reference_standards_sync_seconds_' + this.fb.APP_ID; }

  // L1: In-memory — giờ quản lý bởi DeltaSync singleton
  // Giữ _memStandards chỉ cho fetchAllAndCache() (admin bulk operation)
  _memStandards: ReferenceStandard[] | null = null;

  // Trạng thái view (giữ lại khi Back từ detail)
  listState = {
    searchTerm: '',
    sortOption: 'received_desc',
    viewMode: '' as 'list' | 'grid' | ''
  };

  private _deltaSyncConfig() {
    return {
      cacheKey: this._deltaCacheKey,
      cursorKey: this._deltaCursorKey,
      collectionPath: `artifacts/${this.fb.APP_ID}/reference_standards`,
      maxCacheSize: 3000,
      orderByField: 'received_date',
      orderDirection: 'desc' as const,
      initialCollectionScan: true,
      isDeletedFn: (doc: any) => doc._isDeleted === true || doc.status === 'DELETED'
    };
  }

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (!user) this._cleanupOnLogout();
    });
  }

  // ─── Cleanup khi logout ──────────────────────────────────────────────────────
  private _cleanupOnLogout(): void {
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
  startRealtimeDeltaListener(cb: () => void): () => void {
    // Wrap void callback thành data callback để phù hợp DeltaSync API
    return this.deltaSync.startSingletonListener<ReferenceStandard>(
      this._deltaSyncConfig(),
      (_data) => cb()
    );
  }

  // ─── Delta Sync Listener (backward compat) ─────────────────────────────────
  listenToStandards(callback: (standards: ReferenceStandard[]) => void): Unsubscribe {
    const unregister = this.deltaSync.startSingletonListener<ReferenceStandard>(
      this._deltaSyncConfig(),
      (data) => callback(data)
    );
    // Trả về dưới dạng Unsubscribe để giữ type compatibility
    return unregister as unknown as Unsubscribe;
  }

  // ─── Cache Invalidation ──────────────────────────────────────────────────────
  /**
   * Xóa toàn bộ cache standards (memory + localStorage).
   * Buộc lần tải tiếp theo phải fetch lại từ Firestore.
   */
  invalidateLocalStandardsCache(): void {
    this._memStandards = null;
    this.deltaSync.destroySingleton(this._deltaCacheKey);
    this.deltaSync.clearCache(this._deltaCacheKey, this._deltaCursorKey);
    // Xóa cả key cũ (legacy)
    localStorage.removeItem(this.STD_SYNC_SECONDS_KEY);
    localStorage.removeItem(this.STD_CACHE_KEY);
  }

  /** @deprecated Dùng invalidateLocalStandardsCache() */
  invalidateStandardsCache(): void { this.invalidateLocalStandardsCache(); }

  // ─── Single Standard Lookup ──────────────────────────────────────────────────
  async getStandardById(stdId: string): Promise<ReferenceStandard | null> {
    const cached = this.deltaSync.getCache<ReferenceStandard>(this._deltaCacheKey);
    if (cached) {
      const found = cached.find(s => s.id === stdId);
      if (found) return found;
    }
    try {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards', stdId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const data = snap.data();
      if (data['_isDeleted'] === true || data['status'] === 'DELETED') return null;
      return { id: snap.id, ...data } as ReferenceStandard;
    } catch (e) {
      console.error('[StandardCacheService] getStandardById error:', e);
      return null;
    }
  }

  getAllStandardsFromCache(): ReferenceStandard[] {
    return this.deltaSync.getCache<ReferenceStandard>(this._deltaCacheKey) ?? [];
  }

  async getNearestExpiry(): Promise<ReferenceStandard | null> {
    let stds = this.deltaSync.getCache<ReferenceStandard>(this._deltaCacheKey);
    if (!stds || stds.length === 0) stds = await this.fetchAllAndCache();
    const active = stds.filter(standard =>
      isFefoCandidate(standard) &&
      parseStandardDate(standard.expiry_date) !== null
    );
    if (active.length > 0) {
      return [...active].sort((a, b) =>
        (parseStandardDate(a.expiry_date) || Number.MAX_SAFE_INTEGER) -
        (parseStandardDate(b.expiry_date) || Number.MAX_SAFE_INTEGER)
      )[0];
    }
    return null;
  }

  // ─── Optimistic Cache Update ────────────────────────────────────────────────
  /**
   * Merge changed/deleted docs vào cache ngay lập tức (optimistic update).
   * Dùng sau khi write Firestore để UI cập nhật tức thì, không chờ live listener.
   */
  _mergeAndSave(changed: ReferenceStandard[], deletedIds: string[]): void {
    const base = this.deltaSync.getCache<ReferenceStandard>(this._deltaCacheKey) ?? [];
    const items = base.filter(i => !deletedIds.includes(i.id));
    changed.forEach(newDoc => {
      const idx = items.findIndex(i => i.id === newDoc.id);
      if (idx >= 0) { items[idx] = newDoc; } else { items.unshift(newDoc); }
    });
    this._saveStdToCache(items);
  }

  // ─── Admin Bulk Operations ──────────────────────────────────────────────────
  async fetchAllAndCache(): Promise<ReferenceStandard[]> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    // Querying with orderBy excludes legacy documents that do not have received_date.
    const snap = await getDocs(colRef);
    const items: ReferenceStandard[] = snap.docs
      .filter(d => d.data()['_isDeleted'] !== true && d.data()['status'] !== 'DELETED')
      .map(d => ({ id: d.id, ...d.data() } as ReferenceStandard))
      .sort((a, b) => (b.received_date || '').localeCompare(a.received_date || ''));
    this._saveStdToCache(items);
    this._memStandards = items;
    return items;
  }

  private _saveStdToCache(items: ReferenceStandard[]): void {
    try {
      const json = JSON.stringify(items);
      localStorage.setItem(this._deltaCacheKey, json);
      localStorage.setItem(this.STD_CACHE_KEY, json); // legacy

      const maxSec = items.reduce((max, i) => {
        const sec = (i.lastUpdated as any)?.seconds ?? 0;
        return sec > max ? sec : max;
      }, 0);
      if (maxSec > 0) {
        localStorage.setItem(this._deltaCursorKey, maxSec.toString());
        localStorage.setItem(this.STD_SYNC_SECONDS_KEY, maxSec.toString()); // legacy
      }
    } catch (e: any) {
      console.warn('[StandardCacheService] Cache write failed:', e?.name);
      try { localStorage.removeItem(this._deltaCacheKey); } catch {}
    }
  }

  /** Purge 1 request khỏi localStorage cache (dùng cho ghost record) */
  purgeFromRequestsCache(requestId: string): void {
    const cacheKey = 'lims_all_standard_requests_cache_' + this.fb.APP_ID;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const items: StandardRequest[] = JSON.parse(raw);
        const filtered = items.filter(i => i.id !== requestId);
        if (filtered.length !== items.length) {
          localStorage.setItem(cacheKey, JSON.stringify(filtered));
        }
      }
    } catch (e) {
      console.warn('[StandardCacheService] purgeFromRequestsCache failed', e);
    }
  }
}
