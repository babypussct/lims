import { Sop } from '../../core/models/sop.model';
import { getCanonicalId, normalizeSampleCode, resolveTargetMasterInfo } from '../results/shared/compound-id-resolver';
import { getSopTargetKey, isSopMatrixCompatible } from './smart-batch.utils';
import {
  SingleSampleDraft,
  SingleSamplePreview,
  SmartBatchPlanningContext,
  SopCandidateSummary,
  TargetAssignment,
  TargetMappingIssue
} from './smart-batch.models';
import { PlanningInputBlock, runTargetCentricPlanner } from './smart-batch-planner';

export function computeSingleSampleDraftFingerprint(draft: SingleSampleDraft): string {
  const sample = normalizeSampleCode(draft.sampleCode);
  const matrix = draft.matrixType || '';
  const date = draft.analysisDate || '';
  const desc = `${draft.sampleDescription?.masterId || ''}:${draft.sampleDescription?.nameSnapshot || ''}`;
  const targets = Array.from(draft.selectedTargets, getCanonicalId).filter(Boolean).sort().join(',');
  const forced = Object.entries(draft.forcedSopAssignments || {})
    .map(([t, s]) => `${getCanonicalId(t)}=>${s}`)
    .sort()
    .join(';');
  return `${sample}|${matrix}|${date}|${desc}|${targets}|${forced}`;
}

export function applySingleTargetForcedSop(
  draft: SingleSampleDraft,
  targetId: string,
  sopId: string
): SingleSampleDraft {
  const canonicalTarget = getCanonicalId(targetId);
  return {
    ...draft,
    forcedSopAssignments: {
      ...draft.forcedSopAssignments,
      [canonicalTarget]: sopId
    }
  };
}

export function removeSingleTargetForcedSop(
  draft: SingleSampleDraft,
  targetId: string
): SingleSampleDraft {
  const canonicalTarget = getCanonicalId(targetId);
  const nextForced = { ...draft.forcedSopAssignments };
  delete nextForced[canonicalTarget];
  return {
    ...draft,
    forcedSopAssignments: nextForced
  };
}

