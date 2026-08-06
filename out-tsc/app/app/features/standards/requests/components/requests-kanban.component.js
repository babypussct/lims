import { Component, Input, Output, EventEmitter, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { formatNum } from '../../../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = a0 => ({ $implicit: a0 });
const _c1 = a0 => ({ hidden: a0 });
const _forTrack0 = ($index, $item) => $item.id;
function RequestsKanbanComponent_Conditional_5_For_10_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function RequestsKanbanComponent_Conditional_5_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsKanbanComponent_Conditional_5_For_10_ng_container_0_Template, 1, 0, "ng-container", 15);
} if (rf & 2) {
    const req_r1 = ctx.$implicit;
    i0.ɵɵnextContext(2);
    const cardTemplate_r2 = i0.ɵɵreference(12);
    i0.ɵɵproperty("ngTemplateOutlet", cardTemplate_r2)("ngTemplateOutletContext", i0.ɵɵpureFunction1(2, _c0, req_r1));
} }
function RequestsKanbanComponent_Conditional_5_Conditional_11_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function RequestsKanbanComponent_Conditional_5_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsKanbanComponent_Conditional_5_Conditional_11_ng_container_0_Template, 1, 0, "ng-container", 15);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    const showMoreTemplate_r4 = i0.ɵɵreference(10);
    i0.ɵɵproperty("ngTemplateOutlet", showMoreTemplate_r4)("ngTemplateOutletContext", i0.ɵɵpureFunction1(2, _c1, ctx_r2.pendingApprovalReqs().length - ctx_r2.visiblePendingApprovalReqs().length));
} }
function RequestsKanbanComponent_Conditional_5_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵtext(1, "Kh\u00F4ng c\u00F3 y\u00EAu c\u1EA7u");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 8)(2, "div", 9);
    i0.ɵɵelement(3, "div", 10);
    i0.ɵɵelementStart(4, "h3", 11);
    i0.ɵɵtext(5, "Ch\u1EDD Duy\u1EC7t");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "span", 12);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 13);
    i0.ɵɵrepeaterCreate(9, RequestsKanbanComponent_Conditional_5_For_10_Template, 1, 4, "ng-container", null, _forTrack0);
    i0.ɵɵtemplate(11, RequestsKanbanComponent_Conditional_5_Conditional_11_Template, 1, 4, "ng-container")(12, RequestsKanbanComponent_Conditional_5_Conditional_12_Template, 2, 0, "div", 14);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r2.pendingApprovalReqs().length);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.visiblePendingApprovalReqs());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.pendingApprovalReqs().length > ctx_r2.visiblePendingApprovalReqs().length ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.pendingApprovalReqs().length === 0 ? 12 : -1);
} }
function RequestsKanbanComponent_Conditional_6_For_10_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function RequestsKanbanComponent_Conditional_6_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsKanbanComponent_Conditional_6_For_10_ng_container_0_Template, 1, 0, "ng-container", 15);
} if (rf & 2) {
    const req_r5 = ctx.$implicit;
    i0.ɵɵnextContext(2);
    const cardTemplate_r2 = i0.ɵɵreference(12);
    i0.ɵɵproperty("ngTemplateOutlet", cardTemplate_r2)("ngTemplateOutletContext", i0.ɵɵpureFunction1(2, _c0, req_r5));
} }
function RequestsKanbanComponent_Conditional_6_Conditional_11_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function RequestsKanbanComponent_Conditional_6_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsKanbanComponent_Conditional_6_Conditional_11_ng_container_0_Template, 1, 0, "ng-container", 15);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    const showMoreTemplate_r4 = i0.ɵɵreference(10);
    i0.ɵɵproperty("ngTemplateOutlet", showMoreTemplate_r4)("ngTemplateOutletContext", i0.ɵɵpureFunction1(2, _c1, ctx_r2.inProgressReqs().length - ctx_r2.visibleInProgressReqs().length));
} }
function RequestsKanbanComponent_Conditional_6_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵtext(1, "Kh\u00F4ng c\u00F3 y\u00EAu c\u1EA7u");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 16)(2, "div", 9);
    i0.ɵɵelement(3, "div", 17);
    i0.ɵɵelementStart(4, "h3", 18);
    i0.ɵɵtext(5, "\u0110ang D\u00F9ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "span", 19);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 13);
    i0.ɵɵrepeaterCreate(9, RequestsKanbanComponent_Conditional_6_For_10_Template, 1, 4, "ng-container", null, _forTrack0);
    i0.ɵɵtemplate(11, RequestsKanbanComponent_Conditional_6_Conditional_11_Template, 1, 4, "ng-container")(12, RequestsKanbanComponent_Conditional_6_Conditional_12_Template, 2, 0, "div", 14);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r2.inProgressReqs().length);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.visibleInProgressReqs());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.inProgressReqs().length > ctx_r2.visibleInProgressReqs().length ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.inProgressReqs().length === 0 ? 12 : -1);
} }
function RequestsKanbanComponent_Conditional_7_For_10_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function RequestsKanbanComponent_Conditional_7_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsKanbanComponent_Conditional_7_For_10_ng_container_0_Template, 1, 0, "ng-container", 15);
} if (rf & 2) {
    const req_r6 = ctx.$implicit;
    i0.ɵɵnextContext(2);
    const cardTemplate_r2 = i0.ɵɵreference(12);
    i0.ɵɵproperty("ngTemplateOutlet", cardTemplate_r2)("ngTemplateOutletContext", i0.ɵɵpureFunction1(2, _c0, req_r6));
} }
function RequestsKanbanComponent_Conditional_7_Conditional_11_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function RequestsKanbanComponent_Conditional_7_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsKanbanComponent_Conditional_7_Conditional_11_ng_container_0_Template, 1, 0, "ng-container", 15);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    const showMoreTemplate_r4 = i0.ɵɵreference(10);
    i0.ɵɵproperty("ngTemplateOutlet", showMoreTemplate_r4)("ngTemplateOutletContext", i0.ɵɵpureFunction1(2, _c1, ctx_r2.pendingReturnReqs().length - ctx_r2.visiblePendingReturnReqs().length));
} }
function RequestsKanbanComponent_Conditional_7_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵtext(1, "Kh\u00F4ng c\u00F3 y\u00EAu c\u1EA7u");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 20)(2, "div", 9);
    i0.ɵɵelement(3, "div", 21);
    i0.ɵɵelementStart(4, "h3", 22);
    i0.ɵɵtext(5, "Ch\u1EDD Nh\u1EADn Tr\u1EA3");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "span", 23);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 13);
    i0.ɵɵrepeaterCreate(9, RequestsKanbanComponent_Conditional_7_For_10_Template, 1, 4, "ng-container", null, _forTrack0);
    i0.ɵɵtemplate(11, RequestsKanbanComponent_Conditional_7_Conditional_11_Template, 1, 4, "ng-container")(12, RequestsKanbanComponent_Conditional_7_Conditional_12_Template, 2, 0, "div", 14);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r2.pendingReturnReqs().length);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.visiblePendingReturnReqs());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.pendingReturnReqs().length > ctx_r2.visiblePendingReturnReqs().length ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.pendingReturnReqs().length === 0 ? 12 : -1);
} }
function RequestsKanbanComponent_Conditional_8_For_10_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function RequestsKanbanComponent_Conditional_8_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsKanbanComponent_Conditional_8_For_10_ng_container_0_Template, 1, 0, "ng-container", 15);
} if (rf & 2) {
    const req_r7 = ctx.$implicit;
    i0.ɵɵnextContext(2);
    const cardTemplate_r2 = i0.ɵɵreference(12);
    i0.ɵɵproperty("ngTemplateOutlet", cardTemplate_r2)("ngTemplateOutletContext", i0.ɵɵpureFunction1(2, _c0, req_r7));
} }
function RequestsKanbanComponent_Conditional_8_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28)(1, "span", 29);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 30);
    i0.ɵɵtext(4, "H\u00E3y d\u00F9ng t\u00EDnh n\u0103ng C\u1ED9t Table ho\u1EB7c T\u00ECm ki\u1EBFm \u0111\u1EC3 tra c\u1EE9u th\u1EBB c\u0169.");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \u0110ang \u1EA9n ", ctx_r2.completedReqs().length - 30, " th\u1EBB c\u0169 ");
} }
function RequestsKanbanComponent_Conditional_8_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵtext(1, "Kh\u00F4ng c\u00F3 y\u00EAu c\u1EA7u");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7)(1, "div", 24)(2, "div", 9);
    i0.ɵɵelement(3, "div", 25);
    i0.ɵɵelementStart(4, "h3", 26);
    i0.ɵɵtext(5, "\u0110\u00E3 Ho\u00E0n T\u1EA5t");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "span", 27);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 13);
    i0.ɵɵrepeaterCreate(9, RequestsKanbanComponent_Conditional_8_For_10_Template, 1, 4, "ng-container", null, _forTrack0);
    i0.ɵɵtemplate(11, RequestsKanbanComponent_Conditional_8_Conditional_11_Template, 5, 1, "div", 28)(12, RequestsKanbanComponent_Conditional_8_Conditional_12_Template, 2, 0, "div", 14);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r2.completedReqs().length);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.limitedCompletedReqs());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.completedReqs().length > 30 ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.completedReqs().length === 0 ? 12 : -1);
} }
function RequestsKanbanComponent_ng_template_9_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 31);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showMoreCards()); });
    i0.ɵɵelement(1, "i", 32);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const hidden_r9 = ctx.hidden;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Xem th\u00EAm \u2014 c\u00F2n ", hidden_r9, " th\u1EBB ");
} }
function RequestsKanbanComponent_ng_template_11_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 39);
    i0.ɵɵtext(1, "Nh\u1EADp b\u00F9");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_ng_template_11_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 48);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const req_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(req_r11.standardDetails.internal_id);
} }
function RequestsKanbanComponent_ng_template_11_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 52)(1, "span", 56);
    i0.ɵɵelement(2, "i", 57);
    i0.ɵɵtext(3, "T\u1ED5ng \u0111\u00E3 d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 58);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const req_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum(req_r11.totalAmountUsed), " ", (req_r11.standardDetails == null ? null : req_r11.standardDetails.unit) || "", "");
} }
function RequestsKanbanComponent_ng_template_11_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 59);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_11_Conditional_42_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const req_r11 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.actionApprove.emit(req_r11)); });
    i0.ɵɵelement(1, "i", 60);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 61);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_11_Conditional_42_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r12); const req_r11 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.actionReject.emit(req_r11)); });
    i0.ɵɵelement(3, "i", 62);
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_ng_template_11_Conditional_43_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 64);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_11_Conditional_43_Conditional_0_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const req_r11 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.actionLogUsage.emit(req_r11)); });
    i0.ɵɵelement(1, "i", 65);
    i0.ɵɵtext(2, " GHI NH\u1EACN");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 66);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_11_Conditional_43_Conditional_0_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r13); const req_r11 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.actionReturn.emit({ req: req_r11, isForce: false })); });
    i0.ɵɵelement(4, "i", 67);
    i0.ɵɵtext(5, " B\u00C1O TR\u1EA2");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_ng_template_11_Conditional_43_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 68);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_11_Conditional_43_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r14); const req_r11 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.actionReturn.emit({ req: req_r11, isForce: true })); });
    i0.ɵɵelement(1, "i", 69);
    i0.ɵɵtext(2, " THU H\u1ED2I");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_ng_template_11_Conditional_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsKanbanComponent_ng_template_11_Conditional_43_Conditional_0_Template, 6, 0)(1, RequestsKanbanComponent_ng_template_11_Conditional_43_Conditional_1_Template, 3, 0, "button", 63);
} if (rf & 2) {
    const req_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r2.isCurrentUser(req_r11.requestedBy) ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canApproveAndNotRequestedBySelf(req_r11) ? 1 : -1);
} }
function RequestsKanbanComponent_ng_template_11_Conditional_44_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 72);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_11_Conditional_44_Conditional_0_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r15); const req_r11 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.actionUndoReturn.emit(req_r11)); });
    i0.ɵɵelement(1, "i", 73);
    i0.ɵɵtext(2, " H\u1EE6Y B\u00C1O C\u00C1O");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_ng_template_11_Conditional_44_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 74);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_11_Conditional_44_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r16); const req_r11 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.actionAdminReceive.emit(req_r11)); });
    i0.ɵɵelement(1, "i", 75);
    i0.ɵɵtext(2, " NH\u1EACN TR\u1EA2");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_ng_template_11_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, RequestsKanbanComponent_ng_template_11_Conditional_44_Conditional_0_Template, 3, 0, "button", 70)(1, RequestsKanbanComponent_ng_template_11_Conditional_44_Conditional_1_Template, 3, 0, "button", 71);
} if (rf & 2) {
    const req_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r2.isCurrentUser(req_r11.requestedBy) ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canApproveRequest(req_r11) ? 1 : -1);
} }
function RequestsKanbanComponent_ng_template_11_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 54);
    i0.ɵɵelement(1, "i", 76);
    i0.ɵɵtext(2, " \u0110\u00E3 kh\u00F3a");
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_ng_template_11_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 77);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_11_Conditional_46_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r17); const req_r11 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.actionDelete.emit(req_r11)); });
    i0.ɵɵelement(1, "i", 78);
    i0.ɵɵelementEnd();
} }
function RequestsKanbanComponent_ng_template_11_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 33)(1, "div", 34)(2, "div", 9)(3, "div", 35);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 36)(6, "span", 37);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span", 38);
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "date");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(11, RequestsKanbanComponent_ng_template_11_Conditional_11_Template, 2, 0, "span", 39);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div")(13, "h4", 40);
    i0.ɵɵlistener("click", function RequestsKanbanComponent_ng_template_11_Template_h4_click_13_listener($event) { const req_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r2 = i0.ɵɵnextContext(); ctx_r2.navigateToStandard.emit(req_r11.standardId); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "p", 41);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 42)(18, "div", 36)(19, "span", 43);
    i0.ɵɵtext(20, "S\u1ED1 L\u00F4 (LOT)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 44);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 36)(24, "span", 43);
    i0.ɵɵtext(25, "H\u1EA1n d\u00F9ng (EXP)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "span", 45);
    i0.ɵɵtext(27);
    i0.ɵɵpipe(28, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "div", 46)(30, "span", 43);
    i0.ɵɵtext(31, "Kho / V\u1ECB tr\u00ED");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 47);
    i0.ɵɵtemplate(33, RequestsKanbanComponent_ng_template_11_Conditional_33_Template, 2, 1, "span", 48);
    i0.ɵɵelementStart(34, "span", 49);
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "span", 50);
    i0.ɵɵtext(37, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "span", 51);
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(40, RequestsKanbanComponent_ng_template_11_Conditional_40_Template, 6, 2, "div", 52);
    i0.ɵɵelementStart(41, "div", 53);
    i0.ɵɵtemplate(42, RequestsKanbanComponent_ng_template_11_Conditional_42_Template, 4, 0)(43, RequestsKanbanComponent_ng_template_11_Conditional_43_Template, 2, 2)(44, RequestsKanbanComponent_ng_template_11_Conditional_44_Template, 2, 2)(45, RequestsKanbanComponent_ng_template_11_Conditional_45_Template, 3, 0, "div", 54)(46, RequestsKanbanComponent_ng_template_11_Conditional_46_Template, 2, 0, "button", 55);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_15_0;
    const req_r11 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", req_r11.requestedByName.charAt(0), " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(req_r11.requestedByName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(10, 21, req_r11.requestDate, "dd/MM/yyyy HH:mm"));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(req_r11.isBackfill ? 11 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(req_r11.standardName);
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", req_r11.purpose);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(req_r11.purpose);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(req_r11.lotNumber || "N/A");
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("text-rose-500", ctx_r2.isExpOverdue(req_r11.standardDetails == null ? null : req_r11.standardDetails.expiry_date));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(28, 24, req_r11.standardDetails == null ? null : req_r11.standardDetails.expiry_date, "dd/MM/yyyy" || "N/A"));
    i0.ɵɵadvance(6);
    i0.ɵɵconditional((req_r11.standardDetails == null ? null : req_r11.standardDetails.internal_id) ? 33 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum((tmp_15_0 = req_r11.standardDetails == null ? null : req_r11.standardDetails.current_amount) !== null && tmp_15_0 !== undefined ? tmp_15_0 : 0), "", req_r11.standardDetails == null ? null : req_r11.standardDetails.unit, "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate((req_r11.standardDetails == null ? null : req_r11.standardDetails.location) || "?");
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r11.totalAmountUsed ? 40 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(req_r11.status === "PENDING_APPROVAL" && ctx_r2.canApproveRequest(req_r11) ? 42 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r11.status === "IN_PROGRESS" ? 43 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r11.status === "PENDING_RETURN" ? 44 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(req_r11.status === "COMPLETED" || req_r11.status === "REJECTED" ? 45 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canDeleteRequest(req_r11) ? 46 : -1);
} }
export class RequestsKanbanComponent {
    constructor() {
        this.auth = inject(AuthService);
        this._requests = signal([]);
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
        this.currentFilter = 'ALL';
        this.cardLimit = signal(60);
        this.pendingApprovalReqs = computed(() => this._requests().filter(r => r.status === 'PENDING_APPROVAL'));
        this.inProgressReqs = computed(() => this._requests().filter(r => r.status === 'IN_PROGRESS'));
        this.pendingReturnReqs = computed(() => this._requests().filter(r => r.status === 'PENDING_RETURN'));
        this.completedReqs = computed(() => this._requests().filter(r => ['COMPLETED', 'REJECTED'].includes(r.status)));
        this.visiblePendingApprovalReqs = computed(() => this.pendingApprovalReqs().slice(0, this.cardLimit()));
        this.visibleInProgressReqs = computed(() => this.inProgressReqs().slice(0, this.cardLimit()));
        this.visiblePendingReturnReqs = computed(() => this.pendingReturnReqs().slice(0, this.cardLimit()));
        // Chỉ lấy 30 thẻ hoàn tất mới nhất (sắp xếp descending by returnDate / updatedAt)
        this.limitedCompletedReqs = computed(() => {
            const sorted = [...this.completedReqs()].sort((a, b) => {
                const timeA = a.returnDate || a.updatedAt || a.requestDate || 0;
                const timeB = b.returnDate || b.updatedAt || b.requestDate || 0;
                return timeB - timeA;
            });
            return sorted.slice(0, 30);
        });
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
        this._requests.set(value);
    }
    get requests() {
        return this._requests();
    }
    isExpOverdue(expiryDate) {
        if (!expiryDate)
            return false;
        return new Date(expiryDate).getTime() < Date.now();
    }
    showMoreCards() {
        this.cardLimit.update(limit => limit + 60);
    }
    static { this.ɵfac = function RequestsKanbanComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RequestsKanbanComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RequestsKanbanComponent, selectors: [["app-requests-kanban"]], inputs: { requests: "requests", currentFilter: "currentFilter" }, outputs: { navigateToStandard: "navigateToStandard", actionApprove: "actionApprove", actionReject: "actionReject", actionLogUsage: "actionLogUsage", actionReturn: "actionReturn", actionUndoReturn: "actionUndoReturn", actionAdminReceive: "actionAdminReceive", actionDelete: "actionDelete" }, decls: 13, vars: 4, consts: [["showMoreTemplate", ""], ["cardTemplate", ""], [1, "md:hidden", "flex", "items-center", "justify-center", "gap-1.5", "py-1.5", "text-slate-400"], [1, "fa-solid", "fa-left-right", "text-xs"], [1, "text-xs", "font-bold", "uppercase", "tracking-widest"], [1, "kanban-board", "custom-scrollbar"], [1, "kanban-col", "bg-slate-50/50", "dark:bg-slate-800/20", "rounded-[2rem]", "border", "border-slate-100", "dark:border-slate-800/50", "shadow-sm", "overflow-hidden"], [1, "kanban-col", "bg-slate-50/50", "dark:bg-slate-800/20", "rounded-[2rem]", "border", "border-slate-100", "dark:border-slate-800/50", "overflow-hidden", "opacity-80", "hover:opacity-100", "transition-opacity"], [1, "p-3", "sm:p-4", "border-b", "border-slate-100", "dark:border-slate-800/50", "flex", "items-center", "justify-between", "bg-amber-50/50", "dark:bg-amber-900/10", "shrink-0"], [1, "flex", "items-center", "gap-2"], [1, "w-2", "h-2", "rounded-full", "bg-amber-500", "animate-pulse"], [1, "font-black", "text-amber-700", "dark:text-amber-500", "text-base"], [1, "px-2", "py-0.5", "bg-amber-100", "dark:bg-amber-900/30", "text-amber-700", "dark:text-amber-500", "rounded-lg", "text-sm", "font-black"], [1, "flex-1", "overflow-y-auto", "p-2", "sm:p-3", "space-y-2", "sm:space-y-3", "custom-scrollbar"], [1, "p-6", "text-center", "text-slate-400", "text-sm", "font-bold", "italic", "border-2", "border-dashed", "border-slate-200", "dark:border-slate-700", "rounded-2xl"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "p-3", "sm:p-4", "border-b", "border-slate-100", "dark:border-slate-800/50", "flex", "items-center", "justify-between", "bg-emerald-50/50", "dark:bg-emerald-900/10", "shrink-0"], [1, "w-2", "h-2", "rounded-full", "bg-emerald-500"], [1, "font-black", "text-emerald-700", "dark:text-emerald-500", "text-base"], [1, "px-2", "py-0.5", "bg-emerald-100", "dark:bg-emerald-900/30", "text-emerald-700", "dark:text-emerald-500", "rounded-lg", "text-sm", "font-black"], [1, "p-3", "sm:p-4", "border-b", "border-slate-100", "dark:border-slate-800/50", "flex", "items-center", "justify-between", "bg-indigo-50/50", "dark:bg-indigo-900/10", "shrink-0"], [1, "w-2", "h-2", "rounded-full", "bg-indigo-500", "animate-pulse"], [1, "font-black", "text-indigo-700", "dark:text-indigo-400", "text-base"], [1, "px-2", "py-0.5", "bg-indigo-100", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-400", "rounded-lg", "text-sm", "font-black"], [1, "p-3", "sm:p-4", "border-b", "border-slate-100", "dark:border-slate-800/50", "flex", "items-center", "justify-between", "bg-slate-100", "dark:bg-slate-800/50", "shrink-0"], [1, "w-2", "h-2", "rounded-full", "bg-slate-400"], [1, "font-black", "text-slate-600", "dark:text-slate-400", "text-base"], [1, "px-2", "py-0.5", "bg-slate-200", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-400", "rounded-lg", "text-sm", "font-black"], [1, "p-4", "text-center"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-widest", "bg-slate-100", "dark:bg-slate-800/50", "px-3", "py-1.5", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "block"], [1, "text-[11px]", "text-slate-400", "mt-2", "italic"], ["type", "button", 1, "w-full", "rounded-2xl", "border", "border-dashed", "border-indigo-200", "dark:border-indigo-800", "bg-indigo-50/60", "dark:bg-indigo-900/20", "px-3", "py-3", "text-xs", "font-black", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/40", "transition", 3, "click"], [1, "fa-solid", "fa-angles-down", "mr-1"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "p-4", "shadow-sm", "hover:shadow-md", "border", "border-slate-100", "dark:border-slate-800", "transition-all", "duration-300", "flex", "flex-col", "gap-3", "group", "relative", "cursor-default", "hover:-translate-y-1", "hover:border-indigo-200", "dark:hover:border-indigo-800/50"], [1, "flex", "justify-between", "items-start", "gap-2"], [1, "w-7", "h-7", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "flex", "items-center", "justify-center", "text-slate-500", "uppercase", "font-black", "text-xs", "shrink-0", "border", "border-slate-200", "dark:border-slate-700"], [1, "flex", "flex-col"], [1, "font-black", "text-slate-700", "dark:text-slate-200", "text-sm"], [1, "text-[11px]", "text-slate-400", "font-bold"], [1, "px-2", "py-0.5", "rounded-md", "bg-purple-100", "dark:bg-purple-900/30", "text-purple-700", "dark:text-purple-300", "border", "border-purple-200", "dark:border-purple-800", "text-[9px]", "font-black", "uppercase", "tracking-wider", "whitespace-nowrap"], [1, "font-black", "text-base", "text-slate-800", "dark:text-slate-100", "leading-tight", "mb-1", "cursor-pointer", "hover:text-indigo-600", "dark:hover:text-indigo-400", "hover:underline", "transition-colors", 3, "click"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "font-medium", "italic", "line-clamp-2", 3, "title"], [1, "grid", "grid-cols-2", "gap-1.5", "mt-1", "bg-slate-50/50", "dark:bg-slate-800/30", "p-2", "rounded-xl", "border", "border-slate-100/50", "dark:border-slate-800/50"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "text-xs", "font-bold", "text-blue-600", "dark:text-blue-400", "truncate"], [1, "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "truncate"], [1, "flex", "flex-col", "col-span-2", "mt-1"], [1, "text-xs", "leading-snug", "flex", "items-center", "flex-wrap", "gap-x-1"], [1, "px-2", "py-0.5", "bg-indigo-100", "dark:bg-indigo-900/40", "text-indigo-700", "dark:text-indigo-300", "rounded-md", "font-black", "text-xs", "border", "border-indigo-200", "dark:border-indigo-700", "shadow-sm", "shrink-0", "uppercase"], [1, "font-black", "text-slate-700", "dark:text-slate-300"], [1, "text-slate-400"], [1, "font-bold", "text-slate-600", "dark:text-slate-400", "break-words"], [1, "flex", "items-center", "justify-between", "gap-2", "bg-rose-50/80", "dark:bg-rose-900/10", "px-3", "py-2", "rounded-xl", "border", "border-rose-100/80", "dark:border-rose-900/40", "mt-1", "shadow-sm"], [1, "flex", "items-center", "justify-end", "gap-1", "mt-1", "pt-2", "border-t", "border-slate-100", "dark:border-slate-800/50"], [1, "text-[11px]", "font-bold", "text-slate-400", "flex", "items-center", "gap-1", "px-1"], ["title", "X\u00F3a y\u00EAu c\u1EA7u", 1, "p-1.5", "text-rose-300", "hover:text-rose-600", "hover:bg-rose-50", "dark:hover:bg-rose-900/20", "rounded-lg", "transition", "active:scale-95", "ml-auto"], [1, "text-xs", "font-black", "tracking-widest", "text-rose-500/80", "dark:text-rose-400/80", "uppercase"], [1, "fa-solid", "fa-droplet", "mr-1.5"], [1, "text-sm", "font-black", "text-rose-600", "dark:text-rose-400"], ["title", "Duy\u1EC7t & Giao", 1, "p-1.5", "bg-emerald-600", "text-white", "rounded-lg", "hover:bg-emerald-700", "transition", "shadow-sm", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-check", "text-xs"], ["title", "T\u1EEB ch\u1ED1i", 1, "p-1.5", "bg-rose-100", "text-rose-600", "rounded-lg", "hover:bg-rose-200", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-times", "text-xs"], ["title", "Thu h\u1ED3i tr\u1EF1c ti\u1EBFp", 1, "px-2", "py-1", "bg-slate-100", "text-slate-600", "rounded-lg", "hover:bg-slate-200", "transition", "active:scale-95", "text-[11px]", "font-bold"], ["title", "Ghi nh\u1EADn d\u00F9ng", 1, "px-2", "py-1", "bg-teal-600", "text-white", "rounded-lg", "hover:bg-teal-700", "transition", "shadow-sm", "active:scale-95", "text-[11px]", "font-bold", 3, "click"], [1, "fa-solid", "fa-pen-nib", "mr-1"], ["title", "B\u00E1o c\u00E1o tr\u1EA3", 1, "px-2", "py-1", "bg-amber-500", "text-white", "rounded-lg", "hover:bg-amber-600", "transition", "shadow-sm", "active:scale-95", "text-[11px]", "font-bold", 3, "click"], [1, "fa-solid", "fa-reply", "mr-1"], ["title", "Thu h\u1ED3i tr\u1EF1c ti\u1EBFp", 1, "px-2", "py-1", "bg-slate-100", "text-slate-600", "rounded-lg", "hover:bg-slate-200", "transition", "active:scale-95", "text-[11px]", "font-bold", 3, "click"], [1, "fa-solid", "fa-hand-holding-hand", "mr-1"], ["title", "H\u1EE7y b\u00E1o c\u00E1o tr\u1EA3 v\u00E0 nh\u1EADp l\u1EA1i", 1, "px-2", "py-1", "bg-amber-50", "text-amber-600", "border", "border-amber-200", "dark:bg-amber-900/20", "dark:border-amber-800/30", "rounded-lg", "hover:bg-amber-100", "dark:hover:bg-amber-900/40", "transition", "shadow-sm", "active:scale-95", "text-[11px]", "font-bold", "mr-1"], [1, "px-2", "py-1", "bg-indigo-600", "text-white", "rounded-lg", "hover:bg-indigo-700", "transition", "shadow-sm", "active:scale-95", "text-[11px]", "font-bold"], ["title", "H\u1EE7y b\u00E1o c\u00E1o tr\u1EA3 v\u00E0 nh\u1EADp l\u1EA1i", 1, "px-2", "py-1", "bg-amber-50", "text-amber-600", "border", "border-amber-200", "dark:bg-amber-900/20", "dark:border-amber-800/30", "rounded-lg", "hover:bg-amber-100", "dark:hover:bg-amber-900/40", "transition", "shadow-sm", "active:scale-95", "text-[11px]", "font-bold", "mr-1", 3, "click"], [1, "fa-solid", "fa-rotate-left", "mr-1"], [1, "px-2", "py-1", "bg-indigo-600", "text-white", "rounded-lg", "hover:bg-indigo-700", "transition", "shadow-sm", "active:scale-95", "text-[11px]", "font-bold", 3, "click"], [1, "fa-solid", "fa-check-to-slot", "mr-1"], [1, "fa-solid", "fa-lock"], ["title", "X\u00F3a y\u00EAu c\u1EA7u", 1, "p-1.5", "text-rose-300", "hover:text-rose-600", "hover:bg-rose-50", "dark:hover:bg-rose-900/20", "rounded-lg", "transition", "active:scale-95", "ml-auto", 3, "click"], [1, "fa-solid", "fa-trash-can", "text-xs"]], template: function RequestsKanbanComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 2);
            i0.ɵɵelement(1, "i", 3);
            i0.ɵɵelementStart(2, "span", 4);
            i0.ɵɵtext(3, "Vu\u1ED1t ngang \u0111\u1EC3 xem t\u1EA5t c\u1EA3 c\u1ED9t");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(4, "div", 5);
            i0.ɵɵtemplate(5, RequestsKanbanComponent_Conditional_5_Template, 13, 3, "div", 6)(6, RequestsKanbanComponent_Conditional_6_Template, 13, 3, "div", 6)(7, RequestsKanbanComponent_Conditional_7_Template, 13, 3, "div", 6)(8, RequestsKanbanComponent_Conditional_8_Template, 13, 3, "div", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(9, RequestsKanbanComponent_ng_template_9_Template, 3, 1, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor)(11, RequestsKanbanComponent_ng_template_11_Template, 47, 27, "ng-template", null, 1, i0.ɵɵtemplateRefExtractor);
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.currentFilter === "ALL" || ctx.currentFilter === "PENDING_APPROVAL" ? 5 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.currentFilter === "ALL" || ctx.currentFilter === "IN_PROGRESS" ? 6 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.currentFilter === "ALL" || ctx.currentFilter === "PENDING_RETURN" ? 7 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.currentFilter === "ALL" || ctx.currentFilter === "COMPLETED" ? 8 : -1);
        } }, dependencies: [CommonModule, i1.NgTemplateOutlet, i1.DatePipe], styles: [".kanban-board[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 1rem;\n      height: 100%;\n      padding: 0.5rem;\n      overflow-x: auto;\n      align-items: stretch;\n      position: relative;\n      min-height: 500px;\n      -webkit-overflow-scrolling: touch;\n    }\n    .kanban-col[_ngcontent-%COMP%] {\n      flex: 1;\n      min-width: 300px;\n      max-width: 380px;\n      display: flex;\n      flex-direction: column;\n      overflow: hidden;\n    }\n    \n\n    @media (max-width: 767px) {\n      .kanban-board[_ngcontent-%COMP%] {\n        scroll-snap-type: x mandatory;\n        padding: 0.5rem 1rem;\n        gap: 0.75rem;\n        align-items: stretch;\n      }\n      .kanban-col[_ngcontent-%COMP%] {\n        scroll-snap-align: start;\n        flex: 0 0 calc(100vw - 3rem);\n        min-width: unset;\n        max-width: unset;\n        height: auto;\n        max-height: calc(100vh - 220px);\n      }\n    }\n    \n\n    @media (min-width: 768px) and (max-width: 1023px) {\n      .kanban-board[_ngcontent-%COMP%] {\n        scroll-snap-type: x mandatory;\n        padding: 0.5rem 0.75rem;\n        gap: 0.75rem;\n      }\n      .kanban-col[_ngcontent-%COMP%] {\n        scroll-snap-align: start;\n        flex: 0 0 calc(50vw - 1.5rem);\n        min-width: unset;\n        max-width: unset;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RequestsKanbanComponent, [{
        type: Component,
        args: [{ selector: 'app-requests-kanban', standalone: true, imports: [CommonModule], template: `
    <!-- Mobile swipe hint -->
    <div class="md:hidden flex items-center justify-center gap-1.5 py-1.5 text-slate-400">
      <i class="fa-solid fa-left-right text-xs"></i>
      <span class="text-xs font-bold uppercase tracking-widest">Vuốt ngang để xem tất cả cột</span>
    </div>

    <div class="kanban-board custom-scrollbar">
      
      <!-- COLUMN 1: PENDING_APPROVAL -->
      @if (currentFilter === 'ALL' || currentFilter === 'PENDING_APPROVAL') {
      <div class="kanban-col bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div class="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-amber-50/50 dark:bg-amber-900/10 shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <h3 class="font-black text-amber-700 dark:text-amber-500 text-base">Chờ Duyệt</h3>
          </div>
          <span class="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-lg text-sm font-black">{{ pendingApprovalReqs().length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 custom-scrollbar">
          @for (req of visiblePendingApprovalReqs(); track req.id) {
            <ng-container *ngTemplateOutlet="cardTemplate; context: { $implicit: req }"></ng-container>
          }
          @if (pendingApprovalReqs().length > visiblePendingApprovalReqs().length) {
            <ng-container *ngTemplateOutlet="showMoreTemplate; context: { hidden: pendingApprovalReqs().length - visiblePendingApprovalReqs().length }"></ng-container>
          }
          @if (pendingApprovalReqs().length === 0) {
            <div class="p-6 text-center text-slate-400 text-sm font-bold italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">Không có yêu cầu</div>
          }
        </div>
      </div>
      }

      <!-- COLUMN 2: IN_PROGRESS -->
      @if (currentFilter === 'ALL' || currentFilter === 'IN_PROGRESS') {
      <div class="kanban-col bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div class="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10 shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h3 class="font-black text-emerald-700 dark:text-emerald-500 text-base">Đang Dùng</h3>
          </div>
          <span class="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500 rounded-lg text-sm font-black">{{ inProgressReqs().length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 custom-scrollbar">
          @for (req of visibleInProgressReqs(); track req.id) {
            <ng-container *ngTemplateOutlet="cardTemplate; context: { $implicit: req }"></ng-container>
          }
          @if (inProgressReqs().length > visibleInProgressReqs().length) {
            <ng-container *ngTemplateOutlet="showMoreTemplate; context: { hidden: inProgressReqs().length - visibleInProgressReqs().length }"></ng-container>
          }
          @if (inProgressReqs().length === 0) {
            <div class="p-6 text-center text-slate-400 text-sm font-bold italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">Không có yêu cầu</div>
          }
        </div>
      </div>
      }

      <!-- COLUMN 3: PENDING_RETURN -->
      @if (currentFilter === 'ALL' || currentFilter === 'PENDING_RETURN') {
      <div class="kanban-col bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div class="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-900/10 shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <h3 class="font-black text-indigo-700 dark:text-indigo-400 text-base">Chờ Nhận Trả</h3>
          </div>
          <span class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-black">{{ pendingReturnReqs().length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 custom-scrollbar">
          @for (req of visiblePendingReturnReqs(); track req.id) {
            <ng-container *ngTemplateOutlet="cardTemplate; context: { $implicit: req }"></ng-container>
          }
          @if (pendingReturnReqs().length > visiblePendingReturnReqs().length) {
            <ng-container *ngTemplateOutlet="showMoreTemplate; context: { hidden: pendingReturnReqs().length - visiblePendingReturnReqs().length }"></ng-container>
          }
          @if (pendingReturnReqs().length === 0) {
            <div class="p-6 text-center text-slate-400 text-sm font-bold italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">Không có yêu cầu</div>
          }
        </div>
      </div>
      }

      <!-- COLUMN 4: COMPLETED / REJECTED -->
      @if (currentFilter === 'ALL' || currentFilter === 'COMPLETED') {
      <div class="kanban-col bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
        <div class="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-100 dark:bg-slate-800/50 shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-slate-400"></div>
            <h3 class="font-black text-slate-600 dark:text-slate-400 text-base">Đã Hoàn Tất</h3>
          </div>
          <span class="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-black">{{ completedReqs().length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 custom-scrollbar">
          @for (req of limitedCompletedReqs(); track req.id) {
            <ng-container *ngTemplateOutlet="cardTemplate; context: { $implicit: req }"></ng-container>
          }
          @if (completedReqs().length > 30) {
            <div class="p-4 text-center">
               <span class="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 block">
                 Đang ẩn {{ completedReqs().length - 30 }} thẻ cũ
               </span>
               <p class="text-[11px] text-slate-400 mt-2 italic">Hãy dùng tính năng Cột Table hoặc Tìm kiếm để tra cứu thẻ cũ.</p>
            </div>
          }
          @if (completedReqs().length === 0) {
            <div class="p-6 text-center text-slate-400 text-sm font-bold italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">Không có yêu cầu</div>
          }
        </div>
      </div>
      }

    </div>

    <ng-template #showMoreTemplate let-hidden="hidden">
      <button type="button"
              (click)="showMoreCards()"
              class="w-full rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-900/20 px-3 py-3 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition">
        <i class="fa-solid fa-angles-down mr-1"></i>
        Xem thêm — còn {{hidden}} thẻ
      </button>
    </ng-template>

    <!-- REUSABLE CARD TEMPLATE -->
    <ng-template #cardTemplate let-req>
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 transition-all duration-300 flex flex-col gap-3 group relative cursor-default hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800/50">
        
        <!-- Header: User & Time -->
        <div class="flex justify-between items-start gap-2">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 uppercase font-black text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                {{req.requestedByName.charAt(0)}}
            </div>
            <div class="flex flex-col">
              <span class="font-black text-slate-700 dark:text-slate-200 text-sm">{{req.requestedByName}}</span>
              <span class="text-[11px] text-slate-400 font-bold">{{req.requestDate | date:'dd/MM/yyyy HH:mm'}}</span>
            </div>
          </div>
          @if(req.isBackfill) {
            <span class="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[9px] font-black uppercase tracking-wider whitespace-nowrap">Nhập bù</span>
          }
        </div>
        
        <!-- Center: Standard Name -->
        <div>
          <h4 class="font-black text-base text-slate-800 dark:text-slate-100 leading-tight mb-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors" (click)="navigateToStandard.emit(req.standardId); $event.stopPropagation()">{{req.standardName}}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium italic line-clamp-2" [title]="req.purpose">{{req.purpose}}</p>
        </div>

        <!-- Detail Grid -->
        <div class="grid grid-cols-2 gap-1.5 mt-1 bg-slate-50/50 dark:bg-slate-800/30 p-2 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
          <div class="flex flex-col">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số Lô (LOT)</span>
              <span class="text-xs font-bold text-blue-600 dark:text-blue-400 truncate">{{req.lotNumber || 'N/A'}}</span>
          </div>
          <div class="flex flex-col">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn dùng (EXP)</span>
              <span class="text-xs font-bold text-slate-600 dark:text-slate-300 truncate" [class.text-rose-500]="isExpOverdue(req.standardDetails?.expiry_date)">{{req.standardDetails?.expiry_date | date:'dd/MM/yyyy' || 'N/A'}}</span>
          </div>
          <div class="flex flex-col col-span-2 mt-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kho / Vị trí</span>
              <div class="text-xs leading-snug flex items-center flex-wrap gap-x-1">
                  @if(req.standardDetails?.internal_id) {
                    <span class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-md font-black text-xs border border-indigo-200 dark:border-indigo-700 shadow-sm shrink-0 uppercase">{{req.standardDetails.internal_id}}</span>
                  }
                  <span class="font-black text-slate-700 dark:text-slate-300">{{formatNum(req.standardDetails?.current_amount ?? 0)}}{{req.standardDetails?.unit}}</span>
                  <span class="text-slate-400">•</span>
                  <span class="font-bold text-slate-600 dark:text-slate-400 break-words">{{req.standardDetails?.location || '?'}}</span>
              </div>
          </div>
        </div>

        <!-- Amount Used Bar (If any) -->
        @if(req.totalAmountUsed) {
          <div class="flex items-center justify-between gap-2 bg-rose-50/80 dark:bg-rose-900/10 px-3 py-2 rounded-xl border border-rose-100/80 dark:border-rose-900/40 mt-1 shadow-sm">
              <span class="text-xs font-black tracking-widest text-rose-500/80 dark:text-rose-400/80 uppercase"><i class="fa-solid fa-droplet mr-1.5"></i>Tổng đã dùng</span>
              <span class="text-sm font-black text-rose-600 dark:text-rose-400">{{formatNum(req.totalAmountUsed)}} {{req.standardDetails?.unit || ''}}</span>
          </div>
        }

        <!-- Actions -->
        <div class="flex items-center justify-end gap-1 mt-1 pt-2 border-t border-slate-100 dark:border-slate-800/50">
          @if(req.status === 'PENDING_APPROVAL' && canApproveRequest(req)) {
              <button (click)="actionApprove.emit(req)" class="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm active:scale-95" title="Duyệt & Giao"><i class="fa-solid fa-check text-xs"></i></button>
              <button (click)="actionReject.emit(req)" class="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition active:scale-95" title="Từ chối"><i class="fa-solid fa-times text-xs"></i></button>
          }
          @if(req.status === 'IN_PROGRESS') {
              @if(isCurrentUser(req.requestedBy)) {
                  <button (click)="actionLogUsage.emit(req)" class="px-2 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm active:scale-95 text-[11px] font-bold" title="Ghi nhận dùng"><i class="fa-solid fa-pen-nib mr-1"></i> GHI NHẬN</button>
                  <button (click)="actionReturn.emit({req: req, isForce: false})" class="px-2 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-sm active:scale-95 text-[11px] font-bold" title="Báo cáo trả"><i class="fa-solid fa-reply mr-1"></i> BÁO TRẢ</button>
              }
              @if(canApproveAndNotRequestedBySelf(req)) {
                  <button (click)="actionReturn.emit({req: req, isForce: true})" class="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition active:scale-95 text-[11px] font-bold" title="Thu hồi trực tiếp"><i class="fa-solid fa-hand-holding-hand mr-1"></i> THU HỒI</button>
              }
          }
          @if(req.status === 'PENDING_RETURN') {
              @if(isCurrentUser(req.requestedBy)) {
                  <button (click)="actionUndoReturn.emit(req)" class="px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition shadow-sm active:scale-95 text-[11px] font-bold mr-1" title="Hủy báo cáo trả và nhập lại"><i class="fa-solid fa-rotate-left mr-1"></i> HỦY BÁO CÁO</button>
              }
              @if(canApproveRequest(req)) {
                  <button (click)="actionAdminReceive.emit(req)" class="px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm active:scale-95 text-[11px] font-bold"><i class="fa-solid fa-check-to-slot mr-1"></i> NHẬN TRẢ</button>
              }
          }
          @if(req.status === 'COMPLETED' || req.status === 'REJECTED') {
              <div class="text-[11px] font-bold text-slate-400 flex items-center gap-1 px-1"><i class="fa-solid fa-lock"></i> Đã khóa</div>
          }
          @if(canDeleteRequest(req)) {
              <button (click)="actionDelete.emit(req)" class="p-1.5 text-rose-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition active:scale-95 ml-auto" title="Xóa yêu cầu"><i class="fa-solid fa-trash-can text-xs"></i></button>
          }
        </div>
      </div>
    </ng-template>
  `, styles: ["\n    .kanban-board {\n      display: flex;\n      gap: 1rem;\n      height: 100%;\n      padding: 0.5rem;\n      overflow-x: auto;\n      align-items: stretch;\n      position: relative;\n      min-height: 500px;\n      -webkit-overflow-scrolling: touch;\n    }\n    .kanban-col {\n      flex: 1;\n      min-width: 300px;\n      max-width: 380px;\n      display: flex;\n      flex-direction: column;\n      overflow: hidden;\n    }\n    /* Mobile: scroll-snap v\u1EDBi m\u1ED7i c\u1ED9t chi\u1EBFm 90vw */\n    @media (max-width: 767px) {\n      .kanban-board {\n        scroll-snap-type: x mandatory;\n        padding: 0.5rem 1rem;\n        gap: 0.75rem;\n        align-items: stretch;\n      }\n      .kanban-col {\n        scroll-snap-align: start;\n        flex: 0 0 calc(100vw - 3rem);\n        min-width: unset;\n        max-width: unset;\n        height: auto;\n        max-height: calc(100vh - 220px);\n      }\n    }\n    /* Tablet: 2 c\u1ED9t nh\u00ECn th\u1EA5y */\n    @media (min-width: 768px) and (max-width: 1023px) {\n      .kanban-board {\n        scroll-snap-type: x mandatory;\n        padding: 0.5rem 0.75rem;\n        gap: 0.75rem;\n      }\n      .kanban-col {\n        scroll-snap-align: start;\n        flex: 0 0 calc(50vw - 1.5rem);\n        min-width: unset;\n        max-width: unset;\n      }\n    }\n  "] }]
    }], null, { requests: [{
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
        }], currentFilter: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RequestsKanbanComponent, { className: "RequestsKanbanComponent", filePath: "src/app/features/standards/requests/components/requests-kanban.component.ts", lineNumber: 275 }); })();
//# sourceMappingURL=requests-kanban.component.js.map