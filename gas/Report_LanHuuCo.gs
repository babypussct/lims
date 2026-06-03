/**
 * Custom Report Generator for Nhóm Lân Hữu Cơ (SOP: lan-huu-co)
 * =========================================================================
 * Tự động nhân bản các trang kết quả (Section 1) theo từng mẫu thử
 * và giữ duy nhất một trang thông số chạy & đường chuẩn (Section 2) ở cuối.
 */

function generateCustomReport_lan_huu_co(templateId, metadata, samples, folder, fileName, version) {
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = templateFile.makeCopy(fileName, folder);
  const docId = newFile.getId();
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  // 1. Định vị và chia tách Section 1 & Section 2
  let sec2Idx = -1;
  const numChildren = body.getNumChildren();
  for (let i = 0; i < numChildren; i++) {
    const child = body.getChild(i);
    if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
      const text = child.asParagraph().getText().trim();
      if (text.includes("XÁC ĐỊNH DƯ LƯỢNG") && !text.includes("KẾT QUẢ")) {
        sec2Idx = i;
        break;
      }
    }
  }

  if (sec2Idx === -1) {
    // Fallback nếu không tìm thấy paragraph tiêu đề của Section 2
    Logger.log("[LanHuuCoCustom] CẢNH BÁO: Không tìm thấy tiêu đề của Section 2. Đặt fallback tại 214.");
    sec2Idx = 214;
  }

  // Clone Section 2 children
  const sec2Children = [];
  for (let i = sec2Idx; i < numChildren; i++) {
    sec2Children.push(body.getChild(i).copy());
  }

  // Xóa Section 2 ra khỏi body tạm thời
  for (let i = numChildren - 1; i >= sec2Idx; i--) {
    body.removeChild(body.getChild(i));
  }

  // Lấy danh sách children của Section 1 để nhân bản
  const sec1NumChildren = body.getNumChildren();
  const sec1Children = [];
  for (let i = 0; i < sec1NumChildren; i++) {
    sec1Children.push(body.getChild(i).copy());
  }

  const sopConfig = CONFIG.SOP_CONFIG['lan-huu-co'];

  // 2. Nhân bản Section 1 cho từng mẫu
  if (samples.length > 0) {
    fillLanHuuCoSample(body, sopConfig, metadata, samples[0]);
  }

  for (let s = 1; s < samples.length; s++) {
    body.appendPageBreak();
    const tempContainer = [];
    for (let i = 0; i < sec1Children.length; i++) {
      const cloned = sec1Children[i].copy();
      const type = cloned.getType();
      let appended = null;
      if (type === DocumentApp.ElementType.PARAGRAPH) {
        appended = body.appendParagraph(cloned.asParagraph());
      } else if (type === DocumentApp.ElementType.TABLE) {
        appended = body.appendTable(cloned.asTable());
      } else if (type === DocumentApp.ElementType.LIST_ITEM) {
        appended = body.appendListItem(cloned.asListItem());
      }
      if (appended) tempContainer.push(appended);
    }
    fillLanHuuCoSampleForElements(tempContainer, sopConfig, metadata, samples[s]);
  }

  // 3. Ghép Section 2 vào cuối tài liệu
  body.appendPageBreak();
  const sec2Container = [];
  for (let i = 0; i < sec2Children.length; i++) {
    const cloned = sec2Children[i].copy();
    const type = cloned.getType();
    let appended = null;
    if (type === DocumentApp.ElementType.PARAGRAPH) {
      appended = body.appendParagraph(cloned.asParagraph());
    } else if (type === DocumentApp.ElementType.TABLE) {
      appended = body.appendTable(cloned.asTable());
    } else if (type === DocumentApp.ElementType.LIST_ITEM) {
      appended = body.appendListItem(cloned.asListItem());
    }
    if (appended) sec2Container.push(appended);
  }

  // Điền dữ liệu vào Section 2
  fillLanHuuCoSection2(sec2Container, sopConfig, metadata);

  // Tự động thu dọn PageBreak thừa cuối tài liệu nếu có
  cleanLanHuuCoLastPageBreak(body);

  // Lưu doc
  doc.saveAndClose();

  // Xuất file PDF
  const pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
  const pdfName = fileName + '.pdf';
  const pdfFile = folder.createFile(pdfBlob).setName(pdfName);

  const pdfUrl     = pdfFile.getUrl();
  const docsUrl    = `https://docs.google.com/document/d/${docId}/edit`;
  const pdfViewUrl = pdfFile.getDownloadUrl();

  Logger.log(`[LanHuuCoCustom] Báo cáo Lân hữu cơ tạo thành công: ${fileName}`);

  return {
    docId,
    pdfId:       pdfFile.getId(),
    docsUrl,
    pdfUrl,
    pdfViewUrl,
    fileName,
    createdAt:   new Date().toISOString(),
  };
}

