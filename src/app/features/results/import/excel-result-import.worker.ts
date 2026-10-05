/// <reference lib="webworker" />

import * as XLSX from 'xlsx';
import { SAFE_XLSX_IMPORT_READ_OPTIONS } from '../../../shared/utils/spreadsheet-file-security';
import { parseMassHunterResultWorkbook } from './excel-result-import';
import {
  XlsxStripResult,
  describeStrippedEntries,
  readWithStrippedFallback,
  stripXlsxMedia
} from './xlsx-media-stripper';

type WorkerRequest =
  | { type: 'open'; buffer: ArrayBuffer }
  | { type: 'parse'; sheetNames: string[] };

let originalBuffer: ArrayBuffer | null = null;
let stripped: XlsxStripResult | null = null;

function reset(): void {
  originalBuffer = null;
  stripped = null;
}

addEventListener('message', ({ data }: MessageEvent<WorkerRequest>) => {
  try {
    if (data.type === 'open') {
      postMessage({ type: 'progress', percent: 28, message: 'Đang lược bỏ hình sắc ký đồ và thành phần đính kèm...' });
      originalBuffer = data.buffer;
      stripped = stripXlsxMedia(data.buffer);
      postMessage({
        type: 'progress',
        percent: 32,
        message: stripped.strippedEntries > 0
          ? `${describeStrippedEntries(stripped.strippedEntries)}; đang đọc danh sách trang tính...`
          : 'Đang đọc danh sách trang tính...'
      });

      const workbookIndex = readWithStrippedFallback(originalBuffer, stripped, buffer =>
        XLSX.read(buffer, { ...SAFE_XLSX_IMPORT_READ_OPTIONS, bookSheets: true })
      );
      postMessage({
        type: 'sheet-names',
        sheetNames: workbookIndex.SheetNames || []
      });
      return;
    }

    if (!originalBuffer || !stripped) {
      throw new Error('Dữ liệu Excel không còn khả dụng để tiếp tục xử lý.');
    }

    postMessage({
      type: 'progress',
      percent: 55,
      message: `Đang đọc dữ liệu từ ${data.sheetNames.length} trang tính kết quả...`
    });
    const sheetNames = data.sheetNames;
    const parsed = readWithStrippedFallback(originalBuffer, stripped, buffer => {
      const workbook = XLSX.read(buffer, {
        ...SAFE_XLSX_IMPORT_READ_OPTIONS,
        cellText: true,
        sheets: sheetNames
      });
      postMessage({
        type: 'progress',
        percent: 82,
        message: 'Đang trích xuất Sample name, Final-Conc. và R²...'
      });
      return parseMassHunterResultWorkbook(XLSX, workbook);
    });
    reset();
    postMessage({ type: 'result', parsed });
  } catch (error) {
    const normalized = error instanceof Error ? error : new Error(String(error));
    reset();
    postMessage({
      type: 'error',
      name: normalized.name,
      message: normalized.message
    });
  }
});
