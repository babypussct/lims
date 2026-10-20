import assert from 'node:assert/strict';
import test from 'node:test';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import { computeDutyPersonalAnalytics, dutyProfileRange } from './duty-personal-analytics';

const staff: DutyStaff[] = [
  { id: 'a', displayName: 'A', active: true },
  { id: 'b', displayName: 'B', active: true },
];
const shift = (date: string, staffIds: string[], status: 'planned' | 'cancelled' = 'planned'): DutyScheduleEntry =>
  ({ id: date, date, staffIds, startTime: '18:00', status });

test('personal profile windows respect year boundaries and month length', () => {
  assert.deepEqual(dutyProfileRange('2026-01', 3), { start: '2025-11-01', end: '2026-01-31' });
  assert.deepEqual(dutyProfileRange('2024-02', 6), { start: '2023-09-01', end: '2024-02-29' });
  assert.deepEqual(dutyProfileRange('2026-10', 'all'), { start: '2000-01-01', end: '2026-10-31' });
  assert.throws(() => dutyProfileRange('2026-13', 3));
});

test('each staff assignment is counted once per active date, cancelled shifts do not affect totals', () => {
  const schedules = [
    shift('2026-10-01', ['a', 'a', 'b']),
    shift('2026-10-02', ['a', 'b'], 'cancelled'),
    shift('2026-10-03', ['a']),
    shift('2026-10-04', ['b']),
  ];
  const report = computeDutyPersonalAnalytics(schedules, staff, 'a', dutyProfileRange('2026-10', 3));
  assert.ok(report);
  assert.equal(report.total, 2);
  assert.equal(report.teamTotal, 4);
  assert.equal(report.teamSize, 2);
  assert.equal(report.teamAverage, 2);
  assert.equal(report.sharePercent, 50);
  assert.equal(report.weekendCount, 1);
  assert.equal(report.leadCount, 2);
  assert.equal(report.medianGapDays, 2);
  assert.equal(report.consecutivePairs, 0);
  assert.equal(report.days.find(item => item.date === '2026-10-03')?.count, 1);
  assert.ok(report.insights.some(item => item.title === 'Tỷ trọng trong phòng'));
});

test('empty months remain in historical trend; clustered assignments are flagged', () => {
  const schedules = [shift('2026-01-31', ['a']), shift('2026-02-01', ['a']), shift('2026-04-05', ['b'])];
  const report = computeDutyPersonalAnalytics(schedules, staff, 'a', dutyProfileRange('2026-04', 6));
  assert.ok(report);
  assert.deepEqual(report.monthly.map(month => month.key), [
    '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04',
  ]);
  assert.equal(report.monthly[4].actual, 0);
  assert.equal(report.monthly[4].sharePercent, 0);
  assert.equal(report.consecutivePairs, 1);
  assert.equal(report.shortestGapDays, 1);
  assert.equal(report.medianGapDays, 1);
  assert.ok(report.insights.some(item => item.title === 'Các ca sát nhau'));
});

test('an unassigned linked person is shown with zero activity, not a fabricated fairness score', () => {
  const report = computeDutyPersonalAnalytics([shift('2026-10-01', ['b'])], staff, 'a', dutyProfileRange('2026-10', 3));
  assert.ok(report);
  assert.equal(report.total, 0);
  assert.equal(report.expected, null);
  assert.equal(report.deviationPercent, null);
  assert.equal(report.shortestGapDays, null);
  assert.equal(report.days.every(item => item.count === 0), true);
  assert.ok(report.insights.some(item => item.title === 'Chưa đủ cơ sở tính kỳ vọng'));
});

test('all-history trend begins at first recorded month and no-data periods are explained', () => {
  const report = computeDutyPersonalAnalytics([shift('2025-12-31', ['a'])], staff, 'a', dutyProfileRange('2026-02', 'all'));
  assert.ok(report);
  assert.deepEqual(report.monthly.map(month => month.key), ['2025-12', '2026-01', '2026-02']);
  const empty = computeDutyPersonalAnalytics([], staff, 'a', dutyProfileRange('2026-10', 3));
  assert.ok(empty);
  assert.equal(empty.teamTotal, 0);
  assert.equal(empty.insights[0].title, 'Chưa có dữ liệu');
  const emptyHistory = computeDutyPersonalAnalytics([], staff, 'a', dutyProfileRange('2026-10', 'all'));
  assert.equal(emptyHistory?.weekly.length, 1);
  assert.equal(computeDutyPersonalAnalytics([], staff, 'missing', dutyProfileRange('2026-10', 3)), null);
});
