import { CalculatedItem, Sop, SopTarget } from '../../core/models/sop.model';
import { getCanonicalId, normalizeSampleCode } from '../results/shared/compound-id-resolver';

export interface BatchPlanValidationIssue {
  code: 'FORMULA_ERROR' | 'INVALID_AMOUNT' | 'UNIT_MISMATCH' | 'INVALID_MARGIN';
  message: string;
  itemName?: string;
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
