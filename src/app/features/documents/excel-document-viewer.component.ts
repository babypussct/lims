import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { LocaleType, mergeLocales } from '@univerjs/core';
import { createUniver } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import { UniverSheetsFilterPreset } from '@univerjs/preset-sheets-filter';
import { UniverSheetsFindReplacePreset } from '@univerjs/preset-sheets-find-replace';
import { UniverSheetsHyperLinkPreset } from '@univerjs/preset-sheets-hyper-link';
import { UniverSheetsNotePreset } from '@univerjs/preset-sheets-note';
import sheetsCoreViVN from '@univerjs/preset-sheets-core/locales/vi-VN';
import sheetsFilterViVN from '@univerjs/preset-sheets-filter/locales/vi-VN';
import sheetsFindReplaceViVN from '@univerjs/preset-sheets-find-replace/locales/vi-VN';
import sheetsHyperLinkViVN from '@univerjs/preset-sheets-hyper-link/locales/vi-VN';
import sheetsNoteViVN from '@univerjs/preset-sheets-note/locales/vi-VN';
import { StateService } from '../../core/services/state.service';
import { convertSheetJsWorkbookToUniver } from './excel-univer-converter';
import {
  EXCEL_UNSUPPORTED_FEATURE_LABELS,
  loadExcelWorkbookMetadata,
  type ExcelUnsupportedFeatureSummary,
  type ExcelWorkbookMetadata,
} from './excel-univer-metadata';

import '@univerjs/preset-sheets-core/lib/index.css';
import '@univerjs/preset-sheets-filter/lib/index.css';
import '@univerjs/preset-sheets-find-replace/lib/index.css';
import '@univerjs/preset-sheets-hyper-link/lib/index.css';
import '@univerjs/preset-sheets-note/lib/index.css';
import '@univerjs/sheets-filter/facade';
import '@univerjs/sheets-hyper-link/facade';
import '@univerjs/sheets-note/facade';

type UniverBundle = ReturnType<typeof createUniver>;
type UniverWorkbook = ReturnType<UniverBundle['univerAPI']['createWorkbook']>;

