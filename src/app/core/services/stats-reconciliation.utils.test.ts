import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildStatsProjectionForDays,
  collectReconciliationDays,
  type StatsProjectionRow,
} from './stats-reconciliation.utils';

test('multiple pending items for one day collapse to one rebuild target', () => {
  assert.deepEqual(
    collectReconciliationDays([
      { id: 'a', statsDate: '2026-09-25' },
      { id: 'b', statsDate: '2026-09-25' },
      { id: 'c', statsDate: 'invalid' },
    ]),
    ['2026-09-25']
  );
});

test('old and new request dates are both preserved as reconciliation targets', () => {
  assert.deepEqual(
    collectReconciliationDays([
      { id: 'old', statsDate: '2026-09-24' },
      { id: 'new', statsDate: '2026-09-26' },
    ]),
    ['2026-09-24', '2026-09-26']
  );
});

test('source-of-truth rebuild is idempotent across retries and ignores draft/virtual requests', () => {
  const rows: StatsProjectionRow[] = [
    { dateKey: '2026-09-26', status: 'approved', sopName: 'SOP A', sampleList: ['1', '2'], inputs: { n_qc: 1 } },
    { dateKey: '2026-09-26', status: 'completed', sopName: 'SOP A', inputs: { n_sample: 3, n_qc: 0 } },
    { dateKey: '2026-09-26', status: 'draft', sopName: 'SOP A', inputs: { n_sample: 99 } },
    { dateKey: '2026-09-26', status: 'approved', isVirtualMaster: true, sopName: 'SOP A', inputs: { n_sample: 99 } },
  ];

  const first = buildStatsProjectionForDays(rows, ['2026-09-26']);
  const retry = buildStatsProjectionForDays(rows, ['2026-09-26']);
  assert.deepEqual(retry, first);
  assert.deepEqual(first['2026-09-26'], {
    totalSamples: 5,
    totalBatches: 2,
    totalQcs: 1,
    sops: { 'SOP A': { samples: 5, batches: 2, qcs: 1 } },
  });
});
