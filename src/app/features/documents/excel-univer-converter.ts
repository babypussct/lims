import type {
  IBorderStyleData,
  ICellData,
  IStyleData,
  IWorkbookData,
  IWorksheetData,
} from '@univerjs/core';
import type { CellObject, WorkBook, WorkSheet } from 'xlsx';

const FALSE = 0;
const TRUE = 1;
const CELL_TYPE_STRING = 1;
const CELL_TYPE_NUMBER = 2;
const CELL_TYPE_BOOLEAN = 3;
const HORIZONTAL_LEFT = 1;
const HORIZONTAL_CENTER = 2;
const HORIZONTAL_RIGHT = 3;
const HORIZONTAL_JUSTIFIED = 4;
const VERTICAL_TOP = 1;
const VERTICAL_MIDDLE = 2;
const VERTICAL_BOTTOM = 3;
const WRAP = 3;

export const EXCEL_UNIVER_LIMITS = {
  maxColumns: 200,
  maxCells: 500_000,
  maxRows: 50_000,
  minColumns: 26,
  minRows: 200,
} as const;

export interface ExcelUniverConversionResult {
  snapshot: IWorkbookData;
  truncatedSheets: string[];
}

type SheetStyle = NonNullable<CellObject['s']> & {
  font?: Record<string, unknown>;
  fill?: Record<string, unknown>;
  alignment?: Record<string, unknown>;
  border?: Record<string, Record<string, unknown> | undefined>;
};

interface SheetColumnInfo {
  hidden?: boolean;
  wpx?: number;
  wch?: number;
}

interface SheetRowInfo {
  hidden?: boolean;
  hpx?: number;
  hpt?: number;
}

function asBooleanNumber(value: unknown): 0 | 1 {
  return value ? TRUE : FALSE;
}

function normalizeRgb(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const raw = value.trim().replace(/^#/, '');
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(raw)) return undefined;
  const rgb = raw.length === 8 ? raw.slice(2) : raw;
  return `#${rgb.toUpperCase()}`;
}

function colorFromStyle(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  return normalizeRgb((value as Record<string, unknown>)['rgb']);
}

function mapHorizontalAlignment(value: unknown): number | undefined {
  switch (value) {
    case 'left': return HORIZONTAL_LEFT;
    case 'center':
    case 'centerContinuous': return HORIZONTAL_CENTER;
    case 'right': return HORIZONTAL_RIGHT;
    case 'justify':
    case 'distributed': return HORIZONTAL_JUSTIFIED;
    default: return undefined;
  }
}

function mapVerticalAlignment(value: unknown): number | undefined {
  switch (value) {
    case 'top': return VERTICAL_TOP;
    case 'center': return VERTICAL_MIDDLE;
    case 'bottom': return VERTICAL_BOTTOM;
    default: return undefined;
  }
}

function mapBorderStyle(value: unknown): number {
  switch (value) {
    case 'hair': return 2;
    case 'dotted': return 3;
    case 'dashed': return 4;
    case 'dashDot': return 5;
    case 'dashDotDot': return 6;
    case 'double': return 7;
    case 'medium': return 8;
    case 'mediumDashed': return 9;
    case 'mediumDashDot': return 10;
    case 'mediumDashDotDot': return 11;
    case 'slantDashDot': return 12;
    case 'thick': return 13;
    case 'thin':
    default: return 1;
  }
}

function mapBorderSide(side: Record<string, unknown> | undefined): IBorderStyleData | undefined {
  if (!side || !side['style']) return undefined;
  return {
    s: mapBorderStyle(side['style']),
    cl: { rgb: colorFromStyle(side['color']) || '#000000' },
  } as IBorderStyleData;
}

