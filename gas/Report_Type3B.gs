
function buildQcCheckboxLabels(value) {
  if (value === true) {
    return {
      datCheck: "☑ Đạt",
      khongDatCheck: "☐ Không đạt",
      naCheck: "☐ N/A",
    };
  }
  if (value === false) {
    return {
      datCheck: "☐ Đạt",
      khongDatCheck: "☑ Không đạt",
      naCheck: "☐ N/A",
    };
  }
  return {
    datCheck: "☐ Đạt",
    khongDatCheck: "☐ Không đạt",
    naCheck: "☑ N/A",
  };
}

function buildPerAnalyteQcCheckboxState(value) {
  return {
    dat: value === 'Đạt' || value === '☑',
    khongDat: value === 'Không đạt' || value === '☒' || value === 'Không Đạt',
  };
}

function valueOrEmpty(value) {
  return value !== undefined && value !== null ? value : '';
}

function normalizeType3bQcLabelText(value) {
  return valueOrEmpty(value).toString().replace(/\s+/g, '').toLowerCase();
}

function isType3bQcLabelMatch(actualText, configuredText) {
  const actual = normalizeType3bQcLabelText(actualText);
  const configured = normalizeType3bQcLabelText(configuredText);
  return !!actual && !!configured && (actual.includes(configured) || configured.includes(actual));
}

function resolveType3bSharedQcValue(fields, fieldName) {
  const canonicalValue = fields ? fields[fieldName] : undefined;
  if (canonicalValue !== undefined && canonicalValue !== null && canonicalValue !== '') {
    return canonicalValue;
  }

  const legacyAliases = {
    qcNhanDang: 'qcNhanDangMauNhiem',
    qcThemChuan: 'qcNhanDangSpike',
    qcThuHoi: 'qcThuHoiIS'
  };
  const legacyKey = legacyAliases[fieldName];
  return legacyKey && fields ? fields[legacyKey] : canonicalValue;
}

function firstDefinedValue(primary, secondary, fallback) {
  if (primary !== undefined && primary !== null) return primary;
  if (secondary !== undefined && secondary !== null) return secondary;
  return fallback;
}

function resolveFormDonResultValue(sample, compoundName, backendKey) {
  if (sample.compoundResults && sample.compoundResults[backendKey] !== undefined && sample.compoundResults[backendKey] !== null) {
    return sample.compoundResults[backendKey];
  }
  if (sample.compoundResults && sample.compoundResults[compoundName] !== undefined && sample.compoundResults[compoundName] !== null) {
    return sample.compoundResults[compoundName];
  }
  return firstDefinedValue(sample[compoundName], sample.kq, 'ND');
}

function resolveCompoundDisplayName(compoundId, metadata) {
  const rawId = valueOrEmpty(compoundId).toString().trim();
  if (!rawId) return '';

  const targetInfo = metadata && metadata.targetInfo;
  if (targetInfo && typeof targetInfo === 'object') {
    const directTarget = targetInfo[rawId];
    if (directTarget && directTarget.displayName !== undefined && directTarget.displayName !== null) {
      const directName = directTarget.displayName.toString().trim();
      if (directName) return directName;
    }

    for (const targetKey of Object.keys(targetInfo)) {
      const target = targetInfo[targetKey];
      if (!target || target.canonicalId !== rawId || target.displayName === undefined || target.displayName === null) continue;
      const mappedName = target.displayName.toString().trim();
      if (mappedName) return mappedName;
    }
  }

  if (typeof COMPOUND_TO_CANONICAL !== 'undefined') {
    if (COMPOUND_TO_CANONICAL[rawId]) return rawId;
    for (const displayName of Object.keys(COMPOUND_TO_CANONICAL)) {
      if (COMPOUND_TO_CANONICAL[displayName] === rawId) return displayName;
    }
  }

  // A canonical-looking identifier must never leak into an official report.
  if (rawId.indexOf('_') !== -1) {
    throw new Error('[FormDon-Type3B] Missing displayName for canonical compound: ' + rawId);
  }
  return rawId;
}

function resolveType3bFormDonCompounds(sopConfig, metadata) {
  const requested = metadata && metadata.compoundsToPrint;
  if (requested !== undefined && requested !== null && !Array.isArray(requested)) {
    throw new Error('[FormDon-Type3B] Invalid compoundsToPrint: expected array');
  }

  let compounds = Array.isArray(requested) ? requested.slice() : [];
  if (compounds.length === 0) {
    if (metadata && metadata.activeCompound) {
      compounds = [metadata.activeCompound];
    } else if (sopConfig.compounds && sopConfig.compounds.length > 0) {
      compounds = [sopConfig.compounds[0]];
    } else {
      compounds = [''];
    }
  }
  return compounds;
}

