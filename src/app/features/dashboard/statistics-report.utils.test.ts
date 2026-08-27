import assert from 'node:assert/strict';
import test from 'node:test';
import type { MonthlyStatsDoc } from '../../core/services/stats.service';
import type { Log, PrintData } from '../../core/models/log.model';
import type { Request } from '../../core/models/request.model';
import {
  aggregateReportConsumption,
  aggregateNxtMovements,
  aggregateSopFrequency,
  buildReportSopOptions,
  enrichReportLogsWithPrintData,
  findUnresolvedLegacyNxtApprovalLogs,
  filterReportRequests,
  getReportRequestDate,
  getMonthKeysForStatisticsRange,
  matchesReportSop,
  needsLegacyNxtPrintData,
  recoverLegacyNxtApprovalLogsFromRequests,
  resolveNxtInventoryDeltas,
  resolveStatisticsDateRange
} from './statistics-report.utils';

function day(samples: number, batches: number, qcs = 0): MonthlyStatsDoc[string] {
  return {
    totalSamples: samples,
    totalBatches: batches,
    totalQcs: qcs,
    sops: {
      'SOP A': { samples, batches, qcs }
    }
  };
}

function log(overrides: Partial<Log> = {}): Log {
  return {
    id: overrides.id || 'log-1',
    action: overrides.action || 'STOCK_OUT',
    details: overrides.details || '',
    timestamp: overrides.timestamp || new Date('2026-08-10T10:00:00+07:00'),
    user: overrides.user || 'tester',
    ...overrides
  };
}

function printData(items: Array<Record<string, unknown>>, sopId = 'sop-a'): PrintData {
  return {
    sop: { id: sopId, name: `SOP ${sopId}` } as PrintData['sop'],
    inputs: {},
    margin: 0,
    items: items as PrintData['items']
  };
}

function request(overrides: Partial<Request> = {}): Request {
  return {
    id: overrides.id || 'request-1',
    sopId: overrides.sopId || 'sop-a',
    sopName: overrides.sopName || 'SOP A',
    items: overrides.items || [],
    status: overrides.status || 'approved',
    timestamp: overrides.timestamp || new Date('2026-08-10T16:00:00+07:00'),
    ...overrides
  };
}

test('report request date prefers local analysisDate over approval timestamps', () => {
  const date = getReportRequestDate(request({
    analysisDate: '2026-08-05',
    approvedAt: new Date('2026-08-09T23:30:00+07:00')
  }));

  assert.ok(date);
  assert.equal(date.getFullYear(), 2026);
  assert.equal(date.getMonth(), 7);
  assert.equal(date.getDate(), 5);
});

test('report SOP matching tolerates id, metadata, historical name and resolved print snapshots', () => {
  assert.equal(matchesReportSop({ sopId: 'sop-a' }, 'sop-a', 'SOP A'), true);
  assert.equal(matchesReportSop({ metadata: { sopId: 'sop-a' } }, 'sop-a', 'SOP A'), true);
  assert.equal(matchesReportSop({ sopName: 'SOP lịch sử' }, 'sop-old', 'SOP lịch sử'), true);
  assert.equal(matchesReportSop(
    {},
    'sop-a',
    'SOP A',
    printData([], 'sop-a')
  ), true);
  assert.equal(matchesReportSop({ sopId: 'sop-b', sopName: 'SOP B' }, 'sop-a', 'SOP A'), false);
});

test('report request filtering is inclusive and supports day-of-month export filtering', () => {
  const range = resolveStatisticsDateRange('2026-08-01', '2026-09-30', {}, '2026-08-26');
  const requests = [
    request({ id: 'start', analysisDate: '2026-08-01' }),
    request({ id: 'middle', analysisDate: '2026-08-15' }),
    request({ id: 'next-month-same-day', analysisDate: '2026-09-15' }),
    request({ id: 'end', analysisDate: '2026-09-30' }),
    request({ id: 'outside', analysisDate: '2026-10-01' })
  ];

  assert.deepEqual(
    filterReportRequests(requests, range).map(item => item.id),
    ['start', 'middle', 'next-month-same-day', 'end']
  );
  assert.deepEqual(
    filterReportRequests(requests, range, 'sop-a', 'SOP A', 15).map(item => item.id),
    ['middle', 'next-month-same-day']
  );
});

