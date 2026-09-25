import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { AppButtonComponent, AppModalShellComponent } from '../../shared/components/ui';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import { DutyShiftSwapService } from './duty-shift-swap.service';
import type { DutySwapRequestType } from './duty-shift-swap.model';

@Component({
  selector: 'app-duty-shift-swap-request',
  standalone: true,
  imports: [FormsModule, AppButtonComponent, AppModalShellComponent],
  templateUrl: './duty-shift-swap-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyShiftSwapRequestComponent {
  private readonly swap = inject(DutyShiftSwapService);
  private readonly toast = inject(ToastService);

  @Input({ required: true }) sourceSchedule!: DutyScheduleEntry;
  @Input({ required: true }) schedules: readonly DutyScheduleEntry[] = [];
  @Input({ required: true }) staff: readonly DutyStaff[] = [];
  @Input({ required: true }) requesterStaffId = '';
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  readonly type = signal<DutySwapRequestType>('SWAP');
  readonly targetStaffId = signal('');
  readonly targetDate = signal('');
  readonly reason = signal('');
  readonly busy = signal(false);

  readonly candidates = computed(() => this.staff
    .filter(item => item.active && item.id !== this.requesterStaffId && Boolean(item.linkedUserUid))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'vi')));

  readonly targetSchedules = computed(() => {
    const targetStaffId = this.targetStaffId();
    if (!targetStaffId) return [];
    return this.schedules
      .filter(item => item.status === 'planned'
        && item.date !== this.sourceSchedule.date
        && item.staffIds.includes(targetStaffId)
        && !item.staffIds.includes(this.requesterStaffId))
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  setType(value: DutySwapRequestType): void {
    this.type.set(value);
    if (value === 'COVER') this.targetDate.set('');
  }

  setTarget(staffId: string): void {
    this.targetStaffId.set(staffId);
    this.targetDate.set('');
  }

  async submit(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await this.swap.createRequest({
        type: this.type(),
        sourceDate: this.sourceSchedule.date,
        targetStaffId: this.targetStaffId(),
        targetDate: this.type() === 'SWAP' ? this.targetDate() : undefined,
        reason: this.reason(),
      });
      this.toast.show('Đã gửi yêu cầu đổi ca cho đồng nghiệp xác nhận.', 'success');
      this.submitted.emit();
      this.closed.emit();
    } catch (error) {
      console.error('[DutyShiftSwap] Không thể gửi yêu cầu đổi ca:', error);
      this.toast.show('Không thể lưu thay đổi. Vui lòng thử lại.', 'error');
    } finally {
      this.busy.set(false);
    }
  }

  canSubmit(): boolean {
    return Boolean(
      this.targetStaffId()
      && this.reason().trim()
      && (this.type() === 'COVER' || this.targetDate()),
    );
  }
}
