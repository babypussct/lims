import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import { currentDutyDateKey, resolveDutyStaffNames } from './duty-schedule.utils';

@Component({
  selector: 'app-duty-week-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './duty-week-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyWeekViewComponent {
  @Input({ required: true }) dates: readonly string[] = [];
  @Input({ required: true }) schedules: readonly DutyScheduleEntry[] = [];
  @Input({ required: true }) visibleSchedules: readonly DutyScheduleEntry[] = [];
  @Input({ required: true }) staff: readonly DutyStaff[] = [];
  @Input() canManage = false;
  @Input() myStaffId: string | null | undefined;
  @Input() loading = false;

  @Output() editSchedule = new EventEmitter<DutyScheduleEntry>();
  @Output() createSchedule = new EventEmitter<string>();
  @Output() requestSwap = new EventEmitter<DutyScheduleEntry>();

  scheduleFor(dateKey: string): DutyScheduleEntry | undefined {
    return this.schedules.find(schedule => schedule.date === dateKey);
  }

  isVisible(schedule: DutyScheduleEntry): boolean {
    return this.visibleSchedules.some(item => item.date === schedule.date);
  }

  namesFor(schedule: DutyScheduleEntry): string[] {
    return resolveDutyStaffNames(schedule, this.staff);
  }

  unresolvedFor(schedule: DutyScheduleEntry): string[] {
    return schedule.unresolvedAssignees || [];
  }

  isMyShift(schedule: DutyScheduleEntry): boolean {
    return Boolean(this.myStaffId && schedule.staffIds.includes(this.myStaffId));
  }

  isToday(dateKey: string): boolean {
    return dateKey === currentDutyDateKey();
  }

  isWeekend(dateKey: string): boolean {
    const [year, month, day] = dateKey.split('-').map(Number);
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    return weekday === 0 || weekday === 6;
  }

  weekdayLabel(dateKey: string): string {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(year, month - 1, day)));
  }

  shortDateLabel(dateKey: string): string {
    return `${dateKey.slice(8, 10)}/${dateKey.slice(5, 7)}`;
  }

  actOn(dateKey: string, schedule?: DutyScheduleEntry): void {
    if (!this.canManage) return;
    if (schedule) this.editSchedule.emit(schedule);
    else this.createSchedule.emit(dateKey);
  }
}
