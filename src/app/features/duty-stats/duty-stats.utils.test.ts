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
  assert.equal(normalizeDutyPerson('Dĩ'), 'Dĩ');
  assert.equal(normalizeDutyPerson('Dì'), 'Dĩ');
  assert.equal(normalizeDutyPerson('Bên'), 'Bến');
  assert.equal(normalizeDutyPerson('Bến'), 'Bến');
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
      people: ['Tâm', 'Dĩ'],
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

test('embedded duty schedule exactly matches the verified 14-image transcription totals', () => {
  assert.equal(DUTY_SCHEDULE_DATA.sourceFiles.length, 14);
  assert.equal(DUTY_SCHEDULE_DATA.unresolvedFragments.length, 0);
  assert.equal(DUTY_SCHEDULE_DATA.shifts.length, 295);
  assert.equal(countDutyAssignments(DUTY_SCHEDULE_DATA.shifts), 643);
  assert.deepEqual(
    aggregateDutyMonths(DUTY_SCHEDULE_DATA.shifts).map(month => [
      month.monthKey,
      month.shiftCount,
      month.assignmentCount,
    ]),
    [
      ['2025-06', 21, 42],
      ['2025-07', 23, 46],
      ['2025-08', 21, 42],
      ['2025-10', 23, 46],
      ['2025-11', 20, 40],
      ['2025-12', 23, 46],
      ['2026-01', 21, 42],
      ['2026-02', 14, 28],
      ['2026-03', 22, 51],
      ['2026-04', 21, 63],
      ['2026-05', 20, 60],
      ['2026-06', 22, 44],
      ['2026-07', 23, 46],
      ['2026-08', 21, 47],
    ],
  );
});

test('embedded duty schedule retains boundary, Saturday, three-person and identity-sensitive shifts', () => {
  const byDate = new Map(DUTY_SCHEDULE_DATA.shifts.map(shift => [shift.date, shift.people]));

  assert.deepEqual(byDate.get('2025-06-16'), ['Sơn', 'Bến']);
  assert.deepEqual(byDate.get('2025-12-16'), ['H.Anh', 'Khôi']);
  assert.deepEqual(byDate.get('2026-01-10'), ['Đạt (N)', 'Dĩ']);
  assert.deepEqual(byDate.get('2026-03-25'), ['Phương', 'Khôi', 'Việt']);
  assert.deepEqual(byDate.get('2026-04-01'), ['Hồ', 'Phong', 'Bến']);
  assert.deepEqual(byDate.get('2026-06-16'), ['Đạt (O)', 'Đạt (N)']);
  assert.deepEqual(byDate.get('2026-06-24'), ['Đạt (O)', 'Đạt (N)']);
  assert.deepEqual(byDate.get('2026-08-03'), ['Sơn', 'Tâm', 'Huynh']);
  assert.deepEqual(byDate.get('2026-08-04'), ['Hồ', 'Huỳnh']);
  assert.deepEqual(byDate.get('2026-08-31'), ['Sơn', 'Khôi', 'Huynh']);
});

test('embedded duty schedule has unique dates, valid people counts and matching image provenance', () => {
  const sourceByMonth: Record<string, string> = {
    '2025-06': 't6 2025.jpg',
    '2025-07': 't7 2025.jpg',
    '2025-08': 't8 2025.jpg',
    '2025-10': 't10 2025.jpg',
    '2025-11': 't11 2025.jpg',
    '2025-12': 't12 2025.jpg',
    '2026-01': 't1 2026.jpg',
    '2026-02': 't2 2026.jpg',
    '2026-03': 't3 2026.jpg',
    '2026-04': 't4 2026.jpg',
    '2026-05': 't5 2026.jpg',
    '2026-06': 't6 2026.jpg',
    '2026-07': 't7 2026.jpg',
    '2026-08': 't8 2026.jpg',
  };
  const expectedPeople = new Set([
    'Bến', 'Chương', 'Dĩ', 'Đạt (N)', 'Đạt (O)', 'H.Anh', 'Hồ', 'Huynh',
    'Huỳnh', 'Khôi', 'Minh', 'Nghĩa', 'Nhã', 'Phong', 'Phương', 'Sơn',
    'Tâm', 'Thành', 'Thiệt', 'Trãi', 'Việt',
  ]);
  const dates = DUTY_SCHEDULE_DATA.shifts.map(shift => shift.date);

  assert.equal(new Set(dates).size, dates.length);
  assert.deepEqual(dates, [...dates].sort());
  for (const shift of DUTY_SCHEDULE_DATA.shifts) {
    assert.equal(shift.sourceFile, sourceByMonth[shift.date.slice(0, 7)]);
    assert.ok(shift.people.length === 2 || shift.people.length === 3);
    assert.equal(new Set(shift.people).size, shift.people.length);
    assert.ok(shift.people.every(person => expectedPeople.has(person)));
  }
});
