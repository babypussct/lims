import { CalculatedItem, Sop, SopTarget } from '../../core/models/sop.model';
import { getCanonicalId, normalizeSampleCode } from '../results/shared/compound-id-resolver';

export interface BatchPlanValidationIssue {
  code: 'FORMULA_ERROR' | 'INVALID_AMOUNT' | 'UNIT_MISMATCH' | 'INVALID_MARGIN';
  message: string;
  itemName?: string;
}

export interface SampleTargetPair {
  sample: string;
  targetId: string;
}

export function buildSampleTargetMap(
  tasks: Iterable<Pick<SampleTargetPair, 'sample' | 'targetId'>>,
  fallbackSamples: Iterable<string> = [],
  fallbackTargetIds: Iterable<string> = []
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  let hasTask = false;
  for (const task of tasks) {
    const sample = String(task.sample || '').trim();
    const targetId = getCanonicalId(String(task.targetId || ''));
    if (!sample || !targetId) continue;
    hasTask = true;
    const targets = result[sample] || (result[sample] = []);
    if (!targets.includes(targetId)) targets.push(targetId);
  }

  if (hasTask) return result;
  const targetIds = Array.from(new Set(Array.from(fallbackTargetIds)
    .map(targetId => getCanonicalId(String(targetId || '')))
    .filter(Boolean)));
  for (const rawSample of fallbackSamples) {
    const sample = String(rawSample || '').trim();
    if (sample) result[sample] = [...targetIds];
  }
  return result;
}

export function parseUniqueSampleCodes(rawSamples: string): string[] {
  const unique = new Map<string, string>();
  String(rawSamples || '')
    .split(/\r?\n/)
    .map(sample => sample.trim())
    .filter(Boolean)
    .forEach(sample => {
      const key = normalizeSampleCode(sample);
      if (key && !unique.has(key)) unique.set(key, sample);
    });
  return Array.from(unique.values());
}

export function buildAnalysisTaskKey(sample: string, targetId: string): string {
  return `${normalizeSampleCode(sample)}|${getCanonicalId(targetId)}`;
}

/**
 * Builds the group-level requirement matrix. A group owns one target set;
 * every distinct sample receives every target in that set.
 */
export function buildSampleTargetPairs(
  samples: Iterable<string>,
  targetIds: Iterable<string>
): SampleTargetPair[] {
  const uniqueSamples = new Map<string, string>();
  for (const rawSample of samples) {
    const sample = String(rawSample || '').trim();
    const key = normalizeSampleCode(sample);
    if (key && !uniqueSamples.has(key)) uniqueSamples.set(key, sample);
  }

  const uniqueTargets = new Map<string, string>();
  for (const rawTargetId of targetIds) {
    const targetId = getCanonicalId(String(rawTargetId || ''));
    if (targetId && !uniqueTargets.has(targetId)) uniqueTargets.set(targetId, targetId);
  }

  const pairs: SampleTargetPair[] = [];
  uniqueSamples.forEach(sample => {
    uniqueTargets.forEach(targetId => pairs.push({ sample, targetId }));
  });
  return pairs;
}

export function getSopTargetKey(target: SopTarget): string {
  return getCanonicalId(target.name || target.id);
}

export function sopCoversTarget(sop: Sop, targetId: string): boolean {
  const canonicalTarget = getCanonicalId(targetId);
  return Boolean(sop.targets?.some(target => getSopTargetKey(target) === canonicalTarget));
}

export function isSopMatrixCompatible(sop: Sop, matrixType?: string): boolean {
  const matrixTags = sop.matrixTags || [];
  return matrixTags.length === 0 || !matrixType || matrixTags.includes(matrixType);
}

/**
 * Step 1 is the authoritative place for SOP distribution. A forced SOP is
 * valid only when it is active, matrix-compatible and covers the complete
 * target set selected for the group/sample.
 */
