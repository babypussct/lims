import {
  ImportPreviewItem,
  ReferenceStandard,
  StandardImportFieldChange,
  UsageLog
} from '../../../core/models/standard.model';
import { parseStandardQuantity } from '../../../shared/utils/standard-amount';
import { parseStandardDate } from '../../../shared/utils/standard-fefo';
import { generateSlug } from '../../../shared/utils/utils';

export const STANDARD_IMPORT_MAX_FILE_SIZE = 10 * 1024 * 1024;
export const STANDARD_IMPORT_ALLOWED_EXTENSIONS = ['xlsx', 'xlsm', 'csv'] as const;
export const STANDARD_IMPORT_MAX_ATOMIC_WRITES = 450;

type ImportField =
  | 'name'
  | 'chemical_name'
  | 'internal_id'
  | 'lot_number'
  | 'pack_size'
  | 'initial_amount'
  | 'current_amount'
  | 'location'
  | 'storage_condition'
  | 'received_date'
  | 'expiry_date'
  | 'product_code'
  | 'manufacturer'
  | 'cas_number'
  | 'contract_ref'
  | 'purity';

const HEADER_ALIASES: Record<ImportField, readonly string[]> = {
  name: ['tên chuẩn', 'tên chất chuẩn'],
  chemical_name: ['tên khác', 'tên hóa học'],
  internal_id: ['số nhận diện', 'mã chuẩn', 'mã nhận diện'],
  lot_number: ['số lô', 'lot', 'lô'],
  pack_size: ['quy cách', 'đóng gói'],
  initial_amount: ['khối lượng chai', 'khối lượng/chai', 'kl chai', 'lượng ban đầu'],
  current_amount: ['lượng còn lại', 'tồn kho', 'hiện tại'],
  location: ['vị trí', 'nơi để'],
  storage_condition: ['điều kiện bảo quản', 'bảo quản'],
  received_date: ['ngày nhận', 'ngày nhập'],
  expiry_date: ['hạn sử dụng', 'hạn dùng'],
  product_code: ['product code', 'mã số sản phẩm', 'mã sản phẩm'],
  manufacturer: ['hãng', 'nhà sản xuất'],
  cas_number: ['cas number', 'số cas', 'cas'],
  contract_ref: ['hợp đồng', 'hợp đồng dự toán', 'dự toán'],
  purity: ['độ tinh khiết', 'purity']
};

const FIELD_LABELS: Partial<Record<keyof ReferenceStandard, string>> = {
  name: 'Tên chuẩn',
  chemical_name: 'Tên hóa học',
  internal_id: 'Số nhận diện',
  cas_number: 'CAS',
  product_code: 'Mã sản phẩm',
  purity: 'Độ tinh khiết',
  manufacturer: 'Hãng',
  pack_size: 'Quy cách',
  lot_number: 'Số lô',
  location: 'Vị trí',
  storage_condition: 'Điều kiện bảo quản',
  received_date: 'Ngày nhận',
  expiry_date: 'Hạn sử dụng',
  contract_ref: 'Hợp đồng'
};

const SAFE_UPDATE_FIELDS: (keyof ReferenceStandard)[] = [
  'name',
  'chemical_name',
  'internal_id',
  'cas_number',
  'product_code',
  'purity',
  'manufacturer',
  'pack_size',
  'lot_number',
  'location',
  'storage_condition',
  'received_date',
  'expiry_date',
  'contract_ref'
];

export interface StandardImportDateResult {
  value: string;
  provided: boolean;
  error?: string;
}

export interface ParseStandardImportRowsOptions {
  sourceSheet: string;
  existingStandards: ReferenceStandard[];
  generateSearchKey: (standard: ReferenceStandard) => string;
  generateDocumentId?: (input: {
    internalId: string;
    name: string;
    lot: string;
    rowNumber: number;
  }) => string;
  today?: string;
}

