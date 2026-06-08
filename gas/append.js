
/**
 * Tu dong nhan dien va dien Bang Duong Chuan & Bang Ket Qua cho Form Don cua SOP Type 3B
 */
function _fillFormDonTablesDynamically(pageElements, metadata, samples, compoundName, sopConfig) {
  let tables = [];
  for (const element of pageElements) {
    if (element.getType() === DocumentApp.ElementType.TABLE) {
      tables.push(element.asTable());
    } else if (typeof element.getTables === 'function') {
      tables = tables.concat(element.getTables());
    }
  }

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const numRows = table.getNumRows();
    if (numRows < 2) continue;
    
    const headerRowText = table.getRow(0).getText().toLowerCase();
    
    // 1. Nhan dien Bang Duong Chuan (ASCII-only matching)
    let isCalib = headerRowText.includes('vial') && (headerRowText.includes('ml') || headerRowText.includes('ng/ml'));
    if (!isCalib && numRows >= 5) {
      const lastRowText = table.getRow(numRows - 1).getText().toLowerCase();
      if (lastRowText.includes('r2') || lastRowText.includes('r2')) isCalib = true;
    }
    
    if (isCalib) {
      Logger.log('[FormDon-Type3B] Found Calibration Table for ' + compoundName);
      const calibPoints = metadata.calibPoints || [];
      const hRow = table.getRow(0);
      let loSoCol = -1, vialCol = -1, kqCol = -1, areaCol = -1;
      
      for (let c = 0; c < hRow.getNumCells(); c++) {
        const txt = hRow.getCell(c).getText().toLowerCase();
        if (c === 0) loSoCol = c;
        if (txt.includes('vial')) vialCol = c;
        if (txt.includes('ml')) kqCol = c;
        if (txt.includes('area')) areaCol = c;
      }
      
      if (loSoCol === -1) loSoCol = 0;
      if (vialCol === -1) vialCol = 1;
      if (kqCol === -1) kqCol = 2;
      
      for (let ptIdx = 0; ptIdx < Math.min(calibPoints.length, numRows - 2); ptIdx++) {
        const pt = calibPoints[ptIdx] || {};
        const row = table.getRow(ptIdx + 1);
        try {
          if (loSoCol >= 0 && loSoCol < row.getNumCells()) setCellText(row, loSoCol, (pt.loSo || pt.vialNo || '').toString(), null, sopConfig.defaultFontSize);
          if (vialCol >= 0 && vialCol < row.getNumCells()) setCellText(row, vialCol, (pt.vialNo || pt.loSo || '').toString(), null, sopConfig.defaultFontSize);
          if (kqCol >= 0 && kqCol < row.getNumCells()) setCellText(row, kqCol, (pt.hamLuong || '').toString(), null, sopConfig.defaultFontSize);
          if (areaCol >= 0 && areaCol < row.getNumCells()) setCellText(row, areaCol, (pt.dienTich || pt.area || '').toString(), null, sopConfig.defaultFontSize);
        } catch(e) {}
      }
      
      for (let r = numRows - 2; r < numRows; r++) {
        const text = table.getRow(r).getText().toLowerCase();
        if (text.includes('r2')) {
          const row = table.getRow(r);
          try {
            setCellText(row, row.getNumCells() - 1, (metadata.r2 || '').toString(), null, sopConfig.defaultFontSize);
          } catch(e) {}
        }
      }
      continue;
    }
    
    // 2. Nhan dien Bang Ket Qua (ASCII-only matching)
    let isResultTable = headerRowText.includes('vial') && headerRowText.includes('(g)');
    if (isResultTable) {
      Logger.log('[FormDon-Type3B] Found Results Table for ' + compoundName);
      
      const hRow = table.getRow(0);
      let maSoMauCol = -1, khoiLuongCol = -1, fCol = -1, loSoCol = -1, kqCol = -1;
      for (let c = 0; c < hRow.getNumCells(); c++) {
        const txt = hRow.getCell(c).getText().toLowerCase();
        if (c === 0) maSoMauCol = c;
        if (txt.includes('(g)') && !txt.includes('g/g')) khoiLuongCol = c;
        if (txt.includes(' f') || txt.endsWith('f') || txt === 'f') fCol = c;
        if (txt.includes('vial') || txt.includes('batch')) loSoCol = c;
        if (txt.includes('g/g')) kqCol = c;
      }
      
      if (maSoMauCol === -1) maSoMauCol = 0;
      if (khoiLuongCol === -1) khoiLuongCol = 1;
      if (fCol === -1) fCol = 2;
      if (loSoCol === -1) loSoCol = 3;
      if (kqCol === -1) kqCol = 4;
      
      const backendKey = (compoundName || '').replace(/[^a-zA-Z0-9_]/g, '');
      let rowIdx = 1;
      for (let sIdx = 0; sIdx < samples.length; sIdx++) {
        const sample = samples[sIdx];
        let row;
        if (rowIdx < table.getNumRows()) {
          row = table.getRow(rowIdx);
        } else {
          const templateRow = table.getRow(table.getNumRows() - 1);
          row = table.appendTableRow(templateRow.copy());
        }
        
        let kqVal = '';
        if (sample.compoundResults && sample.compoundResults[backendKey] !== undefined) {
          kqVal = sample.compoundResults[backendKey];
        } else if (sample.compoundResults && sample.compoundResults[compoundName] !== undefined) {
          kqVal = sample.compoundResults[compoundName];
        } else {
          kqVal = sample[compoundName] || sample.kq || 'KPH';
        }
        if (kqVal === 'N/A' || kqVal === '') kqVal = 'KPH';
        
        try {
          const chunkSize = sopConfig.maSoMauChunkSize || 0;
          if (maSoMauCol >= 0 && maSoMauCol < row.getNumCells()) setCellText(row, maSoMauCol, (sample.maSoMau || '').toString(), chunkSize, sopConfig.defaultFontSize);
          if (khoiLuongCol >= 0 && khoiLuongCol < row.getNumCells()) setCellText(row, khoiLuongCol, (sample.khoiLuong || '10.0').toString(), null, sopConfig.defaultFontSize);
          if (fCol >= 0 && fCol < row.getNumCells()) setCellText(row, fCol, (sample.heSoPhaLoang || sample.hSoPhaLoang || '1').toString(), null, sopConfig.defaultFontSize);
          if (loSoCol >= 0 && loSoCol < row.getNumCells()) setCellText(row, loSoCol, (sample.loSo || '').toString(), null, sopConfig.defaultFontSize);
          if (kqCol >= 0 && kqCol < row.getNumCells()) setCellText(row, kqCol, (kqVal || '').toString(), null, sopConfig.defaultFontSize);
        } catch(e) {}
        
        rowIdx++;
      }
    }
  }
}

