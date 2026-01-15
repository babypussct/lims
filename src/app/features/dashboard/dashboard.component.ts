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
import { formatNum, formatDate, getAvatarUrl } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { QrScannerComponent } from '../../shared/components/qr-scanner/qr-scanner.component'; // Import Scanner
import Chart from 'chart.js/auto'; 

interface PriorityStandard {
    name: string;
    daysLeft: number;
    date: string;
    status: 'expired' | 'warning' | 'safe';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, FormsModule, QrScannerComponent], 
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
                    <div class="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1">
                        <i class="fa-solid fa-quote-left text-[10px] text-slate-300 -translate-y-1"></i>
                        <span class="italic text-xs md:text-sm">{{ randomQuote() }}</span>
                    </div>
                </div>
            </div>

            <!-- ACTIONS -->
            <div class="relative z-10 flex gap-3 items-center">
                <!-- SCAN BUTTON -->
                <button (click)="openScanModal()" class="flex flex-col items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-600 transition active:scale-95 group/scan">
                    <i class="fa-solid fa-qrcode text-2xl mb-1 text-slate-700 group-hover/scan:text-blue-600 transition-colors"></i>
                    <span class="text-[9px] font-bold uppercase tracking-wider">Scan</span>
                </button>

                <div class="text-right hidden md:block border-l border-slate-200 pl-4 ml-1">
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

        <!-- SCAN QR MODAL (Refined for Camera) -->
        @if (showScanModal()) {
            <div class="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md fade-in" (click)="closeScanModal()">
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col h-[500px] animate-bounce-in" (click)="$event.stopPropagation()">
                    
                    <!-- Mode Switcher Header -->
                    <div class="flex border-b border-slate-100">
                        <button (click)="scanMode.set('camera')" class="flex-1 py-3 text-xs font-bold uppercase transition" [class]="scanMode() === 'camera' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'">
                            <i class="fa-solid fa-camera mr-1"></i> Camera
                        </button>
                        <button (click)="scanMode.set('manual')" class="flex-1 py-3 text-xs font-bold uppercase transition" [class]="scanMode() === 'manual' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'">
                            <i class="fa-solid fa-keyboard mr-1"></i> Thủ công
                        </button>
                    </div>

                    <!-- CAMERA MODE -->
                    @if (scanMode() === 'camera') {
                        <div class="flex-1 bg-black relative">
                            <app-qr-scanner (scanSuccess)="onCameraScanSuccess($event)" (scanError)="onCameraError($event)"></app-qr-scanner>
                            
                            <button (click)="closeScanModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center z-30">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                    }

                    <!-- MANUAL MODE -->
                    @if (scanMode() === 'manual') {
                        <div class="p-6 flex flex-col justify-center h-full">
                            <div class="text-center mb-6">
                                <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                    <i class="fa-solid fa-keyboard text-3xl"></i>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800">Nhập mã ID</h3>
                                <p class="text-sm text-slate-500 mt-1">Sử dụng cho máy quét cầm tay hoặc nhập phím</p>
                            </div>
                            
                            <input #scanInput 
                                   [ngModel]="scanCode" 
                                   (ngModelChange)="onScanInput($event)"
                                   (keyup.enter)="onScanSubmit()"
                                   class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center font-mono font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition mb-4 uppercase"
                                   placeholder="CODE..."
                                   autofocus>
                            
                            <div class="grid grid-cols-2 gap-3">
                                <button (click)="closeScanModal()" class="py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">Đóng</button>
                                <button (click)="onScanSubmit()" class="py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-md shadow-blue-200">Tra cứu</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        }
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  // ... (Services remain same)
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
  
  // ... (Quotes and Chart variables remain same)
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
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('activityChart');
  chartInstance: any = null;

  // Scan Modal State
  showScanModal = signal(false);
  scanMode = signal<'camera' | 'manual'>('camera');
  scanCode = '';
  scanInputRef = viewChild<ElementRef>('scanInput');
  private scanTimeout: any;

  constructor() {
      this.randomQuote.set(this.quotes[Math.floor(Math.random() * this.quotes.length)]);
      
      effect(() => {
          const reqs = this.state.approvedRequests();
          if (reqs.length >= 0 && !this.isLoading()) {
              setTimeout(() => this.initChart(), 300);
          }
      });
  }

  async ngOnInit() {
      // ... (Same initialization logic)
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

  // ... (Chart and Data processing logic - hidden for brevity as it is unchanged) ...
  async initChart() {
      const canvas = this.chartCanvas()?.nativeElement;
      if (!canvas) return;
      const existingChart = Chart.getChart(canvas);
      if (existingChart) existingChart.destroy();
      if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

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
          type: 'bar',
          data: {
              labels: labels,
              datasets: [
                  { label: 'Số mẫu (Samples)', data: sampleData, backgroundColor: 'rgba(79, 70, 229, 0.8)', borderRadius: 4, order: 2, yAxisID: 'y' },
                  { label: 'Số mẻ (Runs)', data: runData, type: 'line', borderColor: '#f97316', backgroundColor: '#f97316', borderWidth: 2, pointRadius: 4, tension: 0.3, order: 1, yAxisID: 'y1' }
              ]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' } }, scales: { x: { grid: { display: false } }, y: { type: 'linear', display: true, position: 'left', beginAtZero: true }, y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { display: false } } } }
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

  getGreeting(): string { const h = new Date().getHours(); return h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'; }
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

  // --- Scan Modal Logic ---
  openScanModal() {
      this.showScanModal.set(true);
      // Determine mode based on device? For now default to Camera
      this.scanMode.set('camera');
      this.scanCode = '';
  }

  closeScanModal() {
      this.showScanModal.set(false);
  }

  onCameraScanSuccess(result: string) {
      // Auto-navigate logic
      this.scanCode = result;
      this.closeScanModal();
      this.toast.show('Đã quét mã: ' + result, 'success');
      this.router.navigate(['/traceability', result]);
  }

  onCameraError(err: any) {
      // Fallback to manual if camera fails
      this.toast.show('Lỗi Camera. Chuyển sang nhập tay.', 'info');
      this.scanMode.set('manual');
      setTimeout(() => this.scanInputRef()?.nativeElement?.focus(), 100);
  }

  // Manual Mode Handlers
  onScanInput(val: string) {
      this.scanCode = val;
      if (this.scanTimeout) clearTimeout(this.scanTimeout);
      if (val && val.trim().length > 0) {
          this.scanTimeout = setTimeout(() => {
              this.onScanSubmit();
          }, 300);
      }
  }

  onScanSubmit() {
      if (!this.scanCode.trim()) return;
      const code = this.scanCode.trim();
      this.closeScanModal();
      this.router.navigate(['/traceability', code]);
  }
}
