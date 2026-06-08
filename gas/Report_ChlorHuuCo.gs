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

  const printFormType = metadata.printFormType || 'formCheck';

  if (printFormType === 'formDon') {
    // === FORM ĐƠN (Trang 15) ===
    let compounds = metadata.compoundsToPrint || [];
    if (compounds.length === 0) {
      if (metadata.activeCompound) {
        compounds = [metadata.activeCompound];
      } else {
        compounds = ['Aldrin'];
      }
    }

    const templateChildren = [];
    const numChildren = body.getNumChildren();
    for (let i = 0; i < numChildren; i++) {
      templateChildren.push(body.getChild(i).copy());
    }

    const sopConfig = CONFIG.SOP_CONFIG['chlor-huu-co'];

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
            const para = element.asParagraph();
            // Dùng findText để tìm chính xác dấu … (hoặc ...) mà không làm hỏng offset
            const found = para.findText('[…\\.]+');
            if (found) {
              const textEl = found.getElement().asText();
              const start = found.getStartOffset();
              const end = found.getEndOffsetInclusive();
              // Xóa placeholder TRƯỚC → chèn tên target SAU:
              // sau deleteText, insertText tại 'start' kế thừa định dạng văn bản xung quanh
              textEl.deleteText(start, end);
              textEl.insertText(start, compoundName.toUpperCase());
            } else {
              // Fallback: chèn vào cuối — dùng appendText để giữ định dạng ký tự cuối
              const textEl = para.editAsText();
              textEl.appendText(' ' + compoundName.toUpperCase());
            }
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

      fillChlorHuuCoSection2(pageElements, sopConfig, metadata, compoundName, samples);
    }

    cleanChlorHuuCoLastPageBreak(body);
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

    const sopConfig = CONFIG.SOP_CONFIG['chlor-huu-co'];

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

      fillChlorHuuCoSampleForElements(pageElements, sopConfig, metadata, samples[s]);
    }

    cleanChlorHuuCoLastPageBreak(body);
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

    const COMPOUND_TO_FIRESTORE_ID = {
      'Aldrin': 'aldrin',
      'BHCa': 'bhc-alpha_benzene_hexachloride',
      'BHCb': 'bhc-beta',
      'BHCd': 'bhc-delta',
      'BHCe': 'bhc-epsilon',
      'BHCg': 'bhc-gamma_lindane_gamma_hch',
      'BHC-alpha': 'bhc-alpha_benzene_hexachloride',
      'BHC-beta': 'bhc-beta',
      'BHC-delta': 'bhc-delta',
      'BHC-epsilon': 'bhc-epsilon',
      'BHC-gamma': 'bhc-gamma_lindane_gamma_hch',
      'Chlordane_cis': 'chlordane-cis_alpha',
      'Chlordane_oxy': 'chlordane-oxy',
      'Chlordane_trans': 'chlordane-trans_gamma',
      'Chlordane-cis': 'chlordane-cis_alpha',
      'Chlordane-oxy': 'chlordane-oxy',
      'Chlordane-trans': 'chlordane-trans_gamma',
      'DDD_op': 'ddd-op',
      'DDD-o,p': 'ddd-op',
      'DDD_pp': 'ddd-pp',
      'DDD-p,p': 'ddd-pp',
      'DDE_op': 'dde-op',
      'DDE-o,p': 'dde-op',
      'DDE_pp': 'dde-pp',
      'DDE-p,p': 'dde-pp',
      'DDT_op': 'ddt-op',
      'DDT-o,p': 'ddt-op',
      'DDT_pp': 'ddt-pp',
      'DDT-p,p': 'ddt-pp',
      'Dieldrin': 'dieldrin',
      'Endosulfan1': 'endosulfan_i_alpha_isomer',
      'Endosulfan2': 'endosulfan_ii_beta_isomer',
      'EndosulfanS': 'endosulfan_sulfate',
      'Endosulfan-I': 'endosulfan_i_alpha_isomer',
      'Endosulfan-II': 'endosulfan_ii_beta_isomer',
      'Endosulfan-sulfate': 'endosulfan_sulfate',
      'Endrin': 'endrin',
      'Heptachlor': 'heptachlor',
      'HeptachlorA': 'heptachlor_endo-epoxide_isomer_a',
      'HeptachlorB': 'heptachlor_exo-epoxide_isomer_b',
      'Heptachlor-epoxide-trans': 'heptachlor_endo-epoxide_isomer_a',
      'Heptachlor-epoxide-cis': 'heptachlor_exo-epoxide_isomer_b',
      'HCB': 'hexachlorobenzene',
      'Hexachlorobenzene': 'hexachlorobenzene',
      'Isodrin': 'isodrin',
      'Methoxychlor': 'methoxychlor_pp-',
      'Mirex': 'mirex',
      'Pendimethalin': 'pendimethalin'
    };

    const aliases = {
      'BHCa': ['BHCa', 'BHC-alpha'],
      'BHCb': ['BHCb', 'BHC-beta'],
      'BHCd': ['BHCd', 'BHC-delta'],
      'BHCe': ['BHCe', 'BHC-epsilon'],
      'BHCg': ['BHCg', 'BHC-gamma', 'lindane'],
      'Chlordane_cis': ['Chlordane_cis', 'Chlordane-cis'],
      'Chlordane_oxy': ['Chlordane_oxy', 'Chlordane-oxy'],
      'Chlordane_trans': ['Chlordane_trans', 'Chlordane-trans'],
      'DDD_op': ['DDD_op', 'DDD-o,p'],
      'DDD_pp': ['DDD_pp', 'DDD-p,p'],
      'DDE_op': ['DDE_op', 'DDE-o,p'],
      'DDE_pp': ['DDE_pp', 'DDE-p,p'],
      'DDT_op': ['DDT_op', 'DDT-o,p'],
      'DDT_pp': ['DDT_pp', 'DDT-p,p'],
      'Endosulfan1': ['Endosulfan1', 'Endosulfan-I'],
      'Endosulfan2': ['Endosulfan2', 'Endosulfan-II'],
      'EndosulfanS': ['EndosulfanS', 'Endosulfan-sulfate'],
      'HeptachlorA': ['HeptachlorA', 'Heptachlor-epoxide-trans'],
      'HeptachlorB': ['HeptachlorB', 'Heptachlor-epoxide-cis'],
      'HCB': ['HCB', 'Hexachlorobenzene']
    };

    const checkAssigned = function(assignedTargetIds, cKey) {
      const searchKeys = aliases[cKey] ? aliases[cKey] : [cKey];
      return assignedTargetIds.some(function(tId) {
        const lowerTId = tId.toLowerCase().trim();
        return searchKeys.some(function(key) {
          if (key.toLowerCase().trim() === lowerTId) return true;
          const firestoreId = COMPOUND_TO_FIRESTORE_ID[key];
          if (firestoreId && firestoreId.toLowerCase().trim() === lowerTId) return true;
          return false;
        });
      });
    };

    // Support consolidated/grouped sample list checking
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
    
    // 4.5. Xử lý điền các ô checkbox loại mẫu, khối lượng, tình trạng mẫu và kết quả chung
    try {
      // a. Khối lượng mẫu
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

      element.replaceText('m\\s*=\\s*[☐□☑]?\\s*10\\.0', 'm = ' + kl10Check + ' 10.0');
      if (klOtherText !== '………') {
        element.replaceText('10\\.0\\s*;\\s*[…\\.]+', '10.0 ; ' + klOtherText);
      }

      // Ghi đè lại placeholder {{khoiLuong}} cho Form Đơn nếu nó tồn tại
      element.replaceText('{{khoiLuong}}', khoiLuongVal);

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
    } catch (e) {
      Logger.log('[Report ChlorHuuCo] Lỗi điền metadata: ' + e.toString());
    }
    
    // 5. Điền trực tiếp kết quả kết luận vào bảng hoạt chất theo tọa độ ô và tên hoạt chất (KHÔNG CẦN PLACEHOLDER)
    fillType3bResultsTableDirectly(element, sopConfig, sample, isTargetAssignedForGas);
    
    // 5.5. Điền trực tiếp sắc ký đồ vào bảng sắc ký đồ mẫu (mục 9)
    fillChromatogramTableDirectly(element, sopConfig, sample, isTargetAssignedForGas);
    
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
      const numCols = t.getRow(0).getNumCells();
      const headerText = t.getRow(0).getText();
      if (numCols === 5 && !headerText.includes("sắc ký") && !headerText.includes("Sắc ký") && !headerText.includes("mẫu nền") && (cell0Text.includes("Aldrin") || cell1Text.includes("Aldrin"))) {
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
    'heptachlorendoepoxideisomera': 'HeptachlorA', 'heptachlor epoxide isomer a': 'HeptachlorA', 'heptachlorepoxideisomera': 'HeptachlorA',
    'heptachlorexoepoxideisomerb': 'HeptachlorB', 'heptachlor epoxide isomer b': 'HeptachlorB', 'heptachlorepoxideisomerb': 'HeptachlorB',
    'heptachlora': 'HeptachlorA', 'heptachlor-epoxide-trans': 'HeptachlorA', 'heptachlor epoxide trans': 'HeptachlorA',
    'heptachlorb': 'HeptachlorB', 'heptachlor-epoxide-cis': 'HeptachlorB', 'heptachlor epoxide cis': 'HeptachlorB',
    'heptachlor': 'Heptachlor',
    'hcb': 'HCB', 'hexachlorobenzene': 'HCB',
    'isodrin': 'Isodrin',
    'methoxychlor': 'Methoxychlor',
    'mirex': 'Mirex',
    'pendimethalin': 'Pendimethalin'
  };
  
  for (let r = 0; r < numRows; r++) {
    const row = resultsTable.getRow(r);
    const cell0TextRaw = row.getCell(0).getText().trim();
    const cell0Text = cell0TextRaw.toLowerCase().replace(/[\s\-\'\’\_]/g, '');
    
    // Bỏ qua các dòng trống hoặc dòng tiêu đề, đánh giá QC ở cuối bảng
    if (!cell0Text || cell0Text.length < 3) {
      continue;
    }
    
    if (cell0Text.includes("đảmbảochấtlượng") || 
        cell0Text.includes("độthuhồi") || 
        cell0Text.includes("hệsốtuyếntính") || 
        cell0Text.includes("kếtluận") ||
        cell0Text.includes("thôngsốđánhgiá") ||
        cell0Text.includes("đánhgiáchung") ||
        cell0Text.includes("mẫukiểmtranộibộ") ||
        cell0Text.includes("độlệchthờigianlưu") ||
        cell0Text.includes("đápsố") ||
        cell0Text.includes("hiệuchuẩn")) {
      continue;
    }
    
    // Tìm key khớp từ cell0Text
    let matchedKey = null;
    const matchSearchKey = cell0TextRaw.toLowerCase().replace(/[^a-z0-9αβγδε]/g, '');
    
    // Bước 1: Khớp chính xác hoàn toàn (Tuyệt đối an toàn)
    for (const [rawText, key] of Object.entries(tableTextToKey)) {
      const normalizedRawText = rawText.toLowerCase().replace(/[^a-z0-9αβγδε]/g, '');
      if (normalizedRawText && matchSearchKey === normalizedRawText) {
        matchedKey = key;
        break;
      }
    }
    
    // Bước 2: Khớp substring có bảo vệ (Chỉ chạy nếu Bước 1 không tìm thấy)
    if (!matchedKey) {
      const sortedEntries = Object.entries(tableTextToKey).sort(function(a, b) {
        return b[0].length - a[0].length;
      });
      for (const entry of sortedEntries) {
        const rawText = entry[0];
        const key = entry[1];
        const normalizedRawText = rawText.toLowerCase().replace(/[^a-z0-9αβγδε]/g, '');
        if (normalizedRawText) {
          // Bảo vệ: Quyết không cho Heptachlor mẹ khớp vào epoxide của nó
          if (normalizedRawText === 'heptachlor' && matchSearchKey.indexOf('epoxide') !== -1) {
            continue;
          }
          if (matchSearchKey.indexOf(normalizedRawText) !== -1 || normalizedRawText.indexOf(matchSearchKey) !== -1) {
            matchedKey = key;
            break;
          }
        }
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
        const kqValRaw = sample[key] !== undefined && sample[key] !== null ? sample[key].toString() : '';
        
        const kqUpper = kqValRaw.toUpperCase();
        const isKphString = kqUpper === 'KPH' || (kqUpper.includes(':') && kqUpper.split(';').every(p => {
            const res = p.includes(':') ? p.split(':')[1].trim() : p.trim();
            return res === 'KPH' || res === 'ND' || res === 'N/A' || res === '—' || res === '';
        }));
        
        const isKph = kqUpper === 'ND' || kqUpper === 'N/A' || kqUpper === '—' || kqUpper === '' || isKphString;
        const kqVal = isKph ? '' : kqValRaw;
        
        const ndVal = (sample[key + '_nd'] === true || isKphString) ? '☑' : '☐';
        
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
        setCellText(row, 1, `${prefix}    ${ndVal} ND`, 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 2, `${qc1Dat} Đ           ${qc1Kd} KĐ`, 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 3, `${qc2Dat} Đ           ${qc2Kd} KĐ`, 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 4, `${qc3Dat} Đ           ${qc3Kd} KĐ`, 0, sopConfig.defaultFontSize || 9);
      }
    }
  }
  return true;
}

/**
 * Điền trực tiếp các trạng thái tích chọn sắc ký đồ vào bảng mục 9 (cột index 1: Mẫu thử, 2: Mẫu nền, 3: Mẫu thu hồi)
 */
function fillChromatogramTableDirectly(element, sopConfig, sample, isTargetAssignedForGas) {
  let tables = [];
  if (element.getType() === DocumentApp.ElementType.TABLE) {
    tables.push(element.asTable());
  } else if (typeof element.getTables === 'function') {
    tables = element.getTables();
  }
  
  let chromTable = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() >= 10) {
      const numCols = t.getRow(0).getNumCells();
      const cell0Text = t.getRow(1).getCell(0).getText();
      const cell1Text = t.getRow(2).getCell(0).getText();
      if (numCols === 4 && (cell0Text.includes("Aldrin") || cell1Text.includes("Aldrin"))) {
        chromTable = t;
        break;
      }
    }
  }
  
  if (!chromTable) {
    Logger.log("[Type3B Direct] Không tìm thấy bảng sắc ký đồ hoạt chất mục 9!");
    return false;
  }
  
  const numRows = chromTable.getNumRows();
  
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
    'endosulfan1': 'Endosulfan1', 'endosulfan-i': 'Endosulfan1', 'endosulfan-1': 'Endosulfan1',
    'endosulfan2': 'Endosulfan2', 'endosulfan-ii': 'Endosulfan2', 'endosulfan-2': 'Endosulfan2',
    'endosulfans': 'EndosulfanS', 'endosulfan-sulfate': 'EndosulfanS', 'endosulfansulfate': 'EndosulfanS',
    'endrin': 'Endrin',
    'endrin_aldehyde': 'Endrin_aldehyde', 'endrin-aldehyde': 'Endrin_aldehyde',
    'endrin_ketone': 'Endrin_ketone', 'endrin-ketone': 'Endrin_ketone',
    'heptachlorendoepoxideisomera': 'HeptachlorA', 'heptachlor epoxide isomer a': 'HeptachlorA', 'heptachlorepoxideisomera': 'HeptachlorA',
    'heptachlorexoepoxideisomerb': 'HeptachlorB', 'heptachlor epoxide isomer b': 'HeptachlorB', 'heptachlorepoxideisomerb': 'HeptachlorB',
    'heptachlora': 'HeptachlorA', 'heptachlor-epoxide-trans': 'HeptachlorA', 'heptachlor-epoxide-b': 'HeptachlorA', 'trans-heptachlor-epoxide': 'HeptachlorA',
    'heptachlorb': 'HeptachlorB', 'heptachlor-epoxide-cis': 'HeptachlorB', 'heptachlor-epoxide-a': 'HeptachlorB', 'cis-heptachlor-epoxide': 'HeptachlorB',
    'heptachlor': 'Heptachlor',
    'hcb': 'HCB', 'hexachlorobenzene': 'HCB',
    'methoxychlor': 'Methoxychlor',
    'isodrin': 'Isodrin'
  };
  
  for (let r = 0; r < numRows; r++) {
    const row = chromTable.getRow(r);
    const cell0TextRaw = row.getCell(0).getText().trim();
    const cell0Text = cell0TextRaw.toLowerCase().replace(/[\s\-\'\’\_]/g, '');
    
    // Bỏ qua các dòng trống hoặc dòng tiêu đề, đánh giá QC ở cuối bảng
    if (!cell0Text || cell0Text.length < 3) {
      continue;
    }
    
    if (cell0Text.includes("đảmbảochấtlượng") || 
        cell0Text.includes("độthuhồi") || 
        cell0Text.includes("hệsốtuyếntính") || 
        cell0Text.includes("kếtluận") ||
        cell0Text.includes("thôngsốđánhgiá") ||
        cell0Text.includes("đánhgiáchung") ||
        cell0Text.includes("mẫukiểmtranộibộ") ||
        cell0Text.includes("độlệchthờigianlưu") ||
        cell0Text.includes("đápsố") ||
        cell0Text.includes("hiệuchuẩn")) {
      continue;
    }
    
    // Tìm key khớp từ cell0Text
    let matchedKey = null;
    const matchSearchKey = cell0TextRaw.toLowerCase().replace(/[^a-z0-9αβγδε]/g, '');
    
    // Bước 1: Khớp chính xác hoàn toàn (Tuyệt đối an toàn)
    for (const [rawText, key] of Object.entries(tableTextToKey)) {
      const normalizedRawText = rawText.toLowerCase().replace(/[^a-z0-9αβγδε]/g, '');
      if (normalizedRawText && matchSearchKey === normalizedRawText) {
        matchedKey = key;
        break;
      }
    }
    
    // Bước 2: Khớp substring có bảo vệ (Chỉ chạy nếu Bước 1 không tìm thấy)
    if (!matchedKey) {
      const sortedEntries = Object.entries(tableTextToKey).sort(function(a, b) {
        return b[0].length - a[0].length;
      });
      for (const entry of sortedEntries) {
        const rawText = entry[0];
        const key = entry[1];
        const normalizedRawText = rawText.toLowerCase().replace(/[^a-z0-9αβγδε]/g, '');
        if (normalizedRawText) {
          // Bảo vệ: Quyết không cho Heptachlor mẹ khớp vào epoxide của nó
          if (normalizedRawText === 'heptachlor' && matchSearchKey.indexOf('epoxide') !== -1) {
            continue;
          }
          if (matchSearchKey.indexOf(normalizedRawText) !== -1 || normalizedRawText.indexOf(matchSearchKey) !== -1) {
            matchedKey = key;
            break;
          }
        }
      }
    }
    
    if (matchedKey) {
      const key = matchedKey;
      const isAssigned = isTargetAssignedForGas(sample.maSoMau, key);
      
      if (!isAssigned) {
        setCellText(row, 1, "—", 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 2, "—", 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 3, "—", 0, sopConfig.defaultFontSize || 9);
      } else {
        const kqVal = sample[key] !== undefined && sample[key] !== null ? sample[key].toString() : '';
        const ndVal = sample[key + '_nd'] === true ? '☑' : '☐';
        const isDetected = (kqVal !== '' || ndVal === '☑');
        
        const mauThuText = isDetected ? "☑ ND" : "☐ ND";
        const mauNenText = "☐ ND";
        const mauThuHoiText = "☑ Đ";
        
        setCellText(row, 1, mauThuText, 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 2, mauNenText, 0, sopConfig.defaultFontSize || 9);
        setCellText(row, 3, mauThuHoiText, 0, sopConfig.defaultFontSize || 9);
      }
    }
  }
  return true;
}


function fillChlorHuuCoSection2(elements, sopConfig, metadata, compoundName, samples) {
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
    const fSize = sopConfig.defaultFontSize || 13;
    for (let i = 0; i < 6; i++) {
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
    setCellText(calibTable.getRow(7), 1, r2Val, null, fSize);
  }

  // Helper inside function to map compound to backend key
  function mapCompoundToKey(cName) {
    const tableTextToKey = {
      'aldrin': 'Aldrin',
      'bhca': 'BHCa', 'bhcalpha': 'BHCa', 'alphabhc': 'BHCa', 'αbhc': 'BHCa',
      'bhcb': 'BHCb', 'bhcbeta': 'BHCb', 'betabhc': 'BHCb', 'βbhc': 'BHCb',
      'bhcd': 'BHCd', 'bhcdelta': 'BHCd', 'deltabhc': 'BHCd', 'δbhc': 'BHCd',
      'bhce': 'BHCe', 'bhcepsilon': 'BHCe', 'epsilonbhc': 'BHCe', 'εbhc': 'BHCe',
      'bhcg': 'BHCg', 'bhcgamma': 'BHCg', 'gammabhc': 'BHCg', 'γbhc': 'BHCg', 'lindane': 'BHCg',
      'chlordanecis': 'Chlordane_cis', 'cischlordane': 'Chlordane_cis',
      'chlordaneoxy': 'Chlordane_oxy', 'oxychlordane': 'Chlordane_oxy',
      'chlordanetrans': 'Chlordane_trans', 'transchlordane': 'Chlordane_trans',
      'dddop': 'DDD_op', 'opddd': 'DDD_op',
      'dddpp': 'DDD_pp', 'ppddd': 'DDD_pp',
      'ddeop': 'DDE_op', 'opdde': 'DDE_op',
      'ddepp': 'DDE_pp', 'ppdde': 'DDE_pp',
      'ddtop': 'DDT_op', 'opddt': 'DDT_op',
      'ddtpp': 'DDT_pp', 'ppddt': 'DDT_pp',
      'dieldrin': 'Dieldrin',
      'endosulfan1': 'Endosulfan1', 'endosulfani': 'Endosulfan1', 'alphaendosulfan': 'Endosulfan1',
      'endosulfan2': 'Endosulfan2', 'endosulfanii': 'Endosulfan2', 'betaendosulfan': 'Endosulfan2',
      'endosulfans': 'EndosulfanS', 'endosulfansulfate': 'EndosulfanS',
      'endrin': 'Endrin',
      'heptachlorendoepoxideisomera': 'HeptachlorA', 'heptachlorepoxideisomera': 'HeptachlorA', 'heptachlorepoxideisomertrans': 'HeptachlorA',
      'heptachlorexoepoxideisomerb': 'HeptachlorB', 'heptachlorepoxideisomerb': 'HeptachlorB', 'heptachlorepoxideisomerck': 'HeptachlorB', 'heptachlorepoxideisomerdecis': 'HeptachlorB',
      'heptachlora': 'HeptachlorA', 'heptachlorepoxicetrans': 'HeptachlorA', 'heptachlorepoxidetrans': 'HeptachlorA',
      'heptachlorb': 'HeptachlorB', 'heptachlorepoxicecis': 'HeptachlorB', 'heptachlorepoxidecis': 'HeptachlorB',
      'heptachlor': 'Heptachlor',
      'hcb': 'HCB', 'hexachlorobenzene': 'HCB',
      'isodrin': 'Isodrin',
      'methoxychlor': 'Methoxychlor',
      'mirex': 'Mirex',
      'pendimethalin': 'Pendimethalin'
    };
    const searchKey = cName.toLowerCase().replace(/[\s\-\'\_,]/g, '');
    return tableTextToKey[searchKey] || cName;
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
            resVal = s.compoundResults[mapCompoundToKey(compoundName)] || 'ND';
          }
          let noteVal = '';
          if (s.compoundNotes && compoundName) {
            noteVal = (s.compoundNotes[mapCompoundToKey(compoundName)] || '').trim();
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
        const newRow = prepTable.copy().getRow(numDataRows).copy(); // copy row template properly
        prepTable.appendRow(newRow);
        const row = prepTable.getRow(i + 1);
        
        let cell4Text = '';
        let cell5Text = '';
        if (isDon) {
          let resVal = 'ND';
          if (s.compoundResults && compoundName) {
            resVal = s.compoundResults[mapCompoundToKey(compoundName)] || 'ND';
          }
          let noteVal = '';
          if (s.compoundNotes && compoundName) {
            noteVal = (s.compoundNotes[mapCompoundToKey(compoundName)] || '').trim();
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
