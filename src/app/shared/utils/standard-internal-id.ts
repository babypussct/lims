import { ReferenceStandard } from '../../core/models/standard.model';

/** The laboratory's only business identifier for a reference standard. */
// The form accepts lower-case input and normalizes it before persistence.
// Validation therefore remains case-insensitive while the stored code is
// always canonical upper-case.
export const STANDARD_INTERNAL_ID_PATTERN = /^[ABC][A-Z0-9]{3}$/iu;
export const STANDARD_INTERNAL_ID_LENGTH = 4;

export type StandardInternalIdAssessmentKind = 'VALID' | 'NORMALIZABLE' | 'MISSING' | 'INVALID_FORMAT';

export interface StandardInternalIdAssessment {
  raw: string;
  normalized: string;
  kind: StandardInternalIdAssessmentKind;
  reason: string;
}

export function normalizeInternalId(value: unknown): string {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toUpperCase();
}

export function isValidInternalId(value: unknown): value is string {
  return STANDARD_INTERNAL_ID_PATTERN.test(normalizeInternalId(value));
}

export function assessInternalId(value: unknown): StandardInternalIdAssessment {
  const raw = String(value ?? '');
  const normalized = normalizeInternalId(value);
  if (!normalized) {
    return { raw, normalized, kind: 'MISSING', reason: 'Chưa có Mã quản lý nội bộ.' };
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
    reason: `Mã phải có đúng ${STANDARD_INTERNAL_ID_LENGTH} ký tự, bắt đầu bằng A, B hoặc C.`
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
