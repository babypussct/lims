
import { Component, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { AuthService } from '../services/auth.service';
import { QrGlobalService } from '../services/qr-global.service'; // Import
import { ToastService } from '../services/toast.service';
import { getAvatarUrl } from '../../shared/utils/utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <aside class="fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-soft-xl z-50 flex flex-col transition-all duration-300 ease-in-out"
           [class.w-64]="!state.sidebarCollapsed()"
           [class.w-20]="state.sidebarCollapsed()"
           [class.-translate-x-full]="!state.sidebarOpen()"
           [class.md:translate-x-0]="true"
           [class.translate-x-0]="state.sidebarOpen()">
      
      <!-- 1. Brand -->
      <div class="h-16 flex items-center px-6 shrink-0 relative cursor-pointer group"
           [class.justify-center]="state.sidebarCollapsed()"
           (click)="state.toggleSidebarCollapse()"
           title="Nhấn để Thu gọn / Mở rộng">
         <div class="w-8 h-8 rounded-lg bg-gradient-soft flex items-center justify-center shadow-soft-md shrink-0 transition-transform group-hover:scale-110">
             <i class="fa-solid fa-flask text-white text-xs"></i>
         </div>
         @if (!state.sidebarCollapsed()) {
            <span class="font-bold text-gray-700 dark:text-slate-200 text-sm tracking-wide ml-3 fade-in group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                LIMS Cloud <span class="font-light text-gray-400 dark:text-slate-500">Pro</span>
            </span>
         }
         <button (click)="state.closeSidebar(); $event.stopPropagation()" class="md:hidden ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 active:bg-gray-200 dark:active:bg-slate-700">
             <i class="fa-solid fa-times"></i>
         </button>
      </div>

      <!-- 2. GLOBAL ACTION: SCAN -->
      <div class="px-4 mt-2 mb-2">
          <button (click)="qrService.startScan()" 
                  class="w-full flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white p-3 rounded-xl shadow-md shadow-slate-300 dark:shadow-none transition-all active:scale-95 group overflow-hidden relative">
              <i class="fa-solid fa-qrcode text-lg relative z-10 group-hover:scale-110 transition-transform"></i>
              @if (!state.sidebarCollapsed()) {
                  <div class="flex items-center justify-between flex-1 relative z-10 fade-in">
                      <span class="font-bold text-xs uppercase tracking-wider">Quét Mã</span>
                      <span class="text-[9px] font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-white/80">⌘K</span>
                  </div>
              }
              <!-- Hover Effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
      </div>

      <hr class="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent border-none mx-4 mb-2" />

      <!-- 3. Modules Menu -->
      <div class="px-3 py-2 shrink-0 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
         
         <!-- TỔNG QUAN -->
         @if (!state.sidebarCollapsed()) {
             <div class="px-3 pt-4 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider fade-in">Tổng quan</div>
         } @else {
             <div class="h-4"></div>
         }

         <!-- Dashboard -->
         <div (click)="navigateTo('dashboard')" 
              class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent relative"
              [class]="isActive('/dashboard') ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'"
              [title]="state.sidebarCollapsed() ? 'Trang chủ' : ''">
            @if(isActive('/dashboard')) {
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-fuchsia-600 dark:bg-fuchsia-500 rounded-r-full"></div>
            }
            <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                 [class.mx-auto]="state.sidebarCollapsed()"
                 [class]="isActive('/dashboard') ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'">
               <i class="fa-solid fa-house text-xs"></i>
            </div>
            @if (!state.sidebarCollapsed()) {
                <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/dashboard') ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'">Trang chủ</span>
            }
         </div>

         <!-- Reports -->
         @if(auth.canViewReports()) {
             <div (click)="navigateTo('stats')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent relative"
                  [class]="isActive('/stats') ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'"
                  [title]="state.sidebarCollapsed() ? 'Báo cáo' : ''">
                @if(isActive('/stats')) {
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-fuchsia-600 dark:bg-fuchsia-500 rounded-r-full"></div>
                }
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/stats') ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'">
                   <i class="fa-solid fa-chart-pie text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/stats') ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'">Báo cáo</span>
                }
             </div>
         }

         <!-- VẬN HÀNH -->
         @if (!state.sidebarCollapsed()) {
             <div class="px-3 pt-4 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider fade-in">Vận hành</div>
         } @else {
             <div class="h-4 border-t border-slate-100 dark:border-slate-800 mx-3 mt-2"></div>
         }

         <!-- Smart Batch -->
         @if(auth.canViewSop()) {
             <div (click)="navigateTo('smart-batch')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent relative"
                  [class]="isActive('/smart-batch') ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'"
                  [title]="state.sidebarCollapsed() ? 'Chạy Mẻ (Smart)' : ''">
                @if(isActive('/smart-batch')) {
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-fuchsia-600 dark:bg-fuchsia-500 rounded-r-full"></div>
                }
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/smart-batch') ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'">
                   <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/smart-batch') ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'">Chạy Mẻ (Smart)</span>
                }
             </div>
         }

         <!-- SOP (Vận hành) -->
         @if(auth.canViewSop()) {
             <div (click)="navigateTo('calculator')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent relative"
                  [class]="isActive('/calculator') || isActive('/editor') || isActive('/recipes') ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'"
                  [title]="state.sidebarCollapsed() ? 'Vận hành (SOP)' : ''">
                @if(isActive('/calculator') || isActive('/editor') || isActive('/recipes')) {
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-fuchsia-600 dark:bg-fuchsia-500 rounded-r-full"></div>
                }
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/calculator') || isActive('/editor') || isActive('/recipes') ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'">
                   <i class="fa-solid fa-play text-xs pl-0.5"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/calculator') || isActive('/editor') || isActive('/recipes') ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'">Vận hành (SOP)</span>
                }
             </div>
         }

         <!-- Smart Prep Station -->
         @if(auth.canViewInventory()) {
             <div (click)="navigateTo('prep')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent relative"
                  [class]="isActive('/prep') ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'"
                  [title]="state.sidebarCollapsed() ? 'Trạm Pha Chế' : ''">
                @if(isActive('/prep')) {
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-fuchsia-600 dark:bg-fuchsia-500 rounded-r-full"></div>
                }
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/prep') ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'">
                   <i class="fa-solid fa-flask-vial text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/prep') ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'">Trạm Pha Chế</span>
                }
             </div>
         }

         <!-- Requests -->
         @if(auth.canViewSop()) {
             <div (click)="navigateTo('requests')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent relative"
                  [class]="isActive('/requests') || isActive('/printing') ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'"
                  [title]="state.sidebarCollapsed() ? 'Yêu cầu & In phiếu' : ''">
                @if(isActive('/requests') || isActive('/printing')) {
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-fuchsia-600 dark:bg-fuchsia-500 rounded-r-full"></div>
                }
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 relative"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/requests') || isActive('/printing') ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'">
                   <i class="fa-solid fa-clipboard-list text-xs"></i>
                   @if(state.sidebarCollapsed() && state.requests().length > 0) {
                       <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                   }
                </div>
                @if (!state.sidebarCollapsed()) {
                    <div class="flex-1 flex justify-between items-center ml-3 fade-in">
                        <span class="text-sm font-bold" [class]="isActive('/requests') || isActive('/printing') ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'">Quản lý Yêu cầu</span>
                        @if(state.requests().length > 0) {
                            <span class="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">{{state.requests().length}}</span>
                        }
                    </div>
                }
             </div>
         }

         <!-- LƯU TRỮ -->
         @if (!state.sidebarCollapsed()) {
             <div class="px-3 pt-4 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider fade-in">Lưu trữ</div>
         } @else {
             <div class="h-4 border-t border-slate-100 dark:border-slate-800 mx-3 mt-2"></div>
         }

         <!-- Inventory -->
         @if(auth.canViewInventory()) {
             <div (click)="navigateTo('inventory')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent relative"
                  [class]="isActive('/inventory') || isActive('/labels') ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'"
                  [title]="state.sidebarCollapsed() ? 'Kho Hóa chất' : ''">
                @if(isActive('/inventory') || isActive('/labels')) {
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-fuchsia-600 dark:bg-fuchsia-500 rounded-r-full"></div>
                }
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/inventory') || isActive('/labels') ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'">
                   <i class="fa-solid fa-boxes-stacked text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/inventory') || isActive('/labels') ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'">Kho Hóa chất</span>
                }
             </div>
         }

         <!-- Standards -->
         @if(auth.canViewStandards()) {
             <div (click)="navigateTo('standards')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent relative"
                  [class]="isActive('/standards') ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'"
                  [title]="state.sidebarCollapsed() ? 'Chuẩn Đối chiếu' : ''">
                @if(isActive('/standards')) {
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-fuchsia-600 dark:bg-fuchsia-500 rounded-r-full"></div>
                }
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/standards') ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'">
                   <i class="fa-solid fa-vial-circle-check text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/standards') ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'">Chuẩn Đối chiếu</span>
                }
             </div>
         }
      </div>

      <!-- 3. Footer (User Profile) -->
      <div class="px-4 py-3 mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative">
          <!-- Popover Menu -->
          @if(profileMenuOpen()) {
              <div class="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden fade-in z-50">
                  <div class="p-2 space-y-1">
                      <button (click)="openAccountSettings()" class="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors text-left">
                          <i class="fa-solid fa-user-gear w-4 text-center"></i>
                          <span>Cài đặt tài khoản</span>
                      </button>
                      <button (click)="toggleDarkMode()" class="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors text-left">
                          <i class="fa-solid w-4 text-center" [class.fa-moon]="!state.darkMode()" [class.fa-sun]="state.darkMode()"></i>
                          <span>{{ state.darkMode() ? 'Giao diện Sáng' : 'Giao diện Tối' }}</span>
                      </button>
                      <div class="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                      <button (click)="auth.logout()" class="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left font-medium">
                          <i class="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
                          <span>Đăng xuất</span>
                      </button>
                  </div>
              </div>
              <!-- Backdrop for popover -->
              <div class="fixed inset-0 z-40" (click)="profileMenuOpen.set(false)"></div>
          }

          @if(!state.sidebarCollapsed()) {
              <div class="flex items-center gap-3 fade-in cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 -mx-2 rounded-xl transition-colors" (click)="toggleProfileMenu()">
                  <!-- Updated Avatar Call with Online Indicator -->
                  <div class="relative shrink-0">
                      <img [src]="getAvatarUrl(auth.currentUser()?.displayName, state.avatarStyle(), auth.currentUser()?.photoURL)" 
                           class="w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 object-cover" 
                           alt="User">
                      <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900"
                            [class]="isOnline() ? 'bg-emerald-500' : 'bg-red-500'"
                            [title]="isOnline() ? 'Online' : 'Offline'"></span>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                      <div class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{auth.currentUser()?.displayName}}</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">{{auth.currentUser()?.role}}</div>
                  </div>
                  
                  <div class="w-7 h-7 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <i class="fa-solid fa-chevron-up text-xs transition-transform" [class.rotate-180]="profileMenuOpen()"></i>
                  </div>
              </div>
          } @else {
              <div class="flex justify-center relative cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 -mx-2 rounded-xl transition-colors" (click)="toggleProfileMenu()">
                  <!-- Updated Avatar Call with Online Indicator -->
                  <img [src]="getAvatarUrl(auth.currentUser()?.displayName, state.avatarStyle(), auth.currentUser()?.photoURL)" 
                       class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 object-cover" 
                       title="Tài khoản">
                  <span class="absolute bottom-2 right-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900"
                        [class]="isOnline() ? 'bg-emerald-500' : 'bg-red-500'"
                        [title]="isOnline() ? 'Online' : 'Offline'"></span>
              </div>
          }
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  auth = inject(AuthService);
  router: Router = inject(Router);
  qrService = inject(QrGlobalService); // Inject service
  toast = inject(ToastService);
  getAvatarUrl = getAvatarUrl;

  isOnline = signal(navigator.onLine);
  profileMenuOpen = signal(false);

  private onlineListener: any;
  private offlineListener: any;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.qrService.startScan();
    }
  }

  toggleProfileMenu() {
    this.profileMenuOpen.set(!this.profileMenuOpen());
  }

  openAccountSettings() {
    this.profileMenuOpen.set(false);
    this.router.navigate(['/config']);
  }

  toggleDarkMode() {
    this.state.toggleDarkMode();
    this.profileMenuOpen.set(false);
  }

  showComingSoon(feature: string) {
    this.toast.show(`Tính năng "${feature}" đang được phát triển.`, 'info');
    this.profileMenuOpen.set(false);
  }

  ngOnInit() {
      this.onlineListener = () => this.isOnline.set(true);
      this.offlineListener = () => this.isOnline.set(false);
      window.addEventListener('online', this.onlineListener);
      window.addEventListener('offline', this.offlineListener);
  }

  ngOnDestroy() {
      window.removeEventListener('online', this.onlineListener);
      window.removeEventListener('offline', this.offlineListener);
  }

  navigateTo(path: string) {
      this.router.navigate(['/' + path]);
      this.state.closeSidebar();
      
      if (path !== 'calculator' && path !== 'editor') {
          this.state.selectedSop.set(null);
      }
  }

  isActive(path: string): boolean { return this.router.url.includes(path); }
}
