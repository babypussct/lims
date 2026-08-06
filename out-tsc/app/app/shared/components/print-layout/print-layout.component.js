import { Component, Input, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { formatDate, formatNum, formatSampleList } from '../../utils/utils';
import { formatSampleDescriptions } from '../../utils/sample-description.utils';
import { ensureQrious } from '../../utils/external-script-loader';
import * as i0 from "@angular/core";
const _c0 = ["qrCanvas"];
const _c1 = () => [];
const _forTrack0 = ($index, $item) => $item.requestId || $index;
const _forTrack1 = ($index, $item) => $item.var;
const _forTrack2 = ($index, $item) => $item.name;
function PrintLayoutComponent_For_2_For_2_Conditional_1_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "span", 32);
    i0.ɵɵtext(3, "|");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const job_r1 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Ref: ", job_r1.sop == null ? null : job_r1.sop.ref, "");
} }
function PrintLayoutComponent_For_2_For_2_Conditional_1_Conditional_10_For_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 34);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const t_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(t_r2);
} }
function PrintLayoutComponent_For_2_For_2_Conditional_1_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 24)(1, "span", 33);
    i0.ɵɵtext(2, "Ch\u1EC9 ti\u00EAu:");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(3, PrintLayoutComponent_For_2_For_2_Conditional_1_Conditional_10_For_4_Template, 2, 1, "span", 34, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const job_r1 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r2.getTargetNames(job_r1));
} }
function PrintLayoutComponent_For_2_For_2_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18)(1, "div", 19)(2, "div", 20)(3, "span", 21);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, PrintLayoutComponent_For_2_For_2_Conditional_1_Conditional_5_Template, 4, 1);
    i0.ɵɵelementStart(6, "span", 22);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "h1", 23);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, PrintLayoutComponent_For_2_For_2_Conditional_1_Conditional_10_Template, 5, 0, "div", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 25)(12, "div", 26)(13, "div", 27);
    i0.ɵɵtext(14, "M\u00C3 TRUY XU\u1EA4T (ID)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div", 28);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 29);
    i0.ɵɵelement(18, "canvas", null, 0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelement(20, "div", 30);
} if (rf & 2) {
    const job_r1 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(job_r1.sop == null ? null : job_r1.sop.category);
    i0.ɵɵadvance();
    i0.ɵɵconditional((job_r1.sop == null ? null : job_r1.sop.ref) ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Ng\u00E0y: ", ctx_r2.getDisplayDate(job_r1), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(job_r1.sop == null ? null : job_r1.sop.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.getTargetNames(job_r1).length > 0 ? 10 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(job_r1.requestId || "---");
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("data-qr", job_r1.requestId || (job_r1.sop == null ? null : job_r1.sop.id));
} }
function PrintLayoutComponent_For_2_For_2_For_5_Conditional_0_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const inp_r4 = i0.ɵɵnextContext(2).$implicit;
    const job_r1 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.getSelectLabel(inp_r4, job_r1.inputs[inp_r4.var]), " ");
} }
function PrintLayoutComponent_For_2_For_2_For_5_Conditional_0_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "(Yes)");
    i0.ɵɵelementEnd();
} }
function PrintLayoutComponent_For_2_For_2_For_5_Conditional_0_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const inp_r4 = i0.ɵɵnextContext(2).$implicit;
    const job_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵtextInterpolate1(" ", job_r1.inputs[inp_r4.var], " ");
} }
function PrintLayoutComponent_For_2_For_2_For_5_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35)(1, "span", 7);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 36);
    i0.ɵɵtemplate(4, PrintLayoutComponent_For_2_For_2_For_5_Conditional_0_Conditional_4_Template, 1, 1)(5, PrintLayoutComponent_For_2_For_2_For_5_Conditional_0_Conditional_5_Template, 2, 0, "span")(6, PrintLayoutComponent_For_2_For_2_For_5_Conditional_0_Conditional_6_Template, 1, 1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const inp_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", inp_r4.label, ":");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(inp_r4.type === "select" && inp_r4.options ? 4 : inp_r4.type === "checkbox" ? 5 : 6);
} }
function PrintLayoutComponent_For_2_For_2_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, PrintLayoutComponent_For_2_For_2_For_5_Conditional_0_Template, 7, 2, "div", 35);
} if (rf & 2) {
    const inp_r4 = ctx.$implicit;
    const job_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵconditional(inp_r4.type !== "checkbox" || job_r1.inputs[inp_r4.var] ? 0 : -1);
} }
function PrintLayoutComponent_For_2_For_2_Conditional_11_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 39)(1, "strong");
    i0.ɵɵtext(2, "M\u00F4 t\u1EA3:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const job_r1 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.formatSampleDescriptionList(job_r1), "");
} }
function PrintLayoutComponent_For_2_For_2_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9)(1, "div", 37);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 38);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, PrintLayoutComponent_For_2_For_2_Conditional_11_Conditional_5_Template, 4, 1, "div", 39);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const job_r1 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Danh s\u00E1ch m\u1EABu (", job_r1.inputs["sampleList"].length, ")");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.formatSampleList(job_r1.inputs["sampleList"]));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.formatSampleDescriptionList(job_r1) ? 5 : -1);
} }
function PrintLayoutComponent_For_2_For_2_For_26_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 42);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r5.displayWarning);
} }
function PrintLayoutComponent_For_2_For_2_For_26_Conditional_11_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 46)(1, "td", 47);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 48);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 49);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(7, "td", 45);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sub_r6 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("\u2022 ", sub_r6.displayName || sub_r6.name, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.formatNum(sub_r6.displayAmount));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.stdUnit(sub_r6.unit));
} }
function PrintLayoutComponent_For_2_For_2_For_26_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, PrintLayoutComponent_For_2_For_2_For_26_Conditional_11_For_1_Template, 8, 3, "tr", 46, _forTrack2);
} if (rf & 2) {
    const item_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵrepeater(item_r5.breakdown);
} }
function PrintLayoutComponent_For_2_For_2_For_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 40)(2, "div", 41);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, PrintLayoutComponent_For_2_For_2_For_26_Conditional_4_Template, 2, 1, "div", 42);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 43);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td", 44);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "td", 45);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(11, PrintLayoutComponent_For_2_For_2_For_26_Conditional_11_Template, 2, 0);
} if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r5.displayName || item_r5.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r5.displayWarning ? 4 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.formatNum(item_r5.totalQty));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.stdUnit(item_r5.unit));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r5.base_note);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r5.isComposite ? 11 : -1);
} }
function PrintLayoutComponent_For_2_For_2_Conditional_27_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 55)(1, "div", 56);
    i0.ɵɵtext(2, "\u2714");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 57)(4, "div", 58);
    i0.ɵɵtext(5, "X\u00C1C NH\u1EACN \u0110I\u1EC6N T\u1EEC");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 59);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const job_r1 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(job_r1.user);
} }
function PrintLayoutComponent_For_2_For_2_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16);
    i0.ɵɵelement(1, "div", 50);
    i0.ɵɵelementStart(2, "div", 51)(3, "div", 52)(4, "div", 53);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 54);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(8, PrintLayoutComponent_For_2_For_2_Conditional_27_Conditional_8_Template, 8, 1, "div", 55);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const job_r1 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r2.getFooterText());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("In l\u00FAc: ", ctx_r2.getCurrentTime(), " | M\u00E1y: ", job_r1.user, "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.options.showSignature ? 8 : -1);
} }
function PrintLayoutComponent_For_2_For_2_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 17)(1, "span", 60);
    i0.ɵɵtext(2, "\u2702");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "div", 61);
    i0.ɵɵelementEnd();
} }
function PrintLayoutComponent_For_2_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3);
    i0.ɵɵtemplate(1, PrintLayoutComponent_For_2_For_2_Conditional_1_Template, 21, 7);
    i0.ɵɵelementStart(2, "div", 4)(3, "div", 5);
    i0.ɵɵrepeaterCreate(4, PrintLayoutComponent_For_2_For_2_For_5_Template, 1, 1, null, null, _forTrack1);
    i0.ɵɵelementStart(6, "div", 6)(7, "span", 7);
    i0.ɵɵtext(8, "Hao h\u1EE5t:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span", 8);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(11, PrintLayoutComponent_For_2_For_2_Conditional_11_Template, 6, 3, "div", 9);
    i0.ɵɵelementStart(12, "div", 10)(13, "table", 11)(14, "thead")(15, "tr")(16, "th", 12);
    i0.ɵɵtext(17, "H\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "th", 13);
    i0.ɵɵtext(19, "L\u01B0\u1EE3ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "th", 14);
    i0.ɵɵtext(21, "\u0110V");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "th", 15);
    i0.ɵɵtext(23, "Ghi ch\u00FA");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "tbody");
    i0.ɵɵrepeaterCreate(25, PrintLayoutComponent_For_2_For_2_For_26_Template, 12, 6, null, null, _forTrack2);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(27, PrintLayoutComponent_For_2_For_2_Conditional_27_Template, 9, 4, "div", 16)(28, PrintLayoutComponent_For_2_For_2_Conditional_28_Template, 4, 0, "div", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const job_r1 = ctx.$implicit;
    const ɵ$index_6_r7 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.options.showHeader ? 1 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater((job_r1.sop == null ? null : job_r1.sop.inputs) || i0.ɵɵpureFunction0(7, _c1));
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("text-blue-600", ctx_r2.isAutoMargin(job_r1));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.getMarginDisplay(job_r1));
    i0.ɵɵadvance();
    i0.ɵɵconditional(job_r1.inputs["sampleList"] && job_r1.inputs["sampleList"].length > 0 ? 11 : -1);
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater(job_r1.items);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.options.showFooter ? 27 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.options.showCutLine && ɵ$index_6_r7 === 0 ? 28 : -1);
} }
function PrintLayoutComponent_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 2);
    i0.ɵɵrepeaterCreate(1, PrintLayoutComponent_For_2_For_2_Template, 29, 8, "div", 3, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(group_r8);
} }
export class PrintLayoutComponent {
    constructor() {
        this.state = inject(StateService);
        this.formatNum = formatNum;
        this.formatDate = formatDate;
        this.formatSampleList = formatSampleList;
        this.jobs = [];
        this.options = { showHeader: true, showFooter: true, showSignature: true, showCutLine: true };
    }
    formatSampleDescriptionList(job) {
        return formatSampleDescriptions(job.inputs?.sampleList || [], job.inputs?.sampleDescriptionMap || {});
    }
    get groupedJobs() {
        const groups = [];
        const itemsPerPage = 2;
        for (let i = 0; i < this.jobs.length; i += itemsPerPage) {
            groups.push(this.jobs.slice(i, i + itemsPerPage));
        }
        return groups;
    }
    ngAfterViewInit() { setTimeout(() => void this.generateQRCodes(), 100); }
    ngOnChanges(changes) { if (changes['options'] || changes['jobs'])
        setTimeout(() => void this.generateQRCodes(), 100); }
    async generateQRCodes() {
        let QRious;
        try {
            QRious = await ensureQrious();
        }
        catch (e) {
            console.warn('QR library load error:', e);
            return;
        }
        if (!QRious)
            return;
        const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
        this.qrCanvases?.forEach(canvasRef => {
            const canvas = canvasRef.nativeElement;
            const id = canvas.getAttribute('data-qr') || 'LIMS';
            new QRious({ element: canvas, value: baseUrl + id, size: 200, level: 'L' });
        });
    }
    stdUnit(unit) {
        const u = unit?.toLowerCase().trim() || '';
        if (u === 'gram' || u === 'grams')
            return 'g';
        if (u === 'milliliter' || u === 'ml')
            return 'mL';
        if (u === 'microliter' || u === 'ul')
            return 'µL';
        return unit;
    }
    getDisplayDate(job) {
        if (job.analysisDate) {
            const parts = job.analysisDate.split('-');
            if (parts.length === 3)
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        const d = new Date(job.date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }
    getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    }
    getTargetNames(job) {
        const selectedIds = job.inputs['targetIds'] || [];
        const allTargets = job.sop?.targets || [];
        return selectedIds.map((id) => {
            const t = allTargets.find((x) => x.id === id);
            return t ? t.name : id;
        });
    }
    getFooterText() { return this.state.printConfig()?.footerText || 'Cam kết sử dụng đúng mục đích. Phiếu được quản lý trên LIMS Cloud.'; }
    getSelectLabel(inp, value) { return inp.options?.find((o) => o.value == value)?.label || value; }
    // New Helper for Margin Display
    isAutoMargin(job) {
        const val = job.margin !== undefined ? job.margin : (job.inputs['safetyMargin'] || 0);
        return val < 0;
    }
    getMarginDisplay(job) {
        const val = job.margin !== undefined ? job.margin : (job.inputs['safetyMargin'] || 0);
        if (val < 0)
            return 'Theo cấu hình (tự động)';
        return `+${this.formatNum(val)}%`;
    }
    static { this.ɵfac = function PrintLayoutComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PrintLayoutComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PrintLayoutComponent, selectors: [["app-print-layout"]], viewQuery: function PrintLayoutComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.qrCanvases = _t);
        } }, inputs: { jobs: "jobs", options: "options" }, features: [i0.ɵɵNgOnChangesFeature], decls: 3, vars: 0, consts: [["qrCanvas", ""], [1, "print-root"], [1, "print-page"], [1, "print-slip"], [1, "params-section"], [1, "params-grid"], [1, "param-item", "margin-item"], [1, "p-label"], [1, "p-value", "margin-val"], [1, "samples-box"], [1, "data-section"], [1, "main-table"], [1, "th-name"], [1, "th-amount"], [1, "th-unit"], [1, "th-note"], [1, "footer-section"], [1, "cut-line"], [1, "header-section"], [1, "header-left"], [1, "header-top-row"], [1, "badge-cat"], [1, "date-val"], [1, "sop-name"], [1, "targets-list"], [1, "header-right"], [1, "id-container"], [1, "id-label"], [1, "id-text"], [1, "qr-wrapper"], [1, "header-divider"], [1, "ref-id"], [1, "sep"], [1, "target-label"], [1, "target-tag"], [1, "param-item"], [1, "p-value"], [1, "box-label"], [1, "box-content"], [1, "box-content", 2, "margin-top", "3px", "color", "#86198f", "font-size", "9px"], [1, "td-name"], [1, "item-title"], [1, "item-warn"], [1, "td-amount"], [1, "td-unit"], [1, "td-note"], [1, "sub-row"], [1, "td-name", "sub-name"], [1, "td-amount", "sub-amount"], [1, "td-unit", "sub-unit"], [1, "footer-divider"], [1, "footer-content"], [1, "footer-info"], [1, "disclaimer"], [1, "meta-print"], [1, "signature-box"], [1, "sig-icon"], [1, "sig-text"], [1, "sig-label"], [1, "sig-name"], [1, "cut-icon"], [1, "dashed-line"]], template: function PrintLayoutComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 1);
            i0.ɵɵrepeaterCreate(1, PrintLayoutComponent_For_2_Template, 3, 0, "div", 2, i0.ɵɵrepeaterTrackByIndex);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.groupedJobs);
        } }, dependencies: [CommonModule], styles: ["\n\n    *[_ngcontent-%COMP%] { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }\n    \n    .print-root[_ngcontent-%COMP%] {\n        width: 210mm; \n\n        background: white;\n        margin: 0; \n\n        color: #000;\n        font-family: 'Open Sans', sans-serif;\n    }\n\n    .print-page[_ngcontent-%COMP%] {\n        width: 210mm;\n        height: 296mm; \n\n        background: white;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n        page-break-after: always;\n        position: relative;\n    }\n    .print-page[_ngcontent-%COMP%]:last-child { page-break-after: auto; }\n\n    .print-slip[_ngcontent-%COMP%] {\n        flex: 1; \n\n        padding: 10mm 15mm; \n\n        display: flex;\n        flex-direction: column;\n        position: relative;\n        max-height: 148mm;\n    }\n\n    \n\n    .header-section[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }\n    \n    .header-left[_ngcontent-%COMP%] { flex: 1; padding-right: 10px; }\n    .header-top-row[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 8px; font-size: 9px; color: #555; margin-bottom: 2px; }\n    .badge-cat[_ngcontent-%COMP%] { background: #eef2ff; color: #3730a3; padding: 1px 4px; border-radius: 3px; font-weight: 800; text-transform: uppercase; font-size: 8px; border: 1px solid #c7d2fe; }\n    .ref-id[_ngcontent-%COMP%] { font-weight: 600; color: #444; }\n    .sep[_ngcontent-%COMP%] { color: #ccc; }\n    \n    .sop-name[_ngcontent-%COMP%] { font-size: 16px; font-weight: 800; text-transform: uppercase; margin: 4px 0 6px 0; color: #111; line-height: 1.1; letter-spacing: -0.3px; }\n    \n    .targets-list[_ngcontent-%COMP%] { font-size: 9px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }\n    .target-label[_ngcontent-%COMP%] { font-weight: 700; color: #555; margin-right: 2px; }\n    .target-tag[_ngcontent-%COMP%] { border: 1px solid #ddd; padding: 0 4px; border-radius: 3px; font-weight: 600; color: #333; background: #f9f9f9; }\n\n    .header-right[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 10px; }\n    .id-container[_ngcontent-%COMP%] { text-align: right; }\n    .id-label[_ngcontent-%COMP%] { font-size: 7px; font-weight: 800; color: #888; letter-spacing: 0.5px; margin-bottom: 1px; }\n    .id-text[_ngcontent-%COMP%] { font-family: 'Roboto Mono', monospace; font-size: 12px; font-weight: 700; color: #000; letter-spacing: -0.5px; line-height: 1; }\n    \n    .qr-wrapper[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%] { width: 70px; height: 70px; display: block; }\n\n    .header-divider[_ngcontent-%COMP%] { height: 2px; background: #000; margin-bottom: 8px; width: 100%; }\n\n    \n\n    .params-section[_ngcontent-%COMP%] { margin-bottom: 8px; }\n    .params-grid[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; gap: 10px 15px; font-size: 9px; line-height: 1.3; }\n    .param-item[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 4px; }\n    .p-label[_ngcontent-%COMP%] { color: #666; font-weight: 600; text-transform: uppercase; font-size: 8px; }\n    .p-value[_ngcontent-%COMP%] { color: #000; font-weight: 700; font-family: 'Roboto Mono', monospace; }\n    .margin-item[_ngcontent-%COMP%] { margin-left: auto; }\n    .margin-val[_ngcontent-%COMP%] { color: #d97706; }\n\n    \n\n    .samples-box[_ngcontent-%COMP%] { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 6px; margin-bottom: 8px; }\n    .box-label[_ngcontent-%COMP%] { font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }\n    .box-content[_ngcontent-%COMP%] { font-family: 'Roboto Mono', monospace; font-size: 9px; font-weight: 600; color: #334155; line-height: 1.3; text-align: justify; }\n\n    \n\n    .data-section[_ngcontent-%COMP%] { flex: 1; min-height: 50px; }\n    .main-table[_ngcontent-%COMP%] { width: 100%; border-collapse: collapse; font-size: 9px; }\n    \n    .main-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] { text-align: left; border-bottom: 1px solid #999; padding: 3px 0; font-weight: 800; color: #333; text-transform: uppercase; font-size: 8px; }\n    .th-amount[_ngcontent-%COMP%] { text-align: right; }\n    .th-unit[_ngcontent-%COMP%] { text-align: center; }\n    .th-note[_ngcontent-%COMP%] { text-align: right; }\n\n    .main-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] { border-bottom: 1px solid #f1f5f9; padding: 4px 0; vertical-align: top; color: #1e293b; }\n    .td-name[_ngcontent-%COMP%] { width: 55%; padding-right: 5px; }\n    .item-title[_ngcontent-%COMP%] { font-weight: 700; font-size: 10px; color: #000; }\n    .item-warn[_ngcontent-%COMP%] { font-size: 7px; color: #dc2626; font-weight: 600; margin-top: 1px; }\n    \n    .td-amount[_ngcontent-%COMP%] { width: 15%; text-align: right; font-family: 'Roboto Mono', monospace; font-weight: 700; font-size: 10px; color: #000; }\n    .td-unit[_ngcontent-%COMP%] { width: 10%; text-align: center; font-weight: 600; font-size: 8px; color: #666; }\n    .td-note[_ngcontent-%COMP%] { width: 20%; text-align: right; font-style: italic; color: #64748b; font-size: 8px; }\n\n    .sub-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] { color: #475569; padding-top: 2px; padding-bottom: 2px; border-bottom: none; }\n    .sub-name[_ngcontent-%COMP%] { padding-left: 8px; font-size: 9px; font-weight: 500; }\n    .sub-amount[_ngcontent-%COMP%] { font-size: 9px; font-weight: 500; color: #475569; }\n\n    \n\n    .footer-section[_ngcontent-%COMP%] { margin-top: auto; padding-top: 6px; }\n    .footer-divider[_ngcontent-%COMP%] { height: 1px; background: #000; margin-bottom: 4px; width: 100%; opacity: 0.2; }\n    .footer-content[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: flex-end; }\n    \n    .footer-info[_ngcontent-%COMP%] { flex: 1; }\n    .disclaimer[_ngcontent-%COMP%] { font-size: 8px; color: #666; font-style: italic; margin-bottom: 2px; }\n    .meta-print[_ngcontent-%COMP%] { font-size: 7px; color: #999; font-family: 'Roboto Mono', monospace; }\n\n    .signature-box[_ngcontent-%COMP%] { border: 1px solid #94a3b8; border-radius: 4px; padding: 3px 8px; display: flex; align-items: center; gap: 6px; background: #fff; }\n    .sig-icon[_ngcontent-%COMP%] { font-size: 12px; color: #059669; }\n    .sig-label[_ngcontent-%COMP%] { font-size: 6px; font-weight: 800; color: #64748b; line-height: 1; }\n    .sig-name[_ngcontent-%COMP%] { font-size: 9px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin-top: 1px; line-height: 1; }\n\n    \n\n    .cut-line[_ngcontent-%COMP%] { position: absolute; bottom: -6px; left: 0; width: 100%; display: flex; align-items: center; justify-content: center; height: 12px; }\n    .cut-icon[_ngcontent-%COMP%] { font-size: 12px; color: #94a3b8; background: white; padding: 0 5px; position: relative; z-index: 1; }\n    .dashed-line[_ngcontent-%COMP%] { position: absolute; left: 0; right: 0; top: 50%; border-top: 1px dashed #cbd5e1; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PrintLayoutComponent, [{
        type: Component,
        args: [{ selector: 'app-print-layout', standalone: true, imports: [CommonModule], template: `
    <div class="print-root">
       @for (group of groupedJobs; track $index) {
         <!-- A4 Page Container -->
         <div class="print-page">
            
            <!-- Stack 2 slips vertically. -->
            @for (job of group; track job.requestId || $index; let i = $index) {
                <div class="print-slip">
                    
                    <!-- 1. HEADER -->
                    @if (options.showHeader) {
                        <div class="header-section">
                            <!-- Left: Main Info -->
                            <div class="header-left">
                                <div class="header-top-row">
                                    <span class="badge-cat">{{job.sop?.category}}</span>
                                    @if(job.sop?.ref) {
                                        <span class="ref-id">Ref: {{job.sop?.ref}}</span>
                                        <span class="sep">|</span>
                                    }
                                    <span class="date-val">Ngày: {{ getDisplayDate(job) }}</span>
                                </div>
                                
                                <h1 class="sop-name">{{job.sop?.name}}</h1>
                                
                                @if (getTargetNames(job).length > 0) {
                                    <div class="targets-list">
                                        <span class="target-label">Chỉ tiêu:</span>
                                        @for(t of getTargetNames(job); track $index) {
                                            <span class="target-tag">{{t}}</span>
                                        }
                                    </div>
                                }
                            </div>

                            <!-- Right: QR & ID (Aligned Correctly) -->
                            <div class="header-right">
                                <div class="id-container">
                                    <div class="id-label">MÃ TRUY XUẤT (ID)</div>
                                    <div class="id-text">{{job.requestId || '---'}}</div>
                                </div>
                                <div class="qr-wrapper">
                                    <canvas #qrCanvas [attr.data-qr]="job.requestId || job.sop?.id"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <div class="header-divider"></div>
                    }

                    <!-- 2. PARAMETERS -->
                    <div class="params-section">
                        <div class="params-grid">
                            @for (inp of (job.sop?.inputs || []); track inp.var) {
                                 @if (inp.type !== 'checkbox' || job.inputs[inp.var]) {
                                    <div class="param-item">
                                        <span class="p-label">{{inp.label}}:</span>
                                        <span class="p-value">
                                            @if (inp.type === 'select' && inp.options) {
                                                {{ getSelectLabel(inp, job.inputs[inp.var]) }}
                                            } @else if (inp.type === 'checkbox') {
                                                <span>(Yes)</span>
                                            } @else {
                                                {{ job.inputs[inp.var] }}
                                            }
                                        </span>
                                    </div>
                                 }
                            }
                            <!-- Margin Display Logic -->
                            <div class="param-item margin-item">
                                <span class="p-label">Hao hụt:</span>
                                <span class="p-value margin-val" [class.text-blue-600]="isAutoMargin(job)">{{getMarginDisplay(job)}}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. SAMPLES LIST -->
                    @if (job.inputs['sampleList'] && job.inputs['sampleList'].length > 0) {
                        <div class="samples-box">
                            <div class="box-label">Danh sách mẫu ({{job.inputs['sampleList'].length}})</div>
                            <div class="box-content">{{ formatSampleList(job.inputs['sampleList']) }}</div>
                            @if (formatSampleDescriptionList(job)) {
                                <div class="box-content" style="margin-top: 3px; color: #86198f; font-size: 9px;"><strong>Mô tả:</strong> {{formatSampleDescriptionList(job)}}</div>
                            }
                        </div>
                    }

                    <!-- 4. DATA TABLE -->
                    <div class="data-section">
                        <table class="main-table">
                            <thead>
                                <tr>
                                    <th class="th-name">Hóa chất và vật tư</th>
                                    <th class="th-amount">Lượng</th>
                                    <th class="th-unit">ĐV</th>
                                    <th class="th-note">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for (item of job.items; track item.name) {
                                    <tr>
                                        <td class="td-name">
                                            <div class="item-title">{{ item.displayName || item.name }}</div>
                                            @if(item.displayWarning) { <div class="item-warn">{{item.displayWarning}}</div> }
                                        </td>
                                        <td class="td-amount">{{formatNum(item.totalQty)}}</td>
                                        <td class="td-unit">{{stdUnit(item.unit)}}</td>
                                        <td class="td-note">{{item.base_note}}</td>
                                    </tr>

                                    @if(item.isComposite) {
                                        @for (sub of item.breakdown; track sub.name) {
                                            <tr class="sub-row">
                                                <td class="td-name sub-name">• {{ sub.displayName || sub.name }}</td>
                                                <td class="td-amount sub-amount">{{formatNum(sub.displayAmount)}}</td>
                                                <td class="td-unit sub-unit">{{stdUnit(sub.unit)}}</td>
                                                <td class="td-note"></td>
                                            </tr>
                                        }
                                    }
                                }
                            </tbody>
                        </table>
                    </div>

                    <!-- 5. FOOTER -->
                    @if (options.showFooter) {
                        <div class="footer-section">
                            <div class="footer-divider"></div>
                            <div class="footer-content">
                                <div class="footer-info">
                                    <div class="disclaimer">{{ getFooterText() }}</div>
                                    <div class="meta-print">In lúc: {{ getCurrentTime() }} | Máy: {{ job.user }}</div>
                                </div>
                                
                                @if (options.showSignature) {
                                    <div class="signature-box">
                                        <div class="sig-icon">✔</div>
                                        <div class="sig-text">
                                            <div class="sig-label">XÁC NHẬN ĐIỆN TỬ</div>
                                            <div class="sig-name">{{ job.user }}</div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    <!-- CUT LINE -->
                    @if (options.showCutLine && i === 0) { 
                        <div class="cut-line">
                            <span class="cut-icon">✂</span>
                            <div class="dashed-line"></div>
                        </div> 
                    }
                </div>
            }
         </div>
       }
    </div>
  `, styles: ["\n    /* GLOBAL RESET FOR PRINT */\n    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }\n    \n    .print-root {\n        width: 210mm; /* A4 Width */\n        background: white;\n        margin: 0; /* Align top-left for print. Preview modal handles centering. */\n        color: #000;\n        font-family: 'Open Sans', sans-serif;\n    }\n\n    .print-page {\n        width: 210mm;\n        height: 296mm; /* A4 Height */\n        background: white;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n        page-break-after: always;\n        position: relative;\n    }\n    .print-page:last-child { page-break-after: auto; }\n\n    .print-slip {\n        flex: 1; /* 50% height */\n        padding: 10mm 15mm; /* Safe margins */\n        display: flex;\n        flex-direction: column;\n        position: relative;\n        max-height: 148mm;\n    }\n\n    /* --- HEADER --- */\n    .header-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }\n    \n    .header-left { flex: 1; padding-right: 10px; }\n    .header-top-row { display: flex; align-items: center; gap: 8px; font-size: 9px; color: #555; margin-bottom: 2px; }\n    .badge-cat { background: #eef2ff; color: #3730a3; padding: 1px 4px; border-radius: 3px; font-weight: 800; text-transform: uppercase; font-size: 8px; border: 1px solid #c7d2fe; }\n    .ref-id { font-weight: 600; color: #444; }\n    .sep { color: #ccc; }\n    \n    .sop-name { font-size: 16px; font-weight: 800; text-transform: uppercase; margin: 4px 0 6px 0; color: #111; line-height: 1.1; letter-spacing: -0.3px; }\n    \n    .targets-list { font-size: 9px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }\n    .target-label { font-weight: 700; color: #555; margin-right: 2px; }\n    .target-tag { border: 1px solid #ddd; padding: 0 4px; border-radius: 3px; font-weight: 600; color: #333; background: #f9f9f9; }\n\n    .header-right { display: flex; align-items: center; gap: 10px; }\n    .id-container { text-align: right; }\n    .id-label { font-size: 7px; font-weight: 800; color: #888; letter-spacing: 0.5px; margin-bottom: 1px; }\n    .id-text { font-family: 'Roboto Mono', monospace; font-size: 12px; font-weight: 700; color: #000; letter-spacing: -0.5px; line-height: 1; }\n    \n    .qr-wrapper canvas { width: 70px; height: 70px; display: block; }\n\n    .header-divider { height: 2px; background: #000; margin-bottom: 8px; width: 100%; }\n\n    /* --- PARAMETERS --- */\n    .params-section { margin-bottom: 8px; }\n    .params-grid { display: flex; flex-wrap: wrap; gap: 10px 15px; font-size: 9px; line-height: 1.3; }\n    .param-item { display: flex; align-items: center; gap: 4px; }\n    .p-label { color: #666; font-weight: 600; text-transform: uppercase; font-size: 8px; }\n    .p-value { color: #000; font-weight: 700; font-family: 'Roboto Mono', monospace; }\n    .margin-item { margin-left: auto; }\n    .margin-val { color: #d97706; }\n\n    /* --- SAMPLES --- */\n    .samples-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 6px; margin-bottom: 8px; }\n    .box-label { font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }\n    .box-content { font-family: 'Roboto Mono', monospace; font-size: 9px; font-weight: 600; color: #334155; line-height: 1.3; text-align: justify; }\n\n    /* --- TABLE --- */\n    .data-section { flex: 1; min-height: 50px; }\n    .main-table { width: 100%; border-collapse: collapse; font-size: 9px; }\n    \n    .main-table th { text-align: left; border-bottom: 1px solid #999; padding: 3px 0; font-weight: 800; color: #333; text-transform: uppercase; font-size: 8px; }\n    .th-amount { text-align: right; }\n    .th-unit { text-align: center; }\n    .th-note { text-align: right; }\n\n    .main-table td { border-bottom: 1px solid #f1f5f9; padding: 4px 0; vertical-align: top; color: #1e293b; }\n    .td-name { width: 55%; padding-right: 5px; }\n    .item-title { font-weight: 700; font-size: 10px; color: #000; }\n    .item-warn { font-size: 7px; color: #dc2626; font-weight: 600; margin-top: 1px; }\n    \n    .td-amount { width: 15%; text-align: right; font-family: 'Roboto Mono', monospace; font-weight: 700; font-size: 10px; color: #000; }\n    .td-unit { width: 10%; text-align: center; font-weight: 600; font-size: 8px; color: #666; }\n    .td-note { width: 20%; text-align: right; font-style: italic; color: #64748b; font-size: 8px; }\n\n    .sub-row td { color: #475569; padding-top: 2px; padding-bottom: 2px; border-bottom: none; }\n    .sub-name { padding-left: 8px; font-size: 9px; font-weight: 500; }\n    .sub-amount { font-size: 9px; font-weight: 500; color: #475569; }\n\n    /* --- FOOTER --- */\n    .footer-section { margin-top: auto; padding-top: 6px; }\n    .footer-divider { height: 1px; background: #000; margin-bottom: 4px; width: 100%; opacity: 0.2; }\n    .footer-content { display: flex; justify-content: space-between; align-items: flex-end; }\n    \n    .footer-info { flex: 1; }\n    .disclaimer { font-size: 8px; color: #666; font-style: italic; margin-bottom: 2px; }\n    .meta-print { font-size: 7px; color: #999; font-family: 'Roboto Mono', monospace; }\n\n    .signature-box { border: 1px solid #94a3b8; border-radius: 4px; padding: 3px 8px; display: flex; align-items: center; gap: 6px; background: #fff; }\n    .sig-icon { font-size: 12px; color: #059669; }\n    .sig-label { font-size: 6px; font-weight: 800; color: #64748b; line-height: 1; }\n    .sig-name { font-size: 9px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin-top: 1px; line-height: 1; }\n\n    /* --- CUT LINE --- */\n    .cut-line { position: absolute; bottom: -6px; left: 0; width: 100%; display: flex; align-items: center; justify-content: center; height: 12px; }\n    .cut-icon { font-size: 12px; color: #94a3b8; background: white; padding: 0 5px; position: relative; z-index: 1; }\n    .dashed-line { position: absolute; left: 0; right: 0; top: 50%; border-top: 1px dashed #cbd5e1; }\n  "] }]
    }], null, { jobs: [{
            type: Input
        }], options: [{
            type: Input
        }], qrCanvases: [{
            type: ViewChildren,
            args: ['qrCanvas']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PrintLayoutComponent, { className: "PrintLayoutComponent", filePath: "src/app/shared/components/print-layout/print-layout.component.ts", lineNumber: 290 }); })();
//# sourceMappingURL=print-layout.component.js.map