import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { calculateSop01Recovery } from './sop-01-engine';
import { MasterTargetService } from '../../../targets/master-target.service';
import { getAssignedTargetsForSample, resolveCompoundDisplayName, SOP01_COLUMN_TO_CANONICAL, getSop01DisplayName } from '../../shared/compound-id-resolver';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { navigateGrid } from '../shared/sop-grid-helper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = () => ["0 ppb", "5 ppb", "10 ppb", "20 ppb", "50 ppb"];
const _forTrack0 = ($index, $item) => $item.key;
function Sop01EntryComponent_Conditional_67_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 31)(1, "label", 28);
    i0.ɵɵtext(2, "T\u00EAn m\u1EABu ki\u1EC3m tra");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 62);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Conditional_67_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.page1Data["checkSampleName"], $event) || (ctx_r1.draft.page1Data["checkSampleName"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Conditional_67_Template_input_ngModelChange_3_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.page1Data["checkSampleName"]);
    i0.ɵɵproperty("disabled", ctx_r1.isReadOnly);
} }
function Sop01EntryComponent_For_116_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 59);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const col_r3 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.columnDisplayNames()[col_r3] || col_r3, " (\u00B5g/kg) ");
} }
function Sop01EntryComponent_For_121_Conditional_0_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "input", 75);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_For_121_Conditional_0_Conditional_2_Template_input_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r5); const row_r6 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r6.key]["selected"], $event) || (ctx_r1.draft.resultData[row_r6.key]["selected"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_For_121_Conditional_0_Conditional_2_Template_input_ngModelChange_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onDataChanged()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r6 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r6.key]["selected"]);
    i0.ɵɵproperty("disabled", ctx_r1.isReadOnly);
} }
function Sop01EntryComponent_For_121_Conditional_0_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "input", 66);
} }
function Sop01EntryComponent_For_121_Conditional_0_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 70);
    i0.ɵɵelement(1, "i", 76);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r6 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", row_r6.label, " ");
} }
function Sop01EntryComponent_For_121_Conditional_0_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r6 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(row_r6.label);
} }
function Sop01EntryComponent_For_121_Conditional_0_For_10_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 71)(1, "input", 77);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_For_121_Conditional_0_For_10_Template_input_ngModelChange_1_listener($event) { const col_r9 = i0.ɵɵrestoreView(_r8).$implicit; const row_r6 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r6.key][col_r9], $event) || (ctx_r1.draft.resultData[row_r6.key][col_r9] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_For_121_Conditional_0_For_10_Template_input_ngModelChange_1_listener() { i0.ɵɵrestoreView(_r8); const row_r6 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCellChanged(row_r6.key)); })("keydown", function Sop01EntryComponent_For_121_Conditional_0_For_10_Template_input_keydown_1_listener($event) { const ctx_r9 = i0.ɵɵrestoreView(_r8); const col_r9 = ctx_r9.$implicit; const ɵ$index_248_r11 = ctx_r9.$index; const ɵ$index_220_r7 = i0.ɵɵnextContext(2).$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_220_r7, col_r9, ɵ$index_248_r11 + 1)); })("focus", function Sop01EntryComponent_For_121_Conditional_0_For_10_Template_input_focus_1_listener($event) { i0.ɵɵrestoreView(_r8); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const col_r9 = ctx.$implicit;
    const ctx_r11 = i0.ɵɵnextContext(2);
    const row_r6 = ctx_r11.$implicit;
    const ɵ$index_220_r7 = ctx_r11.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r6.key][col_r9]);
    i0.ɵɵproperty("id", "cell-" + ɵ$index_220_r7 + "-" + col_r9)("disabled", ctx_r1.isReadOnly || !ctx_r1.isTargetAssigned(row_r6.key, col_r9));
} }
function Sop01EntryComponent_For_121_Conditional_0_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 73);
    i0.ɵɵtext(1, " QC Active ");
    i0.ɵɵelementEnd();
} }
function Sop01EntryComponent_For_121_Conditional_0_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 78);
    i0.ɵɵlistener("click", function Sop01EntryComponent_For_121_Conditional_0_Conditional_13_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const row_r6 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyRowToAll(row_r6.key)); });
    i0.ɵɵelement(1, "i", 79);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r1.isReadOnly);
} }
function Sop01EntryComponent_For_121_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td", 64);
    i0.ɵɵtemplate(2, Sop01EntryComponent_For_121_Conditional_0_Conditional_2_Template, 1, 2, "input", 65)(3, Sop01EntryComponent_For_121_Conditional_0_Conditional_3_Template, 1, 0, "input", 66);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "td", 67)(5, "input", 68);
    i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_For_121_Conditional_0_Template_input_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r4); const row_r6 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.draft.resultData[row_r6.key]["loSo"], $event) || (ctx_r1.draft.resultData[row_r6.key]["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_For_121_Conditional_0_Template_input_ngModelChange_5_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDataChanged()); })("keydown", function Sop01EntryComponent_For_121_Conditional_0_Template_input_keydown_5_listener($event) { i0.ɵɵrestoreView(_r4); const ɵ$index_220_r7 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGridNavigation($event, ɵ$index_220_r7, "loSo", 0)); })("focus", function Sop01EntryComponent_For_121_Conditional_0_Template_input_focus_5_listener($event) { i0.ɵɵrestoreView(_r4); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "td", 69);
    i0.ɵɵtemplate(7, Sop01EntryComponent_For_121_Conditional_0_Conditional_7_Template, 3, 1, "span", 70)(8, Sop01EntryComponent_For_121_Conditional_0_Conditional_8_Template, 2, 1, "span");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(9, Sop01EntryComponent_For_121_Conditional_0_For_10_Template, 2, 3, "td", 71, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementStart(11, "td", 72);
    i0.ɵɵtemplate(12, Sop01EntryComponent_For_121_Conditional_0_Conditional_12_Template, 2, 0, "span", 73)(13, Sop01EntryComponent_For_121_Conditional_0_Conditional_13_Template, 2, 1, "button", 74);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r11 = i0.ɵɵnextContext();
    const row_r6 = ctx_r11.$implicit;
    const ɵ$index_220_r7 = ctx_r11.$index;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(row_r6.isQC ? "bg-amber-50/15 dark:bg-amber-955/5 border-l-4 border-l-amber-500/80 hover:bg-amber-50/25 dark:hover:bg-amber-955/10 transition-colors" : "hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 duration-150 " + (ctx_r1.draft.resultData[row_r6.key]["selected"] === false ? "opacity-60" : ""));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!row_r6.isQC ? 2 : 3);
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft.resultData[row_r6.key]["loSo"]);
    i0.ɵɵproperty("disabled", ctx_r1.isReadOnly)("id", "cell-" + ɵ$index_220_r7 + "-loSo");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(row_r6.isQC ? 7 : 8);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.activeColumns);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(row_r6.isQC ? 12 : 13);
} }
function Sop01EntryComponent_For_121_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, Sop01EntryComponent_For_121_Conditional_0_Template, 14, 8, "tr", 63);
} if (rf & 2) {
    const row_r6 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.draft.resultData[row_r6.key] ? 0 : -1);
} }
export class Sop01EntryComponent {
    constructor() {
        this.isReadOnly = false;
        this.publishedSampleSet = null;
        this.draftChanged = new EventEmitter();
        this.masterTargetService = inject(MasterTargetService);
        this.masterTargets = signal([]);
        this.columnDisplayNames = signal({});
        this.activeColumns = [];
        this.checkboxList = [];
        // Bulk rack properties
        this.bulkRackStart = 1;
        this.bulkVialStartFip = 10;
        this.bulkVialsPerRack = 54;
    }
    async ngOnInit() {
        try {
            const analytes = await this.masterTargetService.getAll();
            this.masterTargets.set(analytes);
        }
        catch (e) {
            console.warn('Failed to load master analytes', e);
        }
        // Trích lọc các hoạt chất thực sự
        const cols = Object.keys(this.config.columns || {});
        this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
        this.buildColumnDisplayNames();
        // Nạp danh sách checkbox
        if (this.config.checkboxLines) {
            this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
                key: key,
                label
            }));
        }
        // Khởi tạo các trường dữ liệu Fipronil nếu chưa có
        if (!this.draft.page1Data) {
            this.draft.page1Data = {};
        }
        if (!this.draft.page1Data['calibPoints'] || this.draft.page1Data['calibPoints'].length !== 5) {
            this.draft.page1Data['calibPoints'] = [
                { loSo: '1.1', vialNo: '1.1' },
                { loSo: '1.2', vialNo: '1.2' },
                { loSo: '1.3', vialNo: '1.3' },
                { loSo: '1.4', vialNo: '1.4' },
                { loSo: '1.5', vialNo: '1.5' }
            ];
        }
        if (this.draft.page1Data['maHoSo'] === undefined)
            this.draft.page1Data['maHoSo'] = '';
        if (this.draft.page1Data['heSoPhaLoang'] === undefined)
            this.draft.page1Data['heSoPhaLoang'] = '1';
        if (this.draft.page1Data['loaiMau'] === undefined)
            this.draft.page1Data['loaiMau'] = 'Thủy sản';
        if (this.draft.page1Data['tinhTrangMau'] === undefined)
            this.draft.page1Data['tinhTrangMau'] = 'Bình thường';
        if (this.draft.page1Data['hasCheckSample'] === undefined)
            this.draft.page1Data['hasCheckSample'] = false;
        if (this.draft.page1Data['hasSpikeSample'] === undefined)
            this.draft.page1Data['hasSpikeSample'] = true;
        if (this.draft.page1Data['hasSpikeNSample'] === undefined)
            this.draft.page1Data['hasSpikeNSample'] = true;
        if (this.draft.page1Data['hasFinalSample'] === undefined)
            this.draft.page1Data['hasFinalSample'] = true;
        // Khởi tạo tên tuỳ chỉnh cho các mẫu QC
        if (this.draft.page1Data['blankName'] === undefined)
            this.draft.page1Data['blankName'] = '';
        if (this.draft.page1Data['spikeName'] === undefined)
            this.draft.page1Data['spikeName'] = '';
        if (this.draft.page1Data['checkSampleName'] === undefined)
            this.draft.page1Data['checkSampleName'] = 'CHECK_SAMPLE';
        // Khởi tạo đánh giá chất lượng (QC checklist) mặc định Đạt (true), ngoại trừ qcNhanDang là N/A (null)
        const qcKeys = [
            'qcR2',
            'qcThoiGianLuu',
            'qcThemChuan',
            'qcThuHoi',
            'qcDanhGiaChung'
        ];
        qcKeys.forEach(k => {
            if (this.draft.page1Data[k] === undefined || this.draft.page1Data[k] === null || this.draft.page1Data[k] === '') {
                this.draft.page1Data[k] = true;
            }
        });
        if (this.draft.page1Data['qcKiemTraNoiBo'] === undefined || this.draft.page1Data['qcKiemTraNoiBo'] === '') {
            this.draft.page1Data['qcKiemTraNoiBo'] = this.draft.page1Data['hasCheckSample'] ? true : null;
        }
        if (this.draft.page1Data['qcNhanDang'] === undefined) {
            this.draft.page1Data['qcNhanDang'] = null;
        }
        if (!this.draft.resultData) {
            this.draft.resultData = {};
        }
        // Mặc định điền Vial bắt đầu từ 1.10
        (this.run.sampleList || []).forEach((sample, idx) => {
            if (!this.draft.resultData[sample]) {
                this.draft.resultData[sample] = {};
            }
            if (this.draft.resultData[sample]['loSo'] === undefined || this.draft.resultData[sample]['loSo'] === '') {
                const currentVial = 10 + idx;
                const rack = 1 + Math.floor((currentVial - 1) / 54);
                const vial = ((currentVial - 1) % 54) + 1;
                this.draft.resultData[sample]['loSo'] = `${rack}.${vial}`;
            }
        });
        this.prefillUnassignedTargets();
        this.onDataChanged();
    }
    onHasCheckSampleChange() {
        if (this.isReadOnly)
            return;
        if (this.draft.page1Data['hasCheckSample']) {
            this.draft.page1Data['qcKiemTraNoiBo'] = true;
        }
        else {
            this.draft.page1Data['qcKiemTraNoiBo'] = null;
        }
        this.onDataChanged();
    }
    applyBulkVials() {
        if (this.isReadOnly)
            return;
        const rackStart = parseInt(String(this.bulkRackStart), 10);
        const vialStart = parseInt(String(this.bulkVialStartFip), 10);
        const perRack = parseInt(String(this.bulkVialsPerRack), 10);
        if (isNaN(rackStart) || isNaN(vialStart) || isNaN(perRack) || perRack <= 0) {
            return;
        }
        const visible = this.run.sampleList || [];
        let currentRack = rackStart;
        let currentVial = vialStart;
        visible.forEach((sample) => {
            if (currentVial > perRack) {
                currentRack += 1;
                currentVial = 1;
            }
            if (!this.draft.resultData[sample]) {
                this.draft.resultData[sample] = {
                    loSo: '',
                    selected: true
                };
            }
            this.draft.resultData[sample]['loSo'] = `${currentRack}.${currentVial}`;
            currentVial += 1;
        });
        this.onDataChanged();
    }
    getCompoundDisplayName(compound) {
        return resolveCompoundDisplayName(compound, this.masterTargets(), this.config?.id || this.run?.sopId);
    }
    formatColumnName(colKey) {
        // Dùng getSop01DisplayName() — lấy từ masterTargets nếu có, fallback về tên cố định
        return getSop01DisplayName(colKey, this.masterTargets());
    }
    buildColumnDisplayNames() {
        const map = {};
        for (const col of this.activeColumns) {
            map[col] = this.formatColumnName(col);
        }
        this.columnDisplayNames.set(map);
    }
    // ── Helper cho Mã Hồ Sơ ───────────────────────────────────────────────────
    autoFillMaHoSo() {
        if (this.isReadOnly)
            return;
        // Format mã mẫu: [tiền tố chữ cái (tuỳ chọn)] + [2 số XX] + [2 số hậu tố = ngày]
        // Ví dụ: U0108 → tiền tố U, XX=01, ngày=08
        //        0108  → không tiền tố, XX=01, ngày=08
        const sampleList = this.run?.sampleList || [];
        // Lấy 2 số cuối của mỗi mã mẫu → ngày
        const days = sampleList
            .map((code) => {
            const match = code.match(/(\d{2})$/);
            return match ? parseInt(match[1], 10) : null;
        })
            .filter((d) => d !== null && d >= 1 && d <= 31);
        const dateSrc = this.run?.createdAt ? new Date(this.run.createdAt) : new Date();
        const month = String(dateSrc.getMonth() + 1).padStart(2, '0');
        const year = String(dateSrc.getFullYear());
        // Lấy ngày cao nhất trong mẻ (nếu không parse được thì fallback về ngày hiện tại)
        const day = days.length > 0
            ? String(Math.max(...days)).padStart(2, '0')
            : String(dateSrc.getDate()).padStart(2, '0');
        this.draft.page1Data['maHoSo'] = `U (${day}/${month}/${year})`;
        this.onDataChanged();
    }
    onDataChanged() {
        if (this.isReadOnly)
            return;
        this.draftChanged.emit(this.draft);
    }
    isTargetAssigned(sampleCode, col) {
        if (sampleCode.startsWith('QC_')) {
            return this.isTargetAssignedToAnySample(col);
        }
        if (!this.run)
            return true;
        const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
        if (!targetMap)
            return true;
        const assigned = getAssignedTargetsForSample(sampleCode, targetMap);
        if (!assigned || assigned.length === 0)
            return true;
        // Fast path: canonical id direct match (v2 data)
        const canonicalId = SOP01_COLUMN_TO_CANONICAL[col];
        if (canonicalId) {
            if (assigned.includes(canonicalId))
                return true;
            // Fallback: case-insensitive (v1 data chưa migrate)
            return assigned.some(tid => tid.toLowerCase() === canonicalId.toLowerCase());
        }
        // Col không có trong map → fallback so sánh trực tiếp
        return assigned.some(tid => tid.toLowerCase() === col.toLowerCase());
    }
    isTargetAssignedToAnySample(col) {
        if (!this.run)
            return true;
        const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
        if (!targetMap)
            return true;
        const sampleList = this.run.sampleList || [];
        if (sampleList.length === 0)
            return true;
        const canonicalId = SOP01_COLUMN_TO_CANONICAL[col];
        return sampleList.some((sampleCode) => {
            const assigned = getAssignedTargetsForSample(sampleCode, targetMap);
            if (!assigned || assigned.length === 0)
                return true;
            // Fast path: canonical id direct match (v2)
            if (canonicalId) {
                if (assigned.includes(canonicalId))
                    return true;
                return assigned.some(tid => tid.toLowerCase() === canonicalId.toLowerCase());
            }
            return assigned.some(tid => tid.toLowerCase() === col.toLowerCase());
        });
    }
    prefillUnassignedTargets() {
        const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
        if (!this.run || !targetMap || !this.activeColumns)
            return;
        // Get all rows in display (including QC samples)
        const allRowKeys = this.getDisplayRowsForFipronil().map(row => row.key);
        let changed = false;
        allRowKeys.forEach((sampleCode) => {
            if (!this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode] = {};
            }
            const row = this.draft.resultData[sampleCode];
            this.activeColumns.forEach((c) => {
                if (!this.isTargetAssigned(sampleCode, c)) {
                    if (row[c] !== 'N/A') {
                        row[c] = 'N/A';
                        changed = true;
                    }
                }
            });
        });
        if (changed) {
            this.onDataChanged();
        }
    }
    onCellChanged(sampleCode) {
        if (this.isReadOnly)
            return;
        this.updateRecovery(sampleCode);
        this.onDataChanged();
    }
    updateRecovery(sampleCode) {
        const row = this.draft.resultData[sampleCode];
        if (!row)
            return;
        // Delegate to Fipronil pure calculation engine
        row['ghiChu'] = calculateSop01Recovery(row, sampleCode);
    }
    getSpikeNKey(n) {
        return `QC_SPIKE_${n}`;
    }
    getDisplayRowsForFipronil() {
        const list = [];
        const blankName = this.draft.page1Data['blankName'] || 'BLANK';
        const spikeName = this.draft.page1Data['spikeName'] || 'SPIKE';
        const checkSampleName = this.draft.page1Data['checkSampleName'] || 'CHECK_SAMPLE';
        const ensureKey = (key, defaultVial) => {
            if (!this.draft.resultData[key]) {
                this.draft.resultData[key] = {
                    loSo: defaultVial,
                    selected: true
                };
            }
        };
        // 1. BLANK (vial 1.7)
        ensureKey('QC_BLANK', '1.7');
        if (this.draft.resultData['QC_BLANK']['kqFip'] === undefined || this.draft.resultData['QC_BLANK']['kqFip'] === '') {
            this.draft.resultData['QC_BLANK']['kqFip'] = 'ND';
        }
        if (this.draft.resultData['QC_BLANK']['kqFipDesl'] === undefined || this.draft.resultData['QC_BLANK']['kqFipDesl'] === '') {
            this.draft.resultData['QC_BLANK']['kqFipDesl'] = 'ND';
        }
        if (this.draft.resultData['QC_BLANK']['kqFipSulf'] === undefined || this.draft.resultData['QC_BLANK']['kqFipSulf'] === '') {
            this.draft.resultData['QC_BLANK']['kqFipSulf'] = 'ND';
        }
        list.push({
            key: 'QC_BLANK',
            type: 'QC_BLANK',
            label: blankName,
            isQC: true
        });
        // 2. SPIKE (vial 1.8)
        if (this.draft.page1Data['hasSpikeSample']) {
            ensureKey('QC_SPIKE', '1.8');
            list.push({
                key: 'QC_SPIKE',
                type: 'QC_SPIKE',
                label: spikeName,
                isQC: true
            });
        }
        // 3. CHECK_SAMPLE (vial 1.9, optional)
        if (this.draft.page1Data['hasCheckSample']) {
            ensureKey('QC_CHECK_SAMPLE', '1.9');
            list.push({
                key: 'QC_CHECK_SAMPLE',
                type: 'QC_CHECK_SAMPLE',
                label: checkSampleName,
                isQC: true
            });
        }
        // 4. REGULAR samples (vials start at 1.10) with dynamic SP_N every 10 samples
        let regularCount = 0;
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
            regularCount++;
            if (regularCount % 10 === 0) {
                const isLastSample = regularCount === (this.run.sampleList || []).length;
                if (!isLastSample && this.draft.page1Data['hasSpikeNSample']) {
                    const n = regularCount / 10;
                    const spikeNKey = this.getSpikeNKey(n);
                    const spikeVial = this.draft.resultData['QC_SPIKE']?.['loSo'] || '1.8';
                    if (!this.draft.resultData[spikeNKey]) {
                        this.draft.resultData[spikeNKey] = {
                            loSo: spikeVial,
                            selected: true
                        };
                    }
                    else {
                        this.draft.resultData[spikeNKey]['loSo'] = spikeVial;
                    }
                    list.push({
                        key: spikeNKey,
                        type: 'QC_SPIKE_N',
                        label: `SP_${n}`,
                        isQC: true,
                        n: n
                    });
                }
            }
        });
        // 5. FINAL (vial 1.8)
        if (this.draft.page1Data['hasFinalSample']) {
            ensureKey('QC_FINAL', '1.8');
            list.push({
                key: 'QC_FINAL',
                type: 'QC_FINAL',
                label: 'FINAL',
                isQC: true
            });
        }
        return list;
    }
    bulkFillND() {
        if (this.isReadOnly)
            return;
        const allRowKeys = this.getDisplayRowsForFipronil().map(row => row.key);
        allRowKeys.forEach((key) => {
            const row = this.draft.resultData[key];
            if (row) {
                this.activeColumns.forEach((col) => {
                    if (!this.isTargetAssigned(key, col)) {
                        row[col] = 'N/A';
                    }
                    else if (!row[col] || row[col].toString().trim() === '') {
                        row[col] = 'ND';
                    }
                });
                this.updateRecovery(key);
            }
        });
        this.draft.page1Data['checkTatCaND'] = true;
        this.draft.page1Data['checkCoMauPhatHien'] = false;
        this.onDataChanged();
    }
    bulkClearAll() {
        if (this.isReadOnly)
            return;
        const allRowKeys = this.getDisplayRowsForFipronil().map(row => row.key);
        allRowKeys.forEach((key) => {
            const row = this.draft.resultData[key];
            if (row) {
                this.activeColumns.forEach((col) => {
                    row[col] = this.isTargetAssigned(key, col) ? '' : 'N/A';
                });
                row['ghiChu'] = '';
            }
        });
        this.onDataChanged();
    }
    copyRowToAll(sourceKey) {
        if (this.isReadOnly)
            return;
        const sourceData = this.draft.resultData[sourceKey];
        if (!sourceData)
            return;
        const sampleList = this.run.sampleList || [];
        sampleList.forEach((targetKey) => {
            if (targetKey !== sourceKey) {
                if (!this.draft.resultData[targetKey]) {
                    this.draft.resultData[targetKey] = { selected: true };
                }
                const destRow = this.draft.resultData[targetKey];
                this.activeColumns.forEach((col) => {
                    if (!this.isTargetAssigned(targetKey, col)) {
                        destRow[col] = 'N/A';
                    }
                    else {
                        const sourceValue = this.isTargetAssigned(sourceKey, col) ? sourceData[col] : '';
                        destRow[col] = (sourceValue === 'N/A' && this.isTargetAssigned(targetKey, col)) ? '' : (sourceValue || '');
                    }
                });
                this.updateRecovery(targetKey);
            }
        });
        this.onDataChanged();
    }
    isAllSelected() {
        const rows = this.getDisplayRowsForFipronil().filter(r => !r.isQC);
        if (rows.length === 0)
            return false;
        return rows.every(r => this.draft.resultData[r.key]?.['selected'] !== false);
    }
    toggleSelectAll(event) {
        if (this.isReadOnly)
            return;
        const isChecked = event.target.checked;
        const rows = this.getDisplayRowsForFipronil().filter(r => !r.isQC);
        rows.forEach(r => {
            if (this.draft.resultData[r.key]) {
                this.draft.resultData[r.key]['selected'] = isChecked;
            }
        });
        this.onDataChanged();
    }
    handleGridNavigation(event, rowIdx, colName, colIdx) {
        const columnsList = ['loSo', ...this.activeColumns];
        const rows = this.getDisplayRowsForFipronil();
        navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 0);
    }
    static { this.ɵfac = function Sop01EntryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Sop01EntryComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Sop01EntryComponent, selectors: [["app-sop-01-entry"]], inputs: { run: "run", draft: "draft", config: "config", isReadOnly: "isReadOnly", publishedSampleSet: "publishedSampleSet" }, outputs: { draftChanged: "draftChanged" }, decls: 122, vars: 51, consts: [[1, "space-y-6"], ["title", "Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP-01)", 3, "draftChanged", "draft", "checkboxList", "isReadOnly"], ["sop-metadata-extra", "", 1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "gap-4", "p-4", "rounded-2xl", "bg-indigo-50/15", "dark:bg-indigo-955/5", "border", "border-indigo-100/40", "dark:border-indigo-950/20", "mt-4"], [1, "flex", "items-center", "justify-between", "text-[10px]", "font-black", "text-indigo-650", "dark:text-indigo-400", "mb-1.5", "uppercase", "tracking-widest"], ["type", "button", "title", "T\u1EF1 \u0111\u1ED9ng \u0111i\u1EC1n b\u1EB1ng c\u00E1c m\u1EABu \u0111ang ch\u1ECDn", 1, "text-indigo-500", "hover:text-indigo-700", "dark:hover:text-indigo-300", "transition-colors", 3, "click", "disabled"], [1, "fa-solid", "fa-wand-magic-sparkles"], ["type", "text", "placeholder", "Nh\u1EADp m\u00E3 h\u1ED3 s\u01A1...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-3.5", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-sm", 3, "ngModelChange", "ngModel", "disabled"], [1, "block", "text-[10px]", "font-black", "text-indigo-650", "dark:text-indigo-400", "mb-1.5", "uppercase", "tracking-widest"], [1, "flex", "items-center", "gap-1.5"], ["type", "button", "title", "Ch\u1ECDn f=1", 3, "click", "disabled"], ["type", "text", "placeholder", "H\u1EC7 s\u1ED1 f...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-3", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-sm", 3, "ngModelChange", "ngModel", "disabled"], ["type", "button", "title", "Ch\u1ECDn Th\u1EE7y s\u1EA3n", 3, "click", "disabled"], ["type", "text", "placeholder", "Lo\u1EA1i m\u1EABu...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-3", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-sm", 3, "ngModelChange", "ngModel", "disabled"], ["type", "button", "title", "Ch\u1ECDn B\u00ECnh th\u01B0\u1EDDng", 3, "click", "disabled"], ["type", "text", "placeholder", "T\u00ECnh tr\u1EA1ng...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200/80", "dark:border-slate-700/80", "rounded-xl", "px-3", "py-2", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-sm", 3, "ngModelChange", "ngModel", "disabled"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4", "animate-fade-in"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "border-b", "border-slate-100", "dark:border-slate-800", "pb-2.5", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-chart-line", "mr-2", "text-fuchsia-500", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-12", "gap-6"], [1, "lg:col-span-5", "space-y-3"], [1, "p-4", "bg-indigo-50/15", "dark:bg-indigo-955/5", "border", "border-indigo-100/40", "dark:border-indigo-950/20", "rounded-2xl", "space-y-3", "shadow-xs"], [1, "text-xs", "font-black", "text-indigo-700", "dark:text-indigo-400", "uppercase", "tracking-wider", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-flask-vial"], [1, "flex", "flex-col", "gap-2"], [1, "flex", "items-center", "gap-2", "cursor-pointer", "py-2", "px-3", "bg-white", "dark:bg-slate-850", "hover:bg-slate-50", "dark:hover:bg-slate-800/60", "rounded-xl", "border", "border-slate-200", "dark:border-slate-800", "transition", "select-none", "shadow-2xs"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-fuchsia-600", "border-slate-350", "dark:border-slate-700", "focus:ring-fuchsia-500", "dark:bg-slate-900", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "grid", "grid-cols-2", "gap-2.5"], [1, "block", "text-[9px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "mb-1.5", "tracking-wider"], ["type", "text", "placeholder", "BLANK", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-3", "py-1.5", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-xs", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "placeholder", "SPIKE", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-3", "py-1.5", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-xs", 3, "ngModelChange", "ngModel", "disabled"], [1, "animate-fade-in"], [1, "lg:col-span-7", "flex", "flex-col", "justify-center"], ["title", "5 \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)", "pointPrefix", "Point C", "suffixText", "IS: 20 ppb", 3, "pointsChanged", "calibPoints", "pointLabels", "isSuffixVisible", "isFuchsiaRing", "isReadOnly"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-3.5"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-table-cells", "mr-1", "text-fuchsia-500", "text-sm"], [1, "flex", "flex-wrap", "items-center", "gap-3"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mr-1"], ["title", "\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND", 1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-amber-50", "dark:hover:bg-amber-955/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-amber-200", "dark:hover:border-amber-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click", "disabled"], [1, "fa-solid", "fa-pen-clip", "text-amber-500"], ["title", "X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng", 1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-rose-50", "dark:hover:bg-rose-955/20", "text-slate-600", "dark:text-slate-400", "hover:text-rose-600", "dark:hover:text-rose-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-rose-200", "dark:hover:border-rose-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click", "disabled"], [1, "fa-solid", "fa-trash-can", "text-rose-500"], [1, "flex", "items-center", "gap-2", "bg-indigo-50/15", "dark:bg-indigo-955/5", "border", "border-indigo-100/40", "dark:border-indigo-950/20", "rounded-2xl", "px-3.5", "py-1.5", "text-xs", "shadow-2xs"], [1, "font-black", "text-indigo-700", "dark:text-indigo-400", "uppercase", "tracking-widest"], [1, "text-slate-450", "dark:text-slate-500", "font-bold"], ["type", "number", "title", "Khay ch\u1EA1y m\u00E1y (Rack)", "placeholder", "Rack", 1, "w-12", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-1.5", "py-0.5", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "outline-none", "shadow-inner", 3, "ngModelChange", "ngModel", "disabled"], ["type", "number", "title", "Vial b\u1EAFt \u0111\u1EA7u", "placeholder", "Vial", 1, "w-12", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-1.5", "py-0.5", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "outline-none", "shadow-inner", 3, "ngModelChange", "ngModel", "disabled"], ["type", "number", "title", "S\u1ED1 \u1ED1ng vial t\u1ED1i \u0111a tr\u00EAn m\u1ED9t khay (Rack)", "placeholder", "T\u1ED1i \u0111a", 1, "w-12", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-lg", "px-1.5", "py-0.5", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "outline-none", "shadow-inner", 3, "ngModelChange", "ngModel", "disabled"], ["title", "\u0110i\u1EC1n t\u1EF1 \u0111\u1ED9ng s\u1ED1 khay v\u00E0 vial cho to\u00E0n b\u1ED9 danh s\u00E1ch m\u1EABu", 1, "px-3", "py-1", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-xl", "font-extrabold", "transition", "shadow-sm", "flex", "items-center", "gap-1", "active:scale-95", 3, "click", "disabled"], [1, "fa-solid", "fa-magic", "text-[10px]"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "max-h-[550px]", "overflow-y-auto"], [1, "w-full", "text-sm", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-955", "border-b", "border-slate-250/80", "dark:border-slate-800", "sticky", "top-0", "z-20", "shadow-2xs"], [1, "py-3", "px-3", "text-center", "w-12"], ["type", "checkbox", "title", "Ch\u1ECDn/B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3 m\u1EABu \u0111\u1EC3 xu\u1EA5t k\u1EBFt qu\u1EA3", 1, "w-4", "h-4", "rounded", "text-fuchsia-600", "border-slate-350", "dark:border-slate-700", "focus:ring-fuchsia-500", "dark:bg-slate-900", "cursor-pointer", 3, "change", "checked", "disabled"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-24"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[140px]"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[130px]"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-28"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800/80"], ["type", "text", "placeholder", "CHECK_SAMPLE", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-3", "py-1.5", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", "shadow-xs", 3, "ngModelChange", "ngModel", "disabled"], [3, "class"], [1, "py-2.5", "px-3", "text-center"], ["type", "checkbox", "title", "Ch\u1ECDn xu\u1EA5t k\u1EBFt qu\u1EA3 cho m\u1EABu n\u00E0y", 1, "w-4", "h-4", "rounded", "text-fuchsia-600", "border-slate-350", "dark:border-slate-700", "focus:ring-fuchsia-500", "dark:bg-slate-900", "cursor-pointer", 3, "ngModel", "disabled"], ["type", "checkbox", "checked", "", "disabled", "", 1, "w-4", "h-4", "rounded", "border-slate-300", "text-amber-500/50", "dark:text-amber-500/30", "focus:ring-amber-500", "cursor-not-allowed"], [1, "py-1.5", "px-3", "w-24"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-extrabold", "focus:ring-2", "focus:ring-fuchsia-500/20", "focus:border-fuchsia-500", "transition", "outline-none", "text-center", "shadow-inner", 3, "ngModelChange", "keydown", "focus", "ngModel", "disabled", "id"], [1, "py-2.5", "px-4", "font-mono", "font-extrabold", "text-xs", "text-slate-700", "dark:text-slate-300", "break-all"], [1, "inline-flex", "items-center", "gap-1.5", "text-amber-600", "dark:text-amber-400"], [1, "py-1.5", "px-2"], [1, "py-1.5", "px-4", "text-center"], [1, "inline-flex", "items-center", "px-2", "py-0.5", "rounded-full", "text-[9px]", "font-black", "uppercase", "tracking-widest", "bg-amber-500/10", "text-amber-500", "dark:bg-amber-400/5", "dark:text-amber-400", "border", "border-amber-500/20"], ["title", "Sao ch\u00E9p k\u1EBFt qu\u1EA3 c\u1EE7a d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng c\u00F2n l\u1EA1i", 1, "p-1.5", "bg-slate-50", "hover:bg-fuchsia-600", "dark:bg-slate-855", "dark:hover:bg-fuchsia-600", "text-slate-500", "hover:text-white", "dark:text-slate-400", "rounded-lg", "text-[10px]", "font-bold", "transition", "border", "border-slate-200", "dark:border-slate-800", "active:scale-90", 3, "disabled"], ["type", "checkbox", "title", "Ch\u1ECDn xu\u1EA5t k\u1EBFt qu\u1EA3 cho m\u1EABu n\u00E0y", 1, "w-4", "h-4", "rounded", "text-fuchsia-600", "border-slate-350", "dark:border-slate-700", "focus:ring-fuchsia-500", "dark:bg-slate-900", "cursor-pointer", 3, "ngModelChange", "ngModel", "disabled"], [1, "fa-solid", "fa-flask", "text-[10px]"], ["type", "text", "placeholder", "...", 1, "w-full", "bg-white", "dark:bg-slate-850", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "px-2.5", "py-1.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-extrabold", "focus:ring-2", "focus:ring-fuchsia-500/20", "focus:border-fuchsia-500", "transition", "outline-none", "text-center", "shadow-inner", "disabled:bg-slate-105", "dark:disabled:bg-slate-900", "disabled:opacity-60", "disabled:cursor-not-allowed", 3, "ngModelChange", "keydown", "focus", "ngModel", "id", "disabled"], ["title", "Sao ch\u00E9p k\u1EBFt qu\u1EA3 c\u1EE7a d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng c\u00F2n l\u1EA1i", 1, "p-1.5", "bg-slate-50", "hover:bg-fuchsia-600", "dark:bg-slate-855", "dark:hover:bg-fuchsia-600", "text-slate-500", "hover:text-white", "dark:text-slate-400", "rounded-lg", "text-[10px]", "font-bold", "transition", "border", "border-slate-200", "dark:border-slate-800", "active:scale-90", 3, "click", "disabled"], [1, "fa-solid", "fa-copy"]], template: function Sop01EntryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "app-sop-header-metadata", 1);
            i0.ɵɵlistener("draftChanged", function Sop01EntryComponent_Template_app_sop_header_metadata_draftChanged_1_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementStart(2, "div", 2)(3, "div")(4, "label", 3)(5, "span");
            i0.ɵɵtext(6, "1. M\u00E3 h\u1ED3 s\u01A1");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "button", 4);
            i0.ɵɵlistener("click", function Sop01EntryComponent_Template_button_click_7_listener() { return ctx.autoFillMaHoSo(); });
            i0.ɵɵelement(8, "i", 5);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "input", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_9_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["maHoSo"], $event) || (ctx.draft.page1Data["maHoSo"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_9_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(10, "div")(11, "label", 7);
            i0.ɵɵtext(12, "3. H\u1EC7 s\u1ED1 pha lo\u00E3ng (f)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "div", 8)(14, "button", 9);
            i0.ɵɵlistener("click", function Sop01EntryComponent_Template_button_click_14_listener() { ctx.draft.page1Data["heSoPhaLoang"] = "1"; return ctx.onDataChanged(); });
            i0.ɵɵtext(15, " f=1 ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "input", 10);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_16_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["heSoPhaLoang"], $event) || (ctx.draft.page1Data["heSoPhaLoang"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_16_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(17, "div")(18, "label", 7);
            i0.ɵɵtext(19, "4. Lo\u1EA1i m\u1EABu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "div", 8)(21, "button", 11);
            i0.ɵɵlistener("click", function Sop01EntryComponent_Template_button_click_21_listener() { ctx.draft.page1Data["loaiMau"] = "Th\u1EE7y s\u1EA3n"; return ctx.onDataChanged(); });
            i0.ɵɵtext(22, " Th\u1EE7y S\u1EA3n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "input", 12);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_23_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["loaiMau"], $event) || (ctx.draft.page1Data["loaiMau"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_23_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(24, "div")(25, "label", 7);
            i0.ɵɵtext(26, "5. T\u00ECnh tr\u1EA1ng m\u1EABu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "div", 8)(28, "button", 13);
            i0.ɵɵlistener("click", function Sop01EntryComponent_Template_button_click_28_listener() { ctx.draft.page1Data["tinhTrangMau"] = "B\u00ECnh th\u01B0\u1EDDng"; return ctx.onDataChanged(); });
            i0.ɵɵtext(29, " B\u00ECnh Th\u01B0\u1EDDng ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "input", 14);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_30_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["tinhTrangMau"], $event) || (ctx.draft.page1Data["tinhTrangMau"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_30_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(31, "div", 15)(32, "h4", 16);
            i0.ɵɵelement(33, "i", 17);
            i0.ɵɵtext(34, " 7. Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "div", 18)(36, "div", 19)(37, "div", 20)(38, "h5", 21);
            i0.ɵɵelement(39, "i", 22);
            i0.ɵɵtext(40, " C\u1EA5u H\u00ECnh M\u1EABu QC & T\u00EAn Tu\u1EF3 Ch\u1EC9nh ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "div", 23)(42, "label", 24)(43, "input", 25);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_43_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["hasCheckSample"], $event) || (ctx.draft.page1Data["hasCheckSample"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_43_listener() { return ctx.onHasCheckSampleChange(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "span", 26);
            i0.ɵɵtext(45, "\u00C1p d\u1EE5ng m\u1EABu CHECK_SAMPLE");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(46, "label", 24)(47, "input", 25);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_47_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["hasSpikeSample"], $event) || (ctx.draft.page1Data["hasSpikeSample"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_47_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "span", 26);
            i0.ɵɵtext(49, "T\u1EF1 \u0111\u1ED9ng th\u00EAm m\u1EABu th\u00EAm chu\u1EA9n");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(50, "label", 24)(51, "input", 25);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_51_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["hasSpikeNSample"], $event) || (ctx.draft.page1Data["hasSpikeNSample"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_51_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(52, "span", 26);
            i0.ɵɵtext(53, "T\u1EF1 \u0111\u1ED9ng th\u00EAm m\u1EABu th\u00EAm chu\u1EA9n_N");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(54, "label", 24)(55, "input", 25);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_55_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["hasFinalSample"], $event) || (ctx.draft.page1Data["hasFinalSample"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_55_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(56, "span", 26);
            i0.ɵɵtext(57, "T\u1EF1 \u0111\u1ED9ng th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(58, "div", 27)(59, "div")(60, "label", 28);
            i0.ɵɵtext(61, "T\u00EAn m\u1EABu tr\u1EAFng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(62, "input", 29);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_62_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["blankName"], $event) || (ctx.draft.page1Data["blankName"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_62_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(63, "div")(64, "label", 28);
            i0.ɵɵtext(65, "T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(66, "input", 30);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_66_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["spikeName"], $event) || (ctx.draft.page1Data["spikeName"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_66_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(67, Sop01EntryComponent_Conditional_67_Template, 4, 2, "div", 31);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(68, "div", 32)(69, "app-sop-calibration-points", 33);
            i0.ɵɵlistener("pointsChanged", function Sop01EntryComponent_Template_app_sop_calibration_points_pointsChanged_69_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(70, "div", 34)(71, "div", 35)(72, "h4", 36);
            i0.ɵɵelement(73, "i", 37);
            i0.ɵɵtext(74, " L\u01B0\u1EDBi Nh\u1EADp K\u1EBFt Qu\u1EA3 (SOP-01 Spreadsheet) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(75, "div", 38)(76, "span", 39);
            i0.ɵɵtext(77, "Thao t\u00E1c nhanh:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(78, "button", 40);
            i0.ɵɵlistener("click", function Sop01EntryComponent_Template_button_click_78_listener() { return ctx.bulkFillND(); });
            i0.ɵɵelement(79, "i", 41);
            i0.ɵɵelementStart(80, "span");
            i0.ɵɵtext(81, "\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(82, "button", 42);
            i0.ɵɵlistener("click", function Sop01EntryComponent_Template_button_click_82_listener() { return ctx.bulkClearAll(); });
            i0.ɵɵelement(83, "i", 43);
            i0.ɵɵelementStart(84, "span");
            i0.ɵɵtext(85, "X\u00F3a H\u1EBFt B\u1EA3ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(86, "div", 44)(87, "span", 45);
            i0.ɵɵtext(88, "Nh\u1EADp nhanh s\u1ED1 l\u1ECD:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(89, "div", 8)(90, "span", 46);
            i0.ɵɵtext(91, "Rack:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(92, "input", 47);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_92_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkRackStart, $event) || (ctx.bulkRackStart = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(93, "div", 8)(94, "span", 46);
            i0.ɵɵtext(95, "Vial \u0111\u1EA7u:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(96, "input", 48);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_96_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkVialStartFip, $event) || (ctx.bulkVialStartFip = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(97, "div", 8)(98, "span", 46);
            i0.ɵɵtext(99, "Size:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(100, "input", 49);
            i0.ɵɵtwoWayListener("ngModelChange", function Sop01EntryComponent_Template_input_ngModelChange_100_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.bulkVialsPerRack, $event) || (ctx.bulkVialsPerRack = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(101, "button", 50);
            i0.ɵɵlistener("click", function Sop01EntryComponent_Template_button_click_101_listener() { return ctx.applyBulkVials(); });
            i0.ɵɵelement(102, "i", 51);
            i0.ɵɵelementStart(103, "span");
            i0.ɵɵtext(104, "\u0110i\u1EC1n Nhanh");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(105, "div", 52)(106, "table", 53)(107, "thead")(108, "tr", 54)(109, "th", 55)(110, "input", 56);
            i0.ɵɵlistener("change", function Sop01EntryComponent_Template_input_change_110_listener($event) { return ctx.toggleSelectAll($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(111, "th", 57);
            i0.ɵɵtext(112, "Vial No.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(113, "th", 58);
            i0.ɵɵtext(114, "M\u1EABu th\u1EED");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(115, Sop01EntryComponent_For_116_Template, 2, 1, "th", 59, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementStart(117, "th", 60);
            i0.ɵɵtext(118, "H\u00E0nh \u0111\u1ED9ng");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(119, "tbody", 61);
            i0.ɵɵrepeaterCreate(120, Sop01EntryComponent_For_121_Template, 1, 1, null, null, _forTrack0);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("draft", ctx.draft)("checkboxList", ctx.checkboxList)("isReadOnly", ctx.isReadOnly);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["maHoSo"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(5);
            i0.ɵɵclassMap(ctx.draft.page1Data["heSoPhaLoang"] === "1" ? "px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95" : "px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["heSoPhaLoang"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(5);
            i0.ɵɵclassMap(ctx.draft.page1Data["loaiMau"] === "Th\u1EE7y s\u1EA3n" || ctx.draft.page1Data["loaiMau"] === "Thu\u1EF7 s\u1EA3n" ? "px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95" : "px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["loaiMau"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(5);
            i0.ɵɵclassMap(ctx.draft.page1Data["tinhTrangMau"] === "B\u00ECnh th\u01B0\u1EDDng" ? "px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95" : "px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95");
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["tinhTrangMau"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(13);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["hasCheckSample"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["hasSpikeSample"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["hasSpikeNSample"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["hasFinalSample"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["blankName"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["spikeName"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.draft.page1Data["hasCheckSample"] ? 67 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("calibPoints", ctx.draft.page1Data["calibPoints"])("pointLabels", i0.ɵɵpureFunction0(50, _c0))("isSuffixVisible", true)("isFuchsiaRing", true)("isReadOnly", ctx.isReadOnly);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(10);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkRackStart);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkVialStartFip);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.bulkVialsPerRack);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("checked", ctx.isAllSelected())("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.activeColumns);
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.getDisplayRowsForFipronil());
        } }, dependencies: [FormsModule, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.CheckboxControlValueAccessor, i1.NgControlStatus, i1.NgModel, SopHeaderMetadataComponent, SopCalibrationPointsComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Sop01EntryComponent, [{
        type: Component,
        args: [{ selector: 'app-sop-01-entry', standalone: true, imports: [FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent], template: "<div class=\"space-y-6\">\r\n\r\n  <!-- 1. Metadata Form & Checkboxes -->\r\n  <app-sop-header-metadata\r\n    title=\"Th\u00F4ng tin chung & \u0110\u00E1nh gi\u00E1 (SOP-01)\"\r\n    [draft]=\"draft\"\r\n    [checkboxList]=\"checkboxList\"\r\n    [isReadOnly]=\"isReadOnly\"\r\n    (draftChanged)=\"onDataChanged()\">\r\n\r\n    <!-- Fipronil specific inputs (M\u00E3 h\u1ED3 s\u01A1, H\u1EC7 s\u1ED1 pha lo\u00E3ng, Lo\u1EA1i m\u1EABu, T\u00ECnh tr\u1EA1ng m\u1EABu) -->\r\n    <div sop-metadata-extra class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-indigo-50/15 dark:bg-indigo-955/5 border border-indigo-100/40 dark:border-indigo-950/20 mt-4\">\r\n      <!-- M\u00E3 h\u1ED3 s\u01A1 -->\r\n      <div>\r\n        <label class=\"flex items-center justify-between text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest\">\r\n          <span>1. M\u00E3 h\u1ED3 s\u01A1</span>\r\n          <button type=\"button\"\r\n            (click)=\"autoFillMaHoSo()\"\r\n            [disabled]=\"isReadOnly\"\r\n            class=\"text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors\"\r\n            title=\"T\u1EF1 \u0111\u1ED9ng \u0111i\u1EC1n b\u1EB1ng c\u00E1c m\u1EABu \u0111ang ch\u1ECDn\">\r\n            <i class=\"fa-solid fa-wand-magic-sparkles\"></i>\r\n          </button>\r\n        </label>\r\n        <input type=\"text\"\r\n          [(ngModel)]=\"draft.page1Data['maHoSo']\"\r\n          (ngModelChange)=\"onDataChanged()\"\r\n          [disabled]=\"isReadOnly\"\r\n          placeholder=\"Nh\u1EADp m\u00E3 h\u1ED3 s\u01A1...\"\r\n          class=\"w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm\">\r\n        </div>\r\n\r\n        <!-- H\u1EC7 s\u1ED1 pha lo\u00E3ng -->\r\n        <div>\r\n          <label class=\"block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest\">3. H\u1EC7 s\u1ED1 pha lo\u00E3ng (f)</label>\r\n          <div class=\"flex items-center gap-1.5\">\r\n            <button type=\"button\"\r\n              (click)=\"draft.page1Data['heSoPhaLoang'] = '1'; onDataChanged()\"\r\n              [disabled]=\"isReadOnly\"\r\n                  [class]=\"draft.page1Data['heSoPhaLoang'] === '1' \r\n                    ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95' \r\n                    : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n              title=\"Ch\u1ECDn f=1\">\r\n              f=1\r\n            </button>\r\n            <input type=\"text\"\r\n              [(ngModel)]=\"draft.page1Data['heSoPhaLoang']\"\r\n              (ngModelChange)=\"onDataChanged()\"\r\n              [disabled]=\"isReadOnly\"\r\n              placeholder=\"H\u1EC7 s\u1ED1 f...\"\r\n              class=\"w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm\">\r\n            </div>\r\n          </div>\r\n\r\n          <!-- Lo\u1EA1i m\u1EABu -->\r\n          <div>\r\n            <label class=\"block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest\">4. Lo\u1EA1i m\u1EABu</label>\r\n            <div class=\"flex items-center gap-1.5\">\r\n              <button type=\"button\"\r\n                (click)=\"draft.page1Data['loaiMau'] = 'Th\u1EE7y s\u1EA3n'; onDataChanged()\"\r\n                [disabled]=\"isReadOnly\"\r\n                  [class]=\"draft.page1Data['loaiMau'] === 'Th\u1EE7y s\u1EA3n' || draft.page1Data['loaiMau'] === 'Thu\u1EF7 s\u1EA3n'\r\n                    ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95' \r\n                    : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n                title=\"Ch\u1ECDn Th\u1EE7y s\u1EA3n\">\r\n                Th\u1EE7y S\u1EA3n\r\n              </button>\r\n              <input type=\"text\"\r\n                [(ngModel)]=\"draft.page1Data['loaiMau']\"\r\n                (ngModelChange)=\"onDataChanged()\"\r\n                [disabled]=\"isReadOnly\"\r\n                placeholder=\"Lo\u1EA1i m\u1EABu...\"\r\n                class=\"w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm\">\r\n              </div>\r\n            </div>\r\n\r\n            <!-- T\u00ECnh tr\u1EA1ng m\u1EABu -->\r\n            <div>\r\n              <label class=\"block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest\">5. T\u00ECnh tr\u1EA1ng m\u1EABu</label>\r\n              <div class=\"flex items-center gap-1.5\">\r\n                <button type=\"button\"\r\n                  (click)=\"draft.page1Data['tinhTrangMau'] = 'B\u00ECnh th\u01B0\u1EDDng'; onDataChanged()\"\r\n                  [disabled]=\"isReadOnly\"\r\n                  [class]=\"draft.page1Data['tinhTrangMau'] === 'B\u00ECnh th\u01B0\u1EDDng'\r\n                    ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95' \r\n                    : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'\"\r\n                  title=\"Ch\u1ECDn B\u00ECnh th\u01B0\u1EDDng\">\r\n                  B\u00ECnh Th\u01B0\u1EDDng\r\n                </button>\r\n                <input type=\"text\"\r\n                  [(ngModel)]=\"draft.page1Data['tinhTrangMau']\"\r\n                  (ngModelChange)=\"onDataChanged()\"\r\n                  [disabled]=\"isReadOnly\"\r\n                  placeholder=\"T\u00ECnh tr\u1EA1ng...\"\r\n                  class=\"w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm\">\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </app-sop-header-metadata>\r\n\r\n          <!-- 1.5. Section 7 \u0110\u01B0\u1EDDng chu\u1EA9n -->\r\n          <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in\">\r\n            <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center\">\r\n              <i class=\"fa-solid fa-chart-line mr-2 text-fuchsia-500 text-sm\"></i> 7. Khai B\u00E1o \u0110\u01B0\u1EDDng Chu\u1EA9n\r\n            </h4>\r\n\r\n            <div class=\"grid grid-cols-1 lg:grid-cols-12 gap-6\">\r\n              <div class=\"lg:col-span-5 space-y-3\">\r\n                <div class=\"p-4 bg-indigo-50/15 dark:bg-indigo-955/5 border border-indigo-100/40 dark:border-indigo-950/20 rounded-2xl space-y-3 shadow-xs\">\r\n                  <h5 class=\"text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5\">\r\n                    <i class=\"fa-solid fa-flask-vial\"></i> C\u1EA5u H\u00ECnh M\u1EABu QC & T\u00EAn Tu\u1EF3 Ch\u1EC9nh\r\n                  </h5>\r\n\r\n                  <div class=\"flex flex-col gap-2\">\r\n                    <label class=\"flex items-center gap-2 cursor-pointer py-2 px-3 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 transition select-none shadow-2xs\">\r\n                      <input type=\"checkbox\"\r\n                        [(ngModel)]=\"draft.page1Data['hasCheckSample']\"\r\n                        (ngModelChange)=\"onHasCheckSampleChange()\"\r\n                        [disabled]=\"isReadOnly\"\r\n                        class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900\">\r\n                        <span class=\"text-xs font-bold text-slate-700 dark:text-slate-200\">\u00C1p d\u1EE5ng m\u1EABu CHECK_SAMPLE</span>\r\n                      </label>\r\n                    <label class=\"flex items-center gap-2 cursor-pointer py-2 px-3 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 transition select-none shadow-2xs\">\r\n                      <input type=\"checkbox\"\r\n                        [(ngModel)]=\"draft.page1Data['hasSpikeSample']\"\r\n                        (ngModelChange)=\"onDataChanged()\"\r\n                        [disabled]=\"isReadOnly\"\r\n                        class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900\">\r\n                        <span class=\"text-xs font-bold text-slate-700 dark:text-slate-200\">T\u1EF1 \u0111\u1ED9ng th\u00EAm m\u1EABu th\u00EAm chu\u1EA9n</span>\r\n                      </label>\r\n                    <label class=\"flex items-center gap-2 cursor-pointer py-2 px-3 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 transition select-none shadow-2xs\">\r\n                      <input type=\"checkbox\"\r\n                        [(ngModel)]=\"draft.page1Data['hasSpikeNSample']\"\r\n                        (ngModelChange)=\"onDataChanged()\"\r\n                        [disabled]=\"isReadOnly\"\r\n                        class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900\">\r\n                        <span class=\"text-xs font-bold text-slate-700 dark:text-slate-200\">T\u1EF1 \u0111\u1ED9ng th\u00EAm m\u1EABu th\u00EAm chu\u1EA9n_N</span>\r\n                      </label>\r\n                    <label class=\"flex items-center gap-2 cursor-pointer py-2 px-3 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 transition select-none shadow-2xs\">\r\n                      <input type=\"checkbox\"\r\n                        [(ngModel)]=\"draft.page1Data['hasFinalSample']\"\r\n                        (ngModelChange)=\"onDataChanged()\"\r\n                        [disabled]=\"isReadOnly\"\r\n                        class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900\">\r\n                        <span class=\"text-xs font-bold text-slate-700 dark:text-slate-200\">T\u1EF1 \u0111\u1ED9ng th\u00EAm m\u1EABu ki\u1EC3m tra cu\u1ED1i m\u1EBB</span>\r\n                      </label>\r\n                  </div>\r\n\r\n                    <div class=\"grid grid-cols-2 gap-2.5\">\r\n                      <div>\r\n                        <label class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider\">T\u00EAn m\u1EABu tr\u1EAFng</label>\r\n                        <input type=\"text\"\r\n                          [(ngModel)]=\"draft.page1Data['blankName']\"\r\n                          (ngModelChange)=\"onDataChanged()\"\r\n                          [disabled]=\"isReadOnly\"\r\n                          placeholder=\"BLANK\"\r\n                          class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-xs\">\r\n                        </div>\r\n                        <div>\r\n                          <label class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider\">T\u00EAn m\u1EABu th\u00EAm chu\u1EA9n</label>\r\n                          <input type=\"text\"\r\n                            [(ngModel)]=\"draft.page1Data['spikeName']\"\r\n                            (ngModelChange)=\"onDataChanged()\"\r\n                            [disabled]=\"isReadOnly\"\r\n                            placeholder=\"SPIKE\"\r\n                            class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-xs\">\r\n                          </div>\r\n                        </div>\r\n\r\n                        @if (draft.page1Data['hasCheckSample']) {\r\n                          <div class=\"animate-fade-in\">\r\n                            <label class=\"block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider\">T\u00EAn m\u1EABu ki\u1EC3m tra</label>\r\n                            <input type=\"text\"\r\n                              [(ngModel)]=\"draft.page1Data['checkSampleName']\"\r\n                              (ngModelChange)=\"onDataChanged()\"\r\n                              [disabled]=\"isReadOnly\"\r\n                              placeholder=\"CHECK_SAMPLE\"\r\n                              class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-xs\">\r\n                            </div>\r\n                          }\r\n                        </div>\r\n                      </div>\r\n\r\n                      <!-- Calibration Points Grid -->\r\n                      <div class=\"lg:col-span-7 flex flex-col justify-center\">\r\n                        <app-sop-calibration-points\r\n                          title=\"5 \u0110i\u1EC3m \u0110\u01B0\u1EDDng chu\u1EA9n (Calibration Curve Points)\"\r\n                          [calibPoints]=\"draft.page1Data['calibPoints']\"\r\n                          [pointLabels]=\"['0 ppb', '5 ppb', '10 ppb', '20 ppb', '50 ppb']\"\r\n                          pointPrefix=\"Point C\"\r\n                          suffixText=\"IS: 20 ppb\"\r\n                          [isSuffixVisible]=\"true\"\r\n                          [isFuchsiaRing]=\"true\"\r\n                          [isReadOnly]=\"isReadOnly\"\r\n                          (pointsChanged)=\"onDataChanged()\">\r\n                        </app-sop-calibration-points>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->\r\n                  <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4\">\r\n                    <div class=\"flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5\">\r\n                      <h4 class=\"text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5\">\r\n                        <i class=\"fa-solid fa-table-cells mr-1 text-fuchsia-500 text-sm\"></i> L\u01B0\u1EDBi Nh\u1EADp K\u1EBFt Qu\u1EA3 (SOP-01 Spreadsheet)\r\n                      </h4>\r\n\r\n                      <div class=\"flex flex-wrap items-center gap-3\">\r\n                        <span class=\"text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1\">Thao t\u00E1c nhanh:</span>\r\n\r\n                          <button (click)=\"bulkFillND()\"\r\n                            [disabled]=\"isReadOnly\"\r\n                            class=\"px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\"\r\n                            title=\"\u0110\u1EB7t to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 ch\u01B0a \u0111i\u1EC1n l\u00E0 ND\">\r\n                            <i class=\"fa-solid fa-pen-clip text-amber-500\"></i>\r\n                            <span>\u0110i\u1EC1n ND \u00D4 Tr\u1ED1ng</span>\r\n                          </button>\r\n\r\n                          <button (click)=\"bulkClearAll()\"\r\n                            [disabled]=\"isReadOnly\"\r\n                            class=\"px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-rose-50 dark:hover:bg-rose-955/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs\"\r\n                            title=\"X\u00F3a to\u00E0n b\u1ED9 c\u00E1c \u00F4 k\u1EBFt qu\u1EA3 c\u1EE7a b\u1EA3ng\">\r\n                            <i class=\"fa-solid fa-trash-can text-rose-500\"></i>\r\n                            <span>X\u00F3a H\u1EBFt B\u1EA3ng</span>\r\n                          </button>\r\n\r\n                          <!-- Quick Vial Rack Input for Fipronil -->\r\n                          <div class=\"flex items-center gap-2 bg-indigo-50/15 dark:bg-indigo-955/5 border border-indigo-100/40 dark:border-indigo-950/20 rounded-2xl px-3.5 py-1.5 text-xs shadow-2xs\">\r\n                            <span class=\"font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest\">Nh\u1EADp nhanh s\u1ED1 l\u1ECD:</span>\r\n                            <div class=\"flex items-center gap-1.5\">\r\n                              <span class=\"text-slate-450 dark:text-slate-500 font-bold\">Rack:</span>\r\n                              <input type=\"number\"\r\n                                [(ngModel)]=\"bulkRackStart\"\r\n                                [disabled]=\"isReadOnly\"\r\n                                title=\"Khay ch\u1EA1y m\u00E1y (Rack)\"\r\n                                placeholder=\"Rack\"\r\n                                class=\"w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-inner\">\r\n                              </div>\r\n                              <div class=\"flex items-center gap-1.5\">\r\n                                <span class=\"text-slate-450 dark:text-slate-500 font-bold\">Vial \u0111\u1EA7u:</span>\r\n                                <input type=\"number\"\r\n                                  [(ngModel)]=\"bulkVialStartFip\"\r\n                                  [disabled]=\"isReadOnly\"\r\n                                  title=\"Vial b\u1EAFt \u0111\u1EA7u\"\r\n                                  placeholder=\"Vial\"\r\n                                  class=\"w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-inner\">\r\n                                </div>\r\n                                <div class=\"flex items-center gap-1.5\">\r\n                                  <span class=\"text-slate-450 dark:text-slate-500 font-bold\">Size:</span>\r\n                                  <input type=\"number\"\r\n                                    [(ngModel)]=\"bulkVialsPerRack\"\r\n                                    [disabled]=\"isReadOnly\"\r\n                                    title=\"S\u1ED1 \u1ED1ng vial t\u1ED1i \u0111a tr\u00EAn m\u1ED9t khay (Rack)\"\r\n                                    placeholder=\"T\u1ED1i \u0111a\"\r\n                                    class=\"w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-inner\">\r\n                                  </div>\r\n                                   <button (click)=\"applyBulkVials()\"\r\n                                     [disabled]=\"isReadOnly\"\r\n                                    class=\"px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold transition shadow-sm flex items-center gap-1 active:scale-95\"\r\n                                    title=\"\u0110i\u1EC1n t\u1EF1 \u0111\u1ED9ng s\u1ED1 khay v\u00E0 vial cho to\u00E0n b\u1ED9 danh s\u00E1ch m\u1EABu\">\r\n                                    <i class=\"fa-solid fa-magic text-[10px]\"></i>\r\n                                    <span>\u0110i\u1EC1n Nhanh</span>\r\n                                  </button>\r\n                                </div>\r\n                              </div>\r\n                            </div>\r\n\r\n                            <!-- Spreadsheet Table Grid -->\r\n                            <div class=\"overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[550px] overflow-y-auto\">\r\n                              <table class=\"w-full text-sm border-collapse\">\r\n                                <thead>\r\n                                  <tr class=\"bg-slate-50 dark:bg-slate-955 border-b border-slate-250/80 dark:border-slate-800 sticky top-0 z-20 shadow-2xs\">\r\n                                    <th class=\"py-3 px-3 text-center w-12\">\r\n                                      <input type=\"checkbox\"\r\n                                             [checked]=\"isAllSelected()\"\r\n                                             (change)=\"toggleSelectAll($event)\"\r\n                                             [disabled]=\"isReadOnly\"\r\n                                             title=\"Ch\u1ECDn/B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3 m\u1EABu \u0111\u1EC3 xu\u1EA5t k\u1EBFt qu\u1EA3\"\r\n                                             class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900 cursor-pointer\">\r\n                                    </th>\r\n                                    <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-24\">Vial No.</th>\r\n                                    <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[140px]\">M\u1EABu th\u1EED</th>\r\n\r\n                                    <!-- Dynamic active columns -->\r\n                                    @for (col of activeColumns; track col) {\r\n                                      <th class=\"py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[130px]\">\r\n                                        {{ columnDisplayNames()[col] || col }} (\u00B5g/kg)\r\n                                      </th>\r\n                                    }\r\n\r\n                                    <th class=\"py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-28\">H\u00E0nh \u0111\u1ED9ng</th>\r\n                                  </tr>\r\n                                </thead>\r\n\r\n                                <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800/80\">\r\n                                  @for (row of getDisplayRowsForFipronil(); track row.key; let rowIdx = $index) {\r\n                                    @if (draft.resultData[row.key]) {\r\n              <tr [class]=\"row.isQC \r\n                    ? 'bg-amber-50/15 dark:bg-amber-955/5 border-l-4 border-l-amber-500/80 hover:bg-amber-50/25 dark:hover:bg-amber-955/10 transition-colors' \r\n                    : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 duration-150 ' + (draft.resultData[row.key]['selected'] === false ? 'opacity-60' : '')\">\r\n\r\n                                        <!-- Select Checkbox -->\r\n                                        <td class=\"py-2.5 px-3 text-center\">\r\n                                          @if (!row.isQC) {\r\n                                            <input type=\"checkbox\"\r\n                                                   [(ngModel)]=\"draft.resultData[row.key]['selected']\"\r\n                                                   (ngModelChange)=\"onDataChanged()\"\r\n                                                   [disabled]=\"isReadOnly\"\r\n                                                   title=\"Ch\u1ECDn xu\u1EA5t k\u1EBFt qu\u1EA3 cho m\u1EABu n\u00E0y\"\r\n                                                   class=\"w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900 cursor-pointer\">\r\n                                          } @else {\r\n                                            <input type=\"checkbox\" checked disabled class=\"w-4 h-4 rounded border-slate-300 text-amber-500/50 dark:text-amber-500/30 focus:ring-amber-500 cursor-not-allowed\">\r\n                                          }\r\n                                        </td>\r\n\r\n                                        <!-- Vial No input cell -->\r\n                                        <td class=\"py-1.5 px-3 w-24\">\r\n                                          <input type=\"text\"\r\n                                            [(ngModel)]=\"draft.resultData[row.key]['loSo']\"\r\n                                            (ngModelChange)=\"onDataChanged()\"\r\n                                            [disabled]=\"isReadOnly\"\r\n                                            [id]=\"'cell-' + rowIdx + '-loSo'\"\r\n                                            (keydown)=\"handleGridNavigation($event, rowIdx, 'loSo', 0)\"\r\n                                            (focus)=\"$any($event.target).select()\"\r\n                                            placeholder=\"...\"\r\n                                            class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none text-center shadow-inner\">\r\n                                          </td>\r\n\r\n                                          <!-- Sample/QC Identifier with tag styling -->\r\n                                          <td class=\"py-2.5 px-4 font-mono font-extrabold text-xs text-slate-700 dark:text-slate-300 break-all\">\r\n                                            @if (row.isQC) {\r\n                                              <span class=\"inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400\">\r\n                                                <i class=\"fa-solid fa-flask text-[10px]\"></i> {{ row.label }}\r\n                                              </span>\r\n                                            } @else {\r\n                                              <span>{{ row.label }}</span>\r\n                                            }\r\n                                          </td>\r\n\r\n                                          <!-- Dynamic active columns inputs -->\r\n                                          @for (col of activeColumns; track col; let colIdx = $index) {\r\n                                            <td class=\"py-1.5 px-2\">\r\n                                              <input type=\"text\"\r\n                                                [(ngModel)]=\"draft.resultData[row.key][col]\"\r\n                                                (ngModelChange)=\"onCellChanged(row.key)\"\r\n                                                [id]=\"'cell-' + rowIdx + '-' + col\"\r\n                                                [disabled]=\"isReadOnly || !isTargetAssigned(row.key, col)\"\r\n                                                (keydown)=\"handleGridNavigation($event, rowIdx, col, colIdx + 1)\"\r\n                                                (focus)=\"$any($event.target).select()\"\r\n                                                placeholder=\"...\"\r\n                                                class=\"w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none text-center shadow-inner disabled:bg-slate-105 dark:disabled:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed\">\r\n                                              </td>\r\n                                            }\r\n\r\n                                            <!-- Quick Row actions / Badges -->\r\n                                            <td class=\"py-1.5 px-4 text-center\">\r\n                                              @if (row.isQC) {\r\n                                                <span class=\"inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 dark:bg-amber-400/5 dark:text-amber-400 border border-amber-500/20\">\r\n                                                  QC Active\r\n                                                </span>\r\n                                              } @else {\r\n                                                <button (click)=\"copyRowToAll(row.key)\"\r\n                                                  [disabled]=\"isReadOnly\"\r\n                                                  class=\"p-1.5 bg-slate-50 hover:bg-fuchsia-600 dark:bg-slate-855 dark:hover:bg-fuchsia-600 text-slate-500 hover:text-white dark:text-slate-400 rounded-lg text-[10px] font-bold transition border border-slate-200 dark:border-slate-800 active:scale-90\"\r\n                                                  title=\"Sao ch\u00E9p k\u1EBFt qu\u1EA3 c\u1EE7a d\u00F2ng n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c d\u00F2ng c\u00F2n l\u1EA1i\">\r\n                                                  <i class=\"fa-solid fa-copy\"></i>\r\n                                                </button>\r\n                                              }\r\n                                            </td>\r\n                                          </tr>\r\n                                        }\r\n                                      }\r\n                                    </tbody>\r\n                                  </table>\r\n                                </div>\r\n                              </div>\r\n                            </div>\r\n" }]
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
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Sop01EntryComponent, { className: "Sop01EntryComponent", filePath: "src/app/features/results/sops/sop-01/sop-01-entry.component.ts", lineNumber: 18 }); })();
//# sourceMappingURL=sop-01-entry.component.js.map