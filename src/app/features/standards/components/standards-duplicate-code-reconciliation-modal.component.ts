import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import {
  HiddenDuplicateScanReport,
  StandardCodeDuplicateReconciliationService,
} from '../services/standard-code-duplicate-reconciliation.service';
import { HiddenDuplicateCodeCase } from '../services/standard-code-duplicate-reconciliation.utils';

interface ReconciliationExecutionResult {
  code: string;
  outcome: 'SUCCESS' | 'FAILED';
  message: string;
  operationId: string;
}

@Component({
  selector: 'app-standards-duplicate-code-reconciliation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModalShellComponent],
  template: `
    @if (isOpen()) {
      <app-modal-shell
        title="Đối soát mã trùng do hồ sơ đã ẩn"
        description="Xác nhận hồ sơ cũ trong thùng rác và hồ sơ mới đang giữ mã. Mỗi mã được xử lý bằng giao dịch có lịch sử kiểm toán."
        size="2xl"
        [closeOnBackdrop]="false"
        [closeDisabled]="isBusy()"
        (closed)="close.emit()">
        <div modalBody class="-mx-6 -my-5 flex flex-col min-h-0 h-full">
          <section class="p-4 sm:p-5 shrink-0 space-y-3 border-b border-slate-200 dark:border-slate-700 bg-amber-50/40 dark:bg-amber-950/20">
            <div class="flex flex-wrap gap-3 justify-between items-start">
              <p class="text-xs leading-5 text-slate-700 dark:text-slate-200 max-w-3xl">
                <strong>Quy tắc an toàn:</strong> chỉ xử lý mã có đúng 2 hồ sơ chưa trả mã:
                1 hồ sơ đã ẩn, không còn yêu cầu mở, và 1 hồ sơ mới đang hiển thị.
                Hồ sơ mới tiếp tục sử dụng mã; hồ sơ cũ vẫn trong thùng rác và được đánh dấu đã trả mã.
                Mã mơ hồ hoặc sổ mã không hợp lệ sẽ bị chặn.
              </p>
              <button type="button" (click)="scan()" [disabled]="isBusy()"
                class="px-3 py-2 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 disabled:opacity-50">
                @if (isScanning()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang quét } @else { <i class="fa-solid fa-rotate mr-1"></i>Quét lại }
              </button>
            </div>
            @if (report(); as current) {
              <div class="flex flex-wrap gap-2 text-[11px] font-bold" aria-live="polite">
                <span class="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900">{{current.cases.length}} mã đang trùng</span>
                <span class="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">{{current.readyCount}} mã đủ điều kiện</span>
                <span class="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300">{{current.blockedCount}} mã cần kiểm tra thủ công</span>
                <span class="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">Số lượng theo mã duy nhất, không theo số dòng cảnh báo</span>
              </div>
            }
          </section>

          @if (errorMessage()) {
            <p role="alert" class="mx-4 mt-3 px-3 py-2 text-xs rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300">{{errorMessage()}}</p>
          }

          <section class="px-4 sm:px-5 py-3 shrink-0 space-y-2 border-b border-slate-100 dark:border-slate-800">
            <label for="duplicate-reconcile-reason" class="block text-[11px] font-black text-slate-600 dark:text-slate-300">Lý do ghi vào lịch sử từng mã (không bắt buộc nhập)</label>
            <input id="duplicate-reconcile-reason" type="text" maxlength="500" [ngModel]="reason()" (ngModelChange)="reason.set($event)"
              [disabled]="isBusy()" class="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm"
              placeholder="Có thể nhập lý do cụ thể cho lần đối soát này">
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Để trống sẽ tự ghi vào lịch sử: {{defaultReason}}</p>
            <div class="flex flex-wrap items-center gap-3">
              <input type="search" aria-label="Tìm mã trùng" placeholder="Lọc mã, tên chuẩn hoặc số lô..."
                [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)"
                class="flex-1 min-w-48 p-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-xs">
              <button type="button" (click)="selectAllReady()" [disabled]="isBusy() || !report()?.readyCount"
                class="text-xs font-bold text-indigo-700 dark:text-indigo-300 disabled:opacity-40">Chọn tất cả mã đủ điều kiện</button>
              <button type="button" (click)="clearSelection()" [disabled]="isBusy()"
                class="text-xs text-slate-500 dark:text-slate-400">Bỏ chọn</button>
            </div>
          </section>

          <div class="flex-1 min-h-0 overflow-auto px-4 sm:px-5 py-3 space-y-3">
            @if (isScanning() && !report()) {
              <p class="text-sm text-slate-500">Đang đọc hồ sơ, sổ mã và yêu cầu mượn từ máy chủ...</p>
            } @else if (report() && filteredCases().length === 0) {
              <p class="text-sm text-slate-500">Không có mã trùng phù hợp với bộ lọc.</p>
            }
            @for (item of filteredCases(); track item.internalId) {
              <article class="p-3 sm:p-4 border rounded-xl space-y-2"
                [class.border-emerald-300]="item.status === 'READY'"
                [class.border-rose-300]="item.status === 'BLOCKED'">
                <div class="flex items-start gap-3">
                  <input type="checkbox" class="mt-1.5 h-4 w-4" [attr.aria-label]="'Chọn đối soát ' + item.internalId"
                    [checked]="selectedCodes().has(item.internalId)" [disabled]="isBusy() || item.status !== 'READY'"
                    (change)="toggleCode(item.internalId)">
                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <strong class="text-sm text-slate-800 dark:text-slate-100">{{item.internalId}}</strong>
                      <span class="text-[10px] font-black rounded-full px-2 py-0.5"
                        [class.bg-emerald-100]="item.status === 'READY'" [class.text-emerald-800]="item.status === 'READY'"
                        [class.bg-red-100]="item.status === 'BLOCKED'" [class.text-red-800]="item.status === 'BLOCKED'">
                        {{item.status === 'READY' ? 'ĐỦ ĐIỀU KIỆN' : 'BỊ CHẶN'}}
                      </span>
                      <span class="text-[11px] text-slate-500">{{item.unreleasedCount}} hồ sơ chưa trả mã</span>
                    </div>
                    <p class="text-xs text-slate-600 dark:text-slate-300">{{item.reason}}</p>
                    @if (item.oldStandard; as old) {
                      <p class="text-xs"><strong class="text-amber-700 dark:text-amber-300">Cũ (trong thùng rác):</strong>
                        {{old.name}} · Lô {{old.lot_number || '—'}} · ID {{old.id}}</p>
                    }
                    @if (item.newStandard; as fresh) {
                      <p class="text-xs"><strong class="text-emerald-700 dark:text-emerald-300">Mới (giữ mã):</strong>
                        {{fresh.name}} · Lô {{fresh.lot_number || '—'}} · ID {{fresh.id}}</p>
                    }
                    @if (item.registry) {
                      <p class="text-[11px] text-slate-500">Sổ mã: {{item.registry.status}} · Chủ hiện tại: {{item.registry.currentStandardId || 'chưa xác định'}}</p>
                    }
                  </div>
                </div>
              </article>
            }
            @if (executionResults().length > 0) {
              <section class="space-y-1 border-t border-slate-200 dark:border-slate-700 pt-3" aria-live="polite">
                <h3 class="text-sm font-bold">Kết quả đối soát</h3>
                @for (result of executionResults(); track result.operationId) {
                  <p class="text-xs" [class.text-emerald-700]="result.outcome === 'SUCCESS'" [class.text-red-700]="result.outcome === 'FAILED'">
                    <strong>{{result.code}}:</strong> {{result.message}}
                  </p>
                }
              </section>
            }
          </div>

          <div modalFooter class="flex flex-wrap gap-3 justify-between items-center">
            <div class="space-y-1">
              <p class="text-xs text-slate-500">Đã chọn {{selectedReadyCases().length}} mã.</p>
              @if (isRunning()) { <p class="text-xs text-amber-700">Đang xử lý {{processedCount()}}/{{runTotal()}} mã. Mỗi mã là một giao dịch riêng.</p> }
            </div>
            <div class="flex gap-2 flex-wrap">
              @if (isRunning()) {
                <button type="button" (click)="stopRequested.set(true)" class="px-3 py-2 border rounded-lg text-amber-700 text-xs font-bold">Dừng sau mã hiện tại</button>
              }
              <button type="button" (click)="close.emit()" [disabled]="isBusy()" class="px-3 py-2 text-xs font-bold text-slate-500 disabled:opacity-40">Đóng</button>
              <button type="button" (click)="reconcileSelected()" [disabled]="!canReconcile()"
                class="px-4 py-2 text-xs font-black text-white bg-amber-700 hover:bg-amber-800 rounded-lg disabled:opacity-40">
                Đối soát {{selectedReadyCases().length}} mã đã chọn
              </button>
            </div>
          </div>
        </div>
      </app-modal-shell>
    }
  `,
})
export class StandardsDuplicateCodeReconciliationModalComponent {
  isOpen = input(false);
  close = output<void>();
  private service = inject(StandardCodeDuplicateReconciliationService);
  private confirmation = inject(ConfirmationService);
  private opened = false;

