import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { formatSampleList, getSafeGooglePreviewUrl, getSafeGoogleUrl } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import { ResultService } from './services/result.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
import { ToastService } from '../../core/services/toast.service';
import {
  collection, doc, documentId, getDocs, query, serverTimestamp,
  where, writeBatch
} from 'firebase/firestore';
import { PrintService } from '../../core/services/print.service';
import { RequestHistoryLoaderComponent } from '../../shared/components/request-history-loader/request-history-loader.component';
import { timestampToLocalDateKey } from '../../shared/utils/timestamp';
import { ActivityEventService } from '../../core/services/activity-event.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { AppButtonComponent, AppEmptyStateComponent, AppPageHeaderComponent, AppToolbarComponent } from '../../shared/components/ui';

import { ReportHubModalComponent } from './components/report-hub-modal.component';
import { MergeRunsModalComponent } from './components/merge-runs-modal.component';
import { canUserEditResults, isRunActivelyLockedByOthers, ResultEditCapability } from './services/result-write-guard';
import { BatchReportsProjection, buildBatchReportsProjection } from './services/result-reports-projection';
import { isRunCandidateCompatibleForMerge, MergeRunsValidation, validateMergeRuns } from './services/merge-runs-compatibility';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SkeletonComponent,
    DateRangeFilterComponent,
    ReportHubModalComponent,
    MergeRunsModalComponent,
    AppButtonComponent,
    AppEmptyStateComponent,
    AppPageHeaderComponent,
    AppToolbarComponent,
    RequestHistoryLoaderComponent,
  ],
  template: `
    <div class="min-h-full flex flex-col fade-in relative p-4 md:p-6">

      <!-- ══════════════════════════════════════════════════════
           HEADER: Title + Status Tabs
      ══════════════════════════════════════════════════════ -->
      <div class="shrink-0 pb-0">
        <app-page-header
          class="mb-4 block shrink-0"
          title="Tra cứu và quản lý kết quả mẻ chạy"
          subtitle="Nhập kết quả, kiểm soát chất lượng (QC) và tạo phiếu kết quả tự động."
          icon="fa-square-poll-vertical">
          <!-- Status Filter Tabs -->
          <div pageHeaderActions class="inline-flex items-center soft-ui-segmented" role="group" aria-label="Lọc trạng thái mẻ phân tích">
            <button type="button"
                    (click)="setStatusFilter('all')"
                    class="soft-ui-segmented__item flex items-center gap-1.5"
                    [class.soft-ui-segmented__item--active]="filterStatus() === 'all'"
                    [attr.aria-pressed]="filterStatus() === 'all'">
              Tất cả
              @if(filteredCount('all') > 0) {
                <span class="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-md text-[10px] font-black tabular-nums">{{filteredCount('all')}}</span>
              }
            </button>
            <button type="button"
                    (click)="setStatusFilter('pending')"
                    class="soft-ui-segmented__item flex items-center gap-1.5"
                    [class.soft-ui-segmented__item--active]="filterStatus() === 'pending'"
                    [attr.aria-pressed]="filterStatus() === 'pending'">
              Chờ nhập
              @if(filteredCount('pending') > 0) {
                <span class="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md text-[10px] font-black tabular-nums">{{filteredCount('pending')}}</span>
              }
            </button>
            <button type="button"
                    (click)="setStatusFilter('draft')"
                    class="soft-ui-segmented__item flex items-center gap-1.5"
                    [class.soft-ui-segmented__item--active]="filterStatus() === 'draft'"
                    [attr.aria-pressed]="filterStatus() === 'draft'">
              Đang nháp
              @if(filteredCount('draft') > 0) {
                <span class="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-md text-[10px] font-black tabular-nums">{{filteredCount('draft')}}</span>
              }
            </button>
            <button type="button"
                    (click)="setStatusFilter('completed')"
                    class="soft-ui-segmented__item flex items-center gap-1.5"
                    [class.soft-ui-segmented__item--active]="filterStatus() === 'completed'"
                    [attr.aria-pressed]="filterStatus() === 'completed'">
              Hoàn thành
              @if(filteredCount('completed') > 0) {
                <span class="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-md text-[10px] font-black tabular-nums">{{filteredCount('completed')}}</span>
              }
            </button>
          </div>
        </app-page-header>

        <!-- ══════════════════════════════════════════════════════
             COMPACT SUMMARY & QUICK-FILTER STRIP
        ══════════════════════════════════════════════════════ -->
        <div class="mb-4 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-2.5 shadow-sm">
          <!-- Compact Stats -->
          <div class="flex flex-wrap items-center gap-3 text-xs shrink-0">
            <button type="button" (click)="showAllRuns()"
                    class="inline-flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">
              <i class="fa-solid fa-flask text-indigo-500 text-xs" aria-hidden="true"></i>
              <span><strong class="tabular-nums">{{ allApprovedRuns().length }}</strong> mẻ</span>
            </button>
            <span class="text-slate-300 dark:text-slate-700">·</span>
            <button type="button" (click)="setStatusFilter('pending')"
                    class="inline-flex items-center gap-1.5 font-bold transition cursor-pointer"
                    [class]="pendingCount() > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'">
              <span><strong class="tabular-nums">{{ pendingCount() }}</strong> chờ nhập</span>
            </button>
            <span class="text-slate-300 dark:text-slate-700">·</span>
            <div class="inline-flex items-center gap-2">
              <span class="font-bold text-slate-600 dark:text-slate-300 tabular-nums">{{ completedCount() }}/{{ allApprovedRuns().length }} hoàn thành ({{ averageCompletion() }}%)</span>
              <div class="hidden sm:block w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full transition-all duration-300" [style.width.%]="averageCompletion()"></div>
              </div>
            </div>
          </div>

          <!-- Horizontal Quick Filters (SOP pills + Operational Alerts) -->
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5 min-w-0">
            @if (staleRunsCount() > 0) {
              <button type="button" (click)="toggleQuickFilter('stale')"
                      [class]="quickFilter() === 'stale'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/40 hover:bg-amber-100/70'"
                      class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition cursor-pointer">
                <i class="fa-solid fa-rotate text-[10px]" aria-hidden="true"></i>
                <span>Cần xuất lại PDF ({{ staleRunsCount() }})</span>
              </button>
            }
            @if (lockedRunsCount() > 0) {
              <button type="button" (click)="toggleQuickFilter('locked')"
                      [class]="quickFilter() === 'locked'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-rose-50/80 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-900/40 hover:bg-rose-100/70'"
                      class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition cursor-pointer">
                <i class="fa-solid fa-lock text-[10px]" aria-hidden="true"></i>
                <span>Đang bị khóa ({{ lockedRunsCount() }})</span>
              </button>
            }
            @if (mergedRunsCount() > 0) {
              <button type="button" (click)="toggleQuickFilter('merged')"
                      [class]="quickFilter() === 'merged'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-900/40 hover:bg-indigo-100/70'"
                      class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition cursor-pointer">
                <i class="fa-solid fa-code-merge text-[10px]" aria-hidden="true"></i>
                <span>Mẻ tổng hợp ({{ mergedRunsCount() }})</span>
              </button>
            }
            @for (item of sopDistribution(); track item.id) {
              <button type="button"
                      (click)="toggleSopFilter(item.id)"
                      [class]="selectedSopId() === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'"
                      class="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold transition cursor-pointer whitespace-nowrap">
                <span>{{ item.name }}</span>
                <span class="opacity-80 tabular-nums">{{ item.count }}</span>
              </button>
            }
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════════
             FILTER & SEARCH BAR
        ══════════════════════════════════════════════════════ -->
        <div class="relative z-20 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm mb-5 overflow-visible">
          <!-- Row 1: Search + Actions -->
          <app-toolbar class="block">
            <!-- Search -->
            <div toolbarSearch class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <i class="fa-solid fa-magnifying-glass text-xs" aria-hidden="true"></i>
              </span>
              <input #searchInput
                     type="text"
                     [value]="searchText()"
                     (input)="onSearchInput($event)"
                     placeholder="Tìm theo Mã mẻ, SOP, Mã số mẫu, Kiểm nghiệm viên..."
                     class="w-full h-10 pl-8 pr-16 py-2 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-slate-100 font-semibold transition placeholder:text-slate-400 dark:placeholder:text-slate-500">
              @if (searchText()) {
                <button type="button" (click)="clearSearch()" aria-label="Xóa tìm kiếm kết quả" class="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
                  <i class="fa-solid fa-circle-xmark text-xs" aria-hidden="true"></i>
                </button>
              } @else {
                <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">/</kbd>
              }
            </div>

            <div toolbarFilters class="flex flex-wrap items-center gap-2">
              <!-- View Mode Toggle -->
              <div class="flex bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl shrink-0">
                <button type="button" (click)="viewMode.set('grid')"
                        [class]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
                        class="min-h-10 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 duration-150 sm:min-h-9">
                  <i class="fa-solid fa-table-cells" aria-hidden="true"></i> Lưới
                </button>
                <button type="button" (click)="viewMode.set('table')"
                        [class]="viewMode() === 'table' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
                        class="min-h-10 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 duration-150 sm:min-h-9">
                  <i class="fa-solid fa-list" aria-hidden="true"></i> Bảng
                </button>
              </div>

              <!-- Merge Mode Toggle -->
              @if (canEditResults()) {
                <button type="button" (click)="toggleMergeMode()"
                        [class]="isMergeModeActive() ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'"
                        class="min-h-10 px-3 py-2 border rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 duration-150 shadow-sm shrink-0 bg-white dark:bg-slate-900 sm:min-h-9">
                  <i class="fa-solid fa-code-merge text-[10px]" [class.rotate-90]="isMergeModeActive()" aria-hidden="true"></i>
                  Gộp mẻ
                  @if (isMergeModeActive() && selectedRunsCount() > 0) {
                    <span class="w-4 h-4 bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">{{ selectedRunsCount() }}</span>
                  }
                </button>
              }

              <!-- Advanced Filters toggle -->
              <button type="button" (click)="showAdvancedFilters.set(!showAdvancedFilters())"
                      [class]="showAdvancedFilters() ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'"
                      class="min-h-10 px-3 py-2 border rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 duration-150 relative shrink-0 bg-white dark:bg-slate-900 sm:min-h-9">
                <i class="fa-solid fa-sliders text-[10px]" aria-hidden="true"></i> Lọc nâng cao
                @if (activeFiltersCount() > 0) {
                  <span class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm">{{ activeFiltersCount() }}</span>
                }
                <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-200" [class.rotate-180]="showAdvancedFilters()" aria-hidden="true"></i>
              </button>
            </div>

            <div toolbarActions class="contents">
              @if (hasActiveFilters()) {
                <app-button variant="ghost" size="sm" (click)="resetAllFilters()">
                  <i class="fa-solid fa-rotate-left text-[10px]" aria-hidden="true"></i> Xóa lọc
                </app-button>
              }
            </div>
          </app-toolbar>

          <!-- Row 2: Advanced Filter Panel (collapsible) -->
          @if (showAdvancedFilters()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
              <!-- SOP Filter -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phương pháp (SOP)</label>
                <div class="relative">
                  <span class="absolute left-3 inset-y-0 flex items-center text-slate-400 pointer-events-none">
                    <i class="fa-solid fa-flask text-[10px]" aria-hidden="true"></i>
                  </span>
                  <select [value]="selectedSopId()" (change)="onSopChange($event)"
                          class="w-full h-10 appearance-none pl-8 pr-7 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer">
                    <option value="all">Tất cả phương pháp</option>
                    @for (sop of availableSops(); track sop.id) {
                      <option [value]="sop.id">{{ sop.name }}</option>
                    }
                  </select>
                  <i class="fa-solid fa-chevron-down text-[9px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" aria-hidden="true"></i>
                </div>
              </div>

              <!-- Analyst Filter -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kiểm nghiệm viên</label>
                <div class="relative">
                  <span class="absolute left-3 inset-y-0 flex items-center text-slate-400 pointer-events-none">
                    <i class="fa-solid fa-user text-[10px]" aria-hidden="true"></i>
                  </span>
                  <select [value]="selectedAnalyst()" (change)="onAnalystChange($event)"
                          class="w-full h-10 appearance-none pl-8 pr-7 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer">
                    <option value="all">Tất cả nhân viên</option>
                    @for (analyst of availableAnalysts(); track analyst) {
                      <option [value]="analyst">{{ analyst }}</option>
                    }
                  </select>
                  <i class="fa-solid fa-chevron-down text-[9px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" aria-hidden="true"></i>
                </div>
              </div>

              <!-- Date Range -->
              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Khoảng thời gian (Ngày duyệt)</label>
                @defer (when showAdvancedFilters()) {
                  <app-date-range-filter
                      [initStart]="startDate()"
                      [initEnd]="endDate()"
                      containerClass="bg-transparent p-0 border-0 shadow-none w-full gap-3"
                      (dateChange)="onDateRangeChange($event)">
                  </app-date-range-filter>
                } @placeholder {
                  <div class="h-9 rounded-xl bg-slate-100/70 dark:bg-slate-900/60"></div>
                }
                @if (!startDate() && !endDate()) {
                  <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    Đang hiển thị 300 mẻ gần nhất; chọn khoảng ngày để nạp đầy đủ lịch sử.
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════
           MAIN CONTENT: Cards / Table (scroll owned by .app-content-scroll)
      ══════════════════════════════════════════════════════ -->
      <app-request-history-loader class="shrink-0" [startDate]="startDate()" [endDate]="endDate()"
        dateBasis="approvedAt" [enabled]="!!startDate() || !!endDate()" />
      <div class="flex-1 pb-6">

        @if (isLoading()) {
          <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5 animate-pulse">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3">
                <app-skeleton width="80px" height="12px"></app-skeleton>
                <app-skeleton width="200px" height="18px"></app-skeleton>
                <app-skeleton width="140px" height="12px"></app-skeleton>
                <app-skeleton width="100%" height="28px"></app-skeleton>
              </div>
            }
          </div>
        } @else {

          <!-- ─── GRID VIEW (3-Tier Batch Card) ─── -->
          @if (viewMode() === 'grid') {
            <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
              @for (run of paginatedRuns(); track run.id) {
                @let projection = reportsProjectionMap()[run.id];
                @let status = runStatusMap()[run.id] || 'pending';
                @let isLocked = isRunLocked(run);
                @let lockedByOther = isRunLockedByOther(run);
                @let mergeCheck = mergeCandidateState(run);
                @let isEditableRun = canEditResults() && !lockedByOther && status !== 'completed';
                <div class="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/70 transition-all duration-200 flex flex-col overflow-hidden relative cursor-pointer"
                     (click)="enterResults(run.id)"
                     [class.opacity-45]="isMergeModeActive() && !mergeCheck.compatible"
                     [class.ring-2]="lastSelectedRequestId() === run.id || selectedRunsMap()[run.id]"
                     [class.ring-indigo-500]="lastSelectedRequestId() === run.id || selectedRunsMap()[run.id]"
                     [ngClass]="{'ring-1 ring-indigo-500/25': run.isVirtualMaster && lastSelectedRequestId() !== run.id && !selectedRunsMap()[run.id]}">

                  <!-- Semantic Status Top Strip -->
                  <div class="h-1 shrink-0" [ngClass]="{
                    'bg-emerald-500': status === 'completed',
                    'bg-indigo-500': status === 'draft',
                    'bg-amber-400': status === 'pending'
                  }"></div>

                  <!-- Card Body -->
                  <div class="flex flex-col flex-1 p-4 md:p-5 gap-3">
                    <!-- Tier 1: Identity & Status Strip -->
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex flex-wrap items-center gap-1.5 min-w-0">
                        @if (isMergeModeActive()) {
                          <label class="inline-flex items-center cursor-pointer mr-0.5" (click)="$event.stopPropagation()">
                            <input type="checkbox"
                                   [checked]="selectedRunsMap()[run.id]"
                                   [disabled]="!mergeCheck.compatible && !selectedRunsMap()[run.id]"
                                   (change)="toggleRunSelection(run)"
                                   [title]="mergeCheck.reason || 'Chọn để gộp mẻ'"
                                   class="w-4 h-4 text-indigo-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed">
                          </label>
                        }
                        <!-- Batch Code + Copy -->
                        <button type="button"
                                (click)="copyBatchCode(run.inputs?.['batchCode'] || run.id, $event)"
                                title="Sao chép mã mẻ"
                                class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 font-mono text-[11px] font-bold transition cursor-pointer">
                          <span class="truncate max-w-[140px]">{{ run.inputs?.['batchCode'] || run.id }}</span>
                          <i class="fa-regular fa-copy text-[9px] opacity-60" aria-hidden="true"></i>
                        </button>
                        <span [class]="getStatusClass(run.id)" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border">
                          <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                            'bg-emerald-500': status === 'completed',
                            'bg-indigo-500': status === 'draft',
                            'bg-amber-500': status === 'pending'
                          }"></span>
                          {{ getStatusText(run.id) }}
                        </span>
                        @if (projection?.hasStaleReport) {
                          <span class="px-2 py-0.5 rounded-full bg-amber-100/90 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold inline-flex items-center gap-1">
                            <i class="fa-solid fa-rotate text-[9px]" aria-hidden="true"></i> Cần xuất lại
                          </span>
                        }
                        @if (run.isVirtualMaster) {
                          <span class="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">Mẻ gộp</span>
                        }
                        @if (run.parentMasterId) {
                          <a [routerLink]="['/results', run.parentMasterId]" (click)="$event.stopPropagation()" class="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors inline-flex items-center gap-1" title="Mẻ này đã được gộp vào Master {{run.parentMasterId}}">
                            <i class="fa-solid fa-link text-[9px]" aria-hidden="true"></i> Đã gộp
                          </a>
                        }
                        @if (isLocked) {
                          <span class="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-bold inline-flex items-center gap-1" title="Đang được mở chỉnh sửa bởi {{ run.lockedByName || run.lockedBy }}">
                            <i class="fa-solid fa-lock text-[9px]" aria-hidden="true"></i> {{ run.lockedByName || 'Đang sửa' }}
                          </span>
                        }
                        @if (isMergeModeActive() && !mergeCheck.compatible && mergeCheck.reason) {
                          <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
                            {{ mergeCheck.reason }}
                          </span>
                        }
                      </div>
                      <span class="text-[11px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap">
                        <i class="fa-regular fa-calendar text-[10px]" aria-hidden="true"></i>
                        {{ getRunDate(run) ? formatAnalysisDate(getRunDate(run)) : '—' }}
                      </span>
                    </div>

                    <!-- Tier 2: SOP Name & Operational Summary -->
                    <div>
                      <h3 class="font-bold text-slate-800 dark:text-slate-100 text-[15px] leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {{ run.sopName }}
                      </h3>

                      @if (run.isVirtualMaster && run.childRequestIds) {
                        <div class="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 flex items-center gap-1 bg-indigo-50/50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30 select-none w-fit">
                          <i class="fa-solid fa-link text-[9px]" aria-hidden="true"></i> Gộp từ: {{ run.childRequestIds.join(', ') }}
                        </div>
                      }

                      <div class="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <div class="flex items-center gap-1.5 min-w-0">
                          <div [class]="getAnalystAvatarClass(run.user)" class="w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold uppercase shrink-0">
                            {{ getAnalystInitials(run.user) }}
                          </div>
                          <span class="font-semibold truncate max-w-[130px]">{{ run.user || 'Unknown' }}</span>
                        </div>
                        @if (run.inputs?.['device']) {
                          <span class="text-slate-300 dark:text-slate-700">·</span>
                          <span class="text-[11px] font-medium truncate max-w-[130px]" [title]="run.inputs?.['device']">{{ run.inputs?.['device'] }}</span>
                        }
                      </div>
                    </div>

                    <!-- Sample Summary + Real PDF Coverage -->
                    <div class="mt-auto space-y-2.5 pt-1">
                      @if (run.sampleList && run.sampleList.length > 0) {
                        <div class="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3 py-2 flex items-start gap-2">
                          <i class="fa-solid fa-vials text-slate-400 dark:text-slate-500 mt-0.5 shrink-0 text-[10px]" aria-hidden="true"></i>
                          <div class="min-w-0 flex-1">
                            <span class="font-mono font-semibold break-words">{{ formatSampleRange(projection?.reportableSamples || run.sampleList, 3) || formatSampleList(run.sampleList) }}</span>
                            <span class="ml-1.5 text-[10px] text-slate-400 font-semibold">({{ projection?.coverage?.total ?? run.sampleList.length }} mẫu)</span>
                          </div>
                        </div>
                      }

                      <div class="space-y-1">
                        <div class="flex items-center justify-between text-[11px]">
                          <span class="font-semibold text-slate-500 dark:text-slate-400">Phủ báo cáo PDF</span>
                          <span class="font-bold tabular-nums" [class]="projection && projection.coverage.percent === 100 && !projection.hasStaleReport ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'">
                            {{ projection?.coverage?.published ?? 0 }}/{{ projection?.coverage?.total ?? 0 }} mẫu ({{ projection?.coverage?.percent ?? 0 }}%)
                          </span>
                        </div>
                        <div class="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div class="h-full rounded-full transition-all duration-300"
                               [class]="projection?.hasStaleReport ? 'bg-amber-500' : (projection && projection.coverage.percent === 100 ? 'bg-emerald-500' : 'bg-indigo-500')"
                               [style.width.%]="projection?.coverage?.percent ?? 0"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tier 3: Contextual Footer CTAs -->
                  <div class="border-t border-slate-100 dark:border-slate-800/80 px-4 py-3 flex items-center gap-2 bg-slate-50/40 dark:bg-slate-950/20 shrink-0">
                    @if (projection?.hasAnyReport) {
                      <app-button variant="secondary" size="sm" (click)="openReportHub(run); $event.stopPropagation()">
                        <i class="fa-solid fa-file-pdf text-rose-500 text-[11px]" aria-hidden="true"></i>
                        <span>Báo cáo ({{ projection?.cards?.length ?? 0 }})</span>
                      </app-button>
                    }
                    @if (isEditableRun) {
                      <button type="button"
                              (click)="enterResults(run.id, undefined, true); $event.stopPropagation()"
                              class="min-w-0 flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3 text-xs font-bold text-white shadow-sm transition active:scale-[0.98]">
                        <i class="fa-solid fa-pen-to-square text-[11px]" aria-hidden="true"></i>
                        <span>Nhập kết quả</span>
                      </button>
                      <button type="button"
                              (click)="enterResults(run.id, undefined, false); $event.stopPropagation()"
                              title="Chi tiết mẻ chạy"
                              aria-label="Chi tiết mẻ chạy"
                              class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                        <i class="fa-solid fa-eye text-xs" aria-hidden="true"></i>
                      </button>
                    } @else {
                      <app-button class="min-w-0 flex-1" variant="secondary" size="sm" [fullWidth]="true" (click)="enterResults(run.id, undefined, false); $event.stopPropagation()">
                        <i class="fa-solid text-[11px] fa-eye" aria-hidden="true"></i>
                        <span>Xem & Đối chiếu</span>
                        <span class="sr-only">Chi tiết mẻ chạy</span>
                      </app-button>
                    }
                  </div>
                </div>
              } @empty {
                <app-empty-state
                  class="col-span-full block rounded-2xl border border-dashed border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  icon="fa-square-poll-vertical"
                  title="Không tìm thấy mẻ nào phù hợp.">
                  @if (hasActiveFilters()) {
                    <div emptyStateActions>
                      <app-button variant="ghost" size="sm" (click)="resetAllFilters()">Xóa bộ lọc</app-button>
                    </div>
                  }
                </app-empty-state>
              }
            </div>

          <!-- ─── TABLE VIEW ─── -->
          } @else if (viewMode() === 'table') {
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      @if (isMergeModeActive()) {
                        <th class="p-3.5 w-10 text-center"><i class="fa-solid fa-check-double" aria-hidden="true"></i></th>
                      }
                      <th class="p-3.5">Phương pháp / Mã mẻ</th>
                      <th class="p-3.5">Kiểm nghiệm viên</th>
                      <th class="p-3.5">Ngày chạy</th>
                      <th class="p-3.5">Mẫu & PDF</th>
                      <th class="p-3.5 text-center">Trạng thái</th>
                      <th class="p-3.5 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/70">
                    @for (run of paginatedRuns(); track run.id) {
                      @let projection = reportsProjectionMap()[run.id];
                      @let status = runStatusMap()[run.id] || 'pending';
                      @let isLocked = isRunLocked(run);
                      @let lockedByOther = isRunLockedByOther(run);
                      @let mergeCheck = mergeCandidateState(run);
                      @let isEditableRun = canEditResults() && !lockedByOther && status !== 'completed';
                      <tr [ngClass]="{'bg-indigo-50/30 dark:bg-indigo-950/15 border-l-2 border-l-indigo-500': lastSelectedRequestId() === run.id || selectedRunsMap()[run.id], 'opacity-45': isMergeModeActive() && !mergeCheck.compatible}"
                          class="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
                          (click)="enterResults(run.id)">

                        @if (isMergeModeActive()) {
                          <td class="p-3.5 text-center">
                            <label class="inline-flex items-center cursor-pointer" (click)="$event.stopPropagation()">
                              <input type="checkbox"
                                     [checked]="selectedRunsMap()[run.id]"
                                     [disabled]="!mergeCheck.compatible && !selectedRunsMap()[run.id]"
                                     (change)="toggleRunSelection(run)"
                                     [title]="mergeCheck.reason || 'Chọn để gộp mẻ'"
                                     class="w-4 h-4 text-indigo-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 disabled:opacity-40">
                            </label>
                          </td>
                        }

                        <td class="p-3.5">
                          <div class="flex items-center flex-wrap gap-2 mb-0.5">
                            <span class="w-2 h-2 rounded-full shrink-0" [ngClass]="{
                              'bg-emerald-500': status === 'completed',
                              'bg-indigo-500': status === 'draft',
                              'bg-amber-400': status === 'pending'
                            }"></span>
                            <span class="font-bold text-slate-800 dark:text-slate-100 text-xs">{{ run.sopName }}</span>
                            @if (run.isVirtualMaster) {
                              <span class="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">Mẻ gộp</span>
                            }
                            @if (projection?.hasStaleReport) {
                              <span class="px-2 py-0.5 rounded-full bg-amber-100/90 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold">Cần xuất lại</span>
                            }
                            @if (isLocked) {
                              <span class="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-bold inline-flex items-center gap-1" title="Đang được mở chỉnh sửa bởi {{ run.lockedByName || run.lockedBy }}">
                                <i class="fa-solid fa-lock text-[9px]" aria-hidden="true"></i> {{ run.lockedByName || 'Đang sửa' }}
                              </span>
                            }
                            @if (isMergeModeActive() && !mergeCheck.compatible && mergeCheck.reason) {
                              <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold">{{ mergeCheck.reason }}</span>
                            }
                          </div>
                          <div class="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-semibold ml-4">{{ run.inputs?.['batchCode'] || run.id || 'Chưa có mã mẻ' }}</div>
                          @if (run.isVirtualMaster && run.childRequestIds) {
                            <div class="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 ml-4 mt-0.5">
                              <i class="fa-solid fa-link text-[9px]" aria-hidden="true"></i> Gộp từ: {{ run.childRequestIds.join(', ') }}
                            </div>
                          }
                        </td>

                        <td class="p-3.5">
                          <div class="flex items-center gap-2">
                            <div [class]="getAnalystAvatarClass(run.user)" class="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold uppercase shrink-0">
                              {{ getAnalystInitials(run.user) }}
                            </div>
                            <span class="text-xs font-semibold truncate max-w-[120px]">{{ run.user || 'Unknown' }}</span>
                          </div>
                        </td>

                        <td class="p-3.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                          <i class="fa-regular fa-calendar mr-1 text-[10px]" aria-hidden="true"></i>
                          {{ getRunDate(run) ? formatAnalysisDate(getRunDate(run)) : '—' }}
                        </td>

                        <td class="p-3.5 min-w-[160px] max-w-[220px]">
                          <div class="flex items-center justify-between text-[11px] mb-1">
                            <span class="font-bold text-slate-700 dark:text-slate-200">{{ projection?.coverage?.published ?? 0 }}/{{ projection?.coverage?.total ?? 0 }} PDF</span>
                            <span class="text-slate-400 font-semibold tabular-nums">{{ projection?.coverage?.percent ?? 0 }}%</span>
                          </div>
                          <div class="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-1">
                            <div class="h-full rounded-full"
                                 [class]="projection?.hasStaleReport ? 'bg-amber-500' : (projection && projection.coverage.percent === 100 ? 'bg-emerald-500' : 'bg-indigo-500')"
                                 [style.width.%]="projection?.coverage?.percent ?? 0"></div>
                          </div>
                          <div class="truncate text-[10px] font-mono text-slate-400 dark:text-slate-500" [title]="run.sampleList ? formatSampleList(run.sampleList) : ''">
                            {{ run.sampleList ? formatSampleList(run.sampleList) : 'Trống' }}
                          </div>
                        </td>

                        <td class="p-3.5 text-center">
                          <span [class]="getStatusClass(run.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border">
                            <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                              'bg-emerald-500': status === 'completed',
                              'bg-indigo-500': status === 'draft',
                              'bg-amber-500': status === 'pending'
                            }"></span>
                            {{ getStatusText(run.id) }}
                          </span>
                        </td>

                        <td class="p-3.5">
                          <div class="flex items-center justify-end gap-1.5">
                            @if (projection?.hasAnyReport) {
                              <app-button variant="secondary" size="sm" (click)="openReportHub(run); $event.stopPropagation()">
                                <i class="fa-solid fa-file-pdf text-rose-500 text-[11px]" aria-hidden="true"></i>
                                <span>PDF ({{ projection?.cards?.length ?? 0 }})</span>
                              </app-button>
                            }
                            @if (isEditableRun) {
                              <button type="button"
                                      (click)="enterResults(run.id, undefined, true); $event.stopPropagation()"
                                      class="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3 text-xs font-bold text-white shadow-sm transition">
                                <i class="fa-solid fa-pen-to-square text-[10px]" aria-hidden="true"></i>
                                <span>Nhập kết quả</span>
                              </button>
                            }
                            <app-button variant="secondary" size="sm" (click)="enterResults(run.id, undefined, false); $event.stopPropagation()">
                              <i class="fa-solid fa-eye text-[10px]" aria-hidden="true"></i>
                              <span>Xem & Đối chiếu</span>
                            </app-button>
                          </div>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td [attr.colspan]="isMergeModeActive() ? 7 : 6">
                          <app-empty-state
                            class="block"
                            icon="fa-inbox"
                            title="Không tìm thấy mẻ nào phù hợp.">
                          </app-empty-state>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          @if (displayedRuns().length > pageSize) {
            <div class="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm">
              <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Hiển thị <span class="font-black text-slate-800 dark:text-slate-100">{{ pageStartIndex() }}</span>
                -
                <span class="font-black text-slate-800 dark:text-slate-100">{{ pageEndIndex() }}</span>
                / {{ displayedRuns().length }} mẻ
              </div>
              <div class="flex max-w-full items-center gap-1.5 overflow-x-auto custom-scrollbar">
                <button type="button" (click)="previousPage()" aria-label="Trang trước"
                        [disabled]="activePage() === 1"
                        class="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400 dark:hover:border-indigo-700 transition sm:w-9 sm:h-9">
                  <i class="fa-solid fa-chevron-left text-[10px]" aria-hidden="true"></i>
                </button>
                @for (page of visiblePageNumbers(); track page) {
                  <button type="button" (click)="setPage(page)"
                          class="min-w-10 h-10 px-2 rounded-xl border text-[11px] font-black transition sm:min-w-8 sm:h-8"
                          [class]="activePage() === page
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-700'">
                    {{ page }}
                  </button>
                }
                <button type="button" (click)="nextPage()" aria-label="Trang sau"
                        [disabled]="activePage() === totalPages()"
                        class="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400 dark:hover:border-indigo-700 transition sm:w-9 sm:h-9">
                  <i class="fa-solid fa-chevron-right text-[10px]" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          }
        }

      </div><!-- end content area -->

      <!-- ══════════════════════════════════════════════════════
           FLOATING MERGE ACTION BAR
      ══════════════════════════════════════════════════════ -->
      @if (selectedRunsCount() >= 2 || (isMergeModeActive() && selectedRunsCount() >= 1)) {
        @let liveValidation = mergeValidation();
        <div class="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-slate-950/95 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl flex flex-wrap items-center gap-3 sm:gap-5 border border-slate-700/70 backdrop-blur-md animate-fade-in z-40 max-w-[calc(100vw-2rem)]">
          <div class="flex flex-col min-w-0">
            <span class="text-xs font-bold text-slate-100">
              Đã chọn <span class="text-indigo-400 font-black">{{ selectedRunsCount() }}</span> mẻ · <span class="text-slate-300 font-semibold">{{ getSelectedSopName() }}</span>
            </span>
            <div class="flex flex-wrap items-center gap-1 mt-1 max-w-md">
              @for (sel of getSelectedRuns(); track sel.id) {
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono">
                  {{ sel.inputs?.['batchCode'] || sel.id }}
                  <button type="button" (click)="toggleRunSelection(sel)" aria-label="Bỏ chọn mẻ" class="text-slate-400 hover:text-white ml-0.5">
                    <i class="fa-solid fa-xmark text-[9px]" aria-hidden="true"></i>
                  </button>
                </span>
              }
            </div>
          </div>
          <div class="flex items-center gap-2 ml-auto">
            <app-button variant="ghost" size="sm" (click)="cancelSelection()">Hủy</app-button>
            <button type="button"
                    (click)="openMergeModal()"
                    [disabled]="selectedRunsCount() < 2 || !liveValidation.canOpenModal"
                    class="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 text-xs font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed">
              <i class="fa-solid fa-code-merge rotate-90 text-[10px]" aria-hidden="true"></i>
              <span>Gộp mẻ chạy ({{ selectedRunsCount() }})</span>
            </button>
          </div>
        </div>
      }

      <!-- ══════════════════════════════════════════════════════
           MERGE MODAL
      ══════════════════════════════════════════════════════ -->
      @if (showMergeModal()) {
        @defer {
          <app-merge-runs-modal
            [isOpen]="showMergeModal()"
            [selectedRuns]="getSelectedRuns()"
            [masterCurveRunId]="masterCurveRunId()"
            [unifiedDateString]="unifiedDateString()"
            [customMasterId]="customMasterId()"
            [validation]="mergeValidation()"
            [capability]="editCapability()"
            [userEmail]="currentUserEmail()"
            [sops]="state.sops() || []"
            [duplicateSampleSources]="duplicateSampleSources()"
            (close)="closeMergeModal()"
            (masterCurveRunIdChange)="masterCurveRunId.set($event)"
            (unifiedDateStringChange)="unifiedDateString.set($event)"
            (customMasterIdChange)="customMasterId.set($event)"
            (duplicateSampleSourcesChange)="duplicateSampleSources.set($event)"
            (merge)="executeMerge()">
          </app-merge-runs-modal>
        }
      }

      <!-- ══════════════════════════════════════════════════════
           REPORT HUB MODAL
      ══════════════════════════════════════════════════════ -->
      @if (showReportHubModal()) {
        @defer {
          <app-report-hub-modal
            [isOpen]="showReportHubModal()"
            [run]="selectedRequestForReport()"
            [historyList]="selectedRequestHistoryList()"
            [isLoadingHistory]="isLoadingHistory()"
            [runStatus]="selectedRequestForReport() ? runStatusMap()[selectedRequestForReport().id] : ''"
            (close)="closeReportHub()"
            (createReport)="enterResults($event.requestId, $event.prefix, true); closeReportHub()"
            (previewPdf)="openPdfPreview($event.pdfUrl, $event.docsUrl, $event.prefix, $event.version, $event.publishedBy, $event.publishedAt); closeReportHub()">
          </app-report-hub-modal>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultListComponent implements OnInit, OnDestroy {
  protected state = inject(StateService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private resultService = inject(ResultService);
  private fb = inject(FirebaseService);
  private readMonitor = inject(FirestoreReadMonitor);
  private toast = inject(ToastService);
  private printService = inject(PrintService);
  private activityEvents = inject(ActivityEventService);

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent) {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) {
      return;
    }
    if (this.searchInputRef?.nativeElement) {
      event.preventDefault();
      this.searchInputRef.nativeElement.focus();
      this.searchInputRef.nativeElement.select();
    }
  }

  formatSampleList = formatSampleList;
  getSafeGoogleUrl = getSafeGoogleUrl;

  editCapability = computed<ResultEditCapability>(() => ({
    isManager: this.auth.isManager(),
    canRunBatch: this.auth.canRunBatch(),
    canApprove: this.auth.canApprove(),
    permissions: this.auth.userPermissions()
  }));
  canEditResults = computed(() => canUserEditResults(this.editCapability()));
  currentUserEmail = computed(() => this.state.currentUser()?.email || this.auth.currentUser()?.email || null);

  isLoading = signal(true);
  filterStatus = signal<'all' | 'pending' | 'draft' | 'completed'>('all');
  quickFilter = signal<'none' | 'stale' | 'locked' | 'merged'>('none');
  readonly pageSize = 24;
  currentPage = signal<number>(1);

  // Advanced Filters State
  searchText = signal<string>('');
  selectedSopId = signal<string>('all');
  selectedAnalyst = signal<string>('all');
  
  // Active filters count
  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.searchText().trim()) count++;
    if (this.selectedSopId() !== 'all') count++;
    if (this.selectedAnalyst() !== 'all') count++;
    if (this.startDate() || this.endDate()) count++;
    return count;
  });

  // Dynamic Multi-day Merging State (Option C)
  isMergeModeActive = signal<boolean>(false);
  selectedRunsMap = signal<Record<string, boolean>>({});
  selectedRunsCount = computed(() => Object.values(this.selectedRunsMap()).filter(Boolean).length);
  showMergeModal = signal<boolean>(false);
  masterCurveRunId = signal<string>('');
  unifiedDateString = signal<string>('');
  customMasterId = signal<string>('');
  duplicateSampleSources = signal<Record<string, string>>({});

  // Premium Dashboard & View Mode States
  viewMode = signal<'grid' | 'table'>('grid');
  activeReportDropdownId = signal<string | null>(null);

  // Premium Glassmorphic Report Hub Modal States
  showReportHubModal = signal<boolean>(false);
  selectedRequestForReport = signal<any | null>(null);
  selectedRequestHistoryList = signal<any[]>([]);
  isLoadingHistory = signal<boolean>(false);
  private reportHubSubscription?: any;

  async openReportHub(run: any) {
    this.selectedRequestForReport.set(run);
    this.showReportHubModal.set(true);
    this.isLoadingHistory.set(true);
    this.selectedRequestHistoryList.set([]);
    
    // Đăng ký lắng nghe thời gian thực của document mẻ chạy này để luôn có bản in mới nhất
    if (this.reportHubSubscription) {
      this.reportHubSubscription();
    }
    this.reportHubSubscription = this.resultService.subscribeToDraft(run.id, (draft: any, updatedRun: any) => {
      if (updatedRun) {
        this.selectedRequestForReport.set(updatedRun);
      }
    });
    
    try {
      const hist = await this.resultService.getHistory(run.id);
      this.selectedRequestHistoryList.set(hist || []);
    } catch (e) {
      console.error('Error fetching report history:', e);
    } finally {
      this.isLoadingHistory.set(false);
    }
  }

  closeReportHub() {
    this.showReportHubModal.set(false);
    this.selectedRequestForReport.set(null);
    this.selectedRequestHistoryList.set([]);
    
    if (this.reportHubSubscription) {
      this.reportHubSubscription();
      this.reportHubSubscription = undefined;
    }
  }

  openPdfPreview(pdfUrl: string | null | undefined, docsUrl?: string | null | undefined, prefix?: string, versionOverride?: number, analystOverride?: string, dateOverride?: any) {
    if (!pdfUrl) return;
    const run = this.selectedRequestForReport();
    const sopName = run?.sopName || '';
    const filterName = prefix === 'ALL' || !prefix ? 'Tất cả mẫu' : (prefix === '' ? 'Không tiền tố' : `Nhóm ${prefix}`);
    const previewUrl = this.getGoogleDrivePreviewUrl(pdfUrl);
    const docPreviewUrl = docsUrl ? this.getGoogleDrivePreviewUrl(docsUrl) : undefined;
    const version = versionOverride !== undefined ? versionOverride : (run?.analysisResultSummary?.version || run?.analysisResult?.version || 1);
    const analyst = analystOverride !== undefined ? analystOverride : (run?.user || 'Chưa rõ');
    const publishDate = dateOverride !== undefined ? dateOverride : (run?.analysisResultSummary?.updatedAt || run?.analysisResult?.pdfCreatedAt);

    this.printService.openPdfPreview(
      previewUrl,
      `Báo cáo kết quả — ${sopName} (${filterName})`,
      version,
      analyst,
      publishDate,
      'iframe',
      docPreviewUrl
    );
  }

  getGoogleDrivePreviewUrl(url: string | null | undefined): string {
    return getSafeGooglePreviewUrl(url);
  }

  asReport(val: unknown): any {
    return val;
  }

  getSelectedRunPrefixes(): string[] {
    const run = this.selectedRequestForReport();
    if (!run) return [];
    
    const prefixes = new Set<string>();
    
    // Quét từ danh sách mẫu thực tế
    (run.sampleList || []).forEach((s: string) => {
      const startsWithLetter = /^[a-zA-Z]/.test(s);
      const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
      prefixes.add(prefix);
    });
    
    return Array.from(prefixes).sort();
  }

  getReportsForPrefix(prefix: string): any[] {
    const run = this.selectedRequestForReport();
    if (!run) return [];
    const reports = run.analysisResultSummary?.reports || run.analysisResult?.reports;
    if (!reports) return [];
    
    const prefixKey = prefix === '' ? '_NO_PREFIX_' : prefix;
    const result: any[] = [];
    
    for (const [key, rep] of Object.entries(reports)) {
      const repPrefix = (rep as any).prefix || key;
      if (repPrefix === prefixKey && ((rep as any).pdfUrl || (rep as any).pdfViewUrl)) {
        result.push({ ...(rep as any), _id: key });
      }
    }
    
    return result.sort((a, b) => (b.version || 0) - (a.version || 0));
  }

  hasAnyPrefixReport(): boolean {
    const prefixes = this.getSelectedRunPrefixes();
    return prefixes.some(pref => this.getReportsForPrefix(pref).length > 0);
  }

  /**
   * Format danh sách mẫu thành chuỗi ngắn gọn, thông minh:
   * - Nếu consecutive (B001, B002, B003) → "B001 -> B003"
   * - Nếu rời rạc → "B001; B004; B008"
   * - Nếu quá dài → cắt và thêm "+N nhóm nữa"
   */
  formatSampleRange(samples: string[], maxDisplay = 999): string {
    if (!samples || samples.length === 0) return '';
    const shortened = this.getShortenedSampleChips(samples);
    if (shortened.length <= maxDisplay) return shortened.join('; ');
    const shown = shortened.slice(0, maxDisplay).join('; ');
    return `${shown} +${shortened.length - maxDisplay} nhóm nữa`;
  }

  /**
   * Nhóm danh sách mẫu thành các đoạn liên tục dưới dạng mảng (để render các chip rút gọn)
   */
  getShortenedSampleChips(samples: string[]): string[] {
    const formatted = formatSampleList(samples);
    if (!formatted) return [];
    return formatted.split('; ').map(s => s.trim());
  }

  averageCompletion = computed(() => {
    const runs = this.allApprovedRuns();
    if (runs.length === 0) return 0;
    const total = runs.reduce((sum: number, run: any) => sum + this.getRunProgress(run), 0);
    return Math.round(total / runs.length);
  });

  completedCount = computed(() => {
    const statusMap = this.runStatusMap();
    return this.allApprovedRuns().filter((run: any) => (statusMap[run.id] || 'pending') === 'completed').length;
  });

  reportsProjectionMap = computed<Record<string, BatchReportsProjection>>(() => {
    const map: Record<string, BatchReportsProjection> = {};
    for (const run of this.allApprovedRuns()) {
      map[run.id] = buildBatchReportsProjection(run);
    }
    return map;
  });

  staleRunsCount = computed(() => {
    const proj = this.reportsProjectionMap();
    return this.allApprovedRuns().filter((run: any) => proj[run.id]?.hasStaleReport).length;
  });

  lockedRunsCount = computed(() => {
    return this.allApprovedRuns().filter((run: any) => this.isRunLocked(run)).length;
  });

  mergedRunsCount = computed(() => {
    return this.allApprovedRuns().filter((run: any) => Boolean(run.isVirtualMaster || run.parentMasterId)).length;
  });

  pendingCount = computed(() => {
    return this.filteredCount('pending');
  });

  sopDistribution = computed(() => {
    const runs = this.allApprovedRuns();
    const distribution: Record<string, { count: number; name: string }> = {};

    const colorPalette = [
      { bg: 'bg-indigo-50/70 dark:bg-indigo-950/20', text: 'text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-900/40', bar: 'bg-indigo-500' },
      { bg: 'bg-blue-50/70 dark:bg-blue-950/20', text: 'text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/40', bar: 'bg-blue-500' },
      { bg: 'bg-slate-50/80 dark:bg-slate-800/40', text: 'text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-slate-700/60', bar: 'bg-slate-500' },
      { bg: 'bg-amber-50/70 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40', bar: 'bg-amber-500' },
      { bg: 'bg-emerald-50/70 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40', bar: 'bg-emerald-500' },
    ];

    runs.forEach((run: any) => {
      const sopId = run.sopId || 'unknown';
      const sopName = run.sopName || 'Khác';
      
      if (!distribution[sopId]) {
        distribution[sopId] = {
          count: 0,
          name: sopName
        };
      }
      distribution[sopId].count++;
    });

    return Object.entries(distribution).map(([id, data], index) => {
      const palette = colorPalette[index % colorPalette.length];
      return {
        id,
        count: data.count,
        name: data.name,
        bgClass: palette.bg,
        textClass: palette.text,
        barColor: palette.bar
      };
    }).sort((a, b) => b.count - a.count);
  });

  // Date Filters
  startDate = signal<string>('');
  endDate = signal<string>('');
  showAdvancedFilters = signal<boolean>(false);

  // Dynamic history loading states
  historiesMap = signal<Record<string, any[]>>({});
  loadingHistories = signal<Record<string, boolean>>({});

  getReportKeys(reports: any): string[] {
    if (!reports) return [];
    return Object.keys(reports).sort();
  }

  // Premium design dynamic helper methods
  getSopGradientClass(sopId: string | undefined): string {
    if (!sopId) return 'from-slate-400 to-slate-500';
    if (sopId === 'trifluralin-gcms') {
      return 'from-indigo-500 to-blue-500';
    }
    if (sopId === 'fipronil-chlorpyrifos') {
      return 'from-indigo-500 to-sky-500';
    }
    return 'from-indigo-500 to-slate-500';
  }

  getAnalystInitials(user: string | undefined): string {
    if (!user) return '?';
    const parts = user.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  getAnalystAvatarClass(user: string | undefined): string {
    if (!user) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    const colors = [
      'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/40',
      'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40',
      'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40',
      'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40',
      'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/40',
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    ];
    let sum = 0;
    for (let i = 0; i < user.length; i++) {
      sum += user.charCodeAt(i);
    }
    return colors[sum % colors.length];
  }

  getRunProgress(run: any): number {
    // resultData is now in results_details (not cached). Use completion status as proxy.
    const status = this.runStatusMap()[run.id] || 'pending';
    if (status === 'completed') return 100;
    if (status === 'draft') return 50;
    return 0;
  }

  async preloadHistory(requestId: string) {
    if (this.historiesMap()[requestId] || this.loadingHistories()[requestId]) return;
    
    this.loadingHistories.update((map: any) => ({ ...map, [requestId]: true }));
    try {
      const hist = await this.resultService.getHistory(requestId);
      this.historiesMap.update((map: any) => ({ ...map, [requestId]: hist }));
    } finally {
      this.loadingHistories.update((map: any) => ({ ...map, [requestId]: false }));
    }
  }

  runStatusMap = computed(() => {
    const statusMap: Record<string, 'pending' | 'draft' | 'completed'> = {};
    const all = this.state.approvedRequests() || [];
    all.forEach((run: any) => {
      // Post-Document-Splitting: saveDraft() writes status to root of requests doc
      // ('draft' | 'completed'). Root status='approved' means no entry done yet.
      // Legacy backward compat: also check analysisResult.status for old docs.
      const rootStatus: string = run.status || 'approved';
      if (rootStatus === 'draft' || rootStatus === 'completed') {
        statusMap[run.id] = rootStatus as 'draft' | 'completed';
      } else {
        // 'approved' or unknown → check legacy analysisResult field
        statusMap[run.id] = run.analysisResult?.status || 'pending';
      }
    });
    return statusMap;
  });

  lastSelectedRequestId = signal<string | null>(null);

  saveState() {
    try {
      const scrollContainer = document.querySelector('.app-content-scroll') || document.querySelector('main .overflow-y-auto');
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

      const stateToSave = {
        viewMode: this.viewMode(),
        filterStatus: this.filterStatus(),
        quickFilter: this.quickFilter(),
        currentPage: this.activePage(),
        searchText: this.searchText(),
        selectedSopId: this.selectedSopId(),
        selectedAnalyst: this.selectedAnalyst(),
        showAdvancedFilters: this.showAdvancedFilters(),
        startDate: this.startDate(),
        endDate: this.endDate(),
        dateFilterBasis: 'approvedAt',
        isMergeModeActive: this.isMergeModeActive(),
        selectedRunsMap: this.selectedRunsMap(),
        scrollTop
      };
      sessionStorage.setItem('lims_results_list_state', JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving results list state:', e);
    }
  }

  restoreState() {
    try {
      const saved = sessionStorage.getItem('lims_results_list_state');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.viewMode) this.viewMode.set(state.viewMode);
        if (state.filterStatus) this.filterStatus.set(state.filterStatus);
        if (state.quickFilter) this.quickFilter.set(state.quickFilter);
        if (state.currentPage) this.currentPage.set(state.currentPage);
        if (state.searchText !== undefined) this.searchText.set(state.searchText);
        if (state.selectedSopId) this.selectedSopId.set(state.selectedSopId);
        if (state.selectedAnalyst) this.selectedAnalyst.set(state.selectedAnalyst);
        if (state.showAdvancedFilters !== undefined) this.showAdvancedFilters.set(state.showAdvancedFilters);
        // Older sessions saved an automatic Today range using analysis date.
        // Start those sessions without a date filter when switching to approval date.
        if (state.dateFilterBasis === 'approvedAt') {
          if (typeof state.startDate === 'string') this.startDate.set(state.startDate);
          if (typeof state.endDate === 'string') this.endDate.set(state.endDate);
        }
        if (state.isMergeModeActive !== undefined) this.isMergeModeActive.set(state.isMergeModeActive);
        if (state.selectedRunsMap) this.selectedRunsMap.set(state.selectedRunsMap);
      }
      
      const lastId = sessionStorage.getItem('lims_last_selected_request_id');
      if (lastId) {
        this.lastSelectedRequestId.set(lastId);
        sessionStorage.removeItem('lims_last_selected_request_id');
        setTimeout(() => {
          this.lastSelectedRequestId.set(null);
        }, 4000); // Highlight for 4 seconds then fade out
      }
    } catch (e) {
      console.error('Error restoring results list state:', e);
    }
  }

  restoreScrollPosition() {
    try {
      const saved = sessionStorage.getItem('lims_results_list_state');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.scrollTop) {
          const scrollContainer = document.querySelector('.app-content-scroll') || document.querySelector('main .overflow-y-auto');
          if (scrollContainer) {
            scrollContainer.scrollTop = state.scrollTop;
          }
        }
      }
    } catch (e) {
      console.error('Error restoring scroll position:', e);
    }
  }

  ngOnInit() {
    this.state.ensureApprovedRequestsListener();
    this.restoreState();
    this.isLoading.set(false);

    setTimeout(() => {
      this.restoreScrollPosition();
    }, 100);
  }

  ngOnDestroy() {
    this.saveState();
    if (this.reportHubSubscription) {
      this.reportHubSubscription();
    }
  }

  // Danh sách các mẻ đã duyệt thành công
  allApprovedRuns = computed(() => {
    return this.state.approvedRequests() || [];
  });

  // Dynamic lists for filters
  availableSops = computed(() => {
    const runs = this.allApprovedRuns();
    const map = new Map<string, string>(); // sopId -> sopName
    runs.forEach((run: any) => {
      if (run.sopId && run.sopName) {
        map.set(run.sopId, run.sopName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  });

  availableAnalysts = computed(() => {
    const runs = this.allApprovedRuns();
    const set = new Set<string>();
    runs.forEach((run: any) => {
      if (run.user) set.add(run.user);
    });
    return Array.from(set).sort();
  });

  // Lọc danh sách mẻ hiển thị theo bộ lọc
  displayedRuns = computed(() => {
    let list = this.allApprovedRuns();
    
    // 1. Filter by Search Text
    const search = this.searchText().trim().toLowerCase();
    if (search) {
      list = list.filter((run: any) => {
        const batchCode = (run.inputs?.['batchCode'] || run.id || '').toLowerCase();
        const sopName = (run.sopName || '').toLowerCase();
        const user = (run.user || '').toLowerCase();
        const samples = (run.sampleList || []).map((s: string) => s.toLowerCase());
        return batchCode.includes(search) || sopName.includes(search) || user.includes(search) || samples.some((s: string) => s.includes(search));
      });
    }

    // 2. Filter by SOP
    const sopId = this.selectedSopId();
    if (sopId !== 'all') {
      list = list.filter((run: any) => run.sopId === sopId);
    }

    // 3. Filter by Analyst
    const analyst = this.selectedAnalyst();
    if (analyst !== 'all') {
      list = list.filter((run: any) => run.user === analyst);
    }

    // 4. Filter by Date
    const start = this.startDate();
    const end = this.endDate();
    if (start || end) {
      list = list.filter((run: any) => {
        const runDate = this.getRunApprovalDate(run);
        if (!runDate) return false;
        if (start && runDate < start) return false;
        if (end && runDate > end) return false;
        return true;
      });
    }

    // 5. Quick Operational Filter
    list = this.applyQuickFilter(list);

    // 6. Filter by Status Tab
    const statusFilter = this.filterStatus();
    const statusMap = this.runStatusMap();
    if (statusFilter !== 'all') {
      list = list.filter((run: any) => (statusMap[run.id] || 'pending') === statusFilter);
    }

    return list;
  });

  private applyQuickFilter(list: any[]): any[] {
    const q = this.quickFilter();
    if (q === 'none') return list;
    const proj = this.reportsProjectionMap();
    if (q === 'stale') {
      return list.filter((run: any) => proj[run.id]?.hasStaleReport);
    }
    if (q === 'locked') {
      return list.filter((run: any) => this.isRunLocked(run));
    }
    if (q === 'merged') {
      return list.filter((run: any) => Boolean(run.isVirtualMaster || run.parentMasterId));
    }
    return list;
  }

  totalPages = computed(() => Math.max(1, Math.ceil(this.displayedRuns().length / this.pageSize)));

  activePage = computed(() => Math.min(Math.max(this.currentPage(), 1), this.totalPages()));

  paginatedRuns = computed(() => {
    const start = (this.activePage() - 1) * this.pageSize;
    return this.displayedRuns().slice(start, start + this.pageSize);
  });

  pageStartIndex = computed(() => {
    const total = this.displayedRuns().length;
    return total === 0 ? 0 : ((this.activePage() - 1) * this.pageSize) + 1;
  });

  pageEndIndex = computed(() => Math.min(this.activePage() * this.pageSize, this.displayedRuns().length));

  visiblePageNumbers = computed(() => {
    const total = this.totalPages();
    const active = this.activePage();
    const start = Math.max(1, Math.min(active - 2, total - 4));
    const end = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  setPage(page: number) {
    this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages()));
    this.scrollResultsToTop();
  }

  previousPage() {
    this.setPage(this.activePage() - 1);
  }

  nextPage() {
    this.setPage(this.activePage() + 1);
  }

  private resetPaging() {
    this.currentPage.set(1);
    this.scrollResultsToTop();
  }

  private scrollResultsToTop() {
    setTimeout(() => {
      const scrollContainer = document.querySelector('.app-content-scroll') || document.querySelector('main .overflow-y-auto');
      if (scrollContainer) scrollContainer.scrollTop = 0;
    }, 0);
  }

  // Đếm số lượng mẻ theo bộ lọc (áp dụng các bộ lọc nâng cao)
  filteredCount(status: 'all' | 'pending' | 'draft' | 'completed'): number {
    let list = this.allApprovedRuns();
    
    const search = this.searchText().trim().toLowerCase();
    if (search) {
      list = list.filter((run: any) => {
        const batchCode = (run.inputs?.['batchCode'] || run.id || '').toLowerCase();
        const sopName = (run.sopName || '').toLowerCase();
        const user = (run.user || '').toLowerCase();
        const samples = (run.sampleList || []).map((s: string) => s.toLowerCase());
        return batchCode.includes(search) || sopName.includes(search) || user.includes(search) || samples.some((s: string) => s.includes(search));
      });
    }

    const sopId = this.selectedSopId();
    if (sopId !== 'all') {
      list = list.filter((run: any) => run.sopId === sopId);
    }

    const analyst = this.selectedAnalyst();
    if (analyst !== 'all') {
      list = list.filter((run: any) => run.user === analyst);
    }

    const start = this.startDate();
    const end = this.endDate();
    if (start || end) {
      list = list.filter((run: any) => {
        const runDate = this.getRunApprovalDate(run);
        if (!runDate) return false;
        if (start && runDate < start) return false;
        if (end && runDate > end) return false;
        return true;
      });
    }

    list = this.applyQuickFilter(list);

    const statusMap = this.runStatusMap();
    if (status === 'all') return list.length;
    return list.filter((run: any) => (statusMap[run.id] || 'pending') === status).length;
  }

  getStatusText(requestId: string): string {
    const status = this.runStatusMap()[requestId] || 'pending';
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'draft': return 'Đang nháp';
      default: return 'Chờ nhập';
    }
  }

  getStatusClass(requestId: string): string {
    const status = this.runStatusMap()[requestId] || 'pending';
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-900/40';
      case 'draft':
        return 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200/70 dark:border-indigo-900/40';
      default:
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-900/40';
    }
  }

  isRunLocked(run: any): boolean {
    if (!run?.lockedBy) return false;
    if (run.lastActiveAt) {
      const convert = (ts: any) => {
        if (!ts) return null;
        if (ts instanceof Date) return ts;
        if (typeof ts.toDate === 'function') return ts.toDate();
        if (ts.seconds !== undefined) return new Date(ts.seconds * 1000);
        return new Date(ts);
      };
      const lastActive = convert(run.lastActiveAt);
      if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
        return false;
      }
    }
    return true;
  }

  isRunLockedByOther(run: any): boolean {
    return isRunActivelyLockedByOthers(run, this.currentUserEmail());
  }

  copyBatchCode(code: string, event: Event) {
    event.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      this.toast.show(`Đã sao chép mã mẻ: ${code}`, 'success');
    }).catch(() => {
      this.toast.show('Không thể sao chép mã mẻ', 'error');
    });
  }

  toggleQuickFilter(filter: 'stale' | 'locked' | 'merged') {
    this.quickFilter.set(this.quickFilter() === filter ? 'none' : filter);
    this.resetPaging();
  }

  getRunApprovalDate(run: any): string {
    return timestampToLocalDateKey(run.approvedAt ?? run.timestamp) || '';
  }

  getRunDate(run: any): string {
    if (run.analysisDate) return run.analysisDate;
    
    const convert = (ts: any) => {
      if (!ts) return null;
      if (ts instanceof Date) return ts;
      if (typeof ts.toDate === 'function') return ts.toDate();
      if (ts.seconds !== undefined) return new Date(ts.seconds * 1000);
      return new Date(ts);
    };

    const d = convert(run.approvedAt || run.timestamp);
    if (d && !isNaN(d.getTime())) {
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - (offset * 60 * 1000));
      return local.toISOString().split('T')[0];
    }
    return '';
  }

  formatAnalysisDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  // Event handlers cho bộ lọc nâng cao
  setStatusFilter(status: 'all' | 'pending' | 'draft' | 'completed') {
    this.filterStatus.set(status);
    this.resetPaging();
  }

  showAllRuns() {
    this.filterStatus.set('all');
    this.selectedSopId.set('all');
    this.resetPaging();
  }

  toggleSopFilter(sopId: string) {
    this.selectedSopId.set(this.selectedSopId() === sopId ? 'all' : sopId);
    this.resetPaging();
  }

  clearSearch() {
    this.searchText.set('');
    this.resetPaging();
  }

  onSearchInput(event: Event) {
    this.searchText.set((event.target as HTMLInputElement).value);
    this.resetPaging();
  }

  onSopChange(event: any) {
    this.selectedSopId.set(event.target.value);
    this.resetPaging();
  }

  onAnalystChange(event: any) {
    this.selectedAnalyst.set(event.target.value);
    this.resetPaging();
  }

  onDateRangeChange(range: { start: string, end: string, label: string }) {
    if (range.start === this.startDate() && range.end === this.endDate()) return;
    this.startDate.set(range.start);
    this.endDate.set(range.end);
    this.resetPaging();
  }

  toggleMergeMode() {
    if (!this.isMergeModeActive() && !this.canEditResults()) {
      this.toast.show('Bạn không có quyền gộp mẻ phân tích.', 'error');
      return;
    }
    const nextVal = !this.isMergeModeActive();
    this.isMergeModeActive.set(nextVal);
    if (!nextVal) {
      this.selectedRunsMap.set({});
    }
  }

  hasActiveFilters(): boolean {
    return this.searchText() !== '' ||
           this.selectedSopId() !== 'all' ||
           this.selectedAnalyst() !== 'all' ||
           this.startDate() !== '' ||
           this.endDate() !== '' ||
           this.quickFilter() !== 'none';
  }

  resetAllFilters() {
    this.searchText.set('');
    this.selectedSopId.set('all');
    this.selectedAnalyst.set('all');
    this.startDate.set('');
    this.endDate.set('');
    this.quickFilter.set('none');
    this.resetPaging();
  }

  mergeCandidateState(run: any): { compatible: boolean; reason?: string } {
    if (!this.isMergeModeActive()) return { compatible: true };
    if (run.isVirtualMaster) return { compatible: false, reason: 'Mẻ gộp' };
    if (run.parentMasterId) return { compatible: false, reason: 'Đã gộp' };
    if (this.isRunLockedByOther(run)) {
      return { compatible: false, reason: `Khóa (${run.lockedByName || 'KTV'})` };
    }
    const selected = this.getSelectedRuns();
    if (selected.length === 0) return { compatible: true };
    return isRunCandidateCompatibleForMerge(selected[0], run, this.state.sops() || []);
  }

  mergeValidation = computed<MergeRunsValidation>(() => {
    return validateMergeRuns({
      selectedRuns: this.getSelectedRuns(),
      capability: this.editCapability(),
      userEmail: this.currentUserEmail(),
      sops: this.state.sops() || [],
      duplicateSampleSources: this.duplicateSampleSources()
    });
  });

  // Option C selection and merging handlers
  toggleRunSelection(run: any) {
    const current = { ...this.selectedRunsMap() };
    const checked = !current[run.id];

    if (checked) {
      const check = this.mergeCandidateState(run);
      if (!check.compatible) {
        this.toast.show(`Không thể chọn mẻ này: ${check.reason || 'Không tương thích SOP/đơn vị'}.`, 'info');
        return;
      }
      current[run.id] = true;
    } else {
      delete current[run.id];
    }
    this.selectedRunsMap.set(current);
    this.duplicateSampleSources.set({});
  }

  getSelectedRuns(): any[] {
    const map = this.selectedRunsMap();
    return this.allApprovedRuns().filter((run: any) => map[run.id]);
  }

  getSelectedSopName(): string {
    const runs = this.getSelectedRuns();
    return runs.length > 0 ? runs[0].sopName : '';
  }

  cancelSelection() {
    this.selectedRunsMap.set({});
    this.duplicateSampleSources.set({});
  }

  openMergeModal() {
    this.duplicateSampleSources.set({});
    const validation = this.mergeValidation();
    if (!validation.canOpenModal) {
      this.toast.show(validation.blockers[0] || 'Không thể gộp các mẻ đã chọn.', 'error');
      return;
    }
    const runs = this.getSelectedRuns();
    if (runs.length < 2) return;
    
    // Choose default master curve (first one with existing calibration if available)
    // resultData lives in results_details (not in cache) — pick the oldest run as default master
    const defaultCurve = runs[0];
    this.masterCurveRunId.set(defaultCurve.id);
    
    // Auto-generate date range
    const dates = runs.map(r => this.getRunDate(r)).filter(Boolean).map(d => this.formatAnalysisDate(d));
    const uniqueDates = Array.from(new Set(dates)).sort();
    if (uniqueDates.length === 1) {
      this.unifiedDateString.set(uniqueDates[0]);
    } else if (uniqueDates.length > 1) {
      this.unifiedDateString.set(`${uniqueDates[0]} - ${uniqueDates[uniqueDates.length - 1]}`);
    } else {
      this.unifiedDateString.set(this.formatAnalysisDate(new Date().toISOString().split('T')[0]));
    }
    
    // Auto-generate custom master ID
    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const sopShort = runs[0].sopId === 'trifluralin-gcms' ? 'TRIFLURALIN' : 'SOP';
    this.customMasterId.set(`GOP-${sopShort}-${todayStr}`);
    
    this.showMergeModal.set(true);
  }

  closeMergeModal() {
    this.showMergeModal.set(false);
    this.duplicateSampleSources.set({});
  }

  onUnifiedDateChange(event: Event) {
    this.unifiedDateString.set((event.target as HTMLInputElement).value);
  }

  onCustomMasterIdChange(event: Event) {
    this.customMasterId.set((event.target as HTMLInputElement).value.toUpperCase());
  }

  async executeMerge() {
    const selectedSources = this.duplicateSampleSources();
    const validation = validateMergeRuns({
      selectedRuns: this.getSelectedRuns(),
      capability: this.editCapability(),
      userEmail: this.currentUserEmail(),
      sops: this.state.sops() || [],
      duplicateSampleSources: selectedSources
    });
    if (!validation.canMerge) {
      this.toast.show(validation.blockers[0] || 'Không thể gộp mẻ chạy.', 'error');
      return;
    }
    const sops = this.getSelectedRuns();
    if (sops.length < 2) return;
    const masterId = this.customMasterId().trim().toUpperCase() || `GOP-${Date.now()}`;
    const masterCurveId = this.masterCurveRunId();
    const curveRun = sops.find(r => r.id === masterCurveId) || sops[0];
    const runById = new Map<string, any>(sops.map(r => [r.id, r]));

    // Combine sample lists and resolve exact source run per sample (never silent overwrite on duplicates)
    const allSamples = new Set<string>();
    const allTargetIds = new Set<string>();
    const combinedSampleTargetMap: Record<string, string[]> = {};
    const combinedTargetNames: Record<string, string> = {};
    const sampleSourceRunIds: Record<string, string> = {};

    sops.forEach(r => {
      if (r.sampleList) {
        r.sampleList.forEach((s: string) => {
          allSamples.add(s);
          if (!sampleSourceRunIds[s]) {
            sampleSourceRunIds[s] = r.id;
          }
        });
      }
      if (r.targetIds) {
        r.targetIds.forEach((t: string) => allTargetIds.add(t));
      }
      const rTargetNames = r.targetNames || r.inputs?.targetNames;
      if (rTargetNames) {
        Object.entries(rTargetNames).forEach(([targetId, targetName]) => {
          if (targetName !== null && targetName !== undefined) {
            combinedTargetNames[targetId] = String(targetName);
          }
        });
      }
    });

    for (const dupSample of validation.duplicateSamples) {
      const explicitRunId = selectedSources[dupSample];
      if (!explicitRunId || !runById.has(explicitRunId)) {
        this.toast.show(`Thiếu mẻ nguồn cho mẫu trùng ${dupSample}.`, 'error');
        return;
      }
      sampleSourceRunIds[dupSample] = explicitRunId;
    }

    const sampleList = Array.from(allSamples).sort();
    for (const sampleId of sampleList) {
      const ownerRun = runById.get(sampleSourceRunIds[sampleId]);
      const rMap = ownerRun?.sampleTargetMap || ownerRun?.inputs?.sampleTargetMap;
      if (rMap?.[sampleId]) {
        combinedSampleTargetMap[sampleId] = Array.from(new Set(rMap[sampleId]));
      }
    }
    const targetIds = Array.from(allTargetIds);

    try {
      this.isLoading.set(true);

      // 1. Fetch details of all child runs to merge their data. Firestore's
      // documentId IN query caps each batch at 30 ids; batching avoids one
      // billed point-read per selected run while preserving the same map.
      const detailMap = await this.getResultDetailsByIds(sops.map(run => run.id));

      // 2. Prepare grid data for the Virtual Master
      const resultData: Record<string, any> = {};
      const curveDetail = detailMap.get(curveRun.id) || {};
      const curveResultData = curveDetail.resultData || {};
      const curvePage1Data = curveDetail.page1Data || {};
      
      // Copy calibration and QC from the master curve run
      Object.keys(curveResultData).forEach(key => {
        if (key.startsWith('CAL_') || key.startsWith('QC_') || key.includes('BLANK') || key.includes('SPIKE') || key.includes('FINAL')) {
          resultData[key] = { ...curveResultData[key] };
        }
      });

      // Copy each sample row strictly from its resolved source run
      sampleList.forEach((sampleId: string) => {
        const sourceRunId = sampleSourceRunIds[sampleId];
        const sourceDetail = detailMap.get(sourceRunId) || {};
        const sourceResultData = sourceDetail.resultData || {};
        resultData[sampleId] = sourceResultData[sampleId] ? { ...sourceResultData[sampleId] } : {};
      });

      // 3. Prepare the Virtual Master payload (requests metadata)
      const masterPayload: any = {
        sopId: curveRun.sopId,
        sopName: curveRun.sopName,
        items: curveRun.items || [],
        isVirtualMaster: true,
        childRequestIds: sops.map(r => r.id),
        mergedSampleSources: sampleSourceRunIds,
        timestamp: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        approvedAt: serverTimestamp(),
        user: this.state.getCurrentUserName(),
        inputs: {
          ...(curveRun.inputs || {}),
          batchCode: masterId,
          analysisDate: this.unifiedDateString()
        },
        sampleList,
        targetIds,
        targetNames: combinedTargetNames,
        sampleTargetMap: combinedSampleTargetMap,
        status: 'approved' as const
      };

      // 4. Prepare details payload (results_details)
      const detailPayload: any = {
        requestId: masterId,
        sopId: curveRun.sopId,
        page1Data: {
          ...(curvePage1Data || {}),
          ngayNguoiPhanTich: new Date().toISOString().split('T')[0],
          ngayNguoiThamTra: new Date().toISOString().split('T')[0],
          checkTatCaND: true,
          checkCoMauPhatHien: false
        },
        resultData,
        updatedAt: new Date().toISOString(),
        updatedBy: this.state.getCurrentUserName()
      };

      // 5. Save directly to Firestore via Batch
      const batch = writeBatch(this.fb.db);
      const metaRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', masterId);
      const detailRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', masterId);
      
      batch.set(metaRef, masterPayload);
      batch.set(detailRef, detailPayload);
      
      // 6. Set parentMasterId on all child requests
      sops.forEach(r => {
        const childRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', r.id);
        batch.update(childRef, { parentMasterId: masterId });
      });
      
      // 7. Tạo nhật ký kiểm tra
      const logId = `TRC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);
      const activityEvent = this.activityEvents.build({
        eventId: logId,
        action: 'CREATE_VIRTUAL_MASTER',
        details: `Đã tạo mẻ tổng hợp (gộp mẫu) cho ${masterId}`,
        targetType: 'REQUEST',
        targetId: masterId,
        targetName: curveRun.sopName,
        requestId: masterId,
        publicTraceable: true,
        metadata: { sopId: curveRun.sopId, count: sops.length, mergedSampleSources: sampleSourceRunIds },
        legacyFields: {
          sopBasicInfo: {
            name: curveRun.sopName,
            category: 'SOP'
          }
        }
      });
      this.activityEvents.setInBatch(batch, logRef, activityEvent);

      await batch.commit();
      
      // Close modal and deselect
      this.closeMergeModal();
      this.cancelSelection();
      this.toast.show(`Đã khởi tạo mẻ tổng hợp "${masterId}" thành công!`, 'success');
      
      // Save state before navigating
      try {
        sessionStorage.setItem('lims_last_selected_request_id', masterId);
        this.saveState();
      } catch (e) {}
      
      // Navigate immediately to entry grid!
      this.router.navigate(['/results', masterId]);
    } catch (e: any) {
      console.error('Error creating virtual master run:', e);
      console.error('[ResultList] Không thể tạo mẻ gộp:', e);
      this.toast.show('Không thể lưu thay đổi. Vui lòng thử lại.', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async getResultDetailsByIds(ids: string[]): Promise<Map<string, any>> {
    const detailMap = new Map<string, any>();
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
    const detailsPath = `artifacts/${this.fb.APP_ID}/results_details`;
    const colRef = collection(this.fb.db, detailsPath);

    for (let index = 0; index < uniqueIds.length; index += 30) {
      const idChunk = uniqueIds.slice(index, index + 30);
      const snap = await getDocs(query(colRef, where(documentId(), 'in', idChunk)));
      this.readMonitor.record('getDocs', detailsPath, snap.size, {
        phase: 'batch',
      });
      snap.forEach(document => detailMap.set(document.id, document.data()));
    }

    return detailMap;
  }

  enterResults(requestId: string, prefix?: string, forceEdit = false) {
    try {
      sessionStorage.setItem('lims_last_selected_request_id', requestId);
      this.saveState();
    } catch (e) {}

    const queryParams: any = {};
    if (prefix !== undefined) {
      queryParams.prefix = prefix;
    }

    if (forceEdit) {
      this.router.navigate(['/results', requestId], { queryParams });
    } else {
      this.router.navigate(['/results-view', requestId], { queryParams });
    }
  }

  openUrl(url: string) {
    if (url) openInNewTab(url);
  }
}