export function getForcedSopAssignmentIssue(
  sop: Sop | undefined,
  targetIds: Iterable<string>,
  matrixType?: string
): string | null {
  if (!sop) return 'SOP chỉ định không còn hoạt động hoặc không tồn tại.';
  if (!isSopMatrixCompatible(sop, matrixType)) {
    return `SOP “${sop.name}” không tương thích với nền mẫu đã chọn.`;
  }

  const missingTargets = Array.from(new Set(Array.from(targetIds)
    .map(targetId => getCanonicalId(String(targetId || '')))
    .filter(Boolean)))
    .filter(targetId => !sopCoversTarget(sop, targetId));

  if (missingTargets.length > 0) {
    return `SOP “${sop.name}” chưa phủ đủ ${missingTargets.length} chỉ tiêu của nhóm.`;
  }
  return null;
}

export function validateCalculatedItems(
  items: CalculatedItem[],
  safetyMargin: number
): BatchPlanValidationIssue[] {
  const issues: BatchPlanValidationIssue[] = [];

  if (!Number.isFinite(safetyMargin) || (safetyMargin !== -1 && (safetyMargin < 0 || safetyMargin > 100))) {
    issues.push({
      code: 'INVALID_MARGIN',
      message: 'Hao hụt phải ở chế độ Tự động hoặc nằm trong khoảng 0–100%.'
    });
  }

  for (const item of items) {
    const itemName = item.displayName || item.name;
    if (item.validationError) {
      issues.push({
        code: 'FORMULA_ERROR',
        message: `${itemName}: ${item.validationError}.`,
        itemName
      });
    }

    if (item.displayWarning?.includes('Khác ĐV')) {
      issues.push({
        code: 'UNIT_MISMATCH',
        message: `${itemName}: đơn vị SOP không tương thích với đơn vị tồn kho.`,
        itemName
      });
    }

    if (item.isComposite) {
      for (const sub of item.breakdown) {
        const subName = sub.displayName || sub.name;
        if (!Number.isFinite(sub.totalNeed) || sub.totalNeed < 0) {
          issues.push({
            code: 'INVALID_AMOUNT',
            message: `${subName}: lượng cần phải là số hữu hạn và không âm.`,
            itemName: subName
          });
        }
        if (sub.displayWarning?.includes('Khác ĐV')) {
          issues.push({
            code: 'UNIT_MISMATCH',
            message: `${subName}: đơn vị thành phần không tương thích với đơn vị tồn kho.`,
            itemName: subName
          });
        }
      }
    } else if (!Number.isFinite(item.stockNeed) || item.stockNeed < 0) {
      issues.push({
        code: 'INVALID_AMOUNT',
        message: `${itemName}: lượng cần phải là số hữu hạn và không âm.`,
        itemName
      });
    }
  }

  return deduplicateIssues(issues);
}

export function countUnavailableStockItems(
  items: CalculatedItem[],
  stockLedger: Record<string, number>
): number {
  let count = 0;
  for (const item of items) {
    if (item.isComposite) {
      for (const sub of item.breakdown) {
        const available = stockLedger[sub.name] ?? 0;
        if (!Number.isFinite(sub.totalNeed) || sub.totalNeed < 0 || available < sub.totalNeed) count++;
      }
    } else {
      const available = stockLedger[item.name] ?? 0;
      if (!Number.isFinite(item.stockNeed) || item.stockNeed < 0 || available < item.stockNeed) count++;
    }
  }
  return count;
}

export function applyNeedsToStockLedger(
  items: CalculatedItem[],
  stockLedger: Record<string, number>
): void {
  for (const item of items) {
    if (item.isComposite) {
      for (const sub of item.breakdown) {
        stockLedger[sub.name] = (stockLedger[sub.name] ?? 0) - sub.totalNeed;
      }
    } else {
      stockLedger[item.name] = (stockLedger[item.name] ?? 0) - item.stockNeed;
    }
  }
}

function deduplicateIssues(issues: BatchPlanValidationIssue[]): BatchPlanValidationIssue[] {
  const unique = new Map<string, BatchPlanValidationIssue>();
  for (const issue of issues) {
    const key = `${issue.code}|${issue.itemName || ''}|${issue.message}`;
    if (!unique.has(key)) unique.set(key, issue);
  }
  return Array.from(unique.values());
}