export function normalizeImportHeader(value: unknown): string {
  const firstMeaningfulLine = String(value ?? '')
    .split(/[\r\n]+/)
    .map(part => part.trim())
    .find(Boolean) || '';
  return firstMeaningfulLine
    .normalize('NFC')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function validateStandardImportFile(file: Pick<File, 'name' | 'size'>): void {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!STANDARD_IMPORT_ALLOWED_EXTENSIONS.includes(extension as typeof STANDARD_IMPORT_ALLOWED_EXTENSIONS[number])) {
    throw new Error('Chỉ hỗ trợ tệp .xlsx, .xlsm hoặc .csv.');
  }
  if (file.size <= 0) throw new Error('Tệp rỗng.');
  if (file.size > STANDARD_IMPORT_MAX_FILE_SIZE) {
    throw new Error('Tệp vượt quá 10 MB. Vui lòng chia thành các tệp nhỏ hơn.');
  }
}

export function parseExcelDateDetailed(value: unknown): StandardImportDateResult {
  if (value === null || value === undefined) return { value: '', provided: false };
  const raw = String(value).trim();
  const placeholder = ['-', '/', 'na', 'n/a', 'unknown', ''];
  if (placeholder.includes(raw.toLowerCase())) {
    return { value: '', provided: raw !== '' };
  }

  let result = '';
  let serial = NaN;
  if (typeof value === 'number') serial = value;
  else if (/^\d+(?:\.\d+)?$/.test(raw)) serial = Number(raw);

  if (Number.isFinite(serial) && serial > 10000) {
    result = new Date(Math.round((serial - 25569) * 86400 * 1000)).toISOString().slice(0, 10);
  } else {
    const parts = raw.split(/[\/\-.]/).map(part => part.trim());
    if (parts.length === 3) {
      let day: string;
      let month: string;
      let year: string;
      if (parts[0].length === 4) {
        [year, month, day] = parts;
      } else {
        [day, month, year] = parts;
        if (year.length === 2) year = `20${year}`;
      }
      if (/^\d{4}$/.test(year) && /^\d{1,2}$/.test(month) && /^\d{1,2}$/.test(day)) {
        result = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
  }

  if (!result || parseStandardDate(result) === null) {
    return { value: '', provided: true, error: `Ngày "${raw}" không hợp lệ.` };
  }
  return { value: result, provided: true };
}

function normalizeIdentity(value: string | undefined): string {
  return (value || '').normalize('NFC').trim().toLowerCase();
}

export function isActiveStandardIdentity(standard: ReferenceStandard): boolean {
  return standard._isDeleted !== true && standard.status !== 'DELETED';
}

function createStandardDocumentId(
  options: ParseStandardImportRowsOptions,
  internalId: string,
  name: string,
  lot: string,
  rowNumber: number
): string {
  if (options.generateDocumentId) {
    return options.generateDocumentId({ internalId, name, lot, rowNumber });
  }
  const randomToken = globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const identityPrefix = generateSlug(internalId || name || 'standard') || 'standard';
  return `std_${identityPrefix}_${generateSlug(randomToken)}`;
}

function valuesEqual(before: unknown, after: unknown): boolean {
  return String(before ?? '').trim() === String(after ?? '').trim();
}

export function buildSafeImportMetadata(
  parsed: ReferenceStandard,
  presentFields: readonly (keyof ReferenceStandard)[]
): Partial<ReferenceStandard> {
  const present = new Set(presentFields);
  const metadata: Partial<ReferenceStandard> = {};
  for (const field of SAFE_UPDATE_FIELDS) {
    if (!present.has(field)) continue;
    const value = parsed[field];
    if (typeof value === 'string' && value.trim() === '') continue;
    if (value === null || value === undefined) continue;
    (metadata as Record<string, unknown>)[field] = value;
  }
  return metadata;
}

export function computeImportChanges(
  current: ReferenceStandard,
  parsed: ReferenceStandard,
  presentFields: readonly (keyof ReferenceStandard)[]
): StandardImportFieldChange[] {
  const metadata = buildSafeImportMetadata(parsed, presentFields);
  return Object.entries(metadata)
    .filter(([field, after]) => !valuesEqual(current[field as keyof ReferenceStandard], after))
    .map(([field, after]) => ({
      field: field as keyof ReferenceStandard,
      label: FIELD_LABELS[field as keyof ReferenceStandard] || field,
      before: (current[field as keyof ReferenceStandard] ?? null) as string | number | boolean | null,
      after: (after ?? null) as string | number | boolean | null
    }));
}

export function countAtomicStandardImportWrites(
  items: readonly ImportPreviewItem[],
  existingIds: ReadonlySet<string>
): number {
  return items.reduce(
    (count, item) => count + 1 + (existingIds.has(item.parsed.id) ? 0 : (item.logs?.length || 0) * 2),
    1
  );
}

function inferPackUnit(packText: string): string {
  const lower = packText.toLowerCase();
  if (lower.includes('ml') || lower.includes('lít')) return 'ml';
  if (lower.includes('µg') || lower.includes('ug') || lower.includes('mcg')) return 'µg';
  if (lower.includes('kg')) return 'kg';
  if (lower.includes('g') && !lower.includes('mg') && !lower.includes('kg')) return 'g';
  if (lower.includes('µl') || lower.includes('ul')) return 'µl';
  return 'mg';
}

function parseInlineUsageLog(
  value: unknown,
  defaultDate: string,
  standardUnit: string
): { log?: UsageLog; error?: string } {
  const raw = String(value ?? '').trim();
  if (!raw) return {};

  const dateMatch = raw.match(/(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/);
  const dateResult = dateMatch ? parseExcelDateDetailed(dateMatch[1]) : { value: defaultDate, provided: false };
  if (dateResult.error) return { error: `Ngày trong nhật ký không hợp lệ: ${dateMatch?.[1]}.` };

  const userMatch = raw.match(/(?:ng[ưươ][ờoi]i|user)(?:\s*pha\s*ch[ếe])?\s*[:\-\s]*([^;\n\r]+)/i);
  let user = userMatch?.[1]?.trim() || 'Dữ liệu nhập từ tệp';
  user = user.split(/\b(?:lượng|kl|amount|ngày|date)\b/i)[0].replace(/[:\-]+$/, '').trim() || 'Dữ liệu nhập từ tệp';

  const labelledAmount = raw.match(
    /(?:lượng|kl|amount)(?:\s*(?:d[ùu]ng|c[âa]n|used))?\s*[:\s-]*([+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+))\s*([a-zA-Zµμ]+(?:\s*\/\s*(?:chai|lọ|lo|vial|bottle|ampoule|ampule|ống|ong))?)?/iu
  );
  const quantityTokens = [...raw.matchAll(/([+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+))\s*([a-zA-Zµμ]+)?/gu)];
  const fallbackAmount = quantityTokens
    .filter(match => !dateMatch || !dateMatch[0].includes(match[0]))
    .at(-1);
  const amountToken = labelledAmount?.[1] || fallbackAmount?.[1] || (/^[0-9.,]+$/.test(raw) ? raw : '');
  const unitToken = labelledAmount?.[2] || fallbackAmount?.[2] || standardUnit;
  if (!amountToken) return { error: `Không đọc được lượng dùng từ "${raw}".` };

  const parsed = parseStandardQuantity(`${amountToken} ${unitToken}`, standardUnit);
  if (!parsed || parsed.normalizedAmount <= 0) {
    return { error: `Lượng hoặc đơn vị nhật ký "${amountToken} ${unitToken}" không hợp lệ.` };
  }

  return {
    log: {
      date: dateResult.value || defaultDate,
      user,
      amount_used: parsed.amount,
      unit: parsed.unit,
      normalized_amount: parsed.normalizedAmount,
      normalized_unit: parsed.normalizedUnit,
      purpose: 'Nhật ký nhập từ tệp'
    }
  };
}

function buildHeaderMap(rawRows: Record<string, unknown>[]): Map<ImportField, string> {
  const headers = [...new Set(rawRows.flatMap(row => Object.keys(row)))];
  const normalizedToOriginal = new Map<string, string[]>();
  headers.forEach(header => {
    const normalized = normalizeImportHeader(header);
    normalizedToOriginal.set(normalized, [...(normalizedToOriginal.get(normalized) || []), header]);
  });

  const mapping = new Map<ImportField, string>();
  (Object.keys(HEADER_ALIASES) as ImportField[]).forEach(field => {
    const matches = HEADER_ALIASES[field]
      .flatMap(alias => normalizedToOriginal.get(normalizeImportHeader(alias)) || []);
    const unique = [...new Set(matches)];
    if (unique.length > 1) {
      throw new Error(`Có nhiều cột cùng ánh xạ vào "${FIELD_LABELS[field] || field}": ${unique.join(', ')}.`);
    }
    if (unique[0]) mapping.set(field, unique[0]);
  });

  if (!mapping.has('name')) throw new Error('Thiếu cột bắt buộc "Tên chuẩn".');
  if (!mapping.has('initial_amount')) throw new Error('Thiếu cột bắt buộc "Khối lượng chai/Lượng ban đầu".');
  return mapping;
}

function fieldValue(row: Record<string, unknown>, mapping: Map<ImportField, string>, field: ImportField): unknown {
  const header = mapping.get(field);
  return header ? row[header] : undefined;
}

function existingCandidates(
  existingStandards: ReferenceStandard[],
  internalId: string,
  name: string,
  lot: string
): ReferenceStandard[] {
  const activeStandards = existingStandards.filter(isActiveStandardIdentity);
  if (internalId) {
    const byInternalId = activeStandards.filter(
      standard => normalizeIdentity(standard.internal_id) === normalizeIdentity(internalId)
    );
    if (byInternalId.length) return byInternalId;
  }
  if (name && lot) {
    return activeStandards.filter(
      standard =>
        normalizeIdentity(standard.name) === normalizeIdentity(name) &&
        normalizeIdentity(standard.lot_number) === normalizeIdentity(lot)
    );
  }
  return [];
}

export function parseStandardImportRows(
  rawRows: Record<string, unknown>[],
  options: ParseStandardImportRowsOptions
): ImportPreviewItem[] {
  if (!rawRows.length) throw new Error('Sheet không có dữ liệu.');
  const mapping = buildHeaderMap(rawRows);
  const presentFields = [...mapping.keys()] as (keyof ReferenceStandard)[];
  const today = options.today || new Date().toISOString().slice(0, 10);
  const results: ImportPreviewItem[] = [];
  const identityRows = new Map<string, ImportPreviewItem[]>();

  rawRows.forEach((rawRow, index) => {
    const rowNumber = index + 2;
    const errors: string[] = [];
    const warnings: string[] = [];
    const rawName = String(fieldValue(rawRow, mapping, 'name') ?? '');
    const nameParts = rawName.split(/[\r\n]+/).map(part => part.trim()).filter(Boolean);
    const name = nameParts[0] || '';
    if (!name) errors.push('Thiếu tên chuẩn.');

    const chemicalName = nameParts.slice(1).join(' ') ||
      String(fieldValue(rawRow, mapping, 'chemical_name') ?? '').trim();
    const internalId = String(fieldValue(rawRow, mapping, 'internal_id') ?? '').trim();
    const lot = String(fieldValue(rawRow, mapping, 'lot_number') ?? '').trim();
    if (!internalId && !lot) errors.push('Cần có Số nhận diện hoặc Số lô để chống tạo trùng khi import lại.');
    else if (!internalId) warnings.push('Không có Số nhận diện; hệ thống dùng Tên + Số lô làm khóa đối chiếu.');

    const rawPackText = String(fieldValue(rawRow, mapping, 'pack_size') ?? '').trim();
    const packUnit = inferPackUnit(rawPackText);
    const rawInitial = fieldValue(rawRow, mapping, 'initial_amount');
    const initialParsed = parseStandardQuantity(rawInitial, packUnit);
    if (!initialParsed || initialParsed.normalizedAmount <= 0) {
      errors.push('Khối lượng ban đầu phải lớn hơn 0 và có đơn vị hợp lệ.');
    }
    const initial = initialParsed?.normalizedAmount ?? 0;
    const unit = initialParsed?.normalizedUnit || packUnit;

    const receivedResult = parseExcelDateDetailed(fieldValue(rawRow, mapping, 'received_date'));
    const expiryResult = parseExcelDateDetailed(fieldValue(rawRow, mapping, 'expiry_date'));
    if (receivedResult.error) errors.push(`Ngày nhận: ${receivedResult.error}`);
    if (expiryResult.error) errors.push(`Hạn sử dụng: ${expiryResult.error}`);

    const logs: UsageLog[] = [];
    const seenLogs = new Set<string>();
    const logHeaders = Object.keys(rawRow)
      .filter(header => /^lần\s*(?:cân|dùng)?\s*\d+$/i.test(normalizeImportHeader(header)))
      .sort((a, b) => normalizeImportHeader(a).localeCompare(normalizeImportHeader(b), undefined, { numeric: true }));
    logHeaders.forEach((header, logIndex) => {
      const rawLog = rawRow[header];
      if (String(rawLog ?? '').trim() === '') return;
      const parsedLog = parseInlineUsageLog(rawLog, receivedResult.value || today, unit);
      if (parsedLog.error) {
        errors.push(`${normalizeImportHeader(header)}: ${parsedLog.error}`);
        return;
      }
      if (!parsedLog.log) return;
      const signature = `${parsedLog.log.date}_${normalizeIdentity(parsedLog.log.user)}_${parsedLog.log.normalized_amount}_${unit}`;
      if (seenLogs.has(signature)) {
        warnings.push(`${normalizeImportHeader(header)} trùng nhật ký trước đó và đã được bỏ qua.`);
        return;
      }
      seenLogs.add(signature);
      logs.push({
        ...parsedLog.log,
        timestamp: (parseStandardDate(parsedLog.log.date) || Date.now()) + logIndex + 1
      });
    });

    const rawCurrent = fieldValue(rawRow, mapping, 'current_amount');
    const hasExplicitCurrent = rawCurrent !== undefined && rawCurrent !== null && String(rawCurrent).trim() !== '';
    const currentParsed = hasExplicitCurrent ? parseStandardQuantity(rawCurrent, unit) : null;
    const totalLogged = logs.reduce((sum, log) => sum + Number(log.normalized_amount || 0), 0);
    let current = hasExplicitCurrent ? (currentParsed?.normalizedAmount ?? NaN) : initial - totalLogged;
    if (hasExplicitCurrent && !currentParsed) errors.push('Lượng còn lại hoặc đơn vị không hợp lệ.');
    if (!Number.isFinite(current) || current < -1e-9) errors.push('Lượng còn lại không được âm.');
    current = Math.max(0, Number.isFinite(current) ? current : 0);
    if (initial > 0 && current > initial + 1e-9) {
      errors.push('Lượng còn lại không được lớn hơn lượng ban đầu.');
    }
    if (hasExplicitCurrent && logs.length && Math.abs((initial - totalLogged) - current) > 1e-9) {
      warnings.push('Lượng còn lại không khớp lượng ban đầu trừ các LẦN CÂN; hệ thống giữ nguyên lượng còn lại trong Excel.');
    }

    let location = String(fieldValue(rawRow, mapping, 'location') ?? '').trim();
    const storageCondition = String(fieldValue(rawRow, mapping, 'storage_condition') ?? '').trim();
    if (!location && storageCondition) {
      const lower = storageCondition.toLowerCase();
      if (lower.includes('ft') || lower.includes('đông') || lower.includes('-20')) location = 'Tủ A';
      else if (lower.includes('ct') || lower.includes('mát') || lower.includes('2-8')) location = 'Tủ B';
      else if (lower.includes('rt') || lower.includes('thường')) location = 'Tủ C';
    }

    const candidates = existingCandidates(options.existingStandards, internalId, name, lot);
    if (candidates.length > 1) errors.push('Có nhiều chuẩn hiện hữu trùng khóa nhận diện; cần xử lý dữ liệu trùng trước khi import.');
    const existing = candidates.length === 1 ? candidates[0] : undefined;
    const identity = internalId
      ? `internal:${normalizeIdentity(internalId)}`
      : `name-lot:${normalizeIdentity(name)}:${normalizeIdentity(lot)}`;
    const generatedId = createStandardDocumentId(options, internalId, name, lot, rowNumber);
    const id = existing?.id || generatedId || `invalid_row_${rowNumber}`;
    let packSize = rawPackText;
    if (!packSize && initial > 0) packSize = `${initial} ${unit}`;

    const standard: ReferenceStandard = {
      id,
      name,
      chemical_name: chemicalName,
      internal_id: internalId,
      location,
      pack_size: packSize,
      lot_number: lot,
      contract_ref: String(fieldValue(rawRow, mapping, 'contract_ref') ?? '').trim(),
      received_date: receivedResult.value,
      expiry_date: expiryResult.value,
      initial_amount: initial,
      current_amount: current,
      unit,
      product_code: String(fieldValue(rawRow, mapping, 'product_code') ?? '').trim(),
      manufacturer: String(fieldValue(rawRow, mapping, 'manufacturer') ?? '').trim(),
      cas_number: String(fieldValue(rawRow, mapping, 'cas_number') ?? '').trim(),
      purity: String(fieldValue(rawRow, mapping, 'purity') ?? '').trim(),
      storage_condition: storageCondition,
      storage_status: 'Sẵn sàng',
      status: current <= 0 ? 'DEPLETED' : 'AVAILABLE',
      lastUpdated: null
    };
    standard.search_key = options.generateSearchKey(standard);

    let mode: ImportPreviewItem['mode'] = 'CREATE';
    if (existing) {
      mode = existing._isDeleted || existing.status === 'DELETED' ? 'RESTORE' : 'UPDATE_SAFE';
      if (mode === 'UPDATE_SAFE' && logs.length) {
        warnings.push('Chuẩn đã tồn tại: chỉ cập nhật metadata, không nhập lại các LẦN CÂN để tránh thay đổi tồn kho.');
      }
    }

    const item: ImportPreviewItem = {
      raw: { ...rawRow, 'Ngày nhận (Gốc)': fieldValue(rawRow, mapping, 'received_date') ?? '' },
      parsed: standard,
      logs,
      isValid: errors.length === 0,
      errorMessage: errors.join(' '),
      warnings,
      rowNumber,
      sourceSheet: options.sourceSheet,
      presentFields,
      mode,
      changes: existing ? computeImportChanges(existing, standard, presentFields) : []
    };
    results.push(item);
    if (identity && !identity.endsWith('::')) {
      identityRows.set(identity, [...(identityRows.get(identity) || []), item]);
    }
  });

  identityRows.forEach(items => {
    if (items.length < 2) return;
    items.forEach(item => {
      item.isValid = false;
      item.mode = 'CONFLICT';
      item.errorMessage = [item.errorMessage, 'Trùng khóa nhận diện với dòng khác trong cùng tệp.']
        .filter(Boolean)
        .join(' ');
    });
  });

  return results;
}
