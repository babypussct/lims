import assert from 'node:assert/strict';
import test from 'node:test';
import ExcelJS from 'exceljs';
import {
  EXCEL_PRESERVATION_CONTRACT,
  extractExcelJsWorkbookMetadata,
  loadExcelWorkbookMetadata,
} from './excel-univer-metadata';

test('preservation contract extracts freeze pane, autofilter, hyperlink and note metadata', async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Metadata', {
    views: [{ state: 'frozen', xSplit: 1, ySplit: 2 }],
  });
  worksheet.addRow(['Name', 'Value', 'Comment']);
  worksheet.addRow(['OpenAI', 42, 'Observed']);
  worksheet.autoFilter = 'A1:C2';
  worksheet.getCell('A2').value = { text: 'OpenAI', hyperlink: 'https://openai.com/' };
  worksheet.getCell('C2').note = 'Review this result';

  const serialized = await workbook.xlsx.writeBuffer();
  const reloaded = new ExcelJS.Workbook();
  await reloaded.xlsx.load(serialized);
  const metadata = extractExcelJsWorkbookMetadata(reloaded);

  assert.deepEqual(EXCEL_PRESERVATION_CONTRACT.preserved, [
    'freezePane',
    'autoFilter',
    'hyperlink',
    'note',
  ]);
  assert.deepEqual(EXCEL_PRESERVATION_CONTRACT.blockingUnsupported, ['conditionalFormatting']);
  assert.deepEqual(metadata.unsupportedFeatures, []);
  assert.deepEqual(metadata.sheets[0].freeze, { xSplit: 1, ySplit: 2 });
  assert.deepEqual(metadata.sheets[0].autoFilter, {
    startRow: 0,
    startColumn: 0,
    endRow: 1,
    endColumn: 2,
  });
  assert.deepEqual(metadata.sheets[0].hyperlinks, [{
    row: 1,
    column: 0,
    url: 'https://openai.com/',
    label: 'OpenAI',
  }]);
  assert.deepEqual(metadata.sheets[0].notes, [{
    row: 1,
    column: 2,
    note: 'Review this result',
  }]);
});

test('preservation contract reports unsupported metadata and blocks conditional formatting', async () => {
  const workbook = new ExcelJS.Workbook();
  const results = workbook.addWorksheet('Results', {
    views: [{ state: 'frozen', xSplit: 1, ySplit: 2 }],
  });
  results.addRows([
    ['Results', 'Value', 'Status', 'Allowed status'],
    ['Sample 1', 2, 'VƯỢT', 'VƯỢT'],
    ['Sample 2', 0.5, 'ĐẠT', 'ĐẠT'],
  ]);
  results.mergeCells('A1:D1');
  results.autoFilter = 'A2:D4';
  results.getCell('A2').value = { text: 'Sample 1', hyperlink: 'https://example.com/sample-1' };
  results.getCell('C3').note = 'Kiểm tra lại với hồ sơ gốc';
  results.addConditionalFormatting({
    ref: 'B3:B4',
    rules: [{ type: 'expression', formulae: ['B3>1'], style: { font: { bold: true } } }],
  });
  const resultsWithValidation = results as typeof results & {
    dataValidations: { add: (address: string, validation: Record<string, unknown>) => void };
  };
  resultsWithValidation.dataValidations.add('D3', {
    type: 'list',
    allowBlank: true,
    formulae: ['"ĐẠT,VƯỢT"'],
  });

  const summary = workbook.addWorksheet('Summary');
  summary.addTable({
    name: 'SummaryTable',
    ref: 'A1:B2',
    headerRow: true,
    totalsRow: false,
    columns: [{ name: 'Metric' }, { name: 'Value' }],
    rows: [['Count', 2]],
  });
  const imageId = workbook.addImage({
    base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    extension: 'png',
  });
  summary.addImage(imageId, 'D1:E2');

  const serialized = await workbook.xlsx.writeBuffer();
  const reloaded = new ExcelJS.Workbook();
  await reloaded.xlsx.load(serialized);
  const metadata = extractExcelJsWorkbookMetadata(reloaded);

  assert.deepEqual(metadata.unsupportedFeatures, [
    { feature: 'conditionalFormatting', count: 1, sheets: ['Results'] },
    { feature: 'dataValidation', count: 1, sheets: ['Results'] },
    { feature: 'table', count: 1, sheets: ['Summary'] },
    { feature: 'drawing', count: 1, sheets: ['Summary'] },
  ]);

  const loaded = await loadExcelWorkbookMetadata(
    serialized as unknown as ArrayBuffer,
    'preservation-contract.xlsx',
  );
  assert.equal(loaded.limited, false);
  assert.deepEqual(loaded.blockingFeatures, [
    { feature: 'conditionalFormatting', count: 1, sheets: ['Results'] },
  ]);
  assert.deepEqual(loaded.metadata.unsupportedFeatures, metadata.unsupportedFeatures);
});

test('legacy Excel formats are explicitly marked metadata-limited', async () => {
  const result = await loadExcelWorkbookMetadata(new ArrayBuffer(0), 'legacy.xls');
  assert.equal(result.limited, true);
  assert.deepEqual(result.metadata, { sheets: [], unsupportedFeatures: [] });
  assert.deepEqual(result.blockingFeatures, []);
});
