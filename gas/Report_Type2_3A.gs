/**
 * LIMS Report Generator — Dạng Biểu Mẫu 2 & 3A
 * ========================================================
 * Chứa logic điền bảng và thay thế trường dữ liệu trên 1 hoặc nhiều trang.
 */

/**
 * Xử lý điền báo cáo cho Dạng 2 & Dạng 3A (Điền bảng)
 */
function generateType2_3aReport(body, sopConfig, metadata, samples) {
  fillTextFields(body, sopConfig, metadata);
  fillSampleTable(body, sopConfig, samples);
}

/**
 * Điền các trường văn bản tự do, checkbox và ngày tháng ký duyệt
 */
function fillTextFields(body, sopConfig, metadata) {
  // 1. Text replacements đơn giản
  if (sopConfig.textReplacements) {
    for (const [searchText, fieldName] of Object.entries(sopConfig.textReplacements)) {
      const value = metadata[fieldName] || '';
      body.replaceText(searchText, value);
    }
  }

  // 2. Checkbox lines: dùng replaceText cấp paragraph để GIỮ NGUYÊN in đậm/in nghiêng
  if (sopConfig.checkboxLines) {
    for (const [lineText, fieldName] of Object.entries(sopConfig.checkboxLines)) {
      const isChecked = metadata[fieldName] === true;
      const checkChar = isChecked ? '☑' : '☐';
      
      let searchResult = body.findText(lineText);
      while (searchResult) {
        const para = searchResult.getElement().getParent().asParagraph();
        // Thay thế đúng vị trí [ ] hoặc ☐ hoặc □, không làm hỏng font chữ
        para.replaceText('\\[ \\]', checkChar);
        para.replaceText('☐', checkChar);
        para.replaceText('□', checkChar);
        para.replaceText('[\\[\\(] ?[\\]\\)]', checkChar);
        
        // Tìm tiếp tục từ kết quả vừa tìm được để xử lý cho các trang sau
        searchResult = body.findText(lineText, searchResult);
      }
    }
  }

  // 3. Custom: Xử lý điền Ngày tháng thông qua placeholder trên biểu mẫu (date1, date2)
  if (sopConfig.signaturePlaceholders) {
    for (const [placeholderText, fieldName] of Object.entries(sopConfig.signaturePlaceholders)) {
      const textVal = metadata[fieldName] || '';
      if (!textVal) continue;
      
      // Tách lấy phần Ngày (ví dụ: "19/05/2026 / Ong Thanh Dat" -> "19/05/2026")
      const dateOnly = textVal.split('/ ').length > 1 ? textVal.split(' /')[0].trim() : textVal.trim();
      
      // Thay thế trực tiếp placeholder bằng ngày (Google Docs sẽ tự động giữ nguyên căn giữa, font và size)
      body.replaceText(placeholderText, dateOnly);
    }
  }
}

/**
 * Điền bảng mẫu theo tọa độ và thực hiện Auto-cut trang thừa tự động
 */
