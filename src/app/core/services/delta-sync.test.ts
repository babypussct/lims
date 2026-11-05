import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { StandardCacheService } from '../../features/standards/services/standard-cache.service';
import {
  DeltaSyncService,
  buildDeltaAuthScope,
  buildDeltaStorageEvictionPlan,
  buildScopedDeltaKey,
  computeDeltaRetryDelay,
  deltaValueToMillis,
  getDeltaErrorCode,
  getDeltaStorageScopeId,
  getMaxDeltaCursorMillis,
  isDeltaAuthorizationError,
  isDeltaGenerationActive,
  isDeltaResourceExhaustedError,
  isDeltaStorageQuotaError,
  isRetryableDeltaError,
  mergeDeltaItems,
  replaceDeltaArrayContents,
  resolveDeltaListenerConstraints,
  shouldResetStaleDeltaCache,
  sanitizeDeltaCursorMillis,
  shouldUseDeltaCache,
  sortAndTrimDeltaItems
} from './delta-sync.service';

test('allows the live delta listener to drop initial-only query constraints', () => {
  const initialConstraints = [{ kind: 'pending-only' }] as any[];
  assert.equal(
    resolveDeltaListenerConstraints({ queryConstraints: initialConstraints }),
    initialConstraints
  );
  assert.deepEqual(
    resolveDeltaListenerConstraints({
      queryConstraints: initialConstraints,
      listenerQueryConstraints: []
    }),
    []
  );
});

test('complete catalogue never promotes a bounded delta cache and shares only verified full loads', async () => {
  const cache = Object.create(StandardCacheService.prototype) as any;
  cache.fb = { APP_ID: 'complete-test' };
  cache.auth = { getDeltaCacheScope: () => 'complete-test' };
  cache.deltaSync = { getCache: () => [{ id: 'recent', status: 'AVAILABLE' }], getResourceLimitState: () => null };
  cache._saveStdToCache = () => {};
  let fullLoads = 0;
  let finish!: (rows: any[]) => void;
  cache.loadCompleteCatalogueRows = () => {
    fullLoads++;
    return new Promise(resolve => { finish = resolve; });
  };
  const first = cache.getCompleteCatalogue();
  const second = cache.getCompleteCatalogue();
  assert.equal(fullLoads, 1);
  finish([{ id: 'recent', status: 'AVAILABLE' }, { id: 'legacy', status: 'AVAILABLE' }]);
  assert.deepEqual((await first).map(row => row.id).sort(), ['legacy', 'recent']);
  assert.deepEqual(await second, await first);
  assert.equal((await cache.getCompleteCatalogue()).length, 2);
  assert.equal(fullLoads, 1);
  cache._handleDeltaSyncData([{ id: 'recent', status: 'AVAILABLE' }], () => {});
  assert.equal(cache.getCompleteCatalogueFromMemory(), null, 'remote updates invalidate full snapshots');
});

test('healthy IndexedDB persists snapshot and cursor without writing localStorage payloads', async () => {
  const service = Object.create(DeltaSyncService.prototype) as any;
  service._volatileCursors = new Map();
  service._loadCursor = () => 0;
  const writes: any[] = [];
  service._idbStorage = { isAvailable: () => true, set: async (...args: any[]) => { writes.push(args); return true; } };
  service._persistLegacyCache = () => { throw new Error('localStorage quota path must not run'); };
  service._updateCacheAndCursor([{ id: 'large', lastUpdated: 1700000000000 }], {
    cacheKey: 'large-cache', cursorKey: 'large-cursor', collectionPath: 'standards', orderByField: 'lastUpdated',
  });
  await Promise.resolve();
  assert.equal(writes.length, 1);
  assert.equal(writes[0][2], 1700000000000, 'cursor is committed with its snapshot');
});

test('merges optimistic delta changes without duplicating ids', () => {
  const base = [
    { id: 'a', value: 1 },
    { id: 'b', value: 2 }
  ];
  const result = mergeDeltaItems(base, [
    { id: 'b', value: 20 },
    { id: 'c', value: 3 }
  ]);

  assert.deepEqual(result, [
    { id: 'c', value: 3 },
    { id: 'a', value: 1 },
    { id: 'b', value: 20 }
  ]);
  assert.deepEqual(base, [
    { id: 'a', value: 1 },
    { id: 'b', value: 2 }
  ]);
});

test('removes deleted ids and does not reinsert them from the changed set', () => {
  const result = mergeDeltaItems(
    [{ id: 'a' }, { id: 'b' }],
    [{ id: 'b' }, { id: 'c' }],
    ['b']
  );

  assert.deepEqual(result, [{ id: 'c' }, { id: 'a' }]);
});

