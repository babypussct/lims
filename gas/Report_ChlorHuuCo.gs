/**
 * Custom Report Generator for Nhóm Chlor hữu cơ (SOP ID: nhom_lan_huu_co_gc-msms_copy_1768036876719)
 * =========================================================================================
 * Tách riêng hoàn toàn cả xử lý tạo báo cáo, điền dữ liệu, và logic nhân bản trang dạng 3B
 * của Chlor hữu cơ để phục vụ phát triển/tùy biến giao diện báo cáo độc lập.
 */

function generateCustomReport_chlor_huu_co(templateId, metadata, samples, folder, fileName, version) {
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = templateFile.makeCopy(fileName, folder);
  const docId = newFile.getId();
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  // Lấy cấu hình của Chlor hữu cơ từ cấu hình chung (hoặc tùy biến trực tiếp ở đây)
  const sopConfig = CONFIG.SOP_CONFIG['chlor-huu-co'];

  // Sử dụng bộ engine nội bộ riêng biệt của Chlor hữu cơ
  generateChlorHuuCoReport(body, sopConfig, metadata, samples);

  // Lưu doc
  doc.saveAndClose();

  // Xuất file PDF
  const pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
  const pdfName = fileName + '.pdf';
  const pdfFile = folder.createFile(pdfBlob).setName(pdfName);

  const pdfUrl     = pdfFile.getUrl();
  const docsUrl    = `https://docs.google.com/document/d/${docId}/edit`;
  const pdfViewUrl = pdfFile.getDownloadUrl();

  Logger.log(`[ChlorHuuCoCustom] Report created: ${fileName} | Doc: ${docId} | PDF: ${pdfFile.getId()}`);

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
 * Nhân bản trang theo từng mẫu thử và gọi hàm điền dữ liệu riêng biệt
 */
function generateChlorHuuCoReport(body, sopConfig, metadata, samples) {
  const numChildren = body.getNumChildren();
  const children = [];
  for (let i = 0; i < numChildren; i++) {
    children.push(body.getChild(i).copy());
  }

  // Điền dữ liệu cho mẫu đầu tiên
  if (samples.length > 0) {
    fillChlorHuuCoSample(body, sopConfig, metadata, samples[0]);
  }

  // Nhân bản trang và điền dữ liệu cho các mẫu tiếp theo
  for (let s = 1; s < samples.length; s++) {
    body.appendPageBreak();
    
    const tempContainer = [];
    for (let i = 0; i < children.length; i++) {
      const cloned = children[i].copy();
      const type = cloned.getType();
      let appendedElement = null;
      if (type === DocumentApp.ElementType.PARAGRAPH) {
        appendedElement = body.appendParagraph(cloned.asParagraph());
      } else if (type === DocumentApp.ElementType.TABLE) {
        appendedElement = body.appendTable(cloned.asTable());
      } else if (type === DocumentApp.ElementType.LIST_ITEM) {
        appendedElement = body.appendListItem(cloned.asListItem());
      }
      if (appendedElement) {
        tempContainer.push(appendedElement);
      }
    }
    fillChlorHuuCoSampleForElements(tempContainer, sopConfig, metadata, samples[s]);
  }
  
  // Tự động thu dọn PageBreak cuối tài liệu nếu có
  cleanChlorHuuCoLastPageBreak(body);
}

/**
 * Helper điền dữ liệu cấp độ body chính
 */
function fillChlorHuuCoSample(body, sopConfig, metadata, sample) {
  fillChlorHuuCoSampleForElements([body], sopConfig, metadata, sample);
}

/**
 * Helper thay thế placeholder và điền kết quả cho mẫu dạng 3B trên danh sách các phần tử
 */
function fillChlorHuuCoSampleForElements(elements, sopConfig, metadata, sample) {
  const allFields = { ...metadata, ...sample };
  
  // Build dynamic sampleTargetMap resolver
  const sampleTargetMap = metadata.sampleTargetMap || (metadata.inputs && metadata.inputs.sampleTargetMap) || null;
  const isTargetAssignedForGas = function(sampleCode, colKey) {
    if (!sampleTargetMap) return true;
    const assignedTargetIds = sampleTargetMap[sampleCode];
    if (!assignedTargetIds) return true;
    
    const targetIdToBackendKey = {
      'Aldrin': 'Aldrin',
      'BHC-alpha': 'BHCa',
      'BHC-beta': 'BHCb',
      'BHC-delta': 'BHCd',
      'BHC-epsilon': 'BHCe',
      'BHC-gamma': 'BHCg',
      'Chlordane-cis': 'Chlordane_cis',
      'Chlordane-oxy': 'Chlordane_oxy',
      'Chlordane-trans': 'Chlordane_trans',
      'DDD-o,p': 'DDD_op',
      'DDD-p,p': 'DDD_pp',
      'DDE-o,p': 'DDE_op',
      'DDE-p,p': 'DDE_pp',
      'DDT-o,p': 'DDT_op',
      'DDT-p,p': 'DDT_pp',
      'Dieldrin': 'Dieldrin',
      'Endosulfan-I': 'Endosulfan1',
      'Endosulfan-II': 'Endosulfan2',
      'Endosulfan-sulfate': 'EndosulfanS',
      'Endrin': 'Endrin',
      'Heptachlor': 'Heptachlor',
      'Heptachlor-epoxide-trans': 'HeptachlorA',
      'Heptachlor-epoxide-cis': 'HeptachlorB',
      'Hexachlorobenzene': 'HCB',
      'Isodrin': 'Isodrin',
      'Methoxychlor': 'Methoxychlor',
      'Mirex': 'Mirex',
      'Pendimethalin': 'Pendimethalin'
    };
    
    const assignedBackendKeys = assignedTargetIds.map(function(tId) {
      return targetIdToBackendKey[tId] || tId;
    }).map(function(k) { return k.toLowerCase(); });
    
    return assignedBackendKeys.indexOf(colKey.toLowerCase()) !== -1;
  };
  
  for (const element of elements) {
    // 1. Thay thế thông tin mẻ và mã số mẫu cơ bản
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
    
    // 3. Thay thế các dòng checkLines dạng [ ] hoặc ☐ bằng helper đệ quy chọn lọc
    if (sopConfig.checkboxLines) {
      for (const [lineText, fieldName] of Object.entries(sopConfig.checkboxLines)) {
        const isChecked = metadata[fieldName] === true;
        const checkChar = isChecked ? '☑' : '☐';
        replaceCheckboxInElementRecursive(element, lineText, checkChar);
      }
    }
    
    // 4. Thay thế mọi placeholder dạng {{fieldName}} trong payload
    for (const [key, val] of Object.entries(allFields)) {
      if (val === true) {
        element.replaceText(`{{${key}}}`, '☑');
      } else if (val === false) {
        element.replaceText(`{{${key}}}`, '☐');
      } else {
        element.replaceText(`{{${key}}}`, val !== null && val !== undefined ? val.toString() : '');
      }
    }
    
    // 5. Điền trực tiếp kết quả kết luận vào bảng hoạt chất theo tọa độ ô và tên hoạt chất (KHÔNG CẦN PLACEHOLDER)
    fillType3bResultsTableDirectly(element, sopConfig, sample, isTargetAssignedForGas);
    
    // 6. Xử lý đánh dấu ☑/☐ Đạt hoặc Không đạt trong bảng QC của từng mẫu
    let tables = [];
    if (element.getType() === DocumentApp.ElementType.TABLE) {
      tables.push(element.asTable());
    } else if (typeof element.getTables === 'function') {
      tables = element.getTables();
    }
    
    for (let i = 0; i < tables.length; i++) {
      const t = tables[i];
      if (t.getNumRows() >= 6) {
        const headerText = t.getRow(0).getCell(0).getText();
        if (headerText.includes("Thông số đánh giá")) {
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
                const evalCell = row.getCell(2); // Cột Đánh giá (cột index 2)
                
                let datCheck, khongDatCheck, naCheck;
                if (val === true) {
                  datCheck = "☑ Đạt";
                  khongDatCheck = "☐ Không đạt";
                  naCheck = "☐ N/A";
                } else if (val === false) {
                  datCheck = "☐ Đạt";
                  khongDatCheck = "☑ Không đạt";
                  naCheck = "☐ N/A";
                } else { // null (N/A)
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
  }
}

/**
 * Dọn dẹp PageBreak thừa ở cuối tài liệu sau khi nhân bản trang
 */
function cleanChlorHuuCoLastPageBreak(body) {
  try {
    const numChildren = body.getNumChildren();
    if (numChildren > 0) {
      const lastChild = body.getChild(numChildren - 1);
      if (lastChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
        body.removeChild(lastChild);
        Logger.log("[Autocut ChlorHuuCo] Đã xóa PageBreak thừa cuối tài liệu.");
      }
    }
  } catch(e) {
    Logger.log(`[Autocut ChlorHuuCo] Không thể dọn dẹp PageBreak cuối: ${e.toString()}`);
  }
}

/**
 * Helper đệ quy chọn lọc để tìm và thay thế checkbox trong đoạn văn hoặc ô chứa nhãn text tương ứng
 */
function replaceCheckboxInElementRecursive(element, lineText, checkChar) {
  const type = element.getType();
  if (type === DocumentApp.ElementType.PARAGRAPH) {
    const para = element.asParagraph();
    if (para.getText().includes(lineText)) {
      para.replaceText('\\[ \\]', checkChar);
      para.replaceText('☐', checkChar);
      para.replaceText('□', checkChar);
      para.replaceText('[\\[\\(] ?[\\]\\)]', checkChar);
    }
  } else if (type === DocumentApp.ElementType.TABLE) {
    const table = element.asTable();
    for (let r = 0; r < table.getNumRows(); r++) {
      const row = table.getRow(r);
      for (let c = 0; c < row.getNumCells(); c++) {
        const cell = row.getCell(c);
        if (cell.getText().includes(lineText)) {
          cell.replaceText('\\[ \\]', checkChar);
          cell.replaceText('☐', checkChar);
          cell.replaceText('□', checkChar);
          cell.replaceText('[\\[\\(] ?[\\]\\)]', checkChar);
        }
      }
    }
  } else if (element.getNumChildren && element.getNumChildren() > 0) {
    const numChildren = element.getNumChildren();
    for (let i = 0; i < numChildren; i++) {
      replaceCheckboxInElementRecursive(element.getChild(i), lineText, checkChar);
    }
  }
}

/**
 * Điền bảng kết quả cho hoạt chất theo tọa độ ô mà KHÔNG cần bất kỳ placeholder nào (dựa trên tên hoạt chất ở cột 0)
 */
function fillType3bResultsTableDirectly(element, sopConfig, sample, isTargetAssignedForGas) {
  let tables = [];
  if (element.getType() === DocumentApp.ElementType.TABLE) {
    tables.push(element.asTable());
  } else if (typeof element.getTables === 'function') {
    tables = element.getTables();
  }
  
  let resultsTable = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() >= 10) {
      // Dò tìm bảng kết quả dựa trên tên hoạt chất phổ biến "Aldrin" ở hàng 1 hoặc 2 cột 0
      const cell0Text = t.getRow(1).getCell(0).getText();
      const cell1Text = t.getRow(2).getCell(0).getText();
      if (cell0Text.includes("Aldrin") || cell1Text.includes("Aldrin")) {
        resultsTable = t;
        break;
      }
    }
  }
  
  if (!resultsTable) {
    Logger.log("[Type3B Direct] Không tìm thấy bảng kết quả hoạt chất để điền trực tiếp!");
    return false;
  }
  
  const numRows = resultsTable.getNumRows();
  
  // Bản đồ chuẩn hóa tên hiển thị thô trong bảng sang Backend Key của LIMS
  const tableTextToKey = {
    'aldrin': 'Aldrin',
    'bhca': 'BHCa', 'bhc-alpha': 'BHCa', 'alpha-bhc': 'BHCa', 'α-bhc': 'BHCa',
    'bhcb': 'BHCb', 'bhc-beta': 'BHCb', 'beta-bhc': 'BHCb', 'β-bhc': 'BHCb',
    'bhcd': 'BHCd', 'bhc-delta': 'BHCd', 'delta-bhc': 'BHCd', 'δ-bhc': 'BHCd',
    'bhce': 'BHCe', 'bhc-epsilon': 'BHCe', 'epsilon-bhc': 'BHCe', 'ε-bhc': 'BHCe',
    'bhcg': 'BHCg', 'bhc-gamma': 'BHCg', 'gamma-bhc': 'BHCg', 'γ-bhc': 'BHCg', 'lindane': 'BHCg',
    'chlordane_cis': 'Chlordane_cis', 'chlordane-cis': 'Chlordane_cis', 'cis-chlordane': 'Chlordane_cis',
    'chlordane_oxy': 'Chlordane_oxy', 'chlordane-oxy': 'Chlordane_oxy', 'oxy-chlordane': 'Chlordane_oxy',
    'chlordane_trans': 'Chlordane_trans', 'chlordane-trans': 'Chlordane_trans', 'trans-chlordane': 'Chlordane_trans',
    'ddd_op': 'DDD_op', 'ddd-o,p': 'DDD_op', 'o,p-ddd': 'DDD_op', 'o,p\'-ddd': 'DDD_op',
    'ddd_pp': 'DDD_pp', 'ddd-p,p': 'DDD_pp', 'p,p-ddd': 'DDD_pp', 'p,p\'-ddd': 'DDD_pp',
    'dde_op': 'DDE_op', 'dde-o,p': 'DDE_op', 'o,p-dde': 'DDE_op', 'o,p\'-dde': 'DDE_op',
    'dde_pp': 'DDE_pp', 'dde-p,p': 'DDE_pp', 'p,p-dde': 'DDE_pp', 'p,p\'-dde': 'DDE_pp',
    'ddt_op': 'DDT_op', 'ddt-o,p': 'DDT_op', 'o,p-ddt': 'DDT_op', 'o,p\'-ddt': 'DDT_op',
    'ddt_pp': 'DDT_pp', 'ddt-p,p': 'DDT_pp', 'p,p-ddt': 'DDT_pp', 'p,p\'-ddt': 'DDT_pp',
    'dieldrin': 'Dieldrin',
    'endosulfan1': 'Endosulfan1', 'endosulfan-i': 'Endosulfan1', 'alpha-endosulfan': 'Endosulfan1',
    'endosulfan2': 'Endosulfan2', 'endosulfan-ii': 'Endosulfan2', 'beta-endosulfan': 'Endosulfan2',
    'endosulfans': 'EndosulfanS', 'endosulfan-sulfate': 'EndosulfanS',
    'endrin': 'Endrin',
    'heptachlor': 'Heptachlor',
    'heptachlora': 'HeptachlorA', 'heptachlor-epoxide-trans': 'HeptachlorA', 'heptachlor epoxide trans': 'HeptachlorA',
    'heptachlorb': 'HeptachlorB', 'heptachlor-epoxide-cis': 'HeptachlorB', 'heptachlor epoxide cis': 'HeptachlorB',
    'hcb': 'HCB', 'hexachlorobenzene': 'HCB',
    'isodrin': 'Isodrin',
    'methoxychlor': 'Methoxychlor',
    'mirex': 'Mirex',
    'pendimethalin': 'Pendimethalin'
  };
  
  for (let r = 0; r < numRows; r++) {
    const row = resultsTable.getRow(r);
    const cell0Text = row.getCell(0).getText().toLowerCase().replace(/[\s\-\'\’\_]/g, '');
    
    // Tìm key khớp từ cell0Text
    let matchedKey = null;
    for (const [rawText, key] of Object.entries(tableTextToKey)) {
      const normalizedRawText = rawText.replace(/[\s\-\'\’\_]/g, '');
      if (cell0Text.includes(normalizedRawText) || normalizedRawText.includes(cell0Text)) {
        matchedKey = key;
        break;
      }
    }
    
    if (matchedKey) {
      const key = matchedKey;
      const isAssigned = isTargetAssignedForGas(sample.maSoMau, key);
      
      const cell1 = row.getCell(1); // Cột Kết quả & ND
      const cell2 = row.getCell(2); // Cột QC1
      const cell3 = row.getCell(3); // Cột QC2
      const cell4 = row.getCell(4); // Cột QC3
      
      if (!isAssigned) {
        setCellText(row, 1, "—    ☐ ND", 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 2, "☐ Đ           ☐ KĐ", 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 3, "☐ Đ           ☐ KĐ", 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 4, "☐ Đ           ☐ KĐ", 0, sopConfig.defaultFontSize || 9);
      } else {
        const kqVal = sample[key] !== undefined && sample[key] !== null ? sample[key].toString() : '';
        const ndVal = sample[key + '_nd'] === true ? '☑' : '☐';
        const qc1Val = sample[key + '_qc1'] || '☐';
        const qc2Val = sample[key + '_qc2'] || '☐';
        const qc3Val = sample[key + '_qc3'] || '☐';
        
        const qc1Dat = (qc1Val === 'Đạt' || qc1Val === '☑') ? '☑' : '☐';
        const qc1Kd = (qc1Val === 'Không đạt' || qc1Val === '☒' || qc1Val === 'Không Đạt') ? '☑' : '☐';
        
        const qc2Dat = (qc2Val === 'Đạt' || qc2Val === '☑') ? '☑' : '☐';
        const qc2Kd = (qc2Val === 'Không đạt' || qc2Val === '☒' || qc2Val === 'Không Đạt') ? '☑' : '☐';
        
        const qc3Dat = (qc3Val === 'Đạt' || qc3Val === '☑') ? '☑' : '☐';
        const qc3Kd = (qc3Val === 'Không đạt' || qc3Val === '☒' || qc3Val === 'Không Đạt') ? '☑' : '☐';
        
        setCellText(row, 1, `${kqVal}    ${ndVal} ND`, 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 2, `${qc1Dat} Đ           ${qc1Kd} KĐ`, 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 3, `${qc2Dat} Đ           ${qc2Kd} KĐ`, 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 4, `${qc3Dat} Đ           ${qc3Kd} KĐ`, 0, sopConfig.defaultFontSize || 9);
      }
    }
  }
  return true;
}

