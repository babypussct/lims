
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { QrGlobalService } from '../services/qr-global.service';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';
import { getAvatarUrl } from '../../shared/utils/utils';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- INSTALL GUIDE OVERLAY (iOS Style) -->
    @if (showInstallGuide()) {
        <div class="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-sm fade-in flex flex-col items-center justify-end pb-10" (click)="toggleInstallGuide()">
            <div class="w-full max-w-sm px-6 text-center animate-slide-up" (click)="$event.stopPropagation()">
                <div class="mb-6 flex justify-center">
                    <div class="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                        <i class="fa-solid fa-flask text-3xl text-indigo-600"></i>
                    </div>
                </div>
                <h3 class="text-white font-bold text-xl mb-2">Cài đặt LIMS Pro</h3>
                <p class="text-slate-300 text-sm mb-8">Thêm ứng dụng vào màn hình chính để sử dụng toàn màn hình và mượt mà hơn.</p>
                
                <div class="bg-white/10 rounded-xl p-4 text-left space-y-4 mb-8 border border-white/10">
                    <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">1</div>
                        <div class="text-slate-200 text-sm">
                            Nhấn vào nút <span class="font-bold text-white"><i class="fa-solid fa-arrow-up-from-bracket"></i> Chia sẻ</span> trên thanh công cụ Safari.
                        </div>
                    </div>
                    <div class="h-px bg-white/10"></div>
                    <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">2</div>
                        <div class="text-slate-200 text-sm">
                            Chọn dòng <span class="font-bold text-white"><i class="fa-regular fa-square-plus"></i> Thêm vào MH chính</span>.
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <button (click)="toggleInstallGuide()" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition">Đã hiểu</button>
                </div>
                
                <!-- Bounce Arrow pointing down -->
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
                    <i class="fa-solid fa-arrow-down text-2xl"></i>
                </div>
            </div>
        </div>
    }

    <!-- MENU OVERLAY (Bottom Sheet) -->
    @if (showMenu()) {
        <div class="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm fade-in" (click)="toggleMenu()"></div>
        <div class="fixed bottom-20 right-2 left-2 z-[50] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slide-up origin-bottom">
            
            <!-- User Profile Header -->
            <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 active:bg-slate-100 dark:active:bg-slate-800 transition" (click)="navTo('/config')">
                <img [src]="getAvatarUrl(auth.currentUser()?.displayName, 'initials', auth.currentUser()?.photoURL)" 
                     class="w-10 h-10 rounded-full border border-white dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 object-cover">
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{{auth.currentUser()?.displayName}}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 truncate">{{auth.currentUser()?.email}}</div>
                </div>
                <div class="flex flex-col items-end">
                    <span class="text-[9px] font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{{auth.currentUser()?.role}}</span>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-400 dark:text-slate-500 text-xs ml-1"></i>
            </div>

            <!-- Grid Menu -->
            <div class="p-4 grid grid-cols-4 gap-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                
                <!-- 1. Smart Prep -->
                @if(auth.canViewInventory()) {
                    <button (click)="navTo('/prep')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-purple-100 dark:border-purple-800/30">
                            <i class="fa-solid fa-flask-vial"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Pha Chế</span>
                    </button>
                }

                <!-- 2. SOP Library / Calculator -->
                @if(auth.canViewSop()) {
                    <button (click)="navTo('/calculator')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-blue-100 dark:border-blue-800/30">
                            <i class="fa-solid fa-play pl-0.5"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Vận hành</span>
                    </button>
                }

                <!-- 3. Requests -->
                @if(auth.canViewSop()) {
                    <button (click)="navTo('/requests')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-orange-100 dark:border-orange-800/30">
                            <i class="fa-solid fa-clipboard-list"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Duyệt</span>
                    </button>
                }

                <!-- 4. Standards -->
                @if(auth.canViewStandards()) {
                    <button (click)="navTo('/standards')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-indigo-100 dark:border-indigo-800/30">
                            <i class="fa-solid fa-vial-circle-check"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Chuẩn</span>
                    </button>
                }

                <!-- 4b. Standard Requests -->
                @if(auth.canViewStandards()) {
                    <button (click)="navTo('/standard-requests')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-indigo-100 dark:border-indigo-800/30">
                            <i class="fa-solid fa-clipboard-check"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">YC Chuẩn</span>
                    </button>
                }

                <!-- 4c. Standard Usage Log -->
                @if(auth.canViewStandardLogs()) {
                    <button (click)="navTo('/standard-usage')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-violet-100 dark:border-violet-800/30">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">NK Chuẩn</span>
                    </button>
                }

                <!-- 5. Recipes -->
                @if(auth.canViewRecipes()) {
                    <button (click)="navTo('/recipes')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-pink-100 dark:border-pink-800/30">
                            <i class="fa-solid fa-scroll"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Công thức</span>
                    </button>
                }

                <!-- 6. Labels (Synced with Sidebar Inventory->Labels) -->
                @if(auth.canViewInventory()) {
                    <button (click)="navTo('/labels')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-slate-200 dark:border-slate-600">
                            <i class="fa-solid fa-tag"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">In Tem</span>
                    </button>
                }

                <!-- 7. Reports -->
                @if(auth.canViewReports()) {
                    <button (click)="navTo('/stats')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-emerald-100 dark:border-emerald-800/30">
                            <i class="fa-solid fa-chart-pie"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Báo cáo</span>
                    </button>
                }

                <!-- 8. Config (Shortcut) -->
                @if(auth.canManageSystem()) {
                    <button (click)="navTo('/config')" class="flex flex-col items-center gap-1 group">
                        <div class="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-slate-300 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-gray-200 dark:border-slate-600">
                            <i class="fa-solid fa-gears"></i>
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Cấu hình</span>
                    </button>
                }

                <!-- Dark Mode Toggle -->
                <button (click)="toggleDarkMode()" class="flex flex-col items-center gap-1 group">
                    <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-slate-200 dark:border-slate-600">
                        <i class="fa-solid" [class.fa-moon]="!state.darkMode()" [class.fa-sun]="state.darkMode()"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">{{ state.darkMode() ? 'Sáng' : 'Tối' }}</span>
                </button>

                <!-- 9. INSTALL APP -->
                <button (click)="toggleInstallGuide()" class="flex flex-col items-center gap-1 group">
                    <div class="w-14 h-14 rounded-2xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-slate-700 dark:border-slate-600">
                        <i class="fa-brands fa-apple"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Cài App</span>
                </button>

                <!-- 10. Logout -->
                <button (click)="auth.logout()" class="flex flex-col items-center gap-1 group">
                    <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700/50 text-red-500 dark:text-red-400 flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition border border-slate-200 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <i class="fa-solid fa-power-off"></i>
                    </div>
                    <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">Thoát</span>
                </button>

            </div>
        </div>
    }

    <!-- MAIN BOTTOM BAR -->
    <div class="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_24px_-6px_rgba(0,0,0,0.12)] dark:shadow-none z-[40] md:hidden pb-safe">
      <div class="flex items-center justify-around h-[72px] px-2 relative">
        
        <!-- 1. Dashboard (Always) -->
        <button (click)="navTo('/dashboard')" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
               [class]="isActive('/dashboard') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
            <i class="fa-solid fa-house text-base transition-transform duration-200" [class.-translate-y-0.5]="isActive('/dashboard')"></i>
          </div>
          <span class="text-[9px] font-bold transition-colors" 
                [class]="isActive('/dashboard') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'">Home</span>
        </button>

        <!-- 2. Inventory (Checked) -->
        @if(auth.canViewInventory()) {
            <button (click)="navTo('/inventory')" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                   [class]="isActive('/inventory') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
                <i class="fa-solid fa-boxes-stacked text-base transition-transform duration-200" [class.-translate-y-0.5]="isActive('/inventory')"></i>
              </div>
              <span class="text-[9px] font-bold transition-colors" 
                    [class]="isActive('/inventory') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'">Kho</span>
            </button>
        }

        <!-- 3. SCAN (Center - Always) -->
        <div class="relative -top-5">
            <div class="absolute -inset-1 bg-gradient-to-b from-white/80 to-transparent dark:from-slate-900/80 rounded-full"></div>
            <button (click)="qrService.startScan()" 
                    class="relative w-[60px] h-[60px] rounded-full bg-gradient-to-br from-slate-800 to-slate-950 dark:from-slate-600 dark:to-slate-800 text-white shadow-xl shadow-slate-400/40 dark:shadow-none flex items-center justify-center active:scale-90 transition-all border-[3px] border-white dark:border-slate-900 group">
                <i class="fa-solid fa-qrcode text-xl group-active:scale-110 transition-transform"></i>
            </button>
            <span class="block text-center text-[8px] font-bold text-slate-400 dark:text-slate-500 mt-1">Quét</span>
        </div>

        <!-- 4. Smart Batch (Checked) -->
        @if(auth.canViewSop()) {
            <button (click)="navTo('/smart-batch')" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                   [class]="isActive('/smart-batch') ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
                <i class="fa-solid fa-wand-magic-sparkles text-base transition-transform duration-200" [class.-translate-y-0.5]="isActive('/smart-batch')"></i>
              </div>
              <span class="text-[9px] font-bold transition-colors" 
                    [class]="isActive('/smart-batch') ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'">Chạy Mẻ</span>
            </button>
        }

        <!-- 5. MORE MENU (Always) -->
        <button (click)="toggleMenu()" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
               [class]="showMenu() ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
            <i class="fa-solid text-base transition-transform duration-200" [class]="showMenu() ? 'fa-xmark' : 'fa-bars'"></i>
          </div>
          <span class="text-[9px] font-bold transition-colors" 
                [class]="showMenu() ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'">{{ showMenu() ? 'Đóng' : 'Thêm' }}</span>
        </button>

      </div>
    </div>
  `,
  styles: [`
    .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
    @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class BottomNavComponent {
  router: Router = inject(Router);
  state = inject(StateService);
  qrService = inject(QrGlobalService);
  auth = inject(AuthService);
  getAvatarUrl = getAvatarUrl;

  showMenu = signal(false);
  showInstallGuide = signal(false);

  toggleDarkMode() {
    this.state.toggleDarkMode();
    this.showMenu.set(false);
  }

  toggleMenu() {
      this.showMenu.update(v => !v);
      this.showInstallGuide.set(false);
  }

  toggleInstallGuide() {
      this.showInstallGuide.update(v => !v);
      // Close menu if guide opens
      if (this.showInstallGuide()) this.showMenu.set(false);
  }

  navTo(path: string) {
    this.showMenu.set(false);
    this.showInstallGuide.set(false);
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
