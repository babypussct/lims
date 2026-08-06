import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressService } from '../../../core/services/progress.service';
import { PubchemService } from '../../../core/services/pubchem.service';
import { ToastService } from '../../../core/services/toast.service';
import { normalizeChemicalNames, parseChemicalNames, serializeChemicalNames, } from '../../../shared/utils/chemical-name';
import { assessCasNumber, assessCleanupGroup, detectStandardForm, formatStandardProductName, suggestCasCorrection, } from '../../../shared/utils/standard-cleanup';
import { StandardService } from '../standard.service';
import { timestampToDate } from '../../../shared/utils/timestamp';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.standardId;
const _forTrack2 = ($index, $item) => $item.standard.id;
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 39);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_20_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setWorkspace("placeholder")); });
    i0.ɵɵelement(1, "i", 40);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.placeholderCasCount(), " nh\u00E3n CAS gi\u1EEF ch\u1ED7");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 41);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_21_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setWorkspace("date_corrupted")); });
    i0.ɵɵelement(1, "i", 42);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.dateCorruptedCasCount(), " CAS d\u1EA1ng ng\u00E0y");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 43);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_22_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setWorkspace("invalid")); });
    i0.ɵɵelement(1, "i", 44);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.invalidCasCount(), " CAS l\u1ED7i kh\u00E1c");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 19);
    i0.ɵɵelement(1, "i", 45);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.missingCasCount(), " ch\u01B0a c\u00F3 CAS");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 46);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_29_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setSearchQuery("")); });
    i0.ɵɵelement(1, "i", 47);
    i0.ɵɵelementEnd();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 31)(1, "button", 32);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_46_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setFilter("all")); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 32);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_46_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setFilter("safe")); });
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 32);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_46_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setFilter("review")); });
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 32);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_46_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setFilter("blocked")); });
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 32);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_46_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setFilter("success")); });
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.filterClass("all"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("T\u1EA5t c\u1EA3 (", ctx_r1.groups().length, ")");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.filterClass("safe"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("An to\u00E0n (", ctx_r1.safeCount(), ")");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.filterClass("review"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("C\u1EA7n duy\u1EC7t (", ctx_r1.mediumRiskCount(), ")");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.filterClass("blocked"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("R\u1EE7i ro cao (", ctx_r1.highRiskCount(), ")");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.filterClass("success"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("\u0110\u00E3 l\u01B0u (", ctx_r1.successCount(), ")");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35);
    i0.ɵɵelement(1, "i", 56);
    i0.ɵɵelementStart(2, "p", 57);
    i0.ɵɵtext(3, "\u0110ang t\u1EA3i l\u1ECBch s\u1EED...");
    i0.ɵɵelementEnd()();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35);
    i0.ɵɵelement(1, "i", 58);
    i0.ɵɵelementStart(2, "p", 59);
    i0.ɵɵtext(3, "Ch\u01B0a c\u00F3 phi\u00EAn chu\u1EA9n h\u00F3a n\u00E0o.");
    i0.ɵɵelementEnd()();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 72);
    i0.ɵɵtext(1, "\u0110ang ho\u00E0n t\u00E1c ");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 73);
    i0.ɵɵtext(1, "Ho\u00E0n t\u00E1c phi\u00EAn ");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_For_20_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 76);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const change_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("CAS ", change_r11.before.cas_number || "Tr\u1ED1ng", "");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_For_20_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 76);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const change_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("CAS ", change_r11.after.cas_number || "Tr\u1ED1ng", "");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_For_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 71)(1, "strong", 74);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 75);
    i0.ɵɵtext(4);
    i0.ɵɵtemplate(5, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_For_20_Conditional_5_Template, 2, 1, "small", 76);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "i", 77);
    i0.ɵɵelementStart(7, "span", 78);
    i0.ɵɵtext(8);
    i0.ɵɵtemplate(9, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_For_20_Conditional_9_Template, 2, 1, "small", 76);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const change_r11 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(change_r11.internalId || change_r11.standardId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", change_r11.before.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(change_r11.before.cas_number !== change_r11.after.cas_number ? 5 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", change_r11.after.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(change_r11.before.cas_number !== change_r11.after.cas_number ? 9 : -1);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 60)(1, "div", 61)(2, "div", 6)(3, "div", 62)(4, "span", 63);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 64);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "p", 65);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 66);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "button", 67);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_Template_button_click_12_listener() { const batch_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.undoBatch(batch_r10)); });
    i0.ɵɵtemplate(13, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_Conditional_13_Template, 2, 0)(14, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_Conditional_14_Template, 2, 0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "details", 68)(16, "summary", 69);
    i0.ɵɵtext(17, "Xem thay \u0111\u1ED5i tr\u01B0\u1EDBc/sau");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "div", 70);
    i0.ɵɵrepeaterCreate(19, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_For_20_Template, 10, 5, "div", 71, _forTrack1);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const batch_r10 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("CAS ", batch_r10.cas, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", batch_r10.status === "APPLIED" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(batch_r10.status === "APPLIED" ? "C\u00F3 th\u1EC3 ho\u00E0n t\u00E1c" : "\u0110\u00E3 ho\u00E0n t\u00E1c");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate3("", batch_r10.recordCount, " h\u1ED3 s\u01A1 \u00B7 ", batch_r10.createdByName || "Ng\u01B0\u1EDDi d\u00F9ng", " \u00B7 ", ctx_r1.formatBatchDate(batch_r10.createdAt), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Phi\u00EAn ", batch_r10.id, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", batch_r10.status !== "APPLIED" || ctx_r1.undoingBatchId() !== null);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.undoingBatchId() === batch_r10.id ? 13 : 14);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(batch_r10.changes);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 53);
    i0.ɵɵrepeaterCreate(1, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_For_2_Template, 21, 9, "article", 60, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.cleanupHistory());
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 33)(1, "header", 48)(2, "div")(3, "h3", 7);
    i0.ɵɵelement(4, "i", 49);
    i0.ɵɵtext(5, "L\u1ECBch S\u1EED Chu\u1EA9n H\u00F3a & Ho\u00E0n T\u00E1c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 50);
    i0.ɵɵtext(7, "M\u1ED7i l\u1EA7n l\u01B0u l\u00E0 m\u1ED9t phi\u00EAn \u0111\u1ED9c l\u1EADp. Ho\u00E0n t\u00E1c b\u1ECB ch\u1EB7n n\u1EBFu h\u1ED3 s\u01A1 \u0111\u00E3 \u0111\u01B0\u1EE3c s\u1EEDa sau phi\u00EAn \u0111\u00F3.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 51);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.showHistory.set(false)); });
    i0.ɵɵelement(9, "i", 10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 52);
    i0.ɵɵtemplate(11, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_11_Template, 4, 0, "div", 35)(12, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_12_Template, 4, 0, "div", 35)(13, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Conditional_13_Template, 3, 0, "div", 53);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "footer", 54)(15, "button", 55);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.showHistory.set(false)); });
    i0.ɵɵtext(16, "Quay l\u1EA1i chu\u1EA9n h\u00F3a");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("disabled", ctx_r1.undoingBatchId() !== null);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.isLoadingHistory() ? 11 : ctx_r1.cleanupHistory().length === 0 ? 12 : 13);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.undoingBatchId() !== null);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 35);
    i0.ɵɵelement(1, "i", 80);
    i0.ɵɵelementStart(2, "p", 81);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 82);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_0_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.setWorkspace("valid")); });
    i0.ɵɵtext(5, "Quay l\u1EA1i CAS h\u1EE3p l\u1EC7");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Kh\u00F4ng c\u00F2n h\u1ED3 s\u01A1 trong nh\u00F3m ", ctx_r1.workspaceLabel(), ".");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 96);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵnextContext();
    const issue_r14 = i0.ɵɵreadContextLet(0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Catalog ", issue_r14.standard.product_code, "");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 96);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵnextContext();
    const issue_r14 = i0.ɵɵreadContextLet(0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Lot ", issue_r14.standard.lot_number, "");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 107);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 108);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 114);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_49_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r15); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.useNormalizedCas()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵnextContext();
    const assessment_r16 = i0.ɵɵreadContextLet(1);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("D\u00F9ng ", assessment_r16.normalizedCas, "");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_50_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 116);
    i0.ɵɵelement(1, "i", 117);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 118);
    i0.ɵɵtext(4, "H\u00E3y so s\u00E1nh v\u1EDBi t\u00EAn s\u1EA3n ph\u1EA9m tr\u01B0\u1EDBc khi l\u01B0u; k\u1EBFt qu\u1EA3 n\u00E0y kh\u00F4ng t\u1EF1 \u0111\u1ED5i t\u00EAn ch\u1EA5t chu\u1EA9n.");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵnextContext(2);
    const issue_r14 = i0.ɵɵreadContextLet(0);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("PubChem: ", issue_r14.lookupName, "");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_50_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 115);
    i0.ɵɵtext(1, "PubChem kh\u00F4ng t\u00ECm th\u1EA5y CAS n\u00E0y. Ki\u1EC3m tra l\u1EA1i CoA tr\u01B0\u1EDBc khi l\u01B0u.");
    i0.ɵɵelementEnd();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_50_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 115);
    i0.ɵɵtext(1, "Kh\u00F4ng th\u1EC3 k\u1EBFt n\u1ED1i PubChem. CAS v\u1EABn ph\u1EA3i v\u01B0\u1EE3t checksum \u0111\u1EC3 \u0111\u01B0\u1EE3c l\u01B0u.");
    i0.ɵɵelementEnd();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 113);
    i0.ɵɵtemplate(1, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_50_Conditional_1_Template, 5, 1)(2, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_50_Conditional_2_Template, 2, 0, "p", 115)(3, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_50_Conditional_3_Template, 2, 0, "p", 115);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵnextContext();
    const issue_r14 = i0.ɵɵreadContextLet(0);
    i0.ɵɵproperty("ngClass", issue_r14.lookupStatus === "found" ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900");
    i0.ɵɵadvance();
    i0.ɵɵconditional(issue_r14.lookupStatus === "found" ? 1 : issue_r14.lookupStatus === "not_found" ? 2 : issue_r14.lookupStatus === "error" ? 3 : -1);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0)(1);
    i0.ɵɵelementStart(2, "div", 79)(3, "nav", 83)(4, "button", 84);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.previousPage()); });
    i0.ɵɵelement(5, "i", 85);
    i0.ɵɵtext(6, "H\u1ED3 s\u01A1 tr\u01B0\u1EDBc ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 86)(8, "div", 87);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 88);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "button", 84);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.nextPage()); });
    i0.ɵɵtext(13, " H\u1ED3 s\u01A1 sau");
    i0.ɵɵelement(14, "i", 89);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 90);
    i0.ɵɵelement(16, "div", 91);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "section", 92)(18, "div", 93)(19, "div", 94)(20, "span", 95);
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(22, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_22_Template, 2, 1, "span", 96)(23, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_23_Template, 2, 1, "span", 96);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "h4", 97);
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "p", 50);
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(28, "div", 98)(29, "div")(30, "label", 99);
    i0.ɵɵtext(31, "D\u1EEF li\u1EC7u CAS hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 100);
    i0.ɵɵtext(33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "p", 101);
    i0.ɵɵelement(35, "i", 102);
    i0.ɵɵtext(36);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "div")(38, "label", 103);
    i0.ɵɵtext(39, "CAS \u0111i\u1EC1u ch\u1EC9nh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "div", 104)(41, "input", 105);
    i0.ɵɵlistener("ngModelChange", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Template_input_ngModelChange_41_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateCasSuggestion($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "button", 106);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Template_button_click_42_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.fetchCurrentCasInfo()); });
    i0.ɵɵtemplate(43, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_43_Template, 1, 0, "i", 107)(44, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_44_Template, 1, 0, "i", 108);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(45, "div", 109)(46, "p", 110);
    i0.ɵɵelement(47, "i", 111);
    i0.ɵɵtext(48);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(49, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_49_Template, 2, 1, "button", 112);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(50, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Conditional_50_Template, 4, 2, "div", 113);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    const issue_r17 = i0.ɵɵstoreLet(ctx_r1.currentCasIssue());
    i0.ɵɵadvance();
    const assessment_r18 = i0.ɵɵstoreLet(ctx_r1.currentCasAssessment());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.currentPageIndex() === 0 || ctx_r1.isProcessing());
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate3("", ctx_r1.workspaceLabel(), " \u00B7 ", ctx_r1.currentPageIndex() + 1, " / ", ctx_r1.filteredCasIssues().length, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(issue_r17.standard.internal_id || issue_r17.standard.id);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.currentPageIndex() >= ctx_r1.filteredCasIssues().length - 1 || ctx_r1.isProcessing());
    i0.ɵɵadvance(4);
    i0.ɵɵstyleProp("width", ctx_r1.pageProgress(), "%");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(issue_r17.standard.internal_id || issue_r17.standard.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional(issue_r17.standard.product_code ? 22 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(issue_r17.standard.lot_number ? 23 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(issue_r17.standard.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.issueGuidance(issue_r17.kind));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(issue_r17.originalCas || "Tr\u1ED1ng");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(issue_r17.assessment.reason);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", issue_r17.suggestedCas)("ngClass", assessment_r18.quality === "valid" ? "border-emerald-400 dark:border-emerald-700" : "border-slate-300 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", assessment_r18.quality !== "valid" || issue_r17.lookupStatus === "loading" || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(issue_r17.lookupStatus === "loading" ? 43 : 44);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", assessment_r18.quality === "valid" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", assessment_r18.quality === "valid" ? "fa-circle-check" : "fa-circle-info");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", assessment_r18.reason, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(assessment_r18.normalizedCas && assessment_r18.normalizedCas !== issue_r17.suggestedCas.trim() ? 49 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(issue_r17.lookupStatus !== "idle" ? 50 : -1);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_0_Template, 6, 1, "div", 35)(1, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Conditional_1_Template, 51, 26, "div", 79);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(!ctx_r1.currentCasIssue() ? 0 : 1);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35);
    i0.ɵɵelement(1, "i", 119);
    i0.ɵɵelementStart(2, "p", 81);
    i0.ɵɵtext(3, "Ch\u01B0a c\u00F3 h\u1ED3 s\u01A1 v\u1EDBi s\u1ED1 CAS h\u1EE3p l\u1EC7.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 120);
    i0.ɵɵtext(5, "C\u00E1c nh\u00E3n gi\u1EEF ch\u1ED7 v\u00E0 CAS l\u1ED7i \u0111\u00E3 \u0111\u01B0\u1EE3c ch\u1EB7n kh\u1ECFi quy tr\u00ECnh chu\u1EA9n h\u00F3a.");
    i0.ɵɵelementEnd()();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 36);
    i0.ɵɵelement(1, "i", 121);
    i0.ɵɵelementStart(2, "p", 81);
    i0.ɵɵtext(3, "Kh\u00F4ng c\u00F3 nh\u00F3m CAS ph\u00F9 h\u1EE3p b\u1ED9 l\u1ECDc.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 82);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_51_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r19); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.clearFilters()); });
    i0.ɵɵtext(5, "X\u00F3a b\u1ED9 l\u1ECDc");
    i0.ɵɵelementEnd()();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 128);
    i0.ɵɵelement(1, "i", 152);
    i0.ɵɵtext(2, "\u0110\u00E3 l\u01B0u to\u00E0n nh\u00F3m");
    i0.ɵɵelementEnd();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵelement(1, "i", 153);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const reason_r21 = ctx.$implicit;
    i0.ɵɵnextContext();
    const group_r22 = i0.ɵɵreadContextLet(0);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.riskTextClass(group_r22.risk.level));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(reason_r21);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 72);
    i0.ɵɵtext(1, "\u0110ang tra c\u1EE9u ");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 154);
    i0.ɵɵtext(1, "Tra PubChem nh\u00F3m n\u00E0y ");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 137);
    i0.ɵɵelement(1, "i", 155);
    i0.ɵɵtext(2, "\u0110\u00E3 kh\u00F3a \u00E1p d\u1EE5ng m\u1ED9t t\u00EAn chung v\u00EC nh\u00F3m c\u00F3 nguy c\u01A1 m\u1EA5t th\u00F4ng tin s\u1EA3n ph\u1EA9m.");
    i0.ɵɵelementEnd();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 96);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const record_r24 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(record_r24.standard.product_code);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 161);
    i0.ɵɵelement(1, "i", 167);
    i0.ɵɵtext(2, "\u0110\u00E3 l\u01B0u");
    i0.ɵɵelementEnd();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 166);
    i0.ɵɵelement(1, "i", 168);
    i0.ɵɵtext(2, "C\u00F3 thay \u0111\u1ED5i; ki\u1EC3m tra n\u1ED3ng \u0111\u1ED9, dung m\u00F4i v\u00E0 d\u1EA1ng ch\u1EA5t tr\u01B0\u1EDBc khi ch\u1ECDn.");
    i0.ɵɵelementEnd();
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Template(rf, ctx) { if (rf & 1) {
    const _r23 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 151)(1, "div", 156)(2, "input", 157);
    i0.ɵɵlistener("ngModelChange", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Template_input_ngModelChange_2_listener($event) { const record_r24 = i0.ɵɵrestoreView(_r23).$implicit; i0.ɵɵnextContext(); const group_r22 = i0.ɵɵreadContextLet(0); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleRecord(group_r22.id, record_r24.standard.id, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 158)(4, "div", 6)(5, "div", 159)(6, "span", 160);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Conditional_8_Template, 2, 1, "span", 96)(9, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Conditional_9_Template, 3, 0, "span", 161);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 162);
    i0.ɵɵtext(11, "T\u00EAn hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "p", 163);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 164)(15, "span")(16, "strong");
    i0.ɵɵtext(17, "\u0110\u01A1n v\u1ECB:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "span")(20, "strong");
    i0.ɵɵtext(21, "Quy c\u00E1ch:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "span")(24, "strong");
    i0.ɵɵtext(25, "D\u1EA1ng:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(27, "div")(28, "label", 103);
    i0.ɵɵtext(29, "T\u00EAn s\u1EA3n ph\u1EA9m sau chu\u1EA9n h\u00F3a");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "input", 165);
    i0.ɵɵlistener("ngModelChange", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Template_input_ngModelChange_30_listener($event) { const record_r24 = i0.ɵɵrestoreView(_r23).$implicit; i0.ɵɵnextContext(); const group_r22 = i0.ɵɵreadContextLet(0); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.updateRecordName(group_r22.id, record_r24.standard.id, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(31, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Conditional_31_Template, 3, 0, "p", 166);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const record_r24 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngClass", record_r24.selected ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/15" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", record_r24.selected);
    i0.ɵɵattribute("aria-label", "Ch\u1ECDn " + record_r24.originalName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(record_r24.standard.internal_id || record_r24.standard.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional(record_r24.standard.product_code ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(record_r24.saved ? 9 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(record_r24.originalName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", record_r24.standard.unit || "\u2014", "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", record_r24.standard.pack_size || "\u2014", "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.formLabel(record_r24.originalName), "");
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("border-amber-400", !record_r24.suggestedName.trim());
    i0.ɵɵproperty("ngModel", record_r24.suggestedName);
    i0.ɵɵadvance();
    i0.ɵɵconditional(record_r24.suggestedName.trim() !== record_r24.originalName.trim() ? 31 : -1);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "div", 37)(2, "nav", 122)(3, "button", 84);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r20); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.previousPage()); });
    i0.ɵɵelement(4, "i", 85);
    i0.ɵɵtext(5, "Nh\u00F3m tr\u01B0\u1EDBc ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 86)(7, "div", 87);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 123);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "button", 84);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r20); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.nextPage()); });
    i0.ɵɵtext(12, " Nh\u00F3m sau");
    i0.ɵɵelement(13, "i", 89);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 90);
    i0.ɵɵelement(15, "div", 91);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "section", 92)(17, "div", 124)(18, "div", 6)(19, "div", 94)(20, "span", 125);
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "span", 126);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "span", 127);
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(26, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Conditional_26_Template, 3, 0, "span", 128);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "ul", 129);
    i0.ɵɵrepeaterCreate(28, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_29_Template, 3, 2, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "button", 130);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r20); const group_r22 = i0.ɵɵreadContextLet(0); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.fetchGroupInfo(group_r22)); });
    i0.ɵɵtemplate(31, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Conditional_31_Template, 2, 0)(32, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Conditional_32_Template, 2, 0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "div", 131)(34, "div")(35, "label", 103);
    i0.ɵɵtext(36, "T\u00EAn h\u00F3a ch\u1EA5t chu\u1EA9n h\u00F3a");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "input", 132);
    i0.ɵɵlistener("ngModelChange", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template_input_ngModelChange_37_listener($event) { i0.ɵɵrestoreView(_r20); const group_r22 = i0.ɵɵreadContextLet(0); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.updateCanonicalName(group_r22.id, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "p", 133);
    i0.ɵɵtext(39, "Tr\u01B0\u1EDDng n\u00E0y m\u00F4 t\u1EA3 h\u00F3a ch\u1EA5t; kh\u00F4ng thay th\u1EBF n\u1ED3ng \u0111\u1ED9, dung m\u00F4i hay d\u1EA1ng s\u1EA3n ph\u1EA9m.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(40, "div", 134)(41, "button", 135);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r20); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.applyCanonicalToCurrentGroup()); });
    i0.ɵɵelement(42, "i", 136);
    i0.ɵɵtext(43, "\u00C1p d\u1EE5ng t\u00EAn chu\u1EA9n cho to\u00E0n nh\u00F3m an to\u00E0n ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(44, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Conditional_44_Template, 3, 0, "p", 137);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(45, "details", 138)(46, "summary", 139);
    i0.ɵɵelement(47, "i", 140);
    i0.ɵɵtext(48, "T\u00EAn \u0111\u1ED3ng ngh\u0129a v\u00E0 t\u00EAn t\u00ECm ki\u1EBFm ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "div", 141)(50, "textarea", 142);
    i0.ɵɵlistener("ngModelChange", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template_textarea_ngModelChange_50_listener($event) { i0.ɵɵrestoreView(_r20); const group_r22 = i0.ɵɵreadContextLet(0); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.updateSuggestedSynonyms(group_r22.id, $event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(51, "div", 143)(52, "div", 144)(53, "div")(54, "h4", 145);
    i0.ɵɵtext(55, "Duy\u1EC7t t\u1EEBng h\u1ED3 s\u01A1 trong nh\u00F3m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "p", 146);
    i0.ɵɵtext(57, "Ch\u1EC9 c\u00E1c h\u1ED3 s\u01A1 \u0111\u01B0\u1EE3c \u0111\u00E1nh d\u1EA5u m\u1EDBi \u0111\u01B0\u1EE3c l\u01B0u.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(58, "div", 26)(59, "button", 147);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template_button_click_59_listener() { i0.ɵɵrestoreView(_r20); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.normalizeCurrentGroupTypography()); });
    i0.ɵɵelement(60, "i", 148);
    i0.ɵɵtext(61, "Chu\u1EA9n h\u00F3a ki\u1EC3u ch\u1EEF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(62, "button", 149);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template_button_click_62_listener() { i0.ɵɵrestoreView(_r20); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleAllCurrentRecords()); });
    i0.ɵɵtext(63);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(64, "div", 150);
    i0.ɵɵrepeaterCreate(65, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_For_66_Template, 32, 14, "article", 151, _forTrack2);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    const group_r25 = i0.ɵɵstoreLet(ctx_r1.currentGroup());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.currentPageIndex() === 0 || ctx_r1.isProcessing());
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("Nh\u00F3m ", ctx_r1.currentPageIndex() + 1, " / ", ctx_r1.filteredGroups().length, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("CAS ", group_r25.cas, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.currentPageIndex() >= ctx_r1.filteredGroups().length - 1 || ctx_r1.isProcessing());
    i0.ɵɵadvance(4);
    i0.ɵɵstyleProp("width", ctx_r1.pageProgress(), "%");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(group_r25.cas);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.riskBadgeClass(group_r25.risk.level));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.riskLabel(group_r25.risk.level));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", group_r25.records.length, " h\u1ED3 s\u01A1");
    i0.ɵɵadvance();
    i0.ɵɵconditional(group_r25.status === "success" ? 26 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(group_r25.risk.reasons);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", group_r25.status === "loading" || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(group_r25.status === "loading" ? 31 : 32);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", group_r25.canonicalName);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", !group_r25.risk.canApplyCanonicalToAll || !group_r25.canonicalName.trim() || ctx_r1.isProcessing());
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(!group_r25.risk.canApplyCanonicalToAll ? 44 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", group_r25.suggestedSynonyms);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.allCurrentRecordsSelected() ? "B\u1ECF ch\u1ECDn nh\u00F3m" : "Ch\u1ECDn h\u1ED3 s\u01A1 nh\u00F3m n\u00E0y");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(group_r25.records);
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_54_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 107);
    i0.ɵɵtext(1, "\u0110ang l\u01B0u ");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_54_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 176);
    i0.ɵɵtext(1, "L\u01B0u nh\u00F3m hi\u1EC7n t\u1EA1i ");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_54_Template(rf, ctx) { if (rf & 1) {
    const _r26 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 169);
    i0.ɵɵelement(1, "i", 170);
    i0.ɵɵtext(2, "Ch\u1EC9 l\u01B0u nh\u00F3m CAS \u0111ang hi\u1EC3n th\u1ECB \u00B7 \u0110\u00E3 ch\u1ECDn ");
    i0.ɵɵelementStart(3, "strong", 171);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5, " h\u1ED3 s\u01A1 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 26)(7, "button", 172);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_54_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(8, "\u0110\u00F3ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 173);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_54_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.applyCurrentGroup(false)); });
    i0.ɵɵtemplate(10, StandardsDataCleanupModalComponent_Conditional_0_Conditional_54_Conditional_10_Template, 2, 0)(11, StandardsDataCleanupModalComponent_Conditional_0_Conditional_54_Conditional_11_Template, 2, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 174);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_54_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.applyCurrentGroup(true)); });
    i0.ɵɵtext(13, " L\u01B0u & nh\u00F3m sau");
    i0.ɵɵelement(14, "i", 175);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.currentSelectedCount());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.currentSelectedCount() === 0 || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 10 : 11);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.currentSelectedCount() === 0 || ctx_r1.isProcessing());
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_55_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 107);
    i0.ɵɵtext(1, "\u0110ang l\u01B0u ");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_55_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 176);
    i0.ɵɵtext(1, "L\u01B0u CAS \u0111i\u1EC1u ch\u1EC9nh ");
} }
function StandardsDataCleanupModalComponent_Conditional_0_Conditional_55_Template(rf, ctx) { if (rf & 1) {
    const _r27 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 169);
    i0.ɵɵelement(1, "i", 170);
    i0.ɵɵtext(2, "Ch\u1EC9 l\u01B0u m\u1ED9t h\u1ED3 s\u01A1 \u00B7 CAS ph\u1EA3i \u0111\u00FAng c\u1EA5u tr\u00FAc v\u00E0 checksum ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 26)(4, "button", 172);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_55_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r27); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(5, "\u0110\u00F3ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 173);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_55_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r27); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.applyCurrentCas(false)); });
    i0.ɵɵtemplate(7, StandardsDataCleanupModalComponent_Conditional_0_Conditional_55_Conditional_7_Template, 2, 0)(8, StandardsDataCleanupModalComponent_Conditional_0_Conditional_55_Conditional_8_Template, 2, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 174);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Conditional_55_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r27); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.applyCurrentCas(true)); });
    i0.ɵɵtext(10, " L\u01B0u & h\u1ED3 s\u01A1 sau");
    i0.ɵɵelement(11, "i", 175);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.canSaveCurrentCas() || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 7 : 8);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.canSaveCurrentCas() || ctx_r1.isProcessing());
} }
function StandardsDataCleanupModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "header", 2)(3, "div", 3)(4, "div", 4);
    i0.ɵɵelement(5, "i", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 6)(7, "h3", 7);
    i0.ɵɵtext(8, "Chu\u1EA9n H\u00F3a Danh Ph\u00E1p & CAS Ch\u1EA5t Chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 8);
    i0.ɵɵtext(10, "M\u1ED7i trang ch\u1EC9 hi\u1EC3n th\u1ECB m\u1ED9t nh\u00F3m CAS ho\u1EB7c m\u1ED9t h\u1ED3 s\u01A1 l\u1ED7i \u0111\u1EC3 gi\u1EA3m nguy c\u01A1 \u0111i\u1EC1u ch\u1EC9nh nh\u1EA7m.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "button", 9);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(12, "i", 10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "section", 11)(14, "span", 12);
    i0.ɵɵelement(15, "i", 13);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "button", 14);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setWorkspace("valid")); });
    i0.ɵɵelement(18, "i", 15);
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(20, StandardsDataCleanupModalComponent_Conditional_0_Conditional_20_Template, 3, 1, "button", 16)(21, StandardsDataCleanupModalComponent_Conditional_0_Conditional_21_Template, 3, 1, "button", 17)(22, StandardsDataCleanupModalComponent_Conditional_0_Conditional_22_Template, 3, 1, "button", 18)(23, StandardsDataCleanupModalComponent_Conditional_0_Conditional_23_Template, 3, 1, "span", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "section", 20)(25, "div", 21)(26, "div", 22);
    i0.ɵɵelement(27, "i", 23);
    i0.ɵɵelementStart(28, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsDataCleanupModalComponent_Conditional_0_Template_input_ngModelChange_28_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setSearchQuery($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(29, StandardsDataCleanupModalComponent_Conditional_0_Conditional_29_Template, 2, 0, "button", 25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "div", 26)(31, "button", 27);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Template_button_click_31_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openHistory()); });
    i0.ɵɵelement(32, "i", 28);
    i0.ɵɵtext(33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "button", 29);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Template_button_click_34_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.scanData()); });
    i0.ɵɵelement(35, "i", 30);
    i0.ɵɵtext(36, "Qu\u00E9t l\u1EA1i ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(37, "div", 31)(38, "button", 32);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setWorkspace("valid")); });
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "button", 32);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setWorkspace("placeholder")); });
    i0.ɵɵtext(41);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "button", 32);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Template_button_click_42_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setWorkspace("date_corrupted")); });
    i0.ɵɵtext(43);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "button", 32);
    i0.ɵɵlistener("click", function StandardsDataCleanupModalComponent_Conditional_0_Template_button_click_44_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setWorkspace("invalid")); });
    i0.ɵɵtext(45);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(46, StandardsDataCleanupModalComponent_Conditional_0_Conditional_46_Template, 11, 15, "div", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(47, StandardsDataCleanupModalComponent_Conditional_0_Conditional_47_Template, 17, 3, "section", 33);
    i0.ɵɵelementStart(48, "main", 34);
    i0.ɵɵtemplate(49, StandardsDataCleanupModalComponent_Conditional_0_Conditional_49_Template, 2, 1)(50, StandardsDataCleanupModalComponent_Conditional_0_Conditional_50_Template, 6, 0, "div", 35)(51, StandardsDataCleanupModalComponent_Conditional_0_Conditional_51_Template, 6, 0, "div", 36)(52, StandardsDataCleanupModalComponent_Conditional_0_Conditional_52_Template, 67, 22, "div", 37);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "footer", 38);
    i0.ɵɵtemplate(54, StandardsDataCleanupModalComponent_Conditional_0_Conditional_54_Template, 15, 5)(55, StandardsDataCleanupModalComponent_Conditional_0_Conditional_55_Template, 12, 4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.totalStandardsCount(), " h\u1ED3 s\u01A1");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", ctx_r1.groups().length, " CAS h\u1EE3p l\u1EC7");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.placeholderCasCount() > 0 ? 20 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.dateCorruptedCasCount() > 0 ? 21 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.invalidCasCount() > 0 ? 22 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.missingCasCount() > 0 ? 23 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r1.searchQuery());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.searchQuery() ? 29 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Ho\u00E0n t\u00E1c (", ctx_r1.activeBatchCount(), ") ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r1.workspaceClass("valid"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Danh ph\u00E1p CAS h\u1EE3p l\u1EC7 (", ctx_r1.groups().length, ")");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.workspaceClass("placeholder"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Nh\u00E3n gi\u1EEF ch\u1ED7 (", ctx_r1.placeholderCasCount(), ")");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.workspaceClass("date_corrupted"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("CAS d\u1EA1ng ng\u00E0y (", ctx_r1.dateCorruptedCasCount(), ")");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.workspaceClass("invalid"));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("CAS l\u1ED7i kh\u00E1c (", ctx_r1.invalidCasCount(), ")");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.workspace() === "valid" ? 46 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showHistory() ? 47 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.workspace() !== "valid" ? 49 : ctx_r1.groups().length === 0 ? 50 : !ctx_r1.currentGroup() ? 51 : 52);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.workspace() === "valid" ? 54 : 55);
} }
export class StandardsDataCleanupModalComponent {
    constructor() {
        this.isOpen = input(false);
        this.allStandards = input([]);
        this.closeModal = output();
        this.pubchemService = inject(PubchemService);
        this.standardService = inject(StandardService);
        this.toast = inject(ToastService);
        this.progressService = inject(ProgressService);
        this.groups = signal([]);
        this.casIssues = signal([]);
        this.workspace = signal('valid');
        this.isProcessing = signal(false);
        this.searchQuery = signal('');
        this.statusFilter = signal('all');
        this.pageIndex = signal(0);
        this.totalStandardsCount = signal(0);
        this.missingCasCount = signal(0);
        this.placeholderCasCount = signal(0);
        this.dateCorruptedCasCount = signal(0);
        this.invalidCasCount = signal(0);
        this.showHistory = signal(false);
        this.cleanupHistory = signal([]);
        this.isLoadingHistory = signal(false);
        this.undoingBatchId = signal(null);
        this.currentStandards = [];
        this.filteredGroups = computed(() => {
            const query = this.searchQuery().trim().toLocaleLowerCase('vi-VN');
            const filter = this.statusFilter();
            return this.groups().filter(group => {
                const matchesFilter = filter === 'all'
                    || (filter === 'safe' && group.risk.level === 'low' && group.status !== 'success')
                    || (filter === 'review' && group.risk.level === 'medium' && group.status !== 'success')
                    || (filter === 'blocked' && group.risk.level === 'high' && group.status !== 'success')
                    || (filter === 'success' && group.status === 'success');
                if (!matchesFilter)
                    return false;
                if (!query)
                    return true;
                return group.cas.toLocaleLowerCase('vi-VN').includes(query)
                    || group.canonicalName.toLocaleLowerCase('vi-VN').includes(query)
                    || group.records.some(record => [
                        record.originalName,
                        record.suggestedName,
                        record.standard.internal_id,
                        record.standard.product_code,
                    ].some(value => value?.toLocaleLowerCase('vi-VN').includes(query)));
            });
        });
        this.filteredCasIssues = computed(() => {
            const workspace = this.workspace();
            if (workspace === 'valid')
                return [];
            const query = this.searchQuery().trim().toLocaleLowerCase('vi-VN');
            return this.casIssues().filter(issue => {
                if (issue.kind !== workspace)
                    return false;
                if (!query)
                    return true;
                return [
                    issue.originalCas,
                    issue.suggestedCas,
                    issue.standard.name,
                    issue.standard.internal_id,
                    issue.standard.product_code,
                    issue.standard.lot_number,
                ].some(value => value?.toLocaleLowerCase('vi-VN').includes(query));
            });
        });
        this.currentPageCount = computed(() => this.workspace() === 'valid'
            ? this.filteredGroups().length
            : this.filteredCasIssues().length);
        this.currentPageIndex = computed(() => Math.min(this.pageIndex(), Math.max(0, this.currentPageCount() - 1)));
        this.currentGroup = computed(() => this.workspace() === 'valid' ? this.filteredGroups()[this.currentPageIndex()] ?? null : null);
        this.currentCasIssue = computed(() => this.workspace() === 'valid' ? null : this.filteredCasIssues()[this.currentPageIndex()] ?? null);
        this.currentCasAssessment = computed(() => assessCasNumber(this.currentCasIssue()?.suggestedCas));
        this.canSaveCurrentCas = computed(() => {
            const issue = this.currentCasIssue();
            const assessment = this.currentCasAssessment();
            return Boolean(issue && assessment.quality === 'valid' && assessment.normalizedCas
                && assessment.normalizedCas !== issue.originalCas.trim());
        });
        this.pageProgress = computed(() => this.currentPageCount() === 0 ? 0 : ((this.currentPageIndex() + 1) / this.currentPageCount()) * 100);
        this.safeCount = computed(() => this.groups().filter(group => group.risk.level === 'low').length);
        this.mediumRiskCount = computed(() => this.groups().filter(group => group.risk.level === 'medium').length);
        this.highRiskCount = computed(() => this.groups().filter(group => group.risk.level === 'high').length);
        this.successCount = computed(() => this.groups().filter(group => group.status === 'success').length);
        this.activeBatchCount = computed(() => this.cleanupHistory().filter(batch => batch.status === 'APPLIED').length);
        this.currentSelectedCount = computed(() => this.currentGroup()?.records.filter(record => record.selected && record.suggestedName.trim()).length ?? 0);
        this.allCurrentRecordsSelected = computed(() => {
            const records = this.currentGroup()?.records ?? [];
            return records.length > 0 && records.every(record => record.selected);
        });
        effect(() => {
            const open = this.isOpen();
            const count = this.allStandards().length;
            if (open && count > 0) {
                untracked(() => {
                    if (this.groups().length === 0)
                        this.scanData();
                    if (this.cleanupHistory().length === 0 && !this.isLoadingHistory())
                        void this.loadCleanupHistory();
                });
            }
        });
    }
    scanData(source, resetPage = true) {
        const selectedSource = source ?? (this.currentStandards.length > 0 ? this.currentStandards : this.allStandards());
        this.currentStandards = selectedSource;
        const active = selectedSource.filter(standard => !standard._isDeleted);
        const grouped = new Map();
        const issues = [];
        const counts = { missing: 0, placeholder: 0, date_corrupted: 0, annotated: 0, invalid: 0 };
        active.forEach(standard => {
            const cas = assessCasNumber(standard.cas_number);
            if (cas.quality !== 'valid') {
                counts[cas.quality]++;
                if (cas.quality !== 'missing') {
                    const kind = cas.quality === 'placeholder'
                        ? 'placeholder'
                        : (cas.quality === 'date_corrupted' ? 'date_corrupted' : 'invalid');
                    issues.push({
                        standard,
                        kind,
                        originalCas: standard.cas_number?.trim() ?? '',
                        suggestedCas: suggestCasCorrection(standard.cas_number),
                        assessment: cas,
                        lookupStatus: 'idle',
                    });
                }
                return;
            }
            if (!cas.normalizedCas)
                return;
            const bucket = grouped.get(cas.normalizedCas) ?? [];
            bucket.push(standard);
            grouped.set(cas.normalizedCas, bucket);
        });
        const groups = [...grouped.entries()].map(([cas, standards]) => {
            const originalNames = [...new Map(standards.map(item => item.name.trim()).filter(Boolean).map(name => [name.toLocaleLowerCase('en-US'), name])).values()];
            const risk = assessCleanupGroup(standards);
            const canonicalName = standards.find(item => item.canonical_name?.trim())?.canonical_name?.trim()
                || (risk.level === 'low' ? formatStandardProductName(originalNames[0] ?? '') : '');
            const existingAliases = standards.flatMap(item => parseChemicalNames(item.chemical_name ?? ''));
            return {
                id: cas,
                cas,
                records: standards.map(standard => ({
                    standard,
                    originalName: standard.name.trim(),
                    suggestedName: formatStandardProductName(standard.name),
                    selected: false,
                    saved: false,
                })),
                originalNames,
                canonicalName,
                canonicalSource: 'existing',
                suggestedSynonyms: normalizeChemicalNames(existingAliases, [canonicalName, cas]).join('\n'),
                risk,
                status: risk.level === 'low' ? 'ready' : 'review',
            };
        });
        groups.sort((a, b) => {
            const riskOrder = { high: 0, medium: 1, low: 2 };
            return riskOrder[a.risk.level] - riskOrder[b.risk.level]
                || b.records.length - a.records.length
                || a.cas.localeCompare(b.cas);
        });
        this.groups.set(groups);
        this.casIssues.set(issues.sort((a, b) => (a.standard.internal_id || a.standard.id).localeCompare(b.standard.internal_id || b.standard.id, 'vi')));
        this.totalStandardsCount.set(active.length);
        this.missingCasCount.set(counts.missing);
        this.placeholderCasCount.set(counts.placeholder);
        this.dateCorruptedCasCount.set(counts.date_corrupted);
        this.invalidCasCount.set(counts.annotated + counts.invalid);
        if (resetPage)
            this.pageIndex.set(0);
    }
    setWorkspace(workspace) {
        this.workspace.set(workspace);
        this.statusFilter.set('all');
        this.pageIndex.set(0);
    }
    setSearchQuery(value) {
        this.searchQuery.set(value);
        this.pageIndex.set(0);
    }
    setFilter(filter) {
        this.statusFilter.set(filter);
        this.pageIndex.set(0);
    }
    clearFilters() {
        this.searchQuery.set('');
        this.statusFilter.set('all');
        this.pageIndex.set(0);
    }
    async openHistory() {
        this.showHistory.set(true);
        await this.loadCleanupHistory();
    }
    async loadCleanupHistory() {
        this.isLoadingHistory.set(true);
        try {
            this.cleanupHistory.set(await this.standardService.getRecentStandardNameCleanupBatches(20));
        }
        catch (error) {
            console.error('Load cleanup history failed', error);
            this.toast.show('Không thể tải lịch sử chuẩn hóa.', 'error');
        }
        finally {
            this.isLoadingHistory.set(false);
        }
    }
    formatBatchDate(value) {
        if (!value)
            return 'Đang đồng bộ';
        const date = timestampToDate(value);
        return date ? date.toLocaleString('vi-VN') : 'Không rõ thời gian';
    }
    async undoBatch(batch) {
        if (batch.status !== 'APPLIED' || this.undoingBatchId())
            return;
        if (!confirm(`Hoàn tác phiên ${batch.id}?\n\n${batch.recordCount} hồ sơ CAS ${batch.cas} sẽ được khôi phục về CAS, tên và metadata trước khi chuẩn hóa.`))
            return;
        this.undoingBatchId.set(batch.id);
        try {
            await this.standardService.undoStandardNameCleanupBatch(batch.id);
            const freshStandards = await this.standardService.fetchAllAndCache();
            this.scanData(freshStandards);
            await this.loadCleanupHistory();
            this.toast.show(`Đã hoàn tác phiên ${batch.id}.`, 'success');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Không thể hoàn tác phiên chuẩn hóa.';
            this.toast.show(message, 'error');
        }
        finally {
            this.undoingBatchId.set(null);
        }
    }
    filterClass(filter) {
        const active = this.statusFilter() === filter;
        return `px-3 py-1.5 rounded-lg whitespace-nowrap transition ${active
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`;
    }
    workspaceClass(workspace) {
        const active = this.workspace() === workspace;
        return `px-3 py-1.5 rounded-lg whitespace-nowrap border transition ${active
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`;
    }
    previousPage() {
        this.pageIndex.update(index => Math.max(0, index - 1));
    }
    nextPage() {
        this.pageIndex.update(index => Math.min(Math.max(0, this.currentPageCount() - 1), index + 1));
    }
    riskLabel(level) {
        return level === 'low' ? 'An toàn' : level === 'medium' ? 'Cần duyệt' : 'Rủi ro cao';
    }
    riskBadgeClass(level) {
        if (level === 'low')
            return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
        if (level === 'medium')
            return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300';
        return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
    }
    riskTextClass(level) {
        return level === 'low' ? 'text-emerald-500' : level === 'medium' ? 'text-amber-500' : 'text-red-500';
    }
    formLabel(name) {
        const labels = {
            neat: 'Chất riêng',
            solution: 'Dung dịch',
            mixture: 'Hỗn hợp',
            isotope: 'Đồng vị',
            salt_or_hydrate: 'Muối/Hydrat',
        };
        return labels[detectStandardForm(name)];
    }
    workspaceLabel(workspace = this.workspace()) {
        const labels = {
            valid: 'CAS hợp lệ',
            placeholder: 'Nhãn CAS giữ chỗ',
            date_corrupted: 'CAS dạng ngày',
            invalid: 'CAS lỗi khác',
        };
        return labels[workspace];
    }
    issueGuidance(kind) {
        if (kind === 'placeholder') {
            return 'Nhãn giữ chỗ không xác định được danh tính hóa học. Hãy đối chiếu CoA hoặc nhãn gốc rồi nhập CAS chính xác.';
        }
        if (kind === 'date_corrupted') {
            return 'Excel có thể đã chuyển CAS thành ngày. Không thể khôi phục đáng tin cậy từ giá trị này; phải đối chiếu nguồn gốc.';
        }
        return 'CAS sai cấu trúc, checksum hoặc đang chứa chú thích. Chỉ đề xuất tự động khi tìm thấy đúng một CAS hợp lệ.';
    }
    updateCasSuggestion(value) {
        const issue = this.currentCasIssue();
        if (!issue)
            return;
        this.casIssues.update(issues => issues.map(item => item.standard.id === issue.standard.id
            ? {
                ...item,
                suggestedCas: value,
                lookupName: undefined,
                lookupStatus: 'idle',
            }
            : item));
    }
    useNormalizedCas() {
        const normalized = this.currentCasAssessment().normalizedCas;
        if (normalized)
            this.updateCasSuggestion(normalized);
    }
    async fetchCurrentCasInfo() {
        const issue = this.currentCasIssue();
        const assessment = this.currentCasAssessment();
        if (!issue || assessment.quality !== 'valid' || !assessment.normalizedCas)
            return;
        this.updateCasIssue(issue.standard.id, current => ({ ...current, lookupStatus: 'loading', lookupName: undefined }));
        try {
            const info = await this.pubchemService.getChemicalInfo(assessment.normalizedCas);
            if (!info?.commercialName) {
                this.updateCasIssue(issue.standard.id, current => ({ ...current, lookupStatus: 'not_found', lookupName: undefined }));
                return;
            }
            this.updateCasIssue(issue.standard.id, current => ({
                ...current,
                lookupStatus: 'found',
                lookupName: formatStandardProductName(info.commercialName),
            }));
        }
        catch (error) {
            console.error('CAS correction PubChem lookup failed', error);
            this.updateCasIssue(issue.standard.id, current => ({ ...current, lookupStatus: 'error', lookupName: undefined }));
        }
    }
    async applyCurrentCas(goNext) {
        const issue = this.currentCasIssue();
        const assessment = this.currentCasAssessment();
        if (!issue || assessment.quality !== 'valid' || !assessment.normalizedCas)
            return;
        const normalizedCas = assessment.normalizedCas;
        if (!confirm(`Sửa CAS cho ${issue.standard.internal_id || issue.standard.id}?\n\n`
            + `${issue.originalCas || 'Trống'}  →  ${normalizedCas}\n\n`
            + 'Thay đổi được lưu thành một phiên và có thể hoàn tác.'))
            return;
        const pageBeforeSave = this.currentPageIndex();
        const workspaceBeforeSave = this.workspace();
        this.isProcessing.set(true);
        this.progressService.start('Đang sửa CAS', issue.standard.internal_id || issue.standard.id, 1);
        try {
            const batchId = await this.standardService.updateStandardNames([{
                    standardId: issue.standard.id,
                    name: issue.standard.name,
                    chemicalName: issue.standard.chemical_name ?? '',
                    casNumber: normalizedCas,
                    canonicalName: issue.standard.canonical_name,
                    originalName: issue.standard.original_name || issue.standard.name,
                    nameSource: issue.standard.name_source,
                    casStatus: 'valid',
                    standardForm: issue.standard.standard_form || detectStandardForm(issue.standard.name),
                    normalizationVersion: '2026.07.2',
                }]);
            this.progressService.update(1, normalizedCas);
            const freshStandards = await this.standardService.fetchAllAndCache();
            this.workspace.set(workspaceBeforeSave);
            this.scanData(freshStandards, false);
            const nextIndex = goNext ? pageBeforeSave : Math.min(pageBeforeSave, Math.max(0, this.currentPageCount() - 1));
            this.pageIndex.set(Math.min(nextIndex, Math.max(0, this.currentPageCount() - 1)));
            await this.loadCleanupHistory();
            this.toast.show(`Đã sửa CAS thành ${normalizedCas} · phiên ${batchId}.`, 'success');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Không thể lưu CAS đã sửa.';
            this.toast.show(message, 'error');
        }
        finally {
            this.progressService.complete();
            this.isProcessing.set(false);
        }
    }
    updateCanonicalName(groupId, value) {
        this.updateGroup(groupId, group => ({ ...group, canonicalName: value, canonicalSource: 'manual' }));
    }
    updateSuggestedSynonyms(groupId, value) {
        this.updateGroup(groupId, group => ({ ...group, suggestedSynonyms: value }));
    }
    updateRecordName(groupId, standardId, value) {
        this.updateGroup(groupId, group => ({
            ...group,
            records: group.records.map(record => record.standard.id === standardId
                ? { ...record, suggestedName: value, selected: Boolean(value.trim()), saved: false }
                : record),
            status: group.risk.level === 'low' ? 'ready' : 'review',
        }));
    }
    toggleRecord(groupId, standardId, selected) {
        this.updateGroup(groupId, group => ({
            ...group,
            records: group.records.map(record => record.standard.id === standardId ? { ...record, selected } : record),
        }));
    }
    toggleAllCurrentRecords() {
        const group = this.currentGroup();
        if (!group)
            return;
        const selected = !this.allCurrentRecordsSelected();
        this.updateGroup(group.id, current => ({
            ...current,
            records: current.records.map(record => ({ ...record, selected: selected && Boolean(record.suggestedName.trim()) })),
        }));
    }
    normalizeCurrentGroupTypography() {
        const group = this.currentGroup();
        if (!group)
            return;
        let changed = 0;
        this.updateGroup(group.id, current => ({
            ...current,
            records: current.records.map(record => {
                const suggestedName = formatStandardProductName(record.originalName);
                const hasChanged = suggestedName !== record.originalName;
                if (hasChanged)
                    changed++;
                return { ...record, suggestedName, selected: hasChanged, saved: false };
            }),
        }));
        this.toast.show(changed > 0 ? `Đã chọn ${changed} hồ sơ có thay đổi kiểu chữ/ký hiệu.` : 'Nhóm này chưa có thay đổi kiểu chữ.', 'info');
    }
    applyCanonicalToCurrentGroup() {
        const group = this.currentGroup();
        if (!group?.risk.canApplyCanonicalToAll || !group.canonicalName.trim())
            return;
        const canonicalName = formatStandardProductName(group.canonicalName);
        this.updateGroup(group.id, current => ({
            ...current,
            canonicalName,
            canonicalSource: 'manual',
            records: current.records.map(record => ({ ...record, suggestedName: canonicalName, selected: true, saved: false })),
            status: 'ready',
        }));
    }
    async fetchGroupInfo(group) {
        if (group.status === 'loading')
            return;
        this.updateGroup(group.id, current => ({ ...current, status: 'loading', errorMsg: undefined }));
        try {
            const info = await this.pubchemService.getChemicalInfo(group.cas);
            if (!info?.commercialName) {
                this.updateGroup(group.id, current => ({
                    ...current,
                    status: 'review',
                    errorMsg: 'PubChem không tìm thấy tên; dữ liệu sản phẩm hiện tại được giữ nguyên.',
                }));
                this.toast.show(`PubChem không tìm thấy CAS ${group.cas}.`, 'info');
                return;
            }
            const canonicalName = formatStandardProductName(info.commercialName);
            this.updateGroup(group.id, current => ({
                ...current,
                canonicalName,
                canonicalSource: 'pubchem',
                suggestedSynonyms: normalizeChemicalNames([
                    ...parseChemicalNames(current.suggestedSynonyms),
                    ...info.synonyms.slice(0, 8),
                ], [canonicalName, current.cas]).join('\n'),
                status: current.risk.level === 'low' ? 'ready' : 'review',
            }));
            this.toast.show('Đã lấy tên hóa chất chuẩn. Tên sản phẩm chưa bị ghi đè.', 'success');
        }
        catch (error) {
            console.error('PubChem lookup failed', error);
            this.updateGroup(group.id, current => ({ ...current, status: 'error', errorMsg: 'Không thể kết nối PubChem.' }));
            this.toast.show('Không thể kết nối PubChem.', 'error');
        }
    }
    async applyCurrentGroup(goNext) {
        const group = this.currentGroup();
        if (!group)
            return;
        const selected = group.records.filter(record => record.selected && record.suggestedName.trim());
        if (selected.length === 0)
            return;
        const riskWarning = group.risk.level === 'high'
            ? '\nĐây là nhóm rủi ro cao; mỗi hồ sơ sẽ giữ đề xuất tên riêng.'
            : '';
        if (!confirm(`Lưu ${selected.length} hồ sơ trong nhóm CAS ${group.cas}?${riskWarning}\n\nChỉ trường danh pháp và metadata chuẩn hóa được cập nhật.`))
            return;
        this.isProcessing.set(true);
        const pageBeforeSave = this.currentPageIndex();
        this.progressService.start('Đang lưu nhóm CAS', group.cas, selected.length);
        try {
            const batchId = await this.standardService.updateStandardNames(selected.map((record, index) => {
                this.progressService.update(index + 1, record.standard.internal_id || record.standard.id);
                const normalizedName = formatStandardProductName(record.suggestedName);
                const aliases = normalizeChemicalNames([
                    ...parseChemicalNames(group.suggestedSynonyms),
                    group.canonicalName,
                    record.originalName,
                ], [normalizedName, group.cas]);
                return {
                    standardId: record.standard.id,
                    name: normalizedName,
                    chemicalName: serializeChemicalNames(aliases),
                    canonicalName: formatStandardProductName(group.canonicalName),
                    originalName: record.originalName,
                    nameSource: group.canonicalSource === 'pubchem'
                        ? 'pubchem'
                        : (group.canonicalSource === 'manual' ? 'manual' : 'cleanup'),
                    casStatus: 'valid',
                    standardForm: detectStandardForm(normalizedName),
                    normalizationVersion: '2026.07.1',
                };
            }));
            const savedIds = new Set(selected.map(record => record.standard.id));
            this.updateGroup(group.id, current => {
                const records = current.records.map(record => savedIds.has(record.standard.id)
                    ? {
                        ...record,
                        originalName: formatStandardProductName(record.suggestedName),
                        suggestedName: formatStandardProductName(record.suggestedName),
                        selected: false,
                        saved: true,
                    }
                    : record);
                return {
                    ...current,
                    records,
                    status: records.every(record => record.saved) ? 'success' : (current.risk.level === 'low' ? 'ready' : 'review'),
                    errorMsg: undefined,
                };
            });
            await this.loadCleanupHistory();
            this.toast.show(`Đã lưu ${selected.length} hồ sơ trong CAS ${group.cas} · phiên ${batchId}.`, 'success');
            if (goNext) {
                const stillVisible = this.filteredGroups().some(item => item.id === group.id);
                const targetPage = stillVisible ? pageBeforeSave + 1 : pageBeforeSave;
                this.pageIndex.set(Math.min(targetPage, Math.max(0, this.filteredGroups().length - 1)));
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Không thể lưu nhóm CAS.';
            this.updateGroup(group.id, current => ({ ...current, status: 'error', errorMsg: message }));
            this.toast.show(message, 'error');
        }
        finally {
            this.progressService.complete();
            this.isProcessing.set(false);
        }
    }
    onClose() {
        if (this.isProcessing())
            return;
        this.closeModal.emit();
        this.groups.set([]);
        this.casIssues.set([]);
        this.currentStandards = [];
        this.workspace.set('valid');
        this.showHistory.set(false);
        this.clearFilters();
    }
    updateGroup(groupId, updater) {
        this.groups.update(groups => groups.map(group => group.id === groupId ? updater(group) : group));
    }
    updateCasIssue(standardId, updater) {
        this.casIssues.update(issues => issues.map(issue => issue.standard.id === standardId ? updater(issue) : issue));
    }
    static { this.ɵfac = function StandardsDataCleanupModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsDataCleanupModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsDataCleanupModalComponent, selectors: [["app-standards-data-cleanup-modal"]], inputs: { isOpen: [1, "isOpen"], allStandards: [1, "allStandards"] }, outputs: { closeModal: "closeModal" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-[60]", "flex", "items-center", "justify-center", "p-3", "sm:p-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], [1, "relative", "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-2xl", "w-full", "max-w-6xl", "overflow-hidden", "flex", "flex-col", "max-h-[94vh]", "border", "border-slate-200/80", "dark:border-slate-800", "animate-slide-up"], [1, "px-5", "sm:px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-800", "bg-slate-50/80", "dark:bg-slate-800/50", "flex", "justify-between", "items-start", "gap-4", "shrink-0"], [1, "flex", "items-center", "gap-3", "min-w-0"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-100", "dark:bg-indigo-900/40", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-shield-halved"], [1, "min-w-0"], [1, "font-black", "text-slate-800", "dark:text-slate-100", "text-lg"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-0.5"], ["aria-label", "\u0110\u00F3ng", 1, "w-8", "h-8", "rounded-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-slate-400", "hover:text-red-500", "transition", "disabled:opacity-50", "shrink-0", 3, "click", "disabled"], [1, "fa-solid", "fa-times"], [1, "px-5", "sm:px-6", "py-2.5", "bg-indigo-50/60", "dark:bg-indigo-950/30", "border-b", "border-indigo-100/60", "dark:border-indigo-900/30", "flex", "flex-wrap", "items-center", "gap-x-4", "gap-y-2", "text-[11px]", "font-bold", "shrink-0"], [1, "text-slate-700", "dark:text-slate-200"], [1, "fa-solid", "fa-boxes-stacked", "text-indigo-500", "mr-1"], [1, "text-emerald-700", "dark:text-emerald-400", "hover:underline", 3, "click"], [1, "fa-solid", "fa-object-group", "mr-1"], ["title", "M\u1EDF danh s\u00E1ch NA, N/A, CAS inside v\u00E0 nh\u00E3n gi\u1EEF ch\u1ED7", 1, "text-amber-700", "dark:text-amber-400", "hover:underline"], ["title", "M\u1EDF danh s\u00E1ch CAS c\u00F3 d\u1EA5u hi\u1EC7u b\u1ECB chuy\u1EC3n th\u00E0nh ng\u00E0y", 1, "text-red-700", "dark:text-red-400", "hover:underline"], ["title", "M\u1EDF danh s\u00E1ch CAS sai c\u1EA5u tr\u00FAc, checksum ho\u1EB7c c\u00F3 ch\u00FA th\u00EDch", 1, "text-red-700", "dark:text-red-400", "hover:underline"], [1, "text-slate-500", "dark:text-slate-400"], [1, "px-4", "sm:px-6", "py-3", "border-b", "border-slate-100", "dark:border-slate-800", "bg-white", "dark:bg-slate-900", "shrink-0", "space-y-3"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-3"], [1, "relative", "flex-1", "min-w-[240px]", "max-w-md"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "text-xs"], ["type", "text", "placeholder", "T\u00ECm CAS, t\u00EAn, m\u00E3 qu\u1EA3n l\u00FD ho\u1EB7c catalog...", 1, "w-full", "pl-8", "pr-8", "py-2", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "text-xs", "font-semibold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500/40", 3, "ngModelChange", "ngModel"], ["aria-label", "X\u00F3a t\u00ECm ki\u1EBFm", 1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-slate-400", "hover:text-slate-700", "p-1"], [1, "flex", "items-center", "gap-2"], [1, "px-3", "py-2", "bg-amber-50", "dark:bg-amber-950/30", "text-amber-700", "dark:text-amber-300", "border", "border-amber-200", "dark:border-amber-800", "font-bold", "text-xs", "rounded-lg", "hover:bg-amber-100", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-clock-rotate-left", "mr-1"], [1, "px-3", "py-2", "bg-slate-100", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-300", "font-bold", "text-xs", "rounded-lg", "hover:bg-slate-200", "dark:hover:bg-slate-700", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-rotate", "mr-1"], [1, "flex", "items-center", "gap-1", "overflow-x-auto", "pb-0.5", "text-[11px]", "font-bold"], [3, "click"], [1, "absolute", "inset-0", "z-30", "bg-white", "dark:bg-slate-900", "flex", "flex-col"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "bg-slate-50/50", "dark:bg-slate-950/30"], [1, "py-20", "text-center", "text-slate-400"], [1, "py-16", "text-center", "text-slate-400"], [1, "p-4", "sm:p-6", "space-y-4"], [1, "px-4", "sm:px-6", "py-3.5", "border-t", "border-slate-100", "dark:border-slate-800", "bg-white", "dark:bg-slate-900", "flex", "flex-wrap", "justify-between", "gap-3", "items-center", "shrink-0"], ["title", "M\u1EDF danh s\u00E1ch NA, N/A, CAS inside v\u00E0 nh\u00E3n gi\u1EEF ch\u1ED7", 1, "text-amber-700", "dark:text-amber-400", "hover:underline", 3, "click"], [1, "fa-solid", "fa-ban", "mr-1"], ["title", "M\u1EDF danh s\u00E1ch CAS c\u00F3 d\u1EA5u hi\u1EC7u b\u1ECB chuy\u1EC3n th\u00E0nh ng\u00E0y", 1, "text-red-700", "dark:text-red-400", "hover:underline", 3, "click"], [1, "fa-solid", "fa-calendar-xmark", "mr-1"], ["title", "M\u1EDF danh s\u00E1ch CAS sai c\u1EA5u tr\u00FAc, checksum ho\u1EB7c c\u00F3 ch\u00FA th\u00EDch", 1, "text-red-700", "dark:text-red-400", "hover:underline", 3, "click"], [1, "fa-solid", "fa-circle-exclamation", "mr-1"], [1, "fa-solid", "fa-circle-minus", "mr-1"], ["aria-label", "X\u00F3a t\u00ECm ki\u1EBFm", 1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-slate-400", "hover:text-slate-700", "p-1", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "px-5", "sm:px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-800", "bg-amber-50/70", "dark:bg-amber-950/20", "flex", "items-start", "justify-between", "gap-4", "shrink-0"], [1, "fa-solid", "fa-clock-rotate-left", "text-amber-500", "mr-2"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], ["aria-label", "\u0110\u00F3ng l\u1ECBch s\u1EED", 1, "w-8", "h-8", "rounded-full", "border", "border-slate-200", "dark:border-slate-700", "text-slate-400", "hover:text-red-500", "disabled:opacity-50", 3, "click", "disabled"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "p-4", "sm:p-6", "bg-slate-50/60", "dark:bg-slate-950/30"], [1, "space-y-3", "max-w-4xl", "mx-auto"], [1, "px-5", "sm:px-6", "py-3", "border-t", "border-slate-100", "dark:border-slate-800", "bg-white", "dark:bg-slate-900", "flex", "justify-end"], [1, "px-4", "py-2", "rounded-lg", "bg-slate-100", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-300", "text-xs", "font-bold", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-3xl", "mb-3"], [1, "text-xs", "font-bold"], [1, "fa-solid", "fa-clock", "text-4xl", "mb-3", "text-slate-300", "dark:text-slate-700"], [1, "text-sm", "font-bold"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "p-4", "shadow-sm"], [1, "flex", "flex-wrap", "items-start", "justify-between", "gap-3"], [1, "flex", "flex-wrap", "items-center", "gap-2", "mb-1.5"], [1, "font-mono", "text-xs", "font-black", "text-indigo-600", "dark:text-indigo-400"], [1, "px-2", "py-0.5", "rounded-full", "text-[10px]", "font-black", 3, "ngClass"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-[10px]", "text-slate-400", "mt-1", "font-mono"], [1, "px-3", "py-2", "rounded-lg", "text-xs", "font-bold", "bg-amber-600", "hover:bg-amber-700", "text-white", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "mt-3", "border-t", "border-slate-100", "dark:border-slate-800", "pt-2"], [1, "cursor-pointer", "text-[11px]", "font-bold", "text-slate-500", "dark:text-slate-400"], [1, "mt-2", "space-y-2"], [1, "grid", "sm:grid-cols-[100px_1fr_24px_1fr]", "gap-2", "items-start", "text-[11px]", "rounded-lg", "bg-slate-50", "dark:bg-slate-800/60", "p-2.5"], [1, "fa-solid", "fa-spinner", "fa-spin", "mr-1"], [1, "fa-solid", "fa-rotate-left", "mr-1"], [1, "text-slate-600", "dark:text-slate-300"], [1, "text-red-600", "dark:text-red-400", "break-words"], [1, "block", "font-mono", "mt-1"], [1, "fa-solid", "fa-arrow-right", "text-slate-400", "mt-0.5"], [1, "text-emerald-700", "dark:text-emerald-400", "break-words"], [1, "p-4", "sm:p-6", "space-y-4", "max-w-4xl", "mx-auto"], [1, "fa-solid", "fa-clipboard-check", "text-5xl", "mb-3", "text-emerald-400"], [1, "font-bold", "text-sm"], [1, "mt-3", "px-3", "py-1.5", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400", "text-xs", "font-bold", "rounded-lg", 3, "click"], ["aria-label", "Ph\u00E2n trang h\u1ED3 s\u01A1 CAS l\u1ED7i", 1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "p-3", "flex", "items-center", "justify-between", "gap-3", "shadow-sm"], [1, "px-3", "py-2", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "disabled:opacity-40", "hover:bg-slate-50", "dark:hover:bg-slate-800", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-left", "mr-1"], [1, "text-center", "min-w-0"], [1, "text-[10px]", "uppercase", "tracking-wider", "text-slate-400", "font-bold"], [1, "text-sm", "font-black", "text-indigo-600", "dark:text-indigo-400", "truncate"], [1, "fa-solid", "fa-chevron-right", "ml-1"], [1, "h-1.5", "rounded-full", "bg-slate-200", "dark:bg-slate-800", "overflow-hidden"], [1, "h-full", "bg-indigo-500", "transition-all"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-2xl", "shadow-sm", "overflow-hidden"], [1, "p-4", "sm:p-5", "border-b", "border-slate-100", "dark:border-slate-800"], [1, "flex", "flex-wrap", "items-center", "gap-2", "mb-2"], [1, "px-2", "py-1", "rounded", "bg-slate-100", "dark:bg-slate-800", "text-[10px]", "font-black", "text-slate-600", "dark:text-slate-300"], [1, "text-[10px]", "text-slate-400", "font-mono"], [1, "font-black", "text-base", "text-slate-800", "dark:text-slate-100", "break-words"], [1, "p-4", "sm:p-5", "grid", "md:grid-cols-2", "gap-4"], [1, "block", "text-[11px]", "font-black", "text-slate-500", "dark:text-slate-400", "mb-1.5"], [1, "min-h-[42px]", "px-3", "py-2.5", "rounded-lg", "bg-red-50", "dark:bg-red-950/20", "border", "border-red-200", "dark:border-red-900", "text-red-700", "dark:text-red-300", "font-mono", "text-sm", "font-bold", "break-words"], [1, "text-[10px]", "text-red-600", "dark:text-red-400", "mt-1"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"], [1, "block", "text-[11px]", "font-black", "text-slate-600", "dark:text-slate-300", "mb-1.5"], [1, "flex", "gap-2"], ["type", "text", "placeholder", "V\u00ED d\u1EE5: 108-95-2", 1, "flex-1", "min-w-0", "bg-white", "dark:bg-slate-800", "border", "rounded-lg", "p-2.5", "font-mono", "text-sm", "font-black", "text-slate-800", "dark:text-slate-100", "outline-none", "focus:ring-2", "focus:ring-indigo-500/50", 3, "ngModelChange", "ngModel", "ngClass"], ["title", "\u0110\u1ED1i chi\u1EBFu CAS v\u1EDBi PubChem", 1, "px-3", "rounded-lg", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "text-xs", "font-bold", "disabled:opacity-40", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-magnifying-glass"], [1, "mt-1.5", "flex", "items-start", "justify-between", "gap-2"], [1, "text-[10px]", 3, "ngClass"], [1, "fa-solid", "mr-1", 3, "ngClass"], [1, "text-[10px]", "font-bold", "text-indigo-600", "dark:text-indigo-400", "whitespace-nowrap"], [1, "mx-4", "sm:mx-5", "mb-5", "rounded-xl", "border", "p-3", "text-xs", 3, "ngClass"], [1, "text-[10px]", "font-bold", "text-indigo-600", "dark:text-indigo-400", "whitespace-nowrap", 3, "click"], [1, "font-bold", "text-amber-700", "dark:text-amber-300"], [1, "font-black", "text-emerald-700", "dark:text-emerald-300"], [1, "fa-solid", "fa-database", "mr-1"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "fa-solid", "fa-clipboard-check", "text-5xl", "mb-3", "text-slate-300", "dark:text-slate-700"], [1, "text-xs", "mt-1"], [1, "fa-solid", "fa-filter", "text-4xl", "mb-2", "text-slate-300", "dark:text-slate-700"], ["aria-label", "Ph\u00E2n trang nh\u00F3m CAS", 1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "p-3", "flex", "items-center", "justify-between", "gap-3", "shadow-sm"], [1, "text-sm", "font-black", "text-indigo-600", "dark:text-indigo-400", "font-mono", "truncate"], [1, "p-4", "sm:p-5", "border-b", "border-slate-100", "dark:border-slate-800", "flex", "flex-wrap", "items-start", "justify-between", "gap-4"], [1, "px-2.5", "py-1", "rounded-lg", "bg-indigo-50", "dark:bg-indigo-950", "text-indigo-700", "dark:text-indigo-300", "border", "border-indigo-200", "dark:border-indigo-800", "font-mono", "text-xs", "font-black"], [1, "px-2", "py-1", "rounded-full", "text-[10px]", "font-black", 3, "ngClass"], [1, "px-2", "py-1", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "text-[10px]", "font-bold"], [1, "px-2", "py-1", "rounded-full", "bg-emerald-100", "dark:bg-emerald-900/40", "text-emerald-700", "dark:text-emerald-300", "text-[10px]", "font-bold"], [1, "space-y-1", "text-[11px]", "text-slate-600", "dark:text-slate-400"], [1, "px-3", "py-2", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "font-bold", "text-xs", "rounded-lg", "shadow-sm", "disabled:opacity-50", 3, "click", "disabled"], [1, "p-4", "sm:p-5", "grid", "lg:grid-cols-2", "gap-4", "bg-slate-50/60", "dark:bg-slate-950/20", "border-b", "border-slate-100", "dark:border-slate-800"], ["type", "text", "placeholder", "PubChem ho\u1EB7c t\u00EAn \u0111\u00E3 \u0111\u01B0\u1EE3c chuy\u00EAn gia duy\u1EC7t", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-100", "outline-none", "focus:ring-2", "focus:ring-indigo-500/50", 3, "ngModelChange", "ngModel"], [1, "text-[10px]", "text-slate-400", "mt-1"], [1, "flex", "flex-col", "justify-end", "gap-2"], [1, "w-full", "px-3", "py-2.5", "rounded-lg", "text-xs", "font-bold", "border", "transition", "disabled:opacity-45", "disabled:cursor-not-allowed", "bg-indigo-50", "dark:bg-indigo-950/40", "border-indigo-200", "dark:border-indigo-800", "text-indigo-700", "dark:text-indigo-300", "hover:bg-indigo-100", 3, "click", "disabled"], [1, "fa-solid", "fa-arrow-down-wide-short", "mr-1"], [1, "text-[10px]", "text-amber-600", "dark:text-amber-400", "font-semibold"], [1, "border-b", "border-slate-100", "dark:border-slate-800"], [1, "px-4", "sm:px-5", "py-3", "cursor-pointer", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-50", "dark:hover:bg-slate-800/50"], [1, "fa-solid", "fa-tags", "mr-1.5", "text-indigo-500"], [1, "px-4", "sm:px-5", "pb-4"], ["rows", "3", "placeholder", "M\u1ED7i t\u00EAn m\u1ED9t d\u00F2ng; kh\u00F4ng t\u00E1ch d\u1EA5u ph\u1EA9y trong danh ph\u00E1p.", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-xs", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:ring-2", "focus:ring-indigo-500/50", "resize-none", 3, "ngModelChange", "ngModel"], [1, "p-4", "sm:p-5"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-2", "mb-3"], [1, "font-black", "text-sm", "text-slate-800", "dark:text-slate-100"], [1, "text-[10px]", "text-slate-400"], [1, "px-3", "py-1.5", "text-[11px]", "font-bold", "rounded-lg", "bg-slate-100", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-700", 3, "click", "disabled"], [1, "fa-solid", "fa-text-height", "mr-1"], [1, "px-3", "py-1.5", "text-[11px]", "font-bold", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "text-slate-600", "dark:text-slate-300", 3, "click", "disabled"], [1, "space-y-3"], [1, "rounded-xl", "border", "p-3", "sm:p-4", "transition", 3, "ngClass"], [1, "fa-solid", "fa-check-double", "mr-1"], [1, "fa-solid", "fa-circle-info", "mr-1.5", 3, "ngClass"], [1, "fa-solid", "fa-wand-magic-sparkles", "mr-1"], [1, "fa-solid", "fa-lock", "mr-1"], [1, "flex", "items-start", "gap-3"], ["type", "checkbox", 1, "w-4", "h-4", "accent-indigo-600", "mt-1", "shrink-0", 3, "ngModelChange", "ngModel"], [1, "flex-1", "min-w-0", "grid", "lg:grid-cols-[minmax(190px,0.8fr)_minmax(260px,1.2fr)]", "gap-3"], [1, "flex", "flex-wrap", "items-center", "gap-1.5", "mb-1.5"], [1, "px-2", "py-0.5", "rounded", "bg-slate-100", "dark:bg-slate-800", "text-[10px]", "font-black", "text-slate-600", "dark:text-slate-300"], [1, "text-[10px]", "text-emerald-600", "dark:text-emerald-400", "font-bold"], [1, "text-[11px]", "text-slate-400", "mb-0.5"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "break-words"], [1, "mt-2", "flex", "flex-wrap", "gap-2", "text-[10px]", "text-slate-500", "dark:text-slate-400"], ["type", "text", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-100", "outline-none", "focus:ring-2", "focus:ring-indigo-500/50", 3, "ngModelChange", "ngModel"], [1, "text-[10px]", "mt-1", "text-indigo-600", "dark:text-indigo-400"], [1, "fa-solid", "fa-check", "mr-0.5"], [1, "fa-solid", "fa-arrow-right", "mr-1"], [1, "text-[11px]", "font-semibold", "text-slate-500", "dark:text-slate-400"], [1, "fa-solid", "fa-shield-halved", "text-amber-500", "mr-1"], [1, "text-indigo-600", "dark:text-indigo-400"], [1, "px-4", "py-2", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-100", "dark:hover:bg-slate-800", "rounded-lg", "font-bold", "text-xs", "disabled:opacity-50", 3, "click", "disabled"], [1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-lg", "font-bold", "text-xs", "shadow-sm", "disabled:opacity-45", "flex", "items-center", "gap-1.5", 3, "click", "disabled"], [1, "px-4", "py-2", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "rounded-lg", "font-bold", "text-xs", "shadow-sm", "disabled:opacity-45", "hidden", "sm:flex", "items-center", "gap-1.5", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-right"], [1, "fa-solid", "fa-floppy-disk"]], template: function StandardsDataCleanupModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsDataCleanupModalComponent_Conditional_0_Template, 56, 28, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen() ? 0 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.DefaultValueAccessor, i2.CheckboxControlValueAccessor, i2.NgControlStatus, i2.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsDataCleanupModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-data-cleanup-modal',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
        <div class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-200/80 dark:border-slate-800 animate-slide-up">
          <header class="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex justify-between items-start gap-4 shrink-0">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div class="min-w-0">
                <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg">Chuẩn Hóa Danh Pháp & CAS Chất Chuẩn</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mỗi trang chỉ hiển thị một nhóm CAS hoặc một hồ sơ lỗi để giảm nguy cơ điều chỉnh nhầm.</p>
              </div>
            </div>
            <button (click)="onClose()" [disabled]="isProcessing()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 transition disabled:opacity-50 shrink-0" aria-label="Đóng">
              <i class="fa-solid fa-times"></i>
            </button>
          </header>

          <section class="px-5 sm:px-6 py-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100/60 dark:border-indigo-900/30 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold shrink-0">
            <span class="text-slate-700 dark:text-slate-200"><i class="fa-solid fa-boxes-stacked text-indigo-500 mr-1"></i>{{totalStandardsCount()}} hồ sơ</span>
            <button (click)="setWorkspace('valid')" class="text-emerald-700 dark:text-emerald-400 hover:underline"><i class="fa-solid fa-object-group mr-1"></i>{{groups().length}} CAS hợp lệ</button>
            @if (placeholderCasCount() > 0) {
              <button (click)="setWorkspace('placeholder')" class="text-amber-700 dark:text-amber-400 hover:underline" title="Mở danh sách NA, N/A, CAS inside và nhãn giữ chỗ"><i class="fa-solid fa-ban mr-1"></i>{{placeholderCasCount()}} nhãn CAS giữ chỗ</button>
            }
            @if (dateCorruptedCasCount() > 0) {
              <button (click)="setWorkspace('date_corrupted')" class="text-red-700 dark:text-red-400 hover:underline" title="Mở danh sách CAS có dấu hiệu bị chuyển thành ngày"><i class="fa-solid fa-calendar-xmark mr-1"></i>{{dateCorruptedCasCount()}} CAS dạng ngày</button>
            }
            @if (invalidCasCount() > 0) {
              <button (click)="setWorkspace('invalid')" class="text-red-700 dark:text-red-400 hover:underline" title="Mở danh sách CAS sai cấu trúc, checksum hoặc có chú thích"><i class="fa-solid fa-circle-exclamation mr-1"></i>{{invalidCasCount()}} CAS lỗi khác</button>
            }
            @if (missingCasCount() > 0) {
              <span class="text-slate-500 dark:text-slate-400"><i class="fa-solid fa-circle-minus mr-1"></i>{{missingCasCount()}} chưa có CAS</span>
            }
          </section>

          <section class="px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="relative flex-1 min-w-[240px] max-w-md">
                <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input type="text" [ngModel]="searchQuery()" (ngModelChange)="setSearchQuery($event)" placeholder="Tìm CAS, tên, mã quản lý hoặc catalog..." class="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/40">
                @if (searchQuery()) {
                  <button (click)="setSearchQuery('')" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1" aria-label="Xóa tìm kiếm"><i class="fa-solid fa-xmark"></i></button>
                }
              </div>
              <div class="flex items-center gap-2">
                <button (click)="openHistory()" [disabled]="isProcessing()" class="px-3 py-2 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs rounded-lg hover:bg-amber-100 transition disabled:opacity-50">
                  <i class="fa-solid fa-clock-rotate-left mr-1"></i>Hoàn tác ({{activeBatchCount()}})
                </button>
                <button (click)="scanData()" [disabled]="isProcessing()" class="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50">
                  <i class="fa-solid fa-rotate mr-1"></i>Quét lại
                </button>
              </div>
            </div>
            <div class="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] font-bold">
              <button (click)="setWorkspace('valid')" [class]="workspaceClass('valid')">Danh pháp CAS hợp lệ ({{groups().length}})</button>
              <button (click)="setWorkspace('placeholder')" [class]="workspaceClass('placeholder')">Nhãn giữ chỗ ({{placeholderCasCount()}})</button>
              <button (click)="setWorkspace('date_corrupted')" [class]="workspaceClass('date_corrupted')">CAS dạng ngày ({{dateCorruptedCasCount()}})</button>
              <button (click)="setWorkspace('invalid')" [class]="workspaceClass('invalid')">CAS lỗi khác ({{invalidCasCount()}})</button>
            </div>
            @if (workspace() === 'valid') {
              <div class="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] font-bold">
                <button (click)="setFilter('all')" [class]="filterClass('all')">Tất cả ({{groups().length}})</button>
                <button (click)="setFilter('safe')" [class]="filterClass('safe')">An toàn ({{safeCount()}})</button>
                <button (click)="setFilter('review')" [class]="filterClass('review')">Cần duyệt ({{mediumRiskCount()}})</button>
                <button (click)="setFilter('blocked')" [class]="filterClass('blocked')">Rủi ro cao ({{highRiskCount()}})</button>
                <button (click)="setFilter('success')" [class]="filterClass('success')">Đã lưu ({{successCount()}})</button>
              </div>
            }
          </section>

          @if (showHistory()) {
            <section class="absolute inset-0 z-30 bg-white dark:bg-slate-900 flex flex-col">
              <header class="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-amber-50/70 dark:bg-amber-950/20 flex items-start justify-between gap-4 shrink-0">
                <div>
                  <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg"><i class="fa-solid fa-clock-rotate-left text-amber-500 mr-2"></i>Lịch Sử Chuẩn Hóa & Hoàn Tác</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Mỗi lần lưu là một phiên độc lập. Hoàn tác bị chặn nếu hồ sơ đã được sửa sau phiên đó.</p>
                </div>
                <button (click)="showHistory.set(false)" [disabled]="undoingBatchId() !== null" class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 disabled:opacity-50" aria-label="Đóng lịch sử"><i class="fa-solid fa-times"></i></button>
              </header>
              <div class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-950/30">
                @if (isLoadingHistory()) {
                  <div class="py-20 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl mb-3"></i><p class="text-xs font-bold">Đang tải lịch sử...</p></div>
                } @else if (cleanupHistory().length === 0) {
                  <div class="py-20 text-center text-slate-400"><i class="fa-solid fa-clock text-4xl mb-3 text-slate-300 dark:text-slate-700"></i><p class="text-sm font-bold">Chưa có phiên chuẩn hóa nào.</p></div>
                } @else {
                  <div class="space-y-3 max-w-4xl mx-auto">
                    @for (batch of cleanupHistory(); track batch.id) {
                      <article class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                          <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2 mb-1.5">
                              <span class="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">CAS {{batch.cas}}</span>
                              <span class="px-2 py-0.5 rounded-full text-[10px] font-black" [ngClass]="batch.status === 'APPLIED' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">{{batch.status === 'APPLIED' ? 'Có thể hoàn tác' : 'Đã hoàn tác'}}</span>
                            </div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{batch.recordCount}} hồ sơ · {{batch.createdByName || 'Người dùng'}} · {{formatBatchDate(batch.createdAt)}}</p>
                            <p class="text-[10px] text-slate-400 mt-1 font-mono">Phiên {{batch.id}}</p>
                          </div>
                          <button (click)="undoBatch(batch)" [disabled]="batch.status !== 'APPLIED' || undoingBatchId() !== null" class="px-3 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 disabled:cursor-not-allowed">
                            @if (undoingBatchId() === batch.id) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang hoàn tác }
                            @else { <i class="fa-solid fa-rotate-left mr-1"></i>Hoàn tác phiên }
                          </button>
                        </div>
                        <details class="mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
                          <summary class="cursor-pointer text-[11px] font-bold text-slate-500 dark:text-slate-400">Xem thay đổi trước/sau</summary>
                          <div class="mt-2 space-y-2">
                            @for (change of batch.changes; track change.standardId) {
                              <div class="grid sm:grid-cols-[100px_1fr_24px_1fr] gap-2 items-start text-[11px] rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2.5">
                                <strong class="text-slate-600 dark:text-slate-300">{{change.internalId || change.standardId}}</strong>
                                <span class="text-red-600 dark:text-red-400 break-words">
                                  {{change.before.name}}
                                  @if (change.before.cas_number !== change.after.cas_number) { <small class="block font-mono mt-1">CAS {{change.before.cas_number || 'Trống'}}</small> }
                                </span>
                                <i class="fa-solid fa-arrow-right text-slate-400 mt-0.5"></i>
                                <span class="text-emerald-700 dark:text-emerald-400 break-words">
                                  {{change.after.name}}
                                  @if (change.before.cas_number !== change.after.cas_number) { <small class="block font-mono mt-1">CAS {{change.after.cas_number || 'Trống'}}</small> }
                                </span>
                              </div>
                            }
                          </div>
                        </details>
                      </article>
                    }
                  </div>
                }
              </div>
              <footer class="px-5 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
                <button (click)="showHistory.set(false)" [disabled]="undoingBatchId() !== null" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-50">Quay lại chuẩn hóa</button>
              </footer>
            </section>
          }

          <main class="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-950/30">
            @if (workspace() !== 'valid') {
              @if (!currentCasIssue()) {
                <div class="py-20 text-center text-slate-400">
                  <i class="fa-solid fa-clipboard-check text-5xl mb-3 text-emerald-400"></i>
                  <p class="font-bold text-sm">Không còn hồ sơ trong nhóm {{workspaceLabel()}}.</p>
                  <button (click)="setWorkspace('valid')" class="mt-3 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg">Quay lại CAS hợp lệ</button>
                </div>
              } @else {
                @let issue = currentCasIssue()!;
                @let assessment = currentCasAssessment();
                <div class="p-4 sm:p-6 space-y-4 max-w-4xl mx-auto">
                  <nav class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm" aria-label="Phân trang hồ sơ CAS lỗi">
                    <button (click)="previousPage()" [disabled]="currentPageIndex() === 0 || isProcessing()" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <i class="fa-solid fa-chevron-left mr-1"></i>Hồ sơ trước
                    </button>
                    <div class="text-center min-w-0">
                      <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{{workspaceLabel()}} · {{currentPageIndex() + 1}} / {{filteredCasIssues().length}}</div>
                      <div class="text-sm font-black text-indigo-600 dark:text-indigo-400 truncate">{{issue.standard.internal_id || issue.standard.id}}</div>
                    </div>
                    <button (click)="nextPage()" [disabled]="currentPageIndex() >= filteredCasIssues().length - 1 || isProcessing()" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">
                      Hồ sơ sau<i class="fa-solid fa-chevron-right ml-1"></i>
                    </button>
                  </nav>
                  <div class="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div class="h-full bg-indigo-500 transition-all" [style.width.%]="pageProgress()"></div>
                  </div>

                  <section class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
                      <div class="flex flex-wrap items-center gap-2 mb-2">
                        <span class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300">{{issue.standard.internal_id || issue.standard.id}}</span>
                        @if (issue.standard.product_code) { <span class="text-[10px] text-slate-400 font-mono">Catalog {{issue.standard.product_code}}</span> }
                        @if (issue.standard.lot_number) { <span class="text-[10px] text-slate-400 font-mono">Lot {{issue.standard.lot_number}}</span> }
                      </div>
                      <h4 class="font-black text-base text-slate-800 dark:text-slate-100 break-words">{{issue.standard.name}}</h4>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{issueGuidance(issue.kind)}}</p>
                    </div>

                    <div class="p-4 sm:p-5 grid md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-1.5">Dữ liệu CAS hiện tại</label>
                        <div class="min-h-[42px] px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-mono text-sm font-bold break-words">{{issue.originalCas || 'Trống'}}</div>
                        <p class="text-[10px] text-red-600 dark:text-red-400 mt-1"><i class="fa-solid fa-triangle-exclamation mr-1"></i>{{issue.assessment.reason}}</p>
                      </div>
                      <div>
                        <label class="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1.5">CAS điều chỉnh</label>
                        <div class="flex gap-2">
                          <input type="text" [ngModel]="issue.suggestedCas" (ngModelChange)="updateCasSuggestion($event)" placeholder="Ví dụ: 108-95-2" class="flex-1 min-w-0 bg-white dark:bg-slate-800 border rounded-lg p-2.5 font-mono text-sm font-black text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50" [ngClass]="assessment.quality === 'valid' ? 'border-emerald-400 dark:border-emerald-700' : 'border-slate-300 dark:border-slate-700'">
                          <button (click)="fetchCurrentCasInfo()" [disabled]="assessment.quality !== 'valid' || issue.lookupStatus === 'loading' || isProcessing()" class="px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-40" title="Đối chiếu CAS với PubChem">
                            @if (issue.lookupStatus === 'loading') { <i class="fa-solid fa-spinner fa-spin"></i> }
                            @else { <i class="fa-solid fa-magnifying-glass"></i> }
                          </button>
                        </div>
                        <div class="mt-1.5 flex items-start justify-between gap-2">
                          <p class="text-[10px]" [ngClass]="assessment.quality === 'valid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                            <i class="fa-solid mr-1" [ngClass]="assessment.quality === 'valid' ? 'fa-circle-check' : 'fa-circle-info'"></i>{{assessment.reason}}
                          </p>
                          @if (assessment.normalizedCas && assessment.normalizedCas !== issue.suggestedCas.trim()) {
                            <button (click)="useNormalizedCas()" class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">Dùng {{assessment.normalizedCas}}</button>
                          }
                        </div>
                      </div>
                    </div>

                    @if (issue.lookupStatus !== 'idle') {
                      <div class="mx-4 sm:mx-5 mb-5 rounded-xl border p-3 text-xs" [ngClass]="issue.lookupStatus === 'found' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'">
                        @if (issue.lookupStatus === 'found') {
                          <p class="font-black text-emerald-700 dark:text-emerald-300"><i class="fa-solid fa-database mr-1"></i>PubChem: {{issue.lookupName}}</p>
                          <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Hãy so sánh với tên sản phẩm trước khi lưu; kết quả này không tự đổi tên chất chuẩn.</p>
                        } @else if (issue.lookupStatus === 'not_found') {
                          <p class="font-bold text-amber-700 dark:text-amber-300">PubChem không tìm thấy CAS này. Kiểm tra lại CoA trước khi lưu.</p>
                        } @else if (issue.lookupStatus === 'error') {
                          <p class="font-bold text-amber-700 dark:text-amber-300">Không thể kết nối PubChem. CAS vẫn phải vượt checksum để được lưu.</p>
                        }
                      </div>
                    }
                  </section>
                </div>
              }
            } @else if (groups().length === 0) {
              <div class="py-20 text-center text-slate-400">
                <i class="fa-solid fa-clipboard-check text-5xl mb-3 text-slate-300 dark:text-slate-700"></i>
                <p class="font-bold text-sm">Chưa có hồ sơ với số CAS hợp lệ.</p>
                <p class="text-xs mt-1">Các nhãn giữ chỗ và CAS lỗi đã được chặn khỏi quy trình chuẩn hóa.</p>
              </div>
            } @else if (!currentGroup()) {
              <div class="py-16 text-center text-slate-400">
                <i class="fa-solid fa-filter text-4xl mb-2 text-slate-300 dark:text-slate-700"></i>
                <p class="font-bold text-sm">Không có nhóm CAS phù hợp bộ lọc.</p>
                <button (click)="clearFilters()" class="mt-3 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg">Xóa bộ lọc</button>
              </div>
            } @else {
              @let group = currentGroup()!;
              <div class="p-4 sm:p-6 space-y-4">
                <nav class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm" aria-label="Phân trang nhóm CAS">
                  <button (click)="previousPage()" [disabled]="currentPageIndex() === 0 || isProcessing()" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <i class="fa-solid fa-chevron-left mr-1"></i>Nhóm trước
                  </button>
                  <div class="text-center min-w-0">
                    <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Nhóm {{currentPageIndex() + 1}} / {{filteredGroups().length}}</div>
                    <div class="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono truncate">CAS {{group.cas}}</div>
                  </div>
                  <button (click)="nextPage()" [disabled]="currentPageIndex() >= filteredGroups().length - 1 || isProcessing()" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Nhóm sau<i class="fa-solid fa-chevron-right ml-1"></i>
                  </button>
                </nav>
                <div class="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div class="h-full bg-indigo-500 transition-all" [style.width.%]="pageProgress()"></div>
                </div>

                <section class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                  <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-start justify-between gap-4">
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2 mb-2">
                        <span class="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono text-xs font-black">{{group.cas}}</span>
                        <span class="px-2 py-1 rounded-full text-[10px] font-black" [ngClass]="riskBadgeClass(group.risk.level)">{{riskLabel(group.risk.level)}}</span>
                        <span class="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">{{group.records.length}} hồ sơ</span>
                        @if (group.status === 'success') {
                          <span class="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold"><i class="fa-solid fa-check-double mr-1"></i>Đã lưu toàn nhóm</span>
                        }
                      </div>
                      <ul class="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                        @for (reason of group.risk.reasons; track reason) {
                          <li><i class="fa-solid fa-circle-info mr-1.5" [ngClass]="riskTextClass(group.risk.level)"></i>{{reason}}</li>
                        }
                      </ul>
                    </div>
                    <button (click)="fetchGroupInfo(group)" [disabled]="group.status === 'loading' || isProcessing()" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm disabled:opacity-50">
                      @if (group.status === 'loading') { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang tra cứu }
                      @else { <i class="fa-solid fa-wand-magic-sparkles mr-1"></i>Tra PubChem nhóm này }
                    </button>
                  </div>

