import { Component, inject, signal, computed, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { QrGlobalService } from '../services/qr-global.service';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';
import { getAvatarUrl } from '../../shared/utils/utils';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { LogoComponent } from '../../shared/components/logo.component';
import { ToastService } from '../services/toast.service';
import { filter } from 'rxjs/operators';

interface MenuItem {
  id?: string;
  name: string;
  icon: string;
  path?: string;
  color?: string;
  action?: () => void;
  visible?: boolean;
  isLocked?: boolean;
  lockPermission?: string;
  isActive?: boolean;
  customClass?: string;
  isSpecial?: boolean;
}

interface MenuGroup {
  id: string;
  title: string;
  accentClass: string;
  items: MenuItem[];
}

interface BottomTab {
  id: string;
  name: string;
  icon: string;
  path: string;
  activeColor: string;
  visible: boolean;
}

interface VisitedPage {
  name: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationBellComponent, LogoComponent],
  template: `
    <!-- INSTALL GUIDE OVERLAY (iOS Style) -->
    @if (showInstallGuide()) {
        <div class="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-sm fade-in flex flex-col items-center justify-end pb-10" (click)="toggleInstallGuide()">
            <div class="w-full max-w-sm px-6 text-center animate-slide-up" (click)="$event.stopPropagation()">
                <div class="mb-6 flex justify-center">
                    <div class="w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl flex items-center justify-center">
                        <app-logo size="96px"></app-logo>
                    </div>
                </div>
                <h3 class="text-white font-bold text-xl mb-2">Cài Đặt LIMS Pro</h3>
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
                    <button (click)="toggleInstallGuide()" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition active:scale-95">Đã Hiểu</button>
                </div>

                <!-- Bounce Arrow pointing down -->
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
                    <i class="fa-solid fa-arrow-down text-2xl"></i>
                </div>
            </div>
        </div>
    }

    <!-- MENU OVERLAY (Bottom Sheet) -->
    @if (showMenu() || isClosing()) {
        <!-- Backdrop -->
        <div class="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm transition-opacity duration-250 ease-out"
             [class.opacity-0]="isClosing()"
             [class.opacity-100]="!isClosing()"
             (click)="closeMenu()"></div>

        <!-- Bottom Sheet Panel -->
        <div class="fixed bottom-0 right-0 left-0 z-[50] bg-white dark:bg-slate-900 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-slate-200 dark:border-slate-800 overflow-hidden origin-bottom transition-transform duration-250 ease-out"
             [class.animate-slide-up]="!isClosing()"
             [class.translate-y-full]="isClosing()"
             [style.transform]="dragTransform() > 0 && !isClosing() ? 'translateY(' + dragTransform() + 'px)' : ''"
             (touchstart)="onTouchStartPanel($event)"
             (touchmove)="onTouchMovePanel($event)"
             (touchend)="onTouchEndPanel()">

            <!-- Drag indicator -->
            <div class="w-full flex justify-center pt-3 pb-1" (click)="closeMenu()">
                <div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            </div>

            <!-- User Profile Header -->
            <div class="px-5 pb-3 pt-1 flex items-center gap-3 active:scale-[0.98] transition-transform" (click)="navTo('/config')">
                <img [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
                     class="w-11 h-11 rounded-full border-2 border-white dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 object-cover">
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{{auth.currentUser()?.displayName}}</div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{{auth.currentUser()?.email}}</div>
                </div>
                <div class="flex flex-col items-end">
                    <span class="text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{{auth.currentUser()?.role}}</span>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-300 dark:text-slate-600 text-xs ml-1"></i>
            </div>

            <!-- Quick Actions & Recently Visited (Sticky under header) -->
            <div class="px-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <!-- Recently Visited -->
                @if (recentlyVisited().length > 0) {
                    <div class="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                       <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 mr-1"><i class="fa-solid fa-clock-rotate-left mr-1"></i> Gần đây:</span>
                       @for (page of recentlyVisited(); track page.path) {
                           <button (click)="navTo(page.path, page.name, page.icon)" class="shrink-0 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 active:scale-95 transition-transform">
                               <i class="fa-solid {{page.icon}} text-[10px]"></i> {{page.name}}
                           </button>
                       }
                    </div>
                }

                <div class="flex gap-3">
                    <button (click)="startScan()" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-sm shadow-md active:scale-95 transition-transform">
                        <i class="fa-solid fa-qrcode text-lg"></i> Quét Mã
                    </button>
                    @if(auth.canViewSop()) {
                        <button (click)="navTo('/results', 'Nhập kết quả', 'fa-square-poll-vertical')" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 font-bold text-sm shadow-sm active:scale-95 transition-transform border border-fuchsia-200 dark:border-fuchsia-800/50">
                            <i class="fa-solid fa-square-poll-vertical text-lg"></i> Nhập Kết Quả
                        </button>
                    }
                </div>
            </div>

            <!-- Content (Scrollable) -->
            <div class="px-5 py-4 max-h-[50vh] overflow-y-auto custom-scrollbar pb-10">
                @defer (when showMenu()) {
                    <div class="space-y-6">
                        @for (group of menuGroups(); track group.id) {
                            <div>
                                <div class="flex items-center gap-2 mb-3 px-1">
                                    <div class="w-1.5 h-1.5 rounded-full" [ngClass]="group.accentClass.split(' ')[0].replace('from-', 'bg-').replace('/15', '')"></div>
                                    <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ group.title }}</span>
                                </div>
                                <div class="grid grid-cols-4 gap-x-2 gap-y-4">
                                    @for (item of group.items; track item.name) {
                                        @if (!item.isSpecial) {
                                            <button (click)="item.isLocked ? handleLockedItemClick(item) : (item.action ? item.action() : (item.path ? navTo(item.path, item.name, item.icon) : null))"
                                                    [class.opacity-50]="item.isLocked"
                                                    [class.grayscale]="item.isLocked"
                                                    [class.cursor-not-allowed]="item.isLocked"
                                                    class="flex flex-col items-center gap-1.5 group active:scale-90 transition-transform relative">
                                                <div class="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-xl transition-all border relative"
                                                     [ngClass]="item.isLocked
                                                       ? 'bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200/50 dark:border-slate-700/50'
                                                       : (item.isActive ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md scale-105 border-transparent' : (item.customClass || group.accentClass) + ' bg-gradient-to-tr shadow-sm')">

                                                    @if (item.isActive && state.darkMode()) {
                                                      <i class="fa-solid {{item.icon}}"></i>
                                                    } @else if (item.isActive && !state.darkMode()) {
                                                      <i class="fa-solid {{item.icon}} !text-white z-10 relative"></i>
                                                    } @else {
                                                      <i class="fa-solid {{item.icon}}"></i>
                                                    }

                                                    @if(item.isLocked) {
                                                        <span class="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                                                            <i class="fa-solid fa-lock text-[8px] text-amber-500"></i>
                                                        </span>
                                                    }
                                                </div>
                                                <span class="text-[10px] font-bold text-center leading-tight px-0.5"
                                                      [ngClass]="item.isLocked ? 'text-slate-400 dark:text-slate-500' : (item.isActive ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400')">
                                                    {{item.name}}
                                                </span>
                                            </button>
                                        }
                                    }
                                </div>
                            </div>
                        }
                    </div>
                } @placeholder {
                    <div class="h-40 flex items-center justify-center">
                        <i class="fa-solid fa-spinner fa-spin text-slate-300 text-2xl"></i>
                    </div>
                }
            </div>
        </div>
    }

    <!-- MAIN BOTTOM BAR -->
    <div class="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-8px_30px_-6px_rgba(0,0,0,0.1)] dark:shadow-none z-[40] md:hidden pb-safe">

      <!-- Page Breadcrumb Label -->
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none fade-in">
          <div class="bg-slate-800 dark:bg-slate-700 text-white text-[9px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider border border-slate-600">
              {{ pageTitle() }}
          </div>
      </div>

      <div class="flex items-center justify-around h-[72px] px-1 relative pt-1">

        <!-- Tabs 0 and 1 -->
        @for (tab of bottomTabs().slice(0, 2); track tab.id) {
            <button (click)="navTo(tab.path, tab.name, tab.icon)" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
                   [class]="isActive(tab.path) ? tab.activeColor + ' shadow-inner scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
                <i class="fa-solid {{tab.icon}} text-[1.1rem] transition-transform duration-300" [class.-translate-y-0.5]="isActive(tab.path)"></i>
              </div>
              <span class="text-[9px] font-bold transition-colors"
                    [ngClass]="isActive(tab.path) ? tab.activeColor.split(' ')[0] : 'text-slate-400 dark:text-slate-500'">{{ tab.name }}</span>

              <!-- Active Dot -->
              @if (isActive(tab.path)) {
                 <div class="absolute bottom-0.5 w-1 h-1 rounded-full animate-fade-in" [ngClass]="tab.activeColor.split(' ')[0].replace('text-', 'bg-')"></div>
              }
            </button>
        }

        <!-- Notification Bell (Center/Fixed) -->
        <div class="flex flex-col items-center justify-center min-w-[60px] group pb-0.5">
            <app-notification-bell [bottomNavMode]="true"></app-notification-bell>
        </div>

        <!-- Tab 2 -->
        @for (tab of bottomTabs().slice(2, 3); track tab.id) {
            <button (click)="navTo(tab.path, tab.name, tab.icon)" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
                   [class]="isActive(tab.path) ? tab.activeColor + ' shadow-inner scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
                <i class="fa-solid {{tab.icon}} text-[1.1rem] transition-transform duration-300" [class.-translate-y-0.5]="isActive(tab.path)"></i>
              </div>
              <span class="text-[9px] font-bold transition-colors"
                    [ngClass]="isActive(tab.path) ? tab.activeColor.split(' ')[0] : 'text-slate-400 dark:text-slate-500'">{{ tab.name }}</span>

              <!-- Active Dot -->
              @if (isActive(tab.path)) {
                 <div class="absolute bottom-0.5 w-1 h-1 rounded-full animate-fade-in" [ngClass]="tab.activeColor.split(' ')[0].replace('text-', 'bg-')"></div>
              }
            </button>
        }

        <!-- MORE MENU (Always) -->
        <button (click)="toggleMenu()" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
               [class]="showMenu() ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-md scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
            <i class="fa-solid text-[1.1rem] transition-transform duration-300" [class]="showMenu() ? 'fa-xmark rotate-90' : 'fa-bars'"></i>

            <!-- Badge -->
            @if (requestsCount() > 0 && !showMenu()) {
               <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            }
          </div>
          <span class="text-[9px] font-bold transition-colors"
                [class]="showMenu() ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'">{{ showMenu() ? 'Đóng' : 'Menu' }}</span>
        </button>

      </div>
    </div>
  `,
  styles: [`
    .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
    @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class BottomNavComponent implements OnInit, OnDestroy {
  router = inject(Router);
  state = inject(StateService);
  qrService = inject(QrGlobalService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  getAvatarUrl = getAvatarUrl;

  showMenu = signal(false);
  isClosing = signal(false);
  showInstallGuide = signal(false);
  currentUrl = signal('');

  // Swipe to dismiss state
  private touchStartY = 0;
  private currentY = 0;
  dragTransform = signal(0);

  // Recently visited
  recentlyVisited = signal<VisitedPage[]>([]);

  // Computed for badge on "Thêm"
  requestsCount = computed(() => this.state.requests().length);

  // Computed page label
  pageTitle = computed(() => {
    const url = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
    const titles: Record<string, string> = {
        'dashboard': 'Trang Chủ',
        'inventory': 'Kho Hóa Chất',
        'calculator': 'Vận Hành SOP',
        'requests': 'Quản Lý Yêu Cầu',
        'stats': 'Báo Cáo',
        'config': 'Cấu Hình',
        'standards': 'Chất Chuẩn Đối Chiếu',
        'recipes': 'Thư Viện Công Thức',
        'prep': 'Trạm Pha Chế',
        'daily-checklist': 'Theo dõi mẫu ngày',
        'smart-batch': 'Lập Mẻ Phân Tích',
        'traceability': 'Truy xuất nguồn gốc',
        'documents': 'Giao Nhận Mẫu',
        'results': 'Kết Quả Phân Tích',
        'labels': 'In Tem Nhãn',
        'standard-requests': 'Yêu cầu chuẩn',
        'standard-usage': 'Nhật Ký Chất Chuẩn'
    };
    return titles[url] || 'LIMS Cloud';
  });

  private routerSub: any;

  ngOnInit() {
    this.currentUrl.set(this.router.url);
    this.routerSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.currentUrl.set(event.urlAfterRedirects);
    });

    this.loadRecentlyVisited();
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  haptic(duration = 10) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(duration); } catch(e) {}
    }
  }

  handleLockedItemClick(item: MenuItem) {
    this.haptic();
    this.toast.show(`Cần quyền "${item.lockPermission}" · Liên hệ quản trị viên để được cấp`, 'warning');
  }

  toggleDarkMode() {
    this.haptic();
    this.state.toggleDarkMode();
    this.closeMenu();
  }

  toggleMenu() {
    this.haptic();
    if (this.showMenu()) {
      this.closeMenu();
    } else {
      this.showInstallGuide.set(false);
      this.showMenu.set(true);
      this.isClosing.set(false);
    }
  }

  closeMenu() {
    if (!this.showMenu()) return;
    this.isClosing.set(true);
    setTimeout(() => {
      this.showMenu.set(false);
      this.isClosing.set(false);
      this.dragTransform.set(0);
    }, 250); // match animation duration
  }

  startScan() {
    this.haptic();
    this.closeMenu();
    this.qrService.startScan();
  }

  toggleInstallGuide() {
    this.haptic();
    this.showInstallGuide.update(v => !v);
    if (this.showInstallGuide()) this.closeMenu();
  }

  navTo(path: string, name?: string, icon?: string) {
    this.haptic();
    this.closeMenu();
    this.showInstallGuide.set(false);
    this.router.navigate([path]);

    if (name && icon && path !== '/dashboard') {
      this.saveToRecentlyVisited({ name, path, icon });
    }
  }

  isActive(path: string): boolean {
    return this.currentUrl().includes(path);
  }

  // --- RECENTLY VISITED LOGIC ---
  saveToRecentlyVisited(page: VisitedPage) {
    let recent = [...this.recentlyVisited()];
    // Remove if exists
    recent = recent.filter(p => p.path !== page.path);
    // Add to front
    recent.unshift(page);
    // Keep max 3
    if (recent.length > 3) recent.pop();

    this.recentlyVisited.set(recent);
    try {
      localStorage.setItem('lims_recently_visited', JSON.stringify(recent));
    } catch (e) {}
  }

  loadRecentlyVisited() {
    try {
      const stored = localStorage.getItem('lims_recently_visited');
      if (stored) {
        this.recentlyVisited.set(JSON.parse(stored));
      }
    } catch (e) {}
  }

  // --- SWIPE TO DISMISS LOGIC ---
  onTouchStartPanel(e: TouchEvent) {
    if (this.isClosing()) return;
    this.touchStartY = e.touches[0].clientY;
  }

  onTouchMovePanel(e: TouchEvent) {
    if (this.touchStartY === 0 || this.isClosing()) return;
    this.currentY = e.touches[0].clientY;
    const deltaY = this.currentY - this.touchStartY;

    // Only drag down
    if (deltaY > 0) {
      // Add slight resistance
      this.dragTransform.set(deltaY * 0.8);
      // Prevent default scrolling if dragging sheet down
      if (deltaY > 10) e.preventDefault();
    }
  }

  onTouchEndPanel() {
    if (this.touchStartY === 0 || this.isClosing()) return;
    const deltaY = this.currentY - this.touchStartY;

    if (deltaY > 80) {
      this.closeMenu();
    } else {
      // Snap back
      this.dragTransform.set(0);
    }

    this.touchStartY = 0;
    this.currentY = 0;
  }

  // --- COMPUTED GROUPS & TABS ---
  menuGroups = computed<MenuGroup[]>(() => {
    const showLocked = this.state.showLockedFeatures();
    const canViewInv = this.auth.canViewInventory();
    const canViewSop = this.auth.canViewSop();
    const canRunBatch = this.auth.canRunBatch();
    const canViewStd = this.auth.canViewStandards();
    const canViewStdLog = this.auth.hasPermission('standard_log_view');
    const canViewRecipes = this.auth.canViewRecipes();
    const canViewRep = this.auth.canViewReports();
    const isManager = this.auth.currentUser()?.role === 'manager';

    const list: MenuGroup[] = [
      {
        id: 'operations',
        title: 'Nghiệp vụ và vận hành',
        accentClass: 'from-purple-500/15 to-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/30',
        items: [
          { id: 'inventory', name: 'Kho Hóa Chất', icon: 'fa-boxes-stacked', path: '/inventory', color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50', visible: canViewInv || showLocked, isLocked: !canViewInv, lockPermission: 'inventory_view' },
          { id: 'calculator', name: 'Vận Hành SOP', icon: 'fa-list-check', path: '/calculator', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50', visible: canViewSop || showLocked, isLocked: !canViewSop, lockPermission: 'sop_view' },
          { id: 'smart-batch', name: 'Lập Mẻ Phân Tích', icon: 'fa-layer-group', path: '/smart-batch', color: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800/50', visible: canRunBatch || showLocked, isLocked: !canRunBatch, lockPermission: 'batch_run' },
          { id: 'prep', name: 'Trạm Pha Chế', icon: 'fa-flask-vial', path: '/prep', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50', visible: canRunBatch || showLocked, isLocked: !canRunBatch, lockPermission: 'batch_run' },
          { id: 'documents', name: 'Giao Nhận Mẫu', icon: 'fa-file-signature', path: '/documents', color: 'bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-100 dark:border-fuchsia-800/50', visible: true, isLocked: false },
          { id: 'results', name: 'Kết Quả Phân Tích', icon: 'fa-vials', path: '/results', color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800/50', visible: canViewSop || showLocked, isLocked: !canViewSop, lockPermission: 'sop_view' },
          { id: 'recipes', name: 'Công Thức', icon: 'fa-book-bookmark', path: '/recipes', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/50', visible: canViewRecipes || showLocked, isLocked: !canViewRecipes, lockPermission: 'recipe_view' },
          { id: 'labels', name: 'In Tem Nhãn', icon: 'fa-barcode', path: '/labels', color: 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-800/50', visible: canViewInv || showLocked, isLocked: !canViewInv, lockPermission: 'inventory_view' },
          { id: 'stats', name: 'Báo Cáo', icon: 'fa-chart-pie', path: '/stats', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50', visible: canViewRep || showLocked, isLocked: !canViewRep, lockPermission: 'report_view' }
        ]
      },
      {
        id: 'standards',
        title: 'Chất Chuẩn Đối Chiếu',
        accentClass: 'from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30',
        items: [
          { id: 'standards', name: 'Danh Sách Chất Chuẩn', icon: 'fa-vial-circle-check', path: '/standards', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50', visible: canViewStd || showLocked, isLocked: !canViewStd, lockPermission: 'standard_view' },
          { id: 'standard-requests', name: 'Yêu Cầu Chất Chuẩn', icon: 'fa-clipboard-list', path: '/standard-requests', color: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/50', visible: canViewStd || showLocked, isLocked: !canViewStd, lockPermission: 'standard_view' },
          { id: 'standard-usage', name: 'Nhật Ký Sử Dụng Chất Chuẩn', icon: 'fa-book-open', path: '/standard-usage', color: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50', visible: canViewStdLog || showLocked, isLocked: !canViewStdLog, lockPermission: 'standard_log_view' }
        ]
      },
      {
        id: 'system',
        title: 'Hệ thống và tiện ích',
        accentClass: 'from-slate-500/15 to-slate-700/15 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/30',
        items: [
          { id: 'scan', name: 'Quét QR', icon: 'fa-qrcode', action: () => this.startScan(), color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50', visible: true, isLocked: false },
          { id: 'dark-mode', name: 'Giao Diện', icon: 'fa-moon', action: () => this.toggleDarkMode(), color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700', visible: true, isLocked: false },
          { id: 'install-pwa', name: 'Cài Ứng Dụng', icon: 'fa-download', action: () => this.toggleInstallGuide(), color: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800/50', visible: true, isLocked: false },
          { id: 'config', name: 'Cấu Hình', icon: 'fa-gear', path: '/config', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700', visible: isManager || showLocked, isLocked: !isManager, lockPermission: 'role_manager' },
          { id: 'logout', name: 'Đăng Xuất', icon: 'fa-right-from-bracket', action: () => this.auth.logout(), color: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50', visible: true, isLocked: false }
        ]
      }
    ];

    return list.map(group => ({
      ...group,
      items: group.items.filter(item => item.visible)
    })).filter(group => group.items.length > 0);
  });

  bottomTabs = computed<BottomTab[]>(() => {
    const tabs: BottomTab[] = [];
    tabs.push({ id: 'dashboard', name: 'Trang Chủ', icon: 'fa-house', path: '/dashboard', activeColor: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30', visible: true });
    if (this.auth.canViewInventory()) {
      tabs.push({ id: 'inventory', name: 'Kho', icon: 'fa-boxes-stacked', path: '/inventory', activeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30', visible: true });
    } else {
      tabs.push({ id: 'documents', name: 'Giao nhận', icon: 'fa-file-signature', path: '/documents', activeColor: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30', visible: true });
    }
    if (this.auth.canRunBatch()) {
      tabs.push({ id: 'smart-batch', name: 'Lập mẻ', icon: 'fa-layer-group', path: '/smart-batch', activeColor: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30', visible: true });
    } else if (this.auth.canViewReports()) {
      tabs.push({ id: 'stats', name: 'Báo Cáo', icon: 'fa-chart-pie', path: '/stats', activeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30', visible: true });
    } else if (this.auth.canViewStandards()) {
      tabs.push({ id: 'standards', name: 'Chuẩn', icon: 'fa-vial-circle-check', path: '/standards', activeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30', visible: true });
    } else {
      tabs.push({ id: 'documents', name: 'Giao nhận', icon: 'fa-file-signature', path: '/documents', activeColor: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30', visible: true });
    }
    return tabs.slice(0, 3);
  });
}
