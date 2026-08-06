import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressService } from '../../../core/services/progress.service';
import * as i0 from "@angular/core";
function ProgressOverlayComponent_Conditional_0_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7);
    i0.ɵɵelement(1, "div", 8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 9)(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("width", ctx_r0.progressService.progressPercentage(), "%");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", ctx_r0.progressService.current(), " / ", ctx_r0.progressService.total(), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r0.progressService.progressPercentage().toFixed(0), "%");
} }
function ProgressOverlayComponent_Conditional_0_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6);
    i0.ɵɵelement(1, "div", 10);
    i0.ɵɵelementEnd();
} }
function ProgressOverlayComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    i0.ɵɵelement(3, "i", 3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "h3", 4);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 5);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, ProgressOverlayComponent_Conditional_0_Conditional_8_Template, 7, 5)(9, ProgressOverlayComponent_Conditional_0_Conditional_9_Template, 2, 0, "div", 6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.progressService.title());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.progressService.message());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.progressService.total() > 0 ? 8 : 9);
} }
export class ProgressOverlayComponent {
    constructor() {
        this.progressService = inject(ProgressService);
    }
    static { this.ɵfac = function ProgressOverlayComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ProgressOverlayComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ProgressOverlayComponent, selectors: [["app-progress-overlay"]], decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-[9999]", "flex", "items-center", "justify-center", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-800", "p-8", "rounded-3xl", "shadow-2xl", "flex", "flex-col", "items-center", "max-w-sm", "w-full", "mx-4", "animate-bounce-in"], [1, "w-16", "h-16", "rounded-full", "bg-indigo-50", "dark:bg-indigo-900/20", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "text-3xl", "mb-4", "relative"], [1, "fa-solid", "fa-arrows-rotate", "fa-spin"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-100", "mb-2", "text-center"], [1, "text-sm", "text-slate-500", "text-center", "mb-6"], [1, "w-full", "bg-slate-100", "dark:bg-slate-700", "h-2", "rounded-full", "overflow-hidden", "relative"], [1, "w-full", "bg-slate-100", "dark:bg-slate-700", "h-3", "rounded-full", "overflow-hidden", "relative"], [1, "absolute", "top-0", "left-0", "h-full", "bg-indigo-600", "rounded-full", "transition-all", "duration-300"], [1, "flex", "justify-between", "w-full", "mt-2", "text-xs", "font-bold", "text-slate-500"], [1, "absolute", "top-0", "left-0", "h-full", "bg-indigo-600", "rounded-full", "w-1/3", "animate-[progress-indeterminate_1.5s_infinite_linear]"]], template: function ProgressOverlayComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ProgressOverlayComponent_Conditional_0_Template, 10, 3, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.progressService.isVisible() ? 0 : -1);
        } }, dependencies: [CommonModule], styles: ["@keyframes _ngcontent-%COMP%_progress-indeterminate {\n      0% { transform: translateX(-100%); }\n      100% { transform: translateX(300%); }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProgressOverlayComponent, [{
        type: Component,
        args: [{ selector: 'app-progress-overlay', standalone: true, imports: [CommonModule], template: `
    @if (progressService.isVisible()) {
      <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm fade-in">
          <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 animate-bounce-in">
              <div class="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mb-4 relative">
                  <i class="fa-solid fa-arrows-rotate fa-spin"></i>
              </div>
              <h3 class="text-lg font-black text-slate-800 dark:text-slate-100 mb-2 text-center">{{ progressService.title() }}</h3>
              <p class="text-sm text-slate-500 text-center mb-6">{{ progressService.message() }}</p>
              
              @if (progressService.total() > 0) {
                <div class="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden relative">
                    <div class="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-300" [style.width.%]="progressService.progressPercentage()"></div>
                </div>
                <div class="flex justify-between w-full mt-2 text-xs font-bold text-slate-500">
                    <span>{{ progressService.current() }} / {{ progressService.total() }}</span>
                    <span>{{ progressService.progressPercentage().toFixed(0) }}%</span>
                </div>
              } @else {
                <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden relative">
                    <div class="absolute top-0 left-0 h-full bg-indigo-600 rounded-full w-1/3 animate-[progress-indeterminate_1.5s_infinite_linear]"></div>
                </div>
              }
          </div>
      </div>
    }
  `, styles: ["\n    @keyframes progress-indeterminate {\n      0% { transform: translateX(-100%); }\n      100% { transform: translateX(300%); }\n    }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ProgressOverlayComponent, { className: "ProgressOverlayComponent", filePath: "src/app/shared/components/progress-overlay/progress-overlay.component.ts", lineNumber: 43 }); })();
//# sourceMappingURL=progress-overlay.component.js.map