export function computeSingleSamplePreview(
  draft: SingleSampleDraft,
  context: SmartBatchPlanningContext
): SingleSamplePreview {
  const sample = draft.sampleCode.trim();
  const canonicalTargets = new Set(
    Array.from(draft.selectedTargets, getCanonicalId).filter(Boolean)
  );

  if (!sample || canonicalTargets.size === 0) {
    return {
      sample: draft,
      proposedBatches: [],
      assignments: [],
      mappingIssues: [],
      isFullyCovered: false,
      hasResourceIssues: false,
      generatedAt: Date.now(),
      draftFingerprint: computeSingleSampleDraftFingerprint(draft)
    };
  }

  const block: PlanningInputBlock = {
    id: `single-${normalizeSampleCode(sample) || 'sample'}`,
    name: `Mẫu ${sample}`,
    samples: [sample],
    selectedTargets: canonicalTargets,
    matrixType: draft.matrixType,
    forcedSopAssignments: draft.forcedSopAssignments,
    sampleDescriptionMap: draft.sampleDescription ? { [sample]: draft.sampleDescription } : {},
    analysisDate: draft.analysisDate
  };

  const plannerResult = runTargetCentricPlanner([block], context, {
    defaultAnalysisDate: draft.analysisDate
  });

  const assignments: TargetAssignment[] = [];
  plannerResult.batches.forEach((batch, batchIndex) => {
    (batch.tasks || []).forEach(task => {
      assignments.push({
        targetId: task.targetId,
        targetName: task.targetName,
        sopId: batch.sop.id,
        sopName: batch.sop.name,
        batchIndex
      });
    });
  });

  // Diagnostic classification for unmapped tasks
  const sops = (context.sops || []).filter(s => !s.isArchived);
  const mappingIssues: TargetMappingIssue[] = [];

  for (const unmapped of plannerResult.unmappedTasks) {
    const targetId = unmapped.targetId;
    const foundTarget = resolveTargetMasterInfo(targetId, context.availableTargets);
    const targetName = foundTarget?.name || unmapped.targetName || targetId;

    const sopsWithTarget = sops.filter(sop =>
      (sop.targets || []).some(t => getSopTargetKey(t) === targetId)
    );

    const forcedId = draft.forcedSopAssignments?.[targetId];
    if (forcedId) {
      const forcedSop = sops.find(s => s.id === forcedId);
      if (!forcedSop || !forcedSop.targets?.some(t => getSopTargetKey(t) === targetId)) {
        const candidateSops: SopCandidateSummary[] = sopsWithTarget
          .filter(sop => isSopMatrixCompatible(sop, draft.matrixType))
          .map(s => ({
            id: s.id,
            name: s.name,
            ref: s.ref,
            device: s.device,
            matrixTags: s.matrixTags
          }));
        mappingIssues.push({
          targetId,
          targetName,
          status: 'no_sop',
          candidateSops
        });
        continue;
      }
      if (!isSopMatrixCompatible(forcedSop, draft.matrixType)) {
        const candidateSops: SopCandidateSummary[] = sopsWithTarget
          .filter(sop => isSopMatrixCompatible(sop, draft.matrixType))
          .map(s => ({
            id: s.id,
            name: s.name,
            ref: s.ref,
            device: s.device,
            matrixTags: s.matrixTags
          }));
        mappingIssues.push({
          targetId,
          targetName,
          status: 'matrix_incompatible',
          matrixType: draft.matrixType,
          supportedMatrices: forcedSop.matrixTags || [],
          candidateSops: candidateSops.length > 0 ? candidateSops : undefined
        });
        continue;
      }
    }

    if (sopsWithTarget.length === 0) {
      mappingIssues.push({
        targetId,
        targetName,
        status: 'no_sop'
      });
      continue;
    }

    const compatibleSops = sopsWithTarget.filter(sop => isSopMatrixCompatible(sop, draft.matrixType));
    if (compatibleSops.length === 0) {
      const supportedMatrices = Array.from(new Set(
        sopsWithTarget.flatMap(s => s.matrixTags || [])
      ));
      mappingIssues.push({
        targetId,
        targetName,
        status: 'matrix_incompatible',
        matrixType: draft.matrixType,
        supportedMatrices
      });
      continue;
    }

    // Has compatible SOPs, but why wasn't it mapped?
    // Check if it only has manual-only SOPs
    const manualOnlyCompatible = compatibleSops.filter(sop => Boolean(sop.isManualOnly));
    if (manualOnlyCompatible.length > 0) {
      const candidates: SopCandidateSummary[] = manualOnlyCompatible.map(sop => ({
        id: sop.id,
        name: sop.name,
        ref: sop.ref,
        device: sop.device,
        matrixTags: sop.matrixTags
      }));
      mappingIssues.push({
        targetId,
        targetName,
        status: 'manual_assignment_required',
        candidateSops: candidates
      });
      continue;
    }

    // Default fallback if unmapped for other reasons (e.g. forced assignment conflict)
    mappingIssues.push({
      targetId,
      targetName,
      status: 'no_sop'
    });
  }

  const hasResourceIssues = plannerResult.batches.some(
    b => b.resourceStatus === 'stock_insufficient' || b.resourceStatus === 'calculation_invalid'
  );

  const isFullyCovered = mappingIssues.length === 0 && plannerResult.batches.length > 0;

  return {
    sample: draft,
    proposedBatches: plannerResult.batches,
    assignments,
    mappingIssues,
    isFullyCovered,
    hasResourceIssues,
    generatedAt: Date.now(),
    draftFingerprint: computeSingleSampleDraftFingerprint(draft)
  };
}
