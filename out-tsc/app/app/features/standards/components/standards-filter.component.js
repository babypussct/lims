import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatMethodOptionLabel, formatMethodOptionLabelCompact, formatStockSummary } from '../services/standard-tag.utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
const _forTrack1 = ($index, $item) => $item.code;
function StandardsFilterComponent_For_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngValue", option_r1.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.formatTagLabel(option_r1));
} }
function StandardsFilterComponent_For_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 35);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const device_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", device_r3.code);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(device_r3.label);
} }
function StandardsFilterComponent_Conditional_64_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("(L\u1ECDc theo \"", ctx_r1.searchTerm(), "\")");
} }
function StandardsFilterComponent_Conditional_67_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 40);
    i0.ɵɵelement(1, "i", 41);
    i0.ɵɵtext(2, " \u0110ang \u0111\u1ED3ng b\u1ED9...");
    i0.ɵɵelementEnd();
} }
export class StandardsFilterComponent {
    constructor() {
        this.searchTerm = input('');
        this.activeWidgetFilter = input('all');
        this.sortOption = input('received_desc');
        this.viewMode = input('list');
        this.stats = input({ total: 0, expired: 0, expiringSoon: 0, expiring3Months: 0, lowStock: 0 });
        this.visibleCount = input(0);
        this.filteredCount = input(0);
        this.isLoading = input(false);
        this.tagOptions = input([]);
        this.methodTagFilter = input(null);
        this.deviceOptions = input([]);
        this.deviceFilter = input('all');
        this.stockSummary = input({ totalContainers: 0, byUnit: [] });
        this.stockSummaryText = computed(() => formatStockSummary(this.stockSummary()));
        this.searchTermChange = output();
        this.activeWidgetFilterChange = output();
        this.sortOptionChange = output();
        this.viewModeChange = output();
        this.methodTagFilterChange = output();
        this.deviceFilterChange = output();
    }
    formatTagLabel(option) {
        return formatMethodOptionLabelCompact(option);
    }
    selectedMethodTitle() {
        const selected = this.tagOptions().find(option => option.key === this.methodTagFilter());
        return selected ? formatMethodOptionLabel(selected) : 'Tất cả phương pháp';
    }
    onSearchInput(val) {
        this.searchTermChange.emit(val);
    }
    onWidgetFilterChange(val) {
        this.activeWidgetFilterChange.emit(val);
    }
    onSortChange(val) {
        this.sortOptionChange.emit(val);
    }
    onViewModeChange(val) {
        this.viewModeChange.emit(val);
    }
    static { this.ɵfac = function StandardsFilterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsFilterComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsFilterComponent, selectors: [["app-standards-filter"]], inputs: { searchTerm: [1, "searchTerm"], activeWidgetFilter: [1, "activeWidgetFilter"], sortOption: [1, "sortOption"], viewMode: [1, "viewMode"], stats: [1, "stats"], visibleCount: [1, "visibleCount"], filteredCount: [1, "filteredCount"], isLoading: [1, "isLoading"], tagOptions: [1, "tagOptions"], methodTagFilter: [1, "methodTagFilter"], deviceOptions: [1, "deviceOptions"], deviceFilter: [1, "deviceFilter"], stockSummary: [1, "stockSummary"] }, outputs: { searchTermChange: "searchTermChange", activeWidgetFilterChange: "activeWidgetFilterChange", sortOptionChange: "sortOptionChange", viewModeChange: "viewModeChange", methodTagFilterChange: "methodTagFilterChange", deviceFilterChange: "deviceFilterChange" }, decls: 68, vars: 21, consts: [[1, "p-2", "border-b", "border-slate-50", "dark:border-slate-700", "flex", "flex-col", "gap-2", "bg-slate-50/30", "dark:bg-slate-800/50"], [1, "flex", "flex-col", "md:flex-row", "gap-2"], [1, "relative", "flex-1", "group"], [1, "fa-solid", "fa-search", "absolute", "left-2.5", "top-2", "text-slate-400", "dark:text-slate-500", "text-xs", "group-focus-within:text-indigo-500", "dark:group-focus-within:text-indigo-400", "transition-colors"], ["type", "text", "placeholder", "T\u00ECm ki\u1EBFm chu\u1EA9n, m\u00E3 s\u1ED1, s\u1ED1 l\u00F4... (Real-time)", 1, "w-full", "pl-7", "pr-2", "py-1.5", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "text-xs", "font-medium", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", "focus:ring-2", "focus:ring-indigo-500/10", "dark:focus:ring-indigo-500/20", "transition", "shadow-sm", "dark:shadow-none", "placeholder-slate-400", "dark:placeholder-slate-500", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-1.5", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "shadow-sm", "dark:shadow-none", "h-[30px]"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "whitespace-nowrap"], [1, "fa-solid", "fa-filter", "mr-1"], [1, "bg-transparent", "text-[11px]", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "cursor-pointer", "border-none", "py-1", "pr-1", 3, "ngModelChange", "ngModel"], ["value", "all", 1, "dark:bg-slate-800"], ["value", "expired", 1, "dark:bg-slate-800"], ["value", "expiring_soon", 1, "dark:bg-slate-800"], ["value", "expiring_3months", 1, "dark:bg-slate-800"], ["value", "low_stock", 1, "dark:bg-slate-800"], [1, "fa-solid", "fa-arrow-down-short-wide", "mr-1"], ["value", "received_desc", 1, "dark:bg-slate-800"], ["value", "updated_desc", 1, "dark:bg-slate-800"], ["value", "name_asc", 1, "dark:bg-slate-800"], ["value", "name_desc", 1, "dark:bg-slate-800"], ["value", "expiry_asc", 1, "dark:bg-slate-800"], ["value", "expiry_desc", 1, "dark:bg-slate-800"], [1, "flex", "bg-slate-200/50", "dark:bg-slate-700/50", "p-0.5", "rounded-lg", "shrink-0", "h-[30px]", "self-start", "md:self-auto"], ["title", "D\u1EA1ng Danh s\u00E1ch", 1, "w-7", "h-full", "flex", "items-center", "justify-center", "rounded", "transition", 3, "click"], [1, "fa-solid", "fa-list", "text-[11px]"], ["title", "D\u1EA1ng L\u01B0\u1EDBi (Th\u1EBB)", 1, "w-7", "h-full", "flex", "items-center", "justify-center", "rounded", "transition", 3, "click"], [1, "fa-solid", "fa-border-all", "text-[11px]"], [1, "flex", "flex-col", "sm:flex-row", "gap-2"], [1, "flex", "items-center", "gap-1.5", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "shadow-sm", "h-[30px]", "flex-1"], [1, "text-[9px]", "font-bold", "text-slate-400", "uppercase", "whitespace-nowrap"], [1, "fa-solid", "fa-flask", "mr-1"], [1, "min-w-0", "flex-1", "bg-transparent", "text-[11px]", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "cursor-pointer", "border-none", "py-1", 3, "ngModelChange", "ngModel", "title"], [3, "ngValue"], [1, "fa-solid", "fa-microchip", "mr-1"], [1, "min-w-0", "flex-1", "bg-transparent", "text-[11px]", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "cursor-pointer", "border-none", "py-1", 3, "ngModelChange", "ngModel"], ["value", "all"], [3, "value"], [1, "flex", "justify-between", "items-center", "px-1"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "text-indigo-500", "dark:text-indigo-400"], ["title", "T\u1ED3n kho \u0111\u01B0\u1EE3c c\u1ED9ng ri\u00EAng theo t\u1EEBng \u0111\u01A1n v\u1ECB, kh\u00F4ng quy \u0111\u1ED5i ch\u00E9o", 1, "text-[10px]", "font-black", "text-indigo-600", "dark:text-indigo-300", "text-right"], [1, "text-[9px]", "text-blue-500", "dark:text-blue-400", "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-sync", "fa-spin"]], template: function StandardsFilterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵelement(3, "i", 3);
            i0.ɵɵelementStart(4, "input", 4);
            i0.ɵɵlistener("ngModelChange", function StandardsFilterComponent_Template_input_ngModelChange_4_listener($event) { return ctx.onSearchInput($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(5, "div", 5)(6, "span", 6);
            i0.ɵɵelement(7, "i", 7);
            i0.ɵɵtext(8, " L\u1ECDc:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "select", 8);
            i0.ɵɵlistener("ngModelChange", function StandardsFilterComponent_Template_select_ngModelChange_9_listener($event) { return ctx.onWidgetFilterChange($event); });
            i0.ɵɵelementStart(10, "option", 9);
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "option", 10);
            i0.ɵɵtext(13);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "option", 11);
            i0.ɵɵtext(15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "option", 12);
            i0.ɵɵtext(17);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "option", 13);
            i0.ɵɵtext(19);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(20, "div", 5)(21, "span", 6);
            i0.ɵɵelement(22, "i", 14);
            i0.ɵɵtext(23, " S\u1EAFp x\u1EBFp:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "select", 8);
            i0.ɵɵlistener("ngModelChange", function StandardsFilterComponent_Template_select_ngModelChange_24_listener($event) { return ctx.onSortChange($event); });
            i0.ɵɵelementStart(25, "option", 15);
            i0.ɵɵtext(26, "Ng\u00E0y nh\u1EADn (M\u1EDBi nh\u1EA5t)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "option", 16);
            i0.ɵɵtext(28, "M\u1EDBi c\u1EADp nh\u1EADt");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "option", 17);
            i0.ɵɵtext(30, "T\u00EAn (A-Z)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "option", 18);
            i0.ɵɵtext(32, "T\u00EAn (Z-A)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "option", 19);
            i0.ɵɵtext(34, "H\u1EA1n d\u00F9ng (G\u1EA7n nh\u1EA5t)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "option", 20);
            i0.ɵɵtext(36, "H\u1EA1n d\u00F9ng (Xa nh\u1EA5t)");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(37, "div", 21)(38, "button", 22);
            i0.ɵɵlistener("click", function StandardsFilterComponent_Template_button_click_38_listener() { return ctx.onViewModeChange("list"); });
            i0.ɵɵelement(39, "i", 23);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "button", 24);
            i0.ɵɵlistener("click", function StandardsFilterComponent_Template_button_click_40_listener() { return ctx.onViewModeChange("grid"); });
            i0.ɵɵelement(41, "i", 25);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(42, "div", 26)(43, "div", 27)(44, "span", 28);
            i0.ɵɵelement(45, "i", 29);
            i0.ɵɵtext(46, " Ph\u01B0\u01A1ng ph\u00E1p:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "select", 30);
            i0.ɵɵlistener("ngModelChange", function StandardsFilterComponent_Template_select_ngModelChange_47_listener($event) { return ctx.methodTagFilterChange.emit($event || null); });
            i0.ɵɵelementStart(48, "option", 31);
            i0.ɵɵtext(49, "T\u1EA5t c\u1EA3 ph\u01B0\u01A1ng ph\u00E1p");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(50, StandardsFilterComponent_For_51_Template, 2, 2, "option", 31, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(52, "div", 27)(53, "span", 28);
            i0.ɵɵelement(54, "i", 32);
            i0.ɵɵtext(55, " Thi\u1EBFt b\u1ECB:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(56, "select", 33);
            i0.ɵɵlistener("ngModelChange", function StandardsFilterComponent_Template_select_ngModelChange_56_listener($event) { return ctx.deviceFilterChange.emit($event); });
            i0.ɵɵelementStart(57, "option", 34);
            i0.ɵɵtext(58, "T\u1EA5t c\u1EA3 thi\u1EBFt b\u1ECB");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(59, StandardsFilterComponent_For_60_Template, 2, 2, "option", 35, _forTrack1);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(61, "div", 36)(62, "span", 37);
            i0.ɵɵtext(63);
            i0.ɵɵtemplate(64, StandardsFilterComponent_Conditional_64_Template, 2, 1, "span", 38);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(65, "span", 39);
            i0.ɵɵtext(66);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(67, StandardsFilterComponent_Conditional_67_Template, 3, 0, "span", 40);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngModel", ctx.searchTerm());
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngModel", ctx.activeWidgetFilter());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("T\u1EA5t c\u1EA3 (", ctx.stats().total, ")");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("\u0110\u00E3 h\u1EBFt h\u1EA1n (", ctx.stats().expired, ")");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("S\u1EAFp h\u1EBFt h\u1EA1n 30 ng\u00E0y (", ctx.stats().expiringSoon, ")");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("S\u1EAFp h\u1EBFt h\u1EA1n 3 th\u00E1ng t\u1EDBi (", ctx.stats().expiring3Months, ")");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("S\u1EAFp h\u1EBFt h\u00E0ng (", ctx.stats().lowStock, ")");
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngModel", ctx.sortOption());
            i0.ɵɵadvance(14);
            i0.ɵɵclassMap(ctx.viewMode() === "list" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.viewMode() === "grid" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngModel", ctx.methodTagFilter())("title", ctx.selectedMethodTitle());
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngValue", null);
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.tagOptions());
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngModel", ctx.deviceFilter());
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.deviceOptions());
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate2(" Hi\u1EC3n th\u1ECB: ", ctx.visibleCount(), " / ", ctx.filteredCount(), " k\u1EBFt qu\u1EA3 ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.searchTerm() ? 64 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" T\u1ED3n: ", ctx.stockSummaryText(), " ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isLoading() ? 67 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsFilterComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-filter',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    <div class="p-2 border-b border-slate-50 dark:border-slate-700 flex flex-col gap-2 bg-slate-50/30 dark:bg-slate-800/50">
       <div class="flex flex-col md:flex-row gap-2">
           <div class="relative flex-1 group">
              <i class="fa-solid fa-search absolute left-2.5 top-2 text-slate-400 dark:text-slate-500 text-xs group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors"></i>
              <input type="text" [ngModel]="searchTerm()" (ngModelChange)="onSearchInput($event)" 
                     class="w-full pl-7 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition shadow-sm dark:shadow-none placeholder-slate-400 dark:placeholder-slate-500"
                     placeholder="Tìm kiếm chuẩn, mã số, số lô... (Real-time)">
           </div>
           
           <!-- FILTER DROPDOWN -->
           <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 shadow-sm dark:shadow-none h-[30px]">
               <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap"><i class="fa-solid fa-filter mr-1"></i> Lọc:</span>
               <select [ngModel]="activeWidgetFilter()" (ngModelChange)="onWidgetFilterChange($event)" 
                       class="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer border-none py-1 pr-1">
                   <option value="all" class="dark:bg-slate-800">Tất cả ({{stats().total}})</option>
                   <option value="expired" class="dark:bg-slate-800">Đã hết hạn ({{stats().expired}})</option>
                   <option value="expiring_soon" class="dark:bg-slate-800">Sắp hết hạn 30 ngày ({{stats().expiringSoon}})</option>
                   <option value="expiring_3months" class="dark:bg-slate-800">Sắp hết hạn 3 tháng tới ({{stats().expiring3Months}})</option>
                   <option value="low_stock" class="dark:bg-slate-800">Sắp hết hàng ({{stats().lowStock}})</option>
               </select>
           </div>
           
           <!-- SORT DROPDOWN -->
           <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 shadow-sm dark:shadow-none h-[30px]">
               <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap"><i class="fa-solid fa-arrow-down-short-wide mr-1"></i> Sắp xếp:</span>
               <select [ngModel]="sortOption()" (ngModelChange)="onSortChange($event)" 
                       class="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer border-none py-1 pr-1">
                   <option value="received_desc" class="dark:bg-slate-800">Ngày nhận (Mới nhất)</option>
                   <option value="updated_desc" class="dark:bg-slate-800">Mới cập nhật</option>
                   <option value="name_asc" class="dark:bg-slate-800">Tên (A-Z)</option>
                   <option value="name_desc" class="dark:bg-slate-800">Tên (Z-A)</option>
                   <option value="expiry_asc" class="dark:bg-slate-800">Hạn dùng (Gần nhất)</option>
                   <option value="expiry_desc" class="dark:bg-slate-800">Hạn dùng (Xa nhất)</option>
               </select>
           </div>

           <div class="flex bg-slate-200/50 dark:bg-slate-700/50 p-0.5 rounded-lg shrink-0 h-[30px] self-start md:self-auto">
              <button (click)="onViewModeChange('list')" [class]="viewMode() === 'list' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'" class="w-7 h-full flex items-center justify-center rounded transition" title="Dạng Danh sách">
                  <i class="fa-solid fa-list text-[11px]"></i>
              </button>
              <button (click)="onViewModeChange('grid')" [class]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'" class="w-7 h-full flex items-center justify-center rounded transition" title="Dạng Lưới (Thẻ)">
                  <i class="fa-solid fa-border-all text-[11px]"></i>
              </button>
           </div>
       </div>

       <div class="flex flex-col sm:flex-row gap-2">
           <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 shadow-sm h-[30px] flex-1">
               <span class="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap"><i class="fa-solid fa-flask mr-1"></i> Phương pháp:</span>
               <select [ngModel]="methodTagFilter()" (ngModelChange)="methodTagFilterChange.emit($event || null)" [title]="selectedMethodTitle()" class="min-w-0 flex-1 bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer border-none py-1">
                   <option [ngValue]="null">Tất cả phương pháp</option>
                   @for (option of tagOptions(); track option.key) { <option [ngValue]="option.key">{{formatTagLabel(option)}}</option> }
               </select>
           </div>
           <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 shadow-sm h-[30px] flex-1">
               <span class="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap"><i class="fa-solid fa-microchip mr-1"></i> Thiết bị:</span>
               <select [ngModel]="deviceFilter()" (ngModelChange)="deviceFilterChange.emit($event)" class="min-w-0 flex-1 bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer border-none py-1">
                   <option value="all">Tất cả thiết bị</option>
                   @for (device of deviceOptions(); track device.code) { <option [value]="device.code">{{device.label}}</option> }
               </select>
           </div>
       </div>
       
       <!-- Search Stats -->
       <div class="flex justify-between items-center px-1">
           <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500">
               Hiển thị: {{visibleCount()}} / {{filteredCount()}} kết quả 
               @if(searchTerm()) { <span class="text-indigo-500 dark:text-indigo-400">(Lọc theo "{{searchTerm()}}")</span> }
           </span>
           <span class="text-[10px] font-black text-indigo-600 dark:text-indigo-300 text-right" title="Tồn kho được cộng riêng theo từng đơn vị, không quy đổi chéo">
               Tồn: {{stockSummaryText()}}
           </span>
           @if(isLoading()) { <span class="text-[9px] text-blue-500 dark:text-blue-400 flex items-center gap-1"><i class="fa-solid fa-sync fa-spin"></i> Đang đồng bộ...</span> }
       </div>
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsFilterComponent, { className: "StandardsFilterComponent", filePath: "src/app/features/standards/components/standards-filter.component.ts", lineNumber: 89 }); })();
//# sourceMappingURL=standards-filter.component.js.map