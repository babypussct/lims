import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppEmptyStateComponent } from '../../shared/components/ui';
import { DutyScheduleService } from './duty-schedule.service';
import {
  activeDutySchedules,
  currentDutyDateKey,
  currentDutyMonthKey,
  dutyMonthRange,
  findLinkedDutyStaff,
  resolveDutyStaffNames,
} from './duty-schedule.utils';

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

  readonly activeSchedules = computed(() => activeDutySchedules(this.duty.schedules()));
  readonly todaySchedule = computed(() =>
    this.activeSchedules().find(item => item.date === this.todayKey),
  );
  readonly nextSchedule = computed(() =>
    this.activeSchedules().find(item => item.date > this.todayKey),
  );
  readonly upcomingSchedules = computed(() =>
    this.activeSchedules().filter(item => item.date >= this.todayKey).slice(0, 5),
  );
  readonly linkedStaff = computed(() =>
    findLinkedDutyStaff(this.auth.currentUser()?.uid, this.duty.staff()),
  );
  readonly myMonthCount = computed(() => {
    const staffId = this.linkedStaff()?.id;
    if (!staffId) return null;
    return this.activeSchedules().filter(item => item.staffIds.includes(staffId)).length;
  });
  readonly monthAssignmentCount = computed(() =>
    this.activeSchedules().reduce((total, item) => total + new Set(item.staffIds).size, 0),
  );

  ngOnInit(): void {
    const range = dutyMonthRange(this.monthKey);
    this.duty.watchRange(range.start, range.end);
  }

  ngOnDestroy(): void {
    this.duty.stopRangeListener();
  }

  namesFor(schedule: { staffIds: string[] }): string[] {
    return resolveDutyStaffNames(schedule, this.duty.staff());
  }

  isMyShift(schedule: { staffIds: string[] }): boolean {
    const staffId = this.linkedStaff()?.id;
    return !!staffId && schedule.staffIds.includes(staffId);
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