/**
 * Điền thông tin Section 1 (cấp body chính) cho mẫu đầu tiên
 */
function fillLanHuuCoSample(body, sopConfig, metadata, sample) {
  // Bản chất body cũng là một danh sách phần tử, duyệt qua và gọi helper
  const numChildren = body.getNumChildren();
  const elements = [];
  for (let i = 0; i < numChildren; i++) {
    elements.push(body.getChild(i));
  }
  fillLanHuuCoSampleForElements(elements, sopConfig, metadata, sample);
}

/**
 * Điền thông tin mẫu cho danh sách các phần tử cụ thể (dành cho các mẫu nhân bản)
 */
function fillLanHuuCoSampleForElements(elements, sopConfig, metadata, sample) {
  const sampleTargetMap = metadata.sampleTargetMap || (metadata.inputs && metadata.inputs.sampleTargetMap) || null;
  
  const isTargetAssignedForGas = function(sampleCode, colKey) {
    if (!sampleTargetMap) return true;
    
    // Bản đồ chuẩn hóa Backend Key sang Firestore Target ID của Lân hữu cơ
    const COMPOUND_TO_FIRESTORE_ID = {
      'Acephate': 'acephate',
      'AzinphosMethyl': 'azinphos-methyl',
      'Cadusafos': 'cadusafos',
      'Chlorpyrifos': 'chlorpyrifos',
      'ChlorpyrifosMethyl': 'chlorpyrifos-methyl',
      'Diazinon': 'diazinon',
      'Dimethoate': 'dimethoate',
      'Edifenphos': 'edifenphos',
      'Ethion': 'ethion',
      'Ethoprophos': 'ethoprophos',
      'Fenitrothion': 'fenitrothion',
      'Fenthion': 'fenthion',
      'Fipronil': 'fipronil',
      'FipronilSulfide': 'fipronil-sulfide',
      'FipronilSulfone': 'fipronil-solid', // Firestore standard ID
      'FipronilDesulfinyl': 'fipronil-desulfinyl',
      'Iprobenfos': 'iprobenfos',
      'Malathion': 'malathion',
      'Mefenoxam': 'mefenoxam',
      'Metalaxyl': 'metalaxyl',
      'Methacrifos': 'methacrifos',
      'Methidathion': 'methidathion',
      'Monocrotophos': 'monocrotophos',
      'Omethoate': 'omethoate',
      'Parathion': 'parathion',
      'ParathionMethyl': 'parathion-methyl',
      'Phenthoate': 'phenthoate',
      'Phorate': 'phorate',
      'Phosmet': 'phosmet',
      'Phosphamidon': 'phosphamidon',
      'PirimiphosMethyl': 'pirimiphos-methyl',
      'Profenofos': 'profenofos',
      'Quinalphos': 'quinalphos',
      'Ronnel': 'ronnel',
      'Triazophos': 'triazophos',
      'Vamidothion': 'vamidothion',
      'Chlorfenvinphos': 'chlorfenvinphos',
      'IsofenphosMethyl': 'isofenphos-methyl'
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

  // Chuẩn bị toàn bộ fields thay thế dạng {{fieldName}}
  const allFields = {};
  if (metadata) {
    for (const [k, v] of Object.entries(metadata)) {
      if (k !== 'samples') allFields[k] = v;
    }
  }

  const tableTextToKey = {
    'acephate': 'Acephate',
    'azinphosmethyl': 'AzinphosMethyl',
    'cadusafos': 'Cadusafos',
    'chlorpyrofos': 'Chlorpyrifos',
    'chlorpyrifos': 'Chlorpyrifos',
    'chlorpyrifosmethyl': 'ChlorpyrifosMethyl',
    'diazinon': 'Diazinon',
    'dimethoate': 'Dimethoate',
    'edifenfos': 'Edifenphos',
    'edifenphos': 'Edifenphos',
    'ethion': 'Ethion',
    'ethoprofosethoprop': 'Ethoprophos',
    'ethoprophos': 'Ethoprophos',
    'fenitrothion': 'Fenitrothion',
    'fenthion': 'Fenthion',
    'fipronil': 'Fipronil',
    'fipronilsulfone': 'FipronilSulfone',
    'fipronilsulfide': 'FipronilSulfide',
    'fipronildesulfinyl': 'FipronilDesulfinyl',
    'iprobenfos': 'Iprobenfos',
    'malathion': 'Malathion',
    'mefenoxam': 'Mefenoxam',
    'metalaxyl': 'Metalaxyl',
    'methacrifos': 'Methacrifos',
    'methidathion': 'Methidathion',
    'monocrotophos': 'Monocrotophos',
    'omethoate': 'Omethoate',
    'parathion': 'Parathion',
    'parathionmethyl': 'ParathionMethyl',
    'phenthoate': 'Phenthoate',
    'phorate': 'Phorate',
    'phosmet': 'Phosmet',
    'phosphamidon': 'Phosphamidon',
    'pirimiphosmethyl': 'PirimiphosMethyl',
    'profenofos': 'Profenofos',
    'quinalphos': 'Quinalphos',
    'ronnelfenchlorphos': 'Ronnel',
    'ronnel': 'Ronnel',
    'triazophos': 'Triazophos',
    'vamidothion': 'Vamidothion',
    'chlorfenvinphos': 'Chlorfenvinphos',
    'isofenphosmethyl': 'IsofenphosMethyl'
  };

  for (const element of elements) {
    // 1. Thay thế thông tin mã số mẫu cơ bản
    element.replaceText('{{MaSoMau}}', sample.maSoMau || '');
    element.replaceText('1. Mã số mẫu:', '1. Mã số mẫu:  ' + (sample.maSoMau || ''));

    // 2. Thay thế chữ ký và ngày tháng
    if (sopConfig.signaturePlaceholders) {
      for (const [placeholderText, fieldName] of Object.entries(sopConfig.signaturePlaceholders)) {
        const textVal = metadata[fieldName] || '';
        if (textVal) {
          const dateOnly = textVal.split('/ ').length > 1 ? textVal.split(' /')[0].trim() : textVal.trim();
          element.replaceText(placeholderText, dateOnly);
        }
      }
    }

    // 3. Thay thế các dòng checkLines dạng [ ] hoặc ☐
    if (sopConfig.checkboxLines) {
      for (const [lineText, fieldName] of Object.entries(sopConfig.checkboxLines)) {
        const isChecked = metadata[fieldName] === true;
        const checkChar = isChecked ? '☑' : '☐';
        replaceCheckboxInElementRecursive(element, lineText, checkChar);
      }
    }

    // 4. Thay thế mọi placeholder dạng {{fieldName}}
    for (const [key, val] of Object.entries(allFields)) {
      if (val === true) {
        element.replaceText(`{{${key}}}`, '☑');
      } else if (val === false) {
        element.replaceText(`{{${key}}}`, '☐');
      } else {
        element.replaceText(`{{${key}}}`, val !== null && val !== undefined ? val.toString() : '');
      }
    }

    // 5. Xử lý điền các ô checkbox loại mẫu, khối lượng, tình trạng mẫu và kết quả chung
    try {
      // a. Khối lượng mẫu
      const khoiLuongVal = (sample.khoiLuong || metadata.khoiLuong || '10.0').toString().trim();
      let kl10Check = '☐';
      let klOtherText = '………';
      if (khoiLuongVal === '10.0' || khoiLuongVal === '10') {
        kl10Check = '☑';
      } else {
        klOtherText = khoiLuongVal;
      }
      element.replaceText('m\\s*=\\s*[☐□☑]?\\s*10\\.0', 'm = ' + kl10Check + ' 10.0');
      if (klOtherText !== '………') {
        element.replaceText('10\\.0\\s*;\\s*[…\\.]+', '10.0 ; ' + klOtherText);
      }

      // b. Loại mẫu
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

      element.replaceText('Loại mẫu:\\s*[☐□☑]\\s*Nông sản tươi', 'Loại mẫu: ' + tuoiCheck + ' Nông sản tươi');
      element.replaceText('tươi\\s*;\\s*[☐□☑]\\s*Nông sản khô', 'tươi; ' + khoCheck + ' Nông sản khô');
      element.replaceText('khô\\s*;\\s*[☐□☑]\\s*Thuỷ sản', 'khô; ' + thuySanCheck + ' Thuỷ sản');
      element.replaceText('khô\\s*;\\s*[☐□☑]\\s*Thủy sản', 'khô; ' + thuySanCheck + ' Thủy sản');
      element.replaceText('sản\\s*;\\s*[☐□☑]\\s*Khác\\s*:\\s*[…\\.]*', 'sản; ' + lmKhacCheck + ' Khác: ' + lmKhacText);

      // c. Tình trạng mẫu
      const ttMauVal = (sample.tinhTrangMau || metadata.tinhTrangMau || 'Bình thường').toString().trim();
      let isBinhThuong = ttMauVal === 'Bình thường';
      let isTtKhac = !isBinhThuong;
      let ttKhacText = isTtKhac ? ttMauVal : '………';
      
      const btCheck = isBinhThuong ? '☑' : '☐';
      const ttKhacCheck = isTtKhac ? '☑' : '☐';

      element.replaceText('Tình trạng mẫu:\\s*[☐□☑]\\s*Bình thường', 'Tình trạng mẫu: ' + btCheck + ' Bình thường');
      element.replaceText('thường\\s*;\\s*[☐□☑]\\s*Khác\\s*:\\s*[…\\.]*', 'thường; ' + ttKhacCheck + ' Khác: ' + ttKhacText);

      // d. Kết quả phát hiện/không phát hiện
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

      element.replaceText('[☐□☑]\\s*Phát hiện', phCheck + ' Phát hiện');
      element.replaceText('[☐□☑]\\s*Không phát hiện', kphCheck + ' Không phát hiện');

      // e. Bổ sung nước
      const boSungNuocVal = (sample.checkBoSungNuoc || metadata.checkBoSungNuoc || 'không').toString().trim().toLowerCase();
      let bsNuocCo = '☐';
      let bsNuocKhong = '☐';
      if (boSungNuocVal === 'có' || boSungNuocVal === 'co') {
        bsNuocCo = '☑';
      } else {
        bsNuocKhong = '☑';
      }
      element.replaceText('Bổ\\s*sung\\s*nước:\\s*[☐□☑]?\\s*có;\\s*[☐□☑]?\\s*không', 'Bổ sung nước: ' + bsNuocCo + ' có; ' + bsNuocKhong + ' không');

      // f. Hút 8ml cho vào hỗn hợp:
      const hhLamSachVal = (sample.checkHonHopLamSach || metadata.checkHonHopLamSach || 'B1').toString().trim().toUpperCase();
      let hhB1 = '☐';
      let hhB2 = '☐';
      if (hhLamSachVal === 'B1') {
        hhB1 = '☑';
      } else if (hhLamSachVal === 'B2') {
        hhB2 = '☑';
      }
      element.replaceText('hỗn\\s*hợp\\s*:\\s*[☐□☑]?\\s*B1;\\s*[☐□☑]?\\s*B2', 'hỗn hợp : ' + hhB1 + ' B1; ' + hhB2 + ' B2');

      // g. HSPL
      const hsplVal = (sample.heSoPhaLoang || sample.hSoPhaLoang || metadata.heSoPhaLoang || '1').toString().trim();
      let hspl1Check = '☐';
      let hsplOtherText = '………';
      if (hsplVal === '1') {
        hspl1Check = '☑';
      } else {
        hsplOtherText = hsplVal;
      }
      element.replaceText('HSPL:\\s*[☐□☑]?\\s*1\\s*;\\s*[…\\.]*', 'HSPL: ' + hspl1Check + ' 1 ; ' + hsplOtherText);
    } catch (e) {
      Logger.log('[Report LanHuuCo] Lỗi điền metadata: ' + e.toString());
    }

    // 6. Điền bảng kết quả hoạt chất (Table 4)
    fillLanHuuCoResultsTableDirectly(element, sopConfig, sample, tableTextToKey, isTargetAssignedForGas);

    // 7. Điền bảng nồng độ điểm chuẩn ở Section 1 (Table 2)
    fillLanHuuCoTable2Directly(element, metadata);
    
    // 8. Đánh giá Đạt/Không đạt/NA cho bảng QC của từng mẫu (Table 3)
    fillLanHuuCoQcTableDirectly(element, sopConfig, allFields);
  }
}

/**
 * Tìm và điền Table 4 (38 hoạt chất dạng 2 cột song song)
 */
function fillLanHuuCoResultsTableDirectly(element, sopConfig, sample, tableTextToKey, isTargetAssignedForGas) {
  let tables = [];
  if (element.getType() === DocumentApp.ElementType.TABLE) {
    tables.push(element.asTable());
  } else if (typeof element.getTables === 'function') {
    tables = element.getTables();
  }

  let resultsTable = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() === 21) {
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

    const isAssigned = isTargetAssignedForGas(sample.maSoMau, key);
    
    if (!isAssigned) {
      setCellText(row, startCellIdx + 1, "—    ☐ ND", 0, 8.5);
      setCellText(row, startCellIdx + 2, "☐ Đ           ☐ KĐ", 0, 8.5);
      setCellText(row, startCellIdx + 3, "☐ Đ           ☐ KĐ", 0, 8.5);
      setCellText(row, startCellIdx + 4, "☐ Đ           ☐ KĐ", 0, 8.5);
    } else {
      const kqVal = sample[key] !== undefined && sample[key] !== null ? sample[key].toString() : '';
      const ndVal = sample[key + '_nd'] === true ? '☑' : '☐';
      const isDetected = (kqVal !== '' || ndVal === '☑');
      
      let qc1Val = '☐';
      let qc2Val = '☐';
      let qc3Val = '☐';
      
      if (isDetected) {
        qc1Val = sample[key + '_qc1'] || '☐';
        qc2Val = sample[key + '_qc2'] || '☐';
        qc3Val = sample[key + '_qc3'] || '☐';
      }
      
      const qc1Dat = (qc1Val === 'Đạt' || qc1Val === '☑') ? '☑' : '☐';
      const qc1Kd = (qc1Val === 'Không đạt' || qc1Val === '☒' || qc1Val === 'Không Đạt') ? '☑' : '☐';
      
      const qc2Dat = (qc2Val === 'Đạt' || qc2Val === '☑') ? '☑' : '☐';
      const qc2Kd = (qc2Val === 'Không đạt' || qc2Val === '☒' || qc2Val === 'Không Đạt') ? '☑' : '☐';
      
      const qc3Dat = (qc3Val === 'Đạt' || qc3Val === '☑') ? '☑' : '☐';
      const qc3Kd = (qc3Val === 'Không đạt' || qc3Val === '☒' || qc3Val === 'Không Đạt') ? '☑' : '☐';
      
      const prefix = kqVal ? kqVal : '………';
      setCellText(row, startCellIdx + 1, `${prefix}    ${ndVal} ND`, 0, 8.5);
      setCellText(row, startCellIdx + 2, `${qc1Dat} Đ           ${qc1Kd} KĐ`, 0, 8.5);
      setCellText(row, startCellIdx + 3, `${qc2Dat} Đ           ${qc2Kd} KĐ`, 0, 8.5);
      setCellText(row, startCellIdx + 4, `${qc3Dat} Đ           ${qc3Kd} KĐ`, 0, 8.5);
    }
  };

  for (let r = 2; r < numRows; r++) {
    const row = resultsTable.getRow(r);
    // Left side: name cell 0, cells 1-4 for result & QCs
    const leftName = row.getCell(0).getText().trim();
    if (leftName) {
      fillSide(row, 0, leftName);
    }
    // Right side: name cell 5, cells 6-9 for result & QCs
    const rightName = row.getCell(5).getText().trim();
    if (rightName) {
      fillSide(row, 5, rightName);
    }
  }
}

/**
 * Điền Table 2 (Nồng độ các điểm chuẩn)
 */
function fillLanHuuCoTable2Directly(element, metadata) {
  let tables = [];
  if (element.getType() === DocumentApp.ElementType.TABLE) {
    tables.push(element.asTable());
  } else if (typeof element.getTables === 'function') {
    tables = element.getTables();
  }

  let calTable2 = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() === 7) {
      const headerText = t.getRow(0).getText();
      if (headerText.includes("Điểm chuẩn") && headerText.includes("nội chuẩn")) {
        calTable2 = t;
        break;
      }
    }
  }

  if (calTable2 && metadata.calibPoints) {
    const calibPoints = metadata.calibPoints || [];
    for (let i = 0; i < 6; i++) {
      const rowIdx = i + 1;
      const row = calTable2.getRow(rowIdx);
      if (i < calibPoints.length) {
        const pt = calibPoints[i];
        setCellText(row, 1, pt.loSo || '20', null, 9);
        setCellText(row, 2, pt.hamLuong || '', null, 9);
      }
    }
  }
}

