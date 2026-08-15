import {
  ReferenceStandard,
  StandardInternalIdApplySummary,
  StandardInternalIdSyncChange,
  StandardInternalIdSyncReport,
} from '../../core/models/standard.model';

/** The laboratory's only business identifier for a reference standard. */
// The form accepts lower-case input and normalizes it before persistence.
// Validation therefore remains case-insensitive while the stored code is
// always canonical upper-case.
export const STANDARD_INTERNAL_ID_PATTERN = /^(?:[ABC][A-Z0-9]{3}|SDHET)$/iu;
export const STANDARD_INTERNAL_ID_LENGTH = 4;
/** A legacy business operation uses this code outside the reusable A/B/C sequence. */
export const SPECIAL_INTERNAL_ID = 'SDHET';
export const STANDARD_INTERNAL_ID_RULE_DESCRIPTION =
  '4 ký tự bắt đầu bằng A, B hoặc C; riêng mã nghiệp vụ SDHET được chấp nhận.';

export type StandardInternalIdAssessmentKind = 'VALID' | 'NORMALIZABLE' | 'MISSING' | 'INVALID_FORMAT';

export interface StandardInternalIdAssessment {
  raw: string;
  normalized: string;
  kind: StandardInternalIdAssessmentKind;
  reason: string;
}

export interface CorrectionValidationResult {
  level: 'empty' | 'valid' | 'invalid_format' | 'duplicate_in_batch' | 'conflict_existing_owner';
  message: string;
  valid: boolean;
}

export function normalizeInternalId(value: unknown): string {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toUpperCase();
}

export function isValidInternalId(value: unknown): value is string {
  const normalized = normalizeInternalId(value);
  return normalized === SPECIAL_INTERNAL_ID || STANDARD_INTERNAL_ID_PATTERN.test(normalized);
}

export function assessInternalId(value: unknown): StandardInternalIdAssessment {
  const raw = String(value ?? '');
  const normalized = normalizeInternalId(value);
  if (!normalized) {
    return { raw, normalized, kind: 'MISSING', reason: 'Chưa có Mã quản lý nội bộ.' };
  }
  if (normalized === SPECIAL_INTERNAL_ID) {
    return {
      raw,
      normalized,
      kind: raw === normalized ? 'VALID' : 'NORMALIZABLE',
      reason: 'Mã nghiệp vụ riêng SDHET; không áp dụng quy tắc chuỗi mã 4 ký tự.'
    };
  }
  if (STANDARD_INTERNAL_ID_PATTERN.test(normalized)) {
    return {
      raw,
      normalized,
      kind: raw === normalized ? 'VALID' : 'NORMALIZABLE',
      reason: raw === normalized
        ? 'Mã hợp lệ.'
        : 'Có thể chuẩn hóa khoảng trắng/chữ hoa mà không đổi ý nghĩa mã.'
    };
  }

  return {
    raw,
    normalized,
    kind: 'INVALID_FORMAT',
    reason: `Mã phải có đúng ${STANDARD_INTERNAL_ID_LENGTH} ký tự, bắt đầu bằng A, B hoặc C; hoặc là mã nghiệp vụ riêng SDHET.`
  };
}

/**
 * A released/closed physical record remains in history but must never be a
 * borrow candidate. Legacy rows without lifecycle_status remain operational
 * until the manager explicitly releases them.
 */
export function isCurrentStandardLifecycle(standard: ReferenceStandard | null | undefined): boolean {
  if (!standard || standard._isDeleted || standard.status === 'DELETED') return false;
  return standard.lifecycle_status !== 'RELEASED' && standard.lifecycle_status !== 'CLOSED';
}

export function isReleasedStandardLifecycle(standard: ReferenceStandard | null | undefined): boolean {
  return standard?.lifecycle_status === 'RELEASED' || standard?.lifecycle_status === 'CLOSED';
}

export function normalizeInternalIdKey(value: unknown): string {
  return normalizeInternalId(value);
}

export function countTargetCodes(corrections: Record<string, string>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const raw of Object.values(corrections)) {
    const code = normalizeInternalId(raw).trim();
    if (code) counts.set(code, (counts.get(code) || 0) + 1);
  }
  return counts;
}

