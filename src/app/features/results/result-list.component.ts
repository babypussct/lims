import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { Router } from '@angular/router';
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
  imports: [CommonModule, SkeletonComponent, DateRangeFilterComponent],
  template: `
    <div class="h-full flex flex-col fade-in relative p-6 bg-slate-50/20 dark:bg-slate-950/5">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 mb-6">
        <div>
          <h2 class="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <i class="fa-solid fa-square-poll-vertical text-fuchsia-600 dark:text-fuchsia-500 text-xl shadow-sm shadow-fuchsia-500/10"></i> Nhập Kết Quả Phân Tích
          </h2>
          <p class="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
            Nhập kết quả, điền thông tin kiểm soát chất lượng (QC) và tạo phiếu kết quả tự động.
          </p>
        </div>

        <!-- Filter Tab -->
        <div class="flex bg-white dark:bg-slate-900/60 backdrop-blur-md p-1.5 rounded-2xl self-start border border-slate-150/80 dark:border-slate-800/80 shadow-xs">
          <button (click)="filterStatus.set('all')" 
                  class="px-4 py-2 text-xs font-black rounded-xl transition duration-200 active:scale-95" 
                  [class]="filterStatus() === 'all' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-150 shadow-2xs' : 'text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'">
            Tất cả @if(filteredCount('all') > 0) { <span class="ml-1 bg-slate-200 dark:bg-slate-950 text-slate-700 dark:text-slate-400 px-1.5 py-0.5 rounded-lg text-[9px] font-black">{{filteredCount('all')}}</span> }
          </button>
          <button (click)="filterStatus.set('pending')" 
                  class="px-4 py-2 text-xs font-black rounded-xl transition duration-200 active:scale-95" 
                  [class]="filterStatus() === 'pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 shadow-2xs border border-amber-100/50 dark:border-amber-900/10' : 'text-slate-450 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400'">
            Chờ nhập @if(filteredCount('pending') > 0) { <span class="ml-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-lg text-[9px] font-black">{{filteredCount('pending')}}</span> }
          </button>
          <button (click)="filterStatus.set('draft')" 
                  class="px-4 py-2 text-xs font-black rounded-xl transition duration-200 active:scale-95" 
                  [class]="filterStatus() === 'draft' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-405 shadow-2xs border border-indigo-100/50 dark:border-indigo-900/10' : 'text-slate-450 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'">
            Đang nháp @if(filteredCount('draft') > 0) { <span class="ml-1 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-lg text-[9px] font-black">{{filteredCount('draft')}}</span> }
          </button>
          <button (click)="filterStatus.set('completed')" 
                  class="px-4 py-2 text-xs font-black rounded-xl transition duration-200 active:scale-95" 
                  [class]="filterStatus() === 'completed' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 shadow-2xs border border-emerald-100/50 dark:border-emerald-900/10' : 'text-slate-450 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'">
            Đã hoàn thành @if(filteredCount('completed') > 0) { <span class="ml-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-lg text-[9px] font-black">{{filteredCount('completed')}}</span> }
          </button>
        </div>
      </div>

      <!-- Premium Glassmorphic Stats Header -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        <!-- KPI 1: Active Runs (Blue Theme, filter-aware) -->
        <div (click)="filterStatus.set('all'); selectedSopId.set('all')"
             class="cursor-pointer backdrop-blur-md p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between relative group hover:scale-[1.02] active:scale-[0.98]"
             [class]="(filterStatus() === 'all' && selectedSopId() === 'all')
               ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/60 dark:border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
               : 'bg-white/80 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-800/50 hover:shadow-xs'">
          <div class="space-y-1.5">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Mẻ Phân Tích Hoạt Động</span>
            <span class="text-3xl font-black text-slate-850 dark:text-slate-100 block tracking-tight">{{ allApprovedRuns().length }}</span>
            <span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-450 flex items-center gap-1.5 mt-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Real-time Sync
            </span>
          </div>
          <div class="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 shrink-0"
               [class]="(filterStatus() === 'all' && selectedSopId() === 'all')
                 ? 'bg-blue-500/20 text-blue-600 dark:text-blue-450'
                 : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-500'">
            <i class="fa-solid fa-flask text-lg"></i>
          </div>
        </div>

        <!-- KPI 2: Completion Rate (Emerald Theme, filter-aware) -->
        <div (click)="filterStatus.set('completed')"
             class="cursor-pointer backdrop-blur-md p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between relative group hover:scale-[1.02] active:scale-[0.98]"
             [class]="filterStatus() === 'completed'
               ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/60 dark:border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
               : 'bg-white/80 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-800/50 hover:shadow-xs'">
          <div class="space-y-1.5 flex-1">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Hiệu Suất Nhập Liệu</span>
            <span class="text-3xl font-black text-slate-850 dark:text-slate-100 block tracking-tight">{{ averageCompletion() }}%</span>
            <div class="w-full bg-slate-100 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-3 max-w-[140px]">
              <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" [style.width.%]="averageCompletion()"></div>
            </div>
          </div>
          <div class="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ml-4 shrink-0"
               [class]="filterStatus() === 'completed'
                 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-450'
                 : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-500'">
            <i class="fa-solid fa-chart-line text-lg"></i>
          </div>
        </div>

        <!-- KPI 3: Pending Entry (Amber Theme, filter-aware) -->
        <div (click)="filterStatus.set('pending')"
             class="cursor-pointer backdrop-blur-md p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between relative group hover:scale-[1.02] active:scale-[0.98]"
             [class]="filterStatus() === 'pending'
               ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/60 dark:border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
               : 'bg-white/80 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-800/50 hover:shadow-xs'">
          <div class="space-y-1.5">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Mẻ Đang Chờ Nhập</span>
            <span class="text-3xl font-black text-slate-850 dark:text-slate-100 block tracking-tight"
                  [class.text-amber-500]="pendingCount() > 0">{{ pendingCount() }}</span>
            <span class="text-[9px] font-bold text-amber-600 dark:text-amber-450 flex items-center gap-1.5 mt-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Yêu cầu nhập gấp
            </span>
          </div>
          <div class="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 shrink-0"
               [class]="filterStatus() === 'pending'
                 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-450'
                 : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 group-hover:bg-amber-500/10 group-hover:text-amber-500'">
            <i class="fa-solid fa-clock-rotate-left text-lg"></i>
          </div>
        </div>

        <!-- KPI 4: SOP Ratio (Violet/Indigo Theme, cyclic filter-aware) -->
        <div (click)="selectedSopId.set(selectedSopId() === 'trifluralin-gcms' ? 'fipronil-chlorpyrifos' : selectedSopId() === 'fipronil-chlorpyrifos' ? 'all' : 'trifluralin-gcms')"
             class="cursor-pointer backdrop-blur-md p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between relative group hover:scale-[1.02] active:scale-[0.98]"
             [class]="selectedSopId() === 'trifluralin-gcms'
               ? 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/60 dark:border-violet-500/50 shadow-md ring-1 ring-violet-500/30'
               : selectedSopId() === 'fipronil-chlorpyrifos'
                 ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/60 dark:border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                 : 'bg-white/80 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80 hover:border-violet-400 dark:hover:border-violet-800/50 hover:shadow-xs'">
          <div class="space-y-1.5 flex-1">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Phân Bổ Phương Pháp SOP</span>
            <div class="flex items-center gap-1.5 mt-2 flex-wrap">
              <span class="text-[10px] font-bold text-violet-650 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded-lg">Trifluralin: {{ sopDistribution().trifluralin }}</span>
              <span class="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-lg">Fipronil: {{ sopDistribution().fipronil }}</span>
              <span class="text-[10px] font-bold text-slate-550 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">Khác: {{ sopDistribution().others }}</span>
            </div>
            <div class="w-full flex h-1.5 rounded-full overflow-hidden mt-3 bg-slate-100 dark:bg-slate-800/80 max-w-[200px]">
              <div class="bg-violet-500 h-full transition-all duration-300" [style.width.%]="allApprovedRuns().length ? (sopDistribution().trifluralin / allApprovedRuns().length) * 100 : 0"></div>
              <div class="bg-indigo-500 h-full transition-all duration-300" [style.width.%]="allApprovedRuns().length ? (sopDistribution().fipronil / allApprovedRuns().length) * 100 : 0"></div>
              <div class="bg-slate-350 dark:bg-slate-600 h-full transition-all duration-300" [style.width.%]="allApprovedRuns().length ? (sopDistribution().others / allApprovedRuns().length) * 100 : 0"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Advanced Filter Panel & Search -->
      <div class="mb-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-150/80 dark:border-slate-800/80 shadow-xs space-y-4 shrink-0 transition-all duration-300">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Text Search Box -->
          <div class="relative flex-1">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <i class="fa-solid fa-magnifying-glass text-xs"></i>
            </span>
            <input type="text" 
                   [value]="searchText()"
                   (input)="onSearchInput($event)"
                   placeholder="Tìm theo Mã mẻ chạy, SOP, Mã số mẫu, Analyst..." 
                   class="w-full pl-9 pr-8 py-2 text-xs bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 dark:text-slate-200 font-bold transition font-sans">
            @if (searchText()) {
              <button (click)="searchText.set('')" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <i class="fa-solid fa-circle-xmark text-xs"></i>
              </button>
            }
          </div>

          <!-- Advanced Toggle, View Switcher & Clear Buttons -->
          <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <!-- View Mode Switcher (iOS Segmented Style) -->
            <div class="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 rounded-xl mr-2 shrink-0">
              <button (click)="viewMode.set('grid')"
                      [class]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-150 shadow-2xs font-extrabold' : 'text-slate-450 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-355'"
                      class="px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 duration-150">
                <i class="fa-solid fa-table-cells text-[10px]"></i>
                <span>Lưới</span>
              </button>
              <button (click)="viewMode.set('table')"
                      [class]="viewMode() === 'table' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-150 shadow-2xs font-extrabold' : 'text-slate-450 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-355'"
                      class="px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 duration-150">
                <i class="fa-solid fa-list text-[10px]"></i>
                <span>Bảng</span>
              </button>
            </div>

            <!-- Dynamic Merge Mode Toggle -->
            <button (click)="toggleMergeMode()"
                    [class]="isMergeModeActive() ? 'bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200/50 dark:border-fuchsia-850' : 'bg-white dark:bg-slate-800 text-slate-655 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
                    class="px-3.5 py-2 border rounded-xl text-xs font-black transition flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:scale-95 duration-150 shadow-xs shrink-0 mr-2">
              <i class="fa-solid fa-code-merge text-[10px]" [class.rotate-90]="isMergeModeActive()"></i>
              <span>Gộp mẻ chạy</span>
              @if (isMergeModeActive() && selectedRunsCount() > 0) {
                <span class="w-4.5 h-4.5 bg-fuchsia-600 dark:bg-fuchsia-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs ml-1">
                  {{ selectedRunsCount() }}
                </span>
              }
            </button>

            <!-- Advanced Filter Button -->
            <button (click)="showAdvancedFilters.set(!showAdvancedFilters())" 
                    [class]="showAdvancedFilters() ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 border-blue-200/50 dark:border-blue-800' : 'bg-white dark:bg-slate-800 text-slate-655 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
                    class="px-4 py-2 border rounded-xl text-xs font-black transition flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 relative active:scale-95 duration-150 shadow-xs shrink-0">
              <i class="fa-solid fa-sliders text-[10px]"></i>
              <span>Lọc nâng cao</span>
              @if (activeFiltersCount() > 0) {
                <span class="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-blue-600 dark:bg-blue-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs shadow-blue-500/30">
                  {{ activeFiltersCount() }}
                </span>
              }
              <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-300" [class.rotate-180]="showAdvancedFilters()"></i>
            </button>
            
            @if (hasActiveFilters()) {
              <button (click)="resetAllFilters()" 
                      class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95 duration-150 shadow-xs shrink-0">
                <i class="fa-solid fa-rotate-left text-[10px]"></i>
                <span>Xóa lọc</span>
              </button>
            }
          </div>
        </div> <!-- Fixed: Properly close the flex-row layout container -->

        <!-- Collapsible Content -->
        @if (showAdvancedFilters()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs animate-fade-in">
            <!-- SOP selection -->
            <div class="flex flex-col gap-1.5">
              <label class="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Phương pháp (SOP)</label>
              <div class="relative flex items-center">
                <select [value]="selectedSopId()" 
                        (change)="onSopChange($event)"
                        class="w-full appearance-none pr-8 pl-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition duration-150">
                  <option value="all">Tất cả phương pháp</option>
                  @for (sop of availableSops(); track sop.id) {
                    <option [value]="sop.id">{{ sop.name }}</option>
                  }
                </select>
                <i class="fa-solid fa-chevron-down text-[9px] opacity-50 absolute right-3 pointer-events-none"></i>
              </div>
            </div>

            <!-- Analyst selection -->
            <div class="flex flex-col gap-1.5">
              <label class="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Người thực hiện (Analyst)</label>
              <div class="relative flex items-center">
                <select [value]="selectedAnalyst()" 
                        (change)="onAnalystChange($event)"
                        class="w-full appearance-none pr-8 pl-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition duration-150">
                  <option value="all">Tất cả nhân viên</option>
                  @for (analyst of availableAnalysts(); track analyst) {
                    <option [value]="analyst">{{ analyst }}</option>
                  }
                </select>
                <i class="fa-solid fa-chevron-down text-[9px] opacity-50 absolute right-3 pointer-events-none"></i>
              </div>
            </div>

            <!-- Date Range Filter -->
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Khoảng thời gian (Ngày duyệt)</label>
              <app-date-range-filter 
                  [initStart]="startDate()" 
                  [initEnd]="endDate()" 
                  (dateChange)="onDateRangeChange($event)">
              </app-date-range-filter>
            </div>
          </div>
        }
      </div>

      @if (isLoading()) {
          <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3">
                <app-skeleton width="80px" height="14px"></app-skeleton>
                <app-skeleton width="200px" height="20px"></app-skeleton>
                <app-skeleton width="140px" height="14px"></app-skeleton>
                <app-skeleton width="100%" height="32px"></app-skeleton>
              </div>
            }
          </div>
        } @else {
          @if (viewMode() === 'grid') {
            <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (run of displayedRuns(); track run.id) {
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xs border border-slate-150/80 dark:border-slate-800/80 p-5 hover:shadow-xl hover:border-slate-200/40 dark:hover:border-slate-700/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative z-10 hover:z-30 group"
                     [class.ring-2]="lastSelectedRequestId() === run.id"
                     [class.ring-fuchsia-500]="lastSelectedRequestId() === run.id"
                     [class.animate-pulse]="lastSelectedRequestId() === run.id"
                     [class.border-fuchsia-500]="lastSelectedRequestId() === run.id"
                     [class.shadow-md]="lastSelectedRequestId() === run.id"
                     [ngClass]="{'ring-1 ring-fuchsia-500/30 dark:ring-fuchsia-500/20': run.isVirtualMaster && lastSelectedRequestId() !== run.id}">
                  <!-- Ribbon gradient nhận diện phương pháp (SOP) -->
                  <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r {{ getSopGradientClass(run.sopId) }} rounded-t-2xl"></div>

                  <!-- Top Header Card -->
                  <div>
                    <div class="flex items-center justify-between mb-3.5">
                      <div class="flex items-center gap-2.5">
                        <!-- Checkbox gộp mẻ chạy -->
                        @if (isMergeModeActive()) {
                          <label class="inline-flex items-center cursor-pointer select-none" (click)="$event.stopPropagation()">
                            <input type="checkbox"
                                   [checked]="selectedRunsMap()[run.id]"
                                   (change)="toggleRunSelection(run)"
                                   class="w-4.5 h-4.5 text-fuchsia-600 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded focus:ring-fuchsia-500 focus:ring-2">
                          </label>
                        }
                        <span [class]="getStatusClass(run.id)" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5">
                          <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                            'bg-emerald-500 animate-pulse': runStatusMap()[run.id] === 'completed',
                            'bg-indigo-500 animate-pulse': runStatusMap()[run.id] === 'draft',
                            'bg-amber-500 animate-pulse': runStatusMap()[run.id] === 'pending' || !runStatusMap()[run.id]
                          }"></span>
                          {{ getStatusText(run.id) }}
                        </span>
                        @if (run.isVirtualMaster) {
                          <span class="px-2 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-100 dark:border-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black uppercase tracking-widest animate-pulse">Master ảo</span>
                        }
                      </div>
                      <span class="text-xs text-slate-400 dark:text-slate-500 font-bold">
                        <i class="fa-regular fa-calendar mr-1"></i>
                        {{ getRunDate(run) ? formatAnalysisDate(getRunDate(run)) : 'Không có ngày' }}
                      </span>
                    </div>

                    <!-- SOP Title -->
                    <h3 class="font-extrabold text-slate-800 dark:text-slate-150 text-base mb-1.5 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                      {{ run.sopName }}
                    </h3>

                    @if (run.isVirtualMaster && run.childRequestIds) {
                      <div class="text-[10px] text-fuchsia-500 dark:text-fuchsia-400 font-bold mb-3 flex items-center gap-1 bg-fuchsia-50/40 dark:bg-fuchsia-950/10 px-2 py-1 rounded-lg border border-fuchsia-100/30 dark:border-fuchsia-900/20 select-none">
                        <i class="fa-solid fa-link text-[8px] animate-pulse"></i> Gộp từ: {{ run.childRequestIds.join(', ') }}
                      </div>
                    }
                    
                    <!-- Analyst block (Pastel custom avatar) -->
                    <div class="text-xs text-slate-500 dark:text-slate-450 mb-4 flex items-center gap-2">
                      <div [class]="getAnalystAvatarClass(run.user)" class="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-black uppercase shadow-3xs select-none">
                        {{ getAnalystInitials(run.user) }}
                      </div>
                      <span class="font-bold text-slate-655 dark:text-slate-300">{{ run.user || 'Unknown' }}</span>
                    </div>

                    <!-- Sample Codes -->
                    @if (run.sampleList && run.sampleList.length > 0) {
                      <div class="mb-4 text-xs text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-start gap-2 max-h-20 overflow-y-auto custom-scrollbar">
                        <i class="fa-solid fa-vials text-slate-400 dark:text-slate-500 mt-0.5 shrink-0"></i>
                        <span class="break-all font-mono font-bold leading-relaxed">{{ formatSampleList(run.sampleList) }}</span>
                      </div>
                    }
                  </div>
                  <!-- Action Buttons -->
                  <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2.5 relative">
                    <!-- Dropdown in ấn báo cáo dạng Popover -->
                    <div class="relative">
                      @if (run.analysisResultSummary?.reports || run.analysisResultSummary?.pdfUrl || run.analysisResultSummary?.pdfViewUrl || run.analysisResult?.reports || run.analysisResult?.pdfUrl) {
                        <button (click)="openReportHub(run); $event.stopPropagation()"
                                class="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95 shadow-3xs">
                          <i class="fa-solid fa-file-pdf text-red-500"></i> Báo cáo
                        </button>
                      }
                    </div>

                    <!-- Enter/Edit Action Button -->
                    <button (click)="enterResults(run.id)"
                            [class]="runStatusMap()[run.id] === 'completed' 
                              ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:border-fuchsia-200 dark:hover:border-fuchsia-800/30 shadow-3xs'
                              : 'bg-fuchsia-600 dark:bg-fuchsia-500 text-white hover:bg-fuchsia-700 dark:hover:bg-fuchsia-600 shadow-xs active:scale-95 duration-155'"
                            class="px-4 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-3xs active:scale-95">
                      <i class="fa-solid" [class.fa-pen-to-square]="runStatusMap()[run.id] !== 'completed'" [class.fa-arrows-rotate]="runStatusMap()[run.id] === 'completed'"></i>
                      {{ runStatusMap()[run.id] === 'completed' ? 'Sửa/In lại' : 'Nhập kết quả' }}
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="col-span-full text-center py-20 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                    <i class="fa-solid fa-square-poll-vertical text-3xl"></i>
                  </div>
                  <p class="text-slate-500 dark:text-slate-400 font-bold text-sm">
                    Không tìm thấy mẻ nào phù hợp với bộ lọc hiện tại.
                  </p>
                </div>
              }
            </div>
          } @else if (viewMode() === 'table') {
            <!-- Compact Table List View -->
            <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-150/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                      @if (isMergeModeActive()) {
                        <th class="p-4 w-12 text-center">Chọn</th>
                      }
                      <th class="p-4">Phương pháp / Mã mẻ</th>
                      <th class="p-4">Phân tích viên</th>
                      <th class="p-4">Ngày chạy</th>
                      <th class="p-4">Mẫu kiểm nghiệm</th>
                      <th class="p-4 text-center">Trạng thái</th>
                      <th class="p-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
                    @for (run of displayedRuns(); track run.id) {
                      <tr [ngClass]="{
                            'bg-fuchsia-50/20 dark:bg-fuchsia-950/10 border-l-4 border-l-fuchsia-500': lastSelectedRequestId() === run.id
                          }"
                          class="hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors font-bold text-slate-655 dark:text-slate-300">
                        <!-- Checkbox -->
                        @if (isMergeModeActive()) {
                          <td class="p-4 text-center">
                            <label class="inline-flex items-center cursor-pointer select-none" (click)="$event.stopPropagation()">
                              <input type="checkbox"
                                     [checked]="selectedRunsMap()[run.id]"
                                     (change)="toggleRunSelection(run)"
                                     class="w-4.5 h-4.5 text-fuchsia-600 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded focus:ring-fuchsia-500 focus:ring-2">
                            </label>
                          </td>
                        }

                        <!-- Method / Batch Code -->
                        <td class="p-4 space-y-0.5">
                          <div class="flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-r {{ getSopGradientClass(run.sopId) }}"></span>
                            <span class="font-extrabold text-slate-800 dark:text-slate-150 text-xs sm:text-sm">{{ run.sopName }}</span>
                            @if (run.isVirtualMaster) {
                              <span class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-100 dark:border-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black uppercase">Master ảo</span>
                            }
                          </div>
                          <div class="text-[10px] text-slate-400 font-mono tracking-tight font-bold">Mã mẻ: {{ run.inputs?.['batchCode'] || run.id }}</div>
                          @if (run.isVirtualMaster && run.childRequestIds) {
                            <div class="text-[9px] text-fuchsia-500 dark:text-fuchsia-400 font-bold flex items-center gap-0.5 mt-0.5">
                              <i class="fa-solid fa-link text-[7px]"></i> Gộp từ: {{ run.childRequestIds.join(', ') }}
                            </div>
                          }
                        </td>

                        <!-- Analyst -->
                        <td class="p-4">
                          <div class="flex items-center gap-2">
                            <div [class]="getAnalystAvatarClass(run.user)" class="w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-black uppercase shadow-3xs">
                              {{ getAnalystInitials(run.user) }}
                            </div>
                            <span class="text-xs">{{ run.user || 'Unknown' }}</span>
                          </div>
                        </td>

                        <!-- Date -->
                        <td class="p-4 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                          {{ getRunDate(run) ? formatAnalysisDate(getRunDate(run)) : 'Không có ngày' }}
                        </td>

                        <!-- Sample list -->
                        <td class="p-4 max-w-[200px]">
                          <div class="truncate text-[11px] font-mono text-slate-500 dark:text-slate-450" title="{{ run.sampleList ? formatSampleList(run.sampleList) : '' }}">
                            {{ run.sampleList?.length || 0 }} mẫu ({{ run.sampleList ? formatSampleList(run.sampleList) : 'Trống' }})
                          </div>
                        </td>

                        <!-- Status -->
                        <td class="p-4 text-center">
                          <span [class]="getStatusClass(run.id)" class="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border inline-flex items-center gap-1 justify-center">
                            <span class="w-1.2 h-1.2 rounded-full" [ngClass]="{
                              'bg-emerald-500 animate-pulse': runStatusMap()[run.id] === 'completed',
                              'bg-indigo-500 animate-pulse': runStatusMap()[run.id] === 'draft',
                              'bg-amber-500 animate-pulse': runStatusMap()[run.id] === 'pending' || !runStatusMap()[run.id]
                            }"></span>
                            {{ getStatusText(run.id) }}
                          </span>
                        </td>

                        <!-- Actions -->
                        <td class="p-4 text-right">
                          <div class="flex items-center justify-end gap-2 relative">
                            <!-- Popover report dropdown -->
                            <div class="relative">
                              @if (run.analysisResultSummary?.reports || run.analysisResultSummary?.pdfUrl || run.analysisResultSummary?.pdfViewUrl || run.analysisResult?.reports || run.analysisResult?.pdfUrl) {
                                <button (click)="openReportHub(run); $event.stopPropagation()"
                                        class="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition flex items-center justify-center border border-slate-200 dark:border-slate-755 shadow-3xs"
                                        title="Quản lý và xem các báo cáo">
                                  <i class="fa-solid fa-file-pdf text-red-500 text-xs"></i>
                                </button>
                              }
                            </div>

                            <button (click)="enterResults(run.id)"
                                    class="px-3 py-1.5 bg-fuchsia-600 dark:bg-fuchsia-500 text-white hover:bg-fuchsia-700 rounded-xl text-[11px] font-black transition active:scale-95 duration-100 flex items-center gap-1 shadow-3xs">
                              <i class="fa-solid fa-arrow-right"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td [attr.colspan]="isMergeModeActive() ? 7 : 6" class="text-center py-16 text-slate-450 dark:text-slate-500 font-bold">
                          Không tìm thấy mẻ nào phù hợp với bộ lọc hiện tại.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        }

      <!-- Floating Merge Action Bar -->
      @if (selectedRunsCount() >= 2) {
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 dark:bg-slate-950/95 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700/50 backdrop-blur-md animate-fade-in z-50">
          <div class="flex flex-col">
            <span class="text-xs font-black text-slate-100">Đã chọn {{ selectedRunsCount() }} mẻ chạy để gộp kết quả</span>
            <span class="text-[9px] font-bold text-slate-400 mt-0.5">Phương pháp: {{ getSelectedSopName() }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button (click)="cancelSelection()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition">
              Hủy
            </button>
            <button (click)="openMergeModal()" class="px-4 py-1.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-xl text-xs font-black transition active:scale-95 shadow-md shadow-fuchsia-500/20">
              Gộp mẻ chạy
            </button>
          </div>
        </div>
      }

      <!-- Glassmorphic Merge Modal -->
      @if (showMergeModal()) {
        <div class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-100 dark:border-slate-800/80 shadow-2xl p-6 space-y-5">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-black text-slate-800 dark:text-slate-100">Cấu hình Gộp mẻ chạy</h3>
                <p class="text-xs text-slate-500 dark:text-slate-450 mt-1">Hợp nhất mẫu từ nhiều mẻ chạy khác ngày vào 1 phiếu duy nhất.</p>
              </div>
              <button (click)="closeMergeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <i class="fa-solid fa-circle-xmark text-lg"></i>
              </button>
            </div>

            <!-- Configuration Form -->
            <div class="space-y-4 text-xs">
              <!-- Choosing Master Curve -->
              <div class="flex flex-col gap-1.5">
                <label class="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Mẻ lấy đường chuẩn chính</label>
                <div class="space-y-2">
                  @for (run of getSelectedRuns(); track run.id) {
                    <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/20 transition">
                      <input type="radio" 
                             name="masterCurve" 
                             [value]="run.id"
                             [checked]="masterCurveRunId() === run.id"
                             (change)="masterCurveRunId.set(run.id)"
                             class="text-fuchsia-600 focus:ring-fuchsia-500">
                      <div class="flex flex-col">
                        <span class="font-extrabold text-slate-700 dark:text-slate-250">{{ run.sopName }} (v{{ run.analysisResult?.version || 1 }})</span>
                        <span class="text-[10px] text-slate-400 font-bold mt-0.5">Mã mẻ: {{ run.inputs?.['batchCode'] || run.id }} - Người nhập: {{ run.user }}</span>
                      </div>
                    </label>
                  }
                </div>
              </div>

              <!-- Unified Date Range -->
              <div class="flex flex-col gap-1.5">
                <label class="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Ngày phân tích hiển thị trên phiếu</label>
                <input type="text"
                       [value]="unifiedDateString()"
                       (input)="onUnifiedDateChange($event)"
                       placeholder="Ví dụ: 22/05/2026 - 23/05/2026"
                       class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 dark:text-slate-200 font-bold">
              </div>

              <!-- Custom Master Run Code -->
              <div class="flex flex-col gap-1.5">
                <label class="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Mã mẻ gộp Master (Custom ID)</label>
                <input type="text"
                       [value]="customMasterId()"
                       (input)="onCustomMasterIdChange($event)"
                       class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 dark:text-slate-200 font-mono font-bold uppercase">
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button (click)="closeMergeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-black transition">
                Hủy
              </button>
              <button (click)="executeMerge()" class="px-5 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-xl text-xs font-black transition shadow-md shadow-fuchsia-500/10">
                Tạo mẻ gộp
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Premium Glassmorphic Report Hub Modal -->
      @if (showReportHubModal() && selectedRequestForReport()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div class="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 flex flex-col max-h-[85vh]">
            
            <!-- Modal Header -->
            <div class="px-6 py-4.5 bg-slate-50/50 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500/10 to-rose-500/10 text-red-655 dark:text-red-400 flex items-center justify-center border border-red-100/50 dark:border-red-900/30">
                  <i class="fa-solid fa-file-pdf text-base animate-pulse"></i>
                </div>
                <div>
                  <h3 class="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight m-0">Trung Tâm Quản Lý Báo Cáo</h3>
                  <p class="text-[10px] text-slate-400 dark:text-slate-500 font-bold m-0 mt-0.5">Mẻ chạy: {{ selectedRequestForReport().runCode }} — {{ selectedRequestForReport().sopName }}</p>
                </div>
              </div>
              <button (click)="closeReportHub()" 
                      class="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 flex items-center justify-center transition active:scale-90">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <!-- Modal Content (Scrollable) -->
            <div class="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              <!-- 1. CÁC BẢN IN HIỆN TẠI (ACTIVE REPORTS) -->
              <div class="space-y-3">
                <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/85 pb-2">
                  <i class="fa-solid fa-print mr-1.5 text-fuchsia-500"></i> Các bản in đang hoạt động
                </h4>

                <!-- Báo cáo chung (Tất cả mẫu) - Luôn hiển thị nếu có file in -->
                @if (unifiedAllSamplesReport()) {
                  <div class="bg-indigo-50/10 dark:bg-indigo-950/5 border border-indigo-150/40 dark:border-indigo-900/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:shadow-sm transition">
                    <div>
                      <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200/20 text-[9px] font-black uppercase tracking-wider">Tất cả mẫu</span>
                      <span class="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mt-1">Phiên bản hiện tại: v{{ unifiedAllSamplesReport().version }}</span>
                      <span class="text-[10px] text-slate-450 dark:text-slate-500 block mt-0.5">Thời gian: {{ unifiedAllSamplesReport().updatedAt | date:'HH:mm - dd/MM/yyyy' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <a [href]="getSafeGoogleUrl((unifiedAllSamplesReport().pdfViewUrl || unifiedAllSamplesReport().pdfUrl), 'pdf')" target="_blank" rel="noopener noreferrer"
                         class="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 no-underline">
                        <i class="fa-solid fa-file-pdf"></i> XEM PDF
                      </a>
                      @if (unifiedAllSamplesReport().docsUrl) {
                        <a [href]="getSafeGoogleUrl(unifiedAllSamplesReport().docsUrl, 'doc')" target="_blank" rel="noopener noreferrer"
                           class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 no-underline">
                          <i class="fa-solid fa-file-word"></i> MỞ DOCS
                        </a>
                      }
                    </div>
                  </div>
                }

                <!-- Báo cáo theo phân nhóm tiền tố (Prefix reports) - CHỈ DÀNH CHO TRIFLURALIN KHI CÓ NHIỀU NHÓM -->
                @if (shouldShowPrefixLoop()) {
                  @for (pref of getSelectedRunPrefixes(); track pref) {
                    <div class="bg-fuchsia-50/15 dark:bg-fuchsia-955/5 border border-fuchsia-150/40 dark:border-fuchsia-900/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:shadow-sm transition">
                      <div>
                        <span class="px-2 py-0.5 rounded bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-400 border border-fuchsia-200/20 text-[9px] font-black uppercase tracking-wider">
                          {{ pref === '' ? 'Không tiền tố' : 'Tiền tố ' + pref }}
                        </span>
                        @if (getPrefixReportForSelected(pref)) {
                          <span class="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mt-1">Phiên bản hiện tại: v{{ getPrefixReportForSelected(pref).version || 1 }}</span>
                          <span class="text-[10px] text-slate-450 dark:text-slate-500 block mt-0.5">Thời gian: {{ getPrefixReportForSelected(pref).pdfCreatedAt | date:'HH:mm - dd/MM/yyyy' }}</span>
                        } @else {
                          <span class="text-[11px] font-bold text-slate-500/70 block mt-1">Phiên bản hiện tại: Chưa có</span>
                          <span class="text-[10px] text-slate-400 dark:text-slate-500/80 block mt-0.5">Mẫu thuộc nhóm {{ pref === '' ? 'Không tiền tố' : pref }} tồn tại trong mẻ chạy nhưng chưa xuất bản file.</span>
                        }
                      </div>
                      <div class="flex items-center gap-2">
                        @if (getPrefixReportForSelected(pref) && (getPrefixReportForSelected(pref).pdfUrl || getPrefixReportForSelected(pref).pdfViewUrl)) {
                          <a [href]="getSafeGoogleUrl(getPrefixReportForSelected(pref).pdfViewUrl || getPrefixReportForSelected(pref).pdfUrl, 'pdf')" target="_blank" rel="noopener noreferrer"
                             class="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 no-underline">
                            <i class="fa-solid fa-file-pdf"></i> XEM PDF
                          </a>
                          @if (getPrefixReportForSelected(pref).docsUrl) {
                            <a [href]="getSafeGoogleUrl(getPrefixReportForSelected(pref).docsUrl, 'doc')" target="_blank" rel="noopener noreferrer"
                               class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 no-underline">
                              <i class="fa-solid fa-file-word"></i> MỞ DOCS
                            </a>
                          }
                        } @else {
                          <span class="text-[10px] text-amber-600 dark:text-amber-500 font-extrabold flex items-center gap-1 mr-2">
                            <i class="fa-solid fa-triangle-exclamation animate-pulse"></i> Chưa tạo file
                          </span>
                          <button (click)="enterResults(selectedRequestForReport().id, pref); closeReportHub()"
                                  class="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95">
                            <i class="fa-solid fa-arrows-rotate animate-spin-slow"></i> TẠO FILE IN
                          </button>
                        }
                      </div>
                    </div>
                  }
                }

                <!-- Hộp Cảnh báo Không có file in (Chỉ hiển thị cho mẻ KHÔNG phân nhóm tiền tố) -->
                @if (!shouldShowPrefixLoop() && !unifiedAllSamplesReport()) {
                  @if (runStatusMap()[selectedRequestForReport().id] === 'completed') {
                    <div class="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:shadow-xs transition">
                      <div class="space-y-1">
                        <span class="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-955/50 text-amber-700 dark:text-amber-400 border border-amber-200/20 text-[9px] font-black uppercase tracking-wider">Tất cả mẫu</span>
                        <span class="text-[11px] font-bold text-slate-700 dark:text-slate-350 block">Trạng thái: Đã hoàn thành (Chưa có file in)</span>
                        <span class="text-[10px] text-slate-450 dark:text-slate-500 block font-medium">Bản in của mẻ này chưa được tạo ra trên Google Drive hoặc bị lỗi.</span>
                      </div>
                      <button (click)="enterResults(selectedRequestForReport().id); closeReportHub()"
                              class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0">
                        <i class="fa-solid fa-file-invoice text-sm animate-pulse"></i> TẠO FILE IN
                      </button>
                    </div>
                  } @else {
                    <div class="text-center py-6 text-slate-400 dark:text-slate-500 font-bold text-xs">
                      <i class="fa-solid fa-triangle-exclamation text-lg block mb-1.5 opacity-60"></i>
                      Mẻ chạy này chưa được xuất bản báo cáo nào.
                    </div>
                  }
                }
              </div>

              <!-- 2. LỊCH SỬ PHIÊN BẢN CŨ (VERSION HISTORY ARCHIVE) -->
              <div class="space-y-3">
                <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/85 pb-2">
                  <i class="fa-solid fa-clock-rotate-left mr-1.5 text-slate-500"></i> Lưu trữ lịch sử tất cả phiên bản
                </h4>

                @if (isLoadingHistory()) {
                  <div class="flex flex-col items-center justify-center py-8 gap-2">
                    <i class="fa-solid fa-spinner fa-spin text-lg text-fuchsia-500"></i>
                    <span class="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Đang tải lịch sử...</span>
                  </div>
                } @else {
                  @if (selectedRequestHistoryList().length > 0) {
                    <div class="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                      @for (hist of selectedRequestHistoryList(); track hist.version + '_' + hist.prefix) {
                        <div class="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/60 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div class="flex items-center gap-1.5">
                              <span class="font-black text-slate-700 dark:text-slate-350">Bản v{{ hist.version }}</span>
                              @if (hist.prefix) {
                                <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[8px] font-bold uppercase">
                                  {{ hist.prefix === '_NO_PREFIX_' ? 'Không tiền tố' : hist.prefix }}
                                </span>
                              }
                              @if (hist.status === 'archived') {
                                <span class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-955/50 text-amber-700 dark:text-amber-400 text-[8px] font-extrabold uppercase border border-amber-200/20">Lưu trữ</span>
                              }
                            </div>
                            <span class="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">Người in: {{ hist.publishedBy }} — {{ hist.publishedAt | date:'HH:mm - dd/MM/yyyy' }}</span>
                          </div>
                          <div class="flex items-center gap-1.5 shrink-0">
                            <a [href]="getSafeGoogleUrl(hist.pdfViewUrl || hist.pdfUrl, 'pdf')" target="_blank" rel="noopener noreferrer"
                               class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/30 text-slate-600 hover:text-red-655 dark:text-slate-400 dark:hover:text-red-400 border border-slate-200/40 dark:border-slate-700/40 flex items-center justify-center transition active:scale-90"
                               title="Xem PDF bản này">
                              <i class="fa-solid fa-file-pdf text-xs"></i>
                            </a>
                            @if (hist.docsUrl) {
                              <a [href]="getSafeGoogleUrl(hist.docsUrl, 'doc')" target="_blank" rel="noopener noreferrer"
                                 class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/30 text-slate-600 hover:text-blue-655 dark:text-slate-400 dark:hover:text-blue-400 border border-slate-200/40 dark:border-slate-700/40 flex items-center justify-center transition active:scale-90"
                                 title="Mở Docs bản này">
                                <i class="fa-solid fa-file-word text-xs"></i>
                              </a>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-4 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                      Không có bản in cũ trong lịch sử.
                    </div>
                  }
                }
              </div>

            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-slate-50/50 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-800/80 flex justify-end shrink-0">
              <button (click)="closeReportHub()" 
                      class="px-5 py-2.5 bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-black transition active:scale-95">
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
    
    // 1. Quét từ danh sách mẫu thực tế
    (run.sampleList || []).forEach((s: string) => {
      const startsWithLetter = /^[a-zA-Z]/.test(s);
      const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
      prefixes.add(prefix);
    });

    // 2. Quét từ các khóa báo cáo đã in trong cơ sở dữ liệu để phòng ngừa lỗi thiếu sót
    // Post-splitting: report keys are in analysisResultSummary.reports (metadata doc)
    const summaryReports = run.analysisResult?.reports || run.analysisResultSummary?.reports;
    if (summaryReports) {
      Object.keys(summaryReports).forEach(key => {
        const prefix = key === '_NO_PREFIX_' ? '' : key;
        prefixes.add(prefix);
      });
    }
    
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
    let trifluralin = 0;
    let fipronil = 0;
    let others = 0;
    runs.forEach((run: any) => {
      if (run.sopId === 'trifluralin-gcms') trifluralin++;
      else if (run.sopId === 'fipronil-chlorpyrifos') fipronil++;
      else others++;
    });
    return { trifluralin, fipronil, others };
  });

  // Date Filters
  private getInitialThisMonthRange() {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of month
      
      const toStr = (d: Date) => {
          const offset = d.getTimezoneOffset();
          const local = new Date(d.getTime() - (offset * 60 * 1000));
          return local.toISOString().split('T')[0];
      };
      
      return { start: toStr(start), end: toStr(end) };
  }
  private initialDates = this.getInitialThisMonthRange();
  startDate = signal<string>(this.initialDates.start);
  endDate = signal<string>(this.initialDates.end);
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
           this.startDate() !== this.initialDates.start || 
           this.endDate() !== this.initialDates.end;
  }

  resetAllFilters() {
    this.searchText.set('');
    this.selectedSopId.set('all');
    this.selectedAnalyst.set('all');
    this.startDate.set(this.initialDates.start);
    this.endDate.set(this.initialDates.end);
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

  enterResults(requestId: string, prefix?: string) {
    try {
      sessionStorage.setItem('lims_last_selected_request_id', requestId);
      this.saveState();
    } catch (e) {}
    if (prefix !== undefined) {
      this.router.navigate(['/results', requestId], { queryParams: { prefix } });
    } else {
      this.router.navigate(['/results', requestId]);
    }
  }

  openUrl(url: string) {
    if (url) window.open(url, '_blank');
  }
}
