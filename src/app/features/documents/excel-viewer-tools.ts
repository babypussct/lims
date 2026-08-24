import type { CustomFilterOperator, IFilterColumn } from '@univerjs/sheets-filter';

export type ExcelPreviewContextTarget = 'cell' | 'column' | 'row' | 'sheet' | 'navigation' | 'more';

export type ExcelPreviewMenuAction =
  | 'copy-display'
  | 'copy-raw'
  | 'copy-formulas'
  | 'copy-tsv'
  | 'copy-address'
  | 'copy-sheet-name'
  | 'copy-column-name'
  | 'copy-row-number'
  | 'find'
  | 'select-data-range'
  | 'find-value'
  | 'find-selection'
  | 'open-filter'
  | 'filter-by-value'
  | 'exclude-value'
  | 'filter-blanks'
  | 'filter-non-blanks'
  | 'clear-column-filter'
  | 'align-left'
  | 'align-center'
  | 'align-right'
  | 'fit-selection'
  | 'zoom-100'
  | 'set-column-width'
  | 'set-row-height'
  | 'freeze-selection'
  | 'cancel-freeze'
  | 'hide-columns'
  | 'show-all-columns'
  | 'hide-rows'
  | 'show-all-rows'
  | 'toggle-gridlines'
  | 'previous-sheet'
  | 'next-sheet'
  | 'sheet-list'
  | 'go-to'
  | 'open-hyperlink'
  | 'cell-info'
  | 'selection-info'
  | 'submenu-layout'
  | 'reset-column-view'
  | 'reset-row-view'
  | 'reset-view';

export type ExcelPreviewSortKind = 'text' | 'number' | 'date' | 'mixed';

export type ExcelPreviewViewChangeKind =
  | 'filter'
  | 'sort'
  | 'hidden'
  | 'freeze'
  | 'zoom'
  | 'dimensions'
  | 'format'
  | 'gridlines';

export interface ExcelPreviewViewChange {
  id: string;
  kind: ExcelPreviewViewChangeKind;
  sheetName: string;
  label: string;
  details?: ExcelPreviewViewChangeDetails;
}

export interface ExcelPreviewViewChangeDetails {
  axis?: 'column' | 'row';
  index?: number;
  count?: number;
  range?: string;
  column?: string;
  row?: number;
  direction?: 'ascending' | 'descending';
  split?: string;
  criteria?: string;
  criteriaCount?: number;
  summary?: string;
}

export interface ExcelPreviewMenuItem {
  action: ExcelPreviewMenuAction;
  label: string;
  icon: string;
  group: 'clipboard' | 'find-filter' | 'sort' | 'format' | 'layout' | 'navigation' | 'info';
  shortcut?: string;
  disabled?: boolean;
  disabledReason?: string;
  submenu?: ExcelPreviewMenuItem[];
}

export interface ExcelPreviewMenuCapabilities {
  hasValue: boolean;
  hasFormula: boolean;
  hasHyperlink: boolean;
  hasFilter: boolean;
  canFilter: boolean;
  hasMultipleSheets: boolean;
  gridlinesHidden: boolean;
  frozen: boolean;
}

export interface ExcelPreviewUsedRange {
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
}

export interface ExcelPreviewSmartLayout {
  columnWidths: number[];
  rowHeights: number[];
}

const item = (
  action: ExcelPreviewMenuAction,
  label: string,
  icon: string,
  group: ExcelPreviewMenuItem['group'],
  extra: Pick<ExcelPreviewMenuItem, 'shortcut' | 'disabled' | 'disabledReason' | 'submenu'> = {},
): ExcelPreviewMenuItem => ({ action, label, icon, group, ...extra });

const disabled = (condition: boolean, disabledReason: string) => ({
  disabled: condition,
  disabledReason: condition ? disabledReason : undefined,
});