export function validateInternalIdCorrections(
  corrections: Record<string, string>,
  report: StandardInternalIdSyncReport | null | undefined,
): Map<string, CorrectionValidationResult> {
  const map = new Map<string, CorrectionValidationResult>();
  const entries = Object.entries(corrections);
  const counts = countTargetCodes(corrections);

  for (const [docId, raw] of entries) {
    const trimmed = String(raw || '').trim();
    if (!trimmed) {
      map.set(docId, { level: 'empty', message: '', valid: true });
      continue;
    }
    const normalized = normalizeInternalId(trimmed);
    if (!isValidInternalId(normalized)) {
      map.set(docId, {
        level: 'invalid_format',
        message: 'Mã không đúng định dạng (4 ký tự bắt đầu A/B/C hoặc SDHET).',
        valid: false,
      });
      continue;
    }
    if ((counts.get(normalized) || 0) > 1) {
      map.set(docId, {
        level: 'duplicate_in_batch',
        message: `Mã “${normalized}” bị nhập trùng cho nhiều hồ sơ trong cùng lần sửa này.`,
        valid: false,
      });
      continue;
    }
    if (report?.conflicts.some(c =>
      (c.kind === 'DUPLICATE_ACTIVE' || c.kind === 'REGISTRY_MISMATCH') &&
      normalizeInternalId(c.internalId) === normalized
    )) {
      map.set(docId, {
        level: 'conflict_existing_owner',
        message: `Mã “${normalized}” đang có xung đột quyền sở hữu trên hệ thống.`,
        valid: false,
      });
      continue;
    }
    map.set(docId, {
      level: 'valid',
      message: `Mã “${normalized}” hợp lệ và sẵn sàng đồng bộ.`,
      valid: true,
    });
  }
  return map;
}

export function calculateInternalIdApplySummary(
  report: StandardInternalIdSyncReport | null | undefined,
  corrections: Record<string, string>,
): StandardInternalIdApplySummary {
  const safe = report?.safeChanges || [];

  const validationMap = validateInternalIdCorrections(corrections, report);
  const validCorrections = Object.entries(corrections)
    .filter(([id, raw]) => String(raw || '').trim() && validationMap.get(id)?.valid);

  const manualIssuesMap = new Map(
    (report?.issues || [])
      .filter(i => i.collection === 'reference_standards')
      .map(i => [i.documentId, i])
  );

  const documentKeys = new Set<string>();
  const byCollection: Record<string, number> = {
    reference_standards: 0,
    standard_code_registry: 0,
    standard_requests: 0,
    purchase_requests: 0,
    standard_usages: 0,
    reference_standard_logs: 0,
  };

  let codeNormalization = 0;
  let searchKeyUpdate = 0;
  const manualCorrection = validCorrections.length;
  let registrySync = 0;
  let snapshotUpdate = 0;
  let referenceRepair = 0;

  for (const c of safe) {
    documentKeys.add(`${c.collection}/${c.documentId}`);
    byCollection[c.collection] = (byCollection[c.collection] || 0) + 1;

    if (c.collection === 'reference_standards' && c.field === 'internal_id') {
      codeNormalization += 1;
    } else if (c.collection === 'reference_standards' && c.field === 'search_key') {
      searchKeyUpdate += 1;
    } else if (c.collection === 'standard_code_registry') {
      registrySync += 1;
    } else if (c.field === 'standardId') {
      referenceRepair += 1;
    } else if (c.field === 'internalId' || c.field === 'usageLogs') {
      snapshotUpdate += 1;
    }
  }

  let totalManualFieldChanges = 0;
  const manualChanges: StandardInternalIdSyncChange[] = [];

  for (const [id, code] of validCorrections) {
    // 1. reference_standards document: internal_id + search_key
    documentKeys.add(`reference_standards/${id}`);
    byCollection['reference_standards'] = (byCollection['reference_standards'] || 0) + 2;
    searchKeyUpdate += 1;
    totalManualFieldChanges += 2;

    const normalized = normalizeInternalId(code);
    manualChanges.push({
      collection: 'reference_standards',
      documentId: id,
      field: 'internal_id',
      before: null,
      after: normalized,
      reason: 'Mã sửa thủ công sau khi người quản lý đối chiếu hồ sơ.',
    });
    manualChanges.push({
      collection: 'reference_standards',
      documentId: id,
      field: 'search_key',
      before: null,
      after: normalized,
      reason: 'Cập nhật khóa tìm kiếm theo mã sửa thủ công.',
    });

    // Check if standard is in current lifecycle
    const issue = manualIssuesMap.get(id);
    const isCurrent = issue?.isCurrentLifecycle !== false;

    if (isCurrent) {
      documentKeys.add(`standard_code_registry/${normalized}`);
      byCollection['standard_code_registry'] = (byCollection['standard_code_registry'] || 0) + 1;
      registrySync += 1;
      totalManualFieldChanges += 1; // __document__ in standard_code_registry

      manualChanges.push({
        collection: 'standard_code_registry',
        documentId: normalized,
        field: '__document__',
        before: null,
        after: {
          id: normalized,
          internal_id: normalized,
          status: 'ASSIGNED',
          currentStandardId: id,
        },
        reason: 'Đồng bộ ngân hàng mã sau khi sửa thủ công hồ sơ.',
      });
    }
  }

  const allPlannedChanges = [...safe, ...manualChanges];
  const batchPlan = planInternalIdBatches(allPlannedChanges, 249);

  const totalChanges = safe.length + totalManualFieldChanges;
  const totalDocuments = documentKeys.size;
  // Actual Firestore writes: all unique modified business documents + 1 audit batch write per batch chunk
  const actualWrites = totalDocuments > 0 ? totalDocuments + batchPlan.totalBatches : 0;
  const estimatedBatches = batchPlan.totalBatches;

  const physicalStandardsCount = new Set([
    ...safe.filter(c => c.collection === 'reference_standards').map(c => c.documentId),
    ...validCorrections.map(([id]) => id),
  ]).size;

  const registryCount = new Set([
    ...safe.filter(c => c.collection === 'standard_code_registry').map(c => c.documentId),
    ...validCorrections
      .filter(([id]) => manualIssuesMap.get(id)?.isCurrentLifecycle !== false)
      .map(([_, code]) => normalizeInternalId(code)),
  ]).size;

  const requestsCount = new Set(
    safe.filter(c => c.collection === 'standard_requests' || c.collection === 'purchase_requests').map(c => c.documentId)
  ).size;

  const usageCount = new Set(
    safe.filter(c => c.collection === 'standard_usages' || c.collection === 'reference_standard_logs').map(c => c.documentId)
  ).size;

  // Strict blocking count: only true blocking errors, excluding non-blocking historical snapshot warnings
  const blockingIssuesCount = report?.blockingIssues?.length
    ?? (report?.conflicts || []).filter(c => c.blocking || (!c.autoFixable && c.severity === 'ERROR')).length;

  return {
    totalChanges,
    totalDocuments,
    actualWrites,
    estimatedBatches,
    manualCount: validCorrections.length,
    safeCount: safe.length,
    physicalStandardsCount,
    registryCount,
    requestsCount,
    usageCount,
    blockingIssuesCount,
    byCollection,
    byChangeType: {
      codeNormalization,
      searchKeyUpdate,
      manualCorrection,
      registrySync,
      snapshotUpdate,
      referenceRepair,
    },
  };
}

