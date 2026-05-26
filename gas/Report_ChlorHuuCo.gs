/**
 * Custom Report Generator for Nhóm Chlor hữu cơ (SOP ID: nhom_lan_huu_co_gc-msms_copy_1768036876719)
 * =========================================================================================
 * Tách riêng hoàn toàn cả xử lý tạo báo cáo, điền dữ liệu, và logic nhân bản trang dạng 3B
 * của Chlor hữu cơ để phục vụ phát triển/tùy biến giao diện báo cáo độc lập.
 */

function generateCustomReport_chlor_huu_co(templateId, metadata, samples, folder, fileName, version) {
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = templateFile.makeCopy(fileName, folder);
  const docId = newFile.getId();
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  // Lấy cấu hình của Chlor hữu cơ từ cấu hình chung (hoặc tùy biến trực tiếp ở đây)
  const sopConfig = CONFIG.SOP_CONFIG['chlor-huu-co'];

  // Sử dụng bộ engine nội bộ riêng biệt của Chlor hữu cơ
  generateChlorHuuCoReport(body, sopConfig, metadata, samples);

  // Lưu doc
  doc.saveAndClose();

  // Xuất file PDF
  const pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
  const pdfName = fileName + '.pdf';
  const pdfFile = folder.createFile(pdfBlob).setName(pdfName);

  const pdfUrl     = pdfFile.getUrl();
  const docsUrl    = `https://docs.google.com/document/d/${docId}/edit`;
  const pdfViewUrl = pdfFile.getDownloadUrl();

  Logger.log(`[ChlorHuuCoCustom] Report created: ${fileName} | Doc: ${docId} | PDF: ${pdfFile.getId()}`);

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
 * Nhân bản trang theo từng mẫu thử và gọi hàm điền dữ liệu riêng biệt
 */
function generateChlorHuuCoReport(body, sopConfig, metadata, samples) {
  const numChildren = body.getNumChildren();
  const children = [];
  for (let i = 0; i < numChildren; i++) {
    children.push(body.getChild(i).copy());
  }

  // Điền dữ liệu cho mẫu đầu tiên
  if (samples.length > 0) {
    fillChlorHuuCoSample(body, sopConfig, metadata, samples[0]);
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
    fillChlorHuuCoSampleForElements(tempContainer, sopConfig, metadata, samples[s]);
  }
  
  // Tự động thu dọn PageBreak cuối tài liệu nếu có
  cleanChlorHuuCoLastPageBreak(body);
}

/**
 * Helper điền dữ liệu cấp độ body chính
 */
function fillChlorHuuCoSample(body, sopConfig, metadata, sample) {
  fillChlorHuuCoSampleForElements([body], sopConfig, metadata, sample);
}

/**
 * Helper thay thế placeholder và điền kết quả cho mẫu dạng 3B trên danh sách các phần tử
 */
function fillChlorHuuCoSampleForElements(elements, sopConfig, metadata, sample) {
  const allFields = { ...metadata, ...sample };
  
  for (const element of elements) {
    // 1. Thay thế thông tin mẻ và mã số mẫu cơ bản
    element.replaceText('{{MaSoMau}}', sample.maSoMau || '');
    
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
    
    // 3. Thay thế các dòng checkLines dạng [ ] hoặc ☐
    if (sopConfig.checkboxLines) {
      for (const [lineText, fieldName] of Object.entries(sopConfig.checkboxLines)) {
        const isChecked = metadata[fieldName] === true;
        const checkChar = isChecked ? '☑' : '☐';
        element.replaceText('\\[ \\]', checkChar);
        element.replaceText('☐', checkChar);
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
    
    // 5. Thay thế kết quả kết luận cho từng hoạt chất riêng biệt
    if (sopConfig.resultColumns) {
      for (const col of sopConfig.resultColumns) {
        const key = col.key;
        const kqVal = sample[key] !== undefined && sample[key] !== null ? sample[key].toString() : '';
        const ndVal = sample[key + '_nd'] === true ? '☑' : '☐';
        const qc1Val = sample[key + '_qc1'] || '☐';
        const qc2Val = sample[key + '_qc2'] || '☐';
        const qc3Val = sample[key + '_qc3'] || '☐';
        
        element.replaceText(`{{KQ_${key}}}`, kqVal);
        element.replaceText(`{{ND_${key}}}`, ndVal);
        element.replaceText(`{{QC1_${key}}}`, qc1Val === 'Đạt' || qc1Val === '☑' ? '☑' : '☐');
        element.replaceText(`{{QC1_KD_${key}}}`, qc1Val === 'Không đạt' || qc1Val === '☒' || qc1Val === 'Không Đạt' ? '☑' : '☐');
        element.replaceText(`{{QC2_${key}}}`, qc2Val === 'Đạt' || qc2Val === '☑' ? '☑' : '☐');
        element.replaceText(`{{QC2_KD_${key}}}`, qc2Val === 'Không đạt' || qc2Val === '☒' || qc2Val === 'Không Đạt' ? '☑' : '☐');
        element.replaceText(`{{QC3_${key}}}`, qc3Val === 'Đạt' || qc3Val === '☑' ? '☑' : '☐');
        element.replaceText(`{{QC3_KD_${key}}}`, qc3Val === 'Không đạt' || qc3Val === '☒' || qc3Val === 'Không Đạt' ? '☑' : '☐');
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
  }
}

/**
 * Dọn dẹp PageBreak thừa ở cuối tài liệu sau khi nhân bản trang
 */
function cleanChlorHuuCoLastPageBreak(body) {
  try {
    const numChildren = body.getNumChildren();
    if (numChildren > 0) {
      const lastChild = body.getChild(numChildren - 1);
      if (lastChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
        body.removeChild(lastChild);
        Logger.log("[Autocut ChlorHuuCo] Đã xóa PageBreak thừa cuối tài liệu.");
      }
    }
  } catch(e) {
    Logger.log(`[Autocut ChlorHuuCo] Không thể dọn dẹp PageBreak cuối: ${e.toString()}`);
  }
}
