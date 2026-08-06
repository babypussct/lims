import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import * as i0 from "@angular/core";
function ConfirmationModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
    i0.ɵɵelement(5, "i", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "h3", 6);
    i0.ɵɵtext(8, "X\u00E1c Nh\u1EADn H\u00E0nh \u0110\u1ED9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 7);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(11, "div", 8)(12, "button", 9);
    i0.ɵɵlistener("click", function ConfirmationModalComponent_Conditional_0_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.confirmationService.onCancel()); });
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 10);
    i0.ɵɵlistener("click", function ConfirmationModalComponent_Conditional_0_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.confirmationService.onConfirm()); });
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r1.confirmationService.state().isDangerous ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-500");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.confirmationService.state().isDangerous ? "fa-triangle-exclamation" : "fa-circle-question");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.confirmationService.state().message);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.confirmationService.state().cancelText, " ");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.confirmationService.state().isDangerous ? "bg-red-600 hover:bg-red-700 shadow-red-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.confirmationService.state().confirmText, " ");
} }
export class ConfirmationModalComponent {
    constructor() {
        this.confirmationService = inject(ConfirmationService);
    }
    static { this.ɵfac = function ConfirmationModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConfirmationModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConfirmationModalComponent, selectors: [["app-confirmation-modal"]], decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-[99]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in", "no-print"], [1, "bg-white", "rounded-xl", "shadow-2xl", "w-full", "max-w-sm", "overflow-hidden", "border", "border-slate-200"], [1, "p-6"], [1, "flex", "items-start", "gap-4"], [1, "w-10", "h-10", "rounded-full", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "text-lg"], [1, "font-bold", "text-slate-800", "mb-1"], [1, "text-sm", "text-slate-600", "whitespace-pre-wrap"], [1, "bg-slate-50", "p-4", "flex", "justify-end", "gap-3"], [1, "px-4", "py-2", "text-slate-600", "hover:bg-slate-100", "rounded-lg", "font-bold", "text-sm", "transition", 3, "click"], [1, "px-4", "py-2", "text-white", "rounded-lg", "font-bold", "text-sm", "shadow-md", "transition", 3, "click"]], template: function ConfirmationModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ConfirmationModalComponent_Conditional_0_Template, 16, 9, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.confirmationService.state().isVisible ? 0 : -1);
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConfirmationModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-confirmation-modal',
                standalone: true,
                imports: [CommonModule],
                template: `
    @if (confirmationService.state().isVisible) {
      <div class="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in no-print">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                   [class]="confirmationService.state().isDangerous ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'">
                <i class="fa-solid text-lg" [class]="confirmationService.state().isDangerous ? 'fa-triangle-exclamation' : 'fa-circle-question'"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 mb-1">Xác Nhận Hành Động</h3>
                <p class="text-sm text-slate-600 whitespace-pre-wrap">{{ confirmationService.state().message }}</p>
              </div>
            </div>
          </div>
          <div class="bg-slate-50 p-4 flex justify-end gap-3">
            <button (click)="confirmationService.onCancel()" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-sm transition">
              {{ confirmationService.state().cancelText }}
            </button>
            <button (click)="confirmationService.onConfirm()" class="px-4 py-2 text-white rounded-lg font-bold text-sm shadow-md transition"
                    [class]="confirmationService.state().isDangerous ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'">
              {{ confirmationService.state().confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConfirmationModalComponent, { className: "ConfirmationModalComponent", filePath: "src/app/shared/components/confirmation-modal/confirmation-modal.component.ts", lineNumber: 40 }); })();
//# sourceMappingURL=confirmation-modal.component.js.map