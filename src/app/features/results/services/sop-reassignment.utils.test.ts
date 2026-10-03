import assert from 'node:assert/strict';
import test from 'node:test';
import { Request } from '../../../core/models/request.model';
import { Sop } from '../../../core/models/sop.model';
import {
  buildReassignmentInputs,
  buildReassignmentTargetMetadata,
  calculateInventoryDelta,
  getMissingTargetIds,
  getRequiredTargetIds,
  getSopReassignmentOptions,
  getSopReassignmentSourceSignature,
  transferSopStatsForDay
} from './sop-reassignment.utils';

const request = {
  id: 'R1', sopId: 'A', sopName: 'A', items: [{ name: 'methanol', amount: 20, displayAmount: 20, unit: 'mL', stockUnit: 'mL' }],
  status: 'draft', timestamp: null, analysisDate: '2026-09-20', margin: 10,
  sampleList: ['M1', 'M2'], targetIds: ['Fipronil'], sampleTargetMap: { M1: ['Fipronil'], M2: ['Fipronil'] },
  inputs: { n_sample: 999, shared: 7, onlyA: 55, safetyMargin: 10 }
} as Request;

const sopB = {
  id: 'B', name: 'B', category: 'test', version: 2,
  inputs: [
    { var: 'shared', label: 'shared', type: 'number', default: 1 },
    { var: 'onlyB', label: 'onlyB', type: 'number', default: 3 }
  ], variables: {}, consumables: [], targets: [{ id: 'fip-b', name: 'Fipronil' }]
} as Sop;

const sourceSop = {
  ...sopB,
  id: 'A',
  targets: [
    { id: 'legacy-fip-a', name: 'Fipronil' },
    { id: 'legacy-clp-a', name: 'Chlorpyrifos' }
  ]
} as Sop;

test('buildReassignmentInputs keeps only target SOP inputs and recomputes sample count', () => {
  const inputs = buildReassignmentInputs(request, sopB);
  assert.equal(inputs.shared, 7);
  assert.equal(inputs.onlyB, 3);
  assert.equal(inputs.onlyA, undefined);
  assert.equal(inputs.n_sample, 2);
  assert.deepEqual(inputs.targetIds, ['fip-b']);
});

test('target coverage uses canonical compound identity', () => {
  assert.deepEqual(getMissingTargetIds(request, sopB), []);
  assert.equal(getMissingTargetIds(request, { ...sopB, targets: [] }).length, 1);
});

test('manual SOP coverage resolves legacy target IDs through the saved target names', () => {
  const legacyRequest = {
    ...request,
    sampleTargetMap: { M1: ['legacy-fip-a'], M2: ['legacy-fip-a'] },
    targetIds: ['legacy-fip-a'],
    targetNames: { 'legacy-fip-a': 'Fipronil' }
  } as Request;
  const manualSop = { ...sopB, isManualOnly: true };

  assert.deepEqual(getRequiredTargetIds(legacyRequest), ['fipronil']);
  assert.deepEqual(getMissingTargetIds(legacyRequest, manualSop), []);
  assert.deepEqual(buildReassignmentTargetMetadata(legacyRequest, manualSop), {
    targetIds: ['fip-b'],
    sampleTargetMap: { M1: ['fipronil'], M2: ['fipronil'] }
  });
});

test('an empty top-level target map does not hide legacy assignments stored in inputs', () => {
  const legacyRequest = {
    ...request,
    sampleTargetMap: {},
    targetIds: [],
    inputs: {
      ...request.inputs,
      targetIds: ['Fipronil'],
      sampleTargetMap: { M1: ['Fipronil'], M2: ['Fipronil'] }
    }
  } as Request;

  assert.deepEqual(getRequiredTargetIds(legacyRequest), ['fipronil']);
  assert.deepEqual(buildReassignmentInputs(legacyRequest, sopB).sampleTargetMap, {
    M1: ['fipronil'], M2: ['fipronil']
  });
});

test('manual SOPs remain selectable when the source SOP uses different target IDs', () => {
  const legacyRequest = {
    ...request,
    targetIds: ['legacy-fip-a'],
    sampleTargetMap: { M1: ['legacy-fip-a'], M2: ['legacy-fip-a'] }
  } as Request;
  const manualSop = { ...sopB, isManualOnly: true };
  const options = getSopReassignmentOptions(legacyRequest, [sourceSop, manualSop]);

  assert.deepEqual(options, [{ sop: manualSop, blockReason: null }]);
  assert.deepEqual(buildReassignmentInputs(legacyRequest, manualSop, sourceSop).sampleTargetMap, {
    M1: ['fipronil'], M2: ['fipronil']
  });
});

test('saved target names take precedence over a changed source SOP', () => {
  const legacyRequest = {
    ...request,
    sampleTargetMap: { M1: ['legacy-fip-a'], M2: ['legacy-fip-a'] },
    targetNames: { 'legacy-fip-a': 'Fipronil' }
  } as Request;
  const changedSource = { ...sourceSop, targets: [{ id: 'legacy-fip-a', name: 'Chlorpyrifos' }] };

  assert.deepEqual(getRequiredTargetIds(legacyRequest, changedSource), ['fipronil']);
  assert.deepEqual(getMissingTargetIds(legacyRequest, sopB, changedSource), []);
});