export function buildExcelPreviewContextMenu(
  target: ExcelPreviewContextTarget,
  capabilities: ExcelPreviewMenuCapabilities,
): ExcelPreviewMenuItem[] {
  const copyItems: ExcelPreviewMenuItem[] = [
    item('copy-display', 'Sao chép như đang hiển thị', 'fa-copy', 'clipboard', { shortcut: 'Ctrl+C' }),
    item('copy-raw', 'Sao chép giá trị gốc', 'fa-code', 'clipboard'),
    item('copy-formulas', 'Sao chép công thức', 'fa-function', 'clipboard', {
      ...disabled(!capabilities.hasFormula, 'Vùng đang chọn không có công thức.'),
    }),
    item('copy-tsv', 'Sao chép vùng dạng TSV', 'fa-table', 'clipboard'),
    item('copy-address', 'Sao chép địa chỉ ô/vùng', 'fa-location-dot', 'clipboard'),
  ];

  const sharedViewItems: ExcelPreviewMenuItem[] = [
    item(
      'toggle-gridlines',
      capabilities.gridlinesHidden ? 'Hiện đường lưới' : 'Ẩn đường lưới',
      'fa-border-all',
      'layout',
    ),
    item(
      'cancel-freeze',
      'Bỏ cố định hàng/cột',
      'fa-unlock',
      'layout',
      { disabled: !capabilities.frozen },
    ),
  ];

  if (target === 'cell') {
    return [
      ...copyItems,
      item('find-value', 'Tìm giá trị này', 'fa-magnifying-glass', 'find-filter', {
        ...disabled(!capabilities.hasValue, 'Ô đang chọn không có giá trị để tìm.'),
      }),
      item('open-filter', 'Mở bộ lọc cột', 'fa-filter', 'find-filter', {
        ...disabled(!capabilities.canFilter, 'Không có vùng dữ liệu đủ ít nhất hai hàng để lọc.'),
      }),
      item('filter-by-value', 'Chỉ hiện giá trị này', 'fa-filter-circle-check', 'find-filter', {
        ...disabled(
          !capabilities.canFilter || !capabilities.hasValue,
          !capabilities.hasValue
            ? 'Ô đang chọn không có giá trị để lọc.'
            : 'Không có vùng dữ liệu đủ ít nhất hai hàng để lọc.',
        ),
      }),
      item('exclude-value', 'Ẩn giá trị này', 'fa-filter-circle-xmark', 'find-filter', {
        ...disabled(
          !capabilities.canFilter || !capabilities.hasValue,
          !capabilities.hasValue
            ? 'Ô đang chọn không có giá trị để loại trừ.'
            : 'Không có vùng dữ liệu đủ ít nhất hai hàng để lọc.',
        ),
      }),
      item('filter-non-blanks', 'Chỉ hiện ô không trống', 'fa-filter-circle-check', 'find-filter', {
        ...disabled(!capabilities.canFilter, 'Không có vùng dữ liệu đủ ít nhất hai hàng để lọc.'),
      }),
      item('filter-blanks', 'Chỉ hiện ô trống', 'fa-filter-circle-xmark', 'find-filter', {
        ...disabled(!capabilities.canFilter, 'Không có vùng dữ liệu đủ ít nhất hai hàng để lọc.'),
      }),
      item('clear-column-filter', 'Xóa lọc ở cột này', 'fa-filter-circle-xmark', 'find-filter', {
        ...disabled(!capabilities.hasFilter, 'Cột đang chọn chưa có điều kiện lọc.'),
      }),
      item('align-left', 'Căn trái', 'fa-align-left', 'format'),
      item('align-center', 'Căn giữa', 'fa-align-center', 'format'),
      item('align-right', 'Căn phải', 'fa-align-right', 'format'),
      item('fit-selection', 'Vừa vùng đang chọn', 'fa-expand', 'format'),
      item('freeze-selection', 'Cố định tới ô đang chọn', 'fa-thumbtack', 'layout'),
      ...sharedViewItems,
      item('open-hyperlink', 'Mở liên kết', 'fa-arrow-up-right-from-square', 'navigation', {
        ...disabled(!capabilities.hasHyperlink, 'Ô đang chọn không có liên kết hợp lệ.'),
      }),
      item('cell-info', 'Xem thông tin ô', 'fa-circle-info', 'info'),
      item('selection-info', 'Thống kê vùng đang chọn', 'fa-chart-simple', 'info'),
    ];
  }

  if (target === 'column') {
    return [
      ...copyItems,
      item('copy-column-name', 'Sao chép tên cột', 'fa-font', 'clipboard'),
      item('find-selection', 'Tìm giá trị đang chọn trong cột', 'fa-magnifying-glass', 'find-filter', {
        ...disabled(!capabilities.hasValue, 'Ô đang chọn không có giá trị để tìm.'),
      }),
      item('open-filter', 'Mở bộ lọc cột', 'fa-filter', 'find-filter', {
        ...disabled(!capabilities.canFilter, 'Không có vùng dữ liệu đủ ít nhất hai hàng để lọc.'),
      }),
      item('filter-non-blanks', 'Chỉ hiện ô không trống', 'fa-filter-circle-check', 'find-filter', {
        ...disabled(!capabilities.canFilter, 'Không có vùng dữ liệu đủ ít nhất hai hàng để lọc.'),
      }),
      item('filter-blanks', 'Chỉ hiện ô trống', 'fa-filter-circle-xmark', 'find-filter', {
        ...disabled(!capabilities.canFilter, 'Không có vùng dữ liệu đủ ít nhất hai hàng để lọc.'),
      }),
      item('clear-column-filter', 'Xóa lọc ở cột này', 'fa-filter-circle-xmark', 'find-filter', {
        ...disabled(!capabilities.hasFilter, 'Cột đang chọn chưa có điều kiện lọc.'),
      }),
      item('align-left', 'Căn trái', 'fa-align-left', 'format'),
      item('align-center', 'Căn giữa', 'fa-align-center', 'format'),
      item('align-right', 'Căn phải', 'fa-align-right', 'format'),
      item('set-column-width', 'Đặt độ rộng cột…', 'fa-ruler-horizontal', 'format'),
      item('freeze-selection', 'Cố định tới cột này', 'fa-thumbtack', 'layout'),
      item('hide-columns', 'Ẩn cột đã chọn', 'fa-eye-slash', 'layout'),
      item('show-all-columns', 'Hiện lại tất cả cột', 'fa-eye', 'layout'),
      item('reset-column-view', 'Đặt lại cách xem cột này', 'fa-rotate-left', 'info'),
      ...sharedViewItems,
    ];
  }

  if (target === 'row') {
    return [
      ...copyItems,
      item('copy-row-number', 'Sao chép số hàng', 'fa-hashtag', 'clipboard'),
      item('find-selection', 'Tìm giá trị đang chọn trong hàng', 'fa-magnifying-glass', 'find-filter', {
        ...disabled(!capabilities.hasValue, 'Ô đang chọn không có giá trị để tìm.'),
      }),
      item('set-row-height', 'Đặt chiều cao hàng…', 'fa-ruler-vertical', 'format'),
      item('freeze-selection', 'Cố định tới hàng này', 'fa-thumbtack', 'layout'),
      item('hide-rows', 'Ẩn hàng đã chọn', 'fa-eye-slash', 'layout'),
      item('show-all-rows', 'Hiện lại tất cả hàng', 'fa-eye', 'layout'),
      item('reset-row-view', 'Đặt lại cách xem hàng này', 'fa-rotate-left', 'info'),
      ...sharedViewItems,
    ];
  }

  if (target === 'navigation') {
    return [
      item('find', 'Tìm kiếm trong workbook…', 'fa-magnifying-glass', 'navigation', { shortcut: 'Ctrl+F' }),
      item('go-to', 'Đi tới ô hoặc vùng…', 'fa-location-crosshairs', 'navigation', { shortcut: 'Ctrl+G' }),
      item('select-data-range', 'Chọn toàn bộ vùng dữ liệu', 'fa-border-all', 'navigation', { shortcut: 'Ctrl+A' }),
    ];
  }

  const navigationItems: ExcelPreviewMenuItem[] = [
    item('fit-selection', 'Vừa vùng đang chọn', 'fa-expand', 'navigation'),
    item('zoom-100', 'Trở về 100%', 'fa-magnifying-glass', 'navigation'),
    item('previous-sheet', 'Sheet trước', 'fa-chevron-left', 'navigation', {
      ...disabled(!capabilities.hasMultipleSheets, 'Workbook chỉ có một sheet.'),
    }),
    item('next-sheet', 'Sheet sau', 'fa-chevron-right', 'navigation', {
      ...disabled(!capabilities.hasMultipleSheets, 'Workbook chỉ có một sheet.'),
    }),
    item('sheet-list', 'Danh sách sheet…', 'fa-list', 'navigation'),
    item('copy-sheet-name', 'Sao chép tên sheet', 'fa-copy', 'clipboard'),
  ];

  if (target === 'more') {
    return [
      item('fit-selection', 'Vừa vùng đang chọn', 'fa-expand', 'navigation'),
      item('zoom-100', 'Trở về 100%', 'fa-magnifying-glass', 'navigation'),
      item('submenu-layout', 'Bố cục sheet…', 'fa-table-columns', 'layout', {
        submenu: [
          item('freeze-selection', 'Cố định tới ô đang chọn', 'fa-thumbtack', 'layout'),
          item('cancel-freeze', 'Bỏ cố định hàng/cột', 'fa-unlock', 'layout', {
            ...disabled(!capabilities.frozen, 'Sheet chưa có hàng hoặc cột đang cố định.'),
          }),
          item('show-all-columns', 'Hiện lại tất cả cột', 'fa-eye', 'layout'),
          item('show-all-rows', 'Hiện lại tất cả hàng', 'fa-eye', 'layout'),
          item(
            'toggle-gridlines',
            capabilities.gridlinesHidden ? 'Hiện đường lưới' : 'Ẩn đường lưới',
            'fa-border-all',
            'layout',
          ),
        ],
      }),
      item('sheet-list', 'Danh sách sheet…', 'fa-list', 'navigation'),
      item('copy-sheet-name', 'Sao chép tên sheet', 'fa-copy', 'clipboard'),
    ];
  }

  return [
    ...navigationItems,
    item('show-all-columns', 'Hiện lại tất cả cột', 'fa-eye', 'layout'),
    item('show-all-rows', 'Hiện lại tất cả hàng', 'fa-eye', 'layout'),
    ...sharedViewItems,
    item('reset-view', 'Đặt lại cách xem', 'fa-rotate-left', 'info'),
  ];
}

