import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  CellFocusedEvent,
  CellKeyDownEvent,
  CellMouseDownEvent,
  CellMouseOverEvent,
  ColDef,
  ColumnHeaderClickedEvent,
  GridApi,
  GridReadyEvent,
  FullWidthCellKeyDownEvent,
  ModuleRegistry,
  RowHeightParams,
  themeBalham,
} from 'ag-grid-community';
import type { WorkBook, WorkSheet } from 'xlsx';
import { StateService } from '../../core/services/state.service';
import { ExcelViewerRow } from './document-viewer.models';

ModuleRegistry.registerModules([AllCommunityModule]);

interface GridPoint {
  row: number;
  column: number;
}

interface GridSelection {
  anchor: GridPoint;
  focus: GridPoint;
}

interface SheetMerge {
  s: { r: number; c: number };
  e: { r: number; c: number };
}

type ExcelFilterOperator = 'contains' | 'equals' | 'notEmpty';
type ExcelSortDirection = 'none' | 'asc' | 'desc';

interface ExcelColumnOption {
  column: number;
  label: string;
}

@Component({
  selector: 'app-excel-document-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <div class="relative h-full min-h-0 flex flex-col bg-white dark:bg-slate-900"
         [attr.data-ag-theme-mode]="state.darkMode() ? 'dark' : 'light'">
      <div class="min-h-11 shrink-0 flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <button type="button" (click)="copySelection()"
                class="excel-tool-button shrink-0"
                [disabled]="!selection()"
                title="Sao chép vùng đã chọn (Ctrl+C)">
          <i class="fa-regular fa-copy"></i>
          <span class="hidden sm:inline">Sao chép</span>
        </button>

        <button type="button" (click)="fitSheetToContent()"
                class="excel-tool-button shrink-0"
                title="Tự dãn cột và hàng vừa khít nội dung">
          <i class="fa-solid fa-arrows-left-right-to-line"></i>
          <span class="hidden md:inline">Vừa nội dung</span>
        </button>

        <button type="button" (click)="toggleFilterPanel()"
                class="excel-tool-button shrink-0"
                [class.excel-tool-active]="activeTransformCount() > 0 || filterPanelOpen()"
                title="Lọc và sắp xếp các dòng dữ liệu">
          <i class="fa-solid fa-arrow-down-wide-short"></i>
          <span class="hidden sm:inline">Lọc & sắp xếp</span>
          @if (activeTransformCount() > 0) {
            <span class="min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] inline-flex items-center justify-center">
              {{ activeTransformCount() }}
            </span>
          }
        </button>

        <span class="hidden lg:inline-flex items-center h-7 px-2 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
          <i class="fa-solid fa-lock mr-1.5"></i>Chỉ đọc · không thay đổi tệp gốc
        </span>

        <div class="relative flex-1 sm:flex-none sm:w-72 ml-auto">
          <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input #sheetSearch type="search" [ngModel]="searchQuery()"
                 (ngModelChange)="onSearch($event)"
                 (keydown.enter)="onSearchEnter($event)"
                 placeholder="Tìm trong trang tính..."
                 class="w-full h-8 pl-8 pr-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 dark:text-white">
          @if (searchQuery()) {
            <span class="absolute right-16 top-1/2 -translate-y-1/2 text-[10px] font-bold tabular-nums text-slate-500 dark:text-slate-300">
              {{ searchPositionLabel() }}
            </span>
            <div class="absolute right-1 top-1/2 -translate-y-1/2 flex">
              <button type="button" (click)="goToSearchMatch(-1)" [disabled]="!searchMatches().length"
                      class="excel-search-button" aria-label="Kết quả trước" title="Kết quả trước (Shift+Enter)">
                <i class="fa-solid fa-chevron-up"></i>
              </button>
              <button type="button" (click)="goToSearchMatch(1)" [disabled]="!searchMatches().length"
                      class="excel-search-button" aria-label="Kết quả tiếp theo" title="Kết quả tiếp theo (Enter)">
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <button type="button" (click)="onSearch('')" class="excel-search-button"
                      aria-label="Xóa tìm kiếm" title="Xóa tìm kiếm">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          }
        </div>
      </div>

      @if (filterPanelOpen()) {
        <button type="button" class="absolute inset-0 z-40 bg-transparent cursor-default"
                (click)="filterPanelOpen.set(false)" aria-label="Đóng bảng lọc"></button>
        <section class="excel-filter-panel absolute z-50 top-12 left-2 right-2 sm:left-auto sm:right-3 sm:w-[430px]"
                 role="dialog" aria-label="Lọc và sắp xếp dữ liệu">
          <div class="flex items-start justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="text-sm font-black text-slate-800 dark:text-white">Lọc & sắp xếp</h3>
              <p class="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                Chỉ áp dụng cho các dòng dữ liệu, giữ nguyên tiêu đề và tệp gốc.
              </p>
            </div>
            <button type="button" (click)="filterPanelOpen.set(false)"
                    class="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Đóng"><i class="fa-solid fa-times"></i></button>
          </div>

          <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="sm:col-span-2 filter-field">
              <span>Cột dữ liệu</span>
              <select [ngModel]="filterColumn()" (ngModelChange)="filterColumn.set(+$event)">
                @for (option of filterColumnOptions(); track option.column) {
                  <option [ngValue]="option.column">{{ option.label }}</option>
                }
              </select>
            </label>

            <label class="filter-field">
              <span>Điều kiện lọc</span>
              <select [ngModel]="filterOperator()" (ngModelChange)="filterOperator.set($event)">
                <option value="contains">Có chứa</option>
                <option value="equals">Bằng chính xác</option>
                <option value="notEmpty">Không trống</option>
              </select>
            </label>

            <label class="filter-field" [class.opacity-50]="filterOperator() === 'notEmpty'">
              <span>Giá trị</span>
              <input type="text" [ngModel]="filterValue()" (ngModelChange)="filterValue.set($event)"
                     [disabled]="filterOperator() === 'notEmpty'"
                     (keydown.enter)="applyFilterAndSort()"
                     placeholder="Nhập nội dung cần lọc">
            </label>

            <fieldset class="sm:col-span-2">
              <legend class="text-[10px] uppercase tracking-wide font-black text-slate-500 dark:text-slate-400 mb-1.5">
                Thứ tự
              </legend>
              <div class="grid grid-cols-3 gap-1.5">
                <button type="button" class="sort-choice" [class.sort-choice-active]="sortDirection() === 'none'"
                        (click)="sortDirection.set('none')">Mặc định</button>
                <button type="button" class="sort-choice" [class.sort-choice-active]="sortDirection() === 'asc'"
                        (click)="sortDirection.set('asc')">
                  <i class="fa-solid fa-arrow-up-a-z mr-1"></i>Tăng dần
                </button>
                <button type="button" class="sort-choice" [class.sort-choice-active]="sortDirection() === 'desc'"
                        (click)="sortDirection.set('desc')">
                  <i class="fa-solid fa-arrow-down-z-a mr-1"></i>Giảm dần
                </button>
              </div>
            </fieldset>
          </div>

          <div class="flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-700">
            <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {{ filteredRowsLabel() }}
            </span>
            <div class="flex gap-2">
              <button type="button" (click)="clearFilterAndSort()"
                      class="h-8 px-3 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800">
                Xóa lọc
              </button>
              <button type="button" (click)="applyFilterAndSort()"
                      class="h-8 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm">
                Áp dụng
              </button>
            </div>
          </div>
        </section>
      }

      <div class="h-9 shrink-0 grid grid-cols-[70px_minmax(0,1fr)] border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
        <div class="flex items-center justify-center border-r border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 tabular-nums px-1">
          {{ selectedAddress() }}
        </div>
        <div class="min-w-0 flex items-center">
          <span class="w-8 h-full flex items-center justify-center text-xs italic font-serif text-slate-400 border-r border-slate-200 dark:border-slate-700">fx</span>
          <div class="min-w-0 flex-1 px-2.5 text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap overflow-x-auto scrollbar-none">
            {{ selectedFormula() || 'Chọn một ô để xem giá trị hoặc công thức' }}
          </div>
        </div>
      </div>

      <div class="flex-1 min-h-0 relative">
        @if (loading()) {
          <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-emerald-500"></i>
            <span class="mt-2 text-xs font-semibold text-slate-500">Đang đọc workbook...</span>
          </div>
        }
        <ag-grid-angular
          class="w-full h-full excel-preview-grid"
          [theme]="gridTheme"
          [rowData]="rowData()"
          [columnDefs]="columnDefs()"
          [defaultColDef]="defaultColDef"
          [headerHeight]="29"
          [animateRows]="false"
          [ensureDomOrder]="true"
          [enableCellTextSelection]="false"
          [suppressRowClickSelection]="true"
          [suppressContextMenu]="true"
          [suppressDragLeaveHidesColumns]="true"
          [suppressColumnMoveAnimation]="true"
          [getRowHeight]="getRowHeight"
          (gridReady)="onGridReady($event)"
          (cellFocused)="onCellFocused($event)"
          (cellMouseDown)="onCellMouseDown($event)"
          (cellMouseOver)="onCellMouseOver($event)"
          (cellKeyDown)="onCellKeyDown($event)"
          (columnHeaderClicked)="onColumnHeaderClicked($event)">
        </ag-grid-angular>
      </div>

      <div class="excel-sheet-tabs relative z-20 shrink-0 flex items-center bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-700">
        <div class="flex-1 min-w-0 h-full flex items-center overflow-x-auto overscroll-x-contain scrollbar-none px-1">
          @for (sheetName of sheetNames(); track sheetName) {
            <button type="button" (click)="selectSheet(sheetName)"
                    role="tab"
                    [attr.aria-selected]="activeSheet() === sheetName"
                    class="h-8 px-3 border-r border-slate-200 dark:border-slate-700 text-[11px] font-bold whitespace-nowrap transition-colors"
                    [class.bg-white]="activeSheet() === sheetName"
                    [class.dark:bg-slate-800]="activeSheet() === sheetName"
                    [class.text-emerald-700]="activeSheet() === sheetName"
                    [class.text-slate-500]="activeSheet() !== sheetName">
              {{ sheetName }}
            </button>
          }
        </div>
        <div class="h-full shrink-0 flex items-center gap-2 px-2.5 border-l border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          @if (copyStatus()) {
            <span class="text-emerald-700 dark:text-emerald-300">
              <i class="fa-solid fa-check mr-1"></i>{{ copyStatus() }}
            </span>
          } @else {
            <span class="hidden sm:inline tabular-nums">{{ selectionSummary() }}</span>
          }
          @if (truncated()) {
            <span class="text-amber-600 dark:text-amber-400" title="Bảng quá lớn nên bản xem trước đã được giới hạn">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i>Giới hạn xem
            </span>
          }
          <span class="tabular-nums">{{ dimensionsLabel() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .excel-tool-button {
      height: 2rem;
      padding-inline: .65rem;
      border-radius: .5rem;
      border: 1px solid #cbd5e1;
      color: #475569;
      display: inline-flex;
      align-items: center;
      gap: .4rem;
      font-size: .7rem;
      font-weight: 800;
    }
    .excel-tool-button:hover:not(:disabled) { color: #047857; border-color: #6ee7b7; background: #ecfdf5; }
    .excel-tool-button:disabled { opacity: .4; cursor: not-allowed; }
    .excel-tool-active {
      color: #047857;
      border-color: #6ee7b7;
      background: #ecfdf5;
    }
    .excel-filter-panel {
      border-radius: .85rem;
      border: 1px solid #cbd5e1;
      background: #fff;
      box-shadow: 0 18px 50px rgba(15, 23, 42, .22);
      overflow: hidden;
    }
    .filter-field {
      display: flex;
      flex-direction: column;
      gap: .35rem;
    }
    .filter-field > span {
      font-size: .625rem;
      line-height: 1rem;
      text-transform: uppercase;
      letter-spacing: .04em;
      font-weight: 900;
      color: #64748b;
    }
    .filter-field select,
    .filter-field input {
      width: 100%;
      height: 2.25rem;
      border: 1px solid #cbd5e1;
      border-radius: .55rem;
      padding-inline: .65rem;
      background: #fff;
      color: #334155;
      font-size: .75rem;
      outline: none;
    }
    .filter-field select:focus,
    .filter-field input:focus {
      border-color: #34d399;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, .13);
    }
    .sort-choice {
      min-height: 2.25rem;
      padding: .35rem .5rem;
      border: 1px solid #cbd5e1;
      border-radius: .55rem;
      color: #64748b;
      font-size: .68rem;
      font-weight: 800;
    }
    .sort-choice:hover { border-color: #6ee7b7; color: #047857; }
    .sort-choice-active {
      border-color: #34d399;
      color: #047857;
      background: #ecfdf5;
      box-shadow: inset 0 0 0 1px #34d399;
    }
    .excel-search-button {
      width: 1.25rem;
      height: 1.6rem;
      color: #64748b;
      border-radius: .25rem;
      font-size: .58rem;
    }
    .excel-search-button:hover:not(:disabled) { color: #047857; background: #d1fae5; }
    .excel-search-button:disabled { opacity: .35; }
    :host ::ng-deep .excel-preview-grid .ag-root-wrapper {
      border: 0 !important;
      border-radius: 0 !important;
    }
    :host ::ng-deep .excel-preview-grid .ag-header-cell {
      font-size: 11px;
      font-weight: 700;
      justify-content: center;
      border-right: 1px solid #dbe3ec;
      user-select: none;
      cursor: default;
    }
    :host ::ng-deep .excel-preview-grid .ag-header-cell.excel-selected-header {
      background: #d1fae5 !important;
      color: #047857 !important;
      box-shadow: inset 0 -2px #10b981;
    }
    :host ::ng-deep .excel-preview-grid .ag-cell {
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
      padding-inline: 6px;
      user-select: none;
      cursor: cell;
    }
    :host ::ng-deep .excel-preview-grid .excel-row-number {
      background: #f8fafc;
      color: #64748b;
      text-align: center;
      font-variant-numeric: tabular-nums;
      border-right: 1px solid #cbd5e1;
      cursor: default;
    }
    :host ::ng-deep .excel-preview-grid .excel-selected-row-header {
      background: #d1fae5 !important;
      color: #047857 !important;
      font-weight: 800;
      box-shadow: inset -2px 0 #10b981;
    }
    :host ::ng-deep .excel-preview-grid .excel-selected-cell::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: rgba(37, 99, 235, .16);
    }
    :host ::ng-deep .excel-preview-grid .excel-active-cell {
      z-index: 3;
      outline: 2px solid #16a34a !important;
      outline-offset: -2px;
    }
    :host ::ng-deep .excel-preview-grid .excel-search-match {
      box-shadow: inset 0 0 0 2px #facc15;
      background-image: linear-gradient(rgba(254, 240, 138, .32), rgba(254, 240, 138, .32));
    }
    :host ::ng-deep .excel-preview-grid .excel-search-active {
      box-shadow: inset 0 0 0 3px #f97316;
      background-image: linear-gradient(rgba(253, 186, 116, .38), rgba(253, 186, 116, .38));
      z-index: 2;
    }
    :host ::ng-deep .excel-preview-grid .ag-cell-focus {
      border-color: #e2e8f0 !important;
    }
    :host ::ng-deep .excel-preview-grid .ag-cell-focus.excel-active-cell {
      border-color: transparent !important;
    }
    :host-context(.dark) .excel-tool-button { color: #cbd5e1; border-color: #475569; }
    :host-context(.dark) .excel-tool-active { color: #6ee7b7; border-color: #047857; background: rgba(6, 78, 59, .4); }
    :host-context(.dark) .excel-filter-panel { background: #1e293b; border-color: #475569; }
    :host-context(.dark) .filter-field select,
    :host-context(.dark) .filter-field input {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }
    :host-context(.dark) .sort-choice { border-color: #475569; color: #cbd5e1; }
    :host-context(.dark) .sort-choice-active { color: #6ee7b7; border-color: #059669; background: rgba(6, 78, 59, .45); }
    :host-context(.dark) ::ng-deep .excel-preview-grid .ag-header-cell,
    :host-context(.dark) ::ng-deep .excel-preview-grid .ag-cell {
      border-color: #334155;
    }
    :host-context(.dark) ::ng-deep .excel-preview-grid .excel-row-number {
      background: #0f172a;
      color: #94a3b8;
      border-right-color: #475569;
    }
    :host-context(.dark) ::ng-deep .excel-preview-grid .excel-selected-cell::after {
      background: rgba(59, 130, 246, .28);
    }
    @media (max-width: 640px) {
      :host ::ng-deep .excel-preview-grid .ag-cell { font-size: 11px; padding-inline: 5px; }
    }
    .excel-sheet-tabs {
      height: 2.25rem;
      min-height: 2.25rem;
    }
    @media (max-width: 767px) {
      .excel-sheet-tabs {
        height: auto;
        min-height: calc(2.25rem + env(safe-area-inset-bottom));
        padding-bottom: env(safe-area-inset-bottom);
      }
    }
  `],
})
export class ExcelDocumentViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) blob!: Blob;
  @Input() fileName = '';
  @Output() ready = new EventEmitter<void>();
  @Output() failed = new EventEmitter<string>();

  readonly state = inject(StateService);
  readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  readonly gridTheme = themeBalham
    .withParams({
      accentColor: '#16a34a',
      backgroundColor: '#ffffff',
      foregroundColor: '#334155',
      borderColor: '#e2e8f0',
      headerBackgroundColor: '#f3f6f9',
      headerTextColor: '#475569',
      oddRowBackgroundColor: '#ffffff',
      fontFamily: 'Aptos, Calibri, Arial, sans-serif',
      fontSize: 12,
      spacing: 3,
    }, 'light')
    .withParams({
      accentColor: '#4ade80',
      backgroundColor: '#1e293b',
      foregroundColor: '#e2e8f0',
      borderColor: '#334155',
      headerBackgroundColor: '#0f172a',
      headerTextColor: '#cbd5e1',
      oddRowBackgroundColor: '#1e293b',
      fontFamily: 'Aptos, Calibri, Arial, sans-serif',
      fontSize: 12,
      spacing: 3,
    }, 'dark');

  readonly defaultColDef: ColDef<ExcelViewerRow> = {
    resizable: true,
    minWidth: 28,
    suppressMovable: true,
    sortable: false,
    filter: false,
  };

  loading = signal(true);
  sheetNames = signal<string[]>([]);
  activeSheet = signal('');
  rowData = signal<ExcelViewerRow[]>([]);
  columnDefs = signal<ColDef<ExcelViewerRow>[]>([]);
  searchQuery = signal('');
  searchMatches = signal<GridPoint[]>([]);
  activeSearchIndex = signal(-1);
  selection = signal<GridSelection | null>(null);
  selectedAddress = signal('A1');
  selectedFormula = signal('');
  copyStatus = signal('');
  truncated = signal(false);
  visibleRows = signal(0);
  visibleColumns = signal(0);
  filterPanelOpen = signal(false);
  filterColumnOptions = signal<ExcelColumnOption[]>([]);
  filterColumn = signal(0);
  filterOperator = signal<ExcelFilterOperator>('contains');
  filterValue = signal('');
  sortDirection = signal<ExcelSortDirection>('none');
  activeFilter = signal<{ column: number; operator: ExcelFilterOperator; value: string } | null>(null);
  activeSort = signal<{ column: number; direction: Exclude<ExcelSortDirection, 'none'> } | null>(null);
  filteredDataRows = signal(0);

  dimensionsLabel = computed(() =>
    `${this.visibleRows().toLocaleString('vi-VN')} dòng · ${this.visibleColumns()} cột`
  );
  activeTransformCount = computed(() =>
    (this.activeFilter() ? 1 : 0) + (this.activeSort() ? 1 : 0)
  );
  filteredRowsLabel = computed(() => {
    const total = Math.max(0, this.dataEndIndex - this.dataStartIndex);
    if (!this.activeFilter() && !this.activeSort()) return `${total.toLocaleString('vi-VN')} dòng dữ liệu`;
    return `Đang hiển thị ${this.filteredDataRows().toLocaleString('vi-VN')} / ${total.toLocaleString('vi-VN')} dòng`;
  });
  searchPositionLabel = computed(() => {
    const count = this.searchMatches().length;
    return count ? `${this.activeSearchIndex() + 1}/${count}` : '0/0';
  });
  selectionSummary = computed(() => {
    const rect = this.selectionRect();
    if (!rect) return 'Chưa chọn vùng';
    const count = (rect.bottom - rect.top + 1) * (rect.right - rect.left + 1);
    return count === 1 ? '1 ô' : `${count.toLocaleString('vi-VN')} ô`;
  });

  readonly getRowHeight = (params: RowHeightParams<ExcelViewerRow>): number =>
    Math.min(160, Math.max(24, Number(params.data?.['__height']) || 28));

  private workbook?: WorkBook;
  private worksheet?: WorkSheet;
  private xlsx?: typeof import('xlsx');
  private gridApi?: GridApi<ExcelViewerRow>;
  private viewReady = false;
  private loadToken = 0;
  private searchToken = 0;
  private searchTimer?: ReturnType<typeof setTimeout>;
  private copyTimer?: ReturnType<typeof setTimeout>;
  private dragging = false;
  private visibleSheetColumns: number[] = [];
  private mergeAnchors = new Map<string, SheetMerge>();
  private mergeCovered = new Set<string>();
  private mergeSources = new Map<string, { row: number; column: number }>();
  private matchKeys = new Set<string>();
  private activeMatchKey = '';
  private baseRows: ExcelViewerRow[] = [];
  private dataStartIndex = 0;
  private dataEndIndex = 0;
  private fittedColumnWidths: number[] = [];
  private measurementContext?: CanvasRenderingContext2D | null;
  private readonly textWidthCache = new Map<string, number>();

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
    if (this.searchTimer) clearTimeout(this.searchTimer);
    if (this.copyTimer) clearTimeout(this.copyTimer);
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    this.dragging = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.filterPanelOpen.set(false);
  }

  @HostListener('document:copy', ['$event'])
  onDocumentCopy(event: ClipboardEvent): void {
    if (!this.host.nativeElement.contains(document.activeElement) || !this.selection()) return;
    const text = this.selectionText();
    if (!text || !event.clipboardData) return;
    event.preventDefault();
    event.clipboardData.setData('text/plain', text);
    event.clipboardData.setData('text/tab-separated-values', text);
    this.showCopyStatus();
  }

  onGridReady(event: GridReadyEvent<ExcelViewerRow>): void {
    this.gridApi = event.api;
    this.refreshGridDecorations();
  }

  onCellFocused(event: CellFocusedEvent<ExcelViewerRow>): void {
    if (event.rowIndex === null || !event.column || !this.xlsx || !this.worksheet) return;
    const colId = typeof event.column === 'string' ? event.column : event.column.getColId();
    if (!colId.startsWith('c')) return;
    const relativeColumn = Number(colId.slice(1));
    this.updateFormulaBar({ row: event.rowIndex, column: relativeColumn });
  }

  onCellMouseDown(event: CellMouseDownEvent<ExcelViewerRow>): void {
    if (event.rowIndex === null) return;
    const mouseEvent = event.event as MouseEvent | undefined;
    if (mouseEvent && mouseEvent.button !== 0) return;
    const colId = event.column.getColId();
    if (colId === '__rowNumber') {
      this.selectRows(event.rowIndex, event.rowIndex, Boolean(mouseEvent?.shiftKey));
      this.dragging = false;
      return;
    }
    if (!colId.startsWith('c')) return;
    const point = { row: event.rowIndex, column: Number(colId.slice(1)) };
    this.beginSelection(point, Boolean(mouseEvent?.shiftKey));
    this.dragging = true;
  }

  onCellMouseOver(event: CellMouseOverEvent<ExcelViewerRow>): void {
    if (!this.dragging || event.rowIndex === null) return;
    const colId = event.column.getColId();
    if (!colId.startsWith('c')) return;
    const column = Number(colId.slice(1));
    if (!Number.isFinite(column)) return;
    const current = this.selection();
    if (!current) return;
    this.selection.set({ anchor: current.anchor, focus: { row: event.rowIndex, column } });
    this.syncSelectionUi();
  }

  onColumnHeaderClicked(event: ColumnHeaderClickedEvent<ExcelViewerRow>): void {
    const colId = event.column && 'getColId' in event.column ? event.column.getColId() : '';
    if (!colId) return;
    if (colId === '__rowNumber') {
      this.selectAll();
      return;
    }
    if (!colId.startsWith('c')) return;
    this.selectColumns(Number(colId.slice(1)), Number(colId.slice(1)), false);
  }

  onCellKeyDown(event: CellKeyDownEvent<ExcelViewerRow> | FullWidthCellKeyDownEvent<ExcelViewerRow>): void {
    if (!('column' in event)) return;
    const keyboardEvent = event.event as KeyboardEvent;
    const key = keyboardEvent.key.toLowerCase();
    if ((keyboardEvent.ctrlKey || keyboardEvent.metaKey) && key === 'a') {
      keyboardEvent.preventDefault();
      this.selectAll();
      return;
    }
    if ((keyboardEvent.ctrlKey || keyboardEvent.metaKey) && key === 'c') {
      keyboardEvent.preventDefault();
      void this.copySelection();
      return;
    }
    if ((keyboardEvent.ctrlKey || keyboardEvent.metaKey) && key === 'f') {
      keyboardEvent.preventDefault();
      (this.host.nativeElement.querySelector('input[type="search"]') as HTMLInputElement | null)?.focus();
      return;
    }
    const moves: Record<string, GridPoint> = {
      arrowup: { row: -1, column: 0 },
      arrowdown: { row: 1, column: 0 },
      arrowleft: { row: 0, column: -1 },
      arrowright: { row: 0, column: 1 },
    };
    const move = moves[key];
    if (!move || event.rowIndex === null) return;
    const colId = event.column?.getColId();
    if (!colId?.startsWith('c')) return;
    keyboardEvent.preventDefault();
    const target = {
      row: Math.min(this.rowData().length - 1, Math.max(0, event.rowIndex + move.row)),
      column: Math.min(this.visibleSheetColumns.length - 1, Math.max(0, Number(colId.slice(1)) + move.column)),
    };
    if (keyboardEvent.shiftKey && this.selection()) {
      this.selection.set({ anchor: this.selection()!.anchor, focus: target });
    } else {
      this.selection.set({ anchor: target, focus: target });
    }
    this.gridApi?.setFocusedCell(target.row, `c${target.column}`);
    this.gridApi?.ensureIndexVisible(target.row, 'middle');
    this.gridApi?.ensureColumnVisible(`c${target.column}`, 'middle');
    this.updateFormulaBar(target);
    this.syncSelectionUi();
  }

  selectSheet(sheetName: string): void {
    if (!this.workbook || !this.xlsx || this.activeSheet() === sheetName) return;
    this.activeSheet.set(sheetName);
    this.buildSheet(sheetName);
  }

  toggleFilterPanel(): void {
    this.filterPanelOpen.update(open => !open);
  }

  applyFilterAndSort(): void {
    const column = this.filterColumn();
    const operator = this.filterOperator();
    const value = this.filterValue().trim();
    const filter = operator === 'notEmpty' || value
      ? { column, operator, value }
      : null;
    const sort = this.sortDirection() === 'none'
      ? null
      : { column, direction: this.sortDirection() as Exclude<ExcelSortDirection, 'none'> };
    this.activeFilter.set(filter);
    this.activeSort.set(sort);
    this.applyDataTransform();
    this.filterPanelOpen.set(false);
  }

  clearFilterAndSort(): void {
    this.filterValue.set('');
    this.filterOperator.set('contains');
    this.sortDirection.set('none');
    this.activeFilter.set(null);
    this.activeSort.set(null);
    this.applyDataTransform();
    this.filterPanelOpen.set(false);
  }

  fitSheetToContent(): void {
    if (!this.worksheet || !this.xlsx || !this.baseRows.length) return;
    const rows = this.baseRows.map(row => ({ ...row }));
    const widths = this.calculateAutoFitColumnWidths(rows);
    this.fittedColumnWidths = widths;
    this.applyAutoFitRowHeights(rows, widths);
    const columns = this.columnDefs().map((column, index) =>
      index === 0
        ? column
        : { ...column, width: widths[index - 1] ?? column.width }
    );
    this.baseRows = rows;
    this.columnDefs.set(columns);
    this.gridApi?.setGridOption('columnDefs', columns);
    this.applyDataTransform();
    this.copyStatus.set('Đã dãn vừa nội dung');
    if (this.copyTimer) clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => this.copyStatus.set(''), 1800);
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    const token = ++this.searchToken;
    if (this.searchTimer) clearTimeout(this.searchTimer);
    if (!value.trim()) {
      this.setSearchMatches([]);
      return;
    }
    this.searchTimer = setTimeout(() => {
      if (token === this.searchToken) this.computeSearchMatches(value);
    }, 100);
  }

  onSearchEnter(event: Event): void {
    this.goToSearchMatch((event as KeyboardEvent).shiftKey ? -1 : 1);
  }

  goToSearchMatch(direction: number): void {
    const matches = this.searchMatches();
    if (!matches.length) return;
    const current = this.activeSearchIndex();
    const next = current < 0
      ? 0
      : (current + direction + matches.length) % matches.length;
    this.activeSearchIndex.set(next);
    this.focusSearchMatch(matches[next]);
  }

  async copySelection(): Promise<void> {
    const text = this.selectionText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    this.showCopyStatus();
  }

  private async loadWorkbook(): Promise<void> {
    if (!this.blob) return;
    const token = ++this.loadToken;
    this.loading.set(true);
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
      this.xlsx = xlsx;
      this.workbook = workbook;
      this.sheetNames.set(workbook.SheetNames);
      this.activeSheet.set(workbook.SheetNames[0]);
      this.buildSheet(workbook.SheetNames[0]);
      this.loading.set(false);
      this.ready.emit();
    } catch (error) {
      if (token !== this.loadToken) return;
      this.loading.set(false);
      this.failed.emit(error instanceof Error ? error.message : 'Không thể đọc tệp Excel.');
    }
  }

  private buildSheet(sheetName: string): void {
    if (!this.workbook || !this.xlsx) return;
    const worksheet = this.workbook.Sheets[sheetName];
    if (!worksheet) return;
    this.worksheet = worksheet;
    this.mergeAnchors.clear();
    this.mergeCovered.clear();
    this.mergeSources.clear();
    this.matchKeys.clear();
    this.activeMatchKey = '';
    this.searchMatches.set([]);
    this.activeSearchIndex.set(-1);
    this.filterPanelOpen.set(false);
    this.filterValue.set('');
    this.filterOperator.set('contains');
    this.sortDirection.set('none');
    this.activeFilter.set(null);
    this.activeSort.set(null);
    this.textWidthCache.clear();

    const reference = worksheet['!ref'] || 'A1:A1';
    const range = this.xlsx.utils.decode_range(reference);
    const columnMetadata = worksheet['!cols'] || [];
    const rowMetadata = worksheet['!rows'] || [];
    const allVisibleColumns: number[] = [];
    for (let column = range.s.c; column <= range.e.c; column++) {
      if (!columnMetadata[column]?.hidden) allVisibleColumns.push(column);
    }
    const maxColumns = 200;
    this.visibleSheetColumns = allVisibleColumns.slice(0, maxColumns);
    if (!this.visibleSheetColumns.length) this.visibleSheetColumns = [range.s.c];
    const maxCells = 500_000;
    const rowLimit = Math.min(50_000, Math.max(1, Math.floor(maxCells / this.visibleSheetColumns.length)));
    const visibleSheetRows: number[] = [];
    let totalUnhiddenRows = 0;
    for (let row = range.s.r; row <= range.e.r; row++) {
      if (rowMetadata[row]?.hidden) continue;
      totalUnhiddenRows++;
      if (visibleSheetRows.length < rowLimit) visibleSheetRows.push(row);
    }

    const displayedColumnSet = new Set(this.visibleSheetColumns);
    const displayedRowSet = new Set(visibleSheetRows);
    for (const merge of (worksheet['!merges'] || []) as SheetMerge[]) {
      if (!displayedRowSet.has(merge.s.r) || !displayedColumnSet.has(merge.s.c)) continue;
      this.mergeAnchors.set(this.cellKey(merge.s.r, merge.s.c), merge);
      for (let row = merge.s.r; row <= merge.e.r; row++) {
        for (let column = merge.s.c; column <= merge.e.c; column++) {
          if (row !== merge.s.r || column !== merge.s.c) {
            this.mergeCovered.add(this.cellKey(row, column));
            this.mergeSources.set(this.cellKey(row, column), {
              row: merge.s.r,
              column: merge.s.c,
            });
          }
        }
      }
    }
    const columns: ColDef<ExcelViewerRow>[] = [
      {
        headerName: '',
        field: '__rowNumber',
        colId: '__rowNumber',
        pinned: 'left',
        width: 48,
        minWidth: 42,
        maxWidth: 72,
        sortable: false,
        filter: false,
        resizable: true,
        lockPosition: true,
        headerTooltip: 'Chọn toàn bộ trang tính',
        cellClass: params => {
          const classes = ['excel-row-number'];
          if (params.node.rowIndex !== null && this.isRowFullySelected(params.node.rowIndex)) {
            classes.push('excel-selected-row-header');
          }
          return classes;
        },
      },
    ];

    this.visibleSheetColumns.forEach((sheetColumn, displayColumn) => {
      const metadata = columnMetadata[sheetColumn];
      const width = metadata?.wpx
        ? Math.min(420, Math.max(28, metadata.wpx))
        : metadata?.wch
          ? Math.min(420, Math.max(28, Math.round(metadata.wch * 7 + 10)))
          : 96;
      columns.push({
        headerName: this.xlsx!.utils.encode_col(sheetColumn),
        field: `c${displayColumn}`,
        colId: `c${displayColumn}`,
        width,
        minWidth: 28,
        sortable: false,
        filter: false,
        suppressMovable: true,
        headerClass: () => this.isColumnFullySelected(displayColumn) ? 'excel-selected-header' : '',
        cellClass: params => this.cellClasses(params.node.rowIndex, displayColumn),
        cellStyle: params => {
          const sheetRow = Number(params.data?.__rowNumber) - 1;
          return this.originalCellStyle(sheetRow, sheetColumn);
        },
        colSpan: params => {
          const sheetRow = Number(params.data?.__rowNumber) - 1;
          const merge = this.mergeAnchors.get(this.cellKey(sheetRow, sheetColumn));
          if (!merge) return 1;
          return this.visibleSheetColumns.filter(column => column >= merge.s.c && column <= merge.e.c).length || 1;
        },
      });
    });

    const rows: ExcelViewerRow[] = visibleSheetRows.map(sheetRow => {
      const metadata = rowMetadata[sheetRow];
      const rowData: ExcelViewerRow = {
        __rowNumber: sheetRow + 1,
        __height: metadata?.hpx
          ? metadata.hpx
          : metadata?.hpt
            ? Math.round(metadata.hpt * 96 / 72)
            : 28,
      };
      this.visibleSheetColumns.forEach((sheetColumn, displayColumn) => {
        const covered = this.mergeCovered.has(this.cellKey(sheetRow, sheetColumn));
        const cell = worksheet[this.xlsx!.utils.encode_cell({ r: sheetRow, c: sheetColumn })];
        rowData[`c${displayColumn}`] = covered ? '' : (cell ? String(cell.w ?? cell.v ?? '') : '');
      });
      return rowData;
    });
    const autoFitWidths = this.calculateAutoFitColumnWidths(rows);
    this.fittedColumnWidths = autoFitWidths;
    this.applyAutoFitRowHeights(rows, autoFitWidths);
    autoFitWidths.forEach((width, displayColumn) => {
      columns[displayColumn + 1].width = width;
    });

    const totalUnhiddenColumns = allVisibleColumns.length;
    this.truncated.set(
      this.visibleSheetColumns.length < totalUnhiddenColumns ||
      visibleSheetRows.length < totalUnhiddenRows
    );
    this.visibleColumns.set(this.visibleSheetColumns.length);
    this.visibleRows.set(rows.length);
    this.columnDefs.set(columns);
    this.baseRows = rows;
    this.dataStartIndex = this.detectDataStartIndex(rows);
    this.dataEndIndex = this.detectDataEndIndex(rows, this.dataStartIndex);
    this.filterColumnOptions.set(this.buildFilterColumnOptions(rows, this.dataStartIndex));
    this.filterColumn.set(this.filterColumnOptions()[0]?.column ?? 0);
    this.filteredDataRows.set(Math.max(0, this.dataEndIndex - this.dataStartIndex));
    this.rowData.set([...rows]);

    const firstPoint = { row: 0, column: 0 };
    this.selection.set({ anchor: firstPoint, focus: firstPoint });
    this.updateFormulaBar(firstPoint);
    setTimeout(() => {
      this.gridApi?.setGridOption('columnDefs', columns);
      this.gridApi?.setGridOption('rowData', [...rows]);
      if (rows.length > 0) {
        this.gridApi?.ensureIndexVisible(0, 'top');
        this.gridApi?.setFocusedCell(0, 'c0');
      }
      this.refreshGridDecorations();
      if (this.searchQuery().trim()) this.computeSearchMatches(this.searchQuery());
    });
  }

  private calculateAutoFitColumnWidths(rows: ExcelViewerRow[]): number[] {
    const minWidth = 44;
    const maxWidth = typeof window !== 'undefined' && window.innerWidth <= 640 ? 280 : 420;
    return this.visibleSheetColumns.map((sheetColumn, displayColumn) => {
      let longestLine = '';
      let longestSpan = 1;
      let longestScore = 0;
      for (const row of rows) {
        const text = String(row[`c${displayColumn}`] ?? '');
        if (!text) continue;
        const sheetRow = Number(row.__rowNumber) - 1;
        const merge = this.mergeAnchors.get(this.cellKey(sheetRow, sheetColumn));
        const span = merge
          ? Math.max(1, this.visibleSheetColumns.filter(column =>
              column >= merge.s.c && column <= merge.e.c
            ).length)
          : 1;
        const candidate = text.split(/\r?\n/).reduce(
          (longest, line) => this.visualTextLength(line) > this.visualTextLength(longest) ? line : longest,
          '',
        );
        const score = this.visualTextLength(candidate) / span;
        if (score > longestScore) {
          longestLine = candidate;
          longestSpan = span;
          longestScore = score;
        }
      }
      const preferredWidth = Math.ceil(this.measureTextWidth(longestLine) / longestSpan) + 16;
      return Math.min(maxWidth, Math.max(minWidth, preferredWidth));
    });
  }

  private applyAutoFitRowHeights(rows: ExcelViewerRow[], widths: number[]): void {
    for (const row of rows) {
      const sheetRow = Number(row.__rowNumber) - 1;
      let requiredLines = 1;
      this.visibleSheetColumns.forEach((sheetColumn, displayColumn) => {
        const text = String(row[`c${displayColumn}`] ?? '');
        if (!text) return;
        const address = this.xlsx?.utils.encode_cell({ r: sheetRow, c: sheetColumn });
        const cell = address ? this.worksheet?.[address] : undefined;
        const merge = this.mergeAnchors.get(this.cellKey(sheetRow, sheetColumn));
        const availableWidth = Math.max(20, (
          merge
            ? this.visibleSheetColumns.reduce(
                (width, column, index) =>
                  column >= merge.s.c && column <= merge.e.c ? width + (widths[index] || 96) : width,
                0,
              )
            : (widths[displayColumn] || 96)
        ) - 14);
        const wraps = Boolean(cell?.s?.alignment?.wrapText) ||
          /\r?\n/.test(text) ||
          this.visualTextLength(text) * 7 > availableWidth;
        if (!wraps) return;
        const lines = text.split(/\r?\n/).reduce(
          (count, line) => count + Math.max(1, Math.ceil(this.visualTextLength(line) * 7 / availableWidth)),
          0,
        );
        requiredLines = Math.max(requiredLines, lines);
      });
      const sourceHeight = Number(row['__height']) || 28;
      row['__height'] = Math.min(160, Math.max(24, sourceHeight, 10 + requiredLines * 16));
    }
  }

  private measureTextWidth(value: string): number {
    if (!value) return 0;
    const cached = this.textWidthCache.get(value);
    if (cached !== undefined) return cached;
    if (typeof document === 'undefined') return this.visualTextLength(value) * 7;
    if (this.measurementContext === undefined) {
      this.measurementContext = document.createElement('canvas').getContext('2d');
      if (this.measurementContext) {
        this.measurementContext.font = '12px Aptos, Calibri, Arial, sans-serif';
      }
    }
    const context = this.measurementContext;
    if (!context) return this.visualTextLength(value) * 7;
    const width = context.measureText(value.replace(/\t/g, '    ')).width;
    if (this.textWidthCache.size < 4_000) this.textWidthCache.set(value, width);
    return width;
  }

  private visualTextLength(value: string): number {
    return Array.from(value.replace(/\t/g, '    ')).reduce(
      (length, character) => length + (/[MW@#%&\u3000-\u9fff]/u.test(character) ? 1.6 : 1),
      0,
    );
  }

  private detectDataStartIndex(rows: ExcelViewerRow[]): number {
    const firstStructuredRow = rows.findIndex(row => {
      const firstValue = String(row['c0'] ?? '').trim().replace(',', '.');
      const populatedCells = this.visibleSheetColumns.reduce(
        (count, _column, displayColumn) => count + (String(row[`c${displayColumn}`] ?? '').trim() ? 1 : 0),
        0,
      );
      return /^-?\d+(?:\.\d+)?$/.test(firstValue) && populatedCells >= 2;
    });
    if (firstStructuredRow >= 0) return firstStructuredRow;

    const firstPopulatedRow = rows.findIndex(row =>
      this.visibleSheetColumns.some((_column, displayColumn) => String(row[`c${displayColumn}`] ?? '').trim())
    );
    return Math.min(rows.length, Math.max(0, firstPopulatedRow + 1));
  }

  private buildFilterColumnOptions(rows: ExcelViewerRow[], dataStart: number): ExcelColumnOption[] {
    return this.visibleSheetColumns.map((sheetColumn, displayColumn) => {
      const headings: string[] = [];
      for (let row = 0; row < dataStart; row++) {
        const text = String(rows[row]?.[`c${displayColumn}`] ?? '').trim();
        if (text && !headings.some(existing => this.normalize(existing) === this.normalize(text))) {
          headings.push(text);
        }
      }
      const columnLetter = this.xlsx?.utils.encode_col(sheetColumn) || String(displayColumn + 1);
      const conciseHeadings = headings.slice(-2).join(' · ');
      return {
        column: displayColumn,
        label: conciseHeadings ? `${columnLetter} · ${conciseHeadings}` : `Cột ${columnLetter}`,
      };
    });
  }

  private detectDataEndIndex(rows: ExcelViewerRow[], dataStart: number): number {
    let lastStructuredRow = dataStart - 1;
    for (let row = dataStart; row < rows.length; row++) {
      const firstValue = String(rows[row]?.['c0'] ?? '').trim().replace(',', '.');
      if (/^-?\d+(?:\.\d+)?$/.test(firstValue)) lastStructuredRow = row;
    }
    return Math.max(dataStart, lastStructuredRow + 1);
  }

  private applyDataTransform(): void {
    const headerRows = this.baseRows.slice(0, this.dataStartIndex);
    let dataRows = this.baseRows.slice(this.dataStartIndex, this.dataEndIndex);
    const footerRows = this.baseRows.slice(this.dataEndIndex);
    const filter = this.activeFilter();
    if (filter) {
      const expected = this.normalize(filter.value);
      dataRows = dataRows.filter(row => {
        const rawValue = String(row[`c${filter.column}`] ?? '').trim();
        const actual = this.normalize(rawValue);
        if (filter.operator === 'notEmpty') return rawValue.length > 0;
        if (filter.operator === 'equals') return actual === expected;
        return actual.includes(expected);
      });
    }

    const sort = this.activeSort();
    if (sort) {
      dataRows = [...dataRows].sort((left, right) => {
        const leftValue = left[`c${sort.column}`];
        const rightValue = right[`c${sort.column}`];
        const leftEmpty = String(leftValue ?? '').trim().length === 0;
        const rightEmpty = String(rightValue ?? '').trim().length === 0;
        if (leftEmpty !== rightEmpty) return leftEmpty ? 1 : -1;
        const comparison = this.compareExcelValues(
          leftValue,
          rightValue,
        );
        return sort.direction === 'asc' ? comparison : -comparison;
      });
    }

    const transformedRows = [...headerRows, ...dataRows, ...footerRows];
    this.filteredDataRows.set(dataRows.length);
    this.rowData.set(transformedRows);
    this.visibleRows.set(transformedRows.length);
    this.setSearchMatches([]);
    const firstPoint = { row: 0, column: 0 };
    this.selection.set(transformedRows.length ? { anchor: firstPoint, focus: firstPoint } : null);
    setTimeout(() => {
      this.gridApi?.setGridOption('rowData', transformedRows);
      if (transformedRows.length) {
        this.gridApi?.ensureIndexVisible(0, 'top');
        this.gridApi?.setFocusedCell(0, 'c0');
        this.updateFormulaBar(firstPoint);
      }
      this.refreshGridDecorations();
      if (this.searchQuery().trim()) this.computeSearchMatches(this.searchQuery());
    });
  }

  private compareExcelValues(left: unknown, right: unknown): number {
    const leftText = String(left ?? '').trim();
    const rightText = String(right ?? '').trim();
    if (!leftText && !rightText) return 0;
    if (!leftText) return 1;
    if (!rightText) return -1;
    const leftNumber = Number(leftText.replace(/\s/g, '').replace(',', '.'));
    const rightNumber = Number(rightText.replace(/\s/g, '').replace(',', '.'));
    if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
      return leftNumber - rightNumber;
    }
    return leftText.localeCompare(rightText, 'vi', { numeric: true, sensitivity: 'base' });
  }

  private beginSelection(point: GridPoint, extend: boolean): void {
    const current = this.selection();
    this.selection.set({
      anchor: extend && current ? current.anchor : point,
      focus: point,
    });
    this.updateFormulaBar(point);
    this.syncSelectionUi();
  }

  private selectRows(start: number, end: number, extend: boolean): void {
    const current = this.selection();
    const anchorRow = extend && current ? current.anchor.row : start;
    this.selection.set({
      anchor: { row: anchorRow, column: 0 },
      focus: { row: end, column: Math.max(0, this.visibleSheetColumns.length - 1) },
    });
    this.updateFormulaBar({ row: end, column: 0 });
    this.syncSelectionUi();
  }

  private selectColumns(start: number, end: number, extend: boolean): void {
    const current = this.selection();
    const anchorColumn = extend && current ? current.anchor.column : start;
    this.selection.set({
      anchor: { row: 0, column: anchorColumn },
      focus: { row: Math.max(0, this.rowData().length - 1), column: end },
    });
    this.updateFormulaBar({ row: 0, column: end });
    this.syncSelectionUi();
  }

  private selectAll(): void {
    this.selection.set({
      anchor: { row: 0, column: 0 },
      focus: {
        row: Math.max(0, this.rowData().length - 1),
        column: Math.max(0, this.visibleSheetColumns.length - 1),
      },
    });
    this.syncSelectionUi();
  }

  private selectionRect(): { top: number; bottom: number; left: number; right: number } | null {
    const selection = this.selection();
    if (!selection) return null;
    return {
      top: Math.min(selection.anchor.row, selection.focus.row),
      bottom: Math.max(selection.anchor.row, selection.focus.row),
      left: Math.min(selection.anchor.column, selection.focus.column),
      right: Math.max(selection.anchor.column, selection.focus.column),
    };
  }

  private isSelected(row: number, column: number): boolean {
    const rect = this.selectionRect();
    return Boolean(rect && row >= rect.top && row <= rect.bottom && column >= rect.left && column <= rect.right);
  }

  private isRowFullySelected(row: number): boolean {
    const rect = this.selectionRect();
    return Boolean(rect && row >= rect.top && row <= rect.bottom &&
      rect.left === 0 && rect.right === this.visibleSheetColumns.length - 1);
  }

  private isColumnFullySelected(column: number): boolean {
    const rect = this.selectionRect();
    return Boolean(rect && column >= rect.left && column <= rect.right &&
      rect.top === 0 && rect.bottom === this.rowData().length - 1);
  }

  private cellClasses(row: number | null, column: number): string[] {
    if (row === null) return [];
    const classes: string[] = [];
    if (this.isSelected(row, column)) classes.push('excel-selected-cell');
    const focus = this.selection()?.focus;
    if (focus?.row === row && focus.column === column) classes.push('excel-active-cell');
    const key = this.gridKey(row, column);
    if (this.matchKeys.has(key)) classes.push('excel-search-match');
    if (this.activeMatchKey === key) classes.push('excel-search-active');
    return classes;
  }

  private syncSelectionUi(): void {
    const focus = this.selection()?.focus;
    if (focus) this.updateFormulaBar(focus);
    this.refreshGridDecorations();
  }

  private refreshGridDecorations(): void {
    this.gridApi?.refreshCells({ force: true });
    this.gridApi?.refreshHeader();
  }

  private updateFormulaBar(point: GridPoint): void {
    if (!this.xlsx || !this.worksheet) return;
    const row = this.rowData()[point.row];
    const sheetColumn = this.visibleSheetColumns[point.column];
    if (!row || sheetColumn === undefined) return;
    const sheetRow = row.__rowNumber - 1;
    const mergeSource = this.mergeSources.get(this.cellKey(sheetRow, sheetColumn));
    const sourceRow = mergeSource?.row ?? sheetRow;
    const sourceColumn = mergeSource?.column ?? sheetColumn;
    const address = this.xlsx.utils.encode_cell({ r: sourceRow, c: sourceColumn });
    const cell = this.worksheet[address];
    const rect = this.selectionRect();
    if (rect && (rect.top !== rect.bottom || rect.left !== rect.right)) {
      const startRow = this.rowData()[rect.top]?.__rowNumber - 1;
      const endRow = this.rowData()[rect.bottom]?.__rowNumber - 1;
      const startColumn = this.visibleSheetColumns[rect.left];
      const endColumn = this.visibleSheetColumns[rect.right];
      if ([startRow, endRow, startColumn, endColumn].every(Number.isFinite)) {
        const start = this.xlsx.utils.encode_cell({ r: startRow, c: startColumn });
        const end = this.xlsx.utils.encode_cell({ r: endRow, c: endColumn });
        this.selectedAddress.set(`${start}:${end}`);
      }
    } else {
      this.selectedAddress.set(address);
    }
    if (!cell) this.selectedFormula.set('');
    else if (cell.f) this.selectedFormula.set(`=${cell.f}`);
    else this.selectedFormula.set(String(cell.w ?? cell.v ?? ''));
  }

  private computeSearchMatches(value: string): void {
    const query = this.normalize(value.trim());
    if (!query) {
      this.setSearchMatches([]);
      return;
    }
    const matches: GridPoint[] = [];
    const rows = this.rowData();
    for (let row = 0; row < rows.length; row++) {
      for (let column = 0; column < this.visibleSheetColumns.length; column++) {
        if (this.normalize(String(rows[row][`c${column}`] ?? '')).includes(query)) {
          matches.push({ row, column });
        }
      }
    }
    this.setSearchMatches(matches);
    if (matches.length) this.focusSearchMatch(matches[0]);
  }

  private setSearchMatches(matches: GridPoint[]): void {
    this.searchMatches.set(matches);
    this.activeSearchIndex.set(matches.length ? 0 : -1);
    this.matchKeys = new Set(matches.map(point => this.gridKey(point.row, point.column)));
    this.activeMatchKey = matches.length ? this.gridKey(matches[0].row, matches[0].column) : '';
    this.refreshGridDecorations();
  }

  private focusSearchMatch(point: GridPoint): void {
    this.activeMatchKey = this.gridKey(point.row, point.column);
    this.selection.set({ anchor: point, focus: point });
    this.gridApi?.ensureIndexVisible(point.row, 'middle');
    this.gridApi?.ensureColumnVisible(`c${point.column}`, 'middle');
    this.gridApi?.setFocusedCell(point.row, `c${point.column}`);
    this.updateFormulaBar(point);
    this.refreshGridDecorations();
  }

  private selectionText(): string {
    const rect = this.selectionRect();
    if (!rect) return '';
    const rows = this.rowData();
    const lines: string[] = [];
    for (let row = rect.top; row <= rect.bottom; row++) {
      const values: string[] = [];
      for (let column = rect.left; column <= rect.right; column++) {
        values.push(String(rows[row]?.[`c${column}`] ?? ''));
      }
      lines.push(values.join('\t'));
    }
    return lines.join('\r\n');
  }

  private showCopyStatus(): void {
    this.copyStatus.set(`Đã sao chép ${this.selectionSummary()}`);
    if (this.copyTimer) clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => this.copyStatus.set(''), 1800);
  }

  private originalCellStyle(sheetRow: number, sheetColumn: number): Record<string, string | number> {
    const cell = this.worksheet?.[this.xlsx?.utils.encode_cell({ r: sheetRow, c: sheetColumn }) || ''];
    const style = cell?.s;
    const css: Record<string, string | number> = {};
    const cellText = String(cell?.w ?? cell?.v ?? '');
    const displayColumn = this.visibleSheetColumns.indexOf(sheetColumn);
    const merge = this.mergeAnchors.get(this.cellKey(sheetRow, sheetColumn));
    const availableWidth = Math.max(20, (
      merge
        ? this.visibleSheetColumns.reduce(
            (width, column, index) =>
              column >= merge.s.c && column <= merge.e.c
                ? width + (this.fittedColumnWidths[index] || 96)
                : width,
            0,
          )
        : (this.fittedColumnWidths[displayColumn] || 96)
    ) - 14);
    const contentNeedsWrap = /\r?\n/.test(cellText) || this.measureTextWidth(cellText) > availableWidth;
    if (!style || typeof style !== 'object') {
      return contentNeedsWrap ? { whiteSpace: 'pre-line', overflowWrap: 'anywhere' } : css;
    }
    const fill = this.excelColor(style.fgColor || style.fill?.fgColor);
    const fontColor = this.excelColor(style.font?.color);
    if (fill && style.patternType !== 'none') css['backgroundColor'] = fill;
    css['color'] = fontColor && /\.xlsx$/i.test(this.fileName)
      ? fontColor
      : (this.state.darkMode() ? '#e2e8f0' : '#334155');
    if (style.font?.bold) css['fontWeight'] = 700;
    if (style.font?.italic) css['fontStyle'] = 'italic';
    if (style.font?.sz) css['fontSize'] = `${Math.min(28, Math.max(8, style.font.sz))}px`;
    const horizontal = style.alignment?.horizontal;
    if (horizontal === 'center' || horizontal === 'right' || horizontal === 'left') {
      css['textAlign'] = horizontal;
    }
    if (style.alignment?.wrapText || contentNeedsWrap) {
      css['whiteSpace'] = 'normal';
      css['overflowWrap'] = 'anywhere';
    }
    if (/\r?\n/.test(cellText)) css['whiteSpace'] = 'pre-line';
    return css;
  }

  private excelColor(color: any): string {
    const raw = typeof color?.rgb === 'string' ? color.rgb.replace(/^FF/i, '') : '';
    return /^[0-9a-f]{6}$/i.test(raw) ? `#${raw}` : '';
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase();
  }

  private cellKey(row: number, column: number): string {
    return `${row}:${column}`;
  }

  private gridKey(row: number, column: number): string {
    return `${row}:${column}`;
  }
}
