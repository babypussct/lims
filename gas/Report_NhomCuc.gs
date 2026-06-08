

/**
 * Điền thông tin mẫu cho danh sách các phần tử cụ thể (dành cho các mẫu nhân bản)
 */
function fillNhomCucSampleForElements(elements, sopConfig, metadata, sample) {
  const sampleTargetMap = metadata.sampleTargetMap || (metadata.inputs && metadata.inputs.sampleTargetMap) || null;
  
  const isTargetAssignedForGas = function(sampleCode, colKey) {
    if (!sampleTargetMap) return true;
    
    const COMPOUND_TO_FIRESTORE_ID = {
      'Bifenthrin': 'bifenthrin',
      'CyfluthrinBaythroid': 'cyfluthrin-baythroid',
      'lamdaCyhalothrin': 'lamda-cyhalothrin',
      'Deltamethrin': 'deltamethrin',
      'Tralomethrin': 'tralomethrin',
      'Ethofenprox': 'ethofenprox',
      'PermethrinCis': 'permethrin-cis',
      'PermethrinTrans': 'permethrin-trans',
      'Fenpropathrin': 'fenpropathrin',
      'Silafluofen': 'silafluofen',
      'Flucythrinate': 'flucythrinate',
      'Fenvalerate': 'fenvalerate',
      'Cypermethrins': 'cypermethrins',
      'Tefluthrin': 'tefluthrin'
    };

    const checkAssigned = function(assignedTargetIds, cKey) {
      const targetId = COMPOUND_TO_FIRESTORE_ID[cKey] || cKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      return assignedTargetIds.some(function(tId) {
        return tId.toLowerCase().trim() === targetId.toLowerCase().trim();
      });
    };

    const subCodes = sampleCode.split(';').map(function(s) { return s.trim(); }).filter(Boolean);
    if (subCodes.length > 1) {
      return subCodes.some(function(sc) {
        const assignedTargetIds = sampleTargetMap[sc];
        if (!assignedTargetIds) return true;
        return checkAssigned(assignedTargetIds, colKey);
      });
    }

    const assignedTargetIds = sampleTargetMap[sampleCode];
    if (!assignedTargetIds) return true;
    return checkAssigned(assignedTargetIds, colKey);
  };

  const allFields = {};
  if (metadata) {
    for (const [k, v] of Object.entries(metadata)) {
      if (k !== 'samples') allFields[k] = v;
    }
  }

  const tableTextToKey = {
    'bifenthrin': 'Bifenthrin',
    'cyfluthrinbaythroid': 'CyfluthrinBaythroid',
    'lamdacyhalothrin': 'lamdaCyhalothrin',
    'deltamethrin': 'Deltamethrin',
    'tralomethrin': 'Tralomethrin',
    'ethofenprox': 'Ethofenprox',
    'permethrincis': 'PermethrinCis',
    'permethrintrans': 'PermethrinTrans',
    'fenpropathrin': 'Fenpropathrin',
    'silafluofen': 'Silafluofen',
    'flucythrinate': 'Flucythrinate',
    'fenvalerate': 'Fenvalerate',
    'cypermethrins': 'Cypermethrins',
    'tefluthrin': 'Tefluthrin'
  };

  for (const element of elements) {
      element.replaceText('{{MaSoMau}}', sample.maSoMau || '');
      
      // Chèn mã số mẫu vào ngay sau dấu hai chấm (không khớp \s* phía sau để tránh nuốt tab)
      insertTextAfterPattern(element, '1\\.\\s*Mã số mẫu\\s*:', ' ' + (sample.maSoMau || ''));

      if (sopConfig.signaturePlaceholders) {
        for (const [placeholderText, fieldName] of Object.entries(sopConfig.signaturePlaceholders)) {
          const textVal = metadata[fieldName] || '';
          if (textVal) {
            const dateOnly = textVal.split('/ ').length > 1 ? textVal.split(' /')[0].trim() : textVal.trim();
            element.replaceText(placeholderText, dateOnly);
          }
        }
      }

      if (sopConfig.checkboxLines) {
        for (const [lineText, fieldName] of Object.entries(sopConfig.checkboxLines)) {
          const isChecked = metadata[fieldName] === true;
          const checkChar = isChecked ? '☑' : '☐';
          replaceCheckboxInElementRecursive(element, lineText, checkChar);
        }
      }

      for (const [key, val] of Object.entries(allFields)) {
        if (val === true) {
          element.replaceText(`{{${key}}}`, '☑');
        } else if (val === false) {
          element.replaceText(`{{${key}}}`, '☐');
        } else {
          element.replaceText(`{{${key}}}`, val !== null && val !== undefined ? val.toString() : '');
        }
      }

      try {
        let khoiLuongVal = (sample.khoiLuong || metadata.khoiLuong || '10.0').toString().trim();
        
        if (metadata.printFormType === 'formDon' && (khoiLuongVal === '10.0' || khoiLuongVal === '10')) {
          const randDecimals = Math.floor(Math.random() * (90 - 10 + 1) + 10);
          khoiLuongVal = '10.0' + randDecimals;
        }

        let kl10Check = '☐';
        let klOtherText = '………';
        
        if (khoiLuongVal === '10.0' || khoiLuongVal === '10') {
          kl10Check = '☑';
        } else {
          klOtherText = khoiLuongVal;
        }
        
        replaceCheckboxSafely(element, 'm\\s*=\\s*[☐□☑]', kl10Check);
        if (klOtherText !== '………') {
          replaceDotsSafely(element, '10\\.0\\s*;\\s*[…\\.]+', klOtherText);
        }
        
        // Ghi đè lại placeholder {{khoiLuong}} cho Form Đơn nếu nó tồn tại (sau khi loop allFields đã chạy)
        element.replaceText('{{khoiLuong}}', khoiLuongVal);

        const loaiMauVal = (sample.loaiMau || metadata.loaiMau || 'Thuỷ sản').toString().trim();
        let isTuoi = loaiMauVal === 'Nông sản tươi';
        let isKho = loaiMauVal === 'Nông sản khô';
        let isThuySan = (loaiMauVal === 'Thuỷ sản' || loaiMauVal === 'Thủy sản');
        let isLmKhac = !isTuoi && !isKho && !isThuySan;
        let lmKhacText = isLmKhac ? loaiMauVal : '………';
        
        const tuoiCheck = isTuoi ? '☑' : '☐';
        const khoCheck = isKho ? '☑' : '☐';
        const thuySanCheck = isThuySan ? '☑' : '☐';
        const lmKhacCheck = isLmKhac ? '☑' : '☐';

        replaceCheckboxSafely(element, 'Loại mẫu:\\s*[☐□☑]', tuoiCheck);
        replaceCheckboxSafely(element, 'tươi\\s*;\\s*[☐□☑]', khoCheck);
        replaceCheckboxSafely(element, 'khô\\s*;\\s*[☐□☑]', thuySanCheck);
        replaceCheckboxSafely(element, 'sản\\s*;\\s*[☐□☑]', lmKhacCheck);
        if (isLmKhac) {
          replaceDotsSafely(element, 'Khác\\s*:\\s*[…\\.]+', lmKhacText);
        }

        const ttMauVal = (sample.tinhTrangMau || metadata.tinhTrangMau || 'Bình thường').toString().trim();
        let isBinhThuong = ttMauVal === 'Bình thường';
        let isTtKhac = !isBinhThuong;
        let ttKhacText = isTtKhac ? ttMauVal : '………';
        
        const btCheck = isBinhThuong ? '☑' : '☐';
        const ttKhacCheck = isTtKhac ? '☑' : '☐';

        replaceCheckboxSafely(element, 'Tình trạng mẫu:\\s*[☐□☑]', btCheck);
        replaceCheckboxSafely(element, 'thường\\s*;\\s*[☐□☑]', ttKhacCheck);
        if (isTtKhac) {
          replaceDotsSafely(element, 'Khác\\s*:\\s*[…\\.]+', ttKhacText);
        }

        let isPhatHien = sample.checkCoMauPhatHien === true || metadata.checkCoMauPhatHien === true;
        let isKhongPhatHien = sample.checkTatCaND === true || metadata.checkTatCaND === true;
        
        if (!isPhatHien && !isKhongPhatHien) {
          let hasAnyResult = false;
          for (const [key, val] of Object.entries(sample)) {
            if (key.indexOf('_nd') === -1 && key !== 'maSoMau' && val !== null && val !== undefined && val.toString().trim() !== '' && val.toString().trim() !== 'N/A' && val.toString().trim() !== '—') {
              hasAnyResult = true;
              break;
            }
            if (key.indexOf('_nd') !== -1 && val === true) {
              hasAnyResult = true;
              break;
            }
          }
          if (hasAnyResult) {
            isPhatHien = true;
          } else {
            isKhongPhatHien = true;
          }
        }
        
        const phCheck = isPhatHien ? '☑' : '☐';
        const kphCheck = isKhongPhatHien ? '☑' : '☐';

        replaceCheckboxSafely(element, '[☐□☑]\\s*Phát hiện', phCheck);
        replaceCheckboxSafely(element, '[☐□☑]\\s*Không phát hiện', kphCheck);

        const boSungNuocVal = (sample.checkBoSungNuoc || metadata.checkBoSungNuoc || 'không').toString().trim().toLowerCase();
        let bsNuocCo = '☐';
        let bsNuocKhong = '☐';
        if (boSungNuocVal === 'có' || boSungNuocVal === 'co') {
          bsNuocCo = '☑';
        } else {
          bsNuocKhong = '☑';
        }
        replaceCheckboxSafely(element, 'nước:\\s*[☐□☑]', bsNuocCo);
        replaceCheckboxSafely(element, 'có;\\s*[☐□☑]', bsNuocKhong);

        const hhLamSachVal = (sample.checkHonHopLamSach || metadata.checkHonHopLamSach || 'B1').toString().trim().toUpperCase();
        let hhB1 = '☐';
        let hhB2 = '☐';
        if (hhLamSachVal === 'B1') {
          hhB1 = '☑';
        } else if (hhLamSachVal === 'B2') {
          hhB2 = '☑';
        }
        replaceCheckboxSafely(element, 'hợp\\s*:\\s*[☐□☑]', hhB1);
        replaceCheckboxSafely(element, 'B1;\\s*[☐□☑]', hhB2);

        const hsplVal = (sample.heSoPhaLoang || sample.hSoPhaLoang || metadata.heSoPhaLoang || '1').toString().trim();
        let hspl1Check = '☐';
        let hsplOtherText = '………';
        if (hsplVal === '1') {
          hspl1Check = '☑';
        } else {
          hsplOtherText = hsplVal;
        }
        replaceCheckboxSafely(element, 'HSPL:\\s*[☐□☑]', hspl1Check);
        if (hsplOtherText !== '………') {
          replaceDotsSafely(element, '1\\s*;\\s*[…\\.]+', hsplOtherText);
        }
      } catch (e) {
        Logger.log('[Report NhomCuc] Lỗi điền metadata: ' + e.toString());
      }

      fillNhomCucResultsTableDirectly(element, sopConfig, sample, tableTextToKey, isTargetAssignedForGas);
      if (metadata.printFormType === 'formDon') {
        fillNhomCucTable2Directly(element, metadata);
      }
      fillNhomCucQcTableDirectly(element, sopConfig, allFields);
  }
}