test('scopes persistent cache keys by user, role and normalized permissions', () => {
  const managerScope = buildDeltaAuthScope(
    { uid: 'manager-1', role: 'manager', roleId: 'role-manager' },
    ['standard_edit', '*', 'standard_edit']
  );
  const sameManagerScope = buildDeltaAuthScope(
    { uid: 'manager-1', role: 'manager', roleId: 'role-manager' },
    ['*', 'standard_edit']
  );
  const otherUserScope = buildDeltaAuthScope(
    { uid: 'manager-2', role: 'manager', roleId: 'role-manager' },
    ['*', 'standard_edit']
  );

  assert.equal(managerScope, sameManagerScope);
  assert.notEqual(managerScope, otherUserScope);
  assert.equal(
    buildScopedDeltaKey('standards', managerScope),
    buildScopedDeltaKey('standards', sameManagerScope)
  );
  assert.notEqual(
    buildScopedDeltaKey('standards', managerScope),
    buildScopedDeltaKey('standards', otherUserScope)
  );
  assert.equal(buildDeltaAuthScope(null), 'signed-out');
});

test('evicts stale auth scopes before inactive caches from the current scope', () => {
  const currentCache = buildScopedDeltaKey('inventory_cache', 'user-a');
  const currentCursor = buildScopedDeltaKey('inventory_cursor', 'user-a');
  const inactiveCurrent = buildScopedDeltaKey('sops_cache', 'user-a');
  const oldCache = buildScopedDeltaKey('inventory_cache', 'user-b');
  const oldCursor = buildScopedDeltaKey('inventory_cursor', 'user-b');
  const oldSyncAt = `${oldCursor}__syncAt`;

  assert.equal(getDeltaStorageScopeId(currentCache), getDeltaStorageScopeId(currentCursor));
  assert.equal(getDeltaStorageScopeId(oldCursor), getDeltaStorageScopeId(oldSyncAt));

  const plan = buildDeltaStorageEvictionPlan(
    [oldCache, inactiveCurrent, oldCursor, currentCache, currentCursor, oldSyncAt],
    [currentCache, currentCursor],
    currentCache
  );

  assert.deepEqual(plan.foreignScope, [oldCache, oldCursor, oldSyncAt]);
  assert.deepEqual(plan.inactiveCurrentScope, [inactiveCurrent]);
});

test('normalizes all supported timestamp shapes', () => {
  assert.equal(deltaValueToMillis(new Date('2026-07-29T00:00:00.000Z')), 1785283200000);
  assert.equal(deltaValueToMillis({ seconds: 10, nanoseconds: 999_000_000 }), 10999);
  assert.equal(deltaValueToMillis({ milliseconds: 1234 }), 1234);
  assert.equal(deltaValueToMillis({ toMillis: () => 5678 }), 5678);
  assert.equal(deltaValueToMillis('not-a-date'), 0);
});

test('keeps the cursor monotonic, including tombstone-only snapshots', () => {
  const cursor = getMaxDeltaCursorMillis(
    [{ lastUpdated: { seconds: 3 } }, { lastUpdated: 2500 }],
    5000,
    4000
  );
  assert.equal(cursor, 5000);
});

test('rejects corrupt future cursors and cache entries without a valid cursor', () => {
  const now = 10_000;
  assert.equal(sanitizeDeltaCursorMillis(now + 60_000, now), now + 60_000);
  assert.equal(sanitizeDeltaCursorMillis(now + 10 * 60_000, now), 0);
  assert.equal(sanitizeDeltaCursorMillis('invalid', now), 0);
  assert.equal(shouldUseDeltaCache(3, 0), false);
  assert.equal(shouldUseDeltaCache(3, 1000), true);
  assert.equal(shouldUseDeltaCache(0, 0), true);
  assert.equal(
    getMaxDeltaCursorMillis(
      [{ lastUpdated: now + 10 * 60_000 }, { lastUpdated: 9000 }],
      0,
      0,
      now
    ),
    9000
  );
});

test('resets a cache with an old sync timestamp before catch-up', () => {
  const now = 100_000;
  assert.equal(shouldResetStaleDeltaCache(90_000, 90_000, 10_000, now), false);
  assert.equal(shouldResetStaleDeltaCache(90_000, 80_000, 10_000, now), true);
  assert.equal(shouldResetStaleDeltaCache(90_000, 0, 10_000, now), false);
  assert.equal(shouldResetStaleDeltaCache(0, 0, 10_000, now), false);
});

