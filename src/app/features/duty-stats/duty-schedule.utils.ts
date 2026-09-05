import type {
  DutyMonthRange,
  DutyPersonStat,
  DutyScheduleEntry,
  DutyStaff,
  DutyStaffRecommendation,
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

export function dutyRolling90Range(dateKey: string): DutyMonthRange {
  if (!isDutyDateKey(dateKey)) throw new Error('Ngày lịch trực không hợp lệ.');
  return { start: shiftDutyDateKey(dateKey, -89), end: dateKey };
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

export function shiftDutyDateKey(dateKey: string, dayOffset: number): string {
  if (!isDutyDateKey(dateKey) || !Number.isInteger(dayOffset)) {
    throw new Error('Ngày lịch trực hoặc độ lệch ngày không hợp lệ.');
  }
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + dayOffset));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function dutyMonthDateKeys(year: number, month: number): string[] {
  if (!Number.isInteger(year) || year < 2000 || year > 2200 || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Tháng lịch trực không hợp lệ.');
  }
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: days }, (_, index) => `${monthKey}-${String(index + 1).padStart(2, '0')}`);
}

export function dutyMonthCalendarDateKeys(year: number, month: number): (string | null)[] {
  const dates = dutyMonthDateKeys(year, month);
  const [firstYear, firstMonth, firstDay] = dates[0].split('-').map(Number);
  const firstWeekday = new Date(Date.UTC(firstYear, firstMonth - 1, firstDay)).getUTCDay();
  const leadingBlankCount = (firstWeekday + 6) % 7;
  const cellCount = Math.ceil((leadingBlankCount + dates.length) / 7) * 7;
  return Array.from({ length: cellCount }, (_, index) => {
    const dateIndex = index - leadingBlankCount;
    return dateIndex >= 0 && dateIndex < dates.length ? dates[dateIndex] : null;
  });
}

export function dutyAdjacentAssignment(
  dateKey: string,
  staffId: string,
  schedules: readonly DutyScheduleEntry[],
): { previous: boolean; next: boolean } {
  if (!staffId || !isDutyDateKey(dateKey)) return { previous: false, next: false };
  const previousDate = shiftDutyDateKey(dateKey, -1);
  const nextDate = shiftDutyDateKey(dateKey, 1);
  const assignedDates = new Set(
    activeDutySchedules(schedules)
      .filter(item => item.staffIds.includes(staffId))
      .map(item => item.date),
  );
  return {
    previous: assignedDates.has(previousDate),
    next: assignedDates.has(nextDate),
  };
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
    weekendCount: number;
    leadCount: number;
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
        weekendCount: 0,
        leadCount: 0,
        months: new Set<string>(),
        lastDate: '',
      };
      current.total += 1;
      if (weekday === 1) current.mondayCount += 1;
      if (weekday === 0 || weekday === 6) current.weekendCount += 1;
      if (schedule.staffIds[0] === staffId) current.leadCount += 1;
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
      linkedUserUid: person?.linkedUserUid,
      total: value.total,
      mondayCount: value.mondayCount,
      weekendCount: value.weekendCount,
      leadCount: value.leadCount,
      activeMonthCount: value.months.size,
      lastDate: value.lastDate,
    };
  }).sort((a, b) => b.total - a.total || a.displayName.localeCompare(b.displayName, 'vi'));
}

export function aggregateDutyRosterById(
  schedules: readonly DutyScheduleEntry[],
  staff: readonly DutyStaff[],
): DutyPersonStat[] {
  const aggregated = aggregateDutyPeopleById(schedules, staff);
  const byStaffId = new Map(aggregated.map(item => [item.staffId, item]));

  for (const person of staff) {
    if (!person.active || byStaffId.has(person.id)) continue;
    byStaffId.set(person.id, {
      staffId: person.id,
      displayName: person.displayName,
      linkedUserUid: person.linkedUserUid,
      total: 0,
      mondayCount: 0,
      weekendCount: 0,
      leadCount: 0,
      activeMonthCount: 0,
      lastDate: '',
    });
  }

  return [...byStaffId.values()]
    .sort((a, b) => b.total - a.total || a.displayName.localeCompare(b.displayName, 'vi'));
}

export function computeDutyStaffRecommendations(
  targetDateKey: string,
  schedules: readonly DutyScheduleEntry[],
  staff: readonly DutyStaff[],
  excludeDateKey?: string,
): DutyStaffRecommendation[] {
  if (!isDutyDateKey(targetDateKey)) return [];
  const activeStaff = staff.filter(person => person.active);
  if (activeStaff.length === 0) return [];

  const range = dutyRolling90Range(targetDateKey);
  const baseline = schedules.filter(schedule =>
    schedule.date >= range.start
    && schedule.date <= range.end
    && schedule.date !== excludeDateKey,
  );
  const roster = aggregateDutyRosterById(baseline, activeStaff);
  const average = countDutyAssignments(baseline) / activeStaff.length;
  const tierRank = { recommended: 1, balanced: 2, consider: 3, high: 4 } as const;

  return roster.map(stat => {
    const deviationPercent = average === 0 ? 0 : ((stat.total - average) / average) * 100;
    const adjacent = dutyAdjacentAssignment(targetDateKey, stat.staffId, schedules);
    const hasAdjacent = adjacent.previous || adjacent.next;
    const tier = deviationPercent > 35
      ? 'high'
      : hasAdjacent || deviationPercent > 15
        ? 'consider'
        : deviationPercent >= -15
          ? 'balanced'
          : 'recommended';

    return {
      ...stat,
      deviationPercent,
      tier,
      adjacentPrevious: adjacent.previous,
      adjacentNext: adjacent.next,
    } as DutyStaffRecommendation;
  }).sort((a, b) =>
    tierRank[a.tier] - tierRank[b.tier]
    || a.total - b.total
    || a.weekendCount - b.weekendCount
    || a.leadCount - b.leadCount
    || a.displayName.localeCompare(b.displayName, 'vi'),
  );
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

export function normalizeDutyStaffName(value: string | null | undefined): string {
  return (value || '').trim().replace(/\s+/g, ' ');
}
