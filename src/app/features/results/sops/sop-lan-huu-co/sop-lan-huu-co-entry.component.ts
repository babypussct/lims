import { Component, signal, computed, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractSopEntry } from '../shared/abstract-sop-entry';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';

@Component({
  selector: 'app-sop-lan-huu-co-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-lan-huu-co-entry.component.html'
})
export class SopLanHuuCoEntryComponent extends AbstractSopEntry implements OnChanges {

  // ── UI State đặc thù của SOP Lân hữu cơ ──────────────────────────────────
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
    // Lân hữu cơ dùng 5 điểm chuẩn (C0–C4)
    this.initCalibrationPoints(5);
    this.initActiveCompound();

    // Khởi tạo R² mặc định nếu đang ở formDon
    if (this.draft.page1Data['printFormType'] === 'formDon' && !this.draft.page1Data['r2']) {
      this.draft.page1Data['r2'] = '0.999';
    }

    // Migration: đổi tên key Chlorpyryfos → Chlorpyrifos trong resultData cũ
    this.migrateChlorpyryfosKeys();
  }

  // ── Override: switch tab khi chuyển form type ─────────────────────────────
  protected override onSetPrintFormType(type: 'formCheck' | 'formDon') {
    if (type === 'formCheck') {
      this.activeTab.set('compounds');
    } else {
      this.activeTab.set('chromatography');
    }
  }

  // ── Migration cho data cũ ─────────────────────────────────────────────────
  /**
   * Migrate key cũ 'Chlorpyryfos' → 'Chlorpyrifos' trong resultData
   * (Dữ liệu cũ đã lưu sai chính tả)
   */
  private migrateChlorpyryfosKeys() {
    const migrationMap: Record<string, string> = {
      'Chlorpyryfos': 'chlorpyrifos',
      'Chlorpyryfos-methyl': 'chlorpyrifos_methyl',
      'Chlorpyrifos': 'chlorpyrifos',
      'Chlorpyrifos-methyl': 'chlorpyrifos_methyl'
    };

    (this.run?.sampleList || []).forEach((sampleCode: string) => {
      const sRes = this.draft.resultData[sampleCode];
      if (!sRes) return;

      Object.entries(migrationMap).forEach(([oldKey, newKey]) => {
        const SUFFIXES = ['', '_nd', '_qc1', '_qc2', '_qc3', '_ghiChu'];
        SUFFIXES.forEach(suffix => {
          const oldField = suffix ? `${oldKey}${suffix}` : oldKey;
          const newField = suffix ? `${newKey}${suffix}` : newKey;
          if (sRes[oldField] !== undefined) {
            if (sRes[newField] === undefined) sRes[newField] = sRes[oldField];
            delete sRes[oldField];
          }
        });
      });
    });
  }
}
