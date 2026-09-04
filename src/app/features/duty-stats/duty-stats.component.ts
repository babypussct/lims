import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, type UserProfile } from '../../core/services/auth.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { ToastService } from '../../core/services/toast.service';
import {
  AppButtonComponent,
  AppModalShellComponent,
  AppPageHeaderComponent,
  AppToolbarComponent,
} from '../../shared/components/ui';
import type { DutyScheduleDraft, DutyScheduleEntry, DutyStaff, DutyStaffDraft } from './duty-schedule.model';
import { DutyScheduleService } from './duty-schedule.service';
import {
  activeDutySchedules,
  aggregateDutyPeopleById,
  countDutyAssignments,
  currentDutyDateKey,
  currentDutyMonthKey,
  dutyMonthRange,
  dutyYearRange,
  findLinkedDutyStaff,
  resolveDutyStaffNames,
} from './duty-schedule.utils';

type DutyView = 'schedule' | 'staff' | 'stats';
type DutyStatsSortColumn = 'total' | 'mondayCount' | 'activeMonthCount' | 'lastDate' | 'displayName';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-duty-stats',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppButtonComponent,
    AppModalShellComponent,
    AppPageHeaderComponent,
    AppToolbarComponent,
  ],
  templateUrl: './duty-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyStatsComponent implements OnInit, OnDestroy {
  readonly duty = inject(DutyScheduleService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly confirmation = inject(ConfirmationService);

  readonly activeView = signal<DutyView>('schedule');
  readonly selectedYear = signal(Number(currentDutyMonthKey().slice(0, 4)));
  readonly selectedMonth = signal<number | null>(Number(currentDutyMonthKey().slice(5, 7)));
  readonly selectedStaffFilter = signal<string | null>(null);
  readonly staffSearch = signal('');
  readonly scheduleStaffSearch = signal('');
  readonly includeInactiveStaff = signal(false);
  readonly includeCancelled = signal(false);
  readonly saving = signal(false);
  readonly staffModalOpen = signal(false);
  readonly scheduleModalOpen = signal(false);
  readonly sortColumn = signal<DutyStatsSortColumn>('total');
  readonly sortDirection = signal<SortDirection>('desc');

  readonly years = Array.from({ length: 21 }, (_, index) => new Date().getFullYear() + 5 - index);
  readonly months = Array.from({ length: 12 }, (_, index) => index + 1);

  staffDraft: DutyStaffDraft = this.emptyStaffDraft();
  scheduleDraft: DutyScheduleDraft = this.emptyScheduleDraft();

  readonly activeStaff = computed(() => this.duty.staff().filter(item => item.active));
  readonly filteredStaff = computed(() => {
    const search = this.staffSearch().trim().toLocaleLowerCase('vi-VN');
    return this.duty.staff().filter(item => {
      if (!this.includeInactiveStaff() && !item.active) return false;
      if (!search) return true;
      return `${item.employeeCode || ''} ${item.displayName}`.toLocaleLowerCase('vi-VN').includes(search);
    });
  });
  readonly visibleSchedules = computed(() => {
    const staffId = this.selectedStaffFilter();
    return this.duty.schedules().filter(item => {
      if (!this.includeCancelled() && item.status === 'cancelled') return false;
      if (staffId && !item.staffIds.includes(staffId)) return false;
      return true;
    });
  });
  readonly activeSchedules = computed(() => activeDutySchedules(this.duty.schedules()));
  readonly personStats = computed(() => aggregateDutyPeopleById(this.duty.schedules(), this.duty.staff()));
  readonly sortedPersonStats = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    return [...this.personStats()].sort((a, b) => {
      if (column === 'lastDate') {
        if (!a.lastDate && !b.lastDate) return a.displayName.localeCompare(b.displayName, 'vi');
        if (!a.lastDate) return 1;
        if (!b.lastDate) return -1;
      }

      const comparison = column === 'displayName'
        ? a.displayName.localeCompare(b.displayName, 'vi')
        : column === 'lastDate'
          ? a.lastDate.localeCompare(b.lastDate)
          : a[column] - b[column];

      return comparison * direction || a.displayName.localeCompare(b.displayName, 'vi');
    });
  });
  readonly myStaff = computed(() =>
    findLinkedDutyStaff(this.auth.currentUser()?.uid, this.duty.staff()),
  );
  readonly myStaffId = computed(() => this.myStaff()?.id);
  readonly totalAssignments = computed(() => countDutyAssignments(this.duty.schedules()));
  readonly uniqueAssignedPeople = computed(() => this.personStats().length);
  readonly averageAssignments = computed(() => {
    const people = this.uniqueAssignedPeople();
    return people === 0 ? 0 : this.totalAssignments() / people;
  });

  ngOnInit(): void {
    this.refreshRange();
  }

  ngOnDestroy(): void {
    this.duty.stopAllListeners();
  }

  setYear(value: number | string): void {
    this.selectedYear.set(Number(value));
    this.refreshRange();
  }

  setMonth(value: number | string | null): void {
    this.selectedMonth.set(value === null || value === '' ? null : Number(value));
    this.refreshRange();
  }

  setStaffFilter(value: string | null): void {
    this.selectedStaffFilter.set(value || null);
  }

  prevPeriod(): void {
    const month = this.selectedMonth();
    if (month === null) {
      this.selectedYear.update(year => year - 1);
    } else if (month === 1) {
      this.selectedYear.update(year => year - 1);
      this.selectedMonth.set(12);
    } else {
      this.selectedMonth.set(month - 1);
    }
    this.refreshRange();
  }

  nextPeriod(): void {
    const month = this.selectedMonth();
    if (month === null) {
      this.selectedYear.update(year => year + 1);
    } else if (month === 12) {
      this.selectedYear.update(year => year + 1);
      this.selectedMonth.set(1);
    } else {
      this.selectedMonth.set(month + 1);
    }
    this.refreshRange();
  }

  goToCurrentMonth(): void {
    const currentMonth = currentDutyMonthKey();
    this.selectedYear.set(Number(currentMonth.slice(0, 4)));
    this.selectedMonth.set(Number(currentMonth.slice(5, 7)));
    this.refreshRange();
  }

  isCurrentMonth(): boolean {
    const currentMonth = currentDutyMonthKey();
    return this.selectedMonth() === Number(currentMonth.slice(5, 7))
      && this.selectedYear() === Number(currentMonth.slice(0, 4));
  }

  isMyShift(schedule: DutyScheduleEntry): boolean {
    const staffId = this.myStaffId();
    return !!staffId && schedule.staffIds.includes(staffId);
  }

  toggleSort(column: DutyStatsSortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(direction => direction === 'asc' ? 'desc' : 'asc');
      return;
    }

    this.sortColumn.set(column);
    this.sortDirection.set(column === 'displayName' ? 'asc' : 'desc');
  }

  ariaSortFor(column: DutyStatsSortColumn): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn() !== column) return 'none';
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  setActiveView(view: DutyView): void {
    this.activeView.set(view);
    if (view === 'staff') void this.ensureAccounts();
  }

  openNewStaff(): void {
    if (!this.duty.canManage()) return;
    this.staffDraft = this.emptyStaffDraft();
    this.staffModalOpen.set(true);
    void this.ensureAccounts();
  }

  openEditStaff(person: DutyStaff): void {
    if (!this.duty.canManage()) return;
    this.staffDraft = {
      id: person.id,
      displayName: person.displayName,
      employeeCode: person.employeeCode || '',
      linkedUserUid: person.linkedUserUid || null,
      active: person.active,
      note: person.note || '',
    };
    this.staffModalOpen.set(true);
    void this.ensureAccounts();
  }

  closeStaffModal(): void {
    if (!this.saving()) this.staffModalOpen.set(false);
  }

  async saveStaff(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      await this.duty.saveStaff(this.staffDraft);
      this.staffModalOpen.set(false);
      this.toast.show(this.staffDraft.id ? 'Đã cập nhật nhân viên trực.' : 'Đã thêm nhân viên trực.', 'success');
    } catch (error) {
      this.toast.show(this.errorMessage(error), 'error');
    } finally {
      this.saving.set(false);
    }
  }

  async toggleStaffActive(person: DutyStaff): Promise<void> {
    if (!this.duty.canManage()) return;
    if (person.active) {
      const confirmed = await this.confirmation.confirm({
        title: 'Ngừng xếp lịch nhân viên',
        message: `${person.displayName} sẽ không còn xuất hiện trong danh sách xếp ca mới. Lịch sử cũ vẫn được giữ nguyên.`,
        confirmText: 'Ngừng sử dụng',
        isDangerous: true,
      });
      if (!confirmed) return;
    }
    try {
      await this.duty.setStaffActive(person.id, !person.active);
      this.toast.show(person.active ? 'Đã ngừng sử dụng nhân viên.' : 'Đã kích hoạt lại nhân viên.', 'success');
    } catch (error) {
      this.toast.show(this.errorMessage(error), 'error');
    }
  }

  openNewSchedule(date?: string): void {
    if (!this.duty.canManage()) return;
    this.scheduleDraft = this.emptyScheduleDraft(date || this.defaultScheduleDate());
    this.scheduleStaffSearch.set('');
    this.scheduleModalOpen.set(true);
  }

  openEditSchedule(schedule: DutyScheduleEntry): void {
    if (!this.duty.canManage()) return;
    this.scheduleDraft = {
      originalDate: schedule.date,
      date: schedule.date,
      staffIds: [...schedule.staffIds],
      startTime: schedule.startTime || '18:00',
      status: schedule.status,
      note: schedule.note || '',
    };
    this.scheduleStaffSearch.set('');
    this.scheduleModalOpen.set(true);
  }

  closeScheduleModal(): void {
    if (!this.saving()) this.scheduleModalOpen.set(false);
  }

  isStaffSelected(staffId: string): boolean {
    return this.scheduleDraft.staffIds.includes(staffId);
  }

  toggleScheduleStaff(staffId: string, checked: boolean): void {
    const current = [...this.scheduleDraft.staffIds];
    if (checked && !current.includes(staffId)) current.push(staffId);
    if (!checked) {
      const index = current.indexOf(staffId);
      if (index >= 0) current.splice(index, 1);
    }
    this.scheduleDraft.staffIds = current;
  }

  moveScheduleStaff(staffId: string, delta: -1 | 1): void {
    const current = [...this.scheduleDraft.staffIds];
    const index = current.indexOf(staffId);
    const next = index + delta;
    if (index < 0 || next < 0 || next >= current.length) return;
    [current[index], current[next]] = [current[next], current[index]];
    this.scheduleDraft.staffIds = current;
  }

  removeScheduleStaff(staffId: string): void {
    this.scheduleDraft.staffIds = this.scheduleDraft.staffIds.filter(id => id !== staffId);
  }

  async saveSchedule(): Promise<void> {
    if (this.saving() || !this.scheduleDraft.date || this.scheduleDraft.staffIds.length === 0) return;
    this.saving.set(true);
    try {
      await this.duty.saveSchedule({ ...this.scheduleDraft, source: 'manual' });
      this.scheduleModalOpen.set(false);
      this.toast.show('Đã lưu ca trực.', 'success');
    } catch (error) {
      this.toast.show(this.errorMessage(error), 'error');
    } finally {
      this.saving.set(false);
    }
  }

  async cancelSchedule(schedule: DutyScheduleEntry): Promise<void> {
    if (!this.duty.canManage() || schedule.status === 'cancelled') return;
    const confirmed = await this.confirmation.confirm({
      title: 'Hủy ca trực',
      message: `Hủy ca ngày ${this.formatDate(schedule.date)}? Bản ghi vẫn được giữ để truy vết.`,
      confirmText: 'Hủy ca',
      isDangerous: true,
    });
    if (!confirmed) return;
    try {
      await this.duty.cancelSchedule(schedule.date);
      this.toast.show('Đã hủy ca trực.', 'success');
    } catch (error) {
      this.toast.show(this.errorMessage(error), 'error');
    }
  }

  staffName(staffId: string): string {
    return this.duty.staff().find(item => item.id === staffId)?.displayName || `[${staffId}]`;
  }

  namesFor(schedule: DutyScheduleEntry): string[] {
    return resolveDutyStaffNames(schedule, this.duty.staff());
  }

  accountFor(person: DutyStaff): UserProfile | undefined {
    if (!person.linkedUserUid) return undefined;
    return this.duty.accounts().find(item => item.uid === person.linkedUserUid);
  }

  accountLabel(account: UserProfile): string {
    const name = account.displayName || account.email || account.uid;
    return account.email && account.email !== name ? `${name} · ${account.email}` : name;
  }

  accountAssignedToOther(accountUid: string): DutyStaff | undefined {
    return this.duty.staff().find(person => person.id !== this.staffDraft.id && person.linkedUserUid === accountUid);
  }

  scheduleStaffOptions(): DutyStaff[] {
    const selected = new Set(this.scheduleDraft.staffIds);
    return this.duty.staff().filter(item => item.active || selected.has(item.id));
  }

  filteredScheduleStaffOptions(): DutyStaff[] {
    const search = this.normalizeSearchTerm(this.scheduleStaffSearch());
    if (!search) return this.scheduleStaffOptions();
    return this.scheduleStaffOptions().filter(person => {
      const haystack = this.normalizeSearchTerm(`${person.employeeCode || ''} ${person.displayName}`);
      return haystack.includes(search);
    });
  }

  scheduleCountForStaff(staffId: string): number {
    return this.activeSchedules().filter(item => item.staffIds.includes(staffId)).length;
  }

  formatDate(dateKey: string): string {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(`${dateKey}T12:00:00+07:00`));
  }

  formatMonth(month: number): string {
    return String(month).padStart(2, '0');
  }

  exportCsv(): void {
    const rows = [
      ['Ngày', 'Giờ bắt đầu', 'Trạng thái', 'Nhân sự', 'Người chủ trì', 'Ghi chú'],
      ...this.duty.schedules().map(schedule => {
        const names = this.namesFor(schedule);
        return [
          schedule.date,
          schedule.startTime,
          schedule.status === 'cancelled' ? 'Đã hủy' : 'Đang áp dụng',
          names.join('; '),
          names[0] || '',
          schedule.note || '',
        ];
      }),
    ];
    const csv = '\uFEFF' + rows.map(row => row.map(value => this.escapeCsv(value)).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    const month = this.selectedMonth();
    anchor.download = `lich-truc-${this.selectedYear()}-${month ? String(month).padStart(2, '0') : 'ca-nam'}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private refreshRange(): void {
    const month = this.selectedMonth();
    const range = month
      ? dutyMonthRange(`${this.selectedYear()}-${String(month).padStart(2, '0')}`)
      : dutyYearRange(this.selectedYear());
    this.duty.watchRange(range.start, range.end);
  }

  private defaultScheduleDate(): string {
    const today = currentDutyDateKey();
    const month = this.selectedMonth();
    if (Number(today.slice(0, 4)) === this.selectedYear()
      && (!month || Number(today.slice(5, 7)) === month)) {
      return today;
    }
    return month
      ? `${this.selectedYear()}-${String(month).padStart(2, '0')}-01`
      : `${this.selectedYear()}-01-01`;
  }

  private emptyStaffDraft(): DutyStaffDraft {
    return {
      displayName: '',
      employeeCode: '',
      linkedUserUid: null,
      active: true,
      note: '',
    };
  }

  private emptyScheduleDraft(date = currentDutyDateKey()): DutyScheduleDraft {
    return {
      date,
      staffIds: [],
      startTime: '18:00',
      status: 'planned',
      note: '',
    };
  }

  private async ensureAccounts(): Promise<void> {
    try {
      await this.duty.loadAccounts();
    } catch (error) {
      this.toast.show(`Không tải được danh sách tài khoản LIMS: ${this.errorMessage(error)}`, 'warning');
    }
  }

  private escapeCsv(value: string): string {
    return `"${String(value).replace(/"/g, '""')}"`;
  }

  private normalizeSearchTerm(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLocaleLowerCase('vi-VN')
      .trim();
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định.';
  }
}