test('reassignment keeps each sample target subset and matches normalized sample codes', () => {
  const mixedRequest = {
    ...request,
    sampleTargetMap: { ' m1 ': ['legacy-fip-a'], m2: ['legacy-clp-a'] }
  } as Request;
  const targetSop = {
    ...sopB,
    targets: [{ id: 'fip-b', name: 'Fipronil' }, { id: 'clp-b', name: 'Chlorpyrifos' }]
  };

  assert.deepEqual(buildReassignmentTargetMetadata(mixedRequest, targetSop, sourceSop), {
    targetIds: ['fip-b', 'clp-b'],
    sampleTargetMap: { M1: ['fipronil'], M2: ['chlorpyrifos'] }
  });
});

test('ineligible manual SOPs are visible with the actual missing targets', () => {
  const manualSop = {
    ...sopB,
    id: 'SOP-03',
    name: 'Trifluralin',
    isManualOnly: true,
    targets: [{ id: 'trifluralin', name: 'Trifluralin' }]
  };
  const options = getSopReassignmentOptions({ ...request, targetNames: { fipronil: 'Fipronil' } }, [manualSop]);

  assert.equal(options.length, 1);
  assert.equal(options[0].sop, manualSop);
  assert.match(options[0].blockReason || '', /1 chỉ tiêu.*Fipronil/);
});

test('manual SOPs without a result form have an explicit reason and archived SOPs stay excluded', () => {
  const manualSop = {
    ...sopB,
    name: 'Quy trình đặc thù',
    isManualOnly: true,
    targets: [{ id: 'acephate', name: 'Acephate' }]
  };
  const options = getSopReassignmentOptions(request, [sourceSop, manualSop, { ...sopB, id: 'archived', isArchived: true }]);

  assert.equal(options.length, 1);
  assert.equal(options[0].sop, manualSop);
  assert.match(options[0].blockReason || '', /chưa có biểu mẫu nhập kết quả/);
  assert.deepEqual(getSopReassignmentOptions({ ...request, status: 'completed' }, [manualSop]), []);
});

test('manual selection never treats an unknown legacy target ID as covered', () => {
  const unknownRequest = {
    ...request,
    sampleTargetMap: { M1: ['unknown-target-id'], M2: ['unknown-target-id'] }
  } as Request;

  assert.deepEqual(getMissingTargetIds(unknownRequest, { ...sopB, isManualOnly: true }, sourceSop), ['unknown_target_id']);
});

test('inventory delta returns old allocation and deducts new allocation', () => {
  assert.deepEqual(calculateInventoryDelta(request.items, [
    { name: 'methanol', amount: 5, displayAmount: 5, unit: 'mL', stockUnit: 'mL' },
    { name: 'hexane', amount: 15, displayAmount: 15, unit: 'mL', stockUnit: 'mL' }
  ]), { methanol: 15, hexane: -15 });
});

test('source signature ignores object key insertion order', () => {
  const reordered = {
    ...request,
    sampleTargetMap: { M2: ['Fipronil'], M1: ['Fipronil'] },
    items: [{
      stockUnit: 'mL',
      unit: 'mL',
      displayAmount: 20,
      amount: 20,
      name: 'methanol'
    }]
  } as Request;

  assert.equal(
    getSopReassignmentSourceSignature(reordered),
    getSopReassignmentSourceSignature(request)
  );
});

test('source signature changes when reassignment business inputs change', () => {
  const changed = {
    ...request,
    items: [{ ...request.items[0], amount: 21 }]
  } as Request;

  assert.notEqual(
    getSopReassignmentSourceSignature(changed),
    getSopReassignmentSourceSignature(request)
  );
});

test('source signature detects changes to target identity and legacy input assignments', () => {
  for (const change of [
    { targetNames: { fipronil: 'Chlorpyrifos' } },
    { targetIds: ['Chlorpyrifos'] },
    { inputs: { ...request.inputs, sampleTargetMap: { M1: ['Chlorpyrifos'] } } }
  ]) {
    assert.notEqual(getSopReassignmentSourceSignature({ ...request, ...change }), getSopReassignmentSourceSignature(request));
  }
});

test('stats transfer changes SOP buckets without changing daily totals', () => {
  const source = {
    '2026-09-20': {
      totalSamples: 12, totalBatches: 2, totalQcs: 3,
      sops: { A: { samples: 2, batches: 1, qcs: 1 }, C: { samples: 10, batches: 1, qcs: 2 } }
    }
  };
  const next = transferSopStatsForDay(source, '2026-09-20', 'A', 'B', 2, 1, 1);
  assert.deepEqual(next['2026-09-20'].sops.B, { samples: 2, batches: 1, qcs: 1 });
  assert.equal(next['2026-09-20'].sops.A, undefined);
  assert.equal(next['2026-09-20'].totalSamples, 12);
  assert.equal(next['2026-09-20'].totalBatches, 2);
});