function fillSampleTable(body, sopConfig, samples) {
  const tables = body.getTables();
  
  // 1. Dùng trực tiếp sampleTableIndex cấu hình từ SOP_Configs (không quét quét động dễ sai lệch)
  const sampleTableIndex = sopConfig.sampleTableIndex !== undefined ? sopConfig.sampleTableIndex : 2;
  
  if (sampleTableIndex >= tables.length) {
    throw new Error(`Chỉ số bảng mẫu ${sampleTableIndex} vượt quá số lượng bảng hiện có (${tables.length}).`);
  }

  const sampleTable = tables[sampleTableIndex];
  const cols = sopConfig.columns;
  const startRow = sopConfig.headerRows || 1;

  // 1.2. XÁC ĐỊNH CAPACITY THỰC TẾ (SAMPLE ROWS ONLY)
  // Quét tìm hàng đầu tiên chứa thông tin kết quả chung hoặc chữ ký để khoanh vùng điền mẫu
  let endSampleRowIdx = sampleTable.getNumRows();
  for (let r = startRow; r < sampleTable.getNumRows(); r++) {
    const rowText = sampleTable.getRow(r).getText().trim();
    if (rowText.includes("9. Kết quả") || 
        rowText.includes("Tất cả mẫu thử") || 
        rowText.includes("Có mẫu thử") || 
        rowText.includes("Người phân tích") || 
        rowText.includes("Người thẩm tra") ||
        rowText.includes("Trang:")) {
      endSampleRowIdx = r;
      break;
    }
  }

  // Đếm số hàng mẫu thực sự khả dụng (không tính tiêu đề lặp lại)
  let usableSlotsPerPage = 0;
  for (let r = startRow; r < endSampleRowIdx; r++) {
    const rowText = sampleTable.getRow(r).getText().trim();
    if (!(rowText.includes("Mã số mẫu") || 
          rowText.includes("Vial No") || 
          rowText.includes("Kết quả mẫu thử") || 
          rowText.includes("Fipronil desulfinyl") || 
          rowText.includes("Chlorpyrifos methyl"))) {
      usableSlotsPerPage++;
    }
  }
  if (usableSlotsPerPage === 0) usableSlotsPerPage = 1;

  const totalPagesNeeded = Math.ceil(samples.length / usableSlotsPerPage);
  
  Logger.log(`[TableFit] sampleTableIndex=${sampleTableIndex} | endSampleRowIdx=${endSampleRowIdx} | usableSlotsPerPage=${usableSlotsPerPage} | totalPagesNeeded=${totalPagesNeeded}`);

  // Định vị bảng mẫu và chỉ mục của nó trong body để chuẩn bị nhân bản nếu cần
  const lastTableChildIdx = body.getChildIndex(sampleTable);
  
  // =============================================================
  // XÁC ĐỊNH ĐIỂM BẮT ĐẦU SAO CHÉP TRANG KẾT QUẢ (ROBUST)
  // =============================================================
  // Template SOP-01 dùng Section Break (không phải Page Break thông thường)
  // để ngăn cách Trang 1 (thông tin) với Trang 2 (kết quả).
  // GAS không nhận diện Section Break là PAGE_BREAK element, nên quét ngược
  // sẽ không tìm thấy. Giải pháp: quét xuôi từ đầu body để tìm paragraph
  // đầu tiên chứa các từ khoá đặc trưng của phần đầu trang kết quả,
  // sau đó lấy index đó làm startCopyIdx.
  // Nếu không tìm thấy bằng từ khoá, fallback về quét ngược tìm PAGE_BREAK.
  
  let startCopyIdx = -1;
  
  // Ưu tiên 1: Tìm xuôi — paragraph chứa "9. Kết quả" hoặc các từ khoá đầu trang kết quả
  const resultPageKeywords = ["9. Kết quả", "Kết quả:", "Tất cả mẫu thử", "Có mẫu thử phát hiện"];
  for (let idx = 0; idx < lastTableChildIdx; idx++) {
    const child = body.getChild(idx);
    if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
      const text = child.asParagraph().getText();
      for (const kw of resultPageKeywords) {
        if (text.includes(kw)) {
          startCopyIdx = idx;
          Logger.log(`[TableFit] Tìm thấy điểm bắt đầu trang kết quả tại idx=${idx} (từ khóa: "${kw}")`);
          break;
        }
      }
    }
    if (startCopyIdx !== -1) break;
  }
  
  // Ưu tiên 2: Fallback — quét ngược tìm PAGE_BREAK thông thường
  if (startCopyIdx === -1) {
    let lastPageBreakIdx = -1;
    for (let idx = lastTableChildIdx - 1; idx >= 0; idx--) {
      const child = body.getChild(idx);
      if (child.getType() === DocumentApp.ElementType.PAGE_BREAK) {
        lastPageBreakIdx = idx;
        break;
      }
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const para = child.asParagraph();
        for (let i = 0; i < para.getNumChildren(); i++) {
          if (para.getChild(i).getType() === DocumentApp.ElementType.PAGE_BREAK) {
            lastPageBreakIdx = idx;
            break;
          }
        }
        if (lastPageBreakIdx !== -1) break;
      }
    }
    if (lastPageBreakIdx !== -1) {
      startCopyIdx = lastPageBreakIdx + 1;
      Logger.log(`[TableFit] Fallback: Tìm thấy PAGE_BREAK tại idx=${lastPageBreakIdx}, startCopyIdx=${startCopyIdx}`);
    } else {
      // Ưu tiên 3: Fallback cuối — lấy toàn bộ từ đầu bảng mẫu trở về sau
      startCopyIdx = lastTableChildIdx;
      Logger.log(`[TableFit] Fallback cuối: startCopyIdx=${startCopyIdx} (chỉ copy bảng và phần sau)`);
    }
  }
  
  // Thu thập các phần tử cần copy:
  // - Tìm endCopyIdx là vị trí phần tử CUỐI CÓ NỘI DUNG (có text hoặc là TABLE)
  //   để loại bỏ các paragraph rỗng trailing do GAS tự thêm vào cuối document.
  let endCopyIdx = body.getNumChildren() - 1;
  while (endCopyIdx > startCopyIdx) {
    const lastEl = body.getChild(endCopyIdx);
    const lastType = lastEl.getType();
    if (lastType === DocumentApp.ElementType.PARAGRAPH) {
      const txt = lastEl.asParagraph().getText().trim();
      if (txt === '') {
        endCopyIdx--;
        continue;
      }
    }
    break;
  }
  Logger.log(`[TableFit] Phạm vi phần tử trang kết quả để nhân bản: idx ${startCopyIdx} đến ${endCopyIdx}`);

  // Thu thập các phần tử cần copy:
  const page2Elements = [];
  if (startCopyIdx >= 0 && startCopyIdx <= endCopyIdx) {
    for (let idx = startCopyIdx; idx <= endCopyIdx; idx++) {
      page2Elements.push(body.getChild(idx));
    }
  }

  // Tính số lượng bảng trên mỗi trang bằng cách đếm số bảng trong phạm vi sao chép (hoặc dùng cấu hình tĩnh ghi đè)
  let tablesPerPage = sopConfig.tablesPerPage !== undefined ? sopConfig.tablesPerPage : 0;
  if (tablesPerPage === 0) {
    for (let j = 0; j < page2Elements.length; j++) {
      if (page2Elements[j].getType() === DocumentApp.ElementType.TABLE) {
        tablesPerPage++;
      }
    }
  }
  if (tablesPerPage === 0) tablesPerPage = 1;
  Logger.log(`[TableFit] Số bảng trên mỗi trang kết quả (tablesPerPage) = ${tablesPerPage}`);

  // 1.5. ĐỘNG CƠ NHÂN BẢN TRANG TỰ ĐỘNG THẾ HỆ MỚI (UNIVERSAL PAGE DUPLICATOR)
  let existingSampleTablesCount = 0;
  const initTables = body.getTables();
  for (let idx = sampleTableIndex; idx < initTables.length; idx += tablesPerPage) {
    existingSampleTablesCount++;
  }
  if (existingSampleTablesCount === 0) existingSampleTablesCount = 1;

  // Nếu số lượng trang kết quả cần dùng lớn hơn số trang sẵn có trong template
  if (totalPagesNeeded > existingSampleTablesCount) {
    const pagesToClone = totalPagesNeeded - existingSampleTablesCount;
    Logger.log(`[TableFit] Tiến hành nhân bản thêm ${pagesToClone} trang kết quả...`);
    
    // Nhân bản thêm số trang còn thiếu
    for (let p = 0; p < pagesToClone; p++) {
      Logger.log(`[TableFit] Nhân bản trang ${p + 1}`);
      
      let firstParagraphCloned = false;
      let afterTable = false; // Flag đánh dấu đã đi qua bảng mẫu thử
      let blankAfterTableCount = 0; // Đếm số dòng trống sau bảng
      
      // Chèn bản sao các phần tử của trang mẫu
      for (let j = 0; j < page2Elements.length; j++) {
        const el = page2Elements[j];
        const elType = el.getType();
        
        if (elType === DocumentApp.ElementType.PAGE_BREAK) continue;
        
        if (elType === DocumentApp.ElementType.PARAGRAPH) {
          const clonedPara = el.copy().asParagraph();
          // Loại bỏ bất kỳ dấu ngắt trang ẩn nào bên trong đoạn văn copy
          for (let i = clonedPara.getNumChildren() - 1; i >= 0; i--) {
            if (clonedPara.getChild(i).getType() === DocumentApp.ElementType.PAGE_BREAK) {
              try { clonedPara.removeChild(clonedPara.getChild(i)); } catch(e) {}
            }
          }
          
          // Xử lý paragraph RỖNG (blank)
          if (clonedPara.getText().trim() === '') {
            if (!afterTable) {
              // Bỏ qua các paragraph rỗng nằm TRƯỚC bảng để tránh đẩy bảng xuống
              continue;
            }
            // Paragraph rỗng nằm SAU bảng (giữa chữ ký và Trang:):
            // Cứ giữ nguyên vẹn 100% định dạng nguyên bản của template gốc!
          }
          
          // Paragraph đầu tiên của mỗi trang clone: thêm PAGE_BREAK_BEFORE để bắt đầu trang mới
          if (!firstParagraphCloned) {
            try {
              clonedPara.setAttributes({[DocumentApp.Attribute.PAGE_BREAK_BEFORE]: true});
              clonedPara.setSpacingBefore(0);
            } catch(e) {}
            firstParagraphCloned = true;
          }
          
          body.appendParagraph(clonedPara);
          
          // KIỂM TRA & DỌN DẸP dòng trống tự động do GAS chèn ngay sau Table
          const numChildren = body.getNumChildren();
          if (numChildren >= 3) {
            const insertedPara = body.getChild(numChildren - 1);
            const middlePara = body.getChild(numChildren - 2);
            const prevTable = body.getChild(numChildren - 3);
            
            if (middlePara.getType() === DocumentApp.ElementType.PARAGRAPH &&
                prevTable.getType() === DocumentApp.ElementType.TABLE) {
              const midP = middlePara.asParagraph();
              if (midP.getText().trim() === '' && midP.getNumChildren() === 0) {
                try {
                  body.removeChild(middlePara);
                  Logger.log(`[TableFit] Đã dọn dẹp thành công paragraph trống tự động giữa bảng và dòng ghi chú`);
                } catch(e) {
                  Logger.log(`[TableFit] Không thể xóa paragraph trống ở giữa: ${e.toString()}`);
                }
              }
            }
          }
          
        } else if (elType === DocumentApp.ElementType.TABLE) {
          if (!firstParagraphCloned) {
            // Nếu phần tử đầu tiên là bảng (không có paragraph trước), chèn page break trước
            body.appendPageBreak();
            firstParagraphCloned = true;
          }
          body.appendTable(el.copy().asTable());
          afterTable = true; // Đánh dấu đã đi qua bảng mẫu thử!
        } else if (elType === DocumentApp.ElementType.LIST_ITEM) {
          body.appendListItem(el.copy().asListItem());
        }
      }
    }
    
    // Sau khi nhân bản xong, nạp lại danh sách tables mới nhất từ tài liệu
    Logger.log(`[TableFit] Đã nhân bản xong. Tải lại danh sách bảng...`);
    tables.length = 0; // Xóa danh sách cũ
    const freshTables = body.getTables();
    for (let t = 0; t < freshTables.length; t++) {
      tables.push(freshTables[t]);
    }
  }

  Logger.log(`[ReportType2] Đang xử lý điền dữ liệu: Tổng mẫu: ${samples.length} | Ô khả dụng trên 1 trang: ${usableSlotsPerPage} | Số trang cần dùng: ${totalPagesNeeded}`);

  let sampleIdx = 0;

  // 2. Điền dữ liệu phân đoạn tương ứng cho từng trang cần thiết
  for (let p = 0; p < totalPagesNeeded; p++) {
    const currentTableIdx = sampleTableIndex + p * tablesPerPage;
    
    // Đảm bảo không bị tràn mảng nếu mẫu nhiều vượt quá số lượng trang thực tế trong file
    if (currentTableIdx >= tables.length) {
      Logger.log(`CẢNH BÁO: Số lượng mẫu vượt quá dung lượng tối đa của template (${tables.length / tablesPerPage} trang).`);
      break;
    }
    
    const currentTable = tables[currentTableIdx];
    let rowIdx = startRow;
    
    // Điền mẫu cho đến khi hết hàng của bảng mẫu trên trang này hoặc hết mẫu thử
    while (rowIdx < endSampleRowIdx && sampleIdx < samples.length) {
      const candidateRow = currentTable.getRow(rowIdx);
      const rowText = candidateRow.getText().trim();
      
      // Bỏ qua tất cả các dòng tiêu đề hoặc dòng đặc biệt trong phạm vi cho phép
      if (rowText.includes("Mã số mẫu") || 
          rowText.includes("Vial No") || 
          rowText.includes("Kết quả mẫu thử") || 
          rowText.includes("Fipronil desulfinyl") || 
          rowText.includes("Chlorpyrifos methyl")) {
        Logger.log(`[TableFit] Phát hiện dòng tiêu đề lặp lại tại hàng ${rowIdx}. Bỏ qua.`);
        rowIdx++;
        continue;
      }
      
      const sample = samples[sampleIdx];
      
      // Điền tất cả các cột được cấu hình động
      for (const [colKey, colIdx] of Object.entries(cols)) {
        if (colIdx === undefined || colIdx === null) continue;
        
        let textVal = '';
        if (colKey === 'loSo') {
          textVal = sample.loSo || '';
        } else if (colKey === 'maSoMau') {
          textVal = sample.maSoMau || '';
        } else if (colKey === 'nd') {
          textVal = sample.nd ? '☑' : '☐';
        } else if (colKey === 'ghiChu') {
          textVal = sample.ghiChu || '';
        } else {
          // Các cột chỉ tiêu kết quả hoặc QC (kqTrifluralin, kqFip, qc1,...)
          textVal = sample[colKey] !== undefined ? sample[colKey] : (sample.kq !== undefined ? sample.kq : '');
        }
        
        // Cột mã số mẫu: Áp dụng ngắt dòng tự động dựa trên cấu hình maSoMauChunkSize
        const chunkSize = (colKey === 'maSoMau') ? (sopConfig.maSoMauChunkSize || 0) : 0;
        setCellText(candidateRow, colIdx, textVal, chunkSize, sopConfig.defaultFontSize);
      }
      
      sampleIdx++;
      rowIdx++;
    }
    
    // 2.5. Dọn dẹp các dòng trống còn lại trong KHU VỰC mẫu thử
    // LƯU Ý: Giữ nguyên form biểu mẫu: CHỈ xóa trắng text, KHÔNG xóa dòng (removeRow)
    while (rowIdx < endSampleRowIdx) {
      const candidateRow = currentTable.getRow(rowIdx);
      const rowText = candidateRow.getText().trim();
      
      if (rowText.includes("Mã số mẫu") || 
          rowText.includes("Vial No") || 
          rowText.includes("Kết quả mẫu thử") || 
          rowText.includes("Fipronil desulfinyl") || 
          rowText.includes("Chlorpyrifos methyl")) {
        rowIdx++;
        continue;
      }
      
      for (const [colKey, colIdx] of Object.entries(cols)) {
        if (colIdx === undefined || colIdx === null) continue;
        setCellText(candidateRow, colIdx, '', null, sopConfig.defaultFontSize);
      }
      rowIdx++;
    }
  }

  // 3. CẬP NHẬT TRANG (TRANG: X/Y) TRỰC TIẾP TRÊN BIỂU MẪU GỐC
  try {
    const sampleTableBodyIndices = new Set();
    for (let p2 = 0; p2 < totalPagesNeeded; p2++) {
      const tIdx = sampleTableIndex + p2 * tablesPerPage;
      if (tIdx < tables.length) {
        sampleTableBodyIndices.add(body.getChildIndex(tables[tIdx]));
      }
    }
    
    for (let p = 0; p < totalPagesNeeded; p++) {
      const currentTableIdx = sampleTableIndex + p * tablesPerPage;
      if (currentTableIdx >= tables.length) break;
      
      const currentTable = tables[currentTableIdx];
      const resultPageNum = p + 1;
      const childIdx = body.getChildIndex(currentTable);
      
      // Quét xuôi từ sau bảng mẫu để tìm nhãn "Trang:" đầu tiên xuất hiện của trang này
      let found = false;
      for (let idx = childIdx + 1; idx < body.getNumChildren(); idx++) {
        const nextChild = body.getChild(idx);
        const type = nextChild.getType();
        
        // Gặp bảng của trang tiếp theo -> Dừng quét để không lấn sang trang sau
        if (type === DocumentApp.ElementType.TABLE && sampleTableBodyIndices.has(idx) && idx !== childIdx) {
          break;
        }
        
        // Gặp paragraph ngắt trang của trang tiếp theo -> Dừng quét
        if (type === DocumentApp.ElementType.PARAGRAPH) {
          const para = nextChild.asParagraph();
          if (para.getAttributes()[DocumentApp.Attribute.PAGE_BREAK_BEFORE] === true) {
            break;
          }
          if (para.getText().includes("Trang")) {
            para.replaceText("Trang\\s*:[^\\n]*", `Trang: ${resultPageNum}/${totalPagesNeeded}`);
            found = true;
            break;
          }
        } else if (type === DocumentApp.ElementType.TABLE) {
          const table = nextChild.asTable();
          let cellFound = false;
          for (let r = 0; r < table.getNumRows(); r++) {
            const row = table.getRow(r);
            for (let c = 0; c < row.getNumCells(); c++) {
              const cell = row.getCell(c);
              if (cell.getText().includes("Trang")) {
                cell.replaceText("Trang\\s*:[^\\n]*", `Trang: ${resultPageNum}/${totalPagesNeeded}`);
                cellFound = true;
                break;
              }
            }
            if (cellFound) break;
          }
          if (cellFound) { found = true; break; }
        }
      }
      if (!found) Logger.log(`[TableFit] Cảnh báo: Không tìm thấy nhãn "Trang:" cho trang kết quả ${resultPageNum}`);
    }
  } catch(e) {
    Logger.log(`[TableFit] Lỗi khi cập nhật số Trang: X/Y: ${e.toString()}`);
  }

  // 3.5. TỰ ĐỘNG CẮT (TRUNCATE) CÁC TRANG DƯ THỪA NẾU CÓ TRANG TRỐNG DƯ THỪA TRONG TEMPLATE GỐC
  try {
    const currentTables = body.getTables();
    // Tính số lượng bảng mẫu hiện có dựa trên chỉ số bảng mẫu và số bảng mỗi trang
    const totalSampleTablesFound = [];
    for (let idx = sampleTableIndex; idx < currentTables.length; idx += tablesPerPage) {
      totalSampleTablesFound.push(idx);
    }

    if (totalPagesNeeded < totalSampleTablesFound.length) {
      const firstExcessTableIdx = totalSampleTablesFound[totalPagesNeeded];
      const excessTable = currentTables[firstExcessTableIdx];
      const excessTableChildIdx = body.getChildIndex(excessTable);
      
      // Tìm dấu ngắt trang ngay trước bảng thừa này để cắt từ đó
      let cutIdx = excessTableChildIdx;
      let pbInsideParagraph = false;
      
      for (let i = excessTableChildIdx - 1; i >= 0; i--) {
        const child = body.getChild(i);
        if (child.getType() === DocumentApp.ElementType.PAGE_BREAK) {
          cutIdx = i;
          break;
        }
        if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
          const p = child.asParagraph();
          let hasPB = false;
          for (let j = 0; j < p.getNumChildren(); j++) {
            if (p.getChild(j).getType() === DocumentApp.ElementType.PAGE_BREAK) {
              hasPB = true;
              break;
            }
          }
          if (hasPB) {
            cutIdx = i;
            pbInsideParagraph = true;
            break;
          }
        }
      }
      
      Logger.log(`[Autocut] Cắt bỏ trang thừa từ phần tử index ${cutIdx}`);
      let activeIndex = cutIdx;
      
      // Nếu PAGE_BREAK nằm chung trong paragraph chữ ký của trang trước, ta chỉ xóa từ PAGE_BREAK trở đi, giữ lại paragraph
      if (pbInsideParagraph) {
        const p = body.getChild(cutIdx).asParagraph();
        let foundPB = false;
        for (let j = p.getNumChildren() - 1; j >= 0; j--) {
          const pChild = p.getChild(j);
          if (pChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
            p.removeChild(pChild);
            foundPB = true;
            break;
          } else if (!foundPB) {
            p.removeChild(pChild);
          }
        }
        activeIndex = cutIdx + 1; // Bỏ qua paragraph này, xóa hoàn toàn các phần tử từ index tiếp theo
      }

      while (activeIndex < body.getNumChildren()) {
        const child = body.getChild(activeIndex);
        try {
          body.removeChild(child);
        } catch(e) {
          try {
            if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
              child.asParagraph().clear();
            } else if (child.getType() === DocumentApp.ElementType.TABLE) {
              const tbl = child.asTable();
              for (let r = 0; r < tbl.getNumRows(); r++) {
                const row = tbl.getRow(r);
                for (let c = 0; c < row.getNumCells(); c++) {
                  row.getCell(c).clear();
                }
              }
            }
          } catch(err) {}
          activeIndex++;
        }
      }
    }
  } catch(e) {
    Logger.log(`[Autocut] Lỗi khi cắt trang thừa: ${e.toString()}`);
  }

  // 4. TIẾN HÀNH DỌN DẸP DẤU NGẮT TRANG & DÒNG TRỐNG THỪA Ở CUỐI TÀI LIỆU ĐÃ CẮT
  try {
    for (let k = 0; k < 3; k++) {
      const currentLastIdx = body.getNumChildren() - 1;
      if (currentLastIdx <= 0) break;
      const lastChild = body.getChild(currentLastIdx);
      let removed = false;
      
      if (lastChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
        try {
          body.removeChild(lastChild);
          removed = true;
        } catch(err) {}
      } else if (lastChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const p = lastChild.asParagraph();
        for (let c = p.getNumChildren() - 1; c >= 0; c--) {
          if (p.getChild(c).getType() === DocumentApp.ElementType.PAGE_BREAK) {
            try {
              p.removeChild(p.getChild(c));
            } catch(err) {}
          }
        }
        if (p.getText().trim() === "" && p.getNumChildren() === 0 && body.getNumChildren() > 1) {
          try {
            body.removeChild(p);
            removed = true;
          } catch(err) {}
        }
      }
      if (!removed) break;
    }
  } catch(e) {
    Logger.log(`[Autocut] Lỗi trong vòng lặp dọn dẹp: ${e.toString()}`);
  }

  try {
    const finalLastIdx = body.getNumChildren() - 1;
    if (finalLastIdx >= 0) {
      const lastChild = body.getChild(finalLastIdx);
      if (lastChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const p = lastChild.asParagraph();
        // Chỉ thu nhỏ paragraph RỖNG cuối cùng — KHÔNG xóa nếu có nội dung (vd: "Trang: 2/2")
        if (p.getText().trim() === '') {
          p.clear();
          p.setFontSize(1);
          p.setLineSpacing(0.06);
          p.setSpacingAfter(0);
          p.setSpacingBefore(0);
        }
      }
    }
  } catch(e) {}
}