test('sorts timestamp and natural string fields before trimming', () => {
  const timestampItems = [
    { id: 'old', updated: { seconds: 1 } },
    { id: 'new', updated: { toMillis: () => 3000 } },
    { id: 'middle', updated: 2000 }
  ];
  sortAndTrimDeltaItems(timestampItems, 'updated', 'desc', 2);
  assert.deepEqual(timestampItems.map(item => item.id), ['new', 'middle']);

  const names = [{ name: 'Item 10' }, { name: 'Item 2' }, { name: 'Item 1' }];
  sortAndTrimDeltaItems(names, 'name', 'asc', 10);
  assert.deepEqual(names.map(item => item.name), ['Item 1', 'Item 2', 'Item 10']);
});

test('keeps the complete history when cache size is explicitly unbounded', () => {
  const items = [
    { id: 'old', updated: 1000 },
    { id: 'middle', updated: 2000 },
    { id: 'new', updated: 3000 }
  ];
  sortAndTrimDeltaItems(items, 'updated', 'desc', Number.POSITIVE_INFINITY);
  assert.deepEqual(items.map(item => item.id), ['new', 'middle', 'old']);
});

test('updates the canonical array without replacing its identity', () => {
  const cache = [{ id: 'old' }];
  const identity = cache;
  const result = replaceDeltaArrayContents(cache, [{ id: 'new' }]);
  assert.equal(result, identity);
  assert.deepEqual(cache, [{ id: 'new' }]);
});

test('classifies retryable errors and caps exponential retry delay', () => {
  assert.equal(getDeltaErrorCode({ code: 'firestore/permission-denied' }), 'permission-denied');
  assert.equal(getDeltaErrorCode({ code: 22, name: 'QuotaExceededError' }), 'quotaexceedederror');
  assert.equal(getDeltaErrorCode({ code: 7, name: 'Error' }), '7');
  assert.equal(isDeltaStorageQuotaError({ code: 22, name: 'QuotaExceededError' }), true);
  assert.equal(isDeltaStorageQuotaError({ code: 'unavailable' }), false);
  assert.equal(isRetryableDeltaError({ code: 'permission-denied' }), false);
  assert.equal(isRetryableDeltaError({ code: 'unavailable' }), true);
  assert.equal(isDeltaAuthorizationError({ code: 'firestore/permission-denied' }), true);
  assert.equal(isDeltaAuthorizationError({ code: 'unauthenticated' }), true);
  assert.equal(isDeltaAuthorizationError({ code: 'unavailable' }), false);
  assert.equal(computeDeltaRetryDelay(1, 100, 500), 100);
  assert.equal(computeDeltaRetryDelay(4, 100, 500), 500);
  assert.equal(computeDeltaRetryDelay(10_000, 100, 500), 500);
});

test('rejects stale generations after destroy or restart', () => {
  assert.equal(isDeltaGenerationActive(3, 3, false), true);
  assert.equal(isDeltaGenerationActive(4, 3, false), false);
  assert.equal(isDeltaGenerationActive(3, 3, true), false);
});

test('singleton releases dispose only the last live subscriber and clear retry state', async () => {
  const service = Object.create(DeltaSyncService.prototype) as any;
  const singletonEntries = new Map<string, any>();
  const listenerCloses: number[] = [];
  const retryFires: number[] = [];
  let listenerId = 0;

  service._singletons = singletonEntries;
  service._registerStorageKeys = () => {};
  service._loadCursor = () => 0;
  service._loadSyncAt = () => 0;
  service._loadFromCache = () => [];
  service._startSingleton = (entry: any) => {
    const id = ++listenerId;
    entry.unsub = () => listenerCloses.push(id);
    entry.retryTimer = setTimeout(() => retryFires.push(id), 25);
  };

  const config = {
    cacheKey: 'test-singleton',
    cursorKey: 'test-singleton-cursor',
    collectionPath: 'artifacts/test/items'
  };
  const firstRelease = service.startSingletonListener(config, () => {});
  const secondRelease = service.startSingletonListener(config, () => {});

  assert.equal(singletonEntries.size, 1);
  firstRelease();
  assert.equal(singletonEntries.size, 1);
  assert.deepEqual(listenerCloses, []);

  secondRelease();
  secondRelease();
  assert.equal(singletonEntries.size, 0);
  assert.deepEqual(listenerCloses, [1]);

  const recreatedRelease = service.startSingletonListener(config, () => {});
  firstRelease();
  assert.equal(singletonEntries.size, 1);
  assert.deepEqual(listenerCloses, [1]);

  recreatedRelease();
  assert.equal(singletonEntries.size, 0);
  assert.deepEqual(listenerCloses, [1, 2]);
  await new Promise(resolve => setTimeout(resolve, 40));
  assert.deepEqual(retryFires, []);
});

