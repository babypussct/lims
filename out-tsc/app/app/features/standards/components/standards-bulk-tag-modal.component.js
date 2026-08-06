import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatMethodOptionLabel } from '../services/standard-tag.utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
function StandardsBulkTagModalComponent_Conditional_0_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵelement(1, "i", 25);
    i0.ɵɵtext(2, "REPLACE s\u1EBD x\u00F3a c\u00E1c nh\u00E3n c\u0169 kh\u1ECFi t\u1EEBng l\u1ECD. H\u00E3y x\u00E1c nh\u1EADn k\u1EF9.");
    i0.ɵɵelementEnd();
} }
function StandardsBulkTagModalComponent_Conditional_0_For_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r3 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("value", option_r3.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatTagLabel(option_r3));
} }
function StandardsBulkTagModalComponent_Conditional_0_For_35_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "span", 20);
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "button", 26);
    i0.ɵɵlistener("click", function StandardsBulkTagModalComponent_Conditional_0_For_35_Template_button_click_2_listener() { const key_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.removeTag(key_r5)); });
    i0.ɵɵtext(3, "\u00D7");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const key_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("title", ctx_r1.resolveLabel(key_r5));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.resolveLabel(key_r5));
} }
function StandardsBulkTagModalComponent_Conditional_0_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 21);
    i0.ɵɵtext(1, "Ch\u01B0a ch\u1ECDn nh\u00E3n (REPLACE r\u1ED7ng = x\u00F3a to\u00E0n b\u1ED9).");
    i0.ɵɵelementEnd();
} }
function StandardsBulkTagModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3);
    i0.ɵɵtext(5, "G\u00E1n nh\u00E3n h\u00E0ng lo\u1EA1t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 4);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 5);
    i0.ɵɵlistener("click", function StandardsBulkTagModalComponent_Conditional_0_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.cancel.emit()); });
    i0.ɵɵelement(9, "i", 6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 7)(11, "div")(12, "label", 8);
    i0.ɵɵtext(13, "Ch\u1EBF \u0111\u1ED9");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "select", 9);
    i0.ɵɵlistener("ngModelChange", function StandardsBulkTagModalComponent_Conditional_0_Template_select_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.mode.set($event)); });
    i0.ɵɵelementStart(15, "option", 10);
    i0.ɵɵtext(16, "ADD \u00B7 Th\u00EAm v\u00E0o nh\u00E3n hi\u1EC7n c\u00F3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "option", 11);
    i0.ɵɵtext(18, "REMOVE \u00B7 G\u1EE1 nh\u00E3n \u0111\u00E3 ch\u1ECDn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "option", 12);
    i0.ɵɵtext(20, "REPLACE \u00B7 Thay th\u1EBF to\u00E0n b\u1ED9");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(21, StandardsBulkTagModalComponent_Conditional_0_Conditional_21_Template, 3, 0, "div", 13);
    i0.ɵɵelementStart(22, "div")(23, "label", 8);
    i0.ɵɵtext(24, "Nh\u00E3n trong danh m\u1EE5c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "div", 14)(26, "select", 15);
    i0.ɵɵlistener("ngModelChange", function StandardsBulkTagModalComponent_Conditional_0_Template_select_ngModelChange_26_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.tagToAdd.set($event)); });
    i0.ɵɵelementStart(27, "option", 16);
    i0.ɵɵtext(28, "Ch\u1ECDn nh\u00E3n...");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(29, StandardsBulkTagModalComponent_Conditional_0_For_30_Template, 2, 2, "option", 17, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "button", 18);
    i0.ɵɵlistener("click", function StandardsBulkTagModalComponent_Conditional_0_Template_button_click_31_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addTag()); });
    i0.ɵɵtext(32, "Th\u00EAm");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(33, "div", 19);
    i0.ɵɵrepeaterCreate(34, StandardsBulkTagModalComponent_Conditional_0_For_35_Template, 4, 2, "span", 20, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵtemplate(36, StandardsBulkTagModalComponent_Conditional_0_Conditional_36_Template, 2, 0, "span", 21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "div", 22)(38, "button", 23);
    i0.ɵɵlistener("click", function StandardsBulkTagModalComponent_Conditional_0_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.cancel.emit()); });
    i0.ɵɵtext(39, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "button", 24);
    i0.ɵɵlistener("click", function StandardsBulkTagModalComponent_Conditional_0_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.confirmSelection()); });
    i0.ɵɵtext(41);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1("", ctx_r1.selectedCount(), " l\u1ECD \u0111\u01B0\u1EE3c ch\u1ECDn \u00B7 ADD l\u00E0 m\u1EB7c \u0111\u1ECBnh an to\u00E0n");
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngModel", ctx_r1.mode());
    i0.ɵɵadvance(7);
    i0.ɵɵconditional(ctx_r1.mode() === "REPLACE" ? 21 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r1.tagToAdd());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.tagOptions());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.tagToAdd());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.tags());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.tags().length === 0 ? 36 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.isProcessing() ? "\u0110ang l\u01B0u..." : "X\u00E1c nh\u1EADn");
} }
export class StandardsBulkTagModalComponent {
    constructor() {
        this.isOpen = input(false);
        this.selectedCount = input(0);
        this.tagOptions = input([]);
        this.isProcessing = input(false);
        this.cancel = output();
        this.confirm = output();
        this.mode = signal('ADD');
        this.tags = signal([]);
        this.tagToAdd = signal('');
    }
    formatTagLabel(option) {
        return formatMethodOptionLabel(option);
    }
    addTag() {
        const key = this.tagToAdd();
        if (!key || this.tags().includes(key))
            return;
        this.tags.update(current => [...current, key]);
        this.tagToAdd.set('');
    }
    removeTag(key) {
        this.tags.update(current => current.filter(item => item !== key));
    }
    resolveLabel(key) {
        const option = this.tagOptions().find(item => item.key === key);
        return option ? formatMethodOptionLabel(option) : key;
    }
    confirmSelection() {
        if (this.isProcessing())
            return;
        this.confirm.emit({ tags: this.tags(), mode: this.mode() });
    }
    static { this.ɵfac = function StandardsBulkTagModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsBulkTagModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsBulkTagModalComponent, selectors: [["app-standards-bulk-tag-modal"]], inputs: { isOpen: [1, "isOpen"], selectedCount: [1, "selectedCount"], tagOptions: [1, "tagOptions"], isProcessing: [1, "isProcessing"] }, outputs: { cancel: "cancel", confirm: "confirm" }, decls: 1, vars: 1, consts: [["role", "dialog", "aria-modal", "true", 1, "fixed", "inset-0", "z-[600]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm"], [1, "w-full", "max-w-lg", "rounded-[2rem]", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "shadow-2xl", "overflow-hidden"], [1, "px-6", "py-5", "border-b", "border-slate-100", "dark:border-slate-800", "flex", "items-center", "justify-between"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "text-xs", "text-slate-500", "mt-1"], [1, "w-8", "h-8", "rounded-full", "hover:bg-slate-100", "dark:hover:bg-slate-800", "text-slate-400", 3, "click"], [1, "fa-solid", "fa-times"], [1, "p-6", "space-y-5"], [1, "block", "text-xs", "font-black", "text-slate-500", "uppercase", "mb-2"], [1, "w-full", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "px-3", "py-2", "text-sm", "font-bold", 3, "ngModelChange", "ngModel"], ["value", "ADD"], ["value", "REMOVE"], ["value", "REPLACE"], [1, "rounded-xl", "border", "border-red-200", "bg-red-50", "dark:bg-red-900/20", "px-3", "py-2", "text-xs", "font-bold", "text-red-700", "dark:text-red-300"], [1, "flex", "gap-2"], [1, "min-w-0", "flex-1", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "px-3", "py-2", "text-sm", "font-bold", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "rounded-xl", "bg-indigo-600", "px-4", "py-2", "text-white", "font-bold", "disabled:opacity-40", 3, "click", "disabled"], [1, "min-h-10", "flex", "flex-wrap", "gap-2"], [1, "inline-flex", "items-center", "gap-1", "rounded-full", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-300", "border", "border-indigo-100", "dark:border-indigo-800", "px-3", "py-1", "text-xs", "font-bold", 3, "title"], [1, "text-xs", "text-slate-400", "italic"], [1, "px-6", "py-4", "border-t", "border-slate-100", "dark:border-slate-800", "flex", "justify-end", "gap-2"], [1, "px-4", "py-2", "rounded-xl", "text-sm", "font-bold", "text-slate-500", "hover:bg-slate-100", "dark:hover:bg-slate-800", 3, "click"], [1, "px-5", "py-2", "rounded-xl", "bg-fuchsia-600", "text-white", "text-sm", "font-black", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"], [1, "text-indigo-400", "hover:text-red-500", 3, "click"]], template: function StandardsBulkTagModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsBulkTagModalComponent_Conditional_0_Template, 42, 8, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen() ? 0 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsBulkTagModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-bulk-tag-modal',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" role="dialog" aria-modal="true">
        <div class="w-full max-w-lg rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div><h3 class="text-lg font-black text-slate-800 dark:text-slate-100">Gán nhãn hàng loạt</h3><p class="text-xs text-slate-500 mt-1">{{selectedCount()}} lọ được chọn · ADD là mặc định an toàn</p></div>
            <button (click)="cancel.emit()" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="p-6 space-y-5">
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase mb-2">Chế độ</label>
              <select [ngModel]="mode()" (ngModelChange)="mode.set($event)" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                <option value="ADD">ADD · Thêm vào nhãn hiện có</option>
                <option value="REMOVE">REMOVE · Gỡ nhãn đã chọn</option>
                <option value="REPLACE">REPLACE · Thay thế toàn bộ</option>
              </select>
            </div>
            @if (mode() === 'REPLACE') { <div class="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs font-bold text-red-700 dark:text-red-300"><i class="fa-solid fa-triangle-exclamation mr-1"></i>REPLACE sẽ xóa các nhãn cũ khỏi từng lọ. Hãy xác nhận kỹ.</div> }
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase mb-2">Nhãn trong danh mục</label>
              <div class="flex gap-2">
                <select [ngModel]="tagToAdd()" (ngModelChange)="tagToAdd.set($event)" class="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                  <option value="">Chọn nhãn...</option>
                  @for (option of tagOptions(); track option.key) { <option [value]="option.key">{{formatTagLabel(option)}}</option> }
                </select>
                <button (click)="addTag()" [disabled]="!tagToAdd()" class="rounded-xl bg-indigo-600 px-4 py-2 text-white font-bold disabled:opacity-40">Thêm</button>
              </div>
            </div>
            <div class="min-h-10 flex flex-wrap gap-2">
              @for (key of tags(); track key) {
                <span class="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 px-3 py-1 text-xs font-bold" [title]="resolveLabel(key)">{{resolveLabel(key)}}<button (click)="removeTag(key)" class="text-indigo-400 hover:text-red-500">×</button></span>
              }
              @if (tags().length === 0) { <span class="text-xs text-slate-400 italic">Chưa chọn nhãn (REPLACE rỗng = xóa toàn bộ).</span> }
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button (click)="cancel.emit()" class="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Hủy</button>
            <button (click)="confirmSelection()" [disabled]="isProcessing()" class="px-5 py-2 rounded-xl bg-fuchsia-600 text-white text-sm font-black disabled:opacity-50">{{isProcessing() ? 'Đang lưu...' : 'Xác nhận'}}</button>
          </div>
        </div>
      </div>
    }
  `,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsBulkTagModalComponent, { className: "StandardsBulkTagModalComponent", filePath: "src/app/features/standards/components/standards-bulk-tag-modal.component.ts", lineNumber: 55 }); })();
//# sourceMappingURL=standards-bulk-tag-modal.component.js.map