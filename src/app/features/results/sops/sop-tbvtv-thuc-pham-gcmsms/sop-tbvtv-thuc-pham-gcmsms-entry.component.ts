import { Component, signal, computed, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractSopEntry } from '../shared/abstract-sop-entry';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { calculateSop01Recovery } from '../sop-01/sop-01-engine';
import { parseMassHunterWorkbook } from '../shared/mass-hunter-parser';
import { navigateGrid } from '../shared/sop-grid-helper';
import { SOP01_COLUMN_TO_CANONICAL, getSop01DisplayName } from '../../shared/compound-id-resolver';
import { ProgressService } from '../../../../core/services/progress.service';
import { ReportService } from '../../../../core/services/report.service';
import { ToastService } from '../../../../core/services/toast.service';

const SOP914_FULL_TEMPLATE_DOC_ID = '1b-bv_9mAxnTNWz2ve0n0OeBj4UrhCB5X3DHXsG5EOc4';
const SOP914_SHORT_TEMPLATE_DOC_ID = '1a-6dDufswdWaOJ2oqtzZD4j6ncj5EEvtbi8xo3019K4';
const SOP914_FULL_TEMPLATE_URL = `https://docs.google.com/document/d/${SOP914_FULL_TEMPLATE_DOC_ID}/edit`;
const SOP914_SHORT_TEMPLATE_URL = `https://docs.google.com/document/d/${SOP914_SHORT_TEMPLATE_DOC_ID}/edit`;

@Component({
  selector: 'app-sop-tbvtv-thuc-pham-gcmsms-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-tbvtv-thuc-pham-gcmsms-entry.component.html'
})
export class SopTbvtvThucPhamGcmsmsEntryComponent extends AbstractSopEntry implements OnChanges {

  private progressService = inject(ProgressService);
  private reportService = inject(ReportService);
  private toast = inject(ToastService);

  // ── UI State đặc thù của SOP TBVTV Thực Phẩm ────────────────────────────
  activeTab = signal<'compounds' | 'chromatography'>('compounds');
  searchQuery = signal<string>('');

  // Các thuộc tính cho Form Rút Gọn (Grid Spreadsheet)
  bulkRackStart = 1;
  bulkVialStartFip = 10;
  bulkVialsPerRack = 54;
  decimalPlaces = 2;
  columnDisplayNames = signal<Record<string, string>>({});

  readonly activeColumns = [
    'kqFip',
    'kqFipDesl',
    'kqFipSulf',
    'kqFipSulf2',
    'kqClp',
    'kqClpMe',
    'kqClpMeDes'
  ];
  readonly shortFormColumns = this.activeColumns;

