import { ChangeDetectionStrategy, Component, inject, signal, computed, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { StatsService } from '../../core/services/stats.service';
import { InventoryService } from '../../features/inventory/inventory.service';
import { formatDate, formatNum, cleanName, getAvatarUrl } from '../../shared/utils/utils';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import { ExportModalComponent } from '../../shared/components/export-modal/export-modal.component';
import { timestampToDate, timestampToMillis } from '../../shared/utils/timestamp';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = ["barChartCanvas"];
const _c1 = ["pieChartCanvas"];
const _c2 = ["lineChartCanvas"];
const _c3 = (a0, a1, a2, a3, a4, a5) => ({ "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800": a0, "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800": a1, "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800": a2, "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800": a3, "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800": a4, "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800": a5 });
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.name;
function StatisticsComponent_Conditional_0_For_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 18);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sop_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", sop_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(sop_r3.name);
} }
function StatisticsComponent_Conditional_0_Conditional_25_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.backfillProgressText(), " ");
} }
function StatisticsComponent_Conditional_0_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_0_Conditional_25_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.runStatsBackfill()); });
    i0.ɵɵelement(1, "i", 37);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, StatisticsComponent_Conditional_0_Conditional_25_Conditional_3_Template, 2, 1, "div", 38);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.isBackfilling());
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-spin", ctx_r1.isBackfilling());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isBackfilling() ? "\u0110ang ch\u1EA1y..." : "C\u1EADp nh\u1EADt l\u1EA1i D\u1EEF li\u1EC7u (Backfill)", " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isBackfilling() && ctx_r1.backfillProgressText() ? 3 : -1);
} }
function StatisticsComponent_Conditional_0_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 39);
    i0.ɵɵtext(1, " 2. B\u00E1o c\u00E1o NXT (Kho) ");
} }
function StatisticsComponent_Conditional_0_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 40);
    i0.ɵɵtext(1, " 2. Chi ti\u1EBFt Xu\u1EA5t kho ");
} }
function StatisticsComponent_Conditional_0_Conditional_45_For_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 44)(1, "td", 45);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 46)(4, "span", 47);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "td", 48);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td", 46)(9, "div", 49);
    i0.ɵɵelement(10, "img", 50);
    i0.ɵɵelementStart(11, "span", 51);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const log_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.formatDate(log_r5.timestamp), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction6(7, _c3, log_r5.action.includes("APPROVE") && !log_r5.action.includes("RESULT"), (log_r5.action.includes("STOCK_IN") || log_r5.action.includes("UPDATE") || log_r5.action.includes("CREATE") || log_r5.action.includes("RETURN_STANDARD") || log_r5.action === "PUBLISH_RESULT_REPORT") && !log_r5.action.includes("DELETE") && !log_r5.action.includes("REJECT"), log_r5.action.includes("STOCK_OUT") || log_r5.action.includes("REQUEST_STANDARD") || log_r5.action.includes("ASSIGN_STANDARD") || log_r5.action === "REVERT_RESULT_DRAFT", log_r5.action.includes("DELETE") || log_r5.action.includes("REVOKE") || log_r5.action.includes("REJECT") || log_r5.action === "RESET_RESULT_DATA", log_r5.action === "SAVE_RESULT_DRAFT", log_r5.action === "RESTORE_RESULT_BACKUP" || log_r5.action === "RESTORE_RESULT_VERSION"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.getLogActionText(log_r5.action), " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", log_r5.details);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", log_r5.details, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("src", ctx_r1.getAvatarUrl(log_r5.user, ctx_r1.state.getUserAvatarOptions(log_r5.user).style, ctx_r1.state.getUserAvatarOptions(log_r5.user).photoURL), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(log_r5.user);
} }
function StatisticsComponent_Conditional_0_Conditional_45_ForEmpty_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 52);
    i0.ɵɵtext(2, "Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u trong kho\u1EA3ng th\u1EDDi gian n\u00E0y.");
    i0.ɵɵelementEnd()();
} }
function StatisticsComponent_Conditional_0_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "table", 33)(1, "thead", 41)(2, "tr")(3, "th", 42);
    i0.ɵɵtext(4, "Ng\u00E0y/Gi\u1EDD");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "th", 42);
    i0.ɵɵtext(6, "Ho\u1EA1t \u0111\u1ED9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "th", 42);
    i0.ɵɵtext(8, "Chi ti\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "th", 42);
    i0.ɵɵtext(10, "Ng\u01B0\u1EDDi th\u1EF1c hi\u1EC7n");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "tbody", 43);
    i0.ɵɵrepeaterCreate(12, StatisticsComponent_Conditional_0_Conditional_45_For_13_Template, 13, 14, "tr", 44, _forTrack0, false, StatisticsComponent_Conditional_0_Conditional_45_ForEmpty_14_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(12);
    i0.ɵɵrepeater(ctx_r1.filteredLogs());
} }
function StatisticsComponent_Conditional_0_Conditional_46_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h3", 67);
    i0.ɵɵelement(1, "i", 68);
    i0.ɵɵtext(2, " B\u1EA3ng K\u00EA Nh\u1EADp - Xu\u1EA5t - T\u1ED3n ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 69);
    i0.ɵɵtext(4, "D\u1EEF li\u1EC7u to\u00E0n c\u1EE5c c\u1EE7a kho (theo ng\u00E0y th\u1EF1c t\u1EBF).");
    i0.ɵɵelementEnd();
} }
function StatisticsComponent_Conditional_0_Conditional_46_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h3", 67);
    i0.ɵɵelement(1, "i", 40);
    i0.ɵɵtext(2, " Chi Ti\u1EBFt Xu\u1EA5t Kho theo Quy Tr\u00ECnh ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 69);
    i0.ɵɵtext(4, "Ch\u1EC9 hi\u1EC3n th\u1ECB l\u01B0\u1EE3ng h\u00F3a ch\u1EA5t \u0111\u00E3 xu\u1EA5t cho SOP: ");
    i0.ɵɵelementStart(5, "span", 70);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.getSelectedSopName());
} }
function StatisticsComponent_Conditional_0_Conditional_46_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 58);
    i0.ɵɵelement(1, "div", 71);
    i0.ɵɵelementStart(2, "span", 72);
    i0.ɵɵtext(3, "\u0110ang t\u1EA3i v\u00E0 t\u1ED5ng h\u1EE3p d\u1EEF li\u1EC7u...");
    i0.ɵɵelementEnd()();
} }
function StatisticsComponent_Conditional_0_Conditional_46_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 73);
    i0.ɵɵtext(1, "T\u1ED3n \u0111\u1EA7u k\u1EF3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "th", 74);
    i0.ɵɵtext(3, "Nh\u1EADp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "th", 75);
    i0.ɵɵtext(5, "Xu\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th", 76);
    i0.ɵɵtext(7, "T\u1ED3n cu\u1ED1i k\u1EF3");
    i0.ɵɵelementEnd();
} }
function StatisticsComponent_Conditional_0_Conditional_46_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 64);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("T\u1ED5ng xu\u1EA5t (", ctx_r1.getSelectedSopName(), ")");
} }
function StatisticsComponent_Conditional_0_Conditional_46_For_24_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 83);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "td", 84);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "td", 85);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td", 86);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r7 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatNum(row_r7.startStock));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", row_r7.importQty > 0 ? "+" : "", "", ctx_r1.formatNum(row_r7.importQty), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", row_r7.exportQty > 0 ? "-" : "", "", ctx_r1.formatNum(row_r7.exportQty), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatNum(row_r7.endStock));
} }
function StatisticsComponent_Conditional_0_Conditional_46_For_24_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 82);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r7 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatNum(row_r7.exportQty));
} }
function StatisticsComponent_Conditional_0_Conditional_46_For_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 66)(1, "td", 77);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 78)(4, "div", 79);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 80);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 81);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, StatisticsComponent_Conditional_0_Conditional_46_For_24_Conditional_10_Template, 8, 6)(11, StatisticsComponent_Conditional_0_Conditional_46_For_24_Conditional_11_Template, 2, 1, "td", 82);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r7 = ctx.$implicit;
    const ɵ$index_225_r8 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ɵ$index_225_r8 + 1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(row_r7.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r7.id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r7.unit);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.selectedSopId() === "all" ? 10 : 11);
} }
function StatisticsComponent_Conditional_0_Conditional_46_ForEmpty_25_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Nh\u1EA5n \"T\u00EDnh To\u00E1n\" \u0111\u1EC3 xem b\u00E1o c\u00E1o. ");
} }
function StatisticsComponent_Conditional_0_Conditional_46_ForEmpty_25_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u. ");
} }
function StatisticsComponent_Conditional_0_Conditional_46_ForEmpty_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 87);
    i0.ɵɵtemplate(2, StatisticsComponent_Conditional_0_Conditional_46_ForEmpty_25_Conditional_2_Template, 1, 0)(3, StatisticsComponent_Conditional_0_Conditional_46_ForEmpty_25_Conditional_3_Template, 1, 0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵattribute("colspan", ctx_r1.selectedSopId() === "all" ? 7 : 4);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r1.hasGenerated() ? 2 : 3);
} }
function StatisticsComponent_Conditional_0_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 34)(1, "div", 53)(2, "div");
    i0.ɵɵtemplate(3, StatisticsComponent_Conditional_0_Conditional_46_Conditional_3_Template, 5, 0)(4, StatisticsComponent_Conditional_0_Conditional_46_Conditional_4_Template, 7, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 54)(6, "button", 55);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_0_Conditional_46_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.generateNxtReport()); });
    i0.ɵɵelement(7, "i", 56);
    i0.ɵɵtext(8, " T\u00EDnh To\u00E1n ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "div", 57);
    i0.ɵɵtemplate(10, StatisticsComponent_Conditional_0_Conditional_46_Conditional_10_Template, 4, 0, "div", 58);
    i0.ɵɵelementStart(11, "table", 59)(12, "thead", 60)(13, "tr")(14, "th", 61);
    i0.ɵɵtext(15, "#");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "th", 62);
    i0.ɵɵtext(17, "T\u00EAn h\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "th", 63);
    i0.ɵɵtext(19, "\u0110VT");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(20, StatisticsComponent_Conditional_0_Conditional_46_Conditional_20_Template, 8, 0)(21, StatisticsComponent_Conditional_0_Conditional_46_Conditional_21_Template, 2, 1, "th", 64);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "tbody", 65);
    i0.ɵɵrepeaterCreate(23, StatisticsComponent_Conditional_0_Conditional_46_For_24_Template, 12, 5, "tr", 66, _forTrack0, false, StatisticsComponent_Conditional_0_Conditional_46_ForEmpty_25_Template, 4, 2, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.selectedSopId() === "all" ? 3 : 4);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.isLoading());
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-spin", ctx_r1.isLoading());
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.isLoading() ? 10 : -1);
    i0.ɵɵadvance(10);
    i0.ɵɵconditional(ctx_r1.selectedSopId() === "all" ? 20 : 21);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.nxtData());
} }
function StatisticsComponent_Conditional_0_Conditional_47_For_44_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 107);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r9 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("(", item_r9.name, ")");
} }
function StatisticsComponent_Conditional_0_Conditional_47_For_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 66)(1, "td", 105);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 106);
    i0.ɵɵtext(4);
    i0.ɵɵtemplate(5, StatisticsComponent_Conditional_0_Conditional_47_For_44_Conditional_5_Template, 2, 1, "span", 107);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td", 108);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td", 109)(9, "span", 110);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r9 = ctx.$implicit;
    const ɵ$index_341_r10 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ɵ$index_341_r10 + 1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", item_r9.displayName, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r9.name !== item_r9.displayName ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatNum(item_r9.amount));
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.getUnitClass(item_r9.unit));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r9.unit);
} }
function StatisticsComponent_Conditional_0_Conditional_47_ForEmpty_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 52);
    i0.ɵɵtext(2, "Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u ti\u00EAu hao cho ti\u00EAu ch\u00ED l\u1ECDc n\u00E0y.");
    i0.ɵɵelementEnd()();
} }
function StatisticsComponent_Conditional_0_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35)(1, "div", 88)(2, "div", 89)(3, "div", 90)(4, "h4", 91);
    i0.ɵɵelement(5, "i", 92);
    i0.ɵɵtext(6, "Top 15 Ti\u00EAu Hao");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 93);
    i0.ɵɵelement(8, "canvas", null, 0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 89)(11, "div", 90)(12, "h4", 91);
    i0.ɵɵelement(13, "i", 94);
    i0.ɵɵtext(14, "Ph\u00E2n Lo\u1EA1i");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 93);
    i0.ɵɵelement(16, "canvas", null, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div", 89)(19, "div", 90)(20, "h4", 91);
    i0.ɵɵelement(21, "i", 95);
    i0.ɵɵtext(22, "Xu Th\u1EBF Ti\u00EAu Hao");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 93);
    i0.ɵɵelement(24, "canvas", null, 2);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(26, "div", 96)(27, "div", 97)(28, "h4", 98);
    i0.ɵɵtext(29, "Chi Ti\u1EBFt L\u01B0\u1EE3ng S\u1EED D\u1EE5ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "div", 99)(31, "table", 33)(32, "thead", 100)(33, "tr")(34, "th", 101);
    i0.ɵɵtext(35, "#");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "th", 102);
    i0.ɵɵtext(37, "T\u00EAn h\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "th", 103);
    i0.ɵɵtext(39, "T\u1ED5ng l\u01B0\u1EE3ng d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "th", 104);
    i0.ɵɵtext(41, "\u0110\u01A1n v\u1ECB");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(42, "tbody", 43);
    i0.ɵɵrepeaterCreate(43, StatisticsComponent_Conditional_0_Conditional_47_For_44_Template, 11, 7, "tr", 66, _forTrack1, false, StatisticsComponent_Conditional_0_Conditional_47_ForEmpty_45_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(43);
    i0.ɵɵrepeater(ctx_r1.consumptionData());
} }
function StatisticsComponent_Conditional_0_Conditional_48_For_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 66)(1, "td", 117);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 118);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 119)(6, "span", 120);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 119)(9, "span", 121);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "td", 122)(12, "div", 123)(13, "div", 124);
    i0.ɵɵelement(14, "div", 125);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "span", 126);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const item_r11 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r11.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r11.count);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r11.samples);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r11.qcs);
    i0.ɵɵadvance(4);
    i0.ɵɵstyleProp("width", item_r11.percent, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.formatNum(item_r11.percent), "%");
} }
function StatisticsComponent_Conditional_0_Conditional_48_ForEmpty_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 127);
    i0.ɵɵtext(2, "Ch\u01B0a ch\u1EA1y quy tr\u00ECnh n\u00E0o trong th\u1EDDi gian n\u00E0y.");
    i0.ɵɵelementEnd()();
} }
function StatisticsComponent_Conditional_0_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 34)(1, "div", 53)(2, "h3", 67);
    i0.ɵɵelement(3, "i", 29);
    i0.ɵɵtext(4, " Th\u1ED1ng K\u00EA T\u1EA7n Su\u1EA5t Quy Tr\u00ECnh ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 111)(6, "table", 33)(7, "thead", 112)(8, "tr")(9, "th", 113);
    i0.ɵɵtext(10, "Quy tr\u00ECnh (SOP)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "th", 109);
    i0.ɵɵtext(12, "S\u1ED1 l\u1EA7n ch\u1EA1y (Runs)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "th", 114);
    i0.ɵɵtext(14, "T\u1ED5ng s\u1ED1 m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "th", 115);
    i0.ɵɵtext(16, "T\u1ED5ng QC");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "th", 116);
    i0.ɵɵtext(18, "T\u1EF7 tr\u1ECDng");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(19, "tbody", 43);
    i0.ɵɵrepeaterCreate(20, StatisticsComponent_Conditional_0_Conditional_48_For_21_Template, 17, 7, "tr", 66, _forTrack1, false, StatisticsComponent_Conditional_0_Conditional_48_ForEmpty_22_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(20);
    i0.ɵɵrepeater(ctx_r1.sopFrequencyData());
} }
function StatisticsComponent_Conditional_0_Conditional_49_For_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 140)(1, "div", 141);
    i0.ɵɵelement(2, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "div", 98);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 142)(7, "span", 143);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span", 144);
    i0.ɵɵtext(10, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span", 145);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const log_r12 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.getLogActionIcon(log_r12.action));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(log_r12.details);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.formatDate(log_r12.timestamp));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(log_r12.user);
} }
function StatisticsComponent_Conditional_0_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35)(1, "div", 128)(2, "div", 129)(3, "div")(4, "div", 130);
    i0.ɵɵtext(5, "\u0110ang m\u01B0\u1EE3n / S\u1EED d\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 131);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 132);
    i0.ɵɵtext(9, "Chu\u1EA9n \u0111ang l\u01B0u \u0111\u1ED9ng ngo\u00E0i kho");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 133);
    i0.ɵɵelement(11, "i", 134);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "div", 135)(13, "div", 136)(14, "div", 97)(15, "h4", 137);
    i0.ɵɵtext(16, "Truy Xu\u1EA5t Ho\u1EA1t \u0110\u1ED9ng Tr\u1ECDng Y\u1EBFu");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 138)(18, "div", 139);
    i0.ɵɵrepeaterCreate(19, StatisticsComponent_Conditional_0_Conditional_49_For_20_Template, 13, 5, "div", 140, _forTrack0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.healthStats().borrowing);
    i0.ɵɵadvance(12);
    i0.ɵɵrepeater(ctx_r1.criticalLogs());
} }
function StatisticsComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 6)(2, "div", 7)(3, "div", 8);
    i0.ɵɵelement(4, "i", 9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div")(6, "h2", 10);
    i0.ɵɵtext(7, " B\u00E1o C\u00E1o Qu\u1EA3n Tr\u1ECB ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 11);
    i0.ɵɵtext(9, "Ph\u00E2n t\u00EDch hi\u1EC7u su\u1EA5t & ti\u00EAu hao theo th\u1EDDi gian th\u1EF1c.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(10, "div", 12)(11, "div", 13)(12, "div", 14);
    i0.ɵɵelement(13, "i", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "select", 16);
    i0.ɵɵlistener("ngModelChange", function StatisticsComponent_Conditional_0_Template_select_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectedSopId.set($event)); });
    i0.ɵɵelementStart(15, "option", 17);
    i0.ɵɵtext(16, "T\u1EA5t c\u1EA3 Quy tr\u00ECnh (SOP)");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(17, StatisticsComponent_Conditional_0_For_18_Template, 2, 2, "option", 18, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 19);
    i0.ɵɵelement(20, "i", 20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "app-date-range-filter", 21);
    i0.ɵɵlistener("dateChange", function StatisticsComponent_Conditional_0_Template_app_date_range_filter_dateChange_21_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDateRangeChange($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "button", 22);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_0_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openGlobalExport()); });
    i0.ɵɵelement(23, "i", 23);
    i0.ɵɵtext(24, " Xu\u1EA5t B\u00E1o C\u00E1o ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(25, StatisticsComponent_Conditional_0_Conditional_25_Template, 4, 5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "div", 24)(27, "div", 25)(28, "button", 26);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_0_Template_button_click_28_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("logs")); });
    i0.ɵɵelement(29, "i", 27);
    i0.ɵɵtext(30, " 1. Nh\u1EADt K\u00FD Ho\u1EA1t \u0110\u1ED9ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "button", 26);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_0_Template_button_click_31_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("nxt")); });
    i0.ɵɵtemplate(32, StatisticsComponent_Conditional_0_Conditional_32_Template, 2, 0)(33, StatisticsComponent_Conditional_0_Conditional_33_Template, 2, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "button", 26);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_0_Template_button_click_34_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("consumption")); });
    i0.ɵɵelement(35, "i", 28);
    i0.ɵɵtext(36, " 3. Ti\u00EAu Hao & Bi\u1EC3u \u0110\u1ED3 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "button", 26);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_0_Template_button_click_37_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("sops")); });
    i0.ɵɵelement(38, "i", 29);
    i0.ɵɵtext(39, " 4. T\u1EA7n Su\u1EA5t SOP ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "button", 26);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_0_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("standards")); });
    i0.ɵɵelement(41, "i", 30);
    i0.ɵɵtext(42, " 5. S\u1EE9c Kh\u1ECFe & Truy Xu\u1EA5t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(43, "div", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "div", 32);
    i0.ɵɵtemplate(45, StatisticsComponent_Conditional_0_Conditional_45_Template, 15, 1, "table", 33)(46, StatisticsComponent_Conditional_0_Conditional_46_Template, 26, 7, "div", 34)(47, StatisticsComponent_Conditional_0_Conditional_47_Template, 46, 1, "div", 35)(48, StatisticsComponent_Conditional_0_Conditional_48_Template, 23, 1, "div", 34)(49, StatisticsComponent_Conditional_0_Conditional_49_Template, 21, 1, "div", 35);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵproperty("ngModel", ctx_r1.selectedSopId());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.state.sops());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("initStart", ctx_r1.startDate())("initEnd", ctx_r1.endDate());
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(((tmp_5_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_5_0.role) === "manager" ? 25 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "logs" ? "border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "nxt" ? "border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.selectedSopId() === "all" ? 32 : 33);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "consumption" ? "border-orange-600 dark:border-orange-500 text-orange-700 dark:text-orange-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "sops" ? "border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "standards" ? "border-pink-600 dark:border-pink-500 text-pink-700 dark:text-pink-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300");
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.activeTab() === "logs" ? 45 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.activeTab() === "nxt" ? 46 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.activeTab() === "consumption" ? 47 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.activeTab() === "sops" ? 48 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.activeTab() === "standards" ? 49 : -1);
} }
function StatisticsComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4)(1, "div", 146)(2, "div", 147);
    i0.ɵɵelement(3, "i", 148);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "h3", 149);
    i0.ɵɵtext(5, "Quy\u1EC1n Truy C\u1EADp B\u1ECB t\u1EEB Ch\u1ED1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 150);
    i0.ɵɵtext(7, "B\u1EA1n kh\u00F4ng c\u00F3 quy\u1EC1n xem B\u00E1o c\u00E1o Qu\u1EA3n tr\u1ECB. Vui l\u00F2ng li\u00EAn h\u1EC7 Qu\u1EA3n l\u00FD (Manager) \u0111\u1EC3 \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 151);
    i0.ɵɵtext(9, " Quy\u1EC1n c\u1EA7n c\u00F3: ");
    i0.ɵɵelementStart(10, "b");
    i0.ɵɵtext(11, "REPORT_VIEW");
    i0.ɵɵelementEnd()()()();
} }
function StatisticsComponent_Conditional_2_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 153)(1, "div", 168);
    i0.ɵɵelement(2, "i", 169);
    i0.ɵɵtext(3, " M\u1EABu b\u00E1o c\u00E1o g\u1EE3i \u00FD");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 170)(5, "button", 171);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_1_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r14); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.applyPreset("monthly")); });
    i0.ɵɵelement(6, "i", 172);
    i0.ɵɵtext(7, " B\u00E1o C\u00E1o K\u1EBF Ho\u1EA1ch (NXT + TH) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "button", 173);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_1_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r14); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.applyPreset("detailed")); });
    i0.ɵɵelement(9, "i", 174);
    i0.ɵɵtext(10, " Ph\u00E2n T\u00EDch D\u1EEF Li\u1EC7u Chi Ti\u1EBFt ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 175);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_1_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r14); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.applyPreset("accounting")); });
    i0.ɵɵelement(12, "i", 176);
    i0.ɵɵtext(13, " D\u1EEF Li\u1EC7u K\u1EBF To\u00E1n v\u00E0 Mua H\u00E0ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 177);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_1_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r14); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.applyPreset("all")); });
    i0.ɵɵelement(15, "i", 178);
    i0.ɵɵtext(16, " Xu\u1EA5t T\u1EA5t C\u1EA3 ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r1.activePreset() === "monthly" ? "bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400" : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activePreset() === "detailed" ? "bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400" : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activePreset() === "accounting" ? "bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400" : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activePreset() === "all" ? "bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400" : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300");
} }
function StatisticsComponent_Conditional_2_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 155);
    i0.ɵɵelement(1, "i", 179);
    i0.ɵɵtext(2, " Ch\u1ECDn n\u1ED9i dung");
    i0.ɵɵelementEnd();
} }
function StatisticsComponent_Conditional_2_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 155);
    i0.ɵɵelement(1, "i", 180);
    i0.ɵɵtext(2, " \u0110ang xu\u1EA5t...");
    i0.ɵɵelementEnd();
} }
function StatisticsComponent_Conditional_2_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 162);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx_r1.nxtData().length || ctx_r1.state.inventory().length, " items");
} }
function StatisticsComponent_Conditional_2_Conditional_15_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 181);
} }
function StatisticsComponent_Conditional_2_Conditional_15_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 182);
} }
function StatisticsComponent_Conditional_2_Conditional_15_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 183);
} }
function StatisticsComponent_Conditional_2_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StatisticsComponent_Conditional_2_Conditional_15_Conditional_0_Template, 1, 0, "i", 181)(1, StatisticsComponent_Conditional_2_Conditional_15_Conditional_1_Template, 1, 0, "span", 182)(2, StatisticsComponent_Conditional_2_Conditional_15_Conditional_2_Template, 1, 0, "i", 183);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r1.exportProgress().nxt === "done" ? 0 : ctx_r1.exportProgress().nxt === "working" ? 1 : 2);
} }
function StatisticsComponent_Conditional_2_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 184);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(2, "i", 185);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx_r1.consumptionData().length, " items");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("rotate-180", ctx_r1.showConsumptionOptions());
} }
function StatisticsComponent_Conditional_2_Conditional_26_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 186);
} }
function StatisticsComponent_Conditional_2_Conditional_26_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 187);
} }
function StatisticsComponent_Conditional_2_Conditional_26_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 183);
} }
function StatisticsComponent_Conditional_2_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StatisticsComponent_Conditional_2_Conditional_26_Conditional_0_Template, 1, 0, "i", 186)(1, StatisticsComponent_Conditional_2_Conditional_26_Conditional_1_Template, 1, 0, "span", 187)(2, StatisticsComponent_Conditional_2_Conditional_26_Conditional_2_Template, 1, 0, "i", 183);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r1.exportProgress().consumption === "done" ? 0 : ctx_r1.exportProgress().consumption === "working" ? 1 : 2);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 191);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 192);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 191);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 192);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 191);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 192);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 191);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 192);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 142)(1, "span", 203);
    i0.ɵɵtext(2, "L\u1ECDc ng\u00E0y:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 204);
    i0.ɵɵlistener("input", function StatisticsComponent_Conditional_2_Conditional_27_Conditional_28_Template_input_input_3_listener($event) { i0.ɵɵrestoreView(_r16); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onSpecificDayChange($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 202);
    i0.ɵɵtext(5, "h\u00E0ng th\u00E1ng");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("value", ctx_r1.specificDay() || 1);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 200);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 200);
} }
function StatisticsComponent_Conditional_2_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 163)(1, "div", 188);
    i0.ɵɵtext(2, "Ch\u1EBF \u0111\u1ED9 xu\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 189)(4, "div", 190);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_27_Template_div_click_4_listener() { i0.ɵɵrestoreView(_r15); const ctx_r1 = i0.ɵɵnextContext(2); ctx_r1.exportType.set("summary"); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵtemplate(5, StatisticsComponent_Conditional_2_Conditional_27_Conditional_5_Template, 1, 0, "i", 191)(6, StatisticsComponent_Conditional_2_Conditional_27_Conditional_6_Template, 1, 0, "i", 192);
    i0.ɵɵelementStart(7, "span");
    i0.ɵɵelement(8, "i", 193);
    i0.ɵɵtext(9, "T\u1ED5ng h\u1EE3p");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 190);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_27_Template_div_click_10_listener() { i0.ɵɵrestoreView(_r15); const ctx_r1 = i0.ɵɵnextContext(2); ctx_r1.exportType.set("daily"); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵtemplate(11, StatisticsComponent_Conditional_2_Conditional_27_Conditional_11_Template, 1, 0, "i", 191)(12, StatisticsComponent_Conditional_2_Conditional_27_Conditional_12_Template, 1, 0, "i", 192);
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵelement(14, "i", 194);
    i0.ɵɵtext(15, "Theo ng\u00E0y");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 190);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_27_Template_div_click_16_listener() { i0.ɵɵrestoreView(_r15); const ctx_r1 = i0.ɵɵnextContext(2); ctx_r1.exportType.set("monthly"); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵtemplate(17, StatisticsComponent_Conditional_2_Conditional_27_Conditional_17_Template, 1, 0, "i", 191)(18, StatisticsComponent_Conditional_2_Conditional_27_Conditional_18_Template, 1, 0, "i", 192);
    i0.ɵɵelementStart(19, "span");
    i0.ɵɵelement(20, "i", 195);
    i0.ɵɵtext(21, "Theo th\u00E1ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 190);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_27_Template_div_click_22_listener() { i0.ɵɵrestoreView(_r15); const ctx_r1 = i0.ɵɵnextContext(2); ctx_r1.exportType.set("specific_day"); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵtemplate(23, StatisticsComponent_Conditional_2_Conditional_27_Conditional_23_Template, 1, 0, "i", 191)(24, StatisticsComponent_Conditional_2_Conditional_27_Conditional_24_Template, 1, 0, "i", 192);
    i0.ɵɵelementStart(25, "span");
    i0.ɵɵelement(26, "i", 196);
    i0.ɵɵtext(27, "Ng\u00E0y c\u1EE5 th\u1EC3");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(28, StatisticsComponent_Conditional_2_Conditional_27_Conditional_28_Template, 6, 1, "div", 142);
    i0.ɵɵelementStart(29, "div", 197)(30, "div", 198);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_27_Template_div_click_30_listener() { i0.ɵɵrestoreView(_r15); const ctx_r1 = i0.ɵɵnextContext(2); ctx_r1.excludeMargin.set(!ctx_r1.excludeMargin()); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵelementStart(31, "div", 199);
    i0.ɵɵtemplate(32, StatisticsComponent_Conditional_2_Conditional_27_Conditional_32_Template, 1, 0, "i", 200);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "div")(34, "div", 201);
    i0.ɵɵtext(35, "B\u1ECF qua Hao h\u1EE5t (Safety Margin)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div", 202);
    i0.ɵɵtext(37, "Xu\u1EA5t s\u1ED1 li\u1EC7u g\u1ED1c, kh\u00F4ng c\u1ED9ng th\u00EAm ph\u1EA7n hao h\u1EE5t");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(38, "div", 197)(39, "div", 198);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Conditional_27_Template_div_click_39_listener() { i0.ɵɵrestoreView(_r15); const ctx_r1 = i0.ɵɵnextContext(2); ctx_r1.exportPerSop.set(!ctx_r1.exportPerSop()); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵelementStart(40, "div", 199);
    i0.ɵɵtemplate(41, StatisticsComponent_Conditional_2_Conditional_27_Conditional_41_Template, 1, 0, "i", 200);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div")(43, "div", 201);
    i0.ɵɵtext(44, "T\u00E1ch ri\u00EAng theo t\u1EEBng SOP");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "div", 202);
    i0.ɵɵtext(46, "M\u1ED7i SOP = 1 sheet ri\u00EAng bi\u1EC7t trong t\u1EC7p Excel");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r1.exportType() === "summary" ? "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.exportType() === "summary" ? 5 : 6);
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r1.exportType() === "daily" ? "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.exportType() === "daily" ? 11 : 12);
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r1.exportType() === "monthly" ? "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.exportType() === "monthly" ? 17 : 18);
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r1.exportType() === "specific_day" ? "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.exportType() === "specific_day" ? 23 : 24);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.exportType() === "specific_day" ? 28 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.excludeMargin() ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800" : "border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.excludeMargin() ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 group-hover:border-amber-400");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.excludeMargin() ? 32 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.excludeMargin() ? "text-amber-700 dark:text-amber-400" : "text-slate-600 dark:text-slate-300");
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r1.exportPerSop() ? "bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800" : "border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportPerSop() ? "bg-violet-500 border-violet-500 text-white" : "border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 group-hover:border-violet-400");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.exportPerSop() ? 41 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.exportPerSop() ? "text-violet-700 dark:text-violet-400" : "text-slate-600 dark:text-slate-300");
} }
function StatisticsComponent_Conditional_2_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 164);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx_r1.sopFrequencyData().length, " SOPs");
} }
function StatisticsComponent_Conditional_2_Conditional_38_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 205);
} }
function StatisticsComponent_Conditional_2_Conditional_38_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 206);
} }
function StatisticsComponent_Conditional_2_Conditional_38_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 183);
} }
function StatisticsComponent_Conditional_2_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StatisticsComponent_Conditional_2_Conditional_38_Conditional_0_Template, 1, 0, "i", 205)(1, StatisticsComponent_Conditional_2_Conditional_38_Conditional_1_Template, 1, 0, "span", 206)(2, StatisticsComponent_Conditional_2_Conditional_38_Conditional_2_Template, 1, 0, "i", 183);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r1.exportProgress().sop === "done" ? 0 : ctx_r1.exportProgress().sop === "working" ? 1 : 2);
} }
function StatisticsComponent_Conditional_2_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 165);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx_r1.filteredLogs().length, " entries");
} }
function StatisticsComponent_Conditional_2_Conditional_49_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 207);
} }
function StatisticsComponent_Conditional_2_Conditional_49_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 208);
} }
function StatisticsComponent_Conditional_2_Conditional_49_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 183);
} }
function StatisticsComponent_Conditional_2_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StatisticsComponent_Conditional_2_Conditional_49_Conditional_0_Template, 1, 0, "i", 207)(1, StatisticsComponent_Conditional_2_Conditional_49_Conditional_1_Template, 1, 0, "span", 208)(2, StatisticsComponent_Conditional_2_Conditional_49_Conditional_2_Template, 1, 0, "i", 183);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r1.exportProgress().logs === "done" ? 0 : ctx_r1.exportProgress().logs === "working" ? 1 : 2);
} }
function StatisticsComponent_Conditional_2_Conditional_59_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 166);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx_r1.healthStats().borrowing, " records");
} }
function StatisticsComponent_Conditional_2_Conditional_60_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 209);
} }
function StatisticsComponent_Conditional_2_Conditional_60_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 210);
} }
function StatisticsComponent_Conditional_2_Conditional_60_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 183);
} }
function StatisticsComponent_Conditional_2_Conditional_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StatisticsComponent_Conditional_2_Conditional_60_Conditional_0_Template, 1, 0, "i", 209)(1, StatisticsComponent_Conditional_2_Conditional_60_Conditional_1_Template, 1, 0, "span", 210)(2, StatisticsComponent_Conditional_2_Conditional_60_Conditional_2_Template, 1, 0, "i", 183);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r1.exportProgress().standards === "done" ? 0 : ctx_r1.exportProgress().standards === "working" ? 1 : 2);
} }
function StatisticsComponent_Conditional_2_Conditional_61_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 167);
    i0.ɵɵelement(1, "i", 211);
    i0.ɵɵelementStart(2, "span", 212);
    i0.ɵɵtext(3, "Sheet \"Trang b\u00ECa\" v\u1EDBi KPIs t\u00F3m t\u1EAFt s\u1EBD t\u1EF1 \u0111\u1ED9ng \u0111\u01B0\u1EE3c th\u00EAm v\u00E0o file");
    i0.ɵɵelementEnd()();
} }
function StatisticsComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-export-modal", 152);
    i0.ɵɵlistener("close", function StatisticsComponent_Conditional_2_Template_app_export_modal_close_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showGlobalExportModal.set(false)); })("execute", function StatisticsComponent_Conditional_2_Template_app_export_modal_execute_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.runGlobalExport()); });
    i0.ɵɵtemplate(1, StatisticsComponent_Conditional_2_Conditional_1_Template, 17, 8, "div", 153);
    i0.ɵɵelementStart(2, "div", 154);
    i0.ɵɵtemplate(3, StatisticsComponent_Conditional_2_Conditional_3_Template, 3, 0, "div", 155)(4, StatisticsComponent_Conditional_2_Conditional_4_Template, 3, 0, "div", 155);
    i0.ɵɵelementStart(5, "div", 156)(6, "button", 157);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); !ctx_r1.isExporting() && ctx_r1.exportInventory.set(!ctx_r1.exportInventory()); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵelementStart(7, "div", 158);
    i0.ɵɵelement(8, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 159)(10, "div", 160);
    i0.ɵɵtext(11, "1. B\u00E1o C\u00E1o Nh\u1EADp - Xu\u1EA5t - T\u1ED3n (NXT)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 161);
    i0.ɵɵtext(13, "Bi\u1EBFn \u0110\u1ED9ng Kho Chi Ti\u1EBFt T\u1EEBng M\u1EB7t H\u00E0ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(14, StatisticsComponent_Conditional_2_Conditional_14_Template, 2, 1, "span", 162)(15, StatisticsComponent_Conditional_2_Conditional_15_Template, 3, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 156)(17, "button", 157);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(!ctx_r1.isExporting() && ctx_r1.toggleConsumption()); });
    i0.ɵɵelementStart(18, "div", 158);
    i0.ɵɵelement(19, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 159)(21, "div", 160);
    i0.ɵɵtext(22, "2. D\u1EEF Li\u1EC7u Ti\u00EAu Hao H\u00F3a Ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "div", 161);
    i0.ɵɵtext(24, "T\u1ED5ng H\u1EE3p L\u01B0\u1EE3ng D\u00F9ng D\u1EF1a tr\u00EAn Phi\u1EBFu \u0110\u00E3 Duy\u1EC7t");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(25, StatisticsComponent_Conditional_2_Conditional_25_Template, 3, 3)(26, StatisticsComponent_Conditional_2_Conditional_26_Template, 3, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(27, StatisticsComponent_Conditional_2_Conditional_27_Template, 47, 27, "div", 163);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div", 156)(29, "button", 157);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); !ctx_r1.isExporting() && ctx_r1.exportSop.set(!ctx_r1.exportSop()); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵelementStart(30, "div", 158);
    i0.ɵɵelement(31, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 159)(33, "div", 160);
    i0.ɵɵtext(34, "3. T\u1EA7n Su\u1EA5t Quy Tr\u00ECnh (SOP)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "div", 161);
    i0.ɵɵtext(36, "Th\u1ED1ng K\u00EA S\u1ED1 L\u1EA7n Ch\u1EA1y, M\u1EABu v\u00E0 QC");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(37, StatisticsComponent_Conditional_2_Conditional_37_Template, 2, 1, "span", 164)(38, StatisticsComponent_Conditional_2_Conditional_38_Template, 3, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(39, "div", 156)(40, "button", 157);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); !ctx_r1.isExporting() && ctx_r1.exportLogs.set(!ctx_r1.exportLogs()); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵelementStart(41, "div", 158);
    i0.ɵɵelement(42, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "div", 159)(44, "div", 160);
    i0.ɵɵtext(45, "4. Nh\u1EADt K\u00FD Ho\u1EA1t \u0110\u1ED9ng (Audit Log)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "div", 161);
    i0.ɵɵtext(47, "To\u00E0n B\u1ED9 Thao T\u00E1c trong Kho\u1EA3ng Th\u1EDDi Gian");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(48, StatisticsComponent_Conditional_2_Conditional_48_Template, 2, 1, "span", 165)(49, StatisticsComponent_Conditional_2_Conditional_49_Template, 3, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(50, "div", 156)(51, "button", 157);
    i0.ɵɵlistener("click", function StatisticsComponent_Conditional_2_Template_button_click_51_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); !ctx_r1.isExporting() && ctx_r1.exportStandards.set(!ctx_r1.exportStandards()); return i0.ɵɵresetView(ctx_r1.activePreset.set(null)); });
    i0.ɵɵelementStart(52, "div", 158);
    i0.ɵɵelement(53, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "div", 159)(55, "div", 160);
    i0.ɵɵtext(56, "5. T\u00ECnh Tr\u1EA1ng v\u00E0 Truy Xu\u1EA5t Ch\u1EA5t Chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "div", 161);
    i0.ɵɵtext(58, "Chu\u1EA9n \u0110ang M\u01B0\u1EE3n, Qu\u00E1 H\u1EA1n, H\u1EBFt H\u1EA1n");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(59, StatisticsComponent_Conditional_2_Conditional_59_Template, 2, 1, "span", 166)(60, StatisticsComponent_Conditional_2_Conditional_60_Template, 3, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(61, StatisticsComponent_Conditional_2_Conditional_61_Template, 4, 0, "div", 167);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("dateRangeText", ctx_r1.startDate() + " \u2192 " + ctx_r1.endDate())("subtitle", ctx_r1.selectedSopId() !== "all" ? "SOP: " + ctx_r1.getSelectedSopName() : "")("isExporting", ctx_r1.isExporting())("isCompleted", ctx_r1.exportProgress().cover === "done")("footerText", ctx_r1.getSelectedSheetsCount() + " sheet(s) s\u1EBD \u0111\u01B0\u1EE3c xu\u1EA5t")("isSubmitDisabled", ctx_r1.getSelectedSheetsCount() === 0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r1.isExporting() ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!ctx_r1.isExporting() ? 3 : 4);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.exportInventory() ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportInventory() ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportInventory() ? "fa-solid fa-check" : "fa-solid fa-boxes-packing");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.exportInventory() ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-300");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.exportInventory() ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isExporting() ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportConsumption() ? "border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-900/10" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportConsumption() ? "bg-orange-500 text-white shadow-orange-200" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportConsumption() ? "fa-solid fa-check" : "fa-solid fa-flask");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.exportConsumption() ? "text-orange-700 dark:text-orange-400" : "text-slate-600 dark:text-slate-300");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.exportConsumption() ? 25 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isExporting() ? 26 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.exportConsumption() && ctx_r1.showConsumptionOptions() && !ctx_r1.isExporting() ? 27 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportSop() ? "border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/10" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportSop() ? "bg-purple-500 text-white shadow-purple-200" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportSop() ? "fa-solid fa-check" : "fa-solid fa-list-ol");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.exportSop() ? "text-purple-700 dark:text-purple-400" : "text-slate-600 dark:text-slate-300");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.exportSop() ? 37 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isExporting() ? 38 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportLogs() ? "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportLogs() ? "bg-blue-500 text-white shadow-blue-200" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportLogs() ? "fa-solid fa-check" : "fa-solid fa-clock-rotate-left");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.exportLogs() ? "text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-300");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.exportLogs() ? 48 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isExporting() ? 49 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportStandards() ? "border-pink-200 dark:border-pink-800 bg-pink-50/30 dark:bg-pink-900/10" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportStandards() ? "bg-pink-500 text-white shadow-pink-200" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportStandards() ? "fa-solid fa-check" : "fa-solid fa-heart-pulse");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.exportStandards() ? "text-pink-700 dark:text-pink-400" : "text-slate-600 dark:text-slate-300");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.exportStandards() ? 59 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isExporting() ? 60 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r1.isExporting() ? 61 : -1);
} }
export class StatisticsComponent {
    getLogActionText(action) {
        if (action === 'SAVE_RESULT_DRAFT')
            return 'Lưu nháp kết quả';
        if (action === 'PUBLISH_RESULT_REPORT')
            return 'Xuất bản báo cáo';
        if (action === 'REVERT_RESULT_DRAFT')
            return 'Hủy xuất bản báo cáo';
        if (action === 'RESET_RESULT_DATA')
            return 'Reset số liệu mẻ';
        if (action === 'RESTORE_RESULT_BACKUP')
            return 'Khôi phục từ bản backup';
        if (action === 'RESTORE_RESULT_VERSION')
            return 'Rollback phiên bản cũ';
        if (action === 'DIRECT_APPROVE')
            return 'Duyệt & xếp hàng in';
        if (action === 'REQUEST_STANDARD' || action === 'CREATE_STANDARD_REQUEST')
            return 'Yêu cầu mượn chuẩn';
        if (action === 'APPROVE_STANDARD_REQUEST')
            return 'Duyệt mượn chuẩn';
        if (action === 'REJECT_STANDARD_REQUEST')
            return 'Từ chối mượn chuẩn';
        if (action === 'REPORT_RETURN_STANDARD')
            return 'Báo cáo trả chuẩn';
        if (action === 'RETURN_STANDARD')
            return 'Nhận lại chuẩn';
        if (action === 'ASSIGN_STANDARD')
            return 'Gán chuẩn cho mượn';
        if (action.includes('APPROVE'))
            return 'Duyệt yêu cầu';
        if (action.includes('STOCK_IN'))
            return 'Nhập kho';
        if (action.includes('STOCK_OUT'))
            return 'Xuất kho';
        if (action.includes('CREATE'))
            return 'Tạo mới';
        if (action.includes('DELETE'))
            return 'Xóa';
        return 'Cập nhật';
    }
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
    toggleConsumption() {
        if (this.exportConsumption()) {
            // If already on and options showing, toggle off
            if (this.showConsumptionOptions()) {
                this.exportConsumption.set(false);
                this.showConsumptionOptions.set(true);
            }
            else {
                this.showConsumptionOptions.set(true);
            }
        }
        else {
            this.exportConsumption.set(true);
            this.showConsumptionOptions.set(true);
        }
        this.activePreset.set(null);
    }
    getSelectedSheetsCount() {
        let count = 0;
        if (this.exportInventory())
            count++;
        if (this.exportConsumption())
            count++;
        if (this.exportSop())
            count++;
        if (this.exportLogs())
            count++;
        if (this.exportStandards())
            count++;
        count++; // Cover sheet always included
        return count;
    }
    applyPreset(preset) {
        this.activePreset.set(preset);
        switch (preset) {
            case 'monthly':
                this.exportInventory.set(true);
                this.exportConsumption.set(true);
                this.exportSop.set(true);
                this.exportLogs.set(false);
                this.exportStandards.set(false);
                this.exportPerSop.set(false);
                this.exportType.set('summary');
                this.excludeMargin.set(false);
                break;
            case 'detailed':
                this.exportInventory.set(true);
                this.exportConsumption.set(true);
                this.exportSop.set(true);
                this.exportLogs.set(true);
                this.exportStandards.set(true);
                this.exportPerSop.set(false);
                this.exportType.set('daily');
                this.excludeMargin.set(false);
                break;
            case 'accounting':
                this.exportInventory.set(false);
                this.exportConsumption.set(true);
                this.exportSop.set(false);
                this.exportLogs.set(false);
                this.exportStandards.set(false);
                this.exportPerSop.set(false);
                this.exportType.set('summary');
                this.excludeMargin.set(true);
                break;
            case 'all':
                this.exportInventory.set(true);
                this.exportConsumption.set(true);
                this.exportSop.set(true);
                this.exportLogs.set(true);
                this.exportStandards.set(true);
                this.exportPerSop.set(true);
                this.exportType.set('daily');
                this.excludeMargin.set(false);
                break;
        }
    }
    openGlobalExport() {
        this.isExporting.set(false);
        this.exportProgress.set({ nxt: 'pending', consumption: 'pending', sop: 'pending', logs: 'pending', standards: 'pending', cover: 'pending' });
        this.showGlobalExportModal.set(true);
    }
    // --- Professional Excel Formatting Helper ---
    formatSheet(ws, XLSX, headerRowIndex, dataLength, colWidths) {
        // Set column widths
        ws['!cols'] = colWidths.map(w => ({ wch: w }));
        // Set row heights for header area
        ws['!rows'] = [];
        for (let i = 0; i < headerRowIndex; i++) {
            ws['!rows'].push({ hpx: i === 0 ? 28 : 18 });
        }
        // Merge title cell across columns
        if (!ws['!merges'])
            ws['!merges'] = [];
        const maxCol = colWidths.length - 1;
        ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: Math.min(maxCol, 5) } });
    }
    async runGlobalExport() {
        this.isExporting.set(true);
        this.exportProgress.set({ nxt: 'pending', consumption: 'pending', sop: 'pending', logs: 'pending', standards: 'pending', cover: 'pending' });
        // Small delay to let Angular render the initial exporting state
        await new Promise(r => setTimeout(r, 100));
        try {
            const XLSX = await import('xlsx');
            const wb = XLSX.utils.book_new();
            const start = this.startDate();
            const end = this.endDate();
            const currentUser = this.auth.currentUser();
            const sopId = this.selectedSopId();
            const exportInfo = [
                ["BÁO CÁO TỔNG HỢP HỆ THỐNG LIMS"],
                [`Thời gian: ${start} đến ${end}`],
                [`Người xuất: ${currentUser?.displayName || currentUser?.email || 'Admin'}`],
                [`Ngày xuất: ${new Date().toLocaleString('vi-VN')}`],
                [`SOP: ${sopId === 'all' ? 'Tất cả quy trình' : this.getSelectedSopName()}`],
                []
            ];
            const sheetsAdded = [];
            // ===== 1. NXT =====
            if (this.exportInventory()) {
                this.exportProgress.update(p => ({ ...p, nxt: 'working' }));
                await new Promise(r => setTimeout(r, 50));
                await this.generateNxtReport();
                const nxtRows = this.nxtData();
                if (sopId === 'all') {
                    const data = nxtRows.map((row, index) => ({
                        'STT': index + 1, 'Mã định danh': row.id, 'Tên hàng': row.name, 'ĐVT': row.unit, 'Phân loại': row.category,
                        'Tồn đầu kỳ': row.startStock, 'Nhập trong kỳ': row.importQty, 'Xuất trong kỳ': row.exportQty, 'Tồn cuối kỳ': row.endStock
                    }));
                    const ws = XLSX.utils.json_to_sheet([]);
                    XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["BÁO CÁO NHẬP - XUẤT - TỒN (KHO)"]], { origin: "A1" });
                    XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                    this.formatSheet(ws, XLSX, 8, data.length, [6, 20, 35, 10, 18, 14, 14, 14, 14]);
                    XLSX.utils.book_append_sheet(wb, ws, "NXT");
                    sheetsAdded.push("NXT");
                }
                else {
                    const data = nxtRows.map((row, index) => ({
                        'STT': index + 1, 'Mã định danh': row.id, 'Tên hàng': row.name, 'ĐVT': row.unit,
                        'Tổng lượng xuất': row.exportQty
                    }));
                    const ws = XLSX.utils.json_to_sheet([]);
                    XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [`CHI TIẾT XUẤT KHO - ${this.getSelectedSopName()}`]], { origin: "A1" });
                    XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                    this.formatSheet(ws, XLSX, 8, data.length, [6, 20, 35, 10, 16]);
                    XLSX.utils.book_append_sheet(wb, ws, "Xuất SOP");
                    sheetsAdded.push("Xuất SOP");
                }
                this.exportProgress.update(p => ({ ...p, nxt: 'done' }));
                await new Promise(r => setTimeout(r, 200));
            }
            // ===== 2. CONSUMPTION (Full logic from exportConsumptionExcel) =====
            if (this.exportConsumption()) {
                this.exportProgress.update(p => ({ ...p, consumption: 'working' }));
                await new Promise(r => setTimeout(r, 50));
                const history = this.state.approvedRequests();
                const startD = new Date(start);
                startD.setHours(0, 0, 0, 0);
                const endD = new Date(end);
                endD.setHours(23, 59, 59, 999);
                const type = this.exportType();
                const specDay = this.specificDay();
                const useBaseAmount = this.excludeMargin();
                const safetyConfig = this.state.safetyConfig();
                const inventoryMap = new Map(this.state.inventory().map((i) => [i.name, i]));
                const getCalculatedItemAmount = (item, reqMargin) => {
                    if (!useBaseAmount)
                        return item.amount;
                    if (item.baseAmount !== undefined)
                        return item.baseAmount;
                    if (reqMargin > 0) {
                        return item.amount / (1 + reqMargin / 100);
                    }
                    else if (reqMargin < 0) {
                        const invItem = inventoryMap.get(item.name);
                        let appliedMargin = 10;
                        if (safetyConfig && invItem && invItem.category && safetyConfig.rules[invItem.category] !== undefined) {
                            appliedMargin = safetyConfig.rules[invItem.category];
                        }
                        else if (safetyConfig && safetyConfig.defaultMargin !== undefined) {
                            appliedMargin = safetyConfig.defaultMargin;
                        }
                        return item.amount / (1 + appliedMargin / 100);
                    }
                    return item.amount;
                };
                // Filter requests
                const filteredHistory = history.filter((req) => {
                    const d = this.getRequestDate(req);
                    if (!d)
                        return false;
                    if (d < startD || d > endD)
                        return false;
                    if (sopId !== 'all' && req.sopId !== sopId)
                        return false;
                    if (type === 'specific_day' && d.getDate() !== specDay)
                        return false;
                    return true;
                });
                // Build consumption data based on type
                if (type === 'summary' || type === 'specific_day') {
                    const map = new Map();
                    filteredHistory.forEach((req) => {
                        const reqMargin = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                        req.items.forEach((item) => {
                            const itemAmount = getCalculatedItemAmount(item, reqMargin);
                            const current = map.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
                            map.set(item.name, { amount: current.amount + itemAmount, unit: current.unit, displayName: item.displayName || current.displayName || item.name });
                        });
                    });
                    const sortedData = Array.from(map.entries())
                        .map(([id, val]) => ({ name: id, displayName: val.displayName, amount: val.amount, unit: val.unit }))
                        .sort((a, b) => b.amount - a.amount);
                    const data = sortedData.map((row, i) => ({
                        'STT': i + 1, 'Mã hóa chất/vật tư': row.name, 'Tên hóa chất/Vật tư': row.displayName,
                        'Tổng tiêu hao': parseFloat(row.amount.toFixed(3)), 'ĐVT': row.unit
                    }));
                    const sheetTitle = type === 'specific_day' ? `TIÊU HAO - LỌC NGÀY ${specDay}` : "DỮ LIỆU TIÊU HAO HÓA CHẤT (TỔNG HỢP)";
                    const ws = XLSX.utils.json_to_sheet([]);
                    XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [sheetTitle]], { origin: "A1" });
                    XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                    this.formatSheet(ws, XLSX, 8, data.length, [6, 22, 35, 16, 10]);
                    XLSX.utils.book_append_sheet(wb, ws, type === 'specific_day' ? `Ngay_${specDay}` : "TieuHao_TongHop");
                    sheetsAdded.push("Tiêu hao");
                }
                else if (type === 'daily' || type === 'monthly') {
                    const pivotMap = new Map();
                    const columnsSet = new Set();
                    filteredHistory.forEach((req) => {
                        const d = this.getRequestDate(req);
                        if (!d)
                            return;
                        let colKey = '';
                        if (type === 'daily') {
                            colKey = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
                        }
                        else {
                            colKey = `T${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                        }
                        columnsSet.add(colKey);
                        const reqMargin = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                        req.items.forEach((item) => {
                            const itemAmount = getCalculatedItemAmount(item, reqMargin);
                            if (!pivotMap.has(item.name)) {
                                pivotMap.set(item.name, { displayName: item.displayName || item.name, unit: item.stockUnit || item.unit, totals: {}, grandTotal: 0 });
                            }
                            const record = pivotMap.get(item.name);
                            record.totals[colKey] = (record.totals[colKey] || 0) + itemAmount;
                            record.grandTotal += itemAmount;
                        });
                    });
                    const sortedColumns = Array.from(columnsSet).sort((a, b) => {
                        if (type === 'daily') {
                            const [d1, m1] = a.split('/');
                            const [d2, m2] = b.split('/');
                            if (m1 !== m2)
                                return parseInt(m1) - parseInt(m2);
                            return parseInt(d1) - parseInt(d2);
                        }
                        else {
                            const [m1, y1] = a.replace('T', '').split('/');
                            const [m2, y2] = b.replace('T', '').split('/');
                            if (y1 !== y2)
                                return parseInt(y1) - parseInt(y2);
                            return parseInt(m1) - parseInt(m2);
                        }
                    });
                    const sortedRows = Array.from(pivotMap.entries()).sort((a, b) => b[1].grandTotal - a[1].grandTotal);
                    const data = sortedRows.map(([id, val], i) => {
                        const rowObj = { 'STT': i + 1, 'Mã': id, 'Tên': val.displayName, 'ĐVT': val.unit, 'Tổng cộng': parseFloat(val.grandTotal.toFixed(3)) };
                        sortedColumns.forEach(col => { rowObj[col] = parseFloat((val.totals[col] || 0).toFixed(3)); });
                        return rowObj;
                    });
                    const sheetName = type === 'daily' ? 'TheoNgay' : 'TheoThang';
                    const ws = XLSX.utils.json_to_sheet([]);
                    const title = type === 'daily' ? "TIÊU HAO PHÂN BỔ THEO NGÀY" : "TIÊU HAO PHÂN BỔ THEO THÁNG";
                    XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [title]], { origin: "A1" });
                    XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                    const colWidths = [6, 18, 30, 8, 14, ...sortedColumns.map(() => 12)];
                    this.formatSheet(ws, XLSX, 8, data.length, colWidths);
                    XLSX.utils.book_append_sheet(wb, ws, sheetName);
                    sheetsAdded.push(sheetName);
                }
                // Per-SOP breakdown sheets
                if (this.exportPerSop() && sopId === 'all') {
                    const sopMap = new Map();
                    filteredHistory.forEach((req) => {
                        const sName = req.sopName || req.sopId || 'Unknown';
                        if (!sopMap.has(sName))
                            sopMap.set(sName, { sopName: sName, items: new Map() });
                        const sopEntry = sopMap.get(sName);
                        const reqMargin = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                        req.items.forEach((item) => {
                            const itemAmount = getCalculatedItemAmount(item, reqMargin);
                            const cur = sopEntry.items.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
                            sopEntry.items.set(item.name, { amount: cur.amount + itemAmount, unit: cur.unit, displayName: item.displayName || cur.displayName });
                        });
                    });
                    sopMap.forEach((sopData, sopName) => {
                        const sorted = Array.from(sopData.items.entries())
                            .map(([id, val]) => ({ name: id, ...val }))
                            .sort((a, b) => b.amount - a.amount);
                        const data = sorted.map((r, i) => ({
                            'STT': i + 1, 'Mã': r.name, 'Tên': r.displayName, 'Lượng dùng': parseFloat(r.amount.toFixed(3)), 'ĐVT': r.unit
                        }));
                        if (data.length > 0) {
                            const ws = XLSX.utils.json_to_sheet([]);
                            XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [`TIÊU HAO - ${sopName}`]], { origin: "A1" });
                            XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                            this.formatSheet(ws, XLSX, 8, data.length, [6, 22, 35, 14, 10]);
                            // Sanitize sheet name (max 31 chars, no special chars)
                            const safeName = sopName.replace(/[\\\/\?\*\[\]]/g, '').substring(0, 28);
                            XLSX.utils.book_append_sheet(wb, ws, `SOP_${safeName}`);
                            sheetsAdded.push(`SOP_${safeName}`);
                        }
                    });
                }
                this.exportProgress.update(p => ({ ...p, consumption: 'done' }));
                await new Promise(r => setTimeout(r, 200));
            }
            // ===== 3. SOP Frequency =====
            if (this.exportSop()) {
                this.exportProgress.update(p => ({ ...p, sop: 'working' }));
                await new Promise(r => setTimeout(r, 50));
                const sops = this.sopFrequencyData();
                const sopRows = sops.map((d, index) => ({
                    'STT': index + 1, 'Quy trình (SOP)': d.name, 'Số lần chạy': d.count, 'Tổng số mẫu': d.samples, 'Tổng QC': d.qcs, 'Tỷ trọng (%)': formatNum(d.percent)
                }));
                const ws = XLSX.utils.json_to_sheet([]);
                XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["BÁO CÁO TẦN SUẤT QUY TRÌNH (SOP)"]], { origin: "A1" });
                XLSX.utils.sheet_add_json(ws, sopRows, { origin: "A8", skipHeader: false });
                this.formatSheet(ws, XLSX, 8, sopRows.length, [6, 35, 14, 12, 12, 14]);
                XLSX.utils.book_append_sheet(wb, ws, "SOP Frequency");
                sheetsAdded.push("SOP Frequency");
                this.exportProgress.update(p => ({ ...p, sop: 'done' }));
                await new Promise(r => setTimeout(r, 200));
            }
            // ===== 4. Audit Logs =====
            if (this.exportLogs()) {
                this.exportProgress.update(p => ({ ...p, logs: 'working' }));
                await new Promise(r => setTimeout(r, 50));
                const logs = this.filteredLogs();
                const logRows = logs.map((l, index) => ({
                    'STT': index + 1, 'Thời gian': formatDate(l.timestamp), 'Hoạt động': this.getLogActionText(l.action), 'Chi tiết': l.details, 'Người thực hiện': l.user
                }));
                const ws = XLSX.utils.json_to_sheet([]);
                XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["NHẬT KÝ HOẠT ĐỘNG CHI TIẾT"]], { origin: "A1" });
                XLSX.utils.sheet_add_json(ws, logRows, { origin: "A8", skipHeader: false });
                this.formatSheet(ws, XLSX, 8, logRows.length, [6, 22, 20, 50, 20]);
                XLSX.utils.book_append_sheet(wb, ws, "Audit Logs");
                sheetsAdded.push("Audit Logs");
                this.exportProgress.update(p => ({ ...p, logs: 'done' }));
                await new Promise(r => setTimeout(r, 200));
            }
            // ===== 5. Standards Health =====
            if (this.exportStandards()) {
                this.exportProgress.update(p => ({ ...p, standards: 'working' }));
                await new Promise(r => setTimeout(r, 50));
                const ws = XLSX.utils.json_to_sheet([]);
                XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["SỨC KHỎE & TRUY XUẤT CHUẨN ĐỐI CHIẾU"]], { origin: "A1" });
                // Section A: Summary
                const stats = this.healthStats();
                XLSX.utils.sheet_add_aoa(ws, [
                    ["TỔNG QUAN"],
                    ["Đang mượn / Sử dụng:", stats.borrowing],
                    ["Chuẩn hết hạn:", stats.expired],
                    ["Tồn kho thấp:", stats.lowStock],
                    []
                ], { origin: "A8" });
                // Section C: All borrowed
                const borrowed = this.state.allStandardRequests().filter((r) => r.status === 'IN_PROGRESS');
                if (borrowed.length > 0) {
                    const startRow = 15;
                    XLSX.utils.sheet_add_aoa(ws, [["DANH SÁCH ĐANG MƯỢN"]], { origin: `A${startRow}` });
                    const borrowedData = borrowed.map((r, i) => ({
                        'STT': i + 1, 'Người mượn': r.requestedByName, 'Tên chuẩn': r.standardName,
                        'LOT': r.lotNumber, 'Ngày mượn': r.requestDate ? new Date(r.requestDate).toLocaleDateString('vi-VN') : ''
                    }));
                    XLSX.utils.sheet_add_json(ws, borrowedData, { origin: `A${startRow + 1}`, skipHeader: false });
                }
                this.formatSheet(ws, XLSX, 8, 20, [6, 22, 30, 18, 16, 16]);
                XLSX.utils.book_append_sheet(wb, ws, "Standards");
                sheetsAdded.push("Standards");
                this.exportProgress.update(p => ({ ...p, standards: 'done' }));
                await new Promise(r => setTimeout(r, 200));
            }
            // ===== COVER SHEET (Always first) =====
            {
                const coverWs = XLSX.utils.aoa_to_sheet([]);
                const approvedCount = this.state.approvedRequests().filter((req) => {
                    const d = this.getRequestDate(req);
                    if (!d)
                        return false;
                    const s = new Date(start);
                    s.setHours(0, 0, 0, 0);
                    const e = new Date(end);
                    e.setHours(23, 59, 59, 999);
                    return d >= s && d <= e;
                }).length;
                const topSop = this.sopFrequencyData()[0];
                const stats = this.healthStats();
                XLSX.utils.sheet_add_aoa(coverWs, [
                    ["BÁO CÁO TỔNG HỢP HỆ THỐNG LIMS"],
                    [],
                    ["Đơn vị:", "Phòng thí nghiệm"],
                    ["Khoảng thời gian:", `${start}  đến  ${end}`],
                    ["SOP:", sopId === 'all' ? 'Tất cả quy trình' : this.getSelectedSopName()],
                    ["Người xuất báo cáo:", currentUser?.displayName || currentUser?.email || 'Admin'],
                    ["Ngày giờ xuất:", new Date().toLocaleString('vi-VN')],
                    [],
                    ["═══════════════════════════════════════════"],
                    ["CHỈ SỐ TỔNG QUAN (KPIs)"],
                    ["═══════════════════════════════════════════"],
                    [],
                    ["Tổng phiếu đã duyệt:", approvedCount],
                    ["Tổng mặt hàng tiêu hao:", this.consumptionData().length],
                    ["SOP chạy nhiều nhất:", topSop ? `${topSop.name} (${topSop.count} lần)` : 'N/A'],
                    ["Chuẩn đang mượn:", stats.borrowing],
                    ["Chuẩn hết hạn:", stats.expired],
                    [],
                    ["═══════════════════════════════════════════"],
                    ["MỤC LỤC SHEETS"],
                    ["═══════════════════════════════════════════"],
                    [],
                    ...sheetsAdded.map((name, i) => [`${i + 1}. ${name}`])
                ], { origin: "A1" });
                this.formatSheet(coverWs, XLSX, 1, 25, [28, 40]);
                // Insert cover as first sheet
                XLSX.utils.book_append_sheet(wb, coverWs, "Trang Bìa");
                // Move cover to first position
                const sheetNames = wb.SheetNames;
                const coverIdx = sheetNames.indexOf("Trang Bìa");
                if (coverIdx > 0) {
                    sheetNames.splice(coverIdx, 1);
                    sheetNames.unshift("Trang Bìa");
                }
            }
            this.exportProgress.update(p => ({ ...p, cover: 'done' }));
            await new Promise(r => setTimeout(r, 300));
            XLSX.writeFile(wb, `BaoCao_TongHop_${start}_den_${end}.xlsx`);
            this.isExporting.set(false);
        }
        catch (e) {
            console.error(e);
            this.isExporting.set(false);
            alert('Đã xảy ra lỗi trong quá trình cấu trúc Báo cáo Excel. Vui lòng F5 và kiểm tra Logs.');
        }
    }
    // Handle native input event for specific day
    onSpecificDayChange(event) {
        const val = parseInt(event.target.value, 10);
        if (!isNaN(val))
            this.specificDay.set(val);
    }
    getLogActionIcon(action) {
        if (action === 'SAVE_RESULT_DRAFT')
            return 'fa-solid fa-floppy-disk text-cyan-500';
        if (action === 'PUBLISH_RESULT_REPORT')
            return 'fa-solid fa-file-pdf text-emerald-500';
        if (action === 'REVERT_RESULT_DRAFT')
            return 'fa-solid fa-unlock text-amber-500';
        if (action === 'RESET_RESULT_DATA')
            return 'fa-solid fa-trash-arrow-up text-red-500';
        if (action === 'RESTORE_RESULT_BACKUP' || action === 'RESTORE_RESULT_VERSION')
            return 'fa-solid fa-clock-rotate-left text-violet-500';
        if (action.includes('DELETE'))
            return 'fa-solid fa-trash-can text-red-500';
        if (action.includes('REJECT'))
            return 'fa-solid fa-circle-xmark text-rose-500';
        if (action.includes('REVOKE'))
            return 'fa-solid fa-hand-holding-hand text-amber-500';
        return 'fa-solid fa-bolt text-indigo-500';
    }
    async runStatsBackfill() {
        if (this.isBackfilling())
            return;
        // Check permission (only Manager)
        if (this.auth.currentUser()?.role !== 'manager') {
            alert('Bạn không có quyền chạy Backfill.');
            return;
        }
        // Tự động dùng khoảng thời gian từ đầu năm 01/01 để đảm bảo nạp đủ lịch sử các tháng so sánh
        const currentYearStart = `${new Date().getFullYear()}-01-01`;
        const selectedStart = this.startDate();
        const endStr = this.endDate();
        // Sử dụng từ đầu năm nếu bộ lọc hiện tại ngắn hơn
        const startStr = selectedStart > currentYearStart ? currentYearStart : selectedStart;
        if (!confirm(`Bạn có chắc chắn muốn tổng hợp lại toàn bộ số liệu thống kê từ ${startStr} đến ${endStr} không?\nQuá trình này sẽ nạp lại đầy đủ dữ liệu các tháng trước để so sánh xu hướng.`)) {
            return;
        }
        const start = new Date(startStr);
        const end = new Date(endStr);
        this.isBackfilling.set(true);
        this.backfillProgressText.set('Đang khởi tạo...');
        try {
            await this.statsService.runBackfill(startStr, endStr, (msg) => {
                this.backfillProgressText.set(msg);
            });
            this.backfillProgressText.set('Thành công!');
            setTimeout(() => this.isBackfilling.set(false), 2000);
        }
        catch (e) {
            console.error(e);
            alert('Lỗi khi chạy backfill: ' + e.message);
        }
        finally {
            this.isBackfilling.set(false);
            this.backfillProgressText.set('');
        }
    }
    constructor() {
        this.state = inject(StateService);
        this.auth = inject(AuthService);
        this.invService = inject(InventoryService);
        this.statsService = inject(StatsService);
        this.formatDate = formatDate;
        this.formatNum = formatNum;
        this.cleanName = cleanName;
        this.getAvatarUrl = getAvatarUrl;
        this.activeTab = signal('logs');
        this.startDate = signal(this.getFirstDayOfMonth());
        this.endDate = signal(this.getToday());
        this.selectedSopId = signal('all');
        this.barChartCanvas = viewChild('barChartCanvas');
        this.pieChartCanvas = viewChild('pieChartCanvas');
        this.lineChartCanvas = viewChild('lineChartCanvas');
        this.barChart = null;
        this.pieChart = null;
        this.lineChart = null;
        this.isLoading = signal(false);
        this.hasGenerated = signal(false);
        this.nxtData = signal([]);
        this.statsData = signal({});
        this.showGlobalExportModal = signal(false);
        this.exportInventory = signal(true);
        this.exportConsumption = signal(true);
        this.exportSop = signal(true);
        this.exportLogs = signal(false);
        this.exportStandards = signal(false);
        this.exportPerSop = signal(false);
        this.showConsumptionOptions = signal(true);
        this.isExporting = signal(false);
        this.activePreset = signal(null);
        this.exportProgress = signal({
            nxt: 'pending', consumption: 'pending', sop: 'pending', logs: 'pending', standards: 'pending', cover: 'pending'
        });
        this.healthStats = computed(() => {
            const reqs = this.state.allStandardRequests();
            const stds = this.state.standards();
            const now = Date.now();
            return {
                borrowing: reqs.filter(r => r.status === 'IN_PROGRESS').length,
                expired: stds.filter((s) => s.expiry_date && new Date(s.expiry_date).getTime() < now).length,
                lowStock: stds.filter((s) => (s.current_amount ?? 0) < 5).length
            };
        });
        this.criticalLogs = computed(() => {
            return this.state.logs().filter(l => l.action.includes('DELETE') ||
                l.action.includes('HARD_DELETE') ||
                l.action.includes('REJECT') ||
                l.action.includes('REVOKE')).slice(0, 20);
        });
        this.exportType = signal('summary');
        this.specificDay = signal(1);
        this.excludeMargin = signal(false);
        // --- BACKFILL UI STATE ---
        this.isBackfilling = signal(false);
        this.backfillProgressText = signal('');
        this.filteredLogs = computed(() => {
            const start = new Date(this.startDate());
            start.setHours(0, 0, 0, 0);
            const end = new Date(this.endDate());
            end.setHours(23, 59, 59, 999);
            const sopId = this.selectedSopId();
            return this.state.logs().filter(log => {
                const d = timestampToDate(log.timestamp);
                if (!d)
                    return false;
                const inDate = d >= start && d <= end;
                if (!inDate)
                    return false;
                if (sopId === 'all')
                    return true;
                return log.printData?.sop?.id === sopId || log.sopId === sopId;
            });
        });
        this.filteredStandardRequests = computed(() => {
            const start = new Date(this.startDate());
            start.setHours(0, 0, 0, 0);
            const end = new Date(this.endDate());
            end.setHours(23, 59, 59, 999);
            return this.state.allStandardRequests().filter(req => {
                const d = new Date(req.requestDate);
                return d >= start && d <= end;
            });
        });
        this.consumptionData = computed(() => {
            const history = this.state.approvedRequests();
            const map = new Map();
            const start = new Date(this.startDate());
            start.setHours(0, 0, 0, 0);
            const end = new Date(this.endDate());
            end.setHours(23, 59, 59, 999);
            const sopId = this.selectedSopId();
            history.forEach(req => {
                const d = this.getRequestDate(req);
                if (!d)
                    return;
                if (d < start || d > end)
                    return;
                if (sopId !== 'all' && req.sopId !== sopId)
                    return;
                req.items.forEach((item) => {
                    const current = map.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
                    map.set(item.name, {
                        amount: current.amount + item.amount,
                        unit: current.unit,
                        displayName: item.displayName || current.displayName || item.name
                    });
                });
            });
            return Array.from(map.entries())
                .map(([id, val]) => ({ name: id, displayName: val.displayName, amount: val.amount, unit: val.unit }))
                .sort((a, b) => b.amount - a.amount);
        });
        this.sopFrequencyData = computed(() => {
            const startStr = this.startDate();
            const endStr = this.endDate();
            const start = new Date(startStr);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endStr);
            end.setHours(23, 59, 59, 999);
            const sopIdFilter = this.selectedSopId();
            // Đọc statsData để tạo dependency (trigger computed khi data về)
            const stats = this.statsData();
            const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
            if (diffDays < 0)
                return [];
            const map = new Map();
            let totalBatchesGlobal = 0;
            // Use < instead of <= to prevent off-by-one error since diffDays represents the count of days (rounded from ~0.99 to 1 for same day)
            for (let i = 0; i < diffDays; i++) {
                const currentDay = new Date(start.getTime() + (i * 24 * 3600 * 1000));
                const dayStats = this.getDayStats(currentDay);
                for (const [sopKey, sStats] of Object.entries(dayStats.sops)) {
                    if (sopIdFilter !== 'all' && sopKey !== sopIdFilter && sopKey !== this.getSelectedSopName())
                        continue;
                    const current = map.get(sopKey) || { count: 0, samples: 0, qcs: 0 };
                    map.set(sopKey, {
                        count: current.count + sStats.batches,
                        samples: current.samples + sStats.samples,
                        qcs: current.qcs + (sStats.qcs || 0)
                    });
                    totalBatchesGlobal += sStats.batches;
                }
            }
            if (totalBatchesGlobal === 0)
                return [];
            return Array.from(map.entries())
                .map(([name, val]) => ({ name, count: val.count, samples: val.samples, qcs: val.qcs, percent: (val.count / totalBatchesGlobal) * 100 }))
                .sort((a, b) => b.count - a.count);
        });
        this.state.ensureApprovedRequestsListener();
        this.state.ensureActivityFeedListeners();
        // Load on-demand (listeners removed for Spark Free optimization)
        this.state.loadAllStandardRequests();
        this.state.loadReferenceStandards(); // populates state.standards() for healthStats & pie chart
        effect(() => {
            const active = this.activeTab();
            const consData = this.consumptionData();
            const inv = this.state.inventory();
            if (active === 'consumption') {
                setTimeout(() => {
                    this.createConsumptionBarChart();
                    this.createCategoryPieChart();
                    this.createConsumptionLineChart();
                }, 100);
            }
        });
        effect(() => {
            const start = new Date(this.startDate());
            const end = new Date(this.endDate());
            const months = new Set();
            const d = new Date(start);
            d.setDate(1);
            while (d <= end) {
                months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                d.setMonth(d.getMonth() + 1);
            }
            this.statsService.getStatsForMonths(Array.from(months)).then(result => {
                this.statsData.update(prev => ({ ...prev, ...result }));
            });
        });
    }
    // --- Actions ---
    onDateRangeChange(range) {
        this.startDate.set(range.start);
        this.endDate.set(range.end);
        this.hasGenerated.set(false); // Force recalculation if date changes
    }
    toLocalDateStr(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
    getToday() { return this.toLocalDateStr(new Date()); }
    getFirstDayOfMonth() { const d = new Date(); return this.toLocalDateStr(new Date(d.getFullYear(), d.getMonth(), 1)); }
    getRequestDate(request) {
        if (typeof request?.analysisDate === 'string') {
            const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(request.analysisDate);
            if (match) {
                const year = Number(match[1]);
                const month = Number(match[2]);
                const day = Number(match[3]);
                const date = new Date(year, month - 1, day);
                if (date.getFullYear() === year
                    && date.getMonth() === month - 1
                    && date.getDate() === day)
                    return date;
            }
        }
        return timestampToDate(request?.approvedAt ?? request?.timestamp);
    }
    getUnitClass(unit) { return (unit.includes('ml') || unit.includes('l')) ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200'; }
    getSelectedSopName() {
        const id = this.selectedSopId();
        if (id === 'all')
            return 'Tất cả';
        const sop = this.state.sops().find(s => s.id === id);
        return sop ? sop.name : id;
    }
    // --- NXT / EXPORT DETAIL REPORT LOGIC ---
    async generateNxtReport() {
        this.isLoading.set(true);
        this.nxtData.set([]);
        // Snapshot all filter values at the start to avoid race conditions
        // if the user changes a filter while the async operation is running.
        const startRaw = this.startDate();
        const endRaw = this.endDate();
        const sopId = this.selectedSopId();
        // Use local timezone perfectly without shifting 
        const start = new Date(startRaw + 'T00:00:00');
        const end = new Date(endRaw + 'T23:59:59.999');
        const startTime = start.getTime();
        const endTime = end.getTime();
        try {
            const inventory = await this.invService.getAllInventory();
            // Bug Fix: Fetch logs from 'start' up to 'today' (not just 'end') so we can
            // correctly calculate futureNetChange (movements AFTER the period end).
            // We need logs beyond 'end' to subtract from current stock to get end-of-period stock.
            const maxNow = new Date();
            maxNow.setHours(23, 59, 59, 999);
            const logs = await this.invService.getLogsByDateRange(start, maxNow);
            if (sopId === 'all') {
                const movements = new Map();
                inventory.forEach(item => movements.set(item.id, { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 }));
                logs.forEach(log => {
                    const logTime = timestampToMillis(log.timestamp);
                    if (logTime === null)
                        return;
                    const result = [];
                    const targetId = log.targetId;
                    if (log.action.includes('STOCK')) {
                        const match = log.details.match(/:\s*([+-]?\d+(?:\.\d+)?)/);
                        if (match && targetId) {
                            result.push({ id: targetId, delta: parseFloat(match[1]) });
                        }
                    }
                    else if (log.action === 'CREATE_ITEM') {
                        const match = log.details.match(/\(([-+]?\d+(?:\.\d+)?)/);
                        if (match && targetId) {
                            result.push({ id: targetId, delta: parseFloat(match[1]) });
                        }
                    }
                    else if (log.action === 'UPDATE_INFO') {
                        const match = log.details.match(/Tồn kho:\s*([-+]?\d+(?:\.\d+)?)\s*->\s*([-+]?\d+(?:\.\d+)?)/);
                        if (match && targetId) {
                            const oldStock = parseFloat(match[1]);
                            const newStock = parseFloat(match[2]);
                            result.push({ id: targetId, delta: newStock - oldStock });
                        }
                    }
                    else if (log.action === 'DELETE_ITEM' || log.action === 'HARD_DELETE_STANDARD_REQUEST') {
                        // finalStock can be used for absolute accuracy when available
                        if (log.finalStock !== undefined && targetId) {
                            // Stock was reduced to zero by deletion; handled via stock delta if logged
                        }
                    }
                    else if (log.action.includes('APPROVE') && log.printData?.items) {
                        log.printData.items.forEach(item => {
                            if (item.isComposite && item.breakdown) {
                                item.breakdown.forEach(sub => result.push({ id: sub.name, delta: -(sub.totalNeed || 0) }));
                            }
                            else {
                                result.push({ id: item.name, delta: -(item.stockNeed || 0) });
                            }
                        });
                    }
                    result.forEach(change => {
                        if (!movements.has(change.id))
                            movements.set(change.id, { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 });
                        const entry = movements.get(change.id);
                        if (logTime > endTime) {
                            // Movements AFTER the period: used to back-calculate end-of-period stock
                            entry.futureNetChange += change.delta;
                        }
                        else {
                            // Movements WITHIN the period (start <= logTime <= end)
                            if (change.delta > 0)
                                entry.inPeriodImport += change.delta;
                            else
                                entry.inPeriodExport += Math.abs(change.delta);
                        }
                    });
                });
                const report = [];
                const allIds = new Set([...inventory.map(i => i.id), ...movements.keys()]);
                allIds.forEach(id => {
                    const item = inventory.find(i => i.id === id);
                    const m = movements.get(id) || { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 };
                    const currentStock = item ? item.stock : 0;
                    const endStock = currentStock - m.futureNetChange;
                    const startStock = endStock - m.inPeriodImport + m.inPeriodExport;
                    if (startStock !== 0 || m.inPeriodImport !== 0 || m.inPeriodExport !== 0 || endStock !== 0 || item) {
                        report.push({
                            id: id,
                            name: item?.name || id,
                            unit: item?.unit || '?',
                            category: item?.category || 'Unknown',
                            startStock: parseFloat(startStock.toFixed(3)),
                            importQty: parseFloat(m.inPeriodImport.toFixed(3)),
                            exportQty: parseFloat(m.inPeriodExport.toFixed(3)),
                            endStock: parseFloat(endStock.toFixed(3))
                        });
                    }
                });
                this.nxtData.set(report.sort((a, b) => a.name.localeCompare(b.name)));
            }
            else {
                // --- SOP-specific export detail mode ---
                const consumptionMap = new Map();
                logs.forEach(log => {
                    const logTime = timestampToMillis(log.timestamp);
                    if (logTime === null)
                        return;
                    // Bug Fix: filter by BOTH start and end date (was only checking <= end)
                    if (logTime >= startTime && logTime <= endTime) {
                        if (log.action.includes('APPROVE') && log.printData?.sop?.id === sopId && log.printData?.items) {
                            log.printData.items.forEach(item => {
                                if (item.isComposite && item.breakdown) {
                                    item.breakdown.forEach(sub => {
                                        const cur = consumptionMap.get(sub.name) || 0;
                                        consumptionMap.set(sub.name, cur + (sub.totalNeed || 0));
                                    });
                                }
                                else {
                                    const cur = consumptionMap.get(item.name) || 0;
                                    consumptionMap.set(item.name, cur + (item.stockNeed || 0));
                                }
                            });
                        }
                    }
                });
                const report = [];
                consumptionMap.forEach((qty, id) => {
                    const item = inventory.find(i => i.id === id);
                    report.push({
                        id: id,
                        name: item?.name || id,
                        unit: item?.unit || '?',
                        category: item?.category || 'Unknown',
                        startStock: 0,
                        importQty: 0,
                        exportQty: parseFloat(qty.toFixed(3)),
                        endStock: 0
                    });
                });
                this.nxtData.set(report.sort((a, b) => a.name.localeCompare(b.name)));
            }
            this.hasGenerated.set(true);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            this.isLoading.set(false);
        }
    }
    async createConsumptionBarChart() {
        const canvas = this.barChartCanvas()?.nativeElement;
        if (!canvas)
            return;
        const Chart = await this.loadChart();
        if (this.barChart)
            this.barChart.destroy();
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const data = this.consumptionData().slice(0, 15);
        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.displayName || d.name),
                datasets: [{
                        label: 'Lượng dùng',
                        data: data.map(d => d.amount),
                        backgroundColor: 'rgba(79, 70, 229, 0.6)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Lượng dùng: ${formatNum(context.raw)}`
                        }
                    }
                },
                layout: { padding: { left: 40, right: 20 } },
                scales: {
                    x: { grid: { display: false }, beginAtZero: true },
                    y: {
                        grid: { display: false },
                        ticks: {
                            callback: function (value) {
                                const label = this.getLabelForValue(value);
                                return (label && label.length > 30) ? label.substring(0, 27) + '...' : label;
                            },
                            font: { size: 10, weight: 'bold' }
                        }
                    }
                }
            }
        });
    }
    async createCategoryPieChart() {
        const canvas = this.pieChartCanvas()?.nativeElement;
        if (!canvas)
            return;
        const Chart = await this.loadChart();
        if (this.pieChart)
            this.pieChart.destroy();
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const data = this.consumptionData();
        const catMap = new Map();
        // Build lookup maps by both ID and name for robust matching
        // consumptionData uses item.name which is the Firestore document ID (item ID)
        const invByIdMap = new Map(this.state.inventory().map(i => [i.id, i.category]));
        const invByNameMap = new Map(this.state.inventory().map(i => [i.name, i.category]));
        const stdByIdMap = new Map(this.state.standards().map((s) => [s.id, 'Chất chuẩn đối chiếu']));
        const stdByNameMap = new Map(this.state.standards().map((s) => [s.name, 'Chất chuẩn đối chiếu']));
        data.forEach(d => {
            // Priority: lookup by ID first (most reliable), then by display name as fallback
            let cat = invByIdMap.get(d.name)
                || invByNameMap.get(d.displayName)
                || stdByIdMap.get(d.name)
                || stdByNameMap.get(d.displayName)
                || 'Chưa phân loại';
            if (this.state.categoriesMap().has(cat)) {
                cat = this.state.categoriesMap().get(cat);
            }
            catMap.set(cat, (catMap.get(cat) || 0) + 1);
        });
        this.pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Array.from(catMap.keys()),
                datasets: [{
                        data: Array.from(catMap.values()),
                        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
                        borderWidth: 0
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } } },
                cutout: '70%'
            }
        });
    }
    async createConsumptionLineChart() {
        const canvas = this.lineChartCanvas()?.nativeElement;
        if (!canvas)
            return;
        const Chart = await this.loadChart();
        if (this.lineChart)
            this.lineChart.destroy();
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Group consumption by date for trend
        const history = this.state.approvedRequests();
        const trendMap = new Map();
        const start = new Date(this.startDate());
        const end = new Date(this.endDate());
        history.forEach(req => {
            const d = this.getRequestDate(req);
            if (!d)
                return;
            if (d >= start && d <= end) {
                const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                let dayTotal = 0;
                req.items.forEach(i => dayTotal += i.amount);
                trendMap.set(key, (trendMap.get(key) || 0) + dayTotal);
            }
        });
        const sortedKeys = Array.from(trendMap.keys()).sort((a, b) => {
            const [d1, m1] = a.split('/');
            const [d2, m2] = b.split('/');
            return new Date(2025, parseInt(m1) - 1, parseInt(d1)).getTime() - new Date(2025, parseInt(m2) - 1, parseInt(d2)).getTime();
        });
        this.lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedKeys,
                datasets: [{
                        label: 'Tổng lượng dùng',
                        data: sortedKeys.map(k => trendMap.get(k)),
                        borderColor: '#4F46E5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#4F46E5',
                        borderWidth: 3
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
    loadChart() {
        this.chartLoader ??= import('chart.js').then(m => {
            m.Chart.register(m.BarController, m.LineController, m.DoughnutController, m.CategoryScale, m.LinearScale, m.PointElement, m.LineElement, m.BarElement, m.ArcElement, m.Filler, m.Tooltip, m.Legend);
            return m.Chart;
        });
        return this.chartLoader;
    }
    static { this.ɵfac = function StatisticsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StatisticsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StatisticsComponent, selectors: [["app-statistics"]], viewQuery: function StatisticsComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuerySignal(ctx.barChartCanvas, _c0, 5);
            i0.ɵɵviewQuerySignal(ctx.pieChartCanvas, _c1, 5);
            i0.ɵɵviewQuerySignal(ctx.lineChartCanvas, _c2, 5);
        } if (rf & 2) {
            i0.ɵɵqueryAdvance(3);
        } }, decls: 3, vars: 2, consts: [["barChartCanvas", ""], ["pieChartCanvas", ""], ["lineChartCanvas", ""], [1, "h-full", "flex", "flex-col", "space-y-5", "pb-6", "fade-in", "overflow-hidden", "relative", "font-sans", "text-slate-800", "dark:text-slate-200"], [1, "h-full", "flex", "items-center", "justify-center", "fade-in"], ["title", "Xu\u1EA5t b\u00E1o c\u00E1o t\u1ED5ng h\u1EE3p", 3, "dateRangeText", "subtitle", "isExporting", "isCompleted", "footerText", "isSubmitDisabled"], [1, "flex", "flex-col", "xl:flex-row", "xl:items-center", "justify-between", "gap-4", "shrink-0", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "mb-4", "z-20"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "border", "border-blue-100", "dark:border-blue-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-chart-pie", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "flex-col", "md:flex-row", "gap-3", "items-end", "md:items-center", "flex-wrap"], [1, "relative", "group", "min-w-[200px]"], [1, "absolute", "inset-y-0", "left-0", "pl-3", "flex", "items-center", "pointer-events-none"], [1, "fa-solid", "fa-filter", "text-slate-400", "dark:text-slate-500", "text-xs"], [1, "w-full", "pl-8", "pr-8", "py-2", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-blue-500", "dark:focus:border-blue-400", "focus:ring-2", "focus:ring-blue-100", "dark:focus:ring-blue-900/30", "transition", "shadow-sm", "appearance-none", "cursor-pointer", "hover:bg-white", "dark:hover:bg-slate-800", "h-[42px]", 3, "ngModelChange", "ngModel"], ["value", "all"], [3, "value"], [1, "absolute", "inset-y-0", "right-0", "pr-3", "flex", "items-center", "pointer-events-none"], [1, "fa-solid", "fa-chevron-down", "text-slate-400", "dark:text-slate-500", "text-[10px]"], [3, "dateChange", "initStart", "initEnd"], [1, "h-[42px]", "px-5", "bg-gradient-to-r", "from-indigo-600", "to-purple-600", "text-white", "hover:from-indigo-700", "hover:to-purple-700", "rounded-xl", "text-xs", "font-black", "uppercase", "tracking-wider", "transition", "shadow-lg", "shadow-indigo-500/20", "active:scale-95", "flex", "items-center", "gap-2", "group", 3, "click"], [1, "fa-solid", "fa-file-export", "group-hover:rotate-12", "transition-transform"], [1, "flex-1", "flex", "flex-col", "min-h-0", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "overflow-hidden"], [1, "flex", "border-b", "border-slate-100", "dark:border-slate-700", "px-6", "pt-4", "shrink-0", "gap-8", "bg-white", "dark:bg-slate-800", "overflow-x-auto"], [1, "pb-3", "text-xs", "font-bold", "border-b-2", "transition", "flex", "items-center", "gap-2", "uppercase", "tracking-wide", "whitespace-nowrap", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-clock-rotate-left"], [1, "fa-solid", "fa-flask"], [1, "fa-solid", "fa-list-ol"], [1, "fa-solid", "fa-heart-pulse"], [1, "ml-auto", "pr-6", "flex", "items-center", "gap-2"], [1, "flex-1", "overflow-y-auto", "p-0", "relative", "bg-white", "dark:bg-slate-800", "custom-scrollbar", "h-full"], [1, "w-full", "text-sm", "text-left"], [1, "flex", "flex-col", "h-full"], [1, "flex", "flex-col", "h-full", "bg-slate-50/50", "dark:bg-slate-900/50", "gap-4", "p-5", "overflow-y-auto", "custom-scrollbar"], [1, "h-[42px]", "px-5", "bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "hover:from-amber-600", "hover:to-orange-600", "rounded-xl", "text-xs", "font-black", "uppercase", "tracking-wider", "transition", "shadow-lg", "shadow-orange-500/20", "active:scale-95", "flex", "items-center", "gap-2", "disabled:opacity-50", "group", 3, "click", "disabled"], [1, "fa-solid", "fa-database"], [1, "text-xs", "text-orange-600", "dark:text-orange-400", "font-bold", "ml-2", "animate-pulse"], [1, "fa-solid", "fa-boxes-packing"], [1, "fa-solid", "fa-list-check"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "uppercase", "bg-slate-50/50", "dark:bg-slate-800/50", "sticky", "top-0", "backdrop-blur-sm", "z-10", "border-b", "border-slate-100", "dark:border-slate-700"], [1, "px-6", "py-3", "font-bold"], [1, "divide-y", "divide-slate-50", "dark:divide-slate-700/50"], [1, "hover:bg-slate-50/80", "dark:hover:bg-slate-700/30", "transition", "group"], [1, "px-6", "py-4", "text-slate-500", "dark:text-slate-400", "font-mono", "text-xs", "whitespace-nowrap"], [1, "px-6", "py-4"], [1, "inline-flex", "items-center", "px-2", "py-0.5", "rounded", "text-[10px]", "font-bold", "uppercase", "tracking-wider", "border", 3, "ngClass"], [1, "px-6", "py-4", "text-slate-700", "dark:text-slate-300", "text-xs", "font-medium", "max-w-xs", "truncate", 3, "title"], [1, "flex", "items-center", "gap-2"], [1, "w-6", "h-6", "rounded-full", "bg-slate-100", "dark:bg-slate-700", "border", "border-slate-200", "dark:border-slate-600", "object-cover", 3, "src"], [1, "text-slate-600", "dark:text-slate-300", "font-medium", "text-xs"], ["colspan", "4", 1, "p-12", "text-center", "text-slate-400", "dark:text-slate-500", "italic"], [1, "p-4", "bg-slate-50/50", "dark:bg-slate-800/50", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "justify-between", "items-center", "shrink-0"], [1, "flex", "gap-2"], [1, "px-4", "py-2", "bg-blue-600", "text-white", "hover:bg-blue-700", "rounded-lg", "text-xs", "font-bold", "transition", "shadow-sm", "flex", "items-center", "gap-2", "disabled:opacity-50", "active:scale-95", 3, "click", "disabled"], [1, "fa-solid", "fa-calculator"], [1, "flex-1", "overflow-auto", "relative"], [1, "absolute", "inset-0", "bg-white/80", "dark:bg-slate-900/80", "z-10", "flex", "items-center", "justify-center", "flex-col", "gap-3"], [1, "w-full", "text-sm", "text-left", "border-collapse"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "uppercase", "bg-slate-50", "dark:bg-slate-800", "sticky", "top-0", "z-10", "shadow-sm"], [1, "px-4", "py-3", "border-b", "dark:border-slate-700", "text-center", "w-10"], [1, "px-4", "py-3", "border-b", "dark:border-slate-700"], [1, "px-4", "py-3", "border-b", "dark:border-slate-700", "w-24", "text-center"], [1, "px-4", "py-3", "border-b", "dark:border-slate-700", "text-right", "text-orange-700", "dark:text-orange-400", "font-bold", "bg-orange-50/20", "dark:bg-orange-900/20"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-700"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-700/30", "transition"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-table"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "font-bold", "text-blue-600", "dark:text-blue-400"], [1, "w-10", "h-10", "border-4", "border-slate-200", "dark:border-slate-700", "border-t-blue-600", "dark:border-t-blue-500", "rounded-full", "animate-spin"], [1, "text-sm", "font-bold", "text-slate-600", "dark:text-slate-300"], [1, "px-4", "py-3", "border-b", "dark:border-slate-700", "text-right", "bg-blue-50/30", "dark:bg-blue-900/20", "text-blue-800", "dark:text-blue-300"], [1, "px-4", "py-3", "border-b", "dark:border-slate-700", "text-right", "text-emerald-700", "dark:text-emerald-400"], [1, "px-4", "py-3", "border-b", "dark:border-slate-700", "text-right", "text-orange-700", "dark:text-orange-400"], [1, "px-4", "py-3", "border-b", "dark:border-slate-700", "text-right", "bg-purple-50/30", "dark:bg-purple-900/20", "text-purple-800", "dark:text-purple-300", "font-bold", "border-l", "border-slate-100", "dark:border-slate-700"], [1, "px-4", "py-3", "text-center", "text-xs", "text-slate-400", "dark:text-slate-500"], [1, "px-4", "py-3"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "text-xs"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-mono"], [1, "px-4", "py-3", "text-center", "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400"], [1, "px-4", "py-3", "text-right", "font-mono", "text-orange-600", "dark:text-orange-400", "font-bold", "text-base"], [1, "px-4", "py-3", "text-right", "bg-blue-50/10", "dark:bg-blue-900/10", "font-mono", "text-slate-600", "dark:text-slate-300"], [1, "px-4", "py-3", "text-right", "font-mono", "text-emerald-600", "dark:text-emerald-400", "font-bold"], [1, "px-4", "py-3", "text-right", "font-mono", "text-orange-600", "dark:text-orange-400", "font-bold"], [1, "px-4", "py-3", "text-right", "bg-purple-50/10", "dark:bg-purple-900/10", "font-mono", "font-black", "text-slate-800", "dark:text-slate-200", "border-l", "border-slate-100", "dark:border-slate-700"], [1, "p-16", "text-center", "text-slate-400", "dark:text-slate-500", "italic"], [1, "grid", "grid-cols-1", "lg:grid-cols-3", "gap-4", "shrink-0", "h-[300px]"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-700", "p-4", "shadow-sm", "flex", "flex-col"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "text-[10px]", "uppercase", "font-black", "text-slate-400", "tracking-widest"], [1, "fa-solid", "fa-ranking-star", "mr-2"], [1, "flex-1", "relative", "min-h-0"], [1, "fa-solid", "fa-chart-pie", "mr-2"], [1, "fa-solid", "fa-arrow-trend-up", "mr-2"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "overflow-hidden", "flex", "flex-col", "shrink-0"], [1, "px-6", "py-4", "border-b", "border-slate-50", "dark:border-slate-700", "flex", "justify-between", "items-center", "shrink-0"], [1, "text-xs", "font-black", "text-slate-700", "dark:text-slate-200"], [1, "overflow-x-auto"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "uppercase", "bg-slate-50/80", "dark:bg-slate-800/80", "sticky", "top-0", "backdrop-blur-sm", "z-10"], [1, "px-6", "py-3", "border-b", "dark:border-slate-700", "w-12", "text-center"], [1, "px-6", "py-3", "border-b", "dark:border-slate-700"], [1, "px-6", "py-3", "border-b", "dark:border-slate-700", "text-right"], [1, "px-6", "py-3", "border-b", "dark:border-slate-700", "text-center", "w-32"], [1, "px-6", "py-3", "text-center", "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "px-6", "py-3", "font-semibold", "text-slate-700", "dark:text-slate-300"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-mono", "ml-1"], [1, "px-6", "py-3", "text-right", "font-bold", "text-slate-800", "dark:text-slate-200", "font-mono", "text-base"], [1, "px-6", "py-3", "text-center"], [1, "px-3", "py-1", "rounded-full", "text-[10px]", "font-bold", "border", "uppercase", "inline-block", "shadow-sm"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "uppercase", "bg-slate-50/80", "dark:bg-slate-800/80", "sticky", "top-0", "backdrop-blur-sm", "z-10", "border-b", "border-slate-100", "dark:border-slate-700"], [1, "px-6", "py-3"], [1, "px-6", "py-3", "text-center", "text-blue-700", "dark:text-blue-400"], [1, "px-6", "py-3", "text-center", "text-purple-700", "dark:text-purple-400"], [1, "px-6", "py-3", "text-right", "w-48"], [1, "px-6", "py-4", "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "px-6", "py-4", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "text-lg"], [1, "px-6", "py-4", "text-center"], [1, "font-bold", "text-blue-600", "dark:text-blue-400", "bg-blue-50", "dark:bg-blue-900/20", "px-2", "py-1", "rounded-md"], [1, "font-bold", "text-purple-600", "dark:text-purple-400", "bg-purple-50", "dark:bg-purple-900/20", "px-2", "py-1", "rounded-md"], [1, "px-6", "py-4", "text-right", "align-middle"], [1, "flex", "items-center", "gap-3", "justify-end", "w-full"], [1, "flex-1", "bg-slate-100", "dark:bg-slate-700", "rounded-full", "h-2", "overflow-hidden", "shadow-inner", "max-w-[100px]"], [1, "bg-gradient-to-r", "from-blue-400", "to-blue-600", "h-2", "rounded-full"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "w-10", "text-right"], ["colspan", "5", 1, "p-12", "text-center", "text-slate-400", "dark:text-slate-500", "italic"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "shrink-0"], [1, "bg-white", "dark:bg-slate-800", "p-6", "rounded-3xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "flex", "items-center", "justify-between"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-1"], [1, "text-3xl", "font-black", "text-blue-600", "dark:text-blue-400"], [1, "text-[10px]", "text-slate-500", "font-bold", "mt-1", "uppercase", "tracking-tight"], [1, "w-16", "h-16", "rounded-2xl", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-500", "flex", "items-center", "justify-center", "text-3xl", "shadow-inner"], [1, "fa-solid", "fa-flask-vial"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-4", "flex-1", "min-h-0"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "flex", "flex-col", "min-h-0"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "flex-1", "overflow-y-auto", "p-4", "custom-scrollbar"], [1, "space-y-3"], [1, "flex", "gap-4", "p-3", "rounded-2xl", "border", "border-slate-50", "dark:border-slate-800/50", "hover:bg-slate-50", "dark:hover:bg-slate-900/50", "transition"], [1, "w-10", "h-10", "rounded-xl", "bg-slate-100", "dark:bg-slate-900", "flex", "items-center", "justify-center", "text-indigo-500", "shrink-0"], [1, "flex", "items-center", "gap-2", "mt-1"], [1, "text-[10px]", "font-bold", "text-slate-400"], [1, "text-slate-300"], [1, "text-[10px]", "font-black", "text-indigo-500"], [1, "bg-white", "dark:bg-slate-800", "p-8", "rounded-2xl", "shadow-xl", "border", "border-red-100", "dark:border-red-900/30", "max-w-md", "text-center"], [1, "w-16", "h-16", "bg-red-50", "dark:bg-red-900/20", "text-red-500", "dark:text-red-400", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "text-2xl"], [1, "fa-solid", "fa-lock"], [1, "text-xl", "font-bold", "text-slate-800", "dark:text-slate-200", "mb-2"], [1, "text-slate-500", "dark:text-slate-400", "text-sm", "mb-6"], [1, "text-xs", "font-mono", "bg-slate-100", "dark:bg-slate-700", "p-2", "rounded", "text-slate-600", "dark:text-slate-300"], ["title", "Xu\u1EA5t b\u00E1o c\u00E1o t\u1ED5ng h\u1EE3p", 3, "close", "execute", "dateRangeText", "subtitle", "isExporting", "isCompleted", "footerText", "isSubmitDisabled"], [1, "px-5", "pt-5", "pb-3"], [1, "px-5", "pb-5", "space-y-2"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-2", "mt-2"], [1, "border", "rounded-2xl", "overflow-hidden", "transition-all"], [1, "w-full", "flex", "items-center", "gap-3.5", "p-4", "cursor-pointer", "hover:bg-slate-50/50", "dark:hover:bg-slate-700/20", "transition", "disabled:cursor-default", 3, "click", "disabled"], [1, "w-9", "h-9", "rounded-xl", "flex", "items-center", "justify-center", "text-sm", "shrink-0", "shadow-sm"], [1, "flex-1", "text-left"], [1, "text-sm", "font-black"], [1, "text-[11px]", "text-slate-500"], [1, "text-[10px]", "font-bold", "bg-emerald-100", "dark:bg-emerald-900/30", "text-emerald-600", "dark:text-emerald-400", "px-2", "py-0.5", "rounded-full"], [1, "px-4", "pb-4", "space-y-2", "border-t", "border-orange-100", "dark:border-orange-900/30", "bg-white/50", "dark:bg-slate-800/50"], [1, "text-[10px]", "font-bold", "bg-purple-100", "dark:bg-purple-900/30", "text-purple-600", "dark:text-purple-400", "px-2", "py-0.5", "rounded-full"], [1, "text-[10px]", "font-bold", "bg-blue-100", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "px-2", "py-0.5", "rounded-full"], [1, "text-[10px]", "font-bold", "bg-pink-100", "dark:bg-pink-900/30", "text-pink-600", "dark:text-pink-400", "px-2", "py-0.5", "rounded-full"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "mt-1"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-3"], [1, "fa-solid", "fa-bolt", "mr-1"], [1, "flex", "flex-wrap", "gap-2"], ["title", "Ch\u1EC9 t\u00EDnh to\u00E1n v\u00E0 t\u00F3m t\u1EAFt theo th\u00E1ng", 1, "px-3", "py-1.5", "rounded-xl", "text-[11px]", "font-bold", "border", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-calendar-days", "mr-1"], ["title", "T\u00E1ch b\u1EA1ch d\u1EEF li\u1EC7u theo ng\u00E0y v\u00E0 t\u1EEBng SOP \u0111\u1EC3 ph\u00E2n t\u00EDch hi\u1EC7u n\u0103ng", 1, "px-3", "py-1.5", "rounded-xl", "text-[11px]", "font-bold", "border", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-magnifying-glass-chart", "mr-1"], ["title", "S\u1ED1 li\u1EC7u thu\u1EA7n thi\u1EBFt, lo\u1EA1i tr\u1EEB m\u1ECDi m\u1ED1c hao h\u1EE5t", 1, "px-3", "py-1.5", "rounded-xl", "text-[11px]", "font-bold", "border", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-receipt", "mr-1"], [1, "px-3", "py-1.5", "rounded-xl", "text-[11px]", "font-bold", "border", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-layer-group", "mr-1"], [1, "fa-solid", "fa-list-check", "mr-1"], [1, "fa-solid", "fa-gear", "fa-spin", "mr-1"], [1, "fa-solid", "fa-circle-check", "text-emerald-500", "text-lg"], [1, "w-5", "h-5", "border-2", "border-emerald-200", "border-t-emerald-600", "rounded-full", "animate-spin"], [1, "fa-regular", "fa-circle", "text-slate-300"], [1, "text-[10px]", "font-bold", "bg-orange-100", "dark:bg-orange-900/30", "text-orange-600", "dark:text-orange-400", "px-2", "py-0.5", "rounded-full"], [1, "fa-solid", "fa-chevron-down", "text-[10px]", "text-slate-400", "transition-transform"], [1, "fa-solid", "fa-circle-check", "text-orange-500", "text-lg"], [1, "w-5", "h-5", "border-2", "border-orange-200", "border-t-orange-600", "rounded-full", "animate-spin"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase", "tracking-wider", "pt-3", "pb-1"], [1, "grid", "grid-cols-2", "gap-2"], [1, "flex", "items-center", "gap-2", "p-2.5", "border", "rounded-xl", "cursor-pointer", "transition", "text-xs", "font-bold", 3, "click"], [1, "fa-solid", "fa-circle-dot", "text-orange-600", "text-sm"], [1, "fa-regular", "fa-circle", "text-slate-400", "text-sm", "group-hover:text-orange-400"], [1, "fa-solid", "fa-calculator", "mr-1"], [1, "fa-solid", "fa-calendar-day", "mr-1"], [1, "fa-solid", "fa-calendar-week", "mr-1"], [1, "fa-solid", "fa-crosshairs", "mr-1"], [1, "pt-1"], [1, "flex", "items-center", "gap-2.5", "p-2.5", "border", "rounded-xl", "cursor-pointer", "transition", "group", 3, "click"], [1, "w-4", "h-4", "rounded", "border", "flex", "items-center", "justify-center", "transition", "shrink-0"], [1, "fa-solid", "fa-check", "text-[10px]"], [1, "text-xs", "font-bold"], [1, "text-[10px]", "text-slate-400"], [1, "text-[11px]", "font-bold", "text-slate-500"], ["type", "number", "min", "1", "max", "31", 1, "w-14", "px-2", "py-1", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "text-xs", "text-center", "outline-none", "focus:border-orange-500", "bg-white", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200", "font-bold", 3, "input", "value"], [1, "fa-solid", "fa-circle-check", "text-purple-500", "text-lg"], [1, "w-5", "h-5", "border-2", "border-purple-200", "border-t-purple-600", "rounded-full", "animate-spin"], [1, "fa-solid", "fa-circle-check", "text-blue-500", "text-lg"], [1, "w-5", "h-5", "border-2", "border-blue-200", "border-t-blue-600", "rounded-full", "animate-spin"], [1, "fa-solid", "fa-circle-check", "text-pink-500", "text-lg"], [1, "w-5", "h-5", "border-2", "border-pink-200", "border-t-pink-600", "rounded-full", "animate-spin"], [1, "fa-solid", "fa-file-lines", "text-slate-300", "text-xs"], [1, "text-[10px]", "text-slate-400", "font-medium"]], template: function StatisticsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StatisticsComponent_Conditional_0_Template, 50, 20, "div", 3)(1, StatisticsComponent_Conditional_1_Template, 12, 0, "div", 4)(2, StatisticsComponent_Conditional_2_Template, 62, 65, "app-export-modal", 5);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.auth.canViewReports() ? 0 : 1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showGlobalExportModal() ? 2 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel, DateRangeFilterComponent, ExportModalComponent], encapsulation: 2, changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StatisticsComponent, [{
        type: Component,
        args: [{ selector: 'app-statistics', standalone: true, imports: [CommonModule, FormsModule, DateRangeFilterComponent, ExportModalComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "    @if (auth.canViewReports()) {\r\n        <div class=\"h-full flex flex-col space-y-5 pb-6 fade-in overflow-hidden relative font-sans text-slate-800 dark:text-slate-200\">\r\n            \r\n            <!-- 1. Header with Filters -->\r\n            <div class=\"flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mb-4 z-20\">\r\n                <div class=\"flex items-center gap-3\">\r\n                    <div class=\"w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-sm shrink-0\">\r\n                        <i class=\"fa-solid fa-chart-pie text-base\"></i>\r\n                    </div>\r\n                    <div>\r\n                        <h2 class=\"text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight\">\r\n                            B\u00E1o C\u00E1o Qu\u1EA3n Tr\u1ECB\r\n                        </h2>\r\n                        <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">Ph\u00E2n t\u00EDch hi\u1EC7u su\u1EA5t & ti\u00EAu hao theo th\u1EDDi gian th\u1EF1c.</p>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Filters Area -->\r\n                <div class=\"flex flex-col md:flex-row gap-3 items-end md:items-center flex-wrap\">\r\n                    \r\n                    <!-- SOP Filter -->\r\n                    <div class=\"relative group min-w-[200px]\">\r\n                        <div class=\"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none\">\r\n                            <i class=\"fa-solid fa-filter text-slate-400 dark:text-slate-500 text-xs\"></i>\r\n                        </div>\r\n                        <select [ngModel]=\"selectedSopId()\" (ngModelChange)=\"selectedSopId.set($event)\" \r\n                                class=\"w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition shadow-sm appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-800 h-[42px]\">\r\n                            <option value=\"all\">T\u1EA5t c\u1EA3 Quy tr\u00ECnh (SOP)</option>\r\n                            @for (sop of state.sops(); track sop.id) {\r\n                                <option [value]=\"sop.id\">{{sop.name}}</option>\r\n                            }\r\n                        </select>\r\n                        <div class=\"absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none\">\r\n                            <i class=\"fa-solid fa-chevron-down text-slate-400 dark:text-slate-500 text-[10px]\"></i>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- Date Range Filter Component -->\r\n                    <app-date-range-filter \r\n                        [initStart]=\"startDate()\" \r\n                        [initEnd]=\"endDate()\"\r\n                        (dateChange)=\"onDateRangeChange($event)\">\r\n                    </app-date-range-filter>\r\n\r\n                    <!-- Global Export Button (Moved here) -->\r\n                    <button (click)=\"openGlobalExport()\" \r\n                            class=\"h-[42px] px-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2 group\">\r\n                        <i class=\"fa-solid fa-file-export group-hover:rotate-12 transition-transform\"></i> Xu\u1EA5t B\u00E1o C\u00E1o\r\n                    </button>\r\n\r\n                    <!-- Backfill Button (Admin/Manager only) -->\r\n                    @if (auth.currentUser()?.role === 'manager') {\r\n                        <button (click)=\"runStatsBackfill()\" [disabled]=\"isBackfilling()\"\r\n                                class=\"h-[42px] px-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2 disabled:opacity-50 group\">\r\n                            <i class=\"fa-solid fa-database\" [class.fa-spin]=\"isBackfilling()\"></i> \r\n                            {{ isBackfilling() ? '\u0110ang ch\u1EA1y...' : 'C\u1EADp nh\u1EADt l\u1EA1i D\u1EEF li\u1EC7u (Backfill)' }}\r\n                        </button>\r\n                        \r\n                        @if (isBackfilling() && backfillProgressText()) {\r\n                            <div class=\"text-xs text-orange-600 dark:text-orange-400 font-bold ml-2 animate-pulse\">\r\n                                {{ backfillProgressText() }}\r\n                            </div>\r\n                        }\r\n                    }\r\n\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 2. Detailed Data Tabs -->\r\n            <div class=\"flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden\">\r\n                <div class=\"flex border-b border-slate-100 dark:border-slate-700 px-6 pt-4 shrink-0 gap-8 bg-white dark:bg-slate-800 overflow-x-auto\">\r\n                <button (click)=\"activeTab.set('logs')\" \r\n                    class=\"pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95\"\r\n                    [class]=\"activeTab() === 'logs' ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'\">\r\n                    <i class=\"fa-solid fa-clock-rotate-left\"></i> 1. Nh\u1EADt K\u00FD Ho\u1EA1t \u0110\u1ED9ng\r\n                </button>\r\n                <button (click)=\"activeTab.set('nxt')\" \r\n                    class=\"pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95\"\r\n                    [class]=\"activeTab() === 'nxt' ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'\">\r\n                    @if (selectedSopId() === 'all') {\r\n                        <i class=\"fa-solid fa-boxes-packing\"></i> 2. B\u00E1o c\u00E1o NXT (Kho)\r\n                    } @else {\r\n                        <i class=\"fa-solid fa-list-check\"></i> 2. Chi ti\u1EBFt Xu\u1EA5t kho\r\n                    }\r\n                </button>\r\n                <button (click)=\"activeTab.set('consumption')\"\r\n                    class=\"pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95\"\r\n                    [class]=\"activeTab() === 'consumption' ? 'border-orange-600 dark:border-orange-500 text-orange-700 dark:text-orange-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'\">\r\n                    <i class=\"fa-solid fa-flask\"></i> 3. Ti\u00EAu Hao & Bi\u1EC3u \u0110\u1ED3\r\n                </button>\r\n                <button (click)=\"activeTab.set('sops')\"\r\n                    class=\"pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95\"\r\n                    [class]=\"activeTab() === 'sops' ? 'border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'\">\r\n                    <i class=\"fa-solid fa-list-ol\"></i> 4. T\u1EA7n Su\u1EA5t SOP\r\n                </button>\r\n                <button (click)=\"activeTab.set('standards')\"\r\n                    class=\"pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95\"\r\n                    [class]=\"activeTab() === 'standards' ? 'border-pink-600 dark:border-pink-500 text-pink-700 dark:text-pink-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'\">\r\n                        <i class=\"fa-solid fa-heart-pulse\"></i> 5. S\u1EE9c Kh\u1ECFe & Truy Xu\u1EA5t\r\n                    </button>\r\n                    <div class=\"ml-auto pr-6 flex items-center gap-2\">\r\n                         <!-- Export button moved to filter header -->\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"flex-1 overflow-y-auto p-0 relative bg-white dark:bg-slate-800 custom-scrollbar h-full\">\r\n                    \r\n                    <!-- TAB 1: LOGS -->\r\n                    @if (activeTab() === 'logs') {\r\n                        <table class=\"w-full text-sm text-left\">\r\n                            <thead class=\"text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/50 sticky top-0 backdrop-blur-sm z-10 border-b border-slate-100 dark:border-slate-700\">\r\n                                <tr>\r\n                                    <th class=\"px-6 py-3 font-bold\">Ng\u00E0y/Gi\u1EDD</th>\r\n                                    <th class=\"px-6 py-3 font-bold\">Ho\u1EA1t \u0111\u1ED9ng</th>\r\n                                    <th class=\"px-6 py-3 font-bold\">Chi ti\u1EBFt</th>\r\n                                    <th class=\"px-6 py-3 font-bold\">Ng\u01B0\u1EDDi th\u1EF1c hi\u1EC7n</th>\r\n                                </tr>\r\n                            </thead>\r\n                            <tbody class=\"divide-y divide-slate-50 dark:divide-slate-700/50\">\r\n                                @for (log of filteredLogs(); track log.id) {\r\n                                    <tr class=\"hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition group\">\r\n                                        <td class=\"px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs whitespace-nowrap\">\r\n                                            {{formatDate(log.timestamp)}}\r\n                                        </td>\r\n                                        <td class=\"px-6 py-4\">\r\n                                            <span class=\"inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border\"\r\n                                                [ngClass]=\"{\r\n                                                    'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800': log.action.includes('APPROVE') && !log.action.includes('RESULT'),\r\n                                                    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800': (log.action.includes('STOCK_IN') || log.action.includes('UPDATE') || log.action.includes('CREATE') || log.action.includes('RETURN_STANDARD') || log.action === 'PUBLISH_RESULT_REPORT') && !log.action.includes('DELETE') && !log.action.includes('REJECT'),\r\n                                                    'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800': log.action.includes('STOCK_OUT') || log.action.includes('REQUEST_STANDARD') || log.action.includes('ASSIGN_STANDARD') || log.action === 'REVERT_RESULT_DRAFT',\r\n                                                    'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800': log.action.includes('DELETE') || log.action.includes('REVOKE') || log.action.includes('REJECT') || log.action === 'RESET_RESULT_DATA',\r\n                                                    'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800': log.action === 'SAVE_RESULT_DRAFT',\r\n                                                    'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800': log.action === 'RESTORE_RESULT_BACKUP' || log.action === 'RESTORE_RESULT_VERSION'\r\n                                                }\">\r\n                                                {{getLogActionText(log.action)}}\r\n                                            </span>\r\n                                        </td>\r\n                                        <td class=\"px-6 py-4 text-slate-700 dark:text-slate-300 text-xs font-medium max-w-xs truncate\" [title]=\"log.details\">\r\n                                            {{log.details}}\r\n                                        </td>\r\n                                        <td class=\"px-6 py-4\">\r\n                                            <div class=\"flex items-center gap-2\">\r\n                                                <img [src]=\"getAvatarUrl(log.user, state.getUserAvatarOptions(log.user).style, state.getUserAvatarOptions(log.user).photoURL)\" class=\"w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 object-cover\">\r\n                                                <span class=\"text-slate-600 dark:text-slate-300 font-medium text-xs\">{{log.user}}</span>\r\n                                            </div>\r\n                                        </td>\r\n                                    </tr>\r\n                                } @empty {\r\n                                    <tr><td colspan=\"4\" class=\"p-12 text-center text-slate-400 dark:text-slate-500 italic\">Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u trong kho\u1EA3ng th\u1EDDi gian n\u00E0y.</td></tr>\r\n                                }\r\n                            </tbody>\r\n                        </table>\r\n                    }\r\n\r\n                    <!-- TAB 2: NXT / SOP EXPORT DETAIL -->\r\n                    @if (activeTab() === 'nxt') {\r\n                        <div class=\"flex flex-col h-full\">\r\n                            <div class=\"p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0\">\r\n                                <div>\r\n                                    @if (selectedSopId() === 'all') {\r\n                                        <h3 class=\"font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2\">\r\n                                            <i class=\"fa-solid fa-table\"></i> B\u1EA3ng K\u00EA Nh\u1EADp - Xu\u1EA5t - T\u1ED3n\r\n                                        </h3>\r\n                                        <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-0.5\">D\u1EEF li\u1EC7u to\u00E0n c\u1EE5c c\u1EE7a kho (theo ng\u00E0y th\u1EF1c t\u1EBF).</p>\r\n                                    } @else {\r\n                                        <h3 class=\"font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2\">\r\n                                            <i class=\"fa-solid fa-list-check\"></i> Chi Ti\u1EBFt Xu\u1EA5t Kho theo Quy Tr\u00ECnh\r\n                                        </h3>\r\n                                        <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-0.5\">Ch\u1EC9 hi\u1EC3n th\u1ECB l\u01B0\u1EE3ng h\u00F3a ch\u1EA5t \u0111\u00E3 xu\u1EA5t cho SOP: <span class=\"font-bold text-blue-600 dark:text-blue-400\">{{getSelectedSopName()}}</span></p>\r\n                                    }\r\n                                </div>\r\n                                <div class=\"flex gap-2\">\r\n                                    <button (click)=\"generateNxtReport()\" [disabled]=\"isLoading()\" \r\n                                            class=\"px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-2 disabled:opacity-50 active:scale-95\">\r\n                                        <i class=\"fa-solid fa-calculator\" [class.fa-spin]=\"isLoading()\"></i> T\u00EDnh To\u00E1n\r\n                                    </button>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"flex-1 overflow-auto relative\">\r\n                                @if(isLoading()) {\r\n                                    <div class=\"absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-10 flex items-center justify-center flex-col gap-3\">\r\n                                        <div class=\"w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin\"></div>\r\n                                        <span class=\"text-sm font-bold text-slate-600 dark:text-slate-300\">\u0110ang t\u1EA3i v\u00E0 t\u1ED5ng h\u1EE3p d\u1EEF li\u1EC7u...</span>\r\n                                    </div>\r\n                                }\r\n\r\n                                <table class=\"w-full text-sm text-left border-collapse\">\r\n                                    <thead class=\"text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 shadow-sm\">\r\n                                        <tr>\r\n                                            <th class=\"px-4 py-3 border-b dark:border-slate-700 text-center w-10\">#</th>\r\n                                            <th class=\"px-4 py-3 border-b dark:border-slate-700\">T\u00EAn h\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0</th>\r\n                                            <th class=\"px-4 py-3 border-b dark:border-slate-700 w-24 text-center\">\u0110VT</th>\r\n                                            @if (selectedSopId() === 'all') {\r\n                                                <th class=\"px-4 py-3 border-b dark:border-slate-700 text-right bg-blue-50/30 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300\">T\u1ED3n \u0111\u1EA7u k\u1EF3</th>\r\n                                                <th class=\"px-4 py-3 border-b dark:border-slate-700 text-right text-emerald-700 dark:text-emerald-400\">Nh\u1EADp</th>\r\n                                                <th class=\"px-4 py-3 border-b dark:border-slate-700 text-right text-orange-700 dark:text-orange-400\">Xu\u1EA5t</th>\r\n                                                <th class=\"px-4 py-3 border-b dark:border-slate-700 text-right bg-purple-50/30 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 font-bold border-l border-slate-100 dark:border-slate-700\">T\u1ED3n cu\u1ED1i k\u1EF3</th>\r\n                                            } @else {\r\n                                                <th class=\"px-4 py-3 border-b dark:border-slate-700 text-right text-orange-700 dark:text-orange-400 font-bold bg-orange-50/20 dark:bg-orange-900/20\">T\u1ED5ng xu\u1EA5t ({{getSelectedSopName()}})</th>\r\n                                            }\r\n                                        </tr>\r\n                                    </thead>\r\n                                    <tbody class=\"divide-y divide-slate-100 dark:divide-slate-700\">\r\n                                        @for (row of nxtData(); track row.id; let i = $index) {\r\n                                            <tr class=\"hover:bg-slate-50 dark:hover:bg-slate-700/30 transition\">\r\n                                                <td class=\"px-4 py-3 text-center text-xs text-slate-400 dark:text-slate-500\">{{i+1}}</td>\r\n                                                <td class=\"px-4 py-3\">\r\n                                                    <div class=\"font-bold text-slate-700 dark:text-slate-300 text-xs\">{{row.name}}</div>\r\n                                                    <div class=\"text-[10px] text-slate-400 dark:text-slate-500 font-mono\">{{row.id}}</div>\r\n                                                </td>\r\n                                                <td class=\"px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400\">{{row.unit}}</td>\r\n                                                \r\n                                                @if (selectedSopId() === 'all') {\r\n                                                    <td class=\"px-4 py-3 text-right bg-blue-50/10 dark:bg-blue-900/10 font-mono text-slate-600 dark:text-slate-300\">{{formatNum(row.startStock)}}</td>\r\n                                                    <td class=\"px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold\">{{row.importQty > 0 ? '+' : ''}}{{formatNum(row.importQty)}}</td>\r\n                                                    <td class=\"px-4 py-3 text-right font-mono text-orange-600 dark:text-orange-400 font-bold\">{{row.exportQty > 0 ? '-' : ''}}{{formatNum(row.exportQty)}}</td>\r\n                                                    <td class=\"px-4 py-3 text-right bg-purple-50/10 dark:bg-purple-900/10 font-mono font-black text-slate-800 dark:text-slate-200 border-l border-slate-100 dark:border-slate-700\">{{formatNum(row.endStock)}}</td>\r\n                                                } @else {\r\n                                                    <td class=\"px-4 py-3 text-right font-mono text-orange-600 dark:text-orange-400 font-bold text-base\">{{formatNum(row.exportQty)}}</td>\r\n                                                }\r\n                                            </tr>\r\n                                        } @empty {\r\n                                            <tr><td [attr.colspan]=\"selectedSopId() === 'all' ? 7 : 4\" class=\"p-16 text-center text-slate-400 dark:text-slate-500 italic\">\r\n                                                @if(!hasGenerated()) { Nh\u1EA5n \"T\u00EDnh To\u00E1n\" \u0111\u1EC3 xem b\u00E1o c\u00E1o. } \r\n                                                @else { Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u. }\r\n                                            </td></tr>\r\n                                        }\r\n                                    </tbody>\r\n                                </table>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n\r\n                    <!-- TAB 3: CONSUMPTION DASHBOARD -->\r\n                    @if (activeTab() === 'consumption') {\r\n                        <div class=\"flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 gap-4 p-5 overflow-y-auto custom-scrollbar\">\r\n                            <!-- Chart Grid -->\r\n                            <div class=\"grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 h-[300px]\">\r\n                                <!-- Chart 1: Top 15 (Bar) -->\r\n                                <div class=\"bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm flex flex-col\">\r\n                                    <div class=\"flex justify-between items-center mb-4\">\r\n                                        <h4 class=\"text-[10px] uppercase font-black text-slate-400 tracking-widest\"><i class=\"fa-solid fa-ranking-star mr-2\"></i>Top 15 Ti\u00EAu Hao</h4>\r\n                                    </div>\r\n                                    <div class=\"flex-1 relative min-h-0\">\r\n                                        <canvas #barChartCanvas></canvas>\r\n                                    </div>\r\n                                </div>\r\n                                <!-- Chart 2: Category Dist (Pie) -->\r\n                                <div class=\"bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm flex flex-col\">\r\n                                    <div class=\"flex justify-between items-center mb-4\">\r\n                                        <h4 class=\"text-[10px] uppercase font-black text-slate-400 tracking-widest\"><i class=\"fa-solid fa-chart-pie mr-2\"></i>Ph\u00E2n Lo\u1EA1i</h4>\r\n                                    </div>\r\n                                    <div class=\"flex-1 relative min-h-0\">\r\n                                        <canvas #pieChartCanvas></canvas>\r\n                                    </div>\r\n                                </div>\r\n                                <!-- Chart 3: Trend (Line) -->\r\n                                <div class=\"bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm flex flex-col\">\r\n                                    <div class=\"flex justify-between items-center mb-4\">\r\n                                        <h4 class=\"text-[10px] uppercase font-black text-slate-400 tracking-widest\"><i class=\"fa-solid fa-arrow-trend-up mr-2\"></i>Xu Th\u1EBF Ti\u00EAu Hao</h4>\r\n                                    </div>\r\n                                    <div class=\"flex-1 relative min-h-0\">\r\n                                        <canvas #lineChartCanvas></canvas>\r\n                                    </div>\r\n                                </div>\r\n                            </div> <!-- Close Grid (Line 249) -->\r\n                            \r\n                            <!-- Detailed Table -->\r\n                            <div class=\"bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col shrink-0\">\r\n                                <div class=\"px-6 py-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center shrink-0\">\r\n                                    <h4 class=\"text-xs font-black text-slate-700 dark:text-slate-200\">Chi Ti\u1EBFt L\u01B0\u1EE3ng S\u1EED D\u1EE5ng</h4>\r\n                                </div>\r\n                                <div class=\"overflow-x-auto\">\r\n                                <table class=\"w-full text-sm text-left\">\r\n                                    <thead class=\"text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/80 dark:bg-slate-800/80 sticky top-0 backdrop-blur-sm z-10\">\r\n                                        <tr>\r\n                                            <th class=\"px-6 py-3 border-b dark:border-slate-700 w-12 text-center\">#</th>\r\n                                            <th class=\"px-6 py-3 border-b dark:border-slate-700\">T\u00EAn h\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0</th>\r\n                                            <th class=\"px-6 py-3 border-b dark:border-slate-700 text-right\">T\u1ED5ng l\u01B0\u1EE3ng d\u00F9ng</th>\r\n                                            <th class=\"px-6 py-3 border-b dark:border-slate-700 text-center w-32\">\u0110\u01A1n v\u1ECB</th>\r\n                                        </tr>\r\n                                    </thead>\r\n                                    <tbody class=\"divide-y divide-slate-50 dark:divide-slate-700/50\">\r\n                                        @for (item of consumptionData(); track item.name; let i = $index) {\r\n                                            <tr class=\"hover:bg-slate-50 dark:hover:bg-slate-700/30 transition\">\r\n                                                <td class=\"px-6 py-3 text-center text-xs font-bold text-slate-400 dark:text-slate-500\">{{i+1}}</td>\r\n                                                <td class=\"px-6 py-3 font-semibold text-slate-700 dark:text-slate-300\">\r\n                                                    {{item.displayName}}\r\n                                                    @if(item.name !== item.displayName) {\r\n                                                        <span class=\"text-[10px] text-slate-400 dark:text-slate-500 font-mono ml-1\">({{item.name}})</span>\r\n                                                    }\r\n                                                </td>\r\n                                                <td class=\"px-6 py-3 text-right font-bold text-slate-800 dark:text-slate-200 font-mono text-base\">{{formatNum(item.amount)}}</td>\r\n                                                <td class=\"px-6 py-3 text-center\">\r\n                                                    <span [class]=\"getUnitClass(item.unit)\" class=\"px-3 py-1 rounded-full text-[10px] font-bold border uppercase inline-block shadow-sm\">{{item.unit}}</span>\r\n                                                </td>\r\n                                            </tr>\r\n                                        } @empty {\r\n                                            <tr><td colspan=\"4\" class=\"p-12 text-center text-slate-400 dark:text-slate-500 italic\">Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u ti\u00EAu hao cho ti\u00EAu ch\u00ED l\u1ECDc n\u00E0y.</td></tr>\r\n                                        }\r\n                                    </tbody>\r\n                                </table>\r\n                                </div> <!-- Close horizontal scroll (Line 288) -->\r\n                            </div> <!-- Close Table container (Line 280) -->\r\n                        </div> <!-- Close Tab container (Line 247) -->\r\n                    }\r\n\r\n                    <!-- TAB 4: SOP FREQUENCY -->\r\n                    @if (activeTab() === 'sops') {\r\n                        <div class=\"flex flex-col h-full\">\r\n                            <div class=\"p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0\">\r\n                                <h3 class=\"font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2\">\r\n                                    <i class=\"fa-solid fa-list-ol\"></i> Th\u1ED1ng K\u00EA T\u1EA7n Su\u1EA5t Quy Tr\u00ECnh\r\n                                </h3>\r\n\r\n                            </div>\r\n                            <div class=\"flex-1 overflow-y-auto custom-scrollbar\">\r\n                                <table class=\"w-full text-sm text-left\">\r\n                                    <thead class=\"text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/80 dark:bg-slate-800/80 sticky top-0 backdrop-blur-sm z-10 border-b border-slate-100 dark:border-slate-700\">\r\n                                <tr>\r\n                                    <th class=\"px-6 py-3\">Quy tr\u00ECnh (SOP)</th>\r\n                                    <th class=\"px-6 py-3 text-center\">S\u1ED1 l\u1EA7n ch\u1EA1y (Runs)</th>\r\n                                    <th class=\"px-6 py-3 text-center text-blue-700 dark:text-blue-400\">T\u1ED5ng s\u1ED1 m\u1EABu</th>\r\n                                    <th class=\"px-6 py-3 text-center text-purple-700 dark:text-purple-400\">T\u1ED5ng QC</th>\r\n                                    <th class=\"px-6 py-3 text-right w-48\">T\u1EF7 tr\u1ECDng</th>\r\n                                </tr>\r\n                            </thead>\r\n                            <tbody class=\"divide-y divide-slate-50 dark:divide-slate-700/50\">\r\n                                @for (item of sopFrequencyData(); track item.name) {\r\n                                    <tr class=\"hover:bg-slate-50 dark:hover:bg-slate-700/30 transition\">\r\n                                        <td class=\"px-6 py-4 font-bold text-slate-700 dark:text-slate-300\">{{item.name}}</td>\r\n                                        <td class=\"px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200 text-lg\">{{item.count}}</td>\r\n                                        <td class=\"px-6 py-4 text-center\"><span class=\"font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md\">{{item.samples}}</span></td>\r\n                                        <td class=\"px-6 py-4 text-center\"><span class=\"font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md\">{{item.qcs}}</span></td>\r\n                                        <td class=\"px-6 py-4 text-right align-middle\">\r\n                                        <div class=\"flex items-center gap-3 justify-end w-full\">\r\n                                            <div class=\"flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden shadow-inner max-w-[100px]\">\r\n                                                <div class=\"bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full\" [style.width.%]=\"item.percent\"></div>\r\n                                            </div>\r\n                                            <span class=\"text-xs font-bold text-slate-500 dark:text-slate-400 w-10 text-right\">{{formatNum(item.percent)}}%</span>\r\n                                        </div>\r\n                                        </td>\r\n                                    </tr>\r\n                                } @empty {\r\n                                    <tr><td colspan=\"5\" class=\"p-12 text-center text-slate-400 dark:text-slate-500 italic\">Ch\u01B0a ch\u1EA1y quy tr\u00ECnh n\u00E0o trong th\u1EDDi gian n\u00E0y.</td></tr>\r\n                                }\r\n                                </table>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n\r\n                    <!-- TAB 5: TRACEABILITY & HEALTH DASHBOARD -->\r\n                    @if (activeTab() === 'standards') {\r\n                        <div class=\"flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 gap-4 p-5 overflow-y-auto custom-scrollbar\">\r\n                            <!-- Health Status Cards -->\r\n                            <!-- Health Status Cards -->\r\n                            <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0\">\r\n                                <div class=\"bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between\">\r\n                                    <div>\r\n                                        <div class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1\">\u0110ang m\u01B0\u1EE3n / S\u1EED d\u1EE5ng</div>\r\n                                        <div class=\"text-3xl font-black text-blue-600 dark:text-blue-400\">{{healthStats().borrowing}}</div>\r\n                                        <p class=\"text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight\">Chu\u1EA9n \u0111ang l\u01B0u \u0111\u1ED9ng ngo\u00E0i kho</p>\r\n                                    </div>\r\n                                    <div class=\"w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-3xl shadow-inner\"><i class=\"fa-solid fa-flask-vial\"></i></div>\r\n                                </div>\r\n\r\n                            </div>\r\n\r\n                            <div class=\"grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0\">\r\n                                <!-- Recent Critical Events (Traceability Trail) -->\r\n                                <div class=\"bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col min-h-0\">\r\n                                    <div class=\"px-6 py-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center shrink-0\">\r\n                                        <h4 class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest\">Truy Xu\u1EA5t Ho\u1EA1t \u0110\u1ED9ng Tr\u1ECDng Y\u1EBFu</h4>\r\n                                    </div>\r\n                                    <div class=\"flex-1 overflow-y-auto p-4 custom-scrollbar\">\r\n                                        <div class=\"space-y-3\">\r\n                                            @for(log of criticalLogs(); track log.id) {\r\n                                                <div class=\"flex gap-4 p-3 rounded-2xl border border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition\">\r\n                                                    <div class=\"w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-indigo-500 shrink-0\">\r\n                                                        <i [class]=\"getLogActionIcon(log.action)\"></i>\r\n                                                    </div>\r\n                                                    <div>\r\n                                                        <div class=\"text-xs font-black text-slate-700 dark:text-slate-200\">{{log.details}}</div>\r\n                                                        <div class=\"flex items-center gap-2 mt-1\">\r\n                                                            <span class=\"text-[10px] font-bold text-slate-400\">{{formatDate(log.timestamp)}}</span>\r\n                                                            <span class=\"text-slate-300\">\u2022</span>\r\n                                                            <span class=\"text-[10px] font-black text-indigo-500\">{{log.user}}</span>\r\n                                                        </div>\r\n                                                    </div>\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n\r\n\r\n                            </div>\r\n                        </div>\r\n                    }\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n\r\n    } @else {\r\n        <div class=\"h-full flex items-center justify-center fade-in\">\r\n            <div class=\"bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30 max-w-md text-center\">\r\n                <div class=\"w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl\">\r\n                    <i class=\"fa-solid fa-lock\"></i>\r\n                </div>\r\n                <h3 class=\"text-xl font-bold text-slate-800 dark:text-slate-200 mb-2\">Quy\u1EC1n Truy C\u1EADp B\u1ECB t\u1EEB Ch\u1ED1i</h3>\r\n                <p class=\"text-slate-500 dark:text-slate-400 text-sm mb-6\">B\u1EA1n kh\u00F4ng c\u00F3 quy\u1EC1n xem B\u00E1o c\u00E1o Qu\u1EA3n tr\u1ECB. Vui l\u00F2ng li\u00EAn h\u1EC7 Qu\u1EA3n l\u00FD (Manager) \u0111\u1EC3 \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n.</p>\r\n                <div class=\"text-xs font-mono bg-slate-100 dark:bg-slate-700 p-2 rounded text-slate-600 dark:text-slate-300\">\r\n                    Quy\u1EC1n c\u1EA7n c\u00F3: <b>REPORT_VIEW</b>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    }\r\n\r\n    <!-- GLOBAL EXPORT MODAL -->\r\n    @if (showGlobalExportModal()) {\r\n        <app-export-modal\r\n            title=\"Xu\u1EA5t b\u00E1o c\u00E1o t\u1ED5ng h\u1EE3p\"\r\n            [dateRangeText]=\"startDate() + ' \u2192 ' + endDate()\"\r\n            [subtitle]=\"selectedSopId() !== 'all' ? 'SOP: ' + getSelectedSopName() : ''\"\r\n            [isExporting]=\"isExporting()\"\r\n            [isCompleted]=\"exportProgress().cover === 'done'\"\r\n            [footerText]=\"getSelectedSheetsCount() + ' sheet(s) s\u1EBD \u0111\u01B0\u1EE3c xu\u1EA5t'\"\r\n            (close)=\"showGlobalExportModal.set(false)\"\r\n            (execute)=\"runGlobalExport()\"\r\n            [isSubmitDisabled]=\"getSelectedSheetsCount() === 0\">\r\n            \r\n            <!-- Quick Presets -->\r\n                    @if (!isExporting()) {\r\n                    <div class=\"px-5 pt-5 pb-3\">\r\n                        <div class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3\"><i class=\"fa-solid fa-bolt mr-1\"></i> M\u1EABu b\u00E1o c\u00E1o g\u1EE3i \u00FD</div>\r\n                        <div class=\"flex flex-wrap gap-2\">\r\n                            <button (click)=\"applyPreset('monthly')\" class=\"px-3 py-1.5 rounded-xl text-[11px] font-bold border transition active:scale-95\"\r\n                                    [class]=\"activePreset() === 'monthly' ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300'\"\r\n                                    title=\"Ch\u1EC9 t\u00EDnh to\u00E1n v\u00E0 t\u00F3m t\u1EAFt theo th\u00E1ng\">\r\n                                <i class=\"fa-solid fa-calendar-days mr-1\"></i> B\u00E1o C\u00E1o K\u1EBF Ho\u1EA1ch (NXT + TH)\r\n                            </button>\r\n                            <button (click)=\"applyPreset('detailed')\" class=\"px-3 py-1.5 rounded-xl text-[11px] font-bold border transition active:scale-95\"\r\n                                    [class]=\"activePreset() === 'detailed' ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300'\"\r\n                                    title=\"T\u00E1ch b\u1EA1ch d\u1EEF li\u1EC7u theo ng\u00E0y v\u00E0 t\u1EEBng SOP \u0111\u1EC3 ph\u00E2n t\u00EDch hi\u1EC7u n\u0103ng\">\r\n                                <i class=\"fa-solid fa-magnifying-glass-chart mr-1\"></i> Ph\u00E2n T\u00EDch D\u1EEF Li\u1EC7u Chi Ti\u1EBFt\r\n                            </button>\r\n                            <button (click)=\"applyPreset('accounting')\" class=\"px-3 py-1.5 rounded-xl text-[11px] font-bold border transition active:scale-95\"\r\n                                    [class]=\"activePreset() === 'accounting' ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300'\"\r\n                                    title=\"S\u1ED1 li\u1EC7u thu\u1EA7n thi\u1EBFt, lo\u1EA1i tr\u1EEB m\u1ECDi m\u1ED1c hao h\u1EE5t\">\r\n                                <i class=\"fa-solid fa-receipt mr-1\"></i> D\u1EEF Li\u1EC7u K\u1EBF To\u00E1n v\u00E0 Mua H\u00E0ng\r\n                            </button>\r\n                            <button (click)=\"applyPreset('all')\" class=\"px-3 py-1.5 rounded-xl text-[11px] font-bold border transition active:scale-95\"\r\n                                    [class]=\"activePreset() === 'all' ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300'\">\r\n                                <i class=\"fa-solid fa-layer-group mr-1\"></i> Xu\u1EA5t T\u1EA5t C\u1EA3\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                    }\r\n\r\n                    <!-- Report Sections -->\r\n                    <div class=\"px-5 pb-5 space-y-2\">\r\n                        @if (!isExporting()) {\r\n                            <div class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-2\"><i class=\"fa-solid fa-list-check mr-1\"></i> Ch\u1ECDn n\u1ED9i dung</div>\r\n                        } @else {\r\n                            <div class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-2\"><i class=\"fa-solid fa-gear fa-spin mr-1\"></i> \u0110ang xu\u1EA5t...</div>\r\n                        }\r\n\r\n                        <!-- 1. NXT -->\r\n                        <div class=\"border rounded-2xl overflow-hidden transition-all\" \r\n                             [class]=\"exportInventory() ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-700'\">\r\n                            <button (click)=\"!isExporting() && exportInventory.set(!exportInventory()); activePreset.set(null)\" [disabled]=\"isExporting()\"\r\n                                    class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default\">\r\n                                <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                                     [class]=\"exportInventory() ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                                    <i [class]=\"exportInventory() ? 'fa-solid fa-check' : 'fa-solid fa-boxes-packing'\"></i>\r\n                                </div>\r\n                                <div class=\"flex-1 text-left\">\r\n                                    <div class=\"text-sm font-black\" [class]=\"exportInventory() ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'\">1. B\u00E1o C\u00E1o Nh\u1EADp - Xu\u1EA5t - T\u1ED3n (NXT)</div>\r\n                                    <div class=\"text-[11px] text-slate-500\">Bi\u1EBFn \u0110\u1ED9ng Kho Chi Ti\u1EBFt T\u1EEBng M\u1EB7t H\u00E0ng</div>\r\n                                </div>\r\n                                @if (exportInventory()) {\r\n                                    <span class=\"text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full\">{{nxtData().length || state.inventory().length}} items</span>\r\n                                }\r\n                                @if (isExporting()) {\r\n                                    @if (exportProgress().nxt === 'done') { <i class=\"fa-solid fa-circle-check text-emerald-500 text-lg\"></i> }\r\n                                    @else if (exportProgress().nxt === 'working') { <span class=\"w-5 h-5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin\"></span> }\r\n                                    @else { <i class=\"fa-regular fa-circle text-slate-300\"></i> }\r\n                                }\r\n                            </button>\r\n                        </div>\r\n\r\n                        <!-- 2. Consumption -->\r\n                        <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                             [class]=\"exportConsumption() ? 'border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-900/10' : 'border-slate-100 dark:border-slate-700'\">\r\n                            <button (click)=\"!isExporting() && toggleConsumption()\" [disabled]=\"isExporting()\"\r\n                                    class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default\">\r\n                                <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                                     [class]=\"exportConsumption() ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                                    <i [class]=\"exportConsumption() ? 'fa-solid fa-check' : 'fa-solid fa-flask'\"></i>\r\n                                </div>\r\n                                <div class=\"flex-1 text-left\">\r\n                                    <div class=\"text-sm font-black\" [class]=\"exportConsumption() ? 'text-orange-700 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300'\">2. D\u1EEF Li\u1EC7u Ti\u00EAu Hao H\u00F3a Ch\u1EA5t</div>\r\n                                    <div class=\"text-[11px] text-slate-500\">T\u1ED5ng H\u1EE3p L\u01B0\u1EE3ng D\u00F9ng D\u1EF1a tr\u00EAn Phi\u1EBFu \u0110\u00E3 Duy\u1EC7t</div>\r\n                                </div>\r\n                                @if (exportConsumption()) {\r\n                                    <span class=\"text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full\">{{consumptionData().length}} items</span>\r\n                                    <i class=\"fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform\" [class.rotate-180]=\"showConsumptionOptions()\"></i>\r\n                                }\r\n                                @if (isExporting()) {\r\n                                    @if (exportProgress().consumption === 'done') { <i class=\"fa-solid fa-circle-check text-orange-500 text-lg\"></i> }\r\n                                    @else if (exportProgress().consumption === 'working') { <span class=\"w-5 h-5 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin\"></span> }\r\n                                    @else { <i class=\"fa-regular fa-circle text-slate-300\"></i> }\r\n                                }\r\n                            </button>\r\n                            <!-- Consumption Sub-options (Accordion) -->\r\n                            @if (exportConsumption() && showConsumptionOptions() && !isExporting()) {\r\n                                <div class=\"px-4 pb-4 space-y-2 border-t border-orange-100 dark:border-orange-900/30 bg-white/50 dark:bg-slate-800/50\">\r\n                                    <div class=\"text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-3 pb-1\">Ch\u1EBF \u0111\u1ED9 xu\u1EA5t</div>\r\n                                    <div class=\"grid grid-cols-2 gap-2\">\r\n                                        <div (click)=\"exportType.set('summary'); activePreset.set(null)\" class=\"flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition text-xs font-bold\"\r\n                                             [class]=\"exportType() === 'summary' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300'\">\r\n                                            @if (exportType() === 'summary') { <i class=\"fa-solid fa-circle-dot text-orange-600 text-sm\"></i> }\r\n                                            @else { <i class=\"fa-regular fa-circle text-slate-400 text-sm group-hover:text-orange-400\"></i> }\r\n                                            <span><i class=\"fa-solid fa-calculator mr-1\"></i>T\u1ED5ng h\u1EE3p</span>\r\n                                        </div>\r\n                                        <div (click)=\"exportType.set('daily'); activePreset.set(null)\" class=\"flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition text-xs font-bold\"\r\n                                             [class]=\"exportType() === 'daily' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300'\">\r\n                                            @if (exportType() === 'daily') { <i class=\"fa-solid fa-circle-dot text-orange-600 text-sm\"></i> }\r\n                                            @else { <i class=\"fa-regular fa-circle text-slate-400 text-sm group-hover:text-orange-400\"></i> }\r\n                                            <span><i class=\"fa-solid fa-calendar-day mr-1\"></i>Theo ng\u00E0y</span>\r\n                                        </div>\r\n                                        <div (click)=\"exportType.set('monthly'); activePreset.set(null)\" class=\"flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition text-xs font-bold\"\r\n                                             [class]=\"exportType() === 'monthly' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300'\">\r\n                                            @if (exportType() === 'monthly') { <i class=\"fa-solid fa-circle-dot text-orange-600 text-sm\"></i> }\r\n                                            @else { <i class=\"fa-regular fa-circle text-slate-400 text-sm group-hover:text-orange-400\"></i> }\r\n                                            <span><i class=\"fa-solid fa-calendar-week mr-1\"></i>Theo th\u00E1ng</span>\r\n                                        </div>\r\n                                        <div (click)=\"exportType.set('specific_day'); activePreset.set(null)\" class=\"flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition text-xs font-bold\"\r\n                                             [class]=\"exportType() === 'specific_day' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300'\">\r\n                                            @if (exportType() === 'specific_day') { <i class=\"fa-solid fa-circle-dot text-orange-600 text-sm\"></i> }\r\n                                            @else { <i class=\"fa-regular fa-circle text-slate-400 text-sm group-hover:text-orange-400\"></i> }\r\n                                            <span><i class=\"fa-solid fa-crosshairs mr-1\"></i>Ng\u00E0y c\u1EE5 th\u1EC3</span>\r\n                                        </div>\r\n                                    </div>\r\n                                    @if (exportType() === 'specific_day') {\r\n                                        <div class=\"flex items-center gap-2 mt-1\">\r\n                                            <span class=\"text-[11px] font-bold text-slate-500\">L\u1ECDc ng\u00E0y:</span>\r\n                                            <input type=\"number\" min=\"1\" max=\"31\" [value]=\"specificDay() || 1\" (input)=\"onSpecificDayChange($event)\" class=\"w-14 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-center outline-none focus:border-orange-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold\">\r\n                                            <span class=\"text-[10px] text-slate-400\">h\u00E0ng th\u00E1ng</span>\r\n                                        </div>\r\n                                    }\r\n                                    <div class=\"pt-1\">\r\n                                        <div (click)=\"excludeMargin.set(!excludeMargin()); activePreset.set(null)\" class=\"flex items-center gap-2.5 p-2.5 border rounded-xl cursor-pointer transition group\"\r\n                                             [class]=\"excludeMargin() ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700'\">\r\n                                            <div class=\"w-4 h-4 rounded border flex items-center justify-center transition shrink-0\"\r\n                                                 [class]=\"excludeMargin() ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 group-hover:border-amber-400'\">\r\n                                                @if (excludeMargin()) { <i class=\"fa-solid fa-check text-[10px]\"></i> }\r\n                                            </div>\r\n                                            <div>\r\n                                                <div class=\"text-xs font-bold\" [class]=\"excludeMargin() ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'\">B\u1ECF qua Hao h\u1EE5t (Safety Margin)</div>\r\n                                                <div class=\"text-[10px] text-slate-400\">Xu\u1EA5t s\u1ED1 li\u1EC7u g\u1ED1c, kh\u00F4ng c\u1ED9ng th\u00EAm ph\u1EA7n hao h\u1EE5t</div>\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"pt-1\">\r\n                                        <div (click)=\"exportPerSop.set(!exportPerSop()); activePreset.set(null)\" class=\"flex items-center gap-2.5 p-2.5 border rounded-xl cursor-pointer transition group\"\r\n                                             [class]=\"exportPerSop() ? 'bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800' : 'border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700'\">\r\n                                            <div class=\"w-4 h-4 rounded border flex items-center justify-center transition shrink-0\"\r\n                                                 [class]=\"exportPerSop() ? 'bg-violet-500 border-violet-500 text-white' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 group-hover:border-violet-400'\">\r\n                                                @if (exportPerSop()) { <i class=\"fa-solid fa-check text-[10px]\"></i> }\r\n                                            </div>\r\n                                            <div>\r\n                                                <div class=\"text-xs font-bold\" [class]=\"exportPerSop() ? 'text-violet-700 dark:text-violet-400' : 'text-slate-600 dark:text-slate-300'\">T\u00E1ch ri\u00EAng theo t\u1EEBng SOP</div>\r\n                                                <div class=\"text-[10px] text-slate-400\">M\u1ED7i SOP = 1 sheet ri\u00EAng bi\u1EC7t trong t\u1EC7p Excel</div>\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            }\r\n                        </div>\r\n\r\n                        <!-- 3. SOP Frequency -->\r\n                        <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                             [class]=\"exportSop() ? 'border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/10' : 'border-slate-100 dark:border-slate-700'\">\r\n                            <button (click)=\"!isExporting() && exportSop.set(!exportSop()); activePreset.set(null)\" [disabled]=\"isExporting()\"\r\n                                    class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default\">\r\n                                <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                                     [class]=\"exportSop() ? 'bg-purple-500 text-white shadow-purple-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                                    <i [class]=\"exportSop() ? 'fa-solid fa-check' : 'fa-solid fa-list-ol'\"></i>\r\n                                </div>\r\n                                <div class=\"flex-1 text-left\">\r\n                                    <div class=\"text-sm font-black\" [class]=\"exportSop() ? 'text-purple-700 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'\">3. T\u1EA7n Su\u1EA5t Quy Tr\u00ECnh (SOP)</div>\r\n                                    <div class=\"text-[11px] text-slate-500\">Th\u1ED1ng K\u00EA S\u1ED1 L\u1EA7n Ch\u1EA1y, M\u1EABu v\u00E0 QC</div>\r\n                                </div>\r\n                                @if (exportSop()) {\r\n                                    <span class=\"text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full\">{{sopFrequencyData().length}} SOPs</span>\r\n                                }\r\n                                @if (isExporting()) {\r\n                                    @if (exportProgress().sop === 'done') { <i class=\"fa-solid fa-circle-check text-purple-500 text-lg\"></i> }\r\n                                    @else if (exportProgress().sop === 'working') { <span class=\"w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin\"></span> }\r\n                                    @else { <i class=\"fa-regular fa-circle text-slate-300\"></i> }\r\n                                }\r\n                            </button>\r\n                        </div>\r\n\r\n                        <!-- 4. Audit Logs -->\r\n                        <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                             [class]=\"exportLogs() ? 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-700'\">\r\n                            <button (click)=\"!isExporting() && exportLogs.set(!exportLogs()); activePreset.set(null)\" [disabled]=\"isExporting()\"\r\n                                    class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default\">\r\n                                <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                                     [class]=\"exportLogs() ? 'bg-blue-500 text-white shadow-blue-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                                    <i [class]=\"exportLogs() ? 'fa-solid fa-check' : 'fa-solid fa-clock-rotate-left'\"></i>\r\n                                </div>\r\n                                <div class=\"flex-1 text-left\">\r\n                                    <div class=\"text-sm font-black\" [class]=\"exportLogs() ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'\">4. Nh\u1EADt K\u00FD Ho\u1EA1t \u0110\u1ED9ng (Audit Log)</div>\r\n                                    <div class=\"text-[11px] text-slate-500\">To\u00E0n B\u1ED9 Thao T\u00E1c trong Kho\u1EA3ng Th\u1EDDi Gian</div>\r\n                                </div>\r\n                                @if (exportLogs()) {\r\n                                    <span class=\"text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full\">{{filteredLogs().length}} entries</span>\r\n                                }\r\n                                @if (isExporting()) {\r\n                                    @if (exportProgress().logs === 'done') { <i class=\"fa-solid fa-circle-check text-blue-500 text-lg\"></i> }\r\n                                    @else if (exportProgress().logs === 'working') { <span class=\"w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin\"></span> }\r\n                                    @else { <i class=\"fa-regular fa-circle text-slate-300\"></i> }\r\n                                }\r\n                            </button>\r\n                        </div>\r\n\r\n                        <!-- 5. Standards Health -->\r\n                        <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                             [class]=\"exportStandards() ? 'border-pink-200 dark:border-pink-800 bg-pink-50/30 dark:bg-pink-900/10' : 'border-slate-100 dark:border-slate-700'\">\r\n                            <button (click)=\"!isExporting() && exportStandards.set(!exportStandards()); activePreset.set(null)\" [disabled]=\"isExporting()\"\r\n                                    class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default\">\r\n                                <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                                     [class]=\"exportStandards() ? 'bg-pink-500 text-white shadow-pink-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                                    <i [class]=\"exportStandards() ? 'fa-solid fa-check' : 'fa-solid fa-heart-pulse'\"></i>\r\n                                </div>\r\n                                <div class=\"flex-1 text-left\">\r\n                                    <div class=\"text-sm font-black\" [class]=\"exportStandards() ? 'text-pink-700 dark:text-pink-400' : 'text-slate-600 dark:text-slate-300'\">5. T\u00ECnh Tr\u1EA1ng v\u00E0 Truy Xu\u1EA5t Ch\u1EA5t Chu\u1EA9n</div>\r\n                                    <div class=\"text-[11px] text-slate-500\">Chu\u1EA9n \u0110ang M\u01B0\u1EE3n, Qu\u00E1 H\u1EA1n, H\u1EBFt H\u1EA1n</div>\r\n                                </div>\r\n                                @if (exportStandards()) {\r\n                                    <span class=\"text-[10px] font-bold bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full\">{{healthStats().borrowing}} records</span>\r\n                                }\r\n                                @if (isExporting()) {\r\n                                    @if (exportProgress().standards === 'done') { <i class=\"fa-solid fa-circle-check text-pink-500 text-lg\"></i> }\r\n                                    @else if (exportProgress().standards === 'working') { <span class=\"w-5 h-5 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin\"></span> }\r\n                                    @else { <i class=\"fa-regular fa-circle text-slate-300\"></i> }\r\n                                }\r\n                            </button>\r\n                        </div>\r\n\r\n                        <!-- Cover sheet info -->\r\n                        @if (!isExporting()) {\r\n                            <div class=\"flex items-center gap-2 px-4 py-2 mt-1\">\r\n                                <i class=\"fa-solid fa-file-lines text-slate-300 text-xs\"></i>\r\n                                <span class=\"text-[10px] text-slate-400 font-medium\">Sheet \"Trang b\u00ECa\" v\u1EDBi KPIs t\u00F3m t\u1EAFt s\u1EBD t\u1EF1 \u0111\u1ED9ng \u0111\u01B0\u1EE3c th\u00EAm v\u00E0o file</span>\r\n                            </div>\r\n                        }\r\n                    </div>\r\n        </app-export-modal>\r\n    }" }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StatisticsComponent, { className: "StatisticsComponent", filePath: "src/app/features/dashboard/statistics.component.ts", lineNumber: 32 }); })();
//# sourceMappingURL=statistics.component.js.map