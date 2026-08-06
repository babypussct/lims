import { Component, ElementRef, EventEmitter, HostListener, Input, Output, computed, inject, signal, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry, themeBalham, } from 'ag-grid-community';
import { StateService } from '../../core/services/state.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.column;
function ExcelDocumentViewerComponent_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.activeTransformCount(), " ");
} }
function ExcelDocumentViewerComponent_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "span", 37);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 38)(3, "button", 39);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_26_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goToSearchMatch(-1)); });
    i0.ɵɵelement(4, "i", 40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 41);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_26_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goToSearchMatch(1)); });
    i0.ɵɵelement(6, "i", 42);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 43);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_26_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSearch("")); });
    i0.ɵɵelement(8, "i", 44);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.searchPositionLabel(), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.searchMatches().length);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.searchMatches().length);
} }
function ExcelDocumentViewerComponent_Conditional_27_For_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 54);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r5 = ctx.$implicit;
    i0.ɵɵproperty("ngValue", option_r5.column);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(option_r5.label);
} }
function ExcelDocumentViewerComponent_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 45);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_27_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.filterPanelOpen.set(false)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(1, "section", 46)(2, "div", 47)(3, "div")(4, "h3", 48);
    i0.ɵɵtext(5, "L\u1ECDc & s\u1EAFp x\u1EBFp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 49);
    i0.ɵɵtext(7, " Ch\u1EC9 \u00E1p d\u1EE5ng cho c\u00E1c d\u00F2ng d\u1EEF li\u1EC7u, gi\u1EEF nguy\u00EAn ti\u00EAu \u0111\u1EC1 v\u00E0 t\u1EC7p g\u1ED1c. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 50);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_27_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.filterPanelOpen.set(false)); });
    i0.ɵɵelement(9, "i", 44);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 51)(11, "label", 52)(12, "span");
    i0.ɵɵtext(13, "C\u1ED9t d\u1EEF li\u1EC7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "select", 53);
    i0.ɵɵlistener("ngModelChange", function ExcelDocumentViewerComponent_Conditional_27_Template_select_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.filterColumn.set(+$event)); });
    i0.ɵɵrepeaterCreate(15, ExcelDocumentViewerComponent_Conditional_27_For_16_Template, 2, 2, "option", 54, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "label", 55)(18, "span");
    i0.ɵɵtext(19, "\u0110i\u1EC1u ki\u1EC7n l\u1ECDc");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "select", 53);
    i0.ɵɵlistener("ngModelChange", function ExcelDocumentViewerComponent_Conditional_27_Template_select_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.filterOperator.set($event)); });
    i0.ɵɵelementStart(21, "option", 56);
    i0.ɵɵtext(22, "C\u00F3 ch\u1EE9a");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "option", 57);
    i0.ɵɵtext(24, "B\u1EB1ng ch\u00EDnh x\u00E1c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "option", 58);
    i0.ɵɵtext(26, "Kh\u00F4ng tr\u1ED1ng");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(27, "label", 55)(28, "span");
    i0.ɵɵtext(29, "Gi\u00E1 tr\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "input", 59);
    i0.ɵɵlistener("ngModelChange", function ExcelDocumentViewerComponent_Conditional_27_Template_input_ngModelChange_30_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.filterValue.set($event)); })("keydown.enter", function ExcelDocumentViewerComponent_Conditional_27_Template_input_keydown_enter_30_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.applyFilterAndSort()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(31, "fieldset", 60)(32, "legend", 61);
    i0.ɵɵtext(33, " Th\u1EE9 t\u1EF1 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 62)(35, "button", 63);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_27_Template_button_click_35_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.sortDirection.set("none")); });
    i0.ɵɵtext(36, "M\u1EB7c \u0111\u1ECBnh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "button", 63);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_27_Template_button_click_37_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.sortDirection.set("asc")); });
    i0.ɵɵelement(38, "i", 64);
    i0.ɵɵtext(39, "T\u0103ng d\u1EA7n ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "button", 63);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_27_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.sortDirection.set("desc")); });
    i0.ɵɵelement(41, "i", 65);
    i0.ɵɵtext(42, "Gi\u1EA3m d\u1EA7n ");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(43, "div", 66)(44, "span", 67);
    i0.ɵɵtext(45);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "div", 68)(47, "button", 69);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_27_Template_button_click_47_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearFilterAndSort()); });
    i0.ɵɵtext(48, " X\u00F3a l\u1ECDc ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "button", 70);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_27_Template_button_click_49_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.applyFilterAndSort()); });
    i0.ɵɵtext(50, " \u00C1p d\u1EE5ng ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵproperty("ngModel", ctx_r1.filterColumn());
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.filterColumnOptions());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r1.filterOperator());
    i0.ɵɵadvance(7);
    i0.ɵɵclassProp("opacity-50", ctx_r1.filterOperator() === "notEmpty");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r1.filterValue())("disabled", ctx_r1.filterOperator() === "notEmpty");
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("sort-choice-active", ctx_r1.sortDirection() === "none");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("sort-choice-active", ctx_r1.sortDirection() === "asc");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("sort-choice-active", ctx_r1.sortDirection() === "desc");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.filteredRowsLabel(), " ");
} }
function ExcelDocumentViewerComponent_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 71);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Conditional_37_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.setGridFocusMode(false)); });
    i0.ɵɵelement(1, "i", 72);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Hi\u1EC7n c\u00F4ng c\u1EE5");
    i0.ɵɵelementEnd()();
} }
function ExcelDocumentViewerComponent_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 27);
    i0.ɵɵelement(1, "i", 73);
    i0.ɵɵelementStart(2, "span", 74);
    i0.ɵɵtext(3, "\u0110ang \u0111\u1ECDc workbook...");
    i0.ɵɵelementEnd()();
} }
function ExcelDocumentViewerComponent_For_43_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 75);
    i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_For_43_Template_button_click_0_listener() { const sheetName_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectSheet(sheetName_r8)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sheetName_r8 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("bg-white", ctx_r1.activeSheet() === sheetName_r8)("dark:bg-slate-800", ctx_r1.activeSheet() === sheetName_r8)("text-emerald-700", ctx_r1.activeSheet() === sheetName_r8)("text-slate-500", ctx_r1.activeSheet() !== sheetName_r8);
    i0.ɵɵattribute("aria-selected", ctx_r1.activeSheet() === sheetName_r8);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", sheetName_r8, " ");
} }
function ExcelDocumentViewerComponent_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 33);
    i0.ɵɵelement(1, "i", 76);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.copyStatus(), " ");
} }
function ExcelDocumentViewerComponent_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 34);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.selectionSummary());
} }
function ExcelDocumentViewerComponent_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 35);
    i0.ɵɵelement(1, "i", 77);
    i0.ɵɵtext(2, "Gi\u1EDBi h\u1EA1n xem ");
    i0.ɵɵelementEnd();
} }
ModuleRegistry.registerModules([AllCommunityModule]);
export class ExcelDocumentViewerComponent {
    constructor() {
        this.fileName = '';
        this.ready = new EventEmitter();
        this.failed = new EventEmitter();
        this.state = inject(StateService);
        this.host = inject(ElementRef);
        this.gridTheme = themeBalham
            .withParams({
            accentColor: '#16a34a',
            backgroundColor: '#ffffff',
            foregroundColor: '#334155',
            borderColor: '#e2e8f0',
            headerBackgroundColor: '#f3f6f9',
            headerTextColor: '#475569',
            oddRowBackgroundColor: '#ffffff',
            fontFamily: 'Aptos, Calibri, Arial, sans-serif',
            fontSize: 12,
            spacing: 3,
        }, 'light')
            .withParams({
            accentColor: '#4ade80',
            backgroundColor: '#1e293b',
            foregroundColor: '#e2e8f0',
            borderColor: '#334155',
            headerBackgroundColor: '#0f172a',
            headerTextColor: '#cbd5e1',
            oddRowBackgroundColor: '#1e293b',
            fontFamily: 'Aptos, Calibri, Arial, sans-serif',
            fontSize: 12,
            spacing: 3,
        }, 'dark');
        this.defaultColDef = {
            resizable: true,
            minWidth: 28,
            suppressMovable: true,
            sortable: false,
            filter: false,
        };
        this.loading = signal(true);
        this.sheetNames = signal([]);
        this.activeSheet = signal('');
        this.rowData = signal([]);
        this.columnDefs = signal([]);
        this.searchQuery = signal('');
        this.searchMatches = signal([]);
        this.activeSearchIndex = signal(-1);
        this.selection = signal(null);
        this.selectedAddress = signal('A1');
        this.selectedFormula = signal('');
        this.copyStatus = signal('');
        this.truncated = signal(false);
        this.visibleRows = signal(0);
        this.visibleColumns = signal(0);
        this.filterPanelOpen = signal(false);
        this.filterColumnOptions = signal([]);
        this.filterColumn = signal(0);
        this.filterOperator = signal('contains');
        this.filterValue = signal('');
        this.sortDirection = signal('none');
        this.activeFilter = signal(null);
        this.activeSort = signal(null);
        this.filteredDataRows = signal(0);
        this.gridFocusMode = signal(false);
        this.dimensionsLabel = computed(() => `${this.visibleRows().toLocaleString('vi-VN')} dòng · ${this.visibleColumns()} cột`);
        this.activeTransformCount = computed(() => (this.activeFilter() ? 1 : 0) + (this.activeSort() ? 1 : 0));
        this.filteredRowsLabel = computed(() => {
            const total = Math.max(0, this.dataEndIndex - this.dataStartIndex);
            if (!this.activeFilter() && !this.activeSort())
                return `${total.toLocaleString('vi-VN')} dòng dữ liệu`;
            return `Đang hiển thị ${this.filteredDataRows().toLocaleString('vi-VN')} / ${total.toLocaleString('vi-VN')} dòng`;
        });
        this.searchPositionLabel = computed(() => {
            const count = this.searchMatches().length;
            return count ? `${this.activeSearchIndex() + 1}/${count}` : '0/0';
        });
        this.selectionSummary = computed(() => {
            const rect = this.selectionRect();
            if (!rect)
                return 'Chưa chọn vùng';
            const count = (rect.bottom - rect.top + 1) * (rect.right - rect.left + 1);
            return count === 1 ? '1 ô' : `${count.toLocaleString('vi-VN')} ô`;
        });
        this.getRowHeight = (params) => Math.min(160, Math.max(24, Number(params.data?.['__height']) || 28));
        this.viewReady = false;
        this.loadToken = 0;
        this.searchToken = 0;
        this.dragging = false;
        this.visibleSheetColumns = [];
        this.mergeAnchors = new Map();
        this.mergeCovered = new Set();
        this.mergeSources = new Map();
        this.matchKeys = new Set();
        this.activeMatchKey = '';
        this.baseRows = [];
        this.dataStartIndex = 0;
        this.dataEndIndex = 0;
        this.fittedColumnWidths = [];
        this.textWidthCache = new Map();
    }
    ngAfterViewInit() {
        this.viewReady = true;
        if (typeof window !== 'undefined' && (window.innerWidth <= 640 || window.innerHeight <= 700)) {
            this.gridFocusMode.set(true);
        }
        void this.loadWorkbook();
    }
    ngOnChanges(changes) {
        if (changes['blob'] && !changes['blob'].firstChange && this.viewReady) {
            void this.loadWorkbook();
        }
    }
    ngOnDestroy() {
        this.loadToken++;
        if (this.searchTimer)
            clearTimeout(this.searchTimer);
        if (this.copyTimer)
            clearTimeout(this.copyTimer);
    }
    onDocumentMouseUp() {
        this.dragging = false;
    }
    handleEscape() {
        if (this.filterPanelOpen()) {
            this.filterPanelOpen.set(false);
            return true;
        }
        if (this.gridFocusMode()) {
            this.gridFocusMode.set(false);
            return true;
        }
        return false;
    }
    setGridFocusMode(enabled) {
        this.gridFocusMode.set(enabled);
        if (enabled)
            this.filterPanelOpen.set(false);
    }
    onDocumentCopy(event) {
        if (!this.host.nativeElement.contains(document.activeElement) || !this.selection())
            return;
        const text = this.selectionText();
        if (!text || !event.clipboardData)
            return;
        event.preventDefault();
        event.clipboardData.setData('text/plain', text);
        event.clipboardData.setData('text/tab-separated-values', text);
        this.showCopyStatus();
    }
    onGridReady(event) {
        this.gridApi = event.api;
        this.refreshGridDecorations();
    }
    onCellFocused(event) {
        if (event.rowIndex === null || !event.column || !this.xlsx || !this.worksheet)
            return;
        const colId = typeof event.column === 'string' ? event.column : event.column.getColId();
        if (!colId.startsWith('c'))
            return;
        const relativeColumn = Number(colId.slice(1));
        this.updateFormulaBar({ row: event.rowIndex, column: relativeColumn });
    }
    onCellMouseDown(event) {
        if (event.rowIndex === null)
            return;
        const mouseEvent = event.event;
        if (mouseEvent && mouseEvent.button !== 0)
            return;
        const colId = event.column.getColId();
        if (colId === '__rowNumber') {
            this.selectRows(event.rowIndex, event.rowIndex, Boolean(mouseEvent?.shiftKey));
            this.dragging = false;
            return;
        }
        if (!colId.startsWith('c'))
            return;
        const point = { row: event.rowIndex, column: Number(colId.slice(1)) };
        this.beginSelection(point, Boolean(mouseEvent?.shiftKey));
        this.dragging = true;
    }
    onCellMouseOver(event) {
        if (!this.dragging || event.rowIndex === null)
            return;
        const colId = event.column.getColId();
        if (!colId.startsWith('c'))
            return;
        const column = Number(colId.slice(1));
        if (!Number.isFinite(column))
            return;
        const current = this.selection();
        if (!current)
            return;
        this.selection.set({ anchor: current.anchor, focus: { row: event.rowIndex, column } });
        this.syncSelectionUi();
    }
    onColumnHeaderClicked(event) {
        const colId = event.column && 'getColId' in event.column ? event.column.getColId() : '';
        if (!colId)
            return;
        if (colId === '__rowNumber') {
            this.selectAll();
            return;
        }
        if (!colId.startsWith('c'))
            return;
        this.selectColumns(Number(colId.slice(1)), Number(colId.slice(1)), false);
    }
    onCellKeyDown(event) {
        if (!('column' in event))
            return;
        const keyboardEvent = event.event;
        const key = keyboardEvent.key.toLowerCase();
        if ((keyboardEvent.ctrlKey || keyboardEvent.metaKey) && key === 'a') {
            keyboardEvent.preventDefault();
            this.selectAll();
            return;
        }
        if ((keyboardEvent.ctrlKey || keyboardEvent.metaKey) && key === 'c') {
            keyboardEvent.preventDefault();
            void this.copySelection();
            return;
        }
        if ((keyboardEvent.ctrlKey || keyboardEvent.metaKey) && key === 'f') {
            keyboardEvent.preventDefault();
            this.host.nativeElement.querySelector('input[type="search"]')?.focus();
            return;
        }
        const moves = {
            arrowup: { row: -1, column: 0 },
            arrowdown: { row: 1, column: 0 },
            arrowleft: { row: 0, column: -1 },
            arrowright: { row: 0, column: 1 },
        };
        const move = moves[key];
        if (!move || event.rowIndex === null)
            return;
        const colId = event.column?.getColId();
        if (!colId?.startsWith('c'))
            return;
        keyboardEvent.preventDefault();
        const target = {
            row: Math.min(this.rowData().length - 1, Math.max(0, event.rowIndex + move.row)),
            column: Math.min(this.visibleSheetColumns.length - 1, Math.max(0, Number(colId.slice(1)) + move.column)),
        };
        if (keyboardEvent.shiftKey && this.selection()) {
            this.selection.set({ anchor: this.selection().anchor, focus: target });
        }
        else {
            this.selection.set({ anchor: target, focus: target });
        }
        this.gridApi?.setFocusedCell(target.row, `c${target.column}`);
        this.gridApi?.ensureIndexVisible(target.row, 'middle');
        this.gridApi?.ensureColumnVisible(`c${target.column}`, 'middle');
        this.updateFormulaBar(target);
        this.syncSelectionUi();
    }
    selectSheet(sheetName) {
        if (!this.workbook || !this.xlsx || this.activeSheet() === sheetName)
            return;
        this.activeSheet.set(sheetName);
        this.buildSheet(sheetName);
    }
    toggleFilterPanel() {
        this.filterPanelOpen.update(open => !open);
    }
    applyFilterAndSort() {
        const column = this.filterColumn();
        const operator = this.filterOperator();
        const value = this.filterValue().trim();
        const filter = operator === 'notEmpty' || value
            ? { column, operator, value }
            : null;
        const sort = this.sortDirection() === 'none'
            ? null
            : { column, direction: this.sortDirection() };
        this.activeFilter.set(filter);
        this.activeSort.set(sort);
        this.applyDataTransform();
        this.filterPanelOpen.set(false);
    }
    clearFilterAndSort() {
        this.filterValue.set('');
        this.filterOperator.set('contains');
        this.sortDirection.set('none');
        this.activeFilter.set(null);
        this.activeSort.set(null);
        this.applyDataTransform();
        this.filterPanelOpen.set(false);
    }
    fitSheetToContent() {
        if (!this.worksheet || !this.xlsx || !this.baseRows.length)
            return;
        const rows = this.baseRows.map(row => ({ ...row }));
        const widths = this.calculateAutoFitColumnWidths(rows);
        this.fittedColumnWidths = widths;
        this.applyAutoFitRowHeights(rows, widths);
        const columns = this.columnDefs().map((column, index) => index === 0
            ? column
            : { ...column, width: widths[index - 1] ?? column.width });
        this.baseRows = rows;
        this.columnDefs.set(columns);
        this.gridApi?.setGridOption('columnDefs', columns);
        this.applyDataTransform();
        this.copyStatus.set('Đã dãn vừa nội dung');
        if (this.copyTimer)
            clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => this.copyStatus.set(''), 1800);
    }
    onSearch(value) {
        this.searchQuery.set(value);
        const token = ++this.searchToken;
        if (this.searchTimer)
            clearTimeout(this.searchTimer);
        if (!value.trim()) {
            this.setSearchMatches([]);
            return;
        }
        this.searchTimer = setTimeout(() => {
            if (token === this.searchToken)
                this.computeSearchMatches(value);
        }, 100);
    }
    onSearchEnter(event) {
        this.goToSearchMatch(event.shiftKey ? -1 : 1);
    }
    goToSearchMatch(direction) {
        const matches = this.searchMatches();
        if (!matches.length)
            return;
        const current = this.activeSearchIndex();
        const next = current < 0
            ? 0
            : (current + direction + matches.length) % matches.length;
        this.activeSearchIndex.set(next);
        this.focusSearchMatch(matches[next]);
    }
    async copySelection() {
        const text = this.selectionText();
        if (!text)
            return;
        try {
            await navigator.clipboard.writeText(text);
        }
        catch {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
        }
        this.showCopyStatus();
    }
    async loadWorkbook() {
        if (!this.blob)
            return;
        const token = ++this.loadToken;
        this.loading.set(true);
        try {
            const xlsx = await import('xlsx');
            const buffer = await this.blob.arrayBuffer();
            if (token !== this.loadToken)
                return;
            const workbook = xlsx.read(buffer, {
                type: 'array',
                cellDates: true,
                cellNF: true,
                cellText: true,
                cellStyles: true,
                sheetStubs: true,
                dense: false,
            });
            if (!workbook.SheetNames.length)
                throw new Error('Workbook không có worksheet.');
            this.xlsx = xlsx;
            this.workbook = workbook;
            this.sheetNames.set(workbook.SheetNames);
            this.activeSheet.set(workbook.SheetNames[0]);
            this.buildSheet(workbook.SheetNames[0]);
            this.loading.set(false);
            this.ready.emit();
        }
        catch (error) {
            if (token !== this.loadToken)
                return;
            this.loading.set(false);
            this.failed.emit(error instanceof Error ? error.message : 'Không thể đọc tệp Excel.');
        }
    }
    buildSheet(sheetName) {
        if (!this.workbook || !this.xlsx)
            return;
        const worksheet = this.workbook.Sheets[sheetName];
        if (!worksheet)
            return;
        this.worksheet = worksheet;
        this.mergeAnchors.clear();
        this.mergeCovered.clear();
        this.mergeSources.clear();
        this.matchKeys.clear();
        this.activeMatchKey = '';
        this.searchMatches.set([]);
        this.activeSearchIndex.set(-1);
        this.filterPanelOpen.set(false);
        this.filterValue.set('');
        this.filterOperator.set('contains');
        this.sortDirection.set('none');
        this.activeFilter.set(null);
        this.activeSort.set(null);
        this.textWidthCache.clear();
        const reference = worksheet['!ref'] || 'A1:A1';
        const range = this.xlsx.utils.decode_range(reference);
        const columnMetadata = worksheet['!cols'] || [];
        const rowMetadata = worksheet['!rows'] || [];
        const allVisibleColumns = [];
        for (let column = range.s.c; column <= range.e.c; column++) {
            if (!columnMetadata[column]?.hidden)
                allVisibleColumns.push(column);
        }
        const maxColumns = 200;
        this.visibleSheetColumns = allVisibleColumns.slice(0, maxColumns);
        if (!this.visibleSheetColumns.length)
            this.visibleSheetColumns = [range.s.c];
        const maxCells = 500_000;
        const rowLimit = Math.min(50_000, Math.max(1, Math.floor(maxCells / this.visibleSheetColumns.length)));
        const visibleSheetRows = [];
        let totalUnhiddenRows = 0;
        for (let row = range.s.r; row <= range.e.r; row++) {
            if (rowMetadata[row]?.hidden)
                continue;
            totalUnhiddenRows++;
            if (visibleSheetRows.length < rowLimit)
                visibleSheetRows.push(row);
        }
        const displayedColumnSet = new Set(this.visibleSheetColumns);
        const displayedRowSet = new Set(visibleSheetRows);
        for (const merge of (worksheet['!merges'] || [])) {
            if (!displayedRowSet.has(merge.s.r) || !displayedColumnSet.has(merge.s.c))
                continue;
            this.mergeAnchors.set(this.cellKey(merge.s.r, merge.s.c), merge);
            for (let row = merge.s.r; row <= merge.e.r; row++) {
                for (let column = merge.s.c; column <= merge.e.c; column++) {
                    if (row !== merge.s.r || column !== merge.s.c) {
                        this.mergeCovered.add(this.cellKey(row, column));
                        this.mergeSources.set(this.cellKey(row, column), {
                            row: merge.s.r,
                            column: merge.s.c,
                        });
                    }
                }
            }
        }
        const columns = [
            {
                headerName: '',
                field: '__rowNumber',
                colId: '__rowNumber',
                pinned: 'left',
                width: 48,
                minWidth: 42,
                maxWidth: 72,
                sortable: false,
                filter: false,
                resizable: true,
                lockPosition: true,
                headerTooltip: 'Chọn toàn bộ trang tính',
                cellClass: params => {
                    const classes = ['excel-row-number'];
                    if (params.node.rowIndex !== null && this.isRowFullySelected(params.node.rowIndex)) {
                        classes.push('excel-selected-row-header');
                    }
                    return classes;
                },
            },
        ];
        this.visibleSheetColumns.forEach((sheetColumn, displayColumn) => {
            const metadata = columnMetadata[sheetColumn];
            const width = metadata?.wpx
                ? Math.min(420, Math.max(28, metadata.wpx))
                : metadata?.wch
                    ? Math.min(420, Math.max(28, Math.round(metadata.wch * 7 + 10)))
                    : 96;
            columns.push({
                headerName: this.xlsx.utils.encode_col(sheetColumn),
                field: `c${displayColumn}`,
                colId: `c${displayColumn}`,
                width,
                minWidth: 28,
                sortable: false,
                filter: false,
                suppressMovable: true,
                headerClass: () => this.isColumnFullySelected(displayColumn) ? 'excel-selected-header' : '',
                cellClass: params => this.cellClasses(params.node.rowIndex, displayColumn),
                cellStyle: params => {
                    const sheetRow = Number(params.data?.__rowNumber) - 1;
                    return this.originalCellStyle(sheetRow, sheetColumn);
                },
                colSpan: params => {
                    const sheetRow = Number(params.data?.__rowNumber) - 1;
                    const merge = this.mergeAnchors.get(this.cellKey(sheetRow, sheetColumn));
                    if (!merge)
                        return 1;
                    return this.visibleSheetColumns.filter(column => column >= merge.s.c && column <= merge.e.c).length || 1;
                },
            });
        });
        const rows = visibleSheetRows.map(sheetRow => {
            const metadata = rowMetadata[sheetRow];
            const rowData = {
                __rowNumber: sheetRow + 1,
                __height: metadata?.hpx
                    ? metadata.hpx
                    : metadata?.hpt
                        ? Math.round(metadata.hpt * 96 / 72)
                        : 28,
            };
            this.visibleSheetColumns.forEach((sheetColumn, displayColumn) => {
                const covered = this.mergeCovered.has(this.cellKey(sheetRow, sheetColumn));
                const cell = worksheet[this.xlsx.utils.encode_cell({ r: sheetRow, c: sheetColumn })];
                rowData[`c${displayColumn}`] = covered ? '' : (cell ? String(cell.w ?? cell.v ?? '') : '');
            });
            return rowData;
        });
        const autoFitWidths = this.calculateAutoFitColumnWidths(rows);
        this.fittedColumnWidths = autoFitWidths;
        this.applyAutoFitRowHeights(rows, autoFitWidths);
        autoFitWidths.forEach((width, displayColumn) => {
            columns[displayColumn + 1].width = width;
        });
        const totalUnhiddenColumns = allVisibleColumns.length;
        this.truncated.set(this.visibleSheetColumns.length < totalUnhiddenColumns ||
            visibleSheetRows.length < totalUnhiddenRows);
        this.visibleColumns.set(this.visibleSheetColumns.length);
        this.visibleRows.set(rows.length);
        this.columnDefs.set(columns);
        this.baseRows = rows;
        this.dataStartIndex = this.detectDataStartIndex(rows);
        this.dataEndIndex = this.detectDataEndIndex(rows, this.dataStartIndex);
        this.filterColumnOptions.set(this.buildFilterColumnOptions(rows, this.dataStartIndex));
        this.filterColumn.set(this.filterColumnOptions()[0]?.column ?? 0);
        this.filteredDataRows.set(Math.max(0, this.dataEndIndex - this.dataStartIndex));
        this.rowData.set([...rows]);
        const firstPoint = { row: 0, column: 0 };
        this.selection.set({ anchor: firstPoint, focus: firstPoint });
        this.updateFormulaBar(firstPoint);
        setTimeout(() => {
            this.gridApi?.setGridOption('columnDefs', columns);
            this.gridApi?.setGridOption('rowData', [...rows]);
            if (rows.length > 0) {
                this.gridApi?.ensureIndexVisible(0, 'top');
                this.gridApi?.setFocusedCell(0, 'c0');
            }
            this.refreshGridDecorations();
            if (this.searchQuery().trim())
                this.computeSearchMatches(this.searchQuery());
        });
    }
    calculateAutoFitColumnWidths(rows) {
        const minWidth = 44;
        const maxWidth = typeof window !== 'undefined' && window.innerWidth <= 640 ? 280 : 420;
        return this.visibleSheetColumns.map((sheetColumn, displayColumn) => {
            let longestLine = '';
            let longestSpan = 1;
            let longestScore = 0;
            for (const row of rows) {
                const text = String(row[`c${displayColumn}`] ?? '');
                if (!text)
                    continue;
                const sheetRow = Number(row.__rowNumber) - 1;
                const merge = this.mergeAnchors.get(this.cellKey(sheetRow, sheetColumn));
                const span = merge
                    ? Math.max(1, this.visibleSheetColumns.filter(column => column >= merge.s.c && column <= merge.e.c).length)
                    : 1;
                const candidate = text.split(/\r?\n/).reduce((longest, line) => this.visualTextLength(line) > this.visualTextLength(longest) ? line : longest, '');
                const score = this.visualTextLength(candidate) / span;
                if (score > longestScore) {
                    longestLine = candidate;
                    longestSpan = span;
                    longestScore = score;
                }
            }
            const preferredWidth = Math.ceil(this.measureTextWidth(longestLine) / longestSpan) + 16;
            return Math.min(maxWidth, Math.max(minWidth, preferredWidth));
        });
    }
    applyAutoFitRowHeights(rows, widths) {
        for (const row of rows) {
            const sheetRow = Number(row.__rowNumber) - 1;
            let requiredLines = 1;
            this.visibleSheetColumns.forEach((sheetColumn, displayColumn) => {
                const text = String(row[`c${displayColumn}`] ?? '');
                if (!text)
                    return;
                const address = this.xlsx?.utils.encode_cell({ r: sheetRow, c: sheetColumn });
                const cell = address ? this.worksheet?.[address] : undefined;
                const merge = this.mergeAnchors.get(this.cellKey(sheetRow, sheetColumn));
                const availableWidth = Math.max(20, (merge
                    ? this.visibleSheetColumns.reduce((width, column, index) => column >= merge.s.c && column <= merge.e.c ? width + (widths[index] || 96) : width, 0)
                    : (widths[displayColumn] || 96)) - 14);
                const wraps = Boolean(cell?.s?.alignment?.wrapText) ||
                    /\r?\n/.test(text) ||
                    this.visualTextLength(text) * 7 > availableWidth;
                if (!wraps)
                    return;
                const lines = text.split(/\r?\n/).reduce((count, line) => count + Math.max(1, Math.ceil(this.visualTextLength(line) * 7 / availableWidth)), 0);
                requiredLines = Math.max(requiredLines, lines);
            });
            const sourceHeight = Number(row['__height']) || 28;
            row['__height'] = Math.min(160, Math.max(24, sourceHeight, 10 + requiredLines * 16));
        }
    }
    measureTextWidth(value) {
        if (!value)
            return 0;
        const cached = this.textWidthCache.get(value);
        if (cached !== undefined)
            return cached;
        if (typeof document === 'undefined')
            return this.visualTextLength(value) * 7;
        if (this.measurementContext === undefined) {
            this.measurementContext = document.createElement('canvas').getContext('2d');
            if (this.measurementContext) {
                this.measurementContext.font = '12px Aptos, Calibri, Arial, sans-serif';
            }
        }
        const context = this.measurementContext;
        if (!context)
            return this.visualTextLength(value) * 7;
        const width = context.measureText(value.replace(/\t/g, '    ')).width;
        if (this.textWidthCache.size < 4_000)
            this.textWidthCache.set(value, width);
        return width;
    }
    visualTextLength(value) {
        return Array.from(value.replace(/\t/g, '    ')).reduce((length, character) => length + (/[MW@#%&\u3000-\u9fff]/u.test(character) ? 1.6 : 1), 0);
    }
    detectDataStartIndex(rows) {
        const firstStructuredRow = rows.findIndex(row => {
            const firstValue = String(row['c0'] ?? '').trim().replace(',', '.');
            const populatedCells = this.visibleSheetColumns.reduce((count, _column, displayColumn) => count + (String(row[`c${displayColumn}`] ?? '').trim() ? 1 : 0), 0);
            return /^-?\d+(?:\.\d+)?$/.test(firstValue) && populatedCells >= 2;
        });
        if (firstStructuredRow >= 0)
            return firstStructuredRow;
        const firstPopulatedRow = rows.findIndex(row => this.visibleSheetColumns.some((_column, displayColumn) => String(row[`c${displayColumn}`] ?? '').trim()));
        return Math.min(rows.length, Math.max(0, firstPopulatedRow + 1));
    }
    buildFilterColumnOptions(rows, dataStart) {
        return this.visibleSheetColumns.map((sheetColumn, displayColumn) => {
            const headings = [];
            for (let row = 0; row < dataStart; row++) {
                const text = String(rows[row]?.[`c${displayColumn}`] ?? '').trim();
                if (text && !headings.some(existing => this.normalize(existing) === this.normalize(text))) {
                    headings.push(text);
                }
            }
            const columnLetter = this.xlsx?.utils.encode_col(sheetColumn) || String(displayColumn + 1);
            const conciseHeadings = headings.slice(-2).join(' · ');
            return {
                column: displayColumn,
                label: conciseHeadings ? `${columnLetter} · ${conciseHeadings}` : `Cột ${columnLetter}`,
            };
        });
    }
    detectDataEndIndex(rows, dataStart) {
        let lastStructuredRow = dataStart - 1;
        for (let row = dataStart; row < rows.length; row++) {
            const firstValue = String(rows[row]?.['c0'] ?? '').trim().replace(',', '.');
            if (/^-?\d+(?:\.\d+)?$/.test(firstValue))
                lastStructuredRow = row;
        }
        return Math.max(dataStart, lastStructuredRow + 1);
    }
    applyDataTransform() {
        const headerRows = this.baseRows.slice(0, this.dataStartIndex);
        let dataRows = this.baseRows.slice(this.dataStartIndex, this.dataEndIndex);
        const footerRows = this.baseRows.slice(this.dataEndIndex);
        const filter = this.activeFilter();
        if (filter) {
            const expected = this.normalize(filter.value);
            dataRows = dataRows.filter(row => {
                const rawValue = String(row[`c${filter.column}`] ?? '').trim();
                const actual = this.normalize(rawValue);
                if (filter.operator === 'notEmpty')
                    return rawValue.length > 0;
                if (filter.operator === 'equals')
                    return actual === expected;
                return actual.includes(expected);
            });
        }
        const sort = this.activeSort();
        if (sort) {
            dataRows = [...dataRows].sort((left, right) => {
                const leftValue = left[`c${sort.column}`];
                const rightValue = right[`c${sort.column}`];
                const leftEmpty = String(leftValue ?? '').trim().length === 0;
                const rightEmpty = String(rightValue ?? '').trim().length === 0;
                if (leftEmpty !== rightEmpty)
                    return leftEmpty ? 1 : -1;
                const comparison = this.compareExcelValues(leftValue, rightValue);
                return sort.direction === 'asc' ? comparison : -comparison;
            });
        }
        const transformedRows = [...headerRows, ...dataRows, ...footerRows];
        this.filteredDataRows.set(dataRows.length);
        this.rowData.set(transformedRows);
        this.visibleRows.set(transformedRows.length);
        this.setSearchMatches([]);
        const firstPoint = { row: 0, column: 0 };
        this.selection.set(transformedRows.length ? { anchor: firstPoint, focus: firstPoint } : null);
        setTimeout(() => {
            this.gridApi?.setGridOption('rowData', transformedRows);
            if (transformedRows.length) {
                this.gridApi?.ensureIndexVisible(0, 'top');
                this.gridApi?.setFocusedCell(0, 'c0');
                this.updateFormulaBar(firstPoint);
            }
            this.refreshGridDecorations();
            if (this.searchQuery().trim())
                this.computeSearchMatches(this.searchQuery());
        });
    }
    compareExcelValues(left, right) {
        const leftText = String(left ?? '').trim();
        const rightText = String(right ?? '').trim();
        if (!leftText && !rightText)
            return 0;
        if (!leftText)
            return 1;
        if (!rightText)
            return -1;
        const leftNumber = Number(leftText.replace(/\s/g, '').replace(',', '.'));
        const rightNumber = Number(rightText.replace(/\s/g, '').replace(',', '.'));
        if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
            return leftNumber - rightNumber;
        }
        return leftText.localeCompare(rightText, 'vi', { numeric: true, sensitivity: 'base' });
    }
    beginSelection(point, extend) {
        const current = this.selection();
        this.selection.set({
            anchor: extend && current ? current.anchor : point,
            focus: point,
        });
        this.updateFormulaBar(point);
        this.syncSelectionUi();
    }
    selectRows(start, end, extend) {
        const current = this.selection();
        const anchorRow = extend && current ? current.anchor.row : start;
        this.selection.set({
            anchor: { row: anchorRow, column: 0 },
            focus: { row: end, column: Math.max(0, this.visibleSheetColumns.length - 1) },
        });
        this.updateFormulaBar({ row: end, column: 0 });
        this.syncSelectionUi();
    }
    selectColumns(start, end, extend) {
        const current = this.selection();
        const anchorColumn = extend && current ? current.anchor.column : start;
        this.selection.set({
            anchor: { row: 0, column: anchorColumn },
            focus: { row: Math.max(0, this.rowData().length - 1), column: end },
        });
        this.updateFormulaBar({ row: 0, column: end });
        this.syncSelectionUi();
    }
    selectAll() {
        this.selection.set({
            anchor: { row: 0, column: 0 },
            focus: {
                row: Math.max(0, this.rowData().length - 1),
                column: Math.max(0, this.visibleSheetColumns.length - 1),
            },
        });
        this.syncSelectionUi();
    }
    selectionRect() {
        const selection = this.selection();
        if (!selection)
            return null;
        return {
            top: Math.min(selection.anchor.row, selection.focus.row),
            bottom: Math.max(selection.anchor.row, selection.focus.row),
            left: Math.min(selection.anchor.column, selection.focus.column),
            right: Math.max(selection.anchor.column, selection.focus.column),
        };
    }
    isSelected(row, column) {
        const rect = this.selectionRect();
        return Boolean(rect && row >= rect.top && row <= rect.bottom && column >= rect.left && column <= rect.right);
    }
    isRowFullySelected(row) {
        const rect = this.selectionRect();
        return Boolean(rect && row >= rect.top && row <= rect.bottom &&
            rect.left === 0 && rect.right === this.visibleSheetColumns.length - 1);
    }
    isColumnFullySelected(column) {
        const rect = this.selectionRect();
        return Boolean(rect && column >= rect.left && column <= rect.right &&
            rect.top === 0 && rect.bottom === this.rowData().length - 1);
    }
    cellClasses(row, column) {
        if (row === null)
            return [];
        const classes = [];
        if (this.isSelected(row, column))
            classes.push('excel-selected-cell');
        const focus = this.selection()?.focus;
        if (focus?.row === row && focus.column === column)
            classes.push('excel-active-cell');
        const key = this.gridKey(row, column);
        if (this.matchKeys.has(key))
            classes.push('excel-search-match');
        if (this.activeMatchKey === key)
            classes.push('excel-search-active');
        return classes;
    }
    syncSelectionUi() {
        const focus = this.selection()?.focus;
        if (focus)
            this.updateFormulaBar(focus);
        this.refreshGridDecorations();
    }
    refreshGridDecorations() {
        this.gridApi?.refreshCells({ force: true });
        this.gridApi?.refreshHeader();
    }
    updateFormulaBar(point) {
        if (!this.xlsx || !this.worksheet)
            return;
        const row = this.rowData()[point.row];
        const sheetColumn = this.visibleSheetColumns[point.column];
        if (!row || sheetColumn === undefined)
            return;
        const sheetRow = row.__rowNumber - 1;
        const mergeSource = this.mergeSources.get(this.cellKey(sheetRow, sheetColumn));
        const sourceRow = mergeSource?.row ?? sheetRow;
        const sourceColumn = mergeSource?.column ?? sheetColumn;
        const address = this.xlsx.utils.encode_cell({ r: sourceRow, c: sourceColumn });
        const cell = this.worksheet[address];
        const rect = this.selectionRect();
        if (rect && (rect.top !== rect.bottom || rect.left !== rect.right)) {
            const startRow = this.rowData()[rect.top]?.__rowNumber - 1;
            const endRow = this.rowData()[rect.bottom]?.__rowNumber - 1;
            const startColumn = this.visibleSheetColumns[rect.left];
            const endColumn = this.visibleSheetColumns[rect.right];
            if ([startRow, endRow, startColumn, endColumn].every(Number.isFinite)) {
                const start = this.xlsx.utils.encode_cell({ r: startRow, c: startColumn });
                const end = this.xlsx.utils.encode_cell({ r: endRow, c: endColumn });
                this.selectedAddress.set(`${start}:${end}`);
            }
        }
        else {
            this.selectedAddress.set(address);
        }
        if (!cell)
            this.selectedFormula.set('');
        else if (cell.f)
            this.selectedFormula.set(`=${cell.f}`);
        else
            this.selectedFormula.set(String(cell.w ?? cell.v ?? ''));
    }
    computeSearchMatches(value) {
        const query = this.normalize(value.trim());
        if (!query) {
            this.setSearchMatches([]);
            return;
        }
        const matches = [];
        const rows = this.rowData();
        for (let row = 0; row < rows.length; row++) {
            for (let column = 0; column < this.visibleSheetColumns.length; column++) {
                if (this.normalize(String(rows[row][`c${column}`] ?? '')).includes(query)) {
                    matches.push({ row, column });
                }
            }
        }
        this.setSearchMatches(matches);
        if (matches.length)
            this.focusSearchMatch(matches[0]);
    }
    setSearchMatches(matches) {
        this.searchMatches.set(matches);
        this.activeSearchIndex.set(matches.length ? 0 : -1);
        this.matchKeys = new Set(matches.map(point => this.gridKey(point.row, point.column)));
        this.activeMatchKey = matches.length ? this.gridKey(matches[0].row, matches[0].column) : '';
        this.refreshGridDecorations();
    }
    focusSearchMatch(point) {
        this.activeMatchKey = this.gridKey(point.row, point.column);
        this.selection.set({ anchor: point, focus: point });
        this.gridApi?.ensureIndexVisible(point.row, 'middle');
        this.gridApi?.ensureColumnVisible(`c${point.column}`, 'middle');
        this.gridApi?.setFocusedCell(point.row, `c${point.column}`);
        this.updateFormulaBar(point);
        this.refreshGridDecorations();
    }
    selectionText() {
        const rect = this.selectionRect();
        if (!rect)
            return '';
        const rows = this.rowData();
        const lines = [];
        for (let row = rect.top; row <= rect.bottom; row++) {
            const values = [];
            for (let column = rect.left; column <= rect.right; column++) {
                values.push(String(rows[row]?.[`c${column}`] ?? ''));
            }
            lines.push(values.join('\t'));
        }
        return lines.join('\r\n');
    }
    showCopyStatus() {
        this.copyStatus.set(`Đã sao chép ${this.selectionSummary()}`);
        if (this.copyTimer)
            clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => this.copyStatus.set(''), 1800);
    }
    originalCellStyle(sheetRow, sheetColumn) {
        const cell = this.worksheet?.[this.xlsx?.utils.encode_cell({ r: sheetRow, c: sheetColumn }) || ''];
        const style = cell?.s;
        const css = {};
        const cellText = String(cell?.w ?? cell?.v ?? '');
        const displayColumn = this.visibleSheetColumns.indexOf(sheetColumn);
        const merge = this.mergeAnchors.get(this.cellKey(sheetRow, sheetColumn));
        const availableWidth = Math.max(20, (merge
            ? this.visibleSheetColumns.reduce((width, column, index) => column >= merge.s.c && column <= merge.e.c
                ? width + (this.fittedColumnWidths[index] || 96)
                : width, 0)
            : (this.fittedColumnWidths[displayColumn] || 96)) - 14);
        const contentNeedsWrap = /\r?\n/.test(cellText) || this.measureTextWidth(cellText) > availableWidth;
        if (!style || typeof style !== 'object') {
            return contentNeedsWrap ? { whiteSpace: 'pre-line', overflowWrap: 'anywhere' } : css;
        }
        const fill = this.excelColor(style.fgColor || style.fill?.fgColor);
        const fontColor = this.excelColor(style.font?.color);
        if (fill && style.patternType !== 'none')
            css['backgroundColor'] = fill;
        css['color'] = fontColor && /\.xlsx$/i.test(this.fileName)
            ? fontColor
            : (this.state.darkMode() ? '#e2e8f0' : '#334155');
        if (style.font?.bold)
            css['fontWeight'] = 700;
        if (style.font?.italic)
            css['fontStyle'] = 'italic';
        if (style.font?.sz)
            css['fontSize'] = `${Math.min(28, Math.max(8, style.font.sz))}px`;
        const horizontal = style.alignment?.horizontal;
        if (horizontal === 'center' || horizontal === 'right' || horizontal === 'left') {
            css['textAlign'] = horizontal;
        }
        if (style.alignment?.wrapText || contentNeedsWrap) {
            css['whiteSpace'] = 'normal';
            css['overflowWrap'] = 'anywhere';
        }
        if (/\r?\n/.test(cellText))
            css['whiteSpace'] = 'pre-line';
        return css;
    }
    excelColor(color) {
        const raw = typeof color?.rgb === 'string' ? color.rgb.replace(/^FF/i, '') : '';
        return /^[0-9a-f]{6}$/i.test(raw) ? `#${raw}` : '';
    }
    normalize(value) {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/gi, 'd')
            .toLowerCase();
    }
    cellKey(row, column) {
        return `${row}:${column}`;
    }
    gridKey(row, column) {
        return `${row}:${column}`;
    }
    static { this.ɵfac = function ExcelDocumentViewerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ExcelDocumentViewerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ExcelDocumentViewerComponent, selectors: [["app-excel-document-viewer"]], hostBindings: function ExcelDocumentViewerComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("mouseup", function ExcelDocumentViewerComponent_mouseup_HostBindingHandler() { return ctx.onDocumentMouseUp(); }, false, i0.ɵɵresolveDocument)("copy", function ExcelDocumentViewerComponent_copy_HostBindingHandler($event) { return ctx.onDocumentCopy($event); }, false, i0.ɵɵresolveDocument);
        } }, inputs: { blob: "blob", fileName: "fileName" }, outputs: { ready: "ready", failed: "failed" }, features: [i0.ɵɵNgOnChangesFeature], decls: 50, vars: 34, consts: [["sheetSearch", ""], [1, "relative", "h-full", "min-h-0", "flex", "flex-col", "bg-white", "dark:bg-slate-900"], [1, "excel-toolbar", "min-h-11", "shrink-0", "flex", "items-center", "gap-1.5", "px-2", "md:px-3", "py-1.5", "bg-white", "dark:bg-slate-900", "border-b", "border-slate-200", "dark:border-slate-700"], ["type", "button", "title", "Sao ch\u00E9p v\u00F9ng \u0111\u00E3 ch\u1ECDn (Ctrl+C)", 1, "excel-tool-button", "shrink-0", 3, "click", "disabled"], [1, "fa-regular", "fa-copy"], [1, "hidden", "sm:inline"], ["type", "button", "title", "T\u1EF1 d\u00E3n c\u1ED9t v\u00E0 h\u00E0ng v\u1EEBa kh\u00EDt n\u1ED9i dung", 1, "excel-tool-button", "shrink-0", 3, "click"], [1, "fa-solid", "fa-arrows-left-right-to-line"], [1, "hidden", "md:inline"], ["type", "button", "title", "L\u1ECDc v\u00E0 s\u1EAFp x\u1EBFp c\u00E1c d\u00F2ng d\u1EEF li\u1EC7u", 1, "excel-tool-button", "shrink-0", 3, "click"], [1, "fa-solid", "fa-arrow-down-wide-short"], [1, "min-w-4", "h-4", "px-1", "rounded-full", "bg-emerald-600", "text-white", "text-[9px]", "inline-flex", "items-center", "justify-center"], [1, "hidden", "lg:inline-flex", "items-center", "h-7", "px-2", "rounded-md", "bg-emerald-50", "dark:bg-emerald-950/40", "text-[10px]", "font-bold", "text-emerald-700", "dark:text-emerald-300"], [1, "fa-solid", "fa-lock", "mr-1.5"], ["type", "button", "title", "M\u1EDF r\u1ED9ng v\u00F9ng thao t\u00E1c sheet", 1, "excel-tool-button", "shrink-0", "ml-auto", "sm:ml-0", 3, "click"], [1, "fa-solid", "fa-expand"], [1, "hidden", "xl:inline"], [1, "relative", "flex-1", "sm:flex-none", "sm:w-72", "sm:ml-auto"], [1, "fa-solid", "fa-magnifying-glass", "absolute", "left-2.5", "top-1/2", "-translate-y-1/2", "text-slate-400", "text-xs"], ["type", "search", "placeholder", "T\u00ECm trong trang t\u00EDnh...", 1, "w-full", "h-8", "pl-8", "pr-24", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "text-xs", "outline-none", "focus:ring-2", "focus:ring-emerald-500/30", "dark:text-white", 3, "ngModelChange", "keydown.enter", "ngModel"], [1, "excel-formula-bar", "h-9", "shrink-0", "grid", "grid-cols-[70px_minmax(0,1fr)]", "border-b", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-950"], [1, "flex", "items-center", "justify-center", "border-r", "border-slate-200", "dark:border-slate-700", "text-xs", "font-black", "text-slate-600", "dark:text-slate-300", "tabular-nums", "px-1"], [1, "min-w-0", "flex", "items-center"], [1, "w-8", "h-full", "flex", "items-center", "justify-center", "text-xs", "italic", "font-serif", "text-slate-400", "border-r", "border-slate-200", "dark:border-slate-700"], [1, "min-w-0", "flex-1", "px-2.5", "text-xs", "text-slate-700", "dark:text-slate-200", "whitespace-nowrap", "overflow-x-auto", "scrollbar-none"], [1, "flex-1", "min-h-0", "relative"], ["type", "button", "title", "Hi\u1EC7n l\u1EA1i thanh c\u00F4ng c\u1EE5 v\u00E0 thanh c\u00F4ng th\u1EE9c", 1, "excel-grid-focus-exit"], [1, "absolute", "inset-0", "z-20", "flex", "flex-col", "items-center", "justify-center", "bg-white", "dark:bg-slate-900"], [1, "w-full", "h-full", "excel-preview-grid", 3, "gridReady", "cellFocused", "cellMouseDown", "cellMouseOver", "cellKeyDown", "columnHeaderClicked", "theme", "rowData", "columnDefs", "defaultColDef", "headerHeight", "animateRows", "ensureDomOrder", "enableCellTextSelection", "suppressRowClickSelection", "suppressContextMenu", "suppressDragLeaveHidesColumns", "suppressColumnMoveAnimation", "getRowHeight"], [1, "excel-sheet-tabs", "relative", "z-20", "shrink-0", "flex", "items-center", "bg-slate-100", "dark:bg-slate-950", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "flex-1", "min-w-0", "h-full", "flex", "items-center", "overflow-x-auto", "overscroll-x-contain", "scrollbar-none", "px-1"], ["type", "button", "role", "tab", 1, "h-8", "px-3", "border-r", "border-slate-200", "dark:border-slate-700", "text-[11px]", "font-bold", "whitespace-nowrap", "transition-colors", 3, "bg-white", "dark:bg-slate-800", "text-emerald-700", "text-slate-500"], [1, "h-full", "shrink-0", "flex", "items-center", "gap-2", "px-2.5", "border-l", "border-slate-200", "dark:border-slate-700", "text-[10px]", "font-semibold", "text-slate-500", "dark:text-slate-400"], [1, "text-emerald-700", "dark:text-emerald-300"], [1, "hidden", "sm:inline", "tabular-nums"], ["title", "B\u1EA3ng qu\u00E1 l\u1EDBn n\u00EAn b\u1EA3n xem tr\u01B0\u1EDBc \u0111\u00E3 \u0111\u01B0\u1EE3c gi\u1EDBi h\u1EA1n", 1, "text-amber-600", "dark:text-amber-400"], [1, "tabular-nums"], [1, "absolute", "right-16", "top-1/2", "-translate-y-1/2", "text-[10px]", "font-bold", "tabular-nums", "text-slate-500", "dark:text-slate-300"], [1, "absolute", "right-1", "top-1/2", "-translate-y-1/2", "flex"], ["type", "button", "aria-label", "K\u1EBFt qu\u1EA3 tr\u01B0\u1EDBc", "title", "K\u1EBFt qu\u1EA3 tr\u01B0\u1EDBc (Shift+Enter)", 1, "excel-search-button", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-up"], ["type", "button", "aria-label", "K\u1EBFt qu\u1EA3 ti\u1EBFp theo", "title", "K\u1EBFt qu\u1EA3 ti\u1EBFp theo (Enter)", 1, "excel-search-button", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-down"], ["type", "button", "aria-label", "X\u00F3a t\u00ECm ki\u1EBFm", "title", "X\u00F3a t\u00ECm ki\u1EBFm", 1, "excel-search-button", 3, "click"], [1, "fa-solid", "fa-times"], ["type", "button", "aria-label", "\u0110\u00F3ng b\u1EA3ng l\u1ECDc", 1, "absolute", "inset-0", "z-40", "bg-transparent", "cursor-default", 3, "click"], ["role", "dialog", "aria-label", "L\u1ECDc v\u00E0 s\u1EAFp x\u1EBFp d\u1EEF li\u1EC7u", 1, "excel-filter-panel", "absolute", "z-50", "top-12", "left-2", "right-2", "sm:left-auto", "sm:right-3", "sm:w-[430px]"], [1, "flex", "items-start", "justify-between", "gap-3", "px-4", "py-3", "border-b", "border-slate-200", "dark:border-slate-700"], [1, "text-sm", "font-black", "text-slate-800", "dark:text-white"], [1, "mt-0.5", "text-[10px]", "text-slate-500", "dark:text-slate-400"], ["type", "button", "aria-label", "\u0110\u00F3ng", 1, "w-7", "h-7", "rounded-lg", "text-slate-400", "hover:bg-slate-100", "dark:hover:bg-slate-800", 3, "click"], [1, "p-4", "grid", "grid-cols-1", "sm:grid-cols-2", "gap-3"], [1, "sm:col-span-2", "filter-field"], [3, "ngModelChange", "ngModel"], [3, "ngValue"], [1, "filter-field"], ["value", "contains"], ["value", "equals"], ["value", "notEmpty"], ["type", "text", "placeholder", "Nh\u1EADp n\u1ED9i dung c\u1EA7n l\u1ECDc", 3, "ngModelChange", "keydown.enter", "ngModel", "disabled"], [1, "sm:col-span-2"], [1, "text-[10px]", "uppercase", "tracking-wide", "font-black", "text-slate-500", "dark:text-slate-400", "mb-1.5"], [1, "grid", "grid-cols-3", "gap-1.5"], ["type", "button", 1, "sort-choice", 3, "click"], [1, "fa-solid", "fa-arrow-up-a-z", "mr-1"], [1, "fa-solid", "fa-arrow-down-z-a", "mr-1"], [1, "flex", "items-center", "justify-between", "gap-2", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-950", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "text-[10px]", "font-semibold", "text-slate-500", "dark:text-slate-400"], [1, "flex", "gap-2"], ["type", "button", 1, "h-8", "px-3", "rounded-lg", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-800", 3, "click"], ["type", "button", 1, "h-8", "px-4", "rounded-lg", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "text-xs", "font-black", "shadow-sm", 3, "click"], ["type", "button", "title", "Hi\u1EC7n l\u1EA1i thanh c\u00F4ng c\u1EE5 v\u00E0 thanh c\u00F4ng th\u1EE9c", 1, "excel-grid-focus-exit", 3, "click"], [1, "fa-solid", "fa-compress"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-3xl", "text-emerald-500"], [1, "mt-2", "text-xs", "font-semibold", "text-slate-500"], ["type", "button", "role", "tab", 1, "h-8", "px-3", "border-r", "border-slate-200", "dark:border-slate-700", "text-[11px]", "font-bold", "whitespace-nowrap", "transition-colors", 3, "click"], [1, "fa-solid", "fa-check", "mr-1"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"]], template: function ExcelDocumentViewerComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 1)(1, "div", 2)(2, "button", 3);
            i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.copySelection()); });
            i0.ɵɵelement(3, "i", 4);
            i0.ɵɵelementStart(4, "span", 5);
            i0.ɵɵtext(5, "Sao ch\u00E9p");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "button", 6);
            i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.fitSheetToContent()); });
            i0.ɵɵelement(7, "i", 7);
            i0.ɵɵelementStart(8, "span", 8);
            i0.ɵɵtext(9, "V\u1EEBa n\u1ED9i dung");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(10, "button", 9);
            i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.toggleFilterPanel()); });
            i0.ɵɵelement(11, "i", 10);
            i0.ɵɵelementStart(12, "span", 5);
            i0.ɵɵtext(13, "L\u1ECDc & s\u1EAFp x\u1EBFp");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(14, ExcelDocumentViewerComponent_Conditional_14_Template, 2, 1, "span", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "span", 12);
            i0.ɵɵelement(16, "i", 13);
            i0.ɵɵtext(17, "Ch\u1EC9 \u0111\u1ECDc \u00B7 kh\u00F4ng thay \u0111\u1ED5i t\u1EC7p g\u1ED1c ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "button", 14);
            i0.ɵɵlistener("click", function ExcelDocumentViewerComponent_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.setGridFocusMode(true)); });
            i0.ɵɵelement(19, "i", 15);
            i0.ɵɵelementStart(20, "span", 16);
            i0.ɵɵtext(21, "M\u1EDF r\u1ED9ng sheet");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(22, "div", 17);
            i0.ɵɵelement(23, "i", 18);
            i0.ɵɵelementStart(24, "input", 19, 0);
            i0.ɵɵlistener("ngModelChange", function ExcelDocumentViewerComponent_Template_input_ngModelChange_24_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSearch($event)); })("keydown.enter", function ExcelDocumentViewerComponent_Template_input_keydown_enter_24_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSearchEnter($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(26, ExcelDocumentViewerComponent_Conditional_26_Template, 9, 3);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(27, ExcelDocumentViewerComponent_Conditional_27_Template, 51, 13);
            i0.ɵɵelementStart(28, "div", 20)(29, "div", 21);
            i0.ɵɵtext(30);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "div", 22)(32, "span", 23);
            i0.ɵɵtext(33, "fx");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "div", 24);
            i0.ɵɵtext(35);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(36, "div", 25);
            i0.ɵɵtemplate(37, ExcelDocumentViewerComponent_Conditional_37_Template, 4, 0, "button", 26)(38, ExcelDocumentViewerComponent_Conditional_38_Template, 4, 0, "div", 27);
            i0.ɵɵelementStart(39, "ag-grid-angular", 28);
            i0.ɵɵlistener("gridReady", function ExcelDocumentViewerComponent_Template_ag_grid_angular_gridReady_39_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onGridReady($event)); })("cellFocused", function ExcelDocumentViewerComponent_Template_ag_grid_angular_cellFocused_39_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onCellFocused($event)); })("cellMouseDown", function ExcelDocumentViewerComponent_Template_ag_grid_angular_cellMouseDown_39_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onCellMouseDown($event)); })("cellMouseOver", function ExcelDocumentViewerComponent_Template_ag_grid_angular_cellMouseOver_39_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onCellMouseOver($event)); })("cellKeyDown", function ExcelDocumentViewerComponent_Template_ag_grid_angular_cellKeyDown_39_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onCellKeyDown($event)); })("columnHeaderClicked", function ExcelDocumentViewerComponent_Template_ag_grid_angular_columnHeaderClicked_39_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onColumnHeaderClicked($event)); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(40, "div", 29)(41, "div", 30);
            i0.ɵɵrepeaterCreate(42, ExcelDocumentViewerComponent_For_43_Template, 2, 10, "button", 31, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "div", 32);
            i0.ɵɵtemplate(45, ExcelDocumentViewerComponent_Conditional_45_Template, 3, 1, "span", 33)(46, ExcelDocumentViewerComponent_Conditional_46_Template, 2, 1, "span", 34)(47, ExcelDocumentViewerComponent_Conditional_47_Template, 3, 0, "span", 35);
            i0.ɵɵelementStart(48, "span", 36);
            i0.ɵɵtext(49);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵclassProp("excel-grid-focus", ctx.gridFocusMode());
            i0.ɵɵattribute("data-ag-theme-mode", ctx.state.darkMode() ? "dark" : "light");
            i0.ɵɵadvance();
            i0.ɵɵclassProp("hidden", ctx.gridFocusMode());
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", !ctx.selection());
            i0.ɵɵadvance(8);
            i0.ɵɵclassProp("excel-tool-active", ctx.activeTransformCount() > 0 || ctx.filterPanelOpen());
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.activeTransformCount() > 0 ? 14 : -1);
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("ngModel", ctx.searchQuery());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.searchQuery() ? 26 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.filterPanelOpen() ? 27 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("hidden", ctx.gridFocusMode());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.selectedAddress(), " ");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate1(" ", ctx.selectedFormula() || "Ch\u1ECDn m\u1ED9t \u00F4 \u0111\u1EC3 xem gi\u00E1 tr\u1ECB ho\u1EB7c c\u00F4ng th\u1EE9c", " ");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.gridFocusMode() ? 37 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loading() ? 38 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("theme", ctx.gridTheme)("rowData", ctx.rowData())("columnDefs", ctx.columnDefs())("defaultColDef", ctx.defaultColDef)("headerHeight", 29)("animateRows", false)("ensureDomOrder", true)("enableCellTextSelection", false)("suppressRowClickSelection", true)("suppressContextMenu", true)("suppressDragLeaveHidesColumns", true)("suppressColumnMoveAnimation", true)("getRowHeight", ctx.getRowHeight);
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.sheetNames());
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.copyStatus() ? 45 : 46);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.truncated() ? 47 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.dimensionsLabel());
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel, AgGridAngular], styles: [".excel-tool-button[_ngcontent-%COMP%] {\n      height: 2rem;\n      padding-inline: .65rem;\n      border-radius: .5rem;\n      border: 1px solid #cbd5e1;\n      color: #475569;\n      display: inline-flex;\n      align-items: center;\n      gap: .4rem;\n      font-size: .7rem;\n      font-weight: 800;\n    }\n    .excel-tool-button[_ngcontent-%COMP%]:hover:not(:disabled) { color: #047857; border-color: #6ee7b7; background: #ecfdf5; }\n    .excel-tool-button[_ngcontent-%COMP%]:disabled { opacity: .4; cursor: not-allowed; }\n    .excel-tool-active[_ngcontent-%COMP%] {\n      color: #047857;\n      border-color: #6ee7b7;\n      background: #ecfdf5;\n    }\n    .excel-filter-panel[_ngcontent-%COMP%] {\n      border-radius: .85rem;\n      border: 1px solid #cbd5e1;\n      background: #fff;\n      box-shadow: 0 18px 50px rgba(15, 23, 42, .22);\n      overflow: hidden;\n    }\n    .filter-field[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      gap: .35rem;\n    }\n    .filter-field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n      font-size: .625rem;\n      line-height: 1rem;\n      text-transform: uppercase;\n      letter-spacing: .04em;\n      font-weight: 900;\n      color: #64748b;\n    }\n    .filter-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n   .filter-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n      width: 100%;\n      height: 2.25rem;\n      border: 1px solid #cbd5e1;\n      border-radius: .55rem;\n      padding-inline: .65rem;\n      background: #fff;\n      color: #334155;\n      font-size: .75rem;\n      outline: none;\n    }\n    .filter-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n   .filter-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n      border-color: #34d399;\n      box-shadow: 0 0 0 3px rgba(16, 185, 129, .13);\n    }\n    .sort-choice[_ngcontent-%COMP%] {\n      min-height: 2.25rem;\n      padding: .35rem .5rem;\n      border: 1px solid #cbd5e1;\n      border-radius: .55rem;\n      color: #64748b;\n      font-size: .68rem;\n      font-weight: 800;\n    }\n    .sort-choice[_ngcontent-%COMP%]:hover { border-color: #6ee7b7; color: #047857; }\n    .sort-choice-active[_ngcontent-%COMP%] {\n      border-color: #34d399;\n      color: #047857;\n      background: #ecfdf5;\n      box-shadow: inset 0 0 0 1px #34d399;\n    }\n    .excel-search-button[_ngcontent-%COMP%] {\n      width: 1.25rem;\n      height: 1.6rem;\n      color: #64748b;\n      border-radius: .25rem;\n      font-size: .58rem;\n    }\n    .excel-search-button[_ngcontent-%COMP%]:hover:not(:disabled) { color: #047857; background: #d1fae5; }\n    .excel-search-button[_ngcontent-%COMP%]:disabled { opacity: .35; }\n    .excel-grid-focus-exit[_ngcontent-%COMP%] {\n      position: absolute;\n      top: .4rem;\n      right: .55rem;\n      z-index: 30;\n      min-height: 2rem;\n      padding-inline: .65rem;\n      border-radius: .55rem;\n      border: 1px solid rgba(148, 163, 184, .75);\n      background: rgba(255, 255, 255, .92);\n      color: #475569;\n      box-shadow: 0 4px 14px rgba(15, 23, 42, .14);\n      backdrop-filter: blur(8px);\n      display: inline-flex;\n      align-items: center;\n      gap: .4rem;\n      font-size: .68rem;\n      font-weight: 800;\n    }\n    .excel-grid-focus-exit[_ngcontent-%COMP%]:hover { color: #047857; border-color: #6ee7b7; background: #ecfdf5; }\n    .excel-grid-focus[_ngcontent-%COMP%]   .excel-sheet-tabs[_ngcontent-%COMP%] {\n      height: 2rem;\n      min-height: 2rem;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .ag-root-wrapper {\n      border: 0 !important;\n      border-radius: 0 !important;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .ag-header-cell {\n      font-size: 11px;\n      font-weight: 700;\n      justify-content: center;\n      border-right: 1px solid #dbe3ec;\n      user-select: none;\n      cursor: default;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .ag-header-cell.excel-selected-header {\n      background: #d1fae5 !important;\n      color: #047857 !important;\n      box-shadow: inset 0 -2px #10b981;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .ag-cell {\n      border-right: 1px solid #e2e8f0;\n      border-bottom: 1px solid #e2e8f0;\n      font-size: 12px;\n      padding-inline: 6px;\n      user-select: none;\n      cursor: cell;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .excel-row-number {\n      background: #f8fafc;\n      color: #64748b;\n      text-align: center;\n      font-variant-numeric: tabular-nums;\n      border-right: 1px solid #cbd5e1;\n      cursor: default;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .excel-selected-row-header {\n      background: #d1fae5 !important;\n      color: #047857 !important;\n      font-weight: 800;\n      box-shadow: inset -2px 0 #10b981;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .excel-selected-cell::after {\n      content: '';\n      position: absolute;\n      inset: 0;\n      z-index: 1;\n      pointer-events: none;\n      background: rgba(37, 99, 235, .16);\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .excel-active-cell {\n      z-index: 3;\n      outline: 2px solid #16a34a !important;\n      outline-offset: -2px;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .excel-search-match {\n      box-shadow: inset 0 0 0 2px #facc15;\n      background-image: linear-gradient(rgba(254, 240, 138, .32), rgba(254, 240, 138, .32));\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .excel-search-active {\n      box-shadow: inset 0 0 0 3px #f97316;\n      background-image: linear-gradient(rgba(253, 186, 116, .38), rgba(253, 186, 116, .38));\n      z-index: 2;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .ag-cell-focus {\n      border-color: #e2e8f0 !important;\n    }\n    [_nghost-%COMP%]     .excel-preview-grid .ag-cell-focus.excel-active-cell {\n      border-color: transparent !important;\n    }\n    .dark[_nghost-%COMP%]   .excel-tool-button[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .excel-tool-button[_ngcontent-%COMP%] { color: #cbd5e1; border-color: #475569; }\n    .dark[_nghost-%COMP%]   .excel-tool-active[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .excel-tool-active[_ngcontent-%COMP%] { color: #6ee7b7; border-color: #047857; background: rgba(6, 78, 59, .4); }\n    .dark[_nghost-%COMP%]   .excel-filter-panel[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .excel-filter-panel[_ngcontent-%COMP%] { background: #1e293b; border-color: #475569; }\n    .dark[_nghost-%COMP%]   .excel-grid-focus-exit[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .excel-grid-focus-exit[_ngcontent-%COMP%] {\n      background: rgba(15, 23, 42, .92);\n      border-color: #475569;\n      color: #cbd5e1;\n    }\n    .dark[_nghost-%COMP%]   .filter-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .filter-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n   .dark[_nghost-%COMP%]   .filter-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .filter-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n      background: #0f172a;\n      border-color: #475569;\n      color: #e2e8f0;\n    }\n    .dark[_nghost-%COMP%]   .sort-choice[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sort-choice[_ngcontent-%COMP%] { border-color: #475569; color: #cbd5e1; }\n    .dark[_nghost-%COMP%]   .sort-choice-active[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sort-choice-active[_ngcontent-%COMP%] { color: #6ee7b7; border-color: #059669; background: rgba(6, 78, 59, .45); }\n    .dark[_nghost-%COMP%]     .excel-preview-grid .ag-header-cell, .dark   [_nghost-%COMP%]     .excel-preview-grid .ag-header-cell, \n   .dark[_nghost-%COMP%]     .excel-preview-grid .ag-cell, .dark   [_nghost-%COMP%]     .excel-preview-grid .ag-cell {\n      border-color: #334155;\n    }\n    .dark[_nghost-%COMP%]     .excel-preview-grid .excel-row-number, .dark   [_nghost-%COMP%]     .excel-preview-grid .excel-row-number {\n      background: #0f172a;\n      color: #94a3b8;\n      border-right-color: #475569;\n    }\n    .dark[_nghost-%COMP%]     .excel-preview-grid .excel-selected-cell::after, .dark   [_nghost-%COMP%]     .excel-preview-grid .excel-selected-cell::after {\n      background: rgba(59, 130, 246, .28);\n    }\n    @media (max-width: 640px) {\n      [_nghost-%COMP%]     .excel-preview-grid .ag-cell { font-size: 11px; padding-inline: 5px; }\n    }\n    .excel-sheet-tabs[_ngcontent-%COMP%] {\n      height: 2.25rem;\n      min-height: 2.25rem;\n    }\n    @media (max-width: 767px) {\n      .excel-sheet-tabs[_ngcontent-%COMP%] {\n        height: auto;\n        min-height: calc(2.25rem + env(safe-area-inset-bottom));\n        padding-bottom: env(safe-area-inset-bottom);\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ExcelDocumentViewerComponent, [{
        type: Component,
        args: [{ selector: 'app-excel-document-viewer', standalone: true, imports: [CommonModule, FormsModule, AgGridAngular], template: `
    <div class="relative h-full min-h-0 flex flex-col bg-white dark:bg-slate-900"
         [class.excel-grid-focus]="gridFocusMode()"
         [attr.data-ag-theme-mode]="state.darkMode() ? 'dark' : 'light'">
      <div class="excel-toolbar min-h-11 shrink-0 flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
           [class.hidden]="gridFocusMode()">
        <button type="button" (click)="copySelection()"
                class="excel-tool-button shrink-0"
                [disabled]="!selection()"
                title="Sao chép vùng đã chọn (Ctrl+C)">
          <i class="fa-regular fa-copy"></i>
          <span class="hidden sm:inline">Sao chép</span>
        </button>

        <button type="button" (click)="fitSheetToContent()"
                class="excel-tool-button shrink-0"
                title="Tự dãn cột và hàng vừa khít nội dung">
          <i class="fa-solid fa-arrows-left-right-to-line"></i>
          <span class="hidden md:inline">Vừa nội dung</span>
        </button>

        <button type="button" (click)="toggleFilterPanel()"
                class="excel-tool-button shrink-0"
                [class.excel-tool-active]="activeTransformCount() > 0 || filterPanelOpen()"
                title="Lọc và sắp xếp các dòng dữ liệu">
          <i class="fa-solid fa-arrow-down-wide-short"></i>
          <span class="hidden sm:inline">Lọc & sắp xếp</span>
          @if (activeTransformCount() > 0) {
            <span class="min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] inline-flex items-center justify-center">
              {{ activeTransformCount() }}
            </span>
          }
        </button>

        <span class="hidden lg:inline-flex items-center h-7 px-2 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
          <i class="fa-solid fa-lock mr-1.5"></i>Chỉ đọc · không thay đổi tệp gốc
        </span>

        <button type="button" (click)="setGridFocusMode(true)"
                class="excel-tool-button shrink-0 ml-auto sm:ml-0"
                title="Mở rộng vùng thao tác sheet">
          <i class="fa-solid fa-expand"></i>
          <span class="hidden xl:inline">Mở rộng sheet</span>
        </button>

        <div class="relative flex-1 sm:flex-none sm:w-72 sm:ml-auto">
          <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input #sheetSearch type="search" [ngModel]="searchQuery()"
                 (ngModelChange)="onSearch($event)"
                 (keydown.enter)="onSearchEnter($event)"
                 placeholder="Tìm trong trang tính..."
                 class="w-full h-8 pl-8 pr-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 dark:text-white">
          @if (searchQuery()) {
            <span class="absolute right-16 top-1/2 -translate-y-1/2 text-[10px] font-bold tabular-nums text-slate-500 dark:text-slate-300">
              {{ searchPositionLabel() }}
            </span>
            <div class="absolute right-1 top-1/2 -translate-y-1/2 flex">
              <button type="button" (click)="goToSearchMatch(-1)" [disabled]="!searchMatches().length"
                      class="excel-search-button" aria-label="Kết quả trước" title="Kết quả trước (Shift+Enter)">
                <i class="fa-solid fa-chevron-up"></i>
              </button>
              <button type="button" (click)="goToSearchMatch(1)" [disabled]="!searchMatches().length"
                      class="excel-search-button" aria-label="Kết quả tiếp theo" title="Kết quả tiếp theo (Enter)">
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <button type="button" (click)="onSearch('')" class="excel-search-button"
                      aria-label="Xóa tìm kiếm" title="Xóa tìm kiếm">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          }
        </div>
      </div>

      @if (filterPanelOpen()) {
        <button type="button" class="absolute inset-0 z-40 bg-transparent cursor-default"
                (click)="filterPanelOpen.set(false)" aria-label="Đóng bảng lọc"></button>
        <section class="excel-filter-panel absolute z-50 top-12 left-2 right-2 sm:left-auto sm:right-3 sm:w-[430px]"
                 role="dialog" aria-label="Lọc và sắp xếp dữ liệu">
          <div class="flex items-start justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="text-sm font-black text-slate-800 dark:text-white">Lọc & sắp xếp</h3>
              <p class="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                Chỉ áp dụng cho các dòng dữ liệu, giữ nguyên tiêu đề và tệp gốc.
              </p>
            </div>
            <button type="button" (click)="filterPanelOpen.set(false)"
                    class="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Đóng"><i class="fa-solid fa-times"></i></button>
          </div>

          <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="sm:col-span-2 filter-field">
              <span>Cột dữ liệu</span>
              <select [ngModel]="filterColumn()" (ngModelChange)="filterColumn.set(+$event)">
                @for (option of filterColumnOptions(); track option.column) {
                  <option [ngValue]="option.column">{{ option.label }}</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>Điều kiện lọc</span>
              <select [ngModel]="filterOperator()" (ngModelChange)="filterOperator.set($event)">
                <option value="contains">Có chứa</option>
                <option value="equals">Bằng chính xác</option>
                <option value="notEmpty">Không trống</option>
              </select>
            </label>

            <label class="filter-field" [class.opacity-50]="filterOperator() === 'notEmpty'">
              <span>Giá trị</span>
              <input type="text" [ngModel]="filterValue()" (ngModelChange)="filterValue.set($event)"
                     [disabled]="filterOperator() === 'notEmpty'"
                     (keydown.enter)="applyFilterAndSort()"
                     placeholder="Nhập nội dung cần lọc">
            </label>

            <fieldset class="sm:col-span-2">
              <legend class="text-[10px] uppercase tracking-wide font-black text-slate-500 dark:text-slate-400 mb-1.5">
                Thứ tự
              </legend>
              <div class="grid grid-cols-3 gap-1.5">
                <button type="button" class="sort-choice" [class.sort-choice-active]="sortDirection() === 'none'"
                        (click)="sortDirection.set('none')">Mặc định</button>
                <button type="button" class="sort-choice" [class.sort-choice-active]="sortDirection() === 'asc'"
                        (click)="sortDirection.set('asc')">
                  <i class="fa-solid fa-arrow-up-a-z mr-1"></i>Tăng dần
                </button>
                <button type="button" class="sort-choice" [class.sort-choice-active]="sortDirection() === 'desc'"
                        (click)="sortDirection.set('desc')">
                  <i class="fa-solid fa-arrow-down-z-a mr-1"></i>Giảm dần
                </button>
              </div>
            </fieldset>
          </div>

          <div class="flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-700">
            <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {{ filteredRowsLabel() }}
            </span>
            <div class="flex gap-2">
              <button type="button" (click)="clearFilterAndSort()"
                      class="h-8 px-3 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800">
                Xóa lọc
              </button>
              <button type="button" (click)="applyFilterAndSort()"
                      class="h-8 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm">
                Áp dụng
              </button>
            </div>
          </div>
        </section>
      }

      <div class="excel-formula-bar h-9 shrink-0 grid grid-cols-[70px_minmax(0,1fr)] border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
           [class.hidden]="gridFocusMode()">
        <div class="flex items-center justify-center border-r border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 tabular-nums px-1">
          {{ selectedAddress() }}
        </div>
        <div class="min-w-0 flex items-center">
          <span class="w-8 h-full flex items-center justify-center text-xs italic font-serif text-slate-400 border-r border-slate-200 dark:border-slate-700">fx</span>
          <div class="min-w-0 flex-1 px-2.5 text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap overflow-x-auto scrollbar-none">
            {{ selectedFormula() || 'Chọn một ô để xem giá trị hoặc công thức' }}
          </div>
        </div>
      </div>

      <div class="flex-1 min-h-0 relative">
        @if (gridFocusMode()) {
          <button type="button" (click)="setGridFocusMode(false)"
                  class="excel-grid-focus-exit"
                  title="Hiện lại thanh công cụ và thanh công thức">
            <i class="fa-solid fa-compress"></i>
            <span>Hiện công cụ</span>
          </button>
        }
        @if (loading()) {
          <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-emerald-500"></i>
            <span class="mt-2 text-xs font-semibold text-slate-500">Đang đọc workbook...</span>
          </div>
        }
        <ag-grid-angular
          class="w-full h-full excel-preview-grid"
          [theme]="gridTheme"
          [rowData]="rowData()"
          [columnDefs]="columnDefs()"
          [defaultColDef]="defaultColDef"
          [headerHeight]="29"
          [animateRows]="false"
          [ensureDomOrder]="true"
          [enableCellTextSelection]="false"
          [suppressRowClickSelection]="true"
          [suppressContextMenu]="true"
          [suppressDragLeaveHidesColumns]="true"
          [suppressColumnMoveAnimation]="true"
          [getRowHeight]="getRowHeight"
          (gridReady)="onGridReady($event)"
          (cellFocused)="onCellFocused($event)"
          (cellMouseDown)="onCellMouseDown($event)"
          (cellMouseOver)="onCellMouseOver($event)"
          (cellKeyDown)="onCellKeyDown($event)"
          (columnHeaderClicked)="onColumnHeaderClicked($event)">
        </ag-grid-angular>
      </div>

      <div class="excel-sheet-tabs relative z-20 shrink-0 flex items-center bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-700">
        <div class="flex-1 min-w-0 h-full flex items-center overflow-x-auto overscroll-x-contain scrollbar-none px-1">
          @for (sheetName of sheetNames(); track sheetName) {
            <button type="button" (click)="selectSheet(sheetName)"
                    role="tab"
                    [attr.aria-selected]="activeSheet() === sheetName"
                    class="h-8 px-3 border-r border-slate-200 dark:border-slate-700 text-[11px] font-bold whitespace-nowrap transition-colors"
                    [class.bg-white]="activeSheet() === sheetName"
                    [class.dark:bg-slate-800]="activeSheet() === sheetName"
                    [class.text-emerald-700]="activeSheet() === sheetName"
                    [class.text-slate-500]="activeSheet() !== sheetName">
              {{ sheetName }}
            </button>
          }
        </div>
        <div class="h-full shrink-0 flex items-center gap-2 px-2.5 border-l border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          @if (copyStatus()) {
            <span class="text-emerald-700 dark:text-emerald-300">
              <i class="fa-solid fa-check mr-1"></i>{{ copyStatus() }}
            </span>
          } @else {
            <span class="hidden sm:inline tabular-nums">{{ selectionSummary() }}</span>
          }
          @if (truncated()) {
            <span class="text-amber-600 dark:text-amber-400" title="Bảng quá lớn nên bản xem trước đã được giới hạn">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i>Giới hạn xem
            </span>
          }
          <span class="tabular-nums">{{ dimensionsLabel() }}</span>
        </div>
      </div>
    </div>
  `, styles: ["\n    .excel-tool-button {\n      height: 2rem;\n      padding-inline: .65rem;\n      border-radius: .5rem;\n      border: 1px solid #cbd5e1;\n      color: #475569;\n      display: inline-flex;\n      align-items: center;\n      gap: .4rem;\n      font-size: .7rem;\n      font-weight: 800;\n    }\n    .excel-tool-button:hover:not(:disabled) { color: #047857; border-color: #6ee7b7; background: #ecfdf5; }\n    .excel-tool-button:disabled { opacity: .4; cursor: not-allowed; }\n    .excel-tool-active {\n      color: #047857;\n      border-color: #6ee7b7;\n      background: #ecfdf5;\n    }\n    .excel-filter-panel {\n      border-radius: .85rem;\n      border: 1px solid #cbd5e1;\n      background: #fff;\n      box-shadow: 0 18px 50px rgba(15, 23, 42, .22);\n      overflow: hidden;\n    }\n    .filter-field {\n      display: flex;\n      flex-direction: column;\n      gap: .35rem;\n    }\n    .filter-field > span {\n      font-size: .625rem;\n      line-height: 1rem;\n      text-transform: uppercase;\n      letter-spacing: .04em;\n      font-weight: 900;\n      color: #64748b;\n    }\n    .filter-field select,\n    .filter-field input {\n      width: 100%;\n      height: 2.25rem;\n      border: 1px solid #cbd5e1;\n      border-radius: .55rem;\n      padding-inline: .65rem;\n      background: #fff;\n      color: #334155;\n      font-size: .75rem;\n      outline: none;\n    }\n    .filter-field select:focus,\n    .filter-field input:focus {\n      border-color: #34d399;\n      box-shadow: 0 0 0 3px rgba(16, 185, 129, .13);\n    }\n    .sort-choice {\n      min-height: 2.25rem;\n      padding: .35rem .5rem;\n      border: 1px solid #cbd5e1;\n      border-radius: .55rem;\n      color: #64748b;\n      font-size: .68rem;\n      font-weight: 800;\n    }\n    .sort-choice:hover { border-color: #6ee7b7; color: #047857; }\n    .sort-choice-active {\n      border-color: #34d399;\n      color: #047857;\n      background: #ecfdf5;\n      box-shadow: inset 0 0 0 1px #34d399;\n    }\n    .excel-search-button {\n      width: 1.25rem;\n      height: 1.6rem;\n      color: #64748b;\n      border-radius: .25rem;\n      font-size: .58rem;\n    }\n    .excel-search-button:hover:not(:disabled) { color: #047857; background: #d1fae5; }\n    .excel-search-button:disabled { opacity: .35; }\n    .excel-grid-focus-exit {\n      position: absolute;\n      top: .4rem;\n      right: .55rem;\n      z-index: 30;\n      min-height: 2rem;\n      padding-inline: .65rem;\n      border-radius: .55rem;\n      border: 1px solid rgba(148, 163, 184, .75);\n      background: rgba(255, 255, 255, .92);\n      color: #475569;\n      box-shadow: 0 4px 14px rgba(15, 23, 42, .14);\n      backdrop-filter: blur(8px);\n      display: inline-flex;\n      align-items: center;\n      gap: .4rem;\n      font-size: .68rem;\n      font-weight: 800;\n    }\n    .excel-grid-focus-exit:hover { color: #047857; border-color: #6ee7b7; background: #ecfdf5; }\n    .excel-grid-focus .excel-sheet-tabs {\n      height: 2rem;\n      min-height: 2rem;\n    }\n    :host ::ng-deep .excel-preview-grid .ag-root-wrapper {\n      border: 0 !important;\n      border-radius: 0 !important;\n    }\n    :host ::ng-deep .excel-preview-grid .ag-header-cell {\n      font-size: 11px;\n      font-weight: 700;\n      justify-content: center;\n      border-right: 1px solid #dbe3ec;\n      user-select: none;\n      cursor: default;\n    }\n    :host ::ng-deep .excel-preview-grid .ag-header-cell.excel-selected-header {\n      background: #d1fae5 !important;\n      color: #047857 !important;\n      box-shadow: inset 0 -2px #10b981;\n    }\n    :host ::ng-deep .excel-preview-grid .ag-cell {\n      border-right: 1px solid #e2e8f0;\n      border-bottom: 1px solid #e2e8f0;\n      font-size: 12px;\n      padding-inline: 6px;\n      user-select: none;\n      cursor: cell;\n    }\n    :host ::ng-deep .excel-preview-grid .excel-row-number {\n      background: #f8fafc;\n      color: #64748b;\n      text-align: center;\n      font-variant-numeric: tabular-nums;\n      border-right: 1px solid #cbd5e1;\n      cursor: default;\n    }\n    :host ::ng-deep .excel-preview-grid .excel-selected-row-header {\n      background: #d1fae5 !important;\n      color: #047857 !important;\n      font-weight: 800;\n      box-shadow: inset -2px 0 #10b981;\n    }\n    :host ::ng-deep .excel-preview-grid .excel-selected-cell::after {\n      content: '';\n      position: absolute;\n      inset: 0;\n      z-index: 1;\n      pointer-events: none;\n      background: rgba(37, 99, 235, .16);\n    }\n    :host ::ng-deep .excel-preview-grid .excel-active-cell {\n      z-index: 3;\n      outline: 2px solid #16a34a !important;\n      outline-offset: -2px;\n    }\n    :host ::ng-deep .excel-preview-grid .excel-search-match {\n      box-shadow: inset 0 0 0 2px #facc15;\n      background-image: linear-gradient(rgba(254, 240, 138, .32), rgba(254, 240, 138, .32));\n    }\n    :host ::ng-deep .excel-preview-grid .excel-search-active {\n      box-shadow: inset 0 0 0 3px #f97316;\n      background-image: linear-gradient(rgba(253, 186, 116, .38), rgba(253, 186, 116, .38));\n      z-index: 2;\n    }\n    :host ::ng-deep .excel-preview-grid .ag-cell-focus {\n      border-color: #e2e8f0 !important;\n    }\n    :host ::ng-deep .excel-preview-grid .ag-cell-focus.excel-active-cell {\n      border-color: transparent !important;\n    }\n    :host-context(.dark) .excel-tool-button { color: #cbd5e1; border-color: #475569; }\n    :host-context(.dark) .excel-tool-active { color: #6ee7b7; border-color: #047857; background: rgba(6, 78, 59, .4); }\n    :host-context(.dark) .excel-filter-panel { background: #1e293b; border-color: #475569; }\n    :host-context(.dark) .excel-grid-focus-exit {\n      background: rgba(15, 23, 42, .92);\n      border-color: #475569;\n      color: #cbd5e1;\n    }\n    :host-context(.dark) .filter-field select,\n    :host-context(.dark) .filter-field input {\n      background: #0f172a;\n      border-color: #475569;\n      color: #e2e8f0;\n    }\n    :host-context(.dark) .sort-choice { border-color: #475569; color: #cbd5e1; }\n    :host-context(.dark) .sort-choice-active { color: #6ee7b7; border-color: #059669; background: rgba(6, 78, 59, .45); }\n    :host-context(.dark) ::ng-deep .excel-preview-grid .ag-header-cell,\n    :host-context(.dark) ::ng-deep .excel-preview-grid .ag-cell {\n      border-color: #334155;\n    }\n    :host-context(.dark) ::ng-deep .excel-preview-grid .excel-row-number {\n      background: #0f172a;\n      color: #94a3b8;\n      border-right-color: #475569;\n    }\n    :host-context(.dark) ::ng-deep .excel-preview-grid .excel-selected-cell::after {\n      background: rgba(59, 130, 246, .28);\n    }\n    @media (max-width: 640px) {\n      :host ::ng-deep .excel-preview-grid .ag-cell { font-size: 11px; padding-inline: 5px; }\n    }\n    .excel-sheet-tabs {\n      height: 2.25rem;\n      min-height: 2.25rem;\n    }\n    @media (max-width: 767px) {\n      .excel-sheet-tabs {\n        height: auto;\n        min-height: calc(2.25rem + env(safe-area-inset-bottom));\n        padding-bottom: env(safe-area-inset-bottom);\n      }\n    }\n  "] }]
    }], null, { blob: [{
            type: Input,
            args: [{ required: true }]
        }], fileName: [{
            type: Input
        }], ready: [{
            type: Output
        }], failed: [{
            type: Output
        }], onDocumentMouseUp: [{
            type: HostListener,
            args: ['document:mouseup']
        }], onDocumentCopy: [{
            type: HostListener,
            args: ['document:copy', ['$event']]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ExcelDocumentViewerComponent, { className: "ExcelDocumentViewerComponent", filePath: "src/app/features/documents/excel-document-viewer.component.ts", lineNumber: 524 }); })();
//# sourceMappingURL=excel-document-viewer.component.js.map