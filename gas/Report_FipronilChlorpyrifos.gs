
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
    if (maHoSoVal) {
      let found = body.findText('(?i)Mã\\s*hồ\\s*sơ[^:\\n]*:');
      while (found) {
        const textElement = found.getElement().asText();
        const end = found.getEndOffsetInclusive();
        const fullText = textElement.getText();
        
        let cursor = end + 1;
        // Bỏ qua dấu cách ngay sau dấu hai chấm (nhưng không bỏ qua Tab)
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
        
        found = body.findText('(?i)Mã\\s*hồ\\s*sơ[^:\\n]*:', found);
      }
    }

    const fVal = (metadata.heSoPhaLoang || "1").trim();
    const isF1 = fVal === "1";
    const f1Check = isF1 ? "☑" : "☐";
    const fOtherCheck = !isF1 ? "☑" : "☐";
    
    replaceCheckboxSafely(body, 'Hệ số pha loãng:\\s*[☐□☑]', f1Check);
    replaceCheckboxSafely(body, 'f=\\s*1\\s*;\\s*[☐□☑]', fOtherCheck);
    if (!isF1) {
      replaceDotsSafely(body, 'f=\\s*[\\.…]+', fVal);
    }

    const loaiMauVal = (metadata.loaiMau || "Thủy sản").trim();
    const isTS = loaiMauVal === "Thủy sản" || loaiMauVal === "Thuỷ sản";
    const tsCheck = isTS ? "☑" : "☐";
    const loaiMauOtherCheck = !isTS ? "☑" : "☐";
    
    replaceCheckboxSafely(body, 'Loại mẫu:\\s*[☐□☑]', tsCheck);
    replaceCheckboxSafely(body, 'sản\\s*;\\s*[☐□☑]', loaiMauOtherCheck);
    if (!isTS) {
      replaceDotsSafely(body, 'Khác\\s*:\\s*[\\.…]+', loaiMauVal);
    }

    const tinhTrangVal = (metadata.tinhTrangMau || "Bình thường").trim();
    const isNormal = tinhTrangVal === "Bình thường";
    const normalCheck = isNormal ? "☑" : "☐";
    const normalOtherCheck = !isNormal ? "☑" : "☐";

    replaceCheckboxSafely(body, 'Tình trạng mẫu:\\s*[☐□☑]', normalCheck);
    replaceCheckboxSafely(body, 'thường\\s*;\\s*[☐□☑]', normalOtherCheck);
    if (!isNormal) {
      replaceDotsSafely(body, 'Khác\\s*:\\s*[\\.…]+', tinhTrangVal);
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
