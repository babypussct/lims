import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  StandardInternalIdApplySummary,
  StandardInternalIdSyncBatch,
  StandardInternalIdSyncChange,
  StandardInternalIdSyncIssue,
  StandardInternalIdSyncReport,
} from '../../../core/models/standard.model';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import {
  calculateInternalIdApplySummary,
  countTargetCodes,
  CorrectionValidationResult,
  exportReportCsv,
  exportReportJson,
  isValidInternalId,
  normalizeInternalId,
  planInternalIdBatches,
  StandardSyncPartialFailureError,
  SyncBatchProgress,
  validateInternalIdCorrections,
} from '../../../shared/utils/standard-internal-id';
import { StandardService } from '../standard.service';

export type SyncFilter = 'all' | 'manual' | 'safe' | 'duplicate' | 'registry' | 'reference';
export type { CorrectionValidationResult };

/**
 * Manager-facing repair workspace for legacy internal-id data. The service
 * always re-scans immediately before writing; this component is only the
 * review/approval surface and never writes directly to Firestore.
 */
@Component({
  selector: 'app-standards-internal-id-sync-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModalShellComponent],
  template: `
    @if (isOpen()) {
      <app-modal-shell
        title="Đồng bộ Mã quản lý nội bộ"
        description="Quét cả hồ sơ vật lý, yêu cầu mượn và nhật ký. Chỉ thay đổi lỗi xác định được duy nhất; mã thiếu/sai cần người quản lý đối chiếu thủ công."
        size="xl"
        [closeOnBackdrop]="false"
        [closeDisabled]="isBusy()"
        (closed)="close.emit()"
      >
        <div modalBody class="-mx-6 -my-5 flex h-full min-h-0 flex-col">

          <div class="px-5 sm:px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold" role="group" aria-label="Góc nhìn làm việc">
              <button
                type="button"
                [attr.aria-pressed]="activeView() === 'scan'"
                (click)="setView('scan')"
                [class]="activeView() === 'scan' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
                class="px-3 py-1.5 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                <i class="fa-solid fa-list-check mr-1.5" aria-hidden="true"></i>Quét & Đối chiếu
              </button>
              <button
                type="button"
                [attr.aria-pressed]="activeView() === 'history'"
                (click)="setView('history')"
                [class]="activeView() === 'history' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
                class="px-3 py-1.5 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                <i class="fa-solid fa-clock-rotate-left mr-1.5" aria-hidden="true"></i>Lịch sử đồng bộ
              </button>
            </div>

            @if (activeView() === 'scan') {
              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  (click)="exportJson()"
                  [disabled]="!report() || isBusy()"
                  title="Xuất kết quả quét ra file JSON"
                  aria-label="Xuất kết quả quét ra file JSON"
                  class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold disabled:opacity-40 shadow-xs transition-all"
                >
                  <i class="fa-solid fa-file-code mr-1.5 text-amber-600 dark:text-amber-400" aria-hidden="true"></i>Xuất JSON
                </button>
                <button
                  type="button"
                  (click)="exportCsv()"
                  [disabled]="!report() || isBusy()"
                  title="Xuất bảng dữ liệu ra file CSV"
                  aria-label="Xuất bảng dữ liệu ra file CSV"
                  class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold disabled:opacity-40 shadow-xs transition-all"
                >
                  <i class="fa-solid fa-file-csv mr-1.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true"></i>Xuất CSV
                </button>
                <button
                  type="button"
                  (click)="scan()"
                  [disabled]="isBusy()"
                  class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-all"
                >
                  @if (isScanning()) { <i class="fa-solid fa-spinner fa-spin mr-1" aria-hidden="true"></i>Đang quét } @else { <i class="fa-solid fa-rotate mr-1" aria-hidden="true"></i>Quét lại }
                </button>
              </div>
            } @else {
              <button
                type="button"
                (click)="loadHistory()"
                [disabled]="isLoadingHistory()"
                class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-all"
              >
                @if (isLoadingHistory()) { <i class="fa-solid fa-spinner fa-spin mr-1" aria-hidden="true"></i>Đang tải } @else { <i class="fa-solid fa-rotate mr-1" aria-hidden="true"></i>Làm mới lịch sử }
              </button>
            }
          </div>

          @if (activeView() === 'scan') {
            <div class="px-5 sm:px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div aria-live="polite" class="flex flex-wrap gap-2 text-[11px] font-bold">
                @if (report(); as current) {
                  <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-600 dark:text-slate-300">{{current.standardsCount}} hồ sơ vật lý</span>
                  <span class="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">{{current.safeChanges.length}} thay đổi an toàn</span>
                  @if (manualIssues().length > 0) { <span class="rounded-full bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 text-amber-700 dark:text-amber-300">{{manualIssues().length}} cần nhập mã</span> }
                  <span class="rounded-full bg-red-50 dark:bg-red-950/30 px-2.5 py-1 text-red-700 dark:text-red-300">{{nonManualConflicts().length}} xung đột/lỗi</span>
                  <span class="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 text-indigo-700 dark:text-indigo-300">{{current.usageCount + (current.nestedUsageCount || 0)}} nhật ký</span>
                  <span class="rounded-full bg-violet-50 dark:bg-violet-950/30 px-2.5 py-1 text-violet-700 dark:text-violet-300">{{current.purchaseRequestsCount || 0}} yêu cầu mua</span>
                } @else {
                  <span class="text-slate-500 dark:text-slate-400">Chưa có kết quả quét.</span>
                }
              </div>
            </div>

            @if (report()) {
              <section class="px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="relative flex-1 min-w-[240px] max-w-xl">
                    <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" aria-hidden="true"></i>
                    <input type="search" aria-label="Tìm kiếm hồ sơ, mã, loại cảnh báo hoặc nội dung gợi ý" [ngModel]="searchQuery()" (ngModelChange)="setSearchQuery($event)" placeholder="Tìm hồ sơ, mã, loại cảnh báo hoặc nội dung gợi ý..." class="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40">
                    @if (searchQuery()) {
                      <button type="button" (click)="setSearchQuery('')" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1" aria-label="Xóa tìm kiếm"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
                    }
                  </div>
                  <span aria-live="polite" class="text-[11px] font-bold text-slate-500 dark:text-slate-400">Hiển thị {{filteredItemCount()}} mục phù hợp</span>
                </div>
                <div class="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] font-bold" role="group" aria-label="Bộ lọc đồng bộ mã nội bộ">
                  @for (option of filterOptions; track option.key) {
                    <button type="button" [attr.aria-pressed]="activeFilter() === option.key" (click)="setFilter(option.key)" [class]="filterClass(option.key)" [title]="option.description">
                      <i [class]="option.icon + ' mr-1'" aria-hidden="true"></i>{{option.label}} ({{filterCount(option.key)}})
                    </button>
                  }
                </div>
              </section>
            }

            <main class="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/60 dark:bg-slate-950/30 p-4 sm:p-6 space-y-4">
              @if (partialFailure(); as pf) {
                <div class="rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-4 space-y-3">
                  <div class="flex items-start gap-3">
                    <i class="fa-solid fa-triangle-exclamation text-amber-600 dark:text-amber-400 text-lg mt-0.5" aria-hidden="true"></i>
                    <div class="min-w-0 flex-1">
                      <h4 class="text-sm font-black text-amber-900 dark:text-amber-100">Đồng bộ hoàn thành một phần (Partial Completion)</h4>
                      <p class="text-xs text-amber-800/90 dark:text-amber-200/90 mt-1">
                        Đã áp dụng thành công <strong>{{pf.completedBatchIds.length}}/{{pf.totalBatches}} batch</strong> (<strong>{{pf.completedChangesCount}} thay đổi</strong>). Quá trình bị gián đoạn ở batch {{pf.failedBatchIndex}}:
                      </p>
                      <p class="text-[11px] font-mono text-red-700 dark:text-red-300 mt-1 bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-amber-200 dark:border-amber-800/50 break-words">
                        {{errorMessage() || pf.message}}
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/70 dark:border-amber-800/40">
                    <button
                      type="button"
                      (click)="retryRemainingAfterPartialFailure()"
                      [disabled]="isBusy()"
                      class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-sm disabled:opacity-50 transition-colors"
                    >
                      <i class="fa-solid fa-rotate mr-1.5" aria-hidden="true"></i>Quét lại & tiếp tục phần còn lại
                    </button>
                    <button
                      type="button"
                      (click)="setView('history')"
                      class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-black"
                    >
                      <i class="fa-solid fa-clock-rotate-left mr-1.5" aria-hidden="true"></i>Xem lịch sử các batch đã ghi
                    </button>
                  </div>
                </div>
              }

              @if (applyProgress(); as progress) {
                <div
                  class="rounded-2xl border bg-white dark:bg-slate-900 p-4 shadow-sm space-y-2.5"
                  [ngClass]="progress.phase === 'ALL_COMPLETED'
                    ? 'border-emerald-200 dark:border-emerald-900/60'
                    : 'border-indigo-200 dark:border-indigo-900/60'"
                >
                  <div class="flex items-center justify-between gap-2 text-xs font-black">
                    <span [ngClass]="progress.phase === 'ALL_COMPLETED'
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-indigo-700 dark:text-indigo-300'">
                      @if (progress.phase === 'ALL_COMPLETED') {
                        <i class="fa-solid fa-circle-check mr-1.5" aria-hidden="true"></i>
                      } @else {
                        <i class="fa-solid fa-spinner fa-spin mr-1.5" aria-hidden="true"></i>
                      }
                      {{progress.message || 'Đang thực hiện đồng bộ...'}}
                    </span>
                    <span class="font-mono text-slate-600 dark:text-slate-300">{{progress.percent}}%</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 rounded-full"
                      [style.width.%]="progress.percent"
                    ></div>
                  </div>
                  <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{{progress.completedChanges}} / {{progress.totalChanges}} thay đổi</span>
                    @if (progress.totalBatches > 0) {
                      <span>Batch {{progress.currentBatch}} / {{progress.totalBatches}}</span>
                    }
                  </div>
                </div>
              }

              @if (errorMessage() && !partialFailure()) {
                <div class="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 px-4 py-3 text-xs font-bold">{{errorMessage()}}</div>
              }

              @if (report(); as current) {
                <section class="rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/70 dark:bg-indigo-950/20 px-4 py-3 space-y-3">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 class="text-sm font-black text-indigo-900 dark:text-indigo-100"><i class="fa-solid fa-list-check mr-2" aria-hidden="true"></i>Phạm vi sẽ đồng bộ</h4>
                      <p class="text-[11px] text-indigo-800/80 dark:text-indigo-200/80 mt-1">Chọn theo tài liệu nghiệp vụ. Các trường của cùng một tài liệu luôn được giữ cùng batch; bộ lọc phía trên chỉ thay đổi phần hiển thị.</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                      @if (quickBatchTarget(); as batch) {
                        <button
                          type="button"
                          (click)="selectQuickBatch()"
                          [disabled]="isBusy()"
                          class="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black shadow-sm disabled:opacity-40 transition-colors"
                          [title]="'Chọn batch ' + batch.batchIndex + ' gồm ' + batch.changeCount + ' thay đổi hợp lệ; không tách cluster Standard–Registry'"
                        >
                          <i class="fa-solid fa-bolt mr-1" aria-hidden="true"></i>Chọn nhanh batch {{batch.batchIndex}} ({{batch.changeCount}})
                        </button>
                      }
                      <button type="button" (click)="toggleAllSafeChanges(true)" [disabled]="isBusy() || safeChanges().length === 0" class="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-[11px] font-black text-indigo-700 dark:text-indigo-300 disabled:opacity-40">Chọn tất cả</button>
                      <button type="button" (click)="toggleAllSafeChanges(false)" [disabled]="isBusy() || selectedSafeChangeCount() === 0" class="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-black text-slate-600 dark:text-slate-300 disabled:opacity-40">Bỏ chọn tất cả</button>
                    </div>
                  </div>
                  <div aria-live="polite" class="flex flex-wrap items-center gap-2 text-[11px] font-black">
                    <span class="rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-2.5 py-1 text-indigo-800 dark:text-indigo-200">Đã chọn {{selectedSafeChangeCount()}}/{{safeChanges().length}} thay đổi</span>
                    <span class="rounded-full bg-white/80 dark:bg-slate-900/70 px-2.5 py-1 text-slate-600 dark:text-slate-300">{{selectedSafeDocumentCount()}} tài liệu</span>
                    @if (quickBatchTarget(); as batch) {
                      <span class="text-indigo-700 dark:text-indigo-300">Batch kế tiếp {{batch.batchIndex}}/{{quickBatchPlan().totalBatches}} · {{batch.changeCount}} thay đổi hợp lệ</span>
                    }
                    @if (selectedSafeChangeCount() > 249) {
                      <span class="text-amber-700 dark:text-amber-300"><i class="fa-solid fa-layer-group mr-1" aria-hidden="true"></i>Sẽ tự chia thành {{applySummary().estimatedBatches}} batch, mỗi batch dưới 250 thay đổi</span>
                    }
                    @if (selectedSafeChangeCount() === 0 && validCorrectionCount() === 0) {
                      <span class="text-red-700 dark:text-red-300">Chưa có mục nào được chọn để đồng bộ.</span>
                    }
                  </div>
                </section>

                @if (showFilter('manual') && filteredManualIssues().length > 0) {
                  <section class="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 overflow-hidden">
                    <div class="px-4 py-3 border-b border-amber-200/70 dark:border-amber-900/40">
                      <h4 class="text-sm font-black text-amber-800 dark:text-amber-200"><i class="fa-solid fa-user-check mr-2" aria-hidden="true"></i>{{filteredManualIssues().length}} hồ sơ cần đối chiếu mã</h4>
                      <p class="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-1">Không tự gán theo tên/lô vì có thể là hai chuẩn vật lý khác nhau. Mã chuẩn có 4 ký tự bắt đầu A/B/C; riêng nghiệp vụ SDHET nhập đúng SDHET.</p>
                    </div>
                    <div class="divide-y divide-amber-200/70 dark:divide-amber-900/40">
                      @for (issue of filteredManualIssues(); track issue.id) {
                        <div class="px-4 py-3 grid lg:grid-cols-[minmax(0,1fr)_220px] gap-3 items-start">
                          <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                              <span class="font-mono text-xs font-black text-slate-700 dark:text-slate-200">{{issue.documentId}}</span>
                              @if (issue.internalId) { <span class="font-mono text-[10px] text-red-600 dark:text-red-300">Mã hiện tại: {{issue.internalId}}</span> }
                              @else { <span class="font-mono text-[10px] text-amber-700 dark:text-amber-300">Mã hiện tại: (trống)</span> }
                              <span class="rounded-full px-2 py-0.5 text-[9px] font-black bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">{{issue.kind}}</span>
                              <button type="button" (click)="copyTechnicalId(issue.documentId)" title="Sao chép ID kỹ thuật" aria-label="Sao chép ID kỹ thuật" class="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5">
                                <i class="fa-regular fa-copy" aria-hidden="true"></i>
                              </button>
                            </div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{{issue.message}}</p>
                            @if (issue.detail) { <p class="text-[11px] text-slate-600 dark:text-slate-300 mt-1"><strong>Chi tiết:</strong> {{issue.detail}}</p> }
                            @if (issue.suggestion) { <p class="text-[11px] text-amber-800 dark:text-amber-200 mt-1"><strong>Gợi ý sửa:</strong> {{issue.suggestion}}</p> }
                            <p class="text-[10px] text-slate-400 mt-1">Bản ghi kỹ thuật: {{issue.collection}}/{{issue.documentId}}</p>
                          </div>
                          <div class="space-y-1">
                            <label class="block">
                              <span class="block text-[10px] font-black uppercase tracking-wide text-amber-800/80 dark:text-amber-200/80 mb-1">Mã sau khi đối chiếu</span>
                              <input
                                [id]="'manual-input-' + issue.documentId"
                                [ngModel]="correctionValue(issue.documentId)"
                                (ngModelChange)="setCorrection(issue.documentId, $event)"
                                [attr.aria-invalid]="!getCorrectionValidation(issue.documentId).valid"
                                [attr.aria-describedby]="'manual-validation-' + issue.documentId"
                                maxlength="5"
                                autocomplete="off"
                                placeholder="AA01 hoặc SDHET"
                                [class]="inputClass(issue.documentId)"
                              >
                            </label>
                            @if (correctionValue(issue.documentId)) {
                              @let val = getCorrectionValidation(issue.documentId);
                              <div
                                [id]="'manual-validation-' + issue.documentId"
                                role="status"
                                class="text-[10px] font-bold flex items-center gap-1"
                                [class]="validationTextClass(val.level)"
                              >
                                <i [class]="validationIconClass(val.level)" aria-hidden="true"></i><span>{{val.message}}</span>
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </section>
                }

                @if (showFilter('safe') && filteredSafeChanges().length > 0) {
                  <section class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-900 overflow-hidden">
                    <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">Thay đổi có thể đồng bộ tự động</h4>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Chuẩn hóa chữ hoa/khoảng trắng, sửa registry khi chỉ có đúng một chủ sở hữu, và cập nhật snapshot lịch sử.</p>
                      </div>
                      <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">{{filteredSafeChanges().length}}</span>
                    </div>
                    <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      @for (group of visibleSafeChangeGroups(); track group.key) {
                        <div class="px-3 py-2.5 text-[11px]">
                          <label class="flex items-start gap-2.5 cursor-pointer">
                            <input type="checkbox" [checked]="isSafeDocumentSelected(group.key)" (change)="toggleSafeDocument(group.key, $any($event.target).checked)" [disabled]="isBusy()" class="mt-0.5 w-4 h-4 accent-indigo-600 shrink-0" [attr.aria-label]="'Chọn thay đổi của ' + group.key">
                            <span class="min-w-0 flex-1">
                              <span class="flex flex-wrap items-center gap-2">
                                <span class="font-mono font-black text-slate-600 dark:text-slate-300 truncate" [title]="group.key">{{group.key}}</span>
                                <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-black text-slate-500 dark:text-slate-400">{{group.changes.length}} thay đổi</span>
                              </span>
                              @for (change of group.changes; track change.field) {
                                <span class="mt-1 block text-slate-500 dark:text-slate-400 break-words"><strong class="text-slate-700 dark:text-slate-200">{{change.field}}</strong>: {{formatValue(change.before)}} → <strong class="text-emerald-700 dark:text-emerald-300">{{formatValue(change.after)}}</strong><span class="block text-[10px] text-slate-400">{{change.reason}}</span></span>
                              }
                            </span>
                          </label>
                        </div>
                      }
                    </div>
                    @if (filteredSafeChangeGroups().length > visibleSafeChangeGroups().length) {
                      <p class="px-4 py-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">Đang hiển thị {{visibleSafeChangeGroups().length}}/{{filteredSafeChangeGroups().length}} tài liệu phù hợp; hãy dùng tìm kiếm để xem phần còn lại.</p>
                    }
                  </section>
                }

                @if (showConflictGroup() && filteredConflicts().length > 0) {
                  <section class="rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 overflow-hidden">
                    <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <h4 class="text-sm font-black text-red-700 dark:text-red-300"><i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true"></i>{{filteredConflicts().length}} cảnh báo cần xử lý nghiệp vụ</h4>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Mỗi cảnh báo nêu rõ giá trị đang gặp vấn đề, nguyên nhân và hướng đối chiếu; công cụ không tự ghi đè các trường hợp chưa xác định duy nhất.</p>
                    </div>
                    <div class="max-h-[32rem] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      @for (issue of visibleConflicts(); track issue.id) {
                        <div class="px-4 py-3 text-xs">
                          <div class="flex flex-wrap gap-2 items-center"><span class="font-black text-slate-700 dark:text-slate-200">{{issue.collection}}/{{issue.documentId}}</span><span class="font-mono text-[10px] text-red-600 dark:text-red-300">{{issue.kind}}</span>@if (issue.internalId) { <span class="font-mono text-[10px] text-slate-500 dark:text-slate-400">Mã: {{issue.internalId}}</span> }</div>
                          <p class="text-slate-700 dark:text-slate-300 mt-1">{{issue.message}}</p>
                          @if (issue.detail) { <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-1"><strong>Chi tiết:</strong> {{issue.detail}}</p> }
                          @if (issue.suggestion) { <p class="text-[11px] text-amber-700 dark:text-amber-300 mt-1"><strong>Gợi ý xử lý:</strong> {{issue.suggestion}}</p> }
                          @if (issue.suggestedInternalId) { <p class="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1"><strong>Mã tham chiếu đề xuất:</strong> {{issue.suggestedInternalId}}</p> }
                        </div>
                      }
                    </div>
                    @if (filteredConflicts().length > visibleConflicts().length) {
                      <p class="px-4 py-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">Đang hiển thị {{visibleConflicts().length}}/{{filteredConflicts().length}} mục phù hợp; hãy thu hẹp bộ lọc hoặc tìm kiếm để xử lý từng nhóm.</p>
                    }
                  </section>
                }

                @if (filteredItemCount() === 0) {
                  <section class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/20 px-4 py-4">
                    <p class="text-sm font-black text-emerald-800 dark:text-emerald-200"><i class="fa-solid fa-circle-check mr-2" aria-hidden="true"></i>{{activeFilter() === 'all' ? 'Không có cảnh báo hoặc thay đổi cần xử lý.' : 'Không có mục nào trong bộ lọc hiện tại.'}}</p>
                  </section>
                }
              } @else if (isScanning()) {
                <div class="py-20 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl mb-3" aria-hidden="true"></i><p class="text-sm font-bold">Đang đọc danh sách mã và các bản sao lịch sử...</p></div>
              }
            </main>
          } @else {
            <main class="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/60 dark:bg-slate-950/30 p-4 sm:p-6 space-y-4">
              @if (errorMessage()) {
                <div class="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 px-4 py-3 text-xs font-bold">{{errorMessage()}}</div>
              }

              <div class="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/30 p-3.5 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
                <i class="fa-solid fa-shield-halved text-base mt-0.5 shrink-0" aria-hidden="true"></i>
                <div>
                  <strong class="font-bold">Lịch sử kiểm toán bất biến (Immutable Audit Trail)</strong>
                  <p class="text-[11px] text-amber-700/90 dark:text-amber-300/90 mt-0.5">
                    Các đợt đồng bộ mã được ghi lại vĩnh viễn kèm snapshot Before/After của từng tài liệu (hiển thị tối đa 20 đợt gần nhất). Hệ thống không cho phép chỉnh sửa hoặc xóa trực tiếp các bản ghi này để bảo đảm tính toàn vẹn dữ liệu.
                  </p>
                </div>
              </div>

              @if (isLoadingHistory()) {
                <div class="py-16 text-center text-slate-400">
                  <i class="fa-solid fa-spinner fa-spin text-2xl mb-2" aria-hidden="true"></i>
                  <p class="text-xs font-bold">Đang tải lịch sử các đợt đồng bộ...</p>
                </div>
              } @else if (historyBatches().length === 0) {
                <div class="py-16 text-center text-slate-400">
                  <i class="fa-solid fa-clock-rotate-left text-3xl mb-2 opacity-50" aria-hidden="true"></i>
                  <p class="text-xs font-bold">Chưa có đợt đồng bộ mã nào được thực hiện.</p>
                </div>
              } @else {
                <div class="space-y-3">
                  @for (batch of historyBatches(); track batch.id) {
                    <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
                      <div class="px-4 py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <button
                          type="button"
                          (click)="toggleBatch(batch.id)"
                          [attr.aria-expanded]="expandedBatchId() === batch.id"
                          [attr.aria-controls]="'audit-batch-details-' + batch.id"
                          class="flex-1 min-w-0 text-left flex flex-wrap items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-lg p-1 -m-1"
                        >
                          <div class="flex flex-wrap items-center gap-2.5">
                            <span class="font-mono text-xs font-black text-slate-800 dark:text-slate-100">{{batch.id}}</span>
                            @if (batch.status === 'APPLIED') {
                              <span class="rounded-full px-2 py-0.5 text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                <i class="fa-solid fa-circle-check mr-1" aria-hidden="true"></i>Đã áp dụng
                              </span>
                            } @else {
                              <span class="rounded-full px-2 py-0.5 text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                <i class="fa-solid fa-rotate-left mr-1" aria-hidden="true"></i>Đã hoàn tác
                              </span>
                            }
                            <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              • {{batch.createdByName || 'Người dùng'}}
                            </span>
                            <span class="text-[11px] font-semibold text-slate-400">
                              • {{formatTimestamp(batch.createdAt || batch.generatedAt)}}
                            </span>
                          </div>
                          <div class="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                            <span class="bg-slate-100 dark:bg-slate-800 rounded-lg px-2.5 py-1 text-[11px]">{{batch.recordCount || batch.changes.length}} thay đổi</span>
                            <i [class]="expandedBatchId() === batch.id ? 'fa-solid fa-chevron-up text-xs text-slate-400' : 'fa-solid fa-chevron-down text-xs text-slate-400'" aria-hidden="true"></i>
                          </div>
                        </button>
                        <button
                          type="button"
                          (click)="copyTechnicalId(batch.id)"
                          title="Sao chép Batch ID"
                          aria-label="Sao chép Batch ID"
                          class="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 text-xs"
                        >
                          <i class="fa-regular fa-copy" aria-hidden="true"></i>
                        </button>
                      </div>

                      @if (expandedBatchId() === batch.id) {
                        <div [id]="'audit-batch-details-' + batch.id" class="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                          <h5 class="text-[11px] font-black uppercase tracking-wide text-slate-500">Chi tiết {{batch.changes.length}} thay đổi trong batch:</h5>
                          <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            @for (change of batch.changes; track change.collection + '/' + change.documentId + '/' + change.field + $index) {
                              <div class="px-3.5 py-2.5 grid md:grid-cols-[160px_110px_1fr] gap-2 text-[11px]">
                                <span class="font-mono text-slate-600 dark:text-slate-400 truncate" [title]="change.collection + '/' + change.documentId">
                                  {{change.collection}}/{{change.documentId}}
                                </span>
                                <span class="font-black text-slate-700 dark:text-slate-200">{{change.field}}</span>
                                <div class="text-slate-600 dark:text-slate-300 break-words">
                                  <div>{{formatValue(change.before)}} → <strong class="text-emerald-600 dark:text-emerald-400">{{formatValue(change.after)}}</strong></div>
                                  <p class="text-[10px] text-slate-400 mt-0.5">{{change.reason}}</p>
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </main>
          }

        </div>

        <div modalFooter class="flex w-full flex-wrap items-center justify-between gap-3">
          @if (activeView() === 'scan') {
            <div class="flex flex-col gap-0.5 max-w-2xl">
              <p class="text-[10px] text-slate-400"><i class="fa-solid fa-lock mr-1"></i>Batch được ghi kèm người thực hiện, thời điểm và before/after snapshot. Hệ thống re-scan trước khi commit.</p>
              @if (applySummary(); as summary) {
                @if (summary.physicalStandardsCount > 0 || summary.safeCount > 0 || summary.manualCount > 0) {
                  <div aria-live="polite" class="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-2 mt-0.5">
                    <span class="text-amber-700 dark:text-amber-300">Dự kiến ghi ({{summary.estimatedBatches}} batch):</span>
                    <span>{{summary.physicalStandardsCount}} chuẩn vật lý</span>
                    <span>• {{summary.registryCount}} registry</span>
                    <span>• {{summary.requestsCount}} yêu cầu</span>
                    <span>• {{summary.usageCount}} nhật ký</span>
                    @if (summary.manualCount > 0) { <span class="text-emerald-600 dark:text-emerald-400">• {{summary.manualCount}} mã sửa</span> }
                    <span>• Tổng {{summary.totalChanges}} thay đổi / {{summary.totalDocuments}} tài liệu</span>
                    @if (hasInvalidCorrections()) {
                      <span class="text-red-600 dark:text-red-400 font-black">• Còn mã nhập không hợp lệ</span>
                    }
                  </div>
                }
              }
            </div>
            <div class="flex gap-2">
              <button type="button" (click)="close.emit()" [disabled]="isBusy()" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black disabled:opacity-40">Đóng</button>
              <button type="button" (click)="apply()" [disabled]="isBusy() || !canApply()" class="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-black disabled:opacity-40 shadow-sm transition-colors">
                @if (isApplying()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang đồng bộ } @else { <i class="fa-solid fa-check mr-1"></i>Áp dụng đồng bộ }
              </button>
            </div>
          } @else {
            <p class="text-[10px] text-slate-400"><i class="fa-solid fa-shield-halved mr-1"></i>Lịch sử audit batch chỉ xem, bảo đảm tính bất biến.</p>
            <div class="flex gap-2">
              <button type="button" (click)="close.emit()" [disabled]="isLoadingHistory()" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black disabled:opacity-40">Đóng</button>
              <button type="button" (click)="loadHistory()" [disabled]="isLoadingHistory()" class="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-black disabled:opacity-40 shadow-xs transition-colors">
                <i class="fa-solid fa-rotate mr-1"></i>Làm mới
              </button>
            </div>
          }
        </div>
      </app-modal-shell>
    }
  `,
})
export class StandardsInternalIdSyncModalComponent {
  readonly stdService = inject(StandardService);
  readonly confirmation = inject(ConfirmationService);
  readonly toast = inject(ToastService);

