export function parseMassHunterWorkbook(
  XLSX: any,
  workbook: any,
  displayRows: any[],
  resultData: any,
  decimalPlaces: number,
  checkSampleNameRaw: string,
  sheetMap: Record<string, string>,
  onUpdateRecovery?: (key: string) => void
): { r2Values: number[] } {
  const r2Values: number[] = [];

  workbook.SheetNames.forEach((sheetName: string) => {
    const cleanSheetName = sheetName.toLowerCase().replace(/[\s\-_]/g, '');
    const colKey = sheetMap[cleanSheetName];
    if (!colKey) return; 

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;

    // A. Trích xuất R2 ở ô N8 (Hàng 8, Cột N/Index 13) hoặc tìm ô chứa R2
    let r2: number | null = null;
    const cellN8 = sheet[XLSX.utils.encode_cell({ r: 7, c: 13 })];
    if (cellN8 && cellN8.v !== undefined && !isNaN(parseFloat(String(cellN8.v)))) {
      r2 = parseFloat(String(cellN8.v));
    } else {
      const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:O20');
      for (let r = range.s.r; r <= range.e.r; r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
          const cell = sheet[XLSX.utils.encode_cell({ r, c })];
          if (cell?.v && String(cell.v).trim().toUpperCase() === 'R2') {
            const nextCell = sheet[XLSX.utils.encode_cell({ r: r + 1, c })]; 
            if (nextCell && nextCell.v !== undefined && !isNaN(parseFloat(String(nextCell.v)))) {
              r2 = parseFloat(String(nextCell.v));
            }
            break;
          }
        }
        if (r2 !== null) break;
      }
    }

    if (r2 !== null) {
      r2Values.push(r2);
    }

    // B. Trích xuất các mẫu bắt đầu từ hàng 11 (Index 10)
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:AD100');
    let colSampleName = 8;
    let colFinalConc = 23;

    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellVal = String(sheet[XLSX.utils.encode_cell({ r: 9, c })]?.v || '').trim().toLowerCase();
      if (cellVal === 'sample name' || cellVal === 'sample-name') {
        colSampleName = c;
      } else if (cellVal === 'final-conc.' || cellVal === 'final conc' || cellVal === 'final conc.') {
        colFinalConc = c;
      }
    }

    for (let r = 10; r <= range.e.r; r++) {
      const sampleNameCell = sheet[XLSX.utils.encode_cell({ r, c: colSampleName })];
      const finalConcCell = sheet[XLSX.utils.encode_cell({ r, c: colFinalConc })];

      if (!sampleNameCell || sampleNameCell.v === undefined || sampleNameCell.v === null) continue;

      const excelSampleName = String(sampleNameCell.v).trim();
      const excelSampleNameLower = excelSampleName.toLowerCase();
      const finalConcStr = String(finalConcCell?.v || '').trim();
      
      let isND = false;
      let valNum: number | null = null;
      if (finalConcStr.toUpperCase() === 'N.D' || finalConcStr === '' || finalConcStr.toUpperCase() === 'ND') {
        isND = true;
      } else {
        const val = parseFloat(finalConcStr.replace(',', '.'));
        if (!isNaN(val)) {
          valNum = val;
        } else {
          isND = true;
        }
      }

      displayRows.forEach(limsRow => {
        const limsKey = limsRow.key;
        const limsType = limsRow.type;
        let isMatch = false;

        if (limsType === 'QC_BLANK') {
          isMatch = excelSampleNameLower.includes('bl') || excelSampleNameLower.includes('blank');
        } else if (limsType === 'QC_SPIKE') {
          isMatch = (excelSampleNameLower.includes('sp') || excelSampleNameLower.includes('spike')) && 
                    !excelSampleNameLower.includes('sp_') && 
                    !excelSampleNameLower.includes('spike_');
        } else if (limsType === 'QC_SPIKE_N') {
          const n = limsRow.n;
          isMatch = excelSampleNameLower.includes(`sp_${n}`) || excelSampleNameLower.includes(`spike_${n}`);
        } else if (limsType === 'QC_FINAL') {
          isMatch = excelSampleNameLower.includes('final');
        } else if (limsType === 'QC_CHECK_SAMPLE') {
          const checkSampleName = (checkSampleNameRaw || 'CHECK_SAMPLE').toLowerCase();
          isMatch = excelSampleNameLower.includes('check_sample') || 
                    excelSampleNameLower.includes('checksample') || 
                    excelSampleNameLower.includes(checkSampleName);
        } else if (limsType === 'REGULAR') {
          isMatch = excelSampleNameLower.includes(limsKey.toLowerCase());
        }

        if (isMatch) {
          if (!resultData[limsKey]) {
            resultData[limsKey] = { selected: true };
          }
          
          let cleanConc = '';
          if (isND) {
            cleanConc = (limsType === 'QC_BLANK') ? 'ND' : '';
          } else if (valNum !== null) {
            cleanConc = valNum.toFixed(decimalPlaces);
          }

          resultData[limsKey][colKey] = cleanConc;
          if (onUpdateRecovery) {
            onUpdateRecovery(limsKey);
          }
        }
      });
    }
  });

  return { r2Values };
}
