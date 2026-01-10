
import { Component, inject, computed, signal, OnInit, viewChild, ElementRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryService } from '../inventory/inventory.service';
import { StandardService } from '../standards/standard.service'; 
import { InventoryItem } from '../../core/models/inventory.model';
import { ReferenceStandard } from '../../core/models/standard.model';
import { ToastService } from '../../core/services/toast.service';
import { formatNum, formatDate, getAvatarUrl } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

interface PriorityStandard {
    name: string;
    daysLeft: number;
    date: string;
    status: 'expired' | 'warning' | 'safe';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="space-y-6 fade-in pb-10">
        
        <!-- 0. WELCOME HEADER -->
        <div class="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
            <!-- Decorative Background -->
            <div class="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none"></div>
            
            <div class="relative z-10 flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-200 shrink-0 transform group-hover:scale-105 transition-transform duration-500">
                    <img [src]="getAvatarUrl(state.currentUser()?.displayName)" class="w-full h-full rounded-[14px] bg-white object-cover border-2 border-white">
                </div>
                <div class="flex-1">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">{{getGreeting()}},</p>
                    
                    @if (state.currentUser()?.displayName) {
                        <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">
                            {{state.currentUser()?.displayName}}
                        </h1>
                    } @else {
                        <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">...</h1>
                    }
                    
                    <!-- Dynamic Quote / Status -->
                    <div class="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1">
                        <i class="fa-solid fa-quote-left text-[10px] text-slate-300 -translate-y-1"></i>
                        <span class="italic text-xs md:text-sm">{{ randomQuote() }}</span>
                    </div>
                </div>
            </div>

            <div class="relative z-10 flex gap-3">
                <div class="text-right hidden md:block">
                    <div class="text-xs font-bold text-slate-400 uppercase">Hôm nay</div>
                    <div class="text-lg font-black text-slate-700">{{today | date:'dd/MM/yyyy'}}</div>
                </div>
            </div>
        </div>

        <!-- 1. Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <!-- Pending Requests -->
            <div (click)="auth.canViewSop() ? navTo('requests') : denyAccess()" 
                 class="relative flex flex-col bg-white rounded-2xl shadow-soft-xl overflow-hidden transition-all duration-300 group border border-slate-100 h-32 justify-center cursor-pointer hover:-translate-y-1 active:scale-95">
                <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i class="fa-solid fa-clock text-6xl text-blue-600 transform rotate-12"></i>
                </div>
                <div class="p-5 flex items-center justify-between relative z-10">
                    <div class="w-full">
                        <p class="mb-1 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider">Yêu cầu Chờ duyệt</p>
                        @if (isLoading()) { <app-skeleton width="60%" height="28px" class="mt-1 block"></app-skeleton> } 
                        @else {
                           <h5 class="mb-0 font-black text-slate-700 text-3xl mt-1 tracking-tight">{{state.requests().length}}</h5>
                           @if(state.requests().length > 0) {
                               <span class="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md mt-2 inline-block">Cần xử lý</span>
                           } @else {
                               <span class="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md mt-2 inline-block">Đã hoàn thành</span>
                           }
                        }
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tl from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0 ml-4 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-clipboard-check text-lg"></i>
                    </div>
                </div>
            </div>

            <!-- Low Stock Alert -->
            <div (click)="auth.canViewInventory() ? navTo('inventory') : denyAccess()" 
                 class="relative flex flex-col bg-white rounded-2xl shadow-soft-xl overflow-hidden transition-all duration-300 group border border-slate-100 h-32 justify-center cursor-pointer hover:-translate-y-1 active:scale-95">
                <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i class="fa-solid fa-triangle-exclamation text-6xl text-red-600 transform -rotate-12"></i>
                </div>
                <div class="p-5 flex items-center justify-between relative z-10">
                    <div class="w-full">
                        <p class="mb-1 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider">Cảnh báo Kho</p>
                        @if (isLoading()) { <app-skeleton width="60%" height="28px" class="mt-1 block"></app-skeleton> } 
                        @else {
                           <h5 class="mb-0 font-black text-slate-700 text-3xl mt-1 tracking-tight">{{lowStockItems().length}}</h5>
                           @if(lowStockItems().length > 0) {
                                <span class="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md mt-2 inline-block animate-pulse">Sắp hết hàng</span>
                           } @else {
                                <span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md mt-2 inline-block">Ổn định</span>
                           }
                        }
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tl from-red-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0 ml-4 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-boxes-stacked text-lg"></i>
                    </div>
                </div>
            </div>

