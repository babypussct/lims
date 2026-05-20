/**
 * LIMS Report Generator — Google Apps Script
 * ============================================
 * Deploy as Web App:
 *   Execute as: Me (lab admin)
 *   Who has access: Anyone (hoặc Anyone with Google account)
 *
 * POST endpoint nhận JSON từ Angular, tạo PDF từ Google Docs template,
 * lưu vào Drive folder theo năm/tháng, trả về PDF URL.
 */

// ── CẤU HÌNH — chỉnh theo thực tế ──────────────────────────────────
const CONFIG = {
  // Root folder ID chứa tất cả báo cáo (folder "LIMS_Reports" anh đã tạo)
  ROOT_FOLDER_ID: '1B8KctFU-KDCPAwxrg8N75Sipk5SlGJkE',

  // Template Google Doc IDs cho từng SOP (điền sau khi upload template)
  TEMPLATES: {
    'trifluralin-gcms':       '1FN0onAiYBuSBiQk3DWQQGXTxvhHaI8VSaxD2qgUUAxY',   // filebieumau2
    'fipronil-chlorpyrifos':  'PASTE_GOOGLE_DOC_ID_HERE',   // filebieumau
    'dichlorvos-gcms':        'PASTE_GOOGLE_DOC_ID_HERE',   // filebieumau3
    'chlor-huu-co':           'PASTE_GOOGLE_DOC_ID_HERE',   // filebieumau4
    'lan-huu-co':             'PASTE_GOOGLE_DOC_ID_HERE',   // filebieumau5
  },

  // Config từng SOP: cách điền dữ liệu vào bảng
  SOP_CONFIG: {
    'trifluralin-gcms': {
      folderName: 'Trifluralin (GC-MS)',
      formType: 'type2',
      sampleTableIndex: 2,   // table index trong Google Doc (0-based)
      columns: {
        loSo:          0,    // col index "Lọ số"
        maSoMau:       1,    // col index "Mẫu thử"
        kqTrifluralin: 2,    // col index "KQ Trifluralin (µg/kg)"
        ghiChu:        3,    // col index "Ghi chú"
      },
      maSoMauChunkSize: 7,   // Tự động ngắt dòng cột mã số mẫu sau mỗi 7 ký tự (chỉ áp dụng cho Trifluralin)
      headerRows: 1,         // số hàng header không điền data
      textReplacements: {},
      checkboxLines: {
        'Các mẫu thử không phát hiện Trifluralin': 'checkTatCaND',
        'Có mẫu thử phát hiện Trifluralin':        'checkCoMauPhatHien',
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      }
    },
    'fipronil-chlorpyrifos': {
      folderName: 'Fipronil - Chlorpyrifos',
      formType: 'type2',
      sampleTableIndex: 2,
      columns: {
        loSo:          0, // Lọ số / Vial
        maSoMau:       1, // Mẫu thử
        kqFip:         2, // Fipronil
        kqFipDesl:     3, // Fipronil desulfinyl
        kqFipSulf:     4, // Fipronil sulfide
        kqFipSulf2:    5, // Fipronil sulfone
        kqClp:         6, // Chlorpyrifos
        kqClpMe:       7, // Chlorpyrifos methyl
        kqClpMeDes:    8, // Chlorpyriphos-methyl-desmethyl
        ghiChu:        9  // Ghi chú
      },
      headerRows: 1,
      textReplacements: {},
      checkboxLines: {
        'Các mẫu thử không phát hiện nhóm Fipronil và Chlorpyrifos': 'checkTatCaND',
        'Có mẫu thử phát hiện nhóm Fipronil và Chlorpyrifos':        'checkCoMauPhatHien',
        'Mẫu kiểm tra nội bộ':                                       'qcKiemTraNoiBo',
        'R2 >= 0.99':                                                'qcR2',
        'Độ lệch thời gian lưu':                                     'qcThoiGianLuu',
        'Nhận dạng mẫu nhiễm':                                       'qcNhanDang',
        'Nhận dạng mẫu thêm chuẩn':                                  'qcThemChuan',
        'Độ thu hồi IS':                                             'qcThuHoi',
        'Đánh giá chung':                                            'qcDanhGiaChung'
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      }
    },
    'dichlorvos-gcms': {
      folderName: 'Dichlorvos (GC-MS)',
      formType: 'type3a',
      sampleTableIndex: 2,
      columns: {
        maSoMau:       0, // Mã số mẫu
        khoiLuong:     1, // Khối lượng (g)
        heSoPhaLoang:  2, // Hệ số pha loãng F
        soVial:        3, // Số vial
        kqDichlorvos:  4  // Kết quả (ng/g)
      },
      headerRows: 1,
      textReplacements: {},
      checkboxLines: {
        'Các mẫu thử không phát hiện Dichlorvos': 'checkTatCaND',
        'Có mẫu thử phát hiện Dichlorvos':        'checkCoMauPhatHien',
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      }
    },
    'chlor-huu-co': {
      folderName: 'Chlor hữu cơ (Type 3B)',
      formType: 'type3b',
      columns: {}, // Sử dụng text replacements động cho Dạng 3B
      checkboxLines: {
        'Mẫu kiểm tra nội bộ':                                       'qcKiemTraNoiBo',
        'Độ thu hồi R%':                                             'qcThuHoiR',
        'Hệ số tuyến tính R2':                                       'qcR2',
        'Độ lệch thời gian lưu':                                     'qcThoiGianLuu',
        'S/N':                                                       'qcSN',
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      },
      resultColumns: [
        { key: 'Aldrin' }, { key: 'BHCa' }, { key: 'BHCb' }, { key: 'BHCd' }, { key: 'BHCe' }, { key: 'BHCg' },
        { key: 'Chlordane_cis' }, { key: 'Chlordane_oxy' }, { key: 'Chlordane_trans' }, { key: 'DDD_op' },
        { key: 'DDD_pp' }, { key: 'DDE_op' }, { key: 'DDE_pp' }, { key: 'DDT_op' }, { key: 'DDT_pp' },
        { key: 'Dieldrin' }, { key: 'Endosulfan1' }, { key: 'Endosulfan2' }, { key: 'EndosulfanS' }, { key: 'Endrin' },
        { key: 'Heptachlor' }, { key: 'HeptachlorA' }, { key: 'HeptachlorB' }, { key: 'HCB' }, { key: 'Isodrin' },
        { key: 'Methoxychlor' }, { key: 'Mirex' }, { key: 'Pendimethalin' }
      ]
    },
    'lan-huu-co': {
      folderName: 'Lân hữu cơ (Type 3B)',
      formType: 'type3b',
      columns: {}, // Sử dụng text replacements động cho Dạng 3B
      checkboxLines: {
        'Mẫu kiểm tra nội bộ':                                       'qcKiemTraNoiBo',
        'Độ thu hồi R%':                                             'qcThuHoiR',
        'Hệ số tuyến tính R2':                                       'qcR2',
        'Độ lệch thời gian lưu':                                     'qcThoiGianLuu',
        'S/N':                                                       'qcSN',
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      },
      resultColumns: [
        { key: 'Acephate' }, { key: 'AzinphosMethyl' }, { key: 'Cadusafos' }, { key: 'Chlorpyrifos' },
        { key: 'ChlorpyrifosMethyl' }, { key: 'Diazinon' }, { key: 'Dimethoate' }, { key: 'Edifenphos' },
        { key: 'Ethion' }, { key: 'Ethoprophos' }, { key: 'Fenitrothion' }, { key: 'Fenthion' },
        { key: 'Fipronil' }, { key: 'FipronilSulfide' }, { key: 'FipronilSulfone' }, { key: 'FipronilDesulfinyl' },
        { key: 'Iprobenfos' }, { key: 'Malathion' }, { key: 'Mefenoxam' }, { key: 'Metalaxyl' },
        { key: 'Methacrifos' }, { key: 'Methidathion' }, { key: 'Monocrotophos' }, { key: 'Omethoate' },
        { key: 'Parathion' }, { key: 'ParathionMethyl' }, { key: 'Phenthoate' }, { key: 'Phorate' },
        { key: 'Phosmet' }, { key: 'Phosphamidon' }, { key: 'PirimiphosMethyl' }, { key: 'Profenofos' },
        { key: 'Quinalphos' }, { key: 'Ronnel' }, { key: 'Triazophos' }, { key: 'Vamidothion' },
        { key: 'Chlorfenvinphos' }, { key: 'IsofenphosMethyl' }
      ]
    }
  }
};

