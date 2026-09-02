import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';
import { ToastService } from '../services/toast.service';
import { LogoComponent } from '../../shared/components/logo.component';
import { NavigationItem, NAVIGATION_GROUPS } from './navigation.config';

interface ResolvedNavigationItem extends NavigationItem {
  isLocked: boolean;
}

interface ResolvedNavigationGroup {
  id: string;
  title: string;
  icon: string;
  items: ResolvedNavigationItem[];
}

@Component({
  selector: 'app-navigation-panel',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    <div
      class="fixed top-4 z-[46] h-14 flex items-center rounded-t-2xl border-b border-slate-100 bg-white/95 shadow-soft-xl backdrop-blur-xl transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900/95"
      [ngClass]="state.sidebarCollapsed() ? 'left-1 w-14 justify-center px-0' : 'left-4 w-60 gap-3 px-4'">
      <div class="w-9 h-9 shrink-0 overflow-hidden rounded-xl flex items-center justify-center bg-white shadow-soft-md dark:bg-slate-800">
        <app-logo size="40px" class="scale-105"></app-logo>
      </div>
      @if (!state.sidebarCollapsed()) {
        <div class="min-w-0">
          <div class="text-[13px] font-bold text-gray-700 dark:text-white truncate">
            LIMS <span class="font-normal text-slate-400">NAFIQPM6</span>
          </div>
          <div
            class="mt-0.5 text-[8px] font-medium leading-tight whitespace-nowrap text-slate-400"
            title="Hệ thống quản lý thông tin phòng thí nghiệm">
            Hệ thống quản lý thông tin phòng thí nghiệm
          </div>
        </div>
      }
    </div>

    <aside
      data-navigation-panel
      class="fixed top-[4.5rem] bottom-4 z-40 flex flex-col rounded-b-2xl bg-white/95 shadow-soft-xl backdrop-blur-xl transition-all duration-300 ease-in-out dark:bg-slate-900/95"
      [ngClass]="state.sidebarCollapsed() ? 'left-1 w-14' : 'left-4 w-60'">

      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-2 py-2.5">
        @for (group of menuGroups(); track group.id) {
          <section class="mb-2">
            @if (!state.sidebarCollapsed()) {
              <button
                type="button"
                (click)="toggleGroup(group.id)"
                [attr.aria-expanded]="expandedGroups()[group.id]"
                [attr.aria-controls]="'nav-group-' + group.id"
                class="w-full px-2.5 pt-3 pb-1.5 flex items-center justify-between rounded-lg text-left group/header hover:bg-gray-50 dark:hover:bg-slate-800/70 transition-colors">
                <div class="min-w-0 flex items-center gap-2">
                  <i class="fa-solid {{group.icon}} text-[10px] text-slate-400 group-hover/header:text-fuchsia-500"></i>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate group-hover/header:text-gray-700 dark:group-hover/header:text-slate-200">
                    {{ group.title }}
                  </span>
                </div>
                <i
                  class="fa-solid fa-chevron-down text-[9px] text-slate-300 dark:text-slate-600 transition-transform duration-200"
                  [class.-rotate-90]="!expandedGroups()[group.id]"></i>
              </button>
            } @else {
              <div class="mx-2 my-2 h-px bg-slate-100 dark:bg-slate-800" [title]="group.title" aria-hidden="true"></div>
            }

            <div
              [id]="'nav-group-' + group.id"
              class="space-y-1 overflow-hidden transition-all duration-300"
              [ngClass]="state.sidebarCollapsed()
                ? 'max-h-[640px] opacity-100 mt-1'
                : (expandedGroups()[group.id] ? 'max-h-[640px] opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0')">
              @for (item of group.items; track item.id) {
                <button
                  type="button"
                  (click)="item.isLocked ? handleLockedClick(item) : navigateTo(item.path)"
                  [attr.aria-current]="!item.isLocked && isActive(item.activeMatch) ? 'page' : null"
                  [attr.aria-disabled]="item.isLocked ? 'true' : null"
                  [attr.title]="state.sidebarCollapsed() ? item.name : null"
                  class="group/item w-full min-h-11 py-2.5 rounded-xl flex items-center gap-2.5 text-left border transition-all duration-200 relative"
                  [ngClass]="[
                    state.sidebarCollapsed() ? 'justify-center px-1.5' : 'px-2.5',
                    item.isLocked ? 'cursor-not-allowed opacity-55 bg-slate-50 dark:bg-slate-800/30 border-transparent' : 'active:scale-[0.98]',
                    !item.isLocked && isActive(item.activeMatch)
                      ? 'bg-white dark:bg-slate-800 border-transparent shadow-soft-md'
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/80'
                  ]">

                  @if (!item.isLocked && isActive(item.activeMatch)) {
                    <span class="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-fuchsia-500 shadow-sm shadow-fuchsia-500/20"></span>
                  }

                  <span
                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                    [ngClass]="!item.isLocked && isActive(item.activeMatch)
                      ? 'bg-gradient-soft text-white shadow-soft-md'
                      : 'bg-white text-slate-500 shadow-soft-md dark:bg-slate-800 dark:text-slate-400 group-hover/item:text-fuchsia-500'">
                    <i class="fa-solid {{item.icon}} text-[11px]"></i>
                  </span>

                  @if (!state.sidebarCollapsed()) {
                    <span
                      class="flex-1 min-w-0 text-[13px] font-semibold leading-snug truncate"
                      [ngClass]="!item.isLocked && isActive(item.activeMatch)
                        ? 'text-gray-700 dark:text-white'
                        : 'text-slate-500 group-hover/item:text-gray-700 dark:text-slate-400 dark:group-hover/item:text-white'">
                      {{ item.name }}
                    </span>
                  }

                  @if (!item.isLocked && item.badgeKey === 'requests' && requestsCount() > 0) {
                    <span
                      class="shrink-0 rounded-full bg-red-500 text-[9px] font-black text-white shadow-sm"
                      [ngClass]="state.sidebarCollapsed() ? 'absolute right-1 top-1 h-2.5 w-2.5 ring-2 ring-white dark:ring-slate-900' : 'px-1.5 py-0.5'">
                      @if (!state.sidebarCollapsed()) {
                        {{ requestsCount() > 99 ? '99+' : requestsCount() }}
                      }
                    </span>
                  }

                  @if (item.isLocked) {
                    <i
                      class="fa-solid fa-lock text-[9px] text-amber-400"
                      [class.absolute]="state.sidebarCollapsed()"
                      [class.right-1]="state.sidebarCollapsed()"
                      [class.bottom-1]="state.sidebarCollapsed()"></i>
                  }
                </button>
              }
            </div>
          </section>
        }
      </div>

      <div class="shrink-0 border-t border-slate-100 p-2 dark:border-slate-800">
        <button
          type="button"
          (click)="state.toggleSidebarCollapse()"
          class="flex h-10 w-full items-center rounded-xl text-slate-400 transition-colors hover:bg-gray-50 hover:text-fuchsia-500 dark:hover:bg-slate-800 dark:hover:text-white"
          [ngClass]="state.sidebarCollapsed() ? 'justify-center' : 'gap-2.5 px-2.5'"
          [attr.aria-label]="state.sidebarCollapsed() ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'"
          [title]="state.sidebarCollapsed() ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'">
          <i class="fa-solid text-[11px]" [class.fa-angles-right]="state.sidebarCollapsed()" [class.fa-angles-left]="!state.sidebarCollapsed()"></i>
          @if (!state.sidebarCollapsed()) {
            <span class="flex-1 text-left text-xs font-semibold">Thu gọn</span>
            <span class="text-[9px] font-medium text-slate-600">{{ state.systemVersion() }}</span>
          }
        </button>
      </div>
    </aside>
  `
})
export class NavigationPanelComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly state = inject(StateService);
  private toast = inject(ToastService);

  expandedGroups = signal<Record<string, boolean>>({
    overview: true,
    operation: true,
    storage: true,
    system: true
  });

  requestsCount = computed(() => this.state.requests().length);

  menuGroups = computed<ResolvedNavigationGroup[]>(() =>
    NAVIGATION_GROUPS.map(group => ({
      ...group,
      items: group.items
        .map(item => ({ ...item, isLocked: this.isItemLocked(item) }))
        .filter(item => !item.isLocked || this.state.showLockedFeatures())
    })).filter(group => group.items.length > 0)
  );

  toggleGroup(groupId: string) {
    this.expandedGroups.update(groups => ({
      ...groups,
      [groupId]: !groups[groupId]
    }));
  }

  navigateTo(path: string) {
    this.router.navigate(['/' + path]);

    if (path !== 'calculator' && path !== 'editor') {
      this.state.selectedSop.set(null);
    }
  }

  handleLockedClick(item: NavigationItem) {
    const permName = this.getPermissionLabel(item.lockPermission || item.access);
    this.toast.show(`Cần quyền "${permName}" · Liên hệ quản trị viên để được cấp`, 'warning');
  }

  isActive(paths: string[]): boolean {
    return paths.some(path => this.router.url.includes(path));
  }

  private isItemLocked(item: NavigationItem): boolean {
    if (!item.access) return false;
    if (item.access === 'role:manager') return !this.state.isAdmin();
    return !this.auth.hasPermission(item.access);
  }

  private getPermissionLabel(permission?: string): string {
    if (!permission) return 'đặc biệt';
    if (permission === 'role:manager') return 'Quản trị viên';
    return this.auth.getPermissionName(permission) || permission;
  }
}
