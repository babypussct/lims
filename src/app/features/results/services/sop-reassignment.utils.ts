import { InventoryItem } from '../../../core/models/inventory.model';
import { Request, RequestItem } from '../../../core/models/request.model';
import { CalculatedItem, Sop } from '../../../core/models/sop.model';
import { getCanonicalId } from '../shared/compound-id-resolver';
import { getSopTargetKey, sopCoversTarget } from '../../batch/smart-batch.utils';

export interface SopReassignmentTargetMetadata {
  targetIds: string[];
  sampleTargetMap: Record<string, string[]>;
}

function stableStringify(value: unknown): string {
  const normalize = (current: unknown): unknown => {
    if (Array.isArray(current)) return current.map(item => item === undefined ? null : normalize(item));
    if (!current || typeof current !== 'object') return current;

    return Object.keys(current as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        const child = (current as Record<string, unknown>)[key];
        if (child !== undefined) result[key] = normalize(child);
        return result;
      }, {});
  };

  return JSON.stringify(normalize(value));
}

export function getSopReassignmentSourceSignature(
  request: Pick<Request, 'analysisDate' | 'sampleList' | 'sampleTargetMap' | 'items'>
): string {
  return stableStringify({
    analysisDate: request.analysisDate,
    sampleList: request.sampleList || [],
    sampleTargetMap: request.sampleTargetMap || {},
    items: request.items || []
  });
}

export function getRequiredTargetIds(request: Pick<Request, 'sampleTargetMap' | 'targetIds' | 'inputs'>): string[] {
  const inputTargetMap = (request.inputs?.['sampleTargetMap'] || {}) as Record<string, string[]>;
  const fromMap: string[] = Object.values(request.sampleTargetMap || inputTargetMap).flat();
  const source: string[] = fromMap.length > 0
    ? fromMap
    : (request.targetIds || request.inputs?.['targetIds'] || []);
  return Array.from(new Set(source.map(value => getCanonicalId(String(value || ''))).filter(Boolean))).sort();
}

export function getSopReassignmentBlockReason(request: Request): string | null {
  if (!['approved', 'draft'].includes(request.status)) {
    return request.status === 'completed'
      ? 'Mẻ đã hoàn thành, không thể chuyển SOP bằng nghiệp vụ này.'
      : 'Chỉ mẻ đã duyệt hoặc đang nhập nháp mới được chuyển SOP.';
  }
  if (request.isVirtualMaster || request.parentMasterId || (request.childRequestIds?.length || 0) > 0) {
    return 'Mẻ master/child không hỗ trợ chuyển SOP trực tiếp.';
  }
  const summary = request.analysisResultSummary;
  const legacy = request.analysisResult;
  const hasPublishedReport = Boolean(
    summary?.pdfUrl || summary?.pdfViewUrl || summary?.docsUrl || Object.keys(summary?.reports || {}).length
    || legacy?.pdfUrl || legacy?.pdfViewUrl || legacy?.docsUrl || Object.keys(legacy?.reports || {}).length
  );
  if (hasPublishedReport) return 'Mẻ đã có báo cáo được phát hành, không thể chuyển SOP bằng nghiệp vụ này.';
  return null;
}

export function getMissingTargetIds(request: Request, targetSop: Sop): string[] {
  return getRequiredTargetIds(request).filter(targetId => !sopCoversTarget(targetSop, targetId));
}

export function buildReassignmentTargetMetadata(request: Request, targetSop: Sop): SopReassignmentTargetMetadata {
  const required = new Set(getRequiredTargetIds(request));
  const targetIds = (targetSop.targets || [])
    .filter(target => required.has(getSopTargetKey(target)))
    .map(target => target.id);

  const sourceMap = (request.sampleTargetMap || request.inputs?.['sampleTargetMap'] || {}) as Record<string, string[]>;
  const sampleList = (request.sampleList || request.inputs?.['sampleList'] || []) as string[];
  const sampleTargetMap: Record<string, string[]> = {};
  sampleList.forEach((sample: string) => {
    const assigned = sourceMap[sample] || [];
    const canonical = Array.from(new Set((assigned.length ? assigned : Array.from(required))
      .map((value: string) => getCanonicalId(String(value || '')))
      .filter((value: string) => required.has(value))));
    sampleTargetMap[sample] = canonical;
  });

  return { targetIds, sampleTargetMap };
}

