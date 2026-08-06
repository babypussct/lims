import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StandardService } from './standard.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { StateService } from '../../core/services/state.service';
import { formatNum, getAvatarUrl, getStandardStatus, getStorageInfo, getExpiryClass, getExpiryTimeLeft, canAssign } from '../../shared/utils/utils';
import { getFefoPredecessor, getFefoPriorityStandard, getSameStandardLots, isFefoCandidate, sortStandardsByFefo } from '../../shared/utils/standard-fefo';
import { StandardsFormModalComponent } from './components/standards-form-modal.component';
import { StandardsPrintModalComponent } from './components/standards-print-modal.component';
import { StandardsPurchaseModalComponent } from './components/standards-purchase-modal.component';
import { StandardsAssignModalComponent } from './components/standards-assign-modal.component';
import { PrintService } from '../../core/services/print.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { LockPermissionDirective } from '../../shared/directives/lock-permission.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = (a0, a1, a2) => [a0, a1, a2];
const _forTrack0 = ($index, $item) => $item.id;
function StandardDetailComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵelement(1, "div", 20)(2, "div", 21);
    i0.ɵɵelementStart(3, "div", 22);
    i0.ɵɵelement(4, "div", 23)(5, "div", 24);
    i0.ɵɵelementEnd()();
} }
function StandardDetailComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14)(1, "div", 25);
    i0.ɵɵelement(2, "i", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h2", 27);
    i0.ɵɵtext(4, "Kh\u00F4ng T\u00ECm Th\u1EA5y Ch\u1EA5t Chu\u1EA9n \u0110\u1ED1i Chi\u1EBFu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 28);
    i0.ɵɵtext(6, "D\u1EEF li\u1EC7u c\u00F3 th\u1EC3 \u0111\u00E3 b\u1ECB x\u00F3a ho\u1EB7c \u0111\u01B0\u1EDDng d\u1EABn kh\u00F4ng h\u1EE3p l\u1EC7. Vui l\u00F2ng ki\u1EC3m tra l\u1EA1i.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 29);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_17_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.goBack()); });
    i0.ɵɵtext(8, " Quay L\u1EA1i Danh S\u00E1ch ");
    i0.ɵɵelementEnd()();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 37);
    i0.ɵɵelement(1, "i", 102);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", std_r5.internal_id, "");
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 39);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r5.chemical_name);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_62_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 69);
    i0.ɵɵelement(1, "i", 103);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", std_r5.location, "");
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_63_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 70);
    i0.ɵɵtext(1, "Ch\u01B0a x\u00E1c \u0111\u1ECBnh");
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_For_69_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 72);
    i0.ɵɵelement(1, "i", 104);
    i0.ɵɵelementStart(2, "span", 105);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const info_r6 = ctx.$implicit;
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(3, _c0, info_r6.bg, info_r6.border, info_r6.color));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", info_r6.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(info_r6.text);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "span", 68);
    i0.ɵɵtext(2, "\u0110\u1ED9 tinh khi\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 73);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(std_r5.purity);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_76_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "span", 68);
    i0.ɵɵtext(2, "CAS Number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 106);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(std_r5.cas_number);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_85_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 107);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_85_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const std_r5 = i0.ɵɵnextContext(); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openCoaPreview(std_r5.certificate_ref)); });
    i0.ɵɵelement(1, "i", 108);
    i0.ɵɵtext(2, " Xem CoA ");
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_87_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 80);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_88_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 81);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_116_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 92)(1, "div", 109);
    i0.ɵɵelement(2, "i", 110);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "span", 111);
    i0.ɵɵtext(5, "H\u1EE3p \u0111\u1ED3ng / PO");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 73);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(std_r5.contract_ref);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_117_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 117);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_117_Conditional_8_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.goToReturn()); });
    i0.ɵɵelement(1, "i", 118);
    i0.ɵɵtext(2, " Tr\u1EA3 Ch\u1EA5t Chu\u1EA9n ");
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_117_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 93)(1, "div", 112);
    i0.ɵɵelement(2, "i", 113);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 85)(4, "h4", 114);
    i0.ɵɵtext(5, "\u0110ang \u0110\u01B0\u1EE3c M\u01B0\u1EE3n B\u1EDFi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 115);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(8, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_117_Conditional_8_Template, 3, 0, "button", 116);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext();
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(std_r5.current_holder);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canReturnStandard() ? 8 : -1);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 121);
    i0.ɵɵelement(1, "i", 123);
    i0.ɵɵelementStart(2, "span")(3, "strong");
    i0.ɵɵtext(4, "G\u1EE3i \u00FD FEFO:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5, " L\u1ECD ");
    i0.ɵɵelementStart(6, "strong");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8);
    i0.ɵɵpipe(9, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 124);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_4_Template_button_click_10_listener() { const warn_r10 = i0.ɵɵrestoreView(_r9); const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.navigateToRelated(warn_r10.id)); });
    i0.ɵɵtext(11, " Chuy\u1EC3n sang L\u1ECD \u01AFu Ti\u00EAn ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const warn_r10 = ctx;
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(warn_r10.internal_id || warn_r10.lot_number);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" (h\u1EBFt h\u1EA1n: ", warn_r10.expiry_date ? i0.ɵɵpipeBind2(9, 2, warn_r10.expiry_date, "dd/MM/yyyy") : "N/A", ") n\u00EAn \u0111\u01B0\u1EE3c c\u1EA5p tr\u01B0\u1EDBc l\u1ECD n\u00E0y. ");
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 125);
    i0.ɵɵelement(1, "i", 128);
    i0.ɵɵtext(2, " \u0110ang Ch\u1EDD Duy\u1EC7t ");
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 129);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r2.openAssignModal(true)); });
    i0.ɵɵelement(1, "i", 130);
    i0.ɵɵtext(2, " G\u00E1n cho M\u01B0\u1EE3n ");
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 131);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Conditional_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r2.openAssignModal(false)); });
    i0.ɵɵelement(1, "i", 130);
    i0.ɵɵtext(2, " \u0110\u0103ng K\u00FD M\u01B0\u1EE3n Chu\u1EA9n ");
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Conditional_0_Template, 3, 0, "button", 125)(1, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Conditional_1_Template, 3, 0, "button", 126)(2, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Conditional_2_Template, 3, 0, "button", 127);
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext(2);
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(std_r5.has_pending_request ? 0 : ctx_r2.canAssignStandards() ? 1 : ctx_r2.canRequestStandards() ? 2 : -1);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_6_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 134);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_6_Conditional_0_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r2 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r2.openPurchaseModal()); });
    i0.ɵɵelement(1, "i", 135);
    i0.ɵɵtext(2, " \u0110\u1EC1 Ngh\u1ECB Mua Th\u00EAm ");
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_6_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 133);
    i0.ɵɵelement(1, "i", 136);
    i0.ɵɵtext(2, " \u0110\u00E3 c\u00F3 y\u00EAu c\u1EA7u mua ");
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_6_Conditional_0_Template, 3, 0, "button", 132)(1, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_6_Conditional_1_Template, 3, 0, "span", 133);
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(!std_r5.restock_requested ? 0 : 1);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 137);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_7_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r14); const std_r5 = i0.ɵɵnextContext(2); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.requestCoa(std_r5)); });
    i0.ɵɵelement(1, "i", 138);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("opacity-50", !!std_r5.coa_requested_by);
    i0.ɵɵproperty("disabled", !!std_r5.coa_requested_by);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-file-signature", !std_r5.coa_requested_by)("fa-clock-rotate-left", !!std_r5.coa_requested_by);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", std_r5.coa_requested_by ? "\u0110\u00E3 y\u00EAu c\u1EA7u CoA" : "Y\u00EAu c\u1EA7u c\u1EADp nh\u1EADt CoA", " ");
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 94)(1, "span", 119);
    i0.ɵɵelement(2, "i", 120);
    i0.ɵɵtext(3, " T\u00E1c v\u1EE5 nhanh:");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_4_Template, 12, 5, "div", 121)(5, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_5_Template, 3, 1)(6, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_6_Template, 2, 1)(7, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Conditional_7_Template, 3, 8, "button", 122);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_5_0;
    const std_r5 = i0.ɵɵnextContext();
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional((tmp_5_0 = ctx_r2.fefoWarningSibling()) ? 4 : -1, tmp_5_0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canAssign(std_r5) ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((std_r5.status === "DEPLETED" || std_r5.current_amount <= 0) && ctx_r2.canRequestPurchase() ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canRequestCoa() ? 7 : -1);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 139);
    i0.ɵɵelement(1, "i", 140);
    i0.ɵɵelementStart(2, "p", 141);
    i0.ɵɵtext(3, "\u0110ang t\u1EA3i l\u1ECBch s\u1EED...");
    i0.ɵɵelementEnd()();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_For_12_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 159);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_For_12_Conditional_13_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r15); const log_r16 = i0.ɵɵnextContext().$implicit; const std_r5 = i0.ɵɵnextContext(3); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.deleteLog(log_r16, std_r5.id)); });
    i0.ɵɵelement(1, "i", 160);
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 148)(1, "td", 150);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 151);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 152)(6, "div", 153);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 154);
    i0.ɵɵelement(9, "img", 155);
    i0.ɵɵelementStart(10, "span", 156);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "td", 157);
    i0.ɵɵtemplate(13, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_For_12_Conditional_13_Template, 2, 0, "button", 158);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const log_r16 = ctx.$implicit;
    const std_r5 = i0.ɵɵnextContext(3);
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(log_r16.date);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum(log_r16.amount_used), " ", std_r5.unit, "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(log_r16.purpose);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("src", ctx_r2.getAvatarUrl(log_r16.user, ctx_r2.state.getUserAvatarOptions(log_r16.user).style, ctx_r2.state.getUserAvatarOptions(log_r16.user).photoURL), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(log_r16.user);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.canDeleteStandardLogs() ? 13 : -1);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_ForEmpty_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 161);
    i0.ɵɵtext(2, "Ch\u01B0a c\u00F3 l\u1ECBch s\u1EED s\u1EED d\u1EE5ng cho chu\u1EA9n n\u00E0y.");
    i0.ɵɵelementEnd()();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_Conditional_14_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 163);
    i0.ɵɵtext(1, " \u0110ang t\u1EA3i... ");
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_Conditional_14_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " T\u1EA3i th\u00EAm l\u1ECBch s\u1EED ");
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 149)(1, "button", 162);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_Conditional_14_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r2.loadMoreHistory()); });
    i0.ɵɵtemplate(2, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_Conditional_14_Conditional_2_Template, 2, 0)(3, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_Conditional_14_Conditional_3_Template, 1, 0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.loadingMoreHistory());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.loadingMoreHistory() ? 2 : 3);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "table", 142)(1, "thead", 143)(2, "tr")(3, "th", 144);
    i0.ɵɵtext(4, "Ng\u00E0y thao t\u00E1c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "th", 145);
    i0.ɵɵtext(6, "L\u01B0\u1EE3ng s\u1EED d\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "th", 144);
    i0.ɵɵtext(8, "M\u1EE5c \u0111\u00EDch / Ng\u01B0\u1EDDi d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "th", 146);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "tbody", 147);
    i0.ɵɵrepeaterCreate(11, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_For_12_Template, 14, 7, "tr", 148, _forTrack0, false, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_ForEmpty_13_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(14, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_Conditional_14_Template, 4, 2, "div", 149);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(11);
    i0.ɵɵrepeater(ctx_r2.usageLogs());
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r2.hasMoreHistory() ? 14 : -1);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_0_Template, 4, 0, "div", 139)(1, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Conditional_1_Template, 15, 2);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional(ctx_r2.loadingHistory() ? 0 : 1);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 164);
    i0.ɵɵelement(1, "i", 167);
    i0.ɵɵelementStart(2, "p", 168);
    i0.ɵɵtext(3, " Th\u1EE9 t\u1EF1 ");
    i0.ɵɵelementStart(4, "strong");
    i0.ɵɵtext(5, "FEFO");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(6, ": h\u1EA1n g\u1EA7n nh\u1EA5t \u2192 \u00EDt l\u01B0\u1EE3ng \u2192 ng\u00E0y nh\u1EADn c\u0169 nh\u1EA5t. L\u00F4 n\u00EAn c\u1EA5p ti\u1EBFp theo: ");
    i0.ɵɵelementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const priority_r18 = ctx;
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(priority_r18.internal_id || priority_r18.lot_number || priority_r18.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" (", priority_r18.expiry_date ? i0.ɵɵpipeBind2(10, 2, priority_r18.expiry_date, "dd/MM/yyyy") : "ch\u01B0a r\u00F5 h\u1EA1n", "). ");
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_For_17_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 170);
    i0.ɵɵelement(1, "i", 177);
    i0.ɵɵtext(2, " \u01AFu ti\u00EAn ");
    i0.ɵɵelementEnd();
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_For_17_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 169);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_For_17_Template_tr_click_0_listener() { const rStd_r20 = i0.ɵɵrestoreView(_r19).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.navigateToRelated(rStd_r20.id)); });
    i0.ɵɵelementStart(1, "td", 152)(2, "div", 77)(3, "span", 73);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_For_17_Conditional_5_Template, 3, 0, "span", 170);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "td", 171);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td", 172);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td", 173);
    i0.ɵɵtext(11);
    i0.ɵɵpipe(12, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "td", 157)(14, "span", 174);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "td", 175);
    i0.ɵɵelement(17, "i", 176);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const rStd_r20 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(rStd_r20.internal_id || "N/A");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isFefoPriority(rStd_r20) ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(rStd_r20.lot_number || "-");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum(rStd_r20.current_amount), " ", rStd_r20.unit, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r2.getExpiryClass(rStd_r20.expiry_date));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(rStd_r20.expiry_date ? i0.ɵɵpipeBind2(12, 9, rStd_r20.expiry_date, "dd/MM/yyyy") : "N/A");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", ctx_r2.getStandardStatus(rStd_r20).class);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.getStandardStatus(rStd_r20).label);
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_ForEmpty_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 178);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r5 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Kh\u00F4ng c\u00F3 l\u1ECD chu\u1EA9n n\u00E0o kh\u00E1c c\u00F9ng t\u00EAn \"", std_r5.name, "\".");
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_Conditional_0_Template, 11, 5, "div", 164);
    i0.ɵɵelementStart(1, "table", 142)(2, "thead", 143)(3, "tr")(4, "th", 144);
    i0.ɵɵtext(5, "M\u00E3 (ID)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th", 144);
    i0.ɵɵtext(7, "Lot Number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th", 144);
    i0.ɵɵtext(9, "T\u1ED3n kho");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th", 144);
    i0.ɵɵtext(11, "H\u1EA1n d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "th", 165);
    i0.ɵɵtext(13, "Tr\u1EA1ng th\u00E1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(14, "th", 146);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "tbody", 147);
    i0.ɵɵrepeaterCreate(16, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_For_17_Template, 18, 12, "tr", 166, _forTrack0, false, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_ForEmpty_18_Template, 3, 1, "tr");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_5_0;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional((tmp_5_0 = ctx_r2.fefoPriorityStandard()) ? 0 : -1, tmp_5_0);
    i0.ɵɵadvance(16);
    i0.ɵɵrepeater(ctx_r2.relatedStandards());
} }
function StandardDetailComponent_Conditional_18_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 31);
    i0.ɵɵelement(2, "i", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 33)(4, "div", 34)(5, "span", 35);
    i0.ɵɵelement(6, "i", 36);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_8_Template, 3, 1, "span", 37);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "h1", 38);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_11_Template, 2, 1, "p", 39);
    i0.ɵɵelementStart(12, "div", 40)(13, "div", 41)(14, "span", 42);
    i0.ɵɵtext(15, "Lot Number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span", 43);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Template_span_click_16_listener() { const std_r5 = i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.copyText(std_r5.lot_number)); });
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(18, "div", 44);
    i0.ɵɵelementStart(19, "div", 41)(20, "span", 42);
    i0.ɵɵtext(21, "H\u00E3ng SX");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "span", 45);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(24, "div", 44);
    i0.ɵɵelementStart(25, "div", 41)(26, "span", 42);
    i0.ɵɵtext(27, "Product Code");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "span", 43);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Template_span_click_28_listener() { const std_r5 = i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.copyText(std_r5.product_code)); });
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(30, "div", 46);
    i0.ɵɵelement(31, "img", 47);
    i0.ɵɵelementStart(32, "div", 48);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Template_div_click_32_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openPrintModal()); });
    i0.ɵɵelement(33, "i", 49);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(34, "div", 50)(35, "div", 51)(36, "div", 52)(37, "div", 53);
    i0.ɵɵelement(38, "i", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "h3", 55);
    i0.ɵɵtext(40, "T\u1ED3n Kho & B\u1EA3o Qu\u1EA3n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(41, "div", 56)(42, "div", 57)(43, "div")(44, "span", 58);
    i0.ɵɵtext(45, "L\u01B0\u1EE3ng hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "div", 59)(47, "span", 60);
    i0.ɵɵtext(48);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "span", 61);
    i0.ɵɵtext(50);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(51, "div", 62)(52, "span", 63);
    i0.ɵɵtext(53, "L\u01B0\u1EE3ng ban \u0111\u1EA7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "span", 64);
    i0.ɵɵtext(55);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(56, "div", 65);
    i0.ɵɵelement(57, "div", 66);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(58, "div", 67)(59, "div")(60, "span", 68);
    i0.ɵɵtext(61, "V\u1ECB tr\u00ED l\u01B0u tr\u1EEF");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(62, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_62_Template, 3, 1, "div", 69)(63, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_63_Template, 2, 0, "span", 70);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(64, "div")(65, "span", 68);
    i0.ɵɵtext(66, "\u0110i\u1EC1u ki\u1EC7n b\u1EA3o qu\u1EA3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(67, "div", 71);
    i0.ɵɵrepeaterCreate(68, StandardDetailComponent_Conditional_18_Conditional_0_For_69_Template, 4, 7, "div", 72, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(70, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_70_Template, 5, 1, "div");
    i0.ɵɵelementStart(71, "div")(72, "span", 68);
    i0.ɵɵtext(73, "Quy c\u00E1ch \u0111\u00F3ng g\u00F3i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(74, "div", 73);
    i0.ɵɵtext(75);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(76, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_76_Template, 5, 1, "div");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(77, "div", 51)(78, "div", 74)(79, "div", 3)(80, "div", 75);
    i0.ɵɵelement(81, "i", 76);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(82, "h3", 55);
    i0.ɵɵtext(83, "H\u1EA1n D\u00F9ng & H\u1ED3 S\u01A1");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(84, "div", 77);
    i0.ɵɵtemplate(85, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_85_Template, 3, 0, "button", 78);
    i0.ɵɵelementStart(86, "button", 79);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Template_button_click_86_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.triggerQuickDriveUpload()); });
    i0.ɵɵtemplate(87, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_87_Template, 1, 0, "i", 80)(88, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_88_Template, 1, 0, "i", 81);
    i0.ɵɵtext(89);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(90, "div", 82)(91, "div", 83);
    i0.ɵɵelement(92, "i", 84);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(93, "div", 85)(94, "span", 58);
    i0.ɵɵtext(95, "H\u1EA1n S\u1EED D\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(96, "div", 86);
    i0.ɵɵtext(97);
    i0.ɵɵpipe(98, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(99, "div", 87);
    i0.ɵɵtext(100);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(101, "div", 88)(102, "div", 89)(103, "span", 68);
    i0.ɵɵelement(104, "i", 90);
    i0.ɵɵtext(105, " Ng\u00E0y nh\u1EADn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(106, "div", 73);
    i0.ɵɵtext(107);
    i0.ɵɵpipe(108, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(109, "div", 89)(110, "span", 68);
    i0.ɵɵelement(111, "i", 91);
    i0.ɵɵtext(112, " Ng\u00E0y m\u1EDF n\u1EAFp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(113, "div", 73);
    i0.ɵɵtext(114);
    i0.ɵɵpipe(115, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(116, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_116_Template, 8, 1, "div", 92);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(117, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_117_Template, 9, 2, "div", 93)(118, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_118_Template, 8, 4, "div", 94);
    i0.ɵɵelementStart(119, "div", 95)(120, "div", 96)(121, "button", 97);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Template_button_click_121_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.activeTab.set("usage")); });
    i0.ɵɵelement(122, "i", 98);
    i0.ɵɵtext(123, " Nh\u1EADt K\u00FD S\u1EED D\u1EE5ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(124, "button", 97);
    i0.ɵɵlistener("click", function StandardDetailComponent_Conditional_18_Conditional_0_Template_button_click_124_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.activeTab.set("related")); });
    i0.ɵɵelement(125, "i", 99);
    i0.ɵɵtext(126, " L\u1ECD Chu\u1EA9n C\u00F9ng T\u00EAn ");
    i0.ɵɵelementStart(127, "span", 100);
    i0.ɵɵtext(128);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(129, "div", 101);
    i0.ɵɵtemplate(130, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_130_Template, 2, 1)(131, StandardDetailComponent_Conditional_18_Conditional_0_Conditional_131_Template, 19, 2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r5 = ctx;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngClass", ctx_r2.statusInfo().class);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("animate-pulse", std_r5.status === "IN_USE" || std_r5.current_amount <= 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.statusInfo().label, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r5.internal_id ? 8 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", std_r5.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r5.chemical_name ? 11 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(std_r5.lot_number || "N/A");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(std_r5.manufacturer || "N/A");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(std_r5.product_code || "N/A");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("src", ctx_r2.qrCodeUrl(), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(17);
    i0.ɵɵtextInterpolate(ctx_r2.formatNum(std_r5.current_amount));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(std_r5.unit);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum(std_r5.initial_amount || 0), " ", std_r5.unit, "");
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ctx_r2.Math.min(std_r5.current_amount / (std_r5.initial_amount || 1) * 100, 100), "%");
    i0.ɵɵclassProp("bg-emerald-500", std_r5.current_amount / (std_r5.initial_amount || 1) > 0.2)("bg-rose-500", std_r5.current_amount / (std_r5.initial_amount || 1) <= 0.2);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(std_r5.location ? 62 : 63);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r2.storageInfo());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r5.purity ? 70 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(std_r5.pack_size || "N/A");
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r5.cas_number ? 76 : -1);
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(std_r5.certificate_ref ? 85 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("appLockPermission", "standard_edit")("disabled", ctx_r2.isUploadingCoa());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isUploadingCoa() ? 87 : 88);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", std_r5.certificate_ref ? "C\u1EADp nh\u1EADt CoA" : "T\u1EA3i CoA l\u00EAn", " ");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", ctx_r2.expiryInfo().colorClass);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngClass", ctx_r2.expiryInfo().colorClass);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r5.expiry_date ? i0.ɵɵpipeBind2(98, 47, std_r5.expiry_date, "dd/MM/yyyy") : "N/A");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", ctx_r2.expiryInfo().colorClass);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.expiryInfo().timeLeftText);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(std_r5.received_date ? i0.ɵɵpipeBind2(108, 50, std_r5.received_date, "dd/MM/yyyy") : "N/A");
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r2.effectiveOpenDate() ? i0.ɵɵpipeBind2(115, 53, ctx_r2.effectiveOpenDate(), "dd/MM/yyyy") : "Ch\u01B0a m\u1EDF n\u1EAFp");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r5.contract_ref ? 116 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r5.status === "IN_USE" && std_r5.current_holder ? 117 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canAssign(std_r5) && (ctx_r2.canAssignStandards() || ctx_r2.canRequestStandards()) || (std_r5.status === "DEPLETED" || std_r5.current_amount <= 0) && ctx_r2.canRequestPurchase() || ctx_r2.canRequestCoa() ? 118 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r2.activeTab() === "usage" ? "border-indigo-600 text-indigo-700 dark:text-indigo-400 dark:border-indigo-500" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r2.activeTab() === "related" ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r2.relatedStandards().length);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.activeTab() === "usage" ? 130 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeTab() === "related" ? 131 : -1);
} }
function StandardDetailComponent_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardDetailComponent_Conditional_18_Conditional_0_Template, 132, 56);
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵconditional((tmp_2_0 = ctx_r2.standard()) ? 0 : -1, tmp_2_0);
} }
function StandardDetailComponent_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-form-modal", 179);
    i0.ɵɵlistener("closeModal", function StandardDetailComponent_Conditional_19_Template_app_standards_form_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r21); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onModalSaved()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("std", ctx_r2.standard())("isOpen", true)("allStandards", ctx_r2.allStandardsCache());
} }
function StandardDetailComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r22 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-print-modal", 180);
    i0.ɵɵlistener("closeModal", function StandardDetailComponent_Conditional_20_Template_app_standards_print_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r22); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showPrintModal.set(false)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("std", ctx_r2.standard())("isOpen", true);
} }
function StandardDetailComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r23 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-purchase-modal", 181);
    i0.ɵɵlistener("closeModal", function StandardDetailComponent_Conditional_21_Template_app_standards_purchase_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r23); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showPurchaseModal.set(false)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("selectedStd", ctx_r2.standard())("isOpen", true);
} }
export class StandardDetailComponent {
    constructor() {
        this.route = inject(ActivatedRoute);
        this.router = inject(Router);
        this.stdService = inject(StandardService);
        this.firebaseService = inject(FirebaseService);
        this.auth = inject(AuthService);
        this.toast = inject(ToastService);
        this.state = inject(StateService);
        this.confirmation = inject(ConfirmationService);
        this.location = inject(Location);
        this.confirmationService = inject(ConfirmationService);
        this.sanitizer = inject(DomSanitizer);
        this.printService = inject(PrintService);
        this.googleDriveService = inject(GoogleDriveService);
        this.Math = Math;
        this.formatNum = formatNum;
        this.getAvatarUrl = getAvatarUrl;
        this.getStandardStatus = getStandardStatus;
        this.getStorageInfo = getStorageInfo;
        this.getExpiryClass = getExpiryClass;
        this.getExpiryTimeLeft = getExpiryTimeLeft;
        this.canAssign = canAssign;
        this.currentUserUid = computed(() => this.auth.currentUser()?.uid || '');
        this.currentUserName = computed(() => this.auth.currentUser()?.displayName || '');
        this.standardId = signal('');
        this.standard = signal(null);
        this.isLoading = signal(true);
        this.notFound = signal(false);
        this.usageLogs = signal([]);
        this.loadingHistory = signal(false);
        this.loadingMoreHistory = signal(false);
        this.hasMoreHistory = signal(false);
        this.isProcessing = signal(false);
        this.allStandardsCache = signal([]);
        this.usageHistoryPageSize = 100;
        this.historyLastDoc = null;
        this.activeTab = signal('usage');
        // Modals state
        this.showEditModal = signal(false);
        this.showPrintModal = signal(false);
        this.showPurchaseModal = signal(false);
        this.showAssignModal = signal(false);
        this.isAssignMode = signal(true);
        this.userList = signal([]);
        this.isUploadingCoa = signal(false);
        // Computed Properties
        this.effectiveOpenDate = computed(() => {
            const std = this.standard();
            if (!std)
                return null;
            if (std.date_opened)
                return std.date_opened;
            const logs = this.usageLogs();
            if (logs && logs.length > 0) {
                const earliestLog = logs.reduce((min, log) => {
                    const logTime = new Date(log.date).getTime();
                    const minTime = new Date(min.date).getTime();
                    return logTime < minTime ? log : min;
                }, logs[0]);
                return earliestLog.date;
            }
            return null;
        });
        this.statusInfo = computed(() => {
            const std = this.standard();
            if (!std)
                return { label: '', class: '' };
            return this.getStandardStatus(std);
        });
        this.storageInfo = computed(() => {
            const std = this.standard();
            if (!std)
                return [];
            return this.getStorageInfo(std.storage_condition);
        });
        this.expiryInfo = computed(() => {
            const std = this.standard();
            if (!std)
                return { timeLeftText: '', colorClass: '' };
            return {
                timeLeftText: this.getExpiryTimeLeft(std.expiry_date),
                colorClass: this.getExpiryClass(std.expiry_date)
            };
        });
        this.qrCodeUrl = computed(() => {
            const std = this.standard();
            if (!std)
                return '';
            const baseUrl = window.location.origin;
            return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(baseUrl + '/#/standards/' + std.id)}`;
        });
        this.canReturnStandard = computed(() => {
            const std = this.standard();
            if (!std)
                return false;
            const isEditor = this.auth.canAssignStandards();
            const isHolder = std.current_holder_uid === this.auth.currentUser()?.uid;
            return isEditor || isHolder;
        });
        this.canRequestCoa = computed(() => {
            const std = this.standard();
            if (!std)
                return false;
            return !std.certificate_ref &&
                this.auth.hasPermission('standard_request') &&
                !this.auth.canAssignStandards();
        });
        this.canAssignStandards = computed(() => this.auth.canAssignStandards());
        this.canRequestStandards = computed(() => this.auth.hasPermission('standard_request'));
        this.canRequestPurchase = computed(() => this.canRequestStandards() || this.canAssignStandards());
        this.canDeleteStandardLogs = computed(() => this.auth.canDeleteStandardLogs());
        this.relatedStandards = computed(() => {
            const std = this.standard();
            const all = this.allStandardsCache();
            if (!std || all.length === 0)
                return [];
            return sortStandardsByFefo(getSameStandardLots(std, all, false));
        });
        /**
         * Trả về lọ cùng tên nên dùng trước lọ hiện tại (theo FEFO).
         * Dùng để hiển thị cảnh báo trong Action Shortcuts.
         */
        this.fefoWarningSibling = computed(() => {
            const std = this.standard();
            if (!std)
                return null;
            return getFefoPredecessor(std, this.allStandardsCache());
        });
        this.fefoPriorityStandard = computed(() => {
            const std = this.standard();
            if (!std)
                return null;
            return getFefoPriorityStandard(std, this.allStandardsCache());
        });
    }
    isFefoPriority(std) {
        return this.fefoPriorityStandard()?.id === std.id;
    }
    ngOnInit() {
        this.state.ensureUserInfoCacheListener();
        // Subscribe to route params to handle navigation between related standards
        this.routeSub = this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.standardId.set(id);
                this.loadStandardData(id);
                // Active usage tab by default on navigation
                this.activeTab.set('usage');
            }
        });
        // Register global listener to update if data changes in background
        this.liveUnsub = this.stdService.listenToStandards(() => {
            if (this.standardId()) {
                this.refreshStandardFromCache(this.standardId());
                this.refreshAllStandards();
            }
        });
    }
    ngOnDestroy() {
        if (this.routeSub)
            this.routeSub.unsubscribe();
        if (this.liveUnsub)
            this.liveUnsub();
    }
    async loadStandardData(id) {
        this.isLoading.set(true);
        this.notFound.set(false);
        try {
            const std = await this.stdService.getStandardById(id);
            if (std) {
                this.standard.set(std);
                this.loadHistory(id);
                this.refreshAllStandards();
            }
            else {
                this.notFound.set(true);
            }
        }
        catch (error) {
            console.error('Failed to load standard details:', error);
            this.notFound.set(true);
        }
        finally {
            this.isLoading.set(false);
        }
    }
    async refreshStandardFromCache(id) {
        // Soft refresh when delta listener triggers
        const std = await this.stdService.getStandardById(id);
        if (std)
            this.standard.set(std);
    }
    refreshAllStandards() {
        this.allStandardsCache.set(this.stdService.getAllStandardsFromCache());
    }
    async loadHistory(id) {
        this.loadingHistory.set(true);
        this.historyLastDoc = null;
        this.hasMoreHistory.set(false);
        try {
            const page = await this.stdService.getUsageHistoryPage(id, this.usageHistoryPageSize);
            this.usageLogs.set(page.items);
            this.historyLastDoc = page.lastDoc;
            this.hasMoreHistory.set(page.hasMore);
            // SELF-HEALING (Cách 1): Cập nhật ngầm ngày mở nắp nếu chưa có
            const std = this.standard();
            if (std && !std.date_opened && page.items.length > 0) {
                const earliestLog = page.hasMore
                    ? await this.stdService.getEarliestUsageLog(id)
                    : page.items.reduce((min, log) => {
                        const logTime = new Date(log.date).getTime();
                        const minTime = new Date(min.date).getTime();
                        return logTime < minTime ? log : min;
                    }, page.items[0]);
                if (earliestLog)
                    this.autoHealDateOpened(std.id, earliestLog.date);
            }
        }
        catch (error) {
            console.error('Failed to load history:', error);
        }
        finally {
            this.loadingHistory.set(false);
        }
    }
    async loadMoreHistory() {
        const id = this.standardId();
        if (!id || !this.hasMoreHistory() || !this.historyLastDoc || this.loadingMoreHistory())
            return;
        this.loadingMoreHistory.set(true);
        try {
            const page = await this.stdService.getUsageHistoryPage(id, this.usageHistoryPageSize, this.historyLastDoc);
            if (id !== this.standardId())
                return;
            const existingIds = new Set(this.usageLogs().map(log => log.id));
            this.usageLogs.update(logs => [
                ...logs,
                ...page.items.filter(log => !existingIds.has(log.id))
            ]);
            this.historyLastDoc = page.lastDoc;
            this.hasMoreHistory.set(page.hasMore);
        }
        catch (error) {
            console.error('Failed to load more history:', error);
        }
        finally {
            this.loadingMoreHistory.set(false);
        }
    }
    async autoHealDateOpened(id, date) {
        try {
            const ref = doc(this.firebaseService.db, `artifacts/${this.firebaseService.APP_ID}/reference_standards`, id);
            await updateDoc(ref, { date_opened: date, lastUpdated: serverTimestamp() });
            // Cập nhật lại UI local (dù delta sync cũng sẽ bắt được nhưng cập nhật luôn cho mượt)
            this.standard.update(s => s ? { ...s, date_opened: date } : s);
            console.log(`[Self-Heal] Đã cập nhật ngầm date_opened thành ${date} cho chuẩn ${id}`);
        }
        catch (e) {
            console.warn('Lỗi khi tự động cập nhật date_opened', e);
        }
    }
    // --- NAVIGATION & ACTIONS ---
    goBack() {
        this.router.navigate(['/standards']);
    }
    navigateToRelated(id) {
        this.router.navigate(['/standards', id]);
    }
    async openAssignModal(isAssign = true) {
        if (this.isProcessing() || !this.standard())
            return;
        this.isAssignMode.set(isAssign);
        this.showAssignModal.set(true);
        if (isAssign && this.userList().length === 0) {
            try {
                const users = await this.firebaseService.getAllUsers();
                this.userList.set(users);
            }
            catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }
    async confirmAssign(data) {
        const std = this.standard();
        if (!std || !data.userId || !data.purpose) {
            this.toast.show('Vui lòng điền đầy đủ thông tin bắt buộc (*)', 'error');
            return;
        }
        if (!isFefoCandidate(std)) {
            this.toast.show('Lô chuẩn không còn sẵn sàng để cấp. Vui lòng tải lại và chọn lô khác.', 'error');
            return;
        }
        this.isProcessing.set(true);
        try {
            const request = {
                standardId: std.id,
                standardName: std.name,
                lotNumber: std.lot_number,
                requestedBy: data.userId,
                requestedByName: data.userName,
                requestDate: Date.now(),
                purpose: data.purpose.trim(),
                expectedAmount: data.expectedAmount || 0,
                status: 'PENDING_APPROVAL',
                totalAmountUsed: 0
            };
            await this.stdService.createRequest(request, this.isAssignMode());
            if (this.isAssignMode()) {
                await this.stdService.dispenseStandard(request.id, std.id, this.auth.currentUser()?.uid || '', this.auth.currentUser()?.displayName || 'QTV', true);
            }
            this.toast.show(this.isAssignMode() ? 'Đã gán chuẩn thành công' : 'Đã gửi yêu cầu mượn chuẩn', 'success');
            this.showAssignModal.set(false);
            // Xử lý reload trạng thái
            if (this.standardId()) {
                this.loadStandardData(this.standardId());
            }
        }
        catch (error) {
            this.toast.show(error.message || 'Lỗi khi xử lý', 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    goToReturn() {
        this.router.navigate(['/standard-requests']);
        this.toast.show('Chuyển đến trang Yêu cầu chất chuẩn để hoàn trả', 'info');
    }
    openEditModal() {
        if (this.auth.hasPermission('standard_edit') && this.standard()) {
            this.showEditModal.set(true);
        }
    }
    openPrintModal() {
        if (this.standard())
            this.showPrintModal.set(true);
    }
    openPurchaseModal() {
        if (this.standard() && this.canRequestPurchase())
            this.showPurchaseModal.set(true);
    }
    async requestCoa(std) {
        if (this.isProcessing() || std.coa_requested_by || !this.canRequestCoa())
            return;
        this.confirmation.confirm({
            message: `Bạn đang gửi thông báo yêu cầu Quản trị viên bổ sung chứng nhận phân tích (CoA) cho chuẩn "${std.name}". Bạn có chắc chắn không?`,
            confirmText: 'Gửi yêu cầu',
            cancelText: 'Hủy'
        }).then(async (confirmed) => {
            if (!confirmed)
                return;
            this.isProcessing.set(true);
            try {
                // Optimistic UI update to prevent immediate double clicks
                const uid = this.auth.currentUser()?.uid;
                this.standard.update(s => s ? { ...s, coa_requested_by: uid } : s);
                await this.stdService.requestCoa(std);
                this.toast.show('Đã thông báo yêu cầu bổ sung CoA đến Quản trị viên.', 'success');
            }
            catch (e) {
                this.toast.show('Lỗi gửi yêu cầu: ' + e.message, 'error');
                // Revert on error
                this.standard.update(s => s ? { ...s, coa_requested_by: undefined } : s);
            }
            finally {
                this.isProcessing.set(false);
            }
        });
    }
    onModalSaved() {
        this.showEditModal.set(false);
        if (this.standardId()) {
            this.loadStandardData(this.standardId()); // Reload fresh data
        }
    }
    copyText(text) {
        if (!text)
            return;
        navigator.clipboard.writeText(text).then(() => this.toast.show('Đã sao chép: ' + text));
    }
    openCoaPreview(url) {
        this.printService.openCoaPreview(url, 'Chứng chỉ chất lượng (CoA)');
    }
    async deleteLog(log, stdId) {
        if (!log.id)
            return;
        if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
            try {
                await this.stdService.deleteUsageLog(stdId, log.id);
                this.toast.show('Đã xóa', 'success');
                await this.loadHistory(stdId);
            }
            catch (e) {
                this.toast.show('Lỗi: ' + e.message, 'error');
            }
        }
    }
    // --- Quick Upload CoA ---
    triggerQuickDriveUpload() {
        if (this.googleDriveService.hasValidToken) {
            const input = document.querySelector('#quickDriveInput');
            if (input) {
                input.click();
            }
            else {
                this.toast.show('Không tìm thấy ô chọn tệp.', 'error');
            }
        }
        else {
            // XÁC THỰC TRƯỚC: Nếu chưa có token, xác thực xong yêu cầu user nhấn lại để có user activation
            this.googleDriveService.authenticateSync(() => {
                this.toast.show('Đã kết nối Google Drive! Vui lòng nhấn lại nút Tải lên để chọn tệp.', 'success');
            }, (err) => {
                this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
            });
        }
    }
    async handleQuickDriveUpload(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        const std = this.standard();
        if (!std)
            return;
        try {
            this.isUploadingCoa.set(true);
            const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', file.name);
            this.toast.show(`Đang tải CoA lên cho "${std.name}"...`);
            const previewUrl = await this.googleDriveService.uploadFile(file, fileName);
            // Tìm tất cả các chuẩn cùng Tên và Số Lô từ Delta Sync cache
            const allStds = this.stdService.getAllStandardsFromCache();
            const lot = (std.lot_number || '').trim().toLowerCase();
            const siblings = lot
                ? allStds.filter(s => s.name.trim().toLowerCase() === std.name.trim().toLowerCase() &&
                    (s.lot_number || '').trim().toLowerCase() === lot &&
                    !s._isDeleted)
                : [std];
            await this.stdService.completeCoaUpload(siblings.length ? siblings : [std], previewUrl);
            // Cập nhật local signal cho view hiện tại
            this.standard.update(current => current ? { ...current, certificate_ref: previewUrl, coa_requested_by: undefined } : current);
            if (siblings.length > 1) {
                this.toast.show(`Upload thành công! Đã áp dụng CoA cho ${siblings.length} lọ chuẩn cùng lô.`);
            }
            else {
                this.toast.show(`Tải CoA lên thành công!`);
            }
        }
        catch (e) {
            console.error('Quick Drive upload error:', e);
            this.toast.show('Không thể tải CoA lên: ' + (e.message || 'Không xác định'), 'error');
        }
        finally {
            this.isUploadingCoa.set(false);
            event.target.value = '';
        }
    }
    static { this.ɵfac = function StandardDetailComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardDetailComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardDetailComponent, selectors: [["app-standard-detail"]], decls: 25, vars: 15, consts: [["quickDriveInput", ""], [1, "flex", "flex-col", "h-full", "bg-slate-50", "dark:bg-slate-900/50", "p-2", "md:p-4", "gap-4", "overflow-y-auto", "custom-scrollbar", "relative", "fade-in"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-2", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-slate-50", "dark:bg-slate-900", "text-slate-500", "hover:text-indigo-600", "dark:text-slate-400", "dark:hover:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm", "active:scale-95", "group", "shrink-0", 3, "click"], [1, "fa-solid", "fa-arrow-left", "group-hover:-translate-x-0.5", "transition-transform", "text-base"], [1, "text-xl", "font-black", "text-slate-855", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "gap-2", "items-center", "animate-fade-in", 3, "appLockPermission"], ["title", "In nh\u00E3n", 1, "w-10", "h-10", "rounded-xl", "flex", "items-center", "justify-center", "bg-slate-50", "dark:bg-slate-900", "text-slate-600", "dark:text-slate-300", "border", "border-slate-200", "dark:border-slate-700", "hover:bg-slate-100", "dark:hover:bg-slate-800", "transition", "shadow-sm", "active:scale-95", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-print"], [1, "flex", "items-center", "gap-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "px-4", "py-2.5", "rounded-xl", "shadow-md", "shadow-indigo-200", "dark:shadow-none", "transition", "font-bold", "text-xs", "active:scale-95", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-pen", "text-[10px]"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "p-6", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "flex", "flex-col", "gap-4", "animate-pulse"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "bg-white", "dark:bg-slate-800", "rounded-3xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "p-8", "text-center"], [3, "std", "isOpen", "allStandards"], [3, "std", "isOpen"], [3, "selectedStd", "isOpen"], [3, "closeModal", "confirm", "isOpen", "std", "isAssignMode", "userList", "isProcessing", "currentUserUid", "currentUserName", "sameName"], ["id", "quickDriveInput", "type", "file", "accept", ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx", 1, "hidden", 3, "change"], [1, "h-8", "bg-slate-200", "dark:bg-slate-700", "rounded-lg", "w-1/3"], [1, "h-4", "bg-slate-200", "dark:bg-slate-700", "rounded", "w-1/4"], [1, "flex", "gap-2", "mt-4"], [1, "h-6", "bg-slate-200", "dark:bg-slate-700", "rounded", "w-16"], [1, "h-6", "bg-slate-200", "dark:bg-slate-700", "rounded", "w-20"], [1, "w-20", "h-20", "bg-slate-50", "dark:bg-slate-900", "rounded-full", "flex", "items-center", "justify-center", "mb-4", "border", "border-slate-100", "dark:border-slate-800", "shadow-inner"], [1, "fa-solid", "fa-flask-vial", "text-3xl", "text-slate-300", "dark:text-slate-600"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-200", "mb-2"], [1, "text-slate-500", "dark:text-slate-400", "mb-6", "max-w-sm"], [1, "bg-indigo-600", "text-white", "px-6", "py-2.5", "rounded-xl", "font-bold", "hover:bg-indigo-700", "transition", "shadow-md", "active:scale-95", 3, "click"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "p-6", "md:p-8", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "relative", "overflow-hidden", "flex", "flex-col", "md:flex-row", "gap-6", "items-start", "md:items-center"], [1, "absolute", "-right-10", "-top-10", "text-indigo-50", "dark:text-slate-700/30", "opacity-50", "pointer-events-none"], [1, "fa-solid", "fa-flask-vial", "text-[200px]"], [1, "flex-1", "z-10", "w-full"], [1, "flex", "flex-wrap", "items-center", "gap-3", "mb-3"], [1, "px-3", "py-1", "rounded-lg", "text-xs", "font-black", "uppercase", "tracking-wider", "border", "shadow-sm", 3, "ngClass"], [1, "fa-solid", "fa-circle", "text-[8px]", "mr-1.5"], [1, "px-3", "py-1", "rounded-lg", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-400", "text-xs", "font-black", "border", "border-indigo-100", "dark:border-indigo-800/50", "shadow-sm"], [1, "text-3xl", "md:text-4xl", "font-black", "text-slate-800", "dark:text-slate-100", "tracking-tight", "leading-tight", "mb-1", "break-words"], [1, "text-base", "text-slate-500", "dark:text-slate-400", "italic", "font-medium", "mb-4"], [1, "flex", "flex-wrap", "items-center", "gap-x-6", "gap-y-3", "mt-4", "text-sm", "bg-slate-50", "dark:bg-slate-900/50", "w-fit", "p-3", "px-5", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-800"], [1, "flex", "flex-col"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-0.5"], ["title", "Nh\u1EA5n \u0111\u1EC3 sao ch\u00E9p", 1, "font-mono", "font-bold", "text-slate-700", "dark:text-slate-300", "text-base", "cursor-pointer", "hover:text-indigo-600", "transition", 3, "click"], [1, "w-px", "h-8", "bg-slate-200", "dark:bg-slate-700", "hidden", "sm:block"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "text-base"], [1, "w-28", "h-28", "bg-white", "p-2", "rounded-2xl", "shadow-md", "border", "border-slate-100", "shrink-0", "mx-auto", "md:mx-0", "z-10", "group", "relative"], ["alt", "QR Code", 1, "w-full", "h-full", "object-contain", "mix-blend-multiply", "opacity-90", "group-hover:opacity-100", "transition", 3, "src"], [1, "absolute", "inset-0", "bg-black/50", "rounded-2xl", "opacity-0", "group-hover:opacity-100", "flex", "items-center", "justify-center", "transition-opacity", "cursor-pointer", "backdrop-blur-sm", 3, "click"], [1, "fa-solid", "fa-print", "text-white", "text-2xl"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-4"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "p-6", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "flex", "flex-col", "h-full"], [1, "flex", "items-center", "gap-3", "mb-6"], [1, "w-10", "h-10", "rounded-xl", "bg-emerald-50", "dark:bg-emerald-900/30", "text-emerald-600", "flex", "items-center", "justify-center", "shadow-inner"], [1, "fa-solid", "fa-boxes-stacked", "text-lg"], [1, "text-base", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wide"], [1, "bg-slate-50", "dark:bg-slate-900/50", "p-5", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-800", "mb-6"], [1, "flex", "justify-between", "items-end", "mb-2"], [1, "text-[11px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-1", "block"], [1, "flex", "items-baseline", "gap-1"], [1, "text-4xl", "font-black", "text-emerald-600", "dark:text-emerald-400", "leading-none"], [1, "text-sm", "font-bold", "text-slate-500"], [1, "text-right"], [1, "text-[10px]", "font-bold", "text-slate-400", "block", "mb-0.5"], [1, "text-sm", "font-bold", "text-slate-600", "dark:text-slate-300", "font-mono"], [1, "w-full", "bg-slate-200", "dark:bg-slate-700", "rounded-full", "h-2.5", "overflow-hidden", "shadow-inner"], [1, "h-full", "rounded-full", "transition-all", "duration-1000", "ease-out"], [1, "grid", "grid-cols-2", "gap-4", "flex-1"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-1", "block"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "flex", "items-center", "gap-2"], [1, "text-sm", "text-slate-400", "italic"], [1, "flex", "flex-col", "gap-1.5"], [1, "px-2", "py-1", "rounded", "text-[11px]", "flex", "items-center", "gap-2", "border", "w-fit", "shadow-sm", 3, "ngClass"], [1, "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "w-10", "h-10", "rounded-xl", "bg-orange-50", "dark:bg-orange-900/30", "text-orange-600", "flex", "items-center", "justify-center", "shadow-inner"], [1, "fa-solid", "fa-clock", "text-lg"], [1, "flex", "items-center", "gap-2"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "bg-gradient-to-r", "from-blue-600", "to-indigo-600", "text-white", "rounded-xl", "shadow-md", "shadow-blue-200", "dark:shadow-none", "hover:from-blue-700", "hover:to-indigo-700", "transition", "font-bold", "text-sm", "active:scale-95", "group"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "bg-white", "dark:bg-slate-700", "text-slate-700", "dark:text-slate-200", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "hover:bg-slate-50", "dark:hover:bg-slate-600", "transition", "font-bold", "text-sm", "active:scale-95", "disabled:opacity-50", "group", "shadow-sm", 3, "click", "appLockPermission", "disabled"], [1, "fa-solid", "fa-circle-notch", "fa-spin"], [1, "fa-brands", "fa-google-drive", "text-emerald-600"], [1, "bg-slate-50", "dark:bg-slate-900/50", "p-5", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-800", "mb-6", "flex", "items-center", "gap-5"], [1, "w-14", "h-14", "rounded-full", "bg-white", "dark:bg-slate-800", "flex", "items-center", "justify-center", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "shrink-0"], [1, "fa-regular", "fa-calendar-xmark", "text-2xl", 3, "ngClass"], [1, "flex-1"], [1, "text-2xl", "font-black", "font-mono", "tracking-tight", 3, "ngClass"], [1, "text-sm", "font-bold", "mt-1", 3, "ngClass"], [1, "grid", "grid-cols-2", "gap-4", "flex-1", "content-start"], [1, "bg-white", "dark:bg-slate-800", "p-3", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700"], [1, "fa-solid", "fa-calendar-check", "mr-1"], [1, "fa-solid", "fa-flask-vial", "mr-1"], [1, "col-span-2", "bg-white", "dark:bg-slate-800", "p-3", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700", "flex", "items-center", "gap-3"], [1, "bg-blue-50", "dark:bg-blue-900/20", "border", "border-blue-200", "dark:border-blue-800", "rounded-3xl", "p-5", "flex", "items-center", "gap-4", "animate-fade-in", "shadow-sm", "mt-2"], [1, "flex", "flex-wrap", "items-center", "gap-3", "mt-2", "bg-white", "dark:bg-slate-800", "p-4", "rounded-3xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm"], [1, "mt-4", "bg-white", "dark:bg-slate-800", "rounded-3xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "overflow-hidden", "flex", "flex-col", "min-h-[400px]"], [1, "flex", "border-b", "border-slate-100", "dark:border-slate-700", "px-6", "pt-4", "gap-8", "bg-slate-50/50", "dark:bg-slate-900/50"], [1, "pb-3", "text-sm", "font-bold", "border-b-2", "transition", "flex", "items-center", "gap-2", "tracking-wide", 3, "click"], [1, "fa-solid", "fa-clock-rotate-left"], [1, "fa-solid", "fa-flask"], [1, "bg-slate-100", "dark:bg-slate-700", "text-slate-600", "dark:text-slate-300", "px-2", "py-0.5", "rounded-full", "text-[10px]", "ml-1"], [1, "p-0", "flex-1", "overflow-y-auto"], [1, "fa-solid", "fa-tag", "mr-1", "opacity-70"], [1, "fa-solid", "fa-location-dot", "text-slate-400"], [1, "fa-solid", 3, "ngClass"], [1, "font-bold"], [1, "font-mono", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "bg-gradient-to-r", "from-blue-600", "to-indigo-600", "text-white", "rounded-xl", "shadow-md", "shadow-blue-200", "dark:shadow-none", "hover:from-blue-700", "hover:to-indigo-700", "transition", "font-bold", "text-sm", "active:scale-95", "group", 3, "click"], [1, "fa-solid", "fa-file-pdf", "group-hover:-translate-y-0.5", "transition-transform"], [1, "w-8", "h-8", "rounded-lg", "bg-slate-50", "dark:bg-slate-900", "flex", "items-center", "justify-center", "text-slate-500"], [1, "fa-solid", "fa-file-contract"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-0.5", "block"], [1, "w-12", "h-12", "rounded-full", "bg-white", "dark:bg-slate-800", "shadow-sm", "flex", "items-center", "justify-center", "text-blue-500", "text-xl", "border", "border-blue-100", "dark:border-blue-700", "shrink-0"], [1, "fa-solid", "fa-user-lock"], [1, "text-sm", "font-black", "text-blue-800", "dark:text-blue-300"], [1, "text-base", "font-bold", "text-blue-900", "dark:text-blue-200", "mt-0.5"], [1, "px-5", "py-2.5", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-xl", "font-bold", "transition", "shadow-md", "active:scale-95", "flex", "items-center", "gap-2"], [1, "px-5", "py-2.5", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-xl", "font-bold", "transition", "shadow-md", "active:scale-95", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-rotate-left"], [1, "text-xs", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mr-2"], [1, "fa-solid", "fa-bolt", "text-amber-500", "mr-1"], [1, "w-full", "flex", "items-center", "gap-2", "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-200", "dark:border-amber-700/50", "rounded-xl", "px-3", "py-2", "text-xs", "text-amber-700", "dark:text-amber-400"], [1, "px-4", "py-2", "bg-purple-50", "text-purple-600", "border", "border-purple-200", "hover:bg-purple-100", "dark:bg-purple-900/20", "dark:border-purple-800", "dark:text-purple-400", "dark:hover:bg-purple-900/40", "rounded-xl", "font-bold", "text-sm", "transition", "flex", "items-center", "gap-2", 3, "disabled", "opacity-50"], [1, "fa-solid", "fa-triangle-exclamation", "text-amber-500"], [1, "ml-auto", "px-2.5", "py-1", "rounded-lg", "bg-amber-500", "hover:bg-amber-600", "text-white", "text-[10px]", "font-black", "transition", "whitespace-nowrap", 3, "click"], ["disabled", "", 1, "px-4", "py-2", "bg-orange-50", "text-orange-600", "border", "border-orange-200", "dark:bg-orange-900/20", "dark:border-orange-800", "dark:text-orange-400", "rounded-xl", "font-bold", "text-sm", "flex", "items-center", "gap-2", "cursor-not-allowed"], [1, "px-4", "py-2", "bg-emerald-50", "text-emerald-600", "border", "border-emerald-200", "hover:bg-emerald-100", "dark:bg-emerald-900/20", "dark:border-emerald-800", "dark:text-emerald-400", "dark:hover:bg-emerald-900/40", "rounded-xl", "font-bold", "text-sm", "transition", "flex", "items-center", "gap-2"], [1, "px-4", "py-2", "bg-indigo-50", "text-indigo-600", "border", "border-indigo-200", "hover:bg-indigo-100", "dark:bg-indigo-900/20", "dark:border-indigo-800", "dark:text-indigo-400", "dark:hover:bg-indigo-900/40", "rounded-xl", "font-bold", "text-sm", "transition", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-hourglass-half"], [1, "px-4", "py-2", "bg-emerald-50", "text-emerald-600", "border", "border-emerald-200", "hover:bg-emerald-100", "dark:bg-emerald-900/20", "dark:border-emerald-800", "dark:text-emerald-400", "dark:hover:bg-emerald-900/40", "rounded-xl", "font-bold", "text-sm", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-hand-holding-hand"], [1, "px-4", "py-2", "bg-indigo-50", "text-indigo-600", "border", "border-indigo-200", "hover:bg-indigo-100", "dark:bg-indigo-900/20", "dark:border-indigo-800", "dark:text-indigo-400", "dark:hover:bg-indigo-900/40", "rounded-xl", "font-bold", "text-sm", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "px-4", "py-2", "bg-amber-50", "text-amber-600", "border", "border-amber-200", "hover:bg-amber-100", "dark:bg-amber-900/20", "dark:border-amber-800", "dark:text-amber-400", "dark:hover:bg-amber-900/40", "rounded-xl", "font-bold", "text-sm", "transition", "flex", "items-center", "gap-2"], [1, "px-4", "py-2", "bg-slate-50", "text-slate-500", "border", "border-slate-200", "rounded-xl", "font-bold", "text-sm", "flex", "items-center", "gap-2", "cursor-not-allowed"], [1, "px-4", "py-2", "bg-amber-50", "text-amber-600", "border", "border-amber-200", "hover:bg-amber-100", "dark:bg-amber-900/20", "dark:border-amber-800", "dark:text-amber-400", "dark:hover:bg-amber-900/40", "rounded-xl", "font-bold", "text-sm", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-cart-plus"], [1, "fa-solid", "fa-cart-arrow-down"], [1, "px-4", "py-2", "bg-purple-50", "text-purple-600", "border", "border-purple-200", "hover:bg-purple-100", "dark:bg-purple-900/20", "dark:border-purple-800", "dark:text-purple-400", "dark:hover:bg-purple-900/40", "rounded-xl", "font-bold", "text-sm", "transition", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid"], [1, "p-12", "text-center", "text-slate-400"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-2xl"], [1, "mt-2", "text-sm"], [1, "w-full", "text-sm", "text-left"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "uppercase", "bg-slate-50", "dark:bg-slate-800", "sticky", "top-0", "border-b", "border-slate-100", "dark:border-slate-700"], [1, "px-6", "py-4", "font-bold"], [1, "px-6", "py-4", "font-bold", "text-right"], [1, "px-6", "py-4", "font-bold", "text-center", "w-16"], [1, "divide-y", "divide-slate-50", "dark:divide-slate-800/50"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/30", "transition", "group"], [1, "p-4", "text-center", "border-t", "border-slate-100", "dark:border-slate-700"], [1, "px-6", "py-4", "font-mono", "text-xs", "text-slate-600", "dark:text-slate-300", "font-bold", "whitespace-nowrap"], [1, "px-6", "py-4", "font-mono", "font-black", "text-orange-600", "dark:text-orange-400", "text-base", "text-right"], [1, "px-6", "py-4"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-sm", "mb-1"], [1, "flex", "items-center", "gap-2", "text-xs"], [1, "w-5", "h-5", "rounded-full", "object-cover", 3, "src"], [1, "text-slate-500", "dark:text-slate-400", "font-medium"], [1, "px-6", "py-4", "text-center"], ["title", "Rollback & Ho\u00E0n kho", 1, "w-8", "h-8", "rounded-lg", "text-slate-400", "hover:bg-red-50", "hover:text-red-600", "dark:hover:bg-red-900/30", "transition", "opacity-0", "group-hover:opacity-100"], ["title", "Rollback & Ho\u00E0n kho", 1, "w-8", "h-8", "rounded-lg", "text-slate-400", "hover:bg-red-50", "hover:text-red-600", "dark:hover:bg-red-900/30", "transition", "opacity-0", "group-hover:opacity-100", 3, "click"], [1, "fa-solid", "fa-trash-can"], ["colspan", "4", 1, "p-16", "text-center", "text-slate-400", "italic"], [1, "px-4", "py-2", "rounded-full", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:text-indigo-600", "hover:border-indigo-300", "disabled:opacity-50", "transition", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin", "mr-1"], [1, "px-6", "py-3", "bg-amber-50", "dark:bg-amber-900/20", "border-b", "border-amber-100", "dark:border-amber-800/30", "flex", "items-center", "gap-2"], [1, "px-6", "py-4", "font-bold", "text-center"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/30", "transition", "cursor-pointer", "group"], [1, "fa-solid", "fa-triangle-exclamation", "text-amber-500", "text-sm"], [1, "text-xs", "text-amber-700", "dark:text-amber-400", "font-medium"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/30", "transition", "cursor-pointer", "group", 3, "click"], [1, "px-1.5", "py-0.5", "rounded", "text-[9px]", "font-black", "bg-amber-100", "text-amber-700", "border", "border-amber-200", "dark:bg-amber-900/30", "dark:text-amber-400", "dark:border-amber-700/50", "uppercase", "tracking-wide", "whitespace-nowrap"], [1, "px-6", "py-4", "font-mono", "text-slate-600", "dark:text-slate-300", "text-xs"], [1, "px-6", "py-4", "font-mono", "font-bold", "text-emerald-600", "dark:text-emerald-400"], [1, "px-6", "py-4", "font-mono", "text-xs", 3, "ngClass"], [1, "px-2", "py-1", "rounded", "text-[10px]", "font-bold", "uppercase", "border", 3, "ngClass"], [1, "px-6", "py-4", "text-center", "text-slate-400", "group-hover:text-indigo-500", "transition"], [1, "fa-solid", "fa-chevron-right"], [1, "fa-solid", "fa-star", "text-[8px]"], ["colspan", "6", 1, "p-16", "text-center", "text-slate-400", "italic"], [3, "closeModal", "std", "isOpen", "allStandards"], [3, "closeModal", "std", "isOpen"], [3, "closeModal", "selectedStd", "isOpen"]], template: function StandardDetailComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "button", 4);
            i0.ɵɵlistener("click", function StandardDetailComponent_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.goBack()); });
            i0.ɵɵelement(4, "i", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div")(6, "h2", 6);
            i0.ɵɵtext(7, "Chi Ti\u1EBFt Ch\u1EA5t Chu\u1EA9n \u0110\u1ED1i Chi\u1EBFu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 7);
            i0.ɵɵtext(9, "Th\u00F4ng tin chi ti\u1EBFt ch\u1EA5t chu\u1EA9n, h\u1ED3 s\u01A1 ngu\u1ED3n g\u1ED1c, l\u1ECBch s\u1EED s\u1EED d\u1EE5ng v\u00E0 \u0111i\u1EC1u ki\u1EC7n b\u1EA3o qu\u1EA3n.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "div", 8)(11, "button", 9);
            i0.ɵɵlistener("click", function StandardDetailComponent_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.openPrintModal()); });
            i0.ɵɵelement(12, "i", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "button", 11);
            i0.ɵɵlistener("click", function StandardDetailComponent_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.openEditModal()); });
            i0.ɵɵelement(14, "i", 12);
            i0.ɵɵtext(15, " Ch\u1EC9nh S\u1EEDa ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(16, StandardDetailComponent_Conditional_16_Template, 6, 0, "div", 13)(17, StandardDetailComponent_Conditional_17_Template, 9, 0, "div", 14)(18, StandardDetailComponent_Conditional_18_Template, 1, 1);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(19, StandardDetailComponent_Conditional_19_Template, 1, 3, "app-standards-form-modal", 15)(20, StandardDetailComponent_Conditional_20_Template, 1, 2, "app-standards-print-modal", 16)(21, StandardDetailComponent_Conditional_21_Template, 1, 2, "app-standards-purchase-modal", 17);
            i0.ɵɵelementStart(22, "app-standards-assign-modal", 18);
            i0.ɵɵlistener("closeModal", function StandardDetailComponent_Template_app_standards_assign_modal_closeModal_22_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.showAssignModal.set(false)); })("confirm", function StandardDetailComponent_Template_app_standards_assign_modal_confirm_22_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.confirmAssign($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "input", 19, 0);
            i0.ɵɵlistener("change", function StandardDetailComponent_Template_input_change_23_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.handleQuickDriveUpload($event)); });
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("appLockPermission", "standard_edit");
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", !ctx.standard());
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", !ctx.standard());
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.isLoading() ? 16 : ctx.notFound() || !ctx.standard() ? 17 : 18);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.showEditModal() && ctx.standard() ? 19 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPrintModal() && ctx.standard() ? 20 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPurchaseModal() && ctx.standard() ? 21 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("isOpen", ctx.showAssignModal())("std", ctx.standard())("isAssignMode", ctx.isAssignMode())("userList", ctx.userList())("isProcessing", ctx.isProcessing())("currentUserUid", ctx.currentUserUid())("currentUserName", ctx.currentUserName())("sameName", ctx.relatedStandards());
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe, FormsModule,
            StandardsFormModalComponent,
            StandardsPrintModalComponent,
            StandardsPurchaseModalComponent,
            StandardsAssignModalComponent,
            LockPermissionDirective], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardDetailComponent, [{
        type: Component,
        args: [{ selector: 'app-standard-detail', standalone: true, imports: [
                    CommonModule,
                    FormsModule,
                    StandardsFormModalComponent,
                    StandardsPrintModalComponent,
                    StandardsPurchaseModalComponent,
                    StandardsAssignModalComponent,
                    LockPermissionDirective
                ], template: "    <div class=\"flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 p-2 md:p-4 gap-4 overflow-y-auto custom-scrollbar relative fade-in\">\r\n        \r\n        <!-- Header Area -->\r\n        <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0\">\r\n            <div class=\"flex items-center gap-3\">\r\n                <button (click)=\"goBack()\" class=\"w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 group shrink-0\">\r\n                    <i class=\"fa-solid fa-arrow-left group-hover:-translate-x-0.5 transition-transform text-base\"></i>\r\n                </button>\r\n                <div>\r\n                    <h2 class=\"text-xl font-black text-slate-855 dark:text-slate-100 tracking-tight leading-tight\">Chi Ti\u1EBFt Ch\u1EA5t Chu\u1EA9n \u0110\u1ED1i Chi\u1EBFu</h2>\r\n                    <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">Th\u00F4ng tin chi ti\u1EBFt ch\u1EA5t chu\u1EA9n, h\u1ED3 s\u01A1 ngu\u1ED3n g\u1ED1c, l\u1ECBch s\u1EED s\u1EED d\u1EE5ng v\u00E0 \u0111i\u1EC1u ki\u1EC7n b\u1EA3o qu\u1EA3n.</p>\r\n                </div>\r\n            </div>\r\n            \r\n            <div class=\"flex gap-2 items-center animate-fade-in\" [appLockPermission]=\"'standard_edit'\">\r\n                <button (click)=\"openPrintModal()\" [disabled]=\"!standard()\" class=\"w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm active:scale-95 disabled:opacity-50\" title=\"In nh\u00E3n\">\r\n                    <i class=\"fa-solid fa-print\"></i>\r\n                </button>\r\n                <button (click)=\"openEditModal()\" [disabled]=\"!standard()\" class=\"flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition font-bold text-xs active:scale-95 disabled:opacity-50\">\r\n                    <i class=\"fa-solid fa-pen text-[10px]\"></i> Ch\u1EC9nh S\u1EEDa\r\n                </button>\r\n            </div>\r\n        </div>\r\n\r\n        @if(isLoading()) {\r\n            <!-- Loading Skeleton -->\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-4 animate-pulse\">\r\n                <div class=\"h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3\"></div>\r\n                <div class=\"h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4\"></div>\r\n                <div class=\"flex gap-2 mt-4\"><div class=\"h-6 bg-slate-200 dark:bg-slate-700 rounded w-16\"></div><div class=\"h-6 bg-slate-200 dark:bg-slate-700 rounded w-20\"></div></div>\r\n            </div>\r\n        } @else if(notFound() || !standard()) {\r\n            <!-- Not Found State -->\r\n            <div class=\"flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-8 text-center\">\r\n                <div class=\"w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800 shadow-inner\">\r\n                    <i class=\"fa-solid fa-flask-vial text-3xl text-slate-300 dark:text-slate-600\"></i>\r\n                </div>\r\n                <h2 class=\"text-xl font-black text-slate-800 dark:text-slate-200 mb-2\">Kh\u00F4ng T\u00ECm Th\u1EA5y Ch\u1EA5t Chu\u1EA9n \u0110\u1ED1i Chi\u1EBFu</h2>\r\n                <p class=\"text-slate-500 dark:text-slate-400 mb-6 max-w-sm\">D\u1EEF li\u1EC7u c\u00F3 th\u1EC3 \u0111\u00E3 b\u1ECB x\u00F3a ho\u1EB7c \u0111\u01B0\u1EDDng d\u1EABn kh\u00F4ng h\u1EE3p l\u1EC7. Vui l\u00F2ng ki\u1EC3m tra l\u1EA1i.</p>\r\n                <button (click)=\"goBack()\" class=\"bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md active:scale-95\">\r\n                    Quay L\u1EA1i Danh S\u00E1ch\r\n                </button>\r\n            </div>\r\n        } @else {\r\n            @if (standard(); as std) {\r\n                \r\n                <!-- HERO CARD -->\r\n                <div class=\"bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 items-start md:items-center\">\r\n                    \r\n                    <!-- Decorative Background -->\r\n                    <div class=\"absolute -right-10 -top-10 text-indigo-50 dark:text-slate-700/30 opacity-50 pointer-events-none\">\r\n                        <i class=\"fa-solid fa-flask-vial text-[200px]\"></i>\r\n                    </div>\r\n\r\n                    <div class=\"flex-1 z-10 w-full\">\r\n                        <div class=\"flex flex-wrap items-center gap-3 mb-3\">\r\n                            <span class=\"px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-sm\" [ngClass]=\"statusInfo().class\">\r\n                                <i class=\"fa-solid fa-circle text-[8px] mr-1.5\" [class.animate-pulse]=\"std.status === 'IN_USE' || std.current_amount <= 0\"></i>\r\n                                {{statusInfo().label}}\r\n                            </span>\r\n                            @if(std.internal_id) { <span class=\"px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-black border border-indigo-100 dark:border-indigo-800/50 shadow-sm\"><i class=\"fa-solid fa-tag mr-1 opacity-70\"></i> {{std.internal_id}}</span> }\r\n                        </div>\r\n                        \r\n                        <h1 class=\"text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight mb-1 break-words\">\r\n                            {{std.name}}\r\n                        </h1>\r\n                        @if(std.chemical_name) { <p class=\"text-base text-slate-500 dark:text-slate-400 italic font-medium mb-4\">{{std.chemical_name}}</p> }\r\n                        \r\n                        <div class=\"flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-sm bg-slate-50 dark:bg-slate-900/50 w-fit p-3 px-5 rounded-2xl border border-slate-100 dark:border-slate-800\">\r\n                            <div class=\"flex flex-col\">\r\n                                <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5\">Lot Number</span>\r\n                                <span class=\"font-mono font-bold text-slate-700 dark:text-slate-300 text-base cursor-pointer hover:text-indigo-600 transition\" (click)=\"copyText(std.lot_number)\" title=\"Nh\u1EA5n \u0111\u1EC3 sao ch\u00E9p\">{{std.lot_number || 'N/A'}}</span>\r\n                            </div>\r\n                            <div class=\"w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block\"></div>\r\n                            <div class=\"flex flex-col\">\r\n                                <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5\">H\u00E3ng SX</span>\r\n                                <span class=\"font-bold text-slate-700 dark:text-slate-300 text-base\">{{std.manufacturer || 'N/A'}}</span>\r\n                            </div>\r\n                            <div class=\"w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block\"></div>\r\n                            <div class=\"flex flex-col\">\r\n                                <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5\">Product Code</span>\r\n                                <span class=\"font-mono font-bold text-slate-700 dark:text-slate-300 text-base cursor-pointer hover:text-indigo-600 transition\" (click)=\"copyText(std.product_code)\" title=\"Nh\u1EA5n \u0111\u1EC3 sao ch\u00E9p\">{{std.product_code || 'N/A'}}</span>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    \r\n                    <div class=\"w-28 h-28 bg-white p-2 rounded-2xl shadow-md border border-slate-100 shrink-0 mx-auto md:mx-0 z-10 group relative\">\r\n                         <img [src]=\"qrCodeUrl()\" class=\"w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition\" alt=\"QR Code\">\r\n                         <div class=\"absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm\" (click)=\"openPrintModal()\">\r\n                             <i class=\"fa-solid fa-print text-white text-2xl\"></i>\r\n                         </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- MAIN CONTENT GRID -->\r\n                <div class=\"grid grid-cols-1 lg:grid-cols-2 gap-4\">\r\n                    \r\n                    <!-- COLUMN 1: T\u1ED2N KHO & B\u1EA2O QU\u1EA2N -->\r\n                    <div class=\"bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full\">\r\n                        <div class=\"flex items-center gap-3 mb-6\">\r\n                            <div class=\"w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shadow-inner\">\r\n                                <i class=\"fa-solid fa-boxes-stacked text-lg\"></i>\r\n                            </div>\r\n                            <h3 class=\"text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide\">T\u1ED3n Kho & B\u1EA3o Qu\u1EA3n</h3>\r\n                        </div>\r\n\r\n                        <div class=\"bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6\">\r\n                            <div class=\"flex justify-between items-end mb-2\">\r\n                                <div>\r\n                                    <span class=\"text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 block\">L\u01B0\u1EE3ng hi\u1EC7n t\u1EA1i</span>\r\n                                    <div class=\"flex items-baseline gap-1\">\r\n                                        <span class=\"text-4xl font-black text-emerald-600 dark:text-emerald-400 leading-none\">{{formatNum(std.current_amount)}}</span>\r\n                                        <span class=\"text-sm font-bold text-slate-500\">{{std.unit}}</span>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"text-right\">\r\n                                    <span class=\"text-[10px] font-bold text-slate-400 block mb-0.5\">L\u01B0\u1EE3ng ban \u0111\u1EA7u</span>\r\n                                    <span class=\"text-sm font-bold text-slate-600 dark:text-slate-300 font-mono\">{{formatNum(std.initial_amount || 0)}} {{std.unit}}</span>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden shadow-inner\">\r\n                                <div class=\"h-full rounded-full transition-all duration-1000 ease-out\" \r\n                                     [style.width.%]=\"Math.min((std.current_amount / (std.initial_amount || 1)) * 100, 100)\" \r\n                                     [class.bg-emerald-500]=\"(std.current_amount / (std.initial_amount || 1)) > 0.2\" \r\n                                     [class.bg-rose-500]=\"(std.current_amount / (std.initial_amount || 1)) <= 0.2\">\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"grid grid-cols-2 gap-4 flex-1\">\r\n                            <div>\r\n                                <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block\">V\u1ECB tr\u00ED l\u01B0u tr\u1EEF</span>\r\n                                @if(std.location) { \r\n                                    <div class=\"font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2\"><i class=\"fa-solid fa-location-dot text-slate-400\"></i> {{std.location}}</div> \r\n                                } @else { <span class=\"text-sm text-slate-400 italic\">Ch\u01B0a x\u00E1c \u0111\u1ECBnh</span> }\r\n                            </div>\r\n                            <div>\r\n                                <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block\">\u0110i\u1EC1u ki\u1EC7n b\u1EA3o qu\u1EA3n</span>\r\n                                <div class=\"flex flex-col gap-1.5\">\r\n                                    @for(info of storageInfo(); track $index) {\r\n                                        <div class=\"px-2 py-1 rounded text-[11px] flex items-center gap-2 border w-fit shadow-sm\" [ngClass]=\"[info.bg, info.border, info.color]\">\r\n                                            <i class=\"fa-solid\" [ngClass]=\"info.icon\"></i><span class=\"font-bold\">{{info.text}}</span>\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n                             @if(std.purity) {\r\n                             <div>\r\n                                <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block\">\u0110\u1ED9 tinh khi\u1EBFt</span>\r\n                                <div class=\"font-bold text-slate-700 dark:text-slate-200\">{{std.purity}}</div>\r\n                             </div>\r\n                             }\r\n                            <div>\r\n                                <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block\">Quy c\u00E1ch \u0111\u00F3ng g\u00F3i</span>\r\n                                <div class=\"font-bold text-slate-700 dark:text-slate-200\">{{std.pack_size || 'N/A'}}</div>\r\n                            </div>\r\n                            @if(std.cas_number) {\r\n                                <div>\r\n                                    <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block\">CAS Number</span>\r\n                                    <div class=\"font-mono font-bold text-slate-700 dark:text-slate-200\">{{std.cas_number}}</div>\r\n                                </div>\r\n                            }\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- COLUMN 2: H\u1EA0N D\u00D9NG & H\u1ED2 S\u01A0 -->\r\n                    <div class=\"bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full\">\r\n                        <div class=\"flex items-center justify-between mb-6\">\r\n                            <div class=\"flex items-center gap-3\">\r\n                                <div class=\"w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shadow-inner\">\r\n                                    <i class=\"fa-solid fa-clock text-lg\"></i>\r\n                                </div>\r\n                                <h3 class=\"text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide\">H\u1EA1n D\u00F9ng & H\u1ED3 S\u01A1</h3>\r\n                            </div>\r\n                            \r\n                            <div class=\"flex items-center gap-2\">\r\n                                @if(std.certificate_ref) {\r\n                                    <button (click)=\"openCoaPreview(std.certificate_ref)\" class=\"flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-200 dark:shadow-none hover:from-blue-700 hover:to-indigo-700 transition font-bold text-sm active:scale-95 group\">\r\n                                        <i class=\"fa-solid fa-file-pdf group-hover:-translate-y-0.5 transition-transform\"></i> Xem CoA\r\n                                    </button>\r\n                                }\r\n                                    <button [appLockPermission]=\"'standard_edit'\" (click)=\"triggerQuickDriveUpload()\" [disabled]=\"isUploadingCoa()\" class=\"flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition font-bold text-sm active:scale-95 disabled:opacity-50 group shadow-sm\">\r\n                                        @if(isUploadingCoa()) {\r\n                                            <i class=\"fa-solid fa-circle-notch fa-spin\"></i>\r\n                                        } @else {\r\n                                            <i class=\"fa-brands fa-google-drive text-emerald-600\"></i>\r\n                                        }\r\n                                        {{ std.certificate_ref ? 'C\u1EADp nh\u1EADt CoA' : 'T\u1EA3i CoA l\u00EAn' }}\r\n                                    </button>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6 flex items-center gap-5\">\r\n                            <div class=\"w-14 h-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 shrink-0\">\r\n                                <i class=\"fa-regular fa-calendar-xmark text-2xl\" [ngClass]=\"expiryInfo().colorClass\"></i>\r\n                            </div>\r\n                            <div class=\"flex-1\">\r\n                                <span class=\"text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 block\">H\u1EA1n S\u1EED D\u1EE5ng</span>\r\n                                <div class=\"text-2xl font-black font-mono tracking-tight\" [ngClass]=\"expiryInfo().colorClass\">{{std.expiry_date ? (std.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</div>\r\n                                <div class=\"text-sm font-bold mt-1\" [ngClass]=\"expiryInfo().colorClass\">{{expiryInfo().timeLeftText}}</div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"grid grid-cols-2 gap-4 flex-1 content-start\">\r\n                            <div class=\"bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700\">\r\n                                <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block\"><i class=\"fa-solid fa-calendar-check mr-1\"></i> Ng\u00E0y nh\u1EADn</span>\r\n                                <div class=\"font-bold text-slate-700 dark:text-slate-200\">{{std.received_date ? (std.received_date | date:'dd/MM/yyyy') : 'N/A'}}</div>\r\n                            </div>\r\n                            <div class=\"bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700\">\r\n                                <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block\"><i class=\"fa-solid fa-flask-vial mr-1\"></i> Ng\u00E0y m\u1EDF n\u1EAFp</span>\r\n                                <div class=\"font-bold text-slate-700 dark:text-slate-200\">{{effectiveOpenDate() ? (effectiveOpenDate() | date:'dd/MM/yyyy') : 'Ch\u01B0a m\u1EDF n\u1EAFp'}}</div>\r\n                            </div>\r\n                            @if(std.contract_ref) {\r\n                                <div class=\"col-span-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3\">\r\n                                    <div class=\"w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500\"><i class=\"fa-solid fa-file-contract\"></i></div>\r\n                                    <div>\r\n                                        <span class=\"text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 block\">H\u1EE3p \u0111\u1ED3ng / PO</span>\r\n                                        <div class=\"font-bold text-slate-700 dark:text-slate-200\">{{std.contract_ref}}</div>\r\n                                    </div>\r\n                                </div>\r\n                            }\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- SECTION: CURRENT HOLDER (IF IN_USE) -->\r\n                @if(std.status === 'IN_USE' && std.current_holder) {\r\n                    <div class=\"bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-5 flex items-center gap-4 animate-fade-in shadow-sm mt-2\">\r\n                        <div class=\"w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-blue-500 text-xl border border-blue-100 dark:border-blue-700 shrink-0\">\r\n                            <i class=\"fa-solid fa-user-lock\"></i>\r\n                        </div>\r\n                        <div class=\"flex-1\">\r\n                            <h4 class=\"text-sm font-black text-blue-800 dark:text-blue-300\">\u0110ang \u0110\u01B0\u1EE3c M\u01B0\u1EE3n B\u1EDFi</h4>\r\n                            <p class=\"text-base font-bold text-blue-900 dark:text-blue-200 mt-0.5\">{{std.current_holder}}</p>\r\n                        </div>\r\n                        @if(canReturnStandard()) {\r\n                            <button (click)=\"goToReturn()\" class=\"px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-md active:scale-95 flex items-center gap-2\">\r\n                                <i class=\"fa-solid fa-rotate-left\"></i> Tr\u1EA3 Ch\u1EA5t Chu\u1EA9n\r\n                            </button>\r\n                        }\r\n                    </div>\r\n                }\r\n\r\n                <!-- ACTION SHORTCUTS (BOTTOM PANEL) -->\r\n                @if((canAssign(std) && (canAssignStandards() || canRequestStandards())) || ((std.status === 'DEPLETED' || std.current_amount <= 0) && canRequestPurchase()) || canRequestCoa()) {\r\n                    <div class=\"flex flex-wrap items-center gap-3 mt-2 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm\">\r\n                        <span class=\"text-xs font-black text-slate-400 uppercase tracking-widest mr-2\"><i class=\"fa-solid fa-bolt text-amber-500 mr-1\"></i> T\u00E1c v\u1EE5 nhanh:</span>\r\n\r\n                        <!-- FEFO Warning: c\u00F3 l\u1ECD kh\u00E1c n\u00EAn d\u00F9ng tr\u01B0\u1EDBc -->\r\n                        @if(fefoWarningSibling(); as warn) {\r\n                            <div class=\"w-full flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl px-3 py-2 text-xs text-amber-700 dark:text-amber-400\">\r\n                                <i class=\"fa-solid fa-triangle-exclamation text-amber-500\"></i>\r\n                                <span>\r\n                                    <strong>G\u1EE3i \u00FD FEFO:</strong> L\u1ECD <strong>{{warn.internal_id || warn.lot_number}}</strong>\r\n                                    (h\u1EBFt h\u1EA1n: {{warn.expiry_date ? (warn.expiry_date | date:'dd/MM/yyyy') : 'N/A'}})\r\n                                    n\u00EAn \u0111\u01B0\u1EE3c c\u1EA5p tr\u01B0\u1EDBc l\u1ECD n\u00E0y.\r\n                                </span>\r\n                                <button (click)=\"navigateToRelated(warn.id!)\" class=\"ml-auto px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black transition whitespace-nowrap\">\r\n                                    Chuy\u1EC3n sang L\u1ECD \u01AFu Ti\u00EAn\r\n                                </button>\r\n                            </div>\r\n                        }\r\n                        \r\n                        @if(canAssign(std)) {\r\n                            @if(std.has_pending_request) {\r\n                                <button disabled class=\"px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400 rounded-xl font-bold text-sm flex items-center gap-2 cursor-not-allowed\">\r\n                                    <i class=\"fa-solid fa-hourglass-half\"></i> \u0110ang Ch\u1EDD Duy\u1EC7t\r\n                                </button>\r\n                            } @else if(canAssignStandards()) {\r\n                                <button (click)=\"openAssignModal(true)\" class=\"px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded-xl font-bold text-sm transition flex items-center gap-2\">\r\n                                    <i class=\"fa-solid fa-hand-holding-hand\"></i> G\u00E1n cho M\u01B0\u1EE3n\r\n                                </button>\r\n                            } @else if(canRequestStandards()) {\r\n                                <button (click)=\"openAssignModal(false)\" class=\"px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/40 rounded-xl font-bold text-sm transition flex items-center gap-2\">\r\n                                    <i class=\"fa-solid fa-hand-holding-hand\"></i> \u0110\u0103ng K\u00FD M\u01B0\u1EE3n Chu\u1EA9n\r\n                                </button>\r\n                            }\r\n                        }\r\n\r\n                        @if((std.status === 'DEPLETED' || std.current_amount <= 0) && canRequestPurchase()) {\r\n                            @if(!std.restock_requested) {\r\n                                <button (click)=\"openPurchaseModal()\" class=\"px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/40 rounded-xl font-bold text-sm transition flex items-center gap-2\">\r\n                                    <i class=\"fa-solid fa-cart-plus\"></i> \u0110\u1EC1 Ngh\u1ECB Mua Th\u00EAm\r\n                                </button>\r\n                            } @else {\r\n                                <span class=\"px-4 py-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 cursor-not-allowed\">\r\n                                    <i class=\"fa-solid fa-cart-arrow-down\"></i> \u0110\u00E3 c\u00F3 y\u00EAu c\u1EA7u mua\r\n                                </span>\r\n                            }\r\n                        }\r\n\r\n                        @if(canRequestCoa()) {\r\n                            <button (click)=\"requestCoa(std)\" class=\"px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/40 rounded-xl font-bold text-sm transition flex items-center gap-2\" [disabled]=\"!!std.coa_requested_by\" [class.opacity-50]=\"!!std.coa_requested_by\">\r\n                                <i class=\"fa-solid\" [class.fa-file-signature]=\"!std.coa_requested_by\" [class.fa-clock-rotate-left]=\"!!std.coa_requested_by\"></i> {{std.coa_requested_by ? '\u0110\u00E3 y\u00EAu c\u1EA7u CoA' : 'Y\u00EAu c\u1EA7u c\u1EADp nh\u1EADt CoA'}}\r\n                            </button>\r\n                        }\r\n                    </div>\r\n                }\r\n\r\n                <!-- TABS: RELATED & HISTORY -->\r\n                <div class=\"mt-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col min-h-[400px]\">\r\n                    <div class=\"flex border-b border-slate-100 dark:border-slate-700 px-6 pt-4 gap-8 bg-slate-50/50 dark:bg-slate-900/50\">\r\n                        <button (click)=\"activeTab.set('usage')\" class=\"pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 tracking-wide\" [class]=\"activeTab() === 'usage' ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 dark:border-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'\">\r\n                            <i class=\"fa-solid fa-clock-rotate-left\"></i> Nh\u1EADt K\u00FD S\u1EED D\u1EE5ng\r\n                        </button>\r\n                        <button (click)=\"activeTab.set('related')\" class=\"pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 tracking-wide\" [class]=\"activeTab() === 'related' ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'\">\r\n                            <i class=\"fa-solid fa-flask\"></i> L\u1ECD Chu\u1EA9n C\u00F9ng T\u00EAn\r\n                            <span class=\"bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[10px] ml-1\">{{relatedStandards().length}}</span>\r\n                        </button>\r\n                    </div>\r\n\r\n                    <div class=\"p-0 flex-1 overflow-y-auto\">\r\n                        <!-- TAB: USAGE LOGS -->\r\n                        @if(activeTab() === 'usage') {\r\n                            @if(loadingHistory()) {\r\n                                <div class=\"p-12 text-center text-slate-400\"><i class=\"fa-solid fa-spinner fa-spin text-2xl\"></i><p class=\"mt-2 text-sm\">\u0110ang t\u1EA3i l\u1ECBch s\u1EED...</p></div>\r\n                            } @else {\r\n                                <table class=\"w-full text-sm text-left\">\r\n                                    <thead class=\"text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0 border-b border-slate-100 dark:border-slate-700\">\r\n                                        <tr>\r\n                                            <th class=\"px-6 py-4 font-bold\">Ng\u00E0y thao t\u00E1c</th>\r\n                                            <th class=\"px-6 py-4 font-bold text-right\">L\u01B0\u1EE3ng s\u1EED d\u1EE5ng</th>\r\n                                            <th class=\"px-6 py-4 font-bold\">M\u1EE5c \u0111\u00EDch / Ng\u01B0\u1EDDi d\u00F9ng</th>\r\n                                            <th class=\"px-6 py-4 font-bold text-center w-16\"></th>\r\n                                        </tr>\r\n                                    </thead>\r\n                                    <tbody class=\"divide-y divide-slate-50 dark:divide-slate-800/50\">\r\n                                        @for (log of usageLogs(); track log.id) {\r\n                                            <tr class=\"hover:bg-slate-50 dark:hover:bg-slate-800/30 transition group\">\r\n                                                <td class=\"px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap\">{{log.date}}</td>\r\n                                                <td class=\"px-6 py-4 font-mono font-black text-orange-600 dark:text-orange-400 text-base text-right\">{{formatNum(log.amount_used)}} {{std.unit}}</td>\r\n                                                <td class=\"px-6 py-4\">\r\n                                                    <div class=\"font-bold text-slate-800 dark:text-slate-200 text-sm mb-1\">{{log.purpose}}</div>\r\n                                                    <div class=\"flex items-center gap-2 text-xs\">\r\n                                                        <img [src]=\"getAvatarUrl(log.user, state.getUserAvatarOptions(log.user).style, state.getUserAvatarOptions(log.user).photoURL)\" class=\"w-5 h-5 rounded-full object-cover\">\r\n                                                        <span class=\"text-slate-500 dark:text-slate-400 font-medium\">{{log.user}}</span>\r\n                                                    </div>\r\n                                                </td>\r\n                                                <td class=\"px-6 py-4 text-center\">\r\n                                                        @if(canDeleteStandardLogs()) {\r\n                                                            <button (click)=\"deleteLog(log, std.id!)\" class=\"w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100\" title=\"Rollback & Ho\u00E0n kho\"><i class=\"fa-solid fa-trash-can\"></i></button>\r\n                                                        }\r\n                                                </td>\r\n                                            </tr>\r\n                                        } @empty {\r\n                                            <tr><td colspan=\"4\" class=\"p-16 text-center text-slate-400 italic\">Ch\u01B0a c\u00F3 l\u1ECBch s\u1EED s\u1EED d\u1EE5ng cho chu\u1EA9n n\u00E0y.</td></tr>\r\n                                        }\r\n                                    </tbody>\r\n                                </table>\r\n                                @if(hasMoreHistory()) {\r\n                                    <div class=\"p-4 text-center border-t border-slate-100 dark:border-slate-700\">\r\n                                        <button (click)=\"loadMoreHistory()\" [disabled]=\"loadingMoreHistory()\" class=\"px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 transition\">\r\n                                            @if(loadingMoreHistory()) { <i class=\"fa-solid fa-spinner fa-spin mr-1\"></i> \u0110ang t\u1EA3i... } @else { T\u1EA3i th\u00EAm l\u1ECBch s\u1EED }\r\n                                        </button>\r\n                                    </div>\r\n                                }\r\n                            }\r\n                        }\r\n\r\n                        <!-- TAB: RELATED STANDARDS -->\r\n                        @if(activeTab() === 'related') {\r\n                            <!-- FEFO Banner -->\r\n                            @if(fefoPriorityStandard(); as priority) {\r\n                                <div class=\"px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30 flex items-center gap-2\">\r\n                                    <i class=\"fa-solid fa-triangle-exclamation text-amber-500 text-sm\"></i>\r\n                                    <p class=\"text-xs text-amber-700 dark:text-amber-400 font-medium\">\r\n                                        Th\u1EE9 t\u1EF1 <strong>FEFO</strong>: h\u1EA1n g\u1EA7n nh\u1EA5t &rarr; \u00EDt l\u01B0\u1EE3ng &rarr; ng\u00E0y nh\u1EADn c\u0169 nh\u1EA5t.\r\n                                        L\u00F4 n\u00EAn c\u1EA5p ti\u1EBFp theo: <strong>{{priority.internal_id || priority.lot_number || priority.id}}</strong>\r\n                                        ({{priority.expiry_date ? (priority.expiry_date | date:'dd/MM/yyyy') : 'ch\u01B0a r\u00F5 h\u1EA1n'}}).\r\n                                    </p>\r\n                                </div>\r\n                            }\r\n                            <table class=\"w-full text-sm text-left\">\r\n                                <thead class=\"text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0 border-b border-slate-100 dark:border-slate-700\">\r\n                                    <tr>\r\n                                        <th class=\"px-6 py-4 font-bold\">M\u00E3 (ID)</th>\r\n                                        <th class=\"px-6 py-4 font-bold\">Lot Number</th>\r\n                                        <th class=\"px-6 py-4 font-bold\">T\u1ED3n kho</th>\r\n                                        <th class=\"px-6 py-4 font-bold\">H\u1EA1n d\u00F9ng</th>\r\n                                        <th class=\"px-6 py-4 font-bold text-center\">Tr\u1EA1ng th\u00E1i</th>\r\n                                        <th class=\"px-6 py-4 font-bold text-center w-16\"></th>\r\n                                    </tr>\r\n                                </thead>\r\n                                <tbody class=\"divide-y divide-slate-50 dark:divide-slate-800/50\">\r\n                                    @for (rStd of relatedStandards(); track rStd.id) {\r\n                                        <tr class=\"hover:bg-slate-50 dark:hover:bg-slate-800/30 transition cursor-pointer group\" (click)=\"navigateToRelated(rStd.id!)\">\r\n                                            <td class=\"px-6 py-4\">\r\n                                                <div class=\"flex items-center gap-2\">\r\n                                                    <span class=\"font-bold text-slate-700 dark:text-slate-200\">{{rStd.internal_id || 'N/A'}}</span>\r\n                                                    @if(isFefoPriority(rStd)) {\r\n                                                        <span class=\"px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50 uppercase tracking-wide whitespace-nowrap\">\r\n                                                            <i class=\"fa-solid fa-star text-[8px]\"></i> \u01AFu ti\u00EAn\r\n                                                        </span>\r\n                                                    }\r\n                                                </div>\r\n                                            </td>\r\n                                            <td class=\"px-6 py-4 font-mono text-slate-600 dark:text-slate-300 text-xs\">{{rStd.lot_number || '-'}}</td>\r\n                                            <td class=\"px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400\">{{formatNum(rStd.current_amount)}} {{rStd.unit}}</td>\r\n                                            <td class=\"px-6 py-4 font-mono text-xs\" [ngClass]=\"getExpiryClass(rStd.expiry_date)\">{{rStd.expiry_date ? (rStd.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</td>\r\n                                            <td class=\"px-6 py-4 text-center\">\r\n                                                <span class=\"px-2 py-1 rounded text-[10px] font-bold uppercase border\" [ngClass]=\"getStandardStatus(rStd).class\">{{getStandardStatus(rStd).label}}</span>\r\n                                            </td>\r\n                                            <td class=\"px-6 py-4 text-center text-slate-400 group-hover:text-indigo-500 transition\"><i class=\"fa-solid fa-chevron-right\"></i></td>\r\n                                        </tr>\r\n                                    } @empty {\r\n                                        <tr><td colspan=\"6\" class=\"p-16 text-center text-slate-400 italic\">Kh\u00F4ng c\u00F3 l\u1ECD chu\u1EA9n n\u00E0o kh\u00E1c c\u00F9ng t\u00EAn \"{{std.name}}\".</td></tr>\r\n                                    }\r\n                                </tbody>\r\n                            </table>\r\n                        }\r\n                    </div>\r\n                </div>\r\n\r\n            }\r\n        }\r\n    </div>\r\n\r\n    <!-- Modals -->\r\n    @if(showEditModal() && standard()) {\r\n        <app-standards-form-modal [std]=\"standard()\" [isOpen]=\"true\" [allStandards]=\"allStandardsCache()\" (closeModal)=\"onModalSaved()\"></app-standards-form-modal>\r\n    }\r\n    @if(showPrintModal() && standard()) {\r\n        <app-standards-print-modal [std]=\"standard()\" [isOpen]=\"true\" (closeModal)=\"showPrintModal.set(false)\"></app-standards-print-modal>\r\n    }\r\n    @if(showPurchaseModal() && standard()) {\r\n        <app-standards-purchase-modal [selectedStd]=\"standard()\" [isOpen]=\"true\" (closeModal)=\"showPurchaseModal.set(false)\"></app-standards-purchase-modal>\r\n    }\r\n    <!-- ASSIGN/BORROW MODAL -->\r\n    <app-standards-assign-modal\r\n        [isOpen]=\"showAssignModal()\"\r\n        [std]=\"standard()\"\r\n        [isAssignMode]=\"isAssignMode()\"\r\n        [userList]=\"userList()\"\r\n        [isProcessing]=\"isProcessing()\"\r\n        [currentUserUid]=\"currentUserUid()\"\r\n        [currentUserName]=\"currentUserName()\"\r\n        [sameName]=\"relatedStandards()\"\r\n        (closeModal)=\"showAssignModal.set(false)\"\r\n        (confirm)=\"confirmAssign($event)\">\r\n    </app-standards-assign-modal>\r\n    \r\n    <!-- Hidden input for quick Drive upload -->\r\n    <input id=\"quickDriveInput\" #quickDriveInput type=\"file\" class=\"hidden\" accept=\".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx\" (change)=\"handleQuickDriveUpload($event)\">\r\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardDetailComponent, { className: "StandardDetailComponent", filePath: "src/app/features/standards/standard-detail.component.ts", lineNumber: 45 }); })();
//# sourceMappingURL=standard-detail.component.js.map