  isOpen = input(false);
  close = output<void>();

  activeView = signal<'scan' | 'history'>('scan');
  report = signal<StandardInternalIdSyncReport | null>(null);
  corrections = signal<Record<string, string>>({});
  /** null means the initial/default scope: all safe changes are selected. */
  selectedSafeChangeKeys = signal<Set<string> | null>(null);
  isScanning = signal(false);
  isApplying = signal(false);
  applyProgress = signal<SyncBatchProgress | null>(null);
  partialFailure = signal<StandardSyncPartialFailureError | null>(null);
  errorMessage = signal('');
  isBusy = computed(() => this.isScanning() || this.isApplying());
  activeFilter = signal<SyncFilter>('all');
  searchQuery = signal('');

  historyBatches = signal<StandardInternalIdSyncBatch[]>([]);
  isLoadingHistory = signal(false);
  expandedBatchId = signal<string | null>(null);

  readonly filterOptions: readonly {
    key: SyncFilter;
    label: string;
    icon: string;
    description: string;
  }[] = [
    { key: 'all', label: 'Tất cả', icon: 'fa-solid fa-layer-group', description: 'Hiển thị mọi nhóm cần xem xét.' },
    { key: 'manual', label: 'Cần nhập mã', icon: 'fa-solid fa-pen-to-square', description: 'Hồ sơ vật lý thiếu hoặc sai định dạng mã.' },
    { key: 'safe', label: 'Thay đổi an toàn', icon: 'fa-solid fa-circle-check', description: 'Các thay đổi deterministic có thể ghi trong batch.' },
    { key: 'duplicate', label: 'Trùng mã', icon: 'fa-solid fa-clone', description: 'Nhiều hồ sơ hiện tại cùng sở hữu một mã.' },
    { key: 'registry', label: 'Registry', icon: 'fa-solid fa-database', description: 'Mã và sổ sở hữu kỹ thuật không khớp.' },
    { key: 'reference', label: 'Tham chiếu', icon: 'fa-solid fa-link', description: 'Request hoặc nhật ký không khớp hồ sơ vật lý.' },
  ];