export function getExcelColumnLabel(columnIndex: number): string {
  if (!Number.isInteger(columnIndex) || columnIndex < 0) return '';
  let value = columnIndex + 1;
  let label = '';
  while (value > 0) {
    value--;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }
  return label;
}

function hasExcelPreviewCellContent(cell: unknown): boolean {
  if (!cell || typeof cell !== 'object') return false;
  const data = cell as Record<string, unknown>;
  const formula = data['f'];
  if (formula !== undefined && formula !== null && String(formula).trim() !== '') return true;

  if (Object.prototype.hasOwnProperty.call(data, 'v')) {
    const value = data['v'];
    if (value !== undefined && value !== null && !(typeof value === 'string' && value === '')) return true;
  }

  // Univer rich-text cells may carry paragraphs instead of a scalar value.
  return data['p'] !== undefined && data['p'] !== null;
}

export function getExcelPreviewUsedRange(
  cellData: unknown,
): ExcelPreviewUsedRange | undefined {
  if (!cellData || typeof cellData !== 'object') return undefined;

  let startRow = Number.POSITIVE_INFINITY;
  let startColumn = Number.POSITIVE_INFINITY;
  let endRow = -1;
  let endColumn = -1;

  for (const [rowKey, rowValue] of Object.entries(cellData as Record<string, unknown>)) {
    const row = Number(rowKey);
    if (!Number.isInteger(row) || row < 0 || !rowValue || typeof rowValue !== 'object') continue;
    for (const [columnKey, cell] of Object.entries(rowValue as Record<string, unknown>)) {
      const column = Number(columnKey);
      if (!Number.isInteger(column) || column < 0 || !hasExcelPreviewCellContent(cell)) continue;
      startRow = Math.min(startRow, row);
      startColumn = Math.min(startColumn, column);
      endRow = Math.max(endRow, row);
      endColumn = Math.max(endColumn, column);
    }
  }

  if (endRow < 0 || endColumn < 0) return undefined;
  return { startRow, startColumn, endRow, endColumn };
}

