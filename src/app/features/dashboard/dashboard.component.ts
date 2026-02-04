
import { Component, inject, computed, signal, OnInit, viewChild, ElementRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryService } from '../inventory/inventory.service';
import { StandardService } from '../standards/standard.service'; 
import { InventoryItem } from '../../core/models/inventory.model';
import { ReferenceStandard } from '../../core/models/standard.model';
import { ToastService } from '../../core/services/toast.service';
import { QrGlobalService } from '../../core/services/qr-global.service'; // Import Global Service
import { formatNum, formatDate, getAvatarUrl, formatSampleList } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import Chart from 'chart.js/auto'; 

interface PriorityStandard {
    name: string;
    daysLeft: number;
    date: string;
    status: 'expired' | 'warning' | 'safe';
}

interface BatchHistoryItem {
    id: string; // Request ID / Trace ID
    timestamp: any;
    user: string;
    sampleCount: number;
    sampleList: string[]; // Raw list for this batch
    sampleDisplay: string; // Formatted range for this batch
}

interface KanbanColumn {
    sopName: string;
    sopId: string;
    totalSamples: number;
    sampleList: string[]; // Aggregated list
    sampleDisplay: string; // Formatted aggregated list
    users: Set<string>;
    batchCount: number; 
    lastRun: Date; 
    history: BatchHistoryItem[]; // Detailed history for modal
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, FormsModule, DateRangeFilterComponent], 
  template: `
    <div class="pb-20 fade-in font-sans">
        
        <!-- HEADER: Welcome & Scan -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-black text-slate-800 tracking-tight">
                    Xin chào, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{{auth.currentUser()?.displayName}}</span>!
                </h1>
                <p class="text-sm text-slate-500 font-medium mt-1">Hệ thống Quản lý Phòng thí nghiệm (LIMS) sẵn sàng.</p>
            </div>
            
            <div class="flex gap-2">
                <button (click)="router.navigate(['/mobile-login'])" class="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm hover:bg-slate-50 transition flex items-center gap-2 font-bold text-xs uppercase tracking-wide active:scale-95">
                    <i class="fa-solid fa-desktop"></i> Login PC
                </button>

                <!-- Calls Global Service -->
                <button (click)="qrService.startScan()" class="px-5 py-2.5 bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-300 hover:bg-black transition flex items-center gap-2 font-bold text-xs uppercase tracking-wide active:scale-95">
                    <i class="fa-solid fa-qrcode"></i> Quét Mã
                </button>
            </div>
        </div>

        <!-- SECTION 1: KPI CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <!-- Card 1: Pending Requests -->
            <div (click)="auth.canViewSop() ? navTo('requests') : denyAccess()"
                 class="relative bg-white rounded-2xl shadow-soft-xl p-4 flex flex-col justify-between h-32 cursor-pointer transition-transform hover:-translate-y-1 overflow-hidden group border border-transparent hover:border-purple-100">
                <div class="flex justify-between items-start z-10">
                    <div>
                        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Yêu cầu chờ duyệt</p>
                        <h4 class="text-2xl font-black text-gray-800">
                            @if(isLoading()) { ... } @else { {{state.requests().length}} }
                        </h4>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-purple-700 to-pink-500 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-clipboard-list text-lg"></i>
                    </div>
                </div>
                <div class="z-10">
                    <span class="text-xs font-bold" 
                          [class.text-emerald-500]="state.requests().length === 0" 
                          [class.text-fuchsia-500]="state.requests().length > 0">
                        {{state.requests().length > 0 ? '+ Cần xử lý ngay' : 'Đã hoàn thành'}}
                    </span>
                </div>
            </div>

            <!-- Card 2: Low Stock -->
            <div (click)="auth.canViewInventory() ? navTo('inventory') : denyAccess()"
                 class="relative bg-white rounded-2xl shadow-soft-xl p-4 flex flex-col justify-between h-32 cursor-pointer transition-transform hover:-translate-y-1 overflow-hidden group border border-transparent hover:border-red-100">
                <div class="flex justify-between items-start z-10">
                    <div>
                        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Cảnh báo Kho</p>
                        <h4 class="text-2xl font-black text-gray-800">
                            @if(isLoading()) { ... } @else { {{lowStockItems().length}} }
                        </h4>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-red-600 to-rose-400 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-box-open text-lg"></i>
                    </div>
                </div>
                <div class="z-10">
                    @if(lowStockItems().length > 0) {
                        <span class="text-xs font-bold text-red-500">Mục dưới định mức</span>
                    } @else {
                        <span class="text-xs font-bold text-emerald-500">Kho ổn định</span>
                    }
                </div>
            </div>

            <!-- Card 3: Today's Activity -->
            <div (click)="auth.canViewReports() ? navTo('stats') : denyAccess()"
                 class="relative bg-white rounded-2xl shadow-soft-xl p-4 flex flex-col justify-between h-32 cursor-pointer transition-transform hover:-translate-y-1 overflow-hidden group border border-transparent hover:border-blue-100">
                <div class="flex justify-between items-start z-10">
                    <div>
                        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Hoạt động hôm nay</p>
                        <h4 class="text-2xl font-black text-gray-800">
                            @if(isLoading()) { ... } @else { {{todayActivityCount()}} }
                        </h4>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-blue-500 to-cyan-400 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-bolt text-lg"></i>
                    </div>
                </div>
                <div class="z-10">
                    <span class="text-xs font-bold text-gray-400">Ghi nhận log hệ thống</span>
                </div>
            </div>

            <!-- Card 4: Standards Priority -->
            <div (click)="auth.canViewStandards() ? navTo('standards') : denyAccess()"
                 class="relative bg-white rounded-2xl shadow-soft-xl p-4 flex flex-col justify-between h-32 cursor-pointer transition-transform hover:-translate-y-1 overflow-hidden group border border-transparent hover:border-orange-100">
                <div class="flex justify-between items-start z-10">
                    <div class="min-w-0 pr-2">
                        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Chuẩn sắp hết hạn</p>
                        @if(priorityStandard(); as std) {
                            <h4 class="text-sm font-bold text-gray-800 truncate leading-tight mt-1" [title]="std.name">{{std.name}}</h4>
                        } @else {
                            <h4 class="text-lg font-black text-gray-800">An toàn</h4>
                        }
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-orange-500 to-yellow-400 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-clock text-lg"></i>
                    </div>
                </div>
                <div class="z-10">
                    @if(priorityStandard(); as std) {
                        <span class="text-xs font-bold" [class.text-red-500]="std.status === 'expired'" [class.text-orange-500]="std.status === 'warning'">
                            {{std.daysLeft < 0 ? 'Đã hết hạn' : 'Còn ' + std.daysLeft + ' ngày'}}
                        </span>
                    } @else {
                        <span class="text-xs font-bold text-emerald-500">Tất cả còn hạn dùng</span>
                    }
                </div>
            </div>
        </div>

        <!-- SECTION 2: ANALYTICS & FEED -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <!-- Left: Chart (2/3) -->
            <div class="lg:col-span-2 relative bg-white rounded-2xl shadow-soft-xl p-5 overflow-hidden flex flex-col h-[400px] border border-slate-100">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h6 class="font-bold text-gray-700 capitalize text-lg">Hiệu suất Phân tích</h6>
                        <!-- Trend Indicator -->
                        <p class="text-sm font-bold flex items-center gap-1.5"
                           [class.text-emerald-500]="trendInfo().direction === 'up'"
                           [class.text-red-500]="trendInfo().direction === 'down'"
                           [class.text-gray-500]="trendInfo().direction === 'neutral'">
                            <i class="fa-solid" [class]="trendInfo().icon"></i>
                            @if(trendInfo().direction !== 'neutral') {
                                <span>{{trendInfo().percent}}%</span>
                            } @else {
                                <span>Ổn định</span>
                            }
                            <span class="text-gray-400 font-normal text-xs">so với TB tuần trước</span>
                        </p>
                    </div>
                    <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                        <i class="fa-solid fa-chart-column"></i>
                    </div>
                </div>
                <div class="flex-1 relative w-full min-h-0 bg-gradient-to-b from-transparent to-gray-50/30 rounded-xl">
                    @if(isLoading()) {
                        <div class="flex items-center justify-center h-full"><app-skeleton width="100%" height="100%" shape="rect"></app-skeleton></div>
                    } @else {
                        <canvas #activityChart class="w-full h-full"></canvas>
                    }
                </div>
            </div>

            <!-- Right: Activity Feed (1/3) -->
            <div class="bg-white rounded-2xl shadow-soft-xl p-5 overflow-hidden flex flex-col h-[400px] border border-slate-100">
                <h6 class="font-bold text-gray-700 capitalize text-lg mb-4">Hoạt động gần đây</h6>
                <div class="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                    <div class="relative border-l border-gray-200 ml-3 space-y-6 pb-2">
                        @for (log of recentLogs(); track log.id) {
                            <div class="relative pl-6">
                                <div class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                                     [class.bg-fuchsia-500]="log.action.includes('APPROVE')"
                                     [class.bg-blue-500]="log.action.includes('STOCK')"
                                     [class.bg-gray-400]="!log.action.includes('APPROVE') && !log.action.includes('STOCK')">
                                </div>
                                <div class="flex flex-col">
                                    <div class="text-[10px] font-bold text-gray-400 uppercase mb-1">{{getTimeDiff(log.timestamp)}}</div>
                                    <div class="flex items-start gap-3">
                                        <!-- UPDATED AVATAR CALL -->
                                        <img [src]="getAvatarUrl(log.user, state.avatarStyle())" class="w-8 h-8 rounded-lg border border-gray-100 shadow-sm object-cover bg-white shrink-0" alt="Avatar">
                                        <div class="flex-1 min-w-0">
                                            <div class="text-xs font-bold text-gray-700 leading-tight">
                                                <span class="text-gray-900">{{log.user}}</span> 
                                                <span class="font-normal text-[10px] text-gray-500 ml-1 block sm:inline">{{getLogActionText(log.action)}}</span>
                                            </div>
                                            <p class="text-[10px] text-gray-500 mt-1 line-clamp-2 bg-gray-50 p-2 rounded-lg border border-gray-100 font-medium">
                                                {{log.details}}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } @empty {
                            <div class="text-center text-gray-400 text-sm py-10">Chưa có dữ liệu.</div>
                        }
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION 3: SMART KANBAN -->
        <div class="mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
                <h6 class="font-bold text-slate-700 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-layer-group text-blue-500"></i> Hiệu suất Phân tích (Hoàn thành)
                </h6>
                
                <!-- Date Filter Component -->
                <app-date-range-filter 
                    [initStart]="startDate()" 
                    [initEnd]="endDate()" 
                    (dateChange)="onDateRangeChange($event)">
                </app-date-range-filter>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                
                @for (col of kanbanBoard(); track col.sopName) {
                    <div (click)="openSopDetails(col)" 
                         class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col cursor-pointer hover:-translate-y-1 transition-all hover:shadow-md group relative overflow-hidden h-full">
                        
                        <!-- Header -->
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex-1 min-w-0 pr-2">
                                <span class="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-indigo-100 mb-1 inline-block">
                                    {{col.batchCount}} mẻ
                                </span>
                                <h4 class="font-bold text-slate-800 text-sm leading-snug line-clamp-2" [title]="col.sopName">
                                    {{col.sopName}}
                                </h4>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-clipboard-check"></i>
                            </div>
                        </div>

                        <!-- Sample List (Grouped Text) -->
                        <div class="flex-1 bg-slate-50/50 rounded-xl p-3 mb-3 border border-slate-50">
                            <div class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Mẫu đã xử lý:</div>
                            <p class="text-xs font-mono font-bold text-slate-700 break-words leading-relaxed line-clamp-3">
                                {{ col.sampleDisplay }}
                            </p>
                        </div>

                        <!-- Footer Info -->
                        <div class="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                            <div class="flex -space-x-2 overflow-hidden">
                                <!-- UPDATED AVATAR CALL -->
                                @for(user of col.users; track user) {
                                    <img [src]="getAvatarUrl(user, state.avatarStyle())" class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200" [title]="user">
                                }
                            </div>
                            
                            <div class="text-right">
                                <span class="block text-[9px] font-bold text-slate-400 uppercase">Lần cuối: {{formatDateShort(col.lastRun)}}</span>
                                <span class="text-xs font-bold text-slate-700">Tổng: <b class="text-lg text-indigo-600">{{col.totalSamples}}</b> mẫu</span>
                            </div>
                        </div>
                    </div>
                } 
                @empty {
                    @if(!isLoading()) {
                        <div class="col-span-full py-10 flex items-center justify-center text-slate-400 italic text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            Không có dữ liệu hiệu suất trong khoảng thời gian này.
                        </div>
                    }
                }
            </div>
        </div>

        <!-- DETAIL MODAL -->
        @if (selectedSopDetails(); as details) {
            <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in" (click)="selectedSopDetails.set(null)">
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-bounce-in" (click)="$event.stopPropagation()">
                    
                    <!-- Modal Header -->
                    <div class="bg-slate-50 border-b border-slate-100 p-5 shrink-0 flex justify-between items-start">
                        <div>
                            <span class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Chi tiết Hiệu suất</span>
                            <h3 class="text-xl font-black text-slate-800 leading-tight mt-1">{{details.sopName}}</h3>
                            <div class="flex gap-2 mt-2">
                                <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200">
                                    {{details.totalSamples}} mẫu
                                </span>
                                <span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-200">
                                    {{details.batchCount}} mẻ
                                </span>
                            </div>
                        </div>
                        <button (click)="selectedSopDetails.set(null)" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition shadow-sm active:scale-90">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>

                    <!-- Modal Body: History List -->
                    <div class="flex-1 overflow-y-auto custom-scrollbar p-0">
                        @for (batch of details.history; track batch.id) {
                            <div class="p-4 border-b border-slate-50 hover:bg-slate-50 transition group">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex items-center gap-2">
                                        <!-- UPDATED AVATAR CALL -->
                                        <img [src]="getAvatarUrl(batch.user, state.avatarStyle())" class="w-6 h-6 rounded-full border border-slate-200">
                                        <span class="text-xs font-bold text-slate-700">{{batch.user}}</span>
                                    </div>
                                    <span class="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 rounded">{{formatDateShort(batch.timestamp)}}</span>
                                </div>
                                
                                <div class="pl-8">
                                    <div class="text-sm font-bold text-slate-800 mb-1">
                                        <span class="text-indigo-600">{{batch.sampleCount}} mẫu</span>
                                    </div>
                                    <div class="text-xs font-mono text-slate-500 bg-slate-50/50 p-2 rounded-lg border border-slate-100 break-words">
                                        {{batch.sampleDisplay}}
                                    </div>
                                    <div class="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button (click)="navTo('traceability/' + batch.id)" class="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 hover:text-blue-600 font-bold shadow-sm transition">
                                            <i class="fa-solid fa-qrcode mr-1"></i> Truy xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <!-- Modal Footer -->
                    <div class="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
                        <button (click)="createBatchForSop(details.sopId)" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition active:scale-95 flex items-center justify-center gap-2">
                            <i class="fa-solid fa-plus"></i> Tạo Mẻ Mới Ngay
                        </button>
                    </div>
                </div>
            </div>
        }
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  invService = inject(InventoryService); 
  stdService = inject(StandardService);
  auth = inject(AuthService); 
  router: Router = inject(Router);
  toast = inject(ToastService);
  qrService = inject(QrGlobalService); // Injected Global Service

  formatNum = formatNum;
  getAvatarUrl = getAvatarUrl;
  formatSampleList = formatSampleList;
  
  isLoading = signal(true);
  lowStockItems = signal<InventoryItem[]>([]); 
  priorityStandard = signal<PriorityStandard | null>(null);
  
  // Date Filters
  startDate = signal<string>(this.getToday());
  endDate = signal<string>(this.getToday());

  // Modal State
  selectedSopDetails = signal<KanbanColumn | null>(null);

  // LIVE DATA COMPUTED
  recentLogs = computed(() => this.state.logs().slice(0, 6)); 
  todayActivityCount = computed(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      return this.state.logs().filter(l => {
          const d = l.timestamp?.toDate ? l.timestamp.toDate() : new Date(l.timestamp);
          return d.toISOString().split('T')[0] === todayStr;
      }).length;
  });

  // TREND INDICATOR (Revised Logic: Weekly Daily Average)
  trendInfo = computed(() => {
      const history = this.state.approvedRequests();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // 1. Determine Date Ranges
      // Get Monday of current week
      const dayOfWeek = today.getDay(); // 0 (Sun) -> 6 (Sat)
      // Calculate Monday of this week. If Sunday(0), subtract 6. Else subtract day-1.
      const diffToMon = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      
      const startThisWeek = new Date(today);
      startThisWeek.setDate(diffToMon);
      startThisWeek.setHours(0,0,0,0);

      // Last week Monday = This week Monday - 7 days
      const startLastWeek = new Date(startThisWeek);
      startLastWeek.setDate(startLastWeek.getDate() - 7);

      // Last week Sunday = This week Monday - 1 day
      const endLastWeek = new Date(startThisWeek);
      endLastWeek.setDate(endLastWeek.getDate() - 1);
      endLastWeek.setHours(23,59,59,999);

      // 2. Accumulate Data
      let thisWeekTotal = 0;
      let lastWeekTotal = 0;

      const tStartThis = startThisWeek.getTime();
      const tStartLast = startLastWeek.getTime();
      const tEndLast = endLastWeek.getTime();

      history.forEach(req => {
          let timestamp = 0;
          if (req.analysisDate) {
              const parts = req.analysisDate.split('-'); 
              if (parts.length === 3) {
                  timestamp = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2])).getTime();
              }
          } 
          
          if (!timestamp) {
              const ts = req.approvedAt || req.timestamp;
              const d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
              timestamp = d.getTime();
          }

          if (timestamp >= tStartThis) {
              let count = 0;
              if (req.sampleList && req.sampleList.length > 0) count = req.sampleList.length;
              else if (req.inputs?.['n_sample']) count = Number(req.inputs['n_sample']);
              else count = 1;
              thisWeekTotal += count;
          } else if (timestamp >= tStartLast && timestamp <= tEndLast) {
              let count = 0;
              if (req.sampleList && req.sampleList.length > 0) count = req.sampleList.length;
              else if (req.inputs?.['n_sample']) count = Number(req.inputs['n_sample']);
              else count = 1;
              lastWeekTotal += count;
          }
      });

      // 3. Calculate Averages
      // Days passed this week (including today). 
      // If Today is Monday, diff is 0 days, so daysPassed = 1.
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysPassed = Math.floor((now.getTime() - startThisWeek.getTime()) / msPerDay) + 1;
      const validDaysPassed = Math.max(1, daysPassed); // Prevent divide by zero/negative if system time is off

      const avgThisWeek = thisWeekTotal / validDaysPassed;
      const avgLastWeek = lastWeekTotal / 7; // Last week is always 7 days

      // 4. Calculate Trend
      let percent = 0;
      let direction: 'up' | 'down' | 'neutral' = 'neutral';
      let icon = 'fa-minus';

      if (avgLastWeek > 0) {
          const diff = avgThisWeek - avgLastWeek;
          percent = Math.round((Math.abs(diff) / avgLastWeek) * 100);
          
          if (diff > 0.1) { // Threshold for floating point
              direction = 'up'; icon = 'fa-arrow-up'; 
          } else if (diff < -0.1) { 
              direction = 'down'; icon = 'fa-arrow-down'; 
          }
      } else if (avgThisWeek > 0) {
          percent = 100; direction = 'up'; icon = 'fa-arrow-up';
      }

      return { percent, direction, icon };
  });

  // KANBAN COMPUTED
  kanbanBoard = computed<KanbanColumn[]>(() => {
      const approvedReqs = this.state.approvedRequests();
      const groups = new Map<string, KanbanColumn>();
      
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);

      approvedReqs.forEach(req => {
          let d: Date;
          if (req.analysisDate) {
              const parts = req.analysisDate.split('-');
              d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
          } else {
              const ts = req.approvedAt || req.timestamp;
              d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
          }
          
          if (d < start || d > end) return;

          const key = req.sopName;
          
          if (!groups.has(key)) {
              groups.set(key, {
                  sopName: req.sopName,
                  sopId: req.sopId,
                  totalSamples: 0,
                  sampleList: [],
                  sampleDisplay: '',
                  users: new Set<string>(), 
                  batchCount: 0,
                  lastRun: d,
                  history: []
              });
          }

          const col = groups.get(key)!;
          col.batchCount++;
          if (req.user) col.users.add(req.user);
          if (d > col.lastRun) col.lastRun = d; 
          
          let currentBatchSamples: string[] = [];
          if (req.sampleList && req.sampleList.length > 0) {
              currentBatchSamples = req.sampleList;
              col.sampleList.push(...req.sampleList);
              col.totalSamples += req.sampleList.length;
          } else {
              const nSample = req.inputs?.['n_sample'] || 1;
              col.totalSamples += Number(nSample);
              currentBatchSamples = [`Batch #${req.id.substring(0,4)}`];
              col.sampleList.push(...currentBatchSamples);
          }

          col.history.push({
              id: req.id,
              timestamp: d,
              user: req.user || 'Unknown',
              sampleCount: currentBatchSamples.length,
              sampleList: currentBatchSamples,
              sampleDisplay: this.formatSampleList(currentBatchSamples)
          });
      });

      const result = Array.from(groups.values()).map(col => {
          col.sampleList.sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));
          col.sampleDisplay = this.formatSampleList(col.sampleList);
          col.history.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
          return col;
      });
      
      return result.sort((a, b) => b.lastRun.getTime() - a.lastRun.getTime()); 
  });

  today = new Date();
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('activityChart');
  chartInstance: any = null;

  constructor() {
      effect(() => {
          const reqs = this.state.approvedRequests();
          if (reqs.length >= 0 && !this.isLoading()) {
              setTimeout(() => this.initChart(), 300);
          }
      });
  }

  async ngOnInit() {
      this.isLoading.set(true);
      try {
          const [lowStock, nearestStd] = await Promise.all([
              this.invService.getLowStockItems(5),
              this.stdService.getNearestExpiry()
          ]);
          this.lowStockItems.set(lowStock);
          this.processPriorityStandard(nearestStd);
      } catch(e) {
          console.error("Dashboard fetch error", e);
      } finally {
          this.isLoading.set(false);
      }
  }

  ngOnDestroy(): void {
      if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
      }
  }

  private getToday(): string { return new Date().toISOString().split('T')[0]; }

  onDateRangeChange(range: { start: string, end: string, label: string }) {
      this.startDate.set(range.start);
      this.endDate.set(range.end);
  }

  formatDateShort(date: Date): string {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + 
             date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  openSopDetails(col: KanbanColumn) {
      this.selectedSopDetails.set(col);
  }

  createBatchForSop(sopId: string) {
      const sop = this.state.sops().find(s => s.id === sopId);
      if (sop) {
          this.state.selectedSop.set(sop);
          this.router.navigate(['/calculator']);
      } else {
          this.toast.show('Không tìm thấy quy trình gốc.', 'error');
      }
  }

  async initChart() {
      const canvas = this.chartCanvas()?.nativeElement;
      if (!canvas) return;
      const existingChart = Chart.getChart(canvas);
      if (existingChart) existingChart.destroy();
      if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(203, 12, 159, 0.2)'); 
      gradient.addColorStop(1, 'rgba(203, 12, 159, 0)');

      const days = 7;
      const labels = [];
      const sampleData = new Array(days).fill(0);
      const runData = new Array(days).fill(0);
      const now = new Date(); now.setHours(0,0,0,0);
      const dateMap = new Map<string, number>();
      
      for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now); d.setDate(d.getDate() - i);
          const key = `${d.getDate()}/${d.getMonth() + 1}`;
          labels.push(key); dateMap.set(key, days - 1 - i);
      }

      const history = this.state.approvedRequests();
      history.forEach(req => {
          let key = '';
          if (req.analysisDate) {
              const parts = req.analysisDate.split('-');
              if (parts.length === 3) key = `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}`;
          }
          if (!key) {
              const ts = req.approvedAt || req.timestamp;
              if (ts) { const d = (ts as any).toDate ? (ts as any).toDate() : new Date(ts); key = `${d.getDate()}/${d.getMonth() + 1}`; }
          }
          const idx = dateMap.get(key);
          if (idx !== undefined) {
              runData[idx]++;
              let samples = 0;
              if (req.inputs) { if (req.inputs['n_sample']) samples = Number(req.inputs['n_sample']); else if (req.inputs['sample_count']) samples = Number(req.inputs['sample_count']); }
              sampleData[idx] += (samples || 0); 
          }
      });

      this.chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: [
                  { 
                      label: 'Số mẫu (Samples)', data: sampleData, backgroundColor: gradient, borderColor: '#cb0c9f', borderWidth: 3, 
                      pointRadius: 4, pointBackgroundColor: '#cb0c9f', pointBorderColor: '#fff', pointHoverRadius: 6, fill: true, tension: 0.4, yAxisID: 'y'
                  },
                  { 
                      label: 'Số mẻ (Batches)', data: runData, type: 'bar', backgroundColor: '#3a416f', borderRadius: 4, barThickness: 10, order: 1, yAxisID: 'y1' 
                  }
              ]
          },
          options: { 
              responsive: true, maintainAspectRatio: false, 
              plugins: { legend: { display: false }, tooltip: { backgroundColor: '#fff', titleColor: '#1e293b', bodyColor: '#1e293b', borderColor: '#e2e8f0', borderWidth: 1, padding: 10, displayColors: true, usePointStyle: true } }, 
              interaction: { mode: 'index', intersect: false },
              scales: { 
                  x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10, family: "'Open Sans', sans-serif" }, color: '#94a3b8' } }, 
                  y: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { tickBorderDash: [5, 5], color: '#f1f5f9' }, border: { display: false }, ticks: { font: { size: 10, family: "'Open Sans', sans-serif" }, color: '#94a3b8', maxTicksLimit: 5 } }, 
                  y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { display: false }, border: { display: false }, ticks: { display: false } } 
              } 
          }
      });
  }

  processPriorityStandard(std: ReferenceStandard | null) {
      if (!std || !std.expiry_date) { this.priorityStandard.set(null); return; }
      const expiry = new Date(std.expiry_date); const today = new Date();
      const diffMs = expiry.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      let status: 'expired' | 'warning' | 'safe';
      if (daysLeft < 0) status = 'expired'; else if (daysLeft < 60) status = 'warning'; else status = 'safe';
      this.priorityStandard.set({ name: std.name, daysLeft, date: std.expiry_date, status });
  }

  navTo(path: string) { this.router.navigate(['/' + path]); }
  denyAccess() { this.toast.show('Bạn không có quyền truy cập chức năng này!', 'error'); }

  getTimeDiff(timestamp: any): string {
      if (!timestamp) return '';
      const date = (timestamp as any).toDate ? (timestamp as any).toDate() : new Date(timestamp);
      const now = new Date(); const diffMs = now.getTime() - date.getTime(); const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Vừa xong'; if (diffMins < 60) return `${diffMins} phút trước`;
      const diffHours = Math.floor(diffMins / 60); if (diffHours < 24) return `${diffHours} giờ trước`;
      return `${Math.floor(diffHours / 24)} ngày trước`;
  }
  
  getLogActionText(action: string): string {
      if (action.includes('APPROVE')) return 'đã duyệt yêu cầu'; if (action.includes('STOCK_IN')) return 'đã nhập kho';
      if (action.includes('STOCK_OUT')) return 'đã xuất kho'; if (action.includes('CREATE')) return 'đã tạo mới';
      if (action.includes('DELETE')) return 'đã xóa'; return 'đã cập nhật';
  }
}
