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
import { buildDailyCompactPrintPages, planDailyPrintLayout } from './daily-print-layout-planner';
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

test('daily cards merge physical requests with the same SOP version and keep source traceability', () => {
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
    request({ id: 'REQ-2', sampleList: ['A001'], targetIds: ['T1'], sampleTargetMap: { A001: ['T1'] } })
  ], '2026-07-16', (_item, targetId) => targetId);

  const views = buildDailyBatchViews(batches);
  assert.equal(views.length, 1);
  assert.equal(views[0].physicalBatchCount, 2);
  assert.deepEqual(views[0].sourceBatches.map(batch => batch.requestId).sort(), ['REQ-1', 'REQ-2']);
  assert.equal(views[0].uniqueSamples, 3);
  assert.equal(views[0].groups.length, 2);
  assert.deepEqual(
    views[0].groups.find(group => group.targetIds[0] === 't1')?.sampleIds,
    ['A001', 'A002']
  );
});

test('same SOP on different versions remains in separate daily cards', () => {
  const overviews = buildApprovedBatchOverviews([
    request({ id: 'REQ-V1', sopVersion: 1 }),
    request({ id: 'REQ-V2', sopVersion: 2 })
  ], '2026-07-16', (_item, targetId) => targetId);

  const views = buildDailyBatchViews(overviews);
  assert.equal(views.length, 2);
  assert.deepEqual(views.map(view => view.sopVersion).sort(), [1, 2]);
});

test('sample description snapshots are aggregated without losing physical request ownership', () => {
  const overviews = buildApprovedBatchOverviews([
    request({
      id: 'REQ-DESC-1',
      sampleList: ['L0101'],
      sampleDescriptionMap: { L0101: { masterId: 'ca_tra', nameSnapshot: 'Cá tra' } }
    }),
    request({
      id: 'REQ-DESC-2',
      sampleList: ['L0201'],
      sampleDescriptionMap: { L0201: { masterId: 'hanh_tim', nameSnapshot: 'Hành tím' } }
    })
  ], '2026-07-16', (_item, targetId) => targetId);

  const [view] = buildDailyBatchViews(overviews);
  assert.equal(view.physicalBatchCount, 2);
  assert.equal(view.groups[0].formattedSampleDetails, 'L0101 (Cá tra); L0201 (Hành tím)');
  assert.deepEqual(view.groups[0].samples[0].sourceRequestIds, ['REQ-DESC-1']);
});

test('sample details keep sample-code order when descriptions repeat out of sequence', () => {
  const [overview] = buildApprovedBatchOverviews([
    request({
      id: 'REQ-DESC-ORDER',
      sampleList: ['L2519', 'L2319', 'L2619', 'L2419'],
      sampleDescriptionMap: {
        L2319: { nameSnapshot: 'Lươn sống' },
        L2419: { nameSnapshot: 'Ốc hương' },
        L2519: { nameSnapshot: 'Lươn sống' },
        L2619: { nameSnapshot: 'Tôm hùm' }
      }
    })
  ], '2026-07-16', (_item, targetId) => targetId);

  const [view] = buildDailyBatchViews([overview]);
  assert.deepEqual(view.groups[0].samples.map(sample => sample.sampleId), ['L2319', 'L2419', 'L2519', 'L2619']);
  assert.equal(
    view.groups[0].formattedSampleDetails,
    'L2319 (Lươn sống); L2419 (Ốc hương); L2519 (Lươn sống); L2619 (Tôm hùm)'
  );
  assert.deepEqual(
    view.groups[0].sampleDisplayRuns.map(run => run.sampleIds),
    [['L2319'], ['L2419'], ['L2519'], ['L2619']]
  );
  assert.equal(
    view.groups[0].formattedSampleDisplay,
    'L2319 (Lươn sống); L2419 (Ốc hương); L2519 (Lươn sống); L2619 (Tôm hùm)'
  );
  assert.equal(view.groups[0].formattedSampleDetails.includes('L2319; L2519 (Lươn sống)'), false);
});

