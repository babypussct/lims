import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName } from '../../shared/compound-id-resolver';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { bulkFillND, bulkClearAll, copyRowToAll, navigateGrid } from '../shared/sop-grid-helper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
function SopDefaultType2EntryComponent_For_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const col_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.columnDisplayNames()[col_r1] || col_r1, " ");
} }
function SopDefaultType2EntryComponent_For_34_Conditional_0_For_6_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 24)(1, "input", 22);
    i0.ɵɵtwoWayListener("ngModelChange", function SopDefaultType2EntryComponent_For_34_Conditional_0_For_6_Template_input_ngModelChange_1_listener($event) { const col_r7 = i0.ɵɵrestoreView(_r6).$implicit; const row_r4 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key][col_r7], $event) || (ctx_r1.draft.resultData[row_r4.key][col_r7] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopDefaultType2EntryComponent_For_34_Conditional_0_For_6_Template_input_ngModelChange_1_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function SopDefaultType2EntryComponent_For_34_Conditional_0_For_6_Template_input_keydown_1_listener($event) { const ctx_r7 = i0.ɵɵrestoreView(_r6); const col_r7 = ctx_r7.$implicit; const ɵ$index_70_r9 = ctx_r7.$index; const ɵ$index_59_r5 = i0.ɵɵnextContext(2).$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_59_r5, col_r7, ɵ$index_70_r9 + 1)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const col_r7 = ctx.$implicit;
    const ctx_r9 = i0.ɵɵnextContext(2);
    const row_r4 = ctx_r9.$implicit;
    const ɵ$index_59_r5 = ctx_r9.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key][col_r7]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_59_r5 + "-" + col_r7);
} }
function SopDefaultType2EntryComponent_For_34_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 20)(1, "td", 21)(2, "input", 22);
    i0.ɵɵtwoWayListener("ngModelChange", function SopDefaultType2EntryComponent_For_34_Conditional_0_Template_input_ngModelChange_2_listener($event) { i0.ɵɵrestoreView(_r3); const row_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key]["loSo"], $event) || (ctx_r1.draft.resultData[row_r4.key]["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopDefaultType2EntryComponent_For_34_Conditional_0_Template_input_ngModelChange_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function SopDefaultType2EntryComponent_For_34_Conditional_0_Template_input_keydown_2_listener($event) { i0.ɵɵrestoreView(_r3); const ɵ$index_59_r5 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_59_r5, "loSo", 0)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(3, "td", 23);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(5, SopDefaultType2EntryComponent_For_34_Conditional_0_For_6_Template, 2, 2, "td", 24, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementStart(7, "td", 24)(8, "input", 25);
    i0.ɵɵtwoWayListener("ngModelChange", function SopDefaultType2EntryComponent_For_34_Conditional_0_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r3); const row_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key]["ghiChu"], $event) || (ctx_r1.draft.resultData[row_r4.key]["ghiChu"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopDefaultType2EntryComponent_For_34_Conditional_0_Template_input_ngModelChange_8_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function SopDefaultType2EntryComponent_For_34_Conditional_0_Template_input_keydown_8_listener($event) { i0.ɵɵrestoreView(_r3); const ɵ$index_59_r5 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_59_r5, "ghiChu", ctx_r1.activeColumns.length + 1)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td", 26)(10, "button", 27);
    i0.ɵɵlistener("click", function SopDefaultType2EntryComponent_For_34_Conditional_0_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r3); const row_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyRowToAll(row_r4.key)); });
    i0.ɵɵelement(11, "i", 28);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r9 = i0.ɵɵnextContext();
    const row_r4 = ctx_r9.$implicit;
    const ɵ$index_59_r5 = ctx_r9.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key]["loSo"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_59_r5 + "-loSo");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r4.label);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.activeColumns);
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key]["ghiChu"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_59_r5 + "-ghiChu");
} }
function SopDefaultType2EntryComponent_For_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SopDefaultType2EntryComponent_For_34_Conditional_0_Template, 12, 5, "tr", 20);
} if (rf & 2) {
    const row_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.draft.resultData[row_r4.key] ? 0 : -1);
} }
export class SopDefaultType2EntryComponent {
    constructor() {
        this.isReadOnly = false;
        this.publishedSampleSet = null;
        this.draftChanged = new EventEmitter();
        this.masterTargetService = inject(MasterTargetService);
        this.masterTargets = signal([]);
        this.columnDisplayNames = signal({});
        this.activeColumns = [];
        this.checkboxList = [];
    }
    async ngOnInit() {
        try {
            const analytes = await this.masterTargetService.getAll();
            this.masterTargets.set(analytes);
        }
        catch (e) {
            console.warn('Failed to load master analytes', e);
        }
        const cols = Object.keys(this.config.columns || {});
        this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
        this.buildColumnDisplayNames();
        if (this.config.checkboxLines) {
            this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
                key: key,
                label
            }));
        }
    }
    getCompoundDisplayName(compound) {
        return resolveCompoundDisplayName(compound, this.masterTargets(), this.config?.id || this.run?.sopId);
    }
    formatColumnName(colKey) {
        let name = colKey.replace(/^kq/, '');
        name = name.replace(/([A-Z])/g, ' $1').trim();
        const defaultName = name.charAt(0).toUpperCase() + name.slice(1);
        return this.getCompoundDisplayName(defaultName);
    }
    buildColumnDisplayNames() {
        const map = {};
        for (const col of this.activeColumns) {
            map[col] = this.formatColumnName(col);
        }
        this.columnDisplayNames.set(map);
    }
    onDataChanged() {
        if (this.isReadOnly)
            return;
        this.draftChanged.emit(this.draft);
    }
    getDisplayRows() {
        const list = [];
        (this.run.sampleList || []).forEach((sampleCode) => {
            if (!this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode] = {
                    loSo: '',
                    selected: true
                };
            }
            list.push({
                key: sampleCode,
                type: 'REGULAR',
                label: sampleCode,
                isQC: false
            });
        });
        return list;
    }
    bulkFillND() {
        bulkFillND(this.draft.resultData, this.run.sampleList, this.activeColumns);
        this.draft.page1Data['checkTatCaND'] = true;
        this.draft.page1Data['checkCoMauPhatHien'] = false;
        this.onDataChanged();
    }
    bulkClearAll() {
        bulkClearAll(this.draft.resultData, this.run.sampleList, this.activeColumns);
        this.onDataChanged();
    }
    copyRowToAll(sourceKey) {
        copyRowToAll(this.draft.resultData, this.run.sampleList, this.activeColumns, sourceKey);
        this.onDataChanged();
    }
    handleGridNavigation(event, rowIdx, colName, colIdx) {
        const columnsList = ['loSo', ...this.activeColumns, 'ghiChu'];
        const rows = this.getDisplayRows();
        navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 0);
    }
    static { this.ɵfac = function SopDefaultType2EntryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SopDefaultType2EntryComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SopDefaultType2EntryComponent, selectors: [["app-sop-default-type2-entry"]], inputs: { run: "run", draft: "draft", config: "config", isReadOnly: "isReadOnly", publishedSampleSet: "publishedSampleSet" }, outputs: { draftChanged: "draftChanged" }, decls: 35, vars: 3, consts: [[1, "space-y-6", "animate-fade-in", 3, "disabled"], ["title", "Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (Ti\u00EAu chu\u1EA9n)", 3, "draftChanged", "draft", "checkboxList"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4", "animate-fade-in"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-3.5"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-table-cells", "mr-1", "text-indigo-500", "text-sm"], [1, "flex", "flex-wrap", "items-center", "gap-2.5"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mr-1"], [1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-amber-50", "dark:hover:bg-amber-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-amber-200", "dark:hover:border-amber-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-pen-clip", "text-amber-500"], [1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-rose-50", "dark:hover:bg-rose-955/20", "text-slate-755", "dark:text-slate-300", "hover:text-rose-600", "dark:hover:text-rose-455", "border", "border-slate-200", "dark:border-slate-800", "hover:border-rose-200", "dark:hover:border-rose-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-trash-can", "text-rose-500"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "max-h-[550px]", "overflow-y-auto"], [1, "w-full", "text-sm", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-955", "border-b", "border-slate-255/80", "dark:border-slate-800", "sticky", "top-0", "z-20", "shadow-2xs"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-28"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[150px]"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[120px]"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-24"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800/80"], [1, "hover:bg-slate-50/40", "dark:hover:bg-slate-800/20", "transition-all", "focus-within:bg-indigo-50/10", "dark:focus-within:bg-indigo-500/5", "border-l-4", "border-l-transparent", "focus-within:border-l-indigo-500", "duration-150"], [1, "py-1.5", "px-2", "w-28"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-extrabold", "focus:ring-2", "focus:ring-indigo-500/20", "focus:border-indigo-500", "outline-none", "text-center", "shadow-inner", 3, "ngModelChange", "keydown", "ngModel", "id"], [1, "py-2.5", "px-4", "font-mono", "font-bold", "text-xs", "text-slate-700", "dark:text-slate-200", "break-all"], [1, "py-1.5", "px-2"], ["type", "text", "placeholder", "Ghi ch\u00FA...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-indigo-500/20", "focus:border-indigo-500", "outline-none", "shadow-inner", 3, "ngModelChange", "keydown", "ngModel", "id"], [1, "py-1.5", "px-4", "text-center"], ["title", "Sao ch\u00E9p k\u1EBFt qu\u1EA3 d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng m\u1EABu kh\u00E1c trong b\u1EA3ng", 1, "w-7", "h-7", "flex", "items-center", "justify-center", "bg-indigo-50", "dark:bg-indigo-950/20", "hover:bg-indigo-650", "hover:text-white", "dark:hover:bg-indigo-600", "dark:hover:text-white", "text-indigo-600", "dark:text-indigo-400", "border", "border-indigo-100/60", "dark:border-indigo-900/30", "rounded-xl", "text-xs", "font-black", "transition", "shadow-2xs", "mx-auto", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-copy"]], template: function SopDefaultType2EntryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "fieldset", 0)(1, "app-sop-header-metadata", 1);
            i0.ɵɵlistener("draftChanged", function SopDefaultType2EntryComponent_Template_app_sop_header_metadata_draftChanged_1_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "div", 2)(3, "div", 3)(4, "h4", 4);
            i0.ɵɵelement(5, "i", 5);
            i0.ɵɵtext(6, " L\u01B0\u1EDBi Nh\u1EADp K\u1EBFt Qu\u1EA3 S\u1EAFc K\u00FD (Spreadsheet) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 6)(8, "span", 7);
            i0.ɵɵtext(9, "Thao t\u00E1c nhanh:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "button", 8);
            i0.ɵɵlistener("click", function SopDefaultType2EntryComponent_Template_button_click_10_listener() { return ctx.bulkFillND(); });
            i0.ɵɵelement(11, "i", 9);
            i0.ɵɵelementStart(12, "span");
            i0.ɵɵtext(13, "\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "button", 10);
            i0.ɵɵlistener("click", function SopDefaultType2EntryComponent_Template_button_click_14_listener() { return ctx.bulkClearAll(); });
            i0.ɵɵelement(15, "i", 11);
            i0.ɵɵelementStart(16, "span");
            i0.ɵɵtext(17, "X\u00F3a H\u1EBFt B\u1EA3ng");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(18, "div", 12)(19, "table", 13)(20, "thead")(21, "tr", 14)(22, "th", 15);
            i0.ɵɵtext(23, "L\u1ECD s\u1ED1");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "th", 16);
            i0.ɵɵtext(25, "M\u1EABu th\u1EED");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(26, SopDefaultType2EntryComponent_For_27_Template, 2, 1, "th", 17, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementStart(28, "th", 16);
            i0.ɵɵtext(29, "Ghi ch\u00FA");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "th", 18);
            i0.ɵɵtext(31, "H\u00E0ng");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(32, "tbody", 19);
            i0.ɵɵrepeaterCreate(33, SopDefaultType2EntryComponent_For_34_Template, 1, 1, null, null, _forTrack0);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance();
            i0.ɵɵproperty("draft", ctx.draft)("checkboxList", ctx.checkboxList);
            i0.ɵɵadvance(25);
            i0.ɵɵrepeater(ctx.activeColumns);
            i0.ɵɵadvance(7);
            i0.ɵɵrepeater(ctx.getDisplayRows());
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel, SopHeaderMetadataComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SopDefaultType2EntryComponent, [{
        type: Component,
        args: [{ selector: 'app-sop-default-type2-entry', standalone: true, imports: [CommonModule, FormsModule, SopHeaderMetadataComponent], template: "<fieldset [disabled]=\"isReadOnly\" class=\"space-y-6 animate-fade-in\">\r\n  \r\n  <!-- 1. Metadata Form & Checkboxes -->\r\n  <app-sop-header-metadata\r\n    title=\"Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (Ti\u00EAu chu\u1EA9n)\"\r\n    [draft]=\"draft\"\r\n    [checkboxList]=\"checkboxList\"\r\n    (draftChanged)=\"onDataChanged()\">\r\n  </app-sop-header-metadata>\r\n  \r\n  <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->\r\n  <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in\">\r\n    <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5\">\r\n      <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2\">\r\n        <i class=\"fa-solid fa-table-cells mr-1 text-indigo-500 text-sm\"></i> L\u01B0\u1EDBi Nh\u1EADp K\u1EBFt Qu\u1EA3 S\u1EAFc K\u00FD (Spreadsheet)\r\n      </h4>\r\n\r\n      <div class=\"flex flex-wrap items-center gap-2.5\">\r\n        <span class=\"text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1\">Thao t\u00E1c nhanh:</span>\r\n        \r\n        <button (click)=\"bulkFillND()\" \r\n                class=\"px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\">\r\n          <i class=\"fa-solid fa-pen-clip text-amber-500\"></i>\r\n          <span>\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng</span>\r\n        </button>\r\n\r\n        <button (click)=\"bulkClearAll()\" \r\n                class=\"px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-rose-50 dark:hover:bg-rose-955/20 text-slate-755 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-455 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\">\r\n          <i class=\"fa-solid fa-trash-can text-rose-500\"></i>\r\n          <span>X\u00F3a H\u1EBFt B\u1EA3ng</span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Spreadsheet Table Grid -->\r\n    <div class=\"overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[550px] overflow-y-auto\">\r\n      <table class=\"w-full text-sm border-collapse\">\r\n        <thead>\r\n          <tr class=\"bg-slate-50 dark:bg-slate-955 border-b border-slate-255/80 dark:border-slate-800 sticky top-0 z-20 shadow-2xs\">\r\n            <th class=\"py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-28\">L\u1ECD s\u1ED1</th>\r\n            <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[150px]\">M\u1EABu th\u1EED</th>\r\n            \r\n            @for (col of activeColumns; track col) {\r\n              <th class=\"py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[120px]\">\r\n                {{ columnDisplayNames()[col] || col }}\r\n              </th>\r\n            }\r\n            \r\n            <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[150px]\">Ghi ch\u00FA</th>\r\n            <th class=\"py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-24\">H\u00E0ng</th>\r\n          </tr>\r\n        </thead>\r\n        \r\n        <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800/80\">\r\n          @for (row of getDisplayRows(); track row.key; let rowIdx = $index) {\r\n            @if (draft.resultData[row.key]) {\r\n              <tr class=\"hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-indigo-50/10 dark:focus-within:bg-indigo-500/5 border-l-4 border-l-transparent focus-within:border-l-indigo-500 duration-150\">\r\n                <td class=\"py-1.5 px-2 w-28\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData[row.key]['loSo']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         [id]=\"'cell-' + rowIdx + '-loSo'\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, 'loSo', 0)\"\r\n                         placeholder=\"...\"\r\n                         class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-center shadow-inner\">\r\n                </td>\r\n                <td class=\"py-2.5 px-4 font-mono font-bold text-xs text-slate-700 dark:text-slate-200 break-all\">{{ row.label }}</td>\r\n                \r\n                @for (col of activeColumns; track col; let colIdx = $index) {\r\n                  <td class=\"py-1.5 px-2\">\r\n                    <input type=\"text\"\r\n                           [(ngModel)]=\"draft.resultData[row.key][col]\"\r\n                           (ngModelChange)=\"onDataChanged()\"\r\n                           [id]=\"'cell-' + rowIdx + '-' + col\"\r\n                           (keydown)=\"handleGridNavigation($event, rowIdx, col, colIdx + 1)\"\r\n                           placeholder=\"...\"\r\n                           class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-center shadow-inner\">\r\n                  </td>\r\n                }\r\n                \r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData[row.key]['ghiChu']\"\r\n                         (ngModelChange)=\"onDataChanged()\"\r\n                         [id]=\"'cell-' + rowIdx + '-ghiChu'\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, 'ghiChu', activeColumns.length + 1)\"\r\n                         placeholder=\"Ghi ch\u00FA...\"\r\n                         class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-inner\">\r\n                </td>\r\n                <td class=\"py-1.5 px-4 text-center\">\r\n                  <button (click)=\"copyRowToAll(row.key)\" \r\n                          class=\"w-7 h-7 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-650 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/30 rounded-xl text-xs font-black transition shadow-2xs mx-auto active:scale-90\"\r\n                          title=\"Sao ch\u00E9p k\u1EBFt qu\u1EA3 d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng m\u1EABu kh\u00E1c trong b\u1EA3ng\">\r\n                    <i class=\"fa-solid fa-copy\"></i>\r\n                  </button>\r\n                </td>\r\n              </tr>\r\n            }\r\n          }\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n  </div>\r\n</fieldset>\r\n" }]
    }], null, { run: [{
            type: Input
        }], draft: [{
            type: Input
        }], config: [{
            type: Input
        }], isReadOnly: [{
            type: Input
        }], publishedSampleSet: [{
            type: Input
        }], draftChanged: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SopDefaultType2EntryComponent, { className: "SopDefaultType2EntryComponent", filePath: "src/app/features/results/sops/sop-default-type2/sop-default-type2-entry.component.ts", lineNumber: 16 }); })();
//# sourceMappingURL=sop-default-type2-entry.component.js.map