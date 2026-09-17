import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addCalendarDate,
  compareIsoDates,
  formatIsoToDisplay,
  getDaysInMonth,
  getWeekday,
  isLeapYear,
  isValidIsoDate,
  parseDisplayToIso
} from './date-only';

test('isLeapYear handles leap and non-leap years correctly', () => {
  assert.equal(isLeapYear(2024), true);
  assert.equal(isLeapYear(2000), true);
  assert.equal(isLeapYear(2025), false);
  assert.equal(isLeapYear(2100), false);
  assert.equal(isLeapYear(1900), false);
  assert.equal(isLeapYear(0), false);
  assert.equal(isLeapYear(-2024), false);
});

test('getDaysInMonth returns accurate days count', () => {
  assert.equal(getDaysInMonth(2024, 1), 31);
  assert.equal(getDaysInMonth(2024, 2), 29);
  assert.equal(getDaysInMonth(2025, 2), 28);
  assert.equal(getDaysInMonth(2024, 4), 30);
  assert.equal(getDaysInMonth(2024, 12), 31);
  assert.equal(getDaysInMonth(2024, 0), 0);
  assert.equal(getDaysInMonth(2024, 13), 0);
});

test('isValidIsoDate validates proper dates strictly', () => {
  assert.equal(isValidIsoDate('2026-09-17'), true);
  assert.equal(isValidIsoDate('2024-02-29'), true);
  assert.equal(isValidIsoDate('2025-02-29'), false);
  assert.equal(isValidIsoDate('2026-04-31'), false);
  assert.equal(isValidIsoDate('2026-13-01'), false);
  assert.equal(isValidIsoDate('0000-01-01'), false);
  assert.equal(isValidIsoDate(''), false);
  assert.equal(isValidIsoDate(null), false);
  assert.equal(isValidIsoDate(undefined), false);
  assert.equal(isValidIsoDate('not-a-date'), false);
});

test('formatIsoToDisplay converts ISO to DD/MM/YYYY or returns empty string', () => {
  assert.equal(formatIsoToDisplay('2026-09-17'), '17/09/2026');
  assert.equal(formatIsoToDisplay('2024-02-29'), '29/02/2024');
  assert.equal(formatIsoToDisplay('invalid'), '');
  assert.equal(formatIsoToDisplay(''), '');
  assert.equal(formatIsoToDisplay(null), '');
  assert.equal(formatIsoToDisplay(undefined), '');
});

test('parseDisplayToIso handles DD/MM/YYYY and DDMMYYYY', () => {
  assert.equal(parseDisplayToIso('17/09/2026'), '2026-09-17');
  assert.equal(parseDisplayToIso('17092026'), '2026-09-17');
  assert.equal(parseDisplayToIso('1/9/2026'), '2026-09-01');
  assert.equal(parseDisplayToIso(' 17/09/2026 '), '2026-09-17');
  assert.equal(parseDisplayToIso('29/02/2024'), '2024-02-29');

  // Invalid dates must return null, never rollover
  assert.equal(parseDisplayToIso('31/04/2026'), null);
  assert.equal(parseDisplayToIso('29/02/2025'), null);
  assert.equal(parseDisplayToIso('00/01/2026'), null);
  assert.equal(parseDisplayToIso('32/01/2026'), null);
  assert.equal(parseDisplayToIso('15/13/2026'), null);
  assert.equal(parseDisplayToIso(''), null);
  assert.equal(parseDisplayToIso(null), null);
  assert.equal(parseDisplayToIso(undefined), null);
});

test('addCalendarDate handles end-of-month and leap year clamping for month additions', () => {
  // 31/01/2024 + 1 month -> 29/02/2024 (leap year)
  assert.equal(addCalendarDate('2024-01-31', 1, 'month'), '2024-02-29');
  // 31/01/2025 + 1 month -> 28/02/2025 (non-leap year)
  assert.equal(addCalendarDate('2025-01-31', 1, 'month'), '2025-02-28');
  // 31/03/2024 + 1 month -> 30/04/2024
  assert.equal(addCalendarDate('2024-03-31', 1, 'month'), '2024-04-30');
  // 31/05/2024 - 1 month -> 30/04/2024
  assert.equal(addCalendarDate('2024-05-31', -1, 'month'), '2024-04-30');
  // Month addition crossing year boundary
  assert.equal(addCalendarDate('2026-11-15', 3, 'month'), '2027-02-15');
});

test('addCalendarDate handles end-of-month clamping for year additions', () => {
  // 29/02/2024 + 1 year -> 28/02/2025
  assert.equal(addCalendarDate('2024-02-29', 1, 'year'), '2025-02-28');
  // 29/02/2024 + 4 years -> 29/02/2028 (next leap year)
  assert.equal(addCalendarDate('2024-02-29', 4, 'year'), '2028-02-29');
  // Regular year addition
  assert.equal(addCalendarDate('2026-09-17', 2, 'year'), '2028-09-17');
});

test('addCalendarDate handles day additions across month and year boundaries', () => {
  assert.equal(addCalendarDate('2026-02-28', 1, 'day'), '2026-03-01');
  assert.equal(addCalendarDate('2024-02-28', 1, 'day'), '2024-02-29');
  assert.equal(addCalendarDate('2024-02-29', 1, 'day'), '2024-03-01');
  assert.equal(addCalendarDate('2026-12-31', 1, 'day'), '2027-01-01');
  assert.equal(addCalendarDate('2026-01-01', -1, 'day'), '2025-12-31');
  assert.equal(addCalendarDate('2026-09-17', 7, 'day'), '2026-09-24');
});

test('compareIsoDates correctly compares chronological order', () => {
  assert.equal(compareIsoDates('2026-01-01', '2026-01-02'), -1);
  assert.equal(compareIsoDates('2026-01-02', '2026-01-01'), 1);
  assert.equal(compareIsoDates('2026-01-01', '2026-01-01'), 0);
});

test('getWeekday is accurate without JavaScript year 0001-0099 rollover', () => {
  // 01/09/2026 is Tuesday; 06/09/2026 is Sunday.
  assert.equal(getWeekday(2026, 9, 1), 2);
  assert.equal(getWeekday(2026, 9, 6), 0);

  // 01/01/0001 is Monday in the proleptic Gregorian calendar.
  assert.equal(getWeekday(1, 1, 1), 1);
  assert.equal(getWeekday(2026, 2, 30), -1);
});
