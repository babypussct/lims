import {
  StandardDeviceCode,
  StandardDeviceOption,
  StandardTagCatalogItem,
  StandardTagOption,
  StandardTagSource,
} from '../../../core/models/standard.model';

export const MAX_RETURN_TAGS = 10;
export const MAX_STANDARD_TAGS = 100;
export const MAX_BULK_WRITES = 400;

const VALID_PREFIXES = ['sop', 'target-group', 'custom'] as const;
const DEVICE_CODES: readonly StandardDeviceCode[] = [
  'GC', 'GCECD', 'GCMS', 'GCMSMS', 'GCHRMS', 'LCMSMS', 'ICPMS', 'HPLC',
  'HPLCUVVIS', 'HPLCFLD', 'HPLCDAD', 'HPLCPDA', 'IC', 'UVVIS', 'AASFLAME', 'ELISA'
];

export interface ParsedStandardTagKey {
  source: StandardTagSource;
  id: string;
  key: string;
}

export type StandardBulkTagMode = 'ADD' | 'REMOVE' | 'REPLACE';

export interface StockSummaryUnitItem {
  unit: string;
  totalAmount: number;
}

export interface StockSummaryResult {
  totalContainers: number;
  byUnit: StockSummaryUnitItem[];
}

function prefixForSource(source: StandardTagSource): typeof VALID_PREFIXES[number] {
  switch (source) {
    case 'SOP': return 'sop';
    case 'TARGET_GROUP': return 'target-group';
    case 'CUSTOM': return 'custom';
  }
}

function sourceForPrefix(prefix: string): StandardTagSource | null {
  switch (prefix.toLowerCase()) {
    case 'sop': return 'SOP';
    case 'target-group': return 'TARGET_GROUP';
    case 'custom': return 'CUSTOM';
    default: return null;
  }
}

function assertSafeTagId(id: string, contextLabel = 'tag'): string {
  const value = id.trim();
  if (!value) throw new Error(`${contextLabel} không được để trống.`);
  if (value.length > 200) throw new Error(`${contextLabel} vượt quá 200 ký tự.`);
  if (/[\/\u0000-\u001f\u007f]/.test(value)) {
    throw new Error(`${contextLabel} chứa ký tự không hợp lệ.`);
  }
  return value;
}

/** Builds a stable key while preserving the source ID's original case. */
export function buildTagKey(source: StandardTagSource, sourceId: string): string {
  return `${prefixForSource(source)}:${assertSafeTagId(sourceId, 'ID nhãn')}`;
}

export function parseTagKeyStrict(key: unknown): ParsedStandardTagKey {
  if (typeof key !== 'string') throw new Error('Nhãn phải là chuỗi key canonical.');
  const trimmed = key.trim();
  const separator = trimmed.indexOf(':');
  if (separator <= 0) throw new Error(`Key nhãn không hợp lệ: ${key}`);
  const prefix = trimmed.slice(0, separator).toLowerCase();
  if (!(VALID_PREFIXES as readonly string[]).includes(prefix)) {
    throw new Error(`Prefix nhãn không được phép: ${prefix}`);
  }
  const source = sourceForPrefix(prefix);
  if (!source) throw new Error(`Prefix nhãn không được phép: ${prefix}`);
  const id = assertSafeTagId(trimmed.slice(separator + 1), 'ID nhãn');
  return { source, id, key: `${prefix}:${id}` };
}

/** Singular convenience API used by callers that normalize one key at a time. */
export function normalizeTagKey(key: unknown): string {
  return parseTagKeyStrict(key).key;
}

export function normalizeTagKeysStrict(keys: unknown, contextLabel = 'Nhãn'): string[] {
  if (!Array.isArray(keys)) throw new Error(`${contextLabel} phải là một mảng.`);
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of keys) {
    const normalized = normalizeTagKey(value);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
}

/** Legacy reader: drops malformed entries but never changes a valid key's case. */
export function sanitizeLegacyTagKeys(keys: unknown): string[] {
  if (!Array.isArray(keys)) return [];
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of keys) {
    try {
      const parsed = parseTagKeyStrict(value);
      if (!seen.has(parsed.key)) {
        seen.add(parsed.key);
        result.push(parsed.key);
      }
    } catch {
      // Deliberately tolerant for legacy reads. Writes use strict validation.
    }
  }
  return result;
}

export function assertTagLimit(tags: readonly string[], max: number, contextLabel: string): void {
  if (tags.length > max) {
    throw new Error(`${contextLabel} tối đa ${max} nhãn (đã nhận ${tags.length}). Không tự động cắt nhãn.`);
  }
}

export function mergeUniqueTagKeys(existing: readonly string[], incoming: readonly string[]): string[] {
  return normalizeTagKeysStrict([...existing, ...incoming], 'Nhãn');
}