test('recognizes structured resource-exhausted errors without matching bare 429 substrings or DOM storage quota', () => {
  assert.equal(isDeltaResourceExhaustedError({ code: 'resource-exhausted' }), true);
  assert.equal(isDeltaResourceExhaustedError({ code: 'firestore/resource-exhausted' }), true);
  assert.equal(isDeltaResourceExhaustedError({ code: 8, message: 'Grpc error' }), true);
  assert.equal(isDeltaResourceExhaustedError({ status: 429, message: 'Too Many Requests' }), true);
  assert.equal(isDeltaResourceExhaustedError({ statusCode: 429 }), true);
  assert.equal(
    isDeltaResourceExhaustedError({ message: 'Wrapper failed', cause: { code: 'firestore/resource-exhausted' } }),
    true,
  );
  assert.equal(isDeltaResourceExhaustedError(new Error('Quota exceeded for quota metric')), true);
  assert.equal(isDeltaResourceExhaustedError(new Error('FirebaseError: RESOURCE_EXHAUSTED')), true);

  // Must NOT match bare "429" in lot numbers, document IDs, or unrelated business errors
  assert.equal(isDeltaResourceExhaustedError(new Error('Lot 429 not found in catalogue')), false);
  assert.equal(isDeltaResourceExhaustedError({ code: 'invalid-argument', message: 'Standard 42901 is invalid' }), false);

  // Must NOT confuse browser localStorage QuotaExceededError with Firestore resource-exhausted
  assert.equal(
    isDeltaResourceExhaustedError({ name: 'QuotaExceededError', code: 22, message: 'QuotaExceededError: quota exceeded' }),
    false,
  );
  assert.equal(isRetryableDeltaError({ code: 'resource-exhausted' }), false);
  assert.equal(isRetryableDeltaError({ code: 'firestore/resource-exhausted' }), false);
});

