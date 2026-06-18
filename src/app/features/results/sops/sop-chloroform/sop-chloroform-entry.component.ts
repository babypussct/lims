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

    // Initialize 6 calibration points for Chloroform if not exists or empty
    if (!this.draft.page1Data['calibPoints'] || this.draft.page1Data['calibPoints'].length === 0) {
      this.draft.page1Data['calibPoints'] = [
        { loSo: '1', hamLuong: '0' },
        { loSo: '2', hamLuong: '2' },
        { loSo: '3', hamLuong: '5' },
        { loSo: '4', hamLuong: '10' },
        { loSo: '5', hamLuong: '20' },
        { loSo: '6', hamLuong: '50' }
      ];
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
        pt['loSo'] = String(start + idx);
      });
      this.syncSpreadsheetVialsFromCalibration();
      this.onDataChanged();
    }
  }

  syncSpreadsheetVialsFromCalibration() {
    const calibPoints = this.draft.page1Data['calibPoints'];
    if (!calibPoints || calibPoints.length < 6) return;
    
    // Lấy lọ số của điểm chuẩn cuối cùng (C5 ở index 5)
    const lastCalibVialStr = calibPoints[5]?.loSo;
    const lastCalibVial = parseInt(String(lastCalibVialStr), 10);
    if (isNaN(lastCalibVial)) return;

    // Cập nhật QC_BLANK
    if (this.draft.resultData['QC_BLANK']) {
      this.draft.resultData['QC_BLANK']['loSo'] = String(lastCalibVial + 1);
    }

    // Cập nhật QC_SPIKE
    if (this.draft.resultData['QC_SPIKE']) {
      this.draft.resultData['QC_SPIKE']['loSo'] = String(lastCalibVial + 2);
    }

    // Cập nhật các mẫu thử thông thường
    const regularSamples = this.getVisibleRegularSamples();
    regularSamples.forEach((sampleCode: string, idx: number) => {
      if (this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode]['loSo'] = String(lastCalibVial + 3 + idx);
      }
    });

    // Cập nhật QC_FINAL (đồng bộ từ QC_SPIKE)
    if (this.draft.resultData['QC_FINAL']) {
      this.draft.resultData['QC_FINAL']['loSo'] = String(lastCalibVial + 2);
    }

    // Cập nhật bulkVialStart và bulkVialEnd để đồng bộ
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
    const end = parseInt(String(this.bulkVialEnd), 10);
    if (isNaN(start) || isNaN(end) || start > end) {
      return;
    }
    const visible = this.getVisibleRegularSamples();
    visible.forEach((sample: string, idx: number) => {
      const val = start + idx;
      if (val <= end) {
        if (!this.draft.resultData[sample]) {
          this.draft.resultData[sample] = { selected: true };
        }
        this.draft.resultData[sample]['loSo'] = String(val);
      }
    });
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
