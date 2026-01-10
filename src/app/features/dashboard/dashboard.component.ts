
import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { formatNum, formatDate } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="space-y-6 fade-in pb-10">
        
        <!-- 1. Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            <!-- Pending Requests -->
            <div (click)="auth.canViewSop() ? navTo('requests') : denyAccess()" 
                 class="relative flex flex-col bg-white rounded-2xl shadow-soft-xl overflow-hidden transition-all duration-300 group border border-slate-100 h-28 justify-center"
                 [class.cursor-pointer]="auth.canViewSop()" 
                 [class.hover:-translate-y-1]="auth.canViewSop()"
                 [class.active:scale-95]="auth.canViewSop()"
                 [class.opacity-60]="!auth.canViewSop()">
                <div class="p-4 flex items-center justify-between">
                    <div class="w-full">
                        <p class="mb-0 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            Chờ Duyệt @if(!auth.canViewSop()) { <i class="fa-solid fa-lock text-[10px]"></i> }
                        </p>
                        @if (isLoading()) {
                           <app-skeleton width="60%" height="24px" class="mt-1 block"></app-skeleton>
                        } @else {
                           <h5 class="mb-0 font-bold text-slate-700 text-xl mt-1">
                               {{state.requests().length}} <span class="text-xs font-normal text-slate-400">yêu cầu</span>
                           </h5>
                        }
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0 ml-4 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-clock"></i>
                    </div>
                </div>
            </div>

            <!-- Low Stock Alert -->
            <div (click)="auth.canViewInventory() ? navTo('inventory') : denyAccess()" 
                 class="relative flex flex-col bg-white rounded-2xl shadow-soft-xl overflow-hidden transition-all duration-300 group border border-slate-100 h-28 justify-center"
                 [class.cursor-pointer]="auth.canViewInventory()" [class.hover:-translate-y-1]="auth.canViewInventory()"
                 [class.active:scale-95]="auth.canViewInventory()"
                 [class.opacity-60]="!auth.canViewInventory()">
                <div class="p-4 flex items-center justify-between">
                    <div class="w-full">
                        <p class="mb-0 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            Cảnh báo Kho @if(!auth.canViewInventory()) { <i class="fa-solid fa-lock text-[10px]"></i> }
                        </p>
                        @if (isLoading()) {
                           <app-skeleton width="60%" height="24px" class="mt-1 block"></app-skeleton>
                        } @else {
                           <h5 class="mb-0 font-bold text-slate-700 text-xl mt-1">
                               {{lowStockCount()}} <span class="text-xs font-normal text-slate-400">mục sắp hết</span>
                           </h5>
                        }
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-red-600 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0 ml-4 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                </div>
            </div>

            <!-- Total SOPs -->
            <div (click)="auth.canViewSop() ? navTo('calculator') : denyAccess()" 
                 class="relative flex flex-col bg-white rounded-2xl shadow-soft-xl overflow-hidden transition-all duration-300 group border border-slate-100 h-28 justify-center"
                 [class.cursor-pointer]="auth.canViewSop()" 
                 [class.hover:-translate-y-1]="auth.canViewSop()"
                 [class.active:scale-95]="auth.canViewSop()"
                 [class.opacity-60]="!auth.canViewSop()">
                <div class="p-4 flex items-center justify-between">
                    <div class="w-full">
                        <p class="mb-0 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            Quy trình (SOP) @if(!auth.canViewSop()) { <i class="fa-solid fa-lock text-[10px]"></i> }
                        </p>
                        @if (isLoading()) {
                           <app-skeleton width="60%" height="24px" class="mt-1 block"></app-skeleton>
                        } @else {
                           <h5 class="mb-0 font-bold text-slate-700 text-xl mt-1">
                               {{state.sops().length}} <span class="text-xs font-normal text-slate-400">quy trình</span>
                           </h5>
                        }
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-purple-700 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 shrink-0 ml-4 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-flask"></i>
                    </div>
                </div>
            </div>

            <!-- Standards -->
            <div (click)="auth.canViewStandards() ? navTo('standards') : denyAccess()" 
                 class="relative flex flex-col bg-white rounded-2xl shadow-soft-xl overflow-hidden transition-all duration-300 group border border-slate-100 h-28 justify-center"
                 [class.cursor-pointer]="auth.canViewStandards()" [class.hover:-translate-y-1]="auth.canViewStandards()"
                 [class.active:scale-95]="auth.canViewStandards()"
                 [class.opacity-60]="!auth.canViewStandards()">
                <div class="p-4 flex items-center justify-between">
                    <div class="w-full">
                        <p class="mb-0 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            Chuẩn Đối Chiếu @if(!auth.canViewStandards()) { <i class="fa-solid fa-lock text-[10px]"></i> }
                        </p>
                        @if (isLoading()) {
                           <app-skeleton width="60%" height="24px" class="mt-1 block"></app-skeleton>
                        } @else {
                           <h5 class="mb-0 font-bold text-slate-700 text-xl mt-1">
                               {{state.standards().length}} <span class="text-xs font-normal text-slate-400">lọ</span>
                           </h5>
                        }
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0 ml-4 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-vial-circle-check"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Left Column (2/3): Welcome & Actions -->
            <div class="lg:col-span-2 space-y-6">
                
                <!-- Welcome Card -->
                <div class="relative bg-white rounded-2xl p-6 shadow-soft-xl overflow-hidden group border border-slate-100">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-tl from-purple-100 to-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>
                    
                    <div class="relative z-10 flex justify-between items-center">
                        <div class="w-full md:w-auto">
                            <p class="text-sm font-bold text-slate-500 mb-1">{{getGreeting()}},</p>
                            @if(isLoading()) {
                                <app-skeleton width="200px" height="36px" class="mb-2 block"></app-skeleton>
                                <app-skeleton width="100%" height="16px" class="mb-1 block"></app-skeleton>
                                <app-skeleton width="80%" height="16px" class="mb-6 block"></app-skeleton>
                            } @else {
                                <h2 class="text-3xl font-black text-slate-800 tracking-tight mb-2">
                                    {{state.currentUser()?.displayName}}
                                </h2>
                                <p class="text-sm text-slate-500 max-w-md leading-relaxed">
                                    Hệ thống LIMS sẵn sàng. Hôm nay bạn có <strong class="text-blue-600">{{state.requests().length}} yêu cầu</strong> đang chờ xử lý. 
                                    @if(lowStockCount() > 0) { <span class="text-red-500 font-bold">Cảnh báo: {{lowStockCount()}} mục sắp hết hàng.</span> }
                                </p>
                            }
                            
                            @if(auth.canViewSop()) {
                                <div class="mt-6 flex gap-3">
                                    <button (click)="navTo('calculator')" class="bg-gradient-to-tl from-purple-700 to-pink-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                                        <i class="fa-solid fa-play mr-2"></i> Chạy Mẫu Mới
                                    </button>
                                    <button (click)="navTo('requests')" class="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
                                        Xem Yêu Cầu
                                    </button>
                                </div>
                            } @else {
                                <div class="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl inline-flex items-center gap-2 text-xs font-bold text-blue-700">
                                    <i class="fa-solid fa-circle-info"></i> Tài khoản chỉ xem (Viewer)
                                </div>
                            }
                        </div>
                        <div class="hidden md:block pr-6 text-slate-200">
                            <i class="fa-solid fa-microscope text-8xl"></i>
                        </div>
                    </div>
                </div>

                <!-- Shortcuts Grid (Secure Permissions) -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    <!-- Inventory Shortcut -->
                    <button (click)="auth.canViewInventory() ? navTo('inventory') : denyAccess()" 
                            class="bg-white p-4 rounded-2xl shadow-soft-xl border border-slate-100 transition-all text-left group flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                            [class.hover:border-blue-300]="auth.canViewInventory()" [class.hover:shadow-md]="auth.canViewInventory()" [class.active:scale-95]="auth.canViewInventory()"
                            [class.opacity-50]="!auth.canViewInventory()" [class.cursor-not-allowed]="!auth.canViewInventory()">
                        @if(!auth.canViewInventory()) { <div class="absolute top-2 right-2 text-slate-300"><i class="fa-solid fa-lock"></i></div> }
                        <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center transition-transform" [class.group-hover:scale-110]="auth.canViewInventory()">
                            <i class="fa-solid fa-boxes-stacked"></i>
                        </div>
                        <div class="text-center">
                            <h4 class="font-bold text-slate-700 text-sm">Kho Hóa chất</h4>
                            <p class="text-[10px] text-slate-400 mt-0.5">Tra cứu tồn kho</p>
                        </div>
                    </button>

                    <!-- Standards Shortcut -->
                    <button (click)="auth.canViewStandards() ? navTo('standards') : denyAccess()" 
                            class="bg-white p-4 rounded-2xl shadow-soft-xl border border-slate-100 transition-all text-left group flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                            [class.hover:border-emerald-300]="auth.canViewStandards()" [class.hover:shadow-md]="auth.canViewStandards()" [class.active:scale-95]="auth.canViewStandards()"
                            [class.opacity-50]="!auth.canViewStandards()" [class.cursor-not-allowed]="!auth.canViewStandards()">
                        @if(!auth.canViewStandards()) { <div class="absolute top-2 right-2 text-slate-300"><i class="fa-solid fa-lock"></i></div> }
                        <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform" [class.group-hover:scale-110]="auth.canViewStandards()">
                            <i class="fa-solid fa-vial"></i>
                        </div>
                        <div class="text-center">
                            <h4 class="font-bold text-slate-700 text-sm">Chuẩn Đối chiếu</h4>
                            <p class="text-[10px] text-slate-400 mt-0.5">Quản lý hạn dùng</p>
                        </div>
                    </button>

                    <!-- Labels Shortcut -->
                    <button (click)="auth.canViewInventory() ? navTo('labels') : denyAccess()" 
                            class="bg-white p-4 rounded-2xl shadow-soft-xl border border-slate-100 transition-all text-left group flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                            [class.hover:border-orange-300]="auth.canViewInventory()" [class.hover:shadow-md]="auth.canViewInventory()" [class.active:scale-95]="auth.canViewInventory()"
                            [class.opacity-50]="!auth.canViewInventory()" [class.cursor-not-allowed]="!auth.canViewInventory()">
                        @if(!auth.canViewInventory()) { <div class="absolute top-2 right-2 text-slate-300"><i class="fa-solid fa-lock"></i></div> }
                        <div class="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-print"></i>
                        </div>
                        <div class="text-center">
                            <h4 class="font-bold text-slate-700 text-sm">In Tem Nhãn</h4>
                            <p class="text-[10px] text-slate-400 mt-0.5">Tạo mã QR/Barcode</p>
                        </div>
                    </button>
                    
                    <!-- Printing Queue -->
                    <button (click)="auth.canViewSop() ? navTo('printing') : denyAccess()" 
                            class="bg-white p-4 rounded-2xl shadow-soft-xl border border-slate-100 transition-all text-left group flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                            [class.hover:border-purple-300]="auth.canViewSop()" [class.hover:shadow-md]="auth.canViewSop()" [class.active:scale-95]="auth.canViewSop()"
                            [class.opacity-50]="!auth.canViewSop()" [class.cursor-not-allowed]="!auth.canViewSop()">
                        @if(!auth.canViewSop()) { <div class="absolute top-2 right-2 text-slate-300"><i class="fa-solid fa-lock"></i></div> }
                        <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-file-invoice"></i>
                        </div>
                        <div class="text-center">
                            <h4 class="font-bold text-slate-700 text-sm">Phiếu Dự Trù</h4>
                            <p class="text-[10px] text-slate-400 mt-0.5">Hàng đợi in ấn</p>
                        </div>
                    </button>
                </div>

            </div>

            <!-- Right Column (1/3): Alerts & Feed -->
            <div class="space-y-6">
                
                <!-- Low Stock Alert List -->
                <div class="bg-white rounded-2xl shadow-soft-xl overflow-hidden flex flex-col max-h-[300px] border border-slate-100">
                    <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 class="font-bold text-slate-700 text-sm flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            Cần bổ sung gấp
                        </h3>
                        @if(auth.canViewInventory()) {
                            <button (click)="navTo('inventory')" class="text-[10px] font-bold text-blue-600 hover:underline">Xem tất cả</button>
                        }
                    </div>
                    <div class="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        @if (isLoading()) {
                            <!-- Skeleton List -->
                            @for (i of [1,2,3]; track i) {
                                <div class="flex items-center gap-3 p-3 border-b border-slate-50">
                                    <app-skeleton shape="rect" width="32px" height="32px"></app-skeleton>
                                    <div class="flex-1">
                                        <app-skeleton width="80%" height="12px" class="mb-1 block"></app-skeleton>
                                        <app-skeleton width="40%" height="10px" class="block"></app-skeleton>
                                    </div>
                                </div>
                            }
                        } @else {
                            @for (item of lowStockItems(); track item.id) {
                                <div class="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition border-b border-slate-50 last:border-0 cursor-pointer active:scale-[0.98]">
                                    <div class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 font-bold text-xs">
                                        !
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-bold text-slate-700 truncate">{{item.name}}</div>
                                        <div class="text-[10px] text-slate-400">
                                            Còn: <span class="font-bold text-red-600">{{formatNum(item.stock)}} {{item.unit}}</span> 
                                            (Min: {{item.threshold}})
                                        </div>
                                    </div>
                                </div>
                            } @empty {
                                <div class="p-8 text-center text-slate-400 text-xs italic">
                                    <i class="fa-solid fa-check-circle text-2xl mb-2 text-emerald-300"></i>
                                    <br>Kho đang ổn định.
                                </div>
                            }
                        }
                    </div>
                </div>

                <!-- Recent Logs Mini -->
                <div class="bg-white rounded-2xl shadow-soft-xl overflow-hidden border border-slate-100">
                    <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 class="font-bold text-slate-700 text-sm">Hoạt động gần đây</h3>
                    </div>
                    <div class="p-4 space-y-4">
                        @if(isLoading()) {
                            @for (i of [1,2,3]; track i) {
                                <div class="flex gap-3 relative pl-4 border-l border-slate-200">
                                    <div class="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                    <div class="w-full">
                                        <app-skeleton width="30%" height="10px" class="mb-1 block"></app-skeleton>
                                        <app-skeleton width="90%" height="12px" class="mb-1 block"></app-skeleton>
                                        <app-skeleton width="20%" height="8px" class="block"></app-skeleton>
                                    </div>
                                </div>
                            }
                        } @else {
                            @for (log of recentLogs(); track log.id) {
                                <div class="flex gap-3 relative pl-4 border-l border-slate-200">
                                    <div class="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                                         [class]="log.action.includes('APPROVE') ? 'bg-blue-500' : 'bg-slate-300'"></div>
                                    <div>
                                        <div class="text-xs font-bold text-slate-700">{{log.user}}</div>
                                        <div class="text-[10px] text-slate-500 line-clamp-2 leading-tight mt-0.5">{{log.details}}</div>
                                        <div class="text-[9px] text-slate-400 mt-1">{{getTimeDiff(log.timestamp)}}</div>
                                    </div>
                                </div>
                            } @empty {
                                <div class="text-center text-slate-400 text-xs italic">Chưa có hoạt động.</div>
                            }
                        }
                    </div>
                </div>

            </div>
        </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  state = inject(StateService);
  auth = inject(AuthService); // Inject Auth Service for permission checks
  router: Router = inject(Router);
  toast = inject(ToastService);
  formatNum = formatNum;
  
  isLoading = signal(true);

  // Derived Signals
  lowStockCount = computed(() => this.state.inventory().filter(i => i.stock <= (i.threshold || 5)).length);
  lowStockItems = computed(() => this.state.inventory().filter(i => i.stock <= (i.threshold || 5)).slice(0, 5));
  recentLogs = computed(() => this.state.logs().slice(0, 5));

  ngOnInit() {
      if (this.state.inventory().length > 0) {
          this.isLoading.set(false);
      } else {
          setTimeout(() => this.isLoading.set(false), 1000);
      }
  }

  navTo(path: string) {
      this.router.navigate(['/' + path]);
  }

  // Security Helper for Locked Buttons
  denyAccess() {
      this.toast.show('Bạn không có quyền truy cập chức năng này!', 'error');
  }

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
}