  filteredCompounds = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const compounds: string[] = this.config?.compounds || [];
    if (!q) return compounds;
    return compounds.filter((c: string) => {
      const displayName = (this.compoundDisplayNames()[c] || c).toLowerCase();
      return c.toLowerCase().includes(q) || displayName.includes(q);
    });
  });

  // ── SOP-specific initialization ───────────────────────────────────────────
  protected override onSopSpecificInit() {
    this.checkboxList = [
      { key: 'qcKiemTraNoiBo', label: 'Mẫu kiểm tra nội bộ' },
      { key: 'qcThoiGianLuu', label: 'Độ lệch thời gian lưu' },
      { key: 'qcNhanDangMauNhiem', label: 'Các yêu cầu về nhận dạng khi phát hiện mẫu nhiễm' },
      { key: 'qcNhanDangSpike', label: 'Các yêu cầu về nhận dạng của mẫu thêm chuẩn tại 5ppb' },
      { key: 'qcThuHoiIS', label: 'Độ thu hồi IS' },
      { key: 'qcDanhGiaChung', label: 'Đánh giá chung' }
    ];

    // TBVTV Thực Phẩm dùng 5 điểm chuẩn (C0-C4)
    this.initCalibrationPoints(5);
    this.initActiveCompound();
    this.buildColumnDisplayNames();

    // Thay đổi printFormType default thành formDayDu
    const currentPrintFormType = this.draft.page1Data['printFormType'];
    if (!currentPrintFormType || currentPrintFormType === 'formCheck' || currentPrintFormType === 'formDon') {
      this.draft.page1Data['printFormType'] = 'formDayDu';
    }
    this.applyTemplateMetadata(this.draft.page1Data['printFormType']);

    // Khởi tạo trạng thái checkbox m = 10.0 g mặc định là true cho form đầy đủ
    if (this.draft.page1Data['is10gChecked'] === undefined) {
      this.draft.page1Data['is10gChecked'] = true;
    }
    if (!this.draft.page1Data['khoiLuong']) {
      this.draft.page1Data['khoiLuong'] = '10.0';
    }

    // Khởi tạo các trường dùng cho form rút gọn dạng Spreadsheet
    if (this.draft.page1Data['maHoSo'] === undefined) this.draft.page1Data['maHoSo'] = '';
    if (this.draft.page1Data['heSoPhaLoang'] === undefined) this.draft.page1Data['heSoPhaLoang'] = '1';
    if (this.draft.page1Data['hasCheckSample'] === undefined) this.draft.page1Data['hasCheckSample'] = false;
    if (this.draft.page1Data['uploadMassHunterToDrive'] === undefined) this.draft.page1Data['uploadMassHunterToDrive'] = true;
    if (this.draft.page1Data['checkSampleName'] === undefined) this.draft.page1Data['checkSampleName'] = 'CHECK_SAMPLE';

    if (!this.draft.page1Data['loaiMau']) {
      this.draft.page1Data['loaiMau'] = 'Thủy sản';
    }
    if (!this.draft.page1Data['tinhTrangMau']) {
      this.draft.page1Data['tinhTrangMau'] = 'Bình thường';
    }

    const qcKeys = [
      'qcThoiGianLuu',
      'qcNhanDangMauNhiem',
      'qcNhanDangSpike',
      'qcThuHoiIS',
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

    (this.run?.sampleList || []).forEach((sampleCode: string, idx: number) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {};
      }
      const sRes = this.draft.resultData[sampleCode];
      if (!sRes['khoiLuong']) {
        sRes['khoiLuong'] = '10.0';
      }
      // Mặc định điền Vial bắt đầu từ 1.10 cho Form Rút Gọn
      if (sRes['loSo'] === undefined || sRes['loSo'] === '') {
        const currentVial = 10 + idx;
        const rack = 1 + Math.floor((currentVial - 1) / 54);
        const vial = ((currentVial - 1) % 54) + 1;
        sRes['loSo'] = `${rack}.${vial}`;
      }
      if (sRes['selected'] === undefined) {
        sRes['selected'] = true;
      }
    });

    this.migrateLegacyShortFormColumns();
    this.ensureQcRows();
    this.prefillShortFormUnassignedTargets();
  }

  override buildDisplayNameMap() {
    super.buildDisplayNameMap();
    this.buildColumnDisplayNames();
  }

  private applyTemplateMetadata(type: 'formDayDu' | 'formRutGon' | string) {
    const isShort = type === 'formRutGon';
    this.draft.page1Data['templateDocId'] = isShort ? SOP914_SHORT_TEMPLATE_DOC_ID : SOP914_FULL_TEMPLATE_DOC_ID;
    this.draft.page1Data['templateDocUrl'] = isShort ? SOP914_SHORT_TEMPLATE_URL : SOP914_FULL_TEMPLATE_URL;
    this.draft.page1Data['reportFormLabel'] = isShort ? 'FORM RÚT GỌN' : 'FORM ĐẦY ĐỦ';
  }

  private ensureQcRows() {
    this.ensureQcRow('QC_BLANK', '1.7');
    this.ensureQcRow('QC_SPIKE', '1.8');
    if (this.draft.page1Data['hasCheckSample']) {
      if (!this.draft.resultData['QC_CHECK_SAMPLE'] && this.draft.resultData['QC_CHECK']) {
        this.draft.resultData['QC_CHECK_SAMPLE'] = this.draft.resultData['QC_CHECK'];
      }
      this.ensureQcRow('QC_CHECK_SAMPLE', '1.9');
    }
    this.ensureQcRow('QC_FINAL', '1.8');
  }

  private ensureQcRow(key: string, defaultLoSo: string) {
    if (!this.draft.resultData[key]) {
      this.draft.resultData[key] = {};
    }
    const row = this.draft.resultData[key];
    if (row['loSo'] === undefined || row['loSo'] === '') row['loSo'] = defaultLoSo;
    if (row['selected'] === undefined) row['selected'] = true;
    if (!row['khoiLuong']) row['khoiLuong'] = '10.0';
    if (!row['heSoPhaLoang']) row['heSoPhaLoang'] = '1';
    if (!row['hSoPhaLoang']) row['hSoPhaLoang'] = '1';
  }

  // ── Override: mass default (10.0g) ───────────────────────────────────────
  override on10gCheckChange(event: any) {
    this.draft.page1Data['is10gChecked'] = event.target.checked;
    if (this.draft.page1Data['is10gChecked']) {
      this.draft.page1Data['khoiLuongKhac'] = '';
      this.draft.page1Data['khoiLuong'] = '10.0';
    } else {
      this.draft.page1Data['khoiLuong'] = this.draft.page1Data['khoiLuongKhac'] || '';
    }
    this.onDataChanged();
  }

  override onKhoiLuongKhacChange() {
    if (this.draft.page1Data['khoiLuongKhac']) {
      this.draft.page1Data['is10gChecked'] = false;
      this.draft.page1Data['khoiLuong'] = this.draft.page1Data['khoiLuongKhac'];
    } else {
      this.draft.page1Data['is10gChecked'] = true;
      this.draft.page1Data['khoiLuong'] = '10.0';
    }
    this.onDataChanged();
  }

  override bulkRandomizeMasses() {
    (this.run?.sampleList || []).forEach((sampleCode: string) => {
      if (this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode]['khoiLuong'] = (10.0 + (Math.random() - 0.5) * 0.2).toFixed(2);
      }
    });
    if (this.draft.resultData['QC_SPIKE']) {
      this.draft.resultData['QC_SPIKE']['khoiLuong'] = (10.0 + (Math.random() - 0.5) * 0.2).toFixed(2);
    }
    this.onDataChanged();
  }

  // ── Override: View Mode Switcher ─────────────────────────────────────────
  setPrintFormMode(type: 'formDayDu' | 'formRutGon') {
    this.draft.page1Data['printFormType'] = type;
    this.applyTemplateMetadata(type);
    if (type === 'formRutGon') {
      this.migrateLegacyShortFormColumns();
      this.ensureQcRows();
      this.prefillShortFormUnassignedTargets();
    }
    this.onDataChanged();
  }

  protected override onSetPrintFormType(_type: 'formCheck' | 'formDon') {
    // Bắt buộc override từ abstract
  }

  // ── SPREADSHEET (FORM RÚT GỌN, SPREADSHEET UI/DATA) METHODS ──────────────────

  onHasCheckSampleChange() {
    if (this.draft.page1Data['hasCheckSample']) {
      this.ensureQcRow('QC_CHECK_SAMPLE', '1.9');
      this.draft.page1Data['qcKiemTraNoiBo'] = true;
    } else {
      this.draft.page1Data['qcKiemTraNoiBo'] = null;
    }
    this.onDataChanged();
  }

  formatColumnName(colKey: string): string {
    return getSop01DisplayName(colKey, this.masterTargets());
  }

  buildColumnDisplayNames() {
    const map: Record<string, string> = {};
    for (const col of this.activeColumns) {
      map[col] = this.formatColumnName(col);
    }
    this.columnDisplayNames.set(map);
  }

  override isTargetAssigned(sampleCode: string, compoundOrCol: string): boolean {
    if (SOP01_COLUMN_TO_CANONICAL[compoundOrCol]) {
      if (sampleCode.startsWith('QC_')) {
        return this.isTargetAssignedToAnySample(compoundOrCol);
      }
      if (!this.run) return true;
      const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
      if (!targetMap) return true;

      const matchKey = Object.keys(targetMap).find(k => k.toLowerCase().trim() === sampleCode.toLowerCase().trim());
      const assigned: string[] | null = matchKey ? targetMap[matchKey] : null;
      if (!assigned || assigned.length === 0) return true;

      const canonicalId = SOP01_COLUMN_TO_CANONICAL[compoundOrCol];
      if (assigned.includes(canonicalId)) return true;
      return assigned.some(tid => tid.toLowerCase() === canonicalId.toLowerCase());
    }

    return super.isTargetAssigned(sampleCode, compoundOrCol);
  }

  isTargetAssignedToAnySample(col: string): boolean {
    if (!this.run) return true;
    const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
    if (!targetMap) return true;
    const sampleList = this.run.sampleList || [];
    if (sampleList.length === 0) return true;

    const canonicalId = SOP01_COLUMN_TO_CANONICAL[col];
    return sampleList.some((sampleCode: string) => {
      const matchKey = Object.keys(targetMap).find(k => k.toLowerCase().trim() === sampleCode.toLowerCase().trim());
      const assigned: string[] | null = matchKey ? targetMap[matchKey] : null;
      if (!assigned || assigned.length === 0) return true;

      if (canonicalId) {
        if (assigned.includes(canonicalId)) return true;
        return assigned.some(tid => tid.toLowerCase() === canonicalId.toLowerCase());
      }
      return assigned.some(tid => tid.toLowerCase() === col.toLowerCase());
    });
  }

  override prefillUnassignedTargets() {
    super.prefillUnassignedTargets();
    this.prefillShortFormUnassignedTargets();
  }

  private prefillShortFormUnassignedTargets() {
    const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
    if (!this.run || !targetMap) return;

    const allRowKeys = this.getDisplayRowsForSpreadsheet().map(row => row.key);
    let changed = false;

    allRowKeys.forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {};
      }
      const row = this.draft.resultData[sampleCode];
      this.activeColumns.forEach((c: string) => {
        if (!this.isTargetAssigned(sampleCode, c) && row[c] !== 'N/A') {
          row[c] = 'N/A';
          changed = true;
        }
      });
    });

    if (changed) {
      this.onDataChanged();
    }
  }

  private migrateLegacyShortFormColumns() {
    const legacyToSop01: Record<string, string> = {
      fipronil: 'kqFip',
      fipronil_desulfinyl: 'kqFipDesl',
      fipronil_sulfide: 'kqFipSulf',
      fipronil_sulfone: 'kqFipSulf2',
      chlorpyrifos: 'kqClp',
      chlorpyrifos_methyl: 'kqClpMe',
      chlorpyrifos_methyl_desmethyl: 'kqClpMeDes'
    };

    Object.values(this.draft.resultData || {}).forEach((row: any) => {
      if (!row || typeof row !== 'object') return;
      Object.entries(legacyToSop01).forEach(([legacyKey, sop01Key]) => {
        if ((row[sop01Key] === undefined || row[sop01Key] === '') && row[legacyKey] !== undefined && row[legacyKey] !== '') {
          row[sop01Key] = row[legacyKey];
        }
      });
    });
  }

  onCellChanged(sampleCode: string) {
    this.updateRecovery(sampleCode);
    this.onDataChanged();
  }

  override updateRecovery(sampleCode: string) {
    const row = this.draft.resultData[sampleCode];
    if (!row) return;
    row['ghiChu'] = calculateSop01Recovery(row, sampleCode);
  }

  getSpikeNKey(n: number): string {
    return `QC_SPIKE_${n}`;
  }

  getDisplayRowsForSpreadsheet(): any[] {
    const list: any[] = [];
    const blankName = this.draft.page1Data['blankName'] || 'BLANK';
    const spikeName = this.draft.page1Data['spikeName'] || 'SPIKE';
    const checkSampleName = this.draft.page1Data['checkSampleName'] || 'CHECK_SAMPLE';

    const ensureKey = (key: string, defaultVial: string) => {
      if (!this.draft.resultData[key]) {
        this.draft.resultData[key] = {
          loSo: defaultVial,
          selected: true
        };
      }
      if (!this.draft.resultData[key]['loSo']) {
        this.draft.resultData[key]['loSo'] = defaultVial;
      }
    };

    ensureKey('QC_BLANK', '1.7');
    this.activeColumns.forEach(col => {
      if (this.draft.resultData['QC_BLANK'][col] === undefined || this.draft.resultData['QC_BLANK'][col] === '') {
        this.draft.resultData['QC_BLANK'][col] = 'ND';
      }
    });

    list.push({
      key: 'QC_BLANK',
      type: 'QC_BLANK',
      label: blankName,
      isQC: true
    });

    ensureKey('QC_SPIKE', '1.8');
    list.push({
      key: 'QC_SPIKE',
      type: 'QC_SPIKE',
      label: spikeName,
      isQC: true
    });

    if (this.draft.page1Data['hasCheckSample']) {
      ensureKey('QC_CHECK_SAMPLE', '1.9');
      list.push({
        key: 'QC_CHECK_SAMPLE',
        type: 'QC_CHECK_SAMPLE',
        label: checkSampleName,
        isQC: true
      });
    }

    let regularCount = 0;
    (this.run.sampleList || []).forEach((sampleCode: string) => {
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
        if (!isLastSample) {
          const n = regularCount / 10;
          const spikeNKey = this.getSpikeNKey(n);
          const spikeVial = this.draft.resultData['QC_SPIKE']?.['loSo'] || '1.8';
          if (!this.draft.resultData[spikeNKey]) {
            this.draft.resultData[spikeNKey] = {
              loSo: spikeVial,
              selected: true
            };
          } else {
            this.draft.resultData[spikeNKey]['loSo'] = spikeVial;
          }
          list.push({
            key: spikeNKey,
            type: 'QC_SPIKE_N',
            label: `SP_${n}`,
            isQC: true,
            n
          });
        }
      }
    });

    ensureKey('QC_FINAL', '1.8');
    list.push({
      key: 'QC_FINAL',
      type: 'QC_FINAL',
      label: 'FINAL',
      isQC: true
    });

    return list;
  }

  getDisplayRows() {
    return this.getDisplayRowsForSpreadsheet();
  }



  override applyBulkVials() {
    const rackStart = parseInt(String(this.bulkRackStart), 10);
    const vialStart = parseInt(String(this.bulkVialStartFip), 10);
    const perRack = parseInt(String(this.bulkVialsPerRack), 10);

    if (isNaN(rackStart) || isNaN(vialStart) || isNaN(perRack) || perRack <= 0) {
      return;
    }

    const visible = this.run.sampleList || [];
    let currentRack = rackStart;
    let currentVial = vialStart;

    visible.forEach((sample: string) => {
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

  bulkFillND() {
    const allRowKeys = this.getDisplayRowsForSpreadsheet().map(row => row.key);

    allRowKeys.forEach((key: string) => {
      const row = this.draft.resultData[key];
      if (row) {
        this.activeColumns.forEach((col: string) => {
          if (!this.isTargetAssigned(key, col)) {
            row[col] = 'N/A';
          } else {
            const val = row[col];
            if (val === undefined || val === null || val.toString().trim() === '') {
              row[col] = 'ND';
            }
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
    const allRowKeys = this.getDisplayRowsForSpreadsheet().map(row => row.key);
    allRowKeys.forEach((key: string) => {
      const row = this.draft.resultData[key];
      if (row) {
        this.activeColumns.forEach((col: string) => {
          row[col] = this.isTargetAssigned(key, col) ? '' : 'N/A';
        });
        row['ghiChu'] = '';
      }
    });
    this.onDataChanged();
  }

  copyRowToAll(sourceKey: string) {
    const sourceData = this.draft.resultData[sourceKey];
    if (!sourceData) return;

    const sampleList = this.run.sampleList || [];
    sampleList.forEach((targetKey: string) => {
      if (targetKey !== sourceKey) {
        if (!this.draft.resultData[targetKey]) {
          this.draft.resultData[targetKey] = { selected: true };
        }
        const destRow = this.draft.resultData[targetKey];
        this.activeColumns.forEach((col: string) => {
          if (!this.isTargetAssigned(targetKey, col)) {
            destRow[col] = 'N/A';
          } else {
            const sourceValue = this.isTargetAssigned(sourceKey, col) ? sourceData[col] : '';
            destRow[col] = (sourceValue === 'N/A' && this.isTargetAssigned(targetKey, col)) ? '' : (sourceValue || '');
          }
        });
        this.updateRecovery(targetKey);
      }
    });
    this.onDataChanged();
  }

  handleGridNavigation(event: KeyboardEvent, rowIdx: number, _colName: string, colIdx: number) {
    const columnsList = ['loSo', ...this.activeColumns];
    const rows = this.getDisplayRowsForSpreadsheet();
    navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 0);
  }

  async importMassHunterExcel(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    const XLSX = await import('xlsx');
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: false });

        const sheetMap: Record<string, string> = {
          'fipron': 'kqFip',
          'fipronil': 'kqFip',
          'fipronildesulfinyl': 'kqFipDesl',
          'fipronil_desulfinyl': 'kqFipDesl',
          'fipronilsulfide': 'kqFipSulf',
          'fipronil_sulfide': 'kqFipSulf',
          'fipronilsulfone': 'kqFipSulf2',
          'fipronil_solid': 'kqFipSulf',
          'fipronil_sulfone': 'kqFipSulf2',
          'chlorpyrifos': 'kqClp',
          'chlorpyrifosmethyl': 'kqClpMe',
          'chlorpyrifos_methyl': 'kqClpMe',
          'chlorpyriphos-methyl-desmethyl': 'kqClpMeDes',
          'chlorpyrifos_methyl_desmethyl': 'kqClpMeDes'
        };

        const displayRows = this.getDisplayRowsForSpreadsheet();
        const checkSampleName = this.draft.page1Data['checkSampleName'] || 'CHECK_SAMPLE';

        const { r2Values } = parseMassHunterWorkbook(
          XLSX,
          workbook,
          displayRows,
          this.draft.resultData,
          this.decimalPlaces,
          checkSampleName,
          sheetMap,
          (key) => this.updateRecovery(key)
        );

        if (r2Values.length > 0) {
          const allR2Ok = r2Values.every(v => v >= 0.99);
          this.draft.page1Data['qcR2'] = allR2Ok;
        }

        const spikeRow = this.draft.resultData['QC_SPIKE'];
        if (spikeRow && spikeRow['kqFip'] !== undefined && spikeRow['kqFip'] !== '') {
          const fipVal = parseFloat(String(spikeRow['kqFip']));
          if (!isNaN(fipVal)) {
            const recovery = (fipVal / 5) * 100;
            this.draft.page1Data['qcThuHoi'] = recovery >= 70 && recovery <= 120;
          }
        }

        this.onDataChanged();

        if (this.draft.page1Data['uploadMassHunterToDrive'] !== false) {
          const readerForUpload = new FileReader();
          readerForUpload.onload = async (uploadEvent: any) => {
            const base64String = uploadEvent.target.result;

            this.progressService.start(
              'Đang lưu tệp Excel gốc',
              'Đang kết nối và truyền dữ liệu nhị phân gốc sang Google Drive...',
              100
            );
            this.progressService.update(30, 'Đang gửi yêu cầu ghi tệp...');

            try {
              this.progressService.update(60, 'Đang ghi tệp gốc vào thư mục Google Drive...');
              const batchCode = this.run?.inputs?.['batchCode'] || this.run?.id || new Date().toISOString().split('T')[0];
              const sopId = this.draft.sopId;
              const vSuffix = this.draft.version ? `_v${this.draft.version}` : '';
              const ext = file.name.substring(file.name.lastIndexOf('.'));
              const normalizedFileName = `RAW_${sopId}_${batchCode}${vSuffix}${ext}`;

              const uploadRes = await this.reportService.uploadExcelToDrive(
                this.draft.requestId,
                normalizedFileName,
                base64String,
                this.draft.sopId
              );

              if (uploadRes.success && uploadRes.fileUrl) {
                this.progressService.update(90, 'Liên kết tệp nguồn với mẻ chạy...');
                this.draft.page1Data['massHunterExcelUrl'] = uploadRes.fileUrl;
                this.draft.page1Data['massHunterExcelName'] = normalizedFileName;
                this.onDataChanged();

                this.progressService.complete();
                this.toast.show('Nhập dữ liệu thành công và đã tải tệp Excel MassHunter gốc lên Google Drive!', 'success');
              } else {
                throw new Error(uploadRes.error || 'Lỗi không thể tạo file trên Drive.');
              }
            } catch (err: any) {
              this.progressService.stop();
              console.error('Lỗi upload Excel lên Drive:', err);
              this.toast.show('Đã nhập số liệu thành công nhưng không thể tải tệp Excel gốc lên Google Drive: ' + err.message, 'error');
            }
          };

          readerForUpload.readAsDataURL(file);
        } else {
          this.toast.show('Nhập số liệu thành công! (Không tải tệp lên Google Drive)', 'success');
        }

      } catch (err: any) {
        console.error('Lỗi khi đọc file Excel MassHunter:', err);
        this.toast.show('Có lỗi xảy ra khi đọc tệp Excel: ' + err.message, 'error');
      }
    };

    reader.readAsArrayBuffer(file);
    input.value = '';
  }
}