/**
 * Tìm và điền Table kết quả hoạt chất
 */
function fillNhomCucResultsTableDirectly(element, sopConfig, sample, tableTextToKey, isTargetAssignedForGas) {
  let tables = [];
  if (element.getType() === DocumentApp.ElementType.TABLE) {
    tables.push(element.asTable());
  } else if (typeof element.getTables === 'function') {
    tables = element.getTables();
  }

  let resultsTable = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() >= 5) {
      const headerText = t.getRow(0).getCell(0).getText();
      if (headerText.includes("Hoạt chất")) {
        resultsTable = t;
        break;
      }
    }
  }

  if (!resultsTable) return;

  const numRows = resultsTable.getNumRows();

  const fillSide = function(row, startCellIdx, nameText) {
    const normalName = nameText.toLowerCase().replace(/[^a-z0-9]/g, '');
    const key = tableTextToKey[normalName];
    if (!key) return;

    if (!isTargetAssignedForGas(sample.maSoMau, key)) return;

    const getSampleValue = function(suffix) {
      if (sample[key + suffix] !== undefined) return sample[key + suffix];
      const searchKey = (key + suffix).toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const k in sample) {
        if (k.toLowerCase().replace(/[^a-z0-9]/g, '') === searchKey) {
          return sample[k];
        }
      }
      return undefined;
    };

    const valRaw = getSampleValue('');
    const kqRaw = (valRaw !== undefined && valRaw !== null) ? valRaw.toString().trim() : '';
    const isNd  = getSampleValue('_nd') === true;

    const kqUpper = kqRaw.toUpperCase();
    const isKphString = kqUpper === 'KPH' || (kqUpper.includes(':') && kqUpper.split(';').every(p => {
        const res = p.includes(':') ? p.split(':')[1].trim() : p.trim();
        return res === 'KPH' || res === 'ND' || res === 'N/A' || res === '—' || res === '';
    }));
    
    const isKph = kqUpper === 'ND' || kqUpper === 'N/A' || kqUpper === '—' || kqUpper === '' || isKphString;
    const kqVal = isKph ? '' : kqRaw;

    // NẾU kqRaw rỗng (isKph = true) nhưng isNd = true thì CHẮC CHẮN phải xử lý
    const isDetected = (kqVal !== '' || isNd || isKphString);
    if (!isDetected) return;

    const numCells = row.getNumCells();
    const kqCell  = (startCellIdx + 1 < numCells) ? row.getCell(startCellIdx + 1) : null;
    const qc1Cell = (startCellIdx + 2 < numCells) ? row.getCell(startCellIdx + 2) : null;
    const qc2Cell = (startCellIdx + 3 < numCells) ? row.getCell(startCellIdx + 3) : null;
    const qc3Cell = (startCellIdx + 4 < numCells) ? row.getCell(startCellIdx + 4) : null;

    try {
      if (kqCell && kqVal) {
        kqCell.replaceText('^[…\\.]{2,}', kqVal);
      }
      if (kqCell) replaceCheckboxSafely(kqCell, '[☐□☑]', isNd ? '☑' : '☐');
    } catch(e) {
      Logger.log('[fillSide kqCell NhomCuc] ' + (key || '') + ': ' + e.toString());
    }

    const fillQcCell = function(cell, qcRawVal) {
      if (!cell) return;
      const isDat      = (qcRawVal === 'Đạt'      || qcRawVal === '☑');
      const isKhongDat = (qcRawVal === 'Không đạt' || qcRawVal === '☒' || qcRawVal === 'Không Đạt');
      try {
        let found = cell.findText('[☐□☑]');
        let index = 0;
        while (found) {
          const textElement = found.getElement().asText();
          const offset = found.getStartOffset();
          
          let charToInsert = '☐';
          if (index === 0) charToInsert = isDat ? '☑' : '☐';
          if (index === 1) charToInsert = isKhongDat ? '☑' : '☐';
          
          textElement.insertText(offset, charToInsert);
          textElement.deleteText(offset + 1, offset + 1);
          
          found = cell.findText('[☐□☑]', found);
          index++;
        }
      } catch(e) {
        Logger.log('[fillQcCell NhomCuc] ' + e.toString());
      }
    };

    fillQcCell(qc1Cell, getSampleValue('_qc1') || '');
    fillQcCell(qc2Cell, getSampleValue('_qc2') || '');
    fillQcCell(qc3Cell, getSampleValue('_qc3') || '');
  };

  for (let r = 2; r < numRows; r++) {
    const row = resultsTable.getRow(r);
    const numCells = row.getNumCells();
    
    if (numCells > 0) {
      let offset = 0;
      let leftName = row.getCell(0).getText().trim();
      if (/^\d+$/.test(leftName) && numCells > 1) {
        leftName = row.getCell(1).getText().trim();
        offset = 1;
      }
      if (leftName) fillSide(row, offset, leftName);
    }
    
    let rightOffset = 5;
    if (numCells > rightOffset) {
      let rightName = row.getCell(rightOffset).getText().trim();
      if (/^\d+$/.test(rightName) && numCells > rightOffset + 1) {
        rightName = row.getCell(rightOffset + 1).getText().trim();
        rightOffset += 1;
      }
      if (rightName) fillSide(row, rightOffset, rightName);
    }
  }
}

