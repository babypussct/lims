import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LARGE_SPREADSHEET_MAX_FILE_SIZE,
  SAFE_XLSX_IMPORT_READ_OPTIONS,
  SPREADSHEET_MAX_FILE_SIZE,
  getSpreadsheetExtension,
  validateSpreadsheetFile,
  validateSpreadsheetFileSize
} from './spreadsheet-file-security';

test('normalizes spreadsheet extensions before validation', () => {
  assert.equal(getSpreadsheetExtension('Book2.XLSX'), 'xlsx');
  assert.equal(getSpreadsheetExtension('no-extension'), '');
  assert.doesNotThrow(() => validateSpreadsheetFile({ name: 'Book2.XLSM', size: 1024 }));
});

test('rejects empty, unsupported and oversized spreadsheet inputs before parsing', () => {
  assert.throws(
    () => validateSpreadsheetFile({ name: 'payload.exe', size: 1024 }),
    /Chỉ hỗ trợ tệp \.xlsx, \.xlsm, \.xls, \.csv/
  );
  assert.throws(
    () => validateSpreadsheetFile({ name: 'empty.xlsx', size: 0 }),
    /Tệp rỗng/
  );
  assert.throws(
    () => validateSpreadsheetFile({ name: 'large.xlsx', size: SPREADSHEET_MAX_FILE_SIZE + 1 }),
    /10 MB/
  );
  assert.doesNotThrow(() => validateSpreadsheetFile(
    { name: 'masshunter.xls', size: 20 * 1024 * 1024 },
    { allowedExtensions: ['xlsx', 'xls'], maxFileSize: LARGE_SPREADSHEET_MAX_FILE_SIZE }
  ));
  assert.doesNotThrow(() => validateSpreadsheetFileSize(20 * 1024 * 1024, {
    maxFileSize: LARGE_SPREADSHEET_MAX_FILE_SIZE
  }));
});

test('disables unnecessary workbook features for untrusted import files', () => {
  assert.equal(SAFE_XLSX_IMPORT_READ_OPTIONS.type, 'array');
  assert.equal(SAFE_XLSX_IMPORT_READ_OPTIONS.cellFormula, false);
  assert.equal(SAFE_XLSX_IMPORT_READ_OPTIONS.cellHTML, false);
  assert.equal(SAFE_XLSX_IMPORT_READ_OPTIONS.cellStyles, false);
  assert.equal(SAFE_XLSX_IMPORT_READ_OPTIONS.bookFiles, false);
  assert.equal(SAFE_XLSX_IMPORT_READ_OPTIONS.bookVBA, false);
});