                  <div class="p-4 sm:p-5 grid lg:grid-cols-2 gap-4 bg-slate-50/60 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <label class="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1.5">Tên hóa chất chuẩn hóa</label>
                      <input type="text" [ngModel]="group.canonicalName" (ngModelChange)="updateCanonicalName(group.id, $event)" placeholder="PubChem hoặc tên đã được chuyên gia duyệt" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50">
                      <p class="text-[10px] text-slate-400 mt-1">Trường này mô tả hóa chất; không thay thế nồng độ, dung môi hay dạng sản phẩm.</p>
                    </div>
                    <div class="flex flex-col justify-end gap-2">
                      <button (click)="applyCanonicalToCurrentGroup()" [disabled]="!group.risk.canApplyCanonicalToAll || !group.canonicalName.trim() || isProcessing()" class="w-full px-3 py-2.5 rounded-lg text-xs font-bold border transition disabled:opacity-45 disabled:cursor-not-allowed bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100">
                        <i class="fa-solid fa-arrow-down-wide-short mr-1"></i>Áp dụng tên chuẩn cho toàn nhóm an toàn
                      </button>
                      @if (!group.risk.canApplyCanonicalToAll) {
                        <p class="text-[10px] text-amber-600 dark:text-amber-400 font-semibold"><i class="fa-solid fa-lock mr-1"></i>Đã khóa áp dụng một tên chung vì nhóm có nguy cơ mất thông tin sản phẩm.</p>
                      }
                    </div>
                  </div>

