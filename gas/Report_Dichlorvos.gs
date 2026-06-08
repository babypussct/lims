
function generateCustomReport_dichlorvos_gcms(templateId, metadata, samples, folder, fileName, version) {
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = templateFile.makeCopy(fileName, folder);
  const docId = newFile.getId();
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  // 1. Điền các text fields & checkbox chung
  const sopConfig = CONFIG.SOP_CONFIG['dichlorvos-gcms'];
  fillTextFields(body, sopConfig, metadata);

  // 2. Tìm và điền bảng đường chuẩn (Bảng có dòng cuối cùng chứa R2 hoặc R² hoặc R 2)
  const tables = body.getTables();
  let calibrationTable = null;
  let numRows = 0;
  for (let t = 0; t < tables.length; t++) {
    const candidate = tables[t];
    const rCount = candidate.getNumRows();
    if (rCount >= 8) {
      const lastRowText = candidate.getRow(rCount - 1).getCell(0).getText().trim();
      if (lastRowText.indexOf('R2') !== -1 || lastRowText.indexOf('R²') !== -1 || lastRowText.indexOf('R 2') !== -1) {
        calibrationTable = candidate;
        numRows = rCount;
        break;
      }
    }
  }

  if (calibrationTable) {
    Logger.log(`[DichlorvosCustom] Tìm thấy bảng đường chuẩn (${numRows} dòng).`);
    // Điền R2
    const r2Val = metadata.r2 || '';
    const r2RowIdx = numRows - 1;
    setCellText(calibrationTable.getRow(r2RowIdx), 1, r2Val, null, sopConfig.defaultFontSize);

    // Điền 6 điểm đường chuẩn
    const calibPoints = metadata.calibPoints || [];
    const startPtRowIdx = numRows - 7; // Thường bảng gồm: Header, 6 dòng điểm, và 1 dòng R2
    for (let i = 0; i < 6; i++) {
      const rowIdx = startPtRowIdx + i;
      const row = calibrationTable.getRow(rowIdx);
      if (i < calibPoints.length) {
        const pt = calibPoints[i];
        setCellText(row, 0, `C${i}`, null, sopConfig.defaultFontSize);
        setCellText(row, 1, pt.loSo || '', null, sopConfig.defaultFontSize);
        setCellText(row, 2, pt.hamLuong || '', null, sopConfig.defaultFontSize);
      } else {
        setCellText(row, 0, '', null, sopConfig.defaultFontSize);
        setCellText(row, 1, '', null, sopConfig.defaultFontSize);
        setCellText(row, 2, '', null, sopConfig.defaultFontSize);
      }
    }
  } else {
    Logger.log('[DichlorvosCustom] CẢNH BÁO: Không tìm thấy bảng đường chuẩn.');
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