test('pauses singleton listener on resource-exhausted across subscriber additions, route changes, and in-flight getDocs until manual retry', async () => {
  const service = Object.create(DeltaSyncService.prototype) as any;
  service._singletons = new Map<string, any>();
  service._resourceLimitPauses = new Map<string, any>();
  service._diagnostics = [];
  service._persistenceDisabledKeys = new Set<string>();
  service._volatileCursors = new Map<string, number>();
  service._registerStorageKeys = () => {};
  service._loadCursor = () => 1000;
  service._loadSyncAt = () => Date.now();
  service._loadFromCache = () => [{ id: 'std-1', name: 'Caffeine' }];

  let startCalls = 0;
  let attachCalls = 0;
  service._attachSingletonSnapshot = () => {
    attachCalls++;
  };
  service._startSingleton = (entry: any) => {
    startCalls++;
    entry.status = 'starting';
    entry.generation++;
  };

  const scopedCacheKey = buildScopedDeltaKey('standards_cache', 'user-1');
  const scopedCursorKey = buildScopedDeltaKey('standards_cursor', 'user-1');
  const otherScopedCacheKey = buildScopedDeltaKey('standards_cache', 'user-2');
  const errorsRecorded: unknown[] = [];

  const config = {
    cacheKey: scopedCacheKey,
    cursorKey: scopedCursorKey,
    collectionPath: 'artifacts/app/reference_standards',
    onError: (err: unknown) => errorsRecorded.push(err),
  };

  const emittedFirst: any[][] = [];
  const release1 = service.startSingletonListener(
    config,
    (items: any[]) => emittedFirst.push(items),
  );
  assert.equal(startCalls, 1);
  assert.equal(emittedFirst.length, 1);
  assert.deepEqual(emittedFirst[0].map((i: any) => i.id), ['std-1']);

  const entry = service._singletons.get(scopedCacheKey);
  assert.ok(entry);
  const inFlightGeneration = entry.generation;

  // Simulate resource-exhausted while listener is starting/active
  const quotaErr = { code: 'firestore/resource-exhausted', message: 'Quota exceeded.' };
  service._handleSingletonError(entry, quotaErr, 'listener');

  assert.equal(service.isResourceLimitPaused(scopedCacheKey), true);
  assert.equal(entry.status, 'failed');
  assert.equal(entry.retryTimer, null);
  assert.equal(errorsRecorded.length, 1);
  assert.notEqual(entry.generation, inFlightGeneration);

  // If an in-flight getDocs from inFlightGeneration finishes late, its generation is now stale
  assert.equal(
    !service._entryIsActive(entry, inFlightGeneration) || service.isResourceLimitPaused(entry.key),
    true,
  );
  assert.equal(attachCalls, 0);

  // Case 1a: Adding a new subscriber while paused does NOT restart sync, but emits valid cached data
  const emittedSecond: any[][] = [];
  const release2 = service.startSingletonListener(
    config,
    (items: any[]) => emittedSecond.push(items),
  );
  assert.equal(startCalls, 1);
  assert.equal(emittedSecond.length, 1);

  // Case 1b: Route change destroys all subscribers and recreates listener in same pause cycle -> stays paused
  release1();
  release2();
  assert.equal(service._singletons.size, 0);
  assert.equal(service.isResourceLimitPaused(scopedCacheKey), true);

  const emittedAfterRoute: any[][] = [];
  const release3 = service.startSingletonListener(
    config,
    (items: any[]) => emittedAfterRoute.push(items),
  );
  assert.equal(startCalls, 1, 'must not restart singleton after route change while paused');
  assert.equal(emittedAfterRoute.length, 1, 'still emits valid cached items on route re-entry');

  // Case 3: Manual retry resumes sync once; rapid repeated calls while starting are ignored
  const retried1 = service.retryResourceLimitedSync(scopedCacheKey);
  const retried2 = service.retryResourceLimitedSync(scopedCacheKey);
  assert.equal(retried1, true);
  assert.equal(retried2, false, 'rapid duplicate retry while starting must be ignored');
  assert.equal(startCalls, 2);
  assert.equal(service.isResourceLimitPaused(scopedCacheKey), false);

  // Case 4: Manual retry hits resource-exhausted again -> re-pauses without retry timer
  const currentEntry = service._singletons.get(scopedCacheKey);
  service._handleSingletonError(currentEntry, quotaErr, 'initial-fetch');
  assert.equal(service.isResourceLimitPaused(scopedCacheKey), true);
  assert.equal(currentEntry.status, 'failed');
  assert.equal(currentEntry.retryTimer, null);

  // Case 5: Sign-out / scope change clears pause state for that scope only
  service._recordResourceLimitPause(
    { cacheKey: otherScopedCacheKey, cursorKey: 'c2', collectionPath: config.collectionPath },
    currentEntry.lastError,
    false,
  );
  service.clearResourceLimitPausesForScope(scopedCacheKey);
  assert.equal(service.isResourceLimitPaused(scopedCacheKey), false);
  assert.equal(service.isResourceLimitPaused(otherScopedCacheKey), true);

  release3();
});

test('does not emit empty array as valid data when paused on resource-exhausted without a valid cache', () => {
  const service = Object.create(DeltaSyncService.prototype) as any;
  service._singletons = new Map<string, any>();
  service._resourceLimitPauses = new Map<string, any>();
  service._diagnostics = [];
  service._persistenceDisabledKeys = new Set<string>();
  service._volatileCursors = new Map<string, number>();
  service._registerStorageKeys = () => {};
  service._loadCursor = () => 0;
  service._loadSyncAt = () => 0;
  service._loadFromCache = () => [];
  service._startSingleton = (entry: any) => {
    entry.status = 'starting';
    entry.generation++;
  };

  const errors: unknown[] = [];
  const config = {
    cacheKey: 'empty_cache',
    cursorKey: 'empty_cursor',
    collectionPath: 'artifacts/app/reference_standards',
    onError: (err: unknown) => errors.push(err),
  };

  const emitted: any[][] = [];
  const release1 = service.startSingletonListener(
    config,
    (items: any[]) => emitted.push(items),
  );
  const entry = service._singletons.get(config.cacheKey);
  service._handleSingletonError(entry, { code: 'resource-exhausted', message: 'Quota exceeded' }, 'initial-fetch');

  assert.equal(emitted.length, 0, 'must not emit [] when cache was never initialized');
  assert.equal(errors.length, 1);

  const emittedLate: any[][] = [];
  const release2 = service.startSingletonListener(
    config,
    (items: any[]) => emittedLate.push(items),
  );
  assert.equal(emittedLate.length, 0, 'late subscriber while paused without cache must not receive []');
  assert.equal(errors.length, 2, 'late subscriber without usable cache receives error callback');

  release1();
  release2();
});


