/**
 * Custom Report Generator for Fipronil - Chlorpyrifos (SOP-01)
 * ============================================================
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
    // Thay thế khoảng trắng bằng ký tự Tab \t để kích hoạt tab stop gốc của template
    const p3Text = `1. Mã hồ sơ : ${maHoSoDisplay}\t2. Khối lượng mẫu: m = 10.0 ± 0.1 gram`;
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

    // Thay thế khoảng trắng bằng ký tự Tab \t để kích hoạt tab stop gốc của template
    const p4Text = `3. Hệ số pha loãng: ${f1Check} f= 1;  ${fOtherCheck} f= ${fOtherVal}\t4. Loại mẫu: ${tsCheck} Thuỷ sản; ${loaiMauOtherCheck} Khác: ${loaiMauOtherVal}`;
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