export interface SyncBatchProgress {
  readonly currentBatch: number;
  readonly totalBatches: number;
  readonly completedChanges: number;
  readonly totalChanges: number;
  readonly percent: number;
  readonly phase:
    | 'PREPARING'
    | 'RE_SCANNING'
    | 'PREFLIGHT_CHECK'
    | 'COMMITTING_BATCH'
    | 'AUDITING'
    | 'BATCH_COMPLETED'
    | 'ALL_COMPLETED';
  readonly currentBatchId?: string;
  readonly currentBatchChangeCount?: number;
  readonly message?: string;
}

export class StandardSyncPartialFailureError extends Error {
  constructor(
    message: string,
    public readonly completedBatchIds: readonly string[],
    public readonly completedChangesCount: number,
    public readonly failedBatchIndex: number,
    public readonly totalBatches: number,
    public readonly underlyingError: unknown,
  ) {
    super(message);
    this.name = 'StandardSyncPartialFailureError';
  }
}

export interface InternalIdBatchChunkPlan {
  readonly batchIndex: number;
  readonly changes: readonly StandardInternalIdSyncChange[];
  readonly changeCount: number;
  readonly documentCount: number;
  readonly clusterCount: number;
}

export interface InternalIdBatchPlan {
  readonly chunks: readonly InternalIdBatchChunkPlan[];
  readonly totalBatches: number;
  readonly totalChanges: number;
  readonly totalDocuments: number;
  readonly maxChangesPerBatch: number;
}

/**
 * Groups interdependent standard and registry changes into atomic clusters
 * and plans sequential batches without splitting any cluster across batch boundaries.
 */
