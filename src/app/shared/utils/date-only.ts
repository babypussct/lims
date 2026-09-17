export interface CalendarDateParts {
  year: number;
  month: number;
  day: number;
}

export function isLeapYear(year: number): boolean {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return false;
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function getDaysInMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return 0;
  if (!Number.isInteger(month) || month < 1 || month > 12) return 0;
  if (month === 2 && isLeapYear(year)) return 29;
  return DAYS_IN_MONTH[month - 1];
}

export function parseIsoDateParts(iso: string | null | undefined): CalendarDateParts | null {
  if (!iso || typeof iso !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1 || year > 9999) return null;
  if (month < 1 || month > 12) return null;
  const maxDays = getDaysInMonth(year, month);
  if (day < 1 || day > maxDays) return null;

  return { year, month, day };
}

export function isValidIsoDate(iso: string | null | undefined): boolean {
  return parseIsoDateParts(iso) !== null;
}

export function formatPartsToIso(parts: CalendarDateParts): string {
  const y = String(parts.year).padStart(4, '0');
  const m = String(parts.month).padStart(2, '0');
  const d = String(parts.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatPartsToDisplay(parts: CalendarDateParts): string {
  const y = String(parts.year).padStart(4, '0');
  const m = String(parts.month).padStart(2, '0');
  const d = String(parts.day).padStart(2, '0');
  return `${d}/${m}/${y}`;
}

export function formatIsoToDisplay(iso: string | null | undefined): string {
  const parts = parseIsoDateParts(iso);
  if (!parts) return '';
  return formatPartsToDisplay(parts);
}

/**
 * Return the day of week using the JavaScript convention (0 = Sunday ... 6 = Saturday).
 * The calculation is deliberately Date-free so years 0001-0099 do not receive
 * JavaScript's special 1900-based interpretation.
 */
export function getWeekday(year: number, month: number, day: number): number {
  const maxDays = getDaysInMonth(year, month);
  if (maxDays === 0 || !Number.isInteger(day) || day < 1 || day > maxDays) return -1;
  return (datePartsToJulianDay(year, month, day) + 1) % 7;
}

export function parseDisplayToIso(display: string | null | undefined): string | null {
  if (!display || typeof display !== 'string') return null;
  const clean = display.trim();

  let match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(clean);
  if (!match) {
    match = /^(\d{2})(\d{2})(\d{4})$/.exec(clean);
  }
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (year < 1 || year > 9999) return null;
  if (month < 1 || month > 12) return null;
  const maxDays = getDaysInMonth(year, month);
  if (day < 1 || day > maxDays) return null;

  return formatPartsToIso({ year, month, day });
}

function datePartsToJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function julianDayToDateParts(jd: number): CalendarDateParts {
  const a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

export function addCalendarDate(baseIso: string, amount: number, unit: 'day' | 'month' | 'year'): string {
  const parts = parseIsoDateParts(baseIso);
  if (!parts) return baseIso;
  if (amount === 0) return baseIso;

  if (unit === 'day') {
    const jd = datePartsToJulianDay(parts.year, parts.month, parts.day);
    const newParts = julianDayToDateParts(jd + amount);
    if (newParts.year < 1 || newParts.year > 9999) return baseIso;
    return formatPartsToIso(newParts);
  }

  if (unit === 'month') {
    const targetMonthIndex = (parts.month - 1) + amount;
    const targetYear = parts.year + Math.floor(targetMonthIndex / 12);
    if (targetYear < 1 || targetYear > 9999) return baseIso;
    const targetMonth = ((targetMonthIndex % 12) + 12) % 12 + 1;
    const maxDays = getDaysInMonth(targetYear, targetMonth);
    const targetDay = Math.min(parts.day, maxDays);
    return formatPartsToIso({ year: targetYear, month: targetMonth, day: targetDay });
  }

  if (unit === 'year') {
    const targetYear = parts.year + amount;
    if (targetYear < 1 || targetYear > 9999) return baseIso;
    const maxDays = getDaysInMonth(targetYear, parts.month);
    const targetDay = Math.min(parts.day, maxDays);
    return formatPartsToIso({ year: targetYear, month: parts.month, day: targetDay });
  }

  return baseIso;
}

export function compareIsoDates(left: string, right: string): -1 | 0 | 1 {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

export function getTodayIso(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return formatPartsToIso({ year, month, day });
}
