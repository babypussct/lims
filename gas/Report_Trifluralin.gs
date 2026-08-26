
function parseDatedPersonValue(value) {
  const raw = value === null || value === undefined ? '' : String(value).trim();
  if (!raw) return { date: '', name: '' };

  // Expected business format: dd/MM/yyyy / Person name.
  // Match the date explicitly so the slashes inside dd/MM/yyyy are never used
  // as the separator between date and name. The name may itself contain '/'.
  const match = raw.match(/^(\d{1,2}\/\d{1,2}\/\d{4})\s*\/\s*(.*)$/);
  if (match) {
    return { date: match[1].trim(), name: match[2].trim() };
  }

  return { date: raw, name: '' };
}

function generateCustomReport_trifluralin_gcms(templateId, metadata, samples, folder, fileName, version) {
  return generateReportFromTemplate(templateId, folder, fileName, ({ body }) => {

  // 1. Điền các text fields & checkbox chung bằng bộ khung mặc định
  const sopConfig = CONFIG.SOP_CONFIG['trifluralin-gcms'];
  fillTextFields(body, sopConfig, metadata, samples);

  // 1.5. Bổ sung thay thế các placeholder riêng biệt của biểu mẫu Trifluralin (nếu có trong template)
  const analystVal = metadata.ngayNguoiPhanTich || '';
  let datePhanTich = '';
  let namePhanTich = '';
  if (analystVal) {
    const parsedAnalyst = parseDatedPersonValue(analystVal);
    datePhanTich = parsedAnalyst.date;
    namePhanTich = parsedAnalyst.name;
  }

  const verifierVal = metadata.ngayNguoiThamTra || '';
  let dateThamTra = '';
  let nameThamTra = '';
  if (verifierVal) {
    const parsedVerifier = parseDatedPersonValue(verifierVal);
    dateThamTra = parsedVerifier.date;
    nameThamTra = parsedVerifier.name;
  }

  const detectionFlags = resolveBatchDetectionFlags(samples, sopConfig, metadata);
  body.replaceText('\\{\\{CheckTatCaND\\}\\}', detectionFlags.checkTatCaND ? '☑' : '☐');
  body.replaceText('\\{\\{CheckCoMauPhatHien\\}\\}', detectionFlags.checkCoMauPhatHien ? '☑' : '☐');
  body.replaceText('\\{\\{NgayPhanTich\\}\\}', datePhanTich);
  body.replaceText('\\{\\{NguoiPhanTich\\}\\}', namePhanTich);
  body.replaceText('\\{\\{NgayThamTra\\}\\}', dateThamTra);
  body.replaceText('\\{\\{NguoiThamTra\\}\\}', nameThamTra);

  // 2. Tìm và điền bảng đường chuẩn (Tìm bảng có dòng cuối cùng chứa R2 hoặc R² và tối thiểu 8 dòng)
  const calibrationTable = requireTrifluralinCalibrationTable(body, 'trifluralin-gcms');
  const numRows = calibrationTable.getNumRows();
  Logger.log(`[TrifluralinCustom] Tìm thấy bảng đường chuẩn (${numRows} dòng).`);
  // Điền R2
  const r2Val = metadata.r2 !== undefined && metadata.r2 !== null ? metadata.r2 : '';
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
    setCellText(row, 0, pt.loSo !== undefined && pt.loSo !== null ? pt.loSo : '', null, sopConfig.defaultFontSize);
    setCellText(row, 1, pt.hamLuong !== undefined && pt.hamLuong !== null ? pt.hamLuong : '', null, sopConfig.defaultFontSize);
  }

  // 3. Điền bảng mẫu kết quả chính (sử dụng logic fillSampleTable chuẩn)
  const renderStats = fillSampleTable(body, sopConfig, samples);
  assertPostGenerationReportComplete(body, sopConfig, metadata, samples, renderStats);
  });
}