export function calculateExcelPreviewSmartLayout(
  displayValues: string[][],
  options: {
    minColumnWidth?: number;
    maxColumnWidth?: number;
    minRowHeight?: number;
    maxRowHeight?: number;
    averageCharacterWidth?: number;
    horizontalPadding?: number;
    lineHeight?: number;
  } = {},
): ExcelPreviewSmartLayout {
  const minColumnWidth = options.minColumnWidth ?? 80;
  const maxColumnWidth = Math.max(minColumnWidth, options.maxColumnWidth ?? 260);
  const minRowHeight = options.minRowHeight ?? 24;
  const maxRowHeight = Math.max(minRowHeight, options.maxRowHeight ?? 180);
  const averageCharacterWidth = options.averageCharacterWidth ?? 7;
  const horizontalPadding = options.horizontalPadding ?? 18;
  const lineHeight = options.lineHeight ?? 18;
  const columnCount = displayValues.reduce((max, row) => Math.max(max, row.length), 0);
  if (!columnCount || !displayValues.length) return { columnWidths: [], rowHeights: [] };

  const columnWidths = Array.from({ length: columnCount }, () => minColumnWidth);
  for (const row of displayValues) {
    for (let column = 0; column < columnCount; column++) {
      const value = String(row[column] ?? '');
      const longestExplicitLine = value.split(/\r?\n/).reduce((max, line) => Math.max(max, line.length), 0);
      const estimatedWidth = longestExplicitLine * averageCharacterWidth + horizontalPadding;
      columnWidths[column] = Math.max(
        columnWidths[column],
        Math.min(maxColumnWidth, estimatedWidth),
      );
    }
  }

  const rowHeights = displayValues.map(row => {
    let wrappedLineCount = 1;
    for (let column = 0; column < columnCount; column++) {
      const value = String(row[column] ?? '');
      if (!value) continue;
      const usableWidth = Math.max(averageCharacterWidth, columnWidths[column] - horizontalPadding);
      const charactersPerLine = Math.max(1, Math.floor(usableWidth / averageCharacterWidth));
      const lines = value.split(/\r?\n/).reduce(
        (count, line) => count + Math.max(1, Math.ceil(line.length / charactersPerLine)),
        0,
      );
      wrappedLineCount = Math.max(wrappedLineCount, lines);
    }
    return Math.max(minRowHeight, Math.min(maxRowHeight, wrappedLineCount * lineHeight + 6));
  });

  return { columnWidths, rowHeights };
}

