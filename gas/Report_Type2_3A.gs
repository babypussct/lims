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
        // Thay thế đúng vị trí [ ] hoặc ☐, không làm hỏng font chữ
        para.replaceText('\\[ \\]', checkChar);
        para.replaceText('☐', checkChar);
        
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
  
  // Tính số lượng bảng trên mỗi trang bằng khoảng cách giữa 2 bảng mẫu liên tiếp
  const tablesPerPage = sampleTableIndices.length > 1 
    ? (sampleTableIndices[1] - sampleTableIndices[0]) 
    : tables.length;

  const cols  = sopConfig.columns;
  const startRow = sopConfig.headerRows || 1;
  const maxSamplesPerPage = sampleTable.getNumRows() - startRow; // Dung lượng tối đa 1 trang
  const totalPagesNeeded = Math.ceil(samples.length / maxSamplesPerPage);
  
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
    
    let rowIdx = startRow;
    let pageExtraLines = 0;
    
    for (let i = 0; i < pageSamples.length; i++) {
      const sample = pageSamples[i];
      let row = null;
      
      // Bỏ qua tất cả các dòng tiêu đề lặp lại trong bảng
      while (rowIdx < currentTable.getNumRows()) {
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
        Logger.log(`[TableFit] Cảnh báo: Hết dòng trong bảng khi đang điền mẫu index ${i}`);
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
    
    // 2.5. Dọn dẹp các dòng trống còn lại trên trang này (nếu có placeholder chưa dùng)
    while (rowIdx < currentTable.getNumRows()) {
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
    
    // Tiến hành xóa các dòng trống ở cuối bảng tương ứng với số dòng bị phình ra
    if (pageExtraLines > 0) {
      const totalRows = currentTable.getNumRows();
      const lastSampleRowIdx = startRow + pageSamples.length - 1;
      
      // Số lượng dòng trống tối đa có thể xóa (từ dòng cuối bảng ngược lên đến dòng sau mẫu cuối cùng)
      const emptyRowsAvailable = totalRows - 1 - lastSampleRowIdx;
      
      // Xóa tối đa pageExtraLines dòng trống ở cuối bảng
      const rowsToDelete = Math.min(pageExtraLines, emptyRowsAvailable);
      if (rowsToDelete > 0) {
        Logger.log(`[TableFit] Phát hiện phình ${pageExtraLines} dòng trên trang ${p + 1}. Tiến hành xóa ${rowsToDelete} dòng trống ở cuối bảng.`);
        for (let r = 0; r < rowsToDelete; r++) {
          try {
            currentTable.removeRow(currentTable.getNumRows() - 1);
          } catch(err) {
            Logger.log(`[TableFit] Lỗi khi xóa dòng cuối bảng: ${err.toString()}`);
          }
        }
      }
    }
  }

  // 3. TỰ ĐỘNG CẮT (TRUNCATE) CÁC TRANG DƯ THỪA BẰNG CÔNG THỨC TOÁN HỌC BẤT BIẾN
  const numChildren = body.getNumChildren();
  let cutIndex = -1;

  if (sampleTableIndices.length > 1) {
    const idx1 = body.getChildIndex(tables[sampleTableIndices[0]]);
    const idx2 = body.getChildIndex(tables[sampleTableIndices[1]]);
    const elementsPerPage = idx2 - idx1;
    
    // Vị trí cắt chính xác tuyệt đối bằng số trang cần giữ nhân với số phần tử mỗi trang
    cutIndex = totalPagesNeeded * elementsPerPage;
    Logger.log(`[Autocut] Tính toán vị trí cắt bằng toán học: idx1=${idx1}, idx2=${idx2}, elementsPerPage=${elementsPerPage} | Cắt từ child index ${cutIndex}`);
    
    if (cutIndex >= numChildren) {
      cutIndex = -1;
    }
  }

  // Nếu tìm thấy dấu cắt, tiến hành xóa toàn bộ các phần tử thừa từ điểm cắt tới cuối tài liệu
  if (cutIndex !== -1) {
    Logger.log(`[Autocut] Tiến hành cắt bỏ các trang thừa. Điểm cắt tại phần tử index ${cutIndex}.`);
    
    let activeIndex = cutIndex;
    while (activeIndex < body.getNumChildren()) {
      const child = body.getChild(activeIndex);
      try {
        body.removeChild(child);
        // Nếu xóa thành công, phần tử tiếp theo sẽ tự động dịch chuyển về index activeIndex
      } catch(e) {
        Logger.log(`[Autocut] Không thể xóa phần tử index ${activeIndex}: ${e.toString()}`);
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
        } catch(err) {
          Logger.log(`[Autocut] Không thể clear phần tử index ${activeIndex}: ${err.toString()}`);
        }
        activeIndex++;
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

    // Thiết lập chiều cao của phần tử Paragraph cuối cùng về 1pt và không có khoảng cách
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
    } catch(e) {
      Logger.log(`[Autocut] Lỗi khi co nhỏ paragraph cuối: ${e.toString()}`);
    }
  }
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

