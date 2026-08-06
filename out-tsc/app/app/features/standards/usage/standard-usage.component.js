import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StandardService } from '../standard.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const StandardUsageComponent_Conditional_109_Defer_1_DepsFn = () => [i1.DatePipe, import("../../../shared/components/export-modal/export-modal.component").then(m => m.ExportModalComponent)];
const _c0 = () => [1, 2, 3, 4, 5, 6];
const _forTrack0 = ($index, $item) => $item.id;
function StandardUsageComponent_For_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 19);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r1);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r1);
} }
function StandardUsageComponent_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 52);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_49_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearFilters()); });
    i0.ɵɵtext(1, " X\u00F3a L\u1ECDc ");
    i0.ɵɵelementEnd();
} }
function StandardUsageComponent_Conditional_50_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 53);
    i0.ɵɵelement(1, "i", 57);
    i0.ɵɵtext(2);
    i0.ɵɵelementStart(3, "button", 58);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_50_Conditional_1_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.searchTerm.set("")); });
    i0.ɵɵelement(4, "i", 59);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \"", ctx_r2.searchTerm(), "\" ");
} }
function StandardUsageComponent_Conditional_50_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 54);
    i0.ɵɵelement(1, "i", 60);
    i0.ɵɵtext(2);
    i0.ɵɵelementStart(3, "button", 61);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_50_Conditional_2_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.userFilter.set("")); });
    i0.ɵɵelement(4, "i", 59);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.userFilter(), " ");
} }
function StandardUsageComponent_Conditional_50_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 55);
    i0.ɵɵelement(1, "i", 62);
    i0.ɵɵtext(2);
    i0.ɵɵelementStart(3, "button", 63);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_50_Conditional_3_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.actionFilter.set("")); });
    i0.ɵɵelement(4, "i", 59);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.actionFilter() === "usage" ? "S\u1EED d\u1EE5ng" : ctx_r2.actionFilter() === "return" ? "Ho\u00E0n tr\u1EA3 / Tr\u1EEB kho" : "Import", " ");
} }
function StandardUsageComponent_Conditional_50_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 56);
    i0.ɵɵelement(1, "i", 64);
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "date");
    i0.ɵɵelement(4, "i", 65);
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementStart(7, "button", 66);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_50_Conditional_4_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); ctx_r2.fromDate.set(""); return i0.ɵɵresetView(ctx_r2.toDate.set("")); });
    i0.ɵɵelement(8, "i", 59);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.fromDate() ? i0.ɵɵpipeBind2(3, 2, ctx_r2.fromDate(), "dd/MM/yyyy") : "...", " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.toDate() ? i0.ɵɵpipeBind2(6, 5, ctx_r2.toDate(), "dd/MM/yyyy") : "...", " ");
} }
function StandardUsageComponent_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 25);
    i0.ɵɵtemplate(1, StandardUsageComponent_Conditional_50_Conditional_1_Template, 5, 1, "div", 53)(2, StandardUsageComponent_Conditional_50_Conditional_2_Template, 5, 1, "div", 54)(3, StandardUsageComponent_Conditional_50_Conditional_3_Template, 5, 1, "div", 55)(4, StandardUsageComponent_Conditional_50_Conditional_4_Template, 9, 8, "div", 56);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.searchTerm() ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.userFilter() ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.actionFilter() ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.fromDate() || ctx_r2.toDate() ? 4 : -1);
} }
function StandardUsageComponent_Conditional_84_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 39);
    i0.ɵɵelement(1, "i", 67);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "\u0110ang truy xu\u1EA5t d\u1EEF li\u1EC7u t\u1EEB m\u00E1y ch\u1EE7 theo kho\u1EA3ng ng\u00E0y. (Gi\u1EDBi h\u1EA1n t\u1ED1i \u0111a 500 k\u1EBFt qu\u1EA3). X\u00F3a b\u1ED9 l\u1ECDc ng\u00E0y \u0111\u1EC3 xem d\u1EEF li\u1EC7u theo th\u1EDDi gian th\u1EF1c m\u1EDBi nh\u1EA5t.");
    i0.ɵɵelementEnd()();
} }
function StandardUsageComponent_Conditional_92_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 68);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("fa-sort-up", ctx_r2.sortDirection() === "asc")("fa-sort-down", ctx_r2.sortDirection() === "desc");
} }
function StandardUsageComponent_Conditional_93_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 46);
} }
function StandardUsageComponent_Conditional_96_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 68);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("fa-sort-up", ctx_r2.sortDirection() === "asc")("fa-sort-down", ctx_r2.sortDirection() === "desc");
} }
function StandardUsageComponent_Conditional_97_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 46);
} }
function StandardUsageComponent_Conditional_100_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 68);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("fa-sort-up", ctx_r2.sortDirection() === "asc")("fa-sort-down", ctx_r2.sortDirection() === "desc");
} }
function StandardUsageComponent_Conditional_101_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 46);
} }
function StandardUsageComponent_Conditional_106_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 69)(1, "td", 70);
    i0.ɵɵelement(2, "div", 71);
    i0.ɵɵelementEnd()();
} }
function StandardUsageComponent_Conditional_106_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, StandardUsageComponent_Conditional_106_For_1_Template, 3, 0, "tr", 69, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function StandardUsageComponent_Conditional_107_For_1_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 77);
    i0.ɵɵtext(1, "Nh\u1EADp b\u00F9");
    i0.ɵɵelementEnd();
} }
function StandardUsageComponent_Conditional_107_For_1_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 82);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const log_r9 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Lot: ", log_r9.lotNumber, "");
} }
function StandardUsageComponent_Conditional_107_For_1_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 83);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const log_r9 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(log_r9.internalId);
} }
function StandardUsageComponent_Conditional_107_For_1_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 84);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const log_r9 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(log_r9.manufacturer);
} }
function StandardUsageComponent_Conditional_107_For_1_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 90);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_107_For_1_Conditional_28_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const log_r9 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.deleteUsage(log_r9)); });
    i0.ɵɵelement(1, "i", 91);
    i0.ɵɵelementEnd();
} }
function StandardUsageComponent_Conditional_107_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 72)(1, "td", 73)(2, "div", 2)(3, "div", 74);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div")(6, "div", 75)(7, "div", 76);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, StandardUsageComponent_Conditional_107_For_1_Conditional_9_Template, 2, 0, "span", 77);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 78);
    i0.ɵɵtext(11);
    i0.ɵɵpipe(12, "date");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(13, "td", 73)(14, "div", 79)(15, "span", 80);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_107_For_1_Template_span_click_15_listener() { const log_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(log_r9.standardId && ctx_r2.router.navigate(["/standards", log_r9.standardId])); });
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 81);
    i0.ɵɵtemplate(18, StandardUsageComponent_Conditional_107_For_1_Conditional_18_Template, 2, 1, "span", 82)(19, StandardUsageComponent_Conditional_107_For_1_Conditional_19_Template, 2, 1, "span", 83)(20, StandardUsageComponent_Conditional_107_For_1_Conditional_20_Template, 2, 1, "span", 84);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "td", 85)(22, "div", 86);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "td", 73)(25, "span", 87);
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "td", 88);
    i0.ɵɵtemplate(28, StandardUsageComponent_Conditional_107_For_1_Conditional_28_Template, 2, 0, "button", 89);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const log_r9 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", (log_r9.user || "?").charAt(0).toUpperCase(), " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(log_r9.user || "N/A");
    i0.ɵɵadvance();
    i0.ɵɵconditional(log_r9.isBackfill ? 9 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(12, 15, log_r9.timestamp, "dd/MM/yyyy HH:mm"));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngClass", log_r9.standardId ? "cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline" : "")("title", log_r9.standardName || "Kh\u00F4ng c\u00F3 t\u00EAn");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", log_r9.standardName || "(Nh\u1EADt k\u00FD c\u0169)", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(log_r9.lotNumber ? 18 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(log_r9.internalId ? 19 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(log_r9.manufacturer ? 20 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2(" -", log_r9.amount_used, " ", log_r9.unit || "mg", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", log_r9.purpose || "");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", log_r9.purpose || "Kh\u00F4ng ghi ch\u00FA", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.auth.canDeleteStandardLogs() ? 28 : -1);
} }
function StandardUsageComponent_Conditional_107_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 92)(2, "div", 93);
    i0.ɵɵelement(3, "i", 94);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 95);
    i0.ɵɵtext(5, "Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u s\u1EED d\u1EE5ng n\u00E0o ph\u00F9 h\u1EE3p");
    i0.ɵɵelementEnd()()();
} }
function StandardUsageComponent_Conditional_107_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, StandardUsageComponent_Conditional_107_For_1_Template, 29, 18, "tr", 72, _forTrack0);
    i0.ɵɵtemplate(2, StandardUsageComponent_Conditional_107_Conditional_2_Template, 6, 0, "tr");
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵrepeater(ctx_r2.visibleLogs());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.visibleLogs().length === 0 ? 2 : -1);
} }
function StandardUsageComponent_Conditional_108_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 97);
    i0.ɵɵtext(1, " \u0110ang t\u1EA3i... ");
} }
function StandardUsageComponent_Conditional_108_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 98);
    i0.ɵɵtext(1, " T\u1EA3i th\u00EAm d\u1EEF li\u1EC7u ");
} }
function StandardUsageComponent_Conditional_108_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 51)(1, "button", 96);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_108_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.loadMore()); });
    i0.ɵɵtemplate(2, StandardUsageComponent_Conditional_108_Conditional_2_Template, 2, 0)(3, StandardUsageComponent_Conditional_108_Conditional_3_Template, 2, 0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.isLoadingMore());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isLoadingMore() ? 2 : 3);
} }
function StandardUsageComponent_Conditional_109_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-export-modal", 99);
    i0.ɵɵpipe(1, "date");
    i0.ɵɵpipe(2, "date");
    i0.ɵɵlistener("close", function StandardUsageComponent_Conditional_109_Defer_0_Template_app_export_modal_close_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showExportModal.set(false)); })("execute", function StandardUsageComponent_Conditional_109_Defer_0_Template_app_export_modal_execute_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.runExport()); });
    i0.ɵɵelementStart(3, "div", 100)(4, "div", 101)(5, "button", 102);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_109_Defer_0_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(2); !ctx_r2.isExporting() && ctx_r2.exportType.set("raw"); return i0.ɵɵresetView(ctx_r2.exportCompleted.set(false)); });
    i0.ɵɵelementStart(6, "div", 103);
    i0.ɵɵelement(7, "i", 29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 104)(9, "div", 105);
    i0.ɵɵtext(10, "1. Nh\u1EADt K\u00FD Chi Ti\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 106);
    i0.ɵɵtext(12, "To\u00E0n B\u1ED9 L\u1ECBch S\u1EED Thao T\u00E1c theo D\u00F2ng Th\u1EDDi Gian");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(13, "div", 101)(14, "button", 102);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_109_Defer_0_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(2); !ctx_r2.isExporting() && ctx_r2.exportType.set("standard"); return i0.ɵɵresetView(ctx_r2.exportCompleted.set(false)); });
    i0.ɵɵelementStart(15, "div", 103);
    i0.ɵɵelement(16, "i", 107);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 104)(18, "div", 105);
    i0.ɵɵtext(19, "2. T\u1ED5ng H\u1EE3p theo H\u00F3a Ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 106);
    i0.ɵɵtext(21, "T\u1ED5ng L\u01B0\u1EE3ng D\u00F9ng c\u1EE7a T\u1EEBng M\u00E3 H\u00F3a Ch\u1EA5t");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(22, "div", 101)(23, "button", 102);
    i0.ɵɵlistener("click", function StandardUsageComponent_Conditional_109_Defer_0_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(2); !ctx_r2.isExporting() && ctx_r2.exportType.set("user"); return i0.ɵɵresetView(ctx_r2.exportCompleted.set(false)); });
    i0.ɵɵelementStart(24, "div", 103);
    i0.ɵɵelement(25, "i", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "div", 104)(27, "div", 105);
    i0.ɵɵtext(28, "3. T\u1ED5ng H\u1EE3p theo Nh\u00E2n Vi\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div", 106);
    i0.ɵɵtext(30, "T\u1EA7n Su\u1EA5t v\u00E0 T\u1ED5ng L\u01B0\u1EE3ng D\u00F9ng theo T\u1EEBng Nh\u00E2n Vi\u00EAn");
    i0.ɵɵelementEnd()()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("dateRangeText", (ctx_r2.fromDate() ? i0.ɵɵpipeBind2(1, 24, ctx_r2.fromDate(), "dd/MM/yyyy") : "") + (ctx_r2.fromDate() || ctx_r2.toDate() ? " \u2192 " : "") + (ctx_r2.toDate() ? i0.ɵɵpipeBind2(2, 27, ctx_r2.toDate(), "dd/MM/yyyy") : ""))("isExporting", ctx_r2.isExporting())("isCompleted", ctx_r2.exportCompleted());
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r2.exportType() === "raw" ? "border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-900/20" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.exportType() === "raw" ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-indigo-700", ctx_r2.exportType() === "raw");
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r2.exportType() === "standard" ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-900/20" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.exportType() === "standard" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-emerald-700", ctx_r2.exportType() === "standard");
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r2.exportType() === "user" ? "border-orange-200 bg-orange-50/30 dark:border-orange-800 dark:bg-orange-900/20" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.exportType() === "user" ? "bg-orange-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-orange-700", ctx_r2.exportType() === "user");
} }
function StandardUsageComponent_Conditional_109_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardUsageComponent_Conditional_109_Defer_0_Template, 31, 30);
    i0.ɵɵdefer(1, 0, StandardUsageComponent_Conditional_109_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
export class StandardUsageComponent {
    constructor() {
        this.stdService = inject(StandardService);
        this.datePipe = inject(DatePipe);
        this.decimalPipe = inject(DecimalPipe);
        this.auth = inject(AuthService);
        this.toast = inject(ToastService);
        this.confirmService = inject(ConfirmationService);
        this.router = inject(Router);
        this.route = inject(ActivatedRoute);
        this.logs = signal([]);
        this.isLoading = signal(true);
        this.isLoadingMore = signal(false);
        // Filters
        this.searchTerm = signal('');
        this.fromDate = signal('');
        this.toDate = signal('');
        this.userFilter = signal('');
        this.actionFilter = signal('');
        // Sort
        this.sortColumn = signal('timestamp');
        this.sortDirection = signal('desc');
        // Pagination & Server Query Mode
        this.dateQueryMode = signal(false);
        this.lastDoc = signal(null);
        this.hasMore = signal(false);
        this.displayLimit = signal(50); // Virtual limit if we have data locally
        this.showExportModal = signal(false);
        this.exportType = signal('raw');
        this.isExporting = signal(false);
        this.exportCompleted = signal(false);
        this.allStandards = signal([]);
        this.searchSubject = new Subject();
        this.uniqueUsers = computed(() => {
            const users = new Set(this.logs().map(l => l.user).filter(Boolean));
            return [...users].sort();
        });
        this.filteredLogs = computed(() => {
            let result = this.logs();
            // Ẩn các log do HỆ THỐNG tự sinh ra (ví dụ: tự động trừ kho)
            result = result.filter(l => l.user !== 'HỆ THỐNG');
            const search = this.searchTerm().trim().toLowerCase();
            const user = this.userFilter();
            const action = this.actionFilter();
            // If dateQueryMode is false, we filter dates locally (for the 100 limit stream)
            const isLocalDateFilter = !this.dateQueryMode();
            if (search) {
                result = result.filter(l => (l.standardName && l.standardName.toLowerCase().includes(search)) ||
                    (l.user && l.user.toLowerCase().includes(search)) ||
                    (l.lotNumber && l.lotNumber.toLowerCase().includes(search)) ||
                    (l.purpose && l.purpose.toLowerCase().includes(search)) ||
                    (l.internalId && l.internalId.toLowerCase().includes(search)) ||
                    (l.manufacturer && l.manufacturer.toLowerCase().includes(search)) ||
                    (l.cas_number && l.cas_number.toLowerCase().includes(search)));
            }
            if (user) {
                result = result.filter(l => l.user === user);
            }
            if (action) {
                if (action === 'usage') {
                    result = result.filter(l => !l.purpose?.toLowerCase().includes('hoàn trả') && !l.purpose?.toLowerCase().includes('kiểm kho') && !l.purpose?.toLowerCase().includes('import'));
                }
                else if (action === 'return') {
                    result = result.filter(l => l.purpose?.toLowerCase().includes('hoàn trả') || l.purpose?.toLowerCase().includes('kiểm kho'));
                }
                else if (action === 'import') {
                    result = result.filter(l => l.purpose?.toLowerCase().includes('import'));
                }
            }
            if (isLocalDateFilter) {
                const from = this.fromDate();
                const to = this.toDate();
                if (from) {
                    const fromTime = new Date(from).getTime();
                    result = result.filter(l => (l.timestamp || 0) >= fromTime);
                }
                if (to) {
                    const toTime = new Date(to).setHours(23, 59, 59, 999);
                    result = result.filter(l => (l.timestamp || 0) <= toTime);
                }
            }
            // Sort
            const col = this.sortColumn();
            const dir = this.sortDirection() === 'asc' ? 1 : -1;
            result = [...result].sort((a, b) => {
                if (col === 'timestamp' || col === 'amount_used') {
                    const valA = a[col] || 0;
                    const valB = b[col] || 0;
                    return (valA - valB) * dir;
                }
                else {
                    const valA = (a[col] || '').toString().toLowerCase();
                    const valB = (b[col] || '').toString().toLowerCase();
                    return valA.localeCompare(valB) * dir;
                }
            });
            return result;
        });
        this.visibleLogs = computed(() => {
            return this.filteredLogs().slice(0, this.displayLimit());
        });
        this.summaryStats = computed(() => {
            const data = this.filteredLogs();
            const totals = new Map();
            data.forEach(log => {
                const unit = log.normalized_unit || log.unit || 'không rõ';
                const amount = log.normalized_amount ?? log.amount_used ?? 0;
                totals.set(unit, (totals.get(unit) || 0) + amount);
            });
            return {
                totalLogs: data.length,
                totalAmountDisplay: [...totals.entries()]
                    .sort(([unitA], [unitB]) => unitA.localeCompare(unitB))
                    .map(([unit, amount]) => `${this.decimalPipe.transform(amount, '1.0-6')} ${unit}`)
                    .join(' · ') || '0',
                uniqueUsers: new Set(data.map(l => l.user).filter(Boolean)).size,
                uniqueStandards: new Set(data.map(l => l.standardId).filter(Boolean)).size
            };
        });
        // Setup Debounce Search
        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
            this.searchTerm.set(term);
            this.displayLimit.set(50); // Reset pagination on search
        });
        // Effect: Server-side Date Query
        effect(() => {
            const from = this.fromDate();
            const to = this.toDate();
            if (from && to) {
                // Server-side query mode
                this.dateQueryMode.set(true);
                this.fetchByDateRange(from, to);
            }
            else if (!from && !to) {
                // Switch back to real-time stream if it was in dateQueryMode
                if (this.dateQueryMode()) {
                    this.dateQueryMode.set(false);
                    this.startRealTimeStream();
                }
            }
        });
        // Effect: Sync state to URL Query Params
        effect(() => {
            const params = {};
            if (this.searchTerm())
                params.q = this.searchTerm();
            if (this.fromDate())
                params.from = this.fromDate();
            if (this.toDate())
                params.to = this.toDate();
            if (this.userFilter())
                params.user = this.userFilter();
            if (this.actionFilter())
                params.action = this.actionFilter();
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: params,
                queryParamsHandling: 'merge',
                replaceUrl: true
            });
        });
    }
    ngOnInit() {
        // Restore state from URL
        const params = this.route.snapshot.queryParams;
        if (params['q']) {
            this.searchTerm.set(params['q']);
            document.querySelector('input[placeholder]').value = params['q'];
        }
        if (params['from'])
            this.fromDate.set(params['from']);
        if (params['to'])
            this.toDate.set(params['to']);
        if (params['user'])
            this.userFilter.set(params['user']);
        if (params['action'])
            this.actionFilter.set(params['action']);
        // Load reference standards for enriched exports
        const stds = this.stdService.getAllStandardsFromCache();
        if (stds && stds.length > 0) {
            this.allStandards.set(stds);
        }
        this.unregisterLiveListener = this.stdService.listenToStandards((stdsList) => {
            if (stdsList) {
                this.allStandards.set([...stdsList]);
            }
        });
        // Start stream if not in date query mode
        if (!this.fromDate() || !this.toDate()) {
            this.startRealTimeStream();
        }
    }
    ngOnDestroy() {
        if (this.sub)
            this.sub();
        if (this.unregisterLiveListener)
            this.unregisterLiveListener();
        this.searchSubject.complete();
    }
    onSearchInput(event) {
        this.searchSubject.next(event.target.value);
    }
    toggleSort(col) {
        if (this.sortColumn() === col) {
            this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
        }
        else {
            this.sortColumn.set(col);
            this.sortDirection.set('desc');
        }
        this.displayLimit.set(50); // Reset view limit when sorting
    }
    startRealTimeStream() {
        if (this.sub)
            this.sub();
        this.isLoading.set(true);
        this.logs.set([]);
        this.sub = this.stdService.listenToGlobalUsageLogs((data) => {
            this.logs.set(data);
            this.isLoading.set(false);
            this.hasMore.set(data.length >= 1000); // Max cache size is 1000
            this.lastDoc.set(null);
        });
    }
    async fetchByDateRange(from, to) {
        if (this.sub) {
            this.sub();
        } // Stop real-time listener
        this.isLoading.set(true);
        try {
            const fromTs = new Date(from).getTime();
            const toTs = new Date(to).setHours(23, 59, 59, 999);
            const res = await this.stdService.queryUsageLogsByDateRange(fromTs, toTs, 500);
            this.logs.set(res.items);
            this.lastDoc.set(res.lastDoc);
            this.hasMore.set(res.hasMore);
        }
        catch (err) {
            this.toast.show('Lỗi tải dữ liệu: ' + err.message, 'error');
        }
        finally {
            this.isLoading.set(false);
            this.displayLimit.set(50);
        }
    }
    async loadMore() {
        // 1. If we have data locally but it's hidden by displayLimit, just increase limit
        if (this.filteredLogs().length > this.displayLimit()) {
            this.displayLimit.update(v => v + 50);
            return;
        }
        // 2. If we need to fetch more from server
        if (!this.hasMore())
            return;
        this.isLoadingMore.set(true);
        try {
            let res;
            if (this.dateQueryMode() && this.fromDate() && this.toDate()) {
                const fromTs = new Date(this.fromDate()).getTime();
                const toTs = new Date(this.toDate()).setHours(23, 59, 59, 999);
                res = await this.stdService.queryUsageLogsByDateRange(fromTs, toTs, 500, this.lastDoc());
            }
            else {
                const timestamps = this.logs().map(log => log.timestamp || 0).filter(value => value > 0);
                const oldestTimestamp = timestamps.length ? Math.min(...timestamps) : Date.now();
                const older = await this.stdService.queryUsageLogsBeforeTimestamp(oldestTimestamp, 100);
                const knownIds = new Set(this.logs().map(log => log.id).filter(Boolean));
                const uniqueItems = older.items.filter(log => !log.id || !knownIds.has(log.id));
                if (uniqueItems.length > 0) {
                    this.logs.update(previous => [...previous, ...uniqueItems]);
                    this.hasMore.set(older.hasMore);
                    this.displayLimit.update(value => value + 100);
                }
                else {
                    this.hasMore.set(false);
                }
                return;
            }
            if (res.items.length > 0) {
                this.logs.update(prev => [...prev, ...res.items]);
                this.lastDoc.set(res.lastDoc);
                this.hasMore.set(res.hasMore);
                this.displayLimit.update(v => v + 50);
            }
            else {
                this.hasMore.set(false);
            }
        }
        catch (err) {
            this.toast.show('Lỗi tải thêm dữ liệu: ' + err.message, 'error');
        }
        finally {
            this.isLoadingMore.set(false);
        }
    }
    async deleteUsage(log) {
        if (!log.standardId || !log.id) {
            this.toast.show('Dữ liệu nhật ký không hợp lệ để xóa.', 'error');
            return;
        }
        const conf = await this.confirmService.confirm({
            message: `Dữ liệu thể tích "${log.amount_used} ${log.unit || ''}" sẽ được cộng dồn (rollback) trả lại vào kho. Bạn có chắc chắn xóa lịch sử sử dụng này không?`,
            confirmText: 'Đồng ý & Xóa',
            isDangerous: true
        });
        if (!conf)
            return;
        try {
            await this.stdService.deleteUsageLog(log.standardId, log.id, log.requestId);
            this.toast.show('Xóa thành công và hoàn trả thể tích tồn kho!', 'success');
            // Remove from local logs if in dateQueryMode (real-time stream will auto-update otherwise)
            if (this.dateQueryMode()) {
                this.logs.update(prev => prev.filter(l => l.id !== log.id));
            }
        }
        catch (err) {
            this.toast.show(`Lỗi: ${err.message}`, 'error');
        }
    }
    clearFilters() {
        this.searchTerm.set('');
        this.fromDate.set('');
        this.toDate.set('');
        this.userFilter.set('');
        this.actionFilter.set('');
        const searchInput = document.querySelector('input[placeholder]');
        if (searchInput)
            searchInput.value = '';
    }
    async runExport() {
        if (this.filteredLogs().length === 0) {
            this.toast.show('Không có dữ liệu để xuất.', 'info');
            return;
        }
        this.isExporting.set(true);
        this.exportCompleted.set(false);
        try {
            const XLSX = await import('xlsx');
            const wb = XLSX.utils.book_new();
            const logs = this.filteredLogs();
            if (this.exportType() === 'raw') {
                // Background batching for thousands of rows to prevent UI block
                // Actually for now we just process it directly since it's already in memory
                const exportData = logs.map((log, index) => {
                    const std = this.allStandards().find(s => s.id === log.standardId);
                    return {
                        'STT': index + 1,
                        'Ngày sử dụng': this.datePipe.transform(log.timestamp, 'dd/MM/yyyy HH:mm'),
                        'Nhân viên': log.user,
                        'Tên chất chuẩn': log.standardName || 'N/A',
                        'Tên hóa học': std?.chemical_name || '',
                        'Số CAS': log.cas_number || std?.cas_number || '',
                        'Mã quản lý': log.internalId || std?.internal_id || '',
                        'Mã catalog (mã sản phẩm)': std?.product_code || '',
                        'Lot Number': log.lotNumber || std?.lot_number || '',
                        'Độ tinh khiết': std?.purity || '',
                        'Hãng sản xuất': log.manufacturer || std?.manufacturer || '',
                        'Quy cách đóng gói': std?.pack_size || '',
                        'Lượng dùng': log.amount_used,
                        'Đơn vị': log.unit || std?.unit || 'mg',
                        'Lượng chuẩn hóa': log.normalized_amount ?? log.amount_used,
                        'Đơn vị chuẩn hóa': log.normalized_unit || log.unit || std?.unit || 'mg',
                        'Hạn sử dụng': std?.expiry_date || '',
                        'Ngày mở nắp': std?.date_opened || '',
                        'Vị trí lưu trữ': std?.location || '',
                        'Điều kiện bảo quản': std?.storage_condition || '',
                        'Link CoA / Chứng chỉ': std?.certificate_ref || '',
                        'Số hợp đồng': std?.contract_ref || '',
                        'Mục đích / Ghi chú': log.purpose || ''
                    };
                });
                const ws = XLSX.utils.json_to_sheet(exportData);
                // Auto-width columns for dynamic clean look
                const colWidths = Object.keys(exportData[0]).map(key => ({
                    wch: Math.max(key.length, ...exportData.map(row => String(row[key] || '').length)) + 2
                }));
                ws['!cols'] = colWidths;
                XLSX.utils.book_append_sheet(wb, ws, 'Dữ liệu gốc');
            }
            else if (this.exportType() === 'standard') {
                const summary = {};
                logs.forEach(log => {
                    const unit = log.normalized_unit || log.unit || 'mg';
                    const key = log.standardId || `${log.standardName || 'N/A'}|${log.lotNumber || ''}|${unit}`;
                    if (!summary[key]) {
                        summary[key] = {
                            name: log.standardName || 'N/A',
                            lot: log.lotNumber || '',
                            amount: 0,
                            count: 0,
                            unit
                        };
                    }
                    summary[key].amount += (log.normalized_amount ?? log.amount_used ?? 0);
                    summary[key].count += 1;
                });
                const exportData = Object.keys(summary).map((key, index) => ({
                    'STT': index + 1,
                    'Hóa chất và thuốc thử': summary[key].name,
                    'Số lô': summary[key].lot,
                    'Số lượt dùng': summary[key].count,
                    'Tổng lượng dùng': summary[key].amount,
                    'Đơn vị': summary[key].unit
                }));
                const ws = XLSX.utils.json_to_sheet(exportData);
                XLSX.utils.book_append_sheet(wb, ws, 'Theo Hoa Chat');
            }
            else if (this.exportType() === 'user') {
                const summary = {};
                logs.forEach(log => {
                    const key = log.user || 'N/A';
                    if (!summary[key])
                        summary[key] = { count: 0 };
                    summary[key].count += 1;
                });
                const exportData = Object.keys(summary).map((key, index) => ({
                    'STT': index + 1,
                    'Nhân viên': key,
                    'Số lượt thực hiện': summary[key].count
                }));
                const ws = XLSX.utils.json_to_sheet(exportData);
                XLSX.utils.book_append_sheet(wb, ws, 'Theo Nhan Vien');
            }
            XLSX.writeFile(wb, `NhatKyChuan_${this.exportType()}_${this.datePipe.transform(Date.now(), 'yyyyMMdd_HHmm')}.xlsx`);
            this.exportCompleted.set(true);
        }
        catch (err) {
            console.error('Lỗi khi xuất Excel:', err);
            this.toast.show('Lỗi xuất tệp Excel', 'error');
        }
        finally {
            this.isExporting.set(false);
        }
    }
    static { this.ɵfac = function StandardUsageComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardUsageComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardUsageComponent, selectors: [["app-standard-usage"]], features: [i0.ɵɵProvidersFeature([DatePipe, DecimalPipe])], decls: 110, vars: 18, consts: [[1, "flex", "flex-col", "space-y-4", "fade-in", "h-full", "relative", "p-1", "pb-6", "custom-scrollbar", "overflow-y-auto", "overflow-x-hidden"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-4", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-fuchsia-50", "dark:bg-fuchsia-900/30", "text-fuchsia-600", "dark:text-fuchsia-400", "flex", "items-center", "justify-center", "border", "border-fuchsia-100", "dark:border-fuchsia-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-clock-rotate-left", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "flex-wrap", "gap-2", "items-center", "w-full", "md:w-auto"], [1, "group", "px-5", "py-2.5", "bg-green-600", "text-white", "hover:bg-green-700", "rounded-2xl", "shadow-xl", "shadow-green-100", "dark:shadow-none", "transition-all", "font-black", "text-xs", "flex", "items-center", "gap-2", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-file-excel", "text-sm", "transition-transform"], [1, "bg-white", "dark:bg-slate-800", "mx-2", "p-4", "rounded-[2rem]", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "flex", "flex-wrap", "gap-4", "items-end"], [1, "flex-1", "min-w-[200px]"], [1, "block", "text-[10px]", "font-bold", "text-slate-400", "uppercase", "tracking-widest", "mb-1.5", "ml-1"], [1, "relative"], [1, "fa-solid", "fa-search", "absolute", "left-4", "top-1/2", "-translate-y-1/2", "text-slate-400"], ["type", "text", "placeholder", "T\u00EAn, l\u00F4, ng\u01B0\u1EDDi d\u00F9ng, ID...", 1, "w-full", "pl-10", "pr-4", "py-2.5", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-fuchsia-500", "outline-none", 3, "input", "ngModel"], [1, "w-40", "min-w-[150px]"], [1, "w-full", "px-4", "py-2.5", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-fuchsia-500", "outline-none", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["value", "usage"], ["value", "return"], ["value", "import"], ["type", "date", 1, "w-full", "px-4", "py-2.5", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-fuchsia-500", "outline-none", "[color-scheme:light]", "dark:[color-scheme:dark]", 3, "ngModelChange", "ngModel"], [1, "px-4", "py-2.5", "text-slate-400", "hover:text-red-500", "font-bold", "text-sm", "transition-colors", "rounded-xl", "hover:bg-red-50", "dark:hover:bg-red-900/20"], [1, "flex", "flex-wrap", "gap-2", "mx-2", "-mt-1"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-3", "mx-2"], [1, "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/20", "text-indigo-500", "flex", "items-center", "justify-center", "text-xl"], [1, "fa-solid", "fa-list"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase", "tracking-widest"], [1, "w-12", "h-12", "rounded-xl", "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "text-fuchsia-500", "flex", "items-center", "justify-center", "text-xl"], [1, "fa-solid", "fa-droplet"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-100", "break-words"], [1, "w-12", "h-12", "rounded-xl", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-500", "flex", "items-center", "justify-center", "text-xl"], [1, "fa-solid", "fa-users"], [1, "w-12", "h-12", "rounded-xl", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-500", "flex", "items-center", "justify-center", "text-xl"], [1, "fa-solid", "fa-vial"], [1, "mx-2", "px-5", "py-3", "bg-blue-50", "dark:bg-blue-900/20", "border", "border-blue-200", "dark:border-blue-800/40", "rounded-2xl", "flex", "items-center", "gap-3", "text-blue-700", "dark:text-blue-400", "text-xs", "font-bold", "shrink-0"], [1, "flex", "flex-col", "bg-white", "dark:bg-slate-800", "mx-2", "rounded-[2.5rem]", "shadow-[0_20px_50px_rgba(0,0,0,0.04)]", "border", "border-slate-100", "dark:border-slate-700", "overflow-hidden", "flex-1"], [1, "flex-1", "overflow-x-auto", "custom-scrollbar"], [1, "w-full", "text-left", "border-separate", "border-spacing-0"], [1, "bg-slate-50/50", "dark:bg-slate-800/80", "sticky", "top-0", "z-30"], [1, "px-6", "py-4", "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-widest", "border-b", "border-slate-100", "dark:border-slate-700", "cursor-pointer", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition", 3, "click"], [1, "fa-solid", "ml-1", 3, "fa-sort-up", "fa-sort-down"], [1, "fa-solid", "fa-sort", "ml-1", "opacity-30"], [1, "px-6", "py-4", "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-widest", "border-b", "border-slate-100", "dark:border-slate-700", "text-right", "cursor-pointer", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition", 3, "click"], [1, "px-6", "py-4", "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-widest", "border-b", "border-slate-100", "dark:border-slate-700"], [1, "px-6", "py-4", "text-center", "w-16", "border-b", "border-slate-100", "dark:border-slate-700"], [1, "divide-y", "divide-slate-100/50", "dark:divide-slate-800/50"], [1, "p-6", "text-center"], [1, "px-4", "py-2.5", "text-slate-400", "hover:text-red-500", "font-bold", "text-sm", "transition-colors", "rounded-xl", "hover:bg-red-50", "dark:hover:bg-red-900/20", 3, "click"], [1, "px-3", "py-1", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400", "text-xs", "font-bold", "rounded-lg", "flex", "items-center", "gap-2", "border", "border-indigo-100", "dark:border-indigo-800/50"], [1, "px-3", "py-1", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "text-xs", "font-bold", "rounded-lg", "flex", "items-center", "gap-2", "border", "border-blue-100", "dark:border-blue-800/50"], [1, "px-3", "py-1", "bg-fuchsia-50", "dark:bg-fuchsia-900/30", "text-fuchsia-600", "dark:text-fuchsia-400", "text-xs", "font-bold", "rounded-lg", "flex", "items-center", "gap-2", "border", "border-fuchsia-100", "dark:border-fuchsia-800/50"], [1, "px-3", "py-1", "bg-amber-50", "dark:bg-amber-900/30", "text-amber-600", "dark:text-amber-400", "text-xs", "font-bold", "rounded-lg", "flex", "items-center", "gap-2", "border", "border-amber-100", "dark:border-amber-800/50"], [1, "fa-solid", "fa-search", "text-[10px]"], [1, "hover:text-indigo-800", "dark:hover:text-indigo-200", "ml-1", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "fa-solid", "fa-user", "text-[10px]"], [1, "hover:text-blue-800", "dark:hover:text-blue-200", "ml-1", 3, "click"], [1, "fa-solid", "fa-tag", "text-[10px]"], [1, "hover:text-fuchsia-800", "dark:hover:text-fuchsia-200", "ml-1", 3, "click"], [1, "fa-regular", "fa-calendar", "text-[10px]"], [1, "fa-solid", "fa-arrow-right", "text-[10px]", "mx-1"], [1, "hover:text-amber-800", "dark:hover:text-amber-200", "ml-1", 3, "click"], [1, "fa-solid", "fa-server", "text-sm"], [1, "fa-solid", "ml-1"], [1, "animate-pulse"], ["colspan", "5", 1, "px-6", "py-4"], [1, "h-10", "bg-slate-100/50", "dark:bg-slate-800/50", "rounded-xl", "w-full"], [1, "hover:bg-slate-50/80", "dark:hover:bg-slate-800/30", "transition-colors", "group"], [1, "px-6", "py-4"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/20", "text-indigo-500", "flex", "items-center", "justify-center", "font-black", "text-xs", "border", "border-indigo-100/50", "dark:border-indigo-800/30"], [1, "flex", "items-center", "gap-2"], [1, "text-[13px]", "font-black", "text-slate-800", "dark:text-slate-200"], [1, "px-1.5", "py-0.5", "rounded", "bg-purple-100", "dark:bg-purple-900/30", "text-purple-700", "dark:text-purple-300", "text-[8px]", "font-black", "uppercase", "tracking-wider"], [1, "text-[10px]", "font-bold", "text-slate-400"], [1, "flex", "flex-col", "gap-0.5", "max-w-[300px]"], [1, "text-sm", "font-black", "text-slate-700", "dark:text-slate-300", "truncate", "transition", 3, "click", "ngClass", "title"], [1, "flex", "flex-wrap", "gap-1.5", "mt-1"], [1, "px-1.5", "py-0.5", "bg-slate-100", "dark:bg-slate-800", "rounded", "text-[9px]", "font-bold", "text-slate-500"], [1, "px-1.5", "py-0.5", "bg-blue-50", "dark:bg-blue-900/20", "border", "border-blue-100", "dark:border-blue-800/30", "rounded", "text-[9px]", "font-bold", "text-blue-600", "dark:text-blue-400"], [1, "px-1.5", "py-0.5", "bg-slate-100", "dark:bg-slate-800", "rounded", "text-[9px]", "font-bold", "text-slate-500", "truncate", "max-w-[80px]"], [1, "px-6", "py-4", "text-right"], [1, "text-sm", "font-black", "text-fuchsia-600", "dark:text-fuchsia-400", "flex", "flex-col", "items-end"], [1, "text-xs", "font-medium", "text-slate-600", "dark:text-slate-400", "italic", "line-clamp-2", "max-w-[250px]", 3, "title"], [1, "px-6", "py-4", "text-center"], ["title", "X\u00F3a & Ho\u00E0n tr\u1EA3 Th\u1EC3 t\u00EDch", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-xl", "bg-slate-100", "dark:bg-slate-700", "text-slate-400", "hover:bg-rose-50", "dark:hover:bg-rose-900/30", "hover:text-rose-500", "dark:hover:text-rose-400", "transition"], ["title", "X\u00F3a & Ho\u00E0n tr\u1EA3 Th\u1EC3 t\u00EDch", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-xl", "bg-slate-100", "dark:bg-slate-700", "text-slate-400", "hover:bg-rose-50", "dark:hover:bg-rose-900/30", "hover:text-rose-500", "dark:hover:text-rose-400", "transition", 3, "click"], [1, "fa-solid", "fa-trash", "text-[10px]"], ["colspan", "5", 1, "px-6", "py-16", "text-center"], [1, "w-16", "h-16", "bg-slate-50", "dark:bg-slate-900", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-3", "text-slate-300", "dark:text-slate-600"], [1, "fa-solid", "fa-clock-rotate-left", "text-2xl"], [1, "text-sm", "font-bold", "text-slate-400"], [1, "px-6", "py-3", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/20", "transition-colors", "shadow-sm", "disabled:opacity-50", "flex", "items-center", "gap-2", "mx-auto", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-chevron-down"], ["title", "Xu\u1EA5t nh\u1EADt k\u00FD s\u1EED d\u1EE5ng ch\u1EA5t chu\u1EA9n", 3, "close", "execute", "dateRangeText", "isExporting", "isCompleted"], [1, "px-5", "pb-5", "space-y-2", "mt-4"], [1, "border", "rounded-2xl", "overflow-hidden", "transition-all"], [1, "w-full", "flex", "items-center", "gap-3.5", "p-4", "cursor-pointer", "hover:bg-slate-50/50", "dark:hover:bg-slate-700/20", "transition", 3, "click", "disabled"], [1, "w-9", "h-9", "rounded-xl", "flex", "items-center", "justify-center", "text-sm", "shrink-0", "shadow-sm"], [1, "flex-1", "text-left"], [1, "text-sm", "font-black", "dark:text-slate-200"], [1, "text-[11px]", "text-slate-500"], [1, "fa-solid", "fa-flask"]], template: function StandardUsageComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
            i0.ɵɵelement(4, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div")(6, "h2", 5);
            i0.ɵɵtext(7, "Nh\u1EADt K\u00FD D\u00F9ng Chu\u1EA9n");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 6);
            i0.ɵɵtext(9, "L\u1ECBch s\u1EED ti\u00EAu th\u1EE5 v\u00E0 s\u1EED d\u1EE5ng h\u00F3a ch\u1EA5t chu\u1EA9n to\u00E0n h\u1EC7 th\u1ED1ng.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "div", 7)(11, "button", 8);
            i0.ɵɵlistener("click", function StandardUsageComponent_Template_button_click_11_listener() { ctx.showExportModal.set(true); return ctx.exportCompleted.set(false); });
            i0.ɵɵelement(12, "i", 9);
            i0.ɵɵtext(13, " Xu\u1EA5t Excel ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(14, "div", 10)(15, "div", 11)(16, "label", 12);
            i0.ɵɵtext(17, "T\u00ECm ki\u1EBFm");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div", 13);
            i0.ɵɵelement(19, "i", 14);
            i0.ɵɵelementStart(20, "input", 15);
            i0.ɵɵlistener("input", function StandardUsageComponent_Template_input_input_20_listener($event) { return ctx.onSearchInput($event); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(21, "div", 16)(22, "label", 12);
            i0.ɵɵtext(23, "Nh\u00E2n vi\u00EAn");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "select", 17);
            i0.ɵɵlistener("ngModelChange", function StandardUsageComponent_Template_select_ngModelChange_24_listener($event) { return ctx.userFilter.set($event); });
            i0.ɵɵelementStart(25, "option", 18);
            i0.ɵɵtext(26, "T\u1EA5t c\u1EA3");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(27, StandardUsageComponent_For_28_Template, 2, 2, "option", 19, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(29, "div", 16)(30, "label", 12);
            i0.ɵɵtext(31, "H\u00E0nh \u0111\u1ED9ng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "select", 17);
            i0.ɵɵlistener("ngModelChange", function StandardUsageComponent_Template_select_ngModelChange_32_listener($event) { return ctx.actionFilter.set($event); });
            i0.ɵɵelementStart(33, "option", 18);
            i0.ɵɵtext(34, "T\u1EA5t c\u1EA3");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "option", 20);
            i0.ɵɵtext(36, "S\u1EED d\u1EE5ng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "option", 21);
            i0.ɵɵtext(38, "Ho\u00E0n tr\u1EA3 / Tr\u1EEB kho");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "option", 22);
            i0.ɵɵtext(40, "D\u1EEF li\u1EC7u nh\u1EADp t\u1EEB t\u1EC7p");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(41, "div", 16)(42, "label", 12);
            i0.ɵɵtext(43, "T\u1EEB ng\u00E0y");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "input", 23);
            i0.ɵɵlistener("ngModelChange", function StandardUsageComponent_Template_input_ngModelChange_44_listener($event) { return ctx.fromDate.set($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "div", 16)(46, "label", 12);
            i0.ɵɵtext(47, "\u0110\u1EBFn ng\u00E0y");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "input", 23);
            i0.ɵɵlistener("ngModelChange", function StandardUsageComponent_Template_input_ngModelChange_48_listener($event) { return ctx.toDate.set($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(49, StandardUsageComponent_Conditional_49_Template, 2, 0, "button", 24);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(50, StandardUsageComponent_Conditional_50_Template, 5, 4, "div", 25);
            i0.ɵɵelementStart(51, "div", 26)(52, "div", 27)(53, "div", 28);
            i0.ɵɵelement(54, "i", 29);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "div")(56, "div", 30);
            i0.ɵɵtext(57);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(58, "div", 31);
            i0.ɵɵtext(59, "L\u01B0\u1EE3t s\u1EED d\u1EE5ng");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(60, "div", 27)(61, "div", 32);
            i0.ɵɵelement(62, "i", 33);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(63, "div")(64, "div", 34);
            i0.ɵɵtext(65);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(66, "div", 31);
            i0.ɵɵtext(67, "T\u1ED5ng ti\u00EAu hao");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(68, "div", 27)(69, "div", 35);
            i0.ɵɵelement(70, "i", 36);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(71, "div")(72, "div", 30);
            i0.ɵɵtext(73);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "div", 31);
            i0.ɵɵtext(75, "Nh\u00E2n vi\u00EAn");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(76, "div", 27)(77, "div", 37);
            i0.ɵɵelement(78, "i", 38);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(79, "div")(80, "div", 30);
            i0.ɵɵtext(81);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(82, "div", 31);
            i0.ɵɵtext(83, "Ch\u1EA5t chu\u1EA9n");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(84, StandardUsageComponent_Conditional_84_Template, 4, 0, "div", 39);
            i0.ɵɵelementStart(85, "div", 40)(86, "div", 41)(87, "table", 42)(88, "thead", 43)(89, "tr")(90, "th", 44);
            i0.ɵɵlistener("click", function StandardUsageComponent_Template_th_click_90_listener() { return ctx.toggleSort("timestamp"); });
            i0.ɵɵtext(91, " Ng\u00E0y l\u01B0u / NV d\u00F9ng ");
            i0.ɵɵtemplate(92, StandardUsageComponent_Conditional_92_Template, 1, 4, "i", 45)(93, StandardUsageComponent_Conditional_93_Template, 1, 0, "i", 46);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(94, "th", 44);
            i0.ɵɵlistener("click", function StandardUsageComponent_Template_th_click_94_listener() { return ctx.toggleSort("standardName"); });
            i0.ɵɵtext(95, " Th\u00F4ng tin chu\u1EA9n ");
            i0.ɵɵtemplate(96, StandardUsageComponent_Conditional_96_Template, 1, 4, "i", 45)(97, StandardUsageComponent_Conditional_97_Template, 1, 0, "i", 46);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(98, "th", 47);
            i0.ɵɵlistener("click", function StandardUsageComponent_Template_th_click_98_listener() { return ctx.toggleSort("amount_used"); });
            i0.ɵɵtext(99, " L\u01B0\u1EE3ng ti\u00EAu hao ");
            i0.ɵɵtemplate(100, StandardUsageComponent_Conditional_100_Template, 1, 4, "i", 45)(101, StandardUsageComponent_Conditional_101_Template, 1, 0, "i", 46);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(102, "th", 48);
            i0.ɵɵtext(103, "M\u1EE5c \u0111\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(104, "th", 49);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(105, "tbody", 50);
            i0.ɵɵtemplate(106, StandardUsageComponent_Conditional_106_Template, 2, 1)(107, StandardUsageComponent_Conditional_107_Template, 3, 1);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(108, StandardUsageComponent_Conditional_108_Template, 4, 2, "div", 51);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(109, StandardUsageComponent_Conditional_109_Template, 3, 0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(20);
            i0.ɵɵproperty("ngModel", ctx.searchTerm());
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngModel", ctx.userFilter());
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.uniqueUsers());
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngModel", ctx.actionFilter());
            i0.ɵɵadvance(12);
            i0.ɵɵproperty("ngModel", ctx.fromDate());
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngModel", ctx.toDate());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.searchTerm() || ctx.fromDate() || ctx.toDate() || ctx.userFilter() || ctx.actionFilter() ? 49 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.searchTerm() || ctx.fromDate() || ctx.toDate() || ctx.userFilter() || ctx.actionFilter() ? 50 : -1);
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate(ctx.summaryStats().totalLogs);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.summaryStats().totalAmountDisplay);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.summaryStats().uniqueUsers);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.summaryStats().uniqueStandards);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.dateQueryMode() ? 84 : -1);
            i0.ɵɵadvance(8);
            i0.ɵɵconditional(ctx.sortColumn() === "timestamp" ? 92 : 93);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.sortColumn() === "standardName" ? 96 : 97);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.sortColumn() === "amount_used" ? 100 : 101);
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.isLoading() && ctx.visibleLogs().length === 0 ? 106 : 107);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional((ctx.hasMore() || ctx.filteredLogs().length > ctx.displayLimit()) && !ctx.isLoading() ? 108 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showExportModal() ? 109 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(StandardUsageComponent, () => [import("../../../shared/components/export-modal/export-modal.component").then(m => m.ExportModalComponent)], ExportModalComponent => { i0.ɵsetClassMetadata(StandardUsageComponent, [{
        type: Component,
        args: [{ selector: 'app-standard-usage', standalone: true, imports: [CommonModule, FormsModule, ExportModalComponent], providers: [DatePipe, DecimalPipe], template: "<div class=\"flex flex-col space-y-4 fade-in h-full relative p-1 pb-6 custom-scrollbar overflow-y-auto overflow-x-hidden\">\r\n  <!-- Header -->\r\n  <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0\">\r\n    <div class=\"flex items-center gap-3\">\r\n      <div class=\"w-10 h-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center border border-fuchsia-100 dark:border-fuchsia-800/30 shadow-sm shrink-0\">\r\n        <i class=\"fa-solid fa-clock-rotate-left text-base\"></i>\r\n      </div>\r\n      <div>\r\n        <h2 class=\"text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight\">Nh\u1EADt K\u00FD D\u00F9ng Chu\u1EA9n</h2>\r\n        <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">L\u1ECBch s\u1EED ti\u00EAu th\u1EE5 v\u00E0 s\u1EED d\u1EE5ng h\u00F3a ch\u1EA5t chu\u1EA9n to\u00E0n h\u1EC7 th\u1ED1ng.</p>\r\n      </div>\r\n    </div>\r\n    <div class=\"flex flex-wrap gap-2 items-center w-full md:w-auto\">\r\n      <button (click)=\"showExportModal.set(true); exportCompleted.set(false);\" class=\"group px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-2xl shadow-xl shadow-green-100 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95\">\r\n        <i class=\"fa-solid fa-file-excel text-sm transition-transform\"></i> Xu\u1EA5t Excel\r\n      </button>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Filters Row -->\r\n  <div class=\"bg-white dark:bg-slate-800 mx-2 p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 items-end\">\r\n    <div class=\"flex-1 min-w-[200px]\">\r\n      <label class=\"block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1\">T\u00ECm ki\u1EBFm</label>\r\n      <div class=\"relative\">\r\n        <i class=\"fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400\"></i>\r\n        <!-- S\u1EED d\u1EE5ng (input) thay v\u00EC ngModelChange \u0111\u1EC3 debounce -->\r\n        <input type=\"text\" [ngModel]=\"searchTerm()\" (input)=\"onSearchInput($event)\"\r\n          class=\"w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none\"\r\n          placeholder=\"T\u00EAn, l\u00F4, ng\u01B0\u1EDDi d\u00F9ng, ID...\">\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"w-40 min-w-[150px]\">\r\n        <label class=\"block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1\">Nh\u00E2n vi\u00EAn</label>\r\n        <select [ngModel]=\"userFilter()\" (ngModelChange)=\"userFilter.set($event)\"\r\n          class=\"w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none\">\r\n          <option value=\"\">T\u1EA5t c\u1EA3</option>\r\n          @for (u of uniqueUsers(); track u) {\r\n            <option [value]=\"u\">{{u}}</option>\r\n          }\r\n        </select>\r\n      </div>\r\n\r\n      <div class=\"w-40 min-w-[150px]\">\r\n        <label class=\"block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1\">H\u00E0nh \u0111\u1ED9ng</label>\r\n        <select [ngModel]=\"actionFilter()\" (ngModelChange)=\"actionFilter.set($event)\"\r\n          class=\"w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none\">\r\n          <option value=\"\">T\u1EA5t c\u1EA3</option>\r\n          <option value=\"usage\">S\u1EED d\u1EE5ng</option>\r\n          <option value=\"return\">Ho\u00E0n tr\u1EA3 / Tr\u1EEB kho</option>\r\n          <option value=\"import\">D\u1EEF li\u1EC7u nh\u1EADp t\u1EEB t\u1EC7p</option>\r\n        </select>\r\n      </div>\r\n\r\n      <div class=\"w-40 min-w-[150px]\">\r\n        <label class=\"block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1\">T\u1EEB ng\u00E0y</label>\r\n        <input type=\"date\" [ngModel]=\"fromDate()\" (ngModelChange)=\"fromDate.set($event)\"\r\n          class=\"w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none [color-scheme:light] dark:[color-scheme:dark]\">\r\n        </div>\r\n\r\n        <div class=\"w-40 min-w-[150px]\">\r\n          <label class=\"block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1\">\u0110\u1EBFn ng\u00E0y</label>\r\n          <input type=\"date\" [ngModel]=\"toDate()\" (ngModelChange)=\"toDate.set($event)\"\r\n            class=\"w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none [color-scheme:light] dark:[color-scheme:dark]\">\r\n          </div>\r\n\r\n          @if (searchTerm() || fromDate() || toDate() || userFilter() || actionFilter()) {\r\n            <button (click)=\"clearFilters()\" class=\"px-4 py-2.5 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20\">\r\n              X\u00F3a L\u1ECDc\r\n            </button>\r\n          }\r\n        </div>\r\n\r\n        <!-- Filter Chips -->\r\n        @if (searchTerm() || fromDate() || toDate() || userFilter() || actionFilter()) {\r\n          <div class=\"flex flex-wrap gap-2 mx-2 -mt-1\">\r\n            @if (searchTerm()) {\r\n              <div class=\"px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg flex items-center gap-2 border border-indigo-100 dark:border-indigo-800/50\">\r\n                <i class=\"fa-solid fa-search text-[10px]\"></i> \"{{searchTerm()}}\"\r\n                <button (click)=\"searchTerm.set('')\" class=\"hover:text-indigo-800 dark:hover:text-indigo-200 ml-1\"><i class=\"fa-solid fa-xmark\"></i></button>\r\n              </div>\r\n            }\r\n            @if (userFilter()) {\r\n              <div class=\"px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg flex items-center gap-2 border border-blue-100 dark:border-blue-800/50\">\r\n                <i class=\"fa-solid fa-user text-[10px]\"></i> {{userFilter()}}\r\n                <button (click)=\"userFilter.set('')\" class=\"hover:text-blue-800 dark:hover:text-blue-200 ml-1\"><i class=\"fa-solid fa-xmark\"></i></button>\r\n              </div>\r\n            }\r\n            @if (actionFilter()) {\r\n              <div class=\"px-3 py-1 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-xs font-bold rounded-lg flex items-center gap-2 border border-fuchsia-100 dark:border-fuchsia-800/50\">\r\n                <i class=\"fa-solid fa-tag text-[10px]\"></i> {{actionFilter() === 'usage' ? 'S\u1EED d\u1EE5ng' : actionFilter() === 'return' ? 'Ho\u00E0n tr\u1EA3 / Tr\u1EEB kho' : 'Import'}}\r\n                <button (click)=\"actionFilter.set('')\" class=\"hover:text-fuchsia-800 dark:hover:text-fuchsia-200 ml-1\"><i class=\"fa-solid fa-xmark\"></i></button>\r\n              </div>\r\n            }\r\n            @if (fromDate() || toDate()) {\r\n              <div class=\"px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg flex items-center gap-2 border border-amber-100 dark:border-amber-800/50\">\r\n                <i class=\"fa-regular fa-calendar text-[10px]\"></i>\r\n                {{fromDate() ? (fromDate() | date:'dd/MM/yyyy') : '...'}} <i class=\"fa-solid fa-arrow-right text-[10px] mx-1\"></i> {{toDate() ? (toDate() | date:'dd/MM/yyyy') : '...'}}\r\n                <button (click)=\"fromDate.set(''); toDate.set('')\" class=\"hover:text-amber-800 dark:hover:text-amber-200 ml-1\"><i class=\"fa-solid fa-xmark\"></i></button>\r\n              </div>\r\n            }\r\n          </div>\r\n        }\r\n\r\n        <!-- Summary Stats Bar -->\r\n        <div class=\"grid grid-cols-2 md:grid-cols-4 gap-3 mx-2\">\r\n          <div class=\"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4\">\r\n            <div class=\"w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center text-xl\">\r\n              <i class=\"fa-solid fa-list\"></i>\r\n            </div>\r\n            <div>\r\n              <div class=\"text-2xl font-black text-slate-800 dark:text-slate-100\">{{summaryStats().totalLogs}}</div>\r\n              <div class=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest\">L\u01B0\u1EE3t s\u1EED d\u1EE5ng</div>\r\n            </div>\r\n          </div>\r\n          <div class=\"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4\">\r\n            <div class=\"w-12 h-12 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-500 flex items-center justify-center text-xl\">\r\n              <i class=\"fa-solid fa-droplet\"></i>\r\n            </div>\r\n            <div>\r\n              <div class=\"text-lg font-black text-slate-800 dark:text-slate-100 break-words\">{{summaryStats().totalAmountDisplay}}</div>\r\n              <div class=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest\">T\u1ED5ng ti\u00EAu hao</div>\r\n            </div>\r\n          </div>\r\n          <div class=\"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4\">\r\n            <div class=\"w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-xl\">\r\n              <i class=\"fa-solid fa-users\"></i>\r\n            </div>\r\n            <div>\r\n              <div class=\"text-2xl font-black text-slate-800 dark:text-slate-100\">{{summaryStats().uniqueUsers}}</div>\r\n              <div class=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest\">Nh\u00E2n vi\u00EAn</div>\r\n            </div>\r\n          </div>\r\n          <div class=\"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4\">\r\n            <div class=\"w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center text-xl\">\r\n              <i class=\"fa-solid fa-vial\"></i>\r\n            </div>\r\n            <div>\r\n              <div class=\"text-2xl font-black text-slate-800 dark:text-slate-100\">{{summaryStats().uniqueStandards}}</div>\r\n              <div class=\"text-[10px] font-bold text-slate-400 uppercase tracking-widest\">Ch\u1EA5t chu\u1EA9n</div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- C\u1EA3nh b\u00E1o ch\u1EBF \u0111\u1ED9 Server-side Query -->\r\n        @if (dateQueryMode()) {\r\n          <div class=\"mx-2 px-5 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-2xl flex items-center gap-3 text-blue-700 dark:text-blue-400 text-xs font-bold shrink-0\">\r\n            <i class=\"fa-solid fa-server text-sm\"></i>\r\n            <span>\u0110ang truy xu\u1EA5t d\u1EEF li\u1EC7u t\u1EEB m\u00E1y ch\u1EE7 theo kho\u1EA3ng ng\u00E0y. (Gi\u1EDBi h\u1EA1n t\u1ED1i \u0111a 500 k\u1EBFt qu\u1EA3). X\u00F3a b\u1ED9 l\u1ECDc ng\u00E0y \u0111\u1EC3 xem d\u1EEF li\u1EC7u theo th\u1EDDi gian th\u1EF1c m\u1EDBi nh\u1EA5t.</span>\r\n          </div>\r\n        }\r\n\r\n        <!-- Data Table -->\r\n        <div class=\"flex flex-col bg-white dark:bg-slate-800 mx-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 overflow-hidden flex-1\">\r\n          <div class=\"flex-1 overflow-x-auto custom-scrollbar\">\r\n            <table class=\"w-full text-left border-separate border-spacing-0\">\r\n              <thead class=\"bg-slate-50/50 dark:bg-slate-800/80 sticky top-0 z-30\">\r\n                <tr>\r\n                  <th (click)=\"toggleSort('timestamp')\" class=\"px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition\">\r\n                    Ng\u00E0y l\u01B0u / NV d\u00F9ng\r\n                    @if (sortColumn() === 'timestamp') { <i class=\"fa-solid ml-1\" [class.fa-sort-up]=\"sortDirection() === 'asc'\" [class.fa-sort-down]=\"sortDirection() === 'desc'\"></i> }\r\n                    @else { <i class=\"fa-solid fa-sort ml-1 opacity-30\"></i> }\r\n                  </th>\r\n                  <th (click)=\"toggleSort('standardName')\" class=\"px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition\">\r\n                    Th\u00F4ng tin chu\u1EA9n\r\n                    @if (sortColumn() === 'standardName') { <i class=\"fa-solid ml-1\" [class.fa-sort-up]=\"sortDirection() === 'asc'\" [class.fa-sort-down]=\"sortDirection() === 'desc'\"></i> }\r\n                    @else { <i class=\"fa-solid fa-sort ml-1 opacity-30\"></i> }\r\n                  </th>\r\n                  <th (click)=\"toggleSort('amount_used')\" class=\"px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition\">\r\n                    L\u01B0\u1EE3ng ti\u00EAu hao\r\n                    @if (sortColumn() === 'amount_used') { <i class=\"fa-solid ml-1\" [class.fa-sort-up]=\"sortDirection() === 'asc'\" [class.fa-sort-down]=\"sortDirection() === 'desc'\"></i> }\r\n                    @else { <i class=\"fa-solid fa-sort ml-1 opacity-30\"></i> }\r\n                  </th>\r\n                  <th class=\"px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700\">M\u1EE5c \u0111\u00EDch</th>\r\n                  <th class=\"px-6 py-4 text-center w-16 border-b border-slate-100 dark:border-slate-700\"></th>\r\n                </tr>\r\n              </thead>\r\n              <tbody class=\"divide-y divide-slate-100/50 dark:divide-slate-800/50\">\r\n                @if (isLoading() && visibleLogs().length === 0) {\r\n                  @for(i of [1,2,3,4,5,6]; track i) {\r\n                    <tr class=\"animate-pulse\">\r\n                      <td colspan=\"5\" class=\"px-6 py-4\"><div class=\"h-10 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl w-full\"></div></td>\r\n                    </tr>\r\n                  }\r\n                } @else {\r\n                  @for (log of visibleLogs(); track log.id) {\r\n                    <tr class=\"hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group\">\r\n                      <td class=\"px-6 py-4\">\r\n                        <div class=\"flex items-center gap-3\">\r\n                          <div class=\"w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center font-black text-xs border border-indigo-100/50 dark:border-indigo-800/30\">\r\n                            {{(log.user || '?').charAt(0).toUpperCase()}}\r\n                          </div>\r\n                          <div>\r\n                            <div class=\"flex items-center gap-2\">\r\n                              <div class=\"text-[13px] font-black text-slate-800 dark:text-slate-200\">{{log.user || 'N/A'}}</div>\r\n                              @if(log.isBackfill) {\r\n                                <span class=\"px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[8px] font-black uppercase tracking-wider\">Nh\u1EADp b\u00F9</span>\r\n                              }\r\n                            </div>\r\n                            <div class=\"text-[10px] font-bold text-slate-400\">{{log.timestamp | date:'dd/MM/yyyy HH:mm'}}</div>\r\n                          </div>\r\n                        </div>\r\n                      </td>\r\n                      <td class=\"px-6 py-4\">\r\n                        <div class=\"flex flex-col gap-0.5 max-w-[300px]\">\r\n                          <span class=\"text-sm font-black text-slate-700 dark:text-slate-300 truncate transition\" [ngClass]=\"log.standardId ? 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline' : ''\" [title]=\"log.standardName || 'Kh\u00F4ng c\u00F3 t\u00EAn'\" (click)=\"log.standardId && router.navigate(['/standards', log.standardId])\">\r\n                            {{log.standardName || '(Nh\u1EADt k\u00FD c\u0169)'}}\r\n                          </span>\r\n                          <div class=\"flex flex-wrap gap-1.5 mt-1\">\r\n                            @if(log.lotNumber) {\r\n                              <span class=\"px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-500\">Lot: {{log.lotNumber}}</span>\r\n                            }\r\n                            @if(log.internalId) {\r\n                              <span class=\"px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded text-[9px] font-bold text-blue-600 dark:text-blue-400\">{{log.internalId}}</span>\r\n                            }\r\n                            @if(log.manufacturer) {\r\n                              <span class=\"px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-500 truncate max-w-[80px]\">{{log.manufacturer}}</span>\r\n                            }\r\n                          </div>\r\n                        </div>\r\n                      </td>\r\n                      <td class=\"px-6 py-4 text-right\">\r\n                        <div class=\"text-sm font-black text-fuchsia-600 dark:text-fuchsia-400 flex flex-col items-end\">\r\n                          -{{log.amount_used}} {{log.unit || 'mg'}}\r\n                        </div>\r\n                      </td>\r\n                      <td class=\"px-6 py-4\">\r\n                        <span class=\"text-xs font-medium text-slate-600 dark:text-slate-400 italic line-clamp-2 max-w-[250px]\" [title]=\"log.purpose || ''\">\r\n                          {{log.purpose || 'Kh\u00F4ng ghi ch\u00FA'}}\r\n                        </span>\r\n                      </td>\r\n                      <td class=\"px-6 py-4 text-center\">\r\n                        @if (auth.canDeleteStandardLogs()) {\r\n                          <button (click)=\"deleteUsage(log)\" class=\"w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-500 dark:hover:text-rose-400 transition\" title=\"X\u00F3a & Ho\u00E0n tr\u1EA3 Th\u1EC3 t\u00EDch\">\r\n                            <i class=\"fa-solid fa-trash text-[10px]\"></i>\r\n                          </button>\r\n                        }\r\n                      </td>\r\n                    </tr>\r\n                  }\r\n                  @if (visibleLogs().length === 0) {\r\n                    <tr>\r\n                      <td colspan=\"5\" class=\"px-6 py-16 text-center\">\r\n                        <div class=\"w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600\">\r\n                          <i class=\"fa-solid fa-clock-rotate-left text-2xl\"></i>\r\n                        </div>\r\n                        <div class=\"text-sm font-bold text-slate-400\">Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u s\u1EED d\u1EE5ng n\u00E0o ph\u00F9 h\u1EE3p</div>\r\n                      </td>\r\n                    </tr>\r\n                  }\r\n                }\r\n              </tbody>\r\n            </table>\r\n\r\n            <!-- Load More -->\r\n            @if ((hasMore() || filteredLogs().length > displayLimit()) && !isLoading()) {\r\n              <div class=\"p-6 text-center\">\r\n                <button (click)=\"loadMore()\" [disabled]=\"isLoadingMore()\" class=\"px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 mx-auto\">\r\n                  @if (isLoadingMore()) {\r\n                    <i class=\"fa-solid fa-spinner fa-spin\"></i> \u0110ang t\u1EA3i...\r\n                  } @else {\r\n                    <i class=\"fa-solid fa-chevron-down\"></i> T\u1EA3i th\u00EAm d\u1EEF li\u1EC7u\r\n                  }\r\n                </button>\r\n              </div>\r\n            }\r\n          </div>\r\n        </div>\r\n\r\n        <!-- EXPORT MODAL -->\r\n        @if (showExportModal()) {\r\n          @defer {\r\n            <app-export-modal\r\n            title=\"Xu\u1EA5t nh\u1EADt k\u00FD s\u1EED d\u1EE5ng ch\u1EA5t chu\u1EA9n\"\r\n            [dateRangeText]=\"(fromDate() ? (fromDate() | date:'dd/MM/yyyy') : '') + (fromDate() || toDate() ? ' \u2192 ' : '') + (toDate() ? (toDate() | date:'dd/MM/yyyy') : '')\"\r\n            [isExporting]=\"isExporting()\"\r\n            [isCompleted]=\"exportCompleted()\"\r\n            (close)=\"showExportModal.set(false)\"\r\n            (execute)=\"runExport()\">\r\n\r\n            <div class=\"px-5 pb-5 space-y-2 mt-4\">\r\n              <!-- 1. D\u1EEF li\u1EC7u g\u1ED1c -->\r\n              <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                [class]=\"exportType() === 'raw' ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700'\">\r\n                <button (click)=\"!isExporting() && exportType.set('raw'); exportCompleted.set(false)\" [disabled]=\"isExporting()\"\r\n                  class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition\">\r\n                  <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                    [class]=\"exportType() === 'raw' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                    <i class=\"fa-solid fa-list\"></i>\r\n                  </div>\r\n                  <div class=\"flex-1 text-left\">\r\n                    <div class=\"text-sm font-black dark:text-slate-200\" [class.text-indigo-700]=\"exportType() === 'raw'\">1. Nh\u1EADt K\u00FD Chi Ti\u1EBFt</div>\r\n                    <div class=\"text-[11px] text-slate-500\">To\u00E0n B\u1ED9 L\u1ECBch S\u1EED Thao T\u00E1c theo D\u00F2ng Th\u1EDDi Gian</div>\r\n                  </div>\r\n                </button>\r\n              </div>\r\n\r\n              <!-- 2. By Standard -->\r\n              <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                [class]=\"exportType() === 'standard' ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-700'\">\r\n                <button (click)=\"!isExporting() && exportType.set('standard'); exportCompleted.set(false)\" [disabled]=\"isExporting()\"\r\n                  class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition\">\r\n                  <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                    [class]=\"exportType() === 'standard' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                    <i class=\"fa-solid fa-flask\"></i>\r\n                  </div>\r\n                  <div class=\"flex-1 text-left\">\r\n                    <div class=\"text-sm font-black dark:text-slate-200\" [class.text-emerald-700]=\"exportType() === 'standard'\">2. T\u1ED5ng H\u1EE3p theo H\u00F3a Ch\u1EA5t</div>\r\n                    <div class=\"text-[11px] text-slate-500\">T\u1ED5ng L\u01B0\u1EE3ng D\u00F9ng c\u1EE7a T\u1EEBng M\u00E3 H\u00F3a Ch\u1EA5t</div>\r\n                  </div>\r\n                </button>\r\n              </div>\r\n\r\n              <!-- 3. By User -->\r\n              <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                [class]=\"exportType() === 'user' ? 'border-orange-200 bg-orange-50/30 dark:border-orange-800 dark:bg-orange-900/20' : 'border-slate-100 dark:border-slate-700'\">\r\n                <button (click)=\"!isExporting() && exportType.set('user'); exportCompleted.set(false)\" [disabled]=\"isExporting()\"\r\n                  class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition\">\r\n                  <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                    [class]=\"exportType() === 'user' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                    <i class=\"fa-solid fa-users\"></i>\r\n                  </div>\r\n                  <div class=\"flex-1 text-left\">\r\n                    <div class=\"text-sm font-black dark:text-slate-200\" [class.text-orange-700]=\"exportType() === 'user'\">3. T\u1ED5ng H\u1EE3p theo Nh\u00E2n Vi\u00EAn</div>\r\n                    <div class=\"text-[11px] text-slate-500\">T\u1EA7n Su\u1EA5t v\u00E0 T\u1ED5ng L\u01B0\u1EE3ng D\u00F9ng theo T\u1EEBng Nh\u00E2n Vi\u00EAn</div>\r\n                  </div>\r\n                </button>\r\n              </div>\r\n            </div>\r\n            </app-export-modal>\r\n          }\r\n        }\r\n      </div>\r\n" }]
    }], () => [], null); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardUsageComponent, { className: "StandardUsageComponent", filePath: "src/app/features/standards/usage/standard-usage.component.ts", lineNumber: 22 }); })();
//# sourceMappingURL=standard-usage.component.js.map