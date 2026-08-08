import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatMethodOptionLabel, formatMethodOptionLabelCompact } from '../services/standard-tag.utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
function StandardTagPickerComponent_Conditional_6_Conditional_13_For_7_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 29);
    i0.ɵɵlistener("click", function StandardTagPickerComponent_Conditional_6_Conditional_13_For_7_Template_button_click_0_listener() { const option_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.addTag(option_r5.key)); });
    i0.ɵɵelementStart(1, "span", 30);
    i0.ɵɵelement(2, "i", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 32);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const option_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.formatOptionLabel(option_r5));
} }
function StandardTagPickerComponent_Conditional_6_Conditional_13_ForEmpty_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 25);
    i0.ɵɵtext(1, "Kh\u00F4ng c\u00F2n nh\u00E3n ph\u00F9 h\u1EE3p \u0111\u1EC3 th\u00EAm.");
    i0.ɵɵelementEnd();
} }
function StandardTagPickerComponent_Conditional_6_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 18)(1, "div", 19)(2, "div", 20);
    i0.ɵɵelement(3, "i", 21);
    i0.ɵɵelementStart(4, "input", 22);
    i0.ɵɵlistener("ngModelChange", function StandardTagPickerComponent_Conditional_6_Conditional_13_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.searchTerm.set($event)); })("click", function StandardTagPickerComponent_Conditional_6_Conditional_13_Template_input_click_4_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(5, "div", 23);
    i0.ɵɵrepeaterCreate(6, StandardTagPickerComponent_Conditional_6_Conditional_13_For_7_Template, 5, 1, "button", 24, _forTrack0, false, StandardTagPickerComponent_Conditional_6_Conditional_13_ForEmpty_8_Template, 2, 0, "div", 25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 26)(10, "span", 27);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 28);
    i0.ɵɵlistener("click", function StandardTagPickerComponent_Conditional_6_Conditional_13_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeDropdown()); });
    i0.ɵɵtext(13, "Xong");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.searchTerm());
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.filteredOptions());
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("\u0110\u00E3 ch\u1ECDn ", ctx_r1.selectedKeys().length, " nh\u00E3n");
} }
function StandardTagPickerComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 4)(1, "div", 10);
    i0.ɵɵelement(2, "i", 11);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "B\u1EA1n c\u00F3 th\u1EC3 ch\u1ECDn nhi\u1EC1u nh\u00E3n li\u00EAn ti\u1EBFp trong c\u00F9ng m\u1ED9t l\u1EA7n m\u1EDF danh s\u00E1ch.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 12)(6, "button", 13);
    i0.ɵɵlistener("click", function StandardTagPickerComponent_Conditional_6_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleDropdown()); });
    i0.ɵɵelement(7, "i", 14);
    i0.ɵɵelementStart(8, "span", 15);
    i0.ɵɵtext(9, "Ch\u1ECDn nhi\u1EC1u nh\u00E3n trong danh m\u1EE5c...");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span", 16);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(12, "i", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(13, StandardTagPickerComponent_Conditional_6_Conditional_13_Template, 14, 3, "div", 18);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵattribute("aria-expanded", ctx_r1.dropdownOpen());
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.availableOptions().length, " c\u00F2n l\u1EA1i");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("rotate-180", ctx_r1.dropdownOpen());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.dropdownOpen() ? 13 : -1);
} }
function StandardTagPickerComponent_For_9_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 35);
    i0.ɵɵlistener("click", function StandardTagPickerComponent_For_9_Conditional_3_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const key_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.removeTag(key_r7)); });
    i0.ɵɵtext(1, "\u00D7");
    i0.ɵɵelementEnd();
} }
function StandardTagPickerComponent_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 6)(1, "span", 33);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, StandardTagPickerComponent_For_9_Conditional_3_Template, 2, 0, "button", 34);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const key_r7 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("title", ctx_r1.resolveLabel(key_r7));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.resolveCompactLabel(key_r7));
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r1.disabled() ? 3 : -1);
} }
function StandardTagPickerComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 7);
    i0.ɵɵtext(1, "Ch\u01B0a g\u00E1n nh\u00E3n.");
    i0.ɵɵelementEnd();
} }
function StandardTagPickerComponent_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function StandardTagPickerComponent_Conditional_11_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearTags()); });
    i0.ɵɵtext(1, "X\u00F3a t\u1EA5t c\u1EA3 nh\u00E3n");
    i0.ɵɵelementEnd();
} }
function StandardTagPickerComponent_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
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
        this.elementRef = inject((ElementRef));
        this.selectedKeys = input([]);
        this.options = input([]);
        this.max = input(100);
        this.label = input('Nhãn');
        this.disabled = input(false);
        this.allowClear = input(true);
        this.selectedKeysChange = output();
        this.dropdownOpen = signal(false);
        this.searchTerm = signal('');
        this.availableOptions = computed(() => {
            const selected = new Set(this.selectedKeys());
            return this.options().filter(option => option.selectable && !selected.has(option.key));
        });
        this.filteredOptions = computed(() => {
            const query = this.searchTerm().trim().toLocaleLowerCase('vi');
            if (!query)
                return this.availableOptions();
            return this.availableOptions().filter(option => formatMethodOptionLabel(option).toLocaleLowerCase('vi').includes(query));
        });
        this.limitReached = computed(() => this.selectedKeys().length >= this.max());
    }
    onDocumentClick(event) {
        if (this.dropdownOpen() && !this.elementRef.nativeElement.contains(event.target)) {
            this.closeDropdown();
        }
    }
    toggleDropdown() {
        if (this.disabled() || this.limitReached())
            return;
        this.dropdownOpen.update(open => !open);
        if (!this.dropdownOpen())
            this.searchTerm.set('');
    }
    closeDropdown() {
        this.dropdownOpen.set(false);
        this.searchTerm.set('');
    }
    addTag(key) {
        if (!key || this.disabled() || this.limitReached() || this.selectedKeys().includes(key))
            return;
        this.selectedKeysChange.emit([...this.selectedKeys(), key]);
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
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardTagPickerComponent, selectors: [["app-standard-tag-picker"]], hostBindings: function StandardTagPickerComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function StandardTagPickerComponent_click_HostBindingHandler($event) { return ctx.onDocumentClick($event); }, false, i0.ɵɵresolveDocument);
        } }, inputs: { selectedKeys: [1, "selectedKeys"], options: [1, "options"], max: [1, "max"], label: [1, "label"], disabled: [1, "disabled"], allowClear: [1, "allowClear"] }, outputs: { selectedKeysChange: "selectedKeysChange" }, decls: 13, vars: 7, consts: [[1, "space-y-2"], [1, "flex", "items-center", "justify-between", "gap-2"], [1, "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wide"], [1, "rounded-full", "bg-slate-100", "dark:bg-slate-800", "px-2", "py-0.5", "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400"], [1, "rounded-xl", "border", "border-indigo-200", "dark:border-indigo-800/70", "bg-indigo-50/60", "dark:bg-indigo-900/15", "p-2.5"], [1, "min-h-8", "flex", "flex-wrap", "gap-1.5"], [1, "inline-flex", "max-w-full", "items-start", "gap-1", "rounded-lg", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-300", "border", "border-indigo-100", "dark:border-indigo-800", "px-2.5", "py-1", "text-[11px]", "font-bold", 3, "title"], [1, "text-[11px]", "text-slate-400", "dark:text-slate-500", "italic"], ["type", "button", 1, "text-[11px]", "font-bold", "text-red-500", "hover:text-red-600"], [1, "text-[11px]", "font-bold", "text-amber-600", "dark:text-amber-400"], [1, "mb-2", "flex", "items-start", "gap-2", "text-[11px]", "font-bold", "text-indigo-700", "dark:text-indigo-300"], [1, "fa-solid", "fa-layer-group", "mt-0.5", "shrink-0"], [1, "relative", "min-w-0"], ["type", "button", 1, "flex", "w-full", "min-w-0", "items-center", "gap-2", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "px-3", "py-2.5", "text-left", "text-sm", "text-slate-700", "dark:text-slate-200", "shadow-sm", "outline-none", "transition", "hover:border-indigo-300", "dark:hover:border-indigo-700", "focus:ring-2", "focus:ring-indigo-500/30", 3, "click"], [1, "fa-solid", "fa-tags", "shrink-0", "text-indigo-500"], [1, "min-w-0", "flex-1", "font-bold"], [1, "shrink-0", "text-[10px]", "font-bold", "text-slate-400"], [1, "fa-solid", "fa-chevron-down", "shrink-0", "text-[10px]", "text-slate-400", "transition-transform"], [1, "absolute", "left-0", "right-0", "top-full", "z-40", "mt-1.5", "overflow-hidden", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "shadow-2xl"], [1, "border-b", "border-slate-100", "dark:border-slate-800", "p-2"], [1, "relative"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-[11px]", "text-slate-400"], ["type", "text", "placeholder", "T\u00ECm nhanh nh\u00E3n...", 1, "w-full", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "py-2", "pl-8", "pr-3", "text-xs", "font-medium", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:border-indigo-400", "focus:ring-2", "focus:ring-indigo-500/20", 3, "ngModelChange", "click", "ngModel"], [1, "max-h-56", "overflow-y-auto", "p-1.5", "custom-scrollbar"], ["type", "button", 1, "flex", "w-full", "min-w-0", "items-start", "gap-2", "rounded-lg", "px-2.5", "py-2", "text-left", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/25"], [1, "px-3", "py-5", "text-center", "text-xs", "italic", "text-slate-400"], [1, "flex", "items-center", "justify-between", "gap-2", "border-t", "border-slate-100", "dark:border-slate-800", "bg-slate-50/80", "dark:bg-slate-800/50", "px-3", "py-2"], [1, "text-[10px]", "font-bold", "text-slate-400"], ["type", "button", 1, "rounded-lg", "bg-indigo-600", "px-3", "py-1.5", "text-[11px]", "font-black", "text-white", "hover:bg-indigo-700", 3, "click"], ["type", "button", 1, "flex", "w-full", "min-w-0", "items-start", "gap-2", "rounded-lg", "px-2.5", "py-2", "text-left", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/25", 3, "click"], [1, "mt-0.5", "flex", "h-4", "w-4", "shrink-0", "items-center", "justify-center", "rounded", "border", "border-indigo-200", "dark:border-indigo-700", "bg-indigo-50", "dark:bg-indigo-900/30", "text-[9px]", "text-indigo-600", "dark:text-indigo-300"], [1, "fa-solid", "fa-plus"], [1, "min-w-0", "flex-1", "text-xs", "font-bold", "leading-snug", "text-slate-700", "dark:text-slate-200", "break-words"], [1, "min-w-0", "line-clamp-2", "break-words"], ["type", "button", "aria-label", "G\u1EE1 nh\u00E3n", 1, "shrink-0", "text-indigo-400", "hover:text-red-500"], ["type", "button", "aria-label", "G\u1EE1 nh\u00E3n", 1, "shrink-0", "text-indigo-400", "hover:text-red-500", 3, "click"], ["type", "button", 1, "text-[11px]", "font-bold", "text-red-500", "hover:text-red-600", 3, "click"]], template: function StandardTagPickerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "label", 2);
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "span", 3);
            i0.ɵɵtext(5);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(6, StandardTagPickerComponent_Conditional_6_Template, 14, 5, "div", 4);
            i0.ɵɵelementStart(7, "div", 5);
            i0.ɵɵrepeaterCreate(8, StandardTagPickerComponent_For_9_Template, 4, 3, "span", 6, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵtemplate(10, StandardTagPickerComponent_Conditional_10_Template, 2, 0, "span", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(11, StandardTagPickerComponent_Conditional_11_Template, 2, 0, "button", 8)(12, StandardTagPickerComponent_Conditional_12_Template, 2, 1, "p", 9);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.label());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2("", ctx.selectedKeys().length, "/", ctx.max(), " nh\u00E3n");
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.disabled() && !ctx.limitReached() ? 6 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.selectedKeys());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.selectedKeys().length === 0 ? 10 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.selectedKeys().length > 0 && !ctx.disabled() && ctx.allowClear() ? 11 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.limitReached() ? 12 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
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
        <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-black text-slate-500 dark:text-slate-400">{{ selectedKeys().length }}/{{ max() }} nhãn</span>
      </div>

      @if (!disabled() && !limitReached()) {
        <div class="rounded-xl border border-indigo-200 dark:border-indigo-800/70 bg-indigo-50/60 dark:bg-indigo-900/15 p-2.5">
          <div class="mb-2 flex items-start gap-2 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
            <i class="fa-solid fa-layer-group mt-0.5 shrink-0"></i>
            <span>Bạn có thể chọn nhiều nhãn liên tiếp trong cùng một lần mở danh sách.</span>
          </div>

          <div class="relative min-w-0">
            <button
              type="button"
              (click)="toggleDropdown()"
              [attr.aria-expanded]="dropdownOpen()"
              class="flex w-full min-w-0 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 shadow-sm outline-none transition hover:border-indigo-300 dark:hover:border-indigo-700 focus:ring-2 focus:ring-indigo-500/30"
            >
              <i class="fa-solid fa-tags shrink-0 text-indigo-500"></i>
              <span class="min-w-0 flex-1 font-bold">Chọn nhiều nhãn trong danh mục...</span>
              <span class="shrink-0 text-[10px] font-bold text-slate-400">{{ availableOptions().length }} còn lại</span>
              <i class="fa-solid fa-chevron-down shrink-0 text-[10px] text-slate-400 transition-transform" [class.rotate-180]="dropdownOpen()"></i>
            </button>

            @if (dropdownOpen()) {
              <div class="absolute left-0 right-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
                <div class="border-b border-slate-100 dark:border-slate-800 p-2">
                  <div class="relative">
                    <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400"></i>
                    <input
                      type="text"
                      [ngModel]="searchTerm()"
                      (ngModelChange)="searchTerm.set($event)"
                      (click)="$event.stopPropagation()"
                      class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-8 pr-3 text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Tìm nhanh nhãn..."
                    >
                  </div>
                </div>

                <div class="max-h-56 overflow-y-auto p-1.5 custom-scrollbar">
                  @for (option of filteredOptions(); track option.key) {
                    <button
                      type="button"
                      (click)="addTag(option.key)"
                      class="flex w-full min-w-0 items-start gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/25"
                    >
                      <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-[9px] text-indigo-600 dark:text-indigo-300">
                        <i class="fa-solid fa-plus"></i>
                      </span>
                      <span class="min-w-0 flex-1 text-xs font-bold leading-snug text-slate-700 dark:text-slate-200 break-words">{{ formatOptionLabel(option) }}</span>
                    </button>
                  } @empty {
                    <div class="px-3 py-5 text-center text-xs italic text-slate-400">Không còn nhãn phù hợp để thêm.</div>
                  }
                </div>

                <div class="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 px-3 py-2">
                  <span class="text-[10px] font-bold text-slate-400">Đã chọn {{ selectedKeys().length }} nhãn</span>
                  <button type="button" (click)="closeDropdown()" class="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-black text-white hover:bg-indigo-700">Xong</button>
                </div>
              </div>
            }
          </div>
        </div>
      }

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
    }], null, { onDocumentClick: [{
            type: HostListener,
            args: ['document:click', ['$event']]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardTagPickerComponent, { className: "StandardTagPickerComponent", filePath: "src/app/features/standards/components/standard-tag-picker.component.ts", lineNumber: 110 }); })();
//# sourceMappingURL=standard-tag-picker.component.js.map