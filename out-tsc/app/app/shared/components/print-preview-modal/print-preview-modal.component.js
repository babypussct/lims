import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PrintService } from '../../../core/services/print.service';
import { PrintLayoutComponent } from '../print-layout/print-layout.component';
import { ToastService } from '../../../core/services/toast.service';
import { timestampToDate } from '../../utils/timestamp';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function PrintPreviewModalComponent_Conditional_0_Conditional_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 26);
} }
function PrintPreviewModalComponent_Conditional_0_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 27);
} }
function PrintPreviewModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_0_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.close()); });
    i0.ɵɵelementStart(1, "div", 3);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_0_Template_div_click_1_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "div", 4)(3, "h3", 5);
    i0.ɵɵelement(4, "i", 6);
    i0.ɵɵtext(5, " Xem Tr\u01B0\u1EDBc khi In (A4 Preview) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 7)(7, "div", 8)(8, "button", 9);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_0_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.zoomOut()); });
    i0.ɵɵelement(9, "i", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span", 11);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 9);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_0_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.zoomIn()); });
    i0.ɵɵelement(13, "i", 12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "button", 13);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_0_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.close()); });
    i0.ɵɵelement(15, "i", 14);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "div", 15)(17, "div", 16)(18, "div", 17)(19, "h4", 18);
    i0.ɵɵtext(20, "T\u00F9y Ch\u1ECDn Hi\u1EC3n Th\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "label", 19)(22, "span", 20);
    i0.ɵɵtext(23, "Ti\u00EAu \u0111\u1EC1 (Header)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "input", 21);
    i0.ɵɵtwoWayListener("ngModelChange", function PrintPreviewModalComponent_Conditional_0_Template_input_ngModelChange_24_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.options.showHeader, $event) || (ctx_r1.options.showHeader = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "label", 19)(26, "span", 20);
    i0.ɵɵtext(27, "Ch\u00E2n trang (Footer)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "input", 21);
    i0.ɵɵtwoWayListener("ngModelChange", function PrintPreviewModalComponent_Conditional_0_Template_input_ngModelChange_28_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.options.showFooter, $event) || (ctx_r1.options.showFooter = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "label", 19)(30, "span", 20);
    i0.ɵɵtext(31, "K\u00FD t\u00EAn \u0111i\u1EC7n t\u1EED");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "input", 21);
    i0.ɵɵtwoWayListener("ngModelChange", function PrintPreviewModalComponent_Conditional_0_Template_input_ngModelChange_32_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.options.showSignature, $event) || (ctx_r1.options.showSignature = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "label", 19)(34, "span", 20);
    i0.ɵɵtext(35, "\u0110\u01B0\u1EDDng c\u1EAFt (Cut line)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "input", 21);
    i0.ɵɵtwoWayListener("ngModelChange", function PrintPreviewModalComponent_Conditional_0_Template_input_ngModelChange_36_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.options.showCutLine, $event) || (ctx_r1.options.showCutLine = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(37, "div", 22)(38, "button", 23);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_0_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.doPrint()); });
    i0.ɵɵelement(39, "i", 24);
    i0.ɵɵelementStart(40, "span");
    i0.ɵɵtext(41, "IN NGAY (Direct)");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(42, "button", 25);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_0_Template_button_click_42_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.doPdf()); });
    i0.ɵɵtemplate(43, PrintPreviewModalComponent_Conditional_0_Conditional_43_Template, 1, 0, "i", 26)(44, PrintPreviewModalComponent_Conditional_0_Conditional_44_Template, 1, 0, "i", 27);
    i0.ɵɵelementStart(45, "span");
    i0.ɵɵtext(46, "T\u1EA3i PDF (High-Res)");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(47, "div", 28)(48, "div", 29);
    i0.ɵɵelement(49, "app-print-layout", 30);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵtextInterpolate1("", ctx_r1.zoomLevel(), "%");
    i0.ɵɵadvance(13);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.options.showHeader);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.options.showFooter);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.options.showSignature);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.options.showCutLine);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.isGeneratingPdf());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isGeneratingPdf() ? 43 : 44);
    i0.ɵɵadvance(5);
    i0.ɵɵstyleProp("transform", "scale(" + ctx_r1.zoomLevel() / 100 + ")");
    i0.ɵɵadvance();
    i0.ɵɵproperty("jobs", ctx_r1.printService.previewJobs())("options", ctx_r1.options);
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_12_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 64);
    i0.ɵɵtext(1, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "span", 65);
    i0.ɵɵelement(3, "i", 66);
    i0.ɵɵelementStart(4, "span", 67);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.formatPublishDate(ctx_r1.printService.pdfPublishDate()));
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 41)(1, "span", 58);
    i0.ɵɵelement(2, "i", 59);
    i0.ɵɵelementStart(3, "span", 60);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "span", 61);
    i0.ɵɵtext(6, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 58);
    i0.ɵɵelement(8, "i", 62);
    i0.ɵɵelementStart(9, "span", 63);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(11, PrintPreviewModalComponent_Conditional_1_Conditional_12_Conditional_11_Template, 6, 1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("v", ctx_r1.printService.pdfVersion(), "");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.printService.pdfAnalyst());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printService.pdfPublishDate() ? 11 : -1);
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 43);
    i0.ɵɵelement(1, "i", 68);
    i0.ɵɵelementStart(2, "span", 48);
    i0.ɵɵtext(3, "GOOGLE DOCS");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 49);
    i0.ɵɵtext(5, "Docs");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("href", ctx_r1.printService.docsUrl(), i0.ɵɵsanitizeUrl);
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 69);
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2, "\u0110ANG IN...");
    i0.ɵɵelementEnd();
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 70);
    i0.ɵɵelementStart(1, "span", 48);
    i0.ɵɵtext(2, "IN NHANH");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 49);
    i0.ɵɵtext(4, "In");
    i0.ɵɵelementEnd();
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 69);
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2, "\u0110ANG T\u1EA2I...");
    i0.ɵɵelementEnd();
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 71);
    i0.ɵɵelementStart(1, "span", 48);
    i0.ɵɵtext(2, "T\u1EA2I T\u00C0I LI\u1EC6U");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 49);
    i0.ɵɵtext(4, "T\u1EA3i File");
    i0.ɵɵelementEnd();
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 55);
    i0.ɵɵelement(1, "i", 72);
    i0.ɵɵelementStart(2, "span", 73);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 74);
    i0.ɵɵtext(5, "Vui l\u00F2ng \u0111\u1EE3i trong gi\u00E2y l\u00E1t, b\u1EA3ng xem tr\u01B0\u1EDBc s\u1EBD t\u1EF1 c\u1EADp nh\u1EADt.");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("\u0110ang t\u1EA1o l\u1EA1i b\u1EA3n b\u00E1o c\u00E1o v", ctx_r1.printService.pdfVersion() + 1, "...");
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 56);
    i0.ɵɵelement(1, "i", 75);
    i0.ɵɵelementStart(2, "span", 76);
    i0.ɵɵtext(3, "\u0110ang t\u1EA3i t\u00E0i li\u1EC7u t\u1EEB Drive...");
    i0.ɵɵelementEnd()();
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_35_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 77);
    i0.ɵɵelement(1, "img", 79);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.rawPdfUrl(), i0.ɵɵsanitizeUrl);
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_35_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "iframe", 78);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("src", ctx_r1.pdfModalSafeUrl(), i0.ɵɵsanitizeResourceUrl);
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, PrintPreviewModalComponent_Conditional_1_Conditional_35_Conditional_0_Template, 2, 1, "div", 77)(1, PrintPreviewModalComponent_Conditional_1_Conditional_35_Conditional_1_Template, 1, 1, "iframe", 78);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r1.printService.pdfPreviewType() === "image" ? 0 : 1);
} }
function PrintPreviewModalComponent_Conditional_1_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 57)(1, "div", 80);
    i0.ɵɵelement(2, "i", 81);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 82)(4, "p", 83);
    i0.ɵɵtext(5, "C\u1EA7n x\u00E1c th\u1EF1c Google Drive");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 84);
    i0.ɵɵtext(7, " Phi\u00EAn x\u00E1c th\u1EF1c \u0111\u00E3 h\u1EBFt h\u1EA1n. Nh\u1EA5n n\u00FAt b\u00EAn d\u01B0\u1EDBi \u0111\u1EC3 \u0111\u0103ng nh\u1EADp l\u1EA1i. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 85);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_1_Conditional_36_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.retryLoadBlob()); });
    i0.ɵɵelement(9, "i", 86);
    i0.ɵɵelementStart(10, "span");
    i0.ɵɵtext(11, "X\u00E1c Th\u1EF1c & T\u1EA3i L\u1EA1i");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "p", 87);
    i0.ɵɵtext(13, " Ho\u1EB7c nh\u1EA5n ");
    i0.ɵɵelementStart(14, "strong", 88);
    i0.ɵɵtext(15, "T\u1EA2I T\u00C0I LI\u1EC6U");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(16, " / ");
    i0.ɵɵelementStart(17, "strong", 88);
    i0.ɵɵtext(18, "GOOGLE DOCS");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(19, " \u1EDF tr\u00EAn. ");
    i0.ɵɵelementEnd()();
} }
function PrintPreviewModalComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 31);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_1_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closePdfModal()); });
    i0.ɵɵelementStart(1, "div", 32);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_1_Template_div_click_1_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "div", 33)(3, "div", 34)(4, "div", 35);
    i0.ɵɵelement(5, "i", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 37)(7, "div", 38)(8, "span", 39);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "h4", 40);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(12, PrintPreviewModalComponent_Conditional_1_Conditional_12_Template, 12, 3, "div", 41);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 42);
    i0.ɵɵtemplate(14, PrintPreviewModalComponent_Conditional_1_Conditional_14_Template, 6, 1, "a", 43);
    i0.ɵɵelementStart(15, "button", 44);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_1_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printPdf()); });
    i0.ɵɵtemplate(16, PrintPreviewModalComponent_Conditional_1_Conditional_16_Template, 3, 0)(17, PrintPreviewModalComponent_Conditional_1_Conditional_17_Template, 5, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 45);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_1_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.downloadPdf()); });
    i0.ɵɵtemplate(19, PrintPreviewModalComponent_Conditional_1_Conditional_19_Template, 3, 0)(20, PrintPreviewModalComponent_Conditional_1_Conditional_20_Template, 5, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "button", 46);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_1_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyPdfLink()); });
    i0.ɵɵelement(22, "i", 47);
    i0.ɵɵelementStart(23, "span", 48);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "span", 49);
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(27, "div", 50);
    i0.ɵɵelementStart(28, "button", 51);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_1_Template_button_click_28_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleFullscreen()); });
    i0.ɵɵelement(29, "i", 47);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "button", 52);
    i0.ɵɵlistener("click", function PrintPreviewModalComponent_Conditional_1_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closePdfModal()); });
    i0.ɵɵelement(31, "i", 53);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(32, "div", 54);
    i0.ɵɵtemplate(33, PrintPreviewModalComponent_Conditional_1_Conditional_33_Template, 6, 1, "div", 55)(34, PrintPreviewModalComponent_Conditional_1_Conditional_34_Template, 4, 0, "div", 56)(35, PrintPreviewModalComponent_Conditional_1_Conditional_35_Template, 2, 1)(36, PrintPreviewModalComponent_Conditional_1_Conditional_36_Template, 20, 0, "div", 57);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵclassProp("w-full", ctx_r1.isFullscreen())("h-full", ctx_r1.isFullscreen())("max-w-none", ctx_r1.isFullscreen())("rounded-none", ctx_r1.isFullscreen())("max-w-6xl", !ctx_r1.isFullscreen())("w-full", !ctx_r1.isFullscreen())("h-[90vh]", !ctx_r1.isFullscreen())("rounded-2xl", !ctx_r1.isFullscreen());
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.printService.pdfVersion() === 0 ? "CoA" : "B\u00E1o c\u00E1o", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", ctx_r1.printService.pdfTitle());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.printService.pdfTitle(), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printService.pdfVersion() > 0 ? 12 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.printService.docsUrl() ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.printService.isPrinting());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printService.isPrinting() ? 16 : 17);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.printService.isDownloading());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printService.isDownloading() ? 19 : 20);
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("fa-copy", !ctx_r1.isCopying())("fa-check", ctx_r1.isCopying());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.isCopying() ? "\u0110\u00C3 SAO CH\u00C9P" : "SAO CH\u00C9P LINK");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.isCopying() ? "\u0110\u00E3 sao ch\u00E9p" : "Sao ch\u00E9p");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", ctx_r1.isFullscreen() ? "Thu nh\u1ECF c\u1EEDa s\u1ED5" : "Ph\u00F3ng to c\u1EEDa s\u1ED5");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-expand", !ctx_r1.isFullscreen())("fa-compress", ctx_r1.isFullscreen());
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.isPublishing() ? 33 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.printService.isPdfBlobLoading() ? 34 : ctx_r1.pdfModalSafeUrl() ? 35 : 36);
} }
export class PrintPreviewModalComponent {
    constructor() {
        this.printService = inject(PrintService);
        this.toast = inject(ToastService);
        this.sanitizer = inject(DomSanitizer);
        // HTML A4 Print options & levels
        this.zoomLevel = signal(75); // %
        this.isGeneratingPdf = signal(false);
        this.options = { ...this.printService.defaultOptions };
        // Cloud PDF reporting panel states
        this.isFullscreen = signal(false);
        this.isCopying = signal(false);
        this.isPublishing = signal(false);
        // isPrinting now delegated to printService.isPrinting()
        // Safe resource computed URL
        this.pdfModalSafeUrl = computed(() => {
            const url = this.printService.pdfBlobUrl(); // Use Blob URL to bypass CSP
            if (!url)
                return null;
            return this.sanitizer.bypassSecurityTrustResourceUrl(url);
        });
        // Raw raw URL for tab bypass
        this.rawPdfUrl = computed(() => this.printService.pdfUrl() || '');
        // Reset options when HTML preview is opened
        effect(() => {
            if (this.printService.isPreviewOpen()) {
                this.options = { ...this.printService.defaultOptions };
                this.zoomLevel.set(75);
            }
        });
    }
    // --- 1. LOCAL A4 PRINT HANDLERS ---
    close() { this.printService.closePreview(); }
    zoomIn() { this.zoomLevel.update(v => Math.min(v + 10, 150)); }
    zoomOut() { this.zoomLevel.update(v => Math.max(v - 10, 25)); }
    cloneContentToContainer(targetContainer) {
        const source = document.querySelector('app-print-layout');
        if (!source)
            throw new Error('Không tìm thấy nội dung cần xem trước.');
        const clone = source.cloneNode(true);
        const sourceCanvases = source.querySelectorAll('canvas');
        const cloneCanvases = clone.querySelectorAll('canvas');
        sourceCanvases.forEach((sourceCanvas, index) => {
            if (cloneCanvases[index]) {
                const destCanvas = cloneCanvases[index];
                const ctx = destCanvas.getContext('2d');
                if (ctx)
                    ctx.drawImage(sourceCanvas, 0, 0);
            }
        });
        clone.style.width = '210mm';
        clone.style.margin = '0';
        clone.style.transform = 'none';
        clone.style.boxShadow = 'none';
        targetContainer.innerHTML = '';
        targetContainer.appendChild(clone);
    }
    doPrint() {
        const printContainer = document.getElementById('print-container');
        if (!printContainer) {
            this.toast.show('Lỗi: Không tìm thấy container in.', 'error');
            return;
        }
        try {
            this.cloneContentToContainer(printContainer);
            setTimeout(() => {
                window.print();
            }, 50);
        }
        catch (e) {
            console.error(e);
            this.toast.show('Lỗi chuẩn bị in.', 'error');
        }
    }
    async doPdf() {
        this.isGeneratingPdf.set(true);
        this.toast.show('Đang tạo PDF chất lượng cao...', 'info');
        let tempContainer = null;
        try {
            tempContainer = document.createElement('div');
            tempContainer.style.position = 'fixed';
            tempContainer.style.top = '0';
            tempContainer.style.left = '0';
            tempContainer.style.zIndex = '-10000';
            tempContainer.style.width = '210mm';
            tempContainer.style.background = 'white';
            document.body.appendChild(tempContainer);
            this.cloneContentToContainer(tempContainer);
            const elementToCapture = tempContainer.firstChild;
            await new Promise(r => setTimeout(r, 150));
            const { jsPDF } = await import('jspdf');
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(elementToCapture, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 1200
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdfWidth = 210;
            const pdfHeight = 297;
            const doc = new jsPDF('p', 'mm', 'a4');
            const imgProps = doc.getImageProperties(imgData);
            const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = pdfImgHeight;
            let position = 0;
            doc.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfImgHeight);
            heightLeft -= pdfHeight;
            while (heightLeft > 0) {
                position = heightLeft - pdfImgHeight;
                doc.addPage();
                doc.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfImgHeight);
                heightLeft -= pdfHeight;
            }
            const fileName = `LIMS_Phieu_${new Date().toISOString().slice(0, 10)}.pdf`;
            doc.save(fileName);
            this.toast.show('Tải PDF thành công!', 'success');
        }
        catch (e) {
            console.error(e);
            this.toast.show('Lỗi tạo PDF: ' + e.message, 'error');
        }
        finally {
            if (tempContainer && document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
            this.isGeneratingPdf.set(false);
        }
    }
    // --- 2. CLOUD PDF REPORTING PANEL HANDLERS ---
    closePdfModal() {
        this.printService.closePdfPreview();
        this.isFullscreen.set(false);
    }
    toggleFullscreen() {
        this.isFullscreen.update(v => !v);
    }
    getFileId(url) {
        if (!url)
            return null;
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : null;
    }
    printPdf() {
        const url = this.printService.pdfUrl();
        if (!url)
            return;
        this.printService.quickPrint(url);
    }
    downloadPdf() {
        const url = this.printService.pdfUrl();
        const title = this.printService.pdfTitle();
        const version = this.printService.pdfVersion();
        if (!url)
            return;
        const fileName = `${title.replace(/[\/\\]/g, '_')}_v${version}.pdf`;
        this.printService.quickDownload(url, fileName);
    }
    retryLoadBlob() {
        this.printService.retryLoadPdfBlob();
    }
    async copyPdfLink() {
        const url = this.printService.pdfUrl();
        if (url) {
            try {
                this.isCopying.set(true);
                await navigator.clipboard.writeText(url);
                this.toast.show('Đã sao chép liên kết báo cáo PDF vào clipboard!', 'success');
                setTimeout(() => this.isCopying.set(false), 1500);
            }
            catch (err) {
                this.toast.show('Không thể sao chép liên kết', 'error');
            }
        }
    }
    async triggerRepublishFromModal() {
        const callback = this.printService.onRepublishCallback();
        if (callback) {
            this.isPublishing.set(true);
            try {
                await callback();
                this.toast.show('Đã tạo lại bản báo cáo mới thành công!', 'success');
            }
            catch (err) {
                this.toast.show('Lỗi tạo lại báo cáo: ' + (err.message || err), 'error');
            }
            finally {
                this.isPublishing.set(false);
            }
        }
        else {
            this.toast.show('Không thể tạo lại: Thiếu callback xử lý', 'error');
        }
    }
    formatPublishDate(timestamp) {
        const date = timestampToDate(timestamp);
        return date ? date.toLocaleString('vi-VN') : 'Chưa rõ';
    }
    static { this.ɵfac = function PrintPreviewModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PrintPreviewModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PrintPreviewModalComponent, selectors: [["app-print-preview-modal"]], decls: 2, vars: 2, consts: [[1, "fixed", "inset-0", "z-[150]", "flex", "items-center", "justify-center", "bg-slate-900/95", "backdrop-blur-md", "p-4", "fade-in", "print-modal-overlay"], [1, "fixed", "inset-0", "bg-slate-900/70", "backdrop-blur-sm", "flex", "items-center", "justify-center", "z-[150]", "p-4", "fade-in"], [1, "fixed", "inset-0", "z-[150]", "flex", "items-center", "justify-center", "bg-slate-900/95", "backdrop-blur-md", "p-4", "fade-in", "print-modal-overlay", 3, "click"], [1, "bg-white", "w-full", "max-w-6xl", "h-[90vh]", "rounded-2xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col", "animate-bounce-in", "relative", "print-modal-content", 3, "click"], [1, "px-6", "py-4", "border-b", "border-slate-100", "flex", "justify-between", "items-center", "bg-white", "shrink-0", "z-10", "print-hidden-ui"], [1, "font-black", "text-slate-800", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-print", "text-indigo-600"], [1, "flex", "gap-2"], [1, "flex", "items-center", "gap-1", "bg-slate-100", "rounded-lg", "p-1", "border", "border-slate-200"], [1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded", "hover:bg-white", "transition", "text-slate-600", 3, "click"], [1, "fa-solid", "fa-minus"], [1, "text-xs", "font-bold", "w-10", "text-center"], [1, "fa-solid", "fa-plus"], [1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-lg", "hover:bg-slate-100", "text-slate-400", "hover:text-red-500", "transition", 3, "click"], [1, "fa-solid", "fa-times", "text-xl"], [1, "flex-1", "flex", "overflow-hidden"], [1, "w-72", "bg-slate-50", "border-r", "border-slate-200", "p-5", "flex", "flex-col", "gap-6", "overflow-y-auto", "shrink-0", "print-hidden-ui"], [1, "space-y-3"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-widest"], [1, "flex", "items-center", "justify-between", "p-3", "bg-white", "border", "border-slate-200", "rounded-xl", "cursor-pointer", "hover:border-indigo-300", "transition"], [1, "text-sm", "font-bold", "text-slate-700"], ["type", "checkbox", 1, "w-5", "h-5", "accent-indigo-600", "rounded", 3, "ngModelChange", "ngModel"], [1, "mt-auto", "pt-6", "border-t", "border-slate-200", "flex", "flex-col", "gap-3"], [1, "w-full", "py-4", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-xl", "font-bold", "shadow-lg", "shadow-indigo-200", "transition", "transform", "hover:-translate-y-0.5", "active:translate-y-0", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-print", "text-lg"], [1, "w-full", "py-3", "bg-white", "border", "border-indigo-200", "text-indigo-700", "hover:bg-indigo-50", "rounded-xl", "font-bold", "transition", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-file-pdf"], [1, "flex-1", "bg-slate-200", "overflow-auto", "flex", "justify-center", "p-8", "relative", "custom-scrollbar", "print-scale-reset"], ["id", "print-area", 1, "origin-top", "transition-transform", "duration-200", "ease-out", "shadow-2xl", "bg-white", "print-scale-reset"], [3, "jobs", "options"], [1, "fixed", "inset-0", "bg-slate-900/70", "backdrop-blur-sm", "flex", "items-center", "justify-center", "z-[150]", "p-4", "fade-in", 3, "click"], [1, "relative", "bg-white", "dark:bg-slate-900", "shadow-2xl", "overflow-hidden", "flex", "flex-col", "border", "border-slate-200/50", "dark:border-slate-800", "transition-all", "duration-300", "ease-out", 3, "click"], [1, "bg-gradient-to-r", "from-slate-900", "via-indigo-950", "to-slate-900", "text-white", "px-4", "py-2", "flex", "flex-col", "sm:flex-row", "sm:items-center", "justify-between", "shrink-0", "border-b", "border-indigo-500/20", "shadow-md", "gap-3"], [1, "flex", "items-center", "gap-2.5", "min-w-0"], [1, "w-8", "h-8", "rounded-lg", "bg-red-500/10", "flex", "items-center", "justify-center", "border", "border-red-500/20", "shrink-0"], [1, "fa-solid", "fa-file-pdf", "text-red-400", "text-sm"], [1, "min-w-0", "flex", "flex-col", "gap-0.5"], [1, "flex", "items-center", "gap-2", "flex-wrap", "min-w-0"], [1, "text-[9px]", "font-extrabold", "px-1.5", "py-0.5", "rounded", "bg-indigo-500/20", "text-indigo-300", "border", "border-indigo-500/30", "uppercase", "tracking-wider", "shrink-0"], [1, "text-xs", "sm:text-sm", "font-extrabold", "m-0", "tracking-tight", "text-white", "truncate", "max-w-[200px]", "sm:max-w-[300px]", "md:max-w-[450px]", 3, "title"], [1, "flex", "items-center", "gap-2", "text-[10px]", "text-slate-455", "flex-wrap"], [1, "flex", "items-center", "gap-1.5", "flex-wrap", "sm:flex-nowrap", "justify-end", "shrink-0"], ["target", "_blank", "rel", "noopener noreferrer", "title", "M\u1EDF Google Docs", 1, "px-2.5", "py-1.5", "text-xs", "font-bold", "text-white", "bg-slate-800", "hover:bg-slate-700", "rounded-lg", "transition-all", "duration-150", "flex", "items-center", "gap-1.5", "no-underline", "active:scale-95", "shadow-sm", "cursor-pointer", "border", "border-slate-700", 3, "href"], ["title", "In t\u00E0i li\u1EC7u", 1, "px-2.5", "py-1.5", "text-xs", "font-bold", "text-slate-200", "bg-white/10", "hover:bg-white/20", "disabled:opacity-55", "rounded-lg", "transition-all", "duration-150", "flex", "items-center", "gap-1.5", "active:scale-95", "border-none", "cursor-pointer", 3, "click", "disabled"], ["title", "T\u1EA3i PDF xu\u1ED1ng", 1, "px-2.5", "py-1.5", "text-xs", "font-bold", "text-slate-200", "bg-white/10", "hover:bg-white/20", "disabled:opacity-55", "rounded-lg", "transition-all", "duration-150", "flex", "items-center", "gap-1.5", "active:scale-95", "border-none", "cursor-pointer", 3, "click", "disabled"], ["title", "Sao ch\u00E9p li\u00EAn k\u1EBFt PDF", 1, "px-2.5", "py-1.5", "text-xs", "font-bold", "text-slate-200", "bg-white/10", "hover:bg-white/20", "rounded-lg", "transition-all", "duration-150", "flex", "items-center", "gap-1.5", "active:scale-95", "border-none", "cursor-pointer", 3, "click"], [1, "fa-solid"], [1, "hidden", "md:inline"], [1, "inline", "md:hidden"], [1, "h-5", "w-[1px]", "bg-white/20", "mx-0.5", "hidden", "sm:block"], [1, "w-8", "h-8", "rounded-lg", "hover:bg-white/10", "text-white/80", "hover:text-white", "flex", "items-center", "justify-center", "transition", "active:scale-95", "border-none", "cursor-pointer", 3, "click", "title"], ["title", "\u0110\u00F3ng xem tr\u01B0\u1EDBc", 1, "w-8", "h-8", "rounded-lg", "hover:bg-white/10", "text-white/80", "hover:text-white", "flex", "items-center", "justify-center", "transition", "active:scale-95", "border", "border-white/10", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-xmark", "text-base"], [1, "flex-1", "bg-slate-100", "dark:bg-slate-950", "relative"], [1, "absolute", "inset-0", "bg-slate-900/70", "backdrop-blur-sm", "flex", "flex-col", "items-center", "justify-center", "text-white", "gap-3", "z-50", "animate-in", "fade-in", "duration-200"], [1, "w-full", "h-full", "flex", "flex-col", "items-center", "justify-center", "text-slate-400", "gap-3", "p-4"], [1, "w-full", "h-full", "flex", "flex-col", "items-center", "justify-center", "text-slate-400", "gap-4", "p-6"], [1, "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-code-branch", "text-fuchsia-400"], [1, "text-slate-350"], [1, "text-slate-650", "font-bold", "hidden", "sm:inline"], [1, "fa-solid", "fa-user", "text-indigo-350"], [1, "text-slate-300", "font-semibold"], [1, "text-slate-650", "font-bold", "hidden", "md:inline"], [1, "flex", "items-center", "gap-1", "hidden", "md:inline-flex"], [1, "fa-solid", "fa-clock", "text-blue-400"], [1, "text-slate-300"], [1, "fa-solid", "fa-file-word", "text-blue-400"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-indigo-400"], [1, "fa-solid", "fa-print"], [1, "fa-solid", "fa-download"], [1, "fa-solid", "fa-arrows-rotate", "fa-spin", "text-4xl", "text-indigo-400"], [1, "text-xs", "font-bold", "uppercase", "tracking-widest", "text-indigo-200"], [1, "text-[10px]", "text-slate-400"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-4xl", "text-indigo-500"], [1, "text-sm", "font-bold", "uppercase", "tracking-wider", "text-slate-650", "dark:text-slate-355"], [1, "w-full", "h-full", "flex", "items-center", "justify-center", "overflow-auto", "bg-slate-950", "p-4"], [1, "w-full", "h-full", "border-none", "rounded-b-2xl", "bg-white", 3, "src"], [1, "max-w-full", "max-h-full", "object-contain", "shadow-2xl", "rounded-lg", "animate-in", "zoom-in-95", "duration-200", 3, "src"], [1, "w-16", "h-16", "rounded-2xl", "bg-amber-500/10", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-triangle-exclamation", "text-2xl", "text-amber-500"], [1, "text-center"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "mb-1"], [1, "text-xs", "text-slate-500", "max-w-xs", "leading-relaxed"], [1, "px-5", "py-2.5", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-xs", "font-bold", "rounded-xl", "transition", "flex", "items-center", "gap-2", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-rotate-right"], [1, "text-[11px]", "text-slate-400"], [1, "text-indigo-500"]], template: function PrintPreviewModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, PrintPreviewModalComponent_Conditional_0_Template, 50, 11, "div", 0)(1, PrintPreviewModalComponent_Conditional_1_Template, 37, 38, "div", 1);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.printService.isPreviewOpen() ? 0 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.printService.isPreviewPdfOpen() ? 1 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.CheckboxControlValueAccessor, i1.NgControlStatus, i1.NgModel, PrintLayoutComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PrintPreviewModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-print-preview-modal',
                standalone: true,
                imports: [CommonModule, FormsModule, PrintLayoutComponent],
                template: `
    <!-- Chế Độ 1: Xem trước & In ấn Phiếu chạy A4 Cục bộ -->
    @if (printService.isPreviewOpen()) {
        <div class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 fade-in print-modal-overlay" (click)="close()">
            <div class="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-bounce-in relative print-modal-content" (click)="$event.stopPropagation()">
                
                <!-- HEADER (Hidden when printing) -->
                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 z-10 print-hidden-ui">
                    <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-print text-indigo-600"></i> Xem Trước khi In (A4 Preview)
                    </h3>
                    <div class="flex gap-2">
                        <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                            <button (click)="zoomOut()" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition text-slate-600"><i class="fa-solid fa-minus"></i></button>
                            <span class="text-xs font-bold w-10 text-center">{{zoomLevel()}}%</span>
                            <button (click)="zoomIn()" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition text-slate-600"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <button (click)="close()" class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times text-xl"></i></button>
                    </div>
                </div>

                <!-- BODY (Split Layout) -->
                <div class="flex-1 flex overflow-hidden">
                    
                    <!-- LEFT: Config Panel (Hidden when printing) -->
                    <div class="w-72 bg-slate-50 border-r border-slate-200 p-5 flex flex-col gap-6 overflow-y-auto shrink-0 print-hidden-ui">
                        
                        <!-- Toggle Options -->
                        <div class="space-y-3">
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Tùy Chọn Hiển Thị</h4>
                            
                            <label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition">
                                <span class="text-sm font-bold text-slate-700">Tiêu đề (Header)</span>
                                <input type="checkbox" [(ngModel)]="options.showHeader" class="w-5 h-5 accent-indigo-600 rounded">
                            </label>

                            <label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition">
                                <span class="text-sm font-bold text-slate-700">Chân trang (Footer)</span>
                                <input type="checkbox" [(ngModel)]="options.showFooter" class="w-5 h-5 accent-indigo-600 rounded">
                            </label>

                            <label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition">
                                <span class="text-sm font-bold text-slate-700">Ký tên điện tử</span>
                                <input type="checkbox" [(ngModel)]="options.showSignature" class="w-5 h-5 accent-indigo-600 rounded">
                            </label>

                            <label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition">
                                <span class="text-sm font-bold text-slate-700">Đường cắt (Cut line)</span>
                                <input type="checkbox" [(ngModel)]="options.showCutLine" class="w-5 h-5 accent-indigo-600 rounded">
                            </label>
                        </div>

                        <div class="mt-auto pt-6 border-t border-slate-200 flex flex-col gap-3">
                            <button (click)="doPrint()" 
                                    class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                                <i class="fa-solid fa-print text-lg"></i>
                                <span>IN NGAY (Direct)</span>
                            </button>
                            
                            <button (click)="doPdf()" [disabled]="isGeneratingPdf()"
                                    class="w-full py-3 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50">
                                @if(isGeneratingPdf()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                                @else { <i class="fa-solid fa-file-pdf"></i> }
                                <span>Tải PDF (High-Res)</span>
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT: Preview Canvas -->
                    <div class="flex-1 bg-slate-200 overflow-auto flex justify-center p-8 relative custom-scrollbar print-scale-reset">
                        <div id="print-area" class="origin-top transition-transform duration-200 ease-out shadow-2xl bg-white print-scale-reset"
                             [style.transform]="'scale(' + (zoomLevel()/100) + ')'">
                             <app-print-layout [jobs]="printService.previewJobs()" [options]="options"></app-print-layout>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    <!-- Chế Độ 2: Trình Quản Lý & Xem Báo Cáo PDF Drive (Cloud PDF Viewer) -->
    @if (printService.isPreviewPdfOpen()) {
        <div class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[150] p-4 fade-in" (click)="closePdfModal()">
            <div class="relative bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col border border-slate-200/50 dark:border-slate-800 transition-all duration-300 ease-out"
                [class.w-full]="isFullscreen()" [class.h-full]="isFullscreen()" [class.max-w-none]="isFullscreen()" [class.rounded-none]="isFullscreen()"
                [class.max-w-6xl]="!isFullscreen()" [class.w-full]="!isFullscreen()" [class.h-[90vh]]="!isFullscreen()" [class.rounded-2xl]="!isFullscreen()"
                (click)="$event.stopPropagation()">
                
                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between shrink-0 border-b border-indigo-500/20 shadow-md gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div class="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                            <i class="fa-solid fa-file-pdf text-red-400 text-sm"></i>
                        </div>
                        <div class="min-w-0 flex flex-col gap-0.5">
                            <div class="flex items-center gap-2 flex-wrap min-w-0">
                                <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider shrink-0">
                                    {{ printService.pdfVersion() === 0 ? 'CoA' : 'Báo cáo' }}
                                </span>
                                <h4 class="text-xs sm:text-sm font-extrabold m-0 tracking-tight text-white truncate max-w-[200px] sm:max-w-[300px] md:max-w-[450px]" [title]="printService.pdfTitle()">
                                    {{ printService.pdfTitle() }}
                                </h4>
                            </div>
                            
                            @if (printService.pdfVersion() > 0) {
                                <div class="flex items-center gap-2 text-[10px] text-slate-455 flex-wrap">
                                    <span class="flex items-center gap-1">
                                        <i class="fa-solid fa-code-branch text-fuchsia-400"></i>
                                        <span class="text-slate-350">v{{ printService.pdfVersion() }}</span>
                                    </span>
                                    <span class="text-slate-650 font-bold hidden sm:inline">•</span>
                                    <span class="flex items-center gap-1">
                                        <i class="fa-solid fa-user text-indigo-350"></i>
                                        <span class="text-slate-300 font-semibold">{{ printService.pdfAnalyst() }}</span>
                                    </span>
                                    @if (printService.pdfPublishDate()) {
                                        <span class="text-slate-650 font-bold hidden md:inline">•</span>
                                        <span class="flex items-center gap-1 hidden md:inline-flex">
                                            <i class="fa-solid fa-clock text-blue-400"></i>
                                            <span class="text-slate-300">{{ formatPublishDate(printService.pdfPublishDate()) }}</span>
                                        </span>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    
                    <!-- Right Side Actions -->
                    <div class="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end shrink-0">
                        <!-- Google Docs Button -->
                        @if (printService.docsUrl()) {
                            <a [href]="printService.docsUrl()" target="_blank" rel="noopener noreferrer"
                               class="px-2.5 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-150 flex items-center gap-1.5 no-underline active:scale-95 shadow-sm cursor-pointer border border-slate-700"
                               title="Mở Google Docs">
                                <i class="fa-solid fa-file-word text-blue-400"></i>
                                <span class="hidden md:inline">GOOGLE DOCS</span>
                                <span class="inline md:hidden">Docs</span>
                            </a>
                        }

                        <!-- Print Button -->
                        <button (click)="printPdf()" [disabled]="printService.isPrinting()"
                                class="px-2.5 py-1.5 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 disabled:opacity-55 rounded-lg transition-all duration-150 flex items-center gap-1.5 active:scale-95 border-none cursor-pointer"
                                title="In tài liệu">
                            @if (printService.isPrinting()) {
                                <i class="fa-solid fa-circle-notch fa-spin text-indigo-400"></i>
                                <span>ĐANG IN...</span>
                            } @else {
                                <i class="fa-solid fa-print"></i>
                                <span class="hidden md:inline">IN NHANH</span>
                                <span class="inline md:hidden">In</span>
                            }
                        </button>

                        <!-- Download Button -->
                        <button (click)="downloadPdf()" [disabled]="printService.isDownloading()"
                                class="px-2.5 py-1.5 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 disabled:opacity-55 rounded-lg transition-all duration-150 flex items-center gap-1.5 active:scale-95 border-none cursor-pointer"
                                title="Tải PDF xuống">
                            @if (printService.isDownloading()) {
                                <i class="fa-solid fa-circle-notch fa-spin text-indigo-400"></i>
                                <span>ĐANG TẢI...</span>
                            } @else {
                                <i class="fa-solid fa-download"></i>
                                <span class="hidden md:inline">TẢI TÀI LIỆU</span>
                                <span class="inline md:hidden">Tải File</span>
                            }
                        </button>

                        <!-- Copy Link Button -->
                        <button (click)="copyPdfLink()" 
                                class="px-2.5 py-1.5 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-150 flex items-center gap-1.5 active:scale-95 border-none cursor-pointer"
                                title="Sao chép liên kết PDF">
                            <i class="fa-solid" [class.fa-copy]="!isCopying()" [class.fa-check]="isCopying()"></i>
                            <span class="hidden md:inline">{{ isCopying() ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP LINK' }}</span>
                            <span class="inline md:hidden">{{ isCopying() ? 'Đã sao chép' : 'Sao chép' }}</span>
                        </button>

                        <div class="h-5 w-[1px] bg-white/20 mx-0.5 hidden sm:block"></div>

                        <!-- Maximize Toggle Button -->
                        <button (click)="toggleFullscreen()" 
                                class="w-8 h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition active:scale-95 border-none cursor-pointer"
                                [title]="isFullscreen() ? 'Thu nhỏ cửa sổ' : 'Phóng to cửa sổ'">
                            <i class="fa-solid" [class.fa-expand]="!isFullscreen()" [class.fa-compress]="isFullscreen()"></i>
                        </button>

                        <!-- Close Button -->
                        <button (click)="closePdfModal()" 
                                class="w-8 h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition active:scale-95 border border-white/10 cursor-pointer"
                                title="Đóng xem trước">
                            <i class="fa-solid fa-xmark text-base"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Modal Body -->
                <div class="flex-1 bg-slate-100 dark:bg-slate-950 relative">
                    <!-- Inline loading overlay when recreating a report from inside the modal -->
                    @if (isPublishing()) {
                        <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-3 z-50 animate-in fade-in duration-200">
                            <i class="fa-solid fa-arrows-rotate fa-spin text-4xl text-indigo-400"></i>
                            <span class="text-xs font-bold uppercase tracking-widest text-indigo-200">Đang tạo lại bản báo cáo v{{ printService.pdfVersion() + 1 }}...</span>
                            <span class="text-[10px] text-slate-400">Vui lòng đợi trong giây lát, bảng xem trước sẽ tự cập nhật.</span>
                        </div>
                    }

                    @if (printService.isPdfBlobLoading()) {
                        <div class="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3 p-4">
                            <i class="fa-solid fa-spinner fa-spin text-4xl text-indigo-500"></i>
                            <span class="text-sm font-bold uppercase tracking-wider text-slate-650 dark:text-slate-355">Đang tải tài liệu từ Drive...</span>
                        </div>
                    } @else if (pdfModalSafeUrl()) {
                        @if (printService.pdfPreviewType() === 'image') {
                            <div class="w-full h-full flex items-center justify-center overflow-auto bg-slate-950 p-4">
                                <img [src]="rawPdfUrl()" class="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-200">
                            </div>
                        } @else {
                            <iframe [src]="pdfModalSafeUrl()" class="w-full h-full border-none rounded-b-2xl bg-white"></iframe>
                        }
                    } @else {
                        <div class="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4 p-6">
                            <div class="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <i class="fa-solid fa-triangle-exclamation text-2xl text-amber-500"></i>
                            </div>
                            <div class="text-center">
                                <p class="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Cần xác thực Google Drive</p>
                                <p class="text-xs text-slate-500 max-w-xs leading-relaxed">
                                    Phiên xác thực đã hết hạn. Nhấn nút bên dưới để đăng nhập lại.
                                </p>
                            </div>
                            <button (click)="retryLoadBlob()"
                                    class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 active:scale-95">
                                <i class="fa-solid fa-rotate-right"></i>
                                <span>Xác Thực & Tải Lại</span>
                            </button>
                            <p class="text-[11px] text-slate-400">
                                Hoặc nhấn <strong class="text-indigo-500">TẢI TÀI LIỆU</strong> / <strong class="text-indigo-500">GOOGLE DOCS</strong> ở trên.
                            </p>
                        </div>
                    }
                </div>
            </div>
        </div>
    }
  `
            }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PrintPreviewModalComponent, { className: "PrintPreviewModalComponent", filePath: "src/app/shared/components/print-preview-modal/print-preview-modal.component.ts", lineNumber: 260 }); })();
//# sourceMappingURL=print-preview-modal.component.js.map