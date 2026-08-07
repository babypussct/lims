import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createInclusiveDateRange,
  enumerateInclusiveDates,
  getDateBoundsFromMonthlyStats,
  normalizeManualDateRange,
  toLocalDateKey
} from './date-range';

test('today is one inclusive day', () => {
  const range = createInclusiveDateRange('2026-08-07', '2026-08-07');
  assert.ok(range);
  assert.equal(range.days, 1);
  assert.deepEqual(enumerateInclusiveDates(range).map(toLocalDateKey), ['2026-08-07']);
});

test('seven-day range includes both endpoints', () => {
  const range = createInclusiveDateRange('2026-08-01', '2026-08-07');
  assert.ok(range);
  assert.equal(range.days, 7);
  assert.deepEqual(enumerateInclusiveDates(range).map(toLocalDateKey), [
    '2026-08-01',
    '2026-08-02',
    '2026-08-03',
    '2026-08-04',
    '2026-08-05',
    '2026-08-06',
    '2026-08-07'
  ]);
});

test('reversed range is rejected by the shared range helper', () => {
  assert.equal(createInclusiveDateRange('2026-08-07', '2026-08-01'), null);
});

test('manual edits normalize the opposite endpoint instead of emitting a reversed range', () => {
  assert.deepEqual(
    normalizeManualDateRange('start', '2026-08-10', '2026-08-01', '2026-08-07'),
    { start: '2026-08-10', end: '2026-08-10' }
  );
  assert.deepEqual(
    normalizeManualDateRange('end', '2026-07-31', '2026-08-01', '2026-08-07'),
    { start: '2026-07-31', end: '2026-07-31' }
  );
});

test('all-time bounds come from the complete monthly stats history', () => {
  assert.deepEqual(
    getDateBoundsFromMonthlyStats({
      '2026-08': { '2026-08-07': {} },
      '2025-12': { '2025-12-31': {}, '2025-12-30': {} },
      'metadata': { version: 1 }
    }),
    { start: '2025-12-30', end: '2026-08-07' }
  );
  assert.equal(getDateBoundsFromMonthlyStats({}), null);
});

test('long inclusive ranges are not capped at 90 days', () => {
  const range = createInclusiveDateRange('2026-01-01', '2026-08-07');
  assert.ok(range);
  assert.equal(range.days, 219);
  const dates = enumerateInclusiveDates(range);
  assert.equal(toLocalDateKey(dates[0]), '2026-01-01');
  assert.equal(toLocalDateKey(dates.at(-1)!), '2026-08-07');
});
