import { ChangeDetectionStrategy, Component, inject, computed, signal, HostListener, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StateService } from '../services/state.service';
import { AuthService } from '../services/auth.service';
import { QrGlobalService } from '../services/qr-global.service';
import { ChangelogService } from '../services/changelog.service';
import { getAvatarUrl } from '../../shared/utils/utils';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { ROUTE_ACCESS, ROUTE_TITLES, ROUTE_ICONS } from './navigation.config';

interface PaletteItem {
  id: string;
  name: string;
  icon: string;
  path?: string;
  action?: () => void;
  category: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, NotificationBellComponent],
  template: `
    <!-- ═══════ DESKTOP TOP HEADER BAR ═══════ -->
    <header
      class="fixed right-6 top-4 z-[45] hidden h-12 items-center justify-between gap-4 px-4 transition-[left] duration-300 ease-in-out md:flex"
      [style.left]="state.focusMode() ? '0' : (state.sidebarCollapsed() ? '4rem' : '17rem')">

      <div class="flex min-w-0 flex-1 items-center gap-2">
        <!-- ── Sidebar Toggle ── -->
        <button
          (click)="state.toggleSidebarCollapse()"
          [attr.aria-label]="state.sidebarCollapsed() ? 'Mở rộng sidebar' : 'Thu gọn sidebar'"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                 text-slate-500 dark:text-slate-300
                 hover:bg-white dark:hover:bg-slate-900
                 hover:text-slate-700 dark:hover:text-white
                 transition-all duration-200 active:scale-90"
          [title]="state.sidebarCollapsed() ? 'Mở rộng sidebar' : 'Thu gọn sidebar'">
          <span class="flex w-[18px] flex-col gap-[3px]" aria-hidden="true">
            <span class="block h-0.5 rounded-sm bg-current transition-transform duration-200" [class.translate-x-1]="!state.sidebarCollapsed()"></span>
            <span class="block h-0.5 rounded-sm bg-current"></span>
            <span class="block h-0.5 rounded-sm bg-current transition-transform duration-200" [class.translate-x-1]="!state.sidebarCollapsed()"></span>
          </span>
        </button>

        <!-- ── Breadcrumb / Page Title ── -->
        <div class="min-w-0 leading-tight">
          <div class="flex items-center gap-1.5 truncate text-[11px] text-slate-500 dark:text-white/60">
            <button type="button" (click)="goToDashboard()" class="transition hover:text-slate-700 dark:hover:text-white" title="Về Trang Chủ" aria-label="Về Trang Chủ">
              <i class="fa-solid fa-house text-[10px]" aria-hidden="true"></i>
            </button>
            <span>/</span>
            <span class="truncate">{{ pageTitle() }}</span>
          </div>
          <div class="mt-0.5 truncate text-sm font-bold text-slate-700 dark:text-white">{{ pageTitle() }}</div>
        </div>
      </div>

      <!-- ── Command Palette Trigger (real search, not just QR) ── -->
      <button
        (click)="openPalette()"
        aria-label="Mở tìm kiếm chức năng"
        class="hidden h-9 w-56 shrink-0 items-center gap-2.5 rounded-lg px-3 lg:flex xl:w-64
               bg-white dark:bg-slate-950
               border border-gray-300 dark:border-slate-700 shadow-none
               text-slate-500 dark:text-slate-300
               hover:border-fuchsia-300 dark:hover:border-fuchsia-700
               hover:text-fuchsia-600 dark:hover:text-fuchsia-400
               transition-all duration-200 group cursor-pointer"
        title="Tìm kiếm trang hoặc quét mã (Ctrl+K)">
        <i class="fa-solid fa-magnifying-glass text-[11px] group-hover:scale-110 transition-transform"></i>
        <span class="flex-1 truncate text-left text-xs font-medium">Tìm chức năng...</span>
        <kbd class="hidden xl:inline-flex items-center gap-0.5 h-5 px-1.5 rounded-md
                    bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600
                    text-[10px] font-bold text-slate-400 dark:text-slate-500 shadow-sm">
          ⌘K
        </kbd>
      </button>

      <div class="flex min-w-0 items-center justify-end gap-1.5">
        <!-- ── System Info (mirrors Soft UI utility affordance) ── -->
        <button
          type="button"
          (click)="openChangelog()"
          aria-label="Thông tin hệ thống"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                 text-slate-500 dark:text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400
                 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 active:scale-95"
          title="Thông tin hệ thống">
          <i class="fa-solid fa-circle-info text-sm" aria-hidden="true"></i>
        </button>

        <!-- ── Dark Mode Toggle ── -->
        <button
          (click)="state.toggleDarkMode()"
          [disabled]="state.themeTransitioning()"
          [attr.aria-pressed]="state.darkMode()"
          [attr.aria-label]="state.darkMode() ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                 text-slate-500 dark:text-slate-400
                 hover:text-fuchsia-600 dark:hover:text-fuchsia-400
                 hover:bg-white dark:hover:bg-slate-900
                 transition-all duration-200 active:scale-95 disabled:pointer-events-none"
          [title]="state.darkMode() ? 'Giao diện Sáng' : 'Giao diện Tối'">
          <i class="fa-solid text-sm transition-transform duration-300"
             [class.fa-sun]="state.darkMode()"
             [class.fa-moon]="!state.darkMode()"
             [class.rotate-180]="state.darkMode()"></i>
        </button>

        <!-- ── Notification Bell ── -->
        <app-notification-bell [headerMode]="true"></app-notification-bell>

        <!-- ── Profile Pill ── -->
        <div class="relative">
        @if (profileMenuOpen()) {
          <div class="fixed inset-0 z-[55]" (click)="profileMenuOpen.set(false)"></div>
        }

        <button
          (click)="toggleProfileMenu()"
          aria-controls="profile-menu"
          [attr.aria-expanded]="profileMenuOpen()"
          aria-haspopup="menu"
          aria-label="Mở menu tài khoản"
          class="flex h-9 items-center gap-2 rounded-lg py-0.5 pl-1 pr-2
                 border border-transparent transition-all duration-200 group active:scale-[0.97]"
          [ngClass]="profileMenuOpen()
            ? 'bg-white dark:bg-slate-900 shadow-soft-md'
            : 'bg-transparent hover:bg-white hover:shadow-soft-md dark:hover:bg-slate-900'"
          title="Tài khoản">
          <span class="relative h-7 w-7 shrink-0" [title]="isOnline() ? 'Đang trực tuyến' : 'Đang ngoại tuyến'">
            <img
              [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
              class="h-7 w-7 rounded-full border border-slate-200/50 bg-white object-cover dark:border-slate-700/50 dark:bg-slate-800"
              alt="User">
            <span class="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800"
                  [ngClass]="isOnline() ? 'bg-emerald-500' : 'bg-red-500'"></span>
          </span>
          <div class="hidden min-w-0 text-left 2xl:block">
            <div class="max-w-[90px] truncate text-[11px] font-bold text-slate-700 dark:text-slate-200">
              {{ auth.currentUser()?.displayName }}
            </div>
          </div>
          <i class="fa-solid fa-chevron-down text-[8px] text-slate-400 transition-transform duration-200"
             [class.rotate-180]="profileMenuOpen()"></i>
        </button>

        <!-- ── Profile Dropdown ── -->
        @if (profileMenuOpen()) {
          <div id="profile-menu" role="menu" class="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-soft-xl overflow-hidden z-[60] fade-in">
            <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <span class="relative w-10 h-10 shrink-0">
                <img
                  [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
                  class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 object-cover"
                  alt="User">
                <span class="absolute right-0 bottom-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900"
                      [ngClass]="isOnline() ? 'bg-emerald-500' : 'bg-red-500'"
                      [title]="isOnline() ? 'Online' : 'Offline'"></span>
              </span>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-bold truncate">{{ auth.currentUser()?.displayName }}</div>
                <div class="text-[11px] text-slate-400 dark:text-slate-500 truncate">{{ auth.currentUser()?.email || auth.currentUser()?.role }}</div>
              </div>
            </div>
            <div class="p-2 space-y-0.5">
              <button role="menuitem" (click)="openAccountSettings()"
                      class="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <i class="fa-solid fa-user-gear w-4 text-center text-slate-400"></i>
                <span>Cài Đặt Tài Khoản</span>
              </button>
              <button role="menuitem" (click)="openChangelog()"
                      class="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <i class="fa-solid fa-clock-rotate-left w-4 text-center text-slate-400"></i>
                <span>Nhật ký thay đổi</span>
              </button>
              <button role="menuitem" (click)="toggleDarkMode()"
                      class="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <i class="fa-solid w-4 text-center text-slate-400"
                   [class.fa-moon]="!state.darkMode()" [class.fa-sun]="state.darkMode()"></i>
                <span>{{ state.darkMode() ? 'Giao diện Sáng' : 'Giao diện Tối' }}</span>
              </button>
              <div class="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
              <button role="menuitem" (click)="logout()"
                      class="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-semibold">
                <i class="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
                <span>Đăng Xuất</span>
              </button>
            </div>
          </div>
        }
        </div>
      </div>
    </header>

    <!-- ═══════ MOBILE TOP HEADER BAR ═══════ -->
    <header class="fixed inset-x-0 top-0 z-[45] flex h-14 items-center gap-2 border-b border-white/70 bg-white/90 px-3 shadow-navbar backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
      <button
        type="button"
        (click)="goToDashboard()"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-soft text-white shadow-soft-md"
        aria-label="Về Trang Chủ"
        title="Về Trang Chủ">
        <i class="fa-solid fa-flask-vial text-xs" aria-hidden="true"></i>
      </button>
      <div class="min-w-0 flex-1">
        <div class="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">LIMS NAFIQPM6</div>
        <div class="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{{ pageTitle() }}</div>
      </div>
      <button
        type="button"
        (click)="openPalette()"
        class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        aria-label="Tìm kiếm chức năng"
        title="Tìm kiếm chức năng">
        <i class="fa-solid fa-magnifying-glass text-xs" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        (click)="openChangelog()"
        class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        aria-label="Thông tin hệ thống"
        title="Thông tin hệ thống">
        <i class="fa-solid fa-circle-info text-xs" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        (click)="state.toggleDarkMode()"
        [disabled]="state.themeTransitioning()"
        [attr.aria-pressed]="state.darkMode()"
        class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm disabled:pointer-events-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        [attr.aria-label]="state.darkMode() ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'">
        <i class="fa-solid text-xs" [class.fa-sun]="state.darkMode()" [class.fa-moon]="!state.darkMode()" aria-hidden="true"></i>
      </button>
    </header>

    <!-- ═══════ COMMAND PALETTE OVERLAY ═══════ -->
    @if (paletteOpen()) {
      <div class="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4
                  bg-slate-900/60 backdrop-blur-sm fade-in"
           role="dialog"
           aria-modal="true"
           aria-label="Tìm kiếm chức năng"
           (click)="closePalette()">

        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden fade-in"
             (click)="$event.stopPropagation()">

          <!-- Search Input -->
          <div class="flex items-center gap-3 px-4 h-14 border-b border-slate-100 dark:border-slate-800">
            <i class="fa-solid fa-magnifying-glass text-fuchsia-500 text-sm"></i>
            <input
              #paletteInput
              type="text"
              aria-label="Tìm trang hoặc chức năng"
              [ngModel]="searchQuery()"
              (ngModelChange)="onSearchInput($event)"
              (keydown)="onPaletteKeydown($event)"
              placeholder="Tìm trang, tính năng hoặc quét mã..."
              class="flex-1 bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none">
            <kbd class="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">ESC</kbd>
          </div>

          <!-- Results -->
          <div class="max-h-[50vh] overflow-y-auto custom-scrollbar py-2">
            @if (filteredItems().length === 0) {
              <div class="px-4 py-8 text-center text-sm text-slate-400">
                <i class="fa-solid fa-search text-2xl mb-2 block opacity-30"></i>
                Không tìm thấy kết quả cho "{{ searchQuery() }}"
              </div>
            } @else {
              @for (item of filteredItems(); track item.id; let i = $index) {
                <button
                  (click)="selectPaletteItem(item)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-left
                         transition-colors duration-100"
                  [ngClass]="i === activeIndex()
                    ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'">
                  <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                        [ngClass]="i === activeIndex()
                          ? 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'">
                    <i class="fa-solid {{ item.icon }} text-[11px]"></i>
                  </span>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold truncate">{{ item.name }}</div>
                    <div class="text-[10px] text-slate-400 dark:text-slate-500">{{ item.category }}</div>
                  </div>
                  @if (i === activeIndex()) {
                    <kbd class="text-[9px] font-bold text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-900/30 px-1.5 py-0.5 rounded border border-fuchsia-200/50 dark:border-fuchsia-800/30">↵</kbd>
                  }
                </button>
              }
            }
          </div>
        </div>
      </div>
    }
  `
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  auth = inject(AuthService);
  qrService = inject(QrGlobalService);
  changelogService = inject(ChangelogService);
  private router = inject(Router);

  getAvatarUrl = getAvatarUrl;
  profileMenuOpen = signal(false);
  isOnline = signal(navigator.onLine);
  private currentUrl = signal('');

  // Command Palette state
  paletteOpen = signal(false);
  searchQuery = signal('');
  activeIndex = signal(0);

  @ViewChild('paletteInput') paletteInput!: ElementRef<HTMLInputElement>;

  private onlineListener: (() => void) | undefined;
  private offlineListener: (() => void) | undefined;
  private routerSub: any;

  pageTitle = computed(() => {
    const segment = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
    return ROUTE_TITLES[segment] || 'LIMS Cloud';
  });

  goToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  /** All navigable items for the command palette */
  allPaletteItems = computed<PaletteItem[]>(() => {
    const items: PaletteItem[] = [];

    // Special actions first
    items.push({
      id: 'qr-scan',
      name: 'Quét Mã QR / Barcode',
      icon: 'fa-qrcode',
      action: () => this.qrService.startScan(),
      category: 'Hành động nhanh'
    });
    items.push({
      id: 'toggle-dark',
      name: this.state.darkMode() ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối',
      icon: this.state.darkMode() ? 'fa-sun' : 'fa-moon',
      action: () => this.state.toggleDarkMode(),
      category: 'Hành động nhanh'
    });

    // Route-based pages, filtered with the same access contract as route guards.
    for (const [segment, title] of Object.entries(ROUTE_TITLES)) {
      if (segment === 'printing' || segment === 'results-view') continue; // internal routes
      if (!this.canAccessRoute(segment)) continue;
      items.push({
        id: `route-${segment}`,
        name: title,
        icon: ROUTE_ICONS[segment] || 'fa-cube',
        path: `/${segment}`,
        category: 'Trang'
      });
    }

    return items;
  });

  private canAccessRoute(segment: string): boolean {
    const access = ROUTE_ACCESS[segment];
    if (!access) return true;
    if (access === 'role:manager') return this.state.isAdmin();
    return this.auth.hasPermission(access);
  }

  /** Filtered items based on search query */
  filteredItems = computed<PaletteItem[]>(() => {
    const q = this.normalizeSearchText(this.searchQuery());
    if (!q) return this.allPaletteItems();
    return this.allPaletteItems().filter(item =>
      this.normalizeSearchText(item.name).includes(q) ||
      this.normalizeSearchText(item.category).includes(q) ||
      (item.path && this.normalizeSearchText(item.path).includes(q))
    );
  });

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  ngOnInit() {
    this.currentUrl.set(this.router.url);
    this.routerSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => this.currentUrl.set(event.urlAfterRedirects));

    this.onlineListener = () => this.isOnline.set(true);
    this.offlineListener = () => this.isOnline.set(false);
    window.addEventListener('online', this.onlineListener);
    window.addEventListener('offline', this.offlineListener);
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.onlineListener) window.removeEventListener('online', this.onlineListener);
    if (this.offlineListener) window.removeEventListener('offline', this.offlineListener);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openPalette();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.paletteOpen()) {
      this.closePalette();
    } else {
      this.profileMenuOpen.set(false);
    }
  }

  // ── Command Palette ──
  openPalette() {
    this.profileMenuOpen.set(false);
    this.searchQuery.set('');
    this.activeIndex.set(0);
    this.paletteOpen.set(true);
    // Focus input after render
    setTimeout(() => this.paletteInput?.nativeElement?.focus(), 50);
  }

  closePalette() {
    this.paletteOpen.set(false);
    this.searchQuery.set('');
  }

  onSearchInput(value: string) {
    this.searchQuery.set(value);
    this.activeIndex.set(0);
  }

  onPaletteKeydown(event: KeyboardEvent) {
    const items = this.filteredItems();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update(i => Math.min(i + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update(i => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = items[this.activeIndex()];
      if (selected) this.selectPaletteItem(selected);
    }
  }

  selectPaletteItem(item: PaletteItem) {
    this.closePalette();
    if (item.action) {
      item.action();
    } else if (item.path) {
      this.router.navigate([item.path]);
    }
  }

  // ── Profile ──
  toggleProfileMenu() {
    this.profileMenuOpen.update(v => !v);
  }

  openAccountSettings() {
    this.profileMenuOpen.set(false);
    this.router.navigate(['/settings/account/profile']);
  }

  openChangelog() {
    this.profileMenuOpen.set(false);
    this.changelogService.open();
  }

  toggleDarkMode() {
    this.state.toggleDarkMode();
    this.profileMenuOpen.set(false);
  }

  logout() {
    this.profileMenuOpen.set(false);
    this.auth.logout();
  }
}
