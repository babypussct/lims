import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

export type HeaderSyncStatus = 'synced' | 'modified' | 'saving' | 'error';

@Component({
  selector: 'app-header-sync',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (status()) {
      @case ('saving') {
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50/80 px-2.5 py-1 text-xs font-semibold text-fuchsia-600 shadow-2xs dark:bg-fuchsia-950/40 dark:text-fuchsia-400"
          role="status"
          aria-live="polite">
          <i class="fa-solid fa-spinner animate-spin text-[11px]" aria-hidden="true"></i>
          <span>Đang lưu…</span>
        </span>
      }

      @case ('modified') {
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-2xs dark:bg-amber-950/40 dark:text-amber-300"
          role="status">
          <span class="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>
          <span>Có thay đổi chưa lưu</span>
        </span>
      }

      @case ('error') {
        <button
          type="button"
          (click)="retry.emit()"
          class="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 shadow-2xs transition hover:bg-rose-100 active:scale-95 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-900/50"
          title="Nhấn để lưu lại">
          <i class="fa-solid fa-circle-exclamation text-[11px]" aria-hidden="true"></i>
          <span>Lưu thất bại · Thử lại</span>
        </button>
      }

      @default {
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-2xs dark:bg-emerald-950/40 dark:text-emerald-300"
          role="status">
          <i class="fa-solid fa-check text-[11px]" aria-hidden="true"></i>
          <span>{{ displaySavedText() }}</span>
        </span>
      }
    }
  `,
})
export class AppHeaderSyncComponent {
  status = input<HeaderSyncStatus>('synced');
  lastSavedAt = input<Date | null>(null);

  @Output() retry = new EventEmitter<void>();

  constructor(private datePipe: DatePipe) {}

  displaySavedText = computed(() => {
    const date = this.lastSavedAt();
    if (!date) return 'Đã lưu';
    const formatted = this.datePipe.transform(date, 'HH:mm');
    return formatted ? `Đã lưu ${formatted}` : 'Đã lưu';
  });
}
