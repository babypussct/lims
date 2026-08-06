import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
function MergeRunsModalComponent_Conditional_0_For_18_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 13)(1, "input", 20);
    i0.ɵɵlistener("change", function MergeRunsModalComponent_Conditional_0_For_18_Template_input_change_1_listener() { const run_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onMasterCurveChange(run_r4.id)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 21)(3, "span", 22);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 23);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const run_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", run_r4.id)("checked", ctx_r1.masterCurveRunId === run_r4.id);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(run_r4.sopName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", (run_r4.inputs == null ? null : run_r4.inputs["batchCode"]) || run_r4.id, " \u2014 ", run_r4.user, "");
} }
function MergeRunsModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3)(5, "span", 4);
    i0.ɵɵelement(6, "i", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(7, " C\u1EA5u H\u00ECnh G\u1ED9p M\u1EBB Ch\u1EA1y ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 6);
    i0.ɵɵtext(9, "H\u1EE3p nh\u1EA5t m\u1EABu t\u1EEB nhi\u1EC1u m\u1EBB ch\u1EA1y v\u00E0o 1 phi\u1EBFu duy nh\u1EA5t.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "button", 7);
    i0.ɵɵlistener("click", function MergeRunsModalComponent_Conditional_0_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal()); });
    i0.ɵɵelement(11, "i", 8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 9)(13, "div", 10)(14, "label", 11);
    i0.ɵɵtext(15, "M\u1EBB l\u1EA5y \u0111\u01B0\u1EDDng chu\u1EA9n ch\u00EDnh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 12);
    i0.ɵɵrepeaterCreate(17, MergeRunsModalComponent_Conditional_0_For_18_Template, 7, 5, "label", 13, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 10)(20, "label", 11);
    i0.ɵɵtext(21, "Ng\u00E0y ph\u00E2n t\u00EDch hi\u1EC3n th\u1ECB tr\u00EAn phi\u1EBFu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "input", 14);
    i0.ɵɵlistener("input", function MergeRunsModalComponent_Conditional_0_Template_input_input_22_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onUnifiedDateStringChange($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "div", 10)(24, "label", 11);
    i0.ɵɵtext(25, "M\u00E3 m\u1EBB t\u1ED5ng h\u1EE3p (t\u00F9y ch\u1EC9nh)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "input", 15);
    i0.ɵɵlistener("input", function MergeRunsModalComponent_Conditional_0_Template_input_input_26_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCustomMasterIdChange($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(27, "div", 16)(28, "button", 17);
    i0.ɵɵlistener("click", function MergeRunsModalComponent_Conditional_0_Template_button_click_28_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal()); });
    i0.ɵɵtext(29, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "button", 18);
    i0.ɵɵlistener("click", function MergeRunsModalComponent_Conditional_0_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.executeMerge()); });
    i0.ɵɵelement(31, "i", 19);
    i0.ɵɵtext(32, " T\u1EA1o M\u1EBB G\u1ED9p ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(17);
    i0.ɵɵrepeater(ctx_r1.selectedRuns);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("value", ctx_r1.unifiedDateString);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("value", ctx_r1.customMasterId);
} }
export class MergeRunsModalComponent {
    constructor() {
        this.isOpen = false;
        this.selectedRuns = [];
        this.masterCurveRunId = '';
        this.unifiedDateString = '';
        this.customMasterId = '';
        this.close = new EventEmitter();
        this.masterCurveRunIdChange = new EventEmitter();
        this.unifiedDateStringChange = new EventEmitter();
        this.customMasterIdChange = new EventEmitter();
        this.merge = new EventEmitter();
    }
    closeModal() {
        this.close.emit();
    }
    onMasterCurveChange(runId) {
        this.masterCurveRunIdChange.emit(runId);
    }
    onUnifiedDateStringChange(event) {
        const input = event.target;
        this.unifiedDateStringChange.emit(input.value);
    }
    onCustomMasterIdChange(event) {
        const input = event.target;
        this.customMasterIdChange.emit(input.value);
    }
    executeMerge() {
        this.merge.emit();
    }
    static { this.ɵfac = function MergeRunsModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MergeRunsModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MergeRunsModalComponent, selectors: [["app-merge-runs-modal"]], inputs: { isOpen: "isOpen", selectedRuns: "selectedRuns", masterCurveRunId: "masterCurveRunId", unifiedDateString: "unifiedDateString", customMasterId: "customMasterId" }, outputs: { close: "close", masterCurveRunIdChange: "masterCurveRunIdChange", unifiedDateStringChange: "unifiedDateStringChange", customMasterIdChange: "customMasterIdChange", merge: "merge" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "bg-slate-950/50", "backdrop-blur-sm", "flex", "items-center", "justify-center", "p-4", "z-50", "animate-fade-in"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "max-w-md", "w-full", "border", "border-slate-200/80", "dark:border-slate-800", "shadow-2xl", "p-6", "space-y-5"], [1, "flex", "justify-between", "items-start"], [1, "text-base", "font-black", "text-slate-800", "dark:text-slate-100", "flex", "items-center", "gap-2"], [1, "w-7", "h-7", "bg-fuchsia-100", "dark:bg-fuchsia-950/40", "rounded-lg", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-code-merge", "rotate-90", "text-fuchsia-600", "dark:text-fuchsia-400", "text-xs"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "mt-1", "ml-9"], [1, "w-8", "h-8", "rounded-xl", "hover:bg-slate-100", "dark:hover:bg-slate-800", "text-slate-400", "hover:text-slate-600", "flex", "items-center", "justify-center", "transition", "active:scale-90", "border-0", "bg-transparent", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-xmark", "text-sm"], [1, "space-y-4", "text-xs"], [1, "flex", "flex-col", "gap-1.5"], [1, "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "space-y-2", "max-h-48", "overflow-y-auto", "custom-scrollbar"], [1, "flex", "items-center", "gap-3", "p-3", "bg-slate-50", "dark:bg-slate-950/40", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "cursor-pointer", "hover:bg-slate-100/50", "transition"], ["type", "text", "placeholder", "V\u00ED d\u1EE5: 22/05/2026 - 23/05/2026", 1, "w-full", "px-3", "py-2", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "focus:outline-none", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "dark:text-slate-200", "font-bold", "text-xs", 3, "input", "value"], ["type", "text", 1, "w-full", "px-3", "py-2", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "focus:outline-none", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "dark:text-slate-200", "font-mono", "font-bold", "uppercase", "text-xs", 3, "input", "value"], [1, "flex", "justify-end", "gap-2", "pt-2", "border-t", "border-slate-100", "dark:border-slate-800"], [1, "px-4", "py-2", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-350", "rounded-xl", "text-xs", "font-black", "transition", "active:scale-95", "border-0", "cursor-pointer", 3, "click"], [1, "px-5", "py-2", "bg-gradient-to-r", "from-fuchsia-500", "to-pink-500", "hover:from-fuchsia-600", "hover:to-pink-600", "text-white", "rounded-xl", "text-xs", "font-black", "transition", "shadow-md", "shadow-fuchsia-500/10", "active:scale-95", "flex", "items-center", "gap-1.5", "border-0", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-check", "text-[10px]"], ["type", "radio", "name", "masterCurve", 1, "text-fuchsia-600", "focus:ring-fuchsia-500", "cursor-pointer", 3, "change", "value", "checked"], [1, "flex", "flex-col"], [1, "font-extrabold", "text-slate-700", "dark:text-slate-250"], [1, "text-[10px]", "text-slate-400", "font-semibold", "mt-0.5"]], template: function MergeRunsModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, MergeRunsModalComponent_Conditional_0_Template, 33, 2, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen ? 0 : -1);
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MergeRunsModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-merge-runs-modal',
                standalone: true,
                imports: [CommonModule],
                template: `
    @if (isOpen) {
      <div class="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 space-y-5">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span class="w-7 h-7 bg-fuchsia-100 dark:bg-fuchsia-950/40 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-code-merge rotate-90 text-fuchsia-600 dark:text-fuchsia-400 text-xs"></i>
                </span>
                Cấu Hình Gộp Mẻ Chạy
              </h3>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 ml-9">Hợp nhất mẫu từ nhiều mẻ chạy vào 1 phiếu duy nhất.</p>
            </div>
            <button (click)="closeModal()" class="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center transition active:scale-90 border-0 bg-transparent cursor-pointer">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="flex flex-col gap-1.5">
              <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mẻ lấy đường chuẩn chính</label>
              <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                @for (run of selectedRuns; track run.id) {
                  <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100/50 transition">
                    <input type="radio" name="masterCurve" [value]="run.id"
                           [checked]="masterCurveRunId === run.id"
                           (change)="onMasterCurveChange(run.id)"
                           class="text-fuchsia-600 focus:ring-fuchsia-500 cursor-pointer">
                    <div class="flex flex-col">
                      <span class="font-extrabold text-slate-700 dark:text-slate-250">{{ run.sopName }}</span>
                      <span class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ run.inputs?.['batchCode'] || run.id }} — {{ run.user }}</span>
                    </div>
                  </label>
                }
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ngày phân tích hiển thị trên phiếu</label>
              <input type="text" [value]="unifiedDateString" (input)="onUnifiedDateStringChange($event)"
                     placeholder="Ví dụ: 22/05/2026 - 23/05/2026"
                     class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 dark:text-slate-200 font-bold text-xs">
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mã mẻ tổng hợp (tùy chỉnh)</label>
              <input type="text" [value]="customMasterId" (input)="onCustomMasterIdChange($event)"
                     class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 dark:text-slate-200 font-mono font-bold uppercase text-xs">
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button (click)="closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-black transition active:scale-95 border-0 cursor-pointer">Hủy</button>
            <button (click)="executeMerge()" class="px-5 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-xl text-xs font-black transition shadow-md shadow-fuchsia-500/10 active:scale-95 flex items-center gap-1.5 border-0 cursor-pointer">
              <i class="fa-solid fa-check text-[10px]"></i> Tạo Mẻ Gộp
            </button>
          </div>
        </div>
      </div>
    }
  `
            }]
    }], null, { isOpen: [{
            type: Input
        }], selectedRuns: [{
            type: Input
        }], masterCurveRunId: [{
            type: Input
        }], unifiedDateString: [{
            type: Input
        }], customMasterId: [{
            type: Input
        }], close: [{
            type: Output
        }], masterCurveRunIdChange: [{
            type: Output
        }], unifiedDateStringChange: [{
            type: Output
        }], customMasterIdChange: [{
            type: Output
        }], merge: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MergeRunsModalComponent, { className: "MergeRunsModalComponent", filePath: "src/app/features/results/components/merge-runs-modal.component.ts", lineNumber: 71 }); })();
//# sourceMappingURL=merge-runs-modal.component.js.map