                  <details class="border-b border-slate-100 dark:border-slate-800">
                    <summary class="px-4 sm:px-5 py-3 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <i class="fa-solid fa-tags mr-1.5 text-indigo-500"></i>Tên đồng nghĩa và tên tìm kiếm
                    </summary>
                    <div class="px-4 sm:px-5 pb-4">
                      <textarea [ngModel]="group.suggestedSynonyms" (ngModelChange)="updateSuggestedSynonyms(group.id, $event)" rows="3" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" placeholder="Mỗi tên một dòng; không tách dấu phẩy trong danh pháp."></textarea>
                    </div>
                  </details>

                  <div class="p-4 sm:p-5">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 class="font-black text-sm text-slate-800 dark:text-slate-100">Duyệt từng hồ sơ trong nhóm</h4>
                        <p class="text-[10px] text-slate-400">Chỉ các hồ sơ được đánh dấu mới được lưu.</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <button (click)="normalizeCurrentGroupTypography()" [disabled]="isProcessing()" class="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"><i class="fa-solid fa-text-height mr-1"></i>Chuẩn hóa kiểu chữ</button>
                        <button (click)="toggleAllCurrentRecords()" [disabled]="isProcessing()" class="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{{allCurrentRecordsSelected() ? 'Bỏ chọn nhóm' : 'Chọn hồ sơ nhóm này'}}</button>
                      </div>
                    </div>

