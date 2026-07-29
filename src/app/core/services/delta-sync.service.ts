import { Injectable, inject } from '@angular/core';
import {
  collection, query, onSnapshot, where, orderBy, getDocs, limit, QueryConstraint
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface DeltaSyncConfig {
  cacheKey: string;
  cursorKey: string;
  collectionPath: string;
  maxCacheSize?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  queryConstraints?: QueryConstraint[];
  /** Initial scan without orderBy, for legacy collections where the sort field may be missing. */
  initialCollectionScan?: boolean;
  /** Field used to select the initial batch. Defaults to lastUpdated for cursor safety. */
  initialOrderByField?: string;
  initialOrderDirection?: 'asc' | 'desc';
  retryInitialDelayMs?: number;
  retryMaxDelayMs?: number;
  retryMaxAttempts?: number;
  onError?: (diagnostic: DeltaSyncDiagnostic) => void;
  /**
   * Hàm kiểm tra doc đã bị xóa hay chưa.
   * Mặc định: (doc) => doc._isDeleted === true
   */
  isDeletedFn?: (doc: any) => boolean;
}

export type DeltaSyncPhase = 'initial-fetch' | 'listener' | 'cache-read' | 'cache-write';
export type DeltaSyncStatus = 'starting' | 'listening' | 'retrying' | 'failed' | 'destroyed';

export interface DeltaSyncDiagnostic {
  timestamp: number;
  phase: DeltaSyncPhase;
  collectionPath: string;
  cacheKey: string;
  errorCode: string;
  message: string;
  attempt: number;
  willRetry: boolean;
}

interface DeltaErrorLike {
  code?: unknown;
  message?: unknown;
  name?: unknown;
}

const CACHE_REGISTRY_KEY = 'lims_delta_sync_registry_v3';
const CACHE_MIGRATION_KEY = 'lims_delta_sync_cache_v3_migrated';
const CURSOR_OVERLAP_MS = 1000;
const DEFAULT_RETRY_INITIAL_MS = 1000;
const DEFAULT_RETRY_MAX_MS = 30000;
const DEFAULT_RETRY_ATTEMPTS = 6;
const TERMINAL_ERROR_CODES = new Set([
  'permission-denied',
  'unauthenticated',
  'failed-precondition',
  'invalid-argument',
  'not-found',
  'already-exists',
  'unimplemented'
]);

const LEGACY_CACHE_PREFIXES = [
  'lims_logs_cache_',
  'lims_logs_cursor_',
  'lims_approved_requests_cache_',
  'lims_approved_requests_cursor_',
  'lims_reference_standards_cache_',
  'lims_reference_standards_sync_seconds_',
  'delta_master_analytes_',
  'delta_master_analytes_cursor_',
  'lims_usage_cache_',
  'lims_usage_sync_seconds_',
  'lims_std_req_cache_',
  'lims_std_req_cursor_'
];

const LEGACY_CACHE_KEYS = new Set([
  'lims_std_list_cache',
  'lims_std_sync_seconds'
]);

export function mergeDeltaItems<T extends { id?: string }>(
  base: readonly T[],
  changed: readonly T[],
  deletedIds: readonly string[] = []
): T[] {
  const deleted = new Set(deletedIds);
  const items = base.filter(item => !item.id || !deleted.has(item.id));

  changed.forEach(item => {
    if (!item.id || deleted.has(item.id)) return;
    const index = items.findIndex(existing => existing.id === item.id);
    if (index >= 0) items[index] = item;
    else items.unshift(item);
  });

  return items;
}

export function replaceDeltaArrayContents<T>(target: T[], source: readonly T[]): T[] {
  target.splice(0, target.length, ...source);
  return target;
}

export function deltaValueToMillis(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof value === 'object') {
    const timestamp = value as {
      seconds?: unknown;
      nanoseconds?: unknown;
      milliseconds?: unknown;
      toMillis?: unknown;
    };
    if (typeof timestamp.toMillis === 'function') {
      const millis = (timestamp.toMillis as () => number)();
      return Number.isFinite(millis) ? millis : 0;
    }
    if (typeof timestamp.milliseconds === 'number' && Number.isFinite(timestamp.milliseconds)) {
      return timestamp.milliseconds;
    }
    if (typeof timestamp.seconds === 'number' && Number.isFinite(timestamp.seconds)) {
      const nanos = typeof timestamp.nanoseconds === 'number' && Number.isFinite(timestamp.nanoseconds)
        ? timestamp.nanoseconds
        : 0;
      return (timestamp.seconds * 1000) + Math.floor(nanos / 1_000_000);
    }
  }
  return 0;
}

