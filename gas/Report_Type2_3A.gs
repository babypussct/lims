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
  
  // 1. Tìm tất cả các bảng mẫu trong tài liệu để tính toán tablesPerPage động
  const sampleTableIndices = [];
  for (let t = 0; t < tables.length; t++) {
    const candidate = tables[t];
    if (candidate.getNumRows() >= 10) {
      const headerText = candidate.getRow(0).getText();
      if (headerText.includes('Lọ số') || headerText.includes('Mẫu thử') || headerText.includes('Mã số mẫu')) {
        sampleTableIndices.push(t);
      }
    }
  }

  if (sampleTableIndices.length === 0) {
    throw new Error("Không tìm thấy bảng mẫu điền dữ liệu.");
  }

  const sampleTableIndex = sampleTableIndices[0];
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

  const maxSamplesPerPage = endSampleRowIdx - startRow; // Dung lượng tối đa thực tế của 1 trang mẫu thử
  const totalPagesNeeded = Math.ceil(samples.length / maxSamplesPerPage);
  
  Logger.log(`[TableFit] endSampleRowIdx=${endSampleRowIdx} | maxSamplesPerPage=${maxSamplesPerPage} | totalPagesNeeded=${totalPagesNeeded}`);

  // 1.5. ĐỘNG CƠ NHÂN BẢN TRANG TỰ ĐỘNG THẾ HỆ MỚI (UNIVERSAL PAGE DUPLICATOR)
  // Nếu số lượng trang kết quả cần dùng lớn hơn số lượng trang mẫu sẵn có trong template
  if (totalPagesNeeded > sampleTableIndices.length) {
    const pagesToClone = totalPagesNeeded - sampleTableIndices.length;
    Logger.log(`[TableFit] Phát hiện thiếu trang mẫu. Cần: ${totalPagesNeeded} trang | Sẵn có: ${sampleTableIndices.length} trang | Tiến hành nhân bản thêm ${pagesToClone} trang kết quả...`);
    
    // Định vị bảng mẫu cuối cùng và chỉ mục của nó trong body
    const lastTable = tables[sampleTableIndices[sampleTableIndices.length - 1]];
    const lastTableChildIdx = body.getChildIndex(lastTable);
    
    // Tìm vị trí của dấu ngắt trang ngăn cách ngay trước bảng mẫu cuối cùng
    let lastPageBreakIdx = -1;
    for (let idx = lastTableChildIdx - 1; idx >= 0; idx--) {
      const child = body.getChild(idx);
      if (child.getType() === DocumentApp.ElementType.PAGE_BREAK) {
        lastPageBreakIdx = idx;
        break;
      }
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        const para = child.asParagraph();
        let foundInside = false;
        for (let i = 0; i < para.getNumChildren(); i++) {
          if (para.getChild(i).getType() === DocumentApp.ElementType.PAGE_BREAK) {
            lastPageBreakIdx = idx;
            foundInside = true;
            break;
          }
        }
        if (foundInside) break;
      }
    }
    
    // Xác định chỉ mục bắt đầu sao chép
    let startCopyIdx = -1;
    if (lastPageBreakIdx !== -1) {
      startCopyIdx = lastPageBreakIdx + 1;
    } else {
      // Fallback nếu hoàn toàn không tìm thấy Page Break nào phía trước bảng
      startCopyIdx = Math.max(0, lastTableChildIdx - 1);
    }
    
    const endCopyIdx = body.getNumChildren() - 1;
    Logger.log(`[TableFit] Phạm vi phần tử trang kết quả cuối cùng: từ index ${startCopyIdx} đến ${endCopyIdx}`);
    
    if (startCopyIdx >= 0 && startCopyIdx <= endCopyIdx) {
      const page2Elements = [];
      for (let idx = startCopyIdx; idx <= endCopyIdx; idx++) {
        page2Elements.push(body.getChild(idx));
      }
      
      // Nhân bản thêm số trang còn thiếu
      for (let p = 0; p < pagesToClone; p++) {
        // Kiểm tra xem cuối tài liệu đã có ngắt trang chưa để tránh tạo trang trắng thừa
        // Quét ngược bỏ qua toàn bộ dòng trống để tìm dấu ngắt trang thực tế
        let needsPageBreak = true;
        for (let idx = body.getNumChildren() - 1; idx >= 0; idx--) {
          const el = body.getChild(idx);
          const elType = el.getType();
          
          if (elType === DocumentApp.ElementType.PAGE_BREAK) {
            needsPageBreak = false;
            break;
          } else if (elType === DocumentApp.ElementType.PARAGRAPH) {
            const pEl = el.asParagraph();
            let foundInside = false;
            for (let cIdx = 0; cIdx < pEl.getNumChildren(); cIdx++) {
              if (pEl.getChild(cIdx).getType() === DocumentApp.ElementType.PAGE_BREAK) {
                foundInside = true;
                break;
              }
            }
            if (foundInside) {
              needsPageBreak = false;
              break;
            }
            
            // Nếu đoạn văn này có chứa chữ hoặc phần tử khác, nghĩa là đã quay lại vùng nội dung trang
            if (pEl.getText().trim() !== "" || pEl.getNumChildren() > 0) {
              break;
            }
          } else if (elType === DocumentApp.ElementType.TABLE) {
            // Gặp bảng nghĩa là đã quay lại nội dung trang
            break;
          }
        }
        
        Logger.log(`[TableFit] Trang nhân bản ${p + 1}: needsPageBreak = ${needsPageBreak}`);
        if (needsPageBreak) {
          body.appendPageBreak();
        }
        
        // Chèn bản sao các phần tử của trang mẫu
        Logger.log(`[TableFit] Đang sao chép ${page2Elements.length} phần tử từ trang gốc...`);
        for (let j = 0; j < page2Elements.length; j++) {
          const el = page2Elements[j];
          const elType = el.getType();
          
          Logger.log(`  - Phần tử [${j}]: Type = ${elType} | Text = ${elType === DocumentApp.ElementType.PARAGRAPH || elType === DocumentApp.ElementType.LIST_ITEM ? el.getText().substring(0, 40) : 'N/A'}`);
          if (elType === DocumentApp.ElementType.PAGE_BREAK) continue;
          
          if (elType === DocumentApp.ElementType.PARAGRAPH) {
            const clonedPara = el.copy().asParagraph();
            // Loại bỏ bất kỳ dấu ngắt trang ẩn nào bên trong đoạn văn copy để tránh tạo trang trống thừa
            for (let i = clonedPara.getNumChildren() - 1; i >= 0; i--) {
              if (clonedPara.getChild(i).getType() === DocumentApp.ElementType.PAGE_BREAK) {
                try { clonedPara.removeChild(clonedPara.getChild(i)); } catch(e) {}
              }
            }
            body.appendParagraph(clonedPara);
          } else if (elType === DocumentApp.ElementType.TABLE) {
            body.appendTable(el.copy().asTable());
          } else if (elType === DocumentApp.ElementType.LIST_ITEM) {
            body.appendListItem(el.copy().asListItem());
          }
        }
      }
      
      // Sau khi nhân bản xong, nạp lại danh sách tables mới nhất từ tài liệu
      Logger.log(`[TableFit] Đã nhân bản xong ${pagesToClone} trang. Tải lại danh sách bảng...`);
      tables.length = 0; // Xóa danh sách cũ
      const freshTables = body.getTables();
      for (let t = 0; t < freshTables.length; t++) {
        tables.push(freshTables[t]);
      }
    }
  }

  // Tính số lượng bảng trên mỗi trang bằng khoảng cách giữa 2 bảng mẫu liên tiếp
  // Lưu ý: Sau khi nhân bản, phải tính lại từ danh sách bảng mới
  let tablesPerPage = 1;
  {
    // Tính lại sampleTableIndices từ danh sách tables đã được cập nhật
    const freshSampleTableIndices = [];
    for (let t = 0; t < tables.length; t++) {
      const candidate = tables[t];
      if (candidate.getNumRows() >= 10) {
        const headerText = candidate.getRow(0).getText();
        if (headerText.includes('Lọ số') || headerText.includes('Mẫu thử') || headerText.includes('Mã số mẫu')) {
          freshSampleTableIndices.push(t);
        }
      }
    }
    if (freshSampleTableIndices.length > 1) {
      tablesPerPage = freshSampleTableIndices[1] - freshSampleTableIndices[0];
    }
    Logger.log(`[ReportType2] freshSampleTableIndices=${JSON.stringify(freshSampleTableIndices)} | tablesPerPage=${tablesPerPage}`);
  }

  Logger.log(`[ReportType2] Đang xử lý: Tổng mẫu: ${samples.length} | Dung lượng 1 trang: ${maxSamplesPerPage} | Số trang cần giữ: ${totalPagesNeeded}`);

  // 2. Điền dữ liệu phân đoạn tương ứng cho từng trang cần thiết
  for (let p = 0; p < totalPagesNeeded; p++) {
    const currentTableIdx = sampleTableIndex + p * tablesPerPage;
    
    // Đảm bảo không bị tràn mảng nếu mẫu nhiều vượt quá số lượng trang thực tế trong file
    if (currentTableIdx >= tables.length) {
      Logger.log(`CẢNH BÁO: Số lượng mẫu vượt quá dung lượng tối đa của template (${tables.length / tablesPerPage} trang).`);
      break;
    }
    
    const currentTable = tables[currentTableIdx];
    const pageSamples = samples.slice(p * maxSamplesPerPage, (p + 1) * maxSamplesPerPage);
    
    let currentEndSampleRowIdx = startRow + maxSamplesPerPage;
    let rowIdx = startRow;
    let pageExtraLines = 0;
    
    for (let i = 0; i < pageSamples.length; i++) {
      const sample = pageSamples[i];
      let row = null;
      
      // Bỏ qua tất cả các dòng tiêu đề hoặc dòng đặc biệt trong phạm vi cho phép
      while (rowIdx < currentEndSampleRowIdx) {
        const candidateRow = currentTable.getRow(rowIdx);
        const rowText = candidateRow.getText().trim();
        
        if (rowText.includes("Mã số mẫu") || 
            rowText.includes("Vial No") || 
            rowText.includes("Kết quả mẫu thử") || 
            rowText.includes("Fipronil desulfinyl") || 
            rowText.includes("Chlorpyrifos methyl")) {
          Logger.log(`[TableFit] Phát hiện dòng tiêu đề lặp lại tại hàng ${rowIdx}. Bỏ qua.`);
          rowIdx++;
        } else {
          row = candidateRow;
          break;
        }
      }
      
      if (!row) {
        Logger.log(`[TableFit] Cảnh báo: Hết dòng trong khu vực mẫu thử khi đang điền mẫu index ${i}`);
        break;
      }

      let rowExtraLines = 0;
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
        const e = setCellText(row, colIdx, textVal, chunkSize);
        rowExtraLines = Math.max(rowExtraLines, e);
      }
      
      pageExtraLines += rowExtraLines;
      rowIdx++;
    }
    
    // 2.5. Dọn dẹp các dòng trống còn lại trong KHU VỰC mẫu thử (không đụng đến khu vực kết quả bên dưới)
    while (rowIdx < currentEndSampleRowIdx) {
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
        setCellText(candidateRow, colIdx, '');
      }
      rowIdx++;
    }
    
    // Tiến hành xóa các dòng trống ở cuối khu vực mẫu thử nếu bị phình dòng ra
    if (pageExtraLines > 0) {
      const lastSampleRowIdx = startRow + pageSamples.length - 1;
      const emptyRowsAvailable = currentEndSampleRowIdx - 1 - lastSampleRowIdx;
      
      const rowsToDelete = Math.min(pageExtraLines, emptyRowsAvailable);
      if (rowsToDelete > 0) {
        Logger.log(`[TableFit] Phát hiện phình ${pageExtraLines} dòng trên trang ${p + 1}. Tiến hành xóa ${rowsToDelete} dòng trống trong vùng mẫu thử.`);
        for (let r = 0; r < rowsToDelete; r++) {
          try {
            currentTable.removeRow(currentEndSampleRowIdx - 1 - r);
          } catch(err) {
            Logger.log(`[TableFit] Lỗi khi xóa dòng trống: ${err.toString()}`);
          }
        }
        // Hiệu chỉnh lại mốc kết thúc sau khi xóa
        currentEndSampleRowIdx -= rowsToDelete;
      }
    }
  }
  // 3. TỰ ĐỘNG CẬP NHẬT TRANG (TRANG: X/Y) CHO TẤT CẢ CÁC TRANG KẾT QUẢ
  // Cấu trúc tài liệu: Trang 1 = trang thông tin (không có "Trang:"), Trang 2+ = các trang kết quả
  // => Trang kết quả số 1 ứng với currentPageNumber = 2 trong vòng lặp.
  // => Nhãn cần hiển thị: "Trang: (currentPageNumber - 1)/totalPagesNeeded"
  try {
    let currentPageNumber = 1; // bắt đầu từ trang thông tin
    for (let idx = 0; idx < body.getNumChildren(); idx++) {
      const child = body.getChild(idx);
      const type = child.getType();
      
      // Dấu ngắt trang độc lập (top-level PAGE_BREAK)
      if (type === DocumentApp.ElementType.PAGE_BREAK) {
        currentPageNumber++;
        continue;
      }
      
      if (type === DocumentApp.ElementType.PARAGRAPH) {
        const para = child.asParagraph();
        // Kiểm tra ngắt trang ẩn bên trong đoạn văn
        let hasPageBreak = false;
        for (let i = 0; i < para.getNumChildren(); i++) {
          if (para.getChild(i).getType() === DocumentApp.ElementType.PAGE_BREAK) {
            hasPageBreak = true;
            break;
          }
        }
        if (hasPageBreak) {
          currentPageNumber++;
        }
        // Chỉ cập nhật từ trang 2 trở đi (trang kết quả đầu tiên)
        const resultPageNum = currentPageNumber - 1; // trang kết quả số mấy (1-based)
        if (resultPageNum >= 1 && para.getText().includes("Trang")) {
          para.replaceText("Trang:? ?[0-9]+ ?/ ?[0-9]+", `Trang: ${resultPageNum}/${totalPagesNeeded}`);
        }
      } else if (type === DocumentApp.ElementType.TABLE) {
        const table = child.asTable();
        const resultPageNum = currentPageNumber - 1;
        if (resultPageNum >= 1) {
          for (let r = 0; r < table.getNumRows(); r++) {
            const row = table.getRow(r);
            for (let c = 0; c < row.getNumCells(); c++) {
              const cell = row.getCell(c);
              if (cell.getText().includes("Trang")) {
                cell.replaceText("Trang:? ?[0-9]+ ?/ ?[0-9]+", `Trang: ${resultPageNum}/${totalPagesNeeded}`);
              }
            }
          }
        }
      }
    }
  } catch(e) {
    Logger.log(`[TableFit] Lỗi khi cập nhật số Trang: X/Y: ${e.toString()}`);
  }

  // 3.5. TỰ ĐỘNG CẮT (TRUNCATE) CÁC TRANG DƯ THỪA NẾU CÓ TRANG TRỐNG DƯ THỪA TRONG TEMPLATE GỐC
  const currentTables = body.getTables();
  const currentSampleTableIndices = [];
  for (let t = 0; t < currentTables.length; t++) {
    const candidate = currentTables[t];
    if (candidate.getNumRows() >= 10) {
      const headerText = candidate.getRow(0).getText();
      if (headerText.includes('Lọ số') || headerText.includes('Mẫu thử') || headerText.includes('Mã số mẫu')) {
        currentSampleTableIndices.push(t);
      }
    }
  }

  if (totalPagesNeeded < currentSampleTableIndices.length) {
    const firstExcessTableIdx = currentSampleTableIndices[totalPagesNeeded];
    const excessTable = currentTables[firstExcessTableIdx];
    const excessTableChildIdx = body.getChildIndex(excessTable);
    
    // Tìm dấu ngắt trang ngay trước bảng thừa này để cắt từ đó
    let cutIdx = excessTableChildIdx;
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
          break;
        }
      }
    }
    
    Logger.log(`[Autocut] Cắt bỏ trang thừa từ phần tử index ${cutIdx}`);
    let activeIndex = cutIdx;
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
        p.clear();
        p.setFontSize(1);
        p.setLineSpacing(0.06);
        p.setSpacingAfter(0);
        p.setSpacingBefore(0);
      }
    }
  } catch(e) {}
}

