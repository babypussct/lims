import { ANGULAR_SOP_CONFIG, resolveConfigKey } from '../config/sop-configs';
import {
  canUserEditResults,
  isRunActivelyLockedByOthers,
  ResultEditCapability,
} from './result-write-guard';

export interface DuplicateSampleCandidate {
  runId: string;
  batchCode: string;
  status: string;
}

export interface MergeRunsValidation {
  canMerge: boolean;
  canOpenModal: boolean;
  blockers: string[];
  warnings: string[];
  mergedSamples: string[];
  duplicateSamples: string[];
  unresolvedDuplicateSamples: string[];
  duplicateSourceCandidates: Record<string, DuplicateSampleCandidate[]>;
  configKey: string | null;
  sopName: string;
}

export function isRunCandidateCompatibleForMerge(
  baseRun: any,
  candidateRun: any,
  sops: readonly any[] = []
): { compatible: boolean; reason?: string } {
  if (!baseRun || !candidateRun) return { compatible: false, reason: 'Thiếu dữ liệu mẻ' };
  if (candidateRun.id === baseRun.id) return { compatible: true };

  if (candidateRun.sopId !== baseRun.sopId) {
    return { compatible: false, reason: 'Khác SOP' };
  }

  const baseSop = sops.find(s => s.id === baseRun.sopId) || null;
  const candSop = sops.find(s => s.id === candidateRun.sopId) || null;
  const baseKey = resolveConfigKey(baseRun.sopId, baseRun.sopName || '', baseSop);
  const candKey = resolveConfigKey(candidateRun.sopId, candidateRun.sopName || '', candSop);

  if (baseKey !== candKey) {
    return { compatible: false, reason: 'Khác cấu hình biểu mẫu' };
  }

  const baseUnit = baseRun.inputs?.['unit'] || baseSop?.unit || '';
  const candUnit = candidateRun.inputs?.['unit'] || candSop?.unit || '';
  if (baseUnit && candUnit && baseUnit !== candUnit) {
    return { compatible: false, reason: 'Khác đơn vị kết quả' };
  }

  return { compatible: true };
}

export function validateMergeRuns(args: {
  selectedRuns: readonly any[];
  capability: ResultEditCapability;
  userEmail?: string | null;
  sops?: readonly any[];
  duplicateSampleSources?: Record<string, string>;
  nowMs?: number;
}): MergeRunsValidation {
  const {
    selectedRuns,
    capability,
    userEmail,
    sops = [],
    duplicateSampleSources = {},
    nowMs = Date.now(),
  } = args;
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!canUserEditResults(capability)) {
    blockers.push('Bạn không có quyền tạo mẻ tổng hợp.');
  }

  if (selectedRuns.length < 2) {
    blockers.push('Cần chọn ít nhất 2 mẻ chạy để gộp.');
  }

  const first = selectedRuns[0];
  const sopObj = first ? (sops.find(s => s.id === first.sopId) || null) : null;
  const configKey = first ? resolveConfigKey(first.sopId, first.sopName || '', sopObj) : null;
  const sopConfig = configKey ? ANGULAR_SOP_CONFIG[configKey] : null;
  if (first && !sopConfig) {
    warnings.push('Không xác định được cấu hình SOP chuẩn; hệ thống sẽ áp dụng biểu mẫu mặc định.');
  }

  const sampleCandidates = new Map<string, DuplicateSampleCandidate[]>();
  const sampleOrder: string[] = [];

  for (const run of selectedRuns) {
    if (first) {
      const compat = isRunCandidateCompatibleForMerge(first, run, sops);
      if (!compat.compatible) {
        blockers.push(`Mẻ ${run.inputs?.['batchCode'] || run.id} không tương thích: ${compat.reason}.`);
      }
    }

    if (run.isVirtualMaster) {
      blockers.push(`Mẻ ${run.inputs?.['batchCode'] || run.id} đã là mẻ tổng hợp, không thể gộp lồng.`);
    }

    if (run.parentMasterId) {
      blockers.push(`Mẻ ${run.inputs?.['batchCode'] || run.id} đã được gộp vào mẻ ${run.parentMasterId}.`);
    }

    if (isRunActivelyLockedByOthers(run, userEmail, nowMs)) {
      blockers.push(`Mẻ ${run.inputs?.['batchCode'] || run.id} đang bị khóa sửa bởi ${run.lockedByName || run.lockedBy}.`);
    }

    if (run.status === 'completed') {
      warnings.push(`Mẻ ${run.inputs?.['batchCode'] || run.id} đã hoàn thành; hãy kiểm tra kỹ trước khi gộp.`);
    }

    const list: string[] = Array.isArray(run.sampleList) ? run.sampleList : [];
    const seenInRun = new Set<string>();
    const candidate: DuplicateSampleCandidate = {
      runId: run.id,
      batchCode: run.inputs?.['batchCode'] || run.id,
      status: run.status || 'approved',
    };
    for (const s of list) {
      if (seenInRun.has(s)) continue;
      seenInRun.add(s);
      if (!sampleCandidates.has(s)) {
        sampleOrder.push(s);
        sampleCandidates.set(s, []);
      }
      sampleCandidates.get(s)!.push(candidate);
    }
  }

  const duplicateSamples = Array.from(sampleCandidates.entries())
    .filter(([, candidates]) => candidates.length > 1)
    .map(([sample]) => sample);

  const duplicateSourceCandidates: Record<string, DuplicateSampleCandidate[]> = {};
  const unresolvedDuplicateSamples: string[] = [];
  for (const sample of duplicateSamples) {
    const candidates = sampleCandidates.get(sample) || [];
    duplicateSourceCandidates[sample] = candidates;
    const chosenRunId = duplicateSampleSources[sample];
    if (!chosenRunId || !candidates.some(c => c.runId === chosenRunId)) {
      unresolvedDuplicateSamples.push(sample);
    }
  }

  const mergedSamples = [...sampleOrder].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  if (mergedSamples.length === 0 && selectedRuns.length >= 2) {
    blockers.push('Các mẻ đã chọn không có mẫu nào để gộp.');
  }

  const canOpenModal = blockers.length === 0;

  if (unresolvedDuplicateSamples.length > 0) {
    blockers.push(
      `Có ${unresolvedDuplicateSamples.length} mã mẫu trùng nhau giữa các mẻ (${unresolvedDuplicateSamples.slice(0, 6).join(', ')}${unresolvedDuplicateSamples.length > 6 ? '...' : ''}): vui lòng chọn mẻ nguồn kết quả cho từng mẫu để bảo toàn truy xuất nguồn gốc.`
    );
  } else if (duplicateSamples.length > 0) {
    warnings.push(
      `Đã chỉ định nguồn kết quả riêng cho ${duplicateSamples.length} mã mẫu trùng (${duplicateSamples.slice(0, 6).join(', ')}${duplicateSamples.length > 6 ? '...' : ''}).`
    );
  }

  return {
    canMerge: blockers.length === 0,
    canOpenModal,
    blockers,
    warnings,
    mergedSamples,
    duplicateSamples,
    unresolvedDuplicateSamples,
    duplicateSourceCandidates,
    configKey,
    sopName: first?.sopName || '',
  };
}
