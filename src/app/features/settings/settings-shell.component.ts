import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService, getUserRoleLabel } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { getAvatarUrl } from '../../shared/utils/utils';
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
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="mx-auto w-full max-w-[1500px] px-0 pb-24">
      @if (isAccountArea()) {
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

              <nav #mobileNavContainer aria-label="Điều hướng cấu hình cá nhân" class="flex w-full items-center gap-1 overflow-x-auto rounded-xl bg-gray-50 p-1 custom-scrollbar dark:bg-slate-800 lg:w-auto lg:max-w-[560px]">
                @for (item of accountItems(); track item.path) {
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
        </section>
      } @else {
        <!-- Mobile navigation for administrative Settings pages. -->
        <div class="mt-2 block lg:hidden">
          <div #mobileNavContainer class="flex items-center gap-1 overflow-x-auto rounded-xl bg-gray-50 p-1 custom-scrollbar dark:bg-slate-900">
            @for (group of accessibleGroups(); track group.label) {
              @for (item of group.items; track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="bg-white text-gray-700 shadow-soft-md dark:bg-slate-800 dark:text-white"
                  #rlaMob="routerLinkActive"
                  [attr.aria-current]="rlaMob.isActive ? 'page' : null"
                  class="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition active:scale-95 dark:text-slate-400">
                  <i class="fa-solid" [class]="item.icon" aria-hidden="true"></i>
                  <span>{{ item.label }}</span>
                </a>
              }
            }
          </div>
        </div>
      }

      @if (isAccountArea()) {
        <main class="mt-6 min-w-0" tabindex="-1">
          <router-outlet />
        </main>
      } @else {
        <div class="mt-4 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)]">
          <!-- Desktop Sticky Navigation Sidebar: administrative Settings only. -->
          <aside class="hidden lg:block lg:sticky lg:top-20 lg:self-start">
            <div class="rounded-2xl border-0 bg-white p-4 shadow-soft-xl dark:bg-slate-900">
              <div class="mb-3 flex items-center justify-between gap-3 px-1">
                <span class="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <i class="fa-solid fa-user-shield mr-1.5 text-fuchsia-500" aria-hidden="true"></i>
                  {{ getUserRoleLabel(auth.currentUser()?.role) }}
                </span>
                <span class="shrink-0 text-[10px] font-semibold text-slate-400">v{{ state.systemVersion() }}</span>
              </div>
              <label for="settings-search" class="sr-only">Tìm kiếm cài đặt</label>
              <div class="relative mb-4">
                <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" aria-hidden="true"></i>
                <input
                  id="settings-search"
                  type="search"
                  [value]="searchQuery()"
                  (input)="setSearch($event)"
                  placeholder="Tìm cài đặt..."
                  class="h-10 w-full rounded-xl border-0 bg-gray-50 pl-9 pr-8 text-sm font-medium text-slate-600 shadow-soft-md outline-none transition focus:ring-2 focus:ring-fuchsia-500/15 dark:bg-slate-800 dark:text-slate-200"
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
                    <div class="mb-1.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ group.label }}</div>
                    <div class="space-y-1">
                      @for (item of group.items; track item.path) {
                        <a
                          [routerLink]="item.path"
                          routerLinkActive="bg-gray-50 text-gray-700 shadow-soft-md dark:bg-slate-800 dark:text-white"
                          #rla="routerLinkActive"
                          [attr.aria-current]="rla.isActive ? 'page' : null"
                          class="group flex min-h-10 items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-gray-50 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
                          <span
                            class="flex h-5 w-5 shrink-0 items-center justify-center text-slate-500 transition group-hover:text-fuchsia-500 dark:text-slate-400"
                            [class.text-fuchsia-500]="rla.isActive">
                            <i class="fa-solid text-[12px]" [class]="item.icon" aria-hidden="true"></i>
                          </span>
                          <span class="min-w-0">
                            <span class="block truncate leading-tight">{{ item.label }}</span>
                            <span class="hidden truncate text-[10px] font-normal text-slate-400 xl:block dark:text-slate-500">{{ item.description }}</span>
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
      }
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

  readonly accountItems = computed(() => this.accessibleGroups().find(group => group.label === 'Tài khoản')?.items ?? []);

  readonly isAccountArea = computed(() => this.currentUrl().startsWith('/settings/account/'));

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
        this.currentUrl.set(this.router.url);
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
