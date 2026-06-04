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

  const printFormType = metadata.printFormType || 'formCheck';

  if (printFormType === 'formDon') {
    // === FORM ĐƠN (Trang 15) ===
    let compounds = metadata.compoundsToPrint || [];
    if (compounds.length === 0) {
      if (metadata.activeCompound) {
        compounds = [metadata.activeCompound];
      } else {
        compounds = ['Chlorpyrifos'];
      }
    }

    const templateChildren = [];
    const numChildren = body.getNumChildren();
    for (let i = 0; i < numChildren; i++) {
      templateChildren.push(body.getChild(i).copy());
    }

    const sopConfig = CONFIG.SOP_CONFIG['lan-huu-co'];

    for (let c = 0; c < compounds.length; c++) {
      const compoundName = compounds[c];
      let pageElements = [];

      if (c === 0) {
        for (let i = 0; i < numChildren; i++) {
          const child = body.getChild(i);
          const type = child.getType();
          if (type === DocumentApp.ElementType.PARAGRAPH) {
            pageElements.push(child.asParagraph());
          } else if (type === DocumentApp.ElementType.TABLE) {
            pageElements.push(child.asTable());
          } else if (type === DocumentApp.ElementType.LIST_ITEM) {
            pageElements.push(child.asListItem());
          }
        }
      } else {
        body.appendPageBreak();
        for (let i = 0; i < templateChildren.length; i++) {
          const cloned = templateChildren[i].copy();
          const type = cloned.getType();
          let appended = null;
          if (type === DocumentApp.ElementType.PARAGRAPH) {
            appended = body.appendParagraph(cloned.asParagraph());
          } else if (type === DocumentApp.ElementType.TABLE) {
            appended = body.appendTable(cloned.asTable());
          } else if (type === DocumentApp.ElementType.LIST_ITEM) {
            appended = body.appendListItem(cloned.asListItem());
          }
          if (appended) pageElements.push(appended);
        }
      }

      for (const element of pageElements) {
        if (element.getType() === DocumentApp.ElementType.PARAGRAPH) {
          const pText = element.asParagraph().getText();
          if (pText.includes("XÁC ĐỊNH DƯ LƯỢNG") || pText.includes("XAC DINH DU LUONG")) {
            element.asParagraph().setText("XÁC ĐỊNH DƯ LƯỢNG " + compoundName.toUpperCase());
          }
        }

        // Standard placeholders
        for (const [key, val] of Object.entries(metadata)) {
          if (key !== 'samples' && key !== 'runSamplesList') {
            if (val === true) {
              element.replaceText(`{{${key}}}`, '☑');
            } else if (val === false) {
              element.replaceText(`{{${key}}}`, '☐');
            } else {
              element.replaceText(`{{${key}}}`, val !== null && val !== undefined ? val.toString() : '');
            }
          }
        }

        if (sopConfig.signaturePlaceholders) {
          for (const [placeholderText, fieldName] of Object.entries(sopConfig.signaturePlaceholders)) {
            const textVal = metadata[fieldName] || '';
            if (textVal) {
              const dateOnly = textVal.split('/ ').length > 1 ? textVal.split(' /')[0].trim() : textVal.trim();
              element.replaceText(placeholderText, dateOnly);
            }
          }
        }
      }

      fillLanHuuCoSection2(pageElements, sopConfig, metadata, compoundName, samples);
    }

    cleanLanHuuCoLastPageBreak(body);
    doc.saveAndClose();

    const pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
    const pdfName = fileName + '.pdf';
    const pdfFile = folder.createFile(pdfBlob).setName(pdfName);

    return {
      docId,
      pdfId: pdfFile.getId(),
      docsUrl: `https://docs.google.com/document/d/${docId}/edit`,
      pdfUrl: pdfFile.getUrl(),
      pdfViewUrl: pdfFile.getDownloadUrl(),
      fileName,
      createdAt: new Date().toISOString(),
    };
  } else {
    // === FORM CHECK (Trang 9-10) ===
    const templateChildren = [];
    const numChildren = body.getNumChildren();
    for (let i = 0; i < numChildren; i++) {
      templateChildren.push(body.getChild(i).copy());
    }

    const sopConfig = CONFIG.SOP_CONFIG['lan-huu-co'];

    for (let s = 0; s < samples.length; s++) {
      let pageElements = [];

      if (s === 0) {
        for (let i = 0; i < numChildren; i++) {
          const child = body.getChild(i);
          const type = child.getType();
          if (type === DocumentApp.ElementType.PARAGRAPH) {
            pageElements.push(child.asParagraph());
          } else if (type === DocumentApp.ElementType.TABLE) {
            pageElements.push(child.asTable());
          } else if (type === DocumentApp.ElementType.LIST_ITEM) {
            pageElements.push(child.asListItem());
          }
        }
      } else {
        body.appendPageBreak();
        for (let i = 0; i < templateChildren.length; i++) {
          const cloned = templateChildren[i].copy();
          const type = cloned.getType();
          let appended = null;
          if (type === DocumentApp.ElementType.PARAGRAPH) {
            appended = body.appendParagraph(cloned.asParagraph());
          } else if (type === DocumentApp.ElementType.TABLE) {
            appended = body.appendTable(cloned.asTable());
          } else if (type === DocumentApp.ElementType.LIST_ITEM) {
            appended = body.appendListItem(cloned.asListItem());
          }
          if (appended) pageElements.push(appended);
        }
      }

      fillLanHuuCoSampleForElements(pageElements, sopConfig, metadata, samples[s]);
    }

    cleanLanHuuCoLastPageBreak(body);
    doc.saveAndClose();

    const pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
    const pdfName = fileName + '.pdf';
    const pdfFile = folder.createFile(pdfBlob).setName(pdfName);

    return {
      docId,
      pdfId: pdfFile.getId(),
      docsUrl: `https://docs.google.com/document/d/${docId}/edit`,
      pdfUrl: pdfFile.getUrl(),
      pdfViewUrl: pdfFile.getDownloadUrl(),
      fileName,
      createdAt: new Date().toISOString(),
    };
  }
}

