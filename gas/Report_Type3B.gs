
function generateType3bReport(body, sopConfig, metadata, samples) {
  const printFormType = metadata.printFormType || 'formCheck';
  
  const numChildren = body.getNumChildren();
  const children = [];
  for (let i = 0; i < numChildren; i++) {
    children.push(body.getChild(i).copy());
  }

  if (printFormType === 'formDon') {
    // === FORM ĐƠN ===
    // Lặp theo từng hoạt chất (1 hoạt chất = 1 trang)
    let compounds = metadata.compoundsToPrint || [];
    if (compounds.length === 0) {
      if (metadata.activeCompound) {
        compounds = [metadata.activeCompound];
      } else if (sopConfig.compounds && sopConfig.compounds.length > 0) {
        compounds = [sopConfig.compounds[0]];
      } else {
        compounds = [''];
      }
    }
    
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
        for (let i = 0; i < children.length; i++) {
          const cloned = children[i].copy();
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
      
      // Xử lý điền tên hoạt chất vào header (XÁC ĐỊNH DƯ LƯỢNG ...)
      if (compoundName) {
        for (const element of pageElements) {
          if (element.getType() === DocumentApp.ElementType.PARAGRAPH) {
            const pText = element.asParagraph().getText();
            if (pText.includes("XÁC ĐỊNH DƯ LƯỢNG") || pText.includes("XAC DINH DU LUONG")) {
              const para = element.asParagraph();
              const found = para.findText('[…\\.]+');
              if (found) {
                try {
                  const textEl = found.getElement().asText();
                  const start = found.getStartOffset();
                  const end = found.getEndOffsetInclusive();
                  textEl.deleteText(start, end);
                  textEl.insertText(start, compoundName.toUpperCase());
                } catch(e) {}
              } else {
                try {
                  const textEl = para.editAsText();
                  textEl.appendText(' ' + compoundName.toUpperCase());
                } catch(e) {}
              }
            }
          }
        }
      }
      
      // Với form Đơn, mẫu phân tích là mẫu đầu tiên (nếu có)
      const sampleToUse = samples.length > 0 ? samples[0] : {};
      fillType3bSampleForElements(pageElements, sopConfig, metadata, sampleToUse);
      _fillFormDonTablesDynamically(pageElements, metadata, samples, compoundName, sopConfig);
    }
    
  } else {
    // === FORM CHECK ===
    // Lặp theo từng mẫu (1 mẫu = 1 trang)
    if (samples.length > 0) {
      fillType3bSample(body, sopConfig, metadata, samples[0]);
    }
  
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
      fillType3bSampleForElements(tempContainer, sopConfig, metadata, samples[s]);
    }
  }
  
  cleanLastPageBreak(body);
}

/**
 * Helper điền dữ liệu mẫu 3B cấp độ body chính
 */
function fillType3bSample(body, sopConfig, metadata, sample) {
  fillType3bSampleForElements([body], sopConfig, metadata, sample);
}

/**
 * Helper thay thế placeholder và điền kết quả cho mẫu dạng 3B trên danh sách các phần tử
 */
