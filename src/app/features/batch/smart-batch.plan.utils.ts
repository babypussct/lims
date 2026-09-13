import { DirectBatchPlanItem } from '../../core/services/state.service';
import { buildSampleTargetMap } from './smart-batch.utils';
import { ProposedBatch } from './smart-batch.models';

export function buildDirectBatchPlanItems(batches: ProposedBatch[]): DirectBatchPlanItem[] {
  return batches.map(batch => {
    const sampleTargetMap = buildSampleTargetMap(
      batch.tasks || [],
      batch.samples,
      batch.targets.map(t => t.id)
    );

    const finalInputs = {
      ...batch.inputValues,
      safetyMargin: Number(batch.safetyMargin),
      sampleList: Array.from(batch.samples),
      targetIds: batch.targets.map(t => t.id),
      sampleTargetMap,
      sampleDescriptionMap: batch.sampleDescriptionMap,
      analysisDate: batch.inputValues['analysisDate'],
      explicitGroupId: batch.tasks && batch.tasks.length > 0
        && batch.tasks.every(task => task.sourceGroupId && task.sourceGroupId === batch.tasks[0].sourceGroupId)
        ? batch.tasks[0].sourceGroupId
        : undefined
    };

    return {
      sop: batch.sop,
      calculatedItems: batch.resourceImpact || [],
      formInputs: finalInputs
    };
  });
}