/**
 * Helper functions for safely replacing text without losing formatting
 */
function replaceCheckboxSafely(el, pattern, charToInsert) {
  let found = el.findText(pattern);
  while (found) {
    const textElement = found.getElement().asText();
    const start = found.getStartOffset();
    const end = found.getEndOffsetInclusive();
    // Use try-catch in case of cross-element boundaries
    try {
      const textStr = textElement.getText().substring(start, end + 1);
      const boxIndex = textStr.search(/[☐□☑]/);
      if (boxIndex !== -1) {
        textElement.deleteText(start + boxIndex, start + boxIndex);
        textElement.insertText(start + boxIndex, charToInsert);
      }
    } catch(e) {
      Logger.log('[replaceCheckboxSafely] Partial match boundary error: ' + e);
    }
    found = el.findText(pattern, found);
  }
}

function insertTextAfterPattern(el, pattern, textToInsert) {
  if (!textToInsert) return;
  const found = el.findText(pattern);
  if (found) {
    const textElement = found.getElement().asText();
    const end = found.getEndOffsetInclusive();
    textElement.insertText(end + 1, textToInsert);
  }
}

function replaceDotsSafely(el, pattern, textToInsert) {
  if (!textToInsert) return;
  let found = el.findText(pattern);
  if (found) {
    const textElement = found.getElement().asText();
    const start = found.getStartOffset();
    const end = found.getEndOffsetInclusive();
    try {
      const textStr = textElement.getText().substring(start, end + 1);
      const match = textStr.match(/[…\.]+/);
      if (match) {
        const dotStart = start + match.index;
        const dotEnd = dotStart + match[0].length - 1;
        textElement.insertText(dotStart, textToInsert);
        textElement.deleteText(dotStart + textToInsert.length, dotEnd + textToInsert.length);
      }
    } catch(e) {
      Logger.log('[replaceDotsSafely] Partial match boundary error: ' + e);
    }
  }
}

