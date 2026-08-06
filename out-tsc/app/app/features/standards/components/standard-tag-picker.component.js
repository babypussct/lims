import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatMethodOptionLabel, formatMethodOptionLabelCompact } from '../services/standard-tag.utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
function StandardTagPickerComponent_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 7);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("value", option_r1.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatOptionLabel(option_r1));
} }
function StandardTagPickerComponent_For_16_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 16);
    i0.ɵɵlistener("click", function StandardTagPickerComponent_For_16_Conditional_3_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const key_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.removeTag(key_r4)); });
    i0.ɵɵtext(1, "\u00D7");
    i0.ɵɵelementEnd();
} }
function StandardTagPickerComponent_For_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 10)(1, "span", 14);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, StandardTagPickerComponent_For_16_Conditional_3_Template, 2, 0, "button", 15);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const key_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("title", ctx_r1.resolveLabel(key_r4));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.resolveCompactLabel(key_r4));
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r1.disabled() ? 3 : -1);
} }
function StandardTagPickerComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 11);
    i0.ɵɵtext(1, "Ch\u01B0a g\u00E1n nh\u00E3n.");
    i0.ɵɵelementEnd();
} }
function StandardTagPickerComponent_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 17);
    i0.ɵɵlistener("click", function StandardTagPickerComponent_Conditional_18_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearTags()); });
    i0.ɵɵtext(1, "X\u00F3a t\u1EA5t c\u1EA3 nh\u00E3n");
    i0.ɵɵelementEnd();
} }
function StandardTagPickerComponent_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("\u0110\u00E3 \u0111\u1EA1t gi\u1EDBi h\u1EA1n ", ctx_r1.max(), " nh\u00E3n.");
} }
/**
 * Shared picker for persisted standard/request tags.
 *
 * Device labels are intentionally not selectable here: they are derived from
 * the selected method tag and are kept as UI metadata only.
 */
