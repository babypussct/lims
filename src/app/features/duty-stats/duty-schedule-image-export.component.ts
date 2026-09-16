import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { AppButtonComponent } from '../../shared/components/ui';
import { ToastService } from '../../core/services/toast.service';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import { resolveDutyStaffNames } from './duty-schedule.utils';

@Component({
  selector: 'app-duty-schedule-image-export',
  standalone: true,
  imports: [AppButtonComponent],
  templateUrl: './duty-schedule-image-export.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyScheduleImageExportComponent {
  readonly dates = input.required<readonly string[]>();
  readonly schedules = input.required<readonly DutyScheduleEntry[]>();
  readonly staff = input.required<readonly DutyStaff[]>();
  readonly periodLabel = input.required<string>();
  readonly mode = input.required<'week' | 'month'>();
  readonly compact = input(false);
  readonly busy = signal(false);
  private readonly toast = inject(ToastService);
  private readonly exportTemplate = viewChild<ElementRef<HTMLElement>>('exportTemplate');

  readonly activeRows = computed(() => {
    const byDate = new Map(this.schedules().filter(item => item.status !== 'cancelled').map(item => [item.date, item]));
    return this.dates().map(date => ({ date, schedule: byDate.get(date) }));
  });

  namesFor(schedule: DutyScheduleEntry): string[] {
    return resolveDutyStaffNames(schedule, this.staff());
  }

  unresolvedFor(schedule: DutyScheduleEntry): string[] {
    return schedule.unresolvedAssignees || [];
  }

  weekdayLabel(dateKey: string): string {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Intl.DateTimeFormat('vi-VN', { weekday: 'short', timeZone: 'UTC' })
      .format(new Date(Date.UTC(year, month - 1, day)));
  }

  isWeekend(dateKey: string): boolean {
    const [year, month, day] = dateKey.split('-').map(Number);
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    return weekday === 0 || weekday === 6;
  }

  async copyImage(): Promise<void> {
    const blob = await this.renderPng();
    if (!blob) return;
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('clipboard-image-unsupported');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      this.toast.show('Đã sao chép ảnh lịch. Có thể dán trực tiếp vào Zalo Web.', 'success');
    } catch {
      this.downloadBlob(blob);
      this.toast.show('Trình duyệt không hỗ trợ sao chép ảnh; LIMS đã tải PNG thay thế.', 'info');
    }
  }

  async downloadImage(): Promise<void> {
    const blob = await this.renderPng();
    if (!blob) return;
    this.downloadBlob(blob);
    this.toast.show('Đã tải ảnh PNG lịch trực.', 'success');
  }

  private async renderPng(): Promise<Blob | null> {
    const element = this.exportTemplate()?.nativeElement;
    if (!element || this.busy()) return null;
    this.busy.set(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });
      return await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 1));
    } catch {
      this.toast.show('Không thể kết xuất ảnh lịch trực.', 'error');
      return null;
    } finally {
      this.busy.set(false);
    }
  }

  private downloadBlob(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = this.fileName();
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private fileName(): string {
    const normalized = this.periodLabel()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .toLocaleLowerCase('vi');
    return `lich-truc-${normalized || 'lims'}.png`;
  }
}