// GAS Web App tự xử lý CORS — không cần setHeader thủ công

// ── doGet: health check ───────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'LIMS Report Generator' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── doPost: main entry point ──────────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { sopId, metadata, samples, action, version } = payload;

    // Validate
    if (!sopId || !CONFIG.TEMPLATES[sopId]) {
      throw new Error(`Unknown sopId: ${sopId}`);
    }

    let result;
    if (action === 'generate_pdf') {
      result = generateReport(sopId, metadata, samples, version);
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, ...result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Error: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Core: Tạo báo cáo ────────────────────────────────────────────────
function generateReport(sopId, metadata, samples, version) {
  const templateId = CONFIG.TEMPLATES[sopId];
  const sopConfig   = CONFIG.SOP_CONFIG[sopId];

  if (!templateId || templateId === 'PASTE_GOOGLE_DOC_ID_HERE') {
    throw new Error(`Template chưa được cấu hình cho SOP: ${sopId}`);
  }

  // 1. Tạo tên file theo chuẩn có version
  const now = new Date();
  const dateStr = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyyMMdd_HHmm');
  const vSuffix = version ? `_v${version}` : '';
  const fileName = `KQ_${sopId}_${metadata.batchCode || dateStr}${vSuffix}`;

  // 2. Tạo/lấy folder theo năm/tháng/chỉ tiêu
  const folder = getOrCreateFolder(now, sopId);

  // 3. Copy template
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = templateFile.makeCopy(fileName, folder);
  const docId = newFile.getId();
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  if (sopConfig.formType === 'type3b') {
    // ── GHI DỮ LIỆU CHO DẠNG 3B (NHÂN BẢN TRANG THEO TỪNG MẪU) ──
    const numChildren = body.getNumChildren();
    const children = [];
    for (let i = 0; i < numChildren; i++) {
      children.push(body.getChild(i).copy());
    }

    if (samples.length > 0) {
      fillType3bSample(body, sopConfig, metadata, samples[0]);
    }

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
  } else {
    // ── GHI DỮ LIỆU CHO DẠNG 2 & 3A (ĐIỀN BẢNG DÂN DỰNG TRÊN 1 HOẶC NHIỀU TRANG) ──
    fillTextFields(body, sopConfig, metadata);
    fillSampleTable(body, sopConfig, samples);
  }

  // 6. Lưu doc
  doc.saveAndClose();

  // 7. Export PDF
  const pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
  const pdfName = fileName + '.pdf';
  const pdfFile = folder.createFile(pdfBlob).setName(pdfName);

  const pdfUrl     = pdfFile.getUrl();
  const docsUrl    = `https://docs.google.com/document/d/${docId}/edit`;
  const pdfViewUrl = pdfFile.getDownloadUrl();

  Logger.log(`Report created: ${fileName} | Doc: ${docId} | PDF: ${pdfFile.getId()}`);

  return {
    docId,
    pdfId:       pdfFile.getId(),
    docsUrl,
    pdfUrl,
    pdfViewUrl,
    fileName,
    createdAt:   now.toISOString(),
  };
}

// ── Điền text fields & checkbox ──────────────────────────────────────
function fillTextFields(body, sopConfig, metadata) {
  // Text replacements đơn giản
  if (sopConfig.textReplacements) {
    for (const [searchText, fieldName] of Object.entries(sopConfig.textReplacements)) {
      const value = metadata[fieldName] || '';
      body.replaceText(searchText, value);
    }
  }

  // Checkbox lines: dùng replaceText cấp paragraph để GIỮ NGUYÊN in đậm/in nghiêng
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

  // Custom: Xử lý điền Ngày tháng thông qua placeholder trên biểu mẫu (date1, date2)
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

// ── Điền bảng mẫu theo tọa độ ────────────────────────────────────────
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
  
  Logger.log(`Đang xử lý báo cáo: Tổng số mẫu: ${samples.length} | Dung lượng 1 trang: ${maxSamplesPerPage} | Số trang cần giữ: ${totalPagesNeeded}`);

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
    
    let pageExtraLines = 0;
    for (let i = 0; i < pageSamples.length; i++) {
      const rowIdx = startRow + i;
      const row = currentTable.getRow(rowIdx);
      const sample = pageSamples[i];

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
        // Nếu xóa thành công, phần tử tiếp theo sẽ tự động dịch chuyển về index activeIndex,
        // do đó ta KHÔNG tăng activeIndex để tiếp tục xóa phần tử mới dịch chuyển tới.
      } catch(e) {
        Logger.log(`[Autocut] Không thể xóa phần tử index ${activeIndex} (sẽ clear sạch chữ): ${e.toString()}`);
        try {
          if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
            child.asParagraph().clear();
          } else if (child.getType() === DocumentApp.ElementType.TABLE) {
            // Nếu là bảng không thể xóa, clear sạch nội dung các ô
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
        // Vì không thể xóa phần tử này, ta phải tăng activeIndex lên 1 để chuyển sang xóa phần tử kế tiếp!
        activeIndex++;
      }
    }

    // 4. TIẾN HÀNH DỌN DẸP DẤU NGẮT TRANG & DÒNG TRỐNG THỪA Ở CUỐI TÀI LIỆU ĐÃ CẮT
    // Quét ngược tối đa 3 lần từ cuối lên để triệt tiêu trang trắng thừa sinh ra do dấu enter/ngắt trang ở cuối trang giữ lại.
    try {
      for (let k = 0; k < 3; k++) {
        const currentLastIdx = body.getNumChildren() - 1;
        if (currentLastIdx <= 0) break;
        const lastChild = body.getChild(currentLastIdx);
        let removed = false;
        
        if (lastChild.getType() === DocumentApp.ElementType.PAGE_BREAK) {
          try {
            body.removeChild(lastChild);
            Logger.log("[Autocut] Đã xóa PageBreak trực tiếp ở cuối tài liệu.");
            removed = true;
          } catch(err) {
            Logger.log(`[Autocut] Không thể xóa PageBreak trực tiếp cuối: ${err.toString()}`);
          }
        } else if (lastChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
          const p = lastChild.asParagraph();
          // Xóa PageBreak child bên trong paragraph cuối
          for (let c = p.getNumChildren() - 1; c >= 0; c--) {
            if (p.getChild(c).getType() === DocumentApp.ElementType.PAGE_BREAK) {
              try {
                p.removeChild(p.getChild(c));
                Logger.log("[Autocut] Đã xóa PageBreak child bên trong paragraph cuối tài liệu.");
              } catch(err) {}
            }
          }
          
          // Nếu paragraph trống rỗng hoàn toàn, xóa nó đi để thu hồi dòng enter thừa
          if (p.getText().trim() === "" && p.getNumChildren() === 0 && body.getNumChildren() > 1) {
            try {
              body.removeChild(p);
              Logger.log("[Autocut] Đã xóa Paragraph trống thừa ở cuối tài liệu.");
              removed = true;
            } catch(err) {
              Logger.log(`[Autocut] Không thể xóa Paragraph trống ở cuối (do quy định bảo vệ): ${err.toString()}`);
            }
          }
        }
        
        if (!removed) {
          // Nếu phần tử cuối cùng có chứa chữ hoặc là bảng biểu không thể xóa, ta dừng lại ngay
          break;
        }
      }
    } catch(e) {
      Logger.log(`[Autocut] Lỗi trong vòng lặp dọn dẹp: ${e.toString()}`);
    }

    // CỰC KỲ QUAN TRỌNG: Thiết lập chiều cao của phần tử Paragraph cuối cùng về 1pt và không có khoảng cách
    // để tránh hiện tượng tràn dòng (overflow) do bảng chữ ký sát lề, ép paragraph cuối này nhảy sang trang tiếp theo.
    try {
      const finalLastIdx = body.getNumChildren() - 1;
      if (finalLastIdx >= 0) {
        const lastChild = body.getChild(finalLastIdx);
        if (lastChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
          const p = lastChild.asParagraph();
          p.clear(); // Xóa sạch text và ngắt trang ẩn
          p.setFontSize(1); // Co kích thước chữ về 1pt (siêu nhỏ)
          p.setLineSpacing(0.06); // Co khoảng cách dòng tối đa
          p.setSpacingAfter(0); // Bỏ khoảng trống phía dưới
          p.setSpacingBefore(0); // Bỏ khoảng trống phía trên
          Logger.log("[Autocut] Đã co nhỏ tối đa paragraph cuối cùng về 1pt để ngăn chặn tràn trang trắng.");
        }
      }
    } catch(e) {
      Logger.log(`[Autocut] Lỗi khi co nhỏ paragraph cuối: ${e.toString()}`);
    }
  }
}