export function planInternalIdBatches(
  changes: readonly StandardInternalIdSyncChange[],
  maxChangesPerBatch = 249,
): InternalIdBatchPlan {
  if (maxChangesPerBatch < 1) {
    throw new Error('Giới hạn batch phải lớn hơn 0.');
  }
  if (!changes || changes.length === 0) {
    return {
      chunks: [],
      totalBatches: 0,
      totalChanges: 0,
      totalDocuments: 0,
      maxChangesPerBatch,
    };
  }

  // 1. Group changes by documentKey
  const docKeyOf = (c: StandardInternalIdSyncChange) => `${c.collection}/${c.documentId}`;
  const docMap = new Map<string, StandardInternalIdSyncChange[]>();
  for (const c of changes) {
    const key = docKeyOf(c);
    const list = docMap.get(key) || [];
    list.push(c);
    docMap.set(key, list);
  }

  // 2. Disjoint-set (Union-Find) to connect correlated standard and registry documents
  const parent = new Map<string, string>();
  const find = (key: string): string => {
    const p = parent.get(key) || key;
    if (p !== key) {
      const root = find(p);
      parent.set(key, root);
      return root;
    }
    return key;
  };
  const union = (keyA: string, keyB: string) => {
    const rootA = find(keyA);
    const rootB = find(keyB);
    if (rootA !== rootB) {
      parent.set(rootA, rootB);
    }
  };

  for (const docKey of docMap.keys()) {
    parent.set(docKey, docKey);
  }

  for (const [docKey, docChanges] of docMap.entries()) {
    for (const c of docChanges) {
      if (c.collection === 'reference_standards') {
        // Link to registry if target code is normalized and valid
        if (c.field === 'internal_id' && c.after) {
          const targetCode = normalizeInternalId(c.after);
          const registryKey = `standard_code_registry/${targetCode}`;
          if (isValidInternalId(targetCode) && docMap.has(registryKey)) {
            union(docKey, registryKey);
          }
        }
      } else if (c.collection === 'standard_code_registry') {
        // Link to standard if after or before references a standard ID
        const checkOwner = (payload: unknown) => {
          if (payload && typeof payload === 'object' && 'currentStandardId' in payload) {
            const stdId = String((payload as any).currentStandardId || '').trim();
            const stdKey = `reference_standards/${stdId}`;
            if (stdId && docMap.has(stdKey)) {
              union(docKey, stdKey);
            }
          }
        };
        checkOwner(c.after);
        checkOwner(c.before);
      }
    }
  }

  // 3. Assemble clusters
  const clusterMap = new Map<string, { changes: StandardInternalIdSyncChange[]; docKeys: Set<string> }>();
  for (const [docKey, docChanges] of docMap.entries()) {
    const root = find(docKey);
    const cluster = clusterMap.get(root) || { changes: [], docKeys: new Set<string>() };
    cluster.changes.push(...docChanges);
    cluster.docKeys.add(docKey);
    clusterMap.set(root, cluster);
  }

  // Sort clusters deterministically for stable planning
  const clusters = [...clusterMap.entries()]
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([, cluster]) => cluster);

  // 4. Pack clusters into batch chunks
  const rawChunks: { changes: StandardInternalIdSyncChange[]; documentCount: number; clusterCount: number }[] = [];
  let currentChunk: StandardInternalIdSyncChange[] = [];
  let currentDocs = new Set<string>();
  let currentClusterCount = 0;

  for (const cluster of clusters) {
    if (cluster.changes.length > maxChangesPerBatch) {
      const firstDoc = cluster.changes[0] ? docKeyOf(cluster.changes[0]) : 'không rõ';
      throw new Error(
        `Cụm thay đổi phụ thuộc của tài liệu ${firstDoc} có ${cluster.changes.length} thay đổi, vượt giới hạn an toàn ${maxChangesPerBatch}.`
      );
    }

    if (currentChunk.length > 0 && currentChunk.length + cluster.changes.length > maxChangesPerBatch) {
      rawChunks.push({
        changes: currentChunk,
        documentCount: currentDocs.size,
        clusterCount: currentClusterCount,
      });
      currentChunk = [];
      currentDocs = new Set<string>();
      currentClusterCount = 0;
    }

    currentChunk.push(...cluster.changes);
    for (const dk of cluster.docKeys) currentDocs.add(dk);
    currentClusterCount += 1;
  }

  if (currentChunk.length > 0) {
    rawChunks.push({
      changes: currentChunk,
      documentCount: currentDocs.size,
      clusterCount: currentClusterCount,
    });
  }

  const chunks: InternalIdBatchChunkPlan[] = rawChunks.map((chunk, index) => ({
    batchIndex: index + 1,
    changes: chunk.changes,
    changeCount: chunk.changes.length,
    documentCount: chunk.documentCount,
    clusterCount: chunk.clusterCount,
  }));

  const totalDocuments = docMap.size;
  return {
    chunks,
    totalBatches: chunks.length,
    totalChanges: changes.length,
    totalDocuments,
    maxChangesPerBatch,
  };
}