function generateType3bReport(body, sopConfig, metadata, samples) {
  const printFormType = metadata.printFormType || 'formCheck';
  const renderStats = {
    reporter: 'type3b',
    mode: printFormType === 'formDon' ? 'formDon' : 'formCheck',
    renderedSampleCount: samples.length,
    logicalPageCount: 0,
    renderedCompoundIds: [],
    formDonResults: [],
  };
  
  const numChildren = body.getNumChildren();
  const children = [];
  for (let i = 0; i < numChildren; i++) {
    children.push(body.getChild(i).copy());
  }

  if (printFormType === 'formDon') {
    // === FORM ĐƠN ===
    // Lặp theo từng hoạt chất (1 hoạt chất = 1 trang)
    const compounds = resolveType3bFormDonCompounds(sopConfig, metadata);
    
    for (let c = 0; c < compounds.length; c++) {
      const compoundName = compounds[c];
      const compoundDisplayName = resolveCompoundDisplayName(compoundName, metadata);
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
      if (compoundDisplayName) {
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
                  textEl.insertText(start, compoundDisplayName.toUpperCase());
                } catch(e) {
                  Logger.log(`[Type3B][required-header] Không thể thay tên hoạt chất trong header: ${e.toString()}`);
                  throw e;
                }
              } else {
                try {
                  const textEl = para.editAsText();
                  textEl.appendText(' ' + compoundDisplayName.toUpperCase());
                } catch(e) {
                  Logger.log(`[Type3B][required-header] Không thể thêm tên hoạt chất vào header: ${e.toString()}`);
                  throw e;
                }
              }
            }
          }
        }
      }
      
      // Với form Đơn, mẫu phân tích là mẫu đầu tiên (nếu có)
      const sampleToUse = samples.length > 0 ? samples[0] : {};
      fillType3bSampleForElements(pageElements, sopConfig, metadata, sampleToUse);
      const formDonStats = _fillFormDonTablesDynamically(pageElements, metadata, samples, compoundName, sopConfig);
      renderStats.logicalPageCount++;
      renderStats.renderedCompoundIds.push(compoundName === undefined || compoundName === null ? '' : String(compoundName));
      renderStats.formDonResults.push({
        compoundId: compoundName === undefined || compoundName === null ? '' : String(compoundName),
        resultTableCount: formDonStats.resultTableCount,
        resultRowsWritten: formDonStats.resultRowsWritten,
      });
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
    renderStats.logicalPageCount = samples.length;
  }
  
  cleanLastPageBreak(body);
  return renderStats;
}

/**
 * Helper điền dữ liệu mẫu 3B cấp độ body chính
 */
function fillType3bSample(body, sopConfig, metadata, sample) {
  fillType3bSampleForElements([body], sopConfig, metadata, sample);
}

function isType3BTargetAssigned(sampleTargetMap, sampleCode, compoundDisplayName) {
  if (!sampleTargetMap || !sampleCode || !compoundDisplayName) return true;

  const canonicalId = (typeof COMPOUND_TO_CANONICAL !== 'undefined' && COMPOUND_TO_CANONICAL[compoundDisplayName])
    ? COMPOUND_TO_CANONICAL[compoundDisplayName]
    : compoundDisplayName.toLowerCase().replace(/[^a-z0-9\-_]/g, '');

  const subCodes = sampleCode.split(';').map(function(code) { return code.trim(); }).filter(Boolean);
  const codesToCheck = subCodes.length > 0 ? subCodes : [sampleCode];
  let hasExplicitAssignmentData = false;

  for (const sc of codesToCheck) {
    const matchKey = Object.keys(sampleTargetMap).find(function(key) {
      return key.toLowerCase().trim() === sc.toLowerCase().trim();
    });
    const assignedTargetIds = matchKey ? sampleTargetMap[matchKey] : null;

    // Missing/empty mapping for one sub-code must not override restrictions from another sub-code.
    // Only fall back to "show all" when none of the grouped sub-codes has explicit assignment data.
    if (!Array.isArray(assignedTargetIds) || assignedTargetIds.length === 0) continue;
    hasExplicitAssignmentData = true;

    if (assignedTargetIds.includes(canonicalId)) return true;

    const cNorm = canonicalId.replace(/[^a-z0-9]/g, '');
    const hasMatch = assignedTargetIds.some(function(targetId) {
      const tNorm = targetId.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cNorm === 'heptachlor' && tNorm.includes('epoxide')) return false;
      if (tNorm === 'heptachlor' && cNorm.includes('epoxide')) return false;
      return tNorm === cNorm;
    });
    if (hasMatch) return true;
  }

  return !hasExplicitAssignmentData;
}

/**
 * Helper thay thế placeholder và điền kết quả cho mẫu dạng 3B trên danh sách các phần tử
 */
