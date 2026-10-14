import { Component, computed, input, output } from '@angular/core';
import { AppButtonComponent, AppModalShellComponent } from '../../../shared/components/ui';

export type ReportPublishState = 'working' | 'success' | 'error' | 'timeout';

@Component({
  selector: 'app-report-publish-progress-modal',
  standalone: true,
  imports: [AppButtonComponent, AppModalShellComponent],
  template: `
    <app-modal-shell
      title="ĐANG XUẤT BẢN REPORT"
      description="Theo dõi quá trình tạo báo cáo PDF"
      size="sm"
      [closeOnBackdrop]="false"
      [showFooter]="state() !== 'working'"
      [closeDisabled]="state() === 'working'"
      (closed)="closed.emit()">
      <div modalBody class="space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span>Đã chờ: <span class="font-mono tabular-nums">{{ elapsedLabel() }}</span></span>
          @if (chunkCount() > 1) {
            <span>Phiếu {{ chunkIndex() }}/{{ chunkCount() }}</span>
          }
        </div>

        @if (state() === 'working') {
          <div class="h-2 w-full overflow-hidden rounded-full bg-fuchsia-100 dark:bg-fuchsia-950/60"
               role="progressbar" aria-label="Đang xuất bản báo cáo">
            <div class="report-progress-indeterminate h-full rounded-full bg-fuchsia-600 dark:bg-fuchsia-400"></div>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300" role="status">
            Hệ thống vẫn đang làm việc. Vui lòng giữ trang này mở trong khi chờ Google Apps Script trả PDF.
          </p>
        } @else if (state() === 'success') {
          <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300" role="status">
            <i class="fa-solid fa-circle-check mr-2" aria-hidden="true"></i>Xuất bản thành công.
          </div>
        } @else {
          <div class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" role="alert">
            <p class="font-bold">{{ state() === 'timeout' ? 'Hết thời gian chờ' : 'Không thể xuất bản báo cáo' }}</p>
            <p class="mt-1 whitespace-pre-wrap break-words">{{ error() }}</p>
          </div>
        }

        <ol class="space-y-3" aria-label="Các bước xuất bản">
          @for (step of steps; track $index; let idx = $index) {
            <li class="flex items-start gap-3 text-sm"
                [class.text-fuchsia-700]="state() === 'working' && stepIndex() === idx"
                [class.dark:text-fuchsia-300]="state() === 'working' && stepIndex() === idx"
                [class.text-slate-500]="stepIndex() < idx"
                [attr.aria-current]="state() === 'working' && stepIndex() === idx ? 'step' : null">
              <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                    [class.border-emerald-300]="stepIndex() > idx || state() === 'success'"
                    [class.text-emerald-600]="stepIndex() > idx || state() === 'success'"
                    [class.border-fuchsia-400]="state() === 'working' && stepIndex() === idx">
                @if (stepIndex() > idx || state() === 'success') {
                  <i class="fa-solid fa-check" aria-hidden="true"></i>
                } @else if (stepIndex() === idx && state() === 'working') {
                  <i class="fa-solid fa-spinner animate-spin" aria-hidden="true"></i>
                } @else {
                  {{ idx + 1 }}
                }
              </span>
              <span class="min-w-0 pt-0.5" [class.font-bold]="stepIndex() === idx">
                {{ step }}
              </span>
            </li>
          }
        </ol>
      </div>
      @if (state() !== 'working') {
        <div modalFooter class="flex flex-wrap justify-end gap-2">
          <app-button variant="secondary" (click)="closed.emit()">Đóng</app-button>
          @if (state() === 'success' && pdfAvailable()) {
            <app-button variant="primary" (click)="preview.emit()">Xem PDF</app-button>
          } @else if (state() === 'error' || state() === 'timeout') {
            <app-button variant="primary" (click)="retry.emit()">Thử lại</app-button>
          }
        </div>
      }
    </app-modal-shell>
  `,
  styles: `
    .report-progress-indeterminate {
      width: 30%;
      animation: report-progress-travel 1.7s ease-in-out infinite;
    }
    @keyframes report-progress-travel {
      from { transform: translateX(-110%); }
      to { transform: translateX(350%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .report-progress-indeterminate { animation: none; width: 100%; }
    }
  `
})
export class ReportPublishProgressModalComponent {
  state = input.required<ReportPublishState>();
  stepIndex = input(0);
  elapsedSeconds = input(0);
  chunkIndex = input(1);
  chunkCount = input(1);
  error = input('');
  pdfAvailable = input(false);
  retry = output<void>();
  preview = output<void>();
  closed = output<void>();

  readonly steps = [
    'Đang chuẩn bị dữ liệu',
    'Đang gửi yêu cầu đến GAS',
    'Đang xử lý và chờ phản hồi PDF',
    'Đã nhận PDF',
    'Xuất bản thành công'
  ];

  readonly elapsedLabel = computed(() => {
    const seconds = Math.max(0, this.elapsedSeconds());
    return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  });
}
