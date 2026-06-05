import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { calculateSop03Recovery } from './sop-03-engine';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName } from '../../shared/compound-id-resolver';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { bulkFillND, bulkClearAll, copyRowToAll, navigateGrid } from '../shared/sop-grid-helper';

@Component({
  selector: 'app-sop-03-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-03-entry.component.html'
})
export class Sop03EntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Input() activeFilter: string = 'ALL';
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private masterTargetService = inject(MasterTargetService);
  masterTargets = signal<any[]>([]);
  columnDisplayNames = signal<Record<string, string>>({});
  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];

  // Bulk vial properties
  bulkVialStart = 1;
  bulkVialEnd = 1;

  getStats() {
    const regularSamples = this.getVisibleRegularSamples();
    const totalCount = regularSamples.length;
    const selectedCount = regularSamples.filter(s => this.draft.resultData[s]['selected'] !== false).length;
    
    // Fill progress (leaving blank means ND, which is a completed result)
    let filledCount = 0;
    regularSamples.forEach(s => {
      const row = this.draft.resultData[s];
      if (row && row['selected'] !== false) {
        filledCount++;
      }
    });
    const progressPct = selectedCount > 0 ? Math.round((filledCount / selectedCount) * 100) : 0;
    
    // Spike Recovery
    const spikeRow = this.draft.resultData['QC_SPIKE'];
    let spikeRecovery = 'Chưa có';
    let spikeRecoveryVal = 0;
    if (spikeRow && spikeRow['kqTrifluralin']) {
      const val = parseFloat(spikeRow['kqTrifluralin']);
      if (!isNaN(val)) {
        spikeRecoveryVal = val * 100;
        spikeRecovery = `${spikeRecoveryVal.toFixed(1)}%`;
      }
    }
    
    // R2 Linearity
    const r2Val = this.draft.page1Data['r2'] || '';
    const r2Float = parseFloat(r2Val);
    const r2Status = !isNaN(r2Float) ? (r2Float >= 0.995 ? 'VALID' : 'WARNING') : 'NOT_SET';

    return {
      totalCount,
      selectedCount,
      filledCount,
      progressPct,
      spikeRecovery,
      spikeRecoveryVal,
      r2Val,
      r2Status
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
    this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
    this.buildColumnDisplayNames();

    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }

    // Đảm bảo các trường dữ liệu cần thiết của Trifluralin luôn được khởi tạo
    if (!this.draft.page1Data) this.draft.page1Data = {};
    if (!this.draft.page1Data['calibPoints'] || this.draft.page1Data['calibPoints'].length === 0) {
      this.draft.page1Data['calibPoints'] = [
        { loSo: '41', hamLuong: '0' },
        { loSo: '42', hamLuong: '0.5' },
        { loSo: '43', hamLuong: '1.0' },
        { loSo: '44', hamLuong: '5.0' },
        { loSo: '45', hamLuong: '10.0' },
        { loSo: '46', hamLuong: '30.0' }
      ];
    }
    if (this.draft.page1Data['r2'] === undefined || this.draft.page1Data['r2'] === '') {
      this.draft.page1Data['r2'] = '0.999';
    }
    if (this.draft.page1Data['blankName'] === undefined) {
      this.draft.page1Data['blankName'] = '';
    }
    if (this.draft.page1Data['spikeName'] === undefined) {
      this.draft.page1Data['spikeName'] = '';
    }

    if (!this.draft.resultData) this.draft.resultData = {};
    if (!this.draft.resultData['QC_BLANK']) {
      this.draft.resultData['QC_BLANK'] = { loSo: '47', kqTrifluralin: 'ND', ghiChu: '', selected: true };
    } else {
      if (!this.draft.resultData['QC_BLANK']['loSo']) this.draft.resultData['QC_BLANK']['loSo'] = '47';
      if (!this.draft.resultData['QC_BLANK']['kqTrifluralin']) this.draft.resultData['QC_BLANK']['kqTrifluralin'] = 'ND';
    }
    if (!this.draft.resultData['QC_SPIKE']) {
      this.draft.resultData['QC_SPIKE'] = { loSo: '48', kqTrifluralin: '', ghiChu: '', selected: true };
    } else {
      if (!this.draft.resultData['QC_SPIKE']['loSo']) this.draft.resultData['QC_SPIKE']['loSo'] = '48';
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
    return visible.every(s => this.draft.resultData[s]['selected'] !== false);
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    const visible = this.getVisibleRegularSamples();
    visible.forEach(s => {
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
          this.draft.resultData[sample] = {
            loSo: '',
            kqTrifluralin: '',
            ghiChu: '',
            selected: true
          };
        }
        this.draft.resultData[sample]['loSo'] = String(val);
      }
    });
    this.onDataChanged();
  }

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets());
  }

  formatColumnName(colKey: string): string {
    const customNames: Record<string, string> = {
      'kqTrifluralin': 'Trifluralin'
    };
    const defaultName = customNames[colKey] || colKey;
    return this.getCompoundDisplayName(defaultName);
  }

  buildColumnDisplayNames() {
    const map: Record<string, string> = {};
    for (const col of this.activeColumns) {
      map[col] = this.formatColumnName(col);
    }
    this.columnDisplayNames.set(map);
  }

  onDataChanged() {
    this.syncQcValues();
    this.draftChanged.emit(this.draft);
  }

  syncQcValues() {
    if (!this.draft || !this.draft.resultData) return;
    const allFinalKey = `QC_FINAL_QC_`;
    const sourceFinal = this.draft.resultData[allFinalKey];
    if (sourceFinal) {
      Object.keys(this.draft.resultData).forEach(key => {
        if (key.startsWith('QC_FINAL_QC_') && key !== allFinalKey) {
          this.draft.resultData[key]['loSo'] = sourceFinal['loSo'] || '';
          this.draft.resultData[key]['kqTrifluralin'] = sourceFinal['kqTrifluralin'] || '';
          this.draft.resultData[key]['ghiChu'] = sourceFinal['ghiChu'] || '';
          this.draft.resultData[key]['selected'] = sourceFinal['selected'] !== false;
        }
      });
    }
  }

  onCellChanged(sampleCode: string) {
    this.updateRecovery(sampleCode);
    if (sampleCode.startsWith('QC_FINAL_QC_')) {
      this.propagateFinalQc(sampleCode);
    }
    this.onDataChanged();
  }

  propagateFinalQc(sourceKey: string) {
    const source = this.draft.resultData[sourceKey];
    if (!source) return;
    Object.keys(this.draft.resultData).forEach(key => {
      if (key.startsWith('QC_FINAL_QC_') && key !== sourceKey) {
        if (!this.draft.resultData[key]) {
          this.draft.resultData[key] = {};
        }
        this.draft.resultData[key]['loSo'] = source['loSo'] || '';
        this.draft.resultData[key]['kqTrifluralin'] = source['kqTrifluralin'] || '';
        this.draft.resultData[key]['ghiChu'] = source['ghiChu'] || '';
        this.draft.resultData[key]['selected'] = source['selected'] !== false;
      }
    });
  }

  updateRecovery(sampleCode: string) {
    const row = this.draft.resultData[sampleCode];
    if (!row) return;

    const spikeName = this.draft.page1Data['spikeName'] || 'Spike';
    row['ghiChu'] = calculateSop03Recovery(row, sampleCode, spikeName);
  }

  getSpikeNKey(n: number, prefix: string): string {
    const p = prefix === 'ALL' ? '' : prefix;
    return `QC_SPIKE_${n}_QC_${p}`;
  }

  getFinalKey(prefix: string): string {
    const p = prefix === 'ALL' ? '' : prefix;
    return `QC_FINAL_QC_${p}`;
  }

  getDisplayRowsForPrefix(prefix: string): any[] {
    const samples = this.getVisibleRegularSamples();
    const list: any[] = [];
    
    const ensureKey = (key: string, isSpikeQC: boolean) => {
      if (!this.draft.resultData[key]) {
        this.draft.resultData[key] = {
          loSo: isSpikeQC ? (this.draft.resultData['QC_SPIKE']?.['loSo'] || '2') : '',
          kqTrifluralin: '',
          ghiChu: '',
          selected: true
        };
      } else if (isSpikeQC) {
        this.draft.resultData[key]['loSo'] = this.draft.resultData['QC_SPIKE']?.['loSo'] || '2';
      }
    };

    ensureKey('QC_BLANK', false);
    ensureKey('QC_SPIKE', false);

    list.push({
      key: 'QC_BLANK',
      type: 'QC_BLANK',
      label: this.draft.page1Data['blankName'] || 'Blank',
      isQC: true
    });

    list.push({
      key: 'QC_SPIKE',
      type: 'QC_SPIKE',
      label: this.draft.page1Data['spikeName'] || 'Spike',
      isQC: true
    });

    let selectedCount = 0;
    samples.forEach((sampleCode: string) => {
      ensureKey(sampleCode, false);
      const rowData = this.draft.resultData[sampleCode];
      const isSelected = rowData['selected'] !== false;
      
      list.push({
        key: sampleCode,
        type: 'REGULAR',
        label: sampleCode,
        isQC: false
      });

      if (isSelected) {
        selectedCount++;
        if (selectedCount % 10 === 0) {
          const totalSelected = samples.filter((s: string) => this.draft.resultData[s]['selected'] !== false).length;
          const isLastSelected = selectedCount === totalSelected;
          if (!isLastSelected) {
            const n = selectedCount / 10;
            const spikeNKey = this.getSpikeNKey(n, prefix);
            ensureKey(spikeNKey, true);
            list.push({
              key: spikeNKey,
              type: 'QC_SPIKE_N',
              label: `SPIKE_${n}`,
              isQC: true,
              n: n
            });
          }
        }
      }
    });

    if (selectedCount > 0 && this.draft.page1Data['hasFinal']) {
      const finalKey = this.getFinalKey(prefix);
      ensureKey(finalKey, true);
      list.push({
        key: finalKey,
        type: 'QC_FINAL',
        label: 'FINAL',
        isQC: true
      });
    }

    return list;
  }

  bulkFillND() {
    bulkFillND(this.draft.resultData, this.run.sampleList, this.activeColumns, (key) => this.updateRecovery(key));
    this.draft.page1Data['checkTatCaND'] = true;
    this.draft.page1Data['checkCoMauPhatHien'] = false;
    this.onDataChanged();
  }

  bulkClearAll() {
    bulkClearAll(this.draft.resultData, this.run.sampleList, this.activeColumns);
    this.onDataChanged();
  }

  copyRowToAll(sourceKey: string) {
    copyRowToAll(this.draft.resultData, this.run.sampleList, this.activeColumns, sourceKey, (key) => this.updateRecovery(key));
    this.onDataChanged();
  }

  handleGridNavigation(event: KeyboardEvent, rowIdx: number, colName: string, colIdx: number) {
    const columnsList = ['selected', 'loSo', ...this.activeColumns, 'ghiChu'];
    const rows = this.getDisplayRowsForPrefix(this.activeFilter);
    navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 1);
  }
}
