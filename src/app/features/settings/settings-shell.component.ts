import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PERMISSIONS, AuthService, getUserRoleLabel } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { getAvatarUrl } from '../../shared/utils/utils';
import { calculateCenteredScrollLeft } from './settings-scroll.utils';

type SettingsNavItem = {
  label: string;
  description: string;
  icon: string;
  path: string;
  permissionsAny?: string[];
};

const ADMIN_PERMISSIONS = [
  PERMISSIONS.SYSTEM_MANAGE,
  PERMISSIONS.MASTER_DATA_MANAGE,
  PERMISSIONS.USER_MANAGE,
  PERMISSIONS.BACKUP_CREATE,
  PERMISSIONS.BACKUP_VERIFY,
  PERMISSIONS.BACKUP_RESTORE,
  PERMISSIONS.POLICY_MANAGE,
];

@Component({
  selector: 'app-settings-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="mx-auto w-full max-w-[1500px] px-0 pb-24">
      <section class="fade-in">
        @if (!isAdminArea()) {
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
                @for (item of accountNavItems(); track item.path) {
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
        } @else {
          <div class="mx-3 rounded-2xl bg-white/90 p-3 shadow-soft-xl backdrop-blur-xl dark:bg-slate-900/90 sm:mx-6 sm:p-4">
            <div class="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div class="flex min-w-0 shrink-0 items-center gap-3 xl:w-64">
                <a routerLink="/settings/account/profile" title="Về cài đặt cá nhân" class="h-10 w-10 shrink-0 rounded-xl bg-white p-0.5 shadow-soft-sm transition hover:-translate-y-0.5 dark:bg-slate-800">
                  <img
                    [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
                    alt="Ảnh đại diện tài khoản"
                    class="h-full w-full rounded-[10px] bg-slate-100 object-cover dark:bg-slate-700">
                </a>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <a routerLink="/settings/account/profile" class="transition hover:text-fuchsia-500">Cài đặt</a>
                    <i class="fa-solid fa-chevron-right text-[7px]" aria-hidden="true"></i>
                    <span class="truncate text-fuchsia-500">{{ currentAdminSectionLabel() }}</span>
                  </div>
                  <div class="mt-0.5 truncate text-sm font-black text-slate-800 dark:text-slate-100">Quản trị hệ thống</div>
                </div>
              </div>

              <nav #adminNavContainer aria-label="Điều hướng quản trị hệ thống" class="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl bg-gray-50 p-1 custom-scrollbar dark:bg-slate-800">
                @for (item of filteredManagerNavItems(); track item.path) {
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="bg-white text-gray-700 shadow-soft-md dark:bg-slate-900 dark:text-white"
                    #rlaAdmin="routerLinkActive"
                    [routerLinkActiveOptions]="{ exact: item.path === '/settings/manager' }"
                    [attr.aria-current]="rlaAdmin.isActive ? 'page' : null"
                    [title]="item.description"
                    class="flex min-h-9 shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-all hover:text-gray-700 active:scale-95 dark:text-slate-400 dark:hover:text-white">
                    <i class="fa-solid text-[11px]" [class]="item.icon" aria-hidden="true"></i>
                    <span>{{ item.label }}</span>
                  </a>
                }
              </nav>

              <label class="relative block shrink-0 xl:w-52">
                <span class="sr-only">Tìm nhanh cài đặt quản trị</span>
                <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" aria-hidden="true"></i>
                <input
                  type="search"
                  [value]="searchQuery()"
                  (input)="setSearch($event)"
                  placeholder="Tìm cài đặt..."
                  class="h-10 w-full rounded-xl border-0 bg-gray-50 pl-9 pr-8 text-xs font-semibold text-slate-600 shadow-soft-sm outline-none transition focus:ring-2 focus:ring-fuchsia-500/15 dark:bg-slate-800 dark:text-slate-200">
                @if (searchQuery()) {
                  <button type="button" (click)="clearSearch()" aria-label="Xóa tìm kiếm" class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[11px] text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                  </button>
                }
              </label>
            </div>
          </div>

          @if (contextSubNavItems().length > 0) {
            <div class="mx-3 mt-3 overflow-x-auto px-1 custom-scrollbar sm:mx-6">
              <nav aria-label="Điều hướng chức năng con" class="inline-flex min-w-max items-center gap-1 rounded-full bg-slate-100/80 p-1 dark:bg-slate-800/80">
                @for (item of contextSubNavItems(); track item.path) {
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="bg-white text-fuchsia-600 shadow-soft-sm dark:bg-slate-900 dark:text-fuchsia-300"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                    <i class="fa-solid text-[9px]" [class]="item.icon" aria-hidden="true"></i>
                    {{ item.label }}
                  </a>
                }
              </nav>
            </div>
          }
        }
      </section>

      <main class="mt-5 min-w-0" tabindex="-1">
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
  readonly currentUrl = signal(this.router.url);

  readonly accountNavContainer = viewChild<ElementRef<HTMLElement>>('accountNavContainer');
  readonly adminNavContainer = viewChild<ElementRef<HTMLElement>>('adminNavContainer');

  private routerSub: Subscription | null = null;
  private scrollTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly accountItems: SettingsNavItem[] = [
    { label: 'Hồ sơ', description: 'Định danh, avatar và quyền hiện có', icon: 'fa-id-badge', path: '/settings/account/profile' },
    { label: 'Bảo mật', description: 'Google, mật khẩu và lịch sử bảo mật', icon: 'fa-shield-halved', path: '/settings/account/security' },
    { label: 'Thông báo', description: 'Thông báo đẩy trên thiết bị', icon: 'fa-bell', path: '/settings/account/notifications' },
    { label: 'Quyền riêng tư', description: 'Chính sách và dữ liệu tài khoản', icon: 'fa-user-shield', path: '/settings/account/privacy' },
    { label: 'Quản trị', description: 'Khu vực quản trị được cấp quyền', icon: 'fa-screwdriver-wrench', path: '/settings/manager', permissionsAny: ADMIN_PERMISSIONS },
  ];

  private readonly adminItems: SettingsNavItem[] = [
    { label: 'Tổng quan', description: 'Tình trạng và việc quản trị cần xử lý', icon: 'fa-table-cells-large', path: '/settings/manager', permissionsAny: ADMIN_PERMISSIONS },
    { label: 'Hệ thống', description: 'Giao diện, in ấn, thông báo và bảo trì', icon: 'fa-sliders', path: '/settings/system', permissionsAny: [PERMISSIONS.SYSTEM_MANAGE] },
    { label: 'Dữ liệu nền', description: 'Chỉ tiêu, nền mẫu, thiết bị và phân loại', icon: 'fa-layer-group', path: '/settings/data/master/analytes', permissionsAny: [PERMISSIONS.MASTER_DATA_MANAGE] },
    { label: 'Người dùng & quyền', description: 'Tài khoản, vai trò và quyền cá nhân', icon: 'fa-users-gear', path: '/settings/access/users', permissionsAny: [PERMISSIONS.USER_MANAGE] },
    { label: 'Backup & phục hồi', description: 'Backup, integrity, restore, thùng rác và retention', icon: 'fa-cloud-arrow-up', path: '/settings/data/backups', permissionsAny: [PERMISSIONS.BACKUP_CREATE, PERMISSIONS.BACKUP_VERIFY, PERMISSIONS.BACKUP_RESTORE] },
    { label: 'Chính sách hao hụt', description: 'Ngưỡng và quy tắc hao hụt nghiệp vụ', icon: 'fa-gauge-high', path: '/settings/policies/consumption', permissionsAny: [PERMISSIONS.POLICY_MANAGE] },
  ];

  readonly accountNavItems = computed(() => this.accountItems.filter(item => this.canAccessItem(item)));
  readonly managerNavItems = computed(() => this.adminItems.filter(item => this.canAccessItem(item)));
  readonly filteredManagerNavItems = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase('vi');
    if (!query) return this.managerNavItems();
    return this.managerNavItems().filter(item =>
      `${item.label} ${item.description}`.toLocaleLowerCase('vi').includes(query),
    );
  });

  readonly isAdminArea = computed(() => {
    const url = this.cleanUrl();
    return url === '/settings/manager' ||
      url === '/settings/system' ||
      url.startsWith('/settings/data/') ||
      url.startsWith('/settings/access/') ||
      url.startsWith('/settings/policies/');
  });

  readonly currentAdminSectionLabel = computed(() => {
    const url = this.cleanUrl();
    if (url === '/settings/manager') return 'Tổng quan';
    if (url === '/settings/system') return 'Hệ thống';
    if (url.startsWith('/settings/data/master')) return 'Dữ liệu nền';
    if (url.startsWith('/settings/data/backups')) return 'Backup & phục hồi';
    if (url.startsWith('/settings/access/')) return 'Người dùng & quyền';
    if (url.startsWith('/settings/policies/')) return 'Chính sách hao hụt';
    return 'Quản trị';
  });

  readonly contextSubNavItems = computed<SettingsNavItem[]>(() => {
    const url = this.cleanUrl();
    if (url.startsWith('/settings/data/master')) {
      return [
        { label: 'Chỉ tiêu', description: 'Danh mục chỉ tiêu gốc', icon: 'fa-crosshairs', path: '/settings/data/master/analytes' },
        { label: 'Nhóm chỉ tiêu', description: 'Bộ chỉ tiêu dùng cho SOP', icon: 'fa-bullseye', path: '/settings/data/master/target-groups' },
        { label: 'Nền mẫu', description: 'Danh mục loại nền mẫu', icon: 'fa-table-cells', path: '/settings/data/master/matrices' },
        { label: 'Mô tả mẫu', description: 'Danh mục mô tả mẫu', icon: 'fa-tags', path: '/settings/data/master/sample-descriptions' },
        { label: 'Thiết bị', description: 'Danh mục thiết bị phân tích', icon: 'fa-microscope', path: '/settings/data/master/devices' },
        { label: 'Phân loại', description: 'Phân loại hóa chất dùng chung', icon: 'fa-folder-tree', path: '/settings/data/master/categories' },
      ];
    }
    if (url.startsWith('/settings/access/')) {
      return [
        { label: 'Người dùng', description: 'Duyệt và phân quyền tài khoản', icon: 'fa-users', path: '/settings/access/users' },
        { label: 'Vai trò & quyền', description: 'Nhóm vai trò và ma trận quyền', icon: 'fa-user-shield', path: '/settings/access/roles' },
      ];
    }
    return [];
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
        this.searchQuery.set('');
        this.scheduleScrollActiveIntoView(50);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.routerSub = null;
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.scrollTimer = null;
  }

  private canAccessItem(item: SettingsNavItem): boolean {
    const required = item.permissionsAny ?? [];
    return required.length === 0 || required.some(permission => this.auth.hasPermission(permission));
  }

  private cleanUrl(): string {
    return this.currentUrl().split('?')[0].split('#')[0];
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