@Component({
  selector: 'app-excel-document-viewer',
  standalone: true,
  template: `
    <div class="excel-univer-shell">
      <div class="excel-readonly-bar">
        <div class="excel-readonly-badge" title="Bản xem trước không ghi thay đổi vào tệp gốc">
          <i class="fa-solid fa-lock"></i>
          <span>Chỉ đọc</span>
        </div>
        <span class="excel-readonly-copy">Xem công thức, filter, liên kết và ghi chú · không thay đổi tệp gốc</span>
        @if (metadataLimited()) {
          <span class="excel-metadata-warning"
                title="Định dạng Excel cũ chưa hỗ trợ đầy đủ freeze pane và metadata nâng cao">
            <i class="fa-solid fa-circle-info"></i>
            <span class="hidden sm:inline">Metadata giới hạn</span>
          </span>
        }
        @if (unsupportedFeatures().length) {
          <span class="excel-unsupported-warning"
                [title]="unsupportedFeatureWarning()">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span class="hidden sm:inline">Metadata chưa hỗ trợ</span>
          </span>
        }
        @if (truncatedSheets().length) {
          <span class="excel-limit-warning"
                [title]="'Đã giới hạn vùng xem ở: ' + truncatedSheets().join(', ')">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span class="hidden sm:inline">Giới hạn bản xem trước</span>
          </span>
        }
      </div>

      <div #univerHost
           class="excel-univer-host"
           tabindex="-1"
           role="region"
           aria-readonly="true"
           data-excel-readonly="true"
           aria-label="Bảng tính Excel chỉ đọc"></div>

      @if (loading()) {
        <div class="excel-loading-layer" aria-live="polite">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <strong>Đang dựng bảng tính...</strong>
          <span>Đang tải công thức, định dạng và các công cụ spreadsheet.</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }

    .excel-univer-shell {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      background: #fff;
    }

    .excel-readonly-bar {
      z-index: 3;
      min-height: 2rem;
      padding: .25rem .65rem;
      display: flex;
      align-items: center;
      gap: .55rem;
      flex: 0 0 auto;
      border-bottom: 1px solid #dbe4ee;
      background: #f8fafc;
      color: #64748b;
      font-size: 10px;
      font-weight: 650;
    }

    .excel-readonly-badge,
    .excel-metadata-warning,
    .excel-unsupported-warning,
    .excel-limit-warning {
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      white-space: nowrap;
      border-radius: .4rem;
      padding: .2rem .45rem;
      font-weight: 800;
    }

    .excel-readonly-badge {
      color: #047857;
      background: #d1fae5;
    }

    .excel-metadata-warning {
      margin-left: auto;
      color: #075985;
      background: #e0f2fe;
    }

    .excel-unsupported-warning {
      color: #92400e;
      background: #fef3c7;
    }

    .excel-limit-warning {
      color: #92400e;
      background: #fef3c7;
    }

    .excel-univer-host {
      position: relative;
      flex: 1 1 auto;
      width: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      outline: none;
    }

    .excel-loading-layer {
      position: absolute;
      inset: 2rem 0 0;
      z-index: 100;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: .45rem;
      padding: 1rem;
      background: rgba(255, 255, 255, .94);
      color: #64748b;
      text-align: center;
      font-size: 11px;
    }

    .excel-loading-layer i {
      margin-bottom: .3rem;
      color: #16a34a;
      font-size: 2rem;
    }

    .excel-loading-layer strong {
      color: #334155;
      font-size: 12px;
    }

    :host-context(.dark) .excel-univer-shell {
      background: #0f172a;
    }

    :host-context(.dark) .excel-readonly-bar {
      border-bottom-color: #334155;
      background: #111827;
      color: #94a3b8;
    }

    :host-context(.dark) .excel-readonly-badge {
      color: #6ee7b7;
      background: rgba(6, 78, 59, .65);
    }

    :host-context(.dark) .excel-metadata-warning {
      color: #7dd3fc;
      background: rgba(12, 74, 110, .55);
    }

    :host-context(.dark) .excel-unsupported-warning {
      color: #fcd34d;
      background: rgba(120, 53, 15, .55);
    }

    :host-context(.dark) .excel-limit-warning {
      color: #fcd34d;
      background: rgba(120, 53, 15, .55);
    }

    :host-context(.dark) .excel-loading-layer {
      background: rgba(15, 23, 42, .96);
      color: #94a3b8;
    }

    :host-context(.dark) .excel-loading-layer strong {
      color: #e2e8f0;
    }

    /* Univer also mounts a second top-level popup portal. Only size the
       application root; sizing every child creates a second 100% block and
       makes the sheet viewport scroll when a sheet tab receives focus. */
    :host ::ng-deep .excel-univer-host > div:first-child {
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
    }

    @media (max-width: 767px) {
      .excel-readonly-bar {
        min-height: 2.25rem;
        padding-inline: .5rem;
      }

      .excel-readonly-copy {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .excel-univer-shell {
        min-height: calc(2.75rem + max(env(safe-area-inset-bottom), .5rem));
        padding-bottom: max(env(safe-area-inset-bottom), .5rem);
      }
    }
  `],
})
export class ExcelDocumentViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) blob!: Blob;
  @Input() fileName = '';
  @Output() ready = new EventEmitter<void>();
  @Output() failed = new EventEmitter<string>();
  @ViewChild('univerHost', { static: true }) private univerHost!: ElementRef<HTMLDivElement>;

  readonly state = inject(StateService);
  readonly loading = signal(true);
  readonly truncatedSheets = signal<string[]>([]);
  readonly metadataLimited = signal(false);
  readonly unsupportedFeatures = signal<ExcelUnsupportedFeatureSummary[]>([]);
  readonly unsupportedFeatureWarning = computed(() => {
    const features = this.unsupportedFeatures().map(summary =>
      `${EXCEL_UNSUPPORTED_FEATURE_LABELS[summary.feature]} (${summary.count})`
    );
    return `Bản xem trước không giữ ${features.join(', ')}. Hãy kiểm tra tệp gốc nếu cần các metadata này.`;
  });

  private viewReady = false;
  private loadToken = 0;
  private univer?: UniverBundle['univer'];
  private univerAPI?: UniverBundle['univerAPI'];

  private readonly syncDarkMode = effect(() => {
    const dark = this.state.darkMode();
    this.univerAPI?.toggleDarkMode(dark);
  });

  ngAfterViewInit(): void {
    this.viewReady = true;
    void this.loadWorkbook();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blob'] && !changes['blob'].firstChange && this.viewReady) {
      void this.loadWorkbook();
    }
  }

  ngOnDestroy(): void {
    this.loadToken++;
    this.disposeUniver();
  }

  handleEscape(): boolean {
    const active = document.activeElement;
    if (active instanceof HTMLElement && this.univerHost.nativeElement.contains(active)) {
      active.blur();
    }
    // Univer is a complete viewer surface now; Escape should close the
    // surrounding preview modal on the first press instead of getting caught
    // in an invisible legacy focus mode.
    return false;
  }

  private async loadWorkbook(): Promise<void> {
    if (!this.blob || !this.viewReady) return;
    const token = ++this.loadToken;
    this.loading.set(true);
    this.truncatedSheets.set([]);
    this.metadataLimited.set(false);
    this.unsupportedFeatures.set([]);
    this.disposeUniver();

    try {
      const xlsx = await import('xlsx');
      const buffer = await this.blob.arrayBuffer();
      if (token !== this.loadToken) return;

      const workbook = xlsx.read(buffer, {
        type: 'array',
        cellDates: true,
        cellNF: true,
        cellText: true,
        cellStyles: true,
        sheetStubs: true,
        dense: false,
      });
      if (!workbook.SheetNames.length) throw new Error('Workbook không có worksheet.');

      const converted = convertSheetJsWorkbookToUniver(workbook, xlsx, this.fileName);
      if (token !== this.loadToken) return;
      this.truncatedSheets.set(converted.truncatedSheets);
      const metadataResult = await loadExcelWorkbookMetadata(buffer, this.fileName);
      if (token !== this.loadToken) return;
      this.metadataLimited.set(metadataResult.limited);
      this.unsupportedFeatures.set(metadataResult.metadata.unsupportedFeatures);
      if (metadataResult.blockingFeatures.length) {
        const labels = metadataResult.blockingFeatures.map(summary =>
          EXCEL_UNSUPPORTED_FEATURE_LABELS[summary.feature]
        );
        throw new Error(
          `Không thể mở bản xem trước vì tệp có ${labels.join(', ')} chưa được hỗ trợ; ` +
          'màu sắc nghiệp vụ có thể bị hiểu sai.'
        );
      }

      // Univer sizes its render engine synchronously when it mounts. The
      // preview modal can still be settling its flex layout at this point,
      // which occasionally gives Univer a 0x0 host and leaves a blank canvas
      // until the browser is resized. Wait for two paint frames with a
      // renderable host before creating the Univer instance.
      if (!(await this.waitForRenderableHost(token))) return;

      const instance = createUniver({
        locale: LocaleType.VI_VN,
        locales: {
          [LocaleType.VI_VN]: mergeLocales(
            sheetsCoreViVN,
            sheetsFilterViVN,
            sheetsFindReplaceViVN,
            sheetsHyperLinkViVN,
            sheetsNoteViVN,
          ),
        },
        darkMode: this.state.darkMode(),
        presets: [
          UniverSheetsCorePreset({
            container: this.univerHost.nativeElement,
            header: true,
            toolbar: false,
            ribbonType: 'classic',
            contextMenu: false,
            formulaBar: true,
            footer: {
              sheetBar: true,
              statisticBar: true,
              menus: true,
              zoomSlider: true,
              addSheetButtonConfig: { show: false },
            },
          }),
          UniverSheetsFilterPreset(),
          UniverSheetsFindReplacePreset(),
          UniverSheetsHyperLinkPreset(),
          UniverSheetsNotePreset(),
        ],
      });

      if (token !== this.loadToken) {
        instance.univer.dispose();
        return;
      }

      this.univer = instance.univer;
      this.univerAPI = instance.univerAPI;
      const previewWorkbook = instance.univerAPI.createWorkbook(converted.snapshot);
      await this.applyPreservedMetadata(previewWorkbook, metadataResult.metadata, converted.snapshot.sheets);
      if (token !== this.loadToken) return;
      // Keep both guards: the facade flag closes the editor surface while the
      // permission layer rejects keyboard input, paste, and edit commands.
      previewWorkbook.setEditable(false);
      await previewWorkbook.getWorkbookPermission().setReadOnly();
      instance.univerAPI.toggleDarkMode(this.state.darkMode());

      this.loading.set(false);
      this.ready.emit();
    } catch (error) {
      if (token !== this.loadToken) return;
      this.disposeUniver();
      this.loading.set(false);
      this.failed.emit(error instanceof Error ? error.message : 'Không thể đọc tệp Excel.');
    }
  }

  private async applyPreservedMetadata(
    previewWorkbook: UniverWorkbook,
    metadata: ExcelWorkbookMetadata,
    snapshotSheets: Parameters<UniverBundle['univerAPI']['createWorkbook']>[0]['sheets'],
  ): Promise<void> {
    const boundsByName = new Map<string, { rows: number; columns: number }>();
    for (const snapshotSheet of Object.values(snapshotSheets ?? {})) {
      if (!snapshotSheet?.name) continue;
      boundsByName.set(snapshotSheet.name, {
        rows: snapshotSheet.rowCount || 0,
        columns: snapshotSheet.columnCount || 0,
      });
    }

    for (const sheetMetadata of metadata.sheets) {
      const worksheet = previewWorkbook.getSheetByName(sheetMetadata.name);
      const bounds = boundsByName.get(sheetMetadata.name);
      if (!worksheet || !bounds?.rows || !bounds.columns) continue;

      if (sheetMetadata.freeze) {
        const xSplit = Math.min(sheetMetadata.freeze.xSplit, Math.max(0, bounds.columns - 1));
        const ySplit = Math.min(sheetMetadata.freeze.ySplit, Math.max(0, bounds.rows - 1));
        if (xSplit || ySplit) {
          worksheet.setFreeze({ xSplit, ySplit, startColumn: xSplit, startRow: ySplit });
        }
      }

      const filter = sheetMetadata.autoFilter;
      if (filter && filter.startRow < bounds.rows && filter.startColumn < bounds.columns) {
        const endRow = Math.min(filter.endRow, bounds.rows - 1);
        const endColumn = Math.min(filter.endColumn, bounds.columns - 1);
        worksheet.getRange(
          filter.startRow,
          filter.startColumn,
          endRow - filter.startRow + 1,
          endColumn - filter.startColumn + 1,
        ).createFilter();
      }

      for (const hyperlink of sheetMetadata.hyperlinks) {
        if (hyperlink.row >= bounds.rows || hyperlink.column >= bounds.columns) continue;
        const url = this.resolveExcelHyperlink(previewWorkbook, hyperlink.url);
        await worksheet.getRange(hyperlink.row, hyperlink.column).setHyperLink(url, hyperlink.label);
      }

      for (const note of sheetMetadata.notes) {
        if (note.row >= bounds.rows || note.column >= bounds.columns) continue;
        worksheet.getRange(note.row, note.column).createOrUpdateNote({
          id: `excel-note-${note.row}-${note.column}`,
          row: note.row,
          col: note.column,
          width: 180,
          height: 110,
          note: note.note,
          show: false,
        });
      }
    }
  }

  private resolveExcelHyperlink(previewWorkbook: UniverWorkbook, url: string): string {
    if (!url.startsWith('#')) return url;
    const target = url.slice(1);
    const match = /^(?:'((?:[^']|'')+)'|([^!]+))!(.+)$/.exec(target);
    if (!match) return url;

    const sheetName = (match[1] || match[2]).replace(/''/g, "'");
    const targetSheet = previewWorkbook.getSheetByName(sheetName);
    if (!targetSheet) return url;

    try {
      return targetSheet.getRange(match[3].replace(/\$/g, '')).getUrl();
    } catch {
      return url;
    }
  }

  private async waitForRenderableHost(token: number): Promise<boolean> {
    const maxFrames = 120;

    for (let frame = 0; frame < maxFrames; frame++) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (token !== this.loadToken) return false;

      const first = this.univerHost.nativeElement.getBoundingClientRect();
      if (first.width <= 1 || first.height <= 1) continue;

      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (token !== this.loadToken) return false;

      const second = this.univerHost.nativeElement.getBoundingClientRect();
      if (second.width > 1 && second.height > 1) return true;
    }

    throw new Error('Vùng xem Excel chưa có kích thước hiển thị hợp lệ.');
  }

  private disposeUniver(): void {
    this.univerAPI = undefined;
    if (this.univer) {
      this.univer.dispose();
      this.univer = undefined;
    }
    if (this.univerHost?.nativeElement) {
      this.univerHost.nativeElement.replaceChildren();
    }
  }
}
