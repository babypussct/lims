import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import {
  activeDutySchedules,
  aggregateDutyRosterById,
  dutyIsoWeekDays,
  dutyMonthRange,
  isDutyDateKey,
  isDutyMonthKey,
  shiftDutyDateKey,
} from './duty-schedule.utils';

export type DutyProfileWindow = 3 | 6 | 12 | 'all';

export interface DutyProfileMonth {
  key: string;
  actual: number;
  teamAverage: number;
  expected: number | null;
  sharePercent: number;
  totalAssignments: number;
}

export interface DutyProfileDay {
  date: string;
  count: number;
  weekend: boolean;
}

export interface DutyProfileWeek {
  start: string;
  actual: number;
  teamAverage: number;
  totalAssignments: number;
  sharePercent: number;
}

export interface DutyProfileInsight {
  title: string;
  detail: string;
  tone: 'neutral' | 'positive' | 'attention';
}

export interface DutyPersonalAnalytics {
  staffName: string;
  start: string;
  end: string;
  total: number;
  teamTotal: number;
  teamSize: number;
  teamAverage: number;
  sharePercent: number;
  expected: number | null;
  deviationPercent: number | null;
  weekendCount: number;
  teamWeekendCount: number;
  leadCount: number;
  consecutivePairs: number;
  shortestGapDays: number | null;
  medianGapDays: number | null;
  monthly: DutyProfileMonth[];
  weekly: DutyProfileWeek[];
  days: DutyProfileDay[];
  insights: DutyProfileInsight[];
}

