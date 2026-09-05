import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
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
import type {
  DutyRecommendationTier,
  DutyScheduleDraft,
  DutyScheduleEntry,
  DutyStaff,
  DutyStaffDraft,
  DutyStaffRecommendation,
} from './duty-schedule.model';
import { DutyScheduleService } from './duty-schedule.service';
import { DutyTsvImportComponent } from './duty-tsv-import.component';
import {
  activeDutySchedules,
  aggregateDutyRosterById,
  computeDutyStaffRecommendations,
  countDutyAssignments,
  currentDutyDateKey,
  currentDutyMonthKey,
  dutyAdjacentAssignment,
  dutyMonthCalendarDateKeys,
  dutyMonthDateKeys,
  dutyMonthRange,
  dutyRolling90Range,
  dutyYearRange,
  findLinkedDutyStaff,
  isDutyDateKey,
  resolveDutyStaffNames,
  shiftDutyDateKey,
} from './duty-schedule.utils';

type DutyView = 'schedule' | 'staff' | 'stats';
type DutyScheduleLayout = 'list' | 'calendar';
type DutyBatchScope = 'all' | 'weekdays' | 'weekends';
type DutyStatsRangeMode = 'selection' | 'year' | 'all';
type DutyMobilePeriodMode = 'month' | 'year' | 'all';
type DutyStatsSortColumn = 'total' | 'mondayCount' | 'weekendCount' | 'leadCount' | 'activeMonthCount' | 'lastDate' | 'displayName';
type SortDirection = 'asc' | 'desc';
interface DutyCalendarCell {
  date: string;
  day: number;
  schedule?: DutyScheduleEntry;
  visible: boolean;
}

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
    DutyTsvImportComponent,
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
  readonly importMonth = signal<string | null>(null);
  readonly selectedYear = signal(Number(currentDutyMonthKey().slice(0, 4)));
  readonly selectedMonth = signal<number | null>(Number(currentDutyMonthKey().slice(5, 7)));
  readonly selectedStaffFilter = signal<string | null>(null);
  readonly myShiftsOnly = signal(false);
  readonly needsVerificationOnly = signal(false);
  readonly scheduleLayout = signal<DutyScheduleLayout>(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'list' : 'calendar',
  );
  readonly mobileMenuOpen = signal(false);
  readonly selectedDayCell = signal<DutyCalendarCell | null>(null);
  readonly mobilePeriodMode = signal<DutyMobilePeriodMode>('month');
  readonly staffSearch = signal('');
  readonly scheduleStaffSearch = signal('');
  readonly includeInactiveStaff = signal(false);
  readonly includeCancelled = signal(false);
  readonly saving = signal(false);
  readonly batchSaving = signal(false);
  readonly staffModalOpen = signal(false);
  readonly scheduleModalOpen = signal(false);
  readonly batchModalOpen = signal(false);
  readonly batchScope = signal<DutyBatchScope>('all');
  readonly batchStartTime = signal('18:00');
  readonly conflictSchedules = signal<DutyScheduleEntry[]>([]);
  readonly conflictLoading = signal(false);
  readonly rollingSchedules = signal<DutyScheduleEntry[]>([]);
  readonly rollingLoading = signal(false);
  readonly sortColumn = signal<DutyStatsSortColumn>('total');
  readonly sortDirection = signal<SortDirection>('desc');
  readonly statsRangeMode = signal<DutyStatsRangeMode>('selection');

  readonly years = Array.from({ length: 21 }, (_, index) => new Date().getFullYear() + 5 - index);
  readonly months = Array.from({ length: 12 }, (_, index) => index + 1);
  readonly calendarWeekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  private conflictRequestId = 0;
  private recommendationRequestId = 0;

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
    const staffId = this.myShiftsOnly() ? this.myStaffId() : this.selectedStaffFilter();
    return this.duty.schedules().filter(item => {
      if (!this.includeCancelled() && item.status === 'cancelled') return false;
      if (this.needsVerificationOnly() && item.needsVerification !== true) return false;
      if (staffId && !item.staffIds.includes(staffId)) return false;
      return true;
    });
  });
  readonly activeSchedules = computed(() => activeDutySchedules(this.duty.schedules()));
  readonly unassignedSchedules = computed(() => this.activeSchedules()
    .filter(item => item.staffIds.length === 0 && (item.unresolvedAssignees?.length || 0) === 0));
  readonly verificationSchedules = computed(() => this.activeSchedules().filter(item => item.needsVerification === true));
  readonly unresolvedAssignmentCount = computed(() => this.activeSchedules()
    .reduce((total, item) => total + (item.unresolvedAssignees?.length || 0), 0));
  readonly calendarCells = computed<(DutyCalendarCell | null)[]>(() => {
    const month = this.selectedMonth();
    if (!month) return [];
    const byDate = new Map(this.duty.schedules().map(schedule => [schedule.date, schedule]));
    const visibleDates = new Set(this.visibleSchedules().map(schedule => schedule.date));
    return dutyMonthCalendarDateKeys(this.selectedYear(), month).map(date => date ? {
      date,
      day: Number(date.slice(-2)),
      schedule: byDate.get(date),
      visible: visibleDates.has(date),
    } : null);
  });
  readonly batchScopedDates = computed(() => {
    const month = this.selectedMonth();
    if (!month) return [];
    const dates = dutyMonthDateKeys(this.selectedYear(), month);
    if (this.batchScope() === 'all') return dates;
    return dates.filter(date => {
      const weekday = new Date(`${date}T12:00:00+07:00`).getDay();
      return this.batchScope() === 'weekends' ? weekday === 0 || weekday === 6 : weekday >= 1 && weekday <= 5;
    });
  });
  readonly batchCandidateDates = computed(() => {
    const existing = new Set(this.duty.schedules().map(schedule => schedule.date));
    return this.batchScopedDates().filter(date => !existing.has(date));
  });
  readonly batchExistingCount = computed(() => this.batchScopedDates().length - this.batchCandidateDates().length);
  readonly personStats = computed(() => aggregateDutyRosterById(this.duty.schedules(), this.duty.staff()));
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
  readonly uniqueAssignedPeople = computed(() => this.personStats().filter(item => item.total > 0).length);
  readonly statsPopulationCount = computed(() => this.personStats().length);
  readonly averageAssignments = computed(() => {
    const people = this.statsPopulationCount();
    return people === 0 ? 0 : this.totalAssignments() / people;
  });
  readonly staffRecommendations = computed(() => {
    const byDate = new Map(
      [...this.rollingSchedules(), ...this.conflictSchedules()]
        .map(schedule => [schedule.date, schedule] as const),
    );
    return computeDutyStaffRecommendations(
      this.scheduleDraft.date,
      [...byDate.values()],
      this.duty.staff(),
      this.scheduleDraft.originalDate,
    );
  });
  readonly statsRangeLabel = computed(() => {
    const mode = this.statsRangeMode();
    if (mode === 'all') return 'Toàn bộ dữ liệu lịch trực';
    if (mode === 'year') return `Năm ${this.selectedYear()}`;
    const month = this.selectedMonth();
    return month === null
      ? `Năm ${this.selectedYear()}`
      : `Tháng ${this.formatMonth(month)}/${this.selectedYear()}`;
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
    this.scheduleLayout.set(this.selectedMonth() === null || this.isMobileViewport() ? 'list' : 'calendar');
    this.refreshRange();
  }

  setStaffFilter(value: string | null): void {
    this.myShiftsOnly.set(false);
    this.selectedStaffFilter.set(value || null);
  }

  toggleMyShifts(): void {
    const myStaffId = this.myStaffId();
    if (!myStaffId) {
      this.toast.show('Tài khoản của bạn chưa được gán với nhân sự trong danh mục lịch trực.', 'warning');
      return;
    }
    const next = !this.myShiftsOnly();
    this.myShiftsOnly.set(next);
    this.selectedStaffFilter.set(next ? myStaffId : null);
  }

  setScheduleLayout(layout: DutyScheduleLayout): void {
    if (layout === 'calendar' && this.selectedMonth() === null) {
      this.toast.show('Dạng lưới lịch chỉ áp dụng khi đang xem một tháng cụ thể.', 'info');
      return;
    }
    this.scheduleLayout.set(layout);
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

  isToday(dateKey: string): boolean {
    return dateKey === currentDutyDateKey();
  }

  isWeekend(dateKey: string): boolean {
    const weekday = new Date(`${dateKey}T12:00:00+07:00`).getDay();
    return weekday === 0 || weekday === 6;
  }

  openCalendarDate(cell: DutyCalendarCell): void {
    if (!this.duty.canManage()) return;
    if (cell.schedule) this.openEditSchedule(cell.schedule);
    else this.openNewSchedule(cell.date);
  }

  openMobileDay(cell: DutyCalendarCell): void {
    this.selectedDayCell.set(cell);
  }

  closeMobileDay(): void {
    this.selectedDayCell.set(null);
  }

  editSelectedMobileDay(): void {
    const cell = this.selectedDayCell();
    if (!cell || !this.duty.canManage()) return;
    this.closeMobileDay();
    if (cell.schedule) this.openEditSchedule(cell.schedule);
    else this.openNewSchedule(cell.date);
  }

  cancelSelectedMobileDay(): void {
    const schedule = this.selectedDayCell()?.schedule;
    if (!schedule || !this.duty.canManage() || schedule.status === 'cancelled') return;
    this.closeMobileDay();
    void this.cancelSchedule(schedule);
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
    this.refreshRange();
    if (view === 'staff') void this.ensureAccounts();
  }

  setStatsRangeMode(mode: DutyStatsRangeMode): void {
    this.statsRangeMode.set(mode);
    if (this.activeView() === 'stats') this.refreshRange();
  }

  setMobilePeriodMode(mode: DutyMobilePeriodMode): void {
    this.mobilePeriodMode.set(mode);
    if (mode === 'month') {
      if (this.selectedMonth() === null) {
        const current = currentDutyMonthKey();
        this.selectedYear.set(Number(current.slice(0, 4)));
        this.selectedMonth.set(Number(current.slice(5, 7)));
      }
      this.statsRangeMode.set('selection');
    } else if (mode === 'year') {
      this.selectedMonth.set(null);
      this.statsRangeMode.set('year');
      this.scheduleLayout.set('list');
    } else {
      this.statsRangeMode.set('all');
    }
    this.refreshRange();
  }

  mobilePeriodLabel(): string {
    if (this.mobilePeriodMode() === 'all') return 'Toàn bộ dữ liệu';
    if (this.mobilePeriodMode() === 'year') return `${this.selectedYear()}`;
    const month = this.selectedMonth() ?? Number(currentDutyMonthKey().slice(5, 7));
    return `Tháng ${this.formatMonth(month)}/${this.selectedYear()}`;
  }

  distributionPercent(total: number): number {
    const totals = this.personStats().map(item => item.total);
    if (totals.length === 0) return 50;
    const min = Math.min(...totals);
    const max = Math.max(...totals);
    if (max === min) return 50;
    return Math.max(0, Math.min(100, ((total - min) / (max - min)) * 100));
  }

  assignmentDifference(total: number): number {
    return total - this.averageAssignments();
  }

  assignmentDeviationPercent(total: number): number {
    const average = this.averageAssignments();
    if (average === 0) return 0;
    return ((total - average) / average) * 100;
  }

  assignmentBalanceLabel(total: number): 'Cân bằng' | 'Nhiều hơn' | 'Ít hơn' {
    const deviation = this.assignmentDeviationPercent(total);
    if (Math.abs(deviation) < 10) return 'Cân bằng';
    return deviation > 0 ? 'Nhiều hơn' : 'Ít hơn';
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
    void this.refreshScheduleConflictContext();
    void this.refreshRecommendationContext();
  }

  openEditSchedule(schedule: DutyScheduleEntry): void {
    if (!this.duty.canManage()) return;
    this.scheduleDraft = {
      originalDate: schedule.date,
      date: schedule.date,
      staffIds: [...schedule.staffIds],
      unresolvedAssignees: [...(schedule.unresolvedAssignees || [])],
      needsVerification: schedule.needsVerification === true,
      sourceAssignees: schedule.sourceAssignees || '',
      startTime: schedule.startTime || '18:00',
      status: schedule.status,
      note: schedule.note || '',
    };
    this.scheduleStaffSearch.set('');
    this.scheduleModalOpen.set(true);
    void this.refreshScheduleConflictContext();
    void this.refreshRecommendationContext();
  }

  closeScheduleModal(): void {
    if (!this.saving()) {
      this.conflictRequestId += 1;
      this.recommendationRequestId += 1;
      this.conflictSchedules.set([]);
      this.conflictLoading.set(false);
      this.rollingSchedules.set([]);
      this.rollingLoading.set(false);
      this.scheduleModalOpen.set(false);
    }
  }

  onScheduleDateChange(value: string): void {
    this.scheduleDraft.date = value;
    void this.refreshScheduleConflictContext();
    void this.refreshRecommendationContext();
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

  addUnresolvedAssignee(): void {
    this.scheduleDraft.unresolvedAssignees = [...(this.scheduleDraft.unresolvedAssignees || []), '?'];
    this.scheduleDraft.needsVerification = true;
  }

  updateUnresolvedAssignee(index: number, value: string): void {
    const current = [...(this.scheduleDraft.unresolvedAssignees || [])];
    if (index < 0 || index >= current.length) return;
    current[index] = value;
    this.scheduleDraft.unresolvedAssignees = current;
    this.scheduleDraft.needsVerification = true;
  }

  removeUnresolvedAssignee(index: number): void {
    const current = [...(this.scheduleDraft.unresolvedAssignees || [])];
    if (index < 0 || index >= current.length) return;
    current.splice(index, 1);
    this.scheduleDraft.unresolvedAssignees = current;
    if (current.length === 0) this.scheduleDraft.needsVerification = false;
  }

  scheduleDraftHasAssignment(): boolean {
    return this.scheduleDraft.staffIds.length > 0 || (this.scheduleDraft.unresolvedAssignees?.length || 0) > 0;
  }

  conflictWarningForStaff(staffId: string): string | null {
    const date = this.scheduleDraft.date;
    if (!date) return null;
    const conflict = dutyAdjacentAssignment(date, staffId, this.conflictSchedules());
    if (conflict.previous && conflict.next) return '2 ca liền kề';
    if (conflict.previous) return 'Vừa trực hôm qua';
    if (conflict.next) return 'Đã có ca ngày mai';
    return null;
  }

  selectedConflictCount(): number {
    return this.scheduleDraft.staffIds.filter(staffId => Boolean(this.conflictWarningForStaff(staffId))).length;
  }

  openBatchMonth(): void {
    if (!this.duty.canManage() || this.selectedMonth() === null) return;
    this.batchScope.set('all');
    this.batchStartTime.set('18:00');
    this.batchModalOpen.set(true);
  }

  closeBatchModal(): void {
    if (!this.batchSaving()) this.batchModalOpen.set(false);
  }

  async createMonthSkeleton(): Promise<void> {
    if (this.batchSaving()) return;
    const candidates = this.batchCandidateDates();
    if (candidates.length === 0) {
      this.toast.show('Không còn ngày trống phù hợp để tạo khung ca trong phạm vi đã chọn.', 'info');
      return;
    }
    this.batchSaving.set(true);
    const existingCount = this.batchExistingCount();
    try {
      const result = await this.duty.createMonthSkeleton(candidates, this.batchStartTime());
      this.batchModalOpen.set(false);
      this.toast.show(
        `Đã tạo ${result.created} khung ca trực. ${result.skipped + existingCount} ngày đã có lịch được giữ nguyên.`,
        'success',
      );
    } catch (error) {
      this.toast.show(this.errorMessage(error), 'error');
    } finally {
      this.batchSaving.set(false);
    }
  }

  async saveSchedule(): Promise<void> {
    if (this.saving() || !this.scheduleDraft.date || !this.scheduleDraftHasAssignment()) return;
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

  unresolvedFor(schedule: DutyScheduleEntry): string[] {
    return schedule.unresolvedAssignees || [];
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
    const recommendationOrder = new Map(this.staffRecommendations().map((item, index) => [item.staffId, index]));
    const options = this.scheduleStaffOptions().sort((a, b) =>
      (recommendationOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER)
      - (recommendationOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)
      || a.displayName.localeCompare(b.displayName, 'vi'),
    );
    if (!search) return options;
    return options.filter(person => {
      const haystack = this.normalizeSearchTerm(`${person.employeeCode || ''} ${person.displayName}`);
      return haystack.includes(search);
    });
  }

  recommendationForStaff(staffId: string): DutyStaffRecommendation | undefined {
    return this.staffRecommendations().find(item => item.staffId === staffId);
  }

  recommendationLabel(tier: DutyRecommendationTier): string {
    if (tier === 'recommended') return 'Nên xếp';
    if (tier === 'balanced') return 'Cân bằng';
    if (tier === 'high') return 'Đang nhiều';
    return 'Cân nhắc';
  }

  recommendationBadgeClass(tier: DutyRecommendationTier): string {
    if (tier === 'recommended') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300';
    if (tier === 'balanced') return 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300';
    if (tier === 'high') return 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300';
    return 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300';
  }

  recommendationMarker(tier: DutyRecommendationTier): string {
    if (tier === 'recommended') return '🟢';
    if (tier === 'balanced') return '🔵';
    if (tier === 'high') return '🔴';
    return '🟠';
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
      ['Ngày', 'Giờ bắt đầu', 'Trạng thái', 'Nhân sự xác định', 'Vị trí chưa xác định', 'Người chủ trì', 'Nguồn Gemini ban đầu', 'Ghi chú'],
      ...this.duty.schedules().map(schedule => {
        const names = this.namesFor(schedule);
        const unresolved = this.unresolvedFor(schedule);
        return [
          schedule.date,
          schedule.startTime,
          schedule.status === 'cancelled' ? 'Đã hủy' : (schedule.needsVerification ? 'Cần xác minh' : 'Đang áp dụng'),
          names.join('; '),
          unresolved.join('; '),
          names[0] || '',
          schedule.sourceAssignees || '',
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

  @HostListener('window:keydown', ['$event'])
  handlePrintShortcut(event: KeyboardEvent): void {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLocaleLowerCase() !== 'p') return;
    if (this.activeView() !== 'schedule' || this.scheduleModalOpen() || this.batchModalOpen() || this.staffModalOpen()) return;
    event.preventDefault();
    this.printSchedule();
  }

  printSchedule(): void {
    const printContainer = document.getElementById('print-container');
    if (!printContainer) {
      this.toast.show('Không tìm thấy vùng in của ứng dụng.', 'error');
      return;
    }

    const myStaffId = this.myStaffId();
    const schedules = activeDutySchedules(this.duty.schedules())
      .filter(schedule => !this.myShiftsOnly() || (!!myStaffId && schedule.staffIds.includes(myStaffId)));
    const month = this.selectedMonth();
    const periodLabel = month
      ? `THÁNG ${this.formatMonth(month)}/${this.selectedYear()}`
      : `NĂM ${this.selectedYear()}`;
    const personalLabel = this.myShiftsOnly() && this.myStaff()
      ? `CÁ NHÂN - ${this.myStaff()!.displayName.toLocaleUpperCase('vi-VN')}`
      : '';
    const title = `LỊCH TRỰC ĐÊM ${periodLabel} - PHÒNG KIỂM NGHIỆM`;
    const rows = schedules.map(schedule => {
      const names = this.namesFor(schedule);
      const unresolved = this.unresolvedFor(schedule);
      const coordination = [...names.slice(1), ...unresolved.map(label => `⚠ ${label || '?'}`)];
      return `
        <tr>
          <td>${this.escapeHtml(this.formatPrintDate(schedule.date))}</td>
          <td>${this.escapeHtml(this.weekdayLabel(schedule.date))}</td>
          <td class="time">${this.escapeHtml(schedule.startTime || '18:00')}</td>
          <td class="lead">${this.escapeHtml(names[0] || 'Chưa phân công')}</td>
          <td>${this.escapeHtml(coordination.join(', ') || '—')}</td>
          <td>${this.escapeHtml([schedule.needsVerification ? 'CẦN XÁC MINH' : '', schedule.note || ''].filter(Boolean).join(' · '))}</td>
        </tr>`;
    }).join('');
    const generatedAt = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date());

    printContainer.innerHTML = `
      <style>
        @media print {
          @page { size: A4 landscape; margin: 10mm; }
          html, body { width: auto !important; height: auto !important; margin: 0 !important; padding: 0 !important; background: #fff !important; }
          #print-container { position: relative !important; width: auto !important; height: auto !important; inset: auto !important; overflow: visible !important; }
        }
        .duty-print-document { color: #111827; background: #fff; font-family: Arial, "Times New Roman", sans-serif; font-size: 10.5pt; }
        .duty-print-header { text-align: center; margin-bottom: 7mm; }
        .duty-print-header h1 { margin: 0; font-size: 16pt; line-height: 1.3; font-weight: 800; }
        .duty-print-header .personal { margin-top: 2mm; font-size: 11pt; font-weight: 700; }
        .duty-print-header .meta { margin-top: 2mm; color: #4b5563; font-size: 8.5pt; }
        .duty-print-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .duty-print-table thead { display: table-header-group; }
        .duty-print-table tr { break-inside: avoid; page-break-inside: avoid; }
        .duty-print-table th, .duty-print-table td { border: 1px solid #374151; padding: 2.4mm 2mm; vertical-align: top; overflow-wrap: anywhere; }
        .duty-print-table th { background: #f3f4f6; text-align: center; font-size: 9pt; font-weight: 800; }
        .duty-print-table td:nth-child(1) { width: 13%; text-align: center; white-space: nowrap; }
        .duty-print-table td:nth-child(2) { width: 10%; text-align: center; white-space: nowrap; }
        .duty-print-table td:nth-child(3) { width: 9%; text-align: center; white-space: nowrap; }
        .duty-print-table td:nth-child(4) { width: 18%; }
        .duty-print-table td:nth-child(5) { width: 28%; }
        .duty-print-table td:nth-child(6) { width: 22%; }
        .duty-print-table .lead { font-weight: 700; }
        .duty-print-note { margin-top: 3mm; font-size: 8.5pt; color: #4b5563; }
        .duty-print-signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 30mm; margin-top: 10mm; text-align: center; break-inside: avoid; page-break-inside: avoid; }
        .duty-print-signatures strong { display: block; font-size: 10.5pt; }
        .duty-print-signatures span { display: block; margin-top: 18mm; font-size: 9pt; color: #6b7280; }
        .duty-print-empty { border: 1px solid #9ca3af; padding: 14mm; text-align: center; color: #6b7280; font-style: italic; }
      </style>
      <div class="duty-print-document">
        <header class="duty-print-header">
          <h1>${this.escapeHtml(title)}</h1>
          ${personalLabel ? `<div class="personal">${this.escapeHtml(personalLabel)}</div>` : ''}
          <div class="meta">Xuất lúc ${this.escapeHtml(generatedAt)} · ★ Người chủ trì là người đầu tiên trong phân công</div>
        </header>
        ${rows ? `
          <table class="duty-print-table">
            <thead><tr><th>Ngày</th><th>Thứ</th><th>Giờ</th><th>Người chủ trì (★)</th><th>Nhân viên phối hợp</th><th>Ghi chú</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>` : '<div class="duty-print-empty">Chưa có ca trực đang áp dụng trong phạm vi này.</div>'}
        <div class="duty-print-note">Bản in được xuất từ hệ thống LIMS. Các ca đã hủy không hiển thị trên lịch chính thức.</div>
        <footer class="duty-print-signatures">
          <div><strong>NGƯỜI LẬP LỊCH</strong><span>(Ký, ghi rõ họ tên)</span></div>
          <div><strong>LÃNH ĐẠO PHÊ DUYỆT</strong><span>(Ký, ghi rõ họ tên)</span></div>
        </footer>
      </div>`;

    document.body.classList.add('duty-schedule-printing');
    const cleanup = () => {
      document.body.classList.remove('duty-schedule-printing');
      printContainer.innerHTML = '';
    };
    window.addEventListener('afterprint', cleanup, { once: true });
    try {
      window.print();
    } catch (error) {
      cleanup();
      this.toast.show(`Không thể mở hộp thoại in: ${this.errorMessage(error)}`, 'error');
    }
  }

  private refreshRange(): void {
    const month = this.selectedMonth();
    const statsMode = this.activeView() === 'stats' ? this.statsRangeMode() : 'selection';
    const range = statsMode === 'all'
      ? { start: '2000-01-01', end: '2200-12-31' }
      : statsMode === 'year'
        ? dutyYearRange(this.selectedYear())
        : month
          ? dutyMonthRange(`${this.selectedYear()}-${String(month).padStart(2, '0')}`)
          : dutyYearRange(this.selectedYear());
    this.duty.watchRange(range.start, range.end);
  }

  private isMobileViewport(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  private async refreshScheduleConflictContext(): Promise<void> {
    const requestId = ++this.conflictRequestId;
    const date = this.scheduleDraft.date;
    if (!isDutyDateKey(date)) {
      this.conflictSchedules.set([]);
      this.conflictLoading.set(false);
      return;
    }

    const adjacentDates = [shiftDutyDateKey(date, -1), shiftDutyDateKey(date, 1)];
    const adjacentSet = new Set(adjacentDates);
    const local = this.duty.schedules().filter(schedule => adjacentSet.has(schedule.date));
    const localDates = new Set(local.map(schedule => schedule.date));
    const range = this.duty.activeRange();
    const canTrustRange = !this.duty.loadingSchedules() && Boolean(range);
    const missingDates = adjacentDates.filter(candidate => {
      if (localDates.has(candidate)) return false;
      if (canTrustRange && range && candidate >= range.start && candidate <= range.end) return false;
      return true;
    });

    this.conflictSchedules.set(local);
    if (missingDates.length === 0) {
      this.conflictLoading.set(false);
      return;
    }

    this.conflictLoading.set(true);
    try {
      const fetched = await this.duty.loadScheduleDates(missingDates);
      if (requestId !== this.conflictRequestId) return;
      const byDate = new Map([...local, ...fetched].map(schedule => [schedule.date, schedule]));
      this.conflictSchedules.set([...byDate.values()]);
    } catch (error) {
      if (requestId === this.conflictRequestId) {
        this.toast.show(`Không kiểm tra được đầy đủ ca liền kề: ${this.errorMessage(error)}`, 'warning');
      }
    } finally {
      if (requestId === this.conflictRequestId) this.conflictLoading.set(false);
    }
  }

  private async refreshRecommendationContext(): Promise<void> {
    const requestId = ++this.recommendationRequestId;
    const date = this.scheduleDraft.date;
    if (!isDutyDateKey(date)) {
      this.rollingSchedules.set([]);
      this.rollingLoading.set(false);
      return;
    }

    const range = dutyRolling90Range(date);
    const activeRange = this.duty.activeRange();
    const canUseLocalRange = !this.duty.loadingSchedules()
      && Boolean(activeRange)
      && !!activeRange
      && range.start >= activeRange.start
      && range.end <= activeRange.end;

    if (canUseLocalRange) {
      this.rollingSchedules.set(this.duty.schedules().filter(schedule =>
        schedule.date >= range.start && schedule.date <= range.end,
      ));
      this.rollingLoading.set(false);
      return;
    }

    this.rollingLoading.set(true);
    try {
      const schedules = await this.duty.loadScheduleRange(range.start, range.end);
      if (requestId !== this.recommendationRequestId) return;
      this.rollingSchedules.set(schedules);
    } catch (error) {
      if (requestId === this.recommendationRequestId) {
        this.rollingSchedules.set([]);
        this.toast.show(`Không tải được dữ liệu 90 ngày để gợi ý phân công: ${this.errorMessage(error)}`, 'warning');
      }
    } finally {
      if (requestId === this.recommendationRequestId) this.rollingLoading.set(false);
    }
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
      unresolvedAssignees: [],
      needsVerification: false,
      sourceAssignees: '',
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

  private formatPrintDate(dateKey: string): string {
    return `${dateKey.slice(8, 10)}/${dateKey.slice(5, 7)}/${dateKey.slice(0, 4)}`;
  }

  private weekdayLabel(dateKey: string): string {
    const weekday = new Date(`${dateKey}T12:00:00+07:00`).getDay();
    return weekday === 0 ? 'Chủ nhật' : `Thứ ${weekday + 1}`;
  }

  private escapeHtml(value: string): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
