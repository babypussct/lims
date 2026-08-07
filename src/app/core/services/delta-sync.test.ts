import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildDeltaAuthScope,
  buildScopedDeltaKey,
  computeDeltaRetryDelay,
  deltaValueToMillis,
  getDeltaErrorCode,
  getMaxDeltaCursorMillis,
  isDeltaAuthorizationError,
  isDeltaGenerationActive,
  isRetryableDeltaError,
  mergeDeltaItems,
  replaceDeltaArrayContents,
  shouldResetStaleDeltaCache,
  sanitizeDeltaCursorMillis,
  shouldUseDeltaCache,
  sortAndTrimDeltaItems
} from './delta-sync.service';

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
