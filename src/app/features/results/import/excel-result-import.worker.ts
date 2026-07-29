/// <reference lib="webworker" />

import * as XLSX from 'xlsx';
import { parseMassHunterResultWorkbook } from './excel-result-import';

type WorkerRequest =
  | { type: 'open'; buffer: ArrayBuffer }
  | { type: 'parse'; sheetNames: string[] };

let workbookBuffer: ArrayBuffer | null = null;

addEventListener('message', ({ data }: MessageEvent<WorkerRequest>) => {
  try {
    if (data.type === 'open') {
      workbookBuffer = data.buffer;
      postMessage({ type: 'progress', percent: 32, message: 'Đang đọc danh sách sheet...' });

      const workbookIndex = XLSX.read(workbookBuffer, {
        type: 'array',
        bookSheets: true,
        cellFormula: false,
        cellHTML: false,
        cellStyles: false,
        bookDeps: false,
        bookFiles: false,
        bookVBA: false
      });
      postMessage({
        type: 'sheet-names',
        sheetNames: workbookIndex.SheetNames || []
      });
      return;
    }

    if (!workbookBuffer) {
      throw new Error('Dữ liệu Excel không còn khả dụng trong worker.');
    }

    postMessage({
      type: 'progress',
      percent: 55,
      message: `Đang đọc dữ liệu từ ${data.sheetNames.length} sheet kết quả...`
    });
    const workbook = XLSX.read(workbookBuffer, {
      type: 'array',
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
      sheets: data.sheetNames
    });

    postMessage({
      type: 'progress',
      percent: 82,
      message: 'Đang trích xuất Sample name, Final-Conc. và R²...'
    });
    const parsed = parseMassHunterResultWorkbook(XLSX, workbook);
    workbookBuffer = null;
    postMessage({ type: 'result', parsed });
  } catch (error) {
    const normalized = error instanceof Error ? error : new Error(String(error));
    workbookBuffer = null;
    postMessage({
      type: 'error',
      name: normalized.name,
      message: normalized.message
    });
  }
});