                    <div class="space-y-3">
                      @for (record of group.records; track record.standard.id) {
                        <article class="rounded-xl border p-3 sm:p-4 transition" [ngClass]="record.selected ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/15' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'">
                          <div class="flex items-start gap-3">
                            <input type="checkbox" [ngModel]="record.selected" (ngModelChange)="toggleRecord(group.id, record.standard.id, $event)" class="w-4 h-4 accent-indigo-600 mt-1 shrink-0" [attr.aria-label]="'Chọn ' + record.originalName">
                            <div class="flex-1 min-w-0 grid lg:grid-cols-[minmax(190px,0.8fr)_minmax(260px,1.2fr)] gap-3">
                              <div class="min-w-0">
                                <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                                  <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300">{{record.standard.internal_id || record.standard.id}}</span>
                                  @if (record.standard.product_code) { <span class="text-[10px] text-slate-400 font-mono">{{record.standard.product_code}}</span> }
                                  @if (record.saved) { <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold"><i class="fa-solid fa-check mr-0.5"></i>Đã lưu</span> }
                                </div>
                                <p class="text-[11px] text-slate-400 mb-0.5">Tên hiện tại</p>
                                <p class="text-xs font-bold text-slate-700 dark:text-slate-200 break-words">{{record.originalName}}</p>
                                <div class="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                  <span><strong>Đơn vị:</strong> {{record.standard.unit || '—'}}</span>
                                  <span><strong>Quy cách:</strong> {{record.standard.pack_size || '—'}}</span>
                                  <span><strong>Dạng:</strong> {{formLabel(record.originalName)}}</span>
                                </div>
                              </div>
                              <div>
                                <label class="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1.5">Tên sản phẩm sau chuẩn hóa</label>
                                <input type="text" [ngModel]="record.suggestedName" (ngModelChange)="updateRecordName(group.id, record.standard.id, $event)" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50" [class.border-amber-400]="!record.suggestedName.trim()">
                                @if (record.suggestedName.trim() !== record.originalName.trim()) {
                                  <p class="text-[10px] mt-1 text-indigo-600 dark:text-indigo-400"><i class="fa-solid fa-arrow-right mr-1"></i>Có thay đổi; kiểm tra nồng độ, dung môi và dạng chất trước khi chọn.</p>
                                }
                              </div>
                            </div>
                          </div>
                        </article>
                      }
                    </div>
                  </div>
                </section>
              </div>
            }
          </main>