test('report consumption aggregation shares custom amount calculation with Excel export', () => {
  const requests = [
    request({
      id: 'a',
      margin: 10,
      items: [
        { name: 'chem-a', displayName: 'Chemical A', amount: 11, displayAmount: 11, unit: 'g', stockUnit: 'g' },
        { name: 'chem-b', amount: 5, displayAmount: 5, unit: 'mL', stockUnit: 'mL' }
      ]
    }),
    request({
      id: 'b',
      margin: 20,
      items: [
        { name: 'chem-a', displayName: 'Chemical A', amount: 12, displayAmount: 12, unit: 'g', stockUnit: 'g' }
      ]
    })
  ];

  assert.deepEqual(aggregateReportConsumption(requests, (item, req) => item.amount / (1 + (req.margin || 0) / 100)), [
    { name: 'chem-a', displayName: 'Chemical A', amount: 20, unit: 'g' },
    { name: 'chem-b', displayName: 'chem-b', amount: 5 / 1.1, unit: 'mL' }
  ]);
});

test('report log enrichment overlays resolved immutable print snapshots by log id', () => {
  const unresolved = log({ id: 'approval-1', action: 'APPROVE_REQUEST', printJobId: 'job-1' });
  const untouched = log({ id: 'stock-1', action: 'STOCK_IN' });
  const snapshot = printData([{ name: 'chem-a', stockNeed: 2 }]);

  const enriched = enrichReportLogsWithPrintData(
    [unresolved, untouched],
    new Map([['approval-1', snapshot]])
  );

  assert.equal(enriched[0].printData, snapshot);
  assert.equal(enriched[1], untouched);
});

test('SOP frequency includes a one-day report range', () => {
  const stats = {
    '2026-08': {
      '2026-08-26': day(12, 3, 1)
    }
  };
  const range = resolveStatisticsDateRange('2026-08-26', '2026-08-26', stats, '2026-08-26');

  assert.equal(range.days, 1);
  assert.deepEqual(aggregateSopFrequency(stats, range), [
    { name: 'SOP A', count: 3, samples: 12, qcs: 1, percent: 100 }
  ]);
});

test('SOP frequency includes both endpoints of a multi-day range', () => {
  const stats = {
    '2026-08': {
      '2026-08-01': day(4, 1),
      '2026-08-02': day(8, 2),
      '2026-08-03': day(16, 4)
    }
  };
  const range = resolveStatisticsDateRange('2026-08-01', '2026-08-03', stats, '2026-08-26');

  assert.equal(range.days, 3);
  assert.deepEqual(aggregateSopFrequency(stats, range), [
    { name: 'SOP A', count: 7, samples: 28, qcs: 0, percent: 100 }
  ]);
});

test('blank report dates resolve all-time bounds from complete monthly stats', () => {
  const stats = {
    '2025-12': { '2025-12-15': day(1, 1) },
    '2026-08': { '2026-08-26': day(1, 1) }
  };
  const range = resolveStatisticsDateRange('', '', stats, '2026-08-26');

  assert.equal(range.days, 255);
  assert.deepEqual(getMonthKeysForStatisticsRange(range), [
    '2025-12', '2026-01', '2026-02', '2026-03', '2026-04',
    '2026-05', '2026-06', '2026-07', '2026-08'
  ]);
});

test('report ranges longer than 90 days stay intact', () => {
  const range = resolveStatisticsDateRange('2026-01-01', '2026-08-26', {}, '2026-08-26');

  assert.equal(range.days, 238);
  assert.equal(getMonthKeysForStatisticsRange(range).length, 8);
});

test('invalid explicit ranges do not get mistaken for all-time', () => {
  const stats = {
    '2025-12': { '2025-12-15': day(1, 1) }
  };
  const range = resolveStatisticsDateRange('2026-08-26', '2026-08-01', stats, '2026-08-26');

  assert.equal(range.days, 1);
  assert.equal(range.start.getFullYear(), 2026);
  assert.equal(range.start.getMonth(), 7);
  assert.equal(range.start.getDate(), 26);
});

test('report SOP options keep archived historical SOPs without requiring full SOP documents', () => {
  const range = resolveStatisticsDateRange('2026-08-01', '2026-08-31', {}, '2026-08-26');
  const stats = {
    '2026-08': {
      '2026-08-10': {
        totalSamples: 2,
        totalBatches: 1,
        totalQcs: 0,
        sops: {
          'SOP hiện tại': { samples: 1, batches: 1, qcs: 0 },
          'SOP chỉ còn trong stats': { samples: 1, batches: 1, qcs: 0 }
        }
      }
    }
  };

  const options = buildReportSopOptions(
    [{ id: 'sop-current', name: 'SOP hiện tại' }],
    [
      { sopId: 'sop-current', sopName: 'Tên lịch sử cũ' },
      { sopId: 'sop-archived', sopName: 'SOP đã lưu trữ' }
    ],
    [],
    stats,
    range
  );

  assert.deepEqual(options, [
    { id: 'sop-archived', name: 'SOP đã lưu trữ' },
    { id: 'sop-current', name: 'SOP hiện tại' },
    { id: 'SOP chỉ còn trong stats', name: 'SOP chỉ còn trong stats' }
  ]);
});

