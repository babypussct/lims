import { InventoryItem } from '../../../core/models/inventory.model';
import { Request, RequestItem } from '../../../core/models/request.model';
import { CalculatedItem, Sop } from '../../../core/models/sop.model';
import { getAssignedTargetsForSample, getCanonicalId, normalizeSampleCode } from '../shared/compound-id-resolver';
import { getSopTargetKey, sopCoversTarget } from '../../batch/smart-batch.utils';
import { ANGULAR_SOP_CONFIG, resolveConfigKey } from '../config/sop-configs';

export interface SopReassignmentTargetMetadata {
  targetIds: string[];
  sampleTargetMap: Record<string, string[]>;
}

export interface SopReassignmentOption {
  sop: Sop;
  blockReason: string | null;
}

type ReassignmentTargetSource = Pick<Request, 'sampleTargetMap' | 'targetIds' | 'targetNames' | 'inputs'>;

function getReassignmentSampleTargetMap(request: ReassignmentTargetSource): Record<string, string[]> {
  const topLevel = request.sampleTargetMap || {};
  return Object.values(topLevel).some(targetIds => targetIds.length > 0)
    ? topLevel
    : request.inputs?.['sampleTargetMap'] || topLevel;
}

function getReassignmentSampleTargets(sample: string, map: Record<string, string[]>): string[] {
  const direct = Object.entries(map).find(([key]) => normalizeSampleCode(key) === normalizeSampleCode(sample))?.[1];
  return direct?.length ? direct : getAssignedTargetsForSample(sample, map) || [];
}

function buildReassignmentTargetResolver(request: ReassignmentTargetSource, sourceSop?: Sop) {
  const aliases = new Map<string, string>();
  const addAlias = (id: string, name: string) => {
    const canonical = getCanonicalId(name || id);
    if (canonical) aliases.set(getCanonicalId(id), canonical);
  };
  (sourceSop?.targets || []).forEach(target => addAlias(target.id, target.name));
  // The saved names describe the source batch even when the current SOP has changed.
  Object.entries(request.targetNames || {}).forEach(([id, name]) => addAlias(id, name));
  return (value: string): string => {
    const canonical = getCanonicalId(String(value || ''));
    return aliases.get(canonical) || canonical;
  };
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
  request: Pick<Request, 'analysisDate' | 'sampleList' | 'sampleTargetMap' | 'targetIds' | 'targetNames' | 'inputs' | 'items' | 'margin'>
): string {
  return stableStringify({
    analysisDate: request.analysisDate,
    sampleList: request.sampleList || [],
    sampleTargetMap: request.sampleTargetMap || {},
    targetIds: request.targetIds || [],
    targetNames: request.targetNames || {},
    inputs: request.inputs || {},
    margin: request.margin,
    items: request.items || []
  });
}

export function getRequiredTargetIds(request: ReassignmentTargetSource, sourceSop?: Sop): string[] {
  const fromMap = Object.values(getReassignmentSampleTargetMap(request)).flat();
  const source: string[] = fromMap.length > 0
    ? fromMap
    : (request.targetIds?.length ? request.targetIds : request.inputs?.['targetIds'] || []);
  const resolveTarget = buildReassignmentTargetResolver(request, sourceSop);
  return Array.from(new Set(source.map(resolveTarget).filter(Boolean))).sort();
}

