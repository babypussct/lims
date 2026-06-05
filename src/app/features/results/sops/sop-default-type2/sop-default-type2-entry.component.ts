import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName } from '../../shared/compound-id-resolver';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { bulkFillND, bulkClearAll, copyRowToAll, navigateGrid } from '../shared/sop-grid-helper';

@Component({
  selector: 'app-sop-default-type2-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent],
  templateUrl: './sop-default-type2-entry.component.html'
})
export class SopDefaultType2EntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private masterTargetService = inject(MasterTargetService);
  masterTargets = signal<any[]>([]);
  columnDisplayNames = signal<Record<string, string>>({});
  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];

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
  }

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets());
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
      map[col] = this.formatColumnName(col);
    }
    this.columnDisplayNames.set(map);
  }

  onDataChanged() {
    this.draftChanged.emit(this.draft);
  }

  getDisplayRows(): any[] {
    const list: any[] = [];
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
    });
    return list;
  }

  bulkFillND() {
    bulkFillND(this.draft.resultData, this.run.sampleList, this.activeColumns);
    this.draft.page1Data['checkTatCaND'] = true;
    this.draft.page1Data['checkCoMauPhatHien'] = false;
    this.onDataChanged();
  }

  bulkClearAll() {
    bulkClearAll(this.draft.resultData, this.run.sampleList, this.activeColumns);
    this.onDataChanged();
  }

  copyRowToAll(sourceKey: string) {
    copyRowToAll(this.draft.resultData, this.run.sampleList, this.activeColumns, sourceKey);
    this.onDataChanged();
  }

  handleGridNavigation(event: KeyboardEvent, rowIdx: number, colName: string, colIdx: number) {
    const columnsList = ['loSo', ...this.activeColumns, 'ghiChu'];
    const rows = this.getDisplayRows();
    navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 0);
  }
}
