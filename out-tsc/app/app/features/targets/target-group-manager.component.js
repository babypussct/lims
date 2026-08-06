import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TargetService } from './target.service';
import { MasterTargetService } from './master-target.service'; // Use Master Service
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { generateSlug } from '../../shared/utils/utils';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function TargetGroupManagerComponent_Conditional_12_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 20);
} }
function TargetGroupManagerComponent_Conditional_12_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 21);
} }
function TargetGroupManagerComponent_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 18);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_12_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.cancelEdit()); });
    i0.ɵɵtext(1, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 19);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_12_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveGroup()); });
    i0.ɵɵtemplate(3, TargetGroupManagerComponent_Conditional_12_Conditional_3_Template, 1, 0, "i", 20)(4, TargetGroupManagerComponent_Conditional_12_Conditional_4_Template, 1, 0, "i", 21);
    i0.ɵɵtext(5, " L\u01B0u ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.form.invalid || ctx_r1.isProcessing() || ctx_r1.targets.length === 0 || !ctx_r1.areAllTargetsMatched());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 3 : 4);
} }
function TargetGroupManagerComponent_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 22);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_13_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.createNew()); });
    i0.ɵɵelement(1, "i", 23);
    i0.ɵɵtext(2, " T\u1EA1o M\u1EDBi ");
    i0.ɵɵelementEnd();
} }
function TargetGroupManagerComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵelement(1, "i", 20);
    i0.ɵɵtext(2, " \u0110ang t\u1EA3i...");
    i0.ɵɵelementEnd();
} }
function TargetGroupManagerComponent_Conditional_17_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 26);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_17_For_1_Template_div_click_0_listener() { const group_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectGroup(group_r5)); });
    i0.ɵɵelementStart(1, "div", 27);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 28)(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 29);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_17_For_1_Template_button_click_6_listener($event) { const group_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.deleteGroup(group_r5, $event)); });
    i0.ɵɵelement(7, "i", 30);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    const group_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("bg-teal-50", ((tmp_11_0 = ctx_r1.selectedGroup()) == null ? null : tmp_11_0.id) === group_r5.id)("border-l-4", ((tmp_12_0 = ctx_r1.selectedGroup()) == null ? null : tmp_12_0.id) === group_r5.id)("border-l-teal-500", ((tmp_13_0 = ctx_r1.selectedGroup()) == null ? null : tmp_13_0.id) === group_r5.id)("border-l-transparent", ((tmp_14_0 = ctx_r1.selectedGroup()) == null ? null : tmp_14_0.id) !== group_r5.id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r5.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", group_r5.targets.length, " ch\u1EC9 ti\u00EAu");
} }
function TargetGroupManagerComponent_Conditional_17_ForEmpty_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 25);
    i0.ɵɵtext(1, "Ch\u01B0a c\u00F3 b\u1ED9 ch\u1EC9 ti\u00EAu n\u00E0o.");
    i0.ɵɵelementEnd();
} }
function TargetGroupManagerComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, TargetGroupManagerComponent_Conditional_17_For_1_Template, 8, 10, "div", 24, _forTrack0, false, TargetGroupManagerComponent_Conditional_17_ForEmpty_2_Template, 2, 0, "div", 25);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵrepeater(ctx_r1.groups());
} }
function TargetGroupManagerComponent_Conditional_19_For_32_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 56)(1, "span", 67);
    i0.ɵɵelement(2, "i", 68);
    i0.ɵɵtext(3, " Kh\u1EDBp Th\u01B0 vi\u1EC7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 69);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_19_For_32_Conditional_9_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r8); const ɵ$index_130_r9 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openLibraryModal(ɵ$index_130_r9)); });
    i0.ɵɵelement(5, "i", 70);
    i0.ɵɵtext(6, " Thay Th\u1EBF ");
    i0.ɵɵelementEnd()();
} }
function TargetGroupManagerComponent_Conditional_19_For_32_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 56)(1, "span", 71);
    i0.ɵɵelement(2, "i", 72);
    i0.ɵɵtext(3, " Kh\u00F4ng t\u1ED3n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 73);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_19_For_32_Conditional_10_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r10); const ɵ$index_130_r9 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openLibraryModal(ɵ$index_130_r9)); });
    i0.ɵɵtext(5, "Ch\u1ECDn L\u1EA1i");
    i0.ɵɵelementEnd()();
} }
function TargetGroupManagerComponent_Conditional_19_For_32_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "div", 51)(2, "div", 52);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 53)(5, "div", 54)(6, "label", 55)(7, "span");
    i0.ɵɵtext(8, "T\u00EAn ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, TargetGroupManagerComponent_Conditional_19_For_32_Conditional_9_Template, 7, 0, "div", 56)(10, TargetGroupManagerComponent_Conditional_19_For_32_Conditional_10_Template, 6, 0, "div", 56);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(11, "input", 57);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 58)(13, "label", 59);
    i0.ɵɵtext(14, "M\u00E3 \u0111\u1ECBnh danh (\u0111\u00E3 kh\u00F3a)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(15, "input", 60);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 61)(17, "label", 59);
    i0.ɵɵtext(18, "\u0110\u01A1n v\u1ECB theo danh m\u1EE5c g\u1ED1c");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(19, "input", 62);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 63)(21, "div")(22, "label", 59);
    i0.ɵɵtext(23, "LOD");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(24, "input", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "div")(26, "label", 59);
    i0.ɵɵtext(27, "LOQ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(28, "input", 65);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "button", 66);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_19_For_32_Template_button_click_29_listener() { const ɵ$index_130_r9 = i0.ɵɵrestoreView(_r7).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.targets.removeAt(ɵ$index_130_r9)); });
    i0.ɵɵelement(30, "i", 30);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_12_0;
    const t_r11 = ctx.$implicit;
    const ɵ$index_130_r9 = ctx.$index;
    const masterItem_r12 = i0.ɵɵnextContext(2).validTargetMap().get(((tmp_12_0 = t_r11.get("id")) == null ? null : tmp_12_0.value) || "");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("border-red-200", !masterItem_r12)("border-slate-100", masterItem_r12);
    i0.ɵɵproperty("formGroupName", ɵ$index_130_r9);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("bg-red-100", !masterItem_r12)("text-red-600", !masterItem_r12)("bg-slate-200", masterItem_r12)("text-slate-500", masterItem_r12);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ɵ$index_130_r9 + 1);
    i0.ɵɵadvance(6);
    i0.ɵɵconditional(masterItem_r12 ? 9 : 10);
} }
function TargetGroupManagerComponent_Conditional_19_ForEmpty_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 50);
    i0.ɵɵtext(1, " Ch\u01B0a c\u00F3 ch\u1EC9 ti\u00EAu. H\u00E3y ch\u1ECDn t\u1EEB danh m\u1EE5c g\u1ED1c. ");
    i0.ɵɵelementEnd();
} }
function TargetGroupManagerComponent_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 15)(1, "form", 31)(2, "div", 32)(3, "div", 33)(4, "div")(5, "label", 34);
    i0.ɵɵtext(6, "T\u00EAn nh\u00F3m ch\u1EC9 ti\u00EAu ");
    i0.ɵɵelementStart(7, "span", 35);
    i0.ɵɵtext(8, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "input", 36);
    i0.ɵɵlistener("input", function TargetGroupManagerComponent_Conditional_19_Template_input_input_9_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onNameChange($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div")(11, "label", 34);
    i0.ɵɵtext(12, "M\u00E3 \u0111\u1ECBnh danh (t\u1EF1 t\u1EA1o)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "input", 37);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 38)(15, "label", 34);
    i0.ɵɵtext(16, "M\u00F4 t\u1EA3 / Ghi ch\u00FA");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(17, "input", 39);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div", 32)(19, "div", 40)(20, "h3", 41);
    i0.ɵɵelement(21, "i", 42);
    i0.ɵɵtext(22, " Danh S\u00E1ch Ch\u1EC9 Ti\u00EAu ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "div", 43)(24, "button", 44);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_19_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openLibraryModal()); });
    i0.ɵɵelement(25, "i", 45);
    i0.ɵɵtext(26, " Ch\u1ECDn t\u1EEB Danh M\u1EE5c G\u1ED1c ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(27, "p", 46);
    i0.ɵɵelement(28, "i", 47);
    i0.ɵɵtext(29, " Ch\u1EC9 ti\u00EAu ph\u1EA3i \u0111\u01B0\u1EE3c ch\u1ECDn t\u1EEB danh m\u1EE5c ch\u1EC9 ti\u00EAu g\u1ED1c. T\u00EAn, m\u00E3 ID v\u00E0 \u0111\u01A1n v\u1ECB \u0111\u01B0\u1EE3c kh\u00F3a theo danh m\u1EE5c g\u1ED1c \u0111\u1EC3 tr\u00E1nh sai l\u1EC7ch d\u1EEF li\u1EC7u h\u1EC7 th\u1ED1ng. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "div", 48);
    i0.ɵɵrepeaterCreate(31, TargetGroupManagerComponent_Conditional_19_For_32_Template, 31, 15, "div", 49, i0.ɵɵrepeaterTrackByIdentity, false, TargetGroupManagerComponent_Conditional_19_ForEmpty_33_Template, 2, 0, "div", 50);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(30);
    i0.ɵɵrepeater(ctx_r1.targets.controls);
} }
function TargetGroupManagerComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16);
    i0.ɵɵelement(1, "i", 74);
    i0.ɵɵelementStart(2, "p", 75);
    i0.ɵɵtext(3, "Ch\u1ECDn m\u1ED9t b\u1ED9 ch\u1EC9 ti\u00EAu \u0111\u1EC3 s\u1EEDa ho\u1EB7c t\u1EA1o m\u1EDBi.");
    i0.ɵɵelementEnd()();
} }
function TargetGroupManagerComponent_Conditional_21_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 97);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_21_Conditional_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r14); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectAllLibraryFiltered()); });
    i0.ɵɵtext(1, "Ch\u1ECDn H\u1EBFt");
    i0.ɵɵelementEnd();
} }
function TargetGroupManagerComponent_Conditional_21_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 89);
    i0.ɵɵelement(1, "i", 20);
    i0.ɵɵtext(2, " \u0110ang t\u1EA3i d\u1EEF li\u1EC7u...");
    i0.ɵɵelementEnd();
} }
function TargetGroupManagerComponent_Conditional_21_Conditional_18_For_2_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 106);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const analyte_r16 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(analyte_r16.chemical_formula);
} }
function TargetGroupManagerComponent_Conditional_21_Conditional_18_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 100)(1, "input", 101);
    i0.ɵɵlistener("change", function TargetGroupManagerComponent_Conditional_21_Conditional_18_For_2_Template_input_change_1_listener() { const analyte_r16 = i0.ɵɵrestoreView(_r15).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleLibrarySelection(analyte_r16.id)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 102)(3, "div", 103);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 104)(6, "span", 105);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, TargetGroupManagerComponent_Conditional_21_Conditional_18_For_2_Conditional_8_Template, 2, 1, "span", 106);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 107);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const analyte_r16 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵclassMap(ctx_r1.selectedLibraryIds().has(analyte_r16.id) ? "bg-teal-50 border-teal-200" : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100");
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r1.selectedLibraryIds().has(analyte_r16.id));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(analyte_r16.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("ID: ", analyte_r16.id, "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(analyte_r16.chemical_formula ? 8 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(analyte_r16.default_unit || "N/A");
} }
function TargetGroupManagerComponent_Conditional_21_Conditional_18_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 99);
    i0.ɵɵtext(1, "Kh\u00F4ng t\u00ECm th\u1EA5y k\u1EBFt qu\u1EA3.");
    i0.ɵɵelementEnd();
} }
function TargetGroupManagerComponent_Conditional_21_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 90);
    i0.ɵɵrepeaterCreate(1, TargetGroupManagerComponent_Conditional_21_Conditional_18_For_2_Template, 11, 7, "label", 98, _forTrack0);
    i0.ɵɵtemplate(3, TargetGroupManagerComponent_Conditional_21_Conditional_18_Conditional_3_Template, 2, 0, "div", 99);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.filteredLibraryTargets());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.filteredLibraryTargets().length === 0 ? 3 : -1);
} }
function TargetGroupManagerComponent_Conditional_21_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Thay th\u1EBF ");
} }
function TargetGroupManagerComponent_Conditional_21_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵtextInterpolate1(" Th\u00EAm (", ctx_r1.selectedLibraryIds().size, ") ");
} }
function TargetGroupManagerComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17)(1, "div", 76)(2, "div", 77)(3, "div")(4, "h3", 78);
    i0.ɵɵelement(5, "i", 79);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 80);
    i0.ɵɵtext(8, "T\u00EAn, m\u00E3 ID v\u00E0 \u0111\u01A1n v\u1ECB s\u1EBD \u0111\u01B0\u1EE3c l\u1EA5y tr\u1EF1c ti\u1EBFp t\u1EEB danh m\u1EE5c ch\u1EC9 ti\u00EAu g\u1ED1c.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 81);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_21_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showLibraryModal.set(false)); });
    i0.ɵɵelement(10, "i", 82);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 83)(12, "div", 84);
    i0.ɵɵelement(13, "i", 85);
    i0.ɵɵelementStart(14, "input", 86);
    i0.ɵɵlistener("ngModelChange", function TargetGroupManagerComponent_Conditional_21_Template_input_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.librarySearchTerm.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(15, TargetGroupManagerComponent_Conditional_21_Conditional_15_Template, 2, 0, "button", 87);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 88);
    i0.ɵɵtemplate(17, TargetGroupManagerComponent_Conditional_21_Conditional_17_Template, 3, 0, "div", 89)(18, TargetGroupManagerComponent_Conditional_21_Conditional_18_Template, 4, 1, "div", 90);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 91)(20, "div", 92);
    i0.ɵɵtext(21, " \u0110\u00E3 ch\u1ECDn: ");
    i0.ɵɵelementStart(22, "span", 93);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div", 9)(25, "button", 94);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_21_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showLibraryModal.set(false)); });
    i0.ɵɵtext(26, "\u0110\u00F3ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "button", 95);
    i0.ɵɵlistener("click", function TargetGroupManagerComponent_Conditional_21_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.importSelectedLibraryTargets()); });
    i0.ɵɵelement(28, "i", 96);
    i0.ɵɵtemplate(29, TargetGroupManagerComponent_Conditional_21_Conditional_29_Template, 1, 0)(30, TargetGroupManagerComponent_Conditional_21_Conditional_30_Template, 1, 1);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.replacingTargetIndex() === null ? "Ch\u1ECDn t\u1EEB danh m\u1EE5c g\u1ED1c" : "Thay th\u1EBF Ch\u1EC9 ti\u00EAu", " ");
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("ngModel", ctx_r1.librarySearchTerm());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.replacingTargetIndex() === null ? 15 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.isLibraryLoading() ? 17 : 18);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.selectedLibraryIds().size);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.selectedLibraryIds().size === 0);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-rotate", ctx_r1.replacingTargetIndex() !== null)("fa-file-import", ctx_r1.replacingTargetIndex() === null);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.replacingTargetIndex() !== null ? 29 : 30);
} }
export class TargetGroupManagerComponent {
    constructor() {
        this.targetService = inject(TargetService);
        this.masterService = inject(MasterTargetService); // New Service
        this.toast = inject(ToastService);
        this.confirmation = inject(ConfirmationService);
        this.router = inject(Router);
        this.fb = inject(FormBuilder); // Explicitly type FormBuilder
        this.groups = signal([]);
        this.selectedGroup = signal(null);
        this.isLoading = signal(false);
        this.isProcessing = signal(false);
        this.isEditing = signal(false);
        // Library Modal State
        this.showLibraryModal = signal(false);
        this.isLibraryLoading = signal(false);
        this.libraryTargets = signal([]); // Changed to MasterAnalyte
        this.selectedLibraryIds = signal(new Set());
        this.librarySearchTerm = signal('');
        this.replacingTargetIndex = signal(null);
        this.validTargetMap = computed(() => {
            const map = new Map();
            this.libraryTargets().forEach(target => map.set(target.id, target));
            return map;
        });
        this.form = this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            description: [''],
            targets: this.fb.array([])
        });
        // --- MASTER LIBRARY: nguồn duy nhất để tạo và thay thế Target trong Group ---
        this.filteredLibraryTargets = computed(() => {
            const term = this.librarySearchTerm().toLowerCase().trim();
            if (!term)
                return this.libraryTargets();
            return this.libraryTargets().filter(t => t.name.toLowerCase().includes(term) ||
                t.id.toLowerCase().includes(term));
        });
    }
    get targets() { return this.form.get('targets'); }
    ngOnInit() {
        this.loadGroups();
        this.loadMasterTargets();
    }
    async loadGroups() {
        this.isLoading.set(true);
        try {
            const data = await this.targetService.getAllGroups();
            this.groups.set(data);
        }
        catch (e) {
            this.toast.show('Lỗi tải dữ liệu', 'error');
        }
        finally {
            this.isLoading.set(false);
        }
    }
    goBack() {
        this.router.navigate(['/config']);
    }
    selectGroup(g) {
        this.selectedGroup.set(g);
        this.isEditing.set(true);
        this.form.patchValue({ id: g.id, name: g.name, description: g.description });
        this.targets.clear();
        (g.targets || []).forEach(t => this.addTargetRaw(t));
    }
    createNew() {
        this.selectedGroup.set(null);
        this.isEditing.set(true);
        this.form.reset({ id: '', name: '', description: '' });
        this.targets.clear();
    }
    cancelEdit() {
        this.isEditing.set(false);
        this.selectedGroup.set(null);
    }
    addTargetRaw(t) {
        const masterTarget = t.id ? this.validTargetMap().get(t.id) : undefined;
        this.targets.push(this.fb.group({
            id: [masterTarget?.id || t.id || '', Validators.required],
            name: [masterTarget?.name || t.name || '', Validators.required],
            unit: [masterTarget?.default_unit || t.unit || 'ppb'],
            lod: [t.lod || ''],
            loq: [t.loq || ''],
            isMasterLinked: [!!masterTarget]
        }));
    }
    onNameChange(event) {
        if (!this.selectedGroup()) {
            this.form.patchValue({ id: 'group_' + generateSlug(event.target.value) });
        }
    }
    areAllTargetsMatched() {
        const masterMap = this.validTargetMap();
        return this.targets.controls.every(control => masterMap.has(control.get('id')?.value || ''));
    }
    async saveGroup() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.toast.show('Vui lòng kiểm tra các trường bắt buộc', 'error');
            return;
        }
        if (this.targets.length === 0) {
            this.toast.show('Bộ chỉ tiêu phải có ít nhất một chỉ tiêu từ danh mục gốc.', 'error');
            return;
        }
        if (!this.areAllTargetsMatched()) {
            this.toast.show('Có chỉ tiêu không tồn tại trong danh mục chỉ tiêu gốc. Vui lòng chọn lại trước khi lưu.', 'error');
            return;
        }
        this.isProcessing.set(true);
        const val = this.form.getRawValue();
        const masterMap = this.validTargetMap();
        const rawTargets = val.targets;
        const uniqueIds = new Set(rawTargets.map(target => target.id));
        if (uniqueIds.size !== rawTargets.length) {
            this.toast.show('Không thể lưu vì có mã ID chỉ tiêu bị trùng.', 'error');
            this.isProcessing.set(false);
            return;
        }
        // Master Target là nguồn dữ liệu duy nhất cho identity và đơn vị của chỉ tiêu.
        const cleanTargets = rawTargets.map(target => {
            const masterTarget = masterMap.get(target.id);
            return {
                id: masterTarget.id,
                name: masterTarget.name,
                unit: masterTarget.default_unit || 'ppb',
                lod: target.lod || '',
                loq: target.loq || '',
                isMasterLinked: true
            };
        });
        const group = {
            id: val.id,
            name: val.name,
            description: val.description || '',
            targets: cleanTargets
        };
        try {
            await this.targetService.saveGroup(group);
            this.toast.show('Đã lưu thành công', 'success');
            this.loadGroups();
            if (!this.selectedGroup())
                this.selectGroup(group);
        }
        catch (e) {
            this.toast.show('Lỗi lưu: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    async deleteGroup(g, event) {
        event.stopPropagation();
        if (await this.confirmation.confirm(`Xóa bộ chỉ tiêu "${g.name}"?`)) {
            await this.targetService.deleteGroup(g.id);
            this.toast.show('Đã xóa');
            this.loadGroups();
            if (this.selectedGroup()?.id === g.id)
                this.cancelEdit();
        }
    }
    async loadMasterTargets() {
        if (this.isLibraryLoading())
            return;
        this.isLibraryLoading.set(true);
        try {
            const data = await this.masterService.getAll();
            this.libraryTargets.set(data);
            this.hydrateTargetsFromMaster();
        }
        catch (e) {
            this.toast.show('Không thể kết nối đến danh mục chỉ tiêu gốc.', 'error');
        }
        finally {
            this.isLibraryLoading.set(false);
        }
    }
    hydrateTargetsFromMaster() {
        const masterMap = this.validTargetMap();
        this.targets.controls.forEach(control => {
            const masterTarget = masterMap.get(control.get('id')?.value || '');
            if (masterTarget) {
                control.patchValue({
                    id: masterTarget.id,
                    name: masterTarget.name,
                    unit: masterTarget.default_unit || 'ppb',
                    isMasterLinked: true
                }, { emitEvent: false });
            }
            else {
                control.patchValue({ isMasterLinked: false }, { emitEvent: false });
            }
        });
    }
    async openLibraryModal(index) {
        this.replacingTargetIndex.set(typeof index === 'number' ? index : null);
        this.selectedLibraryIds.set(new Set());
        this.librarySearchTerm.set('');
        this.showLibraryModal.set(true);
        if (this.libraryTargets().length === 0) {
            await this.loadMasterTargets();
        }
    }
    toggleLibrarySelection(id) {
        this.selectedLibraryIds.update(ids => {
            const newSet = new Set(ids);
            if (newSet.has(id)) {
                newSet.delete(id);
            }
            else {
                if (this.replacingTargetIndex() !== null)
                    newSet.clear();
                newSet.add(id);
            }
            return newSet;
        });
    }
    selectAllLibraryFiltered() {
        const currentFilteredIds = this.filteredLibraryTargets().map(t => t.id);
        this.selectedLibraryIds.update(ids => {
            const newSet = new Set(ids);
            currentFilteredIds.forEach(id => newSet.add(id));
            return newSet;
        });
    }
    importSelectedLibraryTargets() {
        const selectedIds = this.selectedLibraryIds();
        if (selectedIds.size === 0)
            return;
        const replaceIndex = this.replacingTargetIndex();
        if (replaceIndex !== null) {
            const selectedId = Array.from(selectedIds)[0];
            const masterTarget = this.libraryTargets().find(target => target.id === selectedId);
            if (!masterTarget)
                return;
            const duplicateIndex = this.targets.controls.findIndex((control, index) => index !== replaceIndex && control.get('id')?.value === masterTarget.id);
            if (duplicateIndex !== -1) {
                this.toast.show('Chỉ tiêu này đã có trong bộ.', 'info');
                return;
            }
            const currentTarget = this.targets.at(replaceIndex);
            currentTarget.patchValue({
                id: masterTarget.id,
                name: masterTarget.name,
                unit: masterTarget.default_unit || 'ppb',
                isMasterLinked: true
            });
            this.toast.show(`Đã thay thế bằng chỉ tiêu "${masterTarget.name}".`, 'success');
            this.showLibraryModal.set(false);
            this.replacingTargetIndex.set(null);
            return;
        }
        const currentTargets = this.form.get('targets');
        const existingIds = new Set(currentTargets.value.map(t => t.id));
        let addedCount = 0;
        this.libraryTargets().forEach(t => {
            if (selectedIds.has(t.id)) {
                if (!existingIds.has(t.id)) {
                    // Map MasterAnalyte to SopTarget with LINKED flag
                    this.addTargetRaw({
                        id: t.id,
                        name: t.name,
                        unit: t.default_unit || 'ppb',
                        isMasterLinked: true // <-- LOCK THIS ID
                    });
                    existingIds.add(t.id);
                    addedCount++;
                }
            }
        });
        if (addedCount > 0) {
            this.toast.show(`Đã thêm ${addedCount} chỉ tiêu từ danh mục chỉ tiêu gốc.`, 'success');
        }
        else {
            this.toast.show('Các chỉ tiêu đã chọn đều có sẵn trong danh sách.', 'info');
        }
        this.showLibraryModal.set(false);
        this.replacingTargetIndex.set(null);
    }
    static { this.ɵfac = function TargetGroupManagerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TargetGroupManagerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TargetGroupManagerComponent, selectors: [["app-target-group-manager"]], decls: 22, vars: 4, consts: [[1, "h-full", "flex", "flex-col", "fade-in", "bg-slate-50", "relative", "pb-10"], [1, "h-16", "bg-white", "border-b", "border-slate-200", "flex", "items-center", "justify-between", "px-6", "shrink-0", "shadow-sm", "z-30"], [1, "flex", "items-center", "gap-4"], [1, "text-slate-500", "hover:text-slate-800", "text-sm", "font-bold", "flex", "items-center", "gap-2", "transition", 3, "click"], [1, "fa-solid", "fa-arrow-left"], [1, "hidden", "md:inline"], [1, "h-6", "w-px", "bg-slate-200"], [1, "text-lg", "font-black", "text-slate-800", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-layer-group", "text-teal-600"], [1, "flex", "gap-2"], [1, "px-4", "py-2", "bg-teal-600", "hover:bg-teal-700", "text-white", "rounded-lg", "font-bold", "text-xs", "shadow-md", "transition", "flex", "items-center", "gap-2"], [1, "flex-1", "flex", "overflow-hidden"], [1, "w-72", "bg-white", "border-r", "border-slate-200", "flex", "flex-col", "shrink-0", "overflow-y-auto", "custom-scrollbar"], [1, "p-4", "text-center", "text-slate-400", "text-xs"], [1, "flex-1", "bg-slate-50", "flex", "flex-col", "overflow-hidden", "relative"], [1, "flex-1", "overflow-y-auto", "p-6", "custom-scrollbar"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "text-slate-400"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "px-4", "py-2", "text-slate-500", "hover:bg-slate-100", "rounded-lg", "font-bold", "text-xs", "transition", 3, "click"], [1, "px-4", "py-2", "bg-teal-600", "hover:bg-teal-700", "text-white", "rounded-lg", "font-bold", "text-xs", "shadow-md", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-save"], [1, "px-4", "py-2", "bg-teal-600", "hover:bg-teal-700", "text-white", "rounded-lg", "font-bold", "text-xs", "shadow-md", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-plus"], [1, "p-4", "border-b", "border-slate-100", "hover:bg-slate-50", "cursor-pointer", "transition", "group", "relative", 3, "bg-teal-50", "border-l-4", "border-l-teal-500", "border-l-transparent"], [1, "p-8", "text-center", "text-slate-400", "italic", "text-xs"], [1, "p-4", "border-b", "border-slate-100", "hover:bg-slate-50", "cursor-pointer", "transition", "group", "relative", 3, "click"], [1, "font-bold", "text-sm", "text-slate-700", "mb-1"], [1, "text-[10px]", "text-slate-500", "flex", "justify-between", "items-center"], [1, "w-6", "h-6", "rounded-full", "hover:bg-red-100", "text-slate-300", "hover:text-red-500", "transition", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "fa-trash"], [1, "max-w-4xl", "mx-auto", "space-y-6", 3, "formGroup"], [1, "bg-white", "p-5", "rounded-2xl", "shadow-sm", "border", "border-slate-200"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "block", "text-xs", "font-bold", "text-slate-500", "uppercase", "mb-1"], [1, "text-red-500"], ["formControlName", "name", "placeholder", "VD: Nh\u00F3m Kh\u00E1ng sinh (Sulfonamides)", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-sm", "font-bold", "outline-none", "focus:border-teal-500", "transition", 3, "input"], ["formControlName", "id", "readonly", "", 1, "w-full", "border", "border-slate-200", "bg-slate-100", "rounded-lg", "p-2.5", "text-xs", "font-mono", "text-slate-600", "outline-none"], [1, "mt-3"], ["formControlName", "description", "placeholder", "M\u00F4 t\u1EA3 ng\u1EAFn v\u1EC1 nh\u00F3m n\u00E0y...", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-xs", "outline-none", "focus:border-teal-500", "transition"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "font-bold", "text-slate-700", "text-sm", "uppercase", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-list-ul", "text-teal-500"], [1, "flex", "flex-wrap", "justify-end", "gap-2"], ["type", "button", 1, "text-xs", "bg-teal-600", "text-white", "hover:bg-teal-700", "border", "border-teal-600", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition", "flex", "items-center", "gap-1", "active:scale-95", "shadow-sm", 3, "click"], [1, "fa-solid", "fa-magnifying-glass-plus"], [1, "text-xs", "text-slate-500", "mb-4", "bg-slate-50", "p-3", "rounded-lg", "border", "border-slate-100"], [1, "fa-solid", "fa-circle-info", "mr-1", "text-teal-600"], ["formArrayName", "targets", 1, "space-y-2"], [1, "flex", "gap-2", "items-start", "p-3", "bg-slate-50", "rounded-xl", "border", "group", "transition-colors", 3, "formGroupName", "border-red-200", "border-slate-100"], [1, "text-center", "py-8", "text-slate-400", "italic", "bg-white", "border", "border-dashed", "border-slate-200", "rounded-xl"], [1, "flex", "gap-2", "items-start", "p-3", "bg-slate-50", "rounded-xl", "border", "group", "transition-colors", 3, "formGroupName"], [1, "w-8", "h-8", "rounded", "text-xs", "font-bold", "mt-1", "flex", "items-center", "justify-center", "transition-colors"], [1, "flex-1", "grid", "grid-cols-1", "md:grid-cols-12", "gap-2"], [1, "md:col-span-4"], [1, "text-[9px]", "font-bold", "text-slate-400", "uppercase", "mb-1", "flex", "justify-between", "items-center", "gap-2"], [1, "flex", "items-center", "gap-1"], ["formControlName", "name", "readonly", "", 1, "w-full", "border", "border-slate-200", "bg-slate-100", "rounded", "px-2", "py-1.5", "text-xs", "font-bold", "text-slate-500", "outline-none", "cursor-not-allowed"], [1, "md:col-span-3"], [1, "text-[9px]", "font-bold", "text-slate-400", "uppercase", "mb-1", "block"], ["formControlName", "id", "readonly", "", 1, "w-full", "border", "border-slate-200", "bg-slate-100", "rounded", "px-2", "py-1.5", "text-xs", "font-mono", "text-slate-400", "outline-none", "cursor-not-allowed"], [1, "md:col-span-2"], ["formControlName", "unit", "readonly", "", 1, "w-full", "border", "border-slate-200", "bg-slate-100", "rounded", "px-2", "py-1.5", "text-xs", "text-slate-500", "outline-none", "cursor-not-allowed", "text-center"], [1, "md:col-span-3", "grid", "grid-cols-2", "gap-1"], ["formControlName", "lod", "placeholder", "LOD", 1, "w-full", "border", "border-slate-300", "bg-white", "rounded", "px-2", "py-1.5", "text-xs", "outline-none", "focus:border-teal-500", "text-center"], ["formControlName", "loq", "placeholder", "LOQ", 1, "w-full", "border", "border-slate-300", "bg-white", "rounded", "px-2", "py-1.5", "text-xs", "outline-none", "focus:border-teal-500", "text-center"], ["type", "button", 1, "mt-6", "w-8", "h-8", "flex", "items-center", "justify-center", "text-slate-300", "hover:text-red-500", "transition", "rounded-full", "hover:bg-white", 3, "click"], [1, "text-[9px]", "bg-emerald-100", "text-emerald-600", "px-1", "rounded", "flex", "items-center", "gap-1", "whitespace-nowrap"], [1, "fa-solid", "fa-check-circle"], ["type", "button", 1, "text-[9px]", "bg-blue-100", "text-blue-600", "hover:bg-blue-200", "px-1.5", "py-0.5", "rounded", "transition", "flex", "items-center", "gap-1", "whitespace-nowrap", 3, "click"], [1, "fa-solid", "fa-rotate"], [1, "text-[9px]", "bg-red-100", "text-red-600", "px-1", "rounded", "flex", "items-center", "gap-1", "whitespace-nowrap"], [1, "fa-solid", "fa-triangle-exclamation"], ["type", "button", 1, "text-[9px]", "bg-blue-100", "text-blue-600", "hover:bg-blue-200", "px-1.5", "py-0.5", "rounded", "transition", "whitespace-nowrap", 3, "click"], [1, "fa-solid", "fa-layer-group", "text-4xl", "mb-4", "text-slate-300"], [1, "text-sm", "font-medium"], [1, "bg-white", "rounded-2xl", "shadow-xl", "w-full", "max-w-2xl", "overflow-hidden", "flex", "flex-col", "h-[80vh]", "animate-slide-up"], [1, "px-5", "py-4", "border-b", "border-slate-100", "bg-slate-50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-black", "text-slate-800", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-book-medical", "text-teal-600"], [1, "text-xs", "text-slate-500", "mt-0.5"], [1, "w-8", "h-8", "rounded-full", "bg-white", "border", "border-slate-200", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-red-500", "transition", 3, "click"], [1, "fa-solid", "fa-times"], [1, "p-4", "border-b", "border-slate-100", "flex", "gap-2"], [1, "relative", "flex-1"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-2.5", "text-slate-400", "text-xs"], ["placeholder", "T\u00ECm ki\u1EBFm...", 1, "w-full", "pl-8", "pr-4", "py-2", "border", "border-slate-200", "rounded-xl", "text-xs", "font-bold", "outline-none", "focus:border-teal-500", "focus:ring-1", "focus:ring-teal-200", "transition", 3, "ngModelChange", "ngModel"], [1, "px-3", "py-2", "bg-slate-100", "hover:bg-slate-200", "text-slate-600", "rounded-lg", "text-xs", "font-bold", "whitespace-nowrap", "transition"], [1, "flex-1", "overflow-y-auto", "p-2", "custom-scrollbar"], [1, "py-10", "text-center", "text-slate-400"], [1, "grid", "grid-cols-1", "gap-1"], [1, "p-4", "border-t", "border-slate-100", "bg-slate-50", "flex", "justify-between", "items-center", "shrink-0"], [1, "text-xs", "font-bold", "text-slate-500"], [1, "text-teal-600", "text-sm"], [1, "px-4", "py-2", "text-slate-600", "hover:bg-slate-200", "rounded-lg", "font-bold", "text-xs", "transition", 3, "click"], [1, "px-6", "py-2", "bg-teal-600", "hover:bg-teal-700", "text-white", "rounded-lg", "font-bold", "text-xs", "shadow-md", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid"], [1, "px-3", "py-2", "bg-slate-100", "hover:bg-slate-200", "text-slate-600", "rounded-lg", "text-xs", "font-bold", "whitespace-nowrap", "transition", 3, "click"], [1, "flex", "items-center", "gap-3", "p-3", "rounded-xl", "cursor-pointer", "border", "transition", "group", 3, "class"], [1, "py-10", "text-center", "text-slate-400", "italic", "text-xs"], [1, "flex", "items-center", "gap-3", "p-3", "rounded-xl", "cursor-pointer", "border", "transition", "group"], ["type", "checkbox", 1, "w-4", "h-4", "accent-teal-600", "rounded", "cursor-pointer", 3, "change", "checked"], [1, "flex-1", "min-w-0"], [1, "font-bold", "text-sm", "text-slate-700", "group-hover:text-teal-700", "truncate"], [1, "flex", "gap-2", "mt-0.5", "text-[10px]"], [1, "font-mono", "text-slate-400", "bg-slate-100", "px-1.5", "rounded"], [1, "text-slate-500", "font-serif"], [1, "text-xs", "font-bold", "text-slate-500", "bg-slate-100", "px-2", "py-1", "rounded"]], template: function TargetGroupManagerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "button", 3);
            i0.ɵɵlistener("click", function TargetGroupManagerComponent_Template_button_click_3_listener() { return ctx.goBack(); });
            i0.ɵɵelement(4, "i", 4);
            i0.ɵɵelementStart(5, "span", 5);
            i0.ɵɵtext(6, "C\u1EA5u H\u00ECnh");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(7, "div", 6);
            i0.ɵɵelementStart(8, "h2", 7);
            i0.ɵɵelement(9, "i", 8);
            i0.ɵɵtext(10, " Qu\u1EA3n L\u00FD Nh\u00F3m Ch\u1EC9 Ti\u00EAu ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "div", 9);
            i0.ɵɵtemplate(12, TargetGroupManagerComponent_Conditional_12_Template, 6, 2)(13, TargetGroupManagerComponent_Conditional_13_Template, 3, 0, "button", 10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div", 11)(15, "div", 12);
            i0.ɵɵtemplate(16, TargetGroupManagerComponent_Conditional_16_Template, 3, 0, "div", 13)(17, TargetGroupManagerComponent_Conditional_17_Template, 3, 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div", 14);
            i0.ɵɵtemplate(19, TargetGroupManagerComponent_Conditional_19_Template, 34, 2, "div", 15)(20, TargetGroupManagerComponent_Conditional_20_Template, 4, 0, "div", 16);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(21, TargetGroupManagerComponent_Conditional_21_Template, 31, 11, "div", 17);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(12);
            i0.ɵɵconditional(ctx.isEditing() ? 12 : 13);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.isLoading() ? 16 : 17);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.isEditing() ? 19 : 20);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showLibraryModal() ? 21 : -1);
        } }, dependencies: [CommonModule, ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i1.FormGroupName, i1.FormArrayName, FormsModule, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TargetGroupManagerComponent, [{
        type: Component,
        args: [{
                selector: 'app-target-group-manager',
                standalone: true,
                imports: [CommonModule, ReactiveFormsModule, FormsModule],
                template: `
    <div class="h-full flex flex-col fade-in bg-slate-50 relative pb-10">
        
        <!-- Header -->
        <div class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-30">
            <div class="flex items-center gap-4">
                <button (click)="goBack()" class="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2 transition">
                    <i class="fa-solid fa-arrow-left"></i> <span class="hidden md:inline">Cấu Hình</span>
                </button>
                <div class="h-6 w-px bg-slate-200"></div>
                <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
                    <i class="fa-solid fa-layer-group text-teal-600"></i> Quản Lý Nhóm Chỉ Tiêu
                </h2>
            </div>
            
            <div class="flex gap-2">
                @if(isEditing()) {
                    <button (click)="cancelEdit()" class="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold text-xs transition">Hủy</button>
                    <button (click)="saveGroup()" [disabled]="form.invalid || isProcessing() || targets.length === 0 || !areAllTargetsMatched()" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-md transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-save"></i> } Lưu
                    </button>
                } @else {
                    <button (click)="createNew()" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-md transition flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i> Tạo Mới
                    </button>
                }
            </div>
        </div>

        <div class="flex-1 flex overflow-hidden">
            <!-- LIST SIDEBAR -->
            <div class="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                @if (isLoading()) {
                    <div class="p-4 text-center text-slate-400 text-xs"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>
                } @else {
                    @for (group of groups(); track group.id) {
                        <div (click)="selectGroup(group)" 
                             class="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition group relative"
                             [class.bg-teal-50]="selectedGroup()?.id === group.id"
                             [class.border-l-4]="selectedGroup()?.id === group.id"
                             [class.border-l-teal-500]="selectedGroup()?.id === group.id"
                             [class.border-l-transparent]="selectedGroup()?.id !== group.id">
                            
                            <div class="font-bold text-sm text-slate-700 mb-1">{{group.name}}</div>
                            <div class="text-[10px] text-slate-500 flex justify-between items-center">
                                <span>{{group.targets.length}} chỉ tiêu</span>
                                <button (click)="deleteGroup(group, $event)" class="w-6 h-6 rounded-full hover:bg-red-100 text-slate-300 hover:text-red-500 transition flex items-center justify-center">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    } @empty {
                        <div class="p-8 text-center text-slate-400 italic text-xs">Chưa có bộ chỉ tiêu nào.</div>
                    }
                }
            </div>

            <!-- EDITOR AREA -->
            <div class="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
                @if (isEditing()) {
                    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <form [formGroup]="form" class="max-w-4xl mx-auto space-y-6">
                            
                            <!-- Header Info -->
                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tên nhóm chỉ tiêu <span class="text-red-500">*</span></label>
                                        <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-teal-500 transition" placeholder="VD: Nhóm Kháng sinh (Sulfonamides)">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mã định danh (tự tạo)</label>
                                        <input formControlName="id" class="w-full border border-slate-200 bg-slate-100 rounded-lg p-2.5 text-xs font-mono text-slate-600 outline-none" readonly>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả / Ghi chú</label>
                                    <input formControlName="description" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-teal-500 transition" placeholder="Mô tả ngắn về nhóm này...">
                                </div>
                            </div>

                            <!-- Targets List -->
                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="font-bold text-slate-700 text-sm uppercase flex items-center gap-2">
                                        <i class="fa-solid fa-list-ul text-teal-500"></i> Danh Sách Chỉ Tiêu
                                    </h3>
                                    <div class="flex flex-wrap justify-end gap-2">
                                        <button type="button" (click)="openLibraryModal()" class="text-xs bg-teal-600 text-white hover:bg-teal-700 border border-teal-600 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 active:scale-95 shadow-sm">
                                            <i class="fa-solid fa-magnifying-glass-plus"></i> Chọn từ Danh Mục Gốc
                                        </button>
                                    </div>
                                </div>

                                <p class="text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <i class="fa-solid fa-circle-info mr-1 text-teal-600"></i>
                                    Chỉ tiêu phải được chọn từ danh mục chỉ tiêu gốc. Tên, mã ID và đơn vị được khóa theo danh mục gốc để tránh sai lệch dữ liệu hệ thống.
                                </p>

                                <div formArrayName="targets" class="space-y-2">
                                    @for (t of targets.controls; track t; let i = $index) {
                                        @let masterItem = validTargetMap().get(t.get('id')?.value || '');
                                        <div [formGroupName]="i" class="flex gap-2 items-start p-3 bg-slate-50 rounded-xl border group transition-colors"
                                             [class.border-red-200]="!masterItem"
                                             [class.border-slate-100]="masterItem">
                                            <div class="w-8 h-8 rounded text-xs font-bold mt-1 flex items-center justify-center transition-colors"
                                                 [class.bg-red-100]="!masterItem"
                                                 [class.text-red-600]="!masterItem"
                                                 [class.bg-slate-200]="masterItem"
                                                 [class.text-slate-500]="masterItem">{{i+1}}</div>

                                            <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                                                <div class="md:col-span-4">
                                                    <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 flex justify-between items-center gap-2">
                                                        <span>Tên chỉ tiêu</span>
                                                        @if (masterItem) {
                                                            <div class="flex items-center gap-1">
                                                                <span class="text-[9px] bg-emerald-100 text-emerald-600 px-1 rounded flex items-center gap-1 whitespace-nowrap"><i class="fa-solid fa-check-circle"></i> Khớp Thư viện</span>
                                                                <button type="button" (click)="openLibraryModal(i)" class="text-[9px] bg-blue-100 text-blue-600 hover:bg-blue-200 px-1.5 py-0.5 rounded transition flex items-center gap-1 whitespace-nowrap">
                                                                    <i class="fa-solid fa-rotate"></i> Thay Thế
                                                                </button>
                                                            </div>
                                                        } @else {
                                                            <div class="flex items-center gap-1">
                                                                <span class="text-[9px] bg-red-100 text-red-600 px-1 rounded flex items-center gap-1 whitespace-nowrap"><i class="fa-solid fa-triangle-exclamation"></i> Không tồn tại</span>
                                                                <button type="button" (click)="openLibraryModal(i)" class="text-[9px] bg-blue-100 text-blue-600 hover:bg-blue-200 px-1.5 py-0.5 rounded transition whitespace-nowrap">Chọn Lại</button>
                                                            </div>
                                                        }
                                                    </label>
                                                    <input formControlName="name" readonly class="w-full border border-slate-200 bg-slate-100 rounded px-2 py-1.5 text-xs font-bold text-slate-500 outline-none cursor-not-allowed">
                                                </div>
                                                <div class="md:col-span-3">
                                                    <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Mã định danh (đã khóa)</label>
                                                    <input formControlName="id" readonly class="w-full border border-slate-200 bg-slate-100 rounded px-2 py-1.5 text-xs font-mono text-slate-400 outline-none cursor-not-allowed">
                                                </div>
                                                <div class="md:col-span-2">
                                                    <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Đơn vị theo danh mục gốc</label>
                                                    <input formControlName="unit" readonly class="w-full border border-slate-200 bg-slate-100 rounded px-2 py-1.5 text-xs text-slate-500 outline-none cursor-not-allowed text-center">
                                                </div>
                                                <div class="md:col-span-3 grid grid-cols-2 gap-1">
                                                    <div>
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">LOD</label>
                                                        <input formControlName="lod" placeholder="LOD" class="w-full border border-slate-300 bg-white rounded px-2 py-1.5 text-xs outline-none focus:border-teal-500 text-center">
                                                    </div>
                                                    <div>
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">LOQ</label>
                                                        <input formControlName="loq" placeholder="LOQ" class="w-full border border-slate-300 bg-white rounded px-2 py-1.5 text-xs outline-none focus:border-teal-500 text-center">
                                                    </div>
                                                </div>
                                            </div>

                                            <button type="button" (click)="targets.removeAt(i)" class="mt-6 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition rounded-full hover:bg-white"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                    } @empty {
                                        <div class="text-center py-8 text-slate-400 italic bg-white border border-dashed border-slate-200 rounded-xl">
                                            Chưa có chỉ tiêu. Hãy chọn từ danh mục gốc.
                                        </div>
                                    }
                                </div>
                            </div>

                        </form>
                    </div>
                } @else {
                    <div class="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <i class="fa-solid fa-layer-group text-4xl mb-4 text-slate-300"></i>
                        <p class="text-sm font-medium">Chọn một bộ chỉ tiêu để sửa hoặc tạo mới.</p>
                    </div>
                }
            </div>
        </div>

        <!-- MASTER LIBRARY SELECTION MODAL -->
        @if (showLibraryModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh] animate-slide-up">
                    <div class="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <div>
                            <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                                <i class="fa-solid fa-book-medical text-teal-600"></i>
                                {{replacingTargetIndex() === null ? 'Chọn từ danh mục gốc' : 'Thay thế Chỉ tiêu'}}
                            </h3>
                            <p class="text-xs text-slate-500 mt-0.5">Tên, mã ID và đơn vị sẽ được lấy trực tiếp từ danh mục chỉ tiêu gốc.</p>
                        </div>
                        <button (click)="showLibraryModal.set(false)" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times"></i></button>
                    </div>
                    
                    <div class="p-4 border-b border-slate-100 flex gap-2">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                            <input [ngModel]="librarySearchTerm()" (ngModelChange)="librarySearchTerm.set($event)" 
                                   class="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition" 
                                   placeholder="Tìm kiếm...">
                        </div>
                        @if(replacingTargetIndex() === null) {
                            <button (click)="selectAllLibraryFiltered()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold whitespace-nowrap transition">Chọn Hết</button>
                        }
                    </div>

                    <div class="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        @if (isLibraryLoading()) {
                            <div class="py-10 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>
                        } @else {
                            <div class="grid grid-cols-1 gap-1">
                                @for (analyte of filteredLibraryTargets(); track analyte.id) {
                                    <label class="flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition group"
                                           [class]="selectedLibraryIds().has(analyte.id) ? 'bg-teal-50 border-teal-200' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'">
                                        <input type="checkbox" [checked]="selectedLibraryIds().has(analyte.id)" (change)="toggleLibrarySelection(analyte.id)" class="w-4 h-4 accent-teal-600 rounded cursor-pointer">
                                        <div class="flex-1 min-w-0">
                                            <div class="font-bold text-sm text-slate-700 group-hover:text-teal-700 truncate">{{analyte.name}}</div>
                                            <div class="flex gap-2 mt-0.5 text-[10px]">
                                                <span class="font-mono text-slate-400 bg-slate-100 px-1.5 rounded">ID: {{analyte.id}}</span>
                                                @if(analyte.chemical_formula) { <span class="text-slate-500 font-serif">{{analyte.chemical_formula}}</span> }
                                            </div>
                                        </div>
                                        <div class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{{analyte.default_unit || 'N/A'}}</div>
                                    </label>
                                }
                                @if (filteredLibraryTargets().length === 0) {
                                    <div class="py-10 text-center text-slate-400 italic text-xs">Không tìm thấy kết quả.</div>
                                }
                            </div>
                        }
                    </div>

                    <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <div class="text-xs font-bold text-slate-500">
                            Đã chọn: <span class="text-teal-600 text-sm">{{selectedLibraryIds().size}}</span>
                        </div>
                        <div class="flex gap-2">
                            <button (click)="showLibraryModal.set(false)" class="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-bold text-xs transition">Đóng</button>
                            <button (click)="importSelectedLibraryTargets()" [disabled]="selectedLibraryIds().size === 0" class="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2">
                                <i class="fa-solid" [class.fa-rotate]="replacingTargetIndex() !== null" [class.fa-file-import]="replacingTargetIndex() === null"></i>
                                @if(replacingTargetIndex() !== null) {
                                    Thay thế
                                } @else {
                                    Thêm ({{selectedLibraryIds().size}})
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TargetGroupManagerComponent, { className: "TargetGroupManagerComponent", filePath: "src/app/features/targets/target-group-manager.component.ts", lineNumber: 265 }); })();
//# sourceMappingURL=target-group-manager.component.js.map