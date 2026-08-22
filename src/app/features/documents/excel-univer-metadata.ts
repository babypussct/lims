import type {
  AutoFilter,
  Cell,
  Comment,
  Workbook as ExcelJsWorkbook,
  Worksheet,
  WorksheetViewFrozen,
} from 'exceljs';

export const EXCEL_PRESERVATION_CONTRACT = {
  preserved: ['freezePane', 'autoFilter', 'hyperlink', 'note'] as const,
  unsupported: ['conditionalFormatting', 'dataValidation', 'table', 'drawing'] as const,
  blockingUnsupported: ['conditionalFormatting'] as const,
  excelJsExtensions: ['xlsx', 'xlsm'] as const,
} as const;

export type ExcelUnsupportedFeature = typeof EXCEL_PRESERVATION_CONTRACT.unsupported[number];

export const EXCEL_UNSUPPORTED_FEATURE_LABELS: Record<ExcelUnsupportedFeature, string> = {
  conditionalFormatting: 'định dạng có điều kiện',
  dataValidation: 'xác thực dữ liệu',
  table: 'table Excel',
  drawing: 'hình vẽ hoặc hình ảnh',
};

export interface ExcelFreezeMetadata {
  xSplit: number;
  ySplit: number;
}

export interface ExcelRangeMetadata {
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
}

export interface ExcelHyperlinkMetadata {
  row: number;
  column: number;
  url: string;
  label?: string;
}

export interface ExcelNoteMetadata {
  row: number;
  column: number;
  note: string;
}

export interface ExcelUnsupportedFeatureSummary {
  feature: ExcelUnsupportedFeature;
  count: number;
  sheets: string[];
}

export interface ExcelSheetMetadata {
  name: string;
  freeze?: ExcelFreezeMetadata;
  autoFilter?: ExcelRangeMetadata;
  hyperlinks: ExcelHyperlinkMetadata[];
  notes: ExcelNoteMetadata[];
}

export interface ExcelWorkbookMetadata {
  sheets: ExcelSheetMetadata[];
  unsupportedFeatures: ExcelUnsupportedFeatureSummary[];
}

export interface ExcelWorkbookMetadataLoadResult {
  metadata: ExcelWorkbookMetadata;
  limited: boolean;
  blockingFeatures: ExcelUnsupportedFeatureSummary[];
}

function parseColumnIndex(column: string): number | undefined {
  const normalized = column.replace(/\$/g, '').toUpperCase();
  if (!/^[A-Z]+$/.test(normalized)) return undefined;
  let value = 0;
  for (const character of normalized) value = value * 26 + character.charCodeAt(0) - 64;
  return value - 1;
}

function parseCellAddress(address: string): { row: number; column: number } | undefined {
  const normalized = address.trim().replace(/^.*!/, '').replace(/\$/g, '');
  const match = /^([A-Za-z]+)(\d+)$/.exec(normalized);
  if (!match) return undefined;
  const column = parseColumnIndex(match[1]);
  const row = Number.parseInt(match[2], 10) - 1;
  if (column === undefined || row < 0) return undefined;
  return { row, column };
}

function autoFilterPoint(value: string | { row: number; column: number }): { row: number; column: number } | undefined {
  if (typeof value === 'string') return parseCellAddress(value);
  if (!Number.isFinite(value.row) || !Number.isFinite(value.column)) return undefined;
  return { row: value.row - 1, column: value.column - 1 };
}

function extractAutoFilter(autoFilter: AutoFilter | undefined): ExcelRangeMetadata | undefined {
  if (!autoFilter) return undefined;
  if (typeof autoFilter === 'string') {
    const [fromRaw, toRaw = fromRaw] = autoFilter.split(':');
    const from = parseCellAddress(fromRaw);
    const to = parseCellAddress(toRaw);
    if (!from || !to) return undefined;
    return {
      startRow: Math.min(from.row, to.row),
      startColumn: Math.min(from.column, to.column),
      endRow: Math.max(from.row, to.row),
      endColumn: Math.max(from.column, to.column),
    };
  }

  const from = autoFilterPoint(autoFilter.from);
  const to = autoFilterPoint(autoFilter.to);
  if (!from || !to) return undefined;
  return {
    startRow: Math.min(from.row, to.row),
    startColumn: Math.min(from.column, to.column),
    endRow: Math.max(from.row, to.row),
    endColumn: Math.max(from.column, to.column),
  };
}

function noteText(note: Cell['note']): string | undefined {
  if (typeof note === 'string') return note.trim() || undefined;
  if (!note || typeof note !== 'object') return undefined;
  const texts = (note as Comment).texts;
  if (!texts?.length) return undefined;
  const text = texts.map(part => part.text).join('').trim();
  return text || undefined;
}

