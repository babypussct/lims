import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractSopEntry } from '../shared/abstract-sop-entry';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = () => ["N\u00F4ng s\u1EA3n t\u01B0\u01A1i", "N\u00F4ng s\u1EA3n kh\u00F4", "Th\u1EE7y s\u1EA3n", "Thu\u1EF7 s\u1EA3n"];
const _c1 = () => [];
const _c2 = a0 => ({ "bg-indigo-50/15 dark:bg-indigo-955/5 border-l-4 border-l-indigo-500/60": a0 });
const _forTrack0 = ($index, $item) => $item.key;
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_41_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 70);
} }
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_41_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 30)(1, "input", 67);
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_41_Template_input_ngModelChange_1_listener($event) { const sampleCode_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleSampleSelected(sampleCode_r4, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 68);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_41_Template_button_click_2_listener() { const sampleCode_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectSample(sampleCode_r4)); });
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 69);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_41_Conditional_7_Template, 1, 0, "i", 70);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sampleCode_r4 = ctx.$implicit;
    const ɵ$index_88_r5 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", ctx_r1.draft.resultData[sampleCode_r4]["selected"] !== false);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.activeSampleCode() === sampleCode_r4 ? "bg-violet-600 text-white font-extrabold shadow-sm border border-violet-655 transition shrink-0 active:scale-95" : "bg-transparent text-slate-655 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800 border-0 transition shrink-0 active:scale-95");
    i0.ɵɵclassProp("opacity-50", ctx_r1.draft.resultData[sampleCode_r4]["selected"] === false);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.activeSampleCode() === sampleCode_r4 ? "w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white" : "w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ɵ$index_88_r5 + 1, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sampleCode_r4);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.publishedSampleSet && ctx_r1.publishedSampleSet.has(sampleCode_r4) ? 7 : -1);
} }
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Conditional_76_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 71);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Conditional_76_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.bulkRandomizeMasses()); });
    i0.ɵɵelement(1, "i", 72);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Sinh TT Ng\u1EABu Nhi\u00EAn (T\u1EA5t C\u1EA3)");
    i0.ɵɵelementEnd()();
} }
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 80);
    i0.ɵɵelementStart(1, "span", 81);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const compound_r8 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.compoundDisplayNames()[compound_r8] || compound_r8);
} }
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 75);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const compound_r8 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.compoundDisplayNames()[compound_r8] || compound_r8);
} }
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td", 73);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 74);
    i0.ɵɵtemplate(4, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Conditional_4_Template, 3, 1)(5, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Conditional_5_Template, 2, 1, "span", 75);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td", 76)(7, "input", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Template_input_ngModelChange_7_listener($event) { const compound_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r8 + "_nd"], $event) || (ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r8 + "_nd"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Template_input_ngModelChange_7_listener() { const compound_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onNdCheckboxChanged(compound_r8)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 78)(9, "input", 79);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Template_input_ngModelChange_9_listener($event) { const compound_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r8], $event) || (ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r8] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Template_input_ngModelChange_9_listener() { const compound_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onResultInputChanged(compound_r8)); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const compound_r8 = ctx.$implicit;
    const ɵ$index_200_r9 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(!ctx_r1.isTargetAssigned(ctx_r1.activeSampleCode(), compound_r8) ? "bg-slate-50/50 dark:bg-slate-950/20 text-slate-400/80 dark:text-slate-600 transition-all border-l-4 border-l-transparent duration-150" : "hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-violet-50/10 dark:focus-within:bg-violet-500/5 border-l-4 border-l-transparent focus-within:border-l-violet-500 duration-150");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ɵ$index_200_r9 + 1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!ctx_r1.isTargetAssigned(ctx_r1.activeSampleCode(), compound_r8) ? 4 : 5);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", !ctx_r1.isTargetAssigned(ctx_r1.activeSampleCode(), compound_r8));
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r8 + "_nd"]);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.isTargetAssigned(ctx_r1.activeSampleCode(), compound_r8));
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r8]);
} }
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6)(1, "app-sop-header-metadata", 7);
    i0.ɵɵlistener("draftChanged", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_app_sop_header_metadata_draftChanged_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementStart(2, "div", 8)(3, "div")(4, "label", 9);
    i0.ɵɵtext(5, "2. Th\u1EC3 t\u00EDch m\u1EABu (ml)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 10)(7, "label", 11)(8, "input", 12);
    i0.ɵɵlistener("change", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_input_change_8_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.on10gCheckChange($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span", 13);
    i0.ɵɵtext(10, "100.0ml");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "input", 14);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_input_ngModelChange_11_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["khoiLuongKhac"], $event) || (ctx_r1.draft.page1Data["khoiLuongKhac"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_input_ngModelChange_11_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onKhoiLuongKhacChange()); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "div")(13, "label", 9);
    i0.ɵɵtext(14, "3. Lo\u1EA1i m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div", 15)(16, "button", 16);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.draft.page1Data["loaiMau"] = "Sinh ho\u1EA1t"; return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵtext(17, " Sinh Ho\u1EA1t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 17);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.draft.page1Data["loaiMau"] = "U\u1ED1ng"; return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵtext(19, " U\u1ED1ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "button", 18);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_button_click_20_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.draft.page1Data["loaiMau"] = "S\u1EA3n xu\u1EA5t"; return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵtext(21, " S\u1EA3n Xu\u1EA5t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "button", 19);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.draft.page1Data["loaiMau"] = "Nu\u00F4i tr\u1ED3ng"; return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵtext(23, " Nu\u00F4i Tr\u1ED3ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "input", 20);
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_input_ngModelChange_24_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.draft.page1Data["loaiMau"] = $event; return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(25, "div")(26, "label", 9);
    i0.ɵɵtext(27, "4. T\u00ECnh tr\u1EA1ng m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div", 21)(29, "button", 22);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.draft.page1Data["tinhTrangMau"] = "B\u00ECnh th\u01B0\u1EDDng"; return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵtext(30, " B\u00ECnh Th\u01B0\u1EDDng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "input", 23);
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_input_ngModelChange_31_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.draft.page1Data["tinhTrangMau"] = $event; return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(32, "div", 24)(33, "div", 25)(34, "span", 26);
    i0.ɵɵtext(35, "Danh s\u00E1ch m\u1EABu:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "button", 27);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_button_click_36_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleSelectAllSamples()); });
    i0.ɵɵelement(37, "i", 28);
    i0.ɵɵelementStart(38, "span", 29);
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(40, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_41_Template, 8, 10, "div", 30, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div", 31)(43, "label", 32);
    i0.ɵɵelement(44, "input", 33);
    i0.ɵɵelementStart(45, "div", 34)(46, "span", 35);
    i0.ɵɵtext(47, "G\u1ED9p in chung c\u00E1c m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "span", 36);
    i0.ɵɵtext(49);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(50, "div", 37)(51, "div", 38)(52, "div", 39)(53, "h4", 40);
    i0.ɵɵelement(54, "i", 41);
    i0.ɵɵtext(55, " B\u1EA3ng K\u1EBFt Qu\u1EA3 M\u1EABu: ");
    i0.ɵɵelementStart(56, "span", 42);
    i0.ɵɵtext(57);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "div", 43)(59, "span", 44);
    i0.ɵɵtext(60, "V =");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "input", 45);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_input_ngModelChange_61_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[ctx_r1.activeSampleCode()]["khoiLuong"], $event) || (ctx_r1.draft.resultData[ctx_r1.activeSampleCode()]["khoiLuong"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_input_ngModelChange_61_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(62, "span", 46);
    i0.ɵɵtext(63, "Ml");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(64, "p", 47);
    i0.ɵɵtext(65);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(66, "div", 48)(67, "input", 49);
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_input_ngModelChange_67_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.searchQuery.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(68, "i", 50);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(69, "div", 51)(70, "span", 52);
    i0.ɵɵtext(71, "M\u1EABu n\u00E0y:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(72, "button", 53);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_button_click_72_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.sampleBulkFillND()); });
    i0.ɵɵelement(73, "i", 54);
    i0.ɵɵelementStart(74, "span");
    i0.ɵɵtext(75, "\u0110\u1EB7t T\u1EA5t C\u1EA3 ND");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(76, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Conditional_76_Template, 4, 0, "button", 55);
    i0.ɵɵelementStart(77, "button", 56);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template_button_click_77_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyActiveSampleToAll()); });
    i0.ɵɵelement(78, "i", 57);
    i0.ɵɵelementStart(79, "span");
    i0.ɵɵtext(80, "Sao Ch\u00E9p M\u1EABu cho C\u1EA3 M\u1EBB");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(81, "div", 58)(82, "table", 59)(83, "thead")(84, "tr", 60)(85, "th", 61);
    i0.ɵɵtext(86, "STT");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(87, "th", 62);
    i0.ɵɵtext(88, "Ho\u1EA1t ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(89, "th", 63);
    i0.ɵɵtext(90, "KPH / ND");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(91, "th", 64);
    i0.ɵɵtext(92, "K\u1EBFt qu\u1EA3 (\u00B5g/L)");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(93, "tbody", 65);
    i0.ɵɵrepeaterCreate(94, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_For_95_Template, 10, 8, "tr", 66, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", "Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: " + ((ctx_r1.run == null ? null : ctx_r1.run.sopCode) || "TBVTV Trong N\u01B0\u1EDBc") + ")")("draft", ctx_r1.draft)("checkboxList", ctx_r1.checkboxList);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("checked", ctx_r1.draft.page1Data["is10gChecked"] !== false);
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["khoiLuongKhac"]);
    i0.ɵɵproperty("disabled", ctx_r1.draft.page1Data["is10gChecked"] !== false);
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r1.draft.page1Data["loaiMau"] === "Sinh ho\u1EA1t" ? "px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95" : "px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.draft.page1Data["loaiMau"] === "U\u1ED1ng" ? "px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95" : "px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.draft.page1Data["loaiMau"] === "S\u1EA3n xu\u1EA5t" ? "px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95" : "px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.draft.page1Data["loaiMau"] === "Nu\u00F4i tr\u1ED3ng" ? "px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95" : "px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", i0.ɵɵpureFunction0(30, _c0).includes(ctx_r1.draft.page1Data["loaiMau"]) ? "" : ctx_r1.draft.page1Data["loaiMau"]);
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r1.draft.page1Data["tinhTrangMau"] === "B\u00ECnh th\u01B0\u1EDDng" ? "px-3 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95" : "px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r1.draft.page1Data["tinhTrangMau"] === "B\u00ECnh th\u01B0\u1EDDng" ? "" : ctx_r1.draft.page1Data["tinhTrangMau"]);
    i0.ɵɵadvance(6);
    i0.ɵɵclassProp("fa-check-double", !ctx_r1.isAllSamplesSelected())("fa-minus", ctx_r1.isAllSamplesSelected());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.isAllSamplesSelected() ? "B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3" : "Ch\u1ECDn t\u1EA5t c\u1EA3");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.run.sampleList);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.draft.page1Data["checkGopInChung"]);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("T\u1EF1 \u0111\u1ED9ng (", ctx_r1.getSelectedSampleCount() > 1 ? "B\u1EADt v\u00EC ch\u1ECDn > 1 m\u1EABu" : "T\u1EAFt v\u00EC ch\u1ECDn 1 m\u1EABu", ")");
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.activeSampleCode());
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[ctx_r1.activeSampleCode()]["khoiLuong"]);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" T\u1ED5ng c\u1ED9ng ", (ctx_r1.config.compounds == null ? null : ctx_r1.config.compounds.length) || 0, " ho\u1EA1t ch\u1EA5t c\u1EA7n ki\u1EC3m nghi\u1EC7m. ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r1.searchQuery());
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(ctx_r1.draft.page1Data["printFormType"] === "formDon" ? 76 : -1);
    i0.ɵɵadvance(18);
    i0.ɵɵrepeater(ctx_r1.filteredCompounds());
} }
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 107);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const c_r11 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("value", c_r11);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.compoundDisplayNames()[c_r11] || c_r11);
} }
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 122)(1, "td", 123);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 124)(4, "input", 125);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_4_listener($event) { const row_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r13.key]["selected"], $event) || (ctx_r1.draft.resultData[row_r13.key]["selected"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_4_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "td", 126)(8, "input", 127);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_8_listener($event) { const row_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r13.key]["khoiLuong"], $event) || (ctx_r1.draft.resultData[row_r13.key]["khoiLuong"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_8_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_focus_8_listener($event) { i0.ɵɵrestoreView(_r12); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td", 126)(10, "input", 127);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_10_listener($event) { const row_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r13.key]["heSoPhaLoang"], $event) || (ctx_r1.draft.resultData[row_r13.key]["heSoPhaLoang"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_10_listener() { const row_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.syncDilution(row_r13.key)); })("focus", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_focus_10_listener($event) { i0.ɵɵrestoreView(_r12); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "td", 126)(12, "input", 128);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_12_listener($event) { const row_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r13.key]["loSo"], $event) || (ctx_r1.draft.resultData[row_r13.key]["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_12_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_focus_12_listener($event) { i0.ɵɵrestoreView(_r12); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "td", 126)(14, "input", 129);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_14_listener($event) { const row_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r13.key][ctx_r1.draft.page1Data["activeCompound"]], $event) || (ctx_r1.draft.resultData[row_r13.key][ctx_r1.draft.page1Data["activeCompound"]] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_14_listener() { const row_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onChromResultChanged(row_r13.key)); })("focus", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_focus_14_listener($event) { i0.ɵɵrestoreView(_r12); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "td", 126)(16, "input", 130);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_16_listener($event) { const row_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r13.key][ctx_r1.draft.page1Data["activeCompound"] + "_ghiChu"], $event) || (ctx_r1.draft.resultData[row_r13.key][ctx_r1.draft.page1Data["activeCompound"] + "_ghiChu"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_ngModelChange_16_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template_input_focus_16_listener($event) { i0.ɵɵrestoreView(_r12); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const row_r13 = ctx.$implicit;
    const ɵ$index_377_r14 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("opacity-60", ctx_r1.draft.resultData[row_r13.key]["selected"] === false);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(15, _c2, row_r13.type === "QC"));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ɵ$index_377_r14 + 1);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r13.key]["selected"]);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r13.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r13.key]["khoiLuong"]);
    i0.ɵɵproperty("disabled", row_r13.key === "QC_FINAL");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r13.key]["heSoPhaLoang"]);
    i0.ɵɵproperty("disabled", row_r13.key === "QC_FINAL");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r13.key]["loSo"]);
    i0.ɵɵproperty("disabled", row_r13.key === "QC_FINAL");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", row_r13.type === "REGULAR" && !ctx_r1.isTargetAssigned(row_r13.key, ctx_r1.draft.page1Data["activeCompound"]));
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r13.key][ctx_r1.draft.page1Data["activeCompound"]]);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r13.key][ctx_r1.draft.page1Data["activeCompound"] + "_ghiChu"]);
} }
function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6)(1, "app-sop-header-metadata", 7);
    i0.ɵɵlistener("draftChanged", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_app_sop_header_metadata_draftChanged_1_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 82)(3, "div", 83)(4, "h4", 40);
    i0.ɵɵelement(5, "i", 84);
    i0.ɵɵtext(6, " Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n & QC S\u1EAFc K\u00FD ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 85)(8, "span", 86);
    i0.ɵɵtext(9, "Vial chu\u1EA9n:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "input", 87);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_10_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.bulkCalibVialStart, $event) || (ctx_r1.bulkCalibVialStart = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_10_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onBulkCalibVialStartChange()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span", 88);
    i0.ɵɵtext(12, "-");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "input", 89);
    i0.ɵɵelementStart(14, "button", 90);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.applyCalibVials()); });
    i0.ɵɵelement(15, "i", 91);
    i0.ɵɵelementStart(16, "span");
    i0.ɵɵtext(17, "\u00C1p D\u1EE5ng");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(18, "div", 92)(19, "div", 93)(20, "div")(21, "label", 9);
    i0.ɵɵtext(22, "T\u00EAn m\u1EABu tr\u1EAFng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "input", 94);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_23_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["blankName"], $event) || (ctx_r1.draft.page1Data["blankName"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_23_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_focus_23_listener($event) { i0.ɵɵrestoreView(_r10); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div")(25, "label", 9);
    i0.ɵɵtext(26, "T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "input", 95);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_27_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["spikeName"], $event) || (ctx_r1.draft.page1Data["spikeName"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_27_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_focus_27_listener($event) { i0.ɵɵrestoreView(_r10); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(28, "div")(29, "label", 9);
    i0.ɵɵtext(30, "H\u1EC7 s\u1ED1 x\u00E1c \u0111\u1ECBnh R\u00B2");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "input", 96);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_31_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["r2ByCompound"][ctx_r1.draft.page1Data["activeCompound"]], $event) || (ctx_r1.draft.page1Data["r2ByCompound"][ctx_r1.draft.page1Data["activeCompound"]] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_31_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_focus_31_listener($event) { i0.ɵɵrestoreView(_r10); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "div")(33, "label", 9);
    i0.ɵɵtext(34, "M\u1EABu QC cu\u1ED1i m\u1EBB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "label", 97)(36, "input", 98);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_36_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["hasFinal"], $event) || (ctx_r1.draft.page1Data["hasFinal"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_36_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onFinalToggled()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "span", 99);
    i0.ɵɵtext(38, "Th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(39, "div", 100)(40, "app-sop-calibration-points", 101);
    i0.ɵɵlistener("pointsChanged", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_app_sop_calibration_points_pointsChanged_40_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onBulkCalibPointsChanged()); });
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(41, "div", 82)(42, "div", 102)(43, "h4", 40);
    i0.ɵɵelement(44, "i", 103);
    i0.ɵɵtext(45, " B\u1EA3ng Th\u00F4ng S\u1ED1 Ch\u1EA1y M\u1EABu & K\u1EBFt Qu\u1EA3 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "div", 104)(47, "label", 105);
    i0.ɵɵtext(48, "Ho\u1EA1t ch\u1EA5t:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "select", 106);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_select_ngModelChange_49_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["activeCompound"], $event) || (ctx_r1.draft.page1Data["activeCompound"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_select_ngModelChange_49_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onActiveCompoundChanged()); });
    i0.ɵɵrepeaterCreate(50, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_51_Template, 2, 2, "option", 107, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "div", 85)(53, "span", 86);
    i0.ɵɵtext(54, "L\u1ECD s\u1ED1:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "input", 87);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_55_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.bulkVialStart, $event) || (ctx_r1.bulkVialStart = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_55_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onBulkVialStartChange()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "span", 108);
    i0.ɵɵtext(57, "-");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "input", 109);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_input_ngModelChange_58_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.bulkVialEnd, $event) || (ctx_r1.bulkVialEnd = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(59, "button", 90);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_button_click_59_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.applyBulkVials()); });
    i0.ɵɵelement(60, "i", 91);
    i0.ɵɵelementStart(61, "span");
    i0.ɵɵtext(62, "\u00C1p D\u1EE5ng");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(63, "button", 110);
    i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template_button_click_63_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.bulkFillNDFormDon()); });
    i0.ɵɵelement(64, "i", 111);
    i0.ɵɵelementStart(65, "span");
    i0.ɵɵtext(66, "\u0110i\u1EC1n ND");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(67, "div", 112)(68, "table", 113)(69, "thead")(70, "tr", 114)(71, "th", 115);
    i0.ɵɵtext(72, "STT");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(73, "th", 116);
    i0.ɵɵtext(74, "M\u00E3 s\u1ED1 m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(75, "th", 117);
    i0.ɵɵtext(76, "Th\u1EC3 t\u00EDch (ml)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(77, "th", 117);
    i0.ɵɵtext(78, "HS pha lo\u00E3ng F");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(79, "th", 118);
    i0.ɵɵtext(80, "S\u1ED1 l\u1ECD (Vial)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(81, "th", 117);
    i0.ɵɵtext(82, "K\u1EBFt qu\u1EA3 (\u00B5g/L)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(83, "th", 119);
    i0.ɵɵtext(84, "Ghi ch\u00FA");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(85, "tbody", 120);
    i0.ɵɵrepeaterCreate(86, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_For_87_Template, 17, 17, "tr", 121, _forTrack0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", "Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: " + ((ctx_r1.run == null ? null : ctx_r1.run.sopCode) || "TBVTV Trong N\u01B0\u1EDBc") + ")")("draft", ctx_r1.draft)("checkboxList", i0.ɵɵpureFunction0(16, _c1));
    i0.ɵɵadvance(9);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.bulkCalibVialStart);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r1.bulkCalibVialEnd);
    i0.ɵɵadvance(10);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["blankName"]);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["spikeName"]);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["r2ByCompound"][ctx_r1.draft.page1Data["activeCompound"]]);
    i0.ɵɵadvance(5);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["hasFinal"]);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("calibPoints", ctx_r1.draft.page1Data["calibPoints"])("pointLabels", i0.ɵɵpureFunction0(17, _c1))("isSuffixVisible", false)("isFuchsiaRing", false);
    i0.ɵɵadvance(9);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["activeCompound"]);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.assignedCompoundsForFormDon());
    i0.ɵɵadvance(5);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.bulkVialStart);
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.bulkVialEnd);
    i0.ɵɵadvance(28);
    i0.ɵɵrepeater(ctx_r1.getChromatographyRows());
} }
export class SopTbvtvTrongNuocGcmsmsEntryComponent extends AbstractSopEntry {
    constructor() {
        super(...arguments);
        // ── UI State đặc thù của SOP TBVTV Trong Nước ────────────────────────────
        this.activeTab = signal('compounds');
        this.searchQuery = signal('');
        this.filteredCompounds = computed(() => {
            const q = this.searchQuery().toLowerCase().trim();
            const compounds = this.config?.compounds || [];
            if (!q)
                return compounds;
            return compounds.filter((c) => {
                const displayName = (this.compoundDisplayNames()[c] || c).toLowerCase();
                return c.toLowerCase().includes(q) || displayName.includes(q);
            });
        });
    }
    // ── SOP-specific initialization ───────────────────────────────────────────
    onSopSpecificInit() {
        // TBVTV Trong Nước dùng 5 điểm chuẩn (C0–C4)
        this.initCalibrationPoints(5);
        this.initActiveCompound();
        // Khởi tạo R² mặc định nếu đang ở formDon
        if (this.draft.page1Data['printFormType'] === 'formDon' && !this.draft.page1Data['r2']) {
            this.draft.page1Data['r2'] = '0.999';
        }
        // Thiết lập thể tích mặc định là 100.0 ml cho mọi mẫu (thay cho 10.0g)
        if (!this.draft.page1Data['khoiLuong'] || this.draft.page1Data['khoiLuong'] === '10.0') {
            this.draft.page1Data['khoiLuong'] = '100.0';
        }
        // Khởi tạo trạng thái checkbox V = 100.0 ml mặc định là true (được chọn) nếu chưa có giá trị
        if (this.draft.page1Data['is10gChecked'] === undefined) {
            this.draft.page1Data['is10gChecked'] = true;
        }
        (this.run?.sampleList || []).forEach((sampleCode) => {
            const sRes = this.draft.resultData[sampleCode];
            if (sRes && (!sRes['khoiLuong'] || sRes['khoiLuong'] === '10.0')) {
                sRes['khoiLuong'] = '100.0';
            }
        });
        const spike = this.draft.resultData['QC_SPIKE'];
        if (spike && (!spike['khoiLuong'] || spike['khoiLuong'] === '10.0')) {
            spike['khoiLuong'] = '100.0';
        }
        const blank = this.draft.resultData['QC_BLANK'];
        if (blank && (!blank['khoiLuong'] || blank['khoiLuong'] === '10.0')) {
            blank['khoiLuong'] = '100.0';
        }
        // Thiết lập loại mẫu mặc định cho nước sinh hoạt
        if (!this.draft.page1Data['loaiMau'] || this.draft.page1Data['loaiMau'] === 'Thủy sản') {
            this.draft.page1Data['loaiMau'] = 'Nước sinh hoạt';
        }
    }
    // ── Override: volume default (100ml) instead of weight (10g) ─────────────
    on10gCheckChange(event) {
        this.draft.page1Data['is10gChecked'] = event.target.checked;
        if (this.draft.page1Data['is10gChecked']) {
            this.draft.page1Data['khoiLuongKhac'] = '';
            this.draft.page1Data['khoiLuong'] = '100.0';
        }
        else {
            this.draft.page1Data['khoiLuong'] = this.draft.page1Data['khoiLuongKhac'] || '';
        }
        this.onDataChanged();
    }
    onKhoiLuongKhacChange() {
        if (this.draft.page1Data['khoiLuongKhac']) {
            this.draft.page1Data['is10gChecked'] = false;
            this.draft.page1Data['khoiLuong'] = this.draft.page1Data['khoiLuongKhac'];
        }
        else {
            this.draft.page1Data['is10gChecked'] = true;
            this.draft.page1Data['khoiLuong'] = '100.0';
        }
        this.onDataChanged();
    }
    bulkRandomizeMasses() {
        (this.run?.sampleList || []).forEach((sampleCode) => {
            if (this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode]['khoiLuong'] = (100.0 + (Math.random() - 0.5) * 0.8).toFixed(1);
            }
        });
        if (this.draft.resultData['QC_SPIKE']) {
            this.draft.resultData['QC_SPIKE']['khoiLuong'] = (100.0 + (Math.random() - 0.5) * 0.8).toFixed(1);
        }
        this.onDataChanged();
    }
    // ── Override: switch tab khi chuyển form type ─────────────────────────────
    onSetPrintFormType(type) {
        if (type === 'formCheck') {
            this.activeTab.set('compounds');
        }
        else {
            this.activeTab.set('chromatography');
        }
    }
    static { this.ɵfac = /*@__PURE__*/ (() => { let ɵSopTbvtvTrongNuocGcmsmsEntryComponent_BaseFactory; return function SopTbvtvTrongNuocGcmsmsEntryComponent_Factory(__ngFactoryType__) { return (ɵSopTbvtvTrongNuocGcmsmsEntryComponent_BaseFactory || (ɵSopTbvtvTrongNuocGcmsmsEntryComponent_BaseFactory = i0.ɵɵgetInheritedFactory(SopTbvtvTrongNuocGcmsmsEntryComponent)))(__ngFactoryType__ || SopTbvtvTrongNuocGcmsmsEntryComponent); }; })(); }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SopTbvtvTrongNuocGcmsmsEntryComponent, selectors: [["app-sop-tbvtv-trong-nuoc-gcmsms-entry"]], features: [i0.ɵɵInheritDefinitionFeature], decls: 12, vars: 6, consts: [[1, "space-y-6", "animate-fade-in"], [1, "flex", "items-center", "justify-between", "gap-4", "p-4", "rounded-2xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/60", "dark:border-slate-800/80", "shadow-sm", "mb-4"], [1, "flex", "items-center", "gap-2"], [1, "text-xs", "font-black", "text-slate-700", "dark:text-slate-355", "uppercase", "tracking-wider"], [1, "inline-flex", "bg-slate-100", "dark:bg-slate-955", "p-1", "rounded-xl", "border", "border-slate-200", "dark:border-slate-800", "select-none", "items-center", "shadow-3xs"], ["type", "button", 3, "click"], [1, "space-y-6"], [3, "draftChanged", "title", "draft", "checkboxList"], ["sop-metadata-extra", "", 1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4", "border-t", "border-slate-100", "dark:border-slate-800", "pt-3", "mt-4"], [1, "block", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "mb-1.5", "uppercase", "tracking-widest"], [1, "flex", "items-center", "gap-1.5", "p-1", "bg-slate-100/80", "dark:bg-slate-900", "rounded-xl", "border", "border-slate-200/50", "dark:border-slate-800"], [1, "flex", "items-center", "gap-2", "px-2", "py-1.5", "cursor-pointer", "shrink-0"], ["type", "checkbox", 1, "w-4", "h-4", "text-indigo-600", "rounded", "border-slate-300", "focus:ring-indigo-500", 3, "change", "checked"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300"], ["type", "text", "placeholder", "Th\u1EC3 t\u00EDch kh\u00E1c...", 1, "w-full", "bg-white", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-lg", "px-3", "py-1.5", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-indigo-500/10", "focus:border-indigo-500", "transition", "outline-none", "disabled:opacity-50", "disabled:bg-slate-50", 3, "ngModelChange", "ngModel", "disabled"], [1, "flex", "items-center", "gap-1.5", "overflow-x-auto", "py-0.5", "max-w-full", "custom-scrollbar"], ["type", "button", "title", "Ch\u1ECDn Sinh ho\u1EA1t", 3, "click"], ["type", "button", "title", "Ch\u1ECDn U\u1ED1ng", 3, "click"], ["type", "button", "title", "Ch\u1ECDn S\u1EA3n xu\u1EA5t", 3, "click"], ["type", "button", "title", "Ch\u1ECDn Nu\u00F4i tr\u1ED3ng", 3, "click"], ["type", "text", "placeholder", "Kh\u00E1c...", 1, "w-full", "min-w-[70px]", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-3", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-violet-500/10", "focus:border-violet-500", "transition", "outline-none", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-1.5"], ["type", "button", "title", "Ch\u1ECDn B\u00ECnh th\u01B0\u1EDDng", 3, "click"], ["type", "text", "placeholder", "Kh\u00E1c...", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-3", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-violet-500/10", "focus:border-violet-500", "transition", "outline-none", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "p-4", "rounded-2xl", "bg-slate-50/50", "dark:bg-slate-900/40", "border", "border-slate-200/60", "dark:border-slate-800/80", "shadow-2xs"], [1, "flex", "flex-wrap", "items-center", "gap-3", "overflow-x-auto", "custom-scrollbar", "flex-1", "min-w-0"], [1, "text-[10px]", "font-black", "text-indigo-700", "dark:text-indigo-400", "uppercase", "tracking-widest", "mr-1", "shrink-0"], ["type", "button", 1, "px-3", "py-2", "bg-slate-100", "dark:bg-slate-800", "hover:bg-slate-200", "dark:hover:bg-slate-700", "text-slate-700", "dark:text-slate-300", "rounded-xl", "text-[10px]", "font-extrabold", "transition", "shrink-0", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid"], [1, "ml-1.5"], [1, "flex", "items-center", "gap-1.5", "p-1", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800/80", "rounded-xl", "shadow-2xs", "hover:border-slate-350", "dark:hover:border-slate-700", "transition", "shrink-0"], [1, "flex", "items-center", "gap-3", "pl-4", "md:border-l", "border-slate-200", "dark:border-slate-800", "shrink-0"], ["title", "T\u1EF1 \u0111\u1ED9ng t\u00EDnh to\u00E1n d\u1EF1a tr\u00EAn s\u1ED1 l\u01B0\u1EE3ng m\u1EABu \u0111\u01B0\u1EE3c ch\u1ECDn in", 1, "flex", "items-center", "gap-2.5", "p-2", "px-3.5", "rounded-xl", "border", "border-slate-200", "dark:border-slate-800/80", "cursor-not-allowed", "select-none", "transition", "bg-slate-50", "dark:bg-slate-900/50", "shadow-2xs", "opacity-80"], ["type", "checkbox", "disabled", "", 1, "w-4", "h-4", "rounded", "text-violet-650", "border-slate-300", "dark:border-slate-700", "focus:ring-violet-500", "disabled:opacity-70", "disabled:cursor-not-allowed", 3, "ngModel"], [1, "flex", "flex-col"], [1, "text-xs", "font-black", "text-violet-750", "dark:text-violet-400", "tracking-wide"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "font-bold", "block", "mt-0.5"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4", "animate-fade-in"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-3.5"], [1, "flex-1", "min-w-[200px]"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-flask-vial", "mr-2", "text-violet-500", "text-sm"], [1, "font-mono", "text-violet-600", "dark:text-violet-400", "font-extrabold", "ml-1", "bg-violet-50", "dark:bg-violet-950/30", "px-2", "py-0.5", "rounded-lg", "border", "border-violet-100", "dark:border-violet-900/30"], [1, "ml-4", "flex", "items-center", "bg-white", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "overflow-hidden", "shadow-2xs", "normal-case"], [1, "bg-slate-50", "dark:bg-slate-900", "px-2", "py-1", "text-[10px]", "font-bold", "text-slate-500", "border-r", "border-slate-200", "dark:border-slate-800"], ["type", "text", 1, "w-14", "px-1", "py-1", "text-xs", "font-black", "text-indigo-650", "dark:text-indigo-400", "bg-transparent", "outline-none", "text-center", "focus:bg-indigo-50/50", 3, "ngModelChange", "ngModel"], [1, "pr-2", "pl-1", "text-[10px]", "font-bold", "text-slate-400", "border-l", "border-slate-100", "dark:border-slate-800"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-bold", "mt-1", "tracking-wide"], [1, "w-full", "md:w-64", "relative"], ["type", "text", "placeholder", "T\u00ECm ho\u1EA1t ch\u1EA5t...", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "pl-9", "pr-4", "py-2", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:ring-2", "focus:ring-violet-500/15", "focus:border-violet-500", "transition", "outline-none", 3, "ngModelChange", "ngModel"], [1, "fa-solid", "fa-magnifying-glass", "absolute", "left-3", "top-2.5", "text-slate-400", "text-xs"], [1, "flex", "flex-wrap", "items-center", "gap-2.5"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mr-1"], ["type", "button", 1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-amber-50", "dark:hover:bg-amber-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-amber-200", "dark:hover:border-amber-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-pen-nib", "text-amber-500"], ["type", "button", 1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-sky-50", "dark:hover:bg-sky-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-sky-600", "dark:hover:text-sky-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-sky-200", "dark:hover:border-sky-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs"], ["type", "button", "title", "Sao ch\u00E9p to\u00E0n b\u1ED9 k\u1EBFt qu\u1EA3 c\u1EE7a m\u1EABu \u0111ang hi\u1EC3n th\u1ECB cho t\u1EA5t c\u1EA3 c\u00E1c m\u1EABu kh\u00E1c trong m\u1EBB ch\u1EA1y n\u00E0y", 1, "px-3.5", "py-2", "bg-gradient-to-r", "from-violet-600", "to-indigo-600", "hover:from-violet-700", "hover:to-indigo-700", "text-white", "rounded-xl", "text-xs", "font-black", "shadow-sm", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-copy"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "max-h-[550px]", "overflow-y-auto"], [1, "w-full", "text-sm", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-955", "border-b", "border-slate-255/80", "dark:border-slate-800", "sticky", "top-0", "z-20", "shadow-2xs"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-16"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[150px]"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-28"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[130px]"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800/80"], [3, "class"], ["type", "checkbox", "title", "Bao g\u1ED3m m\u1EABu n\u00E0y trong b\u00E1o c\u00E1o in PDF", 1, "ml-1.5", "w-4", "h-4", "rounded", "text-violet-650", "border-slate-300", "dark:border-slate-700", "focus:ring-violet-500", "cursor-pointer", 3, "ngModelChange", "ngModel"], [1, "px-3", "py-2", "rounded-lg", "text-xs", "flex", "items-center", "gap-2", 3, "click"], [1, "font-mono", "font-bold"], ["title", "\u0110\u00E3 c\u00F3 b\u00E1o c\u00E1o PDF", 1, "fa-solid", "fa-circle-check", "text-emerald-500", "text-[10px]", "ml-1"], ["type", "button", 1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-sky-50", "dark:hover:bg-sky-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-sky-600", "dark:hover:text-sky-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-sky-200", "dark:hover:border-sky-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-dice", "text-sky-500"], [1, "py-2.5", "px-4", "font-mono", "text-xs", "text-slate-400", "font-bold", "text-center"], [1, "py-2.5", "px-4", "font-extrabold", "text-xs", "flex", "items-center"], [1, "text-slate-700", "dark:text-slate-200"], [1, "py-2.5", "px-4", "text-center"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-violet-650", "border-slate-355", "dark:border-slate-700", "focus:ring-violet-500", "dark:bg-slate-900", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "ngModelChange", "disabled", "ngModel"], [1, "py-1.5", "px-2"], ["type", "text", "placeholder", "ND / S\u1ED1 l\u01B0\u1EE3ng...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "font-extrabold", "focus:ring-2", "focus:ring-violet-500/20", "focus:border-violet-500", "outline-none", "text-center", "shadow-inner", "disabled:bg-slate-100/50", "dark:disabled:bg-slate-900/30", "disabled:text-slate-400", "dark:disabled:text-slate-600", "disabled:border-slate-100", "dark:disabled:border-slate-850", "disabled:cursor-not-allowed", 3, "ngModelChange", "disabled", "ngModel"], ["title", "Kh\u00F4ng thu\u1ED9c ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m c\u1EE7a m\u1EABu n\u00E0y", 1, "fa-solid", "fa-lock", "text-[10px]", "text-slate-400/80", "dark:text-slate-600", "mr-1.5"], [1, "text-slate-400", "dark:text-slate-550", "line-through", "decoration-slate-250", "dark:decoration-slate-800/60"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-2.5"], [1, "fa-solid", "fa-chart-line", "mr-2", "text-violet-500", "text-sm"], [1, "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-850", "border", "border-slate-200/60", "dark:border-slate-800/80", "rounded-lg", "px-2.5", "py-1", "text-xs"], [1, "font-bold", "text-slate-550", "dark:text-slate-400"], ["type", "number", "placeholder", "B\u1EAFt \u0111\u1EA7u", 1, "w-14", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-violet-500", "outline-none", 3, "ngModelChange", "ngModel"], [1, "text-slate-400"], ["type", "number", "readonly", "", "placeholder", "K\u1EBFt th\u00FAc", 1, "w-14", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200/40", "dark:border-slate-700/40", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-455", "dark:text-slate-500", "font-bold", "outline-none", "cursor-not-allowed", 3, "ngModel"], [1, "px-2.5", "py-1", "bg-violet-650", "hover:bg-violet-750", "text-white", "rounded", "font-bold", "transition", "flex", "items-center", "gap-1", "active:scale-95", "shadow-sm", 3, "click"], [1, "fa-solid", "fa-check"], [1, "grid", "grid-cols-1", "lg:grid-cols-12", "gap-6"], [1, "lg:col-span-4", "space-y-4"], ["type", "text", "placeholder", "BLANK", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-violet-500/10", "focus:border-violet-500", "outline-none", "transition", 3, "ngModelChange", "focus", "ngModel"], ["type", "text", "placeholder", "SPIKE", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-violet-500/10", "focus:border-violet-500", "outline-none", "transition", 3, "ngModelChange", "focus", "ngModel"], ["type", "text", "placeholder", "0.999...", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-extrabold", "text-indigo-655", "dark:text-indigo-400", "focus:ring-2", "focus:ring-violet-500/10", "focus:border-violet-500", "outline-none", "transition", 3, "ngModelChange", "focus", "ngModel"], [1, "flex", "items-center", "gap-3", "p-3", "rounded-xl", "border", "border-slate-200/60", "dark:border-slate-800", "bg-slate-50/20", "dark:bg-slate-900/10", "cursor-pointer", "select-none", "transition", "hover:bg-slate-50", "dark:hover:bg-slate-855"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-violet-650", "border-slate-355", "dark:border-slate-700", "focus:ring-violet-500", "focus:ring-2", "dark:bg-slate-800", "dark:border-slate-700", 3, "ngModelChange", "ngModel"], [1, "text-xs", "font-bold", "text-slate-750", "dark:text-slate-250"], [1, "lg:col-span-8"], ["title", "C\u00E1c \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)", "pointPrefix", "Chu\u1EA9n C", 3, "pointsChanged", "calibPoints", "pointLabels", "isSuffixVisible", "isFuchsiaRing"], [1, "flex", "items-center", "justify-between", "border-b", "border-slate-100", "dark:border-slate-800", "pb-2.5"], [1, "fa-solid", "fa-table", "mr-2", "text-violet-500", "text-sm"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-2", "py-1", "text-xs", "font-bold", "text-violet-600", "dark:text-violet-400", "focus:ring-2", "focus:ring-violet-500/20", "focus:border-violet-500", "outline-none", "transition", "cursor-pointer", "max-w-[200px]", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "text-slate-450"], ["type", "number", "placeholder", "K\u1EBFt th\u00FAc", 1, "w-14", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-violet-500", "outline-none", 3, "ngModelChange", "ngModel"], ["title", "\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND", 1, "px-2", "py-1", "bg-slate-50", "dark:bg-slate-955", "hover:bg-amber-50", "dark:hover:bg-amber-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200/60", "dark:border-slate-800", "hover:border-amber-200", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-xs", 3, "click"], [1, "fa-solid", "fa-pen-clip"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl"], [1, "w-full", "text-xs", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-955", "border-b", "border-slate-200", "dark:border-slate-800"], [1, "py-2.5", "px-3", "text-center", "font-bold", "text-slate-500", "dark:text-slate-400", "w-12"], [1, "py-2.5", "px-3", "text-left", "font-bold", "text-slate-500", "dark:text-slate-400", "min-w-[120px]"], [1, "py-2.5", "px-3", "text-center", "font-bold", "text-slate-500", "dark:text-slate-400", "w-32"], [1, "py-2.5", "px-3", "text-center", "font-bold", "text-slate-500", "dark:text-slate-400", "w-28"], [1, "py-2.5", "px-3", "text-left", "font-bold", "text-slate-500", "dark:text-slate-400", "min-w-[140px]"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800"], [1, "hover:bg-slate-50/50", "dark:hover:bg-slate-800/10", 3, "opacity-60", "ngClass"], [1, "hover:bg-slate-50/50", "dark:hover:bg-slate-800/10", 3, "ngClass"], [1, "py-2", "px-3", "font-mono", "text-slate-400", "text-center", "font-bold"], [1, "py-2", "px-3", "font-bold", "text-slate-700", "dark:text-slate-200", "font-mono", "flex", "items-center", "gap-1.5"], ["type", "checkbox", 1, "w-3.5", "h-3.5", "rounded", "text-violet-650", "border-slate-355", "dark:border-slate-700", "focus:ring-violet-500", 3, "ngModelChange", "ngModel"], [1, "py-1", "px-1.5"], ["type", "text", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-2", "py-1", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-1", "focus:ring-violet-500", "outline-none", "transition", "disabled:opacity-75", "disabled:cursor-not-allowed", 3, "ngModelChange", "focus", "ngModel", "disabled"], ["type", "text", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-2", "py-1", "text-center", "font-mono", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-1", "focus:ring-violet-500", "outline-none", "transition", "disabled:opacity-75", "disabled:cursor-not-allowed", 3, "ngModelChange", "focus", "ngModel", "disabled"], ["type", "text", "placeholder", "ND/K\u1EBFt qu\u1EA3", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-2", "py-1", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-1", "focus:ring-violet-500", "outline-none", "transition", "disabled:bg-slate-100/50", "dark:disabled:bg-slate-900/30", "disabled:text-slate-400", "dark:disabled:text-slate-600", "disabled:border-slate-100", "dark:disabled:border-slate-850", "disabled:cursor-not-allowed", 3, "ngModelChange", "focus", "disabled", "ngModel"], ["type", "text", "placeholder", "Ghi ch\u00FA...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-2", "py-1", "text-left", "text-xs", "text-slate-800", "dark:text-slate-200", "focus:ring-1", "focus:ring-violet-500", "outline-none", "transition", 3, "ngModelChange", "focus", "ngModel"]], template: function SopTbvtvTrongNuocGcmsmsEntryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span", 3);
            i0.ɵɵtext(4, "H\u00ECnh th\u1EE9c in k\u1EBFt qu\u1EA3:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div", 4)(6, "button", 5);
            i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Template_button_click_6_listener() { return ctx.setPrintFormType("formCheck"); });
            i0.ɵɵtext(7, " FORM CHECK ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "button", 5);
            i0.ɵɵlistener("click", function SopTbvtvTrongNuocGcmsmsEntryComponent_Template_button_click_8_listener() { return ctx.setPrintFormType("formDon"); });
            i0.ɵɵtext(9, " FORM \u0110\u01A0N ");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(10, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_10_Template, 96, 31, "div", 6)(11, SopTbvtvTrongNuocGcmsmsEntryComponent_Conditional_11_Template, 88, 18, "div", 6);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵclassMap(ctx.draft.page1Data["printFormType"] === "formCheck" ? "px-3.5 py-2 text-xs font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95" : "px-3.5 py-2 text-xs font-bold rounded-lg text-slate-550 hover:text-slate-855 dark:hover:text-slate-250 transition duration-155");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.draft.page1Data["printFormType"] === "formDon" ? "px-3.5 py-2 text-xs font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95" : "px-3.5 py-2 text-xs font-bold rounded-lg text-slate-550 hover:text-slate-855 dark:hover:text-slate-250 transition duration-155");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.draft.page1Data["printFormType"] === "formCheck" ? 10 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.draft.page1Data["printFormType"] === "formDon" ? 11 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel, SopHeaderMetadataComponent, SopCalibrationPointsComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SopTbvtvTrongNuocGcmsmsEntryComponent, [{
        type: Component,
        args: [{ selector: 'app-sop-tbvtv-trong-nuoc-gcmsms-entry', standalone: true, imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent], template: "<div class=\"space-y-6 animate-fade-in\">\r\n\r\n  <!-- Form Selection Switcher -->\r\n  <div class=\"flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm mb-4\">\r\n    <div class=\"flex items-center gap-2\">\r\n      <span class=\"text-xs font-black text-slate-700 dark:text-slate-355 uppercase tracking-wider\">H\u00ECnh th\u1EE9c in k\u1EBFt qu\u1EA3:</span>\r\n      <div class=\"inline-flex bg-slate-100 dark:bg-slate-955 p-1 rounded-xl border border-slate-200 dark:border-slate-800 select-none items-center shadow-3xs\">\r\n        <button type=\"button\"\r\n          (click)=\"setPrintFormType('formCheck')\"\r\n                [class]=\"draft.page1Data['printFormType'] === 'formCheck'\r\n                  ? 'px-3.5 py-2 text-xs font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95' \r\n                  : 'px-3.5 py-2 text-xs font-bold rounded-lg text-slate-550 hover:text-slate-855 dark:hover:text-slate-250 transition duration-155'\">\r\n          FORM CHECK\r\n        </button>\r\n        <button type=\"button\"\r\n          (click)=\"setPrintFormType('formDon')\"\r\n                [class]=\"draft.page1Data['printFormType'] === 'formDon'\r\n                  ? 'px-3.5 py-2 text-xs font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95' \r\n                  : 'px-3.5 py-2 text-xs font-bold rounded-lg text-slate-550 hover:text-slate-855 dark:hover:text-slate-250 transition duration-155'\">\r\n          FORM \u0110\u01A0N\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- TAB 1: COMPOUND RESULTS GRID -->\r\n  @if (draft.page1Data['printFormType'] === 'formCheck') {\r\n    <div class=\"space-y-6\">\r\n      <!-- 1. Metadata Form & Checkboxes -->\r\n      <app-sop-header-metadata\r\n        [title]=\"'Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: ' + (run?.sopCode || 'TBVTV Trong N\u01B0\u1EDBc') + ')'\"\r\n        [draft]=\"draft\"\r\n        [checkboxList]=\"checkboxList\"\r\n        (draftChanged)=\"onDataChanged()\">\r\n        <!-- Additional Metadata Fields (Th\u1EC3 t\u00EDch m\u1EABu, Lo\u1EA1i m\u1EABu, T\u00ECnh tr\u1EA1ng m\u1EABu) -->\r\n        <div sop-metadata-extra class=\"grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3 mt-4\">\r\n          <!-- Th\u1EC3 t\u00EDch m\u1EABu -->\r\n          <div>\r\n            <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">2. Th\u1EC3 t\u00EDch m\u1EABu (ml)</label>\r\n            <div class=\"flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800\">\r\n              <label class=\"flex items-center gap-2 px-2 py-1.5 cursor-pointer shrink-0\">\r\n                <input type=\"checkbox\"\r\n                  [checked]=\"draft.page1Data['is10gChecked'] !== false\"\r\n                  (change)=\"on10gCheckChange($event)\"\r\n                  class=\"w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500\">\r\n                  <span class=\"text-xs font-bold text-slate-700 dark:text-slate-300\">100.0ml</span>\r\n                </label>\r\n                <input type=\"text\"\r\n                  [(ngModel)]=\"draft.page1Data['khoiLuongKhac']\"\r\n                  (ngModelChange)=\"onKhoiLuongKhacChange()\"\r\n                  placeholder=\"Th\u1EC3 t\u00EDch kh\u00E1c...\"\r\n                  [disabled]=\"draft.page1Data['is10gChecked'] !== false\"\r\n                  class=\"w-full bg-white dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none disabled:opacity-50 disabled:bg-slate-50\">\r\n                </div>\r\n              </div>\r\n              <!-- Lo\u1EA1i m\u1EABu -->\r\n              <div>\r\n                <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">3. Lo\u1EA1i m\u1EABu</label>\r\n                <div class=\"flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full custom-scrollbar\">\r\n                  <button type=\"button\"\r\n                    (click)=\"draft.page1Data['loaiMau'] = 'Sinh ho\u1EA1t'; onDataChanged()\"\r\n                    [class]=\"draft.page1Data['loaiMau'] === 'Sinh ho\u1EA1t'\r\n                      ? 'px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' \r\n                      : 'px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n                    title=\"Ch\u1ECDn Sinh ho\u1EA1t\">\r\n                    Sinh Ho\u1EA1t\r\n                  </button>\r\n                  <button type=\"button\"\r\n                    (click)=\"draft.page1Data['loaiMau'] = 'U\u1ED1ng'; onDataChanged()\"\r\n                    [class]=\"draft.page1Data['loaiMau'] === 'U\u1ED1ng'\r\n                      ? 'px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' \r\n                      : 'px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n                    title=\"Ch\u1ECDn U\u1ED1ng\">\r\n                    U\u1ED1ng\r\n                  </button>\r\n                  <button type=\"button\"\r\n                    (click)=\"draft.page1Data['loaiMau'] = 'S\u1EA3n xu\u1EA5t'; onDataChanged()\"\r\n                    [class]=\"draft.page1Data['loaiMau'] === 'S\u1EA3n xu\u1EA5t'\r\n                      ? 'px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' \r\n                      : 'px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n                    title=\"Ch\u1ECDn S\u1EA3n xu\u1EA5t\">\r\n                    S\u1EA3n Xu\u1EA5t\r\n                  </button>\r\n                  <button type=\"button\"\r\n                    (click)=\"draft.page1Data['loaiMau'] = 'Nu\u00F4i tr\u1ED3ng'; onDataChanged()\"\r\n                    [class]=\"draft.page1Data['loaiMau'] === 'Nu\u00F4i tr\u1ED3ng'\r\n                      ? 'px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' \r\n                      : 'px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n                    title=\"Ch\u1ECDn Nu\u00F4i tr\u1ED3ng\">\r\n                    Nu\u00F4i Tr\u1ED3ng\r\n                  </button>\r\n                  <input type=\"text\"\r\n                    [ngModel]=\"['N\u00F4ng s\u1EA3n t\u01B0\u01A1i', 'N\u00F4ng s\u1EA3n kh\u00F4', 'Th\u1EE7y s\u1EA3n', 'Thu\u1EF7 s\u1EA3n'].includes(draft.page1Data['loaiMau']) ? '' : draft.page1Data['loaiMau']\"\r\n                    (ngModelChange)=\"draft.page1Data['loaiMau'] = $event; onDataChanged()\"\r\n                    placeholder=\"Kh\u00E1c...\"\r\n                    class=\"w-full min-w-[70px] bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none\">\r\n                  </div>\r\n                </div>\r\n                <!-- T\u00ECnh tr\u1EA1ng m\u1EABu -->\r\n                <div>\r\n                  <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">4. T\u00ECnh tr\u1EA1ng m\u1EABu</label>\r\n                  <div class=\"flex items-center gap-1.5\">\r\n                    <button type=\"button\"\r\n                      (click)=\"draft.page1Data['tinhTrangMau'] = 'B\u00ECnh th\u01B0\u1EDDng'; onDataChanged()\"\r\n                    [class]=\"draft.page1Data['tinhTrangMau'] === 'B\u00ECnh th\u01B0\u1EDDng'\r\n                      ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' \r\n                      : 'px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n                      title=\"Ch\u1ECDn B\u00ECnh th\u01B0\u1EDDng\">\r\n                      B\u00ECnh Th\u01B0\u1EDDng\r\n                    </button>\r\n                    <input type=\"text\"\r\n                      [ngModel]=\"draft.page1Data['tinhTrangMau'] === 'B\u00ECnh th\u01B0\u1EDDng' ? '' : draft.page1Data['tinhTrangMau']\"\r\n                      (ngModelChange)=\"draft.page1Data['tinhTrangMau'] = $event; onDataChanged()\"\r\n                      placeholder=\"Kh\u00E1c...\"\r\n                      class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none\">\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </app-sop-header-metadata>\r\n              <!-- 2. Sample Navigation Tabs & Print Configuration -->\r\n              <div class=\"flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 shadow-2xs\">\r\n                <div class=\"flex flex-wrap items-center gap-3 overflow-x-auto custom-scrollbar flex-1 min-w-0\">\r\n                  <span class=\"text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mr-1 shrink-0\">Danh s\u00E1ch m\u1EABu:</span>\r\n                  <!-- Select All / None Toggle Button -->\r\n                  <button (click)=\"toggleSelectAllSamples()\"\r\n                    type=\"button\"\r\n                    class=\"px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-extrabold transition shrink-0 active:scale-95 shadow-2xs\">\r\n                    <i class=\"fa-solid\" [class.fa-check-double]=\"!isAllSamplesSelected()\" [class.fa-minus]=\"isAllSamplesSelected()\"></i>\r\n                    <span class=\"ml-1.5\">{{ isAllSamplesSelected() ? 'B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3' : 'Ch\u1ECDn t\u1EA5t c\u1EA3' }}</span>\r\n                  </button>\r\n                  @for (sampleCode of run.sampleList; track sampleCode; let idx = $index) {\r\n                    <div class=\"flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-2xs hover:border-slate-350 dark:hover:border-slate-700 transition shrink-0\">\r\n                      <!-- Checkbox to toggle inclusion in PDF -->\r\n                      <input type=\"checkbox\"\r\n                        [ngModel]=\"draft.resultData[sampleCode]['selected'] !== false\"\r\n                        (ngModelChange)=\"toggleSampleSelected(sampleCode, $event)\"\r\n                        title=\"Bao g\u1ED3m m\u1EABu n\u00E0y trong b\u00E1o c\u00E1o in PDF\"\r\n                        class=\"ml-1.5 w-4 h-4 rounded text-violet-650 border-slate-300 dark:border-slate-700 focus:ring-violet-500 cursor-pointer\">\r\n                        <button (click)=\"selectSample(sampleCode)\"\r\n                    [class]=\"activeSampleCode() === sampleCode \r\n                      ? 'bg-violet-600 text-white font-extrabold shadow-sm border border-violet-655 transition shrink-0 active:scale-95' \r\n                      : 'bg-transparent text-slate-655 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800 border-0 transition shrink-0 active:scale-95'\"\r\n                          class=\"px-3 py-2 rounded-lg text-xs flex items-center gap-2\"\r\n                          [class.opacity-50]=\"draft.resultData[sampleCode]['selected'] === false\">\r\n              <span [class]=\"activeSampleCode() === sampleCode\r\n                      ? 'w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white'\r\n                      : 'w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80'\">\r\n                            {{ idx + 1 }}\r\n                          </span>\r\n                          <span class=\"font-mono font-bold\">{{ sampleCode }}</span>\r\n                          @if (publishedSampleSet && publishedSampleSet.has(sampleCode)) {\r\n                            <i class=\"fa-solid fa-circle-check text-emerald-500 text-[10px] ml-1\" title=\"\u0110\u00E3 c\u00F3 b\u00E1o c\u00E1o PDF\"></i>\r\n                          }\r\n                        </button>\r\n                      </div>\r\n                    }\r\n                  </div>\r\n                  <!-- Unified Print Configuration Toggle -->\r\n                  <div class=\"flex items-center gap-3 pl-4 md:border-l border-slate-200 dark:border-slate-800 shrink-0\">\r\n                    <label class=\"flex items-center gap-2.5 p-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 cursor-not-allowed select-none transition bg-slate-50 dark:bg-slate-900/50 shadow-2xs opacity-80\"\r\n                      title=\"T\u1EF1 \u0111\u1ED9ng t\u00EDnh to\u00E1n d\u1EF1a tr\u00EAn s\u1ED1 l\u01B0\u1EE3ng m\u1EABu \u0111\u01B0\u1EE3c ch\u1ECDn in\">\r\n                      <input type=\"checkbox\"\r\n                        [ngModel]=\"draft.page1Data['checkGopInChung']\"\r\n                        disabled\r\n                        class=\"w-4 h-4 rounded text-violet-650 border-slate-300 dark:border-slate-700 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed\">\r\n                        <div class=\"flex flex-col\">\r\n                          <span class=\"text-xs font-black text-violet-750 dark:text-violet-400 tracking-wide\">G\u1ED9p in chung c\u00E1c m\u1EABu</span>\r\n                          <span class=\"text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5\">T\u1EF1 \u0111\u1ED9ng ({{ (getSelectedSampleCount() > 1) ? 'B\u1EADt v\u00EC ch\u1ECDn > 1 m\u1EABu' : 'T\u1EAFt v\u00EC ch\u1ECDn 1 m\u1EABu' }})</span>\r\n                        </div>\r\n                      </label>\r\n                    </div>\r\n                  </div>\r\n                  <!-- 3. Compound Checklist & QCs -->\r\n                  <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in\">\r\n                    <!-- Panel Header -->\r\n                    <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5\">\r\n                      <div class=\"flex-1 min-w-[200px]\">\r\n                        <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center\">\r\n                          <i class=\"fa-solid fa-flask-vial mr-2 text-violet-500 text-sm\"></i>\r\n                          B\u1EA3ng K\u1EBFt Qu\u1EA3 M\u1EABu: <span class=\"font-mono text-violet-600 dark:text-violet-400 font-extrabold ml-1 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded-lg border border-violet-100 dark:border-violet-900/30\">{{ activeSampleCode() }}</span>\r\n                          <!-- Per-sample Volume Input -->\r\n                          <div class=\"ml-4 flex items-center bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs normal-case\">\r\n                            <span class=\"bg-slate-50 dark:bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800\">V =</span>\r\n                            <input type=\"text\"\r\n                              [(ngModel)]=\"draft.resultData[activeSampleCode()]['khoiLuong']\"\r\n                              (ngModelChange)=\"onDataChanged()\"\r\n                              class=\"w-14 px-1 py-1 text-xs font-black text-indigo-650 dark:text-indigo-400 bg-transparent outline-none text-center focus:bg-indigo-50/50\">\r\n                              <span class=\"pr-2 pl-1 text-[10px] font-bold text-slate-400 border-l border-slate-100 dark:border-slate-800\">Ml</span>\r\n                            </div>\r\n                          </h4>\r\n                          <p class=\"text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 tracking-wide\">\r\n                            T\u1ED5ng c\u1ED9ng {{ config.compounds?.length || 0 }} ho\u1EA1t ch\u1EA5t c\u1EA7n ki\u1EC3m nghi\u1EC7m.\r\n                          </p>\r\n                        </div>\r\n                        <!-- Search box -->\r\n                        <div class=\"w-full md:w-64 relative\">\r\n                          <input type=\"text\"\r\n                            [ngModel]=\"searchQuery()\"\r\n                            (ngModelChange)=\"searchQuery.set($event)\"\r\n                            placeholder=\"T\u00ECm ho\u1EA1t ch\u1EA5t...\"\r\n                            class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/15 focus:border-violet-500 transition outline-none\">\r\n                            <i class=\"fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs\"></i>\r\n                          </div>\r\n                          <!-- Bulk Actions for the Selected Sample -->\r\n                          <div class=\"flex flex-wrap items-center gap-2.5\">\r\n                            <span class=\"text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1\">M\u1EABu n\u00E0y:</span>\r\n                            <button (click)=\"sampleBulkFillND()\"\r\n                              type=\"button\"\r\n                              class=\"px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\">\r\n                              <i class=\"fa-solid fa-pen-nib text-amber-500\"></i>\r\n                              <span>\u0110\u1EB7t T\u1EA5t C\u1EA3 ND</span>\r\n                            </button>\r\n                            @if (draft.page1Data['printFormType'] === 'formDon') {\r\n                              <button\r\n                                (click)=\"bulkRandomizeMasses()\"\r\n                                type=\"button\"\r\n                                class=\"px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-sky-50 dark:hover:bg-sky-955/20 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\">\r\n                                <i class=\"fa-solid fa-dice text-sky-500\"></i>\r\n                                <span>Sinh TT Ng\u1EABu Nhi\u00EAn (T\u1EA5t C\u1EA3)</span>\r\n                              </button>\r\n                            }\r\n                            <button (click)=\"copyActiveSampleToAll()\"\r\n                              type=\"button\"\r\n                              class=\"px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 active:scale-95\"\r\n                              title=\"Sao ch\u00E9p to\u00E0n b\u1ED9 k\u1EBFt qu\u1EA3 c\u1EE7a m\u1EABu \u0111ang hi\u1EC3n th\u1ECB cho t\u1EA5t c\u1EA3 c\u00E1c m\u1EABu kh\u00E1c trong m\u1EBB ch\u1EA1y n\u00E0y\">\r\n                              <i class=\"fa-solid fa-copy\"></i>\r\n                              <span>Sao Ch\u00E9p M\u1EABu cho C\u1EA3 M\u1EBB</span>\r\n                            </button>\r\n                          </div>\r\n                        </div>\r\n                        <!-- Compound List Table -->\r\n                        <div class=\"overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[550px] overflow-y-auto\">\r\n                          <table class=\"w-full text-sm border-collapse\">\r\n                            <thead>\r\n                              <tr class=\"bg-slate-50 dark:bg-slate-955 border-b border-slate-255/80 dark:border-slate-800 sticky top-0 z-20 shadow-2xs\">\r\n                                <th class=\"py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-16\">STT</th>\r\n                                <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[150px]\">Ho\u1EA1t ch\u1EA5t</th>\r\n                                <th class=\"py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-28\">KPH / ND</th>\r\n                                <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[130px]\">K\u1EBFt qu\u1EA3 (\u00B5g/L)</th>\r\n                              </tr>\r\n                            </thead>\r\n                            <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800/80\">\r\n                              @for (compound of filteredCompounds(); track compound; let idx = $index) {\r\n              <tr [class]=\"!isTargetAssigned(activeSampleCode(), compound)\r\n                    ? 'bg-slate-50/50 dark:bg-slate-950/20 text-slate-400/80 dark:text-slate-600 transition-all border-l-4 border-l-transparent duration-150'\r\n                    : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-violet-50/10 dark:focus-within:bg-violet-500/5 border-l-4 border-l-transparent focus-within:border-l-violet-500 duration-150'\">\r\n                                  <td class=\"py-2.5 px-4 font-mono text-xs text-slate-400 font-bold text-center\">{{ idx + 1 }}</td>\r\n                                  <td class=\"py-2.5 px-4 font-extrabold text-xs flex items-center\">\r\n                                    @if (!isTargetAssigned(activeSampleCode(), compound)) {\r\n                                      <i class=\"fa-solid fa-lock text-[10px] text-slate-400/80 dark:text-slate-600 mr-1.5\" title=\"Kh\u00F4ng thu\u1ED9c ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m c\u1EE7a m\u1EABu n\u00E0y\"></i>\r\n                                      <span class=\"text-slate-400 dark:text-slate-550 line-through decoration-slate-250 dark:decoration-slate-800/60\">{{ compoundDisplayNames()[compound] || compound }}</span>\r\n                                    } @else {\r\n                                      <span class=\"text-slate-700 dark:text-slate-200\">{{ compoundDisplayNames()[compound] || compound }}</span>\r\n                                    }\r\n                                  </td>\r\n                                  <!-- ND Checkbox -->\r\n                                  <td class=\"py-2.5 px-4 text-center\">\r\n                                    <input type=\"checkbox\"\r\n                                      [disabled]=\"!isTargetAssigned(activeSampleCode(), compound)\"\r\n                                      [(ngModel)]=\"draft.resultData[activeSampleCode()][compound + '_nd']\"\r\n                                      (ngModelChange)=\"onNdCheckboxChanged(compound)\"\r\n                                      class=\"w-4 h-4 rounded text-violet-650 border-slate-355 dark:border-slate-700 focus:ring-violet-500 dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed\">\r\n                                    </td>\r\n                                    <!-- Result Input -->\r\n                                    <td class=\"py-1.5 px-2\">\r\n                                      <input type=\"text\"\r\n                                        [disabled]=\"!isTargetAssigned(activeSampleCode(), compound)\"\r\n                                        [(ngModel)]=\"draft.resultData[activeSampleCode()][compound]\"\r\n                                        (ngModelChange)=\"onResultInputChanged(compound)\"\r\n                                        placeholder=\"ND / S\u1ED1 l\u01B0\u1EE3ng...\"\r\n                                        class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-center shadow-inner disabled:bg-slate-100/50 dark:disabled:bg-slate-900/30 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-slate-100 dark:disabled:border-slate-850 disabled:cursor-not-allowed\">\r\n                                      </td>\r\n                                    </tr>\r\n                                  }\r\n                                </tbody>\r\n                              </table>\r\n                            </div>\r\n                          </div>\r\n                        </div>\r\n                      }\r\n\r\n                      <!-- TAB 2: CALIBRATION CURVE & SAMPLE RUNS -->\r\n                      @if (draft.page1Data['printFormType'] === 'formDon') {\r\n                        <div class=\"space-y-6\">\r\n                          <!-- 0. Signature Dates & General Metadata -->\r\n                          <app-sop-header-metadata\r\n                            [title]=\"'Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: ' + (run?.sopCode || 'TBVTV Trong N\u01B0\u1EDBc') + ')'\"\r\n                            [draft]=\"draft\"\r\n                            [checkboxList]=\"[]\"\r\n                            (draftChanged)=\"onDataChanged()\">\r\n                          </app-sop-header-metadata>\r\n                          <!-- 1. Calibration Curve Parameters -->\r\n                          <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4\">\r\n                            <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2.5\">\r\n                              <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center\">\r\n                                <i class=\"fa-solid fa-chart-line mr-2 text-violet-500 text-sm\"></i>\r\n                                Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n & QC S\u1EAFc K\u00FD\r\n                              </h4>\r\n                              <!-- Quick Vial input for Calibration -->\r\n                              <div class=\"flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs\">\r\n                                <span class=\"font-bold text-slate-550 dark:text-slate-400\">Vial chu\u1EA9n:</span>\r\n                                <input type=\"number\"\r\n                                  [(ngModel)]=\"bulkCalibVialStart\"\r\n                                  (ngModelChange)=\"onBulkCalibVialStartChange()\"\r\n                                  placeholder=\"B\u1EAFt \u0111\u1EA7u\"\r\n                                  class=\"w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-violet-500 outline-none\">\r\n                                  <span class=\"text-slate-400\">-</span>\r\n                                  <input type=\"number\"\r\n                                    [ngModel]=\"bulkCalibVialEnd\"\r\n                                    readonly\r\n                                    placeholder=\"K\u1EBFt th\u00FAc\"\r\n                                    class=\"w-14 bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 rounded px-1.5 py-0.5 text-center text-slate-455 dark:text-slate-500 font-bold outline-none cursor-not-allowed\">\r\n                                    <button (click)=\"applyCalibVials()\"\r\n                                      class=\"px-2.5 py-1 bg-violet-650 hover:bg-violet-750 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm\">\r\n                                      <i class=\"fa-solid fa-check\"></i>\r\n                                      <span>\u00C1p D\u1EE5ng</span>\r\n                                    </button>\r\n                                  </div>\r\n                                </div>\r\n                                <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-6\">\r\n                                  <!-- Left Side: R^2, Blank Name, Spike Name, QC FINAL -->\r\n                                  <div class=\"lg:col-span-4 space-y-4\">\r\n                                    <div>\r\n                                      <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">T\u00EAn m\u1EABu tr\u1EAFng</label>\r\n                                      <input type=\"text\"\r\n                                        [(ngModel)]=\"draft.page1Data['blankName']\"\r\n                                        (ngModelChange)=\"onDataChanged()\"\r\n                                        (focus)=\"$any($event.target).select()\"\r\n                                        placeholder=\"BLANK\"\r\n                                        class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition\">\r\n                                      </div>\r\n                                      <div>\r\n                                        <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n</label>\r\n                                        <input type=\"text\"\r\n                                          [(ngModel)]=\"draft.page1Data['spikeName']\"\r\n                                          (ngModelChange)=\"onDataChanged()\"\r\n                                          (focus)=\"$any($event.target).select()\"\r\n                                          placeholder=\"SPIKE\"\r\n                                          class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition\">\r\n                                        </div>\r\n                                        <div>\r\n                                          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">H\u1EC7 s\u1ED1 x\u00E1c \u0111\u1ECBnh R\u00B2</label>\r\n                                          <input type=\"text\"\r\n                                            [(ngModel)]=\"draft.page1Data['r2ByCompound'][draft.page1Data['activeCompound']]\"\r\n                                            (ngModelChange)=\"onDataChanged()\"\r\n                                            (focus)=\"$any($event.target).select()\"\r\n                                            placeholder=\"0.999...\"\r\n                                            class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-extrabold text-indigo-655 dark:text-indigo-400 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition\">\r\n                                          </div>\r\n                                          <div>\r\n                                            <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">M\u1EABu QC cu\u1ED1i m\u1EBB</label>\r\n                                            <label class=\"flex items-center gap-3 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer select-none transition hover:bg-slate-50 dark:hover:bg-slate-855\">\r\n                                              <input type=\"checkbox\"\r\n                                                [(ngModel)]=\"draft.page1Data['hasFinal']\"\r\n                                                (ngModelChange)=\"onFinalToggled()\"\r\n                                                class=\"w-4 h-4 rounded text-violet-650 border-slate-355 dark:border-slate-700 focus:ring-violet-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700\">\r\n                                                <span class=\"text-xs font-bold text-slate-750 dark:text-slate-250\">Th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB</span>\r\n                                              </label>\r\n                                            </div>\r\n                                          </div>\r\n                                          <!-- Right Side: Calibration points (5 points C0-C4) -->\r\n                                          <div class=\"lg:col-span-8\">\r\n                                            <app-sop-calibration-points\r\n                                              title=\"C\u00E1c \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)\"\r\n                                              [calibPoints]=\"draft.page1Data['calibPoints']\"\r\n                                              [pointLabels]=\"[]\"\r\n                                              pointPrefix=\"Chu\u1EA9n C\"\r\n                                              [isSuffixVisible]=\"false\"\r\n                                              [isFuchsiaRing]=\"false\"\r\n                                              (pointsChanged)=\"onBulkCalibPointsChanged()\">\r\n                                            </app-sop-calibration-points>\r\n                                          </div>\r\n                                        </div>\r\n                                      </div>\r\n                                      <!-- 2. Sample Spreadsheet and Parameters -->\r\n                                      <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4\">\r\n                                        <div class=\"flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5\">\r\n                                          <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center\">\r\n                                            <i class=\"fa-solid fa-table mr-2 text-violet-500 text-sm\"></i>\r\n                                            B\u1EA3ng Th\u00F4ng S\u1ED1 Ch\u1EA1y M\u1EABu & K\u1EBFt Qu\u1EA3\r\n                                          </h4>\r\n                                          <div class=\"flex flex-wrap items-center gap-2\">\r\n                                            <label class=\"text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest\">Ho\u1EA1t ch\u1EA5t:</label>\r\n                                            <select [(ngModel)]=\"draft.page1Data['activeCompound']\"\r\n                                                    (ngModelChange)=\"onActiveCompoundChanged()\"\r\n                                              class=\"bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-xs font-bold text-violet-600 dark:text-violet-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition cursor-pointer max-w-[200px]\">\r\n                                              @for (c of assignedCompoundsForFormDon(); track c) {\r\n                                                <option [value]=\"c\">{{ compoundDisplayNames()[c] || c }}</option>\r\n                                              }\r\n                                            </select>\r\n                                            <!-- Quick Vial Input for samples -->\r\n                                            <div class=\"flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs\">\r\n                                              <span class=\"font-bold text-slate-550 dark:text-slate-400\">L\u1ECD s\u1ED1:</span>\r\n                                              <input type=\"number\"\r\n                                                [(ngModel)]=\"bulkVialStart\"\r\n                                                (ngModelChange)=\"onBulkVialStartChange()\"\r\n                                                placeholder=\"B\u1EAFt \u0111\u1EA7u\"\r\n                                                class=\"w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-violet-500 outline-none\">\r\n                                                <span class=\"text-slate-450\">-</span>\r\n                                                <input type=\"number\"\r\n                                                  [(ngModel)]=\"bulkVialEnd\"\r\n                                                  placeholder=\"K\u1EBFt th\u00FAc\"\r\n                                                  class=\"w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-violet-500 outline-none\">\r\n                                                  <button (click)=\"applyBulkVials()\"\r\n                                                    class=\"px-2.5 py-1 bg-violet-650 hover:bg-violet-750 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm\">\r\n                                                    <i class=\"fa-solid fa-check\"></i>\r\n                                                    <span>\u00C1p D\u1EE5ng</span>\r\n                                                  </button>\r\n                                                </div>\r\n                                                <button (click)=\"bulkFillNDFormDon()\"\r\n                                                  class=\"px-2 py-1 bg-slate-50 dark:bg-slate-955 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-slate-800 hover:border-amber-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs\"\r\n                                                  title=\"\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND\">\r\n                                                  <i class=\"fa-solid fa-pen-clip\"></i>\r\n                                                  <span>\u0110i\u1EC1n ND</span>\r\n                                                </button>\r\n                                              </div>\r\n                                            </div>\r\n                                            <!-- Spreadsheet Table -->\r\n                                            <div class=\"overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl\">\r\n                                              <table class=\"w-full text-xs border-collapse\">\r\n                                                <thead>\r\n                                                  <tr class=\"bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800\">\r\n                                                    <th class=\"py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-12\">STT</th>\r\n                                                    <th class=\"py-2.5 px-3 text-left font-bold text-slate-500 dark:text-slate-400 min-w-[120px]\">M\u00E3 s\u1ED1 m\u1EABu</th>\r\n                                                    <th class=\"py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-32\">Th\u1EC3 t\u00EDch (ml)</th>\r\n                                                    <th class=\"py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-32\">HS pha lo\u00E3ng F</th>\r\n                                                    <th class=\"py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-28\">S\u1ED1 l\u1ECD (Vial)</th>\r\n                                                    <th class=\"py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-32\">K\u1EBFt qu\u1EA3 (\u00B5g/L)</th>\r\n                                                    <th class=\"py-2.5 px-3 text-left font-bold text-slate-500 dark:text-slate-400 min-w-[140px]\">Ghi ch\u00FA</th>\r\n                                                  </tr>\r\n                                                </thead>\r\n                                                <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800\">\r\n                                                  @for (row of getChromatographyRows(); track row.key; let idx = $index) {\r\n                                                    <tr class=\"hover:bg-slate-50/50 dark:hover:bg-slate-800/10\"\r\n                                                      [class.opacity-60]=\"draft.resultData[row.key]['selected'] === false\"\r\n                  [ngClass]=\"{\r\n                    'bg-indigo-50/15 dark:bg-indigo-955/5 border-l-4 border-l-indigo-500/60': row.type === 'QC'\r\n                  }\">\r\n                                                      <td class=\"py-2 px-3 font-mono text-slate-400 text-center font-bold\">{{ idx + 1 }}</td>\r\n                                                      <td class=\"py-2 px-3 font-bold text-slate-700 dark:text-slate-200 font-mono flex items-center gap-1.5\">\r\n                                                        <input type=\"checkbox\"\r\n                                                          [(ngModel)]=\"draft.resultData[row.key]['selected']\"\r\n                                                          (ngModelChange)=\"onDataChanged()\"\r\n                                                          class=\"w-3.5 h-3.5 rounded text-violet-650 border-slate-355 dark:border-slate-700 focus:ring-violet-500\">\r\n                                                          <span>{{ row.label }}</span>\r\n                                                        </td>\r\n                                                        <!-- Volume (khoiLuong) -->\r\n                                                        <td class=\"py-1 px-1.5\">\r\n                                                          <input type=\"text\"\r\n                                                            [(ngModel)]=\"draft.resultData[row.key]['khoiLuong']\"\r\n                                                            (ngModelChange)=\"onDataChanged()\"\r\n                                                            [disabled]=\"row.key === 'QC_FINAL'\"\r\n                                                            (focus)=\"$any($event.target).select()\"\r\n                                                            class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition disabled:opacity-75 disabled:cursor-not-allowed\">\r\n                                                          </td>\r\n                                                          <!-- Dilution (heSoPhaLoang / hSoPhaLoang) -->\r\n                                                          <td class=\"py-1 px-1.5\">\r\n                                                            <input type=\"text\"\r\n                                                              [(ngModel)]=\"draft.resultData[row.key]['heSoPhaLoang']\"\r\n                                                              (ngModelChange)=\"syncDilution(row.key)\"\r\n                                                              [disabled]=\"row.key === 'QC_FINAL'\"\r\n                                                              (focus)=\"$any($event.target).select()\"\r\n                                                              class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition disabled:opacity-75 disabled:cursor-not-allowed\">\r\n                                                            </td>\r\n                                                            <!-- Vial Number (loSo) -->\r\n                                                            <td class=\"py-1 px-1.5\">\r\n                                                              <input type=\"text\"\r\n                                                                [(ngModel)]=\"draft.resultData[row.key]['loSo']\"\r\n                                                                (ngModelChange)=\"onDataChanged()\"\r\n                                                                [disabled]=\"row.key === 'QC_FINAL'\"\r\n                                                                (focus)=\"$any($event.target).select()\"\r\n                                                                class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-center font-mono font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition disabled:opacity-75 disabled:cursor-not-allowed\">\r\n                                                              </td>\r\n                                                              <!-- K\u1EBFt qu\u1EA3 (\u00B5g/L) -->\r\n                                                              <td class=\"py-1 px-1.5\">\r\n                                                                <input type=\"text\"\r\n                                                                  [disabled]=\"row.type === 'REGULAR' && !isTargetAssigned(row.key, draft.page1Data['activeCompound'])\"\r\n                                                                  [(ngModel)]=\"draft.resultData[row.key][draft.page1Data['activeCompound']]\"\r\n                                                                  (ngModelChange)=\"onChromResultChanged(row.key)\"\r\n                                                                  (focus)=\"$any($event.target).select()\"\r\n                                                                  placeholder=\"ND/K\u1EBFt qu\u1EA3\"\r\n                                                                  class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition disabled:bg-slate-100/50 dark:disabled:bg-slate-900/30 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-slate-100 dark:disabled:border-slate-850 disabled:cursor-not-allowed\">\r\n                                                                </td>\r\n                                                                <!-- Ghi ch\u00FA -->\r\n                                                                <td class=\"py-1 px-1.5\">\r\n                                                                  <input type=\"text\"\r\n                                                                    [(ngModel)]=\"draft.resultData[row.key][draft.page1Data['activeCompound'] + '_ghiChu']\"\r\n                                                                    (ngModelChange)=\"onDataChanged()\"\r\n                                                                    (focus)=\"$any($event.target).select()\"\r\n                                                                    placeholder=\"Ghi ch\u00FA...\"\r\n                                                                    class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-left text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition\">\r\n                                                                  </td>\r\n                                                                </tr>\r\n                                                              }\r\n                                                            </tbody>\r\n                                                          </table>\r\n                                                        </div>\r\n                                                      </div>\r\n                                                    </div>\r\n                                                  }\r\n                                                </div>\r\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SopTbvtvTrongNuocGcmsmsEntryComponent, { className: "SopTbvtvTrongNuocGcmsmsEntryComponent", filePath: "src/app/features/results/sops/sop-tbvtv-trong-nuoc-gcmsms/sop-tbvtv-trong-nuoc-gcmsms-entry.component.ts", lineNumber: 14 }); })();
//# sourceMappingURL=sop-tbvtv-trong-nuoc-gcmsms-entry.component.js.map