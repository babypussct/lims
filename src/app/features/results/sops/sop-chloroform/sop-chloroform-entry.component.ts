import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName } from '../../shared/compound-id-resolver';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { bulkFillND, bulkClearAll, copyRowToAll, navigateGrid } from '../shared/sop-grid-helper';

@Component({
  selector: 'app-sop-chloroform-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-chloroform-entry.component.html'
})
export class SopChloroformEntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Input() publishedSampleSet: Set<string> | null = null;
  @Input() activeFilter: string = 'ALL';
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private masterTargetService = inject(MasterTargetService);
  masterTargets = signal<any[]>([]);
  columnDisplayNames = signal<Record<string, string>>({});
  activeColumns: string[] = [];

  bulkVialStart = 1;
  bulkVialEnd = 1;
  bulkCalibVialStart = 1;
  bulkCalibVialEnd = 6;
  bulkDefaultKhoiLuong = '5.00';
  bulkDefaultF = '1';

  async ngOnInit() {
    try {
      const analytes = await this.masterTargetService.getAll();
      this.masterTargets.set(analytes);
    } catch (e) {
      console.warn('Failed to load master analytes', e);
    }

    const cols = Object.keys(this.config.columns || {});
    this.activeColumns = cols.filter((c: string) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
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
    } else {
      // Migration dữ liệu cũ: loSo là số → chuyển sang vialNo, đặt tên điểm đúng
      existingCalibPoints.forEach((pt: any, idx: number) => {
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
    this.getVisibleRegularSamples().forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {
          loSo: '',
          selected: true,
          khoiLuong: '5.00',
          heSoPhaLoang: '1'
        };
        hasChanges = true;
      } else {
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
    } else {
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
    } else {
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
    if (isNaN(start)) return;
    const calibPoints = this.draft.page1Data['calibPoints'];
    if (calibPoints && calibPoints.length > 0) {
      calibPoints.forEach((pt: any, idx: number) => {
        pt['vialNo'] = String(start + idx); // Điền số vial, giữ nguyên tên điểm loSo
      });
      this.syncSpreadsheetVialsFromCalibration();
      this.onDataChanged();
    }
  }

  syncSpreadsheetVialsFromCalibration() {
    const calibPoints = this.draft.page1Data['calibPoints'];
    if (!calibPoints || calibPoints.length < 6) return;

    // Đọc số vial từ vialNo (đúng). Fallback loSo nếu là số (dữ liệu cũ)
    const lastPt = calibPoints[5];
    const lastVialStr = lastPt?.vialNo || ((/^\d+$/.test(String(lastPt?.loSo || ''))) ? lastPt?.loSo : undefined);
    const lastCalibVial = parseInt(String(lastVialStr), 10);
    if (isNaN(lastCalibVial)) return;

    if (this.draft.resultData['QC_BLANK']) {
      this.draft.resultData['QC_BLANK']['loSo'] = String(lastCalibVial + 1);
    }
    if (this.draft.resultData['QC_SPIKE']) {
      this.draft.resultData['QC_SPIKE']['loSo'] = String(lastCalibVial + 2);
    }

    const regularSamples = this.getVisibleRegularSamples();
    regularSamples.forEach((sampleCode: string, idx: number) => {
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

  updateChloroformRecovery(key: string) {
    const row = this.draft.resultData[key];
    if (!row) return;
    const val = parseFloat(row['kqChloroform'] || '');
    if (!isNaN(val)) {
      const loaiMau = this.draft.page1Data['loai_mau'] || this.run?.inputs?.['loai_mau'] || 'Thực phẩm';
      const spikeTheoretical = loaiMau === 'Nước sạch' ? 10.0 : 5.0;
      const rec = ((val / spikeTheoretical) * 100).toFixed(1);
      row['ghiChu'] = `${rec}%`;
    } else {
      row['ghiChu'] = '';
    }
  }

  getVisibleRegularSamples(): string[] {
    return this.run.sampleList || [];
  }

  isAllSelected(): boolean {
    const visible = this.getVisibleRegularSamples();
    if (visible.length === 0) return false;
    return visible.every((s: string) => this.draft.resultData[s]?.['selected'] !== false);
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    const visible = this.getVisibleRegularSamples();
    visible.forEach((s: string) => {
      if (!this.draft.resultData[s]) {
        this.draft.resultData[s] = {};
      }
      this.draft.resultData[s]['selected'] = checked;
    });
    this.onDataChanged();
  }

  applyBulkVials() {
    const start = parseInt(String(this.bulkVialStart), 10);
    if (isNaN(start)) return;
    const visible = this.getVisibleRegularSamples();
    visible.forEach((sample: string, idx: number) => {
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
    visible.forEach((sample: string) => {
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

  getColumnLabel(colKey: string): string {
    if (colKey === 'khoiLuong') return 'Khối lượng / Thể tích';
    if (colKey === 'heSoPhaLoang') return 'Hệ số pha loãng F';
    if (colKey === 'kqChloroform') return 'Chloroform (ppb)';
    return colKey;
  }

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets(), this.config?.id || this.run?.sopId);
  }

  buildColumnDisplayNames() {
    const map: Record<string, string> = {};
    for (const col of this.activeColumns) {
      map[col] = this.getColumnLabel(col);
    }
    this.columnDisplayNames.set(map);
  }

  onCellChanged(key: string) {
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
    } else {
      delete this.draft.resultData['QC_FINAL'];
    }
    this.onDataChanged();
  }

  onDataChanged() {
    if (this.draft.resultData['QC_SPIKE'] && this.draft.resultData['QC_FINAL']) {
      this.draft.resultData['QC_FINAL']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || '';
      this.draft.resultData['QC_FINAL']['khoiLuong'] = this.draft.resultData['QC_SPIKE']['khoiLuong'] || '';
      this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] || '';
    }
    this.updateChloroformRecovery('QC_SPIKE');
    this.updateChloroformRecovery('QC_FINAL');
    this.draftChanged.emit(this.draft);
  }

  getDisplayRows(): any[] {
    const list: any[] = [];
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

    this.getVisibleRegularSamples().forEach((sampleCode: string) => {
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
    displayRows.forEach((row: any) => {
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
    displayRows.forEach((row: any) => {
      const rowData = this.draft.resultData[row.key];
      if (rowData) {
        this.activeColumns.forEach((col: string) => {
          rowData[col] = '';
        });
        rowData['ghiChu'] = '';
      }
    });
    this.onDataChanged();
  }

  copyRowToAll(sourceKey: string) {
    copyRowToAll(this.draft.resultData, this.run.sampleList, this.activeColumns, sourceKey);
    this.onDataChanged();
  }

  handleGridNavigation(event: KeyboardEvent, rowIdx: number, colName: string, colIdx: number) {
    const columnsList = ['selected', 'loSo', ...this.activeColumns, 'ghiChu'];
    const rows = this.getDisplayRows();
    navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 1);
  }
}
