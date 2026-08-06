import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { cleanName, formatNum, formatDate, formatSampleList } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import { timestampToDate, timestampToLocalDateKey } from '../../shared/utils/timestamp';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const RequestListComponent_Conditional_24_Defer_2_DepsFn = () => [import("./print-queue.component").then(m => m.PrintQueueComponent)];
const _c0 = () => [1, 2, 3];
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.name;
function RequestListComponent_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.state.requests().length);
} }
function RequestListComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.state.printableLogs().length);
} }
function RequestListComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14)(1, "app-date-range-filter", 18);
    i0.ɵɵlistener("dateChange", function RequestListComponent_Conditional_22_Template_app_date_range_filter_dateChange_1_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onDateRangeChange($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("initStart", ctx_r0.startDate())("initEnd", ctx_r0.endDate());
} }
function RequestListComponent_Conditional_24_Defer_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-print-queue", 19);
} }
function RequestListComponent_Conditional_24_DeferPlaceholder_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵtext(1, " \u0110ang t\u1EA3i h\u00E0ng \u0111\u1EE3i in... ");
    i0.ɵɵelementEnd();
} }
function RequestListComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestListComponent_Conditional_24_Defer_0_Template, 1, 0)(1, RequestListComponent_Conditional_24_DeferPlaceholder_1_Template, 2, 0);
    i0.ɵɵdefer(2, 0, RequestListComponent_Conditional_24_Defer_2_DepsFn, null, 1);
    i0.ɵɵdeferOnIdle();
} }
function RequestListComponent_Conditional_25_Conditional_2_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 22)(1, "div", 23);
    i0.ɵɵelement(2, "app-skeleton", 24)(3, "app-skeleton", 25)(4, "app-skeleton", 26);
    i0.ɵɵelementEnd()();
} }
function RequestListComponent_Conditional_25_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, RequestListComponent_Conditional_25_Conditional_2_For_1_Template, 5, 0, "div", 22, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 29)(1, "div", 50);
    i0.ɵɵelement(2, "i", 51);
    i0.ɵɵelementStart(3, "span", 52);
    i0.ɵɵtext(4, "\u0110ang x\u1EED l\u00FD...");
    i0.ɵɵelementEnd()()();
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 32);
    i0.ɵɵtext(1, "Ch\u1EDD duy\u1EC7t");
    i0.ɵɵelementEnd();
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 33);
    i0.ɵɵtext(1, "\u0110\u00E3 duy\u1EC7t");
    i0.ɵɵelementEnd();
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 34);
    i0.ɵɵelement(1, "i", 53);
    i0.ɵɵtext(2, " M\u1EBA MASTER \u1EA2O ");
    i0.ɵɵelementEnd();
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 35);
    i0.ɵɵelement(1, "i", 54);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Ng\u00E0y ki\u1EC3m nghi\u1EC7m ");
    i0.ɵɵelementStart(4, "span", 55);
    i0.ɵɵtext(5, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "input", 56);
    i0.ɵɵlistener("ngModelChange", function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_7_Template_input_ngModelChange_6_listener($event) { i0.ɵɵrestoreView(_r3); const req_r4 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.setPendingAnalysisDate(req_r4.id, $event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const req_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(6);
    i0.ɵɵclassProp("border-red-400", !ctx_r0.getPendingAnalysisDate(req_r4));
    i0.ɵɵproperty("ngModel", ctx_r0.getPendingAnalysisDate(req_r4));
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 36);
    i0.ɵɵelement(1, "i", 57);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const req_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getAnalysisDate(req_r4), " ");
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 42);
    i0.ɵɵelement(1, "i", 58);
    i0.ɵɵelementStart(2, "span", 59);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const req_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.formatSampleList(req_r4.sampleList));
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_For_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 60);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 61);
    i0.ɵɵtext(4);
    i0.ɵɵelementStart(5, "span", 62);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.getItemName(item_r5));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatNum(item_r5.displayAmount), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r5.unit);
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 63);
    i0.ɵɵlistener("click", function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const req_r4 = i0.ɵɵnextContext(2).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.approve(req_r4)); });
    i0.ɵɵelement(1, "i", 64);
    i0.ɵɵtext(2, " Duy\u1EC7t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 65);
    i0.ɵɵlistener("click", function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Conditional_1_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r6); const req_r4 = i0.ɵɵnextContext(2).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.reject(req_r4)); });
    i0.ɵɵelement(4, "i", 66);
    i0.ɵɵtext(5, " T\u1EEB Ch\u1ED1i ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const req_r4 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", !!ctx_r0.processingId() || !ctx_r0.getPendingAnalysisDate(req_r4));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", !!ctx_r0.processingId());
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 67);
    i0.ɵɵlistener("click", function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Conditional_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const req_r4 = i0.ɵɵnextContext(2).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.goToResults(req_r4)); });
    i0.ɵɵelement(1, "i", 68);
    i0.ɵɵtext(2, " Nh\u1EADp K\u1EBFt Qu\u1EA3 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 69);
    i0.ɵɵlistener("click", function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Conditional_2_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r7); const req_r4 = i0.ɵɵnextContext(2).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.editApproved(req_r4)); });
    i0.ɵɵelement(4, "i", 70);
    i0.ɵɵtext(5, " Ch\u1EC9nh S\u1EEDa ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 71);
    i0.ɵɵlistener("click", function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Conditional_2_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r7); const req_r4 = i0.ɵɵnextContext(2).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.revoke(req_r4)); });
    i0.ɵɵelement(7, "i", 72);
    i0.ɵɵtext(8, " Ho\u00E0n T\u00E1c ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(5);
    i0.ɵɵproperty("disabled", !!ctx_r0.processingId());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", !!ctx_r0.processingId());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", !!ctx_r0.processingId());
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 49);
    i0.ɵɵtemplate(1, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Conditional_1_Template, 6, 2)(2, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Conditional_2_Template, 9, 3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.currentTab() === "pending" ? 1 : 2);
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_29_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 73);
    i0.ɵɵelement(1, "i", 75);
    i0.ɵɵelementStart(2, "span", 76);
    i0.ɵɵtext(3, "\u0110ang ch\u1EDD");
    i0.ɵɵelement(4, "br");
    i0.ɵɵtext(5, "qu\u1EA3n l\u00FD duy\u1EC7t");
    i0.ɵɵelementEnd()();
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_29_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 74);
    i0.ɵɵelement(1, "i", 77);
    i0.ɵɵelementStart(2, "span", 76);
    i0.ɵɵtext(3, "Ho\u00E0n th\u00E0nh");
    i0.ɵɵelementEnd()();
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_29_Conditional_0_Template, 6, 0, "div", 73)(1, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_29_Conditional_1_Template, 4, 0, "div", 74);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵconditional(ctx_r0.currentTab() === "pending" ? 0 : 1);
} }
function RequestListComponent_Conditional_25_Conditional_3_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 27);
    i0.ɵɵtemplate(1, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_1_Template, 5, 0, "div", 29);
    i0.ɵɵelementStart(2, "div", 30)(3, "div", 31);
    i0.ɵɵtemplate(4, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_4_Template, 2, 0, "span", 32)(5, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_5_Template, 2, 0, "span", 33)(6, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_6_Template, 3, 0, "span", 34)(7, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_7_Template, 7, 3, "label", 35)(8, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_8_Template, 3, 1, "span", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "h3", 37);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 38)(12, "div", 39);
    i0.ɵɵelement(13, "i", 40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "span", 41);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(16, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_16_Template, 4, 1, "div", 42);
    i0.ɵɵelementStart(17, "div", 43)(18, "table", 44)(19, "thead")(20, "tr", 45)(21, "th", 46);
    i0.ɵɵtext(22, "H\u00F3a ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "th", 47);
    i0.ɵɵtext(24, "L\u01B0\u1EE3ng d\u00F9ng");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(25, "tbody", 48);
    i0.ɵɵrepeaterCreate(26, RequestListComponent_Conditional_25_Conditional_3_For_1_For_27_Template, 7, 3, "tr", null, _forTrack1);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(28, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_28_Template, 3, 1, "div", 49)(29, RequestListComponent_Conditional_25_Conditional_3_For_1_Conditional_29_Template, 2, 1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const req_r4 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.processingId() === req_r4.id ? 1 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(req_r4.status === "pending" ? 4 : 5);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(req_r4.isVirtualMaster ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r4.status === "pending" && ctx_r0.state.isAdmin() ? 7 : 8);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(req_r4.sopName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(req_r4.user || "Unknown");
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r4.sampleList && req_r4.sampleList.length > 0 ? 16 : -1);
    i0.ɵɵadvance(10);
    i0.ɵɵrepeater(req_r4.items);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.state.isAdmin() ? 28 : 29);
} }
function RequestListComponent_Conditional_25_Conditional_3_ForEmpty_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28)(1, "div", 78);
    i0.ɵɵelement(2, "i", 79);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 80);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.currentTab() === "pending" ? "Kh\u00F4ng c\u00F3 y\u00EAu c\u1EA7u n\u00E0o \u0111ang ch\u1EDD." : "Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u l\u1ECBch s\u1EED trong kho\u1EA3ng th\u1EDDi gian n\u00E0y.", " ");
} }
function RequestListComponent_Conditional_25_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, RequestListComponent_Conditional_25_Conditional_3_For_1_Template, 30, 8, "div", 27, _forTrack0, false, RequestListComponent_Conditional_25_Conditional_3_ForEmpty_2_Template, 5, 1, "div", 28);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r0.displayRequests());
} }
function RequestListComponent_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16)(1, "div", 21);
    i0.ɵɵtemplate(2, RequestListComponent_Conditional_25_Conditional_2_Template, 2, 1)(3, RequestListComponent_Conditional_25_Conditional_3_Template, 3, 1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.isLoading() ? 2 : 3);
} }
function RequestListComponent_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17)(1, "div", 81);
    i0.ɵɵlistener("click", function RequestListComponent_Conditional_26_Template_div_click_1_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.closeRevokeModal()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 82);
    i0.ɵɵelement(3, "div", 83);
    i0.ɵɵelementStart(4, "div", 84)(5, "div", 85)(6, "div", 86);
    i0.ɵɵelement(7, "i", 87);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div")(9, "h3", 88);
    i0.ɵɵtext(10, "X\u00E1c Nh\u1EADn Ho\u00E0n T\u00E1c & H\u1EE7y Duy\u1EC7t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p", 89);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "p", 90);
    i0.ɵɵtext(14, " H\u1EC7 th\u1ED1ng s\u1EBD ho\u00E0n tr\u1EA3 l\u01B0\u1EE3ng h\u00F3a ch\u1EA5t s\u1EED d\u1EE5ng tr\u1EDF l\u1EA1i kho. B\u1EA1n mu\u1ED1n x\u1EED l\u00FD y\u00EAu c\u1EA7u n\u00E0y th\u1EBF n\u00E0o ti\u1EBFp theo? ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div", 91)(16, "button", 92);
    i0.ɵɵlistener("click", function RequestListComponent_Conditional_26_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.confirmRevoke("pending")); });
    i0.ɵɵelementStart(17, "div", 93);
    i0.ɵɵelement(18, "i", 94);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 30)(20, "div", 95);
    i0.ɵɵtext(21, "\u0110\u01B0a v\u1EC1 Ch\u1EDD Duy\u1EC7t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "div", 89);
    i0.ɵɵtext(23, "Tr\u1EA3 l\u1EA1i kho v\u00E0 chuy\u1EC3n phi\u1EBFu v\u1EC1 tr\u1EA1ng th\u00E1i ch\u1EDD ph\u00EA duy\u1EC7t \u0111\u1EC3 c\u00F3 th\u1EC3 s\u1EEDa \u0111\u1ED5i ho\u1EB7c duy\u1EC7t l\u1EA1i.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "button", 96);
    i0.ɵɵlistener("click", function RequestListComponent_Conditional_26_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.confirmRevoke("rejected")); });
    i0.ɵɵelementStart(25, "div", 97);
    i0.ɵɵelement(26, "i", 98);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "div", 30)(28, "div", 99);
    i0.ɵɵtext(29, "T\u1EEB Ch\u1ED1i Ho\u00E0n To\u00E0n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "div", 89);
    i0.ɵɵtext(31, "Tr\u1EA3 l\u1EA1i kho v\u00E0 h\u1EE7y b\u1ECF ho\u00E0n to\u00E0n y\u00EAu c\u1EA7u n\u00E0y (kh\u00F4ng th\u1EC3 ph\u00EA duy\u1EC7t l\u1EA1i).");
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(32, "div", 100)(33, "button", 101);
    i0.ɵɵlistener("click", function RequestListComponent_Conditional_26_Template_button_click_33_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.closeRevokeModal()); });
    i0.ɵɵtext(34, " H\u1EE7y Thao T\u00E1c ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    i0.ɵɵadvance(12);
    i0.ɵɵtextInterpolate1("SOP: ", ctx.sopName, "");
} }
export class RequestListComponent {
    constructor() {
        this.state = inject(StateService);
        this.auth = inject(AuthService);
        this.router = inject(Router);
        this.cleanName = cleanName;
        this.formatNum = formatNum;
        this.formatDate = formatDate;
        this.formatSampleList = formatSampleList;
        this.currentTab = signal('pending');
        this.processingId = signal(null);
        this.pendingAnalysisDates = signal({});
        this.isLoading = signal(true);
        this.showRevokeModal = signal(false);
        this.selectedRevokeRequest = signal(null);
        // Date Filters for History
        this.startDate = signal(this.getFirstDayOfMonth());
        this.endDate = signal(this.getToday());
        this.filteredHistory = computed(() => {
            const all = this.state.approvedRequests();
            const user = this.auth.currentUser();
            const start = new Date(this.startDate());
            start.setHours(0, 0, 0, 0);
            const end = new Date(this.endDate());
            end.setHours(23, 59, 59, 999);
            return all.filter(req => {
                // Date Filter
                let d;
                // Priority: Analysis Date (if exists) -> Approved At -> Timestamp
                if (req.analysisDate) {
                    const parts = req.analysisDate.split('-');
                    d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                }
                else {
                    d = timestampToDate(req.approvedAt ?? req.timestamp);
                }
                if (!d)
                    return false;
                if (d < start || d > end)
                    return false;
                // User Filter
                if (user?.role === 'manager')
                    return true;
                return req.user === user?.displayName;
            });
        });
        this.displayRequests = computed(() => this.currentTab() === 'pending' ? this.state.requests() : this.filteredHistory());
    }
    ngOnInit() {
        this.ensureDataForCurrentTab();
        // Check data loaded
        if (this.state.requests().length > 0) {
            this.isLoading.set(false);
        }
        else {
            setTimeout(() => this.isLoading.set(false), 800);
        }
    }
    getToday() { return timestampToLocalDateKey(new Date()) || ''; }
    getFirstDayOfMonth() {
        const d = new Date();
        return timestampToLocalDateKey(new Date(d.getFullYear(), d.getMonth(), 1)) || '';
    }
    onDateRangeChange(range) {
        this.startDate.set(range.start);
        this.endDate.set(range.end);
    }
    getItemName(item) {
        if (item.displayName)
            return item.displayName;
        return item.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    getAnalysisDate(req) {
        if (req.analysisDate) {
            const [year, month, day] = req.analysisDate.split('-');
            return `${day}/${month}/${year}`;
        }
        return 'Chưa thiết lập ngày kiểm nghiệm';
    }
    getPendingAnalysisDate(req) {
        return this.pendingAnalysisDates()[req.id] ?? req.analysisDate ?? '';
    }
    setPendingAnalysisDate(requestId, analysisDate) {
        this.pendingAnalysisDates.update(current => ({ ...current, [requestId]: analysisDate }));
    }
    async approve(req) {
        if (this.processingId())
            return;
        const analysisDate = this.getPendingAnalysisDate(req);
        this.processingId.set(req.id);
        try {
            await this.state.approveRequest({ ...req, analysisDate });
        }
        finally {
            this.processingId.set(null);
        }
    }
    setCurrentTab(tab) {
        this.currentTab.set(tab);
        this.ensureDataForCurrentTab();
    }
    ensureDataForCurrentTab() {
        if (this.currentTab() === 'approved') {
            this.state.ensureApprovedRequestsListener();
        }
        else if (this.currentTab() === 'printing') {
            this.state.ensureLogsListener();
        }
    }
    async reject(req) {
        if (this.processingId())
            return;
        this.processingId.set(req.id);
        try {
            await this.state.rejectRequest(req);
        }
        finally {
            this.processingId.set(null);
        }
    }
    async revoke(req) {
        if (this.processingId())
            return;
        this.selectedRevokeRequest.set(req);
        this.showRevokeModal.set(true);
    }
    async confirmRevoke(targetStatus) {
        const req = this.selectedRevokeRequest();
        if (!req || this.processingId())
            return;
        this.showRevokeModal.set(false);
        this.processingId.set(req.id);
        try {
            await this.state.revokeApproval(req, targetStatus);
        }
        finally {
            this.processingId.set(null);
            this.selectedRevokeRequest.set(null);
        }
    }
    closeRevokeModal() {
        this.showRevokeModal.set(false);
        this.selectedRevokeRequest.set(null);
    }
    editApproved(req) {
        this.router.navigate(['/calculator'], { queryParams: { editRequestId: req.id } });
    }
    goToResults(req) {
        this.router.navigate(['/results', req.id]);
    }
    static { this.ɵfac = function RequestListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RequestListComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RequestListComponent, selectors: [["app-request-list"]], decls: 27, vars: 11, consts: [[1, "h-full", "flex", "flex-col", "fade-in", "relative"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-4", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "border", "border-blue-100", "dark:border-blue-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-list-check", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "items-center", "bg-slate-100", "dark:bg-slate-800", "p-1.5", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "overflow-x-auto", "max-w-full", "scrollbar-none", "shrink-0", "self-stretch", "sm:self-start"], [1, "px-4", "py-2", "text-xs", "font-bold", "rounded-lg", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-clock"], [1, "bg-orange-100", "dark:bg-orange-900/30", "text-orange-700", "dark:text-orange-400", "px-1.5", "rounded-md", "text-[10px]"], [1, "fa-solid", "fa-check-double"], [1, "fa-solid", "fa-print"], [1, "bg-purple-100", "dark:bg-purple-900/30", "text-purple-700", "dark:text-purple-400", "px-1.5", "rounded-md", "text-[10px]"], [1, "mb-4", "flex", "justify-end"], [1, "flex-1", "min-h-0", "relative"], [1, "h-full", "overflow-y-auto", "custom-scrollbar", "pb-20", "pr-2"], [1, "fixed", "inset-0", "z-[1000]", "flex", "items-center", "justify-center", "p-4"], [3, "dateChange", "initStart", "initEnd"], [1, "h-full", "block"], [1, "h-full", "rounded-2xl", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-center", "text-slate-400", "text-sm", "font-bold"], [1, "grid", "gap-4", "w-full"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "p-5", "flex", "gap-4"], [1, "flex-1", "space-y-2"], ["width", "120px", "height", "16px"], ["width", "250px", "height", "24px"], ["width", "150px", "height", "14px"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "p-5", "flex", "flex-col", "md:flex-row", "md:items-start", "justify-between", "gap-4", "transition", "hover:shadow-md", "dark:hover:shadow-none", "relative", "overflow-hidden", "group"], [1, "text-center", "py-20", "bg-white", "dark:bg-slate-800", "rounded-3xl", "border", "border-slate-200", "dark:border-slate-700", "border-dashed"], [1, "absolute", "inset-0", "bg-white/80", "dark:bg-slate-900/80", "z-20", "flex", "items-center", "justify-center", "backdrop-blur-sm"], [1, "flex-1"], [1, "flex", "flex-wrap", "items-center", "gap-3", "mb-2"], [1, "px-2.5", "py-1", "rounded-lg", "bg-orange-50", "dark:bg-orange-900/20", "text-orange-600", "dark:text-orange-400", "text-[10px]", "font-black", "uppercase", "tracking-wider", "border", "border-orange-100", "dark:border-orange-800/50"], [1, "px-2.5", "py-1", "rounded-lg", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-600", "dark:text-emerald-400", "text-[10px]", "font-black", "uppercase", "tracking-wider", "border", "border-emerald-100", "dark:border-emerald-800/50"], [1, "px-2.5", "py-1", "rounded-lg", "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "text-fuchsia-600", "dark:text-fuchsia-400", "text-[10px]", "font-black", "uppercase", "tracking-wider", "border", "border-fuchsia-100", "dark:border-fuchsia-800/50", "flex", "items-center", "gap-1.5", "shadow-sm"], [1, "flex", "items-center", "gap-2", "text-xs", "text-slate-500", "dark:text-slate-400", "font-bold"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "font-medium", "flex", "items-center", "gap-1"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-lg", "mb-1", "group-hover:text-blue-600", "dark:group-hover:text-blue-400", "transition-colors"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mb-4", "flex", "items-center", "gap-2"], [1, "w-5", "h-5", "rounded-full", "bg-slate-100", "dark:bg-slate-700", "flex", "items-center", "justify-center", "text-slate-400", "dark:text-slate-500"], [1, "fa-solid", "fa-user", "text-[10px]"], [1, "font-bold", "text-slate-600", "dark:text-slate-300"], [1, "mb-3", "text-xs", "text-slate-500", "dark:text-slate-400", "bg-slate-50", "dark:bg-slate-800/50", "p-2", "rounded-lg", "border", "border-slate-100", "dark:border-slate-700", "flex", "items-start", "gap-2"], [1, "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "p-4", "border", "border-slate-100", "dark:border-slate-700"], [1, "w-full", "text-sm"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "uppercase", "text-left", "font-bold", "tracking-wider"], [1, "pb-2"], [1, "pb-2", "text-right"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-700/50"], [1, "flex", "flex-row", "md:flex-col", "gap-2", "shrink-0", "md:w-36", "mt-2", "md:mt-0"], [1, "bg-white", "dark:bg-slate-800", "px-5", "py-3", "rounded-xl", "shadow-lg", "flex", "items-center", "gap-3", "border", "border-slate-100", "dark:border-slate-700"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-blue-600", "dark:text-blue-500"], [1, "text-sm", "font-bold", "text-slate-600", "dark:text-slate-300"], [1, "fa-solid", "fa-crown", "text-[10px]"], [1, "fa-regular", "fa-calendar", "text-blue-500"], [1, "text-red-500"], ["type", "date", "required", "", 1, "h-8", "px-2", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:border-blue-500", "[color-scheme:light]", "dark:[color-scheme:dark]", 3, "ngModelChange", "ngModel"], [1, "fa-regular", "fa-calendar"], [1, "fa-solid", "fa-vial", "text-slate-400", "dark:text-slate-500", "mt-0.5"], [1, "break-words", "font-mono", "font-medium"], [1, "py-2", "font-medium", "text-slate-600", "dark:text-slate-300", "text-xs"], [1, "py-2", "text-right", "font-bold", "text-slate-700", "dark:text-slate-200", "font-mono", "text-xs"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-normal"], [1, "flex-1", "px-4", "py-2.5", "bg-blue-600", "dark:bg-blue-500", "hover:bg-blue-700", "dark:hover:bg-blue-600", "text-white", "rounded-xl", "font-bold", "shadow-sm", "hover:shadow-md", "dark:shadow-none", "transition", "text-xs", "uppercase", "tracking-wide", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-check"], [1, "flex-1", "px-4", "py-2.5", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "hover:bg-red-50", "dark:hover:bg-red-900/20", "hover:border-red-200", "dark:hover:border-red-800/50", "hover:text-red-600", "dark:hover:text-red-400", "text-slate-600", "dark:text-slate-400", "rounded-xl", "font-bold", "transition", "text-xs", "uppercase", "tracking-wide", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-xmark"], [1, "flex-1", "px-4", "py-2.5", "bg-fuchsia-600", "hover:bg-fuchsia-700", "text-white", "rounded-xl", "font-bold", "shadow-sm", "hover:shadow-md", "transition", "text-xs", "uppercase", "tracking-wide", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-square-poll-vertical"], [1, "flex-1", "px-4", "py-2.5", "bg-blue-50", "dark:bg-blue-900/20", "border", "border-blue-200", "dark:border-blue-800/50", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-600", "dark:hover:bg-blue-500", "hover:text-white", "rounded-xl", "font-bold", "shadow-sm", "dark:shadow-none", "transition", "text-xs", "uppercase", "tracking-wide", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-pen"], [1, "flex-1", "px-4", "py-2.5", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-slate-500", "dark:text-slate-400", "hover:text-orange-600", "dark:hover:text-orange-400", "hover:border-orange-200", "dark:hover:border-orange-800/50", "hover:bg-orange-50", "dark:hover:bg-orange-900/20", "rounded-xl", "font-bold", "shadow-sm", "dark:shadow-none", "transition", "text-xs", "uppercase", "tracking-wide", "flex", "items-center", "justify-center", "gap-2", "group", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-rotate-left", "group-hover:-rotate-90", "transition-transform", "duration-300"], [1, "flex", "flex-col", "items-center", "justify-center", "md:w-32", "shrink-0", "text-slate-300", "dark:text-slate-600", "gap-2", "p-4", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "border", "border-dashed", "border-slate-200", "dark:border-slate-700"], [1, "flex", "flex-col", "items-center", "justify-center", "md:w-32", "shrink-0", "text-emerald-500", "dark:text-emerald-400", "gap-2", "p-4", "bg-emerald-50/50", "dark:bg-emerald-900/20", "rounded-xl", "border", "border-emerald-100", "dark:border-emerald-800/50"], [1, "fa-solid", "fa-hourglass-half", "text-2xl", "animate-pulse"], [1, "text-[10px]", "uppercase", "font-bold", "text-center"], [1, "fa-solid", "fa-circle-check", "text-2xl"], [1, "w-16", "h-16", "bg-slate-50", "dark:bg-slate-700", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "text-slate-300", "dark:text-slate-500"], [1, "fa-solid", "fa-inbox", "text-3xl"], [1, "text-slate-500", "dark:text-slate-400", "font-medium", "text-sm"], [1, "absolute", "inset-0", "bg-slate-900/60", "dark:bg-black/70", "backdrop-blur-md", "transition-opacity", "duration-300", 3, "click"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "w-full", "max-w-lg", "border", "border-slate-100", "dark:border-slate-700/80", "shadow-2xl", "relative", "z-10", "overflow-hidden", "flex", "flex-col", "scale-in", "transform", "transition-all", "duration-300", "max-h-[90vh]"], [1, "h-1.5", "w-full", "bg-gradient-to-r", "from-orange-500", "via-amber-500", "to-red-500"], [1, "p-6", "md:p-8", "flex-1", "overflow-y-auto", "custom-scrollbar"], [1, "flex", "items-center", "gap-4", "mb-6"], [1, "w-12", "h-12", "rounded-2xl", "bg-orange-50", "dark:bg-orange-950/30", "border", "border-orange-100", "dark:border-orange-900/50", "flex", "items-center", "justify-center", "text-orange-500", "shrink-0"], [1, "fa-solid", "fa-triangle-exclamation", "text-xl", "animate-bounce"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-100", "leading-tight"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "font-medium", "mt-0.5"], [1, "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-300", "leading-relaxed", "mb-6"], [1, "space-y-4"], [1, "w-full", "text-left", "p-4", "rounded-2xl", "bg-gradient-to-r", "hover:from-blue-50/50", "hover:to-indigo-50/50", "dark:hover:from-blue-950/20", "dark:hover:to-indigo-950/20", "border", "border-slate-105", "dark:border-slate-700", "hover:border-blue-200", "dark:hover:border-blue-800/50", "transition", "group", "flex", "gap-4", 3, "click"], [1, "w-10", "h-10", "rounded-xl", "bg-blue-50", "dark:bg-blue-950/50", "flex", "items-center", "justify-center", "text-blue-500", "dark:text-blue-400", "shrink-0", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-clock-rotate-left"], [1, "text-sm", "font-black", "text-slate-800", "dark:text-slate-200"], [1, "w-full", "text-left", "p-4", "rounded-2xl", "bg-gradient-to-r", "hover:from-red-50/50", "hover:to-rose-50/50", "dark:hover:from-red-950/20", "dark:hover:to-rose-950/20", "border", "border-slate-105", "dark:border-slate-700", "hover:border-red-200", "dark:hover:border-red-800/50", "transition", "group", "flex", "gap-4", 3, "click"], [1, "w-10", "h-10", "rounded-xl", "bg-red-50", "dark:bg-red-950/50", "flex", "items-center", "justify-center", "text-red-500", "dark:text-red-400", "shrink-0", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-ban"], [1, "text-sm", "font-black", "text-red-600", "dark:text-red-400"], [1, "px-6", "py-4", "bg-slate-50", "dark:bg-slate-900/40", "border-t", "border-slate-105", "dark:border-slate-750/80", "flex", "justify-end"], [1, "px-5", "py-2.5", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "text-slate-600", "dark:text-slate-300", "rounded-xl", "text-xs", "font-black", "uppercase", "tracking-wider", "transition", 3, "click"]], template: function RequestListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
            i0.ɵɵelement(4, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div")(6, "h2", 5);
            i0.ɵɵtext(7, "Qu\u1EA3n L\u00FD Y\u00EAu C\u1EA7u");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 6);
            i0.ɵɵtext(9, "Ph\u00EA duy\u1EC7t y\u00EAu c\u1EA7u v\u00E0 in phi\u1EBFu pha ch\u1EBF.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "div", 7)(11, "button", 8);
            i0.ɵɵlistener("click", function RequestListComponent_Template_button_click_11_listener() { return ctx.setCurrentTab("pending"); });
            i0.ɵɵelement(12, "i", 9);
            i0.ɵɵtext(13, " Ch\u1EDD duy\u1EC7t ");
            i0.ɵɵtemplate(14, RequestListComponent_Conditional_14_Template, 2, 1, "span", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "button", 8);
            i0.ɵɵlistener("click", function RequestListComponent_Template_button_click_15_listener() { return ctx.setCurrentTab("approved"); });
            i0.ɵɵelement(16, "i", 11);
            i0.ɵɵtext(17, " L\u1ECBch S\u1EED ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "button", 8);
            i0.ɵɵlistener("click", function RequestListComponent_Template_button_click_18_listener() { return ctx.setCurrentTab("printing"); });
            i0.ɵɵelement(19, "i", 12);
            i0.ɵɵtext(20, " H\u00E0ng \u0111\u1EE3i In ");
            i0.ɵɵtemplate(21, RequestListComponent_Conditional_21_Template, 2, 1, "span", 13);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(22, RequestListComponent_Conditional_22_Template, 2, 2, "div", 14);
            i0.ɵɵelementStart(23, "div", 15);
            i0.ɵɵtemplate(24, RequestListComponent_Conditional_24_Template, 4, 0)(25, RequestListComponent_Conditional_25_Template, 4, 1, "div", 16);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(26, RequestListComponent_Conditional_26_Template, 35, 1, "div", 17);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            let tmp_7_0;
            i0.ɵɵadvance(11);
            i0.ɵɵclassMap(ctx.currentTab() === "pending" ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.state.requests().length > 0 ? 14 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.currentTab() === "approved" ? "bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(3);
            i0.ɵɵclassMap(ctx.currentTab() === "printing" ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.state.printableLogs().length > 0 ? 21 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.currentTab() === "approved" ? 22 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.currentTab() === "printing" ? 24 : 25);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional((tmp_7_0 = ctx.showRevokeModal() && ctx.selectedRevokeRequest()) ? 26 : -1, tmp_7_0);
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.RequiredValidator, i1.NgModel, SkeletonComponent, DateRangeFilterComponent], styles: [".bg-fuchsia-600[_ngcontent-%COMP%] {\n      background-color: rgb(192 38 211) !important;\n    }\n    .hover[_ngcontent-%COMP%]:bg-fuchsia-700:hover {\n      background-color: rgb(162 28 175) !important;\n    }\n    @keyframes _ngcontent-%COMP%_scaleIn {\n      from { transform: scale(0.95); opacity: 0; }\n      to { transform: scale(1); opacity: 1; }\n    }\n    .scale-in[_ngcontent-%COMP%] {\n      animation: _ngcontent-%COMP%_scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n    }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(RequestListComponent, () => [import("./print-queue.component").then(m => m.PrintQueueComponent)], PrintQueueComponent => { i0.ɵsetClassMetadata(RequestListComponent, [{
        type: Component,
        args: [{ selector: 'app-request-list', standalone: true, imports: [CommonModule, FormsModule, SkeletonComponent, PrintQueueComponent, DateRangeFilterComponent], template: `
    <div class="h-full flex flex-col fade-in relative">
        <!-- Header Card -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-sm shrink-0">
                    <i class="fa-solid fa-list-check text-base"></i>
                </div>
                <div>
                    <h2 class="text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight">Quản Lý Yêu Cầu</h2>
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Phê duyệt yêu cầu và in phiếu pha chế.</p>
                </div>
            </div>
            
            <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-full scrollbar-none shrink-0 self-stretch sm:self-start">
               <button (click)="setCurrentTab('pending')" 
                       class="px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2" 
                       [class]="currentTab() === 'pending' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
                   <i class="fa-solid fa-clock"></i> Chờ duyệt 
                   @if(state.requests().length > 0) { <span class="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-1.5 rounded-md text-[10px]">{{state.requests().length}}</span> }
               </button>
               
               <button (click)="setCurrentTab('approved')" 
                       class="px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2" 
                       [class]="currentTab() === 'approved' ? 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
                   <i class="fa-solid fa-check-double"></i> Lịch Sử
               </button>

               <button (click)="setCurrentTab('printing')" 
                       class="px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2" 
                       [class]="currentTab() === 'printing' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
                   <i class="fa-solid fa-print"></i> Hàng đợi In
                   @if(state.printableLogs().length > 0) { <span class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-1.5 rounded-md text-[10px]">{{state.printableLogs().length}}</span> }
               </button>
            </div>
        </div>

        <!-- DATE FILTER (Only for History Tab) -->
        @if (currentTab() === 'approved') {
            <div class="mb-4 flex justify-end">
                <app-date-range-filter 
                    [initStart]="startDate()" 
                    [initEnd]="endDate()" 
                    (dateChange)="onDateRangeChange($event)">
                </app-date-range-filter>
            </div>
        }

        <!-- CONTENT AREA -->
        <div class="flex-1 min-h-0 relative">
            
            <!-- TAB: PRINT QUEUE -->
            @if (currentTab() === 'printing') {
                @defer {
                    <app-print-queue class="h-full block"></app-print-queue>
                } @placeholder {
                    <div class="h-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm font-bold">
                        Đang tải hàng đợi in...
                    </div>
                }
            } 
            
            <!-- TAB: LISTS (Pending / Approved) -->
            @else {
                <div class="h-full overflow-y-auto custom-scrollbar pb-20 pr-2">
                    <div class="grid gap-4 w-full">
                        @if(isLoading()) {
                            @for(i of [1,2,3]; track i) {
                                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex gap-4">
                                    <div class="flex-1 space-y-2">
                                        <app-skeleton width="120px" height="16px"></app-skeleton>
                                        <app-skeleton width="250px" height="24px"></app-skeleton>
                                        <app-skeleton width="150px" height="14px"></app-skeleton>
                                    </div>
                                </div>
                            }
                        } @else {
                            @for (req of displayRequests(); track req.id) {
                                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition hover:shadow-md dark:hover:shadow-none relative overflow-hidden group">
                                    
                                    @if(processingId() === req.id) {
                                        <div class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-20 flex items-center justify-center backdrop-blur-sm">
                                            <div class="bg-white dark:bg-slate-800 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-slate-100 dark:border-slate-700">
                                                <i class="fa-solid fa-circle-notch fa-spin text-blue-600 dark:text-blue-500"></i> 
                                                <span class="text-sm font-bold text-slate-600 dark:text-slate-300">Đang xử lý...</span>
                                            </div>
                                        </div>
                                    }

                                    <div class="flex-1">
                                         <div class="flex flex-wrap items-center gap-3 mb-2">
                                             @if (req.status === 'pending') {
                                                <span class="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-100 dark:border-orange-800/50">Chờ duyệt</span>
                                             } @else {
                                                <span class="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/50">Đã duyệt</span>
                                             }
                                             
                                             @if (req.isVirtualMaster) {
                                                <span class="px-2.5 py-1 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black uppercase tracking-wider border border-fuchsia-100 dark:border-fuchsia-800/50 flex items-center gap-1.5 shadow-sm">
                                                    <i class="fa-solid fa-crown text-[10px]"></i> MẺ MASTER ẢO
                                                </span>
                                             }

                                             @if (req.status === 'pending' && state.isAdmin()) {
                                                <label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bold">
                                                    <i class="fa-regular fa-calendar text-blue-500"></i>
                                                    <span>Ngày kiểm nghiệm <span class="text-red-500">*</span></span>
                                                    <input type="date"
                                                           required
                                                           [ngModel]="getPendingAnalysisDate(req)"
                                                           (ngModelChange)="setPendingAnalysisDate(req.id, $event)"
                                                           class="h-8 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 [color-scheme:light] dark:[color-scheme:dark]"
                                                           [class.border-red-400]="!getPendingAnalysisDate(req)">
                                                </label>
                                             } @else {
                                                <span class="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                                                    <i class="fa-regular fa-calendar"></i>
                                                    {{ getAnalysisDate(req) }}
                                                </span>
                                             }
                                        </div>
                                        
                                        <h3 class="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{req.sopName}}</h3>
                                        <div class="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                                            <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500"><i class="fa-solid fa-user text-[10px]"></i></div>
                                            <span class="font-bold text-slate-600 dark:text-slate-300">{{req.user || 'Unknown'}}</span>
                                        </div>

                                        <!-- Sample List Summary -->
                                        @if(req.sampleList && req.sampleList.length > 0) {
                                            <div class="mb-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700 flex items-start gap-2">
                                                <i class="fa-solid fa-vial text-slate-400 dark:text-slate-500 mt-0.5"></i>
                                                <span class="break-words font-mono font-medium">{{ formatSampleList(req.sampleList) }}</span>
                                            </div>
                                        }

                                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                                             <table class="w-full text-sm">
                                                <thead>
                                                    <tr class="text-[10px] text-slate-400 dark:text-slate-500 uppercase text-left font-bold tracking-wider">
                                                        <th class="pb-2">Hóa chất</th>
                                                        <th class="pb-2 text-right">Lượng dùng</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                                                    @for (item of req.items; track item.name) {
                                                        <tr>
                                                            <td class="py-2 font-medium text-slate-600 dark:text-slate-300 text-xs">{{getItemName(item)}}</td>
                                                            <td class="py-2 text-right font-bold text-slate-700 dark:text-slate-200 font-mono text-xs">
                                                                {{formatNum(item.displayAmount)}} <span class="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{{item.unit}}</span>
                                                            </td>
                                                        </tr>
                                                    }
                                                </tbody>
                                             </table>
                                        </div>
                                    </div>

                                    @if(state.isAdmin()) {
                                        <div class="flex flex-row md:flex-col gap-2 shrink-0 md:w-36 mt-2 md:mt-0">
                                            @if (currentTab() === 'pending') {
                                                <button (click)="approve(req)" [disabled]="!!processingId() || !getPendingAnalysisDate(req)"
                                                        class="flex-1 px-4 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:shadow-md dark:shadow-none transition text-xs uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <i class="fa-solid fa-check"></i> Duyệt
                                                </button>
                                                <button (click)="reject(req)" [disabled]="!!processingId()" 
                                                        class="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800/50 hover:text-red-600 dark:hover:text-red-400 text-slate-600 dark:text-slate-400 rounded-xl font-bold transition text-xs uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <i class="fa-solid fa-xmark"></i> Từ Chối
                                                </button>
                                            } @else {
                                                <button (click)="goToResults(req)" [disabled]="!!processingId()" 
                                                         class="flex-1 px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-bold shadow-sm hover:shadow-md transition text-xs uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <i class="fa-solid fa-square-poll-vertical"></i> Nhập Kết Quả
                                                </button>
                                                <button (click)="editApproved(req)" [disabled]="!!processingId()" 
                                                         class="flex-1 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-xl font-bold shadow-sm dark:shadow-none transition text-xs uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <i class="fa-solid fa-pen"></i> Chỉnh Sửa
                                                </button>
                                                <button (click)="revoke(req)" [disabled]="!!processingId()" 
                                                         class="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl font-bold shadow-sm dark:shadow-none transition text-xs uppercase tracking-wide flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <i class="fa-solid fa-rotate-left group-hover:-rotate-90 transition-transform duration-300"></i> Hoàn Tác
                                                </button>
                                            }
                                        </div>
                                    } @else {
                                        @if(currentTab() === 'pending') {
                                            <div class="flex flex-col items-center justify-center md:w-32 shrink-0 text-slate-300 dark:text-slate-600 gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                                <i class="fa-solid fa-hourglass-half text-2xl animate-pulse"></i>
                                                <span class="text-[10px] uppercase font-bold text-center">Đang chờ<br>quản lý duyệt</span>
                                            </div>
                                        } @else {
                                            <div class="flex flex-col items-center justify-center md:w-32 shrink-0 text-emerald-500 dark:text-emerald-400 gap-2 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                                <i class="fa-solid fa-circle-check text-2xl"></i>
                                                <span class="text-[10px] uppercase font-bold text-center">Hoàn thành</span>
                                            </div>
                                        }
                                    }
                                </div>
                            } @empty {
                                <div class="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
                                    <div class="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
                                        <i class="fa-solid fa-inbox text-3xl"></i>
                                    </div>
                                    <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">
                                        {{ currentTab() === 'pending' ? 'Không có yêu cầu nào đang chờ.' : 'Không có dữ liệu lịch sử trong khoảng thời gian này.' }}
                                    </p>
                                </div>
                            }
                        }
                    </div>
                </div>
            }
        </div>

        <!-- PREMIUM GLASSMORPHIC SMART CONFIRMATION MODAL -->
        @if (showRevokeModal() && selectedRevokeRequest(); as req) {
            <div class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <!-- Backdrop blur -->
                <div class="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md transition-opacity duration-300" (click)="closeRevokeModal()"></div>
                
                <!-- Modal Content -->
                <div class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg border border-slate-100 dark:border-slate-700/80 shadow-2xl relative z-10 overflow-hidden flex flex-col scale-in transform transition-all duration-300 max-h-[90vh]">
                    <!-- Top subtle accent bar -->
                    <div class="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-red-500"></div>

                    <div class="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                        <!-- Icon and Title -->
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 flex items-center justify-center text-orange-500 shrink-0">
                                <i class="fa-solid fa-triangle-exclamation text-xl animate-bounce"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">Xác Nhận Hoàn Tác & Hủy Duyệt</h3>
                                <p class="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">SOP: {{ req.sopName }}</p>
                            </div>
                        </div>

                        <!-- Question Description -->
                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                            Hệ thống sẽ hoàn trả lượng hóa chất sử dụng trở lại kho. Bạn muốn xử lý yêu cầu này thế nào tiếp theo?
                        </p>

                        <!-- Choice Cards -->
                        <div class="space-y-4">
                            <!-- Option A: Đưa về chờ duyệt -->
                            <button (click)="confirmRevoke('pending')" 
                                    class="w-full text-left p-4 rounded-2xl bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20 border border-slate-105 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800/50 transition group flex gap-4">
                                <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-500 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-clock-rotate-left"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="text-sm font-black text-slate-800 dark:text-slate-200">Đưa về Chờ Duyệt</div>
                                    <div class="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">Trả lại kho và chuyển phiếu về trạng thái chờ phê duyệt để có thể sửa đổi hoặc duyệt lại.</div>
                                </div>
                            </button>

                            <!-- Option B: Từ chối hoàn toàn -->
                            <button (click)="confirmRevoke('rejected')" 
                                    class="w-full text-left p-4 rounded-2xl bg-gradient-to-r hover:from-red-50/50 hover:to-rose-50/50 dark:hover:from-red-950/20 dark:hover:to-rose-950/20 border border-slate-105 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800/50 transition group flex gap-4">
                                <div class="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-ban"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="text-sm font-black text-red-600 dark:text-red-400">Từ Chối Hoàn Toàn</div>
                                    <div class="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">Trả lại kho và hủy bỏ hoàn toàn yêu cầu này (không thể phê duyệt lại).</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Footer actions -->
                    <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-105 dark:border-slate-750/80 flex justify-end">
                        <button (click)="closeRevokeModal()" 
                                class="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition">
                            Hủy Thao Tác
                        </button>
                    </div>
                </div>
            </div>
        }
    </div>
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ["\n    .bg-fuchsia-600 {\n      background-color: rgb(192 38 211) !important;\n    }\n    .hover:bg-fuchsia-700:hover {\n      background-color: rgb(162 28 175) !important;\n    }\n    @keyframes scaleIn {\n      from { transform: scale(0.95); opacity: 0; }\n      to { transform: scale(1); opacity: 1; }\n    }\n    .scale-in {\n      animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n    }\n  "] }]
    }], null, null); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RequestListComponent, { className: "RequestListComponent", filePath: "src/app/features/requests/request-list.component.ts", lineNumber: 319 }); })();
//# sourceMappingURL=request-list.component.js.map