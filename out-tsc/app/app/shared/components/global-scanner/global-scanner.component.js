import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrGlobalService } from '../../../core/services/qr-global.service';
import { QrScannerComponent } from '../qr-scanner/qr-scanner.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function GlobalScannerComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 1)(1, "div", 2)(2, "button", 3);
    i0.ɵɵlistener("click", function GlobalScannerComponent_Conditional_0_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.close()); });
    i0.ɵɵelement(3, "i", 4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 5);
    i0.ɵɵtext(5, " M\u00E1y qu\u00E9t Th\u00F4ng minh ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "div", 6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 7)(8, "app-qr-scanner", 8);
    i0.ɵɵlistener("scanSuccess", function GlobalScannerComponent_Conditional_0_Template_app_qr_scanner_scanSuccess_8_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onScanSuccess($event)); })("scanError", function GlobalScannerComponent_Conditional_0_Template_app_qr_scanner_scanError_8_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onScanError($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 9)(10, "div", 10)(11, "p", 11);
    i0.ɵɵtext(12, "Ho\u1EB7c nh\u1EADp m\u00E3 th\u1EE7 c\u00F4ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 12)(14, "input", 13, 0);
    i0.ɵɵtwoWayListener("ngModelChange", function GlobalScannerComponent_Conditional_0_Template_input_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.manualCode, $event) || (ctx_r1.manualCode = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("keyup.enter", function GlobalScannerComponent_Conditional_0_Template_input_keyup_enter_14_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSubmitManual()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "button", 14);
    i0.ɵɵlistener("click", function GlobalScannerComponent_Conditional_0_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSubmitManual()); });
    i0.ɵɵelement(17, "i", 15);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.manualCode);
} }
export class GlobalScannerComponent {
    constructor() {
        this.qrService = inject(QrGlobalService);
        this.manualCode = '';
    }
    close() {
        this.qrService.stopScan();
        this.manualCode = '';
    }
    onScanSuccess(code) {
        this.qrService.handleResult(code);
    }
    onScanError(err) {
        // Silent fail or simple log, scanner component handles UI feedback usually
    }
    onSubmitManual() {
        if (this.manualCode.trim()) {
            this.qrService.handleResult(this.manualCode);
            this.manualCode = '';
        }
    }
    static { this.ɵfac = function GlobalScannerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GlobalScannerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: GlobalScannerComponent, selectors: [["app-global-scanner"]], decls: 1, vars: 1, consts: [["manualInput", ""], [1, "fixed", "inset-0", "z-[150]", "bg-black/90", "backdrop-blur-sm", "fade-in", "flex", "flex-col", "h-full", "animate-fade-in"], [1, "absolute", "top-0", "left-0", "w-full", "p-4", "z-20", "flex", "justify-between", "items-center", "bg-gradient-to-b", "from-black/80", "to-transparent"], [1, "w-10", "h-10", "rounded-full", "bg-white/20", "backdrop-blur-md", "flex", "items-center", "justify-center", "text-white", "active:scale-95", "transition", "hover:bg-white/30", 3, "click"], [1, "fa-solid", "fa-arrow-left"], [1, "text-white", "font-bold", "text-sm", "bg-black/40", "px-3", "py-1", "rounded-full", "border", "border-white/10", "backdrop-blur-md"], [1, "w-10"], [1, "flex-1", "relative"], [3, "scanSuccess", "scanError"], [1, "bg-slate-900", "border-t", "border-white/10", "p-4", "pb-8", "md:pb-4", "shrink-0"], [1, "max-w-md", "mx-auto"], [1, "text-xs", "text-slate-400", "text-center", "mb-2", "font-medium"], [1, "flex", "gap-2"], ["placeholder", "INV-001...", 1, "flex-1", "bg-slate-800", "border", "border-slate-700", "rounded-xl", "px-4", "py-3", "text-white", "font-mono", "font-bold", "outline-none", "focus:border-blue-500", "transition", "placeholder-slate-600", "uppercase", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "px-4", "py-3", "bg-blue-600", "text-white", "rounded-xl", "font-bold", "hover:bg-blue-700", "transition", "active:scale-95", "shadow-lg", "shadow-blue-900/20", 3, "click"], [1, "fa-solid", "fa-arrow-right"]], template: function GlobalScannerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, GlobalScannerComponent_Conditional_0_Template, 18, 1, "div", 1);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.qrService.isScanning() ? 0 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel, QrScannerComponent], styles: [".animate-fade-in[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out; }\n    @keyframes _ngcontent-%COMP%_fadeIn { from { opacity: 0; } to { opacity: 1; } }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GlobalScannerComponent, [{
        type: Component,
        args: [{ selector: 'app-global-scanner', standalone: true, imports: [CommonModule, FormsModule, QrScannerComponent], template: `
    @if (qrService.isScanning()) {
      <div class="fixed inset-0 z-[150] bg-black/90 backdrop-blur-sm fade-in flex flex-col h-full animate-fade-in">
          
          <!-- Header -->
          <div class="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
              <button (click)="close()" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition hover:bg-white/30">
                  <i class="fa-solid fa-arrow-left"></i>
              </button>
              <div class="text-white font-bold text-sm bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  Máy quét Thông minh
              </div>
              <div class="w-10"></div> <!-- Spacer -->
          </div>

          <!-- Scanner View -->
          <div class="flex-1 relative">
              <app-qr-scanner 
                  (scanSuccess)="onScanSuccess($event)" 
                  (scanError)="onScanError($event)">
              </app-qr-scanner>
          </div>

          <!-- Manual Input Footer -->
          <div class="bg-slate-900 border-t border-white/10 p-4 pb-8 md:pb-4 shrink-0">
              <div class="max-w-md mx-auto">
                  <p class="text-xs text-slate-400 text-center mb-2 font-medium">Hoặc nhập mã thủ công</p>
                  <div class="flex gap-2">
                      <input #manualInput
                             [(ngModel)]="manualCode" 
                             (keyup.enter)="onSubmitManual()"
                             class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono font-bold outline-none focus:border-blue-500 transition placeholder-slate-600 uppercase"
                             placeholder="INV-001...">
                      <button (click)="onSubmitManual()" 
                              class="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-900/20">
                          <i class="fa-solid fa-arrow-right"></i>
                      </button>
                  </div>
              </div>
          </div>
      </div>
    }
  `, styles: ["\n    .animate-fade-in { animation: fadeIn 0.3s ease-out; }\n    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(GlobalScannerComponent, { className: "GlobalScannerComponent", filePath: "src/app/shared/components/global-scanner/global-scanner.component.ts", lineNumber: 60 }); })();
//# sourceMappingURL=global-scanner.component.js.map