test('real _startSingleton discards late-resolving _fetchInitialBatch promise after resource-exhausted pause without attaching snapshot listener', async () => {
  const service = Object.create(DeltaSyncService.prototype) as any;
  service._singletons = new Map<string, any>();
  service._resourceLimitPauses = new Map<string, any>();
  service._diagnostics = [];
  service._persistenceDisabledKeys = new Set<string>();
  service._volatileCursors = new Map<string, number>();
  service._registerStorageKeys = () => {};
  service._loadCursor = () => 0;
  service._loadSyncAt = () => 0;
  service._loadFromCache = () => [];

  let resolveInFlightFetch!: () => void;
  let attachCalls = 0;
  service._attachSingletonSnapshot = () => {
    attachCalls++;
  };
  service._fetchInitialBatch = () =>
    new Promise<any[]>(resolve => {
      resolveInFlightFetch = () => {
        resolve([{ id: 'late-doc', lastUpdated: 5000 }]);
      };
    });

  const config = {
    cacheKey: 'real_start_singleton_cache',
    cursorKey: 'real_start_singleton_cursor',
    collectionPath: 'artifacts/app/reference_standards',
  };

  const emitted: any[][] = [];
  const release = service.startSingletonListener(config, (items: any[]) => emitted.push(items));
  const entry = service._singletons.get(config.cacheKey);
  assert.ok(entry);
  assert.equal(entry.status, 'starting');

  // Pause the singleton due to resource-exhausted while _fetchInitialBatch is still in flight
  service._handleSingletonError(
    entry,
    { code: 'firestore/resource-exhausted', message: 'Quota exceeded while initial fetch in flight' },
    'listener',
  );
  assert.equal(service.isResourceLimitPaused(config.cacheKey), true);
  assert.equal(entry.status, 'failed');

  // Now resolve the in-flight _fetchInitialBatch promise
  resolveInFlightFetch();
  await new Promise(resolve => setTimeout(resolve, 10));

  assert.equal(
    attachCalls,
    0,
    'real _startSingleton must NOT call _attachSingletonSnapshot when in-flight _fetchInitialBatch resolves after pause',
  );
  assert.equal(emitted.length, 0, 'must not emit late data after pause');

  release();
});

test('StandardCacheService wires DeltaSync pause state, error callback, and duplicate-safe retryStandardsSync for StandardsComponent', async () => {
  await import('@angular/compiler');
  const { StandardCacheService } = await import('../../features/standards/services/standard-cache.service');
  const { signal: angularSignal } = await import('@angular/core');

  const deltaSync = Object.create(DeltaSyncService.prototype) as any;
  deltaSync._singletons = new Map<string, any>();
  deltaSync._resourceLimitPauses = new Map<string, any>();
  deltaSync._diagnostics = [];
  deltaSync._persistenceDisabledKeys = new Set<string>();
  deltaSync._volatileCursors = new Map<string, number>();
  deltaSync._registerStorageKeys = () => {};
  deltaSync._loadCursor = () => 0;
  deltaSync._loadSyncAt = () => 0;
  deltaSync._loadFromCache = () => [];

  let startCalls = 0;
  deltaSync._startSingleton = (entry: any) => {
    startCalls++;
    entry.status = 'starting';
    entry.generation++;
  };

  const cacheService = Object.create(StandardCacheService.prototype) as any;
  cacheService.fb = { APP_ID: 'lims-test', db: {} };
  cacheService.auth = { getDeltaCacheScope: () => 'user-1' };
  cacheService.deltaSync = deltaSync;
  cacheService.syncDiagnosticError = angularSignal(null);
  cacheService.resourceLimitState = angularSignal(null);
  cacheService.isRetryingSync = angularSignal(false);
  cacheService.errorCallbacks = new Set();

  const receivedData: any[][] = [];
  const receivedErrors: any[] = [];

  const unsub = cacheService.listenToStandards(
    (items: any[]) => receivedData.push(items),
    (diag: any) => receivedErrors.push(diag),
  );
  assert.equal(startCalls, 1);

  // Trigger resource-exhausted without cache -> onError fires, resourceLimitState is populated, receivedData stays empty
  const entry = deltaSync._singletons.get(cacheService._deltaCacheKey);
  deltaSync._handleSingletonError(
    entry,
    { code: 'firestore/resource-exhausted', message: 'Quota exceeded on initial load' },
    'initial-fetch',
  );

  assert.equal(receivedData.length, 0);
  assert.equal(receivedErrors.length, 1);
  assert.equal(receivedErrors[0].errorCode, 'resource-exhausted');
  assert.equal(receivedErrors[0].willRetry, false);
  assert.equal(cacheService.getStandardsResourceLimitState()?.diagnostic.errorCode, 'resource-exhausted');

  // Manual retry triggers exactly once while in-flight retry is active
  const retry1 = cacheService.retryStandardsSync();
  const retry2 = cacheService.retryStandardsSync();
  assert.equal(retry1, true);
  assert.equal(retry2, false, 'duplicate retry click while retrying must be ignored');
  assert.equal(startCalls, 2);
  assert.equal(cacheService.getStandardsResourceLimitState(), null);

  unsub();
});

