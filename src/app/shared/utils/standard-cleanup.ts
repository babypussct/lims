import { formatChemicalName } from './chemical-name';

export type CasQuality = 'valid' | 'missing' | 'placeholder' | 'date_corrupted' | 'annotated' | 'invalid';
export type CleanupRiskLevel = 'low' | 'medium' | 'high';
export type StandardForm = 'neat' | 'solution' | 'mixture' | 'isotope' | 'salt_or_hydrate';

export interface CleanupStandardLike {
  name: string;
  unit?: string;
  pack_size?: string;
  product_code?: string;
}

export interface CasAssessment {
  quality: CasQuality;
  normalizedCas: string | null;
  reason: string;
}

export interface CleanupRiskAssessment {
  level: CleanupRiskLevel;
  reasons: string[];
  forms: StandardForm[];
  canApplyCanonicalToAll: boolean;
}

const PLACEHOLDER_CAS = new Set(['na', 'n/a', 'cas inside', 'cas-inside', 'unknown', 'không có', 'khong co']);
const DATE_LIKE_CAS = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/u;
const ANNOTATED_CAS = /^\s*\d{2,7}-\d{2}-\d\s+.+$/u;

export function assessCasNumber(value: string | null | undefined): CasAssessment {
  const raw = value?.trim() ?? '';
  if (!raw) return { quality: 'missing', normalizedCas: null, reason: 'Chưa có số CAS.' };
  if (PLACEHOLDER_CAS.has(raw.toLocaleLowerCase('vi-VN'))) {
    return { quality: 'placeholder', normalizedCas: null, reason: `“${raw}” là nhãn giữ chỗ, không phải số CAS.` };
  }
  if (DATE_LIKE_CAS.test(raw)) {
    return { quality: 'date_corrupted', normalizedCas: null, reason: 'Số CAS có dấu hiệu đã bị bảng tính chuyển thành ngày.' };
  }
  if (ANNOTATED_CAS.test(raw)) {
    return { quality: 'annotated', normalizedCas: null, reason: 'Số CAS đang chứa chú thích; cần tách chú thích trước khi dùng.' };
  }

  const compact = raw.replace(/[\s\u2012-\u2015]+/gu, '').replace(/-/gu, '');
  if (!/^\d{5,10}$/u.test(compact)) {
    return { quality: 'invalid', normalizedCas: null, reason: 'Số CAS không đúng cấu trúc.' };
  }

  const body = compact.slice(0, -1);
  const checkDigit = Number(compact.at(-1));
  const checksum = Array.from(body)
    .reverse()
    .reduce((sum, digit, index) => sum + Number(digit) * (index + 1), 0) % 10;
  if (checksum !== checkDigit) {
    return { quality: 'invalid', normalizedCas: null, reason: 'Số CAS sai chữ số kiểm tra.' };
  }

  return {
    quality: 'valid',
    normalizedCas: `${body.slice(0, -2)}-${body.slice(-2)}-${checkDigit}`,
    reason: 'Số CAS hợp lệ.',
  };
}

/**
 * Extracts a correction only when the source contains exactly one CAS-shaped
 * token and that token passes the checksum. Ambiguous lists are never guessed.
 */
export function suggestCasCorrection(value: string | null | undefined): string {
  const matches = value?.match(/(?<!\d)\d{2,7}[\s\u2012-\u2015-]+\d{2}[\s\u2012-\u2015-]+\d(?!\d)/gu) ?? [];
  const valid = [...new Set(
    matches
      .map(candidate => assessCasNumber(candidate).normalizedCas)
      .filter((candidate): candidate is string => Boolean(candidate))
  )];
  return valid.length === 1 ? valid[0] : '';
}

/** Normalizes measurement typography without changing the chemical identity. */
export function normalizeProductNameTypography(value: string): string {
  return value
    .trim()
    .replace(/\s+/gu, ' ')
    .replace(/(?:ug|µg|μg|ìg)\s*\/\s*(?:ml|mL|ML)/giu, 'µg/mL')
    .replace(/\bmg\s*\/\s*(?:l|L)\b/gu, 'mg/L')
    .replace(/\b(?:ml|ML)\b/gu, 'mL')
    .replace(/\b(?:ul|uL|μl|μL|µl)\b/gu, 'µL');
}

