import type { DutyScheduleEntry } from './duty-schedule.model';
import type { DutyShiftSnapshot, DutyScheduleForSwap } from './duty-shift-swap.model';

export function dutyShiftSnapshot(schedule: DutyScheduleForSwap): DutyShiftSnapshot {
  return {
    date: schedule.date,
    staffIds: [...schedule.staffIds],
    unresolvedAssignees: [...(schedule.unresolvedAssignees || [])],
    needsVerification: schedule.needsVerification === true,
    sourceAssignees: schedule.sourceAssignees || '',
    startTime: schedule.startTime || '18:00',
    status: schedule.status,
    note: schedule.note || '',
    source: schedule.source === 'import' || schedule.source === 'batch' ? schedule.source : 'manual',
  };
}

export function dutyShiftSnapshotMatches(snapshot: DutyShiftSnapshot, schedule: DutyScheduleForSwap): boolean {
  return JSON.stringify(snapshot) === JSON.stringify(dutyShiftSnapshot(schedule));
}

export function replaceDutyStaffAtExactIndex(
  staffIds: readonly string[],
  outgoingStaffId: string,
  incomingStaffId: string,
): string[] {
  const index = staffIds.indexOf(outgoingStaffId);
  if (index < 0) throw new Error('Người cần đổi không còn trong ca trực hiện tại.');
  if (outgoingStaffId !== incomingStaffId && staffIds.includes(incomingStaffId)) {
    throw new Error('Người nhận ca đã có trong ca trực này.');
  }
  const next = [...staffIds];
  next[index] = incomingStaffId;
  return next;
}

export function dutySwapExpiresAtMillis(value: unknown): number {
  if (value && typeof value === 'object' && 'toMillis' in value && typeof (value as { toMillis?: unknown }).toMillis === 'function') {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (value instanceof Date) return value.getTime();
  return typeof value === 'number' ? value : 0;
}

export function isDutySwapExpired(value: unknown, now = Date.now()): boolean {
  const expiresAt = dutySwapExpiresAtMillis(value);
  return expiresAt > 0 && expiresAt <= now;
}

export function asDutyScheduleEntry(id: string, data: Record<string, unknown>): DutyScheduleEntry {
  return { id, ...data } as DutyScheduleEntry;
}