// ── Helper: set cell text giữ nguyên font gốc ────────────────────────
function setCellText(row, colIndex, text, chunkSize) {
  if (colIndex >= row.getNumCells()) return 0;
  const cell = row.getCell(colIndex);
  
  // 1. LƯU LẠI CÁC THUỘC TÍNH ĐỊNH DẠNG CỦA Ô (FONT, RỘNG CỘT, CANH LỀ DỌC/NGANG, PADDING)
  let fontFamily = 'Times New Roman';
  let fontSize = 11;
  let originalAlign = DocumentApp.HorizontalAlignment.CENTER; // Mặc định căn giữa ngang
  let originalWidth = null;
  let originalVerticalAlign = null;
  let originalPaddingLeft = null;
  let originalPaddingRight = null;
  let originalPaddingTop = null;
  let originalPaddingBottom = null;

  try {
    // Lưu định dạng của Paragraph đầu tiên
    let firstP = null;
    for (let i = 0; i < cell.getNumChildren(); i++) {
      const child = cell.getChild(i);
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        firstP = child.asParagraph();
        break;
      }
    }
    if (firstP) {
      if (firstP.getAlignment()) {
        originalAlign = firstP.getAlignment();
      }
      if (firstP.getNumChildren() > 0) {
        const t = firstP.getChild(0).asText();
        if (t.getFontFamily()) fontFamily = t.getFontFamily();
        if (t.getFontSize()) fontSize = t.getFontSize();
      }
    }

    // Lưu định dạng cấu trúc của TableCell
    originalWidth = cell.getWidth();
    originalVerticalAlign = cell.getVerticalAlignment();
    originalPaddingLeft = cell.getPaddingLeft();
    originalPaddingRight = cell.getPaddingRight();
    originalPaddingTop = cell.getPaddingTop();
    originalPaddingBottom = cell.getPaddingBottom();
  } catch(e) {
    Logger.log(`[setCellText] Lỗi khi lưu thuộc tính ô gốc: ${e.toString()}`);
  }

  // 2. LÀM SẠCH VÀ THIẾT LẬP VĂN BẢN MỚI
  cell.clear();
  
  // Google Docs có thể tự động tạo lại 1 Paragraph trống sau khi clear.
  // Ta gắp lấy nó để ghi chữ trực tiếp vào đó nhằm tránh sinh ra dòng enter thừa!
  let p = null;
  if (cell.getNumChildren() > 0) {
    const firstChild = cell.getChild(0);
    if (firstChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
      p = firstChild.asParagraph();
    }
  }
  if (!p) {
    p = cell.appendParagraph();
  }
  
  const cleanText = (text !== undefined && text !== null) ? text.toString() : "";
  
  // 3. XỬ LÝ CHUNK CHỮ VÀ CHÈN NGẮT DÒNG (ENTER) NẾU CÓ CHUNKSIZE
  let extraLines = 0;
  let finalText = cleanText || " ";
  
  if (cleanText && chunkSize && chunkSize > 0) {
    // Tự động ngắt dòng sau mỗi chunkSize ký tự (ví dụ: cứ mỗi 7 ký tự thì enter ngắt dòng)
    const chunks = [];
    for (let i = 0; i < cleanText.length; i += chunkSize) {
      chunks.push(cleanText.substring(i, i + chunkSize));
    }
    finalText = chunks.join('\n');
    extraLines = chunks.length - 1; // Số dòng phình ra chính xác bằng số lần enter ngắt dòng
  }
  
  p.setText(finalText);
  
  // Khôi phục căn lề ngang (Left, Right, Center, Justify) từ biểu mẫu gốc
  p.setAlignment(originalAlign);
  
  // 4. KHÔI PHỤC HOÀN HẢO ĐỘ RỘNG CỘT, CĂN LỀ DỌC VÀ PADDING CỦA Ô
  try {
    if (originalWidth !== null && originalWidth > 0) cell.setWidth(originalWidth);
    if (originalVerticalAlign !== null) cell.setVerticalAlignment(originalVerticalAlign);
    if (originalPaddingLeft !== null) cell.setPaddingLeft(originalPaddingLeft);
    if (originalPaddingRight !== null) cell.setPaddingRight(originalPaddingRight);
    if (originalPaddingTop !== null) cell.setPaddingTop(originalPaddingTop);
    if (originalPaddingBottom !== null) cell.setPaddingBottom(originalPaddingBottom);
  } catch(e) {
    Logger.log(`[setCellText] Lỗi khi khôi phục cấu trúc ô TableCell: ${e.toString()}`);
  }
  
  // 5. ĐỊNH DẠNG FONT CHỮ (GIỮ NGUYÊN FONT SIZE GỐC, KHÔNG HẠ SIZE NẾU ĐÃ CHUNK THEO Ý USER)
  if (cleanText) {
    let adjustedFontSize = fontSize;
    
    // Nếu KHÔNG dùng chunkSize (ví dụ các cột khác), ta vẫn có thể dùng cơ chế co rút font tự động nhẹ
    if (!chunkSize) {
      const len = cleanText.length;
      if (len > 35) {
        adjustedFontSize = Math.max(8.5, fontSize - 2.5);
        extraLines = 2;
      } else if (len > 20) {
        adjustedFontSize = Math.max(9.0, fontSize - 2.0);
        extraLines = 1;
      } else if (len > 12) {
        adjustedFontSize = Math.max(9.5, fontSize - 1.5);
      }
    }
    
    try {
      const tElement = p.editAsText();
      tElement.setFontFamily(fontFamily);
      tElement.setFontSize(adjustedFontSize);
    } catch(e) {
      Logger.log(`[setCellText] Lỗi khi áp định dạng font: ${e.toString()}`);
    }
  }
  
  return extraLines;
}

