import { Component, Input, Output, EventEmitter, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { getFefoUnavailableReason, getFefoPriorityStandard, getSameStandardLots, isFefoCandidate, isFefoPriorityStandard, isStandardExpired, parseStandardDate, sortStandardsByFefo } from '../../../../shared/utils/standard-fefo';
import { formatNum } from '../../../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = (a0, a1, a2) => ({ "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-400 dark:border-indigo-500 shadow-[0_0_0_1px_rgba(99,102,241,0.2)] dark:shadow-[0_0_0_1px_rgba(99,102,241,0.3)] z-10 cursor-pointer": a0, "border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 hover:shadow-md hover:shadow-indigo-100/30 dark:hover:shadow-none cursor-pointer bg-white dark:bg-slate-900": a1, "opacity-50 grayscale cursor-not-allowed border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50": a2 });
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.selectedId;
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 43);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx_r1.selectedStandardIds().size, " \u0111\u00E3 ch\u1ECDn");
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 49);
    i0.ɵɵelement(1, "i", 63);
    i0.ɵɵelementEnd();
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 55);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", std_r4.internal_id, " ");
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_32_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 67);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_32_Conditional_3_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r5); const std_r4 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r1.requestPurchase.emit(std_r4)); });
    i0.ɵɵelement(1, "i", 68);
    i0.ɵɵtext(2, " \u0110\u1EC1 Ngh\u1ECB Mua ");
    i0.ɵɵelementEnd();
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 64);
    i0.ɵɵelement(1, "i", 65);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_32_Conditional_3_Template, 3, 0, "button", 66);
} if (rf & 2) {
    const std_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.unavailableReason(std_r4), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isDepleted(std_r4) ? 3 : -1);
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_33_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 71);
    i0.ɵɵelement(1, "i", 74);
    i0.ɵɵtext(2, " \u01AFu ti\u00EAn ");
    i0.ɵɵelementEnd();
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_33_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 72);
    i0.ɵɵelement(1, "i", 75);
    i0.ɵɵtext(2, " S\u1EAFp HH ");
    i0.ɵɵelementEnd();
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_33_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 73);
    i0.ɵɵelement(1, "i", 76);
    i0.ɵɵtext(2, " S\u1EAFp h\u1EBFt ");
    i0.ɵɵelementEnd();
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 69);
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "span", 70);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(4, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_33_Conditional_4_Template, 3, 0, "span", 71)(5, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_33_Conditional_5_Template, 3, 0, "span", 72)(6, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_33_Conditional_6_Template, 3, 0, "span", 73);
} if (rf & 2) {
    const std_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.formatNum(std_r4.current_amount), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(std_r4.unit);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isFefoTopForName(std_r4) ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isExpiringSoon(std_r4) ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isLowStock(std_r4) ? 6 : -1);
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 62);
    i0.ɵɵelement(1, "i", 77);
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngClass", ctx_r1.isExpired(std_r4.expiry_date) ? "text-red-500" : ctx_r1.isExpiringSoon(std_r4) ? "text-orange-500" : "text-slate-400 dark:text-slate-500");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(3, 2, std_r4.expiry_date, "dd/MM/yyyy"), " ");
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 48);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Template_div_click_0_listener() { const std_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.isSelectable(std_r4) && ctx_r1.toggleStandardSelection(std_r4.id)); });
    i0.ɵɵtemplate(1, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_1_Template, 2, 0, "div", 49);
    i0.ɵɵelementStart(2, "div", 50);
    i0.ɵɵelement(3, "i", 51);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 52)(5, "div", 53)(6, "div", 54);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_8_Template, 2, 1, "span", 55);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 56)(10, "div", 57)(11, "span", 58);
    i0.ɵɵtext(12, "M\u00E3:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span", 59);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 57)(16, "span", 58);
    i0.ɵɵtext(17, "Lot:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span", 59);
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 57)(21, "span", 58);
    i0.ɵɵtext(22, "CAS:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "span", 59);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "div", 57)(26, "span", 58);
    i0.ɵɵtext(27, "H\u00E3ng:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "span", 59);
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(30, "div", 60)(31, "div", 61);
    i0.ɵɵtemplate(32, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_32_Template, 4, 2)(33, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_33_Template, 7, 5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(34, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Conditional_34_Template, 4, 5, "div", 62);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const std_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(16, _c0, ctx_r1.selectedStandardIds().has(std_r4.id) && ctx_r1.isSelectable(std_r4), !ctx_r1.selectedStandardIds().has(std_r4.id) && ctx_r1.isSelectable(std_r4), !ctx_r1.isSelectable(std_r4)));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.selectedStandardIds().has(std_r4.id) ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.selectedStandardIds().has(std_r4.id) ? "bg-indigo-600 text-white border-none shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 rotate-12 scale-105" : "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-500 group-hover:scale-105 group-hover:text-indigo-600");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("title", std_r4.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r4.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r4.internal_id ? 8 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", std_r4.product_code || "N/A");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(std_r4.product_code || "N/A");
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", std_r4.lot_number || "N/A");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(std_r4.lot_number || "N/A");
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", std_r4.cas_number || "N/A");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(std_r4.cas_number || "N/A");
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", std_r4.manufacturer || "N/A");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(std_r4.manufacturer || "N/A");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(!ctx_r1.isSelectable(std_r4) ? 32 : 33);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(std_r4.expiry_date ? 34 : -1);
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 78);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Conditional_12_Conditional_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.loadMoreStandards()); });
    i0.ɵɵelement(1, "i", 79);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Xem th\u00EAm \u2014 c\u00F2n ", ctx_r1.filteredAvailableStandards().length - ctx_r1.visibleAvailableStandards().length, " chu\u1EA9n ");
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 47)(1, "div", 80);
    i0.ɵɵelement(2, "i", 81);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 82);
    i0.ɵɵtext(4, "Kh\u00F4ng t\u00ECm th\u1EA5y chu\u1EA9n n\u00E0o ph\u00F9 h\u1EE3p");
    i0.ɵɵelementEnd()();
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 42)(1, "span")(2, "strong", 43);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4, " chu\u1EA9n ph\u00F9 h\u1EE3p");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, CreateRequestDrawerComponent_Conditional_0_Conditional_12_Conditional_5_Template, 2, 1, "span", 43);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 44);
    i0.ɵɵrepeaterCreate(7, CreateRequestDrawerComponent_Conditional_0_Conditional_12_For_8_Template, 35, 20, "div", 45, _forTrack0);
    i0.ɵɵtemplate(9, CreateRequestDrawerComponent_Conditional_0_Conditional_12_Conditional_9_Template, 3, 1, "button", 46)(10, CreateRequestDrawerComponent_Conditional_0_Conditional_12_Conditional_10_Template, 5, 0, "div", 47);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.filteredAvailableStandards().length);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.selectedStandardIds().size > 0 ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.visibleAvailableStandards());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.filteredAvailableStandards().length > ctx_r1.visibleAvailableStandards().length ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.filteredAvailableStandards().length === 0 ? 10 : -1);
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11)(1, "div", 83);
    i0.ɵɵelement(2, "i", 84);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h4", 85);
    i0.ɵɵtext(4, "T\u00ECm Ki\u1EBFm Ch\u1EA5t Chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 86);
    i0.ɵɵtext(6, "Nh\u1EADp t\u00EAn, s\u1ED1 l\u00F4 ho\u1EB7c m\u00E3 CAS \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u ch\u1ECDn chu\u1EA9n m\u01B0\u1EE3n.");
    i0.ɵɵelementEnd()();
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 29);
    i0.ɵɵelement(1, "i", 87);
    i0.ɵɵelementStart(2, "span", 88);
    i0.ɵɵtext(3, "Click ch\u1ECDn chu\u1EA9n \u1EDF danh s\u00E1ch b\u00EAn tr\u00E1i.");
    i0.ɵɵelementEnd()();
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_37_For_2_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 92);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r8 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3(" ", std_r8.internal_id || "", "", std_r8.internal_id && std_r8.lot_number ? " \u00B7 " : "", "", std_r8.lot_number ? "Lot " + std_r8.lot_number : "", " ");
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_37_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 89)(1, "div", 90)(2, "span", 91);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, CreateRequestDrawerComponent_Conditional_0_Conditional_37_For_2_Conditional_4_Template, 2, 3, "span", 92);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 93);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Conditional_37_For_2_Template_button_click_5_listener() { const std_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleStandardSelection(std_r8.id)); });
    i0.ɵɵelement(6, "i", 94);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r8 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", std_r8.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r8.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(std_r8.internal_id || std_r8.lot_number ? 4 : -1);
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30);
    i0.ɵɵrepeaterCreate(1, CreateRequestDrawerComponent_Conditional_0_Conditional_37_For_2_Template, 7, 3, "div", 89, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.selectedStandardsList());
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_38_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 98);
    i0.ɵɵtext(1, " L\u00F4 ");
    i0.ɵɵelementStart(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4, " \u2014 n\u00EAn d\u00F9ng l\u00F4 ");
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const warn_r9 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(warn_r9.selectedLabel);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(warn_r9.priorityLabel);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" (h\u1EA1n: ", warn_r9.priorityExpiry, ") tr\u01B0\u1EDBc. ");
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 31)(1, "div", 95);
    i0.ɵɵelement(2, "i", 96);
    i0.ɵɵelementStart(3, "span", 97);
    i0.ɵɵtext(4, "G\u1EE3i \u00FD FEFO");
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(5, CreateRequestDrawerComponent_Conditional_0_Conditional_38_For_6_Template, 8, 3, "p", 98, _forTrack1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(ctx_r1.fefoWarnings());
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_62_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 99);
    i0.ɵɵtext(1, " \u0110ang x\u1EED l\u00FD... ");
} }
function CreateRequestDrawerComponent_Conditional_0_Conditional_63_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 100);
    i0.ɵɵtext(1, " G\u1EEDi y\u00EAu c\u1EA7u ");
} }
function CreateRequestDrawerComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_div_click_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h3", 5);
    i0.ɵɵelement(6, "i", 6);
    i0.ɵɵtext(7, " Ch\u1ECDn Chu\u1EA9n \u0110\u1ED1i Chi\u1EBFu ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 7);
    i0.ɵɵelement(9, "i", 8);
    i0.ɵɵelementStart(10, "input", 9);
    i0.ɵɵlistener("ngModelChange", function CreateRequestDrawerComponent_Conditional_0_Template_input_ngModelChange_10_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setStandardSearchTerm($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "div", 10);
    i0.ɵɵtemplate(12, CreateRequestDrawerComponent_Conditional_0_Conditional_12_Template, 11, 4)(13, CreateRequestDrawerComponent_Conditional_0_Conditional_13_Template, 7, 0, "div", 11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 12)(15, "div", 13)(16, "div")(17, "h3", 14);
    i0.ɵɵtext(18, "Ho\u00E0n T\u1EA5t Y\u00EAu C\u1EA7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p", 15);
    i0.ɵɵtext(20, "Vui l\u00F2ng cung c\u1EA5p m\u1EE5c \u0111\u00EDch v\u00E0 th\u1EDDi gian d\u1EF1 ki\u1EBFn");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "button", 16);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(22, "i", 17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 18)(24, "form", 19);
    i0.ɵɵlistener("ngSubmit", function CreateRequestDrawerComponent_Conditional_0_Template_form_ngSubmit_24_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSubmit()); });
    i0.ɵɵelementStart(25, "div", 20)(26, "div", 21)(27, "div", 22)(28, "div", 23);
    i0.ɵɵelement(29, "i", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "div", 25);
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "button", 26);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_button_click_32_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearSelection()); });
    i0.ɵɵelement(33, "i", 27);
    i0.ɵɵtext(34, " X\u00F3a H\u1EBFt ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "div", 28);
    i0.ɵɵtemplate(36, CreateRequestDrawerComponent_Conditional_0_Conditional_36_Template, 4, 0, "div", 29)(37, CreateRequestDrawerComponent_Conditional_0_Conditional_37_Template, 3, 0, "div", 30);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(38, CreateRequestDrawerComponent_Conditional_0_Conditional_38_Template, 7, 0, "div", 31);
    i0.ɵɵelementStart(39, "div", 32)(40, "div")(41, "label", 33);
    i0.ɵɵtext(42, "M\u1EE5c \u0111\u00EDch s\u1EED d\u1EE5ng ");
    i0.ɵɵelementStart(43, "span", 34);
    i0.ɵɵtext(44, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(45, "textarea", 35);
    i0.ɵɵelementStart(46, "div", 36)(47, "button", 37);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_button_click_47_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.form.patchValue({ purpose: "Pha chu\u1EA9n m\u1EDBi" })); });
    i0.ɵɵtext(48, "# Pha Chu\u1EA9n M\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "button", 37);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_button_click_49_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.form.patchValue({ purpose: "Ki\u1EC3m tra \u0111\u1ECBnh k\u1EF3" })); });
    i0.ɵɵtext(50, "# Ki\u1EC3m Tra \u0110\u1ECBnh K\u1EF3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "button", 37);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_button_click_51_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.form.patchValue({ purpose: "Ngo\u1EA1i ki\u1EC3m" })); });
    i0.ɵɵtext(52, "# Ngo\u1EA1i Ki\u1EC3m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "button", 37);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_button_click_53_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.form.patchValue({ purpose: "Nghi\u00EAn c\u1EE9u ph\u00E1t tri\u1EC3n" })); });
    i0.ɵɵtext(54, "# Nghi\u00EAn C\u1EE9u Ph\u00E1t Tri\u1EC3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "button", 37);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_button_click_55_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.form.patchValue({ purpose: "Ki\u1EC3m nghi\u1EC7m m\u1EABu" })); });
    i0.ɵɵtext(56, "# Ki\u1EC3m Nghi\u1EC7m M\u1EABu");
    i0.ɵɵelementEnd()()()()()();
    i0.ɵɵelementStart(57, "div", 38)(58, "div", 39)(59, "button", 40);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_button_click_59_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(60, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "button", 41);
    i0.ɵɵlistener("click", function CreateRequestDrawerComponent_Conditional_0_Template_button_click_61_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSubmit()); });
    i0.ɵɵtemplate(62, CreateRequestDrawerComponent_Conditional_0_Conditional_62_Template, 2, 0)(63, CreateRequestDrawerComponent_Conditional_0_Conditional_63_Template, 2, 0);
    i0.ɵɵelementEnd()()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("ngModel", ctx_r1.standardSearchTerm());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.standardSearchTerm().length > 0 ? 12 : 13);
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.selectedStandardIds().size, " chu\u1EA9n \u0111\u00E3 ch\u1ECDn ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.selectedStandardIds().size === 0);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.selectedStandardsList().length === 0 ? 36 : 37);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.fefoWarnings().length > 0 ? 38 : -1);
    i0.ɵɵadvance(23);
    i0.ɵɵproperty("disabled", ctx_r1.selectedStandardIds().size === 0 || ctx_r1.isProcessing);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing ? 62 : 63);
} }
function removeAccents(str) {
    if (!str)
        return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
export class CreateRequestDrawerComponent {
    set availableStandards(val) {
        this._availableStandards.set(val || []);
    }
    constructor() {
        this.fb = inject(FormBuilder);
        this.isOpen = false;
        this.isProcessing = false;
        this.close = new EventEmitter();
        this.submitRequest = new EventEmitter();
        this.requestPurchase = new EventEmitter();
        this._availableStandards = signal([]);
        this.standardSearchTerm = signal('');
        this.selectedStandardIds = signal(new Set());
        this.standardListLimitStep = 80;
        this.standardListLimit = signal(this.standardListLimitStep);
        this.formatNum = formatNum;
        // Filter UI logic
        this.filteredAvailableStandards = computed(() => {
            let stds = this._availableStandards();
            const st = this.standardSearchTerm().trim();
            if (st) {
                const searchTerms = removeAccents(st.toLowerCase()).split(' ').filter(v => v);
                stds = stds.filter(s => {
                    const searchStr = Object.values(s)
                        .filter(val => val !== null && val !== undefined && typeof val !== 'object')
                        .map(val => {
                        let str = String(val);
                        if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
                            const parts = val.split('T')[0].split('-');
                            if (parts.length === 3)
                                str += ` ${parts[2]}/${parts[1]}/${parts[0]}`;
                        }
                        return removeAccents(str.toLowerCase());
                    })
                        .join(' ');
                    return searchTerms.every(t => searchStr.includes(t));
                });
            }
            return sortStandardsByFefo(stds);
        });
        this.visibleAvailableStandards = computed(() => this.filteredAvailableStandards().slice(0, this.standardListLimit()));
        /** Danh sách cảnh báo FEFO cho các lô đã chọn không theo thứ tự tối ưu */
        this.fefoWarnings = computed(() => {
            const selected = this.selectedStandardsList();
            if (selected.length === 0)
                return [];
            const all = this._availableStandards();
            const warnings = [];
            for (const std of selected) {
                if (!isFefoCandidate(std))
                    continue;
                const priority = getFefoPriorityStandard(std, all);
                if (priority && priority.id !== std.id) {
                    warnings.push({
                        selectedId: std.id,
                        selectedLabel: std.internal_id || std.lot_number || std.name,
                        priorityLabel: priority.internal_id || priority.lot_number || priority.id,
                        priorityExpiry: priority.expiry_date || 'N/A'
                    });
                }
            }
            return warnings;
        });
        this.selectedStandardsList = computed(() => {
            const ids = this.selectedStandardIds();
            return this._availableStandards().filter(s => ids.has(s.id));
        });
        this.form = this.fb.group({
            purpose: ['', Validators.required]
        });
    }
    /** Kiểm tra lọ có phải lọ nên ưu tiên nhất trong danh sách cùng tên không */
    isFefoTopForName(std) {
        const all = this._availableStandards();
        const sameName = getSameStandardLots(std, all, true);
        return sameName.length > 1 && isFefoPriorityStandard(std, all);
    }
    isExpiringSoon(std) {
        if (!std.expiry_date)
            return false;
        const exp = parseStandardDate(std.expiry_date);
        if (exp === null)
            return false;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;
        return exp >= today && exp <= thirtyDays;
    }
    isLowStock(std) {
        return !this.isDepleted(std) && (std.current_amount || 0) / (std.initial_amount || 1) <= 0.2 && (std.initial_amount || 0) > 0;
    }
    setStandardSearchTerm(term) {
        this.standardSearchTerm.set(term);
        this.standardListLimit.set(this.standardListLimitStep);
    }
    loadMoreStandards() {
        this.standardListLimit.update(limit => limit + this.standardListLimitStep);
    }
    isDepleted(std) {
        return std.status === 'DEPLETED' || (std.current_amount ?? 0) <= 0;
    }
    isExpired(expiryDate) {
        return isStandardExpired(expiryDate);
    }
    isSelectable(std) {
        return isFefoCandidate(std);
    }
    unavailableReason(std) {
        return getFefoUnavailableReason(std) || 'Không khả dụng';
    }
    toggleStandardSelection(stdId) {
        const current = new Set(this.selectedStandardIds());
        if (current.has(stdId)) {
            current.delete(stdId);
        }
        else {
            current.add(stdId);
        }
        this.selectedStandardIds.set(current);
    }
    clearSelection() {
        this.selectedStandardIds.set(new Set());
    }
    onClose() {
        // Reset that internal view when closed
        this.form.reset();
        this.selectedStandardIds.set(new Set());
        this.standardSearchTerm.set('');
        this.standardListLimit.set(this.standardListLimitStep);
        this.close.emit();
    }
    onSubmit() {
        if (this.selectedStandardIds().size === 0 || this.isProcessing)
            return;
        const val = this.form.value;
        const selectableIds = Array.from(this.selectedStandardIds()).filter(id => {
            const std = this._availableStandards().find(item => item.id === id);
            return !!std && this.isSelectable(std);
        });
        if (selectableIds.length === 0)
            return;
        this.submitRequest.emit({
            standardIds: selectableIds,
            purpose: val.purpose?.trim() || 'Pha chuẩn mới'
        });
    }
    static { this.ɵfac = function CreateRequestDrawerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CreateRequestDrawerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CreateRequestDrawerComponent, selectors: [["app-create-request-drawer"]], inputs: { isOpen: "isOpen", isProcessing: "isProcessing", availableStandards: "availableStandards" }, outputs: { close: "close", submitRequest: "submitRequest", requestPurchase: "requestPurchase" }, decls: 1, vars: 1, consts: [["role", "dialog", "aria-modal", "true", "aria-labelledby", "create-standard-request-title", 1, "requests-modal-layer", "fixed", "inset-0", "z-[500]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], [1, "absolute", "inset-0", 3, "click"], [1, "relative", "bg-white", "dark:bg-slate-900", "rounded-3xl", "shadow-2xl", "w-full", "max-w-5xl", "flex", "flex-col", "md:flex-row", "overflow-y-auto", "md:overflow-hidden", "animate-slide-up", "max-h-[95vh]", "md:h-[85vh]", "border", "border-slate-100", "dark:border-slate-800"], [1, "w-full", "md:w-1/2", "h-[55vh]", "md:h-auto", "md:flex-1", "flex", "flex-col", "bg-slate-50", "dark:bg-slate-800/30", "border-b", "md:border-b-0", "md:border-r", "border-slate-100", "dark:border-slate-800", "shrink-0", "md:min-h-0"], [1, "p-6", "border-b", "border-slate-100", "dark:border-slate-800"], ["id", "create-standard-request-title", 1, "font-black", "text-slate-800", "dark:text-slate-100", "text-lg", "flex", "items-center", "gap-2", "mb-4"], [1, "fa-solid", "fa-flask-vial", "text-indigo-600"], [1, "relative"], [1, "fa-solid", "fa-search", "absolute", "left-4", "top-1/2", "-translate-y-1/2", "text-slate-400"], ["type", "text", "placeholder", "T\u00ECm theo t\u00EAn, lot, cas, m\u00E3...", 1, "w-full", "pl-11", "pr-4", "py-3", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "text-base", "font-medium", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:ring-4", "focus:ring-indigo-500/10", "focus:border-indigo-500", "transition-all", 3, "ngModelChange", "ngModel"], [1, "flex-1", "overflow-y-auto", "p-4", "custom-scrollbar"], [1, "py-20", "text-center", "flex", "flex-col", "items-center", "justify-center"], [1, "w-full", "md:w-1/2", "md:flex-1", "flex", "flex-col", "bg-white", "dark:bg-slate-900", "shrink-0", "md:min-h-0"], [1, "p-6", "flex", "justify-between", "items-center", "border-b", "border-slate-100", "dark:border-slate-800", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-100", "text-lg"], [1, "text-sm", "text-slate-500", "font-medium"], [1, "w-10", "h-10", "rounded-full", "hover:bg-slate-100", "dark:hover:bg-slate-800", "flex", "items-center", "justify-center", "text-slate-400", "transition", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "md:overflow-y-auto", "p-6", "md:p-8"], [1, "space-y-4", 3, "ngSubmit", "formGroup"], [1, "rounded-xl", "border", "border-indigo-100", "dark:border-indigo-800/30", "bg-white", "dark:bg-slate-800", "shadow-sm", "overflow-hidden", "flex", "flex-col"], [1, "bg-indigo-50", "dark:bg-indigo-900/20", "px-3", "py-2.5", "border-b", "border-indigo-100", "dark:border-indigo-800/30", "flex", "items-center", "justify-between", "shrink-0"], [1, "flex", "items-center", "gap-2"], [1, "w-6", "h-6", "rounded", "flex", "items-center", "justify-center", "text-indigo-600", "dark:text-indigo-400"], [1, "fa-solid", "fa-list-check", "text-xs"], [1, "text-sm", "font-black", "text-indigo-700", "dark:text-indigo-300", "uppercase", "tracking-wide"], ["type", "button", 1, "text-[11px]", "font-bold", "text-red-500", "hover:text-red-600", "uppercase", "transition", "disabled:opacity-30", "flex", "items-center", "gap-1", "bg-white/50", "dark:bg-slate-800/50", "px-2", "py-1", "rounded", 3, "click", "disabled"], [1, "fa-solid", "fa-trash-can"], [1, "bg-slate-50/50", "dark:bg-slate-900/30"], [1, "py-3", "px-4", "flex", "items-center", "gap-2", "text-slate-400", "dark:text-slate-500"], [1, "p-2.5", "max-h-[120px]", "overflow-y-auto", "custom-scrollbar", "flex", "flex-wrap", "gap-1.5"], [1, "rounded-xl", "border", "border-amber-200", "dark:border-amber-700/50", "bg-amber-50", "dark:bg-amber-900/20", "px-3.5", "py-3", "space-y-1.5"], [1, "space-y-4"], [1, "block", "text-sm", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider", "mb-2"], [1, "text-red-500"], ["formControlName", "purpose", "rows", "3", "placeholder", "VD: Pha chu\u1EA9n cho m\u00E1y HPLC-MS/MS...", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "text-base", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "focus:ring-4", "focus:ring-indigo-500/10", "transition-all", "outline-none", "resize-none", "placeholder-slate-300"], [1, "flex", "flex-wrap", "gap-2", "mt-2"], ["type", "button", 1, "px-3", "py-1", "bg-slate-100", "dark:bg-slate-800", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/40", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "hover:text-indigo-600", "rounded-lg", "transition", "border", "border-transparent", "hover:border-indigo-200", 3, "click"], [1, "p-6", "border-t", "border-slate-100", "dark:border-slate-800", "bg-slate-50/50", "dark:bg-slate-800/30", "shrink-0"], [1, "flex", "justify-end", "gap-3"], [1, "px-6", "py-3", "text-slate-500", "dark:text-slate-400", "font-bold", "text-base", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-2xl", "transition", 3, "click"], [1, "px-8", "py-3", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "font-bold", "text-base", "rounded-2xl", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "shadow-xl", "shadow-indigo-200", "dark:shadow-none", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", "active:scale-95", 3, "click", "disabled"], [1, "flex", "items-center", "justify-between", "gap-2", "px-1", "pb-2", "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "text-indigo-600", "dark:text-indigo-400"], [1, "space-y-2"], [1, "p-3", "border", "rounded-2xl", "transition-all", "duration-200", "flex", "items-start", "gap-3", "group", "relative", "overflow-hidden", 3, "ngClass"], ["type", "button", 1, "w-full", "rounded-2xl", "border", "border-dashed", "border-indigo-200", "dark:border-indigo-800", "bg-indigo-50/60", "dark:bg-indigo-900/20", "px-3", "py-3", "text-xs", "font-black", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/40", "transition"], [1, "py-12", "text-center"], [1, "p-3", "border", "rounded-2xl", "transition-all", "duration-200", "flex", "items-start", "gap-3", "group", "relative", "overflow-hidden", 3, "click", "ngClass"], [1, "absolute", "top-3", "right-3", "w-5", "h-5", "flex", "items-center", "justify-center", "bg-indigo-600", "text-white", "rounded-full", "shadow-sm", "animate-bounce-in", "z-20"], [1, "shrink-0", "w-10", "h-10", "rounded-xl", "flex", "items-center", "justify-center", "shadow-sm", "transition-all", "duration-300", "relative", "z-10", 3, "ngClass"], [1, "fa-solid", "fa-flask-vial", "text-base"], [1, "flex-1", "min-w-0", "relative", "z-10"], [1, "flex", "items-center", "justify-between", "gap-1", "mb-1", "pr-6"], [1, "font-black", "text-base", "truncate", "transition-colors", "text-slate-800", "dark:text-slate-100", "group-hover:text-indigo-600", "leading-tight", 3, "title"], [1, "shrink-0", "px-2", "py-0.5", "text-xs", "font-black", "rounded-md", "uppercase", "border", "border-indigo-200", "dark:border-indigo-700", "text-indigo-700", "dark:text-indigo-300", "bg-indigo-100", "dark:bg-indigo-900/40", "shadow-sm", "leading-none", "mt-0.5", "tracking-wide"], [1, "grid", "grid-cols-2", "gap-x-2", "gap-y-1", "text-xs"], [1, "flex", "items-center", "gap-1", "truncate", 3, "title"], [1, "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase"], [1, "font-medium", "text-slate-600", "dark:text-slate-300", "truncate"], [1, "flex", "items-center", "justify-between", "mt-2", "pt-2", "border-t", "border-slate-100", "dark:border-slate-800/50"], [1, "flex", "items-center", "gap-1.5", "flex-wrap"], [1, "text-[11px]", "font-bold", "flex", "items-center", "gap-1", 3, "ngClass"], [1, "fa-solid", "fa-check", "text-[11px]", "font-black"], [1, "px-1.5", "py-0.5", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "text-[11px]", "font-black", "rounded", "flex", "items-center", "gap-1", "border", "border-slate-200", "dark:border-slate-700"], [1, "fa-solid", "fa-ban", "text-red-400"], [1, "px-1.5", "py-0.5", "bg-amber-50", "dark:bg-amber-900/20", "text-amber-600", "dark:text-amber-400", "text-[11px]", "font-black", "rounded", "flex", "items-center", "gap-1", "border", "border-amber-200", "dark:border-amber-700/50", "hover:bg-amber-100", "dark:hover:bg-amber-900/40", "transition"], [1, "px-1.5", "py-0.5", "bg-amber-50", "dark:bg-amber-900/20", "text-amber-600", "dark:text-amber-400", "text-[11px]", "font-black", "rounded", "flex", "items-center", "gap-1", "border", "border-amber-200", "dark:border-amber-700/50", "hover:bg-amber-100", "dark:hover:bg-amber-900/40", "transition", 3, "click"], [1, "fa-solid", "fa-cart-plus"], [1, "text-sm", "font-black", "flex", "items-center", "gap-1", "text-emerald-600", "dark:text-emerald-400"], [1, "text-[11px]", "text-emerald-500", "uppercase"], [1, "px-1.5", "py-0.5", "rounded", "text-[10px]", "font-black", "bg-amber-100", "text-amber-700", "border", "border-amber-200", "dark:bg-amber-900/30", "dark:text-amber-400", "dark:border-amber-700/50", "whitespace-nowrap"], [1, "px-1.5", "py-0.5", "rounded", "text-[10px]", "font-black", "bg-orange-50", "text-orange-600", "border", "border-orange-200", "dark:bg-orange-900/20", "dark:text-orange-400", "whitespace-nowrap"], [1, "px-1.5", "py-0.5", "rounded", "text-[10px]", "font-black", "bg-rose-50", "text-rose-600", "border", "border-rose-200", "dark:bg-rose-900/20", "dark:text-rose-400", "whitespace-nowrap"], [1, "fa-solid", "fa-star", "text-[9px]"], [1, "fa-solid", "fa-triangle-exclamation", "text-[9px]"], [1, "fa-solid", "fa-droplet-slash", "text-[9px]"], [1, "fa-regular", "fa-calendar-xmark"], ["type", "button", 1, "w-full", "rounded-2xl", "border", "border-dashed", "border-indigo-200", "dark:border-indigo-800", "bg-indigo-50/60", "dark:bg-indigo-900/20", "px-3", "py-3", "text-xs", "font-black", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/40", "transition", 3, "click"], [1, "fa-solid", "fa-angles-down", "mr-1"], [1, "w-16", "h-16", "bg-slate-100", "dark:bg-slate-800", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "text-slate-400"], [1, "fa-solid", "fa-layer-group", "text-2xl"], [1, "text-slate-500", "dark:text-slate-400", "font-medium"], [1, "w-24", "h-24", "bg-indigo-50", "dark:bg-indigo-900/20", "rounded-[2.5rem]", "flex", "items-center", "justify-center", "mb-6", "text-indigo-300", "dark:text-indigo-700", "animate-pulse"], [1, "fa-solid", "fa-search", "text-4xl"], [1, "text-slate-800", "dark:text-slate-100", "font-black", "text-lg", "mb-2"], [1, "text-slate-500", "dark:text-slate-400", "text-base", "max-w-[250px]", "mx-auto", "font-medium"], [1, "fa-regular", "fa-hand-pointer", "text-sm"], [1, "text-xs", "font-medium", "italic"], [1, "animate-bounce-in", "flex", "items-center", "gap-1.5", "pl-2.5", "pr-1", "py-1", "rounded-lg", "bg-white", "dark:bg-slate-800", "border", "border-indigo-100", "dark:border-indigo-700/50", "shadow-sm", "shrink-0"], [1, "flex", "flex-col", "min-w-0"], [1, "text-xs", "font-bold", "text-indigo-700", "dark:text-indigo-300", "truncate", "max-w-[130px]", "leading-tight", 3, "title"], [1, "text-[10px]", "font-medium", "text-slate-400", "dark:text-slate-500", "truncate", "mt-px"], ["type", "button", 1, "shrink-0", "w-4", "h-4", "rounded-full", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-red-500", "hover:bg-red-50", "dark:hover:bg-red-900/30", "transition", "ml-0.5", 3, "click"], [1, "fa-solid", "fa-times", "text-[10px]"], [1, "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-triangle-exclamation", "text-amber-500", "text-xs"], [1, "text-[11px]", "font-black", "text-amber-700", "dark:text-amber-400", "uppercase", "tracking-wide"], [1, "text-[11px]", "text-amber-700", "dark:text-amber-400", "leading-relaxed"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-paper-plane", "text-sm"]], template: function CreateRequestDrawerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, CreateRequestDrawerComponent_Conditional_0_Template, 64, 9, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen ? 0 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe, FormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.NgModel, ReactiveFormsModule, i2.FormGroupDirective, i2.FormControlName], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CreateRequestDrawerComponent, [{
        type: Component,
        args: [{
                selector: 'app-create-request-drawer',
                standalone: true,
                imports: [CommonModule, FormsModule, ReactiveFormsModule],
                template: `
    <!-- REQUEST MODAL (Tạo yêu cầu mới - Drawer) -->
    @if (isOpen) {
        <div class="requests-modal-layer fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in" role="dialog" aria-modal="true" aria-labelledby="create-standard-request-title">
        <!-- Overlay click to close -->
        <div class="absolute inset-0" (click)="onClose()"></div>
        
        <div class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden animate-slide-up max-h-[95vh] md:h-[85vh] border border-slate-100 dark:border-slate-800">
            
            <!-- Left Column: Standards Selection -->
            <div class="w-full md:w-1/2 h-[55vh] md:h-auto md:flex-1 flex flex-col bg-slate-50 dark:bg-slate-800/30 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 shrink-0 md:min-h-0">
                <div class="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 id="create-standard-request-title" class="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2 mb-4">
                        <i class="fa-solid fa-flask-vial text-indigo-600"></i>
                        Chọn Chuẩn Đối Chiếu
                    </h3>
                    
                    <!-- Search Input -->
                    <div class="relative">
                        <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input type="text" [ngModel]="standardSearchTerm()" (ngModelChange)="setStandardSearchTerm($event)"
                                placeholder="Tìm theo tên, lot, cas, mã..." 
                                class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    @if (standardSearchTerm().length > 0) {
                        <div class="flex items-center justify-between gap-2 px-1 pb-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                            <span><strong class="text-indigo-600 dark:text-indigo-400">{{filteredAvailableStandards().length}}</strong> chuẩn phù hợp</span>
                            @if (selectedStandardIds().size > 0) {
                                <span class="text-indigo-600 dark:text-indigo-400">{{selectedStandardIds().size}} đã chọn</span>
                            }
                        </div>
                        <div class="space-y-2">
                            @for(std of visibleAvailableStandards(); track std.id) {
                                <div class="p-3 border rounded-2xl transition-all duration-200 flex items-start gap-3 group relative overflow-hidden"
                                        [ngClass]="{
                                        'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-400 dark:border-indigo-500 shadow-[0_0_0_1px_rgba(99,102,241,0.2)] dark:shadow-[0_0_0_1px_rgba(99,102,241,0.3)] z-10 cursor-pointer': selectedStandardIds().has(std.id) && isSelectable(std),
                                        'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 hover:shadow-md hover:shadow-indigo-100/30 dark:hover:shadow-none cursor-pointer bg-white dark:bg-slate-900': !selectedStandardIds().has(std.id) && isSelectable(std),
                                        'opacity-50 grayscale cursor-not-allowed border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50': !isSelectable(std)
                                        }"
                                        (click)="isSelectable(std) && toggleStandardSelection(std.id)">

                                    <!-- Selection Indicator Overlay -->
                                    @if(selectedStandardIds().has(std.id)) {
                                        <div class="absolute top-3 right-3 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-sm animate-bounce-in z-20">
                                            <i class="fa-solid fa-check text-[11px] font-black"></i>
                                        </div>
                                    }

                                    <!-- Standard Icon/Letter -->
                                    <div class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 relative z-10"
                                            [ngClass]="selectedStandardIds().has(std.id) ? 'bg-indigo-600 text-white border-none shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 rotate-12 scale-105' : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-500 group-hover:scale-105 group-hover:text-indigo-600'">
                                        <i class="fa-solid fa-flask-vial text-base"></i>
                                    </div>

                                    <div class="flex-1 min-w-0 relative z-10">
                                        <div class="flex items-center justify-between gap-1 mb-1 pr-6">
                                            <div class="font-black text-base truncate transition-colors text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 leading-tight" 
                                                    [title]="std.name">{{std.name}}</div>
                                            @if(std.internal_id) {
                                                <span class="shrink-0 px-2 py-0.5 text-xs font-black rounded-md uppercase border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 shadow-sm leading-none mt-0.5 tracking-wide">
                                                    {{std.internal_id}}
                                                </span>
                                            }
                                        </div>

                                        <!-- Detail Grid: Compact with all info -->
                                        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                                            <div class="flex items-center gap-1 truncate" [title]="std.product_code || 'N/A'">
                                                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase">Mã:</span>
                                                <span class="font-medium text-slate-600 dark:text-slate-300 truncate">{{std.product_code || 'N/A'}}</span>
                                            </div>
                                            <div class="flex items-center gap-1 truncate" [title]="std.lot_number || 'N/A'">
                                                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase">Lot:</span>
                                                <span class="font-medium text-slate-600 dark:text-slate-300 truncate">{{std.lot_number || 'N/A'}}</span>
                                            </div>
                                            <div class="flex items-center gap-1 truncate" [title]="std.cas_number || 'N/A'">
                                                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase">CAS:</span>
                                                <span class="font-medium text-slate-600 dark:text-slate-300 truncate">{{std.cas_number || 'N/A'}}</span>
                                            </div>
                                            <div class="flex items-center gap-1 truncate" [title]="std.manufacturer || 'N/A'">
                                                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase">Hãng:</span>
                                                <span class="font-medium text-slate-600 dark:text-slate-300 truncate">{{std.manufacturer || 'N/A'}}</span>
                                            </div>
                                        </div>

                                            <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                                 <div class="flex items-center gap-1.5 flex-wrap">
                                                     @if(!isSelectable(std)) {
                                                         <div class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-black rounded flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                                                             <i class="fa-solid fa-ban text-red-400"></i> {{unavailableReason(std)}}
                                                         </div>
                                                         @if(isDepleted(std)) {
                                                             <button (click)="$event.stopPropagation(); requestPurchase.emit(std)" class="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[11px] font-black rounded flex items-center gap-1 border border-amber-200 dark:border-amber-700/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition">
                                                                 <i class="fa-solid fa-cart-plus"></i> Đề Nghị Mua
                                                             </button>
                                                         }
                                                     } @else {
                                                         <div class="text-sm font-black flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                                              {{formatNum(std.current_amount)}} <span class="text-[11px] text-emerald-500 uppercase">{{std.unit}}</span>
                                                         </div>
                                                         @if(isFefoTopForName(std)) {
                                                             <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50 whitespace-nowrap">
                                                                 <i class="fa-solid fa-star text-[9px]"></i> Ưu tiên
                                                             </span>
                                                         }
                                                         @if(isExpiringSoon(std)) {
                                                             <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 whitespace-nowrap">
                                                                 <i class="fa-solid fa-triangle-exclamation text-[9px]"></i> Sắp HH
                                                             </span>
                                                         }
                                                         @if(isLowStock(std)) {
                                                             <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 whitespace-nowrap">
                                                                 <i class="fa-solid fa-droplet-slash text-[9px]"></i> Sắp hết
                                                             </span>
                                                         }
                                                     }
                                                 </div>
                                                 @if(std.expiry_date) {
                                                     <div class="text-[11px] font-bold flex items-center gap-1" 
                                                             [ngClass]="isExpired(std.expiry_date) ? 'text-red-500' : isExpiringSoon(std) ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'">
                                                         <i class="fa-regular fa-calendar-xmark"></i>
                                                         {{std.expiry_date | date:'dd/MM/yyyy'}}
                                                     </div>
                                                 }
                                             </div>
                                        </div>
                                    </div>
                            }
                            @if (filteredAvailableStandards().length > visibleAvailableStandards().length) {
                                <button type="button" (click)="loadMoreStandards()" class="w-full rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-900/20 px-3 py-3 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition">
                                    <i class="fa-solid fa-angles-down mr-1"></i>
                                    Xem thêm — còn {{filteredAvailableStandards().length - visibleAvailableStandards().length}} chuẩn
                                </button>
                            }
                            @if (filteredAvailableStandards().length === 0) {
                                <div class="py-12 text-center">
                                    <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <i class="fa-solid fa-layer-group text-2xl"></i>
                                    </div>
                                    <p class="text-slate-500 dark:text-slate-400 font-medium">Không tìm thấy chuẩn nào phù hợp</p>
                                </div>
                            }
                        </div>
                    } @else {
                        <div class="py-20 text-center flex flex-col items-center justify-center">
                            <div class="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] flex items-center justify-center mb-6 text-indigo-300 dark:text-indigo-700 animate-pulse">
                                <i class="fa-solid fa-search text-4xl"></i>
                            </div>
                            <h4 class="text-slate-800 dark:text-slate-100 font-black text-lg mb-2">Tìm Kiếm Chất Chuẩn</h4>
                            <p class="text-slate-500 dark:text-slate-400 text-base max-w-[250px] mx-auto font-medium">Nhập tên, số lô hoặc mã CAS để bắt đầu chọn chuẩn mượn.</p>
                        </div>
                    }
                </div>
            </div>

            <!-- Right Column: Form & Confirmation -->
            <div class="w-full md:w-1/2 md:flex-1 flex flex-col bg-white dark:bg-slate-900 shrink-0 md:min-h-0">
                <div class="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg">Hoàn Tất Yêu Cầu</h3>
                        <p class="text-sm text-slate-500 font-medium">Vui lòng cung cấp mục đích và thời gian dự kiến</p>
                    </div>
                    <button (click)="onClose()" class="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 md:overflow-y-auto p-6 md:p-8">
                    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
                        <!-- Compact Selected Standards Panel -->
                        <div class="rounded-xl border border-indigo-100 dark:border-indigo-800/30 bg-white dark:bg-slate-800 shadow-sm overflow-hidden flex flex-col">
                            <!-- Group Header -->
                            <div class="bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2.5 border-b border-indigo-100 dark:border-indigo-800/30 flex items-center justify-between shrink-0">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <i class="fa-solid fa-list-check text-xs"></i>
                                    </div>
                                    <div class="text-sm font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                                        {{selectedStandardIds().size}} chuẩn đã chọn
                                    </div>
                                </div>
                                <button type="button" (click)="clearSelection()" [disabled]="selectedStandardIds().size === 0" class="text-[11px] font-bold text-red-500 hover:text-red-600 uppercase transition disabled:opacity-30 flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded">
                                    <i class="fa-solid fa-trash-can"></i> Xóa Hết
                                </button>
                            </div>
                            <!-- Chip List -->
                            <div class="bg-slate-50/50 dark:bg-slate-900/30">
                                @if (selectedStandardsList().length === 0) {
                                    <div class="py-3 px-4 flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                        <i class="fa-regular fa-hand-pointer text-sm"></i>
                                        <span class="text-xs font-medium italic">Click chọn chuẩn ở danh sách bên trái.</span>
                                    </div>
                                } @else {
                                    <div class="p-2.5 max-h-[120px] overflow-y-auto custom-scrollbar flex flex-wrap gap-1.5">
                                        @for (std of selectedStandardsList(); track std.id) {
                                            <div class="animate-bounce-in flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-700/50 shadow-sm shrink-0">
                                                <div class="flex flex-col min-w-0">
                                                    <span class="text-xs font-bold text-indigo-700 dark:text-indigo-300 truncate max-w-[130px] leading-tight" [title]="std.name">{{std.name}}</span>
                                                    @if (std.internal_id || std.lot_number) {
                                                        <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate mt-px">
                                                            {{std.internal_id || ''}}{{std.internal_id && std.lot_number ? ' · ' : ''}}{{std.lot_number ? 'Lot ' + std.lot_number : ''}}
                                                        </span>
                                                    }
                                                </div>
                                                <button type="button" (click)="toggleStandardSelection(std.id)"
                                                        class="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition ml-0.5">
                                                    <i class="fa-solid fa-times text-[10px]"></i>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>

                        <!-- FEFO Warning: lô được chọn không phải ưu tiên đầu tiên -->
                        @if (fefoWarnings().length > 0) {
                            <div class="rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 px-3.5 py-3 space-y-1.5">
                                <div class="flex items-center gap-1.5">
                                    <i class="fa-solid fa-triangle-exclamation text-amber-500 text-xs"></i>
                                    <span class="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide">Gợi ý FEFO</span>
                                </div>
                                @for (warn of fefoWarnings(); track warn.selectedId) {
                                    <p class="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                                        Lô <strong>{{warn.selectedLabel}}</strong> — nên dùng lô
                                        <strong>{{warn.priorityLabel}}</strong>
                                        (hạn: {{warn.priorityExpiry}}) trước.
                                    </p>
                                }
                            </div>
                        }

                        <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                                    <textarea formControlName="purpose" rows="3" 
                                            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" 
                                            placeholder="VD: Pha chuẩn cho máy HPLC-MS/MS..."></textarea>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        <button type="button" (click)="form.patchValue({purpose: 'Pha chuẩn mới'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Pha Chuẩn Mới</button>
                                        <button type="button" (click)="form.patchValue({purpose: 'Kiểm tra định kỳ'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm Tra Định Kỳ</button>
                                        <button type="button" (click)="form.patchValue({purpose: 'Ngoại kiểm'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Ngoại Kiểm</button>
                                        <button type="button" (click)="form.patchValue({purpose: 'Nghiên cứu phát triển'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Nghiên Cứu Phát Triển</button>
                                        <button type="button" (click)="form.patchValue({purpose: 'Kiểm nghiệm mẫu'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm Nghiệm Mẫu</button>
                                    </div>
                                </div>

                        </div>
                    </form>
                </div>

                <!-- Actions attached to bottom -->
                <div class="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
                    <div class="flex justify-end gap-3">
                        <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-base hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition">Hủy Bỏ</button>
                        <button (click)="onSubmit()" [disabled]="selectedStandardIds().size === 0 || isProcessing" 
                                class="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-base rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2 active:scale-95">
                            @if(isProcessing) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý... } 
                            @else { <i class="fa-solid fa-paper-plane text-sm"></i> Gửi yêu cầu }
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    }
  `
            }]
    }], () => [], { isOpen: [{
            type: Input
        }], isProcessing: [{
            type: Input
        }], availableStandards: [{
            type: Input
        }], close: [{
            type: Output
        }], submitRequest: [{
            type: Output
        }], requestPurchase: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CreateRequestDrawerComponent, { className: "CreateRequestDrawerComponent", filePath: "src/app/features/standards/requests/components/create-request-drawer.component.ts", lineNumber: 295 }); })();
//# sourceMappingURL=create-request-drawer.component.js.map