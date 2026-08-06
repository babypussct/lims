import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class QuickGenerateSampleModalComponent {
    constructor() {
        this.close = new EventEmitter();
        this.generated = new EventEmitter();
        this.prefix = signal('');
        this.fromStr = signal('');
        this.toStr = signal('');
        this.suffix = signal('');
        this.autoSuffix = signal(true);
    }
    get currentDaySuffix() {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return String(d.getDate()).padStart(2, '0');
    }
    get effectiveSuffix() {
        return this.autoSuffix() ? this.currentDaySuffix : this.suffix();
    }
    canGenerate() {
        const from = parseInt(this.fromStr(), 10);
        const to = parseInt(this.toStr(), 10);
        if (this.fromStr() && !isNaN(from)) {
            if (this.toStr() && !isNaN(to)) {
                return from <= to;
            }
            return true; // Only 'From' is provided
        }
        return false;
    }
    generateList() {
        if (!this.canGenerate())
            return [];
        const from = parseInt(this.fromStr(), 10);
        const to = parseInt(this.toStr(), 10);
        const padding = this.fromStr().length;
        const results = [];
        const end = !isNaN(to) ? to : from;
        const currentSuffix = this.effectiveSuffix;
        for (let i = from; i <= end; i++) {
            const numStr = i.toString().padStart(padding, '0');
            results.push(`${this.prefix()}${numStr}${currentSuffix}`);
        }
        return results;
    }
    previewResult() {
        const list = this.generateList();
        if (list.length === 0)
            return '';
        if (list.length > 5) {
            return list.slice(0, 5).join(', ') + ` ... (và ${list.length - 5} mẫu khác)`;
        }
        return list.join(', ');
    }
    generate() {
        const list = this.generateList();
        if (list.length > 0) {
            this.generated.emit(list);
        }
    }
    static { this.ɵfac = function QuickGenerateSampleModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || QuickGenerateSampleModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QuickGenerateSampleModalComponent, selectors: [["app-quick-generate-sample-modal"]], outputs: { close: "close", generated: "generated" }, decls: 47, vars: 8, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "rounded-3xl", "shadow-2xl", "w-full", "max-w-md", "p-8", "animate-bounce-in", "relative", "overflow-hidden"], [1, "absolute", "top-0", "left-0", "w-full", "h-2", "bg-indigo-500"], [1, "flex", "justify-between", "items-start", "mb-6"], [1, "font-black", "text-xl", "text-slate-800", "mb-1"], [1, "text-sm", "text-slate-500"], [1, "w-8", "h-8", "rounded-full", "bg-slate-100", "text-slate-500", "hover:bg-slate-200", "hover:text-slate-700", "transition", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "space-y-4"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase", "mb-1", "block"], ["type", "text", "placeholder", "VD: U", 1, "w-full", "px-4", "py-2.5", "border", "border-slate-200", "rounded-xl", "text-sm", "focus:border-indigo-500", "focus:ring-1", "focus:ring-indigo-200", "outline-none", "transition", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-2", "gap-4"], ["type", "text", "placeholder", "VD: 01", 1, "w-full", "px-4", "py-2.5", "border", "border-slate-200", "rounded-xl", "text-sm", "focus:border-indigo-500", "focus:ring-1", "focus:ring-indigo-200", "outline-none", "transition", 3, "ngModelChange", "ngModel"], [1, "text-[9px]", "text-slate-400", "mt-1", "italic"], ["type", "text", "placeholder", "VD: 03", 1, "w-full", "px-4", "py-2.5", "border", "border-slate-200", "rounded-xl", "text-sm", "focus:border-indigo-500", "focus:ring-1", "focus:ring-indigo-200", "outline-none", "transition", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "justify-between", "mb-1"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase"], [1, "flex", "items-center", "gap-1.5", "cursor-pointer", "group"], ["type", "checkbox", 1, "w-3.5", "h-3.5", "text-indigo-600", "rounded", "border-slate-300", "focus:ring-indigo-500", "transition", "cursor-pointer", 3, "ngModelChange", "ngModel"], [1, "text-[10px]", "font-bold", "text-slate-500", "group-hover:text-indigo-600", "transition"], ["type", "text", "placeholder", "VD: 24", 1, "w-full", "px-4", "py-2.5", "border", "border-slate-200", "rounded-xl", "text-sm", "focus:border-indigo-500", "focus:ring-1", "focus:ring-indigo-200", "outline-none", "transition", "disabled:bg-slate-50", "disabled:text-slate-500", "disabled:border-slate-100", 3, "ngModelChange", "ngModel", "disabled"], [1, "bg-indigo-50", "p-4", "rounded-xl", "border", "border-indigo-100", "mt-4"], [1, "text-[10px]", "font-bold", "text-indigo-400", "uppercase", "mb-2"], [1, "text-sm", "font-mono", "text-indigo-700", "break-words", "max-h-24", "overflow-y-auto", "custom-scrollbar"], [1, "flex", "gap-3", "mt-8"], [1, "flex-1", "py-3", "text-slate-600", "hover:bg-slate-100", "rounded-xl", "font-bold", "text-sm", "transition", 3, "click"], [1, "flex-1", "py-3", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "shadow-indigo-200", "transition", "disabled:opacity-50", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-wand-magic-sparkles"]], template: function QuickGenerateSampleModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵelement(2, "div", 2);
            i0.ɵɵelementStart(3, "div", 3)(4, "div")(5, "h3", 4);
            i0.ɵɵtext(6, "T\u1EA1o Nhanh M\u00E3 M\u1EABu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 5);
            i0.ɵɵtext(8, "T\u1EF1 \u0111\u1ED9ng sinh danh s\u00E1ch m\u00E3 m\u1EABu theo quy t\u1EAFc.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "button", 6);
            i0.ɵɵlistener("click", function QuickGenerateSampleModalComponent_Template_button_click_9_listener() { return ctx.close.emit(); });
            i0.ɵɵelement(10, "i", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "div", 8)(12, "div")(13, "label", 9);
            i0.ɵɵtext(14, "Ti\u1EC1n t\u1ED1 (Prefix)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "input", 10);
            i0.ɵɵlistener("ngModelChange", function QuickGenerateSampleModalComponent_Template_input_ngModelChange_15_listener($event) { return ctx.prefix.set($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "div", 11)(17, "div")(18, "label", 9);
            i0.ɵɵtext(19, "T\u1EEB s\u1ED1 (B\u1EAFt \u0111\u1EA7u)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "input", 12);
            i0.ɵɵlistener("ngModelChange", function QuickGenerateSampleModalComponent_Template_input_ngModelChange_20_listener($event) { return ctx.fromStr.set($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "p", 13);
            i0.ɵɵtext(22, "S\u1EBD gi\u1EEF nguy\u00EAn s\u1ED1 0 \u1EDF \u0111\u1EA7u");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(23, "div")(24, "label", 9);
            i0.ɵɵtext(25, "\u0110\u1EBFn s\u1ED1 (K\u1EBFt th\u00FAc)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "input", 14);
            i0.ɵɵlistener("ngModelChange", function QuickGenerateSampleModalComponent_Template_input_ngModelChange_26_listener($event) { return ctx.toStr.set($event); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(27, "div")(28, "div", 15)(29, "label", 16);
            i0.ɵɵtext(30, "H\u1EADu t\u1ED1 (Suffix)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "label", 17)(32, "input", 18);
            i0.ɵɵlistener("ngModelChange", function QuickGenerateSampleModalComponent_Template_input_ngModelChange_32_listener($event) { return ctx.autoSuffix.set($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "span", 19);
            i0.ɵɵtext(34, "T\u1EF1 \u0111\u1ED9ng l\u1EA5y ng\u00E0y (dd-1)");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(35, "input", 20);
            i0.ɵɵlistener("ngModelChange", function QuickGenerateSampleModalComponent_Template_input_ngModelChange_35_listener($event) { return !ctx.autoSuffix() && ctx.suffix.set($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(36, "div", 21)(37, "div", 22);
            i0.ɵɵtext(38, "Xem tr\u01B0\u1EDBc k\u1EBFt qu\u1EA3");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "div", 23);
            i0.ɵɵtext(40);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(41, "div", 24)(42, "button", 25);
            i0.ɵɵlistener("click", function QuickGenerateSampleModalComponent_Template_button_click_42_listener() { return ctx.close.emit(); });
            i0.ɵɵtext(43, "H\u1EE7y");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "button", 26);
            i0.ɵɵlistener("click", function QuickGenerateSampleModalComponent_Template_button_click_44_listener() { return ctx.generate(); });
            i0.ɵɵelement(45, "i", 27);
            i0.ɵɵtext(46, " Ch\u00E8n v\u00E0o Danh S\u00E1ch ");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(15);
            i0.ɵɵproperty("ngModel", ctx.prefix());
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngModel", ctx.fromStr());
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngModel", ctx.toStr());
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngModel", ctx.autoSuffix());
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngModel", ctx.autoSuffix() ? ctx.currentDaySuffix : ctx.suffix())("disabled", ctx.autoSuffix());
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate1(" ", ctx.previewResult() || "Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u", " ");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", !ctx.canGenerate());
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.CheckboxControlValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuickGenerateSampleModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-quick-generate-sample-modal',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-bounce-in relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
            
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h3 class="font-black text-xl text-slate-800 mb-1">Tạo Nhanh Mã Mẫu</h3>
                    <p class="text-sm text-slate-500">Tự động sinh danh sách mã mẫu theo quy tắc.</p>
                </div>
                <button (click)="close.emit()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition flex items-center justify-center">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tiền tố (Prefix)</label>
                    <input type="text" [ngModel]="prefix()" (ngModelChange)="prefix.set($event)" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition" placeholder="VD: U">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Từ số (Bắt đầu)</label>
                        <input type="text" [ngModel]="fromStr()" (ngModelChange)="fromStr.set($event)" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition" placeholder="VD: 01">
                        <p class="text-[9px] text-slate-400 mt-1 italic">Sẽ giữ nguyên số 0 ở đầu</p>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Đến số (Kết thúc)</label>
                        <input type="text" [ngModel]="toStr()" (ngModelChange)="toStr.set($event)" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition" placeholder="VD: 03">
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Hậu tố (Suffix)</label>
                        <label class="flex items-center gap-1.5 cursor-pointer group">
                            <input type="checkbox" [ngModel]="autoSuffix()" (ngModelChange)="autoSuffix.set($event)" class="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 transition cursor-pointer">
                            <span class="text-[10px] font-bold text-slate-500 group-hover:text-indigo-600 transition">Tự động lấy ngày (dd-1)</span>
                        </label>
                    </div>
                    <input type="text" [ngModel]="autoSuffix() ? currentDaySuffix : suffix()" (ngModelChange)="!autoSuffix() && suffix.set($event)" [disabled]="autoSuffix()" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100" placeholder="VD: 24">
                </div>
                
                <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4">
                    <div class="text-[10px] font-bold text-indigo-400 uppercase mb-2">Xem trước kết quả</div>
                    <div class="text-sm font-mono text-indigo-700 break-words max-h-24 overflow-y-auto custom-scrollbar">
                        {{ previewResult() || 'Chưa có dữ liệu' }}
                    </div>
                </div>
            </div>

            <div class="flex gap-3 mt-8">
                <button (click)="close.emit()" class="flex-1 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition">Hủy</button>
                <button (click)="generate()" [disabled]="!canGenerate()" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Chèn vào Danh Sách
                </button>
            </div>
        </div>
    </div>
  `
            }]
    }], null, { close: [{
            type: Output
        }], generated: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(QuickGenerateSampleModalComponent, { className: "QuickGenerateSampleModalComponent", filePath: "src/app/shared/components/quick-generate-sample-modal/quick-generate-sample-modal.component.ts", lineNumber: 71 }); })();
//# sourceMappingURL=quick-generate-sample-modal.component.js.map