// ── Helper: tạo folder năm/tháng/chỉ tiêu trong ROOT_FOLDER ──────────
function getOrCreateFolder(date, sopId) {
  const year  = date.getFullYear().toString();
  const month = Utilities.formatDate(date, 'Asia/Ho_Chi_Minh', 'MM-MMMM');
  // e.g. "05-May"

  const root = DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);

  // Tìm hoặc tạo folder năm
  let yearFolder = getSubFolderOrCreate(root, year);

  // Tìm hoặc tạo folder tháng
  let monthFolder = getSubFolderOrCreate(yearFolder, month);

  // Tìm hoặc tạo folder chỉ tiêu (SOP)
  let sopFolderName = sopId;
  if (CONFIG.SOP_CONFIG[sopId] && CONFIG.SOP_CONFIG[sopId].folderName) {
    sopFolderName = CONFIG.SOP_CONFIG[sopId].folderName;
  }
  let sopFolder = getSubFolderOrCreate(monthFolder, sopFolderName);

  return sopFolder;
}

// Helper function to find or create a subfolder safely
function getSubFolderOrCreate(parentFolder, folderName) {
  const iter = parentFolder.getFoldersByName(folderName);
  if (iter.hasNext()) {
    return iter.next();
  }
  return parentFolder.createFolder(folderName);
}

