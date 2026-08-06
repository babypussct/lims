import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { formatSampleList } from '../../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _forTrack0 = ($index, $item) => $item.id;
function _forTrack1($index, $item) { return this.historyTrackKey($item); }
function ReportHubModalComponent_Conditional_0_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 13);
    i0.ɵɵelement(1, "i", 34);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" C\u00F2n ", ctx_r1.missingSamples().length, " m\u1EABu thi\u1EBFu ");
} }
function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 50);
    i0.ɵɵlistener("click", function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_13_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const card_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.triggerPreviewPdf(card_r4.pdfViewUrl || card_r4.pdfUrl || "", card_r4.docsUrl || undefined, card_r4.prefix, card_r4.version, card_r4.publishedBy, card_r4.publishedAt)); });
    i0.ɵɵelement(1, "i", 51);
    i0.ɵɵelementEnd();
} }
function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 45);
    i0.ɵɵelement(1, "i", 52);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const card_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("href", ctx_r1.getSafeGoogleUrl(card_r4.docsUrl), i0.ɵɵsanitizeUrl);
} }
function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_18_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 53);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sample_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(sample_r6);
} }
function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵrepeaterCreate(0, ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_18_For_1_Template, 2, 1, "span", 53, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementStart(2, "button", 54);
    i0.ɵɵlistener("click", function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_18_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r5); i0.ɵɵnextContext(); const chipKey_r7 = i0.ɵɵreadContextLet(17); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleChipExpand(chipKey_r7)); });
    i0.ɵɵtext(3, " Thu g\u1ECDn ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const card_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵrepeater(card_r4.samples);
} }
function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_19_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 53);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sample_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(sample_r8);
} }
function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_19_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 56);
    i0.ɵɵlistener("click", function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_19_Conditional_3_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); i0.ɵɵnextContext(2); const chipKey_r7 = i0.ɵɵreadContextLet(17); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleChipExpand(chipKey_r7)); });
    i0.ɵɵtext(1, " Chi ti\u1EBFt ");
    i0.ɵɵelementEnd();
} }
function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdeclareLet(0);
    i0.ɵɵrepeaterCreate(1, ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_19_For_2_Template, 2, 1, "span", 53, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵtemplate(3, ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_19_Conditional_3_Template, 2, 0, "button", 55);
} if (rf & 2) {
    const card_r4 = i0.ɵɵnextContext().$implicit;
    const shortSamples_r10 = i0.ɵɵnextContext(3).getShortenedSampleChips(card_r4.samples);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(shortSamples_r10.slice(0, 5));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(shortSamples_r10.length > 5 || card_r4.samples.length > shortSamples_r10.length ? 3 : -1);
} }
function ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 36)(1, "div", 37)(2, "div", 7)(3, "div", 38)(4, "span", 39);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 40);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "h4", 41);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 42);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 43);
    i0.ɵɵtemplate(13, ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_13_Template, 2, 0, "button", 44)(14, ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_14_Template, 2, 1, "a", 45);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 46)(16, "div", 47);
    i0.ɵɵdeclareLet(17);
    i0.ɵɵtemplate(18, ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_18_Template, 4, 0)(19, ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Conditional_19_Template, 4, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 48)(21, "div", 49);
    i0.ɵɵtext(22);
    i0.ɵɵpipe(23, "date");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const card_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("border-indigo-200", card_r4.kind === "all")("dark:border-indigo-900", card_r4.kind === "all")("border-fuchsia-200", card_r4.kind === "group")("dark:border-fuchsia-900", card_r4.kind === "group");
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("bg-indigo-50", card_r4.kind === "all")("text-indigo-700", card_r4.kind === "all")("border-indigo-200", card_r4.kind === "all")("dark:bg-indigo-950", card_r4.kind === "all")("dark:text-indigo-300", card_r4.kind === "all")("dark:border-indigo-900", card_r4.kind === "all")("bg-fuchsia-50", card_r4.kind === "group")("text-fuchsia-700", card_r4.kind === "group")("border-fuchsia-200", card_r4.kind === "group")("dark:bg-fuchsia-950", card_r4.kind === "group")("dark:text-fuchsia-300", card_r4.kind === "group")("dark:border-fuchsia-900", card_r4.kind === "group");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", card_r4.kind === "all" ? "To\u00E0n m\u1EBB" : "Theo nh\u00F3m m\u1EABu", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("v", card_r4.version || 1, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", card_r4.samples.join("; "));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", card_r4.title, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", card_r4.subtitle, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(card_r4.pdfViewUrl || card_r4.pdfUrl ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(card_r4.docsUrl ? 14 : -1);
    i0.ɵɵadvance(3);
    const chipKey_r11 = i0.ɵɵstoreLet("card_" + card_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.expandedChipKeys()[chipKey_r11] ? 18 : 19);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", card_r4.publishedAt ? i0.ɵɵpipeBind2(23, 42, card_r4.publishedAt, "HH:mm dd/MM/yy") : "Ch\u01B0a r\u00F5 ng\u00E0y t\u1EA1o", " ");
} }
function ReportHubModalComponent_Conditional_0_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵrepeaterCreate(1, ReportHubModalComponent_Conditional_0_Conditional_26_For_2_Template, 24, 45, "div", 35, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.reportCards());
} }
function ReportHubModalComponent_Conditional_0_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 21);
    i0.ɵɵelement(1, "i", 57);
    i0.ɵɵelementStart(2, "div", 58);
    i0.ɵɵtext(3, "M\u1EBB n\u00E0y ch\u01B0a c\u00F3 b\u00E1o c\u00E1o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 59);
    i0.ɵɵtext(5, "M\u1EDF m\u00E0n h\u00ECnh nh\u1EADp k\u1EBFt qu\u1EA3 \u0111\u1EC3 t\u1EA1o b\u1EA3n in \u0111\u1EA7u ti\u00EAn.");
    i0.ɵɵelementEnd()();
} }
function ReportHubModalComponent_Conditional_0_Conditional_28_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 63);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sample_r12 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(sample_r12);
} }
function ReportHubModalComponent_Conditional_0_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 22)(1, "div")(2, "div")(3, "div", 60);
    i0.ɵɵtext(4, "M\u1EABu ch\u01B0a c\u00F3 b\u00E1o c\u00E1o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 61);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(7, "div", 62);
    i0.ɵɵrepeaterCreate(8, ReportHubModalComponent_Conditional_0_Conditional_28_For_9_Template, 2, 1, "span", 63, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("", ctx_r1.missingSamples().length, " m\u1EABu ch\u01B0a \u0111\u01B0\u1EE3c ph\u1EE7 b\u1EDFi b\u00E1o c\u00E1o hi\u1EC7n h\u00E0nh. V\u00E0o m\u00E0n h\u00ECnh nh\u1EADp k\u1EBFt qu\u1EA3 \u0111\u1EC3 ch\u1ECDn ch\u00EDnh x\u00E1c ph\u1EA1m vi xu\u1EA5t b\u1EA3n.");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.missingSamples());
} }
function ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 64);
    i0.ɵɵelement(1, "i", 67);
    i0.ɵɵelementStart(2, "span", 68);
    i0.ɵɵtext(3, "\u0110ang t\u1EA3i l\u1ECBch s\u1EED...");
    i0.ɵɵelementEnd()();
} }
function ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_For_2_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 73);
    i0.ɵɵtext(1, "L\u01B0u tr\u1EEF");
    i0.ɵɵelementEnd();
} }
function ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_For_2_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 78);
    i0.ɵɵlistener("click", function ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_For_2_Conditional_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const hist_r14 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.triggerPreviewPdf(hist_r14.pdfViewUrl || hist_r14.pdfUrl, hist_r14.docsUrl, hist_r14.prefix === "_NO_PREFIX_" ? "" : hist_r14.prefix, hist_r14.version, hist_r14.publishedBy, hist_r14.publishedAt)); });
    i0.ɵɵelement(1, "i", 79);
    i0.ɵɵelementEnd();
} }
function ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_For_2_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 77);
    i0.ɵɵelement(1, "i", 80);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const hist_r14 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("href", ctx_r1.getSafeGoogleUrl(hist_r14.docsUrl), i0.ɵɵsanitizeUrl);
} }
function ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "div", 69)(2, "div", 7)(3, "div", 70)(4, "span", 71);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 72);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_For_2_Conditional_8_Template, 2, 0, "span", 73);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 74);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 75);
    i0.ɵɵtext(12);
    i0.ɵɵpipe(13, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 43);
    i0.ɵɵtemplate(15, ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_For_2_Conditional_15_Template, 2, 0, "button", 76)(16, ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_For_2_Conditional_16_Template, 2, 1, "a", 77);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const hist_r14 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    const samples_r15 = ctx_r1.getSampleChipsForReport(hist_r14, hist_r14.prefix || "ALL");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("v", hist_r14.version || 1, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.getHistoryKindLabel(hist_r14.prefix), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(hist_r14.status === "archived" ? 8 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", samples_r15.length > 0 ? ctx_r1.formatSamples(samples_r15) : "Ch\u01B0a r\u00F5 m\u1EABu", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", hist_r14.publishedBy || hist_r14.updatedBy || "Ch\u01B0a r\u00F5", " \u00B7 ", i0.ɵɵpipeBind2(13, 8, hist_r14.publishedAt, "HH:mm dd/MM/yy"), "");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(hist_r14.pdfViewUrl || hist_r14.pdfUrl ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(hist_r14.docsUrl ? 16 : -1);
} }
function ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 65);
    i0.ɵɵrepeaterCreate(1, ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_For_2_Template, 17, 11, "div", 69, _forTrack1, true);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.historyList);
} }
function ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 66);
    i0.ɵɵtext(1, " Kh\u00F4ng c\u00F3 b\u1EA3n in c\u0169 trong l\u1ECBch s\u1EED. ");
    i0.ɵɵelementEnd();
} }
function ReportHubModalComponent_Conditional_0_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 29);
    i0.ɵɵtemplate(1, ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_1_Template, 4, 0, "div", 64)(2, ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_2_Template, 3, 0, "div", 65)(3, ReportHubModalComponent_Conditional_0_Conditional_37_Conditional_3_Template, 2, 0, "div", 66);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isLoadingHistory ? 1 : ctx_r1.historyList.length > 0 ? 2 : 3);
} }
function ReportHubModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5);
    i0.ɵɵelement(6, "i", 6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 7)(8, "h3", 8);
    i0.ɵɵtext(9, "Trung T\u00E2m B\u00E1o C\u00E1o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 9);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 10)(13, "span", 11);
    i0.ɵɵelement(14, "i", 12);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(16, ReportHubModalComponent_Conditional_0_Conditional_16_Template, 3, 1, "span", 13);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "button", 14);
    i0.ɵɵlistener("click", function ReportHubModalComponent_Conditional_0_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal()); });
    i0.ɵɵelement(18, "i", 15);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(19, "div", 16)(20, "div", 17)(21, "div")(22, "div", 18);
    i0.ɵɵtext(23, "B\u00E1o c\u00E1o hi\u1EC7n h\u00E0nh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "div", 19);
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(26, ReportHubModalComponent_Conditional_0_Conditional_26_Template, 3, 0, "div", 20)(27, ReportHubModalComponent_Conditional_0_Conditional_27_Template, 6, 0, "div", 21)(28, ReportHubModalComponent_Conditional_0_Conditional_28_Template, 10, 1, "div", 22);
    i0.ɵɵelementStart(29, "div", 23)(30, "button", 24);
    i0.ɵɵlistener("click", function ReportHubModalComponent_Conditional_0_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleHistory()); });
    i0.ɵɵelementStart(31, "span", 25);
    i0.ɵɵelement(32, "i", 26);
    i0.ɵɵtext(33, "L\u1ECBch s\u1EED b\u1EA3n in ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "span", 27);
    i0.ɵɵtext(35);
    i0.ɵɵelement(36, "i", 28);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(37, ReportHubModalComponent_Conditional_0_Conditional_37_Template, 4, 1, "div", 29);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(38, "div", 30)(39, "button", 31);
    i0.ɵɵlistener("click", function ReportHubModalComponent_Conditional_0_Template_button_click_39_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.triggerCreateReport(undefined)); });
    i0.ɵɵelement(40, "i", 32);
    i0.ɵɵtext(41, " M\u1EDF nh\u1EADp k\u1EBFt qu\u1EA3 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "button", 33);
    i0.ɵɵlistener("click", function ReportHubModalComponent_Conditional_0_Template_button_click_42_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal()); });
    i0.ɵɵtext(43, " \u0110\u00F3ng ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.run == null ? null : ctx_r1.run.sopName, " \u00B7 ", (ctx_r1.run == null ? null : ctx_r1.run.inputs == null ? null : ctx_r1.run.inputs["batchCode"]) || (ctx_r1.run == null ? null : ctx_r1.run.id), " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.coveredSamples().length, "/", ctx_r1.allSamples().length, " m\u1EABu \u0111\u00E3 c\u00F3 b\u00E1o c\u00E1o ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.missingSamples().length > 0 ? 16 : -1);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.reportCards().length > 0 ? ctx_r1.reportCards().length + " b\u1EA3n in \u0111ang kh\u1EA3 d\u1EE5ng" : "Ch\u01B0a c\u00F3 b\u1EA3n in n\u00E0o cho m\u1EBB n\u00E0y", " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.reportCards().length > 0 ? 26 : 27);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.missingSamples().length > 0 ? 28 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.historyList.length, " phi\u00EAn b\u1EA3n ");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-chevron-down", !ctx_r1.showHistory())("fa-chevron-up", ctx_r1.showHistory());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showHistory() ? 37 : -1);
} }
export class ReportHubModalComponent {
    constructor() {
        this.isOpen = false;
        this.run = null;
        this.historyList = [];
        this.isLoadingHistory = false;
        this.runStatus = '';
        this.close = new EventEmitter();
        this.createReport = new EventEmitter();
        this.previewPdf = new EventEmitter();
        this.sanitizer = inject(DomSanitizer);
        this.expandedChipKeys = signal({});
        this.showHistory = signal(false);
    }
    closeModal() {
        this.close.emit();
    }
    triggerCreateReport(prefix) {
        if (this.run) {
            this.createReport.emit({ requestId: this.run.id, prefix });
        }
    }
    triggerPreviewPdf(pdfUrl, docsUrl, prefix, version, publishedBy, publishedAt) {
        this.previewPdf.emit({ pdfUrl, docsUrl, prefix, version, publishedBy, publishedAt });
    }
    getSafeGoogleUrl(docsUrl) {
        return this.sanitizer.bypassSecurityTrustUrl(docsUrl.replace(/\/edit.*$/, '/preview'));
    }
    toggleChipExpand(key) {
        this.expandedChipKeys.update(keys => ({
            ...keys,
            [key]: !keys[key]
        }));
    }
    toggleHistory() {
        this.showHistory.update(value => !value);
    }
    allSamples() {
        return this.sortSamples(this.run?.sampleList || []);
    }
    reportCards() {
        const cards = [];
        const summary = this.run?.analysisResultSummary || {};
        const legacy = this.run?.analysisResult || {};
        const allPdfUrl = summary.pdfUrl || legacy.pdfUrl || null;
        const allPdfViewUrl = summary.pdfViewUrl || legacy.pdfViewUrl || null;
        const allDocsUrl = summary.docsUrl || legacy.docsUrl || null;
        if (allPdfUrl || allPdfViewUrl || allDocsUrl) {
            const allReport = {
                includedSamples: summary.includedSamples || legacy.includedSamples,
                samples: summary.samples || legacy.samples
            };
            const samples = this.getSampleChipsForReport(allReport, 'ALL');
            cards.push({
                id: 'current_all',
                kind: 'all',
                prefix: 'ALL',
                title: this.formatSamples(samples),
                subtitle: `Toàn mẻ · ${samples.length} mẫu`,
                samples,
                version: summary.version || legacy.version || 1,
                pdfUrl: allPdfUrl,
                pdfViewUrl: allPdfViewUrl,
                docsUrl: allDocsUrl,
                publishedAt: summary.pdfCreatedAt || summary.updatedAt || legacy.pdfCreatedAt || this.run?.updatedAt,
                publishedBy: summary.updatedBy || legacy.updatedBy || this.run?.user
            });
        }
        const reports = summary.reports || legacy.reports || {};
        for (const [key, rawReport] of Object.entries(reports)) {
            const report = rawReport;
            if (!report || !(report.pdfUrl || report.pdfViewUrl || report.docsUrl))
                continue;
            const prefixKey = report.prefix || key;
            const normalizedPrefix = prefixKey === '_NO_PREFIX_' ? '' : prefixKey;
            const samples = this.getSampleChipsForReport(report, prefixKey);
            cards.push({
                id: report.id || key,
                kind: 'group',
                prefix: normalizedPrefix,
                title: this.formatSamples(samples),
                subtitle: `${normalizedPrefix === '' ? 'Không tiền tố' : 'Nhóm ' + normalizedPrefix} · ${samples.length} mẫu`,
                samples,
                version: report.version || 1,
                pdfUrl: report.pdfUrl,
                pdfViewUrl: report.pdfViewUrl,
                docsUrl: report.docsUrl,
                publishedAt: report.pdfCreatedAt || report.publishedAt,
                publishedBy: report.publishedBy,
                status: report.status
            });
        }
        return cards.sort((a, b) => {
            if (a.kind !== b.kind)
                return a.kind === 'all' ? -1 : 1;
            const aFirst = a.samples[0] || '';
            const bFirst = b.samples[0] || '';
            const sampleOrder = aFirst.localeCompare(bFirst, undefined, { numeric: true, sensitivity: 'base' });
            if (sampleOrder !== 0)
                return sampleOrder;
            return (b.version || 0) - (a.version || 0);
        });
    }
    coveredSamples() {
        const covered = new Set();
        for (const card of this.reportCards()) {
            card.samples.forEach(sample => covered.add(sample));
        }
        return this.sortSamples(Array.from(covered));
    }
    missingSamples() {
        const covered = new Set(this.coveredSamples());
        return this.allSamples().filter(sample => !covered.has(sample));
    }
    getSampleChipsForReport(reportObj, prefixKey) {
        if (!reportObj)
            return [];
        if (Array.isArray(reportObj.includedSamples) && reportObj.includedSamples.length > 0) {
            return this.sortSamples(reportObj.includedSamples);
        }
        if (reportObj.samples && typeof reportObj.samples === 'object') {
            const samples = Object.keys(reportObj.samples).filter(key => reportObj.samples[key]?.included !== false);
            if (samples.length > 0)
                return this.sortSamples(samples);
        }
        if (!this.run?.sampleList)
            return [];
        if (!prefixKey || prefixKey === 'ALL')
            return this.allSamples();
        const normalizedPrefix = prefixKey === '_NO_PREFIX_' ? '' : prefixKey;
        return this.allSamples().filter(sample => this.samplePrefix(sample) === normalizedPrefix);
    }
    getShortenedSampleChips(samples) {
        if (!samples || samples.length === 0)
            return [];
        const sorted = this.sortSamples(samples);
        const result = [];
        let i = 0;
        while (i < sorted.length) {
            const start = sorted[i];
            let j = i;
            while (j + 1 < sorted.length && this.isSequential(sorted[j], sorted[j + 1])) {
                j++;
            }
            if (j > i) {
                result.push(`${start} -> ${sorted[j]}`);
            }
            else {
                result.push(start);
            }
            i = j + 1;
        }
        return result;
    }
    formatSamples(samples) {
        return formatSampleList(samples) || 'Chưa rõ mẫu';
    }
    historyTrackKey(hist) {
        return `${hist.version || 'v'}_${hist.reportId || hist.prefix || 'all'}_${hist.publishedAt || hist.pdfFileName || ''}`;
    }
    getHistoryKindLabel(prefix) {
        if (!prefix || prefix === 'ALL')
            return 'Toàn mẻ';
        return prefix === '_NO_PREFIX_' ? 'Không tiền tố' : `Nhóm ${prefix}`;
    }
    samplePrefix(sample) {
        const startsWithLetter = /^[a-zA-Z]/.test(sample);
        return startsWithLetter ? sample.charAt(0).toUpperCase() : '';
    }
    sortSamples(samples) {
        return [...(samples || [])].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    }
    isSequential(s1, s2) {
        const p1 = this.parseSample(s1);
        const p2 = this.parseSample(s2);
        if (!p1 || !p2)
            return false;
        if (p1.prefix !== p2.prefix)
            return false;
        if (p1.suffix !== p2.suffix)
            return false;
        return p1.num + 1 === p2.num;
    }
    parseSample(sample) {
        const match = sample.match(/^([A-Za-z]*)(\d+)(.*)$/);
        if (!match)
            return null;
        return {
            prefix: match[1],
            num: parseInt(match[2], 10),
            suffix: match[3]
        };
    }
    static { this.ɵfac = function ReportHubModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ReportHubModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ReportHubModalComponent, selectors: [["app-report-hub-modal"]], inputs: { isOpen: "isOpen", run: "run", historyList: "historyList", isLoadingHistory: "isLoadingHistory", runStatus: "runStatus" }, outputs: { close: "close", createReport: "createReport", previewPdf: "previewPdf" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "dark:bg-slate-950/70", "backdrop-blur-sm", "animate-fade-in"], [1, "w-full", "max-w-3xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-3xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col", "max-h-[88vh]"], [1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-800", "shrink-0"], [1, "flex", "items-start", "justify-between", "gap-4"], [1, "flex", "items-start", "gap-3", "min-w-0"], [1, "w-10", "h-10", "rounded-xl", "bg-red-50", "dark:bg-red-950/30", "text-red-600", "dark:text-red-400", "flex", "items-center", "justify-center", "border", "border-red-100/50", "dark:border-red-900/20", "shrink-0"], [1, "fa-solid", "fa-file-pdf", "text-sm"], [1, "min-w-0"], [1, "text-sm", "font-black", "text-slate-850", "dark:text-slate-100", "uppercase", "tracking-tight"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "font-semibold", "mt-0.5", "truncate"], [1, "mt-2", "flex", "flex-wrap", "items-center", "gap-2"], [1, "inline-flex", "items-center", "gap-1.5", "px-2.5", "py-1", "rounded-lg", "bg-emerald-50", "dark:bg-emerald-950/20", "text-emerald-700", "dark:text-emerald-400", "border", "border-emerald-200/50", "dark:border-emerald-900/40", "text-[10px]", "font-black", "uppercase"], [1, "fa-solid", "fa-check-double", "text-[9px]"], [1, "inline-flex", "items-center", "gap-1.5", "px-2.5", "py-1", "rounded-lg", "bg-amber-50", "dark:bg-amber-950/20", "text-amber-700", "dark:text-amber-400", "border", "border-amber-200/50", "dark:border-amber-900/40", "text-[10px]", "font-black", "uppercase"], [1, "w-8", "h-8", "rounded-xl", "hover:bg-slate-100", "dark:hover:bg-slate-800", "text-slate-400", "hover:text-slate-600", "flex", "items-center", "justify-center", "transition", "active:scale-90", "cursor-pointer", "border-0", "shrink-0", 3, "click"], [1, "fa-solid", "fa-xmark", "text-sm"], [1, "p-5", "overflow-y-auto", "space-y-5", "flex-1", "custom-scrollbar", "bg-slate-50/40", "dark:bg-slate-950/10"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200/70", "dark:border-slate-800", "rounded-2xl", "p-4"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-100", "uppercase", "tracking-wider"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-3"], [1, "text-center", "py-10", "bg-white", "dark:bg-slate-900", "border", "border-dashed", "border-slate-200", "dark:border-slate-800", "rounded-2xl"], [1, "bg-amber-50/70", "dark:bg-amber-950/10", "border", "border-amber-200/60", "dark:border-amber-900/40", "rounded-2xl", "p-4"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200/70", "dark:border-slate-800", "rounded-2xl", "overflow-hidden"], [1, "w-full", "px-4", "py-3", "flex", "items-center", "justify-between", "gap-3", "text-left", "hover:bg-slate-50", "dark:hover:bg-slate-800/50", "transition", "cursor-pointer", "border-0", "bg-transparent", 3, "click"], [1, "text-xs", "font-black", "text-slate-600", "dark:text-slate-300", "uppercase", "tracking-wider"], [1, "fa-solid", "fa-clock-rotate-left", "mr-1.5", "text-slate-400"], [1, "inline-flex", "items-center", "gap-2", "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "fa-solid"], [1, "border-t", "border-slate-100", "dark:border-slate-800", "p-3"], [1, "px-5", "py-3.5", "border-t", "border-slate-100", "dark:border-slate-800", "flex", "justify-between", "items-center", "shrink-0", "bg-slate-50/50", "dark:bg-slate-950/20"], [1, "flex", "items-center", "gap-1.5", "px-4", "py-2", "text-xs", "font-black", "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-50", "dark:hover:bg-indigo-950/20", "rounded-xl", "transition", "active:scale-95", "cursor-pointer", "border-0", "bg-transparent", 3, "click"], [1, "fa-solid", "fa-pen-to-square", "text-[11px]"], [1, "px-5", "py-2", "bg-slate-200", "hover:bg-slate-300", "dark:bg-slate-800", "dark:hover:bg-slate-750", "text-slate-700", "dark:text-slate-250", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95", "cursor-pointer", "border-0", 3, "click"], [1, "fa-solid", "fa-triangle-exclamation", "text-[9px]"], [1, "bg-white", "dark:bg-slate-900", "border", "rounded-2xl", "p-4", "shadow-sm", "hover:shadow-md", "transition-all", "flex", "flex-col", "gap-3", 3, "border-indigo-200", "dark:border-indigo-900", "border-fuchsia-200", "dark:border-fuchsia-900"], [1, "bg-white", "dark:bg-slate-900", "border", "rounded-2xl", "p-4", "shadow-sm", "hover:shadow-md", "transition-all", "flex", "flex-col", "gap-3"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "flex", "items-center", "gap-1.5", "mb-2"], [1, "px-2", "py-0.5", "rounded-md", "text-[9px]", "font-black", "uppercase", "border"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500"], [1, "text-sm", "font-black", "text-slate-850", "dark:text-slate-100", "leading-snug", "break-words", 3, "title"], [1, "text-[10px]", "font-semibold", "text-slate-400", "dark:text-slate-500", "mt-1"], [1, "flex", "items-center", "gap-1.5", "shrink-0"], ["title", "Xem PDF", 1, "w-8", "h-8", "rounded-xl", "bg-red-50", "hover:bg-red-100", "text-red-600", "dark:bg-red-950/30", "dark:hover:bg-red-900/40", "dark:text-red-400", "flex", "items-center", "justify-center", "transition", "active:scale-90", "border-0", "cursor-pointer"], ["target", "_blank", "rel", "noopener noreferrer", "title", "M\u1EDF Docs", 1, "w-8", "h-8", "rounded-xl", "bg-blue-50", "hover:bg-blue-100", "text-blue-600", "dark:bg-blue-950/30", "dark:hover:bg-blue-900/40", "dark:text-blue-400", "flex", "items-center", "justify-center", "transition", "active:scale-90", "border-0", "cursor-pointer", 3, "href"], [1, "pt-3", "border-t", "border-slate-100", "dark:border-slate-800"], [1, "flex", "flex-wrap", "gap-1"], [1, "pt-1"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "font-semibold"], ["title", "Xem PDF", 1, "w-8", "h-8", "rounded-xl", "bg-red-50", "hover:bg-red-100", "text-red-600", "dark:bg-red-950/30", "dark:hover:bg-red-900/40", "dark:text-red-400", "flex", "items-center", "justify-center", "transition", "active:scale-90", "border-0", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-file-pdf", "text-xs"], [1, "fa-solid", "fa-file-word", "text-xs"], [1, "px-1.5", "py-0.5", "rounded", "bg-slate-100", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "text-[9px]", "font-mono", "font-bold", "border", "border-slate-200/50", "dark:border-slate-700/50"], [1, "px-1.5", "py-0.5", "rounded", "bg-slate-200", "dark:bg-slate-700", "text-slate-700", "dark:text-slate-300", "text-[9px]", "font-bold", "border-0", "cursor-pointer", 3, "click"], [1, "px-1.5", "py-0.5", "rounded", "bg-slate-50", "dark:bg-slate-800/50", "text-slate-500", "dark:text-slate-400", "text-[9px]", "font-bold", "border", "border-slate-200/50", "dark:border-slate-700/50", "hover:bg-slate-100", "transition", "active:scale-95", "cursor-pointer"], [1, "px-1.5", "py-0.5", "rounded", "bg-slate-50", "dark:bg-slate-800/50", "text-slate-500", "dark:text-slate-400", "text-[9px]", "font-bold", "border", "border-slate-200/50", "dark:border-slate-700/50", "hover:bg-slate-100", "transition", "active:scale-95", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-file-circle-xmark", "text-3xl", "text-slate-300", "dark:text-slate-600", "mb-3"], [1, "text-sm", "font-bold", "text-slate-600", "dark:text-slate-300"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "mt-1"], [1, "text-xs", "font-black", "text-amber-800", "dark:text-amber-300", "uppercase", "tracking-wider"], [1, "text-[11px]", "text-amber-700/80", "dark:text-amber-400/80", "mt-1"], [1, "mt-3", "flex", "flex-wrap", "gap-1"], [1, "px-1.5", "py-0.5", "rounded", "bg-white/80", "dark:bg-slate-900/70", "text-amber-700", "dark:text-amber-300", "text-[9px]", "font-mono", "font-bold", "border", "border-amber-200/60", "dark:border-amber-900/40"], [1, "flex", "items-center", "justify-center", "py-6", "gap-2", "text-slate-400"], [1, "space-y-2", "max-h-56", "overflow-y-auto", "custom-scrollbar", "pr-1"], [1, "text-center", "py-5", "text-slate-400", "dark:text-slate-500", "text-[10px]", "font-semibold", "uppercase", "tracking-wider"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "text-xs", "font-semibold"], [1, "flex", "items-start", "justify-between", "gap-3", "bg-slate-50/70", "dark:bg-slate-950/20", "border", "border-slate-200/50", "dark:border-slate-800/60", "rounded-xl", "px-3", "py-2.5", "text-xs"], [1, "flex", "items-center", "gap-1.5", "flex-wrap"], [1, "font-extrabold", "text-slate-700", "dark:text-slate-300"], [1, "px-1.5", "py-0.5", "rounded", "bg-slate-200", "dark:bg-slate-800", "text-slate-500", "text-[8px]", "font-bold", "uppercase"], [1, "px-1.5", "py-0.5", "rounded", "bg-amber-100", "dark:bg-amber-950/40", "text-amber-600", "dark:text-amber-400", "text-[8px]", "font-black", "uppercase"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "font-mono", "font-bold", "mt-1", "break-words"], [1, "text-[9px]", "text-slate-400", "mt-0.5"], ["title", "M\u1EDF PDF b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-red-50", "hover:bg-red-100", "text-red-600", "dark:bg-red-950/30", "dark:hover:bg-red-900/40", "dark:text-red-400", "flex", "items-center", "justify-center", "transition", "active:scale-90", "border-0", "cursor-pointer"], ["target", "_blank", "rel", "noopener noreferrer", "title", "M\u1EDF Docs b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-blue-50", "hover:bg-blue-100", "text-blue-600", "dark:bg-blue-950/30", "dark:hover:bg-blue-900/40", "dark:text-blue-400", "flex", "items-center", "justify-center", "transition", "active:scale-90", "border-0", "cursor-pointer", 3, "href"], ["title", "M\u1EDF PDF b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-red-50", "hover:bg-red-100", "text-red-600", "dark:bg-red-950/30", "dark:hover:bg-red-900/40", "dark:text-red-400", "flex", "items-center", "justify-center", "transition", "active:scale-90", "border-0", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-file-pdf", "text-[10px]"], [1, "fa-solid", "fa-file-word", "text-[10px]"]], template: function ReportHubModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ReportHubModalComponent_Conditional_0_Template, 44, 14, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen && ctx.run ? 0 : -1);
        } }, dependencies: [CommonModule, i1.DatePipe], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ReportHubModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-report-hub-modal',
                standalone: true,
                imports: [CommonModule],
                template: `
    @if (isOpen && run) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">

          <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100/50 dark:border-red-900/20 shrink-0">
                  <i class="fa-solid fa-file-pdf text-sm"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight">Trung Tâm Báo Cáo</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                    {{ run?.sopName }} · {{ run?.inputs?.['batchCode'] || run?.id }}
                  </p>
                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40 text-[10px] font-black uppercase">
                      <i class="fa-solid fa-check-double text-[9px]"></i>
                      {{ coveredSamples().length }}/{{ allSamples().length }} mẫu đã có báo cáo
                    </span>
                    @if (missingSamples().length > 0) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40 text-[10px] font-black uppercase">
                        <i class="fa-solid fa-triangle-exclamation text-[9px]"></i>
                        Còn {{ missingSamples().length }} mẫu thiếu
                      </span>
                    }
                  </div>
                </div>
              </div>

              <button (click)="closeModal()" class="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center transition active:scale-90 cursor-pointer border-0 shrink-0">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>

          <div class="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar bg-slate-50/40 dark:bg-slate-950/10">

            <div class="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4">
              <div>
                <div class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Báo cáo hiện hành</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {{ reportCards().length > 0 ? reportCards().length + ' bản in đang khả dụng' : 'Chưa có bản in nào cho mẻ này' }}
                </div>
              </div>
            </div>

            @if (reportCards().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                @for (card of reportCards(); track card.id) {
                  <div class="bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
                       [class.border-indigo-200]="card.kind === 'all'"
                       [class.dark:border-indigo-900]="card.kind === 'all'"
                       [class.border-fuchsia-200]="card.kind === 'group'"
                       [class.dark:border-fuchsia-900]="card.kind === 'group'">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 mb-2">
                          <span class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase border"
                                [class.bg-indigo-50]="card.kind === 'all'"
                                [class.text-indigo-700]="card.kind === 'all'"
                                [class.border-indigo-200]="card.kind === 'all'"
                                [class.dark:bg-indigo-950]="card.kind === 'all'"
                                [class.dark:text-indigo-300]="card.kind === 'all'"
                                [class.dark:border-indigo-900]="card.kind === 'all'"
                                [class.bg-fuchsia-50]="card.kind === 'group'"
                                [class.text-fuchsia-700]="card.kind === 'group'"
                                [class.border-fuchsia-200]="card.kind === 'group'"
                                [class.dark:bg-fuchsia-950]="card.kind === 'group'"
                                [class.dark:text-fuchsia-300]="card.kind === 'group'"
                                [class.dark:border-fuchsia-900]="card.kind === 'group'">
                            {{ card.kind === 'all' ? 'Toàn mẻ' : 'Theo nhóm mẫu' }}
                          </span>
                          <span class="text-[10px] font-black text-slate-400 dark:text-slate-500">v{{ card.version || 1 }}</span>
                        </div>
                        <h4 class="text-sm font-black text-slate-850 dark:text-slate-100 leading-snug break-words" [title]="card.samples.join('; ')">
                          {{ card.title }}
                        </h4>
                        <div class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1">
                          {{ card.subtitle }}
                        </div>
                      </div>

                      <div class="flex items-center gap-1.5 shrink-0">
                        @if (card.pdfViewUrl || card.pdfUrl) {
                          <button (click)="triggerPreviewPdf(card.pdfViewUrl || card.pdfUrl || '', card.docsUrl || undefined, card.prefix, card.version, card.publishedBy, card.publishedAt)"
                                  class="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 flex items-center justify-center transition active:scale-90 border-0 cursor-pointer"
                                  title="Xem PDF">
                            <i class="fa-solid fa-file-pdf text-xs"></i>
                          </button>
                        }
                        @if (card.docsUrl) {
                          <a [href]="getSafeGoogleUrl(card.docsUrl)" target="_blank" rel="noopener noreferrer"
                             class="w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center transition active:scale-90 border-0 cursor-pointer"
                             title="Mở Docs">
                            <i class="fa-solid fa-file-word text-xs"></i>
                          </a>
                        }
                      </div>
                    </div>

                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div class="flex flex-wrap gap-1">
                        @let chipKey = 'card_' + card.id;
                        @if (expandedChipKeys()[chipKey]) {
                          @for (sample of card.samples; track sample) {
                            <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-mono font-bold border border-slate-200/50 dark:border-slate-700/50">{{ sample }}</span>
                          }
                          <button (click)="toggleChipExpand(chipKey)" class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-bold border-0 cursor-pointer">
                            Thu gọn
                          </button>
                        } @else {
                          @let shortSamples = getShortenedSampleChips(card.samples);
                          @for (sample of shortSamples.slice(0, 5); track sample) {
                            <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-mono font-bold border border-slate-200/50 dark:border-slate-700/50">{{ sample }}</span>
                          }
                          @if (shortSamples.length > 5 || card.samples.length > shortSamples.length) {
                            <button (click)="toggleChipExpand(chipKey)" class="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[9px] font-bold border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 transition active:scale-95 cursor-pointer">
                              Chi tiết
                            </button>
                          }
                        }
                      </div>
                    </div>

                    <div class="pt-1">
                      <div class="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">
                        {{ card.publishedAt ? (card.publishedAt | date:'HH:mm dd/MM/yy') : 'Chưa rõ ngày tạo' }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-10 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <i class="fa-solid fa-file-circle-xmark text-3xl text-slate-300 dark:text-slate-600 mb-3"></i>
                <div class="text-sm font-bold text-slate-600 dark:text-slate-300">Mẻ này chưa có báo cáo</div>
                <div class="text-xs text-slate-400 dark:text-slate-500 mt-1">Mở màn hình nhập kết quả để tạo bản in đầu tiên.</div>
              </div>
            }

            @if (missingSamples().length > 0) {
              <div class="bg-amber-50/70 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-4">
                <div>
                  <div>
                    <div class="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">Mẫu chưa có báo cáo</div>
                    <div class="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">{{ missingSamples().length }} mẫu chưa được phủ bởi báo cáo hiện hành. Vào màn hình nhập kết quả để chọn chính xác phạm vi xuất bản.</div>
                  </div>
                </div>
                <div class="mt-3 flex flex-wrap gap-1">
                  @for (sample of missingSamples(); track sample) {
                    <span class="px-1.5 py-0.5 rounded bg-white/80 dark:bg-slate-900/70 text-amber-700 dark:text-amber-300 text-[9px] font-mono font-bold border border-amber-200/60 dark:border-amber-900/40">{{ sample }}</span>
                  }
                </div>
              </div>
            }

            <div class="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl overflow-hidden">
              <button (click)="toggleHistory()"
                      class="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer border-0 bg-transparent">
                <span class="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  <i class="fa-solid fa-clock-rotate-left mr-1.5 text-slate-400"></i>Lịch sử bản in
                </span>
                <span class="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {{ historyList.length }} phiên bản
                  <i class="fa-solid" [class.fa-chevron-down]="!showHistory()" [class.fa-chevron-up]="showHistory()"></i>
                </span>
              </button>

              @if (showHistory()) {
                <div class="border-t border-slate-100 dark:border-slate-800 p-3">
                  @if (isLoadingHistory) {
                    <div class="flex items-center justify-center py-6 gap-2 text-slate-400">
                      <i class="fa-solid fa-spinner fa-spin"></i>
                      <span class="text-xs font-semibold">Đang tải lịch sử...</span>
                    </div>
                  } @else if (historyList.length > 0) {
                    <div class="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                      @for (hist of historyList; track historyTrackKey(hist)) {
                        @let samples = getSampleChipsForReport(hist, hist.prefix || 'ALL');
                        <div class="flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/60 rounded-xl px-3 py-2.5 text-xs">
                          <div class="min-w-0">
                            <div class="flex items-center gap-1.5 flex-wrap">
                              <span class="font-extrabold text-slate-700 dark:text-slate-300">v{{ hist.version || 1 }}</span>
                              <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 text-[8px] font-bold uppercase">
                                {{ getHistoryKindLabel(hist.prefix) }}
                              </span>
                              @if (hist.status === 'archived') {
                                <span class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase">Lưu trữ</span>
                              }
                            </div>
                            <div class="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold mt-1 break-words">
                              {{ samples.length > 0 ? formatSamples(samples) : 'Chưa rõ mẫu' }}
                            </div>
                            <div class="text-[9px] text-slate-400 mt-0.5">{{ hist.publishedBy || hist.updatedBy || 'Chưa rõ' }} · {{ hist.publishedAt | date:'HH:mm dd/MM/yy' }}</div>
                          </div>
                          <div class="flex items-center gap-1.5 shrink-0">
                            @if (hist.pdfViewUrl || hist.pdfUrl) {
                              <button (click)="triggerPreviewPdf(hist.pdfViewUrl || hist.pdfUrl, hist.docsUrl, hist.prefix === '_NO_PREFIX_' ? '' : hist.prefix, hist.version, hist.publishedBy, hist.publishedAt)"
                                      class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 flex items-center justify-center transition active:scale-90 border-0 cursor-pointer" title="Mở PDF bản này">
                                <i class="fa-solid fa-file-pdf text-[10px]"></i>
                              </button>
                            }
                            @if (hist.docsUrl) {
                              <a [href]="getSafeGoogleUrl(hist.docsUrl)" target="_blank" rel="noopener noreferrer"
                                 class="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center transition active:scale-90 border-0 cursor-pointer" title="Mở Docs bản này">
                                <i class="fa-solid fa-file-word text-[10px]"></i>
                              </a>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-5 text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                      Không có bản in cũ trong lịch sử.
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div class="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
            <button (click)="triggerCreateReport(undefined)"
                    class="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl transition active:scale-95 cursor-pointer border-0 bg-transparent">
              <i class="fa-solid fa-pen-to-square text-[11px]"></i> Mở nhập kết quả
            </button>
            <button (click)="closeModal()"
                    class="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer border-0">
              Đóng
            </button>
          </div>

        </div>
      </div>
    }
  `
            }]
    }], null, { isOpen: [{
            type: Input
        }], run: [{
            type: Input
        }], historyList: [{
            type: Input
        }], isLoadingHistory: [{
            type: Input
        }], runStatus: [{
            type: Input
        }], close: [{
            type: Output
        }], createReport: [{
            type: Output
        }], previewPdf: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ReportHubModalComponent, { className: "ReportHubModalComponent", filePath: "src/app/features/results/components/report-hub-modal.component.ts", lineNumber: 268 }); })();
//# sourceMappingURL=report-hub-modal.component.js.map