
function generateCustomReport_fipronil_chlorpyrifos(templateId, metadata, samples, folder, fileName, version) {
  return generateFipronilChlorpyrifosStyleReport_(templateId, metadata, samples, folder, fileName, version, 'fipronil-chlorpyrifos');
}

function generateCustomReport_tbvtv_thuc_pham_gcmsms_rut_gon(templateId, metadata, samples, folder, fileName, version) {
  return generateFipronilChlorpyrifosStyleReport_(templateId, metadata, samples, folder, fileName, version, 'tbvtv-thuc-pham-gcmsms-rut-gon');
}

function generateFipronilChlorpyrifosStyleReport_(templateId, metadata, samples, folder, fileName, version, sopConfigKey) {
  return generateReportFromTemplate(templateId, folder, fileName, ({ body }) => {

  const sopConfig = CONFIG.SOP_CONFIG[sopConfigKey] || CONFIG.SOP_CONFIG['fipronil-chlorpyrifos'];

  // 1. Điền các text fields & checkbox chung bằng bộ khung mặc định
  fillTextFields(body, sopConfig, metadata, samples);

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

    const fVal = metadata.heSoPhaLoang === undefined || metadata.heSoPhaLoang === null
      ? ""
      : metadata.heSoPhaLoang.toString().trim();
    const hasFValue = fVal !== "";
    const isF1 = hasFValue && fVal === "1";
    const f1Check = isF1 ? "☑" : "☐";
    const fOtherCheck = hasFValue && !isF1 ? "☑" : "☐";
    
    const mutableCheckboxPattern = '(?:[☐□☑☒]|\\[\\s*[xXvV]?\\s*\\]|\\(\\s*[xXvV]?\\s*\\))';

    replaceCheckboxSafely(body, 'Hệ số pha loãng:\\s*' + mutableCheckboxPattern, f1Check);
    replaceCheckboxSafely(body, 'f=\\s*1\\s*;\\s*' + mutableCheckboxPattern, fOtherCheck);
    if (hasFValue && !isF1) {
      replaceDotsSafely(body, 'f=\\s*[\\.…]+', fVal);
    }

    const loaiMauVal = metadata.loaiMau === undefined || metadata.loaiMau === null
      ? ""
      : metadata.loaiMau.toString().trim();
    const hasLoaiMau = loaiMauVal !== "";
    const isTS = loaiMauVal === "Thủy sản" || loaiMauVal === "Thuỷ sản";
    const tsCheck = isTS ? "☑" : "☐";
    const loaiMauOtherCheck = hasLoaiMau && !isTS ? "☑" : "☐";
    
    replaceCheckboxSafely(body, 'Loại mẫu:\\s*' + mutableCheckboxPattern, tsCheck);
    replaceCheckboxSafely(body, 'sản\\s*;\\s*' + mutableCheckboxPattern, loaiMauOtherCheck);
    if (hasLoaiMau && !isTS) {
      replaceDotsSafely(body, 'Khác\\s*:\\s*[\\.…]+', loaiMauVal);
    }

    const tinhTrangVal = metadata.tinhTrangMau === undefined || metadata.tinhTrangMau === null
      ? ""
      : metadata.tinhTrangMau.toString().trim();
    const hasTinhTrang = tinhTrangVal !== "";
    const isNormal = tinhTrangVal === "Bình thường";
    const normalCheck = isNormal ? "☑" : "☐";
    const normalOtherCheck = hasTinhTrang && !isNormal ? "☑" : "☐";

    replaceCheckboxSafely(body, 'Tình trạng mẫu:\\s*' + mutableCheckboxPattern, normalCheck);
    replaceCheckboxSafely(body, 'thường\\s*;\\s*' + mutableCheckboxPattern, normalOtherCheck);
    if (hasTinhTrang && !isNormal) {
      replaceDotsSafely(body, 'Khác\\s*:\\s*[\\.…]+', tinhTrangVal);
    }
  } catch (e) {
    Logger.log(`[FipronilCustom] Lỗi khi điền metadata đầu trang: ${e.toString()}`);
    throw e;
  }

  // 2. Điền Bảng QC (Xử lý ô Checkbox Đạt/Không đạt nằm ở cột 3 của hàng tương ứng)
  fillQcTableCheckboxes(body, sopConfig, metadata, sopConfigKey);

  // 3. Tìm và điền bảng đường chuẩn (Table 0: 6 dòng × 4 cột)
  const calibrationTable = requireFipronilCalibrationTable(body, sopConfigKey);
  Logger.log(`[FipronilCustom] Tìm thấy bảng đường chuẩn (6 dòng).`);
  const calibPoints = metadata.calibPoints || [];
  for (let i = 0; i < 5; i++) {
    const pt = calibPoints[i] || { vialNo: '', loSo: '' };
    const rowIdx = 1 + i; // Dòng 0 là header
    const row = calibrationTable.getRow(rowIdx);
    // Điền Vial No. (Cột index 3)
    const vialValue = pt.vialNo !== undefined && pt.vialNo !== null
      ? pt.vialNo
      : (pt.loSo !== undefined && pt.loSo !== null ? pt.loSo : '');
    setCellText(row, 3, vialValue);
  }

  // 4. Điền bảng mẫu kết quả chính (sử dụng logic fillSampleTable chuẩn)
  const renderStats = fillSampleTable(body, sopConfig, samples);
  assertPostGenerationReportComplete(body, sopConfig, metadata, samples, renderStats);
  });
}