// ── Diagnostic: kiểm tra cấu trúc template trước khi test ────────────
/**
 * CHẠY HÀM NÀY TRƯỚC để xác nhận table indices trong Google Doc.
 * Mở GAS editor → chọn inspectTemplate → Run → xem Logs
 */
function inspectTemplate() {
  const docId = CONFIG.TEMPLATES['trifluralin-gcms'];
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();
  const tables = body.getTables();

  Logger.log(`=== Template: ${doc.getName()} ===`);
  Logger.log(`Total tables: ${tables.length}`);

  tables.forEach((table, i) => {
    const numRows = table.getNumRows();
    const numCols = table.getRow(0).getNumCells();
    // Lấy text của header row
    const headerCells = [];
    for (let c = 0; c < Math.min(numCols, 5); c++) {
      headerCells.push(table.getCell(0, c).getText().substring(0, 20));
    }
    Logger.log(`Table ${i}: ${numRows} rows × ${numCols} cols`);
    Logger.log(`  Header: [${headerCells.join(' | ')}]`);

    // Log vài hàng data
    for (let r = 1; r < Math.min(numRows, 3); r++) {
      const rowCells = [];
      for (let c = 0; c < numCols; c++) {
        rowCells.push(`"${table.getCell(r, c).getText().substring(0, 15)}"`);
      }
      Logger.log(`  Row ${r}: [${rowCells.join(', ')}]`);
    }
  });

  Logger.log('\n=== Paragraphs containing key text ===');
  const paras = body.getParagraphs();
  paras.forEach((p, i) => {
    const text = p.getText();
    if (text.includes('Trifluralin') || text.includes('Ngày') || text.includes('Mẫu phân tích')) {
      Logger.log(`Para ${i}: "${text.substring(0, 60)}"`);
    }
  });
}