/**
 * Xử lý đánh dấu Đạt/Không đạt/NA cho bảng QC của từng mẫu (Table 3)
 */
function fillLanHuuCoQcTableDirectly(element, sopConfig, allFields) {
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
            const evalCell = row.getCell(2); // Cột Đánh giá
            
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
function fillLanHuuCoSection2(elements, sopConfig, metadata) {
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

  // 1. Điền bảng đường chuẩn Table 7 (rows=8)
  let calibTable = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() === 8) {
      const headerText = t.getRow(0).getText();
      if (headerText.includes("Chuẩn") && headerText.includes("vial")) {
        calibTable = t;
        break;
      }
    }
  }

  if (calibTable) {
    const calibPoints = metadata.calibPoints || [];
    for (let i = 0; i < 6; i++) {
      const rowIdx = i + 1;
      const row = calibTable.getRow(rowIdx);
      setCellText(row, 0, `C${i}`, null, 9);
      if (i < calibPoints.length) {
        const pt = calibPoints[i];
        setCellText(row, 1, pt.loSo || '', null, 9);
        setCellText(row, 2, pt.hamLuong || '', null, 9);
      } else {
        setCellText(row, 1, '', null, 9);
        setCellText(row, 2, '', null, 9);
      }
    }
    // Điền R2
    const r2Val = metadata.r2 || '';
    setCellText(calibTable.getRow(7), 1, r2Val, null, 9);
  }

  // 2. Điền bảng chuẩn bị mẫu Table 8 (rows=19)
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
    
    // Clear / fill 18 rows đầu tiên
    for (let i = 0; i < 18; i++) {
      const rowIdx = i + 1;
      const row = prepTable.getRow(rowIdx);
      if (i < runSamplesList.length) {
        const s = runSamplesList[i];
        setCellText(row, 0, s.maSoMau || '', null, 9);
        setCellText(row, 1, s.khoiLuong || '10.0', null, 9);
        setCellText(row, 2, s.heSoPhaLoang || '1', null, 9);
        setCellText(row, 3, s.loSo || '', null, 9);
        setCellText(row, 4, s.summaryResult || 'KPH', null, 9);
      } else {
        setCellText(row, 0, '', null, 9);
        setCellText(row, 1, '', null, 9);
        setCellText(row, 2, '', null, 9);
        setCellText(row, 3, '', null, 9);
        setCellText(row, 4, '', null, 9);
      }
    }
    
    // Nếu nhiều hơn 18 mẫu, tự động nhân bản dòng 18 và chèn tiếp xuống dưới
    if (runSamplesList.length > 18) {
      for (let i = 18; i < runSamplesList.length; i++) {
        const s = runSamplesList[i];
        const newRow = prepTable.getRow(18).copy();
        prepTable.appendRow(newRow);
        const row = prepTable.getRow(i + 1);
        setCellText(row, 0, s.maSoMau || '', null, 9);
        setCellText(row, 1, s.khoiLuong || '10.0', null, 9);
        setCellText(row, 2, s.heSoPhaLoang || '1', null, 9);
        setCellText(row, 3, s.loSo || '', null, 9);
        setCellText(row, 4, s.summaryResult || 'KPH', null, 9);
      }
    }
  }
}

/**
 * Xóa PageBreak thừa ở cuối tài liệu
 */
function cleanLanHuuCoLastPageBreak(body) {
  try {
    const numChildren = body.getNumChildren();
    if (numChildren > 0) {
      const lastChild = body.getChild(numChildren - 1);
      if (lastChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
        body.removeChild(lastChild);
        Logger.log("[Autocut LanHuuCo] Đã xóa PageBreak thừa cuối tài liệu.");
      }
    }
  } catch(e) {
    Logger.log(`[Autocut LanHuuCo] Lỗi dọn dẹp PageBreak: ${e.toString()}`);
  }
}
