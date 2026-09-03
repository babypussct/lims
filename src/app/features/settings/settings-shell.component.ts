import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService, getUserRoleLabel } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { getAvatarUrl } from '../../shared/utils/utils';
import { calculateCenteredScrollLeft } from './settings-scroll.utils';

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
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="mx-auto w-full max-w-[1500px] px-0 pb-24">
      <section class="fade-in">
        <div class="relative h-36 overflow-hidden rounded-2xl bg-gradient-soft sm:h-44">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.42),transparent_24%),radial-gradient(circle_at_12%_88%,rgba(255,255,255,0.2),transparent_31%)]"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
        </div>

        <div class="relative mx-3 -mt-12 rounded-2xl bg-white/85 p-4 shadow-soft-xl backdrop-blur-2xl backdrop-saturate-200 dark:bg-slate-900/85 sm:mx-6 sm:p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div class="flex min-w-0 flex-1 items-center gap-4">
              <div class="h-16 w-16 shrink-0 rounded-xl bg-white p-1 shadow-soft-sm dark:bg-slate-800 sm:h-20 sm:w-20">
                <img
                  [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
                  alt="Ảnh đại diện tài khoản"
                  class="h-full w-full rounded-lg bg-slate-100 object-cover dark:bg-slate-700">
              </div>
              <div class="min-w-0">
                <h1 class="truncate text-lg font-bold text-gray-700 dark:text-white sm:text-xl">{{ auth.currentUser()?.displayName }}</h1>
                <p class="mt-1 truncate text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {{ getUserRoleLabel(auth.currentUser()?.role) }} · {{ auth.currentUser()?.email }}
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-400">
                  <span class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1 dark:bg-slate-800">
                    <i class="fa-solid fa-shield-halved text-fuchsia-500" aria-hidden="true"></i>
                    Phiên đã xác thực
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1 dark:bg-slate-800">v{{ state.systemVersion() }}</span>
                </div>
              </div>
            </div>

            <nav #accountNavContainer aria-label="Điều hướng cấu hình tài khoản" class="flex w-full items-center gap-1 overflow-x-auto rounded-xl bg-gray-50 p-1 custom-scrollbar dark:bg-slate-800 lg:w-auto lg:max-w-[680px]">
              @for (item of topNavItems(); track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="bg-white text-gray-700 shadow-soft-md dark:bg-slate-900 dark:text-white"
                  #rlaAccount="routerLinkActive"
                  [attr.aria-current]="rlaAccount.isActive ? 'page' : null"
                  class="flex min-h-9 shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-all hover:text-gray-700 active:scale-95 dark:text-slate-400 dark:hover:text-white">
                  <i class="fa-solid text-[11px]" [class]="item.icon" aria-hidden="true"></i>
                  <span>{{ item.label }}</span>
                </a>
              }
            </nav>
          </div>
        </div>

        @if (showManagerNavigation()) {
          <div class="mx-3 mt-3 rounded-2xl bg-white p-3 shadow-soft-lg dark:bg-slate-900 sm:mx-6 sm:p-4">
            <div class="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div class="flex shrink-0 items-center gap-2 px-1">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-soft text-white shadow-soft-sm">
                  <i class="fa-solid fa-screwdriver-wrench text-[11px]" aria-hidden="true"></i>
                </span>
                <div>
                  <div class="text-xs font-black text-slate-700 dark:text-slate-200">Quản trị hệ thống</div>
                  <div class="text-[10px] font-semibold text-slate-400">Truy cập nhanh mọi cấu hình chuyên sâu</div>
                </div>
              </div>

              <nav #adminNavContainer aria-label="Điều hướng quản trị hệ thống" class="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl bg-gray-50 p-1 custom-scrollbar dark:bg-slate-800">
                @for (item of filteredManagerNavItems(); track item.path) {
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="bg-white text-gray-700 shadow-soft-md dark:bg-slate-900 dark:text-white"
                    #rlaAdmin="routerLinkActive"
                    [attr.aria-current]="rlaAdmin.isActive ? 'page' : null"
                    [title]="item.description"
                    class="flex min-h-9 shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-all hover:text-gray-700 active:scale-95 dark:text-slate-400 dark:hover:text-white">
                    <i class="fa-solid text-[11px]" [class]="item.icon" aria-hidden="true"></i>
                    <span>{{ item.label }}</span>
                  </a>
                }
                @if (filteredManagerNavItems().length === 0) {
                  <span class="px-3 py-2 text-xs font-semibold text-slate-400">Không có mục phù hợp.</span>
                }
              </nav>

              <label class="relative block shrink-0 xl:w-56">
                <span class="sr-only">Tìm nhanh cài đặt quản trị</span>
                <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" aria-hidden="true"></i>
                <input
                  type="search"
                  [value]="searchQuery()"
                  (input)="setSearch($event)"
                  placeholder="Tìm nhanh cài đặt..."
                  class="h-10 w-full rounded-xl border-0 bg-gray-50 pl-9 pr-8 text-xs font-semibold text-slate-600 shadow-soft-sm outline-none transition focus:ring-2 focus:ring-fuchsia-500/15 dark:bg-slate-800 dark:text-slate-200">
                @if (searchQuery()) {
                  <button
                    type="button"
                    (click)="clearSearch()"
                    aria-label="Xóa tìm kiếm"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[11px] text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                  </button>
                }
              </label>
            </div>
          </div>
        }
      </section>

      <main class="mt-6 min-w-0" tabindex="-1">
        <router-outlet />
      </main>
    </div>
  `,
})
export class SettingsShellComponent implements AfterViewInit, OnDestroy {
  readonly auth = inject(AuthService);
  readonly state = inject(StateService);
  private readonly router = inject(Router);
  readonly getUserRoleLabel = getUserRoleLabel;
  readonly getAvatarUrl = getAvatarUrl;
  readonly searchQuery = signal('');

  readonly accountNavContainer = viewChild<ElementRef<HTMLElement>>('accountNavContainer');
  readonly adminNavContainer = viewChild<ElementRef<HTMLElement>>('adminNavContainer');

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
        { label: 'Quản trị', description: 'Khu vực riêng cho quản trị viên', icon: 'fa-screwdriver-wrench', path: '/settings/manager', adminOnly: true },
      ],
    },
    {
      label: 'Hệ thống',
      items: [
        { label: 'Cấu hình chung', description: 'Giao diện, in ấn, thông báo, bảo trì', icon: 'fa-sliders', path: '/settings/system', adminOnly: true },
        { label: 'Dữ liệu nền', description: 'Chỉ tiêu, nền mẫu, thiết bị, phân loại', icon: 'fa-layer-group', path: '/settings/data/master', adminOnly: true },
        { label: 'Backup & phục hồi', description: 'Backup, verify, restore, lưu trữ dữ liệu cũ và thùng rác', icon: 'fa-cloud-arrow-up', path: '/settings/data/backups', adminOnly: true },
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

  readonly topNavItems = computed(() => this.accessibleGroups().find(group => group.label === 'Tài khoản')?.items ?? []);

  readonly managerNavItems = computed<SettingsNavItem[]>(() => {
    if (!this.state.isAdmin()) return [];
    return [
      { label: 'Tổng quan', description: 'Trung tâm quản trị', icon: 'fa-table-cells-large', path: '/settings/manager', adminOnly: true },
      ...this.accessibleGroups()
        .filter(group => group.label !== 'Tài khoản')
        .flatMap(group => group.items),
    ];
  });

  readonly filteredManagerNavItems = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase('vi');
    if (!query) return this.managerNavItems();
    return this.managerNavItems().filter(item =>
      `${item.label} ${item.description}`.toLocaleLowerCase('vi').includes(query)
    );
  });

  readonly currentUrl = signal(this.router.url);
  readonly showManagerNavigation = computed(() => {
    if (!this.state.isAdmin()) return false;
    const url = this.currentUrl().split('?')[0].split('#')[0];
    return url === '/settings/manager' ||
      url === '/settings/system' ||
      url.startsWith('/settings/data/') ||
      url.startsWith('/settings/access/') ||
      url.startsWith('/settings/policies/');
  });

  setSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  ngAfterViewInit(): void {
    this.scheduleScrollActiveIntoView(100);
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentUrl.set(event.urlAfterRedirects);
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
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => this.scrollActiveIntoView(), delayMs);
  }

  scrollActiveIntoView(): void {
    this.scrollHorizontalActiveIntoView(this.accountNavContainer()?.nativeElement);
    this.scrollHorizontalActiveIntoView(this.adminNavContainer()?.nativeElement);
  }

  private scrollHorizontalActiveIntoView(container?: HTMLElement): void {
    if (!container) return;
    const activeItem = container.querySelector<HTMLElement>('[aria-current="page"]');
    if (!activeItem) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeItem.getBoundingClientRect();
    const targetLeft = calculateCenteredScrollLeft({
      scrollLeft: container.scrollLeft,
      scrollWidth: container.scrollWidth,
      containerLeft: containerRect.left,
      containerWidth: containerRect.width,
      itemLeft: activeRect.left,
      itemWidth: activeRect.width,
    });

    if (Math.abs(targetLeft - container.scrollLeft) > 1) {
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
  }
}
