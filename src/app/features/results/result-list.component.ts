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
import { doc, setDoc } from 'firebase/firestore';

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
                   class="w-full pl-9 pr-8 py-2 text-xs bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 dark:text-slate-200 font-bold transition">
            @if (searchText()) {
              <button (click)="searchText.set('')" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <i class="fa-solid fa-circle-xmark text-xs"></i>
              </button>
            }
          </div>

          <!-- Advanced Toggle & Clear Buttons -->
          <div class="flex items-center gap-2">
            <button (click)="showAdvancedFilters.set(!showAdvancedFilters())" 
                    [class]="showAdvancedFilters() ? 'bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-600 dark:text-fuchsia-450 border-fuchsia-200/50 dark:border-fuchsia-800' : 'bg-white dark:bg-slate-800 text-slate-655 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
                    class="px-4 py-2 border rounded-xl text-xs font-black transition flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 relative active:scale-95 duration-150 shadow-xs">
              <i class="fa-solid fa-sliders text-[10px]"></i>
              <span>Bộ lọc nâng cao</span>
              @if (activeFiltersCount() > 0) {
                <span class="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-fuchsia-600 dark:bg-fuchsia-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs shadow-fuchsia-500/30">
                  {{ activeFiltersCount() }}
                </span>
              }
              <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-300" [class.rotate-180]="showAdvancedFilters()"></i>
            </button>
            
            @if (hasActiveFilters()) {
              <button (click)="resetAllFilters()" 
                      class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95 duration-150 shadow-xs">
                <i class="fa-solid fa-rotate-left text-[10px]"></i>
                <span>Xóa bộ lọc</span>
              </button>
            }
          </div>
        </div>

        <!-- Collapsible Content -->
        @if (showAdvancedFilters()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs animate-fade-in">
            <!-- SOP selection -->
            <div class="flex flex-col gap-1.5">
              <label class="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Phương pháp (SOP)</label>
              <select [value]="selectedSopId()" 
                      (change)="onSopChange($event)"
                      class="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-700 dark:text-slate-200 font-extrabold">
                <option value="all">Tất cả phương pháp</option>
                @for (sop of availableSops(); track sop.id) {
                  <option [value]="sop.id">{{ sop.name }}</option>
                }
              </select>
            </div>

            <!-- Analyst selection -->
            <div class="flex flex-col gap-1.5">
              <label class="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Người thực hiện (Analyst)</label>
              <select [value]="selectedAnalyst()" 
                      (change)="onAnalystChange($event)"
                      class="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-700 dark:text-slate-200 font-extrabold">
                <option value="all">Tất cả nhân viên</option>
                @for (analyst of availableAnalysts(); track analyst) {
                  <option [value]="analyst">{{ analyst }}</option>
                }
              </select>
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

      <!-- Main Content Area -->
      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-20">
        @if (isLoading()) {
          <div class="grid md:grid-cols-2 gap-4 animate-pulse">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3">
                <app-skeleton width="80px" height="14px"></app-skeleton>
                <app-skeleton width="200px" height="20px"></app-skeleton>
                <app-skeleton width="140px" height="14px"></app-skeleton>
                <app-skeleton width="100%" height="32px"></app-skeleton>
              </div>
            }
          </div>
        } @else {
          <div class="grid md:grid-cols-2 gap-4">
            @for (run of displayedRuns(); track run.id) {
              <!-- CHÚ Ý: Loại bỏ overflow-hidden và thêm z-10 hover:z-30 relative để menu dropdown in ấn hiển thị tràn không bị che -->
              <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-150/80 dark:border-slate-800/80 p-5 hover:shadow-xl hover:border-slate-200/40 dark:hover:border-slate-700/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative z-10 hover:z-30 group">
                <!-- Ribbon gradient nhận diện phương pháp (SOP) -->
                <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r {{ getSopGradientClass(run.sopId) }} rounded-t-2xl"></div>

                <!-- Top Header Card -->
                <div>
                  <div class="flex items-center justify-between mb-3.5">
                    <div class="flex items-center gap-2.5">
                      <!-- Checkbox gộp mẻ chạy -->
                      <label class="inline-flex items-center cursor-pointer select-none" (click)="$event.stopPropagation()">
                        <input type="checkbox"
                               [checked]="selectedRunsMap()[run.id]"
                               (change)="toggleRunSelection(run)"
                               class="w-4.5 h-4.5 text-fuchsia-600 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded focus:ring-fuchsia-500 focus:ring-2">
                      </label>
                      <span [class]="getStatusClass(run.id)" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                          'bg-emerald-500 animate-pulse': runStatusMap()[run.id] === 'completed',
                          'bg-indigo-500 animate-pulse': runStatusMap()[run.id] === 'draft',
                          'bg-amber-500 animate-pulse': runStatusMap()[run.id] === 'pending' || !runStatusMap()[run.id]
                        }"></span>
                        {{ getStatusText(run.id) }}
                      </span>
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
                  
                  <!-- Analyst block (Pastel custom avatar) -->
                  <div class="text-xs text-slate-500 dark:text-slate-450 mb-4.5 flex items-center gap-2">
                    <div [class]="getAnalystAvatarClass(run.user)" class="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-black uppercase shadow-3xs select-none">
                      {{ getAnalystInitials(run.user) }}
                    </div>
                    <span class="font-bold text-slate-650 dark:text-slate-300">{{ run.user || 'Unknown' }}</span>
                  </div>

                  <!-- Sample Codes -->
                  @if (run.sampleList && run.sampleList.length > 0) {
                    <div class="mb-4 text-xs text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-start gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                      <i class="fa-solid fa-vials text-slate-400 dark:text-slate-500 mt-0.5 shrink-0"></i>
                      <span class="break-all font-mono font-bold leading-relaxed">{{ formatSampleList(run.sampleList) }}</span>
                    </div>
                  }
                  
                  <!-- Progress Bar -->
                  <div class="mb-5">
                    <div class="flex justify-between items-center mb-1 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      <span>Tiến độ nhập liệu</span>
                      <span>{{ getRunProgress(run) }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-200/10">
                      <div class="h-full bg-gradient-to-r {{ getSopGradientClass(run.sopId) }} rounded-full transition-all duration-500" 
                           [style.width.%]="getRunProgress(run)"></div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 relative">
                  <!-- PDF / Docs Buttons (chỉ hiện khi đã có PDF hoặc các bản báo cáo theo nhóm) -->
                  @if (run.analysisResult?.reports || run.analysisResult?.pdfUrl || run.analysisResult?.docsUrl) {
                    <div class="flex flex-col gap-2 mb-2">
                      
                      <!-- 1. Báo cáo chung (Tất cả mẫu) - Chỉ hiện khi có pdfUrl ở root -->
                      @if (run.analysisResult?.pdfUrl) {
                        <div class="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/30 p-2 rounded-xl border border-slate-100 dark:border-slate-800/50">
                          <span class="text-[11px] font-black text-indigo-600 dark:text-indigo-400 min-w-[85px] truncate">
                            Tất cả mẫu:
                          </span>
                          
                          <div class="flex-1 flex items-center relative group/hist">
                            <!-- Nút Xem PDF chính -->
                            <a [href]="getSafeGoogleUrl(run.analysisResult!.pdfUrl!, 'pdf')" target="_blank" rel="noopener noreferrer"
                                    class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-l-lg text-[11px] font-bold transition"
                                    [class.rounded-r-lg]="(run.analysisResult?.version || 0) <= 1"
                                    title="Mở file PDF phiên bản mới nhất (v{{ run.analysisResult?.version || 1 }})">
                              <i class="fa-solid fa-file-pdf"></i> PDF (v{{ run.analysisResult?.version || 1 }})
                            </a>
                            
                            <!-- Nút Dropdown lịch sử nếu có -->
                            @if ((run.analysisResult?.version || 0) > 1) {
                              <button (mouseenter)="preloadHistory(run.id)"
                                      class="px-2 py-1.5 bg-red-50 dark:bg-red-950/20 border-t border-b border-r border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-r-lg text-[10px] font-bold transition flex items-center justify-center">
                                <i class="fa-solid fa-chevron-down text-[8px]"></i>
                              </button>
                              
                              <!-- Dropdown menu (Lịch sử bản in) -->
                              <div class="absolute right-0 top-full mt-1.5 w-68 bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover/hist:opacity-100 group-hover/hist:visible transition-all duration-200 z-50 py-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                                <div class="px-3 py-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lịch sử bản in</div>
                                
                                <!-- Bản hiện tại -->
                                <div class="px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                  <div class="flex flex-col gap-0.5">
                                    <span class="font-bold text-slate-700 dark:text-slate-200">Bản hiện tại (v{{ run.analysisResult?.version }})</span>
                                    <span class="text-[9px] text-slate-400 dark:text-slate-500 font-bold">{{ run.analysisResult?.pdfCreatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                                  </div>
                                  <div class="flex gap-1.5">
                                    <a [href]="getSafeGoogleUrl(run.analysisResult!.pdfUrl!, 'pdf')" target="_blank" rel="noopener noreferrer" class="text-red-650 dark:text-red-400 hover:underline font-black text-[11px]">PDF</a>
                                    @if (run.analysisResult?.docsUrl) {
                                      <span class="text-slate-300">|</span>
                                      <a [href]="getSafeGoogleUrl(run.analysisResult!.docsUrl!, 'doc')" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-black text-[11px]">Doc</a>
                                    }
                                  </div>
                                </div>
                                
                                <!-- Spinner loading -->
                                @if (loadingHistories()[run.id]) {
                                  <div class="px-4 py-3 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700/50">
                                    <i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang tải...
                                  </div>
                                } @else {
                                  <!-- Các bản trong lịch sử -->
                                  @for (hist of historiesMap()[run.id] || []; track hist.version) {
                                    @if (hist.version !== run.analysisResult?.version) {
                                      <div class="px-4 py-2 text-xs flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <div class="flex flex-col gap-0.5">
                                          <span class="font-bold text-slate-700 dark:text-slate-200">Phiên bản v{{ hist.version }} {{ hist.status === 'archived' ? '(Đã hủy)' : '' }}</span>
                                          <span class="text-[9px] text-slate-400 dark:text-slate-500 font-bold">{{ hist.publishedAt | date:'dd/MM/yyyy HH:mm' }} - {{ hist.publishedBy }}</span>
                                        </div>
                                        <div class="flex gap-1.5 font-black">
                                          <a [href]="getSafeGoogleUrl(hist.pdfUrl, 'pdf')" target="_blank" rel="noopener noreferrer" class="text-red-650 dark:text-red-400 hover:underline text-[11px]">PDF</a>
                                          @if (hist.docsUrl) {
                                            <span class="text-slate-300">|</span>
                                            <a [href]="getSafeGoogleUrl(hist.docsUrl, 'doc')" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline text-[11px]">Doc</a>
                                          }
                                        </div>
                                      </div>
                                    }
                                  }
                                }
                              </div>
                            }
                          </div>

                          @if (run.analysisResult?.docsUrl) {
                            <a [href]="getSafeGoogleUrl(run.analysisResult!.docsUrl!, 'doc')" target="_blank" rel="noopener noreferrer"
                                    class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/40 rounded-lg text-[11px] font-bold transition"
                                    title="Mở bản Google Docs gốc">
                              <i class="fa-brands fa-google-drive"></i> Docs
                            </a>
                          }
                        </div>
                      }

                      <!-- 2. Các báo cáo phân theo nhóm tiền tố -->
                      @if (run.analysisResult?.reports) {
                        @for (prefix of getReportKeys(run.analysisResult?.reports); track prefix) {
                          @let report = run.analysisResult?.reports?.[prefix];
                          <div class="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/30 p-2 rounded-xl border border-slate-100 dark:border-slate-800/50">
                            <span class="text-[11px] font-black text-slate-500 dark:text-slate-450 min-w-[85px] truncate">
                              {{ prefix === '' || prefix === '_NO_PREFIX_' ? 'Không tiền tố' : 'Nhóm ' + prefix }}:
                            </span>
                            
                            @if (report?.pdfUrl) {
                              <a [href]="getSafeGoogleUrl(report?.pdfUrl || '', 'pdf')" target="_blank" rel="noopener noreferrer"
                                      class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-lg text-[11px] font-bold transition"
                                      title="Xem PDF bản v{{ report?.version || 1 }}">
                                <i class="fa-solid fa-file-pdf"></i> PDF (v{{ report?.version || 1 }})
                              </a>
                            }
                            @if (report?.docsUrl) {
                              <a [href]="getSafeGoogleUrl(report?.docsUrl || '', 'doc')" target="_blank" rel="noopener noreferrer"
                                      class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/40 rounded-lg text-[11px] font-bold transition"
                                      title="Mở Google Docs">
                                <i class="fa-brands fa-google-drive"></i> Docs
                              </a>
                            }
                          </div>
                        }
                      }
                    </div>
                  }

                  <!-- Enter / Edit Button -->
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[10px] text-slate-400 dark:text-slate-500 font-black max-w-[120px] sm:max-w-[200px] truncate" title="{{ run.sampleList ? formatSampleList(run.sampleList) : '' }}">
                      {{ run.sampleList?.length || 0 }} mẫu ({{ run.sampleList ? formatSampleList(run.sampleList) : 'Trống' }})
                    </span>
                    <button (click)="enterResults(run.id)"
                            [class]="runStatusMap()[run.id] === 'completed' 
                              ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:border-fuchsia-200 dark:hover:border-fuchsia-800/30 shadow-3xs'
                              : 'bg-fuchsia-600 dark:bg-fuchsia-500 text-white hover:bg-fuchsia-700 dark:hover:bg-fuchsia-600 shadow-xs active:scale-95 duration-150'"
                            class="px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2">
                      <i class="fa-solid" [class.fa-pen-to-square]="runStatusMap()[run.id] !== 'completed'" [class.fa-arrows-rotate]="runStatusMap()[run.id] === 'completed'"></i>
                      {{ runStatusMap()[run.id] === 'completed' ? 'Chỉnh sửa / In lại' : 'Nhập Kết quả' }}
                    </button>
                  </div>
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
        }
      </div>

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
  selectedRunsMap = signal<Record<string, boolean>>({});
  selectedRunsCount = computed(() => Object.values(this.selectedRunsMap()).filter(Boolean).length);
  showMergeModal = signal<boolean>(false);
  masterCurveRunId = signal<string>('');
  unifiedDateString = signal<string>('');
  customMasterId = signal<string>('');

  // Date Filters
  private getInitialThisWeekRange() {
      const today = new Date();
      const start = new Date();
      const day = today.getDay(); 
      const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diffToMon);
      
      const end = new Date(start);
      end.setDate(start.getDate() + 6); // Sunday
      
      const toStr = (d: Date) => {
          const offset = d.getTimezoneOffset();
          const local = new Date(d.getTime() - (offset * 60 * 1000));
          return local.toISOString().split('T')[0];
      };
      
      return { start: toStr(start), end: toStr(end) };
  }
  private initialDates = this.getInitialThisWeekRange();
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
    if (!run || !run.sampleList || run.sampleList.length === 0) return 0;
    const resultData = run.analysisResult?.resultData || {};
    let filled = 0;
    run.sampleList.forEach((sample: string) => {
      const row = resultData[sample];
      if (row) {
        const values = Object.keys(row).filter(k => k !== 'selected' && k !== 'loSo' && k !== 'ghiChu');
        const hasKq = values.some(k => row[k] !== undefined && String(row[k]).trim() !== '');
        if (hasKq) filled++;
      }
    });
    return Math.round((filled / run.sampleList.length) * 100);
  }

  async preloadHistory(requestId: string) {
    if (this.historiesMap()[requestId] || this.loadingHistories()[requestId]) return;
    
    this.loadingHistories.update(map => ({ ...map, [requestId]: true }));
    try {
      const hist = await this.resultService.getHistory(requestId);
      this.historiesMap.update(map => ({ ...map, [requestId]: hist }));
    } finally {
      this.loadingHistories.update(map => ({ ...map, [requestId]: false }));
    }
  }

  // Đọc động trạng thái mẻ chạy từ StateService của Requests (Đã có sẵn cơ chế DeltaSync thời gian thực)
  runStatusMap = computed(() => {
    const statusMap: Record<string, 'pending' | 'draft' | 'completed'> = {};
    const all = this.state.approvedRequests() || [];
    all.forEach(run => {
      statusMap[run.id] = run.analysisResult?.status || 'pending';
    });
    return statusMap;
  });

  ngOnInit() {
    this.isLoading.set(false);
  }

  ngOnDestroy() {}

  // Danh sách các mẻ đã duyệt thành công
  allApprovedRuns = computed(() => {
    return this.state.approvedRequests() || [];
  });

  // Dynamic lists for filters
  availableSops = computed(() => {
    const runs = this.allApprovedRuns();
    const map = new Map<string, string>(); // sopId -> sopName
    runs.forEach(run => {
      if (run.sopId && run.sopName) {
        map.set(run.sopId, run.sopName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  });

  availableAnalysts = computed(() => {
    const runs = this.allApprovedRuns();
    const set = new Set<string>();
    runs.forEach(run => {
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
      list = list.filter(run => {
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
      list = list.filter(run => run.sopId === sopId);
    }

    // 3. Filter by Analyst
    const analyst = this.selectedAnalyst();
    if (analyst !== 'all') {
      list = list.filter(run => run.user === analyst);
    }

    // 4. Filter by Date
    const start = this.startDate();
    const end = this.endDate();
    if (start || end) {
      list = list.filter(run => {
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
      list = list.filter(run => (statusMap[run.id] || 'pending') === statusFilter);
    }

    return list;
  });

  // Đếm số lượng mẻ theo bộ lọc (áp dụng các bộ lọc nâng cao)
  filteredCount(status: 'all' | 'pending' | 'draft' | 'completed'): number {
    let list = this.allApprovedRuns();
    
    const search = this.searchText().trim().toLowerCase();
    if (search) {
      list = list.filter(run => {
        const batchCode = (run.inputs?.['batchCode'] || run.id || '').toLowerCase();
        const sopName = (run.sopName || '').toLowerCase();
        const user = (run.user || '').toLowerCase();
        const samples = (run.sampleList || []).map((s: string) => s.toLowerCase());
        return batchCode.includes(search) || sopName.includes(search) || user.includes(search) || samples.some((s: string) => s.includes(search));
      });
    }

    const sopId = this.selectedSopId();
    if (sopId !== 'all') {
      list = list.filter(run => run.sopId === sopId);
    }

    const analyst = this.selectedAnalyst();
    if (analyst !== 'all') {
      list = list.filter(run => run.user === analyst);
    }

    const start = this.startDate();
    const end = this.endDate();
    if (start || end) {
      list = list.filter(run => {
        const runDate = this.getRunDate(run);
        if (!runDate) return false;
        if (start && runDate < start) return false;
        if (end && runDate > end) return false;
        return true;
      });
    }

    const statusMap = this.runStatusMap();
    if (status === 'all') return list.length;
    return list.filter(run => (statusMap[run.id] || 'pending') === status).length;
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
        this.toast.show('Chỉ cho phép gộp các mẻ chạy có cùng Phương pháp (SOP)!', 'warning');
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
    return this.allApprovedRuns().filter(run => map[run.id]);
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
    const defaultCurve = runs.find(r => r.analysisResult?.resultData && Object.keys(r.analysisResult.resultData).some(k => k.startsWith('CAL_'))) || runs[0];
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

    // Prepare resultData: inherit calibration and QC from the selected curve run
    const resultData: Record<string, any> = {};
    
    // Inherit calibration curve and other metadata from selected curveRun
    const curveResult = curveRun.analysisResult || {};
    const curveResultData = curveResult.resultData || {};
    
    // 1. Copy calibration points and standard QC rows
    Object.keys(curveResultData).forEach(key => {
      if (key.startsWith('CAL_') || key.startsWith('QC_') || key.includes('BLANK') || key.includes('SPIKE') || key.includes('FINAL')) {
        resultData[key] = { ...curveResultData[key] };
      }
    });

    // 2. Copy sample rows from their respective source runs
    sops.forEach(r => {
      const sourceResultData = r.analysisResult?.resultData || {};
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

    // Create the Virtual Master payload
    const masterPayload: any = {
      sopId: curveRun.sopId,
      sopName: curveRun.sopName,
      items: curveRun.items || [], // inherit standard reagents/materials requested
      status: 'approved', // must be approved to enter results!
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
      analysisResult: {
        status: 'draft',
        version: 0,
        resultData,
        page1Data: {
          ...(curveResult.page1Data || {}),
          ngayNguoiPhanTich: new Date().toISOString().split('T')[0],
          ngayNguoiThamTra: new Date().toISOString().split('T')[0],
          checkTatCaND: true,
          checkCoMauPhatHien: false
        }
      }
    };

    // Save directly to Firestore under requests
    try {
      this.isLoading.set(true);
      const docRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', masterId);
      await setDoc(docRef, masterPayload);
      
      // Close modal and deselect
      this.closeMergeModal();
      this.cancelSelection();
      this.toast.show(`Đã khởi tạo mẻ gộp Master "${masterId}" thành công!`, 'success');
      
      // Navigate immediately to entry grid!
      this.router.navigate(['/results', masterId]);
    } catch (e: any) {
      console.error('Error creating virtual master run:', e);
      this.toast.show('Không thể tạo mẻ gộp: ' + e.message, 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  enterResults(requestId: string) {
    this.router.navigate(['/results', requestId]);
  }

  openUrl(url: string) {
    if (url) window.open(url, '_blank');
  }
}
