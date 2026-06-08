
function generateType3bReport(body, sopConfig, metadata, samples) {
  const numChildren = body.getNumChildren();
  const children = [];
  for (let i = 0; i < numChildren; i++) {
    children.push(body.getChild(i).copy());
  }

  // Điền dữ liệu cho mẫu đầu tiên
  if (samples.length > 0) {
    fillType3bSample(body, sopConfig, metadata, samples[0]);
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
    fillType3bSampleForElements(tempContainer, sopConfig, metadata, samples[s]);
  }
  
  // Tự động thu dọn PageBreak cuối tài liệu nếu có
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
  
  for (const element of elements) {
    // 0. Khắc phục lỗi xuống dòng khi chuyển đổi sang PDF:
    // Tự động rút ngắn chuỗi dấu chấm hoặc dấu ba chấm trước checkbox ND (bao gồm cả placeholder {{N1}} bắt đầu bằng {)
    try {
      element.replaceText('……+([\\s]*[☑☐□N{])', '…\\1');
      element.replaceText('\\.{5,}([\\s]*[☑☐□N{])', '...\\1');
    } catch (e) {
      Logger.log('[TableFit] Lỗi rút ngắn dấu chấm: ' + e.toString());
    }

    // 1. Thay thế thông tin mẻ và mã số mẫu cơ bản
    element.replaceText('{{MaSoMau}}', sample.maSoMau || '');
    element.replaceText('1. Mã số mẫu:', '1. Mã số mẫu:  ' + (sample.maSoMau || ''));
    
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
    
    // 7. Khắc phục lỗi xuống dòng sau khi thay thế: Chạy lại một lần nữa để rút ngắn triệt để các dấu chấm
    try {
      element.replaceText('……+([\\s]*[☑☐□N])', '…\\1');
      element.replaceText('\\.{5,}([\\s]*[☑☐□N])', '...\\1');
    } catch (e) {}
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

