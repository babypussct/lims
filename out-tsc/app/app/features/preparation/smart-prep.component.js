import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory/inventory.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { formatNum } from '../../shared/utils/utils';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = () => ["dilution", "spiking"];
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.val;
const _forTrack2 = ($index, $item) => $item.unit;
const _forTrack3 = ($index, $item) => $item.name;
function SmartPrepComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 12);
} }
function SmartPrepComponent_For_22_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 38);
    i0.ɵɵlistener("click", function SmartPrepComponent_For_22_Template_button_click_0_listener() { const m_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.setCalcMode(m_r2.id)); });
    i0.ɵɵelement(1, "i");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r2.calcMode() === m_r2.id ? m_r2.activeClass : "border-transparent text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", m_r2.icon, " text-sm mb-0.5");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", m_r2.label, " ");
} }
function SmartPrepComponent_Conditional_24_Conditional_4_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 45);
    i0.ɵɵelement(1, "i", 47);
    i0.ɵɵelementEnd();
} }
function SmartPrepComponent_Conditional_24_Conditional_4_Conditional_4_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 49);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_24_Conditional_4_Conditional_4_For_2_Template_div_click_0_listener() { const item_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.selectGlobalItem(item_r6)); });
    i0.ɵɵelementStart(1, "div", 50);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 51)(4, "span", 52);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 53);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r6.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r6.id);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(item_r6.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" T\u1ED3n: ", ctx_r2.formatNum(item_r6.stock), " ", item_r6.unit, " ");
} }
function SmartPrepComponent_Conditional_24_Conditional_4_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 46);
    i0.ɵɵrepeaterCreate(1, SmartPrepComponent_Conditional_24_Conditional_4_Conditional_4_For_2_Template, 8, 6, "div", 48, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.searchResults());
} }
function SmartPrepComponent_Conditional_24_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 41)(1, "input", 43);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_24_Conditional_4_Template_input_ngModelChange_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onSearch($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(2, "i", 44);
    i0.ɵɵtemplate(3, SmartPrepComponent_Conditional_24_Conditional_4_Conditional_3_Template, 2, 0, "div", 45)(4, SmartPrepComponent_Conditional_24_Conditional_4_Conditional_4_Template, 3, 0, "div", 46);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", ctx_r2.searchTerm());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.isSearching() ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.searchResults().length > 0 ? 4 : -1);
} }
function SmartPrepComponent_Conditional_24_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 42)(1, "div", 54);
    i0.ɵɵelement(2, "i", 55);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 56)(4, "div", 57);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 58)(7, "span", 59);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span");
    i0.ɵɵtext(10, "T\u1ED3n: ");
    i0.ɵɵelementStart(11, "b", 60);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(13, "button", 61);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_24_Conditional_5_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.clearSelection()); });
    i0.ɵɵelement(14, "i", 62);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate((tmp_2_0 = ctx_r2.selectedItem()) == null ? null : tmp_2_0.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((tmp_3_0 = ctx_r2.selectedItem()) == null ? null : tmp_3_0.id);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum((tmp_4_0 = ctx_r2.selectedItem()) == null ? null : tmp_4_0.stock), " ", (tmp_4_0 = ctx_r2.selectedItem()) == null ? null : tmp_4_0.unit, "");
} }
function SmartPrepComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18)(1, "label", 39);
    i0.ɵɵelement(2, "i", 40);
    i0.ɵɵtext(3, " Ch\u1ECDn h\u00F3a ch\u1EA5t t\u1EEB kho ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, SmartPrepComponent_Conditional_24_Conditional_4_Template, 5, 3, "div", 41)(5, SmartPrepComponent_Conditional_24_Conditional_5_Template, 15, 4, "div", 42);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(!ctx_r2.selectedItem() ? 4 : 5);
} }
function SmartPrepComponent_Conditional_25_For_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r9 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r9.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r9.label);
} }
function SmartPrepComponent_Conditional_25_For_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r10 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r10.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r10.label);
} }
function SmartPrepComponent_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 63)(1, "div", 64);
    i0.ɵɵelement(2, "i", 65);
    i0.ɵɵtext(3, " Th\u00F4ng s\u1ED1 Ch\u1EA5t tan");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 66)(5, "div", 67)(6, "div", 68)(7, "label", 69);
    i0.ɵɵtext(8, "Ph\u00E2n t\u1EED l\u01B0\u1EE3ng (MW)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 70)(10, "input", 71);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_25_Template_input_ngModelChange_10_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.mw, $event) || (ctx_r2.mw = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span", 72);
    i0.ɵɵtext(12, "g/mol");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "div", 68)(14, "label", 69);
    i0.ɵɵtext(15, "\u0110\u1ED9 tinh khi\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 70)(17, "input", 73);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_25_Template_input_ngModelChange_17_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.purity, $event) || (ctx_r2.purity = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span", 72);
    i0.ɵɵtext(19, "%");
    i0.ɵɵelementEnd()()()()()();
    i0.ɵɵelementStart(20, "div", 63)(21, "div", 64);
    i0.ɵɵelement(22, "i", 74);
    i0.ɵɵtext(23, " C\u00E2n th\u1EF1c t\u1EBF & \u0110\u1ECBnh m\u1EE9c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "div", 66)(25, "div", 68)(26, "label", 69);
    i0.ɵɵtext(27, "Kh\u1ED1i l\u01B0\u1EE3ng c\u00E2n th\u1EF1c t\u1EBF (m)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div", 75)(29, "input", 76);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_25_Template_input_ngModelChange_29_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.actualMass, $event) || (ctx_r2.actualMass = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_25_Template_select_ngModelChange_30_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.actualMassUnit, $event) || (ctx_r2.actualMassUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(31, SmartPrepComponent_Conditional_25_For_32_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(33, "div", 68)(34, "label", 69);
    i0.ɵɵtext(35, "Th\u1EC3 t\u00EDch \u0111\u1ECBnh m\u1EE9c (V)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div", 75)(37, "input", 79);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_25_Template_input_ngModelChange_37_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVol, $event) || (ctx_r2.targetVol = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_25_Template_select_ngModelChange_38_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVolUnit, $event) || (ctx_r2.targetVolUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(39, SmartPrepComponent_Conditional_25_For_40_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.mw);
    i0.ɵɵadvance(7);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.purity);
    i0.ɵɵadvance(12);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.actualMass);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.actualMassUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.massUnits);
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVol);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVolUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.volUnits);
} }
function SmartPrepComponent_Conditional_26_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r12 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r12.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r12.label);
} }
function SmartPrepComponent_Conditional_26_For_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r13 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r13.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r13.label);
} }
function SmartPrepComponent_Conditional_26_For_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r14 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r14.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r14.label);
} }
function SmartPrepComponent_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 19)(1, "div", 80);
    i0.ɵɵelement(2, "i", 55);
    i0.ɵɵtext(3, " Th\u00F4ng s\u1ED1 G\u1ED1c & \u0110\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 66)(5, "div", 68)(6, "label", 69);
    i0.ɵɵtext(7, "N\u1ED3ng \u0111\u1ED9 G\u1ED1c (Stock)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 75)(9, "input", 81);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_26_Template_input_ngModelChange_9_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.stockConc, $event) || (ctx_r2.stockConc = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_26_Template_select_ngModelChange_10_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.concUnit, $event) || (ctx_r2.concUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(11, SmartPrepComponent_Conditional_26_For_12_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "div", 68)(14, "label", 69);
    i0.ɵɵtext(15, "N\u1ED3ng \u0111\u1ED9 \u0111\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 75)(17, "input", 82);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_26_Template_input_ngModelChange_17_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetConc, $event) || (ctx_r2.targetConc = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_26_Template_select_ngModelChange_18_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetConcUnit, $event) || (ctx_r2.targetConcUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(19, SmartPrepComponent_Conditional_26_For_20_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "div", 68)(22, "label", 69);
    i0.ɵɵtext(23, "Th\u1EC3 t\u00EDch \u0110\u00EDch (V2)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "div", 75)(25, "input", 83);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_26_Template_input_ngModelChange_25_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVol, $event) || (ctx_r2.targetVol = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_26_Template_select_ngModelChange_26_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVolUnit, $event) || (ctx_r2.targetVolUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(27, SmartPrepComponent_Conditional_26_For_28_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(9);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.stockConc);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.concUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.concUnits);
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetConc);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetConcUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.concUnits);
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVol);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVolUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.volUnits);
} }
function SmartPrepComponent_Conditional_27_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r16 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r16.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r16.label);
} }
function SmartPrepComponent_Conditional_27_For_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r17 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r17.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r17.label);
} }
function SmartPrepComponent_Conditional_27_For_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r18 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r18.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r18.label);
} }
function SmartPrepComponent_Conditional_27_For_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r19 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r19.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r19.label);
} }
function SmartPrepComponent_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 20)(1, "div", 66)(2, "div", 68)(3, "label", 69);
    i0.ɵɵtext(4, "N\u1ED3ng \u0111\u1ED9 dung d\u1ECBch g\u1ED1c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 75)(6, "input", 84);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_27_Template_input_ngModelChange_6_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.stockConc, $event) || (ctx_r2.stockConc = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_27_Template_select_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.concUnit, $event) || (ctx_r2.concUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(8, SmartPrepComponent_Conditional_27_For_9_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(10, "div", 68)(11, "label", 69);
    i0.ɵɵtext(12, "N\u1ED3ng \u0111\u1ED9 Th\u00EAm (Added)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 75)(14, "input", 85);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_27_Template_input_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetConc, $event) || (ctx_r2.targetConc = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_27_Template_select_ngModelChange_15_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetConcUnit, $event) || (ctx_r2.targetConcUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(16, SmartPrepComponent_Conditional_27_For_17_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(18, "div", 68)(19, "label", 69);
    i0.ɵɵtext(20, "Kh\u1ED1i l\u01B0\u1EE3ng ho\u1EB7c th\u1EC3 t\u00EDch m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "div", 75)(22, "input", 86);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_27_Template_input_ngModelChange_22_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVol, $event) || (ctx_r2.targetVol = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_27_Template_select_ngModelChange_23_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVolUnit, $event) || (ctx_r2.targetVolUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementStart(24, "optgroup", 87);
    i0.ɵɵrepeaterCreate(25, SmartPrepComponent_Conditional_27_For_26_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "optgroup", 88);
    i0.ɵɵrepeaterCreate(28, SmartPrepComponent_Conditional_27_For_29_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.stockConc);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.concUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.concUnits);
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetConc);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetConcUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.concUnits);
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVol);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVolUnit);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.massUnits);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r2.volUnits);
} }
function SmartPrepComponent_Conditional_28_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r21 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r21.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r21.label);
} }
function SmartPrepComponent_Conditional_28_For_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r22 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r22.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r22.label);
} }
function SmartPrepComponent_Conditional_28_For_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r23 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r23.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r23.label);
} }
function SmartPrepComponent_Conditional_28_For_30_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 97)(1, "div", 98);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 99);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_28_For_30_Template_input_ngModelChange_3_listener($event) { const $index_r25 = i0.ɵɵrestoreView(_r24).$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.updateSerialPoint($index_r25, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 100);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 101);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_28_For_30_Template_button_click_6_listener() { const $index_r25 = i0.ɵɵrestoreView(_r24).$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.removeSerialPoint($index_r25)); });
    i0.ɵɵelement(7, "i", 62);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const pt_r26 = ctx.$implicit;
    const $index_r25 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate($index_r25 + 1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", pt_r26);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.targetConcUnit());
} }
function SmartPrepComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 21)(1, "div", 66)(2, "div", 68)(3, "label", 69);
    i0.ɵɵtext(4, "N\u1ED3ng \u0111\u1ED9 G\u1ED1c (Stock)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 75)(6, "input", 89);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_28_Template_input_ngModelChange_6_listener($event) { i0.ɵɵrestoreView(_r20); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.stockConc, $event) || (ctx_r2.stockConc = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_28_Template_select_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r20); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.concUnit, $event) || (ctx_r2.concUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(8, SmartPrepComponent_Conditional_28_For_9_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(10, "div", 68)(11, "label", 69);
    i0.ɵɵtext(12, "Th\u1EC3 t\u00EDch \u0111\u1ECBnh m\u1EE9c m\u1ED7i \u0111i\u1EC3m (V_point)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 75)(14, "input", 79);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_28_Template_input_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r20); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVol, $event) || (ctx_r2.targetVol = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_28_Template_select_ngModelChange_15_listener($event) { i0.ɵɵrestoreView(_r20); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVolUnit, $event) || (ctx_r2.targetVolUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(16, SmartPrepComponent_Conditional_28_For_17_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(18, "div", 90)(19, "div", 91)(20, "label", 92);
    i0.ɵɵtext(21, "C\u00E1c \u0111i\u1EC3m chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "div", 93)(23, "select", 94);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_28_Template_select_ngModelChange_23_listener($event) { i0.ɵɵrestoreView(_r20); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetConcUnit, $event) || (ctx_r2.targetConcUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(24, SmartPrepComponent_Conditional_28_For_25_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "button", 95);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_28_Template_button_click_26_listener() { i0.ɵɵrestoreView(_r20); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.addSerialPoint()); });
    i0.ɵɵtext(27, "+ Th\u00EAm \u0110i\u1EC3m");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(28, "div", 96);
    i0.ɵɵrepeaterCreate(29, SmartPrepComponent_Conditional_28_For_30_Template, 8, 3, "div", 97, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.stockConc);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.concUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.concUnits);
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVol);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVolUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.volUnits);
    i0.ɵɵadvance(7);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetConcUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.concUnits);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(ctx_r2.serialPoints());
} }
function SmartPrepComponent_Conditional_29_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r28 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r28.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r28.label);
} }
function SmartPrepComponent_Conditional_29_For_22_Conditional_4_Conditional_1_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r32 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 122);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_29_For_22_Conditional_4_Conditional_1_For_2_Template_div_click_0_listener() { const res_r33 = i0.ɵɵrestoreView(_r32).$implicit; const ɵ$index_409_r30 = i0.ɵɵnextContext(3).$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.selectMixItem(ɵ$index_409_r30, res_r33)); });
    i0.ɵɵelementStart(1, "div", 123);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 124);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const res_r33 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(res_r33.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("T\u1ED3n: ", res_r33.stock, " ", res_r33.unit, "");
} }
function SmartPrepComponent_Conditional_29_For_22_Conditional_4_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 120);
    i0.ɵɵrepeaterCreate(1, SmartPrepComponent_Conditional_29_For_22_Conditional_4_Conditional_1_For_2_Template, 5, 3, "div", 121, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.searchResults());
} }
function SmartPrepComponent_Conditional_29_For_22_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r31 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "input", 119);
    i0.ɵɵlistener("input", function SmartPrepComponent_Conditional_29_For_22_Conditional_4_Template_input_input_0_listener($event) { i0.ɵɵrestoreView(_r31); const ɵ$index_409_r30 = i0.ɵɵnextContext().$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onSearchMix(ɵ$index_409_r30, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(1, SmartPrepComponent_Conditional_29_For_22_Conditional_4_Conditional_1_Template, 3, 0, "div", 120);
} if (rf & 2) {
    const ɵ$index_409_r30 = i0.ɵɵnextContext().$index;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeMixSearchIndex() === ɵ$index_409_r30 && ctx_r2.searchResults().length > 0 ? 1 : -1);
} }
function SmartPrepComponent_Conditional_29_For_22_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r34 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 93)(1, "span", 125);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 126);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_29_For_22_Conditional_5_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r34); const ɵ$index_409_r30 = i0.ɵɵnextContext().$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.clearMixItem(ɵ$index_409_r30)); });
    i0.ɵɵelement(4, "i", 127);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const row_r35 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r35.invItem.name);
} }
function SmartPrepComponent_Conditional_29_For_22_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r36 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "input", 128);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_29_For_22_Conditional_6_Template_input_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r36); const ɵ$index_409_r30 = i0.ɵɵnextContext().$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.updateMixItem(ɵ$index_409_r30, "name", $event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r36 = i0.ɵɵnextContext();
    const row_r35 = ctx_r36.$implicit;
    const ɵ$index_409_r30 = ctx_r36.$index;
    i0.ɵɵpropertyInterpolate1("placeholder", "T\u00EAn ch\u1EA5t ", ɵ$index_409_r30 + 1, "");
    i0.ɵɵproperty("ngModel", row_r35.name);
} }
function SmartPrepComponent_Conditional_29_For_22_For_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 78);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r38 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r38.val);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r38.label);
} }
function SmartPrepComponent_Conditional_29_For_22_Template(rf, ctx) { if (rf & 1) {
    const _r29 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 108)(1, "button", 109);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_29_For_22_Template_button_click_1_listener() { const ɵ$index_409_r30 = i0.ɵɵrestoreView(_r29).$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.removeMixRow(ɵ$index_409_r30)); });
    i0.ɵɵelement(2, "i", 62);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 110);
    i0.ɵɵtemplate(4, SmartPrepComponent_Conditional_29_For_22_Conditional_4_Template, 2, 1)(5, SmartPrepComponent_Conditional_29_For_22_Conditional_5_Template, 5, 1, "div", 93)(6, SmartPrepComponent_Conditional_29_For_22_Conditional_6_Template, 1, 3, "input", 111);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 112)(8, "div")(9, "label", 113);
    i0.ɵɵtext(10, "N\u1ED3ng \u0111\u1ED9 Stock");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "input", 114);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_29_For_22_Template_input_ngModelChange_11_listener($event) { const ɵ$index_409_r30 = i0.ɵɵrestoreView(_r29).$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.updateMixItem(ɵ$index_409_r30, "stockConc", $event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 75)(13, "div", 115)(14, "label", 113);
    i0.ɵɵtext(15, "N\u1ED3ng \u0111\u1ED9 \u0110\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "input", 116);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_29_For_22_Template_input_ngModelChange_16_listener($event) { const ɵ$index_409_r30 = i0.ɵɵrestoreView(_r29).$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.updateMixItem(ɵ$index_409_r30, "targetConc", $event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 117)(18, "label", 113);
    i0.ɵɵtext(19, "\u0110\u01A1n v\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "select", 118);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_29_For_22_Template_select_ngModelChange_20_listener($event) { const ɵ$index_409_r30 = i0.ɵɵrestoreView(_r29).$index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.updateMixItem(ɵ$index_409_r30, "unit", $event)); });
    i0.ɵɵrepeaterCreate(21, SmartPrepComponent_Conditional_29_For_22_For_22_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const row_r35 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r2.systemMode() === "real" && !row_r35.invItem ? 4 : row_r35.invItem ? 5 : 6);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngModel", row_r35.stockConc);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", row_r35.targetConc);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", row_r35.unit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.concUnits);
} }
function SmartPrepComponent_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    const _r27 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 22)(1, "div", 66)(2, "div", 68)(3, "label", 69);
    i0.ɵɵtext(4, "T\u1ED5ng th\u1EC3 t\u00EDch h\u1ED7n h\u1EE3p (V_final)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 75)(6, "input", 102);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_29_Template_input_ngModelChange_6_listener($event) { i0.ɵɵrestoreView(_r27); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVol, $event) || (ctx_r2.targetVol = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "select", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_29_Template_select_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r27); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.targetVolUnit, $event) || (ctx_r2.targetVolUnit = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵrepeaterCreate(8, SmartPrepComponent_Conditional_29_For_9_Template, 2, 2, "option", 78, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(10, "div", 103)(11, "div", 104)(12, "label", 92);
    i0.ɵɵtext(13, "Th\u00E0nh ph\u1EA7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 75)(15, "button", 105);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_29_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r27); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.pasteFromExcel()); });
    i0.ɵɵelement(16, "i", 106);
    i0.ɵɵtext(17, " D\u00E1n t\u1EEB Excel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 107);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_29_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r27); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.addMixRow()); });
    i0.ɵɵtext(19, "+ Th\u00EAm Ch\u1EA5t");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(20, "div", 96);
    i0.ɵɵrepeaterCreate(21, SmartPrepComponent_Conditional_29_For_22_Template, 23, 4, "div", 108, _forTrack0);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVol);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.targetVolUnit);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.volUnits);
    i0.ɵɵadvance(13);
    i0.ɵɵrepeater(ctx_r2.mixItems());
} }
function SmartPrepComponent_Conditional_30_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 144);
    i0.ɵɵelement(1, "i", 155);
    i0.ɵɵtext(2, " > V1");
    i0.ɵɵelementEnd();
} }
function SmartPrepComponent_Conditional_30_Conditional_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 144);
    i0.ɵɵelement(1, "i", 155);
    i0.ɵɵtext(2, " > V2");
    i0.ɵɵelementEnd();
} }
function SmartPrepComponent_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    const _r39 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 23)(1, "div", 129)(2, "div", 130)(3, "span");
    i0.ɵɵelement(4, "i", 74);
    i0.ɵɵtext(5, " B\u01B0\u1EDBc 1: M\u1EABu v\u00E0 chi\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 131);
    i0.ɵɵtext(7, "Start");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 132)(9, "div")(10, "label", 113);
    i0.ɵɵtext(11, "Kh\u1ED1i l\u01B0\u1EE3ng m\u1EABu (m)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 41)(13, "input", 133);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_30_Template_input_ngModelChange_13_listener($event) { i0.ɵɵrestoreView(_r39); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.sampleMass, $event) || (ctx_r2.sampleMass = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "span", 134);
    i0.ɵɵtext(15, "g");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "div")(17, "label", 113);
    i0.ɵɵtext(18, "Dung m\u00F4i chi\u1EBFt (V1)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 41)(20, "input", 135);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_30_Template_input_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r39); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.extractVol, $event) || (ctx_r2.extractVol = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 134);
    i0.ɵɵtext(22, "mL");
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(23, "div", 136);
    i0.ɵɵelement(24, "i", 137);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "div", 138)(26, "div", 139);
    i0.ɵɵelement(27, "i", 140);
    i0.ɵɵtext(28, " B\u01B0\u1EDBc 2: L\u00E0m s\u1EA1ch ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div", 141)(30, "label", 113);
    i0.ɵɵtext(31, "H\u00FAt d\u1ECBch l\u00E0m s\u1EA1ch (V2)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 93)(33, "div", 142)(34, "input", 143);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_30_Template_input_ngModelChange_34_listener($event) { i0.ɵɵrestoreView(_r39); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.cleanupAliquot, $event) || (ctx_r2.cleanupAliquot = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "span", 134);
    i0.ɵɵtext(36, "mL");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(37, SmartPrepComponent_Conditional_30_Conditional_37_Template, 3, 0, "span", 144);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(38, "div", 136);
    i0.ɵɵelement(39, "i", 137);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "div", 145)(41, "div", 146);
    i0.ɵɵelement(42, "i", 147);
    i0.ɵɵtext(43, " B\u01B0\u1EDBc 3: L\u1EA5y ph\u1EA7n d\u1ECBch ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "div", 141)(45, "label", 113);
    i0.ɵɵtext(46, "H\u00FAt \u0111i c\u00F4 \u0111\u1EB7c (V3)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "div", 93)(48, "div", 142)(49, "input", 148);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_30_Template_input_ngModelChange_49_listener($event) { i0.ɵɵrestoreView(_r39); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.concAliquot, $event) || (ctx_r2.concAliquot = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "span", 134);
    i0.ɵɵtext(51, "mL");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(52, SmartPrepComponent_Conditional_30_Conditional_52_Template, 3, 0, "span", 144);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(53, "div", 136);
    i0.ɵɵelement(54, "i", 137);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "div", 149)(56, "div", 150)(57, "span");
    i0.ɵɵelement(58, "i", 55);
    i0.ɵɵtext(59, " B\u01B0\u1EDBc 4: \u0110\u1ECBnh m\u1EE9c cu\u1ED1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(60, "span", 151);
    i0.ɵɵtext(61, "End");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(62, "div", 132)(63, "div")(64, "label", 113);
    i0.ɵɵtext(65, "Th\u1EC3 t\u00EDch cu\u1ED1i (V4)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(66, "div", 41)(67, "input", 152);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_30_Template_input_ngModelChange_67_listener($event) { i0.ɵɵrestoreView(_r39); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.finalVol, $event) || (ctx_r2.finalVol = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(68, "span", 153);
    i0.ɵɵtext(69, "mL");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(70, "div")(71, "label", 113);
    i0.ɵɵtext(72, "Hi\u1EC7u su\u1EA5t (Recovery)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(73, "div", 41)(74, "input", 154);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_30_Template_input_ngModelChange_74_listener($event) { i0.ɵɵrestoreView(_r39); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.recovery, $event) || (ctx_r2.recovery = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(75, "span", 134);
    i0.ɵɵtext(76, "%");
    i0.ɵɵelementEnd()()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(13);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.sampleMass);
    i0.ɵɵadvance(7);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.extractVol);
    i0.ɵɵadvance(14);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.cleanupAliquot);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r2.cleanupAliquot() > ctx_r2.extractVol() ? 37 : -1);
    i0.ɵɵadvance(12);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.concAliquot);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r2.concAliquot() > ctx_r2.cleanupAliquot() ? 52 : -1);
    i0.ɵɵadvance(15);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.finalVol);
    i0.ɵɵadvance(7);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.recovery);
} }
function SmartPrepComponent_Conditional_37_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 160);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("C\u00F4 \u0111\u1EB7c ", ctx_r2.formatNum(1 / ctx_r2.samplePrepFactor()), "x");
} }
function SmartPrepComponent_Conditional_37_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 161);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Lo\u00E3ng ", ctx_r2.formatNum(ctx_r2.samplePrepFactor()), "x");
} }
function SmartPrepComponent_Conditional_37_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 172)(1, "span", 173);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \u0110\u00E3 b\u00F9 hi\u1EC7u su\u1EA5t ", ctx_r2.recovery(), "% ");
} }
function SmartPrepComponent_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    const _r40 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 29)(1, "div", 156)(2, "div", 157);
    i0.ɵɵtext(3, "H\u1EC7 s\u1ED1 pha lo\u00E3ng (f)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 158)(5, "h1", 159);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, SmartPrepComponent_Conditional_37_Conditional_7_Template, 2, 1, "span", 160)(8, SmartPrepComponent_Conditional_37_Conditional_8_Template, 2, 1, "span", 161);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 162);
    i0.ɵɵtext(10, " f = (V1 \u00D7 V4) / (m \u00D7 V3) ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 163)(12, "div", 164);
    i0.ɵɵelement(13, "i", 165);
    i0.ɵɵelementStart(14, "span", 166);
    i0.ɵɵtext(15, "T\u00EDnh n\u1ED3ng \u0111\u1ED9 m\u1EABu");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 2)(17, "div", 117)(18, "label", 167);
    i0.ɵɵtext(19, "K\u1EBFt qu\u1EA3 ch\u1EA1y m\u00E1y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "input", 168);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartPrepComponent_Conditional_37_Template_input_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r40); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.instConc, $event) || (ctx_r2.instConc = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 169);
    i0.ɵɵelement(22, "i", 170);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "div", 117)(24, "label", 167);
    i0.ɵɵtext(25, "K\u1EBFt qu\u1EA3 th\u1EF1c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "div", 171);
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(28, SmartPrepComponent_Conditional_37_Conditional_28_Template, 3, 1, "div", 172);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.formatNum(ctx_r2.samplePrepFactor()), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.samplePrepFactor() < 1 ? 7 : ctx_r2.samplePrepFactor() > 1 ? 8 : -1);
    i0.ɵɵadvance(13);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.instConc);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.formatNum(ctx_r2.sampleResult()), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.recovery() !== 100 ? 28 : -1);
} }
function SmartPrepComponent_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 157);
    i0.ɵɵtext(2, "Th\u1EC3 t\u00EDch c\u1EA7n h\u00FAt (Stock)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 158)(4, "h1", 174);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 175);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "p", 176);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.formatNum(ctx_r2.resultValue()), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.resultUnit());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.resultDescription(), " ");
} }
function SmartPrepComponent_Conditional_39_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 180)(1, "div", 181);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 182);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const alt_r41 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.formatNum(alt_r41.val));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(alt_r41.unit);
} }
function SmartPrepComponent_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 157);
    i0.ɵɵtext(2, "N\u1ED3ng \u0111\u1ED9 \u0111\u1EA1t \u0111\u01B0\u1EE3c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 158)(4, "h1", 177);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 178);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 179);
    i0.ɵɵrepeaterCreate(9, SmartPrepComponent_Conditional_39_For_10_Template, 5, 2, "div", 180, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.formatNum(ctx_r2.molarResult().val), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.molarResult().unit);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.molarResult().alternatives);
} }
function SmartPrepComponent_Conditional_40_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 189)(1, "td", 194);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 195);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 196);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const pt_r42 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", pt_r42.conc, " ", ctx_r2.targetConcUnit(), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum(pt_r42.vStock), " ", pt_r42.unit, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum(pt_r42.vSolvent), " ", ctx_r2.targetVolUnit(), "");
} }
function SmartPrepComponent_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 31)(1, "table", 183)(2, "thead", 184)(3, "tr")(4, "th", 185);
    i0.ɵɵtext(5, "\u0110i\u1EC3m chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th", 186);
    i0.ɵɵtext(7, "L\u01B0\u1EE3ng H\u00FAt (Stock)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th", 187);
    i0.ɵɵtext(9, "Th\u00EAm dung m\u00F4i");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(10, "tbody", 188);
    i0.ɵɵrepeaterCreate(11, SmartPrepComponent_Conditional_40_For_12_Template, 7, 6, "tr", 189, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementStart(13, "tr", 190)(14, "td", 191);
    i0.ɵɵtext(15, "T\u1ED4NG STOCK C\u1EA6N");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "td", 192);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(18, "td", 193);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵrepeater(ctx_r2.serialResult());
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum(ctx_r2.serialTotalStock()), " ", ((tmp_2_0 = ctx_r2.serialResult()[0]) == null ? null : tmp_2_0.unit) || "\u00B5L", "");
} }
function SmartPrepComponent_Conditional_41_For_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 204)(1, "td", 205);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 206);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const res_r43 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(res_r43.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum(res_r43.vStock), " ", res_r43.unit, "");
} }
function SmartPrepComponent_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 31)(1, "div", 197)(2, "span", 198);
    i0.ɵɵtext(3, "Dung m\u00F4i th\u00EAm v\u00E0o (QS):");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 199);
    i0.ɵɵtext(5);
    i0.ɵɵelementStart(6, "span", 200);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(8, "table", 183)(9, "thead", 201)(10, "tr")(11, "th", 202);
    i0.ɵɵtext(12, "Ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "th", 203);
    i0.ɵɵtext(14, "L\u01B0\u1EE3ng H\u00FAt");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(15, "tbody", 188);
    i0.ɵɵrepeaterCreate(16, SmartPrepComponent_Conditional_41_For_17_Template, 5, 3, "tr", 204, _forTrack3);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r2.formatNum(ctx_r2.mixResult().solventVol), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.targetVolUnit());
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r2.mixResult().details);
} }
function SmartPrepComponent_Conditional_42_Conditional_3_For_4_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 213);
    i0.ɵɵelement(1, "i", 215);
    i0.ɵɵtext(2, " \u0110\u1EE7");
    i0.ɵɵelementEnd();
} }
function SmartPrepComponent_Conditional_42_Conditional_3_For_4_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 214);
    i0.ɵɵelement(1, "i", 216);
    i0.ɵɵtext(2, " Thi\u1EBFu");
    i0.ɵɵelementEnd();
} }
function SmartPrepComponent_Conditional_42_Conditional_3_For_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 211)(1, "span", 212);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, SmartPrepComponent_Conditional_42_Conditional_3_For_4_Conditional_3_Template, 3, 0, "span", 213)(4, SmartPrepComponent_Conditional_42_Conditional_3_For_4_Conditional_4_Template, 3, 0, "span", 214);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const status_r44 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(status_r44.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(status_r44.ok ? 3 : 4);
} }
function SmartPrepComponent_Conditional_42_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 209);
    i0.ɵɵtext(1, "Tr\u1EA1ng th\u00E1i kho (H\u1ED7n h\u1EE3p)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 210);
    i0.ɵɵrepeaterCreate(3, SmartPrepComponent_Conditional_42_Conditional_3_For_4_Template, 5, 2, "div", 211, _forTrack3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r2.mixStockStatus());
} }
function SmartPrepComponent_Conditional_42_Conditional_4_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 219);
    i0.ɵɵelement(1, "i", 223);
    i0.ɵɵtext(2, " \u0110\u1EE7 h\u00E0ng");
    i0.ɵɵelementEnd();
} }
function SmartPrepComponent_Conditional_42_Conditional_4_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 220);
    i0.ɵɵelement(1, "i", 224);
    i0.ɵɵtext(2, " Thi\u1EBFu h\u00E0ng");
    i0.ɵɵelementEnd();
} }
function SmartPrepComponent_Conditional_42_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 217)(1, "div")(2, "div", 182);
    i0.ɵɵtext(3, "T\u1ED3n kho hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 218);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(6, SmartPrepComponent_Conditional_42_Conditional_4_Conditional_6_Template, 3, 0, "span", 219)(7, SmartPrepComponent_Conditional_42_Conditional_4_Conditional_7_Template, 3, 0, "span", 220);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 221);
    i0.ɵɵelement(9, "div", 222);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r2.formatNum(((tmp_2_0 = ctx_r2.selectedItem()) == null ? null : tmp_2_0.stock) || 0), " ", ((tmp_2_0 = ctx_r2.selectedItem()) == null ? null : tmp_2_0.unit) || "", "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.canFulfill() ? 6 : 7);
    i0.ɵɵadvance(3);
    i0.ɵɵstyleProp("width", ctx_r2.stockPercentage(), "%");
    i0.ɵɵclassProp("bg-emerald-500", ctx_r2.canFulfill())("bg-red-500", !ctx_r2.canFulfill());
} }
function SmartPrepComponent_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 32)(1, "div", 207);
    i0.ɵɵelement(2, "div", 208);
    i0.ɵɵtemplate(3, SmartPrepComponent_Conditional_42_Conditional_3_Template, 5, 0)(4, SmartPrepComponent_Conditional_42_Conditional_4_Template, 10, 9);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r2.calcMode() === "mix" ? 3 : 4);
} }
function SmartPrepComponent_Conditional_47_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 226);
    i0.ɵɵtext(1, " X\u1EED l\u00FD... ");
} }
function SmartPrepComponent_Conditional_47_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 227);
    i0.ɵɵtext(1, " X\u00E1c nh\u1EADn & Tr\u1EEB kho ");
} }
function SmartPrepComponent_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    const _r45 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 225);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_47_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r45); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.confirmTransaction()); });
    i0.ɵɵtemplate(1, SmartPrepComponent_Conditional_47_Conditional_1_Template, 2, 0)(2, SmartPrepComponent_Conditional_47_Conditional_2_Template, 2, 0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", !ctx_r2.canFulfill() || ctx_r2.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isProcessing() ? 1 : 2);
} }
function SmartPrepComponent_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    const _r46 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 37)(1, "div", 228)(2, "div", 229)(3, "h3", 230);
    i0.ɵɵelement(4, "i", 231);
    i0.ɵɵtext(5, " In Nh\u00E3n Nhanh ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 232);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_48_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r46); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.closeLabelModal()); });
    i0.ɵɵelement(7, "i", 62);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 233)(9, "div", 96)(10, "label", 234);
    i0.ɵɵtext(11, "N\u1ED9i dung nh\u00E3n (C\u00F3 th\u1EC3 s\u1EEDa)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "textarea", 235);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_48_Template_textarea_ngModelChange_12_listener($event) { i0.ɵɵrestoreView(_r46); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.labelData.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 236)(14, "div")(15, "label", 237);
    i0.ɵɵtext(16, "Kh\u1ED5 r\u1ED9ng (mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "input", 238);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_48_Template_input_ngModelChange_17_listener($event) { i0.ɵɵrestoreView(_r46); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.quickPrintWidth.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div")(19, "label", 237);
    i0.ɵɵtext(20, "Chi\u1EC1u d\u00E0i (mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "input", 238);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_48_Template_input_ngModelChange_21_listener($event) { i0.ɵɵrestoreView(_r46); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.quickPrintHeight.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div")(23, "label", 237);
    i0.ɵɵtext(24, "C\u1EE1 ch\u1EEF (pt)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "input", 238);
    i0.ɵɵlistener("ngModelChange", function SmartPrepComponent_Conditional_48_Template_input_ngModelChange_25_listener($event) { i0.ɵɵrestoreView(_r46); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.quickPrintFontSize.set($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(26, "div", 239);
    i0.ɵɵelement(27, "i", 240);
    i0.ɵɵelementStart(28, "div", 241)(29, "p", 242);
    i0.ɵɵtext(30, "M\u1EB9o in nhanh:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "p");
    i0.ɵɵtext(32, "B\u1EA1n c\u00F3 th\u1EC3 ch\u1EC9nh s\u1EEDa n\u1ED9i dung tr\u01B0\u1EDBc khi in. \u0110\u1EC3 c\u00E0i \u0111\u1EB7t kh\u1ED5 gi\u1EA5y ho\u1EB7c in h\u00E0ng lo\u1EA1t, vui l\u00F2ng truy c\u1EADp menu ");
    i0.ɵɵelementStart(33, "a", 243);
    i0.ɵɵtext(34, "In Tem & Nh\u00E3n");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(35, ".");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(36, "div", 244)(37, "button", 245);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_48_Template_button_click_37_listener() { i0.ɵɵrestoreView(_r46); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.closeLabelModal()); });
    i0.ɵɵtext(38, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "button", 246);
    i0.ɵɵlistener("click", function SmartPrepComponent_Conditional_48_Template_button_click_39_listener() { i0.ɵɵrestoreView(_r46); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.printQuickLabel()); });
    i0.ɵɵelement(40, "i", 247);
    i0.ɵɵtext(41, " In Ngay ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("ngModel", ctx_r2.labelData());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r2.quickPrintWidth());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.quickPrintHeight());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.quickPrintFontSize());
} }
// Unit Constants
const CONC_UNITS = [
    { val: 'M', factor: 1, label: 'M (Molar)' },
    { val: 'mM', factor: 0.001, label: 'mM' },
    { val: 'uM', factor: 0.000001, label: 'µM' },
    { val: '%', factor: 10, label: '%' },
    { val: 'mg/ml', factor: 1, label: 'mg/mL' },
    { val: 'ppm', factor: 0.001, label: 'ppm (mg/L)' },
    { val: 'ppb', factor: 0.000001, label: 'ppb (µg/L)' }
];
const VOL_UNITS = [
    { val: 'l', factor: 1, label: 'L' },
    { val: 'ml', factor: 0.001, label: 'mL' },
    { val: 'ul', factor: 0.000001, label: 'µL' }
];
const MASS_UNITS = [
    { val: 'g', factor: 1, label: 'g' },
    { val: 'mg', factor: 0.001, label: 'mg' },
    { val: 'kg', factor: 1000, label: 'kg' },
    { val: 'ug', factor: 0.000001, label: 'µg' }
];
export class SmartPrepComponent {
    constructor() {
        this.invService = inject(InventoryService);
        this.toast = inject(ToastService);
        this.confirmation = inject(ConfirmationService);
        this.auth = inject(AuthService);
        this.router = inject(Router);
        this.formatNum = formatNum;
        // --- CONFIG DATA ---
        this.concUnits = CONC_UNITS;
        this.volUnits = VOL_UNITS;
        this.massUnits = MASS_UNITS;
        this.modes = [
            { id: 'molar', label: 'Dung dịch mol từ chất rắn', icon: 'fa-weight-hanging', color: 'blue', activeClass: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-900/20' },
            { id: 'dilution', label: 'Pha loãng', icon: 'fa-droplet', color: 'orange', activeClass: 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/20 dark:bg-orange-900/20' },
            { id: 'spiking', label: 'Thêm chuẩn', icon: 'fa-syringe', color: 'emerald', activeClass: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-900/20' },
            { id: 'serial', label: 'Dãy chuẩn', icon: 'fa-arrow-down-wide-short', color: 'fuchsia', activeClass: 'border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/20 dark:bg-fuchsia-900/20' },
            { id: 'mix', label: 'Pha hỗn hợp', icon: 'fa-blender', color: 'indigo', activeClass: 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-900/20' },
            { id: 'sample_prep', label: 'Xử lý mẫu', icon: 'fa-vials', color: 'teal', activeClass: 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50/20 dark:bg-teal-900/20' }
        ];
        // --- STATE ---
        this.systemMode = signal('sandbox');
        this.calcMode = signal('molar');
        // Inputs
        this.mw = signal(0);
        this.purity = signal(100);
        this.actualMass = signal(10);
        this.actualMassUnit = signal('mg');
        this.stockConc = signal(1000);
        this.concUnit = signal('ppm');
        this.targetConc = signal(10);
        this.targetConcUnit = signal('ppm');
        this.targetVol = signal(10);
        this.targetVolUnit = signal('ml');
        // Sample Prep Inputs (New)
        this.sampleMass = signal(10);
        this.extractVol = signal(10);
        this.cleanupAliquot = signal(6); // V2
        this.concAliquot = signal(5); // V3
        this.finalVol = signal(1); // V4
        this.recovery = signal(100); // %
        this.instConc = signal(0); // Input for reverse calc
        // Serial List
        this.serialPoints = signal([0, 0, 0, 0, 0]); // Default 5 points
        // Mix List
        this.mixItems = signal([{ id: '1', name: '', stockConc: 0, targetConc: 0, unit: 'M', invItem: null }]);
        this.activeMixSearchIndex = signal(null);
        // Real Mode State
        this.searchTerm = signal('');
        this.isSearching = signal(false);
        this.searchResults = signal([]);
        this.selectedItem = signal(null);
        this.isProcessing = signal(false);
        this.searchSubject = new Subject();
        // --- CALCULATIONS ---
        this.molarResult = computed(() => {
            if (this.calcMode() !== 'molar')
                return { val: 0, unit: 'M', alternatives: [] };
            const m = this.actualMass();
            const mUnit = this.actualMassUnit();
            const v = this.targetVol();
            const vUnit = this.targetVolUnit();
            const MW = this.mw();
            const P = this.purity() || 100;
            if (m <= 0 || v <= 0)
                return { val: 0, unit: 'M', alternatives: [] };
            // Convert mass to grams
            const massG = m * this.getFactor(mUnit, 'mass') * (P / 100);
            // Convert vol to Liters
            const volL = v * this.getFactor(vUnit, 'vol');
            // Base conc: g/L (which is also mg/mL)
            const concGL = massG / volL;
            const alts = [
                { val: concGL * 1000, unit: 'ppm' },
                { val: concGL, unit: 'mg/mL' },
                { val: concGL / 10, unit: '%' }
            ];
            if (MW > 0) {
                const molar = concGL / MW; // mol/L = M
                return {
                    val: molar, unit: 'M',
                    alternatives: [
                        { val: molar * 1000, unit: 'mM' },
                        { val: molar * 1000000, unit: 'µM' },
                        ...alts
                    ]
                };
            }
            return {
                val: concGL * 1000, unit: 'ppm',
                alternatives: alts.filter(a => a.unit !== 'ppm')
            };
        });
        this.resultValue = computed(() => {
            const mode = this.calcMode();
            if (mode === 'molar')
                return this.actualMass(); // Just return input for stock deduction
            if (mode === 'dilution') {
                const c1 = this.stockConc() * this.getFactor(this.concUnit(), 'conc');
                const c2 = this.targetConc() * this.getFactor(this.targetConcUnit(), 'conc');
                if (c1 === 0)
                    return 0;
                // V1 = C2 * V2 / C1 (V1 will be in same unit as V2)
                const v1 = (c2 * this.targetVol()) / c1;
                // Auto convert to uL if < 1mL and unit is mL
                if (v1 < 1 && this.targetVolUnit() === 'ml') {
                    return v1 * 1000;
                }
                return v1;
            }
            if (mode === 'spiking') {
                const cStock = this.stockConc() * this.getFactor(this.concUnit(), 'conc');
                const cAdd = this.targetConc() * this.getFactor(this.targetConcUnit(), 'conc');
                if (cStock === 0)
                    return 0;
                // V_spike = V_sample * (C_add / C_stock)
                // Note: V_sample might be mass (g). We assume 1g ~ 1mL for simple spiking logic if density not provided.
                // Or we just treat the 'targetVol' input as the base unit for the calculation.
                const v1 = this.targetVol() * (cAdd / cStock);
                // Auto convert to uL if < 1mL
                const vUnit = this.targetVolUnit();
                if (v1 < 1 && (vUnit === 'ml' || vUnit === 'g')) {
                    return v1 * 1000;
                }
                return v1;
            }
            return 0;
        });
        this.resultUnit = computed(() => {
            const mode = this.calcMode();
            if (mode === 'molar')
                return this.actualMassUnit();
            if (mode === 'dilution') {
                const c1 = this.stockConc() * this.getFactor(this.concUnit(), 'conc');
                const c2 = this.targetConc() * this.getFactor(this.targetConcUnit(), 'conc');
                if (c1 === 0)
                    return this.targetVolUnit();
                const v1 = (c2 * this.targetVol()) / c1;
                if (v1 < 1 && this.targetVolUnit() === 'ml')
                    return 'ul';
                return this.targetVolUnit();
            }
            if (mode === 'spiking') {
                const cStock = this.stockConc() * this.getFactor(this.concUnit(), 'conc');
                const cAdd = this.targetConc() * this.getFactor(this.targetConcUnit(), 'conc');
                if (cStock === 0)
                    return this.targetVolUnit();
                const v1 = this.targetVol() * (cAdd / cStock);
                const vUnit = this.targetVolUnit();
                if (v1 < 1 && (vUnit === 'ml' || vUnit === 'g'))
                    return 'ul';
                return vUnit;
            }
            return '';
        });
        // --- SAMPLE PREP CALCULATIONS ---
        this.samplePrepFactor = computed(() => {
            const m = this.sampleMass();
            const V1 = this.extractVol();
            const V3 = this.concAliquot(); // Volume taken to concentrate
            const V4 = this.finalVol();
            if (m <= 0 || V3 <= 0)
                return 0;
            // Factor f = (V1 * V4) / (m * V3)
            // Logic verified: C_sample = C_inst * f
            return (V1 * V4) / (m * V3);
        });
        this.sampleResult = computed(() => {
            const inst = this.instConc();
            const f = this.samplePrepFactor();
            const R = this.recovery() || 100;
            // C_sample = C_inst * f * (100 / Recovery)
            if (R <= 0)
                return 0;
            return inst * f * (100 / R);
        });
        this.serialResult = computed(() => {
            if (this.calcMode() !== 'serial')
                return [];
            const C1 = this.stockConc() * this.getFactor(this.concUnit(), 'conc');
            const V2 = this.targetVol(); // Vol per point
            if (C1 <= 0 || V2 <= 0)
                return [];
            return this.serialPoints().map(C2_input => {
                if (!C2_input)
                    return { conc: 0, unit: 'ul', vStock: 0, vSolvent: 0 };
                const C2 = C2_input * this.getFactor(this.targetConcUnit(), 'conc');
                let v1 = (C2 * V2) / C1;
                let vUnit = this.targetVolUnit();
                if (v1 < 1 && this.targetVolUnit() === 'ml') {
                    v1 = v1 * 1000;
                    vUnit = 'ul';
                }
                // Calculate solvent in original target unit
                const v1_in_target_unit = (C2 * V2) / C1;
                const vSolvent = V2 - v1_in_target_unit;
                return { conc: C2_input, unit: vUnit, vStock: v1, vSolvent: vSolvent };
            });
        });
        this.serialTotalStock = computed(() => {
            // Return total in the unit of the first point for simplicity, or standardize to uL
            const res = this.serialResult();
            if (res.length === 0)
                return 0;
            return res.reduce((sum, p) => sum + p.vStock, 0);
        });
        this.mixResult = computed(() => {
            if (this.calcMode() !== 'mix')
                return { details: [], solventVol: 0 };
            const V_total = this.targetVol();
            if (V_total <= 0)
                return { details: [], solventVol: 0 };
            let totalStockVol = 0;
            const details = this.mixItems().map(item => {
                if (item.stockConc <= 0)
                    return { name: item.name || 'Unknown', vStock: 0, unit: this.targetVolUnit() };
                const c1 = item.stockConc * this.getFactor('ppm', 'conc'); // Assume mix stock is ppm for now, or add unit selector
                const c2 = item.targetConc * this.getFactor(item.unit, 'conc');
                let v1 = (c2 * V_total) / c1;
                totalStockVol += v1; // Keep track in targetVolUnit
                let vUnit = this.targetVolUnit();
                if (v1 < 1 && this.targetVolUnit() === 'ml') {
                    v1 = v1 * 1000;
                    vUnit = 'ul';
                }
                return { name: item.name || 'Unknown', vStock: v1, unit: vUnit };
            });
            return { details, solventVol: Math.max(0, V_total - totalStockVol) };
        });
        this.resultDescription = computed(() => {
            const val = this.resultValue();
            const unit = this.resultUnit();
            const mode = this.calcMode();
            if (mode === 'dilution') {
                const vTotal = this.targetVol();
                // If val is in uL but vTotal is in mL, need to convert for display
                const vTotalDisplay = vTotal;
                const vTotalUnit = this.targetVolUnit();
                return `Hút ${this.formatNum(val)} ${unit} dung dịch gốc. Định mức tới ${vTotalDisplay} ${vTotalUnit} bằng dung môi.`;
            }
            if (mode === 'spiking') {
                return `Hút ${this.formatNum(val)} ${unit} dung dịch chuẩn thêm vào mẫu.`;
            }
            return '';
        });
        // --- VALIDATION & CONFIRMATION ---
        this.stockPercentage = computed(() => {
            const item = this.selectedItem();
            if (!item || item.stock <= 0)
                return 0;
            let req = 0;
            if (this.calcMode() === 'serial') {
                // Serial uses uL internally for display, need to convert to targetVolUnit first, then to stock unit
                const totalStock_uL = this.serialTotalStock();
                const totalStock_TargetUnit = this.targetVolUnit() === 'ml' ? totalStock_uL / 1000 : totalStock_uL;
                req = this.normalizeToStockUnit(totalStock_TargetUnit, this.targetVolUnit(), item.unit);
            }
            else {
                req = this.normalizeToStockUnit(this.resultValue(), this.resultUnit(), item.unit);
            }
            return Math.min((req / item.stock) * 100, 100);
        });
        this.mixStockStatus = computed(() => {
            if (this.calcMode() !== 'mix')
                return [];
            const res = this.mixResult();
            return this.mixItems().map((item, idx) => {
                const required = res.details[idx]?.vStock || 0;
                if (!item.invItem)
                    return { name: item.name || `Chất ${idx + 1}`, ok: true };
                const normalizedReq = this.normalizeToStockUnit(required, this.targetVolUnit(), item.invItem.unit);
                return { name: item.name || `Chất ${idx + 1}`, ok: item.invItem.stock >= normalizedReq };
            });
        });
        this.canFulfill = computed(() => {
            if (this.systemMode() === 'sandbox')
                return true;
            if (this.calcMode() === 'mix')
                return this.mixStockStatus().every(s => s.ok);
            if (this.calcMode() === 'sample_prep')
                return true; // Sample prep doesn't deduct stock directly
            const item = this.selectedItem();
            if (!item)
                return false;
            let req = 0;
            if (this.calcMode() === 'serial') {
                const totalStock_uL = this.serialTotalStock();
                const totalStock_TargetUnit = this.targetVolUnit() === 'ml' ? totalStock_uL / 1000 : totalStock_uL;
                req = this.normalizeToStockUnit(totalStock_TargetUnit, this.targetVolUnit(), item.unit);
            }
            else {
                req = this.normalizeToStockUnit(this.resultValue(), this.resultUnit(), item.unit);
            }
            return item.stock >= req;
        });
        // --- LABEL PRINT MODAL STATE ---
        this.showLabelModal = signal(false);
        this.labelData = signal('');
        this.quickPrintWidth = signal(62);
        this.quickPrintHeight = signal(25);
        this.quickPrintFontSize = signal(12);
        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged((p, c) => p.term === c.term), switchMap(data => {
            if (!data.term.trim())
                return of([]);
            this.isSearching.set(true);
            return this.invService.getInventoryPage(10, null, 'all', data.term).then(res => {
                this.isSearching.set(false);
                return res.items;
            });
        })).subscribe(items => this.searchResults.set(items));
        effect(() => { if (this.systemMode() === 'sandbox')
            this.clearSelection(); });
    }
    setSystemMode(mode) {
        if (mode === 'real' && !this.auth.canEditInventory()) {
            this.toast.show('Cần quyền "Sửa Kho" · Liên hệ quản trị viên để được cấp', 'error');
            return;
        }
        this.systemMode.set(mode);
    }
    setCalcMode(mode) { this.calcMode.set(mode); }
    // --- ACTIONS ---
    onSearch(term) { this.searchTerm.set(term); this.searchSubject.next({ term }); }
    selectGlobalItem(item) { this.selectedItem.set(item); this.searchResults.set([]); this.searchTerm.set(''); }
    clearSelection() { this.selectedItem.set(null); this.searchResults.set([]); this.searchTerm.set(''); }
    // Mix
    onSearchMix(index, event) { this.activeMixSearchIndex.set(index); this.searchSubject.next({ term: event.target.value, index }); }
    selectMixItem(index, item) {
        this.mixItems.update(items => { const n = [...items]; n[index] = { ...n[index], name: item.name, invItem: item }; return n; });
        this.activeMixSearchIndex.set(null);
        this.searchResults.set([]);
    }
    addMixRow() { this.mixItems.update(i => [...i, { id: Date.now().toString(), name: '', stockConc: 0, targetConc: 0, unit: 'M', invItem: null }]); }
    removeMixRow(i) { this.mixItems.update(items => items.filter((_, idx) => idx !== i)); }
    clearMixItem(i) { this.mixItems.update(items => { const n = [...items]; n[i] = { ...n[i], name: '', invItem: null }; return n; }); }
    // Serial
    addSerialPoint() { this.serialPoints.update(p => [...p, 0]); }
    removeSerialPoint(i) { this.serialPoints.update(p => p.filter((_, idx) => idx !== i)); }
    async pasteFromExcel() {
        try {
            const text = await navigator.clipboard.readText();
            if (!text)
                return;
            const rows = text.split('\n').filter(r => r.trim() !== '');
            const newItems = [];
            rows.forEach((row, idx) => {
                const cols = row.split('\t');
                if (cols.length >= 2) {
                    newItems.push({
                        id: Date.now().toString() + idx,
                        name: cols[0].trim(),
                        stockConc: parseFloat(cols[1]) || 0,
                        targetConc: cols.length >= 3 ? (parseFloat(cols[2]) || 0) : 0,
                        unit: 'ppm', // Default
                        invItem: null
                    });
                }
            });
            if (newItems.length > 0) {
                this.mixItems.set(newItems);
                this.toast.show(`Đã import ${newItems.length} chất từ Clipboard`, 'success');
            }
            else {
                this.toast.show('Không tìm thấy dữ liệu hợp lệ. Hãy sao chép 3 cột: Tên | Nồng độ gốc | Nồng độ đích', 'error');
            }
        }
        catch (err) {
            this.toast.show('Lỗi đọc Clipboard. Hãy cấp quyền cho trình duyệt.', 'error');
        }
    }
    // --- HELPER FOR IMMUTABLE UPDATES ---
    updateSerialPoint(index, value) {
        this.serialPoints.update(points => {
            const newArr = [...points];
            newArr[index] = value;
            return newArr;
        });
    }
    updateMixItem(index, field, value) {
        this.mixItems.update(rows => {
            const newArr = [...rows];
            newArr[index] = { ...newArr[index], [field]: value };
            return newArr;
        });
    }
    // --- UNIT CONVERSION LOGIC ---
    getFactor(unit, type) {
        let list = [];
        if (type === 'conc')
            list = CONC_UNITS;
        else if (type === 'vol')
            list = VOL_UNITS;
        else
            list = MASS_UNITS;
        const found = list.find(u => u.val === unit);
        return found ? found.factor : 1;
    }
    // Helper to convert calculated amount to stock unit for accurate comparison/deduction
    normalizeToStockUnit(amount, fromUnit, toUnit) {
        if (!fromUnit || !toUnit || fromUnit === toUnit)
            return amount;
        const fromUnitLower = fromUnit.toLowerCase();
        const toUnitLower = toUnit.toLowerCase();
        // Mass conversion
        if (['g', 'mg', 'kg', 'ug'].includes(fromUnitLower) && ['g', 'mg', 'kg', 'ug'].includes(toUnitLower)) {
            const fromFactor = this.getFactor(fromUnitLower, 'mass');
            const toFactor = this.getFactor(toUnitLower, 'mass');
            return amount * (fromFactor / toFactor);
        }
        // Volume conversion
        if (['l', 'ml', 'ul'].includes(fromUnitLower) && ['l', 'ml', 'ul'].includes(toUnitLower)) {
            const fromFactor = this.getFactor(fromUnitLower, 'vol');
            const toFactor = this.getFactor(toUnitLower, 'vol');
            return amount * (fromFactor / toFactor);
        }
        // If units are incompatible (e.g. g to ml), return amount as is (assume user knows what they are doing or it's a 1:1 density assumption)
        return amount;
    }
    async confirmTransaction() {
        if (!this.auth.canEditInventory()) {
            this.toast.show('Truy cập bị từ chối.', 'error');
            return;
        }
        if (!this.canFulfill()) {
            this.toast.show('Kho không đủ hàng!', 'error');
            return;
        }
        if (await this.confirmation.confirm({ message: 'Xác nhận trừ kho theo tính toán?', confirmText: 'Xác nhận & Trừ kho' })) {
            this.isProcessing.set(true);
            try {
                if (this.calcMode() === 'mix') {
                    const details = this.mixResult().details;
                    for (let i = 0; i < this.mixItems().length; i++) {
                        const mItem = this.mixItems()[i];
                        const amount = details[i].vStock;
                        if (mItem.invItem && amount > 0) {
                            const normalizedAmount = this.normalizeToStockUnit(amount, this.targetVolUnit(), mItem.invItem.unit);
                            await this.invService.updateStock(mItem.invItem.id, mItem.invItem.stock, -normalizedAmount, 'Pha hỗn hợp tại trạm pha chế');
                        }
                    }
                }
                else if (this.calcMode() === 'serial') {
                    const item = this.selectedItem();
                    const totalStock_uL = this.serialTotalStock();
                    const totalStock_TargetUnit = this.targetVolUnit() === 'ml' ? totalStock_uL / 1000 : totalStock_uL;
                    const normalizedAmount = this.normalizeToStockUnit(totalStock_TargetUnit, this.targetVolUnit(), item.unit);
                    await this.invService.updateStock(item.id, item.stock, -normalizedAmount, `Trạm pha chế: Dãy chuẩn`);
                }
                else if (this.calcMode() !== 'sample_prep') {
                    const item = this.selectedItem();
                    const normalizedAmount = this.normalizeToStockUnit(this.resultValue(), this.resultUnit(), item.unit);
                    await this.invService.updateStock(item.id, item.stock, -normalizedAmount, `Trạm pha chế: ${this.calcMode()}`);
                }
                this.toast.show('Giao dịch thành công!', 'success');
                this.setSystemMode('sandbox');
            }
            catch (e) {
                this.toast.show('Lỗi: ' + e.message, 'error');
            }
            finally {
                this.isProcessing.set(false);
            }
        }
    }
    openLabelModal() {
        const mode = this.calcMode();
        let labelText = '';
        const dateStr = new Date().toISOString().split('T')[0];
        const user = this.auth.currentUser()?.displayName || 'User';
        if (mode === 'molar') {
            const item = this.selectedItem();
            const name = item ? item.name : 'Hóa chất';
            const conc = `${this.formatNum(this.molarResult().val)} ${this.molarResult().unit}`;
            labelText = `${name}\n${conc}\n${dateStr} - ${user}`;
        }
        else if (mode === 'dilution') {
            const item = this.selectedItem();
            const name = item ? item.name : 'Dung dịch';
            const conc = `${this.formatNum(this.targetConc())} ${this.targetConcUnit()}`;
            labelText = `${name}\n${conc}\n${dateStr} - ${user}`;
        }
        else if (mode === 'spiking') {
            labelText = `Mẫu thêm chuẩn\n+${this.formatNum(this.targetConc())} ${this.targetConcUnit()}\n${dateStr} - ${user}`;
        }
        else if (mode === 'serial') {
            const item = this.selectedItem();
            const name = item ? item.name : 'Chuẩn';
            const points = this.serialResult();
            labelText = points.map((p, i) => `STD ${i + 1}: ${name}\n${p.conc} ${this.targetConcUnit()}\n${dateStr} - ${user}`).join('\n\n');
        }
        else if (mode === 'mix') {
            labelText = `Hỗn hợp chuẩn\n${this.mixItems().length} thành phần\n${dateStr} - ${user}`;
        }
        else if (mode === 'sample_prep') {
            labelText = `Mẫu xử lý\nf = ${this.formatNum(this.samplePrepFactor())}\n${dateStr} - ${user}`;
        }
        this.labelData.set(labelText);
        this.showLabelModal.set(true);
    }
    closeLabelModal() {
        this.showLabelModal.set(false);
    }
    printQuickLabel() {
        const labels = this.labelData().split('\n\n').filter(l => l.trim() !== '');
        if (labels.length === 0)
            return;
        const w = this.quickPrintWidth();
        const h = this.quickPrintHeight();
        const fs = this.quickPrintFontSize();
        const css = `
        @page { size: ${w}mm ${h * labels.length}mm; margin: 0; }
        body { margin: 0; padding: 0; font-family: 'Roboto Mono', monospace; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        * { box-sizing: border-box; }
        .label-container {
            width: ${w}mm;
            height: ${h}mm;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px dashed #ccc;
            page-break-after: avoid;
            page-break-inside: avoid;
            overflow: hidden;
            position: relative;
        }
        .label-text {
            font-size: ${fs}pt;
            font-weight: bold;
            text-align: center;
            line-height: 1.2;
            word-break: break-all;
            padding: 1mm;
            width: 100%;
            white-space: pre-wrap;
        }
        @media print {
            @page { margin: 0; }
            .label-container { border-bottom: none; }
            body { margin: 0; }
        }
      `;
        let htmlContent = `<!DOCTYPE html><html><head><title>Quick Print</title><style>${css}</style></head><body>`;
        labels.forEach(label => {
            const safeLabel = document.createElement('div');
            safeLabel.textContent = label;
            htmlContent += `<div class="label-container"><div class="label-text">${safeLabel.innerHTML}</div></div>`;
        });
        htmlContent += `</body></html>`;
        // Print through a temporary same-page iframe. This avoids window.open,
        // so popup policies cannot block label printing.
        const printFrame = document.createElement('iframe');
        printFrame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
        printFrame.srcdoc = htmlContent;
        document.body.appendChild(printFrame);
        const cleanup = () => {
            if (document.body.contains(printFrame))
                document.body.removeChild(printFrame);
        };
        printFrame.onload = () => {
            const frameWindow = printFrame.contentWindow;
            if (!frameWindow) {
                cleanup();
                this.toast.show('Không thể khởi tạo nội dung in.', 'error');
                return;
            }
            frameWindow.onafterprint = cleanup;
            frameWindow.focus();
            frameWindow.print();
            setTimeout(cleanup, 60000);
        };
    }
    goToLabels() {
        this.openLabelModal();
    }
    static { this.ɵfac = function SmartPrepComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SmartPrepComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SmartPrepComponent, selectors: [["app-smart-prep"]], decls: 49, vars: 36, consts: [[1, "h-full", "flex", "flex-col", "fade-in", "pb-10", "font-sans", "text-slate-800", "dark:text-slate-200"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-4", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-650", "dark:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-indigo-100", "dark:border-indigo-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-flask-vial", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "bg-slate-100", "dark:bg-slate-900", "p-1", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700"], [1, "px-4", "py-2", "rounded-lg", "text-xs", "font-bold", "uppercase", "tracking-wide", "transition-all", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-calculator"], [1, "px-4", "py-2", "rounded-lg", "text-xs", "font-bold", "uppercase", "tracking-wide", "transition-all", "flex", "items-center", "gap-2", 3, "click", "title"], [1, "fa-solid", "fa-link"], [1, "fa-solid", "fa-lock", "text-[9px]"], [1, "flex-1", "flex", "flex-col", "xl:flex-row", "gap-6", "min-h-0", "relative", "z-10"], [1, "w-full", "xl:w-5/12", "bg-white", "dark:bg-slate-800", "rounded-3xl", "shadow-soft-xl", "dark:shadow-none", "border", "border-slate-100", "dark:border-slate-700", "flex", "flex-col", "overflow-hidden", "shrink-0"], [1, "flex", "border-b", "border-slate-100", "dark:border-slate-700", "overflow-x-auto", "custom-scrollbar", "md:no-scrollbar", "sticky", "top-0", "z-20", "bg-white", "dark:bg-slate-800"], [1, "flex-1", "min-w-[80px]", "py-4", "text-[10px]", "font-bold", "uppercase", "tracking-wider", "border-b-2", "transition", "hover:bg-slate-50", "dark:hover:bg-slate-700", "whitespace-nowrap", "flex", "flex-col", "items-center", "gap-1", 3, "class"], [1, "p-6", "flex-1", "overflow-y-auto", "custom-scrollbar", "space-y-6"], [1, "bg-purple-50", "dark:bg-purple-900/20", "p-4", "rounded-2xl", "border", "border-purple-100", "dark:border-purple-800/30", "space-y-2", "animate-slide-up", "relative"], [1, "card-input", "border-orange-100", "dark:border-orange-800/30"], [1, "card-input", "border-emerald-100", "dark:border-emerald-800/30"], [1, "card-input", "border-fuchsia-100", "dark:border-fuchsia-800/30"], [1, "card-input", "border-indigo-100", "dark:border-indigo-800/30"], [1, "space-y-3"], [1, "flex-1", "flex", "flex-col", "gap-6"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "shadow-soft-xl", "dark:shadow-none", "border", "border-slate-100", "dark:border-slate-700", "overflow-hidden", "relative", "flex-1", "flex", "flex-col", "min-h-[400px]"], [1, "absolute", "top-0", "left-0", "w-full", "h-1.5", "transition-colors", "duration-500"], [1, "p-6", "md:p-8", "flex", "flex-col", "flex-1", "overflow-y-auto", "custom-scrollbar"], [1, "text-xs", "font-bold", "uppercase", "tracking-widest", "text-slate-400", "mb-6", "text-center"], [1, "flex", "flex-col", "items-center", "justify-center", "h-full", "animate-scale-in"], [1, "text-center", "space-y-4", "animate-scale-in"], [1, "w-full", "animate-slide-up"], [1, "w-full", "max-w-sm", "mx-auto", "mt-auto", "pt-6"], [1, "p-4", "sm:p-5", "bg-white", "dark:bg-slate-900/80", "backdrop-blur-md", "border-t", "border-slate-200", "dark:border-slate-700", "flex", "flex-col", "sm:flex-row", "gap-3", "shrink-0", "sticky", "bottom-0", "z-30", "shadow-[0_-4px_15px_rgba(0,0,0,0.05)]", "dark:shadow-[0_-4px_15px_rgba(0,0,0,0.2)]"], [1, "w-full", "sm:flex-1", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-600", "text-slate-600", "dark:text-slate-300", "font-bold", "py-3.5", "rounded-xl", "shadow-sm", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition", "active:scale-95", "flex", "items-center", "justify-center", "gap-2", "text-sm", 3, "click"], [1, "fa-solid", "fa-print", "text-slate-400"], [1, "w-full", "sm:flex-[2]", "bg-gradient-to-r", "from-purple-600", "to-pink-600", "hover:from-purple-700", "hover:to-pink-700", "text-white", "font-bold", "py-3.5", "rounded-xl", "shadow-lg", "shadow-purple-200", "dark:shadow-none", "transition", "transform", "active:scale-95", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", "justify-center", "gap-2", "text-sm", 3, "disabled"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "animate-fade-in"], [1, "flex-1", "min-w-[80px]", "py-4", "text-[10px]", "font-bold", "uppercase", "tracking-wider", "border-b-2", "transition", "hover:bg-slate-50", "dark:hover:bg-slate-700", "whitespace-nowrap", "flex", "flex-col", "items-center", "gap-1", 3, "click"], [1, "text-[10px]", "font-bold", "text-purple-800", "dark:text-purple-300", "uppercase", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-search"], [1, "relative"], [1, "flex", "items-center", "gap-3", "bg-white", "dark:bg-slate-800", "px-4", "py-3", "rounded-xl", "border", "border-purple-200", "dark:border-purple-800/50", "shadow-sm"], ["placeholder", "Nh\u1EADp t\u00EAn, m\u00E3 s\u1ED1, ho\u1EB7c c\u00F4ng th\u1EE9c...", 1, "w-full", "pl-9", "pr-4", "py-3", "rounded-xl", "border-none", "ring-1", "ring-purple-200", "dark:ring-purple-700/50", "focus:ring-2", "focus:ring-purple-500", "bg-white", "dark:bg-slate-800", "outline-none", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "placeholder-purple-300", "dark:placeholder-purple-500/50", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "fa-solid", "fa-magnifying-glass", "absolute", "left-3", "top-3.5", "text-purple-300", "dark:text-purple-500/50"], [1, "absolute", "right-3", "top-3", "text-purple-500"], [1, "absolute", "top-full", "left-0", "w-full", "mt-1", "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-xl", "border", "border-slate-100", "dark:border-slate-700", "max-h-60", "overflow-y-auto", "z-50", "custom-scrollbar"], [1, "fa-solid", "fa-circle-notch", "fa-spin"], [1, "p-3", "hover:bg-purple-50", "dark:hover:bg-purple-900/30", "cursor-pointer", "border-b", "border-slate-50", "dark:border-slate-700/50", "last:border-0", "group", "transition"], [1, "p-3", "hover:bg-purple-50", "dark:hover:bg-purple-900/30", "cursor-pointer", "border-b", "border-slate-50", "dark:border-slate-700/50", "last:border-0", "group", "transition", 3, "click"], [1, "font-bold", "text-sm", "text-slate-700", "dark:text-slate-200", "group-hover:text-purple-700", "dark:group-hover:text-purple-400"], [1, "flex", "justify-between", "mt-1"], [1, "text-[10px]", "text-slate-400", "font-mono", "bg-slate-100", "dark:bg-slate-700", "px-1.5", "py-0.5", "rounded"], [1, "text-[10px]", "font-bold"], [1, "w-10", "h-10", "rounded-full", "bg-purple-100", "dark:bg-purple-900/50", "flex", "items-center", "justify-center", "text-purple-600", "dark:text-purple-400", "font-bold", "text-lg", "shrink-0"], [1, "fa-solid", "fa-flask"], [1, "flex-1", "min-w-0"], [1, "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "truncate"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "flex", "items-center", "gap-2"], [1, "bg-slate-100", "dark:bg-slate-700", "px-1.5", "rounded", "font-mono"], [1, "text-emerald-600", "dark:text-emerald-400"], [1, "w-8", "h-8", "rounded-full", "hover:bg-red-50", "dark:hover:bg-red-900/30", "text-slate-400", "hover:text-red-500", "dark:text-red-400", "dark:hover:text-red-400", "transition", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "fa-times"], [1, "card-input", "border-blue-100", "dark:border-blue-800/30"], [1, "card-header", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-700", "dark:text-blue-400"], [1, "fa-solid", "fa-weight-hanging"], [1, "p-4", "space-y-4"], [1, "grid", "grid-cols-2", "gap-4"], [1, "space-y-1"], [1, "label"], [1, "input-wrapper"], ["type", "number", "min", "0", "step", "any", "placeholder", "e.g. 58.44", 1, "input-field", "text-center", 3, "ngModelChange", "ngModel"], [1, "unit-badge"], ["type", "number", "min", "0", "step", "any", "placeholder", "100", 1, "input-field", "text-center", "text-blue-600", "font-bold", 3, "ngModelChange", "ngModel"], [1, "fa-solid", "fa-scale-balanced"], [1, "flex", "gap-2"], ["type", "number", "min", "0", "step", "any", "placeholder", "m", 1, "input-field", "flex-1", "font-bold", "text-blue-600", 3, "ngModelChange", "ngModel"], [1, "select-unit", "w-24", 3, "ngModelChange", "ngModel"], [3, "value"], ["type", "number", "min", "0", "step", "any", "placeholder", "V", 1, "input-field", "flex-1", 3, "ngModelChange", "ngModel"], [1, "card-header", "bg-orange-50", "dark:bg-orange-900/20", "text-orange-700", "dark:text-orange-400"], ["type", "number", "min", "0", "step", "any", "placeholder", "C1", 1, "input-field", "flex-1", "font-bold", "text-orange-600", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "any", "placeholder", "C2", 1, "input-field", "flex-1", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "any", "placeholder", "V2", 1, "input-field", "flex-1", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "any", "placeholder", "C_stock", 1, "input-field", "flex-1", "font-bold", "text-emerald-600", "dark:text-emerald-400", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "any", "placeholder", "C_add", 1, "input-field", "flex-1", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "any", "placeholder", "m/V", 1, "input-field", "flex-1", 3, "ngModelChange", "ngModel"], ["label", "Kh\u1ED1i l\u01B0\u1EE3ng"], ["label", "Th\u1EC3 t\u00EDch"], ["type", "number", "min", "0", "step", "any", "placeholder", "C1", 1, "input-field", "flex-1", "font-bold", "text-fuchsia-600", "dark:text-fuchsia-400", 3, "ngModelChange", "ngModel"], [1, "space-y-2", "pt-2", "border-t", "border-slate-100", "dark:border-slate-700"], [1, "flex", "justify-between", "items-center", "mb-1"], [1, "label", "mb-0"], [1, "flex", "items-center", "gap-2"], [1, "select-unit", "w-20", "h-6", "py-0", "text-[10px]", 3, "ngModelChange", "ngModel"], [1, "text-[10px]", "font-bold", "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "text-fuchsia-700", "dark:text-fuchsia-400", "px-2", "py-1", "rounded", "hover:bg-fuchsia-100", "dark:hover:bg-fuchsia-900/40", "transition", 3, "click"], [1, "space-y-2"], [1, "flex", "gap-2", "items-center", "animate-slide-up"], [1, "w-6", "h-6", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "flex", "items-center", "justify-center", "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400"], ["type", "number", "min", "0", "step", "any", "placeholder", "Conc", 1, "input-field", "py-1.5", "text-sm", 3, "ngModelChange", "ngModel"], [1, "text-xs", "font-bold", "text-slate-400", "w-8"], [1, "w-6", "h-6", "flex", "items-center", "justify-center", "text-slate-300", "dark:text-slate-400", "hover:text-red-500", "dark:hover:text-red-400", "rounded-full", "hover:bg-red-50", "dark:hover:bg-red-900/30", "transition", 3, "click"], ["type", "number", "min", "0", "step", "any", "placeholder", "100", 1, "input-field", "flex-1", "text-center", "font-black", "text-indigo-600", "dark:text-indigo-400", "text-lg", 3, "ngModelChange", "ngModel"], [1, "pt-2"], [1, "flex", "justify-between", "items-center", "mb-2"], [1, "text-[10px]", "font-bold", "text-emerald-600", "dark:text-emerald-400", "bg-emerald-50", "dark:bg-emerald-900/20", "hover:bg-emerald-100", "dark:hover:bg-emerald-900/40", "px-2", "py-1", "rounded", "transition", "border", "border-emerald-200", "dark:border-emerald-800/50", "flex", "items-center", "gap-1", 3, "click"], [1, "fa-solid", "fa-paste"], [1, "text-[10px]", "font-bold", "text-indigo-600", "dark:text-indigo-400", "bg-indigo-50", "dark:bg-indigo-900/20", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/40", "px-2", "py-1", "rounded", "transition", "border", "border-indigo-200", "dark:border-indigo-800/50", 3, "click"], [1, "bg-slate-50", "dark:bg-slate-900/50", "p-3", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "relative", "group", "transition", "hover:border-indigo-300", "hover:shadow-sm"], [1, "absolute", "top-1", "right-1", "w-6", "h-6", "flex", "items-center", "justify-center", "text-slate-300", "dark:text-slate-400", "hover:text-red-500", "dark:hover:text-red-400", "rounded-full", "hover:bg-white", "dark:hover:bg-slate-800", "transition", 3, "click"], [1, "mb-2", "pr-6", "relative"], [1, "w-full", "bg-transparent", "border-none", "p-0", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "placeholder-slate-400", "focus:ring-0", 3, "ngModel", "placeholder"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "gap-3", "mt-2", "border-t", "border-slate-100", "dark:border-slate-700", "pt-2"], [1, "text-[9px]", "font-bold", "text-slate-400", "uppercase", "mb-1", "block"], ["type", "number", "min", "0", "step", "any", "placeholder", "C_stock", 1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "text-center", "font-bold", "outline-none", "focus:border-indigo-400", 3, "ngModelChange", "ngModel"], [1, "flex-[2]"], ["type", "number", "min", "0", "step", "any", "placeholder", "C_target", 1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "text-center", "font-bold", "outline-none", "focus:border-indigo-400", 3, "ngModelChange", "ngModel"], [1, "flex-1"], [1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "py-2", "text-xs", "font-bold", "bg-white", "dark:bg-slate-800", "outline-none", "h-[38px]", 3, "ngModelChange", "ngModel"], ["placeholder", "T\u00ECm ch\u1EA5t trong kho...", 1, "w-full", "bg-transparent", "border-none", "p-0", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "placeholder-slate-400", "focus:ring-0", 3, "input"], [1, "absolute", "top-full", "left-0", "w-full", "z-20", "bg-white", "dark:bg-slate-800", "shadow-xl", "rounded-lg", "max-h-40", "overflow-y-auto", "mt-1", "border", "border-slate-100", "dark:border-slate-700"], [1, "p-2", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/40", "cursor-pointer", "text-xs", "border-b", "border-slate-50", "dark:border-slate-700/50"], [1, "p-2", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/40", "cursor-pointer", "text-xs", "border-b", "border-slate-50", "dark:border-slate-700/50", 3, "click"], [1, "font-bold", "truncate"], [1, "text-[9px]", "text-slate-400"], [1, "text-xs", "font-bold", "text-indigo-700", "dark:text-indigo-400", "truncate", "flex-1"], [1, "text-[10px]", "text-slate-400", "hover:text-red-500", "dark:text-red-400", 3, "click"], [1, "fa-solid", "fa-rotate-left"], [1, "w-full", "bg-transparent", "border-none", "p-0", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "placeholder-slate-400", "focus:ring-0", 3, "ngModelChange", "ngModel", "placeholder"], [1, "card-input", "border-teal-100", "dark:border-teal-800/30", "animate-slide-up"], [1, "px-4", "py-2", "bg-teal-50", "dark:bg-teal-900/20", "text-teal-700", "dark:text-teal-400", "text-xs", "font-bold", "uppercase", "flex", "justify-between", "items-center"], [1, "text-[9px]", "bg-white", "dark:bg-slate-800", "px-2", "rounded-full", "border", "border-teal-100", "dark:border-teal-800/30"], [1, "p-3", "grid", "grid-cols-2", "gap-3"], ["type", "number", "min", "0", "step", "any", "placeholder", "10", 1, "input-field", "pr-6", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-3", "top-2.5", "text-xs", "font-bold", "text-slate-400"], ["type", "number", "min", "0", "step", "any", "placeholder", "10", 1, "input-field", "pr-8", "text-teal-600", "font-bold", 3, "ngModelChange", "ngModel"], [1, "flex", "justify-center", "-my-1", "text-slate-300", "dark:text-slate-400", "relative", "z-0"], [1, "fa-solid", "fa-arrow-down"], [1, "card-input", "border-cyan-100", "dark:border-cyan-800/30", "animate-slide-up"], [1, "px-4", "py-2", "bg-cyan-50", "dark:bg-cyan-900/20", "text-cyan-700", "dark:text-cyan-400", "text-xs", "font-bold", "uppercase"], [1, "fa-solid", "fa-filter"], [1, "p-3"], [1, "relative", "flex-1"], ["type", "number", "min", "0", "step", "any", "placeholder", "6", 1, "input-field", "pr-8", 3, "ngModelChange", "ngModel"], [1, "text-red-500", "dark:text-red-400", "text-[10px]", "font-bold", "animate-pulse"], [1, "card-input", "border-sky-100", "dark:border-sky-800/30", "animate-slide-up"], [1, "px-4", "py-2", "bg-sky-50", "dark:bg-sky-900/20", "text-sky-700", "dark:text-sky-400", "text-xs", "font-bold", "uppercase"], [1, "fa-solid", "fa-vial"], ["type", "number", "min", "0", "step", "any", "placeholder", "5", 1, "input-field", "pr-8", "text-sky-600", "font-bold", 3, "ngModelChange", "ngModel"], [1, "card-input", "border-indigo-100", "dark:border-indigo-800/30", "animate-slide-up"], [1, "px-4", "py-2", "bg-indigo-50", "dark:bg-indigo-900/20", "text-indigo-700", "dark:text-indigo-400", "text-xs", "font-bold", "uppercase", "flex", "justify-between", "items-center"], [1, "text-[9px]", "bg-white", "dark:bg-slate-800", "px-2", "rounded-full", "border", "border-indigo-100", "dark:border-indigo-800/30"], ["type", "number", "min", "0", "step", "any", "placeholder", "1", 1, "input-field", "pr-8", "text-indigo-600", "dark:text-indigo-400", "font-black", "text-lg", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-3", "top-3", "text-xs", "font-bold", "text-slate-400"], ["type", "number", "min", "0", "step", "any", "placeholder", "100", 1, "input-field", "pr-8", 3, "ngModelChange", "ngModel"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "text-center", "mb-8"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-widest", "mb-2"], [1, "relative", "inline-block"], [1, "text-6xl", "md:text-8xl", "font-black", "tracking-tight", "text-teal-600", "tabular-nums"], [1, "absolute", "-right-16", "top-2", "bg-teal-100", "dark:bg-teal-900/40", "text-teal-700", "dark:text-teal-400", "text-[10px]", "font-bold", "px-2", "py-1", "rounded", "border", "border-teal-200", "dark:border-teal-800/50"], [1, "absolute", "-right-16", "top-2", "bg-orange-100", "dark:bg-orange-900/40", "text-orange-700", "dark:text-orange-400", "text-[10px]", "font-bold", "px-2", "py-1", "rounded", "border", "border-orange-200", "dark:border-orange-800/50"], [1, "text-[10px]", "font-mono", "text-slate-400", "mt-2", "bg-slate-50", "dark:bg-slate-900/50", "px-3", "py-1", "rounded-full", "inline-block", "border", "border-slate-200", "dark:border-slate-700"], [1, "w-full", "max-w-sm", "bg-slate-50", "dark:bg-slate-900/50", "rounded-2xl", "p-5", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm"], [1, "flex", "items-center", "gap-2", "mb-4", "justify-center"], [1, "fa-solid", "fa-calculator", "text-teal-500"], [1, "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "uppercase"], [1, "text-[9px]", "font-bold", "text-slate-400", "uppercase", "block", "mb-1"], ["type", "number", "min", "0", "step", "any", "placeholder", "C_inst", 1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "px-3", "py-2", "text-center", "font-bold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:border-teal-500", "transition", 3, "ngModelChange", "ngModel"], [1, "text-slate-300", "dark:text-slate-400", "text-lg", "pt-4"], [1, "fa-solid", "fa-arrow-right"], [1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-teal-200", "dark:border-teal-800/50", "rounded-xl", "px-3", "py-2", "text-center", "font-black", "text-teal-700", "dark:text-teal-400", "text-lg", "shadow-sm"], [1, "mt-3", "text-center"], [1, "text-[9px]", "font-bold", "text-orange-500", "bg-orange-50", "dark:bg-orange-900/20", "px-2", "py-1", "rounded", "border", "border-orange-100", "dark:border-orange-800/30"], [1, "text-6xl", "md:text-7xl", "font-black", "tracking-tight", "text-slate-800", "dark:text-slate-100", "tabular-nums"], [1, "absolute", "-right-10", "top-0", "text-lg", "font-bold", "text-slate-400"], [1, "text-sm", "font-medium", "text-slate-500", "dark:text-slate-400", "max-w-sm", "mx-auto", "leading-relaxed", "bg-slate-50", "dark:bg-slate-900/50", "p-4", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700"], [1, "text-6xl", "md:text-7xl", "font-black", "tracking-tight", "text-blue-600", "tabular-nums"], [1, "absolute", "-right-12", "top-0", "text-lg", "font-bold", "text-slate-400"], [1, "flex", "justify-center", "gap-4", "mt-6"], [1, "bg-slate-50", "dark:bg-slate-900/50", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "p-3", "min-w-[100px]"], [1, "text-lg", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase"], [1, "w-full", "text-sm", "text-left"], [1, "text-xs", "text-fuchsia-600", "dark:text-fuchsia-400", "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "uppercase", "font-bold"], [1, "px-4", "py-3", "rounded-l-lg"], [1, "px-4", "py-3", "text-right"], [1, "px-4", "py-3", "text-right", "rounded-r-lg"], [1, "divide-y", "divide-slate-100"], [1, "hover:bg-fuchsia-50", "dark:hover:bg-fuchsia-900/40", "transition"], [1, "bg-slate-50", "dark:bg-slate-900/50", "font-bold", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "px-4", "py-3", "text-slate-500", "dark:text-slate-400"], [1, "px-4", "py-3", "text-right", "text-fuchsia-700", "dark:text-fuchsia-400", "text-lg"], [1, "px-4", "py-3"], [1, "px-4", "py-3", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "px-4", "py-3", "text-right", "font-mono", "font-bold", "text-fuchsia-600", "dark:text-fuchsia-400"], [1, "px-4", "py-3", "text-right", "text-slate-500", "dark:text-slate-400"], [1, "mb-6", "text-center", "bg-indigo-50", "dark:bg-indigo-900/20", "p-4", "rounded-xl", "border", "border-indigo-100", "dark:border-indigo-800/30"], [1, "text-xs", "text-indigo-400", "uppercase", "font-bold"], [1, "text-3xl", "font-black", "text-indigo-700", "dark:text-indigo-400"], [1, "text-sm", "font-normal"], [1, "text-xs", "text-indigo-600", "dark:text-indigo-400", "bg-indigo-50", "dark:bg-indigo-900/20", "uppercase", "font-bold"], [1, "px-3", "py-2", "rounded-l-lg"], [1, "px-3", "py-2", "text-right", "rounded-r-lg"], [1, "hover:bg-indigo-50", "dark:hover:bg-indigo-900/40", "transition"], [1, "px-3", "py-2", "font-bold", "text-slate-700", "dark:text-slate-200", "truncate", "max-w-[150px]"], [1, "px-3", "py-2", "text-right", "font-mono", "font-bold", "text-indigo-600", "dark:text-indigo-400"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "p-4", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm", "relative", "overflow-hidden"], [1, "absolute", "left-0", "top-0", "bottom-0", "w-1", "bg-gradient-to-b", "from-purple-500", "to-pink-500"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase", "mb-2"], [1, "space-y-2", "max-h-32", "overflow-y-auto", "custom-scrollbar"], [1, "flex", "justify-between", "items-center", "text-xs"], [1, "truncate", "max-w-[150px]", "font-medium", "text-slate-700", "dark:text-slate-200"], [1, "text-emerald-600", "dark:text-emerald-400", "font-bold", "bg-emerald-50", "dark:bg-emerald-900/20", "px-2", "py-0.5", "rounded", "flex", "items-center", "gap-1"], [1, "text-red-600", "dark:text-red-400", "font-bold", "bg-red-50", "dark:bg-red-900/20", "px-2", "py-0.5", "rounded", "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-check"], [1, "fa-solid", "fa-xmark"], [1, "flex", "justify-between", "items-end", "mb-2"], [1, "text-sm", "font-bold", "text-slate-800", "dark:text-slate-100"], [1, "text-emerald-600", "dark:text-emerald-400", "text-xs", "font-bold", "bg-emerald-50", "dark:bg-emerald-900/20", "px-2", "py-1", "rounded"], [1, "text-red-600", "dark:text-red-400", "text-xs", "font-bold", "bg-red-50", "dark:bg-red-900/20", "px-2", "py-1", "rounded"], [1, "w-full", "bg-slate-100", "dark:bg-slate-800", "rounded-full", "h-1.5", "overflow-hidden"], [1, "h-full", "rounded-full", "transition-all", "duration-500"], [1, "fa-solid", "fa-check-circle"], [1, "fa-solid", "fa-circle-exclamation"], [1, "w-full", "sm:flex-[2]", "bg-gradient-to-r", "from-purple-600", "to-pink-600", "hover:from-purple-700", "hover:to-pink-700", "text-white", "font-bold", "py-3.5", "rounded-xl", "shadow-lg", "shadow-purple-200", "dark:shadow-none", "transition", "transform", "active:scale-95", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", "justify-center", "gap-2", "text-sm", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-boxes-packing"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-2xl", "w-full", "max-w-md", "overflow-hidden", "animate-scale-in"], [1, "p-4", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "justify-between", "items-center", "bg-slate-50", "dark:bg-slate-900/50"], [1, "font-bold", "text-slate-800", "dark:text-slate-100", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-print", "text-blue-500"], [1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-full", "hover:bg-slate-200", "dark:hover:bg-slate-700", "text-slate-500", "dark:text-slate-400", "transition", 3, "click"], [1, "p-6", "space-y-4"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase"], [1, "w-full", "h-32", "p-3", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-mono", "focus:border-blue-500", "focus:ring-1", "focus:ring-blue-500", "outline-none", "resize-none", "bg-slate-50", "dark:bg-slate-900/50", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-3", "gap-3"], [1, "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "block", "mb-1"], ["type", "number", 1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "py-1.5", "text-sm", "font-bold", "text-center", "outline-none", "focus:border-blue-500", 3, "ngModelChange", "ngModel"], [1, "bg-blue-50", "dark:bg-blue-900/20", "p-3", "rounded-xl", "border", "border-blue-100", "dark:border-blue-800/30", "flex", "items-start", "gap-3"], [1, "fa-solid", "fa-circle-info", "text-blue-500", "mt-0.5"], [1, "text-xs", "text-blue-800"], [1, "font-bold", "mb-1"], ["routerLink", "/labels", 1, "font-bold", "underline", "cursor-pointer"], [1, "p-4", "border-t", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/50", "flex", "gap-3", "justify-end"], [1, "px-4", "py-2", "rounded-xl", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-700", "transition", 3, "click"], [1, "px-6", "py-2", "rounded-xl", "font-bold", "text-white", "bg-blue-600", "hover:bg-blue-700", "shadow-md", "shadow-blue-200", "dark:shadow-none", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-print"]], template: function SmartPrepComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
            i0.ɵɵelement(4, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div")(6, "h2", 5);
            i0.ɵɵtext(7, "Tr\u1EA1m Pha Ch\u1EBF");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 6);
            i0.ɵɵtext(9, "T\u00EDnh to\u00E1n pha ch\u1EBF v\u00E0 c\u1EADp nh\u1EADt t\u1ED3n kho h\u00F3a ch\u1EA5t.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "div", 7)(11, "button", 8);
            i0.ɵɵlistener("click", function SmartPrepComponent_Template_button_click_11_listener() { return ctx.setSystemMode("sandbox"); });
            i0.ɵɵelement(12, "i", 9);
            i0.ɵɵtext(13, " T\u00EDnh Th\u1EED ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "button", 10);
            i0.ɵɵlistener("click", function SmartPrepComponent_Template_button_click_14_listener() { return ctx.setSystemMode("real"); });
            i0.ɵɵelement(15, "i", 11);
            i0.ɵɵtext(16, " D\u00F9ng t\u1ED3n kho ");
            i0.ɵɵtemplate(17, SmartPrepComponent_Conditional_17_Template, 1, 0, "i", 12);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(18, "div", 13)(19, "div", 14)(20, "div", 15);
            i0.ɵɵrepeaterCreate(21, SmartPrepComponent_For_22_Template, 3, 6, "button", 16, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "div", 17);
            i0.ɵɵtemplate(24, SmartPrepComponent_Conditional_24_Template, 6, 1, "div", 18)(25, SmartPrepComponent_Conditional_25_Template, 41, 6)(26, SmartPrepComponent_Conditional_26_Template, 29, 6, "div", 19)(27, SmartPrepComponent_Conditional_27_Template, 30, 6, "div", 20)(28, SmartPrepComponent_Conditional_28_Template, 31, 5, "div", 21)(29, SmartPrepComponent_Conditional_29_Template, 23, 2, "div", 22)(30, SmartPrepComponent_Conditional_30_Template, 77, 8, "div", 23);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "div", 24)(32, "div", 25);
            i0.ɵɵelement(33, "div", 26);
            i0.ɵɵelementStart(34, "div", 27)(35, "div", 28);
            i0.ɵɵtext(36, "K\u1EBFt qu\u1EA3 t\u00EDnh to\u00E1n");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(37, SmartPrepComponent_Conditional_37_Template, 29, 5, "div", 29)(38, SmartPrepComponent_Conditional_38_Template, 10, 3, "div", 30)(39, SmartPrepComponent_Conditional_39_Template, 11, 2, "div", 30)(40, SmartPrepComponent_Conditional_40_Template, 19, 2, "div", 31)(41, SmartPrepComponent_Conditional_41_Template, 18, 2, "div", 31)(42, SmartPrepComponent_Conditional_42_Template, 5, 1, "div", 32);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "div", 33)(44, "button", 34);
            i0.ɵɵlistener("click", function SmartPrepComponent_Template_button_click_44_listener() { return ctx.goToLabels(); });
            i0.ɵɵelement(45, "i", 35);
            i0.ɵɵtext(46, " In Nh\u00E3n ");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(47, SmartPrepComponent_Conditional_47_Template, 3, 2, "button", 36);
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(48, SmartPrepComponent_Conditional_48_Template, 42, 4, "div", 37);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(11);
            i0.ɵɵclassMap(ctx.systemMode() === "sandbox" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200");
            i0.ɵɵadvance(3);
            i0.ɵɵclassMap(ctx.systemMode() === "real" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200");
            i0.ɵɵclassProp("opacity-60", !ctx.auth.canEditInventory() && ctx.systemMode() !== "real");
            i0.ɵɵproperty("title", ctx.auth.canEditInventory() ? "D\u00F9ng t\u1ED3n kho th\u1EF1c t\u1EBF" : "C\u1EA7n quy\u1EC1n s\u1EEDa kho");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(!ctx.auth.canEditInventory() ? 17 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵrepeater(ctx.modes);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.systemMode() === "real" && ctx.calcMode() !== "mix" && ctx.calcMode() !== "sample_prep" ? 24 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.calcMode() === "molar" ? 25 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.calcMode() === "dilution" ? 26 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.calcMode() === "spiking" ? 27 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.calcMode() === "serial" ? 28 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.calcMode() === "mix" ? 29 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.calcMode() === "sample_prep" ? 30 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵclassProp("bg-blue-500", ctx.calcMode() === "molar")("bg-orange-500", ctx.calcMode() === "dilution")("bg-emerald-500", ctx.calcMode() === "spiking")("bg-fuchsia-500", ctx.calcMode() === "serial")("bg-indigo-500", ctx.calcMode() === "mix")("bg-teal-500", ctx.calcMode() === "sample_prep");
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.calcMode() === "sample_prep" ? 37 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(i0.ɵɵpureFunction0(35, _c0).includes(ctx.calcMode()) ? 38 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.calcMode() === "molar" ? 39 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.calcMode() === "serial" ? 40 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.calcMode() === "mix" ? 41 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.systemMode() === "real" && (ctx.selectedItem() || ctx.calcMode() === "serial" || ctx.calcMode() === "mix") ? 42 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.systemMode() === "real" ? 47 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showLabelModal() ? 48 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.MinValidator, i1.NgModel], styles: [".card-input[_ngcontent-%COMP%] { @apply bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm overflow-hidden; }\n    .card-header[_ngcontent-%COMP%] { @apply px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2; }\n    .label[_ngcontent-%COMP%] { @apply text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1 tracking-wide; }\n    .input-wrapper[_ngcontent-%COMP%] { @apply flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition overflow-hidden; }\n    .input-field[_ngcontent-%COMP%] { @apply w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition placeholder-slate-300 dark:placeholder-slate-600; }\n    .unit-badge[_ngcontent-%COMP%] { @apply pr-3 text-xs font-bold text-slate-400 select-none bg-transparent; }\n    .select-unit[_ngcontent-%COMP%] { @apply bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-blue-400 dark:focus:border-blue-500 cursor-pointer px-2; }\n    .no-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar { display: none; }\n    .no-scrollbar[_ngcontent-%COMP%] { -ms-overflow-style: none; scrollbar-width: none; }\n    @keyframes _ngcontent-%COMP%_scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }\n    .animate-scale-in[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SmartPrepComponent, [{
        type: Component,
        args: [{ selector: 'app-smart-prep', standalone: true, imports: [CommonModule, FormsModule], template: "    <div class=\"h-full flex flex-col fade-in pb-10 font-sans text-slate-800 dark:text-slate-200\">\r\n        \r\n        <!-- HEADER -->\r\n        <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0\">\r\n            <div class=\"flex items-center gap-3\">\r\n                <div class=\"w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-650 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 shadow-sm shrink-0\">\r\n                    <i class=\"fa-solid fa-flask-vial text-base\"></i>\r\n                </div>\r\n                <div>\r\n                    <h2 class=\"text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight\">Tr\u1EA1m Pha Ch\u1EBF</h2>\r\n                    <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">T\u00EDnh to\u00E1n pha ch\u1EBF v\u00E0 c\u1EADp nh\u1EADt t\u1ED3n kho h\u00F3a ch\u1EA5t.</p>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700\">\r\n                <button (click)=\"setSystemMode('sandbox')\" \r\n                        class=\"px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2\"\r\n                        [class]=\"systemMode() === 'sandbox' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'\">\r\n                    <i class=\"fa-solid fa-calculator\"></i> T\u00EDnh Th\u1EED\r\n                </button>\r\n                <button (click)=\"setSystemMode('real')\" \r\n                        class=\"px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2\"\r\n                        [class]=\"systemMode() === 'real' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'\"\r\n                        [class.opacity-60]=\"!auth.canEditInventory() && systemMode() !== 'real'\"\r\n                        [title]=\"auth.canEditInventory() ? 'D\u00F9ng t\u1ED3n kho th\u1EF1c t\u1EBF' : 'C\u1EA7n quy\u1EC1n s\u1EEDa kho'\">\r\n                    <i class=\"fa-solid fa-link\"></i> D\u00F9ng t\u1ED3n kho\r\n                    @if(!auth.canEditInventory()) { <i class=\"fa-solid fa-lock text-[9px]\"></i> }\r\n                </button>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"flex-1 flex flex-col xl:flex-row gap-6 min-h-0 relative z-10\">\r\n            \r\n            <!-- LEFT PANEL: CONFIG -->\r\n            <div class=\"w-full xl:w-5/12 bg-white dark:bg-slate-800 rounded-3xl shadow-soft-xl dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden shrink-0\">\r\n                \r\n                <!-- Mode Tabs -->\r\n                <div class=\"flex border-b border-slate-100 dark:border-slate-700 overflow-x-auto custom-scrollbar md:no-scrollbar sticky top-0 z-20 bg-white dark:bg-slate-800\">\r\n                    @for (m of modes; track m.id) {\r\n                        <button (click)=\"setCalcMode(m.id)\" \r\n                                class=\"flex-1 min-w-[80px] py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition hover:bg-slate-50 dark:hover:bg-slate-700 whitespace-nowrap flex flex-col items-center gap-1\"\r\n                                [class]=\"calcMode() === m.id ? m.activeClass : 'border-transparent text-slate-400'\">\r\n                            <i class=\"fa-solid {{m.icon}} text-sm mb-0.5\"></i> {{m.label}}\r\n                        </button>\r\n                    }\r\n                </div>\r\n\r\n                <div class=\"p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6\">\r\n                    \r\n                    <!-- CHEMICAL SELECTOR (Real Mode & Not Mix & Not Sample Prep) -->\r\n                    @if (systemMode() === 'real' && calcMode() !== 'mix' && calcMode() !== 'sample_prep') {\r\n                        <div class=\"bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800/30 space-y-2 animate-slide-up relative\">\r\n                            <label class=\"text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase flex items-center gap-2\">\r\n                                <i class=\"fa-solid fa-search\"></i> Ch\u1ECDn h\u00F3a ch\u1EA5t t\u1EEB kho\r\n                            </label>\r\n                            \r\n                            @if (!selectedItem()) {\r\n                                <div class=\"relative\">\r\n                                    <input [ngModel]=\"searchTerm()\" (ngModelChange)=\"onSearch($event)\" \r\n                                           placeholder=\"Nh\u1EADp t\u00EAn, m\u00E3 s\u1ED1, ho\u1EB7c c\u00F4ng th\u1EE9c...\" \r\n                                           class=\"w-full pl-9 pr-4 py-3 rounded-xl border-none ring-1 ring-purple-200 dark:ring-purple-700/50 focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-800 outline-none text-sm font-bold text-slate-700 dark:text-slate-200 placeholder-purple-300 dark:placeholder-purple-500/50 shadow-sm\">\r\n                                    <i class=\"fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-purple-300 dark:text-purple-500/50\"></i>\r\n                                    \r\n                                    @if (isSearching()) {\r\n                                        <div class=\"absolute right-3 top-3 text-purple-500\"><i class=\"fa-solid fa-circle-notch fa-spin\"></i></div>\r\n                                    }\r\n\r\n                                    <!-- Dropdown -->\r\n                                    @if (searchResults().length > 0) {\r\n                                        <div class=\"absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto z-50 custom-scrollbar\">\r\n                                            @for (item of searchResults(); track item.id) {\r\n                                                <div (click)=\"selectGlobalItem(item)\" class=\"p-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0 group transition\">\r\n                                                    <div class=\"font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400\">{{item.name}}</div>\r\n                                                    <div class=\"flex justify-between mt-1\">\r\n                                                        <span class=\"text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded\">{{item.id}}</span>\r\n                                                        <span class=\"text-[10px] font-bold\" [class]=\"item.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'\">\r\n                                                            T\u1ED3n: {{formatNum(item.stock)}} {{item.unit}}\r\n                                                        </span>\r\n                                                    </div>\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n                            } @else {\r\n                                <div class=\"flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-sm\">\r\n                                    <div class=\"w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg shrink-0\">\r\n                                        <i class=\"fa-solid fa-flask\"></i>\r\n                                    </div>\r\n                                    <div class=\"flex-1 min-w-0\">\r\n                                        <div class=\"text-sm font-bold text-slate-800 dark:text-slate-200 truncate\">{{selectedItem()?.name}}</div>\r\n                                        <div class=\"text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2\">\r\n                                            <span class=\"bg-slate-100 dark:bg-slate-700 px-1.5 rounded font-mono\">{{selectedItem()?.id}}</span>\r\n                                            <span>T\u1ED3n: <b class=\"text-emerald-600 dark:text-emerald-400\">{{formatNum(selectedItem()?.stock)}} {{selectedItem()?.unit}}</b></span>\r\n                                        </div>\r\n                                    </div>\r\n                                    <button (click)=\"clearSelection()\" class=\"w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 dark:text-red-400 dark:hover:text-red-400 transition flex items-center justify-center\">\r\n                                        <i class=\"fa-solid fa-times\"></i>\r\n                                    </button>\r\n                                </div>\r\n                            }\r\n                        </div>\r\n                    }\r\n\r\n                    <!-- 1. MOLAR (Pha r\u1EAFn) -->\r\n                    @if (calcMode() === 'molar') {\r\n                        <div class=\"card-input border-blue-100 dark:border-blue-800/30\">\r\n                            <div class=\"card-header bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400\"><i class=\"fa-solid fa-weight-hanging\"></i> Th\u00F4ng s\u1ED1 Ch\u1EA5t tan</div>\r\n                            <div class=\"p-4 space-y-4\">\r\n                                <div class=\"grid grid-cols-2 gap-4\">\r\n                                    <div class=\"space-y-1\">\r\n                                        <label class=\"label\">Ph\u00E2n t\u1EED l\u01B0\u1EE3ng (MW)</label>\r\n                                        <div class=\"input-wrapper\">\r\n                                            <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"mw\" class=\"input-field text-center\" placeholder=\"e.g. 58.44\">\r\n                                            <span class=\"unit-badge\">g/mol</span>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"space-y-1\">\r\n                                        <label class=\"label\">\u0110\u1ED9 tinh khi\u1EBFt</label>\r\n                                        <div class=\"input-wrapper\">\r\n                                            <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"purity\" class=\"input-field text-center text-blue-600 font-bold\" placeholder=\"100\">\r\n                                            <span class=\"unit-badge\">%</span>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"card-input border-blue-100 dark:border-blue-800/30\">\r\n                            <div class=\"card-header bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400\"><i class=\"fa-solid fa-scale-balanced\"></i> C\u00E2n th\u1EF1c t\u1EBF & \u0110\u1ECBnh m\u1EE9c</div>\r\n                            <div class=\"p-4 space-y-4\">\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">Kh\u1ED1i l\u01B0\u1EE3ng c\u00E2n th\u1EF1c t\u1EBF (m)</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"actualMass\" class=\"input-field flex-1 font-bold text-blue-600\" placeholder=\"m\">\r\n                                        <select [(ngModel)]=\"actualMassUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of massUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">Th\u1EC3 t\u00EDch \u0111\u1ECBnh m\u1EE9c (V)</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"targetVol\" class=\"input-field flex-1\" placeholder=\"V\">\r\n                                        <select [(ngModel)]=\"targetVolUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of volUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n\r\n                    <!-- 2. DILUTION (Pha lo\u00E3ng) -->\r\n                    @if (calcMode() === 'dilution') {\r\n                        <div class=\"card-input border-orange-100 dark:border-orange-800/30\">\r\n                            <div class=\"card-header bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400\"><i class=\"fa-solid fa-flask\"></i> Th\u00F4ng s\u1ED1 G\u1ED1c & \u0110\u00EDch</div>\r\n                            <div class=\"p-4 space-y-4\">\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">N\u1ED3ng \u0111\u1ED9 G\u1ED1c (Stock)</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"stockConc\" class=\"input-field flex-1 font-bold text-orange-600\" placeholder=\"C1\">\r\n                                        <select [(ngModel)]=\"concUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of concUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">N\u1ED3ng \u0111\u1ED9 \u0111\u00EDch</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"targetConc\" class=\"input-field flex-1\" placeholder=\"C2\">\r\n                                        <select [(ngModel)]=\"targetConcUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of concUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">Th\u1EC3 t\u00EDch \u0110\u00EDch (V2)</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"targetVol\" class=\"input-field flex-1\" placeholder=\"V2\">\r\n                                        <select [(ngModel)]=\"targetVolUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of volUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n\r\n                    <!-- 3. SPIKING -->\r\n                    @if (calcMode() === 'spiking') {\r\n                        <div class=\"card-input border-emerald-100 dark:border-emerald-800/30\">\r\n                            <div class=\"p-4 space-y-4\">\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">N\u1ED3ng \u0111\u1ED9 dung d\u1ECBch g\u1ED1c</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"stockConc\" class=\"input-field flex-1 font-bold text-emerald-600 dark:text-emerald-400\" placeholder=\"C_stock\">\r\n                                        <select [(ngModel)]=\"concUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of concUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">N\u1ED3ng \u0111\u1ED9 Th\u00EAm (Added)</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"targetConc\" class=\"input-field flex-1\" placeholder=\"C_add\">\r\n                                        <select [(ngModel)]=\"targetConcUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of concUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">Kh\u1ED1i l\u01B0\u1EE3ng ho\u1EB7c th\u1EC3 t\u00EDch m\u1EABu</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"targetVol\" class=\"input-field flex-1\" placeholder=\"m/V\">\r\n                                        <select [(ngModel)]=\"targetVolUnit\" class=\"select-unit w-24\">\r\n                                            <optgroup label=\"Kh\u1ED1i l\u01B0\u1EE3ng\">\r\n                                                @for(u of massUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                            </optgroup>\r\n                                            <optgroup label=\"Th\u1EC3 t\u00EDch\">\r\n                                                @for(u of volUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                            </optgroup>\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n\r\n                    <!-- 4. SERIAL DILUTION (Updated UI) -->\r\n                    @if (calcMode() === 'serial') {\r\n                        <div class=\"card-input border-fuchsia-100 dark:border-fuchsia-800/30\">\r\n                            <div class=\"p-4 space-y-4\">\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">N\u1ED3ng \u0111\u1ED9 G\u1ED1c (Stock)</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"stockConc\" class=\"input-field flex-1 font-bold text-fuchsia-600 dark:text-fuchsia-400\" placeholder=\"C1\">\r\n                                        <select [(ngModel)]=\"concUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of concUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">Th\u1EC3 t\u00EDch \u0111\u1ECBnh m\u1EE9c m\u1ED7i \u0111i\u1EC3m (V_point)</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"targetVol\" class=\"input-field flex-1\" placeholder=\"V\">\r\n                                        <select [(ngModel)]=\"targetVolUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of volUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                \r\n                                <!-- Dynamic List for Points -->\r\n                                <div class=\"space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700\">\r\n                                    <div class=\"flex justify-between items-center mb-1\">\r\n                                        <label class=\"label mb-0\">C\u00E1c \u0111i\u1EC3m chu\u1EA9n</label>\r\n                                        <div class=\"flex items-center gap-2\">\r\n                                            <select [(ngModel)]=\"targetConcUnit\" class=\"select-unit w-20 h-6 py-0 text-[10px]\">\r\n                                                @for(u of concUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                            </select>\r\n                                            <button (click)=\"addSerialPoint()\" class=\"text-[10px] font-bold bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 px-2 py-1 rounded hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/40 transition\">+ Th\u00EAm \u0110i\u1EC3m</button>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"space-y-2\">\r\n                                        <!-- FIX: Iterate over signal value and use update helper -->\r\n                                        @for (pt of serialPoints(); track $index) {\r\n                                            <div class=\"flex gap-2 items-center animate-slide-up\">\r\n                                                <div class=\"w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400\">{{$index + 1}}</div>\r\n                                                <input type=\"number\" min=\"0\" step=\"any\" \r\n                                                       [ngModel]=\"pt\" \r\n                                                       (ngModelChange)=\"updateSerialPoint($index, $event)\"\r\n                                                       class=\"input-field py-1.5 text-sm\" \r\n                                                       placeholder=\"Conc\">\r\n                                                <div class=\"text-xs font-bold text-slate-400 w-8\">{{targetConcUnit()}}</div>\r\n                                                <button (click)=\"removeSerialPoint($index)\" class=\"w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition\"><i class=\"fa-solid fa-times\"></i></button>\r\n                                            </div>\r\n                                        }\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n\r\n                    <!-- 5. MIXER (Table UI) -->\r\n                    @if (calcMode() === 'mix') {\r\n                        <div class=\"card-input border-indigo-100 dark:border-indigo-800/30\">\r\n                            <div class=\"p-4 space-y-4\">\r\n                                <div class=\"space-y-1\">\r\n                                    <label class=\"label\">T\u1ED5ng th\u1EC3 t\u00EDch h\u1ED7n h\u1EE3p (V_final)</label>\r\n                                    <div class=\"flex gap-2\">\r\n                                        <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"targetVol\" class=\"input-field flex-1 text-center font-black text-indigo-600 dark:text-indigo-400 text-lg\" placeholder=\"100\">\r\n                                        <select [(ngModel)]=\"targetVolUnit\" class=\"select-unit w-24\">\r\n                                            @for(u of volUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                \r\n                                <!-- Mix Table -->\r\n                                <div class=\"pt-2\">\r\n                                    <div class=\"flex justify-between items-center mb-2\">\r\n                                        <label class=\"label mb-0\">Th\u00E0nh ph\u1EA7n</label>\r\n                                        <div class=\"flex gap-2\">\r\n                                            <button (click)=\"pasteFromExcel()\" class=\"text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-2 py-1 rounded transition border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1\"><i class=\"fa-solid fa-paste\"></i> D\u00E1n t\u1EEB Excel</button>\r\n                                            <button (click)=\"addMixRow()\" class=\"text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-2 py-1 rounded transition border border-indigo-200 dark:border-indigo-800/50\">+ Th\u00EAm Ch\u1EA5t</button>\r\n                                        </div>\r\n                                    </div>\r\n                                    \r\n                                    <div class=\"space-y-2\">\r\n                                        @for (row of mixItems(); track row.id; let i = $index) {\r\n                                            <div class=\"bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 relative group transition hover:border-indigo-300 hover:shadow-sm\">\r\n                                                <button (click)=\"removeMixRow(i)\" class=\"absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-white dark:hover:bg-slate-800 transition\"><i class=\"fa-solid fa-times\"></i></button>\r\n                                                \r\n                                                <!-- Row Header: Name Search -->\r\n                                                <div class=\"mb-2 pr-6 relative\">\r\n                                                    @if(systemMode() === 'real' && !row.invItem) {\r\n                                                        <input placeholder=\"T\u00ECm ch\u1EA5t trong kho...\" \r\n                                                               (input)=\"onSearchMix(i, $event)\"\r\n                                                               class=\"w-full bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-0\">\r\n                                                        <!-- Dropdown -->\r\n                                                        @if(activeMixSearchIndex() === i && searchResults().length > 0) {\r\n                                                            <div class=\"absolute top-full left-0 w-full z-20 bg-white dark:bg-slate-800 shadow-xl rounded-lg max-h-40 overflow-y-auto mt-1 border border-slate-100 dark:border-slate-700\">\r\n                                                                @for(res of searchResults(); track res.id) {\r\n                                                                    <div (click)=\"selectMixItem(i, res)\" class=\"p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 cursor-pointer text-xs border-b border-slate-50 dark:border-slate-700/50\">\r\n                                                                        <div class=\"font-bold truncate\">{{res.name}}</div>\r\n                                                                        <div class=\"text-[9px] text-slate-400\">T\u1ED3n: {{res.stock}} {{res.unit}}</div>\r\n                                                                    </div>\r\n                                                                }\r\n                                                            </div>\r\n                                                        }\r\n                                                    } @else if (row.invItem) {\r\n                                                        <div class=\"flex items-center gap-2\">\r\n                                                            <span class=\"text-xs font-bold text-indigo-700 dark:text-indigo-400 truncate flex-1\">{{row.invItem.name}}</span>\r\n                                                            <button (click)=\"clearMixItem(i)\" class=\"text-[10px] text-slate-400 hover:text-red-500 dark:text-red-400\"><i class=\"fa-solid fa-rotate-left\"></i></button>\r\n                                                        </div>\r\n                                                    } @else {\r\n                                                        <!-- FIX: Use safe update method for name -->\r\n                                                        <input [ngModel]=\"row.name\" \r\n                                                               (ngModelChange)=\"updateMixItem(i, 'name', $event)\" \r\n                                                               class=\"w-full bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-0\" \r\n                                                               placeholder=\"T\u00EAn ch\u1EA5t {{i+1}}\">\r\n                                                    }\r\n                                                </div>\r\n\r\n                                                <!-- Row Inputs -->\r\n                                                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 border-t border-slate-100 dark:border-slate-700 pt-2\">\r\n                                                    <div>\r\n                                                        <label class=\"text-[9px] font-bold text-slate-400 uppercase mb-1 block\">N\u1ED3ng \u0111\u1ED9 Stock</label>\r\n                                                        <!-- FIX: Safe update for stockConc -->\r\n                                                        <input type=\"number\" min=\"0\" step=\"any\" \r\n                                                               [ngModel]=\"row.stockConc\" \r\n                                                               (ngModelChange)=\"updateMixItem(i, 'stockConc', $event)\"\r\n                                                               class=\"w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-center font-bold outline-none focus:border-indigo-400\" \r\n                                                               placeholder=\"C_stock\">\r\n                                                    </div>\r\n                                                    <div class=\"flex gap-2\">\r\n                                                        <div class=\"flex-[2]\">\r\n                                                            <label class=\"text-[9px] font-bold text-slate-400 uppercase mb-1 block\">N\u1ED3ng \u0111\u1ED9 \u0110\u00EDch</label>\r\n                                                            <!-- FIX: Safe update for targetConc -->\r\n                                                            <input type=\"number\" min=\"0\" step=\"any\" \r\n                                                                   [ngModel]=\"row.targetConc\" \r\n                                                                   (ngModelChange)=\"updateMixItem(i, 'targetConc', $event)\"\r\n                                                                   class=\"w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-center font-bold outline-none focus:border-indigo-400\" \r\n                                                                   placeholder=\"C_target\">\r\n                                                        </div>\r\n                                                        <div class=\"flex-1\">\r\n                                                            <label class=\"text-[9px] font-bold text-slate-400 uppercase mb-1 block\">\u0110\u01A1n v\u1ECB</label>\r\n                                                            <!-- FIX: Safe update for unit -->\r\n                                                            <select [ngModel]=\"row.unit\" \r\n                                                                    (ngModelChange)=\"updateMixItem(i, 'unit', $event)\"\r\n                                                                    class=\"w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs font-bold bg-white dark:bg-slate-800 outline-none h-[38px]\">\r\n                                                                @for(u of concUnits; track u.val) { <option [value]=\"u.val\">{{u.label}}</option> }\r\n                                                            </select>\r\n                                                        </div>\r\n                                                    </div>\r\n                                                </div>\r\n                                            </div>\r\n                                        }\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n\r\n                    <!-- 6. SAMPLE PREP (Dilution Factor) -->\r\n                    @if (calcMode() === 'sample_prep') {\r\n                        <div class=\"space-y-3\">\r\n                            <!-- Step 1 -->\r\n                            <div class=\"card-input border-teal-100 dark:border-teal-800/30 animate-slide-up\">\r\n                                <div class=\"px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase flex justify-between items-center\">\r\n                                    <span><i class=\"fa-solid fa-scale-balanced\"></i> B\u01B0\u1EDBc 1: M\u1EABu v\u00E0 chi\u1EBFt</span>\r\n                                    <span class=\"text-[9px] bg-white dark:bg-slate-800 px-2 rounded-full border border-teal-100 dark:border-teal-800/30\">Start</span>\r\n                                </div>\r\n                                <div class=\"p-3 grid grid-cols-2 gap-3\">\r\n                                    <div>\r\n                                        <label class=\"text-[9px] font-bold text-slate-400 uppercase mb-1 block\">Kh\u1ED1i l\u01B0\u1EE3ng m\u1EABu (m)</label>\r\n                                        <div class=\"relative\">\r\n                                            <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"sampleMass\" class=\"input-field pr-6\" placeholder=\"10\">\r\n                                            <span class=\"absolute right-3 top-2.5 text-xs font-bold text-slate-400\">g</span>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div>\r\n                                        <label class=\"text-[9px] font-bold text-slate-400 uppercase mb-1 block\">Dung m\u00F4i chi\u1EBFt (V1)</label>\r\n                                        <div class=\"relative\">\r\n                                            <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"extractVol\" class=\"input-field pr-8 text-teal-600 font-bold\" placeholder=\"10\">\r\n                                            <span class=\"absolute right-3 top-2.5 text-xs font-bold text-slate-400\">mL</span>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <!-- Flow Arrow -->\r\n                            <div class=\"flex justify-center -my-1 text-slate-300 dark:text-slate-400 relative z-0\"><i class=\"fa-solid fa-arrow-down\"></i></div>\r\n\r\n                            <!-- Step 2 -->\r\n                            <div class=\"card-input border-cyan-100 dark:border-cyan-800/30 animate-slide-up\">\r\n                                <div class=\"px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase\">\r\n                                    <i class=\"fa-solid fa-filter\"></i> B\u01B0\u1EDBc 2: L\u00E0m s\u1EA1ch\r\n                                </div>\r\n                                <div class=\"p-3\">\r\n                                    <label class=\"text-[9px] font-bold text-slate-400 uppercase mb-1 block\">H\u00FAt d\u1ECBch l\u00E0m s\u1EA1ch (V2)</label>\r\n                                    <div class=\"flex items-center gap-2\">\r\n                                        <div class=\"relative flex-1\">\r\n                                            <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"cleanupAliquot\" class=\"input-field pr-8\" placeholder=\"6\">\r\n                                            <span class=\"absolute right-3 top-2.5 text-xs font-bold text-slate-400\">mL</span>\r\n                                        </div>\r\n                                        @if(cleanupAliquot() > extractVol()) {\r\n                                            <span class=\"text-red-500 dark:text-red-400 text-[10px] font-bold animate-pulse\"><i class=\"fa-solid fa-triangle-exclamation\"></i> > V1</span>\r\n                                        }\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"flex justify-center -my-1 text-slate-300 dark:text-slate-400 relative z-0\"><i class=\"fa-solid fa-arrow-down\"></i></div>\r\n\r\n                            <!-- Step 3 -->\r\n                            <div class=\"card-input border-sky-100 dark:border-sky-800/30 animate-slide-up\">\r\n                                <div class=\"px-4 py-2 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-xs font-bold uppercase\">\r\n                                    <i class=\"fa-solid fa-vial\"></i> B\u01B0\u1EDBc 3: L\u1EA5y ph\u1EA7n d\u1ECBch\r\n                                </div>\r\n                                <div class=\"p-3\">\r\n                                    <label class=\"text-[9px] font-bold text-slate-400 uppercase mb-1 block\">H\u00FAt \u0111i c\u00F4 \u0111\u1EB7c (V3)</label>\r\n                                    <div class=\"flex items-center gap-2\">\r\n                                        <div class=\"relative flex-1\">\r\n                                            <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"concAliquot\" class=\"input-field pr-8 text-sky-600 font-bold\" placeholder=\"5\">\r\n                                            <span class=\"absolute right-3 top-2.5 text-xs font-bold text-slate-400\">mL</span>\r\n                                        </div>\r\n                                        @if(concAliquot() > cleanupAliquot()) {\r\n                                            <span class=\"text-red-500 dark:text-red-400 text-[10px] font-bold animate-pulse\"><i class=\"fa-solid fa-triangle-exclamation\"></i> > V2</span>\r\n                                        }\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"flex justify-center -my-1 text-slate-300 dark:text-slate-400 relative z-0\"><i class=\"fa-solid fa-arrow-down\"></i></div>\r\n\r\n                            <!-- Step 4 -->\r\n                            <div class=\"card-input border-indigo-100 dark:border-indigo-800/30 animate-slide-up\">\r\n                                <div class=\"px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase flex justify-between items-center\">\r\n                                    <span><i class=\"fa-solid fa-flask\"></i> B\u01B0\u1EDBc 4: \u0110\u1ECBnh m\u1EE9c cu\u1ED1i</span>\r\n                                    <span class=\"text-[9px] bg-white dark:bg-slate-800 px-2 rounded-full border border-indigo-100 dark:border-indigo-800/30\">End</span>\r\n                                </div>\r\n                                <div class=\"p-3 grid grid-cols-2 gap-3\">\r\n                                    <div>\r\n                                        <label class=\"text-[9px] font-bold text-slate-400 uppercase mb-1 block\">Th\u1EC3 t\u00EDch cu\u1ED1i (V4)</label>\r\n                                        <div class=\"relative\">\r\n                                            <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"finalVol\" class=\"input-field pr-8 text-indigo-600 dark:text-indigo-400 font-black text-lg\" placeholder=\"1\">\r\n                                            <span class=\"absolute right-3 top-3 text-xs font-bold text-slate-400\">mL</span>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div>\r\n                                        <label class=\"text-[9px] font-bold text-slate-400 uppercase mb-1 block\">Hi\u1EC7u su\u1EA5t (Recovery)</label>\r\n                                        <div class=\"relative\">\r\n                                            <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"recovery\" class=\"input-field pr-8\" placeholder=\"100\">\r\n                                            <span class=\"absolute right-3 top-2.5 text-xs font-bold text-slate-400\">%</span>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n                </div>\r\n            </div>\r\n\r\n            <!-- RIGHT PANEL: RESULTS -->\r\n            <div class=\"flex-1 flex flex-col gap-6\">\r\n                \r\n                <div class=\"bg-white dark:bg-slate-800 rounded-3xl shadow-soft-xl dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden relative flex-1 flex flex-col min-h-[400px]\">\r\n                    <!-- Color Bar -->\r\n                    <div class=\"absolute top-0 left-0 w-full h-1.5 transition-colors duration-500\" \r\n                         [class.bg-blue-500]=\"calcMode() === 'molar'\"\r\n                         [class.bg-orange-500]=\"calcMode() === 'dilution'\"\r\n                         [class.bg-emerald-500]=\"calcMode() === 'spiking'\"\r\n                         [class.bg-fuchsia-500]=\"calcMode() === 'serial'\"\r\n                         [class.bg-indigo-500]=\"calcMode() === 'mix'\"\r\n                         [class.bg-teal-500]=\"calcMode() === 'sample_prep'\">\r\n                    </div>\r\n\r\n                    <div class=\"p-6 md:p-8 flex flex-col flex-1 overflow-y-auto custom-scrollbar\">\r\n                        <div class=\"text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 text-center\">K\u1EBFt qu\u1EA3 t\u00EDnh to\u00E1n</div>\r\n                        \r\n                        <!-- SAMPLE PREP RESULTS -->\r\n                        @if (calcMode() === 'sample_prep') {\r\n                            <div class=\"flex flex-col items-center justify-center h-full animate-scale-in\">\r\n                                \r\n                                <!-- Dilution Factor Display -->\r\n                                <div class=\"text-center mb-8\">\r\n                                    <div class=\"text-xs font-bold text-slate-400 uppercase tracking-widest mb-2\">H\u1EC7 s\u1ED1 pha lo\u00E3ng (f)</div>\r\n                                    <div class=\"relative inline-block\">\r\n                                        <h1 class=\"text-6xl md:text-8xl font-black tracking-tight text-teal-600 tabular-nums\">\r\n                                            {{ formatNum(samplePrepFactor()) }}\r\n                                        </h1>\r\n                                        @if(samplePrepFactor() < 1) {\r\n                                            <span class=\"absolute -right-16 top-2 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 text-[10px] font-bold px-2 py-1 rounded border border-teal-200 dark:border-teal-800/50\">C\u00F4 \u0111\u1EB7c {{formatNum(1/samplePrepFactor())}}x</span>\r\n                                        } @else if(samplePrepFactor() > 1) {\r\n                                            <span class=\"absolute -right-16 top-2 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded border border-orange-200 dark:border-orange-800/50\">Lo\u00E3ng {{formatNum(samplePrepFactor())}}x</span>\r\n                                        }\r\n                                    </div>\r\n                                    <p class=\"text-[10px] font-mono text-slate-400 mt-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full inline-block border border-slate-200 dark:border-slate-700\">\r\n                                        f = (V1 \u00D7 V4) / (m \u00D7 V3)\r\n                                    </p>\r\n                                </div>\r\n\r\n                                <!-- Reverse Calculator -->\r\n                                <div class=\"w-full max-w-sm bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm\">\r\n                                    <div class=\"flex items-center gap-2 mb-4 justify-center\">\r\n                                        <i class=\"fa-solid fa-calculator text-teal-500\"></i>\r\n                                        <span class=\"text-xs font-bold text-slate-600 dark:text-slate-300 uppercase\">T\u00EDnh n\u1ED3ng \u0111\u1ED9 m\u1EABu</span>\r\n                                    </div>\r\n                                    \r\n                                    <div class=\"flex items-center gap-3\">\r\n                                        <div class=\"flex-1\">\r\n                                            <label class=\"text-[9px] font-bold text-slate-400 uppercase block mb-1\">K\u1EBFt qu\u1EA3 ch\u1EA1y m\u00E1y</label>\r\n                                            <input type=\"number\" min=\"0\" step=\"any\" [(ngModel)]=\"instConc\" class=\"w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-center font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-teal-500 transition\" placeholder=\"C_inst\">\r\n                                        </div>\r\n                                        <div class=\"text-slate-300 dark:text-slate-400 text-lg pt-4\"><i class=\"fa-solid fa-arrow-right\"></i></div>\r\n                                        <div class=\"flex-1\">\r\n                                            <label class=\"text-[9px] font-bold text-slate-400 uppercase block mb-1\">K\u1EBFt qu\u1EA3 th\u1EF1c</label>\r\n                                            <div class=\"w-full bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800/50 rounded-xl px-3 py-2 text-center font-black text-teal-700 dark:text-teal-400 text-lg shadow-sm\">\r\n                                                {{ formatNum(sampleResult()) }}\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                    \r\n                                    @if(recovery() !== 100) {\r\n                                        <div class=\"mt-3 text-center\">\r\n                                            <span class=\"text-[9px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded border border-orange-100 dark:border-orange-800/30\">\r\n                                                \u0110\u00E3 b\u00F9 hi\u1EC7u su\u1EA5t {{recovery()}}%\r\n                                            </span>\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n\r\n                            </div>\r\n                        }\r\n\r\n                        <!-- SINGLE VALUE MODES -->\r\n                        @if (['dilution', 'spiking'].includes(calcMode())) {\r\n                            <div class=\"text-center space-y-4 animate-scale-in\">\r\n                                <div class=\"text-xs font-bold text-slate-400 uppercase tracking-widest mb-2\">Th\u1EC3 t\u00EDch c\u1EA7n h\u00FAt (Stock)</div>\r\n                                <div class=\"relative inline-block\">\r\n                                    <h1 class=\"text-6xl md:text-7xl font-black tracking-tight text-slate-800 dark:text-slate-100 tabular-nums\">\r\n                                        {{ formatNum(resultValue()) }}\r\n                                    </h1>\r\n                                    <span class=\"absolute -right-10 top-0 text-lg font-bold text-slate-400\">{{ resultUnit() }}</span>\r\n                                </div>\r\n                                <p class=\"text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700\">\r\n                                    {{ resultDescription() }}\r\n                                </p>\r\n                            </div>\r\n                        }\r\n\r\n                        <!-- MOLAR RESULTS -->\r\n                        @if (calcMode() === 'molar') {\r\n                            <div class=\"text-center space-y-4 animate-scale-in\">\r\n                                <div class=\"text-xs font-bold text-slate-400 uppercase tracking-widest mb-2\">N\u1ED3ng \u0111\u1ED9 \u0111\u1EA1t \u0111\u01B0\u1EE3c</div>\r\n                                <div class=\"relative inline-block\">\r\n                                    <h1 class=\"text-6xl md:text-7xl font-black tracking-tight text-blue-600 tabular-nums\">\r\n                                        {{ formatNum(molarResult().val) }}\r\n                                    </h1>\r\n                                    <span class=\"absolute -right-12 top-0 text-lg font-bold text-slate-400\">{{ molarResult().unit }}</span>\r\n                                </div>\r\n                                \r\n                                <div class=\"flex justify-center gap-4 mt-6\">\r\n                                    @for(alt of molarResult().alternatives; track alt.unit) {\r\n                                        <div class=\"bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 min-w-[100px]\">\r\n                                            <div class=\"text-lg font-bold text-slate-700 dark:text-slate-200\">{{formatNum(alt.val)}}</div>\r\n                                            <div class=\"text-[10px] font-bold text-slate-400 uppercase\">{{alt.unit}}</div>\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n                        }\r\n\r\n                        <!-- SERIAL DILUTION TABLE -->\r\n                        @if (calcMode() === 'serial') {\r\n                            <div class=\"w-full animate-slide-up\">\r\n                                <table class=\"w-full text-sm text-left\">\r\n                                    <thead class=\"text-xs text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-900/20 uppercase font-bold\">\r\n                                        <tr>\r\n                                            <th class=\"px-4 py-3 rounded-l-lg\">\u0110i\u1EC3m chu\u1EA9n</th>\r\n                                            <th class=\"px-4 py-3 text-right\">L\u01B0\u1EE3ng H\u00FAt (Stock)</th>\r\n                                            <th class=\"px-4 py-3 text-right rounded-r-lg\">Th\u00EAm dung m\u00F4i</th>\r\n                                        </tr>\r\n                                    </thead>\r\n                                    <tbody class=\"divide-y divide-slate-100\">\r\n                                        @for (pt of serialResult(); track $index) {\r\n                                            <tr class=\"hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/40 transition\">\r\n                                                <td class=\"px-4 py-3 font-bold text-slate-700 dark:text-slate-200\">{{pt.conc}} {{targetConcUnit()}}</td>\r\n                                                <td class=\"px-4 py-3 text-right font-mono font-bold text-fuchsia-600 dark:text-fuchsia-400\">{{formatNum(pt.vStock)}} {{pt.unit}}</td>\r\n                                                <td class=\"px-4 py-3 text-right text-slate-500 dark:text-slate-400\">{{formatNum(pt.vSolvent)}} {{targetVolUnit()}}</td>\r\n                                            </tr>\r\n                                        }\r\n                                        <tr class=\"bg-slate-50 dark:bg-slate-900/50 font-bold border-t border-slate-200 dark:border-slate-700\">\r\n                                            <td class=\"px-4 py-3 text-slate-500 dark:text-slate-400\">T\u1ED4NG STOCK C\u1EA6N</td>\r\n                                            <td class=\"px-4 py-3 text-right text-fuchsia-700 dark:text-fuchsia-400 text-lg\">{{formatNum(serialTotalStock())}} {{serialResult()[0]?.unit || '\u00B5L'}}</td>\r\n                                            <td class=\"px-4 py-3\"></td>\r\n                                        </tr>\r\n                                    </tbody>\r\n                                </table>\r\n                            </div>\r\n                        }\r\n\r\n                        <!-- MIX TABLE -->\r\n                        @if (calcMode() === 'mix') {\r\n                            <div class=\"w-full animate-slide-up\">\r\n                                <div class=\"mb-6 text-center bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30\">\r\n                                    <span class=\"text-xs text-indigo-400 uppercase font-bold\">Dung m\u00F4i th\u00EAm v\u00E0o (QS):</span>\r\n                                    <div class=\"text-3xl font-black text-indigo-700 dark:text-indigo-400\">{{formatNum(mixResult().solventVol)}} <span class=\"text-sm font-normal\">{{targetVolUnit()}}</span></div>\r\n                                </div>\r\n                                <table class=\"w-full text-sm text-left\">\r\n                                    <thead class=\"text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 uppercase font-bold\">\r\n                                        <tr>\r\n                                            <th class=\"px-3 py-2 rounded-l-lg\">Ch\u1EA5t</th>\r\n                                            <th class=\"px-3 py-2 text-right rounded-r-lg\">L\u01B0\u1EE3ng H\u00FAt</th>\r\n                                        </tr>\r\n                                    </thead>\r\n                                    <tbody class=\"divide-y divide-slate-100\">\r\n                                        @for (res of mixResult().details; track res.name) {\r\n                                            <tr class=\"hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition\">\r\n                                                <td class=\"px-3 py-2 font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]\">{{res.name}}</td>\r\n                                                <td class=\"px-3 py-2 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400\">{{formatNum(res.vStock)}} {{res.unit}}</td>\r\n                                            </tr>\r\n                                        }\r\n                                    </tbody>\r\n                                </table>\r\n                            </div>\r\n                        }\r\n\r\n                        <!-- REAL MODE STOCK STATUS -->\r\n                        @if (systemMode() === 'real' && (selectedItem() || calcMode() === 'serial' || calcMode() === 'mix')) {\r\n                            <div class=\"w-full max-w-sm mx-auto mt-auto pt-6\">\r\n                                <div class=\"bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden\">\r\n                                    <div class=\"absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500\"></div>\r\n                                    \r\n                                    @if (calcMode() === 'mix') {\r\n                                        <div class=\"text-[10px] font-bold text-slate-400 uppercase mb-2\">Tr\u1EA1ng th\u00E1i kho (H\u1ED7n h\u1EE3p)</div>\r\n                                        <div class=\"space-y-2 max-h-32 overflow-y-auto custom-scrollbar\">\r\n                                            @for (status of mixStockStatus(); track status.name) {\r\n                                                <div class=\"flex justify-between items-center text-xs\">\r\n                                                    <span class=\"truncate max-w-[150px] font-medium text-slate-700 dark:text-slate-200\">{{status.name}}</span>\r\n                                                    @if(status.ok) {\r\n                                                        <span class=\"text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded flex items-center gap-1\"><i class=\"fa-solid fa-check\"></i> \u0110\u1EE7</span>\r\n                                                    } @else {\r\n                                                        <span class=\"text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded flex items-center gap-1\"><i class=\"fa-solid fa-xmark\"></i> Thi\u1EBFu</span>\r\n                                                    }\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    } @else {\r\n                                        <div class=\"flex justify-between items-end mb-2\">\r\n                                            <div>\r\n                                                <div class=\"text-[10px] font-bold text-slate-400 uppercase\">T\u1ED3n kho hi\u1EC7n t\u1EA1i</div>\r\n                                                <div class=\"text-sm font-bold text-slate-800 dark:text-slate-100\">{{ formatNum(selectedItem()?.stock || 0) }} {{ selectedItem()?.unit || ''}}</div>\r\n                                            </div>\r\n                                            @if(canFulfill()) {\r\n                                                <span class=\"text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded\"><i class=\"fa-solid fa-check-circle\"></i> \u0110\u1EE7 h\u00E0ng</span>\r\n                                            } @else {\r\n                                                <span class=\"text-red-600 dark:text-red-400 text-xs font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded\"><i class=\"fa-solid fa-circle-exclamation\"></i> Thi\u1EBFu h\u00E0ng</span>\r\n                                            }\r\n                                        </div>\r\n                                        <div class=\"w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden\">\r\n                                            <div class=\"h-full rounded-full transition-all duration-500\"\r\n                                                 [style.width.%]=\"stockPercentage()\"\r\n                                                 [class.bg-emerald-500]=\"canFulfill()\"\r\n                                                 [class.bg-red-500]=\"!canFulfill()\">\r\n                                            </div>\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n                        }\r\n                    </div>\r\n\r\n                    <!-- FOOTER ACTIONS -->\r\n                    <div class=\"p-4 sm:p-5 bg-white dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 shrink-0 sticky bottom-0 z-30 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_15px_rgba(0,0,0,0.2)]\">\r\n                        <button (click)=\"goToLabels()\" class=\"w-full sm:flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition active:scale-95 flex items-center justify-center gap-2 text-sm\">\r\n                            <i class=\"fa-solid fa-print text-slate-400\"></i> In Nh\u00E3n\r\n                        </button>\r\n                        \r\n                        @if (systemMode() === 'real') {\r\n                            <button (click)=\"confirmTransaction()\" \r\n                                    [disabled]=\"!canFulfill() || isProcessing()\"\r\n                                    class=\"w-full sm:flex-[2] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm\">\r\n                                @if(isProcessing()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> X\u1EED l\u00FD... } \r\n                                @else { <i class=\"fa-solid fa-boxes-packing\"></i> X\u00E1c nh\u1EADn & Tr\u1EEB kho }\r\n                            </button>\r\n                        }\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- QUICK PRINT MODAL -->\r\n        @if (showLabelModal()) {\r\n            <div class=\"fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in\">\r\n                <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in\">\r\n                    <div class=\"p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50\">\r\n                        <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2\">\r\n                            <i class=\"fa-solid fa-print text-blue-500\"></i> In Nh\u00E3n Nhanh\r\n                        </h3>\r\n                        <button (click)=\"closeLabelModal()\" class=\"w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition\">\r\n                            <i class=\"fa-solid fa-times\"></i>\r\n                        </button>\r\n                    </div>\r\n                    <div class=\"p-6 space-y-4\">\r\n                        <div class=\"space-y-2\">\r\n                            <label class=\"text-xs font-bold text-slate-500 dark:text-slate-400 uppercase\">N\u1ED9i dung nh\u00E3n (C\u00F3 th\u1EC3 s\u1EEDa)</label>\r\n                            <textarea [ngModel]=\"labelData()\" (ngModelChange)=\"labelData.set($event)\" class=\"w-full h-32 p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none bg-slate-50 dark:bg-slate-900/50\"></textarea>\r\n                        </div>\r\n                        \r\n                        <div class=\"grid grid-cols-3 gap-3\">\r\n                            <div>\r\n                                <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1\">Kh\u1ED5 r\u1ED9ng (mm)</label>\r\n                                <input type=\"number\" [ngModel]=\"quickPrintWidth()\" (ngModelChange)=\"quickPrintWidth.set($event)\" class=\"w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-bold text-center outline-none focus:border-blue-500\">\r\n                            </div>\r\n                            <div>\r\n                                <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1\">Chi\u1EC1u d\u00E0i (mm)</label>\r\n                                <input type=\"number\" [ngModel]=\"quickPrintHeight()\" (ngModelChange)=\"quickPrintHeight.set($event)\" class=\"w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-bold text-center outline-none focus:border-blue-500\">\r\n                            </div>\r\n                            <div>\r\n                                <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1\">C\u1EE1 ch\u1EEF (pt)</label>\r\n                                <input type=\"number\" [ngModel]=\"quickPrintFontSize()\" (ngModelChange)=\"quickPrintFontSize.set($event)\" class=\"w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-bold text-center outline-none focus:border-blue-500\">\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-start gap-3\">\r\n                            <i class=\"fa-solid fa-circle-info text-blue-500 mt-0.5\"></i>\r\n                            <div class=\"text-xs text-blue-800\">\r\n                                <p class=\"font-bold mb-1\">M\u1EB9o in nhanh:</p>\r\n                                <p>B\u1EA1n c\u00F3 th\u1EC3 ch\u1EC9nh s\u1EEDa n\u1ED9i dung tr\u01B0\u1EDBc khi in. \u0110\u1EC3 c\u00E0i \u0111\u1EB7t kh\u1ED5 gi\u1EA5y ho\u1EB7c in h\u00E0ng lo\u1EA1t, vui l\u00F2ng truy c\u1EADp menu <a routerLink=\"/labels\" class=\"font-bold underline cursor-pointer\">In Tem & Nh\u00E3n</a>.</p>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex gap-3 justify-end\">\r\n                        <button (click)=\"closeLabelModal()\" class=\"px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition\">H\u1EE7y</button>\r\n                        <button (click)=\"printQuickLabel()\" class=\"px-6 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none transition flex items-center gap-2\">\r\n                            <i class=\"fa-solid fa-print\"></i> In Ngay\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        }\r\n    </div>", styles: ["\n    .card-input { @apply bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm overflow-hidden; }\n    .card-header { @apply px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2; }\n    .label { @apply text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1 tracking-wide; }\n    .input-wrapper { @apply flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition overflow-hidden; }\n    .input-field { @apply w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition placeholder-slate-300 dark:placeholder-slate-600; }\n    .unit-badge { @apply pr-3 text-xs font-bold text-slate-400 select-none bg-transparent; }\n    .select-unit { @apply bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-blue-400 dark:focus:border-blue-500 cursor-pointer px-2; }\n    .no-scrollbar::-webkit-scrollbar { display: none; }\n    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\n    @keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }\n    .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SmartPrepComponent, { className: "SmartPrepComponent", filePath: "src/app/features/preparation/smart-prep.component.ts", lineNumber: 75 }); })();
//# sourceMappingURL=smart-prep.component.js.map