// ── HỆ THỐNG CÁC HÀM TEST (Chạy thủ công trong Apps Script Editor) ────

// CASE 1: Chạy test trường hợp thông thường (4 mẫu thử)
function testGenerate_Normal() {
  Logger.log('=== CHẠY TEST: TRƯỜNG HỢP THÔNG THƯỜNG ===');
  const payload = {
    sopId: 'trifluralin-gcms',
    metadata: {
      batchCode:            'BATCH-2026-N01',
      ngayNguoiPhanTich:    '20/05/2026 / Ong Thanh Dat',
      ngayNguoiThamTra:     '20/05/2026 / Nguyen Hoang Dao',
      checkTatCaND:         false,
      checkCoMauPhatHien:   true,
    },
    samples: [
      { loSo: '1', maSoMau: 'M01-2026', kq: null,    ghiChu: 'Mẫu sạch' },
      { loSo: '2', maSoMau: 'M02-2026', kq: '0.023', ghiChu: 'Đạt chỉ tiêu' },
      { loSo: '3', maSoMau: 'Blank-01', kq: null,    ghiChu: '' },
      { loSo: '4', maSoMau: 'Spike-01', kq: '1.02',  ghiChu: 'Mẫu kiểm soát' },
    ]
  };
  runAndLog(payload);
}

