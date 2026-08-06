import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressService } from '../../../core/services/progress.service';
import { ReportService } from '../../../core/services/report.service';
import { applyExcelImportCandidates, buildExcelImportCandidates, formatImportedFinalConc, updateCandidateSample } from '../import/excel-result-import';
import { readExcelResultFile } from '../import/excel-result-import-reader';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function ExcelResultImportModalComponent_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 12);
    i0.ɵɵelement(1, "i", 19);
    i0.ɵɵelementStart(2, "p", 20);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 21);
    i0.ɵɵtext(5, " Ch\u1EC9 \u0111\u1ECDc d\u1EEF li\u1EC7u report c\u1EA7n thi\u1EBFt. H\u00ECnh s\u1EAFc k\u00FD, chart, style v\u00E0 sheet ngo\u00E0i SOP s\u1EBD \u0111\u01B0\u1EE3c b\u1ECF qua. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 22);
    i0.ɵɵelement(7, "div", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 24)(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "button", 25);
    i0.ɵɵlistener("click", function ExcelResultImportModalComponent_Conditional_14_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.requestCancel()); });
    i0.ɵɵelement(14, "i", 10);
    i0.ɵɵtext(15, " H\u1EE7y \u0111\u1ECDc t\u1EC7p ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.loadingMessage, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵattribute("aria-valuenow", ctx_r1.loadingProgress);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("width", ctx_r1.loadingProgress, "%");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.fileSizeLabel);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.loadingProgress, "%");
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26);
    i0.ɵɵelement(1, "i", 30);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.errorMessage, " ");
} }
function ExcelResultImportModalComponent_Conditional_15_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 27);
    i0.ɵɵelement(1, "i", 31);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const warning_r3 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", warning_r3, " ");
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28);
    i0.ɵɵelement(1, "i", 32);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.uploadErrorMessage, " ");
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_4_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 36);
    i0.ɵɵtext(1, " M\u1EBB hi\u1EC7n \u0111\u00E3 c\u00F3 m\u1ED9t t\u1EC7p ngu\u1ED3n. B\u1ECF ch\u1ECDn s\u1EBD gi\u1EEF nguy\u00EAn t\u1EC7p c\u0169. ");
    i0.ɵɵelementEnd();
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 29)(1, "input", 33);
    i0.ɵɵtwoWayListener("ngModelChange", function ExcelResultImportModalComponent_Conditional_15_Conditional_4_Template_input_ngModelChange_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.saveOriginalFile, $event) || (ctx_r1.saveOriginalFile = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "span", 6)(3, "span", 34);
    i0.ɵɵtext(4, " L\u01B0u l\u1EA1i t\u1EC7p Excel g\u1ED1c tr\u00EAn Google Drive ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 35);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, ExcelResultImportModalComponent_Conditional_15_Conditional_4_Conditional_7_Template, 2, 0, "span", 36);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.saveOriginalFile);
    i0.ɵɵproperty("disabled", ctx_r1.isApplying || ctx_r1.isReadOnly);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2(" T\u00F9y ch\u1ECDn \u00B7 ", ctx_r1.file.name, " (", ctx_r1.fileSizeLabel, "). Ch\u1EC9 t\u1EA3i l\u00EAn khi b\u1EA5m \u00C1p d\u1EE5ng; ti\u1EBFn tr\u00ECnh s\u1EBD \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB trong m\u1ED9t modal ri\u00EAng. ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.hasStoredOriginalFile ? 7 : -1);
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_5_Conditional_36_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 68)(1, "input", 69);
    i0.ɵɵtwoWayListener("ngModelChange", function ExcelResultImportModalComponent_Conditional_15_Conditional_5_Conditional_36_For_9_Template_input_ngModelChange_1_listener($event) { const candidate_r8 = i0.ɵɵrestoreView(_r7).$implicit; i0.ɵɵtwoWayBindingSet(candidate_r8.selected, $event) || (candidate_r8.selected = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 70)(3, "div")(4, "span", 71);
    i0.ɵɵtext(5, "Ngu\u1ED3n Excel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 72);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div")(9, "span", 71);
    i0.ɵɵtext(10, "Tr\u00EAn UI");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span", 72);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 73)(14, "div")(15, "span", 71);
    i0.ɵɵtext(16, "Gi\u00E1 tr\u1ECB nh\u1EADp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span", 74);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "span", 75);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const candidate_r8 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", candidate_r8.selected);
    i0.ɵɵproperty("disabled", !candidate_r8.selectable);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(candidate_r8.sourceLabel);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(candidate_r8.targetLabel);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(candidate_r8.importValue);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.statusClass(candidate_r8));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.statusText(candidate_r8), " ");
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_5_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 55)(1, "div", 64)(2, "div")(3, "h3", 65);
    i0.ɵɵtext(4, " Form \u0110\u01A1n \u00B7 R\u00B2 v\u00E0 \u0111\u01B0\u1EDDng chu\u1EA9n ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 66);
    i0.ɵɵtext(6, " Ch\u1EC9 \u0111\u1ED5i danh s\u00E1ch \u0111i\u1EC3m C0\u2013Cn; n\u1ED3ng \u0111\u1ED9 danh \u0111\u1ECBnh \u0111\u01B0\u1EE3c gi\u1EEF nguy\u00EAn. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "input", 67);
    i0.ɵɵlistener("ngModelChange", function ExcelResultImportModalComponent_Conditional_15_Conditional_5_Conditional_36_Template_input_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleMetadata($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(8, ExcelResultImportModalComponent_Conditional_15_Conditional_5_Conditional_36_For_9_Template, 21, 8, "div", 68, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngModel", ctx_r1.allMetadataCandidatesSelected);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.metadataCandidates);
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Conditional_11_For_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 90);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sample_r12 = ctx.$implicit;
    i0.ɵɵproperty("value", sample_r12);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(sample_r12);
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "select", 88);
    i0.ɵɵlistener("ngModelChange", function ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Conditional_11_Template_select_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r11); const candidate_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onTargetSampleChanged(candidate_r10, $event)); });
    i0.ɵɵelementStart(1, "option", 89);
    i0.ɵɵtext(2, "\u2014 Ch\u1ECDn m\u1EABu \u2014");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(3, ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Conditional_11_For_4_Template, 2, 2, "option", 90, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const candidate_r10 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngModel", candidate_r10.targetSample || "");
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.manualSampleOptions(candidate_r10));
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 84);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const candidate_r10 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(candidate_r10.targetLabel);
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 76)(1, "td", 77)(2, "input", 78);
    i0.ɵɵtwoWayListener("ngModelChange", function ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Template_input_ngModelChange_2_listener($event) { const candidate_r10 = i0.ɵɵrestoreView(_r9).$implicit; i0.ɵɵtwoWayBindingSet(candidate_r10.selected, $event) || (candidate_r10.selected = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(3, "td", 79)(4, "span", 80);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 81);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 82);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td", 79);
    i0.ɵɵtemplate(11, ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Conditional_11_Template, 5, 1, "select", 83)(12, ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Conditional_12_Template, 2, 1, "span", 84);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "td", 85);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "td", 79)(16, "span", 86);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "td", 79)(19, "span", 87);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const candidate_r10 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("opacity-55", !candidate_r10.selectable);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", candidate_r10.selected);
    i0.ɵɵproperty("disabled", !candidate_r10.selectable);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(candidate_r10.sheetName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(candidate_r10.compoundId || "Kh\u00F4ng kh\u1EDBp SOP");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", candidate_r10.sourceSample, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(candidate_r10.status === "unmatched" || candidate_r10.status === "ambiguous" ? 11 : 12);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", candidate_r10.currentValue || "\u2014", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("text-amber-600", candidate_r10.isNd)("text-emerald-650", !candidate_r10.isNd);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.displayImportValue(candidate_r10), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.statusClass(candidate_r10));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.statusText(candidate_r10), " ");
} }
function ExcelResultImportModalComponent_Conditional_15_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 37)(1, "div", 38);
    i0.ɵɵtext(2, " \u0110\u00E3 ch\u1ECDn ");
    i0.ɵɵelementStart(3, "strong", 39);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 40)(7, "label", 41)(8, "input", 42);
    i0.ɵɵtwoWayListener("ngModelChange", function ExcelResultImportModalComponent_Conditional_15_Conditional_5_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.writeNdToResult, $event) || (ctx_r1.writeNdToResult = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span");
    i0.ɵɵtext(10, " \u0110i\u1EC1n ch\u1EEF ND v\u00E0o \u00F4 k\u1EBFt qu\u1EA3 ");
    i0.ɵɵelementStart(11, "span", 43);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "label", 44)(14, "span");
    i0.ɵɵtext(15, "Ch\u1EEF s\u1ED1 th\u1EADp ph\u00E2n:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "select", 45);
    i0.ɵɵlistener("ngModelChange", function ExcelResultImportModalComponent_Conditional_15_Conditional_5_Template_select_ngModelChange_16_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDecimalModeChanged($event)); });
    i0.ɵɵelementStart(17, "option", 46);
    i0.ɵɵtext(18, "Gi\u1EEF nguy\u00EAn Excel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "option", 47);
    i0.ɵɵtext(20, "0 ch\u1EEF s\u1ED1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "option", 48);
    i0.ɵɵtext(22, "1 ch\u1EEF s\u1ED1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "option", 49);
    i0.ɵɵtext(24, "2 ch\u1EEF s\u1ED1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "option", 50);
    i0.ɵɵtext(26, "3 ch\u1EEF s\u1ED1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "option", 51);
    i0.ɵɵtext(28, "4 ch\u1EEF s\u1ED1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "option", 52);
    i0.ɵɵtext(30, "5 ch\u1EEF s\u1ED1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "option", 53);
    i0.ɵɵtext(32, "6 ch\u1EEF s\u1ED1");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(33, "label", 41)(34, "input", 54);
    i0.ɵɵlistener("ngModelChange", function ExcelResultImportModalComponent_Conditional_15_Conditional_5_Template_input_ngModelChange_34_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleAll($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtext(35, " Ch\u1ECDn t\u1EA5t c\u1EA3 d\u00F2ng h\u1EE3p l\u1EC7 ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(36, ExcelResultImportModalComponent_Conditional_15_Conditional_5_Conditional_36_Template, 10, 1, "div", 55);
    i0.ɵɵelementStart(37, "div", 56)(38, "div", 57)(39, "table", 58)(40, "thead", 59)(41, "tr")(42, "th", 60)(43, "input", 61);
    i0.ɵɵlistener("ngModelChange", function ExcelResultImportModalComponent_Conditional_15_Conditional_5_Template_input_ngModelChange_43_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleAll($event, "result")); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(44, "th", 62);
    i0.ɵɵtext(45, "Sheet / ho\u1EA1t ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "th", 62);
    i0.ɵɵtext(47, "M\u1EABu tr\u00EAn Excel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "th", 62);
    i0.ɵɵtext(49, "Tr\u01B0\u1EDDng tr\u00EAn UI");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "th", 62);
    i0.ɵɵtext(51, "Hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "th", 62);
    i0.ɵɵtext(53, "S\u1EBD nh\u1EADp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "th", 62);
    i0.ɵɵtext(55, "Tr\u1EA1ng th\u00E1i");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(56, "tbody");
    i0.ɵɵrepeaterCreate(57, ExcelResultImportModalComponent_Conditional_15_Conditional_5_For_58_Template, 21, 17, "tr", 63, _forTrack0);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.selectedCount);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" / ", ctx_r1.candidates.length, " th\u00F4ng tin. D\u00F2ng \u0111\u01B0\u1EE3c ch\u1ECDn s\u1EBD ghi \u0111\u00E8 d\u1EEF li\u1EC7u hi\u1EC7n t\u1EA1i. ");
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.writeNdToResult);
    i0.ɵɵproperty("disabled", ctx_r1.isApplying || ctx_r1.isReadOnly);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.ndResultHint, " ");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.decimalMode);
    i0.ɵɵadvance(18);
    i0.ɵɵproperty("ngModel", ctx_r1.allSelectableSelected);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.metadataCandidates.length > 0 ? 36 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngModel", ctx_r1.allResultCandidatesSelected);
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater(ctx_r1.resultCandidates);
} }
function ExcelResultImportModalComponent_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ExcelResultImportModalComponent_Conditional_15_Conditional_0_Template, 3, 1, "div", 26);
    i0.ɵɵrepeaterCreate(1, ExcelResultImportModalComponent_Conditional_15_For_2_Template, 3, 1, "div", 27, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵtemplate(3, ExcelResultImportModalComponent_Conditional_15_Conditional_3_Template, 3, 1, "div", 28)(4, ExcelResultImportModalComponent_Conditional_15_Conditional_4_Template, 8, 5, "label", 29)(5, ExcelResultImportModalComponent_Conditional_15_Conditional_5_Template, 59, 9);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.errorMessage ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.warnings);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.uploadErrorMessage ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.file && !ctx_r1.errorMessage ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.candidates.length > 0 ? 5 : -1);
} }
export class ExcelResultImportModalComponent {
    constructor() {
        this.progressService = inject(ProgressService);
        this.reportService = inject(ReportService);
        this.file = null;
        this.run = null;
        this.config = null;
        this.configKey = null;
        this.masterTargets = [];
        this.isReadOnly = false;
        this.cancelled = new EventEmitter();
        this.applied = new EventEmitter();
        this.candidates = [];
        this.warnings = [];
        this.errorMessage = '';
        this.isLoading = false;
        this.loadingProgress = 0;
        this.loadingMessage = 'Đang chuẩn bị đọc dữ liệu Excel...';
        this.isApplying = false;
        this.decimalMode = 'source';
        this.writeNdToResult = false;
        this.saveOriginalFile = false;
        this.uploadErrorMessage = '';
    }
    async ngOnChanges(changes) {
        if (changes['file'] && this.file) {
            this.saveOriginalFile = this.draft?.page1Data?.['uploadMassHunterToDrive'] === true;
            this.writeNdToResult = this.defaultWriteNdToResult();
            await this.loadFile(this.file);
        }
    }
    ngOnDestroy() {
        this.loadAbortController?.abort();
    }
    get selectedCount() {
        return this.candidates.filter(candidate => candidate.selected && candidate.selectable).length;
    }
    get resultCandidates() {
        return this.candidates.filter(candidate => candidate.kind === 'result');
    }
    get metadataCandidates() {
        return this.candidates.filter(candidate => candidate.kind !== 'result');
    }
    get hasSelectableCandidates() {
        return this.candidates.some(candidate => candidate.selectable);
    }
    get allSelectableSelected() {
        return this.areAllSelected(this.candidates);
    }
    get allResultCandidatesSelected() {
        return this.areAllSelected(this.resultCandidates);
    }
    get allMetadataCandidatesSelected() {
        return this.areAllSelected(this.metadataCandidates);
    }
    get fileSizeLabel() {
        const bytes = this.file?.size || 0;
        if (bytes < 1024)
            return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    get hasStoredOriginalFile() {
        return Boolean(this.draft?.page1Data?.['sourceExcelUrl']
            || this.draft?.page1Data?.['massHunterExcelUrl']);
    }
    toggleAll(checked, kind) {
        this.candidates
            .filter(candidate => candidate.selectable && (!kind || candidate.kind === kind))
            .forEach(candidate => candidate.selected = checked);
    }
    toggleMetadata(checked) {
        this.metadataCandidates
            .filter(candidate => candidate.selectable)
            .forEach(candidate => candidate.selected = checked);
    }
    onTargetSampleChanged(candidate, sample) {
        updateCandidateSample(candidate, sample, this.context());
    }
    onDecimalModeChanged(mode) {
        this.decimalMode = mode;
        const decimalPlaces = this.selectedDecimalPlaces();
        this.resultCandidates.forEach(candidate => {
            candidate.importValue = formatImportedFinalConc(candidate.sourceValue ?? candidate.importValue, candidate.isNd, decimalPlaces);
        });
    }
    displayImportValue(candidate) {
        if (candidate.kind === 'result' && candidate.isNd && !this.writeNdToResult) {
            return 'Để trống';
        }
        return candidate.importValue;
    }
    get ndResultHint() {
        if (this.isSop01()) {
            return 'Bỏ chọn: để trống ô kết quả; SOP-01 vẫn hiểu là ND.';
        }
        const usesSeparateNdCheckbox = this.config?.formType === 'type3b'
            && this.draft?.page1Data?.['printFormType'] === 'formCheck';
        return usesSeparateNdCheckbox
            ? 'Bỏ chọn: để trống ô kết quả, vẫn đánh dấu checkbox ND.'
            : 'Bỏ chọn: để trống ô kết quả.';
    }
    manualSampleOptions(candidate) {
        return candidate.possibleSamples;
    }
    statusText(candidate) {
        const labels = {
            ready: 'Sẵn sàng',
            overwrite: 'Sẽ ghi đè',
            unmatched: 'Chưa ghép mẫu',
            ambiguous: 'Cần chọn mẫu',
            'not-in-sop': 'Ngoài SOP',
            'not-in-form': 'Không có trên form',
            unassigned: 'Không được phân',
            invalid: 'Không hợp lệ'
        };
        return labels[candidate.status] || candidate.status;
    }
    statusClass(candidate) {
        if (candidate.status === 'ready') {
            return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
        }
        if (candidate.status === 'overwrite') {
            return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
        }
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
    async applySelected() {
        if (!this.file || this.selectedCount === 0 || this.isApplying || this.isReadOnly)
            return;
        this.isApplying = true;
        this.uploadErrorMessage = '';
        try {
            let savedFileName;
            if (this.saveOriginalFile) {
                try {
                    savedFileName = await this.uploadOriginalFile(this.file);
                }
                catch (error) {
                    this.progressService.stop();
                    const message = error instanceof Error ? error.message : String(error);
                    this.uploadErrorMessage =
                        `Không thể lưu tệp Excel gốc: ${message}. Bạn có thể thử lại hoặc bỏ chọn lưu tệp để chỉ nhập số liệu.`;
                    return;
                }
            }
            const appliedCount = applyExcelImportCandidates(this.candidates, this.context(), this.file.name, this.selectedDecimalPlaces(), this.writeNdToResult);
            this.draft.page1Data['uploadMassHunterToDrive'] = this.saveOriginalFile;
            this.draft.page1Data['excelImportWriteNdToResult'] = this.writeNdToResult;
            this.applied.emit({
                draft: this.draft,
                appliedCount,
                originalFileSaved: this.saveOriginalFile,
                originalFileName: savedFileName
            });
        }
        finally {
            this.isApplying = false;
        }
    }
    requestCancel() {
        if (this.isApplying)
            return;
        this.loadAbortController?.abort();
        this.cancelled.emit();
    }
    async loadFile(file) {
        this.loadAbortController?.abort();
        const controller = new AbortController();
        this.loadAbortController = controller;
        this.isLoading = true;
        this.loadingProgress = 0;
        this.loadingMessage = 'Đang chuẩn bị đọc dữ liệu Excel...';
        this.errorMessage = '';
        this.warnings = [];
        this.candidates = [];
        this.decimalMode = 'source';
        this.uploadErrorMessage = '';
        try {
            const parsed = await readExcelResultFile(file, this.context(), progress => {
                this.loadingProgress = progress.percent;
                this.loadingMessage = progress.message;
            }, controller.signal);
            if (controller.signal.aborted)
                return;
            this.loadingProgress = 95;
            this.loadingMessage = 'Đang hoàn tất đối chiếu với dữ liệu trên form...';
            this.warnings = parsed.warnings;
            this.candidates = buildExcelImportCandidates(parsed, this.context());
            this.loadingProgress = 100;
            if (this.candidates.length === 0 && this.warnings.length === 0) {
                this.errorMessage = 'File không có kết quả Final-Conc. phù hợp để nhập.';
            }
        }
        catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError')
                return;
            console.error('[Excel result import] Cannot parse workbook', error);
            this.errorMessage = 'Không đọc được file Excel. Vui lòng kiểm tra định dạng file MassHunter.';
        }
        finally {
            if (this.loadAbortController === controller) {
                this.loadAbortController = undefined;
                this.isLoading = false;
            }
        }
    }
    context() {
        return {
            run: this.run,
            draft: this.draft,
            config: this.config,
            configKey: this.configKey,
            masterTargets: this.masterTargets
        };
    }
    selectedDecimalPlaces() {
        if (this.decimalMode === 'source')
            return null;
        const parsed = Number(this.decimalMode);
        return Number.isInteger(parsed) && parsed >= 0 && parsed <= 6 ? parsed : null;
    }
    defaultWriteNdToResult() {
        const savedPreference = this.draft?.page1Data?.['excelImportWriteNdToResult'];
        if (typeof savedPreference === 'boolean')
            return savedPreference;
        if (this.isSop01())
            return false;
        const usesSeparateNdCheckbox = this.config?.formType === 'type3b'
            && this.draft?.page1Data?.['printFormType'] === 'formCheck';
        return !usesSeparateNdCheckbox;
    }
    isSop01() {
        return this.configKey === 'fipronil-chlorpyrifos'
            || this.run?.sopId === 'SOP-01';
    }
    areAllSelected(candidates) {
        const selectable = candidates.filter(candidate => candidate.selectable);
        return selectable.length > 0 && selectable.every(candidate => candidate.selected);
    }
    async uploadOriginalFile(file) {
        this.progressService.start('Đang lưu tệp Excel gốc', 'Đang chuẩn bị dữ liệu để tải lên Google Drive...', 100);
        this.progressService.update(5);
        const fileData = await this.readFileAsDataUrl(file);
        this.progressService.update(25, 'Đang truyền tệp Excel lên Google Drive...');
        const normalizedFileName = this.buildStoredFileName(file);
        const response = await this.reportService.uploadExcelToDrive(this.draft.requestId, normalizedFileName, fileData, this.draft.sopId, percent => {
            const overallPercent = 25 + Math.round(percent * 0.65);
            this.progressService.update(overallPercent, 'Đang truyền tệp Excel lên Google Drive...');
        });
        if (!response.success || !response.fileUrl) {
            throw new Error(response.error || 'Google Drive không trả về liên kết tệp.');
        }
        this.progressService.update(95, 'Đang liên kết tệp nguồn với mẻ chạy...');
        const storedFileName = response.fileName || normalizedFileName;
        this.draft.page1Data['sourceExcelUrl'] = response.fileUrl;
        this.draft.page1Data['sourceExcelName'] = storedFileName;
        this.draft.page1Data['sourceExcelOriginalName'] = file.name;
        this.draft.page1Data['sourceExcelSize'] = file.size;
        this.draft.page1Data['sourceExcelUploadedAt'] = new Date().toISOString();
        // Giữ các khóa cũ để dữ liệu và UI MassHunter trước đây tiếp tục tương thích.
        this.draft.page1Data['massHunterExcelUrl'] = response.fileUrl;
        this.draft.page1Data['massHunterExcelName'] = storedFileName;
        this.draft.page1Data['massHunterExcelOriginalName'] = file.name;
        this.draft.page1Data['massHunterExcelSize'] = file.size;
        this.draft.page1Data['massHunterExcelUploadedAt'] = this.draft.page1Data['sourceExcelUploadedAt'];
        this.progressService.update(100, 'Đã lưu tệp Excel gốc thành công.');
        this.progressService.complete();
        return storedFileName;
    }
    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Không đọc được nội dung tệp.'));
            reader.onprogress = event => {
                if (event.lengthComputable) {
                    this.progressService.update(5 + Math.round((event.loaded / event.total) * 15), 'Đang chuẩn bị dữ liệu để tải lên Google Drive...');
                }
            };
            reader.onload = () => resolve(String(reader.result || ''));
            reader.readAsDataURL(file);
        });
    }
    buildStoredFileName(file) {
        const batchCode = this.run?.inputs?.['batchCode']
            || this.run?.id
            || this.draft.requestId
            || new Date().toISOString().slice(0, 10);
        const versionSuffix = this.draft.version ? `_v${this.draft.version}` : '';
        const extensionIndex = file.name.lastIndexOf('.');
        const extension = extensionIndex >= 0 ? file.name.slice(extensionIndex) : '.xlsx';
        const safePart = (value) => String(value || '')
            .trim()
            .replace(/[\\/:*?"<>|]+/g, '_')
            .replace(/\s+/g, '_');
        return `RAW_${safePart(this.draft.sopId)}_${safePart(batchCode)}${versionSuffix}${extension}`;
    }
    static { this.ɵfac = function ExcelResultImportModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ExcelResultImportModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ExcelResultImportModalComponent, selectors: [["app-excel-result-import-modal"]], inputs: { file: "file", run: "run", draft: "draft", config: "config", configKey: "configKey", masterTargets: "masterTargets", isReadOnly: "isReadOnly" }, outputs: { cancelled: "cancelled", applied: "applied" }, features: [i0.ɵɵNgOnChangesFeature], decls: 25, vars: 14, consts: [[1, "fixed", "inset-0", "z-[70]", "bg-slate-950/65", "backdrop-blur-sm", "flex", "items-center", "justify-center", "p-3", "md:p-6", 3, "click"], [1, "w-full", "max-w-7xl", "max-h-[94vh]", "overflow-hidden", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-3xl", "shadow-2xl", "flex", "flex-col", 3, "click"], [1, "px-5", "md:px-7", "py-5", "border-b", "border-slate-200", "dark:border-slate-800", "flex", "items-start", "justify-between", "gap-4"], [1, "flex", "items-start", "gap-3", "min-w-0"], [1, "w-11", "h-11", "rounded-2xl", "bg-emerald-50", "dark:bg-emerald-950/30", "text-emerald-600", "dark:text-emerald-400", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-file-excel", "text-lg"], [1, "min-w-0"], [1, "text-base", "md:text-lg", "font-black", "text-slate-900", "dark:text-slate-100", "m-0"], [1, "mt-1", "text-xs", "text-slate-500", "dark:text-slate-400", "truncate"], ["type", "button", 1, "w-9", "h-9", "rounded-xl", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-800", "dark:hover:bg-slate-700", "text-slate-500", "flex", "items-center", "justify-center", "transition", "disabled:opacity-40", 3, "click", "disabled"], [1, "fa-solid", "fa-xmark"], [1, "flex-1", "min-h-0", "overflow-y-auto", "custom-scrollbar", "px-5", "md:px-7", "py-5"], [1, "py-16", "max-w-xl", "mx-auto", "text-center", "text-slate-500", "dark:text-slate-400"], [1, "px-5", "md:px-7", "py-4", "border-t", "border-slate-200", "dark:border-slate-800", "flex", "items-center", "justify-between", "gap-3", "bg-slate-50/70", "dark:bg-slate-950/20"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "hidden", "sm:block"], [1, "flex", "items-center", "gap-2", "ml-auto"], ["type", "button", 1, "px-4", "py-2.5", "rounded-xl", "text-xs", "font-black", "text-slate-600", "dark:text-slate-300", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "hover:bg-slate-100", "transition", "disabled:opacity-40", 3, "click", "disabled"], ["type", "button", 1, "px-5", "py-2.5", "rounded-xl", "text-xs", "font-black", "text-white", "bg-emerald-600", "hover:bg-emerald-700", "disabled:opacity-45", "disabled:cursor-not-allowed", "transition", "shadow-sm", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-2xl", "text-emerald-500", "mb-3"], [1, "text-sm", "font-black", "text-slate-700", "dark:text-slate-200"], [1, "mt-2", "text-[11px]", "leading-relaxed", "text-slate-500", "dark:text-slate-400"], ["role", "progressbar", "aria-label", "Ti\u1EBFn tr\u00ECnh \u0111\u1ECDc Excel", "aria-valuemin", "0", "aria-valuemax", "100", 1, "mt-5", "h-2.5", "overflow-hidden", "rounded-full", "bg-slate-100", "dark:bg-slate-800"], [1, "h-full", "rounded-full", "bg-gradient-to-r", "from-emerald-500", "to-teal-400", "transition-[width]", "duration-300"], [1, "mt-2", "flex", "items-center", "justify-between", "text-[10px]", "font-bold", "text-slate-400"], ["type", "button", 1, "mt-6", "inline-flex", "items-center", "gap-2", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "px-4", "py-2", "text-xs", "font-black", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-50", "dark:hover:bg-slate-800", "transition", 3, "click"], [1, "rounded-2xl", "border", "border-red-200", "dark:border-red-900/40", "bg-red-50", "dark:bg-red-950/20", "px-4", "py-3", "text-sm", "font-bold", "text-red-700", "dark:text-red-400"], [1, "mb-3", "rounded-2xl", "border", "border-amber-200", "dark:border-amber-900/40", "bg-amber-50", "dark:bg-amber-950/20", "px-4", "py-3", "text-xs", "font-bold", "text-amber-700", "dark:text-amber-400"], [1, "mb-3", "rounded-2xl", "border", "border-red-200", "dark:border-red-900/40", "bg-red-50", "dark:bg-red-950/20", "px-4", "py-3", "text-xs", "font-bold", "text-red-700", "dark:text-red-400"], [1, "mb-4", "flex", "items-start", "gap-3", "rounded-2xl", "border", "border-sky-200/80", "dark:border-sky-900/40", "bg-sky-50/60", "dark:bg-sky-950/20", "px-4", "py-3.5", "cursor-pointer", "select-none"], [1, "fa-solid", "fa-triangle-exclamation", "mr-2"], [1, "fa-solid", "fa-circle-info", "mr-2"], [1, "fa-solid", "fa-cloud-arrow-up", "mr-2"], ["type", "checkbox", 1, "mt-0.5", "w-4", "h-4", "rounded", "text-sky-600", "focus:ring-sky-500", "disabled:opacity-40", 3, "ngModelChange", "ngModel", "disabled"], [1, "block", "text-xs", "font-black", "text-sky-800", "dark:text-sky-300"], [1, "block", "mt-1", "text-[10px]", "leading-relaxed", "text-slate-500", "dark:text-slate-400"], [1, "block", "mt-1", "text-[10px]", "font-bold", "text-sky-650", "dark:text-sky-400"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-3", "mb-4"], [1, "text-xs", "text-slate-600", "dark:text-slate-300"], [1, "text-emerald-650", "dark:text-emerald-400"], [1, "flex", "flex-wrap", "items-center", "gap-3"], [1, "inline-flex", "items-center", "gap-2", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "cursor-pointer", "select-none"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-amber-600", "focus:ring-amber-500", "disabled:opacity-40", 3, "ngModelChange", "ngModel", "disabled"], [1, "block", "text-[9px]", "font-medium", "text-slate-400"], [1, "inline-flex", "items-center", "gap-2", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "px-2.5", "py-1.5", "text-xs", "font-black", 3, "ngModelChange", "ngModel"], ["value", "source"], ["value", "0"], ["value", "1"], ["value", "2"], ["value", "3"], ["value", "4"], ["value", "5"], ["value", "6"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-emerald-600", "focus:ring-emerald-500", 3, "ngModelChange", "ngModel"], [1, "mb-5", "border", "border-indigo-200/70", "dark:border-indigo-900/40", "rounded-2xl", "overflow-hidden"], [1, "border", "border-slate-200", "dark:border-slate-800", "rounded-2xl", "overflow-hidden"], [1, "overflow-x-auto"], [1, "w-full", "min-w-[960px]", "text-xs"], [1, "bg-slate-50", "dark:bg-slate-850", "text-[9px]", "uppercase", "tracking-wider", "text-slate-500", "dark:text-slate-400"], [1, "w-12", "px-3", "py-3", "text-center"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-emerald-600", 3, "ngModelChange", "ngModel"], [1, "px-3", "py-3", "text-left"], [1, "border-t", "border-slate-100", "dark:border-slate-800/80", 3, "opacity-55"], [1, "px-4", "py-3", "bg-indigo-50/70", "dark:bg-indigo-950/20", "flex", "items-center", "justify-between"], [1, "text-xs", "font-black", "uppercase", "tracking-wider", "text-indigo-700", "dark:text-indigo-400", "m-0"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "mt-1"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-indigo-600", 3, "ngModelChange", "ngModel"], [1, "px-4", "py-3", "border-t", "border-indigo-100", "dark:border-indigo-900/30", "flex", "items-start", "gap-3"], ["type", "checkbox", 1, "mt-1", "w-4", "h-4", "rounded", "text-indigo-600", "disabled:opacity-40", 3, "ngModelChange", "ngModel", "disabled"], [1, "min-w-0", "flex-1", "grid", "md:grid-cols-3", "gap-2", "text-xs"], [1, "block", "text-[9px]", "uppercase", "font-black", "text-slate-400", "mb-1"], [1, "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "font-black", "text-indigo-700", "dark:text-indigo-400"], [1, "px-2", "py-1", "rounded-lg", "text-[9px]", "font-black", "whitespace-nowrap"], [1, "border-t", "border-slate-100", "dark:border-slate-800/80"], [1, "px-3", "py-3", "text-center"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-emerald-600", "disabled:opacity-40", 3, "ngModelChange", "ngModel", "disabled"], [1, "px-3", "py-3"], [1, "block", "font-black", "text-slate-750", "dark:text-slate-200"], [1, "block", "text-[10px]", "text-slate-400", "mt-0.5"], [1, "px-3", "py-3", "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "w-full", "min-w-44", "rounded-lg", "border", "border-amber-300", "dark:border-amber-800", "bg-white", "dark:bg-slate-900", "px-2", "py-1.5", "text-xs", "font-bold", 3, "ngModel"], [1, "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "px-3", "py-3", "text-slate-500", "dark:text-slate-400"], [1, "font-black"], [1, "inline-flex", "px-2", "py-1", "rounded-lg", "text-[9px]", "font-black", "whitespace-nowrap"], [1, "w-full", "min-w-44", "rounded-lg", "border", "border-amber-300", "dark:border-amber-800", "bg-white", "dark:bg-slate-900", "px-2", "py-1.5", "text-xs", "font-bold", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"]], template: function ExcelResultImportModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵlistener("click", function ExcelResultImportModalComponent_Template_div_click_0_listener() { return ctx.requestCancel(); });
            i0.ɵɵelementStart(1, "section", 1);
            i0.ɵɵlistener("click", function ExcelResultImportModalComponent_Template_section_click_1_listener($event) { return $event.stopPropagation(); });
            i0.ɵɵelementStart(2, "header", 2)(3, "div", 3)(4, "div", 4);
            i0.ɵɵelement(5, "i", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 6)(7, "h2", 7);
            i0.ɵɵtext(8, " Xem tr\u01B0\u1EDBc d\u1EEF li\u1EC7u nh\u1EADp t\u1EEB Excel ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "p", 8);
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(11, "button", 9);
            i0.ɵɵlistener("click", function ExcelResultImportModalComponent_Template_button_click_11_listener() { return ctx.requestCancel(); });
            i0.ɵɵelement(12, "i", 10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "div", 11);
            i0.ɵɵtemplate(14, ExcelResultImportModalComponent_Conditional_14_Template, 16, 6, "div", 12)(15, ExcelResultImportModalComponent_Conditional_15_Template, 6, 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "footer", 13)(17, "p", 14);
            i0.ɵɵtext(18, " D\u00F2ng b\u1ECF ch\u1ECDn s\u1EBD \u0111\u01B0\u1EE3c gi\u1EEF nguy\u00EAn tr\u00EAn UI. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "div", 15)(20, "button", 16);
            i0.ɵɵlistener("click", function ExcelResultImportModalComponent_Template_button_click_20_listener() { return ctx.requestCancel(); });
            i0.ɵɵtext(21, " H\u1EE7y ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "button", 17);
            i0.ɵɵlistener("click", function ExcelResultImportModalComponent_Template_button_click_22_listener() { return ctx.applySelected(); });
            i0.ɵɵelement(23, "i", 18);
            i0.ɵɵtext(24);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(10);
            i0.ɵɵtextInterpolate2(" ", ctx.file == null ? null : ctx.file.name, " \u00B7 SOP hi\u1EC7n t\u1EA1i: ", (ctx.run == null ? null : ctx.run.sopName) || ctx.configKey, " ");
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.isApplying);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.isLoading ? 14 : 15);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("disabled", ctx.isApplying);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.isLoading || ctx.isApplying || ctx.isReadOnly || ctx.selectedCount === 0 || !ctx.hasSelectableCandidates);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("fa-check", !ctx.isApplying)("fa-spinner", ctx.isApplying)("fa-spin", ctx.isApplying);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate2(" \u00C1p d\u1EE5ng ", ctx.selectedCount, " th\u00F4ng tin", ctx.saveOriginalFile ? " v\u00E0 l\u01B0u t\u1EC7p" : "", " ");
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ExcelResultImportModalComponent, [{
        type: Component,
        args: [{ selector: 'app-excel-result-import-modal', standalone: true, imports: [CommonModule, FormsModule], template: "<div class=\"fixed inset-0 z-[70] bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6\"\r\n     (click)=\"requestCancel()\">\r\n  <section class=\"w-full max-w-7xl max-h-[94vh] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl flex flex-col\"\r\n           (click)=\"$event.stopPropagation()\">\r\n    <header class=\"px-5 md:px-7 py-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4\">\r\n      <div class=\"flex items-start gap-3 min-w-0\">\r\n        <div class=\"w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0\">\r\n          <i class=\"fa-solid fa-file-excel text-lg\"></i>\r\n        </div>\r\n        <div class=\"min-w-0\">\r\n          <h2 class=\"text-base md:text-lg font-black text-slate-900 dark:text-slate-100 m-0\">\r\n            Xem tr\u01B0\u1EDBc d\u1EEF li\u1EC7u nh\u1EADp t\u1EEB Excel\r\n          </h2>\r\n          <p class=\"mt-1 text-xs text-slate-500 dark:text-slate-400 truncate\">\r\n            {{ file?.name }} \u00B7 SOP hi\u1EC7n t\u1EA1i: {{ run?.sopName || configKey }}\r\n          </p>\r\n        </div>\r\n      </div>\r\n      <button type=\"button\" (click)=\"requestCancel()\" [disabled]=\"isApplying\"\r\n              class=\"w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition disabled:opacity-40\">\r\n        <i class=\"fa-solid fa-xmark\"></i>\r\n      </button>\r\n    </header>\r\n\r\n    <div class=\"flex-1 min-h-0 overflow-y-auto custom-scrollbar px-5 md:px-7 py-5\">\r\n      @if (isLoading) {\r\n        <div class=\"py-16 max-w-xl mx-auto text-center text-slate-500 dark:text-slate-400\">\r\n          <i class=\"fa-solid fa-spinner fa-spin text-2xl text-emerald-500 mb-3\"></i>\r\n          <p class=\"text-sm font-black text-slate-700 dark:text-slate-200\">\r\n            {{ loadingMessage }}\r\n          </p>\r\n          <p class=\"mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400\">\r\n            Ch\u1EC9 \u0111\u1ECDc d\u1EEF li\u1EC7u report c\u1EA7n thi\u1EBFt. H\u00ECnh s\u1EAFc k\u00FD, chart, style v\u00E0 sheet ngo\u00E0i SOP s\u1EBD \u0111\u01B0\u1EE3c b\u1ECF qua.\r\n          </p>\r\n          <div class=\"mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800\"\r\n               role=\"progressbar\"\r\n               aria-label=\"Ti\u1EBFn tr\u00ECnh \u0111\u1ECDc Excel\"\r\n               aria-valuemin=\"0\"\r\n               aria-valuemax=\"100\"\r\n               [attr.aria-valuenow]=\"loadingProgress\">\r\n            <div class=\"h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-300\"\r\n                 [style.width.%]=\"loadingProgress\"></div>\r\n          </div>\r\n          <div class=\"mt-2 flex items-center justify-between text-[10px] font-bold text-slate-400\">\r\n            <span>{{ fileSizeLabel }}</span>\r\n            <span>{{ loadingProgress }}%</span>\r\n          </div>\r\n          <button type=\"button\"\r\n                  (click)=\"requestCancel()\"\r\n                  class=\"mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition\">\r\n            <i class=\"fa-solid fa-xmark\"></i>\r\n            H\u1EE7y \u0111\u1ECDc t\u1EC7p\r\n          </button>\r\n        </div>\r\n      } @else {\r\n        @if (errorMessage) {\r\n          <div class=\"rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm font-bold text-red-700 dark:text-red-400\">\r\n            <i class=\"fa-solid fa-triangle-exclamation mr-2\"></i>{{ errorMessage }}\r\n          </div>\r\n        }\r\n\r\n        @for (warning of warnings; track warning) {\r\n          <div class=\"mb-3 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-xs font-bold text-amber-700 dark:text-amber-400\">\r\n            <i class=\"fa-solid fa-circle-info mr-2\"></i>{{ warning }}\r\n          </div>\r\n        }\r\n\r\n        @if (uploadErrorMessage) {\r\n          <div class=\"mb-3 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-xs font-bold text-red-700 dark:text-red-400\">\r\n            <i class=\"fa-solid fa-cloud-arrow-up mr-2\"></i>{{ uploadErrorMessage }}\r\n          </div>\r\n        }\r\n\r\n        @if (file && !errorMessage) {\r\n          <label class=\"mb-4 flex items-start gap-3 rounded-2xl border border-sky-200/80 dark:border-sky-900/40 bg-sky-50/60 dark:bg-sky-950/20 px-4 py-3.5 cursor-pointer select-none\">\r\n            <input type=\"checkbox\"\r\n                   [(ngModel)]=\"saveOriginalFile\"\r\n                   [disabled]=\"isApplying || isReadOnly\"\r\n                   class=\"mt-0.5 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 disabled:opacity-40\">\r\n            <span class=\"min-w-0\">\r\n              <span class=\"block text-xs font-black text-sky-800 dark:text-sky-300\">\r\n                L\u01B0u l\u1EA1i t\u1EC7p Excel g\u1ED1c tr\u00EAn Google Drive\r\n              </span>\r\n              <span class=\"block mt-1 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400\">\r\n                T\u00F9y ch\u1ECDn \u00B7 {{ file.name }} ({{ fileSizeLabel }}). Ch\u1EC9 t\u1EA3i l\u00EAn khi b\u1EA5m \u00C1p d\u1EE5ng; ti\u1EBFn tr\u00ECnh s\u1EBD \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB trong m\u1ED9t modal ri\u00EAng.\r\n              </span>\r\n              @if (hasStoredOriginalFile) {\r\n                <span class=\"block mt-1 text-[10px] font-bold text-sky-650 dark:text-sky-400\">\r\n                  M\u1EBB hi\u1EC7n \u0111\u00E3 c\u00F3 m\u1ED9t t\u1EC7p ngu\u1ED3n. B\u1ECF ch\u1ECDn s\u1EBD gi\u1EEF nguy\u00EAn t\u1EC7p c\u0169.\r\n                </span>\r\n              }\r\n            </span>\r\n          </label>\r\n        }\r\n\r\n        @if (candidates.length > 0) {\r\n          <div class=\"flex flex-wrap items-center justify-between gap-3 mb-4\">\r\n            <div class=\"text-xs text-slate-600 dark:text-slate-300\">\r\n              \u0110\u00E3 ch\u1ECDn <strong class=\"text-emerald-650 dark:text-emerald-400\">{{ selectedCount }}</strong>\r\n              / {{ candidates.length }} th\u00F4ng tin. D\u00F2ng \u0111\u01B0\u1EE3c ch\u1ECDn s\u1EBD ghi \u0111\u00E8 d\u1EEF li\u1EC7u hi\u1EC7n t\u1EA1i.\r\n            </div>\r\n            <div class=\"flex flex-wrap items-center gap-3\">\r\n              <label class=\"inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none\">\r\n                <input type=\"checkbox\"\r\n                       [(ngModel)]=\"writeNdToResult\"\r\n                       [disabled]=\"isApplying || isReadOnly\"\r\n                       class=\"w-4 h-4 rounded text-amber-600 focus:ring-amber-500 disabled:opacity-40\">\r\n                <span>\r\n                  \u0110i\u1EC1n ch\u1EEF ND v\u00E0o \u00F4 k\u1EBFt qu\u1EA3\r\n                  <span class=\"block text-[9px] font-medium text-slate-400\">\r\n                    {{ ndResultHint }}\r\n                  </span>\r\n                </span>\r\n              </label>\r\n              <label class=\"inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300\">\r\n                <span>Ch\u1EEF s\u1ED1 th\u1EADp ph\u00E2n:</span>\r\n                <select [ngModel]=\"decimalMode\"\r\n                        (ngModelChange)=\"onDecimalModeChanged($event)\"\r\n                        class=\"rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-black\">\r\n                  <option value=\"source\">Gi\u1EEF nguy\u00EAn Excel</option>\r\n                  <option value=\"0\">0 ch\u1EEF s\u1ED1</option>\r\n                  <option value=\"1\">1 ch\u1EEF s\u1ED1</option>\r\n                  <option value=\"2\">2 ch\u1EEF s\u1ED1</option>\r\n                  <option value=\"3\">3 ch\u1EEF s\u1ED1</option>\r\n                  <option value=\"4\">4 ch\u1EEF s\u1ED1</option>\r\n                  <option value=\"5\">5 ch\u1EEF s\u1ED1</option>\r\n                  <option value=\"6\">6 ch\u1EEF s\u1ED1</option>\r\n                </select>\r\n              </label>\r\n              <label class=\"inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none\">\r\n                <input type=\"checkbox\"\r\n                       [ngModel]=\"allSelectableSelected\"\r\n                       (ngModelChange)=\"toggleAll($event)\"\r\n                       class=\"w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500\">\r\n                Ch\u1ECDn t\u1EA5t c\u1EA3 d\u00F2ng h\u1EE3p l\u1EC7\r\n              </label>\r\n            </div>\r\n          </div>\r\n\r\n          @if (metadataCandidates.length > 0) {\r\n            <div class=\"mb-5 border border-indigo-200/70 dark:border-indigo-900/40 rounded-2xl overflow-hidden\">\r\n              <div class=\"px-4 py-3 bg-indigo-50/70 dark:bg-indigo-950/20 flex items-center justify-between\">\r\n                <div>\r\n                  <h3 class=\"text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 m-0\">\r\n                    Form \u0110\u01A1n \u00B7 R\u00B2 v\u00E0 \u0111\u01B0\u1EDDng chu\u1EA9n\r\n                  </h3>\r\n                  <p class=\"text-[10px] text-slate-500 dark:text-slate-400 mt-1\">\r\n                    Ch\u1EC9 \u0111\u1ED5i danh s\u00E1ch \u0111i\u1EC3m C0\u2013Cn; n\u1ED3ng \u0111\u1ED9 danh \u0111\u1ECBnh \u0111\u01B0\u1EE3c gi\u1EEF nguy\u00EAn.\r\n                  </p>\r\n                </div>\r\n                <input type=\"checkbox\"\r\n                       [ngModel]=\"allMetadataCandidatesSelected\"\r\n                       (ngModelChange)=\"toggleMetadata($event)\"\r\n                       class=\"w-4 h-4 rounded text-indigo-600\">\r\n              </div>\r\n              @for (candidate of metadataCandidates; track candidate.id) {\r\n                <div class=\"px-4 py-3 border-t border-indigo-100 dark:border-indigo-900/30 flex items-start gap-3\">\r\n                  <input type=\"checkbox\" [(ngModel)]=\"candidate.selected\" [disabled]=\"!candidate.selectable\"\r\n                         class=\"mt-1 w-4 h-4 rounded text-indigo-600 disabled:opacity-40\">\r\n                  <div class=\"min-w-0 flex-1 grid md:grid-cols-3 gap-2 text-xs\">\r\n                    <div>\r\n                      <span class=\"block text-[9px] uppercase font-black text-slate-400 mb-1\">Ngu\u1ED3n Excel</span>\r\n                      <span class=\"font-bold text-slate-700 dark:text-slate-200\">{{ candidate.sourceLabel }}</span>\r\n                    </div>\r\n                    <div>\r\n                      <span class=\"block text-[9px] uppercase font-black text-slate-400 mb-1\">Tr\u00EAn UI</span>\r\n                      <span class=\"font-bold text-slate-700 dark:text-slate-200\">{{ candidate.targetLabel }}</span>\r\n                    </div>\r\n                    <div class=\"flex items-start justify-between gap-2\">\r\n                      <div>\r\n                        <span class=\"block text-[9px] uppercase font-black text-slate-400 mb-1\">Gi\u00E1 tr\u1ECB nh\u1EADp</span>\r\n                        <span class=\"font-black text-indigo-700 dark:text-indigo-400\">{{ candidate.importValue }}</span>\r\n                      </div>\r\n                      <span class=\"px-2 py-1 rounded-lg text-[9px] font-black whitespace-nowrap\"\r\n                            [class]=\"statusClass(candidate)\">\r\n                        {{ statusText(candidate) }}\r\n                      </span>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              }\r\n            </div>\r\n          }\r\n\r\n          <div class=\"border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden\">\r\n            <div class=\"overflow-x-auto\">\r\n              <table class=\"w-full min-w-[960px] text-xs\">\r\n                <thead class=\"bg-slate-50 dark:bg-slate-850 text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400\">\r\n                  <tr>\r\n                    <th class=\"w-12 px-3 py-3 text-center\">\r\n                      <input type=\"checkbox\"\r\n                             [ngModel]=\"allResultCandidatesSelected\"\r\n                             (ngModelChange)=\"toggleAll($event, 'result')\"\r\n                             class=\"w-4 h-4 rounded text-emerald-600\">\r\n                    </th>\r\n                    <th class=\"px-3 py-3 text-left\">Sheet / ho\u1EA1t ch\u1EA5t</th>\r\n                    <th class=\"px-3 py-3 text-left\">M\u1EABu tr\u00EAn Excel</th>\r\n                    <th class=\"px-3 py-3 text-left\">Tr\u01B0\u1EDDng tr\u00EAn UI</th>\r\n                    <th class=\"px-3 py-3 text-left\">Hi\u1EC7n t\u1EA1i</th>\r\n                    <th class=\"px-3 py-3 text-left\">S\u1EBD nh\u1EADp</th>\r\n                    <th class=\"px-3 py-3 text-left\">Tr\u1EA1ng th\u00E1i</th>\r\n                  </tr>\r\n                </thead>\r\n                <tbody>\r\n                  @for (candidate of resultCandidates; track candidate.id) {\r\n                    <tr class=\"border-t border-slate-100 dark:border-slate-800/80\"\r\n                        [class.opacity-55]=\"!candidate.selectable\">\r\n                      <td class=\"px-3 py-3 text-center\">\r\n                        <input type=\"checkbox\" [(ngModel)]=\"candidate.selected\" [disabled]=\"!candidate.selectable\"\r\n                               class=\"w-4 h-4 rounded text-emerald-600 disabled:opacity-40\">\r\n                      </td>\r\n                      <td class=\"px-3 py-3\">\r\n                        <span class=\"block font-black text-slate-750 dark:text-slate-200\">{{ candidate.sheetName }}</span>\r\n                        <span class=\"block text-[10px] text-slate-400 mt-0.5\">{{ candidate.compoundId || 'Kh\u00F4ng kh\u1EDBp SOP' }}</span>\r\n                      </td>\r\n                      <td class=\"px-3 py-3 font-bold text-slate-700 dark:text-slate-300\">\r\n                        {{ candidate.sourceSample }}\r\n                      </td>\r\n                      <td class=\"px-3 py-3\">\r\n                        @if (candidate.status === 'unmatched' || candidate.status === 'ambiguous') {\r\n                          <select [ngModel]=\"candidate.targetSample || ''\"\r\n                                  (ngModelChange)=\"onTargetSampleChanged(candidate, $event)\"\r\n                                  class=\"w-full min-w-44 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-bold\">\r\n                            <option value=\"\">\u2014 Ch\u1ECDn m\u1EABu \u2014</option>\r\n                            @for (sample of manualSampleOptions(candidate); track sample) {\r\n                              <option [value]=\"sample\">{{ sample }}</option>\r\n                            }\r\n                          </select>\r\n                        } @else {\r\n                          <span class=\"font-bold text-slate-700 dark:text-slate-300\">{{ candidate.targetLabel }}</span>\r\n                        }\r\n                      </td>\r\n                      <td class=\"px-3 py-3 text-slate-500 dark:text-slate-400\">\r\n                        {{ candidate.currentValue || '\u2014' }}\r\n                      </td>\r\n                      <td class=\"px-3 py-3\">\r\n                        <span class=\"font-black\"\r\n                              [class.text-amber-600]=\"candidate.isNd\"\r\n                              [class.text-emerald-650]=\"!candidate.isNd\">\r\n                          {{ displayImportValue(candidate) }}\r\n                        </span>\r\n                      </td>\r\n                      <td class=\"px-3 py-3\">\r\n                        <span class=\"inline-flex px-2 py-1 rounded-lg text-[9px] font-black whitespace-nowrap\"\r\n                              [class]=\"statusClass(candidate)\">\r\n                          {{ statusText(candidate) }}\r\n                        </span>\r\n                      </td>\r\n                    </tr>\r\n                  }\r\n                </tbody>\r\n              </table>\r\n            </div>\r\n          </div>\r\n        }\r\n      }\r\n    </div>\r\n\r\n    <footer class=\"px-5 md:px-7 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/20\">\r\n      <p class=\"text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block\">\r\n        D\u00F2ng b\u1ECF ch\u1ECDn s\u1EBD \u0111\u01B0\u1EE3c gi\u1EEF nguy\u00EAn tr\u00EAn UI.\r\n      </p>\r\n      <div class=\"flex items-center gap-2 ml-auto\">\r\n        <button type=\"button\" (click)=\"requestCancel()\" [disabled]=\"isApplying\"\r\n                class=\"px-4 py-2.5 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition disabled:opacity-40\">\r\n          H\u1EE7y\r\n        </button>\r\n        <button type=\"button\" (click)=\"applySelected()\"\r\n                [disabled]=\"isLoading || isApplying || isReadOnly || selectedCount === 0 || !hasSelectableCandidates\"\r\n                class=\"px-5 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-2\">\r\n          <i class=\"fa-solid\" [class.fa-check]=\"!isApplying\" [class.fa-spinner]=\"isApplying\" [class.fa-spin]=\"isApplying\"></i>\r\n          \u00C1p d\u1EE5ng {{ selectedCount }} th\u00F4ng tin{{ saveOriginalFile ? ' v\u00E0 l\u01B0u t\u1EC7p' : '' }}\r\n        </button>\r\n      </div>\r\n    </footer>\r\n  </section>\r\n</div>\r\n" }]
    }], null, { file: [{
            type: Input
        }], run: [{
            type: Input
        }], draft: [{
            type: Input
        }], config: [{
            type: Input
        }], configKey: [{
            type: Input
        }], masterTargets: [{
            type: Input
        }], isReadOnly: [{
            type: Input
        }], cancelled: [{
            type: Output
        }], applied: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ExcelResultImportModalComponent, { className: "ExcelResultImportModalComponent", filePath: "src/app/features/results/components/excel-result-import-modal.component.ts", lineNumber: 35 }); })();
//# sourceMappingURL=excel-result-import-modal.component.js.map