/**
 * Điền Table 2 (Nồng độ các điểm chuẩn)
 */
function fillNhomCucTable2Directly(element, metadata) {
  let tables = [];
  if (element.getType() === DocumentApp.ElementType.TABLE) {
    tables.push(element.asTable());
  } else if (typeof element.getTables === 'function') {
    tables = element.getTables();
  }

  let calTable2 = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() >= 6 && t.getNumRows() <= 9) {
      const headerText = t.getRow(0).getText();
      if (headerText.includes("Điểm chuẩn") || headerText.includes("Chuẩn")) {
        calTable2 = t;
        break;
      }
    }
  }

  if (calTable2 && metadata.calibPoints) {
    const calibPoints = metadata.calibPoints || [];
    const maxPoints = Math.min(calibPoints.length, calTable2.getNumRows() - 1);
    for (let i = 0; i < maxPoints; i++) {
      const rowIdx = i + 1;
      const row = calTable2.getRow(rowIdx);
      const pt = calibPoints[i];
      setCellText(row, 1, pt.loSo || '', null, 9);
      setCellText(row, 2, pt.hamLuong || '', null, 9);
    }
  }
}

/**
 * Xử lý đánh dấu Đạt/Không đạt/NA cho bảng QC của từng mẫu (Table 3)
 */
