import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName } from '../../shared/compound-id-resolver';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { copyRowToAll, navigateGrid } from '../shared/sop-grid-helper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = () => [];
const _c1 = () => ["0 ppb", "2 ppb", "5 ppb", "10 ppb", "20 ppb", "50 ppb"];
const _c2 = a0 => ({ "bg-indigo-50/15 dark:bg-indigo-955/5 border-l-indigo-500/60": a0 });
const _forTrack0 = ($index, $item) => $item.key;
function SopChloroformEntryComponent_For_90_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 44);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const col_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.columnDisplayNames()[col_r1] || ctx_r1.getColumnLabel(col_r1), " ");
} }
function SopChloroformEntryComponent_For_97_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 55);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", row_r4.label, " ");
} }
function SopChloroformEntryComponent_For_97_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 56);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(row_r4.key);
} }
function SopChloroformEntryComponent_For_97_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 57)(1, "input", 62);
    i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_For_97_For_9_Template_input_ngModelChange_1_listener($event) { const col_r7 = i0.ɵɵrestoreView(_r6).$implicit; const row_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key][col_r7], $event) || (ctx_r1.draft.resultData[row_r4.key][col_r7] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_For_97_For_9_Template_input_ngModelChange_1_listener() { i0.ɵɵrestoreView(_r6); const row_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCellChanged(row_r4.key)); })("keydown", function SopChloroformEntryComponent_For_97_For_9_Template_input_keydown_1_listener($event) { const ctx_r7 = i0.ɵɵrestoreView(_r6); const col_r7 = ctx_r7.$implicit; const ɵ$index_191_r9 = ctx_r7.$index; const ɵ$index_170_r5 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_170_r5, col_r7, ɵ$index_191_r9 + 2)); })("focus", function SopChloroformEntryComponent_For_97_For_9_Template_input_focus_1_listener($event) { i0.ɵɵrestoreView(_r6); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const col_r7 = ctx.$implicit;
    const ctx_r9 = i0.ɵɵnextContext();
    const row_r4 = ctx_r9.$implicit;
    const ɵ$index_170_r5 = ctx_r9.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key][col_r7]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_170_r5 + "-" + col_r7)("disabled", row_r4.key === "QC_FINAL" && col_r7 !== "kqChloroform");
} }
function SopChloroformEntryComponent_For_97_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 49)(1, "td", 50)(2, "input", 51);
    i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_For_97_Template_input_ngModelChange_2_listener($event) { const row_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key]["selected"], $event) || (ctx_r1.draft.resultData[row_r4.key]["selected"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_For_97_Template_input_ngModelChange_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(3, "td", 52)(4, "input", 53);
    i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_For_97_Template_input_ngModelChange_4_listener($event) { const row_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key]["loSo"], $event) || (ctx_r1.draft.resultData[row_r4.key]["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_For_97_Template_input_ngModelChange_4_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function SopChloroformEntryComponent_For_97_Template_input_keydown_4_listener($event) { const ɵ$index_170_r5 = i0.ɵɵrestoreView(_r3).$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_170_r5, "loSo", 1)); })("focus", function SopChloroformEntryComponent_For_97_Template_input_focus_4_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "td", 54);
    i0.ɵɵtemplate(6, SopChloroformEntryComponent_For_97_Conditional_6_Template, 2, 1, "span", 55)(7, SopChloroformEntryComponent_For_97_Conditional_7_Template, 2, 1, "span", 56);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(8, SopChloroformEntryComponent_For_97_For_9_Template, 2, 3, "td", 57, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementStart(10, "td", 57)(11, "input", 58);
    i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_For_97_Template_input_ngModelChange_11_listener($event) { const row_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r4.key]["ghiChu"], $event) || (ctx_r1.draft.resultData[row_r4.key]["ghiChu"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_For_97_Template_input_ngModelChange_11_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function SopChloroformEntryComponent_For_97_Template_input_keydown_11_listener($event) { const ɵ$index_170_r5 = i0.ɵɵrestoreView(_r3).$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_170_r5, "ghiChu", ctx_r1.activeColumns.length + 2)); })("focus", function SopChloroformEntryComponent_For_97_Template_input_focus_11_listener($event) { i0.ɵɵrestoreView(_r3); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "td", 59)(13, "button", 60);
    i0.ɵɵlistener("click", function SopChloroformEntryComponent_For_97_Template_button_click_13_listener() { const row_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyRowToAll(row_r4.key)); });
    i0.ɵɵelement(14, "i", 61);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const row_r4 = ctx.$implicit;
    const ɵ$index_170_r5 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("opacity-60", ctx_r1.draft.resultData[row_r4.key]["selected"] === false);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(10, _c2, row_r4.key.startsWith("QC_")));
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key]["selected"]);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key]["loSo"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_170_r5 + "-loSo")("disabled", row_r4.key === "QC_FINAL");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(row_r4.key.startsWith("QC_") ? 6 : 7);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.activeColumns);
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r4.key]["ghiChu"]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_170_r5 + "-ghiChu");
} }
export class SopChloroformEntryComponent {
    constructor() {
        this.isReadOnly = false;
        this.publishedSampleSet = null;
        this.activeFilter = 'ALL';
        this.draftChanged = new EventEmitter();
        this.masterTargetService = inject(MasterTargetService);
        this.masterTargets = signal([]);
        this.columnDisplayNames = signal({});
        this.activeColumns = [];
        this.bulkVialStart = 1;
        this.bulkVialEnd = 1;
        this.bulkCalibVialStart = 1;
        this.bulkCalibVialEnd = 6;
        this.bulkDefaultKhoiLuong = '5.00';
        this.bulkDefaultF = '1';
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
        this.activeColumns = cols.filter((c) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
        this.buildColumnDisplayNames();
        // Ensure blankName and spikeName are initialized
        if (this.draft.page1Data['blankName'] === undefined) {
            this.draft.page1Data['blankName'] = '';
        }
        if (this.draft.page1Data['spikeName'] === undefined) {
            this.draft.page1Data['spikeName'] = '';
        }
        // Initialize 6 calibration points for Chloroform
        const existingCalibPoints = this.draft.page1Data['calibPoints'];
        if (!existingCalibPoints || existingCalibPoints.length === 0) {
            this.draft.page1Data['calibPoints'] = [
                { loSo: 'C0', vialNo: '37', hamLuong: '0' },
                { loSo: 'C1', vialNo: '38', hamLuong: '2' },
                { loSo: 'C2', vialNo: '39', hamLuong: '5' },
                { loSo: 'C3', vialNo: '40', hamLuong: '10' },
                { loSo: 'C4', vialNo: '41', hamLuong: '20' },
                { loSo: 'C5', vialNo: '42', hamLuong: '50' }
            ];
        }
        else {
            // Migration dữ liệu cũ: loSo là số → chuyển sang vialNo, đặt tên điểm đúng
            existingCalibPoints.forEach((pt, idx) => {
                if (!pt.vialNo) {
                    if (/^\d+$/.test(String(pt.loSo || ''))) {
                        pt.vialNo = pt.loSo;
                    }
                }
                if (!pt.loSo || /^\d+$/.test(String(pt.loSo))) {
                    pt.loSo = `C${idx}`;
                }
                if (!pt.hamLuong) {
                    pt.hamLuong = ['0', '2', '5', '10', '20', '50'][idx] || '';
                }
            });
        }
        // Default R^2 if not set
        if (!this.draft.page1Data['r2']) {
            this.draft.page1Data['r2'] = '0.999';
        }
        // Auto fill default values for existing regular samples
        let hasChanges = false;
        this.getVisibleRegularSamples().forEach((sampleCode) => {
            if (!this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode] = {
                    loSo: '',
                    selected: true,
                    khoiLuong: '5.00',
                    heSoPhaLoang: '1'
                };
                hasChanges = true;
            }
            else {
                if (this.draft.resultData[sampleCode]['khoiLuong'] === undefined || this.draft.resultData[sampleCode]['khoiLuong'] === '') {
                    this.draft.resultData[sampleCode]['khoiLuong'] = '5.00';
                    hasChanges = true;
                }
                if (this.draft.resultData[sampleCode]['heSoPhaLoang'] === undefined || this.draft.resultData[sampleCode]['heSoPhaLoang'] === '') {
                    this.draft.resultData[sampleCode]['heSoPhaLoang'] = '1';
                    hasChanges = true;
                }
            }
        });
        // Auto fill QC Blank and QC Spike rows
        const blankVial = '7';
        const spikeVial = '8';
        if (!this.draft.resultData['QC_BLANK']) {
            this.draft.resultData['QC_BLANK'] = {
                loSo: blankVial,
                kqChloroform: 'ND',
                selected: true,
                khoiLuong: '5.00',
                heSoPhaLoang: '1',
                ghiChu: ''
            };
            hasChanges = true;
        }
        else {
            if (this.draft.resultData['QC_BLANK']['loSo'] === undefined || this.draft.resultData['QC_BLANK']['loSo'] === '') {
                this.draft.resultData['QC_BLANK']['loSo'] = blankVial;
                hasChanges = true;
            }
            if (this.draft.resultData['QC_BLANK']['khoiLuong'] === undefined || this.draft.resultData['QC_BLANK']['khoiLuong'] === '') {
                this.draft.resultData['QC_BLANK']['khoiLuong'] = '5.00';
                hasChanges = true;
            }
            if (this.draft.resultData['QC_BLANK']['heSoPhaLoang'] === undefined || this.draft.resultData['QC_BLANK']['heSoPhaLoang'] === '') {
                this.draft.resultData['QC_BLANK']['heSoPhaLoang'] = '1';
                hasChanges = true;
            }
        }
        if (!this.draft.resultData['QC_SPIKE']) {
            this.draft.resultData['QC_SPIKE'] = {
                loSo: spikeVial,
                kqChloroform: '',
                selected: true,
                khoiLuong: '5.00',
                heSoPhaLoang: '1',
                ghiChu: ''
            };
            hasChanges = true;
        }
        else {
            if (this.draft.resultData['QC_SPIKE']['loSo'] === undefined || this.draft.resultData['QC_SPIKE']['loSo'] === '') {
                this.draft.resultData['QC_SPIKE']['loSo'] = spikeVial;
                hasChanges = true;
            }
            if (this.draft.resultData['QC_SPIKE']['khoiLuong'] === undefined || this.draft.resultData['QC_SPIKE']['khoiLuong'] === '') {
                this.draft.resultData['QC_SPIKE']['khoiLuong'] = '5.00';
                hasChanges = true;
            }
            if (this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] === undefined || this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] === '') {
                this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] = '1';
                hasChanges = true;
            }
        }
        if (hasChanges) {
            this.onDataChanged();
        }
        // Khởi tạo bulkCalibVialStart từ vialNo của calibPoints tồn tại
        const existingCalib = this.draft.page1Data['calibPoints'];
        if (existingCalib && existingCalib.length > 0) {
            const firstVial = existingCalib[0]?.vialNo || existingCalib[0]?.loSo;
            this.bulkCalibVialStart = parseInt(String(firstVial), 10) || 1;
        }
        this.onBulkVialStartChange();
        this.onBulkCalibVialStartChange();
        this.syncSpreadsheetVialsFromCalibration();
        this.updateChloroformRecovery('QC_SPIKE');
        this.updateChloroformRecovery('QC_FINAL');
    }
    onBulkVialStartChange() {
        const start = parseInt(String(this.bulkVialStart), 10);
        if (!isNaN(start)) {
            const count = this.getVisibleRegularSamples().length;
            this.bulkVialEnd = start + Math.max(0, count - 1);
        }
    }
    onBulkCalibVialStartChange() {
        const start = parseInt(String(this.bulkCalibVialStart), 10);
        if (!isNaN(start)) {
            this.bulkCalibVialEnd = start + 5;
        }
    }
    applyCalibVials() {
        const start = parseInt(String(this.bulkCalibVialStart), 10);
        if (isNaN(start))
            return;
        const calibPoints = this.draft.page1Data['calibPoints'];
        if (calibPoints && calibPoints.length > 0) {
            calibPoints.forEach((pt, idx) => {
                pt['vialNo'] = String(start + idx); // Điền số vial, giữ nguyên tên điểm loSo
            });
            this.syncSpreadsheetVialsFromCalibration();
            this.onDataChanged();
        }
    }
    syncSpreadsheetVialsFromCalibration() {
        const calibPoints = this.draft.page1Data['calibPoints'];
        if (!calibPoints || calibPoints.length < 6)
            return;
        // Đọc số vial từ vialNo (đúng). Fallback loSo nếu là số (dữ liệu cũ)
        const lastPt = calibPoints[5];
        const lastVialStr = lastPt?.vialNo || ((/^\d+$/.test(String(lastPt?.loSo || ''))) ? lastPt?.loSo : undefined);
        const lastCalibVial = parseInt(String(lastVialStr), 10);
        if (isNaN(lastCalibVial))
            return;
        if (this.draft.resultData['QC_BLANK']) {
            this.draft.resultData['QC_BLANK']['loSo'] = String(lastCalibVial + 1);
        }
        if (this.draft.resultData['QC_SPIKE']) {
            this.draft.resultData['QC_SPIKE']['loSo'] = String(lastCalibVial + 2);
        }
        const regularSamples = this.getVisibleRegularSamples();
        regularSamples.forEach((sampleCode, idx) => {
            if (this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode]['loSo'] = String(lastCalibVial + 3 + idx);
            }
        });
        if (this.draft.resultData['QC_FINAL']) {
            this.draft.resultData['QC_FINAL']['loSo'] = String(lastCalibVial + 2);
        }
        this.bulkVialStart = lastCalibVial + 3;
        this.onBulkVialStartChange();
    }
    onCalibrationPointsChanged() {
        this.syncSpreadsheetVialsFromCalibration();
        this.onDataChanged();
    }
    updateChloroformRecovery(key) {
        const row = this.draft.resultData[key];
        if (!row)
            return;
        const val = parseFloat(row['kqChloroform'] || '');
        if (!isNaN(val)) {
            const loaiMau = this.draft.page1Data['loai_mau'] || this.run?.inputs?.['loai_mau'] || 'Thực phẩm';
            const spikeTheoretical = loaiMau === 'Nước sạch' ? 10.0 : 5.0;
            const rec = ((val / spikeTheoretical) * 100).toFixed(1);
            row['ghiChu'] = `${rec}%`;
        }
        else {
            row['ghiChu'] = '';
        }
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
    applyBulkVials() {
        const start = parseInt(String(this.bulkVialStart), 10);
        if (isNaN(start))
            return;
        const visible = this.getVisibleRegularSamples();
        visible.forEach((sample, idx) => {
            if (!this.draft.resultData[sample]) {
                this.draft.resultData[sample] = { selected: true };
            }
            this.draft.resultData[sample]['loSo'] = String(start + idx);
            if (!this.draft.resultData[sample]['khoiLuong']) {
                this.draft.resultData[sample]['khoiLuong'] = this.bulkDefaultKhoiLuong;
            }
            if (!this.draft.resultData[sample]['heSoPhaLoang']) {
                this.draft.resultData[sample]['heSoPhaLoang'] = this.bulkDefaultF;
            }
        });
        this.onBulkVialStartChange();
        this.onDataChanged();
    }
    applyBulkKhoiLuongF() {
        const visible = this.getVisibleRegularSamples();
        visible.forEach((sample) => {
            if (!this.draft.resultData[sample]) {
                this.draft.resultData[sample] = { selected: true };
            }
            this.draft.resultData[sample]['khoiLuong'] = this.bulkDefaultKhoiLuong;
            this.draft.resultData[sample]['heSoPhaLoang'] = this.bulkDefaultF;
        });
        // Áp dụng cho QC_BLANK và QC_SPIKE nếu chưa có
        if (this.draft.resultData['QC_BLANK']) {
            if (!this.draft.resultData['QC_BLANK']['khoiLuong'])
                this.draft.resultData['QC_BLANK']['khoiLuong'] = this.bulkDefaultKhoiLuong;
            if (!this.draft.resultData['QC_BLANK']['heSoPhaLoang'])
                this.draft.resultData['QC_BLANK']['heSoPhaLoang'] = this.bulkDefaultF;
        }
        if (this.draft.resultData['QC_SPIKE']) {
            if (!this.draft.resultData['QC_SPIKE']['khoiLuong'])
                this.draft.resultData['QC_SPIKE']['khoiLuong'] = this.bulkDefaultKhoiLuong;
            if (!this.draft.resultData['QC_SPIKE']['heSoPhaLoang'])
                this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] = this.bulkDefaultF;
        }
        this.onDataChanged();
    }
    getColumnLabel(colKey) {
        if (colKey === 'khoiLuong')
            return 'Khối lượng / Thể tích';
        if (colKey === 'heSoPhaLoang')
            return 'Hệ số pha loãng F';
        if (colKey === 'kqChloroform')
            return 'Chloroform (ppb)';
        return colKey;
    }
    getCompoundDisplayName(compound) {
        return resolveCompoundDisplayName(compound, this.masterTargets(), this.config?.id || this.run?.sopId);
    }
    buildColumnDisplayNames() {
        const map = {};
        for (const col of this.activeColumns) {
            map[col] = this.getColumnLabel(col);
        }
        this.columnDisplayNames.set(map);
    }
    onCellChanged(key) {
        if (key === 'QC_SPIKE' || key === 'QC_FINAL') {
            this.updateChloroformRecovery(key);
        }
        this.onDataChanged();
    }
    onFinalToggled() {
        if (this.draft.page1Data['hasFinal']) {
            const spike = this.draft.resultData['QC_SPIKE'];
            this.draft.resultData['QC_FINAL'] = {
                loSo: spike?.['loSo'] || '8',
                kqChloroform: '',
                ghiChu: '',
                selected: true,
                khoiLuong: spike?.['khoiLuong'] || '5.00',
                heSoPhaLoang: spike?.['heSoPhaLoang'] || '1'
            };
        }
        else {
            delete this.draft.resultData['QC_FINAL'];
        }
        this.onDataChanged();
    }
    onDataChanged() {
        if (this.isReadOnly)
            return;
        if (this.draft.resultData['QC_SPIKE'] && this.draft.resultData['QC_FINAL']) {
            this.draft.resultData['QC_FINAL']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || '';
            this.draft.resultData['QC_FINAL']['khoiLuong'] = this.draft.resultData['QC_SPIKE']['khoiLuong'] || '';
            this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] || '';
        }
        this.updateChloroformRecovery('QC_SPIKE');
        this.updateChloroformRecovery('QC_FINAL');
        this.draftChanged.emit(this.draft);
    }
    getDisplayRows() {
        const list = [];
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
        this.getVisibleRegularSamples().forEach((sampleCode) => {
            list.push({
                key: sampleCode,
                type: 'REGULAR',
                label: sampleCode
            });
        });
        if (this.draft.page1Data['hasFinal']) {
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
                if (!rowData['kqChloroform'] || rowData['kqChloroform']?.trim() === '') {
                    rowData['kqChloroform'] = 'ND';
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
    static { this.ɵfac = function SopChloroformEntryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SopChloroformEntryComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SopChloroformEntryComponent, selectors: [["app-sop-chloroform-entry"]], inputs: { run: "run", draft: "draft", config: "config", isReadOnly: "isReadOnly", publishedSampleSet: "publishedSampleSet", activeFilter: "activeFilter" }, outputs: { draftChanged: "draftChanged" }, decls: 98, vars: 21, consts: [[1, "space-y-6", "animate-fade-in", 3, "disabled"], [3, "draftChanged", "title", "draft", "checkboxList"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-2.5"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-chart-line", "mr-2", "text-cyan-500", "text-sm"], [1, "flex", "items-center", "gap-1.5", "bg-slate-50", "dark:bg-slate-850", "border", "border-slate-200/60", "dark:border-slate-800/80", "rounded-lg", "px-2.5", "py-1", "text-xs"], [1, "font-bold", "text-slate-550", "dark:text-slate-400"], ["type", "number", "placeholder", "B\u1EAFt \u0111\u1EA7u", 1, "w-14", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-cyan-500", "outline-none", 3, "ngModelChange", "ngModel"], [1, "text-slate-400"], ["type", "number", "readonly", "", "placeholder", "K\u1EBFt th\u00FAc", 1, "w-14", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200/40", "dark:border-slate-700/40", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-450", "dark:text-slate-500", "font-bold", "outline-none", "cursor-not-allowed", 3, "ngModel"], [1, "px-2.5", "py-1", "bg-cyan-600", "hover:bg-cyan-700", "text-white", "rounded", "font-bold", "transition", "flex", "items-center", "gap-1", "active:scale-95", "shadow-sm", 3, "click"], [1, "fa-solid", "fa-check"], [1, "grid", "grid-cols-1", "lg:grid-cols-12", "gap-6"], [1, "lg:col-span-4", "space-y-4"], [1, "block", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "mb-1.5", "uppercase", "tracking-widest"], ["type", "text", "placeholder", "BLANK", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "transition", "shadow-2xs", 3, "ngModelChange", "focus", "ngModel"], ["type", "text", "placeholder", "SPIKE", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "transition", "shadow-2xs", 3, "ngModelChange", "focus", "ngModel"], ["type", "text", "placeholder", "V\u00ED d\u1EE5: 0.999...", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2", "text-xs", "font-extrabold", "text-indigo-600", "dark:text-indigo-400", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "transition", "shadow-2xs", 3, "ngModelChange", "focus", "ngModel"], [1, "flex", "items-center", "gap-3", "p-3", "rounded-xl", "border", "border-slate-200/60", "dark:border-slate-800", "bg-slate-50/20", "dark:bg-slate-900/10", "cursor-pointer", "select-none", "transition", "hover:bg-slate-50", "dark:hover:bg-slate-850", "shadow-3xs"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-cyan-600", "border-slate-350", "focus:ring-cyan-500", "focus:ring-2", "dark:bg-slate-800", "dark:border-slate-700", 3, "ngModelChange", "ngModel"], [1, "text-xs", "font-bold", "text-slate-750", "dark:text-slate-255"], [1, "lg:col-span-8"], ["title", "C\u00E1c \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)", "pointPrefix", "Chu\u1EA9n C", 3, "pointsChanged", "calibPoints", "pointLabels", "isSuffixVisible", "isFuchsiaRing"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-3"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "flex", "items-center"], [1, "fa-solid", "fa-table-cells", "mr-2", "text-cyan-500", "text-sm"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mr-1"], ["title", "\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND", 1, "px-3", "py-1.5", "bg-slate-50", "dark:bg-slate-850", "hover:bg-amber-50", "dark:hover:bg-amber-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200/60", "dark:border-slate-800", "hover:border-amber-200", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-pen-clip"], ["title", "X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng", 1, "px-3", "py-1.5", "bg-slate-50", "dark:bg-slate-850", "hover:bg-red-50", "dark:hover:bg-red-955/20", "text-slate-655", "dark:text-slate-455", "hover:text-red-655", "dark:hover:text-red-400", "border", "border-slate-200/60", "dark:border-slate-800", "hover:border-red-200", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-trash-can"], [1, "font-bold", "text-slate-500", "dark:text-slate-400"], ["type", "text", "placeholder", "5.00", 1, "w-14", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-cyan-500", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "1", 1, "w-10", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded", "px-1.5", "py-0.5", "text-center", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-1", "focus:ring-cyan-500", "outline-none", 3, "ngModelChange", "ngModel"], ["title", "\u00C1p d\u1EE5ng kh\u1ED1i l\u01B0\u1EE3ng v\u00E0 h\u1EC7 s\u1ED1 pha lo\u00E3ng cho t\u1EA5t c\u1EA3 c\u00E1c m\u1EABu", 1, "px-2.5", "py-1", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded", "font-bold", "transition", "flex", "items-center", "gap-1", "active:scale-95", "shadow-sm", 3, "click"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/60", "dark:border-slate-800", "rounded-xl", "max-h-[500px]"], [1, "w-full", "text-sm", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-900", "border-b", "border-slate-200/60", "dark:border-slate-800", "sticky", "top-0", "z-20"], [1, "py-3", "px-3", "text-center", "w-12", "bg-slate-50", "dark:bg-slate-900"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-cyan-600", "border-slate-350", "focus:ring-cyan-500", 3, "change", "checked"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "w-28", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "min-w-[140px]", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "min-w-[130px]", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "min-w-[180px]", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-455", "dark:text-slate-500", "text-xs", "w-24", "bg-slate-50", "dark:bg-slate-900", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800", "bg-white", "dark:bg-slate-900"], [1, "hover:bg-slate-50/40", "dark:hover:bg-slate-850/30", "transition-colors", "focus-within:bg-cyan-50/10", "dark:focus-within:bg-cyan-500/5", "border-l-4", "border-l-transparent", "focus-within:border-l-cyan-500", "transition-all", "duration-150", 3, "opacity-60", "ngClass"], [1, "hover:bg-slate-50/40", "dark:hover:bg-slate-850/30", "transition-colors", "focus-within:bg-cyan-50/10", "dark:focus-within:bg-cyan-500/5", "border-l-4", "border-l-transparent", "focus-within:border-l-cyan-500", "transition-all", "duration-150", 3, "ngClass"], [1, "py-2.5", "px-3", "text-center"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-cyan-600", "border-slate-350", "focus:ring-cyan-500", 3, "ngModelChange", "ngModel"], [1, "py-1.5", "px-2", "w-28"], ["type", "text", "placeholder", "Vial...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/60", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "text-center", "transition", "disabled:opacity-75", "disabled:cursor-not-allowed", 3, "ngModelChange", "keydown", "focus", "ngModel", "id", "disabled"], [1, "py-2.5", "px-4"], [1, "inline-flex", "items-center", "px-2.5", "py-0.5", "rounded-full", "text-[9px]", "font-black", "tracking-widest", "bg-indigo-100", "text-indigo-700", "dark:bg-indigo-955", "dark:text-indigo-400", "uppercase", "shadow-xs", "border", "border-indigo-200/30"], [1, "font-mono", "font-black", "text-xs", "text-slate-750", "dark:text-slate-300", "break-all", "select-all"], [1, "py-1.5", "px-2"], ["type", "text", "placeholder", "Ghi ch\u00FA...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/60", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-750", "dark:text-slate-355", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "transition", 3, "ngModelChange", "keydown", "focus", "ngModel", "id"], [1, "py-1.5", "px-4", "text-center"], ["title", "Sao ch\u00E9p k\u1EBFt qu\u1EA3 d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 d\u00F2ng kh\u00E1c", 1, "w-7", "h-7", "inline-flex", "items-center", "justify-center", "bg-cyan-50", "dark:bg-cyan-950/20", "text-cyan-600", "dark:text-cyan-400", "hover:bg-cyan-600", "hover:text-white", "rounded-lg", "text-xs", "font-black", "transition", "active:scale-95", "duration-100", "shadow-xs", 3, "click"], [1, "fa-solid", "fa-copy"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200/80", "dark:border-slate-700/60", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-cyan-500/10", "focus:border-cyan-500", "outline-none", "text-center", "transition", "disabled:opacity-75", "disabled:cursor-not-allowed", "text-center", 3, "ngModelChange", "keydown", "focus", "ngModel", "id", "disabled"]], template: function SopChloroformEntryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "fieldset", 0)(1, "app-sop-header-metadata", 1);
            i0.ɵɵlistener("draftChanged", function SopChloroformEntryComponent_Template_app_sop_header_metadata_draftChanged_1_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "div", 2)(3, "div", 3)(4, "h4", 4);
            i0.ɵɵelement(5, "i", 5);
            i0.ɵɵtext(6, " Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n & H\u1EC7 S\u1ED1 X\u00E1c \u0110\u1ECBnh (R\u00B2) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 6)(8, "span", 7);
            i0.ɵɵtext(9, "Vial chu\u1EA9n:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "input", 8);
            i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_10_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkCalibVialStart, $event) || (ctx.bulkCalibVialStart = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_10_listener() { return ctx.onBulkCalibVialStartChange(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "span", 9);
            i0.ɵɵtext(12, "-");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(13, "input", 10);
            i0.ɵɵelementStart(14, "button", 11);
            i0.ɵɵlistener("click", function SopChloroformEntryComponent_Template_button_click_14_listener() { return ctx.applyCalibVials(); });
            i0.ɵɵelement(15, "i", 12);
            i0.ɵɵelementStart(16, "span");
            i0.ɵɵtext(17, "\u00C1p D\u1EE5ng");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(18, "div", 13)(19, "div", 14)(20, "div")(21, "label", 15);
            i0.ɵɵtext(22, "T\u00EAn m\u1EABu tr\u1EAFng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "input", 16);
            i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_23_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["blankName"], $event) || (ctx.draft.page1Data["blankName"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_23_listener() { return ctx.onDataChanged(); })("focus", function SopChloroformEntryComponent_Template_input_focus_23_listener($event) { return $event.target.select(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(24, "div")(25, "label", 15);
            i0.ɵɵtext(26, "T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "input", 17);
            i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_27_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["spikeName"], $event) || (ctx.draft.page1Data["spikeName"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_27_listener() { return ctx.onDataChanged(); })("focus", function SopChloroformEntryComponent_Template_input_focus_27_listener($event) { return $event.target.select(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(28, "div")(29, "label", 15);
            i0.ɵɵtext(30, "H\u1EC7 s\u1ED1 x\u00E1c \u0111\u1ECBnh R\u00B2");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "input", 18);
            i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_31_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["r2"], $event) || (ctx.draft.page1Data["r2"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_31_listener() { return ctx.onDataChanged(); })("focus", function SopChloroformEntryComponent_Template_input_focus_31_listener($event) { return $event.target.select(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(32, "div")(33, "label", 15);
            i0.ɵɵtext(34, "M\u1EABu QC cu\u1ED1i m\u1EBB");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "label", 19)(36, "input", 20);
            i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_36_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["hasFinal"], $event) || (ctx.draft.page1Data["hasFinal"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_36_listener() { return ctx.onFinalToggled(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "span", 21);
            i0.ɵɵtext(38, "Th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(39, "div", 22)(40, "app-sop-calibration-points", 23);
            i0.ɵɵlistener("pointsChanged", function SopChloroformEntryComponent_Template_app_sop_calibration_points_pointsChanged_40_listener() { return ctx.onCalibrationPointsChanged(); });
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(41, "div", 2)(42, "div", 24)(43, "h4", 25);
            i0.ɵɵelement(44, "i", 26);
            i0.ɵɵtext(45, " L\u01B0\u1EDBi Nh\u1EADp S\u1EAFc K\u00FD M\u1EABu Th\u1EED (Spreadsheet) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "div", 27)(47, "span", 28);
            i0.ɵɵtext(48, "Thao t\u00E1c nhanh:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "button", 29);
            i0.ɵɵlistener("click", function SopChloroformEntryComponent_Template_button_click_49_listener() { return ctx.bulkFillND(); });
            i0.ɵɵelement(50, "i", 30);
            i0.ɵɵelementStart(51, "span");
            i0.ɵɵtext(52, "\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(53, "button", 31);
            i0.ɵɵlistener("click", function SopChloroformEntryComponent_Template_button_click_53_listener() { return ctx.bulkClearAll(); });
            i0.ɵɵelement(54, "i", 32);
            i0.ɵɵelementStart(55, "span");
            i0.ɵɵtext(56, "X\u00F3a H\u1EBFt B\u1EA3ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(57, "div", 6)(58, "span", 33);
            i0.ɵɵtext(59, "L\u1ECD s\u1ED1:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(60, "input", 8);
            i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_60_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkVialStart, $event) || (ctx.bulkVialStart = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_60_listener() { return ctx.onBulkVialStartChange(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(61, "span", 9);
            i0.ɵɵtext(62, "-");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(63, "input", 10);
            i0.ɵɵelementStart(64, "button", 11);
            i0.ɵɵlistener("click", function SopChloroformEntryComponent_Template_button_click_64_listener() { return ctx.applyBulkVials(); });
            i0.ɵɵelement(65, "i", 12);
            i0.ɵɵelementStart(66, "span");
            i0.ɵɵtext(67, "\u00C1p D\u1EE5ng");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(68, "div", 6)(69, "span", 33);
            i0.ɵɵtext(70, "KL m\u1EB7c \u0111\u1ECBnh:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(71, "input", 34);
            i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_71_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkDefaultKhoiLuong, $event) || (ctx.bulkDefaultKhoiLuong = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(72, "span", 33);
            i0.ɵɵtext(73, "F:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "input", 35);
            i0.ɵɵtwoWayListener("ngModelChange", function SopChloroformEntryComponent_Template_input_ngModelChange_74_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkDefaultF, $event) || (ctx.bulkDefaultF = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(75, "button", 36);
            i0.ɵɵlistener("click", function SopChloroformEntryComponent_Template_button_click_75_listener() { return ctx.applyBulkKhoiLuongF(); });
            i0.ɵɵelement(76, "i", 12);
            i0.ɵɵelementStart(77, "span");
            i0.ɵɵtext(78, "\u00C1p KL+F");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(79, "div", 37)(80, "table", 38)(81, "thead")(82, "tr", 39)(83, "th", 40)(84, "input", 41);
            i0.ɵɵlistener("change", function SopChloroformEntryComponent_Template_input_change_84_listener($event) { return ctx.toggleSelectAll($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(85, "th", 42);
            i0.ɵɵtext(86, "L\u1ECD s\u1ED1");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(87, "th", 43);
            i0.ɵɵtext(88, "M\u1EABu th\u1EED");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(89, SopChloroformEntryComponent_For_90_Template, 2, 1, "th", 44, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementStart(91, "th", 45);
            i0.ɵɵtext(92, "Ghi ch\u00FA");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(93, "th", 46);
            i0.ɵɵtext(94, "T\u00E1c v\u1EE5");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(95, "tbody", 47);
            i0.ɵɵrepeaterCreate(96, SopChloroformEntryComponent_For_97_Template, 15, 12, "tr", 48, _forTrack0);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", "Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: " + ((ctx.run == null ? null : ctx.run.sopCode) || "9.20-chloroform") + ")")("draft", ctx.draft)("checkboxList", i0.ɵɵpureFunction0(19, _c0));
            i0.ɵɵadvance(9);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkCalibVialStart);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngModel", ctx.bulkCalibVialEnd);
            i0.ɵɵadvance(10);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["blankName"]);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["spikeName"]);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["r2"]);
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["hasFinal"]);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("calibPoints", ctx.draft.page1Data["calibPoints"])("pointLabels", i0.ɵɵpureFunction0(20, _c1))("isSuffixVisible", false)("isFuchsiaRing", false);
            i0.ɵɵadvance(20);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkVialStart);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngModel", ctx.bulkVialEnd);
            i0.ɵɵadvance(8);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkDefaultKhoiLuong);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkDefaultF);
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("checked", ctx.isAllSelected());
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.activeColumns);
            i0.ɵɵadvance(7);
            i0.ɵɵrepeater(ctx.getDisplayRows());
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.CheckboxControlValueAccessor, i2.NgControlStatus, i2.NgModel, SopHeaderMetadataComponent, SopCalibrationPointsComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SopChloroformEntryComponent, [{
        type: Component,
        args: [{ selector: 'app-sop-chloroform-entry', standalone: true, imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent], template: "<fieldset [disabled]=\"isReadOnly\" class=\"space-y-6 animate-fade-in\">\r\n  \r\n  <!-- 1. Metadata Form & Checkboxes -->\r\n  <app-sop-header-metadata\r\n    [title]=\"'Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP: ' + (run?.sopCode || '9.20-chloroform') + ')'\"\r\n    [draft]=\"draft\"\r\n    [checkboxList]=\"[]\"\r\n    (draftChanged)=\"onDataChanged()\">\r\n  </app-sop-header-metadata>\r\n  \r\n  <!-- 2. B\u1EA3ng \u0110\u01B0\u1EDDng chu\u1EA9n & R2 -->\r\n  <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4\">\r\n    <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2.5\">\r\n      <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center\">\r\n        <i class=\"fa-solid fa-chart-line mr-2 text-cyan-500 text-sm\"></i> Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n & H\u1EC7 S\u1ED1 X\u00E1c \u0110\u1ECBnh (R\u00B2)\r\n      </h4>\r\n      <!-- Quick Vial input for Calibration -->\r\n      <div class=\"flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs\">\r\n        <span class=\"font-bold text-slate-550 dark:text-slate-400\">Vial chu\u1EA9n:</span>\r\n        <input type=\"number\" \r\n               [(ngModel)]=\"bulkCalibVialStart\" \r\n               (ngModelChange)=\"onBulkCalibVialStartChange()\"\r\n               placeholder=\"B\u1EAFt \u0111\u1EA7u\" \r\n               class=\"w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-cyan-500 outline-none\">\r\n        <span class=\"text-slate-400\">-</span>\r\n        <input type=\"number\" \r\n               [ngModel]=\"bulkCalibVialEnd\" \r\n               readonly\r\n               placeholder=\"K\u1EBFt th\u00FAc\" \r\n               class=\"w-14 bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 rounded px-1.5 py-0.5 text-center text-slate-450 dark:text-slate-500 font-bold outline-none cursor-not-allowed\">\r\n        <button (click)=\"applyCalibVials()\" \r\n                class=\"px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm\">\r\n          <i class=\"fa-solid fa-check\"></i>\r\n          <span>\u00C1p D\u1EE5ng</span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-6\">\r\n      <!-- Left side settings -->\r\n      <div class=\"lg:col-span-4 space-y-4\">\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">T\u00EAn m\u1EABu tr\u1EAFng</label>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"draft.page1Data['blankName']\" \r\n                 (ngModelChange)=\"onDataChanged()\"\r\n                 (focus)=\"$any($event.target).select()\"\r\n                 placeholder=\"BLANK\"\r\n                 class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition shadow-2xs\">\r\n        </div>\r\n        \r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n</label>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"draft.page1Data['spikeName']\" \r\n                 (ngModelChange)=\"onDataChanged()\"\r\n                 (focus)=\"$any($event.target).select()\"\r\n                 placeholder=\"SPIKE\"\r\n                 class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition shadow-2xs\">\r\n        </div>\r\n\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">H\u1EC7 s\u1ED1 x\u00E1c \u0111\u1ECBnh R\u00B2</label>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"draft.page1Data['r2']\" \r\n                 (ngModelChange)=\"onDataChanged()\"\r\n                 (focus)=\"$any($event.target).select()\"\r\n                 placeholder=\"V\u00ED d\u1EE5: 0.999...\"\r\n                 class=\"w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition shadow-2xs\">\r\n        </div>\r\n\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest\">M\u1EABu QC cu\u1ED1i m\u1EBB</label>\r\n          <label class=\"flex items-center gap-3 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer select-none transition hover:bg-slate-50 dark:hover:bg-slate-850 shadow-3xs\">\r\n            <input type=\"checkbox\" \r\n                   [(ngModel)]=\"draft.page1Data['hasFinal']\" \r\n                   (ngModelChange)=\"onFinalToggled()\"\r\n                   class=\"w-4 h-4 rounded text-cyan-600 border-slate-350 focus:ring-cyan-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700\">\r\n            <span class=\"text-xs font-bold text-slate-750 dark:text-slate-255\">Th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB</span>\r\n          </label>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Right side: Calibration Points (6 points) -->\r\n      <div class=\"lg:col-span-8\">\r\n        <app-sop-calibration-points\r\n          title=\"C\u00E1c \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)\"\r\n          [calibPoints]=\"draft.page1Data['calibPoints']\"\r\n          [pointLabels]=\"['0 ppb', '2 ppb', '5 ppb', '10 ppb', '20 ppb', '50 ppb']\"\r\n          pointPrefix=\"Chu\u1EA9n C\"\r\n          [isSuffixVisible]=\"false\"\r\n          [isFuchsiaRing]=\"false\"\r\n          (pointsChanged)=\"onCalibrationPointsChanged()\">\r\n        </app-sop-calibration-points>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- 3. Grid Sample Spreadsheet & Bulk Actions -->\r\n  <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4\">\r\n    <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3\">\r\n      <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 flex items-center\">\r\n        <i class=\"fa-solid fa-table-cells mr-2 text-cyan-500 text-sm\"></i> L\u01B0\u1EDBi Nh\u1EADp S\u1EAFc K\u00FD M\u1EABu Th\u1EED (Spreadsheet)\r\n      </h4>\r\n\r\n      <div class=\"flex flex-wrap items-center gap-2\">\r\n        <span class=\"text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1\">Thao t\u00E1c nhanh:</span>\r\n        \r\n        <button (click)=\"bulkFillND()\" \r\n                class=\"px-3 py-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-slate-800 hover:border-amber-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\"\r\n                title=\"\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND\">\r\n          <i class=\"fa-solid fa-pen-clip\"></i>\r\n          <span>\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng</span>\r\n        </button>\r\n\r\n        <button (click)=\"bulkClearAll()\" \r\n                class=\"px-3 py-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-red-50 dark:hover:bg-red-955/20 text-slate-655 dark:text-slate-455 hover:text-red-655 dark:hover:text-red-400 border border-slate-200/60 dark:border-slate-800 hover:border-red-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\"\r\n                title=\"X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng\">\r\n          <i class=\"fa-solid fa-trash-can\"></i>\r\n          <span>X\u00F3a H\u1EBFt B\u1EA3ng</span>\r\n        </button>\r\n\r\n        <!-- Quick Vial Input -->\r\n        <div class=\"flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs\">\r\n          <span class=\"font-bold text-slate-500 dark:text-slate-400\">L\u1ECD s\u1ED1:</span>\r\n          <input type=\"number\" \r\n                 [(ngModel)]=\"bulkVialStart\" \r\n                 (ngModelChange)=\"onBulkVialStartChange()\"\r\n                 placeholder=\"B\u1EAFt \u0111\u1EA7u\" \r\n                 class=\"w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-cyan-500 outline-none\">\r\n          <span class=\"text-slate-400\">-</span>\r\n          <input type=\"number\" \r\n                 [ngModel]=\"bulkVialEnd\"\r\n                 readonly\r\n                 placeholder=\"K\u1EBFt th\u00FAc\" \r\n                 class=\"w-14 bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 rounded px-1.5 py-0.5 text-center text-slate-450 dark:text-slate-500 font-bold outline-none cursor-not-allowed\">\r\n          <button (click)=\"applyBulkVials()\" \r\n                  class=\"px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm\">\r\n            <i class=\"fa-solid fa-check\"></i>\r\n            <span>\u00C1p D\u1EE5ng</span>\r\n          </button>\r\n        </div>\r\n\r\n        <!-- Quick KL & F defaults -->\r\n        <div class=\"flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs\">\r\n          <span class=\"font-bold text-slate-500 dark:text-slate-400\">KL m\u1EB7c \u0111\u1ECBnh:</span>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"bulkDefaultKhoiLuong\"\r\n                 placeholder=\"5.00\" \r\n                 class=\"w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-cyan-500 outline-none\">\r\n          <span class=\"font-bold text-slate-500 dark:text-slate-400\">F:</span>\r\n          <input type=\"text\" \r\n                 [(ngModel)]=\"bulkDefaultF\"\r\n                 placeholder=\"1\" \r\n                 class=\"w-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-cyan-500 outline-none\">\r\n          <button (click)=\"applyBulkKhoiLuongF()\" \r\n                  class=\"px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm\"\r\n                  title=\"\u00C1p d\u1EE5ng kh\u1ED1i l\u01B0\u1EE3ng v\u00E0 h\u1EC7 s\u1ED1 pha lo\u00E3ng cho t\u1EA5t c\u1EA3 c\u00E1c m\u1EABu\">\r\n            <i class=\"fa-solid fa-check\"></i>\r\n            <span>\u00C1p KL+F</span>\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Spreadsheet Table Grid -->\r\n    <div class=\"overflow-x-auto custom-scrollbar border border-slate-200/60 dark:border-slate-800 rounded-xl max-h-[500px]\">\r\n      <table class=\"w-full text-sm border-collapse\">\r\n        <thead>\r\n          <tr class=\"bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 sticky top-0 z-20\">\r\n            <th class=\"py-3 px-3 text-center w-12 bg-slate-50 dark:bg-slate-900\">\r\n              <input type=\"checkbox\"\r\n                     [checked]=\"isAllSelected()\"\r\n                     (change)=\"toggleSelectAll($event)\"\r\n                     class=\"w-4 h-4 rounded text-cyan-600 border-slate-350 focus:ring-cyan-500\">\r\n            </th>\r\n            <th class=\"py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs w-28 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">L\u1ECD s\u1ED1</th>\r\n            <th class=\"py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs min-w-[140px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">M\u1EABu th\u1EED</th>\r\n            \r\n            @for (col of activeColumns; track col) {\r\n              <th class=\"py-3 px-4 text-center font-black text-slate-455 dark:text-slate-500 text-xs min-w-[130px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">\r\n                {{ columnDisplayNames()[col] || getColumnLabel(col) }}\r\n              </th>\r\n            }\r\n            \r\n            <th class=\"py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs min-w-[180px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">Ghi ch\u00FA</th>\r\n            <th class=\"py-3 px-4 text-center font-black text-slate-455 dark:text-slate-500 text-xs w-24 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider\">T\u00E1c v\u1EE5</th>\r\n          </tr>\r\n        </thead>\r\n        \r\n        <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900\">\r\n          @for (row of getDisplayRows(); track row.key; let rowIdx = $index) {\r\n            <tr class=\"hover:bg-slate-50/40 dark:hover:bg-slate-850/30 transition-colors focus-within:bg-cyan-50/10 dark:focus-within:bg-cyan-500/5 border-l-4 border-l-transparent focus-within:border-l-cyan-500 transition-all duration-150\" \r\n                [class.opacity-60]=\"draft.resultData[row.key]['selected'] === false\"\r\n                [ngClass]=\"{\r\n                  'bg-indigo-50/15 dark:bg-indigo-955/5 border-l-indigo-500/60': row.key.startsWith('QC_')\r\n                }\">\r\n              <td class=\"py-2.5 px-3 text-center\">\r\n                <input type=\"checkbox\"\r\n                       [(ngModel)]=\"draft.resultData[row.key]['selected']\"\r\n                       (ngModelChange)=\"onDataChanged()\"\r\n                       class=\"w-4 h-4 rounded text-cyan-600 border-slate-350 focus:ring-cyan-500\">\r\n              </td>\r\n              <td class=\"py-1.5 px-2 w-28\">\r\n                <input type=\"text\"\r\n                       [(ngModel)]=\"draft.resultData[row.key]['loSo']\"\r\n                       (ngModelChange)=\"onDataChanged()\"\r\n                       [id]=\"'cell-' + rowIdx + '-loSo'\"\r\n                       [disabled]=\"row.key === 'QC_FINAL'\"\r\n                       (keydown)=\"handleGridNavigation($event, rowIdx, 'loSo', 1)\"\r\n                       (focus)=\"$any($event.target).select()\"\r\n                       placeholder=\"Vial...\"\r\n                       class=\"w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-center transition disabled:opacity-75 disabled:cursor-not-allowed\">\r\n              </td>\r\n              <td class=\"py-2.5 px-4\">\r\n                @if (row.key.startsWith('QC_')) {\r\n                  <span class=\"inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-955 dark:text-indigo-400 uppercase shadow-xs border border-indigo-200/30\">\r\n                    {{ row.label }}\r\n                  </span>\r\n                } @else {\r\n                  <span class=\"font-mono font-black text-xs text-slate-750 dark:text-slate-300 break-all select-all\">{{ row.key }}</span>\r\n                }\r\n              </td>\r\n              \r\n              @for (col of activeColumns; track col; let colIdx = $index) {\r\n                <td class=\"py-1.5 px-2\">\r\n                  <input type=\"text\"\r\n                         [(ngModel)]=\"draft.resultData[row.key][col]\"\r\n                         (ngModelChange)=\"onCellChanged(row.key)\"\r\n                         [id]=\"'cell-' + rowIdx + '-' + col\"\r\n                         [disabled]=\"row.key === 'QC_FINAL' && col !== 'kqChloroform'\"\r\n                         (keydown)=\"handleGridNavigation($event, rowIdx, col, colIdx + 2)\"\r\n                         (focus)=\"$any($event.target).select()\"\r\n                         placeholder=\"...\"\r\n                         class=\"w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-center transition disabled:opacity-75 disabled:cursor-not-allowed text-center\">\r\n                </td>\r\n              }\r\n              \r\n              <td class=\"py-1.5 px-2\">\r\n                <input type=\"text\"\r\n                       [(ngModel)]=\"draft.resultData[row.key]['ghiChu']\"\r\n                       (ngModelChange)=\"onDataChanged()\"\r\n                       [id]=\"'cell-' + rowIdx + '-ghiChu'\"\r\n                       (keydown)=\"handleGridNavigation($event, rowIdx, 'ghiChu', activeColumns.length + 2)\"\r\n                       (focus)=\"$any($event.target).select()\"\r\n                       placeholder=\"Ghi ch\u00FA...\"\r\n                       class=\"w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-750 dark:text-slate-355 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition\">\r\n              </td>\r\n              <td class=\"py-1.5 px-4 text-center\">\r\n                <button (click)=\"copyRowToAll(row.key)\" \r\n                        class=\"w-7 h-7 inline-flex items-center justify-center bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg text-xs font-black transition active:scale-95 duration-100 shadow-xs\"\r\n                        title=\"Sao ch\u00E9p k\u1EBFt qu\u1EA3 d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 d\u00F2ng kh\u00E1c\">\r\n                  <i class=\"fa-solid fa-copy\"></i>\r\n                </button>\r\n              </td>\r\n            </tr>\r\n          }\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n  </div>\r\n</fieldset>\r\n" }]
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
        }], activeFilter: [{
            type: Input
        }], draftChanged: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SopChloroformEntryComponent, { className: "SopChloroformEntryComponent", filePath: "src/app/features/results/sops/sop-chloroform/sop-chloroform-entry.component.ts", lineNumber: 17 }); })();
//# sourceMappingURL=sop-chloroform-entry.component.js.map