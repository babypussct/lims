import { Sop, SopTarget, CalculatedItem } from '../../core/models/sop.model';
import { SampleDescriptionMap, SampleDescriptionSnapshot } from '../../core/models/sample-description.model';
import { getCanonicalId, normalizeSampleCode, resolveTargetMasterInfo } from '../results/shared/compound-id-resolver';
import {
  applyNeedsToStockLedger,
  buildAnalysisTaskKey,
  buildSampleTargetPairs,
  countUnavailableStockItems,
  getForcedSopAssignmentIssue,
  getSopTargetKey,
  isSopMatrixCompatible,
  validateCalculatedItems
} from './smart-batch.utils';
import {
  AnalysisTask,
  BatchResourceStatus,
  PlanningInputBlock,
  ProposedBatch,
  SmartBatchPlanningContext
} from './smart-batch.models';
import { getLocalTodayDate } from './smart-batch.date.utils';

export { PlanningInputBlock };

export interface SmartBatchPlanningResult {
  batches: ProposedBatch[];
  unmappedTasks: AnalysisTask[];
}

export function buildDefaultBatchInputs(
  sop: Sop,
  sampleCount: number,
  analysisDate: string = getLocalTodayDate()
): Record<string, any> {
  const inputs: Record<string, any> = { analysisDate };
  (sop.inputs || []).forEach(input => inputs[input.var] = input.default);
  inputs['analysisDate'] ||= analysisDate;
  inputs['n_sample'] = sampleCount;
  if (sop.device) inputs['device'] = sop.device;
  return inputs;
}

export function validateGlobalStockForBatches(
  batches: ProposedBatch[],
  inventoryCache: Record<string, { stock: number }>
): ProposedBatch[] {
  const ledger: Record<string, number> = {};
  Object.entries(inventoryCache).forEach(([k, v]) => ledger[k] = v.stock);

  return batches.map(batch => {
    const needs = batch.resourceImpact || [];
    let isMissing = false;
    const missingNames: string[] = [];

    const updatedNeeds = needs.map(item => {
      const newItem = { ...item };

      if (newItem.isComposite) {
        newItem.breakdown = (newItem.breakdown || []).map(sub => {
          const available = ledger[sub.name] ?? 0;
          const subMissing = available < sub.totalNeed;
          if (subMissing) {
            isMissing = true;
            if (!missingNames.includes(sub.displayName || sub.name)) {
              missingNames.push(sub.displayName || sub.name);
            }
          }
          if (ledger[sub.name] !== undefined) ledger[sub.name] -= sub.totalNeed;
          return { ...sub, isMissing: subMissing };
        });
      } else {
        const available = ledger[newItem.name] ?? 0;
        const itemMissing = available < newItem.stockNeed;
        if (itemMissing) {
          isMissing = true;
          if (!missingNames.includes(newItem.displayName || newItem.name)) {
            missingNames.push(newItem.displayName || newItem.name);
          }
        }
        if (ledger[newItem.name] !== undefined) ledger[newItem.name] -= newItem.stockNeed;
        newItem.isMissing = itemMissing;
      }
      return newItem;
    });

    const validationIssues = validateCalculatedItems(updatedNeeds, batch.safetyMargin);
    let resourceStatus: BatchResourceStatus = 'stock_ready';
    if (validationIssues.length > 0) {
      resourceStatus = 'calculation_invalid';
    } else if (isMissing) {
      resourceStatus = 'stock_insufficient';
    }

    const newStatus = isMissing ? 'missing_stock' : 'ready';
    return {
      ...batch,
      resourceImpact: updatedNeeds,
      status: newStatus,
      resourceStatus,
      resourceIssues: missingNames.length > 0 ? missingNames : undefined,
      isExpanded: isMissing ? true : (batch.isExpanded || false)
    };
  });
}