function fillNhomCucQcTableDirectly(element, sopConfig, allFields) {
  let tables = [];
  if (element.getType() === DocumentApp.ElementType.TABLE) {
    tables.push(element.asTable());
  } else if (typeof element.getTables === 'function') {
    tables = element.getTables();
  }
  
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() >= 5 && t.getRow(0).getCell(0).getText().includes("Thông số đánh giá")) {
      const checkboxLines = sopConfig.checkboxLines;
      if (checkboxLines) {
        const numRows = t.getNumRows();
        for (let r = 1; r < numRows; r++) {
          const row = t.getRow(r);
          const labelText = row.getCell(0).getText().trim();
          
          let fieldName = null;
          for (const [keyText, fName] of Object.entries(checkboxLines)) {
            if (labelText.includes(keyText) || keyText.includes(labelText)) {
              fieldName = fName;
              break;
            }
          }

          if (fieldName && allFields[fieldName] !== undefined) {
            const val = allFields[fieldName];
            const evalCell = row.getCell(2);
            
            let datCheck, khongDatCheck, naCheck;
            if (val === true) {
              datCheck = "☑ Đạt";
              khongDatCheck = "☐ Không đạt";
              naCheck = "☐ N/A";
            } else if (val === false) {
              datCheck = "☐ Đạt";
              khongDatCheck = "☑ Không đạt";
              naCheck = "☐ N/A";
            } else {
              datCheck = "☐ Đạt";
              khongDatCheck = "☐ Không đạt";
              naCheck = "☑ N/A";
            }

            evalCell.replaceText('[\\[\\(] ?[\\]\\)] Đạt', datCheck);
            evalCell.replaceText('[☐□☑] Đạt', datCheck);

            evalCell.replaceText('[\\[\\(] ?[\\]\\)] Không đạt', khongDatCheck);
            evalCell.replaceText('[☐□☑] Không đạt', khongDatCheck);

            evalCell.replaceText('[\\[\\(] ?[\\]\\)] N/A', naCheck);
            evalCell.replaceText('[☐□☑] N/A', naCheck);
          }
        }
      }
    }
  }
}

