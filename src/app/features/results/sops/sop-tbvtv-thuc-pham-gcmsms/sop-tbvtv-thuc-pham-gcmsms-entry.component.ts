import { Component, signal, computed, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractSopEntry } from '../shared/abstract-sop-entry';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';

@Component({
  selector: 'app-sop-tbvtv-thuc-pham-gcmsms-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-tbvtv-thuc-pham-gcmsms-entry.component.html'
})
export class SopTbvtvThucPhamGcmsmsEntryComponent extends AbstractSopEntry implements OnChanges {

  // ── UI State đặc thù của SOP TBVTV Thực Phẩm ────────────────────────────
  activeTab = signal<'compounds' | 'chromatography'>('compounds');
  searchQuery = signal<string>('');

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

    // Khởi tạo R² mặc định nếu đang ở formDon
    if (this.draft.page1Data['printFormType'] === 'formDon' && !this.draft.page1Data['r2']) {
      this.draft.page1Data['r2'] = '0.999';
    }

    // Thiết lập khối lượng mặc định là 10.0g cho mọi mẫu
    if (!this.draft.page1Data['khoiLuong']) {
      this.draft.page1Data['khoiLuong'] = '10.0';
    }

    // Khởi tạo trạng thái checkbox m = 10.0 g mặc định là true (được chọn) nếu chưa có giá trị
    if (this.draft.page1Data['is10gChecked'] === undefined) {
      this.draft.page1Data['is10gChecked'] = true;
    }

    (this.run?.sampleList || []).forEach((sampleCode: string) => {
      const sRes = this.draft.resultData[sampleCode];
      if (sRes && !sRes['khoiLuong']) {
        sRes['khoiLuong'] = '10.0';
      }
    });

    const spike = this.draft.resultData['QC_SPIKE'];
    if (spike && !spike['khoiLuong']) {
      spike['khoiLuong'] = '10.0';
    }

    const blank = this.draft.resultData['QC_BLANK'];
    if (blank && !blank['khoiLuong']) {
      blank['khoiLuong'] = '10.0';
    }

    // Thiết lập loại mẫu mặc định cho thủy sản
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

  // ── Override: switch tab khi chuyển form type ─────────────────────────────
  protected override onSetPrintFormType(type: 'formCheck' | 'formDon') {
    if (type === 'formCheck') {
      this.activeTab.set('compounds');
    } else {
      this.activeTab.set('chromatography');
    }
  }
}
