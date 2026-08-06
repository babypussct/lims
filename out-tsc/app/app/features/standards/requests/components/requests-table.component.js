import { Component, Input, Output, EventEmitter, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { formatNum } from '../../../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = () => [1, 2, 3, 4, 5];
const _forTrack0 = ($index, $item) => $item.id;
function RequestsTableComponent_Conditional_17_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 7)(1, "td", 8);
    i0.ɵɵelement(2, "div", 9);
    i0.ɵɵelementEnd()();
} }
function RequestsTableComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, RequestsTableComponent_Conditional_17_For_1_Template, 3, 0, "tr", 7, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 18);
    i0.ɵɵtext(1, "Nh\u1EADp b\u00F9");
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 38)(1, "span", 52);
    i0.ɵɵelement(2, "i", 53);
    i0.ɵɵtext(3, "T\u1ED5ng \u0111\u00E3 d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 54);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const req_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", req_r2.totalAmountUsed, " ", (req_r2.standardDetails == null ? null : req_r2.standardDetails.unit) || "", "");
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_67_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 46);
    i0.ɵɵelement(1, "i", 55);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const req_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Duy\u1EC7t: ", req_r2.approvedByName, " ");
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_68_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 47);
    i0.ɵɵelement(1, "i", 56);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const req_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Nh\u1EADn: ", req_r2.receivedByName, " ");
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_69_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 48);
    i0.ɵɵtext(1, "Tr\u1ED1ng");
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_72_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 57);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_18_For_1_Conditional_72_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const req_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.actionApprove.emit(req_r2)); });
    i0.ɵɵelement(1, "i", 58);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 59);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_18_For_1_Conditional_72_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r4); const req_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.actionReject.emit(req_r2)); });
    i0.ɵɵelement(3, "i", 60);
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_73_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 62);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_18_For_1_Conditional_73_Conditional_0_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const req_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.actionLogUsage.emit(req_r2)); });
    i0.ɵɵelement(1, "i", 63);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 64);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_18_For_1_Conditional_73_Conditional_0_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r5); const req_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.actionReturn.emit({ req: req_r2, isForce: false })); });
    i0.ɵɵelement(3, "i", 65);
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_73_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 66);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_18_For_1_Conditional_73_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const req_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.actionReturn.emit({ req: req_r2, isForce: true })); });
    i0.ɵɵelement(1, "i", 67);
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_73_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsTableComponent_Conditional_18_For_1_Conditional_73_Conditional_0_Template, 4, 0)(1, RequestsTableComponent_Conditional_18_For_1_Conditional_73_Conditional_1_Template, 2, 0, "button", 61);
} if (rf & 2) {
    const req_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r2.isCurrentUser(req_r2.requestedBy) ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canApproveAndNotRequestedBySelf(req_r2) ? 1 : -1);
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_74_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 70);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_18_For_1_Conditional_74_Conditional_0_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const req_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.actionUndoReturn.emit(req_r2)); });
    i0.ɵɵelement(1, "i", 71);
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_74_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 72);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_18_For_1_Conditional_74_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const req_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.actionAdminReceive.emit(req_r2)); });
    i0.ɵɵelement(1, "i", 73);
    i0.ɵɵtext(2, "NH\u1EACN TR\u1EA2");
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_74_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsTableComponent_Conditional_18_For_1_Conditional_74_Conditional_0_Template, 2, 0, "button", 68)(1, RequestsTableComponent_Conditional_18_For_1_Conditional_74_Conditional_1_Template, 3, 0, "button", 69);
} if (rf & 2) {
    const req_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r2.isCurrentUser(req_r2.requestedBy) ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canApproveRequest(req_r2) ? 1 : -1);
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_75_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 50);
    i0.ɵɵelement(1, "i", 74);
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_18_For_1_Conditional_76_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 75);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_18_For_1_Conditional_76_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); const req_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.actionDelete.emit(req_r2)); });
    i0.ɵɵelement(1, "i", 76);
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_18_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 10)(1, "td", 11)(2, "div", 12)(3, "div", 13)(4, "div", 14);
    i0.ɵɵelement(5, "i", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "div", 16)(8, "div", 17);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_18_For_1_Template_div_click_8_listener($event) { const req_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); ctx_r2.navigateToStandard.emit(req_r2.standardId); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, RequestsTableComponent_Conditional_18_For_1_Conditional_10_Template, 2, 0, "span", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 19)(12, "span", 20);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "span", 21);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(16, "div", 22)(17, "div", 23)(18, "span", 24);
    i0.ɵɵtext(19, "S\u1ED1 L\u00F4 (LOT)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "span", 25);
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 23)(23, "span", 24);
    i0.ɵɵtext(24, "CAS Number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "span", 26);
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "div", 27)(28, "span", 28);
    i0.ɵɵtext(29, "H\u1EA1n d\u00F9ng (EXP)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "span", 29);
    i0.ɵɵtext(31);
    i0.ɵɵpipe(32, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "div", 30)(34, "span", 24);
    i0.ɵɵtext(35, "T\u1ED3n kho / V\u1ECB tr\u00ED");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div", 31)(37, "span", 32);
    i0.ɵɵtext(38);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "span", 33);
    i0.ɵɵtext(40, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "span", 34);
    i0.ɵɵtext(42);
    i0.ɵɵelementEnd()()()()()();
    i0.ɵɵelementStart(43, "td", 11)(44, "div", 13)(45, "div", 35);
    i0.ɵɵtext(46);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "div")(48, "div", 36);
    i0.ɵɵtext(49);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "div", 37);
    i0.ɵɵtext(51);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(52, RequestsTableComponent_Conditional_18_For_1_Conditional_52_Template, 6, 2, "div", 38);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(53, "td", 11)(54, "div", 39)(55, "div", 40)(56, "span", 41);
    i0.ɵɵtext(57, "Y\u00EAu c\u1EA7u:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "span", 42);
    i0.ɵɵtext(59);
    i0.ɵɵpipe(60, "date");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(61, "td", 43)(62, "div", 44);
    i0.ɵɵelement(63, "i");
    i0.ɵɵtext(64);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(65, "td", 43)(66, "div", 45);
    i0.ɵɵtemplate(67, RequestsTableComponent_Conditional_18_For_1_Conditional_67_Template, 3, 1, "div", 46)(68, RequestsTableComponent_Conditional_18_For_1_Conditional_68_Template, 3, 1, "div", 47)(69, RequestsTableComponent_Conditional_18_For_1_Conditional_69_Template, 2, 0, "span", 48);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(70, "td", 43)(71, "div", 49);
    i0.ɵɵtemplate(72, RequestsTableComponent_Conditional_18_For_1_Conditional_72_Template, 4, 0)(73, RequestsTableComponent_Conditional_18_For_1_Conditional_73_Template, 2, 2)(74, RequestsTableComponent_Conditional_18_For_1_Conditional_74_Template, 2, 2)(75, RequestsTableComponent_Conditional_18_For_1_Conditional_75_Template, 2, 0, "button", 50)(76, RequestsTableComponent_Conditional_18_For_1_Conditional_76_Template, 2, 0, "button", 51);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_23_0;
    const req_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate(req_r2.standardName);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r2.isBackfill ? 10 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", req_r2.standardDetails == null ? null : req_r2.standardDetails.internal_id, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", req_r2.standardDetails == null ? null : req_r2.standardDetails.manufacturer, " ");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(req_r2.lotNumber || "N/A");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate((req_r2.standardDetails == null ? null : req_r2.standardDetails.cas_number) || "N/A");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.isExpOverdue(req_r2.standardDetails == null ? null : req_r2.standardDetails.expiry_date) ? "bg-rose-50/50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30" : "bg-slate-50/50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-800/50");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("text-rose-500", ctx_r2.isExpOverdue(req_r2.standardDetails == null ? null : req_r2.standardDetails.expiry_date))("text-slate-400", !ctx_r2.isExpOverdue(req_r2.standardDetails == null ? null : req_r2.standardDetails.expiry_date));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("text-rose-600", ctx_r2.isExpOverdue(req_r2.standardDetails == null ? null : req_r2.standardDetails.expiry_date))("text-slate-700", !ctx_r2.isExpOverdue(req_r2.standardDetails == null ? null : req_r2.standardDetails.expiry_date));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(32, 38, req_r2.standardDetails == null ? null : req_r2.standardDetails.expiry_date, "dd/MM/yyyy"));
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum((tmp_23_0 = req_r2.standardDetails == null ? null : req_r2.standardDetails.current_amount) !== null && tmp_23_0 !== undefined ? tmp_23_0 : 0), "", req_r2.standardDetails == null ? null : req_r2.standardDetails.unit, "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate((req_r2.standardDetails == null ? null : req_r2.standardDetails.location) || "?");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", req_r2.requestedByName.charAt(0), " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(req_r2.requestedByName);
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", req_r2.purpose);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(req_r2.purpose);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r2.totalAmountUsed ? 52 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(60, 41, req_r2.requestDate, "dd/MM/yyyy HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", ctx_r2.getStatusClass(req_r2.status));
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.getStatusIcon(req_r2.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.getStatusLabel(req_r2.status), " ");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(req_r2.approvedByName ? 67 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r2.receivedByName ? 68 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!req_r2.approvedByName && !req_r2.receivedByName ? 69 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(req_r2.status === "PENDING_APPROVAL" && ctx_r2.canApproveRequest(req_r2) ? 72 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r2.status === "IN_PROGRESS" ? 73 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r2.status === "PENDING_RETURN" ? 74 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r2.status === "COMPLETED" || req_r2.status === "REJECTED" ? 75 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canDeleteRequest(req_r2) ? 76 : -1);
} }
function RequestsTableComponent_Conditional_18_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 77)(2, "div", 78);
    i0.ɵɵelement(3, "i", 79);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 80);
    i0.ɵɵtext(5, "Kh\u00F4ng t\u00ECm th\u1EA5y y\u00EAu c\u1EA7u n\u00E0o");
    i0.ɵɵelementEnd()()();
} }
function RequestsTableComponent_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, RequestsTableComponent_Conditional_18_For_1_Template, 77, 44, "tr", 10, _forTrack0);
    i0.ɵɵtemplate(2, RequestsTableComponent_Conditional_18_Conditional_2_Template, 6, 0, "tr");
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵrepeater(ctx_r2.visibleRequests());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.requests.length === 0 ? 2 : -1);
} }
function RequestsTableComponent_Conditional_19_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 85);
    i0.ɵɵlistener("click", function RequestsTableComponent_Conditional_19_Conditional_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.loadMore()); });
    i0.ɵɵelement(1, "i", 86);
    i0.ɵɵtext(2);
    i0.ɵɵelementStart(3, "span", 87);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Xem th\u00EAm ", ctx_r2.Math.min(ctx_r2.tableLimitStep, ctx_r2.requests.length - ctx_r2.visibleRequests().length), " d\u00F2ng ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("(c\u00F2n ", ctx_r2.requests.length - ctx_r2.visibleRequests().length, ")");
} }
function RequestsTableComponent_Conditional_19_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 84);
    i0.ɵɵelement(1, "i", 88);
    i0.ɵɵtext(2, "\u0110\u00E3 hi\u1EC3n th\u1ECB to\u00E0n b\u1ED9");
    i0.ɵɵelementEnd();
} }
function RequestsTableComponent_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6)(1, "span", 81);
    i0.ɵɵtext(2, " \u0110ang hi\u1EC3n th\u1ECB ");
    i0.ɵɵelementStart(3, "strong", 82);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5, "/");
    i0.ɵɵelementStart(6, "strong", 82);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8, " y\u00EAu c\u1EA7u ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, RequestsTableComponent_Conditional_19_Conditional_9_Template, 5, 2, "button", 83)(10, RequestsTableComponent_Conditional_19_Conditional_10_Template, 3, 0, "span", 84);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r2.visibleRequests().length);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r2.requests.length);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.requests.length > ctx_r2.visibleRequests().length ? 9 : 10);
} }
export class RequestsTableComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.isLoading = false;
        this.Math = Math;
        this.tableLimitStep = 80;
        this.tableLimit = signal(this.tableLimitStep);
        this._requests = signal([]);
        this.visibleRequests = computed(() => this._requests().slice(0, this.tableLimit()));
        this.navigateToStandard = new EventEmitter();
        this.actionApprove = new EventEmitter();
        this.actionReject = new EventEmitter();
        this.actionLogUsage = new EventEmitter();
        this.actionReturn = new EventEmitter();
        this.actionUndoReturn = new EventEmitter();
        this.actionAdminReceive = new EventEmitter();
        this.actionDelete = new EventEmitter();
        this.Date = Date;
        this.formatNum = formatNum;
    }
    canApproveRequest(req) {
        return this.auth.canAssignStandards();
    }
    canDeleteRequest(req) {
        return this.auth.canDeleteStandardLogs();
    }
    isCurrentUser(uid) {
        const user = this.auth.currentUser();
        return !!user && uid === user.uid;
    }
    canApproveAndNotRequestedBySelf(req) {
        const user = this.auth.currentUser();
        return this.auth.canAssignStandards() && !!user && req.requestedBy !== user.uid;
    }
    set requests(value) {
        this._requests.set(value || []);
        this.tableLimit.set(this.tableLimitStep);
    }
    get requests() {
        return this._requests();
    }
    loadMore() {
        this.tableLimit.update(limit => limit + this.tableLimitStep);
    }
    isExpOverdue(expiryDate) {
        if (!expiryDate)
            return false;
        return new Date(expiryDate).getTime() < Date.now();
    }
    getStatusClass(status) {
        switch (status) {
            case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30';
            case 'IN_PROGRESS': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30';
            case 'PENDING_RETURN': return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800/30';
            case 'COMPLETED': return 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300';
            case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/30';
            default: return 'bg-slate-100 text-slate-600';
        }
    }
    getStatusIcon(status) {
        switch (status) {
            case 'PENDING_APPROVAL': return 'fa-solid fa-hourglass-half';
            case 'IN_PROGRESS': return 'fa-solid fa-flask';
            case 'PENDING_RETURN': return 'fa-solid fa-box-open';
            case 'COMPLETED': return 'fa-solid fa-check-circle';
            case 'REJECTED': return 'fa-solid fa-ban';
            default: return 'fa-solid fa-circle';
        }
    }
    getStatusLabel(status) {
        switch (status) {
            case 'PENDING_APPROVAL': return 'Chờ duyệt';
            case 'IN_PROGRESS': return 'Đang dùng';
            case 'PENDING_RETURN': return 'Chờ trả';
            case 'COMPLETED': return 'Hoàn thành';
            case 'REJECTED': return 'Đã từ chối';
            default: return status;
        }
    }
    static { this.ɵfac = function RequestsTableComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RequestsTableComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RequestsTableComponent, selectors: [["app-requests-table"]], inputs: { requests: "requests", isLoading: "isLoading" }, outputs: { navigateToStandard: "navigateToStandard", actionApprove: "actionApprove", actionReject: "actionReject", actionLogUsage: "actionLogUsage", actionReturn: "actionReturn", actionUndoReturn: "actionUndoReturn", actionAdminReceive: "actionAdminReceive", actionDelete: "actionDelete" }, decls: 20, vars: 2, consts: [[1, "flex-1", "min-h-0", "overflow-auto", "custom-scrollbar"], [1, "w-full", "text-left", "border-separate", "border-spacing-0"], [1, "bg-white", "dark:bg-slate-800", "sticky", "top-0", "z-30"], [1, "px-6", "py-4", "text-xs", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "border-b", "border-slate-50", "dark:border-slate-700"], [1, "px-6", "py-4", "text-xs", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "border-b", "border-slate-50", "dark:border-slate-700", "text-center"], [1, "divide-y", "divide-slate-50", "dark:divide-slate-800/50"], ["data-testid", "request-table-footer", 1, "shrink-0", "border-t", "border-slate-100", "dark:border-slate-700", "bg-white/95", "dark:bg-slate-800/95", "backdrop-blur-sm", "px-4", "py-2.5", "flex", "flex-wrap", "items-center", "justify-between", "gap-2", "text-xs"], [1, "animate-pulse"], ["colspan", "6", 1, "px-6", "py-4"], [1, "h-12", "bg-slate-50", "dark:bg-slate-800/50", "rounded-2xl", "w-full"], [1, "group", "hover:bg-slate-50/50", "dark:hover:bg-slate-800/30", "transition-all"], [1, "px-6", "py-5"], [1, "flex", "flex-col", "gap-3"], [1, "flex", "items-start", "gap-3"], [1, "w-10", "h-10", "rounded-2xl", "bg-slate-50", "dark:bg-slate-900/50", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "shrink-0", "border", "border-slate-100", "dark:border-slate-800", "shadow-sm"], [1, "fa-solid", "fa-vial-circle-check", "text-base", "font-bold"], [1, "flex", "items-center", "gap-2", "mb-1"], [1, "font-black", "text-slate-800", "dark:text-slate-100", "text-base", "leading-tight", "cursor-pointer", "hover:text-indigo-600", "dark:hover:text-indigo-400", "hover:underline", "transition-colors", 3, "click"], [1, "px-2", "py-0.5", "rounded-md", "bg-purple-100", "dark:bg-purple-900/30", "text-purple-700", "dark:text-purple-300", "border", "border-purple-200", "dark:border-purple-800", "text-[9px]", "font-black", "uppercase", "tracking-wider", "whitespace-nowrap"], [1, "flex", "items-center", "gap-2"], [1, "px-2.5", "py-1", "bg-indigo-100", "dark:bg-indigo-900/40", "text-indigo-700", "dark:text-indigo-300", "text-sm", "font-black", "rounded-lg", "border", "border-indigo-200", "dark:border-indigo-700/50", "shadow-sm", "uppercase", "tracking-wide"], [1, "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500", "line-clamp-1", "italic", "max-w-[150px]"], [1, "grid", "grid-cols-2", "gap-2", "mt-1"], [1, "px-2.5", "py-1.5", "bg-slate-50/50", "dark:bg-slate-900/30", "rounded-xl", "border", "border-slate-100", "dark:border-slate-800/50", "flex", "flex-col", "gap-0.5"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "text-sm", "font-black", "text-blue-600", "dark:text-blue-400", "truncate"], [1, "text-sm", "font-black", "text-teal-600", "dark:text-teal-400", "truncate"], [1, "px-2.5", "py-1.5", "rounded-xl", "border", "flex", "flex-col", "gap-0.5"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest"], [1, "text-sm", "font-black"], [1, "px-2.5", "py-1.5", "bg-slate-50/50", "dark:bg-slate-900/30", "rounded-xl", "border", "border-slate-100", "dark:border-slate-800/50", "flex", "flex-col", "gap-1"], [1, "text-sm", "leading-snug"], [1, "font-black", "text-slate-700", "dark:text-slate-300"], [1, "text-slate-400", "mx-1"], [1, "font-bold", "text-slate-600", "dark:text-slate-400", "break-words"], [1, "w-8", "h-8", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "flex", "items-center", "justify-center", "text-slate-500", "uppercase", "font-black", "text-xs", "shrink-0", "border", "border-placeholder"], [1, "font-black", "text-slate-700", "dark:text-slate-300", "text-sm", "mb-0.5"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "font-medium", "italic", "line-clamp-1", "max-w-[200px]", 3, "title"], [1, "mt-2", "flex", "items-center", "gap-2", "bg-rose-50/80", "dark:bg-rose-900/10", "px-2.5", "py-1.5", "rounded-xl", "border", "border-rose-100/50", "dark:border-rose-900/30", "w-fit", "min-w-[120px]", "shadow-sm", "justify-between"], [1, "space-y-1.5"], [1, "flex", "items-center", "gap-2", "text-xs"], [1, "w-12", "text-slate-400", "dark:text-slate-500", "font-black", "uppercase"], [1, "text-slate-700", "dark:text-slate-300", "font-bold", "whitespace-nowrap"], [1, "px-6", "py-5", "text-center"], [1, "inline-flex", "items-center", "gap-1.5", "px-3", "py-1.5", "rounded-2xl", "text-[11px]", "font-black", "uppercase", "tracking-widest", "border", "shadow-sm", 3, "ngClass"], [1, "flex", "flex-col", "gap-1", "items-center"], [1, "px-2", "py-0.5", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-600", "dark:text-emerald-400", "text-[11px]", "font-black", "rounded-lg", "border", "border-emerald-100/50", "dark:border-emerald-800/30", "whitespace-nowrap"], [1, "px-2", "py-0.5", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-600", "dark:text-blue-400", "text-[11px]", "font-black", "rounded-lg", "border", "border-blue-100/50", "dark:border-blue-800/30", "whitespace-nowrap"], [1, "text-xs", "text-slate-300", "dark:text-slate-600", "font-black", "italic"], [1, "flex", "items-center", "justify-center", "gap-1"], ["title", "\u0110\u00E3 kh\u00F3a", 1, "p-2", "text-slate-300", "dark:text-slate-600", "bg-slate-50", "dark:bg-slate-900/50", "rounded-xl", "cursor-default"], ["title", "X\u00F3a y\u00EAu c\u1EA7u & Ho\u00E0n t\u00E1c t\u1ED3n kho", 1, "p-2", "text-rose-300", "hover:text-rose-600", "bg-rose-50/50", "dark:bg-rose-900/20", "rounded-xl", "transition", "active:scale-90", "ml-1"], [1, "text-[11px]", "font-black", "text-rose-500/80", "dark:text-rose-400/80", "uppercase", "tracking-widest"], [1, "fa-solid", "fa-droplet", "mr-1.5"], [1, "text-sm", "font-black", "text-rose-600", "dark:text-rose-400"], [1, "fa-solid", "fa-stamp", "mr-1"], [1, "fa-solid", "fa-check-double", "mr-1"], ["title", "Duy\u1EC7t & Giao", 1, "p-2", "bg-emerald-600", "text-white", "rounded-xl", "hover:bg-emerald-700", "transition", "shadow-lg", "shadow-emerald-500/20", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-check"], ["title", "T\u1EEB ch\u1ED1i", 1, "p-2", "bg-rose-100", "text-rose-600", "rounded-xl", "hover:bg-rose-200", "transition", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-times"], ["title", "Thu h\u1ED3i tr\u1EF1c ti\u1EBFp", 1, "p-2", "bg-slate-100", "text-slate-600", "rounded-xl", "hover:bg-slate-200", "transition", "active:scale-90", "ml-1"], ["title", "Ghi nh\u1EADn d\u00F9ng", 1, "p-2", "bg-teal-600", "text-white", "rounded-xl", "hover:bg-teal-700", "transition", "shadow-lg", "shadow-teal-500/20", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-pen-nib"], ["title", "B\u00E1o c\u00E1o tr\u1EA3", 1, "p-2", "bg-amber-500", "text-white", "rounded-xl", "hover:bg-amber-600", "transition", "shadow-lg", "shadow-amber-500/20", "active:scale-90", "ml-1", 3, "click"], [1, "fa-solid", "fa-reply"], ["title", "Thu h\u1ED3i tr\u1EF1c ti\u1EBFp", 1, "p-2", "bg-slate-100", "text-slate-600", "rounded-xl", "hover:bg-slate-200", "transition", "active:scale-90", "ml-1", 3, "click"], [1, "fa-solid", "fa-hand-holding-hand"], ["title", "H\u1EE7y b\u00E1o c\u00E1o tr\u1EA3 v\u00E0 nh\u1EADp l\u1EA1i", 1, "p-2", "bg-amber-50", "text-amber-600", "rounded-xl", "hover:bg-amber-100", "transition", "shadow-lg", "shadow-amber-500/20", "active:scale-90", "mr-1"], ["title", "Ti\u1EBFp nh\u1EADn tr\u1EA3", 1, "px-3", "py-1.5", "bg-indigo-600", "text-white", "rounded-xl", "hover:bg-indigo-700", "transition", "shadow-lg", "shadow-indigo-500/20", "active:scale-90", "text-xs", "font-black"], ["title", "H\u1EE7y b\u00E1o c\u00E1o tr\u1EA3 v\u00E0 nh\u1EADp l\u1EA1i", 1, "p-2", "bg-amber-50", "text-amber-600", "rounded-xl", "hover:bg-amber-100", "transition", "shadow-lg", "shadow-amber-500/20", "active:scale-90", "mr-1", 3, "click"], [1, "fa-solid", "fa-rotate-left"], ["title", "Ti\u1EBFp nh\u1EADn tr\u1EA3", 1, "px-3", "py-1.5", "bg-indigo-600", "text-white", "rounded-xl", "hover:bg-indigo-700", "transition", "shadow-lg", "shadow-indigo-500/20", "active:scale-90", "text-xs", "font-black", 3, "click"], [1, "fa-solid", "fa-check-to-slot", "mr-1"], [1, "fa-solid", "fa-lock"], ["title", "X\u00F3a y\u00EAu c\u1EA7u & Ho\u00E0n t\u00E1c t\u1ED3n kho", 1, "p-2", "text-rose-300", "hover:text-rose-600", "bg-rose-50/50", "dark:bg-rose-900/20", "rounded-xl", "transition", "active:scale-90", "ml-1", 3, "click"], [1, "fa-solid", "fa-trash-can"], ["colspan", "6", 1, "px-6", "py-24", "text-center"], [1, "w-20", "h-20", "bg-slate-50", "dark:bg-slate-900", "rounded-[2rem]", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "text-slate-200", "dark:text-slate-800", "border-2", "border-dashed", "border-slate-100", "dark:border-slate-800"], [1, "fa-solid", "fa-box-open", "text-3xl"], [1, "text-slate-400", "dark:text-slate-500", "font-black", "uppercase", "text-sm", "tracking-[0.2em]"], [1, "font-bold", "text-slate-500", "dark:text-slate-400"], [1, "text-slate-700", "dark:text-slate-200"], ["type", "button", "data-testid", "request-table-more", 1, "px-4", "py-2", "rounded-xl", "border", "border-indigo-200", "dark:border-indigo-800", "bg-indigo-50", "dark:bg-indigo-900/20", "text-xs", "font-black", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/40", "transition"], [1, "text-emerald-600", "dark:text-emerald-400", "font-black"], ["type", "button", "data-testid", "request-table-more", 1, "px-4", "py-2", "rounded-xl", "border", "border-indigo-200", "dark:border-indigo-800", "bg-indigo-50", "dark:bg-indigo-900/20", "text-xs", "font-black", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/40", "transition", 3, "click"], [1, "fa-solid", "fa-angles-down", "mr-1"], [1, "font-bold", "opacity-70"], [1, "fa-solid", "fa-check", "mr-1"]], template: function RequestsTableComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "table", 1)(2, "thead", 2)(3, "tr")(4, "th", 3);
            i0.ɵɵtext(5, "Th\u00F4ng tin chu\u1EA9n \u0111\u1ED1i chi\u1EBFu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "th", 3);
            i0.ɵɵtext(7, "Ng\u01B0\u1EDDi m\u01B0\u1EE3n & Ho\u1EA1t \u0111\u1ED9ng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "th", 3);
            i0.ɵɵtext(9, "M\u1ED1c th\u1EDDi gian");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "th", 4);
            i0.ɵɵtext(11, "Tr\u1EA1ng th\u00E1i");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "th", 4);
            i0.ɵɵtext(13, "X\u00E1c nh\u1EADn");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "th", 4);
            i0.ɵɵtext(15, "Thao t\u00E1c");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(16, "tbody", 5);
            i0.ɵɵtemplate(17, RequestsTableComponent_Conditional_17_Template, 2, 1)(18, RequestsTableComponent_Conditional_18_Template, 3, 1);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(19, RequestsTableComponent_Conditional_19_Template, 11, 3, "div", 6);
        } if (rf & 2) {
            i0.ɵɵadvance(17);
            i0.ɵɵconditional(ctx.isLoading ? 17 : 18);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.isLoading && ctx.requests.length > 0 ? 19 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RequestsTableComponent, [{
        type: Component,
        args: [{
                selector: 'app-requests-table',
                standalone: true,
                imports: [CommonModule],
                template: `
    <div class="flex-1 min-h-0 overflow-auto custom-scrollbar">
        <table class="w-full text-left border-separate border-spacing-0">
            <thead class="bg-white dark:bg-slate-800 sticky top-0 z-30">
                <tr>
                    <th class="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700">Thông tin chuẩn đối chiếu</th>
                    <th class="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700">Người mượn & Hoạt động</th>
                    <th class="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700">Mốc thời gian</th>
                    <th class="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 text-center">Trạng thái</th>
                    <th class="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 text-center">Xác nhận</th>
                    <th class="px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 text-center">Thao tác</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                @if (isLoading) {
                    @for(i of [1,2,3,4,5]; track i) {
                        <tr class="animate-pulse">
                            <td colspan="6" class="px-6 py-4"><div class="h-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl w-full"></div></td>
                        </tr>
                    }
                } @else {
                    @for (req of visibleRequests(); track req.id) {
                        <tr class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                            <td class="px-6 py-5">
                                    <div class="flex flex-col gap-3">
                                        <div class="flex items-start gap-3">
                                            <div class="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <i class="fa-solid fa-vial-circle-check text-base font-bold"></i>
                                            </div>
                                            <div>
                                                <div class="flex items-center gap-2 mb-1">
                                                    <div class="font-black text-slate-800 dark:text-slate-100 text-base leading-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors" (click)="navigateToStandard.emit(req.standardId); $event.stopPropagation()">{{req.standardName}}</div>
                                                    @if(req.isBackfill) {
                                                        <span class="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[9px] font-black uppercase tracking-wider whitespace-nowrap">Nhập bù</span>
                                                    }
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <span class="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-black rounded-lg border border-indigo-200 dark:border-indigo-700/50 shadow-sm uppercase tracking-wide">
                                                        {{req.standardDetails?.internal_id}}
                                                    </span>
                                                    <span class="text-xs font-bold text-slate-400 dark:text-slate-500 line-clamp-1 italic max-w-[150px]">
                                                        {{req.standardDetails?.manufacturer}}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Standard Meta Grid (Rich Identity) -->
                                        <div class="grid grid-cols-2 gap-2 mt-1">
                                            <div class="px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-0.5">
                                                <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Số Lô (LOT)</span>
                                                <span class="text-sm font-black text-blue-600 dark:text-blue-400 truncate">{{req.lotNumber || 'N/A'}}</span>
                                            </div>
                                            <div class="px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-0.5">
                                                <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">CAS Number</span>
                                                <span class="text-sm font-black text-teal-600 dark:text-teal-400 truncate">{{req.standardDetails?.cas_number || 'N/A'}}</span>
                                            </div>
                                            <div class="px-2.5 py-1.5 rounded-xl border flex flex-col gap-0.5" 
                                                    [class]="isExpOverdue(req.standardDetails?.expiry_date) ? 'bg-rose-50/50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30' : 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-800/50'">
                                                <span class="text-[10px] font-black uppercase tracking-widest" [class.text-rose-500]="isExpOverdue(req.standardDetails?.expiry_date)" [class.text-slate-400]="!isExpOverdue(req.standardDetails?.expiry_date)">Hạn dùng (EXP)</span>
                                                <span class="text-sm font-black" [class.text-rose-600]="isExpOverdue(req.standardDetails?.expiry_date)" [class.text-slate-700]="!isExpOverdue(req.standardDetails?.expiry_date)">{{req.standardDetails?.expiry_date | date:'dd/MM/yyyy'}}</span>
                                            </div>
                                            <div class="px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-1">
                                                <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tồn kho / Vị trí</span>
                                                <div class="text-sm leading-snug">
                                                    <span class="font-black text-slate-700 dark:text-slate-300">{{formatNum(req.standardDetails?.current_amount ?? 0)}}{{req.standardDetails?.unit}}</span>
                                                    <span class="text-slate-400 mx-1">•</span>
                                                    <span class="font-bold text-slate-600 dark:text-slate-400 break-words">{{req.standardDetails?.location || '?'}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            <td class="px-6 py-5">
                                <div class="flex items-start gap-3">
                                    <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 uppercase font-black text-xs shrink-0 border border-placeholder">
                                        {{req.requestedByName.charAt(0)}}
                                    </div>
                                    <div>
                                        <div class="font-black text-slate-700 dark:text-slate-300 text-sm mb-0.5">{{req.requestedByName}}</div>
                                        <div class="text-sm text-slate-500 dark:text-slate-400 font-medium italic line-clamp-1 max-w-[200px]" [title]="req.purpose">{{req.purpose}}</div>
                                        @if(req.totalAmountUsed) {
                                            <div class="mt-2 flex items-center gap-2 bg-rose-50/80 dark:bg-rose-900/10 px-2.5 py-1.5 rounded-xl border border-rose-100/50 dark:border-rose-900/30 w-fit min-w-[120px] shadow-sm justify-between">
                                                <span class="text-[11px] font-black text-rose-500/80 dark:text-rose-400/80 uppercase tracking-widest"><i class="fa-solid fa-droplet mr-1.5"></i>Tổng đã dùng</span>
                                                <span class="text-sm font-black text-rose-600 dark:text-rose-400">{{req.totalAmountUsed}} {{req.standardDetails?.unit || ''}}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <div class="space-y-1.5">
                                    <div class="flex items-center gap-2 text-xs">
                                        <span class="w-12 text-slate-400 dark:text-slate-500 font-black uppercase">Yêu cầu:</span>
                                        <span class="text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">{{req.requestDate | date:'dd/MM/yyyy HH:mm'}}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5 text-center">
                                <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border shadow-sm" [ngClass]="getStatusClass(req.status)">
                                    <i [class]="getStatusIcon(req.status)"></i>
                                    {{getStatusLabel(req.status)}}
                                </div>
                            </td>
                            <td class="px-6 py-5 text-center">
                                <div class="flex flex-col gap-1 items-center">
                                    @if(req.approvedByName) {
                                        <div class="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-black rounded-lg border border-emerald-100/50 dark:border-emerald-800/30 whitespace-nowrap">
                                            <i class="fa-solid fa-stamp mr-1"></i>Duyệt: {{req.approvedByName}}
                                        </div>
                                    }
                                    @if(req.receivedByName) {
                                        <div class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-black rounded-lg border border-blue-100/50 dark:border-blue-800/30 whitespace-nowrap">
                                            <i class="fa-solid fa-check-double mr-1"></i>Nhận: {{req.receivedByName}}
                                        </div>
                                    }
                                    @if(!req.approvedByName && !req.receivedByName) {
                                        <span class="text-xs text-slate-300 dark:text-slate-600 font-black italic">Trống</span>
                                    }
                                </div>
                            </td>
                            <td class="px-6 py-5 text-center">
                                <!-- Quick Actions -->
                                <div class="flex items-center justify-center gap-1">
                                    @if(req.status === 'PENDING_APPROVAL' && canApproveRequest(req)) {
                                        <button (click)="actionApprove.emit(req)" 
                                                class="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 active:scale-90" 
                                                title="Duyệt & Giao"><i class="fa-solid fa-check"></i></button>
                                        <button (click)="actionReject.emit(req)" 
                                                class="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition active:scale-90" 
                                                title="Từ chối"><i class="fa-solid fa-times"></i></button>
                                    }
                                    @if(req.status === 'IN_PROGRESS') {
                                        @if(isCurrentUser(req.requestedBy)) {
                                            <button (click)="actionLogUsage.emit(req)" 
                                                    class="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-500/20 active:scale-90" 
                                                    title="Ghi nhận dùng"><i class="fa-solid fa-pen-nib"></i></button>
                                            <button (click)="actionReturn.emit({req, isForce: false})" 
                                                    class="p-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-500/20 active:scale-90 ml-1" 
                                                    title="Báo cáo trả"><i class="fa-solid fa-reply"></i></button>
                                        }
                                        @if(canApproveAndNotRequestedBySelf(req)) {
                                            <button (click)="actionReturn.emit({req, isForce: true})" 
                                                    class="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition active:scale-90 ml-1" 
                                                    title="Thu hồi trực tiếp"><i class="fa-solid fa-hand-holding-hand"></i></button>
                                        }
                                    }
                                    @if(req.status === 'PENDING_RETURN') {
                                        @if(isCurrentUser(req.requestedBy)) {
                                            <button (click)="actionUndoReturn.emit(req)" 
                                                    class="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition shadow-lg shadow-amber-500/20 active:scale-90 mr-1" 
                                                    title="Hủy báo cáo trả và nhập lại"><i class="fa-solid fa-rotate-left"></i></button>
                                        }
                                        @if(canApproveRequest(req)) {
                                            <button (click)="actionAdminReceive.emit(req)" 
                                                    class="px-3 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 active:scale-90 text-xs font-black" 
                                                    title="Tiếp nhận trả"><i class="fa-solid fa-check-to-slot mr-1"></i>NHẬN TRẢ</button>
                                        }
                                    }
                                    @if(req.status === 'COMPLETED' || req.status === 'REJECTED') {
                                        <button class="p-2 text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/50 rounded-xl cursor-default" title="Đã khóa"><i class="fa-solid fa-lock"></i></button>
                                    }
                                    @if(canDeleteRequest(req)) {
                                        <button (click)="actionDelete.emit(req)" 
                                                class="p-2 text-rose-300 hover:text-rose-600 bg-rose-50/50 dark:bg-rose-900/20 rounded-xl transition active:scale-90 ml-1" 
                                                title="Xóa yêu cầu & Hoàn tác tồn kho"><i class="fa-solid fa-trash-can"></i></button>
                                    }
                                </div>
                            </td>
                        </tr>
                    } 
                    @if (requests.length === 0) {
                        <tr>
                            <td colspan="6" class="px-6 py-24 text-center">
                                <div class="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-slate-200 dark:text-slate-800 border-2 border-dashed border-slate-100 dark:border-slate-800">
                                    <i class="fa-solid fa-box-open text-3xl"></i>
                                </div>
                                <p class="text-slate-400 dark:text-slate-500 font-black uppercase text-sm tracking-[0.2em]">Không tìm thấy yêu cầu nào</p>
                            </td>
                        </tr> 
                    }
                }
            </tbody>
        </table>
    </div>
    @if (!isLoading && requests.length > 0) {
        <div class="shrink-0 border-t border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs" data-testid="request-table-footer">
            <span class="font-bold text-slate-500 dark:text-slate-400">
                Đang hiển thị <strong class="text-slate-700 dark:text-slate-200">{{visibleRequests().length}}</strong>/<strong class="text-slate-700 dark:text-slate-200">{{requests.length}}</strong> yêu cầu
            </span>
            @if (requests.length > visibleRequests().length) {
                <button type="button" (click)="loadMore()" class="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition" data-testid="request-table-more">
                    <i class="fa-solid fa-angles-down mr-1"></i>
                    Xem thêm {{Math.min(tableLimitStep, requests.length - visibleRequests().length)}} dòng
                    <span class="font-bold opacity-70">(còn {{requests.length - visibleRequests().length}})</span>
                </button>
            } @else {
                <span class="text-emerald-600 dark:text-emerald-400 font-black"><i class="fa-solid fa-check mr-1"></i>Đã hiển thị toàn bộ</span>
            }
        </div>
    }
  `
            }]
    }], null, { requests: [{
            type: Input
        }], isLoading: [{
            type: Input
        }], navigateToStandard: [{
            type: Output
        }], actionApprove: [{
            type: Output
        }], actionReject: [{
            type: Output
        }], actionLogUsage: [{
            type: Output
        }], actionReturn: [{
            type: Output
        }], actionUndoReturn: [{
            type: Output
        }], actionAdminReceive: [{
            type: Output
        }], actionDelete: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RequestsTableComponent, { className: "RequestsTableComponent", filePath: "src/app/features/standards/requests/components/requests-table.component.ts", lineNumber: 214 }); })();
//# sourceMappingURL=requests-table.component.js.map