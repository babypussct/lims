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
import { CanceledError, LocaleType, WrapStrategy, mergeLocales } from '@univerjs/core';
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
import { ToastService } from '../../core/services/toast.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { convertSheetJsWorkbookToUniver } from './excel-univer-converter';
import {
  applyExcelAutoFilterSafely,
  EXCEL_UNSUPPORTED_FEATURE_LABELS,
  getApplicableExcelAutoFilterRange,
  getPreviewFilterCandidateRange,
  loadExcelWorkbookMetadata,
  type ExcelRangeMetadata,
  type ExcelUnsupportedFeatureSummary,
  type ExcelWorkbookMetadata,
} from './excel-univer-metadata';
import {
  buildExcelPreviewContextMenu,
  buildExcelPreviewFilterCriteria,
  calculateExcelPreviewSmartLayout,
  classifyExcelPreviewContextTarget,
  getExcelColumnLabel,
  getExcelPreviewUsedRange,
  isSafeExcelHyperlink,
  parseExcelGoToTarget,
  removeExcelPreviewViewChange,
  serializeExcelPreviewGrid,
  shouldExcelPreviewTextEntryOwnShortcut,
  upsertExcelPreviewViewChange,
  type ExcelPreviewContextTarget,
  type ExcelPreviewMenuAction,
  type ExcelPreviewMenuItem,
  type ExcelPreviewViewChange,
  type ExcelPreviewViewChangeDetails,
  type ExcelPreviewViewChangeKind,
} from './excel-viewer-tools';

import '@univerjs/sheets-filter/facade';
import '@univerjs/sheets-hyper-link/facade';
import '@univerjs/sheets-note/facade';
import '@univerjs/sheets-numfmt/facade';

type UniverBundle = ReturnType<typeof createUniver>;
type UniverWorkbook = ReturnType<UniverBundle['univerAPI']['createWorkbook']>;
type UniverWorkbookSnapshot = Parameters<UniverBundle['univerAPI']['createWorkbook']>[0];

interface ExcelViewAutoFilterTarget {
  sheetName: string;
  range: ExcelRangeMetadata;
}

interface ExcelPreviewContextMenuState {
  x: number;
  y: number;
  target: ExcelPreviewContextTarget;
  items: ExcelPreviewMenuItem[];
}

interface ExcelPreviewCellInfo {
  sheetName: string;
  address: string;
  displayValue: string;
  rawValue: string;
  formula: string;
  hyperlink: string;
  numberFormat: string;
  alignment: string;
  wrapText: string;
  note: string;
  mergedRange: string;
}

interface ExcelPreviewSelectionInfo {
  sheetName: string;
  address: string;
  populatedCells: number;
  numericCells: number;
  total?: number;
  average?: number;
  minimum?: number;
  maximum?: number;
  truncated: boolean;
}

interface ExcelPreviewDimensionEditor {
  kind: 'column' | 'row';
  value: number;
}

interface ExcelPreviewScopedFind {
  axis: 'column' | 'row';
  index: number;
  label: string;
  value: string;
  matches: number[];
  cursor: number;
}

interface ExcelPreviewFilterSummary {
  sheetName: string;
  range: string;
  criteriaCount: number;
  criteria: string;
}

