import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  StandardCodeRecallExecutionResult,
  StandardCodeRecallItem,
  StandardCodeRecallReport,
} from '../../../core/models/standard.model';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { StandardCodeRecallProgress, StandardCodeRecallService } from '../services/standard-code-recall.service';

/** Manager surface for scanning and returning codes owned by hidden records. */
@Component({
  selector: 'app-standards-hidden-code-recall-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModalShellComponent],
  template: `
    @if (isOpen()) {
      <app-modal-shell
        title="Thu hồi mã chuẩn đã ẩn"
        description="Rà soát toàn bộ hồ sơ đã ẩn và trả mã đủ điều kiện về kho mã chung để cấp lại. Ẩn hồ sơ không tự giải phóng mã."
        size="2xl"
        [closeOnBackdrop]="false"
        [closeDisabled]="isBusy()"
        (closed)="close.emit()"
      >
        <div modalBody class="-mx-6 -my-5 flex h-full min-h-0 flex-col">
          <div class="px-5 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/20 shrink-0">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="text-xs text-amber-900 dark:text-amber-100 max-w-3xl">
                <div class="font-black uppercase tracking-wide text-[10px] mb-1"><i class="fa-solid fa-shield-halved mr-1"></i>Kiểm tra an toàn trước khi ghi</div>
                <p>Chỉ hồ sơ đã ẩn, sạch quy trình và còn đúng quyền sở hữu mới được xử lý. Mã đã cấp cho chuẩn khác, mã xung đột hoặc dữ liệu thiếu bằng chứng sẽ bị chặn để đối soát.</p>
              </div>
              <div class="flex flex-wrap gap-2 shrink-0">
                <button type="button" (click)="exportReport()" [disabled]="!report() || isBusy()" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-black disabled:opacity-40">
                  <i class="fa-solid fa-download mr-1"></i>Xuất báo cáo
                </button>
                <button type="button" (click)="scan()" [disabled]="isBusy()" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-black disabled:opacity-40">
                  @if (isScanning()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang quét } @else { <i class="fa-solid fa-rotate mr-1"></i>Quét lại }
                </button>
              </div>
            </div>
          </div>

          <div class="px-5 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0 space-y-3">
            <label class="block text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400" for="hidden-code-recall-reason">Lý do thu hồi</label>
            <input id="hidden-code-recall-reason" type="text" [ngModel]="reason()" (ngModelChange)="reason.set($event)" [disabled]="isBusy()" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/40" placeholder="Ví dụ: Thu hồi mã của chuẩn đã ẩn theo kế hoạch vòng đời mã nội bộ" maxlength="500">
            @if (report(); as current) {
              <div class="flex flex-wrap gap-2 text-[11px] font-bold" aria-live="polite">
                <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-600 dark:text-slate-300">{{current.summary.hiddenStandards}} hồ sơ đã ẩn</span>
                <span class="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">{{current.summary.eligibleCodes}} mã đủ điều kiện</span>
                <span class="rounded-full bg-sky-50 dark:bg-sky-950/30 px-2.5 py-1 text-sky-700 dark:text-sky-300">{{current.summary.toReconcile}} cần hoàn tất đối soát</span>
                <span class="rounded-full bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 text-amber-700 dark:text-amber-300">{{current.summary.alreadyReleased}} đã xử lý</span>
                <span class="rounded-full bg-red-50 dark:bg-red-950/30 px-2.5 py-1 text-red-700 dark:text-red-300">{{current.summary.blocked}} bị chặn</span>
                <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-500 dark:text-slate-400">{{current.summary.excludedSpecial}} SDHET loại khỏi kho chung</span>
              </div>
            }
          </div>

          @if (progress(); as currentProgress) {
            <div class="px-5 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0" aria-live="polite">
              <div class="flex justify-between gap-3 text-xs font-black text-amber-700 dark:text-amber-300"><span>{{currentProgress.message}}</span><span>{{currentProgress.percent}}%</span></div>
              <div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div class="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all" [style.width.%]="currentProgress.percent"></div></div>
              <div class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{{currentProgress.current}} / {{currentProgress.total}} mã trong phạm vi xử lý</div>
            </div>
          }

          @if (errorMessage()) {
            <div class="mx-5 sm:mx-6 mt-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 px-4 py-3 text-xs font-bold">{{errorMessage()}}</div>
          }

          <div class="flex-1 min-h-0 overflow-auto custom-scrollbar p-5 sm:p-6 space-y-3 bg-slate-50/60 dark:bg-slate-950/30">
            @if (!report() && isScanning()) {
              <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center text-sm font-bold text-slate-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang đọc hồ sơ ẩn, sổ mã và yêu cầu mở...</div>
            } @else if (!report()) {
              <div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center text-sm font-bold text-slate-500">Chưa có kết quả quét.</div>
            } @else if (filteredItems().length === 0) {
              <div class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-8 text-center text-sm font-bold text-emerald-700 dark:text-emerald-300">Không có hồ sơ phù hợp với bộ lọc hiện tại.</div>
            } @else {
              <div class="flex flex-wrap items-center justify-between gap-2">
                <input type="search" aria-label="Tìm trong phạm vi thu hồi" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Tìm mã, tên, lô hoặc lý do..." class="min-w-[240px] flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500/40">
                <span class="text-[11px] font-bold text-slate-500">Hiển thị {{filteredItems().length}} / {{report()!.items.length}}</span>
              </div>
              <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <table class="w-full min-w-[860px] text-left text-xs">
                  <thead class="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <tr><th class="px-3 py-2.5">Mã / hồ sơ</th><th class="px-3 py-2.5">Vòng đời</th><th class="px-3 py-2.5">Sổ mã</th><th class="px-3 py-2.5">Workflow</th><th class="px-3 py-2.5">Kết quả dự kiến</th><th class="px-3 py-2.5">Lý do</th></tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    @for (item of filteredItems(); track item.id) {
                      <tr class="align-top hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td class="px-3 py-3"><div class="font-black text-slate-800 dark:text-slate-100">{{item.internalId || 'Thiếu mã'}}</div><div class="mt-0.5 font-semibold text-slate-600 dark:text-slate-300">{{item.standardName}}</div><div class="mt-0.5 text-[10px] text-slate-400">{{item.lotNumber || 'Không có số lô'}} · {{item.standardId}}</div></td>
                        <td class="px-3 py-3 font-bold text-slate-600 dark:text-slate-300">{{item.lifecycleStatus || 'Legacy'}}</td>
                        <td class="px-3 py-3 font-bold" [class.text-emerald-700]="item.registryStatus === 'AVAILABLE'" [class.text-amber-700]="item.registryStatus === 'ASSIGNED'" [class.text-red-700]="item.registryStatus === 'CONFLICT'">{{item.registryStatus}}</td>
                        <td class="px-3 py-3"><span [class]="item.workflowStatus === 'CLEAN' ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-red-700 dark:text-red-300 font-bold'">{{item.workflowStatus === 'CLEAN' ? 'Sạch' : 'Đang mở'}}</span></td>
                        <td class="px-3 py-3"><span [class]="statusClass(item.status)">{{statusLabel(item.status)}}</span></td>
                        <td class="px-3 py-3 max-w-[320px] text-slate-600 dark:text-slate-300 leading-5">{{item.message || item.reason}}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            @if (executionResults().length > 0) {
              <section class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-2">
                <h3 class="text-sm font-black text-slate-800 dark:text-slate-100"><i class="fa-solid fa-list-check mr-2 text-emerald-600"></i>Kết quả lần chạy gần nhất</h3>
                @for (result of executionResults(); track result.operationId) { <div class="flex items-start gap-2 text-xs"><span [class]="statusClass(result.status)">{{statusLabel(result.status)}}</span><span class="font-bold text-slate-700 dark:text-slate-200">{{result.internalId || 'Thiếu mã'}} · {{result.standardName}}</span><span class="text-slate-500 dark:text-slate-400">{{result.message || result.reason}}</span></div> }
              </section>
            }
          </div>

          <div modalFooter class="flex flex-wrap items-center justify-between gap-2">
            <div class="text-[11px] text-slate-500 dark:text-slate-400">@if (report()) { Mã hoạt động theo từng transaction; chạy lại không tạo event trả mã trùng. } @else { Hãy quét dữ liệu trước khi xác nhận. }</div>
            <div class="flex gap-2">
              @if (isRunning()) {
                <button type="button" (click)="stopRun()" class="px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800 text-sm font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30">Dừng sau giao dịch này</button>
              }
              <button type="button" (click)="close.emit()" [disabled]="isBusy()" class="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40">Đóng</button>
              <button type="button" (click)="recall()" [disabled]="!canRecall()" class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-black disabled:opacity-40">@if (isRunning()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang thu hồi... } @else { <i class="fa-solid fa-key mr-1"></i>Thu hồi mã đủ điều kiện }</button>
            </div>
          </div>
        </div>
      </app-modal-shell>
    }
  `,
})
export class StandardsHiddenCodeRecallModalComponent {
  isOpen = input(false);
  close = output<void>();

