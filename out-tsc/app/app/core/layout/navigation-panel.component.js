import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';
import { ToastService } from '../services/toast.service';
import { LogoComponent } from '../../shared/components/logo.component';
import { NAVIGATION_GROUPS } from './navigation.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = (a0, a1) => [a0, a1];
const _forTrack0 = ($index, $item) => $item.id;
function NavigationPanelComponent_For_13_For_9_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 17);
} }
function NavigationPanelComponent_For_13_For_9_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 20);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.requestsCount() > 99 ? "99+" : ctx_r2.requestsCount(), " ");
} }
function NavigationPanelComponent_For_13_For_9_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 21);
} }
function NavigationPanelComponent_For_13_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 16);
    i0.ɵɵlistener("click", function NavigationPanelComponent_For_13_For_9_Template_button_click_0_listener() { const item_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(item_r5.isLocked ? ctx_r2.handleLockedClick(item_r5) : ctx_r2.navigateTo(item_r5.path)); });
    i0.ɵɵtemplate(1, NavigationPanelComponent_For_13_For_9_Conditional_1_Template, 1, 0, "span", 17);
    i0.ɵɵelementStart(2, "span", 18);
    i0.ɵɵelement(3, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 19);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, NavigationPanelComponent_For_13_For_9_Conditional_6_Template, 2, 1, "span", 20)(7, NavigationPanelComponent_For_13_For_9_Conditional_7_Template, 1, 0, "i", 21);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(12, _c0, item_r5.isLocked ? "cursor-not-allowed opacity-55 bg-slate-50/70 dark:bg-slate-800/30 border-transparent" : "active:scale-[0.98]", !item_r5.isLocked && ctx_r2.isActive(item_r5.activeMatch) ? "bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200/70 dark:border-fuchsia-800/40 shadow-sm" : "border-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:border-slate-200/60 dark:hover:border-slate-700/50"));
    i0.ɵɵattribute("aria-current", !item_r5.isLocked && ctx_r2.isActive(item_r5.activeMatch) ? "page" : null)("aria-disabled", item_r5.isLocked ? "true" : null);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!item_r5.isLocked && ctx_r2.isActive(item_r5.activeMatch) ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", !item_r5.isLocked && ctx_r2.isActive(item_r5.activeMatch) ? "bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover/item:bg-white dark:group-hover/item:bg-slate-700 group-hover/item:text-fuchsia-600 dark:group-hover/item:text-fuchsia-400");
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", item_r5.icon, " text-[11px]");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", !item_r5.isLocked && ctx_r2.isActive(item_r5.activeMatch) ? "text-fuchsia-700 dark:text-fuchsia-300" : "text-slate-600 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-slate-100");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r5.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(!item_r5.isLocked && item_r5.badgeKey === "requests" && ctx_r2.requestsCount() > 0 ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r5.isLocked ? 7 : -1);
} }
function NavigationPanelComponent_For_13_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 9)(1, "button", 10);
    i0.ɵɵlistener("click", function NavigationPanelComponent_For_13_Template_button_click_1_listener() { const group_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toggleGroup(group_r2.id)); });
    i0.ɵɵelementStart(2, "div", 11);
    i0.ɵɵelement(3, "i");
    i0.ɵɵelementStart(4, "span", 12);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "i", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 14);
    i0.ɵɵrepeaterCreate(8, NavigationPanelComponent_For_13_For_9_Template, 8, 15, "button", 15, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-expanded", ctx_r2.expandedGroups()[group_r2.id])("aria-controls", "nav-group-" + group_r2.id);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMapInterpolate1("fa-solid ", group_r2.icon, " text-[10px] text-slate-400 dark:text-slate-500 group-hover/header:text-fuchsia-500");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", group_r2.title, " ");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("-rotate-90", !ctx_r2.expandedGroups()[group_r2.id]);
    i0.ɵɵadvance();
    i0.ɵɵproperty("id", "nav-group-" + group_r2.id)("ngClass", ctx_r2.expandedGroups()[group_r2.id] ? "max-h-[640px] opacity-100 mt-1" : "max-h-0 opacity-0 mt-0");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(group_r2.items);
} }
export class NavigationPanelComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.router = inject(Router);
        this.state = inject(StateService);
        this.toast = inject(ToastService);
        this.expandedGroups = signal({
            overview: true,
            operation: true,
            storage: true,
            system: true
        });
        this.requestsCount = computed(() => this.state.requests().length);
        this.menuGroups = computed(() => NAVIGATION_GROUPS.map(group => ({
            ...group,
            items: group.items
                .map(item => ({ ...item, isLocked: this.isItemLocked(item) }))
                .filter(item => !item.isLocked || this.state.showLockedFeatures())
        })).filter(group => group.items.length > 0));
    }
    toggleGroup(groupId) {
        this.expandedGroups.update(groups => ({
            ...groups,
            [groupId]: !groups[groupId]
        }));
    }
    navigateTo(path) {
        this.router.navigate(['/' + path]);
        if (path !== 'calculator' && path !== 'editor') {
            this.state.selectedSop.set(null);
        }
    }
    handleLockedClick(item) {
        const permName = this.getPermissionLabel(item.lockPermission || item.access);
        this.toast.show(`Cần quyền "${permName}" · Liên hệ quản trị viên để được cấp`, 'warning');
    }
    isActive(paths) {
        return paths.some(path => this.router.url.includes(path));
    }
    isItemLocked(item) {
        if (!item.access)
            return false;
        if (item.access === 'role:manager')
            return !this.state.isAdmin();
        return !this.auth.hasPermission(item.access);
    }
    getPermissionLabel(permission) {
        if (!permission)
            return 'đặc biệt';
        if (permission === 'role:manager')
            return 'Quản trị viên';
        return this.auth.getPermissionName(permission) || permission;
    }
    static { this.ɵfac = function NavigationPanelComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NavigationPanelComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NavigationPanelComponent, selectors: [["app-navigation-panel"]], decls: 14, vars: 0, consts: [[1, "fixed", "top-0", "left-0", "z-[46]", "h-14", "w-64", "px-3", "flex", "items-center", "gap-3", "bg-white/90", "dark:bg-slate-900/90", "backdrop-blur-xl", "border-r", "border-b", "border-slate-200/70", "dark:border-slate-800"], [1, "w-9", "h-9", "shrink-0", "overflow-hidden", "rounded-lg", "flex", "items-center", "justify-center", "bg-white", "dark:bg-slate-900"], ["size", "40px", 1, "scale-105"], [1, "min-w-0"], [1, "text-[13px]", "font-black", "text-gray-700", "dark:text-slate-200", "truncate"], [1, "font-light", "text-gray-500", "dark:text-slate-400"], ["title", "H\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD th\u00F4ng tin ph\u00F2ng th\u00ED nghi\u1EC7m", 1, "mt-0.5", "text-[8px]", "font-medium", "leading-tight", "whitespace-nowrap", "text-gray-500", "dark:text-slate-400"], ["data-navigation-panel", "", 1, "fixed", "top-14", "bottom-0", "left-0", "z-40", "w-64", "flex", "flex-col", "border-r", "border-slate-200", "dark:border-slate-800", "bg-white/95", "dark:bg-slate-900/95", "backdrop-blur-xl", "shadow-soft-xl", "transition-transform", "duration-300", "ease-in-out"], [1, "flex-1", "min-h-0", "overflow-y-auto", "custom-scrollbar", "px-2.5", "py-2.5"], [1, "mb-2"], ["type", "button", 1, "w-full", "px-2.5", "pt-3", "pb-1.5", "flex", "items-center", "justify-between", "rounded-lg", "text-left", "group/header", "hover:bg-slate-100/80", "dark:hover:bg-slate-800/70", "transition-colors", 3, "click"], [1, "min-w-0", "flex", "items-center", "gap-2"], [1, "text-[10px]", "font-extrabold", "uppercase", "tracking-widest", "text-slate-400", "dark:text-slate-500", "truncate", "group-hover/header:text-fuchsia-600", "dark:group-hover/header:text-fuchsia-400"], [1, "fa-solid", "fa-chevron-down", "text-[9px]", "text-slate-300", "dark:text-slate-600", "transition-transform", "duration-200"], [1, "space-y-1", "overflow-hidden", "transition-all", "duration-300", 3, "id", "ngClass"], ["type", "button", 1, "group/item", "w-full", "min-h-11", "px-2.5", "py-2.5", "rounded-xl", "flex", "items-center", "gap-2.5", "text-left", "border", "transition-all", "duration-200", "relative", 3, "ngClass"], ["type", "button", 1, "group/item", "w-full", "min-h-11", "px-2.5", "py-2.5", "rounded-xl", "flex", "items-center", "gap-2.5", "text-left", "border", "transition-all", "duration-200", "relative", 3, "click", "ngClass"], [1, "absolute", "left-0", "top-1/2", "-translate-y-1/2", "h-6", "w-1", "rounded-r-full", "bg-fuchsia-500", "dark:bg-fuchsia-400", "shadow-sm", "shadow-fuchsia-500/50"], [1, "w-8", "h-8", "rounded-lg", "flex", "items-center", "justify-center", "shrink-0", "transition-colors", 3, "ngClass"], [1, "flex-1", "min-w-0", "text-[13px]", "font-semibold", "leading-snug", "truncate", 3, "ngClass"], [1, "shrink-0", "rounded-full", "bg-red-500", "px-1.5", "py-0.5", "text-[9px]", "font-black", "text-white", "shadow-sm"], [1, "fa-solid", "fa-lock", "text-[9px]", "text-amber-500", "dark:text-amber-400"]], template: function NavigationPanelComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵelement(2, "app-logo", 2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "div", 3)(4, "div", 4);
            i0.ɵɵtext(5, " LIMS ");
            i0.ɵɵelementStart(6, "span", 5);
            i0.ɵɵtext(7, "NAFIQPM6");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(8, "div", 6);
            i0.ɵɵtext(9, " H\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD th\u00F4ng tin ph\u00F2ng th\u00ED nghi\u1EC7m ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "aside", 7)(11, "div", 8);
            i0.ɵɵrepeaterCreate(12, NavigationPanelComponent_For_13_Template, 10, 10, "section", 9, _forTrack0);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(12);
            i0.ɵɵrepeater(ctx.menuGroups());
        } }, dependencies: [CommonModule, i1.NgClass, LogoComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NavigationPanelComponent, [{
        type: Component,
        args: [{
                selector: 'app-navigation-panel',
                standalone: true,
                imports: [CommonModule, LogoComponent],
                template: `
    <div
      class="fixed top-0 left-0 z-[46] h-14 w-64 px-3 flex items-center gap-3
             bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
             border-r border-b border-slate-200/70 dark:border-slate-800">
      <div class="w-9 h-9 shrink-0 overflow-hidden rounded-lg flex items-center justify-center bg-white dark:bg-slate-900">
        <app-logo size="40px" class="scale-105"></app-logo>
      </div>
      <div class="min-w-0">
        <div class="text-[13px] font-black text-gray-700 dark:text-slate-200 truncate">
          LIMS <span class="font-light text-gray-500 dark:text-slate-400">NAFIQPM6</span>
        </div>
        <div
          class="mt-0.5 text-[8px] font-medium leading-tight whitespace-nowrap text-gray-500 dark:text-slate-400"
          title="Hệ thống quản lý thông tin phòng thí nghiệm">
          Hệ thống quản lý thông tin phòng thí nghiệm
        </div>
      </div>
    </div>

    <aside
      data-navigation-panel
      class="fixed top-14 bottom-0 left-0 z-40 w-64 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-soft-xl transition-transform duration-300 ease-in-out">

      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-2.5 py-2.5">
        @for (group of menuGroups(); track group.id) {
          <section class="mb-2">
            <button
              type="button"
              (click)="toggleGroup(group.id)"
              [attr.aria-expanded]="expandedGroups()[group.id]"
              [attr.aria-controls]="'nav-group-' + group.id"
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
              [id]="'nav-group-' + group.id"
              class="space-y-1 overflow-hidden transition-all duration-300"
              [ngClass]="expandedGroups()[group.id] ? 'max-h-[640px] opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'">
              @for (item of group.items; track item.id) {
                <button
                  type="button"
                  (click)="item.isLocked ? handleLockedClick(item) : navigateTo(item.path)"
                  [attr.aria-current]="!item.isLocked && isActive(item.activeMatch) ? 'page' : null"
                  [attr.aria-disabled]="item.isLocked ? 'true' : null"
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
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(NavigationPanelComponent, { className: "NavigationPanelComponent", filePath: "src/app/core/layout/navigation-panel.component.ts", lineNumber: 125 }); })();
//# sourceMappingURL=navigation-panel.component.js.map