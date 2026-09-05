import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppEmptyStateComponent } from '../../shared/components/ui';
import type { DutyScheduleEntry } from './duty-schedule.model';
import { DutyScheduleService } from './duty-schedule.service';
import {
  activeDutySchedules,
  aggregateDutyRosterById,
  currentDutyDateKey,
  currentDutyMonthKey,
  dutyMonthCalendarDateKeys,
  dutyMonthRange,
  findLinkedDutyStaff,
  resolveDutyStaffNames,
  shiftDutyDateKey,
} from './duty-schedule.utils';

interface DutyDashboardCalendarCell {
  date: string;
  day: number;
  schedule?: DutyScheduleEntry;
}

@Component({
  selector: 'app-duty-dashboard',
  standalone: true,
  imports: [CommonModule, AppEmptyStateComponent],
  templateUrl: './duty-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyDashboardComponent implements OnInit, OnDestroy {
  readonly duty = inject(DutyScheduleService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly todayKey = currentDutyDateKey();
  readonly monthKey = currentDutyMonthKey();
  readonly calendarWeekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  private readonly currentMonthRange = dutyMonthRange(this.monthKey);
  readonly watchedActiveSchedules = computed(() => activeDutySchedules(this.duty.schedules()));
  readonly activeSchedules = computed(() => this.watchedActiveSchedules()
    .filter(item => item.date >= this.currentMonthRange.start && item.date <= this.currentMonthRange.end));
  readonly calendarCells = computed<(DutyDashboardCalendarCell | null)[]>(() => {
    const year = Number(this.monthKey.slice(0, 4));
    const month = Number(this.monthKey.slice(5, 7));
    const byDate = new Map(this.activeSchedules().map(schedule => [schedule.date, schedule]));
    return dutyMonthCalendarDateKeys(year, month).map(date => date ? {
      date,
      day: Number(date.slice(-2)),
      schedule: byDate.get(date),
    } : null);
  });
  readonly todaySchedule = computed(() =>
    this.watchedActiveSchedules().find(item => item.date === this.todayKey),
  );
  readonly nextSchedule = computed(() =>
    this.activeSchedules().find(item => item.date > this.todayKey),
  );
  readonly upcomingSchedules = computed(() =>
    this.activeSchedules().filter(item => item.date >= this.todayKey).slice(0, 5),
  );
  readonly nextSevenDaysSchedules = computed(() => {
    const end = shiftDutyDateKey(this.todayKey, 6);
    return this.watchedActiveSchedules().filter(item => item.date >= this.todayKey && item.date <= end);
  });
  readonly linkedStaff = computed(() =>
    findLinkedDutyStaff(this.auth.currentUser()?.uid, this.duty.staff()),
  );
  readonly myMonthCount = computed(() => {
    const staffId = this.linkedStaff()?.id;
    if (!staffId) return null;
    return this.activeSchedules().filter(item => item.staffIds.includes(staffId)).length;
  });
  readonly myNextSchedule = computed(() => {
    const staffId = this.linkedStaff()?.id;
    if (!staffId) return undefined;
    return this.activeSchedules().find(item => item.date >= this.todayKey && item.staffIds.includes(staffId));
  });
  readonly mobileMyNextSchedule = computed(() => {
    const staffId = this.linkedStaff()?.id;
    if (!staffId) return undefined;
    const sevenDayEnd = shiftDutyDateKey(this.todayKey, 6);
    return this.watchedActiveSchedules()
      .find(item => item.date >= this.todayKey && item.date <= sevenDayEnd && item.staffIds.includes(staffId));
  });
  readonly monthAssignmentCount = computed(() =>
    this.activeSchedules().reduce((total, item) => total + new Set(item.staffIds).size, 0),
  );
  readonly verificationScheduleCount = computed(() =>
    this.activeSchedules().filter(item => item.needsVerification === true).length,
  );
  readonly unresolvedAssignmentCount = computed(() =>
    this.activeSchedules().reduce((total, item) => total + (item.unresolvedAssignees?.length || 0), 0),
  );
  readonly personStats = computed(() =>
    aggregateDutyRosterById(this.activeSchedules(), this.duty.staff()),
  );
  readonly uniqueAssignedPeople = computed(() => this.personStats().filter(item => item.total > 0).length);
  readonly statsPopulationCount = computed(() => this.personStats().length);
  readonly averageAssignments = computed(() => {
    const people = this.statsPopulationCount();
    return people === 0 ? 0 : this.monthAssignmentCount() / people;
  });

  ngOnInit(): void {
    const sevenDayEnd = shiftDutyDateKey(this.todayKey, 6);
    this.duty.watchRange(this.currentMonthRange.start, sevenDayEnd > this.currentMonthRange.end ? sevenDayEnd : this.currentMonthRange.end);
  }

  ngOnDestroy(): void {
    this.duty.stopRangeListener();
  }

  namesFor(schedule: { staffIds: string[] }): string[] {
    return resolveDutyStaffNames(schedule, this.duty.staff());
  }

  unresolvedFor(schedule: Pick<DutyScheduleEntry, 'unresolvedAssignees'>): string[] {
    return schedule.unresolvedAssignees || [];
  }

  isMyShift(schedule: { staffIds: string[] }): boolean {
    const staffId = this.linkedStaff()?.id;
    return !!staffId && schedule.staffIds.includes(staffId);
  }

  isMyName(name: string): boolean {
    return this.linkedStaff()?.displayName === name;
  }

  assignmentDeviationPercent(total: number): number {
    const average = this.averageAssignments();
    if (average === 0) return 0;
    return ((total - average) / average) * 100;
  }

  assignmentDeviationLabel(total: number): string {
    const deviation = this.assignmentDeviationPercent(total);
    if (Math.abs(deviation) < 10) return 'Cân bằng';
    return deviation > 0 ? 'Nhiều hơn' : 'Ít hơn';
  }

  isToday(dateKey: string): boolean {
    return dateKey === this.todayKey;
  }

  isWeekend(dateKey: string): boolean {
    const weekday = new Date(`${dateKey}T12:00:00+07:00`).getDay();
    return weekday === 0 || weekday === 6;
  }

  formatShortDate(dateKey: string): string {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(`${dateKey}T12:00:00+07:00`));
  }

  openModule(): void {
    void this.router.navigate(['/duty-stats']);
  }
}
