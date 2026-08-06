import { Injectable, inject } from '@angular/core';
import { collection, query, onSnapshot, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { timestampToMillis } from '../../shared/utils/timestamp';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';
import * as i0 from "@angular/core";
const CACHE_REGISTRY_KEY = 'lims_delta_sync_registry_v3';
const CACHE_MIGRATION_KEY = 'lims_delta_sync_cache_v3_migrated';
const CURSOR_OVERLAP_MS = 1000;
const MAX_CURSOR_FUTURE_SKEW_MS = 5 * 60 * 1000;
const DEFAULT_RETRY_INITIAL_MS = 1000;
const DEFAULT_RETRY_MAX_MS = 30000;
const DEFAULT_MAX_CATCH_UP_AGE_MS = 14 * 24 * 60 * 60 * 1000;
// Firestore quota errors must not create an unbounded client-side retry loop.
// A later app/session initialization can recover after the quota incident is cleared.
const DEFAULT_RETRY_ATTEMPTS = 3;
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
export function mergeDeltaItems(base, changed, deletedIds = []) {
    const deleted = new Set(deletedIds);
    const items = base.filter(item => !item.id || !deleted.has(item.id));
    changed.forEach(item => {
        if (!item.id || deleted.has(item.id))
            return;
        const index = items.findIndex(existing => existing.id === item.id);
        if (index >= 0)
            items[index] = item;
        else
            items.unshift(item);
    });
    return items;
}
export function replaceDeltaArrayContents(target, source) {
    target.splice(0, target.length, ...source);
    return target;
}
export function deltaValueToMillis(value) {
    return timestampToMillis(value) ?? 0;
}
export function sanitizeDeltaCursorMillis(value, nowMillis = Date.now()) {
    const cursorMillis = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(cursorMillis) || cursorMillis < 0)
        return 0;
    return cursorMillis <= nowMillis + MAX_CURSOR_FUTURE_SKEW_MS ? cursorMillis : 0;
}
export function shouldUseDeltaCache(cachedItemCount, cursorMillis) {
    return cachedItemCount === 0 || sanitizeDeltaCursorMillis(cursorMillis) > 0;
}
export function shouldResetStaleDeltaCache(cursorMillis, lastSyncAtMillis, maxAgeMs = DEFAULT_MAX_CATCH_UP_AGE_MS, nowMillis = Date.now()) {
    if (cursorMillis <= 0 || !Number.isFinite(maxAgeMs) || maxAgeMs <= 0)
        return false;
    // Legacy caches from before the sync-at marker are kept once during the
    // rollout to avoid forcing every existing browser into a full refetch.
    if (lastSyncAtMillis <= 0)
        return false;
    return nowMillis - lastSyncAtMillis > maxAgeMs;
}
export function getMaxDeltaCursorMillis(items, observedCursorMillis = 0, storedCursorMillis = 0, nowMillis = Date.now()) {
    let maxMillis = Math.max(sanitizeDeltaCursorMillis(observedCursorMillis, nowMillis), sanitizeDeltaCursorMillis(storedCursorMillis, nowMillis));
    for (const item of items) {
        maxMillis = Math.max(maxMillis, sanitizeDeltaCursorMillis(deltaValueToMillis(item.lastUpdated), nowMillis));
    }
    return maxMillis;
}
export function sortAndTrimDeltaItems(items, sortField, sortDirection, maxCacheSize) {
    items.sort((a, b) => {
        const rawA = a[sortField];
        const rawB = b[sortField];
        const timeA = deltaValueToMillis(rawA);
        const timeB = deltaValueToMillis(rawB);
        let comparison;
        if (timeA > 0 || timeB > 0) {
            comparison = timeA - timeB;
        }
        else if (typeof rawA === 'string' || typeof rawB === 'string') {
            comparison = String(rawA ?? '').localeCompare(String(rawB ?? ''), undefined, { numeric: true });
        }
        else {
            comparison = Number(rawA ?? 0) - Number(rawB ?? 0);
            if (!Number.isFinite(comparison))
                comparison = 0;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });
    if (Number.isFinite(maxCacheSize) && maxCacheSize >= 0 && items.length > maxCacheSize) {
        items.splice(maxCacheSize);
    }
    return items;
}
function stableScopeHash(value) {
    let hashA = 0x811c9dc5;
    let hashB = 0x9e3779b9;
    for (let index = 0; index < value.length; index++) {
        const code = value.charCodeAt(index);
        hashA = Math.imul(hashA ^ code, 0x01000193);
        hashB = Math.imul(hashB ^ code, 0x85ebca6b);
    }
    return `${(hashA >>> 0).toString(36)}${(hashB >>> 0).toString(36)}`;
}
export function buildDeltaAuthScope(user, permissions = []) {
    if (!user?.uid)
        return 'signed-out';
    const permissionScope = [...new Set(permissions)].sort().join(',');
    return `${user.uid}|${user.role || ''}|${user.roleId || ''}|${permissionScope}`;
}
export function buildScopedDeltaKey(baseKey, authScope) {
    return `${baseKey}__ds3__${stableScopeHash(authScope)}`;
}
export function getDeltaErrorCode(error) {
    const raw = String(error?.code || error?.name || 'unknown');
    const slashIndex = raw.lastIndexOf('/');
    return (slashIndex >= 0 ? raw.slice(slashIndex + 1) : raw).toLowerCase();
}
export function isRetryableDeltaError(error) {
    return !TERMINAL_ERROR_CODES.has(getDeltaErrorCode(error));
}
export function isDeltaAuthorizationError(error) {
    const code = getDeltaErrorCode(error);
    return code === 'permission-denied' || code === 'unauthenticated';
}
export function computeDeltaRetryDelay(attempt, initialDelayMs = DEFAULT_RETRY_INITIAL_MS, maxDelayMs = DEFAULT_RETRY_MAX_MS) {
    const safeAttempt = Math.max(1, Math.floor(attempt));
    const cappedExponent = Math.min(safeAttempt - 1, 30);
    const exponential = Math.max(0, initialDelayMs) * (2 ** cappedExponent);
    return Math.min(Math.max(0, maxDelayMs), exponential);
}
export function isDeltaGenerationActive(currentGeneration, capturedGeneration, destroyed) {
    return !destroyed && currentGeneration === capturedGeneration;
}
export class DeltaSyncService {
    constructor() {
        this.firebaseService = inject(FirebaseService);
        this.fb = this.firebaseService.db;
        this.readMonitor = inject(FirestoreReadMonitor);
        this._singletons = new Map();
        this._diagnostics = [];
        this._purgeLegacyUnscopedCachesOnce();
    }
    startSingletonListener(config, onData) {
        const key = config.cacheKey;
        const existing = this._singletons.get(key);
        if (existing) {
            existing.callbacks.add(onData);
            onData([...existing.memCache]);
            if (existing.status === 'failed' && !existing.retryTimer) {
                existing.retryAttempt = 0;
                this._startSingleton(existing);
            }
            return () => existing.callbacks.delete(onData);
        }
        this._registerStorageKeys(config.cacheKey, config.cursorKey, this._syncAtKey(config.cursorKey));
        const isDeleted = config.isDeletedFn || ((document) => document._isDeleted === true);
        const cachedCursor = this._loadCursor(config.cursorKey, config);
        const resetStaleCache = shouldResetStaleDeltaCache(cachedCursor, this._loadSyncAt(config.cursorKey), config.maxCatchUpAgeMs);
        const cachedItems = (resetStaleCache ? [] : this._loadFromCache(config.cacheKey, config))
            .filter(document => !isDeleted(document));
        if (resetStaleCache)
            this._clearPersistentData(config);
        const memCache = shouldUseDeltaCache(cachedItems.length, cachedCursor) ? cachedItems : [];
        if (cachedItems.length > 0 && memCache.length === 0) {
            this._clearPersistentData(config);
        }
        const entry = {
            key,
            unsub: () => { },
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
            if (current === entry)
                current.callbacks.delete(onData);
        };
    }
    startListener(config, onData) {
        this._registerStorageKeys(config.cacheKey, config.cursorKey, this._syncAtKey(config.cursorKey));
        const isDeleted = config.isDeletedFn || ((document) => document._isDeleted === true);
        const cachedCursor = this._loadCursor(config.cursorKey, config);
        const resetStaleCache = shouldResetStaleDeltaCache(cachedCursor, this._loadSyncAt(config.cursorKey), config.maxCatchUpAgeMs);
        const loadedItems = (resetStaleCache ? [] : this._loadFromCache(config.cacheKey, config))
            .filter(document => !isDeleted(document));
        if (resetStaleCache)
            this._clearPersistentData(config);
        const cachedItems = shouldUseDeltaCache(loadedItems.length, cachedCursor) ? loadedItems : [];
        if (loadedItems.length > 0 && cachedItems.length === 0) {
            this._clearPersistentData(config);
        }
        let listenerUnsub = null;
        let retryTimer = null;
        let retryAttempt = 0;
        let generation = 0;
        let destroyed = false;
        const cleanupListener = () => {
            if (listenerUnsub)
                listenerUnsub();
            listenerUnsub = null;
        };
        const scheduleRetry = (error, phase) => {
            cleanupListener();
            if (destroyed)
                return;
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
            const delay = computeDeltaRetryDelay(retryAttempt, config.retryInitialDelayMs, config.retryMaxDelayMs);
            retryTimer = setTimeout(() => {
                retryTimer = null;
                void start();
            }, delay);
        };
        const attachListener = (capturedGeneration) => {
            const cursor = this._loadCursor(config.cursorKey, config);
            listenerUnsub = this._setupSnapshotListener(config, cursor, cachedItems, data => {
                if (destroyed || capturedGeneration !== generation)
                    return;
                retryAttempt = 0;
                onData(data);
            }, isDeleted, error => scheduleRetry(error, 'listener'));
        };
        const start = async () => {
            if (destroyed)
                return;
            cleanupListener();
            const capturedGeneration = ++generation;
            try {
                if (cachedItems.length === 0) {
                    const items = await this._fetchInitialBatch(config);
                    if (destroyed || capturedGeneration !== generation)
                        return;
                    replaceDeltaArrayContents(cachedItems, items.filter(document => !isDeleted(document)));
                    this._updateCacheAndCursor(cachedItems, config);
                    onData([...cachedItems]);
                }
                else {
                    onData([...cachedItems]);
                }
                if (destroyed || capturedGeneration !== generation)
                    return;
                attachListener(capturedGeneration);
            }
            catch (error) {
                if (destroyed || capturedGeneration !== generation)
                    return;
                scheduleRetry(error, 'initial-fetch');
            }
        };
        void start();
        return () => {
            destroyed = true;
            generation++;
            cleanupListener();
            if (retryTimer)
                clearTimeout(retryTimer);
            retryTimer = null;
        };
    }
    destroySingleton(cacheKey) {
        const entry = this._singletons.get(cacheKey);
        if (!entry)
            return;
        entry.destroyed = true;
        entry.status = 'destroyed';
        entry.generation++;
        entry.unsub();
        entry.unsub = () => { };
        if (entry.retryTimer)
            clearTimeout(entry.retryTimer);
        entry.retryTimer = null;
        entry.callbacks.clear();
        entry.memCache.splice(0);
        this._singletons.delete(cacheKey);
    }
    destroyAll(clearPersistentCaches = false) {
        [...this._singletons.keys()].forEach(key => this.destroySingleton(key));
        if (clearPersistentCaches)
            this.clearAllPersistentCaches();
    }
    destroyInactiveSingletons() {
        [...this._singletons.entries()]
            .filter(([, entry]) => entry.callbacks.size === 0)
            .forEach(([key]) => this.destroySingleton(key));
    }
    clearCache(cacheKey, cursorKey) {
        try {
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cursorKey);
            localStorage.removeItem(this._syncAtKey(cursorKey));
            this._unregisterStorageKeys(cacheKey, cursorKey, this._syncAtKey(cursorKey));
        }
        catch { }
    }
    clearAllPersistentCaches() {
        try {
            const registered = this._loadStorageRegistry();
            registered.forEach(key => localStorage.removeItem(key));
            const scopedKeys = [];
            for (let index = 0; index < localStorage.length; index++) {
                const key = localStorage.key(index);
                if (key?.includes('__ds3__'))
                    scopedKeys.push(key);
            }
            scopedKeys.forEach(key => localStorage.removeItem(key));
            localStorage.removeItem(CACHE_REGISTRY_KEY);
            this._purgeLegacyUnscopedCaches();
        }
        catch { }
    }
    getCache(key) {
        const entry = this._singletons.get(key);
        if (entry)
            return [...entry.memCache];
        return this._loadFromCache(key);
    }
    getMemCache(key) {
        const entry = this._singletons.get(key);
        return entry ? [...entry.memCache] : null;
    }
    getSingletonStatus(key) {
        return this._singletons.get(key)?.status ?? null;
    }
    /**
     * Wait for an already-registered singleton to finish its initial fetch.
     * This is intentionally read-free; callers can reuse the singleton cache
     * instead of issuing a second getDocs() for the same collection.
     */
    waitForSingletonReady(key, timeoutMs = 10000) {
        const startedAt = Date.now();
        return new Promise(resolve => {
            const check = () => {
                const status = this._singletons.get(key)?.status;
                if (status === 'listening') {
                    resolve(true);
                    return;
                }
                if (!status || status === 'failed' || Date.now() - startedAt >= timeoutMs) {
                    resolve(false);
                    return;
                }
                setTimeout(check, 50);
            };
            check();
        });
    }
    getDiagnostics() {
        return this._diagnostics.map(diagnostic => ({ ...diagnostic }));
    }
    mergeSingletonCache(key, changed, deletedIds = []) {
        const entry = this._singletons.get(key);
        const base = entry?.memCache ?? this._loadFromCache(key);
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
        }
        catch (error) {
            this._recordDiagnostic(entry?.config ?? { cacheKey: key, cursorKey: '', collectionPath: 'local-cache' }, error, 'cache-write', 0, false);
        }
        return [...published];
    }
    _startSingleton(entry) {
        if (entry.destroyed || this._singletons.get(entry.key) !== entry)
            return;
        entry.unsub();
        entry.unsub = () => { };
        if (entry.retryTimer)
            clearTimeout(entry.retryTimer);
        entry.retryTimer = null;
        entry.status = 'starting';
        const capturedGeneration = ++entry.generation;
        const isDeleted = entry.config.isDeletedFn || ((document) => document._isDeleted === true);
        const finish = async () => {
            try {
                if (entry.memCache.length === 0) {
                    const items = await this._fetchInitialBatch(entry.config);
                    if (!this._entryIsActive(entry, capturedGeneration))
                        return;
                    replaceDeltaArrayContents(entry.memCache, items.filter(document => !isDeleted(document)));
                    this._updateCacheAndCursor(entry.memCache, entry.config);
                    this._emitEntry(entry);
                }
                if (!this._entryIsActive(entry, capturedGeneration))
                    return;
                this._attachSingletonSnapshot(entry, capturedGeneration, isDeleted);
            }
            catch (error) {
                if (!this._entryIsActive(entry, capturedGeneration))
                    return;
                this._handleSingletonError(entry, error, 'initial-fetch');
            }
        };
        void finish();
    }
    _attachSingletonSnapshot(entry, capturedGeneration, isDeleted) {
        const cursor = this._loadCursor(entry.config.cursorKey, entry.config);
        entry.unsub = this._setupSnapshotListener(entry.config, cursor, entry.memCache, data => {
            if (!this._entryIsActive(entry, capturedGeneration))
                return;
            entry.retryAttempt = 0;
            entry.status = 'listening';
            this._emitEntry(entry, data);
        }, isDeleted, error => {
            if (!this._entryIsActive(entry, capturedGeneration))
                return;
            this._handleSingletonError(entry, error, 'listener');
        }, () => {
            if (this._entryIsActive(entry, capturedGeneration)) {
                entry.retryAttempt = 0;
                entry.status = 'listening';
            }
        });
    }
    _handleSingletonError(entry, error, phase) {
        entry.unsub();
        entry.unsub = () => { };
        entry.retryAttempt++;
        const maxAttempts = entry.config.retryMaxAttempts ?? DEFAULT_RETRY_ATTEMPTS;
        const willRetry = isRetryableDeltaError(error) && entry.retryAttempt <= maxAttempts;
        const diagnostic = this._recordDiagnostic(entry.config, error, phase, entry.retryAttempt, willRetry);
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
        const delay = computeDeltaRetryDelay(entry.retryAttempt, entry.config.retryInitialDelayMs, entry.config.retryMaxDelayMs);
        entry.retryTimer = setTimeout(() => {
            entry.retryTimer = null;
            if (!entry.destroyed && this._singletons.get(entry.key) === entry) {
                this._startSingleton(entry);
            }
        }, delay);
    }
    _setupSnapshotListener(config, cursorMillis, cachedItems, onData, isDeleted, onError, onReady) {
        const colRef = collection(this.fb, config.collectionPath);
        const constraints = config.queryConstraints || [];
        const snapshotQuery = cursorMillis > 0
            ? query(colRef, ...constraints, where('lastUpdated', '>', new Date(Math.max(0, cursorMillis - CURSOR_OVERLAP_MS))), orderBy('lastUpdated', 'asc'))
            : query(colRef, ...constraints, orderBy('lastUpdated', 'desc'), limit(100));
        let isFirstSnapshot = true;
        return onSnapshot(snapshotQuery, snapshot => {
            const changedDocuments = snapshot.docChanges()
                .filter(change => change.type !== 'removed')
                .length;
            this.readMonitor.record('onSnapshot', config.collectionPath, isFirstSnapshot ? snapshot.size : changedDocuments, {
                phase: isFirstSnapshot ? 'initial' : 'delta',
                fromCache: snapshot.metadata.fromCache
            });
            isFirstSnapshot = false;
            onReady?.();
            let hasChanges = false;
            let observedCursorMillis = cursorMillis;
            snapshot.docChanges().forEach(change => {
                const docData = change.doc.data();
                docData.id = change.doc.id;
                this._normalizeTimestamps(docData, config.orderByField || 'timestamp');
                observedCursorMillis = Math.max(observedCursorMillis, deltaValueToMillis(docData.lastUpdated));
                if (change.type === 'removed' || isDeleted(docData)) {
                    const index = cachedItems.findIndex(item => item.id === docData.id);
                    if (index !== -1) {
                        cachedItems.splice(index, 1);
                        hasChanges = true;
                    }
                }
                else {
                    const index = cachedItems.findIndex(item => item.id === docData.id);
                    if (index !== -1)
                        cachedItems[index] = docData;
                    else
                        cachedItems.push(docData);
                    hasChanges = true;
                }
            });
            if (!snapshot.empty) {
                this._updateCacheAndCursor(cachedItems, config, observedCursorMillis);
            }
            if (hasChanges)
                onData([...cachedItems]);
        }, onError);
    }
    async _fetchInitialBatch(config) {
        const colRef = collection(this.fb, config.collectionPath);
        const maxCacheSize = config.maxCacheSize || 1000;
        const constraints = config.queryConstraints || [];
        const initialOrderField = config.initialOrderByField || 'lastUpdated';
        const initialOrderDirection = config.initialOrderDirection || 'desc';
        const initialQuery = config.initialCollectionScan
            ? query(colRef, ...constraints, limit(maxCacheSize))
            : query(colRef, ...constraints, orderBy(initialOrderField, initialOrderDirection), limit(maxCacheSize));
        const snapshot = await getDocs(initialQuery);
        this.readMonitor.record('getDocs', config.collectionPath, snapshot.size, { phase: 'initial' });
        const items = [];
        snapshot.forEach(document => {
            const data = document.data();
            data.id = document.id;
            this._normalizeTimestamps(data, config.orderByField || 'timestamp');
            items.push(data);
        });
        return items;
    }
    _normalizeTimestamps(data, sortField) {
        const normalize = (value) => {
            if (!value || typeof value.toMillis !== 'function')
                return value;
            const milliseconds = value.toMillis();
            return {
                seconds: Math.floor(milliseconds / 1000),
                nanoseconds: typeof value.nanoseconds === 'number' ? value.nanoseconds : 0,
                milliseconds
            };
        };
        data.lastUpdated = normalize(data.lastUpdated);
        if (sortField !== 'lastUpdated')
            data[sortField] = normalize(data[sortField]);
    }
    _updateCacheAndCursor(items, config, observedCursorMillis = 0) {
        const sortField = config.orderByField || 'timestamp';
        const sortDirection = config.orderDirection || 'desc';
        const maxCacheSize = config.maxCacheSize || 1000;
        const storedCursor = this._loadCursor(config.cursorKey, config);
        const cursorMillis = getMaxDeltaCursorMillis(items, observedCursorMillis, storedCursor);
        sortAndTrimDeltaItems(items, sortField, sortDirection, maxCacheSize);
        try {
            localStorage.setItem(config.cacheKey, JSON.stringify(items));
            if (cursorMillis > 0) {
                localStorage.setItem(config.cursorKey, cursorMillis.toString());
                localStorage.setItem(this._syncAtKey(config.cursorKey), Date.now().toString());
            }
        }
        catch (error) {
            this._recordDiagnostic(config, error, 'cache-write', 0, false);
        }
        return cursorMillis;
    }
    _loadFromCache(key, config) {
        try {
            const data = localStorage.getItem(key);
            if (!data)
                return [];
            const parsed = JSON.parse(data);
            if (!Array.isArray(parsed))
                throw new Error('Delta cache payload is not an array.');
            return parsed;
        }
        catch (error) {
            try {
                localStorage.removeItem(key);
            }
            catch { }
            if (config)
                this._recordDiagnostic(config, error, 'cache-read', 0, false);
            return [];
        }
    }
    _loadCursor(key, config) {
        try {
            const data = localStorage.getItem(key);
            if (!data)
                return 0;
            const parsed = sanitizeDeltaCursorMillis(data);
            if (parsed === 0 && Number(data) !== 0)
                throw new Error('Delta cursor is invalid or too far in the future.');
            return parsed;
        }
        catch (error) {
            try {
                localStorage.removeItem(key);
            }
            catch { }
            if (config)
                this._recordDiagnostic(config, error, 'cache-read', 0, false);
            return 0;
        }
    }
    _clearPersistentData(config) {
        try {
            localStorage.removeItem(config.cacheKey);
            localStorage.removeItem(config.cursorKey);
            localStorage.removeItem(this._syncAtKey(config.cursorKey));
        }
        catch { }
    }
    _syncAtKey(cursorKey) {
        return `${cursorKey}__syncAt`;
    }
    _loadSyncAt(cursorKey) {
        try {
            const value = Number(localStorage.getItem(this._syncAtKey(cursorKey)) || 0);
            return Number.isFinite(value) && value > 0 ? value : 0;
        }
        catch {
            return 0;
        }
    }
    _entryIsActive(entry, capturedGeneration) {
        return this._singletons.get(entry.key) === entry
            && isDeltaGenerationActive(entry.generation, capturedGeneration, entry.destroyed);
    }
    _emitEntry(entry, data = entry.memCache) {
        entry.callbacks.forEach(callback => {
            try {
                callback([...data]);
            }
            catch (error) {
                console.error('[DeltaSync] Subscriber callback failed:', error);
            }
        });
    }
    _recordDiagnostic(config, error, phase, attempt, willRetry) {
        const diagnostic = {
            timestamp: Date.now(),
            phase,
            collectionPath: config.collectionPath,
            cacheKey: config.cacheKey,
            errorCode: getDeltaErrorCode(error),
            message: String(error?.message || error || 'Unknown DeltaSync error'),
            attempt,
            willRetry
        };
        this._diagnostics.push(diagnostic);
        if (this._diagnostics.length > 100)
            this._diagnostics.splice(0, this._diagnostics.length - 100);
        config.onError?.(diagnostic);
        console.warn(`[DeltaSync] ${diagnostic.phase} ${diagnostic.collectionPath}: ${diagnostic.errorCode} `
            + `(attempt ${diagnostic.attempt}, retry=${diagnostic.willRetry})`, diagnostic);
        return diagnostic;
    }
    _registerStorageKeys(...keys) {
        try {
            const registry = new Set(this._loadStorageRegistry());
            keys.filter(Boolean).forEach(key => registry.add(key));
            localStorage.setItem(CACHE_REGISTRY_KEY, JSON.stringify([...registry]));
        }
        catch { }
    }
    _unregisterStorageKeys(...keys) {
        try {
            const removed = new Set(keys);
            const registry = this._loadStorageRegistry().filter(key => !removed.has(key));
            if (registry.length)
                localStorage.setItem(CACHE_REGISTRY_KEY, JSON.stringify(registry));
            else
                localStorage.removeItem(CACHE_REGISTRY_KEY);
        }
        catch { }
    }
    _loadStorageRegistry() {
        try {
            const raw = localStorage.getItem(CACHE_REGISTRY_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed.filter(key => typeof key === 'string') : [];
        }
        catch {
            return [];
        }
    }
    _purgeLegacyUnscopedCachesOnce() {
        try {
            if (localStorage.getItem(CACHE_MIGRATION_KEY) === 'true')
                return;
            this._purgeLegacyUnscopedCaches();
            localStorage.setItem(CACHE_MIGRATION_KEY, 'true');
        }
        catch { }
    }
    _purgeLegacyUnscopedCaches() {
        try {
            const keysToRemove = [];
            for (let index = 0; index < localStorage.length; index++) {
                const key = localStorage.key(index);
                if (key &&
                    (LEGACY_CACHE_KEYS.has(key) || LEGACY_CACHE_PREFIXES.some(prefix => key.startsWith(prefix))) &&
                    !key.includes('__ds3__')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }
        catch { }
    }
    static { this.ɵfac = function DeltaSyncService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DeltaSyncService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DeltaSyncService, factory: DeltaSyncService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DeltaSyncService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
//# sourceMappingURL=delta-sync.service.js.map