function fillType3bSampleForElements(elements, sopConfig, metadata, sample) {
  const allFields = { ...metadata, ...sample };
  
  // Bộ lọc chỉ định (Target Assignment Resolver) — V2: Canonical ID
  const sampleTargetMap = metadata.sampleTargetMap || (metadata.inputs && metadata.inputs.sampleTargetMap) || null;
  const isTargetAssignedForGas = function(sampleCode, compoundDisplayName) {
    if (!sampleTargetMap || !sampleCode || !compoundDisplayName) return true;
    
    // Bước 1: Chuyển display name → canonical id qua COMPOUND_TO_CANONICAL
    const canonicalId = (typeof COMPOUND_TO_CANONICAL !== 'undefined' && COMPOUND_TO_CANONICAL[compoundDisplayName])
      ? COMPOUND_TO_CANONICAL[compoundDisplayName]
      : compoundDisplayName.toLowerCase().replace(/[^a-z0-9\-_]/g, '');
    
    const subCodes = sampleCode.split(';').map(s => s.trim()).filter(Boolean);
    const codesToCheck = subCodes.length > 0 ? subCodes : [sampleCode];
    
    for (const sc of codesToCheck) {
      const matchKey = Object.keys(sampleTargetMap).find(k => k.toLowerCase().trim() === sc.toLowerCase().trim());
      const assignedTargetIds = matchKey ? sampleTargetMap[matchKey] : null;
      
      // Fallback an toàn: nếu không tìm thấy cấu hình của mẫu này → hiển thị tất cả
      if (!assignedTargetIds || assignedTargetIds.length === 0) return true;
      
      // Bước 2: So sánh canonical id trực tiếp (fast path)
      if (assignedTargetIds.includes(canonicalId)) return true;
      
      // Bước 3: Fallback fuzzy — cho dữ liệu cũ chưa migrate hoặc edge cases
      const cNorm = canonicalId.replace(/[^a-z0-9]/g, '');
      const hasMatch = assignedTargetIds.some(tId => {
        const tNorm = tId.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Bảo vệ: tránh Heptachlor khớp nhầm Heptachlor-epoxide
        if (cNorm === 'heptachlor' && tNorm.includes('epoxide')) return false;
        if (tNorm === 'heptachlor' && cNorm.includes('epoxide')) return false;
        return tNorm === cNorm;
      });
      if (hasMatch) return true;
    }
    return false;
  };
  
  for (const element of elements) {


    // 1. Thay thế thông tin mẻ và mã số mẫu cơ bản
    element.replaceText('{{MaSoMau}}', sample.maSoMau || '');
    element.replaceText('1. Mã số mẫu:', '1. Mã số mẫu:  ' + (sample.maSoMau || ''));
    
    // 1.0.1 custom: Điền Mã hồ sơ
    try {
      const maHoSoVal = (metadata.maHoSo || "").trim();
      if (maHoSoVal) {
        let found = element.findText('(?i)Mã\\s*hồ\\s*sơ[^:\\n]*:');
        while (found) {
          const textElement = found.getElement().asText();
          const end = found.getEndOffsetInclusive();
          const fullText = textElement.getText();
          
          let cursor = end + 1;
          while (cursor < fullText.length && fullText[cursor] === ' ') {
            cursor++;
          }
          
          let hasDots = false;
          let dotsEnd = cursor;
          while (dotsEnd < fullText.length && (fullText[dotsEnd] === '.' || fullText[dotsEnd] === '…')) {
            hasDots = true;
            dotsEnd++;
          }
          
          if (hasDots) {
            textElement.deleteText(cursor, dotsEnd - 1);
            textElement.insertText(cursor, maHoSoVal);
          } else {
            if (end + 1 < fullText.length && fullText[end + 1] === ' ') {
              textElement.insertText(end + 2, maHoSoVal);
            } else {
              textElement.insertText(end + 1, ' ' + maHoSoVal);
            }
          }
          
          found = element.findText('(?i)Mã\\s*hồ\\s*sơ[^:\\n]*:', found);
        }
      }
    } catch (e) {
      Logger.log(`[Type3BCustom] Lỗi khi điền Mã hồ sơ: ${e.toString()}`);
    }

    // 1.0.2 custom: Điền bảng đường chuẩn (6 dòng)
    try {
      let tables = [];
      if (element.getType() === DocumentApp.ElementType.TABLE) {
        tables.push(element.asTable());
      } else if (typeof element.getTables === 'function') {
        tables = element.getTables();
      }
      
      let calibrationTable = null;
      for (let t = 0; t < tables.length; t++) {
        const candidate = tables[t];
        if (candidate.getNumRows() === 6) {
          const cellText = candidate.getRow(0).getCell(0).getText();
          if (cellText.includes("Điểm chuẩn") || cellText.includes("Vial No") || cellText.includes("Vial") || cellText.includes("Điểm")) {
            calibrationTable = candidate;
            break;
          }
        }
      }

      if (calibrationTable) {
        const calibPoints = metadata.calibPoints || [];
        const numRows = calibrationTable.getNumRows();
        for (let i = 0; i < Math.min(calibPoints.length, numRows - 1); i++) {
          const pt = calibPoints[i] || { vialNo: '', loSo: '', hamLuong: '' };
          const rowIdx = 1 + i;
          const row = calibrationTable.getRow(rowIdx);
          
          const hRow = calibrationTable.getRow(0);
          let vialCol = -1, nongDoCol = -1;
          for (let c = 0; c < hRow.getNumCells(); c++) {
            const txt = hRow.getCell(c).getText().toLowerCase();
            if (txt.includes('vial') || txt.includes('lọ') || txt.includes('lo')) vialCol = c;
            if (txt.includes('nồng độ') || txt.includes('nong do') || txt.includes('ppb') || txt.includes('µg') || txt.includes('ng')) nongDoCol = c;
          }
          if (vialCol === -1) vialCol = 1;
          if (nongDoCol === -1) nongDoCol = 2;
          
          try {
            if (vialCol >= 0 && vialCol < row.getNumCells()) {
              row.getCell(vialCol).setText(pt.vialNo || pt.loSo || '');
            }
            if (nongDoCol >= 0 && nongDoCol < row.getNumCells() && pt.hamLuong !== undefined && pt.hamLuong !== null) {
              row.getCell(nongDoCol).setText(pt.hamLuong.toString());
            }
          } catch(e) {}
        }
        
        // Điền hệ số R2
        const r2Val = (metadata.r2 || metadata.R2 || '').toString();
        if (r2Val) {
          for (let r = 0; r < numRows; r++) {
            const rowText = calibrationTable.getRow(r).getText().toLowerCase();
            if (rowText.includes('r2') || rowText.includes('r²')) {
              const row = calibrationTable.getRow(r);
              const lastCell = row.getCell(row.getNumCells() - 1);
              const cellText = lastCell.getText();
              if (cellText.includes('…') || cellText.includes('...')) {
                if (typeof replaceDotsSafely === 'function') {
                  replaceDotsSafely(lastCell, '[…\\.]{2,}', r2Val);
                } else {
                  lastCell.setText(cellText.replace(/[…\.]+/, r2Val));
                }
              } else {
                lastCell.setText(r2Val);
              }
            }
          }
        }
      }
    } catch (e) {
      Logger.log(`[Type3BCustom] Lỗi khi điền bảng đường chuẩn: ${e.toString()}`);
    }

    // 1.1 Gọi hàm dùng chung để tick Checkbox Khối lượng, Loại mẫu, Tình trạng mẫu
    fillCommonSampleCheckboxes(element, metadata, sample);
    
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
        // 2.1 Thay thế Blank và Spike (nếu có dấu chấm)
      if (metadata.blankName) {
        if (typeof replaceDotsSafely === 'function') {
          replaceDotsSafely(element, 'Mẫu trắng:\\s*[\\.\\?]+', metadata.blankName);
          replaceDotsSafely(element, 'Blank:\\s*[\\.\\?]+', metadata.blankName);
        }
      }
      if (metadata.spikeName) {
        if (typeof replaceDotsSafely === 'function') {
          replaceDotsSafely(element, 'Mẫu thêm chuẩn:\\s*[\\.\\?]+', metadata.spikeName);
          replaceDotsSafely(element, 'Thêm chuẩn:\\s*[\\.\\?]+', metadata.spikeName);
          replaceDotsSafely(element, 'Spike:\\s*[\\.\\?]+', metadata.spikeName);
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
    
    // 5. Thay thế kết quả kết luận cho từng hoạt chất riêng biệt bằng mã hóa gọn (K1, N1, A1...)
    // (Dành cho form cũ hoặc nếu có định nghĩa resultColumns)
    if (sopConfig.resultColumns) {
      for (let idx = 1; idx <= sopConfig.resultColumns.length; idx++) {
        const col = sopConfig.resultColumns[idx - 1];
        const key = col.key;
        const kqVal = sample[key] !== undefined && sample[key] !== null ? sample[key].toString() : '';
        const ndVal = sample[key + '_nd'] === true ? '☑' : '☐';
        const qc1Val = sample[key + '_qc1'] || '☐';
        const qc2Val = sample[key + '_qc2'] || '☐';
        const qc3Val = sample[key + '_qc3'] || '☐';
        
        element.replaceText(`{{K${idx}}}`, kqVal);
        element.replaceText(`{{N${idx}}}`, ndVal);
        element.replaceText(`{{A${idx}}}`, qc1Val === 'Đạt' || qc1Val === '☑' ? '☑' : '☐');
        element.replaceText(`{{B${idx}}}`, qc1Val === 'Không đạt' || qc1Val === '☒' || qc1Val === 'Không Đạt' ? '☑' : '☐');
        element.replaceText(`{{C${idx}}}`, qc2Val === 'Đạt' || qc2Val === '☑' ? '☑' : '☐');
        element.replaceText(`{{D${idx}}}`, qc2Val === 'Không đạt' || qc2Val === '☒' || qc2Val === 'Không Đạt' ? '☑' : '☐');
        element.replaceText(`{{E${idx}}}`, qc3Val === 'Đạt' || qc3Val === '☑' ? '☑' : '☐');
        element.replaceText(`{{F${idx}}}`, qc3Val === 'Không đạt' || qc3Val === '☒' || qc3Val === 'Không Đạt' ? '☑' : '☐');
      }
    }
    
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
          const numRows = t.getNumRows();
          for (let r = 1; r < numRows; r++) {
            const row = t.getRow(r);
            const labelText = row.getCell(0).getText().trim();
            
            let fieldName = null;
            if (checkboxLines) {
              for (const [keyText, fName] of Object.entries(checkboxLines)) {
                if (labelText.includes(keyText) || keyText.includes(labelText)) {
                  fieldName = fName;
                  break;
                }
              }
            }
            // Fallback if not mapped
            if (!fieldName) {
              if (labelText.includes('Mẫu trắng') || labelText.includes('Blank')) fieldName = 'checkMauTrang';
              else if (labelText.includes('Mẫu thêm chuẩn') || labelText.includes('Spike')) fieldName = 'checkMauThemChuan';
              else if (labelText.includes('Hiệu suất thu hồi')) fieldName = 'checkHieuSuatThuHoi';
              else if (labelText.includes('Độ chụm')) fieldName = 'checkDoChum';
            }

            if (fieldName) {
              // Default to true (Đạt) if undefined in metadata/sample
              const val = allFields[fieldName] !== undefined ? allFields[fieldName] : true;
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
      
      // 7. Xử lý điền Kết quả và QC cho TỪNG HOẠT CHẤT riêng biệt (Nhóm Cúc, Lân...)
      if (sopConfig.compounds && sopConfig.compounds.length > 0) {
        for (let r = 0; r < t.getNumRows(); r++) {
          const row = t.getRow(r);
          const numCols = row.getNumCells();
          if (numCols < 2) continue;
          
          // Phân tách các ô trong dòng thành các "phân đoạn" (segments)
          // Để hỗ trợ cả bảng 1 cột (Nhóm Cúc/Chlor) và bảng 2 cột chia đôi (Nhóm Lân)
          let segments = [];
          for (let c = 0; c < numCols; c++) {
            const cellText = row.getCell(c).getText().trim();
            if (!cellText || cellText.length < 2) continue;
            
            let matchedCompound = null;
            const sortedComps = [...sopConfig.compounds].sort((a,b) => b.length - a.length);

            // 1. Khớp theo Canonical ID (Độc lập chính tả)
            const cellCanonical = (typeof COMPOUND_TO_CANONICAL !== 'undefined' && COMPOUND_TO_CANONICAL[cellText])
              ? COMPOUND_TO_CANONICAL[cellText]
              : cellText.toLowerCase().replace(/[^a-z0-9]/g, '');

            for (const comp of sortedComps) {
              const compCanonical = (typeof COMPOUND_TO_CANONICAL !== 'undefined' && COMPOUND_TO_CANONICAL[comp])
                ? COMPOUND_TO_CANONICAL[comp]
                : comp.toLowerCase().replace(/[^a-z0-9]/g, '');
              if (cellCanonical === compCanonical) {
                matchedCompound = comp;
                break;
              }
            }

            // 1.5 Khớp chính xác hoàn toàn (bỏ qua ký tự đặc biệt)
            if (!matchedCompound) {
              const exactNormCell = cellText.toLowerCase().replace(/[-_\\s',]/g, '');
              for (const comp of sortedComps) {
                if (comp.toLowerCase().replace(/[-_\\s',]/g, '') === exactNormCell) {
                  matchedCompound = comp;
                  break;
                }
              }
            }

            // 2. Khớp chuỗi con nếu không khớp canonical hay exact
            if (!matchedCompound) {
              const normCell = cellText.toLowerCase().replace(/[-_\\s',]/g, '');
              for (const comp of sortedComps) {
                const compNorm = comp.toLowerCase().replace(/[-_\\s',]/g, '');
                // Chỉ cho phép cell text chứa tên hoạt chất (vd: cell có chữ (ND)), 
                // hoặc ngược lại CHỈ KHI độ dài chênh lệch rất ít (tránh Parathion match Parathion-methyl)
                if ((normCell.includes(compNorm) || (compNorm.includes(normCell) && compNorm.length - normCell.length <= 2)) && cellText.length < 50) {
                  matchedCompound = comp;
                  break;
                }
              }
            }
            // 3. Xử lý các lỗi chính tả phổ biến trên biểu mẫu
            if (!matchedCompound) {
              const normCell = cellText.toLowerCase().replace(/[-_\\s',]/g, '');
              if (normCell.includes('chlorpyrofos') || normCell.includes('chlorpyriphos') || normCell.includes('chlorpyryfos') || normCell.includes('chlorpyrifos')) {
                matchedCompound = normCell.includes('methyl') ? 'Chlorpyryfos-methyl' : 'Chlorpyryfos';
              }
            }
            
            if (matchedCompound) {
              segments.push({ compound: matchedCompound, startCol: c });
            }
          }
          
          // Tính toán khoảng cột của mỗi phân đoạn (endCol)
          for (let s = 0; s < segments.length; s++) {
            segments[s].endCol = (s < segments.length - 1) ? (segments[s+1].startCol - 1) : (numCols - 1);
          }
          
          // Xử lý từng phân đoạn độc lập
          for (const seg of segments) {
            const { compound, startCol, endCol } = seg;
            if (startCol >= endCol) continue; // Không có cột kết quả nào
            
            const segmentCells = [];
            for (let c = startCol + 1; c <= endCol; c++) {
              segmentCells.push(row.getCell(c));
            }
            
            const isAssigned = isTargetAssignedForGas(sample.maSoMau, compound);
            
            if (!isAssigned) {
              // Hoạt chất KHÔNG được chỉ định (N/A) -> Tự động xoá trắng các dấu tick (nếu có sẵn trên form)
              for (const cell of segmentCells) {
                let foundNd = cell.findText('([☐□☑]|\\[\\s*[xXvV]?\\s*\\]|\\(\\s*[xXvV]?\\s*\\))[^A-Za-z0-9]*ND');
                if (foundNd) {
                  try {
                    const textElement = foundNd.getElement().asText();
                    const start = foundNd.getStartOffset();
                    const match = textElement.getText().substring(start, foundNd.getEndOffsetInclusive() + 1).match(/([☐□☑]|\[\s*[xXvV]?\s*\]|\(\s*[xXvV]?\s*\))/);
                    if (match) {
                      const mStr = match[0].toLowerCase();
                      if (mStr === '☑' || mStr.includes('x') || mStr.includes('v')) {
                        const insertPos = start + match.index;
                        textElement.insertText(insertPos, '☐');
                        textElement.deleteText(insertPos + 1, insertPos + match[0].length);
                      }
                    }
                  } catch(e) {}
                }
              }
              _setNthQcCheckboxInCells(segmentCells, 0, 'Đ', false);
              _setNthQcCheckboxInCells(segmentCells, 0, 'KĐ', false);
              _setNthQcCheckboxInCells(segmentCells, 1, 'Đ', false);
              _setNthQcCheckboxInCells(segmentCells, 1, 'KĐ', false);
              _setNthQcCheckboxInCells(segmentCells, 2, 'Đ', false);
              _setNthQcCheckboxInCells(segmentCells, 2, 'KĐ', false);
              continue;
              
            } else {
              // Hoạt chất ĐƯỢC CHỈ ĐỊNH -> Điền kết quả và QC
              const payloadKey = _getPayloadKey(compound);
              const resultVal = sample[payloadKey] !== undefined && sample[payloadKey] !== null ? sample[payloadKey].toString() : '';
              const isNd = sample[payloadKey + '_nd'] === true;
              const qcList = [
                sample[payloadKey + '_qc1'],
                sample[payloadKey + '_qc2'],
                sample[payloadKey + '_qc3']
              ];
              
              // 7.1. Tìm checkbox ND và điền kết quả (dấu chấm) trong segment
              for (const cell of segmentCells) {
                let foundNd = cell.findText('([☐□☑]|\\[\\s*[xXvV]?\\s*\\]|\\(\\s*[xXvV]?\\s*\\))[^A-Za-z0-9]*ND');
                if (foundNd) {
                  try {
                    const textElement = foundNd.getElement().asText();
                    const start = foundNd.getStartOffset();
                    const match = textElement.getText().substring(start, foundNd.getEndOffsetInclusive() + 1).match(/([☐□☑]|\[\s*[xXvV]?\s*\]|\(\s*[xXvV]?\s*\))/);
                    if (match) {
                      const insertPos = start + match.index;
                      const charToInsert = isNd ? '☑' : '☐';
                      textElement.insertText(insertPos, charToInsert);
                      textElement.deleteText(insertPos + 1, insertPos + match[0].length);
                    }
                  } catch(e) {}
                  
                  // Điền số kết quả đè lên dãy dấu chấm
                  if (!isNd && resultVal) {
                    let foundDots = cell.findText('[…\\.]{2,}');
                    if (foundDots) {
                      try {
                        const dText = foundDots.getElement().asText();
                        const dStart = foundDots.getStartOffset();
                        const dMatch = dText.getText().substring(dStart, foundDots.getEndOffsetInclusive() + 1).match(/[…\.]{2,}/);
                        if (dMatch) {
                          const insertPos = dStart + dMatch.index;
                          dText.insertText(insertPos, resultVal);
                          const charsToDelete = Math.min(resultVal.length, dMatch[0].length);
                          dText.deleteText(insertPos + resultVal.length, insertPos + resultVal.length + charsToDelete - 1);
                        }
                      } catch(e) {}
                    }
                  }
                  break; // Xử lý xong phần kết quả của compound này
                }
              }
              
              // 7.2. Tìm và tick các ô QC Đ/KĐ theo thứ tự trong segment
              for (let i = 0; i < qcList.length; i++) {
                const qcStatus = qcList[i];
                if (qcStatus) {
                  const checkDat = (qcStatus === 'Đạt' || qcStatus === '☑');
                  const checkKhongDat = (qcStatus === 'Không đạt' || qcStatus === '☒' || qcStatus === 'Không Đạt');
                  
                  _setNthQcCheckboxInCells(segmentCells, i, 'Đ', checkDat);
                  _setNthQcCheckboxInCells(segmentCells, i, 'KĐ', checkKhongDat);
                }
              }
            }
          }
        }
      }
      
      // 8. Tự động điền Bảng Sắc Ký Đồ (Chromatogram Table)
      _fillGenericChromatogramTable(t, sample, sopConfig, isTargetAssignedForGas);
    }
  }
}

/**
 * Tự động dò và điền Bảng Sắc Ký Đồ (Mục 9) trong các report Type 3B
 */
function _fillGenericChromatogramTable(table, sample, sopConfig, isTargetAssignedForGas) {
  if (!sopConfig.compounds || sopConfig.compounds.length === 0) return;
  if (table.getNumRows() < 5) return; // Bảng sắc ký đồ thường dài
  
  const numCols = table.getRow(0).getNumCells();
  if (numCols < 3) return; // Cần ít nhất 3 cột (Hoạt chất, Mẫu nền, Mẫu thu hồi...)
  
  // Dò tìm xem bảng này có phải bảng Sắc ký đồ không (chứa tên hoạt chất, nhưng không chứa header "Kết quả" hay "Đánh giá")
  const headerText = table.getRow(0).getText().toLowerCase();
  if (headerText.includes('đánh giá') || headerText.includes('kết quả') || headerText.includes('tuyến tính') || headerText.includes('thu hồi r%')) {
    return; // Đây là bảng QC hoặc bảng Kết quả chính
  }
  
  // Kiểm tra 2-3 hàng đầu tiên xem có chứa ít nhất 1 hoạt chất không
  let isChromTable = false;
  for (let r = 1; r < Math.min(4, table.getNumRows()); r++) {
    const rowText = table.getRow(r).getText().toLowerCase();
    if (sopConfig.compounds.some(c => rowText.includes(c.toLowerCase()))) {
      isChromTable = true;
      break;
    }
  }
  
  for (let r = 1; r < table.getNumRows(); r++) {
    const row = table.getRow(r);
    const numCols = row.getNumCells();
    
    let segments = [];
    for (let c = 0; c < numCols; c++) {
      const cellText = row.getCell(c).getText().trim();
      if (!cellText || cellText.length < 2) continue;
      
      let matchedCompound = null;
      const sortedComps = [...sopConfig.compounds].sort((a,b) => b.length - a.length);

      // 1. Khớp theo Canonical ID (Độc lập chính tả)
      const cellCanonical = (typeof COMPOUND_TO_CANONICAL !== 'undefined' && COMPOUND_TO_CANONICAL[cellText])
        ? COMPOUND_TO_CANONICAL[cellText]
        : cellText.toLowerCase().replace(/[^a-z0-9]/g, '');

      for (const comp of sortedComps) {
        const compCanonical = (typeof COMPOUND_TO_CANONICAL !== 'undefined' && COMPOUND_TO_CANONICAL[comp])
          ? COMPOUND_TO_CANONICAL[comp]
          : comp.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cellCanonical === compCanonical) {
          matchedCompound = comp;
          break;
        }
      }

      // 2. Khớp chuỗi con nếu không khớp canonical
      if (!matchedCompound) {
        const normCell = cellText.toLowerCase().replace(/[-_\\s',]/g, '');
        for (const comp of sortedComps) {
          const compNorm = comp.toLowerCase().replace(/[-_\\s',]/g, '');
          if ((normCell.includes(compNorm) || compNorm.includes(normCell)) && cellText.length < 50) {
            matchedCompound = comp;
            break;
          }
        }
      }
      // 3. Xử lý các lỗi chính tả phổ biến trên biểu mẫu
      if (!matchedCompound) {
        const normCell = cellText.toLowerCase().replace(/[-_\\s',]/g, '');
        if (normCell.includes('chlorpyrofos') || normCell.includes('chlorpyriphos') || normCell.includes('chlorpyryfos') || normCell.includes('chlorpyrifos')) {
          matchedCompound = normCell.includes('methyl') ? 'Chlorpyryfos-methyl' : 'Chlorpyryfos';
        }
      }
      if (matchedCompound) {
        segments.push({ compound: matchedCompound, startCol: c });
      }
    }
    
    for (let s = 0; s < segments.length; s++) {
      segments[s].endCol = (s < segments.length - 1) ? (segments[s+1].startCol - 1) : (numCols - 1);
    }
    
    for (const seg of segments) {
      const { compound, startCol, endCol } = seg;
      if (startCol >= endCol) continue;
      
      const isAssigned = isTargetAssignedForGas(sample.maSoMau, compound);
      if (!isAssigned) {
        // Hoạt chất KHÔNG được chỉ định (N/A) -> Để nguyên form mặc định
        continue;
      } else {
        const payloadKey = _getPayloadKey(compound);
        const kqVal = sample[payloadKey] !== undefined && sample[payloadKey] !== null ? sample[payloadKey].toString() : '';
        const ndVal = sample[payloadKey + '_nd'] === true ? '☑' : '☐';
        const isDetected = (kqVal !== '' || ndVal === '☑');
        
        let ndCount = 0;
        for (let c = startCol + 1; c <= endCol; c++) {
          const cell = row.getCell(c);
          const cellText = cell.getText().toLowerCase();
          
          if (cellText.includes('nd')) {
            // Lần xuất hiện đầu tiên của ND trong segment là Mẫu thử
            if (ndCount === 0) {
              _replaceGenericCheckbox(cell, 'nd', isDetected);
            } 
            // Lần thứ hai là Mẫu nền (luôn ND)
            else if (ndCount === 1) {
              _replaceGenericCheckbox(cell, 'nd', true);
            }
            ndCount++;
          }
          if (cellText.includes('đ') && !cellText.includes('kđ')) {
            _replaceGenericCheckbox(cell, 'đ', true);
          }
        }
      }
    }
  }
}

function _setNthQcCheckboxInCells(cells, n, labelPattern, isChecked) {
  let matchIndex = 0;
  const pattern = '([☐□☑]|\\[\\s*\\]|\\(\\s*\\))\\s*' + labelPattern;
  
  for (const cell of cells) {
    let found = cell.findText(pattern);
    while (found) {
      let isFalseMatch = false;
      if (labelPattern === 'Đ' || labelPattern === 'đ') {
        try {
          const textElement = found.getElement().asText();
          const text = textElement.getText();
          const nextIndex = found.getEndOffsetInclusive() + 1;
          if (nextIndex < text.length && text.charAt(nextIndex) === 'ạ') {
            isFalseMatch = true;
          }
        } catch(e) {}
      }

      if (!isFalseMatch) {
        if (matchIndex === n) {
          try {
            const textElement = found.getElement().asText();
            const start = found.getStartOffset();
            const match = textElement.getText().substring(start, found.getEndOffsetInclusive() + 1).match(/([☐□☑]|\[\s*\]|\(\s*\))/);
            if (match) {
              textElement.insertText(start + match.index, isChecked ? '☑' : '☐');
              textElement.deleteText(start + match.index + 1, start + match.index + match[0].length);
            }
          } catch(e) {}
          return; // Đã tìm thấy và tick xong
        }
        matchIndex++;
      }
      found = cell.findText(pattern, found);
    }
  }
}

function _replaceGenericCheckbox(cell, labelPattern, isChecked) {
  const pattern = '([☐□☑]|\\[\\s*\\]|\\(\\s*\\))\\s*' + labelPattern;
  let found = cell.findText(pattern);
  while (found) {
    let isFalseMatch = false;
    if (labelPattern === 'Đ' || labelPattern === 'đ') {
      try {
        const textElement = found.getElement().asText();
        const text = textElement.getText();
        const nextIndex = found.getEndOffsetInclusive() + 1;
        if (nextIndex < text.length && text.charAt(nextIndex) === 'ạ') {
          isFalseMatch = true;
        }
      } catch(e) {}
    }

    if (!isFalseMatch) {
      try {
        const textElement = found.getElement().asText();
        const start = found.getStartOffset();
        const match = textElement.getText().substring(start, found.getEndOffsetInclusive() + 1).match(/([☐□☑]|\[\s*\]|\(\s*\))/);
        if (match) {
          textElement.insertText(start + match.index, isChecked ? '☑' : '☐');
          textElement.deleteText(start + match.index + 1, start + match.index + match[0].length);
        }
      } catch(e) {}
    }
    found = cell.findText(pattern, found);
  }
}

/**
 * Helper tìm và tick checkbox ở vị trí thứ n trong một dòng table (hỗ trợ nhiều QC liên tiếp)
 */
function _setNthQcCheckboxInRow(row, targetIndex, labelPattern, isChecked) {
  const pattern = '([☐□☑]|\\[\\s*\\]|\\(\\s*\\))\\s*' + labelPattern;
  let found = row.findText(pattern);
  let count = 0;
  
  while (found) {
    if (count === targetIndex) {
      try {
        const textElement = found.getElement().asText();
        const start = found.getStartOffset();
        const end = found.getEndOffsetInclusive();
        const textStr = textElement.getText().substring(start, end + 1);
        const match = textStr.match(/([☐□☑]|\[\s*\]|\(\s*\))/);
        
        if (match) {
          const insertPos = start + match.index;
          const charToInsert = isChecked ? '☑' : '☐';
          textElement.insertText(insertPos, charToInsert);
          textElement.deleteText(insertPos + 1, insertPos + match[0].length);
        }
      } catch(e) {}
      break;
    }
    found = row.findText(pattern, found);
    count++;
  }
}

/**
 * Dọn dẹp PageBreak thừa ở cuối tài liệu sau khi nhân bản trang
 */
function cleanLastPageBreak(body) {
  try {
    const numChildren = body.getNumChildren();
    if (numChildren > 0) {
      const lastChild = body.getChild(numChildren - 1);
      if (lastChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
        body.removeChild(lastChild);
        Logger.log("[Autocut 3B] Đã xóa PageBreak thừa cuối tài liệu.");
      }
    }
  } catch(e) {
    Logger.log(`[Autocut 3B] Không thể dọn dẹp PageBreak cuối: ${e.toString()}`);
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

function _getPayloadKey(compoundName) {
  // V2: Lookup canonical id từ COMPOUND_TO_CANONICAL — canonical id là Firestore key sau migration
  if (typeof COMPOUND_TO_CANONICAL !== 'undefined') {
    // 1. Khop chinh xac
    if (COMPOUND_TO_CANONICAL[compoundName]) return COMPOUND_TO_CANONICAL[compoundName];
    // 2. Case-insensitive fallback
    const lowerName = compoundName.toLowerCase();
    for (const key of Object.keys(COMPOUND_TO_CANONICAL)) {
      if (key.toLowerCase() === lowerName) return COMPOUND_TO_CANONICAL[key];
    }
  }
  // Legacy fallback: dữ liệu cũ chưa migrate (trước DATA_VERSION 2)
  const legacyMap = {
    'Fipronil desulfinyl': 'FipronilDesulfinyl',
    'Fipronil sulfide':    'FipronilSulfide',
    'Fipronil sulfone':    'FipronilSulfone',
    'Azinphos-methyl':    'AzinphosMethyl',
    'Chlorpyrifos-methyl':'ChlorpyryfosMethyl',
    'Chlorpyryfos-methyl':'ChlorpyryfosMethyl',
    'Isofenphos-methyl':  'IsofenphosMethyl',
    'Parathion-methyl':   'ParathionMethyl',
    'Pirimiphos-methyl':  'PirimiphosMethyl'
  };
  if (legacyMap[compoundName]) return legacyMap[compoundName];
  // Últimate fallback: CamelCase normalize từ display string
  return compoundName.replace(/-([a-z])/gi, function(match, letter) { return letter.toUpperCase(); }).replace(/[-_,\s'\(\)]/g, '');
}/**
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
    
    // 1. Nhan dien Bang Duong Chuan (ASCII-only matching + Vietnamese)
    let isCalib = (headerRowText.includes('vial') || headerRowText.includes('điểm chuẩn') || headerRowText.includes('diem chuan')) && 
                  (headerRowText.includes('ml') || headerRowText.includes('ng/ml') || headerRowText.includes('nồng độ') || headerRowText.includes('nong do'));
    if (!isCalib && numRows >= 5) {
      const lastRowText = table.getRow(numRows - 1).getText().toLowerCase();
      if (lastRowText.includes('r2') || lastRowText.includes('r²')) isCalib = true;
    }
    
    if (isCalib) {
      Logger.log('[FormDon-Type3B] Found Calibration Table for ' + compoundName);
      const calibPoints = metadata.calibPoints || [];
      const hRow = table.getRow(0);
      let loSoCol = -1, vialCol = -1, kqCol = -1, areaCol = -1;
      
      for (let c = 0; c < hRow.getNumCells(); c++) {
        const txt = hRow.getCell(c).getText().toLowerCase();
        if (c === 0) loSoCol = c;
        if (txt.includes('vial') || txt.includes('lọ số') || txt.includes('lo so')) vialCol = c;
        if (txt.includes('ml') || txt.includes('nồng độ') || txt.includes('nong do')) kqCol = c;
        if (txt.includes('area') || txt.includes('diện tích') || txt.includes('dien tich')) areaCol = c;
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
      
      for (let r = 0; r < numRows; r++) {
        const text = table.getRow(r).getText().toLowerCase();
        if (text.includes('r2') || text.includes('r²')) {
          const row = table.getRow(r);
          try {
            const targetCell = row.getCell(row.getNumCells() - 1);
            const cellText = targetCell.getText();
            const r2Val = (metadata.r2 || '').toString();
            
            if (cellText.includes('…') || cellText.includes('...')) {
              if (typeof replaceDotsSafely === 'function') {
                replaceDotsSafely(targetCell, '[…\\.]{2,}', r2Val);
              } else {
                targetCell.editAsText().appendText(' ' + r2Val);
              }
            } else if (row.getNumCells() === 1 && cellText.trim().length > 0 && !cellText.includes(r2Val)) {
              // Single cell merged row, append to text instead of clearing
              targetCell.editAsText().appendText(' ' + r2Val);
            } else {
              setCellText(row, row.getNumCells() - 1, r2Val, null, sopConfig.defaultFontSize);
            }
          } catch(e) {}
        }
      }
      continue;
    }
    
    // 2. Nhan dien Bang Ket Qua (ASCII-only matching + Vietnamese)
    let isResultTable = headerRowText.includes('vial') && headerRowText.includes('(g)');
    if (!isResultTable) {
      if (headerRowText.includes('khối lượng') || headerRowText.includes('khoi luong') || headerRowText.includes('mã số') || headerRowText.includes('mẫu thử')) {
        isResultTable = true;
      }
    }
    
    if (isResultTable) {
      Logger.log('[FormDon-Type3B] Found Results Table for ' + compoundName);
      
      const hRow = table.getRow(0);
      let maSoMauCol = -1, khoiLuongCol = -1, fCol = -1, loSoCol = -1, kqCol = -1, ghiChuCol = -1;
      for (let c = 0; c < hRow.getNumCells(); c++) {
        const txt = hRow.getCell(c).getText().toLowerCase();
        if (c === 0) maSoMauCol = c;
        if ((txt.includes('(g)') && !txt.includes('g/g')) || txt.includes('khối lượng') || txt.includes('khoi luong')) khoiLuongCol = c;
        if (txt.includes(' f') || txt.endsWith('f') || txt === 'f' || txt.includes('pha loãng') || txt.includes('pha loang')) fCol = c;
        if (txt.includes('vial') || txt.includes('batch') || txt.includes('lọ số') || txt.includes('lo so')) loSoCol = c;
        if (txt.includes('g/g') || txt.includes('kết quả') || txt.includes('ket qua') || txt.includes('nồng độ') || txt.includes('nong do')) kqCol = c;
        if (txt.includes('ghi chú') || txt.includes('ghi chu') || txt.includes('note')) ghiChuCol = c;
      }
      
      if (maSoMauCol === -1) maSoMauCol = 0;
      if (khoiLuongCol === -1) khoiLuongCol = 1;
      if (fCol === -1) fCol = 2;
      if (loSoCol === -1) loSoCol = 3;
      if (kqCol === -1) kqCol = 4;
      // Không gán mặc định cho ghiChuCol vì nó có thể không tồn tại
      
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
          kqVal = sample[compoundName] || sample.kq || 'ND';
        }
        if (kqVal === 'N/A' || kqVal === '') kqVal = 'ND';
        
        try {
          const chunkSize = sopConfig.maSoMauChunkSize || 0;
          if (maSoMauCol >= 0 && maSoMauCol < row.getNumCells()) setCellText(row, maSoMauCol, (sample.maSoMau || '').toString(), chunkSize, sopConfig.defaultFontSize);
          if (khoiLuongCol >= 0 && khoiLuongCol < row.getNumCells()) setCellText(row, khoiLuongCol, (sample.khoiLuong || '10.0').toString(), null, sopConfig.defaultFontSize);
          if (fCol >= 0 && fCol < row.getNumCells()) setCellText(row, fCol, (sample.heSoPhaLoang || sample.hSoPhaLoang || '1').toString(), null, sopConfig.defaultFontSize);
          if (loSoCol >= 0 && loSoCol < row.getNumCells()) setCellText(row, loSoCol, (sample.loSo || '').toString(), null, sopConfig.defaultFontSize);
          if (kqCol >= 0 && kqCol < row.getNumCells()) setCellText(row, kqCol, (kqVal || '').toString(), null, sopConfig.defaultFontSize);
          if (ghiChuCol >= 0 && ghiChuCol < row.getNumCells()) setCellText(row, ghiChuCol, (sample.ghiChu || '').toString(), null, sopConfig.defaultFontSize);
        } catch(e) {}
        
        rowIdx++;
      }
    }
  }
}