  manualIssues = computed(() => (this.report()?.issues || []).filter(issue =>
    issue.collection === 'reference_standards' &&
    (issue.kind === 'MISSING' || issue.kind === 'INVALID_FORMAT')
  ));
  safeChanges = computed(() => this.report()?.safeChanges || []);
  nonManualConflicts = computed(() => {
    const manualIds = new Set(this.manualIssues().map(issue => issue.id));
    return (this.report()?.conflicts || []).filter(issue => !manualIds.has(issue.id));
  });
  filteredManualIssues = computed(() => this.manualIssues().filter(issue =>
    (this.activeFilter() === 'all' || this.activeFilter() === 'manual') && this.matchesSearch([
      issue.collection, issue.documentId, issue.standardId, issue.internalId, issue.kind,
      issue.parentStandardId, issue.referencedStandardId, issue.rawDocumentId, issue.canonicalDocumentId,
      issue.message, issue.detail, issue.suggestion, issue.suggestedInternalId,
    ])
  ));
  filteredSafeChanges = computed(() => this.safeChanges().filter(change =>
    (this.activeFilter() === 'all' || this.activeFilter() === 'safe') && this.matchesSearch([
      change.collection, change.documentId, change.field, change.before, change.after, change.reason,
    ])
  ));
  filteredSafeChangeGroups = computed(() => {
    const activeFilter = this.activeFilter();
    if (activeFilter !== 'all' && activeFilter !== 'safe') return [];
    const queryValues = (change: StandardInternalIdSyncChange): readonly unknown[] => [
      change.collection, change.documentId, change.field, change.before, change.after, change.reason,
    ];
    const groups = new Map<string, StandardInternalIdSyncChange[]>();
    for (const change of this.safeChanges()) {
      const key = this.safeDocumentKey(change);
      groups.set(key, [...(groups.get(key) || []), change]);
    }
    return [...groups.entries()]
      // Keep the full document group visible after a search matches one of
      // its fields, so the displayed count matches what the checkbox selects.
      .filter(([, changes]) => changes.some(change => this.matchesSearch(queryValues(change))))
      .map(([key, changes]) => ({ key, changes }));
  });
  visibleSafeChangeGroups = computed(() => this.filteredSafeChangeGroups().slice(0, 80));
  filteredConflicts = computed(() => this.nonManualConflicts().filter(issue =>
    this.conflictMatchesActiveFilter(issue) && this.matchesSearch([
      issue.collection, issue.documentId, issue.standardId, issue.internalId, issue.kind,
      issue.parentStandardId, issue.referencedStandardId, issue.rawDocumentId, issue.canonicalDocumentId,
      issue.message, issue.detail, issue.suggestion, issue.suggestedInternalId,
    ])
  ));
  visibleSafeChanges = computed(() => this.filteredSafeChanges().slice(0, 80));
  visibleConflicts = computed(() => this.filteredConflicts().slice(0, 120));
  filteredItemCount = computed(() => this.filteredManualIssues().length + this.filteredSafeChanges().length + this.filteredConflicts().length);