            <!-- Total SOPs -->
            <div (click)="auth.canViewSop() ? navTo('calculator') : denyAccess()" 
                 class="relative flex flex-col bg-white rounded-2xl shadow-soft-xl overflow-hidden transition-all duration-300 group border border-slate-100 h-32 justify-center cursor-pointer hover:-translate-y-1 active:scale-95">
                <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i class="fa-solid fa-flask text-6xl text-purple-600 transform rotate-6"></i>
                </div>
                <div class="p-5 flex items-center justify-between relative z-10">
                    <div class="w-full">
                        <p class="mb-1 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider">Quy trình (SOP)</p>
                        @if (isLoading()) { <app-skeleton width="60%" height="28px" class="mt-1 block"></app-skeleton> } 
                        @else {
                           <h5 class="mb-0 font-black text-slate-700 text-3xl mt-1 tracking-tight">{{state.sops().length}}</h5>
                           <span class="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-md mt-2 inline-block">Đang kích hoạt</span>
                        }
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tl from-purple-700 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 shrink-0 ml-4 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-list-check text-lg"></i>
                    </div>
                </div>
            </div>

            <!-- Standards Priority -->
            <div (click)="auth.canViewStandards() ? navTo('standards') : denyAccess()" 
                 class="relative flex flex-col bg-white rounded-2xl shadow-soft-xl overflow-hidden transition-all duration-300 group border border-slate-100 h-32 justify-center cursor-pointer hover:-translate-y-1 active:scale-95"
                 [class.border-red-200]="priorityStandard()?.status === 'expired'"
                 [class.border-orange-200]="priorityStandard()?.status === 'warning'">
                <div class="p-5 flex items-center justify-between">
                    <div class="w-full min-w-0 pr-2">
                        @if (isLoading()) {
                           <app-skeleton width="50%" height="12px" class="mb-2 block"></app-skeleton>
                           <app-skeleton width="70%" height="24px" class="block"></app-skeleton>
                        } @else {
                           @if (priorityStandard(); as std) {
                               <p class="mb-1 font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                                  [class.text-red-500]="std.status === 'expired'"
                                  [class.text-orange-500]="std.status === 'warning'"
                                  [class.text-slate-400]="std.status === 'safe'">
                                   {{std.status === 'expired' ? 'Hết hạn SD:' : std.status === 'warning' ? 'Sắp hết hạn:' : 'Chuẩn Đối Chiếu'}}
                               </p>
                               <div class="mt-0">
                                   <div class="font-bold text-slate-800 text-sm truncate" [title]="std.name">{{std.name}}</div>
                                   @if(std.status !== 'safe') {
                                       <div class="text-xs font-black mt-1" [class.text-red-500]="std.status === 'expired'" [class.text-orange-500]="std.status === 'warning'">
                                            {{std.date | date:'dd/MM/yyyy'}} ({{std.daysLeft}} ngày)
                                       </div>
                                   } @else {
                                       <span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md mt-2 inline-block">Kho chuẩn an toàn</span>
                                   }
                               </div>
                           } @else {
                               <p class="mb-1 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider">Chuẩn Đối Chiếu</p>
                               <h5 class="mb-0 font-bold text-slate-700 text-sm mt-1">Chưa có dữ liệu</h5>
                           }
                        }
                    </div>
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform"
                         [ngClass]="priorityStandard()?.status === 'expired' ? 'bg-gradient-to-tl from-red-600 to-rose-400 shadow-red-200' : 
                                    priorityStandard()?.status === 'warning' ? 'bg-gradient-to-tl from-orange-500 to-yellow-400 shadow-orange-200' : 
                                    'bg-gradient-to-tl from-emerald-500 to-teal-400 shadow-emerald-200'">
                        @if(priorityStandard()?.status === 'expired') { <i class="fa-solid fa-triangle-exclamation text-lg"></i> }
                        @else if(priorityStandard()?.status === 'warning') { <i class="fa-solid fa-clock text-lg"></i> }
                        @else { <i class="fa-solid fa-shield-halved text-lg"></i> }
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Left Column (2/3): PERFORMANCE CHART -->
            <div class="lg:col-span-2">
                <div class="relative bg-white rounded-3xl p-6 shadow-soft-xl overflow-hidden group border border-slate-100 flex flex-col h-[540px]">
                    <div class="relative z-10 flex justify-between items-start mb-6 shrink-0">
                        <div>
                            <h2 class="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <i class="fa-solid fa-chart-line text-indigo-500"></i> Hiệu suất Phân tích
                            </h2>
                            <p class="text-xs text-slate-400 font-medium">Số mẫu (Sample) & Số mẻ (Batch) trong 7 ngày qua</p>
                        </div>
                    </div>