  report = signal<HiddenDuplicateScanReport | null>(null);
  searchQuery = signal('');
  reason = signal('');
  readonly defaultReason = 'Đối soát mã trùng: hồ sơ cũ đã ẩn và hồ sơ mới tiếp tục giữ mã.';
  reconciliationReason = computed(() => this.reason().trim() || this.defaultReason);
  selectedCodes = signal<Set<string>>(new Set());
  isScanning = signal(false);
  isRunning = signal(false);
  stopRequested = signal(false);
  processedCount = signal(0);
  runTotal = signal(0);
  errorMessage = signal('');
  executionResults = signal<ReconciliationExecutionResult[]>([]);

  isBusy = computed(() => this.isScanning() || this.isRunning());
  filteredCases = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase('vi');
    const items = this.report()?.cases || [];
    if (!query) return items;
    return items.filter(item => [item.internalId, item.oldStandard?.name, item.newStandard?.name,
      item.oldStandard?.lot_number, item.newStandard?.lot_number].some(value =>
      String(value || '').toLocaleLowerCase('vi').includes(query)));
  });
  selectedReadyCases = computed(() => (this.report()?.cases || []).filter(item =>
    item.status === 'READY' && this.selectedCodes().has(item.internalId)));
  canReconcile = computed(() => !this.isBusy() && this.selectedReadyCases().length > 0);

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.opened = false;
      } else if (!this.opened) {
        this.opened = true;
        void this.scan();
      }
    });
  }

  async scan(): Promise<void> {
    if (this.isBusy()) return;
    this.isScanning.set(true);
    this.errorMessage.set('');
    try {
      this.report.set(await this.service.scan());
      this.selectedCodes.set(new Set());
    } catch (error: any) {
      // A failed refresh must not leave stale candidates available for selection.
      this.report.set(null);
      this.selectedCodes.set(new Set());
      this.errorMessage.set(error?.message || 'Không quét được dữ liệu từ máy chủ.');
    } finally {
      this.isScanning.set(false);
    }
  }

  toggleCode(code: string): void {
    if (this.isBusy()) return;
    this.selectedCodes.update(previous => {
      const next = new Set(previous);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  selectAllReady(): void {
    if (this.isBusy()) return;
    this.selectedCodes.set(new Set((this.report()?.cases || [])
      .filter(item => item.status === 'READY').map(item => item.internalId)));
  }

  clearSelection(): void {
    if (this.isBusy()) return;
    this.selectedCodes.set(new Set());
  }

  async reconcileSelected(): Promise<void> {
    if (!this.canReconcile()) return;
    const targets = this.selectedReadyCases();
    const reason = this.reconciliationReason();
    const confirmed = await this.confirmation.confirm({
      message: `Đối soát ${targets.length} mã đã chọn? Hồ sơ cũ sẽ được đánh dấu RELEASED và sổ mã sẽ xác nhận hồ sơ mới. Lý do ghi lịch sử: ${reason} Mỗi mã có lịch sử riêng; mã thay đổi từ lần quét sẽ bị chặn.`,
      confirmText: 'Xác nhận đối soát', cancelText: 'Hủy', isDangerous: true,
    });
    if (!confirmed || this.isBusy()) return;
    this.isRunning.set(true);
    this.stopRequested.set(false);
    this.errorMessage.set('');
    this.executionResults.set([]);
    this.processedCount.set(0);
    this.runTotal.set(targets.length);
    const results: ReconciliationExecutionResult[] = [];
    try {
      for (const item of targets) {
        if (this.stopRequested()) break;
        const operationId = `reconcile_${item.internalId}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        try {
          const result = await this.service.reconcile(item, reason, operationId);
          results.push({ code: item.internalId, operationId, outcome: 'SUCCESS', message: result.message });
        } catch (error: any) {
          results.push({ code: item.internalId, operationId, outcome: 'FAILED',
            message: error?.message || 'Không xác định được kết quả; kiểm tra lịch sử trước khi thử lại.' });
        }
        this.processedCount.update(value => value + 1);
        this.executionResults.set([...results]);
      }
    } finally {
      this.isRunning.set(false);
      await this.scan();
    }
  }
}
