import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { Router, RouterModule } from '@angular/router';
import { formatSampleList, getSafeGoogleUrl } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import { ResultService } from './services/result.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ToastService } from '../../core/services/toast.service';
import { doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonComponent, DateRangeFilterComponent],
  template: `
    <div class="h-full flex flex-col fade-in relative bg-slate-50/30 dark:bg-slate-950/10">

      <!-- ══════════════════════════════════════════════════════
           HEADER: Title + Status Tabs
      ══════════════════════════════════════════════════════ -->
      <div class="shrink-0 px-6 pt-6 pb-0">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <!-- Page Title -->
          <div>
            <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
              <span class="w-8 h-8 rounded-xl bg-fuchsia-600 flex items-center justify-center shadow-md shadow-fuchsia-500/20 shrink-0">
                <i class="fa-solid fa-square-poll-vertical text-white text-sm"></i>
              </span>
              Tra cứu & Quản lý Kết quả Mẻ Chạy
            </h2>
            <p class="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 ml-10">
              Nhập kết quả, kiểm soát chất lượng (QC) và tạo phiếu kết quả tự động.
            </p>
          </div>

          <!-- Status Filter Tabs -->
          <div class="flex items-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1 rounded-2xl shadow-sm shrink-0 self-start lg:self-auto">
            <button (click)="filterStatus.set('all')"
                    class="px-4 py-2 text-xs font-black rounded-xl transition duration-150 active:scale-95 flex items-center gap-1.5"
                    [class]="filterStatus() === 'all'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-150 shadow-sm'
                      : 'text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'">
              Tất cả
              @if(filteredCount('all') > 0) {
                <span class="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-md text-[9px] font-black tabular-nums">{{filteredCount('all')}}</span>
              }
            </button>
            <button (click)="filterStatus.set('pending')"
                    class="px-4 py-2 text-xs font-black rounded-xl transition duration-150 active:scale-95 flex items-center gap-1.5"
                    [class]="filterStatus() === 'pending'
                      ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-100/60 dark:border-amber-900/20'
                      : 'text-slate-450 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400'">
              Chờ nhập
              @if(filteredCount('pending') > 0) {
                <span class="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md text-[9px] font-black tabular-nums">{{filteredCount('pending')}}</span>
              }
            </button>
            <button (click)="filterStatus.set('draft')"
                    class="px-4 py-2 text-xs font-black rounded-xl transition duration-150 active:scale-95 flex items-center gap-1.5"
                    [class]="filterStatus() === 'draft'
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100/60 dark:border-indigo-900/20'
                      : 'text-slate-450 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'">
              Đang nháp
              @if(filteredCount('draft') > 0) {
                <span class="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-md text-[9px] font-black tabular-nums">{{filteredCount('draft')}}</span>
              }
            </button>
            <button (click)="filterStatus.set('completed')"
                    class="px-4 py-2 text-xs font-black rounded-xl transition duration-150 active:scale-95 flex items-center gap-1.5"
                    [class]="filterStatus() === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100/60 dark:border-emerald-900/20'
                      : 'text-slate-450 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'">
              Hoàn thành
              @if(filteredCount('completed') > 0) {
                <span class="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[9px] font-black tabular-nums">{{filteredCount('completed')}}</span>
              }
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════════
             KPI STRIP: 3 số liệu gọn + SOP distribution
        ══════════════════════════════════════════════════════ -->
        <div class="flex flex-wrap items-stretch gap-3 mb-5">
          <!-- KPI: Tổng mẻ hoạt động -->
          <button (click)="filterStatus.set('all'); selectedSopId.set('all')"
               class="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 active:scale-[0.98] min-w-[130px]"
               [class.ring-2]="filterStatus() === 'all' && selectedSopId() === 'all'"
               [class.ring-blue-500]="filterStatus() === 'all' && selectedSopId() === 'all'"
               [class.border-blue-300]="filterStatus() === 'all' && selectedSopId() === 'all'">
            <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
              <i class="fa-solid fa-flask text-sm"></i>
            </div>
            <div class="text-left">
              <div class="text-xl font-black text-slate-800 dark:text-slate-100 leading-none tabular-nums">{{ allApprovedRuns().length }}</div>
              <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 whitespace-nowrap">Mẻ hoạt động</div>
            </div>
          </button>

          <!-- KPI: Chờ nhập -->
          <button (click)="filterStatus.set('pending')"
               class="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-200 active:scale-[0.98] min-w-[130px]"
               [class.ring-2]="filterStatus() === 'pending'"
               [class.ring-amber-500]="filterStatus() === 'pending'"
               [class.border-amber-300]="filterStatus() === 'pending'">
            <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-950/50 transition-colors">
              <i class="fa-solid fa-clock-rotate-left text-sm"></i>
            </div>
            <div class="text-left">
              <div class="text-xl font-black leading-none tabular-nums" [class.text-amber-500]="pendingCount() > 0" [class.text-slate-800]="pendingCount() === 0" [class.dark:text-slate-100]="pendingCount() === 0">{{ pendingCount() }}</div>
              <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 whitespace-nowrap">Chờ nhập</div>
            </div>
          </button>

          <!-- KPI: Hiệu suất -->
          <button (click)="filterStatus.set('completed')"
               class="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all duration-200 active:scale-[0.98] min-w-[160px]"
               [class.ring-2]="filterStatus() === 'completed'"
               [class.ring-emerald-500]="filterStatus() === 'completed'"
               [class.border-emerald-300]="filterStatus() === 'completed'">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/50 transition-colors">
              <i class="fa-solid fa-chart-line text-sm"></i>
            </div>
            <div class="text-left flex-1">
              <div class="flex items-baseline gap-1.5">
                <span class="text-xl font-black text-slate-800 dark:text-slate-100 leading-none tabular-nums">{{ averageCompletion() }}%</span>
                <span class="text-[9px] font-bold text-emerald-500">hoàn thành</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" [style.width.%]="averageCompletion()"></div>
              </div>
            </div>
          </button>

          <!-- SOP Distribution chips -->
          <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm min-w-[200px]">
            <div class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Phân bổ Phương Pháp SOP</div>
            <div class="flex items-center gap-1.5 flex-wrap">
              @for (item of sopDistribution(); track item.id) {
                <button class="text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all duration-150 hover:scale-105 active:scale-95 {{ item.textClass }} {{ item.bgClass }}"
                        (click)="selectedSopId.set(selectedSopId() === item.id ? 'all' : item.id)"
                        [class.ring-2]="selectedSopId() === item.id"
                        [class.ring-violet-500]="selectedSopId() === item.id">
                  {{ item.name }}: <span class="font-black">{{ item.count }}</span>
                </button>
              } @empty {
                <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Chưa có mẻ chạy</span>
              }
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════════
             FILTER & SEARCH BAR
        ══════════════════════════════════════════════════════ -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm mb-5 overflow-hidden">
          <!-- Row 1: Search + Actions -->
          <div class="flex items-center gap-2 p-3 border-b border-slate-100 dark:border-slate-800/80">
            <!-- Search -->
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <i class="fa-solid fa-magnifying-glass text-xs"></i>
              </span>
              <input type="text"
                     [value]="searchText()"
                     (input)="onSearchInput($event)"
                     placeholder="Tìm theo Mã mẻ, SOP, Mã số mẫu, Analyst..."
                     class="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/15 focus:border-fuchsia-400 dark:text-slate-200 font-semibold transition placeholder:text-slate-350 dark:placeholder:text-slate-600">
              @if (searchText()) {
                <button (click)="searchText.set('')" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
                  <i class="fa-solid fa-circle-xmark text-xs"></i>
                </button>
              }
            </div>

            <!-- Divider -->
            <div class="w-px h-6 bg-slate-200 dark:bg-slate-800 shrink-0"></div>

            <!-- View Mode Toggle -->
            <div class="flex bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl shrink-0">
              <button (click)="viewMode.set('grid')"
                      [class]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm font-extrabold' : 'text-slate-450 dark:text-slate-500 hover:text-slate-600'"
                      class="px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 duration-150">
                <i class="fa-solid fa-table-cells"></i> Lưới
              </button>
              <button (click)="viewMode.set('table')"
                      [class]="viewMode() === 'table' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm font-extrabold' : 'text-slate-450 dark:text-slate-500 hover:text-slate-600'"
                      class="px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 duration-150">
                <i class="fa-solid fa-list"></i> Bảng
              </button>
            </div>

            <!-- Merge Mode Toggle -->
            <button (click)="toggleMergeMode()"
                    [class]="isMergeModeActive() ? 'bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200/60 dark:border-fuchsia-800/40' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'"
                    class="px-3 py-2 border rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95 duration-150 shadow-sm shrink-0 bg-white dark:bg-slate-900">
              <i class="fa-solid fa-code-merge text-[10px]" [class.rotate-90]="isMergeModeActive()"></i>
              Gộp mẻ
              @if (isMergeModeActive() && selectedRunsCount() > 0) {
                <span class="w-4 h-4 bg-fuchsia-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">{{ selectedRunsCount() }}</span>
              }
            </button>

            <!-- Advanced Filters toggle -->
            <button (click)="showAdvancedFilters.set(!showAdvancedFilters())"
                    [class]="showAdvancedFilters() ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'"
                    class="px-3 py-2 border rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95 duration-150 relative shrink-0 bg-white dark:bg-slate-900">
              <i class="fa-solid fa-sliders text-[10px]"></i> Lọc nâng cao
              @if (activeFiltersCount() > 0) {
                <span class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm">{{ activeFiltersCount() }}</span>
              }
              <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-200" [class.rotate-180]="showAdvancedFilters()"></i>
            </button>

            @if (hasActiveFilters()) {
              <button (click)="resetAllFilters()"
                      class="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-black transition flex items-center gap-1 active:scale-95 shrink-0">
                <i class="fa-solid fa-rotate-left text-[10px]"></i> Xóa lọc
              </button>
            }
          </div>

          <!-- Row 2: Advanced Filter Panel (collapsible) -->
          @if (showAdvancedFilters()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/20 animate-fade-in">
              <!-- SOP Filter -->
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phương pháp (SOP)</label>
                <div class="relative">
                  <span class="absolute left-3 inset-y-0 flex items-center text-slate-400 pointer-events-none">
                    <i class="fa-solid fa-flask text-[10px]"></i>
                  </span>
                  <select [value]="selectedSopId()" (change)="onSopChange($event)"
                          class="w-full appearance-none pl-8 pr-7 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition cursor-pointer">
                    <option value="all">Tất cả phương pháp</option>
                    @for (sop of availableSops(); track sop.id) {
                      <option [value]="sop.id">{{ sop.name }}</option>
                    }
                  </select>
                  <i class="fa-solid fa-chevron-down text-[9px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"></i>
                </div>
              </div>

              <!-- Analyst Filter -->
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Analyst</label>
                <div class="relative">
                  <span class="absolute left-3 inset-y-0 flex items-center text-slate-400 pointer-events-none">
                    <i class="fa-solid fa-user text-[10px]"></i>
                  </span>
                  <select [value]="selectedAnalyst()" (change)="onAnalystChange($event)"
                          class="w-full appearance-none pl-8 pr-7 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition cursor-pointer">
                    <option value="all">Tất cả nhân viên</option>
                    @for (analyst of availableAnalysts(); track analyst) {
                      <option [value]="analyst">{{ analyst }}</option>
                    }
                  </select>
                  <i class="fa-solid fa-chevron-down text-[9px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"></i>
                </div>
              </div>

              <!-- Date Range -->
              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Khoảng thời gian (Ngày duyệt)</label>
                <app-date-range-filter
                    [initStart]="startDate()"
                    [initEnd]="endDate()"
                    containerClass="bg-transparent p-0 border-0 shadow-none w-full gap-3"
                    (dateChange)="onDateRangeChange($event)">
                </app-date-range-filter>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════
           MAIN CONTENT: Cards / Table
      ══════════════════════════════════════════════════════ -->
      <div class="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">

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

          <!-- ─── GRID VIEW ─── -->
          @if (viewMode() === 'grid') {
            <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              @for (run of displayedRuns(); track run.id) {
                <div class="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-150/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250 flex flex-col overflow-hidden relative cursor-pointer"
                     (click)="enterResults(run.id)"
                     [class.ring-2]="lastSelectedRequestId() === run.id"
                     [class.ring-fuchsia-500]="lastSelectedRequestId() === run.id"
                     [ngClass]="{'ring-1 ring-fuchsia-500/20': run.isVirtualMaster && lastSelectedRequestId() !== run.id}">

                  <!-- SOP Color Ribbon -->
                  <div class="h-1 bg-gradient-to-r {{ getSopGradientClass(run.sopId) }} shrink-0"></div>

                  <!-- Card Body -->
                  <div class="flex flex-col flex-1 p-5">
                    <!-- Top Row: Status + Date + Merge checkbox -->
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        @if (isMergeModeActive()) {
                          <label class="inline-flex items-center cursor-pointer" (click)="$event.stopPropagation()">
                            <input type="checkbox"
                                   [checked]="selectedRunsMap()[run.id]"
                                   (change)="toggleRunSelection(run)"
                                   class="w-4 h-4 text-fuchsia-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded focus:ring-fuchsia-500">
                          </label>
                        }
                        <span [class]="getStatusClass(run.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border">
                          <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                            'bg-emerald-500 animate-pulse': runStatusMap()[run.id] === 'completed',
                            'bg-indigo-500 animate-pulse': runStatusMap()[run.id] === 'draft',
                            'bg-amber-500 animate-pulse': runStatusMap()[run.id] === 'pending' || !runStatusMap()[run.id]
                          }"></span>
                          {{ getStatusText(run.id) }}
                        </span>
                        @if (run.isVirtualMaster) {
                          <span class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-100 dark:border-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black uppercase">Master ảo</span>
                        }
                        @if (run.parentMasterId) {
                          <a [routerLink]="['/results', run.parentMasterId]" (click)="$event.stopPropagation()" class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-200 dark:border-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black uppercase hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition-colors flex items-center gap-0.5" title="Mẻ này đã được gộp vào Master {{run.parentMasterId}}">
                            <i class="fa-solid fa-link text-[7px]"></i> Đã gộp
                          </a>
                        }
                      </div>
                      <span class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
                        <i class="fa-regular fa-calendar text-[9px]"></i>
                        {{ getRunDate(run) ? formatAnalysisDate(getRunDate(run)) : '—' }}
                      </span>
                    </div>

                    <!-- SOP Name -->
                    <h3 class="font-black text-slate-800 dark:text-slate-100 text-[15px] leading-snug mb-1 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                      {{ run.sopName }}
                    </h3>

                    @if (run.isVirtualMaster && run.childRequestIds) {
                      <div class="text-[9px] text-fuchsia-500 dark:text-fuchsia-400 font-bold mb-2 flex items-center gap-1 bg-fuchsia-50/40 dark:bg-fuchsia-950/10 px-2 py-1 rounded-lg border border-fuchsia-100/30 dark:border-fuchsia-900/20 select-none w-fit">
                        <i class="fa-solid fa-link text-[8px] animate-pulse"></i> Gộp từ: {{ run.childRequestIds.join(', ') }}
                      </div>
                    }

                    <!-- Analyst -->
                    <div class="flex items-center gap-2 mb-3">
                      <div [class]="getAnalystAvatarClass(run.user)" class="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-black uppercase shadow-sm shrink-0">
                        {{ getAnalystInitials(run.user) }}
                      </div>
                      <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{{ run.user || 'Unknown' }}</span>
                    </div>

                    <!-- Sample Codes -->
                    @if (run.sampleList && run.sampleList.length > 0) {
                      <div class="text-[10px] text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-xl p-2.5 flex items-start gap-1.5 max-h-16 overflow-y-auto custom-scrollbar mb-3 flex-1">
                        <i class="fa-solid fa-vials text-slate-350 dark:text-slate-600 mt-0.5 shrink-0 text-[9px]"></i>
                        <span class="break-all font-mono font-semibold leading-relaxed">{{ formatSampleList(run.sampleList) }}</span>
                      </div>
                    } @else {
                      <div class="flex-1"></div>
                    }
                  </div>

                  <!-- Card Footer: Action Buttons -->
                  <div class="border-t border-slate-100 dark:border-slate-800/80 px-4 py-3 flex items-center gap-2.5 bg-slate-50/30 dark:bg-slate-950/10 shrink-0">
                    @if (run.analysisResultSummary?.reports || run.analysisResultSummary?.pdfUrl || run.analysisResultSummary?.pdfViewUrl || run.analysisResult?.reports || run.analysisResult?.pdfUrl) {
                      <button (click)="openReportHub(run); $event.stopPropagation()"
                              class="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/40 rounded-xl text-xs font-black transition active:scale-95 shadow-sm">
                        <i class="fa-solid fa-file-pdf text-red-500 text-[11px]"></i>
                        <span>Báo cáo</span>
                      </button>
                    }
                    <button (click)="enterResults(run.id, undefined, false); $event.stopPropagation()"
                            class="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:border-fuchsia-200 dark:hover:border-fuchsia-900/40 rounded-xl text-xs font-black transition active:scale-95 duration-150 shadow-sm">
                      <i class="fa-solid text-[11px] fa-eye"></i>
                      Chi tiết Mẻ chạy
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div class="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                    <i class="fa-solid fa-square-poll-vertical text-2xl"></i>
                  </div>
                  <p class="text-slate-400 dark:text-slate-500 font-semibold text-sm">Không tìm thấy mẻ nào phù hợp.</p>
                  @if (hasActiveFilters()) {
                    <button (click)="resetAllFilters()" class="mt-3 text-xs text-fuchsia-600 dark:text-fuchsia-400 font-black hover:underline">Xóa bộ lọc</button>
                  }
                </div>
              }
            </div>

          <!-- ─── TABLE VIEW ─── -->
          } @else if (viewMode() === 'table') {
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                      @if (isMergeModeActive()) {
                        <th class="p-4 w-10 text-center"><i class="fa-solid fa-check-double"></i></th>
                      }
                      <th class="p-4">Phương pháp / Mã mẻ</th>
                      <th class="p-4">Phân tích viên</th>
                      <th class="p-4">Ngày chạy</th>
                      <th class="p-4">Mẫu kiểm nghiệm</th>
                      <th class="p-4 text-center">Trạng thái</th>
                      <th class="p-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                    @for (run of displayedRuns(); track run.id) {
                      <tr [ngClass]="{'bg-fuchsia-50/20 dark:bg-fuchsia-950/10 border-l-2 border-l-fuchsia-500': lastSelectedRequestId() === run.id}"
                          class="hover:bg-slate-50/60 dark:hover:bg-slate-950/20 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
                          (click)="enterResults(run.id)">

                        @if (isMergeModeActive()) {
                          <td class="p-4 text-center">
                            <label class="inline-flex items-center cursor-pointer" (click)="$event.stopPropagation()">
                              <input type="checkbox"
                                     [checked]="selectedRunsMap()[run.id]"
                                     (change)="toggleRunSelection(run)"
                                     class="w-4 h-4 text-fuchsia-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded focus:ring-fuchsia-500">
                            </label>
                          </td>
                        }

                        <td class="p-4">
                          <div class="flex items-center gap-2 mb-0.5">
                            <span class="w-2 h-2 rounded-full bg-gradient-to-r {{ getSopGradientClass(run.sopId) }} shrink-0"></span>
                            <span class="font-extrabold text-slate-800 dark:text-slate-150 text-xs">{{ run.sopName }}</span>
                            @if (run.isVirtualMaster) {
                              <span class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-100 dark:border-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black uppercase">Master ảo</span>
                            }
                          </div>
                          <div class="text-[10px] text-slate-400 font-mono font-semibold ml-4">{{ run.inputs?.['batchCode'] || run.id }}</div>
                          @if (run.isVirtualMaster && run.childRequestIds) {
                            <div class="text-[9px] text-fuchsia-500 font-bold flex items-center gap-0.5 ml-4 mt-0.5">
                              <i class="fa-solid fa-link text-[7px]"></i> Gộp từ: {{ run.childRequestIds.join(', ') }}
                            </div>
                          }
                        </td>

                        <td class="p-4">
                          <div class="flex items-center gap-2">
                            <div [class]="getAnalystAvatarClass(run.user)" class="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-black uppercase shadow-sm shrink-0">
                              {{ getAnalystInitials(run.user) }}
                            </div>
                            <span class="text-xs font-semibold truncate max-w-[100px]">{{ run.user || 'Unknown' }}</span>
                          </div>
                        </td>

                        <td class="p-4 text-[11px] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                          <i class="fa-regular fa-calendar mr-1 text-[9px]"></i>
                          {{ getRunDate(run) ? formatAnalysisDate(getRunDate(run)) : '—' }}
                        </td>

                        <td class="p-4 max-w-[180px]">
                          <div class="text-[10px] font-semibold text-slate-500">
                            <span class="font-extrabold text-slate-700 dark:text-slate-300">{{ run.sampleList?.length || 0 }}</span> mẫu
                          </div>
                          <div class="truncate text-[9px] font-mono text-slate-400 dark:text-slate-600" [title]="run.sampleList ? formatSampleList(run.sampleList) : ''">
                            {{ run.sampleList ? formatSampleList(run.sampleList) : 'Trống' }}
                          </div>
                        </td>

                        <td class="p-4 text-center">
                          <span [class]="getStatusClass(run.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide border">
                            <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                              'bg-emerald-500 animate-pulse': runStatusMap()[run.id] === 'completed',
                              'bg-indigo-500 animate-pulse': runStatusMap()[run.id] === 'draft',
                              'bg-amber-500 animate-pulse': runStatusMap()[run.id] === 'pending' || !runStatusMap()[run.id]
                            }"></span>
                            {{ getStatusText(run.id) }}
                          </span>
                        </td>

                        <td class="p-4">
                          <div class="flex items-center justify-end gap-2">
                            @if (run.analysisResultSummary?.reports || run.analysisResultSummary?.pdfUrl || run.analysisResultSummary?.pdfViewUrl || run.analysisResult?.reports || run.analysisResult?.pdfUrl) {
                              <button (click)="openReportHub(run); $event.stopPropagation()"
                                      class="flex items-center gap-1.5 px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 rounded-xl text-xs font-black transition active:scale-95">
                                <i class="fa-solid fa-file-pdf text-red-500 text-[11px]"></i>
                                <span>Báo cáo</span>
                              </button>
                            }
                            <button (click)="enterResults(run.id, undefined, false); $event.stopPropagation()"
                                    class="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:border-fuchsia-200 dark:hover:border-fuchsia-900/40 rounded-xl text-xs font-black transition active:scale-95 shadow-sm whitespace-nowrap">
                              <i class="fa-solid fa-eye text-[10px]"></i>
                              Chi tiết
                            </button>
                          </div>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td [attr.colspan]="isMergeModeActive() ? 7 : 6" class="text-center py-16 text-slate-400 dark:text-slate-500 font-semibold text-sm">
                          <i class="fa-solid fa-inbox text-2xl mb-2 block opacity-40"></i>
                          Không tìm thấy mẻ nào phù hợp.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        }

      </div><!-- end scrollable area -->

      <!-- ══════════════════════════════════════════════════════
           FLOATING MERGE ACTION BAR
      ══════════════════════════════════════════════════════ -->
      @if (selectedRunsCount() >= 2) {
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-slate-950/98 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-5 border border-slate-700/60 backdrop-blur-md animate-fade-in z-50">
          <div class="flex flex-col">
            <span class="text-xs font-black text-slate-100">Đã chọn <span class="text-fuchsia-400">{{ selectedRunsCount() }}</span> mẻ để gộp</span>
            <span class="text-[9px] font-bold text-slate-400 mt-0.5">{{ getSelectedSopName() }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button (click)="cancelSelection()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black transition active:scale-95">Hủy</button>
            <button (click)="openMergeModal()" class="px-4 py-1.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-xl text-xs font-black transition active:scale-95 shadow-md shadow-fuchsia-500/20 flex items-center gap-1.5">
              <i class="fa-solid fa-code-merge rotate-90 text-[10px]"></i> Gộp mẻ chạy
            </button>
          </div>
        </div>
      }

      <!-- ══════════════════════════════════════════════════════
           MERGE MODAL
      ══════════════════════════════════════════════════════ -->
      @if (showMergeModal()) {
        <div class="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span class="w-7 h-7 bg-fuchsia-100 dark:bg-fuchsia-950/40 rounded-lg flex items-center justify-center">
                    <i class="fa-solid fa-code-merge rotate-90 text-fuchsia-600 dark:text-fuchsia-400 text-xs"></i>
                  </span>
                  Cấu hình Gộp mẻ chạy
                </h3>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 ml-9">Hợp nhất mẫu từ nhiều mẻ chạy vào 1 phiếu duy nhất.</p>
              </div>
              <button (click)="closeMergeModal()" class="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center transition active:scale-90">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mẻ lấy đường chuẩn chính</label>
                <div class="space-y-2">
                  @for (run of getSelectedRuns(); track run.id) {
                    <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100/50 transition">
                      <input type="radio" name="masterCurve" [value]="run.id"
                             [checked]="masterCurveRunId() === run.id"
                             (change)="masterCurveRunId.set(run.id)"
                             class="text-fuchsia-600 focus:ring-fuchsia-500">
                      <div class="flex flex-col">
                        <span class="font-extrabold text-slate-700 dark:text-slate-250">{{ run.sopName }}</span>
                        <span class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ run.inputs?.['batchCode'] || run.id }} — {{ run.user }}</span>
                      </div>
                    </label>
                  }
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ngày phân tích hiển thị trên phiếu</label>
                <input type="text" [value]="unifiedDateString()" (input)="onUnifiedDateChange($event)"
                       placeholder="Ví dụ: 22/05/2026 - 23/05/2026"
                       class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 dark:text-slate-200 font-bold text-xs">
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mã mẻ gộp Master (Custom ID)</label>
                <input type="text" [value]="customMasterId()" (input)="onCustomMasterIdChange($event)"
                       class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 dark:text-slate-200 font-mono font-bold uppercase text-xs">
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button (click)="closeMergeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-black transition active:scale-95">Hủy</button>
              <button (click)="executeMerge()" class="px-5 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-xl text-xs font-black transition shadow-md shadow-fuchsia-500/10 active:scale-95 flex items-center gap-1.5">
                <i class="fa-solid fa-check text-[10px]"></i> Tạo mẻ gộp
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ══════════════════════════════════════════════════════
           REPORT HUB MODAL
      ══════════════════════════════════════════════════════ -->
      @if (showReportHubModal() && selectedRequestForReport()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div class="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100/50 dark:border-red-900/20 shrink-0">
                  <i class="fa-solid fa-file-pdf text-sm"></i>
                </div>
                <div>
                  <h3 class="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight">Trung Tâm Báo Cáo</h3>
                  <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{{ selectedRequestForReport().sopName }}</p>
                </div>
              </div>
              <button (click)="closeReportHub()" class="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center transition active:scale-90">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div class="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">

              <div class="space-y-2.5">
                <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <i class="fa-solid fa-print text-fuchsia-500"></i> Bản in đang hoạt động
                </h4>

                @if (unifiedAllSamplesReport()) {
                  <div class="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-150/40 dark:border-indigo-900/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span class="inline-block px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-[9px] font-black uppercase tracking-wide border border-indigo-200/30 mb-1.5">Tất cả mẫu</span>
                      <div class="text-[11px] font-bold text-slate-700 dark:text-slate-300">Phiên bản: <span class="text-fuchsia-600 dark:text-fuchsia-400">v{{ unifiedAllSamplesReport().version }}</span></div>
                      <div class="text-[10px] text-slate-400 mt-0.5">{{ unifiedAllSamplesReport().updatedAt | date:'HH:mm — dd/MM/yyyy' }}</div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <a [href]="getSafeGoogleUrl((unifiedAllSamplesReport().pdfViewUrl || unifiedAllSamplesReport().pdfUrl), 'pdf')" target="_blank" rel="noopener noreferrer"
                         class="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95 no-underline">
                        <i class="fa-solid fa-file-pdf text-[11px]"></i> XEM PDF
                      </a>
                      @if (unifiedAllSamplesReport().docsUrl) {
                        <a [href]="getSafeGoogleUrl(unifiedAllSamplesReport().docsUrl, 'doc')" target="_blank" rel="noopener noreferrer"
                           class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95 no-underline">
                          <i class="fa-solid fa-file-word text-[11px]"></i> MỞ DOCS
                        </a>
                      }
                    </div>
                  </div>
                }

                @if (shouldShowPrefixLoop()) {
                  @for (pref of getSelectedRunPrefixes(); track pref) {
                    <div class="bg-fuchsia-50/15 dark:bg-fuchsia-950/5 border border-fuchsia-150/40 dark:border-fuchsia-900/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span class="inline-block px-2 py-0.5 rounded bg-fuchsia-100 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-400 text-[9px] font-black uppercase tracking-wide border border-fuchsia-200/20 mb-1.5">
                          {{ pref === '' ? 'Không tiền tố' : 'Tiền tố ' + pref }}
                        </span>
                        @if (getPrefixReportForSelected(pref)) {
                          <div class="text-[11px] font-bold text-slate-700 dark:text-slate-300">Phiên bản: <span class="text-fuchsia-600 dark:text-fuchsia-400">v{{ getPrefixReportForSelected(pref).version || 1 }}</span></div>
                          <div class="text-[10px] text-slate-400 mt-0.5">{{ getPrefixReportForSelected(pref).pdfCreatedAt | date:'HH:mm — dd/MM/yyyy' }}</div>
                        } @else {
                          <div class="text-[11px] text-slate-400 font-semibold">Chưa có file in</div>
                        }
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        @if (getPrefixReportForSelected(pref) && (getPrefixReportForSelected(pref).pdfUrl || getPrefixReportForSelected(pref).pdfViewUrl)) {
                          <a [href]="getSafeGoogleUrl(getPrefixReportForSelected(pref).pdfViewUrl || getPrefixReportForSelected(pref).pdfUrl, 'pdf')" target="_blank" rel="noopener noreferrer"
                             class="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95 no-underline">
                            <i class="fa-solid fa-file-pdf text-[11px]"></i> XEM PDF
                          </a>
                          @if (getPrefixReportForSelected(pref).docsUrl) {
                            <a [href]="getSafeGoogleUrl(getPrefixReportForSelected(pref).docsUrl, 'doc')" target="_blank" rel="noopener noreferrer"
                               class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95 no-underline">
                              <i class="fa-solid fa-file-word text-[11px]"></i> MỞ DOCS
                            </a>
                          }
                        } @else {
                          <button (click)="enterResults(selectedRequestForReport().id, pref, true); closeReportHub()"
                                  class="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition active:scale-95">
                            <i class="fa-solid fa-arrows-rotate text-[10px]"></i> TẠO FILE IN
                          </button>
                        }
                      </div>
                    </div>
                  }
                }

                @if (!shouldShowPrefixLoop() && !unifiedAllSamplesReport()) {
                  @if (runStatusMap()[selectedRequestForReport().id] === 'completed') {
                    <div class="bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                      <div>
                        <div class="text-xs font-bold text-slate-700 dark:text-slate-300">Mẻ hoàn thành nhưng chưa có file in</div>
                        <div class="text-[10px] text-slate-400 mt-0.5">Bản in chưa được tạo hoặc bị lỗi khi xuất.</div>
                      </div>
                      <button (click)="enterResults(selectedRequestForReport().id, undefined, true); closeReportHub()"
                              class="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95 shrink-0">
                        <i class="fa-solid fa-file-invoice text-[11px]"></i> TẠO FILE IN
                      </button>
                    </div>
                  } @else {
                    <div class="text-center py-6 text-slate-400 dark:text-slate-500 font-semibold text-xs">
                      <i class="fa-solid fa-file-circle-xmark text-xl block mb-2 opacity-40"></i>
                      Mẻ chạy này chưa có báo cáo nào.
                    </div>
                  }
                }
              </div>

              <div class="space-y-2.5">
                <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <i class="fa-solid fa-clock-rotate-left text-slate-400"></i> Lịch sử phiên bản
                </h4>
                @if (isLoadingHistory()) {
                  <div class="flex items-center justify-center py-6 gap-2 text-slate-400">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span class="text-xs font-semibold">Đang tải lịch sử...</span>
                  </div>
                } @else {
                  @if (selectedRequestHistoryList().length > 0) {
                    <div class="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      @for (hist of selectedRequestHistoryList(); track hist.version + '_' + hist.prefix) {
                        <div class="flex items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/60 rounded-xl px-3 py-2.5 text-xs">
                          <div>
                            <div class="flex items-center gap-1.5">
                              <span class="font-extrabold text-slate-700 dark:text-slate-300">v{{ hist.version }}</span>
                              @if (hist.prefix) {
                                <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 text-[8px] font-bold uppercase">
                                  {{ hist.prefix === '_NO_PREFIX_' ? 'No prefix' : hist.prefix }}
                                </span>
                              }
                              @if (hist.status === 'archived') {
                                <span class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase">Lưu trữ</span>
                              }
                            </div>
                            <div class="text-[9px] text-slate-400 mt-0.5">{{ hist.publishedBy }} — {{ hist.publishedAt | date:'HH:mm dd/MM/yy' }}</div>
                          </div>
                          <div class="flex items-center gap-1.5 shrink-0">
                            <a [href]="getSafeGoogleUrl(hist.pdfViewUrl || hist.pdfUrl, 'pdf')" target="_blank" rel="noopener noreferrer"
                               class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-300 hover:text-red-600 flex items-center justify-center text-slate-500 transition active:scale-90" title="Xem PDF bản này">
                              <i class="fa-solid fa-file-pdf text-[10px]"></i>
                            </a>
                            @if (hist.docsUrl) {
                              <a [href]="getSafeGoogleUrl(hist.docsUrl, 'doc')" target="_blank" rel="noopener noreferrer"
                                 class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:text-blue-600 flex items-center justify-center text-slate-500 transition active:scale-90" title="Mở Docs bản này">
                                <i class="fa-solid fa-file-word text-[10px]"></i>
                              </a>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-4 text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                      Không có bản in cũ trong lịch sử.
                    </div>
                  }
                }
              </div>
            </div>

            <div class="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-slate-50/30 dark:bg-slate-950/10">
              <button (click)="enterResults(selectedRequestForReport().id, undefined, true); closeReportHub()"
                      class="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 rounded-xl transition active:scale-95">
                <i class="fa-solid fa-pen-to-square text-[11px]"></i> Mở để chỉnh sửa
              </button>
              <button (click)="closeReportHub()"
                      class="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-black transition active:scale-95">
                Đóng
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ResultListComponent implements OnInit, OnDestroy {
  private state = inject(StateService);
  private router = inject(Router);
  private resultService = inject(ResultService);
  private fb = inject(FirebaseService);
  private toast = inject(ToastService);

  formatSampleList = formatSampleList;
  getSafeGoogleUrl = getSafeGoogleUrl;

  isLoading = signal(true);
  filterStatus = signal<'all' | 'pending' | 'draft' | 'completed'>('all');

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

  getPrefixReportForSelected(prefix: string): any {
    const run = this.selectedRequestForReport();
    if (!run) return null;
    const reports = run.analysisResultSummary?.reports || run.analysisResult?.reports;
    if (!reports) return null;
    const prefixKey = prefix === '' ? '_NO_PREFIX_' : prefix;
    return reports[prefixKey] || null;
  }

  hasAnyPrefixReport(): boolean {
    const prefixes = this.getSelectedRunPrefixes();
    return prefixes.some(pref => this.getPrefixReportForSelected(pref) !== null);
  }

  // Helper for Report Hub: Get the unified 'All Samples' report object
  unifiedAllSamplesReport(): any {
    const run = this.selectedRequestForReport();
    if (!run) return null;
    
    // 1. Check if there is a root 'All Samples' report
    if (run.analysisResultSummary?.pdfUrl || run.analysisResultSummary?.pdfViewUrl || run.analysisResult?.pdfUrl || run.analysisResult?.pdfViewUrl) {
      return {
        version: run.analysisResultSummary?.version || run.analysisResult?.version || 1,
        updatedAt: run.analysisResultSummary?.updatedAt || run.analysisResult?.pdfCreatedAt,
        pdfUrl: run.analysisResultSummary?.pdfUrl || run.analysisResult?.pdfUrl,
        pdfViewUrl: run.analysisResultSummary?.pdfViewUrl || run.analysisResult?.pdfViewUrl,
        docsUrl: run.analysisResultSummary?.docsUrl || run.analysisResult?.docsUrl
      };
    }
    
    // 2. If no root report, check if this is a single prefix scenario (any single prefix)
    const prefixes = this.getSelectedRunPrefixes();
    if (prefixes.length === 1) {
      const singlePrefixReport = this.getPrefixReportForSelected(prefixes[0]);
      if (singlePrefixReport) {
        return {
          version: singlePrefixReport.version || 1,
          updatedAt: singlePrefixReport.pdfCreatedAt,
          pdfUrl: singlePrefixReport.pdfUrl,
          pdfViewUrl: singlePrefixReport.pdfViewUrl,
          docsUrl: singlePrefixReport.docsUrl
        };
      }
    }
    
    return null;
  }

  // Helper for Report Hub: Hide the prefix list if it's completely redundant (1 or 0 prefixes)
  shouldShowPrefixLoop(): boolean {
    const run = this.selectedRequestForReport();
    if (!run) return false;
    const prefixes = this.getSelectedRunPrefixes();
    if (prefixes.length <= 1) return false;
    return true;
  }

  averageCompletion = computed(() => {
    const runs = this.allApprovedRuns();
    if (runs.length === 0) return 0;
    const total = runs.reduce((sum: number, run: any) => sum + this.getRunProgress(run), 0);
    return Math.round(total / runs.length);
  });

  pendingCount = computed(() => {
    return this.filteredCount('pending');
  });

  sopDistribution = computed(() => {
    const runs = this.allApprovedRuns();
    const distribution: Record<string, { count: number; name: string }> = {};
    
    // Aesthetic dynamic color palette
    const colorPalette = [
      { bg: 'bg-violet-50/70 dark:bg-violet-950/20', text: 'text-violet-650 dark:text-violet-400 border-violet-200/40 dark:border-violet-900/30', bar: 'bg-violet-500' },
      { bg: 'bg-indigo-50/70 dark:bg-indigo-950/20', text: 'text-indigo-650 dark:text-indigo-400 border-indigo-200/40 dark:border-indigo-900/30', bar: 'bg-indigo-500' },
      { bg: 'bg-pink-50/70 dark:bg-pink-950/20', text: 'text-pink-650 dark:text-pink-400 border-pink-200/40 dark:border-pink-900/30', bar: 'bg-pink-500' },
      { bg: 'bg-cyan-50/70 dark:bg-cyan-950/20', text: 'text-cyan-650 dark:text-cyan-400 border-cyan-200/40 dark:border-cyan-900/30', bar: 'bg-cyan-500' },
      { bg: 'bg-amber-50/70 dark:bg-amber-950/20', text: 'text-amber-650 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30', bar: 'bg-amber-500' },
      { bg: 'bg-emerald-50/70 dark:bg-emerald-950/20', text: 'text-emerald-650 dark:text-emerald-450 border-emerald-200/40 dark:border-emerald-900/30', bar: 'bg-emerald-500' },
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
  private getInitialThisMonthRange() {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const toStr = (d: Date) => {
          const offset = d.getTimezoneOffset();
          const local = new Date(d.getTime() - (offset * 60 * 1000));
          return local.toISOString().split('T')[0];
      };
      
      return { start: toStr(start), end: toStr(today) };
  }
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
      return 'from-fuchsia-500 to-pink-500';
    }
    if (sopId === 'fipronil-chlorpyrifos') {
      return 'from-indigo-500 to-sky-500';
    }
    return 'from-violet-500 to-indigo-500';
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
      'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30',
      'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-450 dark:border-emerald-900/30',
      'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-450 dark:border-amber-900/30',
      'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-450 dark:border-rose-900/30',
      'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/30',
      'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 dark:border-fuchsia-900/30'
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
  currentScrollTop = 0;
  private scrollListenerRef?: any;

  saveState() {
    try {
      const scrollContainer = document.querySelector('main .overflow-y-auto');
      const scrollTop = (scrollContainer && scrollContainer.scrollTop > 0) ? scrollContainer.scrollTop : this.currentScrollTop;

      const stateToSave = {
        viewMode: this.viewMode(),
        filterStatus: this.filterStatus(),
        searchText: this.searchText(),
        selectedSopId: this.selectedSopId(),
        selectedAnalyst: this.selectedAnalyst(),
        showAdvancedFilters: this.showAdvancedFilters(),
        startDate: this.startDate(),
        endDate: this.endDate(),
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
        if (state.searchText !== undefined) this.searchText.set(state.searchText);
        if (state.selectedSopId) this.selectedSopId.set(state.selectedSopId);
        if (state.selectedAnalyst) this.selectedAnalyst.set(state.selectedAnalyst);
        if (state.showAdvancedFilters !== undefined) this.showAdvancedFilters.set(state.showAdvancedFilters);
        if (state.startDate) this.startDate.set(state.startDate);
        if (state.endDate) this.endDate.set(state.endDate);
        if (state.isMergeModeActive !== undefined) this.isMergeModeActive.set(state.isMergeModeActive);
        if (state.selectedRunsMap) this.selectedRunsMap.set(state.selectedRunsMap);
        if (state.scrollTop) this.currentScrollTop = state.scrollTop;
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
          const scrollContainer = document.querySelector('main .overflow-y-auto');
          if (scrollContainer) {
            scrollContainer.scrollTop = state.scrollTop;
            this.currentScrollTop = state.scrollTop;
          }
        }
      }
    } catch (e) {
      console.error('Error restoring scroll position:', e);
    }
  }

  ngOnInit() {
    this.restoreState();
    this.isLoading.set(false);
    
    // Bind scroll listener dynamically to track scrolling in real-time
    setTimeout(() => {
      const container = document.querySelector('main .overflow-y-auto');
      if (container) {
        this.scrollListenerRef = () => {
          this.currentScrollTop = container.scrollTop;
        };
        container.addEventListener('scroll', this.scrollListenerRef, { passive: true });
      }
      this.restoreScrollPosition();
    }, 100);
  }

  ngOnDestroy() {
    this.saveState();
    if (this.scrollListenerRef) {
      const container = document.querySelector('main .overflow-y-auto');
      if (container) {
        container.removeEventListener('scroll', this.scrollListenerRef);
      }
    }
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
        const runDate = this.getRunDate(run);
        if (!runDate) return false;
        if (start && runDate < start) return false;
        if (end && runDate > end) return false;
        return true;
      });
    }

    // 5. Filter by Status Tab
    const statusFilter = this.filterStatus();
    const statusMap = this.runStatusMap();
    if (statusFilter !== 'all') {
      list = list.filter((run: any) => (statusMap[run.id] || 'pending') === statusFilter);
    }

    return list;
  });

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
        const runDate = this.getRunDate(run);
        if (!runDate) return false;
        if (start && runDate < start) return false;
        if (end && runDate > end) return false;
        return true;
      });
    }

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
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'draft': 
        return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30';
      default: 
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
    }
  }

  getRunDate(run: any): string {
    if (run.analysisDate) return run.analysisDate;
    if (run.approvedAt?.toDate) {
      const d = run.approvedAt.toDate();
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - (offset * 60 * 1000));
      return local.toISOString().split('T')[0];
    }
    if (run.timestamp?.toDate) {
      const d = run.timestamp.toDate();
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
  onSearchInput(event: Event) {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  onSopChange(event: any) {
    this.selectedSopId.set(event.target.value);
  }

  onAnalystChange(event: any) {
    this.selectedAnalyst.set(event.target.value);
  }

  onDateRangeChange(range: { start: string, end: string, label: string }) {
    this.startDate.set(range.start);
    this.endDate.set(range.end);
  }

  toggleMergeMode() {
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
           this.endDate() !== '';
  }

  resetAllFilters() {
    this.searchText.set('');
    this.selectedSopId.set('all');
    this.selectedAnalyst.set('all');
    this.startDate.set('');
    this.endDate.set('');
  }

  // Option C selection and merging handlers
  toggleRunSelection(run: any) {
    const current = { ...this.selectedRunsMap() };
    const checked = !current[run.id];
    
    if (checked) {
      // Validate: Must be same SOP as existing selections (if any)
      const selected = this.getSelectedRuns();
      if (selected.length > 0 && selected[0].sopId !== run.sopId) {
        this.toast.show('Chỉ cho phép gộp các mẻ chạy có cùng Phương pháp (SOP)!', 'info');
        return;
      }
      current[run.id] = true;
    } else {
      delete current[run.id];
    }
    this.selectedRunsMap.set(current);
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
  }

  openMergeModal() {
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
  }

  onUnifiedDateChange(event: Event) {
    this.unifiedDateString.set((event.target as HTMLInputElement).value);
  }

  onCustomMasterIdChange(event: Event) {
    this.customMasterId.set((event.target as HTMLInputElement).value.toUpperCase());
  }

  async executeMerge() {
    const sops = this.getSelectedRuns();
    if (sops.length < 2) return;
    const masterId = this.customMasterId().trim().toUpperCase() || `GOP-${Date.now()}`;
    const masterCurveId = this.masterCurveRunId();
    const curveRun = sops.find(r => r.id === masterCurveId) || sops[0];
    
    // Combine sample lists uniquely
    const allSamples = new Set<string>();
    sops.forEach(r => {
      if (r.sampleList) {
        r.sampleList.forEach((s: string) => allSamples.add(s));
      }
    });
    const sampleList = Array.from(allSamples).sort();

    try {
      this.isLoading.set(true);

      // 1. Fetch details of all child runs to merge their data
      const detailPromises = sops.map(r => getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', r.id)));
      const detailSnaps = await Promise.all(detailPromises);
      const detailMap = new Map<string, any>();
      sops.forEach((r, i) => {
        if (detailSnaps[i].exists()) {
          detailMap.set(r.id, detailSnaps[i].data());
        }
      });

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

      // Copy sample rows from their respective source runs
      sops.forEach(r => {
        const sourceDetail = detailMap.get(r.id) || {};
        const sourceResultData = sourceDetail.resultData || {};
        if (r.sampleList) {
          r.sampleList.forEach((s: string) => {
            if (sourceResultData[s]) {
              resultData[s] = { ...sourceResultData[s] };
            } else {
              resultData[s] = {}; // Fallback empty row
            }
          });
        }
      });

      // 3. Prepare the Virtual Master payload (requests metadata)
      const masterPayload: any = {
        sopId: curveRun.sopId,
        sopName: curveRun.sopName,
        items: curveRun.items || [],
        isVirtualMaster: true,
        childRequestIds: sops.map(r => r.id),
        timestamp: new Date(),
        lastUpdated: new Date(),
        approvedAt: new Date(),
        user: this.state.getCurrentUserName(),
        inputs: {
          ...(curveRun.inputs || {}),
          batchCode: masterId,
          analysisDate: this.unifiedDateString()
        },
        sampleList,
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
      
      await batch.commit();
      
      // Close modal and deselect
      this.closeMergeModal();
      this.cancelSelection();
      this.toast.show(`Đã khởi tạo mẻ gộp Master "${masterId}" thành công!`, 'success');
      
      // Save state before navigating
      try {
        sessionStorage.setItem('lims_last_selected_request_id', masterId);
        this.saveState();
      } catch (e) {}
      
      // Navigate immediately to entry grid!
      this.router.navigate(['/results', masterId]);
    } catch (e: any) {
      console.error('Error creating virtual master run:', e);
      this.toast.show('Không thể tạo mẻ gộp: ' + e.message, 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  enterResults(requestId: string, prefix?: string, forceEdit = false) {
    try {
      sessionStorage.setItem('lims_last_selected_request_id', requestId);
      this.saveState();
    } catch (e) {}

    this.router.navigate(['/results-view', requestId]);
  }

  openUrl(url: string) {
    if (url) window.open(url, '_blank');
  }
}