import { Injectable, inject, effect, signal } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { FirestoreReadMonitor } from '../../../core/services/firestore-read-monitor.service';
import {
  collection, getDocs, getDocsFromServer, getDoc, doc, documentId,
  Unsubscribe, limit, orderBy, query, startAfter, where,
  Query, QueryDocumentSnapshot, QuerySnapshot
} from 'firebase/firestore';
import { ReferenceStandard } from '../../../core/models/standard.model';
import {
  buildScopedDeltaKey,
  DeltaSyncDiagnostic,
  DeltaSyncResourceLimitState,
  DeltaSyncService,
} from '../../../core/services/delta-sync.service';
import { isFefoCandidate, parseStandardDate } from '../../../shared/utils/standard-fefo';
import { ACTIVE_STANDARD_STATUSES, isActiveStandardStatus } from '../../../shared/utils/standard-query';

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
  /**
   * Dashboard FEFO lookup must never fall back to a collection-wide read.
   * The query is ordered by the normalized YYYY-MM-DD expiry value, so the
   * first eligible document is the nearest usable lot. A small bounded scan
   * is retained for legacy rows whose workflow flags make the first rows
   * unavailable.
   */
  private readonly FEFO_PAGE_SIZE = 50;
  private readonly FEFO_MAX_PAGES = 10;

  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private readMonitor = inject(FirestoreReadMonitor);
  deltaSync = inject(DeltaSyncService);

  /** @deprecated Không dùng trực tiếp, chỉ để tương thích ngược */
  readonly STD_CACHE_KEY        = 'lims_std_list_cache';
  readonly STD_SYNC_SECONDS_KEY = 'lims_std_sync_seconds';

  // Key thực sự DeltaSync đang dùng (computed sau khi APP_ID sẵn sàng)
  get _deltaCacheKey()  {
    return buildScopedDeltaKey(
      'lims_reference_standards_cache_' + this.fb.APP_ID,
      this.auth.getDeltaCacheScope()
    );
  }
  get _deltaCursorKey() {
    return buildScopedDeltaKey(
      'lims_reference_standards_sync_seconds_' + this.fb.APP_ID,
      this.auth.getDeltaCacheScope()
    );
  }

  // Complete non-deleted catalogue snapshot. This must never be populated from
  // the bounded/operational DeltaSync cache because import/admin flows rely on
  // it as proof that the whole catalogue was scanned.
  _memStandards: ReferenceStandard[] | null = null;
  private completeCatalogueScope: string | null = null;
  private completeCatalogueLoadedAt = 0;
  private completeActiveStandards: ReferenceStandard[] | null = null;
  private completeActiveScope: string | null = null;
  private completeActiveLoadedAt = 0;
  private fullCatalogueLoad?: Promise<ReferenceStandard[]>;
  private fullCatalogueLoadScope: string | null = null;

  // Dedupe concurrent cache misses for the same standard ID. Without this,
  // two components opening at the same time can issue identical getDoc reads
  // before either result has a chance to populate the shared cache.
  private readonly standardByIdInFlight = new Map<string, Promise<ReferenceStandard | null>>();

  readonly syncDiagnosticError = signal<DeltaSyncDiagnostic | null>(null);
  readonly resourceLimitState = signal<DeltaSyncResourceLimitState | null>(null);
  readonly isRetryingSync = signal(false);
  private errorCallbacks = new Set<(diagnostic: DeltaSyncDiagnostic) => void>();
  private readyCallbacks = new Set<() => void>();

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
      // Giữ toàn bộ danh mục trong L1 để tìm khóa import/idempotency chính xác.
      // localStorage có thể từ chối ở quy mô lớn, nhưng DeltaSync vẫn giữ L1 và
      // tự phục hồi từ Firestore thay vì âm thầm cắt danh mục ở 3.000 bản ghi.
      maxCacheSize: 10000,
      // Operational consumers never need historical soft-deleted standards.
      // Keep the client-side isDeletedFn below as defense in depth for
      // inconsistent legacy documents whose status and delete flag disagree.
      queryConstraints: [
        where('status', 'in', [...ACTIVE_STANDARD_STATUSES])
      ],
      // OPTIMIZED (sau migration lastUpdated): cursor-based delta sync
      // Lần đầu: fetch toàn collection 1 lần → ghi cursor lastUpdated
      // Các lần sau: chỉ fetch docs có lastUpdated > cursor (~95% tiết kiệm reads)
      orderByField: 'lastUpdated',
      orderDirection: 'desc' as const,
      initialCollectionScan: false,
      isDeletedFn: (doc: any) => doc._isDeleted === true || doc.status === 'DELETED',
      onError: (diagnostic: DeltaSyncDiagnostic) => this._handleDeltaSyncError(diagnostic),
      onReady: () => this._handleDeltaSyncReady(),
    };
  }

  private _handleDeltaSyncError(diagnostic: DeltaSyncDiagnostic): void {
    this.syncDiagnosticError?.set(diagnostic);
    this.resourceLimitState?.set(this.deltaSync.getResourceLimitState(this._deltaCacheKey));
    this.isRetryingSync?.set(false);
    for (const cb of [...(this.errorCallbacks ?? [])]) {
      try {
        cb(diagnostic);
      } catch (err) {
        console.error('[StandardCacheService] Error in onError listener:', err);
      }
    }
  }

  private _handleDeltaSyncReady(): void {
    const pauseState = this.deltaSync.getResourceLimitState(this._deltaCacheKey);
    this.resourceLimitState?.set(pauseState);
    if (!pauseState) {
      this.syncDiagnosticError?.set(null);
      this.isRetryingSync?.set(false);
      for (const cb of [...(this.readyCallbacks ?? [])]) {
        try {
          cb();
        } catch (err) {
          console.error('[StandardCacheService] Error in onReady listener:', err);
        }
      }
    }
  }

  private _handleDeltaSyncData(
    data: ReferenceStandard[],
    callback: (standards: ReferenceStandard[]) => void,
  ): void {
    const pauseState = this.deltaSync.getResourceLimitState(this._deltaCacheKey);
    this.resourceLimitState?.set(pauseState);
    if (!pauseState) {
      this.syncDiagnosticError?.set(null);
      this.isRetryingSync?.set(false);
    }
    // A filtered/bounded delta projection cannot prove catalogue completeness.
    // Invalidate full snapshots when remote data changes; the next bulk caller
    // shares a fresh server load, including legacy rows without lastUpdated.
    this._memStandards = null;
    this.completeCatalogueScope = null;
    this.completeActiveStandards = null;
    this.completeActiveScope = null;
    callback(data);
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
    this.completeCatalogueScope = null;
    this.completeCatalogueLoadedAt = 0;
    this.completeActiveStandards = null;
    this.completeActiveScope = null;
    this.completeActiveLoadedAt = 0;
    this.fullCatalogueLoad = undefined;
    this.fullCatalogueLoadScope = null;
    this.standardByIdInFlight.clear();
    this.syncDiagnosticError?.set(null);
    this.resourceLimitState?.set(null);
    this.isRetryingSync?.set(false);
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
  startRealtimeDeltaListener(
    cb: () => void,
    onError?: (diagnostic: DeltaSyncDiagnostic) => void,
    onReady?: () => void,
  ): () => void {
    return this.listenToStandards(() => cb(), onError, onReady);
  }

  // ─── Delta Sync Listener (backward compat) ─────────────────────────────────
  listenToStandards(
    callback: (standards: ReferenceStandard[]) => void,
    onError?: (diagnostic: DeltaSyncDiagnostic) => void,
    onReady?: () => void,
  ): Unsubscribe {
    this.errorCallbacks ??= new Set();
    this.readyCallbacks ??= new Set();
    if (onError) {
      this.errorCallbacks.add(onError);
    }
    if (onReady) {
      this.readyCallbacks.add(onReady);
    }
    const unregister = this.deltaSync.startSingletonListener<ReferenceStandard>(
      this._deltaSyncConfig(),
      (data) => this._handleDeltaSyncData(data, callback),
    );
    const currentPause = this.deltaSync.getResourceLimitState(this._deltaCacheKey);
    this.resourceLimitState?.set(currentPause);
    if (currentPause && onError) {
      const currentDiag: DeltaSyncDiagnostic =
        this.syncDiagnosticError?.() ?? currentPause.diagnostic;
      onError(currentDiag);
    } else if (!currentPause && onReady && this.deltaSync.getSingletonStatus?.(this._deltaCacheKey) === 'listening') {
      onReady();
    }
    // Trả về dưới dạng Unsubscribe để giữ type compatibility
    return (() => {
      if (onError) {
        this.errorCallbacks?.delete(onError);
      }
      if (onReady) {
        this.readyCallbacks?.delete(onReady);
      }
      unregister();
    }) as unknown as Unsubscribe;
  }

  getStandardsResourceLimitState(): DeltaSyncResourceLimitState | null {
    const state = this.deltaSync.getResourceLimitState(this._deltaCacheKey);
    this.resourceLimitState?.set(state);
    return state;
  }

  retryStandardsSync(): boolean {
    const beforeStatus = this.deltaSync.getSingletonStatus?.(this._deltaCacheKey);
    if (this.isRetryingSync?.() && beforeStatus === 'starting') return false;
    this.isRetryingSync?.set(true);
    this.syncDiagnosticError?.set(null);
    const started = this.deltaSync.retryResourceLimitedSync(this._deltaCacheKey);
    this.resourceLimitState?.set(this.deltaSync.getResourceLimitState(this._deltaCacheKey));
    const afterStatus = this.deltaSync.getSingletonStatus?.(this._deltaCacheKey);
    if (!started || afterStatus === 'listening') {
      this.isRetryingSync?.set(false);
    }
    return started;
  }

  // ─── Cache Invalidation ──────────────────────────────────────────────────────
  /**
   * Xóa toàn bộ cache standards (memory + localStorage).
   * Buộc lần tải tiếp theo phải fetch lại từ Firestore.
   */
  invalidateLocalStandardsCache(): void {
    this._memStandards = null;
    this.completeCatalogueScope = null;
    this.completeCatalogueLoadedAt = 0;
    this.completeActiveStandards = null;
    this.completeActiveScope = null;
    this.completeActiveLoadedAt = 0;
    this.fullCatalogueLoad = undefined;
    this.fullCatalogueLoadScope = null;
    this.syncDiagnosticError.set(null);
    this.resourceLimitState.set(null);
    this.isRetryingSync.set(false);
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

    const existingRead = this.standardByIdInFlight.get(stdId);
    if (existingRead) return existingRead;

    const read = (async (): Promise<ReferenceStandard | null> => {
      try {
        const path = `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`;
        const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards', stdId);
        const snap = await getDoc(ref);
        this.readMonitor.record('getDoc', path, 1, { fromCache: snap.metadata.fromCache });

        if (!snap.exists()) {
          // Clear any stale persisted copy so the next lookup does not revive it.
          this._mergeAndSave([], [stdId]);
          return null;
        }

        const data = snap.data();
        if (data['_isDeleted'] === true || data['status'] === 'DELETED') {
          this._mergeAndSave([], [stdId]);
          return null;
        }

        const standard = { id: snap.id, ...data } as ReferenceStandard;
        // A successful fallback read becomes part of the canonical shared cache,
        // so repeated detail/lookups for the same ID are zero-read afterwards.
        this._mergeAndSave([standard], []);
        return standard;
      } catch (e) {
        console.error('[StandardCacheService] getStandardById error:', e);
        return null;
      } finally {
        this.standardByIdInFlight.delete(stdId);
      }
    })();

    this.standardByIdInFlight.set(stdId, read);
    return read;
  }

  getAllStandardsFromCache(): ReferenceStandard[] {
    return this.deltaSync.getCache<ReferenceStandard>(this._deltaCacheKey) ?? [];
  }

  /**
   * Return a catalogue only when this service knows a full non-deleted scan was
   * completed for the current auth scope. A non-empty operational cache is not
   * sufficient proof of completeness.
   */
  /**
   * Unified asynchronous access to the complete standard catalogue.
   * Only reuses snapshots obtained from a completed, unfiltered server scan.
   */
  async getCompleteCatalogue(options?: { allowStale?: boolean; forceRefresh?: boolean }): Promise<ReferenceStandard[]> {
    if (!options?.forceRefresh) {
      const mem = this.getCompleteCatalogueFromMemory();
      if (mem) return mem;
    }
    return this.fetchAllAndCache();
  }

  getCompleteCatalogueFromMemory(maxAgeMs = Number.POSITIVE_INFINITY): ReferenceStandard[] | null {
    if (!this._memStandards || this.completeCatalogueScope !== this.auth.getDeltaCacheScope()) return null;
    if (Date.now() - this.completeCatalogueLoadedAt > maxAgeMs) return null;
    return [...this._memStandards];
  }

  /** Complete active-status snapshot shared by report/statistics consumers. */
  getCompleteActiveCatalogue(maxAgeMs = Number.POSITIVE_INFINITY): ReferenceStandard[] | null {
    if (!this.completeActiveStandards || this.completeActiveScope !== this.auth.getDeltaCacheScope()) return null;
    if (Date.now() - this.completeActiveLoadedAt > maxAgeMs) return null;
    return [...this.completeActiveStandards];
  }

  publishCompleteActiveCatalogue(items: ReferenceStandard[], loadedAt = Date.now()): void {
    this.completeActiveStandards = items
      .filter(standard => this.isOperationalStandard(standard))
      .sort((a, b) => (b.received_date || '').localeCompare(a.received_date || ''));
    this.completeActiveScope = this.auth.getDeltaCacheScope();
    this.completeActiveLoadedAt = loadedAt;
  }

  async getNearestExpiry(): Promise<ReferenceStandard | null> {
    if (!this.auth.canViewStandards()) return null;

    // A warm DeltaSync cache is useful as a zero-read fast path only when it
    // already contains an eligible lot. It is not treated as complete: the
    // cache is ordered by lastUpdated and may not contain the oldest expiry.
    const cached = this.deltaSync.getCache<ReferenceStandard>(this._deltaCacheKey) ?? [];
    const cachedCandidate = cached
      .filter(standard => isFefoCandidate(standard) && parseStandardDate(standard.expiry_date) !== null)
      .sort((a, b) =>
        (parseStandardDate(a.expiry_date) || Number.MAX_SAFE_INTEGER) -
        (parseStandardDate(b.expiry_date) || Number.MAX_SAFE_INTEGER)
      )[0];

    const todayKey = this.toLocalDateKey(new Date());
    let cursor: QueryDocumentSnapshot | null = null;
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');

    try {
      for (let page = 0; page < this.FEFO_MAX_PAGES; page++) {
        const constraints = [
          where('status', 'in', [...ACTIVE_STANDARD_STATUSES]),
          where('expiry_date', '>=', todayKey),
          orderBy('expiry_date', 'asc'),
          limit(this.FEFO_PAGE_SIZE)
        ] as const;
        const expiryQuery: Query = cursor
          ? query(colRef, ...constraints.slice(0, 2), startAfter(cursor), constraints[2])
          : query(colRef, ...constraints);
        const snap: QuerySnapshot = await getDocs(expiryQuery);
        this.readMonitor.record(
          'getDocs',
          `artifacts/${this.fb.APP_ID}/reference_standards`,
          snap.size,
          { phase: 'earliest', fromCache: snap.metadata.fromCache }
        );

        const candidates = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as ReferenceStandard))
          .filter(standard =>
            !standard._isDeleted &&
            standard.status !== 'DELETED' &&
            isFefoCandidate(standard) &&
            parseStandardDate(standard.expiry_date) !== null
          );

        if (candidates.length > 0) {
          return candidates[0];
        }
        if (snap.size < this.FEFO_PAGE_SIZE) break;
        cursor = snap.docs[snap.docs.length - 1];
      }

      // If the bounded server scan found nothing, a stale cache candidate is
      // safer than returning a false "no standard" result during a transient
      // Firestore failure or a legacy-data boundary.
      return cachedCandidate ?? null;
    } catch (error) {
      console.warn('[StandardCacheService] bounded FEFO lookup failed:', error);
      return cachedCandidate ?? null;
    }
  }

  private toLocalDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // ─── Optimistic Cache Update ────────────────────────────────────────────────
  /**
   * Merge changed/deleted docs vào cache ngay lập tức (optimistic update).
   * Dùng sau khi write Firestore để UI cập nhật tức thì, không chờ live listener.
   */
  _mergeAndSave(changed: ReferenceStandard[], deletedIds: string[]): void {
    const activeChanged = changed.filter(standard => this.isOperationalStandard(standard));
    const activeRemoved = [
      ...deletedIds,
      ...changed
        .filter(standard => !this.isOperationalStandard(standard))
        .map(standard => standard.id)
    ];
    const items = this.deltaSync.mergeSingletonCache<ReferenceStandard>(
      this._deltaCacheKey,
      activeChanged,
      [...new Set(activeRemoved)]
    );

    const scope = this.auth.getDeltaCacheScope();
    if (this._memStandards && this.completeCatalogueScope === scope) {
      this._memStandards = this.mergeCompleteSnapshot(this._memStandards, changed, deletedIds, false);
    }
    if (this.completeActiveStandards && this.completeActiveScope === scope) {
      this.completeActiveStandards = this.mergeCompleteSnapshot(
        this.completeActiveStandards,
        changed,
        deletedIds,
        true
      );
    }
  }

  // ─── Admin Bulk Operations ──────────────────────────────────────────────────
  async fetchAllAndCache(): Promise<ReferenceStandard[]> {
    const scope = this.auth.getDeltaCacheScope();
    if (this.fullCatalogueLoad && this.fullCatalogueLoadScope === scope) return this.fullCatalogueLoad;

    const load = (async (): Promise<ReferenceStandard[]> => {
      const items: ReferenceStandard[] = (await this.loadCompleteCatalogueRows())
        .filter(item => item._isDeleted !== true && item.status !== 'DELETED')
        .sort((a, b) => (b.received_date || '').localeCompare(a.received_date || ''));

      // Do not mix legacy/non-operational rows into the DeltaSync projection.
      // Keep the full catalogue separately and publish its active subset as a
      // completeness-certified snapshot for report/statistics reuse.
      if (scope === this.auth.getDeltaCacheScope()) {
        const loadedAt = Date.now();
        this._memStandards = items;
        this.completeCatalogueScope = scope;
        this.completeCatalogueLoadedAt = loadedAt;
        this.publishCompleteActiveCatalogue(items, loadedAt);
      }
      return items;
    })();

    this.fullCatalogueLoad = load;
    this.fullCatalogueLoadScope = scope;
    try {
      return await load;
    } finally {
      if (this.fullCatalogueLoad === load) {
        this.fullCatalogueLoad = undefined;
        this.fullCatalogueLoadScope = null;
      }
    }
  }

  protected async loadCompleteCatalogueRows(): Promise<ReferenceStandard[]> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    const items: ReferenceStandard[] = [];
    let cursor: QueryDocumentSnapshot | null = null;
    const pageSize = 500;
    for (;;) {
      const page: QuerySnapshot = await getDocsFromServer(query(colRef, orderBy(documentId()),
        ...(cursor ? [startAfter(cursor)] : []), limit(pageSize)));
      this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/reference_standards`,
        page.size, { phase: 'initial', fromCache: false });
      items.push(...page.docs.map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard)));
      if (page.size < pageSize) return items;
      cursor = page.docs[page.docs.length - 1];
    }
  }

  private isOperationalStandard(standard: ReferenceStandard): boolean {
    return standard._isDeleted !== true
      && standard.status !== 'DELETED'
      && isActiveStandardStatus(standard.status);
  }

  private mergeCompleteSnapshot(
    base: ReferenceStandard[],
    changed: ReferenceStandard[],
    deletedIds: string[],
    activeOnly: boolean
  ): ReferenceStandard[] {
    const byId = new Map(base.map(standard => [standard.id, standard]));
    deletedIds.forEach(id => byId.delete(id));
    changed.forEach(standard => {
      const keep = activeOnly
        ? this.isOperationalStandard(standard)
        : standard._isDeleted !== true && standard.status !== 'DELETED';
      if (keep) byId.set(standard.id, standard);
      else byId.delete(standard.id);
    });
    return [...byId.values()]
      .sort((a, b) => (b.received_date || '').localeCompare(a.received_date || ''));
  }

}
