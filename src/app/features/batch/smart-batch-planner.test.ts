import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Sop } from '../../core/models/sop.model';
import { CalculatorService } from '../../core/services/calculator.service';
import { runTargetCentricPlanner } from './smart-batch-planner';
import { SmartBatchPlanningContext } from './smart-batch.models';

function createMockCalculator(): CalculatorService {
  return {
    calculateSopNeeds: () => []
  } as unknown as CalculatorService;
}

function makeSop(id: string, name: string, targets: string[], overrides: Partial<Sop> = {}): Sop {
  return {
    id,
    name,
    category: 'Test',
    inputs: [],
    variables: {},
    consumables: [],
    targets: targets.map(t => ({ id: t, name: t })),
    ...overrides
  };
}

describe('smart-batch-planner shared core', () => {
  it('splits single sample targets across 3 departments into 3 distinct batches', () => {
    const sopMetals = makeSop('sop-metals', 'SOP Kim loại (ICP-MS)', ['Pb', 'Cd']);
    const sopAntibiotics = makeSop('sop-antibiotics', 'SOP Kháng sinh (LC-MS/MS)', ['Enrofloxacin']);
    const sopMicro = makeSop('sop-micro', 'SOP Vi sinh', ['Salmonella']);

    const context: SmartBatchPlanningContext = {
      sops: [sopMetals, sopAntibiotics, sopMicro],
      availableTargets: [
        { id: 'pb', name: 'Pb' },
        { id: 'cd', name: 'Cd' },
        { id: 'enrofloxacin', name: 'Enrofloxacin' },
        { id: 'salmonella', name: 'Salmonella' }
      ],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    const blocks = [{
      id: 'single-sample',
      name: 'Mẫu M26-0001',
      samples: ['M26-0001'],
      selectedTargets: new Set(['pb', 'cd', 'enrofloxacin', 'salmonella'])
    }];

    const result = runTargetCentricPlanner(blocks, context, { defaultAnalysisDate: '2026-09-14' });

    assert.equal(result.batches.length, 3);
    assert.equal(result.unmappedTasks.length, 0);

    const sopsUsed = new Set(result.batches.map(b => b.sop.id));
    assert.deepEqual(sopsUsed, new Set(['sop-metals', 'sop-antibiotics', 'sop-micro']));
    assert.equal(result.batches.every(b => b.inputValues['analysisDate'] === '2026-09-14'), true);
  });

  it('supports target-level forced SOP assignments while auto-distributing other targets', () => {
    const sopManual = makeSop('sop-manual', 'SOP Đặc thù (Thủ công)', ['SpecialTarget'], { isManualOnly: true });
    const sopAuto = makeSop('sop-auto', 'SOP Tự động', ['AutoTarget']);

    const context: SmartBatchPlanningContext = {
      sops: [sopManual, sopAuto],
      availableTargets: [
        { id: 'specialtarget', name: 'SpecialTarget' },
        { id: 'autotarget', name: 'AutoTarget' }
      ],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    const blocks = [{
      id: 'single-sample',
      name: 'Mẫu M26-0002',
      samples: ['M26-0002'],
      selectedTargets: new Set(['specialtarget', 'autotarget']),
      forcedSopAssignments: {
        'specialtarget': 'sop-manual'
      }
    }];

    const result = runTargetCentricPlanner(blocks, context);

    assert.equal(result.batches.length, 2);
    assert.equal(result.unmappedTasks.length, 0);

    const manualBatch = result.batches.find(b => b.sop.id === 'sop-manual');
    const autoBatch = result.batches.find(b => b.sop.id === 'sop-auto');

    assert.ok(manualBatch);
    assert.ok(autoBatch);
    assert.deepEqual(manualBatch.tags, ['Forced-SOP']);
    assert.deepEqual(autoBatch.tags, ['Đã tối ưu tự động']);
  });

  it('leaves incompatible matrix targets in unmappedTasks', () => {
    const sopFishOnly = makeSop('sop-fish', 'SOP Thủy sản', ['HeavyMetal'], {
      matrixTags: ['thuy-san']
    });

    const context: SmartBatchPlanningContext = {
      sops: [sopFishOnly],
      availableTargets: [{ id: 'heavymetal', name: 'HeavyMetal' }],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    const blocks = [{
      id: 'single-sample',
      name: 'Mẫu Rau củ',
      samples: ['M26-VEG'],
      selectedTargets: new Set(['heavymetal']),
      matrixType: 'rau-cu' // incompatible with thuy-san
    }];

    const result = runTargetCentricPlanner(blocks, context);

    assert.equal(result.batches.length, 0);
    assert.equal(result.unmappedTasks.length, 1);
    assert.equal(result.unmappedTasks[0].targetId, 'heavymetal');
  });

  it('planner parity: single block with 1 sample produces identical batch count and assignments as 1 group in multiple mode', () => {
    const sopA = makeSop('sop-a', 'SOP A', ['T1', 'T2']);
    const sopB = makeSop('sop-b', 'SOP B', ['T3']);

    const context: SmartBatchPlanningContext = {
      sops: [sopA, sopB],
      availableTargets: [
        { id: 't1', name: 'T1' },
        { id: 't2', name: 'T2' },
        { id: 't3', name: 'T3' }
      ],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    const singleResult = runTargetCentricPlanner([{
      id: 'single',
      name: 'Mẫu X',
      samples: ['M01'],
      selectedTargets: new Set(['t1', 't2', 't3'])
    }], context);

    const multipleResult = runTargetCentricPlanner([{
      id: 1,
      name: 'Nhóm 1',
      samples: ['M01'],
      selectedTargets: new Set(['t1', 't2', 't3'])
    }], context);

    assert.equal(singleResult.batches.length, multipleResult.batches.length);
    assert.deepEqual(
      singleResult.batches.map(b => b.sop.id).sort(),
      multipleResult.batches.map(b => b.sop.id).sort()
    );
  });

  it('leaves targets in unmappedTasks without silent fallback when forced SOP is missing or does not cover target', () => {
    const sopOther = makeSop('sop-other', 'SOP Khác', ['OtherTarget']);
    const sopAuto = makeSop('sop-auto', 'SOP Auto', ['TargetA']);

    const context: SmartBatchPlanningContext = {
      sops: [sopOther, sopAuto],
      availableTargets: [
        { id: 'targeta', name: 'TargetA' },
        { id: 'othertarget', name: 'OtherTarget' }
      ],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    // User forced 'sop-other' for 'targeta', but sop-other does NOT contain targeta
    const result = runTargetCentricPlanner([{
      id: 'single',
      name: 'Mẫu Y',
      samples: ['M02'],
      selectedTargets: new Set(['targeta']),
      forcedSopAssignments: {
        'targeta': 'sop-other'
      }
    }], context);

    // Crucial: Must NOT silently auto-dispatch to sop-auto! Must stay unmapped.
    assert.equal(result.batches.length, 0);
    assert.equal(result.unmappedTasks.length, 1);
    assert.equal(result.unmappedTasks[0].targetId, 'targeta');
  });

  it('leaves targets in unmappedTasks without throwing when forced SOP has matrix conflict', () => {
    const sopFish = makeSop('sop-fish', 'SOP Thủy sản', ['TargetA'], { matrixTags: ['thuy-san'] });

    const context: SmartBatchPlanningContext = {
      sops: [sopFish],
      availableTargets: [{ id: 'targeta', name: 'TargetA' }],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    const result = runTargetCentricPlanner([{
      id: 'single',
      name: 'Mẫu Z',
      samples: ['M03'],
      selectedTargets: new Set(['targeta']),
      matrixType: 'nong-san',
      forcedSopAssignments: {
        'targeta': 'sop-fish'
      }
    }], context);

    assert.equal(result.batches.length, 0);
    assert.equal(result.unmappedTasks.length, 1);
    assert.equal(result.unmappedTasks[0].targetId, 'targeta');
  });
});