/**
 * Điền thông tin vào Section 2 (Calibration table & Sample prep table)
 */
function fillNhomCucSection2(elements, sopConfig, metadata, compoundName, samples) {
  let tables = [];
  for (const element of elements) {
    if (element.getType() === DocumentApp.ElementType.TABLE) {
      tables.push(element.asTable());
    } else if (typeof element.getTables === 'function') {
      const tbls = element.getTables();
      for (let j = 0; j < tbls.length; j++) {
        tables.push(tbls[j]);
      }
    }
  }

  // 1. Điền bảng đường chuẩn Table 7
  let calibTable = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() === 8 || t.getNumRows() === 7) {
      const headerText = t.getRow(0).getText();
      if (headerText.includes("Chuẩn") && (headerText.includes("vial") || headerText.includes("Vial"))) {
        calibTable = t;
        break;
      }
    }
  }

  if (calibTable) {
    const calibPoints = metadata.calibPoints || [];
    const fSize = sopConfig.defaultFontSize || 13;
    const numRows = calibTable.getNumRows();
    const dataRows = numRows - 2; // Subtract header and R2 rows
    for (let i = 0; i < dataRows; i++) {
      const rowIdx = i + 1;
      const row = calibTable.getRow(rowIdx);
      if (i < calibPoints.length) {
        setCellText(row, 0, `C${i}`, null, fSize);
        const pt = calibPoints[i];
        setCellText(row, 1, pt.loSo || '', null, fSize);
        setCellText(row, 2, pt.hamLuong || '', null, fSize);
      } else {
        setCellText(row, 0, '', null, fSize);
        setCellText(row, 1, '', null, fSize);
        setCellText(row, 2, '', null, fSize);
      }
    }
    const r2Val = metadata.r2 || '';
    setCellText(calibTable.getRow(numRows - 1), 1, r2Val, null, fSize);
  }

  // Helper inside function to map compound to backend key
  function mapCompoundToKey(cName) {
    const directMap = {
      'Bifenthrin': 'Bifenthrin',
      'CyfluthrinBaythroid': 'CyfluthrinBaythroid',
      'lamdaCyhalothrin': 'lamdaCyhalothrin',
      'Deltamethrin': 'Deltamethrin',
      'Tralomethrin': 'Tralomethrin',
      'Ethofenprox': 'Ethofenprox',
      'PermethrinCis': 'PermethrinCis',
      'PermethrinTrans': 'PermethrinTrans',
      'Fenpropathrin': 'Fenpropathrin',
      'Silafluofen': 'Silafluofen',
      'Flucythrinate': 'Flucythrinate',
      'Fenvalerate': 'Fenvalerate',
      'Cypermethrins': 'Cypermethrins',
      'Tefluthrin': 'Tefluthrin'
    };
    const normalized = cName.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [k, v] of Object.entries(directMap)) {
      if (k.toLowerCase() === normalized) return v;
    }
    return cName;
  }

  // 2. Điền bảng chuẩn bị mẫu Table 8
  let prepTable = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() === 19 || (t.getNumRows() >= 10 && t.getRow(0).getText().includes("Hệ số pha loãng F"))) {
      prepTable = t;
      break;
    }
  }

  if (prepTable) {
    const runSamplesList = metadata.runSamplesList || [];
    const isDon = metadata.printFormType === 'formDon';
    const totalRows = prepTable.getNumRows();
    const numDataRows = totalRows - 1;
    
    const fSize = sopConfig.defaultFontSize || 13;
    for (let i = 0; i < numDataRows; i++) {
      const rowIdx = i + 1;
      const row = prepTable.getRow(rowIdx);
      if (i < runSamplesList.length) {
        const s = runSamplesList[i];
        
        let cell4Text = '';
        let cell5Text = '';
        if (isDon) {
          let resVal = 'ND';
          if (s.compoundResults && compoundName) {
            resVal = s.compoundResults[compoundName] || 'ND';
          }
          let noteVal = '';
          if (s.compoundNotes && compoundName) {
            noteVal = (s.compoundNotes[compoundName] || '').trim();
          }
          if (noteVal) {
            if (!noteVal.startsWith('(') || !noteVal.endsWith(')')) {
              noteVal = `(${noteVal})`;
            }
            cell4Text = resVal ? `${resVal} ${noteVal}` : noteVal;
          } else {
            cell4Text = resVal;
          }
          cell5Text = '';
        } else {
          cell4Text = s.checkBoSungNuoc || 'không';
          cell5Text = s.checkHonHopLamSach || 'B1';
        }

        setCellText(row, 0, s.maSoMau || '', null, fSize);
        setCellText(row, 1, s.khoiLuong || '10.0', null, fSize);
        setCellText(row, 2, s.heSoPhaLoang || '1', null, fSize);
        setCellText(row, 3, s.loSo || '', null, fSize);
        if (row.getNumCells() > 4) {
          setCellText(row, 4, cell4Text, null, fSize);
        }
        if (row.getNumCells() > 5) {
          setCellText(row, 5, cell5Text, null, fSize);
        }
      } else {
        setCellText(row, 0, '', null, fSize);
        setCellText(row, 1, '', null, fSize);
        setCellText(row, 2, '', null, fSize);
        setCellText(row, 3, '', null, fSize);
        if (row.getNumCells() > 4) {
          setCellText(row, 4, '', null, fSize);
        }
        if (row.getNumCells() > 5) {
          setCellText(row, 5, '', null, fSize);
        }
      }
    }
    
    if (runSamplesList.length > numDataRows) {
      for (let i = numDataRows; i < runSamplesList.length; i++) {
        const s = runSamplesList[i];
        const newRow = prepTable.copy().getRow(numDataRows).copy();
        prepTable.appendRow(newRow);
        const row = prepTable.getRow(i + 1);
        
        let cell4Text = '';
        let cell5Text = '';
        if (isDon) {
          let resVal = 'ND';
          if (s.compoundResults && compoundName) {
            resVal = s.compoundResults[compoundName] || 'ND';
          }
          let noteVal = '';
          if (s.compoundNotes && compoundName) {
            noteVal = (s.compoundNotes[compoundName] || '').trim();
          }
          if (noteVal) {
            if (!noteVal.startsWith('(') || !noteVal.endsWith(')')) {
              noteVal = `(${noteVal})`;
            }
            cell4Text = resVal ? `${resVal} ${noteVal}` : noteVal;
          } else {
            cell4Text = resVal;
          }
          cell5Text = '';
        } else {
          cell4Text = s.checkBoSungNuoc || 'không';
          cell5Text = s.checkHonHopLamSach || 'B1';
        }

        setCellText(row, 0, s.maSoMau || '', null, fSize);
        setCellText(row, 1, s.khoiLuong || '10.0', null, fSize);
        setCellText(row, 2, s.heSoPhaLoang || '1', null, fSize);
        setCellText(row, 3, s.loSo || '', null, fSize);
        if (row.getNumCells() > 4) {
          setCellText(row, 4, cell4Text, null, fSize);
        }
        if (row.getNumCells() > 5) {
          setCellText(row, 5, cell5Text, null, fSize);
        }
      }
    }
  }
}

/**
 * Xóa PageBreak thừa ở cuối tài liệu
 */
function cleanNhomCucLastPageBreak(body) {
  try {
    const numChildren = body.getNumChildren();
    if (numChildren > 0) {
      const lastChild = body.getChild(numChildren - 1);
      if (lastChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
        body.removeChild(lastChild);
        Logger.log("[Autocut NhomCuc] Đã xóa PageBreak thừa cuối tài liệu.");
      }
    }
  } catch(e) {
    Logger.log(`[Autocut NhomCuc] Lỗi dọn dẹp PageBreak: ${e.toString()}`);
  }
}
