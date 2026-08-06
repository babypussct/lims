import { Component, inject, signal, computed, effect, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { StateService } from '../../core/services/state.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { timestampToLocalDateKey } from '../../shared/utils/timestamp';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = ["previewContainer"];
const _c1 = () => [1, 2, 3, 4, 5];
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.pageIndex;
const _forTrack2 = ($index, $item) => $item.index;
function LabelPrintComponent_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 11);
} }
function LabelPrintComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 13);
} }
function LabelPrintComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 15);
} }
function LabelPrintComponent_Conditional_56_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 65);
    i0.ɵɵtext(1, "Chi\u1EC1u d\u00E0i trang in");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(2, "input", 66);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", ctx_r2.brotherPageHeight() + "mm");
} }
function LabelPrintComponent_Conditional_56_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "span", 65);
    i0.ɵɵtext(1, "Chi\u1EC1u d\u00E0i 1 tem");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 96)(3, "input", 97);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Conditional_32_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.brotherLabelHeight.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 98);
    i0.ɵɵtext(5, "mm");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r2.brotherLabelHeight());
} }
function LabelPrintComponent_Conditional_56_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "span", 65);
    i0.ɵɵtext(2, "S\u1ED1 tem / trang (D\u1ECDc)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 67);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Conditional_38_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.brotherRows.set($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r2.brotherRows());
} }
function LabelPrintComponent_Conditional_56_Conditional_71_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 79)(1, "div")(2, "span", 65);
    i0.ɵɵtext(3, "\u0110\u1ED9 r\u1ED9ng v\u1EA1ch/QR (px)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 99);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Conditional_71_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.barcodeWidth.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div")(6, "span", 65);
    i0.ɵɵtext(7, "Chi\u1EC1u cao m\u00E3 (px)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 100);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Conditional_71_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.barcodeHeight.set($event)); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.barcodeWidth());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.barcodeHeight());
} }
function LabelPrintComponent_Conditional_56_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 34)(1, "div", 50);
    i0.ɵɵelement(2, "i", 51);
    i0.ɵɵelementStart(3, "span", 52);
    i0.ɵɵtext(4, "L\u01B0u \u00FD: Ch\u1ECDn \u0111\u00FAng kh\u1ED5 gi\u1EA5y trong h\u1ED9p tho\u1EA1i in.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div")(6, "label", 53);
    i0.ɵɵtext(7, "Lo\u1EA1i Gi\u1EA5y (Brother)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "select", 54);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_select_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onBrotherPaperChange($event)); });
    i0.ɵɵelementStart(9, "optgroup", 55)(10, "option", 56);
    i0.ɵɵtext(11, "62mm (DK-22205)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "option", 57);
    i0.ɵɵtext(13, "29mm (1.1\")");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "option", 58);
    i0.ɵɵtext(15, "12mm (DK-22214)");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "optgroup", 59)(17, "option", 60);
    i0.ɵɵtext(18, "29mm x 90mm (1.1\" x 3.5\")");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "option", 61);
    i0.ɵɵtext(20, "29mm x 42mm (1.1\" x 1.6\")");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "option", 62);
    i0.ɵɵtext(22, "32mm x 32mm (Vu\u00F4ng)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "option", 63);
    i0.ɵɵtext(24, "23mm x 23mm (DK-11221)");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(25, "div", 64)(26, "div")(27, "span", 65);
    i0.ɵɵtext(28, "Chi\u1EC1u r\u1ED9ng cu\u1ED9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(29, "input", 66);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "div");
    i0.ɵɵtemplate(31, LabelPrintComponent_Conditional_56_Conditional_31_Template, 3, 1)(32, LabelPrintComponent_Conditional_56_Conditional_32_Template, 6, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "div", 64)(34, "div")(35, "span", 65);
    i0.ɵɵtext(36, "S\u1ED1 c\u1ED9t (Ngang)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "input", 67);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_input_ngModelChange_37_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.brotherCols.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(38, LabelPrintComponent_Conditional_56_Conditional_38_Template, 4, 1, "div");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "div", 68)(40, "div");
    i0.ɵɵelement(41, "i", 69);
    i0.ɵɵelementStart(42, "b");
    i0.ɵɵtext(43, "T\u1ED5ng k\u1EBFt trang in:");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(44, "div");
    i0.ɵɵtext(45, "- K\u00EDch th\u01B0\u1EDBc 1 tem: ");
    i0.ɵɵelementStart(46, "b");
    i0.ɵɵtext(47);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(48, "div");
    i0.ɵɵtext(49, "- K\u00EDch th\u01B0\u1EDBc trang/c\u1EAFt: ");
    i0.ɵɵelementStart(50, "b");
    i0.ɵɵtext(51);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(52, "div", 70)(53, "label", 71)(54, "input", 72);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_input_ngModelChange_54_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.brotherShowCutLines.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "span", 73);
    i0.ɵɵtext(56, "In vi\u1EC1n chia tem (C\u1EAFt tay)");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(57, "div")(58, "label", 53);
    i0.ɵɵtext(59, "\u0110\u1ECBnh d\u1EA1ng & M\u00E3 v\u1EA1ch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(60, "select", 54);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_select_ngModelChange_60_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.displayFormat.set($event)); });
    i0.ɵɵelementStart(61, "option", 74);
    i0.ɵɵtext(62, "Ch\u1EC9 in Ch\u1EEF (Text)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "option", 75);
    i0.ɵɵtext(64, "M\u00E3 v\u1EA1ch (Barcode 1D)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(65, "option", 76);
    i0.ɵɵtext(66, "M\u00E3 v\u1EA1ch + Ch\u1EEF \u1EDF d\u01B0\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(67, "option", 77);
    i0.ɵɵtext(68, "M\u00E3 QR (2D)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(69, "option", 78);
    i0.ɵɵtext(70, "M\u00E3 QR + Ch\u1EEF \u1EDF d\u01B0\u1EDBi");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(71, LabelPrintComponent_Conditional_56_Conditional_71_Template, 9, 2, "div", 79);
    i0.ɵɵelementStart(72, "div", 64)(73, "div")(74, "span", 65);
    i0.ɵɵtext(75, "Font Size (pt)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(76, "input", 80);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_input_ngModelChange_76_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.fontSize.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(77, "div")(78, "span", 65);
    i0.ɵɵtext(79, "Xoay ngang");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(80, "button", 81);
    i0.ɵɵlistener("click", function LabelPrintComponent_Conditional_56_Template_button_click_80_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.rotateText.set(!ctx_r2.rotateText())); });
    i0.ɵɵelementStart(81, "span");
    i0.ɵɵtext(82);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(83, "i", 82);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(84, "div")(85, "label", 53);
    i0.ɵɵtext(86, "C\u0103n l\u1EC1 & V\u1ECB tr\u00ED (Theo chi\u1EC1u ch\u1EEF)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(87, "div", 83)(88, "div", 64)(89, "div")(90, "span", 65);
    i0.ɵɵtext(91, "Ngang (Tr\u00E1i/Ph\u1EA3i)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(92, "select", 84);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_select_ngModelChange_92_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.alignX.set($event)); });
    i0.ɵɵelementStart(93, "option", 85);
    i0.ɵɵtext(94, "Tr\u00E1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(95, "option", 86);
    i0.ɵɵtext(96, "Gi\u1EEFa");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(97, "option", 87);
    i0.ɵɵtext(98, "Ph\u1EA3i");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(99, "div")(100, "span", 65);
    i0.ɵɵtext(101, "D\u1ECDc (Tr\u00EAn/D\u01B0\u1EDBi)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(102, "select", 84);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_select_ngModelChange_102_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.alignY.set($event)); });
    i0.ɵɵelementStart(103, "option", 85);
    i0.ɵɵtext(104, "Tr\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(105, "option", 86);
    i0.ɵɵtext(106, "Gi\u1EEFa");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(107, "option", 87);
    i0.ɵɵtext(108, "D\u01B0\u1EDBi");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(109, "span", 88);
    i0.ɵɵtext(110, "Kho\u1EA3ng c\u00E1ch l\u1EC1 (mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(111, "div", 89)(112, "div")(113, "span", 90);
    i0.ɵɵtext(114, "Tr\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(115, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_input_ngModelChange_115_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.padTop.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(116, "div")(117, "span", 90);
    i0.ɵɵtext(118, "D\u01B0\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(119, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_input_ngModelChange_119_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.padBottom.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(120, "div")(121, "span", 90);
    i0.ɵɵtext(122, "Tr\u00E1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(123, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_input_ngModelChange_123_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.padLeft.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(124, "div")(125, "span", 90);
    i0.ɵɵtext(126, "Ph\u1EA3i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(127, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_56_Template_input_ngModelChange_127_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.padRight.set($event)); });
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(128, "div", 92)(129, "div", 93);
    i0.ɵɵelement(130, "i", 94);
    i0.ɵɵtext(131, " M\u1EB9o kh\u1EAFc ph\u1EE5c th\u1EEBa gi\u1EA5y tr\u1EAFng:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(132, "ul", 95)(133, "li")(134, "b");
    i0.ɵɵtext(135, "Tr\u00EAn \u1EE9ng d\u1EE5ng:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(136, " Gi\u1EA3m \"Chi\u1EC1u d\u00E0i 1 tem\" v\u00E0 \"Kho\u1EA3ng c\u00E1ch l\u1EC1\" (Tr\u00EAn/D\u01B0\u1EDBi) xu\u1ED1ng m\u1EE9c t\u1ED1i thi\u1EC3u v\u1EEBa \u0111\u1EE7 n\u1ED9i dung.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(137, "li")(138, "b");
    i0.ɵɵtext(139, "H\u1ED9p tho\u1EA1i in (Tr\u00ECnh duy\u1EC7t):");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(140, " M\u1EE5c ");
    i0.ɵɵelementStart(141, "b");
    i0.ɵɵtext(142, "L\u1EC1 (Margins)");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(143, " b\u1EAFt bu\u1ED9c ch\u1ECDn ");
    i0.ɵɵelementStart(144, "b");
    i0.ɵɵtext(145, "Kh\u00F4ng c\u00F3 (None)");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(146, ". T\u1EAFt ");
    i0.ɵɵelementStart(147, "b");
    i0.ɵɵtext(148, "\u0110\u1EA7u trang & Ch\u00E2n trang");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(149, ".");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(150, "li")(151, "b");
    i0.ɵɵtext(152, "Driver Brother (Windows/Mac):");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(153, " V\u00E0o Printing Preferences, t\u00ECm m\u1EE5c ");
    i0.ɵɵelementStart(154, "b");
    i0.ɵɵtext(155, "Margins / Feed Margin (L\u1EC1 n\u1EA1p gi\u1EA5y)");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(156, " v\u00E0 ch\u1EC9nh v\u1EC1 ");
    i0.ɵɵelementStart(157, "b");
    i0.ɵɵtext(158, "0mm");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(159, " (ho\u1EB7c m\u1EE9c nh\u1ECF nh\u1EA5t 1.5mm).");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("ngModel", ctx_r2.brotherPaperType());
    i0.ɵɵadvance(21);
    i0.ɵɵproperty("value", ctx_r2.brotherWidth() + "mm");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.isBrotherFixed() ? 31 : 32);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r2.brotherCols());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isBrotherFixed() ? 38 : -1);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate2("", ctx_r2.brotherWidth(), "mm x ", ctx_r2.Math.round(ctx_r2.actualBrotherLabelHeight() * 10) / 10, "mm");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", ctx_r2.brotherWidth(), "mm x ", ctx_r2.Math.round(ctx_r2.actualBrotherPageHeight() * 10) / 10, "mm");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r2.brotherShowCutLines());
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r2.displayFormat());
    i0.ɵɵadvance(11);
    i0.ɵɵconditional(ctx_r2.displayFormat() !== "text" ? 71 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r2.fontSize());
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("bg-blue-50", ctx_r2.rotateText());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.rotateText() ? "C\u00F3 (-90\u00B0)" : "Kh\u00F4ng");
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("ngModel", ctx_r2.alignX());
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("ngModel", ctx_r2.alignY());
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("ngModel", ctx_r2.padTop());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.padBottom());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.padLeft());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.padRight());
} }
function LabelPrintComponent_Conditional_57_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 102);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tmpl_r8 = ctx.$implicit;
    i0.ɵɵproperty("value", tmpl_r8.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(tmpl_r8.name);
} }
function LabelPrintComponent_Conditional_57_For_20_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 115);
    i0.ɵɵlistener("click", function LabelPrintComponent_Conditional_57_For_20_Template_button_click_0_listener() { const n_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.splitCount.set(n_r10)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const n_r10 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r2.splitCount() === n_r10 ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", n_r10, " ");
} }
function LabelPrintComponent_Conditional_57_Conditional_27_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 117)(1, "label", 65);
    i0.ɵɵtext(2, "GS1 Domain");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 123);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Conditional_41_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.gs1Domain.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div", 124)(5, "label", 65);
    i0.ɵɵtext(6, "M\u00E3 GTIN");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "input", 125);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Conditional_41_Template_input_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.gs1Gtin.set($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r2.gs1Domain());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.gs1Gtin());
} }
function LabelPrintComponent_Conditional_57_Conditional_27_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "label", 65);
    i0.ɵɵtext(2, "R\u1ED9ng v\u1EA1ch (px)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 126);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Conditional_42_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.barcodeWidth.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div")(5, "label", 65);
    i0.ɵɵtext(6, "Cao m\u00E3 (px)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "input", 127);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Conditional_42_Template_input_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.barcodeHeight.set($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r2.barcodeWidth());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.barcodeHeight());
} }
function LabelPrintComponent_Conditional_57_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 114)(1, "div")(2, "label", 65);
    i0.ɵɵtext(3, "Top");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.marginTop.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div")(6, "label", 65);
    i0.ɵɵtext(7, "Left");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.marginLeft.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div")(10, "label", 65);
    i0.ɵɵtext(11, "Gap X");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_12_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.gapX.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div")(14, "label", 65);
    i0.ɵɵtext(15, "Gap Y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_16_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.gapY.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div")(18, "label", 65);
    i0.ɵɵtext(19, "B\u1ECF qua (Tem)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "input", 116);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.skippedCells.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div")(22, "label", 65);
    i0.ɵɵtext(23, "Font Size");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_24_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.fontSize.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "div", 117)(26, "label", 65);
    i0.ɵɵtext(27, "\u0110\u1ECBnh d\u1EA1ng hi\u1EC3n th\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "select", 118);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_select_ngModelChange_28_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.displayFormat.set($event)); });
    i0.ɵɵelementStart(29, "option", 74);
    i0.ɵɵtext(30, "Ch\u1EC9 in Ch\u1EEF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "option", 75);
    i0.ɵɵtext(32, "Ch\u1EC9 in M\u00E3 v\u1EA1ch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "option", 76);
    i0.ɵɵtext(34, "M\u00E3 v\u1EA1ch + Ch\u1EEF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "option", 77);
    i0.ɵɵtext(36, "Ch\u1EC9 in QR Code");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "option", 78);
    i0.ɵɵtext(38, "QR Code + Ch\u1EEF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "option", 119);
    i0.ɵɵtext(40, "QR Code (Hybrid GS1)");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(41, LabelPrintComponent_Conditional_57_Conditional_27_Conditional_41_Template, 8, 2)(42, LabelPrintComponent_Conditional_57_Conditional_27_Conditional_42_Template, 8, 2);
    i0.ɵɵelementStart(43, "div", 117)(44, "label", 65);
    i0.ɵɵtext(45, "C\u0103n l\u1EC1 n\u1ED9i dung (mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "div", 120)(47, "div")(48, "span", 90);
    i0.ɵɵtext(49, "Tr\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_50_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.padTop.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(51, "div")(52, "span", 90);
    i0.ɵɵtext(53, "D\u01B0\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_54_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.padBottom.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(55, "div")(56, "span", 90);
    i0.ɵɵtext(57, "Tr\u00E1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_58_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.padLeft.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(59, "div")(60, "span", 90);
    i0.ɵɵtext(61, "Ph\u1EA3i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(62, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_input_ngModelChange_62_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.padRight.set($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(63, "div", 121)(64, "div")(65, "span", 90);
    i0.ɵɵtext(66, "Ngang");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(67, "select", 122);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_select_ngModelChange_67_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.alignX.set($event)); });
    i0.ɵɵelementStart(68, "option", 85);
    i0.ɵɵtext(69, "Tr\u00E1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(70, "option", 86);
    i0.ɵɵtext(71, "Gi\u1EEFa");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(72, "option", 87);
    i0.ɵɵtext(73, "Ph\u1EA3i");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(74, "div")(75, "span", 90);
    i0.ɵɵtext(76, "D\u1ECDc");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(77, "select", 122);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Conditional_27_Template_select_ngModelChange_77_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.alignY.set($event)); });
    i0.ɵɵelementStart(78, "option", 85);
    i0.ɵɵtext(79, "Tr\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(80, "option", 86);
    i0.ɵɵtext(81, "Gi\u1EEFa");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(82, "option", 87);
    i0.ɵɵtext(83, "D\u01B0\u1EDBi");
    i0.ɵɵelementEnd()()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.marginTop());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.marginLeft());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.gapX());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.gapY());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.skippedCells());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.fontSize());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.displayFormat());
    i0.ɵɵadvance(13);
    i0.ɵɵconditional(ctx_r2.displayFormat() === "qrcode_hybrid" ? 41 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.displayFormat() !== "text" ? 42 : -1);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("ngModel", ctx_r2.padTop());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.padBottom());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.padLeft());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.padRight());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r2.alignX());
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("ngModel", ctx_r2.alignY());
} }
function LabelPrintComponent_Conditional_57_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 34)(1, "div")(2, "label", 53);
    i0.ɵɵtext(3, "M\u1EABu gi\u1EA5y decal (Tomy)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "select", 101);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_57_Template_select_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onTomyChange($event)); });
    i0.ɵɵrepeaterCreate(5, LabelPrintComponent_Conditional_57_For_6_Template, 2, 2, "option", 102, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 103);
    i0.ɵɵelement(8, "i", 104);
    i0.ɵɵelementStart(9, "span");
    i0.ɵɵtext(10, "H\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng c\u0103n l\u1EC1 theo m\u1EABu gi\u1EA5y b\u1EBF s\u1EB5n. B\u1EA1n ch\u1EC9 c\u1EA7n n\u1EA1p gi\u1EA5y v\u00E0o m\u00E1y in A4 th\u00F4ng th\u01B0\u1EDDng.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "div")(12, "div", 105)(13, "label", 106);
    i0.ɵɵtext(14, "Chia nh\u1ECF Tem (Split)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "span", 107);
    i0.ɵɵtext(16, "In nhi\u1EC1u m\u00E3 v\u00E0o 1 \u00F4 tem");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 108)(18, "div", 109);
    i0.ɵɵrepeaterCreate(19, LabelPrintComponent_Conditional_57_For_20_Template, 2, 3, "button", 110, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "div")(22, "button", 111);
    i0.ɵɵlistener("click", function LabelPrintComponent_Conditional_57_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showAdvanced.set(!ctx_r2.showAdvanced())); });
    i0.ɵɵelementStart(23, "span");
    i0.ɵɵelement(24, "i", 112);
    i0.ɵɵtext(25, " C\u0103n Ch\u1EC9nh L\u1EC1 (Mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(26, "i", 113);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(27, LabelPrintComponent_Conditional_57_Conditional_27_Template, 84, 15, "div", 114);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.selectedTomyId());
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.tomyTemplates);
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(4, _c1));
    i0.ɵɵadvance(7);
    i0.ɵɵclassMap(ctx_r2.showAdvanced() ? "fa-chevron-down" : "fa-chevron-right");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.showAdvanced() ? 27 : -1);
} }
function LabelPrintComponent_Conditional_58_For_23_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 115);
    i0.ɵɵlistener("click", function LabelPrintComponent_Conditional_58_For_23_Template_button_click_0_listener() { const n_r16 = i0.ɵɵrestoreView(_r15).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.splitCount.set(n_r16)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const n_r16 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r2.splitCount() === n_r16 ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", n_r16, " ");
} }
function LabelPrintComponent_Conditional_58_Conditional_30_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 117)(1, "label", 65);
    i0.ɵɵtext(2, "GS1 Domain");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 123);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Conditional_37_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r18); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.gs1Domain.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div", 124)(5, "label", 65);
    i0.ɵɵtext(6, "M\u00E3 GTIN");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "input", 125);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Conditional_37_Template_input_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r18); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.gs1Gtin.set($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r2.gs1Domain());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.gs1Gtin());
} }
function LabelPrintComponent_Conditional_58_Conditional_30_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "label", 65);
    i0.ɵɵtext(2, "R\u1ED9ng v\u1EA1ch (px)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 126);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Conditional_38_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r19); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.barcodeWidth.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div")(5, "label", 65);
    i0.ɵɵtext(6, "Cao m\u00E3 (px)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "input", 127);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Conditional_38_Template_input_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r19); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.barcodeHeight.set($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r2.barcodeWidth());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.barcodeHeight());
} }
function LabelPrintComponent_Conditional_58_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 114)(1, "div")(2, "label", 65);
    i0.ɵɵtext(3, "L\u1EC1 tr\u00EAn/d\u01B0\u1EDBi (mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.marginTop.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div")(6, "label", 65);
    i0.ɵɵtext(7, "L\u1EC1 tr\u00E1i/ph\u1EA3i (mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.marginLeft.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div")(10, "label", 65);
    i0.ɵɵtext(11, "Kho\u1EA3ng c\u00E1ch X");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_12_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.gapX.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div")(14, "label", 65);
    i0.ɵɵtext(15, "Kho\u1EA3ng c\u00E1ch Y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_16_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.gapY.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div")(18, "label", 65);
    i0.ɵɵtext(19, "Font Size");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.fontSize.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 117)(22, "label", 65);
    i0.ɵɵtext(23, "\u0110\u1ECBnh d\u1EA1ng hi\u1EC3n th\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "select", 118);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_select_ngModelChange_24_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.displayFormat.set($event)); });
    i0.ɵɵelementStart(25, "option", 74);
    i0.ɵɵtext(26, "Ch\u1EC9 in Ch\u1EEF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "option", 75);
    i0.ɵɵtext(28, "Ch\u1EC9 in M\u00E3 v\u1EA1ch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "option", 76);
    i0.ɵɵtext(30, "M\u00E3 v\u1EA1ch + Ch\u1EEF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "option", 77);
    i0.ɵɵtext(32, "Ch\u1EC9 in QR Code");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "option", 78);
    i0.ɵɵtext(34, "QR Code + Ch\u1EEF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "option", 119);
    i0.ɵɵtext(36, "QR Code (Hybrid GS1)");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(37, LabelPrintComponent_Conditional_58_Conditional_30_Conditional_37_Template, 8, 2)(38, LabelPrintComponent_Conditional_58_Conditional_30_Conditional_38_Template, 8, 2);
    i0.ɵɵelementStart(39, "div", 117)(40, "label", 65);
    i0.ɵɵtext(41, "C\u0103n l\u1EC1 n\u1ED9i dung (mm)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div", 120)(43, "div")(44, "span", 90);
    i0.ɵɵtext(45, "Tr\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_46_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.padTop.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(47, "div")(48, "span", 90);
    i0.ɵɵtext(49, "D\u01B0\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_50_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.padBottom.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(51, "div")(52, "span", 90);
    i0.ɵɵtext(53, "Tr\u00E1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_54_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.padLeft.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(55, "div")(56, "span", 90);
    i0.ɵɵtext(57, "Ph\u1EA3i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "input", 91);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_58_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.padRight.set($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(59, "div", 121)(60, "div")(61, "span", 90);
    i0.ɵɵtext(62, "Ngang");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "select", 122);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_select_ngModelChange_63_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.alignX.set($event)); });
    i0.ɵɵelementStart(64, "option", 85);
    i0.ɵɵtext(65, "Tr\u00E1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(66, "option", 86);
    i0.ɵɵtext(67, "Gi\u1EEFa");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(68, "option", 87);
    i0.ɵɵtext(69, "Ph\u1EA3i");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(70, "div")(71, "span", 90);
    i0.ɵɵtext(72, "D\u1ECDc");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(73, "select", 122);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_select_ngModelChange_73_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.alignY.set($event)); });
    i0.ɵɵelementStart(74, "option", 85);
    i0.ɵɵtext(75, "Tr\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(76, "option", 86);
    i0.ɵɵtext(77, "Gi\u1EEFa");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(78, "option", 87);
    i0.ɵɵtext(79, "D\u01B0\u1EDBi");
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(80, "div", 131)(81, "label", 71)(82, "input", 132);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Conditional_30_Template_input_ngModelChange_82_listener($event) { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showCutLines.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(83, "span", 73);
    i0.ɵɵtext(84, "In vi\u1EC1n c\u1EAFt");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.marginTop());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.marginLeft());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.gapX());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.gapY());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.fontSize());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.displayFormat());
    i0.ɵɵadvance(13);
    i0.ɵɵconditional(ctx_r2.displayFormat() === "qrcode_hybrid" ? 37 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.displayFormat() !== "text" ? 38 : -1);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("ngModel", ctx_r2.padTop());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.padBottom());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.padLeft());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.padRight());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r2.alignX());
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("ngModel", ctx_r2.alignY());
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("ngModel", ctx_r2.showCutLines());
} }
function LabelPrintComponent_Conditional_58_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 34)(1, "div", 128);
    i0.ɵɵelement(2, "i", 129);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "In tr\u00EAn gi\u1EA5y Decal A4 nguy\u00EAn t\u1EDD. H\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 chia l\u01B0\u1EDBi v\u00E0 in vi\u1EC1n m\u1EDD \u0111\u1EC3 b\u1EA1n t\u1EF1 c\u1EAFt.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 130)(6, "div")(7, "label", 65);
    i0.ɵɵtext(8, "S\u1ED1 c\u1ED9t (Ngang)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "input", 67);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Template_input_ngModelChange_9_listener($event) { i0.ɵɵrestoreView(_r14); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.plainCols.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div")(11, "label", 65);
    i0.ɵɵtext(12, "S\u1ED1 h\u00E0ng (D\u1ECDc)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "input", 67);
    i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Conditional_58_Template_input_ngModelChange_13_listener($event) { i0.ɵɵrestoreView(_r14); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.plainRows.set($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(14, "div")(15, "div", 105)(16, "label", 106);
    i0.ɵɵtext(17, "Chia nh\u1ECF Tem (Split)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span", 107);
    i0.ɵɵtext(19, "In nhi\u1EC1u m\u00E3 v\u00E0o 1 \u00F4 tem");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 108)(21, "div", 109);
    i0.ɵɵrepeaterCreate(22, LabelPrintComponent_Conditional_58_For_23_Template, 2, 3, "button", 110, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "div")(25, "button", 111);
    i0.ɵɵlistener("click", function LabelPrintComponent_Conditional_58_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r14); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showAdvanced.set(!ctx_r2.showAdvanced())); });
    i0.ɵɵelementStart(26, "span");
    i0.ɵɵelement(27, "i", 112);
    i0.ɵɵtext(28, " C\u0103n Ch\u1EC9nh & Vi\u1EC1n");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(29, "i", 113);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(30, LabelPrintComponent_Conditional_58_Conditional_30_Template, 85, 15, "div", 114);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("ngModel", ctx_r2.plainCols());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r2.plainRows());
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(5, _c1));
    i0.ɵɵadvance(7);
    i0.ɵɵclassMap(ctx_r2.showAdvanced() ? "fa-chevron-down" : "fa-chevron-right");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.showAdvanced() ? 30 : -1);
} }
function LabelPrintComponent_Conditional_60_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 133);
    i0.ɵɵlistener("click", function LabelPrintComponent_Conditional_60_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r20); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.printBrother()); });
    i0.ɵɵelement(1, "i", 134);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "In Ngay (Brother)");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r2.rawInputCount() === 0);
} }
function LabelPrintComponent_Conditional_61_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 135);
    i0.ɵɵlistener("click", function LabelPrintComponent_Conditional_61_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r21); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.printA4()); });
    i0.ɵɵelement(1, "i", 134);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "In Ngay (A4)");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r2.rawInputCount() === 0);
} }
function LabelPrintComponent_Conditional_75_For_6_For_3_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 150);
} if (rf & 2) {
    const label_r22 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵstyleProp("height", ctx_r2.barcodeHeight(), "px");
    i0.ɵɵproperty("src", ctx_r2.generateBarcode(label_r22), i0.ɵɵsanitizeUrl);
} }
function LabelPrintComponent_Conditional_75_For_6_For_3_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 151);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const label_r22 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵstyleProp("text-align", ctx_r2.alignX() === "flex-start" ? "left" : ctx_r2.alignX() === "flex-end" ? "right" : "center")("font-size", ctx_r2.fontSize(), "pt");
    i0.ɵɵclassProp("mt-1", ctx_r2.displayFormat() === "barcode_text" || ctx_r2.displayFormat() === "qrcode_text" || ctx_r2.displayFormat() === "qrcode_hybrid")("text-red-600", label_r22.length > 30);
    i0.ɵɵproperty("title", label_r22.length > 30 ? "C\u1EA3nh b\u00E1o: M\u00E3 qu\u00E1 d\u00E0i c\u00F3 th\u1EC3 b\u1ECB c\u1EAFt khi in" : "");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", label_r22, " ");
} }
function LabelPrintComponent_Conditional_75_For_6_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 146)(1, "div", 147);
    i0.ɵɵtemplate(2, LabelPrintComponent_Conditional_75_For_6_For_3_Conditional_2_Template, 1, 3, "img", 148)(3, LabelPrintComponent_Conditional_75_For_6_For_3_Conditional_3_Template, 2, 10, "span", 149);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const label_r22 = ctx.$implicit;
    const $index_r23 = ctx.$index;
    const page_r24 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("border-r", ctx_r2.brotherShowCutLines() && $index_r23 % ctx_r2.brotherCols() !== ctx_r2.brotherCols() - 1)("border-b", ctx_r2.brotherShowCutLines() && ctx_r2.Math.floor($index_r23 / ctx_r2.brotherCols()) !== page_r24.length / ctx_r2.brotherCols() - 1)("border-dashed", ctx_r2.brotherShowCutLines())("border-slate-600", ctx_r2.brotherShowCutLines());
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("align-items", ctx_r2.alignX())("justify-content", ctx_r2.alignY())("padding-top", ctx_r2.padTop(), "mm")("padding-bottom", ctx_r2.padBottom(), "mm")("padding-left", ctx_r2.padLeft(), "mm")("padding-right", ctx_r2.padRight(), "mm")("transform", ctx_r2.rotateText() ? "rotate(-90deg)" : "none")("width", ctx_r2.rotateText() ? "100cqh" : "100cqw")("height", ctx_r2.rotateText() ? "100cqw" : "100cqh");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.displayFormat() !== "text" && label_r22 ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.displayFormat() !== "barcode" && ctx_r2.displayFormat() !== "qrcode" && label_r22 ? 3 : -1);
} }
function LabelPrintComponent_Conditional_75_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 143)(1, "div", 144);
    i0.ɵɵrepeaterCreate(2, LabelPrintComponent_Conditional_75_For_6_For_3_Template, 4, 28, "div", 145, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const page_r24 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵstyleProp("height", ctx_r2.brotherPreviewPageHeight(), "mm");
    i0.ɵɵclassProp("border-b", ctx_r2.isBrotherFixed())("border-dashed", ctx_r2.isBrotherFixed())("border-slate-600", ctx_r2.isBrotherFixed());
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("grid-template-columns", "repeat(" + ctx_r2.brotherCols() + ", 1fr)")("grid-template-rows", "repeat(" + page_r24.length / ctx_r2.brotherCols() + ", 1fr)");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(page_r24);
} }
function LabelPrintComponent_Conditional_75_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 140);
    i0.ɵɵtext(1, "Tr\u1ED1ng");
    i0.ɵɵelementEnd();
} }
function LabelPrintComponent_Conditional_75_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r25 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 141);
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "button", 152);
    i0.ɵɵlistener("click", function LabelPrintComponent_Conditional_75_Conditional_8_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r25); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showFullPreview.set(true)); });
    i0.ɵɵtext(3, "Hi\u1EC7n t\u1EA5t c\u1EA3");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" Preview \u0111ang hi\u1EC3n th\u1ECB nhanh ", ctx_r2.rawInputCount() - ctx_r2.hiddenBrotherPreviewLabelCount(), "/", ctx_r2.rawInputCount(), " tem \u0111\u1EC3 tr\u00E1nh lag. ");
} }
function LabelPrintComponent_Conditional_75_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 49)(1, "div", 136);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 137)(4, "div", 138);
    i0.ɵɵrepeaterCreate(5, LabelPrintComponent_Conditional_75_For_6_Template, 4, 12, "div", 139, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵtemplate(7, LabelPrintComponent_Conditional_75_Conditional_7_Template, 2, 0, "div", 140);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(8, LabelPrintComponent_Conditional_75_Conditional_8_Template, 4, 2, "div", 141);
    i0.ɵɵelement(9, "div", 142);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("M\u00F4 ph\u1ECFng cu\u1ED9n in (", ctx_r2.brotherWidth(), "mm)");
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ctx_r2.brotherWidth(), "mm")("min-height", 100, "mm");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.brotherPreviewPages());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.rawInputCount() === 0 ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.hiddenBrotherPreviewLabelCount() > 0 ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("width", ctx_r2.brotherWidth() + 8, "mm");
} }
function LabelPrintComponent_Conditional_76_For_1_For_3_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 161);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cell_r26 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(cell_r26.index + 1);
} }
function LabelPrintComponent_Conditional_76_For_1_For_3_For_3_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 150);
} if (rf & 2) {
    const label_r27 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵstyleProp("height", ctx_r2.barcodeHeight(), "px");
    i0.ɵɵproperty("src", ctx_r2.generateBarcode(label_r27), i0.ɵɵsanitizeUrl);
} }
function LabelPrintComponent_Conditional_76_For_1_For_3_For_3_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 151);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const label_r27 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵstyleProp("text-align", ctx_r2.alignX() === "flex-start" ? "left" : ctx_r2.alignX() === "flex-end" ? "right" : "center")("font-size", ctx_r2.fontSize(), "pt")("font-family", "Roboto Mono");
    i0.ɵɵclassProp("mt-1", ctx_r2.displayFormat() === "barcode_text" || ctx_r2.displayFormat() === "qrcode_text" || ctx_r2.displayFormat() === "qrcode_hybrid")("text-red-600", label_r27.length > 30);
    i0.ɵɵproperty("title", label_r27.length > 30 ? "C\u1EA3nh b\u00E1o: M\u00E3 qu\u00E1 d\u00E0i c\u00F3 th\u1EC3 b\u1ECB c\u1EAFt khi in" : "");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", label_r27, " ");
} }
function LabelPrintComponent_Conditional_76_For_1_For_3_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 163)(1, "div", 147);
    i0.ɵɵtemplate(2, LabelPrintComponent_Conditional_76_For_1_For_3_For_3_Conditional_2_Template, 1, 3, "img", 148)(3, LabelPrintComponent_Conditional_76_For_1_For_3_For_3_Conditional_3_Template, 2, 12, "span", 164);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const label_r27 = ctx.$implicit;
    const ɵ$index_939_r28 = ctx.$index;
    const ɵ$count_939_r29 = ctx.$count;
    const ctx_r2 = i0.ɵɵnextContext(4);
    i0.ɵɵclassProp("border-b", !(ɵ$index_939_r28 === ɵ$count_939_r29 - 1));
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("align-items", ctx_r2.alignX())("justify-content", ctx_r2.alignY())("padding-top", ctx_r2.padTop(), "mm")("padding-bottom", ctx_r2.padBottom(), "mm")("padding-left", ctx_r2.padLeft(), "mm")("padding-right", ctx_r2.padRight(), "mm")("transform", ctx_r2.rotateText() ? "rotate(-90deg)" : "none")("width", ctx_r2.rotateText() ? "100cqh" : "100cqw")("height", ctx_r2.rotateText() ? "100cqw" : "100cqh");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.displayFormat() !== "text" && label_r27 ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.displayFormat() !== "barcode" && ctx_r2.displayFormat() !== "qrcode" && label_r27 ? 3 : -1);
} }
function LabelPrintComponent_Conditional_76_For_1_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 160);
    i0.ɵɵtemplate(1, LabelPrintComponent_Conditional_76_For_1_For_3_Conditional_1_Template, 2, 1, "div", 161);
    i0.ɵɵrepeaterCreate(2, LabelPrintComponent_Conditional_76_For_1_For_3_For_3_Template, 4, 22, "div", 162, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cell_r26 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("border", ctx_r2.printMode() === "tomy_a4" || ctx_r2.printMode() === "plain_a4" && ctx_r2.showCutLines())("border-slate-200", ctx_r2.printMode() === "tomy_a4")("border-slate-600", ctx_r2.printMode() === "plain_a4" && ctx_r2.showCutLines())("border-dashed", ctx_r2.printMode() === "plain_a4" && ctx_r2.showCutLines())("bg-slate-50", cell_r26.isEmpty)("opacity-40", cell_r26.isEmpty);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!cell_r26.isEmpty ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(cell_r26.subLabels);
} }
function LabelPrintComponent_Conditional_76_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 155)(1, "div", 156);
    i0.ɵɵrepeaterCreate(2, LabelPrintComponent_Conditional_76_For_1_For_3_Template, 4, 13, "div", 157, _forTrack2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 158)(5, "span", 159);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const page_r30 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵstyleMapInterpolate4("padding-top: ", ctx_r2.marginTop(), "mm; padding-left: ", ctx_r2.marginLeft(), "mm; padding-right: ", ctx_r2.marginLeft(), "mm; padding-bottom: ", ctx_r2.marginTop(), "mm;");
    i0.ɵɵstyleProp("width", ctx_r2.layoutDims().pageW, "mm")("height", ctx_r2.layoutDims().pageH, "mm");
    i0.ɵɵpropertyInterpolate1("id", "label-page-", page_r30.pageIndex, "");
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("grid-template-columns", "repeat(" + ctx_r2.layoutDims().cols + ", " + ctx_r2.layoutDims().cellW + "mm)")("grid-template-rows", "repeat(" + ctx_r2.layoutDims().rows + ", " + ctx_r2.layoutDims().cellH + "mm)")("gap", ctx_r2.gapY() + "mm " + ctx_r2.gapX() + "mm");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(page_r30.cells);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" Page ", page_r30.pageIndex + 1, " (A4) ");
} }
function LabelPrintComponent_Conditional_76_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r31 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 154);
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "button", 152);
    i0.ɵɵlistener("click", function LabelPrintComponent_Conditional_76_Conditional_2_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r31); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showFullPreview.set(true)); });
    i0.ɵɵtext(3, "Hi\u1EC7n t\u1EA5t c\u1EA3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 165);
    i0.ɵɵtext(5, "Khi b\u1EA5m in, h\u1EC7 th\u1ED1ng v\u1EABn in \u0111\u1EE7 to\u00E0n b\u1ED9 d\u1EEF li\u1EC7u.");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" Preview \u0111ang hi\u1EC3n th\u1ECB ", ctx_r2.previewPages().length, "/", ctx_r2.pages().length, " trang \u0111\u1EA7u \u0111\u1EC3 gi\u1EEF m\u00E0n h\u00ECnh m\u01B0\u1EE3t. ");
} }
function LabelPrintComponent_Conditional_76_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, LabelPrintComponent_Conditional_76_For_1_Template, 7, 19, "div", 153, _forTrack1);
    i0.ɵɵtemplate(2, LabelPrintComponent_Conditional_76_Conditional_2_Template, 6, 2, "div", 154);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵrepeater(ctx_r2.previewPages());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.hiddenPreviewPageCount() > 0 ? 2 : -1);
} }
const TOMY_TEMPLATES = [
    { id: 'tomy_145', name: 'Tomy 145 (65 tem - 38x21mm)', cols: 5, rows: 13, cellW: 38, cellH: 21, marginTop: 12, marginLeft: 10, gapX: 0, gapY: 0 },
    { id: 'tomy_149', name: 'Tomy 149 (21 tem - 70x42.5mm)', cols: 3, rows: 7, cellW: 70, cellH: 42.5, marginTop: 0, marginLeft: 0, gapX: 0, gapY: 0 },
    { id: 'tomy_144', name: 'Tomy 144 (30 tem - 67x28mm)', cols: 3, rows: 10, cellW: 67, cellH: 28, marginTop: 8.5, marginLeft: 4.5, gapX: 0, gapY: 0 },
    { id: 'tomy_109', name: 'Tomy 109 (96 tem - 22x14mm)', cols: 8, rows: 12, cellW: 22, cellH: 14, marginTop: 64.5, marginLeft: 17, gapX: 0, gapY: 0 },
];
export class LabelPrintComponent {
    set initialData(value) {
        if (value) {
            this.rawInput.set(value);
            this.displayFormat.set('qrcode_text');
        }
    }
    constructor() {
        this.Math = Math;
        this.toast = inject(ToastService);
        this.state = inject(StateService);
        // Core State
        this.printMode = signal('tomy_a4');
        this.rawInput = signal('');
        this.zoomLevel = signal(1.0);
        // Input Debounce
        this.inputSubject = new Subject();
        this.barcodeImageCache = new Map();
        this.barcodeImagePending = new Map();
        this.barcodeCacheVersion = signal(0);
        this.maxBarcodeCacheSize = 300;
        this.maxPreviewPages = 3;
        this.maxBrotherPreviewCells = 80;
        this.transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        // Fetch Data State
        this.fetchDate = signal(timestampToLocalDateKey(new Date()) || '');
        // Layout Config
        this.splitCount = signal(1);
        this.fontSize = signal(12);
        this.rotateText = signal(false);
        this.displayFormat = signal('text');
        this.barcodeWidth = signal(1.5);
        this.barcodeHeight = signal(30);
        // Content Alignment & Padding
        this.alignX = signal('center');
        this.alignY = signal('center');
        this.padTop = signal(2);
        this.padBottom = signal(2);
        this.padLeft = signal(2);
        this.padRight = signal(2);
        // Tomy Config
        this.tomyTemplates = TOMY_TEMPLATES;
        this.selectedTomyId = signal('tomy_145');
        // Plain A4 Config
        this.plainCols = signal(4);
        this.plainRows = signal(10);
        this.showCutLines = signal(true);
        // Sheet Calibration (A4/A5)
        this.marginTop = signal(10);
        this.marginLeft = signal(5);
        this.gapX = signal(2);
        this.gapY = signal(2);
        this.skippedCells = signal(0);
        this.showAdvanced = signal(false);
        this.showFullPreview = signal(false);
        // GS1 Config
        this.gs1Domain = signal('https://nafiqpm6.vercel.app');
        this.gs1Gtin = signal('08934567890128');
        // Brother Config
        this.brotherPaperType = signal('62');
        this.brotherWidth = signal(62);
        this.brotherLabelHeight = signal(25); // For continuous
        this.brotherPageHeight = signal(90); // For fixed
        this.brotherCols = signal(1);
        this.brotherRows = signal(1);
        this.brotherShowCutLines = signal(false);
        this.isBrotherFixed = computed(() => ['29x90', '29x42', '32x32', '23x23'].includes(this.brotherPaperType()));
        this.actualBrotherPageHeight = computed(() => {
            if (this.isBrotherFixed())
                return this.brotherPageHeight();
            const labels = this.parseInput(this.rawInput());
            const cols = Math.max(1, this.brotherCols());
            const rows = Math.max(1, Math.ceil(labels.length / cols));
            return this.brotherLabelHeight() * rows;
        });
        this.actualBrotherLabelHeight = computed(() => {
            if (this.isBrotherFixed())
                return this.brotherPageHeight() / Math.max(1, this.brotherRows());
            return this.brotherLabelHeight();
        });
        // Computed
        this.rawInputCount = computed(() => this.parseInput(this.rawInput()).length);
        this.brotherPages = computed(() => {
            const labels = this.parseInput(this.rawInput());
            if (labels.length === 0)
                return [];
            const cols = Math.max(1, this.brotherCols());
            if (!this.isBrotherFixed()) {
                // Continuous roll: All labels in ONE single page
                const totalCells = Math.ceil(labels.length / cols) * cols;
                const page = [...labels];
                while (page.length < totalCells)
                    page.push('');
                return [page];
            }
            else {
                // Fixed size: Split into multiple pages
                const rows = Math.max(1, this.brotherRows());
                const perPage = cols * rows;
                const pages = [];
                for (let i = 0; i < labels.length; i += perPage) {
                    const chunk = labels.slice(i, i + perPage);
                    while (chunk.length < perPage) {
                        chunk.push(''); // Fill empty cells
                    }
                    pages.push(chunk);
                }
                return pages;
            }
        });
        this.layoutDims = computed(() => {
            const mode = this.printMode();
            if (mode === 'tomy_a4') {
                const tmpl = this.tomyTemplates.find(t => t.id === this.selectedTomyId()) || this.tomyTemplates[0];
                return { pageW: 210, pageH: 297, cellW: tmpl.cellW, cellH: tmpl.cellH, cols: tmpl.cols, rows: tmpl.rows };
            }
            else if (mode === 'plain_a4') {
                const c = this.plainCols();
                const r = this.plainRows();
                const w = (210 - this.marginLeft() * 2 - this.gapX() * (c - 1)) / c;
                const h = (297 - this.marginTop() * 2 - this.gapY() * (r - 1)) / r;
                return { pageW: 210, pageH: 297, cellW: w, cellH: h, cols: c, rows: r };
            }
            return { pageW: 0, pageH: 0, cellW: 0, cellH: 0, cols: 0, rows: 0 };
        });
        // --- SHEET LOGIC ---
        this.pages = computed(() => {
            if (this.printMode() === 'brother')
                return [];
            const rawIds = this.parseInput(this.rawInput());
            const split = this.splitCount();
            const skipped = this.skippedCells();
            // Calculate cells per page based on layout
            const dims = this.layoutDims();
            const cols = dims.cols || 1;
            const rows = dims.rows || 1;
            const CELLS_PER_PAGE = cols * rows;
            const allCells = [];
            let globalCellIndex = 0;
            // Fill Skipped
            for (let i = 0; i < skipped; i++) {
                allCells.push({ subLabels: [], isEmpty: true, index: globalCellIndex++ });
            }
            // Fill Data
            let currentSub = [];
            for (const id of rawIds) {
                currentSub.push(id);
                if (currentSub.length === split) {
                    allCells.push({ subLabels: [...currentSub], isEmpty: false, index: globalCellIndex++ });
                    currentSub = [];
                }
            }
            if (currentSub.length > 0) {
                allCells.push({ subLabels: [...currentSub], isEmpty: false, index: globalCellIndex++ });
            }
            // Pagination
            const pages = [];
            for (let i = 0; i < allCells.length; i += CELLS_PER_PAGE) {
                const pageCells = allCells.slice(i, i + CELLS_PER_PAGE);
                while (pageCells.length < CELLS_PER_PAGE) {
                    pageCells.push({ subLabels: [], isEmpty: true, index: -1 });
                }
                pages.push({ cells: pageCells, pageIndex: pages.length });
            }
            if (pages.length === 0 && rawIds.length === 0) {
                const emptyCells = Array(CELLS_PER_PAGE).fill(null).map((_, idx) => ({
                    subLabels: [], isEmpty: true, index: idx < skipped ? idx : -1
                }));
                pages.push({ cells: emptyCells, pageIndex: 0 });
            }
            return pages;
        });
        this.previewPages = computed(() => {
            const pages = this.pages();
            if (this.showFullPreview())
                return pages;
            return pages.slice(0, this.maxPreviewPages);
        });
        this.hiddenPreviewPageCount = computed(() => {
            if (this.showFullPreview())
                return 0;
            return Math.max(0, this.pages().length - this.previewPages().length);
        });
        this.brotherPreviewPages = computed(() => {
            const pages = this.brotherPages();
            if (this.showFullPreview() || pages.length === 0)
                return pages;
            if (this.isBrotherFixed()) {
                return pages.slice(0, this.maxPreviewPages);
            }
            const cols = Math.max(1, this.brotherCols());
            const maxRows = Math.max(1, Math.ceil(this.maxBrotherPreviewCells / cols));
            const maxCells = maxRows * cols;
            return [pages[0].slice(0, maxCells)];
        });
        this.brotherPreviewPageHeight = computed(() => {
            if (this.showFullPreview() || this.isBrotherFixed())
                return this.actualBrotherPageHeight();
            const firstPreviewPage = this.brotherPreviewPages()[0] || [];
            const rows = Math.max(1, Math.ceil(firstPreviewPage.length / Math.max(1, this.brotherCols())));
            return this.brotherLabelHeight() * rows;
        });
        this.hiddenBrotherPreviewLabelCount = computed(() => {
            if (this.showFullPreview())
                return 0;
            const renderedLabels = this.brotherPreviewPages().flat().filter(Boolean).length;
            return Math.max(0, this.rawInputCount() - renderedLabels);
        });
        this.state.ensureApprovedRequestsListener();
        // Setup Debounce for Input
        this.inputSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(val => {
            this.rawInput.set(val);
        });
        // Load saved config from localStorage
        this.loadProfile('tomy_a4'); // Load default profile first
        // Save config to localStorage whenever it changes
        effect(() => {
            this.saveCurrentProfile();
        });
    }
    ngAfterViewInit() {
        // Auto fit to screen on load
        setTimeout(() => this.fitToScreen(), 100);
    }
    // --- PROFILE MANAGEMENT ---
    getProfileKey(mode) {
        return `labelPrintConfig_${mode}`;
    }
    loadProfile(mode) {
        const saved = localStorage.getItem(this.getProfileKey(mode));
        if (saved) {
            try {
                const config = JSON.parse(saved);
                // Common
                if (config.fontSize)
                    this.fontSize.set(config.fontSize);
                if (config.rotateText !== undefined)
                    this.rotateText.set(config.rotateText);
                if (config.splitCount)
                    this.splitCount.set(config.splitCount);
                if (config.displayFormat)
                    this.displayFormat.set(config.displayFormat);
                if (config.barcodeWidth)
                    this.barcodeWidth.set(config.barcodeWidth);
                if (config.barcodeHeight)
                    this.barcodeHeight.set(config.barcodeHeight);
                if (config.alignX)
                    this.alignX.set(config.alignX);
                if (config.alignY)
                    this.alignY.set(config.alignY);
                if (config.padTop !== undefined)
                    this.padTop.set(config.padTop);
                if (config.padBottom !== undefined)
                    this.padBottom.set(config.padBottom);
                if (config.padLeft !== undefined)
                    this.padLeft.set(config.padLeft);
                if (config.padRight !== undefined)
                    this.padRight.set(config.padRight);
                // Brother
                if (mode === 'brother') {
                    if (config.brotherPaperType)
                        this.brotherPaperType.set(config.brotherPaperType);
                    if (config.brotherCols)
                        this.brotherCols.set(config.brotherCols);
                    if (config.brotherRows)
                        this.brotherRows.set(config.brotherRows);
                    if (config.brotherShowCutLines !== undefined)
                        this.brotherShowCutLines.set(config.brotherShowCutLines);
                    if (config.brotherWidth)
                        this.brotherWidth.set(config.brotherWidth);
                    if (config.brotherLabelHeight)
                        this.brotherLabelHeight.set(config.brotherLabelHeight);
                    if (config.brotherPageHeight)
                        this.brotherPageHeight.set(config.brotherPageHeight);
                    // Migration from old brotherHeight
                    if (config.brotherHeight && !config.brotherLabelHeight && !config.brotherPageHeight) {
                        if (['29x90', '29x42', '32x32', '23x23'].includes(config.brotherPaperType)) {
                            this.brotherPageHeight.set(config.brotherHeight);
                        }
                        else {
                            this.brotherLabelHeight.set(config.brotherHeight);
                        }
                    }
                }
                // Tomy
                if (mode === 'tomy_a4') {
                    if (config.selectedTomyId)
                        this.selectedTomyId.set(config.selectedTomyId);
                    if (config.marginTop !== undefined)
                        this.marginTop.set(config.marginTop);
                    if (config.marginLeft !== undefined)
                        this.marginLeft.set(config.marginLeft);
                    if (config.gapX !== undefined)
                        this.gapX.set(config.gapX);
                    if (config.gapY !== undefined)
                        this.gapY.set(config.gapY);
                }
                // Plain A4
                if (mode === 'plain_a4') {
                    if (config.plainCols)
                        this.plainCols.set(config.plainCols);
                    if (config.plainRows)
                        this.plainRows.set(config.plainRows);
                    if (config.marginTop !== undefined)
                        this.marginTop.set(config.marginTop);
                    if (config.marginLeft !== undefined)
                        this.marginLeft.set(config.marginLeft);
                    if (config.gapX !== undefined)
                        this.gapX.set(config.gapX);
                    if (config.gapY !== undefined)
                        this.gapY.set(config.gapY);
                    if (config.showCutLines !== undefined)
                        this.showCutLines.set(config.showCutLines);
                }
            }
            catch (e) {
                console.error(`Failed to load print config for ${mode}`, e);
            }
        }
        else {
            // Apply defaults if no profile exists
            this.applyDefaultsForMode(mode);
        }
    }
    saveCurrentProfile() {
        const mode = this.printMode();
        const config = {
            fontSize: this.fontSize(),
            rotateText: this.rotateText(),
            splitCount: this.splitCount(),
            displayFormat: this.displayFormat(),
            barcodeWidth: this.barcodeWidth(),
            barcodeHeight: this.barcodeHeight(),
            alignX: this.alignX(),
            alignY: this.alignY(),
            padTop: this.padTop(),
            padBottom: this.padBottom(),
            padLeft: this.padLeft(),
            padRight: this.padRight()
        };
        if (mode === 'brother') {
            config.brotherPaperType = this.brotherPaperType();
            config.brotherCols = this.brotherCols();
            config.brotherRows = this.brotherRows();
            config.brotherShowCutLines = this.brotherShowCutLines();
            config.brotherWidth = this.brotherWidth();
            config.brotherLabelHeight = this.brotherLabelHeight();
            config.brotherPageHeight = this.brotherPageHeight();
        }
        else if (mode === 'tomy_a4') {
            config.selectedTomyId = this.selectedTomyId();
            config.marginTop = this.marginTop();
            config.marginLeft = this.marginLeft();
            config.gapX = this.gapX();
            config.gapY = this.gapY();
        }
        else if (mode === 'plain_a4') {
            config.plainCols = this.plainCols();
            config.plainRows = this.plainRows();
            config.marginTop = this.marginTop();
            config.marginLeft = this.marginLeft();
            config.gapX = this.gapX();
            config.gapY = this.gapY();
            config.showCutLines = this.showCutLines();
        }
        localStorage.setItem(this.getProfileKey(mode), JSON.stringify(config));
        // Also save the last used mode
        localStorage.setItem('labelPrintLastMode', mode);
    }
    applyDefaultsForMode(mode) {
        if (mode === 'brother') {
            this.onBrotherPaperChange('62');
        }
        else if (mode === 'tomy_a4') {
            this.onTomyChange('tomy_145');
        }
        else if (mode === 'plain_a4') {
            this.marginTop.set(10);
            this.marginLeft.set(10);
            this.gapX.set(0);
            this.gapY.set(0);
            this.splitCount.set(1);
            this.rotateText.set(false);
            this.fontSize.set(10);
            this.plainCols.set(4);
            this.plainRows.set(10);
            this.showCutLines.set(true);
        }
    }
    setMode(mode) {
        if (this.printMode() === mode)
            return;
        // Save current profile before switching
        this.saveCurrentProfile();
        this.printMode.set(mode);
        this.resetPreviewLimit();
        // Load profile for new mode
        this.loadProfile(mode);
        // Reset view defaults
        setTimeout(() => this.fitToScreen(), 50);
    }
    onTomyChange(id) {
        this.selectedTomyId.set(id);
        const tmpl = this.tomyTemplates.find(t => t.id === id);
        if (tmpl) {
            this.marginTop.set(tmpl.marginTop);
            this.marginLeft.set(tmpl.marginLeft);
            this.gapX.set(tmpl.gapX);
            this.gapY.set(tmpl.gapY);
            this.splitCount.set(1);
            this.rotateText.set(false);
        }
    }
    onBrotherPaperChange(type) {
        this.brotherPaperType.set(type);
        if (type === '62') {
            this.brotherWidth.set(62);
            this.brotherLabelHeight.set(25);
            this.fontSize.set(16);
            this.rotateText.set(false);
            this.brotherCols.set(1);
            this.brotherRows.set(1);
        }
        else if (type === '29') {
            this.brotherWidth.set(29);
            this.brotherLabelHeight.set(15);
            this.fontSize.set(10);
            this.rotateText.set(false);
            this.brotherCols.set(1);
            this.brotherRows.set(1);
        }
        else if (type === '29x90') {
            this.brotherWidth.set(29);
            this.brotherPageHeight.set(90);
            this.fontSize.set(10);
            this.rotateText.set(false);
            this.brotherCols.set(1);
            this.brotherRows.set(6); // 6 labels of 15mm
        }
        else if (type === '29x42') {
            this.brotherWidth.set(29);
            this.brotherPageHeight.set(42);
            this.fontSize.set(10);
            this.rotateText.set(false);
            this.brotherCols.set(1);
            this.brotherRows.set(3); // 3 labels of 14mm
        }
        else if (type === '32x32') {
            this.brotherWidth.set(32);
            this.brotherPageHeight.set(32);
            this.fontSize.set(10);
            this.rotateText.set(false);
            this.brotherCols.set(1);
            this.brotherRows.set(1);
        }
        else if (type === '23x23') {
            this.brotherWidth.set(23);
            this.brotherPageHeight.set(23);
            this.fontSize.set(10);
            this.rotateText.set(false);
            this.brotherCols.set(1);
            this.brotherRows.set(1);
        }
        else if (type === '12') {
            this.brotherWidth.set(12);
            this.brotherLabelHeight.set(30);
            this.fontSize.set(10);
            this.rotateText.set(true);
            this.brotherCols.set(1);
            this.brotherRows.set(1);
        }
    }
    fetchFromRequests() {
        const targetDate = this.fetchDate();
        if (!targetDate)
            return;
        const approvedReqs = this.state.approvedRequests();
        const samples = new Set();
        approvedReqs.forEach(req => {
            // Lấy ngày phân tích hoặc ngày duyệt
            let reqDateStr = '';
            if (req.analysisDate) {
                reqDateStr = req.analysisDate;
            }
            else {
                reqDateStr = timestampToLocalDateKey(req.approvedAt ?? req.timestamp) || '';
            }
            if (reqDateStr === targetDate && req.sampleList && req.sampleList.length > 0) {
                req.sampleList.forEach(s => samples.add(s));
            }
        });
        if (samples.size === 0) {
            this.toast.show(`Không tìm thấy mẫu nào trong các yêu cầu đã duyệt ngày ${targetDate}`, 'info');
            return;
        }
        const currentInput = this.rawInput().trim();
        const newSamples = Array.from(samples).join('\n');
        if (currentInput) {
            this.rawInput.set(currentInput + '\n' + newSamples);
        }
        else {
            this.rawInput.set(newSamples);
        }
        this.resetPreviewLimit();
        this.toast.show(`Đã thêm ${samples.size} mã mẫu từ ngày ${targetDate}`, 'success');
    }
    onInputChanged(val) {
        this.resetPreviewLimit();
        this.inputSubject.next(val);
    }
    updateInput(val) {
        this.resetPreviewLimit();
        this.rawInput.set(val);
    }
    clearInput() {
        this.resetPreviewLimit();
        this.rawInput.set('');
        this.inputSubject.next('');
    }
    removeDuplicates() {
        const labels = this.parseInput(this.rawInput());
        const unique = [...new Set(labels)];
        const newVal = unique.join('\n');
        this.resetPreviewLimit();
        this.rawInput.set(newVal);
        this.inputSubject.next(newVal);
        this.toast.show(`Đã lọc bỏ ${labels.length - unique.length} mã trùng lặp`, 'success');
    }
    sortInput() {
        const labels = this.parseInput(this.rawInput());
        const sorted = labels.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        const newVal = sorted.join('\n');
        this.resetPreviewLimit();
        this.rawInput.set(newVal);
        this.inputSubject.next(newVal);
        this.toast.show('Đã sắp xếp danh sách A-Z', 'success');
    }
    addExample() {
        const ex = Array.from({ length: 15 }, (_, i) => `STD-${(i + 1).toString().padStart(3, '0')}`).join('\n');
        this.resetPreviewLimit();
        this.rawInput.set(ex);
        this.inputSubject.next(ex);
    }
    resetPreviewLimit() {
        if (this.showFullPreview())
            this.showFullPreview.set(false);
    }
    adjustZoom(delta) {
        this.zoomLevel.update(z => Math.max(0.3, Math.min(3.0, z + delta)));
    }
    fitToScreen() {
        if (!this.previewContainer)
            return;
        const containerWidth = this.previewContainer.nativeElement.clientWidth - 64; // 64px padding
        const mode = this.printMode();
        let targetWidthMM = 210; // A4 width
        if (mode === 'brother') {
            targetWidthMM = this.brotherWidth();
        }
        // Convert mm to pixels (approximate 1mm = 3.78px)
        const targetWidthPx = targetWidthMM * 3.78;
        if (targetWidthPx > 0) {
            // Calculate zoom to fit width (with a max of 2.0)
            const newZoom = Math.min(2.0, Math.max(0.3, containerWidth / targetWidthPx));
            // Round to 1 decimal place
            this.zoomLevel.set(Math.round(newZoom * 10) / 10);
        }
    }
    parseInput(text) {
        return text.split(/[\n,;]+/).map(s => s.trim()).filter(s => s !== '');
    }
    generateBarcode(text) {
        this.barcodeCacheVersion();
        if (!text || this.displayFormat() === 'text')
            return '';
        const key = this.getBarcodeCacheKey(text);
        const cached = this.barcodeImageCache.get(key);
        if (cached)
            return cached;
        void this.getBarcodeDataUrl(text).catch(e => {
            console.error('Barcode preview error:', e);
        });
        return this.transparentPixel;
    }
    getBarcodeCacheKey(text) {
        return [
            text,
            this.displayFormat(),
            this.barcodeWidth(),
            this.barcodeHeight(),
            this.gs1Domain(),
            this.gs1Gtin()
        ].join('|');
    }
    isQrFormat(format = this.displayFormat()) {
        return format === 'qrcode' || format === 'qrcode_text' || format === 'qrcode_hybrid';
    }
    getQrPayload(text, format = this.displayFormat()) {
        if (format !== 'qrcode_hybrid')
            return text;
        const domain = this.gs1Domain().replace(/\/$/, '');
        const gtin = this.gs1Gtin();
        // We use the text as LIMS ID. We don't have lot/expiry here easily,
        // but we can construct the basic URL.
        return `${domain}/01/${gtin}?240=${encodeURIComponent(text)}`;
    }
    async loadBarcodeLib() {
        this.barcodeLibLoader ??= import('jsbarcode').then(module => module.default || module);
        return this.barcodeLibLoader;
    }
    async loadQrLib() {
        this.qrLibLoader ??= import('qrcode');
        return this.qrLibLoader;
    }
    async getBarcodeDataUrl(text) {
        if (!text || this.displayFormat() === 'text')
            return '';
        const key = this.getBarcodeCacheKey(text);
        const cached = this.barcodeImageCache.get(key);
        if (cached)
            return cached;
        const pending = this.barcodeImagePending.get(key);
        if (pending)
            return pending;
        const promise = this.createBarcodeDataUrl(text)
            .then(dataUrl => {
            if (dataUrl) {
                this.barcodeImageCache.set(key, dataUrl);
                if (this.barcodeImageCache.size > this.maxBarcodeCacheSize) {
                    const oldestKey = this.barcodeImageCache.keys().next().value;
                    if (oldestKey)
                        this.barcodeImageCache.delete(oldestKey);
                }
                this.barcodeCacheVersion.update(version => version + 1);
            }
            return dataUrl;
        })
            .finally(() => {
            this.barcodeImagePending.delete(key);
        });
        this.barcodeImagePending.set(key, promise);
        return promise;
    }
    async createBarcodeDataUrl(text) {
        const format = this.displayFormat();
        if (this.isQrFormat(format)) {
            try {
                const QRCode = await this.loadQrLib();
                const qrcode = QRCode.create(this.getQrPayload(text, format), { errorCorrectionLevel: 'M' });
                const canvas = document.createElement('canvas');
                const size = qrcode.modules.size;
                const scale = Math.max(1, Math.floor(this.barcodeWidth() * 2)); // Use barcodeWidth as scale factor
                const margin = 2;
                const actualSize = size + margin * 2;
                canvas.width = actualSize * scale;
                canvas.height = actualSize * scale;
                const ctx = canvas.getContext('2d');
                if (!ctx)
                    return '';
                // Fill background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Draw modules
                ctx.fillStyle = '#000000';
                for (let row = 0; row < size; row++) {
                    for (let col = 0; col < size; col++) {
                        if (qrcode.modules.get(row, col)) {
                            ctx.fillRect((col + margin) * scale, (row + margin) * scale, scale, scale);
                        }
                    }
                }
                return canvas.toDataURL('image/png');
            }
            catch (e) {
                console.error('QR Code error:', e);
                return '';
            }
        }
        try {
            const JsBarcode = await this.loadBarcodeLib();
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, text, {
                format: "CODE128",
                width: this.barcodeWidth(),
                height: this.barcodeHeight(),
                displayValue: false,
                margin: 0,
                background: "transparent"
            });
            return canvas.toDataURL('image/png');
        }
        catch (e) {
            console.error('Barcode error:', e);
            return '';
        }
    }
    escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    // --- HELPER: Print HTML via hidden iframe (bypass popup blocker) ---
    printViaIframe(htmlContent) {
        // Remove any existing print iframe
        const existingFrame = document.getElementById('lims-print-frame');
        if (existingFrame)
            existingFrame.remove();
        const iframe = document.createElement('iframe');
        iframe.id = 'lims-print-frame';
        iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;';
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) {
            this.toast.show('Không thể tạo khung in. Thử lại.', 'error');
            return;
        }
        doc.open();
        doc.write(htmlContent);
        doc.close();
        // Wait for iframe content (especially images) to fully load before printing
        const iframeWin = iframe.contentWindow;
        if (!iframeWin)
            return;
        const doPrint = () => {
            try {
                iframeWin.focus();
                iframeWin.print();
            }
            catch (e) {
                console.error('Print error:', e);
                this.toast.show('Lỗi khi in. Vui lòng thử lại.', 'error');
            }
            // Clean up after print dialog closes
            setTimeout(() => iframe.remove(), 2000);
        };
        const format = this.displayFormat();
        if (format !== 'text') {
            // Images need time to render - use load event with fallback
            let loaded = false;
            iframeWin.onload = () => {
                if (!loaded) {
                    loaded = true;
                    setTimeout(doPrint, 200);
                }
            };
            // Fallback in case onload already fired
            setTimeout(() => { if (!loaded) {
                loaded = true;
                doPrint();
            } }, 800);
        }
        else {
            // Text-only: can print immediately after DOM write
            setTimeout(doPrint, 100);
        }
    }
    // --- BROTHER PRINTING LOGIC ---
    async printBrother() {
        const pages = this.brotherPages();
        if (pages.length === 0)
            return;
        const w = this.brotherWidth();
        const h = this.actualBrotherPageHeight();
        const fs = this.fontSize() || 16;
        const rotate = this.rotateText();
        const cols = Math.max(1, this.brotherCols());
        const rows = this.isBrotherFixed() ? Math.max(1, this.brotherRows()) : Math.max(1, Math.ceil(pages[0].length / cols));
        const showCut = this.brotherShowCutLines();
        const css = `
        @page { size: ${w}mm ${h}mm; margin: 0; padding: 0; }
        html, body { 
            margin: 0; 
            padding: 0; 
            width: ${w}mm; 
            height: ${h}mm; 
            overflow: hidden; /* Ngăn chặn trình duyệt tự sinh trang trắng thừa */
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
            background: white; 
            color: black; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
        }
        * { box-sizing: border-box; }
        .page-container {
            width: ${w}mm;
            height: ${h}mm;
            page-break-inside: avoid;
            overflow: hidden;
            position: relative;
            display: grid;
            grid-template-columns: repeat(${cols}, 1fr);
            grid-template-rows: repeat(${rows}, 1fr);
        }
        .page-container:not(:last-child) {
            page-break-after: always;
        }
        .cell {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 2px;
            container-type: size;
            width: 100%;
            height: 100%;
        }
        ${showCut ? `
        .cell {
            border-right: 1px dashed #475569;
            border-bottom: 1px dashed #475569;
        }
        .cell:nth-child(${cols}n) { border-right: none; }
        .cell:nth-last-child(-n+${cols}) { border-bottom: none; }
        ` : ''}
        .label-content {
            display: flex;
            flex-direction: column;
            align-items: ${this.alignX()};
            justify-content: ${this.alignY()};
            padding: ${this.padTop()}mm ${this.padRight()}mm ${this.padBottom()}mm ${this.padLeft()}mm;
            box-sizing: border-box;
            overflow: hidden;
            ${rotate ? `
            transform: rotate(-90deg);
            width: 100cqh;
            height: 100cqw;
            ` : `
            width: 100cqw;
            height: 100cqh;
            `}
        }
        .label-text {
            font-size: ${fs}pt;
            font-weight: bold;
            text-align: ${this.alignX() === 'flex-start' ? 'left' : this.alignX() === 'flex-end' ? 'right' : 'center'};
            line-height: 1.2;
            word-break: break-all;
            width: 100%;
        }
        @media print {
            @page { size: ${w}mm ${h}mm; margin: 0; }
            body { margin: 0; }
        }
      `;
        let htmlContent = `<html><head><title>Brother Print</title><style>${css}</style></head><body>`;
        for (const page of pages) {
            htmlContent += `<div class="page-container">`;
            for (const label of page) {
                htmlContent += `<div class="cell"><div class="label-content">`;
                if (label) {
                    const safeLabel = this.escapeHtml(label);
                    if (this.displayFormat() !== 'text') {
                        const barcodeSrc = await this.getBarcodeDataUrl(label);
                        htmlContent += `<img src="${barcodeSrc}" style="height: ${this.barcodeHeight()}px; max-width: 100%; object-fit: contain;" />`;
                    }
                    if (this.displayFormat() !== 'barcode' && this.displayFormat() !== 'qrcode') {
                        htmlContent += `<div class="label-text" style="${(this.displayFormat() === 'barcode_text' || this.displayFormat() === 'qrcode_text' || this.displayFormat() === 'qrcode_hybrid') ? 'margin-top: 2px;' : ''}">${safeLabel}</div>`;
                    }
                }
                htmlContent += `</div></div>`;
            }
            htmlContent += `</div>`;
        }
        htmlContent += `</body></html>`;
        this.printViaIframe(htmlContent);
    }
    // --- A4 PRINTING LOGIC (Direct Window Print) ---
    async printA4() {
        const pages = this.pages();
        const validPages = pages.filter(p => p.cells.some(c => !c.isEmpty) || p.pageIndex === 0);
        if (this.rawInputCount() === 0 && this.skippedCells() === 0)
            return;
        const dims = this.layoutDims();
        const isPlain = this.printMode() === 'plain_a4';
        const showCut = isPlain && this.showCutLines();
        const css = `
        @page { size: A4 portrait; margin: 0; }
        body { margin: 0; padding: 0; font-family: 'Roboto Mono', monospace; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        * { box-sizing: border-box; }
        .page {
            width: 210mm;
            height: 297mm;
            padding-top: ${this.marginTop()}mm;
            padding-left: ${this.marginLeft()}mm;
            padding-right: ${this.marginLeft()}mm;
            padding-bottom: ${this.marginTop()}mm;
            page-break-after: always;
            page-break-inside: avoid;
            position: relative;
            overflow: hidden;
            background: white;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(${dims.cols}, ${dims.cellW}mm);
            grid-template-rows: repeat(${dims.rows}, ${dims.cellH}mm);
            gap: ${this.gapY()}mm ${this.gapX()}mm;
            align-content: start;
            justify-content: start;
        }
        .cell {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            ${showCut ? 'border: 1px dashed #475569;' : ''}
        }
        .sub-label {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 0.5mm;
            overflow: hidden;
            container-type: size;
            width: 100%;
            height: 100%;
        }
        .sub-label:not(:last-child) {
            border-bottom: 1px dashed #475569;
        }
        .label-content {
            display: flex;
            flex-direction: column;
            align-items: ${this.alignX()};
            justify-content: ${this.alignY()};
            padding: ${this.padTop()}mm ${this.padRight()}mm ${this.padBottom()}mm ${this.padLeft()}mm;
            box-sizing: border-box;
            overflow: hidden;
            ${this.rotateText() ? `
            transform: rotate(-90deg);
            width: 100cqh;
            height: 100cqw;
            ` : `
            width: 100cqw;
            height: 100cqh;
            `}
        }
        .text {
            font-size: ${this.fontSize()}pt;
            font-weight: bold;
            text-align: ${this.alignX() === 'flex-start' ? 'left' : this.alignX() === 'flex-end' ? 'right' : 'center'};
            line-height: 1.2;
            word-break: break-all;
            width: 100%;
        }
        @media print {
            @page { margin: 0; }
            body { margin: 0; }
        }
      `;
        let htmlContent = `<html><head><title>Print A4 Labels</title><style>${css}</style></head><body>`;
        for (const page of validPages) {
            htmlContent += `<div class="page"><div class="grid">`;
            for (const cell of page.cells) {
                if (cell.isEmpty) {
                    htmlContent += `<div class="cell" style="opacity: 0;"></div>`;
                }
                else {
                    htmlContent += `<div class="cell">`;
                    for (const [idx, label] of cell.subLabels.entries()) {
                        const isLast = idx === cell.subLabels.length - 1;
                        htmlContent += `
                        <div class="sub-label" ${!isLast ? '' : 'style="border-bottom: none;"'}>
                            <div class="label-content">
                      `;
                        if (label) {
                            const safeLabel = this.escapeHtml(label);
                            if (this.displayFormat() !== 'text') {
                                const barcodeSrc = await this.getBarcodeDataUrl(label);
                                htmlContent += `<img src="${barcodeSrc}" style="height: ${this.barcodeHeight()}px; max-width: 100%; object-fit: contain;" />`;
                            }
                            if (this.displayFormat() !== 'barcode' && this.displayFormat() !== 'qrcode') {
                                htmlContent += `<span class="text" style="${(this.displayFormat() === 'barcode_text' || this.displayFormat() === 'qrcode_text' || this.displayFormat() === 'qrcode_hybrid') ? 'margin-top: 2px;' : ''}">${safeLabel}</span>`;
                            }
                        }
                        htmlContent += `</div></div>`;
                    }
                    htmlContent += `</div>`;
                }
            }
            htmlContent += `</div></div>`;
        }
        htmlContent += `</body></html>`;
        this.printViaIframe(htmlContent);
    }
    static { this.ɵfac = function LabelPrintComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LabelPrintComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LabelPrintComponent, selectors: [["app-label-print"]], viewQuery: function LabelPrintComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.previewContainer = _t.first);
        } }, inputs: { initialData: "initialData" }, decls: 77, vars: 21, consts: [["previewContainer", ""], [1, "h-full", "flex", "flex-col", "md:flex-row", "bg-slate-100", "fade-in", "font-sans", "text-slate-800", "overflow-y-auto", "md:overflow-hidden"], [1, "w-full", "md:w-[420px]", "flex", "flex-col", "bg-white", "border-r", "border-slate-200", "z-20", "shrink-0", "shadow-xl", "md:h-full", "relative"], [1, "p-5", "border-b", "border-slate-100", "bg-slate-50", "shrink-0"], [1, "text-xl", "font-black", "text-slate-800", "flex", "items-center", "gap-3", "mb-4"], [1, "w-10", "h-10", "rounded-xl", "bg-slate-800", "text-white", "flex", "items-center", "justify-center", "shadow-lg", "shadow-slate-200"], [1, "fa-solid", "fa-print"], [1, "grid", "grid-cols-3", "gap-2"], [1, "flex", "flex-col", "items-center", "justify-center", "p-2", "rounded-xl", "border-2", "transition-all", "relative", "overflow-hidden", 3, "click"], [1, "fa-solid", "fa-tape", "text-xl", "mb-1"], [1, "text-[10px]", "font-bold", "uppercase", "text-center", "leading-tight", "mt-1"], [1, "absolute", "top-0", "right-0", "w-3", "h-3", "bg-red-500", "rounded-bl-lg"], [1, "fa-solid", "fa-file-lines", "text-xl", "mb-1"], [1, "absolute", "top-0", "right-0", "w-3", "h-3", "bg-indigo-500", "rounded-bl-lg"], [1, "fa-solid", "fa-scissors", "text-xl", "mb-1"], [1, "absolute", "top-0", "right-0", "w-3", "h-3", "bg-emerald-500", "rounded-bl-lg"], [1, "flex-1", "md:overflow-y-auto", "p-5", "space-y-6", "custom-scrollbar"], [1, "flex", "justify-between", "items-center", "mb-2"], [1, "text-xs", "font-bold", "text-slate-700", "uppercase", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-keyboard", "text-slate-400"], [1, "text-[10px]", "bg-slate-100", "text-slate-600", "px-2", "py-0.5", "rounded", "font-bold", "border", "border-slate-200"], [1, "flex", "gap-2", "mb-2", "bg-blue-50", "p-2", "rounded-lg", "border", "border-blue-100"], ["type", "date", 1, "input-std", "py-1.5", "text-xs", "flex-1", "bg-white", "dark:bg-slate-800", "border-slate-200", "dark:border-slate-700", "text-slate-700", "dark:text-slate-200", "[color-scheme:light]", "dark:[color-scheme:dark]", 3, "ngModelChange", "ngModel"], [1, "bg-blue-600", "hover:bg-blue-700", "text-white", "px-3", "py-1.5", "rounded-lg", "text-xs", "font-bold", "shadow-sm", "transition", "flex", "items-center", "gap-1", "whitespace-nowrap", 3, "click"], [1, "fa-solid", "fa-cloud-arrow-down"], ["placeholder", "D\u00E1n m\u00E3 v\u00E0o \u0111\u00E2y ho\u1EB7c l\u1EA5y t\u1EEB y\u00EAu c\u1EA7u...", 1, "w-full", "h-28", "p-3", "border", "border-slate-300", "rounded-xl", "text-sm", "font-mono", "focus:ring-2", "focus:ring-slate-400", "outline-none", "resize-none", "shadow-inner", "bg-slate-50", "focus:bg-white", "transition", 3, "ngModelChange", "ngModel"], [1, "flex", "gap-2", "mt-2", "justify-end"], [1, "text-[10px]", "text-slate-500", "hover:bg-slate-100", "px-2", "py-1", "rounded", "transition", "font-bold", 3, "click"], [1, "fa-solid", "fa-filter"], [1, "fa-solid", "fa-arrow-down-a-z"], [1, "text-[10px]", "text-red-500", "hover:bg-red-50", "px-2", "py-1", "rounded", "transition", "font-bold", 3, "click"], [1, "fa-solid", "fa-trash"], [1, "text-[10px]", "text-blue-600", "hover:bg-blue-50", "px-2", "py-1", "rounded", "transition", "font-bold", 3, "click"], [1, "h-px", "bg-slate-100", "w-full"], [1, "space-y-4", "animate-bounce-in"], [1, "p-5", "border-t", "border-slate-200", "bg-white", "shrink-0", "sticky", "bottom-0", "z-30", "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"], [1, "w-full", "py-3.5", "bg-red-600", "hover:bg-red-700", "text-white", "rounded-xl", "shadow-lg", "shadow-red-200", "transition", "font-bold", "flex", "items-center", "justify-center", "gap-3", "disabled:opacity-50", "disabled:cursor-not-allowed", "group", 3, "disabled"], [1, "w-full", "py-3.5", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-xl", "shadow-lg", "shadow-blue-200", "transition", "font-bold", "flex", "items-center", "justify-center", "gap-3", "disabled:opacity-50", "disabled:cursor-not-allowed", "group", 3, "disabled"], [1, "flex-1", "bg-slate-200/50", "md:overflow-auto", "p-8", "flex", "justify-center", "items-start", "min-h-[500px]", "md:min-h-0", "relative", "md:h-full"], [1, "absolute", "bottom-6", "right-6", "flex", "flex-col", "gap-2", "bg-white", "p-2", "rounded-xl", "shadow-lg", "border", "border-slate-200", "z-30"], ["title", "Ph\u00F3ng to", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "hover:bg-slate-100", "text-slate-600", 3, "click"], [1, "fa-solid", "fa-plus"], [1, "text-[10px]", "font-bold", "text-center", "text-slate-400"], ["title", "Thu nh\u1ECF", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "hover:bg-slate-100", "text-slate-600", 3, "click"], [1, "fa-solid", "fa-minus"], [1, "h-px", "bg-slate-200", "w-full", "my-1"], ["title", "V\u1EEBa m\u00E0n h\u00ECnh", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-lg", "hover:bg-slate-100", "text-blue-600", 3, "click"], [1, "fa-solid", "fa-expand"], [1, "space-y-10", "pb-20", "w-fit", "mx-auto", "origin-top", "transform", "transition-transform", "duration-300"], [1, "flex", "flex-col", "gap-1", "items-center"], [1, "flex", "items-center", "gap-2", "bg-red-50", "p-3", "rounded-lg", "border", "border-red-100", "text-red-800", "text-xs"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "font-medium"], [1, "label-std"], [1, "input-std", "mb-3", "bg-slate-50", 3, "ngModelChange", "ngModel"], ["label", "Cu\u1ED9n li\u00EAn t\u1EE5c (C\u1EAFt t\u1EF1 do)"], ["value", "62"], ["value", "29"], ["value", "12"], ["label", "K\u00EDch th\u01B0\u1EDBc c\u1ED1 \u0111\u1ECBnh (C\u1EAFt theo trang)"], ["value", "29x90"], ["value", "29x42"], ["value", "32x32"], ["value", "23x23"], [1, "grid", "grid-cols-2", "gap-3", "mb-3"], [1, "label-mini"], ["disabled", "", 1, "input-std", "bg-slate-100", "text-slate-500", "text-center", 3, "value"], ["type", "number", 1, "input-std", "text-center", 3, "ngModelChange", "ngModel"], [1, "bg-blue-50", "p-2", "rounded", "border", "border-blue-100", "mb-3", "text-xs", "text-blue-800", "flex", "flex-col", "gap-1"], [1, "fa-solid", "fa-circle-info"], [1, "flex", "items-center", "justify-start", "mb-3"], [1, "flex", "items-center", "gap-2", "cursor-pointer"], ["type", "checkbox", 1, "w-4", "h-4", "text-red-600", "rounded", "border-slate-300", "focus:ring-red-500", 3, "ngModelChange", "ngModel"], [1, "text-[10px]", "font-bold", "text-slate-600", "uppercase"], ["value", "text"], ["value", "barcode"], ["value", "barcode_text"], ["value", "qrcode"], ["value", "qrcode_text"], [1, "grid", "grid-cols-2", "gap-3", "mb-3", "bg-slate-50", "p-2", "rounded", "border", "border-slate-200"], ["type", "number", 1, "input-std", 3, "ngModelChange", "ngModel"], [1, "input-std", "text-left", "flex", "justify-between", "items-center", 3, "click"], [1, "fa-solid", "fa-rotate-right", "text-xs"], [1, "bg-slate-50", "p-3", "rounded-lg", "border", "border-slate-200", "mb-3"], [1, "input-mini", "text-left", 3, "ngModelChange", "ngModel"], ["value", "flex-start"], ["value", "center"], ["value", "flex-end"], [1, "label-mini", "mb-1"], [1, "grid", "grid-cols-4", "gap-2"], [1, "text-[8px]", "text-slate-400", "block", "text-center"], ["type", "number", 1, "input-mini", 3, "ngModelChange", "ngModel"], [1, "bg-amber-50", "p-3", "rounded-lg", "border", "border-amber-200", "text-amber-800", "text-xs", "space-y-1"], [1, "font-bold", "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-lightbulb"], [1, "list-disc", "pl-4", "space-y-1", "mt-1"], [1, "relative"], ["type", "number", 1, "input-std", "pr-8", "text-center", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-3", "top-2", "text-xs", "text-slate-400", "font-bold"], ["type", "number", "min", "1", "max", "4", "step", "0.5", 1, "input-std", "text-center", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "10", "max", "100", "step", "5", 1, "input-std", "text-center", 3, "ngModelChange", "ngModel"], [1, "input-std", "mb-2", "bg-slate-50", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "text-[10px]", "text-slate-500", "bg-indigo-50", "p-2", "rounded", "border", "border-indigo-100", "flex", "items-start", "gap-2"], [1, "fa-solid", "fa-circle-info", "mt-0.5", "text-indigo-400"], [1, "flex", "justify-between", "items-center", "mb-1"], [1, "label-std", "mb-0"], [1, "text-[9px]", "text-slate-400"], [1, "flex", "items-center", "gap-2"], [1, "grid", "grid-cols-5", "gap-1", "flex-1"], [1, "py-1.5", "rounded", "border", "text-xs", "font-bold", "transition", 3, "class"], [1, "flex", "items-center", "justify-between", "w-full", "text-xs", "font-bold", "text-slate-600", "bg-slate-50", "p-2", "rounded-lg", "border", "border-slate-200", 3, "click"], [1, "fa-solid", "fa-ruler-combined", "mr-1"], [1, "fa-solid"], [1, "mt-2", "grid", "grid-cols-2", "gap-3", "bg-white", "p-3", "border", "border-slate-100", "rounded-lg", "shadow-sm"], [1, "py-1.5", "rounded", "border", "text-xs", "font-bold", "transition", 3, "click"], ["type", "number", 1, "input-mini", "text-orange-600", 3, "ngModelChange", "ngModel"], [1, "col-span-2", "mt-2", "pt-2", "border-t", "border-slate-100"], [1, "input-mini", "bg-slate-50", "text-left", 3, "ngModelChange", "ngModel"], ["value", "qrcode_hybrid"], [1, "grid", "grid-cols-4", "gap-2", "mb-2"], [1, "grid", "grid-cols-2", "gap-2"], [1, "input-mini", "text-center", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "https://nafiqpm6.vercel.app", 1, "input-mini", "w-full", "text-left", "px-2", 3, "ngModelChange", "ngModel"], [1, "col-span-2", "mt-2"], ["type", "text", "placeholder", "08934567890128", 1, "input-mini", "w-full", "text-left", "px-2", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "1", "max", "4", "step", "0.5", 1, "input-mini", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "10", "max", "100", "step", "5", 1, "input-mini", 3, "ngModelChange", "ngModel"], [1, "text-[10px]", "text-slate-500", "bg-emerald-50", "p-2", "rounded", "border", "border-emerald-100", "flex", "items-start", "gap-2"], [1, "fa-solid", "fa-scissors", "mt-0.5", "text-emerald-500"], [1, "grid", "grid-cols-2", "gap-3"], [1, "flex", "items-center", "justify-center", "pt-3", "col-span-2", "border-t", "border-slate-100", "mt-2"], ["type", "checkbox", 1, "w-4", "h-4", "text-emerald-600", "rounded", "border-slate-300", "focus:ring-emerald-500", 3, "ngModelChange", "ngModel"], [1, "w-full", "py-3.5", "bg-red-600", "hover:bg-red-700", "text-white", "rounded-xl", "shadow-lg", "shadow-red-200", "transition", "font-bold", "flex", "items-center", "justify-center", "gap-3", "disabled:opacity-50", "disabled:cursor-not-allowed", "group", 3, "click", "disabled"], [1, "fa-solid", "fa-print", "text-lg", "group-hover:scale-110", "transition-transform"], [1, "w-full", "py-3.5", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-xl", "shadow-lg", "shadow-blue-200", "transition", "font-bold", "flex", "items-center", "justify-center", "gap-3", "disabled:opacity-50", "disabled:cursor-not-allowed", "group", 3, "click", "disabled"], [1, "text-xs", "font-bold", "text-slate-400", "mb-2", "uppercase", "tracking-widest"], [1, "bg-slate-300", "p-2", "pb-10", "rounded-t-lg", "shadow-inner"], ["id", "brother-preview-strip", 1, "bg-white", "shadow-xl", "flex", "flex-col", "items-center"], [1, "w-full", "relative", "overflow-hidden", "box-border", 3, "height", "border-b", "border-dashed", "border-slate-600"], [1, "h-[50mm]", "w-full", "flex", "items-center", "justify-center", "text-slate-300", "text-[10px]", "italic"], [1, "mt-3", "rounded-xl", "border", "border-amber-200", "bg-amber-50", "px-3", "py-2", "text-[11px]", "font-bold", "text-amber-800", "shadow-sm"], [1, "h-4", "bg-slate-800", "rounded-b-lg", "shadow-lg"], [1, "w-full", "relative", "overflow-hidden", "box-border"], [1, "w-full", "h-full", "grid"], [1, "flex", "items-center", "justify-center", "overflow-hidden", "p-0.5", "box-border", 2, "container-type", "size", "width", "100%", "height", "100%", 3, "border-r", "border-b", "border-dashed", "border-slate-600"], [1, "flex", "items-center", "justify-center", "overflow-hidden", "p-0.5", "box-border", 2, "container-type", "size", "width", "100%", "height", "100%"], [1, "flex", "flex-col", "overflow-hidden", "box-border"], [1, "max-w-full", "object-contain", 3, "src", "height"], [1, "font-bold", "font-mono", "leading-none", "overflow-hidden", "px-1", 2, "display", "-webkit-box", "-webkit-line-clamp", "3", "-webkit-box-orient", "vertical", "word-break", "break-all", 3, "text-align", "mt-1", "text-red-600", "font-size", "title"], [1, "max-w-full", "object-contain", 3, "src"], [1, "font-bold", "font-mono", "leading-none", "overflow-hidden", "px-1", 2, "display", "-webkit-box", "-webkit-line-clamp", "3", "-webkit-box-orient", "vertical", "word-break", "break-all", 3, "title"], ["type", "button", 1, "ml-2", "underline", "decoration-amber-400", "underline-offset-2", "hover:text-amber-950", 3, "click"], [1, "bg-white", "shadow-2xl", "relative", "transition-all", "duration-300", "box-border", "overflow-hidden", "ring-1", "ring-slate-900/5", 3, "id", "width", "height", "style"], [1, "mx-auto", "max-w-md", "rounded-xl", "border", "border-amber-200", "bg-amber-50", "px-4", "py-3", "text-center", "text-xs", "font-bold", "text-amber-800", "shadow-sm"], [1, "bg-white", "shadow-2xl", "relative", "transition-all", "duration-300", "box-border", "overflow-hidden", "ring-1", "ring-slate-900/5", 3, "id"], [1, "grid", "content-start", "justify-start"], [1, "relative", "flex", "flex-col", "overflow-hidden", "group", "cursor-default", "transition-colors", "w-full", "h-full", "box-border", 3, "border", "border-slate-200", "border-slate-600", "border-dashed", "bg-slate-50", "opacity-40"], [1, "absolute", "bottom-2", "left-0", "w-full", "text-center", "pointer-events-none"], [1, "bg-slate-100/90", "text-slate-400", "text-[8px]", "font-bold", "px-2", "py-0.5", "rounded", "border", "border-slate-200", "shadow-sm"], [1, "relative", "flex", "flex-col", "overflow-hidden", "group", "cursor-default", "transition-colors", "w-full", "h-full", "box-border"], [1, "absolute", "top-0.5", "right-1", "text-[6px]", "text-slate-200", "select-none"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "w-full", "relative", 2, "border-bottom-style", "dashed", "border-bottom-width", "1px", "border-bottom-color", "#475569", "container-type", "size", 3, "border-b"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "w-full", "relative", 2, "border-bottom-style", "dashed", "border-bottom-width", "1px", "border-bottom-color", "#475569", "container-type", "size"], [1, "font-bold", "font-mono", "leading-none", "overflow-hidden", "px-1", 2, "display", "-webkit-box", "-webkit-line-clamp", "3", "-webkit-box-orient", "vertical", "word-break", "break-all", 3, "text-align", "mt-1", "text-red-600", "font-size", "font-family", "title"], [1, "mt-1", "text-[10px]", "font-semibold", "text-amber-700"]], template: function LabelPrintComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "h2", 4)(4, "div", 5);
            i0.ɵɵelement(5, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6, " In Tem & Nh\u00E3n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 7)(8, "button", 8);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.setMode("brother")); });
            i0.ɵɵelement(9, "i", 9);
            i0.ɵɵelementStart(10, "span", 10);
            i0.ɵɵtext(11, "M\u00E1y In");
            i0.ɵɵelement(12, "br");
            i0.ɵɵtext(13, "Brother");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(14, LabelPrintComponent_Conditional_14_Template, 1, 0, "div", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "button", 8);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.setMode("tomy_a4")); });
            i0.ɵɵelement(16, "i", 12);
            i0.ɵɵelementStart(17, "span", 10);
            i0.ɵɵtext(18, "Decal A4");
            i0.ɵɵelement(19, "br");
            i0.ɵɵtext(20, "(Tomy)");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(21, LabelPrintComponent_Conditional_21_Template, 1, 0, "div", 13);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "button", 8);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.setMode("plain_a4")); });
            i0.ɵɵelement(23, "i", 14);
            i0.ɵɵelementStart(24, "span", 10);
            i0.ɵɵtext(25, "A4 Tr\u01A1n");
            i0.ɵɵelement(26, "br");
            i0.ɵɵtext(27, "(C\u1EAFt Tay)");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(28, LabelPrintComponent_Conditional_28_Template, 1, 0, "div", 15);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(29, "div", 16)(30, "div")(31, "div", 17)(32, "label", 18);
            i0.ɵɵelement(33, "i", 19);
            i0.ɵɵtext(34, " D\u1EEF li\u1EC7u (1 m\u00E3 / d\u00F2ng) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "span", 20);
            i0.ɵɵtext(36);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(37, "div", 21)(38, "input", 22);
            i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Template_input_ngModelChange_38_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.fetchDate.set($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "button", 23);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_39_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.fetchFromRequests()); });
            i0.ɵɵelement(40, "i", 24);
            i0.ɵɵtext(41, " L\u1EA5y M\u1EABu ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(42, "textarea", 25);
            i0.ɵɵlistener("ngModelChange", function LabelPrintComponent_Template_textarea_ngModelChange_42_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onInputChanged($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "div", 26)(44, "button", 27);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_44_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.removeDuplicates()); });
            i0.ɵɵelement(45, "i", 28);
            i0.ɵɵtext(46, " L\u1ECDc Tr\u00F9ng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "button", 27);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_47_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.sortInput()); });
            i0.ɵɵelement(48, "i", 29);
            i0.ɵɵtext(49, " S\u1EAFp X\u1EBFp");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "button", 30);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_50_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.clearInput()); });
            i0.ɵɵelement(51, "i", 31);
            i0.ɵɵtext(52, " X\u00F3a");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "button", 32);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_53_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.addExample()); });
            i0.ɵɵtext(54, "+ M\u1EABu Th\u1EED");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelement(55, "div", 33);
            i0.ɵɵtemplate(56, LabelPrintComponent_Conditional_56_Template, 160, 22, "div", 34)(57, LabelPrintComponent_Conditional_57_Template, 28, 5, "div", 34)(58, LabelPrintComponent_Conditional_58_Template, 31, 6, "div", 34);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(59, "div", 35);
            i0.ɵɵtemplate(60, LabelPrintComponent_Conditional_60_Template, 4, 1, "button", 36)(61, LabelPrintComponent_Conditional_61_Template, 4, 1, "button", 37);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(62, "div", 38, 0)(64, "div", 39)(65, "button", 40);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_65_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.adjustZoom(0.1)); });
            i0.ɵɵelement(66, "i", 41);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(67, "span", 42);
            i0.ɵɵtext(68);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(69, "button", 43);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_69_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.adjustZoom(-0.1)); });
            i0.ɵɵelement(70, "i", 44);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(71, "div", 45);
            i0.ɵɵelementStart(72, "button", 46);
            i0.ɵɵlistener("click", function LabelPrintComponent_Template_button_click_72_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.fitToScreen()); });
            i0.ɵɵelement(73, "i", 47);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(74, "div", 48);
            i0.ɵɵtemplate(75, LabelPrintComponent_Conditional_75_Template, 10, 9, "div", 49)(76, LabelPrintComponent_Conditional_76_Template, 3, 1);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(8);
            i0.ɵɵclassMap(ctx.printMode() === "brother" ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-500 hover:border-red-200");
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.printMode() === "brother" ? 14 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.printMode() === "tomy_a4" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200");
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.printMode() === "tomy_a4" ? 21 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.printMode() === "plain_a4" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200");
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.printMode() === "plain_a4" ? 28 : -1);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate1("", ctx.rawInputCount(), " tem");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngModel", ctx.fetchDate());
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngModel", ctx.rawInput());
            i0.ɵɵadvance(14);
            i0.ɵɵconditional(ctx.printMode() === "brother" ? 56 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.printMode() === "tomy_a4" ? 57 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.printMode() === "plain_a4" ? 58 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.printMode() === "brother" ? 60 : 61);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate1("", ctx.Math.round(ctx.zoomLevel() * 100), "%");
            i0.ɵɵadvance(6);
            i0.ɵɵstyleProp("transform", "scale(" + ctx.zoomLevel() + ")");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.printMode() === "brother" ? 75 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.printMode() === "tomy_a4" || ctx.printMode() === "plain_a4" ? 76 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.MinValidator, i1.MaxValidator, i1.NgModel], styles: [".label-std[_ngcontent-%COMP%] { display: block; font-size: 11px; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }\n    .label-mini[_ngcontent-%COMP%] { display: block; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }\n    .input-std[_ngcontent-%COMP%] { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; font-size: 13px; font-weight: 600; color: #1e293b; outline: none; transition: all; }\n    .input-std[_ngcontent-%COMP%]:focus { border-color: #3b82f6; ring: 2px; ring-color: #bfdbfe; }\n    .input-mini[_ngcontent-%COMP%] { width: 100%; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px; font-size: 11px; font-weight: 700; text-align: center; outline: none; }\n    .input-mini[_ngcontent-%COMP%]:focus { background-color: white; border-color: #3b82f6; }\n    \n    .custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar { width: 4px; }\n    .custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-track { background: transparent; }\n    .custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LabelPrintComponent, [{
        type: Component,
        args: [{ selector: 'app-label-print', standalone: true, imports: [CommonModule, FormsModule], template: "    <div class=\"h-full flex flex-col md:flex-row bg-slate-100 fade-in font-sans text-slate-800 overflow-y-auto md:overflow-hidden\">\r\n        \r\n        <!-- LEFT: Controls & Config -->\r\n        <div class=\"w-full md:w-[420px] flex flex-col bg-white border-r border-slate-200 z-20 shrink-0 shadow-xl md:h-full relative\">\r\n            \r\n            <!-- 1. Header & Mode Selection -->\r\n            <div class=\"p-5 border-b border-slate-100 bg-slate-50 shrink-0\">\r\n                <h2 class=\"text-xl font-black text-slate-800 flex items-center gap-3 mb-4\">\r\n                    <div class=\"w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-200\">\r\n                        <i class=\"fa-solid fa-print\"></i>\r\n                    </div>\r\n                    In Tem & Nh\u00E3n\r\n                </h2>\r\n                \r\n                <!-- Mode Selector Cards -->\r\n                <div class=\"grid grid-cols-3 gap-2\">\r\n                    <button (click)=\"setMode('brother')\" \r\n                            class=\"flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all relative overflow-hidden\"\r\n                            [class]=\"printMode() === 'brother' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-500 hover:border-red-200'\">\r\n                        <i class=\"fa-solid fa-tape text-xl mb-1\"></i>\r\n                        <span class=\"text-[10px] font-bold uppercase text-center leading-tight mt-1\">M\u00E1y In<br>Brother</span>\r\n                        @if(printMode() === 'brother') { <div class=\"absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-lg\"></div> }\r\n                    </button>\r\n\r\n                    <button (click)=\"setMode('tomy_a4')\" \r\n                            class=\"flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all relative overflow-hidden\"\r\n                            [class]=\"printMode() === 'tomy_a4' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'\">\r\n                        <i class=\"fa-solid fa-file-lines text-xl mb-1\"></i>\r\n                        <span class=\"text-[10px] font-bold uppercase text-center leading-tight mt-1\">Decal A4<br>(Tomy)</span>\r\n                        @if(printMode() === 'tomy_a4') { <div class=\"absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-bl-lg\"></div> }\r\n                    </button>\r\n\r\n                    <button (click)=\"setMode('plain_a4')\" \r\n                            class=\"flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all relative overflow-hidden\"\r\n                            [class]=\"printMode() === 'plain_a4' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200'\">\r\n                        <i class=\"fa-solid fa-scissors text-xl mb-1\"></i>\r\n                        <span class=\"text-[10px] font-bold uppercase text-center leading-tight mt-1\">A4 Tr\u01A1n<br>(C\u1EAFt Tay)</span>\r\n                        @if(printMode() === 'plain_a4') { <div class=\"absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-bl-lg\"></div> }\r\n                    </button>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"flex-1 md:overflow-y-auto p-5 space-y-6 custom-scrollbar\">\r\n                \r\n                <!-- 2. Data Input -->\r\n                <div>\r\n                    <div class=\"flex justify-between items-center mb-2\">\r\n                        <label class=\"text-xs font-bold text-slate-700 uppercase flex items-center gap-2\">\r\n                            <i class=\"fa-solid fa-keyboard text-slate-400\"></i> D\u1EEF li\u1EC7u (1 m\u00E3 / d\u00F2ng)\r\n                        </label>\r\n                        <span class=\"text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold border border-slate-200\">{{rawInputCount()}} tem</span>\r\n                    </div>\r\n                    \r\n                    <!-- Fetch from Requests -->\r\n                    <div class=\"flex gap-2 mb-2 bg-blue-50 p-2 rounded-lg border border-blue-100\">\r\n                        <input type=\"date\" [ngModel]=\"fetchDate()\" (ngModelChange)=\"fetchDate.set($event)\" class=\"input-std py-1.5 text-xs flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 [color-scheme:light] dark:[color-scheme:dark]\">\r\n                        <button (click)=\"fetchFromRequests()\" class=\"bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1 whitespace-nowrap\">\r\n                            <i class=\"fa-solid fa-cloud-arrow-down\"></i> L\u1EA5y M\u1EABu\r\n                        </button>\r\n                    </div>\r\n\r\n                    <textarea [ngModel]=\"rawInput()\" (ngModelChange)=\"onInputChanged($event)\" \r\n                              class=\"w-full h-28 p-3 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-slate-400 outline-none resize-none shadow-inner bg-slate-50 focus:bg-white transition\" \r\n                              placeholder=\"D\u00E1n m\u00E3 v\u00E0o \u0111\u00E2y ho\u1EB7c l\u1EA5y t\u1EEB y\u00EAu c\u1EA7u...\"></textarea>\r\n                    <div class=\"flex gap-2 mt-2 justify-end\">\r\n                        <button (click)=\"removeDuplicates()\" class=\"text-[10px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition font-bold\"><i class=\"fa-solid fa-filter\"></i> L\u1ECDc Tr\u00F9ng</button>\r\n                        <button (click)=\"sortInput()\" class=\"text-[10px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition font-bold\"><i class=\"fa-solid fa-arrow-down-a-z\"></i> S\u1EAFp X\u1EBFp</button>\r\n                        <button (click)=\"clearInput()\" class=\"text-[10px] text-red-500 hover:bg-red-50 px-2 py-1 rounded transition font-bold\"><i class=\"fa-solid fa-trash\"></i> X\u00F3a</button>\r\n                        <button (click)=\"addExample()\" class=\"text-[10px] text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition font-bold\">+ M\u1EABu Th\u1EED</button>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"h-px bg-slate-100 w-full\"></div>\r\n\r\n                <!-- 3. BROTHER SPECIFIC CONFIG -->\r\n                @if (printMode() === 'brother') {\r\n                    <div class=\"space-y-4 animate-bounce-in\">\r\n                        <div class=\"flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-xs\">\r\n                            <i class=\"fa-solid fa-triangle-exclamation\"></i>\r\n                            <span class=\"font-medium\">L\u01B0u \u00FD: Ch\u1ECDn \u0111\u00FAng kh\u1ED5 gi\u1EA5y trong h\u1ED9p tho\u1EA1i in.</span>\r\n                        </div>\r\n\r\n                        <div>\r\n                            <label class=\"label-std\">Lo\u1EA1i Gi\u1EA5y (Brother)</label>\r\n                            <select [ngModel]=\"brotherPaperType()\" (ngModelChange)=\"onBrotherPaperChange($event)\" class=\"input-std mb-3 bg-slate-50\">\r\n                                <optgroup label=\"Cu\u1ED9n li\u00EAn t\u1EE5c (C\u1EAFt t\u1EF1 do)\">\r\n                                    <option value=\"62\">62mm (DK-22205)</option>\r\n                                    <option value=\"29\">29mm (1.1\")</option>\r\n                                    <option value=\"12\">12mm (DK-22214)</option>\r\n                                </optgroup>\r\n                                <optgroup label=\"K\u00EDch th\u01B0\u1EDBc c\u1ED1 \u0111\u1ECBnh (C\u1EAFt theo trang)\">\r\n                                    <option value=\"29x90\">29mm x 90mm (1.1\" x 3.5\")</option>\r\n                                    <option value=\"29x42\">29mm x 42mm (1.1\" x 1.6\")</option>\r\n                                    <option value=\"32x32\">32mm x 32mm (Vu\u00F4ng)</option>\r\n                                    <option value=\"23x23\">23mm x 23mm (DK-11221)</option>\r\n                                </optgroup>\r\n                            </select>\r\n\r\n                            <div class=\"grid grid-cols-2 gap-3 mb-3\">\r\n                                <div>\r\n                                    <span class=\"label-mini\">Chi\u1EC1u r\u1ED9ng cu\u1ED9n</span>\r\n                                    <input [value]=\"brotherWidth() + 'mm'\" disabled class=\"input-std bg-slate-100 text-slate-500 text-center\">\r\n                                </div>\r\n                                <div>\r\n                                    @if (isBrotherFixed()) {\r\n                                        <span class=\"label-mini\">Chi\u1EC1u d\u00E0i trang in</span>\r\n                                        <input [value]=\"brotherPageHeight() + 'mm'\" disabled class=\"input-std bg-slate-100 text-slate-500 text-center\">\r\n                                    } @else {\r\n                                        <span class=\"label-mini\">Chi\u1EC1u d\u00E0i 1 tem</span>\r\n                                        <div class=\"relative\">\r\n                                            <input type=\"number\" [ngModel]=\"brotherLabelHeight()\" (ngModelChange)=\"brotherLabelHeight.set($event)\" class=\"input-std pr-8 text-center\">\r\n                                            <span class=\"absolute right-3 top-2 text-xs text-slate-400 font-bold\">mm</span>\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"grid grid-cols-2 gap-3 mb-3\">\r\n                                <div>\r\n                                    <span class=\"label-mini\">S\u1ED1 c\u1ED9t (Ngang)</span>\r\n                                    <input type=\"number\" [ngModel]=\"brotherCols()\" (ngModelChange)=\"brotherCols.set($event)\" class=\"input-std text-center\">\r\n                                </div>\r\n                                @if (isBrotherFixed()) {\r\n                                    <div>\r\n                                        <span class=\"label-mini\">S\u1ED1 tem / trang (D\u1ECDc)</span>\r\n                                        <input type=\"number\" [ngModel]=\"brotherRows()\" (ngModelChange)=\"brotherRows.set($event)\" class=\"input-std text-center\">\r\n                                    </div>\r\n                                }\r\n                            </div>\r\n\r\n                            <div class=\"bg-blue-50 p-2 rounded border border-blue-100 mb-3 text-xs text-blue-800 flex flex-col gap-1\">\r\n                                <div><i class=\"fa-solid fa-circle-info\"></i> <b>T\u1ED5ng k\u1EBFt trang in:</b></div>\r\n                                <div>- K\u00EDch th\u01B0\u1EDBc 1 tem: <b>{{brotherWidth()}}mm x {{Math.round(actualBrotherLabelHeight() * 10) / 10}}mm</b></div>\r\n                                <div>- K\u00EDch th\u01B0\u1EDBc trang/c\u1EAFt: <b>{{brotherWidth()}}mm x {{Math.round(actualBrotherPageHeight() * 10) / 10}}mm</b></div>\r\n                            </div>\r\n\r\n                            <div class=\"flex items-center justify-start mb-3\">\r\n                                <label class=\"flex items-center gap-2 cursor-pointer\">\r\n                                    <input type=\"checkbox\" [ngModel]=\"brotherShowCutLines()\" (ngModelChange)=\"brotherShowCutLines.set($event)\" class=\"w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500\">\r\n                                    <span class=\"text-[10px] font-bold text-slate-600 uppercase\">In vi\u1EC1n chia tem (C\u1EAFt tay)</span>\r\n                                </label>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div>\r\n                            <label class=\"label-std\">\u0110\u1ECBnh d\u1EA1ng & M\u00E3 v\u1EA1ch</label>\r\n                            <select [ngModel]=\"displayFormat()\" (ngModelChange)=\"displayFormat.set($event)\" class=\"input-std mb-3 bg-slate-50\">\r\n                                <option value=\"text\">Ch\u1EC9 in Ch\u1EEF (Text)</option>\r\n                                <option value=\"barcode\">M\u00E3 v\u1EA1ch (Barcode 1D)</option>\r\n                                <option value=\"barcode_text\">M\u00E3 v\u1EA1ch + Ch\u1EEF \u1EDF d\u01B0\u1EDBi</option>\r\n                                <option value=\"qrcode\">M\u00E3 QR (2D)</option>\r\n                                <option value=\"qrcode_text\">M\u00E3 QR + Ch\u1EEF \u1EDF d\u01B0\u1EDBi</option>\r\n                            </select>\r\n\r\n                            @if (displayFormat() !== 'text') {\r\n                                <div class=\"grid grid-cols-2 gap-3 mb-3 bg-slate-50 p-2 rounded border border-slate-200\">\r\n                                    <div>\r\n                                        <span class=\"label-mini\">\u0110\u1ED9 r\u1ED9ng v\u1EA1ch/QR (px)</span>\r\n                                        <input type=\"number\" [ngModel]=\"barcodeWidth()\" (ngModelChange)=\"barcodeWidth.set($event)\" class=\"input-std text-center\" min=\"1\" max=\"4\" step=\"0.5\">\r\n                                    </div>\r\n                                    <div>\r\n                                        <span class=\"label-mini\">Chi\u1EC1u cao m\u00E3 (px)</span>\r\n                                        <input type=\"number\" [ngModel]=\"barcodeHeight()\" (ngModelChange)=\"barcodeHeight.set($event)\" class=\"input-std text-center\" min=\"10\" max=\"100\" step=\"5\">\r\n                                    </div>\r\n                                </div>\r\n                            }\r\n\r\n                            <div class=\"grid grid-cols-2 gap-3 mb-3\">\r\n                                <div>\r\n                                    <span class=\"label-mini\">Font Size (pt)</span>\r\n                                    <input type=\"number\" [ngModel]=\"fontSize()\" (ngModelChange)=\"fontSize.set($event)\" class=\"input-std\">\r\n                                </div>\r\n                                <div>\r\n                                    <span class=\"label-mini\">Xoay ngang</span>\r\n                                    <button (click)=\"rotateText.set(!rotateText())\" class=\"input-std text-left flex justify-between items-center\" [class.bg-blue-50]=\"rotateText()\">\r\n                                        <span>{{rotateText() ? 'C\u00F3 (-90\u00B0)' : 'Kh\u00F4ng'}}</span>\r\n                                        <i class=\"fa-solid fa-rotate-right text-xs\"></i>\r\n                                    </button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div>\r\n                            <label class=\"label-std\">C\u0103n l\u1EC1 & V\u1ECB tr\u00ED (Theo chi\u1EC1u ch\u1EEF)</label>\r\n                            <div class=\"bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3\">\r\n                                <div class=\"grid grid-cols-2 gap-3 mb-3\">\r\n                                    <div>\r\n                                        <span class=\"label-mini\">Ngang (Tr\u00E1i/Ph\u1EA3i)</span>\r\n                                        <select [ngModel]=\"alignX()\" (ngModelChange)=\"alignX.set($event)\" class=\"input-mini text-left\">\r\n                                            <option value=\"flex-start\">Tr\u00E1i</option>\r\n                                            <option value=\"center\">Gi\u1EEFa</option>\r\n                                            <option value=\"flex-end\">Ph\u1EA3i</option>\r\n                                        </select>\r\n                                    </div>\r\n                                    <div>\r\n                                        <span class=\"label-mini\">D\u1ECDc (Tr\u00EAn/D\u01B0\u1EDBi)</span>\r\n                                        <select [ngModel]=\"alignY()\" (ngModelChange)=\"alignY.set($event)\" class=\"input-mini text-left\">\r\n                                            <option value=\"flex-start\">Tr\u00EAn</option>\r\n                                            <option value=\"center\">Gi\u1EEFa</option>\r\n                                            <option value=\"flex-end\">D\u01B0\u1EDBi</option>\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <span class=\"label-mini mb-1\">Kho\u1EA3ng c\u00E1ch l\u1EC1 (mm)</span>\r\n                                <div class=\"grid grid-cols-4 gap-2\">\r\n                                    <div><span class=\"text-[8px] text-slate-400 block text-center\">Tr\u00EAn</span><input type=\"number\" [ngModel]=\"padTop()\" (ngModelChange)=\"padTop.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><span class=\"text-[8px] text-slate-400 block text-center\">D\u01B0\u1EDBi</span><input type=\"number\" [ngModel]=\"padBottom()\" (ngModelChange)=\"padBottom.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><span class=\"text-[8px] text-slate-400 block text-center\">Tr\u00E1i</span><input type=\"number\" [ngModel]=\"padLeft()\" (ngModelChange)=\"padLeft.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><span class=\"text-[8px] text-slate-400 block text-center\">Ph\u1EA3i</span><input type=\"number\" [ngModel]=\"padRight()\" (ngModelChange)=\"padRight.set($event)\" class=\"input-mini\"></div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800 text-xs space-y-1\">\r\n                            <div class=\"font-bold flex items-center gap-1\"><i class=\"fa-solid fa-lightbulb\"></i> M\u1EB9o kh\u1EAFc ph\u1EE5c th\u1EEBa gi\u1EA5y tr\u1EAFng:</div>\r\n                            <ul class=\"list-disc pl-4 space-y-1 mt-1\">\r\n                                <li><b>Tr\u00EAn \u1EE9ng d\u1EE5ng:</b> Gi\u1EA3m \"Chi\u1EC1u d\u00E0i 1 tem\" v\u00E0 \"Kho\u1EA3ng c\u00E1ch l\u1EC1\" (Tr\u00EAn/D\u01B0\u1EDBi) xu\u1ED1ng m\u1EE9c t\u1ED1i thi\u1EC3u v\u1EEBa \u0111\u1EE7 n\u1ED9i dung.</li>\r\n                                <li><b>H\u1ED9p tho\u1EA1i in (Tr\u00ECnh duy\u1EC7t):</b> M\u1EE5c <b>L\u1EC1 (Margins)</b> b\u1EAFt bu\u1ED9c ch\u1ECDn <b>Kh\u00F4ng c\u00F3 (None)</b>. T\u1EAFt <b>\u0110\u1EA7u trang & Ch\u00E2n trang</b>.</li>\r\n                                <li><b>Driver Brother (Windows/Mac):</b> V\u00E0o Printing Preferences, t\u00ECm m\u1EE5c <b>Margins / Feed Margin (L\u1EC1 n\u1EA1p gi\u1EA5y)</b> v\u00E0 ch\u1EC9nh v\u1EC1 <b>0mm</b> (ho\u1EB7c m\u1EE9c nh\u1ECF nh\u1EA5t 1.5mm).</li>\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                }\r\n\r\n                <!-- 4. TOMY A4 SPECIFIC CONFIG -->\r\n                @if (printMode() === 'tomy_a4') {\r\n                    <div class=\"space-y-4 animate-bounce-in\">\r\n                        <!-- Template Selection -->\r\n                        <div>\r\n                            <label class=\"label-std\">M\u1EABu gi\u1EA5y decal (Tomy)</label>\r\n                            <select [ngModel]=\"selectedTomyId()\" (ngModelChange)=\"onTomyChange($event)\" class=\"input-std mb-2 bg-slate-50\">\r\n                                @for (tmpl of tomyTemplates; track tmpl.id) {\r\n                                    <option [value]=\"tmpl.id\">{{tmpl.name}}</option>\r\n                                }\r\n                            </select>\r\n                            <div class=\"text-[10px] text-slate-500 bg-indigo-50 p-2 rounded border border-indigo-100 flex items-start gap-2\">\r\n                                <i class=\"fa-solid fa-circle-info mt-0.5 text-indigo-400\"></i>\r\n                                <span>H\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng c\u0103n l\u1EC1 theo m\u1EABu gi\u1EA5y b\u1EBF s\u1EB5n. B\u1EA1n ch\u1EC9 c\u1EA7n n\u1EA1p gi\u1EA5y v\u00E0o m\u00E1y in A4 th\u00F4ng th\u01B0\u1EDDng.</span>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- Split Settings -->\r\n                        <div>\r\n                            <div class=\"flex justify-between items-center mb-1\">\r\n                                <label class=\"label-std mb-0\">Chia nh\u1ECF Tem (Split)</label>\r\n                                <span class=\"text-[9px] text-slate-400\">In nhi\u1EC1u m\u00E3 v\u00E0o 1 \u00F4 tem</span>\r\n                            </div>\r\n                            <div class=\"flex items-center gap-2\">\r\n                                <div class=\"grid grid-cols-5 gap-1 flex-1\">\r\n                                    @for (n of [1, 2, 3, 4, 5]; track n) {\r\n                                        <button (click)=\"splitCount.set(n)\" \r\n                                                class=\"py-1.5 rounded border text-xs font-bold transition\"\r\n                                                [class]=\"splitCount() === n ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'\">\r\n                                            {{n}}\r\n                                        </button>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- Calibration -->\r\n                        <div>\r\n                            <button (click)=\"showAdvanced.set(!showAdvanced())\" class=\"flex items-center justify-between w-full text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200\">\r\n                                <span><i class=\"fa-solid fa-ruler-combined mr-1\"></i> C\u0103n Ch\u1EC9nh L\u1EC1 (Mm)</span>\r\n                                <i class=\"fa-solid\" [class]=\"showAdvanced() ? 'fa-chevron-down' : 'fa-chevron-right'\"></i>\r\n                            </button>\r\n                            \r\n                            @if (showAdvanced()) {\r\n                                <div class=\"mt-2 grid grid-cols-2 gap-3 bg-white p-3 border border-slate-100 rounded-lg shadow-sm\">\r\n                                    <div><label class=\"label-mini\">Top</label><input type=\"number\" [ngModel]=\"marginTop()\" (ngModelChange)=\"marginTop.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><label class=\"label-mini\">Left</label><input type=\"number\" [ngModel]=\"marginLeft()\" (ngModelChange)=\"marginLeft.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><label class=\"label-mini\">Gap X</label><input type=\"number\" [ngModel]=\"gapX()\" (ngModelChange)=\"gapX.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><label class=\"label-mini\">Gap Y</label><input type=\"number\" [ngModel]=\"gapY()\" (ngModelChange)=\"gapY.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><label class=\"label-mini\">B\u1ECF qua (Tem)</label><input type=\"number\" [ngModel]=\"skippedCells()\" (ngModelChange)=\"skippedCells.set($event)\" class=\"input-mini text-orange-600\"></div>\r\n                                    <div><label class=\"label-mini\">Font Size</label><input type=\"number\" [ngModel]=\"fontSize()\" (ngModelChange)=\"fontSize.set($event)\" class=\"input-mini\"></div>\r\n                                    <div class=\"col-span-2 mt-2 pt-2 border-t border-slate-100\">\r\n                                        <label class=\"label-mini\">\u0110\u1ECBnh d\u1EA1ng hi\u1EC3n th\u1ECB</label>\r\n                                        <select [ngModel]=\"displayFormat()\" (ngModelChange)=\"displayFormat.set($event)\" class=\"input-mini bg-slate-50 text-left\">\r\n                                            <option value=\"text\">Ch\u1EC9 in Ch\u1EEF</option>\r\n                                            <option value=\"barcode\">Ch\u1EC9 in M\u00E3 v\u1EA1ch</option>\r\n                                            <option value=\"barcode_text\">M\u00E3 v\u1EA1ch + Ch\u1EEF</option>\r\n                                            <option value=\"qrcode\">Ch\u1EC9 in QR Code</option>\r\n                                            <option value=\"qrcode_text\">QR Code + Ch\u1EEF</option>\r\n                                            <option value=\"qrcode_hybrid\">QR Code (Hybrid GS1)</option>\r\n                                        </select>\r\n                                    </div>\r\n                                    @if (displayFormat() === 'qrcode_hybrid') {\r\n                                        <div class=\"col-span-2 mt-2 pt-2 border-t border-slate-100\">\r\n                                            <label class=\"label-mini\">GS1 Domain</label>\r\n                                            <input type=\"text\" [ngModel]=\"gs1Domain()\" (ngModelChange)=\"gs1Domain.set($event)\" class=\"input-mini w-full text-left px-2\" placeholder=\"https://nafiqpm6.vercel.app\">\r\n                                        </div>\r\n                                        <div class=\"col-span-2 mt-2\">\r\n                                            <label class=\"label-mini\">M\u00E3 GTIN</label>\r\n                                            <input type=\"text\" [ngModel]=\"gs1Gtin()\" (ngModelChange)=\"gs1Gtin.set($event)\" class=\"input-mini w-full text-left px-2\" placeholder=\"08934567890128\">\r\n                                        </div>\r\n                                    }\r\n                                    @if (displayFormat() !== 'text') {\r\n                                        <div><label class=\"label-mini\">R\u1ED9ng v\u1EA1ch (px)</label><input type=\"number\" [ngModel]=\"barcodeWidth()\" (ngModelChange)=\"barcodeWidth.set($event)\" class=\"input-mini\" min=\"1\" max=\"4\" step=\"0.5\"></div>\r\n                                        <div><label class=\"label-mini\">Cao m\u00E3 (px)</label><input type=\"number\" [ngModel]=\"barcodeHeight()\" (ngModelChange)=\"barcodeHeight.set($event)\" class=\"input-mini\" min=\"10\" max=\"100\" step=\"5\"></div>\r\n                                    }\r\n                                    <div class=\"col-span-2 mt-2 pt-2 border-t border-slate-100\">\r\n                                        <label class=\"label-mini\">C\u0103n l\u1EC1 n\u1ED9i dung (mm)</label>\r\n                                        <div class=\"grid grid-cols-4 gap-2 mb-2\">\r\n                                            <div><span class=\"text-[8px] text-slate-400 block text-center\">Tr\u00EAn</span><input type=\"number\" [ngModel]=\"padTop()\" (ngModelChange)=\"padTop.set($event)\" class=\"input-mini\"></div>\r\n                                            <div><span class=\"text-[8px] text-slate-400 block text-center\">D\u01B0\u1EDBi</span><input type=\"number\" [ngModel]=\"padBottom()\" (ngModelChange)=\"padBottom.set($event)\" class=\"input-mini\"></div>\r\n                                            <div><span class=\"text-[8px] text-slate-400 block text-center\">Tr\u00E1i</span><input type=\"number\" [ngModel]=\"padLeft()\" (ngModelChange)=\"padLeft.set($event)\" class=\"input-mini\"></div>\r\n                                            <div><span class=\"text-[8px] text-slate-400 block text-center\">Ph\u1EA3i</span><input type=\"number\" [ngModel]=\"padRight()\" (ngModelChange)=\"padRight.set($event)\" class=\"input-mini\"></div>\r\n                                        </div>\r\n                                        <div class=\"grid grid-cols-2 gap-2\">\r\n                                            <div>\r\n                                                <span class=\"text-[8px] text-slate-400 block text-center\">Ngang</span>\r\n                                                <select [ngModel]=\"alignX()\" (ngModelChange)=\"alignX.set($event)\" class=\"input-mini text-center\">\r\n                                                    <option value=\"flex-start\">Tr\u00E1i</option>\r\n                                                    <option value=\"center\">Gi\u1EEFa</option>\r\n                                                    <option value=\"flex-end\">Ph\u1EA3i</option>\r\n                                                </select>\r\n                                            </div>\r\n                                            <div>\r\n                                                <span class=\"text-[8px] text-slate-400 block text-center\">D\u1ECDc</span>\r\n                                                <select [ngModel]=\"alignY()\" (ngModelChange)=\"alignY.set($event)\" class=\"input-mini text-center\">\r\n                                                    <option value=\"flex-start\">Tr\u00EAn</option>\r\n                                                    <option value=\"center\">Gi\u1EEFa</option>\r\n                                                    <option value=\"flex-end\">D\u01B0\u1EDBi</option>\r\n                                                </select>\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            }\r\n                        </div>\r\n                    </div>\r\n                }\r\n\r\n                <!-- 5. PLAIN A4 SPECIFIC CONFIG -->\r\n                @if (printMode() === 'plain_a4') {\r\n                    <div class=\"space-y-4 animate-bounce-in\">\r\n                        <div class=\"text-[10px] text-slate-500 bg-emerald-50 p-2 rounded border border-emerald-100 flex items-start gap-2\">\r\n                            <i class=\"fa-solid fa-scissors mt-0.5 text-emerald-500\"></i>\r\n                            <span>In tr\u00EAn gi\u1EA5y Decal A4 nguy\u00EAn t\u1EDD. H\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 chia l\u01B0\u1EDBi v\u00E0 in vi\u1EC1n m\u1EDD \u0111\u1EC3 b\u1EA1n t\u1EF1 c\u1EAFt.</span>\r\n                        </div>\r\n\r\n                        <div class=\"grid grid-cols-2 gap-3\">\r\n                            <div>\r\n                                <label class=\"label-mini\">S\u1ED1 c\u1ED9t (Ngang)</label>\r\n                                <input type=\"number\" [ngModel]=\"plainCols()\" (ngModelChange)=\"plainCols.set($event)\" class=\"input-std text-center\">\r\n                            </div>\r\n                            <div>\r\n                                <label class=\"label-mini\">S\u1ED1 h\u00E0ng (D\u1ECDc)</label>\r\n                                <input type=\"number\" [ngModel]=\"plainRows()\" (ngModelChange)=\"plainRows.set($event)\" class=\"input-std text-center\">\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- Split Settings -->\r\n                        <div>\r\n                            <div class=\"flex justify-between items-center mb-1\">\r\n                                <label class=\"label-std mb-0\">Chia nh\u1ECF Tem (Split)</label>\r\n                                <span class=\"text-[9px] text-slate-400\">In nhi\u1EC1u m\u00E3 v\u00E0o 1 \u00F4 tem</span>\r\n                            </div>\r\n                            <div class=\"flex items-center gap-2\">\r\n                                <div class=\"grid grid-cols-5 gap-1 flex-1\">\r\n                                    @for (n of [1, 2, 3, 4, 5]; track n) {\r\n                                        <button (click)=\"splitCount.set(n)\" \r\n                                                class=\"py-1.5 rounded border text-xs font-bold transition\"\r\n                                                [class]=\"splitCount() === n ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'\">\r\n                                            {{n}}\r\n                                        </button>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- Calibration -->\r\n                        <div>\r\n                            <button (click)=\"showAdvanced.set(!showAdvanced())\" class=\"flex items-center justify-between w-full text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200\">\r\n                                <span><i class=\"fa-solid fa-ruler-combined mr-1\"></i> C\u0103n Ch\u1EC9nh & Vi\u1EC1n</span>\r\n                                <i class=\"fa-solid\" [class]=\"showAdvanced() ? 'fa-chevron-down' : 'fa-chevron-right'\"></i>\r\n                            </button>\r\n                            \r\n                            @if (showAdvanced()) {\r\n                                <div class=\"mt-2 grid grid-cols-2 gap-3 bg-white p-3 border border-slate-100 rounded-lg shadow-sm\">\r\n                                    <div><label class=\"label-mini\">L\u1EC1 tr\u00EAn/d\u01B0\u1EDBi (mm)</label><input type=\"number\" [ngModel]=\"marginTop()\" (ngModelChange)=\"marginTop.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><label class=\"label-mini\">L\u1EC1 tr\u00E1i/ph\u1EA3i (mm)</label><input type=\"number\" [ngModel]=\"marginLeft()\" (ngModelChange)=\"marginLeft.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><label class=\"label-mini\">Kho\u1EA3ng c\u00E1ch X</label><input type=\"number\" [ngModel]=\"gapX()\" (ngModelChange)=\"gapX.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><label class=\"label-mini\">Kho\u1EA3ng c\u00E1ch Y</label><input type=\"number\" [ngModel]=\"gapY()\" (ngModelChange)=\"gapY.set($event)\" class=\"input-mini\"></div>\r\n                                    <div><label class=\"label-mini\">Font Size</label><input type=\"number\" [ngModel]=\"fontSize()\" (ngModelChange)=\"fontSize.set($event)\" class=\"input-mini\"></div>\r\n                                    <div class=\"col-span-2 mt-2 pt-2 border-t border-slate-100\">\r\n                                        <label class=\"label-mini\">\u0110\u1ECBnh d\u1EA1ng hi\u1EC3n th\u1ECB</label>\r\n                                        <select [ngModel]=\"displayFormat()\" (ngModelChange)=\"displayFormat.set($event)\" class=\"input-mini bg-slate-50 text-left\">\r\n                                            <option value=\"text\">Ch\u1EC9 in Ch\u1EEF</option>\r\n                                            <option value=\"barcode\">Ch\u1EC9 in M\u00E3 v\u1EA1ch</option>\r\n                                            <option value=\"barcode_text\">M\u00E3 v\u1EA1ch + Ch\u1EEF</option>\r\n                                            <option value=\"qrcode\">Ch\u1EC9 in QR Code</option>\r\n                                            <option value=\"qrcode_text\">QR Code + Ch\u1EEF</option>\r\n                                            <option value=\"qrcode_hybrid\">QR Code (Hybrid GS1)</option>\r\n                                        </select>\r\n                                    </div>\r\n                                    @if (displayFormat() === 'qrcode_hybrid') {\r\n                                        <div class=\"col-span-2 mt-2 pt-2 border-t border-slate-100\">\r\n                                            <label class=\"label-mini\">GS1 Domain</label>\r\n                                            <input type=\"text\" [ngModel]=\"gs1Domain()\" (ngModelChange)=\"gs1Domain.set($event)\" class=\"input-mini w-full text-left px-2\" placeholder=\"https://nafiqpm6.vercel.app\">\r\n                                        </div>\r\n                                        <div class=\"col-span-2 mt-2\">\r\n                                            <label class=\"label-mini\">M\u00E3 GTIN</label>\r\n                                            <input type=\"text\" [ngModel]=\"gs1Gtin()\" (ngModelChange)=\"gs1Gtin.set($event)\" class=\"input-mini w-full text-left px-2\" placeholder=\"08934567890128\">\r\n                                        </div>\r\n                                    }\r\n                                    @if (displayFormat() !== 'text') {\r\n                                        <div><label class=\"label-mini\">R\u1ED9ng v\u1EA1ch (px)</label><input type=\"number\" [ngModel]=\"barcodeWidth()\" (ngModelChange)=\"barcodeWidth.set($event)\" class=\"input-mini\" min=\"1\" max=\"4\" step=\"0.5\"></div>\r\n                                        <div><label class=\"label-mini\">Cao m\u00E3 (px)</label><input type=\"number\" [ngModel]=\"barcodeHeight()\" (ngModelChange)=\"barcodeHeight.set($event)\" class=\"input-mini\" min=\"10\" max=\"100\" step=\"5\"></div>\r\n                                    }\r\n                                    <div class=\"col-span-2 mt-2 pt-2 border-t border-slate-100\">\r\n                                        <label class=\"label-mini\">C\u0103n l\u1EC1 n\u1ED9i dung (mm)</label>\r\n                                        <div class=\"grid grid-cols-4 gap-2 mb-2\">\r\n                                            <div><span class=\"text-[8px] text-slate-400 block text-center\">Tr\u00EAn</span><input type=\"number\" [ngModel]=\"padTop()\" (ngModelChange)=\"padTop.set($event)\" class=\"input-mini\"></div>\r\n                                            <div><span class=\"text-[8px] text-slate-400 block text-center\">D\u01B0\u1EDBi</span><input type=\"number\" [ngModel]=\"padBottom()\" (ngModelChange)=\"padBottom.set($event)\" class=\"input-mini\"></div>\r\n                                            <div><span class=\"text-[8px] text-slate-400 block text-center\">Tr\u00E1i</span><input type=\"number\" [ngModel]=\"padLeft()\" (ngModelChange)=\"padLeft.set($event)\" class=\"input-mini\"></div>\r\n                                            <div><span class=\"text-[8px] text-slate-400 block text-center\">Ph\u1EA3i</span><input type=\"number\" [ngModel]=\"padRight()\" (ngModelChange)=\"padRight.set($event)\" class=\"input-mini\"></div>\r\n                                        </div>\r\n                                        <div class=\"grid grid-cols-2 gap-2\">\r\n                                            <div>\r\n                                                <span class=\"text-[8px] text-slate-400 block text-center\">Ngang</span>\r\n                                                <select [ngModel]=\"alignX()\" (ngModelChange)=\"alignX.set($event)\" class=\"input-mini text-center\">\r\n                                                    <option value=\"flex-start\">Tr\u00E1i</option>\r\n                                                    <option value=\"center\">Gi\u1EEFa</option>\r\n                                                    <option value=\"flex-end\">Ph\u1EA3i</option>\r\n                                                </select>\r\n                                            </div>\r\n                                            <div>\r\n                                                <span class=\"text-[8px] text-slate-400 block text-center\">D\u1ECDc</span>\r\n                                                <select [ngModel]=\"alignY()\" (ngModelChange)=\"alignY.set($event)\" class=\"input-mini text-center\">\r\n                                                    <option value=\"flex-start\">Tr\u00EAn</option>\r\n                                                    <option value=\"center\">Gi\u1EEFa</option>\r\n                                                    <option value=\"flex-end\">D\u01B0\u1EDBi</option>\r\n                                                </select>\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"flex items-center justify-center pt-3 col-span-2 border-t border-slate-100 mt-2\">\r\n                                        <label class=\"flex items-center gap-2 cursor-pointer\">\r\n                                            <input type=\"checkbox\" [ngModel]=\"showCutLines()\" (ngModelChange)=\"showCutLines.set($event)\" class=\"w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500\">\r\n                                            <span class=\"text-[10px] font-bold text-slate-600 uppercase\">In vi\u1EC1n c\u1EAFt</span>\r\n                                        </label>\r\n                                    </div>\r\n                                </div>\r\n                            }\r\n                        </div>\r\n                    </div>\r\n                }\r\n            </div>\r\n\r\n            <!-- Footer Action -->\r\n            <div class=\"p-5 border-t border-slate-200 bg-white shrink-0 sticky bottom-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]\">\r\n                @if (printMode() === 'brother') {\r\n                    <button (click)=\"printBrother()\" [disabled]=\"rawInputCount() === 0\" \r\n                            class=\"w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-200 transition font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group\">\r\n                        <i class=\"fa-solid fa-print text-lg group-hover:scale-110 transition-transform\"></i> \r\n                        <span>In Ngay (Brother)</span>\r\n                    </button>\r\n                } @else {\r\n                    <button (click)=\"printA4()\" [disabled]=\"rawInputCount() === 0\" \r\n                            class=\"w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group\">\r\n                        <i class=\"fa-solid fa-print text-lg group-hover:scale-110 transition-transform\"></i> \r\n                        <span>In Ngay (A4)</span>\r\n                    </button>\r\n                }\r\n            </div>\r\n        </div>\r\n\r\n        <!-- RIGHT: Live Preview -->\r\n        <div #previewContainer class=\"flex-1 bg-slate-200/50 md:overflow-auto p-8 flex justify-center items-start min-h-[500px] md:min-h-0 relative md:h-full\">\r\n            \r\n            <!-- Zoom Controls -->\r\n            <div class=\"absolute bottom-6 right-6 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-lg border border-slate-200 z-30\">\r\n                <button (click)=\"adjustZoom(0.1)\" class=\"w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600\" title=\"Ph\u00F3ng to\"><i class=\"fa-solid fa-plus\"></i></button>\r\n                <span class=\"text-[10px] font-bold text-center text-slate-400\">{{Math.round(zoomLevel() * 100)}}%</span>\r\n                <button (click)=\"adjustZoom(-0.1)\" class=\"w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600\" title=\"Thu nh\u1ECF\"><i class=\"fa-solid fa-minus\"></i></button>\r\n                <div class=\"h-px bg-slate-200 w-full my-1\"></div>\r\n                <button (click)=\"fitToScreen()\" class=\"w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-blue-600\" title=\"V\u1EEBa m\u00E0n h\u00ECnh\"><i class=\"fa-solid fa-expand\"></i></button>\r\n            </div>\r\n\r\n            <!-- Preview Wrapper -->\r\n            <div class=\"space-y-10 pb-20 w-fit mx-auto origin-top transform transition-transform duration-300\" \r\n                 [style.transform]=\"'scale(' + zoomLevel() + ')'\">\r\n                \r\n                <!-- A. BROTHER PREVIEW -->\r\n                @if (printMode() === 'brother') {\r\n                    <div class=\"flex flex-col gap-1 items-center\">\r\n                        <div class=\"text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest\">M\u00F4 ph\u1ECFng cu\u1ED9n in ({{brotherWidth()}}mm)</div>\r\n                        <div class=\"bg-slate-300 p-2 pb-10 rounded-t-lg shadow-inner\">\r\n                            <!-- Continuous Strip Simulation -->\r\n                            <div id=\"brother-preview-strip\" class=\"bg-white shadow-xl flex flex-col items-center\"\r\n                                 [style.width.mm]=\"brotherWidth()\" [style.min-height.mm]=\"100\">\r\n                                @for (page of brotherPreviewPages(); track $index) {\r\n                                    <div class=\"w-full relative overflow-hidden box-border\"\r\n                                         [style.height.mm]=\"brotherPreviewPageHeight()\"\r\n                                         [class.border-b]=\"isBrotherFixed()\"\r\n                                         [class.border-dashed]=\"isBrotherFixed()\"\r\n                                         [class.border-slate-600]=\"isBrotherFixed()\">\r\n                                        \r\n                                        <div class=\"w-full h-full grid\"\r\n                                             [style.grid-template-columns]=\"'repeat(' + brotherCols() + ', 1fr)'\"\r\n                                             [style.grid-template-rows]=\"'repeat(' + (page.length / brotherCols()) + ', 1fr)'\">\r\n                                            @for (label of page; track $index) {\r\n                                                <div class=\"flex items-center justify-center overflow-hidden p-0.5 box-border\"\r\n                                                     style=\"container-type: size; width: 100%; height: 100%;\"\r\n                                                     [class.border-r]=\"brotherShowCutLines() && ($index % brotherCols() !== brotherCols() - 1)\"\r\n                                                     [class.border-b]=\"brotherShowCutLines() && (Math.floor($index / brotherCols()) !== (page.length / brotherCols()) - 1)\"\r\n                                                     [class.border-dashed]=\"brotherShowCutLines()\"\r\n                                                     [class.border-slate-600]=\"brotherShowCutLines()\">\r\n                                                    <div class=\"flex flex-col overflow-hidden box-border\"\r\n                                                         [style.align-items]=\"alignX()\"\r\n                                                         [style.justify-content]=\"alignY()\"\r\n                                                         [style.padding-top.mm]=\"padTop()\"\r\n                                                         [style.padding-bottom.mm]=\"padBottom()\"\r\n                                                         [style.padding-left.mm]=\"padLeft()\"\r\n                                                         [style.padding-right.mm]=\"padRight()\"\r\n                                                         [style.transform]=\"rotateText() ? 'rotate(-90deg)' : 'none'\"\r\n                                                         [style.width]=\"rotateText() ? '100cqh' : '100cqw'\"\r\n                                                         [style.height]=\"rotateText() ? '100cqw' : '100cqh'\">\r\n                                                        @if (displayFormat() !== 'text' && label) {\r\n                                                            <img [src]=\"generateBarcode(label)\" class=\"max-w-full object-contain\" [style.height.px]=\"barcodeHeight()\" />\r\n                                                        }\r\n                                                        @if (displayFormat() !== 'barcode' && displayFormat() !== 'qrcode' && label) {\r\n                                                            <span class=\"font-bold font-mono leading-none overflow-hidden px-1\"\r\n                                                                  [style.text-align]=\"alignX() === 'flex-start' ? 'left' : alignX() === 'flex-end' ? 'right' : 'center'\"\r\n                                                                  [class.mt-1]=\"displayFormat() === 'barcode_text' || displayFormat() === 'qrcode_text' || displayFormat() === 'qrcode_hybrid'\"\r\n                                                                  style=\"display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; word-break: break-all;\"\r\n                                                                  [class.text-red-600]=\"label.length > 30\"\r\n                                                                  [style.font-size.pt]=\"fontSize()\"\r\n                                                                  [title]=\"label.length > 30 ? 'C\u1EA3nh b\u00E1o: M\u00E3 qu\u00E1 d\u00E0i c\u00F3 th\u1EC3 b\u1ECB c\u1EAFt khi in' : ''\">\r\n                                                                {{label}}\r\n                                                            </span>\r\n                                                        }\r\n                                                    </div>\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    </div>\r\n                                }\r\n                                @if (rawInputCount() === 0) {\r\n                                    <div class=\"h-[50mm] w-full flex items-center justify-center text-slate-300 text-[10px] italic\">Tr\u1ED1ng</div>\r\n                                }\r\n                            </div>\r\n                        </div>\r\n                        @if (hiddenBrotherPreviewLabelCount() > 0) {\r\n                            <div class=\"mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800 shadow-sm\">\r\n                                Preview \u0111ang hi\u1EC3n th\u1ECB nhanh {{rawInputCount() - hiddenBrotherPreviewLabelCount()}}/{{rawInputCount()}} tem \u0111\u1EC3 tr\u00E1nh lag.\r\n                                <button type=\"button\" (click)=\"showFullPreview.set(true)\" class=\"ml-2 underline decoration-amber-400 underline-offset-2 hover:text-amber-950\">Hi\u1EC7n t\u1EA5t c\u1EA3</button>\r\n                            </div>\r\n                        }\r\n                        <div class=\"h-4 bg-slate-800 rounded-b-lg shadow-lg\" [style.width.mm]=\"brotherWidth() + 8\"></div> <!-- Printer Slot Visual -->\r\n                    </div>\r\n                }\r\n\r\n                <!-- B. TOMY A4 & PLAIN A4 PREVIEW -->\r\n                @if (printMode() === 'tomy_a4' || printMode() === 'plain_a4') {\r\n                    @for (page of previewPages(); track page.pageIndex) {\r\n                        <div id=\"label-page-{{page.pageIndex}}\" \r\n                             class=\"bg-white shadow-2xl relative transition-all duration-300 box-border overflow-hidden ring-1 ring-slate-900/5\" \r\n                             [style.width.mm]=\"layoutDims().pageW\"\r\n                             [style.height.mm]=\"layoutDims().pageH\"\r\n                             style=\"padding-top: {{marginTop()}}mm; padding-left: {{marginLeft()}}mm; padding-right: {{marginLeft()}}mm; padding-bottom: {{marginTop()}}mm;\">\r\n                            \r\n                            <!-- The Grid -->\r\n                            <div class=\"grid content-start justify-start\"\r\n                                 [style.grid-template-columns]=\"'repeat(' + layoutDims().cols + ', ' + layoutDims().cellW + 'mm)'\"\r\n                                 [style.grid-template-rows]=\"'repeat(' + layoutDims().rows + ', ' + layoutDims().cellH + 'mm)'\"\r\n                                 [style.gap]=\"gapY() + 'mm ' + gapX() + 'mm'\">\r\n                                \r\n                                @for (cell of page.cells; track cell.index) {\r\n                                    <div class=\"relative flex flex-col overflow-hidden group cursor-default transition-colors w-full h-full box-border\"\r\n                                         [class.border]=\"printMode() === 'tomy_a4' || (printMode() === 'plain_a4' && showCutLines())\"\r\n                                         [class.border-slate-200]=\"printMode() === 'tomy_a4'\"\r\n                                         [class.border-slate-600]=\"printMode() === 'plain_a4' && showCutLines()\"\r\n                                         [class.border-dashed]=\"printMode() === 'plain_a4' && showCutLines()\"\r\n                                         [class.bg-slate-50]=\"cell.isEmpty\"\r\n                                         [class.opacity-40]=\"cell.isEmpty\">\r\n                                        \r\n                                        @if(!cell.isEmpty) {\r\n                                            <div class=\"absolute top-0.5 right-1 text-[6px] text-slate-200 select-none\">{{cell.index + 1}}</div>\r\n                                        }\r\n\r\n                                        <!-- Content Stack -->\r\n                                        @for (label of cell.subLabels; track $index; let last = $last) {\r\n                                            <div class=\"flex-1 flex flex-col items-center justify-center w-full relative\" \r\n                                                 [class.border-b]=\"!last\" \r\n                                                 style=\"border-bottom-style: dashed; border-bottom-width: 1px; border-bottom-color: #475569; container-type: size;\">\r\n                                                <div class=\"flex flex-col overflow-hidden box-border\"\r\n                                                     [style.align-items]=\"alignX()\"\r\n                                                     [style.justify-content]=\"alignY()\"\r\n                                                     [style.padding-top.mm]=\"padTop()\"\r\n                                                     [style.padding-bottom.mm]=\"padBottom()\"\r\n                                                     [style.padding-left.mm]=\"padLeft()\"\r\n                                                     [style.padding-right.mm]=\"padRight()\"\r\n                                                     [style.transform]=\"rotateText() ? 'rotate(-90deg)' : 'none'\"\r\n                                                     [style.width]=\"rotateText() ? '100cqh' : '100cqw'\"\r\n                                                     [style.height]=\"rotateText() ? '100cqw' : '100cqh'\">\r\n                                                    @if (displayFormat() !== 'text' && label) {\r\n                                                        <img [src]=\"generateBarcode(label)\" class=\"max-w-full object-contain\" [style.height.px]=\"barcodeHeight()\" />\r\n                                                    }\r\n                                                    @if (displayFormat() !== 'barcode' && displayFormat() !== 'qrcode' && label) {\r\n                                                        <span class=\"font-bold font-mono leading-none overflow-hidden px-1\"\r\n                                                              [style.text-align]=\"alignX() === 'flex-start' ? 'left' : alignX() === 'flex-end' ? 'right' : 'center'\"\r\n                                                              [class.mt-1]=\"displayFormat() === 'barcode_text' || displayFormat() === 'qrcode_text' || displayFormat() === 'qrcode_hybrid'\"\r\n                                                              style=\"display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; word-break: break-all;\"\r\n                                                              [class.text-red-600]=\"label.length > 30\"\r\n                                                              [style.font-size.pt]=\"fontSize()\"\r\n                                                              [style.font-family]=\"'Roboto Mono'\"\r\n                                                              [title]=\"label.length > 30 ? 'C\u1EA3nh b\u00E1o: M\u00E3 qu\u00E1 d\u00E0i c\u00F3 th\u1EC3 b\u1ECB c\u1EAFt khi in' : ''\">\r\n                                                            {{label}}\r\n                                                        </span>\r\n                                                    }\r\n                                                </div>\r\n                                            </div>\r\n                                        }\r\n                                    </div>\r\n                                }\r\n                            </div>\r\n\r\n                            <div class=\"absolute bottom-2 left-0 w-full text-center pointer-events-none\">\r\n                                <span class=\"bg-slate-100/90 text-slate-400 text-[8px] font-bold px-2 py-0.5 rounded border border-slate-200 shadow-sm\">\r\n                                    Page {{page.pageIndex + 1}} (A4)\r\n                                </span>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n                    @if (hiddenPreviewPageCount() > 0) {\r\n                        <div class=\"mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs font-bold text-amber-800 shadow-sm\">\r\n                            Preview \u0111ang hi\u1EC3n th\u1ECB {{previewPages().length}}/{{pages().length}} trang \u0111\u1EA7u \u0111\u1EC3 gi\u1EEF m\u00E0n h\u00ECnh m\u01B0\u1EE3t.\r\n                            <button type=\"button\" (click)=\"showFullPreview.set(true)\" class=\"ml-2 underline decoration-amber-400 underline-offset-2 hover:text-amber-950\">Hi\u1EC7n t\u1EA5t c\u1EA3</button>\r\n                            <div class=\"mt-1 text-[10px] font-semibold text-amber-700\">Khi b\u1EA5m in, h\u1EC7 th\u1ED1ng v\u1EABn in \u0111\u1EE7 to\u00E0n b\u1ED9 d\u1EEF li\u1EC7u.</div>\r\n                        </div>\r\n                    }\r\n                }\r\n            </div>\r\n        </div>\r\n    </div>\r\n", styles: ["\n    .label-std { display: block; font-size: 11px; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }\n    .label-mini { display: block; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }\n    .input-std { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; font-size: 13px; font-weight: 600; color: #1e293b; outline: none; transition: all; }\n    .input-std:focus { border-color: #3b82f6; ring: 2px; ring-color: #bfdbfe; }\n    .input-mini { width: 100%; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px; font-size: 11px; font-weight: 700; text-align: center; outline: none; }\n    .input-mini:focus { background-color: white; border-color: #3b82f6; }\n    \n    .custom-scrollbar::-webkit-scrollbar { width: 4px; }\n    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }\n    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }\n  "] }]
    }], () => [], { previewContainer: [{
            type: ViewChild,
            args: ['previewContainer']
        }], initialData: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LabelPrintComponent, { className: "LabelPrintComponent", filePath: "src/app/features/labels/label-print.component.ts", lineNumber: 63 }); })();
//# sourceMappingURL=label-print.component.js.map