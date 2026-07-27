import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { QrGlobalService } from '../services/qr-global.service';
import { StateService } from '../services/state.service';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { getAvatarUrl } from '../../shared/utils/utils';
import { NavigationItem, NAVIGATION_GROUPS } from './navigation.config';

@Component({
  selector: 'app-navigation-rail',
  standalone: true,
  imports: [CommonModule, NotificationBellComponent],
  template: `
    <aside
      data-navigation-rail
      class="fixed inset-y-0 left-0 z-50 w-16 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-950 dark:bg-slate-950/95 backdrop-blur-xl text-white shadow-soft-xl">

      <div class="px-2 py-2.5 flex flex-col items-center gap-2 shrink-0 border-b border-white/10">
        <button
          type="button"
          (click)="goHome()"
          class="w-12 h-12 rounded-2xl flex items-center justify-center active:scale-95 transition-all"
          [ngClass]="isHomeActive()
            ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25'
            : 'text-slate-400 hover:text-white hover:bg-white/10'"
          title="Về Trang chủ">
          <i class="fa-solid fa-house text-[15px]"></i>
        </button>
      </div>

      <nav class="flex-1 min-h-0 py-3 px-2 overflow-y-auto no-scrollbar">
        @if (state.sidebarCollapsed()) {
          <div class="space-y-1.5">
            @for (item of shortcutItems(); track item.id) {
            <div class="relative group/tip">
              <button
                type="button"
                (click)="navigateTo(item.path)"
                class="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                [title]="item.name"
                [ngClass]="isActive(item.activeMatch)
                  ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'">
                <i class="fa-solid {{item.icon}} text-[15px]"></i>
                @if (isActive(item.activeMatch)) {
                  <span class="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-fuchsia-400"></span>
                }
                @if (item.id === 'requests' && requestsCount() > 0) {
                  <span class="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 border-2 border-slate-950 text-[8px] font-black text-white flex items-center justify-center">
                    {{ requestsCount() > 9 ? '9+' : requestsCount() }}
                  </span>
                }
              </button>
              <!-- Tooltip -->
              <div class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 pointer-events-none scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100 transition-all duration-200 z-[70] border border-slate-700 dark:border-slate-600">
                {{ item.name }}
                <span class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800 dark:border-r-slate-700"></span>
              </div>
            </div>
            }
          </div>
        }
      </nav>

      <div class="px-2 py-3 border-t border-white/10 shrink-0">
        <div class="space-y-1.5 flex flex-col items-center">
          <button
            type="button"
            (click)="qrService.startScan()"
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Quét mã (Ctrl+K)">
            <i class="fa-solid fa-qrcode text-[15px]"></i>
          </button>

          <app-notification-bell [railMode]="true"></app-notification-bell>

          <div class="w-12 h-12 rounded-2xl flex items-center justify-center">
            <img
              [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
              class="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border-2 border-white/15 object-cover ring-2 ring-white/5"
              alt="User">
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class NavigationRailComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  state = inject(StateService);
  qrService = inject(QrGlobalService);
  private router = inject(Router);

  getAvatarUrl = getAvatarUrl;
  isOnline = signal(navigator.onLine);
  requestsCount = computed(() => this.state.requests().length);
  shortcutItems = computed<NavigationItem[]>(() =>
    NAVIGATION_GROUPS
      .flatMap(group => group.items)
      .filter(item => this.canShowRailShortcut(item))
  );

  private onlineListener: (() => void) | undefined;
  private offlineListener: (() => void) | undefined;

  ngOnInit() {
    this.onlineListener = () => this.isOnline.set(true);
    this.offlineListener = () => this.isOnline.set(false);
    window.addEventListener('online', this.onlineListener);
    window.addEventListener('offline', this.offlineListener);
  }

  ngOnDestroy() {
    if (this.onlineListener) window.removeEventListener('online', this.onlineListener);
    if (this.offlineListener) window.removeEventListener('offline', this.offlineListener);
  }

  goHome() {
    this.navigateTo('dashboard');
  }

  isHomeActive(): boolean {
    return this.router.url.includes('/dashboard');
  }

  isActive(paths: string[]): boolean {
    return paths.some(path => this.router.url.includes(path));
  }

  navigateTo(path: string, clearSelectedSop = true) {
    this.router.navigate(['/' + path]);
    if (clearSelectedSop && path !== 'calculator' && path !== 'editor') {
      this.state.selectedSop.set(null);
    }
  }

  private canShowRailShortcut(item: NavigationItem): boolean {
    if (!item.access) return false;
    if (item.access === 'role:manager') return this.state.isAdmin();
    return this.auth.hasPermission(item.access);
  }
}
