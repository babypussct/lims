import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName, isCompoundAssigned } from '../../shared/compound-id-resolver';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';

@Component({
  selector: 'app-sop-lan-huu-co-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-lan-huu-co-entry.component.html'
})
export class SopLanHuuCoEntryComponent implements OnInit, OnChanges {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;

  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private masterTargetService = inject(MasterTargetService);
  masterTargets = signal<any[]>([]);
  compoundDisplayNames = signal<Record<string, string>>({});
  checkboxList: { key: string; label: string }[] = [];
  
  activeTab = signal<'compounds' | 'chromatography'>('compounds');
  activeSampleCode = signal<string>('');
  searchQuery = signal<string>('');

  filteredCompounds = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const compounds = this.config?.compounds || [];
    if (!q) return compounds;
    return compounds.filter((c: string) => {
      const displayName = (this.compoundDisplayNames()[c] || c).toLowerCase();
      return c.toLowerCase().includes(q) || displayName.includes(q);
    });
  });

  /** Danh sách hoạt chất được giao cho ít nhất 1 mẫu trong mẻ này (dùng cho Form Đơn) */
  assignedCompoundsForFormDon = computed(() => {
    const compounds: string[] = this.config?.compounds || [];
    const sampleList: string[] = this.run?.sampleList || [];
    if (!sampleList.length) return compounds;
    const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
    if (!targetMap) return compounds;
    return compounds.filter((c: string) =>
      sampleList.some((s: string) => this.isTargetAssigned(s, c))
    );
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['run'] && !changes['run'].firstChange) {
      const newRun = changes['run'].currentValue;
      if (newRun && newRun.sampleList && newRun.sampleList.length > 0) {
        // Reset to first sample of the new filtered list when prefix filter changes
        const currentActive = this.activeSampleCode();
        if (!newRun.sampleList.includes(currentActive)) {
          this.activeSampleCode.set(newRun.sampleList[0]);
        }
      }
    }
  }

  async ngOnInit() {
    if (this.run.sampleList && this.run.sampleList.length > 0) {
      this.activeSampleCode.set(this.run.sampleList[0]);
    }

    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }
    if (!this.draft.page1Data) {
      this.draft.page1Data = {};
    }
    if (!this.draft.resultData) {
      this.draft.resultData = {};
    }

    // Initialize printFormType (default: formCheck)
    if (this.draft.page1Data['printFormType'] === undefined) {
      this.draft.page1Data['printFormType'] = 'formCheck';
    }

    // Initialize activeCompound: ưu tiên hoạt chất đầu tiên được giao cho ít nhất 1 mẫu
    if (!this.draft.page1Data['activeCompound']) {
      const compounds: string[] = this.config?.compounds || [];
      const sampleList: string[] = this.run?.sampleList || [];
      const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
      let firstAssigned = targetMap ? compounds.find((c: string) => sampleList.some((s: string) => this.isTargetAssigned(s, c))) : compounds[0];
      if (!firstAssigned && compounds && compounds.length > 0) { firstAssigned = compounds[0]; }
      if (firstAssigned) { this.draft.page1Data['activeCompound'] = firstAssigned; }
    }

    // Initialize R^2 if formDon
    if (this.draft.page1Data['printFormType'] === 'formDon') {
      if (!this.draft.page1Data['r2']) {
        this.draft.page1Data['r2'] = '0.999';
      }
    }

    // Initialize default page1Data.khoiLuong to '10.0'
    if (this.draft.page1Data['khoiLuong'] === undefined || this.draft.page1Data['khoiLuong'] === null || this.draft.page1Data['khoiLuong'] === '') {
      this.draft.page1Data['khoiLuong'] = '10.0';
    }

    // Initialize calibration points (C0-C4: 5 points)
    const defaultCalib = [
      { loSo: '1', hamLuong: '0' },
      { loSo: '2', hamLuong: '5' },
      { loSo: '3', hamLuong: '10' },
      { loSo: '4', hamLuong: '20' },
      { loSo: '5', hamLuong: '50' }
    ];
    if (!this.draft.page1Data['calibPoints'] || this.draft.page1Data['calibPoints'].length !== 5) {
      this.draft.page1Data['calibPoints'] = defaultCalib;
    } else {
      this.draft.page1Data['calibPoints'].forEach((pt: any, idx: number) => {
        if (pt.hamLuong === undefined || pt.hamLuong === null || String(pt.hamLuong).trim() === '') {
          pt.hamLuong = defaultCalib[idx].hamLuong;
        }
        if (pt.loSo === undefined || pt.loSo === null || String(pt.loSo).trim() === '') {
          pt.loSo = defaultCalib[idx].loSo;
        }
      });
    }

    if (this.draft.page1Data['r2'] === undefined) {
      this.draft.page1Data['r2'] = '';
    }

    if (this.draft.page1Data['blankName'] === undefined) {
      this.draft.page1Data['blankName'] = '';
    }

    if (this.draft.page1Data['spikeName'] === undefined) {
      this.draft.page1Data['spikeName'] = '';
    }

    if (this.draft.page1Data['hasFinal'] === undefined) {
      this.draft.page1Data['hasFinal'] = false;
    }


    if (this.run.sampleList) {
      this.run.sampleList.forEach((sampleCode: string, idx: number) => {
        if (!this.draft.resultData[sampleCode]) {
          this.draft.resultData[sampleCode] = {};
        }
        const sRes = this.draft.resultData[sampleCode];
        if (sRes['selected'] === undefined) {
          sRes['selected'] = true;
        }
        if (sRes['khoiLuong'] === undefined) {
          sRes['khoiLuong'] = '10.0';
        }
        if (sRes['heSoPhaLoang'] === undefined || sRes['heSoPhaLoang'] === null || String(sRes['heSoPhaLoang']).trim() === '') {
          sRes['heSoPhaLoang'] = '1';
        }
        if (sRes['hSoPhaLoang'] === undefined || sRes['hSoPhaLoang'] === null || String(sRes['hSoPhaLoang']).trim() === '') {
          sRes['hSoPhaLoang'] = '1';
        }
        if (sRes['loSo'] === undefined || sRes['loSo'] === null || String(sRes['loSo']).trim() === '') {
          sRes['loSo'] = (9 + idx).toString();
        }
        if (sRes['checkBoSungNuoc'] === undefined) {
          sRes['checkBoSungNuoc'] = 'không';
        }
        if (sRes['checkHonHopLamSach'] === undefined) {
          sRes['checkHonHopLamSach'] = 'B1';
        }

        // Migrate old Chlorpyryfos keys to Chlorpyrifos
        const migrationMap: Record<string, string> = {
          'Chlorpyryfos': 'Chlorpyrifos',
          'Chlorpyryfos-methyl': 'Chlorpyrifos-methyl'
        };
        Object.keys(migrationMap).forEach(oldKey => {
          const newKey = migrationMap[oldKey];
          if (sRes[oldKey] !== undefined) {
            if (sRes[newKey] === undefined) sRes[newKey] = sRes[oldKey];
            delete sRes[oldKey];
          }
          if (sRes[`${oldKey}_nd`] !== undefined) {
            if (sRes[`${newKey}_nd`] === undefined) sRes[`${newKey}_nd`] = sRes[`${oldKey}_nd`];
            delete sRes[`${oldKey}_nd`];
          }
          if (sRes[`${oldKey}_qc1`] !== undefined) {
            if (sRes[`${newKey}_qc1`] === undefined) sRes[`${newKey}_qc1`] = sRes[`${oldKey}_qc1`];
            delete sRes[`${oldKey}_qc1`];
          }
          if (sRes[`${oldKey}_qc2`] !== undefined) {
            if (sRes[`${newKey}_qc2`] === undefined) sRes[`${newKey}_qc2`] = sRes[`${oldKey}_qc2`];
            delete sRes[`${oldKey}_qc2`];
          }
          if (sRes[`${oldKey}_qc3`] !== undefined) {
            if (sRes[`${newKey}_qc3`] === undefined) sRes[`${newKey}_qc3`] = sRes[`${oldKey}_qc3`];
            delete sRes[`${oldKey}_qc3`];
          }
          if (sRes[`${oldKey}_ghiChu`] !== undefined) {
            if (sRes[`${newKey}_ghiChu`] === undefined) sRes[`${newKey}_ghiChu`] = sRes[`${oldKey}_ghiChu`];
            delete sRes[`${oldKey}_ghiChu`];
          }
        });
      });
    }

    this.updateGopInChungState();

    // Set default value for loaiMau if not set (default Thủy sản)
    if (this.draft.page1Data['loaiMau'] === undefined || this.draft.page1Data['loaiMau'] === null || this.draft.page1Data['loaiMau'] === '') {
      this.draft.page1Data['loaiMau'] = 'Thủy sản';
    }

    // Set default value for tinhTrangMau if not set (default Bình thường)
    if (this.draft.page1Data['tinhTrangMau'] === undefined || this.draft.page1Data['tinhTrangMau'] === null || this.draft.page1Data['tinhTrangMau'] === '') {
      this.draft.page1Data['tinhTrangMau'] = 'Bình thường';
    }

    // Set other evaluation checkboxes to true (Đạt) if not set
    if (this.checkboxList) {
      this.checkboxList.forEach(cb => {
        if (cb.key !== 'checkTatCaND' && cb.key !== 'checkCoMauPhatHien' && cb.key !== 'qcNhanDang' && cb.key !== 'checkGopInChung') {
          if (this.draft.page1Data[cb.key] === undefined || this.draft.page1Data[cb.key] === null) {
            this.draft.page1Data[cb.key] = true;
          }
        }
      });
    }

    try {
      const analytes = await this.masterTargetService.getAll();
      this.masterTargets.set(analytes);
      this.buildDisplayNameMap();
    } catch (e) {
      console.warn('Failed to load master analytes', e);
    }
    this.cleanUpPooledSampleResults();
    this.prefillUnassignedTargets();
  }

  buildDisplayNameMap() {
    if (!this.config.compounds) return;
    const map: Record<string, string> = {};
    for (const compound of this.config.compounds) {
      map[compound] = this.getCompoundDisplayName(compound);
    }
    this.compoundDisplayNames.set(map);
  }

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets());
  }

  selectSample(sampleCode: string) {
    this.activeSampleCode.set(sampleCode);
  }

  updateRecovery(key: string, compound: string) {
    const row = this.draft.resultData[key];
    if (!row) return;
    const val = parseFloat(row[compound] || '');
    if (!isNaN(val)) {
      const rec = ((val / 10.0) * 100).toFixed(1);
      row[compound + '_ghiChu'] = `${rec}%`;
    } else {
      row[compound + '_ghiChu'] = '';
    }
  }

  onChromResultChanged(key: string) {
    if (key === 'QC_SPIKE' || key === 'QC_FINAL') {
      this.updateRecovery(key, this.draft.page1Data['activeCompound']);
    }
    this.onDataChanged();
  }

  on10gCheckChange(event: any) {
    this.draft.page1Data['is10gChecked'] = event.target.checked;
    if (this.draft.page1Data['is10gChecked']) {
      this.draft.page1Data['khoiLuongKhac'] = '';
      this.draft.page1Data['khoiLuong'] = '10.0';
    } else {
      this.draft.page1Data['khoiLuong'] = this.draft.page1Data['khoiLuongKhac'] || '';
    }
    this.onDataChanged();
  }

  onKhoiLuongKhacChange() {
    if (this.draft.page1Data['khoiLuongKhac']) {
      this.draft.page1Data['is10gChecked'] = false;
      this.draft.page1Data['khoiLuong'] = this.draft.page1Data['khoiLuongKhac'];
    } else {
      this.draft.page1Data['is10gChecked'] = true;
      this.draft.page1Data['khoiLuong'] = '10.0';
    }
    this.onDataChanged();
  }

  bulkRandomizeMasses() {
    if (this.run && this.run.sampleList) {
      this.run.sampleList.forEach((sampleCode: string) => {
        if (this.draft.resultData[sampleCode]) {
          const randW = (10.01 + Math.random() * 0.08).toFixed(3);
          this.draft.resultData[sampleCode]['khoiLuong'] = randW;
        }
      });
      if (this.draft.resultData['QC_SPIKE']) {
        this.draft.resultData['QC_SPIKE']['khoiLuong'] = (10.01 + Math.random() * 0.08).toFixed(3);
      }
      this.onDataChanged();
    }
  }

  onDataChanged() {
    if (this.draft.resultData && this.draft.resultData['QC_SPIKE'] && this.draft.resultData['QC_FINAL']) {
      this.draft.resultData['QC_FINAL']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || '';
      this.draft.resultData['QC_FINAL']['khoiLuong'] = this.draft.resultData['QC_SPIKE']['khoiLuong'] || '';
      this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] || '';
      this.draft.resultData['QC_FINAL']['checkBoSungNuoc'] = this.draft.resultData['QC_SPIKE']['checkBoSungNuoc'] || 'không';
      this.draft.resultData['QC_FINAL']['checkHonHopLamSach'] = this.draft.resultData['QC_SPIKE']['checkHonHopLamSach'] || 'B1';
    }

    if (this.config?.compounds) {
      this.config.compounds.forEach((c: string) => {
        this.updateRecovery('QC_SPIKE', c);
        this.updateRecovery('QC_FINAL', c);
      });
    }

    this.draftChanged.emit(this.draft);
  }

  isTargetAssigned(sampleCode: string, compound: string): boolean {
    if (!this.run) return true;
    if (this.run.isVirtualMaster) return true;
    const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
    if (!targetMap) return true;

    // Support pooled samples separated by ';'
    const subCodes = sampleCode.split(';').map(s => s.trim()).filter(Boolean);
    if (subCodes.length > 1) {
      return subCodes.some(sc => {
        const matchKey = Object.keys(targetMap).find(k => k.toLowerCase().trim() === sc.toLowerCase().trim());
        const assigned = matchKey ? targetMap[matchKey] : null;
        return isCompoundAssigned(assigned, compound, this.masterTargets());
      });
    }

    const matchKey = Object.keys(targetMap).find(k => k.toLowerCase().trim() === sampleCode.toLowerCase().trim());
    const assigned = matchKey ? targetMap[matchKey] : null;
    return isCompoundAssigned(assigned, compound, this.masterTargets());

  prefillUnassignedTargets() {
    const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
    if (!this.run || !targetMap || !this.config.compounds) return;
    const sampleList = this.run.sampleList || [];
    let changed = false;

    sampleList.forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {};
      }
      const row = this.draft.resultData[sampleCode];
      this.config.compounds.forEach((c: string) => {
        if (!this.isTargetAssigned(sampleCode, c)) {
          if (row[c] !== 'N/A' && row[c] !== '—') {
            row[c] = 'N/A';
            row[`${c}_nd`] = false;
            row[`${c}_qc1`] = 'N/A';
            row[`${c}_qc2`] = 'N/A';
            row[`${c}_qc3`] = 'N/A';
            changed = true;
          }
        }
      });
    });

    if (changed) {
      this.onDataChanged();
    }
  }

  cleanUpPooledSampleResults() {
    if (!this.run || !this.run.sampleList || !this.config.compounds) return;
    let changed = false;
    this.run.sampleList.forEach((sampleCode: string) => {
      if (sampleCode.includes(';')) {
        const row = this.draft.resultData[sampleCode];
        if (row) {
          this.config.compounds.forEach((c: string) => {
            const val = row[c];
            if (typeof val === 'string' && val.includes(':')) {
              const parts = val.split(';');
              let hasColon = false;
              let allNegative = true;
              for (const part of parts) {
                if (part.includes(':')) {
                  hasColon = true;
                  const res = part.split(':')[1].trim().toUpperCase();
                  if (!['KPH', 'ND', 'N/A', '—', ''].includes(res)) {
                    allNegative = false;
                  }
                } else {
                  const res = part.trim().toUpperCase();
                  if (!['KPH', 'ND', 'N/A', '—', ''].includes(res)) {
                    allNegative = false;
                  }
                }
              }
              if (hasColon && allNegative) {
                row[c] = '';
                row[`${c}_nd`] = true;
                row[`${c}_qc1`] = 'Đạt';
                row[`${c}_qc2`] = 'Đạt';
                row[`${c}_qc3`] = 'Đạt';
                changed = true;
              }
            }
          });
        }
      }
    });
    if (changed) {
      this.onDataChanged();
    }
  }

  onNdCheckboxChanged(compound: string) {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      if (row[`${compound}_nd`]) {
        // KPH/ND được check => Xóa trắng giá trị kết quả, QC tự động Đạt
        row[compound] = '';
        row[`${compound}_qc1`] = 'Đạt';
        row[`${compound}_qc2`] = 'Đạt';
        row[`${compound}_qc3`] = 'Đạt';
      } else {
        // KPH/ND bỏ check => Xóa trắng giá trị, giữ QC trống để user tự chọn
        row[compound] = '';
      }
    }
    this.onDataChanged();
  }

  onResultInputChanged(compound: string) {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      const rawVal = row[compound];
      const val = rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : '';
      if (val !== '') {
        // Có nhập giá trị => tự động bỏ check ND
        row[`${compound}_nd`] = false;
      }
      // Không thay đổi QC buttons — để user tự quyết định
    }
    this.onDataChanged();
  }

  sampleBulkFillND() {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.config.compounds) {
      this.config.compounds.forEach((c: string) => {
        if (this.isTargetAssigned(active, c)) {
          row[c] = '';
          row[`${c}_nd`] = true;
          row[`${c}_qc1`] = 'Đạt';
          row[`${c}_qc2`] = 'Đạt';
          row[`${c}_qc3`] = 'Đạt';
        }
      });
    }
    this.onDataChanged();
  }

  sampleBulkQC() {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.config.compounds) {
      this.config.compounds.forEach((c: string) => {
        if (this.isTargetAssigned(active, c)) {
          row[`${c}_qc1`] = 'Đạt';
          row[`${c}_qc2`] = 'Đạt';
          row[`${c}_qc3`] = 'Đạt';
        }
      });
    }
    this.onDataChanged();
  }

  copyActiveSampleToAll() {
    const sourceSample = this.activeSampleCode();
    const sourceData = this.draft.resultData[sourceSample];
    if (!sourceData || !this.config.compounds) return;

    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      if (sampleCode !== sourceSample) {
        const destRow = this.draft.resultData[sampleCode];
        if (destRow) {
          this.config.compounds.forEach((c: string) => {
            if (this.isTargetAssigned(sampleCode, c)) {
              const sourceValue = this.isTargetAssigned(sourceSample, c) ? sourceData[c] : '';
              const sourceNd = this.isTargetAssigned(sourceSample, c) ? sourceData[`${c}_nd`] : true;
              const sourceQc1 = this.isTargetAssigned(sourceSample, c) ? sourceData[`${c}_qc1`] : 'Đạt';
              const sourceQc2 = this.isTargetAssigned(sourceSample, c) ? sourceData[`${c}_qc2`] : 'Đạt';
              const sourceQc3 = this.isTargetAssigned(sourceSample, c) ? sourceData[`${c}_qc3`] : 'Đạt';

              destRow[c] = sourceValue || '';
              destRow[`${c}_nd`] = sourceNd !== false;
              destRow[`${c}_qc1`] = sourceQc1 || 'Đạt';
              destRow[`${c}_qc2`] = sourceQc2 || 'Đạt';
              destRow[`${c}_qc3`] = sourceQc3 || 'Đạt';
            }
          });
          // Sync sample metadata as well
          destRow['khoiLuong'] = sourceData['khoiLuong'] || '10.0';
          destRow['heSoPhaLoang'] = sourceData['heSoPhaLoang'] || '1';
          destRow['hSoPhaLoang'] = sourceData['hSoPhaLoang'] || '1';
          destRow['checkBoSungNuoc'] = sourceData['checkBoSungNuoc'] || 'không';
          destRow['checkHonHopLamSach'] = sourceData['checkHonHopLamSach'] || 'B1';
        }
      }
    });
    this.onDataChanged();
  }

  getSelectedSampleCount(): number {
    const sampleList = this.run?.sampleList || [];
    return sampleList.filter((s: string) => this.draft.resultData[s]?.['selected'] !== false).length;
  }

  private updateGopInChungState() {
    const shouldGop = this.getSelectedSampleCount() > 1;
    if (this.draft.page1Data['checkGopInChung'] !== shouldGop) {
      this.draft.page1Data['checkGopInChung'] = shouldGop;
    }
  }

  toggleSampleSelected(sampleCode: string, checked: boolean) {
    if (!this.draft.resultData[sampleCode]) {
      this.draft.resultData[sampleCode] = {};
    }
    this.draft.resultData[sampleCode]['selected'] = checked;
    this.updateGopInChungState();
    this.onDataChanged();
  }

  isAllSamplesSelected(): boolean {
    const sampleList = this.run?.sampleList || [];
    if (sampleList.length === 0) return false;
    return sampleList.every((s: string) => this.draft.resultData[s]?.['selected'] !== false);
  }

  toggleSelectAllSamples() {
    const targetState = !this.isAllSamplesSelected();
    const sampleList = this.run?.sampleList || [];
    sampleList.forEach((s: string) => {
      if (!this.draft.resultData[s]) {
        this.draft.resultData[s] = {};
      }
      this.draft.resultData[s]['selected'] = targetState;
    });
    this.updateGopInChungState();
    this.onDataChanged();
  }

  setCompoundQc(compound: string, qcKey: 'qc1' | 'qc2' | 'qc3', status: 'Đạt' | 'Không đạt' | 'N/A') {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      row[`${compound}_${qcKey}`] = status;
      this.onDataChanged();
    }
  }

  syncDilution(sampleCode: string) {
    const val = this.draft.resultData[sampleCode]['heSoPhaLoang'] || '1';
    this.draft.resultData[sampleCode]['hSoPhaLoang'] = val;
    this.onDataChanged();
  }

  setPrintFormType(type: 'formCheck' | 'formDon') {
    this.draft.page1Data['printFormType'] = type;

    // Automatically assign appropriate vials when switching form type
    const defaultBlankVial = '7';
    const defaultSpikeVial = '8';
    
    if (this.draft.resultData['QC_BLANK']) {
      this.draft.resultData['QC_BLANK']['loSo'] = defaultBlankVial;
    }
    if (this.draft.resultData['QC_SPIKE']) {
      this.draft.resultData['QC_SPIKE']['loSo'] = defaultSpikeVial;
    }
    if (this.draft.resultData['QC_FINAL']) {
      this.draft.resultData['QC_FINAL']['loSo'] = defaultSpikeVial;
    }

    if (type === 'formCheck') {
      this.activeTab.set('compounds');
    } else {
      this.activeTab.set('chromatography');
      if (!this.draft.page1Data['r2']) {
        this.draft.page1Data['r2'] = '0.999';
      }
    }
    this.onDataChanged();
  }

  onFinalToggled() {
    if (this.draft.page1Data['hasFinal']) {
      const spike = this.draft.resultData['QC_SPIKE'];
      this.draft.resultData['QC_FINAL'] = {
        loSo: spike?.['loSo'] || '8',
        selected: true,
        khoiLuong: spike?.['khoiLuong'] || '10.0',
        heSoPhaLoang: spike?.['heSoPhaLoang'] || '1',
        checkBoSungNuoc: spike?.['checkBoSungNuoc'] || 'không',
        checkHonHopLamSach: spike?.['checkHonHopLamSach'] || 'B1'
      };
    } else {
      delete this.draft.resultData['QC_FINAL'];
    }
    this.onDataChanged();
  }

  bulkFillNDFormDon() {
    const active = this.draft.page1Data['activeCompound'];
    if (!active) return;
    const rows = this.getChromatographyRows();
    rows.forEach((row: any) => {
      const rowData = this.draft.resultData[row.key];
      if (rowData && rowData['selected'] !== false) {
        if (!rowData[active] || rowData[active]?.trim() === '') {
          rowData[active] = 'ND';
        }
      }
    });
    this.onDataChanged();
  }

  bulkClearAllFormDon() {
    const active = this.draft.page1Data['activeCompound'];
    if (!active) return;
    const rows = this.getChromatographyRows();
    rows.forEach((row: any) => {
      const rowData = this.draft.resultData[row.key];
      if (rowData) {
        rowData[active] = '';
        rowData[active + '_ghiChu'] = '';
      }
    });
    this.onDataChanged();
  }

  getChromatographyRows(): any[] {
    const list = [];
    const isDon = this.draft.page1Data['printFormType'] === 'formDon';
    const defaultBlankVial = '7';
    const defaultSpikeVial = '8';
    
    // 1. QC_BLANK
    const blankName = this.draft.page1Data['blankName'] || 'BLANK';
    if (!this.draft.resultData['QC_BLANK']) {
      const randW = isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0';
      this.draft.resultData['QC_BLANK'] = {
        loSo: defaultBlankVial,
        selected: true,
        khoiLuong: randW,
        heSoPhaLoang: '1',
        checkBoSungNuoc: 'không',
        checkHonHopLamSach: 'B1'
      };
    } else {
      this.draft.resultData['QC_BLANK']['loSo'] = this.draft.resultData['QC_BLANK']['loSo'] || defaultBlankVial;
      if (isDon && (this.draft.resultData['QC_BLANK']['khoiLuong'] === undefined || this.draft.resultData['QC_BLANK']['khoiLuong'] === '' || this.draft.resultData['QC_BLANK']['khoiLuong'] === '10.0')) {
        this.draft.resultData['QC_BLANK']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
      }
    }
    list.push({ key: 'QC_BLANK', label: blankName, type: 'QC' });

    // 2. QC_SPIKE
    const spikeName = this.draft.page1Data['spikeName'] || 'SPIKE';
    if (!this.draft.resultData['QC_SPIKE']) {
      const randW = isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0';
      this.draft.resultData['QC_SPIKE'] = {
        loSo: defaultSpikeVial,
        selected: true,
        khoiLuong: randW,
        heSoPhaLoang: '1',
        checkBoSungNuoc: 'không',
        checkHonHopLamSach: 'B1'
      };
    } else {
      this.draft.resultData['QC_SPIKE']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || defaultSpikeVial;
      if (isDon && (this.draft.resultData['QC_SPIKE']['khoiLuong'] === undefined || this.draft.resultData['QC_SPIKE']['khoiLuong'] === '' || this.draft.resultData['QC_SPIKE']['khoiLuong'] === '10.0')) {
        this.draft.resultData['QC_SPIKE']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
      }
    }
    list.push({ key: 'QC_SPIKE', label: spikeName, type: 'QC' });

    // 3. Regular samples
    if (this.run && this.run.sampleList) {
      this.run.sampleList.forEach((sampleCode: string, idx: number) => {
        if (!this.draft.resultData[sampleCode]) {
          const randW = isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0';
          this.draft.resultData[sampleCode] = {
            loSo: (9 + idx).toString(),
            selected: true,
            khoiLuong: randW,
            heSoPhaLoang: '1',
            checkBoSungNuoc: 'không',
            checkHonHopLamSach: 'B1'
          };
        } else {
          if (isDon && (this.draft.resultData[sampleCode]['khoiLuong'] === undefined || this.draft.resultData[sampleCode]['khoiLuong'] === '' || this.draft.resultData[sampleCode]['khoiLuong'] === '10.0')) {
            this.draft.resultData[sampleCode]['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
          }
          if (this.draft.resultData[sampleCode]['heSoPhaLoang'] === undefined || this.draft.resultData[sampleCode]['heSoPhaLoang'] === null || String(this.draft.resultData[sampleCode]['heSoPhaLoang']).trim() === '') {
            this.draft.resultData[sampleCode]['heSoPhaLoang'] = '1';
          }
          if (this.draft.resultData[sampleCode]['hSoPhaLoang'] === undefined || this.draft.resultData[sampleCode]['hSoPhaLoang'] === null || String(this.draft.resultData[sampleCode]['hSoPhaLoang']).trim() === '') {
            this.draft.resultData[sampleCode]['hSoPhaLoang'] = '1';
          }
          if (this.draft.resultData[sampleCode]['loSo'] === undefined || this.draft.resultData[sampleCode]['loSo'] === null || String(this.draft.resultData[sampleCode]['loSo']).trim() === '') {
            this.draft.resultData[sampleCode]['loSo'] = (9 + idx).toString();
          }
        }
        list.push({ key: sampleCode, label: sampleCode, type: 'REGULAR' });
      });
    }

    // 4. QC_FINAL (optional)
    if (this.draft.page1Data['hasFinal']) {
      if (!this.draft.resultData['QC_FINAL']) {
        const spike = this.draft.resultData['QC_SPIKE'];
        const finalVial = spike?.['loSo'] || defaultSpikeVial;
        const finalW = spike?.['khoiLuong'] || (isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0');
        const finalF = spike?.['heSoPhaLoang'] || '1';
        this.draft.resultData['QC_FINAL'] = {
          loSo: finalVial,
          selected: true,
          khoiLuong: finalW,
          heSoPhaLoang: finalF,
          checkBoSungNuoc: 'không',
          checkHonHopLamSach: 'B1'
        };
      } else {
        const spike = this.draft.resultData['QC_SPIKE'];
        if (spike) {
          this.draft.resultData['QC_FINAL']['loSo'] = spike['loSo'] || defaultSpikeVial;
          this.draft.resultData['QC_FINAL']['khoiLuong'] = spike['khoiLuong'] || (isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0');
          this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = spike['heSoPhaLoang'] || '1';
        }
      }
      list.push({ key: 'QC_FINAL', label: 'FINAL', type: 'QC' });
    }

    return list;
  }
}


