import { parseLocalDateKey } from './date-range';
import { UNIT_DATA } from './utils';

/** Freeze and validate optional local-calendar bounds before an asynchronous export. */
export function exportDateBounds(from = '', to = ''): { from?: number; to?: number } {
  const start = from ? parseLocalDateKey(from) : null;
  const end = to ? parseLocalDateKey(to) : null;
  if ((from && !start) || (to && !end) || (start && end && start > end)) {
    throw new Error('Khoảng ngày không hợp lệ.');
  }
  end?.setHours(23, 59, 59, 999);
  return { from: start?.getTime(), to: end?.getTime() };
}

export function calendarDaysLeft(value: string | undefined, today = new Date()): number | null {
  const date = parseLocalDateKey(value);
  if (!date) return null;
  return Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
}

export function uniqueSheetName(name: string, existing: readonly string[]): string {
  const base = name.replace(/[\\/?:*\[\]\x00-\x1f]/g, '').replace(/^'+|'+$/g, '') || 'Sheet';
  const used = new Set(existing.map(value => value.toLowerCase()));
  let candidate = base.slice(0, 31).replace(/'+$/g, '');
  for (let index = 2; used.has(candidate.toLowerCase()); index++) {
    const suffix = `_${index}`;
    candidate = base.slice(0, 31 - suffix.length) + suffix;
  }
  return candidate;
}

/** Only mass/volume conversions are valid here: a box is not a tube or a kit. */
export function exportAmount(amount: number, unit?: string): { amount: number; unit: string } {
  if (!Number.isFinite(amount)) throw new Error('Lượng sử dụng không hợp lệ.');
  const clean = unit?.trim().replace(/μ/g, 'µ') || 'không rõ';
  const data = UNIT_DATA[clean.toLowerCase()];
  if (data?.type === 'mass') return { amount: amount * data.val / 0.001, unit: 'mg' };
  if (data?.type === 'vol') return { amount: amount * data.val, unit: 'ml' };
  return { amount, unit: clean };
}

export function usageExportAmount(log: {
  normalized_amount?: number; normalized_unit?: string; amount_used?: number; unit?: string;
}): { amount: number; unit: string } {
  // A normalized number without its unit cannot be interpreted safely.
  if (log.normalized_amount != null && log.normalized_unit?.trim()) {
    return exportAmount(log.normalized_amount, log.normalized_unit);
  }
  return exportAmount(log.amount_used ?? 0, log.unit);
}

/** Large/nested values remain reconstructible JSON, joined by row/field/part. */
export function archiveExportRows(records: Record<string, any>[]) {
  const details: { Record: number; ID: string; Field: string; Part: number; JSON: string }[] = [];
  const rows = records.map((record, index) => Object.fromEntries(Object.entries(record).map(([key, value]) => {
    const normalized = value?.toDate instanceof Function ? value.toDate().toISOString() : value;
    if ((normalized !== null && typeof normalized === 'object') ||
        (typeof normalized === 'string' && normalized.length > 30000)) {
      const json = JSON.stringify(normalized, (_key, item) =>
        item?.toDate instanceof Function ? item.toDate().toISOString() : item);
      for (let offset = 0; offset < json.length; offset += 30000) {
        details.push({ Record: index + 1, ID: String(record['id'] ?? ''), Field: key,
          Part: offset / 30000 + 1, JSON: json.slice(offset, offset + 30000) });
      }
      return [key, `JSON: record ${index + 1}, field ${key}`];
    }
    return [key, normalized];
  })));
  return { rows, details };
}