test('sample display groups only adjacent samples with the same description while keeping full details searchable', () => {
  const [overview] = buildApprovedBatchOverviews([
    request({
      id: 'REQ-DESC-SAME',
      sampleList: Array.from({ length: 43 }, (_, index) => `U${String(index + 1).padStart(2, '0')}19`),
      sampleDescriptionMap: Object.fromEntries(
        Array.from({ length: 43 }, (_, index) => [
          `U${String(index + 1).padStart(2, '0')}19`,
          { nameSnapshot: 'Cá tra' }
        ])
      )
    })
  ], '2026-07-16', (_item, targetId) => targetId);

  const [view] = buildDailyBatchViews([overview]);
  const group = view.groups[0];
  assert.equal(group.samples.length, 43);
  assert.equal(group.sampleDisplayRuns.length, 1);
  assert.deepEqual(group.sampleDisplayRuns[0].sampleIds, group.sampleIds);
  assert.equal(group.sampleDisplayRuns[0].formattedSamples, 'U0119 -> U4319');
  assert.equal(group.formattedSampleDisplay, 'U0119 -> U4319 (Cá tra)');
  assert.match(group.formattedSampleDetails, /U2019 \(Cá tra\)/);
  assert.equal((group.formattedSampleDisplay.match(/Cá tra/g) || []).length, 1);
});

test('sample details omit empty description parentheses without changing sample order', () => {
  const [overview] = buildApprovedBatchOverviews([
    request({
      id: 'REQ-DESC-MISSING',
      sampleList: ['L2519', 'L2319', 'L2419'],
      sampleDescriptionMap: {
        L2319: { nameSnapshot: 'Lươn sống' },
        L2519: { nameSnapshot: 'Ốc hương' }
      }
    })
  ], '2026-07-16', (_item, targetId) => targetId);

  const [view] = buildDailyBatchViews([overview]);
  assert.equal(view.groups[0].formattedSampleDetails, 'L2319 (Lươn sống); L2419; L2519 (Ốc hương)');
  assert.equal(view.groups[0].formattedSampleDisplay, 'L2319 (Lươn sống); L2419; L2519 (Ốc hương)');
});

test('adjacent samples without descriptions still compress into a display range', () => {
  const sampleList = Array.from({ length: 43 }, (_, index) => `U${String(index + 1).padStart(2, '0')}19`);
  const [overview] = buildApprovedBatchOverviews([
    request({ id: 'REQ-NO-DESC-RANGE', sampleList })
  ], '2026-07-16', (_item, targetId) => targetId);

  const [view] = buildDailyBatchViews([overview]);
  assert.equal(view.groups[0].sampleDisplayRuns.length, 1);
  assert.equal(view.groups[0].sampleDisplayRuns[0].formattedSamples, 'U0119 -> U4319');
  assert.equal(view.groups[0].formattedSampleDisplay, 'U0119 -> U4319');
  assert.equal(view.groups[0].formattedSampleDisplay.includes('()'), false);
});

test('conflicting descriptions for the same sample are visible instead of silently overwritten', () => {
  const overviews = buildApprovedBatchOverviews([
    request({ id: 'REQ-A', sampleDescriptionMap: { A001: { nameSnapshot: 'Cá tra' } } }),
    request({ id: 'REQ-B', sampleDescriptionMap: { A001: { nameSnapshot: 'Cá basa' } } })
  ], '2026-07-16', (_item, targetId) => targetId);

  const [view] = buildDailyBatchViews(overviews);
  assert.equal(view.groups[0].hasDescriptionConflict, true);
  assert.deepEqual(view.groups[0].samples[0].descriptionAlternatives?.sort(), ['Cá basa', 'Cá tra']);
  assert.equal(view.groups[0].sampleDisplayRuns.length, 1);
  assert.equal(view.groups[0].sampleDisplayRuns[0].hasDescriptionConflict, true);
  assert.deepEqual(view.groups[0].sampleDisplayRuns[0].descriptionAlternatives?.sort(), ['Cá basa', 'Cá tra']);
});

