import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';
import { ToastService } from '../services/toast.service';
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
  imports: [CommonModule],
  template: `
    <aside
      data-navigation-panel
      class="fixed top-14 bottom-0 left-0 z-40 w-64 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-soft-xl transition-transform duration-300 ease-in-out">

      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-2.5 py-2.5">
        @for (group of menuGroups(); track group.id) {
          <section class="mb-2">
            <button
              type="button"
              (click)="toggleGroup(group.id)"
              class="w-full px-2.5 pt-3 pb-1.5 flex items-center justify-between rounded-lg text-left group/header hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-colors">
              <div class="min-w-0 flex items-center gap-2">
                <i class="fa-solid {{group.icon}} text-[10px] text-slate-400 dark:text-slate-500 group-hover/header:text-fuchsia-500"></i>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate group-hover/header:text-fuchsia-600 dark:group-hover/header:text-fuchsia-400">
                  {{ group.title }}
                </span>
              </div>
              <i
                class="fa-solid fa-chevron-down text-[9px] text-slate-300 dark:text-slate-600 transition-transform duration-200"
                [class.-rotate-90]="!expandedGroups()[group.id]"></i>
            </button>

            <div
              class="space-y-1 overflow-hidden transition-all duration-300"
              [ngClass]="expandedGroups()[group.id] ? 'max-h-[640px] opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'">
              @for (item of group.items; track item.id) {
                <button
                  type="button"
                  (click)="item.isLocked ? handleLockedClick(item) : navigateTo(item.path)"
                  class="group/item w-full min-h-11 px-2.5 py-2.5 rounded-xl flex items-center gap-2.5 text-left border transition-all duration-200 relative"
                  [ngClass]="[
                    item.isLocked ? 'cursor-not-allowed opacity-55 bg-slate-50/70 dark:bg-slate-800/30 border-transparent' : 'active:scale-[0.98]',
                    !item.isLocked && isActive(item.activeMatch)
                      ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200/70 dark:border-fuchsia-800/40 shadow-sm'
                      : 'border-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:border-slate-200/60 dark:hover:border-slate-700/50'
                  ]">

                  @if (!item.isLocked && isActive(item.activeMatch)) {
                    <span class="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-fuchsia-500 dark:bg-fuchsia-400 shadow-sm shadow-fuchsia-500/50"></span>
                  }

                  <span
                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                    [ngClass]="!item.isLocked && isActive(item.activeMatch)
                      ? 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover/item:bg-white dark:group-hover/item:bg-slate-700 group-hover/item:text-fuchsia-600 dark:group-hover/item:text-fuchsia-400'">
                    <i class="fa-solid {{item.icon}} text-[11px]"></i>
                  </span>

                  <span
                    class="flex-1 min-w-0 text-[13px] font-semibold leading-snug truncate"
                    [ngClass]="!item.isLocked && isActive(item.activeMatch)
                      ? 'text-fuchsia-700 dark:text-fuchsia-300'
                      : 'text-slate-600 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-slate-100'">
                    {{ item.name }}
                  </span>

                  @if (!item.isLocked && item.badgeKey === 'requests' && requestsCount() > 0) {
                    <span class="shrink-0 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-black text-white shadow-sm">
                      {{ requestsCount() > 99 ? '99+' : requestsCount() }}
                    </span>
                  }

                  @if (item.isLocked) {
                    <i class="fa-solid fa-lock text-[9px] text-amber-500 dark:text-amber-400"></i>
                  }
                </button>
              }
            </div>
          </section>
        }
      </div>
    </aside>
  `
})
export class NavigationPanelComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private state = inject(StateService);
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
