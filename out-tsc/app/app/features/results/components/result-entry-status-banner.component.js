import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
function ResultEntryStatusBannerComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 2)(2, "div", 3);
    i0.ɵɵelement(3, "i", 4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "h4", 5);
    i0.ɵɵtext(6, "Ch\u1EC9 Xem \u2014 M\u1EBB Ch\u1EA1y \u0110ang B\u1ECB Kh\u00F3a Ch\u1EC9nh S\u1EEDa");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 6);
    i0.ɵɵtext(8, " KTV ");
    i0.ɵɵelementStart(9, "strong");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(11, " \u0111ang ch\u1EC9nh s\u1EEDa m\u1EBB ch\u1EA1y n\u00E0y t\u1EEB l\u00FAc ");
    i0.ɵɵelementStart(12, "strong");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(14, ". ");
    i0.ɵɵelement(15, "br");
    i0.ɵɵelementStart(16, "span", 7);
    i0.ɵɵelement(17, "i", 8);
    i0.ɵɵtext(18, " Ho\u1EA1t \u0111\u1ED9ng cu\u1ED1i: ");
    i0.ɵɵelementStart(19, "strong");
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(21, "button", 9);
    i0.ɵɵlistener("click", function ResultEntryStatusBannerComponent_Conditional_0_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.takeOverLock.emit()); });
    i0.ɵɵelement(22, "i", 10);
    i0.ɵɵelementStart(23, "span");
    i0.ɵɵtext(24, "Gi\u00E0nh Quy\u1EC1n Ch\u1EC9nh S\u1EEDa");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵtextInterpolate(ctx_r1.lockerName);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.lockedAt);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.lastActiveAt);
} }
function ResultEntryStatusBannerComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 1)(1, "div", 2)(2, "div", 11);
    i0.ɵɵelement(3, "i", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "h4", 13);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 14);
    i0.ɵɵtext(8, " M\u1EBB ch\u1EA1y \u0111\u00E3 \u0111\u01B0\u1EE3c kho\u00E1 \u0111\u1EC3 b\u1EA3o v\u1EC7 t\u00EDnh to\u00E0n v\u1EB9n b\u00E1o c\u00E1o. ");
    i0.ɵɵelement(9, "br");
    i0.ɵɵelementStart(10, "span", 15);
    i0.ɵɵtext(11, " Ng\u01B0\u1EDDi duy\u1EC7t cu\u1ED1i: ");
    i0.ɵɵelementStart(12, "strong");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(14, " l\u00FAc ");
    i0.ɵɵelementStart(15, "strong");
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(17, "button", 16);
    i0.ɵɵlistener("click", function ResultEntryStatusBannerComponent_Conditional_1_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.unlockToEdit.emit()); });
    i0.ɵɵelement(18, "i", 10);
    i0.ɵɵelementStart(19, "span");
    i0.ɵɵtext(20, "M\u1EDF Kh\u00F3a v\u00E0 Ch\u1EC9nh S\u1EEDa");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" \u0110\u00E3 ho\u00E0n th\u00E0nh \u2014 To\u00E0n b\u1ED9 ", ctx_r1.sampleTotal, " m\u1EABu \u0111\u00E3 c\u00F3 b\u00E1o c\u00E1o ");
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.completedBy || "Ch\u01B0a r\u00F5");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.completedAt);
} }
export class ResultEntryStatusBannerComponent {
    constructor() {
        /** Mẻ đang bị người khác lock */
        this.lockedByOthers = false;
        this.lockerName = '';
        this.lockedAt = '';
        this.lastActiveAt = '';
        /** Mẻ đã hoàn thành & bị khóa */
        this.isCompleted = false;
        this.sampleTotal = 0;
        this.completedBy = '';
        this.completedAt = '';
        this.takeOverLock = new EventEmitter();
        this.unlockToEdit = new EventEmitter();
    }
    static { this.ɵfac = function ResultEntryStatusBannerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResultEntryStatusBannerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResultEntryStatusBannerComponent, selectors: [["app-result-entry-status-banner"]], inputs: { lockedByOthers: "lockedByOthers", lockerName: "lockerName", lockedAt: "lockedAt", lastActiveAt: "lastActiveAt", isCompleted: "isCompleted", sampleTotal: "sampleTotal", completedBy: "completedBy", completedAt: "completedAt" }, outputs: { takeOverLock: "takeOverLock", unlockToEdit: "unlockToEdit" }, decls: 2, vars: 1, consts: [[1, "bg-red-50/50", "dark:bg-red-950/20", "border", "border-red-200/40", "dark:border-red-900/30", "rounded-2xl", "p-5", "mb-6", "flex", "flex-col", "sm:flex-row", "sm:items-center", "justify-between", "gap-4", "animate-in", "fade-in", "slide-in-from-top-4", "duration-300"], [1, "bg-emerald-50/50", "dark:bg-emerald-950/20", "border", "border-emerald-200/40", "dark:border-emerald-900/30", "rounded-2xl", "p-5", "mb-6", "flex", "flex-col", "sm:flex-row", "sm:items-center", "justify-between", "gap-4", "animate-in", "fade-in", "slide-in-from-top-4", "duration-300"], [1, "flex", "items-start", "gap-3.5"], [1, "w-10", "h-10", "rounded-xl", "bg-red-100", "dark:bg-red-900/40", "text-red-600", "dark:text-red-400", "flex", "items-center", "justify-center", "border", "border-red-200/20", "shrink-0"], [1, "fa-solid", "fa-lock", "text-base"], [1, "text-xs", "font-black", "uppercase", "tracking-wider", "text-red-800", "dark:text-red-400"], [1, "text-[11px]", "text-red-650", "dark:text-red-300", "font-semibold", "mt-1"], [1, "text-[10px]", "text-red-500", "dark:text-red-400", "flex", "items-center", "gap-1.5", "mt-1"], [1, "fa-solid", "fa-clock-rotate-left", "animate-pulse"], [1, "px-4", "py-2", "bg-red-600", "hover:bg-red-700", "text-white", "text-xs", "font-black", "rounded-xl", "transition", "flex", "items-center", "gap-2", "shrink-0", "active:scale-95", "shadow-md", "shadow-red-500/10", 3, "click"], [1, "fa-solid", "fa-unlock-keyhole"], [1, "w-10", "h-10", "rounded-xl", "bg-emerald-100", "dark:bg-emerald-900/40", "text-emerald-600", "dark:text-emerald-400", "flex", "items-center", "justify-center", "border", "border-emerald-200/20", "shrink-0"], [1, "fa-solid", "fa-circle-check", "text-base"], [1, "text-xs", "font-black", "uppercase", "tracking-wider", "text-emerald-800", "dark:text-emerald-400"], [1, "text-[11px]", "text-emerald-650", "dark:text-emerald-300", "font-semibold", "mt-1"], [1, "text-[10px]", "text-emerald-500", "dark:text-emerald-400", "flex", "items-center", "gap-1.5", "mt-1"], [1, "px-4", "py-2", "bg-amber-600", "hover:bg-amber-700", "text-white", "text-xs", "font-black", "rounded-xl", "transition", "flex", "items-center", "gap-2", "shrink-0", "active:scale-95", "shadow-md", "shadow-amber-500/10", "cursor-pointer", 3, "click"]], template: function ResultEntryStatusBannerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ResultEntryStatusBannerComponent_Conditional_0_Template, 25, 3, "div", 0)(1, ResultEntryStatusBannerComponent_Conditional_1_Template, 21, 3, "div", 1);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.lockedByOthers ? 0 : ctx.isCompleted ? 1 : -1);
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ResultEntryStatusBannerComponent, [{
        type: Component,
        args: [{ selector: 'app-result-entry-status-banner', standalone: true, imports: [CommonModule], template: "@if (lockedByOthers) {\r\n  <!-- Banner: B\u1ECB kh\u00F3a b\u1EDFi ng\u01B0\u1EDDi kh\u00E1c -->\r\n  <div class=\"bg-red-50/50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300\">\r\n    <div class=\"flex items-start gap-3.5\">\r\n      <div class=\"w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200/20 shrink-0\">\r\n        <i class=\"fa-solid fa-lock text-base\"></i>\r\n      </div>\r\n      <div>\r\n        <h4 class=\"text-xs font-black uppercase tracking-wider text-red-800 dark:text-red-400\">Ch\u1EC9 Xem \u2014 M\u1EBB Ch\u1EA1y \u0110ang B\u1ECB Kh\u00F3a Ch\u1EC9nh S\u1EEDa</h4>\r\n        <p class=\"text-[11px] text-red-650 dark:text-red-300 font-semibold mt-1\">\r\n          KTV <strong>{{ lockerName }}</strong> \u0111ang ch\u1EC9nh s\u1EEDa m\u1EBB ch\u1EA1y n\u00E0y t\u1EEB l\u00FAc <strong>{{ lockedAt }}</strong>.\r\n          <br>\r\n          <span class=\"text-[10px] text-red-500 dark:text-red-400 flex items-center gap-1.5 mt-1\">\r\n            <i class=\"fa-solid fa-clock-rotate-left animate-pulse\"></i> Ho\u1EA1t \u0111\u1ED9ng cu\u1ED1i: <strong>{{ lastActiveAt }}</strong>\r\n          </span>\r\n        </p>\r\n      </div>\r\n    </div>\r\n\r\n    <button (click)=\"takeOverLock.emit()\"\r\n            class=\"px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition flex items-center gap-2 shrink-0 active:scale-95 shadow-md shadow-red-500/10\">\r\n      <i class=\"fa-solid fa-unlock-keyhole\"></i>\r\n      <span>Gi\u00E0nh Quy\u1EC1n Ch\u1EC9nh S\u1EEDa</span>\r\n    </button>\r\n  </div>\r\n} @else if (isCompleted) {\r\n  <!-- Banner: \u0110\u00E3 ho\u00E0n th\u00E0nh & b\u1ECB kh\u00F3a -->\r\n  <div class=\"bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-900/30 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300\">\r\n    <div class=\"flex items-start gap-3.5\">\r\n      <div class=\"w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/20 shrink-0\">\r\n        <i class=\"fa-solid fa-circle-check text-base\"></i>\r\n      </div>\r\n      <div>\r\n        <h4 class=\"text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400\">\r\n          \u0110\u00E3 ho\u00E0n th\u00E0nh \u2014 To\u00E0n b\u1ED9 {{ sampleTotal }} m\u1EABu \u0111\u00E3 c\u00F3 b\u00E1o c\u00E1o\r\n        </h4>\r\n        <p class=\"text-[11px] text-emerald-650 dark:text-emerald-300 font-semibold mt-1\">\r\n          M\u1EBB ch\u1EA1y \u0111\u00E3 \u0111\u01B0\u1EE3c kho\u00E1 \u0111\u1EC3 b\u1EA3o v\u1EC7 t\u00EDnh to\u00E0n v\u1EB9n b\u00E1o c\u00E1o.\r\n          <br>\r\n          <span class=\"text-[10px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 mt-1\">\r\n            Ng\u01B0\u1EDDi duy\u1EC7t cu\u1ED1i: <strong>{{ completedBy || 'Ch\u01B0a r\u00F5' }}</strong> l\u00FAc <strong>{{ completedAt }}</strong>\r\n          </span>\r\n        </p>\r\n      </div>\r\n    </div>\r\n\r\n    <button (click)=\"unlockToEdit.emit()\"\r\n            class=\"px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition flex items-center gap-2 shrink-0 active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer\">\r\n      <i class=\"fa-solid fa-unlock-keyhole\"></i>\r\n      <span>M\u1EDF Kh\u00F3a v\u00E0 Ch\u1EC9nh S\u1EEDa</span>\r\n    </button>\r\n  </div>\r\n}\r\n" }]
    }], null, { lockedByOthers: [{
            type: Input
        }], lockerName: [{
            type: Input
        }], lockedAt: [{
            type: Input
        }], lastActiveAt: [{
            type: Input
        }], isCompleted: [{
            type: Input
        }], sampleTotal: [{
            type: Input
        }], completedBy: [{
            type: Input
        }], completedAt: [{
            type: Input
        }], takeOverLock: [{
            type: Output
        }], unlockToEdit: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResultEntryStatusBannerComponent, { className: "ResultEntryStatusBannerComponent", filePath: "src/app/features/results/components/result-entry-status-banner.component.ts", lineNumber: 10 }); })();
//# sourceMappingURL=result-entry-status-banner.component.js.map