import { Injectable, inject, effect } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  collection, getDocs, getDoc, doc, query, orderBy,
  onSnapshot, Unsubscribe, where, Timestamp
} from 'firebase/firestore';
import { ReferenceStandard, StandardRequest } from '../../../core/models/standard.model';
import { DeltaSyncService } from '../../../core/services/delta-sync.service';

/**
 * StandardCacheService — Quản lý Delta Sync 3 lớp cho ReferenceStandards.
 * 
 * Chiến lược cache:
 *  L1: _memStandards (in-memory, 0 reads, mất khi F5)
 *  L2: localStorage (0 reads, sống qua F5)
 *  L3: getDocs delta (chỉ đọc docs THAY ĐỔI kể từ lần đồng bộ cuối)
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

  // L1: In-memory (0 reads, mất khi F5)
  _memStandards: ReferenceStandard[] | null = null;

  // Live listener singleton
  private _liveUnsub?: Unsubscribe;
  private _liveCallbacks: Array<() => void> = [];

  // Trạng thái view (giữ lại khi Back từ detail)
  listState = {
    searchTerm: '',
    sortOption: 'received_desc',
    viewMode: '' as 'list' | 'grid' | ''
  };

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (!user) this._cleanupOnLogout();
    });
  }

  // ─── Cleanup khi logout ──────────────────────────────────────────────────────
  private _cleanupOnLogout(): void {
    if (this._liveUnsub) {
      this._liveUnsub();
      this._liveUnsub = undefined;
    }
    this._liveCallbacks = [];
    this._memStandards = null;
  }

  // ─── Live Listener Singleton ─────────────────────────────────────────────────
  startRealtimeDeltaListener(cb: () => void): () => void {
    this._liveCallbacks.push(cb);

    if (!this._liveUnsub) {
      const startTime = Timestamp.now();
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
      const q = query(colRef, where('lastUpdated', '>', startTime));

      this._liveUnsub = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) return;
        const changed: ReferenceStandard[] = [];
        const deletedIds: string[] = [];
        snapshot.docChanges().forEach(change => {
          const data = change.doc.data();
          if (data['_isDeleted'] === true || data['status'] === 'DELETED') {
            deletedIds.push(change.doc.id);
          } else {
            changed.push({ id: change.doc.id, ...data } as ReferenceStandard);
          }
        });
        this._mergeAndSave(changed, deletedIds);
        this._liveCallbacks.forEach(fn => fn());
      }, (err) => {
        console.warn('[StandardCacheService] Live listener error:', err.code);
        if (err.code === 'permission-denied' || err.code === 'unauthenticated') {
          if (this._liveUnsub) { this._liveUnsub(); this._liveUnsub = undefined; }
          this._liveCallbacks = [];
        }
      });
    }

    return () => {
      this._liveCallbacks = this._liveCallbacks.filter(fn => fn !== cb);
    };
  }

  // ─── Delta Sync Listener ─────────────────────────────────────────────────────
  listenToStandards(callback: (standards: ReferenceStandard[]) => void): Unsubscribe {
    return this.deltaSync.startListener<ReferenceStandard>({
      cacheKey: 'lims_reference_standards_cache_' + this.fb.APP_ID,
      cursorKey: 'lims_reference_standards_sync_seconds_' + this.fb.APP_ID,
      collectionPath: `artifacts/${this.fb.APP_ID}/reference_standards`,
      maxCacheSize: 3000,
      orderByField: 'received_date',
      orderDirection: 'desc'
    }, callback);
  }

  // ─── Cache Invalidation ──────────────────────────────────────────────────────
  /**
   * Xóa toàn bộ cache standards (memory + localStorage).
   * Buộc lần tải tiếp theo phải fetch lại từ Firestore.
   */
  invalidateLocalStandardsCache(): void {
    this._memStandards = null;
    // Xóa cả key cũ (legacy) lẫn key thực sự DeltaSync đang dùng
    localStorage.removeItem(this.STD_SYNC_SECONDS_KEY);  // legacy
    localStorage.removeItem(this._deltaCacheKey);         // DeltaSync data
    localStorage.removeItem(this._deltaCursorKey);        // DeltaSync cursor
  }

  /** @deprecated Dùng invalidateLocalStandardsCache() */
  invalidateStandardsCache(): void { this.invalidateLocalStandardsCache(); }

  // ─── Single Standard Lookup ──────────────────────────────────────────────────
  async getStandardById(stdId: string): Promise<ReferenceStandard | null> {
    const cached = this.deltaSync.getCache<ReferenceStandard>('lims_reference_standards_cache_' + this.fb.APP_ID);
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
    return this.deltaSync.getCache<ReferenceStandard>('lims_reference_standards_cache_' + this.fb.APP_ID) ?? [];
  }

  async getNearestExpiry(): Promise<ReferenceStandard | null> {
    try {
      const stds = this.deltaSync.getCache<ReferenceStandard>('lims_reference_standards_cache_' + this.fb.APP_ID);
      const active = stds.filter(s => s.expiry_date && s.expiry_date !== '' && !s._isDeleted);
      if (active.length > 0) {
        return active.sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime())[0];
      }
      return null;
    } catch { return null; }
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────
  /**
   * Merge changed/deleted docs vào memory và localStorage.
   * Nếu _memStandards chưa được khởi tạo, chỉ cập nhật localStorage
   * để tránh mất update từ live listener khi component chưa load xong.
   */
  _mergeAndSave(changed: ReferenceStandard[], deletedIds: string[]): void {
    // Lấy dữ liệu hiện tại: ưu tiên memory, fallback sang localStorage
    const base: ReferenceStandard[] =
      this._memStandards ?? (
        this.deltaSync.getCache<ReferenceStandard>(this._deltaCacheKey) ?? []
      );

    let items = base.filter(i => !deletedIds.includes(i.id));
    changed.forEach(newDoc => {
      const idx = items.findIndex(i => i.id === newDoc.id);
      if (idx >= 0) { items[idx] = newDoc; } else { items.unshift(newDoc); }
    });

    // Cập nhật memory chỉ khi đã được khởi tạo (tránh dùng stale list rỗng)
    if (this._memStandards) {
      this._memStandards = items;
    }
    // Luôn ghi xuống localStorage để lần load sau lấy được dữ liệu mới nhất
    this._saveStdToCache(items);
  }

  async fetchAllAndCache(): Promise<ReferenceStandard[]> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    const snap = await getDocs(query(colRef, orderBy('received_date', 'desc')));
    const items: ReferenceStandard[] = snap.docs
      .filter(d => d.data()['_isDeleted'] !== true && d.data()['status'] !== 'DELETED')
      .map(d => ({ id: d.id, ...d.data() } as ReferenceStandard));
    this._saveStdToCache(items);
    this._memStandards = items;
    return items;
  }

  private _saveStdToCache(items: ReferenceStandard[]): void {
    try {
      // Ghi vào _deltaCacheKey (key mà DeltaSync đọc) để đảm bảo
      // các thay đổi từ startRealtimeDeltaListener được DeltaSync nhìn thấy
      const json = JSON.stringify(items);
      localStorage.setItem(this._deltaCacheKey, json);
      // Cũng ghi vào key cũ để tương thích ngược
      localStorage.setItem(this.STD_CACHE_KEY, json);

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
