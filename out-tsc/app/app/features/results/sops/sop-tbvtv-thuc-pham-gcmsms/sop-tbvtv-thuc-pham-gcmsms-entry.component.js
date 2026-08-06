import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractSopEntry } from '../shared/abstract-sop-entry';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { calculateSop01Recovery } from '../sop-01/sop-01-engine';
import { navigateGrid } from '../shared/sop-grid-helper';
import { getAssignedTargetsForSample, SOP01_COLUMN_TO_CANONICAL, getSop01DisplayName } from '../../shared/compound-id-resolver';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = () => ["0 ppb", "5 ppb", "10 ppb", "20 ppb", "50 ppb"];
const _forTrack0 = ($index, $item) => $item.key;
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 39)(1, "label", 36);
    i0.ɵɵtext(2, "T\u00EAn m\u1EABu ki\u1EC3m tra");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 40);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Conditional_18_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["checkSampleName"], $event) || (ctx_r1.draft.page1Data["checkSampleName"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Conditional_18_Template_input_ngModelChange_3_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["checkSampleName"]);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 26)(1, "div", 29)(2, "h5", 30);
    i0.ɵɵelement(3, "i", 31);
    i0.ɵɵtext(4, " C\u1EA5u H\u00ECnh M\u1EABu QC & T\u00EAn Tu\u1EF3 Ch\u1EC9nh ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "label", 32)(6, "input", 33);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Template_input_ngModelChange_6_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["hasCheckSample"], $event) || (ctx_r1.draft.page1Data["hasCheckSample"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Template_input_ngModelChange_6_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onHasCheckSampleChange()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 34);
    i0.ɵɵtext(8, "\u00C1p d\u1EE5ng m\u1EABu CHECK_SAMPLE");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 35)(10, "div")(11, "label", 36);
    i0.ɵɵtext(12, "T\u00EAn m\u1EABu tr\u1EAFng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "input", 37);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Template_input_ngModelChange_13_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["blankName"], $event) || (ctx_r1.draft.page1Data["blankName"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Template_input_ngModelChange_13_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div")(15, "label", 36);
    i0.ɵɵtext(16, "T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "input", 38);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Template_input_ngModelChange_17_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["spikeName"], $event) || (ctx_r1.draft.page1Data["spikeName"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Template_input_ngModelChange_17_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(18, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Conditional_18_Template, 4, 1, "div", 39);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["hasCheckSample"]);
    i0.ɵɵadvance(7);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["blankName"]);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["spikeName"]);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.draft.page1Data["hasCheckSample"] ? 18 : -1);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_10_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 86);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_10_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 47)(1, "input", 83);
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_10_Template_input_ngModelChange_1_listener($event) { const sampleCode_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleSampleSelected(sampleCode_r6, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 84);
    i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_10_Template_button_click_2_listener() { const sampleCode_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectSample(sampleCode_r6)); });
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 85);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_10_Conditional_7_Template, 1, 0, "i", 86);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sampleCode_r6 = ctx.$implicit;
    const ɵ$index_151_r7 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", ctx_r1.draft.resultData[sampleCode_r6]["selected"] !== false);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.activeSampleCode() === sampleCode_r6 ? "bg-violet-600 text-white font-extrabold shadow-sm border border-violet-655 transition shrink-0 active:scale-95" : "bg-transparent text-slate-655 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800 border-0 transition shrink-0 active:scale-95");
    i0.ɵɵclassProp("opacity-50", ctx_r1.draft.resultData[sampleCode_r6]["selected"] === false);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.activeSampleCode() === sampleCode_r6 ? "w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white" : "w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ɵ$index_151_r7 + 1, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sampleCode_r6);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.publishedSampleSet && ctx_r1.publishedSampleSet.has(sampleCode_r6) ? 7 : -1);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "input", 87);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Conditional_30_Template_input_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[ctx_r1.activeSampleCode()]["khoiLuong"], $event) || (ctx_r1.draft.resultData[ctx_r1.activeSampleCode()]["khoiLuong"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Conditional_30_Template_input_ngModelChange_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[ctx_r1.activeSampleCode()]["khoiLuong"]);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 95);
    i0.ɵɵelementStart(1, "span", 96);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const compound_r10 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.compoundDisplayNames()[compound_r10] || compound_r10);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 90);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const compound_r10 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.compoundDisplayNames()[compound_r10] || compound_r10);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td", 88);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 89);
    i0.ɵɵtemplate(4, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Conditional_4_Template, 3, 1)(5, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Conditional_5_Template, 2, 1, "span", 90);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td", 91)(7, "input", 92);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Template_input_ngModelChange_7_listener($event) { const compound_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r10 + "_nd"], $event) || (ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r10 + "_nd"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Template_input_ngModelChange_7_listener() { const compound_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onNdCheckboxChanged(compound_r10)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 93)(9, "input", 94);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Template_input_ngModelChange_9_listener($event) { const compound_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r10], $event) || (ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r10] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Template_input_ngModelChange_9_listener() { const compound_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onResultInputChanged(compound_r10)); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const compound_r10 = ctx.$implicit;
    const ɵ$index_256_r11 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(!ctx_r1.isTargetAssigned(ctx_r1.activeSampleCode(), compound_r10) ? "bg-slate-50/50 dark:bg-slate-950/20 text-slate-400/80 dark:text-slate-600 transition-all border-l-4 border-l-transparent duration-150" : "hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-violet-50/10 dark:focus-within:bg-violet-500/5 border-l-4 border-l-transparent focus-within:border-l-violet-500 duration-150");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ɵ$index_256_r11 + 1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!ctx_r1.isTargetAssigned(ctx_r1.activeSampleCode(), compound_r10) ? 4 : 5);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", !ctx_r1.isTargetAssigned(ctx_r1.activeSampleCode(), compound_r10));
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r10 + "_nd"]);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.isTargetAssigned(ctx_r1.activeSampleCode(), compound_r10));
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[ctx_r1.activeSampleCode()][compound_r10]);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 41)(2, "div", 42)(3, "span", 43);
    i0.ɵɵtext(4, "Danh s\u00E1ch m\u1EABu:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 44);
    i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleSelectAllSamples()); });
    i0.ɵɵelement(6, "i", 45);
    i0.ɵɵelementStart(7, "span", 46);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(9, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_10_Template, 8, 10, "div", 47, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 48)(12, "label", 49);
    i0.ɵɵelement(13, "input", 50);
    i0.ɵɵelementStart(14, "div", 51)(15, "span", 52);
    i0.ɵɵtext(16, "G\u1ED9p in chung c\u00E1c m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span", 53);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(19, "div", 54)(20, "div", 55)(21, "div", 56)(22, "h4", 57);
    i0.ɵɵelement(23, "i", 58);
    i0.ɵɵtext(24, " B\u1EA3ng K\u1EBFt Qu\u1EA3 M\u1EABu: ");
    i0.ɵɵelementStart(25, "span", 59);
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "div", 60)(28, "span", 61);
    i0.ɵɵtext(29, "m =");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(30, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Conditional_30_Template, 1, 1, "input", 62);
    i0.ɵɵelementStart(31, "span", 63);
    i0.ɵɵtext(32, "G");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(33, "p", 64);
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "div", 65)(36, "input", 66);
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Template_input_ngModelChange_36_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.searchQuery.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(37, "i", 67);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "div", 68)(39, "span", 69);
    i0.ɵɵtext(40, "M\u1EABu n\u00E0y:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "button", 70);
    i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.sampleBulkFillND()); });
    i0.ɵɵelement(42, "i", 71);
    i0.ɵɵelementStart(43, "span");
    i0.ɵɵtext(44, "\u0110\u1EB7t T\u1EA5t C\u1EA3 ND");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(45, "button", 72);
    i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Template_button_click_45_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyActiveSampleToAll()); });
    i0.ɵɵelement(46, "i", 73);
    i0.ɵɵelementStart(47, "span");
    i0.ɵɵtext(48, "Sao Ch\u00E9p M\u1EABu cho C\u1EA3 M\u1EBB");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(49, "div", 74)(50, "table", 75)(51, "thead")(52, "tr", 76)(53, "th", 77);
    i0.ɵɵtext(54, "STT");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "th", 78);
    i0.ɵɵtext(56, "Ho\u1EA1t ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "th", 79);
    i0.ɵɵtext(58, "KPH / ND");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(59, "th", 80);
    i0.ɵɵtext(60, "K\u1EBFt qu\u1EA3 (\u00B5g/kg)");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(61, "tbody", 81);
    i0.ɵɵrepeaterCreate(62, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_For_63_Template, 10, 8, "tr", 82, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
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
    i0.ɵɵconditional(ctx_r1.activeSampleCode() && ctx_r1.draft.resultData[ctx_r1.activeSampleCode()] ? 30 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" T\u1ED5ng c\u1ED9ng ", (ctx_r1.config.compounds == null ? null : ctx_r1.config.compounds.length) || 0, " ho\u1EA1t ch\u1EA5t c\u1EA7n ki\u1EC3m nghi\u1EC7m. ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r1.searchQuery());
    i0.ɵɵadvance(26);
    i0.ɵɵrepeater(ctx_r1.filteredCompounds());
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 80);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const col_r13 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.columnDisplayNames()[col_r13] || col_r13, " (\u00B5g/kg) ");
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 120);
    i0.ɵɵelement(1, "i", 124);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r15 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", row_r15.label, " ");
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r15 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(row_r15.label);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_For_7_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 93)(1, "input", 125);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_For_7_Template_input_ngModelChange_1_listener($event) { const col_r18 = i0.ɵɵrestoreView(_r17).$implicit; const row_r15 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r15.key][col_r18], $event) || (ctx_r1.draft.resultData[row_r15.key][col_r18] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_For_7_Template_input_ngModelChange_1_listener() { i0.ɵɵrestoreView(_r17); const row_r15 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCellChanged(row_r15.key)); })("keydown", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_For_7_Template_input_keydown_1_listener($event) { const ctx_r18 = i0.ɵɵrestoreView(_r17); const col_r18 = ctx_r18.$implicit; const ɵ$index_389_r20 = ctx_r18.$index; const ɵ$index_369_r16 = i0.ɵɵnextContext(2).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_369_r16, col_r18, ɵ$index_389_r20 + 1)); })("focus", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_For_7_Template_input_focus_1_listener($event) { i0.ɵɵrestoreView(_r17); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const col_r18 = ctx.$implicit;
    const ctx_r20 = i0.ɵɵnextContext(2);
    const row_r15 = ctx_r20.$implicit;
    const ɵ$index_369_r16 = ctx_r20.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r15.key][col_r18]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_369_r16 + "-" + col_r18)("disabled", !ctx_r1.isTargetAssigned(row_r15.key, col_r18));
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 122);
    i0.ɵɵtext(1, " QC Active ");
    i0.ɵɵelementEnd();
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r22 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 126);
    i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Conditional_10_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r22); const row_r15 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.copyRowToAll(row_r15.key)); });
    i0.ɵɵelement(1, "i", 73);
    i0.ɵɵelementEnd();
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td", 117)(2, "input", 118);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Template_input_ngModelChange_2_listener($event) { i0.ɵɵrestoreView(_r14); const row_r15 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r15.key]["loSo"], $event) || (ctx_r1.draft.resultData[row_r15.key]["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Template_input_ngModelChange_2_listener() { i0.ɵɵrestoreView(_r14); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Template_input_keydown_2_listener($event) { i0.ɵɵrestoreView(_r14); const ɵ$index_369_r16 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_369_r16, "loSo", 0)); })("focus", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Template_input_focus_2_listener($event) { i0.ɵɵrestoreView(_r14); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(3, "td", 119);
    i0.ɵɵtemplate(4, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Conditional_4_Template, 3, 1, "span", 120)(5, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Conditional_5_Template, 2, 1, "span");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(6, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_For_7_Template, 2, 3, "td", 93, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementStart(8, "td", 121);
    i0.ɵɵtemplate(9, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Conditional_9_Template, 2, 0, "span", 122)(10, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Conditional_10_Template, 2, 0, "button", 123);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r20 = i0.ɵɵnextContext();
    const row_r15 = ctx_r20.$implicit;
    const ɵ$index_369_r16 = ctx_r20.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(row_r15.isQC ? "bg-amber-50/15 dark:bg-amber-955/5 border-l-4 border-l-amber-500/80 hover:bg-amber-50/25 dark:hover:bg-amber-955/10 transition-colors" : "hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 duration-150");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r15.key]["loSo"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_369_r16 + "-loSo");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(row_r15.isQC ? 4 : 5);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.activeColumns);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(row_r15.isQC ? 9 : 10);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Conditional_0_Template, 11, 6, "tr", 82);
} if (rf & 2) {
    const row_r15 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r1.draft.resultData[row_r15.key] ? 0 : -1);
} }
function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 97)(2, "div", 55)(3, "h4", 98);
    i0.ɵɵelement(4, "i", 99);
    i0.ɵɵtext(5, " L\u01B0\u1EDBi Nh\u1EADp K\u1EBFt Qu\u1EA3 (SOP 9.14 Spreadsheet) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 100)(7, "span", 69);
    i0.ɵɵtext(8, "Thao t\u00E1c nhanh:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 101);
    i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.bulkFillND()); });
    i0.ɵɵelement(10, "i", 102);
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12, "\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "button", 103);
    i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.bulkClearAll()); });
    i0.ɵɵelement(14, "i", 104);
    i0.ɵɵelementStart(15, "span");
    i0.ɵɵtext(16, "X\u00F3a H\u1EBFt B\u1EA3ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 105)(18, "span", 106);
    i0.ɵɵtext(19, "Nh\u1EADp nhanh s\u1ED1 l\u1ECD:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 15)(21, "span", 107);
    i0.ɵɵtext(22, "Rack:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "input", 108);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_Template_input_ngModelChange_23_listener($event) { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.bulkRackStart, $event) || (ctx_r1.bulkRackStart = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div", 15)(25, "span", 107);
    i0.ɵɵtext(26, "Vial \u0111\u1EA7u:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "input", 109);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_Template_input_ngModelChange_27_listener($event) { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.bulkVialStartFip, $event) || (ctx_r1.bulkVialStartFip = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(28, "div", 15)(29, "span", 107);
    i0.ɵɵtext(30, "Size:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "input", 110);
    i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_Template_input_ngModelChange_31_listener($event) { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.bulkVialsPerRack, $event) || (ctx_r1.bulkVialsPerRack = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "button", 111);
    i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_Template_button_click_32_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.applyBulkVials()); });
    i0.ɵɵelement(33, "i", 112);
    i0.ɵɵelementStart(34, "span");
    i0.ɵɵtext(35, "\u0110i\u1EC1n Nhanh");
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(36, "div", 113)(37, "table", 75)(38, "thead")(39, "tr", 114)(40, "th", 115);
    i0.ɵɵtext(41, "Vial No.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "th", 116);
    i0.ɵɵtext(43, "M\u1EABu th\u1EED");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(44, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_45_Template, 2, 1, "th", 80, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementStart(46, "th", 79);
    i0.ɵɵtext(47, "H\u00E0nh \u0111\u1ED9ng");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(48, "tbody", 81);
    i0.ɵɵrepeaterCreate(49, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_For_50_Template, 1, 1, null, null, _forTrack0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(23);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.bulkRackStart);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.bulkVialStartFip);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.bulkVialsPerRack);
    i0.ɵɵadvance(13);
    i0.ɵɵrepeater(ctx_r1.activeColumns);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(ctx_r1.getDisplayRowsForSpreadsheet());
} }
const SOP914_FULL_TEMPLATE_DOC_ID = '1b-bv_9mAxnTNWz2ve0n0OeBj4UrhCB5X3DHXsG5EOc4';
const SOP914_SHORT_TEMPLATE_DOC_ID = '1a-6dDufswdWaOJ2oqtzZD4j6ncj5EEvtbi8xo3019K4';
const SOP914_FULL_TEMPLATE_URL = `https://docs.google.com/document/d/${SOP914_FULL_TEMPLATE_DOC_ID}/edit`;
const SOP914_SHORT_TEMPLATE_URL = `https://docs.google.com/document/d/${SOP914_SHORT_TEMPLATE_DOC_ID}/edit`;
export class SopTbvtvThucPhamGcmsmsEntryComponent extends AbstractSopEntry {
    constructor() {
        super(...arguments);
        // ── UI State đặc thù của SOP TBVTV Thực Phẩm ────────────────────────────
        this.activeTab = signal('compounds');
        this.searchQuery = signal('');
        // Các thuộc tính cho Form Rút Gọn (Grid Spreadsheet)
        this.bulkRackStart = 1;
        this.bulkVialStartFip = 10;
        this.bulkVialsPerRack = 54;
        this.columnDisplayNames = signal({});
        this.activeColumns = [
            'kqFip',
            'kqFipDesl',
            'kqFipSulf',
            'kqFipSulf2',
            'kqClp',
            'kqClpMe',
            'kqClpMeDes'
        ];
        this.shortFormColumns = this.activeColumns;
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
        this.checkboxList = [
            { key: 'qcKiemTraNoiBo', label: 'Mẫu kiểm tra nội bộ' },
            { key: 'qcThoiGianLuu', label: 'Độ lệch thời gian lưu' },
            { key: 'qcNhanDangMauNhiem', label: 'Các yêu cầu về nhận dạng khi phát hiện mẫu nhiễm' },
            { key: 'qcNhanDangSpike', label: 'Các yêu cầu về nhận dạng của mẫu thêm chuẩn tại 5ppb' },
            { key: 'qcThuHoiIS', label: 'Độ thu hồi IS' },
            { key: 'qcDanhGiaChung', label: 'Đánh giá chung' }
        ];
        // TBVTV Thực Phẩm dùng 5 điểm chuẩn (C0-C4)
        this.initCalibrationPoints(5);
        this.initActiveCompound();
        this.buildColumnDisplayNames();
        // Thay đổi printFormType default thành formDayDu
        const currentPrintFormType = this.draft.page1Data['printFormType'];
        if (!currentPrintFormType || currentPrintFormType === 'formCheck' || currentPrintFormType === 'formDon') {
            this.draft.page1Data['printFormType'] = 'formDayDu';
        }
        this.applyTemplateMetadata(this.draft.page1Data['printFormType']);
        // Khởi tạo trạng thái checkbox m = 10.0 g mặc định là true cho form đầy đủ
        if (this.draft.page1Data['is10gChecked'] === undefined) {
            this.draft.page1Data['is10gChecked'] = true;
        }
        if (!this.draft.page1Data['khoiLuong']) {
            this.draft.page1Data['khoiLuong'] = '10.0';
        }
        // Khởi tạo các trường dùng cho form rút gọn dạng Spreadsheet
        if (this.draft.page1Data['maHoSo'] === undefined)
            this.draft.page1Data['maHoSo'] = '';
        if (this.draft.page1Data['heSoPhaLoang'] === undefined)
            this.draft.page1Data['heSoPhaLoang'] = '1';
        if (this.draft.page1Data['hasCheckSample'] === undefined)
            this.draft.page1Data['hasCheckSample'] = false;
        if (this.draft.page1Data['checkSampleName'] === undefined)
            this.draft.page1Data['checkSampleName'] = 'CHECK_SAMPLE';
        if (!this.draft.page1Data['loaiMau']) {
            this.draft.page1Data['loaiMau'] = 'Thủy sản';
        }
        if (!this.draft.page1Data['tinhTrangMau']) {
            this.draft.page1Data['tinhTrangMau'] = 'Bình thường';
        }
        const qcKeysTrue = [
            'qcThoiGianLuu',
            'qcNhanDangSpike',
            'qcThuHoiIS',
            'qcDanhGiaChung'
        ];
        qcKeysTrue.forEach(k => {
            if (this.draft.page1Data[k] === undefined || this.draft.page1Data[k] === null || this.draft.page1Data[k] === '') {
                this.draft.page1Data[k] = true;
            }
        });
        if (this.draft.page1Data['qcNhanDangMauNhiem'] === undefined || this.draft.page1Data['qcNhanDangMauNhiem'] === '') {
            this.draft.page1Data['qcNhanDangMauNhiem'] = null;
        }
        if (this.draft.page1Data['qcKiemTraNoiBo'] === undefined || this.draft.page1Data['qcKiemTraNoiBo'] === '') {
            this.draft.page1Data['qcKiemTraNoiBo'] = this.draft.page1Data['hasCheckSample'] ? true : null;
        }
        (this.run?.sampleList || []).forEach((sampleCode, idx) => {
            if (!this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode] = {};
            }
            const sRes = this.draft.resultData[sampleCode];
            if (!sRes['khoiLuong']) {
                sRes['khoiLuong'] = '10.0';
            }
            // Mặc định điền Vial bắt đầu từ 1.10 cho Form Rút Gọn
            if (sRes['loSo'] === undefined || sRes['loSo'] === '') {
                const currentVial = 10 + idx;
                const rack = 1 + Math.floor((currentVial - 1) / 54);
                const vial = ((currentVial - 1) % 54) + 1;
                sRes['loSo'] = `${rack}.${vial}`;
            }
            if (sRes['selected'] === undefined) {
                sRes['selected'] = true;
            }
        });
        this.migrateLegacyShortFormColumns();
        this.ensureQcRows();
        this.prefillShortFormUnassignedTargets();
    }
    buildDisplayNameMap() {
        super.buildDisplayNameMap();
        this.buildColumnDisplayNames();
    }
    applyTemplateMetadata(type) {
        const isShort = type === 'formRutGon';
        this.draft.page1Data['templateDocId'] = isShort ? SOP914_SHORT_TEMPLATE_DOC_ID : SOP914_FULL_TEMPLATE_DOC_ID;
        this.draft.page1Data['templateDocUrl'] = isShort ? SOP914_SHORT_TEMPLATE_URL : SOP914_FULL_TEMPLATE_URL;
        this.draft.page1Data['reportFormLabel'] = isShort ? 'FORM RÚT GỌN' : 'FORM ĐẦY ĐỦ';
    }
    ensureQcRows() {
        this.ensureQcRow('QC_BLANK', '1.7');
        this.ensureQcRow('QC_SPIKE', '1.8');
        if (this.draft.page1Data['hasCheckSample']) {
            if (!this.draft.resultData['QC_CHECK_SAMPLE'] && this.draft.resultData['QC_CHECK']) {
                this.draft.resultData['QC_CHECK_SAMPLE'] = this.draft.resultData['QC_CHECK'];
            }
            this.ensureQcRow('QC_CHECK_SAMPLE', '1.9');
        }
        this.ensureQcRow('QC_FINAL', '1.8');
    }
    ensureQcRow(key, defaultLoSo) {
        if (!this.draft.resultData[key]) {
            this.draft.resultData[key] = {};
        }
        const row = this.draft.resultData[key];
        if (row['loSo'] === undefined || row['loSo'] === '')
            row['loSo'] = defaultLoSo;
        if (row['selected'] === undefined)
            row['selected'] = true;
        if (!row['khoiLuong'])
            row['khoiLuong'] = '10.0';
        if (!row['heSoPhaLoang'])
            row['heSoPhaLoang'] = '1';
        if (!row['hSoPhaLoang'])
            row['hSoPhaLoang'] = '1';
    }
    // ── Override: mass default (10.0g) ───────────────────────────────────────
    on10gCheckChange(event) {
        this.draft.page1Data['is10gChecked'] = event.target.checked;
        if (this.draft.page1Data['is10gChecked']) {
            this.draft.page1Data['khoiLuongKhac'] = '';
            this.draft.page1Data['khoiLuong'] = '10.0';
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
            this.draft.page1Data['khoiLuong'] = '10.0';
        }
        this.onDataChanged();
    }
    bulkRandomizeMasses() {
        (this.run?.sampleList || []).forEach((sampleCode) => {
            if (this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode]['khoiLuong'] = (10.0 + (Math.random() - 0.5) * 0.2).toFixed(2);
            }
        });
        if (this.draft.resultData['QC_SPIKE']) {
            this.draft.resultData['QC_SPIKE']['khoiLuong'] = (10.0 + (Math.random() - 0.5) * 0.2).toFixed(2);
        }
        this.onDataChanged();
    }
    // ── Override: View Mode Switcher ─────────────────────────────────────────
    setPrintFormMode(type) {
        this.draft.page1Data['printFormType'] = type;
        this.applyTemplateMetadata(type);
        if (type === 'formRutGon') {
            this.migrateLegacyShortFormColumns();
            this.ensureQcRows();
            this.prefillShortFormUnassignedTargets();
        }
        this.onDataChanged();
    }
    onSetPrintFormType(_type) {
        // Bắt buộc override từ abstract
    }
    onDataChanged() {
        let hasPositive = false;
        const sampleList = this.run?.sampleList || [];
        const compounds = this.config?.compounds || [];
        for (const sample of sampleList) {
            const row = this.draft.resultData[sample];
            if (!row)
                continue;
            for (const c of compounds) {
                const val = row[c];
                if (val === undefined || val === null)
                    continue;
                const vStr = val.toString().trim().toUpperCase();
                if (vStr !== '' && vStr !== 'ND' && vStr !== 'N/A' && vStr !== 'KPH') {
                    hasPositive = true;
                    break;
                }
            }
            if (hasPositive)
                break;
        }
        if (hasPositive) {
            if (this.draft.page1Data['qcNhanDangMauNhiem'] === null || this.draft.page1Data['qcNhanDangMauNhiem'] === undefined) {
                this.draft.page1Data['qcNhanDangMauNhiem'] = true;
            }
        }
        else {
            if (this.draft.page1Data['qcNhanDangMauNhiem'] === true) {
                this.draft.page1Data['qcNhanDangMauNhiem'] = null;
            }
        }
        super.onDataChanged();
    }
    // ── SPREADSHEET (FORM RÚT GỌN, SPREADSHEET UI/DATA) METHODS ──────────────────
    onHasCheckSampleChange() {
        if (this.draft.page1Data['hasCheckSample']) {
            this.ensureQcRow('QC_CHECK_SAMPLE', '1.9');
            this.draft.page1Data['qcKiemTraNoiBo'] = true;
        }
        else {
            this.draft.page1Data['qcKiemTraNoiBo'] = null;
        }
        this.onDataChanged();
    }
    formatColumnName(colKey) {
        return getSop01DisplayName(colKey, this.masterTargets());
    }
    buildColumnDisplayNames() {
        const map = {};
        for (const col of this.activeColumns) {
            map[col] = this.formatColumnName(col);
        }
        this.columnDisplayNames.set(map);
    }
    isTargetAssigned(sampleCode, compoundOrCol) {
        if (SOP01_COLUMN_TO_CANONICAL[compoundOrCol]) {
            if (sampleCode.startsWith('QC_')) {
                return this.isTargetAssignedToAnySample(compoundOrCol);
            }
            if (!this.run)
                return true;
            const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
            if (!targetMap)
                return true;
            const assigned = getAssignedTargetsForSample(sampleCode, targetMap);
            if (!assigned || assigned.length === 0)
                return true;
            const canonicalId = SOP01_COLUMN_TO_CANONICAL[compoundOrCol];
            if (assigned.includes(canonicalId))
                return true;
            return assigned.some(tid => tid.toLowerCase() === canonicalId.toLowerCase());
        }
        return super.isTargetAssigned(sampleCode, compoundOrCol);
    }
    isTargetAssignedToAnySample(col) {
        if (!this.run)
            return true;
        const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
        if (!targetMap)
            return true;
        const sampleList = this.run.sampleList || [];
        if (sampleList.length === 0)
            return true;
        const canonicalId = SOP01_COLUMN_TO_CANONICAL[col];
        return sampleList.some((sampleCode) => {
            const assigned = getAssignedTargetsForSample(sampleCode, targetMap);
            if (!assigned || assigned.length === 0)
                return true;
            if (canonicalId) {
                if (assigned.includes(canonicalId))
                    return true;
                return assigned.some(tid => tid.toLowerCase() === canonicalId.toLowerCase());
            }
            return assigned.some(tid => tid.toLowerCase() === col.toLowerCase());
        });
    }
    prefillUnassignedTargets() {
        super.prefillUnassignedTargets();
        this.prefillShortFormUnassignedTargets();
    }
    prefillShortFormUnassignedTargets() {
        const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
        if (!this.run || !targetMap)
            return;
        const allRowKeys = this.getDisplayRowsForSpreadsheet().map(row => row.key);
        let changed = false;
        allRowKeys.forEach((sampleCode) => {
            if (!this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode] = {};
            }
            const row = this.draft.resultData[sampleCode];
            this.activeColumns.forEach((c) => {
                if (!this.isTargetAssigned(sampleCode, c) && row[c] !== 'N/A') {
                    row[c] = 'N/A';
                    changed = true;
                }
            });
        });
        if (changed) {
            this.onDataChanged();
        }
    }
    migrateLegacyShortFormColumns() {
        const legacyToSop01 = {
            fipronil: 'kqFip',
            fipronil_desulfinyl: 'kqFipDesl',
            fipronil_sulfide: 'kqFipSulf',
            fipronil_sulfone: 'kqFipSulf2',
            chlorpyrifos: 'kqClp',
            chlorpyrifos_methyl: 'kqClpMe',
            chlorpyrifos_methyl_desmethyl: 'kqClpMeDes'
        };
        Object.values(this.draft.resultData || {}).forEach((row) => {
            if (!row || typeof row !== 'object')
                return;
            Object.entries(legacyToSop01).forEach(([legacyKey, sop01Key]) => {
                if ((row[sop01Key] === undefined || row[sop01Key] === '') && row[legacyKey] !== undefined && row[legacyKey] !== '') {
                    row[sop01Key] = row[legacyKey];
                }
            });
        });
    }
    onCellChanged(sampleCode) {
        this.updateRecovery(sampleCode);
        this.onDataChanged();
    }
    updateRecovery(sampleCode) {
        const row = this.draft.resultData[sampleCode];
        if (!row)
            return;
        row['ghiChu'] = calculateSop01Recovery(row, sampleCode);
    }
    getSpikeNKey(n) {
        return `QC_SPIKE_${n}`;
    }
    getDisplayRowsForSpreadsheet() {
        const list = [];
        const blankName = this.draft.page1Data['blankName'] || 'BLANK';
        const spikeName = this.draft.page1Data['spikeName'] || 'SPIKE';
        const checkSampleName = this.draft.page1Data['checkSampleName'] || 'CHECK_SAMPLE';
        const ensureKey = (key, defaultVial) => {
            if (!this.draft.resultData[key]) {
                this.draft.resultData[key] = {
                    loSo: defaultVial,
                    selected: true
                };
            }
            if (!this.draft.resultData[key]['loSo']) {
                this.draft.resultData[key]['loSo'] = defaultVial;
            }
        };
        ensureKey('QC_BLANK', '1.7');
        this.activeColumns.forEach(col => {
            if (this.draft.resultData['QC_BLANK'][col] === undefined || this.draft.resultData['QC_BLANK'][col] === '') {
                this.draft.resultData['QC_BLANK'][col] = 'ND';
            }
        });
        list.push({
            key: 'QC_BLANK',
            type: 'QC_BLANK',
            label: blankName,
            isQC: true
        });
        ensureKey('QC_SPIKE', '1.8');
        list.push({
            key: 'QC_SPIKE',
            type: 'QC_SPIKE',
            label: spikeName,
            isQC: true
        });
        if (this.draft.page1Data['hasCheckSample']) {
            ensureKey('QC_CHECK_SAMPLE', '1.9');
            list.push({
                key: 'QC_CHECK_SAMPLE',
                type: 'QC_CHECK_SAMPLE',
                label: checkSampleName,
                isQC: true
            });
        }
        let regularCount = 0;
        (this.run.sampleList || []).forEach((sampleCode) => {
            if (!this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode] = {
                    loSo: '',
                    selected: true
                };
            }
            list.push({
                key: sampleCode,
                type: 'REGULAR',
                label: sampleCode,
                isQC: false
            });
            regularCount++;
            if (regularCount % 10 === 0) {
                const isLastSample = regularCount === (this.run.sampleList || []).length;
                if (!isLastSample) {
                    const n = regularCount / 10;
                    const spikeNKey = this.getSpikeNKey(n);
                    const spikeVial = this.draft.resultData['QC_SPIKE']?.['loSo'] || '1.8';
                    if (!this.draft.resultData[spikeNKey]) {
                        this.draft.resultData[spikeNKey] = {
                            loSo: spikeVial,
                            selected: true
                        };
                    }
                    else {
                        this.draft.resultData[spikeNKey]['loSo'] = spikeVial;
                    }
                    list.push({
                        key: spikeNKey,
                        type: 'QC_SPIKE_N',
                        label: `SP_${n}`,
                        isQC: true,
                        n
                    });
                }
            }
        });
        ensureKey('QC_FINAL', '1.8');
        list.push({
            key: 'QC_FINAL',
            type: 'QC_FINAL',
            label: 'FINAL',
            isQC: true
        });
        return list;
    }
    getDisplayRows() {
        return this.getDisplayRowsForSpreadsheet();
    }
    applyBulkVials() {
        const rackStart = parseInt(String(this.bulkRackStart), 10);
        const vialStart = parseInt(String(this.bulkVialStartFip), 10);
        const perRack = parseInt(String(this.bulkVialsPerRack), 10);
        if (isNaN(rackStart) || isNaN(vialStart) || isNaN(perRack) || perRack <= 0) {
            return;
        }
        const visible = this.run.sampleList || [];
        let currentRack = rackStart;
        let currentVial = vialStart;
        visible.forEach((sample) => {
            if (currentVial > perRack) {
                currentRack += 1;
                currentVial = 1;
            }
            if (!this.draft.resultData[sample]) {
                this.draft.resultData[sample] = {
                    loSo: '',
                    selected: true
                };
            }
            this.draft.resultData[sample]['loSo'] = `${currentRack}.${currentVial}`;
            currentVial += 1;
        });
        this.onDataChanged();
    }
    bulkFillND() {
        const allRowKeys = this.getDisplayRowsForSpreadsheet().map(row => row.key);
        allRowKeys.forEach((key) => {
            const row = this.draft.resultData[key];
            if (row) {
                this.activeColumns.forEach((col) => {
                    if (!this.isTargetAssigned(key, col)) {
                        row[col] = 'N/A';
                    }
                    else {
                        const val = row[col];
                        if (val === undefined || val === null || val.toString().trim() === '') {
                            row[col] = 'ND';
                        }
                    }
                });
                this.updateRecovery(key);
            }
        });
        this.draft.page1Data['checkTatCaND'] = true;
        this.draft.page1Data['checkCoMauPhatHien'] = false;
        this.onDataChanged();
    }
    bulkClearAll() {
        const allRowKeys = this.getDisplayRowsForSpreadsheet().map(row => row.key);
        allRowKeys.forEach((key) => {
            const row = this.draft.resultData[key];
            if (row) {
                this.activeColumns.forEach((col) => {
                    row[col] = this.isTargetAssigned(key, col) ? '' : 'N/A';
                });
                row['ghiChu'] = '';
            }
        });
        this.onDataChanged();
    }
    copyRowToAll(sourceKey) {
        const sourceData = this.draft.resultData[sourceKey];
        if (!sourceData)
            return;
        const sampleList = this.run.sampleList || [];
        sampleList.forEach((targetKey) => {
            if (targetKey !== sourceKey) {
                if (!this.draft.resultData[targetKey]) {
                    this.draft.resultData[targetKey] = { selected: true };
                }
                const destRow = this.draft.resultData[targetKey];
                this.activeColumns.forEach((col) => {
                    if (!this.isTargetAssigned(targetKey, col)) {
                        destRow[col] = 'N/A';
                    }
                    else {
                        const sourceValue = this.isTargetAssigned(sourceKey, col) ? sourceData[col] : '';
                        destRow[col] = (sourceValue === 'N/A' && this.isTargetAssigned(targetKey, col)) ? '' : (sourceValue || '');
                    }
                });
                this.updateRecovery(targetKey);
            }
        });
        this.onDataChanged();
    }
    handleGridNavigation(event, rowIdx, _colName, colIdx) {
        const columnsList = ['loSo', ...this.activeColumns];
        const rows = this.getDisplayRowsForSpreadsheet();
        navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 0);
    }
    static { this.ɵfac = /*@__PURE__*/ (() => { let ɵSopTbvtvThucPhamGcmsmsEntryComponent_BaseFactory; return function SopTbvtvThucPhamGcmsmsEntryComponent_Factory(__ngFactoryType__) { return (ɵSopTbvtvThucPhamGcmsmsEntryComponent_BaseFactory || (ɵSopTbvtvThucPhamGcmsmsEntryComponent_BaseFactory = i0.ɵɵgetInheritedFactory(SopTbvtvThucPhamGcmsmsEntryComponent)))(__ngFactoryType__ || SopTbvtvThucPhamGcmsmsEntryComponent); }; })(); }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SopTbvtvThucPhamGcmsmsEntryComponent, selectors: [["app-sop-tbvtv-thuc-pham-gcmsms-entry"]], features: [i0.ɵɵInheritDefinitionFeature], decls: 56, vars: 26, consts: [[1, "space-y-6", "animate-fade-in"], [1, "sticky", "top-0", "z-30", "flex", "flex-col", "lg:flex-row", "lg:items-center", "justify-between", "gap-3", "p-4", "rounded-2xl", "bg-white/95", "dark:bg-slate-900/95", "backdrop-blur", "border", "border-violet-200/70", "dark:border-violet-900/40", "shadow-sm"], [1, "min-w-0"], [1, "block", "text-[10px]", "font-black", "text-violet-650", "dark:text-violet-400", "uppercase", "tracking-widest"], [1, "block", "text-xs", "font-semibold", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "inline-flex", "bg-slate-100", "dark:bg-slate-955", "p-1", "rounded-xl", "border", "border-slate-200", "dark:border-slate-800", "select-none", "items-center", "shadow-3xs", "w-full", "lg:w-auto"], ["type", "button", 3, "click"], [1, "hidden", "sm:inline", "font-extrabold", "opacity-80"], [3, "draftChanged", "title", "draft", "checkboxList"], ["sop-metadata-extra", "", 1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "gap-4", "p-4", "rounded-2xl", "bg-indigo-50/15", "dark:bg-indigo-955/5", "border", "border-indigo-100/40", "dark:border-indigo-950/20", "mt-4"], [1, "flex", "items-center", "justify-between", "text-[10px]", "font-black", "text-indigo-650", "dark:text-indigo-400", "mb-1.5", "uppercase", "tracking-widest"], ["type", "button", "title", "T\u1EF1 \u0111\u1ED9ng \u0111i\u1EC1n b\u1EB1ng c\u00E1c m\u1EABu \u0111ang ch\u1ECDn", 1, "text-indigo-500", "hover:text-indigo-700", "dark:hover:text-indigo-300", "transition-colors", 3, "click"], [1, "fa-solid", "fa-wand-magic-sparkles"], ["type", "text", "placeholder", "Nh\u1EADp m\u00E3 h\u1ED3 s\u01A1...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-3.5", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "block", "text-[10px]", "font-black", "text-indigo-650", "dark:text-indigo-400", "mb-1.5", "uppercase", "tracking-widest"], [1, "flex", "items-center", "gap-1.5"], ["type", "button", "title", "Ch\u1ECDn f=1", 3, "click"], ["type", "text", "placeholder", "H\u1EC7 s\u1ED1 f...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-3", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-sm", 3, "ngModelChange", "ngModel"], ["type", "button", "title", "Ch\u1ECDn Th\u1EE7y s\u1EA3n", 3, "click"], ["type", "text", "placeholder", "Lo\u1EA1i m\u1EABu...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-3", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-sm", 3, "ngModelChange", "ngModel"], ["type", "button", "title", "Ch\u1ECDn B\u00ECnh th\u01B0\u1EDDng", 3, "click"], ["type", "text", "placeholder", "T\u00ECnh tr\u1EA1ng...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-3", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4", "animate-fade-in", "mt-6"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "border-b", "border-slate-100", "dark:border-slate-800", "pb-2.5", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-chart-line", "mr-2", "text-fuchsia-500", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-12", "gap-6"], [1, "lg:col-span-5", "space-y-3", "animate-fade-in"], [1, "flex", "flex-col", "justify-center", "transition-all", "duration-300", 3, "ngClass"], ["title", "5 \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)", "pointPrefix", "Point C", "suffixText", "IS: 20 ppb", 3, "pointsChanged", "calibPoints", "pointLabels", "isSuffixVisible", "isFuchsiaRing"], [1, "p-4", "bg-indigo-50/15", "dark:bg-indigo-955/5", "border", "border-indigo-100/40", "dark:border-indigo-950/20", "rounded-2xl", "space-y-3", "shadow-xs"], [1, "text-xs", "font-black", "text-indigo-700", "dark:text-indigo-400", "uppercase", "tracking-wider", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-flask-vial"], [1, "flex", "items-center", "gap-2", "cursor-pointer", "py-2", "px-3", "bg-white", "dark:bg-slate-850", "hover:bg-slate-50", "dark:hover:bg-slate-800/60", "rounded-xl", "border", "border-slate-200", "dark:border-slate-800", "transition", "select-none", "shadow-2xs"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-fuchsia-600", "border-slate-350", "dark:border-slate-700", "focus:ring-fuchsia-500", "dark:bg-slate-900", 3, "ngModelChange", "ngModel"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "grid", "grid-cols-2", "gap-2.5"], [1, "block", "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "mb-1.5", "tracking-wider"], ["type", "text", "placeholder", "BLANK", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-3", "py-1.5", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-xs", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "SPIKE", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-3", "py-1.5", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-xs", 3, "ngModelChange", "ngModel"], [1, "animate-fade-in"], ["type", "text", "placeholder", "CHECK_SAMPLE", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-3", "py-1.5", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-xs", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "p-4", "rounded-2xl", "bg-slate-50/50", "dark:bg-slate-900/40", "border", "border-slate-200/60", "dark:border-slate-800/80", "shadow-2xs"], [1, "flex", "flex-wrap", "items-center", "gap-3", "overflow-x-auto", "custom-scrollbar", "flex-1", "min-w-0"], [1, "text-[10px]", "font-black", "text-indigo-700", "dark:text-indigo-400", "uppercase", "tracking-widest", "mr-1", "shrink-0"], ["type", "button", 1, "px-3", "py-2", "bg-slate-100", "dark:bg-slate-800", "hover:bg-slate-200", "dark:hover:bg-slate-700", "text-slate-700", "dark:text-slate-300", "rounded-xl", "text-[10px]", "font-extrabold", "transition", "shrink-0", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid"], [1, "ml-1.5"], [1, "flex", "items-center", "gap-1.5", "p-1", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800/80", "rounded-xl", "shadow-2xs", "hover:border-slate-350", "dark:hover:border-slate-700", "transition", "shrink-0"], [1, "flex", "items-center", "gap-3", "pl-4", "md:border-l", "border-slate-200", "dark:border-slate-800", "shrink-0"], ["title", "T\u1EF1 \u0111\u1ED9ng t\u00EDnh to\u00E1n d\u1EF1a tr\u00EAn s\u1ED1 l\u01B0\u1EE3ng m\u1EABu \u0111\u01B0\u1EE3c ch\u1ECDn in", 1, "flex", "items-center", "gap-2.5", "p-2", "px-3.5", "rounded-xl", "border", "border-slate-200", "dark:border-slate-800/80", "cursor-not-allowed", "select-none", "transition", "bg-slate-50", "dark:bg-slate-900/50", "shadow-2xs", "opacity-80"], ["type", "checkbox", "disabled", "", 1, "w-4", "h-4", "rounded", "text-violet-650", "border-slate-300", "dark:border-slate-700", "focus:ring-violet-500", "disabled:opacity-70", "disabled:cursor-not-allowed", 3, "ngModel"], [1, "flex", "flex-col"], [1, "text-xs", "font-black", "text-violet-750", "dark:text-violet-400", "tracking-wide"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "font-bold", "block", "mt-0.5"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4", "animate-fade-in"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-3.5"], [1, "flex-1", "min-w-[200px]"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-flask-vial", "mr-2", "text-violet-500", "text-sm"], [1, "font-mono", "text-violet-600", "dark:text-violet-400", "font-extrabold", "ml-1", "bg-violet-50", "dark:bg-violet-950/30", "px-2", "py-0.5", "rounded-lg", "border", "border-violet-100", "dark:border-violet-900/30"], [1, "ml-4", "flex", "items-center", "bg-white", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "overflow-hidden", "shadow-2xs", "normal-case"], [1, "bg-slate-50", "dark:bg-slate-900", "px-2", "py-1", "text-[10px]", "font-bold", "text-slate-500", "border-r", "border-slate-200", "dark:border-slate-800"], ["type", "text", 1, "w-14", "px-1", "py-1", "text-xs", "font-black", "text-indigo-650", "dark:text-indigo-400", "bg-transparent", "outline-none", "text-center", "focus:bg-indigo-50/50", 3, "ngModel"], [1, "pr-2", "pl-1", "text-[10px]", "font-bold", "text-slate-400", "border-l", "border-slate-100", "dark:border-slate-800"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-bold", "mt-1", "tracking-wide"], [1, "w-full", "md:w-64", "relative"], ["type", "text", "placeholder", "T\u00ECm ho\u1EA1t ch\u1EA5t...", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "pl-9", "pr-4", "py-2", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:ring-2", "focus:ring-violet-500/15", "focus:border-violet-500", "transition", "outline-none", 3, "ngModelChange", "ngModel"], [1, "fa-solid", "fa-magnifying-glass", "absolute", "left-3", "top-2.5", "text-slate-400", "text-xs"], [1, "flex", "flex-wrap", "items-center", "gap-2.5"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mr-1"], ["type", "button", 1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-amber-50", "dark:hover:bg-amber-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-amber-200", "dark:hover:border-amber-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-pen-nib", "text-amber-500"], ["type", "button", "title", "Sao ch\u00E9p to\u00E0n b\u1ED9 k\u1EBFt qu\u1EA3 c\u1EE7a m\u1EABu \u0111ang hi\u1EC3n th\u1ECB cho t\u1EA5t c\u1EA3 c\u00E1c m\u1EABu kh\u00E1c trong m\u1EBB ch\u1EA1y n\u00E0y", 1, "px-3.5", "py-2", "bg-gradient-to-r", "from-violet-600", "to-indigo-600", "hover:from-violet-700", "hover:to-indigo-700", "text-white", "rounded-xl", "text-xs", "font-black", "shadow-sm", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-copy"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "max-h-[550px]", "overflow-y-auto", "shadow-inner", "bg-slate-50/30", "dark:bg-slate-900/20"], [1, "w-full", "text-sm", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-955", "border-b", "border-slate-255/80", "dark:border-slate-800", "sticky", "top-0", "z-20", "shadow-2xs"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-16"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[150px]"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-28"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[130px]"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800/80"], [3, "class"], ["type", "checkbox", "title", "Bao g\u1ED3m m\u1EABu n\u00E0y trong b\u00E1o c\u00E1o in PDF", 1, "ml-1.5", "w-4", "h-4", "rounded", "text-violet-650", "border-slate-300", "dark:border-slate-700", "focus:ring-violet-500", "cursor-pointer", 3, "ngModelChange", "ngModel"], [1, "px-3", "py-2", "rounded-lg", "text-xs", "flex", "items-center", "gap-2", 3, "click"], [1, "font-mono", "font-bold"], ["title", "\u0110\u00E3 c\u00F3 b\u00E1o c\u00E1o PDF", 1, "fa-solid", "fa-circle-check", "text-emerald-500", "text-[10px]", "ml-1"], ["type", "text", 1, "w-14", "px-1", "py-1", "text-xs", "font-black", "text-indigo-650", "dark:text-indigo-400", "bg-transparent", "outline-none", "text-center", "focus:bg-indigo-50/50", 3, "ngModelChange", "ngModel"], [1, "py-2.5", "px-4", "font-mono", "text-xs", "text-slate-400", "font-bold", "text-center"], [1, "py-2.5", "px-4", "font-extrabold", "text-xs", "flex", "items-center"], [1, "text-slate-700", "dark:text-slate-200"], [1, "py-2.5", "px-4", "text-center"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-violet-650", "border-slate-355", "dark:border-slate-700", "focus:ring-violet-500", "dark:bg-slate-900", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "ngModelChange", "disabled", "ngModel"], [1, "py-1.5", "px-2"], ["type", "text", "placeholder", "ND / S\u1ED1 l\u01B0\u1EE3ng...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "font-extrabold", "focus:ring-2", "focus:ring-violet-500/20", "focus:border-violet-500", "outline-none", "text-center", "shadow-inner", "disabled:bg-slate-100/50", "dark:disabled:bg-slate-900/30", "disabled:text-slate-400", "dark:disabled:text-slate-600", "disabled:border-slate-100", "dark:disabled:border-slate-850", "disabled:cursor-not-allowed", 3, "ngModelChange", "disabled", "ngModel"], ["title", "Kh\u00F4ng thu\u1ED9c ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m c\u1EE7a m\u1EABu n\u00E0y", 1, "fa-solid", "fa-lock", "text-[10px]", "text-slate-400/80", "dark:text-slate-600", "mr-1.5"], [1, "text-slate-400", "dark:text-slate-550", "line-through", "decoration-slate-250", "dark:decoration-slate-800/60"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-table-cells", "mr-1", "text-fuchsia-500", "text-sm"], [1, "flex", "flex-wrap", "items-center", "gap-3"], ["title", "\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND", 1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-amber-50", "dark:hover:bg-amber-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-amber-200", "dark:hover:border-amber-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-pen-clip", "text-amber-500"], ["title", "X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng", 1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-rose-50", "dark:hover:bg-rose-955/20", "text-slate-600", "dark:text-slate-400", "hover:text-rose-600", "dark:hover:text-rose-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-rose-200", "dark:hover:border-rose-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-trash-can", "text-rose-500"], [1, "flex", "items-center", "gap-2", "bg-indigo-50/15", "dark:bg-indigo-955/5", "border", "border-indigo-100/40", "dark:border-indigo-950/20", "rounded-2xl", "px-3.5", "py-1.5", "text-xs", "shadow-2xs"], [1, "font-black", "text-indigo-700", "dark:text-indigo-400", "uppercase", "tracking-widest"], [1, "text-slate-450", "dark:text-slate-500", "font-bold"], ["type", "number", "title", "Khay ch\u1EA1y m\u00E1y (Rack)", "placeholder", "Rack", 1, "w-12", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-1.5", "py-0.5", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "outline-none", "shadow-inner", 3, "ngModelChange", "ngModel"], ["type", "number", "title", "Vial b\u1EAFt \u0111\u1EA7u", "placeholder", "Vial", 1, "w-12", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-1.5", "py-0.5", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "outline-none", "shadow-inner", 3, "ngModelChange", "ngModel"], ["type", "number", "title", "S\u1ED1 \u1ED1ng vial t\u1ED1i \u0111a tr\u00EAn m\u1ED9t khay (Rack)", "placeholder", "T\u1ED1i \u0111a", 1, "w-12", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-1.5", "py-0.5", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "outline-none", "shadow-inner", 3, "ngModelChange", "ngModel"], ["title", "\u0110i\u1EC1n t\u1EF1 \u0111\u1ED9ng s\u1ED1 khay v\u00E0 vial cho to\u00E0n b\u1ED9 danh s\u00E1ch m\u1EABu", 1, "px-3", "py-1", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-xl", "font-extrabold", "transition", "shadow-sm", "flex", "items-center", "gap-1", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-magic", "text-[10px]"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "max-h-[550px]", "overflow-y-auto"], [1, "bg-slate-50", "dark:bg-slate-955", "border-b", "border-slate-250/80", "dark:border-slate-800", "sticky", "top-0", "z-20", "shadow-2xs"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-24"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[140px]"], [1, "py-1.5", "px-3", "w-24"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-extrabold", "focus:ring-2", "focus:ring-fuchsia-500/20", "focus:border-fuchsia-500", "transition", "outline-none", "text-center", "shadow-inner", 3, "ngModelChange", "keydown", "focus", "ngModel", "id"], [1, "py-2.5", "px-4", "font-mono", "font-extrabold", "text-xs", "text-slate-700", "dark:text-slate-300", "break-all"], [1, "inline-flex", "items-center", "gap-1.5", "text-amber-600", "dark:text-amber-400"], [1, "py-1.5", "px-4", "text-center"], [1, "inline-flex", "items-center", "px-2", "py-0.5", "rounded-full", "text-[9px]", "font-black", "uppercase", "tracking-widest", "bg-amber-500/10", "text-amber-500", "dark:bg-amber-400/5", "dark:text-amber-400", "border", "border-amber-500/20"], ["title", "Sao ch\u00E9p k\u1EBFt qu\u1EA3 c\u1EE7a d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng c\u00F2n l\u1EA1i", 1, "p-1.5", "bg-slate-50", "hover:bg-fuchsia-600", "dark:bg-slate-855", "dark:hover:bg-fuchsia-600", "text-slate-500", "hover:text-white", "dark:text-slate-400", "rounded-lg", "text-[10px]", "font-bold", "transition", "border", "border-slate-200", "dark:border-slate-800", "active:scale-90"], [1, "fa-solid", "fa-flask", "text-[10px]"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-extrabold", "focus:ring-2", "focus:ring-fuchsia-500/20", "focus:border-fuchsia-500", "transition", "outline-none", "text-center", "shadow-inner", "disabled:bg-slate-105", "dark:disabled:bg-slate-900", "disabled:opacity-60", "disabled:cursor-not-allowed", 3, "ngModelChange", "keydown", "focus", "ngModel", "id", "disabled"], ["title", "Sao ch\u00E9p k\u1EBFt qu\u1EA3 c\u1EE7a d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng c\u00F2n l\u1EA1i", 1, "p-1.5", "bg-slate-50", "hover:bg-fuchsia-600", "dark:bg-slate-855", "dark:hover:bg-fuchsia-600", "text-slate-500", "hover:text-white", "dark:text-slate-400", "rounded-lg", "text-[10px]", "font-bold", "transition", "border", "border-slate-200", "dark:border-slate-800", "active:scale-90", 3, "click"]], template: function SopTbvtvThucPhamGcmsmsEntryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span", 3);
            i0.ɵɵtext(4, "D\u1EA1ng nh\u1EADp k\u1EBFt qu\u1EA3 SOP 9.14");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "span", 4);
            i0.ɵɵtext(6, " \u0110\u1EA7y \u0111\u1EE7: bi\u1EC3u m\u1EABu ki\u1EC3m tra t\u1EA5t c\u1EA3 ch\u1EC9 ti\u00EAu \u00B7 R\u00FAt g\u1ECDn: d\u1EA1ng b\u1EA3ng ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "div", 5)(8, "button", 6);
            i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_button_click_8_listener() { return ctx.setPrintFormMode("formDayDu"); });
            i0.ɵɵtext(9, " BI\u1EC2U M\u1EAAU \u0110\u1EA6Y \u0110\u1EE6 ");
            i0.ɵɵelementStart(10, "span", 7);
            i0.ɵɵtext(11, "(KI\u1EC2M TRA T\u1EA4T C\u1EA2 CH\u1EC8 TI\u00CAU)");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "button", 6);
            i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_button_click_12_listener() { return ctx.setPrintFormMode("formRutGon"); });
            i0.ɵɵtext(13, " BI\u1EC2U M\u1EAAU R\u00DAT G\u1ECCN ");
            i0.ɵɵelementStart(14, "span", 7);
            i0.ɵɵtext(15, "(D\u1EA0NG B\u1EA2NG)");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(16, "app-sop-header-metadata", 8);
            i0.ɵɵlistener("draftChanged", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_app_sop_header_metadata_draftChanged_16_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementStart(17, "div", 9)(18, "div")(19, "label", 10)(20, "span");
            i0.ɵɵtext(21, "1. M\u00E3 h\u1ED3 s\u01A1");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "button", 11);
            i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_button_click_22_listener() { return ctx.autoFillMaHoSo(); });
            i0.ɵɵelement(23, "i", 12);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(24, "input", 13);
            i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_input_ngModelChange_24_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["maHoSo"], $event) || (ctx.draft.page1Data["maHoSo"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_input_ngModelChange_24_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(25, "div")(26, "label", 14);
            i0.ɵɵtext(27, "2. H\u1EC7 s\u1ED1 pha lo\u00E3ng (f)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "div", 15)(29, "button", 16);
            i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_button_click_29_listener() { ctx.draft.page1Data["heSoPhaLoang"] = "1"; return ctx.onDataChanged(); });
            i0.ɵɵtext(30, " f=1 ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "input", 17);
            i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_input_ngModelChange_31_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["heSoPhaLoang"], $event) || (ctx.draft.page1Data["heSoPhaLoang"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_input_ngModelChange_31_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(32, "div")(33, "label", 14);
            i0.ɵɵtext(34, "3. Lo\u1EA1i m\u1EABu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "div", 15)(36, "button", 18);
            i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_button_click_36_listener() { ctx.draft.page1Data["loaiMau"] = "Th\u1EE7y s\u1EA3n"; return ctx.onDataChanged(); });
            i0.ɵɵtext(37, " Th\u1EE7y S\u1EA3n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "input", 19);
            i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_input_ngModelChange_38_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["loaiMau"], $event) || (ctx.draft.page1Data["loaiMau"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_input_ngModelChange_38_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(39, "div")(40, "label", 14);
            i0.ɵɵtext(41, "4. T\u00ECnh tr\u1EA1ng m\u1EABu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "div", 15)(43, "button", 20);
            i0.ɵɵlistener("click", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_button_click_43_listener() { ctx.draft.page1Data["tinhTrangMau"] = "B\u00ECnh th\u01B0\u1EDDng"; return ctx.onDataChanged(); });
            i0.ɵɵtext(44, " B\u00ECnh Th\u01B0\u1EDDng ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "input", 21);
            i0.ɵɵtwoWayListener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_input_ngModelChange_45_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["tinhTrangMau"], $event) || (ctx.draft.page1Data["tinhTrangMau"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_input_ngModelChange_45_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(46, "div", 22)(47, "h4", 23);
            i0.ɵɵelement(48, "i", 24);
            i0.ɵɵtext(49, " 7. Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "div", 25);
            i0.ɵɵtemplate(51, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_51_Template, 19, 4, "div", 26);
            i0.ɵɵelementStart(52, "div", 27)(53, "app-sop-calibration-points", 28);
            i0.ɵɵlistener("pointsChanged", function SopTbvtvThucPhamGcmsmsEntryComponent_Template_app_sop_calibration_points_pointsChanged_53_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(54, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_54_Template, 64, 11, "div", 0)(55, SopTbvtvThucPhamGcmsmsEntryComponent_Conditional_55_Template, 51, 3, "div", 0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(8);
            i0.ɵɵclassMap(ctx.draft.page1Data["printFormType"] !== "formRutGon" ? "flex-1 lg:flex-none px-3.5 py-2 text-[11px] font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95" : "flex-1 lg:flex-none px-3.5 py-2 text-[11px] font-bold rounded-lg text-slate-550 hover:text-slate-855 dark:hover:text-slate-250 transition duration-155");
            i0.ɵɵadvance(4);
            i0.ɵɵclassMap(ctx.draft.page1Data["printFormType"] === "formRutGon" ? "flex-1 lg:flex-none px-3.5 py-2 text-[11px] font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95" : "flex-1 lg:flex-none px-3.5 py-2 text-[11px] font-bold rounded-lg text-slate-550 hover:text-slate-855 dark:hover:text-slate-250 transition duration-155");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("title", "Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: " + ((ctx.run == null ? null : ctx.run.sopCode) || "9.14") + ")")("draft", ctx.draft)("checkboxList", ctx.checkboxList);
            i0.ɵɵadvance(8);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["maHoSo"]);
            i0.ɵɵadvance(5);
            i0.ɵɵclassMap(ctx.draft.page1Data["heSoPhaLoang"] === "1" ? "px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95" : "px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["heSoPhaLoang"]);
            i0.ɵɵadvance(5);
            i0.ɵɵclassMap(ctx.draft.page1Data["loaiMau"] === "Th\u1EE7y s\u1EA3n" || ctx.draft.page1Data["loaiMau"] === "Thu\u1EF7 s\u1EA3n" ? "px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95" : "px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["loaiMau"]);
            i0.ɵɵadvance(5);
            i0.ɵɵclassMap(ctx.draft.page1Data["tinhTrangMau"] === "B\u00ECnh th\u01B0\u1EDDng" ? "px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95" : "px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["tinhTrangMau"]);
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.draft.page1Data["printFormType"] === "formRutGon" ? 51 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngClass", ctx.draft.page1Data["printFormType"] === "formRutGon" ? "lg:col-span-7" : "lg:col-span-12");
            i0.ɵɵadvance();
            i0.ɵɵproperty("calibPoints", ctx.draft.page1Data["calibPoints"])("pointLabels", i0.ɵɵpureFunction0(25, _c0))("isSuffixVisible", true)("isFuchsiaRing", true);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.draft.page1Data["printFormType"] !== "formRutGon" ? 54 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.draft.page1Data["printFormType"] === "formRutGon" ? 55 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.CheckboxControlValueAccessor, i2.NgControlStatus, i2.NgModel, SopHeaderMetadataComponent, SopCalibrationPointsComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SopTbvtvThucPhamGcmsmsEntryComponent, [{
        type: Component,
        args: [{ selector: 'app-sop-tbvtv-thuc-pham-gcmsms-entry', standalone: true, imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent], template: "<div class=\"space-y-6 animate-fade-in\">\r\n  <!-- Form Selection Switcher -->\r\n  <div class=\"sticky top-0 z-30 flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-violet-200/70 dark:border-violet-900/40 shadow-sm\">\r\n    <div class=\"min-w-0\">\r\n      <span class=\"block text-[10px] font-black text-violet-650 dark:text-violet-400 uppercase tracking-widest\">D\u1EA1ng nh\u1EADp k\u1EBFt qu\u1EA3 SOP 9.14</span>\r\n      <span class=\"block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5\">\r\n        \u0110\u1EA7y \u0111\u1EE7: bi\u1EC3u m\u1EABu ki\u1EC3m tra t\u1EA5t c\u1EA3 ch\u1EC9 ti\u00EAu \u00B7 R\u00FAt g\u1ECDn: d\u1EA1ng b\u1EA3ng\r\n      </span>\r\n    </div>\r\n\r\n    <div class=\"inline-flex bg-slate-100 dark:bg-slate-955 p-1 rounded-xl border border-slate-200 dark:border-slate-800 select-none items-center shadow-3xs w-full lg:w-auto\">\r\n      <button type=\"button\"\r\n        (click)=\"setPrintFormMode('formDayDu')\"\r\n              [class]=\"draft.page1Data['printFormType'] !== 'formRutGon'\r\n                ? 'flex-1 lg:flex-none px-3.5 py-2 text-[11px] font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95'\r\n                : 'flex-1 lg:flex-none px-3.5 py-2 text-[11px] font-bold rounded-lg text-slate-550 hover:text-slate-855 dark:hover:text-slate-250 transition duration-155'\">\r\n        BI\u1EC2U M\u1EAAU \u0110\u1EA6Y \u0110\u1EE6\r\n        <span class=\"hidden sm:inline font-extrabold opacity-80\">(KI\u1EC2M TRA T\u1EA4T C\u1EA2 CH\u1EC8 TI\u00CAU)</span>\r\n      </button>\r\n      <button type=\"button\"\r\n        (click)=\"setPrintFormMode('formRutGon')\"\r\n              [class]=\"draft.page1Data['printFormType'] === 'formRutGon'\r\n                ? 'flex-1 lg:flex-none px-3.5 py-2 text-[11px] font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95'\r\n                : 'flex-1 lg:flex-none px-3.5 py-2 text-[11px] font-bold rounded-lg text-slate-550 hover:text-slate-855 dark:hover:text-slate-250 transition duration-155'\">\r\n        BI\u1EC2U M\u1EAAU R\u00DAT G\u1ECCN\r\n        <span class=\"hidden sm:inline font-extrabold opacity-80\">(D\u1EA0NG B\u1EA2NG)</span>\r\n      </button>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- 1. Metadata Form & Checkboxes -->\r\n  <app-sop-header-metadata\r\n    [title]=\"'Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: ' + (run?.sopCode || '9.14') + ')'\"\r\n    [draft]=\"draft\"\r\n    [checkboxList]=\"checkboxList\"\r\n    (draftChanged)=\"onDataChanged()\">\r\n\r\n    <!-- SOP 9.14 specific inputs (M\u00E3 h\u1ED3 s\u01A1, H\u1EC7 s\u1ED1 pha lo\u00E3ng, Lo\u1EA1i m\u1EABu, T\u00ECnh tr\u1EA1ng m\u1EABu) -->\r\n    <div sop-metadata-extra class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-indigo-50/15 dark:bg-indigo-955/5 border border-indigo-100/40 dark:border-indigo-950/20 mt-4\">\r\n      <!-- M\u00E3 h\u1ED3 s\u01A1 -->\r\n      <div>\r\n        <label class=\"flex items-center justify-between text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest\">\r\n          <span>1. M\u00E3 h\u1ED3 s\u01A1</span>\r\n          <button type=\"button\"\r\n            (click)=\"autoFillMaHoSo()\"\r\n            class=\"text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors\"\r\n            title=\"T\u1EF1 \u0111\u1ED9ng \u0111i\u1EC1n b\u1EB1ng c\u00E1c m\u1EABu \u0111ang ch\u1ECDn\">\r\n            <i class=\"fa-solid fa-wand-magic-sparkles\"></i>\r\n          </button>\r\n        </label>\r\n        <input type=\"text\"\r\n          [(ngModel)]=\"draft.page1Data['maHoSo']\"\r\n          (ngModelChange)=\"onDataChanged()\"\r\n          placeholder=\"Nh\u1EADp m\u00E3 h\u1ED3 s\u01A1...\"\r\n          class=\"w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm\">\r\n        </div>\r\n\r\n        <!-- H\u1EC7 s\u1ED1 pha lo\u00E3ng -->\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest\">2. H\u1EC7 s\u1ED1 pha lo\u00E3ng (f)</label>\r\n          <div class=\"flex items-center gap-1.5\">\r\n            <button type=\"button\"\r\n              (click)=\"draft.page1Data['heSoPhaLoang'] = '1'; onDataChanged()\"\r\n                  [class]=\"draft.page1Data['heSoPhaLoang'] === '1' \r\n                    ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95' \r\n                    : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n              title=\"Ch\u1ECDn f=1\">\r\n            f=1\r\n          </button>\r\n          <input type=\"text\"\r\n            [(ngModel)]=\"draft.page1Data['heSoPhaLoang']\"\r\n            (ngModelChange)=\"onDataChanged()\"\r\n            placeholder=\"H\u1EC7 s\u1ED1 f...\"\r\n            class=\"w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm\">\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Lo\u1EA1i m\u1EABu -->\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest\">3. Lo\u1EA1i m\u1EABu</label>\r\n          <div class=\"flex items-center gap-1.5\">\r\n            <button type=\"button\"\r\n              (click)=\"draft.page1Data['loaiMau'] = 'Th\u1EE7y s\u1EA3n'; onDataChanged()\"\r\n                  [class]=\"draft.page1Data['loaiMau'] === 'Th\u1EE7y s\u1EA3n' || draft.page1Data['loaiMau'] === 'Thu\u1EF7 s\u1EA3n'\r\n                    ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95' \r\n                    : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n              title=\"Ch\u1ECDn Th\u1EE7y s\u1EA3n\">\r\n            Th\u1EE7y S\u1EA3n\r\n          </button>\r\n          <input type=\"text\"\r\n            [(ngModel)]=\"draft.page1Data['loaiMau']\"\r\n            (ngModelChange)=\"onDataChanged()\"\r\n            placeholder=\"Lo\u1EA1i m\u1EABu...\"\r\n            class=\"w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm\">\r\n          </div>\r\n        </div>\r\n\r\n        <!-- T\u00ECnh tr\u1EA1ng m\u1EABu -->\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest\">4. T\u00ECnh tr\u1EA1ng m\u1EABu</label>\r\n          <div class=\"flex items-center gap-1.5\">\r\n            <button type=\"button\"\r\n              (click)=\"draft.page1Data['tinhTrangMau'] = 'B\u00ECnh th\u01B0\u1EDDng'; onDataChanged()\"\r\n                  [class]=\"draft.page1Data['tinhTrangMau'] === 'B\u00ECnh th\u01B0\u1EDDng'\r\n                    ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95' \r\n                    : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n              title=\"Ch\u1ECDn B\u00ECnh th\u01B0\u1EDDng\">\r\n            B\u00ECnh Th\u01B0\u1EDDng\r\n          </button>\r\n          <input type=\"text\"\r\n            [(ngModel)]=\"draft.page1Data['tinhTrangMau']\"\r\n            (ngModelChange)=\"onDataChanged()\"\r\n            placeholder=\"T\u00ECnh tr\u1EA1ng...\"\r\n            class=\"w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm\">\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </app-sop-header-metadata>\r\n\r\n    <!-- 1.5. Section 7 \u0110\u01B0\u1EDDng chu\u1EA9n -->\r\n    <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in mt-6\">\r\n      <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center\">\r\n        <i class=\"fa-solid fa-chart-line mr-2 text-fuchsia-500 text-sm\"></i> 7. Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n\r\n      </h4>\r\n\r\n      <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-6\">\r\n        @if (draft.page1Data['printFormType'] === 'formRutGon') {\r\n          <div class=\"lg:col-span-5 space-y-3 animate-fade-in\">\r\n            <div class=\"p-4 bg-indigo-50/15 dark:bg-indigo-955/5 border border-indigo-100/40 dark:border-indigo-950/20 rounded-2xl space-y-3 shadow-xs\">\r\n              <h5 class=\"text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5\">\r\n                <i class=\"fa-solid fa-flask-vial\"></i> C\u1EA5u H\u00ECnh M\u1EABu QC & T\u00EAn Tu\u1EF3 Ch\u1EC9nh\r\n              </h5>\r\n              <label class=\"flex items-center gap-2 cursor-pointer py-2 px-3 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 transition select-none shadow-2xs\">\r\n                <input type=\"checkbox\"\r\n                  [(ngModel)]=\"draft.page1Data['hasCheckSample']\"\r\n                  (ngModelChange)=\"onHasCheckSampleChange()\"\r\n                  class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900\">\r\n                <span class=\"text-xs font-bold text-slate-700 dark:text-slate-200\">\u00C1p d\u1EE5ng m\u1EABu CHECK_SAMPLE</span>\r\n              </label>\r\n              <div class=\"grid grid-cols-2 gap-2.5\">\r\n                <div>\r\n                  <label class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider\">T\u00EAn m\u1EABu tr\u1EAFng</label>\r\n                  <input type=\"text\"\r\n                    [(ngModel)]=\"draft.page1Data['blankName']\"\r\n                    (ngModelChange)=\"onDataChanged()\"\r\n                    placeholder=\"BLANK\"\r\n                    class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-xs\">\r\n                  </div>\r\n                  <div>\r\n                    <label class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider\">T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n</label>\r\n                    <input type=\"text\"\r\n                      [(ngModel)]=\"draft.page1Data['spikeName']\"\r\n                      (ngModelChange)=\"onDataChanged()\"\r\n                      placeholder=\"SPIKE\"\r\n                      class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-xs\">\r\n                    </div>\r\n                  </div>\r\n                  @if (draft.page1Data['hasCheckSample']) {\r\n                    <div class=\"animate-fade-in\">\r\n                      <label class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider\">T\u00EAn m\u1EABu ki\u1EC3m tra</label>\r\n                      <input type=\"text\"\r\n                        [(ngModel)]=\"draft.page1Data['checkSampleName']\"\r\n                        (ngModelChange)=\"onDataChanged()\"\r\n                        placeholder=\"CHECK_SAMPLE\"\r\n                        class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-xs\">\r\n                      </div>\r\n                    }\r\n                  </div>\r\n                </div>\r\n              }\r\n\r\n              <!-- Calibration Points Grid -->\r\n              <div class=\"flex flex-col justify-center transition-all duration-300\"\r\n                [ngClass]=\"draft.page1Data['printFormType'] === 'formRutGon' ? 'lg:col-span-7' : 'lg:col-span-12'\">\r\n              <app-sop-calibration-points\r\n                title=\"5 \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)\"\r\n                [calibPoints]=\"draft.page1Data['calibPoints']\"\r\n                [pointLabels]=\"['0 ppb', '5 ppb', '10 ppb', '20 ppb', '50 ppb']\"\r\n                pointPrefix=\"Point C\"\r\n                suffixText=\"IS: 20 ppb\"\r\n                [isSuffixVisible]=\"true\"\r\n                [isFuchsiaRing]=\"true\"\r\n                (pointsChanged)=\"onDataChanged()\">\r\n              </app-sop-calibration-points>\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- TAB 1: FORM \u0110\u1EA6Y \u0110\u1EE6 -->\r\n        @if (draft.page1Data['printFormType'] !== 'formRutGon') {\r\n          <div class=\"space-y-6 animate-fade-in\">\r\n            <!-- 2. Sample Navigation Tabs & Print Configuration -->\r\n            <div class=\"flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 shadow-2xs\">\r\n              <div class=\"flex flex-wrap items-center gap-3 overflow-x-auto custom-scrollbar flex-1 min-w-0\">\r\n                <span class=\"text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mr-1 shrink-0\">Danh s\u00E1ch m\u1EABu:</span>\r\n                <!-- Select All / None Toggle Button -->\r\n                <button (click)=\"toggleSelectAllSamples()\"\r\n                  type=\"button\"\r\n                  class=\"px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-extrabold transition shrink-0 active:scale-95 shadow-2xs\">\r\n                  <i class=\"fa-solid\" [class.fa-check-double]=\"!isAllSamplesSelected()\" [class.fa-minus]=\"isAllSamplesSelected()\"></i>\r\n                  <span class=\"ml-1.5\">{{ isAllSamplesSelected() ? 'B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3' : 'Ch\u1ECDn t\u1EA5t c\u1EA3' }}</span>\r\n                </button>\r\n                @for (sampleCode of run.sampleList; track sampleCode; let idx = $index) {\r\n                  <div class=\"flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-2xs hover:border-slate-350 dark:hover:border-slate-700 transition shrink-0\">\r\n                    <!-- Checkbox to toggle inclusion in PDF -->\r\n                    <input type=\"checkbox\"\r\n                      [ngModel]=\"draft.resultData[sampleCode]['selected'] !== false\"\r\n                      (ngModelChange)=\"toggleSampleSelected(sampleCode, $event)\"\r\n                      title=\"Bao g\u1ED3m m\u1EABu n\u00E0y trong b\u00E1o c\u00E1o in PDF\"\r\n                      class=\"ml-1.5 w-4 h-4 rounded text-violet-650 border-slate-300 dark:border-slate-700 focus:ring-violet-500 cursor-pointer\">\r\n                    <button (click)=\"selectSample(sampleCode)\"\r\n                    [class]=\"activeSampleCode() === sampleCode \r\n                      ? 'bg-violet-600 text-white font-extrabold shadow-sm border border-violet-655 transition shrink-0 active:scale-95' \r\n                      : 'bg-transparent text-slate-655 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800 border-0 transition shrink-0 active:scale-95'\"\r\n                      class=\"px-3 py-2 rounded-lg text-xs flex items-center gap-2\"\r\n                      [class.opacity-50]=\"draft.resultData[sampleCode]['selected'] === false\">\r\n              <span [class]=\"activeSampleCode() === sampleCode\r\n                      ? 'w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white'\r\n                      : 'w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80'\">\r\n                        {{ idx + 1 }}\r\n                      </span>\r\n                      <span class=\"font-mono font-bold\">{{ sampleCode }}</span>\r\n                      @if (publishedSampleSet && publishedSampleSet.has(sampleCode)) {\r\n                        <i class=\"fa-solid fa-circle-check text-emerald-500 text-[10px] ml-1\" title=\"\u0110\u00E3 c\u00F3 b\u00E1o c\u00E1o PDF\"></i>\r\n                      }\r\n                    </button>\r\n                  </div>\r\n                }\r\n              </div>\r\n              <!-- Unified Print Configuration Toggle -->\r\n              <div class=\"flex items-center gap-3 pl-4 md:border-l border-slate-200 dark:border-slate-800 shrink-0\">\r\n                <label class=\"flex items-center gap-2.5 p-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 cursor-not-allowed select-none transition bg-slate-50 dark:bg-slate-900/50 shadow-2xs opacity-80\"\r\n                  title=\"T\u1EF1 \u0111\u1ED9ng t\u00EDnh to\u00E1n d\u1EF1a tr\u00EAn s\u1ED1 l\u01B0\u1EE3ng m\u1EABu \u0111\u01B0\u1EE3c ch\u1ECDn in\">\r\n                  <input type=\"checkbox\"\r\n                    [ngModel]=\"draft.page1Data['checkGopInChung']\"\r\n                    disabled\r\n                    class=\"w-4 h-4 rounded text-violet-650 border-slate-300 dark:border-slate-700 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed\">\r\n                  <div class=\"flex flex-col\">\r\n                    <span class=\"text-xs font-black text-violet-750 dark:text-violet-400 tracking-wide\">G\u1ED9p in chung c\u00E1c m\u1EABu</span>\r\n                    <span class=\"text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5\">T\u1EF1 \u0111\u1ED9ng ({{ (getSelectedSampleCount() > 1) ? 'B\u1EADt v\u00EC ch\u1ECDn > 1 m\u1EABu' : 'T\u1EAFt v\u00EC ch\u1ECDn 1 m\u1EABu' }})</span>\r\n                  </div>\r\n                </label>\r\n              </div>\r\n            </div>\r\n            <!-- 3. Compound Checklist -->\r\n            <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in\">\r\n              <!-- Panel Header -->\r\n              <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5\">\r\n                <div class=\"flex-1 min-w-[200px]\">\r\n                  <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center\">\r\n                    <i class=\"fa-solid fa-flask-vial mr-2 text-violet-500 text-sm\"></i>\r\n                    B\u1EA3ng K\u1EBFt Qu\u1EA3 M\u1EABu: <span class=\"font-mono text-violet-600 dark:text-violet-400 font-extrabold ml-1 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded-lg border border-violet-100 dark:border-violet-900/30\">{{ activeSampleCode() }}</span>\r\n                    <!-- Per-sample Volume Input -->\r\n                    <div class=\"ml-4 flex items-center bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs normal-case\">\r\n                      <span class=\"bg-slate-50 dark:bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800\">m =</span>\r\n                      @if (activeSampleCode() && draft.resultData[activeSampleCode()]) {\r\n                        <input\r\n                          type=\"text\"\r\n                          [(ngModel)]=\"draft.resultData[activeSampleCode()]['khoiLuong']\"\r\n                          (ngModelChange)=\"onDataChanged()\"\r\n                          class=\"w-14 px-1 py-1 text-xs font-black text-indigo-650 dark:text-indigo-400 bg-transparent outline-none text-center focus:bg-indigo-50/50\">\r\n                        }\r\n                        <span class=\"pr-2 pl-1 text-[10px] font-bold text-slate-400 border-l border-slate-100 dark:border-slate-800\">G</span>\r\n                      </div>\r\n                    </h4>\r\n                    <p class=\"text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 tracking-wide\">\r\n                      T\u1ED5ng c\u1ED9ng {{ config.compounds?.length || 0 }} ho\u1EA1t ch\u1EA5t c\u1EA7n ki\u1EC3m nghi\u1EC7m.\r\n                    </p>\r\n                  </div>\r\n                  <!-- Search box -->\r\n                  <div class=\"w-full md:w-64 relative\">\r\n                    <input type=\"text\"\r\n                      [ngModel]=\"searchQuery()\"\r\n                      (ngModelChange)=\"searchQuery.set($event)\"\r\n                      placeholder=\"T\u00ECm ho\u1EA1t ch\u1EA5t...\"\r\n                      class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/15 focus:border-violet-500 transition outline-none\">\r\n                      <i class=\"fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs\"></i>\r\n                    </div>\r\n                    <!-- Bulk Actions for the Selected Sample -->\r\n                    <div class=\"flex flex-wrap items-center gap-2.5\">\r\n                      <span class=\"text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1\">M\u1EABu n\u00E0y:</span>\r\n                      <button (click)=\"sampleBulkFillND()\"\r\n                        type=\"button\"\r\n                        class=\"px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\">\r\n                        <i class=\"fa-solid fa-pen-nib text-amber-500\"></i>\r\n                        <span>\u0110\u1EB7t T\u1EA5t C\u1EA3 ND</span>\r\n                      </button>\r\n                      <button (click)=\"copyActiveSampleToAll()\"\r\n                        type=\"button\"\r\n                        class=\"px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 active:scale-95\"\r\n                        title=\"Sao ch\u00E9p to\u00E0n b\u1ED9 k\u1EBFt qu\u1EA3 c\u1EE7a m\u1EABu \u0111ang hi\u1EC3n th\u1ECB cho t\u1EA5t c\u1EA3 c\u00E1c m\u1EABu kh\u00E1c trong m\u1EBB ch\u1EA1y n\u00E0y\">\r\n                      <i class=\"fa-solid fa-copy\"></i>\r\n                      <span>Sao Ch\u00E9p M\u1EABu cho C\u1EA3 M\u1EBB</span>\r\n                    </button>\r\n                  </div>\r\n                </div>\r\n                <!-- Compound List Table -->\r\n                <div class=\"overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[550px] overflow-y-auto shadow-inner bg-slate-50/30 dark:bg-slate-900/20\">\r\n                  <table class=\"w-full text-sm border-collapse\">\r\n                    <thead>\r\n                      <tr class=\"bg-slate-50 dark:bg-slate-955 border-b border-slate-255/80 dark:border-slate-800 sticky top-0 z-20 shadow-2xs\">\r\n                        <th class=\"py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-16\">STT</th>\r\n                        <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[150px]\">Ho\u1EA1t ch\u1EA5t</th>\r\n                        <th class=\"py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-28\">KPH / ND</th>\r\n                        <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[130px]\">K\u1EBFt qu\u1EA3 (\u00B5g/kg)</th>\r\n                      </tr>\r\n                    </thead>\r\n                    <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800/80\">\r\n                      @for (compound of filteredCompounds(); track compound; let idx = $index) {\r\n              <tr [class]=\"!isTargetAssigned(activeSampleCode(), compound)\r\n                    ? 'bg-slate-50/50 dark:bg-slate-950/20 text-slate-400/80 dark:text-slate-600 transition-all border-l-4 border-l-transparent duration-150'\r\n                    : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-violet-50/10 dark:focus-within:bg-violet-500/5 border-l-4 border-l-transparent focus-within:border-l-violet-500 duration-150'\">\r\n                          <td class=\"py-2.5 px-4 font-mono text-xs text-slate-400 font-bold text-center\">{{ idx + 1 }}</td>\r\n                          <td class=\"py-2.5 px-4 font-extrabold text-xs flex items-center\">\r\n                            @if (!isTargetAssigned(activeSampleCode(), compound)) {\r\n                              <i class=\"fa-solid fa-lock text-[10px] text-slate-400/80 dark:text-slate-600 mr-1.5\" title=\"Kh\u00F4ng thu\u1ED9c ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m c\u1EE7a m\u1EABu n\u00E0y\"></i>\r\n                              <span class=\"text-slate-400 dark:text-slate-550 line-through decoration-slate-250 dark:decoration-slate-800/60\">{{ compoundDisplayNames()[compound] || compound }}</span>\r\n                            } @else {\r\n                              <span class=\"text-slate-700 dark:text-slate-200\">{{ compoundDisplayNames()[compound] || compound }}</span>\r\n                            }\r\n                          </td>\r\n                          <!-- ND Checkbox -->\r\n                          <td class=\"py-2.5 px-4 text-center\">\r\n                            <input type=\"checkbox\"\r\n                              [disabled]=\"!isTargetAssigned(activeSampleCode(), compound)\"\r\n                              [(ngModel)]=\"draft.resultData[activeSampleCode()][compound + '_nd']\"\r\n                              (ngModelChange)=\"onNdCheckboxChanged(compound)\"\r\n                              class=\"w-4 h-4 rounded text-violet-650 border-slate-355 dark:border-slate-700 focus:ring-violet-500 dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed\">\r\n                          </td>\r\n                          <!-- Result Input -->\r\n                          <td class=\"py-1.5 px-2\">\r\n                            <input type=\"text\"\r\n                              [disabled]=\"!isTargetAssigned(activeSampleCode(), compound)\"\r\n                              [(ngModel)]=\"draft.resultData[activeSampleCode()][compound]\"\r\n                              (ngModelChange)=\"onResultInputChanged(compound)\"\r\n                              placeholder=\"ND / S\u1ED1 l\u01B0\u1EE3ng...\"\r\n                              class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-center shadow-inner disabled:bg-slate-100/50 dark:disabled:bg-slate-900/30 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-slate-100 dark:disabled:border-slate-850 disabled:cursor-not-allowed\">\r\n                            </td>\r\n                          </tr>\r\n                        }\r\n                      </tbody>\r\n                    </table>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            }\r\n\r\n            <!-- TAB 2: FORM R\u00DAT G\u1ECCN (L\u01B0\u1EDBi nh\u1EADp spreadsheet) -->\r\n            @if (draft.page1Data['printFormType'] === 'formRutGon') {\r\n              <div class=\"space-y-6 animate-fade-in\">\r\n                <!-- Grid Sample Spreadsheet & Bulk Actions -->\r\n                <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4\">\r\n                  <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5\">\r\n                    <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5\">\r\n                      <i class=\"fa-solid fa-table-cells mr-1 text-fuchsia-500 text-sm\"></i> L\u01B0\u1EDBi Nh\u1EADp K\u1EBFt Qu\u1EA3 (SOP 9.14 Spreadsheet)\r\n                    </h4>\r\n                    <div class=\"flex flex-wrap items-center gap-3\">\r\n                      <span class=\"text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1\">Thao t\u00E1c nhanh:</span>\r\n                    <button (click)=\"bulkFillND()\"\r\n                      class=\"px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\"\r\n                      title=\"\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND\">\r\n                      <i class=\"fa-solid fa-pen-clip text-amber-500\"></i>\r\n                      <span>\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng</span>\r\n                    </button>\r\n                    <button (click)=\"bulkClearAll()\"\r\n                      class=\"px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-rose-50 dark:hover:bg-rose-955/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\"\r\n                      title=\"X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng\">\r\n                      <i class=\"fa-solid fa-trash-can text-rose-500\"></i>\r\n                      <span>X\u00F3a H\u1EBFt B\u1EA3ng</span>\r\n                    </button>\r\n                    <!-- Quick Vial Rack Input for SOP 9.14 -->\r\n                    <div class=\"flex items-center gap-2 bg-indigo-50/15 dark:bg-indigo-955/5 border border-indigo-100/40 dark:border-indigo-950/20 rounded-2xl px-3.5 py-1.5 text-xs shadow-2xs\">\r\n                      <span class=\"font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest\">Nh\u1EADp nhanh s\u1ED1 l\u1ECD:</span>\r\n                      <div class=\"flex items-center gap-1.5\">\r\n                        <span class=\"text-slate-450 dark:text-slate-500 font-bold\">Rack:</span>\r\n                        <input type=\"number\"\r\n                          [(ngModel)]=\"bulkRackStart\"\r\n                          title=\"Khay ch\u1EA1y m\u00E1y (Rack)\"\r\n                          placeholder=\"Rack\"\r\n                          class=\"w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-inner\">\r\n                        </div>\r\n                        <div class=\"flex items-center gap-1.5\">\r\n                          <span class=\"text-slate-450 dark:text-slate-500 font-bold\">Vial \u0111\u1EA7u:</span>\r\n                          <input type=\"number\"\r\n                            [(ngModel)]=\"bulkVialStartFip\"\r\n                            title=\"Vial b\u1EAFt \u0111\u1EA7u\"\r\n                            placeholder=\"Vial\"\r\n                            class=\"w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-inner\">\r\n                          </div>\r\n                          <div class=\"flex items-center gap-1.5\">\r\n                            <span class=\"text-slate-450 dark:text-slate-500 font-bold\">Size:</span>\r\n                            <input type=\"number\"\r\n                              [(ngModel)]=\"bulkVialsPerRack\"\r\n                              title=\"S\u1ED1 \u1ED1ng vial t\u1ED1i \u0111a tr\u00EAn m\u1ED9t khay (Rack)\"\r\n                              placeholder=\"T\u1ED1i \u0111a\"\r\n                              class=\"w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-inner\">\r\n                            </div>\r\n                            <button (click)=\"applyBulkVials()\"\r\n                              class=\"px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold transition shadow-sm flex items-center gap-1 active:scale-95\"\r\n                              title=\"\u0110i\u1EC1n t\u1EF1 \u0111\u1ED9ng s\u1ED1 khay v\u00E0 vial cho to\u00E0n b\u1ED9 danh s\u00E1ch m\u1EABu\">\r\n                            <i class=\"fa-solid fa-magic text-[10px]\"></i>\r\n                            <span>\u0110i\u1EC1n Nhanh</span>\r\n                          </button>\r\n                        </div>\r\n                      </div>\r\n                    </div>\r\n                    <!-- Spreadsheet Table Grid -->\r\n                    <div class=\"overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[550px] overflow-y-auto\">\r\n                      <table class=\"w-full text-sm border-collapse\">\r\n                        <thead>\r\n                          <tr class=\"bg-slate-50 dark:bg-slate-955 border-b border-slate-250/80 dark:border-slate-800 sticky top-0 z-20 shadow-2xs\">\r\n                            <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-24\">Vial No.</th>\r\n                            <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[140px]\">M\u1EABu th\u1EED</th>\r\n                            <!-- Dynamic active columns -->\r\n                            @for (col of activeColumns; track col) {\r\n                              <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[130px]\">\r\n                                {{ columnDisplayNames()[col] || col }} (\u00B5g/kg)\r\n                              </th>\r\n                            }\r\n                            <th class=\"py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-28\">H\u00E0nh \u0111\u1ED9ng</th>\r\n                          </tr>\r\n                        </thead>\r\n                        <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800/80\">\r\n                          @for (row of getDisplayRowsForSpreadsheet(); track row.key; let rowIdx = $index) {\r\n                            @if (draft.resultData[row.key]) {\r\n                <tr [class]=\"row.isQC \r\n                      ? 'bg-amber-50/15 dark:bg-amber-955/5 border-l-4 border-l-amber-500/80 hover:bg-amber-50/25 dark:hover:bg-amber-955/10 transition-colors' \r\n                      : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 duration-150'\">\r\n                                <!-- Vial No input cell -->\r\n                                <td class=\"py-1.5 px-3 w-24\">\r\n                                  <input type=\"text\"\r\n                                    [(ngModel)]=\"draft.resultData[row.key]['loSo']\"\r\n                                    (ngModelChange)=\"onDataChanged()\"\r\n                                    [id]=\"'cell-' + rowIdx + '-loSo'\"\r\n                                    (keydown)=\"handleGridNavigation($event, rowIdx, 'loSo', 0)\"\r\n                                    (focus)=\"$any($event.target).select()\"\r\n                                    placeholder=\"...\"\r\n                                    class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none text-center shadow-inner\">\r\n                                  </td>\r\n                                  <!-- Sample/QC Identifier with tag styling -->\r\n                                  <td class=\"py-2.5 px-4 font-mono font-extrabold text-xs text-slate-700 dark:text-slate-300 break-all\">\r\n                                    @if (row.isQC) {\r\n                                      <span class=\"inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400\">\r\n                                        <i class=\"fa-solid fa-flask text-[10px]\"></i> {{ row.label }}\r\n                                      </span>\r\n                                    } @else {\r\n                                      <span>{{ row.label }}</span>\r\n                                    }\r\n                                  </td>\r\n                                  <!-- Dynamic active columns inputs -->\r\n                                  @for (col of activeColumns; track col; let colIdx = $index) {\r\n                                    <td class=\"py-1.5 px-2\">\r\n                                      <input type=\"text\"\r\n                                        [(ngModel)]=\"draft.resultData[row.key][col]\"\r\n                                        (ngModelChange)=\"onCellChanged(row.key)\"\r\n                                        [id]=\"'cell-' + rowIdx + '-' + col\"\r\n                                        [disabled]=\"!isTargetAssigned(row.key, col)\"\r\n                                        (keydown)=\"handleGridNavigation($event, rowIdx, col, colIdx + 1)\"\r\n                                        (focus)=\"$any($event.target).select()\"\r\n                                        placeholder=\"...\"\r\n                                        class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none text-center shadow-inner disabled:bg-slate-105 dark:disabled:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed\">\r\n                                      </td>\r\n                                    }\r\n                                    <!-- Quick Row actions / Badges -->\r\n                                    <td class=\"py-1.5 px-4 text-center\">\r\n                                      @if (row.isQC) {\r\n                                        <span class=\"inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 dark:bg-amber-400/5 dark:text-amber-400 border border-amber-500/20\">\r\n                                          QC Active\r\n                                        </span>\r\n                                      } @else {\r\n                                        <button (click)=\"copyRowToAll(row.key)\"\r\n                                          class=\"p-1.5 bg-slate-50 hover:bg-fuchsia-600 dark:bg-slate-855 dark:hover:bg-fuchsia-600 text-slate-500 hover:text-white dark:text-slate-400 rounded-lg text-[10px] font-bold transition border border-slate-200 dark:border-slate-800 active:scale-90\"\r\n                                          title=\"Sao ch\u00E9p k\u1EBFt qu\u1EA3 c\u1EE7a d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng c\u00F2n l\u1EA1i\">\r\n                                        <i class=\"fa-solid fa-copy\"></i>\r\n                                      </button>\r\n                                    }\r\n                                  </td>\r\n                                </tr>\r\n                              }\r\n                            }\r\n                          </tbody>\r\n                        </table>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                }\r\n\r\n              </div>\r\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SopTbvtvThucPhamGcmsmsEntryComponent, { className: "SopTbvtvThucPhamGcmsmsEntryComponent", filePath: "src/app/features/results/sops/sop-tbvtv-thuc-pham-gcmsms/sop-tbvtv-thuc-pham-gcmsms-entry.component.ts", lineNumber: 22 }); })();
//# sourceMappingURL=sop-tbvtv-thuc-pham-gcmsms-entry.component.js.map