// CASE 2: Chạy test kiểm tra Auto-Shrink Font (Tên mẫu siêu dài, ghi chú dài)
function testGenerate_LongNames() {
  Logger.log('=== CHẠY TEST: TÊN MẪU SIÊU DÀI & CO GIÃN FONT ===');
  const payload = {
    sopId: 'trifluralin-gcms',
    metadata: {
      batchCode:            'BATCH-2026-L02',
      ngayNguoiPhanTich:    '20/05/2026 / Ong Thanh Dat',
      ngayNguoiThamTra:     '20/05/2026 / Nguyen Hoang Dao',
      checkTatCaND:         true,
      checkCoMauPhatHien:   false,
    },
    samples: [
      { loSo: '1', maSoMau: 'M01-2026/NAFIQAD6-LONG-SAMPLE-NAME-12345', kq: null, ghiChu: 'Tên mẫu rất dài để test co font' },
      { loSo: '2', maSoMau: 'Ngắn', kq: '0.015', ghiChu: 'Ghi chú siêu siêu siêu siêu siêu siêu dài để test' },
      { loSo: '3', maSoMau: 'Mẫu-03/ABC-DEF-GHI', kq: null, ghiChu: 'Độ dài trung bình' },
      { loSo: '4', maSoMau: 'M04-2026', kq: '2.500', ghiChu: 'Bình thường' },
    ]
  };
  runAndLog(payload);
}

