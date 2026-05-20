/**
 * LIMS Report Generator — Dạng Biểu Mẫu 3B (Lân hữu cơ / Chlor hữu cơ)
 * ========================================================
 * Chứa logic nhân bản cấu trúc trang template theo từng mẫu thử và điền hoạt chất tương ứng.
 */

/**
 * Xử lý điền báo cáo cho Dạng 3B (Nhân bản trang theo từng mẫu)
 */
function generateType3bReport(body, sopConfig, metadata, samples) {
  const numChildren = body.getNumChildren();
  const children = [];
  for (let i = 0; i < numChildren; i++) {
    children.push(body.getChild(i).copy());
  }

  // Điền dữ liệu cho mẫu đầu tiên
  if (samples.length > 0) {
    fillType3bSample(body, sopConfig, metadata, samples[0]);
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
    fillType3bSampleForElements(tempContainer, sopConfig, metadata, samples[s]);
  }
  
  // Tự động thu dọn PageBreak cuối tài liệu nếu có
  cleanLastPageBreak(body);
}

/**
 * Helper điền dữ liệu mẫu 3B cấp độ body chính
 */
function fillType3bSample(body, sopConfig, metadata, sample) {
  fillType3bSampleForElements([body], sopConfig, metadata, sample);
}

/**
 * Helper thay thế placeholder và điền kết quả cho mẫu dạng 3B trên danh sách các phần tử
 */
function fillType3bSampleForElements(elements, sopConfig, metadata, sample) {
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
        element.replaceText(`{{QC2_${key}}}`, qc2Val === 'Đạt' || qc2Val === '☑' ? '☑' : '☐');
        element.replaceText(`{{QC3_${key}}}`, qc3Val === 'Đạt' || qc3Val === '☑' ? '☑' : '☐');
      }
    }
  }
}

/**
 * Dọn dẹp PageBreak thừa ở cuối tài liệu sau khi nhân bản trang
 */
function cleanLastPageBreak(body) {
  try {
    const numChildren = body.getNumChildren();
    if (numChildren > 0) {
      const lastChild = body.getChild(numChildren - 1);
      if (lastChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
        body.removeChild(lastChild);
        Logger.log("[Autocut 3B] Đã xóa PageBreak thừa cuối tài liệu.");
      }
    }
  } catch(e) {
    Logger.log(`[Autocut 3B] Không thể dọn dẹp PageBreak cuối: ${e.toString()}`);
  }
}
