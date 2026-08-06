import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function ConfigSafetyComponent_For_40_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 36);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cat_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", cat_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", cat_r3.name, " (", cat_r3.id, ")");
} }
function ConfigSafetyComponent_For_40_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 25)(1, "td", 33)(2, "select", 34);
    i0.ɵɵtwoWayListener("ngModelChange", function ConfigSafetyComponent_For_40_Template_select_ngModelChange_2_listener($event) { const rule_r2 = i0.ɵɵrestoreView(_r1).$implicit; i0.ɵɵtwoWayBindingSet(rule_r2.category, $event) || (rule_r2.category = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementStart(3, "option", 35);
    i0.ɵɵtext(4, "Ch\u1ECDn ph\u00E2n lo\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(5, ConfigSafetyComponent_For_40_For_6_Template, 2, 3, "option", 36, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "td", 37)(8, "div", 38)(9, "input", 39);
    i0.ɵɵtwoWayListener("ngModelChange", function ConfigSafetyComponent_For_40_Template_input_ngModelChange_9_listener($event) { const rule_r2 = i0.ɵɵrestoreView(_r1).$implicit; i0.ɵɵtwoWayBindingSet(rule_r2.margin, $event) || (rule_r2.margin = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span", 40);
    i0.ɵɵtext(11, "%");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "td", 37)(13, "button", 41);
    i0.ɵɵlistener("click", function ConfigSafetyComponent_For_40_Template_button_click_13_listener() { const $index_r4 = i0.ɵɵrestoreView(_r1).$index; const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.removeSafetyRule($index_r4)); });
    i0.ɵɵelement(14, "i", 42);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const rule_r2 = ctx.$implicit;
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", rule_r2.category);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r4.state.categories());
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", rule_r2.margin);
} }
function ConfigSafetyComponent_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 43);
    i0.ɵɵtext(2, "Ch\u01B0a c\u00F3 quy t\u1EAFc ri\u00EAng. H\u1EC7 th\u1ED1ng s\u1EBD d\u00F9ng m\u1EE9c m\u1EB7c \u0111\u1ECBnh.");
    i0.ɵɵelementEnd()();
} }
export class ConfigSafetyComponent {
    constructor() {
        this.state = inject(StateService);
        this.toast = inject(ToastService);
        this.safetyConfigLocal = { defaultMargin: 10, rules: {} };
        this.safetyRulesLocal = signal([]);
    }
    ngOnInit() {
        const sVal = this.state.safetyConfig();
        this.safetyConfigLocal = {
            defaultMargin: sVal.defaultMargin,
            rules: { ...sVal.rules }
        };
        this.safetyRulesLocal.set(Object.entries(sVal.rules).map(([category, margin]) => ({ category, margin })));
    }
    addSafetyRule() { this.safetyRulesLocal.update(r => [...r, { category: '', margin: 10 }]); }
    removeSafetyRule(index) { this.safetyRulesLocal.update(r => r.filter((_, i) => i !== index)); }
    saveSafety() {
        const rulesObj = {};
        this.safetyRulesLocal().forEach(item => { if (item.category && item.category.trim())
            rulesObj[item.category.trim()] = item.margin; });
        const config = { defaultMargin: this.safetyConfigLocal.defaultMargin, rules: rulesObj };
        this.state.saveSafetyConfig(config);
        this.toast.show('Đã lưu cấu hình định mức.', 'success');
    }
    static { this.ɵfac = function ConfigSafetyComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConfigSafetyComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConfigSafetyComponent, selectors: [["app-config-safety"]], decls: 71, vars: 2, consts: [[1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6", "animate-fade-in", "items-start"], [1, "md:col-span-2", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "dark:shadow-none", "border", "border-slate-200", "dark:border-slate-700", "p-6", "flex", "flex-col", "gap-6"], [1, "flex", "justify-between", "items-center"], [1, "font-bold", "text-slate-800", "dark:text-slate-100", "flex", "items-center", "gap-2", "text-base"], [1, "w-8", "h-8", "rounded-lg", "bg-orange-50", "dark:bg-orange-900/20", "text-orange-600", "dark:text-orange-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-percent"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "px-4", "py-2", "bg-orange-600", "hover:bg-orange-700", "dark:bg-orange-500", "dark:hover:bg-orange-600", "text-white", "rounded-lg", "text-xs", "font-bold", "transition", "shadow-sm", "dark:shadow-none", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-floppy-disk"], [1, "bg-orange-50/50", "dark:bg-orange-900/10", "p-4", "rounded-xl", "border", "border-orange-100", "dark:border-orange-900/30", "flex", "items-center", "justify-between"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "uppercase", "block", "mb-1"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400"], [1, "relative", "w-24"], ["type", "number", 1, "w-full", "pl-3", "pr-8", "py-2", "border", "border-orange-200", "dark:border-orange-800/50", "bg-white", "dark:bg-slate-800", "rounded-lg", "font-bold", "text-slate-700", "dark:text-slate-200", "text-center", "outline-none", "focus:ring-2", "focus:ring-orange-200", "dark:focus:ring-orange-800/50", "transition", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-3", "top-2", "text-xs", "font-bold", "text-orange-400", "dark:text-orange-500"], [1, "flex", "justify-between", "items-center", "mb-3"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider"], [1, "text-[10px]", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "text-slate-600", "dark:text-slate-300", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition", 3, "click"], [1, "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "overflow-hidden"], [1, "w-full", "text-sm", "text-left"], [1, "bg-slate-50", "dark:bg-slate-900/50", "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase"], [1, "px-4", "py-3"], [1, "px-4", "py-3", "w-32", "text-center"], [1, "px-4", "py-3", "w-16"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-700/50"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-700/30", "transition", "group"], [1, "bg-indigo-50/50", "dark:bg-indigo-900/10", "rounded-2xl", "border", "border-indigo-100", "dark:border-indigo-900/30", "p-6"], [1, "font-bold", "text-indigo-800", "dark:text-indigo-400", "text-sm", "mb-3", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-circle-info"], [1, "text-xs", "text-slate-600", "dark:text-slate-400", "space-y-3", "list-disc", "pl-4"], [1, "dark:text-slate-300"], [1, "list-circle", "pl-4", "mt-1", "space-y-1", "text-slate-500", "dark:text-slate-500"], [1, "dark:text-slate-400"], [1, "px-4", "py-2"], [1, "w-full", "bg-transparent", "border", "border-transparent", "hover:border-slate-200", "dark:hover:border-slate-600", "focus:border-orange-300", "dark:focus:border-orange-500", "rounded", "px-2", "py-1", "outline-none", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "cursor-pointer", "text-center", "md:text-left", "transition", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", "", "selected", ""], [3, "value"], [1, "px-4", "py-2", "text-center"], [1, "relative", "mx-auto", "w-20"], ["type", "number", 1, "w-full", "pl-2", "pr-6", "py-1", "border", "border-slate-200", "dark:border-slate-600", "bg-transparent", "rounded", "text-center", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-orange-400", "dark:focus:border-orange-500", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-2", "top-1", "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "text-slate-300", "dark:text-slate-500", "hover:text-red-500", "dark:hover:text-red-400", "transition", 3, "click"], [1, "fa-solid", "fa-trash"], ["colspan", "3", 1, "p-6", "text-center", "text-slate-400", "dark:text-slate-500", "italic", "text-xs"]], template: function ConfigSafetyComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3)(5, "div", 4);
            i0.ɵɵelement(6, "i", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(7, " Quy \u0110\u1ECBnh Hao H\u1EE5t (Safety Margin) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 6);
            i0.ɵɵtext(9, "C\u1EA5u h\u00ECnh t\u1EF7 l\u1EC7 hao h\u1EE5t t\u1EF1 \u0111\u1ED9ng d\u1EF1a tr\u00EAn ph\u00E2n lo\u1EA1i h\u00F3a ch\u1EA5t.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(10, "button", 7);
            i0.ɵɵlistener("click", function ConfigSafetyComponent_Template_button_click_10_listener() { return ctx.saveSafety(); });
            i0.ɵɵelement(11, "i", 8);
            i0.ɵɵtext(12, " L\u01B0u C\u1EA5u H\u00ECnh ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "div", 9)(14, "div")(15, "label", 10);
            i0.ɵɵtext(16, "M\u1EE9c Hao h\u1EE5t M\u1EB7c \u0111\u1ECBnh");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "p", 11);
            i0.ɵɵtext(18, "\u00C1p d\u1EE5ng cho c\u00E1c lo\u1EA1i kh\u00F4ng c\u00F3 quy t\u1EAFc ri\u00EAng.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "div", 12)(20, "input", 13);
            i0.ɵɵtwoWayListener("ngModelChange", function ConfigSafetyComponent_Template_input_ngModelChange_20_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.safetyConfigLocal.defaultMargin, $event) || (ctx.safetyConfigLocal.defaultMargin = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "span", 14);
            i0.ɵɵtext(22, "%");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "div")(24, "div", 15)(25, "h4", 16);
            i0.ɵɵtext(26, "Quy T\u1EAFc Chi Ti\u1EBFt theo Lo\u1EA1i (Category)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "button", 17);
            i0.ɵɵlistener("click", function ConfigSafetyComponent_Template_button_click_27_listener() { return ctx.addSafetyRule(); });
            i0.ɵɵtext(28, "+ Th\u00EAm Quy T\u1EAFc");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(29, "div", 18)(30, "table", 19)(31, "thead", 20)(32, "tr")(33, "th", 21);
            i0.ɵɵtext(34, "Lo\u1EA1i H\u00F3a ch\u1EA5t (Category)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "th", 22);
            i0.ɵɵtext(36, "M\u1EE9c Hao h\u1EE5t");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(37, "th", 23);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(38, "tbody", 24);
            i0.ɵɵrepeaterCreate(39, ConfigSafetyComponent_For_40_Template, 15, 2, "tr", 25, i0.ɵɵrepeaterTrackByIndex);
            i0.ɵɵtemplate(41, ConfigSafetyComponent_Conditional_41_Template, 3, 0, "tr");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(42, "div", 26)(43, "h4", 27);
            i0.ɵɵelement(44, "i", 28);
            i0.ɵɵtext(45, " H\u01B0\u1EDBng D\u1EABn ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "ul", 29)(47, "li")(48, "b", 30);
            i0.ɵɵtext(49, "M\u1EE9c m\u1EB7c \u0111\u1ECBnh:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(50, " \u0110\u01B0\u1EE3c \u00E1p d\u1EE5ng cho t\u1EA5t c\u1EA3 c\u00E1c ch\u1EA5t kh\u00F4ng thu\u1ED9c danh s\u00E1ch quy t\u1EAFc ri\u00EAng. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "li")(52, "b", 30);
            i0.ɵɵtext(53, "Ch\u1EBF \u0111\u1ED9 t\u1EF1 \u0111\u1ED9ng:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(54, " Khi ch\u1EA1y tr\u00ECnh t\u00EDnh to\u00E1n ho\u1EB7c ch\u1EE9c n\u0103ng l\u1EADp m\u1EBB, n\u1EBFu b\u1EA1n ch\u1ECDn ch\u1EBF \u0111\u1ED9 hao h\u1EE5t l\u00E0 \"T\u1EF1 \u0111\u1ED9ng\" (ho\u1EB7c \u0111\u1EC3 tr\u1ED1ng), h\u1EC7 th\u1ED1ng s\u1EBD tra c\u1EE9u b\u1EA3ng n\u00E0y. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "li")(56, "b", 30);
            i0.ɵɵtext(57, "G\u1EE3i \u00FD thi\u1EBFt l\u1EADp:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(58, "ul", 31)(59, "li")(60, "i", 32);
            i0.ɵɵtext(61, "Standard (Ch\u1EA5t chu\u1EA9n):");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(62, " 2% (V\u00EC \u0111\u1EAFt ti\u1EC1n).");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(63, "li")(64, "i", 32);
            i0.ɵɵtext(65, "Solvent (Dung m\u00F4i):");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(66, " 15-20% (Do bay h\u01A1i).");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(67, "li")(68, "i", 32);
            i0.ɵɵtext(69, "Reagent (H\u00F3a ch\u1EA5t th\u01B0\u1EDDng):");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(70, " 10%.");
            i0.ɵɵelementEnd()()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(20);
            i0.ɵɵtwoWayProperty("ngModel", ctx.safetyConfigLocal.defaultMargin);
            i0.ɵɵadvance(19);
            i0.ɵɵrepeater(ctx.safetyRulesLocal());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.safetyRulesLocal().length === 0 ? 41 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConfigSafetyComponent, [{
        type: Component,
        args: [{
                selector: 'app-config-safety',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in items-start">
        
        <!-- Safety Config Card -->
        <div class="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-6">
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                        <div class="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center"><i class="fa-solid fa-percent"></i></div>
                        Quy Định Hao Hụt (Safety Margin)
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Cấu hình tỷ lệ hao hụt tự động dựa trên phân loại hóa chất.</p>
                </div>
                <button (click)="saveSafety()" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition shadow-sm dark:shadow-none flex items-center gap-2">
                    <i class="fa-solid fa-floppy-disk"></i> Lưu Cấu Hình
                </button>
            </div>

            <!-- Default Margin -->
            <div class="bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-center justify-between">
                <div>
                    <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Mức Hao hụt Mặc định</label>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400">Áp dụng cho các loại không có quy tắc riêng.</p>
                </div>
                <div class="relative w-24">
                    <input type="number" [(ngModel)]="safetyConfigLocal.defaultMargin" class="w-full pl-3 pr-8 py-2 border border-orange-200 dark:border-orange-800/50 bg-white dark:bg-slate-800 rounded-lg font-bold text-slate-700 dark:text-slate-200 text-center outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800/50 transition">
                    <span class="absolute right-3 top-2 text-xs font-bold text-orange-400 dark:text-orange-500">%</span>
                </div>
            </div>

            <!-- Category Rules Table -->
            <div>
                <div class="flex justify-between items-center mb-3">
                    <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quy Tắc Chi Tiết theo Loại (Category)</h4>
                    <button (click)="addSafetyRule()" class="text-[10px] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold transition">+ Thêm Quy Tắc</button>
                </div>
                
                <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                            <tr>
                                <th class="px-4 py-3">Loại Hóa chất (Category)</th>
                                <th class="px-4 py-3 w-32 text-center">Mức Hao hụt</th>
                                <th class="px-4 py-3 w-16"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                            @for (rule of safetyRulesLocal(); track $index) {
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition group">
                                    <td class="px-4 py-2">
                                        <select [(ngModel)]="rule.category" class="w-full bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-orange-300 dark:focus:border-orange-500 rounded px-2 py-1 outline-none text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-center md:text-left transition">
                                            <option value="" disabled selected>Chọn phân loại</option>
                                            @for(cat of state.categories(); track cat.id) {
                                                <option [value]="cat.id">{{cat.name}} ({{cat.id}})</option>
                                            }
                                        </select>
                                    </td>
                                    <td class="px-4 py-2 text-center">
                                        <div class="relative mx-auto w-20">
                                            <input type="number" [(ngModel)]="rule.margin" class="w-full pl-2 pr-6 py-1 border border-slate-200 dark:border-slate-600 bg-transparent rounded text-center text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-orange-400 dark:focus:border-orange-500">
                                            <span class="absolute right-2 top-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">%</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-2 text-center">
                                        <button (click)="removeSafetyRule($index)" class="text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            }
                            @if(safetyRulesLocal().length === 0) {
                                <tr><td colspan="3" class="p-6 text-center text-slate-400 dark:text-slate-500 italic text-xs">Chưa có quy tắc riêng. Hệ thống sẽ dùng mức mặc định.</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Helper / Info Panel -->
        <div class="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 p-6">
            <h4 class="font-bold text-indigo-800 dark:text-indigo-400 text-sm mb-3 flex items-center gap-2">
                <i class="fa-solid fa-circle-info"></i> Hướng Dẫn
            </h4>
            <ul class="text-xs text-slate-600 dark:text-slate-400 space-y-3 list-disc pl-4">
                <li>
                    <b class="dark:text-slate-300">Mức mặc định:</b> Được áp dụng cho tất cả các chất không thuộc danh sách quy tắc riêng.
                </li>
                <li>
                    <b class="dark:text-slate-300">Chế độ tự động:</b> Khi chạy trình tính toán hoặc chức năng lập mẻ, nếu bạn chọn chế độ hao hụt là "Tự động" (hoặc để trống), hệ thống sẽ tra cứu bảng này.
                </li>
                <li>
                    <b class="dark:text-slate-300">Gợi ý thiết lập:</b>
                    <ul class="list-circle pl-4 mt-1 space-y-1 text-slate-500 dark:text-slate-500">
                        <li><i class="dark:text-slate-400">Standard (Chất chuẩn):</i> 2% (Vì đắt tiền).</li>
                        <li><i class="dark:text-slate-400">Solvent (Dung môi):</i> 15-20% (Do bay hơi).</li>
                        <li><i class="dark:text-slate-400">Reagent (Hóa chất thường):</i> 10%.</li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConfigSafetyComponent, { className: "ConfigSafetyComponent", filePath: "src/app/features/config/components/config-safety.component.ts", lineNumber: 113 }); })();
//# sourceMappingURL=config-safety.component.js.map