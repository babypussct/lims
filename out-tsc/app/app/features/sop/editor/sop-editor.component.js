import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SopService } from '../services/sop.service';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { InventoryService } from '../../inventory/inventory.service';
import { RecipeService } from '../../recipes/recipe.service';
import { TargetService } from '../../targets/target.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { MatrixTypeService } from '../../config/matrix-type.service';
import { MasterTargetService } from '../../targets/master-target.service';
import { MasterDeviceService } from '../../config/master-device.service';
import { UNIT_OPTIONS, formatNum, generateSlug } from '../../../shared/utils/utils';
import { getCanonicalId } from '../../results/shared/compound-id-resolver';
import { debounceTime } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = (a0, a1) => ({ "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-400": a0, "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600": a1 });
const _c1 = (a0, a1) => ({ "bg-emerald-500 border-emerald-500 text-white": a0, "bg-transparent border-slate-300 dark:border-slate-600": a1 });
const _c2 = (a0, a1) => ({ "text-red-500 dark:text-red-400": a0, "text-emerald-600 dark:text-emerald-400": a1 });
const _forTrack0 = ($index, $item) => $item.name;
const _forTrack1 = ($index, $item) => $item.id;
const _forTrack2 = ($index, $item) => $item.value;
function SopEditorComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 14);
} }
function SopEditorComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 15);
} }
function SopEditorComponent_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 17);
} }
function SopEditorComponent_Conditional_39_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 47);
} }
function SopEditorComponent_Conditional_39_For_32_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 47);
} }
function SopEditorComponent_Conditional_39_For_32_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 62);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_39_For_32_Template_button_click_0_listener() { const m_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleMatrixTag(m_r4.id)); });
    i0.ɵɵelement(1, "div", 63);
    i0.ɵɵtext(2);
    i0.ɵɵtemplate(3, SopEditorComponent_Conditional_39_For_32_Conditional_3_Template, 1, 0, "i", 47);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r1.selectedMatrixTags().includes(m_r4.id) ? "ring-2 ring-offset-1 opacity-100 dark:ring-offset-slate-800" : "opacity-60 hover:opacity-80");
    i0.ɵɵstyleProp("border-color", m_r4.color || "#94a3b8")("color", m_r4.color || "#94a3b8");
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("background-color", m_r4.color || "#94a3b8");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", m_r4.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.selectedMatrixTags().includes(m_r4.id) ? 3 : -1);
} }
function SopEditorComponent_Conditional_39_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 49);
    i0.ɵɵelement(1, "i", 64);
    i0.ɵɵtext(2, " Kh\u00F4ng g\u00E1n n\u1EC1n m\u1EABu \u2192 SOP n\u00E0y \u0111\u01B0\u1EE3c x\u00E9t trong m\u1ECDi tr\u01B0\u1EDDng h\u1EE3p (\u00E1p d\u1EE5ng chung). ");
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_39_For_40_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 67);
} }
function SopEditorComponent_Conditional_39_For_40_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 65);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_39_For_40_Template_button_click_0_listener() { const d_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleAllowedDevice(d_r6.name)); });
    i0.ɵɵelement(1, "i", 66);
    i0.ɵɵtext(2);
    i0.ɵɵtemplate(3, SopEditorComponent_Conditional_39_For_40_Conditional_3_Template, 1, 0, "i", 67);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r6 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r1.selectedAllowedDevices().includes(d_r6.name) ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", d_r6.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.selectedAllowedDevices().includes(d_r6.name) ? 3 : -1);
} }
function SopEditorComponent_Conditional_39_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 52);
    i0.ɵɵelement(1, "i", 64);
    i0.ɵɵtext(2, " Ch\u01B0a ch\u1ECDn thi\u1EBFt b\u1ECB kh\u1EA3 d\u1EE5ng. M\u1ECDi thi\u1EBFt b\u1ECB s\u1EBD \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB tr\u00EAn m\u1EBB ch\u1EA1y. ");
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_39_Conditional_48_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 68);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const name_r7 = ctx.$implicit;
    i0.ɵɵproperty("value", name_r7);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(name_r7);
} }
function SopEditorComponent_Conditional_39_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SopEditorComponent_Conditional_39_Conditional_48_For_1_Template, 2, 2, "option", 68, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r1.selectedAllowedDevices());
} }
function SopEditorComponent_Conditional_39_Conditional_49_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 68);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r8 = ctx.$implicit;
    i0.ɵɵproperty("value", d_r8.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(d_r8.name);
} }
function SopEditorComponent_Conditional_39_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SopEditorComponent_Conditional_39_Conditional_49_For_1_Template, 2, 2, "option", 68, _forTrack1);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r1.availableDevices());
} }
function SopEditorComponent_Conditional_39_For_58_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 81)(1, "label", 82);
    i0.ɵɵtext(2, "T\u00F9y ch\u1ECDn (Format: \"Value:Label, Value:Label\")");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "input", 83);
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_39_For_58_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 61)(1, "div", 69)(2, "div", 70)(3, "div")(4, "label", 71);
    i0.ɵɵtext(5, "Bi\u1EBFn (Var)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "input", 72);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div")(8, "label", 71);
    i0.ɵɵtext(9, "Nh\u00E3n (Label)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(10, "input", 73);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div")(12, "label", 71);
    i0.ɵɵtext(13, "Ki\u1EC3u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "select", 74)(15, "option", 75);
    i0.ɵɵtext(16, "S\u1ED1 (Number)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "option", 76);
    i0.ɵɵtext(18, "Checkbox");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "option", 77);
    i0.ɵɵtext(20, "Danh s\u00E1ch l\u1EF1a ch\u1ECDn");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "div")(22, "label", 71);
    i0.ɵɵtext(23, "M\u1EB7c \u0111\u1ECBnh");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(24, "input", 78);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "button", 79);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_39_For_58_Template_button_click_25_listener() { const ɵ$index_200_r10 = i0.ɵɵrestoreView(_r9).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.inputs.removeAt(ɵ$index_200_r10)); });
    i0.ɵɵelement(26, "i", 80);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(27, SopEditorComponent_Conditional_39_For_58_Conditional_27_Template, 4, 0, "div", 81);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_13_0;
    const inp_r11 = ctx.$implicit;
    const ɵ$index_200_r10 = ctx.$index;
    i0.ɵɵproperty("formGroupName", ɵ$index_200_r10);
    i0.ɵɵadvance(27);
    i0.ɵɵconditional(((tmp_13_0 = inp_r11.get("type")) == null ? null : tmp_13_0.value) === "select" ? 27 : -1);
} }
function SopEditorComponent_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 24)(1, "div", 33)(2, "div")(3, "label", 34);
    i0.ɵɵtext(4, "T\u00EAn quy tr\u00ECnh ");
    i0.ɵɵelementStart(5, "span", 35);
    i0.ɵɵtext(6, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "input", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 37)(9, "div")(10, "label", 34);
    i0.ɵɵtext(11, "Danh m\u1EE5c (Category) ");
    i0.ɵɵelementStart(12, "span", 35);
    i0.ɵɵtext(13, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(14, "input", 38);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div")(16, "label", 34);
    i0.ɵɵtext(17, "T\u00E0i li\u1EC7u tham chi\u1EBFu (Ref)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(18, "input", 39);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 40);
    i0.ɵɵelement(20, "input", 41);
    i0.ɵɵelementStart(21, "label", 42);
    i0.ɵɵtext(22, " Ch\u1EC9 \u0111\u1ECBnh th\u1EE7 c\u00F4ng \u2014 Kh\u00F4ng t\u1EF1 \u0111\u1ED9ng ph\u00E2n b\u1ED5 khi l\u1EADp m\u1EBB ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 43)(24, "label", 34);
    i0.ɵɵtext(25, " N\u1EC1n m\u1EABu \u00E1p d\u1EE5ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "div", 44)(27, "button", 45);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_39_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearMatrixTags()); });
    i0.ɵɵelement(28, "div", 46);
    i0.ɵɵtext(29, " D\u00F9ng chung (ANY) ");
    i0.ɵɵtemplate(30, SopEditorComponent_Conditional_39_Conditional_30_Template, 1, 0, "i", 47);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(31, SopEditorComponent_Conditional_39_For_32_Template, 4, 10, "button", 48, _forTrack1);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(33, SopEditorComponent_Conditional_39_Conditional_33_Template, 3, 0, "p", 49);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 50)(35, "div")(36, "label", 34);
    i0.ɵɵtext(37, " Thi\u1EBFt b\u1ECB kh\u1EA3 d\u1EE5ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "div", 44);
    i0.ɵɵrepeaterCreate(39, SopEditorComponent_Conditional_39_For_40_Template, 4, 4, "button", 51, _forTrack1);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(41, SopEditorComponent_Conditional_39_Conditional_41_Template, 3, 0, "p", 52);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div", 53)(43, "label", 34);
    i0.ɵɵtext(44, " Thi\u1EBFt b\u1ECB M\u1EB7c \u0111\u1ECBnh ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "select", 54)(46, "option", 55);
    i0.ɵɵtext(47, "-- T\u1EF1 \u0111\u1ED9ng --");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(48, SopEditorComponent_Conditional_39_Conditional_48_Template, 2, 0)(49, SopEditorComponent_Conditional_39_Conditional_49_Template, 2, 0);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(50, "div", 56)(51, "div", 57)(52, "h3", 58);
    i0.ɵɵtext(53, "D\u1EEF Li\u1EC7u \u0110\u1EA7u v\u00E0o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "button", 59);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_39_Template_button_click_54_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addInput()); });
    i0.ɵɵtext(55, "+ Th\u00EAm Tr\u01B0\u1EDDng Nh\u1EADp");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(56, "div", 60);
    i0.ɵɵrepeaterCreate(57, SopEditorComponent_Conditional_39_For_58_Template, 28, 2, "div", 61, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(27);
    i0.ɵɵclassMap(ctx_r1.selectedMatrixTags().length === 0 ? "ring-2 ring-offset-1 opacity-100 dark:ring-offset-slate-800" : "opacity-60 hover:opacity-80");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.selectedMatrixTags().length === 0 ? 30 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.availableMatrices());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.selectedMatrixTags().length === 0 ? 33 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r1.availableDevices());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.selectedAllowedDevices().length === 0 ? 41 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵconditional(ctx_r1.selectedAllowedDevices().length > 0 ? 48 : 49);
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r1.inputs.controls);
} }
function SopEditorComponent_Conditional_40_For_15_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 68);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r14 = ctx.$implicit;
    i0.ɵɵproperty("value", std_r14.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(std_r14.label);
} }
function SopEditorComponent_Conditional_40_For_15_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 91)(1, "div", 92)(2, "label", 93);
    i0.ɵɵtext(3, "T\u00EAn bi\u1EBFn");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 94);
    i0.ɵɵelementStart(5, "datalist", 95);
    i0.ɵɵrepeaterCreate(6, SopEditorComponent_Conditional_40_For_15_For_7_Template, 2, 2, "option", 68, _forTrack2);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 96);
    i0.ɵɵelement(9, "i", 97);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 98)(11, "label", 99);
    i0.ɵɵtext(12, "Bi\u1EC3u th\u1EE9c t\u00EDnh to\u00E1n (JavaScript)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "input", 100);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 101);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_40_For_15_Template_button_click_14_listener() { const ɵ$index_280_r15 = i0.ɵɵrestoreView(_r13).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.variablesList.removeAt(ɵ$index_280_r15)); });
    i0.ɵɵelement(15, "i", 80);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ɵ$index_280_r15 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("formGroupName", ɵ$index_280_r15);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r1.standardVars);
} }
function SopEditorComponent_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 25)(1, "div", 57)(2, "h3", 84);
    i0.ɵɵelement(3, "i", 85);
    i0.ɵɵtext(4, " Bi\u1EBFn Trung Gian (Variables) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 86);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_40_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addVariable()); });
    i0.ɵɵtext(6, "+ Th\u00EAm Bi\u1EBFn");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "p", 87);
    i0.ɵɵelement(8, "i", 88);
    i0.ɵɵtext(9, " \u0110\u1ECBnh ngh\u0129a c\u00E1c c\u00F4ng th\u1EE9c to\u00E1n h\u1ECDc d\u00F9ng chung. D\u00F9ng c\u00E1c bi\u1EBFn \u0111\u1EA7u v\u00E0o (VD: ");
    i0.ɵɵelementStart(10, "code", 89);
    i0.ɵɵtext(11, "n_sample");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(12, ") ho\u1EB7c c\u00E1c bi\u1EBFn kh\u00E1c. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 90);
    i0.ɵɵrepeaterCreate(14, SopEditorComponent_Conditional_40_For_15_Template, 16, 1, "div", 91, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater(ctx_r1.variablesList.controls);
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_6_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 141);
    i0.ɵɵelement(1, "i", 143);
    i0.ɵɵtext(2, " Kh\u1EDBp");
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_6_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 142);
    i0.ɵɵelement(1, "i", 144);
    i0.ɵɵtext(2, " L\u1ED7i ID");
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_6_Conditional_0_Template, 3, 0, "span", 141)(1, SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_6_Conditional_1_Template, 3, 0, "span", 142);
} if (rf & 2) {
    i0.ɵɵnextContext();
    const validItem_r20 = i0.ɵɵreadContextLet(0);
    i0.ɵɵconditional(validItem_r20 ? 0 : 1);
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 136);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_16_0;
    const con_r21 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("ID: ", (tmp_16_0 = con_r21.get("name")) == null ? null : tmp_16_0.value, "");
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Ch\u1ECDn l\u1EA1i ");
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 145);
    i0.ɵɵtext(1, " Th\u01B0 vi\u1EC7n ");
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "div", 133)(2, "div", 134)(3, "div", 116)(4, "span", 135);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_6_Template, 2, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_7_Template, 2, 1, "span", 136);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "button", 137);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_41_For_10_Conditional_13_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r19); const ɵ$index_327_r18 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openConsumableModal(ɵ$index_327_r18, false)); });
    i0.ɵɵtemplate(9, SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_9_Template, 1, 0)(10, SopEditorComponent_Conditional_41_For_10_Conditional_13_Conditional_10_Template, 2, 0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(11, "input", 138)(12, "input", 139)(13, "input", 140);
} if (rf & 2) {
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_18_0;
    const con_r21 = i0.ɵɵnextContext().$implicit;
    const conType_r22 = i0.ɵɵreadContextLet(0);
    const ctx_r1 = i0.ɵɵnextContext(2);
    const validItem_r23 = i0.ɵɵstoreLet(conType_r22 === "simple" ? ctx_r1.validInventoryMap().get(((tmp_14_0 = con_r21.get("name")) == null ? null : tmp_14_0.value) || "") : ctx_r1.validRecipeMap().get(((tmp_14_0 = con_r21.get("name")) == null ? null : tmp_14_0.value) || ""));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ((tmp_15_0 = con_r21.get("_displayName")) == null ? null : tmp_15_0.value) || "(Ch\u01B0a ch\u1ECDn)", " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_16_0 = con_r21.get("name")) == null ? null : tmp_16_0.value) ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_17_0 = con_r21.get("name")) == null ? null : tmp_17_0.value) ? 7 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(((tmp_18_0 = con_r21.get("name")) == null ? null : tmp_18_0.value) && !validItem_r23 ? 9 : 10);
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 116)(1, "span", 146);
    i0.ɵɵtext(2, "T\u00EAn h\u1ED7n h\u1EE3p:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 147);
    i0.ɵɵlistener("change", function SopEditorComponent_Conditional_41_For_10_Conditional_14_Template_input_change_3_listener() { i0.ɵɵrestoreView(_r24); const ɵ$index_327_r18 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.updateCompositeId(ɵ$index_327_r18)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 148);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_14_0;
    const con_r21 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("ID: ", (tmp_14_0 = con_r21.get("name")) == null ? null : tmp_14_0.value, "");
} }
function SopEditorComponent_Conditional_41_For_10_For_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 68);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const opt_r25 = ctx.$implicit;
    i0.ɵɵproperty("value", opt_r25.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(opt_r25.value);
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_8_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 141);
    i0.ɵɵelement(1, "i", 143);
    i0.ɵɵtext(2, " Kh\u1EDBp");
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_8_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 142);
    i0.ɵɵelement(1, "i", 144);
    i0.ɵɵtext(2, " L\u1ED7i ID");
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_8_Conditional_0_Template, 3, 0, "span", 141)(1, SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_8_Conditional_1_Template, 3, 0, "span", 142);
} if (rf & 2) {
    i0.ɵɵnextContext();
    const validSubItem_r28 = i0.ɵɵreadContextLet(2);
    i0.ɵɵconditional(validSubItem_r28 ? 0 : 1);
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 136);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_27_0;
    const ing_r29 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("ID: ", (tmp_27_0 = ing_r29.get("name")) == null ? null : tmp_27_0.value, "");
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Ch\u1ECDn l\u1EA1i ");
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 145);
    i0.ɵɵtext(1, " Th\u01B0 vi\u1EC7n ");
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_For_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 68);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const opt_r31 = ctx.$implicit;
    i0.ɵɵproperty("value", opt_r31.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(opt_r31.value);
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r27 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 155)(1, "div", 156);
    i0.ɵɵdeclareLet(2);
    i0.ɵɵelementStart(3, "div", 157)(4, "div", 134)(5, "div", 116)(6, "span", 158);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_8_Template, 2, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_9_Template, 2, 1, "span", 136);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 137);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Template_button_click_10_listener() { const ɵ$index_473_r30 = i0.ɵɵrestoreView(_r27).$index; const ɵ$index_327_r18 = i0.ɵɵnextContext(2).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openConsumableModal(ɵ$index_327_r18, true, ɵ$index_473_r30)); });
    i0.ɵɵtemplate(11, SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_11_Template, 1, 0)(12, SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Conditional_12_Template, 2, 0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(13, "input", 138)(14, "input", 139);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(15, "input", 159);
    i0.ɵɵelementStart(16, "select", 160);
    i0.ɵɵrepeaterCreate(17, SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_For_18_Template, 2, 2, "option", 68, _forTrack2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "button", 161);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Template_button_click_19_listener() { const ɵ$index_473_r30 = i0.ɵɵrestoreView(_r27).$index; const ɵ$index_327_r18 = i0.ɵɵnextContext(2).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.getIngredients(ɵ$index_327_r18).removeAt(ɵ$index_473_r30)); });
    i0.ɵɵelement(20, "i", 162);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_27_0;
    let tmp_28_0;
    let tmp_29_0;
    let tmp_30_0;
    let tmp_31_0;
    const ing_r29 = ctx.$implicit;
    const ɵ$index_473_r30 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵstyleProp("z-index", 100 - ɵ$index_473_r30);
    i0.ɵɵproperty("formGroupName", ɵ$index_473_r30);
    i0.ɵɵadvance(2);
    const validSubItem_r32 = i0.ɵɵstoreLet(ctx_r1.validInventoryMap().get(((tmp_27_0 = ing_r29.get("name")) == null ? null : tmp_27_0.value) || ""));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ((tmp_28_0 = ing_r29.get("_displayName")) == null ? null : tmp_28_0.value) || "(Ch\u01B0a ch\u1ECDn h\u00F3a ch\u1EA5t)", " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_29_0 = ing_r29.get("name")) == null ? null : tmp_29_0.value) ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_30_0 = ing_r29.get("name")) == null ? null : tmp_30_0.value) ? 9 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(((tmp_31_0 = ing_r29.get("name")) == null ? null : tmp_31_0.value) && !validSubItem_r32 ? 11 : 12);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r1.unitOptions);
} }
function SopEditorComponent_Conditional_41_For_10_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    const _r26 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 132)(1, "div", 149)(2, "span", 150);
    i0.ɵɵelement(3, "i", 151);
    i0.ɵɵtext(4, " Th\u00E0nh ph\u1EA7n con");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 152);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_41_For_10_Conditional_45_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r26); const ɵ$index_327_r18 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.addIngredient(ɵ$index_327_r18)); });
    i0.ɵɵtext(6, "+ Th\u00EAm Ch\u1EA5t");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 153);
    i0.ɵɵrepeaterCreate(8, SopEditorComponent_Conditional_41_For_10_Conditional_45_For_9_Template, 21, 8, "div", 154, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ɵ$index_327_r18 = i0.ɵɵnextContext().$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(8);
    i0.ɵɵrepeater(ctx_r1.getIngredients(ɵ$index_327_r18).controls);
} }
function SopEditorComponent_Conditional_41_For_10_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "div", 108)(2, "div", 109)(3, "div", 110);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "select", 111);
    i0.ɵɵlistener("change", function SopEditorComponent_Conditional_41_For_10_Template_select_change_5_listener() { const ɵ$index_327_r18 = i0.ɵɵrestoreView(_r17).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onTypeChange(ɵ$index_327_r18)); });
    i0.ɵɵelementStart(6, "option", 112);
    i0.ɵɵtext(7, "H\u00F3a ch\u1EA5t \u0111\u01A1n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "option", 113);
    i0.ɵɵtext(9, "C\u00F4ng th\u1EE9c (Th\u01B0 vi\u1EC7n)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "option", 114);
    i0.ɵɵtext(11, "H\u1ED7n h\u1EE3p (Nh\u1EADp tay)");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 115);
    i0.ɵɵtemplate(13, SopEditorComponent_Conditional_41_For_10_Conditional_13_Template, 14, 5)(14, SopEditorComponent_Conditional_41_For_10_Conditional_14_Template, 6, 1, "div", 116);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "button", 117);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_41_For_10_Template_button_click_15_listener() { const ɵ$index_327_r18 = i0.ɵɵrestoreView(_r17).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.consumables.removeAt(ɵ$index_327_r18)); });
    i0.ɵɵelement(16, "i", 80);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 118)(18, "div", 119)(19, "div", 98)(20, "label", 120);
    i0.ɵɵtext(21, "C\u00F4ng th\u1EE9c (T\u00EDnh tr\u00EAn 1 m\u1EABu)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "div", 121);
    i0.ɵɵelement(23, "input", 122);
    i0.ɵɵelementStart(24, "span", 123);
    i0.ɵɵelement(25, "i", 124);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(26, "div", 125)(27, "label", 120);
    i0.ɵɵtext(28, "\u0110\u01A1n v\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "select", 126);
    i0.ɵɵrepeaterCreate(30, SopEditorComponent_Conditional_41_For_10_For_31_Template, 2, 2, "option", 68, _forTrack2);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(32, "div", 127)(33, "div", 121)(34, "label", 120);
    i0.ɵɵtext(35, "Ghi ch\u00FA (Note)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div", 121);
    i0.ɵɵelement(37, "i", 128)(38, "input", 129);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(39, "div", 121)(40, "label", 120);
    i0.ɵɵtext(41, "\u0110i\u1EC1u ki\u1EC7n (Conditional)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div", 121);
    i0.ɵɵelement(43, "i", 130)(44, "input", 131);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(45, SopEditorComponent_Conditional_41_For_10_Conditional_45_Template, 10, 0, "div", 132);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_12_0;
    const con_r21 = ctx.$implicit;
    const ɵ$index_327_r18 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    const conType_r33 = i0.ɵɵstoreLet((tmp_12_0 = con_r21.get("type")) == null ? null : tmp_12_0.value);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("z-index", 200 - ɵ$index_327_r18);
    i0.ɵɵproperty("formGroupName", ɵ$index_327_r18);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ɵ$index_327_r18 + 1);
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(conType_r33 === "simple" || conType_r33 === "shared_recipe" ? 13 : 14);
    i0.ɵɵadvance(17);
    i0.ɵɵrepeater(ctx_r1.unitOptions);
    i0.ɵɵadvance(15);
    i0.ɵɵconditional(conType_r33 === "composite" ? 45 : -1);
} }
function SopEditorComponent_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 26)(1, "div", 102)(2, "h3", 103);
    i0.ɵɵtext(3, " Danh S\u00E1ch V\u1EADt T\u01B0 ");
    i0.ɵɵelementStart(4, "span", 104);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "button", 105);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_41_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r16); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addConsumable()); });
    i0.ɵɵtext(7, "+ Th\u00EAm D\u00F2ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 106);
    i0.ɵɵrepeaterCreate(9, SopEditorComponent_Conditional_41_For_10_Template, 46, 7, "div", 107, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.consumables.length);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.consumables.controls);
} }
function SopEditorComponent_Conditional_42_For_18_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r36 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 176)(1, "span", 141);
    i0.ɵɵelement(2, "i", 143);
    i0.ɵɵtext(3, " Kh\u1EDBp danh m\u1EE5c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 186);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_42_For_18_Conditional_9_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r36); const ɵ$index_560_r37 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openTargetModal(ɵ$index_560_r37)); });
    i0.ɵɵelement(5, "i", 187);
    i0.ɵɵtext(6, " Thay Th\u1EBF ");
    i0.ɵɵelementEnd()();
} }
function SopEditorComponent_Conditional_42_For_18_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r38 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 176)(1, "span", 142);
    i0.ɵɵelement(2, "i", 144);
    i0.ɵɵtext(3, " L\u1ED7i: Kh\u00F4ng t\u1ED3n t\u1EA1i!");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 188);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_42_For_18_Conditional_10_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r38); const ɵ$index_560_r37 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openTargetModal(ɵ$index_560_r37)); });
    i0.ɵɵtext(5, "Ch\u1ECDn L\u1EA1i");
    i0.ɵɵelementEnd()();
} }
function SopEditorComponent_Conditional_42_For_18_Template(rf, ctx) { if (rf & 1) {
    const _r35 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "div", 171)(2, "div", 172);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 173)(5, "div", 174)(6, "label", 175)(7, "span");
    i0.ɵɵtext(8, "T\u00EAn ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, SopEditorComponent_Conditional_42_For_18_Conditional_9_Template, 7, 0, "div", 176)(10, SopEditorComponent_Conditional_42_For_18_Conditional_10_Template, 6, 0, "div", 176);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(11, "input", 177);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 178)(13, "label", 99);
    i0.ɵɵtext(14, "M\u00E3 \u0111\u1ECBnh danh (\u0111\u00E3 kh\u00F3a)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(15, "input", 179);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 180)(17, "label", 99);
    i0.ɵɵtext(18, "\u0110\u01A1n v\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(19, "input", 181);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 182)(21, "div")(22, "label", 99);
    i0.ɵɵtext(23, "LOD");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(24, "input", 183);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "div")(26, "label", 99);
    i0.ɵɵtext(27, "LOQ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(28, "input", 184);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "button", 185);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_42_For_18_Template_button_click_29_listener() { const ɵ$index_560_r37 = i0.ɵɵrestoreView(_r35).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.targets.removeAt(ɵ$index_560_r37)); });
    i0.ɵɵelement(30, "i", 80);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_12_0;
    const t_r39 = ctx.$implicit;
    const ɵ$index_560_r37 = ctx.$index;
    const masterItem_r40 = i0.ɵɵnextContext(2).validTargetMap().get(((tmp_12_0 = t_r39.get("id")) == null ? null : tmp_12_0.value) || "");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("border-red-200", !masterItem_r40)("dark:border-red-900", !masterItem_r40)("border-slate-100", masterItem_r40)("dark:border-slate-700", masterItem_r40);
    i0.ɵɵproperty("formGroupName", ɵ$index_560_r37);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("bg-red-100", !masterItem_r40)("text-red-600", !masterItem_r40)("bg-slate-200", masterItem_r40)("text-slate-500", masterItem_r40)("dark:bg-slate-700", masterItem_r40)("dark:text-slate-400", masterItem_r40);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ɵ$index_560_r37 + 1);
    i0.ɵɵadvance(6);
    i0.ɵɵconditional(masterItem_r40 ? 9 : 10);
} }
function SopEditorComponent_Conditional_42_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 170);
    i0.ɵɵtext(1, " Ch\u01B0a c\u00F3 ch\u1EC9 ti\u00EAu n\u00E0o \u0111\u01B0\u1EE3c c\u1EA5u h\u00ECnh. ");
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    const _r34 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 26)(1, "div", 56)(2, "div", 57)(3, "h3", 84);
    i0.ɵɵelement(4, "i", 163);
    i0.ɵɵtext(5, " Danh S\u00E1ch Ch\u1EC9 Ti\u00EAu (Targets) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 12)(7, "button", 164);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_42_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r34); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openGroupImport()); });
    i0.ɵɵelement(8, "i", 165);
    i0.ɵɵtext(9, " Nh\u1EADp t\u1EEB B\u1ED9 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 166);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_42_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r34); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openTargetModal()); });
    i0.ɵɵelement(11, "i", 167);
    i0.ɵɵtext(12, " Ch\u1ECDn t\u1EEB Danh M\u1EE5c G\u1ED1c ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "p", 87);
    i0.ɵɵelement(14, "i", 88);
    i0.ɵɵtext(15, " \u0110\u1ECBnh ngh\u0129a c\u00E1c ch\u1EA5t ph\u00E2n t\u00EDch c\u1EA7n tr\u1EA3 k\u1EBFt qu\u1EA3 trong SOP n\u00E0y (V\u00ED d\u1EE5: Chloramphenicol, Sulfamethoxazole...). ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 168);
    i0.ɵɵrepeaterCreate(17, SopEditorComponent_Conditional_42_For_18_Template, 31, 23, "div", 169, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵtemplate(19, SopEditorComponent_Conditional_42_Conditional_19_Template, 2, 0, "div", 170);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(17);
    i0.ɵɵrepeater(ctx_r1.targets.controls);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.targets.length === 0 ? 19 : -1);
} }
function SopEditorComponent_For_48_Conditional_8_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 194)(1, "span", 195);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 158);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sub_r41 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sub_r41.displayName || sub_r41.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r1.formatNum(sub_r41.totalNeed), " ", sub_r41.stockUnit, "");
} }
function SopEditorComponent_For_48_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 193);
    i0.ɵɵrepeaterCreate(1, SopEditorComponent_For_48_Conditional_8_For_2_Template, 5, 3, "div", 194, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r42 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(item_r42.breakdown);
} }
function SopEditorComponent_For_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 189)(2, "div", 190);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 191);
    i0.ɵɵtext(5);
    i0.ɵɵelementStart(6, "span", 192);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(8, SopEditorComponent_For_48_Conditional_8_Template, 3, 0, "div", 193);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r42 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r42.displayName || item_r42.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.formatNum(item_r42.stockNeed), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r42.stockUnit);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r42.isComposite ? 8 : -1);
} }
function SopEditorComponent_Conditional_49_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 202);
    i0.ɵɵtext(1, " Ch\u01B0a c\u00F3 b\u1ED9 ch\u1EC9 ti\u00EAu n\u00E0o.");
    i0.ɵɵelement(2, "br");
    i0.ɵɵelementStart(3, "a", 203);
    i0.ɵɵtext(4, "T\u1EA1o m\u1EDBi t\u1EA1i \u0111\u00E2y");
    i0.ɵɵelementEnd()();
} }
function SopEditorComponent_Conditional_49_Conditional_9_For_1_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 208);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const g_r45 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(g_r45.description);
} }
function SopEditorComponent_Conditional_49_Conditional_9_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r44 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 205);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_49_Conditional_9_For_1_Template_div_click_0_listener() { const g_r45 = i0.ɵɵrestoreView(_r44).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.importGroup(g_r45)); });
    i0.ɵɵelementStart(1, "div", 206);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 207)(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, SopEditorComponent_Conditional_49_Conditional_9_For_1_Conditional_6_Template, 2, 1, "span", 208);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const g_r45 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(g_r45.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", g_r45.targets.length, " ch\u1EC9 ti\u00EAu");
    i0.ɵɵadvance();
    i0.ɵɵconditional(g_r45.description ? 6 : -1);
} }
function SopEditorComponent_Conditional_49_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SopEditorComponent_Conditional_49_Conditional_9_For_1_Template, 7, 3, "div", 204, _forTrack1);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r1.availableGroups());
} }
function SopEditorComponent_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    const _r43 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 31)(1, "div", 196)(2, "div", 197)(3, "h3", 198);
    i0.ɵɵtext(4, "Ch\u1ECDn Nh\u00F3m Ch\u1EC9 Ti\u00EAu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 199);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_49_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r43); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showGroupModal.set(false)); });
    i0.ɵɵelement(6, "i", 200);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 201);
    i0.ɵɵtemplate(8, SopEditorComponent_Conditional_49_Conditional_8_Template, 5, 0, "div", 202)(9, SopEditorComponent_Conditional_49_Conditional_9_Template, 2, 0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(ctx_r1.availableGroups().length === 0 ? 8 : 9);
} }
function SopEditorComponent_Conditional_50_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 220);
    i0.ɵɵelement(1, "i", 226)(2, "br");
    i0.ɵɵtext(3, " Kh\u00F4ng t\u00ECm th\u1EA5y ch\u1EC9 ti\u00EAu n\u00E0o ph\u00F9 h\u1EE3p.");
    i0.ɵɵelement(4, "br");
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_50_Conditional_17_For_2_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 230);
} }
function SopEditorComponent_Conditional_50_Conditional_17_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r47 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 228);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_50_Conditional_17_For_2_Template_div_click_0_listener() { const m_r48 = i0.ɵɵrestoreView(_r47).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleMasterTargetSelection(m_r48.id)); });
    i0.ɵɵelementStart(1, "div", 229);
    i0.ɵɵtemplate(2, SopEditorComponent_Conditional_50_Conditional_17_For_2_Conditional_2_Template, 1, 0, "i", 230);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 231)(4, "div", 232);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 233);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const m_r48 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(5, _c0, ctx_r1.selectedMasterTargets().has(m_r48.id), !ctx_r1.selectedMasterTargets().has(m_r48.id)));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(8, _c1, ctx_r1.selectedMasterTargets().has(m_r48.id), !ctx_r1.selectedMasterTargets().has(m_r48.id)));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.selectedMasterTargets().has(m_r48.id) ? 2 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(m_r48.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(m_r48.id);
} }
function SopEditorComponent_Conditional_50_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 221);
    i0.ɵɵrepeaterCreate(1, SopEditorComponent_Conditional_50_Conditional_17_For_2_Template, 8, 11, "div", 227, _forTrack1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.filteredMasterTargets());
} }
function SopEditorComponent_Conditional_50_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Thay th\u1EBF ch\u1EC9 ti\u00EAu ");
    i0.ɵɵelementStart(1, "span", 234);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("#", ctx_r1.replacingTargetIndex() + 1, "");
} }
function SopEditorComponent_Conditional_50_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " \u0110\u00E3 ch\u1ECDn: ");
    i0.ɵɵelementStart(1, "span", 234);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.selectedMasterTargets().size);
} }
function SopEditorComponent_Conditional_50_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 187);
    i0.ɵɵtext(1, " C\u1EADp nh\u1EADt ");
} }
function SopEditorComponent_Conditional_50_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 235);
    i0.ɵɵtext(1, " Th\u00EAm v\u00E0o SOP ");
} }
function SopEditorComponent_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    const _r46 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 31)(1, "div", 209)(2, "div", 210)(3, "div")(4, "h3", 211);
    i0.ɵɵelement(5, "i", 212);
    i0.ɵɵtext(6, " Ch\u1ECDn t\u1EEB Danh M\u1EE5c G\u1ED1c ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 213);
    i0.ɵɵtext(8, "Ch\u1ECDn c\u00E1c ch\u1EC9 ti\u00EAu ph\u00E2n t\u00EDch \u0111\u1EC3 th\u00EAm v\u00E0o SOP hi\u1EC7n t\u1EA1i.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 214);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_50_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r46); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showTargetModal.set(false)); });
    i0.ɵɵelement(10, "i", 215);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 216)(12, "div", 121);
    i0.ɵɵelement(13, "i", 217);
    i0.ɵɵelementStart(14, "input", 218);
    i0.ɵɵlistener("input", function SopEditorComponent_Conditional_50_Template_input_input_14_listener($event) { i0.ɵɵrestoreView(_r46); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.targetSearchTerm.set($event.target.value)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(15, "div", 219);
    i0.ɵɵtemplate(16, SopEditorComponent_Conditional_50_Conditional_16_Template, 5, 0, "div", 220)(17, SopEditorComponent_Conditional_50_Conditional_17_Template, 3, 0, "div", 221);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "div", 222)(19, "div", 223);
    i0.ɵɵtemplate(20, SopEditorComponent_Conditional_50_Conditional_20_Template, 3, 1)(21, SopEditorComponent_Conditional_50_Conditional_21_Template, 3, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "div", 12)(23, "button", 224);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_50_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r46); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showTargetModal.set(false)); });
    i0.ɵɵtext(24, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "button", 225);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_50_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r46); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.confirmTargetSelection()); });
    i0.ɵɵtemplate(26, SopEditorComponent_Conditional_50_Conditional_26_Template, 2, 0)(27, SopEditorComponent_Conditional_50_Conditional_27_Template, 2, 0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵproperty("value", ctx_r1.targetSearchTerm());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.filteredMasterTargets().length === 0 ? 16 : 17);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.replacingTargetIndex() !== null ? 20 : 21);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r1.selectedMasterTargets().size === 0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.replacingTargetIndex() !== null ? 26 : 27);
} }
function SopEditorComponent_Conditional_51_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 220);
    i0.ɵɵelement(1, "i", 226)(2, "br");
    i0.ɵɵtext(3, " Kh\u00F4ng t\u00ECm th\u1EA5y d\u1EEF li\u1EC7u n\u00E0o ph\u00F9 h\u1EE3p.");
    i0.ɵɵelement(4, "br");
    i0.ɵɵelementEnd();
} }
function SopEditorComponent_Conditional_51_Conditional_18_For_2_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 255);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r51 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r51.category);
} }
function SopEditorComponent_Conditional_51_Conditional_18_For_2_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 192);
    i0.ɵɵelement(1, "i", 259);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r51 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r51.supplier || item_r51.manufacturer);
} }
function SopEditorComponent_Conditional_51_Conditional_18_For_2_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 258);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r51 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(2, _c2, item_r51.stock <= 0, item_r51.stock > 0));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" Ton: ", ctx_r1.formatNum(item_r51.stock), " ");
} }
function SopEditorComponent_Conditional_51_Conditional_18_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r50 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 250);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_51_Conditional_18_For_2_Template_div_click_0_listener() { const item_r51 = i0.ɵɵrestoreView(_r50).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.selectConsumable(item_r51)); });
    i0.ɵɵelementStart(1, "div", 251)(2, "div", 252);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 253)(5, "span", 254);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, SopEditorComponent_Conditional_51_Conditional_18_For_2_Conditional_7_Template, 2, 1, "span", 255)(8, SopEditorComponent_Conditional_51_Conditional_18_For_2_Conditional_8_Template, 3, 1, "span", 192);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 256)(10, "div", 257);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, SopEditorComponent_Conditional_51_Conditional_18_For_2_Conditional_12_Template, 2, 5, "div", 258);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r51 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r51.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("ID: ", item_r51.id, "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r51.category ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r51.supplier || item_r51.manufacturer ? 8 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r51.unit || item_r51.baseUnit);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r51.stock !== undefined ? 12 : -1);
} }
function SopEditorComponent_Conditional_51_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 248);
    i0.ɵɵrepeaterCreate(1, SopEditorComponent_Conditional_51_Conditional_18_For_2_Template, 13, 6, "div", 249, _forTrack1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.filteredConsumables());
} }
function SopEditorComponent_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    const _r49 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 32)(1, "div", 236);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_51_Template_div_click_1_listener() { i0.ɵɵrestoreView(_r49); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showConsumableModal.set(false)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 237)(3, "div", 238)(4, "div")(5, "h2", 239);
    i0.ɵɵelement(6, "i", 240);
    i0.ɵɵtext(7, " Ch\u1ECDn H\u00F3a Ch\u1EA5t ho\u1EB7c C\u00F4ng Th\u1EE9c ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 241);
    i0.ɵɵtext(9, "T\u00ECm v\u00E0 ch\u1ECDn trong danh m\u1EE5c ch\u1EC9 ti\u00EAu g\u1ED1c.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "button", 242);
    i0.ɵɵlistener("click", function SopEditorComponent_Conditional_51_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r49); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showConsumableModal.set(false)); });
    i0.ɵɵelement(11, "i", 243);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 244)(13, "div", 121);
    i0.ɵɵelement(14, "i", 245);
    i0.ɵɵelementStart(15, "input", 246);
    i0.ɵɵlistener("input", function SopEditorComponent_Conditional_51_Template_input_input_15_listener($event) { i0.ɵɵrestoreView(_r49); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.consumableSearchTerm.set($event.target.value)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "div", 247);
    i0.ɵɵtemplate(17, SopEditorComponent_Conditional_51_Conditional_17_Template, 5, 0, "div", 220)(18, SopEditorComponent_Conditional_51_Conditional_18_Template, 3, 0, "div", 248);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(15);
    i0.ɵɵproperty("value", ctx_r1.consumableSearchTerm());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.filteredConsumables().length === 0 ? 17 : 18);
} }
const STANDARD_VARS = [
    { value: 'total_n', label: 'Biến: Tổng số mẫu (n_sample + n_qc)' },
    { value: 'total_vol_solvent', label: 'Biến: Tổng thể tích dung môi (mL)' },
    { value: 'v_extract', label: 'Biến: Thể tích dịch chiết (mL)' }
];
export class SopEditorComponent {
    constructor() {
        // Services & State
        this.state = inject(StateService);
        this.sopService = inject(SopService);
        this.invService = inject(InventoryService);
        this.recipeService = inject(RecipeService);
        this.targetService = inject(TargetService);
        this.masterTargetService = inject(MasterTargetService);
        this.matrixTypeService = inject(MatrixTypeService);
        this.toast = inject(ToastService);
        this.confirmationService = inject(ConfirmationService);
        this.calcService = inject(CalculatorService);
        this.fbService = inject(FirebaseService);
        this.masterDeviceService = inject(MasterDeviceService);
        this.router = inject(Router);
        this.fb = inject(FormBuilder);
        // Helpers
        this.unitOptions = UNIT_OPTIONS;
        this.formatNum = formatNum;
        this.standardVars = STANDARD_VARS;
        // State Signals
        this.currentId = signal(null);
        this.currentVersion = signal(1);
        this.currentTab = signal('general');
        this.isLoading = signal(false);
        this.previewResults = signal([]);
        this.availableMatrices = signal([]);
        this.selectedMatrixTags = signal([]);
        this.availableDevices = signal([]);
        this.selectedAllowedDevices = signal([]);
        // Consumables Validation & Modal
        this.masterInventory = signal([]);
        this.masterRecipes = signal([]);
        this.showConsumableModal = signal(false);
        this.consumableSearchTerm = signal('');
        this.activeConsumableSearch = null;
        this.validInventoryMap = computed(() => {
            const map = new Map();
            this.masterInventory().forEach(i => map.set(i.id, i));
            return map;
        });
        this.validRecipeMap = computed(() => {
            const map = new Map();
            this.masterRecipes().forEach(r => map.set(r.id, r));
            return map;
        });
        this.filteredConsumables = computed(() => {
            const term = this.consumableSearchTerm().toLowerCase().trim();
            const active = this.activeConsumableSearch;
            if (!active)
                return [];
            const conType = !active.isIngredient ? this.consumables.at(active.index).get('type')?.value : 'simple';
            if (conType === 'shared_recipe') {
                const all = this.masterRecipes();
                if (!term)
                    return all.slice(0, 50); // limit to avoid lag
                return all.filter(r => r.name.toLowerCase().includes(term) || r.id.includes(term)).slice(0, 50);
            }
            else {
                const all = this.masterInventory();
                if (!term)
                    return all.slice(0, 50);
                return all.filter(i => (i.name && i.name.toLowerCase().includes(term)) || i.id.includes(term) || (i.category && i.category.toLowerCase().includes(term))).slice(0, 50);
            }
        });
        // Import Group Modal
        this.showGroupModal = signal(false);
        this.availableGroups = signal([]);
        // Master Targets Selection Modal
        this.masterTargets = signal([]);
        this.showTargetModal = signal(false);
        this.targetSearchTerm = signal('');
        this.selectedMasterTargets = signal(new Set());
        this.replacingTargetIndex = signal(null);
        this.filteredMasterTargets = computed(() => {
            const term = this.targetSearchTerm().toLowerCase().trim();
            const all = this.masterTargets();
            if (!term)
                return all;
            return all.filter(t => t.name.toLowerCase().includes(term) || t.id.includes(term));
        });
        this.validTargetMap = computed(() => {
            const masters = this.masterTargets();
            const map = new Map();
            masters.forEach(m => map.set(m.id, true));
            return map;
        });
        this.CORE_INPUTS = [{ var: 'n_sample', label: 'Số lượng mẫu', type: 'number', default: 1, step: 1, unitLabel: 'mẫu' }, { var: 'n_qc', label: 'Số lượng QC', type: 'number', default: 8, step: 1, unitLabel: 'mẫu' }, { var: 'w_sample', label: 'Khối lượng mẫu', type: 'number', default: 10, step: 0.1, unitLabel: 'g' }];
        this.form = this.fb.group({
            id: [''], category: ['', Validators.required], name: ['', Validators.required], ref: [''],
            version: [1, [Validators.required, Validators.min(1)]],
            device: [''],
            inputs: this.fb.array([]),
            variablesList: this.fb.array([]),
            consumables: this.fb.array([]),
            targets: this.fb.array([]), // New Targets Array
            isManualOnly: [false]
        });
        effect((onCleanup) => {
            const sop = this.state.editingSop();
            if (sop) {
                if (sop.id)
                    this.loadSop(sop);
                else {
                    this.loadSop(sop);
                    this.currentId.set(null);
                    this.currentVersion.set(1);
                    this.form.patchValue({ id: '', version: 1 });
                }
            }
            else {
                this.createNew();
            }
            const sub = this.form.valueChanges.pipe(debounceTime(300)).subscribe(val => { this.runPreview(val); });
            onCleanup(() => sub.unsubscribe());
        });
        // Load Master Data
        this.invService.getAllInventory().then(inv => this.masterInventory.set(inv));
        this.recipeService.getAllRecipes().then(rec => this.masterRecipes.set(rec));
    }
    // --- Strict Mode Form Logic ---
    onTypeChange(index) {
        const con = this.consumables.at(index);
        con.patchValue({ name: '', _displayName: '', recipeId: '' });
    }
    updateCompositeId(index) {
        const con = this.consumables.at(index);
        const display = con.get('_displayName')?.value;
        if (display)
            con.patchValue({ name: 'mix_' + generateSlug(display) });
    }
    openConsumableModal(index, isIngredient, subIndex) {
        this.activeConsumableSearch = { index, isIngredient, subIndex };
        this.consumableSearchTerm.set('');
        this.showConsumableModal.set(true);
    }
    selectConsumable(item) {
        if (!this.activeConsumableSearch)
            return;
        const { index, isIngredient, subIndex } = this.activeConsumableSearch;
        if (isIngredient) {
            const control = this.getIngredients(index).at(subIndex);
            control.patchValue({ name: item.id, unit: item.unit, _displayName: item.name });
        }
        else {
            const control = this.consumables.at(index);
            const type = control.get('type')?.value;
            if (type === 'shared_recipe') {
                control.patchValue({
                    name: item.id,
                    recipeId: item.id,
                    unit: item.baseUnit,
                    _displayName: item.name
                });
            }
            else {
                control.patchValue({ name: item.id, unit: item.unit, _displayName: item.name });
            }
        }
        this.showConsumableModal.set(false);
        this.activeConsumableSearch = null;
    }
    // --- Getters & Form Manipulation ---
    get inputs() { return this.form.get('inputs'); }
    get variablesList() { return this.form.get('variablesList'); }
    get consumables() { return this.form.get('consumables'); }
    get targets() { return this.form.get('targets'); }
    getIngredients(conIndex) { return this.consumables.at(conIndex).get('ingredients'); }
    createNew() {
        this.currentId.set(null);
        this.currentVersion.set(1);
        this.currentTab.set('general');
        this.form.reset({ id: '', category: '', name: '', ref: '', version: 1, device: '', isManualOnly: false });
        this.selectedAllowedDevices.set([]);
        this.inputs.clear();
        this.variablesList.clear();
        this.consumables.clear();
        this.targets.clear();
        this.CORE_INPUTS.forEach(ci => { this.addInputRaw(ci.var, ci.label, ci.default, ci.type, ci.step, ci.unitLabel); });
        this.previewResults.set([]);
    }
    loadSop(sop) {
        if (sop.id)
            this.currentId.set(sop.id);
        this.currentVersion.set(sop.version || 1);
        this.currentTab.set('general');
        this.form.patchValue({ id: sop.id, category: sop.category, name: sop.name, ref: sop.ref, version: sop.version || 1, device: sop.device || '', isManualOnly: sop.isManualOnly || false });
        this.selectedAllowedDevices.set(sop.allowedDevices || []);
        if (this.availableDevices().length === 0) {
            this.masterDeviceService.getAll().then(d => this.availableDevices.set(d));
        }
        this.inputs.clear();
        const loadedVars = new Set();
        sop.inputs.forEach(i => {
            this.addInputRaw(i.var, i.label, i.default, i.type, i.step, i.unitLabel, i.options);
            loadedVars.add(i.var);
        });
        this.CORE_INPUTS.forEach(ci => { if (!loadedVars.has(ci.var)) {
            this.addInputRaw(ci.var, ci.label, ci.default, ci.type, ci.step, ci.unitLabel);
        } });
        this.variablesList.clear();
        if (sop.variables)
            Object.entries(sop.variables).forEach(([k, v]) => this.variablesList.push(this.fb.group({ key: [k, Validators.required], formula: [v, Validators.required] })));
        this.consumables.clear();
        sop.consumables.forEach(c => {
            const g = this.fb.group({
                name: [c.name || ''],
                recipeId: [c.recipeId || ''],
                _displayName: [c._displayName || c.name || ''],
                base_note: [c.base_note || ''], formula: [c.formula || ''], unit: [c.unit || ''], type: [c.type || 'simple'], condition: [c.condition || ''], ingredients: this.fb.array([])
            });
            if (c.ingredients)
                c.ingredients.forEach(ing => g.get('ingredients').push(this.fb.group({ name: [ing.name, Validators.required], _displayName: [ing._displayName || ing.name, Validators.required], amount: [ing.amount, Validators.required], unit: [ing.unit, Validators.required] })));
            this.consumables.push(g);
        });
        this.targets.clear();
        if (sop.targets) {
            sop.targets.forEach(t => this.addTargetRaw(t));
        }
        if (this.availableMatrices().length === 0) {
            this.matrixTypeService.getAll().then(m => this.availableMatrices.set(m));
        }
        this.selectedMatrixTags.set(sop.matrixTags || []);
        if (this.masterTargets().length === 0) {
            this.masterTargetService.getAll().then(m => this.masterTargets.set(m));
        }
        this.runPreview(this.form.getRawValue());
    }
    toggleMatrixTag(id) {
        const current = this.selectedMatrixTags();
        if (current.includes(id)) {
            this.selectedMatrixTags.set(current.filter(x => x !== id));
        }
        else {
            this.selectedMatrixTags.set([...current, id]);
        }
    }
    clearMatrixTags() {
        this.selectedMatrixTags.set([]);
    }
    toggleAllowedDevice(name) {
        const current = this.selectedAllowedDevices();
        let next;
        if (current.includes(name)) {
            next = current.filter(x => x !== name);
        }
        else {
            next = [...current, name];
        }
        this.selectedAllowedDevices.set(next);
        // Nếu thiết bị mặc định hiện tại không nằm trong danh sách mới, reset về rỗng
        const currentDefault = this.form.get('device')?.value;
        if (currentDefault && !next.includes(currentDefault)) {
            this.form.patchValue({ device: '' });
        }
    }
    // --- Preview & Save ---
    runPreview(formVal) {
        try {
            const mockInputs = {};
            (formVal.inputs || []).forEach((i) => { if (i.var)
                mockInputs[i.var] = i.default; });
            const variables = {};
            formVal.variablesList.forEach(v => { if (v.key && v.formula)
                variables[v.key] = v.formula; });
            const tempSop = {
                id: 'preview', category: 'p', name: 'P',
                inputs: formVal.inputs, variables: variables,
                consumables: formVal.consumables.map(c => ({
                    ...c, name: c.name || '', recipeId: c.recipeId, ingredients: c.ingredients || []
                }))
            };
            const results = this.calcService.calculateSopNeeds(tempSop, mockInputs, 0);
            this.previewResults.set(results);
        }
        catch (e) { }
    }
    async save() {
        this.isLoading.set(true);
        let formVal = this.form.value;
        if (!formVal.id) {
            this.form.patchValue({ id: `sop_${Date.now()}` });
            formVal = this.form.value;
        }
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.toast.show('Kiểm tra các trường bắt buộc!', 'error');
            this.isLoading.set(false);
            return;
        }
        // 1. AUTO-FIX IDs FOR TARGETS BEFORE VALIDATION
        const rawTargets = formVal.targets;
        rawTargets.forEach((t, index) => {
            // If ID is empty but Name exists, generate Canonical ID
            if (!t.id && t.name) {
                const newId = getCanonicalId(t.name);
                this.targets.at(index).patchValue({ id: newId });
                t.id = newId; // Update local ref for next check
            }
        });
        // 2. FILTER & VALIDATE DUPLICATES
        // Filter out rows that have NO ID (likely empty rows user forgot to delete)
        const validTargetIds = rawTargets.map(t => t.id).filter(id => id && id.trim() !== '');
        const uniqueTargetIds = new Set(validTargetIds);
        if (validTargetIds.length !== uniqueTargetIds.size) {
            this.toast.show('Lỗi: Có mã ID chỉ tiêu bị trùng lặp (hoặc tên giống nhau).', 'error');
            this.currentTab.set('targets');
            this.isLoading.set(false);
            return;
        }
        const invalidConsumable = formVal.consumables.find((c) => !c.name || c.name.trim() === '');
        if (invalidConsumable) {
            this.toast.show('Một số hóa chất chưa chọn ID hợp lệ!', 'error');
            this.currentTab.set('consumables');
            this.isLoading.set(false);
            return;
        }
        const variables = {};
        formVal.variablesList.forEach(v => { if (v.key && v.formula)
            variables[v.key] = v.formula; });
        // 3. CONSTRUCT FINAL OBJECT
        const sop = {
            id: formVal.id, category: formVal.category, name: formVal.name, ref: formVal.ref || '',
            inputs: formVal.inputs.map(i => {
                const res = { ...i };
                // Parse optionsStr if present
                if (res.type === 'select' && res.optionsStr) {
                    res.options = this.parseOptions(res.optionsStr);
                    delete res.optionsStr;
                }
                return res;
            }),
            variables: variables,
            consumables: formVal.consumables.map((c) => {
                return {
                    name: c.name, recipeId: c.recipeId, _displayName: c._displayName,
                    base_note: c.base_note, formula: c.formula, unit: c.unit, type: c.type,
                    condition: c.condition,
                    ingredients: (c.ingredients || []).map((ing) => ({ name: ing.name, amount: ing.amount, unit: ing.unit, _displayName: ing._displayName }))
                };
            }),
            targets: formVal.targets
                .filter(t => t.id && t.name)
                .map(t => ({ id: t.id, name: t.name, unit: t.unit, lod: t.lod, loq: t.loq })),
            matrixTags: this.selectedMatrixTags().length > 0 ? this.selectedMatrixTags() : null,
            device: formVal.device || null,
            allowedDevices: this.selectedAllowedDevices().length > 0 ? this.selectedAllowedDevices() : null,
            isManualOnly: formVal.isManualOnly || false,
            version: formVal.version || this.currentVersion()
        };
        try {
            await this.sopService.saveSop(sop);
            this.toast.show('Đã lưu quy trình thành công!');
            this.state.selectedSop.set(sop);
            this.state.editingSop.set(null);
            this.router.navigate(['/calculator']);
        }
        catch (e) {
            this.toast.show('Lỗi lưu SOP: ' + (e.message || 'Unknown'), 'error');
        }
        finally {
            this.isLoading.set(false);
        }
    }
    goBack() { this.state.editingSop.set(null); this.router.navigate(['/calculator']); }
    // Helper methods
    addInput() { this.addInputRaw('', '', 0, 'number', 1, ''); }
    addInputRaw(v, l, d, t, s, u, options) {
        const optsStr = options ? options.map(o => `${o.value}:${o.label}`).join(', ') : '';
        this.inputs.push(this.fb.group({
            var: [v, Validators.required],
            label: [l, Validators.required],
            default: [d],
            type: [t],
            step: [s],
            unitLabel: [u],
            optionsStr: [optsStr] // Add intermediate control string
        }));
    }
    // HELPER: Parse "0:Fish, 1:Milk" -> [{value: 0, label: Fish}, ...]
    parseOptions(str) {
        if (!str)
            return [];
        return str.split(',').map(part => {
            const [val, lbl] = part.split(':');
            if (!val || !lbl)
                return null;
            const cleanVal = val.trim();
            // Check if number
            const numVal = Number(cleanVal);
            return {
                value: isNaN(numVal) ? cleanVal : numVal,
                label: lbl.trim()
            };
        }).filter(x => x !== null);
    }
    addVariable() { this.variablesList.push(this.fb.group({ key: ['', Validators.required], formula: ['', Validators.required] })); }
    addConsumable() { this.consumables.push(this.fb.group({ name: [''], _displayName: [''], recipeId: [''], base_note: [''], formula: [''], unit: ['ml'], type: ['simple'], condition: [''], ingredients: this.fb.array([]) })); }
    addIngredient(conIndex) { this.getIngredients(conIndex).push(this.fb.group({ name: ['', Validators.required], _displayName: ['', Validators.required], amount: [0, Validators.required], unit: ['ml', Validators.required] })); }
    // Target Methods
    addTarget() {
        this.addTargetRaw({ id: '', name: '', unit: 'ppb' });
    }
    addTargetRaw(t) {
        this.targets.push(this.fb.group({
            id: [t.id || '', Validators.required],
            name: [t.name || '', Validators.required],
            unit: [t.unit || ''],
            lod: [t.lod || ''],
            loq: [t.loq || '']
        }));
    }
    onTargetNameChange(index, event) {
        const val = event.target.value;
        const idControl = this.targets.at(index).get('id');
        // Fix: Use pristine check. 
        // If the user hasn't manually touched the ID field (pristine=true), auto-generate it.
        // Also update if ID is empty (just in case it was touched but cleared).
        if (idControl && (idControl.pristine || !idControl.value)) {
            idControl.setValue(getCanonicalId(val));
        }
    }
    // --- NEW: IMPORT FROM GROUP ---
    async openGroupImport() {
        this.isLoading.set(true);
        try {
            const groups = await this.targetService.getAllGroups();
            this.availableGroups.set(groups);
            this.showGroupModal.set(true);
        }
        catch (e) {
            this.toast.show('Lỗi tải danh sách bộ chỉ tiêu.', 'error');
        }
        finally {
            this.isLoading.set(false);
        }
    }
    importGroup(g) {
        if (!g.targets || g.targets.length === 0) {
            this.toast.show('Bộ chỉ tiêu này trống.', 'info');
            return;
        }
        const existingIds = new Set(this.targets.value.map(t => t.id));
        let addedCount = 0;
        g.targets.forEach(t => {
            if (!existingIds.has(t.id)) {
                this.addTargetRaw(t);
                existingIds.add(t.id); // Prevent dupes if group has dupes itself
                addedCount++;
            }
        });
        if (addedCount > 0) {
            this.toast.show(`Đã thêm ${addedCount} chỉ tiêu từ bộ "${g.name}".`, 'success');
        }
        else {
            this.toast.show('Tất cả chỉ tiêu trong bộ này đã có sẵn.', 'info');
        }
        this.showGroupModal.set(false);
    }
    openTargetModal(index) {
        if (typeof index === 'number') {
            this.replacingTargetIndex.set(index);
        }
        else {
            this.replacingTargetIndex.set(null);
        }
        this.targetSearchTerm.set('');
        this.selectedMasterTargets.set(new Set());
        this.showTargetModal.set(true);
    }
    toggleMasterTargetSelection(id) {
        const current = this.selectedMasterTargets();
        if (this.replacingTargetIndex() !== null) {
            if (current.has(id)) {
                current.delete(id);
            }
            else {
                current.clear();
                current.add(id);
            }
            this.selectedMasterTargets.set(new Set(current));
            return;
        }
        if (current.has(id))
            current.delete(id);
        else
            current.add(id);
        this.selectedMasterTargets.set(new Set(current));
    }
    confirmTargetSelection() {
        const selectedIds = this.selectedMasterTargets();
        const masters = this.masterTargets();
        const replaceIdx = this.replacingTargetIndex();
        if (replaceIdx !== null) {
            if (selectedIds.size === 1) {
                const selectedId = Array.from(selectedIds)[0];
                const m = masters.find(x => x.id === selectedId);
                if (m) {
                    const targetCtrl = this.targets.at(replaceIdx);
                    targetCtrl.patchValue({
                        id: m.id,
                        name: m.name,
                        unit: m.default_unit || 'ppb'
                    });
                    this.toast.show(`Đã cập nhật chỉ tiêu thành: ${m.name}`, 'success');
                }
            }
            this.showTargetModal.set(false);
            return;
        }
        const currentIds = new Set(this.targets.value.map((t) => t.id));
        let addedCount = 0;
        selectedIds.forEach(id => {
            if (!currentIds.has(id)) {
                const m = masters.find(x => x.id === id);
                if (m) {
                    this.targets.push(this.fb.group({
                        id: [m.id],
                        name: [m.name],
                        unit: [m.default_unit || 'ppb'],
                        lod: [''],
                        loq: ['']
                    }));
                    addedCount++;
                }
            }
        });
        if (addedCount > 0) {
            this.toast.show(`Đã thêm ${addedCount} chỉ tiêu vào danh sách.`, 'success');
        }
        this.showTargetModal.set(false);
    }
    static { this.ɵfac = function SopEditorComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SopEditorComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SopEditorComponent, selectors: [["app-sop-editor"]], decls: 52, vars: 23, consts: [[1, "h-full", "flex", "flex-col", "bg-slate-100", "dark:bg-slate-900", "fade-in", "text-slate-800", "dark:text-slate-200", "relative"], [1, "h-14", "bg-white", "dark:bg-slate-800", "border-b", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-between", "px-4", "shrink-0", "shadow-sm", "z-30"], [1, "flex", "items-center", "gap-4"], [1, "text-slate-500", "dark:text-slate-400", "hover:text-slate-800", "dark:hover:text-slate-200", "text-sm", "font-bold", "flex", "items-center", "gap-2", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-arrow-left"], [1, "hidden", "md:inline"], [1, "h-6", "w-px", "bg-slate-200", "dark:bg-slate-700"], [1, "text-base", "font-bold", "text-slate-800", "dark:text-slate-200", "flex", "items-center", "gap-2", "leading-none"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-mono", "mt-1", "flex", "items-center", "gap-3"], [1, "flex", "items-center", "bg-slate-100", "dark:bg-slate-900", "rounded", "px-1.5", "py-0.5", "border", "border-slate-200", "dark:border-slate-700", "focus-within:border-blue-400", "dark:focus-within:border-blue-500", "focus-within:ring-1", "focus-within:ring-blue-100", "dark:focus-within:ring-blue-900/30", "transition-all"], [1, "text-slate-500", "dark:text-slate-400", "font-bold", "mr-1"], ["type", "number", "min", "1", 1, "bg-transparent", "w-8", "text-[10px]", "font-bold", "text-blue-700", "dark:text-blue-400", "outline-none", "text-center", 3, "formControl"], [1, "flex", "gap-2"], [1, "px-4", "py-1.5", "bg-blue-600", "dark:bg-blue-500", "text-white", "rounded", "shadow-sm", "hover:bg-blue-700", "dark:hover:bg-blue-600", "text-sm", "font-bold", "transition", "flex", "items-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-floppy-disk"], [1, "flex-1", "flex", "overflow-hidden", "relative"], [1, "absolute", "inset-0", "bg-white/50", "dark:bg-slate-900/50", "z-50", "cursor-wait"], [1, "flex-1", "flex", "flex-col", "min-w-0", "bg-slate-50", "dark:bg-slate-900", "overflow-hidden", "border-r", "border-slate-200", "dark:border-slate-700"], [1, "flex", "bg-white", "dark:bg-slate-800", "border-b", "border-slate-200", "dark:border-slate-700", "px-4", "gap-6", "shrink-0", "overflow-x-auto", "no-scrollbar"], [1, "py-3", "text-xs", "font-bold", "border-b-2", "transition", "flex", "items-center", "gap-2", "uppercase", "tracking-wide", "whitespace-nowrap", 3, "click"], [1, "fa-solid", "fa-bullseye"], [1, "flex-1", "overflow-y-auto", "p-4", "md:p-6", "custom-scrollbar"], [1, "max-w-5xl", "mx-auto", "space-y-6", 3, "formGroup"], [1, "space-y-6", "fade-in"], [1, "bg-white", "dark:bg-slate-800", "p-5", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "fade-in"], [1, "fade-in", "pb-32"], [1, "w-96", "bg-white", "dark:bg-slate-800", "border-l", "border-slate-200", "dark:border-slate-700", "flex", "flex-col", "shrink-0", "shadow-xl", "z-20"], [1, "p-3", "border-b", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/50", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-400"], [1, "flex-1", "overflow-y-auto", "p-3", "space-y-3", "custom-scrollbar"], [1, "border-b", "border-slate-100", "dark:border-slate-700/50", "last:border-0", "pb-2"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "fixed", "inset-0", "z-[1000]", "flex", "items-center", "justify-center", "p-4", "sm:p-6", "fade-in"], [1, "bg-white", "dark:bg-slate-800", "p-5", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "space-y-4"], [1, "block", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "mb-1"], [1, "text-red-500"], ["formControlName", "name", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded-lg", "p-3", "text-sm", "font-bold", "outline-none", "focus:border-blue-500", "dark:focus:border-blue-400", "transition"], [1, "grid", "grid-cols-2", "gap-4"], ["formControlName", "category", "placeholder", "VD: NAFI6 H-9.21", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded-lg", "p-3", "text-sm", "outline-none", "focus:border-blue-500", "dark:focus:border-blue-400", "transition"], ["formControlName", "ref", "placeholder", "VD: AOAC 2007.01", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded-lg", "p-3", "text-sm", "outline-none", "focus:border-blue-500", "dark:focus:border-blue-400", "transition"], [1, "flex", "items-center", "gap-2", "pt-1"], ["type", "checkbox", "id", "isManualOnly", "formControlName", "isManualOnly", 1, "w-4", "h-4", "text-blue-600", "border-slate-300", "rounded", "focus:ring-blue-500", "cursor-pointer"], ["for", "isManualOnly", 1, "text-xs", "font-bold", "text-slate-600", "dark:text-slate-400", "cursor-pointer", "select-none"], [1, "space-y-2", "border-t", "border-slate-100", "dark:border-slate-700/50", "pt-4", "mt-2"], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "px-3", "py-1.5", "rounded-full", "text-sm", "font-semibold", "border", "transition-all", "flex", "items-center", "gap-1", "bg-white", "dark:bg-slate-800", "border-slate-400", "text-slate-500", "dark:text-slate-400", 3, "click"], [1, "w-2", "h-2", "rounded-full", "bg-slate-400"], [1, "fa-solid", "fa-check", "ml-1", "text-[10px]"], ["type", "button", 1, "px-3", "py-1.5", "rounded-full", "text-sm", "font-semibold", "border", "transition-all", "flex", "items-center", "gap-1", "bg-white", "dark:bg-slate-800", 3, "class", "border-color", "color"], [1, "text-[10px]", "text-amber-600", "dark:text-amber-500", "bg-amber-50", "dark:bg-amber-900/20", "px-3", "py-2", "rounded-lg", "inline-block", "border", "border-amber-100", "dark:border-amber-900/30"], [1, "space-y-4", "border-t", "border-slate-100", "dark:border-slate-700/50", "pt-4", "mt-2"], ["type", "button", 1, "px-3", "py-1.5", "rounded-lg", "text-sm", "font-semibold", "border", "transition-all", "flex", "items-center", "gap-2", "shadow-sm", 3, "class"], [1, "text-[10px]", "text-amber-600", "dark:text-amber-500", "bg-amber-50", "dark:bg-amber-900/20", "px-3", "py-2", "rounded-lg", "inline-block", "border", "border-amber-100", "dark:border-amber-900/30", "mt-2"], [1, "max-w-xs"], ["formControlName", "device", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-white", "dark:bg-slate-800", "rounded-lg", "p-2", "text-sm", "font-bold", "outline-none", "focus:border-blue-500", "dark:focus:border-blue-400", "transition", "cursor-pointer"], ["value", ""], [1, "bg-white", "dark:bg-slate-800", "p-5", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-sm", "uppercase"], ["type", "button", 1, "text-xs", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "px-3", "py-1.5", "rounded-lg", "font-bold", "text-slate-600", "dark:text-slate-300", "transition", 3, "click"], ["formArrayName", "inputs", 1, "space-y-3"], [1, "flex", "flex-col", "gap-2", "p-3", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700", "group", 3, "formGroupName"], ["type", "button", 1, "px-3", "py-1.5", "rounded-full", "text-sm", "font-semibold", "border", "transition-all", "flex", "items-center", "gap-1", "bg-white", "dark:bg-slate-800", 3, "click"], [1, "w-2", "h-2", "rounded-full"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"], ["type", "button", 1, "px-3", "py-1.5", "rounded-lg", "text-sm", "font-semibold", "border", "transition-all", "flex", "items-center", "gap-2", "shadow-sm", 3, "click"], [1, "fa-solid", "fa-microchip"], [1, "fa-solid", "fa-check", "ml-1", "text-blue-600", "dark:text-blue-400"], [3, "value"], [1, "flex", "gap-2", "items-start"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-2", "flex-1"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase"], ["formControlName", "var", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded", "px-2", "py-1.5", "text-xs", "font-mono", "font-bold", "text-blue-600", "dark:text-blue-400", "outline-none"], ["formControlName", "label", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded", "px-2", "py-1.5", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none"], ["formControlName", "type", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "rounded", "px-2", "py-1.5", "text-xs", "outline-none", "bg-white", "dark:bg-slate-800"], ["value", "number"], ["value", "checkbox"], ["value", "select"], ["formControlName", "default", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded", "px-2", "py-1.5", "text-xs", "font-bold", "outline-none"], ["type", "button", 1, "mt-4", "text-slate-300", "dark:text-slate-500", "hover:text-red-500", "dark:hover:text-red-400", "transition", "px-2", 3, "click"], [1, "fa-solid", "fa-trash"], [1, "pl-2", "border-l-2", "border-orange-200", "dark:border-orange-800/50", "ml-1"], [1, "text-[9px]", "font-bold", "text-orange-600", "dark:text-orange-400", "uppercase"], ["formControlName", "optionsStr", "placeholder", "0:Th\u1EE7y s\u1EA3n, 1:S\u1EEFa, 2:Phomat", 1, "w-full", "border", "border-orange-200", "dark:border-orange-800/50", "rounded", "px-2", "py-1.5", "text-xs", "bg-orange-50", "dark:bg-orange-900/20", "focus:bg-white", "dark:focus:bg-slate-800", "transition", "outline-none", "placeholder-orange-300", "dark:placeholder-orange-700"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-sm", "uppercase", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-calculator", "text-purple-500", "dark:text-purple-400"], ["type", "button", 1, "text-xs", "bg-purple-50", "dark:bg-purple-900/20", "text-purple-700", "dark:text-purple-400", "hover:bg-purple-100", "dark:hover:bg-purple-900/40", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition", 3, "click"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mb-4", "bg-slate-50", "dark:bg-slate-800/50", "p-3", "rounded-lg", "border", "border-slate-100", "dark:border-slate-700"], [1, "fa-solid", "fa-circle-info", "mr-1"], [1, "dark:text-slate-300"], ["formArrayName", "variablesList", 1, "space-y-3"], [1, "flex", "gap-2", "items-center", "p-3", "border", "border-purple-100", "dark:border-purple-900/30", "bg-purple-50/30", "dark:bg-purple-900/10", "rounded-xl", "relative", "group", 3, "formGroupName"], [1, "w-1/3"], [1, "text-[9px]", "font-bold", "text-purple-400", "dark:text-purple-500", "uppercase", "mb-1", "block"], ["formControlName", "key", "list", "std_vars", "placeholder", "VD: total_vol", 1, "w-full", "border", "border-purple-200", "dark:border-purple-800/50", "bg-transparent", "rounded-lg", "px-3", "py-2", "text-xs", "font-mono", "font-bold", "text-purple-700", "dark:text-purple-400", "outline-none", "focus:bg-white", "dark:focus:bg-slate-800", "transition"], ["id", "std_vars"], [1, "flex", "items-center", "justify-center", "pt-4", "text-purple-300", "dark:text-purple-600"], [1, "fa-solid", "fa-equals"], [1, "flex-1"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "mb-1", "block"], ["formControlName", "formula", "placeholder", "VD: n_sample * 10", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded-lg", "px-3", "py-2", "text-xs", "font-mono", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-purple-500", "dark:focus:border-purple-400", "focus:bg-white", "dark:focus:bg-slate-800", "transition"], ["type", "button", 1, "mt-4", "w-8", "h-8", "flex", "items-center", "justify-center", "text-slate-300", "dark:text-slate-500", "hover:text-red-500", "dark:hover:text-red-400", "transition", "rounded-full", "hover:bg-white", "dark:hover:bg-slate-800", 3, "click"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center", "gap-2"], [1, "bg-orange-100", "dark:bg-orange-900/30", "text-orange-700", "dark:text-orange-400", "text-[10px]", "px-2", "py-0.5", "rounded-full"], ["type", "button", 1, "text-xs", "bg-slate-800", "dark:bg-slate-700", "text-white", "hover:bg-slate-700", "dark:hover:bg-slate-600", "px-4", "py-2", "rounded-lg", "font-bold", "transition", 3, "click"], ["formArrayName", "consumables", 1, "space-y-4"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "shadow-sm", "overflow-visible", "group", "transition", "hover:shadow-md", "dark:hover:shadow-none", "hover:border-blue-300", "dark:hover:border-blue-500", "relative", "z-0", 3, "formGroupName", "zIndex"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "shadow-sm", "overflow-visible", "group", "transition", "hover:shadow-md", "dark:hover:shadow-none", "hover:border-blue-300", "dark:hover:border-blue-500", "relative", "z-0", 3, "formGroupName"], [1, "bg-slate-50", "dark:bg-slate-800/50", "p-3", "flex", "items-center", "gap-3", "border-b", "border-slate-100", "dark:border-slate-700"], [1, "w-6", "h-6", "rounded", "bg-slate-200", "dark:bg-slate-700", "text-slate-500", "dark:text-slate-400", "flex", "items-center", "justify-center", "text-xs", "font-bold"], ["formControlName", "type", 1, "text-[10px]", "font-bold", "uppercase", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-2", "py-1", "outline-none", "focus:border-blue-500", "dark:focus:border-blue-400", "cursor-pointer", "w-32", 3, "change"], ["value", "simple"], ["value", "shared_recipe"], ["value", "composite"], [1, "flex-1", "relative", "group/input"], [1, "flex", "items-center", "gap-2"], ["type", "button", 1, "text-slate-300", "dark:text-slate-500", "hover:text-red-600", "dark:hover:text-red-400", "px-2", "transition", 3, "click"], [1, "p-4", "grid", "gap-4", "relative"], [1, "flex", "gap-3", "items-end"], [1, "text-[9px]", "uppercase", "font-bold", "text-slate-400", "dark:text-slate-500", "block", "mb-1"], [1, "relative"], ["formControlName", "formula", "placeholder", "VD: 10 * n_sample", 1, "w-full", "pl-3", "pr-8", "py-2", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "font-mono", "text-blue-700", "dark:text-blue-400", "focus:border-blue-500", "dark:focus:border-blue-400", "outline-none", "bg-slate-50", "dark:bg-slate-900", "focus:bg-white", "dark:focus:bg-slate-800", "transition"], [1, "absolute", "right-3", "top-2.5", "text-slate-400", "dark:text-slate-500", "text-xs"], [1, "fa-solid", "fa-calculator"], [1, "w-24"], ["formControlName", "unit", 1, "w-full", "py-2", "pl-2", "pr-6", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "outline-none", "bg-white", "dark:bg-slate-800", "appearance-none", "cursor-pointer", "h-[38px]"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-3"], [1, "fa-regular", "fa-note-sticky", "absolute", "left-3", "top-2.5", "text-slate-400", "dark:text-slate-500", "text-xs"], ["formControlName", "base_note", "placeholder", "VD: C\u00E2n ch\u00EDnh x\u00E1c, pha trong t\u1EE7 h\u00FAt...", 1, "w-full", "pl-8", "pr-3", "py-2", "text-xs", "border", "border-slate-200", "dark:border-slate-700", "bg-transparent", "rounded-lg", "outline-none", "focus:border-orange-400", "dark:focus:border-orange-500", "focus:ring-1", "focus:ring-orange-200", "dark:focus:ring-orange-900/30", "transition"], [1, "fa-solid", "fa-code-branch", "absolute", "left-3", "top-2.5", "text-slate-400", "dark:text-slate-500", "text-xs"], ["formControlName", "condition", "placeholder", "VD: !use_b2 (ch\u1EC9 hi\u1EC7n khi bi\u1EBFn use_b2 = false)", 1, "w-full", "pl-8", "pr-3", "py-2", "text-xs", "border", "border-slate-200", "dark:border-slate-700", "bg-transparent", "rounded-lg", "font-mono", "text-slate-600", "dark:text-slate-400", "outline-none", "focus:border-purple-400", "dark:focus:border-purple-500", "focus:ring-1", "focus:ring-purple-200", "dark:focus:ring-purple-900/30", "transition"], [1, "mt-2", "bg-slate-50", "dark:bg-slate-800/50", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "p-3", "relative", "z-10"], [1, "flex", "items-center", "justify-between", "px-3", "py-1.5", "w-full"], [1, "flex", "flex-col", "flex-1"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-mono"], ["type", "button", 1, "text-[10px]", "font-bold", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-100", "dark:hover:bg-blue-900/40", "px-2", "py-1", "rounded", "transition", "whitespace-nowrap", 3, "click"], ["formControlName", "_displayName", "type", "hidden"], ["formControlName", "name", "type", "hidden"], ["formControlName", "recipeId", "type", "hidden"], [1, "text-[9px]", "bg-emerald-100", "dark:bg-emerald-900/30", "text-emerald-600", "dark:text-emerald-400", "px-1", "rounded", "flex", "items-center", "gap-1"], [1, "text-[9px]", "bg-red-100", "dark:bg-red-900/30", "text-red-600", "dark:text-red-400", "px-1", "rounded", "flex", "items-center", "gap-1", "animate-pulse"], [1, "fa-solid", "fa-check-circle"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "fa-solid", "fa-folder-open"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase"], ["formControlName", "_displayName", "placeholder", "VD: H\u1ED7n h\u1EE3p \u0111\u1EC7m A", 1, "flex-1", "bg-transparent", "border-none", "focus:ring-0", "font-bold", "text-slate-700", "dark:text-slate-300", "text-sm", "placeholder-slate-300", "dark:placeholder-slate-600", 3, "change"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-mono", "bg-slate-100", "dark:bg-slate-700", "px-2", "py-0.5", "rounded"], [1, "flex", "justify-between", "items-center", "mb-2", "border-b", "border-slate-200", "dark:border-slate-700", "pb-2"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-layer-group", "text-blue-500", "dark:text-blue-400"], ["type", "button", 1, "text-[10px]", "bg-white", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-600", "hover:bg-blue-50", "dark:hover:bg-blue-900/20", "text-slate-600", "dark:text-slate-400", "px-2", "py-1", "rounded", "font-bold", "transition", 3, "click"], ["formArrayName", "ingredients", 1, "space-y-2"], [1, "flex", "gap-2", "items-center", "relative", 3, "formGroupName", "zIndex"], [1, "flex", "gap-2", "items-center", "relative", 3, "formGroupName"], [1, "flex-1", "relative"], [1, "flex", "items-center", "justify-between", "w-full", "border", "border-slate-300", "dark:border-slate-600", "rounded", "px-2", "py-1.5", "text-xs", "bg-white", "dark:bg-slate-800", "shadow-sm"], [1, "font-bold", "text-slate-700", "dark:text-slate-300"], ["formControlName", "amount", "type", "number", "placeholder", "L\u01B0\u1EE3ng", 1, "w-16", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded", "px-1", "py-1.5", "text-xs", "text-center", "outline-none", "font-bold"], ["formControlName", "unit", 1, "w-16", "border", "border-slate-300", "dark:border-slate-600", "rounded", "px-1", "py-1.5", "text-xs", "text-center", "outline-none", "bg-white", "dark:bg-slate-800"], ["type", "button", 1, "w-6", "h-6", "flex", "items-center", "justify-center", "text-slate-400", "dark:text-slate-500", "hover:text-red-500", "dark:hover:text-red-400", "transition", "rounded-full", "hover:bg-white", "dark:hover:bg-slate-700", 3, "click"], [1, "fa-solid", "fa-times"], [1, "fa-solid", "fa-bullseye", "text-emerald-500", "dark:text-emerald-400"], ["type", "button", 1, "text-xs", "bg-slate-100", "dark:bg-slate-700", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-600", "border", "border-slate-200", "dark:border-slate-600", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition", "flex", "items-center", "gap-1", 3, "click"], [1, "fa-solid", "fa-layer-group"], ["type", "button", 1, "text-xs", "bg-emerald-500", "text-white", "hover:bg-emerald-600", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition", "flex", "items-center", "gap-1", "shadow-sm", "shadow-emerald-500/20", 3, "click"], [1, "fa-solid", "fa-magnifying-glass-plus"], ["formArrayName", "targets", 1, "space-y-3"], [1, "flex", "gap-2", "items-start", "p-3", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "border", "group", "transition-colors", 3, "formGroupName", "border-red-200", "dark:border-red-900", "border-slate-100", "dark:border-slate-700"], [1, "text-center", "py-8", "text-slate-400", "dark:text-slate-500", "italic", "bg-white", "dark:bg-slate-800", "border", "border-dashed", "border-slate-200", "dark:border-slate-700", "rounded-xl"], [1, "flex", "gap-2", "items-start", "p-3", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "border", "group", "transition-colors", 3, "formGroupName"], [1, "w-8", "h-8", "rounded", "text-xs", "font-bold", "mt-1", "flex", "items-center", "justify-center", "transition-colors"], [1, "flex-1", "grid", "grid-cols-1", "md:grid-cols-12", "gap-2"], [1, "md:col-span-4"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "mb-1", "flex", "justify-between", "items-center"], [1, "flex", "items-center", "gap-1"], ["formControlName", "name", "readonly", "", 1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-100", "dark:bg-slate-900", "rounded", "px-2", "py-1.5", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "outline-none", "cursor-not-allowed"], [1, "md:col-span-3"], ["formControlName", "id", "readonly", "", 1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-100", "dark:bg-slate-900", "rounded", "px-2", "py-1.5", "text-xs", "font-mono", "text-slate-400", "dark:text-slate-500", "outline-none", "cursor-not-allowed"], [1, "md:col-span-2"], ["formControlName", "unit", "placeholder", "ppb", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded", "px-2", "py-1.5", "text-xs", "outline-none", "focus:border-emerald-500", "dark:focus:border-emerald-400"], [1, "md:col-span-3", "grid", "grid-cols-2", "gap-2"], ["formControlName", "lod", "placeholder", "0.1", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded", "px-2", "py-1.5", "text-xs", "outline-none", "focus:border-emerald-500", "dark:focus:border-emerald-400"], ["formControlName", "loq", "placeholder", "0.3", 1, "w-full", "border", "border-slate-300", "dark:border-slate-600", "bg-transparent", "rounded", "px-2", "py-1.5", "text-xs", "outline-none", "focus:border-emerald-500", "dark:focus:border-emerald-400"], ["type", "button", 1, "mt-6", "w-8", "h-8", "flex", "items-center", "justify-center", "text-slate-300", "dark:text-slate-500", "hover:text-red-500", "dark:hover:text-red-400", "transition", "rounded-full", "hover:bg-white", "dark:hover:bg-slate-700", 3, "click"], ["type", "button", 1, "text-[9px]", "bg-blue-100", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-200", "dark:hover:bg-blue-800/40", "px-1.5", "py-0.5", "rounded", "transition", "flex", "items-center", "gap-1", 3, "click"], [1, "fa-solid", "fa-rotate"], ["type", "button", 1, "text-[9px]", "bg-blue-100", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-200", "dark:hover:bg-blue-800/40", "px-1.5", "py-0.5", "rounded", "transition", 3, "click"], [1, "flex", "justify-between", "items-start"], [1, "font-medium", "text-xs", "text-slate-700", "dark:text-slate-300", "pr-2"], [1, "font-bold", "text-sm", "text-blue-600", "dark:text-blue-400", "whitespace-nowrap"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500"], [1, "mt-1", "pl-2", "border-l-2", "border-slate-100", "dark:border-slate-700", "ml-1"], [1, "flex", "justify-between", "text-[10px]"], [1, "text-slate-500", "dark:text-slate-400"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-xl", "w-full", "max-w-lg", "overflow-hidden", "flex", "flex-col", "max-h-[80vh]", "animate-slide-up"], [1, "px-5", "py-4", "border-b", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-200", "text-lg"], [1, "text-slate-400", "dark:text-slate-500", "hover:text-slate-600", "dark:hover:text-slate-300", 3, "click"], [1, "fa-solid", "fa-times", "text-lg"], [1, "flex-1", "overflow-y-auto", "p-2", "custom-scrollbar"], [1, "p-8", "text-center", "text-slate-400", "dark:text-slate-500", "italic", "text-sm"], ["routerLink", "/target-groups", 1, "text-teal-600", "dark:text-teal-400", "hover:underline", "font-bold", "mt-1", "inline-block"], [1, "p-4", "border-b", "border-slate-50", "dark:border-slate-700/50", "hover:bg-teal-50", "dark:hover:bg-teal-900/20", "cursor-pointer", "transition", "group"], [1, "p-4", "border-b", "border-slate-50", "dark:border-slate-700/50", "hover:bg-teal-50", "dark:hover:bg-teal-900/20", "cursor-pointer", "transition", "group", 3, "click"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "text-sm", "group-hover:text-teal-700", "dark:group-hover:text-teal-400"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "mt-1", "flex", "justify-between"], [1, "italic", "max-w-[200px]", "truncate"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-xl", "w-full", "max-w-3xl", "overflow-hidden", "flex", "flex-col", "max-h-[85vh]", "animate-slide-up"], [1, "px-5", "py-4", "border-b", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/50", "flex", "flex-col", "sm:flex-row", "sm:justify-between", "sm:items-center", "gap-3", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-200", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-magnifying-glass-plus", "text-emerald-500"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "text-slate-400", "dark:text-slate-500", "hover:text-slate-600", "dark:hover:text-slate-300", "w-8", "h-8", "flex", "items-center", "justify-center", "bg-slate-200", "dark:bg-slate-700", "rounded-full", "transition-colors", 3, "click"], [1, "fa-solid", "fa-times", "text-sm"], [1, "p-3", "border-b", "border-slate-100", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "shrink-0"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "dark:text-slate-500"], ["type", "text", "placeholder", "T\u00ECm ki\u1EBFm ch\u1EC9 ti\u00EAu theo T\u00EAn ho\u1EB7c ID...", 1, "w-full", "pl-9", "pr-4", "py-2", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-xl", "outline-none", "focus:border-emerald-500", "dark:focus:border-emerald-400", "focus:ring-2", "focus:ring-emerald-500/20", "transition-all", "bg-slate-50", "dark:bg-slate-900", "text-slate-700", "dark:text-slate-300", 3, "input", "value"], [1, "flex-1", "overflow-y-auto", "p-2", "custom-scrollbar", "bg-slate-50", "dark:bg-slate-800/30"], [1, "p-12", "text-center", "text-slate-400", "dark:text-slate-500", "italic", "text-sm"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-2", "p-1"], [1, "px-5", "py-4", "border-t", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "flex", "justify-between", "items-center", "shrink-0"], [1, "text-sm", "font-bold", "text-slate-600", "dark:text-slate-400"], [1, "px-4", "py-2", "rounded-xl", "text-sm", "font-bold", "text-slate-600", "dark:text-slate-300", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "transition-colors", 3, "click"], [1, "px-4", "py-2", "rounded-xl", "text-sm", "font-bold", "text-white", "bg-emerald-500", "hover:bg-emerald-600", "disabled:opacity-50", "disabled:cursor-not-allowed", "transition-colors", "shadow-sm", "shadow-emerald-500/20", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-box-open", "text-3xl", "mb-3", "opacity-50"], [1, "p-3", "rounded-xl", "border", "transition-all", "cursor-pointer", "flex", "items-center", "gap-3", "select-none", 3, "ngClass"], [1, "p-3", "rounded-xl", "border", "transition-all", "cursor-pointer", "flex", "items-center", "gap-3", "select-none", 3, "click", "ngClass"], [1, "w-5", "h-5", "rounded", "border", "flex", "items-center", "justify-center", "shrink-0", "transition-colors", 3, "ngClass"], [1, "fa-solid", "fa-check", "text-[10px]"], [1, "flex-1", "overflow-hidden"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "text-sm", "truncate"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "font-mono", "mt-0.5"], [1, "text-emerald-600", "dark:text-emerald-400"], [1, "fa-solid", "fa-plus"], [1, "absolute", "inset-0", "bg-slate-900/60", "backdrop-blur-sm", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "w-full", "max-w-3xl", "rounded-2xl", "shadow-2xl", "relative", "flex", "flex-col", "h-[85vh]", "sm:h-[80vh]", "overflow-hidden", "slide-up", "border", "border-slate-200", "dark:border-slate-700"], [1, "px-5", "py-4", "border-b", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-slate-200", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-flask", "text-blue-500"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "w-8", "h-8", "rounded-full", "bg-slate-200", "dark:bg-slate-700", "text-slate-500", "hover:bg-red-100", "hover:text-red-500", "transition-colors", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "p-4", "border-b", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "shrink-0"], [1, "fa-solid", "fa-magnifying-glass", "absolute", "left-4", "top-3.5", "text-slate-400"], ["type", "text", "placeholder", "T\u00ECm ki\u1EBFm theo T\u00EAn, ID, Danh m\u1EE5c...", 1, "w-full", "pl-11", "pr-4", "py-3", "bg-slate-100", "dark:bg-slate-800", "border-none", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:ring-2", "focus:ring-blue-500/50", "outline-none", "transition-all", 3, "input", "value"], [1, "flex-1", "overflow-y-auto", "bg-slate-50", "dark:bg-slate-900/50", "p-4", "custom-scrollbar"], [1, "grid", "grid-cols-1", "gap-2"], [1, "px-4", "py-3", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "hover:border-blue-400", "dark:hover:border-blue-500", "hover:shadow-md", "cursor-pointer", "flex", "justify-between", "items-center", "group", "transition-all"], [1, "px-4", "py-3", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "hover:border-blue-400", "dark:hover:border-blue-500", "hover:shadow-md", "cursor-pointer", "flex", "justify-between", "items-center", "group", "transition-all", 3, "click"], [1, "flex-1", "min-w-0", "pr-4"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-300", "group-hover:text-blue-600", "dark:group-hover:text-blue-400", "truncate"], [1, "flex", "flex-wrap", "gap-2", "mt-1.5"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "font-mono", "bg-slate-100", "dark:bg-slate-700", "px-1.5", "py-0.5", "rounded", "border", "border-slate-200", "dark:border-slate-600"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "uppercase", "font-bold"], [1, "text-right", "shrink-0"], [1, "text-[10px]", "font-bold", "text-slate-600", "dark:text-slate-400", "bg-slate-100", "dark:bg-slate-700", "px-2", "py-1", "rounded", "border", "border-slate-200", "dark:border-slate-600", "mb-1", "inline-block"], [1, "text-[10px]", "font-mono", "font-bold", 3, "ngClass"], [1, "fa-solid", "fa-industry", "text-[9px]", "mr-1"]], template: function SopEditorComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "button", 3);
            i0.ɵɵlistener("click", function SopEditorComponent_Template_button_click_3_listener() { return ctx.goBack(); });
            i0.ɵɵelement(4, "i", 4);
            i0.ɵɵelementStart(5, "span", 5);
            i0.ɵɵtext(6, "Quay L\u1EA1i");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(7, "div", 6);
            i0.ɵɵelementStart(8, "div")(9, "h2", 7);
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "div", 8)(12, "span");
            i0.ɵɵtext(13);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "div", 9)(15, "span", 10);
            i0.ɵɵtext(16, "v");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(17, "input", 11);
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(18, "div", 12)(19, "button", 13);
            i0.ɵɵlistener("click", function SopEditorComponent_Template_button_click_19_listener() { return ctx.save(); });
            i0.ɵɵtemplate(20, SopEditorComponent_Conditional_20_Template, 1, 0, "i", 14)(21, SopEditorComponent_Conditional_21_Template, 1, 0, "i", 15);
            i0.ɵɵelementStart(22, "span");
            i0.ɵɵtext(23, "L\u01B0u Quy Tr\u00ECnh");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(24, "div", 16);
            i0.ɵɵtemplate(25, SopEditorComponent_Conditional_25_Template, 1, 0, "div", 17);
            i0.ɵɵelementStart(26, "div", 18)(27, "div", 19)(28, "button", 20);
            i0.ɵɵlistener("click", function SopEditorComponent_Template_button_click_28_listener() { return ctx.currentTab.set("general"); });
            i0.ɵɵtext(29, "Th\u00F4ng Tin");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "button", 20);
            i0.ɵɵlistener("click", function SopEditorComponent_Template_button_click_30_listener() { return ctx.currentTab.set("logic"); });
            i0.ɵɵtext(31, "Logic");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "button", 20);
            i0.ɵɵlistener("click", function SopEditorComponent_Template_button_click_32_listener() { return ctx.currentTab.set("consumables"); });
            i0.ɵɵtext(33, "V\u1EADt T\u01B0 (Consumables)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "button", 20);
            i0.ɵɵlistener("click", function SopEditorComponent_Template_button_click_34_listener() { return ctx.currentTab.set("targets"); });
            i0.ɵɵelement(35, "i", 21);
            i0.ɵɵtext(36, " Ch\u1EC9 Ti\u00EAu ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(37, "div", 22)(38, "form", 23);
            i0.ɵɵtemplate(39, SopEditorComponent_Conditional_39_Template, 59, 6, "div", 24)(40, SopEditorComponent_Conditional_40_Template, 16, 0, "div", 25)(41, SopEditorComponent_Conditional_41_Template, 11, 1, "div", 26)(42, SopEditorComponent_Conditional_42_Template, 20, 1, "div", 26);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(43, "div", 27)(44, "div", 28);
            i0.ɵɵtext(45, "Xem tr\u01B0\u1EDBc K\u1EBFt qu\u1EA3");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "div", 29);
            i0.ɵɵrepeaterCreate(47, SopEditorComponent_For_48_Template, 9, 4, "div", 30, _forTrack0);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(49, SopEditorComponent_Conditional_49_Template, 10, 1, "div", 31)(50, SopEditorComponent_Conditional_50_Template, 28, 5, "div", 31)(51, SopEditorComponent_Conditional_51_Template, 19, 2, "div", 32);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            let tmp_1_0;
            let tmp_2_0;
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("disabled", ctx.isLoading());
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate1(" ", ((tmp_1_0 = ctx.form.get("name")) == null ? null : tmp_1_0.value) || "Quy tr\u00ECnh M\u1EDBi", " ");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1("ID: ", ((tmp_2_0 = ctx.form.get("id")) == null ? null : tmp_2_0.value) || "Pending...", "");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("formControl", ctx.form.controls.version);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.isLoading());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isLoading() ? 20 : 21);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.isLoading() ? 25 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵclassMap(ctx.currentTab() === "general" ? "border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.currentTab() === "logic" ? "border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.currentTab() === "consumables" ? "border-orange-600 dark:border-orange-500 text-orange-700 dark:text-orange-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.currentTab() === "targets" ? "border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.currentTab() === "general" ? 39 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.currentTab() === "logic" ? 40 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.currentTab() === "consumables" ? 41 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.currentTab() === "targets" ? 42 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.previewResults());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showGroupModal() ? 49 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showTargetModal() ? 50 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showConsumableModal() ? 51 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, ReactiveFormsModule, i2.ɵNgNoValidate, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.MinValidator, i2.FormControlDirective, i2.FormGroupDirective, i2.FormControlName, i2.FormGroupName, i2.FormArrayName], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SopEditorComponent, [{
        type: Component,
        args: [{ selector: 'app-sop-editor', standalone: true, imports: [CommonModule, ReactiveFormsModule], template: "    <div class=\"h-full flex flex-col bg-slate-100 dark:bg-slate-900 fade-in text-slate-800 dark:text-slate-200 relative\">\r\n        <!-- Toolbar -->\r\n        <div class=\"h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 shrink-0 shadow-sm z-30\">\r\n            <div class=\"flex items-center gap-4\">\r\n                <button (click)=\"goBack()\" [disabled]=\"isLoading()\" class=\"text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-bold flex items-center gap-2 transition disabled:opacity-50\">\r\n                    <i class=\"fa-solid fa-arrow-left\"></i> <span class=\"hidden md:inline\">Quay L\u1EA1i</span>\r\n                </button>\r\n                <div class=\"h-6 w-px bg-slate-200 dark:bg-slate-700\"></div>\r\n                <div>\r\n                   <h2 class=\"text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 leading-none\">\r\n                       {{ form.get('name')?.value || 'Quy tr\u00ECnh M\u1EDBi' }}\r\n                   </h2>\r\n                   <div class=\"text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 flex items-center gap-3\">\r\n                       <span>ID: {{ form.get('id')?.value || 'Pending...' }}</span>\r\n                       <div class=\"flex items-center bg-slate-100 dark:bg-slate-900 rounded px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition-all\">\r\n                           <span class=\"text-slate-500 dark:text-slate-400 font-bold mr-1\">v</span>\r\n                           <input type=\"number\" [formControl]=\"form.controls.version\" \r\n                                  class=\"bg-transparent w-8 text-[10px] font-bold text-blue-700 dark:text-blue-400 outline-none text-center\" \r\n                                  min=\"1\">\r\n                       </div>\r\n                   </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"flex gap-2\">\r\n                <button (click)=\"save()\" [disabled]=\"isLoading()\" class=\"px-4 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 text-sm font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed\">\r\n                    @if(isLoading()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> }\r\n                    @else { <i class=\"fa-solid fa-floppy-disk\"></i> }\r\n                    <span>L\u01B0u Quy Tr\u00ECnh</span>\r\n                </button>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Split View Layout -->\r\n        <div class=\"flex-1 flex overflow-hidden relative\">\r\n            @if(isLoading()) { <div class=\"absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-50 cursor-wait\"></div> }\r\n            \r\n            <!-- LEFT COLUMN: Editor -->\r\n            <div class=\"flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900 overflow-hidden border-r border-slate-200 dark:border-slate-700\">\r\n                <!-- Tabs -->\r\n                <div class=\"flex bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 gap-6 shrink-0 overflow-x-auto no-scrollbar\">\r\n                   <button (click)=\"currentTab.set('general')\" class=\"py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap\" [class]=\"currentTab() === 'general' ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'\">Th\u00F4ng Tin</button>\r\n                   <button (click)=\"currentTab.set('logic')\" class=\"py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap\" [class]=\"currentTab() === 'logic' ? 'border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'\">Logic</button>\r\n                   <button (click)=\"currentTab.set('consumables')\" class=\"py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap\" [class]=\"currentTab() === 'consumables' ? 'border-orange-600 dark:border-orange-500 text-orange-700 dark:text-orange-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'\">V\u1EADt T\u01B0 (Consumables)</button>\r\n                   <button (click)=\"currentTab.set('targets')\" class=\"py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap\" [class]=\"currentTab() === 'targets' ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'\">\r\n                       <i class=\"fa-solid fa-bullseye\"></i> Ch\u1EC9 Ti\u00EAu\r\n                   </button>\r\n                </div>\r\n\r\n                <div class=\"flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar\">\r\n                   <form [formGroup]=\"form\" class=\"max-w-5xl mx-auto space-y-6\">\r\n                      \r\n                      <!-- TAB 1: GENERAL INFO -->\r\n                      @if (currentTab() === 'general') {\r\n                          <div class=\"space-y-6 fade-in\">\r\n                              <div class=\"bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4\">\r\n                                  <div>\r\n                                      <label class=\"block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1\">T\u00EAn quy tr\u00ECnh <span class=\"text-red-500\">*</span></label>\r\n                                      <input formControlName=\"name\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-lg p-3 text-sm font-bold outline-none focus:border-blue-500 dark:focus:border-blue-400 transition\">\r\n                                  </div>\r\n                                  <div class=\"grid grid-cols-2 gap-4\">\r\n                                      <div>\r\n                                          <label class=\"block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1\">Danh m\u1EE5c (Category) <span class=\"text-red-500\">*</span></label>\r\n                                          <input formControlName=\"category\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-lg p-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition\" placeholder=\"VD: NAFI6 H-9.21\">\r\n                                      </div>\r\n                                      <div>\r\n                                          <label class=\"block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1\">T\u00E0i li\u1EC7u tham chi\u1EBFu (Ref)</label>\r\n                                          <input formControlName=\"ref\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-lg p-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition\" placeholder=\"VD: AOAC 2007.01\">\r\n                                      </div>\r\n                                  </div>\r\n                                  \r\n                                  <div class=\"flex items-center gap-2 pt-1\">\r\n                                      <input type=\"checkbox\" id=\"isManualOnly\" formControlName=\"isManualOnly\" class=\"w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer\">\r\n                                      <label for=\"isManualOnly\" class=\"text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer select-none\">\r\n                                          Ch\u1EC9 \u0111\u1ECBnh th\u1EE7 c\u00F4ng \u2014 Kh\u00F4ng t\u1EF1 \u0111\u1ED9ng ph\u00E2n b\u1ED5 khi l\u1EADp m\u1EBB\r\n                                      </label>\r\n                                  </div>\r\n\r\n                                  <!-- Matrix Tags -->\r\n                                  <div class=\"space-y-2 border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-2\">\r\n                                    <label class=\"block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1\">\r\n                                      N\u1EC1n m\u1EABu \u00E1p d\u1EE5ng\r\n                                    </label>\r\n                                    <div class=\"flex flex-wrap gap-2\">\r\n                                      <button type=\"button\" (click)=\"clearMatrixTags()\"\r\n                                        [class]=\"selectedMatrixTags().length === 0\r\n                                          ? 'ring-2 ring-offset-1 opacity-100 dark:ring-offset-slate-800'\r\n                                          : 'opacity-60 hover:opacity-80'\"\r\n                                        class=\"px-3 py-1.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1 bg-white dark:bg-slate-800 border-slate-400 text-slate-500 dark:text-slate-400\">\r\n                                        <div class=\"w-2 h-2 rounded-full bg-slate-400\"></div>\r\n                                        D\u00F9ng chung (ANY)\r\n                                        @if (selectedMatrixTags().length === 0) { <i class=\"fa-solid fa-check ml-1 text-[10px]\"></i> }\r\n                                      </button>\r\n                                      @for (m of availableMatrices(); track m.id) {\r\n                                        <button type=\"button\" (click)=\"toggleMatrixTag(m.id)\"\r\n                                          [class]=\"selectedMatrixTags().includes(m.id)\r\n                                            ? 'ring-2 ring-offset-1 opacity-100 dark:ring-offset-slate-800'\r\n                                            : 'opacity-60 hover:opacity-80'\"\r\n                                          class=\"px-3 py-1.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1 bg-white dark:bg-slate-800\"\r\n                                          [style.border-color]=\"m.color || '#94a3b8'\"\r\n                                          [style.color]=\"m.color || '#94a3b8'\">\r\n                                          <div class=\"w-2 h-2 rounded-full\" [style.background-color]=\"m.color || '#94a3b8'\"></div>\r\n                                          {{ m.name }}\r\n                                          @if (selectedMatrixTags().includes(m.id)) { <i class=\"fa-solid fa-check ml-1 text-[10px]\"></i> }\r\n                                        </button>\r\n                                      }\r\n                                    </div>\r\n                                    @if (selectedMatrixTags().length === 0) {\r\n                                      <p class=\"text-[10px] text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg inline-block border border-amber-100 dark:border-amber-900/30\">\r\n                                        <i class=\"fa-solid fa-triangle-exclamation mr-1\"></i> Kh\u00F4ng g\u00E1n n\u1EC1n m\u1EABu \u2192 SOP n\u00E0y \u0111\u01B0\u1EE3c x\u00E9t trong m\u1ECDi tr\u01B0\u1EDDng h\u1EE3p (\u00E1p d\u1EE5ng chung).\r\n                                      </p>\r\n                                    }\r\n                                  </div>\r\n\r\n                                  <!-- Device Tags -->\r\n                                  <div class=\"space-y-4 border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-2\">\r\n                                    <div>\r\n                                      <label class=\"block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1\">\r\n                                        Thi\u1EBFt b\u1ECB kh\u1EA3 d\u1EE5ng\r\n                                      </label>\r\n                                      <div class=\"flex flex-wrap gap-2\">\r\n                                        @for (d of availableDevices(); track d.id) {\r\n                                          <button type=\"button\" (click)=\"toggleAllowedDevice(d.name)\"\r\n                                            [class]=\"selectedAllowedDevices().includes(d.name)\r\n                                              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'\r\n                                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'\"\r\n                                            class=\"px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all flex items-center gap-2 shadow-sm\">\r\n                                            <i class=\"fa-solid fa-microchip\"></i>\r\n                                            {{ d.name }}\r\n                                            @if (selectedAllowedDevices().includes(d.name)) { <i class=\"fa-solid fa-check ml-1 text-blue-600 dark:text-blue-400\"></i> }\r\n                                          </button>\r\n                                        }\r\n                                      </div>\r\n                                      @if (selectedAllowedDevices().length === 0) {\r\n                                        <p class=\"text-[10px] text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg inline-block border border-amber-100 dark:border-amber-900/30 mt-2\">\r\n                                          <i class=\"fa-solid fa-triangle-exclamation mr-1\"></i> Ch\u01B0a ch\u1ECDn thi\u1EBFt b\u1ECB kh\u1EA3 d\u1EE5ng. M\u1ECDi thi\u1EBFt b\u1ECB s\u1EBD \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB tr\u00EAn m\u1EBB ch\u1EA1y.\r\n                                        </p>\r\n                                      }\r\n                                    </div>\r\n\r\n                                    <div class=\"max-w-xs\">\r\n                                      <label class=\"block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1\">\r\n                                        Thi\u1EBFt b\u1ECB M\u1EB7c \u0111\u1ECBnh\r\n                                      </label>\r\n                                      <select formControlName=\"device\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg p-2 text-sm font-bold outline-none focus:border-blue-500 dark:focus:border-blue-400 transition cursor-pointer\">\r\n                                        <option value=\"\">-- T\u1EF1 \u0111\u1ED9ng --</option>\r\n                                        @if (selectedAllowedDevices().length > 0) {\r\n                                          @for (name of selectedAllowedDevices(); track name) {\r\n                                            <option [value]=\"name\">{{name}}</option>\r\n                                          }\r\n                                        } @else {\r\n                                          @for (d of availableDevices(); track d.id) {\r\n                                            <option [value]=\"d.name\">{{d.name}}</option>\r\n                                          }\r\n                                        }\r\n                                      </select>\r\n                                    </div>\r\n                                  </div>\r\n                              </div>\r\n\r\n                              <!-- INPUTS CONFIG -->\r\n                              <div class=\"bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700\">\r\n                                  <div class=\"flex justify-between items-center mb-4\">\r\n                                      <h3 class=\"font-bold text-slate-800 dark:text-slate-200 text-sm uppercase\">D\u1EEF Li\u1EC7u \u0110\u1EA7u v\u00E0o</h3>\r\n                                      <button type=\"button\" (click)=\"addInput()\" class=\"text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg font-bold text-slate-600 dark:text-slate-300 transition\">+ Th\u00EAm Tr\u01B0\u1EDDng Nh\u1EADp</button>\r\n                                  </div>\r\n                                  \r\n                                  <div formArrayName=\"inputs\" class=\"space-y-3\">\r\n                                      @for (inp of inputs.controls; track inp; let i = $index) {\r\n                                          <div [formGroupName]=\"i\" class=\"flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 group\">\r\n                                              <div class=\"flex gap-2 items-start\">\r\n                                                  <div class=\"grid grid-cols-2 md:grid-cols-4 gap-2 flex-1\">\r\n                                                      <div><label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase\">Bi\u1EBFn (Var)</label><input formControlName=\"var\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded px-2 py-1.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 outline-none\"></div>\r\n                                                      <div><label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase\">Nh\u00E3n (Label)</label><input formControlName=\"label\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded px-2 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none\"></div>\r\n                                                      <div><label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase\">Ki\u1EC3u</label>\r\n                                                          <select formControlName=\"type\" class=\"w-full border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs outline-none bg-white dark:bg-slate-800\">\r\n                                                              <option value=\"number\">S\u1ED1 (Number)</option>\r\n                                                              <option value=\"checkbox\">Checkbox</option>\r\n                                                              <option value=\"select\">Danh s\u00E1ch l\u1EF1a ch\u1ECDn</option>\r\n                                                          </select>\r\n                                                      </div>\r\n                                                      <div><label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase\">M\u1EB7c \u0111\u1ECBnh</label><input formControlName=\"default\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded px-2 py-1.5 text-xs font-bold outline-none\"></div>\r\n                                                  </div>\r\n                                                  <button type=\"button\" (click)=\"inputs.removeAt(i)\" class=\"mt-4 text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition px-2\"><i class=\"fa-solid fa-trash\"></i></button>\r\n                                              </div>\r\n                                              \r\n                                              <!-- Options for Select -->\r\n                                              @if (inp.get('type')?.value === 'select') {\r\n                                                  <div class=\"pl-2 border-l-2 border-orange-200 dark:border-orange-800/50 ml-1\">\r\n                                                      <label class=\"text-[9px] font-bold text-orange-600 dark:text-orange-400 uppercase\">T\u00F9y ch\u1ECDn (Format: \"Value:Label, Value:Label\")</label>\r\n                                                      <input formControlName=\"optionsStr\" class=\"w-full border border-orange-200 dark:border-orange-800/50 rounded px-2 py-1.5 text-xs bg-orange-50 dark:bg-orange-900/20 focus:bg-white dark:focus:bg-slate-800 transition outline-none placeholder-orange-300 dark:placeholder-orange-700\" placeholder=\"0:Th\u1EE7y s\u1EA3n, 1:S\u1EEFa, 2:Phomat\">\r\n                                                  </div>\r\n                                              }\r\n                                          </div>\r\n                                      }\r\n                                  </div>\r\n                              </div>\r\n                          </div>\r\n                      }\r\n\r\n                      <!-- TAB 2: LOGIC -->\r\n                      @if (currentTab() === 'logic') {\r\n                          <div class=\"bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 fade-in\">\r\n                              <div class=\"flex justify-between items-center mb-4\">\r\n                                  <h3 class=\"font-bold text-slate-800 dark:text-slate-200 text-sm uppercase flex items-center gap-2\">\r\n                                      <i class=\"fa-solid fa-calculator text-purple-500 dark:text-purple-400\"></i> Bi\u1EBFn Trung Gian (Variables)\r\n                                  </h3>\r\n                                  <button type=\"button\" (click)=\"addVariable()\" class=\"text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 px-3 py-1.5 rounded-lg font-bold transition\">+ Th\u00EAm Bi\u1EBFn</button>\r\n                              </div>\r\n                              <p class=\"text-xs text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700\">\r\n                                  <i class=\"fa-solid fa-circle-info mr-1\"></i> \u0110\u1ECBnh ngh\u0129a c\u00E1c c\u00F4ng th\u1EE9c to\u00E1n h\u1ECDc d\u00F9ng chung. \r\n                                  D\u00F9ng c\u00E1c bi\u1EBFn \u0111\u1EA7u v\u00E0o (VD: <code class=\"dark:text-slate-300\">n_sample</code>) ho\u1EB7c c\u00E1c bi\u1EBFn kh\u00E1c.\r\n                              </p>\r\n\r\n                              <div formArrayName=\"variablesList\" class=\"space-y-3\">\r\n                                  @for (v of variablesList.controls; track v; let i = $index) {\r\n                                      <div [formGroupName]=\"i\" class=\"flex gap-2 items-center p-3 border border-purple-100 dark:border-purple-900/30 bg-purple-50/30 dark:bg-purple-900/10 rounded-xl relative group\">\r\n                                          <div class=\"w-1/3\">\r\n                                              <label class=\"text-[9px] font-bold text-purple-400 dark:text-purple-500 uppercase mb-1 block\">T\u00EAn bi\u1EBFn</label>\r\n                                              <input formControlName=\"key\" list=\"std_vars\" placeholder=\"VD: total_vol\" class=\"w-full border border-purple-200 dark:border-purple-800/50 bg-transparent rounded-lg px-3 py-2 text-xs font-mono font-bold text-purple-700 dark:text-purple-400 outline-none focus:bg-white dark:focus:bg-slate-800 transition\">\r\n                                              <datalist id=\"std_vars\">\r\n                                                  @for(std of standardVars; track std.value) { <option [value]=\"std.value\">{{std.label}}</option> }\r\n                                              </datalist>\r\n                                          </div>\r\n                                          <div class=\"flex items-center justify-center pt-4 text-purple-300 dark:text-purple-600\"><i class=\"fa-solid fa-equals\"></i></div>\r\n                                          <div class=\"flex-1\">\r\n                                              <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block\">Bi\u1EC3u th\u1EE9c t\u00EDnh to\u00E1n (JavaScript)</label>\r\n                                              <input formControlName=\"formula\" placeholder=\"VD: n_sample * 10\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-lg px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-slate-800 transition\">\r\n                                          </div>\r\n                                          <button type=\"button\" (click)=\"variablesList.removeAt(i)\" class=\"mt-4 w-8 h-8 flex items-center justify-center text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition rounded-full hover:bg-white dark:hover:bg-slate-800\"><i class=\"fa-solid fa-trash\"></i></button>\r\n                                      </div>\r\n                                  }\r\n                              </div>\r\n                          </div>\r\n                      }\r\n                      \r\n                      <!-- TAB 3: CONSUMABLES -->\r\n                      @if (currentTab() === 'consumables') {\r\n                          <div class=\"fade-in pb-32\">\r\n                             <div class=\"flex items-center justify-between mb-4\">\r\n                                 <h3 class=\"text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2\">\r\n                                     Danh S\u00E1ch V\u1EADt T\u01B0 <span class=\"bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] px-2 py-0.5 rounded-full\">{{consumables.length}}</span>\r\n                                 </h3>\r\n                                 <button type=\"button\" (click)=\"addConsumable()\" class=\"text-xs bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded-lg font-bold transition\">+ Th\u00EAm D\u00F2ng</button>\r\n                             </div>\r\n                             \r\n                             <div formArrayName=\"consumables\" class=\"space-y-4\">\r\n                                @for (con of consumables.controls; track con; let i = $index) {\r\n                                   @let conType = con.get('type')?.value;\r\n                                   <div [formGroupName]=\"i\" class=\"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-visible group transition hover:shadow-md dark:hover:shadow-none hover:border-blue-300 dark:hover:border-blue-500 relative z-0\" [style.zIndex]=\"200-i\">\r\n                                      <div class=\"bg-slate-50 dark:bg-slate-800/50 p-3 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700\">\r\n                                         <div class=\"w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold\">{{i+1}}</div>\r\n                                         <select formControlName=\"type\" (change)=\"onTypeChange(i)\" class=\"text-[10px] font-bold uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none focus:border-blue-500 dark:focus:border-blue-400 cursor-pointer w-32\">\r\n                                             <option value=\"simple\">H\u00F3a ch\u1EA5t \u0111\u01A1n</option>\r\n                                             <option value=\"shared_recipe\">C\u00F4ng th\u1EE9c (Th\u01B0 vi\u1EC7n)</option>\r\n                                             <option value=\"composite\">H\u1ED7n h\u1EE3p (Nh\u1EADp tay)</option>\r\n                                         </select>\r\n                                         \r\n                                         <div class=\"flex-1 relative group/input\">\r\n                                             @if(conType === 'simple' || conType === 'shared_recipe') {\r\n                                                 @let validItem = conType === 'simple' ? validInventoryMap().get(con.get('name')?.value || '') : validRecipeMap().get(con.get('name')?.value || '');\r\n                                                 <div class=\"flex items-center justify-between px-3 py-1.5 w-full\">\r\n                                                     <div class=\"flex flex-col flex-1\">\r\n                                                         <div class=\"flex items-center gap-2\">\r\n                                                             <span class=\"text-sm font-bold text-slate-700 dark:text-slate-300\">\r\n                                                                 {{ con.get('_displayName')?.value || '(Ch\u01B0a ch\u1ECDn)' }}\r\n                                                             </span>\r\n                                                             @if(con.get('name')?.value) {\r\n                                                                 @if(validItem) {\r\n                                                                     <span class=\"text-[9px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1 rounded flex items-center gap-1\"><i class=\"fa-solid fa-check-circle\"></i> Kh\u1EDBp</span>\r\n                                                                 } @else {\r\n                                                                     <span class=\"text-[9px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded flex items-center gap-1 animate-pulse\"><i class=\"fa-solid fa-triangle-exclamation\"></i> L\u1ED7i ID</span>\r\n                                                                 }\r\n                                                             }\r\n                                                         </div>\r\n                                                         @if(con.get('name')?.value) {\r\n                                                             <span class=\"text-[10px] text-slate-400 dark:text-slate-500 font-mono\">ID: {{con.get('name')?.value}}</span>\r\n                                                         }\r\n                                                     </div>\r\n                                                     <button type=\"button\" (click)=\"openConsumableModal(i, false)\" class=\"text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2 py-1 rounded transition whitespace-nowrap\">\r\n                                                         @if(con.get('name')?.value && !validItem) {\r\n                                                             Ch\u1ECDn l\u1EA1i\r\n                                                         } @else {\r\n                                                             <i class=\"fa-solid fa-folder-open\"></i> Th\u01B0 vi\u1EC7n\r\n                                                         }\r\n                                                     </button>\r\n                                                 </div>\r\n                                                 <!-- Hidden Fields -->\r\n                                                 <input formControlName=\"_displayName\" type=\"hidden\">\r\n                                                 <input formControlName=\"name\" type=\"hidden\"> \r\n                                                 <input formControlName=\"recipeId\" type=\"hidden\">\r\n                                             } @else {\r\n                                                 <div class=\"flex items-center gap-2\">\r\n                                                     <span class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase\">T\u00EAn h\u1ED7n h\u1EE3p:</span>\r\n                                                     <input formControlName=\"_displayName\" (change)=\"updateCompositeId(i)\" placeholder=\"VD: H\u1ED7n h\u1EE3p \u0111\u1EC7m A\" \r\n                                                            class=\"flex-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 dark:text-slate-300 text-sm placeholder-slate-300 dark:placeholder-slate-600\">\r\n                                                     <div class=\"text-[10px] text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded\">ID: {{ con.get('name')?.value }}</div>\r\n                                                 </div>\r\n                                             }\r\n                                         </div>\r\n                                         <button type=\"button\" (click)=\"consumables.removeAt(i)\" class=\"text-slate-300 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 px-2 transition\"><i class=\"fa-solid fa-trash\"></i></button>\r\n                                      </div>\r\n                                      \r\n                                      <div class=\"p-4 grid gap-4 relative\">\r\n                                         <!-- Formula & Unit Row -->\r\n                                         <div class=\"flex gap-3 items-end\">\r\n                                            <div class=\"flex-1\">\r\n                                                <label class=\"text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1\">C\u00F4ng th\u1EE9c (T\u00EDnh tr\u00EAn 1 m\u1EABu)</label>\r\n                                                <div class=\"relative\">\r\n                                                    <input formControlName=\"formula\" class=\"w-full pl-3 pr-8 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-blue-700 dark:text-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition\" placeholder=\"VD: 10 * n_sample\">\r\n                                                    <span class=\"absolute right-3 top-2.5 text-slate-400 dark:text-slate-500 text-xs\"><i class=\"fa-solid fa-calculator\"></i></span>\r\n                                                </div>\r\n                                            </div>\r\n                                            <div class=\"w-24\">\r\n                                                <label class=\"text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1\">\u0110\u01A1n v\u1ECB</label>\r\n                                                <select formControlName=\"unit\" class=\"w-full py-2 pl-2 pr-6 text-sm border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-white dark:bg-slate-800 appearance-none cursor-pointer h-[38px]\">\r\n                                                    @for (opt of unitOptions; track opt.value) { <option [value]=\"opt.value\">{{opt.value}}</option> }\r\n                                                </select>\r\n                                            </div>\r\n                                         </div>\r\n                                         \r\n                                         <!-- Base Note & Condition Row (New Layout) -->\r\n                                         <div class=\"grid grid-cols-1 md:grid-cols-2 gap-3\">\r\n                                             <div class=\"relative\">\r\n                                                 <label class=\"text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1\">Ghi ch\u00FA (Note)</label>\r\n                                                 <div class=\"relative\">\r\n                                                     <i class=\"fa-regular fa-note-sticky absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 text-xs\"></i>\r\n                                                     <input formControlName=\"base_note\" placeholder=\"VD: C\u00E2n ch\u00EDnh x\u00E1c, pha trong t\u1EE7 h\u00FAt...\" \r\n                                                            class=\"w-full pl-8 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg outline-none focus:border-orange-400 dark:focus:border-orange-500 focus:ring-1 focus:ring-orange-200 dark:focus:ring-orange-900/30 transition\">\r\n                                                 </div>\r\n                                             </div>\r\n                                             <div class=\"relative\">\r\n                                                 <label class=\"text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1\">\u0110i\u1EC1u ki\u1EC7n (Conditional)</label>\r\n                                                 <div class=\"relative\">\r\n                                                     <i class=\"fa-solid fa-code-branch absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 text-xs\"></i>\r\n                                                     <input formControlName=\"condition\" placeholder=\"VD: !use_b2 (ch\u1EC9 hi\u1EC7n khi bi\u1EBFn use_b2 = false)\" \r\n                                                            class=\"w-full pl-8 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg font-mono text-slate-600 dark:text-slate-400 outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:ring-1 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition\">\r\n                                                 </div>\r\n                                             </div>\r\n                                         </div>\r\n\r\n                                         <!-- Ingredients (Composite Only) -->\r\n                                         @if (conType === 'composite') {\r\n                                            <div class=\"mt-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3 relative z-10\">\r\n                                               <div class=\"flex justify-between items-center mb-2 border-b border-slate-200 dark:border-slate-700 pb-2\">\r\n                                                   <span class=\"text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2\"><i class=\"fa-solid fa-layer-group text-blue-500 dark:text-blue-400\"></i> Th\u00E0nh ph\u1EA7n con</span>\r\n                                                   <button type=\"button\" (click)=\"addIngredient(i)\" class=\"text-[10px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 px-2 py-1 rounded font-bold transition\">+ Th\u00EAm Ch\u1EA5t</button>\r\n                                               </div>\r\n                                               <div formArrayName=\"ingredients\" class=\"space-y-2\">\r\n                                                  @for (ing of getIngredients(i).controls; track ing; let j = $index) {\r\n                                                     <div [formGroupName]=\"j\" class=\"flex gap-2 items-center relative\" [style.zIndex]=\"100-j\">\r\n                                                        <div class=\"flex-1 relative\">\r\n                                                            @let validSubItem = validInventoryMap().get(ing.get('name')?.value || '');\r\n                                                            <div class=\"flex items-center justify-between w-full border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs bg-white dark:bg-slate-800 shadow-sm\">\r\n                                                                <div class=\"flex flex-col flex-1\">\r\n                                                                    <div class=\"flex items-center gap-2\">\r\n                                                                        <span class=\"font-bold text-slate-700 dark:text-slate-300\">\r\n                                                                            {{ ing.get('_displayName')?.value || '(Ch\u01B0a ch\u1ECDn h\u00F3a ch\u1EA5t)' }}\r\n                                                                        </span>\r\n                                                                        @if(ing.get('name')?.value) {\r\n                                                                            @if(validSubItem) {\r\n                                                                                <span class=\"text-[9px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1 rounded flex items-center gap-1\"><i class=\"fa-solid fa-check-circle\"></i> Kh\u1EDBp</span>\r\n                                                                            } @else {\r\n                                                                                <span class=\"text-[9px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded flex items-center gap-1 animate-pulse\"><i class=\"fa-solid fa-triangle-exclamation\"></i> L\u1ED7i ID</span>\r\n                                                                            }\r\n                                                                        }\r\n                                                                    </div>\r\n                                                                    @if(ing.get('name')?.value) {\r\n                                                                        <span class=\"text-[10px] text-slate-400 dark:text-slate-500 font-mono\">ID: {{ing.get('name')?.value}}</span>\r\n                                                                    }\r\n                                                                </div>\r\n                                                                <button type=\"button\" (click)=\"openConsumableModal(i, true, j)\" class=\"text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2 py-1 rounded transition whitespace-nowrap\">\r\n                                                                    @if(ing.get('name')?.value && !validSubItem) {\r\n                                                                        Ch\u1ECDn l\u1EA1i\r\n                                                                    } @else {\r\n                                                                        <i class=\"fa-solid fa-folder-open\"></i> Th\u01B0 vi\u1EC7n\r\n                                                                    }\r\n                                                                </button>\r\n                                                            </div>\r\n                                                            <input formControlName=\"_displayName\" type=\"hidden\">\r\n                                                            <input formControlName=\"name\" type=\"hidden\">\r\n                                                        </div>\r\n                                                        <input formControlName=\"amount\" type=\"number\" placeholder=\"L\u01B0\u1EE3ng\" class=\"w-16 border border-slate-300 dark:border-slate-600 bg-transparent rounded px-1 py-1.5 text-xs text-center outline-none font-bold\">\r\n                                                        <select formControlName=\"unit\" class=\"w-16 border border-slate-300 dark:border-slate-600 rounded px-1 py-1.5 text-xs text-center outline-none bg-white dark:bg-slate-800\">@for (opt of unitOptions; track opt.value) { <option [value]=\"opt.value\">{{opt.value}}</option> }</select>\r\n                                                        <button type=\"button\" (click)=\"getIngredients(i).removeAt(j)\" class=\"w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition rounded-full hover:bg-white dark:hover:bg-slate-700\"><i class=\"fa-solid fa-times\"></i></button>\r\n                                                     </div>\r\n                                                  }\r\n                                               </div>\r\n                                            </div>\r\n                                         }\r\n                                      </div>\r\n                                   </div>\r\n                                }\r\n                             </div>\r\n                          </div>\r\n                      }\r\n\r\n                      <!-- TAB 4: TARGETS (ANALYTES) -->\r\n                      @if (currentTab() === 'targets') {\r\n                          <div class=\"fade-in pb-32\">\r\n                              <div class=\"bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700\">\r\n                                  <div class=\"flex justify-between items-center mb-4\">\r\n                                      <h3 class=\"font-bold text-slate-800 dark:text-slate-200 text-sm uppercase flex items-center gap-2\">\r\n                                          <i class=\"fa-solid fa-bullseye text-emerald-500 dark:text-emerald-400\"></i> Danh S\u00E1ch Ch\u1EC9 Ti\u00EAu (Targets)\r\n                                      </h3>\r\n                                      <div class=\"flex gap-2\">\r\n                                          <button type=\"button\" (click)=\"openGroupImport()\" class=\"text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1\">\r\n                                              <i class=\"fa-solid fa-layer-group\"></i> Nh\u1EADp t\u1EEB B\u1ED9\r\n                                          </button>\r\n                                          <button type=\"button\" (click)=\"openTargetModal()\" class=\"text-xs bg-emerald-500 text-white hover:bg-emerald-600 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 shadow-sm shadow-emerald-500/20\">\r\n                                              <i class=\"fa-solid fa-magnifying-glass-plus\"></i> Ch\u1ECDn t\u1EEB Danh M\u1EE5c G\u1ED1c\r\n                                          </button>\r\n                                      </div>\r\n                                  </div>\r\n                                  <p class=\"text-xs text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700\">\r\n                                      <i class=\"fa-solid fa-circle-info mr-1\"></i> \u0110\u1ECBnh ngh\u0129a c\u00E1c ch\u1EA5t ph\u00E2n t\u00EDch c\u1EA7n tr\u1EA3 k\u1EBFt qu\u1EA3 trong SOP n\u00E0y (V\u00ED d\u1EE5: Chloramphenicol, Sulfamethoxazole...).\r\n                                  </p>\r\n\r\n                                  <div formArrayName=\"targets\" class=\"space-y-3\">\r\n                                      @for (t of targets.controls; track t; let i = $index) {\r\n                                          @let masterItem = validTargetMap().get(t.get('id')?.value || '');\r\n                                          <div [formGroupName]=\"i\" class=\"flex gap-2 items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border group transition-colors\" [class.border-red-200]=\"!masterItem\" [class.dark:border-red-900]=\"!masterItem\" [class.border-slate-100]=\"masterItem\" [class.dark:border-slate-700]=\"masterItem\">\r\n                                              <div class=\"w-8 h-8 rounded text-xs font-bold mt-1 flex items-center justify-center transition-colors\" [class.bg-red-100]=\"!masterItem\" [class.text-red-600]=\"!masterItem\" [class.bg-slate-200]=\"masterItem\" [class.text-slate-500]=\"masterItem\" [class.dark:bg-slate-700]=\"masterItem\" [class.dark:text-slate-400]=\"masterItem\">{{i+1}}</div>\r\n                                              \r\n                                              <div class=\"flex-1 grid grid-cols-1 md:grid-cols-12 gap-2\">\r\n                                                  <!-- Name & ID -->\r\n                                                  <div class=\"md:col-span-4\">\r\n                                                      <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 flex justify-between items-center\">\r\n                                                          <span>T\u00EAn ch\u1EC9 ti\u00EAu</span>\r\n                                                          @if (masterItem) {\r\n                                                              <div class=\"flex items-center gap-1\">\r\n                                                                  <span class=\"text-[9px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1 rounded flex items-center gap-1\"><i class=\"fa-solid fa-check-circle\"></i> Kh\u1EDBp danh m\u1EE5c</span>\r\n                                                                  <button type=\"button\" (click)=\"openTargetModal(i)\" class=\"text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 px-1.5 py-0.5 rounded transition flex items-center gap-1\">\r\n                                                                      <i class=\"fa-solid fa-rotate\"></i> Thay Th\u1EBF\r\n                                                                  </button>\r\n                                                              </div>\r\n                                                          } @else {\r\n                                                              <div class=\"flex items-center gap-1\">\r\n                                                                  <span class=\"text-[9px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded flex items-center gap-1 animate-pulse\"><i class=\"fa-solid fa-triangle-exclamation\"></i> L\u1ED7i: Kh\u00F4ng t\u1ED3n t\u1EA1i!</span>\r\n                                                                  <button type=\"button\" (click)=\"openTargetModal(i)\" class=\"text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 px-1.5 py-0.5 rounded transition\">Ch\u1ECDn L\u1EA1i</button>\r\n                                                              </div>\r\n                                                          }\r\n                                                      </label>\r\n                                                      <input formControlName=\"name\" readonly class=\"w-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 rounded px-2 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed\">\r\n                                                  </div>\r\n                                                  <div class=\"md:col-span-3\">\r\n                                                      <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block\">M\u00E3 \u0111\u1ECBnh danh (\u0111\u00E3 kh\u00F3a)</label>\r\n                                                      <input formControlName=\"id\" readonly class=\"w-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 rounded px-2 py-1.5 text-xs font-mono text-slate-400 dark:text-slate-500 outline-none cursor-not-allowed\">\r\n                                                  </div>\r\n                                                  \r\n                                                  <!-- Unit, LOD, LOQ -->\r\n                                                  <div class=\"md:col-span-2\">\r\n                                                      <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block\">\u0110\u01A1n v\u1ECB</label>\r\n                                                      <input formControlName=\"unit\" placeholder=\"ppb\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500 dark:focus:border-emerald-400\">\r\n                                                  </div>\r\n                                                  <div class=\"md:col-span-3 grid grid-cols-2 gap-2\">\r\n                                                      <div>\r\n                                                          <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block\">LOD</label>\r\n                                                          <input formControlName=\"lod\" placeholder=\"0.1\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500 dark:focus:border-emerald-400\">\r\n                                                      </div>\r\n                                                      <div>\r\n                                                          <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block\">LOQ</label>\r\n                                                          <input formControlName=\"loq\" placeholder=\"0.3\" class=\"w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500 dark:focus:border-emerald-400\">\r\n                                                      </div>\r\n                                                  </div>\r\n                                              </div>\r\n                                              \r\n                                              <button type=\"button\" (click)=\"targets.removeAt(i)\" class=\"mt-6 w-8 h-8 flex items-center justify-center text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition rounded-full hover:bg-white dark:hover:bg-slate-700\"><i class=\"fa-solid fa-trash\"></i></button>\r\n                                          </div>\r\n                                      }\r\n                                      @if(targets.length === 0) {\r\n                                          <div class=\"text-center py-8 text-slate-400 dark:text-slate-500 italic bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl\">\r\n                                              Ch\u01B0a c\u00F3 ch\u1EC9 ti\u00EAu n\u00E0o \u0111\u01B0\u1EE3c c\u1EA5u h\u00ECnh.\r\n                                          </div>\r\n                                      }\r\n                                  </div>\r\n                              </div>\r\n                          </div>\r\n                      }\r\n\r\n                   </form>\r\n                </div>\r\n            </div>\r\n            <!-- RIGHT COLUMN: Preview (Simplified for brevity, logic same) -->\r\n            <div class=\"w-96 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shrink-0 shadow-xl z-20\">\r\n                <div class=\"p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-600 dark:text-slate-400\">Xem tr\u01B0\u1EDBc K\u1EBFt qu\u1EA3</div>\r\n                <div class=\"flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar\">\r\n                     @for (item of previewResults(); track item.name) {\r\n                        <div class=\"border-b border-slate-100 dark:border-slate-700/50 last:border-0 pb-2\">\r\n                           <div class=\"flex justify-between items-start\">\r\n                              <div class=\"font-medium text-xs text-slate-700 dark:text-slate-300 pr-2\">{{ item.displayName || item.name }}</div>\r\n                              <div class=\"font-bold text-sm text-blue-600 dark:text-blue-400 whitespace-nowrap\">{{formatNum(item.stockNeed)}} <span class=\"text-[10px] text-slate-400 dark:text-slate-500\">{{item.stockUnit}}</span></div>\r\n                           </div>\r\n                           @if(item.isComposite) {\r\n                              <div class=\"mt-1 pl-2 border-l-2 border-slate-100 dark:border-slate-700 ml-1\">\r\n                                 @for(sub of item.breakdown; track sub.name) {\r\n                                     <div class=\"flex justify-between text-[10px]\">\r\n                                         <span class=\"text-slate-500 dark:text-slate-400\">{{sub.displayName || sub.name}}</span>\r\n                                         <span class=\"font-bold text-slate-700 dark:text-slate-300\">{{formatNum(sub.totalNeed)}} {{sub.stockUnit}}</span>\r\n                                     </div>\r\n                                 }\r\n                              </div>\r\n                           }\r\n                        </div>\r\n                     }\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Import Group Modal -->\r\n        @if(showGroupModal()) {\r\n            <div class=\"fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in\">\r\n                <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-slide-up\">\r\n                    <div class=\"px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0\">\r\n                        <h3 class=\"font-black text-slate-800 dark:text-slate-200 text-lg\">Ch\u1ECDn Nh\u00F3m Ch\u1EC9 Ti\u00EAu</h3>\r\n                        <button (click)=\"showGroupModal.set(false)\" class=\"text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300\"><i class=\"fa-solid fa-times text-lg\"></i></button>\r\n                    </div>\r\n                    <div class=\"flex-1 overflow-y-auto p-2 custom-scrollbar\">\r\n                        @if(availableGroups().length === 0) {\r\n                            <div class=\"p-8 text-center text-slate-400 dark:text-slate-500 italic text-sm\">\r\n                                Ch\u01B0a c\u00F3 b\u1ED9 ch\u1EC9 ti\u00EAu n\u00E0o.<br>\r\n                                <a routerLink=\"/target-groups\" class=\"text-teal-600 dark:text-teal-400 hover:underline font-bold mt-1 inline-block\">T\u1EA1o m\u1EDBi t\u1EA1i \u0111\u00E2y</a>\r\n                            </div>\r\n                        } @else {\r\n                            @for(g of availableGroups(); track g.id) {\r\n                                <div (click)=\"importGroup(g)\" class=\"p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer transition group\">\r\n                                    <div class=\"font-bold text-slate-700 dark:text-slate-300 text-sm group-hover:text-teal-700 dark:group-hover:text-teal-400\">{{g.name}}</div>\r\n                                    <div class=\"text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex justify-between\">\r\n                                        <span>{{g.targets.length}} ch\u1EC9 ti\u00EAu</span>\r\n                                        @if(g.description) { <span class=\"italic max-w-[200px] truncate\">{{g.description}}</span> }\r\n                                    </div>\r\n                                </div>\r\n                            }\r\n                        }\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        }\r\n\r\n        <!-- Master Targets Selection Modal -->\r\n        @if(showTargetModal()) {\r\n            <div class=\"fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in\">\r\n                <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up\">\r\n                    <div class=\"px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shrink-0\">\r\n                        <div>\r\n                            <h3 class=\"font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2\">\r\n                                <i class=\"fa-solid fa-magnifying-glass-plus text-emerald-500\"></i> Ch\u1ECDn t\u1EEB Danh M\u1EE5c G\u1ED1c\r\n                            </h3>\r\n                            <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-0.5\">Ch\u1ECDn c\u00E1c ch\u1EC9 ti\u00EAu ph\u00E2n t\u00EDch \u0111\u1EC3 th\u00EAm v\u00E0o SOP hi\u1EC7n t\u1EA1i.</p>\r\n                        </div>\r\n                        <button (click)=\"showTargetModal.set(false)\" class=\"text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 w-8 h-8 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-full transition-colors\"><i class=\"fa-solid fa-times text-sm\"></i></button>\r\n                    </div>\r\n                    \r\n                    <div class=\"p-3 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0\">\r\n                        <div class=\"relative\">\r\n                            <i class=\"fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500\"></i>\r\n                            <input [value]=\"targetSearchTerm()\" (input)=\"targetSearchTerm.set($any($event.target).value)\" type=\"text\" placeholder=\"T\u00ECm ki\u1EBFm ch\u1EC9 ti\u00EAu theo T\u00EAn ho\u1EB7c ID...\" class=\"w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"flex-1 overflow-y-auto p-2 custom-scrollbar bg-slate-50 dark:bg-slate-800/30\">\r\n                        @if (filteredMasterTargets().length === 0) {\r\n                            <div class=\"p-12 text-center text-slate-400 dark:text-slate-500 italic text-sm\">\r\n                                <i class=\"fa-solid fa-box-open text-3xl mb-3 opacity-50\"></i><br>\r\n                                Kh\u00F4ng t\u00ECm th\u1EA5y ch\u1EC9 ti\u00EAu n\u00E0o ph\u00F9 h\u1EE3p.<br>\r\n                            </div>\r\n                        } @else {\r\n                            <div class=\"grid grid-cols-1 md:grid-cols-2 gap-2 p-1\">\r\n                                @for (m of filteredMasterTargets(); track m.id) {\r\n                                    <div (click)=\"toggleMasterTargetSelection(m.id)\" \r\n                                         class=\"p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none\"\r\n                                         [ngClass]=\"{\r\n                                            'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-400': selectedMasterTargets().has(m.id),\r\n                                            'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600': !selectedMasterTargets().has(m.id)\r\n                                         }\">\r\n                                        \r\n                                        <div class=\"w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors\"\r\n                                             [ngClass]=\"{\r\n                                                'bg-emerald-500 border-emerald-500 text-white': selectedMasterTargets().has(m.id),\r\n                                                'bg-transparent border-slate-300 dark:border-slate-600': !selectedMasterTargets().has(m.id)\r\n                                             }\">\r\n                                            @if (selectedMasterTargets().has(m.id)) { <i class=\"fa-solid fa-check text-[10px]\"></i> }\r\n                                        </div>\r\n                                        \r\n                                        <div class=\"flex-1 overflow-hidden\">\r\n                                            <div class=\"font-bold text-slate-700 dark:text-slate-200 text-sm truncate\">{{m.name}}</div>\r\n                                            <div class=\"text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5\">{{m.id}}</div>\r\n                                        </div>\r\n                                    </div>\r\n                                }\r\n                            </div>\r\n                        }\r\n                    </div>\r\n                    \r\n                    <div class=\"px-5 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center shrink-0\">\r\n                        <div class=\"text-sm font-bold text-slate-600 dark:text-slate-400\">\r\n                            @if(replacingTargetIndex() !== null) {\r\n                                Thay th\u1EBF ch\u1EC9 ti\u00EAu <span class=\"text-emerald-600 dark:text-emerald-400\">#{{replacingTargetIndex()! + 1}}</span>\r\n                            } @else {\r\n                                \u0110\u00E3 ch\u1ECDn: <span class=\"text-emerald-600 dark:text-emerald-400\">{{selectedMasterTargets().size}}</span>\r\n                            }\r\n                        </div>\r\n                        <div class=\"flex gap-2\">\r\n                            <button (click)=\"showTargetModal.set(false)\" class=\"px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors\">H\u1EE7y</button>\r\n                            <button (click)=\"confirmTargetSelection()\" [disabled]=\"selectedMasterTargets().size === 0\" class=\"px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-emerald-500/20 flex items-center gap-2\">\r\n                                @if(replacingTargetIndex() !== null) {\r\n                                    <i class=\"fa-solid fa-rotate\"></i> C\u1EADp nh\u1EADt\r\n                                } @else {\r\n                                    <i class=\"fa-solid fa-plus\"></i> Th\u00EAm v\u00E0o SOP\r\n                                }\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        }\r\n\r\n        <!-- Consumable Selection Modal -->\r\n        @if (showConsumableModal()) {\r\n            <div class=\"fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 fade-in\">\r\n                <div class=\"absolute inset-0 bg-slate-900/60 backdrop-blur-sm\" (click)=\"showConsumableModal.set(false)\"></div>\r\n                \r\n                <div class=\"bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl relative flex flex-col h-[85vh] sm:h-[80vh] overflow-hidden slide-up border border-slate-200 dark:border-slate-700\">\r\n                    <!-- Header -->\r\n                    <div class=\"px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0\">\r\n                        <div>\r\n                            <h2 class=\"text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2\">\r\n                                <i class=\"fa-solid fa-flask text-blue-500\"></i> Ch\u1ECDn H\u00F3a Ch\u1EA5t ho\u1EB7c C\u00F4ng Th\u1EE9c\r\n                            </h2>\r\n                            <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-1\">T\u00ECm v\u00E0 ch\u1ECDn trong danh m\u1EE5c ch\u1EC9 ti\u00EAu g\u1ED1c.</p>\r\n                        </div>\r\n                        <button (click)=\"showConsumableModal.set(false)\" class=\"w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors flex items-center justify-center\">\r\n                            <i class=\"fa-solid fa-xmark\"></i>\r\n                        </button>\r\n                    </div>\r\n                    \r\n                    <!-- Search Bar -->\r\n                    <div class=\"p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0\">\r\n                        <div class=\"relative\">\r\n                            <i class=\"fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400\"></i>\r\n                            <input type=\"text\" [value]=\"consumableSearchTerm()\" (input)=\"consumableSearchTerm.set($any($event.target).value)\" placeholder=\"T\u00ECm ki\u1EBFm theo T\u00EAn, ID, Danh m\u1EE5c...\" \r\n                                   class=\"w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all\">\r\n                        </div>\r\n                    </div>\r\n                    \r\n                    <!-- List -->\r\n                    <div class=\"flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-4 custom-scrollbar\">\r\n                        @if (filteredConsumables().length === 0) {\r\n                            <div class=\"p-12 text-center text-slate-400 dark:text-slate-500 italic text-sm\">\r\n                                <i class=\"fa-solid fa-box-open text-3xl mb-3 opacity-50\"></i><br>\r\n                                Kh\u00F4ng t\u00ECm th\u1EA5y d\u1EEF li\u1EC7u n\u00E0o ph\u00F9 h\u1EE3p.<br>\r\n                            </div>\r\n                        } @else {\r\n                            <div class=\"grid grid-cols-1 gap-2\">\r\n                                @for (item of filteredConsumables(); track item.id) {\r\n                                    <div (click)=\"selectConsumable(item)\" class=\"px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md cursor-pointer flex justify-between items-center group transition-all\">\r\n                                        <div class=\"flex-1 min-w-0 pr-4\">\r\n                                            <div class=\"text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate\">{{item.name}}</div>\r\n                                            <div class=\"flex flex-wrap gap-2 mt-1.5\">\r\n                                                <span class=\"text-[10px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600\">ID: {{item.id}}</span>\r\n                                                @if($any(item).category) {\r\n                                                    <span class=\"text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold\">{{$any(item).category}}</span>\r\n                                                }\r\n                                                @if($any(item).supplier || $any(item).manufacturer) {\r\n                                                    <span class=\"text-[10px] text-slate-400 dark:text-slate-500\"><i class=\"fa-solid fa-industry text-[9px] mr-1\"></i>{{$any(item).supplier || $any(item).manufacturer}}</span>\r\n                                                }\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"text-right shrink-0\">\r\n                                            <div class=\"text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 mb-1 inline-block\">{{$any(item).unit || $any(item).baseUnit}}</div>\r\n                                            @if($any(item).stock !== undefined) {\r\n                                                <div class=\"text-[10px] font-mono font-bold\" [ngClass]=\"{'text-red-500 dark:text-red-400': $any(item).stock <= 0, 'text-emerald-600 dark:text-emerald-400': $any(item).stock > 0}\">\r\n                                                    Ton: {{formatNum($any(item).stock)}}\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    </div>\r\n                                }\r\n                            </div>\r\n                        }\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        }\r\n    </div>\r\n" }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SopEditorComponent, { className: "SopEditorComponent", filePath: "src/app/features/sop/editor/sop-editor.component.ts", lineNumber: 40 }); })();
//# sourceMappingURL=sop-editor.component.js.map