export function formatStandardProductName(value: string): string {
  // Apply sentence case before introducing the intentionally mixed-case unit
  // symbols; otherwise mL/µg can make an ALL-CAPS product look mixed-case.
  const casingInput = value
    .replace(/(?:ug|µg|μg|ìg)\s*\/\s*(?:ml|mL|ML)/giu, 'UG/ML')
    .replace(/\bmg\s*\/\s*(?:l|L)\b/gu, 'MG/L')
    .replace(/\b(?:ml|mL)\b/gu, 'ML');
  return normalizeProductNameTypography(formatChemicalName(casingInput));
}

export function detectStandardForm(name: string): StandardForm {
  const normalized = name.toLocaleLowerCase('en-US');
  if (/\b(?:mix|mixture|multi[- ]?element|multi[- ]?anion|components?|kit of|crm)\b/u.test(normalized)) {
    return 'mixture';
  }
  if (/(?:\b\d+(?:[.,]\d+)?\s*(?:ng|µg|ug|mg|g)\s*\/\s*(?:µl|ul|ml|l)\b|\bin\s+(?:methanol|acetonitrile|toluene|water|h2o|acetone|nonane)\b|\bsolution\b)/u.test(normalized)) {
    return 'solution';
  }
  if (/(?:\b\d{1,2}(?:c|n|h|o|d)\d*\b|[¹²³⁴⁵⁶⁷⁸⁹⁰]+[a-z]|\bdeuterated\b|[- ]d\d+\b)/iu.test(name)) {
    return 'isotope';
  }
  if (/\b(?:sodium|potassium|hydrochloride|hydrate|monohydrate|dihydrate|salt)\b/u.test(normalized)) {
    return 'salt_or_hydrate';
  }
  return 'neat';
}

export function assessCleanupGroup(standards: CleanupStandardLike[]): CleanupRiskAssessment {
  const names = new Set(standards.map(item => formatStandardProductName(item.name).toLocaleLowerCase('en-US')));
  const units = new Set(standards.map(item => item.unit?.trim().toLocaleLowerCase('en-US') ?? '').filter(Boolean));
  const forms = [...new Set(standards.map(item => detectStandardForm(item.name)))];
  const reasons: string[] = [];

  if (names.size > 1) reasons.push('Nhóm CAS đang có nhiều tên sản phẩm khác nhau.');
  if (units.size > 1) reasons.push('Các hồ sơ trong nhóm sử dụng đơn vị khác nhau.');
  if (forms.length > 1) reasons.push('Nhóm chứa nhiều dạng chất chuẩn khác nhau.');
  if (forms.includes('mixture')) reasons.push('Có hỗn hợp hoặc chuẩn đa thành phần.');
  if (forms.includes('solution')) reasons.push('Có dung dịch hoặc thông tin nồng độ/dung môi cần được giữ nguyên.');
  if (forms.includes('isotope')) reasons.push('Có chất đánh dấu đồng vị; kiểu chữ và chỉ số mang ý nghĩa khoa học.');
  if (forms.includes('salt_or_hydrate')) reasons.push('Có dạng muối hoặc hydrat cần được giữ nguyên.');

  const hasStructuralConflict = units.size > 1 || forms.length > 1 || forms.includes('mixture');
  const hasComplexForm = forms.some(form => form !== 'neat');
  const level: CleanupRiskLevel = hasStructuralConflict
    ? 'high'
    : (names.size > 1 || hasComplexForm ? 'medium' : 'low');

  if (reasons.length === 0) reasons.push('Các hồ sơ có cùng tên và cùng dạng sản phẩm.');
  return {
    level,
    reasons,
    forms,
    canApplyCanonicalToAll: level === 'low',
  };
}