test('N-X-T canonical inventory deltas take precedence over legacy parsing', () => {
  const deltas = resolveNxtInventoryDeltas(log({
    targetId: 'chem-a',
    details: 'Xuất kho: -99',
    inventoryDeltas: { 'chem-a': -2.5 }
  }));

  assert.deepEqual(deltas, { 'chem-a': -2.5 });
});

test('N-X-T legacy stock movement parsing preserves signed stock changes', () => {
  assert.deepEqual(resolveNxtInventoryDeltas(log({
    action: 'STOCK_IN',
    targetId: 'chem-a',
    details: 'Nhập kho: +4.5'
  })), { 'chem-a': 4.5 });

  assert.deepEqual(resolveNxtInventoryDeltas(log({
    action: 'STOCK_OUT',
    targetId: 'chem-a',
    details: 'Xuất kho: -1.25'
  })), { 'chem-a': -1.25 });
});

test('N-X-T soft-delete and restore are lifecycle-only events and never change stock', () => {
  assert.deepEqual(resolveNxtInventoryDeltas(log({
    action: 'SOFT_DELETE_ITEM',
    targetId: 'chem-a',
    finalStock: 12,
    metadata: { oldValue: 12 }
  })), {});

  assert.deepEqual(resolveNxtInventoryDeltas(log({
    action: 'RESTORE_ITEM',
    targetId: 'chem-a',
    metadata: { oldValue: 12 }
  })), {});
});

test('N-X-T retains the legacy hard-delete final-stock compatibility delta', () => {
  assert.deepEqual(resolveNxtInventoryDeltas(log({
    action: 'DELETE_ITEM',
    targetId: 'chem-a',
    finalStock: 12
  })), { 'chem-a': -12 });
});

test('N-X-T approval logs recover legacy printData when canonical deltas are absent', () => {
  const approval = log({ id: 'approval-1', action: 'APPROVE_REQUEST' });
  const snapshot = printData([
    { name: 'chem-a', stockNeed: 3 },
    {
      name: 'mix',
      isComposite: true,
      breakdown: [
        { name: 'chem-b', totalNeed: 1.5 },
        { name: 'chem-c', totalNeed: 0.5 }
      ]
    }
  ]);

  assert.equal(needsLegacyNxtPrintData(approval), true);
  assert.deepEqual(resolveNxtInventoryDeltas(approval, snapshot), {
    'chem-a': -3,
    'chem-b': -1.5,
    'chem-c': -0.5
  });
});

test('N-X-T fails completeness for every legacy approval that has no recoverable snapshot', () => {
  const embedded = log({
    id: 'embedded',
    action: 'APPROVE_REQUEST',
    printData: printData([{ name: 'chem-a', stockNeed: 1 }])
  });
  const splitStorage = log({ id: 'split', action: 'APPROVE_REQUEST', printJobId: 'job-1' });
  const preSplitStorage = log({ id: 'pre-split', action: 'DIRECT_APPROVE' });
  const canonical = log({
    id: 'canonical',
    action: 'APPROVE_REQUEST',
    inventoryDeltas: { 'chem-a': -2 }
  });

  assert.deepEqual(
    findUnresolvedLegacyNxtApprovalLogs(
      [embedded, splitStorage, preSplitStorage, canonical],
      new Map([['split', printData([{ name: 'chem-b', stockNeed: 2 }])]])
    ).map(item => item.id),
    ['pre-split']
  );

  assert.deepEqual(
    findUnresolvedLegacyNxtApprovalLogs([splitStorage, preSplitStorage], new Map()).map(item => item.id),
    ['split', 'pre-split']
  );
});

test('N-X-T recovers a missing legacy approval snapshot from unchanged request items', () => {
  const approval = log({
    id: 'approval-1',
    action: 'DIRECT_APPROVE_PLAN',
    requestId: 'request-1',
    printJobId: 'deleted-job'
  });
  const recovered = recoverLegacyNxtApprovalLogsFromRequests(
    [approval],
    new Map(),
    new Map([['request-1', request({
      id: 'request-1',
      items: [
        { name: 'chem-a', amount: 1.25, displayAmount: 1.25, unit: 'g', stockUnit: 'g' },
        { name: 'chem-a', amount: 0.75, displayAmount: 0.75, unit: 'g', stockUnit: 'g' },
        { name: 'chem-b', amount: 2, displayAmount: 2, unit: 'mL', stockUnit: 'mL' }
      ]
    })]])
  );

  assert.deepEqual(recovered[0].inventoryDeltas, { 'chem-a': -2, 'chem-b': -2 });
  assert.deepEqual(findUnresolvedLegacyNxtApprovalLogs(recovered, new Map()), []);
});

