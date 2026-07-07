import { Component, signal, computed, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractSopEntry } from '../shared/abstract-sop-entry';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';

@Component({
  selector: 'app-sop-nhom-i-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-nhom-i-entry.component.html'
})
export class SopNhomIEntryComponent extends AbstractSopEntry implements OnChanges {

  // ── UI State đặc thù của SOP Nhóm I ──────────────────────────────────
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
    // Nhóm I dùng 5 điểm chuẩn (C0–C4)
    this.initCalibrationPoints(5);
    this.initActiveCompound();

    // Khởi tạo R² mặc định nếu đang ở formDon
    if (this.draft.page1Data['printFormType'] === 'formDon' && !this.draft.page1Data['r2']) {
      this.draft.page1Data['r2'] = '0.999';
    }
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