type WorksheetWithOptionalMetadata = Worksheet & {
  conditionalFormattings?: unknown[];
  dataValidations?: { model?: unknown };
};

function unsupportedFeatureCounts(worksheet: Worksheet): Partial<Record<ExcelUnsupportedFeature, number>> {
  const source = worksheet as WorksheetWithOptionalMetadata;
  const counts: Partial<Record<ExcelUnsupportedFeature, number>> = {};

  const conditionalFormattingCount = Array.isArray(source.conditionalFormattings)
    ? source.conditionalFormattings.length
    : 0;
  if (conditionalFormattingCount) counts.conditionalFormatting = conditionalFormattingCount;

  const validationModel = source.dataValidations?.model;
  const dataValidationCount = validationModel && typeof validationModel === 'object'
    ? Object.keys(validationModel).length
    : 0;
  if (dataValidationCount) counts.dataValidation = dataValidationCount;

  const tableCount = worksheet.getTables().length;
  if (tableCount) counts.table = tableCount;

  const drawingCount = worksheet.getImages().length;
  if (drawingCount) counts.drawing = drawingCount;

  return counts;
}

function summarizeUnsupportedFeatures(
  worksheets: Worksheet[],
): ExcelUnsupportedFeatureSummary[] {
  return EXCEL_PRESERVATION_CONTRACT.unsupported.flatMap(feature => {
    let count = 0;
    const sheets: string[] = [];

    for (const worksheet of worksheets) {
      const featureCount = unsupportedFeatureCounts(worksheet)[feature] || 0;
      if (!featureCount) continue;
      count += featureCount;
      sheets.push(worksheet.name);
    }

    return count ? [{ feature, count, sheets }] : [];
  });
}

function blockingFeatures(
  unsupportedFeatures: ExcelUnsupportedFeatureSummary[],
): ExcelUnsupportedFeatureSummary[] {
  return unsupportedFeatures.filter(summary =>
    EXCEL_PRESERVATION_CONTRACT.blockingUnsupported.some(feature => feature === summary.feature)
  );
}

function extractSheetMetadata(worksheet: Worksheet): ExcelSheetMetadata {
  const frozenView = (worksheet.views || []).find(view => view.state === 'frozen') as
    | Partial<WorksheetViewFrozen>
    | undefined;
  const xSplit = Math.max(0, Math.trunc(Number(frozenView?.xSplit) || 0));
  const ySplit = Math.max(0, Math.trunc(Number(frozenView?.ySplit) || 0));
  const autoFilter = extractAutoFilter(worksheet.autoFilter);
  const hyperlinks: ExcelHyperlinkMetadata[] = [];
  const notes: ExcelNoteMetadata[] = [];

  worksheet.eachRow(row => {
    row.eachCell(cell => {
      const rowIndex = cell.fullAddress.row - 1;
      const columnIndex = cell.fullAddress.col - 1;
      if (cell.hyperlink) {
        hyperlinks.push({
          row: rowIndex,
          column: columnIndex,
          url: cell.hyperlink,
          ...(cell.text ? { label: cell.text } : {}),
        });
      }

      const note = noteText(cell.note);
      if (note) notes.push({ row: rowIndex, column: columnIndex, note });
    });
  });

  return {
    name: worksheet.name,
    ...((xSplit || ySplit) ? { freeze: { xSplit, ySplit } } : {}),
    ...(autoFilter ? { autoFilter } : {}),
    hyperlinks,
    notes,
  };
}

export function extractExcelJsWorkbookMetadata(workbook: ExcelJsWorkbook): ExcelWorkbookMetadata {
  return {
    sheets: workbook.worksheets.map(extractSheetMetadata),
    unsupportedFeatures: summarizeUnsupportedFeatures(workbook.worksheets),
  };
}

function extensionOf(fileName: string): string {
  return fileName.trim().toLowerCase().match(/\.([^.]+)$/)?.[1] || '';
}

export async function loadExcelWorkbookMetadata(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<ExcelWorkbookMetadataLoadResult> {
  const extension = extensionOf(fileName);
  if (!EXCEL_PRESERVATION_CONTRACT.excelJsExtensions.includes(extension as 'xlsx' | 'xlsm')) {
    return {
      metadata: { sheets: [], unsupportedFeatures: [] },
      limited: extension !== 'csv',
      blockingFeatures: [],
    };
  }

  const exceljsModule = await import('exceljs');
  const exceljs = exceljsModule.default || exceljsModule;
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.load(buffer as Parameters<typeof workbook.xlsx.load>[0]);
  const metadata = extractExcelJsWorkbookMetadata(workbook);
  return {
    metadata,
    limited: false,
    blockingFeatures: blockingFeatures(metadata.unsupportedFeatures),
  };
}
