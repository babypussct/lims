import { ChangeDetectionStrategy, Component, inject, computed, signal, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { StatsService } from '../../core/services/stats.service';
import { InventoryService } from '../inventory/inventory.service';
import { StandardService } from '../standards/standard.service';
import { QrGlobalService } from '../../core/services/qr-global.service'; // Import Global Service
import { formatNum, getAvatarUrl } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import { filterDashboardActivityLogs, isSopActivityAction, isStandardActivityAction } from '../../shared/utils/dashboard-activity';
import { timestampToDate, timestampToLocalDateKey } from '../../shared/utils/timestamp';
import { createInclusiveDateRange, enumerateInclusiveDates, getDateBoundsFromMonthlyStats, toLocalDateKey } from '../../shared/utils/date-range';
import { ChangelogService } from '../../core/services/changelog.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = ["activityChart"];
const _c1 = ["doughnutChart"];
const DashboardComponent_Conditional_143_Defer_2_DepsFn = () => [import("../checklist/daily-checklist.component").then(m => m.DailyChecklistComponent)];
const _c2 = () => ["ALL", "SOP", "STOCK", "STANDARD", "APPROVE", "SYSTEM"];
const _c3 = (a0, a1) => ({ "text-red-500 dark:text-red-400": a0, "text-orange-500 dark:text-orange-400": a1 });
const _c4 = a0 => ({ "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400": a0 });
const _forTrack0 = ($index, $item) => $item.dateStr;
const _forTrack1 = ($index, $item) => $item.name;
const _forTrack2 = ($index, $item) => $item.id;
function DashboardComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵelement(1, "i", 88);
    i0.ɵɵelementStart(2, "span", 89);
    i0.ɵɵtext(3, "Kh\u00F4ng c\u00F3 quy\u1EC1n");
    i0.ɵɵelementEnd()();
} }
function DashboardComponent_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-skeleton", 22);
} }
function DashboardComponent_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.auth.canViewSop() || ctx_r0.auth.canViewStandards() ? ctx_r0.totalPendingRequests() : "--", " ");
} }
function DashboardComponent_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 27)(1, "p", 90);
    i0.ɵɵtext(2, "Ch\u1ECDn lo\u1EA1i y\u00EAu c\u1EA7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 91);
    i0.ɵɵlistener("click", function DashboardComponent_Conditional_37_Template_button_click_3_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); $event.stopPropagation(); ctx_r0.navTo("requests"); return i0.ɵɵresetView(ctx_r0.showPendingRequestsPopover.set(false)); });
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5, "SOP");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 92);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 93);
    i0.ɵɵlistener("click", function DashboardComponent_Conditional_37_Template_button_click_8_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); $event.stopPropagation(); ctx_r0.navTo("standard-requests"); return i0.ɵɵresetView(ctx_r0.showPendingRequestsPopover.set(false)); });
    i0.ɵɵelementStart(9, "span");
    i0.ɵɵtext(10, "Chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span", 94);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r0.pendingCounts().sop);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.pendingCounts().std);
} }
function DashboardComponent_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵelement(1, "i", 88);
    i0.ɵɵelementStart(2, "span", 89);
    i0.ɵɵtext(3, "Kh\u00F4ng c\u00F3 quy\u1EC1n");
    i0.ɵɵelementEnd()();
} }
function DashboardComponent_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-skeleton", 22);
} }
function DashboardComponent_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.auth.canViewInventory() ? ctx_r0.lowStockItems().length : "--", " ");
} }
function DashboardComponent_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 31);
    i0.ɵɵtext(1, "M\u1EE5c d\u01B0\u1EDBi \u0111\u1ECBnh m\u1EE9c");
    i0.ɵɵelementEnd();
} }
function DashboardComponent_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 32);
    i0.ɵɵtext(1, "Kho \u1ED5n \u0111\u1ECBnh");
    i0.ɵɵelementEnd();
} }
function DashboardComponent_Conditional_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵelement(1, "i", 88);
    i0.ɵɵelementStart(2, "span", 89);
    i0.ɵɵtext(3, "Kh\u00F4ng c\u00F3 quy\u1EC1n");
    i0.ɵɵelementEnd()();
} }
function DashboardComponent_Conditional_59_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-skeleton", 22);
} }
function DashboardComponent_Conditional_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.auth.canViewReports() ? ctx_r0.todayActivityCount() : "--", " ");
} }
function DashboardComponent_Conditional_67_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵelement(1, "i", 88);
    i0.ɵɵelementStart(2, "span", 89);
    i0.ɵɵtext(3, "Kh\u00F4ng c\u00F3 quy\u1EC1n");
    i0.ɵɵelementEnd()();
} }
function DashboardComponent_Conditional_72_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h4", 39);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r3 = ctx;
    i0.ɵɵproperty("title", std_r3.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r3.name);
} }
function DashboardComponent_Conditional_73_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h4", 40);
    i0.ɵɵtext(1, "An To\u00E0n");
    i0.ɵɵelementEnd();
} }
function DashboardComponent_Conditional_77_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 43);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r4 = ctx;
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(2, _c3, std_r4.status === "expired" || std_r4.status === "error", std_r4.status === "warning"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", std_r4.status === "error" ? "L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u" : std_r4.daysLeft < 0 ? "\u0110\u00E3 h\u1EBFt h\u1EA1n" : "C\u00F2n " + std_r4.daysLeft + " ng\u00E0y", " ");
} }
function DashboardComponent_Conditional_78_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 32);
    i0.ɵɵtext(1, "T\u1EA5t c\u1EA3 c\u00F2n h\u1EA1n d\u00F9ng");
    i0.ɵɵelementEnd();
} }
function DashboardComponent_Conditional_81_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 46);
    i0.ɵɵelement(1, "i", 95);
    i0.ɵɵelementStart(2, "span", 96);
    i0.ɵɵtext(3, "T\u00EDnh n\u0103ng y\u00EAu c\u1EA7u quy\u1EC1n truy c\u1EADp B\u00E1o c\u00E1o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 97);
    i0.ɵɵtext(5, "Vui l\u00F2ng li\u00EAn h\u1EC7 Qu\u1EA3n tr\u1ECB vi\u00EAn");
    i0.ɵɵelementEnd()();
} }
function DashboardComponent_Conditional_87_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 98);
    i0.ɵɵlistener("click", function DashboardComponent_Conditional_87_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.selectedSopFilter.set(null)); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "i", 99);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("L\u1ECDc: ", ctx, "");
} }
function DashboardComponent_Conditional_116_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 66);
    i0.ɵɵelement(1, "app-skeleton", 100);
    i0.ɵɵelementEnd();
} }
function DashboardComponent_Conditional_117_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "canvas", null, 0);
} }
function DashboardComponent_Conditional_121_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 69);
    i0.ɵɵelement(1, "app-skeleton", 101);
    i0.ɵɵelementEnd();
} }
function DashboardComponent_Conditional_122_For_7_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 107);
    i0.ɵɵlistener("click", function DashboardComponent_Conditional_122_For_7_Template_button_click_0_listener() { const item_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.toggleSopFilter(item_r7.name)); });
    i0.ɵɵelementStart(1, "div", 108);
    i0.ɵɵelement(2, "span", 109);
    i0.ɵɵelementStart(3, "span", 110);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "span", 111);
    i0.ɵɵtext(6);
    i0.ɵɵelementStart(7, "span", 112);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r7 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(7, _c4, ctx_r0.selectedSopFilter() === item_r7.name));
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("background-color", item_r7.color);
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", item_r7.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r7.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", item_r7.count, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("(", item_r7.percent, "%)");
} }
function DashboardComponent_Conditional_122_ForEmpty_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 106);
    i0.ɵɵtext(1, "Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u.");
    i0.ɵɵelementEnd();
} }
function DashboardComponent_Conditional_122_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 70)(1, "div", 102);
    i0.ɵɵelement(2, "canvas", null, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 103)(5, "div", 104);
    i0.ɵɵrepeaterCreate(6, DashboardComponent_Conditional_122_For_7_Template, 9, 9, "button", 105, _forTrack1, false, DashboardComponent_Conditional_122_ForEmpty_8_Template, 2, 0, "div", 106);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r0.sopDistribution());
} }
function DashboardComponent_For_134_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 113);
    i0.ɵɵlistener("click", function DashboardComponent_For_134_Template_button_click_0_listener() { const cat_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.logFilterCategory.set(cat_r9)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cat_r9 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngClass", ctx_r0.logFilterCategory() === cat_r9 ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", cat_r9 === "ALL" ? "T\u1EA5t c\u1EA3" : cat_r9 === "SOP" ? "K\u1EBFt qu\u1EA3" : cat_r9 === "STOCK" ? "Kho" : cat_r9 === "STANDARD" ? "Chu\u1EA9n" : cat_r9 === "APPROVE" ? "Duy\u1EC7t" : "H\u1EC7 th\u1ED1ng", " ");
} }
function DashboardComponent_For_138_For_6_Conditional_17_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 131);
    i0.ɵɵlistener("click", function DashboardComponent_For_138_For_6_Conditional_17_Conditional_4_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const log_r11 = i0.ɵɵnextContext(2).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.navTo("results/" + log_r11.requestId)); });
    i0.ɵɵelement(1, "i", 132);
    i0.ɵɵtext(2, " K\u1EBFt Qu\u1EA3 ");
    i0.ɵɵelementEnd();
} }
function DashboardComponent_For_138_For_6_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 127)(1, "button", 128);
    i0.ɵɵlistener("click", function DashboardComponent_For_138_For_6_Conditional_17_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r10); const log_r11 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.navTo("traceability/" + log_r11.requestId)); });
    i0.ɵɵelement(2, "i", 129);
    i0.ɵɵtext(3, " Truy Xu\u1EA5t ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, DashboardComponent_For_138_For_6_Conditional_17_Conditional_4_Template, 3, 0, "button", 130);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const log_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(log_r11.action && (log_r11.action.includes("RESULT") || log_r11.action === "PUBLISH_RESULT_REPORT" || log_r11.action === "DIRECT_APPROVE" || log_r11.action === "APPROVE_REQUEST") ? 4 : -1);
} }
function DashboardComponent_For_138_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "div", 117)(2, "div");
    i0.ɵɵelement(3, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 118)(5, "div", 119);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 120);
    i0.ɵɵelement(8, "img", 121);
    i0.ɵɵelementStart(9, "div", 122)(10, "div", 123)(11, "span", 124);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span", 125);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 126);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(17, DashboardComponent_For_138_For_6_Conditional_17_Template, 5, 1, "div", 127);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const log_r11 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    const iconMeta_r13 = ctx_r0.getLogIcon(log_r11.action);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMapInterpolate1("absolute -left-[14px] top-1 w-7 h-7 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center ", iconMeta_r13.bg, " z-0");
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate2("fa-solid ", iconMeta_r13.icon, " text-[10px] ", iconMeta_r13.text, "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.getTimeDiff(log_r11.timestamp));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("src", ctx_r0.getAvatar(log_r11.user), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(log_r11.user);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.getLogActionText(log_r11.action));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", log_r11.details, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(log_r11.requestId ? 17 : -1);
} }
function DashboardComponent_For_138_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 83)(1, "div", 114)(2, "span", 115);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div", 116);
    i0.ɵɵrepeaterCreate(5, DashboardComponent_For_138_For_6_Template, 18, 13, "div", 117, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r14 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(group_r14.dateStr);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(group_r14.logs);
} }
function DashboardComponent_ForEmpty_139_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 84);
    i0.ɵɵelement(1, "i", 133);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u.");
    i0.ɵɵelementEnd()();
} }
function DashboardComponent_Conditional_141_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 86);
    i0.ɵɵelement(1, "i", 95);
    i0.ɵɵelementStart(2, "span", 96);
    i0.ɵɵtext(3, "T\u00EDnh n\u0103ng y\u00EAu c\u1EA7u quy\u1EC1n truy c\u1EADp V\u1EADn h\u00E0nh SOP");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 97);
    i0.ɵɵtext(5, "Vui l\u00F2ng li\u00EAn h\u1EC7 Qu\u1EA3n tr\u1ECB vi\u00EAn");
    i0.ɵɵelementEnd()();
} }
function DashboardComponent_Conditional_143_Defer_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-daily-checklist", 134);
} if (rf & 2) {
    i0.ɵɵproperty("embedded", true);
} }
function DashboardComponent_Conditional_143_DeferPlaceholder_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 135)(1, "div", 136);
    i0.ɵɵelement(2, "i", 137);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "B\u1EA3ng theo d\u00F5i m\u1EABu s\u1EBD t\u1EA3i khi cu\u1ED9n \u0111\u1EBFn \u0111\u00E2y");
    i0.ɵɵelementEnd()()();
} }
function DashboardComponent_Conditional_143_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, DashboardComponent_Conditional_143_Defer_0_Template, 1, 1)(1, DashboardComponent_Conditional_143_DeferPlaceholder_1_Template, 5, 0);
    i0.ɵɵdefer(2, 0, DashboardComponent_Conditional_143_Defer_2_DepsFn, null, 1);
    i0.ɵɵdeferOnViewport(0, -1);
} }
function DashboardComponent_Conditional_144_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 87);
} }
export class DashboardComponent {
    // Helper function to extract stats for a specific day
    getDayStats(d) {
        const y = d.getFullYear();
        const mStr = String(d.getMonth() + 1).padStart(2, '0');
        const dStr = String(d.getDate()).padStart(2, '0');
        const monthKey = `${y}-${mStr}`;
        const dayKey = `${y}-${mStr}-${dStr}`;
        const stats = this.statsData()[monthKey];
        if (stats && stats[dayKey])
            return stats[dayKey];
        return { totalSamples: 0, totalBatches: 0, totalQcs: 0, sops: {} };
    }
    // Date Filters — init inline to avoid calling methods before they are available
    static _getLocalStr(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    static _initWeekStart() {
        const today = new Date();
        const day = today.getDay();
        const mon = new Date(today);
        mon.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
        return DashboardComponent._getLocalStr(mon);
    }
    formatDateStr(d) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
            return 'Hôm nay';
        }
        else if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear()) {
            return 'Hôm qua';
        }
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    getLogIcon(action) {
        if (action.includes('APPROVE') && !action.includes('STANDARD') && !action.includes('RESULT')) {
            return { icon: 'fa-check-double', bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-600 dark:text-fuchsia-400' };
        }
        if (action.includes('STOCK')) {
            return { icon: 'fa-box-open', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' };
        }
        if (this.isStandardLogAction(action)) {
            return { icon: 'fa-flask', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' };
        }
        if (action === 'PUBLISH_RESULT_REPORT') {
            return { icon: 'fa-file-signature', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' };
        }
        if (action.includes('RESULT')) {
            return { icon: 'fa-vial', bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' };
        }
        return { icon: 'fa-bolt', bg: 'bg-gray-100 dark:bg-slate-700', text: 'text-gray-600 dark:text-gray-300' };
    }
    isStandardLogAction(action) {
        return isStandardActivityAction(action);
    }
    isSopLogAction(action) {
        return isSopActivityAction(action);
    }
    canViewActivityLog(log) {
        if (this.auth.canViewReports())
            return true;
        const currentName = this.auth.currentUser()?.displayName;
        if (currentName && log.user === currentName)
            return true;
        const act = log.action || '';
        if (act.includes('STOCK'))
            return this.auth.canViewInventory();
        if (this.isStandardLogAction(act))
            return this.auth.canViewStandards();
        if (this.isSopLogAction(act))
            return this.auth.canViewSop() || this.auth.canRunBatch();
        if (act.includes('MAINTENANCE') || act.includes('SYSTEM'))
            return this.auth.canManageSystem() || this.auth.canViewReports();
        return false;
    }
    getLocalYYYYMMDD(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    getStatsDateBounds() {
        return getDateBoundsFromMonthlyStats(this.statsData());
    }
    getActiveDateRange() {
        const explicitRange = createInclusiveDateRange(this.startDate(), this.endDate());
        if (explicitRange)
            return explicitRange;
        const allTimeBounds = this.getStatsDateBounds();
        if (allTimeBounds) {
            const allTimeRange = createInclusiveDateRange(allTimeBounds.start, allTimeBounds.end);
            if (allTimeRange)
                return allTimeRange;
        }
        const todayKey = toLocalDateKey(new Date());
        return createInclusiveDateRange(todayKey, todayKey);
    }
    scheduleTodayRollover() {
        if (this._todayRolloverTimer)
            clearTimeout(this._todayRolloverTimer);
        const now = new Date();
        const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 50);
        this._todayRolloverTimer = setTimeout(() => {
            this._todayStr.set(this.getLocalYYYYMMDD(new Date()));
            this.scheduleTodayRollover();
        }, Math.max(1000, nextDay.getTime() - now.getTime()));
    }
    constructor() {
        this.state = inject(StateService);
        this.invService = inject(InventoryService);
        this.stdService = inject(StandardService);
        this.auth = inject(AuthService);
        this.router = inject(Router);
        this.qrService = inject(QrGlobalService);
        this.changelogService = inject(ChangelogService);
        this.statsService = inject(StatsService);
        this.statsData = signal({});
        this.formatNum = formatNum;
        this.getAvatarUrl = getAvatarUrl;
        this.isLoading = signal(true);
        this.lowStockItems = computed(() => {
            return this.state.inventory().filter(i => i.stock <= (i.threshold || 5));
        });
        this.priorityStandard = signal(null);
        this.startDate = signal(DashboardComponent._initWeekStart());
        this.endDate = signal(DashboardComponent._getLocalStr(new Date()));
        // Custom SOP distribution list for charts legend
        this.sopDistribution = signal([]);
        // Active SOP Filter
        this.selectedSopFilter = signal(null);
        this.showPendingRequestsPopover = signal(false);
        // Computed for separate counts
        this.pendingCounts = computed(() => {
            const uid = this.auth.currentUser()?.uid;
            let sop = 0;
            let std = 0;
            if (this.auth.canApprove()) {
                sop = this.state.requests().length;
            }
            else if (uid) {
                sop = this.state.requests().filter(r => r.user === this.auth.currentUser()?.displayName).length;
            }
            if (this.auth.canApproveStandards()) {
                std = this.state.standardRequests().filter(r => r.status === 'PENDING_APPROVAL' || r.status === 'PENDING_RETURN').length;
            }
            else if (uid) {
                std = this.state.standardRequests().filter(r => r.status === 'PENDING_APPROVAL').length;
            }
            return { sop, std };
        });
        // LIVE DATA COMPUTED
        // Phân nhánh logic đếm theo từng quyền cụ thể:
        // - canApprove (SOP): đếm SOP requests đang pending
        // - canApproveStandards: đếm Standard requests cần action (PENDING_APPROVAL + PENDING_RETURN)
        // - User thường: chỉ đếm request CỦA CHÍNH MÌNH đang ở trạng thái PENDING_APPROVAL
        this.totalPendingRequests = computed(() => {
            const counts = this.pendingCounts();
            return counts.sop + counts.std;
        });
        // Activity Feed Filters
        this.logSearchTerm = signal('');
        this.logFilterCategory = signal('ALL');
        this.recentLogsGrouped = computed(() => {
            let logs = this.state.logs();
            const isManager = this.auth.currentUser()?.role === 'manager';
            if (!isManager) {
                logs = logs.filter(l => this.canViewActivityLog(l));
            }
            logs = filterDashboardActivityLogs(logs, this.logSearchTerm(), this.logFilterCategory(), action => this.getLogActionText(action), 50);
            // Group by Date
            const groups = new Map();
            logs.forEach(l => {
                const d = timestampToDate(l.timestamp);
                const dateStr = d ? this.formatDateStr(d) : 'Không rõ thời gian';
                if (!groups.has(dateStr))
                    groups.set(dateStr, []);
                groups.get(dateStr).push(l);
            });
            return Array.from(groups.entries()).map(([dateStr, logs]) => ({
                dateStr,
                logs
            }));
        });
        this._actionTextMap = {
            'CREATE_VIRTUAL_MASTER': 'đã tạo mẻ master ảo',
            'SAVE_RESULT_DRAFT': 'đã lưu nháp kết quả',
            'PUBLISH_RESULT_REPORT': 'đã xuất bản báo cáo',
            'REVERT_RESULT_DRAFT': 'đã hủy xuất bản báo cáo',
            'RESET_RESULT_DATA': 'đã reset số liệu kết quả',
            'RESTORE_RESULT_BACKUP': 'đã khôi phục số liệu lưu trữ',
            'RESTORE_RESULT_VERSION': 'đã khôi phục phiên bản cũ',
            'DIRECT_APPROVE': 'đã duyệt và đưa phiếu vào hàng đợi in',
            'EDIT_REQUEST': 'đã chỉnh sửa phiếu yêu cầu',
            'REQUEST_STANDARD': 'đã yêu cầu mượn chuẩn',
            'CREATE_STANDARD_REQUEST': 'đã yêu cầu mượn chuẩn',
            'APPROVE_STANDARD_REQUEST': 'đã duyệt mượn chuẩn',
            'REJECT_STANDARD_REQUEST': 'đã từ chối mượn chuẩn',
            'REPORT_RETURN_STANDARD': 'đã báo cáo trả chuẩn',
            'RETURN_STANDARD': 'đã nhận lại chuẩn',
            'ASSIGN_STANDARD': 'đã gán chuẩn cho mượn',
            'LOG_USAGE_STANDARD': 'đã khai báo sử dụng chuẩn',
            'BACKFILL_USAGE_LOG': 'đã nhập bù hồ sơ mượn chuẩn',
            'DELETE_USAGE_LOG': 'đã hoàn tác nhật ký sử dụng chuẩn',
            'REQUEST_COA': 'đã yêu cầu bổ sung CoA'
        };
        this._todayStr = signal(this.getLocalYYYYMMDD(new Date()));
        this._todayRolloverTimer = null;
        this.todayActivityCount = computed(() => {
            let logs = this.state.logs();
            if (!this.auth.canViewReports()) {
                logs = logs.filter(l => this.canViewActivityLog(l));
            }
            return logs.filter(l => {
                return timestampToLocalDateKey(l.timestamp) === this._todayStr();
            }).length;
        });
        // TREND INDICATOR (Dynamic Comparison based on Date Filter)
        this.trendInfo = computed(() => {
            const filter = this.selectedSopFilter();
            const currentRange = this.getActiveDateRange();
            const currentDates = enumerateInclusiveDates(currentRange);
            // Calculate current total
            let currentTotal = 0;
            for (const d of currentDates) {
                const dayStats = this.getDayStats(d);
                if (filter) {
                    const sopStats = dayStats.sops[filter];
                    if (sopStats)
                        currentTotal += sopStats.samples;
                }
                else {
                    currentTotal += dayStats.totalSamples;
                }
            }
            const currentAvg = currentTotal / currentRange.days;
            // Historical period (Period-over-Period)
            const historyDays = currentRange.days;
            const historyEnd = new Date(currentRange.start);
            historyEnd.setDate(historyEnd.getDate() - 1);
            historyEnd.setHours(23, 59, 59, 999);
            const historyStart = new Date(historyEnd);
            historyStart.setDate(historyStart.getDate() - historyDays + 1);
            historyStart.setHours(0, 0, 0, 0);
            // Daily totals for history
            const dailyTotals = new Array(historyDays).fill(0);
            for (let i = 0; i < historyDays; i++) {
                const d = new Date(historyStart);
                d.setDate(d.getDate() + i);
                const dayStats = this.getDayStats(d);
                if (filter) {
                    const sopStats = dayStats.sops[filter];
                    if (sopStats)
                        dailyTotals[i] = sopStats.samples;
                }
                else {
                    dailyTotals[i] = dayStats.totalSamples;
                }
            }
            // Calculate Mean and StdDev
            const historyMean = dailyTotals.reduce((a, b) => a + b, 0) / historyDays;
            const variance = dailyTotals.reduce((a, b) => a + Math.pow(b - historyMean, 2), 0) / historyDays;
            const historyStdDev = Math.sqrt(variance);
            // Z-Score calculation (Applying Central Limit Theorem adjustment if historyDays > 1)
            const standardError = historyDays > 1 ? historyStdDev / Math.sqrt(historyDays) : historyStdDev;
            let zScore = 0;
            if (standardError > 0) {
                zScore = (currentAvg - historyMean) / standardError;
            }
            else {
                zScore = currentAvg > historyMean ? 1.1 : (currentAvg < historyMean ? -1.1 : 0);
            }
            let status = 'normal';
            let icon = 'fa-minus';
            let colorClass = 'text-gray-500 dark:text-slate-400';
            let statusText = 'Bình thường';
            if (zScore > 1) {
                status = 'outstanding';
                icon = 'fa-arrow-trend-up';
                colorClass = 'text-emerald-500 dark:text-emerald-400';
                statusText = 'Vượt trội';
            }
            else if (zScore < -1) {
                status = 'underperforming';
                icon = 'fa-arrow-trend-down';
                colorClass = 'text-red-500 dark:text-red-400';
                statusText = 'Dưới mức';
            }
            // Percentage diff for Moving Average info
            let percent = 0;
            if (historyMean === 0) {
                percent = currentAvg > 0 ? 100 : 0;
            }
            else {
                percent = Math.round(((currentAvg - historyMean) / historyMean) * 100);
            }
            const percentText = percent > 0 ? `+${percent}%` : `${percent}%`;
            return {
                status,
                statusText,
                icon,
                colorClass,
                currentAvg: Math.round(currentAvg * 10) / 10,
                historyMean: Math.round(historyMean * 10) / 10,
                percentText,
                historyDays
            };
        });
        this.chartKpis = computed(() => {
            const filter = this.selectedSopFilter();
            const currentRange = this.getActiveDateRange();
            let totalSamples = 0;
            let totalBatches = 0;
            for (const d of enumerateInclusiveDates(currentRange)) {
                const dayStats = this.getDayStats(d);
                if (filter) {
                    const sopStats = dayStats.sops[filter];
                    if (sopStats) {
                        totalSamples += sopStats.samples;
                        totalBatches += sopStats.batches;
                    }
                }
                else {
                    totalSamples += dayStats.totalSamples;
                    totalBatches += dayStats.totalBatches;
                }
            }
            const avgSamplesPerBatch = totalBatches > 0 ? (totalSamples / totalBatches).toFixed(1) : '0';
            return { totalSamples, totalBatches, avgSamplesPerBatch };
        });
        this.today = new Date();
        this.chartCanvas = viewChild('activityChart');
        this.doughnutChartCanvas = viewChild('doughnutChart');
        this.chartInstance = null;
        this.doughnutChartInstance = null;
        this._chartDebounceTimer = null;
        this._lastDarkMode = null;
        this._allStatsLoaded = false;
        this.scheduleTodayRollover();
        effect(() => {
            // Read dependencies to track
            this.startDate();
            this.endDate();
            this.selectedSopFilter();
            this.state.darkMode();
            this.statsData();
            if (!this.isLoading()) {
                if (this._chartDebounceTimer)
                    clearTimeout(this._chartDebounceTimer);
                this._chartDebounceTimer = setTimeout(() => this.initChart(), 300);
            }
        });
        // Fetch monthly aggregates for the selected inclusive range. All time
        // deliberately uses monthly_stats as the historical source of truth.
        effect(() => {
            const user = this.auth.currentUser();
            const canViewReports = !!user && this.auth.canViewReports();
            const startStr = this.startDate();
            const endStr = this.endDate();
            // The analytics panel is locked for users without report access.
            // Do not fetch its monthly aggregates just to blur them underneath
            // the lock overlay.
            if (!canViewReports) {
                this.statsData.set({});
                this._allStatsLoaded = false;
                return;
            }
            if (!startStr && !endStr) {
                if (this._allStatsLoaded)
                    return;
                this._allStatsLoaded = true;
                this.statsService.getAllMonthlyStats().then(data => {
                    if (!this.auth.canViewReports())
                        return;
                    this.statsData.set(data);
                }).catch(e => {
                    this._allStatsLoaded = false;
                    console.error('Error fetching all-time stats:', e);
                });
                return;
            }
            const range = createInclusiveDateRange(startStr, endStr);
            if (!range)
                return;
            const monthsToFetch = new Set();
            const historyStart = new Date(range.start);
            historyStart.setDate(historyStart.getDate() - range.days);
            historyStart.setDate(1);
            const monthCursor = new Date(historyStart);
            const rangeEnd = new Date(range.end);
            rangeEnd.setHours(0, 0, 0, 0);
            while (monthCursor <= rangeEnd) {
                monthsToFetch.add(`${monthCursor.getFullYear()}-${String(monthCursor.getMonth() + 1).padStart(2, '0')}`);
                monthCursor.setMonth(monthCursor.getMonth() + 1);
            }
            const cachedStats = this.statsData();
            const missingKeys = Array.from(monthsToFetch)
                .filter(key => !Object.prototype.hasOwnProperty.call(cachedStats, key));
            if (missingKeys.length === 0)
                return;
            this.statsService.getStatsForMonths(missingKeys).then(data => {
                if (!this.auth.canViewReports())
                    return;
                this.statsData.update(prev => ({ ...prev, ...data }));
            }).catch(e => console.error('Error fetching stats:', e));
        });
        effect(() => {
            const user = this.auth.currentUser();
            const permissions = this.auth.userPermissions();
            if (!user || permissions.length === 0)
                return;
            this.state.ensureActivityFeedListeners();
        });
    }
    async ngOnInit() {
        this.isLoading.set(true);
        // 2. Tải thông tin chuẩn sắp hết hạn
        try {
            if (this.auth.canViewStandards()) {
                const nearestStd = await this.stdService.getNearestExpiry();
                this.processPriorityStandard(nearestStd);
            }
            else {
                this.priorityStandard.set(null);
            }
        }
        catch (e) {
            console.warn("Dashboard: Lỗi khi tải thông tin chất chuẩn sắp hết hạn:", e);
            this.priorityStandard.set({ name: 'Lỗi kết nối / dữ liệu', daysLeft: 0, date: '', status: 'error' });
        }
        this.isLoading.set(false);
    }
    getAvatar(name) {
        const opts = this.state.getUserAvatarOptions(name);
        let photoUrl = opts.photoURL;
        let style = opts.style;
        if (name === this.auth.currentUser()?.displayName) {
            photoUrl = this.auth.currentUser()?.photoURL || photoUrl;
            style = this.auth.currentUser()?.avatarStyle || style;
        }
        return this.getAvatarUrl(name, style, photoUrl);
    }
    ngOnDestroy() {
        if (this._chartDebounceTimer)
            clearTimeout(this._chartDebounceTimer);
        if (this._todayRolloverTimer)
            clearTimeout(this._todayRolloverTimer);
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
        if (this.doughnutChartInstance) {
            this.doughnutChartInstance.destroy();
            this.doughnutChartInstance = null;
        }
    }
    onDateRangeChange(range) {
        this.startDate.set(range.start);
        this.endDate.set(range.end);
    }
    toggleSopFilter(sopName) {
        if (this.selectedSopFilter() === sopName) {
            this.selectedSopFilter.set(null);
        }
        else {
            this.selectedSopFilter.set(sopName);
        }
    }
    navTo(path) {
        this.router.navigate([`/${path}`]);
    }
    async initChart() {
        if (!this.auth.canViewReports())
            return;
        const canvas = this.chartCanvas()?.nativeElement;
        const dCanvas = this.doughnutChartCanvas()?.nativeElement;
        if (!canvas || !dCanvas)
            return;
        const Chart = await this.loadChart();
        const isDark = this.state.darkMode();
        // Keep the canvas instances alive during theme changes. Recreating both
        // charts here caused a visible main-thread hitch on the dashboard.
        const themeChanged = this._lastDarkMode !== null && this._lastDarkMode !== isDark;
        this._lastDarkMode = isDark;
        if (!this.chartInstance || !this.doughnutChartInstance) {
            const existingChart = Chart.getChart(canvas);
            if (existingChart)
                existingChart.destroy();
            const existingDChart = Chart.getChart(dCanvas);
            if (existingDChart)
                existingDChart.destroy();
        }
        const ctx = canvas.getContext('2d');
        const dCtx = dCanvas.getContext('2d');
        if (!ctx || !dCtx)
            return;
        // Dark Mode adaptation colors
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        const tooltipBg = isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        const tooltipTitleColor = isDark ? '#f8fafc' : '#0f172a';
        const tooltipBodyColor = isDark ? '#cbd5e1' : '#334155';
        const tooltipBorderColor = isDark ? '#334155' : '#e2e8f0';
        const barGradient = ctx.createLinearGradient(0, 0, 0, 400);
        barGradient.addColorStop(0, isDark ? '#818cf8' : '#6366f1');
        barGradient.addColorStop(1, isDark ? '#4f46e5' : '#4338ca');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.2)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        const chartRange = this.getActiveDateRange();
        const chartDates = enumerateInclusiveDates(chartRange);
        const chartDays = chartRange.days;
        const labels = [];
        const sampleData = new Array(chartDays).fill(0);
        const runData = new Array(chartDays).fill(0);
        const dailyDetails = new Array(chartDays).fill(null).map(() => ({}));
        for (let i = 0; i < chartDays; i++) {
            const d = chartDates[i];
            // Format label: 'T2 15/3'
            const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const dayName = days[d.getDay()];
            const key = `${dayName} ${d.getDate()}/${d.getMonth() + 1}`;
            labels.push(key);
        }
        const filter = this.selectedSopFilter();
        // MỚI: Loop over chart range instead of history array
        for (let i = 0; i < chartDays; i++) {
            const d = chartDates[i];
            const dayStats = this.getDayStats(d);
            if (filter) {
                const sopStats = dayStats.sops[filter];
                if (sopStats) {
                    runData[i] = sopStats.batches;
                    sampleData[i] = sopStats.samples;
                    dailyDetails[i][filter] = sopStats.samples;
                }
            }
            else {
                runData[i] = dayStats.totalBatches;
                sampleData[i] = dayStats.totalSamples;
                for (const [sop, counts] of Object.entries(dayStats.sops)) {
                    dailyDetails[i][sop] = counts.samples;
                }
            }
        }
        // 1. SOP Distribution (always computed globally for the selected range to serve as selector legend)
        const sopCounts = new Map();
        for (const d of chartDates) {
            const dayStats = this.getDayStats(d);
            for (const [sop, counts] of Object.entries(dayStats.sops)) {
                sopCounts.set(sop, (sopCounts.get(sop) || 0) + counts.samples);
            }
        }
        // Line Chart
        if (this.chartInstance) {
            // Update existing chart
            this.chartInstance.data.labels = labels;
            this.chartInstance.data.datasets[0].data = sampleData;
            this.chartInstance.data.datasets[1].data = runData;
            // Update the tooltip callback closure reference
            this.chartInstance.options.plugins.tooltip.callbacks.afterBody = (context) => {
                const index = context[0].dataIndex;
                const details = dailyDetails[index];
                if (!details || Object.keys(details).length === 0)
                    return '';
                let text = '\nChi tiết mẫu theo SOP:';
                for (const [sop, count] of Object.entries(details)) {
                    text += `\n- ${sop}: ${count} mẫu`;
                }
                return text;
            };
            Object.assign(this.chartInstance.options.plugins.tooltip, {
                backgroundColor: tooltipBg,
                titleColor: tooltipTitleColor,
                bodyColor: tooltipBodyColor,
                borderColor: tooltipBorderColor
            });
            this.chartInstance.options.scales.y.grid.color = gridColor;
            this.chartInstance.data.datasets[0].backgroundColor = gradient;
            this.chartInstance.data.datasets[1].backgroundColor = barGradient;
            this.chartInstance.update(themeChanged ? 'none' : 'active');
        }
        else {
            // Initialize chart
            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Số mẫu', data: sampleData, backgroundColor: gradient, borderColor: '#6366f1', borderWidth: 3,
                            pointRadius: 4, pointBackgroundColor: '#6366f1', pointBorderColor: '#fff', pointHoverRadius: 6, fill: true, tension: 0.4, yAxisID: 'y'
                        },
                        {
                            label: 'Số mẻ', data: runData, type: 'bar', backgroundColor: barGradient, borderRadius: 6, barThickness: 12, borderSkipped: false, order: 1, yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 15,
                            left: 10,
                            right: 15
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: tooltipBg,
                            titleColor: tooltipTitleColor,
                            bodyColor: tooltipBodyColor,
                            borderColor: tooltipBorderColor,
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            titleFont: { size: 13, family: "'Inter', 'Open Sans', sans-serif" },
                            bodyFont: { size: 12, family: "'Inter', 'Open Sans', sans-serif" },
                            displayColors: true,
                            usePointStyle: true,
                            callbacks: {
                                afterBody: (context) => {
                                    const index = context[0].dataIndex;
                                    const details = dailyDetails[index];
                                    if (!details || Object.keys(details).length === 0)
                                        return '';
                                    let text = '\nChi tiết mẫu theo SOP:';
                                    for (const [sop, count] of Object.entries(details)) {
                                        text += `\n- ${sop}: ${count} mẫu`;
                                    }
                                    return text;
                                }
                            }
                        }
                    },
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                        x: {
                            display: true,
                            grid: { display: false },
                            border: { display: false },
                            ticks: {
                                display: true,
                                font: { size: 10, family: "'Open Sans', sans-serif" },
                                color: '#94a3b8'
                            }
                        },
                        y: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { tickBorderDash: [5, 5], color: gridColor }, border: { display: false }, ticks: { font: { size: 10, family: "'Open Sans', sans-serif" }, color: '#94a3b8', maxTicksLimit: 5 } },
                        y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { display: false }, border: { display: false }, ticks: { display: false } }
                    }
                }
            });
        }
        // Doughnut Chart & Custom Legend calculation
        const sopLabels = Array.from(sopCounts.keys());
        const sopData = Array.from(sopCounts.values());
        // Modern Tailwind color palette
        const bgColors = ['#6366f1', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];
        const totalSopSamples = sopData.reduce((a, b) => a + b, 0);
        const dist = sopLabels.map((name, i) => {
            const count = sopData[i];
            const percent = totalSopSamples > 0 ? Math.round((count / totalSopSamples) * 100) : 0;
            const color = bgColors[i % bgColors.length];
            return { name, count, percent, color };
        });
        dist.sort((a, b) => b.count - a.count);
        this.sopDistribution.set(dist);
        if (this.doughnutChartInstance) {
            this.doughnutChartInstance.data.labels = sopLabels;
            this.doughnutChartInstance.data.datasets[0].data = sopData;
            this.doughnutChartInstance.data.datasets[0].backgroundColor = bgColors.slice(0, sopLabels.length);
            Object.assign(this.doughnutChartInstance.options.plugins.tooltip, {
                backgroundColor: tooltipBg,
                titleColor: tooltipTitleColor,
                bodyColor: tooltipBodyColor,
                borderColor: tooltipBorderColor
            });
            this.doughnutChartInstance.update(themeChanged ? 'none' : 'active');
        }
        else {
            this.doughnutChartInstance = new Chart(dCtx, {
                type: 'doughnut',
                data: {
                    labels: sopLabels,
                    datasets: [{
                            data: sopData,
                            backgroundColor: bgColors.slice(0, sopLabels.length),
                            borderWidth: 0,
                            hoverOffset: 8
                        }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    cutout: '70%',
                    onClick: (event, elements, chart) => {
                        if (elements && elements.length > 0) {
                            const index = elements[0].index;
                            const label = chart.data.labels?.[index];
                            this.toggleSopFilter(label);
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: tooltipBg,
                            titleColor: tooltipTitleColor,
                            bodyColor: tooltipBodyColor,
                            borderColor: tooltipBorderColor,
                            borderWidth: 1,
                            padding: 10,
                            cornerRadius: 8,
                            titleFont: { size: 13, family: "'Inter', 'Open Sans', sans-serif" },
                            bodyFont: { size: 12, family: "'Inter', 'Open Sans', sans-serif" },
                            displayColors: false,
                            usePointStyle: true,
                            callbacks: {
                                title: () => '',
                                label: (context) => {
                                    const value = context.raw || 0;
                                    const total = context.chart._metasets[context.datasetIndex].total;
                                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                    return `${value} mẫu (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    processPriorityStandard(std) {
        if (!std || !std.expiry_date) {
            this.priorityStandard.set(null);
            return;
        }
        const expiry = new Date(std.expiry_date);
        const today = new Date();
        const diffMs = expiry.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        let status;
        if (daysLeft < 0)
            status = 'expired';
        else if (daysLeft < 60)
            status = 'warning';
        else
            status = 'safe';
        this.priorityStandard.set({ name: std.name, daysLeft, date: std.expiry_date, status });
    }
    handlePendingRequestsClick() {
        if (!this.auth.canViewSop() && !this.auth.canViewStandards())
            return;
        const counts = this.pendingCounts();
        if (counts.sop > 0 && counts.std > 0) {
            this.showPendingRequestsPopover.update(v => !v);
        }
        else if (counts.sop > 0 && this.auth.canViewSop()) {
            this.navTo('requests');
        }
        else if (counts.std > 0 && this.auth.canViewStandards()) {
            this.navTo('standard-requests');
        }
        else if (this.auth.canViewSop()) {
            this.navTo('requests');
        }
        else if (this.auth.canViewStandards()) {
            this.navTo('standard-requests');
        }
    }
    getTimeDiff(timestamp) {
        const date = timestampToDate(timestamp);
        if (!date)
            return '';
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1)
            return 'Vừa xong';
        if (diffMins < 60)
            return `${diffMins} phút trước`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24)
            return `${diffHours} giờ trước`;
        return `${Math.floor(diffHours / 24)} ngày trước`;
    }
    getLogActionText(action) {
        if (this._actionTextMap[action])
            return this._actionTextMap[action];
        if (action.includes('APPROVE'))
            return 'đã duyệt yêu cầu';
        if (action.includes('STOCK_IN'))
            return 'đã nhập kho';
        if (action.includes('STOCK_OUT'))
            return 'đã xuất kho';
        if (action.includes('CREATE'))
            return 'đã tạo mới';
        if (action.includes('DELETE'))
            return 'đã xóa';
        return 'đã cập nhật';
    }
    loadChart() {
        this.chartLoader ??= import('chart.js').then(m => {
            m.Chart.register(m.BarController, m.LineController, m.DoughnutController, m.CategoryScale, m.LinearScale, m.PointElement, m.LineElement, m.BarElement, m.ArcElement, m.Filler, m.Tooltip, m.Legend);
            return m.Chart;
        });
        return this.chartLoader;
    }
    static { this.ɵfac = function DashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DashboardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DashboardComponent, selectors: [["app-dashboard"]], viewQuery: function DashboardComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuerySignal(ctx.chartCanvas, _c0, 5);
            i0.ɵɵviewQuerySignal(ctx.doughnutChartCanvas, _c1, 5);
        } if (rf & 2) {
            i0.ɵɵqueryAdvance(2);
        } }, decls: 145, vars: 129, consts: [["activityChart", ""], ["doughnutChart", ""], [1, "pb-20", "fade-in", "font-sans"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-6", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "border", "border-blue-100", "dark:border-blue-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-house", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-blue-600", "to-indigo-600", "dark:from-blue-400", "dark:to-indigo-400"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "gap-2", "items-center"], ["title", "Xem nh\u1EADt k\u00FD c\u1EADp nh\u1EADt phi\u00EAn b\u1EA3n h\u1EC7 th\u1ED1ng", 1, "px-3.5", "py-2", "bg-gradient-to-r", "from-blue-50", "to-indigo-50", "dark:from-slate-850", "dark:to-slate-750", "hover:from-blue-100", "hover:to-indigo-100", "dark:hover:bg-slate-700", "text-blue-700", "dark:text-blue-300", "border", "border-blue-200/80", "dark:border-slate-600", "rounded-xl", "text-xs", "font-black", "transition", "flex", "items-center", "gap-1.5", "shadow-sm", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-sparkles", "text-amber-500", "animate-pulse", "text-[13px]"], [1, "md:hidden", "px-5", "py-2.5", "bg-slate-800", "dark:bg-slate-700", "text-white", "rounded-xl", "shadow-lg", "shadow-slate-300", "dark:shadow-none", "hover:bg-black", "dark:hover:bg-slate-600", "transition", "flex", "items-center", "gap-2", "font-bold", "text-xs", "uppercase", "tracking-wide", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-qrcode"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "xl:grid-cols-4", "gap-6", "mb-6"], [1, "relative", "h-32"], ["type", "button", 1, "relative", "w-full", "text-left", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-soft-xl", "dark:shadow-none", "p-4", "flex", "flex-col", "justify-between", "h-32", "overflow-hidden", "group", "border", "border-transparent", "dark:border-slate-700", "transition-transform", "focus:outline-none", "focus:ring-2", "focus:ring-purple-400", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "absolute", "inset-0", "bg-white/60", "dark:bg-slate-800/60", "backdrop-blur-[3px]", "z-20", "flex", "flex-col", "items-center", "justify-center", "text-slate-500", "dark:text-slate-400"], [1, "flex", "justify-between", "items-start", "z-10"], [1, "text-[10px]", "font-bold", "text-gray-500", "dark:text-slate-400", "uppercase", "tracking-wider", "mb-1"], [1, "text-2xl", "font-black", "text-gray-800", "dark:text-slate-100"], ["width", "40px", "height", "32px"], [1, "w-12", "h-12", "rounded-xl", "bg-gradient-to-tl", "from-purple-700", "to-pink-500", "shadow-lg", "flex", "items-center", "justify-center", "text-white", "shrink-0", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-clipboard-list", "text-lg"], [1, "z-10"], [1, "text-xs", "font-bold"], [1, "absolute", "inset-0", "bg-white/95", "dark:bg-slate-800/95", "backdrop-blur-md", "z-30", "flex", "flex-col", "justify-center", "items-center", "p-3", "gap-2", "animate-fade-in", "rounded-2xl", "shadow-xl"], ["type", "button", 1, "relative", "w-full", "text-left", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-soft-xl", "dark:shadow-none", "p-4", "flex", "flex-col", "justify-between", "h-32", "overflow-hidden", "group", "border", "border-transparent", "dark:border-slate-700", "transition-transform", "focus:outline-none", "focus:ring-2", "focus:ring-red-400", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "w-12", "h-12", "rounded-xl", "bg-gradient-to-tl", "from-red-600", "to-rose-400", "shadow-lg", "flex", "items-center", "justify-center", "text-white", "shrink-0", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-box-open", "text-lg"], [1, "text-xs", "font-bold", "text-red-500", "dark:text-red-400"], [1, "text-xs", "font-bold", "text-emerald-500", "dark:text-emerald-400"], ["type", "button", 1, "relative", "w-full", "text-left", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-soft-xl", "dark:shadow-none", "p-4", "flex", "flex-col", "justify-between", "h-32", "overflow-hidden", "group", "border", "border-transparent", "dark:border-slate-700", "transition-transform", "focus:outline-none", "focus:ring-2", "focus:ring-blue-400", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "w-12", "h-12", "rounded-xl", "bg-gradient-to-tl", "from-blue-500", "to-cyan-400", "shadow-lg", "flex", "items-center", "justify-center", "text-white", "shrink-0", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-bolt", "text-lg"], [1, "text-xs", "font-bold", "text-gray-400", "dark:text-slate-500"], ["type", "button", 1, "relative", "w-full", "text-left", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-soft-xl", "dark:shadow-none", "p-4", "flex", "flex-col", "justify-between", "h-32", "overflow-hidden", "group", "border", "border-transparent", "dark:border-slate-700", "transition-transform", "focus:outline-none", "focus:ring-2", "focus:ring-orange-400", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "min-w-0", "pr-2"], [1, "text-sm", "font-bold", "text-gray-800", "dark:text-slate-100", "truncate", "leading-tight", "mt-1", 3, "title"], [1, "text-lg", "font-black", "text-gray-800", "dark:text-slate-100"], [1, "w-12", "h-12", "rounded-xl", "bg-gradient-to-tl", "from-orange-500", "to-yellow-400", "shadow-lg", "flex", "items-center", "justify-center", "text-white", "shrink-0", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-clock", "text-lg"], [1, "text-xs", "font-bold", 3, "ngClass"], [1, "grid", "grid-cols-1", "lg:grid-cols-3", "gap-6", "mb-6"], [1, "lg:col-span-2", "relative", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-soft-xl", "dark:shadow-none", "p-5", "overflow-hidden", "flex", "flex-col", "border", "border-slate-100", "dark:border-slate-700", "lg:h-[560px]", "h-auto"], [1, "absolute", "inset-0", "bg-white/60", "dark:bg-slate-800/60", "backdrop-blur-sm", "z-20", "flex", "flex-col", "items-center", "justify-center", "text-slate-500", "dark:text-slate-400"], [1, "flex-1", "flex", "flex-col"], [1, "flex", "flex-col", "xl:flex-row", "justify-between", "items-start", "xl:items-center", "mb-4", "gap-4"], [1, "flex", "flex-wrap", "items-center", "gap-x-3", "gap-y-1.5"], [1, "font-bold", "text-gray-700", "dark:text-slate-200", "capitalize", "text-lg", "shrink-0"], [1, "flex", "items-center", "gap-1.5", "px-2.5", "py-0.5", "text-xs", "font-bold", "rounded-full", "bg-indigo-500", "text-white", "cursor-pointer", "hover:bg-indigo-600", "active:scale-95", "transition-all", "shadow-sm", "shrink-0", "border", "border-indigo-400/30"], [1, "flex", "items-center", "gap-1", "text-xs", "font-bold", "px-2", "py-0.5", "rounded-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-100", "dark:border-slate-700/50", "shrink-0", 3, "ngClass"], [1, "fa-solid"], [1, "font-mono", "text-[10px]", "ml-0.5", "opacity-90"], [1, "text-gray-400", "dark:text-slate-500", "font-medium", "text-[11px]", "shrink-0"], [1, "shrink-0", "w-full", "sm:w-auto"], [3, "dateChange", "initStart", "initEnd"], [1, "grid", "grid-cols-3", "gap-4", "mb-4"], [1, "bg-slate-50", "dark:bg-slate-900/50", "rounded-xl", "p-3", "border", "border-slate-100", "dark:border-slate-700", "flex", "flex-col", "justify-center"], [1, "text-[10px]", "font-bold", "text-slate-500", "uppercase"], [1, "text-xl", "font-black", "text-indigo-600", "dark:text-indigo-400"], [1, "text-xl", "font-black", "text-blue-600", "dark:text-blue-400"], [1, "text-xl", "font-black", "text-emerald-600", "dark:text-emerald-400"], [1, "flex-1", "lg:h-[320px]", "md:h-[280px]", "h-auto", "grid", "grid-cols-1", "md:grid-cols-3", "gap-6", "min-h-0"], [1, "md:col-span-2", "relative", "w-full", "min-h-[220px]", "md:h-full", "bg-gradient-to-b", "from-transparent", "to-gray-50/30", "dark:to-slate-800/30", "rounded-xl"], [1, "flex", "items-center", "justify-center", "h-full"], [1, "relative", "w-full", "h-full", "flex", "flex-col", "items-center", "justify-start", "min-h-0"], [1, "text-xs", "font-bold", "text-slate-500", "mb-2", "uppercase", "tracking-wider", "text-center", "w-full", "shrink-0"], [1, "flex", "items-center", "justify-center", "h-full", "w-full"], [1, "w-full", "flex-1", "flex", "flex-col", "sm:flex-col", "lg:flex-row", "items-center", "justify-center", "gap-4", "min-h-0"], [1, "flex", "flex-col", "gap-4", "lg:h-[560px]", "h-[360px]"], [1, "flex-1", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-soft-xl", "dark:shadow-none", "p-4", "overflow-hidden", "flex", "flex-col", "min-h-0", "border", "border-slate-100", "dark:border-slate-700"], [1, "flex", "flex-col", "gap-3", "mb-4", "shrink-0"], [1, "flex", "items-center", "justify-between"], [1, "font-bold", "text-gray-700", "dark:text-slate-200", "capitalize", "text-base"], [1, "relative", "w-1/2"], [1, "fa-solid", "fa-search", "absolute", "left-2.5", "top-1/2", "-translate-y-1/2", "text-slate-400", "text-xs"], ["type", "text", "placeholder", "T\u00ECm ki\u1EBFm...", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "rounded-lg", "pl-8", "pr-2", "py-1.5", "focus:outline-none", "focus:border-blue-500", "transition", "text-slate-700", "dark:text-slate-300", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-1.5", "overflow-x-auto", "custom-scrollbar", "pb-1"], [1, "px-2.5", "py-1", "rounded-full", "text-[10px]", "font-bold", "border", "whitespace-nowrap", "transition-all", 3, "ngClass"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "-mr-2", "pr-2"], [1, "relative", "border-l", "border-gray-100", "dark:border-slate-700/50", "ml-4", "space-y-6", "pb-2"], [1, "relative"], [1, "text-center", "text-gray-400", "dark:text-slate-500", "text-sm", "py-10", "flex", "flex-col", "items-center", "justify-center"], [1, "mb-6", "relative"], [1, "absolute", "inset-0", "bg-slate-50/60", "dark:bg-slate-900/60", "backdrop-blur-sm", "z-20", "flex", "flex-col", "items-center", "justify-center", "text-slate-500", "dark:text-slate-400", "rounded-2xl"], [1, "min-h-48", "rounded-2xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800"], [1, "fa-solid", "fa-lock", "text-2xl", "mb-1"], [1, "text-[10px]", "font-bold", "uppercase", "tracking-wider"], [1, "text-[10px]", "font-bold", "text-gray-500", "dark:text-slate-400", "uppercase", "tracking-wider", "mb-0.5", "w-full", "text-center"], ["type", "button", 1, "w-full", "bg-indigo-50", "hover:bg-indigo-100", "dark:bg-indigo-900/30", "dark:hover:bg-indigo-800/50", "text-indigo-700", "dark:text-indigo-300", "font-bold", "py-1.5", "rounded-lg", "text-xs", "flex", "justify-between", "px-3", "items-center", "transition-colors", 3, "click"], [1, "bg-indigo-200", "dark:bg-indigo-700", "px-2", "py-0.5", "rounded-full", "min-w-[20px]", "text-center"], ["type", "button", 1, "w-full", "bg-orange-50", "hover:bg-orange-100", "dark:bg-orange-900/30", "dark:hover:bg-orange-800/50", "text-orange-700", "dark:text-orange-300", "font-bold", "py-1.5", "rounded-lg", "text-xs", "flex", "justify-between", "px-3", "items-center", "transition-colors", 3, "click"], [1, "bg-orange-200", "dark:bg-orange-700", "px-2", "py-0.5", "rounded-full", "min-w-[20px]", "text-center"], [1, "fa-solid", "fa-lock", "text-4xl", "mb-3"], [1, "text-sm", "font-bold", "uppercase", "tracking-wider"], [1, "text-xs", "mt-1"], [1, "flex", "items-center", "gap-1.5", "px-2.5", "py-0.5", "text-xs", "font-bold", "rounded-full", "bg-indigo-500", "text-white", "cursor-pointer", "hover:bg-indigo-600", "active:scale-95", "transition-all", "shadow-sm", "shrink-0", "border", "border-indigo-400/30", 3, "click"], [1, "fa-solid", "fa-circle-xmark", "text-[10px]", "opacity-80", "hover:opacity-100"], ["width", "100%", "height", "100%", "shape", "rect"], ["width", "150px", "height", "150px", "shape", "circle"], [1, "relative", "max-w-[130px]", "max-h-[130px]", "md:max-w-[140px]", "md:max-h-[140px]", "flex-shrink-0", "flex", "items-center", "justify-center"], [1, "flex-1", "w-full", "overflow-y-auto", "max-h-[110px]", "sm:max-h-[120px]", "lg:max-h-[150px]", "pr-1", "custom-scrollbar"], [1, "flex", "flex-col", "gap-1.5"], [1, "w-full", "flex", "items-center", "justify-between", "text-[11px]", "font-semibold", "text-slate-600", "dark:text-slate-300", "py-1", "px-1.5", "rounded-lg", "border", "border-transparent", "hover:bg-slate-100", "dark:hover:bg-slate-700/50", "cursor-pointer", "transition-all", "last:border-b-0", "focus:outline-none", "focus:ring-1", "focus:ring-indigo-400", 3, "ngClass"], [1, "text-center", "text-slate-400", "dark:text-slate-500", "italic", "text-[11px]", "py-4"], [1, "w-full", "flex", "items-center", "justify-between", "text-[11px]", "font-semibold", "text-slate-600", "dark:text-slate-300", "py-1", "px-1.5", "rounded-lg", "border", "border-transparent", "hover:bg-slate-100", "dark:hover:bg-slate-700/50", "cursor-pointer", "transition-all", "last:border-b-0", "focus:outline-none", "focus:ring-1", "focus:ring-indigo-400", 3, "click", "ngClass"], [1, "flex", "items-center", "gap-1.5", "truncate", "mr-2"], [1, "w-2.5", "h-2.5", "rounded-full", "shrink-0", "shadow-sm"], [1, "truncate", 3, "title"], [1, "font-mono", "font-bold", "text-slate-700", "dark:text-slate-200", "shrink-0"], [1, "text-[9px]", "font-normal", "text-slate-400"], [1, "px-2.5", "py-1", "rounded-full", "text-[10px]", "font-bold", "border", "whitespace-nowrap", "transition-all", 3, "click", "ngClass"], [1, "sticky", "top-0", "z-10", "bg-white/90", "dark:bg-slate-800/90", "backdrop-blur-sm", "py-1", "-ml-6", "pl-6", "mb-3"], [1, "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-widest", "bg-slate-100", "dark:bg-slate-900/80", "px-2", "py-0.5", "rounded-md", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm"], [1, "space-y-5"], [1, "relative", "pl-6", "group"], [1, "flex", "flex-col", "bg-transparent", "group-hover:bg-slate-50/50", "dark:group-hover:bg-slate-700/20", "rounded-xl", "p-1.5", "-ml-1.5", "transition-colors"], [1, "text-[10px]", "font-bold", "text-gray-400", "dark:text-slate-500", "uppercase", "mb-1"], [1, "flex", "items-start", "gap-3"], ["alt", "Avatar", 1, "w-8", "h-8", "rounded-lg", "border", "border-gray-100", "dark:border-slate-700", "shadow-sm", "object-cover", "bg-white", "dark:bg-slate-800", "shrink-0", 3, "src"], [1, "flex-1", "min-w-0"], [1, "text-xs", "font-bold", "text-gray-700", "dark:text-slate-300", "leading-tight"], [1, "text-gray-900", "dark:text-slate-100"], [1, "font-normal", "text-[10px]", "text-gray-500", "dark:text-slate-400", "ml-1", "inline-block"], [1, "text-[11px]", "text-slate-600", "dark:text-slate-300", "mt-1", "line-clamp-3", "bg-white", "dark:bg-slate-900/50", "p-2.5", "rounded-lg", "border", "border-slate-100", "dark:border-slate-700", "font-medium", "shadow-sm", "leading-relaxed", "whitespace-pre-wrap"], [1, "mt-2", "flex", "gap-2"], [1, "text-[9px]", "bg-white", "dark:bg-slate-800", "border", "border-gray-200", "dark:border-slate-700", "px-2.5", "py-1", "rounded-md", "text-slate-600", "dark:text-slate-400", "hover:text-blue-600", "dark:hover:text-blue-400", "hover:border-blue-200", "dark:hover:border-blue-800", "font-bold", "transition", "shadow-xs", "active:scale-95", "flex", "items-center", 3, "click"], [1, "fa-solid", "fa-qrcode", "mr-1"], [1, "text-[9px]", "bg-indigo-50", "dark:bg-indigo-900/30", "border", "border-indigo-100", "dark:border-indigo-800/50", "px-2.5", "py-1", "rounded-md", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/55", "font-bold", "transition", "shadow-xs", "active:scale-95", "flex", "items-center"], [1, "text-[9px]", "bg-indigo-50", "dark:bg-indigo-900/30", "border", "border-indigo-100", "dark:border-indigo-800/50", "px-2.5", "py-1", "rounded-md", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/55", "font-bold", "transition", "shadow-xs", "active:scale-95", "flex", "items-center", 3, "click"], [1, "fa-solid", "fa-vial", "mr-1"], [1, "fa-solid", "fa-inbox", "text-3xl", "mb-2", "opacity-50"], [3, "embedded"], [1, "min-h-48", "rounded-2xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "flex", "items-center", "justify-center", "text-slate-400"], [1, "flex", "items-center", "gap-3", "text-sm", "font-bold"], [1, "fa-solid", "fa-list-check"]], template: function DashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "div", 5);
            i0.ɵɵelement(4, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div")(6, "h1", 7);
            i0.ɵɵtext(7, " Xin Ch\u00E0o, ");
            i0.ɵɵelementStart(8, "span", 8);
            i0.ɵɵtext(9);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(10, "! ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "p", 9);
            i0.ɵɵtext(12, "H\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD th\u00F4ng tin ph\u00F2ng th\u00ED nghi\u1EC7m (LIMS) \u0111\u00E3 s\u1EB5n s\u00E0ng.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(13, "div", 10)(14, "button", 11);
            i0.ɵɵlistener("click", function DashboardComponent_Template_button_click_14_listener() { return ctx.changelogService.open(); });
            i0.ɵɵelement(15, "i", 12);
            i0.ɵɵelementStart(16, "span");
            i0.ɵɵtext(17);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(18, "button", 13);
            i0.ɵɵlistener("click", function DashboardComponent_Template_button_click_18_listener() { return ctx.qrService.startScan(); });
            i0.ɵɵelement(19, "i", 14);
            i0.ɵɵtext(20, " Qu\u00E9t M\u00E3 ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(21, "div", 15)(22, "div", 16)(23, "button", 17);
            i0.ɵɵlistener("click", function DashboardComponent_Template_button_click_23_listener() { return ctx.handlePendingRequestsClick(); });
            i0.ɵɵtemplate(24, DashboardComponent_Conditional_24_Template, 4, 0, "div", 18);
            i0.ɵɵelementStart(25, "div", 19)(26, "div")(27, "p", 20);
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "h4", 21);
            i0.ɵɵtemplate(30, DashboardComponent_Conditional_30_Template, 1, 0, "app-skeleton", 22)(31, DashboardComponent_Conditional_31_Template, 1, 1);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(32, "div", 23);
            i0.ɵɵelement(33, "i", 24);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(34, "div", 25)(35, "span", 26);
            i0.ɵɵtext(36);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(37, DashboardComponent_Conditional_37_Template, 13, 2, "div", 27);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "button", 28);
            i0.ɵɵlistener("click", function DashboardComponent_Template_button_click_38_listener() { return ctx.navTo("inventory"); });
            i0.ɵɵtemplate(39, DashboardComponent_Conditional_39_Template, 4, 0, "div", 18);
            i0.ɵɵelementStart(40, "div", 19)(41, "div")(42, "p", 20);
            i0.ɵɵtext(43, "C\u1EA3nh b\u00E1o Kho");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "h4", 21);
            i0.ɵɵtemplate(45, DashboardComponent_Conditional_45_Template, 1, 0, "app-skeleton", 22)(46, DashboardComponent_Conditional_46_Template, 1, 1);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(47, "div", 29);
            i0.ɵɵelement(48, "i", 30);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(49, "div", 25);
            i0.ɵɵtemplate(50, DashboardComponent_Conditional_50_Template, 2, 0, "span", 31)(51, DashboardComponent_Conditional_51_Template, 2, 0, "span", 32);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(52, "button", 33);
            i0.ɵɵlistener("click", function DashboardComponent_Template_button_click_52_listener() { return ctx.navTo("stats"); });
            i0.ɵɵtemplate(53, DashboardComponent_Conditional_53_Template, 4, 0, "div", 18);
            i0.ɵɵelementStart(54, "div", 19)(55, "div")(56, "p", 20);
            i0.ɵɵtext(57, "Ho\u1EA1t \u0111\u1ED9ng h\u00F4m nay");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(58, "h4", 21);
            i0.ɵɵtemplate(59, DashboardComponent_Conditional_59_Template, 1, 0, "app-skeleton", 22)(60, DashboardComponent_Conditional_60_Template, 1, 1);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(61, "div", 34);
            i0.ɵɵelement(62, "i", 35);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(63, "div", 25)(64, "span", 36);
            i0.ɵɵtext(65, "Ghi nh\u1EADn log h\u1EC7 th\u1ED1ng");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(66, "button", 37);
            i0.ɵɵlistener("click", function DashboardComponent_Template_button_click_66_listener() { return ctx.navTo("standards"); });
            i0.ɵɵtemplate(67, DashboardComponent_Conditional_67_Template, 4, 0, "div", 18);
            i0.ɵɵelementStart(68, "div", 19)(69, "div", 38)(70, "p", 20);
            i0.ɵɵtext(71, "Chu\u1EA9n s\u1EAFp h\u1EBFt h\u1EA1n");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(72, DashboardComponent_Conditional_72_Template, 2, 2, "h4", 39)(73, DashboardComponent_Conditional_73_Template, 2, 0, "h4", 40);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "div", 41);
            i0.ɵɵelement(75, "i", 42);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(76, "div", 25);
            i0.ɵɵtemplate(77, DashboardComponent_Conditional_77_Template, 2, 5, "span", 43)(78, DashboardComponent_Conditional_78_Template, 2, 0, "span", 32);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(79, "div", 44)(80, "div", 45);
            i0.ɵɵtemplate(81, DashboardComponent_Conditional_81_Template, 6, 0, "div", 46);
            i0.ɵɵelementStart(82, "div", 47)(83, "div", 48)(84, "div", 49)(85, "h6", 50);
            i0.ɵɵtext(86, "Hi\u1EC7u Su\u1EA5t Ph\u00E2n T\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(87, DashboardComponent_Conditional_87_Template, 4, 1, "button", 51);
            i0.ɵɵelementStart(88, "div", 52);
            i0.ɵɵelement(89, "i", 53);
            i0.ɵɵelementStart(90, "span");
            i0.ɵɵtext(91);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(92, "span", 54);
            i0.ɵɵtext(93);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(94, "span", 55);
            i0.ɵɵtext(95);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(96, "div", 56)(97, "app-date-range-filter", 57);
            i0.ɵɵlistener("dateChange", function DashboardComponent_Template_app_date_range_filter_dateChange_97_listener($event) { return ctx.onDateRangeChange($event); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(98, "div", 58)(99, "div", 59)(100, "p", 60);
            i0.ɵɵtext(101, "T\u1ED5ng s\u1ED1 m\u1EABu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(102, "h4", 61);
            i0.ɵɵtext(103);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(104, "div", 59)(105, "p", 60);
            i0.ɵɵtext(106, "T\u1ED5ng s\u1ED1 m\u1EBB");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(107, "h4", 62);
            i0.ɵɵtext(108);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(109, "div", 59)(110, "p", 60);
            i0.ɵɵtext(111, "Trung b\u00ECnh m\u1EABu/m\u1EBB");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(112, "h4", 63);
            i0.ɵɵtext(113);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(114, "div", 64)(115, "div", 65);
            i0.ɵɵtemplate(116, DashboardComponent_Conditional_116_Template, 2, 0, "div", 66)(117, DashboardComponent_Conditional_117_Template, 2, 0, "canvas");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(118, "div", 67)(119, "h6", 68);
            i0.ɵɵtext(120, "Ph\u00E2n B\u1ED5 SOP");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(121, DashboardComponent_Conditional_121_Template, 2, 0, "div", 69)(122, DashboardComponent_Conditional_122_Template, 9, 1, "div", 70);
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(123, "div", 71)(124, "div", 72)(125, "div", 73)(126, "div", 74)(127, "h6", 75);
            i0.ɵɵtext(128, "Ho\u1EA1t \u0110\u1ED9ng G\u1EA7n \u0110\u00E2y");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(129, "div", 76);
            i0.ɵɵelement(130, "i", 77);
            i0.ɵɵelementStart(131, "input", 78);
            i0.ɵɵlistener("ngModelChange", function DashboardComponent_Template_input_ngModelChange_131_listener($event) { return ctx.logSearchTerm.set($event); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(132, "div", 79);
            i0.ɵɵrepeaterCreate(133, DashboardComponent_For_134_Template, 2, 2, "button", 80, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(135, "div", 81)(136, "div", 82);
            i0.ɵɵrepeaterCreate(137, DashboardComponent_For_138_Template, 7, 1, "div", 83, _forTrack0, false, DashboardComponent_ForEmpty_139_Template, 4, 0, "div", 84);
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(140, "div", 85);
            i0.ɵɵtemplate(141, DashboardComponent_Conditional_141_Template, 6, 0, "div", 86);
            i0.ɵɵelementStart(142, "div");
            i0.ɵɵtemplate(143, DashboardComponent_Conditional_143_Template, 4, 0)(144, DashboardComponent_Conditional_144_Template, 1, 0, "div", 87);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            let tmp_0_0;
            let tmp_52_0;
            let tmp_56_0;
            let tmp_61_0;
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate((tmp_0_0 = ctx.auth.currentUser()) == null ? null : tmp_0_0.displayName);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate1("Nh\u1EADt K\u00FD ", ctx.state.systemVersion(), "");
            i0.ɵɵadvance(6);
            i0.ɵɵclassProp("cursor-pointer", ctx.auth.canViewSop() || ctx.auth.canViewStandards())("hover:-translate-y-1", ctx.auth.canViewSop() || ctx.auth.canViewStandards())("hover:border-purple-100", ctx.auth.canViewSop() || ctx.auth.canViewStandards())("dark:hover:border-purple-500", ctx.auth.canViewSop() || ctx.auth.canViewStandards());
            i0.ɵɵproperty("disabled", !ctx.auth.canViewSop() && !ctx.auth.canViewStandards());
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.auth.canViewSop() && !ctx.auth.canViewStandards() ? 24 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewSop() && !ctx.auth.canViewStandards())("blur-sm", !ctx.auth.canViewSop() && !ctx.auth.canViewStandards());
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1(" ", ctx.auth.canApprove() || ctx.auth.canApproveStandards() ? "Y\u00EAu c\u1EA7u ch\u1EDD duy\u1EC7t" : "Y\u00EAu c\u1EA7u c\u1EE7a t\u00F4i", " ");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.isLoading() ? 30 : 31);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("grayscale", !ctx.auth.canViewSop() && !ctx.auth.canViewStandards());
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewSop() && !ctx.auth.canViewStandards())("blur-sm", !ctx.auth.canViewSop() && !ctx.auth.canViewStandards());
            i0.ɵɵadvance();
            i0.ɵɵclassProp("text-emerald-500", ctx.totalPendingRequests() === 0)("text-fuchsia-500", ctx.totalPendingRequests() > 0);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.totalPendingRequests() > 0 ? ctx.auth.canApprove() || ctx.auth.canApproveStandards() ? "+ C\u1EA7n x\u1EED l\u00FD ngay" : "+ \u0110ang ch\u1EDD duy\u1EC7t" : "Kh\u00F4ng c\u00F3 y\u00EAu c\u1EA7u", " ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPendingRequestsPopover() ? 37 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("cursor-pointer", ctx.auth.canViewInventory())("hover:-translate-y-1", ctx.auth.canViewInventory())("hover:border-red-100", ctx.auth.canViewInventory())("dark:hover:border-red-500", ctx.auth.canViewInventory());
            i0.ɵɵproperty("disabled", !ctx.auth.canViewInventory());
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.auth.canViewInventory() ? 39 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewInventory())("blur-sm", !ctx.auth.canViewInventory());
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.isLoading() ? 45 : 46);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("grayscale", !ctx.auth.canViewInventory());
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewInventory())("blur-sm", !ctx.auth.canViewInventory());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.lowStockItems().length > 0 ? 50 : 51);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("cursor-pointer", ctx.auth.canViewReports())("hover:-translate-y-1", ctx.auth.canViewReports())("hover:border-blue-100", ctx.auth.canViewReports())("dark:hover:border-blue-500", ctx.auth.canViewReports());
            i0.ɵɵproperty("disabled", !ctx.auth.canViewReports());
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.auth.canViewReports() ? 53 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewReports())("blur-sm", !ctx.auth.canViewReports());
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.isLoading() ? 59 : 60);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("grayscale", !ctx.auth.canViewReports());
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewReports())("blur-sm", !ctx.auth.canViewReports());
            i0.ɵɵadvance(3);
            i0.ɵɵclassProp("cursor-pointer", ctx.auth.canViewStandards())("hover:-translate-y-1", ctx.auth.canViewStandards())("hover:border-orange-100", ctx.auth.canViewStandards())("dark:hover:border-orange-500", ctx.auth.canViewStandards());
            i0.ɵɵproperty("disabled", !ctx.auth.canViewStandards());
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.auth.canViewStandards() ? 67 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewStandards())("blur-sm", !ctx.auth.canViewStandards());
            i0.ɵɵadvance(4);
            i0.ɵɵconditional((tmp_52_0 = ctx.priorityStandard()) ? 72 : 73, tmp_52_0);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("grayscale", !ctx.auth.canViewStandards());
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewStandards())("blur-sm", !ctx.auth.canViewStandards());
            i0.ɵɵadvance();
            i0.ɵɵconditional((tmp_56_0 = ctx.priorityStandard()) ? 77 : 78, tmp_56_0);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(!ctx.auth.canViewReports() ? 81 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewReports())("blur-sm", !ctx.auth.canViewReports())("pointer-events-none", !ctx.auth.canViewReports());
            i0.ɵɵadvance(5);
            i0.ɵɵconditional((tmp_61_0 = ctx.selectedSopFilter()) ? 87 : -1, tmp_61_0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngClass", ctx.trendInfo().colorClass);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.trendInfo().icon);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.trendInfo().statusText);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.trendInfo().percentText);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate3(" (TB ", ctx.trendInfo().currentAvg, " m\u1EABu/ng\u00E0y so v\u1EDBi ", ctx.trendInfo().historyMean, " trong ", ctx.trendInfo().historyDays, " ng\u00E0y tr\u01B0\u1EDBc) ");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("initStart", ctx.startDate())("initEnd", ctx.endDate());
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(ctx.chartKpis().totalSamples);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.chartKpis().totalBatches);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.chartKpis().avgSamplesPerBatch);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.isLoading() ? 116 : 117);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.isLoading() ? 121 : 122);
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("ngModel", ctx.logSearchTerm());
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(i0.ɵɵpureFunction0(128, _c2));
            i0.ɵɵadvance(4);
            i0.ɵɵrepeater(ctx.recentLogsGrouped());
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(!ctx.auth.canViewSop() ? 141 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("opacity-20", !ctx.auth.canViewSop())("blur-sm", !ctx.auth.canViewSop())("pointer-events-none", !ctx.auth.canViewSop());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.auth.canViewSop() ? 143 : 144);
        } }, dependencies: [CommonModule, i1.NgClass, SkeletonComponent, FormsModule, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgModel, DateRangeFilterComponent], encapsulation: 2, changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(DashboardComponent, () => [import("../checklist/daily-checklist.component").then(m => m.DailyChecklistComponent)], DailyChecklistComponent => { i0.ɵsetClassMetadata(DashboardComponent, [{
        type: Component,
        args: [{ selector: 'app-dashboard', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [CommonModule, SkeletonComponent, FormsModule, DateRangeFilterComponent, DailyChecklistComponent], template: "    <div class=\"pb-20 fade-in font-sans\">\r\n        \r\n        <!-- HEADER: Welcome & Scan -->\r\n        <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm shrink-0\">\r\n            <div class=\"flex items-center gap-3\">\r\n                <div class=\"w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-sm shrink-0\">\r\n                    <i class=\"fa-solid fa-house text-base\"></i>\r\n                </div>\r\n                <div>\r\n                    <h1 class=\"text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight\">\r\n                        Xin Ch\u00E0o, <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400\">{{auth.currentUser()?.displayName}}</span>!\r\n                    </h1>\r\n                    <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">H\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD th\u00F4ng tin ph\u00F2ng th\u00ED nghi\u1EC7m (LIMS) \u0111\u00E3 s\u1EB5n s\u00E0ng.</p>\r\n                </div>\r\n            </div>\r\n            \r\n            <div class=\"flex gap-2 items-center\">\r\n                <!-- Compact Changelog Button -->\r\n                <button (click)=\"changelogService.open()\" \r\n                        title=\"Xem nh\u1EADt k\u00FD c\u1EADp nh\u1EADt phi\u00EAn b\u1EA3n h\u1EC7 th\u1ED1ng\"\r\n                        class=\"px-3.5 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-850 dark:to-slate-750 hover:from-blue-100 hover:to-indigo-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-slate-600 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95\">\r\n                    <i class=\"fa-solid fa-sparkles text-amber-500 animate-pulse text-[13px]\"></i>\r\n                    <span>Nh\u1EADt K\u00FD {{state.systemVersion()}}</span>\r\n                </button>\r\n\r\n                <!-- Calls Global Service (Hidden on md and larger screens) -->\r\n                <button (click)=\"qrService.startScan()\" class=\"md:hidden px-5 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-lg shadow-slate-300 dark:shadow-none hover:bg-black dark:hover:bg-slate-600 transition flex items-center gap-2 font-bold text-xs uppercase tracking-wide active:scale-95\">\r\n                    <i class=\"fa-solid fa-qrcode\"></i> Qu\u00E9t M\u00E3\r\n                </button>\r\n            </div>\r\n        </div>\r\n\r\n\r\n        <!-- SECTION 1: KPI CARDS -->\r\n        <div class=\"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6\">\r\n            <!-- Card 1: Pending Requests -->\n            <div class=\"relative h-32\">\n            <button type=\"button\" (click)=\"handlePendingRequestsClick()\"\n                 [disabled]=\"!auth.canViewSop() && !auth.canViewStandards()\"\n                 class=\"relative w-full text-left bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-4 flex flex-col justify-between h-32 overflow-hidden group border border-transparent dark:border-slate-700 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-not-allowed\"\n                 [class.cursor-pointer]=\"auth.canViewSop() || auth.canViewStandards()\" [class.hover:-translate-y-1]=\"auth.canViewSop() || auth.canViewStandards()\" [class.hover:border-purple-100]=\"auth.canViewSop() || auth.canViewStandards()\" [class.dark:hover:border-purple-500]=\"auth.canViewSop() || auth.canViewStandards()\">\n                \r\n                @if(!auth.canViewSop() && !auth.canViewStandards()) {\r\n                    <div class=\"absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400\">\r\n                        <i class=\"fa-solid fa-lock text-2xl mb-1\"></i>\r\n                        <span class=\"text-[10px] font-bold uppercase tracking-wider\">Kh\u00F4ng c\u00F3 quy\u1EC1n</span>\r\n                    </div>\r\n                }\r\n\r\n                <div class=\"flex justify-between items-start z-10\" [class.opacity-20]=\"!auth.canViewSop() && !auth.canViewStandards()\" [class.blur-sm]=\"!auth.canViewSop() && !auth.canViewStandards()\">\r\n                    <div>\r\n                        <p class=\"text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1\">\r\n                            {{(auth.canApprove() || auth.canApproveStandards()) ? 'Y\u00EAu c\u1EA7u ch\u1EDD duy\u1EC7t' : 'Y\u00EAu c\u1EA7u c\u1EE7a t\u00F4i'}}\r\n                        </p>\r\n                        <h4 class=\"text-2xl font-black text-gray-800 dark:text-slate-100\">\r\n                            @if(isLoading()) { <app-skeleton width=\"40px\" height=\"32px\"></app-skeleton> } @else { {{(auth.canViewSop() || auth.canViewStandards()) ? totalPendingRequests() : '--'}} }\r\n                        </h4>\r\n                    </div>\r\n                    <div class=\"w-12 h-12 rounded-xl bg-gradient-to-tl from-purple-700 to-pink-500 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform\" [class.grayscale]=\"!auth.canViewSop() && !auth.canViewStandards()\">\r\n                        <i class=\"fa-solid fa-clipboard-list text-lg\"></i>\r\n                    </div>\r\n                </div>\r\n                <div class=\"z-10\" [class.opacity-20]=\"!auth.canViewSop() && !auth.canViewStandards()\" [class.blur-sm]=\"!auth.canViewSop() && !auth.canViewStandards()\">\n                    <span class=\"text-xs font-bold\" \r\n                          [class.text-emerald-500]=\"totalPendingRequests() === 0\" \r\n                          [class.text-fuchsia-500]=\"totalPendingRequests() > 0\">\r\n                        {{totalPendingRequests() > 0 ? ((auth.canApprove() || auth.canApproveStandards()) ? '+ C\u1EA7n x\u1EED l\u00FD ngay' : '+ \u0110ang ch\u1EDD duy\u1EC7t') : 'Kh\u00F4ng c\u00F3 y\u00EAu c\u1EA7u'}}\r\n                    </span>\n                </div>\n            </button>\n\n                <!-- Popover -->\n                @if(showPendingRequestsPopover()) {\n                    <div class=\"absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md z-30 flex flex-col justify-center items-center p-3 gap-2 animate-fade-in rounded-2xl shadow-xl\">\r\n                        <p class=\"text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 w-full text-center\">Ch\u1ECDn lo\u1EA1i y\u00EAu c\u1EA7u</p>\r\n                        <button type=\"button\" (click)=\"$event.stopPropagation(); navTo('requests'); showPendingRequestsPopover.set(false)\"\n                                class=\"w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 font-bold py-1.5 rounded-lg text-xs flex justify-between px-3 items-center transition-colors\">\r\n                            <span>SOP</span>\r\n                            <span class=\"bg-indigo-200 dark:bg-indigo-700 px-2 py-0.5 rounded-full min-w-[20px] text-center\">{{pendingCounts().sop}}</span>\r\n                        </button>\r\n                        <button type=\"button\" (click)=\"$event.stopPropagation(); navTo('standard-requests'); showPendingRequestsPopover.set(false)\"\n                                class=\"w-full bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-800/50 text-orange-700 dark:text-orange-300 font-bold py-1.5 rounded-lg text-xs flex justify-between px-3 items-center transition-colors\">\r\n                            <span>Chu\u1EA9n</span>\r\n                            <span class=\"bg-orange-200 dark:bg-orange-700 px-2 py-0.5 rounded-full min-w-[20px] text-center\">{{pendingCounts().std}}</span>\r\n                        </button>\r\n                    </div>\r\n                }\r\n            </div>\n\n            <!-- Card 2: Low Stock -->\n            <button type=\"button\" (click)=\"navTo('inventory')\" [disabled]=\"!auth.canViewInventory()\"\n                 class=\"relative w-full text-left bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-4 flex flex-col justify-between h-32 overflow-hidden group border border-transparent dark:border-slate-700 transition-transform focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed\"\n                 [class.cursor-pointer]=\"auth.canViewInventory()\" [class.hover:-translate-y-1]=\"auth.canViewInventory()\" [class.hover:border-red-100]=\"auth.canViewInventory()\" [class.dark:hover:border-red-500]=\"auth.canViewInventory()\">\n                \r\n                @if(!auth.canViewInventory()) {\r\n                    <div class=\"absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400\">\r\n                        <i class=\"fa-solid fa-lock text-2xl mb-1\"></i>\r\n                        <span class=\"text-[10px] font-bold uppercase tracking-wider\">Kh\u00F4ng c\u00F3 quy\u1EC1n</span>\r\n                    </div>\r\n                }\r\n\r\n                <div class=\"flex justify-between items-start z-10\" [class.opacity-20]=\"!auth.canViewInventory()\" [class.blur-sm]=\"!auth.canViewInventory()\">\r\n                    <div>\r\n                        <p class=\"text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1\">C\u1EA3nh b\u00E1o Kho</p>\r\n                        <h4 class=\"text-2xl font-black text-gray-800 dark:text-slate-100\">\r\n                            @if(isLoading()) { <app-skeleton width=\"40px\" height=\"32px\"></app-skeleton> } @else { {{auth.canViewInventory() ? lowStockItems().length : '--'}} }\r\n                        </h4>\r\n                    </div>\r\n                    <div class=\"w-12 h-12 rounded-xl bg-gradient-to-tl from-red-600 to-rose-400 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform\" [class.grayscale]=\"!auth.canViewInventory()\">\r\n                        <i class=\"fa-solid fa-box-open text-lg\"></i>\r\n                    </div>\r\n                </div>\r\n                <div class=\"z-10\" [class.opacity-20]=\"!auth.canViewInventory()\" [class.blur-sm]=\"!auth.canViewInventory()\">\r\n                    @if(lowStockItems().length > 0) {\r\n                        <span class=\"text-xs font-bold text-red-500 dark:text-red-400\">M\u1EE5c d\u01B0\u1EDBi \u0111\u1ECBnh m\u1EE9c</span>\r\n                    } @else {\r\n                        <span class=\"text-xs font-bold text-emerald-500 dark:text-emerald-400\">Kho \u1ED5n \u0111\u1ECBnh</span>\r\n                    }\r\n                </div>\r\n            </button>\n\n            <!-- Card 3: Today's Activity -->\n            <button type=\"button\" (click)=\"navTo('stats')\" [disabled]=\"!auth.canViewReports()\"\n                 class=\"relative w-full text-left bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-4 flex flex-col justify-between h-32 overflow-hidden group border border-transparent dark:border-slate-700 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed\"\n                 [class.cursor-pointer]=\"auth.canViewReports()\" [class.hover:-translate-y-1]=\"auth.canViewReports()\" [class.hover:border-blue-100]=\"auth.canViewReports()\" [class.dark:hover:border-blue-500]=\"auth.canViewReports()\">\n                \r\n                @if(!auth.canViewReports()) {\r\n                    <div class=\"absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400\">\r\n                        <i class=\"fa-solid fa-lock text-2xl mb-1\"></i>\r\n                        <span class=\"text-[10px] font-bold uppercase tracking-wider\">Kh\u00F4ng c\u00F3 quy\u1EC1n</span>\r\n                    </div>\r\n                }\r\n\r\n                <div class=\"flex justify-between items-start z-10\" [class.opacity-20]=\"!auth.canViewReports()\" [class.blur-sm]=\"!auth.canViewReports()\">\r\n                    <div>\r\n                        <p class=\"text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1\">Ho\u1EA1t \u0111\u1ED9ng h\u00F4m nay</p>\r\n                        <h4 class=\"text-2xl font-black text-gray-800 dark:text-slate-100\">\r\n                            @if(isLoading()) { <app-skeleton width=\"40px\" height=\"32px\"></app-skeleton> } @else { {{auth.canViewReports() ? todayActivityCount() : '--'}} }\r\n                        </h4>\r\n                    </div>\r\n                    <div class=\"w-12 h-12 rounded-xl bg-gradient-to-tl from-blue-500 to-cyan-400 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform\" [class.grayscale]=\"!auth.canViewReports()\">\r\n                        <i class=\"fa-solid fa-bolt text-lg\"></i>\r\n                    </div>\r\n                </div>\r\n                <div class=\"z-10\" [class.opacity-20]=\"!auth.canViewReports()\" [class.blur-sm]=\"!auth.canViewReports()\">\r\n                    <span class=\"text-xs font-bold text-gray-400 dark:text-slate-500\">Ghi nh\u1EADn log h\u1EC7 th\u1ED1ng</span>\r\n                </div>\r\n            </button>\n\n            <!-- Card 4: Standards Priority -->\n            <button type=\"button\" (click)=\"navTo('standards')\" [disabled]=\"!auth.canViewStandards()\"\n                 class=\"relative w-full text-left bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-4 flex flex-col justify-between h-32 overflow-hidden group border border-transparent dark:border-slate-700 transition-transform focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed\"\n                 [class.cursor-pointer]=\"auth.canViewStandards()\" [class.hover:-translate-y-1]=\"auth.canViewStandards()\" [class.hover:border-orange-100]=\"auth.canViewStandards()\" [class.dark:hover:border-orange-500]=\"auth.canViewStandards()\">\n                \r\n                @if(!auth.canViewStandards()) {\r\n                    <div class=\"absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400\">\r\n                        <i class=\"fa-solid fa-lock text-2xl mb-1\"></i>\r\n                        <span class=\"text-[10px] font-bold uppercase tracking-wider\">Kh\u00F4ng c\u00F3 quy\u1EC1n</span>\r\n                    </div>\r\n                }\r\n\r\n                <div class=\"flex justify-between items-start z-10\" [class.opacity-20]=\"!auth.canViewStandards()\" [class.blur-sm]=\"!auth.canViewStandards()\">\r\n                    <div class=\"min-w-0 pr-2\">\r\n                        <p class=\"text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1\">Chu\u1EA9n s\u1EAFp h\u1EBFt h\u1EA1n</p>\r\n                        @if(priorityStandard(); as std) {\r\n                            <h4 class=\"text-sm font-bold text-gray-800 dark:text-slate-100 truncate leading-tight mt-1\" [title]=\"std.name\">{{std.name}}</h4>\r\n                        } @else {\r\n                            <h4 class=\"text-lg font-black text-gray-800 dark:text-slate-100\">An To\u00E0n</h4>\r\n                        }\r\n                    </div>\r\n                    <div class=\"w-12 h-12 rounded-xl bg-gradient-to-tl from-orange-500 to-yellow-400 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform\" [class.grayscale]=\"!auth.canViewStandards()\">\r\n                        <i class=\"fa-solid fa-clock text-lg\"></i>\r\n                    </div>\r\n                </div>\r\n                <div class=\"z-10\" [class.opacity-20]=\"!auth.canViewStandards()\" [class.blur-sm]=\"!auth.canViewStandards()\">\r\n                    @if(priorityStandard(); as std) {\r\n                        <span class=\"text-xs font-bold\" [ngClass]=\"{'text-red-500 dark:text-red-400': std.status === 'expired' || std.status === 'error', 'text-orange-500 dark:text-orange-400': std.status === 'warning'}\">\r\n                            {{std.status === 'error' ? 'L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u' : (std.daysLeft < 0 ? '\u0110\u00E3 h\u1EBFt h\u1EA1n' : 'C\u00F2n ' + std.daysLeft + ' ng\u00E0y')}}\r\n                        </span>\r\n                    } @else {\r\n                        <span class=\"text-xs font-bold text-emerald-500 dark:text-emerald-400\">T\u1EA5t c\u1EA3 c\u00F2n h\u1EA1n d\u00F9ng</span>\r\n                    }\r\n                </div>\r\n            </button>\n        </div>\r\n\r\n        <!-- SECTION 2: ANALYTICS & FEED -->\r\n        <div class=\"grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6\">\r\n            <!-- Left: Analytics (2/3) -->\r\n            <div class=\"lg:col-span-2 relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-5 overflow-hidden flex flex-col border border-slate-100 dark:border-slate-700 lg:h-[560px] h-auto\">\r\n                @if(!auth.canViewReports()) {\r\n                    <div class=\"absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400\">\r\n                        <i class=\"fa-solid fa-lock text-4xl mb-3\"></i>\r\n                        <span class=\"text-sm font-bold uppercase tracking-wider\">T\u00EDnh n\u0103ng y\u00EAu c\u1EA7u quy\u1EC1n truy c\u1EADp B\u00E1o c\u00E1o</span>\r\n                        <span class=\"text-xs mt-1\">Vui l\u00F2ng li\u00EAn h\u1EC7 Qu\u1EA3n tr\u1ECB vi\u00EAn</span>\r\n                    </div>\r\n                }\r\n\r\n                <div class=\"flex-1 flex flex-col\" [class.opacity-20]=\"!auth.canViewReports()\" [class.blur-sm]=\"!auth.canViewReports()\" [class.pointer-events-none]=\"!auth.canViewReports()\">\r\n                    <div class=\"flex flex-col xl:flex-row justify-between items-start xl:items-center mb-4 gap-4\">\r\n                        <div class=\"flex flex-wrap items-center gap-x-3 gap-y-1.5\">\r\n                            <h6 class=\"font-bold text-gray-700 dark:text-slate-200 capitalize text-lg shrink-0\">Hi\u1EC7u Su\u1EA5t Ph\u00E2n T\u00EDch</h6>\r\n                            <!-- SOP Active Filter Badge -->\r\n                            @if(selectedSopFilter(); as activeSop) {\r\n                                <button (click)=\"selectedSopFilter.set(null)\" \r\n                                     class=\"flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600 active:scale-95 transition-all shadow-sm shrink-0 border border-indigo-400/30\">\r\n                                    <span>L\u1ECDc: {{activeSop}}</span>\r\n                                    <i class=\"fa-solid fa-circle-xmark text-[10px] opacity-80 hover:opacity-100\"></i>\r\n                                </button>\r\n                            }\r\n                            <!-- Trend Badge -->\r\n                            <div class=\"flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50 shrink-0\" [ngClass]=\"trendInfo().colorClass\">\r\n                                <i class=\"fa-solid\" [class]=\"trendInfo().icon\"></i>\r\n                                <span>{{trendInfo().statusText}}</span>\r\n                                <span class=\"font-mono text-[10px] ml-0.5 opacity-90\">{{trendInfo().percentText}}</span>\r\n                            </div>\r\n                            <!-- Comparison context -->\r\n                            <span class=\"text-gray-400 dark:text-slate-500 font-medium text-[11px] shrink-0\">\r\n                                (TB {{trendInfo().currentAvg}} m\u1EABu/ng\u00E0y so v\u1EDBi {{trendInfo().historyMean}} trong {{trendInfo().historyDays}} ng\u00E0y tr\u01B0\u1EDBc)\r\n                            </span>\r\n                        </div>\r\n                        <!-- Date Filter Component -->\r\n                        <div class=\"shrink-0 w-full sm:w-auto\">\r\n                            <app-date-range-filter \r\n                                [initStart]=\"startDate()\" \r\n                                [initEnd]=\"endDate()\" \r\n                                (dateChange)=\"onDateRangeChange($event)\">\r\n                            </app-date-range-filter>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- KPIs Row -->\r\n                    <div class=\"grid grid-cols-3 gap-4 mb-4\">\r\n                        <div class=\"bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700 flex flex-col justify-center\">\r\n                            <p class=\"text-[10px] font-bold text-slate-500 uppercase\">T\u1ED5ng s\u1ED1 m\u1EABu</p>\r\n                            <h4 class=\"text-xl font-black text-indigo-600 dark:text-indigo-400\">{{chartKpis().totalSamples}}</h4>\r\n                        </div>\r\n                        <div class=\"bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700 flex flex-col justify-center\">\r\n                            <p class=\"text-[10px] font-bold text-slate-500 uppercase\">T\u1ED5ng s\u1ED1 m\u1EBB</p>\r\n                            <h4 class=\"text-xl font-black text-blue-600 dark:text-blue-400\">{{chartKpis().totalBatches}}</h4>\r\n                        </div>\r\n                        <div class=\"bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700 flex flex-col justify-center\">\r\n                            <p class=\"text-[10px] font-bold text-slate-500 uppercase\">Trung b\u00ECnh m\u1EABu/m\u1EBB</p>\r\n                            <h4 class=\"text-xl font-black text-emerald-600 dark:text-emerald-400\">{{chartKpis().avgSamplesPerBatch}}</h4>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- Charts Area -->\r\n                    <div class=\"flex-1 lg:h-[320px] md:h-[280px] h-auto grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0\">\r\n                        <div class=\"md:col-span-2 relative w-full min-h-[220px] md:h-full bg-gradient-to-b from-transparent to-gray-50/30 dark:to-slate-800/30 rounded-xl\">\r\n                            @if(isLoading()) {\r\n                                <div class=\"flex items-center justify-center h-full\"><app-skeleton width=\"100%\" height=\"100%\" shape=\"rect\"></app-skeleton></div>\r\n                            } @else {\r\n                                <canvas #activityChart></canvas>\r\n                            }\r\n                        </div>\r\n                        <div class=\"relative w-full h-full flex flex-col items-center justify-start min-h-0\">\r\n                            <h6 class=\"text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center w-full shrink-0\">Ph\u00E2n B\u1ED5 SOP</h6>\r\n                            @if(isLoading()) {\r\n                                <div class=\"flex items-center justify-center h-full w-full\"><app-skeleton width=\"150px\" height=\"150px\" shape=\"circle\"></app-skeleton></div>\r\n                            } @else {\r\n                                <div class=\"w-full flex-1 flex flex-col sm:flex-col lg:flex-row items-center justify-center gap-4 min-h-0\">\r\n                                    <div class=\"relative max-w-[130px] max-h-[130px] md:max-w-[140px] md:max-h-[140px] flex-shrink-0 flex items-center justify-center\">\r\n                                        <canvas #doughnutChart></canvas>\r\n                                    </div>\r\n                                    <div class=\"flex-1 w-full overflow-y-auto max-h-[110px] sm:max-h-[120px] lg:max-h-[150px] pr-1 custom-scrollbar\">\r\n                                        <div class=\"flex flex-col gap-1.5\">\r\n                                            @for (item of sopDistribution(); track item.name) {\r\n                                                <button (click)=\"toggleSopFilter(item.name)\"\r\n                                                     class=\"w-full flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 py-1 px-1.5 rounded-lg border border-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer transition-all last:border-b-0 focus:outline-none focus:ring-1 focus:ring-indigo-400\"\r\n                                                     [ngClass]=\"{ 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400': selectedSopFilter() === item.name }\">\r\n                                                    <div class=\"flex items-center gap-1.5 truncate mr-2\">\r\n                                                        <span class=\"w-2.5 h-2.5 rounded-full shrink-0 shadow-sm\" [style.backgroundColor]=\"item.color\"></span>\r\n                                                        <span class=\"truncate\" [title]=\"item.name\">{{item.name}}</span>\r\n                                                    </div>\r\n                                                    <span class=\"font-mono font-bold text-slate-700 dark:text-slate-200 shrink-0\">{{item.count}} <span class=\"text-[9px] font-normal text-slate-400\">({{item.percent}}%)</span></span>\r\n                                                </button>\r\n                                            } @empty {\r\n                                                <div class=\"text-center text-slate-400 dark:text-slate-500 italic text-[11px] py-4\">Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u.</div>\r\n                                            }\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            }\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Right Column -->\r\n            <div class=\"flex flex-col gap-4 lg:h-[560px] h-[360px]\">\r\n                <!-- Activity Feed -->\r\n                <div class=\"flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-4 overflow-hidden flex flex-col min-h-0 border border-slate-100 dark:border-slate-700\">\r\n                    <div class=\"flex flex-col gap-3 mb-4 shrink-0\">\r\n                        <div class=\"flex items-center justify-between\">\r\n                            <h6 class=\"font-bold text-gray-700 dark:text-slate-200 capitalize text-base\">Ho\u1EA1t \u0110\u1ED9ng G\u1EA7n \u0110\u00E2y</h6>\r\n                            <div class=\"relative w-1/2\">\r\n                                <i class=\"fa-solid fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs\"></i>\r\n                                <input type=\"text\" [ngModel]=\"logSearchTerm()\" (ngModelChange)=\"logSearchTerm.set($event)\" placeholder=\"T\u00ECm ki\u1EBFm...\" class=\"w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-lg pl-8 pr-2 py-1.5 focus:outline-none focus:border-blue-500 transition text-slate-700 dark:text-slate-300\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1\">\r\n                            @for(cat of ['ALL', 'SOP', 'STOCK', 'STANDARD', 'APPROVE', 'SYSTEM']; track cat) {\r\n                                <button (click)=\"logFilterCategory.set($any(cat))\" \r\n                                        class=\"px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap transition-all\"\r\n                                        [ngClass]=\"logFilterCategory() === cat ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'\">\r\n                                    {{cat === 'ALL' ? 'T\u1EA5t c\u1EA3' : cat === 'SOP' ? 'K\u1EBFt qu\u1EA3' : cat === 'STOCK' ? 'Kho' : cat === 'STANDARD' ? 'Chu\u1EA9n' : cat === 'APPROVE' ? 'Duy\u1EC7t' : 'H\u1EC7 th\u1ED1ng'}}\r\n                                </button>\r\n                            }\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2\">\r\n                        <div class=\"relative border-l border-gray-100 dark:border-slate-700/50 ml-4 space-y-6 pb-2\">\r\n                            @for (group of recentLogsGrouped(); track group.dateStr) {\r\n                                <div class=\"relative\">\r\n                                    <div class=\"sticky top-0 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm py-1 -ml-6 pl-6 mb-3\">\r\n                                        <span class=\"text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm\">{{group.dateStr}}</span>\r\n                                    </div>\r\n                                    <div class=\"space-y-5\">\r\n                                        @for (log of group.logs; track log.id) {\r\n                                            @let iconMeta = getLogIcon(log.action);\r\n                                            <div class=\"relative pl-6 group\">\r\n                                                <div class=\"absolute -left-[14px] top-1 w-7 h-7 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center {{iconMeta.bg}} z-0\">\r\n                                                    <i class=\"fa-solid {{iconMeta.icon}} text-[10px] {{iconMeta.text}}\"></i>\r\n                                                </div>\r\n                                                <div class=\"flex flex-col bg-transparent group-hover:bg-slate-50/50 dark:group-hover:bg-slate-700/20 rounded-xl p-1.5 -ml-1.5 transition-colors\">\r\n                                                    <div class=\"text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-1\">{{getTimeDiff(log.timestamp)}}</div>\r\n                                                    <div class=\"flex items-start gap-3\">\r\n                                                        <img [src]=\"getAvatar(log.user)\" class=\"w-8 h-8 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm object-cover bg-white dark:bg-slate-800 shrink-0\" alt=\"Avatar\">\r\n                                                        <div class=\"flex-1 min-w-0\">\r\n                                                            <div class=\"text-xs font-bold text-gray-700 dark:text-slate-300 leading-tight\">\r\n                                                                <span class=\"text-gray-900 dark:text-slate-100\">{{log.user}}</span> \r\n                                                                <span class=\"font-normal text-[10px] text-gray-500 dark:text-slate-400 ml-1 inline-block\">{{getLogActionText(log.action)}}</span>\r\n                                                            </div>\r\n                                                            <div class=\"text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-3 bg-white dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 font-medium shadow-sm leading-relaxed whitespace-pre-wrap\">\r\n                                                                {{log.details}}\r\n                                                            </div>\r\n                                                            @if (log.requestId) {\r\n                                                                <div class=\"mt-2 flex gap-2\">\r\n                                                                    <button (click)=\"navTo('traceability/' + log.requestId)\" class=\"text-[9px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 font-bold transition shadow-xs active:scale-95 flex items-center\">\r\n                                                                        <i class=\"fa-solid fa-qrcode mr-1\"></i> Truy Xu\u1EA5t\r\n                                                                    </button>\r\n                                                                    @if (log.action && (log.action.includes('RESULT') || log.action === 'PUBLISH_RESULT_REPORT' || log.action === 'DIRECT_APPROVE' || log.action === 'APPROVE_REQUEST')) {\r\n                                                                        <button (click)=\"navTo('results/' + log.requestId)\" class=\"text-[9px] bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 px-2.5 py-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/55 font-bold transition shadow-xs active:scale-95 flex items-center\">\r\n                                                                            <i class=\"fa-solid fa-vial mr-1\"></i> K\u1EBFt Qu\u1EA3\r\n                                                                        </button>\r\n                                                                    }\r\n                                                                </div>\r\n                                                            }\r\n                                                        </div>\r\n                                                    </div>\r\n                                                </div>\r\n                                            </div>\r\n                                        }\r\n                                    </div>\r\n                                </div>\r\n                            } @empty {\r\n                                <div class=\"text-center text-gray-400 dark:text-slate-500 text-sm py-10 flex flex-col items-center justify-center\">\r\n                                    <i class=\"fa-solid fa-inbox text-3xl mb-2 opacity-50\"></i>\r\n                                    <span>Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u.</span>\r\n                                </div>\r\n                            }\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- SECTION 3: B\u1EA2NG THEO D\u00D5I M\u1EAAU NG\u00C0Y -->\r\n        <div class=\"mb-6 relative\">\r\n            @if(!auth.canViewSop()) {\r\n                <div class=\"absolute inset-0 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 rounded-2xl\">\r\n                    <i class=\"fa-solid fa-lock text-4xl mb-3\"></i>\r\n                    <span class=\"text-sm font-bold uppercase tracking-wider\">T\u00EDnh n\u0103ng y\u00EAu c\u1EA7u quy\u1EC1n truy c\u1EADp V\u1EADn h\u00E0nh SOP</span>\r\n                    <span class=\"text-xs mt-1\">Vui l\u00F2ng li\u00EAn h\u1EC7 Qu\u1EA3n tr\u1ECB vi\u00EAn</span>\r\n                </div>\r\n            }\r\n\r\n            <div [class.opacity-20]=\"!auth.canViewSop()\" [class.blur-sm]=\"!auth.canViewSop()\" [class.pointer-events-none]=\"!auth.canViewSop()\">\r\n                @if (auth.canViewSop()) {\r\n                    @defer (on viewport) {\r\n                        <app-daily-checklist [embedded]=\"true\"></app-daily-checklist>\r\n                    } @placeholder {\r\n                        <div class=\"min-h-48 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400\">\r\n                            <div class=\"flex items-center gap-3 text-sm font-bold\">\r\n                                <i class=\"fa-solid fa-list-check\"></i>\r\n                                <span>B\u1EA3ng theo d\u00F5i m\u1EABu s\u1EBD t\u1EA3i khi cu\u1ED9n \u0111\u1EBFn \u0111\u00E2y</span>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n                } @else {\r\n                    <div class=\"min-h-48 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800\"></div>\r\n                }\r\n            </div>\r\n        </div>\r\n" }]
    }], () => [], null); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/features/dashboard/dashboard.component.ts", lineNumber: 47 }); })();
//# sourceMappingURL=dashboard.component.js.map