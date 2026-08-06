import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractSopEntry } from '../shared/abstract-sop-entry';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { copyRowToAll, navigateGrid } from '../shared/sop-grid-helper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = () => [];
const _c1 = a0 => ({ "bg-indigo-50/15 dark:bg-indigo-955/5 border-l-indigo-500/60": a0 });
const _forTrack0 = ($index, $item) => $item.key;
function Sop1767857760184EntryComponent_For_95_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 52);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const col_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.columnDisplayNames()[col_r1] || ctx_r1.getColumnLabel(col_r1), " ");
} }
function Sop1767857760184EntryComponent_For_102_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 63);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", row_r4.label, " ");
} }
function Sop1767857760184EntryComponent_For_102_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 64);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(row_r4.key);
} }
function Sop1767857760184EntryComponent_For_102_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 65)(1, "input", 70);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_For_102_For_9_Template_input_ngModelChange_1_listener($event) { const col_r7 = i0.ɵɵrestoreView(_r6).$implicit; const row_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key][col_r7], $event) || (ctx_r1.draft.resultData[row_r4.key][col_r7] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_For_102_For_9_Template_input_ngModelChange_1_listener() { i0.ɵɵrestoreView(_r6); const row_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCellChanged(row_r4.key)); })("keydown", function Sop1767857760184EntryComponent_For_102_For_9_Template_input_keydown_1_listener($event) { const ctx_r7 = i0.ɵɵrestoreView(_r6); const col_r7 = ctx_r7.$implicit; const ɵ$index_200_r9 = ctx_r7.$index; const ɵ$index_179_r5 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_179_r5, col_r7, ɵ$index_200_r9 + 2)); })("focus", function Sop1767857760184EntryComponent_For_102_For_9_Template_input_focus_1_listener($event) { i0.ɵɵrestoreView(_r6); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const col_r7 = ctx.$implicit;
    const ctx_r9 = i0.ɵɵnextContext();
    const row_r4 = ctx_r9.$implicit;
    const ɵ$index_179_r5 = ctx_r9.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key][col_r7]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_179_r5 + "-" + col_r7)("disabled", row_r4.key === "QC_FINAL" && col_r7 !== "kqDichlorvos")("readonly", ctx_r1.isReadOnly);
} }
function Sop1767857760184EntryComponent_For_102_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 57)(1, "td", 58)(2, "input", 59);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_For_102_Template_input_ngModelChange_2_listener($event) { const row_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key]["selected"], $event) || (ctx_r1.draft.resultData[row_r4.key]["selected"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_For_102_Template_input_ngModelChange_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(3, "td", 60)(4, "input", 61);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_For_102_Template_input_ngModelChange_4_listener($event) { const row_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key]["loSo"], $event) || (ctx_r1.draft.resultData[row_r4.key]["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_For_102_Template_input_ngModelChange_4_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function Sop1767857760184EntryComponent_For_102_Template_input_keydown_4_listener($event) { const ɵ$index_179_r5 = i0.ɵɵrestoreView(_r3).$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_179_r5, "loSo", 1)); })("focus", function Sop1767857760184EntryComponent_For_102_Template_input_focus_4_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "td", 62);
    i0.ɵɵtemplate(6, Sop1767857760184EntryComponent_For_102_Conditional_6_Template, 2, 1, "span", 63)(7, Sop1767857760184EntryComponent_For_102_Conditional_7_Template, 2, 1, "span", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(8, Sop1767857760184EntryComponent_For_102_For_9_Template, 2, 4, "td", 65, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementStart(10, "td", 65)(11, "input", 66);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_For_102_Template_input_ngModelChange_11_listener($event) { const row_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key]["ghiChu"], $event) || (ctx_r1.draft.resultData[row_r4.key]["ghiChu"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_For_102_Template_input_ngModelChange_11_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function Sop1767857760184EntryComponent_For_102_Template_input_keydown_11_listener($event) { const ɵ$index_179_r5 = i0.ɵɵrestoreView(_r3).$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_179_r5, "ghiChu", ctx_r1.activeColumns.length + 2)); })("focus", function Sop1767857760184EntryComponent_For_102_Template_input_focus_11_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "td", 67)(13, "button", 68);
    i0.ɵɵlistener("click", function Sop1767857760184EntryComponent_For_102_Template_button_click_13_listener() { const row_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyRowToAll(row_r4.key)); });
    i0.ɵɵelement(14, "i", 69);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const row_r4 = ctx.$implicit;
    const ɵ$index_179_r5 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("opacity-60", ctx_r1.draft.resultData[row_r4.key]["selected"] === false);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(14, _c1, row_r4.key.startsWith("QC_")));
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key]["selected"]);
    i0.ɵɵproperty("disabled", ctx_r1.isReadOnly);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key]["loSo"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_179_r5 + "-loSo")("disabled", row_r4.key === "QC_FINAL")("readonly", ctx_r1.isReadOnly);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(row_r4.key.startsWith("QC_") ? 6 : 7);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.activeColumns);
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key]["ghiChu"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_179_r5 + "-ghiChu")("readonly", ctx_r1.isReadOnly);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.isReadOnly);
} }
export class Sop1767857760184EntryComponent extends AbstractSopEntry {
    constructor() {
        super(...arguments);
        this.activeFilter = 'ALL';
        this.columnDisplayNames = signal({});
        this.activeColumns = [];
    }
    getStats() {
        const regularSamples = this.getVisibleRegularSamples();
        const totalCount = regularSamples.length;
        const selectedCount = regularSamples.filter((s) => this.draft.resultData[s]?.['selected'] !== false).length;
        // Fill progress
        let filledCount = 0;
        regularSamples.forEach((s) => {
            const row = this.draft.resultData[s];
            if (row && row['selected'] !== false) {
                filledCount++;
            }
        });
        const progressPct = selectedCount > 0 ? Math.round((filledCount / selectedCount) * 100) : 0;
        // R2 Linearity
        const r2Val = this.draft.page1Data['r2'] || '';
        const r2Float = parseFloat(r2Val);
        const r2Status = !isNaN(r2Float) ? (r2Float >= 0.995 ? 'VALID' : 'WARNING') : 'NOT_SET';
        // Spike Recovery
        const spikeVal = parseFloat(this.draft.resultData['QC_SPIKE']?.['kqDichlorvos'] || '');
        const spikeRecovery = !isNaN(spikeVal) ? Number(((spikeVal / 10.0) * 100).toFixed(1)) : null;
        const spikeQcStatus = spikeRecovery !== null ? (spikeRecovery >= 70 && spikeRecovery <= 120 ? 'PASS' : 'FAIL') : 'NONE';
        // Final Recovery
        const finalVal = parseFloat(this.draft.resultData['QC_FINAL']?.['kqDichlorvos'] || '');
        const finalRecovery = !isNaN(finalVal) ? Number(((finalVal / 10.0) * 100).toFixed(1)) : null;
        const finalQcStatus = finalRecovery !== null ? (finalRecovery >= 70 && finalRecovery <= 120 ? 'PASS' : 'FAIL') : 'NONE';
        return {
            totalCount,
            selectedCount,
            filledCount,
            progressPct,
            r2Val,
            r2Status,
            spikeRecovery,
            spikeQcStatus,
            finalRecovery,
            finalQcStatus
        };
    }
    async ngOnInit() {
        // Gọi OnInit của lớp cha để tải master targets và thiết lập cấu trúc cơ bản
        await super.ngOnInit();
        const cols = Object.keys(this.config.columns || {});
        this.activeColumns = cols.filter((c) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
        this.buildColumnDisplayNames();
        // Ensure blankName and spikeName are initialized
        if (this.draft.page1Data['blankName'] === undefined) {
            this.draft.page1Data['blankName'] = '';
        }
        if (this.draft.page1Data['spikeName'] === undefined) {
            this.draft.page1Data['spikeName'] = '';
        }
        // Ensure dichlorvosMethod is initialized
        if (!this.draft.page1Data['dichlorvosMethod']) {
            this.draft.page1Data['dichlorvosMethod'] = 'GC/MS';
            this.draft.page1Data['calibPoints'] = [
                { loSo: 'C0', vialNo: '51', hamLuong: '0' },
                { loSo: 'C1', vialNo: '52', hamLuong: '5' },
                { loSo: 'C2', vialNo: '53', hamLuong: '10' },
                { loSo: 'C3', vialNo: '54', hamLuong: '20' },
                { loSo: 'C4', vialNo: '55', hamLuong: '30' },
                { loSo: 'C5', vialNo: '56', hamLuong: '40' }
            ];
            this.bulkVialStart = 1;
        }
        else {
            // Set bulk start based on current method if not set
            if (this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS') {
                this.bulkVialStart = 9;
            }
            else {
                this.bulkVialStart = 1;
            }
        }
        // Auto fill defaults for existing samples if they are empty
        let hasChanges = false;
        this.getVisibleRegularSamples().forEach((sampleCode) => {
            if (!this.draft.resultData[sampleCode]) {
                const randW = (10.01 + Math.random() * 0.09).toFixed(2);
                this.draft.resultData[sampleCode] = {
                    loSo: '',
                    selected: true,
                    khoiLuong: randW,
                    heSoPhaLoang: '1'
                };
                hasChanges = true;
            }
            else {
                if (this.draft.resultData[sampleCode]['khoiLuong'] === undefined || this.draft.resultData[sampleCode]['khoiLuong'] === '') {
                    const randW = (10.01 + Math.random() * 0.09).toFixed(2);
                    this.draft.resultData[sampleCode]['khoiLuong'] = randW;
                    hasChanges = true;
                }
                if (this.draft.resultData[sampleCode]['heSoPhaLoang'] === undefined || this.draft.resultData[sampleCode]['heSoPhaLoang'] === '') {
                    this.draft.resultData[sampleCode]['heSoPhaLoang'] = '1';
                    hasChanges = true;
                }
            }
        });
        // Auto fill weight and dilution for QC_BLANK and QC_SPIKE
        const qcKeys = ['QC_BLANK', 'QC_SPIKE'];
        qcKeys.forEach((key) => {
            if (!this.draft.resultData[key]) {
                const randW = (10.01 + Math.random() * 0.09).toFixed(2);
                this.draft.resultData[key] = {
                    loSo: key === 'QC_BLANK' ? (this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS' ? '7' : '57') : (this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS' ? '8' : '58'),
                    kqDichlorvos: key === 'QC_BLANK' ? 'ND' : '',
                    ghiChu: '',
                    selected: true,
                    khoiLuong: randW,
                    heSoPhaLoang: '1'
                };
                hasChanges = true;
            }
            else {
                if (this.draft.resultData[key]['khoiLuong'] === undefined || this.draft.resultData[key]['khoiLuong'] === '') {
                    const randW = (10.01 + Math.random() * 0.09).toFixed(2);
                    this.draft.resultData[key]['khoiLuong'] = randW;
                    hasChanges = true;
                }
                if (this.draft.resultData[key]['heSoPhaLoang'] === undefined || this.draft.resultData[key]['heSoPhaLoang'] === '') {
                    this.draft.resultData[key]['heSoPhaLoang'] = '1';
                    hasChanges = true;
                }
            }
        });
        // Auto sync QC_FINAL from QC_SPIKE
        if (this.draft.page1Data['hasFinal'] && this.draft.resultData['QC_FINAL']) {
            const spike = this.draft.resultData['QC_SPIKE'];
            if (spike) {
                if (this.draft.resultData['QC_FINAL']['loSo'] !== spike['loSo'] ||
                    this.draft.resultData['QC_FINAL']['khoiLuong'] !== spike['khoiLuong'] ||
                    this.draft.resultData['QC_FINAL']['heSoPhaLoang'] !== spike['heSoPhaLoang']) {
                    this.draft.resultData['QC_FINAL']['loSo'] = spike['loSo'] || '';
                    this.draft.resultData['QC_FINAL']['khoiLuong'] = spike['khoiLuong'] || '';
                    this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = spike['heSoPhaLoang'] || '';
                    hasChanges = true;
                }
            }
        }
        if (hasChanges) {
            this.onDataChanged();
        }
        const method = this.draft.page1Data['dichlorvosMethod'] || 'GC/MS';
        const calPoints = this.draft.page1Data['calibPoints'];
        if (calPoints && calPoints.length > 0) {
            this.bulkCalibVialStart = parseInt(calPoints[0].vialNo || calPoints[0].loSo, 10) || (method === 'GC/MSMS' ? 1 : 51);
        }
        else {
            this.bulkCalibVialStart = method === 'GC/MSMS' ? 1 : 51;
        }
        this.onBulkCalibVialStartChange();
        this.syncSpreadsheetVialsFromCalibration();
        this.onBulkVialStartChange();
    }
    getVisibleRegularSamples() {
        return this.run.sampleList || [];
    }
    isAllSelected() {
        const visible = this.getVisibleRegularSamples();
        if (visible.length === 0)
            return false;
        return visible.every((s) => this.draft.resultData[s]?.['selected'] !== false);
    }
    toggleSelectAll(event) {
        const checked = event.target.checked;
        const visible = this.getVisibleRegularSamples();
        visible.forEach((s) => {
            if (!this.draft.resultData[s]) {
                this.draft.resultData[s] = {};
            }
            this.draft.resultData[s]['selected'] = checked;
        });
        this.onDataChanged();
    }
    setMethod(method) {
        if (this.draft.page1Data['dichlorvosMethod'] === method)
            return;
        this.draft.page1Data['dichlorvosMethod'] = method;
        // Switch default configurations
        if (method === 'GC/MS') {
            this.draft.page1Data['calibPoints'] = [
                { loSo: 'C0', vialNo: '51', hamLuong: '0' },
                { loSo: 'C1', vialNo: '52', hamLuong: '5' },
                { loSo: 'C2', vialNo: '53', hamLuong: '10' },
                { loSo: 'C3', vialNo: '54', hamLuong: '20' },
                { loSo: 'C4', vialNo: '55', hamLuong: '30' },
                { loSo: 'C5', vialNo: '56', hamLuong: '40' }
            ];
            this.bulkVialStart = 59;
            this.bulkCalibVialStart = 51;
            // Update vials for QC rows directly in resultData
            if (this.draft.resultData['QC_BLANK'])
                this.draft.resultData['QC_BLANK']['loSo'] = '57';
            if (this.draft.resultData['QC_SPIKE'])
                this.draft.resultData['QC_SPIKE']['loSo'] = '58';
            if (this.draft.resultData['QC_FINAL'])
                this.draft.resultData['QC_FINAL']['loSo'] = '58';
        }
        else {
            this.draft.page1Data['calibPoints'] = [
                { loSo: 'C0', vialNo: '1', hamLuong: '0' },
                { loSo: 'C1', vialNo: '2', hamLuong: '5' },
                { loSo: 'C2', vialNo: '3', hamLuong: '10' },
                { loSo: 'C3', vialNo: '4', hamLuong: '20' },
                { loSo: 'C4', vialNo: '5', hamLuong: '50' }
            ];
            this.bulkVialStart = 9;
            this.bulkCalibVialStart = 1;
            // Update vials for QC rows directly in resultData
            if (this.draft.resultData['QC_BLANK'])
                this.draft.resultData['QC_BLANK']['loSo'] = '7';
            if (this.draft.resultData['QC_SPIKE'])
                this.draft.resultData['QC_SPIKE']['loSo'] = '8';
            if (this.draft.resultData['QC_FINAL'])
                this.draft.resultData['QC_FINAL']['loSo'] = '8';
        }
        this.onBulkCalibVialStartChange();
        this.syncSpreadsheetVialsFromCalibration();
        this.onDataChanged();
    }
    onFinalToggled() {
        if (this.draft.page1Data['hasFinal']) {
            const spikeVial = this.draft.resultData['QC_SPIKE']?.['loSo'] || (this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS' ? '8' : '58');
            this.draft.resultData['QC_FINAL'] = {
                loSo: spikeVial,
                kqDichlorvos: '',
                ghiChu: '',
                selected: true
            };
        }
        else {
            delete this.draft.resultData['QC_FINAL'];
        }
        this.onDataChanged();
    }
    getColumnLabel(colKey) {
        if (colKey === 'khoiLuong')
            return 'Khối lượng (g)';
        if (colKey === 'heSoPhaLoang')
            return 'Hệ số pha loãng F';
        if (colKey === 'kqDichlorvos')
            return 'Dichlorvos (ng/g)';
        return this.formatColumnName(colKey);
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
            map[col] = this.getColumnLabel(col);
        }
        this.columnDisplayNames.set(map);
    }
    updateDichlorvosRecovery(key) {
        const row = this.draft.resultData[key];
        if (!row)
            return;
        const val = parseFloat(row['kqDichlorvos'] || '');
        if (!isNaN(val)) {
            const rec = ((val / 10.0) * 100).toFixed(1);
            row['ghiChu'] = `${rec}%`;
        }
        else {
            row['ghiChu'] = '';
        }
    }
    onCellChanged(key) {
        if (key === 'QC_SPIKE' || key === 'QC_FINAL') {
            this.updateDichlorvosRecovery(key);
        }
        this.onDataChanged();
    }
    onDataChanged() {
        // Sync FINAL vial, weight and dilution from SPIKE
        if (this.draft.resultData['QC_SPIKE'] && this.draft.resultData['QC_FINAL']) {
            this.draft.resultData['QC_FINAL']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || '';
            this.draft.resultData['QC_FINAL']['khoiLuong'] = this.draft.resultData['QC_SPIKE']['khoiLuong'] || '';
            this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] || '';
        }
        this.updateDichlorvosRecovery('QC_SPIKE');
        this.updateDichlorvosRecovery('QC_FINAL');
        this.draftChanged.emit(this.draft);
    }
    getDisplayRows() {
        const list = [];
        // Determine method and vials
        const isMSMS = this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS';
        const blankVial = isMSMS ? '7' : '57';
        const spikeVial = isMSMS ? '8' : '58';
        // Ensure QC_BLANK and QC_SPIKE exist
        if (!this.draft.resultData['QC_BLANK']) {
            const randW = (10.01 + Math.random() * 0.09).toFixed(2);
            this.draft.resultData['QC_BLANK'] = { loSo: blankVial, kqDichlorvos: 'ND', ghiChu: '', selected: true, khoiLuong: randW, heSoPhaLoang: '1' };
        }
        else {
            this.draft.resultData['QC_BLANK']['loSo'] = this.draft.resultData['QC_BLANK']['loSo'] || blankVial;
            if (this.draft.resultData['QC_BLANK']['khoiLuong'] === undefined || this.draft.resultData['QC_BLANK']['khoiLuong'] === '') {
                this.draft.resultData['QC_BLANK']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
            }
            this.draft.resultData['QC_BLANK']['heSoPhaLoang'] = this.draft.resultData['QC_BLANK']['heSoPhaLoang'] || '1';
        }
        if (!this.draft.resultData['QC_SPIKE']) {
            const randW = (10.01 + Math.random() * 0.09).toFixed(2);
            this.draft.resultData['QC_SPIKE'] = { loSo: spikeVial, kqDichlorvos: '', selected: true, ghiChu: '', khoiLuong: randW, heSoPhaLoang: '1' };
        }
        else {
            this.draft.resultData['QC_SPIKE']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || spikeVial;
            if (this.draft.resultData['QC_SPIKE']['khoiLuong'] === undefined || this.draft.resultData['QC_SPIKE']['khoiLuong'] === '') {
                this.draft.resultData['QC_SPIKE']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
            }
            this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] = this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] || '1';
        }
        list.push({
            key: 'QC_BLANK',
            type: 'QC_BLANK',
            label: this.draft.page1Data['blankName'] || 'Blank'
        });
        list.push({
            key: 'QC_SPIKE',
            type: 'QC_SPIKE',
            label: this.draft.page1Data['spikeName'] || 'Spike'
        });
        // Regular samples
        this.getVisibleRegularSamples().forEach((sampleCode) => {
            if (!this.draft.resultData[sampleCode]) {
                const randW = (10.01 + Math.random() * 0.09).toFixed(2);
                this.draft.resultData[sampleCode] = {
                    loSo: '',
                    selected: true,
                    khoiLuong: randW,
                    heSoPhaLoang: '1'
                };
                this.activeColumns.forEach((col) => {
                    if (col !== 'khoiLuong' && col !== 'heSoPhaLoang') {
                        this.draft.resultData[sampleCode][col] = '';
                    }
                });
            }
            else {
                if (this.draft.resultData[sampleCode]['khoiLuong'] === undefined || this.draft.resultData[sampleCode]['khoiLuong'] === '') {
                    const randW = (10.01 + Math.random() * 0.09).toFixed(2);
                    this.draft.resultData[sampleCode]['khoiLuong'] = randW;
                }
                if (this.draft.resultData[sampleCode]['heSoPhaLoang'] === undefined || this.draft.resultData[sampleCode]['heSoPhaLoang'] === '') {
                    this.draft.resultData[sampleCode]['heSoPhaLoang'] = '1';
                }
            }
            list.push({
                key: sampleCode,
                type: 'REGULAR',
                label: sampleCode
            });
        });
        // Optional FINAL QC
        if (this.draft.page1Data['hasFinal']) {
            const spike = this.draft.resultData['QC_SPIKE'];
            const finalVial = spike?.['loSo'] || spikeVial;
            const finalW = spike?.['khoiLuong'] || (10.01 + Math.random() * 0.09).toFixed(2);
            const finalF = spike?.['heSoPhaLoang'] || '1';
            if (!this.draft.resultData['QC_FINAL']) {
                this.draft.resultData['QC_FINAL'] = { loSo: finalVial, kqDichlorvos: '', ghiChu: '', selected: true, khoiLuong: finalW, heSoPhaLoang: finalF };
            }
            else {
                this.draft.resultData['QC_FINAL']['loSo'] = finalVial;
                this.draft.resultData['QC_FINAL']['khoiLuong'] = finalW;
                this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = finalF;
            }
            list.push({
                key: 'QC_FINAL',
                type: 'QC_FINAL',
                label: 'FINAL'
            });
        }
        return list;
    }
    bulkFillND() {
        const displayRows = this.getDisplayRows();
        displayRows.forEach((row) => {
            const rowData = this.draft.resultData[row.key];
            if (rowData && rowData['selected'] !== false) {
                if (!rowData['kqDichlorvos'] || rowData['kqDichlorvos']?.trim() === '') {
                    rowData['kqDichlorvos'] = 'ND';
                }
            }
        });
        this.onDataChanged();
    }
    bulkClearAll() {
        const displayRows = this.getDisplayRows();
        displayRows.forEach((row) => {
            const rowData = this.draft.resultData[row.key];
            if (rowData) {
                this.activeColumns.forEach((col) => {
                    rowData[col] = '';
                });
                rowData['ghiChu'] = '';
            }
        });
        this.onDataChanged();
    }
    copyRowToAll(sourceKey) {
        copyRowToAll(this.draft.resultData, this.run.sampleList, this.activeColumns, sourceKey);
        this.onDataChanged();
    }
    handleGridNavigation(event, rowIdx, colName, colIdx) {
        const columnsList = ['selected', 'loSo', ...this.activeColumns, 'ghiChu'];
        const rows = this.getDisplayRows();
        navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 1);
    }
    static { this.ɵfac = /*@__PURE__*/ (() => { let ɵSop1767857760184EntryComponent_BaseFactory; return function Sop1767857760184EntryComponent_Factory(__ngFactoryType__) { return (ɵSop1767857760184EntryComponent_BaseFactory || (ɵSop1767857760184EntryComponent_BaseFactory = i0.ɵɵgetInheritedFactory(Sop1767857760184EntryComponent)))(__ngFactoryType__ || Sop1767857760184EntryComponent); }; })(); }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Sop1767857760184EntryComponent, selectors: [["app-sop-1767857760184-entry"]], inputs: { activeFilter: "activeFilter" }, features: [i0.ɵɵInheritDefinitionFeature], decls: 103, vars: 78, consts: [[1, "space-y-6"], [3, "draftChanged", "title", "draft", "checkboxList", "isReadOnly"], ["sop-metadata-extra", "", 1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "pb-2", "mt-4"], [1, "block", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "mb-2", "uppercase", "tracking-widest"], [1, "flex", "gap-2"], ["type", "button", 1, "flex-1", "px-4", "py-2.5", "rounded-xl", "text-xs", "font-black", "border", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-1.5", "active:scale-95", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-microscope", "text-sm"], [1, "fa-solid", "fa-flask-vial", "text-sm"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4", "animate-fade-in"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-2.5"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-chart-line", "mr-2", "text-cyan-500", "text-sm"], [1, "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-850", "border", "border-slate-200/60", "dark:border-slate-800/80", "rounded-lg", "px-2.5", "py-1", "text-xs"], [1, "font-bold", "text-slate-550", "dark:text-slate-400"], ["type", "number", "placeholder", "B\u1EAFt \u0111\u1EA7u", 1, "w-14", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-cyan-500", "outline-none", "disabled:opacity-75", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-slate-400"], ["type", "number", "readonly", "", "placeholder", "K\u1EBFt th\u00FAc", 1, "w-14", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200/40", "dark:border-slate-700/40", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-455", "dark:text-slate-500", "font-bold", "outline-none", "cursor-not-allowed", 3, "ngModel"], [1, "px-2.5", "py-1", "bg-cyan-600", "hover:bg-cyan-700", "text-white", "rounded", "font-bold", "transition", "flex", "items-center", "gap-1", "active:scale-95", "shadow-sm", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-check"], [1, "grid", "grid-cols-1", "lg:grid-cols-12", "gap-6"], [1, "lg:col-span-4", "space-y-4"], [1, "block", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "mb-1.5", "uppercase", "tracking-widest"], ["type", "text", "placeholder", "BLANK", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "transition", "read-only:bg-slate-100/50", "dark:read-only:bg-slate-850/40", 3, "ngModelChange", "focus", "ngModel", "readonly"], ["type", "text", "placeholder", "SPIKE", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "transition", "read-only:bg-slate-100/50", "dark:read-only:bg-slate-850/40", 3, "ngModelChange", "focus", "ngModel", "readonly"], ["type", "text", "placeholder", "V\u00ED d\u1EE5: 0.9992...", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-extrabold", "text-indigo-655", "dark:text-indigo-400", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "transition", "read-only:bg-slate-100/50", "dark:read-only:bg-slate-850/40", 3, "ngModelChange", "focus", "ngModel", "readonly"], [1, "flex", "items-center", "gap-3", "p-3", "rounded-xl", "border", "border-slate-200/60", "dark:border-slate-800", "bg-slate-50/20", "dark:bg-slate-900/10", "select-none", "transition"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-cyan-600", "border-slate-350", "focus:ring-cyan-500", "focus:ring-2", "dark:bg-slate-800", "dark:border-slate-700", "disabled:opacity-75", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-xs", "font-bold", "text-slate-750", "dark:text-slate-250"], [1, "text-[10.5px]", "text-slate-400", "leading-relaxed", "font-medium"], [1, "fa-solid", "fa-circle-info", "text-cyan-500", "mr-1"], [1, "lg:col-span-8"], ["title", "C\u00E1c \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)", "pointPrefix", "Chu\u1EA9n C", 3, "pointsChanged", "calibPoints", "pointLabels", "isSuffixVisible", "isFuchsiaRing", "isReadOnly"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-3"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "flex", "items-center"], [1, "fa-solid", "fa-table-cells", "mr-2", "text-cyan-500", "text-sm"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mr-1"], ["title", "\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND", 1, "px-3", "py-1.5", "bg-slate-50", "dark:bg-slate-955", "hover:bg-amber-50", "dark:hover:bg-amber-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200/60", "dark:border-slate-800", "hover:border-amber-200", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-xs", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-pen-clip"], ["title", "X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng", 1, "px-3", "py-1.5", "bg-slate-50", "dark:bg-slate-955", "hover:bg-red-50", "dark:hover:bg-red-955/20", "text-slate-655", "dark:text-slate-455", "hover:text-red-655", "dark:hover:text-red-400", "border", "border-slate-200/60", "dark:border-slate-800", "hover:border-red-200", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-xs", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-trash-can"], [1, "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/60", "dark:border-slate-800/80", "rounded-lg", "px-2.5", "py-1", "text-xs"], ["type", "number", "placeholder", "B\u1EAFt \u0111\u1EA7u", 1, "w-14", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-cyan-500", "outline-none", "disabled:opacity-75", 3, "ngModelChange", "ngModel", "disabled"], ["type", "number", "placeholder", "K\u1EBFt th\u00FAc", 1, "w-14", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-cyan-500", "outline-none", "disabled:opacity-75", 3, "ngModelChange", "ngModel", "disabled"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/60", "dark:border-slate-800", "rounded-xl", "max-h-[500px]"], [1, "w-full", "text-sm", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-900", "border-b", "border-slate-200/60", "dark:border-slate-800", "sticky", "top-0", "z-20"], [1, "py-3", "px-3", "text-center", "w-12", "bg-slate-50", "dark:bg-slate-900"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-cyan-600", "border-slate-350", "focus:ring-cyan-500", "disabled:opacity-75", 3, "change", "checked", "disabled"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "w-28", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "min-w-[140px]", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "min-w-[130px]", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "min-w-[180px]", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "w-24", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800", "bg-white", "dark:bg-slate-900"], [1, "hover:bg-slate-50/40", "dark:hover:bg-slate-850/30", "transition-colors", "focus-within:bg-cyan-50/10", "dark:focus-within:bg-cyan-500/5", "border-l-4", "border-l-transparent", "focus-within:border-l-cyan-500", "transition-all", "duration-150", 3, "opacity-60", "ngClass"], [1, "hover:bg-slate-50/40", "dark:hover:bg-slate-850/30", "transition-colors", "focus-within:bg-cyan-50/10", "dark:focus-within:bg-cyan-500/5", "border-l-4", "border-l-transparent", "focus-within:border-l-cyan-500", "transition-all", "duration-150", 3, "ngClass"], [1, "py-2.5", "px-3", "text-center"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-cyan-600", "border-slate-350", "focus:ring-cyan-500", "disabled:opacity-75", 3, "ngModelChange", "ngModel", "disabled"], [1, "py-1.5", "px-2", "w-28"], ["type", "text", "placeholder", "Vial...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/60", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "text-center", "transition", "disabled:opacity-75", "disabled:cursor-not-allowed", "read-only:bg-slate-100/50", "dark:read-only:bg-slate-850/40", 3, "ngModelChange", "keydown", "focus", "ngModel", "id", "disabled", "readonly"], [1, "py-2.5", "px-4"], [1, "inline-flex", "items-center", "px-2.5", "py-0.5", "rounded-full", "text-[9px]", "font-black", "tracking-widest", "bg-indigo-100", "text-indigo-700", "dark:bg-indigo-955", "dark:text-indigo-400", "uppercase", "shadow-xs", "border", "border-indigo-200/30"], [1, "font-mono", "font-black", "text-xs", "text-slate-750", "dark:text-slate-300", "break-all", "select-all"], [1, "py-1.5", "px-2"], ["type", "text", "placeholder", "Ghi ch\u00FA...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/60", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-700", "dark:text-slate-355", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "transition", "read-only:bg-slate-100/50", "dark:read-only:bg-slate-850/40", 3, "ngModelChange", "keydown", "focus", "ngModel", "id", "readonly"], [1, "py-1.5", "px-4", "text-center"], ["title", "Sao ch\u00E9p k\u1EBFt qu\u1EA3 d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 d\u00F2ng kh\u00E1c", 1, "w-7", "h-7", "inline-flex", "items-center", "justify-center", "bg-cyan-50", "dark:bg-cyan-950/20", "text-cyan-600", "dark:text-cyan-400", "hover:bg-cyan-600", "hover:text-white", "rounded-lg", "text-xs", "font-black", "transition", "active:scale-95", "duration-100", "shadow-xs", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-copy"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/60", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "text-center", "transition", "disabled:opacity-75", "disabled:cursor-not-allowed", "read-only:bg-slate-100/50", "dark:read-only:bg-slate-850/40", 3, "ngModelChange", "keydown", "focus", "ngModel", "id", "disabled", "readonly"]], template: function Sop1767857760184EntryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "app-sop-header-metadata", 1);
            i0.ɵɵlistener("draftChanged", function Sop1767857760184EntryComponent_Template_app_sop_header_metadata_draftChanged_1_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementStart(2, "div", 2)(3, "div")(4, "label", 3);
            i0.ɵɵtext(5, "Thi\u1EBFt b\u1ECB ph\u00E2n t\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 4)(7, "button", 5);
            i0.ɵɵlistener("click", function Sop1767857760184EntryComponent_Template_button_click_7_listener() { return ctx.setMethod("GC/MS"); });
            i0.ɵɵelement(8, "i", 6);
            i0.ɵɵelementStart(9, "span");
            i0.ɵɵtext(10, "GC/MS");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "button", 5);
            i0.ɵɵlistener("click", function Sop1767857760184EntryComponent_Template_button_click_11_listener() { return ctx.setMethod("GC/MSMS"); });
            i0.ɵɵelement(12, "i", 7);
            i0.ɵɵelementStart(13, "span");
            i0.ɵɵtext(14, "GC/MS/MS");
            i0.ɵɵelementEnd()()()()()();
            i0.ɵɵelementStart(15, "div", 8)(16, "div", 9)(17, "h4", 10);
            i0.ɵɵelement(18, "i", 11);
            i0.ɵɵtext(19, " Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n & H\u1EC7 S\u1ED1 X\u00E1c \u0110\u1ECBnh (R\u00B2) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "div", 12)(21, "span", 13);
            i0.ɵɵtext(22, "Vial chu\u1EA9n:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "input", 14);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_23_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkCalibVialStart, $event) || (ctx.bulkCalibVialStart = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_23_listener() { return ctx.onBulkCalibVialStartChange(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "span", 15);
            i0.ɵɵtext(25, "-");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(26, "input", 16);
            i0.ɵɵelementStart(27, "button", 17);
            i0.ɵɵlistener("click", function Sop1767857760184EntryComponent_Template_button_click_27_listener() { return ctx.applyCalibVials(); });
            i0.ɵɵelement(28, "i", 18);
            i0.ɵɵelementStart(29, "span");
            i0.ɵɵtext(30, "\u00C1p D\u1EE5ng");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(31, "div", 19)(32, "div", 20)(33, "div")(34, "label", 21);
            i0.ɵɵtext(35, "T\u00EAn m\u1EABu tr\u1EAFng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "input", 22);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_36_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["blankName"], $event) || (ctx.draft.page1Data["blankName"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_36_listener() { return ctx.onDataChanged(); })("focus", function Sop1767857760184EntryComponent_Template_input_focus_36_listener($event) { return $event.target.select(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(37, "div")(38, "label", 21);
            i0.ɵɵtext(39, "T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "input", 23);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_40_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["spikeName"], $event) || (ctx.draft.page1Data["spikeName"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_40_listener() { return ctx.onDataChanged(); })("focus", function Sop1767857760184EntryComponent_Template_input_focus_40_listener($event) { return $event.target.select(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(41, "div")(42, "label", 21);
            i0.ɵɵtext(43, "H\u1EC7 s\u1ED1 x\u00E1c \u0111\u1ECBnh R\u00B2");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "input", 24);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_44_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["r2"], $event) || (ctx.draft.page1Data["r2"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_44_listener() { return ctx.onDataChanged(); })("focus", function Sop1767857760184EntryComponent_Template_input_focus_44_listener($event) { return $event.target.select(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "div")(46, "label", 21);
            i0.ɵɵtext(47, "M\u1EABu QC cu\u1ED1i m\u1EBB");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "label", 25)(49, "input", 26);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_49_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["hasFinal"], $event) || (ctx.draft.page1Data["hasFinal"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_49_listener() { return ctx.onFinalToggled(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "span", 27);
            i0.ɵɵtext(51, "Th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(52, "div", 28);
            i0.ɵɵelement(53, "i", 29);
            i0.ɵɵtext(54, " C\u00E1c gi\u00E1 tr\u1ECB c\u1EA5u h\u00ECnh n\u00E0y s\u1EBD \u0111\u01B0\u1EE3c t\u1EF1 \u0111\u1ED9ng \u0111i\u1EC1n v\u00E0o b\u00E1o c\u00E1o xu\u1EA5t b\u1EA3n. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(55, "div", 30)(56, "app-sop-calibration-points", 31);
            i0.ɵɵlistener("pointsChanged", function Sop1767857760184EntryComponent_Template_app_sop_calibration_points_pointsChanged_56_listener() { return ctx.onBulkCalibPointsChanged(); });
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(57, "div", 32)(58, "div", 33)(59, "h4", 34);
            i0.ɵɵelement(60, "i", 35);
            i0.ɵɵtext(61, " L\u01B0\u1EDBi Nh\u1EADp S\u1EAFc K\u00FD M\u1EABu Th\u1EED (Spreadsheet) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(62, "div", 36)(63, "span", 37);
            i0.ɵɵtext(64, "Thao t\u00E1c nhanh:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(65, "button", 38);
            i0.ɵɵlistener("click", function Sop1767857760184EntryComponent_Template_button_click_65_listener() { return ctx.bulkFillND(); });
            i0.ɵɵelement(66, "i", 39);
            i0.ɵɵelementStart(67, "span");
            i0.ɵɵtext(68, "\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(69, "button", 40);
            i0.ɵɵlistener("click", function Sop1767857760184EntryComponent_Template_button_click_69_listener() { return ctx.bulkClearAll(); });
            i0.ɵɵelement(70, "i", 41);
            i0.ɵɵelementStart(71, "span");
            i0.ɵɵtext(72, "X\u00F3a H\u1EBFt B\u1EA3ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(73, "div", 42)(74, "span", 13);
            i0.ɵɵtext(75, "L\u1ECD s\u1ED1:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(76, "input", 43);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_76_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkVialStart, $event) || (ctx.bulkVialStart = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_76_listener() { return ctx.onBulkVialStartChange(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(77, "span", 15);
            i0.ɵɵtext(78, "-");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(79, "input", 44);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop1767857760184EntryComponent_Template_input_ngModelChange_79_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkVialEnd, $event) || (ctx.bulkVialEnd = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(80, "button", 17);
            i0.ɵɵlistener("click", function Sop1767857760184EntryComponent_Template_button_click_80_listener() { return ctx.applyBulkVials(); });
            i0.ɵɵelement(81, "i", 18);
            i0.ɵɵelementStart(82, "span");
            i0.ɵɵtext(83, "\u00C1p D\u1EE5ng");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(84, "div", 45)(85, "table", 46)(86, "thead")(87, "tr", 47)(88, "th", 48)(89, "input", 49);
            i0.ɵɵlistener("change", function Sop1767857760184EntryComponent_Template_input_change_89_listener($event) { return ctx.toggleSelectAll($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(90, "th", 50);
            i0.ɵɵtext(91, "L\u1ECD s\u1ED1");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(92, "th", 51);
            i0.ɵɵtext(93, "M\u1EABu th\u1EED");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(94, Sop1767857760184EntryComponent_For_95_Template, 2, 1, "th", 52, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementStart(96, "th", 53);
            i0.ɵɵtext(97, "Ghi ch\u00FA");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(98, "th", 54);
            i0.ɵɵtext(99, "T\u00E1c v\u1EE5");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(100, "tbody", 55);
            i0.ɵɵrepeaterCreate(101, Sop1767857760184EntryComponent_For_102_Template, 15, 16, "tr", 56, _forTrack0);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", "Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: " + ((ctx.run == null ? null : ctx.run.sopCode) || "sop_1767857760184") + ")")("draft", ctx.draft)("checkboxList", i0.ɵɵpureFunction0(76, _c0))("isReadOnly", ctx.isReadOnly);
            i0.ɵɵadvance(6);
            i0.ɵɵclassProp("bg-cyan-600", ctx.draft.page1Data["dichlorvosMethod"] === "GC/MS")("text-white", ctx.draft.page1Data["dichlorvosMethod"] === "GC/MS")("border-cyan-600", ctx.draft.page1Data["dichlorvosMethod"] === "GC/MS")("bg-slate-50", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MS")("dark:bg-slate-955", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MS")("text-slate-700", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MS")("dark:text-slate-300", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MS")("border-slate-200", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MS")("dark:border-slate-800", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MS");
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("bg-cyan-600", ctx.draft.page1Data["dichlorvosMethod"] === "GC/MSMS")("text-white", ctx.draft.page1Data["dichlorvosMethod"] === "GC/MSMS")("border-cyan-600", ctx.draft.page1Data["dichlorvosMethod"] === "GC/MSMS")("bg-slate-50", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MSMS")("dark:bg-slate-955", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MSMS")("text-slate-700", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MSMS")("dark:text-slate-300", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MSMS")("border-slate-200", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MSMS")("dark:border-slate-800", ctx.draft.page1Data["dichlorvosMethod"] !== "GC/MSMS");
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(12);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkCalibVialStart);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngModel", ctx.bulkCalibVialEnd);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(9);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["blankName"]);
            i0.ɵɵproperty("readonly", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["spikeName"]);
            i0.ɵɵproperty("readonly", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["r2"]);
            i0.ɵɵproperty("readonly", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("cursor-pointer", !ctx.isReadOnly)("cursor-not-allowed", ctx.isReadOnly)("hover:bg-slate-50", !ctx.isReadOnly)("dark:hover:bg-slate-850", !ctx.isReadOnly);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["hasFinal"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("calibPoints", ctx.draft.page1Data["calibPoints"])("pointLabels", i0.ɵɵpureFunction0(77, _c0))("isSuffixVisible", false)("isFuchsiaRing", false)("isReadOnly", ctx.isReadOnly);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkVialStart);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkVialEnd);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("checked", ctx.isAllSelected())("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.activeColumns);
            i0.ɵɵadvance(7);
            i0.ɵɵrepeater(ctx.getDisplayRows());
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.CheckboxControlValueAccessor, i2.NgControlStatus, i2.NgModel, SopHeaderMetadataComponent, SopCalibrationPointsComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Sop1767857760184EntryComponent, [{
        type: Component,
        args: [{ selector: 'app-sop-1767857760184-entry', standalone: true, imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent], template: "<div class=\"space-y-6\">\r\n  <!-- 1. Metadata Form & Checkboxes -->\r\n  <app-sop-header-metadata\r\n    [title]=\"'Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: ' + (run?.sopCode || 'sop_1767857760184') + ')'\"\r\n    [draft]=\"draft\"\r\n    [checkboxList]=\"[]\"\r\n    [isReadOnly]=\"isReadOnly\"\r\n    (draftChanged)=\"onDataChanged()\">\r\n    \r\n    <!-- Method Toggle & FINAL option -->\r\n    <div sop-metadata-extra class=\"grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 mt-4\">\r\n      <div>\r\n        <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest\">Thi\u1EBFt b\u1ECB ph\u00E2n t\u00EDch</label>\r\n        <div class=\"flex gap-2\">\r\n          <button type=\"button\" \r\n                  (click)=\"setMethod('GC/MS')\" \r\n                  [disabled]=\"isReadOnly\"\r\n                  [class.bg-cyan-600]=\"draft.page1Data['dichlorvosMethod'] === 'GC/MS'\"\r\n                  [class.text-white]=\"draft.page1Data['dichlorvosMethod'] === 'GC/MS'\"\r\n                  [class.border-cyan-600]=\"draft.page1Data['dichlorvosMethod'] === 'GC/MS'\"\r\n                  [class.bg-slate-50]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MS'\"\r\n                  [class.dark:bg-slate-955]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MS'\"\r\n                  [class.text-slate-700]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MS'\"\r\n                  [class.dark:text-slate-300]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MS'\"\r\n                  [class.border-slate-200]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MS'\"\r\n                  [class.dark:border-slate-800]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MS'\"\r\n                  class=\"flex-1 px-4 py-2.5 rounded-xl text-xs font-black border transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50\">\r\n            <i class=\"fa-solid fa-microscope text-sm\"></i>\r\n            <span>GC/MS</span>\r\n          </button>\r\n          \r\n          <button type=\"button\" \r\n                  (click)=\"setMethod('GC/MSMS')\" \r\n                  [disabled]=\"isReadOnly\"\r\n                  [class.bg-cyan-600]=\"draft.page1Data['dichlorvosMethod'] === 'GC/MSMS'\"\r\n                  [class.text-white]=\"draft.page1Data['dichlorvosMethod'] === 'GC/MSMS'\"\r\n                  [class.border-cyan-600]=\"draft.page1Data['dichlorvosMethod'] === 'GC/MSMS'\"\r\n                  [class.bg-slate-50]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'\"\r\n                  [class.dark:bg-slate-955]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'\"\r\n                  [class.text-slate-700]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'\"\r\n                  [class.dark:text-slate-300]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'\"\r\n                  [class.border-slate-200]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'\"\r\n                  [class.dark:border-slate-800]=\"draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'\"\r\n                  class=\"flex-1 px-4 py-2.5 rounded-xl text-xs font-black border transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50\">\r\n            <i class=\"fa-solid fa-flask-vial text-sm\"></i>\r\n            <span>GC/MS/MS</span>\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </app-sop-header-metadata>\r\n\r\n  <!-- 1.5. Calibration curves configuration -->\r\n  <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in\">\r\n    <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2.5\">\r\n      <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center\">\r\n        <i class=\"fa-solid fa-chart-line mr-2 text-cyan-500 text-sm\"></i> Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n & H\u1EC7 S\u1ED1 X\u00E1c \u0110\u1ECBnh (R\u00B2)\r\n      </h4>\r\n      <!-- Quick Vial input for Calibration -->\r\n      <div class=\"flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs\">\r\n        <span class=\"font-bold text-slate-550 dark:text-slate-400\">Vial chu\u1EA9n:</span>\r\n        <input type=\"number\" \r\n               [(ngModel)]=\"bulkCalibVialStart\" \r\n               (ngModelChange)=\"onBulkCalibVialStartChange()\"\r\n               [disabled]=\"isReadOnly\"\r\n               placeholder=\"B\u1EAFt \u0111\u1EA7u\" \r\n               class=\"w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-cyan-500 outline-none disabled:opacity-75\">\r\n        <span class=\"text-slate-400\">-</span>\r\n        <input type=\"number\" \r\n               [ngModel]=\"bulkCalibVialEnd\" \r\n               readonly\r\n               placeholder=\"K\u1EBFt th\u00FAc\" \r\n               class=\"w-14 bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 rounded px-1.5 py-0.5 text-center text-slate-455 dark:text-slate-500 font-bold outline-none cursor-not-allowed\">\r\n        <button (click)=\"applyCalibVials()\" \r\n                [disabled]=\"isReadOnly\"\r\n                class=\"px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed\">\r\n          <i class=\"fa-solid fa-check\"></i>\r\n          <span>\u00C1p D\u1EE5ng</span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-6\">\r\n      <!-- Left Side: R^2, Blank Name, Spike Name -->\r\n      <div class=\"lg:col-span-4 space-y-4\">\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">T\u00EAn m\u1EABu tr\u1EAFng</label>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"draft.page1Data['blankName']\" \r\n                 (ngModelChange)=\"onDataChanged()\"\r\n                 [readonly]=\"isReadOnly\"\r\n                 (focus)=\"$any($event.target).select()\"\r\n                 placeholder=\"BLANK\"\r\n                 class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition read-only:bg-slate-100/50 dark:read-only:bg-slate-850/40\">\r\n        </div>\r\n        \r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n</label>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"draft.page1Data['spikeName']\" \r\n                 (ngModelChange)=\"onDataChanged()\"\r\n                 [readonly]=\"isReadOnly\"\r\n                 (focus)=\"$any($event.target).select()\"\r\n                 placeholder=\"SPIKE\"\r\n                 class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition read-only:bg-slate-100/50 dark:read-only:bg-slate-850/40\">\r\n        </div>\r\n\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">H\u1EC7 s\u1ED1 x\u00E1c \u0111\u1ECBnh R\u00B2</label>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"draft.page1Data['r2']\" \r\n                 (ngModelChange)=\"onDataChanged()\"\r\n                 [readonly]=\"isReadOnly\"\r\n                 (focus)=\"$any($event.target).select()\"\r\n                 placeholder=\"V\u00ED d\u1EE5: 0.9992...\"\r\n                 class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-extrabold text-indigo-655 dark:text-indigo-400 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition read-only:bg-slate-100/50 dark:read-only:bg-slate-850/40\">\r\n        </div>\r\n        \r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">M\u1EABu QC cu\u1ED1i m\u1EBB</label>\r\n          <label class=\"flex items-center gap-3 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 select-none transition\"\r\n                 [class.cursor-pointer]=\"!isReadOnly\"\r\n                 [class.cursor-not-allowed]=\"isReadOnly\"\r\n                 [class.hover:bg-slate-50]=\"!isReadOnly\"\r\n                 [class.dark:hover:bg-slate-850]=\"!isReadOnly\">\r\n            <input type=\"checkbox\" \r\n                   [(ngModel)]=\"draft.page1Data['hasFinal']\" \r\n                   (ngModelChange)=\"onFinalToggled()\"\r\n                   [disabled]=\"isReadOnly\"\r\n                   class=\"w-4 h-4 rounded text-cyan-600 border-slate-350 focus:ring-cyan-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700 disabled:opacity-75\">\r\n            <span class=\"text-xs font-bold text-slate-750 dark:text-slate-250\">Th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB</span>\r\n          </label>\r\n        </div>\r\n        \r\n        <div class=\"text-[10.5px] text-slate-400 leading-relaxed font-medium\">\r\n          <i class=\"fa-solid fa-circle-info text-cyan-500 mr-1\"></i> C\u00E1c gi\u00E1 tr\u1ECB c\u1EA5u h\u00ECnh n\u00E0y s\u1EBD \u0111\u01B0\u1EE3c t\u1EF1 \u0111\u1ED9ng \u0111i\u1EC1n v\u00E0o b\u00E1o c\u00E1o xu\u1EA5t b\u1EA3n.\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Calibration Points Grid -->\r\n      <div class=\"lg:col-span-8\">\r\n        <app-sop-calibration-points\r\n          title=\"C\u00E1c \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)\"\r\n          [calibPoints]=\"draft.page1Data['calibPoints']\"\r\n          [pointLabels]=\"[]\"\r\n          pointPrefix=\"Chu\u1EA9n C\"\r\n          [isSuffixVisible]=\"false\"\r\n          [isFuchsiaRing]=\"false\"\r\n          [isReadOnly]=\"isReadOnly\"\r\n          (pointsChanged)=\"onBulkCalibPointsChanged()\">\r\n        </app-sop-calibration-points>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->\r\n  <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4\">\r\n    <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3\">\r\n      <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 flex items-center\">\r\n        <i class=\"fa-solid fa-table-cells mr-2 text-cyan-500 text-sm\"></i> L\u01B0\u1EDBi Nh\u1EADp S\u1EAFc K\u00FD M\u1EABu Th\u1EED (Spreadsheet)\r\n      </h4>\r\n\r\n      <div class=\"flex flex-wrap items-center gap-2\">\r\n        <span class=\"text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1\">Thao t\u00E1c nhanh:</span>\r\n        \r\n        <button (click)=\"bulkFillND()\" \r\n                [disabled]=\"isReadOnly\"\r\n                class=\"px-3 py-1.5 bg-slate-50 dark:bg-slate-955 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-slate-800 hover:border-amber-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed\"\r\n                title=\"\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND\">\r\n          <i class=\"fa-solid fa-pen-clip\"></i>\r\n          <span>\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng</span>\r\n        </button>\r\n\r\n        <button (click)=\"bulkClearAll()\" \r\n                [disabled]=\"isReadOnly\"\r\n                class=\"px-3 py-1.5 bg-slate-50 dark:bg-slate-955 hover:bg-red-50 dark:hover:bg-red-955/20 text-slate-655 dark:text-slate-455 hover:text-red-655 dark:hover:text-red-400 border border-slate-200/60 dark:border-slate-800 hover:border-red-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed\"\r\n                title=\"X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng\">\r\n          <i class=\"fa-solid fa-trash-can\"></i>\r\n          <span>X\u00F3a H\u1EBFt B\u1EA3ng</span>\r\n        </button>\r\n\r\n        <!-- Quick Vial Input -->\r\n        <div class=\"flex items-center gap-1.5 bg-slate-50 dark:bg-slate-955 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs\">\r\n          <span class=\"font-bold text-slate-550 dark:text-slate-400\">L\u1ECD s\u1ED1:</span>\r\n          <input type=\"number\" \r\n                 [(ngModel)]=\"bulkVialStart\" \r\n                 (ngModelChange)=\"onBulkVialStartChange()\"\r\n                 [disabled]=\"isReadOnly\"\r\n                 placeholder=\"B\u1EAFt \u0111\u1EA7u\" \r\n                 class=\"w-14 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-cyan-500 outline-none disabled:opacity-75\">\r\n          <span class=\"text-slate-400\">-</span>\r\n          <input type=\"number\" \r\n                 [(ngModel)]=\"bulkVialEnd\" \r\n                 [disabled]=\"isReadOnly\"\r\n                 placeholder=\"K\u1EBFt th\u00FAc\" \r\n                 class=\"w-14 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-cyan-500 outline-none disabled:opacity-75\">\r\n          <button (click)=\"applyBulkVials()\" \r\n                  [disabled]=\"isReadOnly\"\r\n                  class=\"px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed\">\r\n            <i class=\"fa-solid fa-check\"></i>\r\n            <span>\u00C1p D\u1EE5ng</span>\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Spreadsheet Table Grid -->\r\n    <div class=\"overflow-x-auto custom-scrollbar border border-slate-200/60 dark:border-slate-800 rounded-xl max-h-[500px]\">\r\n      <table class=\"w-full text-sm border-collapse\">\r\n        <thead>\r\n          <tr class=\"bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 sticky top-0 z-20\">\r\n            <th class=\"py-3 px-3 text-center w-12 bg-slate-50 dark:bg-slate-900\">\r\n              <input type=\"checkbox\"\r\n                     [checked]=\"isAllSelected()\"\r\n                     (change)=\"toggleSelectAll($event)\"\r\n                     [disabled]=\"isReadOnly\"\r\n                     class=\"w-4 h-4 rounded text-cyan-600 border-slate-350 focus:ring-cyan-500 disabled:opacity-75\">\r\n            </th>\r\n            <th class=\"py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs w-28 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">L\u1ECD s\u1ED1</th>\r\n            <th class=\"py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs min-w-[140px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">M\u1EABu th\u1EED</th>\r\n            \r\n            @for (col of activeColumns; track col) {\r\n              <th class=\"py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs min-w-[130px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">\r\n                {{ columnDisplayNames()[col] || getColumnLabel(col) }}\r\n              </th>\r\n            }\r\n            \r\n            <th class=\"py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs min-w-[180px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">Ghi ch\u00FA</th>\r\n            <th class=\"py-3 px-4 text-center font-black text-slate-455 dark:text-slate-500 text-xs w-24 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">T\u00E1c v\u1EE5</th>\r\n          </tr>\r\n        </thead>\r\n        \r\n        <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900\">\r\n          @for (row of getDisplayRows(); track row.key; let rowIdx = $index) {\r\n            <tr class=\"hover:bg-slate-50/40 dark:hover:bg-slate-850/30 transition-colors focus-within:bg-cyan-50/10 dark:focus-within:bg-cyan-500/5 border-l-4 border-l-transparent focus-within:border-l-cyan-500 transition-all duration-150\" \r\n                [class.opacity-60]=\"draft.resultData[row.key]['selected'] === false\"\r\n                [ngClass]=\"{\r\n                  'bg-indigo-50/15 dark:bg-indigo-955/5 border-l-indigo-500/60': row.key.startsWith('QC_')\r\n                }\">\r\n              <td class=\"py-2.5 px-3 text-center\">\r\n                <input type=\"checkbox\"\r\n                       [(ngModel)]=\"draft.resultData[row.key]['selected']\"\r\n                       (ngModelChange)=\"onDataChanged()\"\r\n                       [disabled]=\"isReadOnly\"\r\n                       class=\"w-4 h-4 rounded text-cyan-600 border-slate-350 focus:ring-cyan-500 disabled:opacity-75\">\r\n              </td>\r\n              <td class=\"py-1.5 px-2 w-28\">\r\n                <input type=\"text\"\r\n                       [(ngModel)]=\"draft.resultData[row.key]['loSo']\"\r\n                       (ngModelChange)=\"onDataChanged()\"\r\n                       [id]=\"'cell-' + rowIdx + '-loSo'\"\r\n                       [disabled]=\"row.key === 'QC_FINAL'\"\r\n                       [readonly]=\"isReadOnly\"\r\n                       (keydown)=\"handleGridNavigation($event, rowIdx, 'loSo', 1)\"\r\n                       (focus)=\"$any($event.target).select()\"\r\n                       placeholder=\"Vial...\"\r\n                       class=\"w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-center transition disabled:opacity-75 disabled:cursor-not-allowed read-only:bg-slate-100/50 dark:read-only:bg-slate-850/40\">\r\n              </td>\r\n              <td class=\"py-2.5 px-4\">\r\n                @if (row.key.startsWith('QC_')) {\r\n                  <span class=\"inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-955 dark:text-indigo-400 uppercase shadow-xs border border-indigo-200/30\">\r\n                    {{ row.label }}\r\n                  </span>\r\n                } @else {\r\n                  <span class=\"font-mono font-black text-xs text-slate-750 dark:text-slate-300 break-all select-all\">{{ row.key }}</span>\r\n                }\r\n              </td>\r\n              \r\n              @for (col of activeColumns; track col; let colIdx = $index) {\r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData[row.key][col]\"\r\n                         (ngModelChange)=\"onCellChanged(row.key)\"\r\n                         [id]=\"'cell-' + rowIdx + '-' + col\"\r\n                         [disabled]=\"row.key === 'QC_FINAL' && col !== 'kqDichlorvos'\"\r\n                         [readonly]=\"isReadOnly\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, col, colIdx + 2)\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"...\"\r\n                         class=\"w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-center transition disabled:opacity-75 disabled:cursor-not-allowed read-only:bg-slate-100/50 dark:read-only:bg-slate-850/40\">\r\n                </td>\r\n              }\r\n              \r\n              <td class=\"py-1.5 px-2\">\r\n                <input type=\"text\"\r\n                       [(ngModel)]=\"draft.resultData[row.key]['ghiChu']\"\r\n                       (ngModelChange)=\"onDataChanged()\"\r\n                       [id]=\"'cell-' + rowIdx + '-ghiChu'\"\r\n                       [readonly]=\"isReadOnly\"\r\n                       (keydown)=\"handleGridNavigation($event, rowIdx, 'ghiChu', activeColumns.length + 2)\"\r\n                       (focus)=\"$any($event.target).select()\"\r\n                       placeholder=\"Ghi ch\u00FA...\"\r\n                       class=\"w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-355 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition read-only:bg-slate-100/50 dark:read-only:bg-slate-850/40\">\r\n              </td>\r\n              <td class=\"py-1.5 px-4 text-center\">\r\n                <button (click)=\"copyRowToAll(row.key)\" \r\n                        [disabled]=\"isReadOnly\"\r\n                        class=\"w-7 h-7 inline-flex items-center justify-center bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg text-xs font-black transition active:scale-95 duration-100 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed\"\r\n                        title=\"Sao ch\u00E9p k\u1EBFt qu\u1EA3 d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 d\u00F2ng kh\u00E1c\">\r\n                  <i class=\"fa-solid fa-copy\"></i>\r\n                </button>\r\n              </td>\r\n            </tr>\r\n          }\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n  </div>\r\n</div>\r\n" }]
    }], null, { activeFilter: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Sop1767857760184EntryComponent, { className: "Sop1767857760184EntryComponent", filePath: "src/app/features/results/sops/sop-1767857760184/sop-1767857760184-entry.component.ts", lineNumber: 15 }); })();
//# sourceMappingURL=sop-1767857760184-entry.component.js.map