export function inferExcelPreviewSortKind(values: unknown[], numberFormat = ''): ExcelPreviewSortKind {
  const nonBlank = values.filter(value => value !== '' && value != null).slice(0, 200);
  if (!nonBlank.length) return 'mixed';
  if (/[ymdhis]/i.test(numberFormat.replace(/\[[^\]]*]/g, ''))) return 'date';

  let numbers = 0;
  let dates = 0;
  let text = 0;
  for (const value of nonBlank) {
    if (value instanceof Date) dates++;
    else if (typeof value === 'number' && Number.isFinite(value)) numbers++;
    else if (typeof value === 'string' && !Number.isNaN(Date.parse(value)) && /[-/:]/.test(value)) dates++;
    else text++;
  }

  if (dates === nonBlank.length) return 'date';
  if (numbers === nonBlank.length) return 'number';
  if (text === nonBlank.length) return 'text';
  return 'mixed';
}

export function upsertExcelPreviewViewChange(
  changes: readonly ExcelPreviewViewChange[],
  change: ExcelPreviewViewChange,
  maximumChanges = 8,
): ExcelPreviewViewChange[] {
  const withoutCurrent = changes.filter(current => current.id !== change.id);
  const safeMaximum = Math.max(1, Math.floor(maximumChanges));
  return [...withoutCurrent.slice(-(safeMaximum - 1)), change];
}

