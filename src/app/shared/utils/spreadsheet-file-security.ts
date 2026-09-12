export const SPREADSHEET_MAX_FILE_SIZE = 10 * 1024 * 1024;
export const LARGE_SPREADSHEET_MAX_FILE_SIZE = 50 * 1024 * 1024;

export const SPREADSHEET_ALLOWED_EXTENSIONS = ['xlsx', 'xlsm', 'xls', 'csv'] as const;

export const SAFE_XLSX_IMPORT_READ_OPTIONS = {
  type: 'array' as const,
  cellDates: false,
  cellText: true,
  cellFormula: false,
  cellHTML: false,
  cellNF: false,
  cellStyles: false,
  sheetStubs: false,
  bookDeps: false,
  bookFiles: false,
  bookVBA: false,
};

export interface SpreadsheetFileLike {
  name: string;
  size: number;
}

export interface SpreadsheetFileValidationOptions {
  allowedExtensions?: readonly string[];
  maxFileSize?: number;
  maxFileSizeLabel?: string;
}

export function validateSpreadsheetFileSize(
  size: number,
  options: Pick<SpreadsheetFileValidationOptions, 'maxFileSize' | 'maxFileSizeLabel'> = {}
): void {
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error('Tệp rỗng.');
  }

  const maxFileSize = options.maxFileSize ?? SPREADSHEET_MAX_FILE_SIZE;
  if (!Number.isFinite(maxFileSize) || maxFileSize <= 0) {
    throw new Error('Giới hạn kích thước tệp không hợp lệ.');
  }
  if (size > maxFileSize) {
    const maxFileSizeLabel = options.maxFileSizeLabel || `${Math.round(maxFileSize / (1024 * 1024))} MB`;
    throw new Error(`Tệp vượt quá ${maxFileSizeLabel}. Vui lòng chia thành các tệp nhỏ hơn.`);
  }
}

export function getSpreadsheetExtension(fileName: string): string {
  const normalizedName = String(fileName || '').trim().toLowerCase();
  const lastDot = normalizedName.lastIndexOf('.');
  return lastDot >= 0 ? normalizedName.slice(lastDot + 1) : '';
}

export function validateSpreadsheetFile(
  file: SpreadsheetFileLike,
  options: SpreadsheetFileValidationOptions = {}
): void {
  const allowedExtensions = (options.allowedExtensions || SPREADSHEET_ALLOWED_EXTENSIONS)
    .map(extension => extension.replace(/^\./, '').toLowerCase());
  const extension = getSpreadsheetExtension(file.name);

  if (!allowedExtensions.includes(extension)) {
    const labels = allowedExtensions.map(value => `.${value}`).join(', ');
    throw new Error(`Chỉ hỗ trợ tệp ${labels}.`);
  }
  validateSpreadsheetFileSize(file.size, options);
}