/**
 * Hàm xử lý chuyên biệt cho chỉ tiêu Trifluralin (SOP-03)
 * Thực hiện điền Bảng Đường chuẩn (Table 4) và các mẫu chính
 */
function generateCustomReport_trifluralin_gcms(templateId, metadata, samples, folder, fileName, version) {
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = templateFile.makeCopy(fileName, folder);
  const docId = newFile.getId();
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  // 1. Điền các text fields & checkbox chung bằng bộ khung mặc định
  const sopConfig = CONFIG.SOP_CONFIG['trifluralin-gcms'];
  fillTextFields(body, sopConfig, metadata);

  // 1.5. Bổ sung thay thế các placeholder riêng biệt của biểu mẫu Trifluralin (nếu có trong template)
  const analystVal = metadata.ngayNguoiPhanTich || '';
  let datePhanTich = '';
  let namePhanTich = '';
  if (analystVal) {
    const parts = analystVal.split('/');
    if (parts.length > 1) {
      datePhanTich = parts[0].trim();
      namePhanTich = parts.slice(1).join('/').trim();
    } else {
      datePhanTich = analystVal.trim();
    }
  }

  const verifierVal = metadata.ngayNguoiThamTra || '';
  let dateThamTra = '';
  let nameThamTra = '';
  if (verifierVal) {
    const parts = verifierVal.split('/');
    if (parts.length > 1) {
      dateThamTra = parts[0].trim();
      nameThamTra = parts.slice(1).join('/').trim();
    } else {
      dateThamTra = verifierVal.trim();
    }
  }

  body.replaceText('\\{\\{CheckTatCaND\\}\\}', metadata.checkTatCaND ? '☑' : '☐');
  body.replaceText('\\{\\{CheckCoMauPhatHien\\}\\}', metadata.checkCoMauPhatHien ? '☑' : '☐');
  body.replaceText('\\{\\{NgayPhanTich\\}\\}', datePhanTich);
  body.replaceText('\\{\\{NguoiPhanTich\\}\\}', namePhanTich);
  body.replaceText('\\{\\{NgayThamTra\\}\\}', dateThamTra);
  body.replaceText('\\{\\{NguoiThamTra\\}\\}', nameThamTra);

  // 2. Tìm và điền bảng đường chuẩn (Tìm bảng có dòng cuối cùng chứa R2 hoặc R² và tối thiểu 8 dòng)
  const tables = body.getTables();
  let calibrationTable = null;
  let numRows = 0;
  for (let t = 0; t < tables.length; t++) {
    const candidate = tables[t];
    const rCount = candidate.getNumRows();
    if (rCount >= 8) {
      const lastRowText = candidate.getRow(rCount - 1).getCell(0).getText().trim();
      if (lastRowText.indexOf('R2') !== -1 || lastRowText.indexOf('R²') !== -1) {
        calibrationTable = candidate;
        numRows = rCount;
        break;
      }
    }
  }

  if (calibrationTable) {
    Logger.log(`[TrifluralinCustom] Tìm thấy bảng đường chuẩn (${numRows} dòng).`);
    // Điền R2
    const r2Val = metadata.r2 || '';
    const r2RowIdx = numRows - 1;
    const cell0Text = calibrationTable.getRow(r2RowIdx).getCell(0).getText();
    if (cell0Text.indexOf('{{R2}}') !== -1 || cell0Text.indexOf('{{r2}}') !== -1) {
      // Nếu có placeholder trong ô 0, thay thế trực tiếp và để ô 1 trống
      calibrationTable.getRow(r2RowIdx).getCell(0).replaceText('\\{\\{R2\\}\\}', r2Val);
      calibrationTable.getRow(r2RowIdx).getCell(0).replaceText('\\{\\{r2\\}\\}', r2Val);
      setCellText(calibrationTable.getRow(r2RowIdx), 1, '');
    } else {
      // Nếu không, điền vào ô 1 như bình thường
      setCellText(calibrationTable.getRow(r2RowIdx), 1, r2Val);
    }

    // Điền 7 điểm đường chuẩn
    const calibPoints = metadata.calibPoints || [];
    const startPtRowIdx = numRows - 8;
    for (let i = 0; i < 7; i++) {
      const pt = calibPoints[i] || { loSo: '', hamLuong: '' };
      const rowIdx = startPtRowIdx + i;
      const row = calibrationTable.getRow(rowIdx);
      setCellText(row, 0, pt.loSo || '');
      setCellText(row, 1, pt.hamLuong || '');
    }
  } else {
    Logger.log('[TrifluralinCustom] CẢNH BÁO: Không tìm thấy bảng đường chuẩn.');
  }

  // 3. Điền bảng mẫu kết quả chính (sử dụng logic fillSampleTable chuẩn)
  fillSampleTable(body, sopConfig, samples);

  // 4. Lưu doc
  doc.saveAndClose();

  // Export PDF
  const pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
  const pdfName = fileName + '.pdf';
  const pdfFile = folder.createFile(pdfBlob).setName(pdfName);

  const pdfUrl     = pdfFile.getUrl();
  const docsUrl    = `https://docs.google.com/document/d/${docId}/edit`;
  const pdfViewUrl = pdfFile.getDownloadUrl();

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
 * Hàm xử lý chuyên biệt cho chỉ tiêu Fipronil - Chlorpyrifos (SOP-01)
 * Thực hiện điền Bảng QC (đúng ô kết quả Đạt/Không Đạt) và Bảng Đường chuẩn
 */
function generateCustomReport_fipronil_chlorpyrifos(templateId, metadata, samples, folder, fileName, version) {
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = templateFile.makeCopy(fileName, folder);
  const docId = newFile.getId();
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  const sopConfig = CONFIG.SOP_CONFIG['fipronil-chlorpyrifos'];

  // 1. Điền các text fields & checkbox chung bằng bộ khung mặc định
  fillTextFields(body, sopConfig, metadata);

  // 1.1 Custom: Xử lý điền Mã hồ sơ, Hệ số pha loãng, Loại mẫu, Tình trạng mẫu
  try {
    const maHoSoVal = (metadata.maHoSo || "").trim();
    const maHoSoDisplay = maHoSoVal ? maHoSoVal : "……………………";
    const p3Text = `1. Mã hồ sơ : ${maHoSoDisplay}        2. Khối lượng mẫu: m = 10.0 ± 0.1 gram`;
    let searchResultP3 = body.findText("1\\. Mã hồ sơ");
    if (searchResultP3) {
      const para = searchResultP3.getElement().getParent().asParagraph();
      para.setText(p3Text);
      para.setFontFamily("Times New Roman");
      para.setFontSize(11);
      para.setUnderline(false);
    }

    const fVal = (metadata.heSoPhaLoang || "1").trim();
    const isF1 = fVal === "1";
    const f1Check = isF1 ? "☑" : "☐";
    const fOtherCheck = !isF1 ? "☑" : "☐";
    const fOtherVal = !isF1 ? fVal : "…..";

    const loaiMauVal = (metadata.loaiMau || "Thủy sản").trim();
    const isTS = loaiMauVal === "Thủy sản" || loaiMauVal === "Thuỷ sản";
    const tsCheck = isTS ? "☑" : "☐";
    const loaiMauOtherCheck = !isTS ? "☑" : "☐";
    const loaiMauOtherVal = !isTS ? loaiMauVal : "…………";

    const p4Text = `3. Hệ số pha loãng: ${f1Check} f= 1;  ${fOtherCheck} f= ${fOtherVal}     4. Loại mẫu: ${tsCheck} Thuỷ sản; ${loaiMauOtherCheck} Khác: ${loaiMauOtherVal}`;
    let searchResultP4 = body.findText("3\\. Hệ số pha loãng");
    if (searchResultP4) {
      const para = searchResultP4.getElement().getParent().asParagraph();
      para.setText(p4Text);
      para.setFontFamily("Times New Roman");
      para.setFontSize(11);
      para.setUnderline(false);
    }

    const tinhTrangVal = (metadata.tinhTrangMau || "Bình thường").trim();
    const isNormal = tinhTrangVal === "Bình thường";
    const normalCheck = isNormal ? "☑" : "☐";
    const normalOtherCheck = !isNormal ? "☑" : "☐";
    const normalOtherVal = !isNormal ? tinhTrangVal : "……………………………………………………";

    const p5Text = `5. Tình trạng mẫu: ${normalCheck} Bình thường; ${normalOtherCheck} Khác: ${normalOtherVal}`;
    let searchResultP5 = body.findText("5\\. Tình trạng mẫu");
    if (searchResultP5) {
      const para = searchResultP5.getElement().getParent().asParagraph();
      para.setText(p5Text);
      para.setFontFamily("Times New Roman");
      para.setFontSize(11);
      para.setUnderline(false);
    }
  } catch (e) {
    Logger.log(`[FipronilCustom] Lỗi khi điền metadata đầu trang: ${e.toString()}`);
  }

  // 2. Điền Bảng QC (Xử lý ô Checkbox Đạt/Không đạt nằm ở cột 3 của hàng tương ứng)
  fillQcTableCheckboxes(body, sopConfig, metadata);

  // 3. Tìm và điền bảng đường chuẩn (Table 0: 6 dòng × 4 cột)
  const tables = body.getTables();
  let calibrationTable = null;
  for (let t = 0; t < tables.length; t++) {
    const candidate = tables[t];
    if (candidate.getNumRows() === 6) {
      const cellText = candidate.getRow(0).getCell(0).getText();
      if (cellText.includes("Điểm chuẩn") || cellText.includes("Vial No")) {
        calibrationTable = candidate;
        break;
      }
    }
  }

  if (calibrationTable) {
    Logger.log(`[FipronilCustom] Tìm thấy bảng đường chuẩn (6 dòng).`);
    const calibPoints = metadata.calibPoints || [];
    for (let i = 0; i < 5; i++) {
      const pt = calibPoints[i] || { vialNo: '', loSo: '' };
      const rowIdx = 1 + i; // Dòng 0 là header
      const row = calibrationTable.getRow(rowIdx);
      // Điền Vial No. (Cột index 3)
      setCellText(row, 3, pt.vialNo || pt.loSo || '');
    }
  } else {
    Logger.log('[FipronilCustom] CẢNH BÁO: Không tìm thấy bảng đường chuẩn.');
  }

  // 4. Điền bảng mẫu kết quả chính (sử dụng logic fillSampleTable chuẩn)
  fillSampleTable(body, sopConfig, samples);

  // 5. Lưu doc
  doc.saveAndClose();

  // Export PDF
  const pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
  const pdfName = fileName + '.pdf';
  const pdfFile = folder.createFile(pdfBlob).setName(pdfName);

  const pdfUrl     = pdfFile.getUrl();
  const docsUrl    = `https://docs.google.com/document/d/${docId}/edit`;
  const pdfViewUrl = pdfFile.getDownloadUrl();

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

