import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService, getUserRoleLabel } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { AppPageHeaderComponent } from '../../shared/components/ui/page-header/page-header.component';
import { calculateCenteredScrollLeft, calculateVisibleScrollTop } from './settings-scroll.utils';

type SettingsNavItem = {
  label: string;
  description: string;
  icon: string;
  path: string;
  adminOnly?: boolean;
};

type SettingsNavGroup = {
  label: string;
  items: SettingsNavItem[];
};

@Component({
  selector: 'app-settings-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, AppPageHeaderComponent],
  template: `
    <div class="mx-auto w-full max-w-[1500px] px-3 pb-24 sm:px-5 lg:px-8">
      <app-page-header
        title="Cài đặt"
        subtitle="Quản lý tài khoản cá nhân, phân quyền truy cập, cấu hình và an toàn dữ liệu hệ thống."
        icon="fa-sliders">
        <div pageHeaderActions class="flex items-center gap-2">
          <span class="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <i class="fa-solid fa-user-shield mr-1.5 text-indigo-500" aria-hidden="true"></i>
            {{ getUserRoleLabel(auth.currentUser()?.role) }}
          </span>
          <span class="hidden h-9 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:inline-flex">
            v{{ state.systemVersion() }}
          </span>
        </div>
      </app-page-header>

      <!-- Mobile Quick Horizontal Navigation Pills (<lg) -->
      <div class="mt-3 block lg:hidden">
        <div #mobileNavContainer class="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 custom-scrollbar">
          @for (group of accessibleGroups(); track group.label) {
            @for (item of group.items; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20"
                #rlaMob="routerLinkActive"
                [attr.aria-current]="rlaMob.isActive ? 'page' : null"
                class="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <i class="fa-solid" [class]="item.icon" aria-hidden="true"></i>
                <span>{{ item.label }}</span>
              </a>
            }
          }
        </div>
      </div>

      <div class="mt-4 grid gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
        <!-- Desktop Sticky Navigation Sidebar -->
        <aside class="hidden lg:block lg:sticky lg:top-20 lg:self-start">
          <div class="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
            <label for="settings-search" class="sr-only">Tìm kiếm cài đặt</label>
            <div class="relative mb-3">
              <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" aria-hidden="true"></i>
              <input
                id="settings-search"
                type="search"
                [value]="searchQuery()"
                (input)="setSearch($event)"
                placeholder="Tìm cài đặt..."
                class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500"
              >
              @if (searchQuery()) {
                <button
                  type="button"
                  (click)="clearSearch()"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                  aria-label="Xóa tìm kiếm">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              }
            </div>

            <nav #desktopNavContainer aria-label="Điều hướng cài đặt" class="max-h-[calc(100vh-13rem)] space-y-4 overflow-y-auto custom-scrollbar pr-0.5">
              @for (group of filteredGroups(); track group.label) {
                <div>
                  <div class="mb-1.5 px-2 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ group.label }}</div>
                  <div class="space-y-1">
                    @for (item of group.items; track item.path) {
                      <a
                        [routerLink]="item.path"
                        routerLinkActive="bg-indigo-50/80 text-indigo-700 ring-1 ring-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/30"
                        #rla="routerLinkActive"
                        [attr.aria-current]="rla.isActive ? 'page' : null"
                        class="group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/60 dark:hover:text-white">
                        <span
                          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:scale-105 group-hover:bg-white group-hover:shadow-2xs dark:bg-slate-900 dark:text-slate-400 dark:group-hover:bg-slate-800"
                          [class.text-indigo-600]="rla.isActive"
                          [class.dark:text-indigo-300]="rla.isActive">
                          <i class="fa-solid" [class]="item.icon" aria-hidden="true"></i>
                        </span>
                        <span class="min-w-0">
                          <span class="block truncate leading-tight">{{ item.label }}</span>
                          <span class="hidden truncate text-[11px] font-medium text-slate-400 xl:block dark:text-slate-500">{{ item.description }}</span>
                        </span>
                      </a>
                    }
                  </div>
                </div>
              }
              @if (filteredGroups().length === 0) {
                <div class="px-3 py-8 text-center text-sm text-slate-400">
                  <i class="fa-solid fa-search text-2xl text-slate-300 dark:text-slate-600 mb-2 block"></i>
                  Không tìm thấy mục cài đặt phù hợp.
                </div>
              }
            </nav>
          </div>
        </aside>

        <main class="min-w-0" tabindex="-1">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class SettingsShellComponent implements AfterViewInit, OnDestroy {
  readonly auth = inject(AuthService);
  readonly state = inject(StateService);
  private readonly router = inject(Router);
  readonly getUserRoleLabel = getUserRoleLabel;
  readonly searchQuery = signal('');

  readonly mobileNavContainer = viewChild<ElementRef<HTMLElement>>('mobileNavContainer');
  readonly desktopNavContainer = viewChild<ElementRef<HTMLElement>>('desktopNavContainer');

  private routerSub: Subscription | null = null;
  private scrollTimer: any = null;

  private readonly groups: SettingsNavGroup[] = [
    {
      label: 'Tài khoản',
      items: [
        { label: 'Hồ sơ', description: 'Định danh, avatar và quyền hiện có', icon: 'fa-id-badge', path: '/settings/account/profile' },
        { label: 'Bảo mật', description: 'Google, mật khẩu và lịch sử bảo mật', icon: 'fa-shield-halved', path: '/settings/account/security' },
        { label: 'Thông báo', description: 'Thông báo đẩy trên thiết bị', icon: 'fa-bell', path: '/settings/account/notifications' },
        { label: 'Quyền riêng tư', description: 'Chính sách và dữ liệu tài khoản', icon: 'fa-user-shield', path: '/settings/account/privacy' },
      ],
    },
    {
      label: 'Hệ thống',
      items: [
        { label: 'Cấu hình chung', description: 'Giao diện, in ấn, thông báo, bảo trì', icon: 'fa-sliders', path: '/settings/system', adminOnly: true },
        { label: 'Dữ liệu nền', description: 'Chỉ tiêu, nền mẫu, thiết bị, phân loại', icon: 'fa-layer-group', path: '/settings/data/master', adminOnly: true },
        { label: 'Backup & phục hồi', description: 'Backup, verify, restore và thùng rác', icon: 'fa-cloud-arrow-up', path: '/settings/data/backups', adminOnly: true },
        { label: 'Vòng đời dữ liệu', description: 'Archive, restore và migration', icon: 'fa-database', path: '/settings/data/lifecycle', adminOnly: true },
        { label: 'Chẩn đoán', description: 'Phiên bản, tài nguyên và trạng thái', icon: 'fa-stethoscope', path: '/settings/diagnostics', adminOnly: true },
      ],
    },
    {
      label: 'Truy cập',
      items: [
        { label: 'Người dùng', description: 'Duyệt, vai trò và quyền cá nhân', icon: 'fa-users-gear', path: '/settings/access/users', adminOnly: true },
        { label: 'Vai trò', description: 'Nhóm vai trò và ma trận quyền', icon: 'fa-user-shield', path: '/settings/access/roles', adminOnly: true },
      ],
    },
    {
      label: 'Quy tắc vận hành',
      items: [
        { label: 'Định mức & tiêu hao', description: 'Ngưỡng cảnh báo tiêu hao', icon: 'fa-gauge-high', path: '/settings/policies/consumption', adminOnly: true },
      ],
    },
  ];

  readonly accessibleGroups = computed(() => {
    const isAdmin = this.state.isAdmin();
    return this.groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => !item.adminOnly || isAdmin),
      }))
      .filter(group => group.items.length > 0);
  });

  readonly filteredGroups = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase('vi');
    return this.accessibleGroups()
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          if (!query) return true;
          return `${item.label} ${item.description}`.toLocaleLowerCase('vi').includes(query);
        }),
      }))
      .filter(group => group.items.length > 0);
  });

  setSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  ngAfterViewInit(): void {
    // Cuộn ngay sau khi view khởi tạo (dành cho deep links / page refresh)
    this.scheduleScrollActiveIntoView(100);

    // Lắng nghe navigation tiếp theo
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scheduleScrollActiveIntoView(50);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
      this.routerSub = null;
    }
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }
  }

  private scheduleScrollActiveIntoView(delayMs = 0): void {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    this.scrollTimer = setTimeout(() => {
      this.scrollActiveIntoView();
    }, delayMs);
  }

  scrollActiveIntoView(): void {
    const mobContainer = this.mobileNavContainer()?.nativeElement;
    if (mobContainer) {
      const activeMob = mobContainer.querySelector<HTMLElement>('[aria-current="page"]');
      if (activeMob) {
        const containerRect = mobContainer.getBoundingClientRect();
        const activeRect = activeMob.getBoundingClientRect();
        const targetLeft = calculateCenteredScrollLeft({
          scrollLeft: mobContainer.scrollLeft,
          scrollWidth: mobContainer.scrollWidth,
          containerLeft: containerRect.left,
          containerWidth: containerRect.width,
          itemLeft: activeRect.left,
          itemWidth: activeRect.width,
        });

        if (Math.abs(targetLeft - mobContainer.scrollLeft) > 1) {
          mobContainer.scrollTo({ left: targetLeft, behavior: 'smooth' });
        }
      }
    }

    const deskContainer = this.desktopNavContainer()?.nativeElement;
    if (deskContainer) {
      const activeDesk = deskContainer.querySelector<HTMLElement>('[aria-current="page"]');
      if (activeDesk) {
        const containerRect = deskContainer.getBoundingClientRect();
        const activeRect = activeDesk.getBoundingClientRect();
        const targetTop = calculateVisibleScrollTop({
          scrollTop: deskContainer.scrollTop,
          scrollHeight: deskContainer.scrollHeight,
          containerTop: containerRect.top,
          containerHeight: containerRect.height,
          itemTop: activeRect.top,
          itemHeight: activeRect.height,
          padding: 16,
        });

        if (targetTop !== null && Math.abs(targetTop - deskContainer.scrollTop) > 1) {
          deskContainer.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }
    }
  }
}