export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  let str: string;
  if (typeof value === 'object') {
    str = JSON.stringify(value);
  } else {
    str = String(value);
  }
  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportReportJson(
  report: StandardInternalIdSyncReport,
  applySummary?: StandardInternalIdApplySummary,
): string {
  const payload = {
    scanId: report.scanId || `scan-${new Date(report.generatedAt).toISOString().replace(/[:.]/g, '-')}`,
    generatedAt: report.generatedAt,
    generatedAtFormatted: new Date(report.generatedAt).toISOString(),
    metrics: {
      standardsCount: report.standardsCount,
      requestsCount: report.requestsCount,
      purchaseRequestsCount: report.purchaseRequestsCount || 0,
      usageCount: report.usageCount,
      nestedUsageCount: report.nestedUsageCount || 0,
      registryCount: report.registryCount,
    },
    summary: report.summary || null,
    applySummary: applySummary || null,
    blockingIssuesCount: report.blockingIssues?.length
      ?? report.conflicts.filter(c => c.blocking || (!c.autoFixable && c.severity === 'ERROR')).length,
    issues: report.issues || [],
    safeChanges: report.safeChanges || [],
    conflicts: report.conflicts || [],
    blockingIssues: report.blockingIssues || [],
  };
  return JSON.stringify(payload, null, 2);
}

export function exportReportCsv(
  report: StandardInternalIdSyncReport,
  applySummary?: StandardInternalIdApplySummary,
): string {
  const headers = [
    'category',
    'collection',
    'documentId',
    'field',
    'kind',
    'severity',
    'blocking',
    'standardId',
    'parentStandardId',
    'referencedStandardId',
    'internalId',
    'suggestedInternalId',
    'before',
    'after',
    'message',
    'detail',
    'suggestion',
    'reason',
  ];

  const rows: string[][] = [];

  // 1. Issues
  for (const issue of report.issues || []) {
    rows.push([
      'ISSUE',
      issue.collection || '',
      issue.documentId || '',
      '',
      issue.kind || '',
      issue.severity || '',
      String(issue.blocking ?? false),
      issue.standardId || '',
      issue.parentStandardId || '',
      issue.referencedStandardId || '',
      issue.internalId || '',
      issue.suggestedInternalId || '',
      '',
      '',
      issue.message || '',
      issue.detail || '',
      issue.suggestion || '',
      '',
    ]);
  }

  // 2. Safe Changes
  for (const change of report.safeChanges || []) {
    rows.push([
      'SAFE_CHANGE',
      change.collection || '',
      change.documentId || '',
      change.field || '',
      '',
      '',
      'false',
      '',
      '',
      '',
      '',
      '',
      typeof change.before === 'object' ? JSON.stringify(change.before) : String(change.before ?? ''),
      typeof change.after === 'object' ? JSON.stringify(change.after) : String(change.after ?? ''),
      '',
      '',
      '',
      change.reason || '',
    ]);
  }

  // 3. Conflicts
  for (const conflict of report.conflicts || []) {
    rows.push([
      'CONFLICT',
      conflict.collection || '',
      conflict.documentId || '',
      '',
      conflict.kind || '',
      conflict.severity || '',
      String(conflict.blocking ?? true),
      conflict.standardId || '',
      conflict.parentStandardId || '',
      conflict.referencedStandardId || '',
      conflict.internalId || '',
      conflict.suggestedInternalId || '',
      '',
      '',
      conflict.message || '',
      conflict.detail || '',
      conflict.suggestion || '',
      '',
    ]);
  }

  const csvContent = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map(row => row.map(escapeCsvCell).join(',')),
  ].join('\r\n');

  return `\uFEFF${csvContent}`;
}