/**
 * Helper functions for safely replacing text without losing formatting
 */
function replaceCheckboxSafely(el, pattern, charToInsert) {
  let found = el.findText(pattern);
  while (found) {
    try {
      const textElement = found.getElement().asText();
      const start = found.getStartOffset();
      const end = found.getEndOffsetInclusive();
      const textStr = textElement.getText().substring(start, end + 1);
      const boxIndex = textStr.search(/[☐□☑]/);
      if (boxIndex !== -1) {
        const insertPos = start + boxIndex;
        textElement.insertText(insertPos, charToInsert);
        textElement.deleteText(insertPos + 1, insertPos + 1);
      }
    } catch(e) {
      Logger.log('[replaceCheckboxSafely] Error at pattern ' + pattern + ': ' + e);
    }
    found = el.findText(pattern, found);
  }
}

function insertTextAfterPattern(el, pattern, textToInsert) {
  if (!textToInsert) return;
  const found = el.findText(pattern);
  if (found) {
    try {
      const textElement = found.getElement().asText();
      const end = found.getEndOffsetInclusive();
      textElement.insertText(end + 1, textToInsert);
    } catch(e) {
      Logger.log('[insertTextAfterPattern] Error at pattern ' + pattern + ': ' + e);
    }
  }
}

function replaceDotsSafely(el, pattern, textToInsert) {
  if (!textToInsert) return;
  let found = el.findText(pattern);
  if (found) {
    try {
      const textElement = found.getElement().asText();
      const start = found.getStartOffset();
      const end = found.getEndOffsetInclusive();
      const textStr = textElement.getText().substring(start, end + 1);
      const match = textStr.match(/[…\.]+/);
      if (match) {
        const dotStart = start + match.index;
        const dotEnd = dotStart + match[0].length - 1;
        textElement.deleteText(dotStart, dotEnd);
        textElement.insertText(dotStart, textToInsert);
      }
    } catch(e) {
      Logger.log('[replaceDotsSafely] Error at pattern ' + pattern + ': ' + e);
    }
  }
}

/**
 * Điền thông tin Section 1 (cấp body chính) cho mẫu đầu tiên
 */
function fillLanHuuCoSample(body, sopConfig, metadata, sample) {
  const numChildren = body.getNumChildren();
  const elements = [];
  for (let i = 0; i < numChildren; i++) {
    const child = body.getChild(i);
    const type = child.getType();
    if (type === DocumentApp.ElementType.PARAGRAPH) {
      elements.push(child.asParagraph());
    } else if (type === DocumentApp.ElementType.TABLE) {
      elements.push(child.asTable());
    } else if (type === DocumentApp.ElementType.LIST_ITEM) {
      elements.push(child.asListItem());
    }
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
        const khoiLuongVal = (sample.khoiLuong || metadata.khoiLuong || '10.0').toString().trim();
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
      Logger.log('[Report LanHuuCo] Lỗi điền metadata: ' + e.toString());
    }

    fillLanHuuCoResultsTableDirectly(element, sopConfig, sample, tableTextToKey, isTargetAssignedForGas);
    if (metadata.printFormType === 'formDon') {
      fillLanHuuCoTable2Directly(element, metadata);
    }
    fillLanHuuCoQcTableDirectly(element, sopConfig, allFields);
  }
}