                    <!-- Chart Area -->
                    <div class="flex-1 relative w-full min-h-0">
                        @if(isLoading()) {
                            <div class="flex items-center justify-center h-full"><app-skeleton width="100%" height="100%" shape="rect"></app-skeleton></div>
                        } @else {
                            <canvas #activityChart class="w-full h-full"></canvas>
                        }
                    </div>
                </div>
            </div>

            <!-- Right Column (1/3): Activity Feed -->
            <div class="bg-white rounded-3xl shadow-soft-xl overflow-hidden border border-slate-100 flex flex-col h-[540px]">
                <div class="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-bolt text-yellow-500"></i> Hoạt động gần đây
                    </h3>
                    <button (click)="navTo('stats')" class="text-[10px] font-bold text-blue-600 hover:underline bg-white px-2 py-1 rounded border border-slate-200">Xem tất cả</button>
                </div>
                
                <div class="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                    @if (isLoading()) {
                        @for(i of [1,2,3,4]; track i) {
                            <div class="flex gap-4">
                                <app-skeleton width="32px" height="32px" shape="circle"></app-skeleton>
                                <div class="flex-1 space-y-2">
                                    <app-skeleton width="90%" height="14px"></app-skeleton>
                                    <app-skeleton width="40%" height="10px"></app-skeleton>
                                </div>
                            </div>
                        }
                    } @else {
                        @for (log of recentLogs(); track log.id; let last = $last) {
                            <div class="relative flex gap-4 group">
                                @if(!last) { <div class="absolute left-4 top-10 bottom-[-24px] w-[2px] bg-slate-100 group-hover:bg-slate-200 transition-colors"></div> }
                                <div class="relative z-10 shrink-0">
                                    <img [src]="getAvatarUrl(log.user)" class="w-8 h-8 rounded-full bg-white border-2 border-white shadow-md object-cover" [title]="log.user">
                                    <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white shadow-sm"
                                         [class.bg-blue-500]="log.action.includes('APPROVE')"
                                         [class.bg-emerald-500]="log.action.includes('STOCK_IN')"
                                         [class.bg-orange-500]="log.action.includes('STOCK_OUT')"
                                         [class.bg-slate-400]="!log.action.includes('APPROVE') && !log.action.includes('STOCK')">
                                        @if(log.action.includes('APPROVE')) { <i class="fa-solid fa-check"></i> }
                                        @else if(log.action.includes('STOCK')) { <i class="fa-solid fa-box"></i> }
                                        @else { <i class="fa-solid fa-info"></i> }
                                    </div>
                                </div>
                                <div class="flex-1 pb-1">
                                    <div class="text-xs text-slate-800 font-bold leading-tight">
                                        <span class="text-blue-600">{{log.user}}</span>
                                        <span class="font-normal text-slate-600"> {{getLogActionText(log.action)}}</span>
                                    </div>
                                    <div class="text-[11px] text-slate-500 mt-0.5 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1.5">
                                        {{log.details}}
                                    </div>
                                    <div class="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                                        <i class="fa-regular fa-clock"></i> {{getTimeDiff(log.timestamp)}}
                                    </div>
                                </div>
                            </div>
                        } @empty {
                            <div class="text-center text-slate-400 text-xs italic py-10">Chưa có hoạt động nào.</div>
                        }
                    }
                </div>
            </div>
        </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  invService = inject(InventoryService); 
  stdService = inject(StandardService);
  auth = inject(AuthService); 
  router: Router = inject(Router);
  toast = inject(ToastService);
  formatNum = formatNum;
  getAvatarUrl = getAvatarUrl;
  
  isLoading = signal(true);
  lowStockItems = signal<InventoryItem[]>([]); 
  
  priorityStandard = signal<PriorityStandard | null>(null);
  recentLogs = computed(() => this.state.logs().slice(0, 8)); 
  today = new Date();
  
  // Motivational Quotes
  quotes = [
      "Chất lượng không phải là một hành động, nó là một thói quen. (Aristotle)",
      "Sự cẩn thận là người bạn tốt nhất của nhà hóa học.",
      "Một thí nghiệm thành công bắt đầu từ sự chuẩn bị kỹ lưỡng.",
      "Khoa học là cách chúng ta hiểu thế giới.",
      "An toàn phòng thí nghiệm là ưu tiên số một.",
      "Ghi chép tỉ mỉ là chìa khóa của sự chính xác.",
      "Sáng tạo bắt đầu từ sự tò mò.",
      "Đừng sợ thất bại, đó là bước đệm của thành công."
  ];
  randomQuote = signal(this.quotes[0]);

  // Chart
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('activityChart');
  chartInstance: any = null;

  constructor() {
      this.randomQuote.set(this.quotes[Math.floor(Math.random() * this.quotes.length)]);
      
      // Re-trigger chart on data load
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

  async initChart() {
      const canvas = this.chartCanvas()?.nativeElement;
      if (!canvas) return;

      const { default: Chart } = await import('chart.js/auto');

      // --- CRITICAL FIX: Destroy existing chart on this canvas ---
      const existingChart = Chart.getChart(canvas);
      if (existingChart) existingChart.destroy();
      
      if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
      }
      // -----------------------------------------------------------

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Prepare 7-day Data Buckets
      const days = 7;
      const labels = [];
      const sampleData = new Array(days).fill(0);
      const runData = new Array(days).fill(0);
      
      const now = new Date();
      now.setHours(0,0,0,0);

      // Initialize Map for O(1) lookup
      const dateMap = new Map<string, number>(); // "DD/MM" -> index
      
      for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = `${d.getDate()}/${d.getMonth() + 1}`;
          labels.push(key);
          dateMap.set(key, days - 1 - i);
      }

      // 2. Aggregate Data from Approved Requests
      const history = this.state.approvedRequests();
      
      history.forEach(req => {
          const ts = req.approvedAt || req.timestamp;
          if (!ts) return;
          
          const d = (ts as any).toDate ? (ts as any).toDate() : new Date(ts);
          const key = `${d.getDate()}/${d.getMonth() + 1}`;
          
          const idx = dateMap.get(key);
          if (idx !== undefined) {
              // Count Runs (Batches)
              runData[idx]++;
              
              // Count Samples
              let samples = 0;
              if (req.inputs) {
                  if (req.inputs['n_sample']) samples = Number(req.inputs['n_sample']);
                  else if (req.inputs['sample_count']) samples = Number(req.inputs['sample_count']);
              }
              sampleData[idx] += (samples || 0); 
          }
      });

      // 3. Render Mixed Chart
      this.chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: [
                  {
                      label: 'Số mẫu (Samples)',
                      data: sampleData,
                      backgroundColor: 'rgba(79, 70, 229, 0.8)', // Indigo
                      borderRadius: 4,
                      order: 2,
                      yAxisID: 'y'
                  },
                  {
                      label: 'Số mẻ (Runs)',
                      data: runData,
                      type: 'line',
                      borderColor: '#f97316', // Orange
                      backgroundColor: '#f97316',
                      borderWidth: 2,
                      pointRadius: 4,
                      pointBackgroundColor: '#fff',
                      pointBorderColor: '#f97316',
                      tension: 0.3,
                      order: 1,
                      yAxisID: 'y1'
                  }
              ]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10, weight: 'bold' } } } },
              scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' }, color: '#94a3b8' } },
                  y: { 
                      type: 'linear', display: true, position: 'left', beginAtZero: true,
                      grid: { color: '#f1f5f9' },
                      title: { display: false, text: 'Mẫu' },
                      ticks: { stepSize: 5 }
                  },
                  y1: {
                      type: 'linear', display: true, position: 'right', beginAtZero: true,
                      grid: { display: false },
                      title: { display: false, text: 'Mẻ' },
                      ticks: { stepSize: 1, color: '#f97316' }
                  }
              },
              interaction: { intersect: false, mode: 'index' },
          }
      });
  }

  processPriorityStandard(std: ReferenceStandard | null) {
      if (!std || !std.expiry_date) {
          this.priorityStandard.set(null);
          return;
      }
      const expiry = new Date(std.expiry_date);
      const today = new Date();
      const diffMs = expiry.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      let status: 'expired' | 'warning' | 'safe';
      if (daysLeft < 0) status = 'expired';
      else if (daysLeft < 60) status = 'warning';
      else status = 'safe';
      this.priorityStandard.set({ name: std.name, daysLeft, date: std.expiry_date, status });
  }

  navTo(path: string) { this.router.navigate(['/' + path]); }
  denyAccess() { this.toast.show('Bạn không có quyền truy cập chức năng này!', 'error'); }

  getGreeting(): string {
      const h = new Date().getHours();
      if (h < 12) return 'Chào buổi sáng';
      if (h < 18) return 'Chào buổi chiều';
      return 'Chào buổi tối';
  }

  getTimeDiff(timestamp: any): string {
      if (!timestamp) return '';
      const date = (timestamp as any).toDate ? (timestamp as any).toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} giờ trước`;
      return `${Math.floor(diffHours / 24)} ngày trước`;
  }

  getLogActionText(action: string): string {
      if (action.includes('APPROVE')) return 'đã duyệt yêu cầu';
      if (action.includes('STOCK_IN')) return 'đã nhập kho';
      if (action.includes('STOCK_OUT')) return 'đã xuất kho';
      if (action.includes('CREATE')) return 'đã tạo mới';
      if (action.includes('DELETE')) return 'đã xóa';
      return 'đã cập nhật';
  }
}
