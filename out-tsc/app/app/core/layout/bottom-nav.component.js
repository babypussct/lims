import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PwaInstallPromptComponent } from '../../shared/components/pwa-install-prompt.component';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { getAvatarUrl } from '../../shared/utils/utils';
import { AuthService } from '../services/auth.service';
import { QrGlobalService } from '../services/qr-global.service';
import { StateService } from '../services/state.service';
import { ToastService } from '../services/toast.service';
import { NAVIGATION_GROUPS, ROUTE_ACCESS, ROUTE_TITLES } from './navigation.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.path;
function BottomNavComponent_Conditional_0_Conditional_15_For_5_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 34);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_Conditional_15_For_5_Template_button_click_0_listener() { const page_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.navTo(page_r4.path, page_r4.name, page_r4.icon)); });
    i0.ɵɵelement(1, "i", 35);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const page_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", page_r4.icon, " text-[10px]");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", page_r4.name, " ");
} }
function BottomNavComponent_Conditional_0_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 24)(1, "span", 31);
    i0.ɵɵelement(2, "i", 32);
    i0.ɵɵtext(3, " G\u1EA7n \u0111\u00E2y: ");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(4, BottomNavComponent_Conditional_0_Conditional_15_For_5_Template, 3, 4, "button", 33, _forTrack1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.recentlyVisited());
} }
function BottomNavComponent_Conditional_0_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_Conditional_20_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.navTo("/results", "Nh\u1EADp k\u1EBFt qu\u1EA3", "fa-square-poll-vertical")); });
    i0.ɵɵelement(1, "i", 37);
    i0.ɵɵtext(2, " Nh\u1EADp K\u1EBFt Qu\u1EA3 ");
    i0.ɵɵelementEnd();
} }
function BottomNavComponent_Conditional_0_For_24_For_7_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-pwa-install-prompt", 42);
} if (rf & 2) {
    i0.ɵɵproperty("menuTile", true);
} }
function BottomNavComponent_Conditional_0_For_24_For_7_Conditional_1_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 46);
    i0.ɵɵelement(1, "i", 49);
    i0.ɵɵelementEnd();
} }
function BottomNavComponent_Conditional_0_For_24_For_7_Conditional_1_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 47);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.requestsCount() > 99 ? "99+" : ctx_r1.requestsCount(), " ");
} }
function BottomNavComponent_Conditional_0_For_24_For_7_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 44);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_For_24_For_7_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const item_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(item_r7.isLocked ? ctx_r1.handleLockedItemClick(item_r7) : item_r7.action ? item_r7.action() : item_r7.path ? ctx_r1.navTo(item_r7.path, item_r7.name, item_r7.icon) : null); });
    i0.ɵɵelementStart(1, "span", 45);
    i0.ɵɵelement(2, "i", 35);
    i0.ɵɵtemplate(3, BottomNavComponent_Conditional_0_For_24_For_7_Conditional_1_Conditional_3_Template, 2, 0, "span", 46)(4, BottomNavComponent_Conditional_0_For_24_For_7_Conditional_1_Conditional_4_Template, 2, 1, "span", 47);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 48);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r7 = i0.ɵɵnextContext().$implicit;
    const group_r8 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("opacity-50", item_r7.isLocked)("grayscale", item_r7.isLocked)("cursor-not-allowed", item_r7.isLocked);
    i0.ɵɵattribute("aria-current", item_r7.path && ctx_r1.isItemActive(item_r7) ? "page" : null)("aria-disabled", item_r7.isLocked ? "true" : null);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", item_r7.isLocked ? "bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200/50 dark:border-slate-700/50" : ctx_r1.isItemActive(item_r7) ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md scale-105 border-transparent" : group_r8.accentClass);
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", item_r7.icon, "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r7.isLocked ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!item_r7.isLocked && item_r7.badgeKey === "requests" && ctx_r1.requestsCount() > 0 ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", item_r7.isLocked ? "text-slate-400 dark:text-slate-500" : ctx_r1.isItemActive(item_r7) ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r7.name, " ");
} }
function BottomNavComponent_Conditional_0_For_24_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, BottomNavComponent_Conditional_0_For_24_For_7_Conditional_0_Template, 1, 1, "app-pwa-install-prompt", 42)(1, BottomNavComponent_Conditional_0_For_24_For_7_Conditional_1_Template, 7, 16, "button", 43);
} if (rf & 2) {
    const item_r7 = ctx.$implicit;
    i0.ɵɵconditional(item_r7.kind === "install" ? 0 : 1);
} }
function BottomNavComponent_Conditional_0_For_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section")(1, "div", 38);
    i0.ɵɵelement(2, "span", 39);
    i0.ɵɵelementStart(3, "span", 40);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 41);
    i0.ɵɵrepeaterCreate(6, BottomNavComponent_Conditional_0_For_24_For_7_Template, 2, 1, null, null, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r8 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", ctx_r1.accentDotClass(group_r8.id));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r8.title);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(group_r8.items);
} }
function BottomNavComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 12);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeMenu()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(1, "div", 13);
    i0.ɵɵlistener("touchstart", function BottomNavComponent_Conditional_0_Template_div_touchstart_1_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onTouchStartPanel($event)); })("touchmove", function BottomNavComponent_Conditional_0_Template_div_touchmove_1_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onTouchMovePanel($event)); })("touchend", function BottomNavComponent_Conditional_0_Template_div_touchend_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onTouchEndPanel()); });
    i0.ɵɵelementStart(2, "button", 14);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeMenu()); });
    i0.ɵɵelement(3, "span", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 16);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.navTo("/config")); });
    i0.ɵɵelement(5, "img", 17);
    i0.ɵɵelementStart(6, "span", 18)(7, "span", 19);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span", 20);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "span", 21);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "i", 22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 23);
    i0.ɵɵtemplate(15, BottomNavComponent_Conditional_0_Conditional_15_Template, 6, 0, "div", 24);
    i0.ɵɵelementStart(16, "div", 25)(17, "button", 26);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.startScan()); });
    i0.ɵɵelement(18, "i", 27);
    i0.ɵɵtext(19, " Qu\u00E9t M\u00E3 ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(20, BottomNavComponent_Conditional_0_Conditional_20_Template, 3, 0, "button", 28);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 29)(22, "div", 30);
    i0.ɵɵrepeaterCreate(23, BottomNavComponent_Conditional_0_For_24_Template, 8, 2, "section", null, _forTrack0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("opacity-0", ctx_r1.isClosing())("opacity-100", !ctx_r1.isClosing());
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("transform", ctx_r1.dragTransform() > 0 && !ctx_r1.isClosing() ? "translateY(" + ctx_r1.dragTransform() + "px)" : "");
    i0.ɵɵclassProp("animate-slide-up", !ctx_r1.isClosing())("translate-y-full", ctx_r1.isClosing());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("src", ctx_r1.getAvatarUrl((tmp_6_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_6_0.displayName, ((tmp_6_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_6_0.avatarStyle) || ctx_r1.state.avatarStyle(), (tmp_6_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_6_0.photoURL), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((tmp_7_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_7_0.displayName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((tmp_8_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_8_0.email);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", (tmp_9_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_9_0.role, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.recentlyVisited().length > 0 ? 15 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.canAccessPath("/results") ? 20 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.menuGroups());
} }
function BottomNavComponent_For_7_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 53);
} if (rf & 2) {
    const tab_r10 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("ngClass", tab_r10.activeColor.split(" ")[0].replace("text-", "bg-"));
} }
function BottomNavComponent_For_7_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 50);
    i0.ɵɵlistener("click", function BottomNavComponent_For_7_Template_button_click_0_listener() { const tab_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.navTo(tab_r10.path, tab_r10.name, tab_r10.icon)); });
    i0.ɵɵelementStart(1, "span", 51);
    i0.ɵɵelement(2, "i", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 52);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, BottomNavComponent_For_7_Conditional_5_Template, 1, 1, "span", 53);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tab_r10 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵattribute("aria-current", ctx_r1.isActiveMatches(tab_r10.activeMatch) ? "page" : null);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.isActiveMatches(tab_r10.activeMatch) ? tab_r10.activeColor + " shadow-inner scale-105" : "text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800");
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", tab_r10.icon, " text-[1.1rem] transition-transform duration-300");
    i0.ɵɵclassProp("-translate-y-0", ctx_r1.isActiveMatches(tab_r10.activeMatch));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.isActiveMatches(tab_r10.activeMatch) ? tab_r10.activeColor.split(" ")[0] : "text-slate-400 dark:text-slate-500");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(tab_r10.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isActiveMatches(tab_r10.activeMatch) ? 5 : -1);
} }
function BottomNavComponent_For_11_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 53);
} if (rf & 2) {
    const tab_r12 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("ngClass", tab_r12.activeColor.split(" ")[0].replace("text-", "bg-"));
} }
function BottomNavComponent_For_11_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 50);
    i0.ɵɵlistener("click", function BottomNavComponent_For_11_Template_button_click_0_listener() { const tab_r12 = i0.ɵɵrestoreView(_r11).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.navTo(tab_r12.path, tab_r12.name, tab_r12.icon)); });
    i0.ɵɵelementStart(1, "span", 51);
    i0.ɵɵelement(2, "i", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 52);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, BottomNavComponent_For_11_Conditional_5_Template, 1, 1, "span", 53);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tab_r12 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵattribute("aria-current", ctx_r1.isActiveMatches(tab_r12.activeMatch) ? "page" : null);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.isActiveMatches(tab_r12.activeMatch) ? tab_r12.activeColor + " shadow-inner scale-105" : "text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800");
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", tab_r12.icon, " text-[1.1rem] transition-transform duration-300");
    i0.ɵɵclassProp("-translate-y-0", ctx_r1.isActiveMatches(tab_r12.activeMatch));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.isActiveMatches(tab_r12.activeMatch) ? tab_r12.activeColor.split(" ")[0] : "text-slate-400 dark:text-slate-500");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(tab_r12.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isActiveMatches(tab_r12.activeMatch) ? 5 : -1);
} }
function BottomNavComponent_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 10);
} }
export class BottomNavComponent {
    constructor() {
        this.router = inject(Router);
        this.state = inject(StateService);
        this.qrService = inject(QrGlobalService);
        this.auth = inject(AuthService);
        this.toast = inject(ToastService);
        this.getAvatarUrl = getAvatarUrl;
        this.showMenu = signal(false);
        this.isClosing = signal(false);
        this.currentUrl = signal('');
        this.dragTransform = signal(0);
        this.touchStartY = 0;
        this.currentY = 0;
        this.storedRecentlyVisited = signal([]);
        this.requestsCount = computed(() => this.state.requests().length);
        this.recentlyVisited = computed(() => this.storedRecentlyVisited().filter(page => this.canAccessPath(page.path)));
        this.pageTitle = computed(() => {
            const url = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
            return ROUTE_TITLES[url] || 'LIMS Cloud';
        });
        this.menuGroups = computed(() => {
            const sharedGroups = NAVIGATION_GROUPS.map(group => ({
                id: group.id,
                title: group.title,
                accentClass: this.accentClass(group.id),
                items: group.items
                    .map(item => this.toMenuItem(item))
                    .filter(item => !item.isLocked || this.state.showLockedFeatures())
            })).filter(group => group.items.length > 0);
            return [
                ...sharedGroups,
                {
                    id: 'system',
                    title: 'Hệ thống và tiện ích',
                    accentClass: this.accentClass('system'),
                    items: [
                        { id: 'scan', name: 'Quét QR', icon: 'fa-qrcode', action: () => this.startScan(), isLocked: false },
                        { id: 'dark-mode', name: 'Giao Diện', icon: this.state.darkMode() ? 'fa-sun' : 'fa-moon', action: () => this.toggleDarkMode(), isLocked: false },
                        { id: 'install-pwa', name: 'Cài Ứng Dụng', icon: 'fa-download', kind: 'install', isLocked: false },
                        { id: 'config', name: 'Cấu Hình', icon: 'fa-gear', path: '/config', activeMatch: ['/config'], isLocked: false },
                        { id: 'logout', name: 'Đăng Xuất', icon: 'fa-right-from-bracket', action: () => this.auth.logout(), isLocked: false }
                    ]
                }
            ];
        });
        this.bottomTabs = computed(() => {
            const dashboard = {
                id: 'dashboard',
                name: 'Trang Chủ',
                icon: 'fa-house',
                path: '/dashboard',
                activeColor: this.tabColor('dashboard'),
                activeMatch: ['/dashboard']
            };
            const documents = this.findNavigationItem('documents');
            const second = this.firstAccessible(['inventory', 'documents']) || documents;
            const third = this.firstAccessible(['smart-batch', 'stats', 'standards', 'documents']) || documents;
            const tabs = [dashboard];
            if (second)
                tabs.push(this.toBottomTab(second));
            if (third && third.id !== second?.id)
                tabs.push(this.toBottomTab(third));
            return tabs.slice(0, 3);
        });
    }
    ngOnInit() {
        this.currentUrl.set(this.router.url);
        this.routerSub = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(event => this.currentUrl.set(event.urlAfterRedirects));
        this.loadRecentlyVisited();
    }
    ngOnDestroy() {
        this.routerSub?.unsubscribe();
        if (this.closeTimer)
            clearTimeout(this.closeTimer);
    }
    haptic(duration = 10) {
        if (!('vibrate' in navigator))
            return;
        try {
            navigator.vibrate(duration);
        }
        catch {
            // Haptics are optional and unsupported in some browsers.
        }
    }
    handleLockedItemClick(item) {
        this.haptic();
        const permission = item.lockPermission || 'đặc biệt';
        const permissionName = permission === 'role:manager'
            ? 'Quản trị viên'
            : (this.auth.getPermissionName(permission) || permission);
        this.toast.show(`Cần quyền "${permissionName}" · Liên hệ quản trị viên để được cấp`, 'warning');
    }
    toggleDarkMode() {
        this.haptic();
        this.state.toggleDarkMode();
        this.closeMenu();
    }
    toggleMenu() {
        this.haptic();
        if (this.showMenu()) {
            this.closeMenu();
            return;
        }
        this.showMenu.set(true);
        this.isClosing.set(false);
    }
    closeMenu() {
        if (!this.showMenu())
            return;
        this.isClosing.set(true);
        if (this.closeTimer)
            clearTimeout(this.closeTimer);
        this.closeTimer = setTimeout(() => {
            this.showMenu.set(false);
            this.isClosing.set(false);
            this.dragTransform.set(0);
            this.closeTimer = undefined;
        }, 250);
    }
    startScan() {
        this.haptic();
        this.closeMenu();
        this.qrService.startScan();
    }
    navTo(path, name, icon) {
        if (!this.canAccessPath(path))
            return;
        this.haptic();
        this.closeMenu();
        this.router.navigate([path]);
        if (name && icon && path !== '/dashboard') {
            this.saveToRecentlyVisited({ name, path, icon });
        }
    }
    isActiveMatches(paths) {
        return paths.some(path => this.currentUrl().startsWith(path));
    }
    isItemActive(item) {
        return !!item.activeMatch && this.isActiveMatches(item.activeMatch);
    }
    canAccessPath(path) {
        const segment = path.replace(/^\//, '').split(/[/?#]/)[0];
        return this.canAccess(ROUTE_ACCESS[segment]);
    }
    accentDotClass(groupId) {
        const classes = {
            overview: 'bg-emerald-500',
            operation: 'bg-indigo-500',
            storage: 'bg-amber-500',
            administration: 'bg-rose-500',
            system: 'bg-slate-500'
        };
        return classes[groupId] || 'bg-fuchsia-500';
    }
    saveToRecentlyVisited(page) {
        if (!this.canAccessPath(page.path))
            return;
        const recent = [
            page,
            ...this.storedRecentlyVisited().filter(item => item.path !== page.path)
        ].slice(0, 3);
        this.storedRecentlyVisited.set(recent);
        this.persistRecentlyVisited(recent);
    }
    loadRecentlyVisited() {
        try {
            const stored = localStorage.getItem('lims_recently_visited');
            if (!stored)
                return;
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed))
                return;
            const valid = parsed.filter((page) => !!page &&
                typeof page.name === 'string' &&
                typeof page.path === 'string' &&
                typeof page.icon === 'string').slice(0, 3);
            this.storedRecentlyVisited.set(valid);
        }
        catch {
            this.storedRecentlyVisited.set([]);
        }
    }
    persistRecentlyVisited(pages) {
        try {
            localStorage.setItem('lims_recently_visited', JSON.stringify(pages));
        }
        catch {
            // Storage can be unavailable in private browsing or restricted contexts.
        }
    }
    onTouchStartPanel(event) {
        if (this.isClosing())
            return;
        this.touchStartY = event.touches[0].clientY;
        this.currentY = this.touchStartY;
    }
    onTouchMovePanel(event) {
        if (this.touchStartY === 0 || this.isClosing())
            return;
        this.currentY = event.touches[0].clientY;
        const deltaY = this.currentY - this.touchStartY;
        if (deltaY > 0) {
            this.dragTransform.set(deltaY * 0.8);
            if (deltaY > 10)
                event.preventDefault();
        }
    }
    onTouchEndPanel() {
        if (this.touchStartY === 0 || this.isClosing())
            return;
        const deltaY = this.currentY - this.touchStartY;
        if (deltaY > 80) {
            this.closeMenu();
        }
        else {
            this.dragTransform.set(0);
        }
        this.touchStartY = 0;
        this.currentY = 0;
    }
    toMenuItem(item) {
        return {
            id: item.id,
            name: item.name,
            icon: item.icon,
            path: `/${item.path}`,
            activeMatch: item.activeMatch,
            badgeKey: item.badgeKey,
            isLocked: !this.canAccess(item.access),
            lockPermission: item.lockPermission || item.access
        };
    }
    canAccess(access) {
        if (!access)
            return true;
        if (access === 'role:manager')
            return this.state.isAdmin();
        return this.auth.hasPermission(access);
    }
    findNavigationItem(id) {
        return NAVIGATION_GROUPS.flatMap(group => group.items).find(item => item.id === id);
    }
    firstAccessible(ids) {
        return ids
            .map(id => this.findNavigationItem(id))
            .find((item) => !!item && this.canAccess(item.access));
    }
    toBottomTab(item) {
        const shortNames = {
            inventory: 'Kho',
            documents: 'Giao nhận',
            'smart-batch': 'Lập mẻ',
            stats: 'Báo Cáo',
            standards: 'Chuẩn'
        };
        return {
            id: item.id,
            name: shortNames[item.id] || item.name,
            icon: item.icon,
            path: `/${item.path}`,
            activeColor: this.tabColor(item.id),
            activeMatch: item.activeMatch
        };
    }
    tabColor(id) {
        const colors = {
            dashboard: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
            inventory: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30',
            documents: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30',
            'smart-batch': 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30',
            stats: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
            standards: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'
        };
        return colors[id] || 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30';
    }
    accentClass(groupId) {
        const classes = {
            overview: 'from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30',
            operation: 'from-purple-500/15 to-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/30',
            storage: 'from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30',
            administration: 'from-rose-500/15 to-fuchsia-500/15 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/30',
            system: 'from-slate-500/15 to-slate-700/15 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/30'
        };
        return classes[groupId] || classes['system'];
    }
    static { this.ɵfac = function BottomNavComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BottomNavComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BottomNavComponent, selectors: [["app-bottom-nav"]], decls: 18, vars: 12, consts: [["aria-label", "\u0110i\u1EC1u h\u01B0\u1EDBng ch\u00EDnh tr\u00EAn di \u0111\u1ED9ng", 1, "fixed", "bottom-0", "left-0", "w-full", "bg-white/95", "dark:bg-slate-900/95", "backdrop-blur-xl", "border-t", "border-slate-200/80", "dark:border-slate-800", "shadow-[0_-8px_30px_-6px_rgba(0,0,0,0.1)]", "dark:shadow-none", "z-[40]", "md:hidden", "pb-safe"], ["aria-hidden", "true", 1, "absolute", "-top-3", "left-1/2", "-translate-x-1/2", "pointer-events-none", "fade-in"], [1, "bg-slate-800", "dark:bg-slate-700", "text-white", "text-[10px]", "font-bold", "px-3", "py-0.5", "rounded-full", "shadow-md", "uppercase", "tracking-wider", "border", "border-slate-600"], [1, "flex", "items-center", "justify-around", "h-[72px]", "px-1", "relative", "pt-1"], ["type", "button", 1, "flex", "flex-col", "items-center", "justify-center", "min-w-[56px]", "py-2", "gap-1", "group", "active:scale-90", "transition-transform", "relative"], [1, "flex", "flex-col", "items-center", "justify-center", "min-w-[60px]", "group", "pb-0.5"], [3, "bottomNavMode"], ["type", "button", "aria-controls", "bottom-nav-menu", 1, "flex", "flex-col", "items-center", "justify-center", "min-w-[56px]", "py-2", "gap-1", "group", "active:scale-90", "transition-transform", "relative", 3, "click"], [1, "w-10", "h-10", "rounded-2xl", "flex", "items-center", "justify-center", "transition-all", "duration-300", "relative"], ["aria-hidden", "true", 1, "fa-solid", "text-[1.1rem]", "transition-transform", "duration-300"], [1, "absolute", "top-0", "right-0", "w-2.5", "h-2.5", "bg-red-500", "rounded-full", "border-2", "border-white", "dark:border-slate-900", "animate-pulse"], [1, "text-[10px]", "font-bold", "transition-colors"], [1, "fixed", "inset-0", "z-[45]", "bg-black/60", "backdrop-blur-sm", "transition-opacity", "duration-250", "ease-out", 3, "click"], ["id", "bottom-nav-menu", "role", "dialog", "aria-modal", "true", "aria-label", "Menu \u0111i\u1EC1u h\u01B0\u1EDBng", 1, "fixed", "bottom-0", "right-0", "left-0", "z-[50]", "max-h-[calc(100dvh-env(safe-area-inset-top,0px)-0.5rem)]", "flex", "flex-col", "bg-white", "dark:bg-slate-900", "rounded-t-[32px]", "shadow-[0_-10px_40px_rgba(0,0,0,0.2)]", "border-t", "border-slate-200", "dark:border-slate-800", "overflow-hidden", "origin-bottom", "transition-transform", "duration-250", "ease-out", "pb-safe", 3, "touchstart", "touchmove", "touchend"], ["type", "button", "aria-label", "\u0110\u00F3ng menu", 1, "w-full", "flex", "justify-center", "pt-3", "pb-1", "shrink-0", 3, "click"], [1, "w-12", "h-1.5", "bg-slate-300", "dark:bg-slate-700", "rounded-full"], ["type", "button", "aria-label", "M\u1EDF c\u1EA5u h\u00ECnh t\u00E0i kho\u1EA3n", 1, "w-full", "px-5", "pb-3", "pt-1", "flex", "items-center", "gap-3", "text-left", "active:scale-[0.98]", "transition-transform", "shrink-0", 3, "click"], ["alt", "\u1EA2nh \u0111\u1EA1i di\u1EC7n", 1, "w-11", "h-11", "rounded-full", "border-2", "border-white", "dark:border-slate-700", "shadow-sm", "bg-white", "dark:bg-slate-800", "object-cover", 3, "src"], [1, "flex-1", "min-w-0"], [1, "block", "font-bold", "text-slate-800", "dark:text-slate-200", "text-sm", "truncate"], [1, "block", "text-[11px]", "text-slate-500", "dark:text-slate-400", "font-medium", "truncate"], [1, "text-[10px]", "font-black", "uppercase", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "px-2", "py-1", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700"], ["aria-hidden", "true", 1, "fa-solid", "fa-chevron-right", "text-slate-300", "dark:text-slate-600", "text-xs", "ml-1"], [1, "px-5", "pb-4", "border-b", "border-slate-100", "dark:border-slate-800/80", "shrink-0"], [1, "flex", "items-center", "gap-2", "mb-3", "overflow-x-auto", "no-scrollbar", "pb-1"], [1, "flex", "gap-3"], ["type", "button", 1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-3", "rounded-2xl", "bg-slate-800", "dark:bg-slate-700", "text-white", "font-bold", "text-sm", "shadow-md", "active:scale-95", "transition-transform", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-qrcode", "text-lg"], ["type", "button", 1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-3", "rounded-2xl", "bg-fuchsia-100", "dark:bg-fuchsia-900/30", "text-fuchsia-700", "dark:text-fuchsia-300", "font-bold", "text-sm", "shadow-sm", "active:scale-95", "transition-transform", "border", "border-fuchsia-200", "dark:border-fuchsia-800/50"], [1, "flex-1", "min-h-0", "px-5", "py-4", "overflow-y-auto", "custom-scrollbar"], [1, "space-y-6", "pb-4"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "shrink-0", "mr-1"], ["aria-hidden", "true", 1, "fa-solid", "fa-clock-rotate-left", "mr-1"], ["type", "button", 1, "shrink-0", "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "px-2.5", "py-1.5", "rounded-lg", "text-[11px]", "font-semibold", "text-slate-600", "dark:text-slate-300", "active:scale-95", "transition-transform"], ["type", "button", 1, "shrink-0", "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "px-2.5", "py-1.5", "rounded-lg", "text-[11px]", "font-semibold", "text-slate-600", "dark:text-slate-300", "active:scale-95", "transition-transform", 3, "click"], ["aria-hidden", "true"], ["type", "button", 1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-3", "rounded-2xl", "bg-fuchsia-100", "dark:bg-fuchsia-900/30", "text-fuchsia-700", "dark:text-fuchsia-300", "font-bold", "text-sm", "shadow-sm", "active:scale-95", "transition-transform", "border", "border-fuchsia-200", "dark:border-fuchsia-800/50", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-square-poll-vertical", "text-lg"], [1, "flex", "items-center", "gap-2", "mb-3", "px-1"], [1, "w-1.5", "h-1.5", "rounded-full", 3, "ngClass"], [1, "text-[10px]", "font-extrabold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "grid", "grid-cols-4", "gap-x-2", "gap-y-4"], [3, "menuTile"], ["type", "button", 1, "flex", "flex-col", "items-center", "gap-1.5", "group", "active:scale-90", "transition-transform", "relative", 3, "opacity-50", "grayscale", "cursor-not-allowed"], ["type", "button", 1, "flex", "flex-col", "items-center", "gap-1.5", "group", "active:scale-90", "transition-transform", "relative", 3, "click"], [1, "w-14", "h-14", "rounded-[1.25rem]", "flex", "items-center", "justify-center", "text-xl", "transition-all", "border", "relative", "bg-gradient-to-tr", "shadow-sm", 3, "ngClass"], [1, "absolute", "-top-1", "-right-1", "w-4", "h-4", "bg-white", "dark:bg-slate-800", "rounded-full", "flex", "items-center", "justify-center", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm"], [1, "absolute", "-top-1", "-right-1", "min-w-5", "h-5", "px-1", "rounded-full", "bg-red-500", "text-white", "text-[9px]", "font-black", "flex", "items-center", "justify-center", "border-2", "border-white", "dark:border-slate-900"], [1, "text-[10px]", "font-bold", "text-center", "leading-tight", "px-0.5", 3, "ngClass"], ["aria-hidden", "true", 1, "fa-solid", "fa-lock", "text-[8px]", "text-amber-500"], ["type", "button", 1, "flex", "flex-col", "items-center", "justify-center", "min-w-[56px]", "py-2", "gap-1", "group", "active:scale-90", "transition-transform", "relative", 3, "click"], [1, "w-10", "h-10", "rounded-2xl", "flex", "items-center", "justify-center", "transition-all", "duration-300", "relative", "overflow-hidden"], [1, "text-[10px]", "font-bold", "transition-colors", 3, "ngClass"], [1, "absolute", "bottom-0.5", "w-4", "h-1", "rounded-full", "animate-fade-in", 3, "ngClass"]], template: function BottomNavComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, BottomNavComponent_Conditional_0_Template, 25, 16);
            i0.ɵɵelementStart(1, "nav", 0)(2, "div", 1)(3, "div", 2);
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(5, "div", 3);
            i0.ɵɵrepeaterCreate(6, BottomNavComponent_For_7_Template, 6, 11, "button", 4, _forTrack0);
            i0.ɵɵelementStart(8, "div", 5);
            i0.ɵɵelement(9, "app-notification-bell", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(10, BottomNavComponent_For_11_Template, 6, 11, "button", 4, _forTrack0);
            i0.ɵɵelementStart(12, "button", 7);
            i0.ɵɵlistener("click", function BottomNavComponent_Template_button_click_12_listener() { return ctx.toggleMenu(); });
            i0.ɵɵelementStart(13, "span", 8);
            i0.ɵɵelement(14, "i", 9);
            i0.ɵɵtemplate(15, BottomNavComponent_Conditional_15_Template, 1, 0, "span", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "span", 11);
            i0.ɵɵtext(17);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.showMenu() || ctx.isClosing() ? 0 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate1(" ", ctx.pageTitle(), " ");
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.bottomTabs().slice(0, 2));
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("bottomNavMode", true);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.bottomTabs().slice(2, 3));
            i0.ɵɵadvance(2);
            i0.ɵɵattribute("aria-expanded", ctx.showMenu());
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.showMenu() ? "bg-slate-800 dark:bg-slate-700 text-white shadow-md scale-105" : "text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800");
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.showMenu() ? "fa-xmark rotate-90" : "fa-bars");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.requestsCount() > 0 && !ctx.showMenu() ? 15 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.showMenu() ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.showMenu() ? "\u0110\u00F3ng" : "Menu", " ");
        } }, dependencies: [CommonModule, i1.NgClass, RouterModule, NotificationBellComponent, PwaInstallPromptComponent], styles: [".pb-safe[_ngcontent-%COMP%] { padding-bottom: env(safe-area-inset-bottom, 0px); }\n    @keyframes _ngcontent-%COMP%_slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }\n    .animate-slide-up[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n    .no-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar { display: none; }\n    .no-scrollbar[_ngcontent-%COMP%] { -ms-overflow-style: none; scrollbar-width: none; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BottomNavComponent, [{
        type: Component,
        args: [{ selector: 'app-bottom-nav', standalone: true, imports: [CommonModule, RouterModule, NotificationBellComponent, PwaInstallPromptComponent], template: `
    @if (showMenu() || isClosing()) {
      <div
        class="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm transition-opacity duration-250 ease-out"
        [class.opacity-0]="isClosing()"
        [class.opacity-100]="!isClosing()"
        (click)="closeMenu()"></div>

      <div
        id="bottom-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        class="fixed bottom-0 right-0 left-0 z-[50] max-h-[calc(100dvh-env(safe-area-inset-top,0px)-0.5rem)] flex flex-col
               bg-white dark:bg-slate-900 rounded-t-[32px]
               shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-slate-200 dark:border-slate-800
               overflow-hidden origin-bottom transition-transform duration-250 ease-out pb-safe"
        [class.animate-slide-up]="!isClosing()"
        [class.translate-y-full]="isClosing()"
        [style.transform]="dragTransform() > 0 && !isClosing() ? 'translateY(' + dragTransform() + 'px)' : ''"
        (touchstart)="onTouchStartPanel($event)"
        (touchmove)="onTouchMovePanel($event)"
        (touchend)="onTouchEndPanel()">

        <button
          type="button"
          class="w-full flex justify-center pt-3 pb-1 shrink-0"
          aria-label="Đóng menu"
          (click)="closeMenu()">
          <span class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
        </button>

        <button
          type="button"
          class="w-full px-5 pb-3 pt-1 flex items-center gap-3 text-left active:scale-[0.98] transition-transform shrink-0"
          aria-label="Mở cấu hình tài khoản"
          (click)="navTo('/config')">
          <img
            [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
            class="w-11 h-11 rounded-full border-2 border-white dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 object-cover"
            alt="Ảnh đại diện">
          <span class="flex-1 min-w-0">
            <span class="block font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{{ auth.currentUser()?.displayName }}</span>
            <span class="block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{{ auth.currentUser()?.email }}</span>
          </span>
          <span class="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {{ auth.currentUser()?.role }}
          </span>
          <i class="fa-solid fa-chevron-right text-slate-300 dark:text-slate-600 text-xs ml-1" aria-hidden="true"></i>
        </button>

        <div class="px-5 pb-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          @if (recentlyVisited().length > 0) {
            <div class="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 mr-1">
                <i class="fa-solid fa-clock-rotate-left mr-1" aria-hidden="true"></i> Gần đây:
              </span>
              @for (page of recentlyVisited(); track page.path) {
                <button
                  type="button"
                  (click)="navTo(page.path, page.name, page.icon)"
                  class="shrink-0 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 active:scale-95 transition-transform">
                  <i class="fa-solid {{ page.icon }} text-[10px]" aria-hidden="true"></i> {{ page.name }}
                </button>
              }
            </div>
          }

          <div class="flex gap-3">
            <button
              type="button"
              (click)="startScan()"
              class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-sm shadow-md active:scale-95 transition-transform">
              <i class="fa-solid fa-qrcode text-lg" aria-hidden="true"></i> Quét Mã
            </button>
            @if (canAccessPath('/results')) {
              <button
                type="button"
                (click)="navTo('/results', 'Nhập kết quả', 'fa-square-poll-vertical')"
                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 font-bold text-sm shadow-sm active:scale-95 transition-transform border border-fuchsia-200 dark:border-fuchsia-800/50">
                <i class="fa-solid fa-square-poll-vertical text-lg" aria-hidden="true"></i> Nhập Kết Quả
              </button>
            }
          </div>
        </div>

        <div class="flex-1 min-h-0 px-5 py-4 overflow-y-auto custom-scrollbar">
          <div class="space-y-6 pb-4">
            @for (group of menuGroups(); track group.id) {
              <section>
                <div class="flex items-center gap-2 mb-3 px-1">
                  <span class="w-1.5 h-1.5 rounded-full" [ngClass]="accentDotClass(group.id)"></span>
                  <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ group.title }}</span>
                </div>
                <div class="grid grid-cols-4 gap-x-2 gap-y-4">
                  @for (item of group.items; track item.id) {
                    @if (item.kind === 'install') {
                      <app-pwa-install-prompt [menuTile]="true"></app-pwa-install-prompt>
                    } @else {
                      <button
                        type="button"
                        (click)="item.isLocked ? handleLockedItemClick(item) : (item.action ? item.action() : (item.path ? navTo(item.path, item.name, item.icon) : null))"
                        [attr.aria-current]="item.path && isItemActive(item) ? 'page' : null"
                        [attr.aria-disabled]="item.isLocked ? 'true' : null"
                        [class.opacity-50]="item.isLocked"
                        [class.grayscale]="item.isLocked"
                        [class.cursor-not-allowed]="item.isLocked"
                        class="flex flex-col items-center gap-1.5 group active:scale-90 transition-transform relative">
                        <span
                          class="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-xl transition-all border relative bg-gradient-to-tr shadow-sm"
                          [ngClass]="item.isLocked
                            ? 'bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200/50 dark:border-slate-700/50'
                            : (isItemActive(item)
                              ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md scale-105 border-transparent'
                              : group.accentClass)">
                          <i class="fa-solid {{ item.icon }}" aria-hidden="true"></i>
                          @if (item.isLocked) {
                            <span class="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                              <i class="fa-solid fa-lock text-[8px] text-amber-500" aria-hidden="true"></i>
                            </span>
                          }
                          @if (!item.isLocked && item.badgeKey === 'requests' && requestsCount() > 0) {
                            <span class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
                              {{ requestsCount() > 99 ? '99+' : requestsCount() }}
                            </span>
                          }
                        </span>
                        <span
                          class="text-[10px] font-bold text-center leading-tight px-0.5"
                          [ngClass]="item.isLocked
                            ? 'text-slate-400 dark:text-slate-500'
                            : (isItemActive(item) ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400')">
                          {{ item.name }}
                        </span>
                      </button>
                    }
                  }
                </div>
              </section>
            }
          </div>
        </div>
      </div>
    }

    <nav
      class="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-8px_30px_-6px_rgba(0,0,0,0.1)] dark:shadow-none z-[40] md:hidden pb-safe"
      aria-label="Điều hướng chính trên di động">

      <div class="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none fade-in" aria-hidden="true">
        <div class="bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider border border-slate-600">
          {{ pageTitle() }}
        </div>
      </div>

      <div class="flex items-center justify-around h-[72px] px-1 relative pt-1">
        @for (tab of bottomTabs().slice(0, 2); track tab.id) {
          <button
            type="button"
            (click)="navTo(tab.path, tab.name, tab.icon)"
            [attr.aria-current]="isActiveMatches(tab.activeMatch) ? 'page' : null"
            class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
            <span
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
              [class]="isActiveMatches(tab.activeMatch) ? tab.activeColor + ' shadow-inner scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
              <i class="fa-solid {{ tab.icon }} text-[1.1rem] transition-transform duration-300" [class.-translate-y-0.5]="isActiveMatches(tab.activeMatch)" aria-hidden="true"></i>
            </span>
            <span class="text-[10px] font-bold transition-colors" [ngClass]="isActiveMatches(tab.activeMatch) ? tab.activeColor.split(' ')[0] : 'text-slate-400 dark:text-slate-500'">{{ tab.name }}</span>
            @if (isActiveMatches(tab.activeMatch)) {
              <span class="absolute bottom-0.5 w-4 h-1 rounded-full animate-fade-in" [ngClass]="tab.activeColor.split(' ')[0].replace('text-', 'bg-')"></span>
            }
          </button>
        }

        <div class="flex flex-col items-center justify-center min-w-[60px] group pb-0.5">
          <app-notification-bell [bottomNavMode]="true"></app-notification-bell>
        </div>

        @for (tab of bottomTabs().slice(2, 3); track tab.id) {
          <button
            type="button"
            (click)="navTo(tab.path, tab.name, tab.icon)"
            [attr.aria-current]="isActiveMatches(tab.activeMatch) ? 'page' : null"
            class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
            <span
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
              [class]="isActiveMatches(tab.activeMatch) ? tab.activeColor + ' shadow-inner scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
              <i class="fa-solid {{ tab.icon }} text-[1.1rem] transition-transform duration-300" [class.-translate-y-0.5]="isActiveMatches(tab.activeMatch)" aria-hidden="true"></i>
            </span>
            <span class="text-[10px] font-bold transition-colors" [ngClass]="isActiveMatches(tab.activeMatch) ? tab.activeColor.split(' ')[0] : 'text-slate-400 dark:text-slate-500'">{{ tab.name }}</span>
            @if (isActiveMatches(tab.activeMatch)) {
              <span class="absolute bottom-0.5 w-4 h-1 rounded-full animate-fade-in" [ngClass]="tab.activeColor.split(' ')[0].replace('text-', 'bg-')"></span>
            }
          </button>
        }

        <button
          type="button"
          (click)="toggleMenu()"
          aria-controls="bottom-nav-menu"
          [attr.aria-expanded]="showMenu()"
          class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
          <span
            class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative"
            [class]="showMenu() ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-md scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
            <i class="fa-solid text-[1.1rem] transition-transform duration-300" [class]="showMenu() ? 'fa-xmark rotate-90' : 'fa-bars'" aria-hidden="true"></i>
            @if (requestsCount() > 0 && !showMenu()) {
              <span class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            }
          </span>
          <span class="text-[10px] font-bold transition-colors" [class]="showMenu() ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'">
            {{ showMenu() ? 'Đóng' : 'Menu' }}
          </span>
        </button>
      </div>
    </nav>
  `, styles: ["\n    .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }\n    @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }\n    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n    .no-scrollbar::-webkit-scrollbar { display: none; }\n    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BottomNavComponent, { className: "BottomNavComponent", filePath: "src/app/core/layout/bottom-nav.component.ts", lineNumber: 285 }); })();
//# sourceMappingURL=bottom-nav.component.js.map