export function getSopReassignmentBlockReason(request: Request): string | null {
  if (request._isDeleted) return 'Mẻ đã bị xóa, không thể chuyển SOP.';
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

export function getReassignmentSamples(request: Request): string[] {
  return [...(request.sampleList || request.inputs?.['sampleList'] || [])];
}

/** Move whole sample assignments, preserving the order and spelling of the source batch. */
export function partitionSopReassignment(request: Request, selectedSamples?: readonly string[]): {
  moving: Request; remaining: Request | null;
} {
  const samples = getReassignmentSamples(request);
  if (!samples.length) throw new Error('Mẻ không có mã mẫu để chuyển SOP.');
  const known = new Set(samples.map(normalizeSampleCode));
  if (known.size !== samples.length) throw new Error('Mẻ có mã mẫu trùng nhau. Vui lòng kiểm tra danh sách mẫu.');
  const selected = new Set((selectedSamples ?? samples).map(normalizeSampleCode));
  if (!selected.size) throw new Error('Chọn ít nhất một mã mẫu cần chuyển SOP.');
  if ([...selected].some(sample => !known.has(sample))) throw new Error('Mã mẫu được chọn không còn thuộc mẻ này.');
  const subset = (list: string[]): Request => {
    const codes = new Set(list.map(normalizeSampleCode));
    const memberCodes = new Set(list.flatMap(sample => sample.split(';').map(normalizeSampleCode)));
    const filterMap = <T>(map: Record<string, T>): Record<string, T> => Object.fromEntries(
      Object.entries(map).filter(([key]) => codes.has(normalizeSampleCode(key)) || memberCodes.has(normalizeSampleCode(key)))
    );
    const oldMap = getReassignmentSampleTargetMap(request);
    const fallback = request.targetIds?.length ? request.targetIds : request.inputs?.['targetIds'] || [];
    const sampleTargetMap: Record<string, string[]> = {};
    list.forEach(sample => {
      const assigned = getReassignmentSampleTargets(sample, oldMap);
      sampleTargetMap[sample] = assigned.length ? assigned : fallback;
    });
    const targetIds = [...new Set(Object.values(sampleTargetMap).flat())];
    const sampleDescriptionMap = filterMap<NonNullable<Request['sampleDescriptionMap']>[string]>(request.sampleDescriptionMap || request.inputs?.['sampleDescriptionMap'] || {});
    return {
      ...request, sampleList: list, sampleTargetMap, targetIds, sampleDescriptionMap,
      inputs: { ...request.inputs, n_sample: list.length, sampleList: list, sampleTargetMap, targetIds, sampleDescriptionMap }
    };
  };
  const moving = samples.filter(sample => selected.has(normalizeSampleCode(sample)));
  const remaining = samples.filter(sample => !selected.has(normalizeSampleCode(sample)));
  return { moving: subset(moving), remaining: remaining.length ? subset(remaining) : null };
}

/** Keep source results and QC rows; never carry SOP-A results into the new SOP form. */
export function retainSopSplitResults<T extends { resultData?: Record<string, any> }>(
  draft: T, movedSamples: readonly string[]
): T {
  const moved = new Set(movedSamples.flatMap(sample => sample.split(';').map(normalizeSampleCode)));
  return { ...draft, resultData: Object.fromEntries(Object.entries(draft.resultData || {}).filter(([key]) => {
    const members = key.split(';').map(normalizeSampleCode);
    const movedMembers = members.filter(member => moved.has(member));
    if (movedMembers.length && movedMembers.length !== members.length) {
      throw new Error(`Kết quả mẫu gộp “${key}” cần được tách trước khi chuyển SOP.`);
    }
    return movedMembers.length === 0;
  })) };
}

export function splitSopStatsForDay(
  monthly: Record<string, any>, dayKey: string, fromSopKey: string, toSopKey: string,
  movedCount: number, newQcs: number
): Record<string, any> {
  const next = transferSopStatsForDay(monthly, dayKey, fromSopKey, toSopKey, movedCount, 0, 0);
  const day = next[dayKey];
  if (!day) return next;
  day.totalBatches = Number(day.totalBatches || 0) + 1;
  day.totalQcs = Number(day.totalQcs || 0) + newQcs;
  day.sops[toSopKey] ||= { samples: 0, batches: 0, qcs: 0 };
  day.sops[toSopKey].batches += 1;
  day.sops[toSopKey].qcs += newQcs;
  return next;
}

export function getMissingTargetIds(request: Request, targetSop: Sop, sourceSop?: Sop): string[] {
  return getRequiredTargetIds(request, sourceSop).filter(targetId => !sopCoversTarget(targetSop, targetId));
}

export function getSopReassignmentTargetBlockReason(request: Request, targetSop: Sop, sourceSop?: Sop): string | null {
  if (targetSop.isArchived) return 'SOP đã ngừng sử dụng.';
  if (targetSop.id === request.sopId) return 'SOP đích phải khác SOP hiện tại.';
  const configKey = resolveConfigKey(targetSop.id, targetSop.name, targetSop);
  if (!configKey || !ANGULAR_SOP_CONFIG[configKey]) return 'SOP chưa có biểu mẫu nhập kết quả tương ứng.';
  const missingTargets = getMissingTargetIds(request, targetSop, sourceSop);
  if (!missingTargets.length) return null;
  const names = new Map<string, string>();
  (sourceSop?.targets || []).forEach(target => names.set(getSopTargetKey(target), target.name));
  Object.entries(request.targetNames || {}).forEach(([id, name]) => names.set(getCanonicalId(name || id), name || id));
  const missingNames = missingTargets.slice(0, 5).map(id => names.get(id) || id).join(', ');
  const remaining = missingTargets.length > 5 ? ` và ${missingTargets.length - 5} chỉ tiêu khác` : '';
  return `SOP chưa phủ đủ ${missingTargets.length} chỉ tiêu của mẻ: ${missingNames}${remaining}.`;
}

export function getSopReassignmentOptions(request: Request, sops: readonly Sop[]): SopReassignmentOption[] {
  if (getSopReassignmentBlockReason(request)) return [];
  const sourceSop = sops.find(sop => sop.id === request.sopId);
  return sops.filter(sop => sop.id !== request.sopId && !sop.isArchived).map(sop => ({
    sop,
    blockReason: getSopReassignmentTargetBlockReason(request, sop, sourceSop)
  }));
}

export function buildReassignmentTargetMetadata(request: Request, targetSop: Sop, sourceSop?: Sop): SopReassignmentTargetMetadata {
  const required = new Set(getRequiredTargetIds(request, sourceSop));
  const targetIds = (targetSop.targets || [])
    .filter(target => required.has(getSopTargetKey(target)))
    .map(target => target.id);

  const sourceMap = getReassignmentSampleTargetMap(request);
  const resolveTarget = buildReassignmentTargetResolver(request, sourceSop);
  const sampleList = (request.sampleList || request.inputs?.['sampleList'] || []) as string[];
  const sampleTargetMap: Record<string, string[]> = {};
  sampleList.forEach((sample: string) => {
    const assigned = getReassignmentSampleTargets(sample, sourceMap);
    const canonical = Array.from(new Set((assigned.length ? assigned : Array.from(required))
      .map(resolveTarget)
      .filter((value: string) => required.has(value))));
    sampleTargetMap[sample] = canonical;
  });

  return { targetIds, sampleTargetMap };
}

export function buildReassignmentInputs(request: Request, targetSop: Sop, sourceSop?: Sop): Record<string, any> {
  const oldInputs = request.inputs || {};
  const inputs: Record<string, any> = {};
  (targetSop.inputs || []).forEach(input => {
    inputs[input.var] = oldInputs[input.var] !== undefined ? oldInputs[input.var] : input.default;
  });

  const targets = buildReassignmentTargetMetadata(request, targetSop, sourceSop);
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
