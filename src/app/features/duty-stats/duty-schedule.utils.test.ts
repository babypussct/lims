import assert from 'node:assert/strict';
import test from 'node:test';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import {
  aggregateDutyPeopleById,
  aggregateDutyRosterById,
  computeDutyStaffRecommendations,
  countDutyAssignments,
  dutyAdjacentAssignment,
  dutyMonthCalendarDateKeys,
  dutyMonthDateKeys,
  dutyMonthRange,
  dutyRolling90Range,
  findLinkedDutyStaff,
  isDutyDateKey,
  resolveDutyStaffNames,
  shiftDutyDateKey,
} from './duty-schedule.utils';

const staff: DutyStaff[] = [
  { id: 'staff-accented', displayName: 'Huỳnh', linkedUserUid: null, active: true },
  { id: 'staff-plain', displayName: 'Huynh', linkedUserUid: 'uid-plain', active: true },
  { id: 'staff-dat', displayName: 'Đạt', linkedUserUid: null, active: false },
];

const schedules: DutyScheduleEntry[] = [
  { id: '2026-08-03', date: '2026-08-03', staffIds: ['staff-accented', 'staff-plain'], startTime: '18:00', status: 'planned' },
  { id: '2026-08-04', date: '2026-08-04', staffIds: ['staff-accented', 'staff-accented', 'staff-dat'], startTime: '18:00', status: 'planned' },
  { id: '2026-08-05', date: '2026-08-05', staffIds: ['staff-plain'], startTime: '18:00', status: 'cancelled' },
];

test('duty date helpers validate dates and month ranges', () => {
  assert.equal(isDutyDateKey('2026-02-28'), true);
  assert.equal(isDutyDateKey('2026-02-29'), false);
  assert.deepEqual(dutyMonthRange('2028-02'), { start: '2028-02-01', end: '2028-02-29' });
  assert.equal(shiftDutyDateKey('2026-09-01', -1), '2026-08-31');
  assert.equal(shiftDutyDateKey('2026-12-31', 1), '2027-01-01');
  assert.equal(dutyMonthDateKeys(2028, 2).length, 29);
  assert.deepEqual(dutyRolling90Range('2026-09-08'), { start: '2026-06-11', end: '2026-09-08' });
});

test('month calendar grid is Monday-first and padded to complete weeks', () => {
  const cells = dutyMonthCalendarDateKeys(2026, 9);
  assert.equal(cells.length % 7, 0);
  assert.deepEqual(cells.slice(0, 3), [null, '2026-09-01', '2026-09-02']);
  assert.equal(cells.filter(Boolean).length, 30);
});

test('adjacent duty warnings detect previous and next active assignments only', () => {
  const context: DutyScheduleEntry[] = [
    { id: '2026-08-31', date: '2026-08-31', staffIds: ['staff-accented'], startTime: '18:00', status: 'planned' },
    { id: '2026-09-02', date: '2026-09-02', staffIds: ['staff-accented'], startTime: '18:00', status: 'planned' },
    { id: '2026-09-02-cancelled', date: '2026-09-02', staffIds: ['staff-plain'], startTime: '18:00', status: 'cancelled' },
  ];
  assert.deepEqual(dutyAdjacentAssignment('2026-09-01', 'staff-accented', context), { previous: true, next: true });
  assert.deepEqual(dutyAdjacentAssignment('2026-09-01', 'staff-plain', context), { previous: false, next: false });
});

test('duty statistics stay identity-based for similar names', () => {
  const stats = aggregateDutyPeopleById(schedules, staff);
  assert.equal(countDutyAssignments(schedules), 4);
  assert.equal(stats.find(item => item.staffId === 'staff-accented')?.total, 2);
  assert.equal(stats.find(item => item.staffId === 'staff-plain')?.total, 1);
  assert.equal(stats.find(item => item.staffId === 'staff-dat')?.total, 1);
  assert.equal(stats.find(item => item.staffId === 'staff-accented')?.leadCount, 2);
  assert.equal(stats.find(item => item.staffId === 'staff-accented')?.weekendCount, 0);
  assert.deepEqual(resolveDutyStaffNames(schedules[0], staff), ['Huỳnh', 'Huynh']);
});

