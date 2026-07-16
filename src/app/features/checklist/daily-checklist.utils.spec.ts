import assert from 'node:assert/strict';
import test from 'node:test';
import { Request } from '../../core/models/request.model';
import { getAssignedTargetsForSample } from '../results/shared/compound-id-resolver';
import {
  buildApprovedBatchOverviews,
  buildDailyBatchViews,
  getRequestDateValue,
  isValidDateInput,
  toDate
} from './daily-checklist.utils';
import { planDailyPrintLayout } from './daily-print-layout-planner';
import { computeDailyBatchLayoutHint } from './daily-screen-layout-planner';

function request(overrides: Partial<Request> = {}): Request {
  return {
    id: 'REQ-1',
    sopId: 'SOP-1',
    sopName: 'SOP kiểm thử',
    items: [],
    status: 'approved',
    timestamp: new Date('2026-07-16T00:00:00Z'),
    analysisDate: '2026-07-16',
    sampleList: ['A001'],
    targetIds: ['target-fallback'],
    ...overrides
  };
}

test('canonical sample lookup handles case, whitespace and pooled samples', () => {
  const map = {
    ' a001 ': ['target-1'],
    A002: ['target-2']
  };

  assert.deepEqual(getAssignedTargetsForSample('A001', map), ['target-1']);
  assert.deepEqual(getAssignedTargetsForSample('a001; a002', map), ['target-1', 'target-2']);
  assert.equal(getAssignedTargetsForSample('A001;missing', map), null);
});

test('daily overview uses canonical assignments and immutable target-name snapshots', () => {
  const batches = buildApprovedBatchOverviews([
    request({
      sampleList: [' A001 '],
      sampleTargetMap: { a001: ['target-1'] },
      targetNames: { 'target-1': 'Tên tại thời điểm tạo mẻ' }
    })
  ], '2026-07-16', (item, targetId) => item.targetNames?.[targetId] || targetId);

  assert.equal(batches.length, 1);
  assert.deepEqual(batches[0].samples[0].targetIds, ['target-1']);
  assert.deepEqual(batches[0].samples[0].targetNames, ['Tên tại thời điểm tạo mẻ']);
});

test('batch views remain separated by request and group samples by assigned target set', () => {
  const batches = buildApprovedBatchOverviews([
    request({
      id: 'REQ-1',
      sampleList: ['A001', 'a001', 'A002', 'A003'],
      sampleTargetMap: {
        A001: ['T1'],
        A002: ['T1'],
        A003: ['T2']
      }
    }),
    request({ id: 'REQ-2' })
  ], '2026-07-16', (_item, targetId) => targetId);

  const views = buildDailyBatchViews(batches);
  assert.equal(views.length, 2);
  assert.equal(views.find(batch => batch.requestId === 'REQ-1')?.uniqueSamples, 3);
  assert.equal(views.find(batch => batch.requestId === 'REQ-1')?.groups.length, 2);
  assert.deepEqual(
    views.find(batch => batch.requestId === 'REQ-1')?.groups.find(group => group.targetIds[0] === 't1')?.sampleIds,
    ['A001', 'A002']
  );
});

test('adaptive print planner chooses landscape for wide content and respects manual override', () => {
  const longSamples = Array.from({ length: 60 }, (_, index) => `SAMPLE-CODE-${String(index + 1).padStart(3, '0')}`);
  const longTargets = Array.from({ length: 20 }, (_, index) => `Chỉ tiêu kiểm nghiệm có tên dài số ${index + 1}`);
  const [overview] = buildApprovedBatchOverviews([
    request({
      sampleList: longSamples,
      targetIds: longTargets
    })
  ], '2026-07-16', (_item, targetId) => targetId);
  const views = buildDailyBatchViews([overview]);

  assert.equal(planDailyPrintLayout(views, false, 'auto').orientation, 'landscape');
  assert.equal(planDailyPrintLayout(views, false, 'portrait').orientation, 'portrait');
});

