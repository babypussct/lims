import { Component, signal, computed, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractSopEntry } from '../shared/abstract-sop-entry';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';
import { parseMassHunterWorkbook } from '../shared/mass-hunter-parser';
import { navigateGrid } from '../shared/sop-grid-helper';
import { ReportService } from '../../../../core/services/report.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-sop-tbvtv-thuc-pham-gcmsms-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-tbvtv-thuc-pham-gcmsms-entry.component.html'
})
export class SopTbvtvThucPhamGcmsmsEntryComponent extends AbstractSopEntry implements OnChanges {

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
  
  // Form Rút Gọn chỉ hiển thị các hợp chất giống hệt SOP-01 (Fipronil & Chlorpyrifos)
  shortFormColumns = ['fipronil', 'fipronil_desulfinyl', 'fipronil_sulfide', 'fipronil_sulfone', 'chlorpyrifos', 'chlorpyrifos_methyl'];

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
    // TBVTV Thực Phẩm dùng 5 điểm chuẩn (C0–C4)
    this.initCalibrationPoints(5);
    this.initActiveCompound();

    // Thay đổi printFormType default thành formDayDu
    if (!this.draft.page1Data['printFormType']) {
      this.draft.page1Data['printFormType'] = 'formDayDu';
    }

    // Khởi tạo trạng thái checkbox m = 10.0 g mặc định là true (được chọn) nếu chưa có giá trị
    if (this.draft.page1Data['is10gChecked'] === undefined) {
      this.draft.page1Data['is10gChecked'] = true;
    }

    // Thiết lập khối lượng mặc định là 10.0g cho mọi mẫu
    if (!this.draft.page1Data['khoiLuong']) {
      this.draft.page1Data['khoiLuong'] = '10.0';
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

    // QC Initialization
    ['QC_SPIKE', 'QC_BLANK'].forEach(qc => {
      const qcRes = this.draft.resultData[qc];
      if (qcRes && !qcRes['khoiLuong']) {
        qcRes['khoiLuong'] = '10.0';
      }
    });

    if (this.draft.page1Data['uploadMassHunterToDrive'] === undefined) {
      this.draft.page1Data['uploadMassHunterToDrive'] = true;
    }

    if (!this.draft.page1Data['loaiMau']) {
      this.draft.page1Data['loaiMau'] = 'Thủy sản';
    }
  }

  // ── Override: mass default (10.0g) ─────────────
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

  // ── Override: View Mode Switcher ─────────────────────────────
  setPrintFormMode(type: 'formDayDu' | 'formRutGon') {
    this.draft.page1Data['printFormType'] = type;
    this.onDataChanged();
  }

  protected override onSetPrintFormType(type: 'formCheck' | 'formDon') {
    // Bắt buộc override từ abstract
  }

  // ── SPREADSHEET (FORM RÚT GỌN) METHODS ────────────────────────────

  applyBulkVials() {
    const rackStart = parseInt(String(this.bulkRackStart), 10);
    const vialStart = parseInt(String(this.bulkVialStartFip), 10);
    const perRack = parseInt(String(this.bulkVialsPerRack), 10);

    if (isNaN(rackStart) || isNaN(vialStart) || isNaN(perRack) || perRack <= 0) return;

    const visible = this.run?.sampleList || [];
    let currentRack = rackStart;
    let currentVial = vialStart;

    visible.forEach((sample: string) => {
      if (currentVial > perRack) {
        currentRack += 1;
        currentVial = 1;
      }
      if (!this.draft.resultData[sample]) {
        this.draft.resultData[sample] = { loSo: '', selected: true };
      }
      this.draft.resultData[sample]['loSo'] = `${currentRack}.${currentVial}`;
      currentVial += 1;
    });
    this.onDataChanged();
  }

  bulkFillND() {
    const allRowKeys = this.getDisplayRows().map(r => r.key);
    allRowKeys.forEach((key) => {
      if (!this.draft.resultData[key]) this.draft.resultData[key] = {};
      this.shortFormColumns.forEach((col: string) => {
        if (!this.draft.resultData[key][col] || this.draft.resultData[key][col].trim() === '') {
          this.draft.resultData[key][col] = 'ND';
        }
      });
    });
    this.onDataChanged();
  }

