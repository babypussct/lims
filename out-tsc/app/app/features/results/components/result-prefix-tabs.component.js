import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
function ResultPrefixTabsComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 5);
} }
function ResultPrefixTabsComponent_For_10_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 5);
} }
function ResultPrefixTabsComponent_For_10_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 4);
    i0.ɵɵlistener("click", function ResultPrefixTabsComponent_For_10_Template_button_click_0_listener() { const prefix_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.filterChange.emit(prefix_r2)); });
    i0.ɵɵtemplate(1, ResultPrefixTabsComponent_For_10_Conditional_1_Template, 1, 0, "div", 5);
    i0.ɵɵelementStart(2, "span", 6);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const prefix_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("text-indigo-700", ctx_r2.activeFilter === prefix_r2)("dark:text-indigo-300", ctx_r2.activeFilter === prefix_r2)("text-slate-500", ctx_r2.activeFilter !== prefix_r2)("dark:text-slate-400", ctx_r2.activeFilter !== prefix_r2)("hover:text-slate-700", ctx_r2.activeFilter !== prefix_r2)("dark:hover:text-slate-300", ctx_r2.activeFilter !== prefix_r2)("bg-transparent", true);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.activeFilter === prefix_r2 ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(prefix_r2 === "" ? "Kh\u00F4ng c\u00F3 ti\u1EC1n t\u1ED1" : "Ti\u1EC1n t\u1ED1 " + prefix_r2);
} }
export class ResultPrefixTabsComponent {
    constructor() {
        /** Danh sách tiền tố phát hiện được trong mẻ (không bao gồm 'ALL') */
        this.prefixes = [];
        /** Bộ lọc đang hoạt động: 'ALL' hoặc một tiền tố cụ thể */
        this.activeFilter = 'ALL';
        /** Phát ra giá trị bộ lọc mới khi người dùng click tab */
        this.filterChange = new EventEmitter();
    }
    static { this.ɵfac = function ResultPrefixTabsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResultPrefixTabsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResultPrefixTabsComponent, selectors: [["app-result-prefix-tabs"]], inputs: { prefixes: "prefixes", activeFilter: "activeFilter" }, outputs: { filterChange: "filterChange" }, decls: 11, vars: 15, consts: [[1, "px-5", "py-3", "border-b", "border-slate-100", "dark:border-slate-800/50", "bg-slate-50/30", "dark:bg-slate-900/20", "flex", "flex-wrap", "items-center", "gap-2"], [1, "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500", "mr-2", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-filter", "text-fuchsia-500", "opacity-70"], [1, "inline-flex", "bg-slate-100/80", "dark:bg-slate-800/80", "rounded-xl", "p-1", "shadow-inner", "border", "border-slate-200/50", "dark:border-slate-700/50"], [1, "relative", "px-4", "py-1.5", "text-xs", "font-bold", "rounded-lg", "transition-all", "duration-300", "z-10", "cursor-pointer", "border-0", 3, "click"], [1, "absolute", "inset-0", "bg-white", "dark:bg-slate-950", "rounded-lg", "shadow-sm", "border", "border-slate-200/50", "dark:border-slate-700/50", "-z-10", "animate-fade-in"], [1, "relative", "z-20"], [1, "relative", "px-4", "py-1.5", "text-xs", "font-bold", "rounded-lg", "transition-all", "duration-300", "z-10", "cursor-pointer", "border-0", 3, "text-indigo-700", "dark:text-indigo-300", "text-slate-500", "dark:text-slate-400", "hover:text-slate-700", "dark:hover:text-slate-300", "bg-transparent"]], template: function ResultPrefixTabsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "span", 1);
            i0.ɵɵelement(2, "i", 2);
            i0.ɵɵtext(3, " L\u1ECDc ti\u1EC1n t\u1ED1: ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div", 3)(5, "button", 4);
            i0.ɵɵlistener("click", function ResultPrefixTabsComponent_Template_button_click_5_listener() { return ctx.filterChange.emit("ALL"); });
            i0.ɵɵtemplate(6, ResultPrefixTabsComponent_Conditional_6_Template, 1, 0, "div", 5);
            i0.ɵɵelementStart(7, "span", 6);
            i0.ɵɵtext(8, "T\u1EA5t C\u1EA3 M\u1EABu");
            i0.ɵɵelementEnd()();
            i0.ɵɵrepeaterCreate(9, ResultPrefixTabsComponent_For_10_Template, 4, 16, "button", 7, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵclassProp("text-indigo-700", ctx.activeFilter === "ALL")("dark:text-indigo-300", ctx.activeFilter === "ALL")("text-slate-500", ctx.activeFilter !== "ALL")("dark:text-slate-400", ctx.activeFilter !== "ALL")("hover:text-slate-700", ctx.activeFilter !== "ALL")("dark:hover:text-slate-300", ctx.activeFilter !== "ALL")("bg-transparent", true);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.activeFilter === "ALL" ? 6 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.prefixes);
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ResultPrefixTabsComponent, [{
        type: Component,
        args: [{ selector: 'app-result-prefix-tabs', standalone: true, imports: [CommonModule], template: "<div class=\"px-5 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/20 flex flex-wrap items-center gap-2\">\r\n  <span class=\"text-xs font-bold text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-1.5\">\r\n    <i class=\"fa-solid fa-filter text-fuchsia-500 opacity-70\"></i> L\u1ECDc ti\u1EC1n t\u1ED1:\r\n  </span>\r\n  <div class=\"inline-flex bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-1 shadow-inner border border-slate-200/50 dark:border-slate-700/50\">\r\n    <button (click)=\"filterChange.emit('ALL')\"\r\n            class=\"relative px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 z-10 cursor-pointer border-0\"\r\n            [class.text-indigo-700]=\"activeFilter === 'ALL'\"\r\n            [class.dark:text-indigo-300]=\"activeFilter === 'ALL'\"\r\n            [class.text-slate-500]=\"activeFilter !== 'ALL'\"\r\n            [class.dark:text-slate-400]=\"activeFilter !== 'ALL'\"\r\n            [class.hover:text-slate-700]=\"activeFilter !== 'ALL'\"\r\n            [class.dark:hover:text-slate-300]=\"activeFilter !== 'ALL'\"\r\n            [class.bg-transparent]=\"true\">\r\n      @if (activeFilter === 'ALL') {\r\n        <div class=\"absolute inset-0 bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50 -z-10 animate-fade-in\"></div>\r\n      }\r\n      <span class=\"relative z-20\">T\u1EA5t C\u1EA3 M\u1EABu</span>\r\n    </button>\r\n    @for (prefix of prefixes; track prefix) {\r\n      <button (click)=\"filterChange.emit(prefix)\"\r\n              class=\"relative px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 z-10 cursor-pointer border-0\"\r\n              [class.text-indigo-700]=\"activeFilter === prefix\"\r\n              [class.dark:text-indigo-300]=\"activeFilter === prefix\"\r\n              [class.text-slate-500]=\"activeFilter !== prefix\"\r\n              [class.dark:text-slate-400]=\"activeFilter !== prefix\"\r\n              [class.hover:text-slate-700]=\"activeFilter !== prefix\"\r\n              [class.dark:hover:text-slate-300]=\"activeFilter !== prefix\"\r\n              [class.bg-transparent]=\"true\">\r\n        @if (activeFilter === prefix) {\r\n          <div class=\"absolute inset-0 bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50 -z-10 animate-fade-in\"></div>\r\n        }\r\n        <span class=\"relative z-20\">{{ prefix === '' ? 'Kh\u00F4ng c\u00F3 ti\u1EC1n t\u1ED1' : 'Ti\u1EC1n t\u1ED1 ' + prefix }}</span>\r\n      </button>\r\n    }\r\n  </div>\r\n</div>\r\n" }]
    }], null, { prefixes: [{
            type: Input
        }], activeFilter: [{
            type: Input
        }], filterChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResultPrefixTabsComponent, { className: "ResultPrefixTabsComponent", filePath: "src/app/features/results/components/result-prefix-tabs.component.ts", lineNumber: 10 }); })();
//# sourceMappingURL=result-prefix-tabs.component.js.map