export function getMaxDeltaCursorMillis<T extends { lastUpdated?: unknown }>(
  items: readonly T[],
  observedCursorMillis = 0,
  storedCursorMillis = 0
): number {
  let maxMillis = Math.max(0, observedCursorMillis, storedCursorMillis);
  for (const item of items) {
    maxMillis = Math.max(maxMillis, deltaValueToMillis(item.lastUpdated));
  }
  return maxMillis;
}

export function sortAndTrimDeltaItems<T extends Record<string, any>>(
  items: T[],
  sortField: string,
  sortDirection: 'asc' | 'desc',
  maxCacheSize: number
): T[] {
  items.sort((a, b) => {
    const rawA = a[sortField];
    const rawB = b[sortField];
    const timeA = deltaValueToMillis(rawA);
    const timeB = deltaValueToMillis(rawB);
    let comparison: number;

    if (timeA > 0 || timeB > 0) {
      comparison = timeA - timeB;
    } else if (typeof rawA === 'string' || typeof rawB === 'string') {
      comparison = String(rawA ?? '').localeCompare(String(rawB ?? ''), undefined, { numeric: true });
    } else {
      comparison = Number(rawA ?? 0) - Number(rawB ?? 0);
      if (!Number.isFinite(comparison)) comparison = 0;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (Number.isFinite(maxCacheSize) && maxCacheSize >= 0 && items.length > maxCacheSize) {
    items.splice(maxCacheSize);
  }
  return items;
}

function stableScopeHash(value: string): string {
  let hashA = 0x811c9dc5;
  let hashB = 0x9e3779b9;
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    hashA = Math.imul(hashA ^ code, 0x01000193);
    hashB = Math.imul(hashB ^ code, 0x85ebca6b);
  }
  return `${(hashA >>> 0).toString(36)}${(hashB >>> 0).toString(36)}`;
}

export function buildDeltaAuthScope(
  user: { uid?: string; role?: string; roleId?: string } | null | undefined,
  permissions: readonly string[] = []
): string {
  if (!user?.uid) return 'signed-out';
  const permissionScope = [...new Set(permissions)].sort().join(',');
  return `${user.uid}|${user.role || ''}|${user.roleId || ''}|${permissionScope}`;
}

export function buildScopedDeltaKey(baseKey: string, authScope: string): string {
  return `${baseKey}__ds3__${stableScopeHash(authScope)}`;
}

export function getDeltaErrorCode(error: unknown): string {
  const raw = String((error as DeltaErrorLike | null)?.code || (error as DeltaErrorLike | null)?.name || 'unknown');
  const slashIndex = raw.lastIndexOf('/');
  return (slashIndex >= 0 ? raw.slice(slashIndex + 1) : raw).toLowerCase();
}

export function isRetryableDeltaError(error: unknown): boolean {
  return !TERMINAL_ERROR_CODES.has(getDeltaErrorCode(error));
}

export function isDeltaAuthorizationError(error: unknown): boolean {
  const code = getDeltaErrorCode(error);
  return code === 'permission-denied' || code === 'unauthenticated';
}

export function computeDeltaRetryDelay(
  attempt: number,
  initialDelayMs = DEFAULT_RETRY_INITIAL_MS,
  maxDelayMs = DEFAULT_RETRY_MAX_MS
): number {
  const safeAttempt = Math.max(1, Math.floor(attempt));
  const exponential = Math.max(0, initialDelayMs) * (2 ** (safeAttempt - 1));
  return Math.min(Math.max(0, maxDelayMs), exponential);
}

export function isDeltaGenerationActive(
  currentGeneration: number,
  capturedGeneration: number,
  destroyed: boolean
): boolean {
  return !destroyed && currentGeneration === capturedGeneration;
}

interface SingletonEntry<T = any> {
  key: string;
  unsub: () => void;
  callbacks: Set<(data: T[]) => void>;
  memCache: T[];
  config: DeltaSyncConfig;
  generation: number;
  destroyed: boolean;
  retryAttempt: number;
  retryTimer: ReturnType<typeof setTimeout> | null;
  status: DeltaSyncStatus;
  lastError?: DeltaSyncDiagnostic;
}

@Injectable({ providedIn: 'root' })
export class DeltaSyncService {
  private firebaseService = inject(FirebaseService);
  private fb = this.firebaseService.db;
  private _singletons = new Map<string, SingletonEntry>();
  private _diagnostics: DeltaSyncDiagnostic[] = [];

  constructor() {
    this._purgeLegacyUnscopedCachesOnce();
  }

  public startSingletonListener<T extends {
    id?: string;
    lastUpdated?: any;
    _isDeleted?: boolean;
    [key: string]: any;
  }>(
    config: DeltaSyncConfig,
    onData: (data: T[]) => void
  ): () => void {
    const key = config.cacheKey;
    const existing = this._singletons.get(key) as SingletonEntry<T> | undefined;
    if (existing) {
      existing.callbacks.add(onData);
      onData([...existing.memCache]);
      if (existing.status === 'failed' && !existing.retryTimer) {
        existing.retryAttempt = 0;
        this._startSingleton(existing);
      }
      return () => existing.callbacks.delete(onData);
    }

    this._registerStorageKeys(config.cacheKey, config.cursorKey);
    const isDeleted = config.isDeletedFn || ((document: any) => document._isDeleted === true);
    const memCache = this._loadFromCache<T>(config.cacheKey, config).filter(document => !isDeleted(document));
    const entry: SingletonEntry<T> = {
      key,
      unsub: () => {},
      callbacks: new Set([onData]),
      memCache,
      config,
      generation: 0,
      destroyed: false,
      retryAttempt: 0,
      retryTimer: null,
      status: 'starting'
    };
    this._singletons.set(key, entry);
    onData([...entry.memCache]);
    this._startSingleton(entry);

    return () => {
      const current = this._singletons.get(key);
      if (current === entry) current.callbacks.delete(onData as any);
    };
  }

  public startListener<T extends {
    id?: string;
    lastUpdated?: any;
    _isDeleted?: boolean;
    [key: string]: any;
  }>(
    config: DeltaSyncConfig,
    onData: (data: T[]) => void
  ): () => void {
    this._registerStorageKeys(config.cacheKey, config.cursorKey);
    const isDeleted = config.isDeletedFn || ((document: any) => document._isDeleted === true);
    const cachedItems = this._loadFromCache<T>(config.cacheKey, config).filter(document => !isDeleted(document));
    let listenerUnsub: (() => void) | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryAttempt = 0;
    let generation = 0;
    let destroyed = false;

    const cleanupListener = () => {
      if (listenerUnsub) listenerUnsub();
      listenerUnsub = null;
    };

    const scheduleRetry = (error: unknown, phase: DeltaSyncPhase) => {
      cleanupListener();
      if (destroyed) return;
      retryAttempt++;
      const maxAttempts = config.retryMaxAttempts ?? DEFAULT_RETRY_ATTEMPTS;
      const willRetry = isRetryableDeltaError(error) && retryAttempt <= maxAttempts;
      this._recordDiagnostic(config, error, phase, retryAttempt, willRetry);
      if (!willRetry) {
        if (isDeltaAuthorizationError(error)) {
          cachedItems.splice(0);
          this._clearPersistentData(config);
          onData([]);
        }
        return;
      }
      const delay = computeDeltaRetryDelay(
        retryAttempt,
        config.retryInitialDelayMs,
        config.retryMaxDelayMs
      );
      retryTimer = setTimeout(() => {
        retryTimer = null;
        void start();
      }, delay);
    };

    const attachListener = (capturedGeneration: number) => {
      const cursor = this._loadCursor(config.cursorKey, config);
      listenerUnsub = this._setupSnapshotListener(
        config,
        cursor,
        cachedItems,
        data => {
          if (destroyed || capturedGeneration !== generation) return;
          retryAttempt = 0;
          onData(data);
        },
        isDeleted,
        error => scheduleRetry(error, 'listener')
      );
    };

    const start = async () => {
      if (destroyed) return;
      cleanupListener();
      const capturedGeneration = ++generation;
      try {
        if (cachedItems.length === 0) {
          const items = await this._fetchInitialBatch<T>(config);
          if (destroyed || capturedGeneration !== generation) return;
          replaceDeltaArrayContents(cachedItems, items.filter(document => !isDeleted(document)));
          this._updateCacheAndCursor(cachedItems, config);
          onData([...cachedItems]);
        } else {
          onData([...cachedItems]);
        }
        if (destroyed || capturedGeneration !== generation) return;
        attachListener(capturedGeneration);
      } catch (error) {
        if (destroyed || capturedGeneration !== generation) return;
        scheduleRetry(error, 'initial-fetch');
      }
    };

    void start();
    return () => {
      destroyed = true;
      generation++;
      cleanupListener();
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = null;
    };
  }

  public destroySingleton(cacheKey: string): void {
    const entry = this._singletons.get(cacheKey);
    if (!entry) return;
    entry.destroyed = true;
    entry.status = 'destroyed';
    entry.generation++;
    entry.unsub();
    entry.unsub = () => {};
    if (entry.retryTimer) clearTimeout(entry.retryTimer);
    entry.retryTimer = null;
    entry.callbacks.clear();
    entry.memCache.splice(0);
    this._singletons.delete(cacheKey);
  }

  public destroyAll(clearPersistentCaches = false): void {
    [...this._singletons.keys()].forEach(key => this.destroySingleton(key));
    if (clearPersistentCaches) this.clearAllPersistentCaches();
  }

  public clearCache(cacheKey: string, cursorKey: string): void {
    try {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(cursorKey);
      this._unregisterStorageKeys(cacheKey, cursorKey);
    } catch {}
  }

  public clearAllPersistentCaches(): void {
    try {
      const registered = this._loadStorageRegistry();
      registered.forEach(key => localStorage.removeItem(key));
      const scopedKeys: string[] = [];
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key?.includes('__ds3__')) scopedKeys.push(key);
      }
      scopedKeys.forEach(key => localStorage.removeItem(key));
      localStorage.removeItem(CACHE_REGISTRY_KEY);
      this._purgeLegacyUnscopedCaches();
    } catch {}
  }

  public getCache<T>(key: string): T[] {
    const entry = this._singletons.get(key);
    if (entry) return [...entry.memCache] as T[];
    return this._loadFromCache<T>(key);
  }

  public getMemCache<T>(key: string): T[] | null {
    const entry = this._singletons.get(key);
    return entry ? [...entry.memCache] as T[] : null;
  }

  public getSingletonStatus(key: string): DeltaSyncStatus | null {
    return this._singletons.get(key)?.status ?? null;
  }

  public getDiagnostics(): DeltaSyncDiagnostic[] {
    return this._diagnostics.map(diagnostic => ({ ...diagnostic }));
  }

  public mergeSingletonCache<T extends { id?: string; [key: string]: any }>(
    key: string,
    changed: T[],
    deletedIds: string[] = []
  ): T[] {
    const entry = this._singletons.get(key) as SingletonEntry<T> | undefined;
    const base = entry?.memCache ?? this._loadFromCache<T>(key);
    const items = mergeDeltaItems(base, changed, deletedIds);

    if (entry) {
      const sortField = entry.config.orderByField || 'timestamp';
      const sortDirection = entry.config.orderDirection || 'desc';
      const maxCacheSize = entry.config.maxCacheSize || 1000;
      sortAndTrimDeltaItems(items, sortField, sortDirection, maxCacheSize);
      replaceDeltaArrayContents(entry.memCache, items);
      this._emitEntry(entry);
    }

    const published = entry?.memCache ?? items;
    try {
      localStorage.setItem(key, JSON.stringify(published));
    } catch (error) {
      this._recordDiagnostic(
        entry?.config ?? { cacheKey: key, cursorKey: '', collectionPath: 'local-cache' },
        error,
        'cache-write',
        0,
        false
      );
    }
    return [...published];
  }

  private _startSingleton<T extends {
    id?: string;
    lastUpdated?: any;
    _isDeleted?: boolean;
    [key: string]: any;
  }>(entry: SingletonEntry<T>): void {
    if (entry.destroyed || this._singletons.get(entry.key) !== entry) return;
    entry.unsub();
    entry.unsub = () => {};
    if (entry.retryTimer) clearTimeout(entry.retryTimer);
    entry.retryTimer = null;
    entry.status = 'starting';
    const capturedGeneration = ++entry.generation;
    const isDeleted = entry.config.isDeletedFn || ((document: any) => document._isDeleted === true);

    const finish = async () => {
      try {
        if (entry.memCache.length === 0) {
          const items = await this._fetchInitialBatch<T>(entry.config);
          if (!this._entryIsActive(entry, capturedGeneration)) return;
          replaceDeltaArrayContents(
            entry.memCache,
            items.filter(document => !isDeleted(document))
          );
          this._updateCacheAndCursor(entry.memCache, entry.config);
          this._emitEntry(entry);
        }
        if (!this._entryIsActive(entry, capturedGeneration)) return;
        this._attachSingletonSnapshot(entry, capturedGeneration, isDeleted);
      } catch (error) {
        if (!this._entryIsActive(entry, capturedGeneration)) return;
        this._handleSingletonError(entry, error, 'initial-fetch');
      }
    };
    void finish();
  }

  private _attachSingletonSnapshot<T extends {
    id?: string;
    lastUpdated?: any;
    _isDeleted?: boolean;
    [key: string]: any;
  }>(
    entry: SingletonEntry<T>,
    capturedGeneration: number,
    isDeleted: (document: any) => boolean
  ): void {
    const cursor = this._loadCursor(entry.config.cursorKey, entry.config);
    entry.unsub = this._setupSnapshotListener(
      entry.config,
      cursor,
      entry.memCache,
      data => {
        if (!this._entryIsActive(entry, capturedGeneration)) return;
        entry.retryAttempt = 0;
        entry.status = 'listening';
        this._emitEntry(entry, data);
      },
      isDeleted,
      error => {
        if (!this._entryIsActive(entry, capturedGeneration)) return;
        this._handleSingletonError(entry, error, 'listener');
      },
      () => {
        if (this._entryIsActive(entry, capturedGeneration)) {
          entry.retryAttempt = 0;
          entry.status = 'listening';
        }
      }
    );
    entry.status = 'listening';
  }

  private _handleSingletonError(
    entry: SingletonEntry,
    error: unknown,
    phase: DeltaSyncPhase
  ): void {
    entry.unsub();
    entry.unsub = () => {};
    entry.retryAttempt++;
    const maxAttempts = entry.config.retryMaxAttempts ?? DEFAULT_RETRY_ATTEMPTS;
    const willRetry = isRetryableDeltaError(error) && entry.retryAttempt <= maxAttempts;
    const diagnostic = this._recordDiagnostic(
      entry.config,
      error,
      phase,
      entry.retryAttempt,
      willRetry
    );
    entry.lastError = diagnostic;
    entry.status = willRetry ? 'retrying' : 'failed';
    if (!willRetry) {
      if (isDeltaAuthorizationError(error)) {
        entry.memCache.splice(0);
        this._clearPersistentData(entry.config);
        this._emitEntry(entry);
      }
      return;
    }

    const delay = computeDeltaRetryDelay(
      entry.retryAttempt,
      entry.config.retryInitialDelayMs,
      entry.config.retryMaxDelayMs
    );
    entry.retryTimer = setTimeout(() => {
      entry.retryTimer = null;
      if (!entry.destroyed && this._singletons.get(entry.key) === entry) {
        this._startSingleton(entry);
      }
    }, delay);
  }

  private _setupSnapshotListener<T extends {
    id?: string;
    lastUpdated?: any;
    _isDeleted?: boolean;
    [key: string]: any;
  }>(
    config: DeltaSyncConfig,
    cursorMillis: number,
    cachedItems: T[],
    onData: (data: T[]) => void,
    isDeleted: (document: any) => boolean,
    onError: (error: unknown) => void,
    onReady?: () => void
  ): () => void {
    const colRef = collection(this.fb, config.collectionPath);
    const constraints = config.queryConstraints || [];
    const snapshotQuery = cursorMillis > 0
      ? query(
          colRef,
          ...constraints,
          where('lastUpdated', '>', new Date(Math.max(0, cursorMillis - CURSOR_OVERLAP_MS))),
          orderBy('lastUpdated', 'asc')
        )
      : query(colRef, ...constraints, orderBy('lastUpdated', 'desc'), limit(100));

    return onSnapshot(snapshotQuery, snapshot => {
      onReady?.();
      let hasChanges = false;
      let observedCursorMillis = cursorMillis;

      snapshot.docChanges().forEach(change => {
        const docData = change.doc.data() as T;
        (docData as any).id = change.doc.id;
        this._normalizeTimestamps(docData, config.orderByField || 'timestamp');
        observedCursorMillis = Math.max(
          observedCursorMillis,
          deltaValueToMillis(docData.lastUpdated)
        );

        if (change.type === 'removed' || isDeleted(docData)) {
          const index = cachedItems.findIndex(item => item.id === docData.id);
          if (index !== -1) {
            cachedItems.splice(index, 1);
            hasChanges = true;
          }
        } else {
          const index = cachedItems.findIndex(item => item.id === docData.id);
          if (index !== -1) cachedItems[index] = docData;
          else cachedItems.push(docData);
          hasChanges = true;
        }
      });

      if (!snapshot.empty) {
        this._updateCacheAndCursor(cachedItems, config, observedCursorMillis);
      }
      if (hasChanges) onData([...cachedItems]);
    }, onError);
  }

  private async _fetchInitialBatch<T>(config: DeltaSyncConfig): Promise<T[]> {
    const colRef = collection(this.fb, config.collectionPath);
    const maxCacheSize = config.maxCacheSize || 1000;
    const constraints = config.queryConstraints || [];
    const initialOrderField = config.initialOrderByField || 'lastUpdated';
    const initialOrderDirection = config.initialOrderDirection || 'desc';
    const initialQuery = config.initialCollectionScan
      ? query(colRef, ...constraints, limit(maxCacheSize))
      : query(colRef, ...constraints, orderBy(initialOrderField, initialOrderDirection), limit(maxCacheSize));
    const snapshot = await getDocs(initialQuery);

    const items: T[] = [];
    snapshot.forEach(document => {
      const data = document.data() as T;
      (data as any).id = document.id;
      this._normalizeTimestamps(data, config.orderByField || 'timestamp');
      items.push(data);
    });
    return items;
  }

  private _normalizeTimestamps(data: any, sortField: string): void {
    const normalize = (value: any): any => {
      if (!value || typeof value.toMillis !== 'function') return value;
      const milliseconds = value.toMillis();
      return {
        seconds: Math.floor(milliseconds / 1000),
        nanoseconds: typeof value.nanoseconds === 'number' ? value.nanoseconds : 0,
        milliseconds
      };
    };

    data.lastUpdated = normalize(data.lastUpdated);
    if (sortField !== 'lastUpdated') data[sortField] = normalize(data[sortField]);
  }

  private _updateCacheAndCursor<T extends { lastUpdated?: any; [key: string]: any }>(
    items: T[],
    config: DeltaSyncConfig,
    observedCursorMillis = 0
  ): number {
    const sortField = config.orderByField || 'timestamp';
    const sortDirection = config.orderDirection || 'desc';
    const maxCacheSize = config.maxCacheSize || 1000;
    const storedCursor = this._loadCursor(config.cursorKey, config);
    const cursorMillis = getMaxDeltaCursorMillis(items, observedCursorMillis, storedCursor);
    sortAndTrimDeltaItems(items, sortField, sortDirection, maxCacheSize);

    try {
      localStorage.setItem(config.cacheKey, JSON.stringify(items));
      if (cursorMillis > 0) localStorage.setItem(config.cursorKey, cursorMillis.toString());
    } catch (error) {
      this._recordDiagnostic(config, error, 'cache-write', 0, false);
    }
    return cursorMillis;
  }

  private _loadFromCache<T>(key: string, config?: DeltaSyncConfig): T[] {
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) throw new Error('Delta cache payload is not an array.');
      return parsed as T[];
    } catch (error) {
      try { localStorage.removeItem(key); } catch {}
      if (config) this._recordDiagnostic(config, error, 'cache-read', 0, false);
      return [];
    }
  }

  private _loadCursor(key: string, config?: DeltaSyncConfig): number {
    try {
      const data = localStorage.getItem(key);
      if (!data) return 0;
      const parsed = Number(data);
      if (!Number.isFinite(parsed) || parsed < 0) throw new Error('Delta cursor is invalid.');
      return parsed;
    } catch (error) {
      try { localStorage.removeItem(key); } catch {}
      if (config) this._recordDiagnostic(config, error, 'cache-read', 0, false);
      return 0;
    }
  }

  private _clearPersistentData(config: DeltaSyncConfig): void {
    try {
      localStorage.removeItem(config.cacheKey);
      localStorage.removeItem(config.cursorKey);
    } catch {}
  }

  private _entryIsActive(entry: SingletonEntry, capturedGeneration: number): boolean {
    return this._singletons.get(entry.key) === entry
      && isDeltaGenerationActive(entry.generation, capturedGeneration, entry.destroyed);
  }

  private _emitEntry<T>(entry: SingletonEntry<T>, data: T[] = entry.memCache): void {
    entry.callbacks.forEach(callback => {
      try {
        callback([...data]);
      } catch (error) {
        console.error('[DeltaSync] Subscriber callback failed:', error);
      }
    });
  }

  private _recordDiagnostic(
    config: DeltaSyncConfig,
    error: unknown,
    phase: DeltaSyncPhase,
    attempt: number,
    willRetry: boolean
  ): DeltaSyncDiagnostic {
    const diagnostic: DeltaSyncDiagnostic = {
      timestamp: Date.now(),
      phase,
      collectionPath: config.collectionPath,
      cacheKey: config.cacheKey,
      errorCode: getDeltaErrorCode(error),
      message: String((error as DeltaErrorLike | null)?.message || error || 'Unknown DeltaSync error'),
      attempt,
      willRetry
    };
    this._diagnostics.push(diagnostic);
    if (this._diagnostics.length > 100) this._diagnostics.splice(0, this._diagnostics.length - 100);
    config.onError?.(diagnostic);
    console.warn('[DeltaSync]', diagnostic);
    return diagnostic;
  }

  private _registerStorageKeys(...keys: string[]): void {
    try {
      const registry = new Set(this._loadStorageRegistry());
      keys.filter(Boolean).forEach(key => registry.add(key));
      localStorage.setItem(CACHE_REGISTRY_KEY, JSON.stringify([...registry]));
    } catch {}
  }

  private _unregisterStorageKeys(...keys: string[]): void {
    try {
      const removed = new Set(keys);
      const registry = this._loadStorageRegistry().filter(key => !removed.has(key));
      if (registry.length) localStorage.setItem(CACHE_REGISTRY_KEY, JSON.stringify(registry));
      else localStorage.removeItem(CACHE_REGISTRY_KEY);
    } catch {}
  }

  private _loadStorageRegistry(): string[] {
    try {
      const raw = localStorage.getItem(CACHE_REGISTRY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(key => typeof key === 'string') : [];
    } catch {
      return [];
    }
  }

  private _purgeLegacyUnscopedCachesOnce(): void {
    try {
      if (localStorage.getItem(CACHE_MIGRATION_KEY) === 'true') return;
      this._purgeLegacyUnscopedCaches();
      localStorage.setItem(CACHE_MIGRATION_KEY, 'true');
    } catch {}
  }

  private _purgeLegacyUnscopedCaches(): void {
    try {
      const keysToRemove: string[] = [];
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (
          key &&
          (LEGACY_CACHE_KEYS.has(key) || LEGACY_CACHE_PREFIXES.some(prefix => key.startsWith(prefix))) &&
          !key.includes('__ds3__')
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch {}
  }
}
