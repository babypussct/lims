import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  buildExcelSelectionTSV,
  compareExcelValues,
  computeExcelLimits,
  detectDocumentKind,
  formatDocumentSize,
  getExportFileName,
  removeDiacritics,
} from './document-viewer.utils';

function readProjectFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('TEST-001: Documents offline gating logic & contract', () => {
  const documentsSource = readProjectFile('./documents.component.ts');

  it('gating checks navigator.onLine and blocks network actions when offline', () => {
    assert.match(documentsSource, /isOnline = signal<boolean>\(navigator\.onLine\)/);
    assert.match(documentsSource, /if \(!this\.isOnline\(\)\) return;/);
    assert.match(documentsSource, /if \(!this\.isOnline\(\)\) \{\s*if \(requestId === this\.folderRequestId\)/);
  });

  it('registers window online and offline listeners and cleans them up on destroy', () => {
    assert.match(documentsSource, /window\.addEventListener\('online', this\.onlineListener\)/);
    assert.match(documentsSource, /window\.addEventListener\('offline', this\.offlineListener\)/);
    assert.match(documentsSource, /window\.removeEventListener\('online', this\.onlineListener\)/);
    assert.match(documentsSource, /window\.removeEventListener\('offline', this\.offlineListener\)/);
  });

  it('renders offline empty state in template when offline', () => {
    assert.match(documentsSource, /@if \(!isOnline\(\)\)/);
    assert.match(documentsSource, /icon="fa-plug-circle-xmark"/);
    assert.match(documentsSource, /title="Không có kết nối mạng"/);
  });
});

describe('TEST-002: detectDocumentKind (table-driven classification)', () => {
  const testCases: {
    item: { name?: string; mimeType?: string } | null | undefined;
    expected: string;
    description: string;
  }[] = [
    // PDF
    { item: { name: 'report.pdf', mimeType: 'application/pdf' }, expected: 'pdf', description: 'PDF file with extension and MIME' },
    { item: { name: 'document.PDF', mimeType: 'application/octet-stream' }, expected: 'pdf', description: 'PDF file uppercase extension' },
    { item: { name: 'unnamed', mimeType: 'application/pdf' }, expected: 'pdf', description: 'PDF MIME without extension' },

    // Excel & Spreadsheets
    { item: { name: 'data.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }, expected: 'excel', description: 'Excel .xlsx' },
    { item: { name: 'legacy.xls', mimeType: 'application/vnd.ms-excel' }, expected: 'excel', description: 'Excel legacy .xls' },
    { item: { name: 'macro.xlsm', mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12' }, expected: 'excel', description: 'Excel macro .xlsm' },
    { item: { name: 'export.csv', mimeType: 'text/csv' }, expected: 'excel', description: 'CSV file mapped to Excel viewer' },
    { item: { name: 'Sheet1', mimeType: 'application/vnd.google-apps.spreadsheet' }, expected: 'excel', description: 'Google Sheet native MIME' },
    { item: { name: 'custom.sheet', mimeType: 'application/x-spreadsheet' }, expected: 'excel', description: 'Custom spreadsheet MIME' },

    // Images
    { item: { name: 'photo.png', mimeType: 'image/png' }, expected: 'image', description: 'PNG image' },
    { item: { name: 'picture.jpg', mimeType: 'image/jpeg' }, expected: 'image', description: 'JPEG image' },
    { item: { name: 'graphic.webp', mimeType: 'image/webp' }, expected: 'image', description: 'WebP image' },
    { item: { name: 'vector.svg', mimeType: 'image/svg+xml' }, expected: 'image', description: 'SVG image' },

    // Video
    { item: { name: 'clip.mp4', mimeType: 'video/mp4' }, expected: 'video', description: 'MP4 video' },
    { item: { name: 'recording.webm', mimeType: 'video/webm' }, expected: 'video', description: 'WebM video' },

    // Audio
    { item: { name: 'sound.mp3', mimeType: 'audio/mpeg' }, expected: 'audio', description: 'MP3 audio' },
    { item: { name: 'audio.wav', mimeType: 'audio/wav' }, expected: 'audio', description: 'WAV audio' },

    // Text
    { item: { name: 'readme.txt', mimeType: 'text/plain' }, expected: 'text', description: 'Plain text file' },
    { item: { name: 'document.md', mimeType: 'text/markdown' }, expected: 'text', description: 'Markdown file' },
    { item: { name: 'config.json', mimeType: 'application/json' }, expected: 'text', description: 'JSON file' },
    { item: { name: 'app.log', mimeType: 'text/plain' }, expected: 'text', description: 'Log file' },

    // Google Workspace Docs / Slides & Fallbacks -> drive
    { item: { name: 'Document', mimeType: 'application/vnd.google-apps.document' }, expected: 'drive', description: 'Google Docs native fallback' },
    { item: { name: 'Presentation', mimeType: 'application/vnd.google-apps.presentation' }, expected: 'drive', description: 'Google Slides native fallback' },
    { item: { name: 'archive.zip', mimeType: 'application/zip' }, expected: 'drive', description: 'ZIP archive fallback' },
    { item: null, expected: 'drive', description: 'Null item fallback' },
    { item: undefined, expected: 'drive', description: 'Undefined item fallback' },
  ];

  for (const { item, expected, description } of testCases) {
    it(`classifies ${description} -> ${expected}`, () => {
      assert.equal(detectDocumentKind(item), expected);
    });
  }
});

describe('TEST-003: computeExcelLimits (pure helper calculations)', () => {
  it('truncates columns exceeding maxColumns (200) and marks isTruncated true', () => {
    const unhiddenCols = Array.from({ length: 250 }, (_, i) => i);
    const unhiddenRows = Array.from({ length: 100 }, (_, i) => i);

    const result = computeExcelLimits(unhiddenCols, unhiddenRows, { maxColumns: 200, maxCells: 500_000, maxRows: 50_000 });

    assert.equal(result.visibleColumns.length, 200);
    assert.equal(result.visibleRows.length, 100);
    assert.equal(result.isTruncated, true);
  });

  it('truncates rows exceeding maxRows (50,000) on narrow sheets', () => {
    const unhiddenCols = [0, 1];
    const unhiddenRows = Array.from({ length: 55_000 }, (_, i) => i);

    const result = computeExcelLimits(unhiddenCols, unhiddenRows, { maxColumns: 200, maxCells: 500_000, maxRows: 50_000 });

    assert.equal(result.visibleColumns.length, 2);
    assert.equal(result.visibleRows.length, 50_000);
    assert.equal(result.isTruncated, true);
  });

  it('adjusts rowLimit based on cell budget: 200 columns allows 2,500 rows for 500,000 cell budget', () => {
    const unhiddenCols = Array.from({ length: 200 }, (_, i) => i);
    const unhiddenRows = Array.from({ length: 3_000 }, (_, i) => i);

    const result = computeExcelLimits(unhiddenCols, unhiddenRows, { maxColumns: 200, maxCells: 500_000, maxRows: 50_000 });

    assert.equal(result.visibleColumns.length, 200);
    assert.equal(result.rowLimit, 2_500);
    assert.equal(result.visibleRows.length, 2_500);
    assert.equal(result.isTruncated, true);
  });

  it('does not truncate sheets within the budget', () => {
    const unhiddenCols = Array.from({ length: 20 }, (_, i) => i);
    const unhiddenRows = Array.from({ length: 500 }, (_, i) => i);

    const result = computeExcelLimits(unhiddenCols, unhiddenRows, { maxColumns: 200, maxCells: 500_000, maxRows: 50_000 });

    assert.equal(result.visibleColumns.length, 20);
    assert.equal(result.visibleRows.length, 500);
    assert.equal(result.isTruncated, false);
  });

  it('handles empty sheet without division by zero', () => {
    const result = computeExcelLimits([], []);
    assert.equal(result.visibleColumns.length, 0);
    assert.equal(result.visibleRows.length, 0);
    assert.equal(result.rowLimit, 50_000);
    assert.equal(result.isTruncated, false);
  });
});

describe('TEST-004: removeDiacritics & search normalization', () => {
  it('strips Vietnamese diacritics and converts đ/Đ to d/D', () => {
    assert.equal(removeDiacritics('Phiếu Giao Nhận Mẫu Đã Kiểm Nghiệm'), 'Phieu Giao Nhan Mau Da Kiem Nghiem');
    assert.equal(removeDiacritics('Hóa chất & Chuẩn ĐỘ'), 'Hoa chat & Chuan DO');
    assert.equal(removeDiacritics('ĐẠI HỌC CẦN THƠ'), 'DAI HOC CAN THO');
    assert.equal(removeDiacritics(''), '');
  });

  it('handles ASCII and numbers cleanly without modification', () => {
    assert.equal(removeDiacritics('Batch_2026-08-20_v01.xlsx'), 'Batch_2026-08-20_v01.xlsx');
  });
});

describe('TEST-005: Preview lifecycle helpers & format utilities', () => {
  it('appends .xlsx to Google Sheets export file name', () => {
    assert.equal(getExportFileName({ name: 'BangTheoDoiMau', mimeType: 'application/vnd.google-apps.spreadsheet' }), 'BangTheoDoiMau.xlsx');
    assert.equal(getExportFileName({ name: 'BangTheoDoiMau.xlsx', mimeType: 'application/vnd.google-apps.spreadsheet' }), 'BangTheoDoiMau.xlsx');
  });

  it('preserves existing filenames for standard documents', () => {
    assert.equal(getExportFileName({ name: 'Phieu_01.pdf', mimeType: 'application/pdf' }), 'Phieu_01.pdf');
    assert.equal(getExportFileName({ name: '', mimeType: 'application/pdf' }), 'tai-lieu');
  });

  it('formats file sizes accurately across byte units', () => {
    assert.equal(formatDocumentSize('500'), '500 B');
    assert.equal(formatDocumentSize('2048'), '2.0 KB');
    assert.equal(formatDocumentSize('10485760'), '10.0 MB');
    assert.equal(formatDocumentSize(undefined, true), 'Thư mục');
    assert.equal(formatDocumentSize('invalid'), '--');
    assert.equal(formatDocumentSize(''), '--');
  });
});

describe('Excel TSV export & value comparison', () => {
  it('builds TSV string correctly for 2D cell selections', () => {
    const rows = [
      { __rowNumber: 1, c0: 'Mã mẫu', c1: 'Chỉ tiêu', c2: 'Kết quả' },
      { __rowNumber: 2, c0: 'M01', c1: 'pH', c2: '7.2' },
      { __rowNumber: 3, c0: 'M02', c1: 'Độ ẩm', c2: '4.5%' },
    ];

    const tsv = buildExcelSelectionTSV(rows, { top: 0, bottom: 2, left: 0, right: 2 });
    assert.equal(tsv, 'Mã mẫu\tChỉ tiêu\tKết quả\r\nM01\tpH\t7.2\r\nM02\tĐộ ẩm\t4.5%');
  });

  it('compares numeric and textual values properly in compareExcelValues', () => {
    assert.ok(compareExcelValues('10.5', '2.3') > 0);
    assert.ok(compareExcelValues('2.3', '10.5') < 0);
    assert.equal(compareExcelValues('10.5', '10.5'), 0);
    assert.ok(compareExcelValues('', 'A') > 0, 'empty values sort to bottom');
    assert.ok(compareExcelValues('A', '') < 0, 'non-empty values sort ahead of empty');
  });
});

describe('Preview Modal & Mobile UI Contract Safeguards', () => {
  const previewSource = readProjectFile('./document-preview-modal.component.ts');
  const excelSource = readProjectFile('./excel-document-viewer.component.ts');
  const pdfSource = readProjectFile('./pdf-document-viewer.component.ts');
  const ngswConfig = readFileSync(new URL('../../../../ngsw-config.json', import.meta.url), 'utf8');

  it('disables Print PDF button on mobile menu when loading or errored', () => {
    assert.match(previewSource, /@if \(kind\(\) === 'pdf'\) \{\s*<button type="button" \(click\)="printDocument\(\)" \[disabled\]="loading\(\) \|\| !!error\(\)"/);
    assert.match(previewSource, /\.preview-menu-item:disabled \{\s*opacity: \.4;\s*cursor: not-allowed;\s*\}/);
    assert.match(previewSource, /printDocument\(\): void \{\s*if \(this\.loading\(\) \|\| this\.error\(\)\) return;/);
  });

  it('includes safe-area insets in preview overlay and Excel sheet tabs for mobile devices', () => {
    assert.match(previewSource, /padding-top: max\(0px, env\(safe-area-inset-top\)\)/);
    assert.match(previewSource, /padding-bottom: max\(0px, env\(safe-area-inset-bottom\)\)/);
    assert.match(excelSource, /min-height: calc\(2\.75rem \+ max\(env\(safe-area-inset-bottom\), \.5rem\)\)/);
    assert.match(excelSource, /padding-bottom: max\(env\(safe-area-inset-bottom\), \.5rem\)/);
  });

  it('keeps Escape inside an external nested dialog before applying preview close priority', () => {
    assert.match(previewSource, /event\.defaultPrevented \|\| this\.isEscapeOwnedByExternalDialog\(event\)/);
    assert.match(previewSource, /target\.closest<HTMLElement>\('\[role="dialog"\], \[role="alertdialog"\]'\)/);
    assert.match(previewSource, /owner\.getAttribute\('data-state'\) !== 'closed'/);
  });

  it('handles Escape key priority in preview modal: Excel sub-modes -> Mobile Menu -> Fullscreen -> Close', () => {
    assert.match(previewSource, /if \(this\.kind\(\) === 'excel' && this\.excelViewer\?\.handleEscape\(\)\)/);
    assert.match(previewSource, /if \(this\.mobileMenuOpen\(\)\)/);
    assert.match(previewSource, /else if \(document\.fullscreenElement\)/);
    assert.match(previewSource, /else \{\s*this\.requestClose\(\);/);
  });

  it('supports PDF.js runtime compatibility and text-layer resilience', () => {
    assert.match(pdfSource, /ensurePdfJsRuntimeCompatibility/);
    assert.match(pdfSource, /withResolvers/);
    assert.match(pdfSource, /getOrInsert/);
    assert.match(pdfSource, /getOrInsertComputed/);
  });

  it('verifies PWA service worker config pre-fetches app shell and pdfjs worker without caching Drive documents', () => {
    const config = JSON.parse(ngswConfig);
    const assetGroupNames = config.assetGroups.map((g: any) => g.name);
    assert.ok(assetGroupNames.includes('app-shell'), 'has app-shell asset group');
    assert.ok(assetGroupNames.includes('pdfjs-worker'), 'has pdfjs-worker asset group');
    assert.ok(!config.dataGroups || config.dataGroups.length === 0, 'does not declare dataGroups for Drive API');
  });
});
