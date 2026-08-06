import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { calculateSop03Recovery } from './sop-03-engine';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName } from '../../shared/compound-id-resolver';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { bulkFillND, bulkClearAll, copyRowToAll, navigateGrid } from '../shared/sop-grid-helper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
function Sop03EntryComponent_For_77_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 46);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const col_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.columnDisplayNames()[col_r1] || col_r1, " (\u00B5g/kg) ");
} }
function Sop03EntryComponent_For_84_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 50)(1, "td", 53);
    i0.ɵɵelement(2, "input", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 55)(4, "input", 56);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_0_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData["QC_BLANK"]["loSo"], $event) || (ctx_r1.draft.resultData["QC_BLANK"]["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_0_Template_input_ngModelChange_4_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function Sop03EntryComponent_For_84_Conditional_0_Template_input_focus_4_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "td", 57)(6, "span", 58);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 59)(9, "input", 60);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_0_Template_input_ngModelChange_9_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData["QC_BLANK"]["kqTrifluralin"], $event) || (ctx_r1.draft.resultData["QC_BLANK"]["kqTrifluralin"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_0_Template_input_ngModelChange_9_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCellChanged("QC_BLANK")); })("keydown", function Sop03EntryComponent_For_84_Conditional_0_Template_input_keydown_9_listener($event) { i0.ɵɵrestoreView(_r3); const ɵ$index_148_r4 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_148_r4, "kqTrifluralin", 3)); })("focus", function Sop03EntryComponent_For_84_Conditional_0_Template_input_focus_9_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "td", 59)(11, "input", 61);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_0_Template_input_ngModelChange_11_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData["QC_BLANK"]["ghiChu"], $event) || (ctx_r1.draft.resultData["QC_BLANK"]["ghiChu"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_0_Template_input_ngModelChange_11_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function Sop03EntryComponent_For_84_Conditional_0_Template_input_focus_11_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "td", 62)(13, "span", 63);
    i0.ɵɵtext(14, "BLANK");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ɵ$index_148_r4 = i0.ɵɵnextContext().$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData["QC_BLANK"]["loSo"]);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.draft.page1Data["blankName"] || "Blank");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData["QC_BLANK"]["kqTrifluralin"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_148_r4 + "-kqTrifluralin");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData["QC_BLANK"]["ghiChu"]);
} }
function Sop03EntryComponent_For_84_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 50)(1, "td", 53);
    i0.ɵɵelement(2, "input", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 55)(4, "input", 56);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_1_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData["QC_SPIKE"]["loSo"], $event) || (ctx_r1.draft.resultData["QC_SPIKE"]["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_1_Template_input_ngModelChange_4_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function Sop03EntryComponent_For_84_Conditional_1_Template_input_focus_4_listener($event) { i0.ɵɵrestoreView(_r5); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "td", 57)(6, "span", 58);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 59)(9, "input", 60);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_1_Template_input_ngModelChange_9_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData["QC_SPIKE"]["kqTrifluralin"], $event) || (ctx_r1.draft.resultData["QC_SPIKE"]["kqTrifluralin"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_1_Template_input_ngModelChange_9_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCellChanged("QC_SPIKE")); })("keydown", function Sop03EntryComponent_For_84_Conditional_1_Template_input_keydown_9_listener($event) { i0.ɵɵrestoreView(_r5); const ɵ$index_148_r4 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_148_r4, "kqTrifluralin", 3)); })("focus", function Sop03EntryComponent_For_84_Conditional_1_Template_input_focus_9_listener($event) { i0.ɵɵrestoreView(_r5); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "td", 59)(11, "input", 65);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_1_Template_input_ngModelChange_11_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData["QC_SPIKE"]["ghiChu"], $event) || (ctx_r1.draft.resultData["QC_SPIKE"]["ghiChu"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_1_Template_input_ngModelChange_11_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function Sop03EntryComponent_For_84_Conditional_1_Template_input_focus_11_listener($event) { i0.ɵɵrestoreView(_r5); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "td", 62)(13, "span", 63);
    i0.ɵɵtext(14, "SPIKE");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ɵ$index_148_r4 = i0.ɵɵnextContext().$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData["QC_SPIKE"]["loSo"]);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.draft.page1Data["spikeName"] || "Spike");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData["QC_SPIKE"]["kqTrifluralin"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_148_r4 + "-kqTrifluralin");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData["QC_SPIKE"]["ghiChu"]);
} }
function Sop03EntryComponent_For_84_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 51)(1, "td", 53);
    i0.ɵɵelement(2, "input", 66);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 55);
    i0.ɵɵelement(4, "input", 67);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 68);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td", 59)(8, "input", 69);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_2_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r6); const row_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r7.key]["kqTrifluralin"], $event) || (ctx_r1.draft.resultData[row_r7.key]["kqTrifluralin"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_2_Template_input_ngModelChange_8_listener() { i0.ɵɵrestoreView(_r6); const row_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCellChanged(row_r7.key)); })("keydown", function Sop03EntryComponent_For_84_Conditional_2_Template_input_keydown_8_listener($event) { i0.ɵɵrestoreView(_r6); const ɵ$index_148_r4 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_148_r4, "kqTrifluralin", 3)); })("focus", function Sop03EntryComponent_For_84_Conditional_2_Template_input_focus_8_listener($event) { i0.ɵɵrestoreView(_r6); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td", 59)(10, "input", 70);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_2_Template_input_ngModelChange_10_listener($event) { i0.ɵɵrestoreView(_r6); const row_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r7.key]["ghiChu"], $event) || (ctx_r1.draft.resultData[row_r7.key]["ghiChu"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_2_Template_input_ngModelChange_10_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("focus", function Sop03EntryComponent_For_84_Conditional_2_Template_input_focus_10_listener($event) { i0.ɵɵrestoreView(_r6); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "td", 62)(12, "span", 63);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r7 = i0.ɵɵnextContext();
    const row_r7 = ctx_r7.$implicit;
    const ɵ$index_148_r4 = ctx_r7.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r1.draft.resultData["QC_SPIKE"] ? ctx_r1.draft.resultData["QC_SPIKE"]["loSo"] : "2");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", row_r7.label, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r7.key]["kqTrifluralin"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_148_r4 + "-kqTrifluralin");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r7.key]["ghiChu"]);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("QC ", row_r7.label, "");
} }
function Sop03EntryComponent_For_84_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 71)(1, "td", 53)(2, "input", 72);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_3_Template_input_ngModelChange_2_listener($event) { i0.ɵɵrestoreView(_r9); const row_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r7.key]["selected"], $event) || (ctx_r1.draft.resultData[row_r7.key]["selected"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_3_Template_input_ngModelChange_2_listener() { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(3, "td", 55)(4, "input", 73);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_3_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r9); const row_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r7.key]["loSo"], $event) || (ctx_r1.draft.resultData[row_r7.key]["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_3_Template_input_ngModelChange_4_listener() { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function Sop03EntryComponent_For_84_Conditional_3_Template_input_keydown_4_listener($event) { i0.ɵɵrestoreView(_r9); const ɵ$index_148_r4 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_148_r4, "loSo", 1)); })("focus", function Sop03EntryComponent_For_84_Conditional_3_Template_input_focus_4_listener($event) { i0.ɵɵrestoreView(_r9); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "td", 74);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td", 59)(8, "input", 75);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_3_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r9); const row_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r7.key]["kqTrifluralin"], $event) || (ctx_r1.draft.resultData[row_r7.key]["kqTrifluralin"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_3_Template_input_ngModelChange_8_listener() { i0.ɵɵrestoreView(_r9); const row_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCellChanged(row_r7.key)); })("keydown", function Sop03EntryComponent_For_84_Conditional_3_Template_input_keydown_8_listener($event) { i0.ɵɵrestoreView(_r9); const ɵ$index_148_r4 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_148_r4, "kqTrifluralin", 3)); })("focus", function Sop03EntryComponent_For_84_Conditional_3_Template_input_focus_8_listener($event) { i0.ɵɵrestoreView(_r9); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td", 59)(10, "input", 76);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_3_Template_input_ngModelChange_10_listener($event) { i0.ɵɵrestoreView(_r9); const row_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r7.key]["ghiChu"], $event) || (ctx_r1.draft.resultData[row_r7.key]["ghiChu"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_For_84_Conditional_3_Template_input_ngModelChange_10_listener() { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function Sop03EntryComponent_For_84_Conditional_3_Template_input_keydown_10_listener($event) { i0.ɵɵrestoreView(_r9); const ɵ$index_148_r4 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_148_r4, "ghiChu", 4)); })("focus", function Sop03EntryComponent_For_84_Conditional_3_Template_input_focus_10_listener($event) { i0.ɵɵrestoreView(_r9); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "td", 62)(12, "button", 77);
    i0.ɵɵlistener("click", function Sop03EntryComponent_For_84_Conditional_3_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r9); const row_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyRowToAll(row_r7.key)); });
    i0.ɵɵelement(13, "i", 78);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r7 = i0.ɵɵnextContext();
    const row_r7 = ctx_r7.$implicit;
    const ɵ$index_148_r4 = ctx_r7.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("opacity-60", ctx_r1.draft.resultData[row_r7.key]["selected"] === false);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r7.key]["selected"]);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r7.key]["loSo"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_148_r4 + "-loSo");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r7.key);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r7.key]["kqTrifluralin"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_148_r4 + "-kqTrifluralin");
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r7.key]["ghiChu"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_148_r4 + "-ghiChu");
} }
function Sop03EntryComponent_For_84_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, Sop03EntryComponent_For_84_Conditional_0_Template, 15, 5, "tr", 50)(1, Sop03EntryComponent_For_84_Conditional_1_Template, 15, 5, "tr", 50)(2, Sop03EntryComponent_For_84_Conditional_2_Template, 14, 6, "tr", 51)(3, Sop03EntryComponent_For_84_Conditional_3_Template, 14, 10, "tr", 52);
} if (rf & 2) {
    const row_r7 = ctx.$implicit;
    i0.ɵɵconditional(row_r7.type === "QC_BLANK" ? 0 : row_r7.type === "QC_SPIKE" ? 1 : row_r7.type === "QC_SPIKE_N" || row_r7.type === "QC_FINAL" ? 2 : row_r7.type === "REGULAR" ? 3 : -1);
} }
export class Sop03EntryComponent {
    constructor() {
        this.isReadOnly = false;
        this.publishedSampleSet = null;
        this.activeFilter = 'ALL';
        this.draftChanged = new EventEmitter();
        this.masterTargetService = inject(MasterTargetService);
        this.masterTargets = signal([]);
        this.columnDisplayNames = signal({});
        this.activeColumns = [];
        this.checkboxList = [];
        // Bulk vial properties
        this.bulkVialStart = 1;
        this.bulkVialEnd = 1;
        this.bulkCalibVialStart = 41;
        this.bulkCalibVialEnd = 46;
    }
    getStats() {
        const regularSamples = this.getVisibleRegularSamples();
        const totalCount = regularSamples.length;
        const selectedCount = regularSamples.filter(s => this.draft.resultData[s]['selected'] !== false).length;
        // Fill progress (leaving blank means ND, which is a completed result)
        let filledCount = 0;
        regularSamples.forEach(s => {
            const row = this.draft.resultData[s];
            if (row && row['selected'] !== false) {
                filledCount++;
            }
        });
        const progressPct = selectedCount > 0 ? Math.round((filledCount / selectedCount) * 100) : 0;
        // Spike Recovery
        const spikeRow = this.draft.resultData['QC_SPIKE'];
        let spikeRecovery = 'Chưa có';
        let spikeRecoveryVal = 0;
        if (spikeRow && spikeRow['kqTrifluralin']) {
            const val = parseFloat(spikeRow['kqTrifluralin']);
            if (!isNaN(val)) {
                spikeRecoveryVal = val * 100;
                spikeRecovery = `${spikeRecoveryVal.toFixed(1)}%`;
            }
        }
        // R2 Linearity
        const r2Val = this.draft.page1Data['r2'] || '';
        const r2Float = parseFloat(r2Val);
        const r2Status = !isNaN(r2Float) ? (r2Float >= 0.995 ? 'VALID' : 'WARNING') : 'NOT_SET';
        return {
            totalCount,
            selectedCount,
            filledCount,
            progressPct,
            spikeRecovery,
            spikeRecoveryVal,
            r2Val,
            r2Status
        };
    }
    async ngOnInit() {
        try {
            const analytes = await this.masterTargetService.getAll();
            this.masterTargets.set(analytes);
        }
        catch (e) {
            console.warn('Failed to load master analytes', e);
        }
        const cols = Object.keys(this.config.columns || {});
        this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
        this.buildColumnDisplayNames();
        if (this.config.checkboxLines) {
            this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
                key: key,
                label
            }));
        }
        // Đảm bảo các trường dữ liệu cần thiết của Trifluralin luôn được khởi tạo
        if (!this.draft.page1Data)
            this.draft.page1Data = {};
        const existingCalibPoints = this.draft.page1Data['calibPoints'];
        if (!existingCalibPoints || existingCalibPoints.length === 0) {
            this.draft.page1Data['calibPoints'] = [
                { loSo: 'C0', vialNo: '41', hamLuong: '0' },
                { loSo: 'C1', vialNo: '42', hamLuong: '0.5' },
                { loSo: 'C2', vialNo: '43', hamLuong: '1.0' },
                { loSo: 'C3', vialNo: '44', hamLuong: '5.0' },
                { loSo: 'C4', vialNo: '45', hamLuong: '10.0' },
                { loSo: 'C5', vialNo: '46', hamLuong: '30.0' }
            ];
        }
        else {
            // Migration dữ liệu cũ
            existingCalibPoints.forEach((pt, idx) => {
                if (!pt.vialNo) {
                    if (/^\d+$/.test(String(pt.loSo || ''))) {
                        pt.vialNo = pt.loSo;
                    }
                }
                if (!pt.loSo || /^\d+$/.test(String(pt.loSo))) {
                    pt.loSo = `C${idx}`;
                }
            });
        }
        if (this.draft.page1Data['r2'] === undefined || this.draft.page1Data['r2'] === '') {
            this.draft.page1Data['r2'] = '0.999';
        }
        if (this.draft.page1Data['blankName'] === undefined) {
            this.draft.page1Data['blankName'] = '';
        }
        if (this.draft.page1Data['spikeName'] === undefined) {
            this.draft.page1Data['spikeName'] = '';
        }
        if (!this.draft.resultData)
            this.draft.resultData = {};
        if (!this.draft.resultData['QC_BLANK']) {
            this.draft.resultData['QC_BLANK'] = { loSo: '47', kqTrifluralin: 'ND', ghiChu: '', selected: true };
        }
        else {
            if (!this.draft.resultData['QC_BLANK']['loSo'])
                this.draft.resultData['QC_BLANK']['loSo'] = '47';
            if (!this.draft.resultData['QC_BLANK']['kqTrifluralin'])
                this.draft.resultData['QC_BLANK']['kqTrifluralin'] = 'ND';
        }
        if (!this.draft.resultData['QC_SPIKE']) {
            this.draft.resultData['QC_SPIKE'] = { loSo: '48', kqTrifluralin: '', ghiChu: '', selected: true };
        }
        else {
            if (!this.draft.resultData['QC_SPIKE']['loSo'])
                this.draft.resultData['QC_SPIKE']['loSo'] = '48';
        }
        // Ensure all prefix-specific FINAL keys are initialized in resultData
        const prefixes = new Set();
        (this.run.sampleList || []).forEach((sample) => {
            const startsWithLetter = /^[a-zA-Z]/.test(sample);
            const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
            prefixes.add(prefix);
        });
        prefixes.add(''); // Include main final key
        // Look for any existing non-empty final result to use as source
        let existingFinal = null;
        for (const p of Array.from(prefixes)) {
            const k = `QC_FINAL_QC_${p}`;
            if (this.draft.resultData[k] && (this.draft.resultData[k]['kqTrifluralin'] || this.draft.resultData[k]['ghiChu'])) {
                existingFinal = this.draft.resultData[k];
                break;
            }
        }
        const defaultLoSo = this.draft.resultData['QC_SPIKE']?.['loSo'] || '48';
        prefixes.forEach(p => {
            const key = `QC_FINAL_QC_${p}`;
            if (!this.draft.resultData[key]) {
                this.draft.resultData[key] = {
                    loSo: existingFinal?.['loSo'] || defaultLoSo,
                    kqTrifluralin: existingFinal?.['kqTrifluralin'] || '',
                    ghiChu: existingFinal?.['ghiChu'] || '',
                    selected: existingFinal?.['selected'] !== false
                };
            }
            else {
                if (!this.draft.resultData[key]['loSo']) {
                    this.draft.resultData[key]['loSo'] = existingFinal?.['loSo'] || defaultLoSo;
                }
                if (this.draft.resultData[key]['kqTrifluralin'] === undefined) {
                    this.draft.resultData[key]['kqTrifluralin'] = existingFinal?.['kqTrifluralin'] || '';
                }
                if (this.draft.resultData[key]['ghiChu'] === undefined) {
                    this.draft.resultData[key]['ghiChu'] = existingFinal?.['ghiChu'] || '';
                }
                if (this.draft.resultData[key]['selected'] === undefined) {
                    this.draft.resultData[key]['selected'] = existingFinal?.['selected'] !== false;
                }
            }
        });
        const calPoints = this.draft.page1Data['calibPoints'];
        if (calPoints && calPoints.length > 0) {
            const firstVial = calPoints[0]?.vialNo || calPoints[0]?.loSo;
            this.bulkCalibVialStart = parseInt(String(firstVial), 10) || 41;
        }
        else {
            this.bulkCalibVialStart = 41;
        }
        this.onBulkCalibVialStartChange();
        this.syncSpreadsheetVialsFromCalibration();
        this.onBulkVialStartChange();
        // Áp dụng số vial bắt đầu từ 1 cho các mẫu nếu chưa được khởi tạo
        const samples = this.getVisibleRegularSamples();
        const needsInit = samples.some(s => !this.draft.resultData[s] || !this.draft.resultData[s]['loSo']);
        if (needsInit) {
            this.applyBulkVials();
        }
    }
    onBulkVialStartChange() {
        const start = parseInt(String(this.bulkVialStart), 10);
        if (!isNaN(start)) {
            const count = this.getVisibleRegularSamples().length;
            this.bulkVialEnd = start + Math.max(0, count - 1);
        }
    }
    onBulkCalibVialStartChange() {
        const start = parseInt(String(this.bulkCalibVialStart), 10);
        if (!isNaN(start)) {
            this.bulkCalibVialEnd = start + 5;
        }
    }
    applyCalibVials() {
        const start = parseInt(String(this.bulkCalibVialStart), 10);
        if (isNaN(start))
            return;
        const calibPoints = this.draft.page1Data['calibPoints'];
        if (calibPoints && calibPoints.length > 0) {
            calibPoints.forEach((pt, idx) => {
                pt['vialNo'] = String(start + idx); // Điền số vial, giữ tên điểm loSo
            });
            this.syncSpreadsheetVialsFromCalibration();
            this.onDataChanged();
        }
    }
    syncSpreadsheetVialsFromCalibration() {
        const calibPoints = this.draft.page1Data['calibPoints'];
        if (!calibPoints || calibPoints.length === 0)
            return;
        // Đọc số vial từ vialNo. Fallback loSo nếu là số (dữ liệu cũ)
        const lastPt = calibPoints[calibPoints.length - 1];
        const lastVialStr = lastPt?.vialNo || ((/^\d+$/.test(String(lastPt?.loSo || ''))) ? lastPt?.loSo : undefined);
        const lastCalibVial = parseInt(String(lastVialStr), 10);
        if (isNaN(lastCalibVial))
            return;
        if (this.draft.resultData['QC_BLANK']) {
            this.draft.resultData['QC_BLANK']['loSo'] = String(lastCalibVial + 1);
        }
        if (this.draft.resultData['QC_SPIKE']) {
            this.draft.resultData['QC_SPIKE']['loSo'] = String(lastCalibVial + 2);
        }
        const prefixes = new Set();
        (this.run.sampleList || []).forEach((sample) => {
            const startsWithLetter = /^[a-zA-Z]/.test(sample);
            const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
            prefixes.add(prefix);
        });
        prefixes.add('');
        prefixes.forEach(p => {
            const key = `QC_FINAL_QC_${p}`;
            if (this.draft.resultData[key]) {
                this.draft.resultData[key]['loSo'] = String(lastCalibVial + 2);
            }
        });
    }
    onCalibrationPointsChanged() {
        this.syncSpreadsheetVialsFromCalibration();
        this.onDataChanged();
    }
    getVisibleRegularSamples() {
        return this.run.sampleList || [];
    }
    isAllSelected() {
        const visible = this.getVisibleRegularSamples();
        if (visible.length === 0)
            return false;
        return visible.every(s => this.draft.resultData[s]['selected'] !== false);
    }
    toggleSelectAll(event) {
        const checked = event.target.checked;
        const visible = this.getVisibleRegularSamples();
        visible.forEach(s => {
            if (!this.draft.resultData[s]) {
                this.draft.resultData[s] = {};
            }
            this.draft.resultData[s]['selected'] = checked;
        });
        this.onDataChanged();
    }
    applyBulkVials() {
        const start = parseInt(String(this.bulkVialStart), 10);
        const end = parseInt(String(this.bulkVialEnd), 10);
        if (isNaN(start) || isNaN(end) || start > end) {
            return;
        }
        const visible = this.getVisibleRegularSamples();
        visible.forEach((sample, idx) => {
            const val = start + idx;
            if (val <= end) {
                if (!this.draft.resultData[sample]) {
                    this.draft.resultData[sample] = {
                        loSo: '',
                        kqTrifluralin: '',
                        ghiChu: '',
                        selected: true
                    };
                }
                this.draft.resultData[sample]['loSo'] = String(val);
            }
        });
        this.onDataChanged();
    }
    getCompoundDisplayName(compound) {
        return resolveCompoundDisplayName(compound, this.masterTargets(), this.config?.id || this.run?.sopId);
    }
    formatColumnName(colKey) {
        const customNames = {
            'kqTrifluralin': 'Trifluralin'
        };
        const defaultName = customNames[colKey] || colKey;
        return this.getCompoundDisplayName(defaultName);
    }
    buildColumnDisplayNames() {
        const map = {};
        for (const col of this.activeColumns) {
            map[col] = this.formatColumnName(col);
        }
        this.columnDisplayNames.set(map);
    }
    onDataChanged() {
        if (this.isReadOnly)
            return;
        this.syncQcValues();
        this.draftChanged.emit(this.draft);
    }
    syncQcValues() {
        if (!this.draft || !this.draft.resultData)
            return;
        const allFinalKey = `QC_FINAL_QC_`;
        const sourceFinal = this.draft.resultData[allFinalKey];
        if (sourceFinal) {
            const prefixes = new Set();
            (this.run.sampleList || []).forEach((sample) => {
                const startsWithLetter = /^[a-zA-Z]/.test(sample);
                const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
                prefixes.add(prefix);
            });
            prefixes.add(''); // ensure allFinalKey is covered
            prefixes.forEach(p => {
                const key = `QC_FINAL_QC_${p}`;
                if (key !== allFinalKey) {
                    if (!this.draft.resultData[key]) {
                        this.draft.resultData[key] = {};
                    }
                    this.draft.resultData[key]['loSo'] = sourceFinal['loSo'] || '';
                    this.draft.resultData[key]['kqTrifluralin'] = sourceFinal['kqTrifluralin'] || '';
                    this.draft.resultData[key]['ghiChu'] = sourceFinal['ghiChu'] || '';
                    this.draft.resultData[key]['selected'] = sourceFinal['selected'] !== false;
                }
            });
        }
    }
    onCellChanged(sampleCode) {
        this.updateRecovery(sampleCode);
        if (sampleCode.startsWith('QC_FINAL_QC_')) {
            this.propagateFinalQc(sampleCode);
        }
        this.onDataChanged();
    }
    propagateFinalQc(sourceKey) {
        const source = this.draft.resultData[sourceKey];
        if (!source)
            return;
        const prefixes = new Set();
        (this.run.sampleList || []).forEach((sample) => {
            const startsWithLetter = /^[a-zA-Z]/.test(sample);
            const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
            prefixes.add(prefix);
        });
        prefixes.add(''); // ensure main final key is included
        prefixes.forEach(p => {
            const key = `QC_FINAL_QC_${p}`;
            if (key !== sourceKey) {
                if (!this.draft.resultData[key]) {
                    this.draft.resultData[key] = {};
                }
                this.draft.resultData[key]['loSo'] = source['loSo'] || '';
                this.draft.resultData[key]['kqTrifluralin'] = source['kqTrifluralin'] || '';
                this.draft.resultData[key]['ghiChu'] = source['ghiChu'] || '';
                this.draft.resultData[key]['selected'] = source['selected'] !== false;
            }
        });
    }
    updateRecovery(sampleCode) {
        const row = this.draft.resultData[sampleCode];
        if (!row)
            return;
        const spikeName = this.draft.page1Data['spikeName'] || 'Spike';
        row['ghiChu'] = calculateSop03Recovery(row, sampleCode, spikeName);
    }
    getSpikeNKey(n, prefix) {
        const p = prefix === 'ALL' ? '' : prefix;
        return `QC_SPIKE_${n}_QC_${p}`;
    }
    getFinalKey(prefix) {
        const p = prefix === 'ALL' ? '' : prefix;
        return `QC_FINAL_QC_${p}`;
    }
    getDisplayRowsForPrefix(prefix) {
        const samples = this.getVisibleRegularSamples();
        const list = [];
        const ensureKey = (key, isSpikeQC) => {
            if (!this.draft.resultData[key]) {
                this.draft.resultData[key] = {
                    loSo: isSpikeQC ? (this.draft.resultData['QC_SPIKE']?.['loSo'] || '2') : '',
                    kqTrifluralin: '',
                    ghiChu: '',
                    selected: true
                };
            }
            else if (isSpikeQC) {
                this.draft.resultData[key]['loSo'] = this.draft.resultData['QC_SPIKE']?.['loSo'] || '2';
            }
        };
        ensureKey('QC_BLANK', false);
        ensureKey('QC_SPIKE', false);
        list.push({
            key: 'QC_BLANK',
            type: 'QC_BLANK',
            label: this.draft.page1Data['blankName'] || 'Blank',
            isQC: true
        });
        list.push({
            key: 'QC_SPIKE',
            type: 'QC_SPIKE',
            label: this.draft.page1Data['spikeName'] || 'Spike',
            isQC: true
        });
        let selectedCount = 0;
        samples.forEach((sampleCode) => {
            ensureKey(sampleCode, false);
            const rowData = this.draft.resultData[sampleCode];
            const isSelected = rowData['selected'] !== false;
            list.push({
                key: sampleCode,
                type: 'REGULAR',
                label: sampleCode,
                isQC: false
            });
            if (isSelected) {
                selectedCount++;
                if (selectedCount % 10 === 0) {
                    const totalSelected = samples.filter((s) => this.draft.resultData[s]['selected'] !== false).length;
                    const isLastSelected = selectedCount === totalSelected;
                    if (!isLastSelected) {
                        const n = selectedCount / 10;
                        const spikeNKey = this.getSpikeNKey(n, prefix);
                        ensureKey(spikeNKey, true);
                        list.push({
                            key: spikeNKey,
                            type: 'QC_SPIKE_N',
                            label: `SPIKE_${n}`,
                            isQC: true,
                            n: n
                        });
                    }
                }
            }
        });
        if (selectedCount > 0 && this.draft.page1Data['hasFinal']) {
            const finalKey = this.getFinalKey(prefix);
            ensureKey(finalKey, true);
            list.push({
                key: finalKey,
                type: 'QC_FINAL',
                label: 'FINAL',
                isQC: true
            });
        }
        return list;
    }
    bulkFillND() {
        bulkFillND(this.draft.resultData, this.run.sampleList, this.activeColumns, (key) => this.updateRecovery(key));
        this.draft.page1Data['checkTatCaND'] = true;
        this.draft.page1Data['checkCoMauPhatHien'] = false;
        this.onDataChanged();
    }
    bulkClearAll() {
        bulkClearAll(this.draft.resultData, this.run.sampleList, this.activeColumns);
        this.onDataChanged();
    }
    copyRowToAll(sourceKey) {
        copyRowToAll(this.draft.resultData, this.run.sampleList, this.activeColumns, sourceKey, (key) => this.updateRecovery(key));
        this.onDataChanged();
    }
    handleGridNavigation(event, rowIdx, colName, colIdx) {
        const columnsList = ['selected', 'loSo', ...this.activeColumns, 'ghiChu'];
        const rows = this.getDisplayRowsForPrefix(this.activeFilter);
        navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 1);
    }
    static { this.ɵfac = function Sop03EntryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Sop03EntryComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Sop03EntryComponent, selectors: [["app-sop-03-entry"]], inputs: { run: "run", draft: "draft", config: "config", isReadOnly: "isReadOnly", publishedSampleSet: "publishedSampleSet", activeFilter: "activeFilter" }, outputs: { draftChanged: "draftChanged" }, decls: 85, vars: 15, consts: [[1, "space-y-6", 3, "disabled"], ["title", "Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP-03)", 3, "draftChanged", "draft", "checkboxList"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4", "animate-fade-in"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-805", "pb-2.5"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-chart-line", "mr-2", "text-fuchsia-500", "text-sm"], [1, "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-850", "border", "border-slate-200/60", "dark:border-slate-800/80", "rounded-lg", "px-2.5", "py-1", "text-xs"], [1, "font-bold", "text-slate-555", "dark:text-slate-400"], ["type", "number", "placeholder", "B\u1EAFt \u0111\u1EA7u", 1, "w-14", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-fuchsia-500", "outline-none", 3, "ngModelChange", "ngModel"], [1, "text-slate-400"], ["type", "number", "readonly", "", "placeholder", "K\u1EBFt th\u00FAc", 1, "w-14", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200/40", "dark:border-slate-700/40", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-455", "dark:text-slate-500", "font-bold", "outline-none", "cursor-not-allowed", 3, "ngModel"], [1, "px-2.5", "py-1", "bg-fuchsia-600", "hover:bg-fuchsia-700", "text-white", "rounded", "font-bold", "transition", "flex", "items-center", "gap-1", "active:scale-95", "shadow-sm", 3, "click"], [1, "fa-solid", "fa-check"], [1, "grid", "grid-cols-1", "lg:grid-cols-12", "gap-6"], [1, "lg:col-span-4", "space-y-4"], [1, "block", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "mb-1.5", "uppercase", "tracking-widest"], ["type", "text", "placeholder", "BLANK", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", 3, "ngModelChange", "focus", "ngModel"], ["type", "text", "placeholder", "SPIKE", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", 3, "ngModelChange", "focus", "ngModel"], ["type", "text", "placeholder", "V\u00ED d\u1EE5: 0.9992...", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-extrabold", "text-indigo-600", "dark:text-indigo-400", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", 3, "ngModelChange", "focus", "ngModel"], [1, "pt-2"], [1, "flex", "items-center", "gap-3", "p-3", "rounded-xl", "border", "border-slate-200/60", "dark:border-slate-800", "bg-slate-50/20", "dark:bg-slate-900/10", "cursor-pointer", "select-none", "transition", "hover:bg-slate-50", "dark:hover:bg-slate-850"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-fuchsia-600", "border-slate-350", "focus:ring-fuchsia-500", "focus:ring-2", "dark:bg-slate-800", "dark:border-slate-700", 3, "ngModelChange", "ngModel"], [1, "text-xs", "font-bold", "text-slate-750", "dark:text-slate-250"], [1, "lg:col-span-8"], ["title", "6 \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)", 3, "pointsChanged", "calibPoints", "isSuffixVisible", "isFuchsiaRing"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-3"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "flex", "items-center"], [1, "fa-solid", "fa-table-cells", "mr-2", "text-fuchsia-500", "text-sm"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mr-1"], ["title", "\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND", 1, "px-3", "py-1.5", "bg-slate-50", "dark:bg-slate-955", "hover:bg-amber-50", "dark:hover:bg-amber-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200/60", "dark:border-slate-800", "hover:border-amber-200", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-xs", 3, "click"], [1, "fa-solid", "fa-pen-clip"], ["title", "X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng", 1, "px-3", "py-1.5", "bg-slate-50", "dark:bg-slate-955", "hover:bg-red-50", "dark:hover:bg-red-955/20", "text-slate-655", "dark:text-slate-455", "hover:text-red-655", "dark:hover:text-red-400", "border", "border-slate-200/60", "dark:border-slate-800", "hover:border-red-200", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-xs", 3, "click"], [1, "fa-solid", "fa-trash-can"], [1, "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/60", "dark:border-slate-800/80", "rounded-lg", "px-2.5", "py-1", "text-xs"], [1, "font-bold", "text-slate-500", "dark:text-slate-400"], ["type", "number", "placeholder", "B\u1EAFt \u0111\u1EA7u", 1, "w-14", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-fuchsia-500", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "number", "placeholder", "K\u1EBFt th\u00FAc", 1, "w-14", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-fuchsia-500", "outline-none", 3, "ngModelChange", "ngModel"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/60", "dark:border-slate-800", "rounded-xl", "max-h-[500px]"], [1, "w-full", "text-sm", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-900", "border-b", "border-slate-200/60", "dark:border-slate-800", "sticky", "top-0", "z-20"], [1, "py-3", "px-3", "text-center", "w-12", "bg-slate-50", "dark:bg-slate-900"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-fuchsia-600", "border-slate-350", "focus:ring-fuchsia-500", 3, "change", "checked"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-450", "dark:text-slate-500", "text-xs", "w-24", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-450", "dark:text-slate-500", "text-xs", "min-w-[140px]", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-450", "dark:text-slate-500", "text-xs", "min-w-[130px]", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-450", "dark:text-slate-500", "text-xs", "min-w-[180px]", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-450", "dark:text-slate-500", "text-xs", "w-28", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800", "bg-white", "dark:bg-slate-900"], [1, "bg-indigo-50/15", "dark:bg-indigo-955/5", "hover:bg-indigo-50/25", "dark:hover:bg-indigo-955/10", "transition-colors", "focus-within:bg-indigo-50/30", "dark:focus-within:bg-indigo-950/20", "border-l-4", "border-l-indigo-500/60", "transition-all", "duration-150"], [1, "bg-violet-50/10", "dark:bg-violet-955/5", "hover:bg-violet-50/20", "dark:hover:bg-violet-955/10", "transition-colors", "focus-within:bg-violet-50/25", "dark:focus-within:bg-violet-955/15", "border-l-4", "border-l-violet-500/60", "transition-all", "duration-150"], [1, "hover:bg-slate-50/40", "dark:hover:bg-slate-850/30", "transition-colors", "focus-within:bg-fuchsia-50/10", "dark:focus-within:bg-fuchsia-500/5", "border-l-4", "border-l-transparent", "focus-within:border-l-fuchsia-500", "transition-all", "duration-150", 3, "opacity-60"], [1, "py-2.5", "px-3", "text-center"], ["type", "checkbox", "checked", "", "disabled", "", 1, "w-4", "h-4", "rounded", "border-slate-350", "text-indigo-650", "focus:ring-indigo-500"], [1, "py-1.5", "px-2", "w-24"], ["type", "text", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-indigo-500/10", "focus:border-indigo-500", "outline-none", "text-center", "transition", 3, "ngModelChange", "focus", "ngModel"], [1, "py-2.5", "px-4"], [1, "font-mono", "font-bold", "text-xs", "text-indigo-655", "dark:text-indigo-455", "select-all"], [1, "py-1.5", "px-2"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-extrabold", "focus:ring-2", "focus:ring-indigo-500/10", "focus:border-indigo-500", "outline-none", "text-center", "transition", 3, "ngModelChange", "keydown", "focus", "ngModel", "id"], ["type", "text", "placeholder", "Ghi ch\u00FA...", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-indigo-500/10", "focus:border-indigo-500", "outline-none", "transition", 3, "ngModelChange", "focus", "ngModel"], [1, "py-1.5", "px-4", "text-center"], [1, "inline-flex", "items-center", "px-2", "py-0.5", "rounded-full", "text-[9px]", "font-black", "tracking-widest", "bg-indigo-100", "text-indigo-700", "dark:bg-indigo-950", "dark:text-indigo-400", "uppercase", "shadow-xs", "border", "border-indigo-200/30"], ["type", "checkbox", "checked", "", "disabled", "", 1, "w-4", "h-4", "rounded", "border-slate-355", "text-indigo-655", "focus:ring-indigo-505"], ["type", "text", "placeholder", "T\u1EF1 \u0111\u1ED9ng t\u00EDnh recovery...", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-indigo-600", "dark:text-indigo-400", "font-bold", "focus:ring-2", "focus:ring-indigo-500/10", "focus:border-indigo-500", "outline-none", "transition", 3, "ngModelChange", "focus", "ngModel"], ["type", "checkbox", "checked", "", "disabled", "", 1, "w-4", "h-4", "rounded", "border-slate-355", "text-violet-650", "focus:ring-violet-500"], ["type", "text", "disabled", "", 1, "w-full", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200/40", "dark:border-slate-800", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-455", "font-bold", "outline-none", "text-center", 3, "value"], [1, "py-2.5", "px-4", "font-mono", "font-bold", "text-xs", "text-violet-655", "dark:text-violet-405", "select-all"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-semibold", "focus:ring-1", "focus:ring-fuchsia-500", "outline-none", "text-center", 3, "ngModelChange", "keydown", "focus", "ngModel", "id"], ["type", "text", "placeholder", "Ghi ch\u00FA...", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "focus:ring-1", "focus:ring-fuchsia-500", "outline-none", 3, "ngModelChange", "focus", "ngModel"], [1, "hover:bg-slate-50/40", "dark:hover:bg-slate-850/30", "transition-colors", "focus-within:bg-fuchsia-50/10", "dark:focus-within:bg-fuchsia-500/5", "border-l-4", "border-l-transparent", "focus-within:border-l-fuchsia-500", "transition-all", "duration-150"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-fuchsia-600", "border-slate-350", "focus:ring-fuchsia-500", 3, "ngModelChange", "ngModel"], ["type", "text", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/60", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "outline-none", "text-center", "transition", 3, "ngModelChange", "keydown", "focus", "ngModel", "id"], [1, "py-2.5", "px-4", "font-mono", "font-black", "text-xs", "text-slate-700", "dark:text-slate-300", "break-all", "select-all"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/60", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "outline-none", "text-center", "transition", 3, "ngModelChange", "keydown", "focus", "ngModel", "id"], ["type", "text", "placeholder", "Ghi ch\u00FA...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/60", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-700", "dark:text-slate-350", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "outline-none", "transition", 3, "ngModelChange", "keydown", "focus", "ngModel", "id"], ["title", "Sao ch\u00E9p k\u1EBFt qu\u1EA3 c\u1EE7a d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng c\u00F2n l\u1EA1i", 1, "w-7", "h-7", "inline-flex", "items-center", "justify-center", "bg-indigo-50", "dark:bg-indigo-950/20", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-600", "hover:text-white", "rounded-lg", "text-xs", "font-black", "transition", "active:scale-95", "duration-100", "shadow-xs", 3, "click"], [1, "fa-solid", "fa-copy"]], template: function Sop03EntryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "fieldset", 0)(1, "app-sop-header-metadata", 1);
            i0.ɵɵlistener("draftChanged", function Sop03EntryComponent_Template_app_sop_header_metadata_draftChanged_1_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "div", 2)(3, "div", 3)(4, "h4", 4);
            i0.ɵɵelement(5, "i", 5);
            i0.ɵɵtext(6, " Section 6. Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n & QC ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 6)(8, "span", 7);
            i0.ɵɵtext(9, "Vial chu\u1EA9n:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "input", 8);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_10_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkCalibVialStart, $event) || (ctx.bulkCalibVialStart = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_10_listener() { return ctx.onBulkCalibVialStartChange(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "span", 9);
            i0.ɵɵtext(12, "-");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(13, "input", 10);
            i0.ɵɵelementStart(14, "button", 11);
            i0.ɵɵlistener("click", function Sop03EntryComponent_Template_button_click_14_listener() { return ctx.applyCalibVials(); });
            i0.ɵɵelement(15, "i", 12);
            i0.ɵɵelementStart(16, "span");
            i0.ɵɵtext(17, "\u00C1p D\u1EE5ng");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(18, "div", 13)(19, "div", 14)(20, "div")(21, "label", 15);
            i0.ɵɵtext(22, "T\u00EAn m\u1EABu tr\u1EAFng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "input", 16);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_23_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["blankName"], $event) || (ctx.draft.page1Data["blankName"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_23_listener() { return ctx.onDataChanged(); })("focus", function Sop03EntryComponent_Template_input_focus_23_listener($event) { return $event.target.select(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(24, "div")(25, "label", 15);
            i0.ɵɵtext(26, "T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "input", 17);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_27_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["spikeName"], $event) || (ctx.draft.page1Data["spikeName"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_27_listener() { return ctx.onDataChanged(); })("focus", function Sop03EntryComponent_Template_input_focus_27_listener($event) { return $event.target.select(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(28, "div")(29, "label", 15);
            i0.ɵɵtext(30, "H\u1EC7 s\u1ED1 x\u00E1c \u0111\u1ECBnh R\u00B2");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "input", 18);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_31_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["r2"], $event) || (ctx.draft.page1Data["r2"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_31_listener() { return ctx.onDataChanged(); })("focus", function Sop03EntryComponent_Template_input_focus_31_listener($event) { return $event.target.select(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(32, "div", 19)(33, "label", 20)(34, "input", 21);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_34_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["hasFinal"], $event) || (ctx.draft.page1Data["hasFinal"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_34_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "span", 22);
            i0.ɵɵtext(36, "Th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(37, "div", 23)(38, "app-sop-calibration-points", 24);
            i0.ɵɵlistener("pointsChanged", function Sop03EntryComponent_Template_app_sop_calibration_points_pointsChanged_38_listener() { return ctx.onCalibrationPointsChanged(); });
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(39, "div", 25)(40, "div", 26)(41, "h4", 27);
            i0.ɵɵelement(42, "i", 28);
            i0.ɵɵtext(43, " L\u01B0\u1EDBi Nh\u1EADp K\u1EBFt Qu\u1EA3 (SOP-03 Spreadsheet) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "div", 29)(45, "span", 30);
            i0.ɵɵtext(46, "Thao t\u00E1c nhanh:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "button", 31);
            i0.ɵɵlistener("click", function Sop03EntryComponent_Template_button_click_47_listener() { return ctx.bulkFillND(); });
            i0.ɵɵelement(48, "i", 32);
            i0.ɵɵelementStart(49, "span");
            i0.ɵɵtext(50, "\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(51, "button", 33);
            i0.ɵɵlistener("click", function Sop03EntryComponent_Template_button_click_51_listener() { return ctx.bulkClearAll(); });
            i0.ɵɵelement(52, "i", 34);
            i0.ɵɵelementStart(53, "span");
            i0.ɵɵtext(54, "X\u00F3a H\u1EBFt B\u1EA3ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(55, "div", 35)(56, "span", 36);
            i0.ɵɵtext(57, "L\u1ECD s\u1ED1:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(58, "input", 37);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_58_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkVialStart, $event) || (ctx.bulkVialStart = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_58_listener() { return ctx.onBulkVialStartChange(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(59, "span", 9);
            i0.ɵɵtext(60, "-");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(61, "input", 38);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop03EntryComponent_Template_input_ngModelChange_61_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkVialEnd, $event) || (ctx.bulkVialEnd = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(62, "button", 11);
            i0.ɵɵlistener("click", function Sop03EntryComponent_Template_button_click_62_listener() { return ctx.applyBulkVials(); });
            i0.ɵɵelement(63, "i", 12);
            i0.ɵɵelementStart(64, "span");
            i0.ɵɵtext(65, "\u00C1p D\u1EE5ng");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(66, "div", 39)(67, "table", 40)(68, "thead")(69, "tr", 41)(70, "th", 42)(71, "input", 43);
            i0.ɵɵlistener("change", function Sop03EntryComponent_Template_input_change_71_listener($event) { return ctx.toggleSelectAll($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(72, "th", 44);
            i0.ɵɵtext(73, "L\u1ECD s\u1ED1");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "th", 45);
            i0.ɵɵtext(75, "M\u1EABu th\u1EED");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(76, Sop03EntryComponent_For_77_Template, 2, 1, "th", 46, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementStart(78, "th", 47);
            i0.ɵɵtext(79, "Ghi ch\u00FA (Recovery %)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(80, "th", 48);
            i0.ɵɵtext(81, "T\u00E1c v\u1EE5");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(82, "tbody", 49);
            i0.ɵɵrepeaterCreate(83, Sop03EntryComponent_For_84_Template, 4, 1, null, null, _forTrack0);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance();
            i0.ɵɵproperty("draft", ctx.draft)("checkboxList", ctx.checkboxList);
            i0.ɵɵadvance(9);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkCalibVialStart);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngModel", ctx.bulkCalibVialEnd);
            i0.ɵɵadvance(10);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["blankName"]);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["spikeName"]);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["r2"]);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["hasFinal"]);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("calibPoints", ctx.draft.page1Data["calibPoints"])("isSuffixVisible", false)("isFuchsiaRing", true);
            i0.ɵɵadvance(20);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkVialStart);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkVialEnd);
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("checked", ctx.isAllSelected());
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.activeColumns);
            i0.ɵɵadvance(7);
            i0.ɵɵrepeater(ctx.getDisplayRowsForPrefix(ctx.activeFilter));
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.CheckboxControlValueAccessor, i1.NgControlStatus, i1.NgModel, SopHeaderMetadataComponent, SopCalibrationPointsComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Sop03EntryComponent, [{
        type: Component,
        args: [{ selector: 'app-sop-03-entry', standalone: true, imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent], template: "<fieldset [disabled]=\"isReadOnly\" class=\"space-y-6\">\r\n\r\n  <!-- 1. Metadata Form & Checkboxes -->\r\n  <app-sop-header-metadata\r\n    title=\"Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP-03)\"\r\n    [draft]=\"draft\"\r\n    [checkboxList]=\"checkboxList\"\r\n    (draftChanged)=\"onDataChanged()\">\r\n  </app-sop-header-metadata>\r\n\r\n  <!-- 1.5. Section 6 \u0110\u01B0\u1EDDng chu\u1EA9n & QC -->\r\n  <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in\">\r\n    <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-805 pb-2.5\">\r\n      <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center\">\r\n        <i class=\"fa-solid fa-chart-line mr-2 text-fuchsia-500 text-sm\"></i> Section 6. Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n & QC\r\n      </h4>\r\n      <!-- Quick Vial input for Calibration -->\r\n      <div class=\"flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs\">\r\n        <span class=\"font-bold text-slate-555 dark:text-slate-400\">Vial chu\u1EA9n:</span>\r\n        <input type=\"number\" \r\n               [(ngModel)]=\"bulkCalibVialStart\" \r\n               (ngModelChange)=\"onBulkCalibVialStartChange()\"\r\n               placeholder=\"B\u1EAFt \u0111\u1EA7u\" \r\n               class=\"w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none\">\r\n        <span class=\"text-slate-400\">-</span>\r\n        <input type=\"number\" \r\n               [ngModel]=\"bulkCalibVialEnd\" \r\n               readonly\r\n               placeholder=\"K\u1EBFt th\u00FAc\" \r\n               class=\"w-14 bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 rounded px-1.5 py-0.5 text-center text-slate-455 dark:text-slate-500 font-bold outline-none cursor-not-allowed\">\r\n        <button (click)=\"applyCalibVials()\" \r\n                class=\"px-2.5 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm\">\r\n          <i class=\"fa-solid fa-check\"></i>\r\n          <span>\u00C1p D\u1EE5ng</span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-6\">\r\n      <!-- Left Side: QC configuration & R^2 -->\r\n      <div class=\"lg:col-span-4 space-y-4\">\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">T\u00EAn m\u1EABu tr\u1EAFng</label>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"draft.page1Data['blankName']\" \r\n                 (ngModelChange)=\"onDataChanged()\"\r\n                 (focus)=\"$any($event.target).select()\"\r\n                 placeholder=\"BLANK\"\r\n                 class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none\">\r\n        </div>\r\n        \r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n</label>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"draft.page1Data['spikeName']\" \r\n                 (ngModelChange)=\"onDataChanged()\"\r\n                 (focus)=\"$any($event.target).select()\"\r\n                 placeholder=\"SPIKE\"\r\n                 class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none\">\r\n        </div>\r\n\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">H\u1EC7 s\u1ED1 x\u00E1c \u0111\u1ECBnh R\u00B2</label>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"draft.page1Data['r2']\" \r\n                 (ngModelChange)=\"onDataChanged()\"\r\n                 (focus)=\"$any($event.target).select()\"\r\n                 placeholder=\"V\u00ED d\u1EE5: 0.9992...\"\r\n                 class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none\">\r\n        </div>\r\n\r\n        <div class=\"pt-2\">\r\n          <label class=\"flex items-center gap-3 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer select-none transition hover:bg-slate-50 dark:hover:bg-slate-850\">\r\n            <input type=\"checkbox\" \r\n                   [(ngModel)]=\"draft.page1Data['hasFinal']\" \r\n                   (ngModelChange)=\"onDataChanged()\"\r\n                   class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 focus:ring-fuchsia-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700\">\r\n            <span class=\"text-xs font-bold text-slate-750 dark:text-slate-250\">Th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB</span>\r\n          </label>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Calibration Points Grid -->\r\n      <div class=\"lg:col-span-8\">\r\n        <app-sop-calibration-points\r\n          title=\"6 \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)\"\r\n          [calibPoints]=\"draft.page1Data['calibPoints']\"\r\n          [isSuffixVisible]=\"false\"\r\n          [isFuchsiaRing]=\"true\"\r\n          (pointsChanged)=\"onCalibrationPointsChanged()\">\r\n        </app-sop-calibration-points>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->\r\n  <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4\">\r\n    <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3\">\r\n      <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 flex items-center\">\r\n        <i class=\"fa-solid fa-table-cells mr-2 text-fuchsia-500 text-sm\"></i> L\u01B0\u1EDBi Nh\u1EADp K\u1EBFt Qu\u1EA3 (SOP-03 Spreadsheet)\r\n      </h4>\r\n\r\n      <div class=\"flex flex-wrap items-center gap-2\">\r\n        <span class=\"text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1\">Thao t\u00E1c nhanh:</span>\r\n        \r\n        <button (click)=\"bulkFillND()\" \r\n                class=\"px-3 py-1.5 bg-slate-50 dark:bg-slate-955 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-slate-800 hover:border-amber-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs\"\r\n                title=\"\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND\">\r\n          <i class=\"fa-solid fa-pen-clip\"></i>\r\n          <span>\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng</span>\r\n        </button>\r\n\r\n        <button (click)=\"bulkClearAll()\" \r\n                class=\"px-3 py-1.5 bg-slate-50 dark:bg-slate-955 hover:bg-red-50 dark:hover:bg-red-955/20 text-slate-655 dark:text-slate-455 hover:text-red-655 dark:hover:text-red-400 border border-slate-200/60 dark:border-slate-800 hover:border-red-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs\"\r\n                title=\"X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng\">\r\n          <i class=\"fa-solid fa-trash-can\"></i>\r\n          <span>X\u00F3a H\u1EBFt B\u1EA3ng</span>\r\n        </button>\r\n\r\n        <!-- Quick Vial Input -->\r\n        <div class=\"flex items-center gap-1.5 bg-slate-50 dark:bg-slate-955 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs\">\r\n          <span class=\"font-bold text-slate-500 dark:text-slate-400\">L\u1ECD s\u1ED1:</span>\r\n          <input type=\"number\" \r\n                 [(ngModel)]=\"bulkVialStart\" \r\n                 (ngModelChange)=\"onBulkVialStartChange()\"\r\n                 placeholder=\"B\u1EAFt \u0111\u1EA7u\" \r\n                 class=\"w-14 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none\">\r\n          <span class=\"text-slate-400\">-</span>\r\n          <input type=\"number\" \r\n                 [(ngModel)]=\"bulkVialEnd\" \r\n                 placeholder=\"K\u1EBFt th\u00FAc\" \r\n                 class=\"w-14 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none\">\r\n          <button (click)=\"applyBulkVials()\" \r\n                  class=\"px-2.5 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm\">\r\n            <i class=\"fa-solid fa-check\"></i>\r\n            <span>\u00C1p D\u1EE5ng</span>\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Spreadsheet Table Grid -->\r\n    <div class=\"overflow-x-auto custom-scrollbar border border-slate-200/60 dark:border-slate-800 rounded-xl max-h-[500px]\">\r\n      <table class=\"w-full text-sm border-collapse\">\r\n        <thead>\r\n          <tr class=\"bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 sticky top-0 z-20\">\r\n            <th class=\"py-3 px-3 text-center w-12 bg-slate-50 dark:bg-slate-900\">\r\n              <input type=\"checkbox\"\r\n                     [checked]=\"isAllSelected()\"\r\n                     (change)=\"toggleSelectAll($event)\"\r\n                     class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 focus:ring-fuchsia-500\">\r\n            </th>\r\n            <th class=\"py-3 px-4 text-left font-black text-slate-450 dark:text-slate-500 text-xs w-24 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">L\u1ECD s\u1ED1</th>\r\n            <th class=\"py-3 px-4 text-left font-black text-slate-450 dark:text-slate-500 text-xs min-w-[140px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">M\u1EABu th\u1EED</th>\r\n            \r\n            @for (col of activeColumns; track col) {\r\n              <th class=\"py-3 px-4 text-left font-black text-slate-450 dark:text-slate-500 text-xs min-w-[130px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">\r\n                {{ columnDisplayNames()[col] || col }} (\u00B5g/kg)\r\n              </th>\r\n            }\r\n            \r\n            <th class=\"py-3 px-4 text-left font-black text-slate-450 dark:text-slate-500 text-xs min-w-[180px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">Ghi ch\u00FA (Recovery %)</th>\r\n            <th class=\"py-3 px-4 text-center font-black text-slate-450 dark:text-slate-500 text-xs w-28 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">T\u00E1c v\u1EE5</th>\r\n          </tr>\r\n        </thead>\r\n        \r\n        <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900\">\r\n          @for (row of getDisplayRowsForPrefix(activeFilter); track row.key; let rowIdx = $index) {\r\n            @if (row.type === 'QC_BLANK') {\r\n              <tr class=\"bg-indigo-50/15 dark:bg-indigo-955/5 hover:bg-indigo-50/25 dark:hover:bg-indigo-955/10 transition-colors focus-within:bg-indigo-50/30 dark:focus-within:bg-indigo-950/20 border-l-4 border-l-indigo-500/60 transition-all duration-150\">\r\n                <td class=\"py-2.5 px-3 text-center\">\r\n                  <input type=\"checkbox\" checked disabled class=\"w-4 h-4 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500\">\r\n                </td>\r\n                <td class=\"py-1.5 px-2 w-24\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData['QC_BLANK']['loSo']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         class=\"w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center transition\">\r\n                </td>\r\n                <td class=\"py-2.5 px-4\">\r\n                  <span class=\"font-mono font-bold text-xs text-indigo-655 dark:text-indigo-455 select-all\">{{ draft.page1Data['blankName'] || 'Blank' }}</span>\r\n                </td>\r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData['QC_BLANK']['kqTrifluralin']\"\r\n                         (ngModelChange)=\"onCellChanged('QC_BLANK')\"\r\n                         [id]=\"'cell-' + rowIdx + '-kqTrifluralin'\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, 'kqTrifluralin', 3)\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"...\"\r\n                         class=\"w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center transition\">\r\n                </td>\r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData['QC_BLANK']['ghiChu']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"Ghi ch\u00FA...\"\r\n                         class=\"w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition\">\r\n                </td>\r\n                <td class=\"py-1.5 px-4 text-center\">\r\n                  <span class=\"inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 uppercase shadow-xs border border-indigo-200/30\">BLANK</span>\r\n                </td>\r\n              </tr>\r\n            } @else if (row.type === 'QC_SPIKE') {\r\n              <tr class=\"bg-indigo-50/15 dark:bg-indigo-955/5 hover:bg-indigo-50/25 dark:hover:bg-indigo-955/10 transition-colors focus-within:bg-indigo-50/30 dark:focus-within:bg-indigo-950/20 border-l-4 border-l-indigo-500/60 transition-all duration-150\">\r\n                <td class=\"py-2.5 px-3 text-center\">\r\n                  <input type=\"checkbox\" checked disabled class=\"w-4 h-4 rounded border-slate-355 text-indigo-655 focus:ring-indigo-505\">\r\n                </td>\r\n                <td class=\"py-1.5 px-2 w-24\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData['QC_SPIKE']['loSo']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         class=\"w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center transition\">\r\n                </td>\r\n                <td class=\"py-2.5 px-4\">\r\n                  <span class=\"font-mono font-bold text-xs text-indigo-655 dark:text-indigo-455 select-all\">{{ draft.page1Data['spikeName'] || 'Spike' }}</span>\r\n                </td>\r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData['QC_SPIKE']['kqTrifluralin']\"\r\n                         (ngModelChange)=\"onCellChanged('QC_SPIKE')\"\r\n                         [id]=\"'cell-' + rowIdx + '-kqTrifluralin'\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, 'kqTrifluralin', 3)\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"...\"\r\n                         class=\"w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center transition\">\r\n                </td>\r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData['QC_SPIKE']['ghiChu']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"T\u1EF1 \u0111\u1ED9ng t\u00EDnh recovery...\"\r\n                         class=\"w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition\">\r\n                </td>\r\n                <td class=\"py-1.5 px-4 text-center\">\r\n                  <span class=\"inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 uppercase shadow-xs border border-indigo-200/30\">SPIKE</span>\r\n                </td>\r\n              </tr>\r\n            } @else if (row.type === 'QC_SPIKE_N' || row.type === 'QC_FINAL') {\r\n              <tr class=\"bg-violet-50/10 dark:bg-violet-955/5 hover:bg-violet-50/20 dark:hover:bg-violet-955/10 transition-colors focus-within:bg-violet-50/25 dark:focus-within:bg-violet-955/15 border-l-4 border-l-violet-500/60 transition-all duration-150\">\r\n                <td class=\"py-2.5 px-3 text-center\">\r\n                  <input type=\"checkbox\" checked disabled class=\"w-4 h-4 rounded border-slate-355 text-violet-650 focus:ring-violet-500\">\r\n                </td>\r\n                <td class=\"py-1.5 px-2 w-24\">\r\n                  <input type=\"text\"\r\n                         [value]=\"draft.resultData['QC_SPIKE'] ? draft.resultData['QC_SPIKE']['loSo'] : '2'\"\r\n                         disabled\r\n                         class=\"w-full bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-455 font-bold outline-none text-center\">\r\n                </td>\r\n                <td class=\"py-2.5 px-4 font-mono font-bold text-xs text-violet-655 dark:text-violet-405 select-all\">\r\n                  {{ row.label }}\r\n                </td>\r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData[row.key]['kqTrifluralin']\"\r\n                         (ngModelChange)=\"onCellChanged(row.key)\"\r\n                         [id]=\"'cell-' + rowIdx + '-kqTrifluralin'\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, 'kqTrifluralin', 3)\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"...\"\r\n                         class=\"w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center\">\r\n                </td>\r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData[row.key]['ghiChu']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"Ghi ch\u00FA...\"\r\n                         class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-fuchsia-500 outline-none\">\r\n                </td>\r\n                <td class=\"py-1.5 px-4 text-center\">\r\n                  <span class=\"inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 uppercase shadow-xs border border-indigo-200/30\">QC {{ row.label }}</span>\r\n                </td>\r\n              </tr>\r\n            } @else if (row.type === 'REGULAR') {\r\n              <tr class=\"hover:bg-slate-50/40 dark:hover:bg-slate-850/30 transition-colors focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 transition-all duration-150\" [class.opacity-60]=\"draft.resultData[row.key]['selected'] === false\">\r\n                <td class=\"py-2.5 px-3 text-center\">\r\n                  <input type=\"checkbox\"\r\n                         [(ngModel)]=\"draft.resultData[row.key]['selected']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 focus:ring-fuchsia-500\">\r\n                </td>\r\n                <td class=\"py-1.5 px-2 w-24\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData[row.key]['loSo']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         [id]=\"'cell-' + rowIdx + '-loSo'\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, 'loSo', 1)\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         class=\"w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none text-center transition\">\r\n                </td>\r\n                <td class=\"py-2.5 px-4 font-mono font-black text-xs text-slate-700 dark:text-slate-300 break-all select-all\">{{ row.key }}</td>\r\n                \r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData[row.key]['kqTrifluralin']\"\r\n                         (ngModelChange)=\"onCellChanged(row.key)\"\r\n                         [id]=\"'cell-' + rowIdx + '-kqTrifluralin'\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, 'kqTrifluralin', 3)\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"...\"\r\n                         class=\"w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none text-center transition\">\r\n                </td>\r\n                \r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData[row.key]['ghiChu']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         [id]=\"'cell-' + rowIdx + '-ghiChu'\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, 'ghiChu', 4)\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"Ghi ch\u00FA...\"\r\n                         class=\"w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-350 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none transition\">\r\n                </td>\r\n                <td class=\"py-1.5 px-4 text-center\">\r\n                  <button (click)=\"copyRowToAll(row.key)\" \r\n                          class=\"w-7 h-7 inline-flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-black transition active:scale-95 duration-100 shadow-xs\"\r\n                          title=\"Sao ch\u00E9p k\u1EBFt qu\u1EA3 c\u1EE7a d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng c\u00F2n l\u1EA1i\">\r\n                    <i class=\"fa-solid fa-copy\"></i>\r\n                  </button>\r\n                </td>\r\n              </tr>\r\n            }\r\n          }\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n  </div>\r\n</fieldset>\r\n" }]
    }], null, { run: [{
            type: Input
        }], draft: [{
            type: Input
        }], config: [{
            type: Input
        }], isReadOnly: [{
            type: Input
        }], publishedSampleSet: [{
            type: Input
        }], activeFilter: [{
            type: Input
        }], draftChanged: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Sop03EntryComponent, { className: "Sop03EntryComponent", filePath: "src/app/features/results/sops/sop-03/sop-03-entry.component.ts", lineNumber: 18 }); })();
//# sourceMappingURL=sop-03-entry.component.js.map