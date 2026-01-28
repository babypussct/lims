
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
import { QrScannerComponent } from '../../shared/components/qr-scanner/qr-scanner.component'; 
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
    <div class="pb-10 fade-in font-sans">
        
        <!-- HEADER: Welcome & Scan -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-black text-slate-800 tracking-tight">
                    Xin chào, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{{auth.currentUser()?.displayName}}</span>!
                </h1>
                <p class="text-sm text-slate-500 font-medium mt-1">Hệ thống Quản lý Phòng thí nghiệm (LIMS) sẵn sàng.</p>
            </div>
            
            <button (click)="openScanModal()" class="px-5 py-2.5 bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-300 hover:bg-black transition flex items-center gap-2 font-bold text-xs uppercase tracking-wide active:scale-95 w-fit">
                <i class="fa-solid fa-qrcode"></i> Quét Mã QR
            </button>
        </div>

        <!-- SECTION 1: KPI CARDS (Soft UI Style) -->
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
                    <!-- Gradient Purple-Pink -->
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
                    <!-- Gradient Red-Rose -->
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
                    <!-- Gradient Blue-Cyan -->
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
                    <!-- Gradient Orange-Yellow -->
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
                        <p class="text-sm text-gray-500 flex items-center gap-1">
                            <i class="fa-solid fa-arrow-up text-emerald-500 text-xs"></i>
                            <span class="font-bold text-gray-600">7 ngày gần nhất</span>
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
                                <!-- Dot on Timeline -->
                                <div class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                                     [class.bg-fuchsia-500]="log.action.includes('APPROVE')"
                                     [class.bg-blue-500]="log.action.includes('STOCK')"
                                     [class.bg-gray-400]="!log.action.includes('APPROVE') && !log.action.includes('STOCK')">
                                </div>
                                
                                <div class="flex flex-col">
                                    <div class="text-[10px] font-bold text-gray-400 uppercase mb-1">{{getTimeDiff(log.timestamp)}}</div>
                                    
                                    <!-- Avatar & Content Row -->
                                    <div class="flex items-start gap-3">
                                        <img [src]="getAvatarUrl(log.user)" class="w-8 h-8 rounded-lg border border-gray-100 shadow-sm object-cover bg-white shrink-0" alt="Avatar">
                                        
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

        <!-- SECTION 3: MODULES GRID (Updated with 8 items) -->
        <h6 class="font-bold text-slate-700 text-sm mb-4 px-1">Truy cập nhanh (Quick Actions)</h6>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <!-- 1. Calculator -->
            <div (click)="auth.canViewSop() ? navTo('calculator') : denyAccess()" 
                 class="bg-white p-4 rounded-2xl shadow-soft-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-fuchsia-200 cursor-pointer">
                <div class="w-10 h-10 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-calculator text-lg"></i>
                </div>
                <h6 class="font-bold text-slate-700 text-sm group-hover:text-fuchsia-700">Chạy Quy trình</h6>
                <p class="text-[10px] text-slate-400 mt-0.5">Tính toán đơn lẻ</p>
            </div>

            <!-- 2. Smart Batch -->
            <div (click)="auth.canViewSop() ? navTo('smart-batch') : denyAccess()" 
                 class="bg-white p-4 rounded-2xl shadow-soft-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-teal-200 cursor-pointer">
                <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-wand-magic-sparkles text-lg"></i>
                </div>
                <h6 class="font-bold text-slate-700 text-sm group-hover:text-teal-700">Smart Batch</h6>
                <p class="text-[10px] text-slate-400 mt-0.5">Chạy mẻ & Tối ưu</p>
            </div>

            <!-- 3. Smart Prep -->
            <div (click)="auth.canViewInventory() ? navTo('prep') : denyAccess()" 
                 class="bg-white p-4 rounded-2xl shadow-soft-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-violet-200 cursor-pointer">
                <div class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-flask-vial text-lg"></i>
                </div>
                <h6 class="font-bold text-slate-700 text-sm group-hover:text-violet-700">Trạm Pha Chế</h6>
                <p class="text-[10px] text-slate-400 mt-0.5">Pha loãng & Dãy chuẩn</p>
            </div>

            <!-- 4. Inventory -->
            <div (click)="auth.canViewInventory() ? navTo('inventory') : denyAccess()" 
                 class="bg-white p-4 rounded-2xl shadow-soft-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-blue-200 cursor-pointer">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-boxes-stacked text-lg"></i>
                </div>
                <h6 class="font-bold text-slate-700 text-sm group-hover:text-blue-700">Kho Hóa chất</h6>
                <p class="text-[10px] text-slate-400 mt-0.5">Nhập xuất & Kiểm kê</p>
            </div>

            <!-- 5. Requests -->
            <div (click)="auth.canViewSop() ? navTo('requests') : denyAccess()" 
                 class="bg-white p-4 rounded-2xl shadow-soft-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-orange-200 cursor-pointer relative overflow-hidden">
                <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-clipboard-list text-lg"></i>
                </div>
                <h6 class="font-bold text-slate-700 text-sm group-hover:text-orange-700">Yêu cầu Duyệt</h6>
                <p class="text-[10px] text-slate-400 mt-0.5">Phê duyệt & In phiếu</p>
                @if(state.requests().length > 0) {
                    <div class="absolute top-4 right-4 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg animate-pulse">
                        {{state.requests().length}}
                    </div>
                }
            </div>

            <!-- 6. Standards -->
            <div (click)="auth.canViewStandards() ? navTo('standards') : denyAccess()" 
                 class="bg-white p-4 rounded-2xl shadow-soft-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-indigo-200 cursor-pointer">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-vial-circle-check text-lg"></i>
                </div>
                <h6 class="font-bold text-slate-700 text-sm group-hover:text-indigo-700">Chuẩn Đối chiếu</h6>
                <p class="text-[10px] text-slate-400 mt-0.5">Theo dõi hạn dùng</p>
            </div>

            <!-- 7. Recipes -->
            <div (click)="auth.canViewRecipes() ? navTo('recipes') : denyAccess()" 
                 class="bg-white p-4 rounded-2xl shadow-soft-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-purple-200 cursor-pointer">
                <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-scroll text-lg"></i>
                </div>
                <h6 class="font-bold text-slate-700 text-sm group-hover:text-purple-700">Thư viện Công thức</h6>
                <p class="text-[10px] text-slate-400 mt-0.5">Quản lý hỗn hợp</p>
            </div>

            <!-- 8. Reports -->
            <div (click)="auth.canViewReports() ? navTo('stats') : denyAccess()" 
                 class="bg-white p-4 rounded-2xl shadow-soft-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-rose-200 cursor-pointer">
                <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-chart-pie text-lg"></i>
                </div>
                <h6 class="font-bold text-slate-700 text-sm group-hover:text-rose-700">Báo cáo & Stats</h6>
                <p class="text-[10px] text-slate-400 mt-0.5">NXT & Biểu đồ</p>
            </div>
        </div>

        <!-- SCAN QR MODAL -->
        @if (showScanModal()) {
            <div class="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md fade-in" (click)="closeScanModal()">
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col h-[500px] animate-bounce-in" (click)="$event.stopPropagation()">
                    <div class="flex border-b border-slate-100">
                        <button (click)="scanMode.set('camera')" class="flex-1 py-3 text-xs font-bold uppercase transition" [class]="scanMode() === 'camera' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'">
                            <i class="fa-solid fa-camera mr-1"></i> Camera
                        </button>
                        <button (click)="scanMode.set('manual')" class="flex-1 py-3 text-xs font-bold uppercase transition" [class]="scanMode() === 'manual' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'">
                            <i class="fa-solid fa-keyboard mr-1"></i> Thủ công
                        </button>
                    </div>

                    @if (scanMode() === 'camera') {
                        <div class="flex-1 bg-black relative">
                            <app-qr-scanner (scanSuccess)="onCameraScanSuccess($event)" (scanError)="onCameraError($event)"></app-qr-scanner>
                            <button (click)="closeScanModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center z-30">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                    }

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
  
  // LIVE DATA COMPUTED
  recentLogs = computed(() => this.state.logs().slice(0, 6)); 
  todayActivityCount = computed(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      return this.state.logs().filter(l => {
          const d = l.timestamp?.toDate ? l.timestamp.toDate() : new Date(l.timestamp);
          return d.toISOString().split('T')[0] === todayStr;
      }).length;
  });

  today = new Date();
  
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('activityChart');
  chartInstance: any = null;

  showScanModal = signal(false);
  scanMode = signal<'camera' | 'manual'>('camera');
  scanCode = '';
  scanInputRef = viewChild<ElementRef>('scanInput');
  private scanTimeout: any;

  constructor() {
      // Auto-draw chart when data arrives
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
      const existingChart = Chart.getChart(canvas);
      if (existingChart) existingChart.destroy();
      if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Create Gradient for Chart Fill
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(203, 12, 159, 0.2)'); // Fuchsia
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
                      label: 'Số mẫu (Samples)', 
                      data: sampleData, 
                      backgroundColor: gradient, 
                      borderColor: '#cb0c9f', 
                      borderWidth: 3, 
                      pointRadius: 4, 
                      pointBackgroundColor: '#cb0c9f',
                      pointBorderColor: '#fff',
                      pointHoverRadius: 6,
                      fill: true,
                      tension: 0.4,
                      yAxisID: 'y'
                  },
                  { 
                      label: 'Số mẻ (Batches)', 
                      data: runData, 
                      type: 'bar',
                      backgroundColor: '#3a416f', 
                      borderRadius: 4, 
                      barThickness: 10,
                      order: 1, 
                      yAxisID: 'y1' 
                  }
              ]
          },
          options: { 
              responsive: true, 
              maintainAspectRatio: false, 
              plugins: { 
                  legend: { display: false },
                  tooltip: {
                      backgroundColor: '#fff',
                      titleColor: '#1e293b',
                      bodyColor: '#1e293b',
                      borderColor: '#e2e8f0',
                      borderWidth: 1,
                      padding: 10,
                      displayColors: true,
                      usePointStyle: true,
                  }
              }, 
              interaction: {
                  mode: 'index',
                  intersect: false,
              },
              scales: { 
                  x: { 
                      grid: { display: false },
                      border: { display: false },
                      ticks: { font: { size: 10, family: "'Open Sans', sans-serif" }, color: '#94a3b8' }
                  }, 
                  y: { 
                      type: 'linear', 
                      display: true, 
                      position: 'left', 
                      beginAtZero: true,
                      grid: { tickBorderDash: [5, 5], color: '#f1f5f9' },
                      border: { display: false },
                      ticks: { font: { size: 10, family: "'Open Sans', sans-serif" }, color: '#94a3b8', maxTicksLimit: 5 }
                  }, 
                  y1: { 
                      type: 'linear', 
                      display: true, 
                      position: 'right', 
                      beginAtZero: true, 
                      grid: { display: false },
                      border: { display: false },
                      ticks: { display: false } 
                  } 
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

  openScanModal() {
      this.showScanModal.set(true);
      this.scanMode.set('camera');
      this.scanCode = '';
  }

  closeScanModal() {
      this.showScanModal.set(false);
  }

  onCameraScanSuccess(result: string) {
      this.scanCode = result;
      this.closeScanModal();
      this.processScanCode(result);
  }

  onCameraError(err: any) {
      this.toast.show('Lỗi Camera. Chuyển sang nhập tay.', 'info');
      this.scanMode.set('manual');
      setTimeout(() => this.scanInputRef()?.nativeElement?.focus(), 100);
  }

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
      this.processScanCode(code);
  }

  // --- SMART SCAN ROUTER ---
  private processScanCode(code: string) {
      let raw = code.trim();

      // 1. URL INTELLIGENCE: Extract ID from URL if scanned
      if (raw.includes('/') || raw.includes('http')) {
          try {
              if (raw.includes('#/traceability/')) {
                  const parts = raw.split('#/traceability/');
                  if (parts.length > 1) {
                      raw = parts[1].split('?')[0].split('/')[0]; 
                  }
              } else if (raw.includes('id=')) {
                  const urlObj = new URL(raw);
                  const idParam = urlObj.searchParams.get('id');
                  if (idParam) raw = idParam;
              }
          } catch (e) { 
              console.warn('URL parsing failed'); 
          }
      }

      raw = raw.toUpperCase();
      this.toast.show(`Đang tra cứu: ${raw}`, 'info');

      // 1. Traceability (Logs)
      if (raw.startsWith('TRC-') || raw.startsWith('REQ-') || raw.startsWith('LOG-')) {
          this.router.navigate(['/traceability', raw]); 
          return;
      }

      // 2. Inventory
      if (raw.startsWith('INV-')) {
          this.toast.show('Tìm thấy hóa chất!', 'success');
          this.router.navigate(['/inventory'], { queryParams: { search: raw } }); 
          return;
      }

      // 3. Standard
      if (raw.startsWith('STD-')) {
          this.router.navigate(['/standards'], { queryParams: { search: raw } });
          return;
      }

      // 4. SOP (Calculator)
      if (raw.startsWith('SOP-')) {
          this.toast.show('Mở quy trình...', 'success');
          this.router.navigate(['/editor']); // User can search there
          return;
      }

      // 5. Recipe
      if (raw.startsWith('RCP-')) {
          this.router.navigate(['/recipes']);
          return;
      }

      // 6. User
      if (raw.startsWith('USR-')) {
          this.router.navigate(['/config']); 
          return;
      }

      // 7. Fallback (Legacy Log IDs)
      if (raw.toLowerCase().startsWith('log_') || raw.match(/^\d+$/)) {
           this.router.navigate(['/traceability', raw]); 
           return;
      }

      // Default: Search in Inventory
      this.router.navigate(['/inventory'], { queryParams: { search: raw } });
  }
}