// CASE 3: Chạy test số lượng mẫu cực nhiều (Đẩy tràn bảng sang trang 2, trang 3)
function testGenerate_ManySamples() {
  Logger.log('=== CHẠY TEST: SỐ LƯỢNG MẪU LỚN (TRÀN TRANG) ===');
  const samples = [];
  // Sinh tự động 35 mẫu để ép tràn trang
  for (let i = 1; i <= 35; i++) {
    samples.push({
      loSo: i.toString(),
      maSoMau: `M-${100 + i}-2026`,
      kq: i % 5 === 0 ? (0.01 * i).toFixed(3) : null,
      ghiChu: i % 10 === 0 ? 'Mẫu lặp lại' : ''
    });
  }

  const payload = {
    sopId: 'trifluralin-gcms',
    metadata: {
      batchCode:            'BATCH-2026-M03',
      ngayNguoiPhanTich:    '20/05/2026 / Ong Thanh Dat',
      ngayNguoiThamTra:     '20/05/2026 / Nguyen Hoang Dao',
      checkTatCaND:         false,
      checkCoMauPhatHien:   true,
    },
    samples: samples
  };
  runAndLog(payload);
}

// CASE 4: Chạy test trường hợp tất cả đều Không phát hiện (ND)
function testGenerate_AllNotDetected() {
  Logger.log('=== CHẠY TEST: TẤT CẢ MẪU ĐỀU KHÔNG PHÁT HIỆN ===');
  const payload = {
    sopId: 'trifluralin-gcms',
    metadata: {
      batchCode:            'BATCH-2026-ND04',
      ngayNguoiPhanTich:    '20/05/2026 / Ong Thanh Dat',
      ngayNguoiThamTra:     '20/05/2026 / Nguyen Hoang Dao',
      checkTatCaND:         true,        // Checkbox không phát hiện tích ☑
      checkCoMauPhatHien:   false,       // Checkbox phát hiện tích ☐
    },
    samples: [
      { loSo: '1', maSoMau: 'M01-2026', kq: null, ghiChu: '' },
      { loSo: '2', maSoMau: 'M02-2026', kq: null, ghiChu: '' },
      { loSo: '3', maSoMau: 'M03-2026', kq: null, ghiChu: '' },
    ]
  };
  runAndLog(payload);
}

// Hàm trợ giúp chạy & Log kết quả
function runAndLog(payload) {
  try {
    const result = generateReport(
      payload.sopId,
      payload.metadata,
      payload.samples
    );
    Logger.log('==> THÀNH CÔNG!');
    Logger.log('Google Doc tạo kèm: ' + result.docsUrl);
    Logger.log('PDF báo cáo URL   : ' + result.pdfUrl);
  } catch(e) {
    Logger.log('==> THẤT BẠI!');
    Logger.log('Lỗi chi tiết      : ' + e.toString());
  }
}

// ── Helpers cho Dạng 3B: Ghi dữ liệu từng hoạt chất & checkbox ────────
function fillType3bSample(body, sopConfig, metadata, sample) {
  fillType3bSampleForElements([body], sopConfig, metadata, sample);
}

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

// Dọn dẹp PageBreak thừa ở cuối tài liệu
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
