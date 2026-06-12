import { Component, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractSopEntry } from '../shared/abstract-sop-entry';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopCalibrationPointsComponent } from '../shared/sop-calibration-points.component';

@Component({
  selector: 'app-sop-nhom-lan-huu-co-gc-msms-copy-1768036876719-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopCalibrationPointsComponent],
  templateUrl: './sop-nhom-lan-huu-co-gc-msms-copy-1768036876719-entry.component.html'
})
export class SopNhomLanHuuCoGcMsmsCopy1768036876719EntryComponent extends AbstractSopEntry implements OnChanges {

  // ── SOP-specific initialization ───────────────────────────────────────────
  protected override onSopSpecificInit() {
    // Chlor hữu cơ GC-MSMS dùng 5 điểm chuẩn (C0–C4)
    this.initCalibrationPoints(5);
    this.initActiveCompound();

    // Khởi tạo R² mặc định nếu đang ở formDon
    if (this.draft.page1Data['printFormType'] === 'formDon' && !this.draft.page1Data['r2']) {
      this.draft.page1Data['r2'] = '0.999';
    }
  }
}
