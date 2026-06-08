/**
 * LIMS Report Generator & Global Helpers
 */

/**
 * Helper function for safely replacing checkbox char
 * Chỉ tìm và thay thế đúng vị trí ký tự Checkbox [☐□☑] hoặc [ ] hoặc ( )
 * nhằm bảo toàn toàn bộ Format và Layout (Tab stop, in đậm, in nghiêng) của Google Docs.
 */
function replaceCheckboxSafely(el, pattern, charToInsert) {
  let found = el.findText(pattern);
  while (found) {
    try {
      const textElement = found.getElement().asText();
      const start = found.getStartOffset();
      const end = found.getEndOffsetInclusive();
      const textStr = textElement.getText().substring(start, end + 1);
      
      const match = textStr.match(/([☐□☑]|\[\s*\]|\(\s*\))/);
      const boxIndex = match ? match.index : -1;
      const matchLength = match ? match[0].length : 1;
      
      if (boxIndex !== -1) {
        const insertPos = start + boxIndex;
        textElement.insertText(insertPos, charToInsert);
        textElement.deleteText(insertPos + 1, insertPos + matchLength);
      }
    } catch(e) {
      Logger.log('[replaceCheckboxSafely] Error at pattern ' + pattern + ': ' + e);
    }
    found = el.findText(pattern, found);
  }
}

/**
 * Helper function for safely replacing dotted line with text
 * Chỉ xóa các dấu chấm ... đúng bằng không gian cần thiết để điền chữ.
 */
function replaceDotsSafely(el, pattern, textToInsert) {
  if (!textToInsert) return;
  let found = el.findText(pattern);
  if (found) {
    try {
      const textElement = found.getElement().asText();
      const start = found.getStartOffset();
      const end = found.getEndOffsetInclusive();
      const textStr = textElement.getText().substring(start, end + 1);
      const match = textStr.match(/[…\.]{2,}/);
      if (match) {
        const dotsIndex = match.index;
        const dotsLength = match[0].length;
        const insertPos = start + dotsIndex;
        textElement.insertText(insertPos, textToInsert);
        textElement.deleteText(insertPos + textToInsert.length, insertPos + textToInsert.length + dotsLength - 1);
      }
    } catch(e) {
      Logger.log('[replaceDotsSafely] Error at pattern ' + pattern + ': ' + e);
    }
  }
}
/**
 * LIMS Report Generator — Google Apps Script Core Controller
 * ==========================================================
 * Deploy as Web App:
 *   Execute as: Me (lab admin)
 *   Who has access: Anyone
 *
 * Tệp này đóng vai trò là bộ điều phối trung tâm (Controller). Nó tiếp nhận request
 * từ Angular Client, định tuyến thông minh sang các hàm xử lý SOP chuyên biệt (nếu có)
 * hoặc xử lý thông qua bộ khung mặc định (Dạng 2/3A, Dạng 3B).
 */

// GAS Web App tự xử lý CORS — không cần setHeader thủ công

