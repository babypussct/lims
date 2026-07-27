import { ChangeDetectionStrategy, Component, inject, computed, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StateService } from '../services/state.service';
import { AuthService } from '../services/auth.service';
import { QrGlobalService } from '../services/qr-global.service';
import { ChangelogService } from '../services/changelog.service';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { getAvatarUrl } from '../../shared/utils/utils';
import { ROUTE_TITLES, ROUTE_ICONS } from './navigation.config';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NotificationBellComponent],
  template: `
    <!-- ═══════ DESKTOP TOP HEADER BAR ═══════ -->
    <header
      class="hidden md:flex fixed top-0 right-0 z-[45] h-14 items-center gap-3 px-5
             bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
             border-b border-slate-200/50 dark:border-slate-800/50
             transition-[left] duration-300 ease-in-out"
      [style.left]="state.focusMode() ? '0' : (state.sidebarCollapsed() ? '4rem' : '18rem')">

      <!-- ── Breadcrumb / Page Title ── -->
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <button (click)="goHome()"
                class="text-slate-400 hover:text-fuchsia-500 transition-colors shrink-0"
                title="Trang chủ">
          <i class="fa-solid fa-house text-[11px]"></i>
        </button>
        <i class="fa-solid fa-chevron-right text-[8px] text-slate-300 dark:text-slate-600"></i>
        <div class="flex items-center gap-2 min-w-0">
          <i class="fa-solid text-[11px] text-slate-400 dark:text-slate-500"
             [ngClass]="pageIcon()"></i>
          <span class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
            {{ pageTitle() }}
          </span>
        </div>
      </div>

      <!-- ── Search / QR Quick-Action ── -->
      <button
        (click)="qrService.startScan()"
        class="flex items-center gap-2.5 h-9 px-3.5 rounded-xl
               bg-slate-50 dark:bg-slate-800/80
               border border-slate-200/60 dark:border-slate-700/60
               text-slate-400 dark:text-slate-500
               hover:border-fuchsia-300 dark:hover:border-fuchsia-700
               hover:text-fuchsia-500 dark:hover:text-fuchsia-400
               transition-all duration-200 group cursor-pointer"
        title="Quét mã hoặc tìm kiếm (Ctrl+K)">
        <i class="fa-solid fa-magnifying-glass text-[11px] group-hover:scale-110 transition-transform"></i>
        <span class="text-xs font-medium hidden lg:inline">Tìm kiếm...</span>
        <kbd class="hidden lg:inline-flex items-center gap-0.5 h-5 px-1.5 rounded-md
                    bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600
                    text-[10px] font-bold text-slate-400 dark:text-slate-500 shadow-sm">
          ⌘K
        </kbd>
      </button>

      <!-- ── Online / Offline Status ── -->
      <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors"
           [ngClass]="isOnline()
             ? 'bg-emerald-50/80 dark:bg-emerald-900/20'
             : 'bg-red-50/80 dark:bg-red-900/20'"
           [title]="isOnline() ? 'Kết nối ổn định' : 'Mất kết nối'">
        <span class="relative flex h-2 w-2">
          @if (isOnline()) {
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
          }
          <span class="relative inline-flex rounded-full h-2 w-2"
                [ngClass]="isOnline() ? 'bg-emerald-500' : 'bg-red-500'"></span>
        </span>
        <span class="text-[10px] font-bold hidden xl:inline"
              [ngClass]="isOnline() ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
          {{ isOnline() ? 'Online' : 'Offline' }}
        </span>
      </div>

      <!-- ── Dark Mode Toggle ── -->
      <button
        (click)="state.toggleDarkMode()"
        class="w-9 h-9 rounded-xl flex items-center justify-center
               bg-white dark:bg-slate-800
               border border-slate-200/60 dark:border-slate-700/60
               text-slate-500 dark:text-slate-400
               hover:text-fuchsia-500 dark:hover:text-fuchsia-400
               hover:border-fuchsia-300 dark:hover:border-fuchsia-700
               hover:shadow-md hover:shadow-fuchsia-500/5
               transition-all duration-200 shadow-sm active:scale-95"
        [title]="state.darkMode() ? 'Giao diện Sáng' : 'Giao diện Tối'">
        <i class="fa-solid text-sm transition-transform duration-300"
           [class.fa-sun]="state.darkMode()"
           [class.fa-moon]="!state.darkMode()"
           [class.rotate-180]="state.darkMode()"></i>
      </button>

      <!-- ── Notification Bell ── -->
      <app-notification-bell></app-notification-bell>

      <!-- ── Profile Pill ── -->
      <div class="relative">
        @if (profileMenuOpen()) {
          <div class="fixed inset-0 z-[55]" (click)="profileMenuOpen.set(false)"></div>
        }

        <button
          (click)="toggleProfileMenu()"
          class="flex items-center gap-2.5 h-10 pl-1 pr-3 rounded-xl
                 border transition-all duration-200 group active:scale-[0.97]"
          [ngClass]="profileMenuOpen()
            ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200 dark:border-fuchsia-800/50 shadow-md shadow-fuchsia-500/10'
            : 'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 shadow-sm'"
          title="Tài khoản">
          <img
            [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
            class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 object-cover"
            alt="User">
          <div class="hidden xl:block text-left min-w-0">
            <div class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">
              {{ auth.currentUser()?.displayName }}
            </div>
            <div class="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {{ auth.currentUser()?.role }}
            </div>
          </div>
          <i class="fa-solid fa-chevron-down text-[9px] text-slate-400 transition-transform duration-200"
             [class.rotate-180]="profileMenuOpen()"></i>
        </button>

        <!-- ── Profile Dropdown ── -->
        @if (profileMenuOpen()) {
          <div class="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-2xl overflow-hidden z-[60] fade-in">
            <!-- User Info Header -->
            <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <img
                [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
                class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 object-cover"
                alt="User">
              <div class="min-w-0 flex-1">
                <div class="text-sm font-bold truncate">{{ auth.currentUser()?.displayName }}</div>
                <div class="text-[11px] text-slate-400 dark:text-slate-500 truncate">{{ auth.currentUser()?.email || auth.currentUser()?.role }}</div>
              </div>
              <span
                class="ml-auto w-2.5 h-2.5 rounded-full shrink-0"
                [class]="isOnline() ? 'bg-emerald-500' : 'bg-red-500'"
                [title]="isOnline() ? 'Online' : 'Offline'"></span>
            </div>

            <!-- Menu Actions -->
            <div class="p-2 space-y-0.5">
              <button (click)="openAccountSettings()"
                      class="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <i class="fa-solid fa-user-gear w-4 text-center text-slate-400"></i>
                <span>Cài Đặt Tài Khoản</span>
              </button>
              <button (click)="openChangelog()"
                      class="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <i class="fa-solid fa-clock-rotate-left w-4 text-center text-slate-400"></i>
                <span>Nhật ký thay đổi</span>
              </button>
              <button (click)="toggleDarkMode()"
                      class="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                <i class="fa-solid w-4 text-center text-slate-400"
                   [class.fa-moon]="!state.darkMode()" [class.fa-sun]="state.darkMode()"></i>
                <span>{{ state.darkMode() ? 'Giao diện Sáng' : 'Giao diện Tối' }}</span>
              </button>
              <div class="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
              <button (click)="logout()"
                      class="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-semibold">
                <i class="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
                <span>Đăng Xuất</span>
              </button>
            </div>
          </div>
        }
      </div>
    </header>
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

  private onlineListener: (() => void) | undefined;
  private offlineListener: (() => void) | undefined;
  private routerSub: any;

  pageTitle = computed(() => {
    const segment = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
    return ROUTE_TITLES[segment] || 'LIMS Cloud';
  });

  pageIcon = computed(() => {
    const segment = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
    return ROUTE_ICONS[segment] || 'fa-cube';
  });

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
      this.qrService.startScan();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.profileMenuOpen.set(false);
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  toggleProfileMenu() {
    this.profileMenuOpen.update(v => !v);
  }

  openAccountSettings() {
    this.profileMenuOpen.set(false);
    this.router.navigate(['/config']);
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
