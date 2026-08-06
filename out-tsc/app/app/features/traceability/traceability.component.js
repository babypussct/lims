import { Component, inject, signal, computed, Input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { doc, getDoc } from 'firebase/firestore';
import { formatDate, formatNum, formatSampleList, naturalCompare, getAvatarUrl } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { MasterTargetService } from '../targets/master-target.service';
import { resolveCompoundDisplayName, getAssignedTargetsForSample, getCanonicalId } from '../results/shared/compound-id-resolver';
import { getSampleDescriptionSnapshot } from '../../shared/utils/sample-description.utils';
import { TargetService } from '../targets/target.service';
import { classifyTargetScope, buildTargetScopePresentation } from '../targets/target-scope-classifier';
import { ensureQrious } from '../../shared/utils/external-script-loader';
import { QrGlobalService } from '../../core/services/qr-global.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = ["qrCanvas"];
const _c1 = ["lookupInput"];
const _forTrack0 = ($index, $item) => $item.sampleId;
const _forTrack1 = ($index, $item) => $item.formattedSamples;
const _forTrack2 = ($index, $item) => $item.name;
function TraceabilityComponent_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11)(1, "h3", 29);
    i0.ɵɵtext(2, "Tra c\u1EE9u h\u1ED3 s\u01A1 LIMS");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 30);
    i0.ɵɵtext(4, " Nh\u1EADp m\u00E3 y\u00EAu c\u1EA7u, m\u00E3 nh\u1EADt k\u00FD, m\u00E3 phi\u1EBFu in ho\u1EB7c d\u00E1n li\u00EAn k\u1EBFt truy xu\u1EA5t. ");
    i0.ɵɵelementEnd()();
} }
function TraceabilityComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 31);
    i0.ɵɵlistener("click", function TraceabilityComponent_Conditional_20_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearLookupInput()); });
    i0.ɵɵelement(1, "i", 32);
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 33);
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2, "\u0110ang truy xu\u1EA5t");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 34);
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2, "Truy xu\u1EA5t");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 23);
    i0.ɵɵelement(1, "i", 35);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.inputError(), " ");
} }
function TraceabilityComponent_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 24);
    i0.ɵɵtext(1, " C\u00F3 th\u1EC3 d\u00E1n tr\u1EF1c ti\u1EBFp li\u00EAn k\u1EBFt ch\u1EE9a ");
    i0.ɵɵelementStart(2, "span", 36);
    i0.ɵɵtext(3, "#/traceability/...");
    i0.ɵɵelementEnd()();
} }
function TraceabilityComponent_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "aside", 25)(1, "div", 37)(2, "div", 38);
    i0.ɵɵelement(3, "i", 39);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "h3", 40);
    i0.ɵɵtext(6, "T\u00ECm m\u00E3 truy xu\u1EA5t \u1EDF \u0111\u00E2u?");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 41);
    i0.ɵɵtext(8, " M\u00E3 \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB t\u1EA1i c\u00E1c \u0111i\u1EC3m sau trong quy tr\u00ECnh l\u00E0m vi\u1EC7c. ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "ol", 42)(10, "li", 43)(11, "div", 44);
    i0.ɵɵelement(12, "i", 45);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 46)(14, "div", 47);
    i0.ɵɵtext(15, " H\u00E0ng \u0110\u1EE3i In ");
    i0.ɵɵelement(16, "i", 48);
    i0.ɵɵtext(17, " Xem & In ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "p", 49);
    i0.ɵɵtext(19, " Tr\u00EAn phi\u1EBFu in, xem ");
    i0.ɵɵelementStart(20, "b", 50);
    i0.ɵɵtext(21, "g\u00F3c ph\u1EA3i ph\u1EA7n \u0111\u1EA7u trang");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(22, ", c\u1EA1nh m\u00E3 QR, t\u1EA1i nh\u00E3n ");
    i0.ɵɵelementStart(23, "b", 50);
    i0.ɵɵtext(24, "M\u00C3 TRUY XU\u1EA4T (ID)");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(25, ". ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(26, "li", 43)(27, "div", 44);
    i0.ɵɵelement(28, "i", 51);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div", 46)(30, "div", 47);
    i0.ɵɵtext(31, " K\u1EBFt Qu\u1EA3 Ph\u00E2n T\u00EDch ");
    i0.ɵɵelement(32, "i", 48);
    i0.ɵɵtext(33, " Chi Ti\u1EBFt M\u1EBB ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "p", 49);
    i0.ɵɵtext(35, " Sao ch\u00E9p d\u00F2ng ");
    i0.ɵɵelementStart(36, "b", 50);
    i0.ɵɵtext(37, "M\u00E3 m\u1EBB");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(38, " d\u01B0\u1EDBi ti\u00EAu \u0111\u1EC1, ho\u1EB7c d\u00F9ng n\u00FAt ");
    i0.ɵɵelementStart(39, "b", 50);
    i0.ɵɵtext(40, "M\u00E3 QR");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(41, " \u1EDF g\u00F3c ph\u1EA3i. ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(42, "li", 43)(43, "div", 44);
    i0.ɵɵelement(44, "i", 52);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "div", 46)(46, "div", 47);
    i0.ɵɵtext(47, " Trang Ch\u1EE7 ");
    i0.ɵɵelement(48, "i", 48);
    i0.ɵɵtext(49, " Ho\u1EA1t \u0110\u1ED9ng G\u1EA7n \u0110\u00E2y ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "p", 49);
    i0.ɵɵtext(51, " V\u1EDBi ho\u1EA1t \u0111\u1ED9ng c\u00F3 li\u00EAn k\u1EBFt h\u1ED3 s\u01A1, nh\u1EA5n ");
    i0.ɵɵelementStart(52, "b", 50);
    i0.ɵɵtext(53, "Truy Xu\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(54, " \u0111\u1EC3 m\u1EDF tr\u1EF1c ti\u1EBFp, kh\u00F4ng c\u1EA7n nh\u1EADp l\u1EA1i m\u00E3. ");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(55, "div", 53);
    i0.ɵɵelement(56, "i", 54);
    i0.ɵɵelementStart(57, "span");
    i0.ɵɵtext(58, "B\u1EA1n c\u00F3 th\u1EC3 nh\u1EADp nguy\u00EAn m\u00E3, d\u00E1n to\u00E0n b\u1ED9 li\u00EAn k\u1EBFt truy xu\u1EA5t ho\u1EB7c qu\u00E9t QR tr\u00EAn phi\u1EBFu.");
    i0.ɵɵelementEnd()()();
} }
function TraceabilityComponent_Conditional_32_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 64);
    i0.ɵɵelementStart(1, "span", 65);
    i0.ɵɵtext(2, "\u0110\u00E3 k\u1EBFt n\u1ED1i h\u1EC7 th\u1ED1ng m\u00E1y ch\u1EE7 LIMS...");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_32_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 66);
    i0.ɵɵelementStart(1, "span", 67);
    i0.ɵɵtext(2, "\u0110ang k\u1EBFt n\u1ED1i h\u1EC7 th\u1ED1ng m\u00E1y ch\u1EE7 LIMS...");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_32_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 64);
    i0.ɵɵelementStart(1, "span", 65);
    i0.ɵɵtext(2, "\u0110\u00E3 \u0111\u1ED3ng b\u1ED9 h\u1ED3 s\u01A1 nh\u1EADt k\u00FD m\u1EBB ph\u00E2n t\u00EDch...");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_32_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 66);
    i0.ɵɵelementStart(1, "span", 67);
    i0.ɵɵtext(2, "\u0110ang \u0111\u1ED3ng b\u1ED9 h\u1ED3 s\u01A1 nh\u1EADt k\u00FD m\u1EBB ph\u00E2n t\u00EDch...");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_32_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 64);
    i0.ɵɵelementStart(1, "span", 65);
    i0.ɵɵtext(2, "Ki\u1EC3m tra t\u00EDnh to\u00E0n v\u1EB9n d\u1EEF li\u1EC7u (Data Integrity)...");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_32_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 66);
    i0.ɵɵelementStart(1, "span", 67);
    i0.ɵɵtext(2, "Ki\u1EC3m tra t\u00EDnh to\u00E0n v\u1EB9n d\u1EEF li\u1EC7u (Data Integrity)...");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_32_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 64);
    i0.ɵɵelementStart(1, "span", 68);
    i0.ɵɵtext(2, "Truy xu\u1EA5t ho\u00E0n t\u1EA5t!");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_32_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 66);
    i0.ɵɵelementStart(1, "span", 67);
    i0.ɵɵtext(2, "\u0110ang tr\u00EDch xu\u1EA5t b\u00E1o c\u00E1o...");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26)(1, "div", 55)(2, "div", 56);
    i0.ɵɵelement(3, "div", 57);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 58)(5, "div", 59);
    i0.ɵɵelement(6, "i", 60);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 61);
    i0.ɵɵtext(8, "Truy xu\u1EA5t h\u1ED3 s\u01A1 LIMS");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 62)(10, "div", 63);
    i0.ɵɵtemplate(11, TraceabilityComponent_Conditional_32_Conditional_11_Template, 3, 0)(12, TraceabilityComponent_Conditional_32_Conditional_12_Template, 3, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 63);
    i0.ɵɵtemplate(14, TraceabilityComponent_Conditional_32_Conditional_14_Template, 3, 0)(15, TraceabilityComponent_Conditional_32_Conditional_15_Template, 3, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 63);
    i0.ɵɵtemplate(17, TraceabilityComponent_Conditional_32_Conditional_17_Template, 3, 0)(18, TraceabilityComponent_Conditional_32_Conditional_18_Template, 3, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 63);
    i0.ɵɵtemplate(20, TraceabilityComponent_Conditional_32_Conditional_20_Template, 3, 0)(21, TraceabilityComponent_Conditional_32_Conditional_21_Template, 3, 0);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵstyleProp("width", ctx_r2.verifyStep() / 3 * 100 + "%");
    i0.ɵɵadvance(7);
    i0.ɵɵclassProp("opacity-40", ctx_r2.verifyStep() < 0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.verifyStep() >= 0 ? 11 : 12);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("opacity-40", ctx_r2.verifyStep() < 1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.verifyStep() >= 1 ? 14 : 15);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("opacity-40", ctx_r2.verifyStep() < 2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.verifyStep() >= 2 ? 17 : 18);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("opacity-40", ctx_r2.verifyStep() < 3);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.verifyStep() >= 3 ? 20 : 21);
} }
function TraceabilityComponent_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 27)(1, "div", 69);
    i0.ɵɵelement(2, "i", 70);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3", 71);
    i0.ɵɵtext(4, "Kh\u00F4ng t\u00ECm th\u1EA5y h\u1ED3 s\u01A1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 72);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 73)(8, "button", 74);
    i0.ɵɵlistener("click", function TraceabilityComponent_Conditional_33_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.focusLookupInput()); });
    i0.ɵɵtext(9, " S\u1EEDa m\u00E3 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 75);
    i0.ɵɵlistener("click", function TraceabilityComponent_Conditional_33_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.startQrScan()); });
    i0.ɵɵelement(11, "i", 76);
    i0.ɵɵtext(12, "Qu\u00E9t QR ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "button", 75);
    i0.ɵɵlistener("click", function TraceabilityComponent_Conditional_33_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.submitLookup()); });
    i0.ɵɵelement(14, "i", 77);
    i0.ɵɵtext(15, "T\u00ECm l\u1EA1i ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r2.errorMsg());
} }
function TraceabilityComponent_Conditional_34_Conditional_16_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 117);
    i0.ɵɵlistener("click", function TraceabilityComponent_Conditional_34_Conditional_16_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const reqId_r6 = i0.ɵɵnextContext(); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.viewBatchResults(reqId_r6)); });
    i0.ɵɵelement(1, "i", 118);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Xem K\u1EBFt Qu\u1EA3 M\u1EBB Ph\u00E2n T\u00EDch");
    i0.ɵɵelementEnd()();
} }
function TraceabilityComponent_Conditional_34_Conditional_16_Conditional_2_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " T\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\u00F4ng c\u00F3 quy\u1EC1n xem d\u1EEF li\u1EC7u n\u00E0y. ");
} }
function TraceabilityComponent_Conditional_34_Conditional_16_Conditional_2_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Y\u00EAu c\u1EA7u \u0111\u0103ng nh\u1EADp h\u1EC7 th\u1ED1ng LIMS \u0111\u1EC3 xem chi ti\u1EBFt. ");
} }
function TraceabilityComponent_Conditional_34_Conditional_16_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 116)(1, "div", 119);
    i0.ɵɵelement(2, "i", 120);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "p", 121);
    i0.ɵɵtext(5, "K\u1EBFt qu\u1EA3 thu\u1ED9c ch\u1EBF \u0111\u1ED9 b\u1EA3o m\u1EADt.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 122);
    i0.ɵɵtemplate(7, TraceabilityComponent_Conditional_34_Conditional_16_Conditional_2_Conditional_7_Template, 1, 0)(8, TraceabilityComponent_Conditional_34_Conditional_16_Conditional_2_Conditional_8_Template, 1, 0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(7);
    i0.ɵɵconditional(ctx_r2.auth.currentUser() ? 7 : 8);
} }
function TraceabilityComponent_Conditional_34_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 88);
    i0.ɵɵtemplate(1, TraceabilityComponent_Conditional_34_Conditional_16_Conditional_1_Template, 4, 0, "button", 115)(2, TraceabilityComponent_Conditional_34_Conditional_16_Conditional_2_Template, 9, 1, "div", 116);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.auth.currentUser() && ctx_r2.auth.canViewSop() ? 1 : 2);
} }
function TraceabilityComponent_Conditional_34_Conditional_20_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 126);
} }
function TraceabilityComponent_Conditional_34_Conditional_20_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 134);
} }
function TraceabilityComponent_Conditional_34_Conditional_20_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 135);
} }
function TraceabilityComponent_Conditional_34_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 91)(1, "h4", 123);
    i0.ɵɵtext(2, "Ti\u1EBFn \u0110\u1ED9 Quy Tr\u00ECnh LIMS");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 124)(4, "div", 125);
    i0.ɵɵelement(5, "div", 126);
    i0.ɵɵelementStart(6, "div", 127);
    i0.ɵɵelement(7, "i", 128);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 129)(9, "div", 130);
    i0.ɵɵtext(10, "B\u01B0\u1EDBc 1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 131);
    i0.ɵɵtext(12, "Ti\u1EBFp nh\u1EADn");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "div", 125);
    i0.ɵɵtemplate(14, TraceabilityComponent_Conditional_34_Conditional_20_Conditional_14_Template, 1, 0, "div", 126);
    i0.ɵɵelementStart(15, "div", 132);
    i0.ɵɵelement(16, "i", 133);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 129)(18, "div", 130);
    i0.ɵɵtext(19, "B\u01B0\u1EDBc 2");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 131);
    i0.ɵɵtext(21, "Ph\u00EA duy\u1EC7t");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(22, "div", 125);
    i0.ɵɵtemplate(23, TraceabilityComponent_Conditional_34_Conditional_20_Conditional_23_Template, 1, 0, "div", 134)(24, TraceabilityComponent_Conditional_34_Conditional_20_Conditional_24_Template, 1, 0, "div", 135);
    i0.ɵɵelementStart(25, "div", 132);
    i0.ɵɵelement(26, "i", 136);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "div", 129)(28, "div", 130);
    i0.ɵɵtext(29, "B\u01B0\u1EDBc 3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "div", 131);
    i0.ɵɵtext(31, "C\u1EADp nh\u1EADt & B\u00E1o c\u00E1o");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const status_r7 = ctx;
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngClass", status_r7 !== "unknown" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" : "border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", status_r7 !== "unknown" ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", status_r7 !== "unknown" ? "text-indigo-700 dark:text-indigo-400" : "text-slate-400");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngClass", status_r7 === "approved" || status_r7 === "draft" || status_r7 === "completed" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" : "border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800");
    i0.ɵɵadvance();
    i0.ɵɵconditional(status_r7 === "approved" || status_r7 === "draft" || status_r7 === "completed" ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", status_r7 === "approved" || status_r7 === "draft" || status_r7 === "completed" ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", status_r7 === "approved" || status_r7 === "draft" || status_r7 === "completed" ? "text-indigo-700 dark:text-indigo-400" : "text-slate-400");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngClass", status_r7 === "completed" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : status_r7 === "draft" ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800");
    i0.ɵɵadvance();
    i0.ɵɵconditional(status_r7 === "completed" ? 23 : status_r7 === "draft" ? 24 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", status_r7 === "completed" ? "bg-emerald-500" : status_r7 === "draft" ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", status_r7 === "completed" ? "text-emerald-700 dark:text-emerald-400" : status_r7 === "draft" ? "text-amber-700 dark:text-amber-400" : "text-slate-400");
} }
function TraceabilityComponent_Conditional_34_Conditional_38_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 138);
} }
function TraceabilityComponent_Conditional_34_Conditional_38_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 87);
} }
function TraceabilityComponent_Conditional_34_Conditional_38_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 139);
} }
function TraceabilityComponent_Conditional_34_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 137);
    i0.ɵɵtemplate(1, TraceabilityComponent_Conditional_34_Conditional_38_Conditional_1_Template, 1, 0, "i", 138)(2, TraceabilityComponent_Conditional_34_Conditional_38_Conditional_2_Template, 1, 0, "i", 87)(3, TraceabilityComponent_Conditional_34_Conditional_38_Conditional_3_Template, 1, 0, "i", 139);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const status_r8 = ctx;
    i0.ɵɵclassMap(status_r8 === "pending" ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/30" : status_r8 === "approved" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/30" : status_r8 === "rejected" ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/30" : status_r8 === "completed" ? "bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200/60 dark:border-fuchsia-900/30" : status_r8 === "draft" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/30" : "bg-slate-50 text-slate-700 border-slate-200/60");
    i0.ɵɵadvance();
    i0.ɵɵconditional(status_r8 === "completed" || status_r8 === "approved" ? 1 : status_r8 === "pending" || status_r8 === "draft" ? 2 : status_r8 === "rejected" ? 3 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", status_r8 === "pending" ? "Ch\u1EDD duy\u1EC7t" : status_r8 === "approved" ? "\u0110\u00E3 duy\u1EC7t" : status_r8 === "rejected" ? "B\u1ECB t\u1EEB ch\u1ED1i" : status_r8 === "completed" ? "\u0110\u00E3 ho\u00E0n th\u00E0nh" : status_r8 === "draft" ? "L\u01B0u nh\u00E1p" : status_r8, " ");
} }
function TraceabilityComponent_Conditional_34_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "span", 140);
    i0.ɵɵtext(2, "Quy tr\u00ECnh (SOP)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 141);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ((tmp_4_0 = ctx_r2.logData()) == null ? null : tmp_4_0.sopBasicInfo == null ? null : tmp_4_0.sopBasicInfo.name) || ((tmp_4_0 = ctx_r2.logData()) == null ? null : tmp_4_0.printData == null ? null : tmp_4_0.printData.sop == null ? null : tmp_4_0.printData.sop.name), " ");
} }
function TraceabilityComponent_Conditional_34_Conditional_51_For_5_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 144);
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "b");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_16_0;
    const key_r9 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", key_r9, ": ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((tmp_16_0 = ctx_r2.logData()) == null ? null : tmp_16_0.printData == null ? null : tmp_16_0.printData.inputs[key_r9]);
} }
function TraceabilityComponent_Conditional_34_Conditional_51_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, TraceabilityComponent_Conditional_34_Conditional_51_For_5_Conditional_0_Template, 4, 2, "span", 144);
} if (rf & 2) {
    const key_r9 = ctx.$implicit;
    i0.ɵɵconditional(key_r9 !== "sampleList" && key_r9 !== "targetIds" && key_r9 !== "sampleTargetMap" && key_r9 !== "sampleDescriptionMap" ? 0 : -1);
} }
function TraceabilityComponent_Conditional_34_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "span", 142);
    i0.ɵɵtext(2, "Th\u00F4ng s\u1ED1 \u0111\u1EA7u v\u00E0o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 143);
    i0.ɵɵrepeaterCreate(4, TraceabilityComponent_Conditional_34_Conditional_51_For_5_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r2.objectKeys((tmp_4_0 = ctx_r2.logData()) == null ? null : tmp_4_0.printData == null ? null : tmp_4_0.printData.inputs));
} }
function TraceabilityComponent_Conditional_34_Conditional_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "span", 140);
    i0.ɵɵtext(2, "Danh s\u00E1ch m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 145);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r2.formatSampleList((tmp_4_0 = ctx_r2.logData()) == null ? null : tmp_4_0.printData == null ? null : tmp_4_0.printData.inputs == null ? null : tmp_4_0.printData.inputs.sampleList));
} }
function TraceabilityComponent_Conditional_34_Conditional_53_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 147)(1, "span", 36);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r10 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r10.sampleId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" \u00B7 ", row_r10.description, "");
} }
function TraceabilityComponent_Conditional_34_Conditional_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "span", 142);
    i0.ɵɵtext(2, "M\u00F4 t\u1EA3 t\u1EEBng m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 146);
    i0.ɵɵrepeaterCreate(4, TraceabilityComponent_Conditional_34_Conditional_53_For_5_Template, 4, 2, "span", 147, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r2.getSampleDescriptionRows());
} }
function TraceabilityComponent_Conditional_34_Conditional_54_For_5_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 153);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r11.targetScope.headline, " ");
} }
function TraceabilityComponent_Conditional_34_Conditional_54_For_5_Conditional_5_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 153);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tName_r12 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", tName_r12, " ");
} }
function TraceabilityComponent_Conditional_34_Conditional_54_For_5_Conditional_5_ForEmpty_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 154);
    i0.ɵɵtext(1, "Kh\u00F4ng c\u00F3 ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd();
} }
function TraceabilityComponent_Conditional_34_Conditional_54_For_5_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, TraceabilityComponent_Conditional_34_Conditional_54_For_5_Conditional_5_For_1_Template, 2, 1, "span", 153, i0.ɵɵrepeaterTrackByIdentity, false, TraceabilityComponent_Conditional_34_Conditional_54_For_5_Conditional_5_ForEmpty_2_Template, 2, 0, "span", 154);
} if (rf & 2) {
    const group_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵrepeater(group_r11.targetNames);
} }
function TraceabilityComponent_Conditional_34_Conditional_54_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 150)(1, "span", 151);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 152);
    i0.ɵɵtemplate(4, TraceabilityComponent_Conditional_34_Conditional_54_For_5_Conditional_4_Template, 2, 1, "span", 153)(5, TraceabilityComponent_Conditional_34_Conditional_54_For_5_Conditional_5_Template, 3, 1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r11 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r11.formattedSamples);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(group_r11.targetScope.compact ? 4 : 5);
} }
function TraceabilityComponent_Conditional_34_Conditional_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 113)(1, "span", 148);
    i0.ɵɵtext(2, "Ch\u1EC9 ti\u00EAu ph\u00E2n t\u00EDch theo t\u1EEBng m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 149);
    i0.ɵɵrepeaterCreate(4, TraceabilityComponent_Conditional_34_Conditional_54_For_5_Template, 6, 2, "div", 150, _forTrack1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx);
} }
function TraceabilityComponent_Conditional_34_Conditional_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "span", 140);
    i0.ɵɵtext(2, "Ng\u00E0y ph\u00E2n t\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 141);
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(5, 1, (tmp_4_0 = ctx_r2.logData()) == null ? null : tmp_4_0.printData == null ? null : tmp_4_0.printData.analysisDate, "dd/MM/yyyy"));
} }
function TraceabilityComponent_Conditional_34_Conditional_56_For_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 161)(1, "td", 162);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 163);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r13 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r13.displayName || item_r13.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", ctx_r2.formatNum(item_r13.stockNeed), " ", item_r13.stockUnit, " ");
} }
function TraceabilityComponent_Conditional_34_Conditional_56_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 114)(1, "h4", 111);
    i0.ɵɵtext(2, "Danh S\u00E1ch H\u00F3a Ch\u1EA5t S\u1EED D\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 155)(4, "table", 156)(5, "thead", 157)(6, "tr")(7, "th", 158);
    i0.ɵɵtext(8, "T\u00EAn h\u00F3a ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "th", 159);
    i0.ɵɵtext(10, "L\u01B0\u1EE3ng d\u00F9ng");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "tbody", 160);
    i0.ɵɵrepeaterCreate(12, TraceabilityComponent_Conditional_34_Conditional_56_For_13_Template, 5, 3, "tr", 161, _forTrack2);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(12);
    i0.ɵɵrepeater((tmp_4_0 = ctx_r2.logData()) == null ? null : tmp_4_0.printData == null ? null : tmp_4_0.printData.items);
} }
function TraceabilityComponent_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28);
    i0.ɵɵelement(1, "div", 78);
    i0.ɵɵelementStart(2, "div", 79)(3, "div", 80)(4, "div")(5, "div", 81)(6, "span", 82);
    i0.ɵɵtext(7, " Transaction ID ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span", 83);
    i0.ɵɵelement(9, "i", 84);
    i0.ɵɵtext(10, " H\u1EC7 th\u1ED1ng LIMS ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 85);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 86);
    i0.ɵɵelement(14, "i", 87);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(16, TraceabilityComponent_Conditional_34_Conditional_16_Template, 3, 1, "div", 88);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 89);
    i0.ɵɵelement(18, "canvas", 90, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(20, TraceabilityComponent_Conditional_34_Conditional_20_Template, 32, 11, "div", 91);
    i0.ɵɵelementStart(21, "div", 92)(22, "div", 93)(23, "div", 94);
    i0.ɵɵelement(24, "div", 95);
    i0.ɵɵelementStart(25, "div", 96)(26, "div", 97)(27, "div", 98);
    i0.ɵɵelement(28, "img", 99);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div")(30, "div", 100);
    i0.ɵɵtext(31, "Th\u1EF1c hi\u1EC7n b\u1EDFi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 101);
    i0.ɵɵtext(33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 102);
    i0.ɵɵelement(35, "i", 103);
    i0.ɵɵtext(36, " Authorized Staff ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(37, "div", 104);
    i0.ɵɵtemplate(38, TraceabilityComponent_Conditional_34_Conditional_38_Template, 5, 4, "span", 105);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(39, "div", 106)(40, "div", 107);
    i0.ɵɵtext(41, "S\u1EF1 ki\u1EC7n h\u1EC7 th\u1ED1ng ghi nh\u1EADn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div", 108);
    i0.ɵɵtext(43);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "div", 109);
    i0.ɵɵtext(45);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(46, "div", 110)(47, "h4", 111);
    i0.ɵɵtext(48, "Chi Ti\u1EBFt Ng\u1EEF C\u1EA3nh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "div", 112);
    i0.ɵɵtemplate(50, TraceabilityComponent_Conditional_34_Conditional_50_Template, 5, 1, "div")(51, TraceabilityComponent_Conditional_34_Conditional_51_Template, 6, 0, "div")(52, TraceabilityComponent_Conditional_34_Conditional_52_Template, 5, 1, "div")(53, TraceabilityComponent_Conditional_34_Conditional_53_Template, 6, 0, "div")(54, TraceabilityComponent_Conditional_34_Conditional_54_Template, 6, 0, "div", 113)(55, TraceabilityComponent_Conditional_34_Conditional_55_Template, 6, 4, "div");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(56, TraceabilityComponent_Conditional_34_Conditional_56_Template, 14, 0, "div", 114);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_19_0;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(12);
    i0.ɵɵtextInterpolate1(" ", (tmp_3_0 = ctx_r2.logData()) == null ? null : tmp_3_0.id, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.formatDate((tmp_4_0 = ctx_r2.logData()) == null ? null : tmp_4_0.timestamp), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_5_0 = ctx_r2.getAssociatedRequestId()) ? 16 : -1, tmp_5_0);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional((tmp_6_0 = (tmp_6_0 = ctx_r2.logData()) == null ? null : tmp_6_0.status) ? 20 : -1, tmp_6_0);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngClass", ((tmp_7_0 = ctx_r2.logData()) == null ? null : tmp_7_0.status) === "completed" || ((tmp_7_0 = ctx_r2.logData()) == null ? null : tmp_7_0.status) === "approved" ? "bg-emerald-500" : ((tmp_7_0 = ctx_r2.logData()) == null ? null : tmp_7_0.status) === "pending" ? "bg-amber-500" : ((tmp_7_0 = ctx_r2.logData()) == null ? null : tmp_7_0.status) === "draft" ? "bg-indigo-500" : ((tmp_7_0 = ctx_r2.logData()) == null ? null : tmp_7_0.status) === "rejected" ? "bg-rose-500" : "bg-slate-400");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("src", ctx_r2.getAvatarUrl((tmp_8_0 = ctx_r2.logData()) == null ? null : tmp_8_0.user, ctx_r2.state.getUserAvatarOptions((tmp_8_0 = ctx_r2.logData()) == null ? null : tmp_8_0.user).style, ctx_r2.state.getUserAvatarOptions((tmp_8_0 = ctx_r2.logData()) == null ? null : tmp_8_0.user).photoURL), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate((tmp_9_0 = ctx_r2.logData()) == null ? null : tmp_9_0.user);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional((tmp_10_0 = (tmp_10_0 = ctx_r2.logData()) == null ? null : tmp_10_0.status) ? 38 : -1, tmp_10_0);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.getActionLabel((tmp_11_0 = ctx_r2.logData()) == null ? null : tmp_11_0.action), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", (tmp_12_0 = ctx_r2.logData()) == null ? null : tmp_12_0.details, " ");
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(((tmp_13_0 = ctx_r2.logData()) == null ? null : tmp_13_0.sopBasicInfo == null ? null : tmp_13_0.sopBasicInfo.name) || ((tmp_13_0 = ctx_r2.logData()) == null ? null : tmp_13_0.printData == null ? null : tmp_13_0.printData.sop == null ? null : tmp_13_0.printData.sop.name) ? 50 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_14_0 = ctx_r2.logData()) == null ? null : tmp_14_0.printData == null ? null : tmp_14_0.printData.inputs) ? 51 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_15_0 = ctx_r2.logData()) == null ? null : tmp_15_0.printData == null ? null : tmp_15_0.printData.inputs == null ? null : tmp_15_0.printData.inputs.sampleList == null ? null : tmp_15_0.printData.inputs.sampleList.length) > 0 ? 52 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.getSampleDescriptionRows().length > 0 ? 53 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_17_0 = ctx_r2.computedSampleTargetGroups()) ? 54 : -1, tmp_17_0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_18_0 = ctx_r2.logData()) == null ? null : tmp_18_0.printData == null ? null : tmp_18_0.printData.analysisDate) ? 55 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_19_0 = ctx_r2.logData()) == null ? null : tmp_19_0.printData == null ? null : tmp_19_0.printData.items) ? 56 : -1);
} }
export class TraceabilityComponent {
    constructor() {
        this.initialized = false;
        this.auth = inject(AuthService);
        this.state = inject(StateService);
        this.fb = inject(FirebaseService);
        this.toast = inject(ToastService);
        this.qrService = inject(QrGlobalService);
        this.masterTargetService = inject(MasterTargetService);
        this.targetService = inject(TargetService);
        this.router = inject(Router);
        this.formatDate = formatDate;
        this.formatNum = formatNum;
        this.formatSampleList = formatSampleList;
        this.getAvatarUrl = getAvatarUrl;
        this.objectKeys = Object.keys;
        this.logData = signal(null);
        this.masterTargets = signal([]);
        this.availableTargetGroups = signal([]);
        this.isLoading = signal(false);
        this.isVerifying = signal(false);
        this.verifyStep = signal(0);
        this.errorMsg = signal('');
        this.inputError = signal('');
        this.lookupValue = '';
        this.qrCanvas = viewChild('qrCanvas');
        this.lookupInput = viewChild('lookupInput');
        this.lookupRequest = 0;
        this.computedSampleTargetGroups = computed(() => {
            const log = this.logData();
            if (!log)
                return null;
            const targetMap = log.sampleTargetMap
                || log.inputs?.sampleTargetMap
                || log.printData?.sampleTargetMap
                || log.printData?.inputs?.sampleTargetMap
                || {};
            const fallbackTargets = log.targetIds || log.inputs?.targetIds || log.printData?.targetIds || log.printData?.inputs?.targetIds || [];
            const sampleList = log.sampleList || log.inputs?.sampleList || log.printData?.sampleList || log.printData?.inputs?.sampleList || [];
            if (!sampleList.length && !Object.keys(targetMap).length)
                return null;
            const allSamples = Array.from(new Set([...sampleList, ...Object.keys(targetMap)]));
            if (allSamples.length === 0)
                return null;
            const groupMap = new Map();
            allSamples.forEach(sampleId => {
                const assignedTargets = getAssignedTargetsForSample(sampleId, targetMap);
                const targetIds = assignedTargets?.length ? assignedTargets : fallbackTargets;
                const canonicalTargets = new Map();
                targetIds.forEach((targetId) => {
                    const canonicalId = getCanonicalId(targetId);
                    if (canonicalId && !canonicalTargets.has(canonicalId)) {
                        canonicalTargets.set(canonicalId, targetId);
                    }
                });
                // Sort canonical IDs for consistent signature
                const dedupedTargetIds = Array.from(canonicalTargets.values()).sort((a, b) => naturalCompare(this.resolveCompoundName(a), this.resolveCompoundName(b)));
                const signature = dedupedTargetIds.join('|');
                if (!groupMap.has(signature)) {
                    groupMap.set(signature, { samples: [], targetIds: dedupedTargetIds });
                }
                groupMap.get(signature).samples.push(sampleId);
            });
            const groups = Array.from(groupMap.values()).map(g => {
                const sopId = log.printData?.sop?.id || log.sopBasicInfo?.id || log.sopId;
                const sopVersion = log.printData?.sop?.version || log.sopBasicInfo?.version || log.sopVersion;
                const sopTargetSnapshot = log.targetNames || log.printData?.targetNames || log.printData?.sop?.targets;
                const classification = classifyTargetScope({
                    assignedTargetIds: g.targetIds,
                    sopId,
                    sopVersion,
                    sopTargetSnapshot,
                    availableGroups: this.availableTargetGroups()
                });
                const targetNames = g.targetIds.map(tId => this.resolveCompoundName(tId));
                const targetScope = buildTargetScopePresentation(targetNames, classification);
                return {
                    formattedSamples: formatSampleList(g.samples.sort(naturalCompare)),
                    targetIds: g.targetIds,
                    targetScope,
                    targetNames
                };
            }).sort((a, b) => naturalCompare(a.formattedSamples, b.formattedSamples));
            return groups.length > 0 ? groups : null;
        });
    }
    set id(value) {
        this.routeId = value;
        if (this.initialized) {
            this.handleRouteId(value);
        }
    }
    get id() {
        return this.routeId;
    }
    async ngOnInit() {
        this.state.ensureUserInfoCacheListener();
        this.initialized = true;
        this.handleRouteId(this.routeId);
        try {
            const [analytes, groups] = await Promise.all([
                this.masterTargetService.getAll(),
                this.targetService.getAllGroups()
            ]);
            this.masterTargets.set(analytes);
            this.availableTargetGroups.set(groups);
        }
        catch (e) {
            console.warn('Failed to load master analytes or target groups in TraceabilityComponent', e);
        }
    }
    ngOnDestroy() {
        this.lookupRequest++;
        this.stopVerificationTimers();
    }
    submitLookup() {
        const code = this.normalizeLookupValue(this.lookupValue);
        this.inputError.set('');
        if (!code) {
            this.inputError.set('Vui lòng nhập mã hồ sơ cần truy xuất.');
            this.focusLookupInput();
            return;
        }
        if (code.length > 200 || code.includes('/')) {
            this.inputError.set('Mã hồ sơ không hợp lệ. Vui lòng kiểm tra lại mã hoặc liên kết.');
            this.focusLookupInput();
            return;
        }
        this.lookupValue = code;
        if (this.routeId === code) {
            void this.loadData(code);
            return;
        }
        void this.router.navigate(['/traceability', code]);
    }
    clearLookupInput() {
        this.lookupValue = '';
        this.inputError.set('');
        this.focusLookupInput();
    }
    focusLookupInput() {
        setTimeout(() => {
            const input = this.lookupInput()?.nativeElement;
            input?.focus();
            input?.select();
        });
    }
    startQrScan() {
        this.qrService.startScan();
    }
    handleRouteId(value) {
        const code = this.normalizeLookupValue(value || '');
        if (!code) {
            this.lookupRequest++;
            this.stopVerificationTimers();
            this.lookupValue = '';
            this.logData.set(null);
            this.errorMsg.set('');
            this.inputError.set('');
            this.isLoading.set(false);
            this.isVerifying.set(false);
            this.verifyStep.set(0);
            this.focusLookupInput();
            return;
        }
        this.lookupValue = code;
        this.inputError.set('');
        void this.loadData(code);
    }
    normalizeLookupValue(rawValue) {
        let value = rawValue.trim();
        if (!value)
            return '';
        try {
            const parsedUrl = new URL(value, window.location.origin);
            const hashMatch = parsedUrl.hash.match(/#\/traceability\/([^/?#]+)/i);
            const pathMatch = parsedUrl.pathname.match(/\/traceability\/([^/?#]+)/i);
            const queryId = parsedUrl.searchParams.get('id');
            if (hashMatch?.[1]) {
                value = hashMatch[1];
            }
            else if (pathMatch?.[1]) {
                value = pathMatch[1];
            }
            else if (queryId) {
                value = queryId;
            }
        }
        catch {
            const routeMatch = value.match(/(?:#\/)?traceability\/([^/?#]+)/i);
            if (routeMatch?.[1]) {
                value = routeMatch[1];
            }
        }
        try {
            value = decodeURIComponent(value);
        }
        catch {
            // Keep the original value when it is not valid URI-encoded text.
        }
        return value.trim();
    }
    stopVerificationTimers() {
        if (this.verificationInterval) {
            clearInterval(this.verificationInterval);
            this.verificationInterval = undefined;
        }
        if (this.verificationTimeout) {
            clearTimeout(this.verificationTimeout);
            this.verificationTimeout = undefined;
        }
    }
    resolveCompoundName(compoundId) {
        const sopId = this.logData()?.printData?.sop?.id || this.logData()?.sopBasicInfo?.id || null;
        return resolveCompoundDisplayName(compoundId, this.masterTargets(), sopId);
    }
    getAssociatedRequestId() {
        const log = this.logData();
        if (!log)
            return null;
        if (log.requestId)
            return log.requestId;
        if (log.printData?.requestId)
            return log.printData.requestId;
        if (log.printData?.inputs?.['batchCode'])
            return log.printData.inputs['batchCode'];
        return log.id || null;
    }
    viewBatchResults(requestId) {
        this.router.navigate(['/results-view', requestId]);
    }
    getActionLabel(action) {
        if (!action)
            return 'Không xác định';
        const map = {
            'PENDING_REQUEST': 'Yêu cầu chờ duyệt',
            'APPROVED_REQUEST': 'Yêu cầu đã duyệt',
            'REJECTED_REQUEST': 'Yêu cầu bị từ chối',
            'COMPLETED_REQUEST': 'Yêu cầu đã hoàn thành',
            'DRAFT_REQUEST': 'Phiếu yêu cầu lưu nháp',
            'EDIT_REQUEST': 'Chỉnh sửa phiếu yêu cầu',
            'PRINT_JOB_RECORD': 'Lưu trữ phiếu in',
            'DIRECT_APPROVE': 'Duyệt & xếp hàng in',
            'APPROVE_REQUEST': 'Duyệt yêu cầu',
            'REVOKE_APPROVE': 'Hoàn tác phê duyệt',
            'CREATE_STANDARD_REQUEST': 'Yêu cầu mượn chuẩn',
            'REQUEST_STANDARD': 'Yêu cầu mượn chuẩn',
            'APPROVE_STANDARD_REQUEST': 'Duyệt mượn chuẩn',
            'REJECT_STANDARD_REQUEST': 'Từ chối mượn chuẩn',
            'REPORT_RETURN_STANDARD': 'Báo cáo trả chuẩn',
            'RETURN_STANDARD': 'Nhận lại chuẩn',
            'ASSIGN_STANDARD': 'Gán chuẩn cho mượn',
            'SAVE_RESULT_DRAFT': 'Lưu nháp kết quả',
            'PUBLISH_RESULT_REPORT': 'Xuất bản báo cáo kết quả',
            'REVERT_RESULT_DRAFT': 'Hủy xuất bản báo cáo',
            'RESET_RESULT_DATA': 'Reset số liệu kết quả',
            'RESTORE_RESULT_BACKUP': 'Khôi phục số liệu lưu trữ',
            'RESTORE_RESULT_VERSION': 'Khôi phục phiên bản cũ',
            'generate_pdf': 'Tạo tệp PDF',
            'archive_reports': 'Lưu trữ báo cáo'
        };
        if (map[action])
            return map[action];
        if (action.includes('APPROVE'))
            return 'Phê duyệt';
        if (action.includes('CREATE'))
            return 'Tạo mới';
        if (action.includes('UPDATE'))
            return 'Cập nhật';
        if (action.includes('DELETE'))
            return 'Xóa';
        return action;
    }
    getSampleTargetMap() {
        const log = this.logData();
        if (!log)
            return null;
        const targetMap = log.sampleTargetMap
            || log.inputs?.sampleTargetMap
            || log.printData?.sampleTargetMap
            || log.printData?.inputs?.sampleTargetMap;
        if (targetMap && typeof targetMap === 'object' && !Array.isArray(targetMap)) {
            return targetMap;
        }
        return null;
    }
    getSampleDescriptionRows() {
        const log = this.logData();
        const inputs = log?.printData?.inputs || log?.inputs || {};
        const map = log?.sampleDescriptionMap || inputs.sampleDescriptionMap;
        const samples = inputs.sampleList || log?.sampleList || Object.keys(map || {});
        return samples.map(sampleId => ({
            sampleId,
            description: getSampleDescriptionSnapshot(map, sampleId)?.nameSnapshot || ''
        })).filter(item => item.description).sort((a, b) => naturalCompare(a.sampleId, b.sampleId));
    }
    getSortedTargets(tIds) {
        if (!tIds || !Array.isArray(tIds))
            return [];
        return [...tIds].sort((a, b) => naturalCompare(this.resolveCompoundName(a), this.resolveCompoundName(b)));
    }
    async loadData(id) {
        const requestToken = ++this.lookupRequest;
        this.stopVerificationTimers();
        this.isLoading.set(true);
        this.isVerifying.set(false);
        this.verifyStep.set(-1);
        this.errorMsg.set('');
        this.logData.set(null);
        try {
            // 1. Try Direct Log Lookup (Priority 1)
            const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/logs/${id}`);
            const snap = await getDoc(logRef);
            if (requestToken !== this.lookupRequest)
                return;
            if (snap.exists()) {
                this.startVerificationProcess({ id: snap.id, ...snap.data() }, requestToken);
                return;
            }
            // 2. Try Lookup by Print Job ID (Legacy or linked) (Priority 2)
            const jobRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs/${id}`);
            const jobSnap = await getDoc(jobRef);
            if (requestToken !== this.lookupRequest)
                return;
            if (jobSnap.exists()) {
                const jobData = jobSnap.data();
                const mockLog = {
                    id: id,
                    action: 'PRINT_JOB_RECORD',
                    details: 'Hồ sơ in ấn lưu trữ',
                    timestamp: jobData.createdAt || new Date(),
                    user: jobData.createdBy || 'System',
                    printable: true,
                    printData: jobData // Embed full data
                };
                this.startVerificationProcess(mockLog, requestToken);
                return;
            }
            // 3. Try Lookup by REQUEST ID (Dashboard links point here) (Priority 3)
            const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/requests/${id}`);
            const reqSnap = await getDoc(reqRef);
            if (requestToken !== this.lookupRequest)
                return;
            if (reqSnap.exists()) {
                const reqData = reqSnap.data();
                // Map Request format to Log format for display consistency
                // RequestItem needs to be mapped to CalculatedItem-like structure for the template
                const mappedItems = (reqData.items || []).map((item) => ({
                    name: item.name,
                    displayName: item.displayName,
                    stockNeed: item.amount, // Request stores 'amount' as stock deduction
                    stockUnit: item.stockUnit || item.unit,
                    // Request items are usually flattened, so no breakdown
                    isComposite: false
                }));
                const mockLog = {
                    id: reqSnap.id,
                    action: reqData.status === 'pending' ? 'PENDING_REQUEST' :
                        reqData.status === 'approved' ? 'APPROVED_REQUEST' :
                            reqData.status === 'rejected' ? 'REJECTED_REQUEST' :
                                reqData.status === 'completed' ? 'COMPLETED_REQUEST' :
                                    reqData.status === 'draft' ? 'DRAFT_REQUEST' : 'APPROVED_REQUEST',
                    details: `Yêu cầu phân tích: ${reqData.sopName}`,
                    timestamp: reqData.approvedAt || reqData.timestamp,
                    user: reqData.user || 'Unknown',
                    printable: true,
                    status: reqData.status, // Custom field stored in Log type!
                    sopBasicInfo: {
                        name: reqData.sopName,
                        category: 'Request Record'
                    },
                    printData: {
                        // We might not have the full SOP object here, but we have inputs
                        sop: { name: reqData.sopName, category: 'Request', id: reqData.sopId },
                        inputs: {
                            ...reqData.inputs,
                            sampleList: reqData.sampleList,
                            targetIds: reqData.targetIds,
                            sampleTargetMap: reqData.sampleTargetMap,
                            sampleDescriptionMap: reqData.sampleDescriptionMap
                        },
                        items: mappedItems,
                        margin: reqData.margin,
                        analysisDate: reqData.analysisDate
                    }
                };
                this.startVerificationProcess(mockLog, requestToken);
                return;
            }
            // 4. Not Found
            this.errorMsg.set(`Không tìm thấy dữ liệu cho mã: ${id}`);
        }
        catch (e) {
            if (requestToken !== this.lookupRequest)
                return;
            console.error(e);
            this.errorMsg.set('Lỗi kết nối: ' + e.message);
        }
        finally {
            if (requestToken === this.lookupRequest) {
                this.isLoading.set(false);
            }
        }
    }
    startVerificationProcess(log, requestToken = this.lookupRequest) {
        this.stopVerificationTimers();
        this.isVerifying.set(true);
        this.isLoading.set(false);
        this.verifyStep.set(0);
        let step = 0;
        this.verificationInterval = setInterval(() => {
            if (requestToken !== this.lookupRequest) {
                this.stopVerificationTimers();
                return;
            }
            step++;
            this.verifyStep.set(step);
            if (step >= 3) {
                if (this.verificationInterval) {
                    clearInterval(this.verificationInterval);
                    this.verificationInterval = undefined;
                }
                this.verificationTimeout = setTimeout(() => {
                    if (requestToken !== this.lookupRequest)
                        return;
                    this.isVerifying.set(false);
                    this.handleLogData(log, requestToken);
                }, 300);
            }
        }, 250);
    }
    handleLogData(log, requestToken = this.lookupRequest) {
        const getStatusAndHydrate = async () => {
            // If log has requestId and no status, fetch request status
            if (log.requestId && !log.status) {
                try {
                    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/requests/${log.requestId}`);
                    const reqSnap = await getDoc(reqRef);
                    if (reqSnap.exists()) {
                        log.status = reqSnap.data()['status'];
                    }
                }
                catch (e) {
                    console.warn('Failed to fetch request status in Traceability', e);
                }
            }
            // Hydrate if printJobId exists but printData is missing (New Arch)
            if (log.printJobId && !log.printData) {
                try {
                    const jobRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs/${log.printJobId}`);
                    const jobSnap = await getDoc(jobRef);
                    if (jobSnap.exists()) {
                        log.printData = jobSnap.data();
                    }
                }
                catch (e) {
                    console.warn('Failed to fetch print job in Traceability', e);
                }
            }
            if (requestToken !== this.lookupRequest)
                return;
            this.logData.set(log);
            setTimeout(() => void this.generateQr(log.id), 100);
        };
        getStatusAndHydrate();
    }
    async generateQr(text) {
        if (!this.qrCanvas())
            return;
        let QRious;
        try {
            QRious = await ensureQrious();
        }
        catch (e) {
            console.warn('QR library load error:', e);
            return;
        }
        if (!QRious || !this.qrCanvas())
            return;
        // Use same URL structure as print layout
        const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
        const fullUrl = baseUrl + text;
        new QRious({
            element: this.qrCanvas().nativeElement,
            value: fullUrl,
            size: 150,
            level: 'M'
        });
    }
    static { this.ɵfac = function TraceabilityComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TraceabilityComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TraceabilityComponent, selectors: [["app-traceability"]], viewQuery: function TraceabilityComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuerySignal(ctx.qrCanvas, _c0, 5);
            i0.ɵɵviewQuerySignal(ctx.lookupInput, _c1, 5);
        } if (rf & 2) {
            i0.ɵɵqueryAdvance(2);
        } }, inputs: { id: "id" }, decls: 35, vars: 13, consts: [["lookupInput", ""], ["qrCanvas", ""], [1, "w-full", "h-screen", "overflow-y-auto", "max-w-7xl", "mx-auto", "pb-20", "fade-in", "px-4", "md:px-0"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-6", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-slate-100", "dark:bg-slate-700", "text-slate-700", "dark:text-slate-350", "flex", "items-center", "justify-center", "border", "border-slate-200", "dark:border-slate-600", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-qrcode", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "mb-6", "transition-all", "duration-300", 3, "ngClass"], [1, "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "shadow-sm", 3, "ngClass"], [1, "mb-4"], [1, "flex", "flex-col", "sm:flex-row", "items-stretch", "gap-2", 3, "ngSubmit"], [1, "relative", "flex-1", "min-w-0"], [1, "sr-only"], [1, "fa-solid", "fa-magnifying-glass", "absolute", "left-3.5", "top-1/2", "-translate-y-1/2", "text-xs", "text-slate-400"], ["type", "text", "name", "traceabilityLookup", "placeholder", "V\u00ED d\u1EE5: REQ-..., LOG-... ho\u1EB7c URL truy xu\u1EA5t", "autocomplete", "off", "spellcheck", "false", 1, "w-full", "h-11", "pl-9", "pr-9", "rounded-xl", "border", "bg-slate-50", "dark:bg-slate-900", "text-sm", "font-mono", "font-semibold", "text-slate-700", "dark:text-slate-200", "placeholder:font-sans", "placeholder:font-normal", "placeholder:text-slate-400", "outline-none", "transition", "focus:ring-2", "focus:ring-blue-500/15", "focus:border-blue-500", "disabled:opacity-60", 3, "ngModelChange", "input", "ngModel", "disabled", "ngClass"], ["type", "button", "title", "X\u00F3a m\u00E3", 1, "absolute", "right-2.5", "top-1/2", "-translate-y-1/2", "w-6", "h-6", "rounded-full", "text-slate-400", "hover:text-slate-700", "hover:bg-slate-200", "dark:hover:text-slate-200", "dark:hover:bg-slate-700", "transition"], [1, "flex", "gap-2"], ["type", "button", "title", "Qu\u00E9t m\u00E3 QR", 1, "h-11", "px-3.5", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-50", "dark:hover:bg-slate-700", "transition", "active:scale-95", "disabled:opacity-50", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-qrcode", "text-sm"], [1, "sm:hidden", "text-xs", "font-bold"], ["type", "submit", 1, "flex-1", "sm:flex-none", "h-11", "px-5", "rounded-xl", "bg-blue-600", "hover:bg-blue-700", "text-white", "text-xs", "font-bold", "shadow-sm", "shadow-blue-600/20", "transition", "active:scale-95", "disabled:opacity-50", "flex", "items-center", "justify-center", "gap-2", 3, "disabled"], [1, "mt-2", "text-xs", "font-medium", "text-red-600", "dark:text-red-400", "flex", "items-center", "gap-1.5"], [1, "mt-3", "text-[11px]", "text-slate-400", "dark:text-slate-500"], [1, "max-w-2xl", "mx-auto", "mb-6", "rounded-2xl", "border", "border-blue-100", "dark:border-blue-900/50", "bg-blue-50/60", "dark:bg-blue-950/20", "overflow-hidden"], [1, "py-20", "max-w-md", "mx-auto", "fade-in"], [1, "max-w-2xl", "mx-auto", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "p-6", "rounded-2xl", "shadow-sm", "text-center"], [1, "bg-white", "rounded-3xl", "shadow-xl", "overflow-hidden", "border", "border-slate-100", "relative"], [1, "text-base", "font-extrabold", "text-slate-800", "dark:text-slate-100"], [1, "mt-1", "text-xs", "leading-relaxed", "text-slate-500", "dark:text-slate-400"], ["type", "button", "title", "X\u00F3a m\u00E3", 1, "absolute", "right-2.5", "top-1/2", "-translate-y-1/2", "w-6", "h-6", "rounded-full", "text-slate-400", "hover:text-slate-700", "hover:bg-slate-200", "dark:hover:text-slate-200", "dark:hover:bg-slate-700", "transition", 3, "click"], [1, "fa-solid", "fa-xmark", "text-[10px]"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-arrow-right"], [1, "fa-solid", "fa-circle-exclamation", "text-[10px]"], [1, "font-mono"], [1, "px-5", "py-4", "border-b", "border-blue-100", "dark:border-blue-900/40", "flex", "items-start", "gap-3"], [1, "w-8", "h-8", "rounded-lg", "bg-blue-100", "dark:bg-blue-900/50", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-circle-info", "text-xs"], [1, "text-sm", "font-extrabold", "text-slate-800", "dark:text-slate-100"], [1, "mt-0.5", "text-[11px]", "leading-relaxed", "text-slate-500", "dark:text-slate-400"], [1, "divide-y", "divide-blue-100", "dark:divide-blue-900/40"], [1, "px-5", "py-3.5", "flex", "gap-3"], [1, "w-7", "h-7", "rounded-lg", "bg-white", "dark:bg-slate-800", "border", "border-blue-100", "dark:border-blue-900/50", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-print", "text-[11px]"], [1, "min-w-0"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "fa-solid", "fa-chevron-right", "mx-1", "text-[8px]", "text-slate-400"], [1, "mt-1", "text-[11px]", "leading-relaxed", "text-slate-500", "dark:text-slate-400"], [1, "text-slate-600", "dark:text-slate-300"], [1, "fa-solid", "fa-square-poll-vertical", "text-[11px]"], [1, "fa-solid", "fa-clock-rotate-left", "text-[11px]"], [1, "px-5", "py-3", "bg-white/60", "dark:bg-slate-900/30", "text-[10.5px]", "leading-relaxed", "text-slate-500", "dark:text-slate-400", "flex", "items-start", "gap-2"], [1, "fa-solid", "fa-lightbulb", "mt-0.5", "text-amber-500"], [1, "bg-white", "rounded-2xl", "p-6", "shadow-xl", "border", "border-slate-200", "text-left", "relative", "overflow-hidden"], [1, "absolute", "top-0", "left-0", "w-full", "h-1", "bg-indigo-100"], [1, "h-full", "bg-indigo-600", "transition-all", "duration-500", "ease-out"], [1, "flex", "items-center", "gap-3", "mb-6", "mt-2"], [1, "w-8", "h-8", "rounded-full", "bg-indigo-50", "text-indigo-600", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-server", "text-sm"], [1, "text-slate-800", "font-black", "tracking-wider", "uppercase", "text-sm"], [1, "space-y-4", "text-xs", "font-medium"], [1, "flex", "items-center", "gap-3", "transition-opacity", "duration-300"], [1, "fa-solid", "fa-circle-check", "text-indigo-500"], [1, "text-slate-600"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-slate-400"], [1, "text-slate-500"], [1, "text-indigo-700", "font-black", "text-[13px]"], [1, "mx-auto", "w-11", "h-11", "rounded-full", "bg-red-50", "dark:bg-red-950/30", "text-red-500", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-magnifying-glass-minus", "text-base"], [1, "mt-3", "text-base", "font-extrabold", "text-slate-800", "dark:text-slate-100"], [1, "mt-1", "text-sm", "text-slate-500", "dark:text-slate-400"], [1, "mt-5", "flex", "flex-wrap", "items-center", "justify-center", "gap-2"], ["type", "button", 1, "h-9", "px-4", "rounded-lg", "bg-blue-600", "hover:bg-blue-700", "text-white", "text-xs", "font-bold", "transition", "active:scale-95", 3, "click"], ["type", "button", 1, "h-9", "px-4", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "text-slate-600", "dark:text-slate-300", "text-xs", "font-bold", "hover:bg-slate-50", "dark:hover:bg-slate-700", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-qrcode", "mr-1.5"], [1, "fa-solid", "fa-rotate-right", "mr-1.5"], [1, "absolute", "top-0", "left-0", "w-full", "h-2", "bg-gradient-to-r", "from-blue-500", "via-purple-500", "to-pink-500"], [1, "p-8"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-start", "gap-6", "mb-8", "border-b", "border-slate-100", "pb-8"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "inline-block", "px-3", "py-1", "bg-slate-100", "text-slate-600", "rounded-full", "text-xs", "font-bold", "uppercase", "tracking-wider"], [1, "inline-flex", "items-center", "gap-1.5", "px-2.5", "py-1", "bg-indigo-50", "text-indigo-700", "border", "border-indigo-200", "rounded-full", "text-[10px]", "font-black", "uppercase", "tracking-wider", "shadow-sm"], [1, "fa-solid", "fa-database"], [1, "font-mono", "text-xl", "md:text-3xl", "font-black", "text-slate-800", "break-all"], [1, "mt-2", "text-sm", "text-slate-500", "font-medium", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-clock"], [1, "mt-4"], [1, "shrink-0", "bg-white", "p-2", "rounded-xl", "shadow-sm", "border", "border-slate-200"], [1, "w-32", "h-32"], [1, "mb-10", "fade-in"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-8"], [1, "space-y-6"], [1, "bg-white", "dark:bg-slate-900", "border-2", "border-slate-100", "dark:border-slate-800", "rounded-3xl", "shadow-sm", "p-6", "relative", "overflow-hidden", "group"], [1, "absolute", "left-0", "top-0", "bottom-0", "w-2", "transition-colors", "duration-300", 3, "ngClass"], [1, "flex", "flex-col", "sm:flex-row", "justify-between", "items-start", "sm:items-center", "gap-4", "mb-6", "pb-6", "border-b", "border-slate-100", "dark:border-slate-800"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-2xl", "bg-slate-100", "dark:bg-slate-800", "flex", "items-center", "justify-center", "shadow-inner", "overflow-hidden", "shrink-0"], [1, "w-full", "h-full", "object-cover", 3, "src"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-0.5"], [1, "text-base", "font-black", "text-slate-800", "dark:text-slate-100", "leading-none"], [1, "text-[10px]", "font-bold", "text-slate-500", "mt-1", "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-user-shield", "text-emerald-500"], [1, "shrink-0", "pl-14", "sm:pl-0"], [1, "inline-flex", "items-center", "gap-1.5", "px-3", "py-1.5", "rounded-xl", "text-[10px]", "font-black", "uppercase", "tracking-widest", "border", "shadow-sm", 3, "class"], [1, "pl-3"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-1.5"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-100", "mb-2", "leading-tight"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "font-medium", "leading-relaxed", "bg-slate-50", "dark:bg-slate-800/50", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-800", "break-words"], [1, "bg-slate-50", "rounded-2xl", "p-6", "border", "border-slate-200"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "mb-4"], [1, "space-y-4"], [1, "pt-2"], [1, "mt-8", "pt-8", "border-t", "border-slate-100"], [1, "inline-flex", "items-center", "gap-2", "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-750", "text-white", "rounded-xl", "text-xs", "font-black", "shadow-md", "shadow-indigo-500/20", "active:scale-95", "transition"], [1, "inline-flex", "items-start", "gap-2.5", "p-3", "bg-slate-50", "border", "border-slate-200", "rounded-xl", "max-w-sm"], [1, "inline-flex", "items-center", "gap-2", "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-750", "text-white", "rounded-xl", "text-xs", "font-black", "shadow-md", "shadow-indigo-500/20", "active:scale-95", "transition", 3, "click"], [1, "fa-solid", "fa-square-poll-vertical"], [1, "mt-0.5", "w-6", "h-6", "rounded-full", "bg-slate-200", "text-slate-500", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-lock", "text-[10px]"], [1, "text-[10px]", "font-bold", "text-slate-700", "leading-tight", "mb-1"], [1, "text-[9px]", "text-slate-500", "leading-tight"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-3"], [1, "flex", "flex-col", "sm:flex-row", "items-stretch", "gap-2"], [1, "flex-1", "relative", "p-3", "rounded-xl", "border-2", "transition-all", "duration-300", "flex", "items-center", "gap-3", "overflow-hidden", 3, "ngClass"], [1, "absolute", "right-0", "top-0", "bottom-0", "w-16", "bg-gradient-to-l", "from-indigo-100", "to-transparent", "dark:from-indigo-900/30", "opacity-50"], [1, "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center", "shrink-0", "z-10", "text-white", "shadow-sm", 3, "ngClass"], [1, "fa-solid", "fa-clipboard-list", "text-xs"], [1, "z-10"], [1, "text-[10px]", "font-black", "uppercase", "tracking-wider", 3, "ngClass"], [1, "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200"], [1, "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center", "shrink-0", "z-10", "text-white", "shadow-sm", "transition-colors", "duration-500", 3, "ngClass"], [1, "fa-solid", "fa-check-double", "text-xs"], [1, "absolute", "right-0", "top-0", "bottom-0", "w-16", "bg-gradient-to-l", "from-emerald-100", "to-transparent", "dark:from-emerald-900/30", "opacity-50"], [1, "absolute", "right-0", "top-0", "bottom-0", "w-16", "bg-gradient-to-l", "from-amber-100", "to-transparent", "dark:from-amber-900/30", "opacity-50"], [1, "fa-solid", "fa-square-poll-vertical", "text-xs"], [1, "inline-flex", "items-center", "gap-1.5", "px-3", "py-1.5", "rounded-xl", "text-[10px]", "font-black", "uppercase", "tracking-widest", "border", "shadow-sm"], [1, "fa-solid", "fa-check"], [1, "fa-solid", "fa-xmark"], [1, "text-xs", "text-slate-500", "block"], [1, "font-bold", "text-slate-800"], [1, "text-xs", "text-slate-500", "block", "mb-1"], [1, "flex", "flex-wrap", "gap-2"], [1, "bg-white", "px-2", "py-1", "rounded", "border", "border-slate-200", "text-xs", "font-mono", "text-slate-600"], [1, "font-bold", "text-slate-800", "break-words", "font-mono", "text-sm", "leading-snug"], [1, "flex", "flex-wrap", "gap-1.5"], [1, "bg-fuchsia-50", "border", "border-fuchsia-100", "text-fuchsia-800", "px-2", "py-1", "rounded-lg", "text-xs", "font-bold"], [1, "text-xs", "text-slate-500", "block", "mb-2", "font-bold", "uppercase", "tracking-wider", "text-slate-400"], [1, "space-y-2", "max-h-60", "overflow-y-auto", "custom-scrollbar", "pr-1"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "justify-between", "gap-2", "bg-white", "dark:bg-slate-800/40", "p-2.5", "rounded-xl", "border", "border-slate-200/60", "dark:border-slate-700/50", "shadow-xs"], [1, "font-mono", "font-bold", "text-xs", "text-slate-700", "dark:text-slate-300", "bg-slate-100", "dark:bg-slate-700", "px-2", "py-0.5", "rounded", "self-start", "shrink-0"], [1, "flex", "flex-wrap", "gap-1.5", "justify-end"], [1, "bg-indigo-50", "dark:bg-indigo-950/40", "border", "border-indigo-100/60", "dark:border-indigo-900/30", "text-indigo-700", "dark:text-indigo-350", "px-2", "py-0.5", "rounded-lg", "text-[10px]", "font-bold"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "italic"], [1, "overflow-hidden", "rounded-xl", "border", "border-slate-200"], [1, "w-full", "text-sm", "text-left"], [1, "bg-slate-50", "text-slate-500", "font-bold", "uppercase", "text-xs"], [1, "px-4", "py-3"], [1, "px-4", "py-3", "text-right"], [1, "divide-y", "divide-slate-100"], [1, "bg-white"], [1, "px-4", "py-3", "font-medium", "text-slate-700"], [1, "px-4", "py-3", "text-right", "font-mono", "font-bold", "text-slate-600"]], template: function TraceabilityComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "div", 5);
            i0.ɵɵelement(4, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div")(6, "h2", 7);
            i0.ɵɵtext(7, "Truy Xu\u1EA5t Ngu\u1ED3n G\u1ED1c");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 8);
            i0.ɵɵtext(9, "Chi ti\u1EBFt nh\u1EADt k\u00FD ho\u1EA1t \u0111\u1ED9ng v\u00E0 th\u00F4ng tin minh b\u1EA1ch.");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(10, "section", 9)(11, "div", 10);
            i0.ɵɵtemplate(12, TraceabilityComponent_Conditional_12_Template, 5, 0, "div", 11);
            i0.ɵɵelementStart(13, "form", 12);
            i0.ɵɵlistener("ngSubmit", function TraceabilityComponent_Template_form_ngSubmit_13_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.submitLookup()); });
            i0.ɵɵelementStart(14, "label", 13)(15, "span", 14);
            i0.ɵɵtext(16, "M\u00E3 h\u1ED3 s\u01A1 c\u1EA7n truy xu\u1EA5t");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(17, "i", 15);
            i0.ɵɵelementStart(18, "input", 16, 0);
            i0.ɵɵtwoWayListener("ngModelChange", function TraceabilityComponent_Template_input_ngModelChange_18_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.lookupValue, $event) || (ctx.lookupValue = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵlistener("input", function TraceabilityComponent_Template_input_input_18_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.inputError.set("")); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(20, TraceabilityComponent_Conditional_20_Template, 2, 0, "button", 17);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "div", 18)(22, "button", 19);
            i0.ɵɵlistener("click", function TraceabilityComponent_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.startQrScan()); });
            i0.ɵɵelement(23, "i", 20);
            i0.ɵɵelementStart(24, "span", 21);
            i0.ɵɵtext(25, "Qu\u00E9t QR");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(26, "button", 22);
            i0.ɵɵtemplate(27, TraceabilityComponent_Conditional_27_Template, 3, 0)(28, TraceabilityComponent_Conditional_28_Template, 3, 0);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(29, TraceabilityComponent_Conditional_29_Template, 3, 1, "p", 23)(30, TraceabilityComponent_Conditional_30_Template, 4, 0, "p", 24);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(31, TraceabilityComponent_Conditional_31_Template, 59, 0, "aside", 25)(32, TraceabilityComponent_Conditional_32_Template, 22, 14, "div", 26)(33, TraceabilityComponent_Conditional_33_Template, 16, 1, "div", 27)(34, TraceabilityComponent_Conditional_34_Template, 57, 17, "div", 28);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("ngClass", !ctx.id && !ctx.isLoading() && !ctx.isVerifying() && !ctx.logData() && !ctx.errorMsg() ? "max-w-2xl mx-auto pt-8 md:pt-14" : "w-full");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngClass", !ctx.id && !ctx.isLoading() && !ctx.isVerifying() && !ctx.logData() && !ctx.errorMsg() ? "rounded-2xl p-5 md:p-6" : "rounded-xl p-3");
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.id && !ctx.isLoading() && !ctx.isVerifying() && !ctx.logData() && !ctx.errorMsg() ? 12 : -1);
            i0.ɵɵadvance(6);
            i0.ɵɵtwoWayProperty("ngModel", ctx.lookupValue);
            i0.ɵɵproperty("disabled", ctx.isLoading() || ctx.isVerifying())("ngClass", ctx.inputError() ? "border-red-400 dark:border-red-600" : "border-slate-200 dark:border-slate-700");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.lookupValue && !ctx.isLoading() && !ctx.isVerifying() ? 20 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.isLoading() || ctx.isVerifying());
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.isLoading() || ctx.isVerifying());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isLoading() || ctx.isVerifying() ? 27 : 28);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.inputError() ? 29 : !ctx.id && !ctx.logData() && !ctx.errorMsg() ? 30 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.id && !ctx.isLoading() && !ctx.isVerifying() && !ctx.logData() && !ctx.errorMsg() ? 31 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isVerifying() || ctx.isLoading() ? 32 : ctx.errorMsg() ? 33 : ctx.logData() ? 34 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe, FormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.NgModel, i2.NgForm], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TraceabilityComponent, [{
        type: Component,
        args: [{
                selector: 'app-traceability',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    <div class="w-full h-screen overflow-y-auto max-w-7xl mx-auto pb-20 fade-in px-4 md:px-0">
        <!-- HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-350 flex items-center justify-center border border-slate-200 dark:border-slate-600 shadow-sm shrink-0">
                    <i class="fa-solid fa-qrcode text-base"></i>
                </div>
                <div>
                    <h2 class="text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight">Truy Xuất Nguồn Gốc</h2>
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Chi tiết nhật ký hoạt động và thông tin minh bạch.</p>
                </div>
            </div>
        </div>

        <!-- SMART LOOKUP -->
        <section
          class="mb-6 transition-all duration-300"
          [ngClass]="!id && !isLoading() && !isVerifying() && !logData() && !errorMsg()
            ? 'max-w-2xl mx-auto pt-8 md:pt-14'
            : 'w-full'">
          <div
            class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
            [ngClass]="!id && !isLoading() && !isVerifying() && !logData() && !errorMsg()
              ? 'rounded-2xl p-5 md:p-6'
              : 'rounded-xl p-3'">

            @if (!id && !isLoading() && !isVerifying() && !logData() && !errorMsg()) {
              <div class="mb-4">
                <h3 class="text-base font-extrabold text-slate-800 dark:text-slate-100">Tra cứu hồ sơ LIMS</h3>
                <p class="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Nhập mã yêu cầu, mã nhật ký, mã phiếu in hoặc dán liên kết truy xuất.
                </p>
              </div>
            }

            <form (ngSubmit)="submitLookup()" class="flex flex-col sm:flex-row items-stretch gap-2">
              <label class="relative flex-1 min-w-0">
                <span class="sr-only">Mã hồ sơ cần truy xuất</span>
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                <input
                  #lookupInput
                  type="text"
                  name="traceabilityLookup"
                  [(ngModel)]="lookupValue"
                  (input)="inputError.set('')"
                  [disabled]="isLoading() || isVerifying()"
                  placeholder="Ví dụ: REQ-..., LOG-... hoặc URL truy xuất"
                  autocomplete="off"
                  spellcheck="false"
                  class="w-full h-11 pl-9 pr-9 rounded-xl border bg-slate-50 dark:bg-slate-900
                         text-sm font-mono font-semibold text-slate-700 dark:text-slate-200
                         placeholder:font-sans placeholder:font-normal placeholder:text-slate-400
                         outline-none transition focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500
                         disabled:opacity-60"
                  [ngClass]="inputError()
                    ? 'border-red-400 dark:border-red-600'
                    : 'border-slate-200 dark:border-slate-700'">
                @if (lookupValue && !isLoading() && !isVerifying()) {
                  <button
                    type="button"
                    (click)="clearLookupInput()"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                           text-slate-400 hover:text-slate-700 hover:bg-slate-200
                           dark:hover:text-slate-200 dark:hover:bg-slate-700 transition"
                    title="Xóa mã">
                    <i class="fa-solid fa-xmark text-[10px]"></i>
                  </button>
                }
              </label>

              <div class="flex gap-2">
                <button
                  type="button"
                  (click)="startQrScan()"
                  [disabled]="isLoading() || isVerifying()"
                  class="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700
                         bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                         hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-95
                         disabled:opacity-50 flex items-center justify-center gap-2"
                  title="Quét mã QR">
                  <i class="fa-solid fa-qrcode text-sm"></i>
                  <span class="sm:hidden text-xs font-bold">Quét QR</span>
                </button>
                <button
                  type="submit"
                  [disabled]="isLoading() || isVerifying()"
                  class="flex-1 sm:flex-none h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700
                         text-white text-xs font-bold shadow-sm shadow-blue-600/20
                         transition active:scale-95 disabled:opacity-50
                         flex items-center justify-center gap-2">
                  @if (isLoading() || isVerifying()) {
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>Đang truy xuất</span>
                  } @else {
                    <i class="fa-solid fa-arrow-right"></i>
                    <span>Truy xuất</span>
                  }
                </button>
              </div>
            </form>

            @if (inputError()) {
              <p class="mt-2 text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                {{ inputError() }}
              </p>
            } @else if (!id && !logData() && !errorMsg()) {
              <p class="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
                Có thể dán trực tiếp liên kết chứa <span class="font-mono">#/traceability/...</span>
              </p>
            }
          </div>
        </section>

        @if (!id && !isLoading() && !isVerifying() && !logData() && !errorMsg()) {
          <aside class="max-w-2xl mx-auto mb-6 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 overflow-hidden">
            <div class="px-5 py-4 border-b border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-circle-info text-xs"></i>
              </div>
              <div>
                <h3 class="text-sm font-extrabold text-slate-800 dark:text-slate-100">Tìm mã truy xuất ở đâu?</h3>
                <p class="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Mã được hiển thị tại các điểm sau trong quy trình làm việc.
                </p>
              </div>
            </div>

            <ol class="divide-y divide-blue-100 dark:divide-blue-900/40">
              <li class="px-5 py-3.5 flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-print text-[11px]"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Hàng Đợi In <i class="fa-solid fa-chevron-right mx-1 text-[8px] text-slate-400"></i> Xem &amp; In
                  </div>
                  <p class="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Trên phiếu in, xem <b class="text-slate-600 dark:text-slate-300">góc phải phần đầu trang</b>,
                    cạnh mã QR, tại nhãn <b class="text-slate-600 dark:text-slate-300">MÃ TRUY XUẤT (ID)</b>.
                  </p>
                </div>
              </li>

              <li class="px-5 py-3.5 flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-square-poll-vertical text-[11px]"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Kết Quả Phân Tích <i class="fa-solid fa-chevron-right mx-1 text-[8px] text-slate-400"></i> Chi Tiết Mẻ
                  </div>
                  <p class="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Sao chép dòng <b class="text-slate-600 dark:text-slate-300">Mã mẻ</b> dưới tiêu đề,
                    hoặc dùng nút <b class="text-slate-600 dark:text-slate-300">Mã QR</b> ở góc phải.
                  </p>
                </div>
              </li>

              <li class="px-5 py-3.5 flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-clock-rotate-left text-[11px]"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Trang Chủ <i class="fa-solid fa-chevron-right mx-1 text-[8px] text-slate-400"></i> Hoạt Động Gần Đây
                  </div>
                  <p class="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Với hoạt động có liên kết hồ sơ, nhấn <b class="text-slate-600 dark:text-slate-300">Truy Xuất</b>
                    để mở trực tiếp, không cần nhập lại mã.
                  </p>
                </div>
              </li>
            </ol>

            <div class="px-5 py-3 bg-white/60 dark:bg-slate-900/30 text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <i class="fa-solid fa-lightbulb mt-0.5 text-amber-500"></i>
              <span>Bạn có thể nhập nguyên mã, dán toàn bộ liên kết truy xuất hoặc quét QR trên phiếu.</span>
            </div>
          </aside>
        }

        @if(isVerifying() || isLoading()) {
            <div class="py-20 max-w-md mx-auto fade-in">
                <div class="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-left relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-indigo-100">
                        <div class="h-full bg-indigo-600 transition-all duration-500 ease-out" [style.width]="(verifyStep() / 3 * 100) + '%'"></div>
                    </div>
                    <div class="flex items-center gap-3 mb-6 mt-2">
                        <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <i class="fa-solid fa-server text-sm"></i>
                        </div>
                        <span class="text-slate-800 font-black tracking-wider uppercase text-sm">Truy xuất hồ sơ LIMS</span>
                    </div>
                    
                    <div class="space-y-4 text-xs font-medium">
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 0">
                            @if(verifyStep() >= 0) {
                                <i class="fa-solid fa-circle-check text-indigo-500"></i>
                                <span class="text-slate-600">Đã kết nối hệ thống máy chủ LIMS...</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-400"></i>
                                <span class="text-slate-500">Đang kết nối hệ thống máy chủ LIMS...</span>
                            }
                        </div>
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 1">
                            @if(verifyStep() >= 1) {
                                <i class="fa-solid fa-circle-check text-indigo-500"></i>
                                <span class="text-slate-600">Đã đồng bộ hồ sơ nhật ký mẻ phân tích...</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-400"></i>
                                <span class="text-slate-500">Đang đồng bộ hồ sơ nhật ký mẻ phân tích...</span>
                            }
                        </div>
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 2">
                            @if(verifyStep() >= 2) {
                                <i class="fa-solid fa-circle-check text-indigo-500"></i>
                                <span class="text-slate-600">Kiểm tra tính toàn vẹn dữ liệu (Data Integrity)...</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-400"></i>
                                <span class="text-slate-500">Kiểm tra tính toàn vẹn dữ liệu (Data Integrity)...</span>
                            }
                        </div>
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 3">
                            @if(verifyStep() >= 3) {
                                <i class="fa-solid fa-circle-check text-indigo-500"></i>
                                <span class="text-indigo-700 font-black text-[13px]">Truy xuất hoàn tất!</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-400"></i>
                                <span class="text-slate-500">Đang trích xuất báo cáo...</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        } @else if(errorMsg()) {
            <div class="max-w-2xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm text-center">
                <div class="mx-auto w-11 h-11 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center">
                    <i class="fa-solid fa-magnifying-glass-minus text-base"></i>
                </div>
                <h3 class="mt-3 text-base font-extrabold text-slate-800 dark:text-slate-100">Không tìm thấy hồ sơ</h3>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{errorMsg()}}</p>
                <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    (click)="focusLookupInput()"
                    class="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition active:scale-95">
                    Sửa mã
                  </button>
                  <button
                    type="button"
                    (click)="startQrScan()"
                    class="h-9 px-4 rounded-lg border border-slate-200 dark:border-slate-700
                           text-slate-600 dark:text-slate-300 text-xs font-bold
                           hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-95">
                    <i class="fa-solid fa-qrcode mr-1.5"></i>Quét QR
                  </button>
                  <button
                    type="button"
                    (click)="submitLookup()"
                    class="h-9 px-4 rounded-lg border border-slate-200 dark:border-slate-700
                           text-slate-600 dark:text-slate-300 text-xs font-bold
                           hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-95">
                    <i class="fa-solid fa-rotate-right mr-1.5"></i>Tìm lại
                  </button>
                </div>
            </div>
        } @else if(logData()) {
            <!-- DATA CARD -->
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
                <!-- Status Stripe -->
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div class="p-8">
                    <!-- Top Row: ID & QR -->
                    <div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-slate-100 pb-8">
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Transaction ID
                                </span>
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                                    <i class="fa-solid fa-database"></i> Hệ thống LIMS
                                </span>
                            </div>
                            <div class="font-mono text-xl md:text-3xl font-black text-slate-800 break-all">
                                {{logData()?.id}}
                            </div>
                            <div class="mt-2 text-sm text-slate-500 font-medium flex items-center gap-2">
                                <i class="fa-solid fa-clock"></i> {{formatDate(logData()?.timestamp)}}
                            </div>
                            @if (getAssociatedRequestId(); as reqId) {
                                <div class="mt-4">
                                    @if (auth.currentUser() && auth.canViewSop()) {
                                        <button (click)="viewBatchResults(reqId)" 
                                                class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-500/20 active:scale-95 transition">
                                            <i class="fa-solid fa-square-poll-vertical"></i>
                                            <span>Xem Kết Quả Mẻ Phân Tích</span>
                                        </button>
                                    } @else {
                                        <div class="inline-flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-sm">
                                            <div class="mt-0.5 w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                                                <i class="fa-solid fa-lock text-[10px]"></i>
                                            </div>
                                            <div>
                                                <p class="text-[10px] font-bold text-slate-700 leading-tight mb-1">Kết quả thuộc chế độ bảo mật.</p>
                                                <p class="text-[9px] text-slate-500 leading-tight">
                                                    @if (auth.currentUser()) {
                                                        Tài khoản của bạn không có quyền xem dữ liệu này.
                                                    } @else {
                                                        Yêu cầu đăng nhập hệ thống LIMS để xem chi tiết.
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        <div class="shrink-0 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                            <canvas #qrCanvas class="w-32 h-32"></canvas>
                        </div>
                    </div>

                    <!-- Premium Workflow Stepper -->
                    @if(logData()?.status; as status) {
                        <div class="mb-10 fade-in">
                            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tiến Độ Quy Trình LIMS</h4>
                            <div class="flex flex-col sm:flex-row items-stretch gap-2">
                                <!-- Step 1: Request -->
                                <div class="flex-1 relative p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 overflow-hidden"
                                     [ngClass]="status !== 'unknown' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' : 'border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800'">
                                    <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-indigo-100 to-transparent dark:from-indigo-900/30 opacity-50"></div>
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-white shadow-sm"
                                         [ngClass]="status !== 'unknown' ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'">
                                        <i class="fa-solid fa-clipboard-list text-xs"></i>
                                    </div>
                                    <div class="z-10">
                                        <div class="text-[10px] font-black uppercase tracking-wider" [ngClass]="status !== 'unknown' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-400'">Bước 1</div>
                                        <div class="text-xs font-bold text-slate-800 dark:text-slate-200">Tiếp nhận</div>
                                    </div>
                                </div>

                                <!-- Step 2: Approve -->
                                <div class="flex-1 relative p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 overflow-hidden"
                                     [ngClass]="(status === 'approved' || status === 'draft' || status === 'completed') ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' : 'border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800'">
                                    @if(status === 'approved' || status === 'draft' || status === 'completed') {
                                        <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-indigo-100 to-transparent dark:from-indigo-900/30 opacity-50"></div>
                                    }
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-white shadow-sm transition-colors duration-500"
                                         [ngClass]="(status === 'approved' || status === 'draft' || status === 'completed') ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'">
                                        <i class="fa-solid fa-check-double text-xs"></i>
                                    </div>
                                    <div class="z-10">
                                        <div class="text-[10px] font-black uppercase tracking-wider" [ngClass]="(status === 'approved' || status === 'draft' || status === 'completed') ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-400'">Bước 2</div>
                                        <div class="text-xs font-bold text-slate-800 dark:text-slate-200">Phê duyệt</div>
                                    </div>
                                </div>

                                <!-- Step 3: Result & Report -->
                                <div class="flex-1 relative p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 overflow-hidden"
                                     [ngClass]="status === 'completed' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : (status === 'draft' ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800')">
                                    @if(status === 'completed') {
                                        <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-emerald-100 to-transparent dark:from-emerald-900/30 opacity-50"></div>
                                    } @else if(status === 'draft') {
                                        <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-amber-100 to-transparent dark:from-amber-900/30 opacity-50"></div>
                                    }
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-white shadow-sm transition-colors duration-500"
                                         [ngClass]="status === 'completed' ? 'bg-emerald-500' : (status === 'draft' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700')">
                                        <i class="fa-solid fa-square-poll-vertical text-xs"></i>
                                    </div>
                                    <div class="z-10">
                                        <div class="text-[10px] font-black uppercase tracking-wider" [ngClass]="status === 'completed' ? 'text-emerald-700 dark:text-emerald-400' : (status === 'draft' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400')">Bước 3</div>
                                        <div class="text-xs font-bold text-slate-800 dark:text-slate-200">Cập nhật & Báo cáo</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <!-- Main Info Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Left: Actor & Action Unified Card -->
                        <div class="space-y-6">
                            <div class="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 relative overflow-hidden group">
                                <!-- Status left border accent -->
                                <div class="absolute left-0 top-0 bottom-0 w-2 transition-colors duration-300"
                                     [ngClass]="logData()?.status === 'completed' || logData()?.status === 'approved' ? 'bg-emerald-500' : 
                                                (logData()?.status === 'pending' ? 'bg-amber-500' : 
                                                (logData()?.status === 'draft' ? 'bg-indigo-500' : 
                                                (logData()?.status === 'rejected' ? 'bg-rose-500' : 'bg-slate-400')))">
                                </div>
                                
                                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                   <div class="flex items-center gap-4">
                                       <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
                                           <img [src]="getAvatarUrl(logData()?.user, state.getUserAvatarOptions(logData()?.user).style, state.getUserAvatarOptions(logData()?.user).photoURL)" class="w-full h-full object-cover">
                                       </div>
                                       <div>
                                           <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Thực hiện bởi</div>
                                           <div class="text-base font-black text-slate-800 dark:text-slate-100 leading-none">{{logData()?.user}}</div>
                                           <div class="text-[10px] font-bold text-slate-500 mt-1 flex items-center gap-1">
                                               <i class="fa-solid fa-user-shield text-emerald-500"></i> Authorized Staff
                                           </div>
                                       </div>
                                   </div>
                                   <div class="shrink-0 pl-14 sm:pl-0">
                                       @if(logData()?.status; as status) {
                                           <span [class]="status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/30' :
                                                          status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/30' :
                                                          status === 'rejected' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/30' :
                                                          status === 'completed' ? 'bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200/60 dark:border-fuchsia-900/30' :
                                                          status === 'draft' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/30' : 'bg-slate-50 text-slate-700 border-slate-200/60'"
                                                 class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm">
                                               @if(status === 'completed' || status === 'approved') {
                                                   <i class="fa-solid fa-check"></i>
                                               } @else if(status === 'pending' || status === 'draft') {
                                                   <i class="fa-solid fa-clock"></i>
                                               } @else if(status === 'rejected') {
                                                   <i class="fa-solid fa-xmark"></i>
                                               }
                                               {{ status === 'pending' ? 'Chờ duyệt' :
                                                  status === 'approved' ? 'Đã duyệt' :
                                                  status === 'rejected' ? 'Bị từ chối' :
                                                  status === 'completed' ? 'Đã hoàn thành' :
                                                  status === 'draft' ? 'Lưu nháp' : status }}
                                           </span>
                                       }
                                   </div>
                                </div>
                                
                                <div class="pl-3">
                                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sự kiện hệ thống ghi nhận</div>
                                    <div class="text-lg font-black text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                                        {{getActionLabel(logData()?.action)}}
                                    </div>
                                    <div class="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 break-words">
                                        {{logData()?.details}}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Context Details -->
                        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <h4 class="text-xs font-bold text-slate-400 uppercase mb-4">Chi Tiết Ngữ Cảnh</h4>
                            
                            <div class="space-y-4">
                                @if(logData()?.sopBasicInfo?.name || logData()?.printData?.sop?.name) {
                                    <div>
                                        <span class="text-xs text-slate-500 block">Quy trình (SOP)</span>
                                        <span class="font-bold text-slate-800">
                                            {{ logData()?.sopBasicInfo?.name || logData()?.printData?.sop?.name }}
                                        </span>
                                    </div>
                                }

                                @if(logData()?.printData?.inputs) {
                                    <div>
                                        <span class="text-xs text-slate-500 block mb-1">Thông số đầu vào</span>
                                        <div class="flex flex-wrap gap-2">
                                            @for(key of objectKeys(logData()?.printData?.inputs); track key) {
                                                @if(key !== 'sampleList' && key !== 'targetIds' && key !== 'sampleTargetMap' && key !== 'sampleDescriptionMap') {
                                                    <span class="bg-white px-2 py-1 rounded border border-slate-200 text-xs font-mono text-slate-600">
                                                        {{key}}: <b>{{logData()?.printData?.inputs[key]}}</b>
                                                    </span>
                                                }
                                            }
                                        </div>
                                    </div>
                                }

                                <!-- Sample List -->
                                @if(logData()?.printData?.inputs?.sampleList?.length > 0) {
                                   <div>
                                       <span class="text-xs text-slate-500 block">Danh sách mẫu</span>
                                       <span class="font-bold text-slate-800 break-words font-mono text-sm leading-snug">{{ formatSampleList(logData()?.printData?.inputs?.sampleList) }}</span>
                                   </div>
                                }

                                @if(getSampleDescriptionRows().length > 0) {
                                  <div>
                                    <span class="text-xs text-slate-500 block mb-1">Mô tả từng mẫu</span>
                                    <div class="flex flex-wrap gap-1.5">
                                      @for(row of getSampleDescriptionRows(); track row.sampleId) {
                                        <span class="bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-800 px-2 py-1 rounded-lg text-xs font-bold"><span class="font-mono">{{row.sampleId}}</span> · {{row.description}}</span>
                                      }
                                    </div>
                                  </div>
                                }

                                <!-- Target Map -->
                                @if(computedSampleTargetGroups(); as targetGroups) {
                                    <div class="pt-2">
                                        <span class="text-xs text-slate-500 block mb-2 font-bold uppercase tracking-wider text-slate-400">Chỉ tiêu phân tích theo từng mẫu</span>
                                        <div class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                                            @for(group of targetGroups; track group.formattedSamples) {
                                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-xs">
                                                    <span class="font-mono font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded self-start shrink-0">{{ group.formattedSamples }}</span>
                                                    <div class="flex flex-wrap gap-1.5 justify-end">
                                                        @if(group.targetScope.compact) {
                                                            <span class="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-350 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                                                {{ group.targetScope.headline }}
                                                            </span>
                                                        } @else {
                                                            @for(tName of group.targetNames; track tName) {
                                                                <span class="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-350 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                                                    {{ tName }}
                                                                </span>
                                                            } @empty {
                                                                <span class="text-xs text-slate-400 dark:text-slate-500 italic">Không có chỉ tiêu</span>
                                                            }
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }

                                @if(logData()?.printData?.analysisDate) {
                                    <div>
                                        <span class="text-xs text-slate-500 block">Ngày phân tích</span>
                                        <span class="font-bold text-slate-800">{{ logData()?.printData?.analysisDate | date:'dd/MM/yyyy' }}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <!-- Items List (If Batch Approval) -->
                    @if(logData()?.printData?.items) {
                        <div class="mt-8 pt-8 border-t border-slate-100">
                            <h4 class="text-xs font-bold text-slate-400 uppercase mb-4">Danh Sách Hóa Chất Sử Dụng</h4>
                            <div class="overflow-hidden rounded-xl border border-slate-200">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                        <tr>
                                            <th class="px-4 py-3">Tên hóa chất</th>
                                            <th class="px-4 py-3 text-right">Lượng dùng</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        @for(item of logData()?.printData?.items; track item.name) {
                                            <tr class="bg-white">
                                                <td class="px-4 py-3 font-medium text-slate-700">{{item.displayName || item.name}}</td>
                                                <td class="px-4 py-3 text-right font-mono font-bold text-slate-600">
                                                    {{formatNum(item.stockNeed)}} {{item.stockUnit}}
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </div>
            </div>
        }
    </div>
  `
            }]
    }], null, { id: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TraceabilityComponent, { className: "TraceabilityComponent", filePath: "src/app/features/traceability/traceability.component.ts", lineNumber: 589 }); })();
//# sourceMappingURL=traceability.component.js.map