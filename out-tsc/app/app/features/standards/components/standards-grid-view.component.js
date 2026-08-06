import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { LockPermissionDirective } from '../../../shared/directives/lock-permission.directive';
import { StateService } from '../../../core/services/state.service';
import { formatNum, getStorageInfo, getExpiryClass, getExpiryTimeClass, getExpiryTimeLeft, getStandardStatus, canAssign, getExpiryBarClass } from '../../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = () => [1, 2, 3, 4];
const _c1 = (a0, a1, a2) => ({ "border-slate-200 dark:border-slate-700": a0, "border-indigo-400 dark:border-indigo-500 shadow-md bg-indigo-50 dark:bg-indigo-900/30": a1, "opacity-50 grayscale hover:opacity-100 hover:grayscale-0": a2 });
const _c2 = () => [];
const _c3 = (a0, a1, a2) => [a0, a1, a2];
const _forTrack0 = ($index, $item) => $item.id;
function StandardsGridViewComponent_Conditional_1_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-skeleton", 2);
} }
function StandardsGridViewComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 1);
    i0.ɵɵrepeaterCreate(1, StandardsGridViewComponent_Conditional_1_For_2_Template, 1, 0, "app-skeleton", 2, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function StandardsGridViewComponent_Conditional_2_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3);
    i0.ɵɵelement(1, "i", 5);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Kh\u00F4ng t\u00ECm th\u1EA5y d\u1EEF li\u1EC7u chu\u1EA9n ph\u00F9 h\u1EE3p.");
    i0.ɵɵelementEnd()();
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", std_r2.internal_id, " ");
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 14);
    i0.ɵɵelement(1, "i", 51);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", std_r2.location, " ");
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 15);
    i0.ɵɵelement(1, "i", 52);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const method_r3 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(method_r3);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_For_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 16);
    i0.ɵɵelement(1, "i", 53);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const device_r4 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(device_r4);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 20)(1, "span", 54);
    i0.ɵɵtext(2, "Synonyms:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(std_r2.chemical_name);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_For_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 38);
    i0.ɵɵelement(1, "i", 55);
    i0.ɵɵelementStart(2, "span", 56);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const info_r6 = ctx.$implicit;
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(3, _c3, info_r6.bg, info_r6.border, info_r6.color));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", info_r6.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(info_r6.text);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 39);
    i0.ɵɵelement(1, "i", 57);
    i0.ɵɵelementStart(2, "span", 58);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(std_r2.current_holder);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_56_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 40);
    i0.ɵɵelement(1, "i", 59);
    i0.ɵɵelementStart(2, "span", 60);
    i0.ɵɵtext(3, "Nh\u1EADn: ");
    i0.ɵɵelementStart(4, "b", 61);
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(6, 1, std_r2.received_date, "dd/MM/yyyy"));
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_64_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 62);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_64_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r7); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r4 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r4.openCoaPreview.emit({ url: std_r2.certificate_ref, event: $event })); });
    i0.ɵɵelement(1, "i", 63);
    i0.ɵɵelementEnd();
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_65_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 65);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_65_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 66);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_65_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 64);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_65_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r8); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r4 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r4.triggerQuickDriveUpload.emit({ std: std_r2, event: $event })); });
    i0.ɵɵtemplate(1, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_65_Conditional_1_Template, 1, 0, "i", 65)(2, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_65_Conditional_2_Template, 1, 0, "i", 66);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r4 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r4.quickUploadStdId() === std_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r4.quickUploadStdId() === std_r2.id ? 1 : 2);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_68_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 67);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_68_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r9); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r4 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r4.openPrintModal.emit(std_r2)); });
    i0.ɵɵelement(1, "i", 68);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵproperty("appLockPermission", "standard_edit");
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 69);
    i0.ɵɵelement(1, "i", 72);
    i0.ɵɵtext(2, " Ch\u1EDD Duy\u1EC7t ");
    i0.ɵɵelementEnd();
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 73);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Conditional_1_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r10); const std_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r4 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r4.openAssignModal.emit({ std: std_r2, isAssign: true })); });
    i0.ɵɵelement(1, "i", 74);
    i0.ɵɵtext(2, " G\u00E1n ");
    i0.ɵɵelementEnd();
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 75);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Conditional_2_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r11); const std_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r4 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r4.openAssignModal.emit({ std: std_r2, isAssign: false })); });
    i0.ɵɵelement(1, "i", 74);
    i0.ɵɵtext(2, " M\u01B0\u1EE3n ");
    i0.ɵɵelementEnd();
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Conditional_0_Template, 3, 0, "button", 69)(1, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Conditional_1_Template, 3, 0, "button", 70)(2, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Conditional_2_Template, 3, 0, "button", 71);
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r4 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional(std_r2.has_pending_request ? 0 : ctx_r4.canAssignStandards() ? 1 : ctx_r4.canRequestStandards() ? 2 : -1);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_70_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 76);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_70_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r12); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r4 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r4.goToReturn.emit(std_r2)); });
    i0.ɵɵelement(1, "i", 77);
    i0.ɵɵtext(2, " Tr\u1EA3 Chu\u1EA9n ");
    i0.ɵɵelementEnd();
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_71_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 78);
    i0.ɵɵelement(1, "i", 80);
    i0.ɵɵtext(2, " \u0110\u00E3 Y/C ");
    i0.ɵɵelementEnd();
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_71_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 81);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_71_Conditional_1_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r13); const std_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r4 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r4.openPurchaseRequestModal.emit(std_r2)); });
    i0.ɵɵelement(1, "i", 82);
    i0.ɵɵtext(2, " \u0110\u1EC1 Ngh\u1ECB Mua ");
    i0.ɵɵelementEnd();
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_71_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_71_Conditional_0_Template, 3, 0, "button", 78)(1, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_71_Conditional_1_Template, 3, 0, "button", 79);
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r4 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional(std_r2.restock_requested ? 0 : ctx_r4.canRequestStandards() || ctx_r4.canAssignStandards() ? 1 : -1);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 7);
    i0.ɵɵelement(2, "div", 8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 9)(4, "div", 10)(5, "div", 11)(6, "span", 12);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_8_Template, 2, 1, "span", 13)(9, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_9_Template, 3, 1, "span", 14);
    i0.ɵɵrepeaterCreate(10, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_For_11_Template, 3, 1, "span", 15, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵrepeaterCreate(12, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_For_13_Template, 3, 1, "span", 16, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "input", 17);
    i0.ɵɵlistener("change", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Template_input_change_14_listener() { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r4 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r4.toggleSelection.emit(std_r2.id)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 18);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Template_div_click_15_listener() { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r4 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r4.navigateToDetail.emit(std_r2)); });
    i0.ɵɵelementStart(16, "h3", 19);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(18, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_18_Template, 4, 1, "p", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 21)(20, "div", 22);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Template_div_click_20_listener($event) { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r4 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r4.copyText.emit({ text: std_r2.lot_number || "", event: $event })); });
    i0.ɵɵelementStart(21, "div", 23);
    i0.ɵɵtext(22, "Lot ");
    i0.ɵɵelement(23, "i", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "div", 25);
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "div", 26);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Template_div_click_26_listener($event) { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r4 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r4.copyText.emit({ text: std_r2.product_code || "", event: $event })); });
    i0.ɵɵelementStart(27, "div", 23);
    i0.ɵɵtext(28, "Code ");
    i0.ɵɵelement(29, "i", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "div", 25);
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "div", 27)(33, "div", 28);
    i0.ɵɵtext(34, "Mfg");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "div", 29);
    i0.ɵɵtext(36);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "div", 27)(38, "div", 28);
    i0.ɵɵtext(39, "CAS");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "div", 25);
    i0.ɵɵtext(41);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(42, "div", 30)(43, "div", 31)(44, "span", 32);
    i0.ɵɵtext(45, "T\u1ED3n kho");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "span", 33);
    i0.ɵɵtext(47);
    i0.ɵɵelementStart(48, "small", 34);
    i0.ɵɵtext(49);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(50, "div", 35);
    i0.ɵɵelement(51, "div", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "div", 37);
    i0.ɵɵrepeaterCreate(53, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_For_54_Template, 4, 7, "div", 38, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵtemplate(55, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_55_Template, 4, 1, "div", 39);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(56, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_56_Template, 7, 4, "div", 40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "div", 41)(58, "div", 42)(59, "span", 32);
    i0.ɵɵtext(60, "H\u1EBFt h\u1EA1n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "span", 43);
    i0.ɵɵtext(62);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(63, "div", 44);
    i0.ɵɵtemplate(64, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_64_Template, 2, 0, "button", 45)(65, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_65_Template, 3, 2, "button", 46);
    i0.ɵɵelementStart(66, "button", 47);
    i0.ɵɵlistener("click", function StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Template_button_click_66_listener($event) { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r4 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r4.viewHistory.emit(std_r2)); });
    i0.ɵɵelement(67, "i", 48);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(68, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_68_Template, 2, 1, "button", 49)(69, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_69_Template, 3, 1)(70, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_70_Template, 3, 0, "button", 50)(71, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Conditional_71_Template, 2, 1);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    let tmp_36_0;
    let tmp_38_0;
    const std_r2 = ctx.$implicit;
    const ctx_r4 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(27, _c1, !ctx_r4.selectedIds().has(std_r2.id), ctx_r4.selectedIds().has(std_r2.id), std_r2.status === "DEPLETED" || std_r2.current_amount <= 0));
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r4.getExpiryBarClass(std_r2.expiry_date));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngClass", ctx_r4.getStandardStatus(std_r2).class);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r4.getStandardStatus(std_r2).label, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r2.internal_id ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r2.location ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater((std_r2.derivedMethodLabels || i0.ɵɵpureFunction0(31, _c2)).slice(0, 4));
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(std_r2.derivedDeviceCodes || i0.ɵɵpureFunction0(32, _c2));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r4.selectedIds().has(std_r2.id));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(std_r2.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r2.chemical_name ? 18 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(std_r2.lot_number || "-");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(std_r2.product_code || "-");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("title", std_r2.manufacturer);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r2.manufacturer || "-");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(std_r2.cas_number || "-");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("", ctx_r4.formatNum(std_r2.current_amount), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(std_r2.unit);
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", std_r2.current_amount / (std_r2.initial_amount || 1) * 100, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r4.getStorageInfo(std_r2.storage_condition));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r2.status === "IN_USE" && std_r2.current_holder ? 55 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r2.received_date ? 56 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r4.getExpiryTimeClass(std_r2.expiry_date));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r4.getExpiryTimeLeft(std_r2.expiry_date) || "N/A");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r2.certificate_ref ? 64 : ((tmp_36_0 = ctx_r4.currentUser()) == null ? null : tmp_36_0.role) === "manager" ? 65 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r4.canEditStandards() || ctx_r4.state.showLockedFeatures() ? 68 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r4.canAssign(std_r2) ? 69 : std_r2.status === "IN_USE" && (ctx_r4.canAssignStandards() || std_r2.current_holder_uid === ((tmp_38_0 = ctx_r4.currentUser()) == null ? null : tmp_38_0.uid)) ? 70 : std_r2.status === "DEPLETED" || std_r2.current_amount <= 0 ? 71 : -1);
} }
function StandardsGridViewComponent_Conditional_2_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4);
    i0.ɵɵrepeaterCreate(1, StandardsGridViewComponent_Conditional_2_Conditional_1_For_2_Template, 72, 33, "div", 6, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r4.items());
} }
function StandardsGridViewComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsGridViewComponent_Conditional_2_Conditional_0_Template, 4, 0, "div", 3)(1, StandardsGridViewComponent_Conditional_2_Conditional_1_Template, 3, 0, "div", 4);
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r4.items().length === 0 ? 0 : 1);
} }
export class StandardsGridViewComponent {
    constructor() {
        this.state = inject(StateService);
        this.items = input.required();
        this.isLoading = input(false);
        this.allStandardsLength = input(0);
        this.selectedIds = input(new Set());
        this.quickUploadStdId = input('');
        this.canEditStandards = input(true);
        this.canAssignStandards = input(false);
        this.canRequestStandards = input(false);
        this.currentUser = input(null);
        this.toggleSelection = output();
        this.navigateToDetail = output();
        this.copyText = output();
        this.openCoaPreview = output();
        this.triggerQuickDriveUpload = output();
        this.openAssignModal = output();
        this.goToReturn = output();
        this.openPurchaseRequestModal = output();
        this.openPrintModal = output();
        this.viewHistory = output();
        // Helpers exposed to template
        this.Math = Math;
        this.formatNum = formatNum;
        this.getStorageInfo = getStorageInfo;
        this.getExpiryClass = getExpiryClass;
        this.getExpiryTimeClass = getExpiryTimeClass;
        this.getExpiryTimeLeft = getExpiryTimeLeft;
        this.getStandardStatus = getStandardStatus;
        this.getExpiryBarClass = getExpiryBarClass;
        this.canAssign = canAssign;
    }
    static { this.ɵfac = function StandardsGridViewComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsGridViewComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsGridViewComponent, selectors: [["app-standards-grid-view"]], inputs: { items: [1, "items"], isLoading: [1, "isLoading"], allStandardsLength: [1, "allStandardsLength"], selectedIds: [1, "selectedIds"], quickUploadStdId: [1, "quickUploadStdId"], canEditStandards: [1, "canEditStandards"], canAssignStandards: [1, "canAssignStandards"], canRequestStandards: [1, "canRequestStandards"], currentUser: [1, "currentUser"] }, outputs: { toggleSelection: "toggleSelection", navigateToDetail: "navigateToDetail", copyText: "copyText", openCoaPreview: "openCoaPreview", triggerQuickDriveUpload: "triggerQuickDriveUpload", openAssignModal: "openAssignModal", goToReturn: "goToReturn", openPurchaseRequestModal: "openPurchaseRequestModal", openPrintModal: "openPrintModal", viewHistory: "viewHistory" }, decls: 3, vars: 1, consts: [[1, "p-4", "bg-slate-50/30", "dark:bg-slate-900/50"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-4"], ["height", "280px"], [1, "py-16", "text-center", "text-slate-400", "dark:text-slate-500", "italic", "w-full", "border-t", "border-transparent"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "2xl:grid-cols-5", "gap-4"], [1, "fa-solid", "fa-box-open", "text-4xl", "mb-2", "text-slate-300", "dark:text-slate-600"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "border", "transition-all", "duration-200", "flex", "flex-col", "relative", "group", "h-full", "hover:-translate-y-1", "hover:shadow-lg", "dark:hover:shadow-none", "overflow-hidden", 3, "ngClass"], [1, "w-full", "h-1.5", "flex", "bg-slate-100", "dark:bg-slate-700", "shrink-0"], [1, "h-full", "w-full"], [1, "p-4", "flex", "flex-col", "h-full"], [1, "flex", "justify-between", "items-start", "mb-3"], [1, "flex", "flex-wrap", "gap-1.5", "items-start", "pr-2"], [1, "px-2.5", "py-1", "rounded-md", "text-[10px]", "font-bold", "uppercase", "border", "tracking-wide", "whitespace-nowrap", "shadow-sm", "dark:shadow-none", 3, "ngClass"], [1, "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-400", "px-2.5", "py-1", "rounded-md", "text-sm", "font-black", "uppercase", "tracking-wider", "border", "border-indigo-100", "dark:border-indigo-800/50", "shadow-sm", "dark:shadow-none", "whitespace-nowrap"], [1, "bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-400", "px-2.5", "py-1", "rounded-md", "text-xs", "font-bold", "border", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "gap-1.5", "shadow-sm", "dark:shadow-none", "whitespace-nowrap"], [1, "bg-indigo-50/70", "dark:bg-indigo-900/20", "text-indigo-700", "dark:text-indigo-300", "px-2", "py-1", "rounded-md", "text-[10px]", "font-black", "border", "border-indigo-100", "dark:border-indigo-800/40", "whitespace-nowrap"], [1, "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "text-fuchsia-700", "dark:text-fuchsia-300", "px-2", "py-1", "rounded-md", "text-[10px]", "font-black", "border", "border-fuchsia-100", "dark:border-fuchsia-800/40", "whitespace-nowrap"], ["type", "checkbox", 1, "w-5", "h-5", "accent-indigo-600", "dark:accent-indigo-500", "cursor-pointer", "shrink-0", "mt-0.5", 3, "change", "checked"], [1, "mb-4", "cursor-pointer", 3, "click"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-base", "leading-snug", "mb-1", "hover:text-indigo-600", "dark:hover:text-indigo-400", "transition", "break-words"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "italic", "font-medium", "break-words"], [1, "grid", "grid-cols-2", "gap-px", "bg-slate-100", "dark:bg-slate-700", "rounded-lg", "overflow-hidden", "border", "border-slate-100", "dark:border-slate-700", "mb-4", "text-[11px]"], ["title", "Copy Lot", 1, "bg-white", "dark:bg-slate-800", "p-2", "hover:bg-blue-50", "dark:hover:bg-blue-900/20", "transition", "cursor-pointer", "group/cell", 3, "click"], [1, "text-slate-400", "dark:text-slate-500", "font-bold", "uppercase", "mb-0.5", "flex", "justify-between"], [1, "fa-regular", "fa-copy", "opacity-0", "group-hover/cell:opacity-100"], [1, "font-mono", "font-bold", "text-slate-700", "dark:text-slate-300", "truncate"], ["title", "Copy Code", 1, "bg-white", "dark:bg-slate-800", "p-2", "hover:bg-blue-50", "dark:hover:bg-blue-900/20", "transition", "cursor-pointer", "group/cell", 3, "click"], [1, "bg-white", "dark:bg-slate-800", "p-2"], [1, "text-slate-400", "dark:text-slate-500", "font-bold", "uppercase", "mb-0.5"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "truncate", 3, "title"], [1, "mt-auto"], [1, "flex", "justify-between", "items-end", "mb-1"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase"], [1, "font-black", "text-indigo-600", "dark:text-indigo-400", "text-lg", "leading-none"], [1, "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "w-full", "bg-slate-100", "dark:bg-slate-700", "rounded-full", "h-1.5", "overflow-hidden", "mb-3"], [1, "bg-indigo-500", "h-1.5", "rounded-full", "transition-all"], [1, "flex", "flex-wrap", "gap-1", "mb-2", "min-h-[22px]"], [1, "px-1.5", "py-0.5", "rounded", "text-[9px]", "flex", "items-center", "gap-1", "border", 3, "ngClass"], ["title", "Ng\u01B0\u1EDDi \u0111ang gi\u1EEF", 1, "px-1.5", "py-0.5", "rounded", "text-[9px]", "flex", "items-center", "gap-1", "border", "bg-blue-50", "text-blue-600", "border-blue-200"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "mb-3", "flex", "items-center", "gap-1"], [1, "pt-3", "border-t", "border-slate-100", "dark:border-slate-700", "flex", "items-center", "justify-between", "gap-2"], [1, "flex", "flex-col"], [1, "text-xs", "font-bold"], [1, "flex", "gap-1", "flex-wrap", "justify-end"], ["title", "Xem CoA", 1, "w-8", "h-8", "rounded-lg", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "border", "border-blue-100", "dark:border-blue-800/50", "hover:bg-blue-100", "dark:hover:bg-blue-900/50", "transition", "flex", "items-center", "justify-center"], ["title", "Upload CoA qua Google Drive", 1, "w-8", "h-8", "rounded-lg", "bg-amber-50", "dark:bg-amber-900/20", "text-amber-600", "dark:amber-400", "border", "border-amber-200", "dark:border-amber-800/50", "hover:bg-amber-100", "dark:hover:bg-amber-900/40", "transition", "flex", "items-center", "justify-center", 3, "disabled"], ["title", "L\u1ECBch s\u1EED", 1, "w-8", "h-8", "rounded-lg", "bg-slate-50", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "border", "border-slate-200", "dark:border-slate-700", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "fa-clock-rotate-left", "text-xs"], ["title", "In nh\u00E3n", 1, "w-8", "h-8", "rounded-lg", "bg-slate-800", "dark:bg-slate-700", "text-white", "border", "border-slate-700", "dark:border-slate-600", "hover:bg-slate-900", "dark:hover:bg-slate-600", "transition", "flex", "items-center", "justify-center", 3, "appLockPermission"], ["title", "Tr\u1EA3 chu\u1EA9n", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-rose-600", "dark:bg-rose-500", "text-white", "hover:bg-rose-700", "dark:hover:bg-rose-600", "shadow-md", "shadow-rose-200", "dark:shadow-none", "transition", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "active:scale-95"], [1, "fa-solid", "fa-location-dot", "text-[10px]"], [1, "fa-solid", "fa-flask-vial", "mr-1"], [1, "fa-solid", "fa-microchip", "mr-1"], [1, "font-bold", "mr-1", "text-slate-400"], [1, "fa-solid", 3, "ngClass"], [1, "font-bold"], [1, "fa-solid", "fa-user"], [1, "font-bold", "truncate", "max-w-[80px]"], [1, "fa-solid", "fa-calendar-check", "text-[9px]", "text-blue-400", "dark:text-blue-500"], [1, "font-medium"], [1, "text-slate-700", "dark:text-slate-300"], ["title", "Xem CoA", 1, "w-8", "h-8", "rounded-lg", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "border", "border-blue-100", "dark:border-blue-800/50", "hover:bg-blue-100", "dark:hover:bg-blue-900/50", "transition", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "fa-file-pdf", "text-xs"], ["title", "Upload CoA qua Google Drive", 1, "w-8", "h-8", "rounded-lg", "bg-amber-50", "dark:bg-amber-900/20", "text-amber-600", "dark:amber-400", "border", "border-amber-200", "dark:border-amber-800/50", "hover:bg-amber-100", "dark:hover:bg-amber-900/40", "transition", "flex", "items-center", "justify-center", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-xs"], [1, "fa-brands", "fa-google-drive", "text-xs"], ["title", "In nh\u00E3n", 1, "w-8", "h-8", "rounded-lg", "bg-slate-800", "dark:bg-slate-700", "text-white", "border", "border-slate-700", "dark:border-slate-600", "hover:bg-slate-900", "dark:hover:bg-slate-600", "transition", "flex", "items-center", "justify-center", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-print", "text-xs"], ["disabled", "", "title", "\u0110ang c\u00F3 ng\u01B0\u1EDDi y\u00EAu c\u1EA7u m\u01B0\u1EE3n", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-orange-100", "dark:bg-orange-900/30", "text-orange-400", "dark:text-orange-500", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "cursor-not-allowed", "border", "border-orange-200", "dark:border-orange-800/50"], ["title", "G\u00E1n cho m\u01B0\u1EE3n", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-emerald-600", "dark:bg-emerald-500", "text-white", "hover:bg-emerald-700", "dark:hover:bg-emerald-600", "shadow-md", "shadow-emerald-200", "dark:shadow-none", "transition", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "active:scale-95"], ["title", "M\u01B0\u1EE3n chu\u1EA9n n\u00E0y", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "shadow-md", "shadow-indigo-200", "dark:shadow-none", "transition", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "active:scale-95"], [1, "fa-solid", "fa-hourglass-half"], ["title", "G\u00E1n cho m\u01B0\u1EE3n", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-emerald-600", "dark:bg-emerald-500", "text-white", "hover:bg-emerald-700", "dark:hover:bg-emerald-600", "shadow-md", "shadow-emerald-200", "dark:shadow-none", "transition", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-hand-holding-hand"], ["title", "M\u01B0\u1EE3n chu\u1EA9n n\u00E0y", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "shadow-md", "shadow-indigo-200", "dark:shadow-none", "transition", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "active:scale-95", 3, "click"], ["title", "Tr\u1EA3 chu\u1EA9n", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-rose-600", "dark:bg-rose-500", "text-white", "hover:bg-rose-700", "dark:hover:bg-rose-600", "shadow-md", "shadow-rose-200", "dark:shadow-none", "transition", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-rotate-left"], ["title", "\u0110\u00E3 c\u00F3 ng\u01B0\u1EDDi y\u00EAu c\u1EA7u mua", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-slate-300", "dark:bg-slate-700", "text-slate-500", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "cursor-not-allowed"], ["title", "\u0110\u1EC1 ngh\u1ECB mua s\u1EAFm", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-amber-500", "dark:bg-amber-600", "text-white", "hover:bg-amber-600", "dark:hover:bg-amber-500", "shadow-md", "shadow-amber-200", "dark:shadow-none", "transition", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "active:scale-95"], [1, "fa-solid", "fa-cart-arrow-down"], ["title", "\u0110\u1EC1 ngh\u1ECB mua s\u1EAFm", 1, "w-auto", "px-3", "h-8", "rounded-lg", "bg-amber-500", "dark:bg-amber-600", "text-white", "hover:bg-amber-600", "dark:hover:bg-amber-500", "shadow-md", "shadow-amber-200", "dark:shadow-none", "transition", "flex", "items-center", "justify-center", "gap-1", "font-bold", "text-xs", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-cart-plus"]], template: function StandardsGridViewComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, StandardsGridViewComponent_Conditional_1_Template, 3, 1, "div", 1)(2, StandardsGridViewComponent_Conditional_2_Template, 2, 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isLoading() && ctx.allStandardsLength() === 0 ? 1 : 2);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe, SkeletonComponent, LockPermissionDirective], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsGridViewComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-grid-view',
                standalone: true,
                imports: [CommonModule, SkeletonComponent, LockPermissionDirective],
                template: `
    <div class="p-4 bg-slate-50/30 dark:bg-slate-900/50">
       @if (isLoading() && allStandardsLength() === 0) { 
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               @for(i of [1,2,3,4]; track i) { <app-skeleton height="280px"></app-skeleton> }
           </div> 
       } @else {
           @if (items().length === 0) {
               <div class="py-16 text-center text-slate-400 dark:text-slate-500 italic w-full border-t border-transparent">
                   <i class="fa-solid fa-box-open text-4xl mb-2 text-slate-300 dark:text-slate-600"></i>
                   <p>Không tìm thấy dữ liệu chuẩn phù hợp.</p>
               </div>
           } @else {
               <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                   @for (std of items(); track std.id) {
                       <div class="bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 flex flex-col relative group h-full hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none overflow-hidden"
                            [ngClass]="{
                                'border-slate-200 dark:border-slate-700': !selectedIds().has(std.id!),
                                'border-indigo-400 dark:border-indigo-500 shadow-md bg-indigo-50 dark:bg-indigo-900/30': selectedIds().has(std.id!),
                                'opacity-50 grayscale hover:opacity-100 hover:grayscale-0': std.status === 'DEPLETED' || std.current_amount <= 0
                            }">
                           
                           <!-- Header: Status Bar -->
                           <div class="w-full h-1.5 flex bg-slate-100 dark:bg-slate-700 shrink-0">
                               <div class="h-full w-full" [class]="getExpiryBarClass(std.expiry_date)"></div>
                           </div>

                           <div class="p-4 flex flex-col h-full">
                               <!-- Top: ID, Location & Checkbox -->
                               <div class="flex justify-between items-start mb-3">
                                   <div class="flex flex-wrap gap-1.5 items-start pr-2">
                                       <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide whitespace-nowrap shadow-sm dark:shadow-none" [ngClass]="getStandardStatus(std).class">
                                           {{getStandardStatus(std).label}}
                                       </span>
                                       @if(std.internal_id) {
                                           <span class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-md text-sm font-black uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50 shadow-sm dark:shadow-none whitespace-nowrap">
                                               {{std.internal_id}}
                                           </span>
                                       }
                                       @if(std.location) {
                                           <span class="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap">
                                               <i class="fa-solid fa-location-dot text-[10px]"></i> {{std.location}}
                                           </span>
                                       }
                                       @for (method of (std.derivedMethodLabels || []).slice(0, 4); track method) {
                                           <span class="bg-indigo-50/70 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md text-[10px] font-black border border-indigo-100 dark:border-indigo-800/40 whitespace-nowrap"><i class="fa-solid fa-flask-vial mr-1"></i>{{method}}</span>
                                       }
                                       @for (device of std.derivedDeviceCodes || []; track device) {
                                           <span class="bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300 px-2 py-1 rounded-md text-[10px] font-black border border-fuchsia-100 dark:border-fuchsia-800/40 whitespace-nowrap"><i class="fa-solid fa-microchip mr-1"></i>{{device}}</span>
                                       }
                                   </div>
                                   <input type="checkbox" [checked]="selectedIds().has(std.id!)" (change)="toggleSelection.emit(std.id!)" class="w-5 h-5 accent-indigo-600 dark:accent-indigo-500 cursor-pointer shrink-0 mt-0.5">
                               </div>

                               <!-- Identity -->
                               <div class="mb-4 cursor-pointer" (click)="navigateToDetail.emit(std)">
                                   <h3 class="font-bold text-slate-800 dark:text-slate-200 text-base leading-snug mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition break-words">{{std.name}}</h3>
                                   @if(std.chemical_name) { <p class="text-xs text-slate-500 dark:text-slate-400 italic font-medium break-words"><span class="font-bold mr-1 text-slate-400">Synonyms:</span>{{std.chemical_name}}</p> }
                               </div>

                               <!-- Data Grid (Click to copy) -->
                               <div class="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 mb-4 text-[11px]">
                                   <div class="bg-white dark:bg-slate-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer group/cell" (click)="copyText.emit({text: std.lot_number || '', event: $event})" title="Copy Lot">
                                       <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5 flex justify-between">Lot <i class="fa-regular fa-copy opacity-0 group-hover/cell:opacity-100"></i></div>
                                       <div class="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{std.lot_number || '-'}}</div>
                                   </div>
                                   <div class="bg-white dark:bg-slate-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer group/cell" (click)="copyText.emit({text: std.product_code || '', event: $event})" title="Copy Code">
                                       <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5 flex justify-between">Code <i class="fa-regular fa-copy opacity-0 group-hover/cell:opacity-100"></i></div>
                                       <div class="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{std.product_code || '-'}}</div>
                                   </div>
                                   <div class="bg-white dark:bg-slate-800 p-2">
                                       <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Mfg</div>
                                       <div class="font-bold text-slate-700 dark:text-slate-300 truncate" [title]="std.manufacturer">{{std.manufacturer || '-'}}</div>
                                   </div>
                                   <div class="bg-white dark:bg-slate-800 p-2">
                                       <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">CAS</div>
                                       <div class="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{std.cas_number || '-'}}</div>
                                   </div>
                               </div>

                               <!-- Stock & Storage -->
                               <div class="mt-auto">
                                   <div class="flex justify-between items-end mb-1">
                                       <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tồn kho</span>
                                       <span class="font-black text-indigo-600 dark:text-indigo-400 text-lg leading-none">{{formatNum(std.current_amount)}} <small class="text-xs font-bold text-slate-400 dark:text-slate-500">{{std.unit}}</small></span>
                                   </div>
                                   <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden mb-3">
                                       <div class="bg-indigo-500 h-1.5 rounded-full transition-all" [style.width.%]="(std.current_amount / (std.initial_amount || 1)) * 100"></div>
                                   </div>
                                   
                                   <!-- Storage Badges -->
                                   <div class="flex flex-wrap gap-1 mb-2 min-h-[22px]">
                                       @for (info of getStorageInfo(std.storage_condition); track $index) {
                                           <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1 border" [ngClass]="[info.bg, info.border, info.color]">
                                               <i class="fa-solid" [ngClass]="info.icon"></i>
                                               <span class="font-bold">{{info.text}}</span>
                                           </div>
                                       }
                                       @if(std.status === 'IN_USE' && std.current_holder) {
                                           <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1 border bg-blue-50 text-blue-600 border-blue-200" title="Người đang giữ">
                                               <i class="fa-solid fa-user"></i>
                                               <span class="font-bold truncate max-w-[80px]">{{std.current_holder}}</span>
                                           </div>
                                       }
                                   </div>
                                   @if(std.received_date) {
                                       <div class="text-[10px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                                           <i class="fa-solid fa-calendar-check text-[9px] text-blue-400 dark:text-blue-500"></i>
                                           <span class="font-medium">Nhận: <b class="text-slate-700 dark:text-slate-300">{{std.received_date | date:'dd/MM/yyyy'}}</b></span>
                                       </div>
                                   }
                               </div>

                               <!-- Footer Actions -->
                               <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                                   <div class="flex flex-col">
                                       <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Hết hạn</span>
                                       <span class="text-xs font-bold" [class]="getExpiryTimeClass(std.expiry_date)">{{getExpiryTimeLeft(std.expiry_date) || 'N/A'}}</span>
                                   </div>
                                   
                                   <div class="flex gap-1 flex-wrap justify-end">
                                       @if(std.certificate_ref) {
                                           <button (click)="$event.stopPropagation(); openCoaPreview.emit({url: std.certificate_ref, event: $event})" class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition flex items-center justify-center" title="Xem CoA">
                                               <i class="fa-solid fa-file-pdf text-xs"></i>
                                           </button>
                                       } @else if(currentUser()?.role === 'manager') {
                                           <button (click)="$event.stopPropagation(); triggerQuickDriveUpload.emit({std: std, event: $event})" [disabled]="quickUploadStdId() === std.id" class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition flex items-center justify-center" title="Upload CoA qua Google Drive">
                                               @if(quickUploadStdId() === std.id) { <i class="fa-solid fa-spinner fa-spin text-xs"></i> } @else { <i class="fa-brands fa-google-drive text-xs"></i> }
                                           </button>
                                       }
                                       <button (click)="$event.stopPropagation(); viewHistory.emit(std)" class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center" title="Lịch sử">
                                           <i class="fa-solid fa-clock-rotate-left text-xs"></i>
                                       </button>
                                       @if(canEditStandards() || state.showLockedFeatures()) {
                                           <button [appLockPermission]="'standard_edit'" (click)="$event.stopPropagation(); openPrintModal.emit(std)" class="w-8 h-8 rounded-lg bg-slate-800 dark:bg-slate-700 text-white border border-slate-700 dark:border-slate-600 hover:bg-slate-900 dark:hover:bg-slate-600 transition flex items-center justify-center" title="In nhãn">
                                               <i class="fa-solid fa-print text-xs"></i>
                                           </button>
                                       }
                                       @if(canAssign(std)) {
                                           @if(std.has_pending_request) {
                                               <button disabled class="w-auto px-3 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-400 dark:text-orange-500 flex items-center justify-center gap-1 font-bold text-xs cursor-not-allowed border border-orange-200 dark:border-orange-800/50" title="Đang có người yêu cầu mượn">
                                                   <i class="fa-solid fa-hourglass-half"></i> Chờ Duyệt
                                               </button>
                                           } @else if(canAssignStandards()) {
                                               <button (click)="$event.stopPropagation(); openAssignModal.emit({std: std, isAssign: true})" class="w-auto px-3 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-md shadow-emerald-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Gán cho mượn">
                                                   <i class="fa-solid fa-hand-holding-hand"></i> Gán
                                               </button>
                                           } @else if(canRequestStandards()) {
                                               <button (click)="$event.stopPropagation(); openAssignModal.emit({std: std, isAssign: false})" class="w-auto px-3 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Mượn chuẩn này">
                                                   <i class="fa-solid fa-hand-holding-hand"></i> Mượn
                                               </button>
                                           }
                                       } @else if (std.status === 'IN_USE' && (canAssignStandards() || std.current_holder_uid === currentUser()?.uid)) {
                                           <button (click)="$event.stopPropagation(); goToReturn.emit(std)" class="w-auto px-3 h-8 rounded-lg bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Trả chuẩn">
                                               <i class="fa-solid fa-rotate-left"></i> Trả Chuẩn
                                          </button>
                                       } @else if (std.status === 'DEPLETED' || std.current_amount <= 0) {
                                           @if (std.restock_requested) {
                                               <button class="w-auto px-3 h-8 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 flex items-center justify-center gap-1 font-bold text-xs cursor-not-allowed" title="Đã có người yêu cầu mua">
                                                   <i class="fa-solid fa-cart-arrow-down"></i> Đã Y/C
                                               </button>
                                           } @else if(canRequestStandards() || canAssignStandards()) {
                                               <button (click)="$event.stopPropagation(); openPurchaseRequestModal.emit(std)" class="w-auto px-3 h-8 rounded-lg bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-500 shadow-md shadow-amber-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Đề nghị mua sắm">
                                                   <i class="fa-solid fa-cart-plus"></i> Đề Nghị Mua
                                               </button>
                                           }
                                       }
                                   </div>
                               </div>
                           </div>
                       </div>
                   }
               </div>
           }
       }
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsGridViewComponent, { className: "StandardsGridViewComponent", filePath: "src/app/features/standards/components/standards-grid-view.component.ts", lineNumber: 192 }); })();
//# sourceMappingURL=standards-grid-view.component.js.map