import assert from 'node:assert/strict';
import test from 'node:test';
import { isRequestCountedInStats, resolveRequestStatsCounts } from './request-stats.utils';

test('sampleList is canonical even when n_sample disagrees', () => {
  assert.deepEqual(
    resolveRequestStatsCounts({ sampleList: ['A', 'B', 'C'], inputs: { n_sample: 99, n_qc: 2 } }),
    { samples: 3, qcs: 2 }
  );
});

test('sampleList precedence does not depend on n_qc being present', () => {
  assert.deepEqual(
    resolveRequestStatsCounts({ sampleList: ['A', 'B'], inputs: { n_sample: 7 } }),
    { samples: 2, qcs: 0 }
  );
});

test('falls back to n_sample and safe defaults when no explicit sample rows exist', () => {
  assert.deepEqual(resolveRequestStatsCounts({ inputs: { n_sample: '4', n_qc: '1' } }), { samples: 4, qcs: 1 });
  assert.deepEqual(resolveRequestStatsCounts({ inputs: {} }), { samples: 1, qcs: 0 });
  assert.deepEqual(resolveRequestStatsCounts({ inputs: { n_sample: 'bad', n_qc: -1 } }), { samples: 1, qcs: 0 });
});

test('only approved and completed requests are counted by live/backfill/reconciliation policy', () => {
  assert.equal(isRequestCountedInStats('approved'), true);
  assert.equal(isRequestCountedInStats('completed'), true);
  assert.equal(isRequestCountedInStats('draft'), false);
  assert.equal(isRequestCountedInStats('pending'), false);
  assert.equal(isRequestCountedInStats('rejected'), false);
});
