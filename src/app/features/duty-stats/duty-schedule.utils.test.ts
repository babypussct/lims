import assert from 'node:assert/strict';
import test from 'node:test';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import {
  aggregateDutyPeopleById,
  countDutyAssignments,
  dutyMonthRange,
  findLinkedDutyStaff,
  isDutyDateKey,
  resolveDutyStaffNames,
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
});

test('duty statistics stay identity-based for similar names', () => {
  const stats = aggregateDutyPeopleById(schedules, staff);
  assert.equal(countDutyAssignments(schedules), 4);
  assert.equal(stats.find(item => item.staffId === 'staff-accented')?.total, 2);
  assert.equal(stats.find(item => item.staffId === 'staff-plain')?.total, 1);
  assert.equal(stats.find(item => item.staffId === 'staff-dat')?.total, 1);
  assert.deepEqual(resolveDutyStaffNames(schedules[0], staff), ['Huỳnh', 'Huynh']);
});

test('optional LIMS account linkage resolves independently from duty history', () => {
  assert.equal(findLinkedDutyStaff('uid-plain', staff)?.id, 'staff-plain');
  assert.equal(findLinkedDutyStaff('missing', staff), undefined);
  assert.equal(findLinkedDutyStaff(null, staff), undefined);
});
