export function navigateGrid(
  event: KeyboardEvent,
  rowIdx: number,
  colIdx: number,
  columnsList: string[],
  rowsLength: number,
  minColIdx = 0
) {
  const key = event.key;
  let targetRowIdx = rowIdx;
  let targetColIdx = colIdx;

  if (key === 'ArrowUp') {
    targetRowIdx = Math.max(0, rowIdx - 1);
    event.preventDefault();
  } else if (key === 'ArrowDown') {
    targetRowIdx = Math.min(rowsLength - 1, rowIdx + 1);
    event.preventDefault();
  } else if (key === 'ArrowLeft') {
    targetColIdx = Math.max(minColIdx, colIdx - 1);
  } else if (key === 'ArrowRight') {
    targetColIdx = Math.min(columnsList.length - 1, colIdx + 1);
  } else {
    return;
  }

  const targetColName = columnsList[targetColIdx];
  setTimeout(() => {
    const el = document.getElementById(`cell-${targetRowIdx}-${targetColName}`);
    if (el) {
      el.focus();
      if (el instanceof HTMLInputElement) {
        el.select();
      }
    }
  }, 10);
}

export function bulkFillND(resultData: any, sampleList: string[], activeColumns: string[], onUpdateRecovery?: (key: string) => void) {
  if (!resultData) return;

  // Điền các mẫu thường
  (sampleList || []).forEach((sampleCode) => {
    const row = resultData[sampleCode];
    if (row) {
      activeColumns.forEach(col => {
        if (!row[col] || row[col].toString().trim() === '') {
          row[col] = 'ND';
        }
      });
    }
  });

  // Điền các mẫu QC
  Object.keys(resultData).forEach(key => {
    if (key.startsWith('QC_')) {
      const row = resultData[key];
      if (row) {
        activeColumns.forEach(col => {
          if (!row[col] || row[col].toString().trim() === '') {
            row[col] = 'ND';
          }
        });
        if (onUpdateRecovery) {
          onUpdateRecovery(key);
        }
      }
    }
  });
}

export function bulkClearAll(resultData: any, sampleList: string[], activeColumns: string[]) {
  if (!resultData) return;

  (sampleList || []).forEach((sampleCode) => {
    const row = resultData[sampleCode];
    if (row) {
      activeColumns.forEach(col => {
        row[col] = '';
      });
      row['ghiChu'] = '';
    }
  });

  Object.keys(resultData).forEach(key => {
    if (key.startsWith('QC_')) {
      const row = resultData[key];
      if (row) {
        activeColumns.forEach(col => {
          row[col] = '';
        });
        row['ghiChu'] = '';
      }
    }
  });
}

export function copyRowToAll(
  resultData: any, 
  sampleList: string[], 
  activeColumns: string[], 
  sourceKey: string, 
  onUpdateRecovery?: (key: string) => void
) {
  if (!resultData) return;
  const source = resultData[sourceKey];
  if (!source) return;

  (sampleList || []).forEach((targetKey: string) => {
    if (targetKey !== sourceKey) {
      if (!resultData[targetKey]) {
        resultData[targetKey] = { selected: true };
      }
      activeColumns.forEach(col => {
        resultData[targetKey][col] = source[col];
      });
      if (onUpdateRecovery) {
        onUpdateRecovery(targetKey);
      }
    }
  });
}
