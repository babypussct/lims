import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { AppButtonComponent } from '../../shared/components/ui';
import { DutyScheduleService } from './duty-schedule.service';
import { DutyShiftSwapService } from './duty-shift-swap.service';
import type { DutySwapRequest, DutySwapRequestStatus } from './duty-shift-swap.model';
import { dutySwapExpiresAtMillis, isDutySwapExpired } from './duty-shift-swap.utils';

@Component({
  selector: 'app-duty-shift-swap-panel',
  standalone: true,
  imports: [FormsModule, AppButtonComponent],
  templateUrl: './duty-shift-swap-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyShiftSwapPanelComponent {
  readonly duty = inject(DutyScheduleService);
  readonly swap = inject(DutyShiftSwapService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly expanded = signal(false);
  readonly actionBusyId = signal('');
  readonly directOpen = signal(false);
  readonly directDate = signal('');
  readonly directOutgoingStaffId = signal('');
  readonly directIncomingStaffId = signal('');
  readonly directReason = signal('');
  readonly adminSwapOpen = signal(false);
  readonly adminSwapSourceDate = signal('');
  readonly adminSwapSourceStaffId = signal('');
  readonly adminSwapTargetDate = signal('');
  readonly adminSwapTargetStaffId = signal('');
  readonly adminSwapReason = signal('');

  readonly currentUid = computed(() => this.auth.currentUser()?.uid || '');
  readonly visibleRequests = computed(() => this.swap.requests().slice(0, this.expanded() ? 20 : 4));
  readonly actionableCount = computed(() => this.swap.requests().filter(item => this.isActionable(item)).length);
  readonly directSchedule = computed(() => this.duty.schedules().find(item => item.date === this.directDate() && item.status === 'planned'));
  readonly directIncomingStaff = computed(() => this.duty.staff().filter(item => item.active && item.id !== this.directOutgoingStaffId()));
  readonly adminSwapSource = computed(() => this.duty.schedules().find(item => item.date === this.adminSwapSourceDate() && item.status === 'planned'));
  readonly adminSwapSourceStaff = computed(() => (this.adminSwapSource()?.staffIds || []).filter(id => this.isActiveStaff(id)));
  readonly adminSwapTargetSchedules = computed(() => {
    const source = this.adminSwapSource();
    const personId = this.adminSwapSourceStaffId();
    if (!source || !source.staffIds.includes(personId)) return [];
    return this.duty.schedules()
      .filter(item => item.status === 'planned' && item.date !== source.date
        && !item.staffIds.includes(personId)
        && item.staffIds.some(id => !source.staffIds.includes(id) && this.isActiveStaff(id)))
      .sort((a, b) => a.date.localeCompare(b.date));
  });
  readonly adminSwapTarget = computed(() => this.adminSwapTargetSchedules().find(item => item.date === this.adminSwapTargetDate()));
  readonly adminSwapTargetStaff = computed(() => (this.adminSwapTarget()?.staffIds || [])
    .filter(id => !this.adminSwapSource()?.staffIds.includes(id) && this.isActiveStaff(id)));
  readonly canSubmitAdminSwap = computed(() => !!this.adminSwapSourceStaffId()
    && this.adminSwapSourceStaff().includes(this.adminSwapSourceStaffId())
    && this.adminSwapTargetStaff().includes(this.adminSwapTargetStaffId()));

  constructor() {
    this.swap.watchRelevantRequests();
  }

  statusLabel(request: DutySwapRequest): string {
    if (isDutySwapExpired(request.expiresAt) && this.swap.isPending(request)) return 'Đã hết hạn';
    const labels: Record<DutySwapRequestStatus, string> = {
      PENDING_TARGET: 'Chờ đồng nghiệp',
      PENDING_MANAGER: 'Chờ quản lý',
      APPROVED: 'Đã duyệt',
      REJECTED_TARGET: 'Đồng nghiệp từ chối',
      REJECTED_MANAGER: 'Quản lý từ chối',
      CANCELLED: 'Đã hủy',
      EXPIRED: 'Đã hết hạn',
    };
    return labels[request.status];
  }

  statusClass(request: DutySwapRequest): string {
    if (isDutySwapExpired(request.expiresAt) && this.swap.isPending(request)) return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300';
    if (request.status === 'APPROVED') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300';
    if (request.status === 'PENDING_TARGET' || request.status === 'PENDING_MANAGER') return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300';
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300';
  }

  requestLabel(request: DutySwapRequest): string {
    return request.type === 'SWAP'
      ? `${request.sourceDate} ↔ ${request.targetDate}`
      : `${request.sourceDate} · trực hộ`;
  }

  expiresLabel(request: DutySwapRequest): string {
    const millis = dutySwapExpiresAtMillis(request.expiresAt);
    if (!millis) return '';
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(millis));
  }

  isActionable(request: DutySwapRequest): boolean {
    if (isDutySwapExpired(request.expiresAt)) return false;
    return this.swap.canTargetRespond(request)
      || this.swap.canRequesterCancel(request)
      || (this.duty.canManage() && request.status === 'PENDING_MANAGER');
  }

  isExpired(request: DutySwapRequest): boolean {
    return isDutySwapExpired(request.expiresAt);
  }

  async targetDecision(request: DutySwapRequest, accept: boolean): Promise<void> {
    await this.perform(request.id, () => this.swap.respondAsTarget(request, accept));
  }

  async managerDecision(request: DutySwapRequest, approve: boolean): Promise<void> {
    await this.perform(request.id, () => this.swap.decideAsManager(request, approve));
  }

  async cancel(request: DutySwapRequest): Promise<void> {
    await this.perform(request.id, () => this.swap.cancelOwnRequest(request));
  }

  async expire(request: DutySwapRequest): Promise<void> {
    await this.perform(request.id, () => this.swap.expireIfNeeded(request));
  }

  chooseDirectDate(date: string): void {
    this.directDate.set(date);
    this.directOutgoingStaffId.set('');
    this.directIncomingStaffId.set('');
  }

  chooseDirectOutgoing(staffId: string): void {
    this.directOutgoingStaffId.set(staffId);
    this.directIncomingStaffId.set('');
  }

  toggleDirect(): void {
    this.directOpen.update(open => !open);
    this.adminSwapOpen.set(false);
  }

  toggleAdminSwap(): void {
    this.adminSwapOpen.update(open => !open);
    this.directOpen.set(false);
  }

  chooseAdminSwapSourceDate(date: string): void {
    this.adminSwapSourceDate.set(date);
    this.chooseAdminSwapSourceStaff('');
  }

  chooseAdminSwapSourceStaff(staffId: string): void {
    this.adminSwapSourceStaffId.set(staffId);
    this.chooseAdminSwapTargetDate('');
  }

  chooseAdminSwapTargetDate(date: string): void {
    this.adminSwapTargetDate.set(date);
    this.adminSwapTargetStaffId.set('');
  }

  positionLabel(staffIds: readonly string[], staffId: string): string {
    const index = staffIds.indexOf(staffId);
    return index === 0 ? 'Chủ trì' : index > 0 ? `Vị trí ${index + 1}` : '';
  }

  private isActiveStaff(staffId: string): boolean {
    return this.duty.staff().some(item => item.id === staffId && item.active);
  }

  staffName(staffId: string): string {
    return this.duty.staff().find(item => item.id === staffId)?.displayName || staffId;
  }

  async submitDirect(): Promise<void> {
    if (!this.directDate() || !this.directOutgoingStaffId() || !this.directIncomingStaffId()) return;
    this.actionBusyId.set('direct');
    try {
      await this.swap.directReplace(
        this.directDate(),
        this.directOutgoingStaffId(),
        this.directIncomingStaffId(),
        this.directReason(),
      );
      this.toast.show('Đã đổi ca trực tiếp và giữ nguyên vị trí vai trò trong ca.', 'success');
      this.directOpen.set(false);
      this.directDate.set('');
      this.directOutgoingStaffId.set('');
      this.directIncomingStaffId.set('');
      this.directReason.set('');
    } catch (error) {
      console.error('[DutyShiftSwap] Không thể đổi ca trực tiếp:', error);
      this.toast.show('Không thể lưu thay đổi. Vui lòng thử lại.', 'error');
    } finally {
      this.actionBusyId.set('');
    }
  }

  async submitAdminSwap(): Promise<void> {
    if (!this.canSubmitAdminSwap() || this.actionBusyId()) return;
    this.actionBusyId.set('admin-swap');
    try {
      await this.swap.directSwap(
        this.adminSwapSourceDate(),
        this.adminSwapSourceStaffId(),
        this.adminSwapTargetDate(),
        this.adminSwapTargetStaffId(),
        this.adminSwapReason(),
      );
      this.toast.show('Đã hoán đổi hai người giữa hai ca, giữ nguyên vị trí phân công.', 'success');
      this.adminSwapOpen.set(false);
      this.adminSwapSourceDate.set('');
      this.chooseAdminSwapSourceStaff('');
      this.adminSwapReason.set('');
    } catch (error) {
      console.error('[DutyShiftSwap] Không thể hoán đổi hai ca trực tiếp:', error);
      this.toast.show(error instanceof Error ? error.message : 'Không thể lưu thay đổi. Vui lòng thử lại.', 'error');
    } finally {
      this.actionBusyId.set('');
    }
  }

  private async perform(id: string, action: () => Promise<unknown>): Promise<void> {
    if (this.actionBusyId()) return;
    this.actionBusyId.set(id);
    try {
      await action();
      this.toast.show('Đã cập nhật yêu cầu đổi ca.', 'success');
    } catch (error) {
      console.error('[DutyShiftSwap] Không thể cập nhật yêu cầu đổi ca:', error);
      this.toast.show('Không thể lưu thay đổi. Vui lòng thử lại.', 'error');
    } finally {
      this.actionBusyId.set('');
    }
  }
}
