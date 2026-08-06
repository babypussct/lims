import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
const _c0 = a0 => ["/results", a0];
const _c1 = (a0, a1, a2, a3) => ({ "bg-emerald-50/40 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/30 dark:border-emerald-800/30 cursor-default": a0, "bg-amber-50/50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 hover:shadow": a1, "bg-indigo-50/70 text-indigo-650 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30": a2, "bg-red-50/70 text-red-650 dark:bg-red-950/30 dark:text-red-400 border-red-200/50 dark:border-red-900/30 hover:bg-red-100/70": a3 });
const _forTrack0 = ($index, $item) => $item.version + "_" + ($item.prefix || "");
function ResultEntryHeaderComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 6);
    i0.ɵɵelement(1, "i", 9);
    i0.ɵɵtext(2, " \u0110\u00E3 g\u1ED9p m\u1EBB t\u1ED5ng h\u1EE3p ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(1, _c0, ctx_r0.run.parentMasterId));
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 10);
    i0.ɵɵelement(1, "i", 20);
    i0.ɵɵelementStart(2, "span", 21);
    i0.ɵɵtext(3, "Excel g\u1ED1c");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("href", ctx_r0.draft.page1Data["sourceExcelUrl"] || ctx_r0.draft.page1Data["massHunterExcelUrl"], i0.ɵɵsanitizeUrl)("title", ctx_r0.draft.page1Data["sourceExcelName"] || ctx_r0.draft.page1Data["massHunterExcelName"] || "Xem t\u1EC7p Excel g\u1ED1c \u0111\u00E3 l\u01B0u tr\u00EAn Google Drive");
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 22);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const excelResultFileInput_r4 = i0.ɵɵreference(5); return i0.ɵɵresetView(excelResultFileInput_r4.click()); });
    i0.ɵɵelement(1, "i", 23);
    i0.ɵɵelementStart(2, "span", 24);
    i0.ɵɵtext(3, "Import Excel");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "input", 25, 0);
    i0.ɵɵlistener("change", function ResultEntryHeaderComponent_Conditional_10_Conditional_2_Template_input_change_4_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.selectExcelFile($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing);
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_Conditional_7_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 40);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_Conditional_7_Conditional_7_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r0.openPdf.emit({ pdfUrl: (ctx_r0.draft == null ? null : ctx_r0.draft.pdfViewUrl) || (ctx_r0.draft == null ? null : ctx_r0.draft.pdfUrl), docsUrl: ctx_r0.draft == null ? null : ctx_r0.draft.docsUrl })); });
    i0.ɵɵelement(1, "i", 41);
    i0.ɵɵelementEnd();
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 34)(1, "div", 35);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_Conditional_7_Template_div_click_1_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.restoreVersion.emit({ version: ctx_r0.draft.version })); });
    i0.ɵɵelementStart(2, "span", 36);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 37);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 38);
    i0.ɵɵtemplate(7, ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_Conditional_7_Conditional_7_Template, 2, 0, "button", 39);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("B\u1EA3n hi\u1EC7n t\u1EA1i (v", ctx_r0.draft == null ? null : ctx_r0.draft.version, ")");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Ng\u01B0\u1EDDi in g\u1EA7n nh\u1EA5t: ", ctx_r0.draft == null ? null : ctx_r0.draft.updatedBy, "");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((ctx_r0.draft == null ? null : ctx_r0.draft.pdfViewUrl) || (ctx_r0.draft == null ? null : ctx_r0.draft.pdfUrl) ? 7 : -1);
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Conditional_0_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 44);
    i0.ɵɵtext(1, "(\u0111\u00E3 l\u01B0u tr\u1EEF)");
    i0.ɵɵelementEnd();
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Conditional_0_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 47);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Conditional_0_Conditional_8_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const hist_r10 = i0.ɵɵnextContext(2).$implicit; const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.openPdf.emit({ pdfUrl: hist_r10.pdfViewUrl || hist_r10.pdfUrl, docsUrl: hist_r10.docsUrl })); });
    i0.ɵɵelement(1, "i", 41);
    i0.ɵɵelementEnd();
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 42)(1, "div", 35);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Conditional_0_Template_div_click_1_listener() { i0.ɵɵrestoreView(_r9); const hist_r10 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.restoreVersion.emit({ version: hist_r10.version, prefix: hist_r10.prefix, reportId: hist_r10.reportId || hist_r10._id })); });
    i0.ɵɵelementStart(2, "span", 43);
    i0.ɵɵtext(3);
    i0.ɵɵtemplate(4, ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Conditional_0_Conditional_4_Template, 2, 0, "span", 44);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 45);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 38);
    i0.ɵɵtemplate(8, ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Conditional_0_Conditional_8_Template, 2, 0, "button", 46);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const hist_r10 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2(" B\u1EA3n v", hist_r10.version, " ", hist_r10.prefix && hist_r10.prefix !== "ALL" ? hist_r10.prefix === "_NO_PREFIX_" ? "(Kh\u00F4ng ti\u1EC1n t\u1ED1)" : "(" + hist_r10.prefix + ")" : "", " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(hist_r10.status === "archived" ? 4 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Ng\u01B0\u1EDDi in: ", hist_r10.publishedBy, "");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(hist_r10.pdfViewUrl || hist_r10.pdfUrl ? 8 : -1);
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Conditional_0_Template, 9, 5, "div", 42);
} if (rf & 2) {
    const hist_r10 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵconditional(hist_r10.version !== (ctx_r0.draft == null ? null : ctx_r0.draft.version) || hist_r10.prefix && hist_r10.prefix !== "ALL" ? 0 : -1);
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 30);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.closeRestoreMenu.emit()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(1, "div", 31)(2, "div", 32)(3, "span");
    i0.ɵɵtext(4, "L\u1ECBch s\u1EED phi\u00EAn b\u1EA3n in");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 33);
    i0.ɵɵtext(6, "(Click d\u00F2ng \u0111\u1EC3 kh\u00F4i ph\u1EE5c s\u1ED1 li\u1EC7u)");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(7, ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_Conditional_7_Template, 8, 3, "div", 34);
    i0.ɵɵrepeaterCreate(8, ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_For_9_Template, 1, 1, null, null, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(7);
    i0.ɵɵconditional((ctx_r0.draft == null ? null : ctx_r0.draft.version) ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.historyList);
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 11)(1, "button", 26);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_3_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.toggleRestoreMenu.emit()); });
    i0.ɵɵelement(2, "i", 27);
    i0.ɵɵelementStart(3, "span", 28);
    i0.ɵɵtext(4, "Kh\u00F4i Ph\u1EE5c B\u1EA3n C\u0169");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(5, "i", 29);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, ResultEntryHeaderComponent_Conditional_10_Conditional_3_Conditional_6_Template, 10, 1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("bg-slate-200", ctx_r0.showRestoreMenu)("dark:bg-slate-750", ctx_r0.showRestoreMenu);
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("rotate-180", ctx_r0.showRestoreMenu);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.showRestoreMenu ? 6 : -1);
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 48);
    i0.ɵɵelementStart(1, "span", 49);
    i0.ɵɵtext(2, "\u0110ang L\u01B0u...");
    i0.ɵɵelementEnd();
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 50);
    i0.ɵɵelementStart(1, "span", 51);
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \u0110\u00E3 l\u01B0u", ctx_r0.lastSavedAt ? " " + i0.ɵɵpipeBind2(3, 1, ctx_r0.lastSavedAt, "HH:mm:ss") : "", " ");
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 52);
    i0.ɵɵelementStart(1, "span", 49);
    i0.ɵɵtext(2, "L\u01B0u Th\u1EA5t B\u1EA1i \u2014 Th\u1EED L\u1EA1i");
    i0.ɵɵelementEnd();
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 53);
    i0.ɵɵelementStart(1, "span", 49);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.hasExistingReport ? "D\u1EEF li\u1EC7u m\u1EDBi h\u01A1n PDF" : "C\u00F3 thay \u0111\u1ED5i ch\u01B0a l\u01B0u", " ");
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 54);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.openPdf.emit({ pdfUrl: ctx_r0.currentPdfUrl, docsUrl: ctx_r0.currentDocsUrl })); });
    i0.ɵɵelement(1, "i", 55);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Xem B\u00E1o C\u00E1o PDF");
    i0.ɵɵelementEnd()();
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14)(1, "label", 56);
    i0.ɵɵtext(2, "T\u00E1ch phi\u1EBFu:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 57);
    i0.ɵɵlistener("input", function ResultEntryHeaderComponent_Conditional_10_Conditional_10_Template_input_input_3_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.samplesPerReportChange.emit($event.target.valueAsNumber || null)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 56);
    i0.ɵɵtext(5, "m\u1EABu");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("value", ctx_r0.samplesPerReport || "");
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_10_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 75);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_10_Conditional_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r15); const ctx_r0 = i0.ɵɵnextContext(4); ctx_r0.openPdf.emit({ pdfUrl: ctx_r0.currentPdfUrl, docsUrl: ctx_r0.currentDocsUrl }); return i0.ɵɵresetView(ctx_r0.closeActionsMenu.emit()); });
    i0.ɵɵelementStart(1, "div", 70);
    i0.ɵɵelement(2, "i", 76);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "Xem B\u00E1o C\u00E1o PDF");
    i0.ɵɵelementEnd()();
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 67);
    i0.ɵɵtext(1, " B\u00E1o c\u00E1o v\u00E0 t\u00E0i li\u1EC7u ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(2, ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_10_Conditional_2_Template, 5, 0, "button", 73);
    i0.ɵɵelement(3, "div", 74);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.currentPdfUrl ? 2 : -1);
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 77);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_13_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r16); const ctx_r0 = i0.ɵɵnextContext(3); ctx_r0.closeActionsMenu.emit(); return i0.ɵɵresetView(ctx_r0.unlockToEdit.emit()); });
    i0.ɵɵelementStart(1, "div", 78);
    i0.ɵɵelement(2, "i", 79);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "M\u1EDF Kh\u00F3a v\u00E0 Ch\u1EC9nh S\u1EEDa");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing);
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 80);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_19_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r17); const ctx_r0 = i0.ɵɵnextContext(3); ctx_r0.closeActionsMenu.emit(); return i0.ɵɵresetView(ctx_r0.deleteVirtualMaster.emit()); });
    i0.ɵɵelementStart(1, "div", 81);
    i0.ɵɵelement(2, "i", 82);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "G\u1EE1 G\u1ED9p v\u00E0 X\u00F3a M\u1EBB \u1EA2o");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing);
} }
function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 58);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r14); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.closeActionsMenu.emit()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(1, "div", 59)(2, "div", 60);
    i0.ɵɵelement(3, "div", 61);
    i0.ɵɵelementStart(4, "div", 62)(5, "h3", 63);
    i0.ɵɵelement(6, "i", 64);
    i0.ɵɵtext(7, " Thao T\u00E1c Nhanh ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "button", 65);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r14); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.closeActionsMenu.emit()); });
    i0.ɵɵelement(9, "i", 66);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(10, ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_10_Template, 4, 1);
    i0.ɵɵelementStart(11, "div", 67);
    i0.ɵɵtext(12, " Qu\u1EA3n tr\u1ECB m\u1EBB ch\u1EA1y ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(13, ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_13_Template, 5, 1, "button", 68);
    i0.ɵɵelementStart(14, "button", 69);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Conditional_21_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r14); const ctx_r0 = i0.ɵɵnextContext(2); ctx_r0.closeActionsMenu.emit(); return i0.ɵɵresetView(ctx_r0.openResetModal.emit()); });
    i0.ɵɵelementStart(15, "div", 70);
    i0.ɵɵelement(16, "i", 71);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span");
    i0.ɵɵtext(18, "X\u00F3a Ho\u00E0n To\u00E0n K\u1EBFt Qu\u1EA3");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(19, ResultEntryHeaderComponent_Conditional_10_Conditional_21_Conditional_19_Template, 5, 1, "button", 72);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(10);
    i0.ɵɵconditional(ctx_r0.currentPdfUrl || ctx_r0.currentDocsUrl ? 10 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional((ctx_r0.draft == null ? null : ctx_r0.draft.status) === "completed" ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional((ctx_r0.run == null ? null : ctx_r0.run.isVirtualMaster) ? 19 : -1);
} }
function ResultEntryHeaderComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 8);
    i0.ɵɵtemplate(1, ResultEntryHeaderComponent_Conditional_10_Conditional_1_Template, 4, 2, "a", 10)(2, ResultEntryHeaderComponent_Conditional_10_Conditional_2_Template, 6, 1)(3, ResultEntryHeaderComponent_Conditional_10_Conditional_3_Template, 7, 8, "div", 11);
    i0.ɵɵelementStart(4, "button", 12);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveDraft.emit()); });
    i0.ɵɵtemplate(5, ResultEntryHeaderComponent_Conditional_10_Conditional_5_Template, 3, 0)(6, ResultEntryHeaderComponent_Conditional_10_Conditional_6_Template, 4, 4)(7, ResultEntryHeaderComponent_Conditional_10_Conditional_7_Template, 3, 0)(8, ResultEntryHeaderComponent_Conditional_10_Conditional_8_Template, 3, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, ResultEntryHeaderComponent_Conditional_10_Conditional_9_Template, 4, 0, "button", 13)(10, ResultEntryHeaderComponent_Conditional_10_Conditional_10_Template, 6, 1, "div", 14);
    i0.ɵɵelementStart(11, "button", 15);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.publishReport.emit()); });
    i0.ɵɵelement(12, "i", 16);
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 11)(16, "button", 17);
    i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Conditional_10_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.toggleActionsMenu.emit()); });
    i0.ɵɵelement(17, "i", 18);
    i0.ɵɵelementStart(18, "span");
    i0.ɵɵtext(19, "THAO T\u00C1C");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(20, "i", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(21, ResultEntryHeaderComponent_Conditional_10_Conditional_21_Template, 20, 4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r0.draft == null ? null : ctx_r0.draft.page1Data == null ? null : ctx_r0.draft.page1Data["sourceExcelUrl"]) || (ctx_r0.draft == null ? null : ctx_r0.draft.page1Data == null ? null : ctx_r0.draft.page1Data["massHunterExcelUrl"]) ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r0.isReadOnly ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.historyList.length > 0 ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing || ctx_r0.autoSaveStatus === "saving" || ctx_r0.autoSaveStatus === "synced")("ngClass", i0.ɵɵpureFunction4(28, _c1, ctx_r0.autoSaveStatus === "synced", ctx_r0.autoSaveStatus === "modified", ctx_r0.autoSaveStatus === "saving", ctx_r0.autoSaveStatus === "error"))("title", ctx_r0.autoSaveStatus === "synced" ? "D\u1EEF li\u1EC7u ph\u00E2n t\u00EDch \u0111\u00E3 \u0111\u01B0\u1EE3c t\u1EF1 \u0111\u1ED9ng \u0111\u1ED3ng b\u1ED9 th\u1EDDi gian th\u1EF1c" : "L\u01B0u nh\u00E1p s\u1ED1 li\u1EC7u hi\u1EC7n t\u1EA1i l\u00EAn \u0111\u00E1m m\u00E2y");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.autoSaveStatus === "saving" ? 5 : ctx_r0.autoSaveStatus === "synced" ? 6 : ctx_r0.autoSaveStatus === "error" ? 7 : 8);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r0.currentPdfUrl ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r0.isReadOnly ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing || ctx_r0.isReadOnly)("title", ctx_r0.printButtonLabel);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-circle-check", !ctx_r0.isPublishing)("fa-spinner", ctx_r0.isPublishing)("fa-spin", ctx_r0.isPublishing);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.printButtonLabel);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("bg-slate-200", ctx_r0.showActionsMenu)("dark:bg-slate-750", ctx_r0.showActionsMenu);
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-spin", ctx_r0.showActionsMenu);
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("rotate-180", ctx_r0.showActionsMenu);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.showActionsMenu ? 21 : -1);
} }
export class ResultEntryHeaderComponent {
    constructor() {
        // ── Data Inputs ──────────────────────────────────────────────────────────
        this.run = null;
        this.draft = null;
        this.historyList = [];
        // ── State Inputs ─────────────────────────────────────────────────────────
        this.autoSaveStatus = 'synced';
        this.lastSavedAt = null;
        this.hasExistingReport = false;
        this.isProcessing = false;
        this.isPublishing = false;
        this.isReadOnly = false;
        this.showRestoreMenu = false;
        this.showActionsMenu = false;
        this.samplesPerReport = null;
        this.currentPdfUrl = null;
        this.currentDocsUrl = null;
        this.printButtonLabel = 'Xuất báo cáo';
        // ── Action Outputs ────────────────────────────────────────────────────────
        this.goBack = new EventEmitter();
        this.saveDraft = new EventEmitter();
        this.publishReport = new EventEmitter();
        this.unlockToEdit = new EventEmitter();
        this.openResetModal = new EventEmitter();
        this.deleteVirtualMaster = new EventEmitter();
        this.openPdf = new EventEmitter();
        this.restoreVersion = new EventEmitter();
        this.samplesPerReportChange = new EventEmitter();
        this.toggleRestoreMenu = new EventEmitter();
        this.closeRestoreMenu = new EventEmitter();
        this.toggleActionsMenu = new EventEmitter();
        this.closeActionsMenu = new EventEmitter();
        this.importExcel = new EventEmitter();
    }
    selectExcelFile(event) {
        const input = event.target;
        const file = input.files?.[0];
        if (file)
            this.importExcel.emit(file);
        // Cho phép chọn lại chính file vừa đóng modal.
        input.value = '';
    }
    static { this.ɵfac = function ResultEntryHeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResultEntryHeaderComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResultEntryHeaderComponent, selectors: [["app-result-entry-header"]], inputs: { run: "run", draft: "draft", historyList: "historyList", autoSaveStatus: "autoSaveStatus", lastSavedAt: "lastSavedAt", hasExistingReport: "hasExistingReport", isProcessing: "isProcessing", isPublishing: "isPublishing", isReadOnly: "isReadOnly", showRestoreMenu: "showRestoreMenu", showActionsMenu: "showActionsMenu", samplesPerReport: "samplesPerReport", currentPdfUrl: "currentPdfUrl", currentDocsUrl: "currentDocsUrl", printButtonLabel: "printButtonLabel" }, outputs: { goBack: "goBack", saveDraft: "saveDraft", publishReport: "publishReport", unlockToEdit: "unlockToEdit", openResetModal: "openResetModal", deleteVirtualMaster: "deleteVirtualMaster", openPdf: "openPdf", restoreVersion: "restoreVersion", samplesPerReportChange: "samplesPerReportChange", toggleRestoreMenu: "toggleRestoreMenu", closeRestoreMenu: "closeRestoreMenu", toggleActionsMenu: "toggleActionsMenu", closeActionsMenu: "closeActionsMenu", importExcel: "importExcel" }, decls: 11, vars: 3, consts: [["excelResultFileInput", ""], [1, "sticky", "top-0", "bg-white/80", "dark:bg-slate-900/80", "backdrop-blur-md", "border-b", "border-slate-200/60", "dark:border-slate-800/60", "px-6", "py-4", "flex", "items-center", "justify-between", "shrink-0", "z-40", "transition-colors", "duration-300"], [1, "flex", "items-center", "gap-3.5"], [1, "w-10", "h-10", "rounded-xl", "hover:bg-slate-100", "dark:hover:bg-slate-800", "text-slate-600", "dark:text-slate-400", "flex", "items-center", "justify-center", "transition", "active:scale-95", "duration-150", "border", "border-slate-200/10", "dark:border-slate-700/20", 3, "click"], [1, "fa-solid", "fa-arrow-left", "text-sm"], [1, "text-[10px]", "font-black", "uppercase", "text-fuchsia-600", "dark:text-fuchsia-450", "tracking-wider", "mb-0.5", "flex", "items-center", "gap-2"], ["title", "M\u1EBB ch\u1EA1y n\u00E0y \u0111\u00E3 \u0111\u01B0\u1EE3c g\u1ED9p s\u1ED1 li\u1EC7u. Nh\u1EA5n \u0111\u1EC3 \u0111i t\u1EDBi m\u1EBB t\u1ED5ng h\u1EE3p.", 1, "px-1.5", "py-0.5", "rounded", "bg-fuchsia-50", "dark:bg-fuchsia-950/20", "border", "border-fuchsia-200", "dark:border-fuchsia-900/40", "text-fuchsia-600", "dark:text-fuchsia-400", "text-[8px]", "font-black", "uppercase", "hover:bg-fuchsia-100", "dark:hover:bg-fuchsia-900/30", "transition-colors", "flex", "items-center", "gap-1", "cursor-pointer", "shadow-xs", 3, "routerLink"], [1, "text-base", "font-black", "text-slate-800", "dark:text-slate-100", "flex", "items-center", "gap-2", "m-0", "tracking-tight"], [1, "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-link", "text-[7px]", "animate-pulse"], ["target", "_blank", "rel", "noopener noreferrer", 1, "px-4", "py-2", "text-xs", "font-black", "text-sky-700", "dark:text-sky-400", "bg-sky-50", "dark:bg-sky-950/25", "border", "border-sky-200/60", "dark:border-sky-900/40", "hover:bg-sky-100", "dark:hover:bg-sky-900/30", "rounded-xl", "transition", "flex", "items-center", "gap-2", "active:scale-95", "shadow-sm", 3, "href", "title"], [1, "relative"], [1, "px-4", "py-2", "text-xs", "font-bold", "rounded-xl", "border", "transition-all", "duration-300", "flex", "items-center", "gap-2", "shadow-sm", "active:scale-95", "disabled:opacity-75", 3, "click", "disabled", "ngClass", "title"], [1, "px-4", "py-2", "text-xs", "font-bold", "text-red-655", "dark:text-red-400", "bg-red-50", "dark:bg-red-950/20", "border", "border-red-100/50", "dark:border-red-800/30", "hover:bg-red-100", "dark:hover:bg-red-950/30", "rounded-xl", "transition", "flex", "items-center", "gap-1.5", "cursor-pointer", "no-underline", "shadow-sm", "hover:shadow", "active:scale-95", "duration-150"], [1, "flex", "items-center", "gap-2", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700/60", "rounded-xl", "px-3", "py-1.5", "h-[40px]"], [1, "px-5", "py-2.5", "text-xs", "font-black", "text-white", "bg-gradient-to-r", "from-violet-600", "via-fuchsia-600", "to-indigo-600", "hover:from-violet-700", "hover:via-fuchsia-700", "hover:to-indigo-700", "rounded-xl", "shadow-md", "shadow-indigo-500/10", "hover:shadow-indigo-500/20", "active:scale-95", "transition-all", "duration-150", "flex", "items-center", "gap-2", "disabled:opacity-50", 3, "click", "disabled", "title"], [1, "fa-solid"], [1, "px-4", "py-2.5", "text-xs", "font-black", "text-slate-600", "dark:text-slate-300", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700/60", "hover:bg-slate-200", "dark:hover:bg-slate-750", "rounded-xl", "transition", "flex", "items-center", "gap-2", "active:scale-95", "disabled:opacity-50", "duration-150", 3, "click", "disabled"], [1, "fa-solid", "fa-gear"], [1, "fa-solid", "fa-chevron-down", "text-[9px]", "opacity-60", "transition-transform", "duration-200"], [1, "fa-solid", "fa-cloud-arrow-up"], [1, "hidden", "2xl:inline"], ["type", "button", "title", "Nh\u1EADp nhanh Final-Conc. t\u1EEB Excel v\u00E0 xem tr\u01B0\u1EDBc tr\u01B0\u1EDBc khi \u00E1p d\u1EE5ng", 1, "px-4", "py-2", "text-xs", "font-black", "text-emerald-700", "dark:text-emerald-400", "bg-emerald-50", "dark:bg-emerald-950/25", "border", "border-emerald-200/60", "dark:border-emerald-900/40", "hover:bg-emerald-100", "dark:hover:bg-emerald-900/30", "rounded-xl", "transition", "flex", "items-center", "gap-2", "active:scale-95", "disabled:opacity-50", "shadow-sm", 3, "click", "disabled"], [1, "fa-solid", "fa-file-excel"], [1, "hidden", "xl:inline"], ["type", "file", "accept", ".xlsx,.xls", 1, "hidden", 3, "change"], ["title", "Kh\u00F4i ph\u1EE5c s\u1ED1 li\u1EC7u t\u1EEB c\u00E1c b\u1EA3n in c\u0169", 1, "px-4", "py-2", "text-xs", "font-bold", "text-slate-650", "dark:text-slate-355", "bg-slate-100", "dark:bg-slate-800", "hover:bg-slate-200", "dark:hover:bg-slate-750", "border", "border-slate-200/40", "dark:border-slate-700/40", "rounded-xl", "transition", "flex", "items-center", "gap-1.5", "disabled:opacity-50", "active:scale-95", "shadow-sm", "hover:shadow", 3, "click", "disabled"], [1, "fa-solid", "fa-clock-rotate-left"], [1, "hidden", "md:inline"], [1, "fa-solid", "fa-chevron-down", "text-[9px]", "opacity-70", "transition-transform", "duration-200"], [1, "fixed", "inset-0", "z-40", "bg-transparent", 3, "click"], [1, "absolute", "right-0", "top-full", "mt-1.5", "w-80", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/60", "dark:border-slate-800", "rounded-2xl", "shadow-2xl", "z-50", "py-2", "max-h-80", "overflow-y-auto", "custom-scrollbar"], [1, "px-3.5", "py-1.5", "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "border-b", "border-slate-100", "dark:border-slate-800/80", "mb-1.5", "flex", "items-center", "justify-between"], [1, "text-[8px]", "font-normal", "text-slate-400", "lowercase", "select-none"], [1, "px-3.5", "py-2", "hover:bg-slate-50", "dark:hover:bg-slate-800/40", "flex", "items-center", "justify-between", "gap-2", "border-b", "border-slate-100/60", "dark:border-slate-800/50"], [1, "flex-1", "min-w-0", "cursor-pointer", "group/item", 3, "click"], [1, "font-black", "text-indigo-600", "dark:text-indigo-400", "text-xs", "block", "group-hover/item:underline"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "block", "mt-0.5"], [1, "flex", "items-center", "gap-1", "shrink-0"], ["title", "M\u1EDF PDF b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-red-50", "hover:bg-red-100", "text-red-655", "dark:bg-red-950/30", "dark:hover:bg-red-900/40", "dark:text-red-400", "flex", "items-center", "justify-center", "transition", "active:scale-90", "no-underline", "cursor-pointer"], ["title", "M\u1EDF PDF b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-red-50", "hover:bg-red-100", "text-red-655", "dark:bg-red-950/30", "dark:hover:bg-red-900/40", "dark:text-red-400", "flex", "items-center", "justify-center", "transition", "active:scale-90", "no-underline", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-file-pdf", "text-[10px]"], [1, "px-3.5", "py-2", "hover:bg-slate-50", "dark:hover:bg-slate-800/40", "flex", "items-center", "justify-between", "gap-2", "border-b", "border-slate-100/60", "dark:border-slate-800/50", "last:border-b-0"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "text-xs", "block", "group-hover/item:underline"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "font-normal", "ml-1"], [1, "text-[10px]", "text-slate-450", "dark:text-slate-500", "block", "mt-0.5"], ["title", "M\u1EDF PDF b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-red-50", "hover:bg-red-100", "text-red-655", "dark:bg-red-950/30", "dark:hover:bg-red-900/40", "dark:text-red-450", "flex", "items-center", "justify-center", "transition", "active:scale-90", "no-underline", "cursor-pointer"], ["title", "M\u1EDF PDF b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-red-50", "hover:bg-red-100", "text-red-655", "dark:bg-red-950/30", "dark:hover:bg-red-900/40", "dark:text-red-450", "flex", "items-center", "justify-center", "transition", "active:scale-90", "no-underline", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-indigo-500", "text-sm"], [1, "text-[10px]", "uppercase", "tracking-wider", "font-black"], [1, "fa-solid", "fa-circle-check", "text-emerald-500", "text-sm"], [1, "text-[10px]", "uppercase", "tracking-wider", "font-black", "text-emerald-600", "dark:text-emerald-400"], [1, "fa-solid", "fa-triangle-exclamation", "text-red-500", "text-sm"], [1, "fa-solid", "fa-cloud-arrow-up", "text-amber-500", "animate-pulse", "text-sm"], [1, "px-4", "py-2", "text-xs", "font-bold", "text-red-655", "dark:text-red-400", "bg-red-50", "dark:bg-red-950/20", "border", "border-red-100/50", "dark:border-red-800/30", "hover:bg-red-100", "dark:hover:bg-red-950/30", "rounded-xl", "transition", "flex", "items-center", "gap-1.5", "cursor-pointer", "no-underline", "shadow-sm", "hover:shadow", "active:scale-95", "duration-150", 3, "click"], [1, "fa-solid", "fa-file-pdf"], [1, "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400", "whitespace-nowrap"], ["type", "number", "placeholder", "T\u1EF1 \u0111\u1ED9ng", "min", "1", 1, "w-12", "bg-transparent", "border-none", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "focus:ring-0", "p-0", "text-center", 3, "input", "value"], [1, "fixed", "inset-0", "z-40", "bg-black/40", "md:bg-transparent", 3, "click"], [1, "fixed", "inset-x-0", "bottom-0", "z-50", "p-4", "pt-0", "md:absolute", "md:inset-auto", "md:right-0", "md:top-full", "md:mt-2.5", "md:p-0", "md:bottom-auto"], [1, "w-full", "max-w-lg", "mx-auto", "md:w-80", "md:max-w-none", "md:mx-0", "bg-white", "dark:bg-slate-900", "rounded-t-3xl", "md:rounded-2xl", "border", "border-slate-200", "dark:border-slate-700", "shadow-2xl", "p-4", "md:p-3", "animate-in", "fade-in", "slide-in-from-bottom-4", "md:slide-in-from-top-2", "duration-200"], [1, "w-10", "h-1", "bg-slate-300", "dark:bg-slate-600", "rounded-full", "mx-auto", "mb-4", "md:hidden"], [1, "flex", "items-center", "justify-between", "mb-3", "md:hidden"], [1, "text-base", "font-black", "text-slate-800", "dark:text-slate-100", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-gear", "text-slate-400"], [1, "w-8", "h-8", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "flex", "items-center", "justify-center", "text-slate-500", "hover:bg-slate-200", "dark:hover:bg-slate-700", "transition", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-xmark", "text-sm"], [1, "px-3", "py-1.5", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "w-full", "text-left", "px-4", "py-3.5", "md:py-3", "text-sm", "font-bold", "text-amber-600", "dark:text-amber-400", "hover:bg-amber-50", "dark:hover:bg-amber-955/30", "rounded-xl", "transition-all", "duration-150", "flex", "items-center", "gap-3", "border-0", "bg-transparent", "cursor-pointer", "active:scale-[0.98]", 3, "disabled"], [1, "w-full", "text-left", "px-4", "py-3.5", "md:py-3", "text-sm", "font-bold", "text-red-600", "dark:text-red-400", "hover:bg-red-50", "dark:hover:bg-red-950/30", "rounded-xl", "transition-all", "duration-150", "flex", "items-center", "gap-3", "border-0", "bg-transparent", "cursor-pointer", "active:scale-[0.98]", 3, "click", "disabled"], [1, "w-9", "h-9", "md:w-8", "md:h-8", "rounded-lg", "bg-red-100", "dark:bg-red-900/40", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-trash-can", "text-red-500"], [1, "w-full", "text-left", "px-4", "py-3.5", "md:py-3", "text-sm", "font-bold", "text-rose-600", "dark:text-rose-400", "hover:bg-rose-50", "dark:hover:bg-rose-950/30", "rounded-xl", "transition-all", "duration-150", "flex", "items-center", "gap-3", "border-0", "bg-transparent", "cursor-pointer", "active:scale-[0.98]", "mt-1", "border-t", "border-slate-100", "dark:border-slate-800", 3, "disabled"], [1, "w-full", "text-left", "px-4", "py-3.5", "md:py-3", "text-sm", "font-bold", "text-red-655", "dark:text-red-400", "hover:bg-red-50", "dark:hover:bg-red-950/30", "rounded-xl", "transition-all", "duration-150", "flex", "items-center", "gap-3", "border-0", "bg-transparent", "cursor-pointer", "active:scale-[0.98]"], [1, "border-t", "border-slate-200", "dark:border-slate-800", "my-2", "mx-2"], [1, "w-full", "text-left", "px-4", "py-3.5", "md:py-3", "text-sm", "font-bold", "text-red-655", "dark:text-red-400", "hover:bg-red-50", "dark:hover:bg-red-950/30", "rounded-xl", "transition-all", "duration-150", "flex", "items-center", "gap-3", "border-0", "bg-transparent", "cursor-pointer", "active:scale-[0.98]", 3, "click"], [1, "fa-solid", "fa-file-pdf", "text-red-500"], [1, "w-full", "text-left", "px-4", "py-3.5", "md:py-3", "text-sm", "font-bold", "text-amber-600", "dark:text-amber-400", "hover:bg-amber-50", "dark:hover:bg-amber-955/30", "rounded-xl", "transition-all", "duration-150", "flex", "items-center", "gap-3", "border-0", "bg-transparent", "cursor-pointer", "active:scale-[0.98]", 3, "click", "disabled"], [1, "w-9", "h-9", "md:w-8", "md:h-8", "rounded-lg", "bg-amber-100", "dark:bg-amber-900/40", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-unlock-keyhole", "text-amber-500"], [1, "w-full", "text-left", "px-4", "py-3.5", "md:py-3", "text-sm", "font-bold", "text-rose-600", "dark:text-rose-400", "hover:bg-rose-50", "dark:hover:bg-rose-950/30", "rounded-xl", "transition-all", "duration-150", "flex", "items-center", "gap-3", "border-0", "bg-transparent", "cursor-pointer", "active:scale-[0.98]", "mt-1", "border-t", "border-slate-100", "dark:border-slate-800", 3, "click", "disabled"], [1, "w-9", "h-9", "md:w-8", "md:h-8", "rounded-lg", "bg-rose-100", "dark:bg-rose-900/40", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-unlink", "text-rose-500"]], template: function ResultEntryHeaderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 1)(1, "div", 2)(2, "button", 3);
            i0.ɵɵlistener("click", function ResultEntryHeaderComponent_Template_button_click_2_listener() { return ctx.goBack.emit(); });
            i0.ɵɵelement(3, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div")(5, "span", 5);
            i0.ɵɵtext(6);
            i0.ɵɵtemplate(7, ResultEntryHeaderComponent_Conditional_7_Template, 3, 3, "a", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "h3", 7);
            i0.ɵɵtext(9, " Nh\u1EADp D\u1EEF Li\u1EC7u Ph\u00E2n T\u00EDch \u2014 M\u1EBB Ch\u1EA1y ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(10, ResultEntryHeaderComponent_Conditional_10_Template, 22, 33, "div", 8);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate1(" ", ctx.run ? ctx.run.sopName : "\u0110ang t\u1EA3i...", " ");
            i0.ɵɵadvance();
            i0.ɵɵconditional((ctx.run == null ? null : ctx.run.parentMasterId) ? 7 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.run && ctx.draft ? 10 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe, RouterModule, i2.RouterLink, FormsModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ResultEntryHeaderComponent, [{
        type: Component,
        args: [{ selector: 'app-result-entry-header', standalone: true, imports: [CommonModule, RouterModule, FormsModule], template: "<!-- Sticky Header (Glassmorphism design) -->\r\n<div class=\"sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-6 py-4 flex items-center justify-between shrink-0 z-40 transition-colors duration-300\">\r\n  <!-- Left: Back + Title -->\r\n  <div class=\"flex items-center gap-3.5\">\r\n    <button (click)=\"goBack.emit()\"\r\n            class=\"w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center transition active:scale-95 duration-150 border border-slate-200/10 dark:border-slate-700/20\">\r\n      <i class=\"fa-solid fa-arrow-left text-sm\"></i>\r\n    </button>\r\n    <div>\r\n      <span class=\"text-[10px] font-black uppercase text-fuchsia-600 dark:text-fuchsia-450 tracking-wider mb-0.5 flex items-center gap-2\">\r\n        {{ run ? run.sopName : '\u0110ang t\u1EA3i...' }}\r\n        @if (run?.parentMasterId) {\r\n          <a [routerLink]=\"['/results', run.parentMasterId]\"\r\n             class=\"px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-200 dark:border-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-black uppercase hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition-colors flex items-center gap-1 cursor-pointer shadow-xs\"\r\n             title=\"M\u1EBB ch\u1EA1y n\u00E0y \u0111\u00E3 \u0111\u01B0\u1EE3c g\u1ED9p s\u1ED1 li\u1EC7u. Nh\u1EA5n \u0111\u1EC3 \u0111i t\u1EDBi m\u1EBB t\u1ED5ng h\u1EE3p.\">\r\n            <i class=\"fa-solid fa-link text-[7px] animate-pulse\"></i> \u0110\u00E3 g\u1ED9p m\u1EBB t\u1ED5ng h\u1EE3p\r\n          </a>\r\n        }\r\n      </span>\r\n      <h3 class=\"text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 m-0 tracking-tight\">\r\n        Nh\u1EADp D\u1EEF Li\u1EC7u Ph\u00E2n T\u00EDch \u2014 M\u1EBB Ch\u1EA1y\r\n      </h3>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Right: Toolbar Buttons -->\r\n  @if (run && draft) {\r\n    <div class=\"flex items-center gap-2\">\r\n\r\n      @if (draft?.page1Data?.['sourceExcelUrl'] || draft?.page1Data?.['massHunterExcelUrl']) {\r\n        <a [href]=\"draft.page1Data['sourceExcelUrl'] || draft.page1Data['massHunterExcelUrl']\"\r\n           target=\"_blank\"\r\n           rel=\"noopener noreferrer\"\r\n           class=\"px-4 py-2 text-xs font-black text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/25 border border-sky-200/60 dark:border-sky-900/40 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-xl transition flex items-center gap-2 active:scale-95 shadow-sm\"\r\n           [title]=\"draft.page1Data['sourceExcelName'] || draft.page1Data['massHunterExcelName'] || 'Xem t\u1EC7p Excel g\u1ED1c \u0111\u00E3 l\u01B0u tr\u00EAn Google Drive'\">\r\n          <i class=\"fa-solid fa-cloud-arrow-up\"></i>\r\n          <span class=\"hidden 2xl:inline\">Excel g\u1ED1c</span>\r\n        </a>\r\n      }\r\n\r\n      @if (!isReadOnly) {\r\n        <button type=\"button\"\r\n                (click)=\"excelResultFileInput.click()\"\r\n                [disabled]=\"isProcessing\"\r\n                class=\"px-4 py-2 text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200/60 dark:border-emerald-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl transition flex items-center gap-2 active:scale-95 disabled:opacity-50 shadow-sm\"\r\n                title=\"Nh\u1EADp nhanh Final-Conc. t\u1EEB Excel v\u00E0 xem tr\u01B0\u1EDBc tr\u01B0\u1EDBc khi \u00E1p d\u1EE5ng\">\r\n          <i class=\"fa-solid fa-file-excel\"></i>\r\n          <span class=\"hidden xl:inline\">Import Excel</span>\r\n        </button>\r\n        <input #excelResultFileInput\r\n               type=\"file\"\r\n               accept=\".xlsx,.xls\"\r\n               class=\"hidden\"\r\n               (change)=\"selectExcelFile($event)\">\r\n      }\r\n\r\n      <!-- Restore Version Dropdown -->\r\n      @if (historyList.length > 0) {\r\n        <div class=\"relative\">\r\n          <button [disabled]=\"isProcessing\"\r\n                  (click)=\"toggleRestoreMenu.emit()\"\r\n                  class=\"px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-355 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200/40 dark:border-slate-700/40 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 active:scale-95 shadow-sm hover:shadow\"\r\n                  [class.bg-slate-200]=\"showRestoreMenu\"\r\n                  [class.dark:bg-slate-750]=\"showRestoreMenu\"\r\n                  title=\"Kh\u00F4i ph\u1EE5c s\u1ED1 li\u1EC7u t\u1EEB c\u00E1c b\u1EA3n in c\u0169\">\r\n            <i class=\"fa-solid fa-clock-rotate-left\"></i>\r\n            <span class=\"hidden md:inline\">Kh\u00F4i Ph\u1EE5c B\u1EA3n C\u0169</span>\r\n            <i class=\"fa-solid fa-chevron-down text-[9px] opacity-70 transition-transform duration-200\"\r\n               [class.rotate-180]=\"showRestoreMenu\"></i>\r\n          </button>\r\n\r\n          @if (showRestoreMenu) {\r\n            <!-- Backdrop -->\r\n            <div class=\"fixed inset-0 z-40 bg-transparent\" (click)=\"closeRestoreMenu.emit()\"></div>\r\n            <!-- Dropdown -->\r\n            <div class=\"absolute right-0 top-full mt-1.5 w-80 bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 max-h-80 overflow-y-auto custom-scrollbar\">\r\n              <div class=\"px-3.5 py-1.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 mb-1.5 flex items-center justify-between\">\r\n                <span>L\u1ECBch s\u1EED phi\u00EAn b\u1EA3n in</span>\r\n                <span class=\"text-[8px] font-normal text-slate-400 lowercase select-none\">(Click d\u00F2ng \u0111\u1EC3 kh\u00F4i ph\u1EE5c s\u1ED1 li\u1EC7u)</span>\r\n              </div>\r\n\r\n              <!-- B\u1EA3n hi\u1EC7n t\u1EA1i -->\r\n              @if (draft?.version) {\r\n                <div class=\"px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-between gap-2 border-b border-slate-100/60 dark:border-slate-800/50\">\r\n                  <div (click)=\"restoreVersion.emit({ version: draft.version })\"\r\n                       class=\"flex-1 min-w-0 cursor-pointer group/item\">\r\n                    <span class=\"font-black text-indigo-600 dark:text-indigo-400 text-xs block group-hover/item:underline\">B\u1EA3n hi\u1EC7n t\u1EA1i (v{{ draft?.version }})</span>\r\n                    <span class=\"text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5\">Ng\u01B0\u1EDDi in g\u1EA7n nh\u1EA5t: {{ draft?.updatedBy }}</span>\r\n                  </div>\r\n                  <div class=\"flex items-center gap-1 shrink-0\">\r\n                    @if (draft?.pdfViewUrl || draft?.pdfUrl) {\r\n                      <button (click)=\"openPdf.emit({ pdfUrl: draft?.pdfViewUrl || draft?.pdfUrl, docsUrl: draft?.docsUrl })\"\r\n                              class=\"w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-655 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 flex items-center justify-center transition active:scale-90 no-underline cursor-pointer\"\r\n                              title=\"M\u1EDF PDF b\u1EA3n n\u00E0y\">\r\n                        <i class=\"fa-solid fa-file-pdf text-[10px]\"></i>\r\n                      </button>\r\n                    }\r\n                  </div>\r\n                </div>\r\n              }\r\n\r\n              <!-- C\u00E1c b\u1EA3n c\u0169 -->\r\n              @for (hist of historyList; track hist.version + '_' + (hist.prefix || '')) {\r\n                @if (hist.version !== draft?.version || (hist.prefix && hist.prefix !== 'ALL')) {\r\n                  <div class=\"px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-between gap-2 border-b border-slate-100/60 dark:border-slate-800/50 last:border-b-0\">\r\n                    <div (click)=\"restoreVersion.emit({ version: hist.version, prefix: hist.prefix, reportId: hist.reportId || hist._id })\"\r\n                         class=\"flex-1 min-w-0 cursor-pointer group/item\">\r\n                      <span class=\"font-bold text-slate-700 dark:text-slate-200 text-xs block group-hover/item:underline\">\r\n                        B\u1EA3n v{{ hist.version }} {{ hist.prefix && hist.prefix !== 'ALL' ? (hist.prefix === '_NO_PREFIX_' ? '(Kh\u00F4ng ti\u1EC1n t\u1ED1)' : '(' + hist.prefix + ')') : '' }}\r\n                        @if (hist.status === 'archived') {\r\n                          <span class=\"text-[9px] text-slate-400 dark:text-slate-500 font-normal ml-1\">(\u0111\u00E3 l\u01B0u tr\u1EEF)</span>\r\n                        }\r\n                      </span>\r\n                      <span class=\"text-[10px] text-slate-450 dark:text-slate-500 block mt-0.5\">Ng\u01B0\u1EDDi in: {{ hist.publishedBy }}</span>\r\n                    </div>\r\n                    <div class=\"flex items-center gap-1 shrink-0\">\r\n                      @if (hist.pdfViewUrl || hist.pdfUrl) {\r\n                        <button (click)=\"openPdf.emit({ pdfUrl: hist.pdfViewUrl || hist.pdfUrl, docsUrl: hist.docsUrl })\"\r\n                                class=\"w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-655 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-450 flex items-center justify-center transition active:scale-90 no-underline cursor-pointer\"\r\n                                title=\"M\u1EDF PDF b\u1EA3n n\u00E0y\">\r\n                          <i class=\"fa-solid fa-file-pdf text-[10px]\"></i>\r\n                        </button>\r\n                      }\r\n                    </div>\r\n                  </div>\r\n                }\r\n              }\r\n            </div>\r\n          }\r\n        </div>\r\n      }\r\n\r\n      <!-- Cloud Save Button -->\r\n      <button (click)=\"saveDraft.emit()\"\r\n              [disabled]=\"isProcessing || autoSaveStatus === 'saving' || autoSaveStatus === 'synced'\"\r\n              class=\"px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-300 flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-75\"\r\n              [ngClass]=\"{\r\n                'bg-emerald-50/40 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/30 dark:border-emerald-800/30 cursor-default': autoSaveStatus === 'synced',\r\n                'bg-amber-50/50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 hover:shadow': autoSaveStatus === 'modified',\r\n                'bg-indigo-50/70 text-indigo-650 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30': autoSaveStatus === 'saving',\r\n                'bg-red-50/70 text-red-650 dark:bg-red-950/30 dark:text-red-400 border-red-200/50 dark:border-red-900/30 hover:bg-red-100/70': autoSaveStatus === 'error'\r\n              }\"\r\n              [title]=\"autoSaveStatus === 'synced' ? 'D\u1EEF li\u1EC7u ph\u00E2n t\u00EDch \u0111\u00E3 \u0111\u01B0\u1EE3c t\u1EF1 \u0111\u1ED9ng \u0111\u1ED3ng b\u1ED9 th\u1EDDi gian th\u1EF1c' : 'L\u01B0u nh\u00E1p s\u1ED1 li\u1EC7u hi\u1EC7n t\u1EA1i l\u00EAn \u0111\u00E1m m\u00E2y'\">\r\n        @if (autoSaveStatus === 'saving') {\r\n          <i class=\"fa-solid fa-spinner fa-spin text-indigo-500 text-sm\"></i>\r\n          <span class=\"text-[10px] uppercase tracking-wider font-black\">\u0110ang L\u01B0u...</span>\r\n        } @else if (autoSaveStatus === 'synced') {\r\n          <i class=\"fa-solid fa-circle-check text-emerald-500 text-sm\"></i>\r\n          <span class=\"text-[10px] uppercase tracking-wider font-black text-emerald-600 dark:text-emerald-400\">\r\n            \u0110\u00E3 l\u01B0u{{ lastSavedAt ? ' ' + (lastSavedAt | date:'HH:mm:ss') : '' }}\r\n          </span>\r\n        } @else if (autoSaveStatus === 'error') {\r\n          <i class=\"fa-solid fa-triangle-exclamation text-red-500 text-sm\"></i>\r\n          <span class=\"text-[10px] uppercase tracking-wider font-black\">L\u01B0u Th\u1EA5t B\u1EA1i \u2014 Th\u1EED L\u1EA1i</span>\r\n        } @else {\r\n          <i class=\"fa-solid fa-cloud-arrow-up text-amber-500 animate-pulse text-sm\"></i>\r\n          <span class=\"text-[10px] uppercase tracking-wider font-black\">\r\n            {{ hasExistingReport ? 'D\u1EEF li\u1EC7u m\u1EDBi h\u01A1n PDF' : 'C\u00F3 thay \u0111\u1ED5i ch\u01B0a l\u01B0u' }}\r\n          </span>\r\n        }\r\n      </button>\r\n\r\n      <!-- View PDF button -->\r\n      @if (currentPdfUrl) {\r\n        <button (click)=\"openPdf.emit({ pdfUrl: currentPdfUrl, docsUrl: currentDocsUrl })\"\r\n                class=\"px-4 py-2 text-xs font-bold text-red-655 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-xl transition flex items-center gap-1.5 cursor-pointer no-underline shadow-sm hover:shadow active:scale-95 duration-150\">\r\n          <i class=\"fa-solid fa-file-pdf\"></i>\r\n          <span>Xem B\u00E1o C\u00E1o PDF</span>\r\n        </button>\r\n      }\r\n\r\n      <!-- T\u00E1ch phi\u1EBFu -->\r\n      @if (!isReadOnly) {\r\n        <div class=\"flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5 h-[40px]\">\r\n          <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap\">T\u00E1ch phi\u1EBFu:</label>\r\n          <input type=\"number\"\r\n                 [value]=\"samplesPerReport || ''\"\r\n                 (input)=\"samplesPerReportChange.emit($any($event.target).valueAsNumber || null)\"\r\n                 placeholder=\"T\u1EF1 \u0111\u1ED9ng\"\r\n                 class=\"w-12 bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-0 p-0 text-center\"\r\n                 min=\"1\" />\r\n          <span class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap\">m\u1EABu</span>\r\n        </div>\r\n      }\r\n\r\n      <!-- Publish / Generate PDF -->\r\n      <button (click)=\"publishReport.emit()\"\r\n              [disabled]=\"isProcessing || isReadOnly\"\r\n              class=\"px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-indigo-700 rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all duration-150 flex items-center gap-2 disabled:opacity-50\"\r\n              [title]=\"printButtonLabel\">\r\n        <i class=\"fa-solid\" [class.fa-circle-check]=\"!isPublishing\" [class.fa-spinner]=\"isPublishing\" [class.fa-spin]=\"isPublishing\"></i>\r\n        <span>{{ printButtonLabel }}</span>\r\n      </button>\r\n\r\n      <!-- \"Thao t\u00E1c kh\u00E1c\" Dropdown / Bottom Sheet -->\r\n      <div class=\"relative\">\r\n        <button (click)=\"toggleActionsMenu.emit()\"\r\n                [disabled]=\"isProcessing\"\r\n                class=\"px-4 py-2.5 text-xs font-black text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl transition flex items-center gap-2 active:scale-95 disabled:opacity-50 duration-150\"\r\n                [class.bg-slate-200]=\"showActionsMenu\"\r\n                [class.dark:bg-slate-750]=\"showActionsMenu\">\r\n          <i class=\"fa-solid fa-gear\" [class.fa-spin]=\"showActionsMenu\"></i>\r\n          <span>THAO T\u00C1C</span>\r\n          <i class=\"fa-solid fa-chevron-down text-[9px] opacity-60 transition-transform duration-200\"\r\n             [class.rotate-180]=\"showActionsMenu\"></i>\r\n        </button>\r\n\r\n        @if (showActionsMenu) {\r\n          <!-- Backdrop -->\r\n          <div class=\"fixed inset-0 z-40 bg-black/40 md:bg-transparent\" (click)=\"closeActionsMenu.emit()\"></div>\r\n\r\n          <!-- Menu: Bottom sheet on mobile, dropdown on desktop -->\r\n          <div class=\"fixed inset-x-0 bottom-0 z-50 p-4 pt-0\r\n                      md:absolute md:inset-auto md:right-0 md:top-full md:mt-2.5 md:p-0 md:bottom-auto\">\r\n            <div class=\"w-full max-w-lg mx-auto\r\n                        md:w-80 md:max-w-none md:mx-0\r\n                        bg-white dark:bg-slate-900\r\n                        rounded-t-3xl md:rounded-2xl\r\n                        border border-slate-200 dark:border-slate-700\r\n                        shadow-2xl\r\n                        p-4 md:p-3\r\n                        animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-top-2 duration-200\">\r\n\r\n              <!-- Mobile drag handle -->\r\n              <div class=\"w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-4 md:hidden\"></div>\r\n\r\n              <!-- Mobile header -->\r\n              <div class=\"flex items-center justify-between mb-3 md:hidden\">\r\n                <h3 class=\"text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2\">\r\n                  <i class=\"fa-solid fa-gear text-slate-400\"></i>\r\n                  Thao T\u00E1c Nhanh\r\n                </h3>\r\n                <button (click)=\"closeActionsMenu.emit()\" class=\"w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-90\">\r\n                  <i class=\"fa-solid fa-xmark text-sm\"></i>\r\n                </button>\r\n              </div>\r\n\r\n              <!-- Section 1: T\u00E0i li\u1EC7u & B\u00E1o c\u00E1o -->\r\n              @if (currentPdfUrl || currentDocsUrl) {\r\n                <div class=\"px-3 py-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest\">\r\n                  B\u00E1o c\u00E1o v\u00E0 t\u00E0i li\u1EC7u\r\n                </div>\r\n                @if (currentPdfUrl) {\r\n                  <button (click)=\"openPdf.emit({ pdfUrl: currentPdfUrl, docsUrl: currentDocsUrl }); closeActionsMenu.emit()\"\r\n                          class=\"w-full text-left px-4 py-3.5 md:py-3 text-sm font-bold text-red-655 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-150 flex items-center gap-3 border-0 bg-transparent cursor-pointer active:scale-[0.98]\">\r\n                    <div class=\"w-9 h-9 md:w-8 md:h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0\">\r\n                      <i class=\"fa-solid fa-file-pdf text-red-500\"></i>\r\n                    </div>\r\n                    <span>Xem B\u00E1o C\u00E1o PDF</span>\r\n                  </button>\r\n                }\r\n                <div class=\"border-t border-slate-200 dark:border-slate-800 my-2 mx-2\"></div>\r\n              }\r\n\r\n              <!-- Section 2: Qu\u1EA3n l\u00FD m\u1EBB ch\u1EA1y -->\r\n              <div class=\"px-3 py-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest\">\r\n                Qu\u1EA3n tr\u1ECB m\u1EBB ch\u1EA1y\r\n              </div>\r\n              @if (draft?.status === 'completed') {\r\n                <button (click)=\"closeActionsMenu.emit(); unlockToEdit.emit()\"\r\n                        [disabled]=\"isProcessing\"\r\n                        class=\"w-full text-left px-4 py-3.5 md:py-3 text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-955/30 rounded-xl transition-all duration-150 flex items-center gap-3 border-0 bg-transparent cursor-pointer active:scale-[0.98]\">\r\n                  <div class=\"w-9 h-9 md:w-8 md:h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0\">\r\n                    <i class=\"fa-solid fa-unlock-keyhole text-amber-500\"></i>\r\n                  </div>\r\n                  <span>M\u1EDF Kh\u00F3a v\u00E0 Ch\u1EC9nh S\u1EEDa</span>\r\n                </button>\r\n              }\r\n              <button (click)=\"closeActionsMenu.emit(); openResetModal.emit()\"\r\n                      [disabled]=\"isProcessing\"\r\n                      class=\"w-full text-left px-4 py-3.5 md:py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-150 flex items-center gap-3 border-0 bg-transparent cursor-pointer active:scale-[0.98]\">\r\n                <div class=\"w-9 h-9 md:w-8 md:h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0\">\r\n                  <i class=\"fa-solid fa-trash-can text-red-500\"></i>\r\n                </div>\r\n                <span>X\u00F3a Ho\u00E0n To\u00E0n K\u1EBFt Qu\u1EA3</span>\r\n              </button>\r\n\r\n              @if (run?.isVirtualMaster) {\r\n                <button (click)=\"closeActionsMenu.emit(); deleteVirtualMaster.emit()\"\r\n                        [disabled]=\"isProcessing\"\r\n                        class=\"w-full text-left px-4 py-3.5 md:py-3 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all duration-150 flex items-center gap-3 border-0 bg-transparent cursor-pointer active:scale-[0.98] mt-1 border-t border-slate-100 dark:border-slate-800\">\r\n                  <div class=\"w-9 h-9 md:w-8 md:h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center shrink-0\">\r\n                    <i class=\"fa-solid fa-unlink text-rose-500\"></i>\r\n                  </div>\r\n                  <span>G\u1EE1 G\u1ED9p v\u00E0 X\u00F3a M\u1EBB \u1EA2o</span>\r\n                </button>\r\n              }\r\n\r\n            </div>\r\n          </div>\r\n        }\r\n      </div>\r\n\r\n    </div>\r\n  }\r\n</div>\r\n" }]
    }], null, { run: [{
            type: Input
        }], draft: [{
            type: Input
        }], historyList: [{
            type: Input
        }], autoSaveStatus: [{
            type: Input
        }], lastSavedAt: [{
            type: Input
        }], hasExistingReport: [{
            type: Input
        }], isProcessing: [{
            type: Input
        }], isPublishing: [{
            type: Input
        }], isReadOnly: [{
            type: Input
        }], showRestoreMenu: [{
            type: Input
        }], showActionsMenu: [{
            type: Input
        }], samplesPerReport: [{
            type: Input
        }], currentPdfUrl: [{
            type: Input
        }], currentDocsUrl: [{
            type: Input
        }], printButtonLabel: [{
            type: Input
        }], goBack: [{
            type: Output
        }], saveDraft: [{
            type: Output
        }], publishReport: [{
            type: Output
        }], unlockToEdit: [{
            type: Output
        }], openResetModal: [{
            type: Output
        }], deleteVirtualMaster: [{
            type: Output
        }], openPdf: [{
            type: Output
        }], restoreVersion: [{
            type: Output
        }], samplesPerReportChange: [{
            type: Output
        }], toggleRestoreMenu: [{
            type: Output
        }], closeRestoreMenu: [{
            type: Output
        }], toggleActionsMenu: [{
            type: Output
        }], closeActionsMenu: [{
            type: Output
        }], importExcel: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResultEntryHeaderComponent, { className: "ResultEntryHeaderComponent", filePath: "src/app/features/results/components/result-entry-header.component.ts", lineNumber: 12 }); })();
//# sourceMappingURL=result-entry-header.component.js.map