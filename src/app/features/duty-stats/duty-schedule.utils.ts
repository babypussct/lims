import type {
  DutyMonthRange,
  DutyPersonStat,
  DutyScheduleEntry,
  DutyStaff,
} from './duty-schedule.model';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;

export function isDutyDateKey(value: string): boolean {
  if (!DATE_KEY_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function isDutyMonthKey(value: string): boolean {
  if (!MONTH_KEY_PATTERN.test(value)) return false;
  const month = Number(value.slice(5, 7));
  return month >= 1 && month <= 12;
}

export function dutyMonthRange(monthKey: string): DutyMonthRange {
  if (!isDutyMonthKey(monthKey)) throw new Error('Tháng lịch trực không hợp lệ.');
  const [year, month] = monthKey.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return {
    start: `${monthKey}-01`,
    end: `${monthKey}-${String(lastDay).padStart(2, '0')}`,
  };
}

export function dutyYearRange(year: number): DutyMonthRange {
  if (!Number.isInteger(year) || year < 2000 || year > 2200) {
    throw new Error('Năm lịch trực không hợp lệ.');
  }
  return { start: `${year}-01-01`, end: `${year}-12-31` };
}

export function currentDutyMonthKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function currentDutyDateKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function resolveDutyStaff(
  staffId: string,
  staff: readonly DutyStaff[],
): DutyStaff | undefined {
  return staff.find(item => item.id === staffId);
}

export function resolveDutyStaffNames(
  schedule: Pick<DutyScheduleEntry, 'staffIds'>,
  staff: readonly DutyStaff[],
): string[] {
  const byId = new Map(staff.map(item => [item.id, item]));
  return schedule.staffIds.map(staffId => byId.get(staffId)?.displayName || `[${staffId}]`);
}

export function activeDutySchedules(schedules: readonly DutyScheduleEntry[]): DutyScheduleEntry[] {
  return schedules.filter(item => item.status !== 'cancelled');
}

export function aggregateDutyPeopleById(
  schedules: readonly DutyScheduleEntry[],
  staff: readonly DutyStaff[],
): DutyPersonStat[] {
  const byStaffId = new Map(staff.map(item => [item.id, item]));
  const stats = new Map<string, {
    total: number;
    mondayCount: number;
    months: Set<string>;
    lastDate: string;
  }>();

  for (const schedule of activeDutySchedules(schedules)) {
    if (!isDutyDateKey(schedule.date)) continue;
    const weekday = new Date(`${schedule.date}T12:00:00+07:00`).getDay();
    const monthKey = schedule.date.slice(0, 7);
    for (const staffId of new Set(schedule.staffIds)) {
      const current = stats.get(staffId) || {
        total: 0,
        mondayCount: 0,
        months: new Set<string>(),
        lastDate: '',
      };
      current.total += 1;
      if (weekday === 1) current.mondayCount += 1;
      current.months.add(monthKey);
      if (!current.lastDate || schedule.date > current.lastDate) current.lastDate = schedule.date;
      stats.set(staffId, current);
    }
  }

  return [...stats.entries()].map(([staffId, value]) => {
    const person = byStaffId.get(staffId);
    return {
      staffId,
      displayName: person?.displayName || `[${staffId}]`,
      employeeCode: person?.employeeCode,
      linkedUserUid: person?.linkedUserUid,
      total: value.total,
      mondayCount: value.mondayCount,
      activeMonthCount: value.months.size,
      lastDate: value.lastDate,
    };
  }).sort((a, b) => b.total - a.total || a.displayName.localeCompare(b.displayName, 'vi'));
}

export function countDutyAssignments(schedules: readonly DutyScheduleEntry[]): number {
  return activeDutySchedules(schedules)
    .reduce((total, item) => total + new Set(item.staffIds).size, 0);
}

export function findLinkedDutyStaff(
  uid: string | null | undefined,
  staff: readonly DutyStaff[],
): DutyStaff | undefined {
  if (!uid) return undefined;
  return staff.find(item => item.linkedUserUid === uid);
}

export function normalizeDutyStaffCode(value: string | null | undefined): string {
  return (value || '').trim().toLocaleUpperCase('vi-VN');
}

export function normalizeDutyStaffName(value: string | null | undefined): string {
  return (value || '').trim().replace(/\s+/g, ' ');
}
