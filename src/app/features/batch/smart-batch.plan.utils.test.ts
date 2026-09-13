import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Sop } from '../../core/models/sop.model';
import { ProposedBatch } from './smart-batch.models';
import { buildDirectBatchPlanItems } from './smart-batch.plan.utils';

function makeSop(id: string): Sop {
  return {
    id,
    name: `SOP ${id}`,
    category: 'Test',
    inputs: [],
    variables: {},
    consumables: [],
    targets: [{ id: 't1', name: 'T1' }]
  };
}

describe('smart-batch plan utils', () => {
  it('materializes DirectBatchPlanItem array with analysisDate and sampleTargetMap', () => {
    const batches: ProposedBatch[] = [{
      id: 'batch-1',
      name: 'Batch 1',
      sop: makeSop('sop-1'),
      targets: [{ id: 't1', name: 'T1' }],
      samples: new Set(['M01', 'M02']),
      sampleCount: 2,
      tasks: [
        { sample: 'M01', targetId: 't1', targetName: 'T1', covered: true, sourceGroupId: 'grp-1' },
        { sample: 'M02', targetId: 't1', targetName: 'T1', covered: true, sourceGroupId: 'grp-1' }
      ],
      inputValues: { analysisDate: '2026-09-14', customField: 42 },
      safetyMargin: 5,
      resourceImpact: [],
      status: 'ready',
      sampleDescriptionMap: { 'M01': { nameSnapshot: 'Sample 1' } }
    }];

    const planItems = buildDirectBatchPlanItems(batches);

    assert.equal(planItems.length, 1);
    const item = planItems[0];
    assert.equal(item.sop.id, 'sop-1');
    assert.equal(item.formInputs.analysisDate, '2026-09-14');
    assert.equal(item.formInputs.safetyMargin, 5);
    assert.deepEqual(item.formInputs.sampleList, ['M01', 'M02']);
    assert.deepEqual(item.formInputs.targetIds, ['t1']);
    assert.deepEqual(item.formInputs.sampleTargetMap, {
      'M01': ['t1'],
      'M02': ['t1']
    });
    assert.equal(item.formInputs.explicitGroupId, 'grp-1');
    assert.deepEqual(item.formInputs.sampleDescriptionMap, { 'M01': { nameSnapshot: 'Sample 1' } });
  });
});