// ── doGet: health check ───────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'LIMS Report Generator Core' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── doPost: main entry point ──────────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { sopId, metadata, samples, action, version, files } = payload;

    let result;
    if (action === 'generate_pdf') {
      // Validate
      if (!sopId || !CONFIG.TEMPLATES[sopId]) {
        throw new Error(`Unknown sopId: ${sopId}`);
      }
      result = generateReport(sopId, metadata, samples, version);
    } else if (action === 'archive_reports') {
      result = archiveReportsAction(files);
    } else if (action === 'upload_excel') {
      result = uploadExcelAction(payload);
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

// ── Core: Tạo báo cáo & Định tuyến thông minh (Dynamic Routing) ────────
function generateReport(sopId, metadata, samples, version) {
  let templateId = CONFIG.TEMPLATES[sopId];
  if (sopId === 'lan-huu-co' && metadata && metadata.printFormType === 'formDon') {
    templateId = CONFIG.TEMPLATES['lan-huu-co-don'] || '1kR2sljh1LPoXj8jkmYq5f3ZZapkBg4XlWqQTO5Z3c1Y';
  }
  if (sopId === 'chlor-huu-co' && metadata && metadata.printFormType === 'formDon') {
    templateId = CONFIG.TEMPLATES['chlor-huu-co-don'] || '1JhO-qVV6-KFw9zq2ARCYyVwlQoj6xFjFHlrBsjNGbH8';
  }
  if (sopId === 'nhom-cuc' && metadata && metadata.printFormType === 'formDon') {
    templateId = CONFIG.TEMPLATES['nhom-cuc-don'] || 'PASTE_GOOGLE_DOC_ID_HERE';
  }
  const sopConfig   = CONFIG.SOP_CONFIG[sopId];

  if (!templateId || templateId === 'PASTE_GOOGLE_DOC_ID_HERE') {
    throw new Error(`Template chưa được cấu hình cho SOP: ${sopId}`);
  }

  // 1. Tạo tên file theo chuẩn có version
  const now = new Date();
  const dateStr = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyyMMdd_HHmm');
  const vSuffix = version ? `_v${version}` : '';
  const prefixSuffix = metadata.prefix ? `_${metadata.prefix}` : '';
  const fileName = `KQ_${sopId}_${metadata.batchCode || dateStr}${vSuffix}${prefixSuffix}`;

  // 2. Tạo/lấy folder theo năm/tháng/chỉ tiêu
  const folder = getOrCreateFolder(now, sopId);

  // 3. DYNAMIC ROUTING: Tìm kiếm hàm xử lý chuyên biệt cho SOP
  // Quy chuẩn tên hàm chuyên biệt trong các tệp script con: `generateCustomReport_[sopId_viet_thuong_khong_gach]`
  // Ví dụ: generateCustomReport_trifluralin_gcms
  const sanitizedSopId = sopId.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const customFunctionName = 'generateCustomReport_' + sanitizedSopId;

  if (typeof this[customFunctionName] === 'function') {
    Logger.log(`[Router] Phát hiện hàm xử lý chuyên biệt: ${customFunctionName}. Chuyển giao xử lý.`);
    return this[customFunctionName](templateId, metadata, samples, folder, fileName, version);
  }

  // 4. Nếu không có bộ xử lý chuyên biệt, chạy thông qua Bộ khung mặc định (Fallback Engine)
  Logger.log(`[Router] Chạy bộ khung mặc định cho dạng: ${sopConfig.formType}`);
  
  // Copy template
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = templateFile.makeCopy(fileName, folder);
  const docId = newFile.getId();
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  if (sopConfig.formType === 'type3b') {
    generateType3bReport(body, sopConfig, metadata, samples);
  } else {
    generateType2_3aReport(body, sopConfig, metadata, samples);
  }

  // Lưu doc
  doc.saveAndClose();

  // Export PDF
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

// ── Helper: set cell text giữ nguyên font gốc ────────────────────────
function setCellText(row, colIndex, text, chunkSize, fallbackFontSize) {
  if (colIndex >= row.getNumCells()) return 0;
  const cell = row.getCell(colIndex);
  
  // 1. Lưu lại các thuộc tính định dạng của ô gốc TRƯỚC KHI XÓA NỘI DUNG
  let fontFamily = 'Times New Roman';
  let fontSize = null; // Sẽ đọc từ template gốc, KHÔNG hardcode mặc định
  let originalAlign = DocumentApp.HorizontalAlignment.CENTER;
  let originalWidth = null;
  let originalVerticalAlign = null;
  let originalPaddingLeft = null;
  let originalPaddingRight = null;
  let originalPaddingTop = null;
  let originalPaddingBottom = null;
  let originalLineSpacing = null;
  let originalSpacingBefore = null;
  let originalSpacingAfter = null;
  
  let isBold = null;
  let isItalic = null;
  let foregroundColor = null;

  try {
    let firstP = null;
    for (let i = 0; i < cell.getNumChildren(); i++) {
      const child = cell.getChild(i);
      if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
        firstP = child.asParagraph();
        break;
      }
    }
    if (firstP) {
      if (firstP.getAlignment()) originalAlign = firstP.getAlignment();
      
      // Ưu tiên đọc font size từ editAsText() — hoạt động cả khi ô trống
      try {
        const editText = firstP.editAsText();
        const readFs = editText.getFontSize(0);
        if (readFs !== null && readFs !== undefined) fontSize = readFs;
        const readFf = editText.getFontFamily(0);
        if (readFf) fontFamily = readFf;
        
        // Đọc bold/italic/color từ text element
        const readBold = editText.isBold(0);
        if (readBold !== null && readBold !== undefined) isBold = readBold;
        const readItalic = editText.isItalic(0);
        if (readItalic !== null && readItalic !== undefined) isItalic = readItalic;
        const readColor = editText.getForegroundColor(0);
        if (readColor) foregroundColor = readColor;
      } catch(innerE) {
        // editAsText có thể fail trên paragraph hoàn toàn rỗng — dùng paragraph attributes
      }

      // Fallback: đọc từ paragraph attributes nếu editAsText không trả được
      const pAttrs = firstP.getAttributes();
      if (!fontFamily || fontFamily === 'Times New Roman') {
        if (pAttrs[DocumentApp.Attribute.FONT_FAMILY]) fontFamily = pAttrs[DocumentApp.Attribute.FONT_FAMILY];
      }
      if (fontSize === null) {
        if (pAttrs[DocumentApp.Attribute.FONT_SIZE]) fontSize = pAttrs[DocumentApp.Attribute.FONT_SIZE];
      }
      if (pAttrs[DocumentApp.Attribute.LINE_SPACING]) originalLineSpacing  = pAttrs[DocumentApp.Attribute.LINE_SPACING];
      if (pAttrs[DocumentApp.Attribute.SPACING_BEFORE]) originalSpacingBefore = pAttrs[DocumentApp.Attribute.SPACING_BEFORE];
      if (pAttrs[DocumentApp.Attribute.SPACING_AFTER])  originalSpacingAfter  = pAttrs[DocumentApp.Attribute.SPACING_AFTER];
      
      // Fallback cuối cùng: đọc từ child text element (ô có text sẵn)
      if (firstP.getNumChildren() > 0) {
        const child0 = firstP.getChild(0);
        if (child0.getType() === DocumentApp.ElementType.TEXT) {
          const t = child0.asText();
          if (t.getFontFamily()) fontFamily = t.getFontFamily();
          if (t.getFontSize() !== null && t.getFontSize() !== undefined) fontSize = t.getFontSize();
          
          if (t.isBold !== undefined && t.isBold() !== null) isBold = t.isBold();
          if (t.isItalic !== undefined && t.isItalic() !== null) isItalic = t.isItalic();
          if (t.getForegroundColor !== undefined && t.getForegroundColor() !== null) foregroundColor = t.getForegroundColor();
        }
      }
    }

    // Nếu sau tất cả vẫn null → dùng fallbackFontSize từ config, cuối cùng mới dùng 9
    if (fontSize === null) fontSize = fallbackFontSize || 9;

    originalWidth          = cell.getWidth();
    originalVerticalAlign  = cell.getVerticalAlignment();
    originalPaddingLeft    = cell.getPaddingLeft();
    originalPaddingRight   = cell.getPaddingRight();
    originalPaddingTop     = cell.getPaddingTop();
    originalPaddingBottom  = cell.getPaddingBottom();
  } catch(e) {
    Logger.log(`[setCellText] Lỗi khi lưu thuộc tính ô gốc: ${e.toString()}`);
  }

  // 2. Làm sạch và chèn văn bản mới
  cell.clear();
  
  let p = null;
  if (cell.getNumChildren() > 0) {
    const firstChild = cell.getChild(0);
    if (firstChild.getType() === DocumentApp.ElementType.PARAGRAPH) {
      p = firstChild.asParagraph();
    }
  }
  if (!p) p = cell.appendParagraph('');
  
  const cleanText = (text !== undefined && text !== null) ? text.toString() : '';
  
  // 3. Xử lý chunk chữ và chèn ngắt dòng nếu có chunkSize
  let extraLines = 0;
  
  if (cleanText && chunkSize && chunkSize > 0) {
    const chunks = [];
    for (let i = 0; i < cleanText.length; i += chunkSize) {
      chunks.push(cleanText.substring(i, i + chunkSize));
    }
    p.setText(chunks.join('\n'));
    extraLines = chunks.length - 1;
  } else if (cleanText) {
    // Chỉ gọi setText khi có nội dung — setText('') gây lỗi GAS "empty text element"
    p.setText(cleanText);
  }
  // Khi cleanText rỗng: để nguyên paragraph trống từ cell.clear(), không gọi setText
  
  p.setAlignment(originalAlign);
  
  // Khôi phục spacing gốc để tránh làm cao hàng bảng
  try {
    if (originalLineSpacing !== null)   p.setLineSpacing(originalLineSpacing);
    if (originalSpacingBefore !== null) p.setSpacingBefore(originalSpacingBefore);
    if (originalSpacingAfter !== null)  p.setSpacingAfter(originalSpacingAfter);
  } catch(e) {}
  
  // 4. Khôi phục độ rộng cột, canh lề dọc và padding
  try {
    if (originalWidth !== null && originalWidth > 0) cell.setWidth(originalWidth);
    if (originalVerticalAlign !== null) cell.setVerticalAlignment(originalVerticalAlign);
    if (originalPaddingLeft !== null)   cell.setPaddingLeft(originalPaddingLeft);
    if (originalPaddingRight !== null)  cell.setPaddingRight(originalPaddingRight);
    if (originalPaddingTop !== null)    cell.setPaddingTop(originalPaddingTop);
    if (originalPaddingBottom !== null) cell.setPaddingBottom(originalPaddingBottom);
  } catch(e) {
    Logger.log(`[setCellText] Lỗi khi khôi phục cấu trúc TableCell: ${e.toString()}`);
  }
  
  // 5. Định dạng font chữ
  if (cleanText) {
    try {
      const tElement = p.editAsText();
      tElement.setFontFamily(fontFamily);
      tElement.setFontSize(fontSize);
      if (isBold !== null) tElement.setBold(isBold);
      if (isItalic !== null) tElement.setItalic(isItalic);
      if (foregroundColor !== null) tElement.setForegroundColor(foregroundColor);
    } catch(e) {
      Logger.log(`[setCellText] Lỗi khi áp định dạng font: ${e.toString()}`);
    }
  }
  
  return extraLines;
}


// ── Helper: tạo folder năm/tháng/chỉ tiêu trong ROOT_FOLDER ──────────
function getOrCreateFolder(date, sopId) {
  const year  = date.getFullYear().toString();
  const month = Utilities.formatDate(date, 'Asia/Ho_Chi_Minh', 'MM-MMMM'); // e.g. "05-May"

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
    const headerCells = [];
    for (let c = 0; c < Math.min(numCols, 5); c++) {
      headerCells.push(table.getCell(0, c).getText().substring(0, 20));
    }
    Logger.log(`Table ${i}: ${numRows} rows × ${numCols} cols`);
    Logger.log(`  Header: [${headerCells.join(' | ')}]`);
  });
}