function mapCellStyle(cell: CellObject): IStyleData | undefined {
  const source = cell.s as SheetStyle | undefined;
  const font = source?.font;
  const fill = source?.fill;
  const alignment = source?.alignment;
  const border = source?.border;
  const style: IStyleData = {};

  if (font) {
    if (typeof font['name'] === 'string') style.ff = font['name'];
    if (typeof font['sz'] === 'number') style.fs = font['sz'];
    if (font['bold'] !== undefined) style.bl = asBooleanNumber(font['bold']);
    if (font['italic'] !== undefined) style.it = asBooleanNumber(font['italic']);
    const fontColor = colorFromStyle(font['color']);
    if (fontColor) style.cl = { rgb: fontColor };
    if (font['underline']) style.ul = { s: TRUE };
    if (font['strike']) style.st = { s: TRUE };
  }

  if (fill && fill['patternType'] !== 'none') {
    const background = colorFromStyle(fill['fgColor']) || colorFromStyle(fill['bgColor']);
    if (background) style.bg = { rgb: background };
  }

  if (alignment) {
    const horizontal = mapHorizontalAlignment(alignment['horizontal']);
    const vertical = mapVerticalAlignment(alignment['vertical']);
    if (horizontal !== undefined) style.ht = horizontal;
    if (vertical !== undefined) style.vt = vertical;
    if (alignment['wrapText']) style.tb = WRAP;
    if (typeof alignment['textRotation'] === 'number') {
      style.tr = { a: alignment['textRotation'] };
    }
  }

  if (border) {
    const top = mapBorderSide(border['top']);
    const right = mapBorderSide(border['right']);
    const bottom = mapBorderSide(border['bottom']);
    const left = mapBorderSide(border['left']);
    if (top || right || bottom || left) {
      style.bd = { t: top, r: right, b: bottom, l: left };
    }
  }

  if (cell.z !== undefined && cell.z !== null && String(cell.z).trim()) {
    style.n = { pattern: String(cell.z) };
  }

  return Object.keys(style).length ? style : undefined;
}

export function excelDateSerial(value: Date): number {
  const epoch = Date.UTC(1899, 11, 30);
  const localWallClockAsUtc = Date.UTC(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
    value.getHours(),
    value.getMinutes(),
    value.getSeconds(),
    value.getMilliseconds(),
  );
  return (localWallClockAsUtc - epoch) / 86_400_000;
}

function mapCell(cell: CellObject): ICellData {
  const mapped: ICellData = {};
  const style = mapCellStyle(cell);
  if (style) mapped.s = style;

  if (cell.f) mapped.f = cell.f.startsWith('=') ? cell.f : `=${cell.f}`;

  if (cell.v instanceof Date) {
    mapped.v = excelDateSerial(cell.v);
    mapped.t = CELL_TYPE_NUMBER;
    if (!mapped.s) mapped.s = {};
    if (typeof mapped.s === 'object' && !mapped.s.n) {
      const hasTime = cell.v.getHours() !== 0 || cell.v.getMinutes() !== 0 ||
        cell.v.getSeconds() !== 0 || cell.v.getMilliseconds() !== 0;
      mapped.s.n = { pattern: hasTime ? 'yyyy-mm-dd hh:mm:ss.000' : 'yyyy-mm-dd' };
    }
    return mapped;
  }

  if (cell.t === 'b') {
    mapped.v = Boolean(cell.v);
    mapped.t = CELL_TYPE_BOOLEAN;
  } else if (cell.t === 'n' && typeof cell.v === 'number') {
    mapped.v = cell.v;
    mapped.t = CELL_TYPE_NUMBER;
  } else if (cell.t === 'e') {
    mapped.v = cell.w || String(cell.v ?? '');
    mapped.t = CELL_TYPE_STRING;
  } else if (cell.v !== undefined && cell.v !== null) {
    mapped.v = String(cell.v);
    mapped.t = CELL_TYPE_STRING;
  }

  return mapped;
}

function sheetCounts(
  range: { e: { r: number; c: number } },
): { rowCount: number; columnCount: number; truncated: boolean } {
  const sourceColumns = Math.max(1, range.e.c + 1);
  const sourceRows = Math.max(1, range.e.r + 1);
  const columnCount = Math.min(EXCEL_UNIVER_LIMITS.maxColumns, Math.max(EXCEL_UNIVER_LIMITS.minColumns, sourceColumns));
  const maxRowsByCells = Math.max(1, Math.floor(EXCEL_UNIVER_LIMITS.maxCells / columnCount));
  const cappedSourceRows = Math.min(EXCEL_UNIVER_LIMITS.maxRows, maxRowsByCells, sourceRows);
  const rowCount = Math.min(
    EXCEL_UNIVER_LIMITS.maxRows,
    maxRowsByCells,
    Math.max(EXCEL_UNIVER_LIMITS.minRows, cappedSourceRows),
  );
  return {
    rowCount,
    columnCount,
    truncated: sourceColumns > columnCount || sourceRows > rowCount,
  };
}