export function runTargetCentricPlanner(
  blocks: PlanningInputBlock[],
  context: SmartBatchPlanningContext,
  options: { defaultAnalysisDate?: string } = {}
): SmartBatchPlanningResult {
  const sops = (context.sops || []).filter(s => !s.isArchived);
  const sopById = new Map<string, Sop>(sops.map(s => [s.id, s]));
  const defaultAnalysisDate = options.defaultAnalysisDate || getLocalTodayDate();

  const planningLedger: Record<string, number> = {};
  Object.values(context.inventoryCache || {}).forEach(item => {
    planningLedger[item.id] = item.stock;
  });

  const descriptionIndex = new Map<string, SampleDescriptionSnapshot>();
  blocks.forEach(b => {
    if (b.sampleDescriptionMap) {
      Object.entries(b.sampleDescriptionMap).forEach(([sample, desc]) => {
        const key = normalizeSampleCode(sample);
        if (key && desc) descriptionIndex.set(key, desc as SampleDescriptionSnapshot);
      });
    }
  });

  const forcedAssignments = new Map<string, string>(); // taskKey -> sopId
  const pendingTasks = new Map<string, AnalysisTask>();
  const forcedTasksBySop = new Map<string, AnalysisTask[]>();
  const invalidForcedTasks: AnalysisTask[] = [];

  for (const block of blocks) {
    const samples = block.samples.filter(Boolean);
    if (samples.length === 0 || block.selectedTargets.size === 0) continue;

    // Validate block-level forced SOP if set (Multiple mode)
    if (block.forcedSopId) {
      const forcedSop = sopById.get(block.forcedSopId);
      const forcedIssue = getForcedSopAssignmentIssue(forcedSop, block.selectedTargets, block.matrixType);
      if (forcedIssue) throw new Error(forcedIssue);
    }

    for (const { sample, targetId } of buildSampleTargetPairs(samples, block.selectedTargets)) {
      const foundTarget = resolveTargetMasterInfo(targetId, context.availableTargets);
      const task: AnalysisTask = {
        sample,
        targetId,
        targetName: foundTarget?.name || targetId,
        covered: false,
        matrixType: block.matrixType,
        sourceGroupId: block.sourceGroupId
      };
      const key = buildAnalysisTaskKey(sample, targetId);

      // Determine target-level or block-level forced assignment
      const forcedSopId = block.forcedSopAssignments?.[targetId] || block.forcedSopId;

      if (forcedSopId) {
        const forcedSop = sopById.get(forcedSopId);
        if (!forcedSop || !forcedSop.targets?.some(t => getSopTargetKey(t) === targetId)) {
          // Forced SOP missing, archived, or does not contain this target.
          // Do NOT silently auto-dispatch! Keep in unmappedTasks.
          pendingTasks.delete(key);
          invalidForcedTasks.push({ ...task, covered: false });
          continue;
        }
        if (!isSopMatrixCompatible(forcedSop, block.matrixType)) {
          // Forced SOP incompatible with matrix. Keep in unmappedTasks.
          pendingTasks.delete(key);
          invalidForcedTasks.push({ ...task, covered: false });
          continue;
        }
        const existingForced = forcedAssignments.get(key);
        if (existingForced && existingForced !== forcedSop.id) {
          // Conflicting forced assignments across sources. Keep in unmappedTasks.
          pendingTasks.delete(key);
          invalidForcedTasks.push({ ...task, covered: false });
          continue;
        }
        if (!existingForced) {
          forcedAssignments.set(key, forcedSop.id);
          pendingTasks.delete(key);
          const tasksForSop = forcedTasksBySop.get(forcedSop.id) || [];
          tasksForSop.push({ ...task, covered: true });
          forcedTasksBySop.set(forcedSop.id, tasksForSop);
        }
      } else if (!forcedAssignments.has(key)) {
        const existingTask = pendingTasks.get(key);
        if (!existingTask) {
          pendingTasks.set(key, task);
        } else if (!existingTask.matrixType && task.matrixType) {
          pendingTasks.set(key, { ...existingTask, matrixType: task.matrixType });
        }
      }
    }
  }

  const batches: ProposedBatch[] = [];
  let batchIdCounter = 1;

  // 1. Create batches for Forced SOPs
  for (const [sopId, tasks] of forcedTasksBySop.entries()) {
    const forcedSop = sopById.get(sopId);
    if (!forcedSop || tasks.length === 0) continue;

    const blockSamples = new Set(tasks.map(t => t.sample));
    const blockTargetIds = new Set(tasks.map(t => t.targetId));
    const batchTargets = (forcedSop.targets || []).filter(target => blockTargetIds.has(getSopTargetKey(target)));
    const inputs = buildDefaultBatchInputs(forcedSop, blockSamples.size, defaultAnalysisDate);
    const needs = context.calculator.calculateSopNeeds(
      forcedSop, inputs, -1, context.inventoryCache, context.recipeCache, context.safetyConfig
    );
    applyNeedsToStockLedger(needs, planningLedger);

    const descMap: SampleDescriptionMap = {};
    blockSamples.forEach(s => {
      const snap = descriptionIndex.get(normalizeSampleCode(s));
      if (snap) descMap[s] = snap;
    });

    batches.push({
      id: `batch-forced-${batchIdCounter++}`,
      name: forcedSop.name + ' (Chỉ định)',
      sop: forcedSop,
      targets: batchTargets,
      samples: blockSamples,
      sampleCount: blockSamples.size,
      tasks,
      inputValues: inputs,
      safetyMargin: -1,
      resourceImpact: needs,
      status: 'ready',
      tags: ['Forced-SOP'],
      isExpanded: false,
      sampleDescriptionMap: descMap
    });
  }

  // 2. Greedy Loop for Auto SOPs
  const taskByKey = new Map(pendingTasks);
  const remainingTaskKeys = new Set(taskByKey.keys());
  const remainingTasksBySample = new Map<string, number>();
  taskByKey.forEach(task => {
    const sampleKey = normalizeSampleCode(task.sample);
    remainingTasksBySample.set(sampleKey, (remainingTasksBySample.get(sampleKey) || 0) + 1);
  });

  const sopsForAuto = sops.filter(sop => !sop.isManualOnly);
  const eligibleTaskKeysBySop = new Map<string, string[]>();
  for (const sop of sopsForAuto) {
    const sopTargetIds = new Set((sop.targets || []).map(getSopTargetKey));
    const eligibleKeys: string[] = [];
    taskByKey.forEach((task, key) => {
      if (sopTargetIds.has(task.targetId) && isSopMatrixCompatible(sop, task.matrixType)) {
        eligibleKeys.push(key);
      }
    });
    eligibleTaskKeysBySop.set(sop.id, eligibleKeys);
  }

  const needsCache = new Map<string, { inputs: Record<string, any>; needs: CalculatedItem[] }>();
  const getCachedNeeds = (sop: Sop, sampleCount: number) => {
    const inputs = buildDefaultBatchInputs(sop, sampleCount, defaultAnalysisDate);
    const cacheKey = `${sop.id}|${sampleCount}|${JSON.stringify(inputs)}`;
    const cached = needsCache.get(cacheKey);
    if (cached) return cached;
    const needs = context.calculator.calculateSopNeeds(
      sop, inputs, -1, context.inventoryCache, context.recipeCache, context.safetyConfig
    );
    const result = { inputs, needs };
    needsCache.set(cacheKey, result);
    return result;
  };

  let iterationCount = 0;
  const maxIterations = Math.max(1, Math.min(remainingTaskKeys.size, sopsForAuto.length + 1));

  while (remainingTaskKeys.size > 0 && iterationCount < maxIterations) {
    iterationCount++;
    const candidates = sopsForAuto.map(sop => {
      if (!sop.targets || sop.targets.length === 0) return null;
      const coverableTasks = (eligibleTaskKeysBySop.get(sop.id) || [])
        .filter(key => remainingTaskKeys.has(key))
        .map(key => taskByKey.get(key)!)
        .filter(Boolean);
      if (coverableTasks.length === 0) return null;

      let score = coverableTasks.length * 10;
      const coveredBySample = new Map<string, number>();
      const coveredTargetIds = new Set<string>();
      coverableTasks.forEach(task => {
        const sampleKey = normalizeSampleCode(task.sample);
        coveredBySample.set(sampleKey, (coveredBySample.get(sampleKey) || 0) + 1);
        coveredTargetIds.add(task.targetId);
      });
      coveredBySample.forEach((coveredCount, sampleKey) => {
        if (remainingTasksBySample.get(sampleKey) === coveredCount) score += 5;
      });

      score += (coveredTargetIds.size / sop.targets.length) * 30;
      score -= (sop.targets.length - coveredTargetIds.size);

      const sampleCount = coveredBySample.size;
      const { inputs, needs } = getCachedNeeds(sop, sampleCount);
      const unavailableCount = countUnavailableStockItems(needs, planningLedger);
      const validationCount = validateCalculatedItems(needs, -1).length;
      score -= unavailableCount * 100;
      score -= validationCount * 1000;

      return { sop, coverableTasks, score, inputs, needs };
    }).filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null);

    if (candidates.length === 0) break;
    candidates.sort((a, b) =>
      b.score - a.score
      || a.sop.name.localeCompare(b.sop.name)
      || a.sop.id.localeCompare(b.sop.id)
    );

    const bestFit = candidates[0];
    const coveredTasks = bestFit.coverableTasks.map(task => ({ ...task, covered: true }));
    const batchSamples = new Set(coveredTasks.map(task => task.sample));
    const batchTargetIds = new Set(coveredTasks.map(task => task.targetId));
    const batchTargets = (bestFit.sop.targets || []).filter(target => batchTargetIds.has(getSopTargetKey(target)));
    applyNeedsToStockLedger(bestFit.needs, planningLedger);

    const tags = ['Đã tối ưu tự động'];
    const descMap: SampleDescriptionMap = {};
    batchSamples.forEach(s => {
      const snap = descriptionIndex.get(normalizeSampleCode(s));
      if (snap) descMap[s] = snap;
    });

    batches.push({
      id: `batch-auto-${batchIdCounter++}`,
      name: bestFit.sop.name,
      sop: bestFit.sop,
      targets: batchTargets,
      samples: batchSamples,
      sampleCount: batchSamples.size,
      tasks: coveredTasks,
      inputValues: bestFit.inputs,
      safetyMargin: -1,
      resourceImpact: bestFit.needs,
      status: 'ready',
      tags,
      isExpanded: false,
      sampleDescriptionMap: descMap
    });

    coveredTasks.forEach(task => {
      const key = buildAnalysisTaskKey(task.sample, task.targetId);
      if (!remainingTaskKeys.delete(key)) return;
      const sampleKey = normalizeSampleCode(task.sample);
      const count = remainingTasksBySample.get(sampleKey) || 0;
      if (count <= 1) remainingTasksBySample.delete(sampleKey);
      else remainingTasksBySample.set(sampleKey, count - 1);
    });
  }

  const remainingTasks = Array.from(remainingTaskKeys)
    .map(key => taskByKey.get(key))
    .filter((task): task is AnalysisTask => Boolean(task));

  // 3. Final global stock validation for all batches
  const validatedBatches = validateGlobalStockForBatches(batches, context.inventoryCache);

  return {
    batches: validatedBatches,
    unmappedTasks: [...invalidForcedTasks, ...remainingTasks]
  };
}