/**
 * Xử lý đánh dấu ☑/☐ Đạt hoặc Không đạt trong bảng QC
 */
function fillQcTableCheckboxes(body, sopConfig, metadata) {
  const tables = body.getTables();
  let qcTable = null;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    if (t.getNumRows() >= 7) {
      const headerText = t.getRow(0).getCell(0).getText();
      if (headerText.includes("Thông số đánh giá")) {
        qcTable = t;
        break;
      }
    }
  }

  if (!qcTable) {
    Logger.log("[QcTable] Không tìm thấy bảng QC để điền!");
    return;
  }

  const checkboxLines = sopConfig.checkboxLines;
  const numRows = qcTable.getNumRows();

  for (let r = 1; r < numRows; r++) {
    const row = qcTable.getRow(r);
    const labelText = row.getCell(0).getText().trim();
    
    // Tìm key tương ứng trong cấu hình checkboxLines
    let fieldName = null;
    for (const [keyText, fName] of Object.entries(checkboxLines)) {
      if (labelText.includes(keyText) || keyText.includes(labelText)) {
        fieldName = fName;
        break;
      }
    }

    if (fieldName && metadata[fieldName] !== undefined) {
      const val = metadata[fieldName];
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

      // Khớp và thay thế đúng checkbox Đạt/Không đạt/N/A
      evalCell.replaceText('[\\[\\(] ?[\\]\\)] Đạt', datCheck);
      evalCell.replaceText('[☐□☑] Đạt', datCheck);

      evalCell.replaceText('[\\[\\(] ?[\\]\\)] Không đạt', khongDatCheck);
      evalCell.replaceText('[☐□☑] Không đạt', khongDatCheck);

      evalCell.replaceText('[\\[\\(] ?[\\]\\)] N/A', naCheck);
      evalCell.replaceText('[☐□☑] N/A', naCheck);
    }
  }
}
