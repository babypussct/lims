/// <reference lib="webworker" />

import * as XLSX from 'xlsx';

interface StandardImportWorkerRequest {
  buffer: ArrayBuffer;
  sheetName?: string;
}

addEventListener('message', ({ data }: MessageEvent<StandardImportWorkerRequest>) => {
  try {
    const workbook = XLSX.read(data.buffer, { type: 'array', cellDates: false });
    const sheetNames = workbook.SheetNames.filter(name => {
      const range = workbook.Sheets[name]?.['!ref'];
      return Boolean(range);
    });
    if (!sheetNames.length) throw new Error('Workbook không có sheet dữ liệu.');
    const selectedSheet = data.sheetName && sheetNames.includes(data.sheetName)
      ? data.sheetName
      : sheetNames[0];
    const worksheet = workbook.Sheets[selectedSheet];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: '',
      raw: false
    });
    postMessage({ sheetNames, selectedSheet, rows });
  } catch (error) {
    postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
});
