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
  selector: 'app-sop-1767857760184-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-1767857760184-entry.component.html'
})
export class Sop1767857760184EntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Input() activeFilter: string = 'ALL';
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private masterTargetService = inject(MasterTargetService);
  masterTargets = signal<any[]>([]);
  columnDisplayNames = signal<Record<string, string>>({});
  activeColumns: string[] = [];

  // Bulk vial properties
  bulkVialStart = 1;
  bulkVialEnd = 1;

  getStats() {
    const regularSamples = this.getVisibleRegularSamples();
    const totalCount = regularSamples.length;
    const selectedCount = regularSamples.filter((s: string) => this.draft.resultData[s]?.['selected'] !== false).length;
    
    // Fill progress (leaving blank means ND, which is a completed result)
    let filledCount = 0;
    regularSamples.forEach((s: string) => {
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

    // Ensure dichlorvosMethod is initialized
    if (!this.draft.page1Data['dichlorvosMethod']) {
      this.draft.page1Data['dichlorvosMethod'] = 'GC/MS';
      this.draft.page1Data['calibPoints'] = [
        { loSo: '51', hamLuong: '0' },
        { loSo: '52', hamLuong: '5' },
        { loSo: '53', hamLuong: '10' },
        { loSo: '54', hamLuong: '20' },
        { loSo: '55', hamLuong: '30' },
        { loSo: '56', hamLuong: '40' }
      ];
      this.bulkVialStart = 1;
    } else {
      // Set bulk start based on current method if not set
      if (this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS') {
        this.bulkVialStart = 9;
      } else {
        this.bulkVialStart = 1;
      }
    }

    // Auto fill defaults for existing samples if they are empty
    let hasChanges = false;
    this.getVisibleRegularSamples().forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        const randW = (10.01 + Math.random() * 0.09).toFixed(2);
        this.draft.resultData[sampleCode] = {
          loSo: '',
          selected: true,
          khoiLuong: randW,
          heSoPhaLoang: '1'
        };
        hasChanges = true;
      } else {
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
    qcKeys.forEach((key: string) => {
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
      } else {
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

    this.onBulkVialStartChange();
  }

  onBulkVialStartChange() {
    const start = parseInt(String(this.bulkVialStart), 10);
    if (!isNaN(start)) {
      const count = this.getVisibleRegularSamples().length;
      this.bulkVialEnd = start + Math.max(0, count - 1);
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

  setMethod(method: 'GC/MS' | 'GC/MSMS') {
    if (this.draft.page1Data['dichlorvosMethod'] === method) return;
    this.draft.page1Data['dichlorvosMethod'] = method;
    
    // Switch default configurations
    if (method === 'GC/MS') {
      this.draft.page1Data['calibPoints'] = [
        { loSo: '51', hamLuong: '0' },
        { loSo: '52', hamLuong: '5' },
        { loSo: '53', hamLuong: '10' },
        { loSo: '54', hamLuong: '20' },
        { loSo: '55', hamLuong: '30' },
        { loSo: '56', hamLuong: '40' }
      ];
      this.bulkVialStart = 1;
      
      // Update vials for QC rows directly in resultData
      if (this.draft.resultData['QC_BLANK']) this.draft.resultData['QC_BLANK']['loSo'] = '57';
      if (this.draft.resultData['QC_SPIKE']) this.draft.resultData['QC_SPIKE']['loSo'] = '58';
      if (this.draft.resultData['QC_FINAL']) this.draft.resultData['QC_FINAL']['loSo'] = '58';
    } else {
      this.draft.page1Data['calibPoints'] = [
        { loSo: '1', hamLuong: '0' },
        { loSo: '2', hamLuong: '5' },
        { loSo: '3', hamLuong: '10' },
        { loSo: '4', hamLuong: '20' },
        { loSo: '5', hamLuong: '50' }
      ];
      this.bulkVialStart = 9;
      
      // Update vials for QC rows directly in resultData
      if (this.draft.resultData['QC_BLANK']) this.draft.resultData['QC_BLANK']['loSo'] = '7';
      if (this.draft.resultData['QC_SPIKE']) this.draft.resultData['QC_SPIKE']['loSo'] = '8';
      if (this.draft.resultData['QC_FINAL']) this.draft.resultData['QC_FINAL']['loSo'] = '8';
    }
    
    this.onBulkVialStartChange();
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
    } else {
      delete this.draft.resultData['QC_FINAL'];
    }
    this.onDataChanged();
  }

  getColumnLabel(colKey: string): string {
    if (colKey === 'khoiLuong') return 'Khối lượng (g)';
    if (colKey === 'heSoPhaLoang') return 'Hệ số pha loãng F';
    if (colKey === 'kqDichlorvos') return 'Dichlorvos (ng/g)';
    return this.formatColumnName(colKey);
  }

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets(), this.config?.id || this.run?.sopId);
  }

  formatColumnName(colKey: string): string {
    let name = colKey.replace(/^kq/, '');
    name = name.replace(/([A-Z])/g, ' $1').trim();
    const defaultName = name.charAt(0).toUpperCase() + name.slice(1);
    return this.getCompoundDisplayName(defaultName);
  }

  buildColumnDisplayNames() {
    const map: Record<string, string> = {};
    for (const col of this.activeColumns) {
      map[col] = this.getColumnLabel(col);
    }
    this.columnDisplayNames.set(map);
  }

  updateDichlorvosRecovery(key: string) {
    const row = this.draft.resultData[key];
    if (!row) return;
    const val = parseFloat(row['kqDichlorvos'] || '');
    if (!isNaN(val)) {
      const rec = ((val / 10.0) * 100).toFixed(1);
      row['ghiChu'] = `${rec}%`;
    } else {
      row['ghiChu'] = '';
    }
  }

  onCellChanged(key: string) {
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

  getDisplayRows(): any[] {
    const list: any[] = [];
    
    // Determine method and vials
    const isMSMS = this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS';
    const blankVial = isMSMS ? '7' : '57';
    const spikeVial = isMSMS ? '8' : '58';
    
    // Ensure QC_BLANK and QC_SPIKE exist
    if (!this.draft.resultData['QC_BLANK']) {
      const randW = (10.01 + Math.random() * 0.09).toFixed(2);
      this.draft.resultData['QC_BLANK'] = { loSo: blankVial, kqDichlorvos: 'ND', ghiChu: '', selected: true, khoiLuong: randW, heSoPhaLoang: '1' };
    } else {
      this.draft.resultData['QC_BLANK']['loSo'] = this.draft.resultData['QC_BLANK']['loSo'] || blankVial;
      if (this.draft.resultData['QC_BLANK']['khoiLuong'] === undefined || this.draft.resultData['QC_BLANK']['khoiLuong'] === '') {
        this.draft.resultData['QC_BLANK']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
      }
      this.draft.resultData['QC_BLANK']['heSoPhaLoang'] = this.draft.resultData['QC_BLANK']['heSoPhaLoang'] || '1';
    }
    
    if (!this.draft.resultData['QC_SPIKE']) {
      const randW = (10.01 + Math.random() * 0.09).toFixed(2);
      this.draft.resultData['QC_SPIKE'] = { loSo: spikeVial, kqDichlorvos: '', selected: true, ghiChu: '', khoiLuong: randW, heSoPhaLoang: '1' };
    } else {
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
    this.getVisibleRegularSamples().forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        const randW = (10.01 + Math.random() * 0.09).toFixed(2);
        this.draft.resultData[sampleCode] = {
          loSo: '',
          selected: true,
          khoiLuong: randW,
          heSoPhaLoang: '1'
        };
        this.activeColumns.forEach((col: string) => {
          if (col !== 'khoiLuong' && col !== 'heSoPhaLoang') {
            this.draft.resultData[sampleCode][col] = '';
          }
        });
      } else {
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
      } else {
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
    displayRows.forEach((row: any) => {
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