export function resolveReturnTagMerge(
  existingStandardTags: unknown,
  finalReturnTags: unknown
): {
  standardTags: string[];
  status: 'NOT_REQUESTED' | 'MERGED' | 'SKIPPED_LIMIT';
  warning?: string;
} {
  const existing = sanitizeLegacyTagKeys(existingStandardTags);
  if (finalReturnTags === undefined || finalReturnTags === null) {
    return { standardTags: existing, status: 'NOT_REQUESTED' };
  }
  const finalTags = normalizeTagKeysStrict(finalReturnTags, 'Nhãn xác nhận hoàn trả');
  assertTagLimit(finalTags, MAX_RETURN_TAGS, 'Nhãn xác nhận hoàn trả');
  if (finalTags.length === 0) return { standardTags: existing, status: 'NOT_REQUESTED' };
  const merged = mergeUniqueTagKeys(existing, finalTags);
  if (merged.length > MAX_STANDARD_TAGS) {
    return {
      standardTags: existing,
      status: 'SKIPPED_LIMIT',
      warning: `Không gộp nhãn hoàn trả vì chất chuẩn đã vượt giới hạn ${MAX_STANDARD_TAGS} nhãn.`,
    };
  }
  return { standardTags: merged, status: 'MERGED' };
}

export function applyTagMode(
  currentTags: unknown,
  selectedTags: unknown,
  mode: StandardBulkTagMode
): string[] {
  const current = sanitizeLegacyTagKeys(currentTags);
  const selected = normalizeTagKeysStrict(selectedTags, 'Nhãn được chọn');
  switch (mode) {
    case 'ADD': {
      const result = mergeUniqueTagKeys(current, selected);
      assertTagLimit(result, MAX_STANDARD_TAGS, 'Nhãn chất chuẩn');
      return result;
    }
    case 'REMOVE':
      return current.filter(key => !selected.includes(key));
    case 'REPLACE':
      assertTagLimit(selected, MAX_STANDARD_TAGS, 'Nhãn chất chuẩn');
      return selected;
  }
}

function normalizeUnit(unit: unknown): string {
  const raw = String(unit ?? '').trim().toLowerCase().replace(/[μµ]/g, 'u');
  if (!raw) return 'unknown';
  if (raw === 'ul' || raw === 'microliter' || raw === 'microlitre') return 'ul';
  return raw;
}

const UNIT_ORDER = ['kg', 'g', 'mg', 'ug', 'ng', 'l', 'ml', 'ul', 'tube', 'kit', 'unknown'];

export function summarizeStockByUnit(
  standards: readonly { current_amount?: number; unit?: string }[]
): StockSummaryResult {
  const totals = new Map<string, number>();
  for (const standard of standards) {
    const amount = Number(standard.current_amount);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    const unit = normalizeUnit(standard.unit);
    totals.set(unit, (totals.get(unit) || 0) + amount);
  }
  const byUnit = [...totals.entries()]
    .map(([unit, totalAmount]) => ({ unit, totalAmount }))
    .sort((a, b) => {
      const ai = UNIT_ORDER.indexOf(a.unit);
      const bi = UNIT_ORDER.indexOf(b.unit);
      return (ai < 0 ? UNIT_ORDER.length : ai) - (bi < 0 ? UNIT_ORDER.length : bi)
        || a.unit.localeCompare(b.unit);
    });
  return { totalContainers: standards.length, byUnit };
}

export function formatStockSummary(summary: StockSummaryResult): string {
  const numberFormat = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 6 });
  const parts = summary.byUnit.map(item => `${numberFormat.format(item.totalAmount)} ${item.unit}`);
  return parts.length ? `${parts.join(' · ')} · ${summary.totalContainers} lọ` : `0 · ${summary.totalContainers} lọ`;
}

export function normalizeNafi6ChemicalMethodCode(value: unknown): string {
  const normalized = String(value ?? '').trim().replace(/\s+/g, '');
  const match = /^NAFI6\/H-(\d+)\.(\d+)$/i.exec(normalized);
  if (!match) throw new Error(`Mã phương pháp hóa học không hợp lệ: ${value}`);
  return `NAFI6/H-${match[1]}.${match[2]}`;
}

/** Natural numeric ordering: H-1.2, H-1.6, H-1.10 (not lexical 1.10 before 1.2). */
export function compareChemicalMethodCodes(left: unknown, right: unknown): number {
  const a = String(left ?? '').trim();
  const b = String(right ?? '').trim();
  const aMatch = /^NAFI6\/H-(\d+)\.(\d+)$/i.exec(a);
  const bMatch = /^NAFI6\/H-(\d+)\.(\d+)$/i.exec(b);
  if (aMatch && bMatch) {
    return Number(aMatch[1]) - Number(bMatch[1])
      || Number(aMatch[2]) - Number(bMatch[2])
      || a.localeCompare(b);
  }
  if (aMatch) return -1;
  if (bMatch) return 1;
  return a.localeCompare(b, 'vi', { sensitivity: 'base', numeric: true });
}

type MethodLabelOption =
  | Pick<StandardTagCatalogItem, 'name' | 'methodName' | 'methodCode' | 'deviceCodes'>
  | Pick<StandardTagOption, 'label' | 'methodName' | 'methodCode' | 'deviceCodes'>;

