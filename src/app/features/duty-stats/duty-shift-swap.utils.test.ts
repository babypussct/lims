import assert from 'node:assert/strict';
import test from 'node:test';
import type { DutyScheduleEntry } from './duty-schedule.model';
import { dutyShiftSnapshot, dutyShiftSnapshotMatches, replaceDutyStaffAtExactIndex } from './duty-shift-swap.utils';

const schedule: DutyScheduleEntry = {
  id: '2026-09-15',
  date: '2026-09-15',
  staffIds: ['lead', 'a', 'b'],
  unresolvedAssignees: ['?'],
  needsVerification: true,
  sourceAssignees: 'Lead | A | B | ?',
  startTime: '18:00',
  status: 'planned',
  note: 'ghi chú',
  source: 'import',
};

test('shift snapshot includes unresolved and verification state for concurrency checks', () => {
  const snapshot = dutyShiftSnapshot(schedule);
  assert.deepEqual(snapshot.unresolvedAssignees, ['?']);
  assert.equal(snapshot.needsVerification, true);
  assert.equal(dutyShiftSnapshotMatches(snapshot, schedule), true);
  assert.equal(dutyShiftSnapshotMatches(snapshot, { ...schedule, note: 'đã đổi' }), false);
});

test('exact-index replacement preserves lead and collaborator positions', () => {
  assert.deepEqual(replaceDutyStaffAtExactIndex(['lead', 'a', 'b'], 'lead', 'd'), ['d', 'a', 'b']);
  assert.deepEqual(replaceDutyStaffAtExactIndex(['lead', 'a', 'b'], 'a', 'd'), ['lead', 'd', 'b']);
  assert.throws(() => replaceDutyStaffAtExactIndex(['lead', 'a'], 'missing', 'd'));
  assert.throws(() => replaceDutyStaffAtExactIndex(['lead', 'a'], 'a', 'lead'));
});