export class StandardTagPickerComponent {
    constructor() {
        this.selectedKeys = input([]);
        this.options = input([]);
        this.max = input(100);
        this.label = input('Nhãn');
        this.disabled = input(false);
        this.allowClear = input(true);
        this.selectedKeysChange = output();
        this.tagToAdd = signal('');
        this.availableOptions = computed(() => {
            const selected = new Set(this.selectedKeys());
            return this.options().filter(option => option.selectable && !selected.has(option.key));
        });
        this.limitReached = computed(() => this.selectedKeys().length >= this.max());
    }
    addTag() {
        const key = this.tagToAdd();
        if (!key || this.disabled() || this.limitReached() || this.selectedKeys().includes(key))
            return;
        this.selectedKeysChange.emit([...this.selectedKeys(), key]);
        this.tagToAdd.set('');
    }
    removeTag(key) {
        if (this.disabled())
            return;
        this.selectedKeysChange.emit(this.selectedKeys().filter(item => item !== key));
    }
    clearTags() {
        if (this.disabled() || !this.allowClear())
            return;
        this.selectedKeysChange.emit([]);
    }
    resolveLabel(key) {
        const option = this.options().find(item => item.key === key);
        return option ? formatMethodOptionLabel(option) : `[Đã lưu trữ] ${key}`;
    }
    resolveCompactLabel(key) {
        const option = this.options().find(item => item.key === key);
        return option ? formatMethodOptionLabelCompact(option) : `[Đã lưu trữ] ${key}`;
    }
    formatOptionLabel(option) {
        return formatMethodOptionLabel(option);
    }
    static { this.ɵfac = function StandardTagPickerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardTagPickerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardTagPickerComponent, selectors: [["app-standard-tag-picker"]], inputs: { selectedKeys: [1, "selectedKeys"], options: [1, "options"], max: [1, "max"], label: [1, "label"], disabled: [1, "disabled"], allowClear: [1, "allowClear"] }, outputs: { selectedKeysChange: "selectedKeysChange" }, decls: 20, vars: 9, consts: [[1, "space-y-2"], [1, "flex", "items-center", "justify-between", "gap-2"], [1, "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wide"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "flex", "gap-2"], [1, "min-w-0", "flex-1", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "px-3", "py-2", "text-sm", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500", "disabled:opacity-50", 3, "ngModelChange", "ngModel", "disabled"], ["value", ""], [3, "value"], ["type", "button", 1, "rounded-lg", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "px-3", "py-2", "text-xs", "font-black", "disabled:opacity-40", 3, "click", "disabled"], [1, "min-h-8", "flex", "flex-wrap", "gap-1.5"], [1, "inline-flex", "max-w-full", "items-start", "gap-1", "rounded-lg", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-300", "border", "border-indigo-100", "dark:border-indigo-800", "px-2.5", "py-1", "text-[11px]", "font-bold", 3, "title"], [1, "text-[11px]", "text-slate-400", "dark:text-slate-500", "italic"], ["type", "button", 1, "text-[11px]", "font-bold", "text-red-500", "hover:text-red-600"], [1, "text-[11px]", "font-bold", "text-amber-600", "dark:text-amber-400"], [1, "min-w-0", "line-clamp-2", "break-words"], ["type", "button", "aria-label", "G\u1EE1 nh\u00E3n", 1, "shrink-0", "text-indigo-400", "hover:text-red-500"], ["type", "button", "aria-label", "G\u1EE1 nh\u00E3n", 1, "shrink-0", "text-indigo-400", "hover:text-red-500", 3, "click"], ["type", "button", 1, "text-[11px]", "font-bold", "text-red-500", "hover:text-red-600", 3, "click"]], template: function StandardTagPickerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "label", 2);
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "span", 3);
            i0.ɵɵtext(5);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 4)(7, "select", 5);
            i0.ɵɵlistener("ngModelChange", function StandardTagPickerComponent_Template_select_ngModelChange_7_listener($event) { return ctx.tagToAdd.set($event); });
            i0.ɵɵelementStart(8, "option", 6);
            i0.ɵɵtext(9, "Ch\u1ECDn nh\u00E3n trong danh m\u1EE5c...");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(10, StandardTagPickerComponent_For_11_Template, 2, 2, "option", 7, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "button", 8);
            i0.ɵɵlistener("click", function StandardTagPickerComponent_Template_button_click_12_listener() { return ctx.addTag(); });
            i0.ɵɵtext(13, "Th\u00EAm");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div", 9);
            i0.ɵɵrepeaterCreate(15, StandardTagPickerComponent_For_16_Template, 4, 3, "span", 10, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵtemplate(17, StandardTagPickerComponent_Conditional_17_Template, 2, 0, "span", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(18, StandardTagPickerComponent_Conditional_18_Template, 2, 0, "button", 12)(19, StandardTagPickerComponent_Conditional_19_Template, 2, 1, "p", 13);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.label());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2("", ctx.selectedKeys().length, "/", ctx.max(), "");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngModel", ctx.tagToAdd())("disabled", ctx.disabled() || ctx.limitReached());
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.availableOptions());
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.disabled() || !ctx.tagToAdd() || ctx.limitReached());
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.selectedKeys());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.selectedKeys().length === 0 ? 17 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.selectedKeys().length > 0 && !ctx.disabled() && ctx.allowClear() ? 18 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.limitReached() ? 19 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardTagPickerComponent, [{
        type: Component,
        args: [{
                selector: 'app-standard-tag-picker',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    <div class="space-y-2">
      <div class="flex items-center justify-between gap-2">
        <label class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ label() }}</label>
        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500">{{ selectedKeys().length }}/{{ max() }}</span>
      </div>

      <div class="flex gap-2">
        <select
          [ngModel]="tagToAdd()"
          (ngModelChange)="tagToAdd.set($event)"
          [disabled]="disabled() || limitReached()"
          class="min-w-0 flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <option value="">Chọn nhãn trong danh mục...</option>
          @for (option of availableOptions(); track option.key) {
            <option [value]="option.key">{{ formatOptionLabel(option) }}</option>
          }
        </select>
        <button
          type="button"
          (click)="addTag()"
          [disabled]="disabled() || !tagToAdd() || limitReached()"
          class="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-xs font-black disabled:opacity-40"
        >Thêm</button>
      </div>

      <div class="min-h-8 flex flex-wrap gap-1.5">
        @for (key of selectedKeys(); track key) {
          <span class="inline-flex max-w-full items-start gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 px-2.5 py-1 text-[11px] font-bold" [title]="resolveLabel(key)">
            <span class="min-w-0 line-clamp-2 break-words">{{ resolveCompactLabel(key) }}</span>
            @if (!disabled()) {
              <button type="button" (click)="removeTag(key)" class="shrink-0 text-indigo-400 hover:text-red-500" aria-label="Gỡ nhãn">×</button>
            }
          </span>
        }
        @if (selectedKeys().length === 0) {
          <span class="text-[11px] text-slate-400 dark:text-slate-500 italic">Chưa gán nhãn.</span>
        }
      </div>

      @if (selectedKeys().length > 0 && !disabled() && allowClear()) {
        <button type="button" (click)="clearTags()" class="text-[11px] font-bold text-red-500 hover:text-red-600">Xóa tất cả nhãn</button>
      }
      @if (limitReached()) {
        <p class="text-[11px] font-bold text-amber-600 dark:text-amber-400">Đã đạt giới hạn {{ max() }} nhãn.</p>
      }
    </div>
  `,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardTagPickerComponent, { className: "StandardTagPickerComponent", filePath: "src/app/features/standards/components/standard-tag-picker.component.ts", lineNumber: 67 }); })();
//# sourceMappingURL=standard-tag-picker.component.js.map