  private service = inject(StandardCodeRecallService);
  private confirmation = inject(ConfirmationService);
  private toast = inject(ToastService);
  private opened = false;

  report = signal<StandardCodeRecallReport | null>(null);
  executionResults = signal<StandardCodeRecallExecutionResult[]>([]);
  progress = signal<StandardCodeRecallProgress | null>(null);
  reason = signal('Thu hồi mã của chuẩn đã ẩn theo kế hoạch vòng đời mã nội bộ.');
  searchQuery = signal('');
  stopRequested = signal(false);
  isScanning = signal(false);
  isRunning = signal(false);
  errorMessage = signal('');
  isBusy = computed(() => this.isScanning() || this.isRunning());
  filteredItems = computed(() => {
    const current = this.report()?.items || [];
    const query = this.searchQuery().trim().toLocaleLowerCase('vi');
    if (!query) return current;
    return current.filter(item => [item.internalId, item.standardName, item.lotNumber, item.reason, item.status].some(value => String(value || '').toLocaleLowerCase('vi').includes(query)));
  });
  canRecall = computed(() => Boolean(this.report() && !this.isBusy() && this.reason().trim() && this.report()!.items.some(item => item.status === 'RELEASED' || item.status === 'RECONCILED')));

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) {
        this.opened = false;
        return;
      }
      if (!this.opened) {
        this.opened = true;
        void this.scan();
      }
    });
  }

  async scan(): Promise<void> {
    if (this.isBusy()) return;
    this.isScanning.set(true);
    this.errorMessage.set('');
    this.executionResults.set([]);
    this.progress.set({ current: 0, total: 0, percent: 0, phase: 'SCANNING', message: 'Đang đọc dữ liệu nguồn...' });
    try {
      const report = await this.service.scanHiddenStandardCodes();
      this.report.set(report);
      this.progress.set({ current: report.items.length, total: report.items.length, percent: 100, phase: 'READY', message: 'Đã quét xong; chưa ghi thay đổi.' });
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Không thể quét dữ liệu thu hồi mã.');
      this.progress.set(null);
    } finally {
      this.isScanning.set(false);
    }
  }

  async recall(): Promise<void> {
    const report = this.report();
    if (!report || !this.canRecall()) return;
    const confirmed = await this.confirmation.confirm({
      message: `Thu hồi ${report.summary.eligibleCodes} mã đủ điều kiện về kho mã chung? Các mục bị chặn sẽ không bị thay đổi.`,
      confirmText: 'Thu hồi mã',
      cancelText: 'Hủy',
      isDangerous: true,
    });
    if (!confirmed) return;
    this.stopRequested.set(false);
    this.isRunning.set(true);
    this.errorMessage.set('');
    try {
      const results = await this.service.recallEligibleCodes(report, this.reason(), {
        onProgress: value => this.progress.set(value),
        shouldStop: () => this.stopRequested(),
      });
      this.executionResults.set(results);
      const released = results.filter(result => result.status === 'RELEASED').length;
      const reconciled = results.filter(result => result.status === 'RECONCILED').length;
      const blocked = results.filter(result => ['BLOCKED', 'FAILED', 'CHANGED_SINCE_SCAN'].includes(result.status)).length;
      const wasStopped = this.progress()?.phase === 'STOPPED';
      this.toast.show(wasStopped
        ? `Đã dừng sau khi xử lý ${released + reconciled} mã${blocked ? `; ${blocked} mục cần xử lý` : ''}.`
        : `Đã xử lý ${released + reconciled} mã${blocked ? `; ${blocked} mục cần xử lý` : ''}.`, wasStopped || blocked ? 'warning' : 'success');
      await this.scanAfterExecution(report);
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Không thể hoàn tất đợt thu hồi.');
      this.toast.show('Đợt thu hồi chưa hoàn tất.', 'error');
    } finally {
      this.isRunning.set(false);
    }
  }

  stopRun(): void {
    if (!this.isRunning()) return;
    this.stopRequested.set(true);
    this.toast.show('Đã yêu cầu dừng; giao dịch đang chạy sẽ hoàn tất trước khi dừng.', 'info');
  }

  exportReport(): void {
    const current = this.report();
    if (!current || typeof document === 'undefined') return;
    const payload = JSON.stringify({
      ...current,
      exportedAt: new Date().toISOString(),
      executionResults: this.executionResults(),
    }, null, 2);
    const blob = new Blob([`\uFEFF${payload}`], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `standard-code-recall-${current.runId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private async scanAfterExecution(previous: StandardCodeRecallReport): Promise<void> {
    try {
      const fresh = await this.service.scanHiddenStandardCodes();
      this.report.set(fresh);
    } catch (error) {
      console.warn('[StandardHiddenCodeRecallModal] refresh failed after commit', previous.runId, error);
    }
  }

  statusLabel(status: StandardCodeRecallItem['status']): string {
    return {
      RELEASED: 'Đã trả mã',
      RECONCILED: 'Đã đối soát',
      ALREADY_RELEASED: 'Đã xử lý trước đó',
      BLOCKED: 'Bị chặn',
      CHANGED_SINCE_SCAN: 'Dữ liệu đã đổi',
      FAILED: 'Lỗi, cần thử lại',
      EXCLUDED_SPECIAL_CODE: 'Loại khỏi kho chung',
    }[status];
  }

  statusClass(status: StandardCodeRecallItem['status']): string {
    if (status === 'RELEASED' || status === 'RECONCILED') return 'inline-flex rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 text-[10px] font-black text-emerald-700 dark:text-emerald-300 whitespace-nowrap';
    if (status === 'ALREADY_RELEASED') return 'inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-black text-slate-600 dark:text-slate-300 whitespace-nowrap';
    if (status === 'EXCLUDED_SPECIAL_CODE') return 'inline-flex rounded-full bg-sky-50 dark:bg-sky-950/30 px-2 py-1 text-[10px] font-black text-sky-700 dark:text-sky-300 whitespace-nowrap';
    return 'inline-flex rounded-full bg-red-50 dark:bg-red-950/30 px-2 py-1 text-[10px] font-black text-red-700 dark:text-red-300 whitespace-nowrap';
  }
}
