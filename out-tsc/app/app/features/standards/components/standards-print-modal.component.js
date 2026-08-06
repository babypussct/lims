import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = (a0, a1) => ({ "ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-transparent": a0, "border-slate-200 dark:border-slate-800": a1 });
const _c1 = (a0, a1, a2, a3) => ({ std: a0, fontSize: a1, width: a2, height: a3, isPrint: false });
const _c2 = (a0, a1, a2, a3) => ({ std: a0, fontSize: a1, width: a2, height: a3, isPrint: true });
const _forTrack0 = ($index, $item) => $item.id;
function StandardsPrintModalComponent_Conditional_0_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " In H\u00E0ng Lo\u1EA1t Nh\u00E3n ");
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " C\u00E0i \u0110\u1EB7t In Nh\u00E3n ");
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" \u0110\u00E3 ch\u1ECDn ", ctx_r1.standardsToPrint().length, " ch\u1EA5t chu\u1EA9n \u0111\u1EC3 in ");
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("title", ctx_r1.standardsToPrint()[0] ? ctx_r1.standardsToPrint()[0].name : "");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.standardsToPrint()[0] ? ctx_r1.standardsToPrint()[0].name : "Ch\u01B0a ch\u1ECDn ch\u1EA5t chu\u1EA9n", " ");
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_43_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 54)(1, "div")(2, "label", 55);
    i0.ɵɵtext(3, "R\u1ED9ng (mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 56);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_43_Conditional_17_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.printWidth.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div")(6, "label", 55);
    i0.ɵɵtext(7, "Cao (mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 56);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_43_Conditional_17_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.printHeight.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div")(10, "label", 55);
    i0.ɵɵtext(11, "Font (pt)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "input", 56);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_43_Conditional_17_Template_input_ngModelChange_12_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.printFontSize.set($event)); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printWidth());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printHeight());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printFontSize());
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_43_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "select", 45);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_43_Template_select_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPaperSizeChange($event)); });
    i0.ɵɵelementStart(1, "option", 46);
    i0.ɵɵtext(2, "Brother QL-800 DK-22205 (62 x 29 mm - Khuy\u00EAn d\u00F9ng)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "option", 47);
    i0.ɵɵtext(4, "Brother QL-800 DK-11201 (90 x 29 mm d\u1ECDc)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "option", 48);
    i0.ɵɵtext(6, "Brother QL-800 DK-11209 (62 x 62 mm vu\u00F4ng)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "option", 49);
    i0.ɵɵtext(8, "Tem chu\u1EA9n d\u00E1n n\u1EAFp (35 x 22 mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "option", 50);
    i0.ɵɵtext(10, "Tem nh\u1ECF mini (22 x 12 mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "option", 51);
    i0.ɵɵtext(12, "Tem trung (50 x 30 mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "option", 52);
    i0.ɵɵtext(14, "Tem l\u1EDBn (70 x 50 mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "option", 53);
    i0.ɵɵtext(16, "T\u00F9y ch\u1EC9nh k\u00EDch th\u01B0\u1EDBc...");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(17, StandardsPrintModalComponent_Conditional_0_Conditional_43_Conditional_17_Template, 13, 3, "div", 54);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngModel", ctx_r1.printPaperSize());
    i0.ɵɵadvance(17);
    i0.ɵɵconditional(ctx_r1.printPaperSize() === "custom" ? 17 : -1);
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_5_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 74)(1, "div")(2, "label", 55);
    i0.ɵɵtext(3, "S\u1ED1 c\u1ED9t (Cols)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 56);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_5_Conditional_9_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.fullSheetCols.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div")(6, "label", 55);
    i0.ɵɵtext(7, "S\u1ED1 d\u00F2ng (Rows)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 56);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_5_Conditional_9_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.fullSheetRows.set($event)); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.fullSheetCols());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.fullSheetRows());
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "select", 45);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_5_Template_select_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onFullSheetPresetChange($event)); });
    i0.ɵɵelementStart(1, "option", 71);
    i0.ɵɵtext(2, "L\u01B0\u1EDBi th\u00F4ng d\u1EE5ng 4x8 (32 nh\u00E3n - ~46x33 mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "option", 72);
    i0.ɵɵtext(4, "L\u01B0\u1EDBi nh\u00E3n l\u1EDBn 3x6 (18 nh\u00E3n - ~62x45 mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "option", 73);
    i0.ɵɵtext(6, "L\u01B0\u1EDBi nh\u00E3n ph\u1EE5 5x12 (60 nh\u00E3n - ~36x21 mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "option", 53);
    i0.ɵɵtext(8, "T\u1EF1 c\u1EA5u h\u00ECnh h\u00E0ng & c\u1ED9t...");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(9, StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_5_Conditional_9_Template, 9, 2, "div", 74);
    i0.ɵɵelementStart(10, "label", 75)(11, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_5_Template_input_ngModelChange_11_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.printShowCropMarks.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span", 25);
    i0.ɵɵtext(13, "Hi\u1EC3n th\u1ECB \u0111\u01B0\u1EDDng vi\u1EC1n h\u01B0\u1EDBng d\u1EABn c\u1EAFt (Crop Marks)");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngModel", ctx_r1.fullSheetPreset());
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(ctx_r1.fullSheetPreset() === "custom" ? 9 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r1.printShowCropMarks());
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "select", 76);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_6_Template_select_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onGridPresetChange($event)); });
    i0.ɵɵelementStart(1, "option", 77);
    i0.ɵɵtext(2, "Tomy 145 (65 nh\u00E3n - 5x13 | 38.1 x 21.2 mm - Ph\u1ED5 bi\u1EBFn)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "option", 78);
    i0.ɵɵtext(4, "Tomy 138 (100 nh\u00E3n - 5x20 | 40 x 14 mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "option", 79);
    i0.ɵɵtext(6, "Tomy 135 (24 nh\u00E3n - 3x8 | 47 x 22 mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "option", 80);
    i0.ɵɵtext(8, "Tomy 146 (18 nh\u00E3n - 3x6 | 62 x 42 mm)");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngModel", ctx_r1.gridPreset());
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 57)(1, "button", 58);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.a4PaperType.set("fullsheet")); });
    i0.ɵɵtext(2, " Nguy\u00EAn T\u1EA5m T\u1EF1 C\u1EAFt (Khuy\u00EAn D\u00F9ng) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 58);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.a4PaperType.set("precut")); });
    i0.ɵɵtext(4, " Chia \u00D4 S\u1EB5n (Tomy) ");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(5, StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_5_Template, 14, 3)(6, StandardsPrintModalComponent_Conditional_0_Conditional_44_Conditional_6_Template, 9, 1, "select", 59);
    i0.ɵɵelementStart(7, "div", 60)(8, "div")(9, "label", 55);
    i0.ɵɵtext(10, "B\u1EAFt \u0111\u1EA7u t\u1EEB \u00F4 nh\u00E3n s\u1ED1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 61)(12, "button", 62);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.gridStartIndex.set(ctx_r1.Math.max(1, ctx_r1.gridStartIndex() - 1))); });
    i0.ɵɵelement(13, "i", 63);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "input", 64);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Template_input_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onStartIndexInputChange($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "button", 65);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Conditional_44_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.gridStartIndex.set(ctx_r1.Math.min(ctx_r1.getGridPreset().rows * ctx_r1.getGridPreset().cols, ctx_r1.gridStartIndex() + 1))); });
    i0.ɵɵelement(16, "i", 66);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "div", 67)(18, "div", 68)(19, "span");
    i0.ɵɵtext(20, "V\u1ECB tr\u00ED b\u1EAFt \u0111\u1EA7u:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 69);
    i0.ɵɵtext(22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 70)(24, "span");
    i0.ɵɵtext(25, "D\u1EF1 ki\u1EBFn c\u1EA7n d\u00F9ng:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "span");
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("bg-white", ctx_r1.a4PaperType() === "fullsheet")("dark:bg-slate-700", ctx_r1.a4PaperType() === "fullsheet")("shadow-sm", ctx_r1.a4PaperType() === "fullsheet")("text-indigo-600", ctx_r1.a4PaperType() === "fullsheet")("dark:text-indigo-400", ctx_r1.a4PaperType() === "fullsheet");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("bg-white", ctx_r1.a4PaperType() === "precut")("dark:bg-slate-700", ctx_r1.a4PaperType() === "precut")("shadow-sm", ctx_r1.a4PaperType() === "precut")("text-indigo-600", ctx_r1.a4PaperType() === "precut")("dark:text-indigo-400", ctx_r1.a4PaperType() === "precut");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.a4PaperType() === "fullsheet" ? 5 : 6);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("ngModel", ctx_r1.gridStartIndex())("max", ctx_r1.getGridPreset().rows * ctx_r1.getGridPreset().cols);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("\u00D4 s\u1ED1 ", ctx_r1.gridStartIndex(), "");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.getRequiredA4Sheets(), " trang A4");
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_81_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26);
    i0.ɵɵelement(1, "i", 81);
    i0.ɵɵelementStart(2, "span")(3, "strong");
    i0.ɵɵtext(4, "L\u01B0u \u00FD:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5, " C\u1EE1 nh\u00E3n nh\u1ECF d\u00E1n nhi\u1EC1u th\u00F4ng tin c\u00F3 th\u1EC3 b\u1ECB tr\u00E0n ho\u1EB7c \u0111\u00E8 ch\u1EEF. B\u1EA1n n\u00EAn t\u1EAFt b\u1EDBt tr\u01B0\u1EDDng kh\u00F4ng qu\u00E1 quan tr\u1ECDng.");
    i0.ɵɵelementEnd()();
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_104_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_104_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 82);
    i0.ɵɵtemplate(1, StandardsPrintModalComponent_Conditional_0_Conditional_104_ng_container_1_Template, 1, 0, "ng-container", 83);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    const labelTemplate_r9 = i0.ɵɵreference(2);
    i0.ɵɵstyleProp("width", ctx_r1.printWidth(), "mm")("height", ctx_r1.printHeight(), "mm")("transform", "scale(" + ctx_r1.getPreviewScale() + ")");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngTemplateOutlet", labelTemplate_r9)("ngTemplateOutletContext", i0.ɵɵpureFunction4(8, _c1, ctx_r1.standardsToPrint()[0], ctx_r1.printFontSize(), ctx_r1.printWidth(), ctx_r1.printHeight()));
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_105_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 96);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Conditional_0_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r10); const slotIndex_r11 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.gridStartIndex.set(slotIndex_r11)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const slotIndex_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", slotIndex_r11, " ");
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 97);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Conditional_1_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r12); const slotIndex_r11 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.gridStartIndex.set(slotIndex_r11)); });
    i0.ɵɵelementStart(1, "div", 98);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 99)(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span");
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 100);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    const slotIndex_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", (tmp_14_0 = ctx_r1.getStandardForSlot(slotIndex_r11)) == null ? null : tmp_14_0.name, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("L: ", ((tmp_15_0 = ctx_r1.getStandardForSlot(slotIndex_r11)) == null ? null : tmp_15_0.lot_number) || "N/A", "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("E: ", ((tmp_16_0 = ctx_r1.getStandardForSlot(slotIndex_r11)) == null ? null : tmp_16_0.expiry_date) ? i0.ɵɵpipeBind2(8, 4, (tmp_16_0 = ctx_r1.getStandardForSlot(slotIndex_r11)) == null ? null : tmp_16_0.expiry_date, "dd/MM/yy") : "N/A", "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", slotIndex_r11, " ");
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 101);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Conditional_2_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r13); const slotIndex_r11 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.gridStartIndex.set(slotIndex_r11)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const slotIndex_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", slotIndex_r11, " ");
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Conditional_0_Template, 2, 1, "div", 93)(1, StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Conditional_1_Template, 11, 7, "div", 94)(2, StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Conditional_2_Template, 2, 1, "div", 95);
} if (rf & 2) {
    const slotIndex_r11 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional(slotIndex_r11 < ctx_r1.gridStartIndex() ? 0 : slotIndex_r11 >= ctx_r1.gridStartIndex() && slotIndex_r11 < ctx_r1.gridStartIndex() + ctx_r1.standardsToPrint().length * ctx_r1.printCopies() ? 1 : 2);
} }
function StandardsPrintModalComponent_Conditional_0_Conditional_105_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 43)(1, "div", 84);
    i0.ɵɵelement(2, "i", 85);
    i0.ɵɵtext(3, " \u0110\u1ED9 n\u00E9t th\u1EF1c t\u1EBF nh\u00E3n \u0111\u01A1n m\u1EABu ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 86);
    i0.ɵɵtemplate(5, StandardsPrintModalComponent_Conditional_0_Conditional_105_ng_container_5_Template, 1, 0, "ng-container", 83);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 87)(7, "span", 61);
    i0.ɵɵelement(8, "i", 88);
    i0.ɵɵtext(9, " M\u00F4 ph\u1ECFng t\u1EA5m A4 Decal");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span", 89);
    i0.ɵɵtext(11, "(Click \u0111\u1EC3 \u0111\u1ED5i \u0111i\u1EC3m b\u1EAFt \u0111\u1EA7u)");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 90)(13, "div", 91)(14, "div", 92);
    i0.ɵɵrepeaterCreate(15, StandardsPrintModalComponent_Conditional_0_Conditional_105_For_16_Template, 3, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    const labelTemplate_r9 = i0.ɵɵreference(2);
    i0.ɵɵadvance(4);
    i0.ɵɵstyleProp("width", ctx_r1.getGridPreset().width, "mm")("height", ctx_r1.getGridPreset().height, "mm")("transform", "scale(" + (ctx_r1.getGridPreset().width <= 40 ? 2.5 : 1.9) + ")");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngTemplateOutlet", labelTemplate_r9)("ngTemplateOutletContext", i0.ɵɵpureFunction4(24, _c1, ctx_r1.standardsToPrint()[0], ctx_r1.getGridPreset().fontSize, ctx_r1.getGridPreset().width, ctx_r1.getGridPreset().height));
    i0.ɵɵadvance(8);
    i0.ɵɵstyleProp("width", 210, "mm")("height", 297, "mm");
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("padding-top", ctx_r1.getGridPreset().topMargin, "mm")("padding-left", ctx_r1.getGridPreset().leftMargin, "mm")("grid-template-columns", "repeat(" + ctx_r1.getGridPreset().cols + ", " + ctx_r1.getGridPreset().width + "mm)")("grid-auto-rows", ctx_r1.getGridPreset().height + "mm")("row-gap", ctx_r1.getGridPreset().rowGap, "mm")("column-gap", ctx_r1.getGridPreset().colGap, "mm");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.getGridSlots());
} }
function StandardsPrintModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 1)(1, "div", 3)(2, "div", 4)(3, "div")(4, "div", 5)(5, "div", 6);
    i0.ɵɵelement(6, "i", 7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div")(8, "h3", 8);
    i0.ɵɵtemplate(9, StandardsPrintModalComponent_Conditional_0_Conditional_9_Template, 1, 0)(10, StandardsPrintModalComponent_Conditional_0_Conditional_10_Template, 1, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, StandardsPrintModalComponent_Conditional_0_Conditional_11_Template, 2, 1, "p", 9)(12, StandardsPrintModalComponent_Conditional_0_Conditional_12_Template, 2, 2, "p", 10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 11)(14, "button", 12);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printLayoutMode.set("roll")); });
    i0.ɵɵelement(15, "i", 13);
    i0.ɵɵtext(16, " In Cu\u1ED9n (Brother QL) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "button", 12);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printLayoutMode.set("grid")); });
    i0.ɵɵelement(18, "i", 14);
    i0.ɵɵtext(19, " In T\u1EA5m A4 Decal ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 15)(21, "div")(22, "label", 16);
    i0.ɵɵtext(23, "M\u1EABu hi\u1EC3n th\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "div", 17)(25, "button", 18);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onTemplateChange("standard")); });
    i0.ɵɵelementStart(26, "div", 19);
    i0.ɵɵtext(27, "Ti\u00EAu Chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div", 20);
    i0.ɵɵtext(29, "Th\u00F4ng Tin C\u01A1 B\u1EA3n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "button", 18);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onTemplateChange("detailed")); });
    i0.ɵɵelementStart(31, "div", 19);
    i0.ɵɵtext(32, "Chi Ti\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "div", 20);
    i0.ɵɵtext(34, "\u0110\u1EA7y \u0110\u1EE7 Th\u00F4ng Tin");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "button", 18);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Template_button_click_35_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onTemplateChange("qr")); });
    i0.ɵɵelementStart(36, "div", 19);
    i0.ɵɵtext(37, "K\u00E8m M\u00E3 QR");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "div", 20);
    i0.ɵɵtext(39, "Qu\u00E9t Truy Xu\u1EA5t Nhanh");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(40, "div")(41, "label", 16);
    i0.ɵɵtext(42, "K\u00EDch th\u01B0\u1EDBc nh\u00E3n");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(43, StandardsPrintModalComponent_Conditional_0_Conditional_43_Template, 18, 2)(44, StandardsPrintModalComponent_Conditional_0_Conditional_44_Template, 28, 25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "div")(46, "label", 21);
    i0.ɵɵtext(47, "Th\u00F4ng tin hi\u1EC3n th\u1ECB tr\u00EAn nh\u00E3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "div", 22)(49, "label", 23)(50, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Template_input_ngModelChange_50_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printIncludeName.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "span", 25);
    i0.ɵɵtext(52, "T\u00EAn chu\u1EA9n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(53, "label", 23)(54, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Template_input_ngModelChange_54_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printIncludeLot.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "span", 25);
    i0.ɵɵtext(56, "S\u1ED1 Lot");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(57, "label", 23)(58, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Template_input_ngModelChange_58_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printIncludePurity.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(59, "span", 25);
    i0.ɵɵtext(60, "\u0110\u1ED9 tinh khi\u1EBFt");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(61, "label", 23)(62, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Template_input_ngModelChange_62_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printIncludeOpened.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "span", 25);
    i0.ɵɵtext(64, "Ng\u00E0y m\u1EDF n\u1EAFp");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(65, "label", 23)(66, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Template_input_ngModelChange_66_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printIncludeExpiry.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(67, "span", 25);
    i0.ɵɵtext(68, "H\u1EA1n s\u1EED d\u1EE5ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(69, "label", 23)(70, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Template_input_ngModelChange_70_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printIncludeStorage.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(71, "span", 25);
    i0.ɵɵtext(72, "\u0110k b\u1EA3o qu\u1EA3n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(73, "label", 23)(74, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Template_input_ngModelChange_74_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printIncludeManufacturer.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(75, "span", 25);
    i0.ɵɵtext(76, "H\u00E3ng s\u1EA3n xu\u1EA5t");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(77, "label", 23)(78, "input", 24);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Template_input_ngModelChange_78_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printIncludeCas.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(79, "span", 25);
    i0.ɵɵtext(80, "Ch\u1EC9 s\u1ED1 CAS");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(81, StandardsPrintModalComponent_Conditional_0_Conditional_81_Template, 6, 0, "div", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(82, "div", 27)(83, "div")(84, "label", 28);
    i0.ɵɵtext(85, "S\u1ED1 b\u1EA3n in m\u1ED7i lo\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(86, "span", 29);
    i0.ɵɵtext(87);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(88, "div", 30)(89, "button", 31);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Template_button_click_89_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printCopies.set(ctx_r1.Math.max(1, ctx_r1.printCopies() - 1))); });
    i0.ɵɵelement(90, "i", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(91, "input", 33);
    i0.ɵɵlistener("ngModelChange", function StandardsPrintModalComponent_Conditional_0_Template_input_ngModelChange_91_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printCopies.set(ctx_r1.Math.max(1, $event))); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(92, "button", 31);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Template_button_click_92_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printCopies.set(ctx_r1.printCopies() + 1)); });
    i0.ɵɵelement(93, "i", 34);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(94, "div", 35)(95, "button", 36);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Template_button_click_95_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(96, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(97, "button", 37);
    i0.ɵɵlistener("click", function StandardsPrintModalComponent_Conditional_0_Template_button_click_97_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printLabel()); });
    i0.ɵɵelement(98, "i", 38);
    i0.ɵɵtext(99);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(100, "div", 39)(101, "div", 40);
    i0.ɵɵelement(102, "i", 41);
    i0.ɵɵtext(103, " B\u1EA3n Xem Tr\u01B0\u1EDBc Tr\u1EF1c Quan ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(104, StandardsPrintModalComponent_Conditional_0_Conditional_104_Template, 2, 13, "div", 42)(105, StandardsPrintModalComponent_Conditional_0_Conditional_105_Template, 17, 29, "div", 43);
    i0.ɵɵelementStart(106, "div", 44);
    i0.ɵɵtext(107, " Xem tr\u01B0\u1EDBc mang t\u00EDnh t\u01B0\u01A1ng \u0111\u1ED1i. Ch\u1EA5t l\u01B0\u1EE3ng v\u00E0 v\u1ECB tr\u00ED in th\u1EF1c t\u1EBF ph\u1EE5 thu\u1ED9c c\u1EA5u h\u00ECnh kh\u1ED5 m\u00E1y in c\u1EE7a b\u1EA1n. ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(ctx_r1.standardsToPrint().length > 1 ? 9 : 10);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.standardsToPrint().length > 1 ? 11 : 12);
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("bg-white", ctx_r1.printLayoutMode() === "roll")("dark:bg-slate-700", ctx_r1.printLayoutMode() === "roll")("shadow-sm", ctx_r1.printLayoutMode() === "roll")("text-indigo-650", ctx_r1.printLayoutMode() === "roll")("dark:text-indigo-400", ctx_r1.printLayoutMode() === "roll");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("bg-white", ctx_r1.printLayoutMode() === "grid")("dark:bg-slate-700", ctx_r1.printLayoutMode() === "grid")("shadow-sm", ctx_r1.printLayoutMode() === "grid")("text-indigo-650", ctx_r1.printLayoutMode() === "grid")("dark:text-indigo-400", ctx_r1.printLayoutMode() === "grid");
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(39, _c0, ctx_r1.printTemplate() === "standard", ctx_r1.printTemplate() !== "standard"));
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(42, _c0, ctx_r1.printTemplate() === "detailed", ctx_r1.printTemplate() !== "detailed"));
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(45, _c0, ctx_r1.printTemplate() === "qr", ctx_r1.printTemplate() !== "qr"));
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(ctx_r1.printLayoutMode() === "roll" ? 43 : 44);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngModel", ctx_r1.printIncludeName());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printIncludeLot());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printIncludePurity());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printIncludeOpened());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printIncludeExpiry());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printIncludeStorage());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printIncludeManufacturer());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printIncludeCas());
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.showOverflowWarning() ? 81 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("T\u1ED5ng c\u1ED9ng: ", ctx_r1.standardsToPrint().length * ctx_r1.printCopies(), " nh\u00E3n chu\u1EA9n");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.printCopies());
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1(" Ti\u1EBFn H\u00E0nh In Nh\u00E3n (", ctx_r1.standardsToPrint().length * ctx_r1.printCopies(), ") ");
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.printLayoutMode() === "roll" ? 104 : 105);
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 111);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r13 = i0.ɵɵnextContext(2);
    const std_r15 = ctx_r13.std;
    const fontSize_r16 = ctx_r13.fontSize;
    i0.ɵɵstyleProp("font-size", fontSize_r16 + 1.2, "pt");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", std_r15 == null ? null : std_r15.name, " ");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 107);
    i0.ɵɵtext(1, "Lot: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(2).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.lot_number) || "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 107);
    i0.ɵɵtext(1, "Pur: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(2).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.purity) || "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 107);
    i0.ɵɵtext(1, "Opn: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(2).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.date_opened) ? i0.ɵɵpipeBind2(4, 1, std_r15 == null ? null : std_r15.date_opened, "dd/MM/yy") : "__/__/__");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 107);
    i0.ɵɵtext(1, "Exp: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(2).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.expiry_date) ? i0.ɵɵpipeBind2(4, 1, std_r15 == null ? null : std_r15.expiry_date, "dd/MM/yy") : "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 108);
    i0.ɵɵtext(1, "Store: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(2).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.storage_condition) || "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 103)(1, "div", 105);
    i0.ɵɵtemplate(2, StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_2_Template, 2, 3, "div", 106)(3, StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_3_Template, 4, 1, "div", 107)(4, StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_4_Template, 4, 1, "div", 107)(5, StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_5_Template, 5, 4, "div", 107)(6, StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_6_Template, 5, 4, "div", 107)(7, StandardsPrintModalComponent_ng_template_1_Conditional_1_Conditional_7_Template, 4, 1, "div", 108);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 109);
    i0.ɵɵelement(9, "img", 110);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r13 = i0.ɵɵnextContext();
    const std_r15 = ctx_r13.std;
    const height_r17 = ctx_r13.height;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.printIncludeName() ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeLot() ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludePurity() ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeOpened() ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeExpiry() ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeStorage() ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("width", height_r17 - 3.5, "mm")("height", height_r17 - 3.5, "mm");
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.getQrCodeUrl(std_r15), i0.ɵɵsanitizeUrl);
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 111);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r13 = i0.ɵɵnextContext(2);
    const std_r15 = ctx_r13.std;
    const fontSize_r16 = ctx_r13.fontSize;
    i0.ɵɵstyleProp("font-size", fontSize_r16 + 1.2, "pt");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", std_r15 == null ? null : std_r15.name, " ");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_2_Conditional_0_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 115);
    i0.ɵɵtext(1, "CAS: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(4).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.cas_number) || "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_2_Conditional_0_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 116);
    i0.ɵɵtext(1, "Mfr: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(4).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.manufacturer) || "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_2_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 113);
    i0.ɵɵtemplate(1, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_2_Conditional_0_Conditional_1_Template, 4, 1, "span", 115)(2, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_2_Conditional_0_Conditional_2_Template, 4, 1, "span", 116);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeCas() ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeManufacturer() ? 2 : -1);
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_2_Conditional_0_Template, 3, 2, "div", 113);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional(ctx_r1.printIncludeCas() || ctx_r1.printIncludeManufacturer() ? 0 : -1);
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_3_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 115);
    i0.ɵɵtext(1, "Lot: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(3).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.lot_number) || "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_3_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 116);
    i0.ɵɵtext(1, "Pur: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(3).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.purity) || "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 113);
    i0.ɵɵtemplate(1, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_3_Conditional_1_Template, 4, 1, "span", 115)(2, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_3_Conditional_2_Template, 4, 1, "span", 116);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeLot() ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludePurity() ? 2 : -1);
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_4_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 115);
    i0.ɵɵtext(1, "Opn: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(3).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.date_opened) ? i0.ɵɵpipeBind2(4, 1, std_r15 == null ? null : std_r15.date_opened, "dd/MM/yy") : "__/__/__");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_4_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 116);
    i0.ɵɵtext(1, "Exp: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(3).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.expiry_date) ? i0.ɵɵpipeBind2(4, 1, std_r15 == null ? null : std_r15.expiry_date, "dd/MM/yy") : "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 113);
    i0.ɵɵtemplate(1, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_4_Conditional_1_Template, 5, 4, "span", 115)(2, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_4_Conditional_2_Template, 5, 4, "span", 116);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeOpened() ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeExpiry() ? 2 : -1);
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 114);
    i0.ɵɵtext(1, " Store: ");
    i0.ɵɵelementStart(2, "span", 112);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const std_r15 = i0.ɵɵnextContext(2).std;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((std_r15 == null ? null : std_r15.storage_condition) || "N/A");
} }
function StandardsPrintModalComponent_ng_template_1_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 104);
    i0.ɵɵtemplate(1, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_1_Template, 2, 3, "div", 106)(2, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_2_Template, 1, 1)(3, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_3_Template, 3, 2, "div", 113)(4, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_4_Template, 3, 2, "div", 113)(5, StandardsPrintModalComponent_ng_template_1_Conditional_2_Conditional_5_Template, 4, 1, "div", 114);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeName() ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printTemplate() === "detailed" ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeLot() || ctx_r1.printIncludePurity() ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeOpened() || ctx_r1.printIncludeExpiry() ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printIncludeStorage() ? 5 : -1);
} }
function StandardsPrintModalComponent_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 102);
    i0.ɵɵtemplate(1, StandardsPrintModalComponent_ng_template_1_Conditional_1_Template, 10, 11, "div", 103)(2, StandardsPrintModalComponent_ng_template_1_Conditional_2_Template, 6, 5, "div", 104);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const fontSize_r16 = ctx.fontSize;
    const width_r18 = ctx.width;
    const height_r17 = ctx.height;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("width", width_r18, "mm")("height", height_r17, "mm")("padding", 1.5, "mm")("font-size", fontSize_r16, "pt");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printTemplate() === "qr" ? 1 : 2);
} }
function StandardsPrintModalComponent_For_5_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function StandardsPrintModalComponent_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵtemplate(1, StandardsPrintModalComponent_For_5_ng_container_1_Template, 1, 0, "ng-container", 83);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const stdItem_r19 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    const labelTemplate_r9 = i0.ɵɵreference(2);
    i0.ɵɵattribute("id", "print-ref-" + stdItem_r19.id);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngTemplateOutlet", labelTemplate_r9)("ngTemplateOutletContext", i0.ɵɵpureFunction4(3, _c2, stdItem_r19, ctx_r1.printLayoutMode() === "roll" ? ctx_r1.printFontSize() : ctx_r1.getGridPreset().fontSize, ctx_r1.printLayoutMode() === "roll" ? ctx_r1.printWidth() : ctx_r1.getGridPreset().width, ctx_r1.printLayoutMode() === "roll" ? ctx_r1.printHeight() : ctx_r1.getGridPreset().height));
} }
export class StandardsPrintModalComponent {
    constructor() {
        this.std = input(null);
        this.standards = input([]);
        this.isOpen = input(false);
        this.closeModal = output();
        // ---- DUAL MODE PRINT SETTINGS ----
        this.printLayoutMode = signal('roll');
        this.printPaperSize = signal('62x29_ql800');
        this.printWidth = signal(62);
        this.printHeight = signal(29);
        this.printTemplate = signal('detailed');
        this.printCopies = signal(1);
        this.printFontSize = signal(7);
        this.Math = Math;
        // A4 Grid settings
        this.a4PaperType = signal('fullsheet'); // Default to A4 full sticker sheets
        this.gridPreset = signal('tomy_145');
        this.gridStartIndex = signal(1);
        // Fullsheet specific settings
        this.fullSheetPreset = signal('medium');
        this.fullSheetCols = signal(4);
        this.fullSheetRows = signal(8);
        this.printShowCropMarks = signal(true); // Cutting guide lines
        // Toggleable Print Fields
        this.printIncludeName = signal(true);
        this.printIncludeLot = signal(true);
        this.printIncludePurity = signal(true);
        this.printIncludeOpened = signal(true);
        this.printIncludeExpiry = signal(true);
        this.printIncludeStorage = signal(true);
        this.printIncludeManufacturer = signal(true);
        this.printIncludeCas = signal(true);
        this.standardsToPrint = computed(() => {
            const list = this.standards();
            if (list && list.length > 0)
                return list;
            const single = this.std();
            return single ? [single] : [];
        });
        // Pre-cut Presets mapping (Tomy)
        this.GRID_PRESETS = {
            tomy_145: {
                id: 'tomy_145',
                name: 'Tomy 145 (65 nhãn - 5x13)',
                rows: 13,
                cols: 5,
                width: 38.1,
                height: 21.2,
                topMargin: 10.5,
                leftMargin: 9.5,
                rowGap: 0,
                colGap: 2.5,
                fontSize: 5.5
            },
            tomy_138: {
                id: 'tomy_138',
                name: 'Tomy 138 (100 nhãn - 5x20)',
                rows: 20,
                cols: 5,
                width: 40.0,
                height: 14.0,
                topMargin: 8.5,
                leftMargin: 5.0,
                rowGap: 0.5,
                colGap: 2.5,
                fontSize: 4.5
            },
            tomy_135: {
                id: 'tomy_135',
                name: 'Tomy 135 (24 nhãn - 3x8)',
                rows: 8,
                cols: 3,
                width: 47.0,
                height: 22.0,
                topMargin: 20.0,
                leftMargin: 34.5,
                rowGap: 0,
                colGap: 2.0,
                fontSize: 6.5
            },
            tomy_146: {
                id: 'tomy_146',
                name: 'Tomy 146 (18 nhãn - 3x6)',
                rows: 6,
                cols: 3,
                width: 62.0,
                height: 42.0,
                topMargin: 22.0,
                leftMargin: 12.0,
                rowGap: 0,
                colGap: 2.0,
                fontSize: 8.0
            }
        };
        this.ROLL_PRESETS = {
            '62x29_ql800': { id: '62x29_ql800', name: 'Brother QL-800 DK-22205 (62 x 29 mm)', width: 62, height: 29, fontSize: 7 },
            '90x29_ql800': { id: '90x29_ql800', name: 'Brother QL-800 DK-11201 (90 x 29 mm)', width: 90, height: 29, fontSize: 7 },
            '62x62_ql800': { id: '62x62_ql800', name: 'Brother QL-800 DK-11209 (62 x 62 mm)', width: 62, height: 62, fontSize: 9 },
            '35x22': { id: '35x22', name: 'Tem chuẩn (35 x 22 mm)', width: 35, height: 22, fontSize: 6 },
            '22x12': { id: '22x12', name: 'Tem nhỏ (22 x 12 mm)', width: 22, height: 12, fontSize: 4.5 },
            '50x30': { id: '50x30', name: 'Tem trung (50 x 30 mm)', width: 50, height: 30, fontSize: 8 },
            '70x50': { id: '70x50', name: 'Tem lớn (70 x 50 mm)', width: 70, height: 50, fontSize: 10 }
        };
        this.showOverflowWarning = computed(() => {
            const height = this.printLayoutMode() === 'roll' ? this.printHeight() : this.getGridPreset().height;
            const activeFieldsCount = (this.printIncludeName() ? 1 : 0) +
                (this.printIncludeLot() ? 1 : 0) +
                (this.printIncludePurity() ? 1 : 0) +
                (this.printIncludeOpened() ? 1 : 0) +
                (this.printIncludeExpiry() ? 1 : 0) +
                (this.printIncludeStorage() ? 1 : 0) +
                (this.printIncludeManufacturer() ? 1 : 0) +
                (this.printIncludeCas() ? 1 : 0);
            return height < 20 && activeFieldsCount > 4;
        });
    }
    onClose() {
        this.closeModal.emit();
    }
    getGridPreset() {
        if (this.printLayoutMode() === 'grid' && this.a4PaperType() === 'fullsheet') {
            const presetType = this.fullSheetPreset();
            let cols = 4;
            let rows = 8;
            let fontSize = 6.5;
            if (presetType === 'large') {
                cols = 3;
                rows = 6;
                fontSize = 8;
            }
            else if (presetType === 'small') {
                cols = 5;
                rows = 12;
                fontSize = 5;
            }
            else if (presetType === 'custom') {
                cols = Math.max(1, this.fullSheetCols() || 4);
                rows = Math.max(1, this.fullSheetRows() || 8);
                const estHeight = (277 - (rows - 1) * 1.5) / rows;
                fontSize = estHeight < 16 ? 4.5 : estHeight < 25 ? 6 : 7.5;
            }
            const margin = 10; // 10mm safe print border
            const gap = 1.5; // 1.5mm space between stickers
            const width = (210 - (margin * 2) - (cols - 1) * gap) / cols;
            const height = (297 - (margin * 2) - (rows - 1) * gap) / rows;
            return {
                id: `fullsheet_calculated_${cols}x${rows}`,
                name: `Nguyên tấm tự cắt (${cols}x${rows})`,
                rows: rows,
                cols: cols,
                width: Number(width.toFixed(1)),
                height: Number(height.toFixed(1)),
                topMargin: margin,
                leftMargin: margin,
                rowGap: gap,
                colGap: gap,
                fontSize: fontSize
            };
        }
        // Default pre-cut presets (Tomy)
        return this.GRID_PRESETS[this.gridPreset()] || this.GRID_PRESETS['tomy_145'];
    }
    getGridSlots() {
        const preset = this.getGridPreset();
        const totalSlots = preset.rows * preset.cols;
        const slots = [];
        for (let i = 1; i <= totalSlots; i++) {
            slots.push(i);
        }
        return slots;
    }
    getRequiredA4Sheets() {
        const preset = this.getGridPreset();
        const totalSlots = (this.gridStartIndex() - 1) + (this.standardsToPrint().length * this.printCopies());
        const labelsPerPage = preset.rows * preset.cols;
        return Math.ceil(totalSlots / labelsPerPage);
    }
    getStandardForSlot(slotIndex) {
        const startIndex = this.gridStartIndex();
        const copies = this.printCopies();
        const list = this.standardsToPrint();
        if (slotIndex < startIndex || slotIndex >= startIndex + (list.length * copies)) {
            return null;
        }
        const relativeIndex = slotIndex - startIndex;
        const stdIndex = Math.floor(relativeIndex / copies);
        return list[stdIndex] || null;
    }
    getQrCodeUrl(std) {
        if (!std || !std.id)
            return '';
        const originUrl = window.location.origin;
        const url = `${originUrl}/#/standards/${std.id}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
    }
    onPaperSizeChange(size) {
        this.printPaperSize.set(size);
        if (size === 'custom')
            return;
        const preset = this.ROLL_PRESETS[size];
        if (preset) {
            this.printWidth.set(preset.width);
            this.printHeight.set(preset.height);
            this.printFontSize.set(preset.fontSize);
        }
    }
    onGridPresetChange(presetId) {
        this.gridPreset.set(presetId);
        this.gridStartIndex.set(1);
    }
    onFullSheetPresetChange(preset) {
        this.fullSheetPreset.set(preset);
        this.gridStartIndex.set(1);
        if (preset === 'large') {
            this.fullSheetCols.set(3);
            this.fullSheetRows.set(6);
        }
        else if (preset === 'medium') {
            this.fullSheetCols.set(4);
            this.fullSheetRows.set(8);
        }
        else if (preset === 'small') {
            this.fullSheetCols.set(5);
            this.fullSheetRows.set(12);
        }
    }
    onStartIndexInputChange(val) {
        const maxVal = this.getGridPreset().rows * this.getGridPreset().cols;
        this.gridStartIndex.set(Math.max(1, Math.min(maxVal, val || 1)));
    }
    onTemplateChange(template) {
        this.printTemplate.set(template);
        if (template === 'standard') {
            this.printIncludeManufacturer.set(false);
            this.printIncludeCas.set(false);
        }
        else if (template === 'detailed') {
            this.printIncludeManufacturer.set(true);
            this.printIncludeCas.set(true);
        }
        else if (template === 'qr') {
            this.printIncludeManufacturer.set(false);
            this.printIncludeCas.set(false);
            const currentH = this.printLayoutMode() === 'roll' ? this.printHeight() : this.getGridPreset().height;
            if (currentH <= 15) {
                this.printIncludeStorage.set(false);
                this.printIncludeOpened.set(false);
            }
        }
    }
    getPreviewScale() {
        const currentW = this.printWidth();
        if (currentW <= 25)
            return 3.5;
        if (currentW <= 40)
            return 2.6;
        if (currentW <= 62)
            return 2.0;
        return 1.4;
    }
    printLabel() {
        const list = this.standardsToPrint();
        const copies = this.printCopies();
        if (list.length === 0)
            return;
        // Create print block wrapper
        const printArea = document.createElement('div');
        printArea.id = 'print-area';
        printArea.style.position = 'fixed';
        printArea.style.top = '0';
        printArea.style.left = '0';
        printArea.style.width = '100%';
        printArea.style.height = '100%';
        printArea.style.zIndex = '9999999';
        printArea.style.backgroundColor = 'white';
        if (this.printLayoutMode() === 'roll') {
            // Roll label printer DK (Brother QL-800, Dymo...)
            printArea.style.display = 'block';
            for (const stdItem of list) {
                const ref = document.querySelector(`#print-ref-${stdItem.id} > div`);
                if (!ref)
                    continue;
                for (let i = 0; i < copies; i++) {
                    // Wrapper element to isolate flex/grid layout page-breaking issues in Chromium
                    const wrapper = document.createElement('div');
                    wrapper.style.width = `${this.printWidth()}mm`;
                    wrapper.style.height = `${this.printHeight()}mm`;
                    wrapper.style.display = 'block';
                    wrapper.style.margin = '0';
                    wrapper.style.padding = '0';
                    wrapper.style.pageBreakAfter = 'always';
                    wrapper.style.breakAfter = 'page';
                    wrapper.style.pageBreakInside = 'avoid';
                    wrapper.style.breakInside = 'avoid';
                    wrapper.style.overflow = 'hidden';
                    wrapper.style.backgroundColor = 'white';
                    const clonedNode = ref.cloneNode(true);
                    clonedNode.style.boxShadow = 'none';
                    clonedNode.style.border = 'none';
                    clonedNode.style.transform = 'none';
                    clonedNode.style.width = '100%';
                    clonedNode.style.height = '100%';
                    clonedNode.style.margin = '0';
                    wrapper.appendChild(clonedNode);
                    printArea.appendChild(wrapper);
                }
            }
        }
        else {
            // A4 decal sheets
            const preset = this.getGridPreset();
            const labelsPerPage = preset.rows * preset.cols;
            const startIndex = this.gridStartIndex();
            // Form sequential label printing queue
            const labelQueue = [];
            for (const stdItem of list) {
                for (let c = 0; c < copies; c++) {
                    labelQueue.push(stdItem);
                }
            }
            const totalSlots = (startIndex - 1) + labelQueue.length;
            const totalPages = Math.ceil(totalSlots / labelsPerPage);
            let queueIndex = 0;
            for (let p = 0; p < totalPages; p++) {
                // Wrapper to ensure Chromium honors page breaks for grid elements
                const wrapper = document.createElement('div');
                wrapper.style.width = '210mm';
                wrapper.style.height = '297mm';
                wrapper.style.display = 'block';
                wrapper.style.margin = '0';
                wrapper.style.padding = '0';
                wrapper.style.pageBreakAfter = 'always';
                wrapper.style.breakAfter = 'page';
                wrapper.style.pageBreakInside = 'avoid';
                wrapper.style.breakInside = 'avoid';
                wrapper.style.overflow = 'hidden';
                wrapper.style.backgroundColor = 'white';
                const pageEl = document.createElement('div');
                pageEl.style.width = '210mm';
                pageEl.style.height = '297mm';
                pageEl.style.boxSizing = 'border-box';
                pageEl.style.paddingTop = `${preset.topMargin}mm`;
                pageEl.style.paddingLeft = `${preset.leftMargin}mm`;
                pageEl.style.display = 'grid';
                pageEl.style.gridTemplateColumns = `repeat(${preset.cols}, ${preset.width}mm)`;
                pageEl.style.gridAutoRows = `${preset.height}mm`;
                pageEl.style.rowGap = `${preset.rowGap}mm`;
                pageEl.style.columnGap = `${preset.colGap}mm`;
                pageEl.style.backgroundColor = 'white';
                pageEl.style.overflow = 'hidden';
                if (p === 0) {
                    // First page: insert empty spaces up to startIndex - 1
                    for (let s = 1; s < startIndex; s++) {
                        const spacer = document.createElement('div');
                        spacer.style.width = `${preset.width}mm`;
                        spacer.style.height = `${preset.height}mm`;
                        spacer.style.visibility = 'hidden';
                        pageEl.appendChild(spacer);
                    }
                    // Add labels for page 1
                    const firstPageSlotsAvailable = labelsPerPage - (startIndex - 1);
                    const firstPageLabels = Math.min(labelQueue.length, firstPageSlotsAvailable);
                    for (let c = 0; c < firstPageLabels; c++) {
                        const stdItem = labelQueue[queueIndex++];
                        const ref = document.querySelector(`#print-ref-${stdItem.id} > div`);
                        if (!ref)
                            continue;
                        const clone = ref.cloneNode(true);
                        clone.style.boxShadow = 'none';
                        clone.style.width = `${preset.width}mm`;
                        clone.style.height = `${preset.height}mm`;
                        // Inject crop borders if fullsheet and crop marks enabled
                        if (this.a4PaperType() === 'fullsheet') {
                            if (this.printShowCropMarks()) {
                                clone.style.border = '0.3mm dashed #cbd5e1';
                            }
                            else {
                                clone.style.border = 'none';
                            }
                        }
                        else {
                            clone.style.border = 'none';
                        }
                        pageEl.appendChild(clone);
                    }
                }
                else {
                    // Subsequent pages
                    const remaining = labelQueue.length - queueIndex;
                    const pageKLabels = Math.min(remaining, labelsPerPage);
                    for (let c = 0; c < pageKLabels; c++) {
                        const stdItem = labelQueue[queueIndex++];
                        const ref = document.querySelector(`#print-ref-${stdItem.id} > div`);
                        if (!ref)
                            continue;
                        const clone = ref.cloneNode(true);
                        clone.style.boxShadow = 'none';
                        clone.style.width = `${preset.width}mm`;
                        clone.style.height = `${preset.height}mm`;
                        if (this.a4PaperType() === 'fullsheet') {
                            if (this.printShowCropMarks()) {
                                clone.style.border = '0.3mm dashed #cbd5e1';
                            }
                            else {
                                clone.style.border = 'none';
                            }
                        }
                        else {
                            clone.style.border = 'none';
                        }
                        pageEl.appendChild(clone);
                    }
                }
                wrapper.appendChild(pageEl);
                printArea.appendChild(wrapper);
            }
        }
        document.body.appendChild(printArea);
        const style = document.createElement('style');
        style.id = 'print-style';
        if (this.printLayoutMode() === 'roll') {
            style.textContent = `
            @media print {
                @page { size: ${this.printWidth()}mm ${this.printHeight()}mm; margin: 0; }
                #print-area { display: block !important; }
                body, html { 
                    margin: 0 !important; 
                    padding: 0 !important; 
                    overflow: hidden !important; 
                    background-color: white !important;
                }
                body > *:not(#print-area) { display: none !important; }
                #print-reference-container, #print-preview-container {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                }
            }
        `;
        }
        else {
            style.textContent = `
            @media print {
                @page { size: A4 portrait; margin: 0; }
                #print-area { display: block !important; }
                body, html { 
                    margin: 0 !important; 
                    padding: 0 !important; 
                    overflow: hidden !important; 
                    background-color: white !important;
                }
                body > *:not(#print-area) { display: none !important; }
                #print-reference-container, #print-preview-container {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                }
            }
        `;
        }
        document.head.appendChild(style);
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.body.removeChild(printArea);
                document.head.removeChild(style);
            }, 800);
        }, 150);
    }
    static { this.ɵfac = function StandardsPrintModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsPrintModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsPrintModalComponent, selectors: [["app-standards-print-modal"]], inputs: { std: [1, "std"], standards: [1, "standards"], isOpen: [1, "isOpen"] }, outputs: { closeModal: "closeModal" }, decls: 6, vars: 1, consts: [["labelTemplate", ""], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], ["id", "print-reference-container", 2, "display", "none"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "shadow-2xl", "w-full", "max-w-5xl", "flex", "overflow-hidden", "animate-bounce-in", "max-h-[95vh]", "border", "border-slate-100", "dark:border-slate-800"], [1, "w-1/2", "p-8", "border-r", "border-slate-100", "dark:border-slate-800", "overflow-y-auto", "custom-scrollbar", "flex", "flex-col", "justify-between"], [1, "flex", "items-center", "gap-3", "mb-6"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-950/50", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "shadow-inner"], [1, "fa-solid", "fa-print", "text-lg", "animate-pulse"], [1, "font-black", "text-xl", "text-slate-800", "dark:text-slate-100", "leading-tight"], [1, "text-xs", "text-indigo-600", "dark:text-indigo-400", "font-extrabold", "mt-0.5", "animate-pulse"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-0.5", "break-words", "max-w-[340px]", 3, "title"], [1, "flex", "p-1", "bg-slate-100", "dark:bg-slate-800/80", "rounded-2xl", "mb-6", "border", "border-slate-200/40", "dark:border-slate-700/30"], [1, "flex-1", "py-2", "text-center", "text-xs", "font-black", "rounded-xl", "transition-all", "duration-300", "text-slate-600", "dark:text-slate-400", "hover:text-slate-800", 3, "click"], [1, "fa-solid", "fa-scroll", "mr-1.5"], [1, "fa-solid", "fa-grip", "mr-1.5"], [1, "space-y-5"], [1, "block", "text-[11px]", "font-extrabold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-wider", "mb-2"], [1, "grid", "grid-cols-3", "gap-2"], [1, "p-3", "border", "rounded-xl", "text-left", "hover:bg-slate-50", "dark:hover:bg-slate-800/50", "transition", "duration-200", 3, "click", "ngClass"], [1, "font-extrabold", "text-xs", "text-slate-700", "dark:text-slate-200", "mb-0.5"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "leading-tight"], [1, "block", "text-[11px]", "font-extrabold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-wider", "mb-2.5"], [1, "grid", "grid-cols-2", "gap-y-2.5", "gap-x-4", "p-4", "rounded-2xl", "bg-slate-50", "dark:bg-slate-850/50", "border", "border-slate-100", "dark:border-slate-800/80"], [1, "flex", "items-center", "gap-2", "cursor-pointer", "group"], ["type", "checkbox", 1, "w-4", "h-4", "text-indigo-600", "rounded", "border-slate-350", "dark:border-slate-700", "focus:ring-indigo-500", "bg-white", "dark:bg-slate-800", 3, "ngModelChange", "ngModel"], [1, "text-xs", "font-semibold", "text-slate-700", "dark:text-slate-300", "group-hover:text-indigo-600", "dark:group-hover:text-indigo-400", "transition"], [1, "p-3", "bg-amber-50", "dark:bg-amber-950/20", "rounded-xl", "border", "border-amber-250", "dark:border-amber-900/40", "text-[11px]", "text-amber-700", "dark:text-amber-400", "mt-2.5", "flex", "gap-2"], [1, "flex", "items-center", "justify-between"], [1, "block", "text-[11px]", "font-extrabold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-wider"], [1, "text-[10px]", "text-slate-400", "leading-none"], [1, "flex", "items-center", "gap-1.5", "p-1", "bg-slate-50", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl"], [1, "w-8", "h-8", "rounded-lg", "bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-100", "dark:hover:bg-slate-700", "flex", "items-center", "justify-center", "transition", "shadow-sm", "border", "border-slate-250/20", 3, "click"], [1, "fa-solid", "fa-minus", "text-xs"], ["type", "number", "min", "1", 1, "w-12", "text-center", "border-none", "bg-transparent", "font-black", "text-slate-800", "dark:text-slate-200", "focus:ring-0", "p-0", "text-sm", 3, "ngModelChange", "ngModel"], [1, "fa-solid", "fa-plus", "text-xs"], [1, "flex", "justify-between", "items-center", "mt-8", "pt-6", "border-t", "border-slate-100", "dark:border-slate-800"], [1, "px-5", "py-2.5", "text-slate-500", "dark:text-slate-400", "font-extrabold", "text-xs", "hover:bg-slate-50", "dark:hover:bg-slate-800", "rounded-xl", "transition", 3, "click"], [1, "px-8", "py-2.5", "bg-gradient-to-r", "from-indigo-600", "to-violet-600", "dark:from-indigo-500", "dark:to-violet-500", "text-white", "font-extrabold", "text-xs", "rounded-xl", "hover:shadow-lg", "hover:opacity-95", "shadow-md", "shadow-indigo-150", "dark:shadow-none", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-print"], ["id", "print-preview-container", 1, "w-1/2", "bg-slate-50", "dark:bg-slate-900/50", "p-8", "flex", "flex-col", "items-center", "justify-center", "relative", "min-h-[500px]"], [1, "absolute", "top-4", "left-4", "text-[10px]", "font-extrabold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-wider", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-eye", "animate-pulse", "text-indigo-500"], [1, "bg-white", "shadow-xl", "border", "border-slate-300/60", "dark:border-slate-700/30", "flex", "flex-col", "justify-center", "text-black", "overflow-hidden", "relative", "print-content", 2, "transform-origin", "center center", "transition", "all 0.3s ease", 3, "width", "height", "transform"], [1, "w-full", "flex", "flex-col", "items-center", "gap-2", "animate-fade-in"], [1, "mt-4", "text-[10px]", "text-slate-400", "dark:text-slate-500", "text-center", "max-w-[280px]"], [1, "w-full", "border", "border-slate-200", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "p-2.5", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500/50", "transition", "mb-3", 3, "ngModelChange", "ngModel"], ["value", "62x29_ql800"], ["value", "90x29_ql800"], ["value", "62x62_ql800"], ["value", "35x22"], ["value", "22x12"], ["value", "50x30"], ["value", "70x50"], ["value", "custom"], [1, "grid", "grid-cols-3", "gap-3", "animate-fade-in"], [1, "block", "text-[10px]", "font-bold", "text-slate-400", "uppercase", "mb-1"], ["type", "number", 1, "w-full", "border", "border-slate-200", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "p-2", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500/50", 3, "ngModelChange", "ngModel"], [1, "flex", "p-1", "bg-slate-100", "dark:bg-slate-800", "rounded-xl", "mb-3", "border", "border-slate-200/50", "dark:border-slate-700/50"], [1, "flex-1", "py-1.5", "text-center", "text-[10px]", "font-extrabold", "rounded-lg", "transition-all", "duration-200", "text-slate-500", "hover:text-slate-800", 3, "click"], [1, "w-full", "border", "border-slate-200", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "p-2.5", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500/50", "transition", 3, "ngModel"], [1, "mt-3", "grid", "grid-cols-2", "gap-3"], [1, "flex", "items-center", "gap-1.5"], [1, "w-7", "h-7", "rounded-lg", "bg-slate-100", "dark:bg-slate-850", "hover:bg-slate-200", "text-slate-600", "dark:text-slate-300", "flex", "items-center", "justify-center", "text-xs", 3, "click"], [1, "fa-solid", "fa-minus"], ["type", "number", "min", "1", 1, "w-12", "text-center", "bg-transparent", "border-none", "font-bold", "text-xs", "p-0", "text-slate-800", "dark:text-slate-100", "focus:ring-0", 3, "ngModelChange", "ngModel", "max"], [1, "w-7", "h-7", "rounded-lg", "bg-slate-100", "dark:bg-slate-850", "hover:bg-slate-200", "text-slate-655", "dark:text-slate-300", "flex", "items-center", "justify-center", "text-xs", 3, "click"], [1, "fa-solid", "fa-plus"], [1, "p-3", "bg-indigo-50/50", "dark:bg-indigo-950/20", "rounded-xl", "border", "border-indigo-100/50", "dark:border-indigo-900/30", "text-[10px]", "text-indigo-700", "dark:text-indigo-300", "flex", "flex-col", "justify-center", "animate-fade-in"], [1, "flex", "justify-between", "mb-0.5"], [1, "font-extrabold", "text-indigo-650", "dark:text-indigo-400"], [1, "flex", "justify-between", "border-t", "border-indigo-100/55", "dark:border-indigo-900/30", "pt-1", "font-bold"], ["value", "medium"], ["value", "large"], ["value", "small"], [1, "grid", "grid-cols-2", "gap-3", "mb-3", "animate-fade-in"], [1, "flex", "items-center", "gap-2", "cursor-pointer", "group", "mb-3"], [1, "w-full", "border", "border-slate-200", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "p-2.5", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500/50", "transition", 3, "ngModelChange", "ngModel"], ["value", "tomy_145"], ["value", "tomy_138"], ["value", "tomy_135"], ["value", "tomy_146"], [1, "fa-solid", "fa-triangle-exclamation", "mt-0.5", "flex-shrink-0", "animate-bounce"], [1, "bg-white", "shadow-xl", "border", "border-slate-300/60", "dark:border-slate-700/30", "flex", "flex-col", "justify-center", "text-black", "overflow-hidden", "relative", "print-content", 2, "transform-origin", "center center", "transition", "all 0.3s ease"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "text-[9px]", "font-extrabold", "text-slate-400", "uppercase", "tracking-wider", "self-start", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-magnifying-glass-plus", "text-indigo-500"], [1, "bg-white", "shadow-xl", "border", "border-slate-350", "overflow-hidden", "relative", 2, "transform-origin", "center center", "margin", "15px 0"], [1, "text-[9px]", "font-extrabold", "text-slate-400", "uppercase", "tracking-wider", "self-start", "flex", "items-center", "gap-1.5", "mt-3", "w-full", "justify-between"], [1, "fa-solid", "fa-file-lines", "text-indigo-500"], [1, "text-indigo-500", "dark:text-indigo-400", "font-bold", "normal-case", "text-[9px]", "cursor-pointer", "hover:underline"], [1, "flex", "items-center", "justify-center", "overflow-hidden", "w-full", 2, "height", "310px", "border-radius", "16px", "background", "rgba(0,0,0,0.02)", "border", "1px dashed rgba(0,0,0,0.08)", "padding", "5px"], [1, "bg-white", "shadow-lg", "border", "border-slate-200", "overflow-hidden", "flex-shrink-0", 2, "transform", "scale(0.24)", "transform-origin", "center top", "margin-bottom", "-225mm"], [2, "display", "grid", "width", "100%", "height", "100%", "box-sizing", "border-box"], ["title", "Click \u0111\u1EC3 ch\u1ECDn l\u00E0m \u00F4 b\u1EAFt \u0111\u1EA7u", 1, "border", "border-dashed", "border-slate-250", "bg-slate-100", "flex", "items-center", "justify-center", "text-[10px]", "text-slate-355", "cursor-pointer", "hover:bg-indigo-50/50", "hover:border-indigo-300", "transition-all", 2, "box-sizing", "border-box"], ["title", "\u0110ang ch\u1ECDn in \u1EDF \u0111\u00E2y", 1, "bg-indigo-50", "border", "border-indigo-305", "text-indigo-700", "font-semibold", "cursor-pointer", "hover:bg-indigo-100", "transition-all", "relative", "flex", "flex-col", "justify-between", "overflow-hidden", 2, "box-sizing", "border-box", "padding", "1mm", "line-height", "1.15"], ["title", "Click \u0111\u1EC3 ch\u1ECDn l\u00E0m \u00F4 b\u1EAFt \u0111\u1EA7u", 1, "border", "border-dashed", "border-slate-205", "bg-white", "flex", "items-center", "justify-center", "text-[10px]", "text-slate-355", "cursor-pointer", "hover:bg-indigo-50", "hover:border-indigo-300", "hover:text-indigo-600", "transition-all", 2, "box-sizing", "border-box"], ["title", "Click \u0111\u1EC3 ch\u1ECDn l\u00E0m \u00F4 b\u1EAFt \u0111\u1EA7u", 1, "border", "border-dashed", "border-slate-250", "bg-slate-100", "flex", "items-center", "justify-center", "text-[10px]", "text-slate-355", "cursor-pointer", "hover:bg-indigo-50/50", "hover:border-indigo-300", "transition-all", 2, "box-sizing", "border-box", 3, "click"], ["title", "\u0110ang ch\u1ECDn in \u1EDF \u0111\u00E2y", 1, "bg-indigo-50", "border", "border-indigo-305", "text-indigo-700", "font-semibold", "cursor-pointer", "hover:bg-indigo-100", "transition-all", "relative", "flex", "flex-col", "justify-between", "overflow-hidden", 2, "box-sizing", "border-box", "padding", "1mm", "line-height", "1.15", 3, "click"], [2, "font-size", "7.5px", "font-weight", "800", "white-space", "nowrap", "overflow", "hidden", "text-overflow", "ellipsis", "color", "#1e1b4b"], [2, "font-size", "5px", "color", "#3730a3", "display", "flex", "justify-content", "space-between"], [1, "absolute", "right-0.5", "bottom-0.5", "bg-indigo-650", "text-white", "rounded-[2px]", "text-[5px]", "font-bold", "px-0.5", "flex", "items-center", "justify-center", 2, "transform", "scale(0.85)"], ["title", "Click \u0111\u1EC3 ch\u1ECDn l\u00E0m \u00F4 b\u1EAFt \u0111\u1EA7u", 1, "border", "border-dashed", "border-slate-205", "bg-white", "flex", "items-center", "justify-center", "text-[10px]", "text-slate-355", "cursor-pointer", "hover:bg-indigo-50", "hover:border-indigo-300", "hover:text-indigo-600", "transition-all", 2, "box-sizing", "border-box", 3, "click"], [1, "bg-white", "text-black", "overflow-hidden", "relative", "flex", "flex-col", "justify-between", 2, "line-height", "1.15", "box-sizing", "border-box", "font-family", "'Segoe UI', Roboto, Arial, sans-serif"], [2, "display", "flex", "height", "100%", "gap", "1.2mm", "align-items", "center", "overflow", "hidden", "box-sizing", "border-box", "width", "100%"], [2, "display", "flex", "flex-direction", "column", "justify-content", "center", "height", "100%", "overflow", "hidden", "box-sizing", "border-box", "width", "100%"], [2, "flex", "1", "min-width", "0", "display", "flex", "flex-direction", "column", "justify-content", "center", "height", "100%", "overflow", "hidden"], [2, "font-weight", "800", "margin-bottom", "0.4mm", "white-space", "nowrap", "overflow", "hidden", "text-overflow", "ellipsis", 3, "font-size"], [2, "white-space", "nowrap", "overflow", "hidden", "text-overflow", "ellipsis", "margin-bottom", "0.1mm"], [2, "white-space", "nowrap", "overflow", "hidden", "text-overflow", "ellipsis"], [2, "display", "flex", "align-items", "center", "justify-content", "center", "flex-shrink", "0"], [2, "width", "100%", "height", "100%", "object-fit", "contain", 3, "src"], [2, "font-weight", "800", "margin-bottom", "0.4mm", "white-space", "nowrap", "overflow", "hidden", "text-overflow", "ellipsis"], [2, "font-weight", "bold"], [2, "display", "flex", "justify-content", "space-between", "margin-bottom", "0.1mm", "overflow", "hidden", "white-space", "nowrap", "width", "100%"], [2, "white-space", "nowrap", "overflow", "hidden", "text-overflow", "ellipsis", "width", "100%"], [2, "text-overflow", "ellipsis", "overflow", "hidden", "flex", "1"], [2, "text-overflow", "ellipsis", "overflow", "hidden", "flex-shrink", "0", "margin-left", "1mm"]], template: function StandardsPrintModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsPrintModalComponent_Conditional_0_Template, 108, 48, "div", 1)(1, StandardsPrintModalComponent_ng_template_1_Template, 3, 9, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementStart(3, "div", 2);
            i0.ɵɵrepeaterCreate(4, StandardsPrintModalComponent_For_5_Template, 2, 8, "div", null, _forTrack0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen() ? 0 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵrepeater(ctx.standardsToPrint());
        } }, dependencies: [CommonModule, i1.NgClass, i1.NgTemplateOutlet, i1.DatePipe, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.MinValidator, i2.MaxValidator, i2.NgModel], styles: ["@media print {\n        @page {\n            margin: 0 !important;\n            padding: 0 !important;\n        }\n        body[_ngcontent-%COMP%], html[_ngcontent-%COMP%] {\n            margin: 0 !important;\n            padding: 0 !important;\n            background-color: white !important;\n            width: 100% !important;\n            height: 100% !important;\n            overflow: hidden !important;\n        }\n        body[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]:not(#print-area) { display: none !important; }\n        #print-area[_ngcontent-%COMP%] { display: block !important; }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsPrintModalComponent, [{
        type: Component,
        args: [{ selector: 'app-standards-print-modal', standalone: true, imports: [CommonModule, FormsModule], template: `
      @if (isOpen()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
             <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl flex overflow-hidden animate-bounce-in max-h-[95vh] border border-slate-100 dark:border-slate-800">
                 <!-- Left: Settings -->
                 <div class="w-1/2 p-8 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar flex flex-col justify-between">
                     <div>
                         <div class="flex items-center gap-3 mb-6">
                             <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                                 <i class="fa-solid fa-print text-lg animate-pulse"></i>
                             </div>
                             <div>
                                 <h3 class="font-black text-xl text-slate-800 dark:text-slate-100 leading-tight">
                                     @if (standardsToPrint().length > 1) {
                                         In Hàng Loạt Nhãn
                                     } @else {
                                         Cài Đặt In Nhãn
                                     }
                                 </h3>
                                 @if (standardsToPrint().length > 1) {
                                     <p class="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold mt-0.5 animate-pulse">
                                         Đã chọn {{ standardsToPrint().length }} chất chuẩn để in
                                     </p>
                                 } @else {
                                     <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-words max-w-[340px]" [title]="standardsToPrint()[0] ? standardsToPrint()[0].name : ''">
                                         {{ standardsToPrint()[0] ? standardsToPrint()[0].name : 'Chưa chọn chất chuẩn' }}
                                     </p>
                                 }
                             </div>
                         </div>

                         <!-- Segmented Control for Layout Mode -->
                         <div class="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6 border border-slate-200/40 dark:border-slate-700/30">
                             <button (click)="printLayoutMode.set('roll')" 
                                     [class.bg-white]="printLayoutMode() === 'roll'" 
                                     [class.dark:bg-slate-700]="printLayoutMode() === 'roll'" 
                                     [class.shadow-sm]="printLayoutMode() === 'roll'" 
                                     [class.text-indigo-650]="printLayoutMode() === 'roll'"
                                     [class.dark:text-indigo-400]="printLayoutMode() === 'roll'"
                                     class="flex-1 py-2 text-center text-xs font-black rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-slate-800">
                                 <i class="fa-solid fa-scroll mr-1.5"></i> In Cuộn (Brother QL)
                             </button>
                             <button (click)="printLayoutMode.set('grid')" 
                                     [class.bg-white]="printLayoutMode() === 'grid'" 
                                     [class.dark:bg-slate-700]="printLayoutMode() === 'grid'" 
                                     [class.shadow-sm]="printLayoutMode() === 'grid'" 
                                     [class.text-indigo-650]="printLayoutMode() === 'grid'"
                                     [class.dark:text-indigo-400]="printLayoutMode() === 'grid'"
                                     class="flex-1 py-2 text-center text-xs font-black rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-slate-800">
                                 <i class="fa-solid fa-grip mr-1.5"></i> In Tấm A4 Decal
                             </button>
                         </div>
                         
                         <div class="space-y-5">
                             <!-- Template Selection -->
                             <div>
                                 <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Mẫu hiển thị</label>
                                 <div class="grid grid-cols-3 gap-2">
                                     <button (click)="onTemplateChange('standard')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-transparent': printTemplate() === 'standard', 'border-slate-200 dark:border-slate-800': printTemplate() !== 'standard'}" class="p-3 border rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200">
                                         <div class="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-0.5">Tiêu Chuẩn</div>
                                         <div class="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">Thông Tin Cơ Bản</div>
                                     </button>
                                     <button (click)="onTemplateChange('detailed')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-transparent': printTemplate() === 'detailed', 'border-slate-200 dark:border-slate-800': printTemplate() !== 'detailed'}" class="p-3 border rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200">
                                         <div class="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-0.5">Chi Tiết</div>
                                         <div class="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">Đầy Đủ Thông Tin</div>
                                     </button>
                                     <button (click)="onTemplateChange('qr')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-transparent': printTemplate() === 'qr', 'border-slate-200 dark:border-slate-800': printTemplate() !== 'qr'}" class="p-3 border rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200">
                                         <div class="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-0.5">Kèm Mã QR</div>
                                         <div class="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">Quét Truy Xuất Nhanh</div>
                                     </button>
                                 </div>
                             </div>

                             <!-- Dimensions Selection based on Mode -->
                             <div>
                                 <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Kích thước nhãn</label>
                                 
                                 @if (printLayoutMode() === 'roll') {
                                     <select [ngModel]="printPaperSize()" (ngModelChange)="onPaperSizeChange($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition mb-3">
                                         <option value="62x29_ql800">Brother QL-800 DK-22205 (62 x 29 mm - Khuyên dùng)</option>
                                         <option value="90x29_ql800">Brother QL-800 DK-11201 (90 x 29 mm dọc)</option>
                                         <option value="62x62_ql800">Brother QL-800 DK-11209 (62 x 62 mm vuông)</option>
                                         <option value="35x22">Tem chuẩn dán nắp (35 x 22 mm)</option>
                                         <option value="22x12">Tem nhỏ mini (22 x 12 mm)</option>
                                         <option value="50x30">Tem trung (50 x 30 mm)</option>
                                         <option value="70x50">Tem lớn (70 x 50 mm)</option>
                                         <option value="custom">Tùy chỉnh kích thước...</option>
                                     </select>
                                     
                                     @if (printPaperSize() === 'custom') {
                                         <div class="grid grid-cols-3 gap-3 animate-fade-in">
                                             <div>
                                                 <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rộng (mm)</label>
                                                 <input type="number" [ngModel]="printWidth()" (ngModelChange)="printWidth.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
                                             </div>
                                             <div>
                                                 <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cao (mm)</label>
                                                 <input type="number" [ngModel]="printHeight()" (ngModelChange)="printHeight.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
                                             </div>
                                             <div>
                                                 <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Font (pt)</label>
                                                 <input type="number" [ngModel]="printFontSize()" (ngModelChange)="printFontSize.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
                                             </div>
                                         </div>
                                     }
                                 } @else {
                                     <!-- A4 Paper Type selector -->
                                     <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3 border border-slate-200/50 dark:border-slate-700/50">
                                         <button (click)="a4PaperType.set('fullsheet')"
                                                 [class.bg-white]="a4PaperType() === 'fullsheet'"
                                                 [class.dark:bg-slate-700]="a4PaperType() === 'fullsheet'"
                                                 [class.shadow-sm]="a4PaperType() === 'fullsheet'"
                                                 [class.text-indigo-600]="a4PaperType() === 'fullsheet'"
                                                 [class.dark:text-indigo-400]="a4PaperType() === 'fullsheet'"
                                                 class="flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800">
                                             Nguyên Tấm Tự Cắt (Khuyên Dùng)
                                         </button>
                                         <button (click)="a4PaperType.set('precut')"
                                                 [class.bg-white]="a4PaperType() === 'precut'"
                                                 [class.dark:bg-slate-700]="a4PaperType() === 'precut'"
                                                 [class.shadow-sm]="a4PaperType() === 'precut'"
                                                 [class.text-indigo-600]="a4PaperType() === 'precut'"
                                                 [class.dark:text-indigo-400]="a4PaperType() === 'precut'"
                                                 class="flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800">
                                             Chia Ô Sẵn (Tomy)
                                         </button>
                                     </div>
                                     
                                     @if (a4PaperType() === 'fullsheet') {
                                         <!-- Full sheet configurations -->
                                         <select [ngModel]="fullSheetPreset()" (ngModelChange)="onFullSheetPresetChange($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition mb-3">
                                             <option value="medium">Lưới thông dụng 4x8 (32 nhãn - ~46x33 mm)</option>
                                             <option value="large">Lưới nhãn lớn 3x6 (18 nhãn - ~62x45 mm)</option>
                                             <option value="small">Lưới nhãn phụ 5x12 (60 nhãn - ~36x21 mm)</option>
                                             <option value="custom">Tự cấu hình hàng & cột...</option>
                                         </select>
                                         
                                         @if (fullSheetPreset() === 'custom') {
                                             <div class="grid grid-cols-2 gap-3 mb-3 animate-fade-in">
                                                 <div>
                                                     <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Số cột (Cols)</label>
                                                     <input type="number" [ngModel]="fullSheetCols()" (ngModelChange)="fullSheetCols.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
                                                 </div>
                                                 <div>
                                                     <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Số dòng (Rows)</label>
                                                     <input type="number" [ngModel]="fullSheetRows()" (ngModelChange)="fullSheetRows.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
                                                 </div>
                                             </div>
                                         }
                                         
                                         <!-- Crop mark checkbox -->
                                         <label class="flex items-center gap-2 cursor-pointer group mb-3">
                                             <input type="checkbox" [ngModel]="printShowCropMarks()" (ngModelChange)="printShowCropMarks.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                             <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Hiển thị đường viền hướng dẫn cắt (Crop Marks)</span>
                                         </label>
                                     } @else {
                                         <select [ngModel]="gridPreset()" (ngModelChange)="onGridPresetChange($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
                                             <option value="tomy_145">Tomy 145 (65 nhãn - 5x13 | 38.1 x 21.2 mm - Phổ biến)</option>
                                             <option value="tomy_138">Tomy 138 (100 nhãn - 5x20 | 40 x 14 mm)</option>
                                             <option value="tomy_135">Tomy 135 (24 nhãn - 3x8 | 47 x 22 mm)</option>
                                             <option value="tomy_146">Tomy 146 (18 nhãn - 3x6 | 62 x 42 mm)</option>
                                         </select>
                                     }
                                     
                                     <!-- A4 Offset Info -->
                                     <div class="mt-3 grid grid-cols-2 gap-3">
                                         <div>
                                             <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bắt đầu từ ô nhãn số</label>
                                             <div class="flex items-center gap-1.5">
                                                 <button (click)="gridStartIndex.set(Math.max(1, gridStartIndex() - 1))" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs"><i class="fa-solid fa-minus"></i></button>
                                                 <input type="number" [ngModel]="gridStartIndex()" (ngModelChange)="onStartIndexInputChange($event)" min="1" [max]="getGridPreset().rows * getGridPreset().cols" class="w-12 text-center bg-transparent border-none font-bold text-xs p-0 text-slate-800 dark:text-slate-100 focus:ring-0">
                                                 <button (click)="gridStartIndex.set(Math.min(getGridPreset().rows * getGridPreset().cols, gridStartIndex() + 1))" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-655 dark:text-slate-300 flex items-center justify-center text-xs"><i class="fa-solid fa-plus"></i></button>
                                             </div>
                                         </div>
                                         
                                         <!-- Estimated A4 sheets info badge -->
                                         <div class="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 text-[10px] text-indigo-700 dark:text-indigo-300 flex flex-col justify-center animate-fade-in">
                                             <div class="flex justify-between mb-0.5">
                                                 <span>Vị trí bắt đầu:</span>
                                                 <span class="font-extrabold text-indigo-650 dark:text-indigo-400">Ô số {{ gridStartIndex() }}</span>
                                             </div>
                                             <div class="flex justify-between border-t border-indigo-100/55 dark:border-indigo-900/30 pt-1 font-bold">
                                                 <span>Dự kiến cần dùng:</span>
                                                 <span>{{ getRequiredA4Sheets() }} trang A4</span>
                                             </div>
                                         </div>
                                     </div>
                                 }
                             </div>

                             <!-- Fields to Include -->
                             <div>
                                 <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">Thông tin hiển thị trên nhãn</label>
                                 <div class="grid grid-cols-2 gap-y-2.5 gap-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800/80">
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeName()" (ngModelChange)="printIncludeName.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Tên chuẩn</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeLot()" (ngModelChange)="printIncludeLot.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Số Lot</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludePurity()" (ngModelChange)="printIncludePurity.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Độ tinh khiết</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeOpened()" (ngModelChange)="printIncludeOpened.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Ngày mở nắp</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeExpiry()" (ngModelChange)="printIncludeExpiry.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Hạn sử dụng</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeStorage()" (ngModelChange)="printIncludeStorage.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Đk bảo quản</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeManufacturer()" (ngModelChange)="printIncludeManufacturer.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Hãng sản xuất</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeCas()" (ngModelChange)="printIncludeCas.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Chỉ số CAS</span>
                                     </label>
                                 </div>
                                 
                                 <!-- Overflow Warning for Small Labels -->
                                 @if (showOverflowWarning()) {
                                     <div class="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-250 dark:border-amber-900/40 text-[11px] text-amber-700 dark:text-amber-400 mt-2.5 flex gap-2">
                                         <i class="fa-solid fa-triangle-exclamation mt-0.5 flex-shrink-0 animate-bounce"></i>
                                         <span><strong>Lưu ý:</strong> Cỡ nhãn nhỏ dán nhiều thông tin có thể bị tràn hoặc đè chữ. Bạn nên tắt bớt trường không quá quan trọng.</span>
                                     </div>
                                 }
                             </div>

                             <!-- Copies -->
                             <div class="flex items-center justify-between">
                                 <div>
                                     <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Số bản in mỗi loại</label>
                                     <span class="text-[10px] text-slate-400 leading-none">Tổng cộng: {{ standardsToPrint().length * printCopies() }} nhãn chuẩn</span>
                                 </div>
                                 <div class="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl">
                                     <button (click)="printCopies.set(Math.max(1, printCopies() - 1))" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition shadow-sm border border-slate-250/20"><i class="fa-solid fa-minus text-xs"></i></button>
                                     <input type="number" [ngModel]="printCopies()" (ngModelChange)="printCopies.set(Math.max(1, $event))" min="1" class="w-12 text-center border-none bg-transparent font-black text-slate-800 dark:text-slate-200 focus:ring-0 p-0 text-sm">
                                     <button (click)="printCopies.set(printCopies() + 1)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition shadow-sm border border-slate-250/20"><i class="fa-solid fa-plus text-xs"></i></button>
                                 </div>
                             </div>
                         </div>
                     </div>
                     
                     <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                         <button (click)="onClose()" class="px-5 py-2.5 text-slate-500 dark:text-slate-400 font-extrabold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">Hủy Bỏ</button>
                         <button (click)="printLabel()" class="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 text-white font-extrabold text-xs rounded-xl hover:shadow-lg hover:opacity-95 shadow-md shadow-indigo-150 dark:shadow-none transition flex items-center gap-2">
                             <i class="fa-solid fa-print"></i> Tiến Hành In Nhãn ({{ standardsToPrint().length * printCopies() }})
                         </button>
                     </div>
                 </div>

                 <!-- Right: Preview -->
                 <div class="w-1/2 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center relative min-h-[500px]" id="print-preview-container">
                     <div class="absolute top-4 left-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                         <i class="fa-solid fa-eye animate-pulse text-indigo-500"></i> Bản Xem Trước Trực Quan
                     </div>
                     
                     @if (printLayoutMode() === 'roll') {
                         <!-- Single Label Preview (Roll) -->
                         <div class="bg-white shadow-xl border border-slate-300/60 dark:border-slate-700/30 flex flex-col justify-center text-black overflow-hidden relative print-content"
                              [style.width.mm]="printWidth()"
                              [style.height.mm]="printHeight()"
                              [style.transform]="'scale(' + getPreviewScale() + ')'"
                              style="transform-origin: center center; transition: all 0.3s ease;">
                              <ng-container *ngTemplateOutlet="labelTemplate; context: { std: standardsToPrint()[0], fontSize: printFontSize(), width: printWidth(), height: printHeight(), isPrint: false }"></ng-container>
                         </div>
                     } @else {
                         <!-- Grid Mode Preview -->
                         <div class="w-full flex flex-col items-center gap-2 animate-fade-in">
                             <!-- Single Label Zoomed (so user can read the text) -->
                             <div class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider self-start flex items-center gap-1.5">
                                 <i class="fa-solid fa-magnifying-glass-plus text-indigo-500"></i> Độ nét thực tế nhãn đơn mẫu
                             </div>
                             
                             <div class="bg-white shadow-xl border border-slate-350 overflow-hidden relative"
                                  [style.width.mm]="getGridPreset().width"
                                  [style.height.mm]="getGridPreset().height"
                                  [style.transform]="'scale(' + (getGridPreset().width <= 40 ? 2.5 : 1.9) + ')'"
                                  style="transform-origin: center center; margin: 15px 0;">
                                  <ng-container *ngTemplateOutlet="labelTemplate; context: { std: standardsToPrint()[0], fontSize: getGridPreset().fontSize, width: getGridPreset().width, height: getGridPreset().height, isPrint: false }"></ng-container>
                             </div>
                             
                             <!-- A4 Layout Sheet -->
                             <div class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider self-start flex items-center gap-1.5 mt-3 w-full justify-between">
                                 <span class="flex items-center gap-1.5"><i class="fa-solid fa-file-lines text-indigo-500"></i> Mô phỏng tấm A4 Decal</span>
                                 <span class="text-indigo-500 dark:text-indigo-400 font-bold normal-case text-[9px] cursor-pointer hover:underline">(Click để đổi điểm bắt đầu)</span>
                             </div>
                             
                             <!-- Scaled A4 preview container -->
                             <div class="flex items-center justify-center overflow-hidden w-full" style="height: 310px; border-radius: 16px; background: rgba(0,0,0,0.02); border: 1px dashed rgba(0,0,0,0.08); padding: 5px;">
                                 <div class="bg-white shadow-lg border border-slate-200 overflow-hidden flex-shrink-0"
                                      [style.width.mm]="210"
                                      [style.height.mm]="297"
                                      style="transform: scale(0.24); transform-origin: center top; margin-bottom: -225mm;">
                                      
                                      <!-- A4 Grid -->
                                      <div [style.padding-top.mm]="getGridPreset().topMargin"
                                           [style.padding-left.mm]="getGridPreset().leftMargin"
                                           style="display: grid; width: 100%; height: 100%; box-sizing: border-box;"
                                           [style.grid-template-columns]="'repeat(' + getGridPreset().cols + ', ' + getGridPreset().width + 'mm)'"
                                           [style.grid-auto-rows]="getGridPreset().height + 'mm'"
                                           [style.row-gap.mm]="getGridPreset().rowGap"
                                           [style.column-gap.mm]="getGridPreset().colGap">
                                           
                                           @for (slotIndex of getGridSlots(); track slotIndex) {
                                               @if (slotIndex < gridStartIndex()) {
                                                   <!-- Skipped cell -->
                                                   <div (click)="gridStartIndex.set(slotIndex)"
                                                        title="Click để chọn làm ô bắt đầu"
                                                        class="border border-dashed border-slate-250 bg-slate-100 flex items-center justify-center text-[10px] text-slate-355 cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-300 transition-all"
                                                        style="box-sizing: border-box;">
                                                        {{ slotIndex }}
                                                   </div>
                                               } @else if (slotIndex >= gridStartIndex() && slotIndex < gridStartIndex() + (standardsToPrint().length * printCopies())) {
                                                   <!-- Printed label cell -->
                                                   <div (click)="gridStartIndex.set(slotIndex)"
                                                        title="Đang chọn in ở đây"
                                                        class="bg-indigo-50 border border-indigo-305 text-indigo-700 font-semibold cursor-pointer hover:bg-indigo-100 transition-all relative flex flex-col justify-between overflow-hidden"
                                                        style="box-sizing: border-box; padding: 1mm; line-height: 1.15;">
                                                        <div style="font-size: 7.5px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1e1b4b;">
                                                            {{ getStandardForSlot(slotIndex)?.name }}
                                                        </div>
                                                        <div style="font-size: 5px; color: #3730a3; display: flex; justify-content: space-between;">
                                                            <span>L: {{ getStandardForSlot(slotIndex)?.lot_number || 'N/A' }}</span>
                                                            <span>E: {{ getStandardForSlot(slotIndex)?.expiry_date ? (getStandardForSlot(slotIndex)?.expiry_date | date:'dd/MM/yy') : 'N/A' }}</span>
                                                        </div>
                                                        <div class="absolute right-0.5 bottom-0.5 bg-indigo-650 text-white rounded-[2px] text-[5px] font-bold px-0.5 flex items-center justify-center" style="transform: scale(0.85);">
                                                            {{ slotIndex }}
                                                        </div>
                                                   </div>
                                               } @else {
                                                   <!-- Unused label cell -->
                                                   <div (click)="gridStartIndex.set(slotIndex)"
                                                        title="Click để chọn làm ô bắt đầu"
                                                        class="border border-dashed border-slate-205 bg-white flex items-center justify-center text-[10px] text-slate-355 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                                                        style="box-sizing: border-box;">
                                                        {{ slotIndex }}
                                                   </div>
                                               }
                                           }
                                      </div>
                                 </div>
                             </div>
                         </div>
                     }
                     
                     <div class="mt-4 text-[10px] text-slate-400 dark:text-slate-500 text-center max-w-[280px]">
                         Xem trước mang tính tương đối. Chất lượng và vị trí in thực tế phụ thuộc cấu hình khổ máy in của bạn.
                     </div>
                 </div>
             </div>
          </div>
      }

      <!-- Reusable HTML Label Template -->
      <ng-template #labelTemplate let-std="std" let-fontSize="fontSize" let-width="width" let-height="height" let-isPrint="isPrint">
          <div class="bg-white text-black overflow-hidden relative flex flex-col justify-between"
               [style.width.mm]="width"
               [style.height.mm]="height"
               [style.padding.mm]="1.5"
               [style.font-size.pt]="fontSize"
               style="line-height: 1.15; box-sizing: border-box; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
               
               @if (printTemplate() === 'qr') {
                   <div style="display: flex; height: 100%; gap: 1.2mm; align-items: center; overflow: hidden; box-sizing: border-box; width: 100%;">
                       <!-- Left Text Column -->
                       <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; height: 100%; overflow: hidden;">
                           @if (printIncludeName()) { 
                               <div style="font-weight: 800; margin-bottom: 0.4mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
                                    [style.font-size.pt]="fontSize + 1.2">
                                   {{ std?.name }}
                               </div> 
                           }
                           @if (printIncludeLot()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Lot: <span style="font-weight: bold;">{{ std?.lot_number || 'N/A' }}</span></div> }
                           @if (printIncludePurity()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Pur: <span style="font-weight: bold;">{{ std?.purity || 'N/A' }}</span></div> }
                           @if (printIncludeOpened()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Opn: <span style="font-weight: bold;">{{ std?.date_opened ? (std?.date_opened | date:'dd/MM/yy') : '__/__/__' }}</span></div> }
                           @if (printIncludeExpiry()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Exp: <span style="font-weight: bold;">{{ std?.expiry_date ? (std?.expiry_date | date:'dd/MM/yy') : 'N/A' }}</span></div> }
                           @if (printIncludeStorage()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Store: <span style="font-weight: bold;">{{ std?.storage_condition || 'N/A' }}</span></div> }
                       </div>
                       <!-- Right QR Code Column (Dynamic width based on label height) -->
                       <div [style.width.mm]="height - 3.5" [style.height.mm]="height - 3.5" style="display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                           <img [src]="getQrCodeUrl(std)" style="width: 100%; height: 100%; object-fit: contain;" />
                       </div>
                   </div>
               } @else {
                   <!-- Standard or Detailed layout -->
                   <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; overflow: hidden; box-sizing: border-box; width: 100%;">
                       @if (printIncludeName()) { 
                           <div style="font-weight: 800; margin-bottom: 0.4mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
                                [style.font-size.pt]="fontSize + 1.2">
                               {{ std?.name }}
                           </div> 
                       }
                       
                       @if (printTemplate() === 'detailed') {
                           @if (printIncludeCas() || printIncludeManufacturer()) {
                               <div style="display: flex; justify-content: space-between; margin-bottom: 0.1mm; overflow: hidden; white-space: nowrap; width: 100%;">
                                   @if (printIncludeCas()) { <span style="text-overflow: ellipsis; overflow: hidden; flex: 1;">CAS: <span style="font-weight: bold;">{{ std?.cas_number || 'N/A' }}</span></span> }
                                   @if (printIncludeManufacturer()) { <span style="text-overflow: ellipsis; overflow: hidden; flex-shrink: 0; margin-left: 1mm;">Mfr: <span style="font-weight: bold;">{{ std?.manufacturer || 'N/A' }}</span></span> }
                               </div>
                           }
                       }

                       @if (printIncludeLot() || printIncludePurity()) {
                           <div style="display: flex; justify-content: space-between; margin-bottom: 0.1mm; overflow: hidden; white-space: nowrap; width: 100%;">
                               @if (printIncludeLot()) { <span style="text-overflow: ellipsis; overflow: hidden; flex: 1;">Lot: <span style="font-weight: bold;">{{ std?.lot_number || 'N/A' }}</span></span> }
                               @if (printIncludePurity()) { <span style="text-overflow: ellipsis; overflow: hidden; flex-shrink: 0; margin-left: 1mm;">Pur: <span style="font-weight: bold;">{{ std?.purity || 'N/A' }}</span></span> }
                           </div>
                       }
                       
                       @if (printIncludeOpened() || printIncludeExpiry()) {
                           <div style="display: flex; justify-content: space-between; margin-bottom: 0.1mm; overflow: hidden; white-space: nowrap; width: 100%;">
                               @if (printIncludeOpened()) { <span style="text-overflow: ellipsis; overflow: hidden; flex: 1;">Opn: <span style="font-weight: bold;">{{ std?.date_opened ? (std?.date_opened | date:'dd/MM/yy') : '__/__/__' }}</span></span> }
                               @if (printIncludeExpiry()) { <span style="text-overflow: ellipsis; overflow: hidden; flex-shrink: 0; margin-left: 1mm;">Exp: <span style="font-weight: bold;">{{ std?.expiry_date ? (std?.expiry_date | date:'dd/MM/yy') : 'N/A' }}</span></span> }
                           </div>
                       }

                       @if (printIncludeStorage()) {
                           <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">
                               Store: <span style="font-weight: bold;">{{ std?.storage_condition || 'N/A' }}</span>
                           </div>
                       }
                   </div>
               }
          </div>
      </ng-template>

      <!-- Hidden DOM for Print Reference (Supports multi-standard cloning) -->
      <div id="print-reference-container" style="display: none;">
          @for (stdItem of standardsToPrint(); track stdItem.id) {
              <div [attr.id]="'print-ref-' + stdItem.id">
                  <ng-container *ngTemplateOutlet="labelTemplate; context: { std: stdItem, fontSize: printLayoutMode() === 'roll' ? printFontSize() : getGridPreset().fontSize, width: printLayoutMode() === 'roll' ? printWidth() : getGridPreset().width, height: printLayoutMode() === 'roll' ? printHeight() : getGridPreset().height, isPrint: true }"></ng-container>
              </div>
          }
      </div>
  `, styles: ["\n    @media print {\n        @page {\n            margin: 0 !important;\n            padding: 0 !important;\n        }\n        body, html {\n            margin: 0 !important;\n            padding: 0 !important;\n            background-color: white !important;\n            width: 100% !important;\n            height: 100% !important;\n            overflow: hidden !important;\n        }\n        body > *:not(#print-area) { display: none !important; }\n        #print-area { display: block !important; }\n    }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsPrintModalComponent, { className: "StandardsPrintModalComponent", filePath: "src/app/features/standards/components/standards-print-modal.component.ts", lineNumber: 496 }); })();
//# sourceMappingURL=standards-print-modal.component.js.map