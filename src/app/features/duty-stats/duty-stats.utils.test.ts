import assert from 'node:assert/strict';
import test from 'node:test';
import { DUTY_SCHEDULE_DATA } from './duty-schedule.data';
import {
  aggregateDutyMonths,
  aggregateDutyPeople,
  countDutyAssignments,
  filterDutyShifts,
  normalizeDutyPerson,
  parseDutyScheduleOcr,
} from './duty-stats.utils';

test('duty OCR aliases preserve distinct staff identities while normalizing known OCR variants', () => {
  assert.equal(normalizeDutyPerson('Hô'), 'Hồ');
  assert.equal(normalizeDutyPerson('Son,'), 'Sơn');
  assert.equal(normalizeDutyPerson('Huỳnh'), 'Huỳnh');
  assert.equal(normalizeDutyPerson('Huynh'), 'Huynh');
  assert.equal(normalizeDutyPerson('Huwnh'), 'Huỳnh');
  assert.equal(normalizeDutyPerson('HAnh'), 'H.Anh');
  assert.equal(normalizeDutyPerson('Chưmme'), 'Chương');
  assert.equal(normalizeDutyPerson('Tâm 2'), 'Tâm');
  assert.equal(normalizeDutyPerson('Đạt'), 'Đạt');
  assert.equal(normalizeDutyPerson('Đat(N)'), 'Đạt (N)');
  assert.equal(normalizeDutyPerson('Đat(Q))'), 'Đạt (O)');
});

test('duty OCR parser retains source provenance and handles the combined Dat O/N cell', () => {
  const parsed = parseDutyScheduleOcr([
    '### t6 2026.jpg',
    '2026-06-24\t02 Đat | (0&N)',
    '2026-06-25\tTâm & | Di',
  ].join('\n'));

  assert.deepEqual(parsed.sourceFiles, ['t6 2026.jpg']);
  assert.deepEqual(parsed.shifts, [
    {
      date: '2026-06-24',
      people: ['Đạt (O)', 'Đạt (N)'],
      sourceFile: 't6 2026.jpg',
      rawText: '02 Đat | (0&N)',
    },
    {
      date: '2026-06-25',
      people: ['Tâm', 'Di'],
      sourceFile: 't6 2026.jpg',
      rawText: 'Tâm & | Di',
    },
  ]);
});

test('duty filters support year, month and person together', () => {
  const shifts = parseDutyScheduleOcr([
    '### a.jpg',
    '2025-08-04\tPhong & | H.Anh',
    '2026-08-05\tPhong & | Phương',
    '2026-09-07\tHồ & | Phong',
  ].join('\n')).shifts;

  assert.deepEqual(
    filterDutyShifts(shifts, { year: 2026, month: 8, person: 'Phong' }).map(item => item.date),
    ['2026-08-05'],
  );
});

test('duty aggregation counts assignments, Monday duties, active months and monthly totals', () => {
  const shifts = parseDutyScheduleOcr([
    '### a.jpg',
    '2026-08-03\tSơn & | Tâm',
    '2026-08-04\tHồ & | Tâm',
    '2026-09-07\tTâm & | Phong',
  ].join('\n')).shifts;

  assert.equal(countDutyAssignments(shifts), 6);
  const people = aggregateDutyPeople(shifts);
  assert.deepEqual(people.find(item => item.name === 'Tâm'), {
    name: 'Tâm',
    count: 3,
    mondayCount: 2,
    monthCount: 2,
    lastDate: '2026-09-07',
  });
  assert.deepEqual(aggregateDutyMonths(shifts), [
    { monthKey: '2026-08', shiftCount: 2, assignmentCount: 4, peopleCount: 3 },
    { monthKey: '2026-09', shiftCount: 1, assignmentCount: 2, peopleCount: 2 },
  ]);
});

test('embedded duty schedule contains all 14 source images and no unresolved OCR fragments', () => {
  assert.equal(DUTY_SCHEDULE_DATA.sourceFiles.length, 14);
  assert.equal(DUTY_SCHEDULE_DATA.unresolvedFragments.length, 0);
  assert.ok(DUTY_SCHEDULE_DATA.shifts.length > 200);
  assert.ok(countDutyAssignments(DUTY_SCHEDULE_DATA.shifts) > DUTY_SCHEDULE_DATA.shifts.length);
});