export function buildReassignmentInputs(request: Request, targetSop: Sop): Record<string, any> {
  const oldInputs = request.inputs || {};
  const inputs: Record<string, any> = {};
  (targetSop.inputs || []).forEach(input => {
    inputs[input.var] = oldInputs[input.var] !== undefined ? oldInputs[input.var] : input.default;
  });

  const targets = buildReassignmentTargetMetadata(request, targetSop);
  const sampleList = [...(request.sampleList || oldInputs['sampleList'] || [])];
  inputs['analysisDate'] = request.analysisDate || oldInputs['analysisDate'];
  inputs['n_sample'] = sampleList.length;
  inputs['safetyMargin'] = Number(oldInputs['safetyMargin'] ?? request.margin ?? -1);
  inputs['sampleList'] = sampleList;
  inputs['targetIds'] = targets.targetIds;
  inputs['sampleTargetMap'] = targets.sampleTargetMap;
  if (request.sampleDescriptionMap || oldInputs['sampleDescriptionMap']) {
    inputs['sampleDescriptionMap'] = request.sampleDescriptionMap || oldInputs['sampleDescriptionMap'];
  }
  if (oldInputs['explicitGroupId']) inputs['explicitGroupId'] = oldInputs['explicitGroupId'];
  if (targetSop.device) inputs['device'] = targetSop.device;
  return inputs;
}

export function calculatedItemsToRequestItems(
  calculatedItems: CalculatedItem[],
  inventoryMap: Record<string, InventoryItem>
): RequestItem[] {
  const result: RequestItem[] = [];
  calculatedItems.forEach(item => {
    if (item.isComposite) {
      item.breakdown.forEach(sub => result.push({
        name: sub.name,
        displayName: inventoryMap[sub.name]?.name || sub.displayName || sub.name,
        amount: sub.totalNeed,
        displayAmount: sub.displayAmount,
        baseAmount: sub.baseAmount,
        unit: sub.unit,
        stockUnit: sub.stockUnit
      }));
      return;
    }
    result.push({
      name: item.name,
      displayName: inventoryMap[item.name]?.name || item.displayName || item.name,
      amount: item.stockNeed,
      displayAmount: item.totalQty,
      baseAmount: item.baseAmount,
      unit: item.unit,
      stockUnit: item.stockUnit
    });
  });
  return result;
}

export function calculateInventoryDelta(
  oldItems: readonly RequestItem[],
  newItems: readonly RequestItem[]
): Record<string, number> {
  const delta: Record<string, number> = {};
  oldItems.forEach(item => delta[item.name] = (delta[item.name] || 0) + Number(item.amount || 0));
  newItems.forEach(item => delta[item.name] = (delta[item.name] || 0) - Number(item.amount || 0));
  Object.keys(delta).forEach(key => {
    delta[key] = Math.round(delta[key] * 1_000_000) / 1_000_000;
    if (delta[key] === 0) delete delta[key];
  });
  return delta;
}

export function transferSopStatsForDay(
  monthly: Record<string, any>,
  dayKey: string,
  fromSopKey: string,
  toSopKey: string,
  samples: number,
  batches: number,
  qcs: number
): Record<string, any> {
  const next = JSON.parse(JSON.stringify(monthly || {}));
  const day = next[dayKey];
  if (!day || fromSopKey === toSopKey) return next;
  day.sops ||= {};
  const from = day.sops[fromSopKey] || { samples: 0, batches: 0, qcs: 0 };
  from.samples = Math.max(0, Number(from.samples || 0) - samples);
  from.batches = Math.max(0, Number(from.batches || 0) - batches);
  from.qcs = Math.max(0, Number(from.qcs || 0) - qcs);
  if (from.samples === 0 && from.batches === 0 && from.qcs === 0) delete day.sops[fromSopKey];
  else day.sops[fromSopKey] = from;

  const to = day.sops[toSopKey] || { samples: 0, batches: 0, qcs: 0 };
  to.samples = Number(to.samples || 0) + samples;
  to.batches = Number(to.batches || 0) + batches;
  to.qcs = Number(to.qcs || 0) + qcs;
  day.sops[toSopKey] = to;
  return next;
}