/**
 * Tìm và điền Table 4 (38 hoạt chất dạng 2 cột song song)
 * Nguyên tắc: KHÔNG chạm vào ô nào nếu không có dữ liệu thực (bảo toàn template gốc)
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

    // Không được giao → giữ nguyên template tuyệt đối
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

    // isKph chỉ định liệu giá trị này có phải là không phát hiện hay không
    const isKph = (kqRaw === 'KPH' || kqRaw.toUpperCase() === 'KPH' || kqRaw === 'N/A' || kqRaw === '—' || kqRaw === '');
    const kqVal = isKph ? '' : kqRaw;
    
    // Đã phát hiện (có kqVal) hoặc được đánh dấu ND
    // NẾU kqRaw rỗng (isKph = true) nhưng isNd = true thì CHẮC CHẮN phải xử lý
    const isDetected = (kqVal !== '' || isNd || kqRaw.toUpperCase() === 'KPH');

    // Không có dữ liệu để xử lý → không chạm vào template
    if (!isDetected) return;

    const kqCell  = row.getCell(startCellIdx + 1);
    const qc1Cell = row.getCell(startCellIdx + 2);
    const qc2Cell = row.getCell(startCellIdx + 3);
    const qc3Cell = row.getCell(startCellIdx + 4);

    // --- Ô kết quả ---
    try {
      if (kqVal) {
        // Thay chuỗi 2+ dấu chấm/ellipsis ở đầu ô bằng giá trị thực
        kqCell.replaceText('^[…\\.]{2,}', kqVal);
      }
      
      // Khớp duy nhất ký tự checkbox vì trong ô kết quả chỉ có 1 checkbox ND
      // Việc khớp đúng 1 ký tự đảm bảo 100% không bao giờ bị lỗi tràn Text element (boundary error)
      replaceCheckboxSafely(kqCell, '[☐□☑]', isNd ? '☑' : '☐');
    } catch(e) {
      Logger.log('[fillSide kqCell] ' + (key || '') + ': ' + e.toString());
    }

    // --- Ô QC (chỉ khi phát hiện) ---
    const fillQcCell = function(cell, qcRawVal) {
      const isDat      = (qcRawVal === 'Đạt'      || qcRawVal === '☑');
      const isKhongDat = (qcRawVal === 'Không đạt' || qcRawVal === '☒' || qcRawVal === 'Không Đạt');
      try {
        // Khớp toàn bộ các checkbox trong ô (luôn có 2 cái: cái 1 là Đạt, cái 2 là Không đạt)
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
        Logger.log('[fillQcCell] ' + e.toString());
      }
    };

    fillQcCell(qc1Cell, getSampleValue('_qc1') || '');
    fillQcCell(qc2Cell, getSampleValue('_qc2') || '');
    fillQcCell(qc3Cell, getSampleValue('_qc3') || '');
  };

  for (let r = 2; r < numRows; r++) {
    const row = resultsTable.getRow(r);
    const leftName  = row.getCell(0).getText().trim();
    if (leftName)  fillSide(row, 0, leftName);
    const rightName = row.getCell(5).getText().trim();
    if (rightName) fillSide(row, 5, rightName);
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
function fillLanHuuCoSection2(elements, sopConfig, metadata, compoundName, samples) {
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
    const r2Val = metadata.r2 || '';
    setCellText(calibTable.getRow(7), 1, r2Val, null, 9);
  }

  // Helper inside function to map compound to backend key
  function mapCompoundToKey(cName) {
    const directMap = {
      'Acephate': 'Acephate',
      'AzinphosMethyl': 'AzinphosMethyl',
      'Cadusafos': 'Cadusafos',
      'Chlorpyrifos': 'Chlorpyrifos',
      'ChlorpyrifosMethyl': 'ChlorpyrifosMethyl',
      'Diazinon': 'Diazinon',
      'Dimethoate': 'Dimethoate',
      'Edifenphos': 'Edifenphos',
      'Ethion': 'Ethion',
      'Ethoprophos': 'Ethoprophos',
      'Fenitrothion': 'Fenitrothion',
      'Fenthion': 'Fenthion',
      'Fipronil': 'Fipronil',
      'FipronilSulfide': 'FipronilSulfide',
      'FipronilSulfone': 'FipronilSulfone',
      'FipronilDesulfinyl': 'FipronilDesulfinyl',
      'Iprobenfos': 'Iprobenfos',
      'Malathion': 'Malathion',
      'Mefenoxam': 'Mefenoxam',
      'Metalaxyl': 'Metalaxyl',
      'Methacrifos': 'Methacrifos',
      'Methidathion': 'Methidathion',
      'Monocrotophos': 'Monocrotophos',
      'Omethoate': 'Omethoate',
      'Parathion': 'Parathion',
      'ParathionMethyl': 'ParathionMethyl',
      'Phenthoate': 'Phenthoate',
      'Phorate': 'Phorate',
      'Phosmet': 'Phosmet',
      'Phosphamidon': 'Phosphamidon',
      'PirimiphosMethyl': 'PirimiphosMethyl',
      'Profenofos': 'Profenofos',
      'Quinalphos': 'Quinalphos',
      'Ronnel': 'Ronnel',
      'Triazophos': 'Triazophos',
      'Vamidothion': 'Vamidothion',
      'Chlorfenvinphos': 'Chlorfenvinphos',
      'IsofenphosMethyl': 'IsofenphosMethyl'
    };
    const normalized = cName.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [k, v] of Object.entries(directMap)) {
      if (k.toLowerCase() === normalized) return v;
    }
    return cName;
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
    const isDon = metadata.printFormType === 'formDon';
    
    for (let i = 0; i < 18; i++) {
      const rowIdx = i + 1;
      const row = prepTable.getRow(rowIdx);
      if (i < runSamplesList.length) {
        const s = runSamplesList[i];
        
        let cell4Text = '';
        let cell5Text = '';
        if (isDon) {
          if (s.compoundResults && compoundName) {
            cell4Text = s.compoundResults[compoundName] || 'KPH';
          } else {
            cell4Text = 'KPH';
          }
          if (s.compoundNotes && compoundName) {
            cell5Text = s.compoundNotes[compoundName] || '';
          }
        } else {
          cell4Text = s.checkBoSungNuoc || 'không';
          cell5Text = s.checkHonHopLamSach || 'B1';
        }

        setCellText(row, 0, s.maSoMau || '', null, 9);
        setCellText(row, 1, s.khoiLuong || '10.0', null, 9);
        setCellText(row, 2, s.heSoPhaLoang || '1', null, 9);
        setCellText(row, 3, s.loSo || '', null, 9);
        if (row.getNumCells() > 4) {
          setCellText(row, 4, cell4Text, null, 9);
        }
        if (row.getNumCells() > 5) {
          setCellText(row, 5, cell5Text, null, 9);
        }
      } else {
        setCellText(row, 0, '', null, 9);
        setCellText(row, 1, '', null, 9);
        setCellText(row, 2, '', null, 9);
        setCellText(row, 3, '', null, 9);
        if (row.getNumCells() > 4) {
          setCellText(row, 4, '', null, 9);
        }
        if (row.getNumCells() > 5) {
          setCellText(row, 5, '', null, 9);
        }
      }
    }
    
    if (runSamplesList.length > 18) {
      for (let i = 18; i < runSamplesList.length; i++) {
        const s = runSamplesList[i];
        const newRow = prepTable.getRow(18).copy();
        prepTable.appendRow(newRow);
        const row = prepTable.getRow(i + 1);
        
        let cell4Text = '';
        let cell5Text = '';
        if (isDon) {
          if (s.compoundResults && compoundName) {
            cell4Text = s.compoundResults[compoundName] || 'KPH';
          } else {
            cell4Text = 'KPH';
          }
          if (s.compoundNotes && compoundName) {
            cell5Text = s.compoundNotes[compoundName] || '';
          }
        } else {
          cell4Text = s.checkBoSungNuoc || 'không';
          cell5Text = s.checkHonHopLamSach || 'B1';
        }

        setCellText(row, 0, s.maSoMau || '', null, 9);
        setCellText(row, 1, s.khoiLuong || '10.0', null, 9);
        setCellText(row, 2, s.heSoPhaLoang || '1', null, 9);
        setCellText(row, 3, s.loSo || '', null, 9);
        if (row.getNumCells() > 4) {
          setCellText(row, 4, cell4Text, null, 9);
        }
        if (row.getNumCells() > 5) {
          setCellText(row, 5, cell5Text, null, 9);
        }
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
