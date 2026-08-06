import { Component, HostListener, ViewChild, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = ["dialogPanel"];
const _c1 = a0 => ({ "bg-red-50 dark:bg-red-900/10": a0 });
const _c2 = () => [];
const _forTrack0 = ($index, $item) => $item.rowNumber || $index;
const _forTrack1 = ($index, $item) => $item.field;
function StandardsImportDataModalComponent_Conditional_0_For_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sheet_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", sheet_r3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(sheet_r3);
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 20);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("C\u1EA3nh b\u00E1o: ", ctx_r1.warningCount(), "");
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 21);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("L\u1ED7i: ", ctx_r1.invalidCount(), "");
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 22);
    i0.ɵɵelement(1, "i", 42);
    i0.ɵɵelementStart(2, "div")(3, "strong");
    i0.ɵɵtext(4, "\u0110ang b\u1ECB ch\u1EB7n:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" C\u00F3 ", ctx_r1.blockingCount(), " d\u00F2ng xung \u0111\u1ED9t. N\u00FAt Import ch\u1EC9 \u0111\u01B0\u1EE3c m\u1EDF sau khi s\u1EEDa d\u1EEF li\u1EC7u ngu\u1ED3n ho\u1EB7c x\u1EED l\u00FD b\u1EA3n ghi tr\u00F9ng/\u0111ang m\u01B0\u1EE3n.");
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 23)(1, "label", 43)(2, "input", 44);
    i0.ɵɵlistener("change", function StandardsImportDataModalComponent_Conditional_0_Conditional_31_Template_input_change_2_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.acknowledgeSkippedRows.set($event.target.checked)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "T\u00F4i \u0111\u00E3 xem l\u1ED7i v\u00E0 \u0111\u1ED3ng \u00FD b\u1ECF qua ");
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(7, " d\u00F2ng kh\u00F4ng h\u1EE3p l\u1EC7. C\u00E1c d\u00F2ng n\u00E0y s\u1EBD kh\u00F4ng \u0111\u01B0\u1EE3c ghi.");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r1.acknowledgeSkippedRows());
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.skippableInvalidCount());
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 45);
    i0.ɵɵlistener("click", function StandardsImportDataModalComponent_Conditional_0_Conditional_35_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.downloadErrors()); });
    i0.ɵɵelement(1, "i", 46);
    i0.ɵɵtext(2, " T\u1EA3i CSV l\u1ED7i ");
    i0.ɵɵelementEnd();
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_41_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 62)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const change_r6 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", change_r6.label, ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" ", ctx_r1.displayValue(change_r6.before), " \u2192 ", ctx_r1.displayValue(change_r6.after), "");
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_41_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 63);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r7 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("+", (item_r7.changes || i0.ɵɵpureFunction0(1, _c2)).length - 3, " thay \u0111\u1ED5i kh\u00E1c");
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_41_For_1_Template, 4, 3, "div", 62, _forTrack1);
    i0.ɵɵtemplate(2, StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_41_Conditional_2_Template, 2, 2, "div", 63);
} if (rf & 2) {
    const item_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵrepeater((item_r7.changes || i0.ɵɵpureFunction0(1, _c2)).slice(0, 3));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(((item_r7.changes == null ? null : item_r7.changes.length) || 0) > 3 ? 2 : -1);
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 56);
    i0.ɵɵtext(1, "Kh\u00F4ng \u0111\u1ED5i metadata");
    i0.ɵɵelementEnd();
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_For_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 57);
    i0.ɵɵelement(1, "i", 64);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const warning_r8 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(warning_r8);
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 58);
    i0.ɵɵtext(1, "Xung \u0111\u1ED9t \u2014 b\u1ECB ch\u1EB7n");
    i0.ɵɵelementEnd();
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 58);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r7.errorMessage || "D\u1EEF li\u1EC7u kh\u00F4ng h\u1EE3p l\u1EC7");
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 59);
    i0.ɵɵtext(1, "Kh\u00F4i ph\u1EE5c chu\u1EA9n \u0111\u00E3 \u1EA9n");
    i0.ɵɵelementEnd();
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 60);
    i0.ɵɵtext(1, "C\u1EADp nh\u1EADt metadata an to\u00E0n");
    i0.ɵɵelementEnd();
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 61);
    i0.ɵɵtext(1, "T\u1EA1o m\u1EDBi");
    i0.ɵɵelementEnd();
} }
function StandardsImportDataModalComponent_Conditional_0_For_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 37)(1, "td", 47);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 48)(4, "div", 49);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 50);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 48)(9, "div", 51);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 52);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "td", 47)(14, "div");
    i0.ɵɵtext(15, "Ban \u0111\u1EA7u: ");
    i0.ɵɵelementStart(16, "strong");
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div");
    i0.ɵɵtext(19, "C\u00F2n l\u1EA1i: ");
    i0.ɵɵelementStart(20, "strong");
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 53);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "td", 47)(25, "div");
    i0.ɵɵtext(26);
    i0.ɵɵpipe(27, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div");
    i0.ɵɵtext(29);
    i0.ɵɵpipe(30, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "div", 54);
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "td", 48)(34, "div");
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div", 55);
    i0.ɵɵtext(37);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "div", 53);
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(40, "td", 48);
    i0.ɵɵtemplate(41, StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_41_Template, 3, 2)(42, StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_42_Template, 2, 0, "div", 56);
    i0.ɵɵrepeaterCreate(43, StandardsImportDataModalComponent_Conditional_0_For_58_For_44_Template, 3, 1, "div", 57, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "td", 48);
    i0.ɵɵtemplate(46, StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_46_Template, 2, 0, "span", 58)(47, StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_47_Template, 2, 1, "span", 58)(48, StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_48_Template, 2, 0, "span", 59)(49, StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_49_Template, 2, 0, "span", 60)(50, StandardsImportDataModalComponent_Conditional_0_For_58_Conditional_50_Template, 2, 0, "span", 61);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r7 = ctx.$implicit;
    const $index_r9 = ctx.$index;
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(26, _c1, !item_r7.isValid));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.rowNumber || $index_r9 + 2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r7.parsed.name || "\u2014");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.parsed.internal_id || "Ch\u01B0a c\u00F3 s\u1ED1 nh\u1EADn di\u1EC7n");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r7.parsed.lot_number || "\u2014");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.parsed.product_code || "\u2014");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", item_r7.parsed.initial_amount, " ", item_r7.parsed.unit, "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", item_r7.parsed.current_amount, " ", item_r7.parsed.unit, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Nh\u1EADt k\u00FD: ", item_r7.logs.length, "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Nh\u1EADn: ", item_r7.parsed.received_date ? i0.ɵɵpipeBind2(27, 20, item_r7.parsed.received_date, "dd/MM/yyyy") : "\u2014", "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("HSD: ", item_r7.parsed.expiry_date ? i0.ɵɵpipeBind2(30, 23, item_r7.parsed.expiry_date, "dd/MM/yyyy") : "\u2014", "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("G\u1ED1c: ", item_r7.raw["Ng\u00E0y nh\u1EADn (G\u1ED1c)"] || "\u2014", "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r7.parsed.manufacturer || "\u2014");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.parsed.cas_number || "\u2014");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", item_r7.parsed.location || "\u2014", " \u00B7 ", item_r7.parsed.storage_condition || "\u2014", "");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(((item_r7.changes == null ? null : item_r7.changes.length) || 0) > 0 ? 41 : 42);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(item_r7.warnings || i0.ɵɵpureFunction0(28, _c2));
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(item_r7.mode === "CONFLICT" ? 46 : !item_r7.isValid ? 47 : item_r7.mode === "RESTORE" ? 48 : item_r7.mode === "UPDATE_SAFE" ? 49 : 50);
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_59_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 38)(1, "button", 65);
    i0.ɵɵlistener("click", function StandardsImportDataModalComponent_Conditional_0_Conditional_59_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.rowLimit.set(ctx_r1.data().length)); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Hi\u1EC3n th\u1ECB to\u00E0n b\u1ED9 ", ctx_r1.data().length, " d\u00F2ng ");
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_64_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 66);
    i0.ɵɵtext(1, " \u0110ang \u0111\u1ECDc sheet... ");
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_65_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 66);
    i0.ɵɵtext(1, " \u0110ang commit... ");
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_66_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 67);
    i0.ɵɵtext(1);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" X\u00E1c nh\u1EADn Import ", ctx_r1.validCount(), " d\u00F2ng ");
} }
function StandardsImportDataModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 1)(1, "div", 2, 0)(3, "header", 3)(4, "div", 4)(5, "h3", 5);
    i0.ɵɵelement(6, "i", 6);
    i0.ɵɵtext(7, " X\u00E1c nh\u1EADn Import chu\u1EA9n ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 7);
    i0.ɵɵtext(9, " Ki\u1EC3m tra kh\u00F3a nh\u1EADn di\u1EC7n, s\u1ED1 l\u01B0\u1EE3ng, \u0111\u01A1n v\u1ECB, ng\u00E0y v\u00E0 c\u00E1c thay \u0111\u1ED5i metadata tr\u01B0\u1EDBc khi commit. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "button", 8);
    i0.ɵɵlistener("click", function StandardsImportDataModalComponent_Conditional_0_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCancel()); });
    i0.ɵɵelement(11, "i", 9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 10)(13, "section", 11)(14, "label", 12);
    i0.ɵɵtext(15, " Worksheet ");
    i0.ɵɵelementStart(16, "select", 13);
    i0.ɵɵlistener("change", function StandardsImportDataModalComponent_Conditional_0_Template_select_change_16_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSheetChange($event)); });
    i0.ɵɵrepeaterCreate(17, StandardsImportDataModalComponent_Conditional_0_For_18_Template, 2, 2, "option", 14, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 15)(20, "span", 16);
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "span", 17);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "span", 18);
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "span", 19);
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(28, StandardsImportDataModalComponent_Conditional_0_Conditional_28_Template, 2, 1, "span", 20)(29, StandardsImportDataModalComponent_Conditional_0_Conditional_29_Template, 2, 1, "span", 21);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(30, StandardsImportDataModalComponent_Conditional_0_Conditional_30_Template, 6, 1, "div", 22)(31, StandardsImportDataModalComponent_Conditional_0_Conditional_31_Template, 8, 2, "div", 23);
    i0.ɵɵelementStart(32, "div", 24)(33, "p", 25);
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(35, StandardsImportDataModalComponent_Conditional_0_Conditional_35_Template, 3, 0, "button", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div", 27)(37, "table", 28)(38, "thead", 29)(39, "tr")(40, "th", 30);
    i0.ɵɵtext(41, "D\u00F2ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "th", 31);
    i0.ɵɵtext(43, "T\u00EAn / S\u1ED1 nh\u1EADn di\u1EC7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "th", 32);
    i0.ɵɵtext(45, "L\u00F4 / M\u00E3 s\u1EA3n ph\u1EA9m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "th", 33);
    i0.ɵɵtext(47, "S\u1ED1 l\u01B0\u1EE3ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "th", 32);
    i0.ɵɵtext(49, "Ng\u00E0y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "th", 34);
    i0.ɵɵtext(51, "H\u00E3ng / CAS / V\u1ECB tr\u00ED");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "th", 31);
    i0.ɵɵtext(53, "Thay \u0111\u1ED5i & c\u1EA3nh b\u00E1o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "th", 35);
    i0.ɵɵtext(55, "Tr\u1EA1ng th\u00E1i");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(56, "tbody", 36);
    i0.ɵɵrepeaterCreate(57, StandardsImportDataModalComponent_Conditional_0_For_58_Template, 51, 29, "tr", 37, _forTrack0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(59, StandardsImportDataModalComponent_Conditional_0_Conditional_59_Template, 3, 1, "div", 38);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(60, "footer", 39)(61, "button", 40);
    i0.ɵɵlistener("click", function StandardsImportDataModalComponent_Conditional_0_Template_button_click_61_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCancel()); });
    i0.ɵɵtext(62, "H\u1EE7y b\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "button", 41);
    i0.ɵɵlistener("click", function StandardsImportDataModalComponent_Conditional_0_Template_button_click_63_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onConfirm()); });
    i0.ɵɵtemplate(64, StandardsImportDataModalComponent_Conditional_0_Conditional_64_Template, 2, 0)(65, StandardsImportDataModalComponent_Conditional_0_Conditional_65_Template, 2, 0)(66, StandardsImportDataModalComponent_Conditional_0_Conditional_66_Template, 2, 1);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("disabled", ctx_r1.isImporting() || ctx_r1.isParsing());
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("value", ctx_r1.selectedSheet())("disabled", ctx_r1.isParsing() || ctx_r1.isImporting() || ctx_r1.sheetNames().length <= 1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.sheetNames());
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("T\u1ED5ng: ", ctx_r1.data().length, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("H\u1EE3p l\u1EC7: ", ctx_r1.validCount(), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("C\u1EADp nh\u1EADt: ", ctx_r1.updateCount(), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Kh\u00F4i ph\u1EE5c: ", ctx_r1.restoreCount(), "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.warningCount() > 0 ? 28 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.invalidCount() > 0 ? 29 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.blockingCount() > 0 ? 30 : ctx_r1.skippableInvalidCount() > 0 ? 31 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2(" Hi\u1EC3n th\u1ECB ", ctx_r1.visibleRows().length, "/", ctx_r1.data().length, " d\u00F2ng. D\u1EEF li\u1EC7u c\u1EADp nh\u1EADt kh\u00F4ng ghi \u0111\u00E8 tr\u01B0\u1EDDng tr\u1ED1ng v\u00E0 kh\u00F4ng thay \u0111\u1ED5i t\u1ED3n kho/workflow. ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.invalidCount() > 0 ? 35 : -1);
    i0.ɵɵadvance(22);
    i0.ɵɵrepeater(ctx_r1.visibleRows());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.data().length > ctx_r1.rowLimit() ? 59 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.isImporting() || ctx_r1.isParsing());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.canConfirm());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isParsing() ? 64 : ctx_r1.isImporting() ? 65 : 66);
} }
export class StandardsImportDataModalComponent {
    constructor() {
        this.data = input([]);
        this.isImporting = input(false);
        this.isParsing = input(false);
        this.sheetNames = input([]);
        this.selectedSheet = input('');
        this.cancel = output();
        this.confirm = output();
        this.sheetChange = output();
        this.acknowledgeSkippedRows = signal(false);
        this.rowLimit = signal(50);
    }
    ngAfterViewInit() {
        queueMicrotask(() => this.dialogPanel?.nativeElement.focus());
    }
    validCount() {
        return this.data().filter(item => item.isValid && item.mode !== 'CONFLICT').length;
    }
    invalidCount() {
        return this.data().length - this.validCount();
    }
    blockingCount() {
        return this.data().filter(item => item.mode === 'CONFLICT').length;
    }
    skippableInvalidCount() {
        return this.data().filter(item => !item.isValid && item.mode !== 'CONFLICT').length;
    }
    updateCount() {
        return this.data().filter(item => item.isValid && item.mode === 'UPDATE_SAFE').length;
    }
    restoreCount() {
        return this.data().filter(item => item.isValid && item.mode === 'RESTORE').length;
    }
    warningCount() {
        return this.data().reduce((count, item) => count + (item.warnings?.length || 0), 0);
    }
    visibleRows() {
        return [...this.data()]
            .sort((a, b) => {
            const priority = (item) => item.mode === 'CONFLICT' ? 0 : (!item.isValid ? 1 : 2);
            return priority(a) - priority(b) || (a.rowNumber || 0) - (b.rowNumber || 0);
        })
            .slice(0, this.rowLimit());
    }
    canConfirm() {
        return !this.isImporting() &&
            !this.isParsing() &&
            this.validCount() > 0 &&
            this.blockingCount() === 0 &&
            (this.skippableInvalidCount() === 0 || this.acknowledgeSkippedRows());
    }
    onSheetChange(event) {
        this.acknowledgeSkippedRows.set(false);
        this.rowLimit.set(50);
        this.sheetChange.emit(event.target.value);
    }
    onCancel() {
        if (!this.isImporting() && !this.isParsing())
            this.cancel.emit();
    }
    onConfirm() {
        if (this.canConfirm())
            this.confirm.emit();
    }
    displayValue(value) {
        const text = String(value ?? '').trim();
        return text || '—';
    }
    downloadErrors() {
        const rows = this.data()
            .filter(item => !item.isValid || item.mode === 'CONFLICT')
            .map(item => [
            item.sourceSheet || this.selectedSheet(),
            item.rowNumber || '',
            item.parsed.name || '',
            item.parsed.internal_id || '',
            item.parsed.lot_number || '',
            item.errorMessage || 'Xung đột'
        ]);
        const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
        const csv = [
            ['Sheet', 'Dòng', 'Tên chuẩn', 'Số nhận diện', 'Số lô', 'Lỗi'],
            ...rows
        ].map(row => row.map(escape).join(',')).join('\r\n');
        const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `standard-import-errors-${new Date().toISOString().slice(0, 10)}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
    }
    handleKeyboard(event) {
        if (!this.data().length)
            return;
        if (event.key === 'Escape') {
            event.preventDefault();
            this.onCancel();
            return;
        }
        if (event.key !== 'Tab' || !this.dialogPanel)
            return;
        const focusable = Array.from(this.dialogPanel.nativeElement.querySelectorAll('button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        if (!focusable.length)
            return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
    static { this.ɵfac = function StandardsImportDataModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsImportDataModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsImportDataModalComponent, selectors: [["app-standards-import-data-modal"]], viewQuery: function StandardsImportDataModalComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.dialogPanel = _t.first);
        } }, hostBindings: function StandardsImportDataModalComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("keydown", function StandardsImportDataModalComponent_keydown_HostBindingHandler($event) { return ctx.handleKeyboard($event); }, false, i0.ɵɵresolveDocument);
        } }, inputs: { data: [1, "data"], isImporting: [1, "isImporting"], isParsing: [1, "isParsing"], sheetNames: [1, "sheetNames"], selectedSheet: [1, "selectedSheet"] }, outputs: { cancel: "cancel", confirm: "confirm", sheetChange: "sheetChange" }, decls: 1, vars: 1, consts: [["dialogPanel", ""], [1, "fixed", "inset-0", "z-[80]", "flex", "items-center", "justify-center", "p-2", "sm:p-4", "bg-black/70", "backdrop-blur-sm", "fade-in"], ["role", "dialog", "aria-modal", "true", "aria-labelledby", "standard-import-title", "aria-describedby", "standard-import-description", "tabindex", "-1", 1, "bg-white", "dark:bg-slate-900", "rounded-xl", "sm:rounded-2xl", "shadow-2xl", "w-full", "max-w-[96rem]", "overflow-hidden", "flex", "flex-col", "max-h-[96vh]", "sm:max-h-[90vh]", "animate-slide-up", "outline-none"], [1, "px-4", "sm:px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-between", "items-start", "gap-3", "shrink-0"], [1, "min-w-0"], ["id", "standard-import-title", 1, "font-black", "text-slate-800", "dark:text-slate-200", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-file-import", "text-emerald-600", "dark:text-emerald-500"], ["id", "standard-import-description", 1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], ["type", "button", "aria-label", "\u0110\u00F3ng c\u1EEDa s\u1ED5 import", 1, "w-9", "h-9", "shrink-0", "rounded-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-red-500", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-times"], [1, "flex-1", "overflow-auto", "custom-scrollbar", "p-3", "sm:p-6"], [1, "grid", "grid-cols-1", "lg:grid-cols-[minmax(220px,320px)_1fr]", "gap-3", "mb-4"], [1, "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300"], ["aria-label", "Ch\u1ECDn worksheet \u0111\u1EC3 import", 1, "mt-1", "w-full", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "px-3", "py-2", "text-sm", 3, "change", "value", "disabled"], [3, "value"], [1, "flex", "flex-wrap", "content-end", "gap-2", "text-xs", "font-bold"], [1, "px-3", "py-1.5", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300"], [1, "px-3", "py-1.5", "rounded-full", "bg-emerald-100", "dark:bg-emerald-900/30", "text-emerald-700", "dark:text-emerald-400"], [1, "px-3", "py-1.5", "rounded-full", "bg-blue-100", "dark:bg-blue-900/30", "text-blue-700", "dark:text-blue-400"], [1, "px-3", "py-1.5", "rounded-full", "bg-amber-100", "dark:bg-amber-900/30", "text-amber-700", "dark:text-amber-400"], [1, "px-3", "py-1.5", "rounded-full", "bg-yellow-100", "dark:bg-yellow-900/30", "text-yellow-700", "dark:text-yellow-400"], [1, "px-3", "py-1.5", "rounded-full", "bg-red-100", "dark:bg-red-900/30", "text-red-700", "dark:text-red-400"], ["role", "alert", 1, "mb-4", "bg-red-50", "dark:bg-red-900/20", "border", "border-red-200", "dark:border-red-800/50", "rounded-xl", "p-3", "flex", "gap-3", "text-sm", "text-red-800", "dark:text-red-300"], [1, "mb-4", "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-200", "dark:border-amber-800/50", "rounded-xl", "p-3", "text-sm", "text-amber-800", "dark:text-amber-300"], [1, "flex", "flex-wrap", "justify-between", "items-center", "gap-2", "mb-2"], [1, "text-xs", "text-slate-500"], ["type", "button", 1, "text-xs", "font-bold", "text-red-600", "hover:bg-red-50", "dark:hover:bg-red-900/20", "px-3", "py-2", "rounded-lg"], [1, "overflow-auto", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl"], [1, "w-full", "min-w-[1450px]", "text-xs", "text-left", "border-collapse"], [1, "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "font-bold", "uppercase", "sticky", "top-0", "z-10"], [1, "p-2", "border-b", "border-slate-200", "dark:border-slate-700", "w-14"], [1, "p-2", "border-b", "border-slate-200", "dark:border-slate-700", "min-w-64"], [1, "p-2", "border-b", "border-slate-200", "dark:border-slate-700", "min-w-44"], [1, "p-2", "border-b", "border-slate-200", "dark:border-slate-700", "min-w-40"], [1, "p-2", "border-b", "border-slate-200", "dark:border-slate-700", "min-w-56"], [1, "p-2", "border-b", "border-slate-200", "dark:border-slate-700", "min-w-52"], [1, "text-slate-700", "dark:text-slate-300"], [1, "align-top", "hover:bg-slate-50", "dark:hover:bg-slate-800/50", 3, "ngClass"], [1, "text-center", "mt-3"], [1, "px-4", "sm:px-6", "py-4", "border-t", "border-slate-100", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "flex", "flex-col-reverse", "sm:flex-row", "sm:justify-end", "gap-3", "shrink-0"], ["type", "button", 1, "px-5", "py-2.5", "text-slate-600", "dark:text-slate-400", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-xl", "font-bold", "text-sm", "transition", "disabled:opacity-50", 3, "click", "disabled"], ["type", "button", 1, "px-6", "py-2.5", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-circle-xmark", "mt-0.5"], [1, "flex", "items-start", "gap-3", "cursor-pointer"], ["type", "checkbox", 1, "mt-1", 3, "change", "checked"], ["type", "button", 1, "text-xs", "font-bold", "text-red-600", "hover:bg-red-50", "dark:hover:bg-red-900/20", "px-3", "py-2", "rounded-lg", 3, "click"], [1, "fa-solid", "fa-download", "mr-1"], [1, "p-2", "border-b", "border-slate-100", "dark:border-slate-800", "font-mono"], [1, "p-2", "border-b", "border-slate-100", "dark:border-slate-800"], [1, "font-bold", "break-words"], [1, "font-mono", "text-slate-500", "mt-1"], [1, "font-mono"], [1, "font-mono", "text-indigo-600", "dark:text-indigo-400", "mt-1"], [1, "text-slate-500", "mt-1"], [1, "text-slate-400", "mt-1"], [1, "font-mono", "mt-1"], [1, "text-slate-400"], [1, "text-amber-700", "dark:text-amber-400", "mt-1"], [1, "font-bold", "text-red-600"], [1, "font-bold", "text-amber-600"], [1, "font-bold", "text-blue-600", "dark:text-blue-400"], [1, "font-bold", "text-emerald-600", "dark:text-emerald-400"], [1, "mb-1"], [1, "text-blue-600"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"], ["type", "button", 1, "text-xs", "font-bold", "text-indigo-600", "px-4", "py-2", "rounded-lg", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/20", 3, "click"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-check"]], template: function StandardsImportDataModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsImportDataModalComponent_Conditional_0_Template, 67, 17, "div", 1);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.data().length > 0 ? 0 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsImportDataModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-import-data-modal',
                standalone: true,
                imports: [CommonModule],
                template: `
    @if (data().length > 0) {
      <div class="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm fade-in">
        <div
          #dialogPanel
          role="dialog"
          aria-modal="true"
          aria-labelledby="standard-import-title"
          aria-describedby="standard-import-description"
          tabindex="-1"
          class="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-[96rem] overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[90vh] animate-slide-up outline-none">

          <header class="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-start gap-3 shrink-0">
            <div class="min-w-0">
              <h3 id="standard-import-title" class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                <i class="fa-solid fa-file-import text-emerald-600 dark:text-emerald-500"></i>
                Xác nhận Import chuẩn
              </h3>
              <p id="standard-import-description" class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kiểm tra khóa nhận diện, số lượng, đơn vị, ngày và các thay đổi metadata trước khi commit.
              </p>
            </div>
            <button
              type="button"
              aria-label="Đóng cửa sổ import"
              [disabled]="isImporting() || isParsing()"
              (click)="onCancel()"
              class="w-9 h-9 shrink-0 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 transition disabled:opacity-50">
              <i class="fa-solid fa-times"></i>
            </button>
          </header>

          <div class="flex-1 overflow-auto custom-scrollbar p-3 sm:p-6">
            <section class="grid grid-cols-1 lg:grid-cols-[minmax(220px,320px)_1fr] gap-3 mb-4">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300">
                Worksheet
                <select
                  aria-label="Chọn worksheet để import"
                  [value]="selectedSheet()"
                  [disabled]="isParsing() || isImporting() || sheetNames().length <= 1"
                  (change)="onSheetChange($event)"
                  class="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                  @for (sheet of sheetNames(); track sheet) {
                    <option [value]="sheet">{{sheet}}</option>
                  }
                </select>
              </label>

              <div class="flex flex-wrap content-end gap-2 text-xs font-bold">
                <span class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Tổng: {{data().length}}</span>
                <span class="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Hợp lệ: {{validCount()}}</span>
                <span class="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">Cập nhật: {{updateCount()}}</span>
                <span class="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">Khôi phục: {{restoreCount()}}</span>
                @if (warningCount() > 0) {
                  <span class="px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">Cảnh báo: {{warningCount()}}</span>
                }
                @if (invalidCount() > 0) {
                  <span class="px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">Lỗi: {{invalidCount()}}</span>
                }
              </div>
            </section>

            @if (blockingCount() > 0) {
              <div role="alert" class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-3 flex gap-3 text-sm text-red-800 dark:text-red-300">
                <i class="fa-solid fa-circle-xmark mt-0.5"></i>
                <div><strong>Đang bị chặn:</strong> Có {{blockingCount()}} dòng xung đột. Nút Import chỉ được mở sau khi sửa dữ liệu nguồn hoặc xử lý bản ghi trùng/đang mượn.</div>
              </div>
            } @else if (skippableInvalidCount() > 0) {
              <div class="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 text-sm text-amber-800 dark:text-amber-300">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    [checked]="acknowledgeSkippedRows()"
                    (change)="acknowledgeSkippedRows.set($any($event.target).checked)"
                    class="mt-1">
                  <span>Tôi đã xem lỗi và đồng ý bỏ qua <strong>{{skippableInvalidCount()}}</strong> dòng không hợp lệ. Các dòng này sẽ không được ghi.</span>
                </label>
              </div>
            }

            <div class="flex flex-wrap justify-between items-center gap-2 mb-2">
              <p class="text-xs text-slate-500">
                Hiển thị {{visibleRows().length}}/{{data().length}} dòng. Dữ liệu cập nhật không ghi đè trường trống và không thay đổi tồn kho/workflow.
              </p>
              @if (invalidCount() > 0) {
                <button type="button" (click)="downloadErrors()" class="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg">
                  <i class="fa-solid fa-download mr-1"></i> Tải CSV lỗi
                </button>
              }
            </div>

            <div class="overflow-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table class="w-full min-w-[1450px] text-xs text-left border-collapse">
                <thead class="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase sticky top-0 z-10">
                  <tr>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 w-14">Dòng</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-64">Tên / Số nhận diện</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-44">Lô / Mã sản phẩm</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-40">Số lượng</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-44">Ngày</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-56">Hãng / CAS / Vị trí</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-64">Thay đổi & cảnh báo</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-52">Trạng thái</th>
                  </tr>
                </thead>
                <tbody class="text-slate-700 dark:text-slate-300">
                  @for (item of visibleRows(); track item.rowNumber || $index) {
                    <tr [ngClass]="{'bg-red-50 dark:bg-red-900/10': !item.isValid}" class="align-top hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800 font-mono">{{item.rowNumber || $index + 2}}</td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        <div class="font-bold break-words">{{item.parsed.name || '—'}}</div>
                        <div class="font-mono text-slate-500 mt-1">{{item.parsed.internal_id || 'Chưa có số nhận diện'}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        <div class="font-mono">{{item.parsed.lot_number || '—'}}</div>
                        <div class="font-mono text-indigo-600 dark:text-indigo-400 mt-1">{{item.parsed.product_code || '—'}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800 font-mono">
                        <div>Ban đầu: <strong>{{item.parsed.initial_amount}} {{item.parsed.unit}}</strong></div>
                        <div>Còn lại: <strong>{{item.parsed.current_amount}} {{item.parsed.unit}}</strong></div>
                        <div class="text-slate-500 mt-1">Nhật ký: {{item.logs.length}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800 font-mono">
                        <div>Nhận: {{item.parsed.received_date ? (item.parsed.received_date | date:'dd/MM/yyyy') : '—'}}</div>
                        <div>HSD: {{item.parsed.expiry_date ? (item.parsed.expiry_date | date:'dd/MM/yyyy') : '—'}}</div>
                        <div class="text-slate-400 mt-1">Gốc: {{item.raw['Ngày nhận (Gốc)'] || '—'}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        <div>{{item.parsed.manufacturer || '—'}}</div>
                        <div class="font-mono mt-1">{{item.parsed.cas_number || '—'}}</div>
                        <div class="text-slate-500 mt-1">{{item.parsed.location || '—'}} · {{item.parsed.storage_condition || '—'}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        @if ((item.changes?.length || 0) > 0) {
                          @for (change of (item.changes || []).slice(0, 3); track change.field) {
                            <div class="mb-1"><strong>{{change.label}}:</strong> {{displayValue(change.before)}} → {{displayValue(change.after)}}</div>
                          }
                          @if ((item.changes?.length || 0) > 3) {
                            <div class="text-blue-600">+{{(item.changes || []).length - 3}} thay đổi khác</div>
                          }
                        } @else {
                          <div class="text-slate-400">Không đổi metadata</div>
                        }
                        @for (warning of item.warnings || []; track warning) {
                          <div class="text-amber-700 dark:text-amber-400 mt-1"><i class="fa-solid fa-triangle-exclamation mr-1"></i>{{warning}}</div>
                        }
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        @if (item.mode === 'CONFLICT') {
                          <span class="font-bold text-red-600">Xung đột — bị chặn</span>
                        } @else if (!item.isValid) {
                          <span class="font-bold text-red-600">{{item.errorMessage || 'Dữ liệu không hợp lệ'}}</span>
                        } @else if (item.mode === 'RESTORE') {
                          <span class="font-bold text-amber-600">Khôi phục chuẩn đã ẩn</span>
                        } @else if (item.mode === 'UPDATE_SAFE') {
                          <span class="font-bold text-blue-600 dark:text-blue-400">Cập nhật metadata an toàn</span>
                        } @else {
                          <span class="font-bold text-emerald-600 dark:text-emerald-400">Tạo mới</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @if (data().length > rowLimit()) {
              <div class="text-center mt-3">
                <button type="button" (click)="rowLimit.set(data().length)" class="text-xs font-bold text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  Hiển thị toàn bộ {{data().length}} dòng
                </button>
              </div>
            }
          </div>

          <footer class="px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 shrink-0">
            <button type="button" (click)="onCancel()" [disabled]="isImporting() || isParsing()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition disabled:opacity-50">Hủy bỏ</button>
            <button
              type="button"
              (click)="onConfirm()"
              [disabled]="!canConfirm()"
              class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              @if (isParsing()) {
                <i class="fa-solid fa-spinner fa-spin"></i> Đang đọc sheet...
              } @else if (isImporting()) {
                <i class="fa-solid fa-spinner fa-spin"></i> Đang commit...
              } @else {
                <i class="fa-solid fa-check"></i> Xác nhận Import {{validCount()}} dòng
              }
            </button>
          </footer>
        </div>
      </div>
    }
  `
            }]
    }], null, { dialogPanel: [{
            type: ViewChild,
            args: ['dialogPanel']
        }], handleKeyboard: [{
            type: HostListener,
            args: ['document:keydown', ['$event']]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsImportDataModalComponent, { className: "StandardsImportDataModalComponent", filePath: "src/app/features/standards/components/standards-import-data-modal.component.ts", lineNumber: 214 }); })();
//# sourceMappingURL=standards-import-data-modal.component.js.map