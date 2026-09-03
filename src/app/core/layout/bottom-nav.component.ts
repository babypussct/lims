import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PwaInstallPromptComponent } from '../../shared/components/pwa-install-prompt.component';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { getAvatarUrl } from '../../shared/utils/utils';
import { AuthService } from '../services/auth.service';
import { QrGlobalService } from '../services/qr-global.service';
import { StateService } from '../services/state.service';
import { ToastService } from '../services/toast.service';
import { ModalA11yDirective } from '../../shared/directives/modal-a11y.directive';
import {
  NAVIGATION_GROUPS,
  NavigationAccess,
  NavigationItem,
  ROUTE_ACCESS,
  ROUTE_TITLES
} from './navigation.config';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  path?: string;
  action?: () => void;
  isLocked: boolean;
  lockPermission?: string;
  badgeKey?: 'requests';
  activeMatch?: string[];
  kind?: 'install';
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
  activeMatch: string[];
}

interface VisitedPage {
  name: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationBellComponent, PwaInstallPromptComponent, ModalA11yDirective],
  template: `
    @if (showMenu() || isClosing()) {
      <div
        class="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm transition-opacity duration-250 ease-out"
        [class.opacity-0]="isClosing()"
        [class.opacity-100]="!isClosing()"
        (click)="closeMenu()"></div>

      <div
        appModalA11y
        modalLabelledBy="bottom-nav-menu-title"
        (modalEscape)="closeMenu()"
        id="bottom-nav-menu"
        class="fixed bottom-0 right-0 left-0 z-[50] max-h-[calc(100dvh-env(safe-area-inset-top,0px)-0.5rem)] flex flex-col
               bg-white dark:bg-slate-900 rounded-t-2xl
               shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-slate-200 dark:border-slate-800
               overflow-hidden origin-bottom transition-transform duration-250 ease-out pb-safe"
        [class.animate-slide-up]="!isClosing()"
        [class.translate-y-full]="isClosing()"
        [style.transform]="dragTransform() > 0 && !isClosing() ? 'translateY(' + dragTransform() + 'px)' : ''"
        (touchstart)="onTouchStartPanel($event)"
        (touchmove)="onTouchMovePanel($event)"
        (touchend)="onTouchEndPanel()">

        <h2 id="bottom-nav-menu-title" class="sr-only">Menu điều hướng</h2>

        <button
          type="button"
          class="w-full flex justify-center pt-3 pb-1 shrink-0"
          aria-label="Đóng menu"
          (click)="closeMenu()">
          <span class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
        </button>

        <button
          type="button"
          class="w-full px-5 pb-3 pt-1 flex items-center gap-3 text-left active:scale-[0.98] transition-transform shrink-0"
          aria-label="Mở cấu hình tài khoản"
          (click)="navTo('/settings/account/profile')">
          <img
            [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
            class="w-11 h-11 rounded-full border-2 border-white dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 object-cover"
            alt="Ảnh đại diện">
          <span class="flex-1 min-w-0">
            <span class="block font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{{ auth.currentUser()?.displayName }}</span>
            <span class="block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{{ auth.currentUser()?.email }}</span>
          </span>
          <span class="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {{ auth.currentUser()?.role }}
          </span>
          <i class="fa-solid fa-chevron-right text-slate-300 dark:text-slate-600 text-xs ml-1" aria-hidden="true"></i>
        </button>

        <div class="px-5 pb-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          @if (recentlyVisited().length > 0) {
            <div class="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 mr-1">
                <i class="fa-solid fa-clock-rotate-left mr-1" aria-hidden="true"></i> Gần đây:
              </span>
              @for (page of recentlyVisited(); track page.path) {
                <button
                  type="button"
                  (click)="navTo(page.path, page.name, page.icon)"
                  class="shrink-0 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 active:scale-95 transition-transform">
                  <i class="fa-solid {{ page.icon }} text-[10px]" aria-hidden="true"></i> {{ page.name }}
                </button>
              }
            </div>
          }

          <div class="flex gap-3">
            <button
              type="button"
              (click)="startScan()"
              class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-soft text-white font-bold text-sm shadow-soft-md active:scale-95 transition-transform">
              <i class="fa-solid fa-qrcode text-lg" aria-hidden="true"></i> Quét Mã
            </button>
            @if (canAccessPath('/results')) {
              <button
                type="button"
                (click)="navTo('/results', 'Nhập kết quả', 'fa-square-poll-vertical')"
                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 font-bold text-sm shadow-sm active:scale-95 transition-transform border border-fuchsia-200 dark:border-fuchsia-500/20">
                <i class="fa-solid fa-square-poll-vertical text-lg" aria-hidden="true"></i> Nhập Kết Quả
              </button>
            }
          </div>
        </div>

        <div class="flex-1 min-h-0 px-5 py-4 overflow-y-auto custom-scrollbar">
          <div class="space-y-6 pb-4">
            @for (group of menuGroups(); track group.id) {
              <section>
                <div class="flex items-center gap-2 mb-3 px-1">
                  <span class="w-1.5 h-1.5 rounded-full" [ngClass]="accentDotClass(group.id)"></span>
                  <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ group.title }}</span>
                </div>
                <div class="grid grid-cols-4 gap-x-2 gap-y-4">
                  @for (item of group.items; track item.id) {
                    @if (item.kind === 'install') {
                      <app-pwa-install-prompt [menuTile]="true"></app-pwa-install-prompt>
                    } @else {
                      <button
                        type="button"
                        (click)="item.isLocked ? handleLockedItemClick(item) : (item.action ? item.action() : (item.path ? navTo(item.path, item.name, item.icon) : null))"
                        [attr.aria-current]="item.path && isItemActive(item) ? 'page' : null"
                        [attr.aria-disabled]="item.isLocked ? 'true' : null"
                        [class.opacity-50]="item.isLocked"
                        [class.grayscale]="item.isLocked"
                        [class.cursor-not-allowed]="item.isLocked"
                        class="flex flex-col items-center gap-1.5 group active:scale-90 transition-transform relative">
                        <span
                          class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all border relative bg-gradient-to-tr shadow-sm"
                          [ngClass]="item.isLocked
                            ? 'bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200/50 dark:border-slate-700/50'
                            : (isItemActive(item)
                              ? 'bg-gradient-soft text-white shadow-soft-md scale-105 border-transparent'
                              : group.accentClass)">
                          <i class="fa-solid {{ item.icon }}" aria-hidden="true"></i>
                          @if (item.isLocked) {
                            <span class="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                              <i class="fa-solid fa-lock text-[8px] text-amber-500" aria-hidden="true"></i>
                            </span>
                          }
                          @if (!item.isLocked && item.badgeKey === 'requests' && requestsCount() > 0) {
                            <span class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
                              {{ requestsCount() > 99 ? '99+' : requestsCount() }}
                            </span>
                          }
                        </span>
                        <span
                          class="text-[10px] font-bold text-center leading-tight px-0.5"
                          [ngClass]="item.isLocked
                            ? 'text-slate-400 dark:text-slate-500'
                            : (isItemActive(item) ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400')">
                          {{ item.name }}
                        </span>
                      </button>
                    }
                  }
                </div>
              </section>
            }
          </div>
        </div>
      </div>
    }

    <nav
      class="fixed bottom-0 left-0 w-full rounded-t-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-soft-xl z-[40] md:hidden pb-safe"
      aria-label="Điều hướng chính trên di động">

      <div class="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none fade-in" aria-hidden="true">
        <div class="bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider border border-slate-600">
          {{ pageTitle() }}
        </div>
      </div>

      <div class="flex items-center justify-around h-[72px] px-1 relative pt-1">
        @for (tab of bottomTabs().slice(0, 2); track tab.id) {
          <button
            type="button"
            (click)="navTo(tab.path, tab.name, tab.icon)"
            [attr.aria-current]="isActiveMatches(tab.activeMatch) ? 'page' : null"
            class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
            <span
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
              [class]="isActiveMatches(tab.activeMatch) ? tab.activeColor + ' shadow-inner scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
              <i class="fa-solid {{ tab.icon }} text-[1.1rem] transition-transform duration-300" [class.-translate-y-0.5]="isActiveMatches(tab.activeMatch)" aria-hidden="true"></i>
            </span>
            <span class="text-[10px] font-bold transition-colors" [ngClass]="isActiveMatches(tab.activeMatch) ? tab.activeColor.split(' ')[0] : 'text-slate-400 dark:text-slate-500'">{{ tab.name }}</span>
            @if (isActiveMatches(tab.activeMatch)) {
              <span class="absolute bottom-0.5 w-4 h-1 rounded-full animate-fade-in" [ngClass]="tab.activeColor.split(' ')[0].replace('text-', 'bg-')"></span>
            }
          </button>
        }

        <div class="flex flex-col items-center justify-center min-w-[60px] group pb-0.5">
          <app-notification-bell [bottomNavMode]="true"></app-notification-bell>
        </div>

        @for (tab of bottomTabs().slice(2, 3); track tab.id) {
          <button
            type="button"
            (click)="navTo(tab.path, tab.name, tab.icon)"
            [attr.aria-current]="isActiveMatches(tab.activeMatch) ? 'page' : null"
            class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
            <span
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
              [class]="isActiveMatches(tab.activeMatch) ? tab.activeColor + ' shadow-inner scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
              <i class="fa-solid {{ tab.icon }} text-[1.1rem] transition-transform duration-300" [class.-translate-y-0.5]="isActiveMatches(tab.activeMatch)" aria-hidden="true"></i>
            </span>
            <span class="text-[10px] font-bold transition-colors" [ngClass]="isActiveMatches(tab.activeMatch) ? tab.activeColor.split(' ')[0] : 'text-slate-400 dark:text-slate-500'">{{ tab.name }}</span>
            @if (isActiveMatches(tab.activeMatch)) {
              <span class="absolute bottom-0.5 w-4 h-1 rounded-full animate-fade-in" [ngClass]="tab.activeColor.split(' ')[0].replace('text-', 'bg-')"></span>
            }
          </button>
        }

        <button
          type="button"
          (click)="toggleMenu()"
          aria-controls="bottom-nav-menu"
          [attr.aria-expanded]="showMenu()"
          class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
          <span
            class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative"
            [class]="showMenu() ? 'bg-gradient-soft text-white shadow-soft-md scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
            <i class="fa-solid text-[1.1rem] transition-transform duration-300" [class]="showMenu() ? 'fa-xmark rotate-90' : 'fa-bars'" aria-hidden="true"></i>
            @if (requestsCount() > 0 && !showMenu()) {
              <span class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            }
          </span>
          <span class="text-[10px] font-bold transition-colors" [class]="showMenu() ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'">
            {{ showMenu() ? 'Đóng' : 'Menu' }}
          </span>
        </button>
      </div>
    </nav>
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
  currentUrl = signal('');
  dragTransform = signal(0);

  private touchStartY = 0;
  private currentY = 0;
  private routerSub?: Subscription;
  private closeTimer?: ReturnType<typeof setTimeout>;
  private storedRecentlyVisited = signal<VisitedPage[]>([]);

  requestsCount = computed(() => this.state.requests().length);

  recentlyVisited = computed(() =>
    this.storedRecentlyVisited().filter(page => this.canAccessPath(page.path))
  );

  pageTitle = computed(() => {
    const url = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
    return ROUTE_TITLES[url] || 'LIMS Cloud';
  });

  menuGroups = computed<MenuGroup[]>(() => {
    const sharedGroups = NAVIGATION_GROUPS.map(group => ({
      id: group.id,
      title: group.title,
      accentClass: this.accentClass(group.id),
      items: group.items
        .filter(item => !item.menuHidden)
        .map(item => this.toMenuItem(item))
        .filter(item => !item.isLocked || this.state.showLockedFeatures())
    })).filter(group => group.items.length > 0);

    return [
      ...sharedGroups,
      {
        id: 'system',
        title: 'Hệ thống và tiện ích',
        accentClass: this.accentClass('system'),
        items: [
          { id: 'scan', name: 'Quét QR', icon: 'fa-qrcode', action: () => this.startScan(), isLocked: false },
          { id: 'dark-mode', name: 'Giao Diện', icon: this.state.darkMode() ? 'fa-sun' : 'fa-moon', action: () => this.toggleDarkMode(), isLocked: false },
          { id: 'install-pwa', name: 'Cài Ứng Dụng', icon: 'fa-download', kind: 'install' as const, isLocked: false },
          { id: 'config', name: 'Cài Đặt', icon: 'fa-gear', path: '/settings/account/profile', activeMatch: ['/settings'], isLocked: false },
          { id: 'logout', name: 'Đăng Xuất', icon: 'fa-right-from-bracket', action: () => this.auth.logout(), isLocked: false }
        ]
      }
    ];
  });

  bottomTabs = computed<BottomTab[]>(() => {
    const dashboard: BottomTab = {
      id: 'dashboard',
      name: 'Trang Chủ',
      icon: 'fa-house',
      path: '/dashboard',
      activeColor: this.tabColor('dashboard'),
      activeMatch: ['/dashboard']
    };

    const documents = this.findNavigationItem('documents');
    const second = this.firstAccessible(['inventory', 'documents']) || documents;
    const third = this.firstAccessible(['smart-batch', 'stats', 'standards', 'documents']) || documents;

    const tabs = [dashboard];
    if (second) tabs.push(this.toBottomTab(second));
    if (third && third.id !== second?.id) tabs.push(this.toBottomTab(third));
    return tabs.slice(0, 3);
  });

  ngOnInit() {
    this.currentUrl.set(this.router.url);
    this.routerSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => this.currentUrl.set(event.urlAfterRedirects));
    this.loadRecentlyVisited();
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }

  haptic(duration = 10) {
    if (!('vibrate' in navigator)) return;
    try {
      navigator.vibrate(duration);
    } catch {
      // Haptics are optional and unsupported in some browsers.
    }
  }

  handleLockedItemClick(item: MenuItem) {
    this.haptic();
    const permission = item.lockPermission || 'đặc biệt';
    const permissionName = permission === 'role:manager'
      ? 'Quản trị viên'
      : (this.auth.getPermissionName(permission) || permission);
    this.toast.show(`Cần quyền "${permissionName}" · Liên hệ quản trị viên để được cấp`, 'warning');
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
      return;
    }
    this.showMenu.set(true);
    this.isClosing.set(false);
  }

  closeMenu() {
    if (!this.showMenu()) return;
    this.isClosing.set(true);
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => {
      this.showMenu.set(false);
      this.isClosing.set(false);
      this.dragTransform.set(0);
      this.closeTimer = undefined;
    }, 250);
  }

  startScan() {
    this.haptic();
    this.closeMenu();
    this.qrService.startScan();
  }

  navTo(path: string, name?: string, icon?: string) {
    if (!this.canAccessPath(path)) return;
    this.haptic();
    this.closeMenu();
    this.router.navigate([path]);

    if (name && icon && path !== '/dashboard') {
      this.saveToRecentlyVisited({ name, path, icon });
    }
  }

  isActiveMatches(paths: string[]): boolean {
    return paths.some(path => this.currentUrl().startsWith(path));
  }

  isItemActive(item: MenuItem): boolean {
    return !!item.activeMatch && this.isActiveMatches(item.activeMatch);
  }

  canAccessPath(path: string): boolean {
    const segment = path.replace(/^\//, '').split(/[/?#]/)[0];
    return this.canAccess(ROUTE_ACCESS[segment]);
  }

  accentDotClass(groupId: string): string {
    const classes: Record<string, string> = {
      overview: 'bg-emerald-500',
      operation: 'bg-fuchsia-500',
      storage: 'bg-amber-500',
      administration: 'bg-rose-500',
      system: 'bg-slate-500'
    };
    return classes[groupId] || 'bg-fuchsia-500';
  }

  private saveToRecentlyVisited(page: VisitedPage) {
    if (!this.canAccessPath(page.path)) return;
    const recent = [
      page,
      ...this.storedRecentlyVisited().filter(item => item.path !== page.path)
    ].slice(0, 3);
    this.storedRecentlyVisited.set(recent);
    this.persistRecentlyVisited(recent);
  }

  private loadRecentlyVisited() {
    try {
      const stored = localStorage.getItem('lims_recently_visited');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return;
      const valid = parsed.filter((page): page is VisitedPage =>
        !!page &&
        typeof page.name === 'string' &&
        typeof page.path === 'string' &&
        typeof page.icon === 'string'
      ).slice(0, 3);
      this.storedRecentlyVisited.set(valid);
    } catch {
      this.storedRecentlyVisited.set([]);
    }
  }

  private persistRecentlyVisited(pages: VisitedPage[]) {
    try {
      localStorage.setItem('lims_recently_visited', JSON.stringify(pages));
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  }

  onTouchStartPanel(event: TouchEvent) {
    if (this.isClosing()) return;
    this.touchStartY = event.touches[0].clientY;
    this.currentY = this.touchStartY;
  }

  onTouchMovePanel(event: TouchEvent) {
    if (this.touchStartY === 0 || this.isClosing()) return;
    this.currentY = event.touches[0].clientY;
    const deltaY = this.currentY - this.touchStartY;
    if (deltaY > 0) {
      this.dragTransform.set(deltaY * 0.8);
      if (deltaY > 10) event.preventDefault();
    }
  }

  onTouchEndPanel() {
    if (this.touchStartY === 0 || this.isClosing()) return;
    const deltaY = this.currentY - this.touchStartY;
    if (deltaY > 80) {
      this.closeMenu();
    } else {
      this.dragTransform.set(0);
    }
    this.touchStartY = 0;
    this.currentY = 0;
  }

  private toMenuItem(item: NavigationItem): MenuItem {
    return {
      id: item.id,
      name: item.name,
      icon: item.icon,
      path: `/${item.path}`,
      activeMatch: item.activeMatch,
      badgeKey: item.badgeKey,
      isLocked: !this.canAccess(item.access),
      lockPermission: item.lockPermission || item.access
    };
  }

  private canAccess(access?: NavigationAccess): boolean {
    if (!access) return true;
    if (access === 'role:manager') return this.state.isAdmin();
    return this.auth.hasPermission(access);
  }

  private findNavigationItem(id: string): NavigationItem | undefined {
    return NAVIGATION_GROUPS.flatMap(group => group.items).find(item => item.id === id);
  }

  private firstAccessible(ids: string[]): NavigationItem | undefined {
    return ids
      .map(id => this.findNavigationItem(id))
      .find((item): item is NavigationItem => !!item && this.canAccess(item.access));
  }

  private toBottomTab(item: NavigationItem): BottomTab {
    const shortNames: Record<string, string> = {
      inventory: 'Kho',
      documents: 'Giao nhận',
      'smart-batch': 'Lập mẻ',
      stats: 'Báo Cáo',
      standards: 'Chuẩn'
    };
    return {
      id: item.id,
      name: shortNames[item.id] || item.name,
      icon: item.icon,
      path: `/${item.path}`,
      activeColor: this.tabColor(item.id),
      activeMatch: item.activeMatch
    };
  }

  private tabColor(id: string): string {
    const colors: Record<string, string> = {
      dashboard: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      inventory: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30',
      documents: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30',
      'smart-batch': 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30',
      stats: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
      standards: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'
    };
    return colors[id] || 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30';
  }

  private accentClass(groupId: string): string {
    const classes: Record<string, string> = {
      overview: 'from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30',
      operation: 'from-fuchsia-500/15 to-blue-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200/50 dark:border-fuchsia-800/30',
      storage: 'from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30',
      administration: 'from-rose-500/15 to-fuchsia-500/15 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/30',
      system: 'from-slate-500/15 to-slate-700/15 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/30'
    };
    return classes[groupId] || classes['system'];
  }
}