test('N-X-T recovers approval and edit deltas from the legacy inventory diff chain', () => {
  const approval = log({
    id: 'approval-1',
    action: 'APPROVE_REQUEST',
    requestId: 'request-1',
    timestamp: new Date('2026-08-10T10:00:00+07:00')
  });
  const edit = log({
    id: 'edit-1',
    action: 'EDIT_REQUEST',
    requestId: 'request-1',
    timestamp: new Date('2026-08-11T10:00:00+07:00'),
    diff: [{
      field: 'inventoryItems',
      oldValue: { 'chem-a': { amount: 3, unit: 'g' }, 'chem-b': { amount: 1, unit: 'mL' } },
      newValue: { 'chem-a': { amount: 2, unit: 'g' }, 'chem-b': { amount: 2, unit: 'mL' } }
    }]
  });
  const recovered = recoverLegacyNxtApprovalLogsFromRequests(
    [approval, edit],
    new Map(),
    new Map([['request-1', request({
      id: 'request-1',
      items: [{ name: 'chem-a', amount: 1, displayAmount: 1, unit: 'g', stockUnit: 'g' }]
    })]])
  );

  assert.deepEqual(recovered[0].inventoryDeltas, { 'chem-a': -3, 'chem-b': -1 });
  assert.deepEqual(recovered[1].inventoryDeltas, { 'chem-a': 1, 'chem-b': -1 });
  assert.deepEqual(findUnresolvedLegacyNxtApprovalLogs(recovered, new Map()), []);
});

test('N-X-T refuses request fallback when a later legacy edit has no auditable diff', () => {
  const approval = log({ id: 'approval-1', action: 'APPROVE_REQUEST', requestId: 'request-1' });
  const unknownEdit = log({
    id: 'edit-1',
    action: 'EDIT_REQUEST',
    requestId: 'request-1',
    timestamp: new Date('2026-08-11T10:00:00+07:00')
  });
  const recovered = recoverLegacyNxtApprovalLogsFromRequests(
    [approval, unknownEdit],
    new Map(),
    new Map([['request-1', request({
      id: 'request-1',
      items: [{ name: 'chem-a', amount: 1, displayAmount: 1, unit: 'g', stockUnit: 'g' }]
    })]])
  );

  assert.equal(recovered[0], approval);
  assert.deepEqual(findUnresolvedLegacyNxtApprovalLogs(recovered, new Map()).map(item => item.id), ['approval-1']);
});

test('N-X-T all-SOP aggregation separates imports, exports and future net change', () => {
  const start = new Date('2026-08-01T00:00:00+07:00').getTime();
  const end = new Date('2026-08-10T23:59:59.999+07:00').getTime();
  const logs = [
    log({ id: 'in', timestamp: new Date('2026-08-02T09:00:00+07:00'), inventoryDeltas: { 'chem-a': 5 } }),
    log({ id: 'out', timestamp: new Date('2026-08-03T09:00:00+07:00'), inventoryDeltas: { 'chem-a': -2 } }),
    log({ id: 'future-return', timestamp: new Date('2026-08-11T09:00:00+07:00'), inventoryDeltas: { 'chem-a': 4 } }),
    log({ id: 'future-use', timestamp: new Date('2026-08-12T09:00:00+07:00'), inventoryDeltas: { 'chem-a': -1 } })
  ];

  assert.deepEqual(aggregateNxtMovements(logs, new Map(), start, end).get('chem-a'), {
    inPeriodImport: 5,
    inPeriodExport: 2,
    futureNetChange: 3
  });
});

test('N-X-T SOP-specific aggregation filters other SOPs and counts gross exports only', () => {
  const start = new Date('2026-08-01T00:00:00+07:00').getTime();
  const end = new Date('2026-08-31T23:59:59.999+07:00').getTime();
  const logs = [
    log({ id: 'a-use', metadata: { sopId: 'sop-a' }, inventoryDeltas: { 'chem-a': -4 } }),
    log({ id: 'a-return', metadata: { sopId: 'sop-a' }, inventoryDeltas: { 'chem-a': 1 } }),
    log({ id: 'b-use', metadata: { sopId: 'sop-b' }, inventoryDeltas: { 'chem-a': -7 } })
  ];

  assert.deepEqual(aggregateNxtMovements(logs, new Map(), start, end, 'sop-a').get('chem-a'), {
    inPeriodImport: 0,
    inPeriodExport: 4,
    futureNetChange: 0
  });
});