test('adaptive print planner supports automatic, compact and list print modes', () => {
  const overviews = buildApprovedBatchOverviews(
    Array.from({ length: 6 }, (_, index) => request({
      id: `REQ-${index + 1}`,
      sampleList: [`L${String(index + 1).padStart(2, '0')}15`],
      targetIds: ['T1']
    })),
    '2026-07-16',
    (_item, targetId) => targetId
  );
  const views = buildDailyBatchViews(overviews);

  assert.equal(planDailyPrintLayout(views, true, 'auto', 'auto').mode, 'compact');
  assert.equal(planDailyPrintLayout(views, true, 'auto', 'compact').mode, 'compact');
  assert.equal(planDailyPrintLayout(views, true, 'auto', 'list').mode, 'list');

  const denseTargets = Array.from({ length: 80 }, (_, index) => `target-${index + 1}`);
  const denseViews = buildDailyBatchViews(buildApprovedBatchOverviews([
    request({ id: 'REQ-DENSE', targetIds: denseTargets })
  ], '2026-07-16', (_item, targetId) => `Chỉ tiêu kiểm nghiệm dài ${targetId}`));

  assert.equal(planDailyPrintLayout(denseViews, true, 'auto', 'auto').mode, 'list');
});

test('batch without sample codes is retained with its assigned targets', () => {
  const overviews = buildApprovedBatchOverviews([
    request({ sampleList: [], targetIds: ['T1', 'T2'] })
  ], '2026-07-16', (_item, targetId) => `Tên ${targetId}`);
  const [view] = buildDailyBatchViews(overviews);

  assert.equal(view.uniqueSamples, 0);
  assert.equal(view.groups.length, 1);
  assert.deepEqual(view.groups[0].sampleIds, []);
  assert.deepEqual(view.groups[0].targetNames, ['Tên T1', 'Tên T2']);
});

test('LIMS sample codes with a fixed two-digit suffix stay compact for large batches', () => {
  const sampleList = Array.from({ length: 50 }, (_, index) => `L${String(index + 1).padStart(2, '0')}15`);
  const overviews = buildApprovedBatchOverviews([
    request({ sampleList, targetIds: ['T1'] })
  ], '2026-07-16', (_item, targetId) => targetId);
  const [view] = buildDailyBatchViews(overviews);

  assert.equal(view.groups.length, 1);
  assert.equal(view.groups[0].formattedSamples, 'L0115 -> L5015');
});

test('missing analysisDate is not silently replaced by approval date', () => {
  assert.equal(getRequestDateValue(request({ analysisDate: undefined })), '');
  assert.equal(toDate({ seconds: 1_752_624_000 })?.getTime(), 1_752_624_000_000);
  assert.equal(isValidDateInput('2026-02-30'), false);
});

test('adaptive screen planner keeps a simple compressed batch compact', () => {
  const sampleList = Array.from({ length: 50 }, (_, index) => `L${String(index + 1).padStart(2, '0')}15`);
  const [overview] = buildApprovedBatchOverviews([
    request({ sampleList, targetIds: ['T1', 'T2'] })
  ], '2026-07-16', (_item, targetId) => targetId);
  const [view] = buildDailyBatchViews([overview]);

  assert.equal(computeDailyBatchLayoutHint(view, 1200), 'compact');
});

test('adaptive screen planner promotes complex and expanded batches', () => {
  const [overview] = buildApprovedBatchOverviews([
    request({
      sampleList: ['A001', 'A002', 'A003'],
      sampleTargetMap: { A001: ['T1'], A002: ['T2'], A003: ['T3'] }
    })
  ], '2026-07-16', (_item, targetId) => `Chỉ tiêu ${targetId}`);
  const [view] = buildDailyBatchViews([overview]);

  assert.equal(computeDailyBatchLayoutHint(view, 1200), 'wide');
  assert.equal(computeDailyBatchLayoutHint(view, 1200, false, 'compact'), 'compact');
  assert.equal(computeDailyBatchLayoutHint(view, 1200, true, 'compact'), 'wide');
  assert.equal(computeDailyBatchLayoutHint(view, 700), 'wide');
});

test('adaptive screen planner uses standard width for two assignment groups', () => {
  const [overview] = buildApprovedBatchOverviews([
    request({
      sampleList: ['A001', 'A002'],
      sampleTargetMap: { A001: ['T1'], A002: ['T2'] }
    })
  ], '2026-07-16', (_item, targetId) => targetId);
  const [view] = buildDailyBatchViews([overview]);

  assert.equal(computeDailyBatchLayoutHint(view, 1200), 'standard');
});

test('hidden target chips do not force a batch to wide layout', () => {
  const targetIds = Array.from({ length: 14 }, (_, index) => `T${index + 1}`);
  const [overview] = buildApprovedBatchOverviews([
    request({ sampleList: ['L0115', 'L0215', 'L0315'], targetIds })
  ], '2026-07-16', (_item, targetId) => `Chỉ tiêu ${targetId}`);
  const [view] = buildDailyBatchViews([overview]);

  assert.equal(view.uniqueTargets, 14);
  assert.equal(computeDailyBatchLayoutHint(view, 1200), 'standard');
});
