import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { calculateSop01Recovery } from './sop-01-engine';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName, isCompoundAssigned } from '../../shared/compound-id-resolver';
import { ProgressService } from '../../../../core/services/progress.service';
import { ReportService } from '../../../../core/services/report.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { navigateGrid } from '../shared/sop-grid-helper';
import { parseMassHunterWorkbook } from '../shared/mass-hunter-parser';

@Component({
  selector: 'app-sop-01-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-01-entry.component.html'
})
export class Sop01EntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private masterTargetService = inject(MasterTargetService);
  private progressService = inject(ProgressService);
  private reportService = inject(ReportService);
  private toast = inject(ToastService);
  masterTargets = signal<any[]>([]);
  columnDisplayNames = signal<Record<string, string>>({});
  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];
  decimalPlaces = 2; // Số chữ số thập phân làm tròn (Mặc định 2)

  // Bulk rack properties
  bulkRackStart = 1;
  bulkVialStartFip = 10;
  bulkVialsPerRack = 54;

  async ngOnInit() {
    try {
      const analytes = await this.masterTargetService.getAll();
      this.masterTargets.set(analytes);
    } catch (e) {
      console.warn('Failed to load master analytes', e);
    }
    // Trích lọc các hoạt chất thực sự
    const cols = Object.keys(this.config.columns || {});
    this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
    this.buildColumnDisplayNames();

    // Nạp danh sách checkbox
    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
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
    if (this.draft.page1Data['maHoSo'] === undefined) this.draft.page1Data['maHoSo'] = '';
    if (this.draft.page1Data['heSoPhaLoang'] === undefined) this.draft.page1Data['heSoPhaLoang'] = '1';
    if (this.draft.page1Data['loaiMau'] === undefined) this.draft.page1Data['loaiMau'] = 'Thủy sản';
    if (this.draft.page1Data['tinhTrangMau'] === undefined) this.draft.page1Data['tinhTrangMau'] = 'Bình thường';
    if (this.draft.page1Data['hasCheckSample'] === undefined) this.draft.page1Data['hasCheckSample'] = false;
    if (this.draft.page1Data['uploadMassHunterToDrive'] === undefined) this.draft.page1Data['uploadMassHunterToDrive'] = true;

    // Khởi tạo tên tuỳ chỉnh cho các mẫu QC
    if (this.draft.page1Data['blankName'] === undefined) this.draft.page1Data['blankName'] = '';
    if (this.draft.page1Data['spikeName'] === undefined) this.draft.page1Data['spikeName'] = '';
    if (this.draft.page1Data['checkSampleName'] === undefined) this.draft.page1Data['checkSampleName'] = 'CHECK_SAMPLE';

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
    (this.run.sampleList || []).forEach((sample: string, idx: number) => {
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
    if (this.draft.page1Data['hasCheckSample']) {
      this.draft.page1Data['qcKiemTraNoiBo'] = true;
    } else {
      this.draft.page1Data['qcKiemTraNoiBo'] = null;
    }
    this.onDataChanged();
  }

  applyBulkVials() {
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

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets());
  }

  formatColumnName(colKey: string): string {
    const customNames: Record<string, string> = {
      'kqFip': 'Fipronil',
      'kqFipDesl': 'Fipronil desulfinyl',
      'kqFipSulf': 'Fipronil sulfide',
      'kqFipSulf2': 'Fipronil sulfone',
      'kqClp': 'Chlorpyrifos',
      'kqClpMe': 'Chlorpyrifos-methyl',
      'kqClpMeDes': 'Chlorpyrifos-methyl-desmethyl'
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
    this.draftChanged.emit(this.draft);
  }

  isTargetAssigned(sampleCode: string, col: string): boolean {
    if (sampleCode.startsWith('QC_')) {
      return this.isTargetAssignedToAnySample(col);
    }
    if (!this.run) return true;
    const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
    if (!targetMap) return true;

    const matchKey = Object.keys(targetMap).find(k => k.toLowerCase().trim() === sampleCode.toLowerCase().trim());
    const assigned = matchKey ? targetMap[matchKey] : null;
    if (!assigned || assigned.length === 0) return true;

    const customNames: Record<string, string> = {
      'kqFip': 'Fipronil',
      'kqFipDesl': 'Fipronil desulfinyl',
      'kqFipSulf': 'Fipronil sulfide',
      'kqFipSulf2': 'Fipronil sulfone',
      'kqClp': 'Chlorpyrifos',
      'kqClpMe': 'Chlorpyrifos-methyl',
      'kqClpMeDes': 'Chlorpyrifos-methyl-desmethyl'
    };
    const compound = customNames[col] || col;
    return isCompoundAssigned(assigned, compound);
  }

  isTargetAssignedToAnySample(col: string): boolean {
    if (!this.run) return true;
    const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
    if (!targetMap) return true;
    const sampleList = this.run.sampleList || [];
    if (sampleList.length === 0) return true;

    return sampleList.some((sampleCode: string) => {
      const matchKey = Object.keys(targetMap).find(k => k.toLowerCase().trim() === sampleCode.toLowerCase().trim());
      const assigned = matchKey ? targetMap[matchKey] : null;
      if (!assigned || assigned.length === 0) return true;

      const customNames: Record<string, string> = {
        'kqFip': 'Fipronil',
        'kqFipDesl': 'Fipronil desulfinyl',
        'kqFipSulf': 'Fipronil sulfide',
        'kqFipSulf2': 'Fipronil sulfone',
        'kqClp': 'Chlorpyrifos',
        'kqClpMe': 'Chlorpyrifos-methyl',
        'kqClpMeDes': 'Chlorpyrifos-methyl-desmethyl'
      };
      const compound = customNames[col] || col;
      return isCompoundAssigned(assigned, compound);
    });
  }

  prefillUnassignedTargets() {
    const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
    if (!this.run || !targetMap || !this.activeColumns) return;
    
    // Get all rows in display (including QC samples)
    const allRowKeys = this.getDisplayRowsForFipronil().map(row => row.key);
    let changed = false;

    allRowKeys.forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {};
      }
      const row = this.draft.resultData[sampleCode];
      this.activeColumns.forEach((c: string) => {
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

  onCellChanged(sampleCode: string) {
    this.updateRecovery(sampleCode);
    this.onDataChanged();
  }

  updateRecovery(sampleCode: string) {
    const row = this.draft.resultData[sampleCode];
    if (!row) return;

    // Delegate to Fipronil pure calculation engine
    row['ghiChu'] = calculateSop01Recovery(row, sampleCode);
  }

  getSpikeNKey(n: number): string {
    return `QC_SPIKE_${n}`;
  }

  getDisplayRowsForFipronil(): any[] {
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
    ensureKey('QC_SPIKE', '1.8');
    list.push({
      key: 'QC_SPIKE',
      type: 'QC_SPIKE',
      label: spikeName,
      isQC: true
    });

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
            n: n
          });
        }
      }
    });

    // 5. FINAL (vial 1.8)
    ensureKey('QC_FINAL', '1.8');
    list.push({
      key: 'QC_FINAL',
      type: 'QC_FINAL',
      label: 'FINAL',
      isQC: true
    });

    return list;
  }

  bulkFillND() {
    const allRowKeys = this.getDisplayRowsForFipronil().map(row => row.key);

    allRowKeys.forEach((key: string) => {
      const row = this.draft.resultData[key];
      if (row) {
        this.activeColumns.forEach((col: string) => {
          if (!this.isTargetAssigned(key, col)) {
            row[col] = 'N/A';
          } else if (!row[col] || row[col].toString().trim() === '') {
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
    const allRowKeys = this.getDisplayRowsForFipronil().map(row => row.key);
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

  handleGridNavigation(event: KeyboardEvent, rowIdx: number, colName: string, colIdx: number) {
    const columnsList = ['loSo', ...this.activeColumns];
    const rows = this.getDisplayRowsForFipronil();
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
          'chlorpyrifos-methyl-desmethyl': 'kqClpMeDes'
        };

        const displayRows = this.getDisplayRowsForFipronil();
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

        // 2. Tự động đánh giá các tiêu chí QC chất lượng (qcR2 và qcThuHoi)
        if (r2Values.length > 0) {
          const allR2Ok = r2Values.every(v => v >= 0.99);
          this.draft.page1Data['qcR2'] = allR2Ok;
        }

        const spikeRow = this.draft.resultData['QC_SPIKE'];
        if (spikeRow && spikeRow['kqFip'] !== undefined && spikeRow['kqFip'] !== '') {
          const fipVal = parseFloat(String(spikeRow['kqFip']));
          if (!isNaN(fipVal)) {
            const recovery = (fipVal / 5) * 100;
            if (recovery >= 70 && recovery <= 120) {
              this.draft.page1Data['qcThuHoi'] = true;
            } else {
              this.draft.page1Data['qcThuHoi'] = false;
            }
          }
        }

        // 3. Phát tín hiệu cập nhật dữ liệu để lưu Firestore
        this.onDataChanged();

        // 4. Khởi động tiến trình tải tệp gốc nhị phân lên Google Drive qua Apps Script (nếu được bật)
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