function fillType3bSampleForElements(elements, sopConfig, metadata, sample) {
  const detectionFlags = typeof resolveSampleDetectionFlags === 'function'
    ? resolveSampleDetectionFlags(sample, sopConfig, metadata)
    : {
        checkTatCaND: sample.checkTatCaND === true || metadata.checkTatCaND === true,
        checkCoMauPhatHien: sample.checkCoMauPhatHien === true || metadata.checkCoMauPhatHien === true
      };
  const allFields = {
    ...metadata,
    ...sample,
    checkTatCaND: detectionFlags.checkTatCaND,
    checkCoMauPhatHien: detectionFlags.checkCoMauPhatHien
  };
  
  // Bộ lọc chỉ định (Target Assignment Resolver) — V2: Canonical ID
  const sampleTargetMap = metadata.sampleTargetMap || (metadata.inputs && metadata.inputs.sampleTargetMap) || null;
  const isTargetAssignedForGas = function(sampleCode, compoundDisplayName) {
    return isType3BTargetAssigned(sampleTargetMap, sampleCode, compoundDisplayName);
  };
  
  for (const element of elements) {


    // 1. Thay thế thông tin mẻ và mã số mẫu cơ bản
    element.replaceText('{{MaSoMau}}', valueOrEmpty(sample.maSoMau).toString());
    element.replaceText('1. Mã số mẫu:', '1. Mã số mẫu:  ' + valueOrEmpty(sample.maSoMau).toString());
    
    // 1.0.1 custom: Điền Mã hồ sơ
    try {
      const maHoSoVal = valueOrEmpty(metadata.maHoSo).toString().trim();
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
      Logger.log(`[Type3B][required-metadata] Lỗi khi điền Mã hồ sơ: ${e.toString()}`);
      throw e;
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
          const candidateHeaderRow = candidate.getRow(0);
          const candidateHeaderTexts = [];
          for (let c = 0; c < candidateHeaderRow.getNumCells(); c++) {
            candidateHeaderTexts.push(candidateHeaderRow.getCell(c).getText());
          }
          if (isType3bCustomCalibrationHeaderCandidate(candidateHeaderTexts)) {
            calibrationTable = candidate;
            break;
          }
        }
      }

      if (calibrationTable) {
        const calibPoints = metadata.calibPoints || [];
        const numRows = calibrationTable.getNumRows();
        const hRow = calibrationTable.getRow(0);
        const headerTexts = [];
        for (let c = 0; c < hRow.getNumCells(); c++) {
          headerTexts.push(hRow.getCell(c).getText());
        }
        const calibrationColumns = resolveType3bCustomCalibrationHeaderColumns(headerTexts);
        const vialCol = calibrationColumns.vialCol;
        const nongDoCol = calibrationColumns.kqCol;

        for (let i = 0; i < Math.min(calibPoints.length, numRows - 1); i++) {
          const pt = calibPoints[i] || { vialNo: '', loSo: '', hamLuong: '' };
          const rowIdx = 1 + i;
          const row = calibrationTable.getRow(rowIdx);
          
          try {
            if (vialCol >= 0 && vialCol < row.getNumCells()) {
              row.getCell(vialCol).setText(firstDefinedValue(pt.vialNo, pt.loSo, '').toString());
            }
            if (nongDoCol >= 0 && nongDoCol < row.getNumCells() && pt.hamLuong !== undefined && pt.hamLuong !== null) {
              row.getCell(nongDoCol).setText(pt.hamLuong.toString());
            }
          } catch(e) {
            Logger.log(`[Type3B][required-calibration] Không thể ghi điểm chuẩn ${i}: ${e.toString()}`);
            throw e;
          }
        }
        
        // Điền hệ số R2
        const r2Val = firstDefinedValue(metadata.r2, metadata.R2, '').toString();
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
      Logger.log(`[Type3B][required-calibration] Lỗi khi điền bảng đường chuẩn: ${e.toString()}`);
      throw e;
    }

    // 1.1 Gọi hàm dùng chung để tick Checkbox Khối lượng, Loại mẫu, Tình trạng mẫu
    fillCommonSampleCheckboxes(element, metadata, sample, sopConfig);
    
    // 2. Thay thế chữ ký và ngày tháng
    if (sopConfig.signaturePlaceholders) {
      for (const [placeholderText, fieldName] of Object.entries(sopConfig.signaturePlaceholders)) {
        const textVal = valueOrEmpty(metadata[fieldName]).toString();
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
        const isChecked = resolveType3bSharedQcValue(allFields, fieldName) === true;
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
                if (isType3bQcLabelMatch(labelText, keyText)) {
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
              // Missing QC data is N/A, never an implicit pass.
              const val = resolveType3bSharedQcValue(allFields, fieldName);
              const evalCell = row.getCell(2); // Cột Đánh giá (cột index 2)
              const { datCheck, khongDatCheck, naCheck } = buildQcCheckboxLabels(val);

              evalCell.replaceText('[\\[\\(]\\s*[xXvV]?\\s*[\\]\\)]\\s*Đạt', datCheck);
              evalCell.replaceText('[☐□☑☒]\\s*Đạt', datCheck);

              evalCell.replaceText('[\\[\\(]\\s*[xXvV]?\\s*[\\]\\)]\\s*Không đạt', khongDatCheck);
              evalCell.replaceText('[☐□☑☒]\\s*Không đạt', khongDatCheck);

              evalCell.replaceText('[\\[\\(]\\s*[xXvV]?\\s*[\\]\\)]\\s*N/A', naCheck);
              evalCell.replaceText('[☐□☑☒]\\s*N/A', naCheck);
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
                let foundNd = cell.findText('([☐□☑☒]|\\[\\s*[xXvV]?\\s*\\]|\\(\\s*[xXvV]?\\s*\\))[^A-Za-z0-9]*ND');
                if (foundNd) {
                  try {
                    const textElement = foundNd.getElement().asText();
                    const start = foundNd.getStartOffset();
                    const match = textElement.getText().substring(start, foundNd.getEndOffsetInclusive() + 1).match(/([☐□☑☒]|\[\s*[xXvV]?\s*\]|\(\s*[xXvV]?\s*\))/);
                    if (match) {
                      const mStr = match[0].toLowerCase();
                      if (mStr === '☑' || mStr === '☒' || mStr.includes('x') || mStr.includes('v')) {
                        const insertPos = start + match.index;
                        textElement.insertText(insertPos, '☐');
                        textElement.deleteText(insertPos + 1, insertPos + match[0].length);
                      }
                    }
                  } catch(e) {
                    Logger.log(`[Type3B][required-result] Không thể clear checkbox ND cho hoạt chất không được chỉ định: ${e.toString()}`);
                    throw e;
                  }
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
                let foundNd = cell.findText('([☐□☑☒]|\\[\\s*[xXvV]?\\s*\\]|\\(\\s*[xXvV]?\\s*\\))[^A-Za-z0-9]*ND');
                if (foundNd) {
                  try {
                    const textElement = foundNd.getElement().asText();
                    const start = foundNd.getStartOffset();
                    const match = textElement.getText().substring(start, foundNd.getEndOffsetInclusive() + 1).match(/([☐□☑☒]|\[\s*[xXvV]?\s*\]|\(\s*[xXvV]?\s*\))/);
                    if (match) {
                      const insertPos = start + match.index;
                      const charToInsert = isNd ? '☑' : '☐';
                      textElement.insertText(insertPos, charToInsert);
                      textElement.deleteText(insertPos + 1, insertPos + match[0].length);
                    }
                  } catch(e) {
                    Logger.log(`[Type3B][required-result] Không thể cập nhật checkbox ND: ${e.toString()}`);
                    throw e;
                  }
                  
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
                      } catch(e) {
                        Logger.log(`[Type3B][required-result] Không thể ghi kết quả định lượng: ${e.toString()}`);
                        throw e;
                      }
                    }
                  }
                  break; // Xử lý xong phần kết quả của compound này
                }
              }
              
              // 7.2. Tìm và tick các ô QC Đ/KĐ theo thứ tự trong segment
              for (let i = 0; i < qcList.length; i++) {
                const qcStatus = qcList[i];
                const { dat, khongDat } = buildPerAnalyteQcCheckboxState(qcStatus);

                // Luôn ghi đè cả hai ô. Giá trị thiếu/N/A phải để trống,
                // không được giữ dấu tick mặc định của template.
                _setNthQcCheckboxInCells(segmentCells, i, 'Đ', dat);
                _setNthQcCheckboxInCells(segmentCells, i, 'KĐ', khongDat);
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

  if (!isChromTable) return;
  
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
        // Hoạt chất KHÔNG được chỉ định (N/A) -> xoá mọi tick có sẵn trong
        // segment để template mặc định không thể làm sai PDF.
        const segmentCells = [];
        for (let c = startCol + 1; c <= endCol; c++) {
          segmentCells.push(row.getCell(c));
        }
        _clearCheckboxesInCells(segmentCells);
        continue;
      } else {
        const payloadKey = _getPayloadKey(compound);
        // Checkbox ND của mẫu thử chỉ phản ánh trạng thái ND explicit.
        // Có kết quả định lượng nghĩa là mẫu được phát hiện, không phải ND.
        const isNd = sample[payloadKey + '_nd'] === true;
        
        let ndCount = 0;
        for (let c = startCol + 1; c <= endCol; c++) {
          const cell = row.getCell(c);
          const cellText = cell.getText().toLowerCase();
          
          if (cellText.includes('nd')) {
            // Lần xuất hiện đầu tiên của ND trong segment là Mẫu thử
            if (ndCount === 0) {
              _replaceGenericCheckbox(cell, 'nd', isNd);
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

function _clearCheckboxesInCells(cells) {
  // Chỉ tìm trạng thái đang được tick. Sau khi đổi thành ☐, match đó biến mất,
  // nên có thể tìm lại từ đầu mà không phụ thuộc RangeElement đã bị thay đổi.
  const pattern = '([☑☒]|\\[\\s*[xXvV]\\s*\\]|\\(\\s*[xXvV]\\s*\\))';

  for (const cell of cells) {
    let found = cell.findText(pattern);
    while (found) {
      try {
        const textElement = found.getElement().asText();
        const start = found.getStartOffset();
        const matchedText = textElement.getText().substring(start, found.getEndOffsetInclusive() + 1);
        const match = matchedText.match(/([☑☒]|\[\s*[xXvV]\s*\]|\(\s*[xXvV]\s*\))/);
        if (match) {
          const insertPos = start + match.index;
          textElement.insertText(insertPos, '☐');
          textElement.deleteText(insertPos + 1, insertPos + match[0].length);
        }
      } catch(e) {
        Logger.log(`[Type3B][required-qc] Không thể clear checkbox cho hoạt chất không được chỉ định: ${e.toString()}`);
        throw e;
      }
      found = cell.findText(pattern);
    }
  }
}

function _setNthQcCheckboxInCells(cells, n, labelPattern, isChecked) {
  let matchIndex = 0;
  const pattern = '([☐□☑☒]|\\[\\s*[xXvV]?\\s*\\]|\\(\\s*[xXvV]?\\s*\\))\\s*' + labelPattern;
  
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
        } catch(e) {
          Logger.log(`[Type3B][required-qc] Không thể kiểm tra false-match checkbox QC trong cells: ${e.toString()}`);
          throw e;
        }
      }

      if (!isFalseMatch) {
        if (matchIndex === n) {
          try {
            const textElement = found.getElement().asText();
            const start = found.getStartOffset();
            const match = textElement.getText().substring(start, found.getEndOffsetInclusive() + 1).match(/([☐□☑☒]|\[\s*[xXvV]?\s*\]|\(\s*[xXvV]?\s*\))/);
            if (match) {
              textElement.insertText(start + match.index, isChecked ? '☑' : '☐');
              textElement.deleteText(start + match.index + 1, start + match.index + match[0].length);
            }
          } catch(e) {
            Logger.log(`[Type3B][required-qc] Không thể cập nhật checkbox QC trong cells: ${e.toString()}`);
            throw e;
          }
          return; // Đã tìm thấy và tick xong
        }
        matchIndex++;
      }
      found = cell.findText(pattern, found);
    }
  }
}

function _replaceGenericCheckbox(cell, labelPattern, isChecked) {
  // Các caller dò text trên bản lowercase nhưng template thực tế thường dùng
  // "ND"/"Đ" viết hoa. Dùng pattern tường minh để không phụ thuộc case.
  const normalizedLabelPattern = labelPattern === 'nd'
    ? '[Nn][Dd]'
    : ((labelPattern === 'Đ' || labelPattern === 'đ') ? '[Đđ]' : labelPattern);
  const pattern = '([☐□☑☒]|\\[\\s*[xXvV]?\\s*\\]|\\(\\s*[xXvV]?\\s*\\))\\s*' + normalizedLabelPattern;
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
      } catch(e) {
        Logger.log(`[Type3B][required-qc] Không thể kiểm tra false-match generic checkbox: ${e.toString()}`);
        throw e;
      }
    }

    if (!isFalseMatch) {
      try {
        const textElement = found.getElement().asText();
        const start = found.getStartOffset();
        const match = textElement.getText().substring(start, found.getEndOffsetInclusive() + 1).match(/([☐□☑☒]|\[\s*[xXvV]?\s*\]|\(\s*[xXvV]?\s*\))/);
        if (match) {
          textElement.insertText(start + match.index, isChecked ? '☑' : '☐');
          textElement.deleteText(start + match.index + 1, start + match.index + match[0].length);
        }
      } catch(e) {
        Logger.log(`[Type3B][required-qc] Không thể cập nhật generic checkbox: ${e.toString()}`);
        throw e;
      }
    }
    found = cell.findText(pattern, found);
  }
}