export function removeExcelPreviewViewChange(
  changes: readonly ExcelPreviewViewChange[],
  kind: ExcelPreviewViewChangeKind,
  sheetName: string,
): ExcelPreviewViewChange[] {
  return changes.filter(change => !(change.kind === kind && change.sheetName === sheetName));
}

export function isExcelPreviewTextEntryElement(
  tagName: string,
  contentEditable = false,
  role = '',
): boolean {
  return contentEditable || ['input', 'textarea', 'select'].includes(tagName.toLocaleLowerCase()) ||
    role.toLocaleLowerCase() === 'textbox';
}

export function shouldExcelPreviewTextEntryOwnShortcut(
  tagName: string,
  contentEditable = false,
  role = '',
  insideWorkbookHost = false,
): boolean {
  return !insideWorkbookHost && isExcelPreviewTextEntryElement(tagName, contentEditable, role);
}

export function isSafeExcelHyperlink(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return !!parsed.hostname;
    if (parsed.protocol === 'mailto:') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.pathname);
    return false;
  } catch {
    return false;
  }
}

export type ExcelPreviewFilterMode = 'include' | 'exclude' | 'blanks' | 'non-blanks';

export function buildExcelPreviewFilterCriteria(
  mode: ExcelPreviewFilterMode,
  colId: number,
  value: unknown,
  notEqualsOperator: unknown,
): IFilterColumn {
  if (mode === 'include') {
    return { colId, filters: { filters: [String(value ?? '')] } };
  }
  if (mode === 'blanks') {
    return { colId, filters: { blank: true } };
  }
  return {
    colId,
    customFilters: {
      customFilters: [{
        val: mode === 'non-blanks' ? '' : (typeof value === 'number' ? value : String(value ?? '')),
        operator: notEqualsOperator as CustomFilterOperator | undefined,
      }],
    },
  };
}

export interface ParsedExcelGoToTarget {
  sheetName?: string;
  address: string;
}

export function parseExcelGoToTarget(value: string): ParsedExcelGoToTarget | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const match = /^(?:(?:'((?:[^']|'')+)'|([^!]+))!)?(\$?[A-Za-z]{1,3}\$?\d+(?::\$?[A-Za-z]{1,3}\$?\d+)?)$/.exec(trimmed);
  if (!match) return undefined;
  const rowNumbers = Array.from(match[3].matchAll(/\d+/g), result => Number(result[0]));
  if (rowNumbers.some(row => !Number.isInteger(row) || row < 1)) return undefined;

  return {
    sheetName: (match[1] || match[2])?.replace(/''/g, "'").trim(),
    address: match[3].replace(/\$/g, '').toUpperCase(),
  };
}

export function serializeExcelPreviewGrid(values: unknown[][]): string {
  return values
    .map(row => row.map(value => {
      if (value == null) return '';
      const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return text.replace(/\r?\n/g, ' ');
    }).join('\t'))
    .join('\n');
}

export function classifyExcelPreviewContextTarget(
  localX: number,
  localY: number,
  hostWidth: number,
  hostHeight: number,
): ExcelPreviewContextTarget {
  const rowHeaderWidth = Math.min(52, Math.max(36, hostWidth * 0.05));
  const columnHeaderHeight = 30;
  const sheetBarHeight = 44;

  if (localY >= hostHeight - sheetBarHeight) return 'sheet';
  if (localY <= columnHeaderHeight && localX > rowHeaderWidth) return 'column';
  if (localX <= rowHeaderWidth && localY > columnHeaderHeight) return 'row';
  return 'cell';
}
