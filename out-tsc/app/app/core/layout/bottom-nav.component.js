import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { QrGlobalService } from '../services/qr-global.service';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';
import { getAvatarUrl } from '../../shared/utils/utils';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';
import { LogoComponent } from '../../shared/components/logo.component';
import { ToastService } from '../services/toast.service';
import { filter } from 'rxjs/operators';
import { ROUTE_TITLES } from './navigation.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const BottomNavComponent_Conditional_1_Defer_25_DepsFn = () => [i1.NgClass];
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.path;
const _forTrack2 = ($index, $item) => $item.name;
function BottomNavComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleInstallGuide()); });
    i0.ɵɵelementStart(1, "div", 14);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_Template_div_click_1_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "div", 15)(3, "div", 16);
    i0.ɵɵelement(4, "app-logo", 17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "h3", 18);
    i0.ɵɵtext(6, "C\u00E0i \u0110\u1EB7t LIMS Pro");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 19);
    i0.ɵɵtext(8, "Th\u00EAm \u1EE9ng d\u1EE5ng v\u00E0o m\u00E0n h\u00ECnh ch\u00EDnh \u0111\u1EC3 s\u1EED d\u1EE5ng to\u00E0n m\u00E0n h\u00ECnh v\u00E0 m\u01B0\u1EE3t m\u00E0 h\u01A1n.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 20)(10, "div", 21)(11, "div", 22);
    i0.ɵɵtext(12, "1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 23);
    i0.ɵɵtext(14, " Nh\u1EA5n v\u00E0o n\u00FAt ");
    i0.ɵɵelementStart(15, "span", 24);
    i0.ɵɵelement(16, "i", 25);
    i0.ɵɵtext(17, " Chia s\u1EBB");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(18, " tr\u00EAn thanh c\u00F4ng c\u1EE5 Safari. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(19, "div", 26);
    i0.ɵɵelementStart(20, "div", 21)(21, "div", 22);
    i0.ɵɵtext(22, "2");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "div", 23);
    i0.ɵɵtext(24, " Ch\u1ECDn d\u00F2ng ");
    i0.ɵɵelementStart(25, "span", 24);
    i0.ɵɵelement(26, "i", 27);
    i0.ɵɵtext(27, " Th\u00EAm v\u00E0o MH ch\u00EDnh");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(28, ". ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "div", 28)(30, "button", 29);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_0_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleInstallGuide()); });
    i0.ɵɵtext(31, "\u0110\u00E3 Hi\u1EC3u");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "div", 30);
    i0.ɵɵelement(33, "i", 31);
    i0.ɵɵelementEnd()()();
} }
function BottomNavComponent_Conditional_1_Conditional_16_For_5_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 54);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_1_Conditional_16_For_5_Template_button_click_0_listener() { const page_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.navTo(page_r5.path, page_r5.name, page_r5.icon)); });
    i0.ɵɵelement(1, "i");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const page_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", page_r5.icon, " text-[10px]");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", page_r5.name, " ");
} }
function BottomNavComponent_Conditional_1_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 45)(1, "span", 51);
    i0.ɵɵelement(2, "i", 52);
    i0.ɵɵtext(3, " G\u1EA7n \u0111\u00E2y:");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(4, BottomNavComponent_Conditional_1_Conditional_16_For_5_Template, 3, 4, "button", 53, _forTrack1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.recentlyVisited());
} }
function BottomNavComponent_Conditional_1_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 55);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_1_Conditional_21_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.navTo("/results", "Nh\u1EADp k\u1EBFt qu\u1EA3", "fa-square-poll-vertical")); });
    i0.ɵɵelement(1, "i", 56);
    i0.ɵɵtext(2, " Nh\u1EADp K\u1EBFt Qu\u1EA3 ");
    i0.ɵɵelementEnd();
} }
function BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i");
} if (rf & 2) {
    const item_r8 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵclassMapInterpolate1("fa-solid ", item_r8.icon, "");
} }
function BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i");
} if (rf & 2) {
    const item_r8 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵclassMapInterpolate1("fa-solid ", item_r8.icon, " !text-white z-10 relative");
} }
function BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i");
} if (rf & 2) {
    const item_r8 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵclassMapInterpolate1("fa-solid ", item_r8.icon, "");
} }
function BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 66);
    i0.ɵɵelement(1, "i", 68);
    i0.ɵɵelementEnd();
} }
function BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 63);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const item_r8 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(item_r8.isLocked ? ctx_r1.handleLockedItemClick(item_r8) : item_r8.action ? item_r8.action() : item_r8.path ? ctx_r1.navTo(item_r8.path, item_r8.name, item_r8.icon) : null); });
    i0.ɵɵelementStart(1, "div", 64);
    i0.ɵɵtemplate(2, BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Conditional_2_Template, 1, 3, "i", 65)(3, BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Conditional_3_Template, 1, 3, "i", 65)(4, BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Conditional_4_Template, 1, 3, "i", 65)(5, BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Conditional_5_Template, 2, 0, "span", 66);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 67);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r8 = i0.ɵɵnextContext().$implicit;
    const group_r9 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("opacity-50", item_r8.isLocked)("grayscale", item_r8.isLocked)("cursor-not-allowed", item_r8.isLocked);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", item_r8.isLocked ? "bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200/50 dark:border-slate-700/50" : item_r8.isActive ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md scale-105 border-transparent" : (item_r8.customClass || group_r9.accentClass) + " bg-gradient-to-tr shadow-sm");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r8.isActive && ctx_r1.state.darkMode() ? 2 : item_r8.isActive && !ctx_r1.state.darkMode() ? 3 : 4);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(item_r8.isLocked ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", item_r8.isLocked ? "text-slate-400 dark:text-slate-500" : item_r8.isActive ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r8.name, " ");
} }
function BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Conditional_0_Template, 8, 11, "button", 62);
} if (rf & 2) {
    const item_r8 = ctx.$implicit;
    i0.ɵɵconditional(!item_r8.isSpecial ? 0 : -1);
} }
function BottomNavComponent_Conditional_1_Defer_23_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "div", 58);
    i0.ɵɵelement(2, "div", 59);
    i0.ɵɵelementStart(3, "span", 60);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 61);
    i0.ɵɵrepeaterCreate(6, BottomNavComponent_Conditional_1_Defer_23_For_2_For_7_Template, 1, 1, null, null, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r9 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", group_r9.accentClass.split(" ")[0].replace("from-", "bg-").replace("/15", ""));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r9.title);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(group_r9.items);
} }
function BottomNavComponent_Conditional_1_Defer_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 57);
    i0.ɵɵrepeaterCreate(1, BottomNavComponent_Conditional_1_Defer_23_For_2_Template, 8, 2, "div", null, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.menuGroups());
} }
function BottomNavComponent_Conditional_1_DeferPlaceholder_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 69);
    i0.ɵɵelement(1, "i", 70);
    i0.ɵɵelementEnd();
} }
function BottomNavComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 32);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_1_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeMenu()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(1, "div", 33);
    i0.ɵɵlistener("touchstart", function BottomNavComponent_Conditional_1_Template_div_touchstart_1_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onTouchStartPanel($event)); })("touchmove", function BottomNavComponent_Conditional_1_Template_div_touchmove_1_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onTouchMovePanel($event)); })("touchend", function BottomNavComponent_Conditional_1_Template_div_touchend_1_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onTouchEndPanel()); });
    i0.ɵɵelementStart(2, "div", 34);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_1_Template_div_click_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeMenu()); });
    i0.ɵɵelement(3, "div", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 36);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_1_Template_div_click_4_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.navTo("/config")); });
    i0.ɵɵelement(5, "img", 37);
    i0.ɵɵelementStart(6, "div", 38)(7, "div", 39);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 40);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 41)(12, "span", 42);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(14, "i", 43);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div", 44);
    i0.ɵɵtemplate(16, BottomNavComponent_Conditional_1_Conditional_16_Template, 6, 0, "div", 45);
    i0.ɵɵelementStart(17, "div", 46)(18, "button", 47);
    i0.ɵɵlistener("click", function BottomNavComponent_Conditional_1_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.startScan()); });
    i0.ɵɵelement(19, "i", 48);
    i0.ɵɵtext(20, " Qu\u00E9t M\u00E3 ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(21, BottomNavComponent_Conditional_1_Conditional_21_Template, 3, 0, "button", 49);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 50);
    i0.ɵɵtemplate(23, BottomNavComponent_Conditional_1_Defer_23_Template, 3, 0)(24, BottomNavComponent_Conditional_1_DeferPlaceholder_24_Template, 2, 0);
    i0.ɵɵdefer(25, 23, BottomNavComponent_Conditional_1_Defer_25_DepsFn, null, 24);
    i0.ɵɵdeferOnIdle();
    i0.ɵɵelementEnd()();
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
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((tmp_9_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_9_0.role);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.recentlyVisited().length > 0 ? 16 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.auth.canViewSop() ? 21 : -1);
} }
function BottomNavComponent_For_8_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 73);
} if (rf & 2) {
    const tab_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("ngClass", tab_r11.activeColor.split(" ")[0].replace("text-", "bg-"));
} }
function BottomNavComponent_For_8_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function BottomNavComponent_For_8_Template_button_click_0_listener() { const tab_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.navTo(tab_r11.path, tab_r11.name, tab_r11.icon)); });
    i0.ɵɵelementStart(1, "div", 71);
    i0.ɵɵelement(2, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 72);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, BottomNavComponent_For_8_Conditional_5_Template, 1, 1, "div", 73);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tab_r11 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.isActive(tab_r11.path) ? tab_r11.activeColor + " shadow-inner scale-105" : "text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800");
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", tab_r11.icon, " text-[1.1rem] transition-transform duration-300");
    i0.ɵɵclassProp("-translate-y-0", ctx_r1.isActive(tab_r11.path));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.isActive(tab_r11.path) ? tab_r11.activeColor.split(" ")[0] : "text-slate-400 dark:text-slate-500");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(tab_r11.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isActive(tab_r11.path) ? 5 : -1);
} }
function BottomNavComponent_For_12_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 73);
} if (rf & 2) {
    const tab_r13 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("ngClass", tab_r13.activeColor.split(" ")[0].replace("text-", "bg-"));
} }
function BottomNavComponent_For_12_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function BottomNavComponent_For_12_Template_button_click_0_listener() { const tab_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.navTo(tab_r13.path, tab_r13.name, tab_r13.icon)); });
    i0.ɵɵelementStart(1, "div", 71);
    i0.ɵɵelement(2, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 72);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, BottomNavComponent_For_12_Conditional_5_Template, 1, 1, "div", 73);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tab_r13 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.isActive(tab_r13.path) ? tab_r13.activeColor + " shadow-inner scale-105" : "text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800");
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", tab_r13.icon, " text-[1.1rem] transition-transform duration-300");
    i0.ɵɵclassProp("-translate-y-0", ctx_r1.isActive(tab_r13.path));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.isActive(tab_r13.path) ? tab_r13.activeColor.split(" ")[0] : "text-slate-400 dark:text-slate-500");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(tab_r13.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isActive(tab_r13.path) ? 5 : -1);
} }
function BottomNavComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 11);
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
        this.showInstallGuide = signal(false);
        this.currentUrl = signal('');
        // Swipe to dismiss state
        this.touchStartY = 0;
        this.currentY = 0;
        this.dragTransform = signal(0);
        // Recently visited
        this.recentlyVisited = signal([]);
        // Computed for badge on "Thêm"
        this.requestsCount = computed(() => this.state.requests().length);
        // Computed page label
        this.pageTitle = computed(() => {
            const url = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
            return ROUTE_TITLES[url] || 'LIMS Cloud';
        });
        // --- COMPUTED GROUPS & TABS ---
        this.menuGroups = computed(() => {
            const showLocked = this.state.showLockedFeatures();
            const canViewInv = this.auth.canViewInventory();
            const canViewSop = this.auth.canViewSop();
            const canRunBatch = this.auth.canRunBatch();
            const canViewStd = this.auth.canViewStandards();
            const canViewStdLog = this.auth.hasPermission('standard_log_view');
            const canViewRecipes = this.auth.canViewRecipes();
            const canViewRep = this.auth.canViewReports();
            const isManager = this.auth.currentUser()?.role === 'manager';
            const list = [
                {
                    id: 'operations',
                    title: 'Nghiệp vụ và vận hành',
                    accentClass: 'from-purple-500/15 to-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/30',
                    items: [
                        { id: 'inventory', name: 'Kho Hóa Chất', icon: 'fa-boxes-stacked', path: '/inventory', color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50', visible: canViewInv || showLocked, isLocked: !canViewInv, lockPermission: 'inventory_view' },
                        { id: 'smart-batch', name: 'Lập Mẻ Phân Tích', icon: 'fa-layer-group', path: '/smart-batch', color: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800/50', visible: canRunBatch || showLocked, isLocked: !canRunBatch, lockPermission: 'batch_run' },
                        { id: 'prep', name: 'Trạm Pha Chế', icon: 'fa-flask-vial', path: '/prep', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50', visible: true, isLocked: false },
                        { id: 'documents', name: 'Giao Nhận Mẫu', icon: 'fa-file-signature', path: '/documents', color: 'bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-100 dark:border-fuchsia-800/50', visible: true, isLocked: false },
                        { id: 'results', name: 'Kết Quả Phân Tích', icon: 'fa-vials', path: '/results', color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800/50', visible: canViewSop || showLocked, isLocked: !canViewSop, lockPermission: 'sop_view' },
                        { id: 'recipes', name: 'Công Thức', icon: 'fa-book-bookmark', path: '/recipes', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/50', visible: canViewRecipes || showLocked, isLocked: !canViewRecipes, lockPermission: 'recipe_view' },
                        { id: 'labels', name: 'In Tem Nhãn', icon: 'fa-barcode', path: '/labels', color: 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-800/50', visible: canViewInv || showLocked, isLocked: !canViewInv, lockPermission: 'inventory_view' },
                        { id: 'stats', name: 'Báo Cáo', icon: 'fa-chart-pie', path: '/stats', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50', visible: canViewRep || showLocked, isLocked: !canViewRep, lockPermission: 'report_view' }
                    ]
                },
                {
                    id: 'standards',
                    title: 'Chất Chuẩn Đối Chiếu',
                    accentClass: 'from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30',
                    items: [
                        { id: 'standards', name: 'Danh Sách Chất Chuẩn', icon: 'fa-vial-circle-check', path: '/standards', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50', visible: canViewStd || showLocked, isLocked: !canViewStd, lockPermission: 'standard_view' },
                        { id: 'standard-requests', name: 'Yêu Cầu Chất Chuẩn', icon: 'fa-clipboard-list', path: '/standard-requests', color: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/50', visible: canViewStd || showLocked, isLocked: !canViewStd, lockPermission: 'standard_view' },
                        { id: 'standard-usage', name: 'Nhật Ký Sử Dụng Chất Chuẩn', icon: 'fa-book-open', path: '/standard-usage', color: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50', visible: canViewStdLog || showLocked, isLocked: !canViewStdLog, lockPermission: 'standard_log_view' }
                    ]
                },
                {
                    id: 'system',
                    title: 'Hệ thống và tiện ích',
                    accentClass: 'from-slate-500/15 to-slate-700/15 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/30',
                    items: [
                        { id: 'scan', name: 'Quét QR', icon: 'fa-qrcode', action: () => this.startScan(), color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50', visible: true, isLocked: false },
                        { id: 'dark-mode', name: 'Giao Diện', icon: 'fa-moon', action: () => this.toggleDarkMode(), color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700', visible: true, isLocked: false },
                        { id: 'install-pwa', name: 'Cài Ứng Dụng', icon: 'fa-download', action: () => this.toggleInstallGuide(), color: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800/50', visible: true, isLocked: false },
                        { id: 'config', name: 'Cấu Hình', icon: 'fa-gear', path: '/config', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700', visible: isManager || showLocked, isLocked: !isManager, lockPermission: 'role_manager' },
                        { id: 'logout', name: 'Đăng Xuất', icon: 'fa-right-from-bracket', action: () => this.auth.logout(), color: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50', visible: true, isLocked: false }
                    ]
                }
            ];
            return list.map(group => ({
                ...group,
                items: group.items.filter(item => item.visible)
            })).filter(group => group.items.length > 0);
        });
        this.bottomTabs = computed(() => {
            const tabs = [];
            tabs.push({ id: 'dashboard', name: 'Trang Chủ', icon: 'fa-house', path: '/dashboard', activeColor: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30', visible: true });
            if (this.auth.canViewInventory()) {
                tabs.push({ id: 'inventory', name: 'Kho', icon: 'fa-boxes-stacked', path: '/inventory', activeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30', visible: true });
            }
            else {
                tabs.push({ id: 'documents', name: 'Giao nhận', icon: 'fa-file-signature', path: '/documents', activeColor: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30', visible: true });
            }
            if (this.auth.canRunBatch()) {
                tabs.push({ id: 'smart-batch', name: 'Lập mẻ', icon: 'fa-layer-group', path: '/smart-batch', activeColor: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30', visible: true });
            }
            else if (this.auth.canViewReports()) {
                tabs.push({ id: 'stats', name: 'Báo Cáo', icon: 'fa-chart-pie', path: '/stats', activeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30', visible: true });
            }
            else if (this.auth.canViewStandards()) {
                tabs.push({ id: 'standards', name: 'Chuẩn', icon: 'fa-vial-circle-check', path: '/standards', activeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30', visible: true });
            }
            else {
                tabs.push({ id: 'documents', name: 'Giao nhận', icon: 'fa-file-signature', path: '/documents', activeColor: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30', visible: true });
            }
            return tabs.slice(0, 3);
        });
    }
    ngOnInit() {
        this.currentUrl.set(this.router.url);
        this.routerSub = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(event => {
            this.currentUrl.set(event.urlAfterRedirects);
        });
        this.loadRecentlyVisited();
    }
    ngOnDestroy() {
        if (this.routerSub)
            this.routerSub.unsubscribe();
    }
    haptic(duration = 10) {
        if ('vibrate' in navigator) {
            try {
                navigator.vibrate(duration);
            }
            catch (e) { }
        }
    }
    handleLockedItemClick(item) {
        this.haptic();
        const permName = item.lockPermission ? (this.auth.getPermissionName(item.lockPermission) || item.lockPermission) : 'đặc biệt';
        this.toast.show(`Cần quyền "${permName}" · Liên hệ quản trị viên để được cấp`, 'warning');
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
        }
        else {
            this.showInstallGuide.set(false);
            this.showMenu.set(true);
            this.isClosing.set(false);
        }
    }
    closeMenu() {
        if (!this.showMenu())
            return;
        this.isClosing.set(true);
        setTimeout(() => {
            this.showMenu.set(false);
            this.isClosing.set(false);
            this.dragTransform.set(0);
        }, 250); // match animation duration
    }
    startScan() {
        this.haptic();
        this.closeMenu();
        this.qrService.startScan();
    }
    toggleInstallGuide() {
        this.haptic();
        this.showInstallGuide.update(v => !v);
        if (this.showInstallGuide())
            this.closeMenu();
    }
    navTo(path, name, icon) {
        this.haptic();
        this.closeMenu();
        this.showInstallGuide.set(false);
        this.router.navigate([path]);
        if (name && icon && path !== '/dashboard') {
            this.saveToRecentlyVisited({ name, path, icon });
        }
    }
    isActive(path) {
        return this.currentUrl().includes(path);
    }
    // --- RECENTLY VISITED LOGIC ---
    saveToRecentlyVisited(page) {
        let recent = [...this.recentlyVisited()];
        // Remove if exists
        recent = recent.filter(p => p.path !== page.path);
        // Add to front
        recent.unshift(page);
        // Keep max 3
        if (recent.length > 3)
            recent.pop();
        this.recentlyVisited.set(recent);
        try {
            localStorage.setItem('lims_recently_visited', JSON.stringify(recent));
        }
        catch (e) { }
    }
    loadRecentlyVisited() {
        try {
            const stored = localStorage.getItem('lims_recently_visited');
            if (stored) {
                this.recentlyVisited.set(JSON.parse(stored));
            }
        }
        catch (e) { }
    }
    // --- SWIPE TO DISMISS LOGIC ---
    onTouchStartPanel(e) {
        if (this.isClosing())
            return;
        this.touchStartY = e.touches[0].clientY;
    }
    onTouchMovePanel(e) {
        if (this.touchStartY === 0 || this.isClosing())
            return;
        this.currentY = e.touches[0].clientY;
        const deltaY = this.currentY - this.touchStartY;
        // Only drag down
        if (deltaY > 0) {
            // Add slight resistance
            this.dragTransform.set(deltaY * 0.8);
            // Prevent default scrolling if dragging sheet down
            if (deltaY > 10)
                e.preventDefault();
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
            // Snap back
            this.dragTransform.set(0);
        }
        this.touchStartY = 0;
        this.currentY = 0;
    }
    static { this.ɵfac = function BottomNavComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BottomNavComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BottomNavComponent, selectors: [["app-bottom-nav"]], decls: 19, vars: 12, consts: [[1, "fixed", "inset-0", "z-[60]", "bg-slate-900/90", "backdrop-blur-sm", "fade-in", "flex", "flex-col", "items-center", "justify-end", "pb-10"], [1, "fixed", "bottom-0", "left-0", "w-full", "bg-white/95", "dark:bg-slate-900/95", "backdrop-blur-xl", "border-t", "border-slate-200/80", "dark:border-slate-800", "shadow-[0_-8px_30px_-6px_rgba(0,0,0,0.1)]", "dark:shadow-none", "z-[40]", "md:hidden", "pb-safe"], [1, "absolute", "-top-3", "left-1/2", "-translate-x-1/2", "pointer-events-none", "fade-in"], [1, "bg-slate-800", "dark:bg-slate-700", "text-white", "text-[9px]", "font-bold", "px-3", "py-0.5", "rounded-full", "shadow-md", "uppercase", "tracking-wider", "border", "border-slate-600"], [1, "flex", "items-center", "justify-around", "h-[72px]", "px-1", "relative", "pt-1"], [1, "flex", "flex-col", "items-center", "justify-center", "min-w-[56px]", "py-2", "gap-1", "group", "active:scale-90", "transition-transform", "relative"], [1, "flex", "flex-col", "items-center", "justify-center", "min-w-[60px]", "group", "pb-0.5"], [3, "bottomNavMode"], [1, "flex", "flex-col", "items-center", "justify-center", "min-w-[56px]", "py-2", "gap-1", "group", "active:scale-90", "transition-transform", "relative", 3, "click"], [1, "w-10", "h-10", "rounded-2xl", "flex", "items-center", "justify-center", "transition-all", "duration-300"], [1, "fa-solid", "text-[1.1rem]", "transition-transform", "duration-300"], [1, "absolute", "top-1", "right-1", "w-2.5", "h-2.5", "bg-red-500", "rounded-full", "border-2", "border-white", "dark:border-slate-900", "animate-pulse"], [1, "text-[9px]", "font-bold", "transition-colors"], [1, "fixed", "inset-0", "z-[60]", "bg-slate-900/90", "backdrop-blur-sm", "fade-in", "flex", "flex-col", "items-center", "justify-end", "pb-10", 3, "click"], [1, "w-full", "max-w-sm", "px-6", "text-center", "animate-slide-up", 3, "click"], [1, "mb-6", "flex", "justify-center"], [1, "w-24", "h-24", "rounded-[2rem]", "overflow-hidden", "shadow-xl", "flex", "items-center", "justify-center"], ["size", "96px"], [1, "text-white", "font-bold", "text-xl", "mb-2"], [1, "text-slate-300", "text-sm", "mb-8"], [1, "bg-white/10", "rounded-xl", "p-4", "text-left", "space-y-4", "mb-8", "border", "border-white/10"], [1, "flex", "items-center", "gap-4"], [1, "w-8", "h-8", "rounded-lg", "bg-white/10", "flex", "items-center", "justify-center", "text-white", "shrink-0"], [1, "text-slate-200", "text-sm"], [1, "font-bold", "text-white"], [1, "fa-solid", "fa-arrow-up-from-bracket"], [1, "h-px", "bg-white/10"], [1, "fa-regular", "fa-square-plus"], [1, "flex", "flex-col", "gap-3"], [1, "w-full", "py-3.5", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-xl", "font-bold", "text-sm", "transition", "active:scale-95", 3, "click"], [1, "absolute", "bottom-2", "left-1/2", "-translate-x-1/2", "text-white/50", "animate-bounce"], [1, "fa-solid", "fa-arrow-down", "text-2xl"], [1, "fixed", "inset-0", "z-[45]", "bg-black/60", "backdrop-blur-sm", "transition-opacity", "duration-250", "ease-out", 3, "click"], [1, "fixed", "bottom-0", "right-0", "left-0", "z-[50]", "bg-white", "dark:bg-slate-900", "rounded-t-[32px]", "shadow-[0_-10px_40px_rgba(0,0,0,0.2)]", "border-t", "border-slate-200", "dark:border-slate-800", "overflow-hidden", "origin-bottom", "transition-transform", "duration-250", "ease-out", 3, "touchstart", "touchmove", "touchend"], [1, "w-full", "flex", "justify-center", "pt-3", "pb-1", 3, "click"], [1, "w-12", "h-1.5", "bg-slate-300", "dark:bg-slate-700", "rounded-full"], [1, "px-5", "pb-3", "pt-1", "flex", "items-center", "gap-3", "active:scale-[0.98]", "transition-transform", 3, "click"], [1, "w-11", "h-11", "rounded-full", "border-2", "border-white", "dark:border-slate-700", "shadow-sm", "bg-white", "dark:bg-slate-800", "object-cover", 3, "src"], [1, "flex-1", "min-w-0"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-sm", "truncate"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "font-medium", "truncate"], [1, "flex", "flex-col", "items-end"], [1, "text-[9px]", "font-black", "uppercase", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "px-2", "py-1", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700"], [1, "fa-solid", "fa-chevron-right", "text-slate-300", "dark:text-slate-600", "text-xs", "ml-1"], [1, "px-5", "pb-4", "border-b", "border-slate-100", "dark:border-slate-800/80"], [1, "flex", "items-center", "gap-2", "mb-3", "overflow-x-auto", "no-scrollbar", "pb-1"], [1, "flex", "gap-3"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-3", "rounded-2xl", "bg-slate-800", "dark:bg-slate-700", "text-white", "font-bold", "text-sm", "shadow-md", "active:scale-95", "transition-transform", 3, "click"], [1, "fa-solid", "fa-qrcode", "text-lg"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-3", "rounded-2xl", "bg-fuchsia-100", "dark:bg-fuchsia-900/30", "text-fuchsia-700", "dark:text-fuchsia-300", "font-bold", "text-sm", "shadow-sm", "active:scale-95", "transition-transform", "border", "border-fuchsia-200", "dark:border-fuchsia-800/50"], [1, "px-5", "py-4", "max-h-[50vh]", "overflow-y-auto", "custom-scrollbar", "pb-10"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "shrink-0", "mr-1"], [1, "fa-solid", "fa-clock-rotate-left", "mr-1"], [1, "shrink-0", "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "px-2.5", "py-1.5", "rounded-lg", "text-[11px]", "font-semibold", "text-slate-600", "dark:text-slate-300", "active:scale-95", "transition-transform"], [1, "shrink-0", "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "px-2.5", "py-1.5", "rounded-lg", "text-[11px]", "font-semibold", "text-slate-600", "dark:text-slate-300", "active:scale-95", "transition-transform", 3, "click"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-3", "rounded-2xl", "bg-fuchsia-100", "dark:bg-fuchsia-900/30", "text-fuchsia-700", "dark:text-fuchsia-300", "font-bold", "text-sm", "shadow-sm", "active:scale-95", "transition-transform", "border", "border-fuchsia-200", "dark:border-fuchsia-800/50", 3, "click"], [1, "fa-solid", "fa-square-poll-vertical", "text-lg"], [1, "space-y-6"], [1, "flex", "items-center", "gap-2", "mb-3", "px-1"], [1, "w-1.5", "h-1.5", "rounded-full", 3, "ngClass"], [1, "text-[10px]", "font-extrabold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "grid", "grid-cols-4", "gap-x-2", "gap-y-4"], [1, "flex", "flex-col", "items-center", "gap-1.5", "group", "active:scale-90", "transition-transform", "relative", 3, "opacity-50", "grayscale", "cursor-not-allowed"], [1, "flex", "flex-col", "items-center", "gap-1.5", "group", "active:scale-90", "transition-transform", "relative", 3, "click"], [1, "w-14", "h-14", "rounded-[1.25rem]", "flex", "items-center", "justify-center", "text-xl", "transition-all", "border", "relative", 3, "ngClass"], [3, "class"], [1, "absolute", "-top-1", "-right-1", "w-4", "h-4", "bg-white", "dark:bg-slate-800", "rounded-full", "flex", "items-center", "justify-center", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm"], [1, "text-[10px]", "font-bold", "text-center", "leading-tight", "px-0.5", 3, "ngClass"], [1, "fa-solid", "fa-lock", "text-[8px]", "text-amber-500"], [1, "h-40", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-slate-300", "text-2xl"], [1, "w-10", "h-10", "rounded-2xl", "flex", "items-center", "justify-center", "transition-all", "duration-300", "relative", "overflow-hidden"], [1, "text-[9px]", "font-bold", "transition-colors", 3, "ngClass"], [1, "absolute", "bottom-0.5", "w-4", "h-1", "rounded-full", "animate-fade-in", 3, "ngClass"]], template: function BottomNavComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, BottomNavComponent_Conditional_0_Template, 34, 0, "div", 0)(1, BottomNavComponent_Conditional_1_Template, 27, 16);
            i0.ɵɵelementStart(2, "div", 1)(3, "div", 2)(4, "div", 3);
            i0.ɵɵtext(5);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 4);
            i0.ɵɵrepeaterCreate(7, BottomNavComponent_For_8_Template, 6, 10, "button", 5, _forTrack0);
            i0.ɵɵelementStart(9, "div", 6);
            i0.ɵɵelement(10, "app-notification-bell", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(11, BottomNavComponent_For_12_Template, 6, 10, "button", 5, _forTrack0);
            i0.ɵɵelementStart(13, "button", 8);
            i0.ɵɵlistener("click", function BottomNavComponent_Template_button_click_13_listener() { return ctx.toggleMenu(); });
            i0.ɵɵelementStart(14, "div", 9);
            i0.ɵɵelement(15, "i", 10);
            i0.ɵɵtemplate(16, BottomNavComponent_Conditional_16_Template, 1, 0, "span", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "span", 12);
            i0.ɵɵtext(18);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.showInstallGuide() ? 0 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showMenu() || ctx.isClosing() ? 1 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate1(" ", ctx.pageTitle(), " ");
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.bottomTabs().slice(0, 2));
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("bottomNavMode", true);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.bottomTabs().slice(2, 3));
            i0.ɵɵadvance(3);
            i0.ɵɵclassMap(ctx.showMenu() ? "bg-slate-800 dark:bg-slate-700 text-white shadow-md scale-105" : "text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800");
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.showMenu() ? "fa-xmark rotate-90" : "fa-bars");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.requestsCount() > 0 && !ctx.showMenu() ? 16 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.showMenu() ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.showMenu() ? "\u0110\u00F3ng" : "Menu");
        } }, dependencies: [CommonModule, i1.NgClass, RouterModule, NotificationBellComponent, LogoComponent], styles: [".pb-safe[_ngcontent-%COMP%] { padding-bottom: env(safe-area-inset-bottom, 0px); }\n    @keyframes _ngcontent-%COMP%_slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }\n    .animate-slide-up[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n\n    .no-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar { display: none; }\n    .no-scrollbar[_ngcontent-%COMP%] { -ms-overflow-style: none; scrollbar-width: none; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BottomNavComponent, [{
        type: Component,
        args: [{ selector: 'app-bottom-nav', standalone: true, imports: [CommonModule, RouterModule, NotificationBellComponent, LogoComponent], template: `
    <!-- INSTALL GUIDE OVERLAY (iOS Style) -->
    @if (showInstallGuide()) {
        <div class="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-sm fade-in flex flex-col items-center justify-end pb-10" (click)="toggleInstallGuide()">
            <div class="w-full max-w-sm px-6 text-center animate-slide-up" (click)="$event.stopPropagation()">
                <div class="mb-6 flex justify-center">
                    <div class="w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl flex items-center justify-center">
                        <app-logo size="96px"></app-logo>
                    </div>
                </div>
                <h3 class="text-white font-bold text-xl mb-2">Cài Đặt LIMS Pro</h3>
                <p class="text-slate-300 text-sm mb-8">Thêm ứng dụng vào màn hình chính để sử dụng toàn màn hình và mượt mà hơn.</p>

                <div class="bg-white/10 rounded-xl p-4 text-left space-y-4 mb-8 border border-white/10">
                    <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">1</div>
                        <div class="text-slate-200 text-sm">
                            Nhấn vào nút <span class="font-bold text-white"><i class="fa-solid fa-arrow-up-from-bracket"></i> Chia sẻ</span> trên thanh công cụ Safari.
                        </div>
                    </div>
                    <div class="h-px bg-white/10"></div>
                    <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">2</div>
                        <div class="text-slate-200 text-sm">
                            Chọn dòng <span class="font-bold text-white"><i class="fa-regular fa-square-plus"></i> Thêm vào MH chính</span>.
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <button (click)="toggleInstallGuide()" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition active:scale-95">Đã Hiểu</button>
                </div>

                <!-- Bounce Arrow pointing down -->
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
                    <i class="fa-solid fa-arrow-down text-2xl"></i>
                </div>
            </div>
        </div>
    }

    <!-- MENU OVERLAY (Bottom Sheet) -->
    @if (showMenu() || isClosing()) {
        <!-- Backdrop -->
        <div class="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm transition-opacity duration-250 ease-out"
             [class.opacity-0]="isClosing()"
             [class.opacity-100]="!isClosing()"
             (click)="closeMenu()"></div>

        <!-- Bottom Sheet Panel -->
        <div class="fixed bottom-0 right-0 left-0 z-[50] bg-white dark:bg-slate-900 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-slate-200 dark:border-slate-800 overflow-hidden origin-bottom transition-transform duration-250 ease-out"
             [class.animate-slide-up]="!isClosing()"
             [class.translate-y-full]="isClosing()"
             [style.transform]="dragTransform() > 0 && !isClosing() ? 'translateY(' + dragTransform() + 'px)' : ''"
             (touchstart)="onTouchStartPanel($event)"
             (touchmove)="onTouchMovePanel($event)"
             (touchend)="onTouchEndPanel()">

            <!-- Drag indicator -->
            <div class="w-full flex justify-center pt-3 pb-1" (click)="closeMenu()">
                <div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            </div>

            <!-- User Profile Header -->
            <div class="px-5 pb-3 pt-1 flex items-center gap-3 active:scale-[0.98] transition-transform" (click)="navTo('/config')">
                <img [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
                     class="w-11 h-11 rounded-full border-2 border-white dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 object-cover">
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{{auth.currentUser()?.displayName}}</div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{{auth.currentUser()?.email}}</div>
                </div>
                <div class="flex flex-col items-end">
                    <span class="text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{{auth.currentUser()?.role}}</span>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-300 dark:text-slate-600 text-xs ml-1"></i>
            </div>

            <!-- Quick Actions & Recently Visited (Sticky under header) -->
            <div class="px-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <!-- Recently Visited -->
                @if (recentlyVisited().length > 0) {
                    <div class="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                       <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 mr-1"><i class="fa-solid fa-clock-rotate-left mr-1"></i> Gần đây:</span>
                       @for (page of recentlyVisited(); track page.path) {
                           <button (click)="navTo(page.path, page.name, page.icon)" class="shrink-0 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 active:scale-95 transition-transform">
                               <i class="fa-solid {{page.icon}} text-[10px]"></i> {{page.name}}
                           </button>
                       }
                    </div>
                }

                <div class="flex gap-3">
                    <button (click)="startScan()" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-sm shadow-md active:scale-95 transition-transform">
                        <i class="fa-solid fa-qrcode text-lg"></i> Quét Mã
                    </button>
                    @if(auth.canViewSop()) {
                        <button (click)="navTo('/results', 'Nhập kết quả', 'fa-square-poll-vertical')" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 font-bold text-sm shadow-sm active:scale-95 transition-transform border border-fuchsia-200 dark:border-fuchsia-800/50">
                            <i class="fa-solid fa-square-poll-vertical text-lg"></i> Nhập Kết Quả
                        </button>
                    }
                </div>
            </div>

            <!-- Content (Scrollable) -->
            <div class="px-5 py-4 max-h-[50vh] overflow-y-auto custom-scrollbar pb-10">
                @defer {
                    <div class="space-y-6">
                        @for (group of menuGroups(); track group.id) {
                            <div>
                                <div class="flex items-center gap-2 mb-3 px-1">
                                    <div class="w-1.5 h-1.5 rounded-full" [ngClass]="group.accentClass.split(' ')[0].replace('from-', 'bg-').replace('/15', '')"></div>
                                    <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ group.title }}</span>
                                </div>
                                <div class="grid grid-cols-4 gap-x-2 gap-y-4">
                                    @for (item of group.items; track item.name) {
                                        @if (!item.isSpecial) {
                                            <button (click)="item.isLocked ? handleLockedItemClick(item) : (item.action ? item.action() : (item.path ? navTo(item.path, item.name, item.icon) : null))"
                                                    [class.opacity-50]="item.isLocked"
                                                    [class.grayscale]="item.isLocked"
                                                    [class.cursor-not-allowed]="item.isLocked"
                                                    class="flex flex-col items-center gap-1.5 group active:scale-90 transition-transform relative">
                                                <div class="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-xl transition-all border relative"
                                                     [ngClass]="item.isLocked
                                                       ? 'bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200/50 dark:border-slate-700/50'
                                                       : (item.isActive ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md scale-105 border-transparent' : (item.customClass || group.accentClass) + ' bg-gradient-to-tr shadow-sm')">

                                                    @if (item.isActive && state.darkMode()) {
                                                      <i class="fa-solid {{item.icon}}"></i>
                                                    } @else if (item.isActive && !state.darkMode()) {
                                                      <i class="fa-solid {{item.icon}} !text-white z-10 relative"></i>
                                                    } @else {
                                                      <i class="fa-solid {{item.icon}}"></i>
                                                    }

                                                    @if(item.isLocked) {
                                                        <span class="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                                                            <i class="fa-solid fa-lock text-[8px] text-amber-500"></i>
                                                        </span>
                                                    }
                                                </div>
                                                <span class="text-[10px] font-bold text-center leading-tight px-0.5"
                                                      [ngClass]="item.isLocked ? 'text-slate-400 dark:text-slate-500' : (item.isActive ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400')">
                                                    {{item.name}}
                                                </span>
                                            </button>
                                        }
                                    }
                                </div>
                            </div>
                        }
                    </div>
                } @placeholder {
                    <div class="h-40 flex items-center justify-center">
                        <i class="fa-solid fa-spinner fa-spin text-slate-300 text-2xl"></i>
                    </div>
                }
            </div>
        </div>
    }

    <!-- MAIN BOTTOM BAR -->
    <div class="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-8px_30px_-6px_rgba(0,0,0,0.1)] dark:shadow-none z-[40] md:hidden pb-safe">

      <!-- Page Breadcrumb Label -->
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none fade-in">
          <div class="bg-slate-800 dark:bg-slate-700 text-white text-[9px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider border border-slate-600">
              {{ pageTitle() }}
          </div>
      </div>

      <div class="flex items-center justify-around h-[72px] px-1 relative pt-1">

        <!-- Tabs 0 and 1 -->
        @for (tab of bottomTabs().slice(0, 2); track tab.id) {
            <button (click)="navTo(tab.path, tab.name, tab.icon)" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
                   [class]="isActive(tab.path) ? tab.activeColor + ' shadow-inner scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
                <i class="fa-solid {{tab.icon}} text-[1.1rem] transition-transform duration-300" [class.-translate-y-0.5]="isActive(tab.path)"></i>
              </div>
              <span class="text-[9px] font-bold transition-colors"
                    [ngClass]="isActive(tab.path) ? tab.activeColor.split(' ')[0] : 'text-slate-400 dark:text-slate-500'">{{ tab.name }}</span>

              <!-- Active Dot -->
              @if (isActive(tab.path)) {
                 <div class="absolute bottom-0.5 w-4 h-1 rounded-full animate-fade-in" [ngClass]="tab.activeColor.split(' ')[0].replace('text-', 'bg-')"></div>
              }
            </button>
        }

        <!-- Notification Bell (Center/Fixed) -->
        <div class="flex flex-col items-center justify-center min-w-[60px] group pb-0.5">
            <app-notification-bell [bottomNavMode]="true"></app-notification-bell>
        </div>

        <!-- Tab 2 -->
        @for (tab of bottomTabs().slice(2, 3); track tab.id) {
            <button (click)="navTo(tab.path, tab.name, tab.icon)" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
                   [class]="isActive(tab.path) ? tab.activeColor + ' shadow-inner scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
                <i class="fa-solid {{tab.icon}} text-[1.1rem] transition-transform duration-300" [class.-translate-y-0.5]="isActive(tab.path)"></i>
              </div>
              <span class="text-[9px] font-bold transition-colors"
                    [ngClass]="isActive(tab.path) ? tab.activeColor.split(' ')[0] : 'text-slate-400 dark:text-slate-500'">{{ tab.name }}</span>

              <!-- Active Dot -->
              @if (isActive(tab.path)) {
                 <div class="absolute bottom-0.5 w-4 h-1 rounded-full animate-fade-in" [ngClass]="tab.activeColor.split(' ')[0].replace('text-', 'bg-')"></div>
              }
            </button>
        }

        <!-- MORE MENU (Always) -->
        <button (click)="toggleMenu()" class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform relative">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
               [class]="showMenu() ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-md scale-105' : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
            <i class="fa-solid text-[1.1rem] transition-transform duration-300" [class]="showMenu() ? 'fa-xmark rotate-90' : 'fa-bars'"></i>

            <!-- Badge -->
            @if (requestsCount() > 0 && !showMenu()) {
               <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            }
          </div>
          <span class="text-[9px] font-bold transition-colors"
                [class]="showMenu() ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'">{{ showMenu() ? 'Đóng' : 'Menu' }}</span>
        </button>

      </div>
    </div>
  `, styles: ["\n    .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }\n    @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }\n    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n\n    .no-scrollbar::-webkit-scrollbar { display: none; }\n    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BottomNavComponent, { className: "BottomNavComponent", filePath: "src/app/core/layout/bottom-nav.component.ts", lineNumber: 293 }); })();
//# sourceMappingURL=bottom-nav.component.js.map