test('a description conflict never merges into an adjacent normal display run', () => {
  const overviews = buildApprovedBatchOverviews([
    request({
      id: 'REQ-CONFLICT-A',
      sampleList: ['A001', 'A002'],
      sampleDescriptionMap: {
        A001: { nameSnapshot: 'Cá tra' },
        A002: { nameSnapshot: 'Cá tra' }
      }
    }),
    request({
      id: 'REQ-CONFLICT-B',
      sampleList: ['A001'],
      sampleDescriptionMap: { A001: { nameSnapshot: 'Cá basa' } }
    })
  ], '2026-07-16', (_item, targetId) => targetId);

  const [view] = buildDailyBatchViews(overviews);
  assert.deepEqual(
    view.groups[0].sampleDisplayRuns.map(run => run.sampleIds),
    [['A001'], ['A002']]
  );
  assert.equal(view.groups[0].sampleDisplayRuns[0].hasDescriptionConflict, true);
  assert.equal(view.groups[0].sampleDisplayRuns[1].hasDescriptionConflict, false);
});

test('same description separated by another description stays in separate display runs', () => {
  const [overview] = buildApprovedBatchOverviews([
    request({
      id: 'REQ-DESC-RUNS',
      sampleList: ['L2319', 'L2419', 'L2519'],
      sampleDescriptionMap: {
        L2319: { nameSnapshot: 'Lươn sống' },
        L2419: { nameSnapshot: 'Ốc hương' },
        L2519: { nameSnapshot: 'Lươn sống' }
      }
    })
  ], '2026-07-16', (_item, targetId) => targetId);

  const [view] = buildDailyBatchViews([overview]);
  assert.deepEqual(
    view.groups[0].sampleDisplayRuns.map(run => run.sampleIds),
    [['L2319'], ['L2419'], ['L2519']]
  );
  assert.equal(view.groups[0].formattedSampleDisplay, 'L2319 (Lươn sống); L2419 (Ốc hương); L2519 (Lươn sống)');
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
      sopId: `SOP-${index + 1}`,
      sopName: `SOP ${index + 1}`,
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

test('compact renderer uses the exact page allocation reported by the planner', () => {
  const targetCounts = [14, 28, 38, 1, 3, 1, 1, 3, 1];
  const overviews = buildApprovedBatchOverviews(targetCounts.map((targetCount, index) => request({
    id: `REQ-PRINT-${index + 1}`,
    sopId: `SOP-PRINT-${index + 1}`,
    sopName: `SOP Print ${index + 1}`,
    sampleList: Array.from({ length: index === 7 ? 42 : 3 }, (_, sampleIndex) => `L${index + 1}${sampleIndex + 1}15`),
    targetIds: Array.from({ length: targetCount }, (_, targetIndex) => `T-${index + 1}-${targetIndex + 1}`)
  })), '2026-07-16', (_item, targetId) => `Chỉ tiêu ${targetId}`);
  const views = buildDailyBatchViews(overviews);
  const plan = planDailyPrintLayout(views, true, 'landscape', 'compact');
  const pages = buildDailyCompactPrintPages(views, true, plan.orientation);

  assert.equal(plan.estimatedPages, pages.length);
  assert.equal(pages.flat(2).length, views.length);
  assert.deepEqual(
    pages.flat(2).map(batch => batch.cardKey).sort(),
    views.map(batch => batch.cardKey).sort()
  );
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

test('daily checklist shows prefixed sample codes before non-prefixed sample codes', () => {
  const overviews = buildApprovedBatchOverviews([
    request({
      sampleList: ['0108', 'U0108', '0208', 'U0208'],
      targetIds: ['T1']
    })
  ], '2026-07-16', (_item, targetId) => targetId);
  const [view] = buildDailyBatchViews(overviews);

  assert.deepEqual(view.groups[0].sampleIds, ['U0108', 'U0208', '0108', '0208']);
  assert.equal(view.groups[0].formattedSamples, 'U0108; U0208; 0108; 0208');
});

test('daily checklist keeps natural sample-code ordering before building display runs', () => {
  const overviews = buildApprovedBatchOverviews([
    request({
      sampleList: ['L1019', 'L919', 'L1119', 'L219'],
      targetIds: ['T1']
    })
  ], '2026-07-16', (_item, targetId) => targetId);
  const [view] = buildDailyBatchViews(overviews);

  assert.deepEqual(view.groups[0].sampleIds, ['L219', 'L919', 'L1019', 'L1119']);
  assert.deepEqual(view.groups[0].sampleDisplayRuns[0].sampleIds, view.groups[0].sampleIds);
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

test('full SOP snapshot is represented by one compact semantic scope', () => {
  const targetIds = Array.from({ length: 50 }, (_, index) => `T${index + 1}`);
  const targetNames = Object.fromEntries(targetIds.map(id => [id, `Chỉ tiêu ${id}`]));
  const [overview] = buildApprovedBatchOverviews([
    request({ sampleList: ['L0115'], targetIds, targetNames, sopVersion: 7 })
  ], '2026-07-16', (item, targetId) => item.targetNames?.[targetId] || targetId);
  const [view] = buildDailyBatchViews([overview]);

  assert.equal(view.groups[0].targetScope.kind, 'sop-all');
  assert.equal(view.groups[0].targetScope.compact, true);
  assert.equal(view.groups[0].targetScope.headline, 'Toàn bộ chỉ tiêu SOP');
  assert.equal(view.groups[0].targetScope.targetCount, 50);
  assert.equal(computeDailyBatchLayoutHint(view, 1200), 'compact');
});

test('compact scope reduces print estimate without changing the assigned target count', () => {
  const targetIds = Array.from({ length: 80 }, (_, index) => `T${index + 1}`);
  const targetNames = Object.fromEntries(targetIds.map(id => [id, `Chỉ tiêu kiểm nghiệm dài ${id}`]));
  const compactViews = buildDailyBatchViews(buildApprovedBatchOverviews([
    request({ id: 'REQ-SOP-ALL', targetIds, targetNames })
  ], '2026-07-16', (item, targetId) => item.targetNames?.[targetId] || targetId));
  const manualViews = buildDailyBatchViews(buildApprovedBatchOverviews([
    request({ id: 'REQ-MANUAL', targetIds })
  ], '2026-07-16', (_item, targetId) => `Chỉ tiêu kiểm nghiệm dài ${targetId}`));

  const compactPlan = planDailyPrintLayout(compactViews, true, 'portrait', 'compact');
  const manualPlan = planDailyPrintLayout(manualViews, true, 'portrait', 'compact');
  assert.equal(compactViews[0].uniqueTargets, 80);
  assert.ok(compactPlan.wrappedLineCount < manualPlan.wrappedLineCount);
});

test('a one-target SOP displays the target name instead of a redundant scope badge', () => {
  const [overview] = buildApprovedBatchOverviews([
    request({ targetIds: ['T1'], targetNames: { T1: 'Pirimiphos methyl' }, sopVersion: 1 })
  ], '2026-07-16', (item, targetId) => item.targetNames?.[targetId] || targetId);
  const [view] = buildDailyBatchViews([overview]);

  assert.equal(view.groups[0].targetScope.kind, 'sop-all');
  assert.equal(view.groups[0].targetScope.compact, false);
  assert.deepEqual(view.groups[0].targetScope.targetNames, ['Pirimiphos methyl']);
});