function buildWorksheet(
  workbook: WorkBook,
  worksheet: WorkSheet,
  sheetName: string,
  sheetIndex: number,
  xlsx: typeof import('xlsx'),
): { id: string; data: Partial<IWorksheetData>; truncated: boolean } {
  const id = `sheet-${sheetIndex + 1}`;
  const range = xlsx.utils.decode_range(worksheet['!ref'] || 'A1:A1');
  const { rowCount, columnCount, truncated } = sheetCounts(range);
  const cellData: NonNullable<IWorksheetData['cellData']> = {};

  for (const [address, rawCell] of Object.entries(worksheet)) {
    if (address.startsWith('!') || !rawCell || typeof rawCell !== 'object') continue;
    let position: { r: number; c: number };
    try {
      position = xlsx.utils.decode_cell(address);
    } catch {
      continue;
    }
    if (position.r >= rowCount || position.c >= columnCount) continue;
    cellData[position.r] ??= {};
    cellData[position.r][position.c] = mapCell(rawCell as CellObject);
  }

  const rowData: NonNullable<IWorksheetData['rowData']> = {};
  const rows = (worksheet['!rows'] || []) as SheetRowInfo[];
  for (let row = 0; row < Math.min(rows.length, rowCount); row++) {
    const source = rows[row];
    if (!source) continue;
    const height = source.hpx ?? (typeof source.hpt === 'number' ? source.hpt * (96 / 72) : undefined);
    if (height !== undefined || source.hidden) {
      rowData[row] = {
        ...(height !== undefined ? { h: Math.max(2, height) } : {}),
        ...(source.hidden ? { hd: TRUE } : {}),
      };
    }
  }

  const columnData: NonNullable<IWorksheetData['columnData']> = {};
  const columns = (worksheet['!cols'] || []) as SheetColumnInfo[];
  for (let column = 0; column < Math.min(columns.length, columnCount); column++) {
    const source = columns[column];
    if (!source) continue;
    const width = source.wpx ?? (typeof source.wch === 'number' ? source.wch * 7 + 5 : undefined);
    if (width !== undefined || source.hidden) {
      columnData[column] = {
        ...(width !== undefined ? { w: Math.max(8, width) } : {}),
        ...(source.hidden ? { hd: TRUE } : {}),
      };
    }
  }

  const mergeData = (worksheet['!merges'] || [])
    .filter(merge => merge.s.r < rowCount && merge.s.c < columnCount)
    .map(merge => ({
      startRow: merge.s.r,
      startColumn: merge.s.c,
      // Univer 0.25's span model consumes the end row/column inclusively at
      // runtime (even though the public IRange comments describe them as
      // exclusive), which matches SheetJS's merge representation.
      endRow: Math.min(merge.e.r, rowCount - 1),
      endColumn: Math.min(merge.e.c, columnCount - 1),
    }));

  const workbookSheetMeta = workbook.Workbook?.Sheets?.[sheetIndex];
  return {
    id,
    truncated,
    data: {
      id,
      name: sheetName,
      tabColor: '',
      hidden: workbookSheetMeta?.Hidden ? TRUE : FALSE,
      freeze: { xSplit: 0, ySplit: 0, startRow: 0, startColumn: 0 },
      rowCount,
      columnCount,
      zoomRatio: 1,
      scrollTop: 0,
      scrollLeft: 0,
      defaultColumnWidth: 88,
      defaultRowHeight: 24,
      mergeData,
      cellData,
      rowData,
      columnData,
      rowHeader: { width: 46 },
      columnHeader: { height: 26 },
      showGridlines: TRUE,
      rightToLeft: FALSE,
    },
  };
}

export function convertSheetJsWorkbookToUniver(
  workbook: WorkBook,
  xlsx: typeof import('xlsx'),
  fileName = 'Workbook',
): ExcelUniverConversionResult {
  const sheetOrder: string[] = [];
  const sheets: IWorkbookData['sheets'] = {};
  const truncatedSheets: string[] = [];

  workbook.SheetNames.forEach((sheetName, index) => {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return;
    const converted = buildWorksheet(workbook, worksheet, sheetName, index, xlsx);
    sheetOrder.push(converted.id);
    sheets[converted.id] = converted.data;
    if (converted.truncated) truncatedSheets.push(sheetName);
  });

  return {
    snapshot: {
      id: 'excel-preview-workbook',
      name: fileName.replace(/\.(xlsx|xlsm|xlsb|xls|csv)$/i, '') || 'Workbook',
      appVersion: '0.25.1',
      locale: 'viVN' as IWorkbookData['locale'],
      styles: {},
      sheetOrder,
      sheets,
    },
    truncatedSheets,
  };
}