  selectedSafeChanges = computed(() => {
    const selected = this.selectedSafeChangeKeys();
    return selected === null
      ? this.safeChanges()
      : this.safeChanges().filter(change => selected.has(this.safeDocumentKey(change)));
  });
  selectedSafeChangeCount = computed(() => this.selectedSafeChanges().length);
  selectedSafeDocumentCount = computed(() => new Set(this.selectedSafeChanges().map(change => this.safeDocumentKey(change))).size);
  quickBatchPlan = computed(() => planInternalIdBatches(this.safeChanges(), 249));
  allSafeChangesSelected = computed(() => {
    return this.safeChanges().length > 0 && this.selectedSafeChangeCount() === this.safeChanges().length;
  });
  /**
   * Selects the first not-yet-completely-selected atomic batch. When the
   * default scope is "all", this intentionally points to batch 1 so the
   * operator can immediately switch from the full preview to a safe pilot.
   */
  quickBatchTarget = computed(() => {
    const chunks = this.quickBatchPlan().chunks;
    if (chunks.length === 0) return null;
    if (this.allSafeChangesSelected()) return chunks[0];

    const selected = this.selectedSafeChangeKeys() || new Set<string>();
    return chunks.find(chunk => {
      const keys = new Set(chunk.changes.map(change => this.safeDocumentKey(change)));
      return [...keys].some(key => !selected.has(key));
    }) || null;
  });
  selectedReport = computed<StandardInternalIdSyncReport | null>(() => {
    const current = this.report();
    return current ? { ...current, safeChanges: this.selectedSafeChanges() } : null;
  });

