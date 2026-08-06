import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = a0 => ({ "bg-red-50/50 dark:bg-red-900/10": a0 });
const _forTrack0 = ($index, $item) => $item.std.id;
const _forTrack1 = ($index, $item) => $item.id;
function StandardsBulkCoaModalComponent_Conditional_0_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 32);
    i0.ɵɵlistener("click", function StandardsBulkCoaModalComponent_Conditional_0_Conditional_10_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.cancel.emit()); });
    i0.ɵɵelement(1, "i", 33);
    i0.ɵɵelementEnd();
} }
function StandardsBulkCoaModalComponent_Conditional_0_Conditional_28_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 40);
    i0.ɵɵelement(1, "i", 41);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" C\u00F3 ", ctx_r1.errorCount(), " file t\u1EA3i l\u1ED7i. ");
} }
function StandardsBulkCoaModalComponent_Conditional_0_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19)(1, "div", 34)(2, "span", 35);
    i0.ɵɵtext(3, "\u0110ang t\u1EA3i l\u00EAn Drive...");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 36);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 37)(7, "div", 38);
    i0.ɵɵelement(8, "div", 39);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(9, StandardsBulkCoaModalComponent_Conditional_0_Conditional_28_Conditional_9_Template, 3, 1, "div", 40);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r1.successCount(), " / ", ctx_r1.itemsToUpload(), "");
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ctx_r1.successCount() / (ctx_r1.itemsToUpload() || 1) * 100, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.errorCount() > 0 ? 9 : -1);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_For_8_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 53);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const seg_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(seg_r3.text);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_For_8_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const seg_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(seg_r3.text);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_For_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsBulkCoaModalComponent_Conditional_0_For_43_For_8_Conditional_0_Template, 2, 1, "span", 53)(1, StandardsBulkCoaModalComponent_Conditional_0_For_43_For_8_Conditional_1_Template, 2, 1, "span");
} if (rf & 2) {
    const seg_r3 = ctx.$implicit;
    i0.ɵɵconditional(seg_r3.isMatch ? 0 : 1);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 47);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", (item_r4.file.size / 1024).toFixed(1), " KB");
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_3_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 58);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const s_r6 = ctx.$implicit;
    i0.ɵɵproperty("value", s_r6.std.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate4(" [", s_r6.score, " \u0111i\u1EC3m] ", s_r6.std.name, " (LOT: ", s_r6.std.lot_number || "N/A", ") - ", s_r6.std.product_code || "No Code", " ");
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_3_For_1_Template, 2, 5, "option", 58, _forTrack0);
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵrepeater(item_r4.suggestedStandards);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_4_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 58);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const std_r7 = ctx.$implicit;
    i0.ɵɵproperty("value", std_r7.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3(" ", std_r7.name, " (LOT: ", std_r7.lot_number || "N/A", ") - ", std_r7.product_code || "No Code", " ");
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_4_For_1_Template, 2, 4, "option", 58, _forTrack1);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵrepeater(ctx_r1.allStandards);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_5_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 61);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext(3).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", item_r4.matchScore, "\u0111");
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 56)(1, "span", 59);
    i0.ɵɵelement(2, "i", 60);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_5_Conditional_4_Template, 2, 1, "span", 61);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" \u0110\u00E3 ch\u1ECDn: ", item_r4.matchedStandard.name, "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r4.matchScore !== undefined ? 4 : -1);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 57);
    i0.ɵɵelement(1, "i", 41);
    i0.ɵɵtext(2, " S\u1EBD b\u1ECB b\u1ECF qua khi T\u1EA3i l\u00EAn ");
    i0.ɵɵelementEnd();
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "select", 54);
    i0.ɵɵlistener("ngModelChange", function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Template_select_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r5); const item_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onManualMatchChange(item_r4, $event)); });
    i0.ɵɵelementStart(1, "option", 55);
    i0.ɵɵtext(2, "-- [B\u1ECF qua] Kh\u00F4ng nh\u1EADn di\u1EC7n \u0111\u01B0\u1EE3c --");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_3_Template, 2, 0)(4, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_4_Template, 2, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_5_Template, 5, 2, "div", 56)(6, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Conditional_6_Template, 3, 0, "div", 57);
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("ngModel", (item_r4.matchedStandard == null ? null : item_r4.matchedStandard.id) || "")("ngClass", item_r4.matchedStandard ? "border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 focus:border-emerald-500" : "border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 focus:border-amber-500");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(item_r4.suggestedStandards ? 3 : 4);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r4.matchedStandard ? 5 : 6);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_12_Conditional_0_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 65);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext(3).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", item_r4.matchScore, "\u0111");
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_12_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 62)(1, "span", 64);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_12_Conditional_0_Conditional_3_Template, 2, 1, "span", 65);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", item_r4.matchedStandard.name, " (LOT: ", item_r4.matchedStandard.lot_number || "N/A", ")");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r4.matchScore !== undefined ? 3 : -1);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_12_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 63);
    i0.ɵɵtext(1, "\u0110\u00E3 b\u1ECF qua");
    i0.ɵɵelementEnd();
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_12_Conditional_0_Template, 4, 3, "div", 62)(1, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_12_Conditional_1_Template, 2, 0, "span", 63);
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵconditional(item_r4.matchedStandard ? 0 : 1);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 49);
    i0.ɵɵtext(1, "Ch\u1EDD x\u1EED l\u00FD");
    i0.ɵɵelementEnd();
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 50);
    i0.ɵɵelement(1, "i", 66);
    i0.ɵɵtext(2, " \u0110ang t\u1EA3i ");
    i0.ɵɵelementEnd();
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 51);
    i0.ɵɵelement(1, "i", 60);
    i0.ɵɵtext(2, " Ho\u00E0n t\u1EA5t");
    i0.ɵɵelementEnd();
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 52);
    i0.ɵɵelement(1, "i", 67);
    i0.ɵɵtext(2, " L\u1ED7i");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("title", item_r4.uploadError);
} }
function StandardsBulkCoaModalComponent_Conditional_0_For_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 27)(1, "td", 42);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 43)(4, "div", 44);
    i0.ɵɵelement(5, "i", 45);
    i0.ɵɵelementStart(6, "span", 46);
    i0.ɵɵrepeaterCreate(7, StandardsBulkCoaModalComponent_Conditional_0_For_43_For_8_Template, 2, 1, null, null, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(9, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_9_Template, 2, 1, "div", 47);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td", 43);
    i0.ɵɵtemplate(11, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_11_Template, 7, 4)(12, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_12_Template, 2, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "td", 48);
    i0.ɵɵtemplate(14, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_14_Template, 2, 0, "span", 49)(15, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_15_Template, 3, 0, "span", 50)(16, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_16_Template, 3, 0, "span", 51)(17, StandardsBulkCoaModalComponent_Conditional_0_For_43_Conditional_17_Template, 3, 1, "span", 52);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const $index_r8 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(7, _c0, !item_r4.matchedStandard));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate($index_r8 + 1);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", ctx_r1.getFileIcon(item_r4.fileName));
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", item_r4.fileName);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.getHighlightedFilenameSegments(item_r4.fileName, item_r4));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r4.file.size ? 9 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!ctx_r1.isUploading ? 11 : 12);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(item_r4.status === "pending" ? 14 : item_r4.status === "uploading" ? 15 : item_r4.status === "success" ? 16 : item_r4.status === "error" ? 17 : -1);
} }
function StandardsBulkCoaModalComponent_Conditional_0_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 68);
    i0.ɵɵtext(2, "Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u.");
    i0.ɵɵelementEnd()();
} }
function StandardsBulkCoaModalComponent_Conditional_0_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 69);
    i0.ɵɵlistener("click", function StandardsBulkCoaModalComponent_Conditional_0_Conditional_49_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.cancel.emit()); });
    i0.ɵɵtext(1, " \u0110\u00F3ng ");
    i0.ɵɵelementEnd();
} }
function StandardsBulkCoaModalComponent_Conditional_0_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 70);
    i0.ɵɵlistener("click", function StandardsBulkCoaModalComponent_Conditional_0_Conditional_50_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.cancel.emit()); });
    i0.ɵɵtext(1, " H\u1EE7y B\u1ECF Thao T\u00E1c ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 71);
    i0.ɵɵlistener("click", function StandardsBulkCoaModalComponent_Conditional_0_Conditional_50_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onConfirm()); });
    i0.ɵɵelement(3, "i", 72);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.isUploading);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.isUploading || ctx_r1.itemsToUpload() === 0);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" B\u1EAFt \u0111\u1EA7u T\u1EA3i l\u00EAn (", ctx_r1.itemsToUpload(), ") ");
} }
function StandardsBulkCoaModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3)(5, "div", 4);
    i0.ɵɵelement(6, "i", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(7, " Tr\u00ECnh Gh\u00E9p N\u1ED1i CoA H\u00E0ng Lo\u1EA1t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 6);
    i0.ɵɵtext(9, "Ki\u1EC3m tra k\u1EBFt qu\u1EA3 nh\u1EADn di\u1EC7n t\u1EF1 \u0111\u1ED9ng v\u00E0 t\u1EA3i t\u00E0i li\u1EC7u l\u00EAn Google Drive.");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(10, StandardsBulkCoaModalComponent_Conditional_0_Conditional_10_Template, 2, 0, "button", 7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 8)(12, "div", 9)(13, "div", 10)(14, "span", 11);
    i0.ɵɵtext(15, "T\u1ED5ng s\u1ED1 Files");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span", 12);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div", 13)(19, "span", 14);
    i0.ɵɵtext(20, "Gh\u00E9p th\u00E0nh c\u00F4ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 15);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 16)(24, "span", 17);
    i0.ɵɵtext(25, "Ch\u01B0a x\u00E1c \u0111\u1ECBnh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "span", 18);
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(28, StandardsBulkCoaModalComponent_Conditional_0_Conditional_28_Template, 10, 5, "div", 19);
    i0.ɵɵelementStart(29, "div", 20)(30, "table", 21)(31, "thead", 22)(32, "tr")(33, "th", 23);
    i0.ɵɵtext(34, "STT");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "th", 24);
    i0.ɵɵtext(36, "T\u00EAn t\u1EC7p CoA");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "th", 24);
    i0.ɵɵtext(38, "Ch\u1EA5t chu\u1EA9n \u0111\u1ED1i chi\u1EBFu T\u1EF1 \u0111\u1ED9ng Nh\u1EADn di\u1EC7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "th", 25);
    i0.ɵɵtext(40, "Tr\u1EA1ng th\u00E1i t\u1EA3i l\u00EAn");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(41, "tbody", 26);
    i0.ɵɵrepeaterCreate(42, StandardsBulkCoaModalComponent_Conditional_0_For_43_Template, 18, 9, "tr", 27, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵtemplate(44, StandardsBulkCoaModalComponent_Conditional_0_Conditional_44_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(45, "div", 28)(46, "div", 29);
    i0.ɵɵtext(47, " T\u00EDnh n\u0103ng s\u1EED d\u1EE5ng Upload Queue c\u1EE7a Google Drive API. C\u00E1c file kh\u00F4ng \u0111\u01B0\u1EE3c gh\u00E9p chu\u1EA9n s\u1EBD b\u1ECB b\u1ECF qua. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "div", 30);
    i0.ɵɵtemplate(49, StandardsBulkCoaModalComponent_Conditional_0_Conditional_49_Template, 2, 0, "button", 31)(50, StandardsBulkCoaModalComponent_Conditional_0_Conditional_50_Template, 5, 3);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵconditional(!ctx_r1.isUploading ? 10 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.items.length);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.matchedCount());
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.unmatchedCount());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isUploading ? 28 : -1);
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater(ctx_r1.items);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.items.length === 0 ? 44 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(!ctx_r1.isUploading && ctx_r1.uploadComplete ? 49 : 50);
} }
export class StandardsBulkCoaModalComponent {
    constructor() {
        this.isOpen = false;
        this.items = [];
        this.allStandards = [];
        this.isUploading = false;
        this.uploadComplete = false;
        this.cancel = new EventEmitter();
        this.confirm = new EventEmitter();
    }
    // Use functions instead of signals so it updates dynamically with input items array modifications
    matchedCount() {
        return this.items.filter(i => i.matchedStandard).length;
    }
    unmatchedCount() {
        return this.items.filter(i => !i.matchedStandard).length;
    }
    itemsToUpload() {
        return this.items.filter(i => i.matchedStandard).length;
    }
    successCount() {
        return this.items.filter(i => i.status === 'success').length;
    }
    errorCount() {
        return this.items.filter(i => i.status === 'error').length;
    }
    onConfirm() {
        this.confirm.emit();
    }
    onManualMatchChange(item, stdId) {
        if (!stdId) {
            item.matchedStandard = null;
            return;
        }
        const found = this.allStandards.find(s => s.id === stdId);
        if (found) {
            item.matchedStandard = found;
        }
    }
    getFileIcon(filename) {
        const lower = filename.toLowerCase();
        if (lower.endsWith('.pdf'))
            return 'fa-file-pdf text-rose-500';
        if (lower.match(/\.(jpg|jpeg|png|webp|bmp)$/))
            return 'fa-file-image text-blue-500';
        if (lower.match(/\.(doc|docx)$/))
            return 'fa-file-word text-blue-600';
        return 'fa-file text-slate-500';
    }
    getHighlightedFilenameSegments(filename, item) {
        const std = item.matchedStandard;
        if (!std)
            return [{ text: filename, isMatch: false }];
        const matchWords = [];
        const addWords = (str) => {
            if (!str || typeof str !== 'string' || str === '-' || str === 'na' || str === 'n/a' || str === 'N/A')
                return;
            // Exact text
            if (str.length >= 3 && filename.toLowerCase().includes(str.toLowerCase())) {
                matchWords.push(str);
            }
            // Stripped text (e.g. "Lot-123" -> "Lot123")
            const clean = str.replace(/[^a-zA-Z0-9]/g, '');
            if (clean !== str && clean.length >= 3 && filename.toLowerCase().includes(clean.toLowerCase())) {
                matchWords.push(clean);
            }
        };
        addWords(std.lot_number);
        addWords(std.product_code);
        if (matchWords.length === 0)
            return [{ text: filename, isMatch: false }];
        // Sort by length desc to match longer tokens first
        matchWords.sort((a, b) => b.length - a.length);
        // Escape regex chars
        const escape = (s) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Create pattern matching dynamically any of the strings
        const pattern = new RegExp(`(${matchWords.map(escape).join('|')})`, 'gi');
        const parts = filename.split(pattern);
        return parts.filter(p => p.length > 0).map(p => {
            const isMatch = matchWords.some(w => w.toLowerCase() === p.toLowerCase());
            return { text: p, isMatch };
        });
    }
    static { this.ɵfac = function StandardsBulkCoaModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsBulkCoaModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsBulkCoaModalComponent, selectors: [["app-standards-bulk-coa-modal"]], inputs: { isOpen: "isOpen", items: "items", allStandards: "allStandards", isUploading: "isUploading", uploadComplete: "uploadComplete" }, outputs: { cancel: "cancel", confirm: "confirm" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-900", "rounded-[2rem]", "shadow-2xl", "w-full", "max-w-5xl", "flex", "flex-col", "overflow-hidden", "animate-bounce-in", "border", "border-slate-100", "dark:border-slate-800", "max-h-[90vh]"], [1, "p-6", "border-b", "border-slate-100", "dark:border-slate-800", "flex", "justify-between", "items-center", "bg-slate-50/50", "dark:bg-slate-800/50", "shrink-0"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "flex", "items-center", "gap-3", "tracking-tight"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-indigo-100", "dark:border-indigo-800/50"], [1, "fa-solid", "fa-file-contract"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "mt-1", "font-medium"], [1, "w-10", "h-10", "rounded-full", "hover:bg-slate-200", "dark:hover:bg-slate-700", "flex", "items-center", "justify-center", "text-slate-500", "transition"], [1, "flex-1", "overflow-hidden", "flex", "flex-col", "p-6", "bg-slate-50/30", "dark:bg-slate-900/50", "relative"], [1, "flex", "gap-4", "mb-4"], [1, "bg-white", "dark:bg-slate-800", "px-4", "py-3", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "flex-1", "shadow-sm", "flex", "items-center", "justify-between"], [1, "text-slate-500", "dark:text-slate-400", "font-bold", "text-xs", "uppercase", "tracking-wider"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "bg-emerald-50", "dark:bg-emerald-900/10", "px-4", "py-3", "rounded-xl", "border", "border-emerald-200", "dark:border-emerald-800/30", "flex-1", "shadow-sm", "flex", "items-center", "justify-between"], [1, "text-emerald-600", "dark:text-emerald-500", "font-bold", "text-xs", "uppercase", "tracking-wider"], [1, "text-xl", "font-black", "text-emerald-600", "dark:text-emerald-400"], [1, "bg-amber-50", "dark:bg-amber-900/10", "px-4", "py-3", "rounded-xl", "border", "border-amber-200", "dark:border-amber-800/30", "flex-1", "shadow-sm", "flex", "items-center", "justify-between"], [1, "text-amber-600", "dark:text-amber-500", "font-bold", "text-xs", "uppercase", "tracking-wider"], [1, "text-xl", "font-black", "text-amber-600", "dark:text-amber-400"], [1, "mb-4", "bg-white", "dark:bg-slate-800", "rounded-xl", "p-6", "border", "border-indigo-100", "dark:border-indigo-800"], [1, "flex-1", "overflow-auto", "custom-scrollbar", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm", "relative"], [1, "w-full", "text-sm", "text-left", "border-collapse"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "font-bold", "uppercase", "bg-slate-50", "dark:bg-slate-900", "sticky", "top-0", "z-10", "border-b", "border-slate-200", "dark:border-slate-700", "shadow-sm"], [1, "px-4", "py-3", "w-12", "text-center"], [1, "px-4", "py-3", "w-[40%]"], [1, "px-4", "py-3", "w-[15%]", "text-center"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-700/50"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/80", "transition", "group", 3, "ngClass"], [1, "px-6", "py-4", "bg-slate-50", "dark:bg-slate-800/80", "border-t", "border-slate-200", "dark:border-slate-700", "flex", "justify-between", "items-center", "shrink-0"], [1, "text-xs", "text-slate-500", "font-medium"], [1, "flex", "gap-3"], [1, "px-6", "py-2.5", "bg-slate-200", "dark:bg-slate-700", "text-slate-700", "dark:text-slate-300", "font-bold", "text-sm", "rounded-xl", "hover:bg-slate-300", "dark:hover:bg-slate-600", "transition", "shadow-sm"], [1, "w-10", "h-10", "rounded-full", "hover:bg-slate-200", "dark:hover:bg-slate-700", "flex", "items-center", "justify-center", "text-slate-500", "transition", 3, "click"], [1, "fa-solid", "fa-times", "text-lg"], [1, "flex", "justify-between", "items-center", "mb-2"], [1, "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "font-black", "text-indigo-600", "dark:text-indigo-400"], [1, "w-full", "bg-slate-100", "dark:bg-slate-700", "rounded-full", "h-3", "overflow-hidden"], [1, "bg-indigo-500", "h-full", "rounded-full", "transition-all", "duration-300", "relative", "overflow-hidden"], [1, "absolute", "inset-0", "bg-white/20", "animate-pulse"], [1, "mt-2", "text-xs", "font-bold", "text-red-500", "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "px-4", "py-3", "text-center", "text-slate-400", "font-medium"], [1, "px-4", "py-3"], [1, "flex", "items-center", "gap-2"], [1, "fa-regular", "text-lg", 3, "ngClass"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "break-all", "text-xs", 3, "title"], [1, "text-[10px]", "text-slate-400", "mt-0.5", "ml-6"], [1, "px-4", "py-3", "text-center"], [1, "px-2", "py-1", "bg-slate-100", "text-slate-500", "dark:bg-slate-800", "rounded", "text-[10px]", "font-bold", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm"], [1, "px-2", "py-1", "bg-blue-50", "text-blue-600", "dark:bg-blue-900/30", "dark:text-blue-400", "rounded", "text-[10px]", "font-bold", "border", "border-blue-200", "dark:border-blue-800/50", "shadow-sm", "flex", "items-center", "gap-1", "w-fit", "mx-auto"], [1, "px-2", "py-1", "bg-emerald-50", "text-emerald-600", "dark:bg-emerald-900/30", "dark:text-emerald-400", "rounded", "text-[10px]", "font-bold", "border", "border-emerald-200", "dark:border-emerald-800/50", "shadow-sm"], [1, "px-2", "py-1", "bg-red-50", "text-red-600", "dark:bg-red-900/30", "dark:text-red-400", "rounded", "text-[10px]", "font-bold", "border", "border-red-200", "dark:border-red-800/50", "shadow-sm", 3, "title"], [1, "bg-yellow-200", "dark:bg-yellow-500/30", "text-yellow-900", "dark:text-yellow-200", "px-0.5", "rounded", "shadow-sm", "border", "border-yellow-300", "dark:border-yellow-600/50"], [1, "w-full", "px-3", "py-2", "bg-slate-50", "dark:bg-slate-900", "border", "appearance-none", "outline-none", "focus:ring-2", "focus:ring-indigo-500/20", "rounded-lg", "text-xs", "font-medium", "transition", 3, "ngModelChange", "ngModel", "ngClass"], ["value", ""], [1, "mt-1", "text-[10px]", "text-emerald-600", "dark:text-emerald-400", "flex", "items-center", "justify-between", "font-medium", "px-1"], [1, "mt-1", "text-[10px]", "text-amber-600", "dark:text-amber-400", "flex", "items-center", "gap-1", "font-medium", "px-1"], [1, "dark:bg-slate-800", "text-slate-700", "dark:text-slate-300", 3, "value"], [1, "flex", "items-center", "gap-1", "truncate"], [1, "fa-solid", "fa-check"], [1, "font-bold", "bg-emerald-100", "dark:bg-emerald-900/50", "px-1.5", "py-0.5", "rounded", "ml-1", "shrink-0"], [1, "bg-slate-50", "dark:bg-slate-900", "px-3", "py-2", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "flex", "justify-between", "items-center"], [1, "text-xs", "italic", "text-slate-400"], [1, "truncate"], [1, "text-[10px]", "bg-slate-200", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "px-1.5", "py-0.5", "rounded", "ml-1", "shrink-0"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-xmark"], ["colspan", "4", 1, "p-8", "text-center", "text-slate-400", "italic", "bg-slate-50/50", "dark:bg-slate-900/50"], [1, "px-6", "py-2.5", "bg-slate-200", "dark:bg-slate-700", "text-slate-700", "dark:text-slate-300", "font-bold", "text-sm", "rounded-xl", "hover:bg-slate-300", "dark:hover:bg-slate-600", "transition", "shadow-sm", 3, "click"], [1, "px-6", "py-2.5", "text-slate-500", "dark:text-slate-400", "font-bold", "text-sm", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-xl", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "px-6", "py-2.5", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "font-bold", "text-sm", "rounded-xl", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "shadow-lg", "shadow-indigo-200", "dark:shadow-none", "transition", "flex", "items-center", "gap-2", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-cloud-arrow-up"]], template: function StandardsBulkCoaModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsBulkCoaModalComponent_Conditional_0_Template, 51, 7, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen ? 0 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsBulkCoaModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-bulk-coa-modal',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
         <div class="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800 max-h-[90vh]">
            
            <!-- Header -->
            <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
               <div>
                  <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 tracking-tight">
                      <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
                          <i class="fa-solid fa-file-contract"></i>
                      </div>
                      Trình Ghép Nối CoA Hàng Loạt
                  </h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Kiểm tra kết quả nhận diện tự động và tải tài liệu lên Google Drive.</p>
               </div>
               @if(!isUploading) {
                 <button (click)="cancel.emit()" class="w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition">
                    <i class="fa-solid fa-times text-lg"></i>
                 </button>
               }
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-hidden flex flex-col p-6 bg-slate-50/30 dark:bg-slate-900/50 relative">
               
               <!-- Summary Stats -->
               <div class="flex gap-4 mb-4">
                  <div class="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 flex-1 shadow-sm flex items-center justify-between">
                     <span class="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Tổng số Files</span>
                     <span class="text-xl font-black text-slate-800 dark:text-slate-100">{{items.length}}</span>
                  </div>
                  <div class="bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800/30 flex-1 shadow-sm flex items-center justify-between">
                     <span class="text-emerald-600 dark:text-emerald-500 font-bold text-xs uppercase tracking-wider">Ghép thành công</span>
                     <span class="text-xl font-black text-emerald-600 dark:text-emerald-400">{{matchedCount()}}</span>
                  </div>
                  <div class="bg-amber-50 dark:bg-amber-900/10 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800/30 flex-1 shadow-sm flex items-center justify-between">
                     <span class="text-amber-600 dark:text-amber-500 font-bold text-xs uppercase tracking-wider">Chưa xác định</span>
                     <span class="text-xl font-black text-amber-600 dark:text-amber-400">{{unmatchedCount()}}</span>
                  </div>
               </div>

               @if(isUploading) {
                   <!-- Upload Progress -->
                   <div class="mb-4 bg-white dark:bg-slate-800 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
                       <div class="flex justify-between items-center mb-2">
                           <span class="font-bold text-slate-700 dark:text-slate-300">Đang tải lên Drive...</span>
                           <span class="font-black text-indigo-600 dark:text-indigo-400">{{successCount()}} / {{itemsToUpload()}}</span>
                       </div>
                       <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                           <div class="bg-indigo-500 h-full rounded-full transition-all duration-300 relative overflow-hidden" [style.width.%]="(successCount() / (itemsToUpload() || 1)) * 100">
                               <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                           </div>
                       </div>
                       @if (errorCount() > 0) {
                           <div class="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                               <i class="fa-solid fa-triangle-exclamation"></i> Có {{errorCount()}} file tải lỗi.
                           </div>
                       }
                   </div>
               }

               <!-- Table container -->
               <div class="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
                   <table class="w-full text-sm text-left border-collapse">
                       <thead class="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-900 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                           <tr>
                               <th class="px-4 py-3 w-12 text-center">STT</th>
                               <th class="px-4 py-3 w-[40%]">Tên tệp CoA</th>
                               <th class="px-4 py-3 w-[40%]">Chất chuẩn đối chiếu Tự động Nhận diện</th>
                               <th class="px-4 py-3 w-[15%] text-center">Trạng thái tải lên</th>
                           </tr>
                       </thead>
                       <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                           @for (item of items; track $index) {
                               <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition group" [ngClass]="{'bg-red-50/50 dark:bg-red-900/10': !item.matchedStandard}">
                                   <td class="px-4 py-3 text-center text-slate-400 font-medium">{{$index + 1}}</td>
                                   <td class="px-4 py-3">
                                       <div class="flex items-center gap-2">
                                           <i class="fa-regular text-lg" [ngClass]="getFileIcon(item.fileName)"></i>
                                           <span class="font-bold text-slate-700 dark:text-slate-300 break-all text-xs" [title]="item.fileName">
                                               @for (seg of getHighlightedFilenameSegments(item.fileName, item); track $index) {
                                                   @if (seg.isMatch) {
                                                       <span class="bg-yellow-200 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-200 px-0.5 rounded shadow-sm border border-yellow-300 dark:border-yellow-600/50">{{seg.text}}</span>
                                                   } @else {
                                                       <span>{{seg.text}}</span>
                                                   }
                                               }
                                           </span>
                                       </div>
                                       @if(item.file.size) { <div class="text-[10px] text-slate-400 mt-0.5 ml-6">{{(item.file.size / 1024).toFixed(1)}} KB</div> }
                                   </td>
                                   <td class="px-4 py-3">
                                       @if (!isUploading) {
                                           <select 
                                               [ngModel]="item.matchedStandard?.id || ''" 
                                               (ngModelChange)="onManualMatchChange(item, $event)"
                                               class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg text-xs font-medium transition"
                                               [ngClass]="item.matchedStandard ? 'border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 focus:border-emerald-500' : 'border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 focus:border-amber-500'">
                                               <option value="">-- [Bỏ qua] Không nhận diện được --</option>
                                               @if (item.suggestedStandards) {
                                                   @for (s of item.suggestedStandards; track s.std.id) {
                                                       <option [value]="s.std.id" class="dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                           [{{s.score}} điểm] {{s.std.name}} (LOT: {{s.std.lot_number || 'N/A'}}) - {{s.std.product_code || 'No Code'}}
                                                       </option>
                                                   }
                                               } @else {
                                                   @for (std of allStandards; track std.id) {
                                                       <option [value]="std.id" class="dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                           {{std.name}} (LOT: {{std.lot_number || 'N/A'}}) - {{std.product_code || 'No Code'}}
                                                       </option>
                                                   }
                                               }
                                           </select>
                                           @if(item.matchedStandard) {
                                               <div class="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-between font-medium px-1">
                                                   <span class="flex items-center gap-1 truncate"><i class="fa-solid fa-check"></i> Đã chọn: {{item.matchedStandard.name}}</span>
                                                   @if(item.matchScore !== undefined) {
                                                       <span class="font-bold bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded ml-1 shrink-0">{{item.matchScore}}đ</span>
                                                   }
                                               </div>
                                           } @else {
                                               <div class="mt-1 text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium px-1">
                                                   <i class="fa-solid fa-triangle-exclamation"></i> Sẽ bị bỏ qua khi Tải lên
                                               </div>
                                           }
                                       } @else {
                                           <!-- Readonly Mode During Upload -->
                                           @if(item.matchedStandard) {
                                               <div class="bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center">
                                                   <span class="truncate">{{item.matchedStandard.name}} (LOT: {{item.matchedStandard.lot_number || 'N/A'}})</span>
                                                   @if(item.matchScore !== undefined) {
                                                       <span class="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded ml-1 shrink-0">{{item.matchScore}}đ</span>
                                                   }
                                               </div>
                                           } @else {
                                               <span class="text-xs italic text-slate-400">Đã bỏ qua</span>
                                           }
                                       }
                                   </td>
                                   <td class="px-4 py-3 text-center">
                                       @if(item.status === 'pending') {
                                           <span class="px-2 py-1 bg-slate-100 text-slate-500 dark:bg-slate-800 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-sm">Chờ xử lý</span>
                                       } @else if(item.status === 'uploading') {
                                           <span class="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded text-[10px] font-bold border border-blue-200 dark:border-blue-800/50 shadow-sm flex items-center gap-1 w-fit mx-auto">
                                                <i class="fa-solid fa-spinner fa-spin"></i> Đang tải
                                           </span>
                                       } @else if(item.status === 'success') {
                                           <span class="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/50 shadow-sm"><i class="fa-solid fa-check"></i> Hoàn tất</span>
                                       } @else if(item.status === 'error') {
                                           <span class="px-2 py-1 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded text-[10px] font-bold border border-red-200 dark:border-red-800/50 shadow-sm" [title]="item.uploadError"><i class="fa-solid fa-xmark"></i> Lỗi</span>
                                       }
                                   </td>
                               </tr>
                           }
                           @if (items.length === 0) {
                               <tr>
                                   <td colspan="4" class="p-8 text-center text-slate-400 italic bg-slate-50/50 dark:bg-slate-900/50">Không có dữ liệu.</td>
                               </tr>
                           }
                       </tbody>
                   </table>
               </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
               <div class="text-xs text-slate-500 font-medium">
                  Tính năng sử dụng Upload Queue của Google Drive API. Các file không được ghép chuẩn sẽ bị bỏ qua.
               </div>
               
               <div class="flex gap-3">
                   @if(!isUploading && uploadComplete) {
                       <button (click)="cancel.emit()" class="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition shadow-sm">
                           Đóng
                       </button>
                   } @else {
                       <button (click)="cancel.emit()" [disabled]="isUploading" class="px-6 py-2.5 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition disabled:opacity-50">
                           Hủy Bỏ Thao Tác
                       </button>
                       <button (click)="onConfirm()" [disabled]="isUploading || itemsToUpload() === 0" class="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none transition flex items-center gap-2 disabled:opacity-50">
                           <i class="fa-solid fa-cloud-arrow-up"></i> Bắt đầu Tải lên ({{itemsToUpload()}})
                       </button>
                   }
               </div>
            </div>
         </div>
      </div>
    }
  `
            }]
    }], null, { isOpen: [{
            type: Input
        }], items: [{
            type: Input
        }], allStandards: [{
            type: Input
        }], isUploading: [{
            type: Input
        }], uploadComplete: [{
            type: Input
        }], cancel: [{
            type: Output
        }], confirm: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsBulkCoaModalComponent, { className: "StandardsBulkCoaModalComponent", filePath: "src/app/features/standards/components/standards-bulk-coa-modal.component.ts", lineNumber: 201 }); })();
//# sourceMappingURL=standards-bulk-coa-modal.component.js.map