/**
 * Helper tìm và tick checkbox ở vị trí thứ n trong một dòng table (hỗ trợ nhiều QC liên tiếp)
 */
function _setNthQcCheckboxInRow(row, targetIndex, labelPattern, isChecked) {
  const pattern = '([☐□☑☒]|\\[\\s*[xXvV]?\\s*\\]|\\(\\s*[xXvV]?\\s*\\))\\s*' + labelPattern;
  let found = row.findText(pattern);
  let count = 0;
  
  while (found) {
    if (count === targetIndex) {
      try {
        const textElement = found.getElement().asText();
        const start = found.getStartOffset();
        const end = found.getEndOffsetInclusive();
        const textStr = textElement.getText().substring(start, end + 1);
        const match = textStr.match(/([☐□☑☒]|\[\s*[xXvV]?\s*\]|\(\s*[xXvV]?\s*\))/);
        
        if (match) {
          const insertPos = start + match.index;
          const charToInsert = isChecked ? '☑' : '☐';
          textElement.insertText(insertPos, charToInsert);
          textElement.deleteText(insertPos + 1, insertPos + match[0].length);
        }
      } catch(e) {
        Logger.log(`[Type3B][required-qc] Không thể cập nhật checkbox QC trong row: ${e.toString()}`);
        throw e;
      }
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
    Logger.log(`[Autocut 3B][optional-cleanup] Không thể dọn dẹp PageBreak cuối: ${e.toString()}`);
  }
}

/**
 * Helper đệ quy chọn lọc để tìm và thay thế checkbox trong đoạn văn hoặc ô chứa nhãn text tương ứng
 */
function replaceCheckboxInElementRecursive(element, lineText, checkChar) {
  const type = element.getType();
  if (type === DocumentApp.ElementType.PARAGRAPH) {
    const para = element.asParagraph();
    if (isType3bQcLabelMatch(para.getText(), lineText)) {
      para.replaceText('\\[\\s*[xXvV]?\\s*\\]', checkChar);
      para.replaceText('\\(\\s*[xXvV]?\\s*\\)', checkChar);
      para.replaceText('☐', checkChar);
      para.replaceText('□', checkChar);
      para.replaceText('☑', checkChar);
      para.replaceText('☒', checkChar);
    }
  } else if (type === DocumentApp.ElementType.TABLE) {
    const table = element.asTable();
    for (let r = 0; r < table.getNumRows(); r++) {
      const row = table.getRow(r);
      for (let c = 0; c < row.getNumCells(); c++) {
        const cell = row.getCell(c);
        if (isType3bQcLabelMatch(cell.getText(), lineText)) {
          cell.replaceText('\\[\\s*[xXvV]?\\s*\\]', checkChar);
          cell.replaceText('\\(\\s*[xXvV]?\\s*\\)', checkChar);
          cell.replaceText('☐', checkChar);
          cell.replaceText('□', checkChar);
          cell.replaceText('☑', checkChar);
          cell.replaceText('☒', checkChar);
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
}

function normalizeFormDonHeaderText(value) {
  let text = value === undefined || value === null ? '' : value.toString().toLowerCase();
  try {
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    Logger.log(`[Type3B][optional-normalize] String.normalize không khả dụng, dùng fallback không dấu một phần: ${e.toString()}`);
  }
  return text.replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();
}

function isFormDonCalibrationConcentrationHeaderText(value) {
  const text = normalizeFormDonHeaderText(value);
  if (!text) return false;

  // Không dùng riêng đơn vị "ml" để nhận diện cột nồng độ: các cột khác như
  // "Nội chuẩn cần dùng (ng/ml)" cũng có cùng đơn vị và sẽ gây ambiguity.
  if (text.includes('noi chuan')) return false;
  if (text.includes('nong do')) return true;
  if (/^concentration\b/.test(text)) return true;
  return /^c(?:\s+chuan)?\s*(?:\(|$)/.test(text);
}

function resolveUniqueFormDonHeaderColumn(headerTexts, tableName, columnName, matcher, optional) {
  const matches = [];
  for (let i = 0; i < headerTexts.length; i++) {
    const normalized = normalizeFormDonHeaderText(headerTexts[i]);
    if (matcher(normalized)) matches.push(i);
  }

  if (matches.length === 0) {
    if (optional) return -1;
    throw new Error('[FormDon-Type3B] Template contract invalid for ' + tableName + ': missing required header "' + columnName + '"');
  }
  if (matches.length > 1) {
    throw new Error('[FormDon-Type3B] Template contract invalid for ' + tableName + ': duplicate/ambiguous header "' + columnName + '" at columns ' + matches.join(', '));
  }
  return matches[0];
}

function assertDistinctFormDonHeaderColumns(tableName, columns) {
  const ownersByIndex = {};
  Object.keys(columns).forEach(function(columnName) {
    const index = columns[columnName];
    if (index < 0) return;
    if (ownersByIndex[index]) {
      throw new Error('[FormDon-Type3B] Template contract invalid for ' + tableName + ': column ' + index + ' matches both "' + ownersByIndex[index] + '" and "' + columnName + '"');
    }
    ownersByIndex[index] = columnName;
  });
}

function resolveFormDonCalibrationHeaderColumns(headerTexts) {
  const columns = {
    diemChuan: resolveUniqueFormDonHeaderColumn(headerTexts, 'calibration table', 'Điểm chuẩn', function(text) {
      return text.includes('diem chuan') || text.includes('ten diem');
    }, false),
    vial: resolveUniqueFormDonHeaderColumn(headerTexts, 'calibration table', 'Vial/Lọ số', function(text) {
      return text.includes('vial') || text.includes('lo so');
    }, false),
    nongDo: resolveUniqueFormDonHeaderColumn(headerTexts, 'calibration table', 'Nồng độ', function(text) {
      return isFormDonCalibrationConcentrationHeaderText(text);
    }, false),
    area: resolveUniqueFormDonHeaderColumn(headerTexts, 'calibration table', 'Area/Diện tích', function(text) {
      return text.includes('area') || text.includes('dien tich');
    }, true),
  };
  assertDistinctFormDonHeaderColumns('calibration table', columns);
  return {
    loSoCol: columns.diemChuan,
    vialCol: columns.vial,
    kqCol: columns.nongDo,
    areaCol: columns.area,
  };
}

function isType3bCustomCalibrationHeaderCandidate(headerTexts) {
  let hasVial = false;
  let hasConcentration = false;

  for (let i = 0; i < headerTexts.length; i++) {
    const text = normalizeFormDonHeaderText(headerTexts[i]);
    if (text.includes('vial') || text.includes('lo so')) hasVial = true;
    if (isFormDonCalibrationConcentrationHeaderText(text)) hasConcentration = true;
  }

  return hasVial && hasConcentration;
}

function resolveType3bCustomCalibrationHeaderColumns(headerTexts) {
  const columns = {
    vial: resolveUniqueFormDonHeaderColumn(headerTexts, 'custom calibration table', 'Vial/Lọ số', function(text) {
      return text.includes('vial') || text.includes('lo so');
    }, false),
    nongDo: resolveUniqueFormDonHeaderColumn(headerTexts, 'custom calibration table', 'Nồng độ', function(text) {
      return isFormDonCalibrationConcentrationHeaderText(text);
    }, false),
  };
  assertDistinctFormDonHeaderColumns('custom calibration table', columns);
  return {
    vialCol: columns.vial,
    kqCol: columns.nongDo,
  };
}

function getType3bTableHeaderTexts(table) {
  if (!table || typeof table.getNumRows !== 'function' || table.getNumRows() < 1) return [];
  const headerRow = table.getRow(0);
  const headerTexts = [];
  for (let c = 0; c < headerRow.getNumCells(); c++) {
    headerTexts.push(headerRow.getCell(c).getText());
  }
  return headerTexts;
}

function isFormDonCalibrationTableCandidate(table) {
  if (!table || typeof table.getNumRows !== 'function' || table.getNumRows() < 2) return false;
  const headerTexts = getType3bTableHeaderTexts(table);
  let hasPoint = false;
  let hasVial = false;
  let hasConcentration = false;
  let hasSampleOrMass = false;

  for (let i = 0; i < headerTexts.length; i++) {
    const text = normalizeFormDonHeaderText(headerTexts[i]);
    if (text.includes('diem chuan') || text.includes('ten diem')) hasPoint = true;
    if (text.includes('vial') || text.includes('lo so')) hasVial = true;
    if (isFormDonCalibrationConcentrationHeaderText(text)) hasConcentration = true;
    if (text.includes('ma so mau') || text.includes('ma mau') || text.includes('mau thu') || text.includes('khoi luong')) {
      hasSampleOrMass = true;
    }
  }

  if (hasPoint || (hasVial && hasConcentration && !hasSampleOrMass)) return true;

  if (table.getNumRows() >= 5) {
    const lastRowText = normalizeFormDonHeaderText(table.getRow(table.getNumRows() - 1).getText());
    if (lastRowText.includes('r2') || lastRowText.includes('r²')) return true;
  }
  return false;
}

function isFormDonResultTableCandidate(table) {
  if (!table || typeof table.getNumRows !== 'function' || table.getNumRows() < 2) return false;
  const headerTexts = getType3bTableHeaderTexts(table);
  let hasSample = false;
  let hasMass = false;
  let hasDilution = false;
  let hasVial = false;
  let hasResult = false;

  for (let i = 0; i < headerTexts.length; i++) {
    const text = normalizeFormDonHeaderText(headerTexts[i]);
    if (text.includes('ma so mau') || text.includes('ma mau') || text.includes('mau thu')) hasSample = true;
    if ((text.includes('(g)') && !text.includes('g/g')) || text.includes('khoi luong')) hasMass = true;
    if (text.includes('pha loang') || /(^|[\s(/])f($|[\s)])/i.test(text)) hasDilution = true;
    if (text.includes('vial') || text.includes('batch') || text.includes('lo so')) hasVial = true;
    if (text.includes('g/g') || text.includes('ket qua') || text.includes('nong do')) hasResult = true;
  }

  const semanticCount = [hasSample, hasMass, hasDilution, hasVial, hasResult].filter(Boolean).length;
  return semanticCount >= 2 && (hasSample || hasMass);
}

function resolveFormDonResultHeaderColumns(headerTexts) {
  const columns = {
    maSoMau: resolveUniqueFormDonHeaderColumn(headerTexts, 'result table', 'Mã số mẫu', function(text) {
      return text.includes('ma so mau') || text.includes('ma mau') || text.includes('mau thu');
    }, false),
    khoiLuong: resolveUniqueFormDonHeaderColumn(headerTexts, 'result table', 'Khối lượng', function(text) {
      return (text.includes('(g)') && !text.includes('g/g')) || text.includes('khoi luong');
    }, false),
    heSoPhaLoang: resolveUniqueFormDonHeaderColumn(headerTexts, 'result table', 'Hệ số pha loãng F', function(text) {
      return text.includes('pha loang') || /(^|[\s(/])f($|[\s)])/i.test(text);
    }, false),
    loSo: resolveUniqueFormDonHeaderColumn(headerTexts, 'result table', 'Vial/Lọ số', function(text) {
      return text.includes('vial') || text.includes('batch') || text.includes('lo so');
    }, false),
    ketQua: resolveUniqueFormDonHeaderColumn(headerTexts, 'result table', 'Kết quả', function(text) {
      return text.includes('g/g') || text.includes('ket qua') || text.includes('nong do');
    }, false),
    ghiChu: resolveUniqueFormDonHeaderColumn(headerTexts, 'result table', 'Ghi chú', function(text) {
      return text.includes('ghi chu') || text.includes('note');
    }, true),
  };
  assertDistinctFormDonHeaderColumns('result table', columns);
  return {
    maSoMauCol: columns.maSoMau,
    khoiLuongCol: columns.khoiLuong,
    fCol: columns.heSoPhaLoang,
    loSoCol: columns.loSo,
    kqCol: columns.ketQua,
    ghiChuCol: columns.ghiChu,
  };
}

/**
 * Tu dong nhan dien va dien Bang Duong Chuan & Bang Ket Qua cho Form Don cua SOP Type 3B
 */
function _fillFormDonTablesDynamically(pageElements, metadata, samples, compoundName, sopConfig) {
  let tables = [];
  let resultTableCount = 0;
  let resultRowsWritten = 0;
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
    
    // 1. Nhận diện Bảng Đường Chuẩn bằng cùng semantic contract dùng cho preflight.
    const isCalib = isFormDonCalibrationTableCandidate(table);
    
    if (isCalib) {
      Logger.log('[FormDon-Type3B] Found Calibration Table for ' + compoundName);
      const calibPoints = metadata.calibPoints || [];
      const headerTexts = getType3bTableHeaderTexts(table);
      const calibrationColumns = resolveFormDonCalibrationHeaderColumns(headerTexts);
      const loSoCol = calibrationColumns.loSoCol;
      const vialCol = calibrationColumns.vialCol;
      const kqCol = calibrationColumns.kqCol;
      const areaCol = calibrationColumns.areaCol;
      
      for (let ptIdx = 0; ptIdx < Math.min(calibPoints.length, numRows - 2); ptIdx++) {
        const pt = calibPoints[ptIdx] || {};
        const row = table.getRow(ptIdx + 1);
        try {
          if (loSoCol >= 0 && loSoCol < row.getNumCells()) setCellText(row, loSoCol, firstDefinedValue(pt.loSo, pt.vialNo, '').toString(), null, sopConfig.defaultFontSize);
          if (vialCol >= 0 && vialCol < row.getNumCells()) setCellText(row, vialCol, firstDefinedValue(pt.vialNo, pt.loSo, '').toString(), null, sopConfig.defaultFontSize);
          if (kqCol >= 0 && kqCol < row.getNumCells()) setCellText(row, kqCol, valueOrEmpty(pt.hamLuong).toString(), null, sopConfig.defaultFontSize);
          if (areaCol >= 0 && areaCol < row.getNumCells()) setCellText(row, areaCol, firstDefinedValue(pt.dienTich, pt.area, '').toString(), null, sopConfig.defaultFontSize);
        } catch(e) {
          Logger.log(`[FormDon-Type3B][required-calibration] Không thể ghi điểm chuẩn ${ptIdx}: ${e.toString()}`);
          throw e;
        }
      }
      
      for (let r = 0; r < numRows; r++) {
        const text = table.getRow(r).getText().toLowerCase();
        if (text.includes('r2') || text.includes('r²')) {
          const row = table.getRow(r);
          try {
            const targetCell = row.getCell(row.getNumCells() - 1);
            const cellText = targetCell.getText();
            const r2Val = valueOrEmpty(metadata.r2).toString();
            
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
          } catch(e) {
            Logger.log(`[FormDon-Type3B][required-calibration] Không thể ghi R2: ${e.toString()}`);
            throw e;
          }
        }
      }
      continue;
    }
    
    // 2. Nhận diện Bảng Kết Quả bằng cùng semantic contract dùng cho preflight.
    const isResultTable = isFormDonResultTableCandidate(table);
    
    if (isResultTable) {
      Logger.log('[FormDon-Type3B] Found Results Table for ' + compoundName);
      resultTableCount++;
      
      const headerTexts = getType3bTableHeaderTexts(table);
      const resultColumns = resolveFormDonResultHeaderColumns(headerTexts);
      const maSoMauCol = resultColumns.maSoMauCol;
      const khoiLuongCol = resultColumns.khoiLuongCol;
      const fCol = resultColumns.fCol;
      const loSoCol = resultColumns.loSoCol;
      const kqCol = resultColumns.kqCol;
      const ghiChuCol = resultColumns.ghiChuCol;
      
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
        
        const kqVal = resolveFormDonResultValue(sample, compoundName, backendKey);
        const fVal = sample.heSoPhaLoang !== undefined && sample.heSoPhaLoang !== null
          ? sample.heSoPhaLoang
          : sample.hSoPhaLoang;
        
        try {
          const chunkSize = sopConfig.maSoMauChunkSize || 0;
          if (maSoMauCol >= 0 && maSoMauCol < row.getNumCells()) setCellText(row, maSoMauCol, valueOrEmpty(sample.maSoMau).toString(), chunkSize, sopConfig.defaultFontSize);
          if (khoiLuongCol >= 0 && khoiLuongCol < row.getNumCells()) setCellText(row, khoiLuongCol, valueOrEmpty(sample.khoiLuong).toString(), null, sopConfig.defaultFontSize);
          if (fCol >= 0 && fCol < row.getNumCells()) setCellText(row, fCol, valueOrEmpty(fVal).toString(), null, sopConfig.defaultFontSize);
          if (loSoCol >= 0 && loSoCol < row.getNumCells()) setCellText(row, loSoCol, valueOrEmpty(sample.loSo).toString(), null, sopConfig.defaultFontSize);
          if (kqCol >= 0 && kqCol < row.getNumCells()) setCellText(row, kqCol, valueOrEmpty(kqVal).toString(), null, sopConfig.defaultFontSize);
          if (ghiChuCol >= 0 && ghiChuCol < row.getNumCells()) setCellText(row, ghiChuCol, valueOrEmpty(sample.ghiChu).toString(), null, sopConfig.defaultFontSize);
        } catch(e) {
          Logger.log(`[FormDon-Type3B][required-result] Không thể ghi dòng kết quả sample ${sIdx}: ${e.toString()}`);
          throw e;
        }
        
        resultRowsWritten++;
        rowIdx++;
      }
    }
  }

  return {
    resultTableCount,
    resultRowsWritten,
  };
}