// ── Diagnostic/Test Cases ─────────────────────────────────────────────
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

// ── Action: Dọn dẹp/Lưu trữ báo cáo cũ bị hủy ─────────────────────────
function archiveReportsAction(files) {
  if (!files || !Array.isArray(files)) {
    throw new Error('Missing or invalid files array');
  }

  const results = [];
  
  files.forEach(fileObj => {
    const archiveResult = {
      pdfUrl: fileObj.pdfUrl,
      docsUrl: fileObj.docsUrl,
      pdfArchived: false,
      docsArchived: false
    };

    try {
      const pdfId = getFileIdFromUrl(fileObj.pdfUrl);
      if (pdfId) {
        archiveSingleFile(pdfId);
        archiveResult.pdfArchived = true;
      }
    } catch (e) {
      Logger.log('Error archiving PDF: ' + e.message);
      archiveResult.pdfError = e.message;
    }

    try {
      const docsId = getFileIdFromUrl(fileObj.docsUrl);
      if (docsId) {
        archiveSingleFile(docsId);
        archiveResult.docsArchived = true;
      }
    } catch (e) {
      Logger.log('Error archiving Doc: ' + e.message);
      archiveResult.docsError = e.message;
    }

    results.push(archiveResult);
  });

  return { results };
}

function getFileIdFromUrl(url) {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

function archiveSingleFile(fileId) {
  const file = DriveApp.getFileById(fileId);
  const parents = file.getParents();
  if (!parents.hasNext()) {
    throw new Error('File has no parent directory');
  }

  const parentFolder = parents.next();
  let archiveFolder;

  const subFolders = parentFolder.getFoldersByName('Bản_Hủy_Archived');
  if (subFolders.hasNext()) {
    archiveFolder = subFolders.next();
  } else {
    archiveFolder = parentFolder.createFolder('Bản_Hủy_Archived');
  }

  const originalName = file.getName();
  if (!originalName.startsWith('[HUY]_')) {
    file.setName('[HUY]_' + originalName);
  }

  file.moveTo(archiveFolder);
}

// ── Action: Tải file Excel MassHunter gốc lên Google Drive ─────────────
function uploadExcelAction(payload) {
  const { requestId, fileName, fileData } = payload;
  const sopId = payload.sopId || 'fipronil-chlorpyrifos';
  
  if (!requestId || !fileName || !fileData) {
    throw new Error('Missing required upload parameters (requestId, fileName, fileData)');
  }

  // 1. Tạo/lấy folder theo năm/tháng/chỉ tiêu cho mẻ chạy
  const now = new Date();
  const folder = getOrCreateFolder(now, sopId);

  // 2. Làm sạch chuỗi Base64
  let cleanBase64 = fileData;
  const base64Index = cleanBase64.indexOf(';base64,');
  if (base64Index !== -1) {
    cleanBase64 = cleanBase64.substring(base64Index + 8);
  }

  // 3. Giải mã nhị phân
  const decodedBytes = Utilities.base64Decode(cleanBase64);
  const blob = Utilities.newBlob(
    decodedBytes, 
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
    fileName
  );

  // 4. Tạo tệp trên Google Drive
  const file = folder.createFile(blob);
  
  Logger.log(`Excel uploaded successfully: ${fileName} | ID: ${file.getId()} in folder: ${folder.getName()}`);

  return {
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    fileName: file.getName()
  };
}

/**
 * Hàm chung để điền các checkbox dùng chung cho mọi SOP: Khối lượng mẫu, Loại mẫu, Tình trạng mẫu
 */
function fillCommonSampleCheckboxes(element, metadata, sample) {
  try {
    let khoiLuongVal = (sample.khoiLuong || metadata.khoiLuong || '10.0').toString().trim();
    
    if (metadata.printFormType === 'formDon' && (khoiLuongVal === '10.0' || khoiLuongVal === '10')) {
      const randDecimals = Math.floor(Math.random() * (90 - 10 + 1) + 10);
      khoiLuongVal = '10.0' + randDecimals;
    }

    let kl10Check = '☐';
    let klOtherText = '………';
    
    if (khoiLuongVal === '10.0' || khoiLuongVal === '10') {
      kl10Check = '☑';
    } else {
      klOtherText = khoiLuongVal;
    }
    
    replaceCheckboxSafely(element, 'm\\s*=\\s*[☑☐□N]', kl10Check);
    if (klOtherText !== '………') {
      replaceDotsSafely(element, '10\\.0\\s*;\\s*[…\\.]+', klOtherText);
    }
    
    // Ghi đè lại placeholder {{khoiLuong}} cho Form Đơn nếu nó tồn tại
    element.replaceText('{{khoiLuong}}', khoiLuongVal);

    const loaiMauVal = (sample.loaiMau || metadata.loaiMau || 'Thuỷ sản').toString().trim();
    let isTuoi = loaiMauVal === 'Nông sản tươi';
    let isKho = loaiMauVal === 'Nông sản khô';
    let isThuySan = (loaiMauVal === 'Thuỷ sản' || loaiMauVal === 'Thủy sản');
    let isLmKhac = !isTuoi && !isKho && !isThuySan;
    let lmKhacText = isLmKhac ? loaiMauVal : '………';
    
    const tuoiCheck = isTuoi ? '☑' : '☐';
    const khoCheck = isKho ? '☑' : '☐';
    const thuySanCheck = isThuySan ? '☑' : '☐';
    const lmKhacCheck = isLmKhac ? '☑' : '☐';

    replaceCheckboxSafely(element, 'Loại mẫu:\\s*[☑☐□N]', tuoiCheck);
    replaceCheckboxSafely(element, 'tươi\\s*;\\s*[☑☐□N]', khoCheck);
    replaceCheckboxSafely(element, 'khô\\s*;\\s*[☑☐□N]', thuySanCheck);
    replaceCheckboxSafely(element, 'sản\\s*;\\s*[☑☐□N]', lmKhacCheck);
    if (isLmKhac) {
      replaceDotsSafely(element, 'Khác\\s*:\\s*[…\\.]+', lmKhacText);
    }

    const ttMauVal = (sample.tinhTrangMau || metadata.tinhTrangMau || 'Bình thường').toString().trim();
    let isBinhThuong = ttMauVal === 'Bình thường';
    let isTtKhac = !isBinhThuong;
    let ttKhacText = isTtKhac ? ttMauVal : '………';
    
    const btCheck = isBinhThuong ? '☑' : '☐';
    const ttKhacCheck = isTtKhac ? '☑' : '☐';

    replaceCheckboxSafely(element, 'Tình trạng mẫu:\\s*[☑☐□N]', btCheck);
    replaceCheckboxSafely(element, 'thường\\s*;\\s*[☑☐□N]', ttKhacCheck);
    if (isTtKhac) {
      replaceDotsSafely(element, 'Khác\\s*:\\s*[…\\.]+', ttKhacText);
    }

    // Logic Phát hiện / Không phát hiện (Generic fallback if not specifically handled by SOP)
    let isPhatHien = sample.checkCoMauPhatHien === true || metadata.checkCoMauPhatHien === true;
    let isKhongPhatHien = sample.checkTatCaND === true || metadata.checkTatCaND === true;
    
    if (!isPhatHien && !isKhongPhatHien) {
      let hasAnyResult = false;
      for (const [key, val] of Object.entries(sample)) {
        if (key.indexOf('_nd') === -1 && key !== 'maSoMau' && val !== null && val !== undefined && val.toString().trim() !== '' && val.toString().trim() !== 'N/A' && val.toString().trim() !== '—') {
          hasAnyResult = true;
          break;
        }
        if (key.indexOf('_nd') !== -1 && val === true) {
          hasAnyResult = true;
          break;
        }
      }
      if (hasAnyResult) {
        isPhatHien = true;
      } else {
        isKhongPhatHien = true;
      }
    }
    
    const phCheck = isPhatHien ? '☑' : '☐';
    const kphCheck = isKhongPhatHien ? '☑' : '☐';

    replaceCheckboxSafely(element, '[☑☐□N]\\s*Phát hiện', phCheck);
    replaceCheckboxSafely(element, '[☑☐□N]\\s*Không phát hiện', kphCheck);

  } catch(e) {
    Logger.log('[fillCommonSampleCheckboxes] Error: ' + e.toString());
  }
}