import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeDeltaItems } from './delta-sync.service';

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
