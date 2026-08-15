import {
  ReferenceStandard,
  StandardInternalIdApplySummary,
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

  for (const [id, code] of validCorrections) {
    // 1. reference_standards document: internal_id + search_key
    documentKeys.add(`reference_standards/${id}`);
    byCollection['reference_standards'] = (byCollection['reference_standards'] || 0) + 2;
    searchKeyUpdate += 1;
    totalManualFieldChanges += 2;

    // Check if standard is in current lifecycle
    const issue = manualIssuesMap.get(id);
    const isCurrent = issue?.isCurrentLifecycle !== false;

    if (isCurrent) {
      const normalized = normalizeInternalId(code);
      documentKeys.add(`standard_code_registry/${normalized}`);
      byCollection['standard_code_registry'] = (byCollection['standard_code_registry'] || 0) + 1;
      registrySync += 1;
      totalManualFieldChanges += 1; // __document__ in standard_code_registry
    }
  }

  const totalChanges = safe.length + totalManualFieldChanges;
  const totalDocuments = documentKeys.size;
  // Actual Firestore writes: all unique modified business documents + 1 audit batch write
  const actualWrites = totalDocuments > 0 ? totalDocuments + 1 : 0;
  const estimatedBatches = actualWrites > 0 ? Math.ceil(actualWrites / 250) : 0;

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