          <footer class="px-4 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap justify-between gap-3 items-center shrink-0">
            @if (workspace() === 'valid') {
              <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <i class="fa-solid fa-shield-halved text-amber-500 mr-1"></i>Chỉ lưu nhóm CAS đang hiển thị · Đã chọn <strong class="text-indigo-600 dark:text-indigo-400">{{currentSelectedCount()}}</strong> hồ sơ
              </div>
              <div class="flex items-center gap-2">
                <button (click)="onClose()" [disabled]="isProcessing()" class="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-xs disabled:opacity-50">Đóng</button>
                <button (click)="applyCurrentGroup(false)" [disabled]="currentSelectedCount() === 0 || isProcessing()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm disabled:opacity-45 flex items-center gap-1.5">
                  @if (isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i>Đang lưu }
                  @else { <i class="fa-solid fa-floppy-disk"></i>Lưu nhóm hiện tại }
                </button>
                <button (click)="applyCurrentGroup(true)" [disabled]="currentSelectedCount() === 0 || isProcessing()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm disabled:opacity-45 hidden sm:flex items-center gap-1.5">
                  Lưu & nhóm sau<i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            } @else {
              <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <i class="fa-solid fa-shield-halved text-amber-500 mr-1"></i>Chỉ lưu một hồ sơ · CAS phải đúng cấu trúc và checksum
              </div>
              <div class="flex items-center gap-2">
                <button (click)="onClose()" [disabled]="isProcessing()" class="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-xs disabled:opacity-50">Đóng</button>
                <button (click)="applyCurrentCas(false)" [disabled]="!canSaveCurrentCas() || isProcessing()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm disabled:opacity-45 flex items-center gap-1.5">
                  @if (isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i>Đang lưu }
                  @else { <i class="fa-solid fa-floppy-disk"></i>Lưu CAS điều chỉnh }
                </button>
                <button (click)="applyCurrentCas(true)" [disabled]="!canSaveCurrentCas() || isProcessing()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm disabled:opacity-45 hidden sm:flex items-center gap-1.5">
                  Lưu & hồ sơ sau<i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            }
          </footer>
        </div>
      </div>
    }
  `,
            }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsDataCleanupModalComponent, { className: "StandardsDataCleanupModalComponent", filePath: "src/app/features/standards/components/standards-data-cleanup-modal.component.ts", lineNumber: 443 }); })();
//# sourceMappingURL=standards-data-cleanup-modal.component.js.map