import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { ToastService } from '../../../../core/services/toast.service';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName } from '../../shared/compound-id-resolver';
import { SopHeaderMetadataComponent } from '../shared/sop-header-metadata.component';
import { SopSpreadsheetToolbarComponent } from '../shared/sop-spreadsheet-toolbar.component';
import { bulkFillND, bulkClearAll, copyRowToAll, navigateGrid } from '../shared/sop-grid-helper';
import { isMobileViewport } from '../../../../core/utils/viewport.utils';
import {
  GridPasteController,
  GridPasteGridSpec,
  WriteGuardContext,
} from '../shared/sop-paste-undo';

@Component({
  selector: 'app-sop-default-type2-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SopHeaderMetadataComponent, SopSpreadsheetToolbarComponent],
  templateUrl: './sop-default-type2-entry.component.html'
})
export class SopDefaultType2EntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Input() isReadOnly = false;
  @Input() publishedSampleSet: Set<string> | null = null;
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private auth = inject(AuthService);
  private confirmation = inject(ConfirmationService);
  private toast = inject(ToastService);
  private masterTargetService = inject(MasterTargetService);
  masterTargets = signal<any[]>([]);
  columnDisplayNames = signal<Record<string, string>>({});
  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];
  mobileViewMode = signal<'table' | 'cards'>(isMobileViewport() ? 'cards' : 'table');
  pasteCtrl = new GridPasteController();

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
      map[col] = this.formatColumnName(col);
    }
    this.columnDisplayNames.set(map);
  }

  onDataChanged() {
    if (this.isReadOnly) return;
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
    if (this.isReadOnly) return;
    bulkFillND(this.draft.resultData, this.run.sampleList, this.activeColumns);
    this.draft.page1Data['checkTatCaND'] = true;
    this.draft.page1Data['checkCoMauPhatHien'] = false;
    this.onDataChanged();
  }

  bulkClearAll() {
    if (this.isReadOnly) return;
    bulkClearAll(this.draft.resultData, this.run.sampleList, this.activeColumns);
    this.onDataChanged();
  }

  copyRowToAll(sourceKey: string) {
    if (this.isReadOnly) return;
    copyRowToAll(this.draft.resultData, this.run.sampleList, this.activeColumns, sourceKey);
    this.onDataChanged();
  }

  handleGridNavigation(event: KeyboardEvent, rowIdx: number, colName: string, colIdx: number) {
    const columnsList = ['loSo', ...this.activeColumns, 'ghiChu'];
    const rows = this.getDisplayRows();
    navigateGrid(event, rowIdx, colIdx, columnsList, rows.length, 0);
  }

  private getWriteGuard(): WriteGuardContext {
    return {
      canEdit: this.auth.isManager() || this.auth.canRunBatch() || this.auth.canApprove(),
      isReadOnly: this.isReadOnly,
      isLockedByOthers: false,
      isCompleted: this.draft?.status === 'completed',
    };
  }

  private buildPasteGridSpec(startRowIndex: number, startColIndex: number): GridPasteGridSpec {
    const rows = this.getDisplayRows().map(r => ({ rowKey: r.key, rowLabel: r.label }));
    const columns = [
      { colKey: 'loSo', colLabel: 'Lọ số' },
      ...this.activeColumns.map(c => ({ colKey: c, colLabel: this.columnDisplayNames()[c] || c })),
      { colKey: 'ghiChu', colLabel: 'Ghi chú' },
    ];
    return {
      rows,
      columns,
      startRowIndex,
      startColIndex,
      minNumericValue: 0,
      allowTextNotesForCol: colKey => colKey === 'loSo' || colKey === 'ghiChu',
      getCellSpec: (rowKey, colKey) => ({
        rowKey,
        rowLabel: rowKey,
        colKey,
        colLabel: columns.find(c => c.colKey === colKey)?.colLabel || colKey,
        editable: !this.isReadOnly,
        assigned: true,
      }),
      readCell: (rowKey, colKey) => ({ value: String(this.draft?.resultData?.[rowKey]?.[colKey] ?? '') }),
    };
  }

  private writeCell = (rowKey: string, colKey: string, value: string) => {
    if (!this.draft.resultData[rowKey]) this.draft.resultData[rowKey] = { selected: true };
    this.draft.resultData[rowKey][colKey] = value;
  };

  async openClipboardPaste() {
    if (this.isReadOnly) return;
    try {
      const text = await navigator.clipboard?.readText?.();
      if (!text) {
        this.toast.show('Clipboard trống.', 'warning');
        return;
      }
      const res = this.pasteCtrl.planOrApply(text, this.buildPasteGridSpec(0, 1), this.getWriteGuard(), this.writeCell);
      if (res.error) this.toast.show(res.error, 'error');
      else if (res.applied) {
        this.onDataChanged();
        this.toast.show(`Đã dán ${res.count} ô dữ liệu.`, 'success');
      }
    } catch {
      this.toast.show('Hãy chọn một ô và nhấn Ctrl+V để dán từ Excel.', 'info');
    }
  }

  onCellPaste(event: ClipboardEvent, rowIdx: number, colIdx: number) {
    if (this.isReadOnly) {
      event.preventDefault();
      return;
    }
    const text = event.clipboardData?.getData('text/plain') || '';
    if (!text.includes('\t') && !text.includes('\n')) return;
    event.preventDefault();
    const res = this.pasteCtrl.planOrApply(text, this.buildPasteGridSpec(rowIdx, colIdx), this.getWriteGuard(), this.writeCell);
    if (res.error) this.toast.show(res.error, 'error');
    else if (res.applied) {
      this.onDataChanged();
      this.toast.show(`Đã dán ${res.count} ô dữ liệu.`, 'success');
    }
  }

  confirmPendingPaste() {
    const res = this.pasteCtrl.confirmPending(this.getWriteGuard());
    if (res.applied) {
      this.onDataChanged();
      this.toast.show(`Đã dán ${res.count} ô dữ liệu.`, 'success');
    } else if (res.error) {
      this.toast.show(res.error, 'error');
    }
  }

  undoLastPaste() {
    if (this.isReadOnly) return;
    const res = this.pasteCtrl.undoLast(
      this.getWriteGuard(),
      (rowKey, colKey) => ({ value: String(this.draft?.resultData?.[rowKey]?.[colKey] ?? '') }),
      this.writeCell
    );
    if (res.undone) {
      this.onDataChanged();
      this.toast.show(`Đã hoàn tác ${res.restoredCount} ô vừa dán.`, 'success');
    } else if (res.reason) {
      this.toast.show(res.reason, 'warning');
    }
  }

  async confirmClearAll() {
    if (this.isReadOnly) return;
    const ok = await this.confirmation.confirm({
      message: 'Xóa toàn bộ kết quả đã nhập trên bảng này?',
      confirmText: 'Xóa bảng',
      isDangerous: true,
    });
    if (ok) {
      this.pasteCtrl.bumpRevision();
      this.pasteCtrl.reset();
      this.bulkClearAll();
    }
  }
}
