import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { formatNum, getStorageInfo, getExpiryClass, getExpiryTimeClass, getExpiryTimeLeft, getStandardStatus, canAssign } from '../../../shared/utils/utils';
import { LockPermissionDirective } from '../../../shared/directives/lock-permission.directive';
import { StateService } from '../../../core/services/state.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = () => [1, 2, 3, 4, 5];
const _c1 = (a0, a1) => ({ "bg-indigo-50 dark:bg-indigo-900/30": a0, "opacity-50 grayscale hover:opacity-100 hover:grayscale-0": a1 });
const _c2 = () => [];
const _c3 = (a0, a1, a2) => [a0, a1, a2];
const _forTrack0 = ($index, $item) => $item.id;
function StandardsListViewComponent_Conditional_19_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 10)(1, "td", 11);
    i0.ɵɵelement(2, "app-skeleton", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 13);
    i0.ɵɵelement(4, "app-skeleton", 14)(5, "app-skeleton", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td", 13);
    i0.ɵɵelement(7, "app-skeleton", 16)(8, "app-skeleton", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "td", 13);
    i0.ɵɵelement(10, "app-skeleton", 18)(11, "app-skeleton", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "td", 13);
    i0.ɵɵelement(13, "app-skeleton", 20)(14, "app-skeleton", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "td", 22);
    i0.ɵɵelement(16, "app-skeleton", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "td", 22);
    i0.ɵɵelement(18, "app-skeleton", 24);
    i0.ɵɵelementEnd()();
} }
function StandardsListViewComponent_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, StandardsListViewComponent_Conditional_19_For_1_Template, 19, 0, "tr", 10, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30)(1, "span", 69);
    i0.ɵɵtext(2, "Synonyms:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("title", std_r2.chemical_name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(std_r2.chemical_name);
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r2.internal_id);
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 33);
    i0.ɵɵelement(1, "i", 70);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", std_r2.location, "");
} }
function StandardsListViewComponent_Conditional_20_For_1_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 34);
    i0.ɵɵelement(1, "i", 71);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const method_r4 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(method_r4);
} }
function StandardsListViewComponent_Conditional_20_For_1_For_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 35);
    i0.ɵɵelement(1, "i", 72);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const device_r5 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(device_r5);
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 39);
    i0.ɵɵtext(1, "CAS:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "span", 73);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(std_r2.cas_number);
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "Pur: ");
    i0.ɵɵelementStart(2, "b", 74);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(std_r2.purity);
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "Pack: ");
    i0.ɵɵelementStart(2, "b", 74);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(std_r2.pack_size);
} }
function StandardsListViewComponent_Conditional_20_For_1_For_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 48);
    i0.ɵɵelement(1, "i", 75);
    i0.ɵɵelementStart(2, "span", 76);
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
function StandardsListViewComponent_Conditional_20_For_1_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 49);
    i0.ɵɵelement(1, "i", 77);
    i0.ɵɵelementStart(2, "span", 78);
    i0.ɵɵtext(3, "Nh\u1EADn: ");
    i0.ɵɵelementStart(4, "b", 74);
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(6, 1, std_r2.received_date, "dd/MM/yyyy"));
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 79);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Conditional_51_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r7); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openCoaPreview.emit({ url: std_r2.certificate_ref, event: $event })); });
    i0.ɵɵelement(1, "i", 80);
    i0.ɵɵtext(2, " CoA");
    i0.ɵɵelementEnd();
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_52_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 82);
    i0.ɵɵtext(1, " \u0110ang upload... ");
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_52_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 83);
    i0.ɵɵtext(1, " Upload CoA ");
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_52_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 81);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Conditional_52_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r8); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.triggerQuickDriveUpload.emit({ std: std_r2, event: $event })); });
    i0.ɵɵtemplate(1, StandardsListViewComponent_Conditional_20_For_1_Conditional_52_Conditional_1_Template, 2, 0)(2, StandardsListViewComponent_Conditional_20_For_1_Conditional_52_Conditional_2_Template, 2, 0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r2.quickUploadStdId() === std_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.quickUploadStdId() === std_r2.id ? 1 : 2);
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 56);
    i0.ɵɵelement(1, "i", 84);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", std_r2.contract_ref, "");
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_57_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 59)(1, "div", 76);
    i0.ɵɵtext(2, "Ng\u01B0\u1EDDi gi\u1EEF:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 85);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("title", std_r2.current_holder);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r2.current_holder);
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 86);
    i0.ɵɵelement(1, "i", 89);
    i0.ɵɵelementEnd();
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 90);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); const std_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openAssignModal.emit({ std: std_r2, isAssign: true })); });
    i0.ɵɵelement(1, "i", 91);
    i0.ɵɵelementEnd();
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 92);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Conditional_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const std_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openAssignModal.emit({ std: std_r2, isAssign: false })); });
    i0.ɵɵelement(1, "i", 91);
    i0.ɵɵelementEnd();
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Conditional_0_Template, 2, 0, "button", 86)(1, StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Conditional_1_Template, 2, 0, "button", 87)(2, StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Conditional_2_Template, 2, 0, "button", 88);
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(std_r2.has_pending_request ? 0 : ctx_r2.canAssignStandards() ? 1 : ctx_r2.canRequestStandards() ? 2 : -1);
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_62_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 93);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Conditional_62_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.goToReturn.emit(std_r2)); });
    i0.ɵɵelement(1, "i", 94);
    i0.ɵɵelementEnd();
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_63_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 95);
    i0.ɵɵelement(1, "i", 97);
    i0.ɵɵelementEnd();
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_63_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 98);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Conditional_63_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const std_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openPurchaseRequestModal.emit(std_r2)); });
    i0.ɵɵelement(1, "i", 99);
    i0.ɵɵelementEnd();
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_63_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsListViewComponent_Conditional_20_For_1_Conditional_63_Conditional_0_Template, 2, 0, "button", 95)(1, StandardsListViewComponent_Conditional_20_For_1_Conditional_63_Conditional_1_Template, 2, 0, "button", 96);
} if (rf & 2) {
    const std_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(std_r2.restock_requested ? 0 : ctx_r2.canRequestStandards() || ctx_r2.canAssignStandards() ? 1 : -1);
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_64_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 100);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Conditional_64_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openPrintModal.emit(std_r2)); });
    i0.ɵɵelement(1, "i", 101);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵproperty("appLockPermission", "standard_edit");
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_68_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 102);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Conditional_68_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r14); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openEditModal.emit(std_r2)); });
    i0.ɵɵelement(1, "i", 103);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵproperty("appLockPermission", "standard_edit");
} }
function StandardsListViewComponent_Conditional_20_For_1_Conditional_69_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 104);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Conditional_69_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r15); const std_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openBackfillModal.emit(std_r2)); });
    i0.ɵɵelement(1, "i", 105);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵproperty("appLockPermission", "standard_edit");
} }
function StandardsListViewComponent_Conditional_20_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 25)(1, "td", 26)(2, "input", 4);
    i0.ɵɵlistener("change", function StandardsListViewComponent_Conditional_20_For_1_Template_input_change_2_listener() { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleSelection.emit(std_r2.id)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(3, "td", 27)(4, "div", 28)(5, "div", 29);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Template_div_click_5_listener() { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.navigateToDetail.emit(std_r2)); });
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, StandardsListViewComponent_Conditional_20_For_1_Conditional_7_Template, 4, 2, "div", 30);
    i0.ɵɵelementStart(8, "div", 31);
    i0.ɵɵtemplate(9, StandardsListViewComponent_Conditional_20_For_1_Conditional_9_Template, 2, 1, "span", 32)(10, StandardsListViewComponent_Conditional_20_For_1_Conditional_10_Template, 3, 1, "span", 33);
    i0.ɵɵrepeaterCreate(11, StandardsListViewComponent_Conditional_20_For_1_For_12_Template, 3, 1, "span", 34, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵrepeaterCreate(13, StandardsListViewComponent_Conditional_20_For_1_For_14_Template, 3, 1, "span", 35, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(15, "td", 36)(16, "div", 37);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "div", 38)(19, "span", 39);
    i0.ɵɵtext(20, "LOT:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 40);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Template_span_click_21_listener($event) { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.copyText.emit({ text: std_r2.lot_number || "", event: $event })); });
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "span", 39);
    i0.ɵɵtext(24, "CODE:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "span", 40);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Template_span_click_25_listener($event) { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.copyText.emit({ text: std_r2.product_code || "", event: $event })); });
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(27, StandardsListViewComponent_Conditional_20_For_1_Conditional_27_Template, 4, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div", 41);
    i0.ɵɵtemplate(29, StandardsListViewComponent_Conditional_20_For_1_Conditional_29_Template, 4, 1, "span")(30, StandardsListViewComponent_Conditional_20_For_1_Conditional_30_Template, 4, 1, "span");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(31, "td", 36)(32, "div", 42)(33, "span", 43);
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "span", 44);
    i0.ɵɵtext(36);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "div", 45);
    i0.ɵɵelement(38, "div", 46);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "div", 47);
    i0.ɵɵrepeaterCreate(40, StandardsListViewComponent_Conditional_20_For_1_For_41_Template, 4, 7, "div", 48, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(42, StandardsListViewComponent_Conditional_20_For_1_Conditional_42_Template, 7, 4, "div", 49);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "td", 36)(44, "div", 50)(45, "div", 51);
    i0.ɵɵtext(46);
    i0.ɵɵpipe(47, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "div", 52);
    i0.ɵɵtext(49);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(50, "div", 53);
    i0.ɵɵtemplate(51, StandardsListViewComponent_Conditional_20_For_1_Conditional_51_Template, 3, 0, "button", 54)(52, StandardsListViewComponent_Conditional_20_For_1_Conditional_52_Template, 3, 2, "button", 55)(53, StandardsListViewComponent_Conditional_20_For_1_Conditional_53_Template, 3, 1, "div", 56);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(54, "td", 57)(55, "span", 58);
    i0.ɵɵtext(56);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(57, StandardsListViewComponent_Conditional_20_For_1_Conditional_57_Template, 5, 2, "div", 59);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "td", 57)(59, "div", 60)(60, "div", 61);
    i0.ɵɵtemplate(61, StandardsListViewComponent_Conditional_20_For_1_Conditional_61_Template, 3, 1)(62, StandardsListViewComponent_Conditional_20_For_1_Conditional_62_Template, 2, 0, "button", 62)(63, StandardsListViewComponent_Conditional_20_For_1_Conditional_63_Template, 2, 1)(64, StandardsListViewComponent_Conditional_20_For_1_Conditional_64_Template, 2, 1, "button", 63);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(65, "div", 64)(66, "button", 65);
    i0.ɵɵlistener("click", function StandardsListViewComponent_Conditional_20_For_1_Template_button_click_66_listener() { const std_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.viewHistory.emit(std_r2)); });
    i0.ɵɵelement(67, "i", 66);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(68, StandardsListViewComponent_Conditional_20_For_1_Conditional_68_Template, 2, 1, "button", 67)(69, StandardsListViewComponent_Conditional_20_For_1_Conditional_69_Template, 2, 1, "button", 68);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    let tmp_38_0;
    let tmp_43_0;
    const std_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(41, _c1, ctx_r2.selectedIds().has(std_r2.id), std_r2.status === "DEPLETED" || std_r2.current_amount <= 0));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r2.selectedIds().has(std_r2.id));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("title", std_r2.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", std_r2.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r2.chemical_name ? 7 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r2.internal_id ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r2.location ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater((std_r2.derivedMethodLabels || i0.ɵɵpureFunction0(44, _c2)).slice(0, 4));
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(std_r2.derivedDeviceCodes || i0.ɵɵpureFunction0(45, _c2));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("title", std_r2.manufacturer);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r2.manufacturer || "N/A");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(std_r2.lot_number || "-");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(std_r2.product_code || "-");
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r2.cas_number ? 27 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r2.purity ? 29 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r2.pack_size ? 30 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r2.formatNum(std_r2.current_amount));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(std_r2.unit);
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ctx_r2.Math.min(std_r2.current_amount / (std_r2.initial_amount || 1) * 100, 100), "%");
    i0.ɵɵclassProp("bg-emerald-500", std_r2.current_amount / (std_r2.initial_amount || 1) > 0.2)("bg-rose-500", std_r2.current_amount / (std_r2.initial_amount || 1) <= 0.2);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.getStorageInfo(std_r2.storage_condition));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r2.received_date ? 42 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r2.getExpiryClass(std_r2.expiry_date));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r2.expiry_date ? i0.ɵɵpipeBind2(47, 38, std_r2.expiry_date, "dd/MM/yyyy") : "N/A");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r2.getExpiryTimeClass(std_r2.expiry_date));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.getExpiryTimeLeft(std_r2.expiry_date));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r2.certificate_ref ? 51 : ((tmp_38_0 = ctx_r2.currentUser()) == null ? null : tmp_38_0.role) === "manager" ? 52 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r2.contract_ref ? 53 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", ctx_r2.getStandardStatus(std_r2).class);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.getStandardStatus(std_r2).label);
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r2.status === "IN_USE" && std_r2.current_holder ? 57 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r2.canAssign(std_r2) ? 61 : std_r2.status === "IN_USE" && (ctx_r2.canAssignStandards() || std_r2.current_holder_uid === ((tmp_43_0 = ctx_r2.currentUser()) == null ? null : tmp_43_0.uid)) ? 62 : std_r2.status === "DEPLETED" || std_r2.current_amount <= 0 ? 63 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r2.canEditStandards() || ctx_r2.state.showLockedFeatures() ? 64 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r2.canEditStandards() || ctx_r2.state.showLockedFeatures() ? 68 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canEditStandards() || ctx_r2.state.showLockedFeatures() ? 69 : -1);
} }
function StandardsListViewComponent_Conditional_20_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 106);
    i0.ɵɵtext(2, "Kh\u00F4ng t\u00ECm th\u1EA5y d\u1EEF li\u1EC7u.");
    i0.ɵɵelementEnd()();
} }
function StandardsListViewComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, StandardsListViewComponent_Conditional_20_For_1_Template, 70, 46, "tr", 25, _forTrack0);
    i0.ɵɵtemplate(2, StandardsListViewComponent_Conditional_20_Conditional_2_Template, 3, 0, "tr");
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵrepeater(ctx_r2.items());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.items().length === 0 ? 2 : -1);
} }
export class StandardsListViewComponent {
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
        this.toggleAll = output();
        this.navigateToDetail = output();
        this.copyText = output();
        this.openCoaPreview = output();
        this.triggerQuickDriveUpload = output();
        this.openAssignModal = output();
        this.goToReturn = output();
        this.openPurchaseRequestModal = output();
        this.openPrintModal = output();
        this.viewHistory = output();
        this.openEditModal = output();
        this.openBackfillModal = output();
        // Helpers exposed to template
        this.Math = Math;
        this.formatNum = formatNum;
        this.getStorageInfo = getStorageInfo;
        this.getExpiryClass = getExpiryClass;
        this.getExpiryTimeClass = getExpiryTimeClass;
        this.getExpiryTimeLeft = getExpiryTimeLeft;
        this.getStandardStatus = getStandardStatus;
        this.canAssign = canAssign;
    }
    isAllSelected() {
        return this.items().length > 0 && this.items().every(i => this.selectedIds().has(i.id));
    }
    static { this.ɵfac = function StandardsListViewComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsListViewComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsListViewComponent, selectors: [["app-standards-list-view"]], inputs: { items: [1, "items"], isLoading: [1, "isLoading"], allStandardsLength: [1, "allStandardsLength"], selectedIds: [1, "selectedIds"], quickUploadStdId: [1, "quickUploadStdId"], canEditStandards: [1, "canEditStandards"], canAssignStandards: [1, "canAssignStandards"], canRequestStandards: [1, "canRequestStandards"], currentUser: [1, "currentUser"] }, outputs: { toggleSelection: "toggleSelection", toggleAll: "toggleAll", navigateToDetail: "navigateToDetail", copyText: "copyText", openCoaPreview: "openCoaPreview", triggerQuickDriveUpload: "triggerQuickDriveUpload", openAssignModal: "openAssignModal", goToReturn: "goToReturn", openPurchaseRequestModal: "openPurchaseRequestModal", openPrintModal: "openPrintModal", viewHistory: "viewHistory", openEditModal: "openEditModal", openBackfillModal: "openBackfillModal" }, decls: 21, vars: 2, consts: [[1, "min-w-[1000px]"], [1, "w-full", "text-sm", "text-left", "relative", "border-collapse"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "font-bold", "uppercase", "bg-slate-50", "dark:bg-slate-800/80", "sticky", "top-0", "z-10", "border-b", "border-slate-200", "dark:border-slate-700", "shadow-sm", "dark:shadow-none", "h-12", "tracking-wide"], [1, "px-4", "py-3", "w-10", "text-center"], ["type", "checkbox", 1, "w-4", "h-4", "accent-indigo-600", "dark:accent-indigo-500", "cursor-pointer", 3, "change", "checked"], [1, "px-4", "py-3", "w-[25%]"], [1, "px-4", "py-3", "w-[20%]"], [1, "px-4", "py-3", "w-[15%]"], [1, "px-4", "py-3", "w-[10%]", "text-center"], [1, "bg-white", "dark:bg-slate-900", "divide-y", "divide-slate-100", "dark:divide-slate-800"], [1, "h-24"], [1, "px-4"], ["width", "16px", "height", "16px"], [1, "px-4", "space-y-2"], ["width", "80%", "height", "16px"], ["width", "40%", "height", "12px"], ["width", "90%", "height", "12px"], ["width", "60%", "height", "12px"], ["width", "50%", "height", "20px"], ["width", "100%", "height", "6px"], ["width", "70%", "height", "14px"], ["width", "40%", "height", "10px"], [1, "px-4", "text-center"], ["width", "80px", "height", "24px", 1, "mx-auto", "rounded-full"], ["width", "60px", "height", "24px", 1, "mx-auto"], [1, "hover:bg-indigo-50/30", "dark:hover:bg-indigo-900/20", "transition", "group", "h-24", 3, "ngClass"], [1, "px-4", "py-3", "text-center", "align-top", "pt-4"], [1, "px-4", "py-3", "align-top"], [1, "flex", "flex-col", "h-full"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-base", "mb-1", "hover:text-indigo-600", "dark:hover:text-indigo-400", "transition", "cursor-pointer", "leading-snug", "break-words", 3, "click", "title"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "italic", "mb-2", "break-words", 3, "title"], [1, "flex", "flex-wrap", "gap-2", "mt-auto"], [1, "px-2.5", "py-1", "rounded-md", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-400", "text-sm", "font-black", "border", "border-indigo-100", "dark:border-indigo-800/50", "tracking-tight"], [1, "px-2", "py-1", "rounded-md", "bg-slate-100", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-400", "text-xs", "font-bold", "border", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "gap-1.5"], [1, "px-2", "py-1", "rounded-md", "bg-indigo-50/70", "dark:bg-indigo-900/20", "text-indigo-700", "dark:text-indigo-300", "text-[10px]", "font-black", "border", "border-indigo-100", "dark:border-indigo-800/40"], [1, "px-2", "py-1", "rounded-md", "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "text-fuchsia-700", "dark:text-fuchsia-300", "text-[10px]", "font-black", "border", "border-fuchsia-100", "dark:border-fuchsia-800/40"], [1, "px-4", "py-3", "align-top", "border-l", "border-slate-50", "dark:border-slate-800"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "mb-1.5", "truncate", 3, "title"], [1, "grid", "grid-cols-[auto_1fr]", "gap-x-2", "gap-y-1", "text-[11px]", "text-slate-500", "dark:text-slate-400"], [1, "font-bold", "text-slate-400", "dark:text-slate-500"], ["title", "Nh\u1EA5n \u0111\u1EC3 sao ch\u00E9p", 1, "font-mono", "text-slate-700", "dark:text-slate-300", "cursor-pointer", "hover:text-blue-600", "dark:hover:text-blue-400", "hover:underline", "decoration-dotted", 3, "click"], [1, "mt-2", "pt-1", "border-t", "border-slate-100", "dark:border-slate-800", "text-[10px]", "flex", "items-center", "gap-2", "text-slate-500", "dark:text-slate-400"], [1, "flex", "items-baseline", "justify-between", "mb-1"], [1, "text-lg", "font-black", "text-emerald-600", "dark:text-emerald-400", "leading-none"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "ml-1"], [1, "w-full", "bg-slate-100", "dark:bg-slate-800", "rounded-full", "h-1.5", "mb-2", "overflow-hidden", "relative"], [1, "h-full", "rounded-full", "transition-all", "duration-500"], [1, "flex", "flex-col", "gap-1", "mt-1"], [1, "px-1.5", "py-0.5", "rounded", "text-[9px]", "flex", "items-center", "gap-1.5", "border", "w-fit", 3, "ngClass"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "mt-1.5", "flex", "items-center", "gap-1"], [1, "flex", "flex-col", "gap-0.5", "mb-2"], [1, "font-mono", "font-bold", "text-xs"], [1, "text-[10px]", "font-medium"], [1, "flex", "flex-col", "gap-1.5"], [1, "flex", "items-center", "gap-1.5", "text-[10px]", "font-bold", "text-blue-600", "dark:text-blue-400", "bg-blue-50", "dark:bg-blue-900/30", "px-2", "py-1", "rounded", "border", "border-blue-100", "dark:border-blue-800/50", "hover:bg-blue-100", "dark:hover:bg-blue-900/50", "transition", "w-fit"], ["title", "Upload CoA nhanh qua Google Drive", 1, "flex", "items-center", "gap-1.5", "text-[10px]", "font-bold", "text-amber-600", "dark:amber-400", "bg-amber-50", "dark:bg-amber-900/20", "px-2", "py-1", "rounded", "border", "border-amber-200", "dark:border-amber-800/50", "hover:bg-amber-100", "dark:hover:bg-amber-900/40", "transition", "w-fit", 3, "disabled"], ["title", "H\u1EE3p \u0111\u1ED3ng", 1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "truncate", "max-w-[120px]", "flex", "items-center", "gap-1"], [1, "px-4", "py-3", "align-top", "text-center", "border-l", "border-slate-50", "dark:border-slate-800"], [1, "inline-block", "px-2", "py-1", "rounded-md", "text-[10px]", "font-bold", "uppercase", "border", "tracking-wide", "whitespace-nowrap", 3, "ngClass"], [1, "mt-2", "text-[10px]", "text-slate-500", "dark:text-slate-400"], [1, "flex", "flex-col", "items-center", "gap-2"], [1, "flex", "gap-1"], ["title", "Tr\u1EA3 chu\u1EA9n", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-rose-600", "dark:bg-rose-500", "text-white", "hover:bg-rose-700", "dark:hover:bg-rose-600", "shadow-md", "shadow-rose-200", "dark:shadow-none", "transition", "active:scale-95"], ["title", "In nh\u00E3n", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-slate-800", "dark:bg-slate-700", "text-white", "hover:bg-slate-900", "dark:hover:bg-slate-600", "shadow-md", "shadow-slate-200", "dark:shadow-none", "transition", "active:scale-95", 3, "appLockPermission"], [1, "flex", "gap-1", "opacity-0", "group-hover:opacity-100", "transition-opacity", "duration-200"], ["title", "L\u1ECBch s\u1EED", 1, "w-7", "h-7", "flex", "items-center", "justify-center", "rounded-lg", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-200", "dark:hover:bg-slate-700", "transition", "border", "border-slate-200", "dark:border-slate-700", 3, "click"], [1, "fa-solid", "fa-clock-rotate-left", "text-[10px]"], ["title", "S\u1EEDa", 1, "w-7", "h-7", "flex", "items-center", "justify-center", "rounded-lg", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-50", "dark:hover:bg-blue-900/30", "transition", 3, "appLockPermission"], ["title", "Nh\u1EADp b\u00F9 nh\u1EADt k\u00FD s\u1EED d\u1EE5ng", 1, "w-7", "h-7", "flex", "items-center", "justify-center", "rounded-lg", "bg-purple-50", "dark:bg-purple-900/30", "border", "border-purple-200", "dark:border-purple-800/50", "text-purple-600", "dark:text-purple-400", "hover:bg-purple-100", "dark:hover:bg-purple-900/50", "transition", 3, "appLockPermission"], [1, "font-bold", "mr-1", "text-slate-400"], [1, "fa-solid", "fa-location-dot", "text-[10px]"], [1, "fa-solid", "fa-flask-vial", "mr-1"], [1, "fa-solid", "fa-microchip", "mr-1"], [1, "font-mono", "text-slate-700", "dark:text-slate-300"], [1, "text-slate-700", "dark:text-slate-300"], [1, "fa-solid", 3, "ngClass"], [1, "font-bold"], [1, "fa-solid", "fa-calendar-check", "text-[9px]", "text-blue-400", "dark:text-blue-500"], [1, "font-medium"], [1, "flex", "items-center", "gap-1.5", "text-[10px]", "font-bold", "text-blue-600", "dark:text-blue-400", "bg-blue-50", "dark:bg-blue-900/30", "px-2", "py-1", "rounded", "border", "border-blue-100", "dark:border-blue-800/50", "hover:bg-blue-100", "dark:hover:bg-blue-900/50", "transition", "w-fit", 3, "click"], [1, "fa-solid", "fa-file-pdf"], ["title", "Upload CoA nhanh qua Google Drive", 1, "flex", "items-center", "gap-1.5", "text-[10px]", "font-bold", "text-amber-600", "dark:amber-400", "bg-amber-50", "dark:bg-amber-900/20", "px-2", "py-1", "rounded", "border", "border-amber-200", "dark:border-amber-800/50", "hover:bg-amber-100", "dark:hover:bg-amber-900/40", "transition", "w-fit", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-brands", "fa-google-drive"], [1, "fa-solid", "fa-file-contract"], [1, "truncate", "max-w-[100px]", "mx-auto", 3, "title"], ["disabled", "", "title", "\u0110ang c\u00F3 ng\u01B0\u1EDDi y\u00EAu c\u1EA7u m\u01B0\u1EE3n", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-orange-100", "dark:bg-orange-900/30", "text-orange-400", "dark:text-orange-500", "cursor-not-allowed", "border", "border-orange-200", "dark:border-orange-800/50"], ["title", "G\u00E1n cho m\u01B0\u1EE3n", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-emerald-600", "dark:bg-emerald-500", "text-white", "hover:bg-emerald-700", "dark:hover:bg-emerald-600", "shadow-md", "shadow-emerald-200", "dark:shadow-none", "transition", "active:scale-95"], ["title", "M\u01B0\u1EE3n chu\u1EA9n n\u00E0y", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "shadow-md", "shadow-indigo-200", "dark:shadow-none", "transition", "active:scale-95"], [1, "fa-solid", "fa-hourglass-half", "text-xs"], ["title", "G\u00E1n cho m\u01B0\u1EE3n", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-emerald-600", "dark:bg-emerald-500", "text-white", "hover:bg-emerald-700", "dark:hover:bg-emerald-600", "shadow-md", "shadow-emerald-200", "dark:shadow-none", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-hand-holding-hand", "text-xs"], ["title", "M\u01B0\u1EE3n chu\u1EA9n n\u00E0y", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "shadow-md", "shadow-indigo-200", "dark:shadow-none", "transition", "active:scale-95", 3, "click"], ["title", "Tr\u1EA3 chu\u1EA9n", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-rose-600", "dark:bg-rose-500", "text-white", "hover:bg-rose-700", "dark:hover:bg-rose-600", "shadow-md", "shadow-rose-200", "dark:shadow-none", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-rotate-left", "text-xs"], ["title", "\u0110\u00E3 c\u00F3 ng\u01B0\u1EDDi y\u00EAu c\u1EA7u mua", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-slate-300", "dark:bg-slate-700", "text-slate-500", "cursor-not-allowed"], ["title", "\u0110\u1EC1 ngh\u1ECB mua", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-amber-500", "dark:bg-amber-600", "text-white", "hover:bg-amber-600", "dark:hover:bg-amber-500", "shadow-md", "shadow-amber-200", "dark:shadow-none", "transition", "active:scale-95"], [1, "fa-solid", "fa-cart-arrow-down", "text-xs"], ["title", "\u0110\u1EC1 ngh\u1ECB mua", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-amber-500", "dark:bg-amber-600", "text-white", "hover:bg-amber-600", "dark:hover:bg-amber-500", "shadow-md", "shadow-amber-200", "dark:shadow-none", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-cart-plus", "text-xs"], ["title", "In nh\u00E3n", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "bg-slate-800", "dark:bg-slate-700", "text-white", "hover:bg-slate-900", "dark:hover:bg-slate-600", "shadow-md", "shadow-slate-200", "dark:shadow-none", "transition", "active:scale-95", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-print", "text-xs"], ["title", "S\u1EEDa", 1, "w-7", "h-7", "flex", "items-center", "justify-center", "rounded-lg", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-50", "dark:hover:bg-blue-900/30", "transition", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-pen", "text-[10px]"], ["title", "Nh\u1EADp b\u00F9 nh\u1EADt k\u00FD s\u1EED d\u1EE5ng", 1, "w-7", "h-7", "flex", "items-center", "justify-center", "rounded-lg", "bg-purple-50", "dark:bg-purple-900/30", "border", "border-purple-200", "dark:border-purple-800/50", "text-purple-600", "dark:text-purple-400", "hover:bg-purple-100", "dark:hover:bg-purple-900/50", "transition", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-pen-to-square", "text-[10px]"], ["colspan", "7", 1, "p-16", "text-center", "text-slate-400", "dark:text-slate-500", "italic"]], template: function StandardsListViewComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "table", 1)(2, "thead", 2)(3, "tr")(4, "th", 3)(5, "input", 4);
            i0.ɵɵlistener("change", function StandardsListViewComponent_Template_input_change_5_listener() { return ctx.toggleAll.emit(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "th", 5);
            i0.ɵɵtext(7, "\u0110\u1ECBnh danh & V\u1ECB tr\u00ED");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "th", 6);
            i0.ɵɵtext(9, "Th\u00F4ng tin l\u00F4/s\u1EA3n xu\u1EA5t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "th", 7);
            i0.ɵɵtext(11, "T\u1ED3n kho & B\u1EA3o qu\u1EA3n");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "th", 7);
            i0.ɵɵtext(13, "H\u1EA1n d\u00F9ng & H\u1ED3 s\u01A1");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "th", 8);
            i0.ɵɵtext(15, "Tr\u1EA1ng th\u00E1i");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "th", 8);
            i0.ɵɵtext(17, "T\u00E1c v\u1EE5");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(18, "tbody", 9);
            i0.ɵɵtemplate(19, StandardsListViewComponent_Conditional_19_Template, 2, 1)(20, StandardsListViewComponent_Conditional_20_Template, 3, 1);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("checked", ctx.isAllSelected());
            i0.ɵɵadvance(14);
            i0.ɵɵconditional(ctx.isLoading() && ctx.allStandardsLength() === 0 ? 19 : 20);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe, SkeletonComponent, LockPermissionDirective], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsListViewComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-list-view',
                standalone: true,
                imports: [CommonModule, SkeletonComponent, LockPermissionDirective],
                template: `
    <div class="min-w-[1000px]"> 
       <table class="w-full text-sm text-left relative border-collapse">
          <thead class="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none h-12 tracking-wide">
             <tr>
                <th class="px-4 py-3 w-10 text-center"><input type="checkbox" [checked]="isAllSelected()" (change)="toggleAll.emit()" class="w-4 h-4 accent-indigo-600 dark:accent-indigo-500 cursor-pointer"></th>
                <th class="px-4 py-3 w-[25%]">Định danh & Vị trí</th>
                <th class="px-4 py-3 w-[20%]">Thông tin lô/sản xuất</th>
                <th class="px-4 py-3 w-[15%]">Tồn kho & Bảo quản</th>
                <th class="px-4 py-3 w-[15%]">Hạn dùng & Hồ sơ</th>
                <th class="px-4 py-3 w-[10%] text-center">Trạng thái</th>
                <th class="px-4 py-3 w-[10%] text-center">Tác vụ</th>
             </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
             @if (isLoading() && allStandardsLength() === 0) {
                  @for (i of [1,2,3,4,5]; track i) {
                      <tr class="h-24">
                          <td class="px-4"><app-skeleton width="16px" height="16px"></app-skeleton></td>
                          <td class="px-4 space-y-2"><app-skeleton width="80%" height="16px"></app-skeleton><app-skeleton width="40%" height="12px"></app-skeleton></td>
                          <td class="px-4 space-y-2"><app-skeleton width="90%" height="12px"></app-skeleton><app-skeleton width="60%" height="12px"></app-skeleton></td>
                          <td class="px-4 space-y-2"><app-skeleton width="50%" height="20px"></app-skeleton><app-skeleton width="100%" height="6px"></app-skeleton></td>
                          <td class="px-4 space-y-2"><app-skeleton width="70%" height="14px"></app-skeleton><app-skeleton width="40%" height="10px"></app-skeleton></td>
                          <td class="px-4 text-center"><app-skeleton width="80px" height="24px" class="mx-auto rounded-full"></app-skeleton></td>
                          <td class="px-4 text-center"><app-skeleton width="60px" height="24px" class="mx-auto"></app-skeleton></td>
                      </tr>
                  }
               } @else {
                 @for (std of items(); track std.id) {
                    <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition group h-24" [ngClass]="{'bg-indigo-50 dark:bg-indigo-900/30': selectedIds().has(std.id!), 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0': std.status === 'DEPLETED' || std.current_amount <= 0}">
                       <td class="px-4 py-3 text-center align-top pt-4">
                           <input type="checkbox" [checked]="selectedIds().has(std.id!)" (change)="toggleSelection.emit(std.id!)" class="w-4 h-4 accent-indigo-600 dark:accent-indigo-500 cursor-pointer">
                       </td>
                       <td class="px-4 py-3 align-top">
                          <div class="flex flex-col h-full">
                              <div class="font-bold text-slate-800 dark:text-slate-200 text-base mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer leading-snug break-words" (click)="navigateToDetail.emit(std)" [title]="std.name">
                                  {{std.name}}
                              </div>
                              @if(std.chemical_name) { <div class="text-xs text-slate-500 dark:text-slate-400 italic mb-2 break-words" [title]="std.chemical_name"><span class="font-bold mr-1 text-slate-400">Synonyms:</span>{{std.chemical_name}}</div> }
                              <div class="flex flex-wrap gap-2 mt-auto">
                                  @if(std.internal_id) { <span class="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-black border border-indigo-100 dark:border-indigo-800/50 tracking-tight">{{std.internal_id}}</span> }
                                  @if(std.location) { <span class="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-location-dot text-[10px]"></i> {{std.location}}</span> }
                                  @for (method of (std.derivedMethodLabels || []).slice(0, 4); track method) { <span class="px-2 py-1 rounded-md bg-indigo-50/70 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-black border border-indigo-100 dark:border-indigo-800/40"><i class="fa-solid fa-flask-vial mr-1"></i>{{method}}</span> }
                                  @for (device of std.derivedDeviceCodes || []; track device) { <span class="px-2 py-1 rounded-md bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300 text-[10px] font-black border border-fuchsia-100 dark:border-fuchsia-800/40"><i class="fa-solid fa-microchip mr-1"></i>{{device}}</span> }
                              </div>
                          </div>
                       </td>
                       <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                          <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 truncate" [title]="std.manufacturer">{{std.manufacturer || 'N/A'}}</div>
                          <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                              <span class="font-bold text-slate-400 dark:text-slate-500">LOT:</span><span class="font-mono text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-dotted" title="Nhấn để sao chép" (click)="copyText.emit({text: std.lot_number || '', event: $event})">{{std.lot_number || '-'}}</span>
                              <span class="font-bold text-slate-400 dark:text-slate-500">CODE:</span><span class="font-mono text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-dotted" title="Nhấn để sao chép" (click)="copyText.emit({text: std.product_code || '', event: $event})">{{std.product_code || '-'}}</span>
                              @if(std.cas_number) { <span class="font-bold text-slate-400 dark:text-slate-500">CAS:</span><span class="font-mono text-slate-700 dark:text-slate-300">{{std.cas_number}}</span> }
                          </div>
                          <div class="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              @if(std.purity) { <span>Pur: <b class="text-slate-700 dark:text-slate-300">{{std.purity}}</b></span> }
                              @if(std.pack_size) { <span>Pack: <b class="text-slate-700 dark:text-slate-300">{{std.pack_size}}</b></span> }
                          </div>
                       </td>
                       <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                          <div class="flex items-baseline justify-between mb-1"><span class="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">{{formatNum(std.current_amount)}}</span><span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 ml-1">{{std.unit}}</span></div>
                          <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden relative"><div class="h-full rounded-full transition-all duration-500" [style.width.%]="Math.min((std.current_amount / (std.initial_amount || 1)) * 100, 100)" [class.bg-emerald-500]="(std.current_amount / (std.initial_amount || 1)) > 0.2" [class.bg-rose-500]="(std.current_amount / (std.initial_amount || 1)) <= 0.2"></div></div>
                          <div class="flex flex-col gap-1 mt-1">
                              @for (info of getStorageInfo(std.storage_condition); track $index) { <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1.5 border w-fit" [ngClass]="[info.bg, info.border, info.color]"><i class="fa-solid" [ngClass]="info.icon"></i><span class="font-bold">{{info.text}}</span></div> }
                          </div>
                          @if(std.received_date) {
                              <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                                  <i class="fa-solid fa-calendar-check text-[9px] text-blue-400 dark:text-blue-500"></i>
                                  <span class="font-medium">Nhận: <b class="text-slate-700 dark:text-slate-300">{{std.received_date | date:'dd/MM/yyyy'}}</b></span>
                              </div>
                          }
                       </td>
                       <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                          <div class="flex flex-col gap-0.5 mb-2">
                              <div class="font-mono font-bold text-xs" [class]="getExpiryClass(std.expiry_date)">{{std.expiry_date ? (std.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</div>
                              <div class="text-[10px] font-medium" [class]="getExpiryTimeClass(std.expiry_date)">{{ getExpiryTimeLeft(std.expiry_date) }}</div>
                          </div>
                          <div class="flex flex-col gap-1.5">
                              @if(std.certificate_ref) { <button (click)="openCoaPreview.emit({url: std.certificate_ref, event: $event})" class="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition w-fit"><i class="fa-solid fa-file-pdf"></i> CoA</button> }
                              @else if(currentUser()?.role === 'manager') { <button (click)="triggerQuickDriveUpload.emit({std: std, event: $event})" [disabled]="quickUploadStdId() === std.id" class="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition w-fit" title="Upload CoA nhanh qua Google Drive">
                                  @if(quickUploadStdId() === std.id) { <i class="fa-solid fa-spinner fa-spin"></i> Đang upload... } @else { <i class="fa-brands fa-google-drive"></i> Upload CoA }
                              </button> }
                              @if(std.contract_ref) { <div class="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[120px] flex items-center gap-1" title="Hợp đồng"><i class="fa-solid fa-file-contract"></i> {{std.contract_ref}}</div> }
                          </div>
                       </td>
                       <td class="px-4 py-3 align-top text-center border-l border-slate-50 dark:border-slate-800">
                           <span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide whitespace-nowrap" [ngClass]="getStandardStatus(std).class">{{getStandardStatus(std).label}}</span>
                           @if(std.status === 'IN_USE' && std.current_holder) {
                               <div class="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                                   <div class="font-bold">Người giữ:</div>
                                   <div class="truncate max-w-[100px] mx-auto" [title]="std.current_holder">{{std.current_holder}}</div>
                               </div>
                           }
                       </td>
                       <td class="px-4 py-3 align-top text-center border-l border-slate-50 dark:border-slate-800">
                          <div class="flex flex-col items-center gap-2">
                             <div class="flex gap-1">
                                 @if(canAssign(std)) {
                                     @if(std.has_pending_request) {
                                         <button disabled class="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-400 dark:text-orange-500 cursor-not-allowed border border-orange-200 dark:border-orange-800/50" title="Đang có người yêu cầu mượn"><i class="fa-solid fa-hourglass-half text-xs"></i></button>
                                     } @else if(canAssignStandards()) {
                                         <button (click)="openAssignModal.emit({std: std, isAssign: true})" class="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-md shadow-emerald-200 dark:shadow-none transition active:scale-95" title="Gán cho mượn"><i class="fa-solid fa-hand-holding-hand text-xs"></i></button>
                                      } @else if(canRequestStandards()) {
                                         <button (click)="openAssignModal.emit({std: std, isAssign: false})" class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none transition active:scale-95" title="Mượn chuẩn này"><i class="fa-solid fa-hand-holding-hand text-xs"></i></button>
                                     }
                                 } @else if (std.status === 'IN_USE' && (canAssignStandards() || std.current_holder_uid === currentUser()?.uid)) {
                                     <button (click)="goToReturn.emit(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition active:scale-95" title="Trả chuẩn"><i class="fa-solid fa-rotate-left text-xs"></i></button>
                                 } @else if (std.status === 'DEPLETED' || std.current_amount <= 0) {
                                     @if (std.restock_requested) {
                                          <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed" title="Đã có người yêu cầu mua"><i class="fa-solid fa-cart-arrow-down text-xs"></i></button>
                                     } @else if(canRequestStandards() || canAssignStandards()) {
                                          <button (click)="openPurchaseRequestModal.emit(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-500 shadow-md shadow-amber-200 dark:shadow-none transition active:scale-95" title="Đề nghị mua"><i class="fa-solid fa-cart-plus text-xs"></i></button>
                                     }
                                 }
                                 @if(canEditStandards() || state.showLockedFeatures()) {
                                     <button [appLockPermission]="'standard_edit'" (click)="openPrintModal.emit(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 shadow-md shadow-slate-200 dark:shadow-none transition active:scale-95" title="In nhãn"><i class="fa-solid fa-print text-xs"></i></button>
                                 }
                             </div>
                             <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                 <button (click)="viewHistory.emit(std)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700" title="Lịch sử"><i class="fa-solid fa-clock-rotate-left text-[10px]"></i></button>
                                 @if(canEditStandards() || state.showLockedFeatures()) { <button [appLockPermission]="'standard_edit'" (click)="openEditModal.emit(std)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition" title="Sửa"><i class="fa-solid fa-pen text-[10px]"></i></button> }
                                 @if(canEditStandards() || state.showLockedFeatures()) { <button [appLockPermission]="'standard_edit'" (click)="openBackfillModal.emit(std)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition" title="Nhập bù nhật ký sử dụng"><i class="fa-solid fa-pen-to-square text-[10px]"></i></button> }
                             </div>
                          </div>
                       </td>
                    </tr>
                 } 
                 @if (items().length === 0) { <tr><td colspan="7" class="p-16 text-center text-slate-400 dark:text-slate-500 italic">Không tìm thấy dữ liệu.</td></tr> }
             }
          </tbody>
       </table>
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsListViewComponent, { className: "StandardsListViewComponent", filePath: "src/app/features/standards/components/standards-list-view.component.ts", lineNumber: 148 }); })();
//# sourceMappingURL=standards-list-view.component.js.map