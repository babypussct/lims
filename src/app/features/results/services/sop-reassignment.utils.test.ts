import assert from 'node:assert/strict';
import test from 'node:test';
import { Request } from '../../../core/models/request.model';
import { Sop } from '../../../core/models/sop.model';
import {
  buildReassignmentInputs,
  calculateInventoryDelta,
  getMissingTargetIds,
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
