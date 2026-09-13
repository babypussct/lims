import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Sop } from '../../core/models/sop.model';
import { CalculatorService } from '../../core/services/calculator.service';
import {
  applySingleTargetForcedSop,
  computeSingleSampleDraftFingerprint,
  computeSingleSamplePreview,
  removeSingleTargetForcedSop
} from './single-sample-dispatch.utils';
import { SingleSampleDraft, SmartBatchPlanningContext } from './smart-batch.models';

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

describe('single-sample-dispatch utils', () => {
  it('computes deterministic draft fingerprints independent of target order', () => {
    const draft1: SingleSampleDraft = {
      sampleCode: 'M26-0001',
      matrixType: 'thuy-san',
      selectedTargets: new Set(['pb', 'cd']),
      forcedSopAssignments: {},
      analysisDate: '2026-09-14'
    };

    const draft2: SingleSampleDraft = {
      sampleCode: 'm26-0001',
      matrixType: 'thuy-san',
      selectedTargets: new Set(['cd', 'pb']),
      forcedSopAssignments: {},
      analysisDate: '2026-09-14'
    };

    assert.equal(
      computeSingleSampleDraftFingerprint(draft1),
      computeSingleSampleDraftFingerprint(draft2)
    );
  });

  it('classifies unmapped targets into no_sop, matrix_incompatible, and manual_assignment_required', () => {
    const sopMatrix = makeSop('sop-fish', 'SOP Thủy sản', ['Pb'], { matrixTags: ['thuy-san'] });
    const sopManual = makeSop('sop-special', 'SOP Đặc thù', ['SpecialX'], { isManualOnly: true });

    const context: SmartBatchPlanningContext = {
      sops: [sopMatrix, sopManual],
      availableTargets: [
        { id: 'pb', name: 'Pb' },
        { id: 'specialx', name: 'SpecialX' },
        { id: 'ghost_target', name: 'GhostTarget' }
      ],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    const draft: SingleSampleDraft = {
      sampleCode: 'M26-0010',
      matrixType: 'nong-san', // Incompatible with sop-fish
      selectedTargets: new Set(['pb', 'specialx', 'ghost_target']),
      forcedSopAssignments: {},
      analysisDate: '2026-09-14'
    };

    const preview = computeSingleSamplePreview(draft, context);

    assert.equal(preview.proposedBatches.length, 0);
    assert.equal(preview.mappingIssues.length, 3);

    const issueMatrix = preview.mappingIssues.find(i => i.targetId === 'pb');
    const issueManual = preview.mappingIssues.find(i => i.targetId === 'specialx');
    const issueGhost = preview.mappingIssues.find(i => i.targetId === 'ghost_target');

    assert.equal(issueMatrix?.status, 'matrix_incompatible');
    assert.deepEqual(issueMatrix?.supportedMatrices, ['thuy-san']);

    assert.equal(issueManual?.status, 'manual_assignment_required');
    assert.equal(issueManual?.candidateSops?.length, 1);
    assert.equal(issueManual?.candidateSops?.[0].id, 'sop-special');

    assert.equal(issueGhost?.status, 'no_sop');
  });

  it('resolves manual_assignment_required when forced SOP is applied', () => {
    const sopManual = makeSop('sop-special', 'SOP Đặc thù', ['SpecialX'], { isManualOnly: true });

    const context: SmartBatchPlanningContext = {
      sops: [sopManual],
      availableTargets: [{ id: 'specialx', name: 'SpecialX' }],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    let draft: SingleSampleDraft = {
      sampleCode: 'M26-0010',
      selectedTargets: new Set(['specialx']),
      forcedSopAssignments: {},
      analysisDate: '2026-09-14'
    };

    const previewBefore = computeSingleSamplePreview(draft, context);
    assert.equal(previewBefore.mappingIssues[0].status, 'manual_assignment_required');
    assert.equal(previewBefore.isFullyCovered, false);

    // Apply forced SOP
    draft = applySingleTargetForcedSop(draft, 'specialx', 'sop-special');
    assert.equal(draft.forcedSopAssignments['specialx'], 'sop-special');

    const previewAfter = computeSingleSamplePreview(draft, context);
    assert.equal(previewAfter.mappingIssues.length, 0);
    assert.equal(previewAfter.proposedBatches.length, 1);
    assert.equal(previewAfter.proposedBatches[0].sop.id, 'sop-special');
    assert.equal(previewAfter.isFullyCovered, true);

    // Remove forced SOP
    draft = removeSingleTargetForcedSop(draft, 'specialx');
    assert.equal(draft.forcedSopAssignments['specialx'], undefined);
  });

  it('rejects stale preview sequence numbers in async race simulation', () => {
    let latestHandledSequence = 0;
    let finalPreviewState: string | null = null;

    function handlePreviewResponse(seq: number, resultLabel: string) {
      if (seq < latestHandledSequence) {
        // Stale result discarded
        return;
      }
      latestHandledSequence = seq;
      finalPreviewState = resultLabel;
    }

    // Request 1 sent at seq 1
    // Request 2 sent at seq 2
    // Request 2 finishes first:
    handlePreviewResponse(2, 'result-from-req-2');
    assert.equal(finalPreviewState, 'result-from-req-2');

    // Request 1 finishes later (stale):
    handlePreviewResponse(1, 'result-from-req-1');
    // Result 1 should NOT overwrite Result 2:
    assert.equal(finalPreviewState, 'result-from-req-2');
  });

  it('diagnoses invalid forced SOP assignment when SOP does not contain target and blocks isFullyCovered', () => {
    const sopA = makeSop('sop-a', 'SOP A', ['TargetA']);
    const sopB = makeSop('sop-b', 'SOP B', ['TargetB']);

    const context: SmartBatchPlanningContext = {
      sops: [sopA, sopB],
      availableTargets: [
        { id: 'targeta', name: 'TargetA' },
        { id: 'targetb', name: 'TargetB' }
      ],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    // User forces sop-a for targetb, but sop-a does NOT have targetb!
    const draft: SingleSampleDraft = {
      sampleCode: 'M26-9999',
      selectedTargets: new Set(['targeta', 'targetb']),
      forcedSopAssignments: {
        'targetb': 'sop-a'
      },
      analysisDate: '2026-09-14'
    };

    const preview = computeSingleSamplePreview(draft, context);

    assert.equal(preview.isFullyCovered, false);
    assert.equal(preview.mappingIssues.length, 1);
    assert.equal(preview.mappingIssues[0].targetId, 'targetb');
    assert.equal(preview.mappingIssues[0].status, 'no_sop');
    assert.ok(preview.mappingIssues[0].candidateSops?.some(c => c.id === 'sop-b'));
  });

  it('diagnoses invalid forced SOP assignment when SOP has matrix conflict and provides candidate SOPs', () => {
    const sopFish = makeSop('sop-fish', 'SOP Thủy sản', ['TargetA'], { matrixTags: ['thuy-san'] });
    const sopVeg = makeSop('sop-veg', 'SOP Rau củ', ['TargetA'], { matrixTags: ['rau-cu'] });

    const context: SmartBatchPlanningContext = {
      sops: [sopFish, sopVeg],
      availableTargets: [{ id: 'targeta', name: 'TargetA' }],
      inventoryCache: {},
      recipeCache: {},
      safetyConfig: { defaultMargin: 0 } as any,
      calculator: createMockCalculator()
    };

    const draft: SingleSampleDraft = {
      sampleCode: 'M26-8888',
      matrixType: 'rau-cu', // Incompatible with sop-fish, but sop-veg is compatible
      selectedTargets: new Set(['targeta']),
      forcedSopAssignments: {
        'targeta': 'sop-fish'
      },
      analysisDate: '2026-09-14'
    };

    const preview = computeSingleSamplePreview(draft, context);

    assert.equal(preview.isFullyCovered, false);
    assert.equal(preview.mappingIssues.length, 1);
    assert.equal(preview.mappingIssues[0].targetId, 'targeta');
    assert.equal(preview.mappingIssues[0].status, 'matrix_incompatible');
    assert.equal(preview.mappingIssues[0].candidateSops?.length, 1);
    assert.equal(preview.mappingIssues[0].candidateSops?.[0].id, 'sop-veg');
  });
});