@Component({
  selector: 'app-excel-document-viewer',
  standalone: true,
  template: `
    <div class="excel-univer-shell">
      <div class="excel-view-tools-bar" role="toolbar" aria-label="Công cụ xem bảng tính">
        <button type="button"
                class="excel-view-tool"
                [class.is-active]="contextMenu()?.target === 'navigation'"
                [disabled]="loading()"
                aria-haspopup="menu"
                [attr.aria-expanded]="contextMenu()?.target === 'navigation'"
                title="Tìm kiếm, đi tới hoặc chọn vùng"
                aria-label="Điều hướng bảng tính"
                (click)="openNavigationMenu($event)">
          <i class="fa-solid fa-compass"></i>
          <span>Điều hướng</span>
          @if (selectedDataRangeLabel()) {
            <small>{{ selectedDataRangeLabel() }}</small>
          }
        </button>
        <button type="button"
                class="excel-view-tool"
                [class.is-active]="previewFilterSheetNames().length > 0"
                [disabled]="loading()"
                [title]="filterToolTitle()"
                [attr.aria-label]="filterToolTitle()"
                (click)="applyPreviewFilter()">
          <i class="fa-solid fa-filter"></i>
          <span>Filter</span>
          @if (previewFilterSheetNames().length) {
            <small>đang bật</small>
          } @else {
            <kbd>Ctrl+Shift+L</kbd>
          }
        </button>
        <button type="button"
                class="excel-view-tool"
                [disabled]="loading()"
                title="Căn giữa vùng ô đang chọn trong bản xem trước"
                aria-label="Căn giữa vùng ô đang chọn"
                (click)="centerPreviewSelection()">
          <i class="fa-solid fa-align-center"></i>
          <span>Căn giữa</span>
        </button>
        <button type="button"
                class="excel-view-tool"
                [disabled]="loading()"
                title="Khôi phục nội dung và cách xem ban đầu từ file gốc"
                aria-label="Đặt lại cách xem"
                (click)="resetPreviewView()">
          <i class="fa-solid fa-rotate-left"></i>
          <span>Đặt lại</span>
        </button>
        <button type="button"
                class="excel-view-tool"
                [class.is-active]="contextMenu()?.target === 'more'"
                [disabled]="loading()"
                aria-haspopup="menu"
                [attr.aria-expanded]="contextMenu()?.target === 'more'"
                title="Thêm công cụ xem"
                aria-label="Thêm công cụ xem"
                (click)="openMoreMenu($event)">
          <i class="fa-solid fa-ellipsis"></i>
          <span>Xem thêm</span>
        </button>
        @for (chip of viewStateChips(); track chip.kind) {
          <button type="button" class="excel-view-state"
                  [title]="chip.title"
                  aria-live="polite"
                  aria-haspopup="dialog"
                  [attr.aria-expanded]="viewStateOpen()"
                  (click)="toggleViewStatePanel()">
            <i class="fa-solid {{ viewChangeIcon(chip.kind) }}"></i>
            {{ chip.label }}
          </button>
        }
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

      @if (viewStateOpen()) {
        <aside class="excel-view-state-panel" role="dialog" aria-label="Các thay đổi hiển thị tạm">
          <header>
            <strong>Thay đổi hiển thị tạm</strong>
            <button type="button" aria-label="Đóng danh sách thay đổi" (click)="viewStateOpen.set(false)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <div class="excel-view-state-list">
            @for (change of temporaryViewChanges(); track change.id) {
              <button type="button"
                      [title]="canClearViewChangeIndividually(change) ? 'Xóa riêng trạng thái này' : 'Khôi phục snapshot nguồn để xóa trạng thái này'"
                      (click)="clearViewChange(change)">
                <i class="fa-solid {{ viewChangeIcon(change.kind) }}"></i>
                <span>
                  <small>{{ change.sheetName }}</small>
                  {{ change.label }}
                  @if (viewChangeSummary(change)) {
                    <em>{{ viewChangeSummary(change) }}</em>
                  }
                </span>
                <i class="fa-solid fa-xmark"></i>
              </button>
            }
          </div>
          @if (previewFilterSummaries().length) {
            <div class="excel-filter-summary" aria-label="Filter đang áp dụng">
              <strong>Filter đang áp dụng</strong>
              @for (summary of previewFilterSummaries(); track summary.sheetName) {
                <span>{{ summary.sheetName }} · {{ summary.range }} · {{ summary.criteriaCount }} điều kiện</span>
                <small>{{ summary.criteria }}</small>
              }
            </div>
          }
          <button type="button" class="excel-reset-view-state" (click)="resetPreviewView()">
            <i class="fa-solid fa-rotate-left"></i>
            Đặt lại toàn bộ
          </button>
        </aside>
      }

      @if (goToOpen()) {
        <div class="excel-go-to-panel" role="dialog" aria-label="Đi tới ô hoặc vùng">
          <label for="excel-go-to-address">Đi tới</label>
          <input id="excel-go-to-address"
                 class="excel-go-to-input"
                 type="text"
                 autocomplete="off"
                 spellcheck="false"
                 placeholder="B12 hoặc 'Kết quả'!C4:D9"
                 [value]="goToValue()"
                 [attr.aria-invalid]="goToError() ? 'true' : null"
                 (input)="updateGoToValue($event)"
                 (keydown.enter)="goToTarget(); $event.preventDefault()"
                 (keydown.escape)="closeGoTo(); $event.stopPropagation()">
          <button type="button" (click)="goToTarget()">Đi</button>
          <button type="button" class="is-quiet" aria-label="Đóng" (click)="closeGoTo()">
            <i class="fa-solid fa-xmark"></i>
          </button>
          @if (goToError()) {
            <small role="alert">{{ goToError() }}</small>
          }
          @if (goToHistory().length) {
            <div class="excel-go-to-history" aria-label="Địa chỉ đã đi gần đây">
              @for (address of goToHistory(); track address) {
                <button type="button" (click)="useGoToHistory(address)">{{ address }}</button>
              }
            </div>
          }
        </div>
      }

      @if (scopedFind(); as find) {
        <div class="excel-scoped-find" role="dialog" aria-label="Tìm trong vùng đang chọn">
          <header>
            <strong>Tìm trong {{ find.label }}</strong>
            <button type="button" aria-label="Đóng tìm theo vùng" (click)="closeScopedFind()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <input class="excel-scoped-find-input"
                 type="search"
                 autocomplete="off"
                 [value]="find.value"
                 [placeholder]="'Tìm trong ' + find.label"
                 (input)="updateScopedFind($event)"
                 (keydown.enter)="moveScopedFind(1); $event.preventDefault()"
                 (keydown.escape)="closeScopedFind(); $event.stopPropagation()">
          <div class="excel-scoped-find-actions">
            <span aria-live="polite">{{ find.matches.length }} kết quả</span>
            <button type="button" (click)="moveScopedFind(-1)" aria-label="Kết quả trước">
              <i class="fa-solid fa-chevron-up"></i>
            </button>
            <button type="button" (click)="moveScopedFind(1)" aria-label="Kết quả sau">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
        </div>
      }

      <div #univerHost
           class="excel-univer-host"
           tabindex="-1"
           role="region"
           aria-readonly="true"
           data-excel-readonly="true"
           aria-label="Bảng tính Excel chỉ đọc"
           (contextmenu)="openPreviewContextMenu($event)"></div>

      @if (contextMenu(); as menu) {
        <div class="excel-context-backdrop"
             (pointerdown)="closeContextMenu()"
             (contextmenu)="$event.preventDefault()">
          <div class="excel-context-menu"
               role="menu"
               tabindex="-1"
               [attr.aria-label]="contextMenuLabel(menu.target)"
               [style.left.px]="menu.x"
               [style.top.px]="menu.y"
               (pointerdown)="$event.stopPropagation()"
               (contextmenu)="$event.preventDefault(); $event.stopPropagation()"
               (keydown)="handleContextMenuKeydown($event)">
            @for (menuItem of menu.items; track menuItem.action; let index = $index) {
              @if (index > 0 && menu.items[index - 1].group !== menuItem.group) {
                <div class="excel-context-separator" role="separator"></div>
              }
              <button type="button"
                      role="menuitem"
                      [attr.aria-haspopup]="menuItem.submenu?.length ? 'menu' : null"
                      [attr.aria-expanded]="menuItem.submenu?.length ? submenuOpen() === menuItem.action : null"
                      [attr.data-excel-menu-parent]="menuItem.submenu?.length ? menuItem.action : null"
                      [disabled]="menuItem.disabled"
                      [attr.aria-disabled]="menuItem.disabled ? 'true' : null"
                      [attr.aria-description]="menuItem.disabledReason ?? null"
                      [attr.title]="menuItem.disabledReason ?? null"
                      [attr.data-excel-menu-action]="menuItem.action"
                      (click)="menuItem.submenu?.length ? toggleSubmenu(menuItem) : runContextMenuAction(menuItem)">
                <i class="fa-solid {{ menuItem.icon }}"></i>
                <span>{{ menuItem.label }}</span>
                @if (menuItem.shortcut) {
                  <kbd>{{ menuItem.shortcut }}</kbd>
                }
              </button>
              @if (menuItem.submenu?.length && submenuOpen() === menuItem.action) {
                <div class="excel-context-submenu" role="menu" [attr.aria-label]="menuItem.label">
                  @for (subItem of menuItem.submenu; track subItem.action) {
                    <button type="button"
                            role="menuitem"
                            [disabled]="subItem.disabled"
                            [attr.aria-disabled]="subItem.disabled ? 'true' : null"
                            [attr.aria-description]="subItem.disabledReason ?? null"
                            [attr.title]="subItem.disabledReason ?? null"
                            [attr.data-excel-menu-action]="subItem.action"
                            [attr.data-excel-submenu-action]="menuItem.action"
                            (click)="runContextMenuAction(subItem)">
                      <i class="fa-solid {{ subItem.icon }}"></i>
                      <span>{{ subItem.label }}</span>
                      @if (subItem.shortcut) { <kbd>{{ subItem.shortcut }}</kbd> }
                    </button>
                  }
                </div>
              }
            }
          </div>
        </div>
      }

      @if (cellInfo(); as info) {
        <aside class="excel-cell-info" role="dialog" aria-label="Thông tin ô đang chọn">
          <header>
            <strong>{{ info.sheetName }} · {{ info.address }}</strong>
            <button type="button" aria-label="Đóng thông tin ô" (click)="cellInfo.set(null)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <dl>
            <div><dt>Hiển thị</dt><dd>{{ info.displayValue || '—' }}</dd></div>
            <div><dt>Giá trị gốc</dt><dd>{{ info.rawValue || '—' }}</dd></div>
            <div><dt>Công thức</dt><dd>{{ info.formula || '—' }}</dd></div>
            <div><dt>Định dạng</dt><dd>{{ info.numberFormat || '—' }}</dd></div>
            <div><dt>Căn lề</dt><dd>{{ info.alignment || '—' }}</dd></div>
            <div><dt>Xuống dòng</dt><dd>{{ info.wrapText }}</dd></div>
            <div><dt>Ô gộp</dt><dd>{{ info.mergedRange || 'Không' }}</dd></div>
            <div><dt>Ghi chú</dt><dd>{{ info.note || '—' }}</dd></div>
            <div><dt>Liên kết</dt><dd>{{ info.hyperlink || '—' }}</dd></div>
          </dl>
        </aside>
      }

      @if (selectionInfo(); as info) {
        <aside class="excel-cell-info excel-selection-info" role="dialog" aria-label="Thống kê vùng đang chọn">
          <header>
            <strong>{{ info.sheetName }} · {{ info.address }}</strong>
            <button type="button" aria-label="Đóng thống kê vùng" (click)="selectionInfo.set(null)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <dl>
            <div><dt>Có dữ liệu</dt><dd>{{ info.populatedCells }} ô</dd></div>
            <div><dt>Giá trị số</dt><dd>{{ info.numericCells }} ô</dd></div>
            <div><dt>Tổng</dt><dd>{{ formatSelectionMetric(info.total) }}</dd></div>
            <div><dt>Trung bình</dt><dd>{{ formatSelectionMetric(info.average) }}</dd></div>
            <div><dt>Nhỏ nhất</dt><dd>{{ formatSelectionMetric(info.minimum) }}</dd></div>
            <div><dt>Lớn nhất</dt><dd>{{ formatSelectionMetric(info.maximum) }}</dd></div>
          </dl>
          @if (info.truncated) {
            <p>Đã giới hạn thống kê ở 50.000 ô đầu để giữ viewer mượt.</p>
          }
        </aside>
      }

      @if (dimensionEditor(); as editor) {
        <div class="excel-mini-dialog-backdrop" (pointerdown)="closeDimensionEditor()">
          <div class="excel-mini-dialog" role="dialog" aria-modal="true"
               [attr.aria-label]="editor.kind === 'column' ? 'Đặt độ rộng cột' : 'Đặt chiều cao hàng'"
               (pointerdown)="$event.stopPropagation()"
               (keydown.escape)="closeDimensionEditor(); $event.stopPropagation()">
            <header>
              <strong>{{ editor.kind === 'column' ? 'Độ rộng cột' : 'Chiều cao hàng' }}</strong>
              <button type="button" aria-label="Đóng" (click)="closeDimensionEditor()">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </header>
            <label for="excel-dimension-value">Kích thước pixel</label>
            <input id="excel-dimension-value" class="excel-dimension-input" type="number"
                   min="12" max="500" step="1" [value]="editor.value"
                   (input)="updateDimensionValue($event)"
                   (keydown.enter)="applyDimensionEditor(); $event.preventDefault()">
            <div class="excel-mini-dialog-actions">
              <button type="button" class="is-quiet" (click)="closeDimensionEditor()">Hủy</button>
              <button type="button" (click)="applyDimensionEditor()">Áp dụng</button>
            </div>
          </div>
        </div>
      }

      @if (sheetListOpen()) {
        <div class="excel-mini-dialog-backdrop" (pointerdown)="closeSheetList()">
          <div class="excel-mini-dialog excel-sheet-list" role="dialog" aria-modal="true"
               aria-label="Danh sách sheet"
               (pointerdown)="$event.stopPropagation()"
               (keydown.escape)="closeSheetList(); $event.stopPropagation()">
            <header>
              <strong>Danh sách sheet</strong>
              <button type="button" aria-label="Đóng danh sách sheet" (click)="closeSheetList()">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </header>
            <div role="listbox" aria-label="Chọn sheet để xem">
              @for (sheet of previewSheetNames(); track sheet) {
                <button type="button" role="option"
                        [attr.aria-selected]="sheet === activePreviewSheetName()"
                        [class.is-active]="sheet === activePreviewSheetName()"
                        (click)="activateSheetByName(sheet)">
                  <i class="fa-regular fa-file-lines"></i>
                  <span>{{ sheet }}</span>
                  @if (sheet === activePreviewSheetName()) {
                    <i class="fa-solid fa-check"></i>
                  }
                </button>
              }
            </div>
          </div>
        </div>
      }

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

    .excel-metadata-warning {
      margin-left: .2rem;
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

    .excel-view-tools-bar {
      z-index: 3;
      min-height: 2.25rem;
      padding: .25rem .65rem;
      display: flex;
      align-items: center;
      gap: .45rem;
      flex: 0 0 auto;
      overflow-x: auto;
      border-bottom: 1px solid #dbe4ee;
      background: #fff;
      color: #64748b;
      font-size: 10px;
      font-weight: 650;
      scrollbar-width: none;
    }

    .excel-view-tools-bar::-webkit-scrollbar {
      display: none;
    }

    .excel-view-tool {
      min-height: 1.75rem;
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      flex: 0 0 auto;
      padding: .25rem .55rem;
      border: 1px solid #cbd5e1;
      border-radius: .45rem;
      background: #fff;
      color: #334155;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }

    .excel-view-tool:hover:not(:disabled) {
      border-color: #86efac;
      background: #f0fdf4;
      color: #047857;
    }

    .excel-view-tool.is-active {
      border-color: #16a34a;
      background: #dcfce7;
      color: #166534;
    }

    .excel-view-tool:focus-visible {
      outline: 2px solid #22c55e;
      outline-offset: 1px;
    }

    .excel-view-tool:disabled,
    .excel-view-tool.is-disabled {
      cursor: not-allowed;
      opacity: .58;
    }

    .excel-view-tool kbd {
      padding: .08rem .25rem;
      border: 1px solid #cbd5e1;
      border-bottom-width: 2px;
      border-radius: .25rem;
      background: #f8fafc;
      color: #64748b;
      font-size: 9px;
      font-weight: 800;
      line-height: 1.1;
    }

    .excel-view-tool small {
      color: #64748b;
      font-size: 9px;
      font-weight: 700;
    }

    .excel-view-state {
      display: inline-flex;
      align-items: center;
      gap: .3rem;
      flex: 0 0 auto;
      padding: .22rem .45rem;
      border: 1px solid #bae6fd;
      border-radius: 999px;
      background: #f0f9ff;
      color: #0369a1;
      font-size: 9px;
      font-weight: 800;
      white-space: nowrap;
      cursor: pointer;
      font-family: inherit;
    }

    .excel-view-state-panel {
      position: absolute;
      top: 2.55rem;
      right: .75rem;
      z-index: 34;
      width: min(23rem, calc(100% - 1.5rem));
      max-height: min(28rem, calc(100% - 4rem));
      overflow: auto;
      padding: .65rem;
      border: 1px solid #cbd5e1;
      border-radius: .7rem;
      background: #fff;
      box-shadow: 0 16px 42px rgba(15, 23, 42, .24);
      color: #334155;
      font-size: 11px;
    }

    .excel-view-state-panel header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .5rem;
      margin-bottom: .45rem;
    }

    .excel-view-state-panel header button {
      width: 1.8rem;
      height: 1.8rem;
      border: 0;
      border-radius: .35rem;
      background: transparent;
      color: #64748b;
      cursor: pointer;
    }

    .excel-view-state-list {
      display: grid;
      gap: .25rem;
    }

    .excel-view-state-list > button {
      width: 100%;
      min-height: 2.3rem;
      display: grid;
      grid-template-columns: 1.2rem minmax(0, 1fr) 1rem;
      align-items: center;
      gap: .45rem;
      padding: .35rem .5rem;
      border: 1px solid #e2e8f0;
      border-radius: .45rem;
      background: #f8fafc;
      color: #334155;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .excel-view-state-list > button:hover {
      border-color: #86efac;
      background: #f0fdf4;
      color: #166534;
    }

    .excel-view-state-list span {
      display: grid;
      gap: .08rem;
    }

    .excel-view-state-list small {
      color: #64748b;
      font-size: 9px;
      font-weight: 800;
    }

    .excel-view-state-list em {
      display: block;
      margin-top: .1rem;
      color: #64748b;
      font-size: 9px;
      font-style: normal;
      font-weight: 650;
    }

    .excel-filter-summary {
      display: grid;
      gap: .2rem;
      margin-top: .55rem;
      padding-top: .5rem;
      border-top: 1px solid #e2e8f0;
      color: #475569;
      font-size: 10px;
    }

    .excel-filter-summary span {
      font-weight: 800;
    }

    .excel-filter-summary small {
      overflow-wrap: anywhere;
      color: #64748b;
    }

    .excel-reset-view-state {
      width: 100%;
      min-height: 2.15rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: .4rem;
      margin-top: .5rem;
      border: 1px solid #16a34a;
      border-radius: .45rem;
      background: #16a34a;
      color: #fff;
      font: inherit;
      font-weight: 850;
      cursor: pointer;
    }

    .excel-go-to-panel {
      position: absolute;
      top: 2.55rem;
      left: .75rem;
      z-index: 32;
      display: grid;
      grid-template-columns: auto minmax(13rem, 24rem) auto auto;
      align-items: center;
      gap: .45rem;
      padding: .55rem;
      border: 1px solid #cbd5e1;
      border-radius: .65rem;
      background: #fff;
      box-shadow: 0 14px 35px rgba(15, 23, 42, .2);
      color: #334155;
      font-size: 11px;
    }

    .excel-go-to-panel label {
      font-weight: 850;
    }

    .excel-go-to-panel input {
      min-width: 0;
      height: 2rem;
      padding: .35rem .55rem;
      border: 1px solid #94a3b8;
      border-radius: .4rem;
      background: #fff;
      color: #0f172a;
      font: inherit;
      font-weight: 700;
      outline: none;
    }

    .excel-go-to-panel input:focus {
      border-color: #16a34a;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, .2);
    }

    .excel-go-to-panel > button,
    .excel-cell-info button {
      min-width: 2rem;
      height: 2rem;
      border: 1px solid #16a34a;
      border-radius: .4rem;
      background: #16a34a;
      color: #fff;
      font: inherit;
      font-weight: 850;
      cursor: pointer;
    }

    .excel-go-to-panel > button.is-quiet,
    .excel-cell-info button {
      border-color: transparent;
      background: transparent;
      color: #64748b;
    }

    .excel-go-to-panel small {
      grid-column: 2 / -1;
      color: #b91c1c;
      font-weight: 750;
    }

    .excel-go-to-history {
      grid-column: 2 / -1;
      display: flex;
      gap: .3rem;
      max-width: 28rem;
      overflow-x: auto;
      padding-top: .15rem;
    }

    .excel-go-to-history button {
      flex: 0 0 auto;
      padding: .2rem .4rem;
      border: 1px solid #cbd5e1;
      border-radius: .35rem;
      background: #f8fafc;
      color: #475569;
      font: inherit;
      font-size: 9px;
      font-weight: 800;
      cursor: pointer;
    }

    .excel-scoped-find {
      position: absolute;
      top: 2.55rem;
      right: .75rem;
      z-index: 33;
      display: grid;
      grid-template-columns: minmax(12rem, 22rem) auto;
      gap: .4rem;
      width: min(25rem, calc(100% - 1.5rem));
      padding: .55rem;
      border: 1px solid #cbd5e1;
      border-radius: .65rem;
      background: #fff;
      box-shadow: 0 14px 35px rgba(15, 23, 42, .2);
      color: #334155;
      font-size: 11px;
    }

    .excel-scoped-find header {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .5rem;
    }

    .excel-scoped-find header button {
      width: 1.8rem;
      height: 1.8rem;
      border: 0;
      border-radius: .35rem;
      background: transparent;
      color: #64748b;
      cursor: pointer;
    }

    .excel-scoped-find-input {
      min-width: 0;
      height: 2rem;
      padding: .35rem .55rem;
      border: 1px solid #94a3b8;
      border-radius: .4rem;
      background: #fff;
      color: #0f172a;
      font: inherit;
      font-weight: 700;
      outline: none;
    }

    .excel-scoped-find-input:focus {
      border-color: #16a34a;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, .2);
    }

    .excel-scoped-find-actions {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: .25rem;
      white-space: nowrap;
    }

    .excel-scoped-find-actions button {
      width: 2rem;
      height: 2rem;
      border: 1px solid #cbd5e1;
      border-radius: .4rem;
      background: #f8fafc;
      color: #475569;
      cursor: pointer;
    }

    .excel-context-backdrop {
      position: fixed;
      inset: 0;
      z-index: 210;
    }

    .excel-context-menu {
      position: fixed;
      width: min(19rem, calc(100vw - 1rem));
      max-height: min(33rem, calc(100vh - 1rem));
      overflow-y: auto;
      padding: .35rem;
      border: 1px solid #cbd5e1;
      border-radius: .65rem;
      background: #fff;
      box-shadow: 0 18px 45px rgba(15, 23, 42, .28);
      color: #1e293b;
      outline: none;
    }

    .excel-context-menu button {
      width: 100%;
      min-height: 2rem;
      display: grid;
      grid-template-columns: 1.25rem minmax(0, 1fr) auto;
      align-items: center;
      gap: .45rem;
      padding: .35rem .5rem;
      border: 0;
      border-radius: .4rem;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 11px;
      font-weight: 720;
      text-align: left;
      cursor: pointer;
    }

    .excel-context-menu button:hover:not(:disabled),
    .excel-context-menu button:focus-visible {
      background: #dcfce7;
      color: #166534;
      outline: none;
    }

    .excel-context-menu button:disabled {
      opacity: .42;
      cursor: not-allowed;
    }

    .excel-context-submenu {
      position: absolute;
      left: calc(100% - .15rem);
      min-width: 14rem;
      margin-top: -2.3rem;
      padding: .35rem;
      border: 1px solid #cbd5e1;
      border-radius: .65rem;
      background: #fff;
      box-shadow: 0 18px 45px rgba(15, 23, 42, .28);
      color: #1e293b;
    }

    .excel-context-submenu button {
      min-height: 2rem;
    }

    .excel-context-menu button > i {
      color: #64748b;
      text-align: center;
    }

    .excel-context-menu button > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .excel-context-menu kbd {
      color: #64748b;
      font-size: 9px;
      font-weight: 750;
    }

    .excel-context-separator {
      height: 1px;
      margin: .3rem .2rem;
      background: #e2e8f0;
    }

    .excel-cell-info {
      position: absolute;
      right: .75rem;
      bottom: 2.75rem;
      z-index: 31;
      width: min(25rem, calc(100% - 1.5rem));
      max-height: min(24rem, calc(100% - 4rem));
      overflow: auto;
      padding: .65rem;
      border: 1px solid #cbd5e1;
      border-radius: .65rem;
      background: #fff;
      box-shadow: 0 14px 35px rgba(15, 23, 42, .22);
      color: #334155;
      font-size: 11px;
    }

    .excel-cell-info header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .5rem;
      margin-bottom: .45rem;
    }

    .excel-cell-info dl,
    .excel-cell-info dl > div {
      margin: 0;
    }

    .excel-cell-info dl > div {
      display: grid;
      grid-template-columns: 5.5rem minmax(0, 1fr);
      gap: .45rem;
      padding: .3rem 0;
      border-top: 1px solid #e2e8f0;
    }

    .excel-cell-info dt {
      color: #64748b;
      font-weight: 800;
    }

    .excel-cell-info dd {
      margin: 0;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .excel-selection-info p {
      margin: .45rem 0 0;
      color: #92400e;
      font-size: 10px;
      font-weight: 720;
    }

    .excel-mini-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 220;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: rgba(15, 23, 42, .32);
    }

    .excel-mini-dialog {
      width: min(22rem, calc(100vw - 2rem));
      padding: .75rem;
      border: 1px solid #cbd5e1;
      border-radius: .8rem;
      background: #fff;
      box-shadow: 0 20px 55px rgba(15, 23, 42, .28);
      color: #334155;
      font-size: 11px;
    }

    .excel-mini-dialog header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .5rem;
      margin-bottom: .65rem;
    }

    .excel-mini-dialog header button {
      width: 2rem;
      height: 2rem;
      border: 0;
      border-radius: .4rem;
      background: transparent;
      color: #64748b;
      cursor: pointer;
    }

    .excel-mini-dialog > label {
      display: block;
      margin-bottom: .3rem;
      color: #64748b;
      font-weight: 800;
    }

    .excel-mini-dialog > input {
      width: 100%;
      height: 2.25rem;
      padding: .35rem .55rem;
      border: 1px solid #94a3b8;
      border-radius: .45rem;
      background: #fff;
      color: #0f172a;
      font: inherit;
      font-weight: 750;
      outline: none;
    }

    .excel-mini-dialog > input:focus {
      border-color: #16a34a;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, .2);
    }

    .excel-mini-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: .4rem;
      margin-top: .75rem;
    }

    .excel-mini-dialog-actions button,
    .excel-sheet-list [role="option"] {
      min-height: 2.1rem;
      padding: .35rem .65rem;
      border: 1px solid #16a34a;
      border-radius: .45rem;
      background: #16a34a;
      color: #fff;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }

    .excel-mini-dialog-actions button.is-quiet {
      border-color: #cbd5e1;
      background: #fff;
      color: #475569;
    }

    .excel-sheet-list {
      max-height: min(34rem, calc(100vh - 2rem));
    }

    .excel-sheet-list [role="listbox"] {
      display: grid;
      gap: .25rem;
      max-height: 27rem;
      overflow-y: auto;
    }

    .excel-sheet-list [role="option"] {
      width: 100%;
      display: grid;
      grid-template-columns: 1rem minmax(0, 1fr) 1rem;
      align-items: center;
      gap: .45rem;
      border-color: transparent;
      background: transparent;
      color: #334155;
      text-align: left;
    }

    .excel-sheet-list [role="option"]:hover,
    .excel-sheet-list [role="option"].is-active {
      border-color: #86efac;
      background: #dcfce7;
      color: #166534;
    }

    .excel-loading-layer {
      position: absolute;
      inset: 2.25rem 0 0;
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

    :host-context(.dark) .excel-view-tools-bar {
      border-bottom-color: #334155;
      background: #111827;
      color: #94a3b8;
    }

    :host-context(.dark) .excel-view-tool {
      border-color: #475569;
      background: #1e293b;
      color: #e2e8f0;
    }

    :host-context(.dark) .excel-view-tool:hover:not(:disabled) {
      border-color: #4ade80;
      background: #14532d;
      color: #bbf7d0;
    }

    :host-context(.dark) .excel-view-tool.is-active {
      border-color: #4ade80;
      background: #14532d;
      color: #bbf7d0;
    }

    :host-context(.dark) .excel-view-tool kbd {
      border-color: #475569;
      background: #0f172a;
      color: #94a3b8;
    }

    :host-context(.dark) .excel-view-state {
      border-color: #0369a1;
      background: rgba(7, 89, 133, .35);
      color: #7dd3fc;
    }

    :host-context(.dark) .excel-view-state-panel {
      border-color: #475569;
      background: #1e293b;
      color: #e2e8f0;
    }

    :host-context(.dark) .excel-view-state-list > button {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
    }

    :host-context(.dark) .excel-view-state-list > button:hover {
      border-color: #4ade80;
      background: #14532d;
      color: #bbf7d0;
    }

    :host-context(.dark) .excel-go-to-panel,
    :host-context(.dark) .excel-context-menu,
    :host-context(.dark) .excel-context-submenu,
    :host-context(.dark) .excel-scoped-find,
    :host-context(.dark) .excel-cell-info {
      border-color: #475569;
      background: #1e293b;
      color: #e2e8f0;
    }

    :host-context(.dark) .excel-go-to-panel input {
      border-color: #64748b;
      background: #0f172a;
      color: #f8fafc;
    }

    :host-context(.dark) .excel-go-to-history button {
      border-color: #475569;
      background: #0f172a;
      color: #cbd5e1;
    }

    :host-context(.dark) .excel-scoped-find-input,
    :host-context(.dark) .excel-scoped-find-actions button {
      border-color: #64748b;
      background: #0f172a;
      color: #f8fafc;
    }

    :host-context(.dark) .excel-view-state-list em,
    :host-context(.dark) .excel-filter-summary,
    :host-context(.dark) .excel-filter-summary small {
      color: #94a3b8;
    }

    :host-context(.dark) .excel-filter-summary {
      border-color: #334155;
    }

    :host-context(.dark) .excel-context-menu button:hover:not(:disabled),
    :host-context(.dark) .excel-context-menu button:focus-visible {
      background: #14532d;
      color: #bbf7d0;
    }

    :host-context(.dark) .excel-context-separator {
      background-color: #334155;
    }

    :host-context(.dark) .excel-cell-info dl > div {
      border-color: #334155;
    }

    :host-context(.dark) .excel-mini-dialog {
      border-color: #475569;
      background: #1e293b;
      color: #e2e8f0;
    }

    :host-context(.dark) .excel-mini-dialog > input,
    :host-context(.dark) .excel-mini-dialog-actions button.is-quiet {
      border-color: #64748b;
      background: #0f172a;
      color: #f8fafc;
    }

    :host-context(.dark) .excel-sheet-list [role="option"] {
      color: #e2e8f0;
    }

    :host-context(.dark) .excel-sheet-list [role="option"]:hover,
    :host-context(.dark) .excel-sheet-list [role="option"].is-active {
      border-color: #4ade80;
      background: #14532d;
      color: #bbf7d0;
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
      .excel-univer-host {
        touch-action: none;
      }

      .excel-view-tools-bar {
        min-height: 2.75rem;
        padding-inline: .5rem;
      }

      .excel-loading-layer {
        inset: 2.75rem 0 0;
      }

      .excel-univer-shell {
        min-height: calc(2.75rem + max(env(safe-area-inset-bottom), .5rem));
        padding-bottom: max(env(safe-area-inset-bottom), .5rem);
      }

      .excel-go-to-panel {
        top: 3rem;
        right: .5rem;
        left: .5rem;
        grid-template-columns: 1fr auto auto;
      }

      .excel-scoped-find {
        top: 3rem;
        right: .5rem;
        left: .5rem;
        width: auto;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .excel-view-state-panel {
        top: 3rem;
        right: .5rem;
        left: .5rem;
        width: auto;
      }

      .excel-go-to-panel label {
        grid-column: 1 / -1;
      }

      .excel-go-to-panel small {
        grid-column: 1 / -1;
      }

      .excel-go-to-history {
        grid-column: 1 / -1;
      }

      .excel-context-menu {
        right: .5rem;
        bottom: max(.5rem, env(safe-area-inset-bottom));
        left: .5rem !important;
        top: auto !important;
        width: auto;
        max-height: min(70vh, 34rem);
        border-radius: .85rem;
      }

      .excel-context-submenu {
        position: static;
        min-width: 0;
        margin: .15rem 0 .25rem;
        border-radius: .5rem;
        box-shadow: none;
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
  private readonly toast = inject(ToastService);
  readonly loading = signal(true);
  readonly truncatedSheets = signal<string[]>([]);
  readonly metadataLimited = signal(false);
  readonly unsupportedFeatures = signal<ExcelUnsupportedFeatureSummary[]>([]);
  readonly autoFilterSheetNames = signal<string[]>([]);
  readonly autoFilterTargets = signal<ExcelViewAutoFilterTarget[]>([]);
  readonly previewFilterSheetNames = signal<string[]>([]);
  readonly selectedDataRangeLabel = signal('');
  readonly wrapTextEnabled = signal(false);
  readonly goToOpen = signal(false);
  readonly goToValue = signal('');
  readonly goToError = signal('');
  readonly goToHistory = signal<string[]>([]);
  readonly contextMenu = signal<ExcelPreviewContextMenuState | null>(null);
  readonly cellInfo = signal<ExcelPreviewCellInfo | null>(null);
  readonly selectionInfo = signal<ExcelPreviewSelectionInfo | null>(null);
  readonly scopedFind = signal<ExcelPreviewScopedFind | null>(null);
  readonly dimensionEditor = signal<ExcelPreviewDimensionEditor | null>(null);
  readonly sheetListOpen = signal(false);
  readonly previewSheetNames = signal<string[]>([]);
  readonly activePreviewSheetName = signal('');
  readonly previewFilterSummaries = signal<ExcelPreviewFilterSummary[]>([]);
  readonly temporaryViewChanges = signal<ExcelPreviewViewChange[]>([]);
  readonly viewStateOpen = signal(false);
  readonly submenuOpen = signal<ExcelPreviewMenuAction | null>(null);
  readonly temporaryViewChangeLabels = computed(() =>
    this.temporaryViewChanges().map(change => `${change.sheetName}: ${change.label}`)
  );
  readonly viewStateChips = computed(() => {
    const grouped = new Map<ExcelPreviewViewChangeKind, ExcelPreviewViewChange[]>();
    for (const change of this.temporaryViewChanges()) {
      const current = grouped.get(change.kind) ?? [];
      current.push(change);
      grouped.set(change.kind, current);
    }
    return Array.from(grouped.entries()).map(([kind, changes]) => {
      const details = changes.map(change => this.viewChangeSummary(change)).filter(Boolean);
      const hiddenColumns = changes
        .filter(change => change.details?.axis === 'column')
        .reduce((sum, change) => sum + (change.details?.count ?? 0), 0);
      const hiddenRows = changes
        .filter(change => change.details?.axis === 'row')
        .reduce((sum, change) => sum + (change.details?.count ?? 0), 0);
      const hiddenLabel = [hiddenColumns ? `${hiddenColumns} cột` : '', hiddenRows ? `${hiddenRows} hàng` : '']
        .filter(Boolean).join(', ') || `${changes.length} vùng`;
      const labelByKind: Record<ExcelPreviewViewChangeKind, string> = {
        filter: `Filter · ${changes.length} cột`,
        sort: `Sort · ${details[0] || 'đang áp dụng'}`,
        hidden: `Ẩn · ${hiddenLabel}`,
        freeze: 'Freeze',
        zoom: 'Zoom',
        dimensions: 'Kích thước',
        format: 'Format',
        gridlines: 'Gridlines',
      };
      return {
        kind,
        label: labelByKind[kind],
        title: changes.map(change => `${change.sheetName}: ${change.label} ${this.viewChangeSummary(change)}`).join(' · '),
      };
    });
  });
  readonly unsupportedFeatureWarning = computed(() => {
    const features = this.unsupportedFeatures().map(summary =>
      `${EXCEL_UNSUPPORTED_FEATURE_LABELS[summary.feature]} (${summary.count})`
    );
    return `Bản xem trước không giữ ${features.join(', ')}. Hãy kiểm tra tệp gốc nếu cần các metadata này.`;
  });
  readonly filterToolTitle = computed(() => {
    if (this.previewFilterSheetNames().length) {
      return 'Filter đang bật trong bản xem trước. Bấm để mở bảng chọn điều kiện lọc.';
    }
    if (this.autoFilterSheetNames().length) {
      return 'AutoFilter gốc không đủ hàng. Bấm để tạo Filter tạm trên vùng dữ liệu đang chọn.';
    }
    return 'Tạo Filter tạm trên vùng dữ liệu đang chọn (Ctrl+Shift+L).';
  });

  private viewReady = false;
  private loadToken = 0;
  private univer?: UniverBundle['univer'];
  private univerAPI?: UniverBundle['univerAPI'];
  private sourceSnapshot?: UniverWorkbookSnapshot;
  private sourceMetadata?: ExcelWorkbookMetadata;
  private contextMenuReturnFocus?: HTMLElement;
  private contextMenuTarget?: ExcelPreviewContextTarget;
  private removeReadonlyInteractionGuard?: () => void;
  private removeUniverEvents?: () => void;
  private readonly previewBoundsBySheetName = new Map<string, { rows: number; columns: number }>();
  private readonly previewUsedRangeBySheetName = new Map<string, ExcelRangeMetadata>();
  private readonly viewChangeUndo = new Map<string, () => void>();

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
    if (this.submenuOpen()) {
      this.closeSubmenu();
      return true;
    }
    if (this.viewStateOpen()) {
      this.viewStateOpen.set(false);
      return true;
    }
    if (this.dimensionEditor()) {
      this.closeDimensionEditor();
      return true;
    }
    if (this.sheetListOpen()) {
      this.closeSheetList();
      return true;
    }
    if (this.contextMenu()) {
      this.closeContextMenu();
      return true;
    }
    if (this.goToOpen()) {
      this.closeGoTo();
      return true;
    }
    if (this.scopedFind()) {
      this.closeScopedFind();
      return true;
    }
    if (this.cellInfo()) {
      this.cellInfo.set(null);
      return true;
    }
    if (this.selectionInfo()) {
      this.selectionInfo.set(null);
      return true;
    }
    const active = document.activeElement;
    if (active instanceof HTMLElement && this.univerHost.nativeElement.contains(active)) {
      active.blur();
    }
    // Univer is a complete viewer surface now; Escape should close the
    // surrounding preview modal on the first press instead of getting caught
    // in an invisible legacy focus mode.
    return false;
  }

  openFindDialog(initialValue = ''): void {
    if (!this.univerAPI) return;
    this.closeContextMenu();
    void this.univerAPI.executeCommand('ui.operation.open-find-dialog').then(() => {
      if (!initialValue) return;
      window.setTimeout(() => {
        const candidates = Array.from(document.querySelectorAll<HTMLInputElement>(
          '[data-u-comp*="find"] input, [class*="find"] input, [class*="Find"] input',
        ));
        const input = candidates.find(candidate => candidate.offsetParent !== null && !candidate.disabled);
        if (!input) return;
        input.value = initialValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
        input.select();
      });
    }).catch(() => {
      // Search is optional viewer UI; a command failure must not affect workbook rendering.
    });
  }

  toggleGoTo(): void {
    if (this.goToOpen()) {
      this.closeGoTo();
      return;
    }
    this.closeContextMenu();
    const selection = this.getActivePreviewSelection();
    this.goToValue.set(selection?.range.getA1Notation() ?? 'A1');
    this.goToError.set('');
    this.goToOpen.set(true);
    window.setTimeout(() => {
      const input = this.univerHost.nativeElement.parentElement?.querySelector<HTMLInputElement>('.excel-go-to-input');
      input?.focus();
      input?.select();
    });
  }

  closeGoTo(): void {
    this.goToOpen.set(false);
    this.goToError.set('');
  }

  closeScopedFind(): void {
    this.scopedFind.set(null);
  }

  updateScopedFind(event: Event): void {
    const current = this.scopedFind();
    if (!current) return;
    const value = (event.target as HTMLInputElement).value;
    const selection = this.getActivePreviewSelection();
    if (!selection) return;
    const dataRange = this.getPreviewUsedRange(selection.worksheet);
    const normalized = value.trim().toLocaleLowerCase('vi-VN');
    const matches: number[] = [];
    if (normalized) {
      if (current.axis === 'column') {
        const rows = dataRange.endRow - dataRange.startRow + 1;
        const values = selection.worksheet.getRange(dataRange.startRow, current.index, rows, 1).getDisplayValues();
        values.forEach((row, offset) => {
          if (String(row[0] ?? '').toLocaleLowerCase('vi-VN').includes(normalized)) {
            matches.push(dataRange.startRow + offset);
          }
        });
      } else {
        const columns = dataRange.endColumn - dataRange.startColumn + 1;
        const values = selection.worksheet.getRange(current.index, dataRange.startColumn, 1, columns).getDisplayValues()[0] ?? [];
        values.forEach((cell, offset) => {
          if (String(cell ?? '').toLocaleLowerCase('vi-VN').includes(normalized)) {
            matches.push(dataRange.startColumn + offset);
          }
        });
      }
    }
    this.scopedFind.set({ ...current, value, matches, cursor: -1 });
    if (matches.length) this.moveScopedFind(1);
  }

  moveScopedFind(direction: -1 | 1): void {
    const current = this.scopedFind();
    const selection = this.getActivePreviewSelection();
    if (!current || !selection || !current.matches.length) return;
    const cursor = (current.cursor + direction + current.matches.length) % current.matches.length;
    const coordinate = current.matches[cursor];
    const range = current.axis === 'column'
      ? selection.worksheet.getRange(coordinate, current.index)
      : selection.worksheet.getRange(current.index, coordinate);
    selection.workbook.setActiveRange(range);
    selection.worksheet.scrollToCell(
      current.axis === 'column' ? coordinate : current.index,
      current.axis === 'column' ? current.index : coordinate,
      180,
    );
    this.scopedFind.set({ ...current, cursor });
  }

  private openScopedFind(axis: 'column' | 'row'): void {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;
    const active = (selection.workbook.getActiveCell() ?? selection.range).getRange();
    const index = axis === 'column' ? active.startColumn : active.startRow;
    this.scopedFind.set({
      axis,
      index,
      label: axis === 'column' ? `cột ${getExcelColumnLabel(index)}` : `hàng ${index + 1}`,
      value: '',
      matches: [],
      cursor: -1,
    });
    window.setTimeout(() => {
      const input = this.univerHost.nativeElement.parentElement?.querySelector<HTMLInputElement>('.excel-scoped-find-input');
      input?.focus();
    });
  }

  updateGoToValue(event: Event): void {
    this.goToValue.set((event.target as HTMLInputElement).value);
    this.goToError.set('');
  }

  goToTarget(): void {
    const target = parseExcelGoToTarget(this.goToValue());
    const workbook = this.univerAPI?.getActiveWorkbook();
    if (!target || !workbook) {
      this.goToError.set('Nhập địa chỉ như B12 hoặc \'Kết quả\'!C4:D9.');
      return;
    }

    const worksheet = target.sheetName
      ? workbook.getSheetByName(target.sheetName)
      : workbook.getActiveSheet();
    if (!worksheet) {
      this.goToError.set(`Không tìm thấy sheet “${target.sheetName}”.`);
      return;
    }

    try {
      const range = worksheet.getRange(target.address);
      workbook.setActiveSheet(worksheet);
      workbook.setActiveRange(range);
      const coordinates = range.getRange();
      worksheet.scrollToCell(coordinates.startRow, coordinates.startColumn, 180);
      this.selectedDataRangeLabel.set(range.getA1Notation());
      this.activePreviewSheetName.set(worksheet.getSheetName());
      const historyAddress = target.sheetName
        ? `'${worksheet.getSheetName().replace(/'/g, "''")}'!${range.getA1Notation()}`
        : range.getA1Notation();
      this.goToHistory.update(history => [historyAddress, ...history.filter(item => item !== historyAddress)].slice(0, 10));
      this.closeGoTo();
    } catch {
      this.goToError.set('Địa chỉ nằm ngoài vùng bảng tính có thể xem.');
    }
  }

  useGoToHistory(address: string): void {
    this.goToValue.set(address);
    this.goToError.set('');
    this.goToTarget();
  }

  selectPreviewDataRange(): void {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;
    try {
      const coordinates = this.getPreviewUsedRange(selection.worksheet);
      const dataRange = selection.worksheet.getRange(
        coordinates.startRow,
        coordinates.startColumn,
        coordinates.endRow - coordinates.startRow + 1,
        coordinates.endColumn - coordinates.startColumn + 1,
      );
      selection.workbook.setActiveRange(dataRange);
      this.selectedDataRangeLabel.set(dataRange.getA1Notation());
    } catch {
      // Selection is optional viewer state and must never affect rendering.
    }
  }

  async applyPreviewFilter(): Promise<void> {
    let filterPanel: { unitId: string; subUnitId: string; col: number } | undefined;
    let createdPreviewFilter = false;

    await this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;

      let filterRange = selection.worksheet.getFilter()?.getRange();
      if (!filterRange) {
        const candidate = getPreviewFilterCandidateRange(
          selection.range.getRange(),
          this.getPreviewUsedRange(selection.worksheet),
        );
        if (!candidate) return;

        filterRange = selection.worksheet.getRange(
          candidate.startRow,
          candidate.startColumn,
          candidate.endRow - candidate.startRow + 1,
          candidate.endColumn - candidate.startColumn + 1,
        );
        const createdFilter = filterRange.createFilter();
        createdPreviewFilter = !!createdFilter || !!selection.worksheet.getFilter();
        if (!createdFilter) {
          filterRange = selection.worksheet.getFilter()?.getRange();
        }
      }
      if (!filterRange) return;

      const range = filterRange.getRange();
      const activeColumn = selection.workbook.getActiveCell()?.getRange().startColumn ?? range.startColumn;
      const filterColumn = Math.max(range.startColumn, Math.min(range.endColumn, activeColumn));
      selection.workbook.setActiveRange(selection.worksheet.getRange(
        range.startRow,
        range.startColumn,
        1,
        range.endColumn - range.startColumn + 1,
      ));
      this.selectedDataRangeLabel.set(filterRange.getA1Notation());
      this.syncPreviewFilterSheetNames(selection.workbook);
      if (createdPreviewFilter) {
        const details = this.getFilterViewDetails(selection.worksheet);
        this.markTemporaryViewChange(
          `Filter ${filterRange.getA1Notation()}`,
          'filter',
          details,
          () => selection.worksheet.getFilter()?.remove(),
        );
      }
      filterPanel = {
        unitId: selection.workbook.getId(),
        subUnitId: selection.worksheet.getSheetId(),
        col: filterColumn,
      };
    });

    if (!filterPanel || !this.univerAPI) return;
    await this.univerAPI.executeCommand('sheet.operation.open-filter-panel', filterPanel).catch(() => {
      // Filter arrows remain usable even if opening the first panel fails.
    });
  }

  centerPreviewSelection(): void {
    this.alignPreviewSelection('center');
  }

  togglePreviewWrapText(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;

      const previous = selection.range.getCellDataGrid();
      const shouldWrap = selection.range.getWrapStrategy() !== WrapStrategy.WRAP;
      selection.range.setWrapStrategy(shouldWrap ? WrapStrategy.WRAP : WrapStrategy.CLIP);
      this.wrapTextEnabled.set(shouldWrap);
      this.markTemporaryViewChange(
        shouldWrap ? 'Đã bật xuống dòng' : 'Đã tắt xuống dòng',
        'format',
        { range: selection.range.getA1Notation(), summary: 'Wrap text' },
        () => this.restoreCellContent(selection.range, previous),
      );
    });
  }

  autofitPreview(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;

      const selectedRange = selection.range.getRange();
      const usedRange = this.getPreviewUsedRange(selection.worksheet);
      const fitRange =
        selectedRange.startRow === selectedRange.endRow &&
        selectedRange.startColumn === selectedRange.endColumn
        ? usedRange
        : selectedRange;

      const columnCount = Math.max(1, fitRange.endColumn - fitRange.startColumn + 1);
      const rowCount = Math.max(1, fitRange.endRow - fitRange.startRow + 1);
      const previousWidths = Array.from({ length: columnCount }, (_, offset) =>
        selection.worksheet.getColumnWidth(fitRange.startColumn + offset)
      );
      const previousHeights = Array.from({ length: rowCount }, (_, offset) =>
        selection.worksheet.getRowHeight(fitRange.startRow + offset)
      );

      selection.worksheet.autoResizeColumns(
        fitRange.startColumn,
        columnCount,
      );
      selection.worksheet.autoResizeRows(
        fitRange.startRow,
        rowCount,
      );
      this.markTemporaryViewChange(
        'Đã tự co giãn cột và hàng',
        'dimensions',
        { range: selection.range.getA1Notation(), summary: `${columnCount} cột · ${rowCount} hàng` },
        () => {
          previousWidths.forEach((width, offset) => selection.worksheet.setColumnWidth(fitRange.startColumn + offset, width));
          previousHeights.forEach((height, offset) => selection.worksheet.setRowHeight(fitRange.startRow + offset, height));
        },
      );
    });
  }

  fitPreviewWidth(): void {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;

    try {
      const dataRange = this.getPreviewUsedRange(selection.worksheet);
      let contentWidth = 0;
      for (let column = dataRange.startColumn; column <= dataRange.endColumn; column++) {
        contentWidth += selection.worksheet.getColumnWidth(column);
      }
      const availableWidth = Math.max(160, this.univerHost.nativeElement.clientWidth - 58);
      const ratio = Math.max(.2, Math.min(2, availableWidth / Math.max(1, contentWidth)));
      const previousZoom = selection.worksheet.getZoom();
      selection.worksheet.zoom(ratio);
      selection.worksheet.scrollToCell(dataRange.startRow, dataRange.startColumn, 180);
      this.markTemporaryViewChange(
        `Zoom ${Math.round(ratio * 100)}% vừa chiều rộng`,
        'zoom',
        { summary: `Vừa chiều rộng · ${Math.round(ratio * 100)}%` },
        () => selection.worksheet.zoom(previousZoom),
      );
    } catch {
      this.toast.show('Không thể tính vừa chiều rộng cho sheet này.', 'warning');
    }
  }

  fitPreviewSelection(): void {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;

    try {
      const range = selection.range.getRange();
      let contentWidth = 0;
      let contentHeight = 0;
      for (let column = range.startColumn; column <= range.endColumn; column++) {
        contentWidth += selection.worksheet.getColumnWidth(column);
      }
      for (let row = range.startRow; row <= range.endRow; row++) {
        contentHeight += selection.worksheet.getRowHeight(row);
      }
      const availableWidth = Math.max(160, this.univerHost.nativeElement.clientWidth - 58);
      const availableHeight = Math.max(120, this.univerHost.nativeElement.clientHeight - 74);
      const ratio = Math.max(.2, Math.min(2,
        availableWidth / Math.max(1, contentWidth),
        availableHeight / Math.max(1, contentHeight),
      ));
      const previousZoom = selection.worksheet.getZoom();
      selection.worksheet.zoom(ratio);
      selection.worksheet.scrollToCell(range.startRow, range.startColumn, 180);
      this.markTemporaryViewChange(
        `Zoom ${Math.round(ratio * 100)}% vừa vùng ${selection.range.getA1Notation()}`,
        'zoom',
        { range: selection.range.getA1Notation(), summary: `Vừa vùng · ${Math.round(ratio * 100)}%` },
        () => selection.worksheet.zoom(previousZoom),
      );
    } catch {
      this.toast.show('Không thể tính mức zoom cho vùng đang chọn.', 'warning');
    }
  }

  resetPreviewZoom(): void {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;
    try {
      selection.worksheet.zoom(1);
      this.removeTemporaryViewChange('zoom', selection.worksheet.getSheetName());
    } catch {
      this.toast.show('Không thể đưa sheet về zoom 100%.', 'warning');
    }
  }

  resetPreviewView(): void {
    this.viewStateOpen.set(false);
    this.closeContextMenu();
    this.closeGoTo();
    this.cellInfo.set(null);
    this.toast.show('Đang khôi phục cách xem ban đầu từ file gốc.', 'info');
    void this.resetWorkbookFromSource();
  }

  toggleViewStatePanel(): void {
    this.closeContextMenu();
    this.viewStateOpen.update(open => !open);
  }

  viewChangeIcon(kind: ExcelPreviewViewChangeKind): string {
    const icons: Record<ExcelPreviewViewChangeKind, string> = {
      filter: 'fa-filter',
      sort: 'fa-arrow-down-a-z',
      hidden: 'fa-eye-slash',
      freeze: 'fa-thumbtack',
      zoom: 'fa-magnifying-glass',
      dimensions: 'fa-ruler',
      format: 'fa-align-left',
      gridlines: 'fa-border-all',
    };
    return icons[kind];
  }

  canClearViewChangeIndividually(change: ExcelPreviewViewChange): boolean {
    return this.viewChangeUndo.has(change.id);
  }

  clearViewChange(change: ExcelPreviewViewChange): void {
    const clear = this.viewChangeUndo.get(change.id);
    if (!clear) {
      this.resetPreviewView();
      return;
    }

    void this.runPreviewTool(() => {
      clear();
      this.removeTemporaryViewChangeById(change.id);
      const workbook = this.univerAPI?.getActiveWorkbook();
      if (workbook) this.syncPreviewFilterSheetNames(workbook);
    });
  }

  openMoreMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.contextMenu()?.target === 'more') {
      this.closeContextMenu();
      return;
    }

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.showContextMenu('more', rect.left, rect.bottom + 5);
  }

  openNavigationMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.contextMenu()?.target === 'navigation') {
      this.closeContextMenu();
      return;
    }

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.showContextMenu('navigation', rect.left, rect.bottom + 5);
  }

  openPreviewContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const hostRect = this.univerHost.nativeElement.getBoundingClientRect();
    const target = event.target instanceof Element && event.target.closest('[role="tab"]')
      ? 'sheet'
      : classifyExcelPreviewContextTarget(
          event.clientX - hostRect.left,
          event.clientY - hostRect.top,
          hostRect.width,
          hostRect.height,
        );
    this.showContextMenu(target, event.clientX, event.clientY);
  }

  closeContextMenu(): void {
    this.contextMenu.set(null);
    this.submenuOpen.set(null);
    this.contextMenuTarget = undefined;
    const returnFocus = this.contextMenuReturnFocus;
    this.contextMenuReturnFocus = undefined;
    window.setTimeout(() => {
      if (this.goToOpen() || this.dimensionEditor() || this.sheetListOpen()) return;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      else this.univerHost.nativeElement.focus({ preventScroll: true });
    });
  }

  contextMenuLabel(target: ExcelPreviewContextTarget): string {
    const labels: Record<ExcelPreviewContextTarget, string> = {
      cell: 'Công cụ xem ô hoặc vùng',
      column: 'Công cụ xem cột',
      row: 'Công cụ xem hàng',
      sheet: 'Công cụ xem sheet',
      navigation: 'Điều hướng bảng tính',
      more: 'Thêm công cụ xem',
    };
    return labels[target];
  }

  handleContextMenuKeydown(event: KeyboardEvent): void {
    const menu = event.currentTarget as HTMLElement;
    const items = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'));
    if (!items.length) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      const active = document.activeElement as HTMLElement | null;
      const action = active?.getAttribute('data-excel-menu-parent') as ExcelPreviewMenuAction | null;
      if (action) {
        this.submenuOpen.set(action);
        window.setTimeout(() => {
          menu.querySelector<HTMLElement>(`[data-excel-submenu-action="${action}"]`)?.focus();
        });
        event.preventDefault();
      }
      return;
    }

    if (event.key === 'ArrowLeft' && this.submenuOpen()) {
      const action = this.submenuOpen();
      this.closeSubmenu();
      if (action) menu.querySelector<HTMLElement>(`[data-excel-menu-parent="${action}"]`)?.focus();
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1 + items.length) % items.length;
    else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;
    else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (this.submenuOpen()) this.closeSubmenu();
      else this.closeContextMenu();
      return;
    } else {
      return;
    }

    event.preventDefault();
    items[Math.max(0, nextIndex)].focus();
  }

  toggleSubmenu(menuItem: ExcelPreviewMenuItem): void {
    if (!menuItem.submenu?.length) return;
    if (this.submenuOpen() === menuItem.action) {
      this.closeSubmenu();
      return;
    }
    this.submenuOpen.set(menuItem.action);
    window.setTimeout(() => {
      this.univerHost.nativeElement.parentElement
        ?.querySelector<HTMLElement>(`[data-excel-submenu-action="${menuItem.action}"]:not(:disabled)`)
        ?.focus();
    });
  }

  closeSubmenu(): void {
    this.submenuOpen.set(null);
  }

  runContextMenuAction(menuItem: ExcelPreviewMenuItem): void {
    if (menuItem.disabled) return;
    const menuTarget = this.contextMenuTarget;
    this.closeContextMenu();

    const action = menuItem.action;
    if (action === 'copy-display' || action === 'copy-raw' || action === 'copy-formulas' ||
        action === 'copy-tsv' || action === 'copy-address' || action === 'copy-sheet-name' ||
        action === 'copy-column-name' || action === 'copy-row-number') {
      void this.copyPreviewSelection(action);
      return;
    }

    switch (action) {
      case 'find':
        this.openFindDialog();
        break;
      case 'select-data-range':
        this.selectPreviewDataRange();
        break;
      case 'find-value':
        this.findSelectedValue();
        break;
      case 'find-selection':
        if (menuTarget === 'column' || menuTarget === 'row') this.openScopedFind(menuTarget);
        else this.findSelectedValue();
        break;
      case 'open-filter':
        void this.applyPreviewFilter();
        break;
      case 'filter-by-value':
        this.applySelectedValueFilter(false);
        break;
      case 'exclude-value':
        this.applySelectedValueFilter(true);
        break;
      case 'filter-blanks':
        this.applyBlankFilter(true);
        break;
      case 'filter-non-blanks':
        this.applyBlankFilter(false);
        break;
      case 'clear-column-filter':
        this.clearSelectedColumnFilter();
        break;
      case 'align-left':
      case 'align-center':
      case 'align-right':
        this.alignPreviewSelection(action.replace('align-', '') as 'left' | 'center' | 'right');
        break;
      case 'fit-selection':
        this.fitPreviewSelection();
        break;
      case 'zoom-100':
        this.resetPreviewZoom();
        break;
      case 'set-column-width':
        this.openDimensionEditor('column');
        break;
      case 'set-row-height':
        this.openDimensionEditor('row');
        break;
      case 'freeze-selection':
        this.freezePreviewSelection();
        break;
      case 'cancel-freeze':
        this.cancelPreviewFreeze();
        break;
      case 'hide-columns':
        this.hideSelectedColumns();
        break;
      case 'show-all-columns':
        this.showAllPreviewColumns();
        break;
      case 'reset-column-view':
        this.resetPreviewTargetView('column');
        break;
      case 'hide-rows':
        this.hideSelectedRows();
        break;
      case 'show-all-rows':
        this.showAllPreviewRows();
        break;
      case 'reset-row-view':
        this.resetPreviewTargetView('row');
        break;
      case 'toggle-gridlines':
        this.togglePreviewGridlines();
        break;
      case 'previous-sheet':
        this.activateAdjacentSheet(-1);
        break;
      case 'next-sheet':
        this.activateAdjacentSheet(1);
        break;
      case 'sheet-list':
        this.openSheetList();
        break;
      case 'go-to':
        this.toggleGoTo();
        break;
      case 'open-hyperlink':
        this.openSelectedHyperlink();
        break;
      case 'cell-info':
        this.showSelectedCellInfo();
        break;
      case 'selection-info':
        this.showSelectionInfo();
        break;
      case 'reset-view':
        this.resetPreviewView();
        break;
      case 'submenu-layout':
        break;
    }
  }

  private showContextMenu(target: ExcelPreviewContextTarget, x: number, y: number): void {
    const capabilities = this.getContextMenuCapabilities();
    const items = buildExcelPreviewContextMenu(target, capabilities);
    const width = 304;
    const estimatedHeight = Math.min(528, items.length * 33 + 30);
    this.contextMenuReturnFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : this.univerHost.nativeElement;
    this.contextMenuTarget = target;
    this.submenuOpen.set(null);
    this.goToOpen.set(false);
    this.contextMenu.set({
      target,
      items,
      x: Math.max(8, Math.min(x, window.innerWidth - width - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - estimatedHeight - 8)),
    });
    window.setTimeout(() => {
      const menu = this.univerHost.nativeElement.parentElement?.querySelector<HTMLElement>('.excel-context-menu');
      menu?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus();
    });
  }

  private getContextMenuCapabilities() {
    const selection = this.getActivePreviewSelection();
    if (!selection) {
      return {
        hasValue: false,
        hasFormula: false,
        hasHyperlink: false,
        hasFilter: false,
        canFilter: false,
        hasMultipleSheets: false,
        gridlinesHidden: false,
        frozen: false,
      };
    }

    try {
      const activeCell = selection.workbook.getActiveCell() ?? selection.range;
      const activeCoordinates = activeCell.getRange();
      const filter = selection.worksheet.getFilter();
      const dataRange = this.getPreviewUsedRange(selection.worksheet);
      const candidate = getPreviewFilterCandidateRange(selection.range.getRange(), dataRange);
      const freeze = selection.worksheet.getFreeze();
      return {
        hasValue: activeCell.getDisplayValues()[0]?.[0] !== '',
        hasFormula: selection.range.getFormulas().some(row => row.some(Boolean)),
        hasHyperlink: activeCell.getHyperLinks().length > 0,
        hasFilter: !!filter?.getColumnFilterCriteria(activeCoordinates.startColumn),
        canFilter: !!filter || !!candidate,
        hasMultipleSheets: selection.workbook.getSheets().length > 1,
        gridlinesHidden: selection.worksheet.hasHiddenGridLines(),
        frozen: !!(freeze.xSplit || freeze.ySplit),
      };
    } catch {
      return {
        hasValue: false,
        hasFormula: false,
        hasHyperlink: false,
        hasFilter: false,
        canFilter: false,
        hasMultipleSheets: selection.workbook.getSheets().length > 1,
        gridlinesHidden: false,
        frozen: false,
      };
    }
  }

  private async copyPreviewSelection(action: Extract<ExcelPreviewMenuAction,
    'copy-display' | 'copy-raw' | 'copy-formulas' | 'copy-tsv' | 'copy-address' | 'copy-sheet-name' |
    'copy-column-name' | 'copy-row-number'
  >): Promise<void> {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;

    try {
      let text = '';
      if (action === 'copy-sheet-name') {
        text = selection.worksheet.getSheetName();
      } else if (action === 'copy-column-name') {
        text = getExcelColumnLabel((selection.workbook.getActiveCell() ?? selection.range).getRange().startColumn);
      } else if (action === 'copy-row-number') {
        text = String((selection.workbook.getActiveCell() ?? selection.range).getRange().startRow + 1);
      } else if (action === 'copy-address') {
        const sheetName = selection.worksheet.getSheetName().replace(/'/g, "''");
        text = `'${sheetName}'!${selection.range.getA1Notation()}`;
      } else if (action === 'copy-raw') {
        text = serializeExcelPreviewGrid(selection.range.getValues());
      } else if (action === 'copy-formulas') {
        text = serializeExcelPreviewGrid(selection.range.getFormulas());
      } else {
        text = serializeExcelPreviewGrid(selection.range.getDisplayValues());
      }

      await this.writeClipboardText(text);
      this.toast.show('Đã sao chép dữ liệu từ bản xem trước.', 'success');
    } catch {
      this.toast.show('Trình duyệt không cho phép sao chép nội dung này.', 'warning');
    }
  }

  private async writeClipboardText(text: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Clipboard unavailable');
  }

  private findSelectedValue(): void {
    const selection = this.getActivePreviewSelection();
    const activeCell = selection?.workbook.getActiveCell() ?? selection?.range;
    const value = activeCell?.getDisplayValues()[0]?.[0] ?? '';
    this.openFindDialog(value);
  }

  private applySelectedValueFilter(exclude: boolean): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;

      let filter = selection.worksheet.getFilter();
      let createdFilter = false;
      if (!filter) {
        const candidate = getPreviewFilterCandidateRange(
          selection.range.getRange(),
          this.getPreviewUsedRange(selection.worksheet),
        );
        if (!candidate) return;
        selection.worksheet.getRange(
          candidate.startRow,
          candidate.startColumn,
          candidate.endRow - candidate.startRow + 1,
          candidate.endColumn - candidate.startColumn + 1,
        ).createFilter();
        filter = selection.worksheet.getFilter();
        createdFilter = true;
      }
      if (!filter) return;

      const filterRange = filter.getRange().getRange();
      const activeCell = selection.workbook.getActiveCell() ?? selection.range;
      const activeCoordinates = activeCell.getRange();
      const column = Math.max(
        filterRange.startColumn,
        Math.min(filterRange.endColumn, activeCoordinates.startColumn),
      );
      const rawValue = activeCell.getValues()[0]?.[0];
      const displayValue = activeCell.getDisplayValues()[0]?.[0] ?? '';
      const value = rawValue == null || typeof rawValue === 'object' ? displayValue : rawValue;
      const colId = column - filterRange.startColumn;
      const previousCriteria = filter.getColumnFilterCriteria(column);
      if (exclude) {
        filter.setColumnFilterCriteria(column, buildExcelPreviewFilterCriteria(
          'exclude', colId, value, this.univerAPI?.Enum.CustomFilterOperator.NOT_EQUALS,
        ));
      } else {
        filter.setColumnFilterCriteria(column, buildExcelPreviewFilterCriteria(
          'include', colId, displayValue, this.univerAPI?.Enum.CustomFilterOperator.NOT_EQUALS,
        ));
      }
      this.syncPreviewFilterSheetNames(selection.workbook);
      const details = this.getFilterViewDetails(selection.worksheet);
      this.markTemporaryViewChange(
        exclude ? `Đang ẩn “${displayValue}”` : `Chỉ hiện “${displayValue}”`,
        'filter',
        details,
        () => {
          const currentFilter = selection.worksheet.getFilter();
          if (createdFilter) currentFilter?.remove();
          else if (this.autoFilterTargets().some(target => target.sheetName === selection.worksheet.getSheetName())) {
            currentFilter?.removeFilterCriteria();
          } else if (previousCriteria) currentFilter?.setColumnFilterCriteria(column, previousCriteria);
          else currentFilter?.removeColumnFilterCriteria(column);
        },
      );
    });
  }

  private applyBlankFilter(showBlanks: boolean): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;

      let filter = selection.worksheet.getFilter();
      let createdFilter = false;
      if (!filter) {
        const candidate = getPreviewFilterCandidateRange(
          selection.range.getRange(),
          this.getPreviewUsedRange(selection.worksheet),
        );
        if (!candidate) return;
        selection.worksheet.getRange(
          candidate.startRow,
          candidate.startColumn,
          candidate.endRow - candidate.startRow + 1,
          candidate.endColumn - candidate.startColumn + 1,
        ).createFilter();
        filter = selection.worksheet.getFilter();
        createdFilter = true;
      }
      if (!filter) return;

      const filterRange = filter.getRange().getRange();
      const activeCell = selection.workbook.getActiveCell() ?? selection.range;
      const column = Math.max(
        filterRange.startColumn,
        Math.min(filterRange.endColumn, activeCell.getRange().startColumn),
      );
      const colId = column - filterRange.startColumn;
      const previousCriteria = filter.getColumnFilterCriteria(column);
      filter.setColumnFilterCriteria(column, buildExcelPreviewFilterCriteria(
        showBlanks ? 'blanks' : 'non-blanks',
        colId,
        '',
        this.univerAPI?.Enum.CustomFilterOperator.NOT_EQUALS,
      ));
      this.syncPreviewFilterSheetNames(selection.workbook);
      this.markTemporaryViewChange(
        showBlanks ? 'Chỉ hiện ô trống' : 'Chỉ hiện ô không trống',
        'filter',
        this.getFilterViewDetails(selection.worksheet),
        () => {
          const currentFilter = selection.worksheet.getFilter();
          if (createdFilter) currentFilter?.remove();
          else if (this.autoFilterTargets().some(target => target.sheetName === selection.worksheet.getSheetName())) {
            currentFilter?.removeFilterCriteria();
          } else if (previousCriteria) currentFilter?.setColumnFilterCriteria(column, previousCriteria);
          else currentFilter?.removeColumnFilterCriteria(column);
        },
      );
    });
  }

  private clearSelectedColumnFilter(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      const filter = selection?.worksheet.getFilter();
      if (!selection || !filter) return;
      const column = (selection.workbook.getActiveCell() ?? selection.range).getRange().startColumn;
      const previousCriteria = filter.getColumnFilterCriteria(column);
      filter.removeColumnFilterCriteria(column);
      this.syncPreviewFilterSheetNames(selection.workbook);
      if (!filter.getFilteredOutRows().length) {
        const sheetName = selection.worksheet.getSheetName();
        if (this.autoFilterTargets().some(target => target.sheetName === sheetName)) {
          this.removeTemporaryViewChange('filter', sheetName);
        } else {
          filter.remove();
          this.removeTemporaryViewChange('filter', sheetName);
        }
      } else {
        this.markTemporaryViewChange(
          'Đã xóa lọc ở cột đang chọn',
          'filter',
          this.getFilterViewDetails(selection.worksheet),
          () => selection.worksheet.getFilter()?.setColumnFilterCriteria(column, previousCriteria ?? null),
        );
      }
    });
  }

  private alignPreviewSelection(alignment: 'left' | 'center' | 'right'): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const previous = selection.range.getCellDataGrid();
      selection.range.setHorizontalAlignment(alignment === 'right' ? 'normal' : alignment);
      const labels = { left: 'căn trái', center: 'căn giữa', right: 'căn phải' };
      this.markTemporaryViewChange(
        `Đã ${labels[alignment]} vùng chọn`,
        'format',
        { range: selection.range.getA1Notation(), summary: `Căn ${alignment}` },
        () => this.restoreCellContent(selection.range, previous),
      );
    });
  }

  private autofitSelectedColumns(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const range = selection.range.getRange();
      const widths = Array.from({ length: range.endColumn - range.startColumn + 1 }, (_, offset) =>
        selection.worksheet.getColumnWidth(range.startColumn + offset)
      );
      selection.worksheet.autoResizeColumns(
        range.startColumn,
        Math.max(1, range.endColumn - range.startColumn + 1),
      );
      this.markTemporaryViewChange(
        'Đã tự chỉnh độ rộng cột',
        'dimensions',
        { axis: 'column', index: range.startColumn, count: widths.length, range: selection.range.getA1Notation(), summary: `${widths.length} cột` },
        () => widths.forEach((width, offset) => selection.worksheet.setColumnWidth(range.startColumn + offset, width)),
      );
    });
  }

  private autofitSelectedRows(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const range = selection.range.getRange();
      const heights = Array.from({ length: range.endRow - range.startRow + 1 }, (_, offset) =>
        selection.worksheet.getRowHeight(range.startRow + offset)
      );
      selection.worksheet.autoResizeRows(
        range.startRow,
        Math.max(1, range.endRow - range.startRow + 1),
      );
      this.markTemporaryViewChange(
        'Đã tự chỉnh chiều cao hàng',
        'dimensions',
        { axis: 'row', index: range.startRow, count: heights.length, range: selection.range.getA1Notation(), summary: `${heights.length} hàng` },
        () => heights.forEach((height, offset) => selection.worksheet.setRowHeight(range.startRow + offset, height)),
      );
    });
  }

  private openDimensionEditor(kind: 'column' | 'row'): void {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;
    const activeRange = (selection.workbook.getActiveCell() ?? selection.range).getRange();
    const value = kind === 'column'
      ? selection.worksheet.getColumnWidth(activeRange.startColumn)
      : selection.worksheet.getRowHeight(activeRange.startRow);
    this.dimensionEditor.set({ kind, value: Math.round(value) });
    window.setTimeout(() => {
      const input = this.univerHost.nativeElement.parentElement?.querySelector<HTMLInputElement>('.excel-dimension-input');
      input?.focus();
      input?.select();
    });
  }

  closeDimensionEditor(): void {
    this.dimensionEditor.set(null);
  }

  updateDimensionValue(event: Event): void {
    const editor = this.dimensionEditor();
    if (!editor) return;
    const value = Math.max(12, Math.min(500, Number((event.target as HTMLInputElement).value) || 12));
    this.dimensionEditor.set({ ...editor, value });
  }

  applyDimensionEditor(): void {
    const editor = this.dimensionEditor();
    if (!editor) return;
    this.closeDimensionEditor();
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const range = selection.range.getRange();
      if (editor.kind === 'column') {
        const previous = Array.from({ length: range.endColumn - range.startColumn + 1 }, (_, offset) =>
          selection.worksheet.getColumnWidth(range.startColumn + offset)
        );
        selection.worksheet.setColumnWidths(
          range.startColumn,
          range.endColumn - range.startColumn + 1,
          editor.value,
        );
        this.markTemporaryViewChange(
          `Độ rộng cột ${Math.round(editor.value)} px`,
          'dimensions',
          { axis: 'column', index: range.startColumn, count: previous.length, range: selection.range.getA1Notation(), summary: `${previous.length} cột · ${Math.round(editor.value)} px` },
          () => previous.forEach((width, offset) => selection.worksheet.setColumnWidth(range.startColumn + offset, width)),
        );
      } else {
        const previous = Array.from({ length: range.endRow - range.startRow + 1 }, (_, offset) =>
          selection.worksheet.getRowHeight(range.startRow + offset)
        );
        selection.worksheet.setRowHeights(
          range.startRow,
          range.endRow - range.startRow + 1,
          editor.value,
        );
        this.markTemporaryViewChange(
          `Chiều cao hàng ${Math.round(editor.value)} px`,
          'dimensions',
          { axis: 'row', index: range.startRow, count: previous.length, range: selection.range.getA1Notation(), summary: `${previous.length} hàng · ${Math.round(editor.value)} px` },
          () => previous.forEach((height, offset) => selection.worksheet.setRowHeight(range.startRow + offset, height)),
        );
      }
    });
  }

  private freezePreviewSelection(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const range = (selection.workbook.getActiveCell() ?? selection.range).getRange();
      const previous = selection.worksheet.getFreeze();
      selection.worksheet.setFreeze({
        xSplit: range.startColumn,
        ySplit: range.startRow,
        startColumn: range.startColumn,
        startRow: range.startRow,
      });
      this.markTemporaryViewChange(
        `Đã cố định tới ${selection.worksheet.getRange(range.startRow, range.startColumn).getA1Notation()}`,
        'freeze',
        { split: `${range.startColumn} cột · ${range.startRow} hàng` },
        () => this.restoreFreeze(selection.worksheet, previous),
      );
    });
  }

  private cancelPreviewFreeze(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const previous = selection.worksheet.getFreeze();
      selection.worksheet.cancelFreeze();
      this.markTemporaryViewChange(
        'Đã bỏ cố định hàng/cột',
        'freeze',
        { split: 'Không cố định' },
        () => this.restoreFreeze(selection.worksheet, previous),
      );
    });
  }

  private hideSelectedColumns(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const range = selection.range.getRange();
      const widths = Array.from({ length: range.endColumn - range.startColumn + 1 }, (_, offset) =>
        selection.worksheet.getColumnWidth(range.startColumn + offset)
      );
      selection.worksheet.hideColumns(range.startColumn, range.endColumn - range.startColumn + 1);
      this.markTemporaryViewChange(
        'Có cột đang được ẩn',
        'hidden',
        { axis: 'column', index: range.startColumn, count: widths.length, range: selection.range.getA1Notation(), summary: `${widths.length} cột` },
        () => this.restoreColumnWidths(selection.worksheet, range.startColumn, widths),
      );
    });
  }

  private showAllPreviewColumns(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const bounds = this.previewBoundsBySheetName.get(selection.worksheet.getSheetName());
      const count = Math.max(1, bounds?.columns ?? 1);
      const widths = Array.from({ length: count }, (_, index) => selection.worksheet.getColumnWidth(index));
      selection.worksheet.showColumns(0, count);
      this.markTemporaryViewChange(
        'Đã hiện lại tất cả cột',
        'hidden',
        { axis: 'column', index: 0, count, summary: `${count} cột` },
        () => this.restoreColumnWidths(selection.worksheet, 0, widths),
      );
    });
  }

  private hideSelectedRows(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const range = selection.range.getRange();
      const heights = Array.from({ length: range.endRow - range.startRow + 1 }, (_, offset) =>
        selection.worksheet.getRowHeight(range.startRow + offset)
      );
      selection.worksheet.hideRows(range.startRow, range.endRow - range.startRow + 1);
      this.markTemporaryViewChange(
        'Có hàng đang được ẩn',
        'hidden',
        { axis: 'row', index: range.startRow, count: heights.length, range: selection.range.getA1Notation(), summary: `${heights.length} hàng` },
        () => this.restoreRowHeights(selection.worksheet, range.startRow, heights),
      );
    });
  }

  private showAllPreviewRows(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const bounds = this.previewBoundsBySheetName.get(selection.worksheet.getSheetName());
      const count = Math.max(1, bounds?.rows ?? 1);
      const heights = Array.from({ length: count }, (_, index) => selection.worksheet.getRowHeight(index));
      selection.worksheet.showRows(0, count);
      this.markTemporaryViewChange(
        'Đã hiện lại tất cả hàng',
        'hidden',
        { axis: 'row', index: 0, count, summary: `${count} hàng` },
        () => this.restoreRowHeights(selection.worksheet, 0, heights),
      );
    });
  }

  private restoreFreeze(
    worksheet: ReturnType<UniverWorkbook['getActiveSheet']>,
    freeze: { xSplit?: number; ySplit?: number } | null | undefined,
  ): void {
    if (freeze && (freeze.xSplit || freeze.ySplit)) {
      worksheet.setFreeze({
        xSplit: freeze.xSplit ?? 0,
        ySplit: freeze.ySplit ?? 0,
        startColumn: freeze.xSplit ?? 0,
        startRow: freeze.ySplit ?? 0,
      });
    } else {
      worksheet.cancelFreeze();
    }
  }

  private restoreColumnWidths(
    worksheet: ReturnType<UniverWorkbook['getActiveSheet']>,
    start: number,
    widths: number[],
  ): void {
    widths.forEach((width, offset) => {
      const column = start + offset;
      if (width <= 1) {
        worksheet.hideColumns(column, 1);
      } else {
        worksheet.showColumns(column, 1);
        worksheet.setColumnWidth(column, width);
      }
    });
  }

  private restoreRowHeights(
    worksheet: ReturnType<UniverWorkbook['getActiveSheet']>,
    start: number,
    heights: number[],
  ): void {
    heights.forEach((height, offset) => {
      const row = start + offset;
      if (height <= 1) {
        worksheet.hideRows(row, 1);
      } else {
        worksheet.showRows(row, 1);
        worksheet.setRowHeight(row, height);
      }
    });
  }

  private resetPreviewTargetView(axis: 'column' | 'row'): void {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;
    const range = selection.range.getRange();
    const targetStart = axis === 'column' ? range.startColumn : range.startRow;
    const targetEnd = axis === 'column' ? range.endColumn : range.endRow;
    const changes = this.temporaryViewChanges().filter(change => {
      if (change.sheetName !== selection.worksheet.getSheetName() || change.details?.axis !== axis) return false;
      const start = change.details.index ?? -1;
      const end = start + Math.max(1, change.details.count ?? 1) - 1;
      return start <= targetEnd && end >= targetStart;
    });
    if (!changes.length) return;
    void this.runPreviewTool(() => {
      changes.forEach(change => {
        this.viewChangeUndo.get(change.id)?.();
        this.removeTemporaryViewChangeById(change.id);
      });
      this.syncPreviewFilterSheetNames(selection.workbook);
    });
  }

  private togglePreviewGridlines(): void {
    void this.runPreviewTool(() => {
      const selection = this.getActivePreviewSelection();
      if (!selection) return;
      const hidden = !selection.worksheet.hasHiddenGridLines();
      const previous = selection.worksheet.hasHiddenGridLines();
      selection.worksheet.setHiddenGridlines(hidden);
      if (hidden) this.markTemporaryViewChange('Đã ẩn đường lưới', 'gridlines', undefined, () => selection.worksheet.setHiddenGridlines(previous));
      else this.removeTemporaryViewChange('gridlines', selection.worksheet.getSheetName());
    });
  }

  private activateAdjacentSheet(direction: -1 | 1): void {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;
    const sheets = selection.workbook.getSheets();
    const currentIndex = sheets.findIndex(sheet => sheet.getSheetId() === selection.worksheet.getSheetId());
    if (currentIndex < 0 || sheets.length < 2) return;
    const nextIndex = (currentIndex + direction + sheets.length) % sheets.length;
    selection.workbook.setActiveSheet(sheets[nextIndex]);
    this.activePreviewSheetName.set(sheets[nextIndex].getSheetName());
  }

  private openSheetList(): void {
    const workbook = this.univerAPI?.getActiveWorkbook();
    if (!workbook) return;
    this.previewSheetNames.set(workbook.getSheets().map(sheet => sheet.getSheetName()));
    this.activePreviewSheetName.set(workbook.getActiveSheet().getSheetName());
    this.sheetListOpen.set(true);
    window.setTimeout(() => {
      const list = this.univerHost.nativeElement.parentElement?.querySelector<HTMLElement>('.excel-sheet-list');
      list?.querySelector<HTMLButtonElement>('[role="option"][aria-selected="true"]')?.focus();
    });
  }

  closeSheetList(): void {
    this.sheetListOpen.set(false);
  }

  activateSheetByName(sheetName: string): void {
    const workbook = this.univerAPI?.getActiveWorkbook();
    const worksheet = workbook?.getSheetByName(sheetName);
    if (!workbook || !worksheet) return;
    workbook.setActiveSheet(worksheet);
    this.activePreviewSheetName.set(sheetName);
    this.closeSheetList();
  }

  private openSelectedHyperlink(): void {
    const selection = this.getActivePreviewSelection();
    const activeCell = selection?.workbook.getActiveCell() ?? selection?.range;
    const hyperlink = activeCell?.getHyperLinks()[0];
    if (!selection || !hyperlink) return;

    if (hyperlink.url.startsWith('#')) {
      const target = parseExcelGoToTarget(hyperlink.url.slice(1));
      const worksheet = target?.sheetName
        ? selection.workbook.getSheetByName(target.sheetName)
        : selection.worksheet;
      if (target && worksheet) {
        try {
          const range = worksheet.getRange(target.address);
          selection.workbook.setActiveSheet(worksheet);
          selection.workbook.setActiveRange(range);
          const coordinates = range.getRange();
          worksheet.scrollToCell(coordinates.startRow, coordinates.startColumn, 180);
          this.activePreviewSheetName.set(worksheet.getSheetName());
          return;
        } catch {
          this.toast.show('Liên kết nội bộ không trỏ tới vùng hợp lệ.', 'warning');
          return;
        }
      }
      this.toast.show('Liên kết nội bộ không hợp lệ.', 'warning');
      return;
    }

    if (isSafeExcelHyperlink(hyperlink.url)) {
      openInNewTab(hyperlink.url);
      return;
    }
    this.toast.show('Liên kết không hợp lệ nên không được mở.', 'warning');
  }

  private showSelectedCellInfo(): void {
    const selection = this.getActivePreviewSelection();
    const activeCell = selection?.workbook.getActiveCell() ?? selection?.range;
    if (!selection || !activeCell) return;
    const raw = activeCell.getValues()[0]?.[0];
    const coordinates = activeCell.getRange();
    const mergedRange = selection.worksheet.getCellMergeData(
      coordinates.startRow,
      coordinates.startColumn,
    );
    this.selectionInfo.set(null);
    this.cellInfo.set({
      sheetName: selection.worksheet.getSheetName(),
      address: activeCell.getA1Notation(),
      displayValue: activeCell.getDisplayValues()[0]?.[0] ?? '',
      rawValue: raw == null ? '' : typeof raw === 'object' ? JSON.stringify(raw) : String(raw),
      formula: activeCell.getFormulas()[0]?.[0] ?? '',
      hyperlink: activeCell.getHyperLinks()[0]?.url ?? '',
      numberFormat: activeCell.getNumberFormat(),
      alignment: activeCell.getHorizontalAlignment(),
      wrapText: activeCell.getWrapStrategy() === WrapStrategy.WRAP ? 'Có' : 'Không',
      note: activeCell.getNote()?.note ?? '',
      mergedRange: mergedRange?.getA1Notation() ?? '',
    });
  }

  private showSelectionInfo(): void {
    const selection = this.getActivePreviewSelection();
    if (!selection) return;

    try {
      const coordinates = selection.range.getRange();
      const columnCount = coordinates.endColumn - coordinates.startColumn + 1;
      const totalRowCount = coordinates.endRow - coordinates.startRow + 1;
      const sampledRowCount = Math.min(totalRowCount, Math.max(1, Math.floor(50_000 / columnCount)));
      const values = selection.worksheet.getRange(
        coordinates.startRow,
        coordinates.startColumn,
        sampledRowCount,
        columnCount,
      ).getValues();
      let populatedCells = 0;
      const numericValues: number[] = [];
      for (const row of values) {
        for (const value of row) {
          if (value !== '' && value != null) populatedCells++;
          if (typeof value === 'number' && Number.isFinite(value)) numericValues.push(value);
        }
      }
      const total = numericValues.length ? numericValues.reduce((sum, value) => sum + value, 0) : undefined;
      this.cellInfo.set(null);
      this.selectionInfo.set({
        sheetName: selection.worksheet.getSheetName(),
        address: selection.range.getA1Notation(),
        populatedCells,
        numericCells: numericValues.length,
        total,
        average: total == null ? undefined : total / numericValues.length,
        minimum: numericValues.length ? Math.min(...numericValues) : undefined,
        maximum: numericValues.length ? Math.max(...numericValues) : undefined,
        truncated: sampledRowCount < totalRowCount,
      });
    } catch {
      this.toast.show('Không thể tính thống kê cho vùng đang chọn.', 'warning');
    }
  }

  formatSelectionMetric(value: number | undefined): string {
    if (value == null || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 6 }).format(value);
  }

  private restoreCellContent(range: { setValues: (value: any) => unknown }, grid: unknown[][]): void {
    const content = grid.map(row => row.map(cell =>
      cell && typeof cell === 'object' ? structuredClone(cell) : null
    ));
    range.setValues(content as any);
  }

  private markTemporaryViewChange(
    label: string,
    kind = this.inferViewChangeKind(label),
    details?: ExcelPreviewViewChangeDetails,
    clear?: () => void,
  ): void {
    const sheetName = this.univerAPI?.getActiveWorkbook()?.getActiveSheet()?.getSheetName() ?? '';
    const id = `${sheetName}:${kind}:${details?.axis ?? ''}:${details?.index ?? ''}:${details?.range ?? ''}`;
    this.temporaryViewChanges.update(changes =>
      upsertExcelPreviewViewChange(changes, { id, kind, sheetName, label, details })
    );
    if (clear) this.viewChangeUndo.set(id, clear);
  }

  private removeTemporaryViewChange(kind: ExcelPreviewViewChangeKind, sheetName: string): void {
    const removed = this.temporaryViewChanges().filter(change => change.kind === kind && change.sheetName === sheetName);
    removed.forEach(change => this.viewChangeUndo.delete(change.id));
    this.temporaryViewChanges.update(changes => removeExcelPreviewViewChange(changes, kind, sheetName));
    if (!this.temporaryViewChanges().length) this.viewStateOpen.set(false);
  }

  private removeTemporaryViewChangeById(id: string): void {
    this.viewChangeUndo.delete(id);
    this.temporaryViewChanges.update(changes => changes.filter(change => change.id !== id));
    if (!this.temporaryViewChanges().length) this.viewStateOpen.set(false);
  }

  viewChangeSummary(change: ExcelPreviewViewChange): string {
    const details = change.details;
    if (!details) return '';
    if (change.kind === 'filter') {
      return [details.range, details.criteriaCount ? `${details.criteriaCount} điều kiện` : '', details.criteria]
        .filter(Boolean).join(' · ');
    }
    if (change.kind === 'sort') return [details.column, details.direction === 'ascending' ? 'tăng dần' : 'giảm dần'].filter(Boolean).join(' · ');
    if (change.kind === 'hidden') return details.summary ?? `${details.count ?? 0} ${details.axis === 'column' ? 'cột' : 'hàng'}`;
    if (change.kind === 'freeze') return details.split ?? '';
    return details.summary ?? details.range ?? '';
  }

  private inferViewChangeKind(label: string): ExcelPreviewViewChangeKind {
    const normalized = label.toLocaleLowerCase('vi-VN');
    if (normalized.includes('zoom')) return 'zoom';
    if (normalized.includes('sắp xếp')) return 'sort';
    if (normalized.includes('lọc') || normalized.includes('chỉ hiện ô') || normalized.includes('đang ẩn “')) {
      return 'filter';
    }
    if (normalized.includes('cố định')) return 'freeze';
    if (normalized.includes('đường lưới')) return 'gridlines';
    if (normalized.includes('được ẩn') || normalized.includes('hiện lại tất cả')) return 'hidden';
    if (normalized.includes('độ rộng') || normalized.includes('chiều cao') || normalized.includes('co giãn')) {
      return 'dimensions';
    }
    return 'format';
  }

  private getActivePreviewSelection() {
    const workbook = this.univerAPI?.getActiveWorkbook();
    const worksheet = workbook?.getActiveSheet();
    if (!workbook || !worksheet) return undefined;

    return {
      workbook,
      worksheet,
      range: workbook.getActiveRange() ?? worksheet.getRange(0, 0, 1, 1),
    };
  }

  private syncPreviewFilterSheetNames(workbook: UniverWorkbook): void {
    const sheetNames: string[] = [];
    const summaries: ExcelPreviewFilterSummary[] = [];
    for (const worksheet of workbook.getSheets()) {
      try {
        const filter = worksheet.getFilter();
        if (!filter) continue;
        sheetNames.push(worksheet.getSheetName());
        summaries.push({ sheetName: worksheet.getSheetName(), ...this.getFilterViewDetails(worksheet) });
      } catch {
        // Optional filter facade state must not affect workbook rendering.
      }
    }
    this.previewFilterSheetNames.set(sheetNames);
    this.previewFilterSummaries.set(summaries);
  }

  private getFilterViewDetails(worksheet: ReturnType<UniverWorkbook['getActiveSheet']>): Omit<ExcelPreviewFilterSummary, 'sheetName'> {
    const filter = worksheet.getFilter();
    if (!filter) return { range: '', criteriaCount: 0, criteria: '' };
    const range = filter.getRange();
    const coordinates = range.getRange();
    const criteria: string[] = [];
    for (let column = coordinates.startColumn; column <= coordinates.endColumn; column++) {
      const current = filter.getColumnFilterCriteria(column);
      if (!current) continue;
      const label = getExcelColumnLabel(column);
      const values = current.filters?.filters?.join(' | ');
      if (current.filters?.blank) criteria.push(`${label}: trống`);
      else if (values) criteria.push(`${label}: ${values}`);
      else if (current.customFilters?.customFilters?.length) {
        criteria.push(`${label}: ${current.customFilters.customFilters.map(item => `${item.operator ?? '='} ${item.val}`).join(' và ')}`);
      } else criteria.push(label);
    }
    return {
      range: range.getA1Notation(),
      criteriaCount: criteria.length,
      criteria: criteria.join('; '),
    };
  }

  private async runPreviewTool(action: () => void): Promise<void> {
    const workbook = this.univerAPI?.getActiveWorkbook();
    if (!workbook) return;

    try {
      // Formatting, autofit and sorting are explicitly allowed as temporary
      // presentation actions. The DOM guard still blocks cell-value editing.
      workbook.setEditable(true);
      try {
        await workbook.getWorkbookPermission().setEditable();
      } catch {
        // The facade permission is optional; the action may still be allowed.
      }
      for (const worksheet of workbook.getSheets()) {
        try {
          await worksheet.getWorksheetPermission().setEditable();
        } catch {
          // The DOM guard remains the editing boundary.
        }
      }
      action();
    } catch {
      // A view utility must never make the workbook fail or disappear.
    } finally {
      workbook.setEditable(false);
      try {
        await workbook.getWorkbookPermission().setReadOnly();
      } catch {
        // Keep the workbook visible if this optional permission facade fails.
      }
      for (const worksheet of workbook.getSheets()) {
        try {
          await worksheet.getWorksheetPermission().setReadOnly();
        } catch {
          // Keep the DOM guard active even when permission cleanup is partial.
        }
      }
    }
  }

  private updateAutoFilterTargets(
    metadata: ExcelWorkbookMetadata,
    snapshotSheets: Parameters<UniverBundle['univerAPI']['createWorkbook']>[0]['sheets'],
  ): void {
    const boundsByName = new Map<string, { rows: number; columns: number }>();
    this.previewBoundsBySheetName.clear();
    this.previewUsedRangeBySheetName.clear();
    for (const snapshotSheet of Object.values(snapshotSheets ?? {})) {
      if (!snapshotSheet?.name) continue;
      const bounds = {
        rows: snapshotSheet.rowCount || 0,
        columns: snapshotSheet.columnCount || 0,
      };
      boundsByName.set(snapshotSheet.name, bounds);
      this.previewBoundsBySheetName.set(snapshotSheet.name, bounds);
      const usedRange = getExcelPreviewUsedRange(snapshotSheet.cellData);
      if (usedRange) this.previewUsedRangeBySheetName.set(snapshotSheet.name, usedRange);
    }

    const sheetNames: string[] = [];
    const targets: ExcelViewAutoFilterTarget[] = [];
    for (const sheetMetadata of metadata.sheets) {
      if (!sheetMetadata.autoFilter) continue;
      sheetNames.push(sheetMetadata.name);
      const bounds = boundsByName.get(sheetMetadata.name);
      const range = bounds
        ? getApplicableExcelAutoFilterRange(sheetMetadata.autoFilter, bounds)
        : undefined;
      if (range) targets.push({ sheetName: sheetMetadata.name, range });
    }

    this.autoFilterSheetNames.set(sheetNames);
    this.autoFilterTargets.set(targets);
  }

  private async resetWorkbookFromSource(): Promise<void> {
    const univerAPI = this.univerAPI;
    const sourceSnapshot = this.sourceSnapshot;
    const sourceMetadata = this.sourceMetadata;
    if (!univerAPI || !sourceSnapshot || !sourceMetadata) {
      this.toast.show('Chưa có snapshot nguồn để đặt lại cách xem.', 'warning');
      return;
    }

    const activeSheetName = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getSheetName();
    this.loading.set(true);
    this.temporaryViewChanges.set([]);
    this.viewChangeUndo.clear();
    this.viewStateOpen.set(false);
    this.previewFilterSheetNames.set([]);
    this.previewFilterSummaries.set([]);
    this.selectedDataRangeLabel.set('');
    this.wrapTextEnabled.set(false);
    this.dimensionEditor.set(null);
    this.sheetListOpen.set(false);
    this.selectionInfo.set(null);

    try {
      this.removeUniverEvents?.();
      const activeWorkbook = univerAPI.getActiveWorkbook();
      const activeUnitId = activeWorkbook?.getId();
      if (activeUnitId) univerAPI.disposeUnit(activeUnitId);
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      const snapshot = structuredClone(sourceSnapshot);
      const previewWorkbook = univerAPI.createWorkbook(snapshot);
      try {
        await this.applyPreservedMetadata(previewWorkbook, sourceMetadata, snapshot.sheets);
      } catch {
        // Reset must preserve visible cell content even if one metadata item fails again.
      }
      await this.applyInitialSmartLayout(previewWorkbook, this.loadToken);
      this.syncPreviewFilterSheetNames(previewWorkbook);
      this.installPreviewEvents(previewWorkbook);
      await this.lockPreviewWorkbook(previewWorkbook);

      const activeSheet = activeSheetName ? previewWorkbook.getSheetByName(activeSheetName) : undefined;
      if (activeSheet) previewWorkbook.setActiveSheet(activeSheet);
      this.previewSheetNames.set(previewWorkbook.getSheets().map(sheet => sheet.getSheetName()));
      this.activePreviewSheetName.set((activeSheet ?? previewWorkbook.getActiveSheet()).getSheetName());
      univerAPI.toggleDarkMode(this.state.darkMode());
      this.loading.set(false);
    } catch {
      this.loading.set(false);
      this.toast.show('Không thể đặt lại cách xem. Hãy đóng và mở lại file.', 'warning');
    }
  }

  private async lockPreviewWorkbook(previewWorkbook: UniverWorkbook): Promise<void> {
    // Keep both guards: the facade flag closes the editor surface while the
    // permission layer rejects keyboard input, paste, and edit commands.
    previewWorkbook.setEditable(false);
    try {
      await previewWorkbook.getWorkbookPermission().setReadOnly();
    } catch {
      // The DOM guard remains the final boundary when a permission facade is unavailable.
    }
    for (const worksheet of previewWorkbook.getSheets()) {
      try {
        await worksheet.getWorksheetPermission().setReadOnly();
      } catch {
        // Keep the workbook visible and the DOM guard active on partial permission support.
      }
    }
  }

  private getPreviewUsedRange(
    worksheet: ReturnType<UniverWorkbook['getActiveSheet']>,
  ): ExcelRangeMetadata {
    return this.previewUsedRangeBySheetName.get(worksheet.getSheetName()) ?? {
      startRow: 0,
      startColumn: 0,
      endRow: 0,
      endColumn: 0,
    };
  }

  private async waitForSmartLayoutFrames(
    expectedLoadToken: number,
    frameCount = 2,
  ): Promise<boolean> {
    for (let frame = 0; frame < frameCount; frame++) {
      const stillCurrent = await new Promise<boolean>(resolve => {
        requestAnimationFrame(() => resolve(expectedLoadToken === this.loadToken));
      });
      if (!stillCurrent) return false;
    }
    return expectedLoadToken === this.loadToken;
  }

  private async applySmartRowAutoHeight(
    worksheet: ReturnType<UniverWorkbook['getActiveSheet']>,
    dataRange: ExcelRangeMetadata,
    expectedLoadToken: number,
  ): Promise<boolean> {
    if (expectedLoadToken !== this.loadToken) return false;

    const rowCount = Math.max(1, dataRange.endRow - dataRange.startRow + 1);

    // Univer measures wrapped row height from the render skeleton. Column width
    // and wrap commands update the model synchronously, but the skeleton can
    // still describe the previous layout until the canvas is recalculated.
    // Refresh first, then use Univer's official row auto-height command via the
    // facade so both the auto-height flag and measured height are kept in sync.
    worksheet.refreshCanvas();
    if (!(await this.waitForSmartLayoutFrames(expectedLoadToken))) return false;

    worksheet.autoResizeRows(dataRange.startRow, rowCount);
    worksheet.refreshCanvas();
    if (!(await this.waitForSmartLayoutFrames(expectedLoadToken))) return false;

    // A second pass is intentional: the first pass can change row geometry,
    // which invalidates text layout for cells whose content spans several lines.
    worksheet.autoResizeRows(dataRange.startRow, rowCount);
    worksheet.refreshCanvas();
    return expectedLoadToken === this.loadToken;
  }

  private async applySmartColumnAutoWidth(
    worksheet: ReturnType<UniverWorkbook['getActiveSheet']>,
    dataRange: ExcelRangeMetadata,
    expectedLoadToken: number,
  ): Promise<boolean> {
    if (expectedLoadToken !== this.loadToken) return false;

    const columnCount = Math.max(1, dataRange.endColumn - dataRange.startColumn + 1);

    // Column autofit depends on Univer's current render skeleton. A newly
    // activated sheet can exist in the workbook model before that skeleton is
    // ready, in which case the facade command quietly becomes a no-op.
    worksheet.refreshCanvas();
    if (!(await this.waitForSmartLayoutFrames(expectedLoadToken))) return false;

    worksheet.autoResizeColumns(dataRange.startColumn, columnCount);
    worksheet.refreshCanvas();
    return this.waitForSmartLayoutFrames(expectedLoadToken, 1);
  }

  private async refineRenderedSmartLayout(
    worksheet: ReturnType<UniverWorkbook['getActiveSheet']>,
    expectedLoadToken: number,
  ): Promise<boolean> {
    if (expectedLoadToken !== this.loadToken) return false;

    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const minColumnWidth = mobile ? 72 : 80;
    const maxColumnWidth = mobile ? 180 : 260;
    const minRowHeight = mobile ? 24 : 25;
    const maxRowHeight = mobile ? 150 : 180;
    const dataRange = this.getPreviewUsedRange(worksheet);
    const rowCount = Math.max(1, dataRange.endRow - dataRange.startRow + 1);
    const columnCount = Math.max(1, dataRange.endColumn - dataRange.startColumn + 1);
    const usedRange = worksheet.getRange(
      dataRange.startRow,
      dataRange.startColumn,
      rowCount,
      columnCount,
    );
    const smartLayout = calculateExcelPreviewSmartLayout(usedRange.getDisplayValues(), {
      minColumnWidth,
      maxColumnWidth,
      minRowHeight,
      maxRowHeight,
    });

    if (!(await this.applySmartColumnAutoWidth(worksheet, dataRange, expectedLoadToken))) return false;
    smartLayout.columnWidths.forEach((fallbackWidth, offset) => {
      const column = dataRange.startColumn + offset;
      const measuredWidth = worksheet.getColumnWidth(column);
      worksheet.setColumnWidth(
        column,
        Math.max(fallbackWidth, Math.min(maxColumnWidth, measuredWidth)),
      );
    });
    usedRange.setWrapStrategy(WrapStrategy.WRAP);

    if (!(await this.applySmartRowAutoHeight(worksheet, dataRange, expectedLoadToken))) return false;
    smartLayout.rowHeights.forEach((fallbackHeight, offset) => {
      const row = dataRange.startRow + offset;
      const measuredHeight = worksheet.getRowHeight(row);
      worksheet.setRowHeight(
        row,
        Math.max(fallbackHeight, Math.min(maxRowHeight, measuredHeight)),
      );
    });
    worksheet.refreshCanvas();
    return expectedLoadToken === this.loadToken;
  }

  private async applyInitialSmartLayout(
    previewWorkbook: UniverWorkbook,
    expectedLoadToken: number,
  ): Promise<void> {
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const minColumnWidth = mobile ? 72 : 80;
    const maxColumnWidth = mobile ? 180 : 260;
    const originalActiveSheet = previewWorkbook.getActiveSheet();

    for (const worksheet of previewWorkbook.getSheets()) {
      if (expectedLoadToken !== this.loadToken) return;
      try {
        const dataRange = this.getPreviewUsedRange(worksheet);
        const rowCount = Math.max(1, dataRange.endRow - dataRange.startRow + 1);
        const columnCount = Math.max(1, dataRange.endColumn - dataRange.startColumn + 1);
        const usedRange = worksheet.getRange(
          dataRange.startRow,
          dataRange.startColumn,
          rowCount,
          columnCount,
        );
        const displayValues = usedRange.getDisplayValues();
        const smartLayout = calculateExcelPreviewSmartLayout(displayValues, {
          minColumnWidth,
          maxColumnWidth,
          minRowHeight: mobile ? 24 : 25,
          maxRowHeight: mobile ? 150 : 180,
        });

        // Apply a deterministic layout directly to the worksheet model first.
        // Unlike Univer auto-resize, this also works for sheets that are not the
        // currently rendered sheet, so every worksheet receives Smart Fit.
        smartLayout.columnWidths.forEach((width, offset) => {
          worksheet.setColumnWidth(dataRange.startColumn + offset, width);
        });
        usedRange.setWrapStrategy(WrapStrategy.WRAP);
        smartLayout.rowHeights.forEach((height, offset) => {
          worksheet.setRowHeight(dataRange.startRow + offset, height);
        });

      } catch {
        // Smart Fit is presentation-only; one incompatible sheet must not block preview.
      }
    }

    // Univer's native auto-fit commands need a live render skeleton. Refine
    // every sheet while the preview is still editable, before the read-only
    // permission layer is installed. Doing this later from ActiveSheetChanged
    // makes Univer correctly reject the formatting commands and display a
    // permission dialog when the user merely changes sheets.
    for (const worksheet of previewWorkbook.getSheets()) {
      if (expectedLoadToken !== this.loadToken) return;
      previewWorkbook.setActiveSheet(worksheet);
      if (!(await this.waitForSmartLayoutFrames(expectedLoadToken, 1))) return;
      try {
        await this.refineRenderedSmartLayout(worksheet, expectedLoadToken);
      } catch {
        // The deterministic dimensions above remain the safe fallback when a
        // sheet cannot be refined by Univer's render skeleton.
      }
    }

    if (expectedLoadToken === this.loadToken) {
      previewWorkbook.setActiveSheet(originalActiveSheet);
      await this.waitForSmartLayoutFrames(expectedLoadToken, 1);
    }
  }

  private async loadWorkbook(): Promise<void> {
    if (!this.blob || !this.viewReady) return;
    const token = ++this.loadToken;
    this.loading.set(true);
    this.truncatedSheets.set([]);
    this.metadataLimited.set(false);
    this.unsupportedFeatures.set([]);
    this.autoFilterSheetNames.set([]);
    this.autoFilterTargets.set([]);
    this.previewFilterSheetNames.set([]);
    this.previewFilterSummaries.set([]);
    this.selectedDataRangeLabel.set('');
    this.wrapTextEnabled.set(false);
    this.goToOpen.set(false);
    this.goToValue.set('');
    this.goToError.set('');
    this.goToHistory.set([]);
    this.contextMenu.set(null);
    this.cellInfo.set(null);
    this.selectionInfo.set(null);
    this.dimensionEditor.set(null);
    this.sheetListOpen.set(false);
    this.previewSheetNames.set([]);
    this.activePreviewSheetName.set('');
    this.temporaryViewChanges.set([]);
    this.viewStateOpen.set(false);
    this.sourceSnapshot = undefined;
    this.sourceMetadata = undefined;
    this.previewBoundsBySheetName.clear();
    this.previewUsedRangeBySheetName.clear();
    this.viewChangeUndo.clear();
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
      this.updateAutoFilterTargets(metadataResult.metadata, converted.snapshot.sheets);
      if (metadataResult.blockingFeatures.length) {
        const labels = metadataResult.blockingFeatures.map(summary =>
          EXCEL_UNSUPPORTED_FEATURE_LABELS[summary.feature]
        );
        throw new Error(
          `Không thể mở bản xem trước vì tệp có ${labels.join(', ')} chưa được hỗ trợ; ` +
          'màu sắc nghiệp vụ có thể bị hiểu sai.'
        );
      }
      this.sourceSnapshot = structuredClone(converted.snapshot);
      this.sourceMetadata = structuredClone(metadataResult.metadata);

      // Univer sizes its render engine synchronously when it mounts. The
      // preview modal can still be settling its flex layout at this point,
      // which occasionally gives Univer a 0x0 host and leaves a blank canvas
      // until the browser is resized. Wait for two paint frames with a
      // renderable host before creating the Univer instance.
      if (!(await this.waitForRenderableHost(token))) return;

      // Install the keyboard boundary before Univer registers its shortcuts,
      // so Ctrl/Cmd+H cannot race the read-only replace guard during mount.
      this.installReadonlyInteractionGuard();
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
            // A view-only preview must not expose the formula editor surface
            // or its cancel/confirm/function controls.
            formulaBar: false,
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
        this.removeReadonlyInteractionGuard?.();
        instance.univer.dispose();
        return;
      }

      this.univer = instance.univer;
      this.univerAPI = instance.univerAPI;
      const previewWorkbook = instance.univerAPI.createWorkbook(converted.snapshot);
      // Cell values/formulas/styles are already in the workbook. Preserved
      // metadata is best-effort and must not turn a usable preview into a
      // blank workbook when a library-specific operation rejects one item.
      try {
        await this.applyPreservedMetadata(previewWorkbook, metadataResult.metadata, converted.snapshot.sheets);
      } catch {
        // Keep the workbook visible and degrade only the incompatible metadata.
      }
      await this.applyInitialSmartLayout(previewWorkbook, token);
      this.syncPreviewFilterSheetNames(previewWorkbook);
      this.installPreviewEvents(previewWorkbook);
      if (token !== this.loadToken) return;
      await this.lockPreviewWorkbook(previewWorkbook);
      this.previewSheetNames.set(previewWorkbook.getSheets().map(sheet => sheet.getSheetName()));
      this.activePreviewSheetName.set(previewWorkbook.getActiveSheet().getSheetName());
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
        try {
          const xSplit = Math.min(sheetMetadata.freeze.xSplit, Math.max(0, bounds.columns - 1));
          const ySplit = Math.min(sheetMetadata.freeze.ySplit, Math.max(0, bounds.rows - 1));
          if (xSplit || ySplit) {
            worksheet.setFreeze({ xSplit, ySplit, startColumn: xSplit, startRow: ySplit });
          }
        } catch {
          // Freeze panes are optional preview metadata.
        }
      }

      applyExcelAutoFilterSafely(sheetMetadata.autoFilter, bounds, filter => {
        worksheet.getRange(
          filter.startRow,
          filter.startColumn,
          filter.endRow - filter.startRow + 1,
          filter.endColumn - filter.startColumn + 1,
        ).createFilter();
      });

      for (const hyperlink of sheetMetadata.hyperlinks) {
        if (hyperlink.row >= bounds.rows || hyperlink.column >= bounds.columns) continue;
        try {
          const url = this.resolveExcelHyperlink(previewWorkbook, hyperlink.url);
          await worksheet.getRange(hyperlink.row, hyperlink.column).setHyperLink(url, hyperlink.label);
        } catch {
          // A malformed or unsupported hyperlink must not block the sheet.
        }
      }

      for (const note of sheetMetadata.notes) {
        if (note.row >= bounds.rows || note.column >= bounds.columns) continue;
        try {
          worksheet.getRange(note.row, note.column).createOrUpdateNote({
            id: `excel-note-${note.row}-${note.column}`,
            row: note.row,
            col: note.column,
            width: 180,
            height: 110,
            note: note.note,
            show: false,
          });
        } catch {
          // Notes are optional preview metadata.
        }
      }
    }
  }

  private installPreviewEvents(workbook: UniverWorkbook): void {
    this.removeUniverEvents?.();
    const api = this.univerAPI;
    if (!api) return;
    const selectAllGuard = api.onBeforeCommandExecute(command => {
      if (command.id !== 'sheet.command.select-all') return;
      this.selectPreviewDataRange();
      throw new CanceledError();
    });
    const activeSheetChanged = api.addEvent(api.Event.ActiveSheetChanged, event => {
      this.closeContextMenu();
      this.closeScopedFind();
      this.activePreviewSheetName.set(event.activeSheet.getSheetName());
      this.syncPreviewFilterSheetNames(event.workbook);
    });
    const filterChanged = api.addEvent(api.Event.SheetRangeFiltered, event => {
      this.closeContextMenu();
      this.syncPreviewFilterSheetNames(event.workbook);
    });
    const filterCleared = api.addEvent(api.Event.SheetRangeFilterCleared, event => {
      this.closeContextMenu();
      this.syncPreviewFilterSheetNames(event.workbook);
    });
    this.removeUniverEvents = () => {
      selectAllGuard.dispose();
      activeSheetChanged.dispose();
      filterChanged.dispose();
      filterCleared.dispose();
      this.removeUniverEvents = undefined;
    };
    void workbook;
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

  private installReadonlyInteractionGuard(): void {
    this.removeReadonlyInteractionGuard?.();

    const host = this.univerHost.nativeElement;
    let viewerInteractionActive = false;
    let longPressTimer: number | undefined;
    let longPressStart: { x: number; y: number } | undefined;
    let longPressTriggered = false;
    let touchPan: {
      pointerId: number;
      startX: number;
      startY: number;
      startRow: number;
      startColumn: number;
      rowStep: number;
      columnStep: number;
      lastRow: number;
      lastColumn: number;
      panning: boolean;
    } | undefined;
    const prevent = (event: Event): void => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const isInsideHost = (target: EventTarget | null): boolean => {
      return target instanceof Node && host.contains(target);
    };
    const isEditorElement = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element) || !host.contains(target)) return false;
      return !!target.closest('[data-u-comp="editor"], [contenteditable]');
    };
    const isSheetCanvas = (target: EventTarget | null): boolean => {
      return target instanceof HTMLCanvasElement && host.contains(target);
    };
    const isEditingKey = (event: KeyboardEvent): boolean => {
      if (['Backspace', 'Delete', 'Enter', 'F2'].includes(event.key)) return true;
      if (event.key.length !== 1) return false;
      if (event.ctrlKey || event.metaKey) {
        return ['v', 'x', 'z', 'y'].includes(event.key.toLowerCase());
      }
      return true;
    };
    const trackViewerInteraction = (event: Event): void => {
      viewerInteractionActive = isInsideHost(event.target);
    };
    const blockViewerShortcuts = (event: Event): void => {
      const keyboardEvent = event as KeyboardEvent;
      const shortcutTarget = keyboardEvent.target instanceof Element
        ? keyboardEvent.target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')
        : null;
      if (shortcutTarget && shouldExcelPreviewTextEntryOwnShortcut(
        shortcutTarget.tagName,
        shortcutTarget.getAttribute('contenteditable') === 'true',
        shortcutTarget.getAttribute('role') ?? '',
        host.contains(shortcutTarget),
      )) return;
      const viewerFocused = viewerInteractionActive ||
        isInsideHost(event.target) ||
        isInsideHost(document.activeElement);
      if (!viewerFocused) return;

      if (keyboardEvent.key === 'ContextMenu' || (keyboardEvent.shiftKey && keyboardEvent.key === 'F10')) {
        prevent(event);
        const rect = host.getBoundingClientRect();
        this.showContextMenu('cell', rect.left + Math.min(180, rect.width / 3), rect.top + Math.min(140, rect.height / 3));
        return;
      }

      if (!(keyboardEvent.ctrlKey || keyboardEvent.metaKey) || keyboardEvent.altKey) return;
      const key = keyboardEvent.key.toLowerCase();
      if (key === 'h') {
        prevent(event);
        return;
      }

      if (key === 'a' && !keyboardEvent.shiftKey) {
        prevent(event);
        this.selectPreviewDataRange();
        // Univer also owns Ctrl+A internally. Re-apply the viewer selection on
        // the next render so its native "select whole sheet" action cannot win.
        requestAnimationFrame(() => this.selectPreviewDataRange());
      } else if (key === 'l' && keyboardEvent.shiftKey) {
        prevent(event);
        void this.applyPreviewFilter();
      } else if (key === 'g' && !keyboardEvent.shiftKey) {
        prevent(event);
        this.toggleGoTo();
      } else if (key === 'c' && !keyboardEvent.shiftKey) {
        prevent(event);
        void this.copyPreviewSelection('copy-display');
      }
    };
    const isEditingTarget = (target: EventTarget | null): boolean => {
      return isEditorElement(target) || isSheetCanvas(target);
    };
    const blockCellDoubleClick = (event: Event): void => {
      if (isSheetCanvas(event.target)) prevent(event);
    };
    const blockKeyboardEditing = (event: Event): void => {
      const keyboardEvent = event as KeyboardEvent;
      const editorFocused = isEditorElement(document.activeElement);
      const editingTarget = isEditingTarget(event.target) || editorFocused;
      if (!editingTarget) return;
      if (editorFocused || isEditingKey(keyboardEvent)) prevent(event);
    };
    const blockInputMutation = (event: Event): void => {
      if (isEditingTarget(event.target) || isEditorElement(document.activeElement)) {
        prevent(event);
      }
    };
    const cancelLongPress = (): void => {
      if (longPressTimer != null) window.clearTimeout(longPressTimer);
      longPressTimer = undefined;
      longPressStart = undefined;
    };
    const startLongPress = (event: PointerEvent): void => {
      if (event.pointerType !== 'touch') return;
      cancelLongPress();
      longPressTriggered = false;
      longPressStart = { x: event.clientX, y: event.clientY };
      longPressTimer = window.setTimeout(() => {
        const hostRect = host.getBoundingClientRect();
        const target = event.target instanceof Element && event.target.closest('[role="tab"]')
          ? 'sheet'
          : classifyExcelPreviewContextTarget(
              event.clientX - hostRect.left,
              event.clientY - hostRect.top,
              hostRect.width,
              hostRect.height,
            );
        longPressTriggered = true;
        this.showContextMenu(target, event.clientX, event.clientY);
        longPressTimer = undefined;
      }, 550);
    };
    const startTouchPan = (event: PointerEvent): void => {
      if (event.pointerType !== 'touch' || !isSheetCanvas(event.target)) return;
      const worksheet = this.univerAPI?.getActiveWorkbook()?.getActiveSheet();
      if (!worksheet) return;

      const scroll = worksheet.getScrollState();
      const startRow = Math.max(0, scroll.sheetViewStartRow ?? 0);
      const startColumn = Math.max(0, scroll.sheetViewStartColumn ?? 0);
      touchPan = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startRow,
        startColumn,
        rowStep: Math.max(20, Math.min(42, worksheet.getRowHeight(startRow) * .9)),
        columnStep: Math.max(36, Math.min(72, worksheet.getColumnWidth(startColumn) * .55)),
        lastRow: startRow,
        lastColumn: startColumn,
        panning: false,
      };
    };
    const moveLongPress = (event: PointerEvent): void => {
      if (!longPressStart) return;
      if (Math.hypot(event.clientX - longPressStart.x, event.clientY - longPressStart.y) > 12) {
        cancelLongPress();
      }
    };
    const moveTouchPan = (event: PointerEvent): void => {
      if (!touchPan || touchPan.pointerId !== event.pointerId || longPressTriggered) return;
      const deltaX = event.clientX - touchPan.startX;
      const deltaY = event.clientY - touchPan.startY;
      if (!touchPan.panning && Math.hypot(deltaX, deltaY) <= 10) return;

      touchPan.panning = true;
      cancelLongPress();
      prevent(event);

      const worksheet = this.univerAPI?.getActiveWorkbook()?.getActiveSheet();
      if (!worksheet) return;
      const targetColumn = Math.max(0, Math.min(
        worksheet.getMaxColumns() - 1,
        touchPan.startColumn + Math.round(-deltaX / touchPan.columnStep),
      ));
      const targetRow = Math.max(0, Math.min(
        worksheet.getMaxRows() - 1,
        touchPan.startRow + Math.round(-deltaY / touchPan.rowStep),
      ));
      if (targetColumn === touchPan.lastColumn && targetRow === touchPan.lastRow) return;

      touchPan.lastColumn = targetColumn;
      touchPan.lastRow = targetRow;
      worksheet.scrollToCell(targetRow, targetColumn);
    };
    const endLongPress = (event: PointerEvent): void => {
      if (longPressTriggered) {
        event.preventDefault();
        longPressTriggered = false;
      }
      cancelLongPress();
    };
    const endTouchPan = (event: PointerEvent): void => {
      if (!touchPan || touchPan.pointerId !== event.pointerId) return;
      if (touchPan.panning) prevent(event);
      touchPan = undefined;
    };
    const enforceReadonlyEditorSurface = (): void => {
      host.querySelectorAll<HTMLElement>('[data-u-comp="editor"], [contenteditable]').forEach(editor => {
        if (editor.getAttribute('contenteditable') !== 'false') {
          editor.setAttribute('contenteditable', 'false');
        }
        if (editor.getAttribute('aria-readonly') !== 'true') {
          editor.setAttribute('aria-readonly', 'true');
        }
      });
    };

    host.addEventListener('dblclick', blockCellDoubleClick, true);
    host.addEventListener('keydown', blockKeyboardEditing, true);
    host.addEventListener('beforeinput', blockInputMutation, true);
    host.addEventListener('input', blockInputMutation, true);
    host.addEventListener('paste', blockInputMutation, true);
    host.addEventListener('cut', blockInputMutation, true);
    host.addEventListener('drop', blockInputMutation, true);
    host.addEventListener('compositionstart', blockInputMutation, true);
    host.addEventListener('compositionupdate', blockInputMutation, true);
    host.addEventListener('compositionend', blockInputMutation, true);
    host.addEventListener('pointerdown', startLongPress, true);
    host.addEventListener('pointerdown', startTouchPan, true);
    host.addEventListener('pointermove', moveLongPress, true);
    host.addEventListener('pointermove', moveTouchPan, true);
    host.addEventListener('pointerup', endLongPress, true);
    host.addEventListener('pointerup', endTouchPan, true);
    host.addEventListener('pointercancel', endLongPress, true);
    host.addEventListener('pointercancel', endTouchPan, true);
    document.body.classList.add('excel-view-only');
    window.addEventListener('pointerdown', trackViewerInteraction, true);
    window.addEventListener('focusin', trackViewerInteraction, true);
    window.addEventListener('keydown', blockViewerShortcuts, true);

    const observer = new MutationObserver(enforceReadonlyEditorSurface);
    observer.observe(host, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['contenteditable', 'aria-readonly'],
    });
    enforceReadonlyEditorSurface();

    this.removeReadonlyInteractionGuard = () => {
      host.removeEventListener('dblclick', blockCellDoubleClick, true);
      host.removeEventListener('keydown', blockKeyboardEditing, true);
      host.removeEventListener('beforeinput', blockInputMutation, true);
      host.removeEventListener('input', blockInputMutation, true);
      host.removeEventListener('paste', blockInputMutation, true);
      host.removeEventListener('cut', blockInputMutation, true);
      host.removeEventListener('drop', blockInputMutation, true);
      host.removeEventListener('compositionstart', blockInputMutation, true);
      host.removeEventListener('compositionupdate', blockInputMutation, true);
      host.removeEventListener('compositionend', blockInputMutation, true);
      host.removeEventListener('pointerdown', startLongPress, true);
      host.removeEventListener('pointerdown', startTouchPan, true);
      host.removeEventListener('pointermove', moveLongPress, true);
      host.removeEventListener('pointermove', moveTouchPan, true);
      host.removeEventListener('pointerup', endLongPress, true);
      host.removeEventListener('pointerup', endTouchPan, true);
      host.removeEventListener('pointercancel', endLongPress, true);
      host.removeEventListener('pointercancel', endTouchPan, true);
      window.removeEventListener('pointerdown', trackViewerInteraction, true);
      window.removeEventListener('focusin', trackViewerInteraction, true);
      window.removeEventListener('keydown', blockViewerShortcuts, true);
      document.body.classList.remove('excel-view-only');
      cancelLongPress();
      touchPan = undefined;
      observer.disconnect();
      this.removeReadonlyInteractionGuard = undefined;
    };
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
    this.removeReadonlyInteractionGuard?.();
    this.removeUniverEvents?.();
    this.submenuOpen.set(null);
    this.contextMenuTarget = undefined;
    this.viewChangeUndo.clear();
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
