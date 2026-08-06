import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
function ResultRunMetadataComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11)(1, "div", 12)(2, "span", 13);
    i0.ɵɵtext(3, "M\u00E3 m\u1EBB ch\u1EA1y (Batch)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 14);
    i0.ɵɵelement(5, "i", 15);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 12)(8, "span", 13);
    i0.ɵɵtext(9, "Thi\u1EBFt b\u1ECB ph\u00E2n t\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span", 16);
    i0.ɵɵelement(11, "i", 17);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 12)(14, "span", 13);
    i0.ɵɵtext(15, "Ng\u00E0y ph\u00E2n t\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span", 16);
    i0.ɵɵelement(17, "i", 18);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 12)(20, "span", 13);
    i0.ɵɵtext(21, "Ng\u01B0\u1EDDi th\u1EF1c hi\u1EC7n (Analyst)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "span", 16);
    i0.ɵɵelement(23, "i", 19);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", (ctx_r0.run == null ? null : ctx_r0.run.inputs == null ? null : ctx_r0.run.inputs["batchCode"]) || (ctx_r0.run == null ? null : ctx_r0.run.id), " ");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.displayDevice, " ");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", (ctx_r0.run == null ? null : ctx_r0.run.analysisDate) ? ctx_r0.formatAnalysisDateFn(ctx_r0.run.analysisDate) : "Ch\u01B0a thi\u1EBFt l\u1EADp", " ");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", (ctx_r0.run == null ? null : ctx_r0.run.user) || "Ch\u01B0a thi\u1EBFt l\u1EADp", " ");
} }
export class ResultRunMetadataComponent {
    constructor() {
        this.run = null;
        this.isExpanded = false;
        this.displayDevice = '';
        this.toggleExpand = new EventEmitter();
    }
    static { this.ɵfac = function ResultRunMetadataComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResultRunMetadataComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResultRunMetadataComponent, selectors: [["app-result-run-metadata"]], inputs: { run: "run", isExpanded: "isExpanded", displayDevice: "displayDevice", formatSampleListFn: "formatSampleListFn", formatAnalysisDateFn: "formatAnalysisDateFn" }, outputs: { toggleExpand: "toggleExpand" }, decls: 18, vars: 7, consts: [[1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200/60", "dark:border-slate-800/80", "rounded-2xl", "shadow-sm", "mb-6", "overflow-hidden", "transition-all", "duration-300"], [1, "px-5", "py-4", "bg-slate-50/50", "dark:bg-slate-850/30", "hover:bg-slate-100/50", "dark:hover:bg-slate-800/30", "cursor-pointer", "flex", "items-center", "justify-between", "transition-colors", "border-b", "border-slate-100", "dark:border-slate-800/50", 3, "click"], [1, "flex", "items-center", "gap-3"], [1, "w-9", "h-9", "rounded-xl", "bg-gradient-to-tr", "from-indigo-500/10", "to-fuchsia-500/10", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-indigo-100/50", "dark:border-indigo-900/30"], [1, "fa-solid", "fa-circle-info", "text-sm"], [1, "text-xs", "font-black", "uppercase", "tracking-wider", "text-slate-700", "dark:text-slate-355"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-semibold", "mt-0.5"], [1, "font-mono", "font-bold", "text-slate-650", "dark:text-slate-400", "select-all"], [1, "text-[10px]", "font-bold", "px-3", "py-1", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-400", "max-w-[200px]", "sm:max-w-xs", "md:max-w-md", "lg:max-w-lg", "truncate", "border", "border-slate-200/40", "dark:border-slate-700/30", 3, "title"], [1, "w-7", "h-7", "rounded-lg", "hover:bg-slate-200/50", "dark:hover:bg-slate-800/50", "flex", "items-center", "justify-center", "transition"], [1, "fa-solid", "fa-chevron-down", "text-xs", "text-slate-400", "dark:text-slate-500", "transition-transform", "duration-300"], [1, "p-5", "grid", "grid-cols-1", "sm:grid-cols-2", "md:grid-cols-4", "gap-6", "text-xs", "bg-slate-50/20", "dark:bg-slate-900/10", "animate-fade-in"], [1, "p-3", "bg-white", "dark:bg-slate-850", "rounded-xl", "border", "border-slate-100", "dark:border-slate-800/60", "shadow-xs"], [1, "block", "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-wider", "mb-1"], [1, "font-mono", "font-extrabold", "text-slate-800", "dark:text-slate-200", "break-all", "select-all", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-barcode", "text-indigo-500", "opacity-60"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-microscope", "text-fuchsia-500", "opacity-60"], [1, "fa-regular", "fa-calendar", "text-emerald-500", "opacity-60"], [1, "fa-solid", "fa-user", "text-amber-500", "opacity-60"]], template: function ResultRunMetadataComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵlistener("click", function ResultRunMetadataComponent_Template_div_click_1_listener() { return ctx.toggleExpand.emit(); });
            i0.ɵɵelementStart(2, "div", 2)(3, "div", 3);
            i0.ɵɵelement(4, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div")(6, "h4", 5);
            i0.ɵɵtext(7, "Th\u00F4ng Tin Chi Ti\u1EBFt M\u1EBB Ph\u00E2n T\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 6);
            i0.ɵɵtext(9, " M\u00E3 m\u1EBB: ");
            i0.ɵɵelementStart(10, "span", 7);
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(12, "div", 2)(13, "span", 8);
            i0.ɵɵtext(14);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "div", 9);
            i0.ɵɵelement(16, "i", 10);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(17, ResultRunMetadataComponent_Conditional_17_Template, 25, 4, "div", 11);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate((ctx.run == null ? null : ctx.run.inputs == null ? null : ctx.run.inputs["batchCode"]) || (ctx.run == null ? null : ctx.run.id));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("title", (ctx.run == null ? null : ctx.run.sampleList) ? ctx.formatSampleListFn(ctx.run.sampleList) : "");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate2(" ", (ctx.run == null ? null : ctx.run.sampleList == null ? null : ctx.run.sampleList.length) || 0, " m\u1EABu (", (ctx.run == null ? null : ctx.run.sampleList) ? ctx.formatSampleListFn(ctx.run.sampleList) : "Tr\u1ED1ng", ") ");
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("rotate-180", ctx.isExpanded);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isExpanded ? 17 : -1);
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ResultRunMetadataComponent, [{
        type: Component,
        args: [{ selector: 'app-result-run-metadata', standalone: true, imports: [CommonModule], template: "<div class=\"bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm mb-6 overflow-hidden transition-all duration-300\">\r\n  <!-- Header Section (Clickable to Toggle) -->\r\n  <div (click)=\"toggleExpand.emit()\"\r\n       class=\"px-5 py-4 bg-slate-50/50 dark:bg-slate-850/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-100 dark:border-slate-800/50\">\r\n    <div class=\"flex items-center gap-3\">\r\n      <div class=\"w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-fuchsia-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/30\">\r\n        <i class=\"fa-solid fa-circle-info text-sm\"></i>\r\n      </div>\r\n      <div>\r\n        <h4 class=\"text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-355\">Th\u00F4ng Tin Chi Ti\u1EBFt M\u1EBB Ph\u00E2n T\u00EDch</h4>\r\n        <p class=\"text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5\">\r\n          M\u00E3 m\u1EBB: <span class=\"font-mono font-bold text-slate-650 dark:text-slate-400 select-all\">{{ run?.inputs?.['batchCode'] || run?.id }}</span>\r\n        </p>\r\n      </div>\r\n    </div>\r\n    <div class=\"flex items-center gap-3\">\r\n      <span class=\"text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg truncate border border-slate-200/40 dark:border-slate-700/30\"\r\n            [title]=\"run?.sampleList ? formatSampleListFn(run.sampleList) : ''\">\r\n        {{ run?.sampleList?.length || 0 }} m\u1EABu ({{ run?.sampleList ? formatSampleListFn(run.sampleList) : 'Tr\u1ED1ng' }})\r\n      </span>\r\n      <div class=\"w-7 h-7 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 flex items-center justify-center transition\">\r\n        <i class=\"fa-solid fa-chevron-down text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300\"\r\n           [class.rotate-180]=\"isExpanded\"></i>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Body Section (Collapsible) -->\r\n  @if (isExpanded) {\r\n    <div class=\"p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs bg-slate-50/20 dark:bg-slate-900/10 animate-fade-in\">\r\n      <div class=\"p-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-xs\">\r\n        <span class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1\">M\u00E3 m\u1EBB ch\u1EA1y (Batch)</span>\r\n        <span class=\"font-mono font-extrabold text-slate-800 dark:text-slate-200 break-all select-all flex items-center gap-1.5\">\r\n          <i class=\"fa-solid fa-barcode text-indigo-500 opacity-60\"></i>\r\n          {{ run?.inputs?.['batchCode'] || run?.id }}\r\n        </span>\r\n      </div>\r\n      <div class=\"p-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-xs\">\r\n        <span class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1\">Thi\u1EBFt b\u1ECB ph\u00E2n t\u00EDch</span>\r\n        <span class=\"font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5\">\r\n          <i class=\"fa-solid fa-microscope text-fuchsia-500 opacity-60\"></i>\r\n          {{ displayDevice }}\r\n        </span>\r\n      </div>\r\n      <div class=\"p-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-xs\">\r\n        <span class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1\">Ng\u00E0y ph\u00E2n t\u00EDch</span>\r\n        <span class=\"font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5\">\r\n          <i class=\"fa-regular fa-calendar text-emerald-500 opacity-60\"></i>\r\n          {{ run?.analysisDate ? formatAnalysisDateFn(run.analysisDate) : 'Ch\u01B0a thi\u1EBFt l\u1EADp' }}\r\n        </span>\r\n      </div>\r\n      <div class=\"p-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-xs\">\r\n        <span class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1\">Ng\u01B0\u1EDDi th\u1EF1c hi\u1EC7n (Analyst)</span>\r\n        <span class=\"font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5\">\r\n          <i class=\"fa-solid fa-user text-amber-500 opacity-60\"></i>\r\n          {{ run?.user || 'Ch\u01B0a thi\u1EBFt l\u1EADp' }}\r\n        </span>\r\n      </div>\r\n    </div>\r\n  }\r\n</div>\r\n" }]
    }], null, { run: [{
            type: Input
        }], isExpanded: [{
            type: Input
        }], displayDevice: [{
            type: Input
        }], formatSampleListFn: [{
            type: Input
        }], formatAnalysisDateFn: [{
            type: Input
        }], toggleExpand: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResultRunMetadataComponent, { className: "ResultRunMetadataComponent", filePath: "src/app/features/results/components/result-run-metadata.component.ts", lineNumber: 10 }); })();
//# sourceMappingURL=result-run-metadata.component.js.map