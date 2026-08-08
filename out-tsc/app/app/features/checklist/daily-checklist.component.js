import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { ToastService } from '../../core/services/toast.service';
import { DailyChecklistDataService } from './daily-checklist-data.service';
import { buildApprovedBatchOverviews, buildDailyBatchViews, isValidDateInput, toLocalDateInputValue } from './daily-checklist.utils';
import { buildDailyCompactPrintPages, planDailyPrintLayout } from './daily-print-layout-planner';
import { computeDailyBatchLayoutHint } from './daily-screen-layout-planner';
import { TargetService } from '../targets/target.service';
import { getCanonicalId } from '../results/shared/compound-id-resolver';
import { computeTargetSignature } from '../targets/target-scope-classifier';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = ["batchGrid"];
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.value;
const _forTrack2 = ($index, $item) => $item.cardKey;
const _forTrack3 = ($index, $item) => $item.signature;
const _forTrack4 = ($index, $item) => $item.requestId;
const _forTrack5 = ($index, $item) => $item.sampleId;
const _forTrack6 = ($index, $item) => $item.v;
function DailyChecklistComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4)(1, "div", 34);
    i0.ɵɵelement(2, "i", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 36)(4, "div", 5)(5, "h1", 37);
    i0.ɵɵtext(6, "B\u1EA3ng theo D\u00F5i M\u1EABu Ng\u00E0y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 38);
    i0.ɵɵtext(8, "B\u1EA3ng quan s\u00E1t KNV");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "p", 39);
    i0.ɵɵtext(10, "Theo d\u00F5i ng\u00E0y l\u00E0m m\u1EABu, ch\u1EC9 ti\u00EAu th\u1EF1c hi\u1EC7n v\u00E0 t\u00ECnh tr\u1EA1ng k\u1EBFt qu\u1EA3");
    i0.ɵɵelementEnd()()();
} }
function DailyChecklistComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵelement(1, "div", 40);
    i0.ɵɵelementStart(2, "h2", 41);
    i0.ɵɵtext(3, "Theo D\u00F5i M\u1EABu & K\u1EBFt Qu\u1EA3 Ng\u00E0y");
    i0.ɵɵelementEnd()();
} }
function DailyChecklistComponent_For_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sop_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", sop_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(sop_r1.name);
} }
function DailyChecklistComponent_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 42);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_32_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearFilters()); });
    i0.ɵɵelement(1, "i", 43);
    i0.ɵɵtext(2, "\u0110\u1EB7t L\u1EA1i ");
    i0.ɵɵelementEnd();
} }
function DailyChecklistComponent_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 27);
    i0.ɵɵelement(1, "i", 44);
    i0.ɵɵtext(2, "\u0110ang hi\u1EC3n th\u1ECB d\u1EEF li\u1EC7u l\u01B0u c\u1EE5c b\u1ED9; h\u00E3y l\u00E0m m\u1EDBi khi k\u1EBFt n\u1ED1i \u1ED5n \u0111\u1ECBnh. ");
    i0.ɵɵelementEnd();
} }
function DailyChecklistComponent_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 29);
    i0.ɵɵelement(1, "i", 45);
    i0.ɵɵelementStart(2, "h2", 46);
    i0.ɵɵtext(3, "\u0110ang T\u1EA3i D\u1EEF Li\u1EC7u theo Ng\u00E0y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 47);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("\u0110\u00E3 nh\u1EADn ", ctx_r2.loadedBatchCount(), " m\u1EBB ph\u00F9 h\u1EE3p.");
} }
function DailyChecklistComponent_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 30);
    i0.ɵɵelement(1, "i", 48);
    i0.ɵɵelementStart(2, "h2", 46);
    i0.ɵɵtext(3, "Kh\u00F4ng Th\u1EC3 T\u1EA3i D\u1EEF Li\u1EC7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 47);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 49);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_36_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.refreshData()); });
    i0.ɵɵtext(7, "Th\u1EED L\u1EA1i");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r2.dataError());
} }
function DailyChecklistComponent_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 29)(1, "div", 50);
    i0.ɵɵelement(2, "i", 51);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h2", 46);
    i0.ɵɵtext(4, "Ch\u01B0a C\u00F3 M\u1EBB theo Ng\u00E0y Ph\u00E2n T\u00EDch N\u00E0y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 52);
    i0.ɵɵtext(6, "Ch\u1EC9 c\u00E1c m\u1EBB c\u00F3 ng\u00E0y ph\u00E2n t\u00EDch h\u1EE3p l\u1EC7 v\u00E0 \u0111\u00E3 ph\u00EA duy\u1EC7t m\u1EDBi \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB.");
    i0.ɵɵelementEnd()();
} }
function DailyChecklistComponent_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 31)(1, "div", 53);
    i0.ɵɵelement(2, "i", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h2", 55);
    i0.ɵɵtext(4, "Kh\u00F4ng T\u00ECm Th\u1EA5y Nh\u00F3m M\u1EABu Ph\u00F9 H\u1EE3p");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 56);
    i0.ɵɵtext(6, "Th\u1EED m\u00E3 m\u1EABu, t\u00EAn SOP ho\u1EB7c t\u00EAn ch\u1EC9 ti\u00EAu kh\u00E1c.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 57);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_38_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearFilters()); });
    i0.ɵɵtext(8, " Hi\u1EC3n Th\u1ECB To\u00E0n B\u1ED9 ");
    i0.ɵɵelementEnd()();
} }
function DailyChecklistComponent_Conditional_39_For_25_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 88);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_39_For_25_Template_button_click_0_listener() { const option_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.setViewMode(option_r7.value)); });
    i0.ɵɵelement(1, "i", 89);
    i0.ɵɵelementStart(2, "span", 90);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const option_r7 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("title", option_r7.label)("ngClass", ctx_r2.viewMode() === option_r7.value ? "bg-white dark:bg-slate-700 text-blue-650 dark:text-blue-300 shadow-sm" : "text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵattribute("aria-pressed", ctx_r2.viewMode() === option_r7.value);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", option_r7.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(option_r7.label);
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r9 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("\u2022 SOP v", batch_r9.sopVersion, "");
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 99);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r9 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", batch_r9.statusCounts.completed, " c\u00F3 KQ");
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 100);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r9 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", batch_r9.statusCounts.draft, " \u0111ang nh\u1EADp");
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 101);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r9 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", batch_r9.statusCounts.approved, " ch\u01B0a KQ");
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 111);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_39_For_31_Conditional_29_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const batch_r9 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.editBatch(batch_r9.sourceBatches[0].requestId)); });
    i0.ɵɵelement(1, "i", 112);
    i0.ɵɵelementStart(2, "span", 105);
    i0.ɵɵtext(3, "S\u1EEDa m\u1EBB");
    i0.ɵɵelementEnd()();
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_35_For_2_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 124);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_39_For_31_Conditional_35_For_2_Conditional_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const source_r12 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.editBatch(source_r12.requestId)); });
    i0.ɵɵelement(1, "i", 125);
    i0.ɵɵtext(2, "S\u1EEDa M\u1EBB ");
    i0.ɵɵelementEnd();
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_35_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 113)(1, "div", 114);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 115)(4, "div", 116);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 117);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 118)(9, "button", 119);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_39_For_31_Conditional_35_For_2_Template_button_click_9_listener() { const source_r12 = i0.ɵɵrestoreView(_r11).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.copyBatchId(source_r12.requestId)); });
    i0.ɵɵelement(10, "i", 120);
    i0.ɵɵtext(11, "Sao Ch\u00E9p");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 121);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_39_For_31_Conditional_35_For_2_Template_button_click_12_listener() { const source_r12 = i0.ɵɵrestoreView(_r11).$implicit; const ctx_r2 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r2.navigateToResult(source_r12.requestId, source_r12.status)); });
    i0.ɵɵelement(13, "i", 122);
    i0.ɵɵtext(14, "M\u1EDF K\u1EBFt Qu\u1EA3");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(15, DailyChecklistComponent_Conditional_39_For_31_Conditional_35_For_2_Conditional_15_Template, 3, 0, "button", 123);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const source_r12 = ctx.$implicit;
    const ɵ$index_284_r14 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ɵ$index_284_r14 + 1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(source_r12.requestId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", source_r12.formattedSamples || "Ch\u01B0a x\u00E1c \u0111\u1ECBnh m\u00E3 m\u1EABu", " \u00B7 ", ctx_r2.sourceBatchStatusLabel(source_r12.status), "");
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(ctx_r2.state.isAdmin() ? 15 : -1);
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 107);
    i0.ɵɵrepeaterCreate(1, DailyChecklistComponent_Conditional_39_For_31_Conditional_35_For_2_Template, 16, 5, "div", 113, _forTrack4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r9 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(batch_r9.sourceBatches);
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ɵ$index_318_r15 = i0.ɵɵnextContext().$index;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" \u00B7 Nh\u00F3m ", ɵ$index_318_r15 + 1, "");
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_8_For_2_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 142);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sample_r16 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" \u00B7 ", sample_r16.description.nameSnapshot, "");
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_8_For_2_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 143);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sample_r16 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" \u00B7 Kh\u00F4ng th\u1ED1ng nh\u1EA5t: ", sample_r16.descriptionAlternatives == null ? null : sample_r16.descriptionAlternatives.join(" / "), "");
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_8_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 140)(1, "span", 141);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_8_For_2_Conditional_3_Template, 2, 1, "span", 142)(4, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_8_For_2_Conditional_4_Template, 2, 1, "span", 143);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sample_r16 = ctx.$implicit;
    i0.ɵɵclassProp("border-amber-300", sample_r16.descriptionAlternatives == null ? null : sample_r16.descriptionAlternatives.length)("border-slate-200", !(sample_r16.descriptionAlternatives == null ? null : sample_r16.descriptionAlternatives.length))("dark:border-slate-700", !(sample_r16.descriptionAlternatives == null ? null : sample_r16.descriptionAlternatives.length));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sample_r16.sampleId);
    i0.ɵɵadvance();
    i0.ɵɵconditional(sample_r16.description ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((sample_r16.descriptionAlternatives == null ? null : sample_r16.descriptionAlternatives.length) ? 4 : -1);
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 130);
    i0.ɵɵrepeaterCreate(1, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_8_For_2_Template, 5, 9, "span", 139, _forTrack5);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(group_r17.samples);
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 144);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵclassProp("font-mono", !group_r17.hasMultipleDescriptions);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r17.hasMultipleDescriptions ? group_r17.formattedDescriptions : group_r17.formattedSamples || "Ch\u01B0a x\u00E1c \u0111\u1ECBnh m\u00E3 m\u1EABu", " ");
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 132);
    i0.ɵɵelement(1, "i", 145);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r17.formattedDescriptions);
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 133);
    i0.ɵɵelement(1, "i", 146);
    i0.ɵɵtext(2, "C\u00F3 m\u00E3 m\u1EABu mang m\u00F4 t\u1EA3 kh\u00F4ng th\u1ED1ng nh\u1EA5t gi\u1EEFa c\u00E1c m\u1EBB.");
    i0.ɵɵelementEnd();
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 136);
    i0.ɵɵtext(1, "Ch\u01B0a x\u00E1c \u0111\u1ECBnh ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd();
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_19_Conditional_7_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 151);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const targetName_r19 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(targetName_r19);
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_19_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 150);
    i0.ɵɵrepeaterCreate(1, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_19_Conditional_7_For_2_Template, 2, 1, "span", 151, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r17 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(group_r17.targetNames);
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 137)(1, "div", 147)(2, "div", 36)(3, "p", 148);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "button", 149);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_19_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r18); const group_r17 = i0.ɵɵnextContext().$implicit; const batch_r9 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleTargetDetail(batch_r9.cardKey, group_r17.signature)); });
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(7, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_19_Conditional_7_Template, 3, 0, "div", 150);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r17 = i0.ɵɵnextContext().$implicit;
    const batch_r9 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(group_r17.targetScope.headline);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.isTargetDetailOpen(batch_r9.cardKey, group_r17.signature) ? "\u1EA8n danh s\u00E1ch" : "Xem danh s\u00E1ch", " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isTargetDetailOpen(batch_r9.cardKey, group_r17.signature) ? 7 : -1);
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_20_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 152);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const targetName_r20 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(targetName_r20);
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_20_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 153);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r17 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" +", group_r17.targetNames.length - 6, " ch\u1EC9 ti\u00EAu ");
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 138);
    i0.ɵɵrepeaterCreate(1, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_20_For_2_Template, 2, 1, "span", 152, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵtemplate(3, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_20_Conditional_3_Template, 2, 1, "span", 153);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r17 = i0.ɵɵnextContext().$implicit;
    const batch_r9 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.visibleTargetNames(batch_r9, group_r17.targetNames));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!ctx_r2.isBatchExpanded(batch_r9.cardKey) && group_r17.targetNames.length > 6 ? 3 : -1);
} }
function DailyChecklistComponent_Conditional_39_For_31_For_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 109)(1, "div", 126)(2, "div", 127)(3, "span", 128);
    i0.ɵɵtext(4, " M\u1EABu th\u1EF1c hi\u1EC7n");
    i0.ɵɵtemplate(5, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_5_Template, 2, 1, "span");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 129);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(8, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_8_Template, 3, 0, "div", 130)(9, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_9_Template, 2, 3, "p", 131)(10, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_10_Template, 3, 1, "p", 132)(11, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_11_Template, 3, 0, "p", 133);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 134)(13, "div", 127)(14, "span", 135);
    i0.ɵɵtext(15, "Ch\u1EC9 ti\u00EAu \u0111\u01B0\u1EE3c g\u00E1n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span", 129);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(18, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_18_Template, 2, 0, "p", 136)(19, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_19_Template, 8, 3, "div", 137)(20, DailyChecklistComponent_Conditional_39_For_31_For_38_Conditional_20_Template, 4, 1, "div", 138);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r17 = ctx.$implicit;
    const batch_r9 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(batch_r9.groups.length > 1 ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", group_r17.sampleIds.length, " m\u1EABu");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isBatchExpanded(batch_r9.cardKey) ? 8 : 9);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(group_r17.formattedDescriptions && !group_r17.hasMultipleDescriptions ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(group_r17.hasDescriptionConflict ? 11 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("", group_r17.targetNames.length, " ch\u1EC9 ti\u00EAu");
    i0.ɵɵadvance();
    i0.ɵɵconditional(group_r17.targetNames.length === 0 ? 18 : group_r17.targetScope.compact ? 19 : 20);
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_39_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 129);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r9 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("+ ", ctx_r2.hiddenBatchGroupCount(batch_r9), " nh\u00F3m ph\u00E2n c\u00F4ng");
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_39_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span");
} }
function DailyChecklistComponent_Conditional_39_For_31_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "footer", 110);
    i0.ɵɵtemplate(1, DailyChecklistComponent_Conditional_39_For_31_Conditional_39_Conditional_1_Template, 2, 1, "span", 129)(2, DailyChecklistComponent_Conditional_39_For_31_Conditional_39_Conditional_2_Template, 1, 0, "span");
    i0.ɵɵelementStart(3, "button", 154);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_39_For_31_Conditional_39_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r21); const batch_r9 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleBatchSamples(batch_r9.cardKey)); });
    i0.ɵɵelement(4, "i", 155);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const batch_r9 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r2.isBatchExpanded(batch_r9.cardKey) && ctx_r2.hiddenBatchGroupCount(batch_r9) > 0 ? 1 : 2);
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("fa-compress", ctx_r2.isBatchExpanded(batch_r9.cardKey))("fa-table-cells", !ctx_r2.isBatchExpanded(batch_r9.cardKey));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.isBatchExpanded(batch_r9.cardKey) ? "Thu g\u1ECDn card" : "M\u1EDF r\u1ED9ng chi ti\u1EBFt", " ");
} }
function DailyChecklistComponent_Conditional_39_For_31_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "section", 91)(2, "header", 92)(3, "div", 93)(4, "div", 94);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 36)(7, "h3", 95);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 96)(10, "span", 97);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span");
    i0.ɵɵtext(13, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "span");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span");
    i0.ɵɵtext(17, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span");
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "span");
    i0.ɵɵtext(21, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "span");
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(24, DailyChecklistComponent_Conditional_39_For_31_Conditional_24_Template, 2, 1, "span");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(25, "div", 98);
    i0.ɵɵtemplate(26, DailyChecklistComponent_Conditional_39_For_31_Conditional_26_Template, 2, 1, "span", 99)(27, DailyChecklistComponent_Conditional_39_For_31_Conditional_27_Template, 2, 1, "span", 100)(28, DailyChecklistComponent_Conditional_39_For_31_Conditional_28_Template, 2, 1, "span", 101)(29, DailyChecklistComponent_Conditional_39_For_31_Conditional_29_Template, 4, 0, "button", 102);
    i0.ɵɵelementStart(30, "button", 103);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_39_For_31_Template_button_click_30_listener() { const batch_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleSourceBatchList(batch_r9.cardKey)); });
    i0.ɵɵelement(31, "i", 104);
    i0.ɵɵelementStart(32, "span", 105);
    i0.ɵɵtext(33);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(34, "i", 106);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(35, DailyChecklistComponent_Conditional_39_For_31_Conditional_35_Template, 3, 0, "div", 107);
    i0.ɵɵelementStart(36, "div", 108);
    i0.ɵɵrepeaterCreate(37, DailyChecklistComponent_Conditional_39_For_31_For_38_Template, 21, 7, "div", 109, _forTrack3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(39, DailyChecklistComponent_Conditional_39_For_31_Conditional_39_Template, 6, 6, "footer", 110);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r9 = ctx.$implicit;
    const ɵ$index_207_r22 = ctx.$index;
    i0.ɵɵnextContext();
    const layoutHints_r23 = i0.ɵɵreadContextLet(29);
    const ctx_r2 = i0.ɵɵnextContext();
    const layoutHint_r24 = layoutHints_r23.get(batch_r9.cardKey) || "wide";
    i0.ɵɵadvance();
    i0.ɵɵclassProp("cl-card-compact", layoutHint_r24 === "compact")("cl-card-standard", layoutHint_r24 === "standard")("cl-card-wide", layoutHint_r24 === "wide");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ɵ$index_207_r22 + 1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(batch_r9.sopName);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", batch_r9.physicalBatchCount, " m\u1EBB");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", batch_r9.uniqueSamples, " m\u1EABu");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", batch_r9.uniqueTargets, " ch\u1EC9 ti\u00EAu");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", batch_r9.groups.length, " nh\u00F3m ph\u00E2n c\u00F4ng");
    i0.ɵɵadvance();
    i0.ɵɵconditional(batch_r9.sopVersion ? 24 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(batch_r9.statusCounts.completed > 0 ? 26 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(batch_r9.statusCounts.draft > 0 ? 27 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(batch_r9.statusCounts.approved > 0 ? 28 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.state.isAdmin() && batch_r9.physicalBatchCount === 1 ? 29 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", batch_r9.physicalBatchCount, " m\u1EBB");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("rotate-180", ctx_r2.isSourceBatchListOpen(batch_r9.cardKey));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isSourceBatchListOpen(batch_r9.cardKey) ? 35 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r2.visibleBatchGroups(batch_r9));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.hasHiddenBatchContent(batch_r9) ? 39 : -1);
} }
function DailyChecklistComponent_Conditional_39_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵtextInterpolate1(" \u00B7 C\u1EADp nh\u1EADt ", ctx_r2.formatTimestamp(ctx), " ");
} }
function DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const group_r25 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵtextInterpolate1(" ", group_r25.formattedDescriptions, " ");
} }
function DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const group_r25 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵtextInterpolate1(" ", (ctx_r2.printGroupSamples() ? group_r25.formattedSamples : ctx_r2.joinWithCommas(group_r25.sampleIds)) || "Ch\u01B0a x\u00E1c \u0111\u1ECBnh m\u00E3 m\u1EABu", " ");
} }
function DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 161)(1, "strong");
    i0.ɵɵtext(2, "M\u00F4 t\u1EA3:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r25 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", group_r25.formattedDescriptions, "");
} }
function DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 163);
    i0.ɵɵtext(1, "C\u1EA3nh b\u00E1o: m\u00F4 t\u1EA3 m\u1EABu kh\u00F4ng th\u1ED1ng nh\u1EA5t gi\u1EEFa c\u00E1c m\u1EBB");
    i0.ɵɵelementEnd();
} }
function DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 163);
    i0.ɵɵtext(1, "Ch\u01B0a x\u00E1c \u0111\u1ECBnh ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd();
} }
function DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 164)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r25 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r25.targetScope.headline);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r25.targetScope.detailLabel);
} }
function DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_17_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const targetName_r26 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(targetName_r26);
} }
function DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ul", 165);
    i0.ɵɵrepeaterCreate(1, DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_17_For_2_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r25 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(group_r25.targetNames);
} }
function DailyChecklistComponent_Conditional_39_For_63_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 157)(1, "td")(2, "div", 158)(3, "div", 159)(4, "div", 160);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 161);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(8, "td")(9, "div", 162);
    i0.ɵɵtemplate(10, DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_10_Template, 1, 1)(11, DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_11_Template, 1, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_12_Template, 4, 1, "div", 161)(13, DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_13_Template, 2, 0, "div", 163);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "td");
    i0.ɵɵtemplate(15, DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_15_Template, 2, 0, "div", 163)(16, DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_16_Template, 5, 2, "div", 164)(17, DailyChecklistComponent_Conditional_39_For_63_For_1_Conditional_17_Template, 3, 0, "ul", 165);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r25 = ctx.$implicit;
    const ɵ$index_481_r27 = ctx.$index;
    const batch_r28 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵclassProp("cl-print-batch-start", ɵ$index_481_r27 === 0);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(batch_r28.sopName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", batch_r28.uniqueSamples, " m\u1EABu th\u1EF1c hi\u1EC7n");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(group_r25.hasMultipleDescriptions ? 10 : 11);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(group_r25.formattedDescriptions && !group_r25.hasMultipleDescriptions ? 12 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(group_r25.hasDescriptionConflict ? 13 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(group_r25.targetNames.length === 0 ? 15 : group_r25.targetScope.compact ? 16 : 17);
} }
function DailyChecklistComponent_Conditional_39_For_63_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, DailyChecklistComponent_Conditional_39_For_63_For_1_Template, 18, 8, "tr", 156, _forTrack3);
} if (rf & 2) {
    const batch_r28 = ctx.$implicit;
    i0.ɵɵrepeater(batch_r28.groups);
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 174);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ɵ$index_574_r29 = i0.ɵɵnextContext().$index;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Nh\u00F3m ", ɵ$index_574_r29 + 1, "");
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const group_r30 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵtextInterpolate1(" ", group_r30.formattedDescriptions, " ");
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const group_r30 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(5);
    i0.ɵɵtextInterpolate1(" ", (ctx_r2.printGroupSamples() ? group_r30.formattedSamples : ctx_r2.joinWithCommas(group_r30.sampleIds)) || "Ch\u01B0a x\u00E1c \u0111\u1ECBnh m\u00E3 m\u1EABu", " ");
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 174);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r30 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("M\u00F4 t\u1EA3: ", group_r30.formattedDescriptions, "");
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 163);
    i0.ɵɵtext(1, "M\u00F4 t\u1EA3 m\u1EABu kh\u00F4ng th\u1ED1ng nh\u1EA5t");
    i0.ɵɵelementEnd();
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 163);
    i0.ɵɵtext(1, "Ch\u01B0a x\u00E1c \u0111\u1ECBnh ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd();
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 164)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r30 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r30.targetScope.headline);
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_9_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const targetName_r31 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(targetName_r31);
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ul", 176);
    i0.ɵɵrepeaterCreate(1, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_9_For_2_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r30 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(group_r30.targetNames);
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 173);
    i0.ɵɵtemplate(1, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_1_Template, 2, 1, "div", 174);
    i0.ɵɵelementStart(2, "div", 175);
    i0.ɵɵtemplate(3, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_3_Template, 1, 1)(4, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_4_Template, 1, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_5_Template, 2, 1, "div", 174)(6, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_6_Template, 2, 0, "div", 163)(7, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_7_Template, 2, 0, "div", 163)(8, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_8_Template, 3, 1, "div", 164)(9, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Conditional_9_Template, 3, 0, "ul", 176);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r30 = ctx.$implicit;
    const batch_r32 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵconditional(batch_r32.groups.length > 1 ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(group_r30.hasMultipleDescriptions ? 3 : 4);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(group_r30.formattedDescriptions && !group_r30.hasMultipleDescriptions ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(group_r30.hasDescriptionConflict ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(group_r30.targetNames.length === 0 ? 7 : group_r30.targetScope.compact ? 8 : 9);
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 169)(1, "header", 170)(2, "span", 171);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 172)(5, "div");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "small");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
    i0.ɵɵrepeaterCreate(9, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_For_10_Template, 10, 5, "div", 173, _forTrack3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r32 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r2.boardBatches().indexOf(batch_r32) + 1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(batch_r32.sopName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", batch_r32.uniqueSamples, " m\u1EABu th\u1EF1c hi\u1EC7n");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(batch_r32.groups);
} }
function DailyChecklistComponent_Conditional_39_For_66_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 168);
    i0.ɵɵrepeaterCreate(1, DailyChecklistComponent_Conditional_39_For_66_For_10_For_2_Template, 11, 3, "section", 169, _forTrack2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r33 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(column_r33);
} }
function DailyChecklistComponent_Conditional_39_For_66_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 166)(1, "header", 81)(2, "h2");
    i0.ɵɵtext(3, "B\u1EA2NG THEO D\u00D5I M\u1EAAU NG\u00C0Y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div");
    i0.ɵɵtext(5, "Ng\u00E0y ki\u1EC3m nghi\u1EC7m: ");
    i0.ɵɵelementStart(6, "strong");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(8, "div", 167);
    i0.ɵɵrepeaterCreate(9, DailyChecklistComponent_Conditional_39_For_66_For_10_Template, 3, 0, "div", 168, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const page_r34 = ctx.$implicit;
    const ɵ$index_539_r35 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("cl-print-compact-page-last", ɵ$index_539_r35 === ctx_r2.compactPrintPages().length - 1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r2.selectedDateLabel());
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(page_r34);
} }
function DailyChecklistComponent_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 32)(1, "div", 58)(2, "div", 59)(3, "div", 60)(4, "span", 61);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 62);
    i0.ɵɵtext(7, "M\u1EBB");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 63)(9, "span", 64);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span", 65);
    i0.ɵɵtext(12, "M\u1EABu");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 66)(14, "span", 67);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span", 68);
    i0.ɵɵtext(17, "Ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div", 69)(19, "span", 70);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 71);
    i0.ɵɵtext(22, "SOP");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 72);
    i0.ɵɵrepeaterCreate(24, DailyChecklistComponent_Conditional_39_For_25_Template, 4, 5, "button", 73, _forTrack1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "div", 74)(27, "div", 75, 0);
    i0.ɵɵdeclareLet(29);
    i0.ɵɵrepeaterCreate(30, DailyChecklistComponent_Conditional_39_For_31_Template, 40, 22, "section", 76, _forTrack2);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "div", 77)(33, "span");
    i0.ɵɵelement(34, "i", 78);
    i0.ɵɵtext(35, "D\u1EEF li\u1EC7u truy v\u1EA5n tr\u1EF1c ti\u1EBFp theo ng\u00E0y ki\u1EC3m nghi\u1EC7m.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "span");
    i0.ɵɵtext(37, "M\u1ED7i card l\u00E0 m\u1ED9t SOP/phi\u00EAn b\u1EA3n; c\u00E1c m\u1EBB v\u1EADt l\u00FD v\u1EABn \u0111\u1ED9c l\u1EADp v\u00E0 m\u1EABu ch\u1EC9 \u0111\u01B0\u1EE3c gom khi c\u00F3 c\u00F9ng b\u1ED9 ch\u1EC9 ti\u00EAu. ");
    i0.ɵɵtemplate(38, DailyChecklistComponent_Conditional_39_Conditional_38_Template, 1, 1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(39, "div", 79)(40, "div", 80)(41, "header", 81)(42, "h2");
    i0.ɵɵtext(43, "B\u1EA2NG THEO D\u00D5I M\u1EAAU NG\u00C0Y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "div");
    i0.ɵɵtext(45, "Ng\u00E0y ki\u1EC3m nghi\u1EC7m: ");
    i0.ɵɵelementStart(46, "strong");
    i0.ɵɵtext(47);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(48, "table", 82)(49, "colgroup");
    i0.ɵɵelement(50, "col", 83)(51, "col", 84)(52, "col", 85);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "thead")(54, "tr")(55, "th");
    i0.ɵɵtext(56, "M\u1EBB / SOP");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "th");
    i0.ɵɵtext(58, "M\u1EABu th\u1EF1c hi\u1EC7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(59, "th");
    i0.ɵɵtext(60, "Ch\u1EC9 ti\u00EAu ki\u1EC3m");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(61, "tbody");
    i0.ɵɵrepeaterCreate(62, DailyChecklistComponent_Conditional_39_For_63_Template, 2, 0, null, null, _forTrack2);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(64, "div", 86);
    i0.ɵɵrepeaterCreate(65, DailyChecklistComponent_Conditional_39_For_66_Template, 11, 3, "section", 87, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_10_0;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r2.boardSummary().batches);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r2.boardSummary().samples);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r2.boardSummary().targets);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r2.boardSummary().sops);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r2.viewModeOptions);
    i0.ɵɵadvance(3);
    i0.ɵɵattribute("data-view-mode", ctx_r2.viewMode());
    i0.ɵɵadvance(2);
    i0.ɵɵstoreLet(ctx_r2.batchLayoutHints());
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.boardBatches());
    i0.ɵɵadvance(8);
    i0.ɵɵconditional((tmp_10_0 = ctx_r2.lastLoadedAt()) ? 38 : -1, tmp_10_0);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("cl-print-mode-compact", ctx_r2.printPlan().mode === "compact")("cl-print-mode-list", ctx_r2.printPlan().mode === "list");
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r2.selectedDateLabel());
    i0.ɵɵadvance(15);
    i0.ɵɵrepeater(ctx_r2.boardBatches());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r2.compactPrintPages());
} }
function DailyChecklistComponent_Conditional_40_For_15_Template(rf, ctx) { if (rf & 1) {
    const _r37 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 202);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_40_For_15_Template_button_click_0_listener() { const opt_r38 = i0.ɵɵrestoreView(_r37).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.printMode.set(opt_r38.v)); });
    i0.ɵɵelement(1, "i", 89);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const opt_r38 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", ctx_r2.printMode() === opt_r38.v ? "bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white");
    i0.ɵɵattribute("aria-pressed", ctx_r2.printMode() === opt_r38.v);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", opt_r38.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(opt_r38.l);
} }
function DailyChecklistComponent_Conditional_40_For_23_Template(rf, ctx) { if (rf & 1) {
    const _r39 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 203);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_40_For_23_Template_button_click_0_listener() { const opt_r40 = i0.ɵɵrestoreView(_r39).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.printOrientation.set(opt_r40.v)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const opt_r40 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("bg-white", ctx_r2.printOrientation() === opt_r40.v)("dark:bg-slate-800", ctx_r2.printOrientation() === opt_r40.v)("shadow-xs", ctx_r2.printOrientation() === opt_r40.v)("text-blue-650", ctx_r2.printOrientation() === opt_r40.v)("dark:text-blue-400", ctx_r2.printOrientation() === opt_r40.v)("text-slate-500", ctx_r2.printOrientation() !== opt_r40.v)("dark:text-slate-400", ctx_r2.printOrientation() !== opt_r40.v);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", opt_r40.l, " ");
} }
function DailyChecklistComponent_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    const _r36 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 33)(1, "div", 177)(2, "div", 178)(3, "div", 5);
    i0.ɵɵelement(4, "i", 179);
    i0.ɵɵelementStart(5, "h3", 180);
    i0.ɵɵtext(6, "C\u1EA5u H\u00ECnh B\u1EA3n In");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "button", 181);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_40_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r36); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showPrintSettings.set(false)); });
    i0.ɵɵelement(8, "i", 182);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 183)(10, "div", 184)(11, "span", 185);
    i0.ɵɵtext(12, "Ch\u1EBF \u0111\u1ED9 in");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 186);
    i0.ɵɵrepeaterCreate(14, DailyChecklistComponent_Conditional_40_For_15_Template, 4, 4, "button", 187, _forTrack6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "p", 188);
    i0.ɵɵtext(17, " T\u1EF1 \u0111\u1ED9ng so s\u00E1nh l\u01B0\u1EDBi mini-card v\u00E0 b\u1EA3ng danh s\u00E1ch \u0111\u1EC3 h\u1EA1n ch\u1EBF s\u1ED1 trang, xu\u1ED1ng d\u00F2ng v\u00E0 chia m\u1EBB. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div", 184)(19, "span", 185);
    i0.ɵɵtext(20, "B\u1ED1 c\u1EE5c gi\u1EA5y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "div", 186);
    i0.ɵɵrepeaterCreate(22, DailyChecklistComponent_Conditional_40_For_23_Template, 2, 15, "button", 189, _forTrack6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div", 190)(25, "div", 191)(26, "span", 192);
    i0.ɵɵtext(27, "Ph\u01B0\u01A1ng \u00E1n hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "span", 193);
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "p", 194);
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "div", 195)(33, "label", 196)(34, "input", 197);
    i0.ɵɵlistener("ngModelChange", function DailyChecklistComponent_Conditional_40_Template_input_ngModelChange_34_listener($event) { i0.ɵɵrestoreView(_r36); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.printGroupSamples.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "span");
    i0.ɵɵtext(36, "Gom d\u1EA3i m\u1EABu li\u00EAn t\u1EE5c (L0115 \u2192 L5015)");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(37, "div", 198)(38, "button", 199);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_40_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r36); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showPrintSettings.set(false)); });
    i0.ɵɵtext(39, " H\u1EE7y B\u1ECF ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "button", 200);
    i0.ɵɵlistener("click", function DailyChecklistComponent_Conditional_40_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r36); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.executePrint()); });
    i0.ɵɵelement(41, "i", 201);
    i0.ɵɵtext(42, " X\u00E1c Nh\u1EADn In ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater(ctx_r2.printModeOptions);
    i0.ɵɵadvance(8);
    i0.ɵɵrepeater(ctx_r2.printOrientationOptions);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate3(" ", ctx_r2.printPlan().mode === "compact" ? "L\u01B0\u1EDBi g\u1ECDn" : "Danh s\u00E1ch", " \u00B7 A4 ", ctx_r2.printPlan().orientation === "portrait" ? "d\u1ECDc" : "ngang", " \u00B7 kho\u1EA3ng ", ctx_r2.printPlan().estimatedPages, " trang ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.printPlan().reason);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r2.printGroupSamples());
} }
export class DailyChecklistComponent {
    set batchGrid(element) {
        this.batchGridResizeObserver?.disconnect();
        this.batchGridResizeObserver = undefined;
        if (!element)
            return;
        const updateWidth = () => this.batchGridWidth.set(Math.round(element.nativeElement.getBoundingClientRect().width));
        updateWidth();
        if (typeof ResizeObserver !== 'undefined') {
            this.batchGridResizeObserver = new ResizeObserver(entries => {
                const width = entries[0]?.contentRect.width;
                if (width !== undefined)
                    this.batchGridWidth.set(Math.round(width));
            });
            this.batchGridResizeObserver.observe(element.nativeElement);
        }
    }
    constructor() {
        this.embedded = false;
        this.state = inject(StateService);
        this.router = inject(Router);
        this.dataService = inject(DailyChecklistDataService);
        this.toast = inject(ToastService);
        this.targetService = inject(TargetService);
        this.today = toLocalDateInputValue();
        this.selectedDate = signal(this.today);
        this.dateRequests = signal([]);
        this.loading = signal(true);
        this.loadedBatchCount = signal(0);
        this.dataError = signal(null);
        this.usingOfflineCache = signal(false);
        this.lastLoadedAt = signal(null);
        this.sopFilter = signal('all');
        this.searchTerm = signal('');
        this.printGeneratedAt = signal(new Date());
        // Print Configuration Signals
        this.showPrintSettings = signal(false);
        this.printOrientation = signal('auto');
        this.printMode = signal('auto');
        this.printGroupSamples = signal(true);
        this.expandedBatchIds = signal(new Set());
        this.openSourceBatchCardKeys = signal(new Set());
        this.viewMode = signal(this.loadStoredViewMode());
        this.batchGridWidth = signal(0);
        this.availableTargetGroups = signal([]);
        this.openTargetDetailKeys = signal(new Set());
        this.printOrientationOptions = [
            { v: 'auto', l: 'Tự động' },
            { v: 'portrait', l: 'Chiều dọc' },
            { v: 'landscape', l: 'Chiều ngang' }
        ];
        this.printModeOptions = [
            { v: 'auto', l: 'Tự động', icon: 'fa-wand-magic-sparkles' },
            { v: 'compact', l: 'Lưới gọn', icon: 'fa-grip' },
            { v: 'list', l: 'Danh sách', icon: 'fa-bars' }
        ];
        this.viewModeOptions = [
            { value: 'auto', label: 'Tự động', icon: 'fa-wand-magic-sparkles' },
            { value: 'compact', label: 'Lưới gọn', icon: 'fa-grip' },
            { value: 'list', label: 'Danh sách', icon: 'fa-bars' }
        ];
        this.dateLoadToken = 0;
        this.targetGroupsResolved = false;
        this.targetNameMap = computed(() => {
            const map = new Map();
            this.state.sops().forEach(sop => {
                (sop.targets || []).forEach(target => {
                    map.set(`${sop.id}\u0000${target.id}`, target.name);
                    map.set(`${sop.id}\u0000${getCanonicalId(target.id || target.name)}`, target.name);
                });
            });
            return map;
        });
        this.hasNewerDate = computed(() => this.selectedDate() < this.today);
        this.dayBatches = computed(() => {
            const targetNames = this.targetNameMap();
            return buildApprovedBatchOverviews(this.dateRequests(), this.selectedDate(), (request, targetId) => request.targetNames?.[targetId]
                || Object.entries(request.targetNames || {}).find(([id]) => getCanonicalId(id) === getCanonicalId(targetId))?.[1]
                || targetNames.get(`${request.sopId}\u0000${targetId}`)
                || targetNames.get(`${request.sopId}\u0000${getCanonicalId(targetId)}`)
                || targetId);
        });
        this.sopOptions = computed(() => {
            const map = new Map();
            this.dayBatches().forEach(batch => map.set(batch.sopId, batch.sopName));
            return Array.from(map, ([id, name]) => ({ id, name }))
                .sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        });
        this.scopedBatches = computed(() => {
            const sop = this.sopFilter();
            return sop === 'all' ? this.dayBatches() : this.dayBatches().filter(batch => batch.sopId === sop);
        });
        this.boardBatches = computed(() => {
            const batches = buildDailyBatchViews(this.scopedBatches(), this.availableTargetGroups());
            const search = normalizeSearch(this.searchTerm());
            if (!search)
                return batches;
            return batches
                .map(batch => {
                if (normalizeSearch([
                    batch.sopName,
                    batch.sopRef || '',
                    ...batch.sourceBatches.map(source => source.requestId),
                    ...batch.groups.map(group => group.formattedDescriptions)
                ].join(' ')).includes(search)) {
                    return batch;
                }
                const matchingGroups = batch.groups.filter(group => normalizeSearch([
                    ...group.targetNames,
                    group.targetScope.headline,
                    ...group.sampleIds,
                    group.formattedSamples,
                    group.formattedDescriptions
                ].join(' ')).includes(search));
                if (matchingGroups.length === 0)
                    return null;
                return {
                    ...batch,
                    groups: matchingGroups,
                    uniqueSamples: new Set(matchingGroups.flatMap(group => group.sampleIds)).size,
                    uniqueTargets: new Set(matchingGroups.flatMap(group => group.targetIds)).size
                };
            })
                .filter((batch) => batch !== null);
        });
        this.batchLayoutHints = computed(() => {
            const containerWidth = this.batchGridWidth();
            const expandedBatchIds = this.expandedBatchIds();
            const viewMode = this.viewMode();
            return new Map(this.boardBatches().map(batch => [
                batch.cardKey,
                computeDailyBatchLayoutHint(batch, containerWidth, expandedBatchIds.has(batch.cardKey), viewMode)
            ]));
        });
        this.boardSummary = computed(() => {
            const batches = this.boardBatches();
            const samples = new Set();
            const targets = new Set();
            const sops = new Set();
            let groups = 0;
            batches.forEach(batch => {
                sops.add(batch.sopId);
                groups += batch.groups.length;
                batch.groups.forEach(group => {
                    group.sampleIds.forEach(sample => samples.add(normalizeSearch(sample)));
                    group.targetIds.forEach(target => targets.add(`${batch.sopId}\u0000${target}`));
                });
            });
            return {
                batches: batches.reduce((total, batch) => total + batch.physicalBatchCount, 0),
                cards: batches.length,
                sops: sops.size,
                samples: samples.size,
                targets: targets.size,
                groups
            };
        });
        this.printPlan = computed(() => planDailyPrintLayout(this.boardBatches(), this.printGroupSamples(), this.printOrientation(), this.printMode()));
        this.compactPrintPages = computed(() => buildDailyCompactPrintPages(this.boardBatches(), this.printGroupSamples(), this.printPlan().orientation));
        this.activeFilterCount = computed(() => Number(this.sopFilter() !== 'all') + Number(Boolean(this.searchTerm().trim())));
        this.selectedDateLabel = computed(() => this.formatDate(this.selectedDate(), true));
        void this.initializeTracker();
    }
    ngOnDestroy() {
        this.batchGridResizeObserver?.disconnect();
    }
    onDateChange(value) {
        if (!isValidDateInput(value))
            return;
        this.selectedDate.set(value);
        this.clearFilters();
        void this.loadSelectedDate();
    }
    moveAvailableDate(direction) {
        const [year, month, day] = this.selectedDate().split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + (direction === 'older' ? -1 : 1));
        const nextDate = toLocalDateInputValue(date);
        if (direction === 'newer' && nextDate > this.today)
            return;
        this.onDateChange(nextDate);
    }
    refreshData() {
        void this.refreshTracker();
    }
    clearFilters() {
        this.sopFilter.set('all');
        this.searchTerm.set('');
    }
    setViewMode(mode) {
        this.viewMode.set(mode);
        try {
            localStorage.setItem('daily-sample-board-view-mode', mode);
        }
        catch {
            // Chế độ vẫn có hiệu lực trong phiên nếu trình duyệt chặn storage.
        }
    }
    visibleBatchGroups(batch) {
        return this.isBatchExpanded(batch.cardKey) ? batch.groups : batch.groups.slice(0, 2);
    }
    visibleTargetNames(batch, targetNames) {
        return this.isBatchExpanded(batch.cardKey) ? targetNames : targetNames.slice(0, 6);
    }
    isTargetDetailOpen(requestId, signature) {
        return this.openTargetDetailKeys().has(this.targetDetailKey(requestId, signature));
    }
    toggleTargetDetail(requestId, signature) {
        const key = this.targetDetailKey(requestId, signature);
        this.openTargetDetailKeys.update(current => {
            const next = new Set(current);
            if (next.has(key))
                next.delete(key);
            else
                next.add(key);
            return next;
        });
    }
    hasHiddenBatchContent(batch) {
        return batch.uniqueSamples > 12
            || batch.groups.length > 2
            || batch.groups.some(group => !group.targetScope.compact && group.targetNames.length > 6);
    }
    hiddenBatchGroupCount(batch) {
        return Math.max(0, batch.groups.length - 2);
    }
    isSourceBatchListOpen(cardKey) {
        return this.openSourceBatchCardKeys().has(cardKey);
    }
    toggleSourceBatchList(cardKey) {
        this.openSourceBatchCardKeys.update(current => {
            const next = new Set(current);
            if (next.has(cardKey))
                next.delete(cardKey);
            else
                next.add(cardKey);
            return next;
        });
    }
    sourceBatchStatusLabel(status) {
        if (status === 'completed')
            return 'Có kết quả';
        if (status === 'draft')
            return 'Đang nhập KQ';
        return 'Chưa có KQ';
    }
    printDocument() {
        if (this.boardBatches().length === 0)
            return;
        this.showPrintSettings.set(true);
    }
    executePrint() {
        this.showPrintSettings.set(false);
        this.printGeneratedAt.set(new Date());
        const printContainer = document.getElementById('print-container');
        if (!printContainer) {
            window.print();
            return;
        }
        const source = document.querySelector('.cl-page-shell');
        if (!source) {
            console.warn('cl-page-shell not found');
            return;
        }
        const orientation = this.printPlan().orientation;
        if (orientation === 'portrait') {
            document.body.classList.add('daily-checklist-printing', 'print-portrait-mode');
        }
        else {
            document.body.classList.add('daily-checklist-printing', 'print-landscape-mode');
        }
        // SỬA LỖI TRANG TRẮNG: Gỡ bỏ khóa cứng kích thước 210x297mm của thẻ html trong index.html
        // (CSS class binding không thể target trực tiếp thẻ html outside component ViewEncapsulation)
        document.documentElement.style.setProperty('height', 'auto', 'important');
        document.documentElement.style.setProperty('width', 'auto', 'important');
        document.body.style.setProperty('height', 'auto', 'important');
        document.body.style.setProperty('width', 'auto', 'important');
        document.body.style.setProperty('overflow', 'visible', 'important');
        // Thêm dynamic style để khống chế hướng giấy in (Portrait / Landscape)
        const styleEl = document.createElement('style');
        styleEl.id = 'print-orientation-style';
        styleEl.innerHTML = `@page { size: A4 ${orientation}; margin: 8mm; }`;
        document.head.appendChild(styleEl);
        // Đợi góc render của Angular cập nhật lại dải mẫu nếu tắt/bật gom mẫu
        setTimeout(async () => {
            const clone = source.cloneNode(true);
            // Khử animation và transform để tránh phá vỡ thuật toán phân trang CSS Columns của trình duyệt
            clone.style.animation = 'none';
            clone.style.transform = 'none';
            const animatedElements = clone.querySelectorAll('.cl-board-enter, .animate-fade-in');
            animatedElements.forEach((el) => {
                el.style.animation = 'none';
                el.style.transform = 'none';
            });
            printContainer.innerHTML = '';
            printContainer.appendChild(clone);
            const cleanupPrintMode = () => {
                document.body.classList.remove('daily-checklist-printing', 'print-portrait-mode', 'print-landscape-mode');
                document.documentElement.style.removeProperty('height');
                document.documentElement.style.removeProperty('width');
                document.body.style.removeProperty('height');
                document.body.style.removeProperty('width');
                document.body.style.removeProperty('overflow');
                printContainer.innerHTML = '';
                const styleElToRemove = document.getElementById('print-orientation-style');
                if (styleElToRemove)
                    styleElToRemove.remove();
            };
            window.addEventListener('afterprint', cleanupPrintMode, { once: true });
            window.print();
        }, 120);
    }
    joinWithCommas(ids) {
        return ids.join(', ');
    }
    isBatchExpanded(requestId) {
        return this.expandedBatchIds().has(requestId);
    }
    toggleBatchSamples(requestId) {
        this.expandedBatchIds.update(current => {
            const next = new Set(current);
            if (next.has(requestId))
                next.delete(requestId);
            else
                next.add(requestId);
            return next;
        });
    }
    async copyBatchId(requestId) {
        if (!requestId)
            return;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(requestId);
            }
            else {
                const textarea = document.createElement('textarea');
                textarea.value = requestId;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const copied = document.execCommand('copy');
                textarea.remove();
                if (!copied)
                    throw new Error('Clipboard API unavailable');
            }
            this.toast.show('Đã sao chép mã mẻ.', 'success');
        }
        catch {
            this.toast.show('Không thể sao chép mã mẻ trên thiết bị này.', 'error');
        }
    }
    formatTimestamp(date) {
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    }
    navigateToResult(requestId, status) {
        if (!requestId)
            return;
        this.router.navigate(['/results-view', requestId]);
    }
    editBatch(requestId) {
        if (!requestId)
            return;
        this.router.navigate(['/calculator'], { queryParams: { editRequestId: requestId } });
    }
    targetDetailKey(requestId, signature) {
        return `${requestId}\u0000${signature}`;
    }
    loadStoredViewMode() {
        try {
            const stored = localStorage.getItem('daily-sample-board-view-mode');
            if (stored === 'compact' || stored === 'list')
                return stored;
        }
        catch {
            // Dùng mặc định khi storage không khả dụng.
        }
        return 'auto';
    }
    formatDate(value, includeWeekday = false) {
        if (!isValidDateInput(value))
            return value;
        const [year, month, day] = value.split('-').map(Number);
        return new Intl.DateTimeFormat('vi-VN', {
            weekday: includeWeekday ? 'long' : undefined,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(year, month - 1, day));
    }
    async initializeTracker() {
        this.loading.set(true);
        try {
            this.selectedDate.set(this.today);
            // Chưa quét lịch sử; giữ nút ngày cũ khả dụng để chỉ tải khi người dùng yêu cầu.
            await this.loadSelectedDate(false, false);
        }
        catch (error) {
            this.handleLoadError(error);
        }
        finally {
            this.loading.set(false);
        }
    }
    async refreshTracker() {
        try {
            // Làm mới đúng document của ngày đang xem.
            await this.loadSelectedDate(true);
        }
        catch (error) {
            this.handleLoadError(error);
            this.loading.set(false);
        }
    }
    async loadSelectedDate(forceRefresh = false, manageLoading = true) {
        const selectedDate = this.selectedDate();
        const token = ++this.dateLoadToken;
        if (manageLoading)
            this.loading.set(true);
        this.loadedBatchCount.set(0);
        this.dataError.set(null);
        try {
            const result = await this.dataService.loadRequestsForDate(selectedDate, count => {
                if (token === this.dateLoadToken)
                    this.loadedBatchCount.set(count);
            }, forceRefresh);
            if (token !== this.dateLoadToken)
                return null;
            this.dateRequests.set(result.requests);
            this.usingOfflineCache.set(result.source === 'cache');
            this.lastLoadedAt.set(new Date());
            await this.ensureTargetGroupsForRequests(result.requests);
            return result.requests;
        }
        catch (error) {
            if (token === this.dateLoadToken)
                this.handleLoadError(error);
            return null;
        }
        finally {
            if (manageLoading && token === this.dateLoadToken)
                this.loading.set(false);
        }
    }
    async ensureTargetGroupsForRequests(requests) {
        const cachedGroups = this.targetService.groups();
        if (cachedGroups.length > 0) {
            this.availableTargetGroups.set(cachedGroups);
            this.targetGroupsResolved = true;
            return;
        }
        if (this.targetGroupsResolved || !this.requestsNeedTargetGroups(requests))
            return;
        try {
            const groups = await this.targetService.getAllGroups();
            this.availableTargetGroups.set(groups);
            this.targetGroupsResolved = true;
        }
        catch (error) {
            console.warn('[DailySampleTracker] Target groups unavailable:', error);
        }
    }
    requestsNeedTargetGroups(requests) {
        return requests.some(request => {
            const sampleTargetMap = request.sampleTargetMap ?? request.inputs?.sampleTargetMap ?? {};
            const targetSets = Object.values(sampleTargetMap)
                .filter((ids) => Array.isArray(ids));
            const fallbackTargets = request.targetIds ?? request.inputs?.targetIds ?? [];
            if (targetSets.length === 0 && Array.isArray(fallbackTargets))
                targetSets.push(fallbackTargets);
            const storedSignatures = new Set((request.targetScopeSnapshots || []).map(snapshot => snapshot.signature));
            const sopTargetIds = Object.keys(request.targetNames || {});
            const sopSignature = sopTargetIds.length > 0 ? computeTargetSignature(sopTargetIds) : null;
            return targetSets.some(targetIds => {
                if (targetIds.length === 0)
                    return false;
                const signature = computeTargetSignature(targetIds);
                return !storedSignatures.has(signature) && signature !== sopSignature;
            });
        });
    }
    handleLoadError(error) {
        console.error('[DailySampleTracker] Load failed:', error);
        this.dataError.set('Không thể tải dữ liệu theo ngày. Vui lòng kiểm tra kết nối và thử làm mới.');
        this.dateRequests.set([]);
    }
    static { this.ɵfac = function DailyChecklistComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DailyChecklistComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DailyChecklistComponent, selectors: [["app-daily-checklist"]], viewQuery: function DailyChecklistComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.batchGrid = _t.first);
        } }, inputs: { embedded: "embedded" }, decls: 41, vars: 31, consts: [["batchGrid", ""], [1, "cl-page-shell", "h-full", "min-h-0", "flex", "flex-col", "font-sans", "text-slate-800", "dark:text-slate-200", "overflow-hidden"], [1, "cl-screen-only", "shrink-0", "mb-4"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4"], [1, "flex", "items-center", "gap-3", "min-w-0"], [1, "flex", "items-center", "gap-2"], [1, "flex", "items-center", "gap-2", "w-full", "md:w-auto", "ml-auto"], ["type", "button", "aria-label", "Ng\u00E0y tr\u01B0\u1EDBc", "title", "Ng\u00E0y tr\u01B0\u1EDBc", 1, "w-10", "h-10", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-50", "dark:hover:bg-slate-700", "hover:border-slate-300", "dark:hover:border-slate-600", "focus-visible:ring-2", "focus-visible:ring-blue-500", "disabled:opacity-30", "disabled:cursor-not-allowed", "shrink-0", "transition", "active:scale-95", "flex", "items-center", "justify-center", "bg-white", "dark:bg-slate-800", 3, "click", "disabled"], ["aria-hidden", "true", 1, "fa-solid", "fa-chevron-left", "text-xs"], [1, "relative", "flex-1", "md:flex-none", "min-w-0"], [1, "sr-only"], ["aria-hidden", "true", 1, "fa-regular", "fa-calendar", "absolute", "inset-y-0", "left-3", "hidden", "sm:flex", "items-center", "text-blue-500", "text-sm", "pointer-events-none"], ["type", "date", "aria-label", "Ch\u1ECDn ng\u00E0y theo d\u00F5i", 1, "w-full", "md:w-56", "h-10", "pl-3", "sm:pl-9", "pr-3", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "sm:text-sm", "font-bold", "rounded-xl", "focus:ring-2", "focus:ring-blue-500/30", "focus:border-blue-500", "outline-none", "text-slate-700", "dark:text-slate-205", 3, "ngModelChange", "ngModel", "max"], ["type", "button", "aria-label", "Ng\u00E0y sau", "title", "Ng\u00E0y sau", 1, "w-10", "h-10", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-50", "dark:hover:bg-slate-700", "hover:border-slate-300", "dark:hover:border-slate-600", "focus-visible:ring-2", "focus-visible:ring-blue-500", "disabled:opacity-30", "disabled:cursor-not-allowed", "shrink-0", "transition", "active:scale-95", "flex", "items-center", "justify-center", "bg-white", "dark:bg-slate-800", 3, "click", "disabled"], ["aria-hidden", "true", 1, "fa-solid", "fa-chevron-right", "text-xs"], ["type", "button", "aria-label", "L\u00E0m m\u1EDBi d\u1EEF li\u1EC7u", "title", "L\u00E0m m\u1EDBi d\u1EEF li\u1EC7u t\u1EEB m\u00E1y ch\u1EE7", 1, "w-10", "h-10", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-50", "dark:hover:bg-slate-700", "focus-visible:ring-2", "focus-visible:ring-blue-500", "disabled:opacity-40", "shrink-0", "transition", "active:scale-95", "flex", "items-center", "justify-center", "bg-white", "dark:bg-slate-800", 3, "click", "disabled"], ["aria-hidden", "true", 1, "fa-solid", "fa-rotate"], ["type", "button", "aria-label", "In b\u1EA3ng \u0111ang xem", "title", "In b\u1EA3ng \u0111ang xem", 1, "px-4", "h-10", "bg-blue-600", "dark:bg-blue-500", "hover:bg-blue-700", "dark:hover:bg-blue-600", "text-white", "rounded-xl", "font-bold", "shadow-sm", "hover:shadow-md", "dark:shadow-none", "transition", "text-xs", "uppercase", "tracking-wide", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", "shrink-0", 3, "click", "disabled"], ["aria-hidden", "true", 1, "fa-solid", "fa-print"], [1, "mt-3", "pt-3", "border-t", "border-slate-100", "dark:border-slate-700/70", "grid", "grid-cols-1", "sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)_auto]", "gap-2"], [1, "relative", "min-w-0"], ["aria-hidden", "true", 1, "fa-solid", "fa-magnifying-glass", "absolute", "inset-y-0", "left-3", "flex", "items-center", "text-slate-400", "text-xs", "pointer-events-none"], ["type", "search", "placeholder", "T\u00ECm m\u00E3 m\u1EABu, SOP ho\u1EB7c ch\u1EC9 ti\u00EAu...", 1, "w-full", "h-10", "pl-9", "pr-3", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "text-sm", "rounded-xl", "focus:ring-2", "focus:ring-blue-500/30", "focus:border-blue-500", "outline-none", "text-slate-750", "dark:text-slate-200", 3, "ngModelChange", "ngModel"], ["aria-label", "L\u1ECDc theo SOP", 1, "h-10", "min-w-0", "px-3", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "font-semibold", "rounded-xl", "outline-none", "focus:ring-2", "focus:ring-blue-500/30", "text-slate-700", "dark:text-slate-200", 3, "ngModelChange", "ngModel"], ["value", "all"], [3, "value"], ["type", "button", 1, "h-10", "px-3", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "hover:bg-slate-50", "dark:hover:bg-slate-750", "text-slate-650", "dark:text-slate-350", "transition", "active:scale-95", "text-xs", "font-bold", "whitespace-nowrap", "flex", "items-center", "gap-1.5", "bg-white", "dark:bg-slate-800"], [1, "mt-2", "px-3", "py-2", "rounded-xl", "bg-amber-50", "dark:bg-amber-500/10", "border", "border-amber-200", "dark:border-amber-500/20", "text-[10px]", "font-bold", "text-amber-700", "dark:text-amber-300"], [1, "cl-board-scroll", "flex-1", "min-h-0", "overflow-y-auto", "p-0.5", "custom-scrollbar"], [1, "max-w-2xl", "mx-auto", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "flex", "flex-col", "items-center", "justify-center", "py-16", "text-center", "px-4", "cl-board-enter"], [1, "max-w-2xl", "mx-auto", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-red-100", "dark:border-red-900/40", "shadow-sm", "flex", "flex-col", "items-center", "justify-center", "py-14", "text-center", "px-4", "cl-board-enter"], [1, "max-w-2xl", "mx-auto", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "flex", "flex-col", "items-center", "justify-center", "py-12", "text-center", "px-4", "cl-board-enter"], [1, "cl-adaptive-root", "cl-board-enter"], ["data-testid", "daily-print-settings", 1, "fixed", "inset-0", "z-[150]", "flex", "items-center", "justify-center", "bg-slate-900/60", "backdrop-blur-sm", "p-4", "animate-fade-in"], [1, "w-10", "h-10", "rounded-xl", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "border", "border-blue-100", "dark:border-blue-800/30", "shadow-sm", "shrink-0"], ["aria-hidden", "true", 1, "fa-solid", "fa-clipboard-check", "text-base"], [1, "min-w-0"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight", "truncate"], [1, "hidden", "sm:inline-flex", "px-2", "py-0.5", "rounded-full", "bg-blue-50", "dark:bg-blue-500/10", "text-blue-600", "dark:text-blue-300", "text-[9px]", "font-black", "uppercase", "tracking-wider", "border", "border-blue-100", "dark:border-blue-500/20"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5", "truncate"], [1, "w-1.5", "h-4", "bg-blue-600", "rounded-full"], [1, "text-base", "font-bold", "text-gray-700", "dark:text-slate-200", "uppercase", "tracking-wider"], ["type", "button", 1, "h-10", "px-3", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "hover:bg-slate-50", "dark:hover:bg-slate-750", "text-slate-650", "dark:text-slate-350", "transition", "active:scale-95", "text-xs", "font-bold", "whitespace-nowrap", "flex", "items-center", "gap-1.5", "bg-white", "dark:bg-slate-800", 3, "click"], ["aria-hidden", "true", 1, "fa-solid", "fa-rotate-left"], ["aria-hidden", "true", 1, "fa-solid", "fa-wifi", "mr-1.5"], ["aria-hidden", "true", 1, "fa-solid", "fa-circle-notch", "fa-spin", "text-2xl", "text-blue-500", "mb-3"], [1, "text-sm", "font-black", "text-slate-700", "dark:text-slate-200"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], ["aria-hidden", "true", 1, "fa-solid", "fa-triangle-exclamation", "text-2xl", "text-red-500", "mb-3"], ["type", "button", 1, "mt-3", "h-9", "px-4", "rounded-xl", "bg-blue-600", "text-white", "text-xs", "font-bold", "hover:bg-blue-700", 3, "click"], [1, "w-12", "h-12", "rounded-xl", "bg-slate-100", "dark:bg-slate-700", "text-slate-300", "dark:text-slate-500", "flex", "items-center", "justify-center", "mb-3"], ["aria-hidden", "true", 1, "fa-regular", "fa-calendar-xmark", "text-xl"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "max-w-sm", "mt-1"], [1, "w-12", "h-12", "rounded-xl", "bg-blue-50", "dark:bg-blue-500/10", "text-blue-300", "dark:text-blue-400", "flex", "items-center", "justify-center", "mb-3"], ["aria-hidden", "true", 1, "fa-solid", "fa-magnifying-glass", "text-lg"], [1, "text-xs", "font-black", "text-slate-700", "dark:text-slate-200"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "mt-1"], ["type", "button", 1, "mt-3", "h-8", "px-3", "rounded-lg", "bg-blue-600", "text-white", "text-xs", "font-bold", "hover:bg-blue-700", "transition-colors", 3, "click"], [1, "cl-screen-only"], [1, "mb-3", "flex", "flex-wrap", "items-center", "gap-1.5"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-1", "rounded-xl", "bg-blue-50", "dark:bg-blue-500/10", "border", "border-blue-100", "dark:border-blue-500/20"], [1, "text-sm", "font-black", "tabular-nums", "text-blue-700", "dark:text-blue-300"], [1, "text-[9px]", "font-bold", "uppercase", "tracking-wide", "text-blue-500", "dark:text-blue-400"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-1", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-500/10", "border", "border-indigo-100", "dark:border-indigo-500/20"], [1, "text-sm", "font-black", "tabular-nums", "text-indigo-700", "dark:text-indigo-300"], [1, "text-[9px]", "font-bold", "uppercase", "tracking-wide", "text-indigo-500", "dark:text-indigo-400"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-1", "rounded-xl", "bg-sky-50", "dark:bg-sky-500/10", "border", "border-sky-100", "dark:border-sky-500/20"], [1, "text-sm", "font-black", "tabular-nums", "text-sky-700", "dark:text-sky-300"], [1, "text-[9px]", "font-bold", "uppercase", "tracking-wide", "text-sky-500", "dark:text-sky-400"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-1", "rounded-xl", "bg-slate-50", "dark:bg-slate-700/50", "border", "border-slate-200", "dark:border-slate-700"], [1, "text-sm", "font-black", "tabular-nums", "text-slate-700", "dark:text-slate-300"], [1, "text-[9px]", "font-bold", "uppercase", "tracking-wide", "text-slate-500", "dark:text-slate-400"], ["role", "group", "aria-label", "Ch\u1EBF \u0111\u1ED9 hi\u1EC3n th\u1ECB card", 1, "ml-auto", "inline-flex", "items-center", "gap-0.5", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900", "p-0.5"], ["type", "button", 1, "h-7", "px-2.5", "rounded-lg", "flex", "items-center", "gap-1.5", "text-[10px]", "font-black", "transition", "active:scale-95", 3, "title", "ngClass"], [1, "cl-batch-grid-shell"], [1, "cl-batch-grid"], [1, "cl-batch-card", "bg-white", "dark:bg-slate-800", "rounded-2xl", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm", "overflow-hidden", 3, "cl-card-compact", "cl-card-standard", "cl-card-wide"], [1, "mt-2.5", "px-1", "flex", "flex-col", "sm:flex-row", "sm:items-center", "justify-between", "gap-1", "text-[9px]", "font-semibold", "text-slate-400"], [1, "fa-solid", "fa-shield-halved", "mr-1.5", "text-emerald-500"], [1, "cl-print-document", "cl-print-only"], [1, "cl-print-list-layout"], [1, "cl-print-header"], [1, "cl-print-table"], [1, "cl-col-batch"], [1, "cl-col-samples"], [1, "cl-col-targets"], [1, "cl-print-compact-layout"], [1, "cl-print-compact-page", 3, "cl-print-compact-page-last"], ["type", "button", 1, "h-7", "px-2.5", "rounded-lg", "flex", "items-center", "gap-1.5", "text-[10px]", "font-black", "transition", "active:scale-95", 3, "click", "title", "ngClass"], ["aria-hidden", "true", 1, "fa-solid", 3, "ngClass"], [1, "hidden", "sm:inline"], [1, "cl-batch-card", "bg-white", "dark:bg-slate-800", "rounded-2xl", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm", "overflow-hidden"], [1, "cl-card-header", "px-4", "border-b", "border-slate-100", "dark:border-slate-700/80", "flex", "flex-col", "justify-between", "gap-3"], [1, "min-w-0", "flex", "items-start", "gap-3"], [1, "w-8", "h-8", "rounded-xl", "bg-blue-600", "text-white", "flex", "items-center", "justify-center", "text-xs", "font-black", "shrink-0"], [1, "text-base", "font-black", "tracking-tight", "text-slate-900", "dark:text-white", "break-words"], [1, "mt-1", "flex", "flex-wrap", "items-center", "gap-x-2", "gap-y-1", "text-[10px]", "font-semibold", "text-slate-400", "dark:text-slate-500"], [1, "text-blue-600", "dark:text-blue-400", "font-black"], [1, "shrink-0", "flex", "flex-wrap", "items-center", "gap-2"], [1, "px-2", "py-1", "rounded-lg", "text-[9px]", "font-black", "bg-emerald-50", "text-emerald-700", "border", "border-emerald-200", "dark:bg-emerald-500/15", "dark:text-emerald-400", "dark:border-emerald-500/30"], [1, "px-2", "py-1", "rounded-lg", "text-[9px]", "font-black", "bg-indigo-50", "text-indigo-700", "border", "border-indigo-200", "dark:bg-indigo-500/15", "dark:text-indigo-400", "dark:border-indigo-500/30"], [1, "px-2", "py-1", "rounded-lg", "text-[9px]", "font-black", "bg-amber-50", "text-amber-700", "border", "border-amber-200", "dark:bg-amber-500/15", "dark:text-amber-400", "dark:border-amber-500/30"], ["type", "button", "title", "S\u1EEDa th\u00F4ng tin m\u1EBB n\u00E0y", 1, "shrink-0", "px-3", "py-1.5", "rounded-lg", "border", "border-emerald-200", "dark:border-emerald-500/30", "bg-emerald-50", "dark:bg-emerald-500/10", "text-emerald-700", "dark:text-emerald-300", "flex", "items-center", "justify-center", "gap-1.5", "transition", "active:scale-95", "hover:bg-emerald-100", "dark:hover:bg-emerald-500/20"], ["type", "button", 1, "shrink-0", "px-3", "py-1.5", "rounded-lg", "border", "border-blue-200", "dark:border-blue-500/30", "bg-blue-50", "dark:bg-blue-500/10", "text-blue-700", "dark:text-blue-300", "flex", "items-center", "justify-center", "gap-1.5", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-layer-group", "text-xs"], [1, "text-[10px]", "font-black", "uppercase", "tracking-wide"], [1, "fa-solid", "fa-chevron-down", "text-[8px]", "transition"], [1, "border-b", "border-slate-100", "dark:border-slate-700", "bg-slate-50/80", "dark:bg-slate-900/40", "px-3", "py-2", "space-y-1.5"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-700/70"], [1, "cl-assignment-row", "cl-card-body-row", "grid"], [1, "cl-card-footer", "bg-slate-50/70", "dark:bg-slate-900/30", "border-t", "border-slate-100", "dark:border-slate-700/70", "flex", "items-center", "justify-between", "gap-3"], ["type", "button", "title", "S\u1EEDa th\u00F4ng tin m\u1EBB n\u00E0y", 1, "shrink-0", "px-3", "py-1.5", "rounded-lg", "border", "border-emerald-200", "dark:border-emerald-500/30", "bg-emerald-50", "dark:bg-emerald-500/10", "text-emerald-700", "dark:text-emerald-300", "flex", "items-center", "justify-center", "gap-1.5", "transition", "active:scale-95", "hover:bg-emerald-100", "dark:hover:bg-emerald-500/20", 3, "click"], [1, "fa-solid", "fa-pen", "text-xs"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "gap-2", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "px-3", "py-2"], [1, "w-6", "h-6", "rounded-lg", "bg-slate-100", "dark:bg-slate-700", "text-slate-500", "dark:text-slate-300", "flex", "items-center", "justify-center", "text-[9px]", "font-black", "shrink-0"], [1, "min-w-0", "flex-1"], [1, "font-mono", "text-[10px]", "font-black", "text-slate-700", "dark:text-slate-300", "break-all"], [1, "text-[10px]", "text-slate-400", "mt-0.5"], [1, "flex", "items-center", "gap-1.5", "shrink-0"], ["type", "button", 1, "h-7", "px-2", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "text-[9px]", "font-black", "text-slate-500", "dark:text-slate-300", "hover:text-blue-600", 3, "click"], [1, "fa-regular", "fa-copy", "mr-1"], ["type", "button", 1, "h-7", "px-2", "rounded-lg", "bg-blue-600", "text-white", "text-[9px]", "font-black", "hover:bg-blue-700", 3, "click"], [1, "fa-solid", "fa-arrow-up-right-from-square", "mr-1"], ["type", "button", "title", "S\u1EEDa th\u00F4ng tin m\u1EBB n\u00E0y", 1, "h-7", "px-2", "rounded-lg", "bg-emerald-50", "dark:bg-emerald-500/10", "border", "border-emerald-200", "dark:border-emerald-500/30", "text-emerald-700", "dark:text-emerald-300", "text-[9px]", "font-black", "hover:bg-emerald-100", "dark:hover:bg-emerald-500/20"], ["type", "button", "title", "S\u1EEDa th\u00F4ng tin m\u1EBB n\u00E0y", 1, "h-7", "px-2", "rounded-lg", "bg-emerald-50", "dark:bg-emerald-500/10", "border", "border-emerald-200", "dark:border-emerald-500/30", "text-emerald-700", "dark:text-emerald-300", "text-[9px]", "font-black", "hover:bg-emerald-100", "dark:hover:bg-emerald-500/20", 3, "click"], [1, "fa-solid", "fa-pen", "mr-1"], [1, "cl-assignment-samples"], [1, "flex", "items-center", "justify-between", "gap-2", "mb-2"], [1, "text-[10px]", "font-black", "uppercase", "tracking-wider", "text-blue-600", "dark:text-blue-400"], [1, "text-[10px]", "font-bold", "text-slate-400"], [1, "cl-sample-grid"], [1, "text-sm", "font-black", "leading-relaxed", "text-slate-850", "dark:text-slate-100", "break-words", 3, "font-mono"], [1, "mt-2", "text-[10px]", "font-bold", "leading-relaxed", "text-fuchsia-700", "dark:text-fuchsia-400", "break-words"], [1, "mt-1", "text-[9px]", "font-black", "text-amber-600", "dark:text-amber-400"], [1, "cl-assignment-targets", "min-w-0"], [1, "text-[10px]", "font-black", "uppercase", "tracking-wider", "text-slate-500", "dark:text-slate-400"], [1, "text-xs", "font-bold", "text-amber-600", "dark:text-amber-400"], [1, "rounded-xl", "border", "border-blue-200", "dark:border-blue-500/30", "bg-blue-50/70", "dark:bg-blue-500/10", "px-3", "py-2.5"], [1, "flex", "flex-wrap", "gap-1.5"], [1, "text-xs", "bg-slate-50", "dark:bg-slate-900", "border", "rounded-lg", "px-2", "py-1", "break-all", 3, "border-amber-300", "border-slate-200", "dark:border-slate-700"], [1, "text-xs", "bg-slate-50", "dark:bg-slate-900", "border", "rounded-lg", "px-2", "py-1", "break-all"], [1, "font-mono", "font-black", "text-slate-800", "dark:text-slate-200"], [1, "font-sans", "font-bold", "text-fuchsia-700", "dark:text-fuchsia-400"], [1, "font-sans", "text-[9px]", "font-black", "text-amber-600"], [1, "text-sm", "font-black", "leading-relaxed", "text-slate-850", "dark:text-slate-100", "break-words"], [1, "fa-solid", "fa-tags", "mr-1"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-2"], [1, "text-xs", "font-black", "text-blue-900", "dark:text-blue-200", "break-words"], ["type", "button", 1, "shrink-0", "text-[10px]", "font-black", "text-blue-700", "dark:text-blue-300", "hover:underline", 3, "click"], [1, "mt-2", "pt-2", "border-t", "border-blue-200/70", "dark:border-blue-500/20", "flex", "flex-wrap", "gap-1.5"], [1, "px-2", "py-1", "rounded-lg", "text-[10px]", "font-bold", "bg-white", "dark:bg-slate-800", "border", "border-blue-100", "dark:border-blue-500/20", "text-blue-800", "dark:text-blue-300", "break-words"], [1, "px-2.5", "py-1", "rounded-lg", "text-[11px]", "font-bold", "bg-blue-50", "dark:bg-blue-500/10", "border", "border-blue-100", "dark:border-blue-500/20", "text-blue-800", "dark:text-blue-300", "break-words"], [1, "px-2.5", "py-1", "rounded-lg", "text-[11px]", "font-black", "bg-slate-100", "dark:bg-slate-700", "text-slate-600", "dark:text-slate-300"], ["type", "button", 1, "text-[10px]", "font-black", "text-blue-600", "dark:text-blue-400", "hover:text-blue-700", "flex", "items-center", "gap-1.5", 3, "click"], [1, "fa-solid"], [1, "cl-print-assignment-row", 3, "cl-print-batch-start"], [1, "cl-print-assignment-row"], [1, "cl-print-batch-cell"], [1, "cl-print-batch-info"], [1, "cl-print-sop"], [1, "cl-print-meta"], [1, "cl-print-samples"], [1, "cl-print-missing"], [1, "cl-print-scope"], [1, "cl-print-targets"], [1, "cl-print-compact-page"], [1, "cl-print-compact-columns"], [1, "cl-print-compact-column"], [1, "cl-print-compact-card"], [1, "cl-print-compact-head"], [1, "cl-print-compact-index"], [1, "cl-print-compact-title"], [1, "cl-print-compact-group"], [1, "cl-print-compact-label"], [1, "cl-print-compact-samples"], [1, "cl-print-compact-targets"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-xl", "border", "border-slate-200", "dark:border-slate-700", "max-w-md", "w-full", "overflow-hidden", "cl-board-enter", "text-slate-800", "dark:text-slate-200"], [1, "px-5", "py-4", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "justify-between", "items-center"], [1, "fa-solid", "fa-sliders", "text-blue-600", "text-sm"], [1, "text-sm", "font-black", "uppercase", "tracking-wider"], [1, "text-slate-400", "hover:text-slate-600", "transition", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "p-5", "space-y-4", "text-xs", "font-bold", "text-slate-650", "dark:text-slate-350"], [1, "space-y-2"], [1, "text-[10px]", "uppercase", "font-black", "tracking-wider", "text-slate-400", "block"], [1, "grid", "grid-cols-3", "gap-1", "bg-slate-50", "dark:bg-slate-900", "p-1", "rounded-xl", "border", "border-slate-100", "dark:border-slate-800"], ["type", "button", 1, "py-2", "rounded-lg", "text-[10px]", "font-extrabold", "transition", "active:scale-95", "flex", "items-center", "justify-center", "gap-1.5", 3, "ngClass"], [1, "text-[10px]", "font-medium", "text-slate-400"], ["type", "button", 1, "py-1.5", "rounded-lg", "text-[10px]", "font-extrabold", "hover:text-slate-800", "dark:hover:text-white", "transition", "active:scale-95", "text-center", 3, "bg-white", "dark:bg-slate-800", "shadow-xs", "text-blue-650", "dark:text-blue-400", "text-slate-500", "dark:text-slate-400"], [1, "rounded-xl", "border", "border-blue-100", "dark:border-blue-500/20", "bg-blue-50", "dark:bg-blue-500/10", "p-3"], [1, "flex", "items-center", "justify-between", "gap-3"], [1, "text-[10px]", "uppercase", "font-black", "tracking-wider", "text-blue-600", "dark:text-blue-400"], [1, "text-xs", "font-black", "text-blue-800", "dark:text-blue-300"], [1, "mt-1", "text-[10px]", "font-medium", "text-blue-700/80", "dark:text-blue-300/80"], [1, "space-y-3", "pt-2", "border-t", "border-slate-100", "dark:border-slate-800"], [1, "flex", "items-center", "gap-2.5", "cursor-pointer", "select-none"], ["type", "checkbox", 1, "w-4", "h-4", "text-blue-600", "dark:bg-slate-900", "border-slate-200", "dark:border-slate-700", "rounded", "focus:ring-blue-500/30", 3, "ngModelChange", "ngModel"], [1, "px-5", "py-4", "bg-slate-50", "dark:bg-slate-900/50", "border-t", "border-slate-100", "dark:border-slate-750", "flex", "justify-end", "gap-2", "shrink-0"], ["type", "button", 1, "px-4", "py-2", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-slate-500", "dark:text-slate-450", "hover:bg-slate-50", "dark:hover:bg-slate-750", "transition", "active:scale-95", "font-bold", 3, "click"], ["type", "button", 1, "px-4", "py-2", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-xl", "shadow-xs", "transition", "active:scale-95", "flex", "items-center", "gap-1.5", "font-bold", 3, "click"], [1, "fa-solid", "fa-print"], ["type", "button", 1, "py-2", "rounded-lg", "text-[10px]", "font-extrabold", "transition", "active:scale-95", "flex", "items-center", "justify-center", "gap-1.5", 3, "click", "ngClass"], ["type", "button", 1, "py-1.5", "rounded-lg", "text-[10px]", "font-extrabold", "hover:text-slate-800", "dark:hover:text-white", "transition", "active:scale-95", "text-center", 3, "click"]], template: function DailyChecklistComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 1)(1, "header", 2)(2, "div", 3);
            i0.ɵɵtemplate(3, DailyChecklistComponent_Conditional_3_Template, 11, 0, "div", 4)(4, DailyChecklistComponent_Conditional_4_Template, 4, 0, "div", 5);
            i0.ɵɵelementStart(5, "div", 6)(6, "button", 7);
            i0.ɵɵlistener("click", function DailyChecklistComponent_Template_button_click_6_listener() { return ctx.moveAvailableDate("older"); });
            i0.ɵɵelement(7, "i", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "label", 9)(9, "span", 10);
            i0.ɵɵtext(10, "Ch\u1ECDn ng\u00E0y theo d\u00F5i");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(11, "i", 11);
            i0.ɵɵelementStart(12, "input", 12);
            i0.ɵɵlistener("ngModelChange", function DailyChecklistComponent_Template_input_ngModelChange_12_listener($event) { return ctx.onDateChange($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "button", 13);
            i0.ɵɵlistener("click", function DailyChecklistComponent_Template_button_click_13_listener() { return ctx.moveAvailableDate("newer"); });
            i0.ɵɵelement(14, "i", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "button", 15);
            i0.ɵɵlistener("click", function DailyChecklistComponent_Template_button_click_15_listener() { return ctx.refreshData(); });
            i0.ɵɵelement(16, "i", 16);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "button", 17);
            i0.ɵɵlistener("click", function DailyChecklistComponent_Template_button_click_17_listener() { return ctx.printDocument(); });
            i0.ɵɵelement(18, "i", 18);
            i0.ɵɵelementStart(19, "span");
            i0.ɵɵtext(20, "In b\u1EA3ng");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(21, "div", 19)(22, "label", 20)(23, "span", 10);
            i0.ɵɵtext(24, "T\u00ECm m\u00E3 m\u1EABu, SOP ho\u1EB7c ch\u1EC9 ti\u00EAu");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(25, "i", 21);
            i0.ɵɵelementStart(26, "input", 22);
            i0.ɵɵlistener("ngModelChange", function DailyChecklistComponent_Template_input_ngModelChange_26_listener($event) { return ctx.searchTerm.set($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(27, "select", 23);
            i0.ɵɵlistener("ngModelChange", function DailyChecklistComponent_Template_select_ngModelChange_27_listener($event) { return ctx.sopFilter.set($event); });
            i0.ɵɵelementStart(28, "option", 24);
            i0.ɵɵtext(29, "T\u1EA5t c\u1EA3 SOP");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(30, DailyChecklistComponent_For_31_Template, 2, 2, "option", 25, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(32, DailyChecklistComponent_Conditional_32_Template, 3, 0, "button", 26);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(33, DailyChecklistComponent_Conditional_33_Template, 3, 0, "div", 27);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "main", 28);
            i0.ɵɵtemplate(35, DailyChecklistComponent_Conditional_35_Template, 6, 1, "section", 29)(36, DailyChecklistComponent_Conditional_36_Template, 8, 1, "section", 30)(37, DailyChecklistComponent_Conditional_37_Template, 7, 0, "section", 29)(38, DailyChecklistComponent_Conditional_38_Template, 9, 0, "section", 31)(39, DailyChecklistComponent_Conditional_39_Template, 67, 12, "article", 32);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(40, DailyChecklistComponent_Conditional_40_Template, 43, 5, "div", 33);
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵclassProp("bg-white", !ctx.embedded)("dark:bg-slate-800", !ctx.embedded)("p-4", !ctx.embedded)("rounded-2xl", !ctx.embedded)("shadow-sm", !ctx.embedded)("border", !ctx.embedded)("border-slate-100", !ctx.embedded)("dark:border-slate-700", !ctx.embedded);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.embedded ? 3 : 4);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("disabled", ctx.loading());
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngModel", ctx.selectedDate())("max", ctx.today);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", !ctx.hasNewerDate());
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.loading());
            i0.ɵɵadvance();
            i0.ɵɵclassProp("animate-spin", ctx.loading());
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.boardBatches().length === 0);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("ngModel", ctx.searchTerm());
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngModel", ctx.sopFilter());
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.sopOptions());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.activeFilterCount() > 0 ? 32 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.usingOfflineCache() ? 33 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.loading() ? 35 : ctx.dataError() ? 36 : ctx.dayBatches().length === 0 ? 37 : ctx.boardBatches().length === 0 ? 38 : 39);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.showPrintSettings() ? 40 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel], styles: ["\n    :host {\n      display: flex;\n      flex-direction: column;\n      height: 100%;\n      min-height: 0;\n    }\n\n    /* ============================================================ */\n    /* SCREEN STYLES                                                */\n    /* ============================================================ */\n\n    @keyframes cl-enter-anim {\n      from { opacity: 0; transform: translateY(8px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n    .cl-board-enter { animation: cl-enter-anim 0.28s ease-out both; }\n\n    /* Document article wrapper \u2013 kh\u00F4ng border/shadow tr\u00EAn m\u00E0n h\u00ECnh */\n    .cl-board-root {\n      width: 100%;\n      max-width: none;\n      margin-inline: auto;\n    }\n\n    .cl-batch-grid-shell { container: batch-grid-shell / inline-size; }\n    .cl-batch-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));\n      gap: 12px;\n      align-items: start;\n      grid-auto-flow: row;\n    }\n    .cl-batch-card {\n      min-width: 0;\n      container-type: inline-size;\n    }\n    .cl-batch-card.cl-card-standard { grid-column: span 2; }\n    .cl-batch-card.cl-card-wide { grid-column: 1 / -1; }\n    .cl-batch-grid[data-view-mode='compact'] .cl-batch-card { grid-column: span 1; }\n    .cl-batch-grid[data-view-mode='list'] .cl-batch-card { grid-column: 1 / -1; }\n\n    .cl-assignment-row { grid-template-columns: minmax(0, 1fr); }\n    .cl-assignment-samples { min-width: 0; }\n    .cl-assignment-targets { border-top: 1px solid rgb(241 245 249); padding-top: 12px; }\n    .dark .cl-assignment-targets { border-color: rgb(51 65 85 / 0.7); }\n    .cl-card-header { padding-block: 10px; }\n    .cl-card-body-row { padding: 12px; gap: 10px; }\n    .cl-card-footer { padding: 8px 16px; }\n\n    @container (min-width: 520px) {\n      .cl-card-header { flex-direction: row; align-items: flex-start; }\n      .cl-card-body-row { padding: 14px 16px; gap: 12px; }\n      .cl-assignment-row {\n        grid-template-columns: minmax(140px, max-content) minmax(0, 1fr);\n        max-width: 100%;\n      }\n      .cl-assignment-samples { max-width: min(45cqi, 340px); }\n      .cl-assignment-targets {\n        border-top: 0;\n        border-left: 1px solid rgb(241 245 249);\n        padding-top: 0;\n        padding-left: 16px;\n      }\n      .dark .cl-assignment-targets { border-color: rgb(51 65 85 / 0.7); }\n    }\n\n    @container (max-width: 459px) {\n      .cl-copy-label { display: none; }\n      .cl-card-header { padding-inline: 12px; }\n    }\n\n    @container batch-grid-shell (max-width: 759px) {\n      .cl-batch-card.cl-card-standard { grid-column: 1 / -1; }\n    }\n\n    /* Target chips grid layout */\n    .cl-target-grid {\n      display: grid;\n      grid-template-columns: minmax(0, 1fr);\n    }\n    @media (min-width: 640px) {\n      .cl-target-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n    }\n    @media (min-width: 1024px) {\n      .cl-target-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n    }\n\n    /* Work group \u2013 tr\u00E1nh ng\u1EAFt trang */\n    .cl-work-group { break-inside: avoid; page-break-inside: avoid; }\n\n    /* SOP heading \u2013 text wrap */\n    .cl-sop-heading h3 { overflow-wrap: anywhere; }\n\n    /* Print-only elements: \u1EA9n ho\u00E0n to\u00E0n tr\u00EAn m\u00E0n h\u00ECnh */\n    .cl-print-only { display: none !important; }\n\n    .cl-sample-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));\n      gap: 6px;\n    }\n\n    @media (prefers-reduced-motion: reduce) {\n      .cl-board-enter { animation: none; }\n    }\n\n    /* ============================================================ */\n    /* PRINT STYLES                                                 */\n    /* ============================================================ */\n    @media print {\n      @page { size: A4 portrait; margin: 6mm; }\n\n      /* V\u00F4 hi\u1EC7u h\u00F3a kh\u00F3a c\u1EE9ng k\u00EDch th\u01B0\u1EDBc d\u1ECDc c\u1EE7a index.html */\n      body.daily-checklist-printing,\n      body.daily-checklist-printing html {\n        width: auto !important;\n        height: auto !important;\n        background: white !important;\n        overflow: visible !important;\n      }\n\n      /* \u1EA8n \u1EE9ng d\u1EE5ng g\u1ED1c khi in, ch\u1EC9 hi\u1EC7n print-container */\n      body.daily-checklist-printing app-root { display: none !important; }\n      \n      body.daily-checklist-printing #print-container {\n        display: block !important;\n        position: relative !important;\n        width: 100% !important;\n        height: auto !important;\n        overflow: visible !important;\n        z-index: auto !important;\n        background: white !important;\n      }\n\n      body.daily-checklist-printing #print-container * {\n        visibility: visible !important;\n      }\n\n      /* \u1EA8n c\u00E1c n\u00FAt b\u1EA5m, b\u1ED9 l\u1ECDc khi in */\n      body.daily-checklist-printing #print-container .cl-screen-only { display: none !important; }\n      body.daily-checklist-printing #print-container .cl-print-only { display: flex !important; }\n\n      /* Reset Page Shell v\u00E0 container cu\u1ED9n c\u1EE7a b\u1EA3n in (QUAN TR\u1ECCNG: S\u1EEDa l\u1ED7i 2 trang in \u0111\u1EA7u b\u1ECB tr\u1EAFng) */\n      body.daily-checklist-printing #print-container .cl-page-shell,\n      body.daily-checklist-printing #print-container .cl-board-scroll {\n        display: block !important;\n        width: 100% !important;\n        height: auto !important;\n        overflow: visible !important;\n        padding: 0 !important;\n        margin: 0 !important;\n      }\n\n      /* Thi\u1EBFt l\u1EADp Header t\u00E0i li\u1EC7u thu nh\u1ECF g\u1ECDn g\u00E0ng \u0111\u1EC3 ti\u1EBFt ki\u1EC7m gi\u1EA5y */\n      body.daily-checklist-printing #print-container .cl-doc-header {\n        background: white !important;\n        border-bottom: 1px solid #cbd5e1 !important;\n        margin-bottom: 6px !important;\n        display: block !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-doc-header > div {\n        padding: 4px 6px !important;\n        gap: 6px !important;\n        display: flex !important;\n        justify-content: space-between !important;\n        align-items: center !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-doc-header h2 {\n        font-size: 11px !important;\n        font-weight: 800 !important;\n        margin: 0 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-doc-header span {\n        margin: 0 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-stats-grid {\n        display: flex !important;\n        gap: 4px !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-stats-grid > div {\n        padding: 1.5px 4px !important;\n        border-radius: 4px !important;\n        border: 1px solid #cbd5e1 !important;\n        background: #f8fafc !important;\n        display: flex !important;\n        align-items: center !important;\n        gap: 2.5px !important;\n        font-size: 8px !important;\n        font-weight: 700 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-stats-grid > div span {\n        font-size: 8px !important;\n      }\n\n      /* Kh\u1ED1i bao ngo\u00E0i c\u1EE7a b\u1EA3n in */\n      body.daily-checklist-printing #print-container .cl-board-root {\n        width: 100% !important;\n        max-width: none !important;\n        border: 1px solid #cbd5e1 !important;\n        border-radius: 10px !important;\n        overflow: hidden !important;\n        display: block !important;\n        background: white !important;\n      }\n\n      /* Thi\u1EBFt l\u1EADp block d\u1ECDc 100% cho container body in \u1EA5n */\n      body.daily-checklist-printing #print-container .cl-board-body {\n        display: block !important;\n        width: 100% !important;\n        padding: 6px 8px !important;\n      }\n\n      /* C\u1EA4U H\u00CCNH S\u1ED0 C\u1ED8T KANBAN MASONRY THEO H\u01AF\u1EDANG GI\u1EA4Y */\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-board-root.print-layout-auto .cl-board-body {\n        column-count: 2 !important;\n        column-gap: 10px !important;\n      }\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-board-root.print-layout-auto .cl-board-body {\n        column-count: 3 !important;\n        column-gap: 12px !important;\n      }\n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-auto .cl-board-body {\n        column-count: 2 !important;\n        column-gap: 10px !important;\n      }\n      \n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-1 .cl-board-body {\n        column-count: 1 !important;\n      }\n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-2 .cl-board-body {\n        column-count: 2 !important;\n        column-gap: 10px !important;\n      }\n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-3 .cl-board-body {\n        column-count: 3 !important;\n        column-gap: 12px !important;\n      }\n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-4 .cl-board-body {\n        column-count: 4 !important;\n        column-gap: 8px !important;\n      }\n\n      /* SOP Card d\u1EA1ng block si\u00EAu n\u00E9n, \u00F4m kh\u00EDt n\u1ED9i dung */\n      body.daily-checklist-printing #print-container .cl-sop-section {\n        display: block !important;\n        width: 100% !important;\n        margin-bottom: 6px !important;\n        break-inside: avoid !important;\n        -webkit-column-break-inside: avoid !important;\n        page-break-inside: avoid !important;\n        border: 1px solid #cbd5e1 !important;\n        border-radius: 6px !important;\n        background-color: #ffffff !important;\n        box-shadow: none !important;\n      }\n\n      /* T\u1ED1i \u01B0u h\u00F3a container ch\u1EE9a c\u00E1c nh\u00F3m ch\u1EC9 ti\u00EAu khi in (B\u1ECF padding, margin d\u01B0 th\u1EEBa) */\n      body.daily-checklist-printing #print-container .cl-sop-section > div.overflow-y-auto {\n        padding: 0 !important;\n        margin: 0 !important;\n        display: block !important;\n      }\n\n      /* Th\u00EAm g\u1EA1ch \u0111\u1EE9t ng\u0103n c\u00E1ch nh\u1EB9 gi\u1EEFa c\u00E1c nh\u00F3m ch\u1EC9 ti\u00EAu thay v\u00EC kho\u1EA3ng tr\u1ED1ng l\u1EDBn */\n      body.daily-checklist-printing #print-container .cl-sop-section > div.overflow-y-auto > * + * {\n        margin-top: 0 !important;\n        border-top: 1px dashed #e2e8f0 !important;\n      }\n\n      /* SOP Header tr\u00EAn trang in */\n      body.daily-checklist-printing #print-container .cl-sop-heading {\n        display: block !important;\n        width: 100% !important;\n        padding: 5px 8px !important;\n        background-color: #f8fafc !important;\n        border-bottom: 1px solid #cbd5e1 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-sop-heading > div {\n        display: flex !important;\n        align-items: center !important;\n        gap: 6px !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-sop-heading h3 {\n        font-weight: 800 !important;\n        color: #0f172a !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-sop-heading span {\n        font-weight: 700 !important;\n        color: #475569 !important;\n      }\n\n      /* Nh\u00F3m m\u1EABu v\u00E0 ch\u1EC9 ti\u00EAu */\n      body.daily-checklist-printing #print-container .cl-work-group {\n        display: block !important;\n        width: 100% !important;\n        padding: 5px 8px !important;\n        margin: 0 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-work-group div.font-mono {\n        line-height: 1.25 !important;\n        color: #1e293b !important;\n        margin-bottom: 3px !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-work-group div.font-mono span.font-sans {\n        color: #64748b !important;\n      }\n\n      /* Th\u1EBB badge ch\u1EC9 ti\u00EAu tr\u00EAn trang in */\n      body.daily-checklist-printing #print-container .cl-work-group .flex-wrap {\n        display: block !important;\n        width: 100% !important;\n        margin-top: 3px !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-work-group .flex-wrap span {\n        display: inline-block !important;\n        background-color: #f1f5f9 !important;\n        border: 1px solid #cbd5e1 !important;\n        color: #0f172a !important;\n        padding: 0.5px 3.5px !important;\n        margin: 1px 2px 1px 0 !important;\n        border-radius: 3px !important;\n        font-weight: 700 !important;\n      }\n\n      /* C\u1EA4U H\u00CCNH C\u1EE0 CH\u1EEE IN */\n      /* XS - Si\u00EAu nh\u1ECF (Khuy\u00EAn d\u00F9ng khi c\u00F3 nhi\u1EC1u SOP \u0111\u1EC3 v\u1EEBa 1 trang) */\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-sop-heading h3 { font-size: 8px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-sop-heading span { font-size: 7px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-work-group { font-size: 7px !important; padding: 2px 4px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-work-group .flex-wrap span { font-size: 6px !important; padding: 0px 1.5px !important; margin: 0.5px 1px 0.5px 0 !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-sop-section { margin-bottom: 4px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header { margin-bottom: 4px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header > div { padding: 3px 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header h2 { font-size: 9.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header span { font-size: 8px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-print-stats-grid > div { padding: 1px 3px !important; gap: 2px !important; font-size: 7px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-print-stats-grid > div span { font-size: 7px !important; }\n\n      /* Small - Nh\u1ECF */\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-sop-heading h3 { font-size: 9.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-work-group { font-size: 8px !important; padding: 3px 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-work-group .flex-wrap span { font-size: 7px !important; padding: 0.5px 2px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-sop-section { margin-bottom: 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header { margin-bottom: 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header > div { padding: 3.5px 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header h2 { font-size: 10.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header span { font-size: 8.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-print-stats-grid > div { padding: 1px 3.5px !important; gap: 2px !important; font-size: 7.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-print-stats-grid > div span { font-size: 7.5px !important; }\n\n      /* Medium - V\u1EEBa */\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-sop-heading h3 { font-size: 12px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-work-group { font-size: 10px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-work-group .flex-wrap span { font-size: 8.5px !important; }\n\n      /* Large - L\u1EDBn */\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-sop-heading h3 { font-size: 14px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-work-group { font-size: 11px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-work-group .flex-wrap span { font-size: 10px !important; }\n\n      /* C\u1EA4U H\u00CCNH \u1EA8N B\u1EA2NG TH\u1ED0NG K\u00CA */\n      body.daily-checklist-printing #print-container .cl-board-root.print-stats-hide .cl-doc-header .cl-print-stats-grid {\n        display: none !important;\n      }\n\n      /* Document footer (print-only) */\n      body.daily-checklist-printing #print-container .cl-doc-footer {\n        padding: 2px 4px !important;\n        font-size: 7px !important;\n        margin-top: 4px !important;\n        color: #64748b !important;\n        display: flex !important;\n      }\n\n      /* Adaptive batch table: print renderer \u0111\u1ED9c l\u1EADp v\u1EDBi card m\u00E0n h\u00ECnh */\n      body.daily-checklist-printing #print-container .cl-adaptive-root {\n        display: block !important;\n        width: 100% !important;\n        margin: 0 !important;\n        padding: 0 !important;\n        color: #0f172a !important;\n        background: #ffffff !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-document {\n        display: block !important;\n        width: 100% !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-header {\n        display: flex !important;\n        align-items: baseline !important;\n        justify-content: space-between !important;\n        gap: 8px !important;\n        padding: 0 0 4mm !important;\n        border-bottom: 1.5px solid #334155 !important;\n        margin-bottom: 3mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-header h2 {\n        margin: 0 !important;\n        font-size: 12pt !important;\n        line-height: 1.2 !important;\n        font-weight: 800 !important;\n        letter-spacing: 0.02em !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-header div {\n        font-size: 9pt !important;\n        white-space: nowrap !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-list-layout,\n      body.daily-checklist-printing #print-container .cl-print-compact-layout {\n        display: none !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-mode-list .cl-print-list-layout {\n        display: block !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-mode-compact .cl-print-compact-layout {\n        display: block !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-page {\n        display: block !important;\n        position: relative !important;\n        box-sizing: border-box !important;\n        break-inside: avoid-page !important;\n        page-break-inside: avoid !important;\n        break-after: page !important;\n        page-break-after: always !important;\n      }\n\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-print-compact-page {\n        height: 265mm !important;\n      }\n\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-print-compact-page {\n        height: 178mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-page-last {\n        break-after: auto !important;\n        page-break-after: auto !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-columns {\n        display: grid !important;\n        align-items: start !important;\n        gap: 4mm !important;\n        box-sizing: border-box !important;\n      }\n\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-print-compact-columns {\n        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;\n      }\n\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-print-compact-columns {\n        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-column {\n        display: block !important;\n        min-width: 0 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-card {\n        display: block !important;\n        width: 100% !important;\n        margin: 0 0 4mm !important;\n        border: 1px solid #94a3b8 !important;\n        border-radius: 2.5mm !important;\n        overflow: hidden !important;\n        break-inside: avoid !important;\n        page-break-inside: avoid !important;\n        background: white !important;\n        font-size: 8pt !important;\n        line-height: 1.3 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-head {\n        display: flex !important;\n        align-items: flex-start !important;\n        gap: 2mm !important;\n        padding: 2.2mm !important;\n        border-bottom: 1px solid #cbd5e1 !important;\n        background: #f8fafc !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-index {\n        display: flex !important;\n        align-items: center !important;\n        justify-content: center !important;\n        width: 5mm !important;\n        height: 5mm !important;\n        flex: 0 0 5mm !important;\n        border-radius: 50% !important;\n        color: white !important;\n        background: #2563eb !important;\n        font-size: 7pt !important;\n        font-weight: 800 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-title {\n        min-width: 0 !important;\n        flex: 1 1 auto !important;\n        font-size: 8.5pt !important;\n        font-weight: 800 !important;\n        overflow-wrap: anywhere !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-title small {\n        display: block !important;\n        margin-top: 0.7mm !important;\n        color: #64748b !important;\n        font-size: 6.5pt !important;\n        font-weight: 600 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-group {\n        padding: 2.2mm !important;\n        break-inside: avoid !important;\n        page-break-inside: avoid !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-group + .cl-print-compact-group {\n        border-top: 1px dashed #cbd5e1 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-label {\n        margin-bottom: 0.7mm !important;\n        color: #64748b !important;\n        font-size: 6.7pt !important;\n        font-weight: 800 !important;\n        text-transform: uppercase !important;\n        letter-spacing: 0.03em !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-samples {\n        margin-bottom: 1.5mm !important;\n        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;\n        font-size: 8.5pt !important;\n        font-weight: 800 !important;\n        overflow-wrap: anywhere !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-targets {\n        margin: 0 !important;\n        padding: 0 !important;\n        list-style: none !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-targets li {\n        display: inline !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-targets li:not(:last-child)::after {\n        content: '; ' !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-table {\n        display: table !important;\n        width: 100% !important;\n        table-layout: fixed !important;\n        border-collapse: collapse !important;\n        border: 1px solid #64748b !important;\n        font-size: 9pt !important;\n        line-height: 1.3 !important;\n      }\n\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-col-batch { width: 24% !important; }\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-col-samples { width: 38% !important; }\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-col-targets { width: 38% !important; }\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-col-batch { width: 22% !important; }\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-col-samples { width: 40% !important; }\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-col-targets { width: 38% !important; }\n\n      body.daily-checklist-printing #print-container .cl-print-table thead {\n        display: table-header-group !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-table th {\n        padding: 2.2mm 2.5mm !important;\n        border: 1px solid #64748b !important;\n        background: #e2e8f0 !important;\n        color: #0f172a !important;\n        text-align: left !important;\n        text-transform: uppercase !important;\n        letter-spacing: 0.04em !important;\n        font-size: 8pt !important;\n        font-weight: 800 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-table td {\n        padding: 2.5mm !important;\n        border: 1px solid #94a3b8 !important;\n        vertical-align: top !important;\n        overflow-wrap: anywhere !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-assignment-row {\n        break-inside: avoid !important;\n        page-break-inside: avoid !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-batch-start td {\n        border-top-width: 1.5px !important;\n        border-top-color: #334155 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-batch-cell {\n        display: flex !important;\n        align-items: flex-start !important;\n        gap: 2.5mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-batch-info {\n        min-width: 0 !important;\n        flex: 1 1 auto !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-sop {\n        font-weight: 700 !important;\n        color: #334155 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-meta,\n      body.daily-checklist-printing #print-container .cl-print-count {\n        display: flex !important;\n        flex-wrap: wrap !important;\n        gap: 1.5mm !important;\n        margin-top: 1mm !important;\n        color: #64748b !important;\n        font-size: 7.5pt !important;\n        font-weight: 600 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-samples + .cl-print-meta {\n        color: #86198f !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-samples {\n        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;\n        font-size: 9pt !important;\n        font-weight: 800 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-targets {\n        margin: 0 !important;\n        padding-left: 4mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-targets li {\n        margin: 0 0 0.7mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-missing {\n        font-style: italic !important;\n        color: #92400e !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-scope {\n        display: flex !important;\n        flex-direction: column !important;\n        gap: 0.8mm !important;\n        color: #172554 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-scope strong {\n        font-size: 8.5pt !important;\n        line-height: 1.2 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-scope span {\n        color: #64748b !important;\n        font-size: 7.5pt !important;\n        font-weight: 700 !important;\n      }\n\n    }\n  "], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DailyChecklistComponent, [{
        type: Component,
        args: [{ selector: 'app-daily-checklist', standalone: true, imports: [CommonModule, FormsModule], encapsulation: ViewEncapsulation.None, template: "<div class=\"cl-page-shell h-full min-h-0 flex flex-col font-sans text-slate-800 dark:text-slate-200 overflow-hidden\">\r\n\r\n  <!-- ===== SCREEN-ONLY HEADER & CONTROLS ===== -->\r\n  <header class=\"cl-screen-only shrink-0 mb-4\" \r\n          [class.bg-white]=\"!embedded\" [class.dark:bg-slate-800]=\"!embedded\" [class.p-4]=\"!embedded\" [class.rounded-2xl]=\"!embedded\" [class.shadow-sm]=\"!embedded\" [class.border]=\"!embedded\" [class.border-slate-100]=\"!embedded\" [class.dark:border-slate-700]=\"!embedded\">\r\n\r\n    <!-- Row 1: Title & Main Navigation (Hidden left side when embedded) -->\r\n    <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4\">\r\n\r\n      <!-- Left: Icon + Title (Only show when NOT embedded) -->\r\n      @if (!embedded) {\r\n        <div class=\"flex items-center gap-3 min-w-0\">\r\n          <div class=\"w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-sm shrink-0\">\r\n            <i class=\"fa-solid fa-clipboard-check text-base\" aria-hidden=\"true\"></i>\r\n          </div>\r\n          <div class=\"min-w-0\">\r\n            <div class=\"flex items-center gap-2\">\r\n              <h1 class=\"text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight truncate\">B\u1EA3ng theo D\u00F5i M\u1EABu Ng\u00E0y</h1>\r\n              <span class=\"hidden sm:inline-flex px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 text-[9px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-500/20\">B\u1EA3ng quan s\u00E1t KNV</span>\r\n            </div>\r\n            <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate\">Theo d\u00F5i ng\u00E0y l\u00E0m m\u1EABu, ch\u1EC9 ti\u00EAu th\u1EF1c hi\u1EC7n v\u00E0 t\u00ECnh tr\u1EA1ng k\u1EBFt qu\u1EA3</p>\r\n          </div>\r\n        </div>\r\n      } @else {\r\n        <!-- When embedded, show a clean flat widget title line instead of a heavy box header -->\r\n        <div class=\"flex items-center gap-2\">\r\n          <div class=\"w-1.5 h-4 bg-blue-600 rounded-full\"></div>\r\n          <h2 class=\"text-base font-bold text-gray-700 dark:text-slate-200 uppercase tracking-wider\">Theo D\u00F5i M\u1EABu & K\u1EBFt Qu\u1EA3 Ng\u00E0y</h2>\r\n        </div>\r\n      }\r\n\r\n      <!-- Right: Date navigation + Print button -->\r\n      <div class=\"flex items-center gap-2 w-full md:w-auto ml-auto\">\r\n        <button type=\"button\" (click)=\"moveAvailableDate('older')\" [disabled]=\"loading()\"\n                aria-label=\"Ng\u00E0y tr\u01B0\u1EDBc\" title=\"Ng\u00E0y tr\u01B0\u1EDBc\"\n                class=\"w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition active:scale-95 flex items-center justify-center bg-white dark:bg-slate-800\">\n          <i class=\"fa-solid fa-chevron-left text-xs\" aria-hidden=\"true\"></i>\n        </button>\r\n\r\n        <label class=\"relative flex-1 md:flex-none min-w-0\">\r\n          <span class=\"sr-only\">Ch\u1ECDn ng\u00E0y theo d\u00F5i</span>\n          <i class=\"fa-regular fa-calendar absolute inset-y-0 left-3 hidden sm:flex items-center text-blue-500 text-sm pointer-events-none\" aria-hidden=\"true\"></i>\n          <input type=\"date\" [ngModel]=\"selectedDate()\" (ngModelChange)=\"onDateChange($event)\"\n                 [max]=\"today\" aria-label=\"Ch\u1ECDn ng\u00E0y theo d\u00F5i\"\n                 class=\"w-full md:w-56 h-10 pl-3 sm:pl-9 pr-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none text-slate-700 dark:text-slate-205\" />\n        </label>\r\n\r\n        <button type=\"button\" (click)=\"moveAvailableDate('newer')\" [disabled]=\"!hasNewerDate()\"\r\n                aria-label=\"Ng\u00E0y sau\" title=\"Ng\u00E0y sau\"\n                class=\"w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition active:scale-95 flex items-center justify-center bg-white dark:bg-slate-800\">\r\n          <i class=\"fa-solid fa-chevron-right text-xs\" aria-hidden=\"true\"></i>\r\n        </button>\r\n\r\n        <button type=\"button\" (click)=\"refreshData()\" [disabled]=\"loading()\"\r\n                aria-label=\"L\u00E0m m\u1EDBi d\u1EEF li\u1EC7u\" title=\"L\u00E0m m\u1EDBi d\u1EEF li\u1EC7u t\u1EEB m\u00E1y ch\u1EE7\"\r\n                class=\"w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 shrink-0 transition active:scale-95 flex items-center justify-center bg-white dark:bg-slate-800\">\r\n          <i class=\"fa-solid fa-rotate\" [class.animate-spin]=\"loading()\" aria-hidden=\"true\"></i>\r\n        </button>\r\n\r\n        <button type=\"button\" (click)=\"printDocument()\" [disabled]=\"boardBatches().length === 0\"\r\n                aria-label=\"In b\u1EA3ng \u0111ang xem\" title=\"In b\u1EA3ng \u0111ang xem\"\r\n                class=\"px-4 h-10 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:shadow-md dark:shadow-none transition text-xs uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0\">\r\n          <i class=\"fa-solid fa-print\" aria-hidden=\"true\"></i>\r\n          <span>In b\u1EA3ng</span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Row 2: Filter bar -->\r\n    <div class=\"mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/70 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)_auto] gap-2\">\r\n      <label class=\"relative min-w-0\">\r\n        <span class=\"sr-only\">T\u00ECm m\u00E3 m\u1EABu, SOP ho\u1EB7c ch\u1EC9 ti\u00EAu</span>\r\n        <i class=\"fa-solid fa-magnifying-glass absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs pointer-events-none\" aria-hidden=\"true\"></i>\r\n        <input type=\"search\" [ngModel]=\"searchTerm()\" (ngModelChange)=\"searchTerm.set($event)\"\r\n               placeholder=\"T\u00ECm m\u00E3 m\u1EABu, SOP ho\u1EB7c ch\u1EC9 ti\u00EAu...\"\r\n               class=\"w-full h-10 pl-9 pr-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none text-slate-750 dark:text-slate-200\" />\r\n      </label>\r\n\r\n      <select [ngModel]=\"sopFilter()\" (ngModelChange)=\"sopFilter.set($event)\" aria-label=\"L\u1ECDc theo SOP\"\r\n              class=\"h-10 min-w-0 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 dark:text-slate-200\">\r\n        <option value=\"all\">T\u1EA5t c\u1EA3 SOP</option>\r\n        @for (sop of sopOptions(); track sop.id) {\r\n          <option [value]=\"sop.id\">{{sop.name}}</option>\r\n        }\r\n      </select>\r\n\r\n      @if (activeFilterCount() > 0) {\r\n        <button type=\"button\" (click)=\"clearFilters()\"\r\n                class=\"h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-350 transition active:scale-95 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 bg-white dark:bg-slate-800\">\r\n          <i class=\"fa-solid fa-rotate-left\" aria-hidden=\"true\"></i>\u0110\u1EB7t L\u1EA1i\r\n        </button>\r\n      }\r\n    </div>\r\n\r\n    @if (usingOfflineCache()) {\r\n      <div class=\"mt-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-[10px] font-bold text-amber-700 dark:text-amber-300\">\r\n        <i class=\"fa-solid fa-wifi mr-1.5\" aria-hidden=\"true\"></i>\u0110ang hi\u1EC3n th\u1ECB d\u1EEF li\u1EC7u l\u01B0u c\u1EE5c b\u1ED9; h\u00E3y l\u00E0m m\u1EDBi khi k\u1EBFt n\u1ED1i \u1ED5n \u0111\u1ECBnh.\r\n      </div>\r\n    }\r\n  </header>\r\n\r\n  <!-- ===== MAIN SCROLL AREA ===== -->\r\n  <main class=\"cl-board-scroll flex-1 min-h-0 overflow-y-auto p-0.5 custom-scrollbar\">\r\n\r\n    @if (loading()) {\r\n      <section class=\"max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center py-16 text-center px-4 cl-board-enter\">\r\n        <i class=\"fa-solid fa-circle-notch fa-spin text-2xl text-blue-500 mb-3\" aria-hidden=\"true\"></i>\r\n        <h2 class=\"text-sm font-black text-slate-700 dark:text-slate-200\">\u0110ang T\u1EA3i D\u1EEF Li\u1EC7u theo Ng\u00E0y</h2>\r\n        <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-1\">\u0110\u00E3 nh\u1EADn {{loadedBatchCount()}} m\u1EBB ph\u00F9 h\u1EE3p.</p>\r\n      </section>\r\n\r\n    } @else if (dataError()) {\r\n      <section class=\"max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-red-100 dark:border-red-900/40 shadow-sm flex flex-col items-center justify-center py-14 text-center px-4 cl-board-enter\">\r\n        <i class=\"fa-solid fa-triangle-exclamation text-2xl text-red-500 mb-3\" aria-hidden=\"true\"></i>\r\n        <h2 class=\"text-sm font-black text-slate-700 dark:text-slate-200\">Kh\u00F4ng Th\u1EC3 T\u1EA3i D\u1EEF Li\u1EC7u</h2>\r\n        <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-1\">{{dataError()}}</p>\r\n        <button type=\"button\" (click)=\"refreshData()\" class=\"mt-3 h-9 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700\">Th\u1EED L\u1EA1i</button>\r\n      </section>\r\n\r\n    } @else if (dayBatches().length === 0) {\r\n      <!-- Empty state A: Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u ph\u00EA duy\u1EC7t -->\r\n      <section class=\"max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center py-16 text-center px-4 cl-board-enter\">\r\n        <div class=\"w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-500 flex items-center justify-center mb-3\">\r\n          <i class=\"fa-regular fa-calendar-xmark text-xl\" aria-hidden=\"true\"></i>\r\n        </div>\r\n        <h2 class=\"text-sm font-black text-slate-700 dark:text-slate-200\">Ch\u01B0a C\u00F3 M\u1EBB theo Ng\u00E0y Ph\u00E2n T\u00EDch N\u00E0y</h2>\r\n        <p class=\"text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1\">Ch\u1EC9 c\u00E1c m\u1EBB c\u00F3 ng\u00E0y ph\u00E2n t\u00EDch h\u1EE3p l\u1EC7 v\u00E0 \u0111\u00E3 ph\u00EA duy\u1EC7t m\u1EDBi \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB.</p>\r\n      </section>\r\n\r\n    } @else if (boardBatches().length === 0) {\r\n      <!-- Empty state B: Kh\u00F4ng t\u00ECm th\u1EA5y khi c\u00F3 filter -->\r\n      <section class=\"max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center py-12 text-center px-4 cl-board-enter\">\r\n        <div class=\"w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-300 dark:text-blue-400 flex items-center justify-center mb-3\">\r\n          <i class=\"fa-solid fa-magnifying-glass text-lg\" aria-hidden=\"true\"></i>\r\n        </div>\r\n        <h2 class=\"text-xs font-black text-slate-700 dark:text-slate-200\">Kh\u00F4ng T\u00ECm Th\u1EA5y Nh\u00F3m M\u1EABu Ph\u00F9 H\u1EE3p</h2>\r\n        <p class=\"text-[11px] text-slate-500 dark:text-slate-400 mt-1\">Th\u1EED m\u00E3 m\u1EABu, t\u00EAn SOP ho\u1EB7c t\u00EAn ch\u1EC9 ti\u00EAu kh\u00E1c.</p>\r\n        <button type=\"button\" (click)=\"clearFilters()\"\r\n                class=\"mt-3 h-8 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors\">\r\n          Hi\u1EC3n Th\u1ECB To\u00E0n B\u1ED9\r\n        </button>\r\n      </section>\r\n\r\n    } @else {\r\n      <!-- ===== DATA VIEW ===== -->\r\n      <article class=\"cl-adaptive-root cl-board-enter\">\r\n        <div class=\"cl-screen-only\">\r\n          <div class=\"mb-3 flex flex-wrap items-center gap-1.5\">\r\n            <div class=\"flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20\">\r\n              <span class=\"text-sm font-black tabular-nums text-blue-700 dark:text-blue-300\">{{boardSummary().batches}}</span>\r\n              <span class=\"text-[9px] font-bold uppercase tracking-wide text-blue-500 dark:text-blue-400\">M\u1EBB</span>\r\n            </div>\r\n            <div class=\"flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20\">\r\n              <span class=\"text-sm font-black tabular-nums text-indigo-700 dark:text-indigo-300\">{{boardSummary().samples}}</span>\r\n              <span class=\"text-[9px] font-bold uppercase tracking-wide text-indigo-500 dark:text-indigo-400\">M\u1EABu</span>\r\n            </div>\r\n            <div class=\"flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20\">\r\n              <span class=\"text-sm font-black tabular-nums text-sky-700 dark:text-sky-300\">{{boardSummary().targets}}</span>\r\n              <span class=\"text-[9px] font-bold uppercase tracking-wide text-sky-500 dark:text-sky-400\">Ch\u1EC9 ti\u00EAu</span>\r\n            </div>\r\n            <div class=\"flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700\">\r\n              <span class=\"text-sm font-black tabular-nums text-slate-700 dark:text-slate-300\">{{boardSummary().sops}}</span>\r\n              <span class=\"text-[9px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400\">SOP</span>\r\n            </div>\r\n\r\n            <div class=\"ml-auto inline-flex items-center gap-0.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-0.5\" role=\"group\" aria-label=\"Ch\u1EBF \u0111\u1ED9 hi\u1EC3n th\u1ECB card\">\r\n              @for (option of viewModeOptions; track option.value) {\r\n                <button type=\"button\" (click)=\"setViewMode(option.value)\"\r\n                        [attr.aria-pressed]=\"viewMode() === option.value\"\r\n                        [title]=\"option.label\"\r\n                        class=\"h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-[10px] font-black transition active:scale-95\"\r\n                        [ngClass]=\"viewMode() === option.value\r\n                          ? 'bg-white dark:bg-slate-700 text-blue-650 dark:text-blue-300 shadow-sm'\r\n                          : 'text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'\">\r\n                  <i class=\"fa-solid\" [ngClass]=\"option.icon\" aria-hidden=\"true\"></i>\r\n                  <span class=\"hidden sm:inline\">{{option.label}}</span>\r\n                </button>\r\n              }\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"cl-batch-grid-shell\">\r\n            <div #batchGrid class=\"cl-batch-grid\" [attr.data-view-mode]=\"viewMode()\">\r\n              @let layoutHints = batchLayoutHints();\r\n              @for (batch of boardBatches(); track batch.cardKey; let batchIndex = $index) {\r\n                @let layoutHint = layoutHints.get(batch.cardKey) || 'wide';\r\n                <section class=\"cl-batch-card bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden\"\r\n                         [class.cl-card-compact]=\"layoutHint === 'compact'\"\r\n                         [class.cl-card-standard]=\"layoutHint === 'standard'\"\r\n                         [class.cl-card-wide]=\"layoutHint === 'wide'\">\r\n                <header class=\"cl-card-header px-4 border-b border-slate-100 dark:border-slate-700/80 flex flex-col justify-between gap-3\">\r\n                  <div class=\"min-w-0 flex items-start gap-3\">\r\n                    <div class=\"w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0\">{{batchIndex + 1}}</div>\r\n                    <div class=\"min-w-0\">\r\n                      <h3 class=\"text-base font-black tracking-tight text-slate-900 dark:text-white break-words\">{{batch.sopName}}</h3>\r\n                      <div class=\"mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500\">\r\n                        <span class=\"text-blue-600 dark:text-blue-400 font-black\">{{batch.physicalBatchCount}} m\u1EBB</span><span>\u2022</span>\r\n                        <span>{{batch.uniqueSamples}} m\u1EABu</span><span>\u2022</span>\r\n                        <span>{{batch.uniqueTargets}} ch\u1EC9 ti\u00EAu</span><span>\u2022</span>\r\n                        <span>{{batch.groups.length}} nh\u00F3m ph\u00E2n c\u00F4ng</span>\r\n                        @if (batch.sopVersion) { <span>\u2022 SOP v{{batch.sopVersion}}</span> }\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <div class=\"shrink-0 flex flex-wrap items-center gap-2\">\r\n                    @if (batch.statusCounts.completed > 0) { <span class=\"px-2 py-1 rounded-lg text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30\">{{batch.statusCounts.completed}} c\u00F3 KQ</span> }\r\n                    @if (batch.statusCounts.draft > 0) { <span class=\"px-2 py-1 rounded-lg text-[9px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30\">{{batch.statusCounts.draft}} \u0111ang nh\u1EADp</span> }\r\n                    @if (batch.statusCounts.approved > 0) { <span class=\"px-2 py-1 rounded-lg text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30\">{{batch.statusCounts.approved}} ch\u01B0a KQ</span> }\r\n                    @if (state.isAdmin() && batch.physicalBatchCount === 1) {\r\n                      <button type=\"button\" (click)=\"editBatch(batch.sourceBatches[0].requestId)\"\r\n                              class=\"shrink-0 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5 transition active:scale-95 hover:bg-emerald-100 dark:hover:bg-emerald-500/20\"\r\n                              title=\"S\u1EEDa th\u00F4ng tin m\u1EBB n\u00E0y\">\r\n                        <i class=\"fa-solid fa-pen text-xs\"></i><span class=\"text-[10px] font-black uppercase tracking-wide\">S\u1EEDa m\u1EBB</span>\r\n                      </button>\r\n                    }\r\n                    <button type=\"button\" (click)=\"toggleSourceBatchList(batch.cardKey)\"\r\n                            class=\"shrink-0 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 flex items-center justify-center gap-1.5 transition active:scale-95\">\r\n                      <i class=\"fa-solid fa-layer-group text-xs\"></i><span class=\"text-[10px] font-black uppercase tracking-wide\">{{batch.physicalBatchCount}} m\u1EBB</span>\r\n                      <i class=\"fa-solid fa-chevron-down text-[8px] transition\" [class.rotate-180]=\"isSourceBatchListOpen(batch.cardKey)\"></i>\r\n                    </button>\r\n                  </div>\r\n                </header>\r\n\r\n                @if (isSourceBatchListOpen(batch.cardKey)) {\r\n                  <div class=\"border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 px-3 py-2 space-y-1.5\">\r\n                    @for (source of batch.sourceBatches; track source.requestId; let sourceIndex = $index) {\r\n                      <div class=\"flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2\">\r\n                        <div class=\"w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-[9px] font-black shrink-0\">{{sourceIndex + 1}}</div>\r\n                        <div class=\"min-w-0 flex-1\">\r\n                          <div class=\"font-mono text-[10px] font-black text-slate-700 dark:text-slate-300 break-all\">{{source.requestId}}</div>\r\n                          <div class=\"text-[10px] text-slate-400 mt-0.5\">{{source.formattedSamples || 'Ch\u01B0a x\u00E1c \u0111\u1ECBnh m\u00E3 m\u1EABu'}} \u00B7 {{sourceBatchStatusLabel(source.status)}}</div>\r\n                        </div>\r\n                        <div class=\"flex items-center gap-1.5 shrink-0\">\r\n                          <button type=\"button\" (click)=\"copyBatchId(source.requestId)\" class=\"h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-700 text-[9px] font-black text-slate-500 dark:text-slate-300 hover:text-blue-600\"><i class=\"fa-regular fa-copy mr-1\"></i>Sao Ch\u00E9p</button>\r\n                          <button type=\"button\" (click)=\"navigateToResult(source.requestId, source.status)\" class=\"h-7 px-2 rounded-lg bg-blue-600 text-white text-[9px] font-black hover:bg-blue-700\"><i class=\"fa-solid fa-arrow-up-right-from-square mr-1\"></i>M\u1EDF K\u1EBFt Qu\u1EA3</button>\r\n                          @if (state.isAdmin()) {\r\n                            <button type=\"button\" (click)=\"editBatch(source.requestId)\" class=\"h-7 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[9px] font-black hover:bg-emerald-100 dark:hover:bg-emerald-500/20\" title=\"S\u1EEDa th\u00F4ng tin m\u1EBB n\u00E0y\">\r\n                              <i class=\"fa-solid fa-pen mr-1\"></i>S\u1EEDa M\u1EBB\r\n                            </button>\r\n                          }\r\n                        </div>\r\n                      </div>\r\n                    }\r\n                  </div>\r\n                }\r\n\r\n                <div class=\"divide-y divide-slate-100 dark:divide-slate-700/70\">\r\n                  @for (group of visibleBatchGroups(batch); track group.signature; let groupIndex = $index) {\r\n                    <div class=\"cl-assignment-row cl-card-body-row grid\">\r\n                      <div class=\"cl-assignment-samples\">\r\n                        <div class=\"flex items-center justify-between gap-2 mb-2\">\r\n                          <span class=\"text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400\">\r\n                            M\u1EABu th\u1EF1c hi\u1EC7n@if (batch.groups.length > 1) { <span> \u00B7 Nh\u00F3m {{groupIndex + 1}}</span> }\r\n                          </span>\r\n                          <span class=\"text-[10px] font-bold text-slate-400\">{{group.sampleIds.length}} m\u1EABu</span>\r\n                        </div>\r\n                        @if (isBatchExpanded(batch.cardKey)) {\r\n                          <div class=\"cl-sample-grid\">\r\n                            @for (sample of group.samples; track sample.sampleId) {\r\n                              <span class=\"text-xs bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 py-1 break-all\" [class.border-amber-300]=\"sample.descriptionAlternatives?.length\" [class.border-slate-200]=\"!sample.descriptionAlternatives?.length\" [class.dark:border-slate-700]=\"!sample.descriptionAlternatives?.length\">\r\n                                <span class=\"font-mono font-black text-slate-800 dark:text-slate-200\">{{sample.sampleId}}</span>\r\n                                @if (sample.description) { <span class=\"font-sans font-bold text-fuchsia-700 dark:text-fuchsia-400\"> \u00B7 {{sample.description.nameSnapshot}}</span> }\r\n                                @if (sample.descriptionAlternatives?.length) { <span class=\"font-sans text-[9px] font-black text-amber-600\"> \u00B7 Kh\u00F4ng th\u1ED1ng nh\u1EA5t: {{sample.descriptionAlternatives?.join(' / ')}}</span> }\r\n                              </span>\r\n                            }\r\n                          </div>\r\n                        } @else {\r\n                          <p class=\"text-sm font-black leading-relaxed text-slate-850 dark:text-slate-100 break-words\" [class.font-mono]=\"!group.hasMultipleDescriptions\">\r\n                            {{group.hasMultipleDescriptions ? group.formattedDescriptions : (group.formattedSamples || 'Ch\u01B0a x\u00E1c \u0111\u1ECBnh m\u00E3 m\u1EABu')}}\r\n                          </p>\r\n                        }\r\n                        @if (group.formattedDescriptions && !group.hasMultipleDescriptions) {\r\n                          <p class=\"mt-2 text-[10px] font-bold leading-relaxed text-fuchsia-700 dark:text-fuchsia-400 break-words\"><i class=\"fa-solid fa-tags mr-1\"></i>{{group.formattedDescriptions}}</p>\r\n                        }\r\n                        @if (group.hasDescriptionConflict) { <p class=\"mt-1 text-[9px] font-black text-amber-600 dark:text-amber-400\"><i class=\"fa-solid fa-triangle-exclamation mr-1\"></i>C\u00F3 m\u00E3 m\u1EABu mang m\u00F4 t\u1EA3 kh\u00F4ng th\u1ED1ng nh\u1EA5t gi\u1EEFa c\u00E1c m\u1EBB.</p> }\r\n                      </div>\r\n\r\n                      <div class=\"cl-assignment-targets min-w-0\">\r\n                        <div class=\"flex items-center justify-between gap-2 mb-2\">\r\n                          <span class=\"text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400\">Ch\u1EC9 ti\u00EAu \u0111\u01B0\u1EE3c g\u00E1n</span>\r\n                          <span class=\"text-[10px] font-bold text-slate-400\">{{group.targetNames.length}} ch\u1EC9 ti\u00EAu</span>\r\n                        </div>\r\n                        @if (group.targetNames.length === 0) {\r\n                          <p class=\"text-xs font-bold text-amber-600 dark:text-amber-400\">Ch\u01B0a x\u00E1c \u0111\u1ECBnh ch\u1EC9 ti\u00EAu</p>\r\n                        } @else if (group.targetScope.compact) {\r\n                          <div class=\"rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/70 dark:bg-blue-500/10 px-3 py-2.5\">\r\n                            <div class=\"flex flex-wrap items-center justify-between gap-2\">\r\n                              <div class=\"min-w-0\">\r\n                                <p class=\"text-xs font-black text-blue-900 dark:text-blue-200 break-words\">{{group.targetScope.headline}}</p>\r\n                              </div>\r\n                              <button type=\"button\" (click)=\"toggleTargetDetail(batch.cardKey, group.signature)\"\r\n                                      class=\"shrink-0 text-[10px] font-black text-blue-700 dark:text-blue-300 hover:underline\">\r\n                                {{isTargetDetailOpen(batch.cardKey, group.signature) ? '\u1EA8n danh s\u00E1ch' : 'Xem danh s\u00E1ch'}}\r\n                              </button>\r\n                            </div>\r\n                            @if (isTargetDetailOpen(batch.cardKey, group.signature)) {\r\n                              <div class=\"mt-2 pt-2 border-t border-blue-200/70 dark:border-blue-500/20 flex flex-wrap gap-1.5\">\r\n                                @for (targetName of group.targetNames; track targetName) {\r\n                                  <span class=\"px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-500/20 text-blue-800 dark:text-blue-300 break-words\">{{targetName}}</span>\r\n                                }\r\n                              </div>\r\n                            }\r\n                          </div>\r\n                        } @else {\r\n                          <div class=\"flex flex-wrap gap-1.5\">\r\n                            @for (targetName of visibleTargetNames(batch, group.targetNames); track targetName) {\r\n                              <span class=\"px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-800 dark:text-blue-300 break-words\">{{targetName}}</span>\r\n                            }\r\n                            @if (!isBatchExpanded(batch.cardKey) && group.targetNames.length > 6) {\r\n                              <span class=\"px-2.5 py-1 rounded-lg text-[11px] font-black bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300\">\r\n                                +{{group.targetNames.length - 6}} ch\u1EC9 ti\u00EAu\r\n                              </span>\r\n                            }\r\n                          </div>\r\n                        }\r\n                      </div>\r\n                    </div>\r\n                  }\r\n                </div>\r\n\r\n                @if (hasHiddenBatchContent(batch)) {\r\n                  <footer class=\"cl-card-footer bg-slate-50/70 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between gap-3\">\r\n                    @if (!isBatchExpanded(batch.cardKey) && hiddenBatchGroupCount(batch) > 0) {\r\n                      <span class=\"text-[10px] font-bold text-slate-400\">+ {{hiddenBatchGroupCount(batch)}} nh\u00F3m ph\u00E2n c\u00F4ng</span>\r\n                    } @else {\r\n                      <span></span>\r\n                    }\r\n                    <button type=\"button\" (click)=\"toggleBatchSamples(batch.cardKey)\" class=\"text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5\">\r\n                      <i class=\"fa-solid\" [class.fa-compress]=\"isBatchExpanded(batch.cardKey)\" [class.fa-table-cells]=\"!isBatchExpanded(batch.cardKey)\"></i>\r\n                      {{isBatchExpanded(batch.cardKey) ? 'Thu g\u1ECDn card' : 'M\u1EDF r\u1ED9ng chi ti\u1EBFt'}}\r\n                    </button>\r\n                  </footer>\r\n                }\r\n              </section>\r\n              }\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"mt-2.5 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[9px] font-semibold text-slate-400\">\r\n            <span><i class=\"fa-solid fa-shield-halved mr-1.5 text-emerald-500\"></i>D\u1EEF li\u1EC7u truy v\u1EA5n tr\u1EF1c ti\u1EBFp theo ng\u00E0y ki\u1EC3m nghi\u1EC7m.</span>\r\n            <span>M\u1ED7i card l\u00E0 m\u1ED9t SOP/phi\u00EAn b\u1EA3n; c\u00E1c m\u1EBB v\u1EADt l\u00FD v\u1EABn \u0111\u1ED9c l\u1EADp v\u00E0 m\u1EABu ch\u1EC9 \u0111\u01B0\u1EE3c gom khi c\u00F3 c\u00F9ng b\u1ED9 ch\u1EC9 ti\u00EAu.\r\n              @if (lastLoadedAt(); as refreshedAt) { \u00B7 C\u1EADp nh\u1EADt {{formatTimestamp(refreshedAt)}} }\r\n            </span>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"cl-print-document cl-print-only\"\r\n             [class.cl-print-mode-compact]=\"printPlan().mode === 'compact'\"\r\n             [class.cl-print-mode-list]=\"printPlan().mode === 'list'\">\r\n          <div class=\"cl-print-list-layout\">\r\n            <header class=\"cl-print-header\">\r\n              <h2>B\u1EA2NG THEO D\u00D5I M\u1EAAU NG\u00C0Y</h2>\r\n              <div>Ng\u00E0y ki\u1EC3m nghi\u1EC7m: <strong>{{selectedDateLabel()}}</strong></div>\r\n            </header>\r\n\r\n            <table class=\"cl-print-table\">\r\n              <colgroup><col class=\"cl-col-batch\"><col class=\"cl-col-samples\"><col class=\"cl-col-targets\"></colgroup>\r\n              <thead>\r\n                <tr><th>M\u1EBB / SOP</th><th>M\u1EABu th\u1EF1c hi\u1EC7n</th><th>Ch\u1EC9 ti\u00EAu ki\u1EC3m</th></tr>\r\n              </thead>\r\n              <tbody>\r\n                @for (batch of boardBatches(); track batch.cardKey) {\r\n                  @for (group of batch.groups; track group.signature; let groupIndex = $index) {\r\n                    <tr class=\"cl-print-assignment-row\" [class.cl-print-batch-start]=\"groupIndex === 0\">\r\n                      <td>\r\n                        <div class=\"cl-print-batch-cell\">\r\n                          <div class=\"cl-print-batch-info\">\r\n                            <div class=\"cl-print-sop\">{{batch.sopName}}</div>\r\n                            <div class=\"cl-print-meta\">{{batch.uniqueSamples}} m\u1EABu th\u1EF1c hi\u1EC7n</div>\r\n                          </div>\r\n                        </div>\r\n                      </td>\r\n                      <td>\r\n                        <div class=\"cl-print-samples\">\r\n                          @if (group.hasMultipleDescriptions) {\r\n                            {{group.formattedDescriptions}}\r\n                          } @else {\r\n                            {{(printGroupSamples() ? group.formattedSamples : joinWithCommas(group.sampleIds)) || 'Ch\u01B0a x\u00E1c \u0111\u1ECBnh m\u00E3 m\u1EABu'}}\r\n                          }\r\n                        </div>\r\n                        @if (group.formattedDescriptions && !group.hasMultipleDescriptions) { <div class=\"cl-print-meta\"><strong>M\u00F4 t\u1EA3:</strong> {{group.formattedDescriptions}}</div> }\r\n                        @if (group.hasDescriptionConflict) { <div class=\"cl-print-missing\">C\u1EA3nh b\u00E1o: m\u00F4 t\u1EA3 m\u1EABu kh\u00F4ng th\u1ED1ng nh\u1EA5t gi\u1EEFa c\u00E1c m\u1EBB</div> }\r\n                      </td>\r\n                      <td>\r\n                        @if (group.targetNames.length === 0) {\r\n                          <div class=\"cl-print-missing\">Ch\u01B0a x\u00E1c \u0111\u1ECBnh ch\u1EC9 ti\u00EAu</div>\r\n                        } @else if (group.targetScope.compact) {\r\n                          <div class=\"cl-print-scope\">\r\n                            <strong>{{group.targetScope.headline}}</strong>\r\n                            <span>{{group.targetScope.detailLabel}}</span>\r\n                          </div>\r\n                        } @else {\r\n                          <ul class=\"cl-print-targets\">\r\n                            @for (targetName of group.targetNames; track targetName) { <li>{{targetName}}</li> }\r\n                          </ul>\r\n                        }\r\n                      </td>\r\n                    </tr>\r\n                  }\r\n                }\r\n              </tbody>\r\n            </table>\r\n          </div>\r\n\r\n          <div class=\"cl-print-compact-layout\">\r\n            @for (page of compactPrintPages(); track $index; let pageIndex = $index) {\r\n              <section class=\"cl-print-compact-page\"\r\n                       [class.cl-print-compact-page-last]=\"pageIndex === compactPrintPages().length - 1\">\r\n                <header class=\"cl-print-header\">\r\n                  <h2>B\u1EA2NG THEO D\u00D5I M\u1EAAU NG\u00C0Y</h2>\r\n                  <div>Ng\u00E0y ki\u1EC3m nghi\u1EC7m: <strong>{{selectedDateLabel()}}</strong></div>\r\n                </header>\r\n\r\n                <div class=\"cl-print-compact-columns\">\r\n                  @for (column of page; track $index) {\r\n                    <div class=\"cl-print-compact-column\">\r\n                      @for (batch of column; track batch.cardKey) {\r\n                        <section class=\"cl-print-compact-card\">\r\n                          <header class=\"cl-print-compact-head\">\r\n                             <span class=\"cl-print-compact-index\">{{boardBatches().indexOf(batch) + 1}}</span>\r\n                             <div class=\"cl-print-compact-title\">\r\n                               <div>{{batch.sopName}}</div>\r\n                               <small>{{batch.uniqueSamples}} m\u1EABu th\u1EF1c hi\u1EC7n</small>\r\n                             </div>\r\n                           </header>\r\n\r\n                          @for (group of batch.groups; track group.signature; let groupIndex = $index) {\r\n                            <div class=\"cl-print-compact-group\">\r\n                              @if (batch.groups.length > 1) {\r\n                                <div class=\"cl-print-compact-label\">Nh\u00F3m {{groupIndex + 1}}</div>\r\n                              }\r\n                              <div class=\"cl-print-compact-samples\">\r\n                                @if (group.hasMultipleDescriptions) {\r\n                                  {{group.formattedDescriptions}}\r\n                                } @else {\r\n                                  {{(printGroupSamples() ? group.formattedSamples : joinWithCommas(group.sampleIds)) || 'Ch\u01B0a x\u00E1c \u0111\u1ECBnh m\u00E3 m\u1EABu'}}\r\n                                }\r\n                              </div>\r\n                              @if (group.formattedDescriptions && !group.hasMultipleDescriptions) { <div class=\"cl-print-compact-label\">M\u00F4 t\u1EA3: {{group.formattedDescriptions}}</div> }\r\n                              @if (group.hasDescriptionConflict) { <div class=\"cl-print-missing\">M\u00F4 t\u1EA3 m\u1EABu kh\u00F4ng th\u1ED1ng nh\u1EA5t</div> }\r\n                              @if (group.targetNames.length === 0) {\r\n                                <div class=\"cl-print-missing\">Ch\u01B0a x\u00E1c \u0111\u1ECBnh ch\u1EC9 ti\u00EAu</div>\r\n                              } @else if (group.targetScope.compact) {\r\n                                <div class=\"cl-print-scope\">\r\n                                  <strong>{{group.targetScope.headline}}</strong>\r\n                                </div>\r\n                              } @else {\r\n                                <ul class=\"cl-print-compact-targets\">\r\n                                  @for (targetName of group.targetNames; track targetName) { <li>{{targetName}}</li> }\r\n                                </ul>\r\n                              }\r\n                            </div>\r\n                          }\r\n                        </section>\r\n                      }\r\n                    </div>\r\n                  }\r\n                </div>\r\n              </section>\r\n            }\r\n          </div>\r\n        </div>\r\n      </article>\r\n    }\r\n  </main>\r\n</div>\r\n\r\n<!-- ===== PRINT OPTIONS SETTINGS MODAL ===== -->\r\n@if (showPrintSettings()) {\r\n  <div data-testid=\"daily-print-settings\" class=\"fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in\">\r\n    <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-md w-full overflow-hidden cl-board-enter text-slate-800 dark:text-slate-200\">\r\n      \r\n      <!-- Modal Header -->\r\n      <div class=\"px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center\">\r\n        <div class=\"flex items-center gap-2\">\r\n          <i class=\"fa-solid fa-sliders text-blue-600 text-sm\"></i>\r\n          <h3 class=\"text-sm font-black uppercase tracking-wider\">C\u1EA5u H\u00ECnh B\u1EA3n In</h3>\r\n        </div>\r\n        <button (click)=\"showPrintSettings.set(false)\" class=\"text-slate-400 hover:text-slate-600 transition\">\r\n          <i class=\"fa-solid fa-xmark\"></i>\r\n        </button>\r\n      </div>\r\n\r\n      <!-- Modal Body (Print Settings Forms) -->\r\n      <div class=\"p-5 space-y-4 text-xs font-bold text-slate-650 dark:text-slate-350\">\r\n\r\n        <div class=\"space-y-2\">\r\n          <span class=\"text-[10px] uppercase font-black tracking-wider text-slate-400 block\">Ch\u1EBF \u0111\u1ED9 in</span>\r\n          <div class=\"grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800\">\r\n            @for (opt of printModeOptions; track opt.v) {\r\n              <button type=\"button\" (click)=\"printMode.set(opt.v)\"\r\n                      [attr.aria-pressed]=\"printMode() === opt.v\"\r\n                      class=\"py-2 rounded-lg text-[10px] font-extrabold transition active:scale-95 flex items-center justify-center gap-1.5\"\r\n                      [ngClass]=\"printMode() === opt.v\r\n                        ? 'bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-xs'\r\n                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'\">\r\n                <i class=\"fa-solid\" [ngClass]=\"opt.icon\" aria-hidden=\"true\"></i>\r\n                <span>{{opt.l}}</span>\r\n              </button>\r\n            }\r\n          </div>\r\n          <p class=\"text-[10px] font-medium text-slate-400\">\r\n            T\u1EF1 \u0111\u1ED9ng so s\u00E1nh l\u01B0\u1EDBi mini-card v\u00E0 b\u1EA3ng danh s\u00E1ch \u0111\u1EC3 h\u1EA1n ch\u1EBF s\u1ED1 trang, xu\u1ED1ng d\u00F2ng v\u00E0 chia m\u1EBB.\r\n          </p>\r\n        </div>\r\n        \r\n        <!-- Adaptive orientation -->\r\n        <div class=\"space-y-2\">\r\n          <span class=\"text-[10px] uppercase font-black tracking-wider text-slate-400 block\">B\u1ED1 c\u1EE5c gi\u1EA5y</span>\r\n          <div class=\"grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800\">\r\n            @for (opt of printOrientationOptions; track opt.v) {\r\n              <button type=\"button\" (click)=\"printOrientation.set(opt.v)\"\r\n                      [class.bg-white]=\"printOrientation() === opt.v\" [class.dark:bg-slate-800]=\"printOrientation() === opt.v\" [class.shadow-xs]=\"printOrientation() === opt.v\" [class.text-blue-650] = \"printOrientation() === opt.v\" [class.dark:text-blue-400]=\"printOrientation() === opt.v\"\r\n                      [class.text-slate-500]=\"printOrientation() !== opt.v\" [class.dark:text-slate-400]=\"printOrientation() !== opt.v\"\r\n                      class=\"py-1.5 rounded-lg text-[10px] font-extrabold hover:text-slate-800 dark:hover:text-white transition active:scale-95 text-center\">\r\n                {{opt.l}}\r\n              </button>\r\n            }\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 p-3\">\r\n          <div class=\"flex items-center justify-between gap-3\">\r\n            <span class=\"text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400\">Ph\u01B0\u01A1ng \u00E1n hi\u1EC7n t\u1EA1i</span>\r\n            <span class=\"text-xs font-black text-blue-800 dark:text-blue-300\">\r\n              {{printPlan().mode === 'compact' ? 'L\u01B0\u1EDBi g\u1ECDn' : 'Danh s\u00E1ch'}} \u00B7 A4 {{printPlan().orientation === 'portrait' ? 'd\u1ECDc' : 'ngang'}} \u00B7 kho\u1EA3ng {{printPlan().estimatedPages}} trang\r\n            </span>\r\n          </div>\r\n          <p class=\"mt-1 text-[10px] font-medium text-blue-700/80 dark:text-blue-300/80\">{{printPlan().reason}}</p>\r\n        </div>\r\n\r\n        <div class=\"space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800\">\r\n          <label class=\"flex items-center gap-2.5 cursor-pointer select-none\">\r\n            <input type=\"checkbox\" [ngModel]=\"printGroupSamples()\" (ngModelChange)=\"printGroupSamples.set($event)\"\r\n                   class=\"w-4 h-4 text-blue-600 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded focus:ring-blue-500/30\">\r\n            <span>Gom d\u1EA3i m\u1EABu li\u00EAn t\u1EE5c (L0115 \u2192 L5015)</span>\r\n          </label>\r\n        </div>\r\n\r\n      </div>\r\n\r\n      <!-- Modal Footer -->\r\n      <div class=\"px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-750 flex justify-end gap-2 shrink-0\">\r\n        <button type=\"button\" (click)=\"showPrintSettings.set(false)\"\r\n                class=\"px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-750 transition active:scale-95 font-bold\">\r\n          H\u1EE7y B\u1ECF\r\n        </button>\r\n        <button type=\"button\" (click)=\"executePrint()\"\r\n                class=\"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5 font-bold\">\r\n          <i class=\"fa-solid fa-print\"></i>\r\n          X\u00E1c Nh\u1EADn In\r\n        </button>\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n}\r\n", styles: ["\n    :host {\n      display: flex;\n      flex-direction: column;\n      height: 100%;\n      min-height: 0;\n    }\n\n    /* ============================================================ */\n    /* SCREEN STYLES                                                */\n    /* ============================================================ */\n\n    @keyframes cl-enter-anim {\n      from { opacity: 0; transform: translateY(8px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n    .cl-board-enter { animation: cl-enter-anim 0.28s ease-out both; }\n\n    /* Document article wrapper \u2013 kh\u00F4ng border/shadow tr\u00EAn m\u00E0n h\u00ECnh */\n    .cl-board-root {\n      width: 100%;\n      max-width: none;\n      margin-inline: auto;\n    }\n\n    .cl-batch-grid-shell { container: batch-grid-shell / inline-size; }\n    .cl-batch-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));\n      gap: 12px;\n      align-items: start;\n      grid-auto-flow: row;\n    }\n    .cl-batch-card {\n      min-width: 0;\n      container-type: inline-size;\n    }\n    .cl-batch-card.cl-card-standard { grid-column: span 2; }\n    .cl-batch-card.cl-card-wide { grid-column: 1 / -1; }\n    .cl-batch-grid[data-view-mode='compact'] .cl-batch-card { grid-column: span 1; }\n    .cl-batch-grid[data-view-mode='list'] .cl-batch-card { grid-column: 1 / -1; }\n\n    .cl-assignment-row { grid-template-columns: minmax(0, 1fr); }\n    .cl-assignment-samples { min-width: 0; }\n    .cl-assignment-targets { border-top: 1px solid rgb(241 245 249); padding-top: 12px; }\n    .dark .cl-assignment-targets { border-color: rgb(51 65 85 / 0.7); }\n    .cl-card-header { padding-block: 10px; }\n    .cl-card-body-row { padding: 12px; gap: 10px; }\n    .cl-card-footer { padding: 8px 16px; }\n\n    @container (min-width: 520px) {\n      .cl-card-header { flex-direction: row; align-items: flex-start; }\n      .cl-card-body-row { padding: 14px 16px; gap: 12px; }\n      .cl-assignment-row {\n        grid-template-columns: minmax(140px, max-content) minmax(0, 1fr);\n        max-width: 100%;\n      }\n      .cl-assignment-samples { max-width: min(45cqi, 340px); }\n      .cl-assignment-targets {\n        border-top: 0;\n        border-left: 1px solid rgb(241 245 249);\n        padding-top: 0;\n        padding-left: 16px;\n      }\n      .dark .cl-assignment-targets { border-color: rgb(51 65 85 / 0.7); }\n    }\n\n    @container (max-width: 459px) {\n      .cl-copy-label { display: none; }\n      .cl-card-header { padding-inline: 12px; }\n    }\n\n    @container batch-grid-shell (max-width: 759px) {\n      .cl-batch-card.cl-card-standard { grid-column: 1 / -1; }\n    }\n\n    /* Target chips grid layout */\n    .cl-target-grid {\n      display: grid;\n      grid-template-columns: minmax(0, 1fr);\n    }\n    @media (min-width: 640px) {\n      .cl-target-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n    }\n    @media (min-width: 1024px) {\n      .cl-target-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n    }\n\n    /* Work group \u2013 tr\u00E1nh ng\u1EAFt trang */\n    .cl-work-group { break-inside: avoid; page-break-inside: avoid; }\n\n    /* SOP heading \u2013 text wrap */\n    .cl-sop-heading h3 { overflow-wrap: anywhere; }\n\n    /* Print-only elements: \u1EA9n ho\u00E0n to\u00E0n tr\u00EAn m\u00E0n h\u00ECnh */\n    .cl-print-only { display: none !important; }\n\n    .cl-sample-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));\n      gap: 6px;\n    }\n\n    @media (prefers-reduced-motion: reduce) {\n      .cl-board-enter { animation: none; }\n    }\n\n    /* ============================================================ */\n    /* PRINT STYLES                                                 */\n    /* ============================================================ */\n    @media print {\n      @page { size: A4 portrait; margin: 6mm; }\n\n      /* V\u00F4 hi\u1EC7u h\u00F3a kh\u00F3a c\u1EE9ng k\u00EDch th\u01B0\u1EDBc d\u1ECDc c\u1EE7a index.html */\n      body.daily-checklist-printing,\n      body.daily-checklist-printing html {\n        width: auto !important;\n        height: auto !important;\n        background: white !important;\n        overflow: visible !important;\n      }\n\n      /* \u1EA8n \u1EE9ng d\u1EE5ng g\u1ED1c khi in, ch\u1EC9 hi\u1EC7n print-container */\n      body.daily-checklist-printing app-root { display: none !important; }\n      \n      body.daily-checklist-printing #print-container {\n        display: block !important;\n        position: relative !important;\n        width: 100% !important;\n        height: auto !important;\n        overflow: visible !important;\n        z-index: auto !important;\n        background: white !important;\n      }\n\n      body.daily-checklist-printing #print-container * {\n        visibility: visible !important;\n      }\n\n      /* \u1EA8n c\u00E1c n\u00FAt b\u1EA5m, b\u1ED9 l\u1ECDc khi in */\n      body.daily-checklist-printing #print-container .cl-screen-only { display: none !important; }\n      body.daily-checklist-printing #print-container .cl-print-only { display: flex !important; }\n\n      /* Reset Page Shell v\u00E0 container cu\u1ED9n c\u1EE7a b\u1EA3n in (QUAN TR\u1ECCNG: S\u1EEDa l\u1ED7i 2 trang in \u0111\u1EA7u b\u1ECB tr\u1EAFng) */\n      body.daily-checklist-printing #print-container .cl-page-shell,\n      body.daily-checklist-printing #print-container .cl-board-scroll {\n        display: block !important;\n        width: 100% !important;\n        height: auto !important;\n        overflow: visible !important;\n        padding: 0 !important;\n        margin: 0 !important;\n      }\n\n      /* Thi\u1EBFt l\u1EADp Header t\u00E0i li\u1EC7u thu nh\u1ECF g\u1ECDn g\u00E0ng \u0111\u1EC3 ti\u1EBFt ki\u1EC7m gi\u1EA5y */\n      body.daily-checklist-printing #print-container .cl-doc-header {\n        background: white !important;\n        border-bottom: 1px solid #cbd5e1 !important;\n        margin-bottom: 6px !important;\n        display: block !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-doc-header > div {\n        padding: 4px 6px !important;\n        gap: 6px !important;\n        display: flex !important;\n        justify-content: space-between !important;\n        align-items: center !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-doc-header h2 {\n        font-size: 11px !important;\n        font-weight: 800 !important;\n        margin: 0 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-doc-header span {\n        margin: 0 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-stats-grid {\n        display: flex !important;\n        gap: 4px !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-stats-grid > div {\n        padding: 1.5px 4px !important;\n        border-radius: 4px !important;\n        border: 1px solid #cbd5e1 !important;\n        background: #f8fafc !important;\n        display: flex !important;\n        align-items: center !important;\n        gap: 2.5px !important;\n        font-size: 8px !important;\n        font-weight: 700 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-stats-grid > div span {\n        font-size: 8px !important;\n      }\n\n      /* Kh\u1ED1i bao ngo\u00E0i c\u1EE7a b\u1EA3n in */\n      body.daily-checklist-printing #print-container .cl-board-root {\n        width: 100% !important;\n        max-width: none !important;\n        border: 1px solid #cbd5e1 !important;\n        border-radius: 10px !important;\n        overflow: hidden !important;\n        display: block !important;\n        background: white !important;\n      }\n\n      /* Thi\u1EBFt l\u1EADp block d\u1ECDc 100% cho container body in \u1EA5n */\n      body.daily-checklist-printing #print-container .cl-board-body {\n        display: block !important;\n        width: 100% !important;\n        padding: 6px 8px !important;\n      }\n\n      /* C\u1EA4U H\u00CCNH S\u1ED0 C\u1ED8T KANBAN MASONRY THEO H\u01AF\u1EDANG GI\u1EA4Y */\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-board-root.print-layout-auto .cl-board-body {\n        column-count: 2 !important;\n        column-gap: 10px !important;\n      }\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-board-root.print-layout-auto .cl-board-body {\n        column-count: 3 !important;\n        column-gap: 12px !important;\n      }\n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-auto .cl-board-body {\n        column-count: 2 !important;\n        column-gap: 10px !important;\n      }\n      \n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-1 .cl-board-body {\n        column-count: 1 !important;\n      }\n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-2 .cl-board-body {\n        column-count: 2 !important;\n        column-gap: 10px !important;\n      }\n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-3 .cl-board-body {\n        column-count: 3 !important;\n        column-gap: 12px !important;\n      }\n      body.daily-checklist-printing #print-container .cl-board-root.print-layout-4 .cl-board-body {\n        column-count: 4 !important;\n        column-gap: 8px !important;\n      }\n\n      /* SOP Card d\u1EA1ng block si\u00EAu n\u00E9n, \u00F4m kh\u00EDt n\u1ED9i dung */\n      body.daily-checklist-printing #print-container .cl-sop-section {\n        display: block !important;\n        width: 100% !important;\n        margin-bottom: 6px !important;\n        break-inside: avoid !important;\n        -webkit-column-break-inside: avoid !important;\n        page-break-inside: avoid !important;\n        border: 1px solid #cbd5e1 !important;\n        border-radius: 6px !important;\n        background-color: #ffffff !important;\n        box-shadow: none !important;\n      }\n\n      /* T\u1ED1i \u01B0u h\u00F3a container ch\u1EE9a c\u00E1c nh\u00F3m ch\u1EC9 ti\u00EAu khi in (B\u1ECF padding, margin d\u01B0 th\u1EEBa) */\n      body.daily-checklist-printing #print-container .cl-sop-section > div.overflow-y-auto {\n        padding: 0 !important;\n        margin: 0 !important;\n        display: block !important;\n      }\n\n      /* Th\u00EAm g\u1EA1ch \u0111\u1EE9t ng\u0103n c\u00E1ch nh\u1EB9 gi\u1EEFa c\u00E1c nh\u00F3m ch\u1EC9 ti\u00EAu thay v\u00EC kho\u1EA3ng tr\u1ED1ng l\u1EDBn */\n      body.daily-checklist-printing #print-container .cl-sop-section > div.overflow-y-auto > * + * {\n        margin-top: 0 !important;\n        border-top: 1px dashed #e2e8f0 !important;\n      }\n\n      /* SOP Header tr\u00EAn trang in */\n      body.daily-checklist-printing #print-container .cl-sop-heading {\n        display: block !important;\n        width: 100% !important;\n        padding: 5px 8px !important;\n        background-color: #f8fafc !important;\n        border-bottom: 1px solid #cbd5e1 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-sop-heading > div {\n        display: flex !important;\n        align-items: center !important;\n        gap: 6px !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-sop-heading h3 {\n        font-weight: 800 !important;\n        color: #0f172a !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-sop-heading span {\n        font-weight: 700 !important;\n        color: #475569 !important;\n      }\n\n      /* Nh\u00F3m m\u1EABu v\u00E0 ch\u1EC9 ti\u00EAu */\n      body.daily-checklist-printing #print-container .cl-work-group {\n        display: block !important;\n        width: 100% !important;\n        padding: 5px 8px !important;\n        margin: 0 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-work-group div.font-mono {\n        line-height: 1.25 !important;\n        color: #1e293b !important;\n        margin-bottom: 3px !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-work-group div.font-mono span.font-sans {\n        color: #64748b !important;\n      }\n\n      /* Th\u1EBB badge ch\u1EC9 ti\u00EAu tr\u00EAn trang in */\n      body.daily-checklist-printing #print-container .cl-work-group .flex-wrap {\n        display: block !important;\n        width: 100% !important;\n        margin-top: 3px !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-work-group .flex-wrap span {\n        display: inline-block !important;\n        background-color: #f1f5f9 !important;\n        border: 1px solid #cbd5e1 !important;\n        color: #0f172a !important;\n        padding: 0.5px 3.5px !important;\n        margin: 1px 2px 1px 0 !important;\n        border-radius: 3px !important;\n        font-weight: 700 !important;\n      }\n\n      /* C\u1EA4U H\u00CCNH C\u1EE0 CH\u1EEE IN */\n      /* XS - Si\u00EAu nh\u1ECF (Khuy\u00EAn d\u00F9ng khi c\u00F3 nhi\u1EC1u SOP \u0111\u1EC3 v\u1EEBa 1 trang) */\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-sop-heading h3 { font-size: 8px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-sop-heading span { font-size: 7px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-work-group { font-size: 7px !important; padding: 2px 4px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-work-group .flex-wrap span { font-size: 6px !important; padding: 0px 1.5px !important; margin: 0.5px 1px 0.5px 0 !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-sop-section { margin-bottom: 4px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header { margin-bottom: 4px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header > div { padding: 3px 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header h2 { font-size: 9.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header span { font-size: 8px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-print-stats-grid > div { padding: 1px 3px !important; gap: 2px !important; font-size: 7px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-print-stats-grid > div span { font-size: 7px !important; }\n\n      /* Small - Nh\u1ECF */\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-sop-heading h3 { font-size: 9.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-work-group { font-size: 8px !important; padding: 3px 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-work-group .flex-wrap span { font-size: 7px !important; padding: 0.5px 2px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-sop-section { margin-bottom: 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header { margin-bottom: 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header > div { padding: 3.5px 5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header h2 { font-size: 10.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header span { font-size: 8.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-print-stats-grid > div { padding: 1px 3.5px !important; gap: 2px !important; font-size: 7.5px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-print-stats-grid > div span { font-size: 7.5px !important; }\n\n      /* Medium - V\u1EEBa */\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-sop-heading h3 { font-size: 12px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-work-group { font-size: 10px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-work-group .flex-wrap span { font-size: 8.5px !important; }\n\n      /* Large - L\u1EDBn */\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-sop-heading h3 { font-size: 14px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-work-group { font-size: 11px !important; }\n      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-work-group .flex-wrap span { font-size: 10px !important; }\n\n      /* C\u1EA4U H\u00CCNH \u1EA8N B\u1EA2NG TH\u1ED0NG K\u00CA */\n      body.daily-checklist-printing #print-container .cl-board-root.print-stats-hide .cl-doc-header .cl-print-stats-grid {\n        display: none !important;\n      }\n\n      /* Document footer (print-only) */\n      body.daily-checklist-printing #print-container .cl-doc-footer {\n        padding: 2px 4px !important;\n        font-size: 7px !important;\n        margin-top: 4px !important;\n        color: #64748b !important;\n        display: flex !important;\n      }\n\n      /* Adaptive batch table: print renderer \u0111\u1ED9c l\u1EADp v\u1EDBi card m\u00E0n h\u00ECnh */\n      body.daily-checklist-printing #print-container .cl-adaptive-root {\n        display: block !important;\n        width: 100% !important;\n        margin: 0 !important;\n        padding: 0 !important;\n        color: #0f172a !important;\n        background: #ffffff !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-document {\n        display: block !important;\n        width: 100% !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-header {\n        display: flex !important;\n        align-items: baseline !important;\n        justify-content: space-between !important;\n        gap: 8px !important;\n        padding: 0 0 4mm !important;\n        border-bottom: 1.5px solid #334155 !important;\n        margin-bottom: 3mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-header h2 {\n        margin: 0 !important;\n        font-size: 12pt !important;\n        line-height: 1.2 !important;\n        font-weight: 800 !important;\n        letter-spacing: 0.02em !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-header div {\n        font-size: 9pt !important;\n        white-space: nowrap !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-list-layout,\n      body.daily-checklist-printing #print-container .cl-print-compact-layout {\n        display: none !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-mode-list .cl-print-list-layout {\n        display: block !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-mode-compact .cl-print-compact-layout {\n        display: block !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-page {\n        display: block !important;\n        position: relative !important;\n        box-sizing: border-box !important;\n        break-inside: avoid-page !important;\n        page-break-inside: avoid !important;\n        break-after: page !important;\n        page-break-after: always !important;\n      }\n\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-print-compact-page {\n        height: 265mm !important;\n      }\n\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-print-compact-page {\n        height: 178mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-page-last {\n        break-after: auto !important;\n        page-break-after: auto !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-columns {\n        display: grid !important;\n        align-items: start !important;\n        gap: 4mm !important;\n        box-sizing: border-box !important;\n      }\n\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-print-compact-columns {\n        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;\n      }\n\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-print-compact-columns {\n        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-column {\n        display: block !important;\n        min-width: 0 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-card {\n        display: block !important;\n        width: 100% !important;\n        margin: 0 0 4mm !important;\n        border: 1px solid #94a3b8 !important;\n        border-radius: 2.5mm !important;\n        overflow: hidden !important;\n        break-inside: avoid !important;\n        page-break-inside: avoid !important;\n        background: white !important;\n        font-size: 8pt !important;\n        line-height: 1.3 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-head {\n        display: flex !important;\n        align-items: flex-start !important;\n        gap: 2mm !important;\n        padding: 2.2mm !important;\n        border-bottom: 1px solid #cbd5e1 !important;\n        background: #f8fafc !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-index {\n        display: flex !important;\n        align-items: center !important;\n        justify-content: center !important;\n        width: 5mm !important;\n        height: 5mm !important;\n        flex: 0 0 5mm !important;\n        border-radius: 50% !important;\n        color: white !important;\n        background: #2563eb !important;\n        font-size: 7pt !important;\n        font-weight: 800 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-title {\n        min-width: 0 !important;\n        flex: 1 1 auto !important;\n        font-size: 8.5pt !important;\n        font-weight: 800 !important;\n        overflow-wrap: anywhere !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-title small {\n        display: block !important;\n        margin-top: 0.7mm !important;\n        color: #64748b !important;\n        font-size: 6.5pt !important;\n        font-weight: 600 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-group {\n        padding: 2.2mm !important;\n        break-inside: avoid !important;\n        page-break-inside: avoid !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-group + .cl-print-compact-group {\n        border-top: 1px dashed #cbd5e1 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-label {\n        margin-bottom: 0.7mm !important;\n        color: #64748b !important;\n        font-size: 6.7pt !important;\n        font-weight: 800 !important;\n        text-transform: uppercase !important;\n        letter-spacing: 0.03em !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-samples {\n        margin-bottom: 1.5mm !important;\n        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;\n        font-size: 8.5pt !important;\n        font-weight: 800 !important;\n        overflow-wrap: anywhere !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-targets {\n        margin: 0 !important;\n        padding: 0 !important;\n        list-style: none !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-targets li {\n        display: inline !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-compact-targets li:not(:last-child)::after {\n        content: '; ' !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-table {\n        display: table !important;\n        width: 100% !important;\n        table-layout: fixed !important;\n        border-collapse: collapse !important;\n        border: 1px solid #64748b !important;\n        font-size: 9pt !important;\n        line-height: 1.3 !important;\n      }\n\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-col-batch { width: 24% !important; }\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-col-samples { width: 38% !important; }\n      body.daily-checklist-printing.print-portrait-mode #print-container .cl-col-targets { width: 38% !important; }\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-col-batch { width: 22% !important; }\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-col-samples { width: 40% !important; }\n      body.daily-checklist-printing.print-landscape-mode #print-container .cl-col-targets { width: 38% !important; }\n\n      body.daily-checklist-printing #print-container .cl-print-table thead {\n        display: table-header-group !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-table th {\n        padding: 2.2mm 2.5mm !important;\n        border: 1px solid #64748b !important;\n        background: #e2e8f0 !important;\n        color: #0f172a !important;\n        text-align: left !important;\n        text-transform: uppercase !important;\n        letter-spacing: 0.04em !important;\n        font-size: 8pt !important;\n        font-weight: 800 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-table td {\n        padding: 2.5mm !important;\n        border: 1px solid #94a3b8 !important;\n        vertical-align: top !important;\n        overflow-wrap: anywhere !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-assignment-row {\n        break-inside: avoid !important;\n        page-break-inside: avoid !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-batch-start td {\n        border-top-width: 1.5px !important;\n        border-top-color: #334155 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-batch-cell {\n        display: flex !important;\n        align-items: flex-start !important;\n        gap: 2.5mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-batch-info {\n        min-width: 0 !important;\n        flex: 1 1 auto !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-sop {\n        font-weight: 700 !important;\n        color: #334155 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-meta,\n      body.daily-checklist-printing #print-container .cl-print-count {\n        display: flex !important;\n        flex-wrap: wrap !important;\n        gap: 1.5mm !important;\n        margin-top: 1mm !important;\n        color: #64748b !important;\n        font-size: 7.5pt !important;\n        font-weight: 600 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-samples + .cl-print-meta {\n        color: #86198f !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-samples {\n        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;\n        font-size: 9pt !important;\n        font-weight: 800 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-targets {\n        margin: 0 !important;\n        padding-left: 4mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-targets li {\n        margin: 0 0 0.7mm !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-missing {\n        font-style: italic !important;\n        color: #92400e !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-scope {\n        display: flex !important;\n        flex-direction: column !important;\n        gap: 0.8mm !important;\n        color: #172554 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-scope strong {\n        font-size: 8.5pt !important;\n        line-height: 1.2 !important;\n      }\n\n      body.daily-checklist-printing #print-container .cl-print-scope span {\n        color: #64748b !important;\n        font-size: 7.5pt !important;\n        font-weight: 700 !important;\n      }\n\n    }\n  "] }]
    }], () => [], { embedded: [{
            type: Input
        }], batchGrid: [{
            type: ViewChild,
            args: ['batchGrid']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DailyChecklistComponent, { className: "DailyChecklistComponent", filePath: "src/app/features/checklist/daily-checklist.component.ts", lineNumber: 735 }); })();
function normalizeSearch(value) {
    return value
        .trim()
        .toLocaleLowerCase('vi')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd');
}
//# sourceMappingURL=daily-checklist.component.js.map