test('warm cache -> quota pause -> manual retry -> snapshot reconnects with zero changes (onReady without onData) resets retry state and UI banner', async () => {
  await import('@angular/compiler');
  const { StandardCacheService } = await import('../../features/standards/services/standard-cache.service');
  const { signal: angularSignal } = await import('@angular/core');

  const deltaSync = Object.create(DeltaSyncService.prototype) as any;
  deltaSync._singletons = new Map<string, any>();
  deltaSync._resourceLimitPauses = new Map<string, any>();
  deltaSync._diagnostics = [];
  deltaSync._persistenceDisabledKeys = new Set<string>();
  deltaSync._volatileCursors = new Map<string, number>();
  deltaSync._registerStorageKeys = () => {};
  deltaSync._loadCursor = () => 1700000000000;
  deltaSync._loadSyncAt = () => Date.now();
  deltaSync._loadFromCache = () => [{ id: 'std-cached-1', name: 'Caffeine', lastUpdated: 1700000000000 }];

  let triggerSnapshotReady!: () => void;
  deltaSync._setupSnapshotListener = (
    _config: any,
    _cursor: number,
    _memCache: any[],
    _onData: (data: any[]) => void,
    _isDeleted: (doc: any) => boolean,
    _onError: (err: unknown) => void,
    onReady?: () => void,
  ) => {
    triggerSnapshotReady = () => {
      // Snapshot connected with 0 changes: onReady is called, _onData is NOT called
      onReady?.();
    };
    return () => {};
  };

  const cacheService = Object.create(StandardCacheService.prototype) as any;
  cacheService.fb = { APP_ID: 'lims-test', db: {} };
  cacheService.auth = { getDeltaCacheScope: () => 'user-1' };
  cacheService.deltaSync = deltaSync;
  cacheService.syncDiagnosticError = angularSignal(null);
  cacheService.resourceLimitState = angularSignal(null);
  cacheService.isRetryingSync = angularSignal(false);
  cacheService.errorCallbacks = new Set();
  cacheService.readyCallbacks = new Set();

  const receivedData: any[][] = [];
  const receivedErrors: any[] = [];
  let readyCalls = 0;

  // Simulate StandardsComponent signals wired to listenToStandards(onData, onError, onReady)
  const uiSyncPauseState = angularSignal<any>(null);
  const uiSyncDiagnosticError = angularSignal<any>(null);
  const uiIsRetryingDeltaSync = angularSignal(false);

  const unsub = cacheService.listenToStandards(
    (items: any[]) => {
      receivedData.push(items);
      const latestPause = cacheService.getStandardsResourceLimitState();
      uiSyncPauseState.set(latestPause);
      if (!latestPause) {
        uiSyncDiagnosticError.set(null);
        uiIsRetryingDeltaSync.set(false);
      }
    },
    (diag: any) => {
      receivedErrors.push(diag);
      uiSyncDiagnosticError.set(diag);
      uiSyncPauseState.set(cacheService.getStandardsResourceLimitState());
      uiIsRetryingDeltaSync.set(false);
    },
    () => {
      readyCalls++;
      const latestPause = cacheService.getStandardsResourceLimitState();
      uiSyncPauseState.set(latestPause);
      if (!latestPause) {
        uiSyncDiagnosticError.set(null);
        uiIsRetryingDeltaSync.set(false);
      }
    },
  );

  // 1. Initial warm cache emission happened
  assert.equal(receivedData.length, 1);
  assert.equal(receivedData[0][0].id, 'std-cached-1');

  // 2. Listener hits resource-exhausted quota and pauses
  const entry = deltaSync._singletons.get(cacheService._deltaCacheKey);
  deltaSync._handleSingletonError(
    entry,
    { code: 'firestore/resource-exhausted', message: 'Quota exceeded with warm cache' },
    'listener',
  );
  assert.equal(deltaSync.isResourceLimitPaused(cacheService._deltaCacheKey), true);
  assert.ok(uiSyncPauseState(), 'UI pause banner state must be active');
  assert.ok(uiSyncDiagnosticError(), 'UI diagnostic error must be set');

  // 3. User clicks "Thử đồng bộ lại" -> starts reconnecting
  uiIsRetryingDeltaSync.set(true);
  uiSyncDiagnosticError.set(null);
  const firstRetryAccepted = cacheService.retryStandardsSync();
  assert.equal(firstRetryAccepted, true);
  assert.equal(cacheService.isRetryingSync(), true);

  // 4. Snapshot listener connects with NO document changes (only onReady fires, onData does NOT fire)
  triggerSnapshotReady();

  assert.equal(deltaSync.getSingletonStatus(cacheService._deltaCacheKey), 'listening');
  assert.equal(deltaSync.isResourceLimitPaused(cacheService._deltaCacheKey), false);
  assert.equal(
    cacheService.isRetryingSync(),
    false,
    'cacheService.isRetryingSync() must reset to false when onReady fires with 0 snapshot changes',
  );
  assert.equal(readyCalls >= 1, true, 'onReady callback must fire to notify StandardsComponent');
  assert.equal(uiIsRetryingDeltaSync(), false, 'UI retry button must not stay stuck in retrying state');
  assert.equal(uiSyncPauseState(), null, 'UI pause banner must clear when listener is ready');
  assert.equal(uiSyncDiagnosticError(), null);
  assert.equal(receivedData.length, 1, 'no new onData call occurred during empty snapshot');

  // 5. If another quota pause happens later, a second manual retry is accepted cleanly
  deltaSync._handleSingletonError(
    entry,
    { code: 'firestore/resource-exhausted', message: 'Second quota spike' },
    'listener',
  );
  const secondRetryAccepted = cacheService.retryStandardsSync();
  assert.equal(secondRetryAccepted, true, 'subsequent manual retry must be accepted after prior ready completion');

  unsub();
});


