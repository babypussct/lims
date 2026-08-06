import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = () => [];
const _forTrack0 = ($index, $item) => $item.id || $item.pdfCreatedAt;
const _forTrack1 = ($index, $item) => $item._id || $item.version + "_" + ($item.reportId || $item.prefix || "all");
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4)(1, "div", 9);
    i0.ɵɵelement(2, "div", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 11);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ctx_r0.progress.percent, "%");
    i0.ɵɵclassProp("bg-emerald-500", ctx_r0.progress.percent === 100)("bg-fuchsia-500", ctx_r0.progress.percent < 100);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("text-emerald-600", ctx_r0.progress.percent === 100)("text-amber-600", ctx_r0.progress.percent < 100);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" ", ctx_r0.progress.published, "/", ctx_r0.progress.total, " ");
} }
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_7_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 26);
    i0.ɵɵlistener("click", function ResultActiveReportsPanelComponent_Conditional_0_Conditional_7_Conditional_17_Template_a_click_0_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(1, "i", 27);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("href", ctx_r0.getDocsPreviewUrl(ctx_r0.generalReport.docsUrl), i0.ɵɵsanitizeUrl);
} }
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 12)(2, "div", 13);
    i0.ɵɵelement(3, "i", 14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 15)(5, "div", 16)(6, "span", 17);
    i0.ɵɵtext(7, "B\u00E1o c\u00E1o chung");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span", 18);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 19)(11, "span", 20);
    i0.ɵɵelement(12, "i", 21);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(14, "div", 22)(15, "button", 23);
    i0.ɵɵlistener("click", function ResultActiveReportsPanelComponent_Conditional_0_Conditional_7_Template_button_click_15_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(2); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r0.openPdf.emit({ pdfUrl: ctx_r0.generalReport.pdfViewUrl || ctx_r0.generalReport.pdfUrl, docsUrl: ctx_r0.generalReport.docsUrl })); });
    i0.ɵɵelement(16, "i", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(17, ResultActiveReportsPanelComponent_Conditional_0_Conditional_7_Conditional_17_Template, 2, 1, "a", 25);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate1("v", ctx_r0.generalReport.version, "");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", (ctx_r0.sampleList || i0.ɵɵpureFunction0(4, _c0)).join(", "));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatSampleRange(ctx_r0.sampleList), " ");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r0.generalReport.docsUrl ? 17 : -1);
} }
function ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ɵ$index_61_r4 = i0.ɵɵnextContext().$index;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("P.", ɵ$index_61_r4 + 1, "");
} }
function ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19)(1, "span", 36);
    i0.ɵɵelement(2, "i", 37);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const rep_r5 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", (rep_r5.includedSamples || i0.ɵɵpureFunction0(2, _c0)).join(", "));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatSampleRange(rep_r5.includedSamples), " ");
} }
function ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 23);
    i0.ɵɵlistener("click", function ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_13_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r6); const rep_r5 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(3); $event.stopPropagation(); return i0.ɵɵresetView(ctx_r0.openPdf.emit({ pdfUrl: rep_r5.pdfViewUrl || rep_r5.pdfUrl, docsUrl: rep_r5.docsUrl })); });
    i0.ɵɵelement(1, "i", 24);
    i0.ɵɵelementEnd();
} }
function ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 26);
    i0.ɵɵlistener("click", function ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_14_Template_a_click_0_listener($event) { i0.ɵɵrestoreView(_r7); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(1, "i", 27);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const rep_r5 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("href", ctx_r0.getDocsPreviewUrl(rep_r5.docsUrl), i0.ɵɵsanitizeUrl);
} }
function ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28)(1, "div", 12)(2, "div", 29);
    i0.ɵɵelement(3, "i", 30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 15)(5, "div", 31)(6, "span", 32);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_8_Template, 2, 1, "span", 33);
    i0.ɵɵelementStart(9, "span", 34);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(11, ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_11_Template, 4, 3, "div", 19);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 22);
    i0.ɵɵtemplate(13, ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_13_Template, 2, 0, "button", 35)(14, ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Conditional_14_Template, 2, 1, "a", 25);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const rep_r5 = ctx.$implicit;
    const pref_r8 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1(" Nh\u00F3m ", pref_r8 === "" ? "N/A" : pref_r8, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.getPrefixReports(pref_r8).length > 1 ? 8 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("v", rep_r5.version, "");
    i0.ɵɵadvance();
    i0.ɵɵconditional((rep_r5.includedSamples || i0.ɵɵpureFunction0(6, _c0)).length > 0 ? 11 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(rep_r5.pdfViewUrl || rep_r5.pdfUrl ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(rep_r5.docsUrl ? 14 : -1);
} }
function ResultActiveReportsPanelComponent_Conditional_0_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, ResultActiveReportsPanelComponent_Conditional_0_For_9_For_1_Template, 15, 7, "div", 28, _forTrack0);
} if (rf & 2) {
    const pref_r8 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r0.getPrefixReports(pref_r8));
} }
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 48);
    i0.ɵɵtext(1, "L\u01B0u tr\u1EEF");
    i0.ɵɵelementEnd();
} }
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 50);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const hist_r9 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("title", (hist_r9.includedSamples || i0.ɵɵpureFunction0(2, _c0)).join(", "));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatSampleRange(hist_r9.includedSamples), " ");
} }
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 54);
    i0.ɵɵlistener("click", function ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Conditional_13_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const hist_r9 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.openPdf.emit({ pdfUrl: hist_r9.pdfViewUrl || hist_r9.pdfUrl, docsUrl: hist_r9.docsUrl })); });
    i0.ɵɵelement(1, "i", 55);
    i0.ɵɵelementEnd();
} }
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 53);
    i0.ɵɵelement(1, "i", 56);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const hist_r9 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("href", ctx_r0.getDocsPreviewUrl(hist_r9.docsUrl), i0.ɵɵsanitizeUrl);
} }
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 43)(1, "div", 44)(2, "div", 45)(3, "span", 46);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 47);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Conditional_7_Template, 2, 0, "span", 48);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 49);
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Conditional_11_Template, 2, 3, "div", 50);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 51);
    i0.ɵɵtemplate(13, ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Conditional_13_Template, 2, 0, "button", 52)(14, ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Conditional_14_Template, 2, 1, "a", 53);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const hist_r9 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("v", hist_r9.version, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getHistoryScopeLabel(hist_r9), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(hist_r9.status === "archived" ? 7 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", hist_r9.publishedBy || "Kh\u00F4ng r\u00F5 ng\u01B0\u1EDDi in", " \u00B7 ", i0.ɵɵpipeBind2(10, 8, hist_r9.publishedAt, "HH:mm dd/MM/yy"), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((hist_r9.includedSamples || i0.ɵɵpureFunction0(11, _c0)).length > 0 ? 11 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(hist_r9.pdfViewUrl || hist_r9.pdfUrl ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(hist_r9.docsUrl ? 14 : -1);
} }
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7)(1, "div", 38)(2, "h5", 39);
    i0.ɵɵelement(3, "i", 40);
    i0.ɵɵtext(4, " Timeline phi\u00EAn b\u1EA3n ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 41);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 42);
    i0.ɵɵrepeaterCreate(8, ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_For_9_Template, 15, 12, "div", 43, _forTrack1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("", ctx_r0.historyList.length, " b\u1EA3n");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.getRecentHistory());
} }
function ResultActiveReportsPanelComponent_Conditional_0_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 8)(1, "span", 57);
    i0.ɵɵtext(2, "Ch\u01B0a xu\u1EA5t:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 58);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.progress.unpublishedSamples.join(", "));
} }
function ResultActiveReportsPanelComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "h4", 2);
    i0.ɵɵelement(3, "i", 3);
    i0.ɵɵtext(4, " C\u00E1c B\u00E1o C\u00E1o ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, ResultActiveReportsPanelComponent_Conditional_0_Conditional_5_Template, 5, 12, "div", 4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 5);
    i0.ɵɵtemplate(7, ResultActiveReportsPanelComponent_Conditional_0_Conditional_7_Template, 18, 5, "div", 6);
    i0.ɵɵrepeaterCreate(8, ResultActiveReportsPanelComponent_Conditional_0_For_9_Template, 2, 0, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, ResultActiveReportsPanelComponent_Conditional_0_Conditional_10_Template, 10, 1, "div", 7)(11, ResultActiveReportsPanelComponent_Conditional_0_Conditional_11_Template, 5, 1, "p", 8);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r0.draftStatus !== "completed" ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.generalReport ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.prefixes);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.historyList.length > 0 ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.progress.unpublishedSamples.length > 0 && ctx_r0.draftStatus !== "completed" ? 11 : -1);
} }
export class ResultActiveReportsPanelComponent {
    constructor() {
        /** Có ít nhất 1 báo cáo active không */
        this.hasAnyReports = false;
        /** Báo cáo chung (tất cả mẫu) */
        this.generalReport = null;
        /** Danh sách prefix phát hiện được */
        this.prefixes = [];
        /** Danh sách toàn bộ mẫu của mẻ chạy (dùng hiển thị cho báo cáo chung) */
        this.sampleList = [];
        /** Trạng thái draft */
        this.draftStatus = 'draft';
        /** Tiến độ xuất báo cáo */
        this.progress = { total: 0, published: 0, percent: 0, unpublishedSamples: [] };
        /** Lịch sử các bản in đã publish/archive */
        this.historyList = [];
        this.openPdf = new EventEmitter();
    }
    /** Định dạng danh sách mẫu thành dãy rút gọn trực quan, vd: A01, A02, A03 -> A01 ⭢ A03 */
    formatSampleRange(samples) {
        if (!samples || samples.length === 0)
            return 'Không có mẫu';
        const parseSample = (s) => {
            const match = s.match(/^([A-Za-z]+)(\d+)(.*)$/);
            if (!match)
                return null;
            return { prefix: match[1], num: parseInt(match[2], 10), suffix: match[3] };
        };
        const isSequential = (s1, s2) => {
            const p1 = parseSample(s1);
            const p2 = parseSample(s2);
            if (!p1 || !p2)
                return false;
            if (p1.prefix !== p2.prefix)
                return false;
            if (p1.suffix !== p2.suffix)
                return false;
            return p1.num + 1 === p2.num;
        };
        const result = [];
        let i = 0;
        while (i < samples.length) {
            const start = samples[i];
            let j = i;
            while (j + 1 < samples.length && isSequential(samples[j], samples[j + 1])) {
                j++;
            }
            if (j > i) {
                result.push(`${start} ⭢ ${samples[j]}`);
            }
            else {
                result.push(start);
            }
            i = j + 1;
        }
        return result.join(', ');
    }
    /** Wrapper để gọi hàm từ @Input trong template */
    getPrefixReports(prefix) {
        return this.getAllReportsForPrefixFn ? this.getAllReportsForPrefixFn(prefix) : [];
    }
    /** Trả về URL Google Docs ở chế độ xem trước */
    getDocsPreviewUrl(url) {
        if (!url)
            return '';
        return url.replace(/\/edit.*$/, '/preview');
    }
    getRecentHistory() {
        return (this.historyList || []).slice(0, 5);
    }
    getHistoryScopeLabel(hist) {
        const prefix = hist?.prefix;
        if (!prefix || prefix === 'ALL')
            return 'Báo cáo chung';
        if (prefix === '_NO_PREFIX_')
            return 'Không tiền tố';
        return `Nhóm ${prefix}`;
    }
    static { this.ɵfac = function ResultActiveReportsPanelComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResultActiveReportsPanelComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResultActiveReportsPanelComponent, selectors: [["app-result-active-reports-panel"]], inputs: { hasAnyReports: "hasAnyReports", generalReport: "generalReport", prefixes: "prefixes", sampleList: "sampleList", getAllReportsForPrefixFn: "getAllReportsForPrefixFn", draftStatus: "draftStatus", progress: "progress", historyList: "historyList" }, outputs: { openPdf: "openPdf" }, decls: 1, vars: 1, consts: [[1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200/60", "dark:border-slate-800/80", "rounded-2xl", "shadow-sm", "mb-6", "p-5", "transition-all", "duration-300"], [1, "flex", "items-center", "justify-between", "gap-3", "mb-2.5"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "flex", "items-center", "gap-1.5", "shrink-0"], [1, "fa-solid", "fa-file-invoice", "text-indigo-400"], [1, "flex", "items-center", "gap-2", "flex-1", "min-w-0"], [1, "grid", "grid-cols-1", "sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]", "gap-3"], [1, "flex", "items-center", "justify-between", "gap-3", "bg-indigo-50/40", "dark:bg-indigo-950/20", "border", "border-indigo-150/80", "dark:border-indigo-800/40", "rounded-xl", "px-3", "py-2", "hover:bg-indigo-50", "hover:border-indigo-300", "dark:hover:bg-indigo-950/40", "transition", "shadow-xs"], [1, "mt-4", "pt-3", "border-t", "border-slate-100", "dark:border-slate-800"], [1, "text-[9px]", "text-slate-400", "mt-2", "leading-relaxed"], [1, "flex-1", "h-1.5", "bg-slate-100", "dark:bg-slate-800", "rounded-full", "overflow-hidden"], [1, "h-full", "rounded-full", "transition-all", "duration-500"], [1, "text-[10px]", "font-black", "tabular-nums", "shrink-0"], [1, "flex", "items-center", "gap-2.5", "min-w-0", "flex-1"], [1, "w-7", "h-7", "rounded-lg", "bg-indigo-500", "text-white", "flex", "items-center", "justify-center", "shrink-0", "text-xs", "shadow-xs"], [1, "fa-solid", "fa-file-invoice"], [1, "min-w-0", "flex-1"], [1, "flex", "items-center", "gap-1.5"], [1, "text-xs", "font-black", "text-indigo-800", "dark:text-indigo-300", "uppercase", "tracking-wide", "truncate"], [1, "px-1.5", "py-0.5", "rounded", "bg-indigo-100", "dark:bg-indigo-900/60", "text-indigo-700", "dark:text-indigo-300", "text-[9px]", "font-black", "uppercase", "border", "border-indigo-200/50", "dark:border-indigo-800/50", "shadow-xs", "shrink-0"], [1, "mt-1", "flex", "items-center"], [1, "inline-flex", "items-center", "gap-1", "px-1.5", "py-0.5", "rounded-md", "bg-indigo-500/10", "dark:bg-indigo-500/20", "text-indigo-700", "dark:text-indigo-400", "font-mono", "font-bold", "text-[9px]", "border", "border-indigo-200/20", "dark:border-indigo-800/30", "truncate", "w-fit", 3, "title"], [1, "fa-solid", "fa-vials", "text-[8px]", "text-indigo-500", "mr-0.5"], [1, "flex", "items-center", "gap-1.5", "shrink-0"], ["type", "button", "title", "Xem PDF", 1, "w-8", "h-8", "bg-red-50", "hover:bg-red-100", "dark:bg-red-955/20", "dark:hover:bg-red-900/50", "text-red-500", "dark:text-red-400", "rounded-lg", "text-xs", "font-bold", "transition", "active:scale-95", "cursor-pointer", "border", "border-red-200", "dark:border-red-900/30", "flex", "items-center", "justify-center", "shadow-xs", 3, "click"], [1, "fa-solid", "fa-file-pdf", "text-xs"], ["target", "_blank", "rel", "noopener noreferrer", "title", "M\u1EDF Google Docs", 1, "w-8", "h-8", "bg-blue-50", "hover:bg-blue-100", "dark:bg-blue-955/20", "dark:hover:bg-blue-900/50", "text-blue-500", "dark:text-blue-400", "rounded-lg", "text-xs", "font-bold", "transition", "active:scale-95", "cursor-pointer", "border", "border-blue-200", "dark:border-blue-900/30", "no-underline", "flex", "items-center", "justify-center", "shadow-xs", 3, "href"], ["target", "_blank", "rel", "noopener noreferrer", "title", "M\u1EDF Google Docs", 1, "w-8", "h-8", "bg-blue-50", "hover:bg-blue-100", "dark:bg-blue-955/20", "dark:hover:bg-blue-900/50", "text-blue-500", "dark:text-blue-400", "rounded-lg", "text-xs", "font-bold", "transition", "active:scale-95", "cursor-pointer", "border", "border-blue-200", "dark:border-blue-900/30", "no-underline", "flex", "items-center", "justify-center", "shadow-xs", 3, "click", "href"], [1, "fa-brands", "fa-google-drive", "text-xs"], [1, "flex", "items-center", "justify-between", "gap-3", "bg-fuchsia-50/30", "dark:bg-fuchsia-950/10", "border", "border-fuchsia-150/80", "dark:border-fuchsia-800/40", "rounded-xl", "px-3", "py-2", "hover:bg-fuchsia-50/60", "hover:border-fuchsia-300", "dark:hover:bg-fuchsia-950/20", "transition", "shadow-xs"], [1, "w-7", "h-7", "rounded-lg", "bg-fuchsia-500", "text-white", "flex", "items-center", "justify-center", "shrink-0", "text-xs", "shadow-xs"], [1, "fa-solid", "fa-layer-group"], [1, "flex", "items-center", "gap-1.5", "flex-wrap"], [1, "text-xs", "font-black", "text-fuchsia-800", "dark:text-fuchsia-300", "uppercase", "tracking-wide", "truncate"], [1, "px-1", "py-0.5", "rounded", "bg-amber-50", "dark:bg-amber-950/60", "text-amber-700", "dark:text-amber-400", "text-[8px]", "font-black", "border", "border-amber-200/50", "dark:border-amber-800/50", "shadow-xs", "shrink-0"], [1, "px-1.5", "py-0.5", "rounded", "bg-fuchsia-100", "dark:bg-fuchsia-900/60", "text-fuchsia-700", "dark:text-fuchsia-300", "text-[9px]", "font-black", "border", "border-fuchsia-200/50", "dark:border-fuchsia-800/50", "shadow-xs", "shrink-0"], ["type", "button", "title", "Xem PDF", 1, "w-8", "h-8", "bg-red-50", "hover:bg-red-100", "dark:bg-red-955/20", "dark:hover:bg-red-900/50", "text-red-500", "dark:text-red-400", "rounded-lg", "text-xs", "font-bold", "transition", "active:scale-95", "cursor-pointer", "border", "border-red-200", "dark:border-red-900/30", "flex", "items-center", "justify-center", "shadow-xs"], [1, "inline-flex", "items-center", "gap-1", "px-1.5", "py-0.5", "rounded-md", "bg-fuchsia-500/10", "dark:bg-fuchsia-500/20", "text-fuchsia-700", "dark:text-fuchsia-400", "font-mono", "font-bold", "text-[9px]", "border", "border-fuchsia-200/20", "dark:border-fuchsia-800/30", "truncate", "w-fit", 3, "title"], [1, "fa-solid", "fa-vials", "text-[8px]", "text-fuchsia-500", "mr-0.5"], [1, "flex", "items-center", "justify-between", "gap-3", "mb-2"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-clock-rotate-left", "text-slate-400"], [1, "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-wider"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "xl:grid-cols-3", "gap-2"], [1, "flex", "items-center", "justify-between", "gap-2", "rounded-xl", "border", "border-slate-200/70", "dark:border-slate-800", "bg-slate-50/60", "dark:bg-slate-950/20", "px-3", "py-2"], [1, "min-w-0"], [1, "flex", "items-center", "gap-1.5", "min-w-0"], [1, "text-xs", "font-black", "text-slate-700", "dark:text-slate-200"], [1, "px-1.5", "py-0.5", "rounded-md", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/60", "dark:border-slate-700", "text-[8px]", "font-black", "uppercase", "text-slate-500", "dark:text-slate-400", "truncate", "max-w-28"], [1, "px-1.5", "py-0.5", "rounded-md", "bg-amber-50", "dark:bg-amber-950/30", "text-amber-700", "dark:text-amber-400", "text-[8px]", "font-black", "uppercase"], [1, "mt-1", "text-[9px]", "font-semibold", "text-slate-400", "dark:text-slate-500", "truncate"], [1, "mt-1", "font-mono", "text-[9px]", "font-bold", "text-slate-500", "dark:text-slate-400", "truncate", 3, "title"], [1, "flex", "items-center", "gap-1", "shrink-0"], ["type", "button", "title", "M\u1EDF PDF b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-red-50", "hover:bg-red-100", "dark:bg-red-950/20", "dark:hover:bg-red-900/40", "text-red-500", "dark:text-red-400", "flex", "items-center", "justify-center", "transition", "active:scale-95", "border", "border-red-100", "dark:border-red-900/30"], ["target", "_blank", "rel", "noopener noreferrer", "title", "M\u1EDF Google Docs b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-blue-50", "hover:bg-blue-100", "dark:bg-blue-950/20", "dark:hover:bg-blue-900/40", "text-blue-500", "dark:text-blue-400", "flex", "items-center", "justify-center", "transition", "active:scale-95", "border", "border-blue-100", "dark:border-blue-900/30", 3, "href"], ["type", "button", "title", "M\u1EDF PDF b\u1EA3n n\u00E0y", 1, "w-7", "h-7", "rounded-lg", "bg-red-50", "hover:bg-red-100", "dark:bg-red-950/20", "dark:hover:bg-red-900/40", "text-red-500", "dark:text-red-400", "flex", "items-center", "justify-center", "transition", "active:scale-95", "border", "border-red-100", "dark:border-red-900/30", 3, "click"], [1, "fa-solid", "fa-file-pdf", "text-[10px]"], [1, "fa-brands", "fa-google-drive", "text-[10px]"], [1, "font-semibold"], [1, "font-mono", "text-amber-600", "dark:text-amber-400", "ml-1"]], template: function ResultActiveReportsPanelComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ResultActiveReportsPanelComponent_Conditional_0_Template, 12, 4, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.hasAnyReports ? 0 : -1);
        } }, dependencies: [CommonModule, i1.DatePipe], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ResultActiveReportsPanelComponent, [{
        type: Component,
        args: [{ selector: 'app-result-active-reports-panel', standalone: true, imports: [CommonModule], template: "<!-- B\u00E1o c\u00E1o \u0111ang ho\u1EA1t \u0111\u1ED9ng + Ti\u1EBFn \u0111\u1ED9 \u2014 g\u1ED9p th\u00E0nh 1 section compact -->\r\n@if (hasAnyReports) {\r\n  <div class=\"bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm mb-6 p-5 transition-all duration-300\">\r\n\r\n    <!-- Row: ti\u00EAu \u0111\u1EC1 + ti\u1EBFn \u0111\u1ED9 -->\r\n    <div class=\"flex items-center justify-between gap-3 mb-2.5\">\r\n      <h4 class=\"text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 shrink-0\">\r\n        <i class=\"fa-solid fa-file-invoice text-indigo-400\"></i> C\u00E1c B\u00E1o C\u00E1o\r\n      </h4>\r\n\r\n      <!-- Progress inline -->\r\n      @if (draftStatus !== 'completed') {\r\n        <div class=\"flex items-center gap-2 flex-1 min-w-0\">\r\n          <div class=\"flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden\">\r\n            <div class=\"h-full rounded-full transition-all duration-500\"\r\n                 [class.bg-emerald-500]=\"progress.percent === 100\"\r\n                 [class.bg-fuchsia-500]=\"progress.percent < 100\"\r\n                 [style.width.%]=\"progress.percent\">\r\n            </div>\r\n          </div>\r\n          <span class=\"text-[10px] font-black tabular-nums shrink-0\"\r\n                [class.text-emerald-600]=\"progress.percent === 100\"\r\n                [class.text-amber-600]=\"progress.percent < 100\">\r\n            {{ progress.published }}/{{ progress.total }}\r\n          </span>\r\n        </div>\r\n      }\r\n    </div>\r\n\r\n    <!-- Chips row: t\u1EA5t c\u1EA3 b\u00E1o c\u00E1o v\u1EDBi b\u1ED1 c\u1EE5c c\u1ED9t t\u1EF1 \u0111\u1ED9ng th\u00EDch \u1EE9ng (auto-fit columns) -->\r\n    <div class=\"grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3\">\r\n\r\n      <!-- B\u00E1o c\u00E1o chung -->\r\n      @if (generalReport) {\r\n        <div class=\"flex items-center justify-between gap-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-150/80 dark:border-indigo-800/40 rounded-xl px-3 py-2 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-950/40 transition shadow-xs\">\r\n          <div class=\"flex items-center gap-2.5 min-w-0 flex-1\">\r\n            <div class=\"w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0 text-xs shadow-xs\">\r\n              <i class=\"fa-solid fa-file-invoice\"></i>\r\n            </div>\r\n            <div class=\"min-w-0 flex-1\">\r\n              <div class=\"flex items-center gap-1.5\">\r\n                <span class=\"text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-wide truncate\">B\u00E1o c\u00E1o chung</span>\r\n                <span class=\"px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[9px] font-black uppercase border border-indigo-200/50 dark:border-indigo-800/50 shadow-xs shrink-0\">v{{ generalReport.version }}</span>\r\n              </div>\r\n              <div class=\"mt-1 flex items-center\">\r\n                <span class=\"inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-mono font-bold text-[9px] border border-indigo-200/20 dark:border-indigo-800/30 truncate w-fit\" [title]=\"(sampleList || []).join(', ')\">\r\n                  <i class=\"fa-solid fa-vials text-[8px] text-indigo-500 mr-0.5\"></i>\r\n                  {{ formatSampleRange(sampleList) }}\r\n                </span>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <!-- Action Buttons -->\r\n          <div class=\"flex items-center gap-1.5 shrink-0\">\r\n            <button type=\"button\" (click)=\"$event.stopPropagation(); openPdf.emit({ pdfUrl: generalReport.pdfViewUrl || generalReport.pdfUrl, docsUrl: generalReport.docsUrl })\"\r\n               class=\"w-8 h-8 bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer border border-red-200 dark:border-red-900/30 flex items-center justify-center shadow-xs\"\r\n               title=\"Xem PDF\">\r\n              <i class=\"fa-solid fa-file-pdf text-xs\"></i>\r\n            </button>\r\n            @if (generalReport.docsUrl) {\r\n              <a [href]=\"getDocsPreviewUrl(generalReport.docsUrl)\" target=\"_blank\" rel=\"noopener noreferrer\"\r\n                 (click)=\"$event.stopPropagation()\"\r\n                 class=\"w-8 h-8 bg-blue-50 hover:bg-blue-100 dark:bg-blue-955/20 dark:hover:bg-blue-900/50 text-blue-500 dark:text-blue-400 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer border border-blue-200 dark:border-blue-900/30 no-underline flex items-center justify-center shadow-xs\"\r\n                 title=\"M\u1EDF Google Docs\">\r\n                <i class=\"fa-brands fa-google-drive text-xs\"></i>\r\n              </a>\r\n            }\r\n          </div>\r\n        </div>\r\n      }\r\n\r\n      <!-- B\u00E1o c\u00E1o theo prefix + chunk -->\r\n      @for (pref of prefixes; track pref) {\r\n        @for (rep of getPrefixReports(pref); track rep.id || rep.pdfCreatedAt; let repIdx = $index) {\r\n          <div class=\"flex items-center justify-between gap-3 bg-fuchsia-50/30 dark:bg-fuchsia-950/10 border border-fuchsia-150/80 dark:border-fuchsia-800/40 rounded-xl px-3 py-2 hover:bg-fuchsia-50/60 hover:border-fuchsia-300 dark:hover:bg-fuchsia-950/20 transition shadow-xs\">\r\n            <div class=\"flex items-center gap-2.5 min-w-0 flex-1\">\r\n              <div class=\"w-7 h-7 rounded-lg bg-fuchsia-500 text-white flex items-center justify-center shrink-0 text-xs shadow-xs\">\r\n                <i class=\"fa-solid fa-layer-group\"></i>\r\n              </div>\r\n              <div class=\"min-w-0 flex-1\">\r\n                <div class=\"flex items-center gap-1.5 flex-wrap\">\r\n                  <span class=\"text-xs font-black text-fuchsia-800 dark:text-fuchsia-300 uppercase tracking-wide truncate\">\r\n                    Nh\u00F3m {{ pref === '' ? 'N/A' : pref }}\r\n                  </span>\r\n                  @if (getPrefixReports(pref).length > 1) {\r\n                    <span class=\"px-1 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[8px] font-black border border-amber-200/50 dark:border-amber-800/50 shadow-xs shrink-0\">P.{{ repIdx + 1 }}</span>\r\n                  }\r\n                  <span class=\"px-1.5 py-0.5 rounded bg-fuchsia-100 dark:bg-fuchsia-900/60 text-fuchsia-700 dark:text-fuchsia-300 text-[9px] font-black border border-fuchsia-200/50 dark:border-fuchsia-800/50 shadow-xs shrink-0\">v{{ rep.version }}</span>\r\n                </div>\r\n                @if ((rep.includedSamples || []).length > 0) {\r\n                  <div class=\"mt-1 flex items-center\">\r\n                    <span class=\"inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 font-mono font-bold text-[9px] border border-fuchsia-200/20 dark:border-fuchsia-800/30 truncate w-fit\" [title]=\"(rep.includedSamples || []).join(', ')\">\r\n                      <i class=\"fa-solid fa-vials text-[8px] text-fuchsia-500 mr-0.5\"></i>\r\n                      {{ formatSampleRange(rep.includedSamples) }}\r\n                    </span>\r\n                  </div>\r\n                }\r\n              </div>\r\n            </div>\r\n            <!-- Action Buttons -->\r\n            <div class=\"flex items-center gap-1.5 shrink-0\">\r\n              @if (rep.pdfViewUrl || rep.pdfUrl) {\r\n                <button type=\"button\" (click)=\"$event.stopPropagation(); openPdf.emit({ pdfUrl: rep.pdfViewUrl || rep.pdfUrl, docsUrl: rep.docsUrl })\"\r\n                   class=\"w-8 h-8 bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer border border-red-200 dark:border-red-900/30 flex items-center justify-center shadow-xs\"\r\n                   title=\"Xem PDF\">\r\n                  <i class=\"fa-solid fa-file-pdf text-xs\"></i>\r\n                </button>\r\n              }\r\n              @if (rep.docsUrl) {\r\n                <a [href]=\"getDocsPreviewUrl(rep.docsUrl)\" target=\"_blank\" rel=\"noopener noreferrer\"\r\n                   (click)=\"$event.stopPropagation()\"\r\n                   class=\"w-8 h-8 bg-blue-50 hover:bg-blue-100 dark:bg-blue-955/20 dark:hover:bg-blue-900/50 text-blue-500 dark:text-blue-400 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer border border-blue-200 dark:border-blue-900/30 no-underline flex items-center justify-center shadow-xs\"\r\n                   title=\"M\u1EDF Google Docs\">\r\n                  <i class=\"fa-brands fa-google-drive text-xs\"></i>\r\n                </a>\r\n              }\r\n            </div>\r\n          </div>\r\n        }\r\n      }\r\n\r\n    </div>\r\n\r\n    @if (historyList.length > 0) {\r\n      <div class=\"mt-4 pt-3 border-t border-slate-100 dark:border-slate-800\">\r\n        <div class=\"flex items-center justify-between gap-3 mb-2\">\r\n          <h5 class=\"text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5\">\r\n            <i class=\"fa-solid fa-clock-rotate-left text-slate-400\"></i> Timeline phi\u00EAn b\u1EA3n\r\n          </h5>\r\n          <span class=\"text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider\">{{ historyList.length }} b\u1EA3n</span>\r\n        </div>\r\n\r\n        <div class=\"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2\">\r\n          @for (hist of getRecentHistory(); track hist._id || (hist.version + '_' + (hist.reportId || hist.prefix || 'all'))) {\r\n            <div class=\"flex items-center justify-between gap-2 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/20 px-3 py-2\">\r\n              <div class=\"min-w-0\">\r\n                <div class=\"flex items-center gap-1.5 min-w-0\">\r\n                  <span class=\"text-xs font-black text-slate-700 dark:text-slate-200\">v{{ hist.version }}</span>\r\n                  <span class=\"px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700 text-[8px] font-black uppercase text-slate-500 dark:text-slate-400 truncate max-w-28\">\r\n                    {{ getHistoryScopeLabel(hist) }}\r\n                  </span>\r\n                  @if (hist.status === 'archived') {\r\n                    <span class=\"px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-[8px] font-black uppercase\">L\u01B0u tr\u1EEF</span>\r\n                  }\r\n                </div>\r\n                <div class=\"mt-1 text-[9px] font-semibold text-slate-400 dark:text-slate-500 truncate\">\r\n                  {{ hist.publishedBy || 'Kh\u00F4ng r\u00F5 ng\u01B0\u1EDDi in' }} \u00B7 {{ hist.publishedAt | date:'HH:mm dd/MM/yy' }}\r\n                </div>\r\n                @if ((hist.includedSamples || []).length > 0) {\r\n                  <div class=\"mt-1 font-mono text-[9px] font-bold text-slate-500 dark:text-slate-400 truncate\" [title]=\"(hist.includedSamples || []).join(', ')\">\r\n                    {{ formatSampleRange(hist.includedSamples) }}\r\n                  </div>\r\n                }\r\n              </div>\r\n\r\n              <div class=\"flex items-center gap-1 shrink-0\">\r\n                @if (hist.pdfViewUrl || hist.pdfUrl) {\r\n                  <button type=\"button\"\r\n                          (click)=\"openPdf.emit({ pdfUrl: hist.pdfViewUrl || hist.pdfUrl, docsUrl: hist.docsUrl })\"\r\n                          class=\"w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400 flex items-center justify-center transition active:scale-95 border border-red-100 dark:border-red-900/30\"\r\n                          title=\"M\u1EDF PDF b\u1EA3n n\u00E0y\">\r\n                    <i class=\"fa-solid fa-file-pdf text-[10px]\"></i>\r\n                  </button>\r\n                }\r\n                @if (hist.docsUrl) {\r\n                  <a [href]=\"getDocsPreviewUrl(hist.docsUrl)\" target=\"_blank\" rel=\"noopener noreferrer\"\r\n                     class=\"w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/40 text-blue-500 dark:text-blue-400 flex items-center justify-center transition active:scale-95 border border-blue-100 dark:border-blue-900/30\"\r\n                     title=\"M\u1EDF Google Docs b\u1EA3n n\u00E0y\">\r\n                    <i class=\"fa-brands fa-google-drive text-[10px]\"></i>\r\n                  </a>\r\n                }\r\n              </div>\r\n            </div>\r\n          }\r\n        </div>\r\n      </div>\r\n    }\r\n\r\n    <!-- Danh s\u00E1ch m\u1EABu ch\u01B0a xu\u1EA5t (compact) -->\r\n    @if (progress.unpublishedSamples.length > 0 && draftStatus !== 'completed') {\r\n      <p class=\"text-[9px] text-slate-400 mt-2 leading-relaxed\">\r\n        <span class=\"font-semibold\">Ch\u01B0a xu\u1EA5t:</span>\r\n        <span class=\"font-mono text-amber-600 dark:text-amber-400 ml-1\">{{ progress.unpublishedSamples.join(', ') }}</span>\r\n      </p>\r\n    }\r\n\r\n  </div>\r\n}\r\n" }]
    }], null, { hasAnyReports: [{
            type: Input
        }], generalReport: [{
            type: Input
        }], prefixes: [{
            type: Input
        }], sampleList: [{
            type: Input
        }], getAllReportsForPrefixFn: [{
            type: Input
        }], draftStatus: [{
            type: Input
        }], progress: [{
            type: Input
        }], historyList: [{
            type: Input
        }], openPdf: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResultActiveReportsPanelComponent, { className: "ResultActiveReportsPanelComponent", filePath: "src/app/features/results/components/result-active-reports-panel.component.ts", lineNumber: 22 }); })();
//# sourceMappingURL=result-active-reports-panel.component.js.map