function monthOffset(monthKey: string, offset: number): string {
  const [year, month] = monthKey.split('-').map(Number);
  const result = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${result.getUTCFullYear()}-${String(result.getUTCMonth() + 1).padStart(2, '0')}`;
}

function dayIndex(key: string): number {
  const [year, month, day] = key.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

export function dutyProfileRange(endMonth: string, window: DutyProfileWindow): { start: string; end: string } {
  if (!isDutyMonthKey(endMonth)) throw new Error('Tháng kết thúc không hợp lệ.');
  return {
    start: window === 'all' ? '2000-01-01' : `${monthOffset(endMonth, 1 - window)}-01`,
    end: dutyMonthRange(endMonth).end,
  };
}

/** All figures count assigned people, not shifts or worked hours. Invalid and cancelled dates are excluded. */
export function computeDutyPersonalAnalytics(
  allSchedules: readonly DutyScheduleEntry[],
  staff: readonly DutyStaff[],
  staffId: string,
  range: { start: string; end: string },
): DutyPersonalAnalytics | null {
  const person = staff.find(item => item.id === staffId);
  if (!person || !isDutyDateKey(range.start) || !isDutyDateKey(range.end) || range.start > range.end) return null;

  const schedules = activeDutySchedules(allSchedules).filter(item =>
    isDutyDateKey(item.date) && item.date >= range.start && item.date <= range.end,
  );
  const roster = aggregateDutyRosterById(schedules, staff);
  const selectedStat = roster.find(item => item.staffId === staffId);
  const monthlyStats = new Map<string, { total: number; person: number; lead: number; weekend: number }>();
  const weeklyStats = new Map<string, { total: number; person: number }>();
  const personDates = new Set<string>();
  let teamTotal = 0;
  let total = 0;
  let weekendCount = 0;
  let teamWeekendCount = 0;
  let leadCount = 0;

  for (const schedule of schedules) {
    const assigned = new Set(schedule.staffIds);
    const month = schedule.date.slice(0, 7);
    const isSelected = assigned.has(staffId);
    const weekend = [0, 6].includes(new Date(`${schedule.date}T12:00:00+07:00`).getDay());
    const stats = monthlyStats.get(month) ?? { total: 0, person: 0, lead: 0, weekend: 0 };
    const weekStart = dutyIsoWeekDays(schedule.date)[0];
    const week = weeklyStats.get(weekStart) ?? { total: 0, person: 0 };
    week.total += assigned.size;
    if (isSelected) week.person += 1;
    weeklyStats.set(weekStart, week);
    stats.total += assigned.size;
    teamTotal += assigned.size;
    if (weekend) teamWeekendCount += assigned.size;
    if (isSelected) {
      total += 1;
      stats.person += 1;
      personDates.add(schedule.date);
      if (weekend) { weekendCount += 1; stats.weekend += 1; }
      if (schedule.staffIds[0] === staffId) { leadCount += 1; stats.lead += 1; }
    }
    monthlyStats.set(month, stats);
  }

  const teamSize = roster.length; // Same population as the existing aggregate/fairness view.
  const teamAverage = teamSize ? teamTotal / teamSize : 0;
  const sharePercent = teamTotal ? (total / teamTotal) * 100 : 0;
  const expected = selectedStat?.fairnessAvailable ? selectedStat.expectedAssignments : null;
  const deviationPercent = selectedStat?.fairnessAvailable ? selectedStat.deviationPercent : null;
  const monthly: DutyProfileMonth[] = [];
  const lastMonth = range.end.slice(0, 7);
  // An all-time view begins at the first actual record, avoiding hundreds of empty months.
  const firstMonth = range.start === '2000-01-01'
    ? (schedules.length ? schedules.reduce((min, item) => item.date.slice(0, 7) < min ? item.date.slice(0, 7) : min, lastMonth) : lastMonth)
    : range.start.slice(0, 7);
  const monthCount = (Number(lastMonth.slice(0, 4)) - Number(firstMonth.slice(0, 4))) * 12
    + Number(lastMonth.slice(5, 7)) - Number(firstMonth.slice(5, 7)) + 1;
  const expectationByMonth = new Map(selectedStat?.expectationMonths.map(item => [item.monthKey, item.expectedAssignments]) || []);
  for (let index = 0; index < monthCount; index++) {
    const key = monthOffset(firstMonth, index);
    const stats = monthlyStats.get(key);
    const totalAssignments = stats?.total || 0;
    monthly.push({
      key,
      actual: stats?.person || 0,
      totalAssignments,
      sharePercent: totalAssignments ? ((stats?.person || 0) / totalAssignments) * 100 : 0,
      teamAverage: teamSize ? totalAssignments / teamSize : 0,
      expected: expectationByMonth.get(key) ?? null,
    });
  }

  const firstActiveDate = range.start === '2000-01-01'
    ? schedules.reduce((min, item) => item.date < min ? item.date : min, range.end)
    : range.start;
  const weekly: DutyProfileWeek[] = [];
  for (let start = dutyIsoWeekDays(firstActiveDate)[0]; start <= range.end; start = shiftDutyDateKey(start, 7)) {
    const values = weeklyStats.get(start);
    const totalAssignments = values?.total || 0;
    const actual = values?.person || 0;
    weekly.push({ start, actual, totalAssignments,
      teamAverage: teamSize ? totalAssignments / teamSize : 0,
      sharePercent: totalAssignments ? actual / totalAssignments * 100 : 0 });
  }

  const dates = [...personDates].sort();
  const gaps = dates.slice(1).map((date, index) => dayIndex(date) - dayIndex(dates[index]));
  const orderedGaps = [...gaps].sort((a, b) => a - b);
  const medianGapDays = orderedGaps.length
    ? (orderedGaps[Math.floor((orderedGaps.length - 1) / 2)] + orderedGaps[Math.floor(orderedGaps.length / 2)]) / 2
    : null;
  const consecutivePairs = gaps.filter(gap => gap === 1).length;
  const shortestGapDays = orderedGaps[0] ?? null;
  const heatmapStart = [range.start, shiftDutyDateKey(range.end, -83)].sort().at(-1)!;
  const days: DutyProfileDay[] = [];
  for (let date = heatmapStart; date <= range.end; date = shiftDutyDateKey(date, 1)) {
    const weekday = new Date(`${date}T12:00:00+07:00`).getDay();
    days.push({ date, count: personDates.has(date) ? 1 : 0, weekend: weekday === 0 || weekday === 6 });
  }

  const insights: DutyProfileInsight[] = [];
  if (teamTotal === 0) {
    insights.push({ title: 'Chưa có dữ liệu', detail: 'Khoảng thời gian này chưa có lượt phân công hợp lệ để so sánh.', tone: 'neutral' });
  } else {
    insights.push({
      title: 'Tỷ trọng trong phòng',
      detail: `${person.displayName} đảm nhiệm ${total}/${teamTotal} lượt (${sharePercent.toFixed(1)}%). Mức trung bình của ${teamSize} nhân sự trong thống kê là ${teamAverage.toFixed(1)} lượt/người.`,
      tone: 'neutral',
    });
    if (expected !== null && deviationPercent !== null) {
      insights.push({
        title: 'So với mức kỳ vọng',
        detail: `${total} lượt thực tế so với ${expected.toFixed(1)} lượt kỳ vọng; chênh ${deviationPercent > 0 ? '+' : ''}${deviationPercent.toFixed(1)}%. Mức kỳ vọng ước tính từ các tháng tham gia quan sát được.`,
        tone: Math.abs(deviationPercent) >= 20 ? 'attention' : 'positive',
      });
    } else {
      insights.push({ title: 'Chưa đủ cơ sở tính kỳ vọng', detail: 'Chưa quan sát được đủ tháng tham gia trực của nhân sự này để ước tính mức kỳ vọng.', tone: 'neutral' });
    }
    if (consecutivePairs > 0) {
      insights.push({
        title: 'Các ca sát nhau',
        detail: `Có ${consecutivePairs} cặp ngày trực liên tiếp trong kỳ; khoảng cách ngắn nhất ${shortestGapDays} ngày. Nên kiểm tra lịch nghỉ và điều kiện phân công khi xếp kỳ tiếp theo.`,
        tone: 'attention',
      });
    } else if (gaps.length > 0) {
      insights.push({ title: 'Mức dàn trải', detail: `Không có cặp ngày trực liên tiếp; trung vị khoảng cách giữa hai ngày trực là ${medianGapDays} ngày.`, tone: 'positive' });
    }
    if (weekendCount > 0 && teamSize > 0) {
      const weekendAverage = teamWeekendCount / teamSize;
      insights.push({
        title: 'Phân bổ trực cuối tuần',
        detail: `${weekendCount}/${teamWeekendCount} lượt cuối tuần của phòng thuộc về ${person.displayName}. Bình quân quan sát của ${teamSize} người là ${weekendAverage.toFixed(1)} lượt/người.`,
        tone: weekendCount > weekendAverage * 1.25 ? 'attention' : 'neutral',
      });
    }
    const populated = monthly.filter(month => month.totalAssignments > 0);
    const halves = [populated.slice(0, Math.floor(populated.length / 2)), populated.slice(Math.floor(populated.length / 2))];
    if (populated.length >= 4 && halves[0].length && halves[1].length) {
      const average = (half: DutyProfileMonth[]) => half.reduce((sum, month) => sum + month.sharePercent, 0) / half.length;
      const change = average(halves[1]) - average(halves[0]);
      insights.push({
        title: 'Xu hướng tỷ trọng',
        detail: `Tỷ trọng bình quân theo tháng ${change > 2 ? 'tăng' : change < -2 ? 'giảm' : 'tương đối ổn định'} (${change > 0 ? '+' : ''}${change.toFixed(1)} điểm %) giữa nửa đầu và nửa cuối các tháng có phân công.`,
        tone: 'neutral',
      });
    }
  }

  return { staffName: person.displayName, start: range.start, end: range.end, total, teamTotal, teamSize,
    teamAverage, sharePercent, expected, deviationPercent, weekendCount, teamWeekendCount, leadCount, consecutivePairs,
    shortestGapDays, medianGapDays, monthly, weekly, days, insights };
}