function resolveMethodOptionCode(option: MethodLabelOption): string {
  return option.methodCode?.trim() || ('label' in option ? option.label : option.name);
}

function extractMethodTechnique(methodName: string | undefined): string {
  const text = methodName?.trim();
  if (!text) return '';

  const marker = 'phương pháp';
  const markerIndex = text.toLocaleLowerCase('vi').lastIndexOf(marker);
  if (markerIndex < 0) return '';

  const technique = text
    .slice(markerIndex + marker.length)
    .trim()
    .replace(/^[\s:;,.–—-]+/, '')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ');

  return technique.length <= 80 ? technique : '';
}

export function formatMethodOptionLabel(option: MethodLabelOption): string {
  const code = resolveMethodOptionCode(option);
  return option.methodName ? `${code} — ${option.methodName}` : code;
}

/** Compact label for constrained controls such as filters and selected chips. */
export function formatMethodOptionLabelCompact(option: MethodLabelOption): string {
  const code = resolveMethodOptionCode(option);
  const deviceLabels = [...new Set(option.deviceCodes || [])]
    .map(deviceCode => STANDARD_DEVICE_OPTIONS.find(item => item.code === deviceCode)?.label || deviceCode);
  const technique = deviceLabels.join(', ') || extractMethodTechnique(option.methodName);
  return technique ? `${code} · ${technique}` : code;
}

export function buildAccreditationMethodTagId(methodCode: string): string {
  const normalized = normalizeNafi6ChemicalMethodCode(methodCode).toLowerCase();
  return `method-${normalized.replace('/', '-').replace(/[^a-z0-9.-]+/g, '-')}`;
}

export function deriveMethodSeries(methodCode: string): string {
  const normalized = normalizeNafi6ChemicalMethodCode(methodCode);
  return normalized.slice('NAFI6/'.length).split('.')[0];
}

export function deriveDeviceCodesFromTagKeys(
  tagKeys: unknown,
  catalog: readonly Pick<StandardTagCatalogItem, 'id' | 'deviceCodes'>[]
): StandardDeviceCode[] {
  const keys = sanitizeLegacyTagKeys(tagKeys);
  const byId = new Map(catalog.map(item => [buildTagKey('CUSTOM', item.id), item]));
  const result = new Set<StandardDeviceCode>();
  for (const key of keys) {
    const item = byId.get(key);
    for (const code of item?.deviceCodes || []) {
      if ((DEVICE_CODES as readonly string[]).includes(code)) result.add(code);
    }
  }
  return [...result].sort((a, b) => a.localeCompare(b));
}

export const STANDARD_DEVICE_OPTIONS: readonly StandardDeviceOption[] = [
  ['GC', 'GC', ['gc'], '#64748b'],
  ['GCECD', 'GC-ECD', ['gc-ecd', 'gcecd'], '#0f766e'],
  ['GCMS', 'GCMS', ['gc-ms', 'gcms'], '#2563eb'],
  ['GCMSMS', 'GCMSMS', ['gc-ms-ms', 'gcmsms'], '#7c3aed'],
  ['GCHRMS', 'GCHRMS', ['gc-hrms', 'gchrms'], '#9333ea'],
  ['LCMSMS', 'LCMSMS', ['lc-ms-ms', 'lcmsms'], '#db2777'],
  ['ICPMS', 'ICPMS', ['icp-ms', 'icpms'], '#ea580c'],
  ['HPLC', 'HPLC', ['hplc'], '#0891b2'],
  ['HPLCUVVIS', 'HPLC-UV/VIS', ['hplc-uv-vis'], '#0284c7'],
  ['HPLCFLD', 'HPLC-FLD', ['hplc-fld'], '#16a34a'],
  ['HPLCDAD', 'HPLC-DAD', ['hplc-dad'], '#65a30d'],
  ['HPLCPDA', 'HPLC-PDA', ['hplc-pda'], '#ca8a04'],
  ['IC', 'IC', ['ion chromatography'], '#c2410c'],
  ['UVVIS', 'UV/VIS', ['uv-vis', 'uvvis'], '#dc2626'],
  ['AASFLAME', 'AAS FLAME', ['aas-flame'], '#475569'],
  ['ELISA', 'ELISA', ['elisa'], '#be123c'],
].map(([code, label, aliases, color], index) => ({
  key: `device:${String(code).toLowerCase()}`,
  code: code as StandardDeviceCode,
  label: String(label),
  aliases: aliases as string[],
  color: String(color),
  sortOrder: index,
}));

export function normalizeDeviceAlias(value: unknown): StandardDeviceCode | null {
  const normalized = String(value ?? '').trim().toLowerCase().replace(/[\s_./-]+/g, '');
  if (!normalized) return null;
  const option = STANDARD_DEVICE_OPTIONS.find(item => {
    const candidates = [item.code, item.label, ...item.aliases]
      .map(candidate => candidate.toLowerCase().replace(/[\s_./-]+/g, ''));
    return candidates.includes(normalized);
  });
  return option?.code || null;
}
