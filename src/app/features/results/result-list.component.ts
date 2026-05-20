import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { Router } from '@angular/router';
import { formatSampleList } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import { ResultService } from './services/result.service';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, DateRangeFilterComponent],
  template: `
    <div class="h-full flex flex-col fade-in relative p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 mb-6">
        <div>
          <h2 class="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <i class="fa-solid fa-square-poll-vertical text-fuchsia-600 dark:text-fuchsia-500"></i> Nhập Kết Quả Phân Tích
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nhập kết quả, điền thông tin kiểm soát chất lượng (QC) và tạo phiếu kết quả tự động.
          </p>
        </div>

        <!-- Filter Tab -->
        <div class="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start border border-slate-200 dark:border-slate-700">
          <button (click)="filterStatus.set('all')" 
                  class="px-4 py-2 text-xs font-bold rounded-lg transition" 
                  [class]="filterStatus() === 'all' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            Tất cả @if(filteredCount('all') > 0) { <span class="ml-1 bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-md text-[9px]">{{filteredCount('all')}}</span> }
          </button>
          <button (click)="filterStatus.set('pending')" 
                  class="px-4 py-2 text-xs font-bold rounded-lg transition" 
                  [class]="filterStatus() === 'pending' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            Chờ nhập @if(filteredCount('pending') > 0) { <span class="ml-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md text-[9px]">{{filteredCount('pending')}}</span> }
          </button>
          <button (click)="filterStatus.set('draft')" 
                  class="px-4 py-2 text-xs font-bold rounded-lg transition" 
                  [class]="filterStatus() === 'draft' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            Đang nháp @if(filteredCount('draft') > 0) { <span class="ml-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-md text-[9px]">{{filteredCount('draft')}}</span> }
          </button>
          <button (click)="filterStatus.set('completed')" 
                  class="px-4 py-2 text-xs font-bold rounded-lg transition" 
                  [class]="filterStatus() === 'completed' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            Đã hoàn thành @if(filteredCount('completed') > 0) { <span class="ml-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[9px]">{{filteredCount('completed')}}</span> }
          </button>
        </div>
      </div>

      <!-- Advanced Filter Panel & Search -->
      <div class="mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4 shrink-0 transition-all duration-300">
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
                   class="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 dark:text-slate-100 font-medium">
            @if (searchText()) {
              <button (click)="searchText.set('')" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <i class="fa-solid fa-circle-xmark text-xs"></i>
              </button>
            }
          </div>

          <!-- Advanced Toggle & Clear Buttons -->
          <div class="flex items-center gap-2">
            <button (click)="showAdvancedFilters.set(!showAdvancedFilters())" 
                    [class]="showAdvancedFilters() ? 'bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-100 dark:border-fuchsia-900/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
                    class="px-4 py-2 border rounded-xl text-xs font-bold transition flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <i class="fa-solid fa-sliders text-[10px]"></i>
              <span>Bộ lọc nâng cao</span>
              <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-300" [class.rotate-180]="showAdvancedFilters()"></i>
            </button>
            
            @if (hasActiveFilters()) {
              <button (click)="resetAllFilters()" 
                      class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                <i class="fa-solid fa-rotate-left text-[10px]"></i>
                <span>Xóa bộ lọc</span>
              </button>
            }
          </div>
        </div>

        <!-- Collapsible Content -->
        @if (showAdvancedFilters()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700/40 text-xs animate-fade-in">
            <!-- SOP selection -->
            <div class="flex flex-col gap-1.5">
              <label class="font-black text-slate-400 uppercase tracking-wider text-[9px]">Phương pháp (SOP)</label>
              <select [value]="selectedSopId()" 
                      (change)="onSopChange($event)"
                      class="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-700 dark:text-slate-200 font-medium">
                <option value="all">Tất cả phương pháp</option>
                @for (sop of availableSops(); track sop.id) {
                  <option [value]="sop.id">{{ sop.name }}</option>
                }
              </select>
            </div>

            <!-- Analyst selection -->
            <div class="flex flex-col gap-1.5">
              <label class="font-black text-slate-400 uppercase tracking-wider text-[9px]">Người thực hiện (Analyst)</label>
              <select [value]="selectedAnalyst()" 
                      (change)="onAnalystChange($event)"
                      class="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-700 dark:text-slate-200 font-medium">
                <option value="all">Tất cả nhân viên</option>
                @for (analyst of availableAnalysts(); track analyst) {
                  <option [value]="analyst">{{ analyst }}</option>
                }
              </select>
            </div>

            <!-- Date Range Filter -->
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="font-black text-slate-400 uppercase tracking-wider text-[9px]">Khoảng thời gian (Ngày duyệt)</label>
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
          <div class="grid md:grid-cols-2 gap-4">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-3">
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
              <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group">
                <!-- Top Header Card -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span [class]="getStatusClass(run.id)" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border">
                      {{ getStatusText(run.id) }}
                    </span>
                    <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      <i class="fa-regular fa-calendar mr-1"></i>
                      {{ run.analysisDate ? formatAnalysisDate(run.analysisDate) : 'Không có ngày' }}
                    </span>
                  </div>

                  <!-- SOP Title -->
                  <h3 class="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                    {{ run.sopName }}
                  </h3>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <i class="fa-solid fa-user text-[9px]"></i>
                    </div>
                    <span class="font-bold text-slate-600 dark:text-slate-300">{{ run.user || 'Unknown' }}</span>
                  </div>

                  <!-- Sample Codes -->
                  @if (run.sampleList && run.sampleList.length > 0) {
                    <div class="mb-5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start gap-2">
                      <i class="fa-solid fa-vials text-slate-400 dark:text-slate-500 mt-0.5 shrink-0"></i>
                      <span class="break-all font-mono font-medium leading-relaxed">{{ formatSampleList(run.sampleList) }}</span>
                    </div>
                  }
                </div>

                <!-- Action Buttons -->
                <div class="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  <!-- PDF / Docs Buttons (chỉ hiện khi đã có PDF hoặc các bản báo cáo theo nhóm) -->
                  @if (run.analysisResult?.reports || run.analysisResult?.pdfUrl || run.analysisResult?.docsUrl) {
                    <div class="flex flex-col gap-2 mb-2">
                      
                      <!-- 1. Báo cáo chung (Tất cả mẫu) - Chỉ hiện khi có pdfUrl ở root -->
                      @if (run.analysisResult?.pdfUrl) {
                        <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/30 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                          <span class="text-[11px] font-black text-indigo-600 dark:text-indigo-400 min-w-[85px] truncate">
                            Tất cả mẫu:
                          </span>
                          
                          <div class="flex-1 flex items-center relative group">
                            <!-- Nút Xem PDF chính -->
                            <button (click)="openUrl(run.analysisResult!.pdfUrl!)"
                                    class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-l-lg text-[11px] font-bold transition"
                                    [class.rounded-r-lg]="(run.analysisResult?.version || 0) <= 1"
                                    title="Mở file PDF phiên bản mới nhất (v{{ run.analysisResult?.version || 1 }})">
                              <i class="fa-solid fa-file-pdf"></i> PDF (v{{ run.analysisResult?.version || 1 }})
                            </button>
                            
                            <!-- Nút Dropdown lịch sử nếu có -->
                            @if ((run.analysisResult?.version || 0) > 1) {
                              <button (mouseenter)="preloadHistory(run.id)"
                                      class="px-2 py-1.5 bg-red-50 dark:bg-red-950/20 border-t border-b border-r border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-r-lg text-[10px] font-bold transition flex items-center justify-center">
                                <i class="fa-solid fa-chevron-down text-[8px]"></i>
                              </button>
                              
                              <!-- Dropdown menu -->
                              <div class="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1.5 max-h-60 overflow-y-auto">
                                <div class="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lịch sử bản in</div>
                                
                                <!-- Bản hiện tại -->
                                <div class="px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                  <div class="flex flex-col gap-0.5">
                                    <span class="font-bold text-slate-700 dark:text-slate-200">Bản hiện tại (v{{ run.analysisResult?.version }})</span>
                                    <span class="text-[9px] text-slate-400 dark:text-slate-500">{{ run.analysisResult?.pdfCreatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                                  </div>
                                  <div class="flex gap-1.5">
                                    <button (click)="openUrl(run.analysisResult!.pdfUrl!)" class="text-red-600 dark:text-red-400 hover:underline font-bold text-[11px]">PDF</button>
                                    @if (run.analysisResult?.docsUrl) {
                                      <span class="text-slate-300">|</span>
                                      <button (click)="openUrl(run.analysisResult!.docsUrl!)" class="text-blue-600 dark:text-blue-400 hover:underline font-bold text-[11px]">Doc</button>
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
                                      <div class="px-4 py-2 text-xs flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <div class="flex flex-col gap-0.5">
                                          <span class="font-medium text-slate-700 dark:text-slate-200">Phiên bản v{{ hist.version }} {{ hist.status === 'archived' ? '(Đã hủy)' : '' }}</span>
                                          <span class="text-[9px] text-slate-400 dark:text-slate-500">{{ hist.publishedAt | date:'dd/MM/yyyy HH:mm' }} - {{ hist.publishedBy }}</span>
                                        </div>
                                        <div class="flex gap-1.5 font-bold">
                                          <button (click)="openUrl(hist.pdfUrl)" class="text-red-600 dark:text-red-400 hover:underline text-[11px]">PDF</button>
                                          @if (hist.docsUrl) {
                                            <span class="text-slate-300">|</span>
                                            <button (click)="openUrl(hist.docsUrl)" class="text-blue-600 dark:text-blue-400 hover:underline text-[11px]">Doc</button>
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
                            <button (click)="openUrl(run.analysisResult!.docsUrl!)"
                                    class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/40 rounded-lg text-[11px] font-bold transition"
                                    title="Mở bản Google Docs gốc">
                              <i class="fa-brands fa-google-drive"></i> Docs
                            </button>
                          }
                        </div>
                      }

                      <!-- 2. Các báo cáo phân theo nhóm tiền tố -->
                      @if (run.analysisResult?.reports) {
                        @for (prefix of getReportKeys(run.analysisResult?.reports); track prefix) {
                          @let report = run.analysisResult?.reports?.[prefix];
                          <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/30 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60">
                            <span class="text-[11px] font-black text-slate-500 dark:text-slate-400 min-w-[85px] truncate">
                              {{ prefix === '' ? 'Không tiền tố' : 'Nhóm ' + prefix }}:
                            </span>
                            
                            @if (report?.pdfUrl) {
                              <button (click)="openUrl(report?.pdfUrl || '')"
                                      class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-lg text-[11px] font-bold transition"
                                      title="Xem PDF bản v{{ report?.version || 1 }}">
                                <i class="fa-solid fa-file-pdf"></i> PDF (v{{ report?.version || 1 }})
                              </button>
                            }
                            @if (report?.docsUrl) {
                              <button (click)="openUrl(report?.docsUrl || '')"
                                      class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/40 rounded-lg text-[11px] font-bold transition"
                                      title="Mở Google Docs">
                                <i class="fa-brands fa-google-drive"></i> Docs
                              </button>
                            }
                          </div>
                        }
                      }
                    </div>
                  }

                  <!-- Enter / Edit Button -->
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                      {{ run.sampleList?.length || 0 }} mẫu phân tích
                    </span>
                    <button (click)="enterResults(run.id)"
                            [class]="runStatusMap()[run.id] === 'completed' 
                              ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:border-fuchsia-200 dark:hover:border-fuchsia-800/30'
                              : 'bg-fuchsia-600 dark:bg-fuchsia-500 text-white hover:bg-fuchsia-700 dark:hover:bg-fuchsia-600 shadow-sm'"
                            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2">
                      <i class="fa-solid" [class.fa-pen-to-square]="runStatusMap()[run.id] !== 'completed'" [class.fa-arrows-rotate]="runStatusMap()[run.id] === 'completed'"></i>
                      {{ runStatusMap()[run.id] === 'completed' ? 'Chỉnh sửa / In lại' : 'Nhập Kết quả' }}
                    </button>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
                <div class="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
                  <i class="fa-solid fa-square-poll-vertical text-3xl"></i>
                </div>
                <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Không tìm thấy mẻ nào phù hợp với bộ lọc hiện tại.
                </p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class ResultListComponent implements OnInit, OnDestroy {
  private state = inject(StateService);
  private router = inject(Router);
  private resultService = inject(ResultService);

  formatSampleList = formatSampleList;

  isLoading = signal(true);
  filterStatus = signal<'all' | 'pending' | 'draft' | 'completed'>('all');

  // Advanced Filters State
  searchText = signal<string>('');
  selectedSopId = signal<string>('all');
  selectedAnalyst = signal<string>('all');
  
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
        if (!run.analysisDate) return false;
        if (start && run.analysisDate < start) return false;
        if (end && run.analysisDate > end) return false;
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
        if (!run.analysisDate) return false;
        if (start && run.analysisDate < start) return false;
        if (end && run.analysisDate > end) return false;
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

  enterResults(requestId: string) {
    this.router.navigate(['/results', requestId]);
  }

  openUrl(url: string) {
    if (url) window.open(url, '_blank');
  }
}
