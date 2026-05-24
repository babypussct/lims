/**
 * Custom Report Generator for Trifluralin (SOP-03)
 * ===============================================
 * Tự động điền Bảng Đường chuẩn (Table 4) và các mẫu chính
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
      setCellText(calibrationTable.getRow(r2RowIdx), 1, '', null, sopConfig.defaultFontSize);
    } else {
      // Nếu không, điền vào ô 1 như bình thường
      setCellText(calibrationTable.getRow(r2RowIdx), 1, r2Val, null, sopConfig.defaultFontSize);
    }

    // Điền 7 điểm đường chuẩn
    const calibPoints = metadata.calibPoints || [];
    const startPtRowIdx = numRows - 8;
    for (let i = 0; i < 7; i++) {
      const pt = calibPoints[i] || { loSo: '', hamLuong: '' };
      const rowIdx = startPtRowIdx + i;
      const row = calibrationTable.getRow(rowIdx);
      setCellText(row, 0, pt.loSo || '', null, sopConfig.defaultFontSize);
      setCellText(row, 1, pt.hamLuong || '', null, sopConfig.defaultFontSize);
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