test('duty statistics count weekend assignments and lead responsibility independently', () => {
  const weekendSchedules: DutyScheduleEntry[] = [
    { id: 'sat', date: '2026-09-05', staffIds: ['staff-plain', 'staff-accented'], startTime: '18:00', status: 'planned' },
    { id: 'sun', date: '2026-09-06', staffIds: ['staff-accented', 'staff-plain'], startTime: '18:00', status: 'planned' },
  ];
  const stats = aggregateDutyPeopleById(weekendSchedules, staff);
  assert.equal(stats.find(item => item.staffId === 'staff-plain')?.weekendCount, 2);
  assert.equal(stats.find(item => item.staffId === 'staff-plain')?.leadCount, 1);
  assert.equal(stats.find(item => item.staffId === 'staff-accented')?.weekendCount, 2);
  assert.equal(stats.find(item => item.staffId === 'staff-accented')?.leadCount, 1);
});

test('rolling recommendations exclude the edited shift and apply four-tier workload rules', () => {
  const people: DutyStaff[] = [
    { id: 'a', displayName: 'A', active: true },
    { id: 'b', displayName: 'B', active: true },
    { id: 'c', displayName: 'C', active: true },
    { id: 'd', displayName: 'D', active: true },
    { id: 'e', displayName: 'E', active: true },
  ];
  const context: DutyScheduleEntry[] = [
    { id: '0901', date: '2026-09-01', staffIds: ['b', 'c', 'd', 'e'], startTime: '18:00', status: 'planned' },
    { id: '0902', date: '2026-09-02', staffIds: ['c', 'd', 'e'], startTime: '18:00', status: 'planned' },
    { id: '0903', date: '2026-09-03', staffIds: ['d', 'e'], startTime: '18:00', status: 'planned' },
    { id: '0904', date: '2026-09-04', staffIds: ['e'], startTime: '18:00', status: 'planned' },
    { id: '0905', date: '2026-09-05', staffIds: ['b', 'c', 'd', 'e'], startTime: '18:00', status: 'planned' },
    { id: '0906', date: '2026-09-06', staffIds: ['c', 'e'], startTime: '18:00', status: 'planned' },
    { id: '0907', date: '2026-09-07', staffIds: ['b', 'e'], startTime: '18:00', status: 'planned' },
    { id: '0820', date: '2026-08-20', staffIds: ['e'], startTime: '18:00', status: 'planned' },
    { id: '0821', date: '2026-08-21', staffIds: ['d'], startTime: '18:00', status: 'planned' },
    { id: '0908', date: '2026-09-08', staffIds: ['a'], startTime: '18:00', status: 'planned' },
  ];

  const recommendations = computeDutyStaffRecommendations('2026-09-08', context, people, '2026-09-08');
  const byId = new Map(recommendations.map(item => [item.staffId, item]));
  assert.equal(byId.get('a')?.total, 0);
  assert.equal(byId.get('a')?.tier, 'recommended');
  assert.equal(byId.get('b')?.tier, 'consider');
  assert.equal(byId.get('b')?.adjacentPrevious, true);
  assert.equal(byId.get('c')?.tier, 'balanced');
  assert.equal(byId.get('d')?.tier, 'consider');
  assert.equal(byId.get('e')?.tier, 'high');
  assert.equal(recommendations[0].staffId, 'a');
});

test('duty roster statistics keep active staff with zero assignments visible', () => {
  const roster = aggregateDutyRosterById(schedules, [
    ...staff,
    { id: 'staff-zero', displayName: 'Chưa trực', active: true },
    { id: 'staff-inactive-zero', displayName: 'Đã nghỉ', active: false },
  ]);

  assert.equal(roster.find(item => item.staffId === 'staff-zero')?.total, 0);
  assert.equal(roster.some(item => item.staffId === 'staff-inactive-zero'), false);
  assert.equal(roster.find(item => item.staffId === 'staff-dat')?.total, 1);
});

test('optional LIMS account linkage resolves independently from duty history', () => {
  assert.equal(findLinkedDutyStaff('uid-plain', staff)?.id, 'staff-plain');
  assert.equal(findLinkedDutyStaff('missing', staff), undefined);
  assert.equal(findLinkedDutyStaff(null, staff), undefined);
});
