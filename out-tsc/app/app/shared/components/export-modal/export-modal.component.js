import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
const _c0 = ["*"];
function ExportModalComponent_Conditional_8_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.dateRangeText);
} }
function ExportModalComponent_Conditional_8_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.subtitle);
} }
function ExportModalComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵtemplate(1, ExportModalComponent_Conditional_8_Conditional_1_Template, 2, 1, "span", 16)(2, ExportModalComponent_Conditional_8_Conditional_2_Template, 2, 1, "span", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.dateRangeText ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.subtitle ? 2 : -1);
} }
function ExportModalComponent_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9)(1, "div", 18);
    i0.ɵɵelement(2, "i", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "div", 20);
    i0.ɵɵtext(5, "Ho\u00E0n t\u1EA5t! File \u0111\u00E3 \u0111\u01B0\u1EE3c t\u1EA3i xu\u1ED1ng.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 21);
    i0.ɵɵtext(7, "H\u00E3y ki\u1EC3m tra th\u01B0 m\u1EE5c T\u1EA3i xu\u1ED1ng.");
    i0.ɵɵelementEnd()()();
} }
function ExportModalComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.footerText, " ");
} }
function ExportModalComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 22);
    i0.ɵɵlistener("click", function ExportModalComponent_Conditional_20_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onExecute()); });
    i0.ɵɵelement(1, "i", 23);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r0.isExporting || ctx_r0.isSubmitDisabled);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.isCompleted ? "Xu\u1EA5t l\u1EA1i" : ctx_r0.submitButtonText, " ");
} }
function ExportModalComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 15);
    i0.ɵɵelement(1, "span", 24);
    i0.ɵɵtext(2, " \u0110ang X\u1EED L\u00FD... ");
    i0.ɵɵelementEnd();
} }
export class ExportModalComponent {
    constructor() {
        this.title = 'Xuất báo cáo';
        this.subtitle = '';
        this.dateRangeText = '';
        this.iconClass = 'fa-solid fa-file-export';
        this.footerText = '';
        this.submitButtonText = 'Xuất tệp';
        this.isExporting = false;
        this.isCompleted = false;
        this.isSubmitDisabled = false;
        this.close = new EventEmitter();
        this.execute = new EventEmitter();
    }
    onBackdropClick(event) {
        if (event.target === event.currentTarget && !this.isExporting) {
            this.close.emit();
        }
    }
    onClose() {
        this.close.emit();
    }
    onExecute() {
        this.execute.emit();
    }
    static { this.ɵfac = function ExportModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ExportModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ExportModalComponent, selectors: [["app-export-modal"]], inputs: { title: "title", subtitle: "subtitle", dateRangeText: "dateRangeText", iconClass: "iconClass", footerText: "footerText", submitButtonText: "submitButtonText", isExporting: "isExporting", isCompleted: "isCompleted", isSubmitDisabled: "isSubmitDisabled" }, outputs: { close: "close", execute: "execute" }, ngContentSelectors: _c0, decls: 22, vars: 9, consts: [[1, "fixed", "inset-0", "z-[60]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm", "animate-fade-in", 3, "click"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "shadow-2xl", "w-full", "max-w-2xl", "overflow-hidden", "animate-scale-in", "border", "border-slate-200", "dark:border-slate-700", "max-h-[90vh]", "flex", "flex-col"], [1, "p-5", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "justify-between", "items-center", "bg-gradient-to-r", "from-indigo-50/50", "to-purple-50/50", "dark:from-indigo-900/10", "dark:to-purple-900/10", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-100", "flex", "items-center", "gap-2.5", "text-lg"], [1, "w-9", "h-9", "rounded-xl", "bg-gradient-to-br", "from-indigo-500", "to-purple-600", "flex", "items-center", "justify-center", "text-white", "shadow-lg", "shadow-indigo-300/30"], [1, "flex", "items-center", "gap-2", "mt-1", "ml-[46px]"], [1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-full", "hover:bg-slate-200", "dark:hover:bg-slate-700", "text-slate-500", "dark:text-slate-400", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-times"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar"], [1, "m-5", "p-4", "bg-emerald-50", "dark:bg-emerald-900/20", "border", "border-emerald-200", "dark:border-emerald-800", "rounded-2xl", "flex", "items-center", "gap-3"], [1, "p-5", "border-t", "border-slate-100", "dark:border-slate-700", "bg-slate-50/80", "dark:bg-slate-900/50", "flex", "gap-3", "justify-between", "items-center", "shrink-0"], [1, "text-[10px]", "text-slate-400", "font-medium"], [1, "flex", "gap-3"], [1, "px-5", "py-2.5", "rounded-2xl", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-700", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "px-8", "py-2.5", "rounded-2xl", "font-black", "text-white", "bg-gradient-to-r", "from-indigo-600", "to-purple-600", "hover:from-indigo-700", "hover:to-purple-700", "shadow-xl", "shadow-indigo-200/50", "dark:shadow-none", "transition", "flex", "items-center", "gap-2", "disabled:opacity-50", "active:scale-95", 3, "disabled"], ["disabled", "", 1, "px-8", "py-2.5", "rounded-2xl", "font-black", "text-white", "bg-slate-400", "dark:bg-slate-600", "transition", "flex", "items-center", "gap-2", "opacity-70", "cursor-not-allowed"], [1, "text-[10px]", "text-slate-500", "font-bold", "uppercase", "tracking-wider"], [1, "text-[10px]", "bg-blue-100", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "px-2", "py-0.5", "rounded-full", "font-bold"], [1, "w-10", "h-10", "rounded-xl", "bg-emerald-500", "text-white", "flex", "items-center", "justify-center", "text-lg", "shadow-lg", "shadow-emerald-200"], [1, "fa-solid", "fa-check-double"], [1, "text-sm", "font-black", "text-emerald-700", "dark:text-emerald-400"], [1, "text-[11px]", "text-emerald-600", "dark:text-emerald-500"], [1, "px-8", "py-2.5", "rounded-2xl", "font-black", "text-white", "bg-gradient-to-r", "from-indigo-600", "to-purple-600", "hover:from-indigo-700", "hover:to-purple-700", "shadow-xl", "shadow-indigo-200/50", "dark:shadow-none", "transition", "flex", "items-center", "gap-2", "disabled:opacity-50", "active:scale-95", 3, "click", "disabled"], [1, "fa-solid", "fa-cloud-arrow-down"], [1, "w-4", "h-4", "border-2", "border-white", "border-t-transparent", "rounded-full", "animate-spin"]], template: function ExportModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵlistener("click", function ExportModalComponent_Template_div_click_0_listener($event) { return ctx.onBackdropClick($event); });
            i0.ɵɵelementStart(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3)(5, "div", 4);
            i0.ɵɵelement(6, "i");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(8, ExportModalComponent_Conditional_8_Template, 3, 2, "div", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "button", 6);
            i0.ɵɵlistener("click", function ExportModalComponent_Template_button_click_9_listener() { return ctx.onClose(); });
            i0.ɵɵelement(10, "i", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "div", 8);
            i0.ɵɵprojection(12);
            i0.ɵɵtemplate(13, ExportModalComponent_Conditional_13_Template, 8, 0, "div", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "div", 10)(15, "div", 11);
            i0.ɵɵtemplate(16, ExportModalComponent_Conditional_16_Template, 1, 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "div", 12)(18, "button", 13);
            i0.ɵɵlistener("click", function ExportModalComponent_Template_button_click_18_listener() { return ctx.onClose(); });
            i0.ɵɵtext(19, "\u0110\u00F3ng");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(20, ExportModalComponent_Conditional_20_Template, 3, 2, "button", 14)(21, ExportModalComponent_Conditional_21_Template, 3, 0, "button", 15);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵclassMap(ctx.iconClass + " text-sm");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.title, " ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.subtitle || ctx.dateRangeText ? 8 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.isExporting);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.isCompleted ? 13 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.footerText && !ctx.isExporting ? 16 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.isExporting);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.isExporting || ctx.isCompleted ? 20 : 21);
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ExportModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-export-modal',
                standalone: true,
                imports: [CommonModule],
                template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="onBackdropClick($event)">
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
            
            <!-- Header -->
            <div class="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 shrink-0">
                <div>
                    <h3 class="font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5 text-lg">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-300/30">
                            <i [class]="iconClass + ' text-sm'"></i>
                        </div>
                        {{ title }}
                    </h3>
                    @if (subtitle || dateRangeText) {
                        <div class="flex items-center gap-2 mt-1 ml-[46px]">
                            @if (dateRangeText) {
                                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{{ dateRangeText }}</span>
                            }
                            @if (subtitle) {
                                <span class="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">{{ subtitle }}</span>
                            }
                        </div>
                    }
                </div>
                <button (click)="onClose()" [disabled]="isExporting" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition disabled:opacity-50">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                <ng-content></ng-content>
                
                <!-- Progress complete -->
                @if (isCompleted) {
                    <div class="m-5 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-lg shadow-emerald-200">
                            <i class="fa-solid fa-check-double"></i>
                        </div>
                        <div>
                            <div class="text-sm font-black text-emerald-700 dark:text-emerald-400">Hoàn tất! File đã được tải xuống.</div>
                            <div class="text-[11px] text-emerald-600 dark:text-emerald-500">Hãy kiểm tra thư mục Tải xuống.</div>
                        </div>
                    </div>
                }
            </div>

            <!-- Footer -->
            <div class="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50 flex gap-3 justify-between items-center shrink-0">
                <div class="text-[10px] text-slate-400 font-medium">
                    @if (footerText && !isExporting) {
                        {{ footerText }}
                    }
                </div>
                <div class="flex gap-3">
                    <button (click)="onClose()" [disabled]="isExporting" class="px-5 py-2.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50">Đóng</button>
                    @if (!isExporting || isCompleted) {
                        <button (click)="onExecute()" 
                                [disabled]="isExporting || isSubmitDisabled"
                                class="px-8 py-2.5 rounded-2xl font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200/50 dark:shadow-none transition flex items-center gap-2 disabled:opacity-50 active:scale-95">
                            <i class="fa-solid fa-cloud-arrow-down"></i>
                            {{ isCompleted ? 'Xuất lại' : submitButtonText }}
                        </button>
                    } @else {
                        <button disabled
                                class="px-8 py-2.5 rounded-2xl font-black text-white bg-slate-400 dark:bg-slate-600 transition flex items-center gap-2 opacity-70 cursor-not-allowed">
                            <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Đang Xử Lý...
                        </button>
                    }
                </div>
            </div>
        </div>
    </div>
  `
            }]
    }], null, { title: [{
            type: Input
        }], subtitle: [{
            type: Input
        }], dateRangeText: [{
            type: Input
        }], iconClass: [{
            type: Input
        }], footerText: [{
            type: Input
        }], submitButtonText: [{
            type: Input
        }], isExporting: [{
            type: Input
        }], isCompleted: [{
            type: Input
        }], isSubmitDisabled: [{
            type: Input
        }], close: [{
            type: Output
        }], execute: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ExportModalComponent, { className: "ExportModalComponent", filePath: "src/app/shared/components/export-modal/export-modal.component.ts", lineNumber: 84 }); })();
//# sourceMappingURL=export-modal.component.js.map