test('real _startSingleton hydrates entry.memCache from DeltaIndexedDbStorage before network fetch', async () => {
  const { DeltaIndexedDbStorage } = await import('./delta-indexeddb');
  const idb = DeltaIndexedDbStorage.getInstance();

  const idbStore = new Map();
  idbStore.set('idb_hydrated_cache', [{ id: 'std-idb-1', name: 'IDB Hydrated Standard', lastUpdated: 1000 }]);

  const mockDb = {
    transaction: () => ({
      objectStore: () => ({
        get: (key) => {
          const req = { result: { key, items: idbStore.get(key), cursorMillis: 1000, updatedAt: Date.now() } };
          setTimeout(() => req.onsuccess?.(), 0);
          return req;
        },
      }),
      oncomplete: null,
      onerror: null,
      onabort: null,
    }),
  };

  idb.setMockForTest(mockDb);

  const service = Object.create(DeltaSyncService.prototype);
  service._singletons = new Map();
  service._resourceLimitPauses = new Map();
  service._diagnostics = [];
  service._persistenceDisabledKeys = new Set();
  service._volatileCursors = new Map();
  service._registerStorageKeys = () => {};
  service._loadCursor = () => 1000;
  service._loadSyncAt = () => Date.now();
  service._loadFromCache = () => []; // localStorage is empty!
  service._hasConfirmedUsableCache = () => false;
  service._pauses = () => service._resourceLimitPauses;
  service._idbStorage = idb;

  let fetchInitialCalls = 0;
  service._fetchInitialBatch = async () => {
    fetchInitialCalls++;
    return [{ id: 'network-doc', lastUpdated: 2000 }];
  };

  let attachCalls = 0;
  service._attachSingletonSnapshot = () => {
    attachCalls++;
  };

  const config = {
    cacheKey: 'idb_hydrated_cache',
    cursorKey: 'idb_hydrated_cursor',
    collectionPath: 'artifacts/app/reference_standards',
  };

  const emitted = [];
  const release = service.startSingletonListener(config, (items) => emitted.push(items));

  // Wait for IDB async get to complete and hydrate
  await new Promise(resolve => setTimeout(resolve, 20));

  assert.equal(fetchInitialCalls, 0, 'network _fetchInitialBatch must NOT be called when IDB has cached items');
  assert.equal(attachCalls, 1, 'snapshot listener must attach after IDB hydration');
  assert.equal(emitted.length >= 1, true, 'subscriber must receive hydrated items from IDB');
  assert.equal(emitted[0][0].id, 'std-idb-1');

  release();
  idb.resetForTest();
});
