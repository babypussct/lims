import { Component, inject, signal, OnInit, OnDestroy, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { AuthService } from '../services/auth.service';
import { QrGlobalService } from '../services/qr-global.service';
import { ToastService } from '../services/toast.service';
import { getAvatarUrl } from '../../shared/utils/utils';

export interface MenuItem {
  name: string;
  icon: string;
  path: string;
  activeMatch: string[];
  hidden?: boolean;
  hasBadge?: boolean;
}

export interface MenuGroup {
  id: string;
  title: string;
  items: MenuItem[];
}

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
      <div class="px-4 mt-2 mb-2 md:hidden">
          <button (click)="qrService.startScan()" 
                  class="w-full flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white p-3 rounded-xl shadow-md shadow-slate-300 dark:shadow-none transition-all active:scale-95 group overflow-hidden relative">
              <i class="fa-solid fa-qrcode text-lg relative z-10 group-hover:scale-110 transition-transform"></i>
              @if (!state.sidebarCollapsed()) {
                  <div class="flex items-center justify-between flex-1 relative z-10 fade-in">
                      <span class="font-bold text-xs uppercase tracking-wider">Quét Mã</span>
                      <span class="text-[9px] font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-white/80">⌘K</span>
                  </div>
              }
          </button>
      </div>
      <hr class="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent border-none mx-4 mb-2 md:hidden" />

      <!-- 3. Modules Menu -->
      <div class="px-3 py-3 shrink-0 flex-1 overflow-y-auto custom-scrollbar">
         
         @for (group of menuGroups(); track group.id) {
             <!-- Group Header (Accordion Toggle) -->
             @if (!state.sidebarCollapsed()) {
                 <div (click)="toggleGroup(group.id)" 
                      class="px-3 pt-5 pb-2 flex justify-between items-center cursor-pointer group/header hover:bg-slate-100/80 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-200 mt-1 select-none">
                     <div class="flex items-center gap-2">
                         <div class="w-1.5 h-1.5 rounded-full bg-fuchsia-400/60 dark:bg-fuchsia-500/40"></div>
                         <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest fade-in group-hover/header:text-fuchsia-600 dark:group-hover/header:text-fuchsia-400 transition-colors">
                             {{ group.title }}
                         </span>
                     </div>
                     <i class="fa-solid fa-chevron-down text-[9px] text-slate-300 dark:text-slate-600 group-hover/header:text-fuchsia-500 transition-all duration-300"
                        [class.-rotate-90]="!expandedGroups()[group.id]"></i>
                 </div>
             } @else {
                 <div class="mx-3 mt-5 mb-2 flex justify-center">
                     <div class="w-6 h-[2px] rounded-full bg-slate-200 dark:bg-slate-700"></div>
                 </div>
             }

             <!-- Group Items -->
             <div class="space-y-1.5 transition-all duration-300 overflow-hidden mt-1"
                  [ngClass]="(!state.sidebarCollapsed() && !expandedGroups()[group.id]) ? 'max-h-0 opacity-0 mt-0' : 'max-h-[1000px] opacity-100'">
                 @for (item of group.items; track item.path) {
                     @if(!item.hidden) {
                         <div (click)="navigateTo(item.path)" 
                              class="group flex items-center px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.97] relative select-none"
                              [ngClass]="isActive(item.activeMatch) 
                                ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-200/60 dark:border-fuchsia-800/30 shadow-sm' 
                                : 'border border-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/40 hover:border-slate-200/50 dark:hover:border-slate-700/50 hover:shadow-sm'"
                              [title]="state.sidebarCollapsed() ? item.name : ''">
                            
                            @if(isActive(item.activeMatch)) {
                                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-fuchsia-500 dark:bg-fuchsia-400 rounded-r-full shadow-sm shadow-fuchsia-300 dark:shadow-none"></div>
                            }
                            
                            <div class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 relative"
                                 [class.mx-auto]="state.sidebarCollapsed()"
                                 [ngClass]="isActive(item.activeMatch) 
                                   ? 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm' 
                                   : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 group-hover:shadow-sm group-hover:scale-110'">
                               <i class="fa-solid {{item.icon}} text-xs"></i>
                               @if(item.hasBadge && state.sidebarCollapsed() && requestsCount() > 0) {
                                   <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                               }
                            </div>
                            
                            @if (!state.sidebarCollapsed()) {
                                <div class="flex-1 flex justify-between items-center ml-3 fade-in">
                                    <span class="text-[13px] font-semibold transition-colors duration-200" [ngClass]="isActive(item.activeMatch) ? 'text-fuchsia-700 dark:text-fuchsia-300 font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'">
                                        {{item.name}}
                                    </span>
                                    @if(item.hasBadge && requestsCount() > 0) {
                                        <span class="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">{{requestsCount()}}</span>
                                    }
                                </div>
                            }
                         </div>
                     }
                 }
             </div>
         }
      </div>

      <!-- 4. Footer (User Profile) -->
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
              <div class="fixed inset-0 z-40" (click)="profileMenuOpen.set(false)"></div>
          }

          @if(!state.sidebarCollapsed()) {
              <div class="flex items-center gap-3 fade-in cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 -mx-2 rounded-xl transition-colors" (click)="toggleProfileMenu()">
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
                  <img [src]="getAvatarUrl(auth.currentUser()?.displayName, state.avatarStyle(), auth.currentUser()?.photoURL)" 
                       class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 object-cover" 
                       title="Tài khoản">
                  <span class="absolute bottom-2 right-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900"
                        [class]="isOnline() ? 'bg-emerald-500' : 'bg-red-500'"></span>
              </div>
          }
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  auth = inject(AuthService);
  router = inject(Router);
  qrService = inject(QrGlobalService);
  toast = inject(ToastService);
  getAvatarUrl = getAvatarUrl;

  isOnline = signal(navigator.onLine);
  profileMenuOpen = signal(false);
  
  // Trạng thái mảng nhóm
  expandedGroups = signal<Record<string, boolean>>({
    'overview': true,
    'operation': true,
    'storage': true,
    'system': true
  });

  private onlineListener: any;
  private offlineListener: any;

  // Signal để tiện query array length trong template
  requestsCount = computed(() => this.state.requests().length);

  // Mảng dữ liệu cấu hình
  menuGroups = computed<MenuGroup[]>(() => [
    {
      id: 'overview',
      title: 'Tổng quan',
      items: [
        { name: 'Trang chủ', icon: 'fa-house', path: 'dashboard', activeMatch: ['/dashboard'] },
        { name: 'Báo cáo', icon: 'fa-chart-pie', path: 'stats', activeMatch: ['/stats'], hidden: !this.auth.canViewReports() }
      ]
    },
    {
      id: 'operation',
      title: 'Vận hành',
      items: [
        { name: 'Chạy Mẻ (Smart)', icon: 'fa-wand-magic-sparkles', path: 'smart-batch', activeMatch: ['/smart-batch'], hidden: !this.auth.canViewSop() },
        { name: 'Vận hành (SOP)', icon: 'fa-play pl-0.5', path: 'calculator', activeMatch: ['/calculator', '/editor', '/recipes'], hidden: !this.auth.canViewSop() },
        { name: 'Trạm Pha Chế', icon: 'fa-flask-vial', path: 'prep', activeMatch: ['/prep'], hidden: !this.auth.canViewInventory() },
        { name: 'Quản lý Yêu cầu', icon: 'fa-clipboard-list', path: 'requests', activeMatch: ['/requests', '/printing'], hidden: !this.auth.canViewSop(), hasBadge: true }
      ]
    },
    {
      id: 'storage',
      title: 'Lưu trữ',
      items: [
        { name: 'Kho Hóa chất', icon: 'fa-boxes-stacked', path: 'inventory', activeMatch: ['/inventory', '/labels'], hidden: !this.auth.canViewInventory() },
        { name: 'Chuẩn Đối chiếu', icon: 'fa-vial-circle-check', path: 'standards', activeMatch: ['/standards'], hidden: !this.auth.canViewStandards() },
        { name: 'Yêu cầu Chuẩn', icon: 'fa-clipboard-check', path: 'standard-requests', activeMatch: ['/standard-requests'], hidden: !this.auth.canViewStandards() },
        { name: 'Nhật ký dùng chuẩn', icon: 'fa-clock-rotate-left', path: 'standard-usage', activeMatch: ['/standard-usage'], hidden: !this.auth.canViewStandardLogs() }
      ]
    },
    {
      id: 'system',
      title: 'Hệ thống',
      items: [
        { name: 'Truy xuất nguồn gốc', icon: 'fa-magnifying-glass-location', path: 'traceability', activeMatch: ['/traceability'] }
      ]
    }
  ]);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.qrService.startScan();
    }
  }

  toggleGroup(groupId: string) {
    this.expandedGroups.update(groups => ({
      ...groups,
      [groupId]: !groups[groupId]
    }));
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

  isActive(paths: string[]): boolean { 
      return paths.some(p => this.router.url.includes(p));
  }
}