  bulkClearAll() {
    if (!confirm('Bạn có chắc chắn muốn xóa TOÀN BỘ kết quả trong bảng? Hành động này không thể hoàn tác!')) {
      return;
    }
    const allRowKeys = this.getDisplayRows().map(r => r.key);
    allRowKeys.forEach((key) => {
      if (this.draft.resultData[key]) {
        this.shortFormColumns.forEach((col: string) => {
          this.draft.resultData[key][col] = '';
        });
      }
    });
    this.onDataChanged();
  }

  copyRowToAll(sourceKey: string) {
    if (!this.draft.resultData[sourceKey]) return;
    const sourceData = this.draft.resultData[sourceKey];
    const allRowKeys = this.getDisplayRows().map(r => r.key);

    allRowKeys.forEach((key) => {
      if (key !== sourceKey && !key.startsWith('QC_')) {
        if (!this.draft.resultData[key]) this.draft.resultData[key] = {};
        this.shortFormColumns.forEach((col: string) => {
          if (sourceData[col] !== undefined) {
            this.draft.resultData[key][col] = sourceData[col];
          }
        });
      }
    });
    this.onDataChanged();
  }

  getDisplayRows() {
    const rows: {key: string, label: string, isQC: boolean}[] = [];
    rows.push({ key: 'QC_BLANK', label: this.draft.page1Data['blankName'] || 'BLANK', isQC: true });
    rows.push({ key: 'QC_SPIKE', label: this.draft.page1Data['spikeName'] || 'SPIKE', isQC: true });
    
    if (this.draft.page1Data['hasCheckSample']) {
      rows.push({ key: 'QC_CHECK', label: this.draft.page1Data['checkSampleName'] || 'CHECK_SAMPLE', isQC: true });
    }

    (this.run?.sampleList || []).forEach((sampleCode: string) => {
      rows.push({ key: sampleCode, label: sampleCode, isQC: false });
    });
    return rows;
  }

  handleGridNavigation(event: KeyboardEvent, rowIndex: number, colKey: string, colIndex: number) {
    navigateGrid(event, rowIndex, colKey, colIndex, this.getDisplayRows().length, this.shortFormColumns.length);
  }

  async importMassHunterExcel(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (this.draft.page1Data['uploadMassHunterToDrive']) {
        const uploadRes = await this.reportService.uploadRawFile(file, this.run?.runId);
        if (uploadRes && uploadRes.url) {
          this.draft.page1Data['massHunterExcelUrl'] = uploadRes.url;
          this.toast.success('Đã tải tệp Excel lên Google Drive');
        }
      }
    } catch (e) {
      console.warn('Could not upload excel to Drive', e);
    }

    try {
      const parsedData = await parseMassHunterWorkbook(file);
      let matchedCount = 0;
      
      const allRows = this.getDisplayRows();
      
      for (const row of allRows) {
        const rowData = this.draft.resultData[row.key];
        if (!rowData || !rowData['loSo']) continue;
        
        const rowVial = String(rowData['loSo']).trim();
        if (!rowVial) continue;

        const importedRow = parsedData.find(d => {
          const v = d['Vial'] || d['Data File'];
          if (!v) return false;
          const vStr = String(v).trim();
          return vStr === rowVial || vStr.includes(`-${rowVial}-`);
        });

        if (importedRow) {
          this.shortFormColumns.forEach(col => {
            let cellVal = importedRow[col] || importedRow[col.toLowerCase()];
            if (cellVal !== undefined) {
              if (typeof cellVal === 'number') {
                cellVal = cellVal.toFixed(this.decimalPlaces);
              }
              this.draft.resultData[row.key][col] = String(cellVal);
              matchedCount++;
            }
          });
        }
      }

      this.toast.success(`Đã trích xuất và điền ${matchedCount} kết quả từ tệp Excel.`);
      this.onDataChanged();
    } catch (err: any) {
      this.toast.error(`Lỗi đọc tệp Excel: ${err.message}`);
    }
    
    event.target.value = '';
  }

}
