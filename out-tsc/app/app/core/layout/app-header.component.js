import { ChangeDetectionStrategy, Component, inject, computed, signal, HostListener, ViewChild } from '@angular/core';
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
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = ["paletteInput"];
const _forTrack0 = ($index, $item) => $item.id;
function AppHeaderComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 28);
    i0.ɵɵlistener("click", function AppHeaderComponent_Conditional_20_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.profileMenuOpen.set(false)); });
    i0.ɵɵelementEnd();
} }
function AppHeaderComponent_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 26)(1, "div", 29)(2, "span", 30);
    i0.ɵɵelement(3, "img", 31)(4, "span", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 33)(6, "div", 34);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 35);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(10, "div", 36)(11, "button", 37);
    i0.ɵɵlistener("click", function AppHeaderComponent_Conditional_31_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openAccountSettings()); });
    i0.ɵɵelement(12, "i", 38);
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵtext(14, "C\u00E0i \u0110\u1EB7t T\u00E0i Kho\u1EA3n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "button", 37);
    i0.ɵɵlistener("click", function AppHeaderComponent_Conditional_31_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openChangelog()); });
    i0.ɵɵelement(16, "i", 39);
    i0.ɵɵelementStart(17, "span");
    i0.ɵɵtext(18, "Nh\u1EADt k\u00FD thay \u0111\u1ED5i");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "button", 37);
    i0.ɵɵlistener("click", function AppHeaderComponent_Conditional_31_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleDarkMode()); });
    i0.ɵɵelement(20, "i", 40);
    i0.ɵɵelementStart(21, "span");
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(23, "div", 41);
    i0.ɵɵelementStart(24, "button", 42);
    i0.ɵɵlistener("click", function AppHeaderComponent_Conditional_31_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.logout()); });
    i0.ɵɵelement(25, "i", 43);
    i0.ɵɵelementStart(26, "span");
    i0.ɵɵtext(27, "\u0110\u0103ng Xu\u1EA5t");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    let tmp_1_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("src", ctx_r1.getAvatarUrl((tmp_1_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_1_0.displayName, ((tmp_1_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_1_0.avatarStyle) || ctx_r1.state.avatarStyle(), (tmp_1_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_1_0.photoURL), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.isOnline() ? "bg-emerald-500" : "bg-red-500")("title", ctx_r1.isOnline() ? "Online" : "Offline");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((tmp_4_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_4_0.displayName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(((tmp_5_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_5_0.email) || ((tmp_5_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_5_0.role));
    i0.ɵɵadvance(11);
    i0.ɵɵclassProp("fa-moon", !ctx_r1.state.darkMode())("fa-sun", ctx_r1.state.darkMode());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.state.darkMode() ? "Giao di\u1EC7n S\u00E1ng" : "Giao di\u1EC7n T\u1ED1i");
} }
function AppHeaderComponent_Conditional_32_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 51);
    i0.ɵɵelement(1, "i", 52);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Kh\u00F4ng t\u00ECm th\u1EA5y k\u1EBFt qu\u1EA3 cho \"", ctx_r1.searchQuery(), "\" ");
} }
function AppHeaderComponent_Conditional_32_Conditional_10_For_1_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "kbd", 59);
    i0.ɵɵtext(1, "\u21B5");
    i0.ɵɵelementEnd();
} }
function AppHeaderComponent_Conditional_32_Conditional_10_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 54);
    i0.ɵɵlistener("click", function AppHeaderComponent_Conditional_32_Conditional_10_For_1_Template_button_click_0_listener() { const item_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.selectPaletteItem(item_r6)); });
    i0.ɵɵelementStart(1, "span", 55);
    i0.ɵɵelement(2, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 56)(4, "div", 57);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 58);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(8, AppHeaderComponent_Conditional_32_Conditional_10_For_1_Conditional_8_Template, 2, 0, "kbd", 59);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const ɵ$index_133_r7 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngClass", ɵ$index_133_r7 === ctx_r1.activeIndex() ? "bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ɵ$index_133_r7 === ctx_r1.activeIndex() ? "bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500");
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", item_r6.icon, " text-[11px]");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r6.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r6.category);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ɵ$index_133_r7 === ctx_r1.activeIndex() ? 8 : -1);
} }
function AppHeaderComponent_Conditional_32_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, AppHeaderComponent_Conditional_32_Conditional_10_For_1_Template, 9, 8, "button", 53, _forTrack0);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r1.filteredItems());
} }
function AppHeaderComponent_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 44);
    i0.ɵɵlistener("click", function AppHeaderComponent_Conditional_32_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closePalette()); });
    i0.ɵɵelementStart(1, "div", 45);
    i0.ɵɵlistener("click", function AppHeaderComponent_Conditional_32_Template_div_click_1_listener($event) { i0.ɵɵrestoreView(_r4); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "div", 46);
    i0.ɵɵelement(3, "i", 47);
    i0.ɵɵelementStart(4, "input", 48, 0);
    i0.ɵɵlistener("ngModelChange", function AppHeaderComponent_Conditional_32_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSearchInput($event)); })("keydown", function AppHeaderComponent_Conditional_32_Template_input_keydown_4_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onPaletteKeydown($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "kbd", 49);
    i0.ɵɵtext(7, "ESC");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 50);
    i0.ɵɵtemplate(9, AppHeaderComponent_Conditional_32_Conditional_9_Template, 3, 1, "div", 51)(10, AppHeaderComponent_Conditional_32_Conditional_10_Template, 2, 0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.searchQuery());
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.filteredItems().length === 0 ? 9 : 10);
} }
export class AppHeaderComponent {
    constructor() {
        this.state = inject(StateService);
        this.auth = inject(AuthService);
        this.qrService = inject(QrGlobalService);
        this.changelogService = inject(ChangelogService);
        this.router = inject(Router);
        this.getAvatarUrl = getAvatarUrl;
        this.profileMenuOpen = signal(false);
        this.isOnline = signal(navigator.onLine);
        this.currentUrl = signal('');
        // Command Palette state
        this.paletteOpen = signal(false);
        this.searchQuery = signal('');
        this.activeIndex = signal(0);
        this.pageTitle = computed(() => {
            const segment = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
            return ROUTE_TITLES[segment] || 'LIMS Cloud';
        });
        /** All navigable items for the command palette */
        this.allPaletteItems = computed(() => {
            const items = [];
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
                if (segment === 'printing' || segment === 'results-view')
                    continue; // internal routes
                if (!this.canAccessRoute(segment))
                    continue;
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
        /** Filtered items based on search query */
        this.filteredItems = computed(() => {
            const q = this.normalizeSearchText(this.searchQuery());
            if (!q)
                return this.allPaletteItems();
            return this.allPaletteItems().filter(item => this.normalizeSearchText(item.name).includes(q) ||
                this.normalizeSearchText(item.category).includes(q) ||
                (item.path && this.normalizeSearchText(item.path).includes(q)));
        });
    }
    goToDashboard() {
        this.router.navigateByUrl('/dashboard');
    }
    canAccessRoute(segment) {
        const access = ROUTE_ACCESS[segment];
        if (!access)
            return true;
        if (access === 'role:manager')
            return this.state.isAdmin();
        return this.auth.hasPermission(access);
    }
    normalizeSearchText(value) {
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
        this.routerSub = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(event => this.currentUrl.set(event.urlAfterRedirects));
        this.onlineListener = () => this.isOnline.set(true);
        this.offlineListener = () => this.isOnline.set(false);
        window.addEventListener('online', this.onlineListener);
        window.addEventListener('offline', this.offlineListener);
    }
    ngOnDestroy() {
        if (this.routerSub)
            this.routerSub.unsubscribe();
        if (this.onlineListener)
            window.removeEventListener('online', this.onlineListener);
        if (this.offlineListener)
            window.removeEventListener('offline', this.offlineListener);
    }
    handleKeyboardEvent(event) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            this.openPalette();
        }
    }
    onEscape() {
        if (this.paletteOpen()) {
            this.closePalette();
        }
        else {
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
    onSearchInput(value) {
        this.searchQuery.set(value);
        this.activeIndex.set(0);
    }
    onPaletteKeydown(event) {
        const items = this.filteredItems();
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.activeIndex.update(i => Math.min(i + 1, items.length - 1));
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.activeIndex.update(i => Math.max(i - 1, 0));
        }
        else if (event.key === 'Enter') {
            event.preventDefault();
            const selected = items[this.activeIndex()];
            if (selected)
                this.selectPaletteItem(selected);
        }
    }
    selectPaletteItem(item) {
        this.closePalette();
        if (item.action) {
            item.action();
        }
        else if (item.path) {
            this.router.navigate([item.path]);
        }
    }
    // ── Profile ──
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
    static { this.ɵfac = function AppHeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppHeaderComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppHeaderComponent, selectors: [["app-header"]], viewQuery: function AppHeaderComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.paletteInput = _t.first);
        } }, hostBindings: function AppHeaderComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("keydown", function AppHeaderComponent_keydown_HostBindingHandler($event) { return ctx.handleKeyboardEvent($event); }, false, i0.ɵɵresolveWindow)("keydown.escape", function AppHeaderComponent_keydown_escape_HostBindingHandler() { return ctx.onEscape(); }, false, i0.ɵɵresolveDocument);
        } }, decls: 33, vars: 32, consts: [["paletteInput", ""], [1, "hidden", "md:grid", "fixed", "top-0", "right-0", "z-[45]", "h-14", "items-center", "gap-3", "px-5", "grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)]", "lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22.5rem)_minmax(0,1fr)]", "bg-white/80", "dark:bg-slate-900/80", "backdrop-blur-xl", "border-b", "border-slate-200/50", "dark:border-slate-800/50", "transition-[left]", "duration-300", "ease-in-out"], [1, "flex", "items-center", "gap-2", "min-w-0"], [1, "w-9", "h-9", "rounded-xl", "flex", "items-center", "justify-center", "shrink-0", "text-slate-400", "dark:text-slate-500", "hover:bg-slate-100", "dark:hover:bg-slate-800", "hover:text-fuchsia-500", "dark:hover:text-fuchsia-400", "transition-all", "duration-200", "active:scale-90", 3, "click", "title"], [1, "fa-solid", "text-[13px]", "transition-transform", "duration-300"], ["type", "button", "title", "V\u1EC1 Trang Ch\u1EE7", "aria-label", "V\u1EC1 Trang Ch\u1EE7", 1, "w-8", "h-8", "rounded-lg", "flex", "items-center", "justify-center", "shrink-0", "text-fuchsia-500", "dark:text-fuchsia-400", "hover:bg-fuchsia-50", "dark:hover:bg-fuchsia-950/40", "transition-all", "duration-200", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-house", "text-[12px]"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "truncate"], ["aria-label", "M\u1EDF t\u00ECm ki\u1EBFm ch\u1EE9c n\u0103ng", "title", "T\u00ECm ki\u1EBFm trang ho\u1EB7c qu\u00E9t m\u00E3 (Ctrl+K)", 1, "w-full", "h-9", "px-0", "lg:px-3", "rounded-xl", "flex", "items-center", "justify-center", "lg:justify-start", "gap-2.5", "bg-slate-50", "dark:bg-slate-800/80", "border", "border-slate-200/60", "dark:border-slate-700/60", "text-slate-400", "dark:text-slate-500", "hover:border-fuchsia-300", "dark:hover:border-fuchsia-700", "hover:text-fuchsia-500", "dark:hover:text-fuchsia-400", "transition-all", "duration-200", "group", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-magnifying-glass", "text-[11px]", "group-hover:scale-110", "transition-transform"], [1, "text-xs", "font-medium", "hidden", "lg:inline", "flex-1", "text-left", "truncate"], [1, "hidden", "xl:inline-flex", "items-center", "gap-0.5", "h-5", "px-1.5", "rounded-md", "bg-white", "dark:bg-slate-700", "border", "border-slate-200", "dark:border-slate-600", "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "shadow-sm"], [1, "flex", "items-center", "justify-end", "gap-2", "min-w-0"], [1, "w-9", "h-9", "rounded-xl", "flex", "items-center", "justify-center", "shrink-0", "bg-white", "dark:bg-slate-800", "border", "border-slate-200/60", "dark:border-slate-700/60", "text-slate-500", "dark:text-slate-400", "hover:text-fuchsia-500", "dark:hover:text-fuchsia-400", "hover:border-fuchsia-300", "dark:hover:border-fuchsia-700", "hover:shadow-md", "hover:shadow-fuchsia-500/5", "transition-all", "duration-200", "shadow-sm", "active:scale-95", "disabled:pointer-events-none", 3, "click", "disabled", "title"], [1, "fa-solid", "text-sm", "transition-transform", "duration-300"], [3, "headerMode"], [1, "relative"], [1, "fixed", "inset-0", "z-[55]"], ["aria-controls", "profile-menu", "aria-haspopup", "menu", "aria-label", "M\u1EDF menu t\u00E0i kho\u1EA3n", "title", "T\u00E0i kho\u1EA3n", 1, "flex", "items-center", "gap-2.5", "h-10", "pl-1", "pr-3", "rounded-xl", "border", "transition-all", "duration-200", "group", "active:scale-[0.97]", 3, "click", "ngClass"], [1, "relative", "w-8", "h-8", "shrink-0", 3, "title"], ["alt", "User", 1, "w-8", "h-8", "rounded-lg", "bg-white", "dark:bg-slate-800", "border", "border-slate-200/50", "dark:border-slate-700/50", "object-cover", 3, "src"], [1, "absolute", "-right-0.5", "-bottom-0.5", "w-2.5", "h-2.5", "rounded-full", "border-2", "border-white", "dark:border-slate-800", 3, "ngClass"], [1, "hidden", "xl:block", "text-left", "min-w-0"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "truncate", "max-w-[100px]"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "truncate"], [1, "fa-solid", "fa-chevron-down", "text-[9px]", "text-slate-400", "transition-transform", "duration-200"], ["id", "profile-menu", "role", "menu", 1, "absolute", "right-0", "top-full", "mt-2", "w-72", "rounded-2xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "text-slate-700", "dark:text-slate-200", "shadow-2xl", "overflow-hidden", "z-[60]", "fade-in"], ["role", "dialog", "aria-modal", "true", "aria-label", "T\u00ECm ki\u1EBFm ch\u1EE9c n\u0103ng", 1, "fixed", "inset-0", "z-[200]", "flex", "items-start", "justify-center", "pt-[15vh]", "px-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], [1, "fixed", "inset-0", "z-[55]", 3, "click"], [1, "px-4", "py-3", "border-b", "border-slate-100", "dark:border-slate-800", "flex", "items-center", "gap-3"], [1, "relative", "w-10", "h-10", "shrink-0"], ["alt", "User", 1, "w-10", "h-10", "rounded-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "object-cover", 3, "src"], [1, "absolute", "right-0", "bottom-0", "w-3", "h-3", "rounded-full", "border-2", "border-white", "dark:border-slate-900", 3, "ngClass", "title"], [1, "min-w-0", "flex-1"], [1, "text-sm", "font-bold", "truncate"], [1, "text-[11px]", "text-slate-400", "dark:text-slate-500", "truncate"], [1, "p-2", "space-y-0.5"], ["role", "menuitem", 1, "w-full", "flex", "items-center", "gap-3", "px-3", "py-2.5", "text-sm", "rounded-xl", "hover:bg-slate-50", "dark:hover:bg-slate-800", "transition-colors", "text-left", 3, "click"], [1, "fa-solid", "fa-user-gear", "w-4", "text-center", "text-slate-400"], [1, "fa-solid", "fa-clock-rotate-left", "w-4", "text-center", "text-slate-400"], [1, "fa-solid", "w-4", "text-center", "text-slate-400"], [1, "h-px", "bg-slate-100", "dark:bg-slate-800", "my-1"], ["role", "menuitem", 1, "w-full", "flex", "items-center", "gap-3", "px-3", "py-2.5", "text-sm", "rounded-xl", "text-red-600", "dark:text-red-400", "hover:bg-red-50", "dark:hover:bg-red-900/20", "transition-colors", "text-left", "font-semibold", 3, "click"], [1, "fa-solid", "fa-arrow-right-from-bracket", "w-4", "text-center"], ["role", "dialog", "aria-modal", "true", "aria-label", "T\u00ECm ki\u1EBFm ch\u1EE9c n\u0103ng", 1, "fixed", "inset-0", "z-[200]", "flex", "items-start", "justify-center", "pt-[15vh]", "px-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in", 3, "click"], [1, "w-full", "max-w-lg", "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-2xl", "border", "border-slate-200", "dark:border-slate-800", "overflow-hidden", "fade-in", 3, "click"], [1, "flex", "items-center", "gap-3", "px-4", "h-14", "border-b", "border-slate-100", "dark:border-slate-800"], [1, "fa-solid", "fa-magnifying-glass", "text-fuchsia-500", "text-sm"], ["type", "text", "aria-label", "T\u00ECm trang ho\u1EB7c ch\u1EE9c n\u0103ng", "placeholder", "T\u00ECm trang, t\u00EDnh n\u0103ng ho\u1EB7c qu\u00E9t m\u00E3...", 1, "flex-1", "bg-transparent", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-200", "placeholder:text-slate-400", "outline-none", 3, "ngModelChange", "keydown", "ngModel"], [1, "text-[10px]", "font-bold", "text-slate-400", "bg-slate-100", "dark:bg-slate-800", "px-1.5", "py-0.5", "rounded-md", "border", "border-slate-200", "dark:border-slate-700"], [1, "max-h-[50vh]", "overflow-y-auto", "custom-scrollbar", "py-2"], [1, "px-4", "py-8", "text-center", "text-sm", "text-slate-400"], [1, "fa-solid", "fa-search", "text-2xl", "mb-2", "block", "opacity-30"], [1, "w-full", "flex", "items-center", "gap-3", "px-4", "py-2.5", "text-left", "transition-colors", "duration-100", 3, "ngClass"], [1, "w-full", "flex", "items-center", "gap-3", "px-4", "py-2.5", "text-left", "transition-colors", "duration-100", 3, "click", "ngClass"], [1, "w-8", "h-8", "rounded-lg", "flex", "items-center", "justify-center", "shrink-0", "transition-colors", 3, "ngClass"], [1, "flex-1", "min-w-0"], [1, "text-sm", "font-semibold", "truncate"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500"], [1, "text-[9px]", "font-bold", "text-fuchsia-400", "bg-fuchsia-50", "dark:bg-fuchsia-900/30", "px-1.5", "py-0.5", "rounded", "border", "border-fuchsia-200/50", "dark:border-fuchsia-800/30"]], template: function AppHeaderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "header", 1)(1, "div", 2)(2, "button", 3);
            i0.ɵɵlistener("click", function AppHeaderComponent_Template_button_click_2_listener() { return ctx.state.toggleSidebarCollapse(); });
            i0.ɵɵelement(3, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div", 2)(5, "button", 5);
            i0.ɵɵlistener("click", function AppHeaderComponent_Template_button_click_5_listener() { return ctx.goToDashboard(); });
            i0.ɵɵelement(6, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "span", 7);
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(9, "button", 8);
            i0.ɵɵlistener("click", function AppHeaderComponent_Template_button_click_9_listener() { return ctx.openPalette(); });
            i0.ɵɵelement(10, "i", 9);
            i0.ɵɵelementStart(11, "span", 10);
            i0.ɵɵtext(12, "T\u00ECm ch\u1EE9c n\u0103ng...");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "kbd", 11);
            i0.ɵɵtext(14, " \u2318K ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "div", 12)(16, "button", 13);
            i0.ɵɵlistener("click", function AppHeaderComponent_Template_button_click_16_listener() { return ctx.state.toggleDarkMode(); });
            i0.ɵɵelement(17, "i", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(18, "app-notification-bell", 15);
            i0.ɵɵelementStart(19, "div", 16);
            i0.ɵɵtemplate(20, AppHeaderComponent_Conditional_20_Template, 1, 0, "div", 17);
            i0.ɵɵelementStart(21, "button", 18);
            i0.ɵɵlistener("click", function AppHeaderComponent_Template_button_click_21_listener() { return ctx.toggleProfileMenu(); });
            i0.ɵɵelementStart(22, "span", 19);
            i0.ɵɵelement(23, "img", 20)(24, "span", 21);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "div", 22)(26, "div", 23);
            i0.ɵɵtext(27);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "div", 24);
            i0.ɵɵtext(29);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(30, "i", 25);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(31, AppHeaderComponent_Conditional_31_Template, 28, 10, "div", 26);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(32, AppHeaderComponent_Conditional_32_Template, 11, 2, "div", 27);
        } if (rf & 2) {
            let tmp_18_0;
            let tmp_20_0;
            let tmp_21_0;
            i0.ɵɵstyleProp("left", ctx.state.focusMode() ? "0" : ctx.state.sidebarCollapsed() ? "0" : "16rem");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("title", ctx.state.sidebarCollapsed() ? "M\u1EDF r\u1ED9ng sidebar" : "Thu g\u1ECDn sidebar");
            i0.ɵɵattribute("aria-label", ctx.state.sidebarCollapsed() ? "M\u1EDF r\u1ED9ng sidebar" : "Thu g\u1ECDn sidebar");
            i0.ɵɵadvance();
            i0.ɵɵclassProp("fa-bars", ctx.state.sidebarCollapsed())("fa-chevron-left", !ctx.state.sidebarCollapsed());
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate1(" ", ctx.pageTitle(), " ");
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("disabled", ctx.state.themeTransitioning())("title", ctx.state.darkMode() ? "Giao di\u1EC7n S\u00E1ng" : "Giao di\u1EC7n T\u1ED1i");
            i0.ɵɵattribute("aria-pressed", ctx.state.darkMode())("aria-label", ctx.state.darkMode() ? "Chuy\u1EC3n sang giao di\u1EC7n s\u00E1ng" : "Chuy\u1EC3n sang giao di\u1EC7n t\u1ED1i");
            i0.ɵɵadvance();
            i0.ɵɵclassProp("fa-sun", ctx.state.darkMode())("fa-moon", !ctx.state.darkMode())("rotate-180", ctx.state.darkMode());
            i0.ɵɵadvance();
            i0.ɵɵproperty("headerMode", true);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.profileMenuOpen() ? 20 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngClass", ctx.profileMenuOpen() ? "bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200 dark:border-fuchsia-800/50 shadow-md shadow-fuchsia-500/10" : "bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 shadow-sm");
            i0.ɵɵattribute("aria-expanded", ctx.profileMenuOpen());
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.isOnline() ? "\u0110ang tr\u1EF1c tuy\u1EBFn" : "\u0110ang ngo\u1EA1i tuy\u1EBFn");
            i0.ɵɵadvance();
            i0.ɵɵproperty("src", ctx.getAvatarUrl((tmp_18_0 = ctx.auth.currentUser()) == null ? null : tmp_18_0.displayName, ((tmp_18_0 = ctx.auth.currentUser()) == null ? null : tmp_18_0.avatarStyle) || ctx.state.avatarStyle(), (tmp_18_0 = ctx.auth.currentUser()) == null ? null : tmp_18_0.photoURL), i0.ɵɵsanitizeUrl);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngClass", ctx.isOnline() ? "bg-emerald-500" : "bg-red-500");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1(" ", (tmp_20_0 = ctx.auth.currentUser()) == null ? null : tmp_20_0.displayName, " ");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", (tmp_21_0 = ctx.auth.currentUser()) == null ? null : tmp_21_0.role, " ");
            i0.ɵɵadvance();
            i0.ɵɵclassProp("rotate-180", ctx.profileMenuOpen());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.profileMenuOpen() ? 31 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.paletteOpen() ? 32 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgModel, NotificationBellComponent], encapsulation: 2, changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppHeaderComponent, [{
        type: Component,
        args: [{
                selector: 'app-header',
                standalone: true,
                changeDetection: ChangeDetectionStrategy.OnPush,
                imports: [CommonModule, FormsModule, NotificationBellComponent],
                template: `
    <!-- ═══════ DESKTOP TOP HEADER BAR ═══════ -->
    <header
      class="hidden md:grid fixed top-0 right-0 z-[45] h-14 items-center gap-3 px-5
             grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)]
             lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22.5rem)_minmax(0,1fr)]
             bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
             border-b border-slate-200/50 dark:border-slate-800/50
             transition-[left] duration-300 ease-in-out"
      [style.left]="state.focusMode() ? '0' : (state.sidebarCollapsed() ? '0' : '16rem')">

      <div class="flex items-center gap-2 min-w-0">
        <!-- ── Sidebar Toggle ── -->
        <button
          (click)="state.toggleSidebarCollapse()"
          [attr.aria-label]="state.sidebarCollapsed() ? 'Mở rộng sidebar' : 'Thu gọn sidebar'"
          class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                 text-slate-400 dark:text-slate-500
                 hover:bg-slate-100 dark:hover:bg-slate-800
                 hover:text-fuchsia-500 dark:hover:text-fuchsia-400
                 transition-all duration-200 active:scale-90"
          [title]="state.sidebarCollapsed() ? 'Mở rộng sidebar' : 'Thu gọn sidebar'">
          <i class="fa-solid text-[13px] transition-transform duration-300"
             [class.fa-bars]="state.sidebarCollapsed()"
             [class.fa-chevron-left]="!state.sidebarCollapsed()"></i>
        </button>

        <!-- ── Breadcrumb / Page Title ── -->
        <div class="flex items-center gap-2 min-w-0">
          <button
            type="button"
            (click)="goToDashboard()"
            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                   text-fuchsia-500 dark:text-fuchsia-400
                   hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/40
                   transition-all duration-200 active:scale-90"
            title="Về Trang Chủ"
            aria-label="Về Trang Chủ">
            <i class="fa-solid fa-house text-[12px]"></i>
          </button>
          <span class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
            {{ pageTitle() }}
          </span>
        </div>
      </div>

      <!-- ── Command Palette Trigger (real search, not just QR) ── -->
      <button
        (click)="openPalette()"
        aria-label="Mở tìm kiếm chức năng"
        class="w-full h-9 px-0 lg:px-3 rounded-xl
               flex items-center justify-center lg:justify-start gap-2.5
               bg-slate-50 dark:bg-slate-800/80
               border border-slate-200/60 dark:border-slate-700/60
               text-slate-400 dark:text-slate-500
               hover:border-fuchsia-300 dark:hover:border-fuchsia-700
               hover:text-fuchsia-500 dark:hover:text-fuchsia-400
               transition-all duration-200 group cursor-pointer"
        title="Tìm kiếm trang hoặc quét mã (Ctrl+K)">
        <i class="fa-solid fa-magnifying-glass text-[11px] group-hover:scale-110 transition-transform"></i>
        <span class="text-xs font-medium hidden lg:inline flex-1 text-left truncate">Tìm chức năng...</span>
        <kbd class="hidden xl:inline-flex items-center gap-0.5 h-5 px-1.5 rounded-md
                    bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600
                    text-[10px] font-bold text-slate-400 dark:text-slate-500 shadow-sm">
          ⌘K
        </kbd>
      </button>

      <div class="flex items-center justify-end gap-2 min-w-0">
        <!-- ── Dark Mode Toggle ── -->
        <button
          (click)="state.toggleDarkMode()"
          [disabled]="state.themeTransitioning()"
          [attr.aria-pressed]="state.darkMode()"
          [attr.aria-label]="state.darkMode() ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'"
          class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                 bg-white dark:bg-slate-800
                 border border-slate-200/60 dark:border-slate-700/60
                 text-slate-500 dark:text-slate-400
                 hover:text-fuchsia-500 dark:hover:text-fuchsia-400
                 hover:border-fuchsia-300 dark:hover:border-fuchsia-700
                 hover:shadow-md hover:shadow-fuchsia-500/5
                 transition-all duration-200 shadow-sm active:scale-95 disabled:pointer-events-none"
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
          class="flex items-center gap-2.5 h-10 pl-1 pr-3 rounded-xl
                 border transition-all duration-200 group active:scale-[0.97]"
          [ngClass]="profileMenuOpen()
            ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200 dark:border-fuchsia-800/50 shadow-md shadow-fuchsia-500/10'
            : 'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 shadow-sm'"
          title="Tài khoản">
          <span class="relative w-8 h-8 shrink-0" [title]="isOnline() ? 'Đang trực tuyến' : 'Đang ngoại tuyến'">
            <img
              [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
              class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 object-cover"
              alt="User">
            <span class="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800"
                  [ngClass]="isOnline() ? 'bg-emerald-500' : 'bg-red-500'"></span>
          </span>
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
          <div id="profile-menu" role="menu" class="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-2xl overflow-hidden z-[60] fade-in">
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
            }]
    }], null, { paletteInput: [{
            type: ViewChild,
            args: ['paletteInput']
        }], handleKeyboardEvent: [{
            type: HostListener,
            args: ['window:keydown', ['$event']]
        }], onEscape: [{
            type: HostListener,
            args: ['document:keydown.escape']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppHeaderComponent, { className: "AppHeaderComponent", filePath: "src/app/core/layout/app-header.component.ts", lineNumber: 272 }); })();
//# sourceMappingURL=app-header.component.js.map