import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatNum } from '../../../../shared/utils/utils';
import { StandardTagCatalogService } from '../../services/standard-tag-catalog.service';
import { MAX_RETURN_TAGS, formatMethodOptionLabel, sanitizeLegacyTagKeys } from '../../services/standard-tag.utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
function RequestsActionModalsComponent_Conditional_0_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8)(1, "span", 9);
    i0.ɵɵtext(2, "H\u1EA1n d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 10);
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(5, 1, ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.expiry_date, "dd/MM/yyyy"));
} }
function RequestsActionModalsComponent_Conditional_0_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8)(1, "span", 9);
    i0.ɵɵtext(2, "M\u00E3 qu\u1EA3n l\u00FD");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 33);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.internal_id);
} }
function RequestsActionModalsComponent_Conditional_0_Conditional_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 32);
} }
function RequestsActionModalsComponent_Conditional_0_Conditional_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 34);
    i0.ɵɵtext(1, " X\u00E1c nh\u1EADn & Giao ");
} }
function RequestsActionModalsComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
    i0.ɵɵelement(4, "i", 4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h3", 5);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 6);
    i0.ɵɵtext(8, "Th\u00F4ng tin chu\u1EA9n b\u00E0n giao");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 7)(10, "div", 8)(11, "span", 9);
    i0.ɵɵtext(12, "S\u1ED1 L\u00F4 / Lot");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span", 10);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(15, RequestsActionModalsComponent_Conditional_0_Conditional_15_Template, 6, 4, "div", 8);
    i0.ɵɵelementStart(16, "div", 8)(17, "span", 9);
    i0.ɵɵtext(18, "T\u1ED3n kho hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "span", 11);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(21, RequestsActionModalsComponent_Conditional_0_Conditional_21_Template, 5, 1, "div", 8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "div", 12)(23, "div", 13)(24, "p", 14);
    i0.ɵɵelement(25, "i", 15);
    i0.ɵɵtext(26, " Ng\u01B0\u1EDDi m\u01B0\u1EE3n: ");
    i0.ɵɵelementStart(27, "strong");
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(29, "div", 16)(30, "div", 17)(31, "h3", 18);
    i0.ɵɵtext(32, "Duy\u1EC7t & Giao Chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "button", 19);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_0_Template_button_click_33_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(34, "i", 20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "div", 21)(36, "div", 22)(37, "div")(38, "label", 23);
    i0.ɵɵtext(39, "L\u01B0\u1EE3ng d\u1EF1 ki\u1EBFn d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "div", 24)(41, "input", 25);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_0_Template_input_ngModelChange_41_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.approveExpectedAmount.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "span", 26);
    i0.ɵɵtext(43);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(44, "div")(45, "label", 23);
    i0.ɵɵtext(46, "M\u1EE5c \u0111\u00EDch s\u1EED d\u1EE5ng ");
    i0.ɵɵelementStart(47, "span", 27);
    i0.ɵɵtext(48, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(49, "textarea", 28);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_0_Template_textarea_ngModelChange_49_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.approvePurpose.set($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(50, "div", 29)(51, "button", 30);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_0_Template_button_click_51_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(52, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "button", 31);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_0_Template_button_click_53_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onApprove()); });
    i0.ɵɵtemplate(54, RequestsActionModalsComponent_Conditional_0_Conditional_54_Template, 1, 0, "i", 32)(55, RequestsActionModalsComponent_Conditional_0_Conditional_55_Template, 2, 0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.request.standardName);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.request.lotNumber || "N/A");
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.expiry_date) ? 15 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r1.formatNum((tmp_4_0 = ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.current_amount) !== null && tmp_4_0 !== undefined ? tmp_4_0 : 0), " ", ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.unit, "");
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.internal_id) ? 21 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.request.requestedByName);
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("ngModel", ctx_r1.approveExpectedAmount());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.unit);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r1.approvePurpose());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", !ctx_r1.approvePurpose() || ctx_r1.isProcessing);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing ? 54 : 55);
} }
function RequestsActionModalsComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 35)(2, "div", 36)(3, "h3", 37);
    i0.ɵɵelement(4, "i", 38);
    i0.ɵɵtext(5, " T\u1EEB Ch\u1ED1i Y\u00EAu C\u1EA7u ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 39);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_1_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(7, "i", 20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 40)(9, "div", 41)(10, "p", 42);
    i0.ɵɵtext(11, " B\u1EA1n \u0111ang t\u1EEB ch\u1ED1i y\u00EAu c\u1EA7u c\u1EE7a ");
    i0.ɵɵelementStart(12, "strong");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(14, " cho chu\u1EA9n ");
    i0.ɵɵelementStart(15, "strong");
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(17, ". ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div")(19, "label", 23);
    i0.ɵɵtext(20, "L\u00FD do t\u1EEB ch\u1ED1i ");
    i0.ɵɵelementStart(21, "span", 27);
    i0.ɵɵtext(22, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "textarea", 43);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_1_Template_textarea_ngModelChange_23_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.rejectReason.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div", 44)(25, "button", 30);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_1_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(26, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "button", 45);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_1_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onReject()); });
    i0.ɵɵtext(28, " X\u00E1c Nh\u1EADn t\u1EEB Ch\u1ED1i ");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(13);
    i0.ɵɵtextInterpolate(ctx_r1.request.requestedByName);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.request.standardName);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngModel", ctx_r1.rejectReason());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", !ctx_r1.rejectReason().toString().trim() || ctx_r1.isProcessing);
} }
function RequestsActionModalsComponent_Conditional_2_Conditional_17_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 78);
    i0.ɵɵelement(1, "i", 81);
    i0.ɵɵtext(2, " Kho \u0111\u00E3 \u0111\u01B0\u1EE3c tr\u1EEB theo t\u1EEBng \u0111\u1EE3t. N\u1EBFu s\u1ED1 x\u00E1c nh\u1EADn l\u1EDBn h\u01A1n t\u1ED5ng \u0111\u00E3 ghi, ph\u1EA7n ch\u00EAnh l\u1EC7ch s\u1EBD \u0111\u01B0\u1EE3c tr\u1EEB kho v\u00E0 t\u1EA1o nh\u1EADt k\u00FD \u0111i\u1EC1u ch\u1EC9nh. ");
    i0.ɵɵelementEnd();
} }
function RequestsActionModalsComponent_Conditional_2_Conditional_17_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 79);
    i0.ɵɵtext(1, " Kho \u0111\u00E3 \u0111\u01B0\u1EE3c tr\u1EEB theo t\u1EEBng \u0111\u1EE3t. S\u1ED1 b\u00E1o c\u00E1o b\u00EAn d\u01B0\u1EDBi ch\u1EC9 \u0111\u1EC3 admin x\u00E1c nh\u1EADn. ");
    i0.ɵɵelementEnd();
} }
function RequestsActionModalsComponent_Conditional_2_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 74)(1, "div", 75);
    i0.ɵɵelement(2, "i", 76);
    i0.ɵɵtext(3, " T\u1ED5ng \u0111\u00E3 ghi nh\u1EADn: ");
    i0.ɵɵelementStart(4, "span", 77);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(6, RequestsActionModalsComponent_Conditional_2_Conditional_17_Conditional_6_Template, 3, 0, "p", 78)(7, RequestsActionModalsComponent_Conditional_2_Conditional_17_Conditional_7_Template, 2, 0, "p", 79);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div")(9, "label", 23);
    i0.ɵɵtext(10, "S\u1ED1 l\u01B0\u1EE3ng b\u00E1o c\u00E1o (ghi s\u1ED5)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 24)(12, "input", 80);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_2_Conditional_17_Template_input_ngModelChange_12_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.returnAmount.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span", 26);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r1.request.totalAmountUsed || 0, " ", (ctx_r1.standard == null ? null : ctx_r1.standard.unit) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.unit) || "mg", "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isForceReturn ? 6 : 7);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("min", ctx_r1.minimumLoggedAmount())("ngModel", ctx_r1.returnAmount());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((ctx_r1.standard == null ? null : ctx_r1.standard.unit) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.unit) || "mg");
} }
function RequestsActionModalsComponent_Conditional_2_Conditional_18_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 83);
    i0.ɵɵelement(1, "i", 84);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" V\u01B0\u1EE3t qu\u00E1 t\u1ED3n kho hi\u1EC7n h\u00E0nh (", ctx_r1.formatNum((ctx_r1.standard == null ? null : ctx_r1.standard.current_amount) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.current_amount) || 0), ")");
} }
function RequestsActionModalsComponent_Conditional_2_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "label", 23);
    i0.ɵɵtext(2, "L\u01B0\u1EE3ng th\u1EF1c t\u1EBF \u0111\u00E3 d\u00F9ng ");
    i0.ɵɵelementStart(3, "span", 27);
    i0.ɵɵtext(4, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 24)(6, "input", 82);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_2_Conditional_18_Template_input_ngModelChange_6_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.returnAmount.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 26);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(9, RequestsActionModalsComponent_Conditional_2_Conditional_18_Conditional_9_Template, 3, 1, "p", 83);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r1.returnAmount());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((ctx_r1.standard == null ? null : ctx_r1.standard.unit) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.unit) || "mg");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.returnAmount() !== null && ctx_r1.returnAmount() > ((ctx_r1.standard == null ? null : ctx_r1.standard.current_amount) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.current_amount) || 0) ? 9 : -1);
} }
function RequestsActionModalsComponent_Conditional_2_For_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 68);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r7 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("value", option_r7.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatTagLabel(option_r7));
} }
function RequestsActionModalsComponent_Conditional_2_For_43_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "span", 71);
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "button", 85);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_2_For_43_Template_button_click_2_listener() { const key_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.removeReturnTag(key_r9)); });
    i0.ɵɵtext(3, "\u00D7");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const key_r9 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("title", ctx_r1.formatTagLabel(ctx_r1.tagCatalog.resolveTag(key_r9)));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatTagLabel(ctx_r1.tagCatalog.resolveTag(key_r9)));
} }
function RequestsActionModalsComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 35)(2, "div", 46)(3, "h3", 47);
    i0.ɵɵelement(4, "i", 48);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 49);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_2_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(7, "i", 20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 50)(9, "div", 51)(10, "h4", 52);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 53)(13, "span", 54);
    i0.ɵɵtext(14, "T\u1ED3n kho hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "span", 55);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(17, RequestsActionModalsComponent_Conditional_2_Conditional_17_Template, 15, 6)(18, RequestsActionModalsComponent_Conditional_2_Conditional_18_Template, 10, 3, "div");
    i0.ɵɵelementStart(19, "div", 56)(20, "input", 57);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_2_Template_input_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.returnIsDepleted.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "label", 58);
    i0.ɵɵtext(22, "\u0110\u00E1nh d\u1EA5u chu\u1EA9n \u0111\u00E3 d\u00F9ng h\u1EBFt (Depleted)");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 59)(24, "div", 60)(25, "label", 61);
    i0.ɵɵtext(26, "Nh\u00E3n ph\u01B0\u01A1ng ph\u00E1p th\u1EED ");
    i0.ɵɵelementStart(27, "span", 62);
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "button", 63);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_2_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.returnSopTags.set([])); });
    i0.ɵɵtext(30, "X\u00F3a nh\u00E3n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(31, "p", 64);
    i0.ɵɵtext(32, "M\u1ED9t b\u00E1o c\u00E1o c\u00F3 th\u1EC3 g\u1EAFn nhi\u1EC1u ph\u01B0\u01A1ng ph\u00E1p h\u00F3a h\u1ECDc c\u00F9ng l\u00FAc.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "div", 65)(34, "select", 66);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_2_Template_select_ngModelChange_34_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.returnTagToAdd.set($event)); });
    i0.ɵɵelementStart(35, "option", 67);
    i0.ɵɵtext(36, "Ch\u1ECDn nh\u00E3n trong danh m\u1EE5c...");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(37, RequestsActionModalsComponent_Conditional_2_For_38_Template, 2, 2, "option", 68, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "button", 69);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_2_Template_button_click_39_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addReturnTag()); });
    i0.ɵɵtext(40, "Th\u00EAm");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(41, "div", 70);
    i0.ɵɵrepeaterCreate(42, RequestsActionModalsComponent_Conditional_2_For_43_Template, 4, 2, "span", 71, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(44, "div", 72)(45, "button", 30);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_2_Template_button_click_45_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(46, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "button", 73);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_2_Template_button_click_47_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onReturn()); });
    i0.ɵɵtext(48, " X\u00E1c nh\u1EADn tr\u1EA3 ");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isForceReturn ? "Thu h\u1ED3i chu\u1EA9n" : "Ho\u00E0n tr\u1EA3 chu\u1EA9n", " ");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.request.standardName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r1.formatNum((ctx_r1.standard == null ? null : ctx_r1.standard.current_amount) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.current_amount) || 0), " ", (ctx_r1.standard == null ? null : ctx_r1.standard.unit) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.unit) || "mg", "");
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r1.request.totalAmountUsed || 0) > 0 ? 17 : 18);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r1.returnIsDepleted());
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate2("(ch\u1ECDn nhi\u1EC1u, ", ctx_r1.returnSopTags().length, "/", ctx_r1.maxReturnTags, ")");
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r1.returnTagToAdd());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.tagOptions());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.returnTagToAdd() || ctx_r1.returnSopTags().length >= ctx_r1.maxReturnTags);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.returnSopTags());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r1.returnAmount() === null || ctx_r1.returnAmount() < ctx_r1.minimumLoggedAmount() || ctx_r1.isProcessing);
} }
function RequestsActionModalsComponent_Conditional_3_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 83);
    i0.ɵɵelement(1, "i", 84);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" V\u01B0\u1EE3t qu\u00E1 t\u1ED3n kho hi\u1EC7n h\u00E0nh (", ctx_r1.formatNum((ctx_r1.standard == null ? null : ctx_r1.standard.current_amount) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.current_amount) || 0), ")");
} }
function RequestsActionModalsComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 35)(2, "div", 86)(3, "h3", 87);
    i0.ɵɵelement(4, "i", 88);
    i0.ɵɵtext(5, " Ghi Nh\u1EADn \u0110\u1EE3t D\u00F9ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 89);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_3_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(7, "i", 20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 50)(9, "div")(10, "label", 23);
    i0.ɵɵtext(11, "Kh\u1ED1i l\u01B0\u1EE3ng \u0111\u1EE3t n\u00E0y ");
    i0.ɵɵelementStart(12, "span", 27);
    i0.ɵɵtext(13, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 24)(15, "input", 90);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_3_Template_input_ngModelChange_15_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.logUsageAmount.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span", 26);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(18, RequestsActionModalsComponent_Conditional_3_Conditional_18_Template, 3, 1, "p", 83);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div")(20, "label", 23);
    i0.ɵɵtext(21, "Ghi ch\u00FA \u0111\u1EE3t d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "textarea", 91);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_3_Template_textarea_ngModelChange_22_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.logUsagePurpose.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 92)(24, "button", 30);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_3_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(25, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "button", 93);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_3_Template_button_click_26_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onLogUsage()); });
    i0.ɵɵtext(27, " L\u01B0u nh\u1EADt k\u00FD d\u00F9ng ");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(15);
    i0.ɵɵproperty("ngModel", ctx_r1.logUsageAmount());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.unit);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.logUsageAmount() !== null && ctx_r1.logUsageAmount() > ((ctx_r1.standard == null ? null : ctx_r1.standard.current_amount) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.current_amount) || 0) ? 18 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.logUsagePurpose());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.logUsageAmount() === null || ctx_r1.logUsageAmount() <= 0 || ctx_r1.isProcessing || ctx_r1.logUsageAmount() > ((ctx_r1.standard == null ? null : ctx_r1.standard.current_amount) || (ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.current_amount) || 0));
} }
function RequestsActionModalsComponent_Conditional_4_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 105)(1, "label", 23);
    i0.ɵɵtext(2, "L\u00FD do h\u1EE7y chu\u1EA9n ");
    i0.ɵɵelementStart(3, "span", 27);
    i0.ɵɵtext(4, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "textarea", 106);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_4_Conditional_33_Template_textarea_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.adminReceiveDisposalReason.set($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r1.adminReceiveDisposalReason());
} }
function RequestsActionModalsComponent_Conditional_4_For_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 68);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r13 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("value", option_r13.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatTagLabel(option_r13));
} }
function RequestsActionModalsComponent_Conditional_4_For_54_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "span", 71);
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "button", 85);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_4_For_54_Template_button_click_2_listener() { const key_r15 = i0.ɵɵrestoreView(_r14).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.removeAdminTag(key_r15)); });
    i0.ɵɵtext(3, "\u00D7");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const key_r15 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("title", ctx_r1.formatTagLabel(ctx_r1.tagCatalog.resolveTag(key_r15)));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatTagLabel(ctx_r1.tagCatalog.resolveTag(key_r15)));
} }
function RequestsActionModalsComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 94)(2, "div", 46)(3, "h3", 95);
    i0.ɵɵelement(4, "i", 96);
    i0.ɵɵtext(5, " X\u00E1c Nh\u1EADn Nh\u1EADp Kho Tr\u1EA3 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 49);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_4_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(7, "i", 20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 97)(9, "div", 98)(10, "div", 8)(11, "span", 99);
    i0.ɵɵtext(12, "NV b\u00E1o c\u00E1o d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span", 100);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 8)(16, "span", 99);
    i0.ɵɵtext(17, "Tr\u1EA1ng th\u00E1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span", 101);
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(20, "div")(21, "label", 23);
    i0.ɵɵtext(22, "L\u01B0\u1EE3ng th\u1EF1c t\u1EBF tr\u1EEB kho ");
    i0.ɵɵelementStart(23, "span", 27);
    i0.ɵɵtext(24, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "div", 24)(26, "input", 102);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_4_Template_input_ngModelChange_26_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.adminReceiveAmount.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "span", 26);
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "div", 56)(30, "input", 103);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_4_Template_input_ngModelChange_30_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.adminReceiveIsDepleted.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "label", 104);
    i0.ɵɵtext(32, "X\u00E1c nh\u1EADn chu\u1EA9n \u0111\u00E3 d\u00F9ng h\u1EBFt (H\u1EE7y chu\u1EA9n)");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(33, RequestsActionModalsComponent_Conditional_4_Conditional_33_Template, 6, 1, "div", 105);
    i0.ɵɵelementStart(34, "div", 59)(35, "div", 60)(36, "label", 61);
    i0.ɵɵtext(37, "Ph\u01B0\u01A1ng ph\u00E1p quy\u1EBFt \u0111\u1ECBnh cu\u1ED1i c\u1EE7a Admin ");
    i0.ɵɵelementStart(38, "span", 62);
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(40, "button", 63);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_4_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.adminFinalSopTags.set([])); });
    i0.ɵɵtext(41, "X\u00F3a nh\u00E3n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(42, "p", 64);
    i0.ɵɵtext(43, "C\u00F3 th\u1EC3 x\u00E1c nh\u1EADn nhi\u1EC1u ph\u01B0\u01A1ng ph\u00E1p \u00E1p d\u1EE5ng cho c\u00F9ng m\u1ED9t chu\u1EA9n.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "div", 65)(45, "select", 66);
    i0.ɵɵlistener("ngModelChange", function RequestsActionModalsComponent_Conditional_4_Template_select_ngModelChange_45_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.adminTagToAdd.set($event)); });
    i0.ɵɵelementStart(46, "option", 67);
    i0.ɵɵtext(47, "Ch\u1ECDn nh\u00E3n trong danh m\u1EE5c...");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(48, RequestsActionModalsComponent_Conditional_4_For_49_Template, 2, 2, "option", 68, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "button", 69);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_4_Template_button_click_50_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addAdminTag()); });
    i0.ɵɵtext(51, "Th\u00EAm");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(52, "div", 70);
    i0.ɵɵrepeaterCreate(53, RequestsActionModalsComponent_Conditional_4_For_54_Template, 4, 2, "span", 71, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(55, "div", 72)(56, "button", 30);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_4_Template_button_click_56_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(57, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "button", 73);
    i0.ɵɵlistener("click", function RequestsActionModalsComponent_Conditional_4_Template_button_click_58_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onAdminReceive()); });
    i0.ɵɵtext(59, " Ho\u00E0n T\u1EA5t Ti\u1EBFp Nh\u1EADn ");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵtextInterpolate2("", ctx_r1.request.totalAmountUsed, " ", ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.unit, "");
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r1.request.reportedDepleted ? "text-red-500" : "text-emerald-500");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.request.reportedDepleted ? "B\u00E1o c\u00E1o \u0111\u00E3 h\u1EBFt" : "V\u1EABn c\u00F2n chu\u1EA9n", " ");
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("min", ctx_r1.minimumLoggedAmount())("ngModel", ctx_r1.adminReceiveAmount());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.request.standardDetails == null ? null : ctx_r1.request.standardDetails.unit);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r1.adminReceiveIsDepleted());
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.adminReceiveIsDepleted() ? 33 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("(ch\u1ECDn nhi\u1EC1u, ", ctx_r1.adminFinalSopTags().length, "/", ctx_r1.maxReturnTags, ")");
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r1.adminTagToAdd());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.tagOptions());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.adminTagToAdd() || ctx_r1.adminFinalSopTags().length >= ctx_r1.maxReturnTags);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.adminFinalSopTags());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r1.adminReceiveAmount() === null || ctx_r1.adminReceiveAmount() < ctx_r1.minimumLoggedAmount() || ctx_r1.adminReceiveIsDepleted() && !ctx_r1.adminReceiveDisposalReason() || ctx_r1.isProcessing);
} }
export class RequestsActionModalsComponent {
    constructor() {
        this.tagCatalog = inject(StandardTagCatalogService);
        this.activeModal = null;
        this.request = null;
        this.standard = null;
        this.isForceReturn = false;
        this.isProcessing = false;
        this.close = new EventEmitter();
        this.approveAction = new EventEmitter();
        this.rejectAction = new EventEmitter();
        this.logUsageAction = new EventEmitter();
        this.returnAction = new EventEmitter();
        this.adminReceiveAction = new EventEmitter();
        // State properties
        this.approveExpectedAmount = signal(null);
        this.approvePurpose = signal('');
        this.rejectReason = signal('');
        this.logUsageAmount = signal(null);
        this.logUsagePurpose = signal('');
        this.returnAmount = signal(null);
        this.returnIsDepleted = signal(false);
        this.returnSopTags = signal([]);
        this.returnTagToAdd = signal('');
        this.adminReceiveAmount = signal(null);
        this.adminReceiveIsDepleted = signal(false);
        this.adminReceiveDisposalReason = signal('');
        this.adminFinalSopTags = signal([]);
        this.adminTagToAdd = signal('');
        this.tagOptions = this.tagCatalog.selectableOptions;
        this.maxReturnTags = MAX_RETURN_TAGS;
        this.formatNum = formatNum;
    }
    formatTagLabel(option) {
        return formatMethodOptionLabel(option);
    }
    ngOnChanges(changes) {
        if (changes['activeModal'] || changes['request']) {
            const mode = this.activeModal;
            const req = this.request;
            if (!mode) {
                this.resetAllStates();
            }
            else if (mode === 'adminReceive' && req) {
                if (this.adminReceiveAmount() === null) {
                    this.adminReceiveAmount.set(req.reportedAmountUsed ?? req.totalAmountUsed ?? 0);
                }
                if (!this.adminReceiveIsDepleted() && req.reportedDepleted) {
                    this.adminReceiveIsDepleted.set(req.reportedDepleted);
                }
                if (this.adminFinalSopTags().length === 0 && req.sopTags?.length) {
                    this.adminFinalSopTags.set(sanitizeLegacyTagKeys(req.sopTags));
                }
            }
            else if (mode === 'return' && req) {
                if (this.returnAmount() === null) {
                    this.returnAmount.set(req.reportedAmountUsed ?? req.totalAmountUsed ?? 0);
                }
                if (this.returnSopTags().length === 0 && req.sopTags?.length) {
                    this.returnSopTags.set(sanitizeLegacyTagKeys(req.sopTags));
                }
            }
            else if (mode === 'approve' && req) {
                if (!this.approvePurpose()) {
                    this.approvePurpose.set(req.purpose || '');
                }
            }
        }
    }
    resetAllStates() {
        this.approveExpectedAmount.set(null);
        this.approvePurpose.set('');
        this.rejectReason.set('');
        this.logUsageAmount.set(null);
        this.logUsagePurpose.set('');
        this.returnAmount.set(null);
        this.returnIsDepleted.set(false);
        this.returnSopTags.set([]);
        this.returnTagToAdd.set('');
        this.adminReceiveAmount.set(null);
        this.adminReceiveIsDepleted.set(false);
        this.adminReceiveDisposalReason.set('');
        this.adminFinalSopTags.set([]);
        this.adminTagToAdd.set('');
    }
    onClose() {
        this.close.emit();
    }
    onApprove() {
        if (this.isProcessing)
            return;
        this.approveAction.emit({
            expectedAmount: this.approveExpectedAmount(),
            purpose: this.approvePurpose()
        });
    }
    onReject() {
        if (this.isProcessing)
            return;
        this.rejectAction.emit({
            reason: this.rejectReason()
        });
    }
    onLogUsage() {
        const amount = this.logUsageAmount();
        if (this.isProcessing || amount === null || !Number.isFinite(amount) || amount <= 0)
            return;
        this.logUsageAction.emit({
            amount,
            purpose: this.logUsagePurpose()
        });
    }
    onReturn() {
        const amount = this.returnAmount();
        if (this.isProcessing || amount === null || !Number.isFinite(amount) || amount < this.minimumLoggedAmount())
            return;
        this.returnAction.emit({
            amount,
            isDepleted: this.returnIsDepleted(),
            sopTags: this.returnSopTags()
        });
    }
    onAdminReceive() {
        const amount = this.adminReceiveAmount();
        if (this.isProcessing || amount === null || !Number.isFinite(amount) || amount < this.minimumLoggedAmount())
            return;
        this.adminReceiveAction.emit({
            amount,
            isDepleted: this.adminReceiveIsDepleted(),
            disposalReason: this.adminReceiveDisposalReason(),
            finalSopTags: this.adminFinalSopTags()
        });
    }
    addReturnTag() {
        const key = this.returnTagToAdd();
        if (!key || this.returnSopTags().includes(key) || this.returnSopTags().length >= MAX_RETURN_TAGS)
            return;
        this.returnSopTags.update(tags => [...tags, key]);
        this.returnTagToAdd.set('');
    }
    removeReturnTag(key) {
        this.returnSopTags.update(tags => tags.filter(item => item !== key));
    }
    addAdminTag() {
        const key = this.adminTagToAdd();
        if (!key || this.adminFinalSopTags().includes(key) || this.adminFinalSopTags().length >= MAX_RETURN_TAGS)
            return;
        this.adminFinalSopTags.update(tags => [...tags, key]);
        this.adminTagToAdd.set('');
    }
    removeAdminTag(key) {
        this.adminFinalSopTags.update(tags => tags.filter(item => item !== key));
    }
    minimumLoggedAmount() {
        return Math.max(0, Number(this.request?.totalAmountUsed || 0));
    }
    static { this.ɵfac = function RequestsActionModalsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RequestsActionModalsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RequestsActionModalsComponent, selectors: [["app-requests-action-modals"]], inputs: { activeModal: "activeModal", request: "request", standard: "standard", isForceReturn: "isForceReturn", isProcessing: "isProcessing" }, outputs: { close: "close", approveAction: "approveAction", rejectAction: "rejectAction", logUsageAction: "logUsageAction", returnAction: "returnAction", adminReceiveAction: "adminReceiveAction" }, features: [i0.ɵɵNgOnChangesFeature], decls: 5, vars: 5, consts: [[1, "requests-modal-layer", "fixed", "inset-0", "z-[500]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], ["role", "dialog", "aria-modal", "true", 1, "bg-white", "dark:bg-slate-900", "rounded-[2.5rem]", "shadow-2xl", "w-full", "max-w-3xl", "flex", "flex-col", "md:flex-row", "overflow-hidden", "animate-bounce-in", "border", "border-slate-100", "dark:border-slate-800", "max-h-[90vh]"], [1, "flex", "w-full", "md:w-2/5", "bg-slate-50", "dark:bg-slate-800/50", "p-6", "md:p-8", "flex-col", "border-b", "md:border-b-0", "md:border-r", "border-slate-100", "dark:border-slate-800", "shrink-0", "overflow-y-auto"], [1, "w-14", "h-14", "rounded-2xl", "bg-white", "dark:bg-slate-800", "text-emerald-600", "dark:text-emerald-400", "flex", "items-center", "justify-center", "text-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "mb-6"], [1, "fa-solid", "fa-vial"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "leading-tight", "mb-2", "line-clamp-2"], [1, "text-xs", "font-bold", "text-indigo-600", "dark:text-indigo-400", "uppercase", "tracking-widest", "mb-6"], [1, "space-y-4"], [1, "flex", "flex-col"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase"], [1, "text-base", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-base", "font-bold", "text-emerald-600"], [1, "mt-auto", "pt-6", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "bg-blue-50", "dark:bg-blue-900/20", "p-3", "rounded-2xl", "border", "border-blue-100", "dark:border-blue-800/30"], [1, "text-xs", "text-blue-700", "dark:text-blue-400", "leading-relaxed", "font-medium"], [1, "fa-solid", "fa-user-check", "mr-1"], [1, "flex-1", "p-6", "md:p-8", "flex", "flex-col", "bg-white", "dark:bg-slate-900", "overflow-y-auto"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "tracking-tight"], [1, "w-8", "h-8", "rounded-full", "hover:bg-slate-100", "dark:hover:bg-slate-800", "flex", "items-center", "justify-center", "text-slate-400", "transition", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "space-y-5"], [1, "grid", "grid-cols-1", "md:grid-cols-1", "gap-4"], [1, "block", "text-sm", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider", "mb-2"], [1, "relative"], ["type", "number", "min", "0", "step", "any", "placeholder", "VD: 5", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "outline-none", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-4", "top-1/2", "-translate-y-1/2", "text-sm", "font-bold", "text-slate-400"], [1, "text-red-500"], ["rows", "3", "placeholder", "Nh\u1EADp m\u1EE5c \u0111\u00EDch b\u00E0n giao...", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "focus:ring-4", "focus:ring-indigo-500/10", "transition-all", "outline-none", "resize-none", "placeholder-slate-300", 3, "ngModelChange", "ngModel"], [1, "flex", "justify-end", "gap-3", "mt-8", "pt-4", "border-t", "border-slate-100", "dark:border-slate-800"], [1, "px-6", "py-3", "text-slate-500", "dark:text-slate-400", "font-bold", "text-base", "hover:bg-slate-100", "dark:hover:bg-slate-800", "rounded-2xl", "transition", 3, "click"], [1, "px-8", "py-3", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "font-bold", "text-base", "rounded-2xl", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "shadow-xl", "shadow-indigo-200", "dark:shadow-none", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", "active:scale-95", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "text-lg", "font-black", "text-indigo-600", "dark:text-indigo-400", "uppercase", "tracking-wide"], [1, "fa-solid", "fa-check-circle", "text-sm"], ["role", "dialog", "aria-modal", "true", 1, "bg-white", "dark:bg-slate-900", "rounded-[2.5rem]", "shadow-2xl", "w-full", "max-w-md", "overflow-hidden", "animate-bounce-in", "border", "border-slate-100", "dark:border-slate-800"], [1, "px-8", "py-6", "border-b", "border-slate-100", "dark:border-slate-800", "flex", "justify-between", "items-center", "bg-red-50/50", "dark:bg-red-900/10"], [1, "font-black", "text-red-600", "dark:text-red-400", "text-xl", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-ban"], [1, "w-8", "h-8", "rounded-full", "hover:bg-white", "dark:hover:bg-slate-800", "flex", "items-center", "justify-center", "text-red-400", "transition", 3, "click"], [1, "p-8", "bg-white", "dark:bg-slate-900"], [1, "mb-6"], [1, "text-base", "font-medium", "text-slate-600", "dark:text-slate-300"], ["rows", "3", "placeholder", "Nh\u1EADp l\u00FD do c\u1EE5 th\u1EC3...", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-red-500", "focus:ring-4", "focus:ring-red-500/10", "transition-all", "outline-none", "resize-none", 3, "ngModelChange", "ngModel"], [1, "flex", "justify-end", "gap-3", "mt-8"], [1, "px-8", "py-3", "bg-red-600", "text-white", "font-bold", "text-base", "rounded-2xl", "hover:bg-red-700", "shadow-xl", "shadow-red-200", "dark:shadow-none", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "px-8", "py-6", "border-b", "border-slate-100", "dark:border-slate-800", "flex", "justify-between", "items-center", "bg-indigo-50/50", "dark:bg-indigo-900/10"], [1, "font-black", "text-indigo-600", "dark:text-indigo-400", "text-xl", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-rotate-left"], [1, "w-8", "h-8", "rounded-full", "hover:bg-white", "dark:hover:bg-slate-800", "flex", "items-center", "justify-center", "text-indigo-400", "transition", 3, "click"], [1, "p-8", "space-y-6", "bg-white", "dark:bg-slate-900"], [1, "bg-indigo-50/50", "dark:bg-indigo-900/10", "p-4", "rounded-2xl", "border", "border-indigo-100/50", "dark:border-indigo-800/30"], [1, "font-black", "text-slate-800", "dark:text-slate-100", "leading-tight", "mb-2"], [1, "flex", "justify-between", "items-center"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-widest"], [1, "font-black", "text-indigo-600"], [1, "flex", "items-center", "gap-3", "p-4", "bg-amber-50", "dark:bg-amber-900/10", "rounded-2xl", "border", "border-amber-100", "dark:border-amber-800/20"], ["type", "checkbox", "id", "isDepleted", 1, "w-5", "h-5", "accent-amber-600", "rounded-lg", 3, "ngModelChange", "ngModel"], ["for", "isDepleted", 1, "text-sm", "font-bold", "text-amber-700", "dark:amber-400", "cursor-pointer"], [1, "space-y-2", "rounded-2xl", "border", "border-indigo-100", "dark:border-indigo-800/30", "bg-indigo-50/40", "dark:bg-indigo-900/10", "p-4"], [1, "flex", "items-center", "justify-between"], [1, "text-sm", "font-black", "text-indigo-700", "dark:text-indigo-300"], [1, "font-medium", "text-indigo-500"], ["type", "button", 1, "text-xs", "font-bold", "text-slate-500", "hover:text-red-600", 3, "click"], [1, "text-[11px]", "text-indigo-600/80", "dark:text-indigo-300/80"], [1, "flex", "gap-2"], [1, "min-w-0", "flex-1", "rounded-xl", "border", "border-indigo-200", "dark:border-indigo-800", "bg-white", "dark:bg-slate-800", "px-3", "py-2", "text-sm", "font-bold", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["type", "button", 1, "rounded-xl", "bg-indigo-600", "px-3", "py-2", "text-white", "font-bold", "disabled:opacity-40", 3, "click", "disabled"], [1, "flex", "flex-wrap", "gap-1.5"], [1, "inline-flex", "items-center", "gap-1", "rounded-full", "bg-white", "dark:bg-slate-800", "border", "border-indigo-200", "dark:border-indigo-700", "px-2.5", "py-1", "text-xs", "font-bold", "text-indigo-700", "dark:text-indigo-300", 3, "title"], [1, "flex", "justify-end", "gap-3", "mt-4", "pt-4", "border-t", "border-slate-50", "dark:border-slate-800"], [1, "px-8", "py-3", "bg-indigo-600", "text-white", "font-bold", "text-base", "rounded-2xl", "hover:bg-indigo-700", "shadow-xl", "shadow-indigo-200", "dark:shadow-none", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "bg-blue-50", "dark:bg-blue-900/20", "p-4", "rounded-2xl", "border", "border-blue-200", "dark:border-blue-800/40", "space-y-2"], [1, "flex", "items-center", "gap-2", "text-blue-700", "dark:text-blue-300", "font-black", "text-base"], [1, "fa-solid", "fa-circle-info"], [1, "text-blue-800", "dark:text-blue-200"], [1, "text-sm", "text-amber-700", "dark:text-amber-400", "bg-amber-50", "dark:bg-amber-900/20", "p-2", "rounded-xl", "border", "border-amber-200", "dark:border-amber-800/40"], [1, "text-sm", "text-blue-600", "dark:text-blue-400"], ["type", "number", "step", "any", "placeholder", "S\u1ED1 l\u01B0\u1EE3ng...", 1, "w-full", "px-4", "py-3", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "outline-none", "pr-12", 3, "ngModelChange", "min", "ngModel"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"], ["type", "number", "min", "0", "step", "any", "placeholder", "Nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng...", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "outline-none", "pr-12", 3, "ngModelChange", "ngModel"], [1, "text-red-500", "text-xs", "font-bold", "mt-2", "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-triangle-exclamation"], ["type", "button", 1, "text-indigo-400", "hover:text-red-500", 3, "click"], [1, "px-8", "py-6", "border-b", "border-slate-100", "dark:border-slate-800", "flex", "justify-between", "items-center", "bg-teal-50/50", "dark:bg-teal-900/10"], [1, "font-black", "text-teal-600", "dark:text-teal-400", "text-xl", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-vial-circle-check"], [1, "w-8", "h-8", "rounded-full", "hover:bg-white", "dark:hover:bg-slate-800", "flex", "items-center", "justify-center", "text-teal-400", "transition", 3, "click"], ["type", "number", "min", "0", "step", "any", "placeholder", "VD: 5.25", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-teal-500", "outline-none", "pr-12", 3, "ngModelChange", "ngModel"], ["rows", "2", "placeholder", "VD: D\u00F9ng cho m\u1EABu ph\u00E2n t\u00EDch l\u00F4 X...", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-teal-500", "transition-all", "outline-none", "resize-none", 3, "ngModelChange", "ngModel"], [1, "flex", "justify-end", "gap-3", "mt-4"], [1, "px-8", "py-3", "bg-teal-600", "text-white", "font-bold", "text-base", "rounded-2xl", "hover:bg-teal-700", "shadow-xl", "shadow-teal-200", "dark:shadow-none", "transition", "disabled:opacity-50", 3, "click", "disabled"], ["role", "dialog", "aria-modal", "true", 1, "bg-white", "dark:bg-slate-900", "rounded-[2.5rem]", "shadow-2xl", "w-full", "max-w-lg", "overflow-hidden", "animate-bounce-in", "border", "border-slate-100", "dark:border-slate-800", "max-h-[90vh]", "flex", "flex-col"], [1, "font-black", "text-indigo-700", "dark:text-indigo-400", "text-xl", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-clipboard-check"], [1, "p-6", "md:p-8", "space-y-6", "bg-white", "dark:bg-slate-900", "overflow-y-auto"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "gap-4", "bg-slate-50", "dark:bg-slate-800/50", "p-6", "rounded-[2rem]", "border", "border-slate-100", "dark:border-slate-800", "shadow-inner"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-widest", "mb-1"], [1, "text-xl", "font-black", "text-indigo-600"], [1, "text-base", "font-bold"], ["type", "number", "step", "any", "placeholder", "X\u00E1c nh\u1EADn s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF...", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "outline-none", "pr-12", 3, "ngModelChange", "min", "ngModel"], ["type", "checkbox", "id", "adminIsDepleted", 1, "w-5", "h-5", "accent-amber-600", "rounded-lg", 3, "ngModelChange", "ngModel"], ["for", "adminIsDepleted", 1, "text-sm", "font-bold", "text-amber-700", "dark:amber-400", "cursor-pointer"], [1, "fade-in"], ["rows", "2", "placeholder", "Nh\u1EADp l\u00FD do nh\u01B0: H\u1EBFt h\u1EA1n, h\u1ECFng, ho\u1EB7c d\u00F9ng h\u1EBFt...", 1, "w-full", "bg-red-50/50", "dark:bg-red-900/10", "border", "border-red-100", "dark:border-red-800/30", "rounded-2xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-red-500", "outline-none", "resize-none", 3, "ngModelChange", "ngModel"]], template: function RequestsActionModalsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, RequestsActionModalsComponent_Conditional_0_Template, 56, 12, "div", 0)(1, RequestsActionModalsComponent_Conditional_1_Template, 29, 4, "div", 0)(2, RequestsActionModalsComponent_Conditional_2_Template, 49, 11, "div", 0)(3, RequestsActionModalsComponent_Conditional_3_Template, 28, 5, "div", 0)(4, RequestsActionModalsComponent_Conditional_4_Template, 60, 15, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.activeModal === "approve" && ctx.request ? 0 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.activeModal === "reject" && ctx.request ? 1 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.activeModal === "return" && ctx.request ? 2 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.activeModal === "logUsage" && ctx.request ? 3 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.activeModal === "adminReceive" && ctx.request ? 4 : -1);
        } }, dependencies: [CommonModule, i1.DatePipe, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.MinValidator, i2.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RequestsActionModalsComponent, [{
        type: Component,
        args: [{
                selector: 'app-requests-action-modals',
                standalone: true,
                imports: [CommonModule, FormsModule, DatePipe],
                template: `
    <!-- APPROVE MODAL -->
    @if (activeModal === 'approve' && request) {
       <div class="requests-modal-layer fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
           <div role="dialog" aria-modal="true" class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800 max-h-[90vh]">
               <!-- Left: Standard Info Summary -->
               <div class="flex w-full md:w-2/5 bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 flex-col border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 shrink-0 overflow-y-auto">
                   <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                       <i class="fa-solid fa-vial"></i>
                   </div>
                   
                   <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">{{request.standardName}}</h3>
                   <div class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">Thông tin chuẩn bàn giao</div>

                   <div class="space-y-4">
                       <div class="flex flex-col">
                           <span class="text-xs font-bold text-slate-400 uppercase">Số Lô / Lot</span>
                           <span class="text-base font-bold text-slate-700 dark:text-slate-200">{{request.lotNumber || 'N/A'}}</span>
                       </div>
                       @if(request.standardDetails?.expiry_date) {
                           <div class="flex flex-col">
                               <span class="text-xs font-bold text-slate-400 uppercase">Hạn dùng</span>
                               <span class="text-base font-bold text-slate-700 dark:text-slate-200">{{request.standardDetails?.expiry_date | date:'dd/MM/yyyy'}}</span>
                           </div>
                       }
                       <div class="flex flex-col">
                           <span class="text-xs font-bold text-slate-400 uppercase">Tồn kho hiện tại</span>
                           <span class="text-base font-bold text-emerald-600">{{formatNum(request.standardDetails?.current_amount ?? 0)}} {{request.standardDetails?.unit}}</span>
                       </div>
                       @if(request.standardDetails?.internal_id) {
                           <div class="flex flex-col">
                               <span class="text-xs font-bold text-slate-400 uppercase">Mã quản lý</span>
                               <span class="text-lg font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{{request.standardDetails?.internal_id}}</span>
                           </div>
                       }
                   </div>

                   <div class="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                       <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                           <p class="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                               <i class="fa-solid fa-user-check mr-1"></i>
                               Người mượn: <strong>{{request.requestedByName}}</strong>
                           </p>
                       </div>
                   </div>
               </div>

               <!-- Right: Approve Form -->
               <div class="flex-1 p-6 md:p-8 flex flex-col bg-white dark:bg-slate-900 overflow-y-auto">
                   <div class="flex justify-between items-center mb-6">
                       <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Duyệt & Giao Chuẩn</h3>
                       <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"><i class="fa-solid fa-times"></i></button>
                   </div>

                   <div class="flex-1 space-y-5">
                       <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                           <div>
                               <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng dự kiến dùng</label>
                               <div class="relative">
                                   <input type="number" min="0" step="any" [ngModel]="approveExpectedAmount()" (ngModelChange)="approveExpectedAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none" placeholder="VD: 5">
                                   <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{request.standardDetails?.unit}}</span>
                               </div>
                           </div>
                       </div>

                       <div>
                           <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                           <textarea [ngModel]="approvePurpose()" (ngModelChange)="approvePurpose.set($event)" rows="3" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" placeholder="Nhập mục đích bàn giao..."></textarea>
                       </div>
                   </div>

                   <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy Bỏ</button>
                       <button (click)="onApprove()" [disabled]="!approvePurpose() || isProcessing" class="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-base rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2 active:scale-95">
                           @if(isProcessing) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                           @else { <i class="fa-solid fa-check-circle text-sm"></i> Xác nhận & Giao }
                       </button>
                   </div>
               </div>
           </div>
       </div>
    }

    <!-- REJECT MODAL -->
    @if (activeModal === 'reject' && request) {
       <div class="requests-modal-layer fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
          <div role="dialog" aria-modal="true" class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
              <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-red-50/50 dark:bg-red-900/10">
                  <h3 class="font-black text-red-600 dark:text-red-400 text-xl flex items-center gap-2">
                      <i class="fa-solid fa-ban"></i> Từ Chối Yêu Cầu
                  </h3>
                  <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-red-400 transition"><i class="fa-solid fa-times"></i></button>
              </div>

              <div class="p-8 bg-white dark:bg-slate-900">
                  <div class="mb-6">
                      <p class="text-base font-medium text-slate-600 dark:text-slate-300">
                          Bạn đang từ chối yêu cầu của <strong>{{request.requestedByName}}</strong> cho chuẩn <strong>{{request.standardName}}</strong>.
                      </p>
                  </div>
                  <div>
                      <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lý do từ chối <span class="text-red-500">*</span></label>
                      <textarea [ngModel]="rejectReason()" (ngModelChange)="rejectReason.set($event)" rows="3" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none resize-none" placeholder="Nhập lý do cụ thể..."></textarea>
                  </div>

                  <div class="flex justify-end gap-3 mt-8">
                      <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                      <button (click)="onReject()" [disabled]="!rejectReason().toString().trim() || isProcessing" class="px-8 py-3 bg-red-600 text-white font-bold text-base rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 dark:shadow-none transition disabled:opacity-50">
                          Xác Nhận từ Chối
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }

    <!-- RETURN MODAL -->
    @if (activeModal === 'return' && request) {
       <div class="requests-modal-layer fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
          <div role="dialog" aria-modal="true" class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
              <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10">
                  <h3 class="font-black text-indigo-600 dark:text-indigo-400 text-xl flex items-center gap-2">
                      <i class="fa-solid fa-rotate-left"></i>
                      {{ isForceReturn ? 'Thu hồi chuẩn' : 'Hoàn trả chuẩn' }}
                  </h3>
                  <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-indigo-400 transition"><i class="fa-solid fa-times"></i></button>
              </div>

              <div class="p-8 space-y-6 bg-white dark:bg-slate-900">
                  <div class="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30">
                      <h4 class="font-black text-slate-800 dark:text-slate-100 leading-tight mb-2">{{request.standardName}}</h4>
                      <div class="flex justify-between items-center">
                          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Tồn kho hiện tại</span>
                          <span class="font-black text-indigo-600">{{formatNum(standard?.current_amount || request.standardDetails?.current_amount || 0)}} {{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                      </div>
                  </div>

                  @if ((request.totalAmountUsed || 0) > 0) {
                      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/40 space-y-2">
                          <div class="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-black text-base">
                              <i class="fa-solid fa-circle-info"></i>
                              Tổng đã ghi nhận: <span class="text-blue-800 dark:text-blue-200">{{request.totalAmountUsed || 0}} {{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                          </div>
                          @if (isForceReturn) {
                              <p class="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-xl border border-amber-200 dark:border-amber-800/40">
                                  <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                                  Kho đã được trừ theo từng đợt. Nếu số xác nhận lớn hơn tổng đã ghi, phần chênh lệch sẽ được trừ kho và tạo nhật ký điều chỉnh.
                              </p>
                          } @else {
                              <p class="text-sm text-blue-600 dark:text-blue-400">
                                  Kho đã được trừ theo từng đợt. Số báo cáo bên dưới chỉ để admin xác nhận.
                              </p>
                          }
                      </div>

                      <div>
                          <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Số lượng báo cáo (ghi sổ)</label>
                          <div class="relative">
                              <input type="number" [min]="minimumLoggedAmount()" step="any" [ngModel]="returnAmount()" (ngModelChange)="returnAmount.set($event)" class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Số lượng...">
                              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                          </div>
                      </div>
                  } @else {
                      <div>
                          <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng thực tế đã dùng <span class="text-red-500">*</span></label>
                          <div class="relative">
                              <input type="number" min="0" step="any" [ngModel]="returnAmount()" (ngModelChange)="returnAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Nhập số lượng...">
                              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                          </div>
                          @if (returnAmount() !== null && returnAmount()! > (standard?.current_amount || request.standardDetails?.current_amount || 0)) {
                              <p class="text-red-500 text-xs font-bold mt-2 flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation"></i> Vượt quá tồn kho hiện hành ({{formatNum(standard?.current_amount || request.standardDetails?.current_amount || 0)}})</p>
                          }
                      </div>
                  }
                  
                  <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                      <input type="checkbox" id="isDepleted" [ngModel]="returnIsDepleted()" (ngModelChange)="returnIsDepleted.set($event)" class="w-5 h-5 accent-amber-600 rounded-lg">
                      <label for="isDepleted" class="text-sm font-bold text-amber-700 dark:amber-400 cursor-pointer">Đánh dấu chuẩn đã dùng hết (Depleted)</label>
                  </div>

                  <div class="space-y-2 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 bg-indigo-50/40 dark:bg-indigo-900/10 p-4">
                      <div class="flex items-center justify-between">
                           <label class="text-sm font-black text-indigo-700 dark:text-indigo-300">Nhãn phương pháp thử <span class="font-medium text-indigo-500">(chọn nhiều, {{returnSopTags().length}}/{{maxReturnTags}})</span></label>
                          <button type="button" (click)="returnSopTags.set([])" class="text-xs font-bold text-slate-500 hover:text-red-600">Xóa nhãn</button>
                      </div>
                       <p class="text-[11px] text-indigo-600/80 dark:text-indigo-300/80">Một báo cáo có thể gắn nhiều phương pháp hóa học cùng lúc.</p>
                       <div class="flex gap-2">
                          <select [ngModel]="returnTagToAdd()" (ngModelChange)="returnTagToAdd.set($event)" class="min-w-0 flex-1 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                              <option value="">Chọn nhãn trong danh mục...</option>
                               @for (option of tagOptions(); track option.key) { <option [value]="option.key">{{formatTagLabel(option)}}</option> }
                          </select>
                          <button type="button" (click)="addReturnTag()" [disabled]="!returnTagToAdd() || returnSopTags().length >= maxReturnTags" class="rounded-xl bg-indigo-600 px-3 py-2 text-white font-bold disabled:opacity-40">Thêm</button>
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                          @for (key of returnSopTags(); track key) {
                               <span class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300" [title]="formatTagLabel(tagCatalog.resolveTag(key))">{{formatTagLabel(tagCatalog.resolveTag(key))}}<button type="button" (click)="removeReturnTag(key)" class="text-indigo-400 hover:text-red-500">×</button></span>
                          }
                      </div>
                  </div>

                  <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                      <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                      <button (click)="onReturn()" [disabled]="returnAmount() === null || returnAmount()! < minimumLoggedAmount() || isProcessing" class="px-8 py-3 bg-indigo-600 text-white font-bold text-base rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50">
                          Xác nhận trả
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }

    <!-- LOG USAGE MODAL -->
    @if (activeModal === 'logUsage' && request) {
       <div class="requests-modal-layer fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
          <div role="dialog" aria-modal="true" class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
              <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-teal-50/50 dark:bg-teal-900/10">
                  <h3 class="font-black text-teal-600 dark:text-teal-400 text-xl flex items-center gap-2">
                      <i class="fa-solid fa-vial-circle-check"></i> Ghi Nhận Đợt Dùng
                  </h3>
                  <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-teal-400 transition"><i class="fa-solid fa-times"></i></button>
              </div>

              <div class="p-8 space-y-6 bg-white dark:bg-slate-900">
                  <div>
                      <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Khối lượng đợt này <span class="text-red-500">*</span></label>
                      <div class="relative">
                          <input type="number" min="0" step="any" [ngModel]="logUsageAmount()" (ngModelChange)="logUsageAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-teal-500 outline-none pr-12" placeholder="VD: 5.25">
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{request.standardDetails?.unit}}</span>
                      </div>
                      @if (logUsageAmount() !== null && logUsageAmount()! > (standard?.current_amount || request.standardDetails?.current_amount || 0)) {
                          <p class="text-red-500 text-xs font-bold mt-2 flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation"></i> Vượt quá tồn kho hiện hành ({{formatNum(standard?.current_amount || request.standardDetails?.current_amount || 0)}})</p>
                      }
                  </div>

                  <div>
                      <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ghi chú đợt dùng</label>
                      <textarea [ngModel]="logUsagePurpose()" (ngModelChange)="logUsagePurpose.set($event)" rows="2" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-teal-500 transition-all outline-none resize-none" placeholder="VD: Dùng cho mẫu phân tích lô X..."></textarea>
                  </div>

                  <div class="flex justify-end gap-3 mt-4">
                      <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                      <button (click)="onLogUsage()" [disabled]="logUsageAmount() === null || logUsageAmount()! <= 0 || isProcessing || (logUsageAmount()! > (standard?.current_amount || request.standardDetails?.current_amount || 0))" class="px-8 py-3 bg-teal-600 text-white font-bold text-base rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-200 dark:shadow-none transition disabled:opacity-50">
                          Lưu nhật ký dùng
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }

    <!-- ADMIN RECEIVE RETURN MODAL -->
    @if (activeModal === 'adminReceive' && request) {
       <div class="requests-modal-layer fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
           <div role="dialog" aria-modal="true" class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
              <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10">
                  <h3 class="font-black text-indigo-700 dark:text-indigo-400 text-xl flex items-center gap-2">
                      <i class="fa-solid fa-clipboard-check"></i> Xác Nhận Nhập Kho Trả
                  </h3>
                  <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-indigo-400 transition"><i class="fa-solid fa-times"></i></button>
              </div>

              <div class="p-6 md:p-8 space-y-6 bg-white dark:bg-slate-900 overflow-y-auto">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                      <div class="flex flex-col">
                          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">NV báo cáo dùng</span>
                          <span class="text-xl font-black text-indigo-600">{{request.totalAmountUsed}} {{request.standardDetails?.unit}}</span>
                      </div>
                      <div class="flex flex-col">
                          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Trạng thái</span>
                          <span class="text-base font-bold" [class]="request.reportedDepleted ? 'text-red-500' : 'text-emerald-500'">
                              {{ request.reportedDepleted ? 'Báo cáo đã hết' : 'Vẫn còn chuẩn' }}
                          </span>
                      </div>
                  </div>

                  <div>
                      <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng thực tế trừ kho <span class="text-red-500">*</span></label>
                      <div class="relative">
                          <input type="number" [min]="minimumLoggedAmount()" step="any" [ngModel]="adminReceiveAmount()" (ngModelChange)="adminReceiveAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Xác nhận số lượng thực tế...">
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{request.standardDetails?.unit}}</span>
                      </div>
                  </div>
                  
                  <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                      <input type="checkbox" id="adminIsDepleted" [ngModel]="adminReceiveIsDepleted()" (ngModelChange)="adminReceiveIsDepleted.set($event)" class="w-5 h-5 accent-amber-600 rounded-lg">
                      <label for="adminIsDepleted" class="text-sm font-bold text-amber-700 dark:amber-400 cursor-pointer">Xác nhận chuẩn đã dùng hết (Hủy chuẩn)</label>
                  </div>

                  @if(adminReceiveIsDepleted()) {
                      <div class="fade-in">
                          <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lý do hủy chuẩn <span class="text-red-500">*</span></label>
                          <textarea [ngModel]="adminReceiveDisposalReason()" (ngModelChange)="adminReceiveDisposalReason.set($event)" rows="2" class="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-red-500 outline-none resize-none" placeholder="Nhập lý do như: Hết hạn, hỏng, hoặc dùng hết..."></textarea>
                      </div>
                  }

                  <div class="space-y-2 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 bg-indigo-50/40 dark:bg-indigo-900/10 p-4">
                      <div class="flex items-center justify-between">
                           <label class="text-sm font-black text-indigo-700 dark:text-indigo-300">Phương pháp quyết định cuối của Admin <span class="font-medium text-indigo-500">(chọn nhiều, {{adminFinalSopTags().length}}/{{maxReturnTags}})</span></label>
                          <button type="button" (click)="adminFinalSopTags.set([])" class="text-xs font-bold text-slate-500 hover:text-red-600">Xóa nhãn</button>
                      </div>
                       <p class="text-[11px] text-indigo-600/80 dark:text-indigo-300/80">Có thể xác nhận nhiều phương pháp áp dụng cho cùng một chuẩn.</p>
                       <div class="flex gap-2">
                          <select [ngModel]="adminTagToAdd()" (ngModelChange)="adminTagToAdd.set($event)" class="min-w-0 flex-1 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                              <option value="">Chọn nhãn trong danh mục...</option>
                               @for (option of tagOptions(); track option.key) { <option [value]="option.key">{{formatTagLabel(option)}}</option> }
                          </select>
                          <button type="button" (click)="addAdminTag()" [disabled]="!adminTagToAdd() || adminFinalSopTags().length >= maxReturnTags" class="rounded-xl bg-indigo-600 px-3 py-2 text-white font-bold disabled:opacity-40">Thêm</button>
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                          @for (key of adminFinalSopTags(); track key) {
                               <span class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300" [title]="formatTagLabel(tagCatalog.resolveTag(key))">{{formatTagLabel(tagCatalog.resolveTag(key))}}<button type="button" (click)="removeAdminTag(key)" class="text-indigo-400 hover:text-red-500">×</button></span>
                          }
                      </div>
                  </div>

                  <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                      <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                      <button (click)="onAdminReceive()" [disabled]="adminReceiveAmount() === null || adminReceiveAmount()! < minimumLoggedAmount() || (adminReceiveIsDepleted() && !adminReceiveDisposalReason()) || isProcessing" class="px-8 py-3 bg-indigo-600 text-white font-bold text-base rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50">
                          Hoàn Tất Tiếp Nhận
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }
  `
            }]
    }], null, { activeModal: [{
            type: Input
        }], request: [{
            type: Input
        }], standard: [{
            type: Input
        }], isForceReturn: [{
            type: Input
        }], isProcessing: [{
            type: Input
        }], close: [{
            type: Output
        }], approveAction: [{
            type: Output
        }], rejectAction: [{
            type: Output
        }], logUsageAction: [{
            type: Output
        }], returnAction: [{
            type: Output
        }], adminReceiveAction: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RequestsActionModalsComponent, { className: "RequestsActionModalsComponent", filePath: "src/app/features/standards/requests/components/requests-action-modals.component.ts", lineNumber: 343 }); })();
//# sourceMappingURL=requests-action-modals.component.js.map