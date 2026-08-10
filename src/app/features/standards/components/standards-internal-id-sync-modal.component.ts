import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  StandardInternalIdSyncChange,
  StandardInternalIdSyncIssue,
  StandardInternalIdSyncReport,
} from '../../../core/models/standard.model';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { normalizeInternalId } from '../../../shared/utils/standard-internal-id';
import { StandardService } from '../standard.service';

/**
 * Manager-facing repair workspace for legacy internal-id data. The service
 * always re-scans immediately before writing; this component is only the
 * review/approval surface and never writes directly to Firestore.
 */
@Component({
  selector: 'app-standards-internal-id-sync-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[620] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm" role="dialog" aria-modal="true">
        <div class="relative w-full max-w-6xl max-h-[94vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col">
          <header class="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-start justify-between gap-4 shrink-0">
            <div class="flex items-start gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-arrows-rotate"></i>
              </div>
              <div class="min-w-0">
                <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg">Đồng bộ Mã quản lý nội bộ</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                  Quét cả hồ sơ vật lý, yêu cầu mượn và nhật ký. Chỉ thay đổi lỗi xác định được duy nhất; mã thiếu/sai cần người quản lý đối chiếu thủ công.
                </p>
              </div>
            </div>
            <button type="button" (click)="close.emit()" [disabled]="isBusy()" class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 disabled:opacity-40" aria-label="Đóng">
              <i class="fa-solid fa-times"></i>
            </button>
          </header>

          <div class="px-5 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div class="flex flex-wrap gap-2 text-[11px] font-bold">
              @if (report(); as current) {
                <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-600 dark:text-slate-300">{{current.standardsCount}} hồ sơ vật lý</span>
                <span class="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">{{current.safeChanges.length}} thay đổi an toàn</span>
                <span class="rounded-full bg-red-50 dark:bg-red-950/30 px-2.5 py-1 text-red-700 dark:text-red-300">{{current.conflicts.length}} xung đột/lỗi</span>
                <span class="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 text-indigo-700 dark:text-indigo-300">{{current.usageCount + (current.nestedUsageCount || 0)}} nhật ký</span>
                <span class="rounded-full bg-violet-50 dark:bg-violet-950/30 px-2.5 py-1 text-violet-700 dark:text-violet-300">{{current.purchaseRequestsCount || 0}} yêu cầu mua</span>
              } @else {
                <span class="text-slate-500 dark:text-slate-400">Chưa có kết quả quét.</span>
              }
            </div>
            <button type="button" (click)="scan()" [disabled]="isBusy()" class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40">
              @if (isScanning()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang quét } @else { <i class="fa-solid fa-rotate mr-1"></i>Quét lại }
            </button>
          </div>

          <main class="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/60 dark:bg-slate-950/30 p-4 sm:p-6 space-y-4">
            @if (errorMessage()) {
              <div class="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 px-4 py-3 text-xs font-bold">{{errorMessage()}}</div>
            }

            @if (report(); as current) {
              @if (manualIssues().length > 0) {
                <section class="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 overflow-hidden">
                  <div class="px-4 py-3 border-b border-amber-200/70 dark:border-amber-900/40">
                    <h4 class="text-sm font-black text-amber-800 dark:text-amber-200"><i class="fa-solid fa-user-check mr-2"></i>{{manualIssues().length}} hồ sơ cần đối chiếu mã</h4>
                    <p class="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-1">Không tự gán theo tên/lô vì có thể là hai chuẩn vật lý khác nhau. Nhập đúng mã đang dán trên hồ sơ/kho; mã phải có 4 ký tự và bắt đầu A, B hoặc C.</p>
                  </div>
                  <div class="divide-y divide-amber-200/70 dark:divide-amber-900/40">
                    @for (issue of manualIssues(); track issue.id) {
                      <div class="px-4 py-3 grid lg:grid-cols-[minmax(0,1fr)_180px] gap-3 items-center">
                        <div class="min-w-0">
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="font-mono text-xs font-black text-slate-700 dark:text-slate-200">{{issue.documentId}}</span>
                            @if (issue.internalId) { <span class="font-mono text-[10px] text-red-600 dark:text-red-300">{{issue.internalId}}</span> }
                            <span class="rounded-full px-2 py-0.5 text-[9px] font-black bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">{{issue.kind}}</span>
                          </div>
                          <p class="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{{issue.message}}</p>
                          <p class="text-[10px] text-slate-400 mt-1">Bản ghi kỹ thuật: {{issue.collection}}/{{issue.documentId}}</p>
                        </div>
                        <input [ngModel]="correctionValue(issue.documentId)" (ngModelChange)="setCorrection(issue.documentId, $event)" maxlength="4" autocomplete="off" placeholder="Ví dụ AA01" class="w-full rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm font-black font-mono uppercase tracking-wider text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/40">
                      </div>
                    }
                  </div>
                </section>
              } @else {
                <section class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/20 px-4 py-4">
                  <p class="text-sm font-black text-emerald-800 dark:text-emerald-200"><i class="fa-solid fa-circle-check mr-2"></i>Không có hồ sơ vật lý thiếu/sai mã cần nhập thủ công.</p>
                </section>
              }

              @if (current.safeChanges.length > 0) {
                <section class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-900 overflow-hidden">
                  <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">Thay đổi có thể đồng bộ tự động</h4>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Chuẩn hóa chữ hoa/khoảng trắng, sửa registry khi chỉ có đúng một chủ sở hữu, và cập nhật snapshot lịch sử.</p>
                    </div>
                    <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">{{current.safeChanges.length}}</span>
                  </div>
                  <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    @for (change of visibleSafeChanges(); track change.collection + '/' + change.documentId + '/' + change.field) {
                      <div class="px-4 py-2.5 grid md:grid-cols-[170px_120px_1fr] gap-2 text-[11px]">
                        <span class="font-mono text-slate-500 dark:text-slate-400 truncate" [title]="change.collection + '/' + change.documentId">{{change.collection}}/{{change.documentId}}</span>
                        <span class="font-black text-slate-700 dark:text-slate-200">{{change.field}}</span>
                        <span class="text-slate-500 dark:text-slate-400 break-words">{{formatValue(change.before)}} → <strong class="text-emerald-700 dark:text-emerald-300">{{formatValue(change.after)}}</strong></span>
                      </div>
                    }
                  </div>
                  @if (current.safeChanges.length > visibleSafeChanges().length) {
                    <p class="px-4 py-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">Đang hiển thị {{visibleSafeChanges().length}} thay đổi đầu tiên; toàn bộ {{current.safeChanges.length}} thay đổi vẫn sẽ được ghi trong batch.</p>
                  }
                </section>
              }

              @if (current.conflicts.length > 0) {
                <section class="rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 overflow-hidden">
                  <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 class="text-sm font-black text-red-700 dark:text-red-300"><i class="fa-solid fa-triangle-exclamation mr-2"></i>Các lỗi không được tự sửa</h4>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Cần xử lý nghiệp vụ trước: trùng mã đang hoạt động, mã không đúng quy tắc, hoặc snapshot không thể xác định duy nhất.</p>
                  </div>
                  <div class="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    @for (issue of visibleConflicts(); track issue.id) {
                      <div class="px-4 py-2.5 text-xs">
                        <div class="flex flex-wrap gap-2 items-center"><span class="font-black text-slate-700 dark:text-slate-200">{{issue.collection}}/{{issue.documentId}}</span><span class="font-mono text-[10px] text-red-600 dark:text-red-300">{{issue.kind}}</span></div>
                        <p class="text-slate-500 dark:text-slate-400 mt-1">{{issue.message}}</p>
                      </div>
                    }
                  </div>
                </section>
              }
            } @else if (isScanning()) {
              <div class="py-20 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl mb-3"></i><p class="text-sm font-bold">Đang đọc danh sách mã và các bản sao lịch sử...</p></div>
            }
          </main>

          <footer class="px-5 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <p class="text-[10px] text-slate-400 max-w-2xl"><i class="fa-solid fa-lock mr-1"></i>Batch được ghi kèm người thực hiện, thời điểm và before/after. Không xóa hồ sơ cũ và không đổi mã hợp lệ đang tồn tại.</p>
            <div class="flex gap-2">
              <button type="button" (click)="close.emit()" [disabled]="isBusy()" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black disabled:opacity-40">Đóng</button>
              <button type="button" (click)="apply()" [disabled]="isBusy() || !canApply()" class="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-black disabled:opacity-40">
                @if (isApplying()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang đồng bộ } @else { <i class="fa-solid fa-check mr-1"></i>Áp dụng đồng bộ }
              </button>
            </div>
          </footer>
        </div>
      </div>
    }
  `,
})
export class StandardsInternalIdSyncModalComponent {
  readonly stdService = inject(StandardService);
  readonly confirmation = inject(ConfirmationService);
  readonly toast = inject(ToastService);

  isOpen = input(false);
  close = output<void>();

  report = signal<StandardInternalIdSyncReport | null>(null);
  corrections = signal<Record<string, string>>({});
  isScanning = signal(false);
  isApplying = signal(false);
  errorMessage = signal('');
  isBusy = computed(() => this.isScanning() || this.isApplying());

  manualIssues = computed(() => (this.report()?.issues || []).filter(issue =>
    issue.collection === 'reference_standards' &&
    (issue.kind === 'MISSING' || issue.kind === 'INVALID_FORMAT')
  ));
  visibleSafeChanges = computed(() => (this.report()?.safeChanges || []).slice(0, 80));
  visibleConflicts = computed(() => (this.report()?.conflicts || []).slice(0, 120));

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        void this.scan();
      } else {
        this.report.set(null);
        this.corrections.set({});
        this.errorMessage.set('');
      }
    });
  }

  async scan(): Promise<void> {
    if (this.isScanning() || this.isApplying()) return;
    this.isScanning.set(true);
    this.errorMessage.set('');
    try {
      this.report.set(await this.stdService.scanInternalIdSync());
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Không thể quét dữ liệu mã nội bộ.');
    } finally {
      this.isScanning.set(false);
    }
  }

  correctionValue(documentId: string): string {
    return this.corrections()[documentId] || '';
  }

  setCorrection(documentId: string, value: string): void {
    const normalized = normalizeInternalId(value).slice(0, 4);
    this.corrections.update(current => ({ ...current, [documentId]: normalized }));
  }

  canApply(): boolean {
    const current = this.report();
    if (!current) return false;
    const correctionCount = Object.values(this.corrections()).filter(Boolean).length;
    return current.safeChanges.length > 0 || correctionCount > 0;
  }

  async apply(): Promise<void> {
    const current = this.report();
    if (!current || !this.canApply() || this.isBusy()) return;
    if (!await this.confirmation.confirm({
      message: 'Áp dụng các thay đổi mã nội bộ an toàn và các mã sửa thủ công đã nhập? Hệ thống sẽ quét lại ngay trước khi ghi.',
      confirmText: 'Áp dụng đồng bộ'
    })) return;

    this.isApplying.set(true);
    this.errorMessage.set('');
    try {
      const batchId = await this.stdService.applyInternalIdSync(current, this.corrections());
      this.toast.show(`Đã đồng bộ mã nội bộ. Batch: ${batchId}`, 'success');
      this.corrections.set({});
      this.report.set(await this.stdService.scanInternalIdSync());
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Không thể áp dụng đồng bộ mã nội bộ.');
    } finally {
      this.isApplying.set(false);
    }
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return '(trống)';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
}
