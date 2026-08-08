import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { Router, RouterModule } from '@angular/router';
import { formatSampleList, getSafeGoogleUrl } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ResultService } from './services/result.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ToastService } from '../../core/services/toast.service';
import { doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { PrintService } from '../../core/services/print.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
const ResultListComponent_Conditional_84_Defer_30_DepsFn = () => [import("../../shared/components/date-range-filter/date-range-filter.component").then(m => m.DateRangeFilterComponent)];
const ResultListComponent_Conditional_89_Defer_1_DepsFn = () => [import("./components/merge-runs-modal.component").then(m => m.MergeRunsModalComponent)];
const ResultListComponent_Conditional_90_Defer_1_DepsFn = () => [import("./components/report-hub-modal.component").then(m => m.ReportHubModalComponent)];
const _c0 = () => [1, 2, 3, 4, 5, 6];
const _c1 = a0 => ({ "ring-1 ring-fuchsia-500/20": a0 });
const _c2 = (a0, a1, a2) => ({ "bg-emerald-500": a0, "bg-indigo-500": a1, "bg-amber-500": a2 });
const _c3 = a0 => ["/results", a0];
const _c4 = a0 => ({ "bg-fuchsia-50/20 dark:bg-fuchsia-950/10 border-l-2 border-l-fuchsia-500": a0 });
const _forTrack0 = ($index, $item) => $item.id;
function ResultListComponent_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.filteredCount("all"));
} }
function ResultListComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.filteredCount("pending"));
} }
function ResultListComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 12);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.filteredCount("draft"));
} }
function ResultListComponent_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.filteredCount("completed"));
} }
function ResultListComponent_For_57_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 62);
    i0.ɵɵlistener("click", function ResultListComponent_For_57_Template_button_click_0_listener() { const item_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.toggleSopFilter(item_r3.id)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "span", 63);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassMapInterpolate2("text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all duration-150 hover:scale-105 active:scale-95 ", item_r3.textClass, " ", item_r3.bgClass, "");
    i0.ɵɵclassProp("ring-2", ctx_r0.selectedSopId() === item_r3.id)("ring-violet-500", ctx_r0.selectedSopId() === item_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r3.name, ": ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.count);
} }
function ResultListComponent_ForEmpty_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 37);
    i0.ɵɵtext(1, "Ch\u01B0a c\u00F3 m\u1EBB ch\u1EA1y");
    i0.ɵɵelementEnd();
} }
function ResultListComponent_Conditional_65_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 64);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_65_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.clearSearch()); });
    i0.ɵɵelement(1, "i", 65);
    i0.ɵɵelementEnd();
} }
function ResultListComponent_Conditional_77_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 52);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.selectedRunsCount());
} }
function ResultListComponent_Conditional_81_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 55);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.activeFiltersCount());
} }
function ResultListComponent_Conditional_83_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 66);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_83_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.resetAllFilters()); });
    i0.ɵɵelement(1, "i", 67);
    i0.ɵɵtext(2, " X\u00F3a L\u1ECDc ");
    i0.ɵɵelementEnd();
} }
function ResultListComponent_Conditional_84_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 75);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sop_r7 = ctx.$implicit;
    i0.ɵɵproperty("value", sop_r7.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(sop_r7.name);
} }
function ResultListComponent_Conditional_84_For_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 75);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const analyst_r8 = ctx.$implicit;
    i0.ɵɵproperty("value", analyst_r8);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(analyst_r8);
} }
function ResultListComponent_Conditional_84_Defer_28_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-date-range-filter", 79);
    i0.ɵɵlistener("dateChange", function ResultListComponent_Conditional_84_Defer_28_Template_app_date_range_filter_dateChange_0_listener($event) { i0.ɵɵrestoreView(_r9); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.onDateRangeChange($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("initStart", ctx_r0.startDate())("initEnd", ctx_r0.endDate());
} }
function ResultListComponent_Conditional_84_DeferPlaceholder_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 80);
} }
function ResultListComponent_Conditional_84_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 58)(1, "div", 68)(2, "label", 69);
    i0.ɵɵtext(3, "Ph\u01B0\u01A1ng ph\u00E1p (SOP)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 70)(5, "span", 71);
    i0.ɵɵelement(6, "i", 72);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "select", 73);
    i0.ɵɵlistener("change", function ResultListComponent_Conditional_84_Template_select_change_7_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onSopChange($event)); });
    i0.ɵɵelementStart(8, "option", 74);
    i0.ɵɵtext(9, "T\u1EA5t c\u1EA3 ph\u01B0\u01A1ng ph\u00E1p");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(10, ResultListComponent_Conditional_84_For_11_Template, 2, 2, "option", 75, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(12, "i", 76);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 68)(14, "label", 69);
    i0.ɵɵtext(15, "Analyst");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 70)(17, "span", 71);
    i0.ɵɵelement(18, "i", 77);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "select", 73);
    i0.ɵɵlistener("change", function ResultListComponent_Conditional_84_Template_select_change_19_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onAnalystChange($event)); });
    i0.ɵɵelementStart(20, "option", 74);
    i0.ɵɵtext(21, "T\u1EA5t c\u1EA3 nh\u00E2n vi\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(22, ResultListComponent_Conditional_84_For_23_Template, 2, 2, "option", 75, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(24, "i", 76);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "div", 78)(26, "label", 69);
    i0.ɵɵtext(27, "Kho\u1EA3ng th\u1EDDi gian (Ng\u00E0y duy\u1EC7t)");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(28, ResultListComponent_Conditional_84_Defer_28_Template, 1, 2)(29, ResultListComponent_Conditional_84_DeferPlaceholder_29_Template, 1, 0);
    i0.ɵɵdefer(30, 28, ResultListComponent_Conditional_84_Defer_30_DepsFn, null, 29);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("value", ctx_r0.selectedSopId());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.availableSops());
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("value", ctx_r0.selectedAnalyst());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.availableAnalysts());
    i0.ɵɵadvance(8);
    i0.ɵɵdeferWhen(ctx_r0.showAdvancedFilters());
} }
function ResultListComponent_Conditional_86_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 81);
    i0.ɵɵelement(1, "app-skeleton", 82)(2, "app-skeleton", 83)(3, "app-skeleton", 84)(4, "app-skeleton", 85);
    i0.ɵɵelementEnd();
} }
function ResultListComponent_Conditional_86_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 60);
    i0.ɵɵrepeaterCreate(1, ResultListComponent_Conditional_86_For_2_Template, 5, 0, "div", 81, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 114);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_5_Template_label_click_0_listener($event) { i0.ɵɵrestoreView(_r13); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(1, "input", 115);
    i0.ɵɵlistener("change", function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_5_Template_input_change_1_listener() { i0.ɵɵrestoreView(_r13); const run_r12 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.toggleRunSelection(run_r12)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const run_r12 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r0.selectedRunsMap()[run_r12.id]);
} }
function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 98);
    i0.ɵɵtext(1, "M\u1EBB t\u1ED5ng h\u1EE3p");
    i0.ɵɵelementEnd();
} }
function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 116);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_10_Template_a_click_0_listener($event) { i0.ɵɵrestoreView(_r14); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(1, "i", 117);
    i0.ɵɵtext(2, " \u0110\u00E3 g\u1ED9p ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const run_r12 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵpropertyInterpolate1("title", "M\u1EBB n\u00E0y \u0111\u00E3 \u0111\u01B0\u1EE3c g\u1ED9p v\u00E0o Master ", run_r12.parentMasterId, "");
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(3, _c3, run_r12.parentMasterId));
} }
function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 100);
    i0.ɵɵelement(1, "i", 118);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const run_r12 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵpropertyInterpolate1("title", "\u0110ang \u0111\u01B0\u1EE3c m\u1EDF ch\u1EC9nh s\u1EEDa b\u1EDFi ", run_r12.lockedByName || run_r12.lockedBy, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \u0110ang s\u1EEDa b\u1EDFi ", run_r12.lockedByName || "KTV kh\u00E1c", " ");
} }
function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 104);
    i0.ɵɵelement(1, "i", 119);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const run_r12 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" G\u1ED9p t\u1EEB: ", run_r12.childRequestIds.join(", "), " ");
} }
function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 108);
    i0.ɵɵelement(1, "i", 120);
    i0.ɵɵelementStart(2, "span", 121);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const run_r12 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.formatSampleList(run_r12.sampleList));
} }
function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 109);
} }
function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 122);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_26_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r15); const run_r12 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(3); ctx_r0.openReportHub(run_r12); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(1, "i", 123);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "B\u00E1o C\u00E1o PDF");
    i0.ɵɵelementEnd()();
} }
function ResultListComponent_Conditional_87_Conditional_0_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 91);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_0_For_2_Template_div_click_0_listener() { const run_r12 = i0.ɵɵrestoreView(_r11).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.enterResults(run_r12.id)); });
    i0.ɵɵelement(1, "div");
    i0.ɵɵelementStart(2, "div", 92)(3, "div", 93)(4, "div", 94);
    i0.ɵɵtemplate(5, ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_5_Template, 2, 1, "label", 95);
    i0.ɵɵelementStart(6, "span", 96);
    i0.ɵɵelement(7, "span", 97);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_9_Template, 2, 0, "span", 98)(10, ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_10_Template, 3, 5, "a", 99)(11, ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_11_Template, 3, 3, "span", 100);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span", 101);
    i0.ɵɵelement(13, "i", 102);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "h3", 103);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(17, ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_17_Template, 3, 1, "div", 104);
    i0.ɵɵelementStart(18, "div", 105)(19, "div", 106);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 107);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(23, ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_23_Template, 4, 1, "div", 108)(24, ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_24_Template, 1, 0, "div", 109);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "div", 110);
    i0.ɵɵtemplate(26, ResultListComponent_Conditional_87_Conditional_0_For_2_Conditional_26_Template, 4, 0, "button", 111);
    i0.ɵɵelementStart(27, "button", 112);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_0_For_2_Template_button_click_27_listener($event) { const run_r12 = i0.ɵɵrestoreView(_r11).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); ctx_r0.enterResults(run_r12.id, undefined, false); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(28, "i", 113);
    i0.ɵɵtext(29, " Chi Ti\u1EBFt M\u1EBB Ch\u1EA1y ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const run_r12 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("ring-2", ctx_r0.lastSelectedRequestId() === run_r12.id)("ring-fuchsia-500", ctx_r0.lastSelectedRequestId() === run_r12.id);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(25, _c1, run_r12.isVirtualMaster && ctx_r0.lastSelectedRequestId() !== run_r12.id));
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("h-1 bg-gradient-to-r ", ctx_r0.getSopGradientClass(run_r12.sopId), " shrink-0");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r0.isMergeModeActive() ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.getStatusClass(run_r12.id));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(27, _c2, ctx_r0.runStatusMap()[run_r12.id] === "completed", ctx_r0.runStatusMap()[run_r12.id] === "draft", ctx_r0.runStatusMap()[run_r12.id] === "pending" || !ctx_r0.runStatusMap()[run_r12.id]));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getStatusText(run_r12.id), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(run_r12.isVirtualMaster ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(run_r12.parentMasterId ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isRunLocked(run_r12) ? 11 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getRunDate(run_r12) ? ctx_r0.formatAnalysisDate(ctx_r0.getRunDate(run_r12)) : "\u2014", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", run_r12.sopName, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(run_r12.isVirtualMaster && run_r12.childRequestIds ? 17 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r0.getAnalystAvatarClass(run_r12.user));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getAnalystInitials(run_r12.user), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(run_r12.user || "Unknown");
    i0.ɵɵadvance();
    i0.ɵɵconditional(run_r12.sampleList && run_r12.sampleList.length > 0 ? 23 : 24);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional((run_r12.analysisResultSummary == null ? null : run_r12.analysisResultSummary.reports) || (run_r12.analysisResultSummary == null ? null : run_r12.analysisResultSummary.pdfUrl) || (run_r12.analysisResultSummary == null ? null : run_r12.analysisResultSummary.pdfViewUrl) || (run_r12.analysisResult == null ? null : run_r12.analysisResult.reports) || (run_r12.analysisResult == null ? null : run_r12.analysisResult.pdfUrl) ? 26 : -1);
} }
function ResultListComponent_Conditional_87_Conditional_0_ForEmpty_3_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 128);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_0_ForEmpty_3_Conditional_5_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.resetAllFilters()); });
    i0.ɵɵtext(1, "X\u00F3a B\u1ED9 L\u1ECDc");
    i0.ɵɵelementEnd();
} }
function ResultListComponent_Conditional_87_Conditional_0_ForEmpty_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 90)(1, "div", 124);
    i0.ɵɵelement(2, "i", 125);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 126);
    i0.ɵɵtext(4, "Kh\u00F4ng t\u00ECm th\u1EA5y m\u1EBB n\u00E0o ph\u00F9 h\u1EE3p.");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, ResultListComponent_Conditional_87_Conditional_0_ForEmpty_3_Conditional_5_Template, 2, 0, "button", 127);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r0.hasActiveFilters() ? 5 : -1);
} }
function ResultListComponent_Conditional_87_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 86);
    i0.ɵɵrepeaterCreate(1, ResultListComponent_Conditional_87_Conditional_0_For_2_Template, 30, 31, "div", 89, _forTrack0, false, ResultListComponent_Conditional_87_Conditional_0_ForEmpty_3_Template, 6, 1, "div", 90);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.paginatedRuns());
} }
function ResultListComponent_Conditional_87_Conditional_1_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 132);
    i0.ɵɵelement(1, "i", 138);
    i0.ɵɵelementEnd();
} }
function ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 134)(1, "label", 114);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_1_Template_label_click_1_listener($event) { i0.ɵɵrestoreView(_r18); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "input", 156);
    i0.ɵɵlistener("change", function ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_1_Template_input_change_2_listener() { i0.ɵɵrestoreView(_r18); const run_r17 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.toggleRunSelection(run_r17)); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const run_r17 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r0.selectedRunsMap()[run_r17.id]);
} }
function ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 98);
    i0.ɵɵtext(1, "M\u1EBB t\u1ED5ng h\u1EE3p");
    i0.ɵɵelementEnd();
} }
function ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 100);
    i0.ɵɵelement(1, "i", 118);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const run_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵpropertyInterpolate1("title", "\u0110ang \u0111\u01B0\u1EE3c m\u1EDF ch\u1EC9nh s\u1EEDa b\u1EDFi ", run_r17.lockedByName || run_r17.lockedBy, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \u0110ang s\u1EEDa b\u1EDFi ", run_r17.lockedByName || "KTV kh\u00E1c", " ");
} }
function ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 143);
    i0.ɵɵelement(1, "i", 117);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const run_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" G\u1ED9p t\u1EEB: ", run_r17.childRequestIds.join(", "), " ");
} }
function ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 157);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_34_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r19); const run_r17 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(3); ctx_r0.openReportHub(run_r17); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(1, "i", 123);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "B\u00E1o C\u00E1o PDF");
    i0.ɵɵelementEnd()();
} }
function ResultListComponent_Conditional_87_Conditional_1_For_20_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 139);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_1_For_20_Template_tr_click_0_listener() { const run_r17 = i0.ɵɵrestoreView(_r16).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.enterResults(run_r17.id)); });
    i0.ɵɵtemplate(1, ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_1_Template, 3, 1, "td", 134);
    i0.ɵɵelementStart(2, "td", 133)(3, "div", 140);
    i0.ɵɵelement(4, "span");
    i0.ɵɵelementStart(5, "span", 141);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_7_Template, 2, 0, "span", 98)(8, ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_8_Template, 3, 3, "span", 100);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 142);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_11_Template, 3, 1, "div", 143);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "td", 133)(13, "div", 94)(14, "div", 106);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span", 144);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(18, "td", 145);
    i0.ɵɵelement(19, "i", 146);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "td", 147)(22, "div", 148)(23, "span", 149);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(25, " m\u1EABu ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "div", 150);
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(28, "td", 134)(29, "span", 151);
    i0.ɵɵelement(30, "span", 97);
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "td", 133)(33, "div", 152);
    i0.ɵɵtemplate(34, ResultListComponent_Conditional_87_Conditional_1_For_20_Conditional_34_Template, 4, 0, "button", 153);
    i0.ɵɵelementStart(35, "button", 154);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_1_For_20_Template_button_click_35_listener($event) { const run_r17 = i0.ɵɵrestoreView(_r16).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); ctx_r0.enterResults(run_r17.id, undefined, false); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(36, "i", 155);
    i0.ɵɵtext(37, " Chi Ti\u1EBFt ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const run_r17 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(23, _c4, ctx_r0.lastSelectedRequestId() === run_r17.id));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isMergeModeActive() ? 1 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵclassMapInterpolate1("w-2 h-2 rounded-full bg-gradient-to-r ", ctx_r0.getSopGradientClass(run_r17.sopId), " shrink-0");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(run_r17.sopName);
    i0.ɵɵadvance();
    i0.ɵɵconditional(run_r17.isVirtualMaster ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isRunLocked(run_r17) ? 8 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((run_r17.inputs == null ? null : run_r17.inputs["batchCode"]) || run_r17.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional(run_r17.isVirtualMaster && run_r17.childRequestIds ? 11 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r0.getAnalystAvatarClass(run_r17.user));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getAnalystInitials(run_r17.user), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(run_r17.user || "Unknown");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getRunDate(run_r17) ? ctx_r0.formatAnalysisDate(ctx_r0.getRunDate(run_r17)) : "\u2014", " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate((run_r17.sampleList == null ? null : run_r17.sampleList.length) || 0);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", run_r17.sampleList ? ctx_r0.formatSampleList(run_r17.sampleList) : "");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", run_r17.sampleList ? ctx_r0.formatSampleList(run_r17.sampleList) : "Tr\u1ED1ng", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r0.getStatusClass(run_r17.id));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(25, _c2, ctx_r0.runStatusMap()[run_r17.id] === "completed", ctx_r0.runStatusMap()[run_r17.id] === "draft", ctx_r0.runStatusMap()[run_r17.id] === "pending" || !ctx_r0.runStatusMap()[run_r17.id]));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getStatusText(run_r17.id), " ");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional((run_r17.analysisResultSummary == null ? null : run_r17.analysisResultSummary.reports) || (run_r17.analysisResultSummary == null ? null : run_r17.analysisResultSummary.pdfUrl) || (run_r17.analysisResultSummary == null ? null : run_r17.analysisResultSummary.pdfViewUrl) || (run_r17.analysisResult == null ? null : run_r17.analysisResult.reports) || (run_r17.analysisResult == null ? null : run_r17.analysisResult.pdfUrl) ? 34 : -1);
} }
function ResultListComponent_Conditional_87_Conditional_1_ForEmpty_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 158);
    i0.ɵɵelement(2, "i", 159);
    i0.ɵɵtext(3, " Kh\u00F4ng t\u00ECm th\u1EA5y m\u1EBB n\u00E0o ph\u00F9 h\u1EE3p. ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵattribute("colspan", ctx_r0.isMergeModeActive() ? 7 : 6);
} }
function ResultListComponent_Conditional_87_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 87)(1, "div", 129)(2, "table", 130)(3, "thead")(4, "tr", 131);
    i0.ɵɵtemplate(5, ResultListComponent_Conditional_87_Conditional_1_Conditional_5_Template, 2, 0, "th", 132);
    i0.ɵɵelementStart(6, "th", 133);
    i0.ɵɵtext(7, "Ph\u01B0\u01A1ng ph\u00E1p / M\u00E3 m\u1EBB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th", 133);
    i0.ɵɵtext(9, "Ph\u00E2n t\u00EDch vi\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th", 133);
    i0.ɵɵtext(11, "Ng\u00E0y ch\u1EA1y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "th", 133);
    i0.ɵɵtext(13, "M\u1EABu ki\u1EC3m nghi\u1EC7m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "th", 134);
    i0.ɵɵtext(15, "Tr\u1EA1ng th\u00E1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "th", 135);
    i0.ɵɵtext(17, "H\u00E0nh \u0111\u1ED9ng");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(18, "tbody", 136);
    i0.ɵɵrepeaterCreate(19, ResultListComponent_Conditional_87_Conditional_1_For_20_Template, 38, 29, "tr", 137, _forTrack0, false, ResultListComponent_Conditional_87_Conditional_1_ForEmpty_21_Template, 4, 1, "tr");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r0.isMergeModeActive() ? 5 : -1);
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater(ctx_r0.paginatedRuns());
} }
function ResultListComponent_Conditional_87_Conditional_2_For_13_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 167);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_2_For_13_Template_button_click_0_listener() { const page_r22 = i0.ɵɵrestoreView(_r21).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setPage(page_r22)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const page_r22 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassMap(ctx_r0.activePage() === page_r22 ? "bg-fuchsia-600 text-white border-fuchsia-600 shadow-sm" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-fuchsia-300 dark:hover:border-fuchsia-800");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", page_r22, " ");
} }
function ResultListComponent_Conditional_87_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 88)(1, "div", 160);
    i0.ɵɵtext(2, " Hi\u1EC3n th\u1ECB ");
    i0.ɵɵelementStart(3, "span", 161);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5, " - ");
    i0.ɵɵelementStart(6, "span", 161);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 162)(10, "button", 163);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_2_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r20); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.previousPage()); });
    i0.ɵɵelement(11, "i", 164);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(12, ResultListComponent_Conditional_87_Conditional_2_For_13_Template, 2, 3, "button", 165, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementStart(14, "button", 163);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_87_Conditional_2_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r20); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.nextPage()); });
    i0.ɵɵelement(15, "i", 166);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.pageStartIndex());
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.pageEndIndex());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" / ", ctx_r0.displayedRuns().length, " m\u1EBB ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r0.activePage() === 1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.visiblePageNumbers());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r0.activePage() === ctx_r0.totalPages());
} }
function ResultListComponent_Conditional_87_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ResultListComponent_Conditional_87_Conditional_0_Template, 4, 1, "div", 86)(1, ResultListComponent_Conditional_87_Conditional_1_Template, 22, 2, "div", 87)(2, ResultListComponent_Conditional_87_Conditional_2_Template, 16, 5, "div", 88);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r0.viewMode() === "grid" ? 0 : ctx_r0.viewMode() === "table" ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.displayedRuns().length > ctx_r0.pageSize ? 2 : -1);
} }
function ResultListComponent_Conditional_88_Template(rf, ctx) { if (rf & 1) {
    const _r23 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 61)(1, "div", 168)(2, "span", 169);
    i0.ɵɵtext(3, "\u0110\u00E3 ch\u1ECDn ");
    i0.ɵɵelementStart(4, "span", 170);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(6, " m\u1EBB \u0111\u1EC3 g\u1ED9p");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 171);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 94)(10, "button", 172);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_88_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r23); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.cancelSelection()); });
    i0.ɵɵtext(11, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 173);
    i0.ɵɵlistener("click", function ResultListComponent_Conditional_88_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r23); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.openMergeModal()); });
    i0.ɵɵelement(13, "i", 174);
    i0.ɵɵtext(14, " G\u1ED9p M\u1EBB Ch\u1EA1y ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.selectedRunsCount());
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.getSelectedSopName());
} }
function ResultListComponent_Conditional_89_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-merge-runs-modal", 175);
    i0.ɵɵlistener("close", function ResultListComponent_Conditional_89_Defer_0_Template_app_merge_runs_modal_close_0_listener() { i0.ɵɵrestoreView(_r24); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.closeMergeModal()); })("masterCurveRunIdChange", function ResultListComponent_Conditional_89_Defer_0_Template_app_merge_runs_modal_masterCurveRunIdChange_0_listener($event) { i0.ɵɵrestoreView(_r24); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.masterCurveRunId.set($event)); })("unifiedDateStringChange", function ResultListComponent_Conditional_89_Defer_0_Template_app_merge_runs_modal_unifiedDateStringChange_0_listener($event) { i0.ɵɵrestoreView(_r24); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.unifiedDateString.set($event)); })("customMasterIdChange", function ResultListComponent_Conditional_89_Defer_0_Template_app_merge_runs_modal_customMasterIdChange_0_listener($event) { i0.ɵɵrestoreView(_r24); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.customMasterId.set($event)); })("merge", function ResultListComponent_Conditional_89_Defer_0_Template_app_merge_runs_modal_merge_0_listener() { i0.ɵɵrestoreView(_r24); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.executeMerge()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r0.showMergeModal())("selectedRuns", ctx_r0.getSelectedRuns())("masterCurveRunId", ctx_r0.masterCurveRunId())("unifiedDateString", ctx_r0.unifiedDateString())("customMasterId", ctx_r0.customMasterId());
} }
function ResultListComponent_Conditional_89_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ResultListComponent_Conditional_89_Defer_0_Template, 1, 5);
    i0.ɵɵdefer(1, 0, ResultListComponent_Conditional_89_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function ResultListComponent_Conditional_90_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r25 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-report-hub-modal", 176);
    i0.ɵɵlistener("close", function ResultListComponent_Conditional_90_Defer_0_Template_app_report_hub_modal_close_0_listener() { i0.ɵɵrestoreView(_r25); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.closeReportHub()); })("createReport", function ResultListComponent_Conditional_90_Defer_0_Template_app_report_hub_modal_createReport_0_listener($event) { i0.ɵɵrestoreView(_r25); const ctx_r0 = i0.ɵɵnextContext(2); ctx_r0.enterResults($event.requestId, $event.prefix, true); return i0.ɵɵresetView(ctx_r0.closeReportHub()); })("previewPdf", function ResultListComponent_Conditional_90_Defer_0_Template_app_report_hub_modal_previewPdf_0_listener($event) { i0.ɵɵrestoreView(_r25); const ctx_r0 = i0.ɵɵnextContext(2); ctx_r0.openPdfPreview($event.pdfUrl, $event.docsUrl, $event.prefix, $event.version, $event.publishedBy, $event.publishedAt); return i0.ɵɵresetView(ctx_r0.closeReportHub()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r0.showReportHubModal())("run", ctx_r0.selectedRequestForReport())("historyList", ctx_r0.selectedRequestHistoryList())("isLoadingHistory", ctx_r0.isLoadingHistory())("runStatus", ctx_r0.selectedRequestForReport() ? ctx_r0.runStatusMap()[ctx_r0.selectedRequestForReport().id] : "");
} }
function ResultListComponent_Conditional_90_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ResultListComponent_Conditional_90_Defer_0_Template, 1, 5);
    i0.ɵɵdefer(1, 0, ResultListComponent_Conditional_90_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
export class ResultListComponent {
    constructor() {
        this.state = inject(StateService);
        this.router = inject(Router);
        this.resultService = inject(ResultService);
        this.fb = inject(FirebaseService);
        this.toast = inject(ToastService);
        this.printService = inject(PrintService);
        this.formatSampleList = formatSampleList;
        this.getSafeGoogleUrl = getSafeGoogleUrl;
        this.isLoading = signal(true);
        this.filterStatus = signal('all');
        this.pageSize = 24;
        this.currentPage = signal(1);
        // Advanced Filters State
        this.searchText = signal('');
        this.selectedSopId = signal('all');
        this.selectedAnalyst = signal('all');
        // Active filters count
        this.activeFiltersCount = computed(() => {
            let count = 0;
            if (this.searchText().trim())
                count++;
            if (this.selectedSopId() !== 'all')
                count++;
            if (this.selectedAnalyst() !== 'all')
                count++;
            if (this.startDate() || this.endDate())
                count++;
            return count;
        });
        // Dynamic Multi-day Merging State (Option C)
        this.isMergeModeActive = signal(false);
        this.selectedRunsMap = signal({});
        this.selectedRunsCount = computed(() => Object.values(this.selectedRunsMap()).filter(Boolean).length);
        this.showMergeModal = signal(false);
        this.masterCurveRunId = signal('');
        this.unifiedDateString = signal('');
        this.customMasterId = signal('');
        // Premium Dashboard & View Mode States
        this.viewMode = signal('grid');
        this.activeReportDropdownId = signal(null);
        // Premium Glassmorphic Report Hub Modal States
        this.showReportHubModal = signal(false);
        this.selectedRequestForReport = signal(null);
        this.selectedRequestHistoryList = signal([]);
        this.isLoadingHistory = signal(false);
        this.averageCompletion = computed(() => {
            const runs = this.allApprovedRuns();
            if (runs.length === 0)
                return 0;
            const total = runs.reduce((sum, run) => sum + this.getRunProgress(run), 0);
            return Math.round(total / runs.length);
        });
        this.pendingCount = computed(() => {
            return this.filteredCount('pending');
        });
        this.sopDistribution = computed(() => {
            const runs = this.allApprovedRuns();
            const distribution = {};
            // Aesthetic dynamic color palette
            const colorPalette = [
                { bg: 'bg-violet-50/70 dark:bg-violet-950/20', text: 'text-violet-650 dark:text-violet-400 border-violet-200/40 dark:border-violet-900/30', bar: 'bg-violet-500' },
                { bg: 'bg-indigo-50/70 dark:bg-indigo-950/20', text: 'text-indigo-650 dark:text-indigo-400 border-indigo-200/40 dark:border-indigo-900/30', bar: 'bg-indigo-500' },
                { bg: 'bg-pink-50/70 dark:bg-pink-950/20', text: 'text-pink-650 dark:text-pink-400 border-pink-200/40 dark:border-pink-900/30', bar: 'bg-pink-500' },
                { bg: 'bg-cyan-50/70 dark:bg-cyan-950/20', text: 'text-cyan-650 dark:text-cyan-400 border-cyan-200/40 dark:border-cyan-900/30', bar: 'bg-cyan-500' },
                { bg: 'bg-amber-50/70 dark:bg-amber-950/20', text: 'text-amber-650 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30', bar: 'bg-amber-500' },
                { bg: 'bg-emerald-50/70 dark:bg-emerald-950/20', text: 'text-emerald-650 dark:text-emerald-450 border-emerald-200/40 dark:border-emerald-900/30', bar: 'bg-emerald-500' },
            ];
            runs.forEach((run) => {
                const sopId = run.sopId || 'unknown';
                const sopName = run.sopName || 'Khác';
                if (!distribution[sopId]) {
                    distribution[sopId] = {
                        count: 0,
                        name: sopName
                    };
                }
                distribution[sopId].count++;
            });
            return Object.entries(distribution).map(([id, data], index) => {
                const palette = colorPalette[index % colorPalette.length];
                return {
                    id,
                    count: data.count,
                    name: data.name,
                    bgClass: palette.bg,
                    textClass: palette.text,
                    barColor: palette.bar
                };
            }).sort((a, b) => b.count - a.count);
        });
        this.startDate = signal('');
        this.endDate = signal('');
        this.showAdvancedFilters = signal(false);
        // Dynamic history loading states
        this.historiesMap = signal({});
        this.loadingHistories = signal({});
        this.runStatusMap = computed(() => {
            const statusMap = {};
            const all = this.state.approvedRequests() || [];
            all.forEach((run) => {
                // Post-Document-Splitting: saveDraft() writes status to root of requests doc
                // ('draft' | 'completed'). Root status='approved' means no entry done yet.
                // Legacy backward compat: also check analysisResult.status for old docs.
                const rootStatus = run.status || 'approved';
                if (rootStatus === 'draft' || rootStatus === 'completed') {
                    statusMap[run.id] = rootStatus;
                }
                else {
                    // 'approved' or unknown → check legacy analysisResult field
                    statusMap[run.id] = run.analysisResult?.status || 'pending';
                }
            });
            return statusMap;
        });
        this.lastSelectedRequestId = signal(null);
        // Danh sách các mẻ đã duyệt thành công
        this.allApprovedRuns = computed(() => {
            return this.state.approvedRequests() || [];
        });
        // Dynamic lists for filters
        this.availableSops = computed(() => {
            const runs = this.allApprovedRuns();
            const map = new Map(); // sopId -> sopName
            runs.forEach((run) => {
                if (run.sopId && run.sopName) {
                    map.set(run.sopId, run.sopName);
                }
            });
            return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
        });
        this.availableAnalysts = computed(() => {
            const runs = this.allApprovedRuns();
            const set = new Set();
            runs.forEach((run) => {
                if (run.user)
                    set.add(run.user);
            });
            return Array.from(set).sort();
        });
        // Lọc danh sách mẻ hiển thị theo bộ lọc
        this.displayedRuns = computed(() => {
            let list = this.allApprovedRuns();
            // 1. Filter by Search Text
            const search = this.searchText().trim().toLowerCase();
            if (search) {
                list = list.filter((run) => {
                    const batchCode = (run.inputs?.['batchCode'] || run.id || '').toLowerCase();
                    const sopName = (run.sopName || '').toLowerCase();
                    const user = (run.user || '').toLowerCase();
                    const samples = (run.sampleList || []).map((s) => s.toLowerCase());
                    return batchCode.includes(search) || sopName.includes(search) || user.includes(search) || samples.some((s) => s.includes(search));
                });
            }
            // 2. Filter by SOP
            const sopId = this.selectedSopId();
            if (sopId !== 'all') {
                list = list.filter((run) => run.sopId === sopId);
            }
            // 3. Filter by Analyst
            const analyst = this.selectedAnalyst();
            if (analyst !== 'all') {
                list = list.filter((run) => run.user === analyst);
            }
            // 4. Filter by Date
            const start = this.startDate();
            const end = this.endDate();
            if (start || end) {
                list = list.filter((run) => {
                    const runDate = this.getRunDate(run);
                    if (!runDate)
                        return false;
                    if (start && runDate < start)
                        return false;
                    if (end && runDate > end)
                        return false;
                    return true;
                });
            }
            // 5. Filter by Status Tab
            const statusFilter = this.filterStatus();
            const statusMap = this.runStatusMap();
            if (statusFilter !== 'all') {
                list = list.filter((run) => (statusMap[run.id] || 'pending') === statusFilter);
            }
            return list;
        });
        this.totalPages = computed(() => Math.max(1, Math.ceil(this.displayedRuns().length / this.pageSize)));
        this.activePage = computed(() => Math.min(Math.max(this.currentPage(), 1), this.totalPages()));
        this.paginatedRuns = computed(() => {
            const start = (this.activePage() - 1) * this.pageSize;
            return this.displayedRuns().slice(start, start + this.pageSize);
        });
        this.pageStartIndex = computed(() => {
            const total = this.displayedRuns().length;
            return total === 0 ? 0 : ((this.activePage() - 1) * this.pageSize) + 1;
        });
        this.pageEndIndex = computed(() => Math.min(this.activePage() * this.pageSize, this.displayedRuns().length));
        this.visiblePageNumbers = computed(() => {
            const total = this.totalPages();
            const active = this.activePage();
            const start = Math.max(1, Math.min(active - 2, total - 4));
            const end = Math.min(total, start + 4);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        });
    }
    async openReportHub(run) {
        this.selectedRequestForReport.set(run);
        this.showReportHubModal.set(true);
        this.isLoadingHistory.set(true);
        this.selectedRequestHistoryList.set([]);
        // Đăng ký lắng nghe thời gian thực của document mẻ chạy này để luôn có bản in mới nhất
        if (this.reportHubSubscription) {
            this.reportHubSubscription();
        }
        this.reportHubSubscription = this.resultService.subscribeToDraft(run.id, (draft, updatedRun) => {
            if (updatedRun) {
                this.selectedRequestForReport.set(updatedRun);
            }
        });
        try {
            const hist = await this.resultService.getHistory(run.id);
            this.selectedRequestHistoryList.set(hist || []);
        }
        catch (e) {
            console.error('Error fetching report history:', e);
        }
        finally {
            this.isLoadingHistory.set(false);
        }
    }
    closeReportHub() {
        this.showReportHubModal.set(false);
        this.selectedRequestForReport.set(null);
        this.selectedRequestHistoryList.set([]);
        if (this.reportHubSubscription) {
            this.reportHubSubscription();
            this.reportHubSubscription = undefined;
        }
    }
    openPdfPreview(pdfUrl, docsUrl, prefix, versionOverride, analystOverride, dateOverride) {
        if (!pdfUrl)
            return;
        const run = this.selectedRequestForReport();
        const sopName = run?.sopName || '';
        const filterName = prefix === 'ALL' || !prefix ? 'Tất cả mẫu' : (prefix === '' ? 'Không tiền tố' : `Nhóm ${prefix}`);
        const previewUrl = this.getGoogleDrivePreviewUrl(pdfUrl);
        const docPreviewUrl = docsUrl ? this.getGoogleDrivePreviewUrl(docsUrl) : undefined;
        const version = versionOverride !== undefined ? versionOverride : (run?.analysisResultSummary?.version || run?.analysisResult?.version || 1);
        const analyst = analystOverride !== undefined ? analystOverride : (run?.user || 'Chưa rõ');
        const publishDate = dateOverride !== undefined ? dateOverride : (run?.analysisResultSummary?.updatedAt || run?.analysisResult?.pdfCreatedAt);
        this.printService.openPdfPreview(previewUrl, `Báo cáo kết quả — ${sopName} (${filterName})`, version, analyst, publishDate, undefined, 'iframe', docPreviewUrl);
    }
    getGoogleDrivePreviewUrl(url) {
        if (!url)
            return '';
        const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileDMatch && fileDMatch[1]) {
            return `https://drive.google.com/file/d/${fileDMatch[1]}/preview`;
        }
        const docDMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
        if (docDMatch && docDMatch[1]) {
            return `https://docs.google.com/document/d/${docDMatch[1]}/preview`;
        }
        try {
            const urlObj = new URL(url);
            const id = urlObj.searchParams.get('id');
            if (id) {
                return `https://drive.google.com/file/d/${id}/preview`;
            }
        }
        catch (e) {
            const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
            }
        }
        return url;
    }
    asReport(val) {
        return val;
    }
    getSelectedRunPrefixes() {
        const run = this.selectedRequestForReport();
        if (!run)
            return [];
        const prefixes = new Set();
        // Quét từ danh sách mẫu thực tế
        (run.sampleList || []).forEach((s) => {
            const startsWithLetter = /^[a-zA-Z]/.test(s);
            const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
            prefixes.add(prefix);
        });
        return Array.from(prefixes).sort();
    }
    getReportsForPrefix(prefix) {
        const run = this.selectedRequestForReport();
        if (!run)
            return [];
        const reports = run.analysisResultSummary?.reports || run.analysisResult?.reports;
        if (!reports)
            return [];
        const prefixKey = prefix === '' ? '_NO_PREFIX_' : prefix;
        const result = [];
        for (const [key, rep] of Object.entries(reports)) {
            const repPrefix = rep.prefix || key;
            if (repPrefix === prefixKey && (rep.pdfUrl || rep.pdfViewUrl)) {
                result.push({ ...rep, _id: key });
            }
        }
        return result.sort((a, b) => (b.version || 0) - (a.version || 0));
    }
    hasAnyPrefixReport() {
        const prefixes = this.getSelectedRunPrefixes();
        return prefixes.some(pref => this.getReportsForPrefix(pref).length > 0);
    }
    /**
     * Format danh sách mẫu thành chuỗi ngắn gọn, thông minh:
     * - Nếu consecutive (B001, B002, B003) → "B001 -> B003"
     * - Nếu rời rạc → "B001; B004; B008"
     * - Nếu quá dài → cắt và thêm "+N nhóm nữa"
     */
    formatSampleRange(samples, maxDisplay = 999) {
        if (!samples || samples.length === 0)
            return '';
        const shortened = this.getShortenedSampleChips(samples);
        if (shortened.length <= maxDisplay)
            return shortened.join('; ');
        const shown = shortened.slice(0, maxDisplay).join('; ');
        return `${shown} +${shortened.length - maxDisplay} nhóm nữa`;
    }
    /**
     * Nhóm danh sách mẫu thành các đoạn liên tục dưới dạng mảng (để render các chip rút gọn)
     */
    getShortenedSampleChips(samples) {
        const formatted = formatSampleList(samples);
        if (!formatted)
            return [];
        return formatted.split('; ').map(s => s.trim());
    }
    // Date Filters
    getInitialThisMonthRange() {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const toStr = (d) => {
            const offset = d.getTimezoneOffset();
            const local = new Date(d.getTime() - (offset * 60 * 1000));
            return local.toISOString().split('T')[0];
        };
        return { start: toStr(start), end: toStr(today) };
    }
    getReportKeys(reports) {
        if (!reports)
            return [];
        return Object.keys(reports).sort();
    }
    // Premium design dynamic helper methods
    getSopGradientClass(sopId) {
        if (!sopId)
            return 'from-slate-400 to-slate-500';
        if (sopId === 'trifluralin-gcms') {
            return 'from-fuchsia-500 to-pink-500';
        }
        if (sopId === 'fipronil-chlorpyrifos') {
            return 'from-indigo-500 to-sky-500';
        }
        return 'from-violet-500 to-indigo-500';
    }
    getAnalystInitials(user) {
        if (!user)
            return '?';
        const parts = user.trim().split(/\s+/);
        if (parts.length === 1)
            return parts[0].substring(0, 2).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    getAnalystAvatarClass(user) {
        if (!user)
            return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
        const colors = [
            'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30',
            'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-450 dark:border-emerald-900/30',
            'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-450 dark:border-amber-900/30',
            'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-450 dark:border-rose-900/30',
            'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/30',
            'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 dark:border-fuchsia-900/30'
        ];
        let sum = 0;
        for (let i = 0; i < user.length; i++) {
            sum += user.charCodeAt(i);
        }
        return colors[sum % colors.length];
    }
    getRunProgress(run) {
        // resultData is now in results_details (not cached). Use completion status as proxy.
        const status = this.runStatusMap()[run.id] || 'pending';
        if (status === 'completed')
            return 100;
        if (status === 'draft')
            return 50;
        return 0;
    }
    async preloadHistory(requestId) {
        if (this.historiesMap()[requestId] || this.loadingHistories()[requestId])
            return;
        this.loadingHistories.update((map) => ({ ...map, [requestId]: true }));
        try {
            const hist = await this.resultService.getHistory(requestId);
            this.historiesMap.update((map) => ({ ...map, [requestId]: hist }));
        }
        finally {
            this.loadingHistories.update((map) => ({ ...map, [requestId]: false }));
        }
    }
    saveState() {
        try {
            const scrollContainer = document.querySelector('main .overflow-y-auto');
            const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
            const stateToSave = {
                viewMode: this.viewMode(),
                filterStatus: this.filterStatus(),
                currentPage: this.activePage(),
                searchText: this.searchText(),
                selectedSopId: this.selectedSopId(),
                selectedAnalyst: this.selectedAnalyst(),
                showAdvancedFilters: this.showAdvancedFilters(),
                startDate: this.startDate(),
                endDate: this.endDate(),
                isMergeModeActive: this.isMergeModeActive(),
                selectedRunsMap: this.selectedRunsMap(),
                scrollTop
            };
            sessionStorage.setItem('lims_results_list_state', JSON.stringify(stateToSave));
        }
        catch (e) {
            console.error('Error saving results list state:', e);
        }
    }
    restoreState() {
        try {
            const saved = sessionStorage.getItem('lims_results_list_state');
            if (saved) {
                const state = JSON.parse(saved);
                if (state.viewMode)
                    this.viewMode.set(state.viewMode);
                if (state.filterStatus)
                    this.filterStatus.set(state.filterStatus);
                if (state.currentPage)
                    this.currentPage.set(state.currentPage);
                if (state.searchText !== undefined)
                    this.searchText.set(state.searchText);
                if (state.selectedSopId)
                    this.selectedSopId.set(state.selectedSopId);
                if (state.selectedAnalyst)
                    this.selectedAnalyst.set(state.selectedAnalyst);
                if (state.showAdvancedFilters !== undefined)
                    this.showAdvancedFilters.set(state.showAdvancedFilters);
                if (state.startDate)
                    this.startDate.set(state.startDate);
                if (state.endDate)
                    this.endDate.set(state.endDate);
                if (state.isMergeModeActive !== undefined)
                    this.isMergeModeActive.set(state.isMergeModeActive);
                if (state.selectedRunsMap)
                    this.selectedRunsMap.set(state.selectedRunsMap);
            }
            const lastId = sessionStorage.getItem('lims_last_selected_request_id');
            if (lastId) {
                this.lastSelectedRequestId.set(lastId);
                sessionStorage.removeItem('lims_last_selected_request_id');
                setTimeout(() => {
                    this.lastSelectedRequestId.set(null);
                }, 4000); // Highlight for 4 seconds then fade out
            }
        }
        catch (e) {
            console.error('Error restoring results list state:', e);
        }
    }
    restoreScrollPosition() {
        try {
            const saved = sessionStorage.getItem('lims_results_list_state');
            if (saved) {
                const state = JSON.parse(saved);
                if (state.scrollTop) {
                    const scrollContainer = document.querySelector('main .overflow-y-auto');
                    if (scrollContainer) {
                        scrollContainer.scrollTop = state.scrollTop;
                    }
                }
            }
        }
        catch (e) {
            console.error('Error restoring scroll position:', e);
        }
    }
    ngOnInit() {
        this.state.ensureApprovedRequestsListener();
        this.restoreState();
        this.isLoading.set(false);
        setTimeout(() => {
            this.restoreScrollPosition();
        }, 100);
    }
    ngOnDestroy() {
        this.saveState();
        if (this.reportHubSubscription) {
            this.reportHubSubscription();
        }
    }
    setPage(page) {
        this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages()));
        this.scrollResultsToTop();
    }
    previousPage() {
        this.setPage(this.activePage() - 1);
    }
    nextPage() {
        this.setPage(this.activePage() + 1);
    }
    resetPaging() {
        this.currentPage.set(1);
        this.scrollResultsToTop();
    }
    scrollResultsToTop() {
        setTimeout(() => {
            const scrollContainer = document.querySelector('main .overflow-y-auto');
            if (scrollContainer)
                scrollContainer.scrollTop = 0;
        }, 0);
    }
    // Đếm số lượng mẻ theo bộ lọc (áp dụng các bộ lọc nâng cao)
    filteredCount(status) {
        let list = this.allApprovedRuns();
        const search = this.searchText().trim().toLowerCase();
        if (search) {
            list = list.filter((run) => {
                const batchCode = (run.inputs?.['batchCode'] || run.id || '').toLowerCase();
                const sopName = (run.sopName || '').toLowerCase();
                const user = (run.user || '').toLowerCase();
                const samples = (run.sampleList || []).map((s) => s.toLowerCase());
                return batchCode.includes(search) || sopName.includes(search) || user.includes(search) || samples.some((s) => s.includes(search));
            });
        }
        const sopId = this.selectedSopId();
        if (sopId !== 'all') {
            list = list.filter((run) => run.sopId === sopId);
        }
        const analyst = this.selectedAnalyst();
        if (analyst !== 'all') {
            list = list.filter((run) => run.user === analyst);
        }
        const start = this.startDate();
        const end = this.endDate();
        if (start || end) {
            list = list.filter((run) => {
                const runDate = this.getRunDate(run);
                if (!runDate)
                    return false;
                if (start && runDate < start)
                    return false;
                if (end && runDate > end)
                    return false;
                return true;
            });
        }
        const statusMap = this.runStatusMap();
        if (status === 'all')
            return list.length;
        return list.filter((run) => (statusMap[run.id] || 'pending') === status).length;
    }
    getStatusText(requestId) {
        const status = this.runStatusMap()[requestId] || 'pending';
        switch (status) {
            case 'completed': return 'Đã hoàn thành';
            case 'draft': return 'Đang nháp';
            default: return 'Chờ nhập';
        }
    }
    getStatusClass(requestId) {
        const status = this.runStatusMap()[requestId] || 'pending';
        switch (status) {
            case 'completed':
                return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
            case 'draft':
                return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30';
            default:
                return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
        }
    }
    isRunLocked(run) {
        if (!run?.lockedBy)
            return false;
        if (run.lastActiveAt) {
            const convert = (ts) => {
                if (!ts)
                    return null;
                if (ts instanceof Date)
                    return ts;
                if (typeof ts.toDate === 'function')
                    return ts.toDate();
                if (ts.seconds !== undefined)
                    return new Date(ts.seconds * 1000);
                return new Date(ts);
            };
            const lastActive = convert(run.lastActiveAt);
            if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
                return false;
            }
        }
        return true;
    }
    getRunDate(run) {
        if (run.analysisDate)
            return run.analysisDate;
        const convert = (ts) => {
            if (!ts)
                return null;
            if (ts instanceof Date)
                return ts;
            if (typeof ts.toDate === 'function')
                return ts.toDate();
            if (ts.seconds !== undefined)
                return new Date(ts.seconds * 1000);
            return new Date(ts);
        };
        const d = convert(run.approvedAt || run.timestamp);
        if (d && !isNaN(d.getTime())) {
            const offset = d.getTimezoneOffset();
            const local = new Date(d.getTime() - (offset * 60 * 1000));
            return local.toISOString().split('T')[0];
        }
        return '';
    }
    formatAnalysisDate(dateStr) {
        if (!dateStr)
            return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    }
    // Event handlers cho bộ lọc nâng cao
    setStatusFilter(status) {
        this.filterStatus.set(status);
        this.resetPaging();
    }
    showAllRuns() {
        this.filterStatus.set('all');
        this.selectedSopId.set('all');
        this.resetPaging();
    }
    toggleSopFilter(sopId) {
        this.selectedSopId.set(this.selectedSopId() === sopId ? 'all' : sopId);
        this.resetPaging();
    }
    clearSearch() {
        this.searchText.set('');
        this.resetPaging();
    }
    onSearchInput(event) {
        this.searchText.set(event.target.value);
        this.resetPaging();
    }
    onSopChange(event) {
        this.selectedSopId.set(event.target.value);
        this.resetPaging();
    }
    onAnalystChange(event) {
        this.selectedAnalyst.set(event.target.value);
        this.resetPaging();
    }
    onDateRangeChange(range) {
        this.startDate.set(range.start);
        this.endDate.set(range.end);
        this.resetPaging();
    }
    toggleMergeMode() {
        const nextVal = !this.isMergeModeActive();
        this.isMergeModeActive.set(nextVal);
        if (!nextVal) {
            this.selectedRunsMap.set({});
        }
    }
    hasActiveFilters() {
        return this.searchText() !== '' ||
            this.selectedSopId() !== 'all' ||
            this.selectedAnalyst() !== 'all' ||
            this.startDate() !== '' ||
            this.endDate() !== '';
    }
    resetAllFilters() {
        this.searchText.set('');
        this.selectedSopId.set('all');
        this.selectedAnalyst.set('all');
        this.startDate.set('');
        this.endDate.set('');
        this.resetPaging();
    }
    // Option C selection and merging handlers
    toggleRunSelection(run) {
        const current = { ...this.selectedRunsMap() };
        const checked = !current[run.id];
        if (checked) {
            // Validate: Must be same SOP as existing selections (if any)
            const selected = this.getSelectedRuns();
            if (selected.length > 0 && selected[0].sopId !== run.sopId) {
                this.toast.show('Chỉ cho phép gộp các mẻ chạy có cùng Phương pháp (SOP)!', 'info');
                return;
            }
            current[run.id] = true;
        }
        else {
            delete current[run.id];
        }
        this.selectedRunsMap.set(current);
    }
    getSelectedRuns() {
        const map = this.selectedRunsMap();
        return this.allApprovedRuns().filter((run) => map[run.id]);
    }
    getSelectedSopName() {
        const runs = this.getSelectedRuns();
        return runs.length > 0 ? runs[0].sopName : '';
    }
    cancelSelection() {
        this.selectedRunsMap.set({});
    }
    openMergeModal() {
        const runs = this.getSelectedRuns();
        if (runs.length < 2)
            return;
        // Choose default master curve (first one with existing calibration if available)
        // resultData lives in results_details (not in cache) — pick the oldest run as default master
        const defaultCurve = runs[0];
        this.masterCurveRunId.set(defaultCurve.id);
        // Auto-generate date range
        const dates = runs.map(r => this.getRunDate(r)).filter(Boolean).map(d => this.formatAnalysisDate(d));
        const uniqueDates = Array.from(new Set(dates)).sort();
        if (uniqueDates.length === 1) {
            this.unifiedDateString.set(uniqueDates[0]);
        }
        else if (uniqueDates.length > 1) {
            this.unifiedDateString.set(`${uniqueDates[0]} - ${uniqueDates[uniqueDates.length - 1]}`);
        }
        else {
            this.unifiedDateString.set(this.formatAnalysisDate(new Date().toISOString().split('T')[0]));
        }
        // Auto-generate custom master ID
        const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const sopShort = runs[0].sopId === 'trifluralin-gcms' ? 'TRIFLURALIN' : 'SOP';
        this.customMasterId.set(`GOP-${sopShort}-${todayStr}`);
        this.showMergeModal.set(true);
    }
    closeMergeModal() {
        this.showMergeModal.set(false);
    }
    onUnifiedDateChange(event) {
        this.unifiedDateString.set(event.target.value);
    }
    onCustomMasterIdChange(event) {
        this.customMasterId.set(event.target.value.toUpperCase());
    }
    async executeMerge() {
        const sops = this.getSelectedRuns();
        if (sops.length < 2)
            return;
        const masterId = this.customMasterId().trim().toUpperCase() || `GOP-${Date.now()}`;
        const masterCurveId = this.masterCurveRunId();
        const curveRun = sops.find(r => r.id === masterCurveId) || sops[0];
        // Combine sample lists and target mappings uniquely
        const allSamples = new Set();
        const allTargetIds = new Set();
        const combinedSampleTargetMap = {};
        const combinedTargetNames = {};
        sops.forEach(r => {
            if (r.sampleList) {
                r.sampleList.forEach((s) => allSamples.add(s));
            }
            if (r.targetIds) {
                r.targetIds.forEach((t) => allTargetIds.add(t));
            }
            const rTargetNames = r.targetNames || r.inputs?.targetNames;
            if (rTargetNames) {
                Object.entries(rTargetNames).forEach(([targetId, targetName]) => {
                    if (targetName !== null && targetName !== undefined) {
                        combinedTargetNames[targetId] = String(targetName);
                    }
                });
            }
            const rMap = r.sampleTargetMap || r.inputs?.sampleTargetMap;
            if (rMap) {
                Object.keys(rMap).forEach(sampleId => {
                    if (!combinedSampleTargetMap[sampleId]) {
                        combinedSampleTargetMap[sampleId] = [];
                    }
                    const existingTargets = new Set(combinedSampleTargetMap[sampleId]);
                    rMap[sampleId].forEach((t) => existingTargets.add(t));
                    combinedSampleTargetMap[sampleId] = Array.from(existingTargets);
                });
            }
        });
        const sampleList = Array.from(allSamples).sort();
        const targetIds = Array.from(allTargetIds);
        try {
            this.isLoading.set(true);
            // 1. Fetch details of all child runs to merge their data
            const detailPromises = sops.map(r => getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', r.id)));
            const detailSnaps = await Promise.all(detailPromises);
            const detailMap = new Map();
            sops.forEach((r, i) => {
                if (detailSnaps[i].exists()) {
                    detailMap.set(r.id, detailSnaps[i].data());
                }
            });
            // 2. Prepare grid data for the Virtual Master
            const resultData = {};
            const curveDetail = detailMap.get(curveRun.id) || {};
            const curveResultData = curveDetail.resultData || {};
            const curvePage1Data = curveDetail.page1Data || {};
            // Copy calibration and QC from the master curve run
            Object.keys(curveResultData).forEach(key => {
                if (key.startsWith('CAL_') || key.startsWith('QC_') || key.includes('BLANK') || key.includes('SPIKE') || key.includes('FINAL')) {
                    resultData[key] = { ...curveResultData[key] };
                }
            });
            // Copy sample rows from their respective source runs
            sops.forEach(r => {
                const sourceDetail = detailMap.get(r.id) || {};
                const sourceResultData = sourceDetail.resultData || {};
                if (r.sampleList) {
                    r.sampleList.forEach((s) => {
                        if (sourceResultData[s]) {
                            resultData[s] = { ...sourceResultData[s] };
                        }
                        else {
                            resultData[s] = {}; // Fallback empty row
                        }
                    });
                }
            });
            // 3. Prepare the Virtual Master payload (requests metadata)
            const masterPayload = {
                sopId: curveRun.sopId,
                sopName: curveRun.sopName,
                items: curveRun.items || [],
                isVirtualMaster: true,
                childRequestIds: sops.map(r => r.id),
                timestamp: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                approvedAt: serverTimestamp(),
                user: this.state.getCurrentUserName(),
                inputs: {
                    ...(curveRun.inputs || {}),
                    batchCode: masterId,
                    analysisDate: this.unifiedDateString()
                },
                sampleList,
                targetIds,
                targetNames: combinedTargetNames,
                sampleTargetMap: combinedSampleTargetMap,
                status: 'approved'
            };
            // 4. Prepare details payload (results_details)
            const detailPayload = {
                requestId: masterId,
                sopId: curveRun.sopId,
                page1Data: {
                    ...(curvePage1Data || {}),
                    ngayNguoiPhanTich: new Date().toISOString().split('T')[0],
                    ngayNguoiThamTra: new Date().toISOString().split('T')[0],
                    checkTatCaND: true,
                    checkCoMauPhatHien: false
                },
                resultData,
                updatedAt: new Date().toISOString(),
                updatedBy: this.state.getCurrentUserName()
            };
            // 5. Save directly to Firestore via Batch
            const batch = writeBatch(this.fb.db);
            const metaRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', masterId);
            const detailRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', masterId);
            batch.set(metaRef, masterPayload);
            batch.set(detailRef, detailPayload);
            // 6. Set parentMasterId on all child requests
            sops.forEach(r => {
                const childRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', r.id);
                batch.update(childRef, { parentMasterId: masterId });
            });
            // 7. Tạo nhật ký kiểm tra
            const logId = `TRC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);
            batch.set(logRef, {
                id: logId,
                action: 'CREATE_VIRTUAL_MASTER',
                details: `Đã tạo mẻ tổng hợp (gộp mẫu) cho ${masterId}`,
                user: this.state.getCurrentUserName(),
                timestamp: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                requestId: masterId,
                sopBasicInfo: {
                    name: curveRun.sopName,
                    category: 'SOP'
                }
            });
            await batch.commit();
            // Close modal and deselect
            this.closeMergeModal();
            this.cancelSelection();
            this.toast.show(`Đã khởi tạo mẻ tổng hợp "${masterId}" thành công!`, 'success');
            // Save state before navigating
            try {
                sessionStorage.setItem('lims_last_selected_request_id', masterId);
                this.saveState();
            }
            catch (e) { }
            // Navigate immediately to entry grid!
            this.router.navigate(['/results', masterId]);
        }
        catch (e) {
            console.error('Error creating virtual master run:', e);
            this.toast.show('Không thể tạo mẻ gộp: ' + e.message, 'error');
        }
        finally {
            this.isLoading.set(false);
        }
    }
    enterResults(requestId, prefix, forceEdit = false) {
        try {
            sessionStorage.setItem('lims_last_selected_request_id', requestId);
            this.saveState();
        }
        catch (e) { }
        const queryParams = {};
        if (prefix !== undefined) {
            queryParams.prefix = prefix;
        }
        if (forceEdit) {
            this.router.navigate(['/results', requestId], { queryParams });
        }
        else {
            this.router.navigate(['/results-view', requestId], { queryParams });
        }
    }
    openUrl(url) {
        if (url)
            openInNewTab(url);
    }
    static { this.ɵfac = function ResultListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResultListComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResultListComponent, selectors: [["app-result-list"]], decls: 91, vars: 64, consts: [[1, "h-full", "flex", "flex-col", "fade-in", "relative", "bg-slate-50/30", "dark:bg-slate-950/10", "p-2", "md:p-4"], [1, "shrink-0", "pb-0"], [1, "flex", "flex-col", "lg:flex-row", "lg:items-center", "justify-between", "gap-4", "mb-4", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-fuchsia-50", "dark:bg-fuchsia-900/30", "text-fuchsia-600", "dark:text-fuchsia-400", "flex", "items-center", "justify-center", "border", "border-fuchsia-100", "dark:border-fuchsia-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-square-poll-vertical", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "items-center", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "p-1", "rounded-2xl", "shadow-inner", "shrink-0", "overflow-x-auto", "max-w-full", "scrollbar-none", "self-stretch", "sm:self-start", "lg:self-auto"], [1, "px-4", "py-2", "text-xs", "font-black", "rounded-xl", "transition", "duration-150", "active:scale-95", "flex", "items-center", "gap-1.5", 3, "click"], [1, "bg-slate-200", "dark:bg-slate-700", "text-slate-700", "dark:text-slate-300", "px-1.5", "py-0.5", "rounded-md", "text-[9px]", "font-black", "tabular-nums"], [1, "bg-amber-100", "dark:bg-amber-950/40", "text-amber-700", "dark:text-amber-400", "px-1.5", "py-0.5", "rounded-md", "text-[9px]", "font-black", "tabular-nums"], [1, "bg-indigo-100", "dark:bg-indigo-955/40", "text-indigo-700", "dark:text-indigo-400", "px-1.5", "py-0.5", "rounded-md", "text-[9px]", "font-black", "tabular-nums"], [1, "bg-emerald-100", "dark:bg-emerald-955/40", "text-emerald-700", "dark:text-emerald-400", "px-1.5", "py-0.5", "rounded-md", "text-[9px]", "font-black", "tabular-nums"], [1, "flex", "flex-wrap", "items-stretch", "gap-3", "mb-5"], [1, "group", "flex", "items-center", "gap-3", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "px-4", "py-3", "shadow-sm", "hover:shadow-md", "hover:border-blue-300", "dark:hover:border-blue-800", "transition-all", "duration-200", "active:scale-[0.98]", "min-w-[130px]", 3, "click"], [1, "w-9", "h-9", "rounded-xl", "bg-blue-50", "dark:bg-blue-950/30", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "shrink-0", "group-hover:bg-blue-100", "dark:group-hover:bg-blue-950/50", "transition-colors"], [1, "fa-solid", "fa-flask", "text-sm"], [1, "text-left"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "leading-none", "tabular-nums"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "mt-0.5", "whitespace-nowrap"], [1, "group", "flex", "items-center", "gap-3", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "px-4", "py-3", "shadow-sm", "hover:shadow-md", "hover:border-amber-300", "dark:hover:border-amber-800", "transition-all", "duration-200", "active:scale-[0.98]", "min-w-[130px]", 3, "click"], [1, "w-9", "h-9", "rounded-xl", "bg-amber-50", "dark:bg-amber-950/30", "text-amber-600", "dark:text-amber-400", "flex", "items-center", "justify-center", "shrink-0", "group-hover:bg-amber-100", "dark:group-hover:bg-amber-950/50", "transition-colors"], [1, "fa-solid", "fa-clock-rotate-left", "text-sm"], [1, "text-xl", "font-black", "leading-none", "tabular-nums"], [1, "group", "flex", "items-center", "gap-3", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "px-4", "py-3", "shadow-sm", "hover:shadow-md", "hover:border-emerald-300", "dark:hover:border-emerald-800", "transition-all", "duration-200", "active:scale-[0.98]", "min-w-[160px]", 3, "click"], [1, "w-9", "h-9", "rounded-xl", "bg-emerald-50", "dark:bg-emerald-950/30", "text-emerald-600", "dark:text-emerald-400", "flex", "items-center", "justify-center", "shrink-0", "group-hover:bg-emerald-100", "dark:group-hover:bg-emerald-950/50", "transition-colors"], [1, "fa-solid", "fa-chart-line", "text-sm"], [1, "text-left", "flex-1"], [1, "flex", "items-baseline", "gap-1.5"], [1, "text-[9px]", "font-bold", "text-emerald-500"], [1, "w-full", "bg-slate-100", "dark:bg-slate-800", "h-1", "rounded-full", "mt-1.5", "overflow-hidden"], [1, "bg-emerald-500", "h-full", "rounded-full", "transition-all", "duration-500"], [1, "flex-1", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "px-4", "py-3", "shadow-sm", "min-w-[200px]"], [1, "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mb-2"], [1, "flex", "items-center", "gap-1.5", "flex-wrap"], [3, "class", "ring-2", "ring-violet-500"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "shadow-sm", "mb-5", "overflow-hidden"], [1, "flex", "items-center", "gap-2", "p-3", "border-b", "border-slate-100", "dark:border-slate-800/80"], [1, "relative", "flex-1"], [1, "absolute", "inset-y-0", "left-0", "flex", "items-center", "pl-3", "text-slate-400", "pointer-events-none"], [1, "fa-solid", "fa-magnifying-glass", "text-xs"], ["type", "text", "placeholder", "T\u00ECm theo M\u00E3 m\u1EBB, SOP, M\u00E3 s\u1ED1 m\u1EABu, Analyst...", 1, "w-full", "pl-8", "pr-8", "py-2", "text-xs", "bg-slate-50", "dark:bg-slate-950/40", "border", "border-slate-200/60", "dark:border-slate-800", "rounded-xl", "focus:outline-none", "focus:ring-2", "focus:ring-fuchsia-500/15", "focus:border-fuchsia-400", "dark:text-slate-200", "font-semibold", "transition", "placeholder:text-slate-350", "dark:placeholder:text-slate-600", 3, "input", "value"], [1, "absolute", "inset-y-0", "right-0", "flex", "items-center", "pr-3", "text-slate-400", "hover:text-slate-700", "dark:hover:text-slate-200", "transition"], [1, "w-px", "h-6", "bg-slate-200", "dark:bg-slate-800", "shrink-0"], [1, "flex", "bg-slate-100", "dark:bg-slate-800/80", "p-0.5", "rounded-xl", "shrink-0"], [1, "px-3", "py-1.5", "rounded-lg", "text-[10px]", "font-bold", "transition", "flex", "items-center", "gap-1", "duration-150", 3, "click"], [1, "fa-solid", "fa-table-cells"], [1, "fa-solid", "fa-list"], [1, "px-3", "py-2", "border", "rounded-xl", "text-xs", "font-black", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "duration-150", "shadow-sm", "shrink-0", "bg-white", "dark:bg-slate-900", 3, "click"], [1, "fa-solid", "fa-code-merge", "text-[10px]"], [1, "w-4", "h-4", "bg-fuchsia-600", "text-white", "text-[9px]", "font-black", "rounded-full", "flex", "items-center", "justify-center"], [1, "px-3", "py-2", "border", "rounded-xl", "text-xs", "font-black", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "duration-150", "relative", "shrink-0", "bg-white", "dark:bg-slate-900", 3, "click"], [1, "fa-solid", "fa-sliders", "text-[10px]"], [1, "absolute", "-top-1.5", "-right-1.5", "w-4", "h-4", "bg-blue-600", "text-white", "text-[8px]", "font-black", "rounded-full", "flex", "items-center", "justify-center", "shadow-sm"], [1, "fa-solid", "fa-chevron-down", "text-[9px]", "transition-transform", "duration-200"], [1, "px-3", "py-2", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-800", "dark:hover:bg-slate-700", "text-slate-600", "dark:text-slate-350", "rounded-xl", "text-xs", "font-black", "transition", "flex", "items-center", "gap-1", "active:scale-95", "shrink-0"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "md:grid-cols-4", "gap-3", "p-3", "bg-slate-50/50", "dark:bg-slate-950/20", "animate-fade-in"], [1, "flex-1", "overflow-y-auto", "px-6", "pb-6", "custom-scrollbar"], [1, "grid", "md:grid-cols-2", "xl:grid-cols-3", "gap-5", "animate-pulse"], [1, "fixed", "bottom-6", "left-1/2", "-translate-x-1/2", "bg-slate-900/95", "dark:bg-slate-950/98", "text-white", "px-6", "py-3.5", "rounded-2xl", "shadow-2xl", "flex", "items-center", "gap-5", "border", "border-slate-700/60", "backdrop-blur-md", "animate-fade-in", "z-50"], [3, "click"], [1, "font-black"], [1, "absolute", "inset-y-0", "right-0", "flex", "items-center", "pr-3", "text-slate-400", "hover:text-slate-700", "dark:hover:text-slate-200", "transition", 3, "click"], [1, "fa-solid", "fa-circle-xmark", "text-xs"], [1, "px-3", "py-2", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-800", "dark:hover:bg-slate-700", "text-slate-600", "dark:text-slate-350", "rounded-xl", "text-xs", "font-black", "transition", "flex", "items-center", "gap-1", "active:scale-95", "shrink-0", 3, "click"], [1, "fa-solid", "fa-rotate-left", "text-[10px]"], [1, "flex", "flex-col", "gap-1"], [1, "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "relative"], [1, "absolute", "left-3", "inset-y-0", "flex", "items-center", "text-slate-400", "pointer-events-none"], [1, "fa-solid", "fa-flask", "text-[10px]"], [1, "w-full", "appearance-none", "pl-8", "pr-7", "py-2", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/60", "dark:border-slate-800", "rounded-xl", "text-xs", "font-extrabold", "text-slate-700", "dark:text-slate-250", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500/10", "focus:border-blue-500", "transition", "cursor-pointer", 3, "change", "value"], ["value", "all"], [3, "value"], [1, "fa-solid", "fa-chevron-down", "text-[9px]", "absolute", "right-3", "top-1/2", "-translate-y-1/2", "pointer-events-none", "text-slate-400"], [1, "fa-solid", "fa-user", "text-[10px]"], [1, "flex", "flex-col", "gap-1", "sm:col-span-2"], ["containerClass", "bg-transparent p-0 border-0 shadow-none w-full gap-3", 3, "dateChange", "initStart", "initEnd"], [1, "h-9", "rounded-xl", "bg-slate-100/70", "dark:bg-slate-900/60"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-800", "p-5", "space-y-3"], ["width", "80px", "height", "12px"], ["width", "200px", "height", "18px"], ["width", "140px", "height", "12px"], ["width", "100%", "height", "28px"], [1, "grid", "md:grid-cols-2", "xl:grid-cols-3", "gap-5"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-150/80", "dark:border-slate-800/80", "shadow-sm", "overflow-hidden"], [1, "mt-5", "flex", "flex-col", "sm:flex-row", "items-center", "justify-between", "gap-3", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "px-4", "py-3", "shadow-sm"], [1, "group", "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-150/80", "dark:border-slate-800/80", "shadow-sm", "hover:shadow-lg", "hover:-translate-y-0.5", "transition-all", "duration-250", "flex", "flex-col", "overflow-hidden", "relative", "cursor-pointer", 3, "ring-2", "ring-fuchsia-500", "ngClass"], [1, "col-span-full", "text-center", "py-20", "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-dashed", "border-slate-200", "dark:border-slate-800"], [1, "group", "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-150/80", "dark:border-slate-800/80", "shadow-sm", "hover:shadow-lg", "hover:-translate-y-0.5", "transition-all", "duration-250", "flex", "flex-col", "overflow-hidden", "relative", "cursor-pointer", 3, "click", "ngClass"], [1, "flex", "flex-col", "flex-1", "p-5"], [1, "flex", "items-center", "justify-between", "mb-3"], [1, "flex", "items-center", "gap-2"], [1, "inline-flex", "items-center", "cursor-pointer"], [1, "inline-flex", "items-center", "gap-1.5", "px-2.5", "py-1", "rounded-lg", "text-[10px]", "font-black", "uppercase", "tracking-wide", "border"], [1, "w-1.5", "h-1.5", "rounded-full", 3, "ngClass"], [1, "px-1.5", "py-0.5", "rounded", "bg-fuchsia-50", "dark:bg-fuchsia-950/20", "border", "border-fuchsia-100", "dark:border-fuchsia-900/30", "text-fuchsia-600", "dark:text-fuchsia-400", "text-[8px]", "font-black", "uppercase"], [1, "px-1.5", "py-0.5", "rounded", "bg-fuchsia-50", "dark:bg-fuchsia-950/20", "border", "border-fuchsia-200", "dark:border-fuchsia-900/40", "text-fuchsia-600", "dark:text-fuchsia-400", "text-[8px]", "font-black", "uppercase", "hover:bg-fuchsia-100", "dark:hover:bg-fuchsia-900/30", "transition-colors", "flex", "items-center", "gap-0.5", 3, "routerLink", "title"], [1, "px-1.5", "py-0.5", "rounded", "bg-red-50", "dark:bg-red-950/20", "border", "border-red-200", "dark:border-red-900/30", "text-red-655", "dark:text-red-400", "text-[8px]", "font-black", "uppercase", "flex", "items-center", "gap-1", "shadow-xs", 3, "title"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-semibold", "flex", "items-center", "gap-1"], [1, "fa-regular", "fa-calendar", "text-[9px]"], [1, "font-black", "text-slate-800", "dark:text-slate-100", "text-[15px]", "leading-snug", "mb-1", "group-hover:text-fuchsia-600", "dark:group-hover:text-fuchsia-400", "transition-colors"], [1, "text-[9px]", "text-fuchsia-500", "dark:text-fuchsia-400", "font-bold", "mb-2", "flex", "items-center", "gap-1", "bg-fuchsia-50/40", "dark:bg-fuchsia-950/10", "px-2", "py-1", "rounded-lg", "border", "border-fuchsia-100/30", "dark:border-fuchsia-900/20", "select-none", "w-fit"], [1, "flex", "items-center", "gap-2", "mb-3"], [1, "w-6", "h-6", "rounded-full", "border", "flex", "items-center", "justify-center", "text-[9px]", "font-black", "uppercase", "shadow-sm", "shrink-0"], [1, "text-xs", "font-semibold", "text-slate-500", "dark:text-slate-400", "truncate"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-450", "bg-slate-50", "dark:bg-slate-900/60", "border", "border-slate-100", "dark:border-slate-800/60", "rounded-xl", "p-2.5", "flex", "items-start", "gap-1.5", "max-h-16", "overflow-y-auto", "custom-scrollbar", "mb-3", "flex-1"], [1, "flex-1"], [1, "border-t", "border-slate-100", "dark:border-slate-800/80", "px-4", "py-3", "flex", "items-center", "gap-2.5", "bg-slate-50/30", "dark:bg-slate-950/10", "shrink-0"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-2", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-slate-650", "dark:text-slate-300", "hover:bg-red-50", "dark:hover:bg-red-955/20", "hover:text-red-600", "dark:hover:text-red-400", "hover:border-red-200", "dark:hover:border-red-900/40", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95", "shadow-sm"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-2", "px-4", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-slate-700", "dark:text-slate-300", "hover:bg-fuchsia-50", "dark:hover:bg-fuchsia-950/20", "hover:text-fuchsia-600", "dark:hover:text-fuchsia-400", "hover:border-fuchsia-200", "dark:hover:border-fuchsia-900/40", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95", "duration-150", "shadow-sm", 3, "click"], [1, "fa-solid", "text-[11px]", "fa-eye"], [1, "inline-flex", "items-center", "cursor-pointer", 3, "click"], ["type", "checkbox", 1, "w-4", "h-4", "text-fuchsia-600", "bg-white", "dark:bg-slate-800", "border-slate-300", "dark:border-slate-700", "rounded", "focus:ring-fuchsia-500", 3, "change", "checked"], [1, "px-1.5", "py-0.5", "rounded", "bg-fuchsia-50", "dark:bg-fuchsia-950/20", "border", "border-fuchsia-200", "dark:border-fuchsia-900/40", "text-fuchsia-600", "dark:text-fuchsia-400", "text-[8px]", "font-black", "uppercase", "hover:bg-fuchsia-100", "dark:hover:bg-fuchsia-900/30", "transition-colors", "flex", "items-center", "gap-0.5", 3, "click", "routerLink", "title"], [1, "fa-solid", "fa-link", "text-[7px]"], [1, "fa-solid", "fa-lock", "text-[7px]"], [1, "fa-solid", "fa-link", "text-[8px]"], [1, "fa-solid", "fa-vials", "text-slate-350", "dark:text-slate-600", "mt-0.5", "shrink-0", "text-[9px]"], [1, "break-all", "font-mono", "font-semibold", "leading-relaxed"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-2", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-slate-650", "dark:text-slate-300", "hover:bg-red-50", "dark:hover:bg-red-955/20", "hover:text-red-600", "dark:hover:text-red-400", "hover:border-red-200", "dark:hover:border-red-900/40", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95", "shadow-sm", 3, "click"], [1, "fa-solid", "fa-file-pdf", "text-red-500", "text-[11px]"], [1, "w-14", "h-14", "bg-slate-50", "dark:bg-slate-800", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-3", "text-slate-300", "dark:text-slate-600"], [1, "fa-solid", "fa-square-poll-vertical", "text-2xl"], [1, "text-slate-400", "dark:text-slate-500", "font-semibold", "text-sm"], [1, "mt-3", "text-xs", "text-fuchsia-600", "dark:text-fuchsia-400", "font-black", "hover:underline"], [1, "mt-3", "text-xs", "text-fuchsia-600", "dark:text-fuchsia-400", "font-black", "hover:underline", 3, "click"], [1, "overflow-x-auto"], [1, "w-full", "text-xs", "text-left", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-950", "border-b", "border-slate-150", "dark:border-slate-800", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-550", "uppercase", "tracking-widest"], [1, "p-4", "w-10", "text-center"], [1, "p-4"], [1, "p-4", "text-center"], [1, "p-4", "text-right"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800/60"], [1, "hover:bg-slate-50/60", "dark:hover:bg-slate-950/20", "transition-colors", "text-slate-700", "dark:text-slate-300", "cursor-pointer", 3, "ngClass"], [1, "fa-solid", "fa-check-double"], [1, "hover:bg-slate-50/60", "dark:hover:bg-slate-950/20", "transition-colors", "text-slate-700", "dark:text-slate-300", "cursor-pointer", 3, "click", "ngClass"], [1, "flex", "items-center", "gap-2", "mb-0.5"], [1, "font-extrabold", "text-slate-800", "dark:text-slate-150", "text-xs"], [1, "text-[10px]", "text-slate-400", "font-mono", "font-semibold", "ml-4"], [1, "text-[9px]", "text-fuchsia-500", "font-bold", "flex", "items-center", "gap-0.5", "ml-4", "mt-0.5"], [1, "text-xs", "font-semibold", "truncate", "max-w-[100px]"], [1, "p-4", "text-[11px]", "text-slate-500", "dark:text-slate-400", "font-semibold", "whitespace-nowrap"], [1, "fa-regular", "fa-calendar", "mr-1", "text-[9px]"], [1, "p-4", "max-w-[180px]"], [1, "text-[10px]", "font-semibold", "text-slate-500"], [1, "font-extrabold", "text-slate-700", "dark:text-slate-300"], [1, "truncate", "text-[9px]", "font-mono", "text-slate-400", "dark:text-slate-600", 3, "title"], [1, "inline-flex", "items-center", "gap-1.5", "px-2.5", "py-1", "rounded-lg", "text-[9px]", "font-black", "uppercase", "tracking-wide", "border"], [1, "flex", "items-center", "justify-end", "gap-2"], [1, "flex", "items-center", "gap-1.5", "px-2.5", "py-2", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-slate-650", "dark:text-slate-300", "hover:bg-red-50", "dark:hover:bg-red-955/20", "hover:text-red-600", "dark:hover:text-red-400", "hover:border-red-200", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-2", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-slate-700", "dark:text-slate-300", "hover:bg-fuchsia-50", "dark:hover:bg-fuchsia-950/20", "hover:text-fuchsia-600", "dark:hover:text-fuchsia-400", "hover:border-fuchsia-200", "dark:hover:border-fuchsia-900/40", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95", "shadow-sm", "whitespace-nowrap", 3, "click"], [1, "fa-solid", "fa-eye", "text-[10px]"], ["type", "checkbox", 1, "w-4", "h-4", "text-fuchsia-600", "bg-white", "dark:bg-slate-900", "border-slate-300", "dark:border-slate-700", "rounded", "focus:ring-fuchsia-500", 3, "change", "checked"], [1, "flex", "items-center", "gap-1.5", "px-2.5", "py-2", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-slate-650", "dark:text-slate-300", "hover:bg-red-50", "dark:hover:bg-red-955/20", "hover:text-red-600", "dark:hover:text-red-400", "hover:border-red-200", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95", 3, "click"], [1, "text-center", "py-16", "text-slate-400", "dark:text-slate-500", "font-semibold", "text-sm"], [1, "fa-solid", "fa-inbox", "text-2xl", "mb-2", "block", "opacity-40"], [1, "text-[11px]", "font-bold", "text-slate-500", "dark:text-slate-400"], [1, "font-black", "text-slate-800", "dark:text-slate-100"], [1, "flex", "items-center", "gap-1.5"], [1, "w-8", "h-8", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "disabled:opacity-40", "disabled:cursor-not-allowed", "hover:border-fuchsia-300", "dark:hover:border-fuchsia-800", "transition", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-left", "text-[10px]"], [1, "min-w-8", "h-8", "px-2", "rounded-xl", "border", "text-[11px]", "font-black", "transition", 3, "class"], [1, "fa-solid", "fa-chevron-right", "text-[10px]"], [1, "min-w-8", "h-8", "px-2", "rounded-xl", "border", "text-[11px]", "font-black", "transition", 3, "click"], [1, "flex", "flex-col"], [1, "text-xs", "font-black", "text-slate-100"], [1, "text-fuchsia-400"], [1, "text-[9px]", "font-bold", "text-slate-400", "mt-0.5"], [1, "px-3", "py-1.5", "bg-slate-800", "hover:bg-slate-700", "text-slate-300", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95", 3, "click"], [1, "px-4", "py-1.5", "bg-gradient-to-r", "from-fuchsia-500", "to-pink-500", "hover:from-fuchsia-600", "hover:to-pink-600", "text-white", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95", "shadow-md", "shadow-fuchsia-500/20", "flex", "items-center", "gap-1.5", 3, "click"], [1, "fa-solid", "fa-code-merge", "rotate-90", "text-[10px]"], [3, "close", "masterCurveRunIdChange", "unifiedDateStringChange", "customMasterIdChange", "merge", "isOpen", "selectedRuns", "masterCurveRunId", "unifiedDateString", "customMasterId"], [3, "close", "createReport", "previewPdf", "isOpen", "run", "historyList", "isLoadingHistory", "runStatus"]], template: function ResultListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
            i0.ɵɵelement(5, "i", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div")(7, "h2", 6);
            i0.ɵɵtext(8, "Tra C\u1EE9u v\u00E0 Qu\u1EA3n L\u00FD K\u1EBFt Qu\u1EA3 M\u1EBB Ch\u1EA1y");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "p", 7);
            i0.ɵɵtext(10, "Nh\u1EADp k\u1EBFt qu\u1EA3, ki\u1EC3m so\u00E1t ch\u1EA5t l\u01B0\u1EE3ng (QC) v\u00E0 t\u1EA1o phi\u1EBFu k\u1EBFt qu\u1EA3 t\u1EF1 \u0111\u1ED9ng.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(11, "div", 8)(12, "button", 9);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_12_listener() { return ctx.setStatusFilter("all"); });
            i0.ɵɵtext(13, " T\u1EA5t c\u1EA3 ");
            i0.ɵɵtemplate(14, ResultListComponent_Conditional_14_Template, 2, 1, "span", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "button", 9);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_15_listener() { return ctx.setStatusFilter("pending"); });
            i0.ɵɵtext(16, " Ch\u1EDD nh\u1EADp ");
            i0.ɵɵtemplate(17, ResultListComponent_Conditional_17_Template, 2, 1, "span", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "button", 9);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_18_listener() { return ctx.setStatusFilter("draft"); });
            i0.ɵɵtext(19, " \u0110ang nh\u00E1p ");
            i0.ɵɵtemplate(20, ResultListComponent_Conditional_20_Template, 2, 1, "span", 12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "button", 9);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_21_listener() { return ctx.setStatusFilter("completed"); });
            i0.ɵɵtext(22, " Ho\u00E0n th\u00E0nh ");
            i0.ɵɵtemplate(23, ResultListComponent_Conditional_23_Template, 2, 1, "span", 13);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(24, "div", 14)(25, "button", 15);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_25_listener() { return ctx.showAllRuns(); });
            i0.ɵɵelementStart(26, "div", 16);
            i0.ɵɵelement(27, "i", 17);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "div", 18)(29, "div", 19);
            i0.ɵɵtext(30);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "div", 20);
            i0.ɵɵtext(32, "M\u1EBB Ho\u1EA1t \u0110\u1ED9ng");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(33, "button", 21);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_33_listener() { return ctx.setStatusFilter("pending"); });
            i0.ɵɵelementStart(34, "div", 22);
            i0.ɵɵelement(35, "i", 23);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "div", 18)(37, "div", 24);
            i0.ɵɵtext(38);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "div", 20);
            i0.ɵɵtext(40, "Ch\u1EDD Nh\u1EADp");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(41, "button", 25);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_41_listener() { return ctx.setStatusFilter("completed"); });
            i0.ɵɵelementStart(42, "div", 26);
            i0.ɵɵelement(43, "i", 27);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "div", 28)(45, "div", 29)(46, "span", 19);
            i0.ɵɵtext(47);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "span", 30);
            i0.ɵɵtext(49, "Ho\u00E0n Th\u00E0nh");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(50, "div", 31);
            i0.ɵɵelement(51, "div", 32);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(52, "div", 33)(53, "div", 34);
            i0.ɵɵtext(54, "Ph\u00E2n b\u1ED5 Ph\u01B0\u01A1ng Ph\u00E1p SOP");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "div", 35);
            i0.ɵɵrepeaterCreate(56, ResultListComponent_For_57_Template, 4, 10, "button", 36, _forTrack0, false, ResultListComponent_ForEmpty_58_Template, 2, 0, "span", 37);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(59, "div", 38)(60, "div", 39)(61, "div", 40)(62, "span", 41);
            i0.ɵɵelement(63, "i", 42);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "input", 43);
            i0.ɵɵlistener("input", function ResultListComponent_Template_input_input_64_listener($event) { return ctx.onSearchInput($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(65, ResultListComponent_Conditional_65_Template, 2, 0, "button", 44);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(66, "div", 45);
            i0.ɵɵelementStart(67, "div", 46)(68, "button", 47);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_68_listener() { return ctx.viewMode.set("grid"); });
            i0.ɵɵelement(69, "i", 48);
            i0.ɵɵtext(70, " L\u01B0\u1EDBi ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(71, "button", 47);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_71_listener() { return ctx.viewMode.set("table"); });
            i0.ɵɵelement(72, "i", 49);
            i0.ɵɵtext(73, " B\u1EA3ng ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(74, "button", 50);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_74_listener() { return ctx.toggleMergeMode(); });
            i0.ɵɵelement(75, "i", 51);
            i0.ɵɵtext(76, " G\u1ED9p m\u1EBB ");
            i0.ɵɵtemplate(77, ResultListComponent_Conditional_77_Template, 2, 1, "span", 52);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(78, "button", 53);
            i0.ɵɵlistener("click", function ResultListComponent_Template_button_click_78_listener() { return ctx.showAdvancedFilters.set(!ctx.showAdvancedFilters()); });
            i0.ɵɵelement(79, "i", 54);
            i0.ɵɵtext(80, " L\u1ECDc n\u00E2ng cao ");
            i0.ɵɵtemplate(81, ResultListComponent_Conditional_81_Template, 2, 1, "span", 55);
            i0.ɵɵelement(82, "i", 56);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(83, ResultListComponent_Conditional_83_Template, 3, 0, "button", 57);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(84, ResultListComponent_Conditional_84_Template, 32, 3, "div", 58);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(85, "div", 59);
            i0.ɵɵtemplate(86, ResultListComponent_Conditional_86_Template, 3, 1, "div", 60)(87, ResultListComponent_Conditional_87_Template, 3, 2);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(88, ResultListComponent_Conditional_88_Template, 15, 2, "div", 61)(89, ResultListComponent_Conditional_89_Template, 3, 0)(90, ResultListComponent_Conditional_90_Template, 3, 0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(12);
            i0.ɵɵclassMap(ctx.filterStatus() === "all" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-150 shadow-sm" : "text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.filteredCount("all") > 0 ? 14 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.filterStatus() === "pending" ? "bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-100/60 dark:border-amber-900/20" : "text-slate-455 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.filteredCount("pending") > 0 ? 17 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.filterStatus() === "draft" ? "bg-indigo-50 dark:bg-indigo-955/20 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100/60 dark:border-indigo-900/20" : "text-slate-455 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.filteredCount("draft") > 0 ? 20 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.filterStatus() === "completed" ? "bg-emerald-50 dark:bg-emerald-955/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100/60 dark:border-emerald-900/20" : "text-slate-455 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.filteredCount("completed") > 0 ? 23 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("ring-2", ctx.filterStatus() === "all" && ctx.selectedSopId() === "all")("ring-blue-500", ctx.filterStatus() === "all" && ctx.selectedSopId() === "all")("border-blue-300", ctx.filterStatus() === "all" && ctx.selectedSopId() === "all");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.allApprovedRuns().length);
            i0.ɵɵadvance(3);
            i0.ɵɵclassProp("ring-2", ctx.filterStatus() === "pending")("ring-amber-500", ctx.filterStatus() === "pending")("border-amber-300", ctx.filterStatus() === "pending");
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("text-amber-500", ctx.pendingCount() > 0)("text-slate-800", ctx.pendingCount() === 0)("dark:text-slate-100", ctx.pendingCount() === 0);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.pendingCount());
            i0.ɵɵadvance(3);
            i0.ɵɵclassProp("ring-2", ctx.filterStatus() === "completed")("ring-emerald-500", ctx.filterStatus() === "completed")("border-emerald-300", ctx.filterStatus() === "completed");
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate1("", ctx.averageCompletion(), "%");
            i0.ɵɵadvance(4);
            i0.ɵɵstyleProp("width", ctx.averageCompletion(), "%");
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.sopDistribution());
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("value", ctx.searchText());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.searchText() ? 65 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵclassMap(ctx.viewMode() === "grid" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm font-extrabold" : "text-slate-450 dark:text-slate-500 hover:text-slate-600");
            i0.ɵɵadvance(3);
            i0.ɵɵclassMap(ctx.viewMode() === "table" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm font-extrabold" : "text-slate-450 dark:text-slate-500 hover:text-slate-600");
            i0.ɵɵadvance(3);
            i0.ɵɵclassMap(ctx.isMergeModeActive() ? "bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200/60 dark:border-fuchsia-800/40" : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300");
            i0.ɵɵadvance();
            i0.ɵɵclassProp("rotate-90", ctx.isMergeModeActive());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.isMergeModeActive() && ctx.selectedRunsCount() > 0 ? 77 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.showAdvancedFilters() ? "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40" : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.activeFiltersCount() > 0 ? 81 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("rotate-180", ctx.showAdvancedFilters());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.hasActiveFilters() ? 83 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showAdvancedFilters() ? 84 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.isLoading() ? 86 : 87);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.selectedRunsCount() >= 2 ? 88 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showMergeModal() ? 89 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showReportHubModal() ? 90 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, RouterModule, i2.RouterLink, SkeletonComponent], encapsulation: 2, changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(ResultListComponent, () => [import("../../shared/components/date-range-filter/date-range-filter.component").then(m => m.DateRangeFilterComponent), import("./components/merge-runs-modal.component").then(m => m.MergeRunsModalComponent), import("./components/report-hub-modal.component").then(m => m.ReportHubModalComponent)], (DateRangeFilterComponent, MergeRunsModalComponent, ReportHubModalComponent) => { i0.ɵsetClassMetadata(ResultListComponent, [{
        type: Component,
        args: [{
                selector: 'app-result-list',
                standalone: true,
                imports: [CommonModule, RouterModule, SkeletonComponent, DateRangeFilterComponent, ReportHubModalComponent, MergeRunsModalComponent],
                template: `
    <div class="h-full flex flex-col fade-in relative bg-slate-50/30 dark:bg-slate-950/10 p-2 md:p-4">

      <!-- ══════════════════════════════════════════════════════
           HEADER: Title + Status Tabs
      ══════════════════════════════════════════════════════ -->
      <div class="shrink-0 pb-0">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm shrink-0">
          <!-- Page Title -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center border border-fuchsia-100 dark:border-fuchsia-800/30 shadow-sm shrink-0">
              <i class="fa-solid fa-square-poll-vertical text-base"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight">Tra Cứu và Quản Lý Kết Quả Mẻ Chạy</h2>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Nhập kết quả, kiểm soát chất lượng (QC) và tạo phiếu kết quả tự động.</p>
            </div>
          </div>

          <!-- Status Filter Tabs -->
          <div class="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl shadow-inner shrink-0 overflow-x-auto max-w-full scrollbar-none self-stretch sm:self-start lg:self-auto">
            <button (click)="setStatusFilter('all')"
                    class="px-4 py-2 text-xs font-black rounded-xl transition duration-150 active:scale-95 flex items-center gap-1.5"
                    [class]="filterStatus() === 'all'
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-150 shadow-sm'
                      : 'text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'">
              Tất cả
              @if(filteredCount('all') > 0) {
                <span class="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-md text-[9px] font-black tabular-nums">{{filteredCount('all')}}</span>
              }
            </button>
            <button (click)="setStatusFilter('pending')"
                    class="px-4 py-2 text-xs font-black rounded-xl transition duration-150 active:scale-95 flex items-center gap-1.5"
                    [class]="filterStatus() === 'pending'
                      ? 'bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-100/60 dark:border-amber-900/20'
                      : 'text-slate-455 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400'">
              Chờ nhập
              @if(filteredCount('pending') > 0) {
                <span class="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md text-[9px] font-black tabular-nums">{{filteredCount('pending')}}</span>
              }
            </button>
            <button (click)="setStatusFilter('draft')"
                    class="px-4 py-2 text-xs font-black rounded-xl transition duration-150 active:scale-95 flex items-center gap-1.5"
                    [class]="filterStatus() === 'draft'
                      ? 'bg-indigo-50 dark:bg-indigo-955/20 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100/60 dark:border-indigo-900/20'
                      : 'text-slate-455 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'">
              Đang nháp
              @if(filteredCount('draft') > 0) {
                <span class="bg-indigo-100 dark:bg-indigo-955/40 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-md text-[9px] font-black tabular-nums">{{filteredCount('draft')}}</span>
              }
            </button>
            <button (click)="setStatusFilter('completed')"
                    class="px-4 py-2 text-xs font-black rounded-xl transition duration-150 active:scale-95 flex items-center gap-1.5"
                    [class]="filterStatus() === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-955/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100/60 dark:border-emerald-900/20'
                      : 'text-slate-455 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'">
              Hoàn thành
              @if(filteredCount('completed') > 0) {
                <span class="bg-emerald-100 dark:bg-emerald-955/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[9px] font-black tabular-nums">{{filteredCount('completed')}}</span>
              }
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════════
             KPI STRIP: 3 số liệu gọn + SOP distribution
        ══════════════════════════════════════════════════════ -->
        <div class="flex flex-wrap items-stretch gap-3 mb-5">
          <!-- KPI: Tổng mẻ hoạt động -->
          <button (click)="showAllRuns()"
               class="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 active:scale-[0.98] min-w-[130px]"
               [class.ring-2]="filterStatus() === 'all' && selectedSopId() === 'all'"
               [class.ring-blue-500]="filterStatus() === 'all' && selectedSopId() === 'all'"
               [class.border-blue-300]="filterStatus() === 'all' && selectedSopId() === 'all'">
            <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
              <i class="fa-solid fa-flask text-sm"></i>
            </div>
            <div class="text-left">
              <div class="text-xl font-black text-slate-800 dark:text-slate-100 leading-none tabular-nums">{{ allApprovedRuns().length }}</div>
              <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 whitespace-nowrap">Mẻ Hoạt Động</div>
            </div>
          </button>

          <!-- KPI: Chờ nhập -->
          <button (click)="setStatusFilter('pending')"
               class="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-200 active:scale-[0.98] min-w-[130px]"
               [class.ring-2]="filterStatus() === 'pending'"
               [class.ring-amber-500]="filterStatus() === 'pending'"
               [class.border-amber-300]="filterStatus() === 'pending'">
            <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-950/50 transition-colors">
              <i class="fa-solid fa-clock-rotate-left text-sm"></i>
            </div>
            <div class="text-left">
              <div class="text-xl font-black leading-none tabular-nums" [class.text-amber-500]="pendingCount() > 0" [class.text-slate-800]="pendingCount() === 0" [class.dark:text-slate-100]="pendingCount() === 0">{{ pendingCount() }}</div>
              <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 whitespace-nowrap">Chờ Nhập</div>
            </div>
          </button>

          <!-- KPI: Hiệu suất -->
          <button (click)="setStatusFilter('completed')"
               class="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all duration-200 active:scale-[0.98] min-w-[160px]"
               [class.ring-2]="filterStatus() === 'completed'"
               [class.ring-emerald-500]="filterStatus() === 'completed'"
               [class.border-emerald-300]="filterStatus() === 'completed'">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/50 transition-colors">
              <i class="fa-solid fa-chart-line text-sm"></i>
            </div>
            <div class="text-left flex-1">
              <div class="flex items-baseline gap-1.5">
                <span class="text-xl font-black text-slate-800 dark:text-slate-100 leading-none tabular-nums">{{ averageCompletion() }}%</span>
                <span class="text-[9px] font-bold text-emerald-500">Hoàn Thành</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" [style.width.%]="averageCompletion()"></div>
              </div>
            </div>
          </button>

          <!-- SOP Distribution chips -->
          <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm min-w-[200px]">
            <div class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Phân bổ Phương Pháp SOP</div>
            <div class="flex items-center gap-1.5 flex-wrap">
              @for (item of sopDistribution(); track item.id) {
                <button class="text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all duration-150 hover:scale-105 active:scale-95 {{ item.textClass }} {{ item.bgClass }}"
                        (click)="toggleSopFilter(item.id)"
                        [class.ring-2]="selectedSopId() === item.id"
                        [class.ring-violet-500]="selectedSopId() === item.id">
                  {{ item.name }}: <span class="font-black">{{ item.count }}</span>
                </button>
              } @empty {
                <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Chưa có mẻ chạy</span>
              }
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════════
             FILTER & SEARCH BAR
        ══════════════════════════════════════════════════════ -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm mb-5 overflow-hidden">
          <!-- Row 1: Search + Actions -->
          <div class="flex items-center gap-2 p-3 border-b border-slate-100 dark:border-slate-800/80">
            <!-- Search -->
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <i class="fa-solid fa-magnifying-glass text-xs"></i>
              </span>
              <input type="text"
                     [value]="searchText()"
                     (input)="onSearchInput($event)"
                     placeholder="Tìm theo Mã mẻ, SOP, Mã số mẫu, Analyst..."
                     class="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/15 focus:border-fuchsia-400 dark:text-slate-200 font-semibold transition placeholder:text-slate-350 dark:placeholder:text-slate-600">
              @if (searchText()) {
                <button (click)="clearSearch()" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
                  <i class="fa-solid fa-circle-xmark text-xs"></i>
                </button>
              }
            </div>

            <!-- Divider -->
            <div class="w-px h-6 bg-slate-200 dark:bg-slate-800 shrink-0"></div>

            <!-- View Mode Toggle -->
            <div class="flex bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl shrink-0">
              <button (click)="viewMode.set('grid')"
                      [class]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm font-extrabold' : 'text-slate-450 dark:text-slate-500 hover:text-slate-600'"
                      class="px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 duration-150">
                <i class="fa-solid fa-table-cells"></i> Lưới
              </button>
              <button (click)="viewMode.set('table')"
                      [class]="viewMode() === 'table' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm font-extrabold' : 'text-slate-450 dark:text-slate-500 hover:text-slate-600'"
                      class="px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 duration-150">
                <i class="fa-solid fa-list"></i> Bảng
              </button>
            </div>

            <!-- Merge Mode Toggle -->
            <button (click)="toggleMergeMode()"
                    [class]="isMergeModeActive() ? 'bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200/60 dark:border-fuchsia-800/40' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'"
                    class="px-3 py-2 border rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95 duration-150 shadow-sm shrink-0 bg-white dark:bg-slate-900">
              <i class="fa-solid fa-code-merge text-[10px]" [class.rotate-90]="isMergeModeActive()"></i>
              Gộp mẻ
              @if (isMergeModeActive() && selectedRunsCount() > 0) {
                <span class="w-4 h-4 bg-fuchsia-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">{{ selectedRunsCount() }}</span>
              }
            </button>

            <!-- Advanced Filters toggle -->
            <button (click)="showAdvancedFilters.set(!showAdvancedFilters())"
                    [class]="showAdvancedFilters() ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'"
                    class="px-3 py-2 border rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95 duration-150 relative shrink-0 bg-white dark:bg-slate-900">
              <i class="fa-solid fa-sliders text-[10px]"></i> Lọc nâng cao
              @if (activeFiltersCount() > 0) {
                <span class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm">{{ activeFiltersCount() }}</span>
              }
              <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-200" [class.rotate-180]="showAdvancedFilters()"></i>
            </button>

            @if (hasActiveFilters()) {
              <button (click)="resetAllFilters()"
                      class="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-black transition flex items-center gap-1 active:scale-95 shrink-0">
                <i class="fa-solid fa-rotate-left text-[10px]"></i> Xóa Lọc
              </button>
            }
          </div>

          <!-- Row 2: Advanced Filter Panel (collapsible) -->
          @if (showAdvancedFilters()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/20 animate-fade-in">
              <!-- SOP Filter -->
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phương pháp (SOP)</label>
                <div class="relative">
                  <span class="absolute left-3 inset-y-0 flex items-center text-slate-400 pointer-events-none">
                    <i class="fa-solid fa-flask text-[10px]"></i>
                  </span>
                  <select [value]="selectedSopId()" (change)="onSopChange($event)"
                          class="w-full appearance-none pl-8 pr-7 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition cursor-pointer">
                    <option value="all">Tất cả phương pháp</option>
                    @for (sop of availableSops(); track sop.id) {
                      <option [value]="sop.id">{{ sop.name }}</option>
                    }
                  </select>
                  <i class="fa-solid fa-chevron-down text-[9px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"></i>
                </div>
              </div>

              <!-- Analyst Filter -->
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Analyst</label>
                <div class="relative">
                  <span class="absolute left-3 inset-y-0 flex items-center text-slate-400 pointer-events-none">
                    <i class="fa-solid fa-user text-[10px]"></i>
                  </span>
                  <select [value]="selectedAnalyst()" (change)="onAnalystChange($event)"
                          class="w-full appearance-none pl-8 pr-7 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition cursor-pointer">
                    <option value="all">Tất cả nhân viên</option>
                    @for (analyst of availableAnalysts(); track analyst) {
                      <option [value]="analyst">{{ analyst }}</option>
                    }
                  </select>
                  <i class="fa-solid fa-chevron-down text-[9px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"></i>
                </div>
              </div>

              <!-- Date Range -->
              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Khoảng thời gian (Ngày duyệt)</label>
                @defer (when showAdvancedFilters()) {
                  <app-date-range-filter
                      [initStart]="startDate()"
                      [initEnd]="endDate()"
                      containerClass="bg-transparent p-0 border-0 shadow-none w-full gap-3"
                      (dateChange)="onDateRangeChange($event)">
                  </app-date-range-filter>
                } @placeholder {
                  <div class="h-9 rounded-xl bg-slate-100/70 dark:bg-slate-900/60"></div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════
           MAIN CONTENT: Cards / Table
      ══════════════════════════════════════════════════════ -->
      <div class="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">

        @if (isLoading()) {
          <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5 animate-pulse">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3">
                <app-skeleton width="80px" height="12px"></app-skeleton>
                <app-skeleton width="200px" height="18px"></app-skeleton>
                <app-skeleton width="140px" height="12px"></app-skeleton>
                <app-skeleton width="100%" height="28px"></app-skeleton>
              </div>
            }
          </div>
        } @else {

          <!-- ─── GRID VIEW ─── -->
          @if (viewMode() === 'grid') {
            <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              @for (run of paginatedRuns(); track run.id) {
                <div class="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-150/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250 flex flex-col overflow-hidden relative cursor-pointer"
                     (click)="enterResults(run.id)"
                     [class.ring-2]="lastSelectedRequestId() === run.id"
                     [class.ring-fuchsia-500]="lastSelectedRequestId() === run.id"
                     [ngClass]="{'ring-1 ring-fuchsia-500/20': run.isVirtualMaster && lastSelectedRequestId() !== run.id}">

                  <!-- SOP Color Ribbon -->
                  <div class="h-1 bg-gradient-to-r {{ getSopGradientClass(run.sopId) }} shrink-0"></div>

                  <!-- Card Body -->
                  <div class="flex flex-col flex-1 p-5">
                    <!-- Top Row: Status + Date + Merge checkbox -->
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        @if (isMergeModeActive()) {
                          <label class="inline-flex items-center cursor-pointer" (click)="$event.stopPropagation()">
                            <input type="checkbox"
                                   [checked]="selectedRunsMap()[run.id]"
                                   (change)="toggleRunSelection(run)"
                                   class="w-4 h-4 text-fuchsia-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded focus:ring-fuchsia-500">
                          </label>
                        }
                        <span [class]="getStatusClass(run.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border">
                          <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                            'bg-emerald-500': runStatusMap()[run.id] === 'completed',
                            'bg-indigo-500': runStatusMap()[run.id] === 'draft',
                            'bg-amber-500': runStatusMap()[run.id] === 'pending' || !runStatusMap()[run.id]
                          }"></span>
                          {{ getStatusText(run.id) }}
                        </span>
                        @if (run.isVirtualMaster) {
                          <span class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-100 dark:border-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black uppercase">Mẻ tổng hợp</span>
                        }
                        @if (run.parentMasterId) {
                          <a [routerLink]="['/results', run.parentMasterId]" (click)="$event.stopPropagation()" class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-200 dark:border-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black uppercase hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition-colors flex items-center gap-0.5" title="Mẻ này đã được gộp vào Master {{run.parentMasterId}}">
                            <i class="fa-solid fa-link text-[7px]"></i> Đã gộp
                          </a>
                        }
                        @if (isRunLocked(run)) {
                          <span class="px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-655 dark:text-red-400 text-[8px] font-black uppercase flex items-center gap-1 shadow-xs" title="Đang được mở chỉnh sửa bởi {{ run.lockedByName || run.lockedBy }}">
                            <i class="fa-solid fa-lock text-[7px]"></i> Đang sửa bởi {{ run.lockedByName || 'KTV khác' }}
                          </span>
                        }
                      </div>
                      <span class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
                        <i class="fa-regular fa-calendar text-[9px]"></i>
                        {{ getRunDate(run) ? formatAnalysisDate(getRunDate(run)) : '—' }}
                      </span>
                    </div>

                    <!-- SOP Name -->
                    <h3 class="font-black text-slate-800 dark:text-slate-100 text-[15px] leading-snug mb-1 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                      {{ run.sopName }}
                    </h3>

                    @if (run.isVirtualMaster && run.childRequestIds) {
                      <div class="text-[9px] text-fuchsia-500 dark:text-fuchsia-400 font-bold mb-2 flex items-center gap-1 bg-fuchsia-50/40 dark:bg-fuchsia-950/10 px-2 py-1 rounded-lg border border-fuchsia-100/30 dark:border-fuchsia-900/20 select-none w-fit">
                        <i class="fa-solid fa-link text-[8px]"></i> Gộp từ: {{ run.childRequestIds.join(', ') }}
                      </div>
                    }

                    <!-- Analyst -->
                    <div class="flex items-center gap-2 mb-3">
                      <div [class]="getAnalystAvatarClass(run.user)" class="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-black uppercase shadow-sm shrink-0">
                        {{ getAnalystInitials(run.user) }}
                      </div>
                      <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{{ run.user || 'Unknown' }}</span>
                    </div>

                    <!-- Sample Codes -->
                    @if (run.sampleList && run.sampleList.length > 0) {
                      <div class="text-[10px] text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-xl p-2.5 flex items-start gap-1.5 max-h-16 overflow-y-auto custom-scrollbar mb-3 flex-1">
                        <i class="fa-solid fa-vials text-slate-350 dark:text-slate-600 mt-0.5 shrink-0 text-[9px]"></i>
                        <span class="break-all font-mono font-semibold leading-relaxed">{{ formatSampleList(run.sampleList) }}</span>
                      </div>
                    } @else {
                      <div class="flex-1"></div>
                    }
                  </div>

                  <!-- Card Footer: Action Buttons -->
                  <div class="border-t border-slate-100 dark:border-slate-800/80 px-4 py-3 flex items-center gap-2.5 bg-slate-50/30 dark:bg-slate-950/10 shrink-0">
                    @if (run.analysisResultSummary?.reports || run.analysisResultSummary?.pdfUrl || run.analysisResultSummary?.pdfViewUrl || run.analysisResult?.reports || run.analysisResult?.pdfUrl) {
                      <button (click)="openReportHub(run); $event.stopPropagation()"
                              class="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/40 rounded-xl text-xs font-black transition active:scale-95 shadow-sm">
                        <i class="fa-solid fa-file-pdf text-red-500 text-[11px]"></i>
                        <span>Báo Cáo PDF</span>
                      </button>
                    }
                    <button (click)="enterResults(run.id, undefined, false); $event.stopPropagation()"
                            class="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:border-fuchsia-200 dark:hover:border-fuchsia-900/40 rounded-xl text-xs font-black transition active:scale-95 duration-150 shadow-sm">
                      <i class="fa-solid text-[11px] fa-eye"></i>
                      Chi Tiết Mẻ Chạy
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div class="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                    <i class="fa-solid fa-square-poll-vertical text-2xl"></i>
                  </div>
                  <p class="text-slate-400 dark:text-slate-500 font-semibold text-sm">Không tìm thấy mẻ nào phù hợp.</p>
                  @if (hasActiveFilters()) {
                    <button (click)="resetAllFilters()" class="mt-3 text-xs text-fuchsia-600 dark:text-fuchsia-400 font-black hover:underline">Xóa Bộ Lọc</button>
                  }
                </div>
              }
            </div>

          <!-- ─── TABLE VIEW ─── -->
          } @else if (viewMode() === 'table') {
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                      @if (isMergeModeActive()) {
                        <th class="p-4 w-10 text-center"><i class="fa-solid fa-check-double"></i></th>
                      }
                      <th class="p-4">Phương pháp / Mã mẻ</th>
                      <th class="p-4">Phân tích viên</th>
                      <th class="p-4">Ngày chạy</th>
                      <th class="p-4">Mẫu kiểm nghiệm</th>
                      <th class="p-4 text-center">Trạng thái</th>
                      <th class="p-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                    @for (run of paginatedRuns(); track run.id) {
                      <tr [ngClass]="{'bg-fuchsia-50/20 dark:bg-fuchsia-950/10 border-l-2 border-l-fuchsia-500': lastSelectedRequestId() === run.id}"
                          class="hover:bg-slate-50/60 dark:hover:bg-slate-950/20 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
                          (click)="enterResults(run.id)">

                        @if (isMergeModeActive()) {
                          <td class="p-4 text-center">
                            <label class="inline-flex items-center cursor-pointer" (click)="$event.stopPropagation()">
                              <input type="checkbox"
                                     [checked]="selectedRunsMap()[run.id]"
                                     (change)="toggleRunSelection(run)"
                                     class="w-4 h-4 text-fuchsia-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded focus:ring-fuchsia-500">
                            </label>
                          </td>
                        }

                        <td class="p-4">
                          <div class="flex items-center gap-2 mb-0.5">
                            <span class="w-2 h-2 rounded-full bg-gradient-to-r {{ getSopGradientClass(run.sopId) }} shrink-0"></span>
                            <span class="font-extrabold text-slate-800 dark:text-slate-150 text-xs">{{ run.sopName }}</span>
                            @if (run.isVirtualMaster) {
                              <span class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-100 dark:border-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black uppercase">Mẻ tổng hợp</span>
                            }
                            @if (isRunLocked(run)) {
                              <span class="px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-655 dark:text-red-400 text-[8px] font-black uppercase flex items-center gap-1 shadow-xs" title="Đang được mở chỉnh sửa bởi {{ run.lockedByName || run.lockedBy }}">
                                <i class="fa-solid fa-lock text-[7px]"></i> Đang sửa bởi {{ run.lockedByName || 'KTV khác' }}
                              </span>
                            }
                          </div>
                          <div class="text-[10px] text-slate-400 font-mono font-semibold ml-4">{{ run.inputs?.['batchCode'] || run.id }}</div>
                          @if (run.isVirtualMaster && run.childRequestIds) {
                            <div class="text-[9px] text-fuchsia-500 font-bold flex items-center gap-0.5 ml-4 mt-0.5">
                              <i class="fa-solid fa-link text-[7px]"></i> Gộp từ: {{ run.childRequestIds.join(', ') }}
                            </div>
                          }
                        </td>

                        <td class="p-4">
                          <div class="flex items-center gap-2">
                            <div [class]="getAnalystAvatarClass(run.user)" class="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-black uppercase shadow-sm shrink-0">
                              {{ getAnalystInitials(run.user) }}
                            </div>
                            <span class="text-xs font-semibold truncate max-w-[100px]">{{ run.user || 'Unknown' }}</span>
                          </div>
                        </td>

                        <td class="p-4 text-[11px] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                          <i class="fa-regular fa-calendar mr-1 text-[9px]"></i>
                          {{ getRunDate(run) ? formatAnalysisDate(getRunDate(run)) : '—' }}
                        </td>

                        <td class="p-4 max-w-[180px]">
                          <div class="text-[10px] font-semibold text-slate-500">
                            <span class="font-extrabold text-slate-700 dark:text-slate-300">{{ run.sampleList?.length || 0 }}</span> mẫu
                          </div>
                          <div class="truncate text-[9px] font-mono text-slate-400 dark:text-slate-600" [title]="run.sampleList ? formatSampleList(run.sampleList) : ''">
                            {{ run.sampleList ? formatSampleList(run.sampleList) : 'Trống' }}
                          </div>
                        </td>

                        <td class="p-4 text-center">
                          <span [class]="getStatusClass(run.id)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide border">
                            <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                              'bg-emerald-500': runStatusMap()[run.id] === 'completed',
                              'bg-indigo-500': runStatusMap()[run.id] === 'draft',
                              'bg-amber-500': runStatusMap()[run.id] === 'pending' || !runStatusMap()[run.id]
                            }"></span>
                            {{ getStatusText(run.id) }}
                          </span>
                        </td>

                        <td class="p-4">
                          <div class="flex items-center justify-end gap-2">
                            @if (run.analysisResultSummary?.reports || run.analysisResultSummary?.pdfUrl || run.analysisResultSummary?.pdfViewUrl || run.analysisResult?.reports || run.analysisResult?.pdfUrl) {
                              <button (click)="openReportHub(run); $event.stopPropagation()"
                                      class="flex items-center gap-1.5 px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-955/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 rounded-xl text-xs font-black transition active:scale-95">
                                <i class="fa-solid fa-file-pdf text-red-500 text-[11px]"></i>
                                <span>Báo Cáo PDF</span>
                              </button>
                            }
                            <button (click)="enterResults(run.id, undefined, false); $event.stopPropagation()"
                                    class="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:border-fuchsia-200 dark:hover:border-fuchsia-900/40 rounded-xl text-xs font-black transition active:scale-95 shadow-sm whitespace-nowrap">
                              <i class="fa-solid fa-eye text-[10px]"></i>
                              Chi Tiết
                            </button>
                          </div>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td [attr.colspan]="isMergeModeActive() ? 7 : 6" class="text-center py-16 text-slate-400 dark:text-slate-500 font-semibold text-sm">
                          <i class="fa-solid fa-inbox text-2xl mb-2 block opacity-40"></i>
                          Không tìm thấy mẻ nào phù hợp.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          @if (displayedRuns().length > pageSize) {
            <div class="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm">
              <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Hiển thị <span class="font-black text-slate-800 dark:text-slate-100">{{ pageStartIndex() }}</span>
                -
                <span class="font-black text-slate-800 dark:text-slate-100">{{ pageEndIndex() }}</span>
                / {{ displayedRuns().length }} mẻ
              </div>
              <div class="flex items-center gap-1.5">
                <button (click)="previousPage()"
                        [disabled]="activePage() === 1"
                        class="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-fuchsia-300 dark:hover:border-fuchsia-800 transition">
                  <i class="fa-solid fa-chevron-left text-[10px]"></i>
                </button>
                @for (page of visiblePageNumbers(); track page) {
                  <button (click)="setPage(page)"
                          class="min-w-8 h-8 px-2 rounded-xl border text-[11px] font-black transition"
                          [class]="activePage() === page
                            ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-fuchsia-300 dark:hover:border-fuchsia-800'">
                    {{ page }}
                  </button>
                }
                <button (click)="nextPage()"
                        [disabled]="activePage() === totalPages()"
                        class="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-fuchsia-300 dark:hover:border-fuchsia-800 transition">
                  <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          }
        }

      </div><!-- end scrollable area -->

      <!-- ══════════════════════════════════════════════════════
           FLOATING MERGE ACTION BAR
      ══════════════════════════════════════════════════════ -->
      @if (selectedRunsCount() >= 2) {
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-slate-950/98 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-5 border border-slate-700/60 backdrop-blur-md animate-fade-in z-50">
          <div class="flex flex-col">
            <span class="text-xs font-black text-slate-100">Đã chọn <span class="text-fuchsia-400">{{ selectedRunsCount() }}</span> mẻ để gộp</span>
            <span class="text-[9px] font-bold text-slate-400 mt-0.5">{{ getSelectedSopName() }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button (click)="cancelSelection()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black transition active:scale-95">Hủy</button>
            <button (click)="openMergeModal()" class="px-4 py-1.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-xl text-xs font-black transition active:scale-95 shadow-md shadow-fuchsia-500/20 flex items-center gap-1.5">
              <i class="fa-solid fa-code-merge rotate-90 text-[10px]"></i> Gộp Mẻ Chạy
            </button>
          </div>
        </div>
      }

      <!-- ══════════════════════════════════════════════════════
           MERGE MODAL
      ══════════════════════════════════════════════════════ -->
      @if (showMergeModal()) {
        @defer {
          <app-merge-runs-modal
            [isOpen]="showMergeModal()"
            [selectedRuns]="getSelectedRuns()"
            [masterCurveRunId]="masterCurveRunId()"
            [unifiedDateString]="unifiedDateString()"
            [customMasterId]="customMasterId()"
            (close)="closeMergeModal()"
            (masterCurveRunIdChange)="masterCurveRunId.set($event)"
            (unifiedDateStringChange)="unifiedDateString.set($event)"
            (customMasterIdChange)="customMasterId.set($event)"
            (merge)="executeMerge()">
          </app-merge-runs-modal>
        }
      }

      <!-- ══════════════════════════════════════════════════════
           REPORT HUB MODAL
      ══════════════════════════════════════════════════════ -->
      @if (showReportHubModal()) {
        @defer {
          <app-report-hub-modal
            [isOpen]="showReportHubModal()"
            [run]="selectedRequestForReport()"
            [historyList]="selectedRequestHistoryList()"
            [isLoadingHistory]="isLoadingHistory()"
            [runStatus]="selectedRequestForReport() ? runStatusMap()[selectedRequestForReport().id] : ''"
            (close)="closeReportHub()"
            (createReport)="enterResults($event.requestId, $event.prefix, true); closeReportHub()"
            (previewPdf)="openPdfPreview($event.pdfUrl, $event.docsUrl, $event.prefix, $event.version, $event.publishedBy, $event.publishedAt); closeReportHub()">
          </app-report-hub-modal>
        }
      }
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            }]
    }], null, null); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResultListComponent, { className: "ResultListComponent", filePath: "src/app/features/results/result-list.component.ts", lineNumber: 632 }); })();
//# sourceMappingURL=result-list.component.js.map