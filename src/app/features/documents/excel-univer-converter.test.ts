import assert from 'node:assert/strict';
import test from 'node:test';
import * as XLSX from 'xlsx';
import { convertSheetJsWorkbookToUniver, excelDateSerial, EXCEL_UNIVER_LIMITS } from './excel-univer-converter';

function buildFixtureWorkbook(): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([
    ['Báo cáo kết quả', null, null, null],
    ['Mã mẫu', 'Chỉ tiêu', 'Kết quả', 'Đánh giá'],
    ['M-001', 'Caffeine', 1.25, { f: 'IF(C3>1,"VƯỢT","ĐẠT")', v: 'VƯỢT' }],
    ['M-002', 'Pesticide', 0.2, { f: 'IF(C4>1,"VƯỢT","ĐẠT")', v: 'ĐẠT' }],
  ]);
  sheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
  sheet['!cols'] = [{ wpx: 140 }, { wch: 20 }, { wch: 12 }, { hidden: true }];
  sheet['!rows'] = [{ hpt: 24 }, { hpx: 30 }, { hidden: true }];
  XLSX.utils.book_append_sheet(workbook, sheet, 'Kết quả');

  const summary = XLSX.utils.aoa_to_sheet([
    ['Tóm tắt'],
    ['Số dòng', 2],
  ]);
  XLSX.utils.book_append_sheet(workbook, summary, 'Tóm tắt');
  return workbook;
}

test('converts sheets, formulas, merges and dimensions to an inclusive preview snapshot', () => {
  const workbook = buildFixtureWorkbook();
  const converted = convertSheetJsWorkbookToUniver(workbook, XLSX, 'demo.xlsx');
  const sheet = converted.snapshot.sheets[converted.snapshot.sheetOrder[0]];

  assert.deepEqual(converted.snapshot.sheetOrder, ['sheet-1', 'sheet-2']);
  assert.equal(converted.snapshot.name, 'demo');
  assert.equal(sheet.name, 'Kết quả');
  assert.equal(sheet.rowCount, EXCEL_UNIVER_LIMITS.minRows);
  assert.equal(sheet.columnCount, EXCEL_UNIVER_LIMITS.minColumns);
  assert.deepEqual(sheet.mergeData, [{
    startRow: 0,
    startColumn: 0,
    endRow: 0,
    endColumn: 3,
  }]);
  assert.equal(sheet.cellData?.[2]?.[3]?.f, '=IF(C3>1,"VƯỢT","ĐẠT")');
  assert.equal(sheet.cellData?.[2]?.[3]?.v, 'VƯỢT');
  assert.equal(sheet.columnData?.[0]?.w, 140);
  assert.equal(sheet.columnData?.[3]?.hd, 1);
  assert.equal(sheet.rowData?.[0]?.h, 32);
  assert.equal(sheet.rowData?.[2]?.hd, 1);
  assert.equal(converted.truncatedSheets.length, 0);
});

test('caps very wide and tall sheets using the cell budget and reports truncation', () => {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([['only a small amount of data']]);
  sheet['!ref'] = 'A1:ZZ10000';
  XLSX.utils.book_append_sheet(workbook, sheet, 'Big preview');

  const converted = convertSheetJsWorkbookToUniver(workbook, XLSX);
  const sheetData = converted.snapshot.sheets['sheet-1'];

  assert.equal(sheetData.columnCount, EXCEL_UNIVER_LIMITS.maxColumns);
  assert.equal(sheetData.rowCount, Math.floor(EXCEL_UNIVER_LIMITS.maxCells / EXCEL_UNIVER_LIMITS.maxColumns));
  assert.deepEqual(converted.truncatedSheets, ['Big preview']);
  assert.equal(sheetData.cellData?.[0]?.[0]?.v, 'only a small amount of data');
});

test('converts local dates and datetimes without timezone drift', () => {
  const source = XLSX.utils.book_new();
  const sourceSheet = XLSX.utils.aoa_to_sheet([[
    new Date(2026, 7, 22),
    new Date(2026, 7, 22, 15, 30, 45, 250),
    12.5,
  ]]);
  XLSX.utils.book_append_sheet(source, sourceSheet, 'Dates');
  const workbook = XLSX.read(XLSX.write(source, { type: 'buffer', bookType: 'xlsx' }), {
    type: 'buffer',
    cellDates: true,
    cellNF: true,
    cellText: true,
  });
  workbook.Sheets.Dates.A1.z = 'yyyy-mm-dd';
  workbook.Sheets.Dates.B1.z = 'yyyy-mm-dd hh:mm:ss.000';

  const converted = convertSheetJsWorkbookToUniver(workbook, XLSX);
  const row = converted.snapshot.sheets['sheet-1'].cellData?.[0];

  assert.equal(row?.[0]?.t, 2);
  assert.equal(row?.[0]?.v, 46256);
  assert.equal(row?.[0]?.s && typeof row[0].s === 'object' && row[0].s.n?.pattern, 'yyyy-mm-dd');
  assert.equal(row?.[1]?.t, 2);
  assert.ok(typeof row?.[1]?.v === 'number');
  assert.ok(Math.abs(row[1].v - (46256 + ((15 * 60 * 60 + 30 * 60 + 45.25) / 86_400))) < 1e-9);
  assert.equal(row?.[1]?.s && typeof row[1].s === 'object' && row[1].s.n?.pattern, 'yyyy-mm-dd hh:mm:ss.000');
  assert.equal(row?.[2]?.v, 12.5);
  assert.equal(row?.[2]?.t, 2);
});

test('uses a datetime display format when a Date cell has no explicit number format', () => {
  const workbook = {
    SheetNames: ['Dates'],
    Sheets: {
      Dates: {
        A1: { v: new Date(2026, 7, 22), t: 'd' },
        B1: { v: new Date(2026, 7, 22, 15, 30, 45, 250), t: 'd' },
        '!ref': 'A1:B1',
      },
    },
  } as unknown as XLSX.WorkBook;

  const converted = convertSheetJsWorkbookToUniver(workbook, XLSX);
  const row = converted.snapshot.sheets['sheet-1'].cellData?.[0];
  const dateStyle = row?.[0]?.s;
  const datetimeStyle = row?.[1]?.s;

  assert.equal(dateStyle && typeof dateStyle === 'object' && dateStyle.n?.pattern, 'yyyy-mm-dd');
  assert.equal(datetimeStyle && typeof datetimeStyle === 'object' && datetimeStyle.n?.pattern, 'yyyy-mm-dd hh:mm:ss.000');
});

test('Excel date serialization is stable in UTC and Asia/Ho_Chi_Minh', () => {
  const previousTz = process.env.TZ;
  try {
    for (const timezone of ['UTC', 'Asia/Ho_Chi_Minh']) {
      process.env.TZ = timezone;
      assert.equal(excelDateSerial(new Date(2026, 7, 22)), 46256, timezone);

      const datetime = excelDateSerial(new Date(2026, 7, 22, 6, 15, 30, 500));
      const expected = 46256 + ((6 * 60 * 60 + 15 * 60 + 30.5) / 86_400);
      assert.ok(Math.abs(datetime - expected) < 1e-9, timezone);
    }
  } finally {
    if (previousTz === undefined) delete process.env.TZ;
    else process.env.TZ = previousTz;
  }
});
