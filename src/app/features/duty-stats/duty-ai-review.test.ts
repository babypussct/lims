import assert from 'node:assert/strict';
import test from 'node:test';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import { computeDutyPersonalAnalytics, dutyProfileRange } from './duty-personal-analytics';
import { buildDutyAiPrompt, dutyAiDataFingerprint } from './duty-ai-review';

const staff: DutyStaff[] = [
  { id: 'a', displayName: 'An', active: true, linkedUserUid: 'private-user-uid' },
  { id: 'b', displayName: 'Bình', active: true },
];
const shifts: DutyScheduleEntry[] = [
  { id: '1', date: '2026-10-02', staffIds: ['a'], startTime: '18:00', status: 'planned' },
  { id: '2', date: '2026-10-05', staffIds: ['b'], startTime: '18:00', status: 'planned' },
];

test('AI prompt labels the precise staff, dates and comparison population without leaking account identifiers', () => {
  const range = dutyProfileRange('2026-10', 3);
  const report = computeDutyPersonalAnalytics(shifts, staff, 'a', range);
  assert.ok(report);
  const fingerprint = dutyAiDataFingerprint(shifts, staff, range);
  const prompt = buildDutyAiPrompt('a', 3, report, fingerprint);
  assert.match(prompt, /"staffId": "a"/);
  assert.match(prompt, /"staffName": "An"/);
  assert.match(prompt, /2026-08-01/);
  assert.match(prompt, /2026-10-31/);
  assert.match(prompt, /"teamAssignments": 2/);
  assert.match(prompt, /"personalAssignments": 1/);
  assert.match(prompt, /không chấm điểm nhân viên/);
  assert.doesNotMatch(prompt, /private-user-uid|linkedUserUid|@example\.com/);
});

test('AI review fingerprint changes when schedule or population changes but not when inputs reorder', () => {
  const range = dutyProfileRange('2026-10', 3);
  const baseline = dutyAiDataFingerprint(shifts, staff, range);
  assert.match(baseline, /^[a-f0-9]{8}$/);
  assert.equal(dutyAiDataFingerprint([...shifts].reverse(), [...staff].reverse(), range), baseline);
  assert.notEqual(dutyAiDataFingerprint(shifts.map(entry => entry.id === '1' ? { ...entry, staffIds: ['b'] } : entry), staff, range), baseline);
  assert.notEqual(dutyAiDataFingerprint(shifts, staff.map(person => ({ ...person, active: false })), range), baseline);
  assert.equal(dutyAiDataFingerprint([...shifts, { ...shifts[0], id: 'outside', date: '2026-07-01' }], staff, range), baseline);
});

test('AI prompt cannot accidentally reuse one staff member’s calculated totals for another', () => {
  const range = dutyProfileRange('2026-10', 3);
  const a = computeDutyPersonalAnalytics(shifts, staff, 'a', range);
  const b = computeDutyPersonalAnalytics(shifts, staff, 'b', range);
  assert.ok(a && b);
  const fingerprint = dutyAiDataFingerprint(shifts, staff, range);
  assert.match(buildDutyAiPrompt('b', 3, b, fingerprint), /"staffName": "Bình"/);
  assert.doesNotMatch(buildDutyAiPrompt('b', 3, b, fingerprint), /"staffName": "An"/);
});
