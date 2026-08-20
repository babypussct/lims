import { DocumentPreviewKind, DriveItem, ExcelViewerRow } from './document-viewer.models';

/**
 * Normalizes Vietnamese diacritics and special characters for search and matching.
 */
export function removeDiacritics(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Detects the preview kind for a Google Drive item based on filename and MIME type.
 */
export function detectDocumentKind(item: { name?: string; mimeType?: string } | null | undefined): DocumentPreviewKind {
  if (!item) return 'drive';
  const name = (item.name || '').toLowerCase();
  const mime = (item.mimeType || '').toLowerCase();

  if (name.endsWith('.pdf') || mime === 'application/pdf') {
    return 'pdf';
  }

  if (
    /\.(xlsx|xls|xlsm|csv)$/.test(name) ||
    mime === 'application/vnd.google-apps.spreadsheet' ||
    mime.includes('spreadsheet') ||
    mime.includes('excel') ||
    mime === 'text/csv'
  ) {
    return 'excel';
  }

  if (
    mime.startsWith('image/') ||
    /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)
  ) {
    return 'image';
  }

  if (mime.startsWith('video/')) {
    return 'video';
  }

  if (mime.startsWith('audio/')) {
    return 'audio';
  }

  if (
    mime.startsWith('text/') ||
    /\.(txt|log|md|json|xml|csv)$/.test(name)
  ) {
    return 'text';
  }

  return 'drive';
}

export interface ExcelLimitsConfig {
  maxColumns?: number;
  maxCells?: number;
  maxRows?: number;
}

export interface ExcelLimitsResult {
  visibleColumns: number[];
  visibleRows: number[];
  rowLimit: number;
  isTruncated: boolean;
}

/**
 * Computes Excel sheet viewport slice and truncation state based on budget constraints.
 */
export function computeExcelLimits(
  unhiddenColumns: number[],
  unhiddenRows: number[],
  config: ExcelLimitsConfig = {}
): ExcelLimitsResult {
  const maxColumns = config.maxColumns ?? 200;
  const maxCells = config.maxCells ?? 500_000;
  const maxRows = config.maxRows ?? 50_000;

  const totalUnhiddenColumns = unhiddenColumns.length;
  const totalUnhiddenRows = unhiddenRows.length;

  const visibleColumns = unhiddenColumns.slice(0, maxColumns);
  const columnCount = Math.max(1, visibleColumns.length);

  const rowLimit = Math.min(maxRows, Math.max(1, Math.floor(maxCells / columnCount)));
  const visibleRows = unhiddenRows.slice(0, rowLimit);

  const isTruncated =
    visibleColumns.length < totalUnhiddenColumns ||
    visibleRows.length < totalUnhiddenRows;

  return {
    visibleColumns,
    visibleRows,
    rowLimit,
    isTruncated,
  };
}

/**
 * Generates an export filename for Drive downloads, appending .xlsx for Google Sheets if missing.
 */
export function getExportFileName(item: { name?: string; mimeType?: string }): string {
  const name = item.name || 'tai-lieu';
  if (item.mimeType === 'application/vnd.google-apps.spreadsheet' && !/\.xlsx$/i.test(name)) {
    return `${name}.xlsx`;
  }
  return name;
}

/**
 * Formats file size in bytes to a human-readable string.
 */
export function formatDocumentSize(bytes?: string | number, isFolder = false): string {
  if (isFolder) return 'Thư mục';
  if (bytes === undefined || bytes === null || bytes === '') return '--';
  const b = typeof bytes === 'number' ? bytes : parseInt(bytes, 10);
  if (isNaN(b) || !Number.isFinite(b) || b < 0) return '--';
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

/**
 * Builds TSV string from an Excel selection rectangle.
 */
export function buildExcelSelectionTSV(
  rowData: ExcelViewerRow[],
  rect: { top: number; bottom: number; left: number; right: number } | null
): string {
  if (!rect || !rowData.length) return '';
  const lines: string[] = [];
  const top = Math.max(0, rect.top);
  const bottom = Math.min(rowData.length - 1, rect.bottom);
  const left = Math.max(0, rect.left);
  const right = Math.max(left, rect.right);

  for (let row = top; row <= bottom; row++) {
    const values: string[] = [];
    for (let col = left; col <= right; col++) {
      values.push(String(rowData[row]?.[`c${col}`] ?? ''));
    }
    lines.push(values.join('\t'));
  }
  return lines.join('\r\n');
}

/**
 * Compares two Excel cell values for sorting (numeric aware, Vietnamese locale fallback).
 */
export function compareExcelValues(left: unknown, right: unknown): number {
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