  targetCodeCounts = computed(() => countTargetCodes(this.corrections()));
  correctionValidations = computed(() => validateInternalIdCorrections(this.corrections(), this.report()));
  hasInvalidCorrections = computed(() => {
    for (const result of this.correctionValidations().values()) {
      if (!result.valid) return true;
    }
    return false;
  });
  applySummary = computed<StandardInternalIdApplySummary>(() =>
    calculateInternalIdApplySummary(this.selectedReport(), this.corrections())
  );

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        // scan() reads the busy signals before it changes them. Keep those
        // signals out of this effect so finishing one scan cannot start a new
        // scan indefinitely.
        untracked(() => {
          void this.scan();
        });
      } else {
        this.report.set(null);
        this.corrections.set({});
        this.selectedSafeChangeKeys.set(null);
        this.errorMessage.set('');
        this.partialFailure.set(null);
        this.applyProgress.set(null);
        this.activeFilter.set('all');
        this.searchQuery.set('');
        this.activeView.set('scan');
        this.historyBatches.set([]);
        this.expandedBatchId.set(null);
      }
    });
  }

  setView(view: 'scan' | 'history'): void {
    this.activeView.set(view);
    if (view === 'history') {
      void this.loadHistory();
    }
  }

  async scan(preserveApplyProgress = false): Promise<void> {
    if (this.isScanning() || this.isApplying()) return;
    if (!preserveApplyProgress) this.applyProgress.set(null);
    this.isScanning.set(true);
    this.errorMessage.set('');
    try {
      this.setReport(await this.stdService.scanInternalIdSync());
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Không thể quét dữ liệu mã nội bộ.');
    } finally {
      this.isScanning.set(false);
    }
  }

  private setReport(report: StandardInternalIdSyncReport): void {
    this.report.set(report);
    // A fresh scan is a new, explicit preview. Default to all deterministic
    // changes selected, while keeping the selection visible and editable.
    this.selectedSafeChangeKeys.set(new Set(report.safeChanges.map(change => this.safeDocumentKey(change))));
  }

  private safeDocumentKey(change: StandardInternalIdSyncChange): string {
    return `${change.collection}/${change.documentId}`;
  }

  async loadHistory(): Promise<void> {
    if (this.isLoadingHistory()) return;
    this.isLoadingHistory.set(true);
    this.errorMessage.set('');
    try {
      const batches = await this.stdService.getRecentBatches(20);
      this.historyBatches.set(batches);
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Không thể tải lịch sử đồng bộ mã.');
    } finally {
      this.isLoadingHistory.set(false);
    }
  }

  toggleBatch(batchId: string): void {
    this.expandedBatchId.update(current => current === batchId ? null : batchId);
  }

  exportJson(): void {
    const current = this.report();
    if (!current) return;
    const content = exportReportJson(current, this.applySummary());
    const timestampStr = this.formatTimestampForFile(current.generatedAt);
    this.triggerDownload(content, `internal-id-sync-scan-${timestampStr}.json`, 'application/json;charset=utf-8');
  }

  exportCsv(): void {
    const current = this.report();
    if (!current) return;
    const content = exportReportCsv(current, this.applySummary());
    const timestampStr = this.formatTimestampForFile(current.generatedAt);
    this.triggerDownload(content, `internal-id-sync-scan-${timestampStr}.csv`, 'text/csv;charset=utf-8');
  }

  private triggerDownload(content: string, filename: string, mimeType: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    this.toast.show(`Đã xuất báo cáo: ${filename}`, 'success');
  }

  private formatTimestampForFile(timestamp: number): string {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return 'report';
    return d.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }

  correctionValue(documentId: string): string {
    return this.corrections()[documentId] || '';
  }

  setCorrection(documentId: string, value: string): void {
    const normalized = normalizeInternalId(value).slice(0, 5);
    this.corrections.update(current => ({ ...current, [documentId]: normalized }));
  }

  getCorrectionValidation(documentId: string): CorrectionValidationResult {
    return this.correctionValidations().get(documentId) || { level: 'empty', message: '', valid: true };
  }

  copyTechnicalId(id: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      this.toast.show(`Đã sao chép ID kỹ thuật: ${id}`, 'info');
    }
  }

  setFilter(filter: SyncFilter): void {
    this.activeFilter.set(filter);
  }

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  validCorrectionCount(): number {
    return Object.entries(this.corrections())
      .filter(([id, raw]) => String(raw || '').trim() && this.getCorrectionValidation(id).valid)
      .length;
  }

  toggleAllSafeChanges(selected: boolean): void {
    this.selectedSafeChangeKeys.set(selected
      ? new Set(this.safeChanges().map(change => this.safeDocumentKey(change)))
      : new Set<string>());
  }

  selectQuickBatch(): void {
    if (this.isBusy()) return;
    const batch = this.quickBatchTarget();
    if (!batch) return;

    this.selectedSafeChangeKeys.set(new Set(
      batch.changes.map(change => this.safeDocumentKey(change))
    ));
    this.toast.show(
      `Đã chọn batch ${batch.batchIndex}: ${batch.changeCount} thay đổi hợp lệ trên ${batch.documentCount} tài liệu.`,
      'info',
    );
  }

  isSafeDocumentSelected(documentKey: string): boolean {
    const selected = this.selectedSafeChangeKeys();
    return selected === null || selected.has(documentKey);
  }

  toggleSafeDocument(documentKey: string, selected: boolean): void {
    const next = new Set(this.selectedSafeChangeKeys() ?? this.safeChanges().map(change => this.safeDocumentKey(change)));
    if (selected) next.add(documentKey);
    else next.delete(documentKey);
    this.selectedSafeChangeKeys.set(next);
  }

  filterClass(filter: SyncFilter): string {
    const active = this.activeFilter() === filter;
    return active
      ? 'shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-2.5 py-1.5 ring-1 ring-amber-300/80 dark:ring-amber-700/80'
      : 'shrink-0 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5';
  }

  filterCount(filter: SyncFilter): number {
    switch (filter) {
      case 'all':
        return this.manualIssues().length + this.safeChanges().length + this.nonManualConflicts().length;
      case 'manual':
        return this.manualIssues().length;
      case 'safe':
        return this.safeChanges().length;
      case 'duplicate':
        return this.nonManualConflicts().filter(issue => issue.kind === 'DUPLICATE_ACTIVE').length;
      case 'registry':
        return this.nonManualConflicts().filter(issue =>
          issue.kind === 'REGISTRY_MISMATCH' || issue.kind === 'REGISTRY_KEY_MISMATCH'
        ).length;
      case 'reference':
        return this.nonManualConflicts().filter(issue =>
          issue.kind === 'REQUEST_REFERENCE' ||
          issue.kind === 'USAGE_REFERENCE' ||
          issue.kind === 'MISSING_REFERENCE' ||
          issue.kind === 'PARENT_REFERENCE_MISMATCH'
        ).length;
    }
  }

  showFilter(filter: 'manual' | 'safe'): boolean {
    return this.activeFilter() === 'all' || this.activeFilter() === filter;
  }

  showConflictGroup(): boolean {
    return this.activeFilter() === 'all'
      || this.activeFilter() === 'duplicate'
      || this.activeFilter() === 'registry'
      || this.activeFilter() === 'reference';
  }

  private conflictMatchesActiveFilter(issue: StandardInternalIdSyncIssue): boolean {
    const active = this.activeFilter();
    if (active === 'all') return true;
    if (active === 'duplicate') return issue.kind === 'DUPLICATE_ACTIVE';
    if (active === 'registry') return issue.kind === 'REGISTRY_MISMATCH' || issue.kind === 'REGISTRY_KEY_MISMATCH';
    if (active === 'reference') {
      return issue.kind === 'REQUEST_REFERENCE' ||
        issue.kind === 'USAGE_REFERENCE' ||
        issue.kind === 'MISSING_REFERENCE' ||
        issue.kind === 'PARENT_REFERENCE_MISMATCH';
    }
    return false;
  }

  private matchesSearch(values: readonly unknown[]): boolean {
    const query = this.searchQuery().trim().toLocaleLowerCase('vi-VN');
    if (!query) return true;
    return values.some(value => value !== null && value !== undefined
      && String(value).toLocaleLowerCase('vi-VN').includes(query));
  }

  inputClass(documentId: string): string {
    const val = this.getCorrectionValidation(documentId);
    const base = 'w-full rounded-xl bg-white dark:bg-slate-900 px-3 py-2 text-sm font-black font-mono uppercase tracking-wider outline-none transition-all ';
    if (!this.correctionValue(documentId)) {
      return base + 'border border-amber-300 dark:border-amber-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40';
    }
    if (!val.valid) {
      return base + 'border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 bg-red-50/40 dark:bg-red-950/30 focus:ring-2 focus:ring-red-500/40';
    }
    return base + 'border border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/30 focus:ring-2 focus:ring-emerald-500/40';
  }

  validationTextClass(level: string): string {
    switch (level) {
      case 'valid':
        return 'text-emerald-700 dark:text-emerald-300';
      case 'invalid_format':
      case 'duplicate_in_batch':
        return 'text-red-600 dark:text-red-400';
      case 'conflict_existing_owner':
        return 'text-amber-700 dark:text-amber-300';
      default:
        return 'text-slate-500 dark:text-slate-400';
    }
  }

  validationIconClass(level: string): string {
    switch (level) {
      case 'valid':
        return 'fa-solid fa-circle-check';
      case 'invalid_format':
      case 'duplicate_in_batch':
        return 'fa-solid fa-circle-xmark';
      case 'conflict_existing_owner':
        return 'fa-solid fa-triangle-exclamation';
      default:
        return 'fa-solid fa-circle-info';
    }
  }

  canApply(): boolean {
    const current = this.report();
    if (!current || this.hasInvalidCorrections()) return false;
    // The fallback keeps this method usable in lightweight non-DI regression
    // tests that instantiate the component prototype directly.
    const selectedCount = typeof (this as any).selectedSafeChangeCount === 'function'
      ? this.selectedSafeChangeCount()
      : current.safeChanges.length;
    return selectedCount > 0 || this.validCorrectionCount() > 0;
  }

  async apply(): Promise<void> {
    const current = this.report();
    if (!current || !this.canApply() || this.isBusy()) return;

    const summary = this.applySummary();
    const batchText = summary.estimatedBatches > 1
      ? `(Ước tính chia thành ${summary.estimatedBatches} batch)`
      : `(1 batch duy nhất)`;

    const confirmMessage = [
      `TỔNG QUAN THAY ĐỔI ${batchText}:`,
      `• Tổng cộng ${summary.totalChanges} thay đổi trên ${summary.totalDocuments} tài liệu nghiệp vụ`,
      `• Thao tác ghi thực tế: ${summary.actualWrites} writes (bao gồm các bản ghi sổ kiểm toán audit)`,
      ``,
      `PHẠM VI ÁP DỤNG:`,
      `• ${summary.physicalStandardsCount} chuẩn vật lý (${summary.manualCount} mã đối chiếu thủ công, ${summary.byChangeType?.codeNormalization || 0} mã chuẩn hóa)`,
      `• ${summary.registryCount} bản ghi ngân hàng mã (registry) đồng bộ`,
      `• ${summary.requestsCount} yêu cầu mượn & mua cập nhật snapshot`,
      `• ${summary.usageCount} nhật ký sử dụng & nhật ký lồng cập nhật`,
      ``,
      `PHẠM VI LOẠI TRỪ & CẢNH BÁO:`,
      summary.blockingIssuesCount > 0
        ? `• ${summary.blockingIssuesCount} lỗi blocking sẽ KHÔNG được áp dụng trong đợt này (cần xử lý riêng).`
        : `• Không có lỗi blocking nào.`,
      `• Các cảnh báo snapshot lịch sử sẽ KHÔNG bị ghi đè tự động.`,
      ``,
      `Hệ thống sẽ tự động quét lại (re-scan) toàn bộ dữ liệu trước khi ghi để bảo đảm an toàn tuyệt đối.`,
    ].join('\n');

    if (!await this.confirmation.confirm({
      title: 'Xác nhận áp dụng đồng bộ',
      message: confirmMessage,
      confirmText: 'Áp dụng đồng bộ',
      cancelText: 'Hủy',
    })) return;

    this.isApplying.set(true);
    this.errorMessage.set('');
    this.partialFailure.set(null);
    this.applyProgress.set(null);
    let appliedBatchIds: string[] | null = null;
    try {
      const batchIds = await this.stdService.applyInternalIdSync(
        current,
        this.corrections(),
        this.selectedSafeChangeKeys() === null ? undefined : [...this.selectedSafeChangeKeys()!],
        progress => {
          this.applyProgress.set(progress);
        },
      );
      appliedBatchIds = batchIds;
      this.toast.show(`Đã đồng bộ mã nội bộ qua ${batchIds.length} batch.`, 'success');
      this.corrections.set({});
    } catch (error: any) {
      if (error instanceof StandardSyncPartialFailureError || error?.name === 'StandardSyncPartialFailureError') {
        this.partialFailure.set(error);
        this.errorMessage.set(error.message);
        this.toast.show(`Đồng bộ dở dang: đã ghi ${error.completedBatchIds?.length || 0} batch.`, 'warning');
      } else {
        this.errorMessage.set(error?.message || 'Không thể áp dụng đồng bộ mã nội bộ.');
      }
    } finally {
      this.isApplying.set(false);
      if (!appliedBatchIds) this.applyProgress.set(null);
    }

    if (!appliedBatchIds) return;

    const completedProgress = this.applyProgress() || {
      currentBatch: appliedBatchIds.length,
      totalBatches: appliedBatchIds.length,
      completedChanges: summary.totalChanges,
      totalChanges: summary.totalChanges,
      percent: 100,
      phase: 'ALL_COMPLETED' as const,
      message: `Đã đồng bộ thành công toàn bộ ${appliedBatchIds.length} batch (${summary.totalChanges} thay đổi).`,
    };

    this.applyProgress.set({
      ...completedProgress,
      phase: 'RE_SCANNING',
      message: `Đã ghi xong ${appliedBatchIds.length}/${appliedBatchIds.length} batch. Đang quét xác minh dữ liệu sau đồng bộ...`,
    });

    await this.scan(true);

    if (this.errorMessage()) {
      this.applyProgress.set({
        ...completedProgress,
        phase: 'ALL_COMPLETED',
        message: `Đồng bộ đã hoàn tất ${appliedBatchIds.length} batch; chưa làm mới được dữ liệu hiển thị. Có thể bấm “Quét lại” để xác minh lại.`,
      });
      this.toast.show('Đồng bộ đã hoàn tất, nhưng bước quét xác minh sau đồng bộ chưa thành công.', 'warning');
      return;
    }

    this.applyProgress.set({
      ...completedProgress,
      phase: 'ALL_COMPLETED',
      message: `Hoàn tất đồng bộ ${appliedBatchIds.length} batch (${completedProgress.totalChanges} thay đổi). Dữ liệu đã được quét xác minh và làm mới.`,
    });
  }

  async retryRemainingAfterPartialFailure(): Promise<void> {
    this.partialFailure.set(null);
    this.errorMessage.set('');
    await this.scan();
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return '(trống)';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  formatTimestamp(timestamp: any): string {
    if (!timestamp) return '(chưa rõ)';
    let date: Date;
    if (typeof timestamp?.toDate === 'function') {
      date = timestamp.toDate();
    } else if (typeof timestamp?.seconds === 'number') {
      date = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) return String(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  }
}
