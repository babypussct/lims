export interface InclusiveDateRange {
  start: Date;
  end: Date;
  days: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcDayMs(date: Date): number {
  // Date.UTC(year, ...) maps years 0000-0099 to 1900-1999. Build through
  // setUTCFullYear so inclusive ranges remain correct for every supported
  // YYYY-MM-DD value.
  const utc = new Date(0);
  utc.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  utc.setUTCHours(0, 0, 0, 0);
  return utc.getTime();
}

export function parseLocalDateKey(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  // Construct through setFullYear so years 0001-0099 are not interpreted as
  // 1901-1999 by the multi-argument Date constructor.
  const parsed = new Date(0);
  parsed.setHours(0, 0, 0, 0);
  parsed.setFullYear(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

export function toLocalDateKey(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function createInclusiveDateRange(
  startKey: string | null | undefined,
  endKey: string | null | undefined
): InclusiveDateRange | null {
  const start = parseLocalDateKey(startKey);
  const endStartOfDay = parseLocalDateKey(endKey);
  if (!start || !endStartOfDay || start.getTime() > endStartOfDay.getTime()) return null;

  const startUtcDay = toUtcDayMs(start);
  const endUtcDay = toUtcDayMs(endStartOfDay);
  const days = Math.round((endUtcDay - startUtcDay) / DAY_MS) + 1;
  const end = new Date(endStartOfDay);
  end.setHours(23, 59, 59, 999);
  return { start, end, days };
}

export function enumerateInclusiveDates(range: InclusiveDateRange): Date[] {
  const dates: Date[] = [];
  for (let index = 0; index < range.days; index++) {
    const date = new Date(range.start);
    date.setDate(date.getDate() + index);
    dates.push(date);
  }
  return dates;
}

export function normalizeManualDateRange(
  changed: 'start' | 'end',
  value: string,
  currentStart: string,
  currentEnd: string
): { start: string; end: string } {
  let start = changed === 'start' ? value : currentStart;
  let end = changed === 'end' ? value : currentEnd;

  const parsedStart = parseLocalDateKey(start);
  const parsedEnd = parseLocalDateKey(end);
  if (parsedStart && parsedEnd && parsedStart.getTime() > parsedEnd.getTime()) {
    if (changed === 'start') end = start;
    else start = end;
  }

  return { start, end };
}

export function getDateBoundsFromMonthlyStats(
  stats: Record<string, Record<string, unknown>>
): { start: string; end: string } | null {
  const dayKeys = Object.values(stats)
    .flatMap(month => Object.keys(month))
    .filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key))
    .sort();
  if (dayKeys.length === 0) return null;
  return { start: dayKeys[0], end: dayKeys[dayKeys.length - 1] };
}
