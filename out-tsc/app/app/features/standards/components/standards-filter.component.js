import { Component, computed, HostListener, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatMethodOptionLabel, formatMethodOptionLabelCompact, formatStockSummary } from '../services/standard-tag.utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.code;
const _forTrack1 = ($index, $item) => $item.key;
function StandardsFilterComponent_Conditional_55_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 54);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx_r1.filteredMethodOptions().length, " ph\u01B0\u01A1ng ph\u00E1p ph\u00F9 h\u1EE3p");
} }
function StandardsFilterComponent_Conditional_55_For_21_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 56);
    i0.ɵɵlistener("click", function StandardsFilterComponent_Conditional_55_For_21_Template_button_click_0_listener() { const device_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectDeviceFacet(device_r4.code)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "span", 57);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const device_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", ctx_r1.deviceFilter() === device_r4.code ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", device_r4.label, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.deviceMethodCount(device_r4.code));
} }
function StandardsFilterComponent_Conditional_55_For_28_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 68);
} }
function StandardsFilterComponent_Conditional_55_For_28_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 69);
} }
function StandardsFilterComponent_Conditional_55_For_28_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 72);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r7 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.methodDeviceText(option_r7));
} }
function StandardsFilterComponent_Conditional_55_For_28_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 73);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r7 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.methodName(option_r7));
} }
function StandardsFilterComponent_Conditional_55_For_28_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 66);
    i0.ɵɵlistener("click", function StandardsFilterComponent_Conditional_55_For_28_Template_button_click_0_listener() { const option_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectMethod(option_r7.key)); });
    i0.ɵɵelementStart(1, "span", 67);
    i0.ɵɵtemplate(2, StandardsFilterComponent_Conditional_55_For_28_Conditional_2_Template, 1, 0, "i", 68)(3, StandardsFilterComponent_Conditional_55_For_28_Conditional_3_Template, 1, 0, "i", 69);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 31)(5, "span", 70)(6, "span", 71);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, StandardsFilterComponent_Conditional_55_For_28_Conditional_8_Template, 2, 1, "span", 72);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, StandardsFilterComponent_Conditional_55_For_28_Conditional_9_Template, 2, 1, "span", 73);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const option_r7 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", ctx_r1.methodTagFilter() === option_r7.key ? "bg-indigo-50 dark:bg-indigo-900/25" : "");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.methodTagFilter() === option_r7.key ? 2 : 3);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.methodCode(option_r7));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.methodDeviceText(option_r7) ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.methodName(option_r7) ? 9 : -1);
} }
function StandardsFilterComponent_Conditional_55_ForEmpty_29_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 65);
    i0.ɵɵelement(1, "i", 74);
    i0.ɵɵelementStart(2, "div", 75);
    i0.ɵɵtext(3, "Kh\u00F4ng c\u00F3 ph\u01B0\u01A1ng ph\u00E1p ph\u00F9 h\u1EE3p.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 76);
    i0.ɵɵlistener("click", function StandardsFilterComponent_Conditional_55_ForEmpty_29_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.resetMethodDiscovery()); });
    i0.ɵɵtext(5, "X\u00F3a t\u00ECm ki\u1EBFm v\u00E0 k\u1EF9 thu\u1EADt");
    i0.ɵɵelementEnd()();
} }
function StandardsFilterComponent_Conditional_55_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 45);
    i0.ɵɵlistener("click", function StandardsFilterComponent_Conditional_55_Template_div_click_0_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(1, "div", 46)(2, "div", 47)(3, "div")(4, "div", 48);
    i0.ɵɵtext(5, "Ph\u01B0\u01A1ng ph\u00E1p ph\u00E2n t\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 49);
    i0.ɵɵtext(7, "K\u1EF9 thu\u1EADt ch\u1EC9 d\u00F9ng \u0111\u1EC3 thu h\u1EB9p danh m\u1EE5c ph\u01B0\u01A1ng ph\u00E1p; chu\u1EA9n v\u1EABn \u0111\u01B0\u1EE3c l\u1ECDc theo ph\u01B0\u01A1ng ph\u00E1p \u0111\u00E3 g\u1EAFn.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 50);
    i0.ɵɵlistener("click", function StandardsFilterComponent_Conditional_55_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeMethodPicker()); });
    i0.ɵɵelement(9, "i", 51);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(10, "div", 46)(11, "div", 52)(12, "span", 53);
    i0.ɵɵtext(13, "K\u1EF9 thu\u1EADt / nh\u00F3m ph\u01B0\u01A1ng ph\u00E1p");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(14, StandardsFilterComponent_Conditional_55_Conditional_14_Template, 2, 1, "span", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div", 55)(16, "button", 56);
    i0.ɵɵlistener("click", function StandardsFilterComponent_Conditional_55_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectDeviceFacet("all")); });
    i0.ɵɵtext(17, "T\u1EA5t c\u1EA3 ");
    i0.ɵɵelementStart(18, "span", 57);
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(20, StandardsFilterComponent_Conditional_55_For_21_Template, 4, 3, "button", 58, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 59)(23, "div", 60);
    i0.ɵɵelement(24, "i", 61);
    i0.ɵɵelementStart(25, "input", 62);
    i0.ɵɵlistener("ngModelChange", function StandardsFilterComponent_Conditional_55_Template_input_ngModelChange_25_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.methodSearch.set($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(26, "div", 63);
    i0.ɵɵrepeaterCreate(27, StandardsFilterComponent_Conditional_55_For_28_Template, 10, 5, "button", 64, _forTrack1, false, StandardsFilterComponent_Conditional_55_ForEmpty_29_Template, 6, 0, "div", 65);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵconditional(ctx_r1.deviceFilter() !== "all" ? 14 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", ctx_r1.deviceFilter() === "all" ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.tagOptions().length);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.visibleDeviceOptions());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r1.methodSearch());
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.filteredMethodOptions());
} }
function StandardsFilterComponent_Conditional_56_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "span", 37);
    i0.ɵɵelement(1, "i", 77);
    i0.ɵɵelementStart(2, "span", 78);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 79);
    i0.ɵɵlistener("click", function StandardsFilterComponent_Conditional_56_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearMethodFilter()); });
    i0.ɵɵelement(5, "i", 80);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("title", ctx_r1.selectedMethodTitle());
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.selectedMethodChipText());
} }
function StandardsFilterComponent_Conditional_57_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "span", 38);
    i0.ɵɵelement(1, "i", 81);
    i0.ɵɵtext(2);
    i0.ɵɵelementStart(3, "button", 82);
    i0.ɵɵlistener("click", function StandardsFilterComponent_Conditional_57_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectDeviceFacet("all")); });
    i0.ɵɵelement(4, "i", 80);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.selectedDeviceLabel(), " \u00B7 ", ctx_r1.filteredMethodOptions().length, " ph\u01B0\u01A1ng ph\u00E1p ");
} }
function StandardsFilterComponent_Conditional_58_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 83);
    i0.ɵɵlistener("click", function StandardsFilterComponent_Conditional_58_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearTagFilters()); });
    i0.ɵɵtext(1, " X\u00F3a b\u1ED9 l\u1ECDc ");
    i0.ɵɵelementEnd();
} }
function StandardsFilterComponent_Conditional_62_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 42);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("(L\u1ECDc theo \"", ctx_r1.searchTerm(), "\")");
} }
function StandardsFilterComponent_Conditional_65_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 44);
    i0.ɵɵelement(1, "i", 84);
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
        this.hasTagFilters = computed(() => !!this.methodTagFilter() || this.deviceFilter() !== 'all');
        this.methodPickerOpen = signal(false);
        this.methodSearch = signal('');
        this.deviceMethodCounts = computed(() => {
            const counts = new Map();
            for (const option of this.tagOptions()) {
                for (const code of new Set(option.deviceCodes || [])) {
                    counts.set(code, (counts.get(code) || 0) + 1);
                }
            }
            return counts;
        });
        this.visibleDeviceOptions = computed(() => this.deviceOptions().filter(option => this.deviceMethodCount(option.code) > 0));
        this.filteredMethodOptions = computed(() => {
            const device = this.deviceFilter();
            const query = this.normalizeSearch(this.methodSearch());
            return this.tagOptions().filter(option => {
                if (device !== 'all' && !(option.deviceCodes || []).includes(device))
                    return false;
                if (!query)
                    return true;
                const haystack = this.normalizeSearch([
                    option.methodCode,
                    option.label,
                    option.methodName,
                    option.description,
                    ...(option.deviceCodes || []),
                ].filter(Boolean).join(' '));
                return haystack.includes(query);
            });
        });
        this.selectedMethod = computed(() => this.tagOptions().find(option => option.key === this.methodTagFilter()) || null);
        this.selectedDevice = computed(() => this.deviceOptions().find(option => option.code === this.deviceFilter()) || null);
        this.searchTermChange = output();
        this.activeWidgetFilterChange = output();
        this.sortOptionChange = output();
        this.viewModeChange = output();
        this.methodTagFilterChange = output();
        this.deviceFilterChange = output();
    }
    selectedMethodTitle() {
        const selected = this.selectedMethod();
        return selected ? formatMethodOptionLabel(selected) : 'Tất cả phương pháp';
    }
    methodTriggerText() {
        const selected = this.selectedMethod();
        if (selected)
            return formatMethodOptionLabelCompact(selected);
        const device = this.selectedDevice();
        return device ? `${device.label} · ${this.filteredMethodOptions().length} phương pháp` : 'Tất cả phương pháp';
    }
    selectedMethodChipText() {
        const selected = this.selectedMethod();
        return selected ? formatMethodOptionLabelCompact(selected) : 'Phương pháp';
    }
    selectedDeviceLabel() {
        return this.selectedDevice()?.label || 'Tất cả kỹ thuật';
    }
    methodCode(option) {
        return option.methodCode?.trim() || option.label;
    }
    methodName(option) {
        return option.methodName?.trim() || option.description?.trim() || '';
    }
    methodDeviceText(option) {
        return [...new Set(option.deviceCodes || [])]
            .map(code => this.deviceOptions().find(device => device.code === code)?.label || code)
            .join(', ');
    }
    deviceMethodCount(code) {
        return this.deviceMethodCounts().get(code) || 0;
    }
    onDocumentClick(event) {
        const target = event.target;
        if (this.methodPickerOpen() && !target?.closest('[data-method-picker]')) {
            this.closeMethodPicker();
        }
    }
    toggleMethodPicker(event) {
        event.stopPropagation();
        this.methodPickerOpen.update(open => !open);
        if (!this.methodPickerOpen())
            this.methodSearch.set('');
    }
    closeMethodPicker() {
        this.methodPickerOpen.set(false);
        this.methodSearch.set('');
    }
    selectDeviceFacet(device) {
        // Changing the discovery facet invalidates an exact method selection.
        if (this.methodTagFilter())
            this.methodTagFilterChange.emit(null);
        this.deviceFilterChange.emit(device);
        this.methodSearch.set('');
    }
    selectMethod(key) {
        this.methodTagFilterChange.emit(key);
        this.closeMethodPicker();
    }
    clearMethodFilter() {
        this.methodTagFilterChange.emit(null);
    }
    resetMethodDiscovery() {
        this.methodSearch.set('');
        if (this.methodTagFilter())
            this.methodTagFilterChange.emit(null);
        this.deviceFilterChange.emit('all');
    }
    clearTagFilters() {
        this.methodTagFilterChange.emit(null);
        this.deviceFilterChange.emit('all');
        this.methodSearch.set('');
    }
    normalizeSearch(value) {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
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
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsFilterComponent, selectors: [["app-standards-filter"]], hostBindings: function StandardsFilterComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function StandardsFilterComponent_click_HostBindingHandler($event) { return ctx.onDocumentClick($event); }, false, i0.ɵɵresolveDocument);
        } }, inputs: { searchTerm: [1, "searchTerm"], activeWidgetFilter: [1, "activeWidgetFilter"], sortOption: [1, "sortOption"], viewMode: [1, "viewMode"], stats: [1, "stats"], visibleCount: [1, "visibleCount"], filteredCount: [1, "filteredCount"], isLoading: [1, "isLoading"], tagOptions: [1, "tagOptions"], methodTagFilter: [1, "methodTagFilter"], deviceOptions: [1, "deviceOptions"], deviceFilter: [1, "deviceFilter"], stockSummary: [1, "stockSummary"] }, outputs: { searchTermChange: "searchTermChange", activeWidgetFilterChange: "activeWidgetFilterChange", sortOptionChange: "sortOptionChange", viewModeChange: "viewModeChange", methodTagFilterChange: "methodTagFilterChange", deviceFilterChange: "deviceFilterChange" }, decls: 66, vars: 27, consts: [[1, "p-2", "border-b", "border-slate-50", "dark:border-slate-700", "flex", "flex-col", "gap-2", "bg-slate-50/30", "dark:bg-slate-800/50"], [1, "flex", "flex-col", "md:flex-row", "gap-2"], [1, "relative", "flex-1", "group"], [1, "fa-solid", "fa-search", "absolute", "left-2.5", "top-2", "text-slate-400", "dark:text-slate-500", "text-xs", "group-focus-within:text-indigo-500", "dark:group-focus-within:text-indigo-400", "transition-colors"], ["type", "text", "placeholder", "T\u00ECm ki\u1EBFm chu\u1EA9n, m\u00E3 s\u1ED1, s\u1ED1 l\u00F4... (Real-time)", 1, "w-full", "pl-7", "pr-2", "py-1.5", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "text-xs", "font-medium", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", "focus:ring-2", "focus:ring-indigo-500/10", "dark:focus:ring-indigo-500/20", "transition", "shadow-sm", "dark:shadow-none", "placeholder-slate-400", "dark:placeholder-slate-500", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-1.5", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "shadow-sm", "dark:shadow-none", "h-[30px]"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "whitespace-nowrap"], [1, "fa-solid", "fa-filter", "mr-1"], [1, "bg-transparent", "text-[11px]", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "cursor-pointer", "border-none", "py-1", "pr-1", 3, "ngModelChange", "ngModel"], ["value", "all", 1, "dark:bg-slate-800"], ["value", "expired", 1, "dark:bg-slate-800"], ["value", "expiring_soon", 1, "dark:bg-slate-800"], ["value", "expiring_3months", 1, "dark:bg-slate-800"], ["value", "low_stock", 1, "dark:bg-slate-800"], [1, "fa-solid", "fa-arrow-down-short-wide", "mr-1"], ["value", "received_desc", 1, "dark:bg-slate-800"], ["value", "updated_desc", 1, "dark:bg-slate-800"], ["value", "name_asc", 1, "dark:bg-slate-800"], ["value", "name_desc", 1, "dark:bg-slate-800"], ["value", "expiry_asc", 1, "dark:bg-slate-800"], ["value", "expiry_desc", 1, "dark:bg-slate-800"], [1, "flex", "bg-slate-200/50", "dark:bg-slate-700/50", "p-0.5", "rounded-lg", "shrink-0", "h-[30px]", "self-start", "md:self-auto"], ["title", "D\u1EA1ng Danh s\u00E1ch", 1, "w-7", "h-full", "flex", "items-center", "justify-center", "rounded", "transition", 3, "click"], [1, "fa-solid", "fa-list", "text-[11px]"], ["title", "D\u1EA1ng L\u01B0\u1EDBi (Th\u1EBB)", 1, "w-7", "h-full", "flex", "items-center", "justify-center", "rounded", "transition", 3, "click"], [1, "fa-solid", "fa-border-all", "text-[11px]"], [1, "flex", "flex-col", "gap-2", "sm:flex-row", "sm:items-center"], ["data-method-picker", "", 1, "relative", "min-w-0", "sm:w-[340px]", "md:w-[420px]"], ["type", "button", "aria-haspopup", "dialog", 1, "flex", "h-[34px]", "w-full", "min-w-0", "items-center", "gap-2", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "px-2.5", "text-left", "shadow-sm", "dark:shadow-none", "transition", "hover:border-indigo-300", "dark:hover:border-indigo-700", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500/20", 3, "click"], [1, "flex", "h-6", "w-6", "shrink-0", "items-center", "justify-center", "rounded-md", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400"], [1, "fa-solid", "fa-flask-vial", "text-[10px]"], [1, "min-w-0", "flex-1"], [1, "block", "text-[8px]", "font-black", "uppercase", "tracking-wide", "text-slate-400", "dark:text-slate-500"], [1, "block", "truncate", "text-[11px]", "font-black", "text-slate-700", "dark:text-slate-200", 3, "title"], [1, "shrink-0", "text-[9px]", "font-bold", "text-slate-400"], [1, "fa-solid", "fa-chevron-down", "shrink-0", "text-[9px]", "text-slate-400", "transition-transform"], ["role", "dialog", "aria-label", "Ch\u1ECDn ph\u01B0\u01A1ng ph\u00E1p ph\u00E2n t\u00EDch", 1, "absolute", "left-0", "top-full", "z-50", "mt-1.5", "w-[min(720px,calc(100vw-24px))]", "overflow-hidden", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "shadow-2xl"], [1, "inline-flex", "min-w-0", "max-w-full", "items-center", "gap-1.5", "self-start", "rounded-full", "border", "border-indigo-100", "dark:border-indigo-800", "bg-indigo-50", "dark:bg-indigo-900/25", "px-2.5", "py-1", "text-[10px]", "font-black", "text-indigo-700", "dark:text-indigo-300", "sm:self-auto", 3, "title"], [1, "inline-flex", "items-center", "gap-1.5", "self-start", "rounded-full", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-100/80", "dark:bg-slate-800", "px-2.5", "py-1", "text-[10px]", "font-black", "text-slate-600", "dark:text-slate-300", "sm:self-auto"], ["type", "button", 1, "self-start", "px-1.5", "py-1", "text-[10px]", "font-black", "text-slate-400", "hover:text-rose-600", "dark:hover:text-rose-400", "sm:self-auto"], [1, "flex", "justify-between", "items-center", "px-1"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "text-indigo-500", "dark:text-indigo-400"], ["title", "T\u1ED3n kho \u0111\u01B0\u1EE3c c\u1ED9ng ri\u00EAng theo t\u1EEBng \u0111\u01A1n v\u1ECB, kh\u00F4ng quy \u0111\u1ED5i ch\u00E9o", 1, "text-[10px]", "font-black", "text-indigo-600", "dark:text-indigo-300", "text-right"], [1, "text-[9px]", "text-blue-500", "dark:text-blue-400", "flex", "items-center", "gap-1"], ["role", "dialog", "aria-label", "Ch\u1ECDn ph\u01B0\u01A1ng ph\u00E1p ph\u00E2n t\u00EDch", 1, "absolute", "left-0", "top-full", "z-50", "mt-1.5", "w-[min(720px,calc(100vw-24px))]", "overflow-hidden", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "shadow-2xl", 3, "click"], [1, "border-b", "border-slate-100", "dark:border-slate-800", "px-3", "py-2.5"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "mt-0.5", "text-[10px]", "font-medium", "text-slate-400", "dark:text-slate-500"], ["type", "button", "aria-label", "\u0110\u00F3ng", 1, "flex", "h-7", "w-7", "shrink-0", "items-center", "justify-center", "rounded-lg", "text-slate-400", "hover:bg-slate-100", "hover:text-slate-700", "dark:hover:bg-slate-800", "dark:hover:text-slate-200", 3, "click"], [1, "fa-solid", "fa-xmark", "text-xs"], [1, "mb-1.5", "flex", "items-center", "justify-between", "gap-2"], [1, "text-[9px]", "font-black", "uppercase", "tracking-wide", "text-slate-400", "dark:text-slate-500"], [1, "text-[9px]", "font-bold", "text-indigo-500", "dark:text-indigo-400"], [1, "flex", "gap-1.5", "overflow-x-auto", "pb-1", "custom-scrollbar", "sm:flex-wrap", "sm:overflow-visible", "sm:pb-0"], ["type", "button", 1, "shrink-0", "rounded-full", "border", "px-2.5", "py-1", "text-[10px]", "font-black", "transition", 3, "click", "ngClass"], [1, "ml-1", "opacity-60"], ["type", "button", 1, "shrink-0", "rounded-full", "border", "px-2.5", "py-1", "text-[10px]", "font-black", "transition", 3, "ngClass"], [1, "border-b", "border-slate-100", "dark:border-slate-800", "p-2.5"], [1, "relative"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-[10px]", "text-slate-400"], ["type", "text", "placeholder", "T\u00ECm m\u00E3, t\u00EAn ph\u01B0\u01A1ng ph\u00E1p ho\u1EB7c k\u1EF9 thu\u1EADt...", 1, "w-full", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "py-2", "pl-8", "pr-3", "text-xs", "font-medium", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:border-indigo-400", "focus:ring-2", "focus:ring-indigo-500/20", 3, "ngModelChange", "ngModel"], [1, "max-h-72", "overflow-y-auto", "p-1.5", "custom-scrollbar"], ["type", "button", 1, "flex", "w-full", "min-w-0", "items-start", "gap-2.5", "rounded-lg", "px-2.5", "py-2", "text-left", "transition", "hover:bg-slate-50", "dark:hover:bg-slate-800/70", 3, "ngClass"], [1, "px-3", "py-8", "text-center"], ["type", "button", 1, "flex", "w-full", "min-w-0", "items-start", "gap-2.5", "rounded-lg", "px-2.5", "py-2", "text-left", "transition", "hover:bg-slate-50", "dark:hover:bg-slate-800/70", 3, "click", "ngClass"], [1, "mt-0.5", "flex", "h-5", "w-5", "shrink-0", "items-center", "justify-center", "rounded-md", "border", "border-slate-200", "dark:border-slate-700", "text-[9px]", "text-slate-400"], [1, "fa-solid", "fa-check", "text-indigo-500"], [1, "fa-solid", "fa-flask", "text-[8px]"], [1, "flex", "flex-wrap", "items-center", "gap-x-2", "gap-y-0.5"], [1, "text-[11px]", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "rounded", "bg-slate-100", "dark:bg-slate-800", "px-1.5", "py-0.5", "text-[8px]", "font-black", "text-slate-500", "dark:text-slate-400"], [1, "mt-0.5", "block", "text-[10px]", "font-medium", "leading-snug", "text-slate-500", "dark:text-slate-400"], [1, "fa-solid", "fa-filter-circle-xmark", "mb-2", "text-lg", "text-slate-300", "dark:text-slate-600"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400"], ["type", "button", 1, "mt-2", "text-[10px]", "font-black", "text-indigo-600", "dark:text-indigo-400", "hover:underline", 3, "click"], [1, "fa-solid", "fa-flask-vial", "text-[9px]"], [1, "max-w-[320px]", "truncate"], ["type", "button", "aria-label", "B\u1ECF l\u1ECDc ph\u01B0\u01A1ng ph\u00E1p", 1, "ml-0.5", "text-indigo-400", "hover:text-rose-500", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "fa-solid", "fa-layer-group", "text-[9px]"], ["type", "button", "aria-label", "B\u1ECF l\u1ECDc k\u1EF9 thu\u1EADt", 1, "ml-0.5", "text-slate-400", "hover:text-rose-500", 3, "click"], ["type", "button", 1, "self-start", "px-1.5", "py-1", "text-[10px]", "font-black", "text-slate-400", "hover:text-rose-600", "dark:hover:text-rose-400", "sm:self-auto", 3, "click"], [1, "fa-solid", "fa-sync", "fa-spin"]], template: function StandardsFilterComponent_Template(rf, ctx) { if (rf & 1) {
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
            i0.ɵɵelementStart(42, "div", 26)(43, "div", 27)(44, "button", 28);
            i0.ɵɵlistener("click", function StandardsFilterComponent_Template_button_click_44_listener($event) { return ctx.toggleMethodPicker($event); });
            i0.ɵɵelementStart(45, "span", 29);
            i0.ɵɵelement(46, "i", 30);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "span", 31)(48, "span", 32);
            i0.ɵɵtext(49, "Ph\u01B0\u01A1ng ph\u00E1p ph\u00E2n t\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "span", 33);
            i0.ɵɵtext(51);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(52, "span", 34);
            i0.ɵɵtext(53);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(54, "i", 35);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(55, StandardsFilterComponent_Conditional_55_Template, 30, 5, "div", 36);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(56, StandardsFilterComponent_Conditional_56_Template, 6, 2, "span", 37)(57, StandardsFilterComponent_Conditional_57_Template, 5, 2, "span", 38)(58, StandardsFilterComponent_Conditional_58_Template, 2, 0, "button", 39);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(59, "div", 40)(60, "span", 41);
            i0.ɵɵtext(61);
            i0.ɵɵtemplate(62, StandardsFilterComponent_Conditional_62_Template, 2, 1, "span", 42);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(63, "span", 43);
            i0.ɵɵtext(64);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(65, StandardsFilterComponent_Conditional_65_Template, 3, 0, "span", 44);
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
            i0.ɵɵadvance(4);
            i0.ɵɵattribute("aria-expanded", ctx.methodPickerOpen());
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("title", ctx.selectedMethodTitle());
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.methodTriggerText());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2("", ctx.filteredMethodOptions().length, "/", ctx.tagOptions().length, "");
            i0.ɵɵadvance();
            i0.ɵɵclassProp("rotate-180", ctx.methodPickerOpen());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.methodPickerOpen() ? 55 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.methodTagFilter() ? 56 : ctx.deviceFilter() !== "all" ? 57 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.hasTagFilters() ? 58 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate2(" Hi\u1EC3n th\u1ECB: ", ctx.visibleCount(), " / ", ctx.filteredCount(), " k\u1EBFt qu\u1EA3 ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.searchTerm() ? 62 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" T\u1ED3n: ", ctx.stockSummaryText(), " ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isLoading() ? 65 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel], encapsulation: 2 }); }
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

       <!-- METHOD FILTER: device is a facet used to navigate the method catalog, not a parallel data field. -->
       <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
           <div data-method-picker class="relative min-w-0 sm:w-[340px] md:w-[420px]">
               <button
                   type="button"
                   (click)="toggleMethodPicker($event)"
                   [attr.aria-expanded]="methodPickerOpen()"
                   aria-haspopup="dialog"
                   class="flex h-[34px] w-full min-w-0 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 text-left shadow-sm dark:shadow-none transition hover:border-indigo-300 dark:hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
               >
                   <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                       <i class="fa-solid fa-flask-vial text-[10px]"></i>
                   </span>
                   <span class="min-w-0 flex-1">
                       <span class="block text-[8px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Phương pháp phân tích</span>
                       <span class="block truncate text-[11px] font-black text-slate-700 dark:text-slate-200" [title]="selectedMethodTitle()">{{methodTriggerText()}}</span>
                   </span>
                   <span class="shrink-0 text-[9px] font-bold text-slate-400">{{filteredMethodOptions().length}}/{{tagOptions().length}}</span>
                   <i class="fa-solid fa-chevron-down shrink-0 text-[9px] text-slate-400 transition-transform" [class.rotate-180]="methodPickerOpen()"></i>
               </button>

               @if (methodPickerOpen()) {
                   <div
                       role="dialog"
                       aria-label="Chọn phương pháp phân tích"
                       class="absolute left-0 top-full z-50 mt-1.5 w-[min(720px,calc(100vw-24px))] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
                       (click)="$event.stopPropagation()"
                   >
                       <div class="border-b border-slate-100 dark:border-slate-800 px-3 py-2.5">
                           <div class="flex items-start justify-between gap-3">
                               <div>
                                   <div class="text-xs font-black text-slate-800 dark:text-slate-100">Phương pháp phân tích</div>
                                   <div class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Kỹ thuật chỉ dùng để thu hẹp danh mục phương pháp; chuẩn vẫn được lọc theo phương pháp đã gắn.</div>
                               </div>
                               <button type="button" (click)="closeMethodPicker()" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Đóng">
                                   <i class="fa-solid fa-xmark text-xs"></i>
                               </button>
                           </div>
                       </div>

                       <div class="border-b border-slate-100 dark:border-slate-800 px-3 py-2.5">
                           <div class="mb-1.5 flex items-center justify-between gap-2">
                               <span class="text-[9px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Kỹ thuật / nhóm phương pháp</span>
                               @if (deviceFilter() !== 'all') {
                                   <span class="text-[9px] font-bold text-indigo-500 dark:text-indigo-400">{{filteredMethodOptions().length}} phương pháp phù hợp</span>
                               }
                           </div>
                           <div class="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar sm:flex-wrap sm:overflow-visible sm:pb-0">
                               <button
                                   type="button"
                                   (click)="selectDeviceFacet('all')"
                                   [ngClass]="deviceFilter() === 'all' ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600'"
                                   class="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black transition"
                               >Tất cả <span class="ml-1 opacity-60">{{tagOptions().length}}</span></button>
                               @for (device of visibleDeviceOptions(); track device.code) {
                                   <button
                                       type="button"
                                       (click)="selectDeviceFacet(device.code)"
                                       [ngClass]="deviceFilter() === device.code ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600'"
                                       class="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black transition"
                                   >{{device.label}} <span class="ml-1 opacity-60">{{deviceMethodCount(device.code)}}</span></button>
                               }
                           </div>
                       </div>

                       <div class="border-b border-slate-100 dark:border-slate-800 p-2.5">
                           <div class="relative">
                               <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"></i>
                               <input
                                   type="text"
                                   [ngModel]="methodSearch()"
                                   (ngModelChange)="methodSearch.set($event)"
                                   class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-8 pr-3 text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                                   placeholder="Tìm mã, tên phương pháp hoặc kỹ thuật..."
                               >
                           </div>
                       </div>

                       <div class="max-h-72 overflow-y-auto p-1.5 custom-scrollbar">
                           @for (option of filteredMethodOptions(); track option.key) {
                               <button
                                   type="button"
                                   (click)="selectMethod(option.key)"
                                   [ngClass]="methodTagFilter() === option.key ? 'bg-indigo-50 dark:bg-indigo-900/25' : ''"
                                   class="flex w-full min-w-0 items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/70"
                               >
                                   <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-[9px] text-slate-400">
                                       @if (methodTagFilter() === option.key) { <i class="fa-solid fa-check text-indigo-500"></i> }
                                       @else { <i class="fa-solid fa-flask text-[8px]"></i> }
                                   </span>
                                   <span class="min-w-0 flex-1">
                                       <span class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                           <span class="text-[11px] font-black text-slate-800 dark:text-slate-100">{{methodCode(option)}}</span>
                                           @if (methodDeviceText(option)) {
                                               <span class="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[8px] font-black text-slate-500 dark:text-slate-400">{{methodDeviceText(option)}}</span>
                                           }
                                       </span>
                                       @if (methodName(option)) {
                                           <span class="mt-0.5 block text-[10px] font-medium leading-snug text-slate-500 dark:text-slate-400">{{methodName(option)}}</span>
                                       }
                                   </span>
                               </button>
                           } @empty {
                               <div class="px-3 py-8 text-center">
                                   <i class="fa-solid fa-filter-circle-xmark mb-2 text-lg text-slate-300 dark:text-slate-600"></i>
                                   <div class="text-xs font-bold text-slate-500 dark:text-slate-400">Không có phương pháp phù hợp.</div>
                                   <button type="button" (click)="resetMethodDiscovery()" class="mt-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline">Xóa tìm kiếm và kỹ thuật</button>
                               </div>
                           }
                       </div>
                   </div>
               }
           </div>

           @if (methodTagFilter()) {
               <span class="inline-flex min-w-0 max-w-full items-center gap-1.5 self-start rounded-full border border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/25 px-2.5 py-1 text-[10px] font-black text-indigo-700 dark:text-indigo-300 sm:self-auto" [title]="selectedMethodTitle()">
                   <i class="fa-solid fa-flask-vial text-[9px]"></i>
                   <span class="max-w-[320px] truncate">{{selectedMethodChipText()}}</span>
                   <button type="button" (click)="clearMethodFilter()" class="ml-0.5 text-indigo-400 hover:text-rose-500" aria-label="Bỏ lọc phương pháp"><i class="fa-solid fa-xmark"></i></button>
               </span>
           } @else if (deviceFilter() !== 'all') {
               <span class="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-black text-slate-600 dark:text-slate-300 sm:self-auto">
                   <i class="fa-solid fa-layer-group text-[9px]"></i>
                   {{selectedDeviceLabel()}} · {{filteredMethodOptions().length}} phương pháp
                   <button type="button" (click)="selectDeviceFacet('all')" class="ml-0.5 text-slate-400 hover:text-rose-500" aria-label="Bỏ lọc kỹ thuật"><i class="fa-solid fa-xmark"></i></button>
               </span>
           }

           @if (hasTagFilters()) {
               <button type="button" (click)="clearTagFilters()" class="self-start px-1.5 py-1 text-[10px] font-black text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 sm:self-auto">
                   Xóa bộ lọc
               </button>
           }
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
    }], null, { onDocumentClick: [{
            type: HostListener,
            args: ['document:click', ['$event']]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsFilterComponent, { className: "StandardsFilterComponent", filePath: "src/app/features/standards/components/standards-filter.component.ts", lineNumber: 207 }); })();
//# sourceMappingURL=standards-filter.component.js.map