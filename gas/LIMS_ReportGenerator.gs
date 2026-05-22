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
  const templateId = CONFIG.TEMPLATES[sopId];
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
  
  // 1. Lưu lại các thuộc tính định dạng của ô gốc
  let fontFamily = 'Times New Roman';
  let fontSize = fallbackFontSize || 9;
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
      
      const pAttrs = firstP.getAttributes();
      if (pAttrs[DocumentApp.Attribute.FONT_FAMILY]) fontFamily = pAttrs[DocumentApp.Attribute.FONT_FAMILY];
      if (pAttrs[DocumentApp.Attribute.FONT_SIZE])   fontSize   = pAttrs[DocumentApp.Attribute.FONT_SIZE];
      if (pAttrs[DocumentApp.Attribute.LINE_SPACING]) originalLineSpacing  = pAttrs[DocumentApp.Attribute.LINE_SPACING];
      if (pAttrs[DocumentApp.Attribute.SPACING_BEFORE]) originalSpacingBefore = pAttrs[DocumentApp.Attribute.SPACING_BEFORE];
      if (pAttrs[DocumentApp.Attribute.SPACING_AFTER])  originalSpacingAfter  = pAttrs[DocumentApp.Attribute.SPACING_AFTER];
      
      if (firstP.getNumChildren() > 0) {
        const child0 = firstP.getChild(0);
        if (child0.getType() === DocumentApp.ElementType.TEXT) {
          const t = child0.asText();
          if (t.getFontFamily()) fontFamily = t.getFontFamily();
          if (t.getFontSize())   fontSize   = t.getFontSize();
          
          if (t.isBold !== undefined && t.isBold() !== null) isBold = t.isBold();
          if (t.isItalic !== undefined && t.isItalic() !== null) isItalic = t.isItalic();
          if (t.getForegroundColor !== undefined && t.getForegroundColor() !== null) foregroundColor = t.getForegroundColor();
        }
      }
    }

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
