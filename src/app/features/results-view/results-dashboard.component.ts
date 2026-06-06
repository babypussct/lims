import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { formatSampleList } from '../../shared/utils/utils';

@Component({
  selector: 'app-results-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col fade-in bg-slate-50/30 dark:bg-slate-950/10 p-6 space-y-6">
      
      <!-- HEADER section -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
            <span class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <i class="fa-solid fa-chart-line text-white text-sm"></i>
            </span>
            Tra Cứu & Đọc Kết Quả Mẻ Chạy
          </h2>
          <p class="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 ml-10">
            Xem báo cáo tĩnh, đối chiếu số liệu và tra cứu mẫu phân tích liên mẻ chạy.
          </p>
        </div>

        <!-- KPI Metrics Grid -->
        <div class="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-xs">
          <div class="text-center px-3 border-r border-slate-100 dark:border-slate-800">
            <div class="text-base font-black text-slate-800 dark:text-slate-100 leading-none tabular-nums">{{ allRuns().length }}</div>
            <div class="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Tổng mẻ</div>
          </div>
          <div class="text-center px-3 border-r border-slate-100 dark:border-slate-800">
            <div class="text-base font-black text-emerald-600 dark:text-emerald-400 leading-none tabular-nums">{{ completedCount() }}</div>
            <div class="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Đã duyệt</div>
          </div>
          <div class="text-center px-3">
            <div class="text-base font-black text-indigo-600 dark:text-indigo-400 leading-none tabular-nums">{{ draftCount() }}</div>
            <div class="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Đang nháp</div>
          </div>
        </div>
      </div>

      <!-- FILTER CONTROLS -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-xs shrink-0">
        <!-- Search bar -->
        <div class="md:col-span-5 relative">
          <label class="block text-[9px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Tìm kiếm mẻ hoặc mẫu thử</label>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input type="text" 
                   [(ngModel)]="searchText"
                   placeholder="Nhập mã mẻ, tên SOP, người chạy hoặc mã mẫu..."
                   class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition">
          </div>
        </div>

        <!-- SOP Selector -->
        <div class="md:col-span-3">
          <label class="block text-[9px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Lọc theo SOP</label>
          <select [(ngModel)]="selectedSopId"
                  class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition cursor-pointer">
            <option value="all">Tất cả SOP</option>
            @for (sop of availableSops(); track sop.id) {
              <option [value]="sop.id">{{ sop.name }}</option>
            }
          </select>
        </div>

        <!-- Analyst Selector -->
        <div class="md:col-span-2">
          <label class="block text-[9px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Người phân tích</label>
          <select [(ngModel)]="selectedAnalyst"
                  class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition cursor-pointer">
            <option value="all">Tất cả</option>
            @for (analyst of availableAnalysts(); track analyst) {
              <option [value]="analyst">{{ analyst }}</option>
            }
          </select>
        </div>

        <!-- Status Filter -->
        <div class="md:col-span-2">
          <label class="block text-[9px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Trạng thái mẻ</label>
          <select [(ngModel)]="selectedStatus"
                  class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition cursor-pointer">
            <option value="all">Tất cả</option>
            <option value="completed">Đã duyệt (Completed)</option>
            <option value="draft">Đang nháp (Draft)</option>
            <option value="pending">Chờ nhập (Pending)</option>
          </select>
        </div>
      </div>

      <!-- MAIN RESULTS TABLE -->
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        <div class="flex-1 overflow-auto custom-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/75 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 sticky top-0 z-10 backdrop-blur-md">
                <th class="py-3.5 px-5 w-16 text-center">STT</th>
                <th class="py-3.5 px-4 min-w-[200px]">Mã mẻ & SOP</th>
                <th class="py-3.5 px-4 w-44">Thời gian chạy</th>
                <th class="py-3.5 px-4 w-44">Người phân tích</th>
                <th class="py-3.5 px-4 w-36 text-center">Số mẫu thử</th>
                <th class="py-3.5 px-4 w-40 text-center">Trạng thái</th>
                <th class="py-3.5 px-5 w-32 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
              @for (run of displayedRuns(); track run.id; let idx = $index) {
                <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors group">
                  <td class="py-4 px-5 text-center font-mono text-slate-400 font-bold">{{ idx + 1 }}</td>
                  <td class="py-4 px-4">
                    <div class="flex flex-col gap-1">
                      <span class="font-mono font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ run.inputs?.['batchCode'] || run.id }}</span>
                      <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
                        <i class="fa-solid fa-flask text-[9px] text-indigo-500"></i>
                        {{ run.sopName }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-slate-600 dark:text-slate-400 font-mono font-bold">
                    {{ getRunDate(run) ? formatAnalysisDate(getRunDate(run)) : '—' }}
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        {{ (run.user || 'U').charAt(0).toUpperCase() }}
                      </div>
                      <span class="font-bold text-slate-750 dark:text-slate-250">{{ run.user || '—' }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-center font-mono font-black text-slate-700 dark:text-slate-300">
                    {{ run.sampleList?.length || 0 }}
                  </td>
                  <td class="py-4 px-4 text-center">
                    <span [class]="getStatusClass(run.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide border">
                      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                        'bg-emerald-500 animate-pulse': runStatusMap()[run.id] === 'completed',
                        'bg-indigo-500 animate-pulse': runStatusMap()[run.id] === 'draft',
                        'bg-amber-500 animate-pulse': runStatusMap()[run.id] === 'pending' || !runStatusMap()[run.id]
                      }"></span>
                      {{ getStatusText(run.id) }}
                    </span>
                  </td>
                  <td class="py-4 px-5 text-center">
                    <button (click)="viewBatch(run.id)"
                            type="button"
                            class="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/30 text-indigo-650 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/40 rounded-xl text-xs font-black transition duration-150 active:scale-95 flex items-center justify-center gap-1.5 shadow-3xs mx-auto">
                      <i class="fa-solid fa-eye"></i>
                      <span>Xem</span>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-12 text-center">
                    <div class="flex flex-col items-center justify-center gap-2.5 text-slate-400 dark:text-slate-600">
                      <i class="fa-solid fa-clipboard-question text-3xl opacity-60"></i>
                      <span class="text-xs font-bold">Không tìm thấy mẻ chạy nào khớp với điều kiện lọc.</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ResultsDashboardComponent implements OnInit {
  state = inject(StateService);
  router = inject(Router);

  searchText = '';
  selectedSopId = 'all';
  selectedAnalyst = 'all';
  selectedStatus = 'all';

  ngOnInit() {}

  allRuns = computed(() => {
    return this.state.approvedRequests() || [];
  });

  completedCount = computed(() => {
    const statusMap = this.runStatusMap();
    return this.allRuns().filter(r => statusMap[r.id] === 'completed').length;
  });

  draftCount = computed(() => {
    const statusMap = this.runStatusMap();
    return this.allRuns().filter(r => statusMap[r.id] === 'draft').length;
  });

  availableSops = computed(() => {
    const map = new Map<string, string>();
    this.allRuns().forEach(r => {
      if (r.sopId && r.sopName) map.set(r.sopId, r.sopName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  });

  availableAnalysts = computed(() => {
    const set = new Set<string>();
    this.allRuns().forEach(r => {
      if (r.user) set.add(r.user);
    });
    return Array.from(set).sort();
  });

  runStatusMap = computed(() => {
    const statusMap: Record<string, 'pending' | 'draft' | 'completed'> = {};
    this.allRuns().forEach(r => {
      const rootStatus = r.status || 'approved';
      if (rootStatus === 'draft' || rootStatus === 'completed') {
        statusMap[r.id] = rootStatus as 'draft' | 'completed';
      } else {
        statusMap[r.id] = r.analysisResult?.status || 'pending';
      }
    });
    return statusMap;
  });

  displayedRuns = computed(() => {
    let list = this.allRuns();
    const search = this.searchText.trim().toLowerCase();

    // Search filter
    if (search) {
      list = list.filter(r => {
        const batchCode = (r.inputs?.['batchCode'] || r.id || '').toLowerCase();
        const sopName = (r.sopName || '').toLowerCase();
        const user = (r.user || '').toLowerCase();
        const samples = (r.sampleList || []).map((s: string) => s.toLowerCase());
        return batchCode.includes(search) || sopName.includes(search) || user.includes(search) || samples.some((s: string) => s.includes(search));
      });
    }

    // SOP Filter
    if (this.selectedSopId !== 'all') {
      list = list.filter(r => r.sopId === this.selectedSopId);
    }

    // Analyst Filter
    if (this.selectedAnalyst !== 'all') {
      list = list.filter(r => r.user === this.selectedAnalyst);
    }

    // Status Filter
    if (this.selectedStatus !== 'all') {
      const statusMap = this.runStatusMap();
      list = list.filter(r => (statusMap[r.id] || 'pending') === this.selectedStatus);
    }

    return list;
  });

  getRunDate(run: any): string {
    return run.inputs?.['runDate'] || run.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || run.createdAt || '';
  }

  formatAnalysisDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  getStatusText(runId: string): string {
    const status = this.runStatusMap()[runId] || 'pending';
    if (status === 'completed') return 'Đã duyệt';
    if (status === 'draft') return 'Đang nháp';
    return 'Chờ nhập';
  }

  getStatusClass(runId: string): string {
    const status = this.runStatusMap()[runId] || 'pending';
    if (status === 'completed') {
      return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-900/30';
    }
    if (status === 'draft') {
      return 'bg-indigo-50 dark:bg-indigo-955/20 text-indigo-700 dark:text-indigo-400 border-indigo-200/40 dark:border-indigo-900/30';
    }
    return 'bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30';
  }

  viewBatch(runId: string) {
    this.router.navigate(['/results-view', runId]);
  }
}
