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
      Logger.log('[replaceCheckboxSafely][required-checkbox] Error at pattern ' + pattern + ': ' + e);
      throw e;
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
        
        // Chèn text mới vào
        textElement.insertText(insertPos, textToInsert);
        
        // Tính toán số lượng dấu chấm cần xóa (tối đa bằng chiều dài chuỗi text hoặc số dấu chấm hiện có)
        // Để không làm thụt / rút gọn dòng của User
        const charsToDelete = Math.min(textToInsert.length, dotsLength);
        
        // Xóa dấu chấm
        textElement.deleteText(insertPos + textToInsert.length, insertPos + textToInsert.length + charsToDelete - 1);
      }
    } catch(e) {
      Logger.log('[replaceDotsSafely][required-field] Error at pattern ' + pattern + ': ' + e);
      throw e;
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

function isPayloadObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireNonEmptyPayloadString(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid ${fieldName}: expected non-empty string`);
  }
}

function validateConfiguredSopId(sopId) {
  requireNonEmptyPayloadString(sopId, 'sopId');
  if (!CONFIG.SOP_CONFIG || !CONFIG.SOP_CONFIG[sopId] || !CONFIG.TEMPLATES || !CONFIG.TEMPLATES[sopId]) {
    throw new Error(`Unknown sopId: ${sopId}`);
  }
}

function validateRequiredSignatureMetadata(sopId, metadata) {
  const sopConfig = CONFIG.SOP_CONFIG[sopId];
  const signaturePlaceholders = sopConfig && isPayloadObject(sopConfig.signaturePlaceholders)
    ? sopConfig.signaturePlaceholders
    : {};

  Object.keys(signaturePlaceholders).forEach(placeholder => {
    const metadataField = signaturePlaceholders[placeholder];
    if (typeof metadataField !== 'string' || metadataField.trim() === '') {
      throw new Error(`Invalid signature placeholder mapping for ${placeholder} in sopId ${sopId}`);
    }
    const value = metadata[metadataField];
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Missing required metadata field: ${metadataField} (signature placeholder ${placeholder})`);
    }
  });
}

function validateGeneratePdfPayload(payload) {
  requireNonEmptyPayloadString(payload.requestId, 'requestId');
  if (payload.requestId.trim().length > 200) {
    throw new Error('Invalid requestId: maximum length is 200 characters');
  }
  validateConfiguredSopId(payload.sopId);
  if (!isPayloadObject(payload.metadata)) {
    throw new Error('Invalid metadata: expected object');
  }
  validateRequiredSignatureMetadata(payload.sopId, payload.metadata);
  if (!Array.isArray(payload.samples)) {
    throw new Error('Invalid samples: expected array');
  }
  payload.samples.forEach((sample, index) => {
    if (!isPayloadObject(sample)) {
      throw new Error(`Invalid samples[${index}]: expected object`);
    }
  });
  if (payload.version !== undefined && payload.version !== null) {
    if (!Number.isInteger(payload.version) || payload.version < 1) {
      throw new Error('Invalid version: expected positive integer');
    }
  }
}

function validateArchiveReportsPayload(payload) {
  requireNonEmptyPayloadString(payload.requestId, 'requestId');
  if (payload.requestId.trim().length > 200) {
    throw new Error('Invalid requestId: maximum length is 200 characters');
  }
  if (!Array.isArray(payload.files) || payload.files.length === 0) {
    throw new Error('Invalid files: expected non-empty array');
  }
  payload.files.forEach((fileObj, index) => {
    if (!isPayloadObject(fileObj)) {
      throw new Error(`Invalid files[${index}]: expected object`);
    }
    const urls = [fileObj.pdfUrl, fileObj.docsUrl].filter(value => value !== undefined && value !== null);
    if (urls.length === 0) {
      throw new Error(`Invalid files[${index}]: pdfUrl or docsUrl is required`);
    }
    urls.forEach(url => {
      requireNonEmptyPayloadString(url, `files[${index}] URL`);
      if (!getFileIdFromUrl(url)) {
        throw new Error(`Invalid files[${index}] URL: cannot resolve Drive file ID`);
      }
    });
  });
}

function validateUploadExcelPayload(payload) {
  requireNonEmptyPayloadString(payload.requestId, 'requestId');
  if (payload.requestId.trim().length > 200) {
    throw new Error('Invalid requestId: maximum length is 200 characters');
  }
  requireNonEmptyPayloadString(payload.fileName, 'fileName');
  if (payload.fileName.length > 255) {
    throw new Error('Invalid fileName: maximum length is 255 characters');
  }
  if (/[\\/]/.test(payload.fileName) || payload.fileName === '.' || payload.fileName === '..') {
    throw new Error('Invalid fileName: expected a base file name without path separators');
  }
  getUploadExcelFileType(payload.fileName);
  requireNonEmptyPayloadString(payload.fileData, 'fileData');
  validateConfiguredSopId(payload.sopId);
}

function validateMutationPayload(payload) {
  if (!isPayloadObject(payload)) {
    throw new Error('Invalid request payload: expected object');
  }
  requireNonEmptyPayloadString(payload.action, 'action');
  if (payload.action === 'generate_pdf') {
    validateGeneratePdfPayload(payload);
  } else if (payload.action === 'archive_reports') {
    validateArchiveReportsPayload(payload);
  } else if (payload.action === 'upload_excel') {
    validateUploadExcelPayload(payload);
  } else {
    throw new Error(`Unknown action: ${payload.action}`);
  }
}

function validateMutationAuthEnvelope(payload) {
  requireNonEmptyPayloadString(payload.idToken, 'idToken');
  if (payload.idToken.length > 16384) {
    throw new Error('Invalid idToken: maximum length exceeded');
  }
  requireNonEmptyPayloadString(payload.appId, 'appId');
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(payload.appId)) {
    throw new Error('Invalid appId');
  }
  const authConfig = getFirebaseAuthConfig();
  if (payload.appId !== authConfig.APP_ID) {
    throw new Error('Invalid appId: LIMS namespace is not authorized');
  }
}

function getFirebaseAuthConfig() {
  const authConfig = CONFIG && CONFIG.FIREBASE_AUTH;
  if (!authConfig || !authConfig.PROJECT_ID || !authConfig.WEB_API_KEY || !authConfig.APP_ID) {
    throw new Error('Server authentication is not configured');
  }
  return authConfig;
}

function parseJsonHttpResponse(response, operationName) {
  const raw = response && typeof response.getContentText === 'function'
    ? response.getContentText()
    : '';
  try {
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    throw new Error(`${operationName} returned invalid JSON`);
  }
}

function verifyFirebaseIdToken(idToken) {
  const authConfig = getFirebaseAuthConfig();
  const endpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' +
    encodeURIComponent(authConfig.WEB_API_KEY);
  const response = UrlFetchApp.fetch(endpoint, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ idToken }),
    muteHttpExceptions: true,
  });
  const status = Number(response.getResponseCode());
  if (status !== 200) {
    throw new Error('Authentication failed: invalid or expired Firebase ID token');
  }

  const body = parseJsonHttpResponse(response, 'Firebase Auth');
  const account = body && Array.isArray(body.users) ? body.users[0] : null;
  if (!account || typeof account.localId !== 'string' || account.localId.trim() === '') {
    throw new Error('Authentication failed: Firebase user not found');
  }
  if (account.disabled === true) {
    throw new Error('Authentication failed: Firebase user is disabled');
  }
  return {
    uid: account.localId,
    email: typeof account.email === 'string' ? account.email : null,
  };
}

function getFirestoreDocumentUrl(appId, collectionName, documentId) {
  const authConfig = getFirebaseAuthConfig();
  return 'https://firestore.googleapis.com/v1/projects/' +
    encodeURIComponent(authConfig.PROJECT_ID) +
    '/databases/(default)/documents/artifacts/' + encodeURIComponent(appId) +
    '/' + encodeURIComponent(collectionName) + '/' + encodeURIComponent(documentId);
}

function fetchFirestoreJson(url, idToken, operationName, allowNotFound) {
  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { Authorization: 'Bearer ' + idToken },
    muteHttpExceptions: true,
  });
  const status = Number(response.getResponseCode());
  if (allowNotFound && status === 404) return null;
  if (status !== 200) {
    throw new Error(`${operationName} failed with HTTP ${status}`);
  }
  return parseJsonHttpResponse(response, operationName);
}

function getFirestoreStringField(document, fieldName, fallbackValue) {
  const value = document && document.fields && document.fields[fieldName];
  return value && typeof value.stringValue === 'string' ? value.stringValue : fallbackValue;
}

function getFirestoreStringArrayField(document, fieldName) {
  const value = document && document.fields && document.fields[fieldName];
  const values = value && value.arrayValue && Array.isArray(value.arrayValue.values)
    ? value.arrayValue.values
    : [];
  return values
    .map(item => item && item.stringValue)
    .filter(item => typeof item === 'string');
}

function getFallbackRolePermissions(roleId) {
  const permissions = ['inventory_view', 'standard_view', 'sop_view', 'recipe_view', 'standard_request'];
  if (roleId === 'role_lab_technician') {
    return permissions.concat(['inventory_edit', 'batch_run']);
  }
  if (roleId === 'role_qc_lead') {
    return permissions.concat([
      'inventory_edit', 'standard_edit', 'standard_approve', 'standard_log_view',
      'standard_log_delete', 'recipe_edit', 'sop_edit', 'sop_approve',
      'batch_run', 'report_view'
    ]);
  }
  return permissions;
}

function getEffectiveMutationPermissions(profileDocument, roleConfigDocument) {
  const role = getFirestoreStringField(profileDocument, 'role', 'pending');
  if (role === 'manager') return ['*'];
  if (role !== 'staff') return [];

  const directPermissions = getFirestoreStringArrayField(profileDocument, 'permissions');
  const customPermissions = getFirestoreStringArrayField(profileDocument, 'customPermissions');
  const permissions = directPermissions.concat(customPermissions);
  const roleIdRaw = getFirestoreStringField(profileDocument, 'roleId', 'role_staff_default');
  const roleId = roleIdRaw ? roleIdRaw : 'role_staff_default';

  if (roleConfigDocument) {
    return permissions.concat(getFirestoreStringArrayField(roleConfigDocument, 'permissions'));
  }
  return permissions.concat(getFallbackRolePermissions(roleId));
}

function authenticateAndAuthorizeMutation(payload) {
  validateMutationAuthEnvelope(payload);
  const account = verifyFirebaseIdToken(payload.idToken);
  const profileUrl = getFirestoreDocumentUrl(payload.appId, 'users', account.uid);
  const profileDocument = fetchFirestoreJson(
    profileUrl,
    payload.idToken,
    'LIMS user profile lookup',
    true
  );
  if (!profileDocument) {
    throw new Error('Authorization failed: LIMS user profile not found');
  }

  const role = getFirestoreStringField(profileDocument, 'role', 'pending');
  if (role !== 'manager' && role !== 'staff') {
    throw new Error('Authorization failed: active manager/staff account required');
  }

  let roleConfigDocument = null;
  if (role === 'staff') {
    const roleIdRaw = getFirestoreStringField(profileDocument, 'roleId', 'role_staff_default');
    const roleId = roleIdRaw ? roleIdRaw : 'role_staff_default';
    roleConfigDocument = fetchFirestoreJson(
      getFirestoreDocumentUrl(payload.appId, 'roles_config', roleId),
      payload.idToken,
      'LIMS role configuration lookup',
      true
    );
  }

  const permissions = getEffectiveMutationPermissions(profileDocument, roleConfigDocument);
  const hasPermission = permission => permissions.includes('*') || permissions.includes(permission);
  if (!hasPermission('sop_view') || (!hasPermission('batch_run') && !hasPermission('sop_approve'))) {
    throw new Error('Authorization failed: report mutation permission denied');
  }

  return {
    uid: account.uid,
    role,
    appId: payload.appId,
    idToken: payload.idToken,
  };
}

let ACTIVE_REQUEST_TRACE = null;

function getTraceString(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text === '' ? null : text;
}

function createRequestTraceContext(payload) {
  const safePayload = isPayloadObject(payload) ? payload : {};
  const metadata = isPayloadObject(safePayload.metadata) ? safePayload.metadata : {};
  const requestId = getTraceString(safePayload.requestId) || Utilities.getUuid();

  return {
    requestId,
    action: getTraceString(safePayload.action) || 'unknown',
    sopId: getTraceString(safePayload.sopId),
    batchId: getTraceString(metadata.batchCode || metadata.batchId),
    reportId: null,
    callerUid: null,
    callerRole: null,
    appId: getTraceString(safePayload.appId),
  };
}

function withRequestTrace(traceContext, callback) {
  const previousTrace = ACTIVE_REQUEST_TRACE;
  ACTIVE_REQUEST_TRACE = traceContext;
  try {
    return callback();
  } finally {
    ACTIVE_REQUEST_TRACE = previousTrace;
  }
}

function updateRequestTrace(fields) {
  if (!ACTIVE_REQUEST_TRACE || !isPayloadObject(fields)) return;
  Object.keys(fields).forEach(key => {
    const value = fields[key];
    if (value !== undefined && value !== null && value !== '') {
      ACTIVE_REQUEST_TRACE[key] = value;
    }
  });
}

function logRequestTrace(event, fields) {
  if (!ACTIVE_REQUEST_TRACE) return;
  const entry = {
    event,
    requestId: ACTIVE_REQUEST_TRACE.requestId,
    action: ACTIVE_REQUEST_TRACE.action,
    sopId: ACTIVE_REQUEST_TRACE.sopId,
    batchId: ACTIVE_REQUEST_TRACE.batchId,
    reportId: ACTIVE_REQUEST_TRACE.reportId,
    callerUid: ACTIVE_REQUEST_TRACE.callerUid,
    callerRole: ACTIVE_REQUEST_TRACE.callerRole,
    appId: ACTIVE_REQUEST_TRACE.appId,
  };
  if (isPayloadObject(fields)) {
    Object.keys(fields).forEach(key => {
      if (fields[key] !== undefined) entry[key] = fields[key];
    });
  }
  Logger.log(JSON.stringify(entry));
}

function getRequestErrorMessage(error) {
  if (error && error.message) return error.message;
  return String(error);
}

const GENERATE_PDF_IDEMPOTENCY_PREFIX = 'generate_pdf_idempotency:';
const GENERATE_PDF_IN_PROGRESS_TTL_MS = 10 * 60 * 1000;
const GENERATE_PDF_COMPLETED_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const UPLOAD_EXCEL_IDEMPOTENCY_PREFIX = 'upload_excel_idempotency:';
const UPLOAD_EXCEL_IN_PROGRESS_TTL_MS = 10 * 60 * 1000;
const UPLOAD_EXCEL_COMPLETED_TTL_MS = 24 * 60 * 60 * 1000;
const UPLOAD_EXCEL_MAX_IDEMPOTENCY_RECORDS = 500;
const UPLOAD_EXCEL_RATE_LIMIT_KEY = 'upload_excel_rate_limit';
const UPLOAD_EXCEL_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const UPLOAD_EXCEL_RATE_LIMIT_MAX_REQUESTS = 30;
const UPLOAD_EXCEL_MAX_BYTES = 20 * 1024 * 1024;

const UPLOAD_EXCEL_FILE_TYPES = {
  '.xlsx': {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    acceptedMimeTypes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    signature: [0x50, 0x4B, 0x03, 0x04],
  },
  '.xls': {
    mimeType: 'application/vnd.ms-excel',
    acceptedMimeTypes: ['application/vnd.ms-excel'],
    signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1],
  },
};

function stableStringifyForIdempotency(value) {
  if (Array.isArray(value)) {
    return '[' + value.map(item => stableStringifyForIdempotency(item)).join(',') + ']';
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).filter(key => value[key] !== undefined).sort();
    return '{' + keys.map(key => JSON.stringify(key) + ':' + stableStringifyForIdempotency(value[key])).join(',') + '}';
  }
  return JSON.stringify(value);
}

function buildGeneratePdfFingerprint(sopId, metadata, samples, version) {
  const canonicalPayload = stableStringifyForIdempotency({
    action: 'generate_pdf',
    sopId,
    metadata,
    samples,
    version: version === undefined ? null : version,
  });
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    canonicalPayload,
    Utilities.Charset.UTF_8
  );
  return Utilities.base64EncodeWebSafe(digest);
}

function getGeneratePdfIdempotencyKey(requestId) {
  return GENERATE_PDF_IDEMPOTENCY_PREFIX + requestId;
}

function pruneGeneratePdfIdempotencyRecords(scriptProperties, nowMs) {
  const properties = scriptProperties.getProperties();
  Object.keys(properties).forEach(key => {
    if (!key.startsWith(GENERATE_PDF_IDEMPOTENCY_PREFIX)) return;
    try {
      const record = JSON.parse(properties[key]);
      if (!record.expiresAt || Number(record.expiresAt) <= nowMs) {
        scriptProperties.deleteProperty(key);
      }
    } catch (error) {
      scriptProperties.deleteProperty(key);
    }
  });
}

function claimGeneratePdfRequest(requestId, fingerprint) {
  return withScriptLock(() => {
    const scriptProperties = PropertiesService.getScriptProperties();
    const nowMs = Date.now();
    pruneGeneratePdfIdempotencyRecords(scriptProperties, nowMs);
    const key = getGeneratePdfIdempotencyKey(requestId);
    const rawRecord = scriptProperties.getProperty(key);

    if (rawRecord) {
      const record = JSON.parse(rawRecord);
      if (record.fingerprint !== fingerprint) {
        throw new Error(`requestId ${requestId} was already used with a different generate_pdf payload`);
      }
      if (record.status === 'completed' && record.result) {
        return { replay: true, result: record.result };
      }
      if (record.status === 'in_progress' && Number(record.expiresAt) > nowMs) {
        throw new Error(`generate_pdf request is already in progress for requestId ${requestId}`);
      }
    }

    scriptProperties.setProperty(key, JSON.stringify({
      status: 'in_progress',
      fingerprint,
      updatedAt: nowMs,
      expiresAt: nowMs + GENERATE_PDF_IN_PROGRESS_TTL_MS,
    }));
    return { replay: false, result: null };
  });
}

function completeGeneratePdfRequest(requestId, fingerprint, result) {
  return withScriptLock(() => {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = getGeneratePdfIdempotencyKey(requestId);
    const rawRecord = scriptProperties.getProperty(key);
    if (!rawRecord) {
      throw new Error(`Idempotency claim missing for requestId ${requestId}`);
    }
    const record = JSON.parse(rawRecord);
    if (record.status !== 'in_progress' || record.fingerprint !== fingerprint) {
      throw new Error(`Idempotency claim changed for requestId ${requestId}`);
    }
    const nowMs = Date.now();
    scriptProperties.setProperty(key, JSON.stringify({
      status: 'completed',
      fingerprint,
      result,
      updatedAt: nowMs,
      expiresAt: nowMs + GENERATE_PDF_COMPLETED_TTL_MS,
    }));
  });
}

function clearGeneratePdfRequestClaim(requestId, fingerprint) {
  return withScriptLock(() => {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = getGeneratePdfIdempotencyKey(requestId);
    const rawRecord = scriptProperties.getProperty(key);
    if (!rawRecord) return;
    const record = JSON.parse(rawRecord);
    if (record.status === 'in_progress' && record.fingerprint === fingerprint) {
      scriptProperties.deleteProperty(key);
    }
  });
}

function executeGeneratePdfIdempotently(requestId, sopId, metadata, samples, version, generator) {
  const fingerprint = buildGeneratePdfFingerprint(sopId, metadata, samples, version);
  const claim = claimGeneratePdfRequest(requestId, fingerprint);
  if (claim.replay) {
    const replayedResult = claim.result;
    const replayedReportId = replayedResult && (replayedResult.docId || replayedResult.pdfId);
    updateRequestTrace({ reportId: replayedReportId });
    logRequestTrace('generate.idempotent-replay', {
      reportId: replayedReportId,
      pdfId: replayedResult && replayedResult.pdfId,
    });
    return { ...replayedResult, idempotentReplay: true };
  }

  try {
    const result = generator();
    completeGeneratePdfRequest(requestId, fingerprint, result);
    logRequestTrace('generate.idempotency-stored', {
      reportId: result && (result.docId || result.pdfId),
      pdfId: result && result.pdfId,
    });
    return result;
  } catch (error) {
    try {
      clearGeneratePdfRequestClaim(requestId, fingerprint);
    } catch (cleanupError) {
      logRequestTrace('generate.idempotency-cleanup-error', {
        error: getRequestErrorMessage(cleanupError),
      });
    }
    throw error;
  }
}

function getUploadExcelFileType(fileName) {
  const normalizedFileName = String(fileName || '').trim();
  const extensionMatch = normalizedFileName.toLowerCase().match(/(\.[^.]+)$/);
  const extension = extensionMatch ? extensionMatch[1] : '';
  const fileType = UPLOAD_EXCEL_FILE_TYPES[extension];
  if (!fileType) {
    throw new Error('Invalid Excel file extension: only .xlsx and .xls are allowed');
  }
  return { extension, ...fileType };
}

function validateUploadExcelEncodedLength(encodedLength) {
  const maxEncodedLength = Math.ceil(UPLOAD_EXCEL_MAX_BYTES / 3) * 4;
  if (!Number.isFinite(encodedLength) || encodedLength < 1 || encodedLength > maxEncodedLength) {
    throw new Error(`Invalid Excel file size: maximum decoded size is ${UPLOAD_EXCEL_MAX_BYTES} bytes`);
  }
}

function validateUploadExcelDecodedLength(decodedLength) {
  if (!Number.isFinite(decodedLength) || decodedLength < 1 || decodedLength > UPLOAD_EXCEL_MAX_BYTES) {
    throw new Error(`Invalid Excel file size: maximum decoded size is ${UPLOAD_EXCEL_MAX_BYTES} bytes`);
  }
}

function extractUploadExcelBase64(fileData, fileType) {
  let cleanBase64 = fileData.trim();
  if (cleanBase64.toLowerCase().startsWith('data:')) {
    const match = cleanBase64.match(/^data:([^;,]*);base64,([\s\S]*)$/i);
    if (!match) {
      throw new Error('Invalid fileData: expected a Base64 data URL');
    }
    const declaredMimeType = match[1].trim().toLowerCase();
    if (declaredMimeType && !fileType.acceptedMimeTypes.includes(declaredMimeType)) {
      throw new Error(`Invalid Excel MIME type for ${fileType.extension}: ${declaredMimeType}`);
    }
    cleanBase64 = match[2];
  }

  validateUploadExcelEncodedLength(cleanBase64.length);
  if (cleanBase64.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64)) {
    throw new Error('Invalid fileData: malformed Base64 content');
  }
  return cleanBase64;
}

function hasUploadExcelSignature(decodedBytes, signature) {
  if (!Array.isArray(decodedBytes) || decodedBytes.length < signature.length) return false;
  for (let index = 0; index < signature.length; index++) {
    if ((decodedBytes[index] & 0xFF) !== signature[index]) return false;
  }
  return true;
}

function prepareUploadExcelFile(fileName, fileData) {
  const fileType = getUploadExcelFileType(fileName);
  const cleanBase64 = extractUploadExcelBase64(fileData, fileType);
  let decodedBytes;
  try {
    decodedBytes = Utilities.base64Decode(cleanBase64);
  } catch (error) {
    throw new Error(`Invalid fileData: Base64 decode failed (${getRequestErrorMessage(error)})`);
  }
  validateUploadExcelDecodedLength(decodedBytes.length);
  if (!hasUploadExcelSignature(decodedBytes, fileType.signature)) {
    throw new Error(`Invalid Excel file content: signature does not match ${fileType.extension}`);
  }
  return {
    decodedBytes,
    mimeType: fileType.mimeType,
    extension: fileType.extension,
  };
}

function buildUploadExcelFingerprint(sopId, fileName, decodedBytes) {
  const contentDigest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    decodedBytes
  );
  const contentHash = Utilities.base64EncodeWebSafe(contentDigest);
  const canonicalPayload = stableStringifyForIdempotency({
    action: 'upload_excel',
    sopId,
    fileName: fileName.trim(),
    contentHash,
  });
  const fingerprintDigest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    canonicalPayload,
    Utilities.Charset.UTF_8
  );
  return Utilities.base64EncodeWebSafe(fingerprintDigest);
}

function getUploadExcelIdempotencyKey(requestId) {
  return UPLOAD_EXCEL_IDEMPOTENCY_PREFIX + requestId;
}

function pruneUploadExcelIdempotencyRecords(scriptProperties, nowMs) {
  const properties = scriptProperties.getProperties();
  const completedRecords = [];
  Object.keys(properties).forEach(key => {
    if (!key.startsWith(UPLOAD_EXCEL_IDEMPOTENCY_PREFIX)) return;
    try {
      const record = JSON.parse(properties[key]);
      if (!record.expiresAt || Number(record.expiresAt) <= nowMs) {
        scriptProperties.deleteProperty(key);
        return;
      }
      if (record.status === 'completed') {
        completedRecords.push({ key, updatedAt: Number(record.updatedAt) || 0 });
      }
    } catch (error) {
      scriptProperties.deleteProperty(key);
    }
  });

  completedRecords
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(UPLOAD_EXCEL_MAX_IDEMPOTENCY_RECORDS)
    .forEach(record => scriptProperties.deleteProperty(record.key));
}

function claimUploadExcelRequest(requestId, fingerprint) {
  return withScriptLock(() => {
    const scriptProperties = PropertiesService.getScriptProperties();
    const nowMs = Date.now();
    pruneUploadExcelIdempotencyRecords(scriptProperties, nowMs);
    const key = getUploadExcelIdempotencyKey(requestId);
    const rawRecord = scriptProperties.getProperty(key);

    if (rawRecord) {
      const record = JSON.parse(rawRecord);
      if (record.fingerprint !== fingerprint) {
        throw new Error(`requestId ${requestId} was already used with a different upload_excel payload`);
      }
      if (record.status === 'completed' && record.result) {
        return { replay: true, result: record.result };
      }
      if (record.status === 'in_progress' && Number(record.expiresAt) > nowMs) {
        throw new Error(`upload_excel request is already in progress for requestId ${requestId}`);
      }
    }

    scriptProperties.setProperty(key, JSON.stringify({
      status: 'in_progress',
      fingerprint,
      updatedAt: nowMs,
      expiresAt: nowMs + UPLOAD_EXCEL_IN_PROGRESS_TTL_MS,
    }));
    return { replay: false, result: null };
  });
}

function completeUploadExcelRequest(requestId, fingerprint, result) {
  return withScriptLock(() => {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = getUploadExcelIdempotencyKey(requestId);
    const rawRecord = scriptProperties.getProperty(key);
    if (!rawRecord) {
      throw new Error(`Upload idempotency claim missing for requestId ${requestId}`);
    }
    const record = JSON.parse(rawRecord);
    if (record.status !== 'in_progress' || record.fingerprint !== fingerprint) {
      throw new Error(`Upload idempotency claim changed for requestId ${requestId}`);
    }
    const nowMs = Date.now();
    scriptProperties.setProperty(key, JSON.stringify({
      status: 'completed',
      fingerprint,
      result,
      updatedAt: nowMs,
      expiresAt: nowMs + UPLOAD_EXCEL_COMPLETED_TTL_MS,
    }));
  });
}

function clearUploadExcelRequestClaim(requestId, fingerprint) {
  return withScriptLock(() => {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = getUploadExcelIdempotencyKey(requestId);
    const rawRecord = scriptProperties.getProperty(key);
    if (!rawRecord) return;
    const record = JSON.parse(rawRecord);
    if (record.status === 'in_progress' && record.fingerprint === fingerprint) {
      scriptProperties.deleteProperty(key);
    }
  });
}

function consumeUploadExcelQuota(nowMs) {
  return withScriptLock(() => {
    const scriptProperties = PropertiesService.getScriptProperties();
    const currentTime = nowMs === undefined ? Date.now() : nowMs;
    const rawRecord = scriptProperties.getProperty(UPLOAD_EXCEL_RATE_LIMIT_KEY);
    let record = null;
    if (rawRecord) {
      try {
        record = JSON.parse(rawRecord);
      } catch (error) {
        logRequestTrace('upload.rate-limit-state-reset', {
          error: getRequestErrorMessage(error),
        });
      }
    }
    if (!record || !Number.isFinite(Number(record.windowStart)) ||
        currentTime - Number(record.windowStart) >= UPLOAD_EXCEL_RATE_LIMIT_WINDOW_MS ||
        currentTime < Number(record.windowStart)) {
      record = { windowStart: currentTime, count: 0 };
    }
    if (Number(record.count) >= UPLOAD_EXCEL_RATE_LIMIT_MAX_REQUESTS) {
      throw new Error('upload_excel rate limit exceeded; retry after the current 10-minute window');
    }
    record.count = Number(record.count) + 1;
    scriptProperties.setProperty(UPLOAD_EXCEL_RATE_LIMIT_KEY, JSON.stringify(record));
    return record.count;
  });
}

function executeUploadExcelIdempotently(requestId, fingerprint, uploader, rollback) {
  const claim = claimUploadExcelRequest(requestId, fingerprint);
  if (claim.replay) {
    const replayedResult = claim.result;
    updateRequestTrace({ reportId: replayedResult && replayedResult.fileId });
    logRequestTrace('upload.idempotent-replay', {
      artifactId: replayedResult && replayedResult.fileId,
      fileName: replayedResult && replayedResult.fileName,
    });
    return { ...replayedResult, idempotentReplay: true };
  }

  try {
    const result = uploader();
    completeUploadExcelRequest(requestId, fingerprint, result);
    logRequestTrace('upload.idempotency-stored', {
      artifactId: result && result.fileId,
      fileName: result && result.fileName,
    });
    return result;
  } catch (error) {
    if (rollback) {
      try {
        rollback();
      } catch (cleanupError) {
        logRequestTrace('upload.rollback-error', {
          error: getRequestErrorMessage(cleanupError),
        });
      }
    }
    try {
      clearUploadExcelRequestClaim(requestId, fingerprint);
    } catch (cleanupError) {
      logRequestTrace('upload.idempotency-cleanup-error', {
        error: getRequestErrorMessage(cleanupError),
      });
    }
    throw error;
  }
}

// ── doPost: main entry point ──────────────────────────────────────────
function doPost(e) {
  let traceContext = null;
  try {
    const payload = JSON.parse(e.postData.contents);
    traceContext = createRequestTraceContext(payload);
    return withRequestTrace(traceContext, () => {
      logRequestTrace('request.received');
      validateMutationPayload(payload);
      logRequestTrace('request.validated');
      const authContext = authenticateAndAuthorizeMutation(payload);
      updateRequestTrace({
        callerUid: authContext.uid,
        callerRole: authContext.role,
        appId: authContext.appId,
      });
      logRequestTrace('request.authorized');
      const { requestId, sopId, metadata, samples, action, version, files } = payload;

      let result;
      logRequestTrace('dispatch.start');
      if (action === 'generate_pdf') {
        result = generateReport(sopId, metadata, samples, version, requestId);
      } else if (action === 'archive_reports') {
        result = archiveReportsAction(files, requestId, authContext);
      } else if (action === 'upload_excel') {
        result = uploadExcelAction(payload);
      } else {
        throw new Error(`Unknown action: ${action}`);
      }

      const reportId = result && (result.docId || result.fileId || result.pdfId);
      updateRequestTrace({ reportId });
      logRequestTrace('request.success', {
        fileName: result && result.fileName,
        pdfId: result && result.pdfId,
      });

      return ContentService
        .createTextOutput(JSON.stringify({ success: true, requestId: traceContext.requestId, ...result }))
        .setMimeType(ContentService.MimeType.JSON);
    });

  } catch (err) {
    const errorMessage = getRequestErrorMessage(err);
    traceContext = traceContext || createRequestTraceContext({ action: 'unknown' });
    return withRequestTrace(traceContext, () => {
      logRequestTrace('request.error', { error: errorMessage });
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, requestId: traceContext.requestId, error: errorMessage }))
        .setMimeType(ContentService.MimeType.JSON);
    });
  }
}

function isConfiguredReportTemplateId(templateId) {
  return typeof templateId === 'string'
    && templateId.trim() !== ''
    && templateId !== 'PASTE_GOOGLE_DOC_ID_HERE';
}

function assertTemplateVariantConfiguration() {
  const variantsBySop = CONFIG.TEMPLATE_VARIANTS || {};
  const templates = CONFIG.TEMPLATES || {};
  const requiredForms = ['formCheck', 'formDon'];

  Object.keys(variantsBySop).forEach(sopId => {
    const variants = variantsBySop[sopId];
    if (!variants || typeof variants !== 'object' || Array.isArray(variants)) {
      throw new Error(`Template variant config invalid for SOP ${sopId}: expected { formCheck, formDon }`);
    }

    requiredForms.forEach(formType => {
      const templateKey = variants[formType];
      if (typeof templateKey !== 'string' || templateKey.trim() === '') {
        throw new Error(`Template variant config invalid for SOP ${sopId}: ${formType} template key is missing`);
      }

      if (!Object.prototype.hasOwnProperty.call(templates, templateKey)) {
        throw new Error(`Template variant config invalid for SOP ${sopId}: ${formType} target "${templateKey}" is not declared in CONFIG.TEMPLATES`);
      }

      if (!isConfiguredReportTemplateId(templates[templateKey])) {
        throw new Error(`Template variant config invalid for SOP ${sopId}: ${formType} target "${templateKey}" has no configured template ID`);
      }
    });
  });

  return true;
}

function resolveReportTemplateId(sopId, metadata) {
  assertTemplateVariantConfiguration();

  const variants = CONFIG.TEMPLATE_VARIANTS && CONFIG.TEMPLATE_VARIANTS[sopId];
  if (!variants) return CONFIG.TEMPLATES[sopId];

  const requestedForm = metadata && metadata.printFormType === 'formDon' ? 'formDon' : 'formCheck';
  const templateKey = variants[requestedForm];
  return CONFIG.TEMPLATES[templateKey];
}

let GENERATED_REPORT_ARTIFACTS = null;

function registerGeneratedArtifact(file, kind) {
  if (GENERATED_REPORT_ARTIFACTS) {
    GENERATED_REPORT_ARTIFACTS.push({ file, kind });
  }
  return file;
}

function createGeneratedDocCopy(templateFile, fileName, folder) {
  return registerGeneratedArtifact(templateFile.makeCopy(fileName, folder), 'doc');
}

function createGeneratedPdfFile(folder, pdfBlob, pdfName) {
  const pdfFile = registerGeneratedArtifact(folder.createFile(pdfBlob), 'pdf');
  return pdfFile.setName(pdfName);
}

function generateReportFromTemplate(templateId, folder, fileName, renderDocument, options) {
  if (typeof renderDocument !== 'function') {
    throw new Error('Report renderer callback is required');
  }

  const lifecycleOptions = options || {};
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = createGeneratedDocCopy(templateFile, fileName, folder);
  const docId = newFile.getId();

  if (typeof lifecycleOptions.onDocCreated === 'function') {
    lifecycleOptions.onDocCreated({ docId, fileName, file: newFile });
  }

  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();
  renderDocument({ doc, body, docId, file: newFile });

  doc.saveAndClose();

  const pdfBlob = DriveApp.getFileById(docId).getAs('application/pdf');
  const pdfName = fileName + '.pdf';
  const pdfFile = createGeneratedPdfFile(folder, pdfBlob, pdfName);

  if (typeof lifecycleOptions.onPdfCreated === 'function') {
    lifecycleOptions.onPdfCreated({ docId, pdfId: pdfFile.getId(), fileName, file: pdfFile });
  }

  const createdAt = lifecycleOptions.createdAt instanceof Date
    ? lifecycleOptions.createdAt
    : new Date();

  return {
    docId,
    pdfId: pdfFile.getId(),
    docsUrl: `https://docs.google.com/document/d/${docId}/edit`,
    pdfUrl: pdfFile.getUrl(),
    pdfViewUrl: pdfFile.getDownloadUrl(),
    fileName,
    createdAt: createdAt.toISOString(),
  };
}

function rollbackGeneratedArtifacts(artifacts) {
  for (let i = artifacts.length - 1; i >= 0; i--) {
    const artifact = artifacts[i];
    try {
      artifact.file.setTrashed(true);
      Logger.log(`[ReportRollback] Trashed ${artifact.kind} artifact after generation failure.`);
    } catch (cleanupError) {
      Logger.log(`[ReportRollback] Failed to trash ${artifact.kind} artifact: ${cleanupError.message || cleanupError}`);
    }
  }
}

function withGeneratedArtifactRollback(callback) {
  const previousArtifacts = GENERATED_REPORT_ARTIFACTS;
  const artifacts = [];
  GENERATED_REPORT_ARTIFACTS = artifacts;
  try {
    return callback();
  } catch (error) {
    rollbackGeneratedArtifacts(artifacts);
    throw error;
  } finally {
    GENERATED_REPORT_ARTIFACTS = previousArtifacts;
  }
}

// ── Core: Tạo báo cáo & Định tuyến thông minh (Dynamic Routing) ────────
function generateReport(sopId, metadata, samples, version, requestId) {
  validateGeneratePdfPayload({ action: 'generate_pdf', requestId, sopId, metadata, samples, version });
  logRequestTrace('generate.start', { sampleCount: samples.length, version: version || null });
  return withGeneratedArtifactRollback(() => executeGeneratePdfIdempotently(
    requestId,
    sopId,
    metadata,
    samples,
    version,
    () => generateReportCore(sopId, metadata, samples, version)
  ));
}

function getPostGenerationRequiredPlaceholders(sopConfig) {
  const placeholders = [];
  const explicitlyRequired = sopConfig && Array.isArray(sopConfig.requiredPlaceholders)
    ? sopConfig.requiredPlaceholders
    : [];
  explicitlyRequired.forEach(placeholder => {
    if (typeof placeholder === 'string' && placeholder.length > 0) placeholders.push(placeholder);
  });

  const signaturePlaceholders = sopConfig && sopConfig.signaturePlaceholders;
  if (signaturePlaceholders && typeof signaturePlaceholders === 'object') {
    Object.keys(signaturePlaceholders).forEach(placeholder => {
      if (placeholder.length > 0) placeholders.push(placeholder);
    });
  }

  return Array.from(new Set(placeholders));
}

function assertTemplateRequiredPlaceholders(body, sopConfig, sopId) {
  const requiredPlaceholders = getPostGenerationRequiredPlaceholders(sopConfig);
  if (requiredPlaceholders.length === 0) return;
  if (!body || typeof body.getText !== 'function') {
    throw new Error(`Template contract invalid for SOP ${sopId}: document text cannot be inspected`);
  }

  const bodyText = body.getText();
  const missingPlaceholders = requiredPlaceholders.filter(placeholder => bodyText.indexOf(placeholder) === -1);
  if (missingPlaceholders.length > 0) {
    throw new Error(`Template contract invalid for SOP ${sopId}: missing required placeholders: ${missingPlaceholders.join(', ')}`);
  }
}

function getTemplateTableCellText(table, rowIndex, cellIndex) {
  try {
    if (!table || typeof table.getNumRows !== 'function' || rowIndex < 0 || rowIndex >= table.getNumRows()) {
      return '';
    }
    const row = table.getRow(rowIndex);
    if (!row || typeof row.getNumCells !== 'function' || cellIndex < 0 || cellIndex >= row.getNumCells()) {
      return '';
    }
    const cell = row.getCell(cellIndex);
    if (!cell || typeof cell.getText !== 'function') return '';
    const text = cell.getText();
    return text === undefined || text === null ? '' : text.toString();
  } catch (e) {
    Logger.log(`[TemplateContract][table-inspect] ${e.toString()}`);
    return '';
  }
}

function templateTableHasMinimumColumns(table, firstRowIndex, lastRowIndex, minimumColumns) {
  try {
    if (!table || typeof table.getNumRows !== 'function') return false;
    const numRows = table.getNumRows();
    if (firstRowIndex < 0 || lastRowIndex >= numRows || firstRowIndex > lastRowIndex) return false;
    for (let rowIndex = firstRowIndex; rowIndex <= lastRowIndex; rowIndex++) {
      const row = table.getRow(rowIndex);
      if (!row || typeof row.getNumCells !== 'function' || row.getNumCells() < minimumColumns) return false;
    }
    return true;
  } catch (e) {
    Logger.log(`[TemplateContract][table-shape] ${e.toString()}`);
    return false;
  }
}

function isTrifluralinCalibrationTableCandidate(table) {
  if (!table || typeof table.getNumRows !== 'function') return false;
  const numRows = table.getNumRows();
  if (numRows < 8 || !templateTableHasMinimumColumns(table, numRows - 8, numRows - 1, 2)) return false;
  const lastRowText = getTemplateTableCellText(table, numRows - 1, 0).trim();
  return lastRowText.indexOf('R2') !== -1 || lastRowText.indexOf('R²') !== -1;
}

function isFipronilCalibrationTableCandidate(table) {
  if (!table || typeof table.getNumRows !== 'function' || table.getNumRows() !== 6) return false;
  if (!templateTableHasMinimumColumns(table, 0, 5, 4)) return false;
  const headerText = getTemplateTableCellText(table, 0, 0);
  return headerText.indexOf('Điểm chuẩn') !== -1 || headerText.indexOf('Vial No') !== -1;
}

function isFipronilQcTableCandidate(table) {
  if (!table || typeof table.getNumRows !== 'function' || table.getNumRows() < 7) return false;
  return getTemplateTableCellText(table, 0, 0).indexOf('Thông số đánh giá') !== -1;
}

function requireExactlyOneTemplateTable(body, matcher, sopId, tableLabel) {
  if (!body || typeof body.getTables !== 'function') {
    throw new Error(`Template contract invalid for SOP ${sopId}: document tables cannot be inspected`);
  }
  const matches = body.getTables().filter(table => matcher(table));
  if (matches.length !== 1) {
    throw new Error(`Template contract invalid for SOP ${sopId}: expected exactly 1 ${tableLabel}, found ${matches.length}`);
  }
  return matches[0];
}

function requireTrifluralinCalibrationTable(body, sopId) {
  return requireExactlyOneTemplateTable(
    body,
    isTrifluralinCalibrationTableCandidate,
    sopId,
    'writable Trifluralin calibration/R² table'
  );
}

function requireFipronilCalibrationTable(body, sopId) {
  return requireExactlyOneTemplateTable(
    body,
    isFipronilCalibrationTableCandidate,
    sopId,
    'writable Fipronil-style calibration table'
  );
}

function getConfiguredQcCheckboxMappings(sopConfig) {
  const checkboxLines = sopConfig && sopConfig.checkboxLines;
  if (!checkboxLines || typeof checkboxLines !== 'object' || Array.isArray(checkboxLines)) return [];
  return Object.keys(checkboxLines)
    .map(label => ({ label, fieldName: checkboxLines[label] }))
    .filter(mapping => typeof mapping.fieldName === 'string' && mapping.fieldName.indexOf('qc') === 0);
}

function qcTemplateLabelMatches(rowLabel, configuredLabel) {
  const rowText = rowLabel === undefined || rowLabel === null ? '' : rowLabel.toString().trim();
  const configuredText = configuredLabel === undefined || configuredLabel === null ? '' : configuredLabel.toString().trim();
  return rowText !== '' && configuredText !== '' &&
    (rowText.indexOf(configuredText) !== -1 || configuredText.indexOf(rowText) !== -1);
}

function isWritableQcEvaluationCellText(cellText) {
  const text = cellText === undefined || cellText === null ? '' : cellText.toString();
  const checkbox = '(?:[☐□☑]|\\[ ?\\]|\\( ?\\))';
  return new RegExp(checkbox + '\\s*Đạt', 'i').test(text) &&
    new RegExp(checkbox + '\\s*Không đạt', 'i').test(text) &&
    new RegExp(checkbox + '\\s*N/A', 'i').test(text);
}

function assertFipronilQcTableContract(qcTable, sopConfig, sopId) {
  const requiredMappings = getConfiguredQcCheckboxMappings(sopConfig);
  if (requiredMappings.length === 0) return;

  requiredMappings.forEach(mapping => {
    const matchingRows = [];
    for (let rowIndex = 1; rowIndex < qcTable.getNumRows(); rowIndex++) {
      if (qcTemplateLabelMatches(getTemplateTableCellText(qcTable, rowIndex, 0), mapping.label)) {
        matchingRows.push(rowIndex);
      }
    }
    if (matchingRows.length !== 1) {
      throw new Error(`Template contract invalid for SOP ${sopId}: expected exactly 1 QC row for "${mapping.label}", found ${matchingRows.length}`);
    }
    const rowIndex = matchingRows[0];
    if (!templateTableHasMinimumColumns(qcTable, rowIndex, rowIndex, 3)) {
      throw new Error(`Template contract invalid for SOP ${sopId}: QC row "${mapping.label}" must contain evaluation column index 2`);
    }
    const evaluationText = getTemplateTableCellText(qcTable, rowIndex, 2);
    if (!isWritableQcEvaluationCellText(evaluationText)) {
      throw new Error(`Template contract invalid for SOP ${sopId}: QC row "${mapping.label}" has no writable Đạt/Không đạt/N/A checkbox markers`);
    }
  });
}

function requireFipronilQcTable(body, sopConfig, sopId) {
  const qcTable = requireExactlyOneTemplateTable(
    body,
    isFipronilQcTableCandidate,
    sopId,
    'Fipronil-style QC table'
  );
  assertFipronilQcTableContract(qcTable, sopConfig, sopId);
  return qcTable;
}

function assertCustomType2TemplateContract(body, sopConfig, sopId) {
  if (sopId === 'trifluralin-gcms') {
    requireTrifluralinCalibrationTable(body, sopId);
    return;
  }
  if (sopId === 'fipronil-chlorpyrifos' || sopId === 'tbvtv-thuc-pham-gcmsms-rut-gon') {
    requireFipronilCalibrationTable(body, sopId);
    if (getConfiguredQcCheckboxMappings(sopConfig).length > 0) {
      requireFipronilQcTable(body, sopConfig, sopId);
    }
  }
}

function assertType2Or3aTemplateContract(body, sopConfig, sopId) {
  if (!body || typeof body.getTables !== 'function') {
    throw new Error(`Template contract invalid for SOP ${sopId}: document tables cannot be inspected`);
  }

  const tables = body.getTables();
  const sampleTableIndex = sopConfig.sampleTableIndex !== undefined ? sopConfig.sampleTableIndex : 2;
  if (!Number.isInteger(sampleTableIndex) || sampleTableIndex < 0 || sampleTableIndex >= tables.length) {
    throw new Error(`Template contract invalid for SOP ${sopId}: sampleTableIndex ${sampleTableIndex} is outside ${tables.length} tables`);
  }

  const headerRows = sopConfig.headerRows || 1;
  if (!Number.isInteger(headerRows) || headerRows < 1) {
    throw new Error(`Template contract invalid for SOP ${sopId}: headerRows must be a positive integer`);
  }

  const sampleTable = tables[sampleTableIndex];
  if (!sampleTable || typeof sampleTable.getNumRows !== 'function' || sampleTable.getNumRows() <= headerRows) {
    throw new Error(`Template contract invalid for SOP ${sopId}: sample table must contain ${headerRows} header row(s) and at least one data row`);
  }

  const columns = sopConfig.columns;
  if (!columns || typeof columns !== 'object' || Array.isArray(columns) || Object.keys(columns).length === 0) {
    throw new Error(`Template contract invalid for SOP ${sopId}: configured sample columns are missing`);
  }

  const columnIndexes = Object.keys(columns).map(key => columns[key]);
  if (columnIndexes.some(index => !Number.isInteger(index) || index < 0)) {
    throw new Error(`Template contract invalid for SOP ${sopId}: configured sample column indexes must be non-negative integers`);
  }
  const maxColumnIndex = Math.max.apply(null, columnIndexes);
  const headerShapeRow = sampleTable.getRow(headerRows - 1);
  const firstDataRow = sampleTable.getRow(headerRows);
  if (headerShapeRow.getNumCells() <= maxColumnIndex || firstDataRow.getNumCells() <= maxColumnIndex) {
    throw new Error(`Template contract invalid for SOP ${sopId}: sample table requires column index ${maxColumnIndex}, but header/data shape is too narrow`);
  }
}

function assertType3bFormDonTemplateContract(body, sopConfig, sopId) {
  if (typeof isFormDonCalibrationTableCandidate !== 'function' ||
      typeof isFormDonResultTableCandidate !== 'function' ||
      typeof getType3bTableHeaderTexts !== 'function' ||
      typeof resolveFormDonCalibrationHeaderColumns !== 'function' ||
      typeof resolveFormDonResultHeaderColumns !== 'function') {
    throw new Error(`Template contract invalid for SOP ${sopId}: Type3B Form Don contract helpers are unavailable`);
  }
  if (!body || typeof body.getTables !== 'function') {
    throw new Error(`Template contract invalid for SOP ${sopId}: document tables cannot be inspected`);
  }

  const tables = body.getTables();
  const calibrationTables = [];
  const resultTables = [];
  tables.forEach(table => {
    if (isFormDonCalibrationTableCandidate(table)) calibrationTables.push(table);
    if (isFormDonResultTableCandidate(table)) resultTables.push(table);
  });

  if (calibrationTables.length !== 1) {
    throw new Error(`Template contract invalid for SOP ${sopId}: expected exactly 1 Form Don calibration table, found ${calibrationTables.length}`);
  }
  if (resultTables.length !== 1) {
    throw new Error(`Template contract invalid for SOP ${sopId}: expected exactly 1 Form Don result table, found ${resultTables.length}`);
  }

  resolveFormDonCalibrationHeaderColumns(getType3bTableHeaderTexts(calibrationTables[0]));
  resolveFormDonResultHeaderColumns(getType3bTableHeaderTexts(resultTables[0]));
}

function normalizeType3bTemplateContractText(value) {
  let text = value === undefined || value === null ? '' : value.toString().toLowerCase();
  try {
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    Logger.log(`[TemplateContract][optional-normalize] ${e.toString()}`);
  }
  return text.replace(/[^a-z0-9]/g, '');
}

function getType3bTemplateCompoundCanonicalId(compoundName) {
  const rawName = compoundName === undefined || compoundName === null ? '' : compoundName.toString().trim();
  if (!rawName) return '';

  if (typeof COMPOUND_TO_CANONICAL !== 'undefined' && COMPOUND_TO_CANONICAL) {
    if (COMPOUND_TO_CANONICAL[rawName]) return COMPOUND_TO_CANONICAL[rawName];
    const lowerName = rawName.toLowerCase();
    for (const displayName of Object.keys(COMPOUND_TO_CANONICAL)) {
      if (displayName.toLowerCase() === lowerName) return COMPOUND_TO_CANONICAL[displayName];
    }
  }

  return normalizeType3bTemplateContractText(rawName);
}

function matchType3bTemplateCompoundCell(cellText, compounds) {
  const rawCellText = cellText === undefined || cellText === null ? '' : cellText.toString().trim();
  if (!rawCellText || !Array.isArray(compounds) || compounds.length === 0) return null;

  const sortedCompounds = compounds.slice().sort((a, b) => b.length - a.length);
  const directCanonical = getType3bTemplateCompoundCanonicalId(rawCellText);
  for (const compound of sortedCompounds) {
    if (directCanonical && directCanonical === getType3bTemplateCompoundCanonicalId(compound)) return compound;
  }

  const normalizedCell = normalizeType3bTemplateContractText(rawCellText);
  for (const compound of sortedCompounds) {
    const normalizedCompound = normalizeType3bTemplateContractText(compound);
    if (!normalizedCompound) continue;
    if (normalizedCell === normalizedCompound) return compound;
  }

  if (rawCellText.length < 50) {
    for (const compound of sortedCompounds) {
      const normalizedCompound = normalizeType3bTemplateContractText(compound);
      if (!normalizedCompound) continue;
      if (normalizedCell.includes(normalizedCompound) ||
          (normalizedCompound.includes(normalizedCell) && normalizedCompound.length - normalizedCell.length <= 2)) {
        return compound;
      }
    }
  }

  const chlorpyrifosLike = normalizedCell.includes('chlorpyrofos') ||
    normalizedCell.includes('chlorpyriphos') ||
    normalizedCell.includes('chlorpyryfos') ||
    normalizedCell.includes('chlorpyrifos');
  if (chlorpyrifosLike) {
    const wantsMethyl = normalizedCell.includes('methyl');
    for (const compound of sortedCompounds) {
      const normalizedCompound = normalizeType3bTemplateContractText(compound);
      const compoundIsChlorpyrifos = normalizedCompound.includes('chlorpyrifos') || normalizedCompound.includes('chlorpyryfos');
      if (compoundIsChlorpyrifos && normalizedCompound.includes('methyl') === wantsMethyl) return compound;
    }
  }

  return null;
}

function isType3bFormCheckWritableResultCellText(cellText) {
  const text = cellText === undefined || cellText === null ? '' : cellText.toString();
  const hasMutableNdCheckbox = /([☐□☑]|\[\s*[xXvV]?\s*\]|\(\s*[xXvV]?\s*\))[^A-Za-z0-9]*ND/i.test(text);
  const hasNumericResultTarget = /[…\.]{2,}/.test(text);
  return hasMutableNdCheckbox && hasNumericResultTarget;
}

function collectType3bFormCheckResultCoverage(body, compounds) {
  const covered = new Set();
  const tables = body.getTables();

  tables.forEach(table => {
    for (let rowIndex = 0; rowIndex < table.getNumRows(); rowIndex++) {
      const row = table.getRow(rowIndex);
      const segments = [];
      for (let cellIndex = 0; cellIndex < row.getNumCells(); cellIndex++) {
        const compound = matchType3bTemplateCompoundCell(row.getCell(cellIndex).getText(), compounds);
        if (compound) segments.push({ compound, startCol: cellIndex });
      }

      for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
        const segment = segments[segmentIndex];
        const endCol = segmentIndex < segments.length - 1 ? segments[segmentIndex + 1].startCol - 1 : row.getNumCells() - 1;
        if (segment.startCol >= endCol) continue;

        for (let cellIndex = segment.startCol + 1; cellIndex <= endCol; cellIndex++) {
          if (isType3bFormCheckWritableResultCellText(row.getCell(cellIndex).getText())) {
            covered.add(segment.compound);
            break;
          }
        }
      }
    }
  });

  return covered;
}

function assertType3bFormCheckTemplateContract(body, sopConfig, sopId) {
  if (!body || typeof body.getTables !== 'function') {
    throw new Error(`Template contract invalid for SOP ${sopId}: document tables cannot be inspected`);
  }
  if (!Array.isArray(sopConfig.compounds) || sopConfig.compounds.length === 0) {
    throw new Error(`Template contract invalid for SOP ${sopId}: Type3B Form Check compounds are missing`);
  }

  const coverage = collectType3bFormCheckResultCoverage(body, sopConfig.compounds);
  const missingCompounds = sopConfig.compounds.filter(compound => !coverage.has(compound));
  if (missingCompounds.length > 0) {
    throw new Error(`Template contract invalid for SOP ${sopId}: Form Check has no writable ND/result segment for compounds: ${missingCompounds.join(', ')}`);
  }
}

function preflightReportTemplateContract(templateId, sopConfig, metadata, sopId) {
  if (!sopConfig || typeof sopConfig !== 'object') {
    throw new Error(`Template contract invalid for SOP ${sopId}: SOP config is missing`);
  }

  const templateDoc = DocumentApp.openById(templateId);
  if (!templateDoc || typeof templateDoc.getBody !== 'function') {
    throw new Error(`Template contract invalid for SOP ${sopId}: template document cannot be opened`);
  }
  const body = templateDoc.getBody();

  assertTemplateRequiredPlaceholders(body, sopConfig, sopId);
  if (sopConfig.formType === 'type2' || sopConfig.formType === 'type3a') {
    assertType2Or3aTemplateContract(body, sopConfig, sopId);
    assertCustomType2TemplateContract(body, sopConfig, sopId);
  }

  const isFormDon = sopConfig.formType === 'type3b' && metadata && metadata.printFormType === 'formDon';
  if (isFormDon) {
    assertType3bFormDonTemplateContract(body, sopConfig, sopId);
  }

  const requestedFormType = metadata && metadata.printFormType;
  const isFormCheck = sopConfig.formType === 'type3b' && (!requestedFormType || requestedFormType === 'formCheck');
  if (isFormCheck) {
    assertType3bFormCheckTemplateContract(body, sopConfig, sopId);
  }

  return true;
}

function findUnresolvedRequiredPlaceholders(body, sopConfig) {
  const requiredPlaceholders = getPostGenerationRequiredPlaceholders(sopConfig);
  if (requiredPlaceholders.length === 0) return [];
  if (!body || typeof body.getText !== 'function') {
    throw new Error('Post-generation validation cannot inspect document text');
  }

  const bodyText = body.getText();
  return requiredPlaceholders.filter(placeholder => bodyText.indexOf(placeholder) !== -1);
}

function assertRenderedCompoundSequence(expectedCompoundIds, renderedCompoundIds) {
  if (!Array.isArray(renderedCompoundIds) || renderedCompoundIds.length !== expectedCompoundIds.length) {
    throw new Error(`Post-generation validation failed: rendered compounds ${Array.isArray(renderedCompoundIds) ? renderedCompoundIds.length : 0}/${expectedCompoundIds.length}`);
  }

  for (let index = 0; index < expectedCompoundIds.length; index++) {
    if (renderedCompoundIds[index] !== expectedCompoundIds[index]) {
      throw new Error(`Post-generation validation failed: compound ${index + 1} expected "${expectedCompoundIds[index]}" but rendered "${renderedCompoundIds[index]}"`);
    }
  }
}

function assertPostGenerationReportComplete(body, sopConfig, metadata, samples, renderStats) {
  if (!renderStats || typeof renderStats !== 'object') {
    throw new Error('Post-generation validation failed: missing render statistics');
  }

  const expectedSampleCount = Array.isArray(samples) ? samples.length : 0;
  if (renderStats.renderedSampleCount !== expectedSampleCount) {
    throw new Error(`Post-generation validation failed: rendered samples ${renderStats.renderedSampleCount}/${expectedSampleCount}`);
  }

  if (renderStats.mode === 'samplePages') {
    const samplesPerLogicalPage = renderStats.samplesPerLogicalPage;
    if (!Number.isInteger(samplesPerLogicalPage) || samplesPerLogicalPage <= 0) {
      throw new Error(`Post-generation validation failed: invalid samplesPerLogicalPage ${samplesPerLogicalPage}`);
    }
    const expectedLogicalPageCount = Math.ceil(expectedSampleCount / samplesPerLogicalPage);
    if (renderStats.logicalPageCount !== expectedLogicalPageCount) {
      throw new Error(`Post-generation validation failed: sample pages ${renderStats.logicalPageCount}/${expectedLogicalPageCount}`);
    }
  }

  if (renderStats.mode === 'formCheck' && renderStats.logicalPageCount !== expectedSampleCount) {
    throw new Error(`Post-generation validation failed: Form Check pages ${renderStats.logicalPageCount}/${expectedSampleCount}`);
  }

  if (renderStats.mode === 'formDon') {
    if (typeof resolveType3bFormDonCompounds !== 'function') {
      throw new Error('Post-generation validation failed: Type3B Form Don contract is unavailable');
    }
    const expectedCompoundIds = resolveType3bFormDonCompounds(sopConfig, metadata)
      .map(compoundId => compoundId === undefined || compoundId === null ? '' : String(compoundId));
    assertRenderedCompoundSequence(expectedCompoundIds, renderStats.renderedCompoundIds);

    if (renderStats.logicalPageCount !== expectedCompoundIds.length) {
      throw new Error(`Post-generation validation failed: Form Don pages ${renderStats.logicalPageCount}/${expectedCompoundIds.length}`);
    }

    const formDonResults = Array.isArray(renderStats.formDonResults) ? renderStats.formDonResults : [];
    if (formDonResults.length !== expectedCompoundIds.length) {
      throw new Error(`Post-generation validation failed: Form Don result contracts ${formDonResults.length}/${expectedCompoundIds.length}`);
    }

    for (let index = 0; index < expectedCompoundIds.length; index++) {
      const resultStats = formDonResults[index] || {};
      if (resultStats.compoundId !== expectedCompoundIds[index]) {
        throw new Error(`Post-generation validation failed: result rows are attached to the wrong compound at index ${index}`);
      }
      if (resultStats.resultTableCount !== 1) {
        throw new Error(`Post-generation validation failed: compound "${expectedCompoundIds[index]}" has ${resultStats.resultTableCount || 0} result tables; expected 1`);
      }
      if (resultStats.resultRowsWritten !== expectedSampleCount) {
        throw new Error(`Post-generation validation failed: compound "${expectedCompoundIds[index]}" rendered result rows ${resultStats.resultRowsWritten}/${expectedSampleCount}`);
      }
    }
  }

  const unresolvedPlaceholders = findUnresolvedRequiredPlaceholders(body, sopConfig);
  if (unresolvedPlaceholders.length > 0) {
    throw new Error('Post-generation validation failed: unresolved required placeholders: ' + unresolvedPlaceholders.join(', '));
  }

  return renderStats;
}

function generateReportCore(sopId, metadata, samples, version) {
  if (metadata) {
    metadata.sopId = sopId;
  }
  const templateId = resolveReportTemplateId(sopId, metadata);
  const sopConfig   = CONFIG.SOP_CONFIG[sopId];

  if (!sopConfig) {
    throw new Error(`Template contract invalid for SOP ${sopId}: SOP config is missing`);
  }

  if (!templateId || templateId === 'PASTE_GOOGLE_DOC_ID_HERE') {
    throw new Error(`Template chưa được cấu hình cho SOP: ${sopId}`);
  }

  // Preflight template gốc trước mọi Drive mutation (folder creation / makeCopy / PDF export).
  preflightReportTemplateContract(templateId, sopConfig, metadata, sopId);

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
    logRequestTrace('generate.route', { route: customFunctionName, fileName });
    const customResult = this[customFunctionName](templateId, metadata, samples, folder, fileName, version);
    const customReportId = customResult && (customResult.docId || customResult.pdfId);
    updateRequestTrace({ reportId: customReportId });
    logRequestTrace('generate.complete', {
      reportId: customReportId,
      pdfId: customResult && customResult.pdfId,
      fileName: customResult && customResult.fileName ? customResult.fileName : fileName,
    });
    return customResult;
  }

  // 4. Nếu không có bộ xử lý chuyên biệt, chạy thông qua Bộ khung mặc định (Fallback Engine)
  Logger.log(`[Router] Chạy bộ khung mặc định cho dạng: ${sopConfig.formType}`);
  
  const result = generateReportFromTemplate(
    templateId,
    folder,
    fileName,
    ({ body }) => {
      const isFormDon = metadata && metadata.printFormType === 'formDon';
      let renderStats;
      if (sopConfig.formType === 'type3b' || isFormDon) {
        Logger.log(`[Router] Routed to generateType3bReport (FormType: ${sopConfig.formType}, isFormDon: ${isFormDon})`);
        renderStats = generateType3bReport(body, sopConfig, metadata, samples);
      } else {
        renderStats = generateType2_3aReport(body, sopConfig, metadata, samples);
      }

      assertPostGenerationReportComplete(body, sopConfig, metadata, samples, renderStats);
      logRequestTrace('generate.validated', {
        renderedSampleCount: renderStats.renderedSampleCount,
        logicalPageCount: renderStats.logicalPageCount,
        mode: renderStats.mode,
      });
    },
    {
      createdAt: now,
      onDocCreated: ({ docId }) => {
        updateRequestTrace({ reportId: docId });
        logRequestTrace('generate.doc-created', { docId, fileName });
      },
      onPdfCreated: ({ docId, pdfId }) => {
        logRequestTrace('generate.pdf-created', { pdfId, docId, fileName });
      },
    },
  );

  Logger.log(`Report created: ${fileName} | Doc: ${result.docId} | PDF: ${result.pdfId}`);
  logRequestTrace('generate.complete', { reportId: result.docId, pdfId: result.pdfId, fileName });
  return result;
}

function normalizeCellText(text) {
  return (text !== undefined && text !== null) ? text.toString() : '';
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
        Logger.log(`[setCellText][optional-format] Không thể đọc text style trực tiếp, dùng paragraph attributes fallback: ${innerE.toString()}`);
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
    Logger.log(`[setCellText][optional-format] Lỗi khi lưu thuộc tính ô gốc: ${e.toString()}`);
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
  
  const cleanText = normalizeCellText(text);
  
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
  } catch(e) {
    Logger.log(`[setCellText][optional-format] Không thể khôi phục paragraph spacing: ${e.toString()}`);
  }
  
  // 4. Khôi phục độ rộng cột, canh lề dọc và padding
  try {
    if (originalWidth !== null && originalWidth > 0) cell.setWidth(originalWidth);
    if (originalVerticalAlign !== null) cell.setVerticalAlignment(originalVerticalAlign);
    if (originalPaddingLeft !== null)   cell.setPaddingLeft(originalPaddingLeft);
    if (originalPaddingRight !== null)  cell.setPaddingRight(originalPaddingRight);
    if (originalPaddingTop !== null)    cell.setPaddingTop(originalPaddingTop);
    if (originalPaddingBottom !== null) cell.setPaddingBottom(originalPaddingBottom);
  } catch(e) {
    Logger.log(`[setCellText][optional-format] Lỗi khi khôi phục cấu trúc TableCell: ${e.toString()}`);
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
      Logger.log(`[setCellText][optional-format] Lỗi khi áp định dạng font: ${e.toString()}`);
    }
  }
  
  return extraLines;
}


// ── Helper: tạo folder năm/tháng/chỉ tiêu trong ROOT_FOLDER ──────────
function withScriptLock(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateFolder(date, sopId) {
  return withScriptLock(() => {
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
  });
}

// Helper function to find or create a subfolder safely
function getSubFolderOrCreate(parentFolder, folderName) {
  const iter = parentFolder.getFoldersByName(folderName);
  if (iter.hasNext()) {
    return iter.next();
  }
  return parentFolder.createFolder(folderName);
}

function getArchiveFolder(parentFolder) {
  return withScriptLock(() => getSubFolderOrCreate(parentFolder, 'Bản_Hủy_Archived'));
}

function isFolderWithinRoot(folder, rootFolderId) {
  const pending = [folder];
  const visited = {};

  while (pending.length > 0) {
    const current = pending.shift();
    const currentId = current.getId();
    if (currentId === rootFolderId) return true;
    if (visited[currentId]) continue;
    visited[currentId] = true;

    const parents = current.getParents();
    while (parents.hasNext()) {
      pending.push(parents.next());
    }
  }

  return false;
}

function getLimsParentFolderForFile(file) {
  const parents = file.getParents();
  while (parents.hasNext()) {
    const parentFolder = parents.next();
    if (isFolderWithinRoot(parentFolder, CONFIG.ROOT_FOLDER_ID)) {
      return parentFolder;
    }
  }

  throw new Error(`Refusing to archive file outside LIMS root: ${file.getId()}`);
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
    requestId: 'diagnostic-trifluralin-normal',
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
      payload.samples,
      payload.version,
      payload.requestId
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
function collectDriveFileIdsFromFirestoreValue(value, ids) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.stringValue === 'string') {
    const fileId = getFileIdFromUrl(value.stringValue);
    if (fileId) ids[fileId] = true;
    return;
  }
  if (value.mapValue && value.mapValue.fields) {
    Object.keys(value.mapValue.fields).forEach(key => {
      collectDriveFileIdsFromFirestoreValue(value.mapValue.fields[key], ids);
    });
  }
  if (value.arrayValue && Array.isArray(value.arrayValue.values)) {
    value.arrayValue.values.forEach(item => collectDriveFileIdsFromFirestoreValue(item, ids));
  }
}

function collectDriveFileIdsFromFirestoreDocument(document, ids) {
  if (!document || !document.fields) return;
  Object.keys(document.fields).forEach(key => {
    collectDriveFileIdsFromFirestoreValue(document.fields[key], ids);
  });
}

function listFirestoreHistoryDocuments(appId, requestId, idToken) {
  const authConfig = getFirebaseAuthConfig();
  const baseUrl = 'https://firestore.googleapis.com/v1/projects/' +
    encodeURIComponent(authConfig.PROJECT_ID) +
    '/databases/(default)/documents/artifacts/' + encodeURIComponent(appId) +
    '/requests/' + encodeURIComponent(requestId) + '/history';
  const documents = [];
  let pageToken = null;
  let pageCount = 0;

  do {
    const url = baseUrl + '?pageSize=100' +
      (pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : '');
    const page = fetchFirestoreJson(url, idToken, 'LIMS report history lookup', false);
    if (page && Array.isArray(page.documents)) {
      page.documents.forEach(document => documents.push(document));
    }
    pageToken = page && typeof page.nextPageToken === 'string' && page.nextPageToken
      ? page.nextPageToken
      : null;
    pageCount++;
    if (pageCount > 20) {
      throw new Error('Authorization failed: report history exceeds verification limit');
    }
  } while (pageToken);

  return documents;
}

function assertArchiveFilesBelongToRequest(files, requestId, authContext) {
  if (!authContext || !authContext.appId || !authContext.idToken) {
    throw new Error('Authorization failed: archive context missing');
  }
  const requestDocument = fetchFirestoreJson(
    getFirestoreDocumentUrl(authContext.appId, 'requests', requestId),
    authContext.idToken,
    'LIMS request lookup',
    true
  );
  if (!requestDocument) {
    throw new Error('Authorization failed: report request not found');
  }

  const allowedFileIds = {};
  collectDriveFileIdsFromFirestoreDocument(requestDocument, allowedFileIds);
  listFirestoreHistoryDocuments(authContext.appId, requestId, authContext.idToken)
    .forEach(document => collectDriveFileIdsFromFirestoreDocument(document, allowedFileIds));

  files.forEach((fileObj, index) => {
    [fileObj.pdfUrl, fileObj.docsUrl]
      .filter(value => value !== undefined && value !== null)
      .forEach(url => {
        const fileId = getFileIdFromUrl(url);
        if (!fileId || !allowedFileIds[fileId]) {
          throw new Error(`Authorization failed: files[${index}] is not referenced by request ${requestId}`);
        }
      });
  });
}

function archiveReportsAction(files, requestId, authContext) {
  validateArchiveReportsPayload({ action: 'archive_reports', requestId, files });
  assertArchiveFilesBelongToRequest(files, requestId, authContext);
  logRequestTrace('archive.start', { fileCount: files.length });

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
        logRequestTrace('archive.file-start', { artifactType: 'pdf', artifactId: pdfId });
        archiveSingleFile(pdfId);
        archiveResult.pdfArchived = true;
        logRequestTrace('archive.file-success', { artifactType: 'pdf', artifactId: pdfId });
      }
    } catch (e) {
      Logger.log('Error archiving PDF: ' + e.message);
      logRequestTrace('archive.file-error', {
        artifactType: 'pdf',
        artifactId: getFileIdFromUrl(fileObj.pdfUrl),
        error: getRequestErrorMessage(e),
      });
      archiveResult.pdfError = e.message;
    }

    try {
      const docsId = getFileIdFromUrl(fileObj.docsUrl);
      if (docsId) {
        logRequestTrace('archive.file-start', { artifactType: 'doc', artifactId: docsId });
        archiveSingleFile(docsId);
        archiveResult.docsArchived = true;
        logRequestTrace('archive.file-success', { artifactType: 'doc', artifactId: docsId });
      }
    } catch (e) {
      Logger.log('Error archiving Doc: ' + e.message);
      logRequestTrace('archive.file-error', {
        artifactType: 'doc',
        artifactId: getFileIdFromUrl(fileObj.docsUrl),
        error: getRequestErrorMessage(e),
      });
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
  const parentFolder = getLimsParentFolderForFile(file);
  const archiveFolder = getArchiveFolder(parentFolder);

  const originalName = file.getName();
  if (!originalName.startsWith('[HUY]_')) {
    file.setName('[HUY]_' + originalName);
  }

  file.moveTo(archiveFolder);
}

// ── Action: Tải file Excel MassHunter gốc lên Google Drive ─────────────
function uploadExcelAction(payload) {
  validateUploadExcelPayload(payload);
  const { requestId, fileName, fileData } = payload;
  const sopId = payload.sopId;
  logRequestTrace('upload.start', { fileName });
  const preparedFile = prepareUploadExcelFile(fileName, fileData);
  const fingerprint = buildUploadExcelFingerprint(
    sopId,
    fileName,
    preparedFile.decodedBytes
  );
  let createdFile = null;

  return executeUploadExcelIdempotently(
    requestId,
    fingerprint,
    () => {
      // Rate/quota guard phải chạy trước mọi Drive mutation của upload mới.
      // Idempotent replay trả về trước callback này nên không tiêu thêm quota.
      consumeUploadExcelQuota();

      // Tạo/lấy folder theo năm/tháng/chỉ tiêu cho mẻ chạy.
      const now = new Date();
      const folder = getOrCreateFolder(now, sopId);
      const blob = Utilities.newBlob(
        preparedFile.decodedBytes,
        preparedFile.mimeType,
        fileName
      );

      createdFile = folder.createFile(blob);
      const result = {
        fileId: createdFile.getId(),
        fileUrl: createdFile.getUrl(),
        fileName: createdFile.getName()
      };
      updateRequestTrace({ reportId: result.fileId });
      logRequestTrace('upload.file-created', { artifactId: result.fileId, fileName: result.fileName });

      Logger.log(`Excel uploaded successfully: ${fileName} | ID: ${result.fileId} in folder: ${folder.getName()}`);
      return result;
    },
    () => {
      if (createdFile) createdFile.setTrashed(true);
    }
  );
}

/**
 * Hàm chung để điền các checkbox dùng chung cho mọi SOP: Khối lượng mẫu, Loại mẫu, Tình trạng mẫu
 */
function isDetectedResultValue(value) {
  if (value === null || value === undefined) return false;
  const normalized = value.toString().trim();
  if (normalized === '') return false;
  const upper = normalized.toUpperCase();
  return upper !== 'N/A' && upper !== 'ND' && normalized !== '—';
}

function getConfiguredSampleResultKeys(sopConfig, metadata) {
  const resultKeys = new Set();

  if (sopConfig && Array.isArray(sopConfig.resultColumns)) {
    sopConfig.resultColumns.forEach(column => {
      if (column && column.key) resultKeys.add(column.key);
    });
  }

  if (metadata && metadata.targetInfo && typeof metadata.targetInfo === 'object') {
    Object.keys(metadata.targetInfo).forEach(key => resultKeys.add(key));
  }

  if (sopConfig && Array.isArray(sopConfig.compounds)) {
    sopConfig.compounds.forEach(displayName => {
      resultKeys.add(displayName);
      if (typeof COMPOUND_TO_CANONICAL !== 'undefined' && COMPOUND_TO_CANONICAL[displayName]) {
        resultKeys.add(COMPOUND_TO_CANONICAL[displayName]);
      }
    });
  }

  // Legacy single-analyte reporters use a generic result field.
  resultKeys.add('kq');
  return Array.from(resultKeys);
}

function hasDetectedSampleResult(sample, sopConfig, metadata) {
  if (!sample || typeof sample !== 'object') return false;

  const resultKeys = getConfiguredSampleResultKeys(sopConfig, metadata);
  for (const key of resultKeys) {
    if (sample[key + '_nd'] === true) continue;
    if (isDetectedResultValue(sample[key])) return true;
  }
  return false;
}

function fillCommonSampleCheckboxes(element, metadata, sample, sopConfig) {
  try {
    let khoiLuongVal = (sample.khoiLuong || metadata.khoiLuong || '10.0').toString().trim();
    
    // Nếu không phải form Đơn thì luôn ép khối lượng về 10.0g cho mọi mẻ gộp / form check
    if (metadata.printFormType !== 'formDon') {
      khoiLuongVal = '10.0';
    }
    
    let kl10Check = '☐';
    let klOtherText = '………';
    
    if (khoiLuongVal === '10.0' || khoiLuongVal === '10') {
      kl10Check = '☑';
    } else {
      klOtherText = khoiLuongVal;
    }
    
    const cbPattern = '([☑☐□N]|\\[\\s*\\]|\\(\\s*\\))';

    replaceCheckboxSafely(element, 'm\\s*=\\s*' + cbPattern, kl10Check);
    if (klOtherText !== '………') {
      replaceDotsSafely(element, '10\\.0\\s*;\\s*[…\\.]+', klOtherText);
    }
    
    // Ghi đè lại placeholder {{khoiLuong}} cho Form Đơn nếu nó tồn tại
    element.replaceText('{{khoiLuong}}', khoiLuongVal);
    // Bắt thêm case chữ m =g mà user đề cập trong bảng kết quả mẫu
    // Nếu là form check, nếu có chữ m = ........ g thì thay bằng 10.0
    if (metadata.printFormType !== 'formDon') {
      replaceDotsSafely(element, 'm\\s*=\\s*[…\\.]+', ' 10.0 ');
    }

    // --- Phân giải và xử lý Hệ số pha loãng ---
    const fVal = (sample.heSoPhaLoang || sample.hSoPhaLoang || metadata.heSoPhaLoang || '1').toString().trim();
    const isF1 = fVal === '1';
    const f1Check = isF1 ? '☑' : '☐';
    const fOtherCheck = !isF1 ? '☑' : '☐';
    
    replaceCheckboxSafely(element, 'Hệ số pha loãng:\\s*' + cbPattern, f1Check);
    replaceCheckboxSafely(element, 'f\\s*=\\s*1\\s*;\\s*' + cbPattern, fOtherCheck);
    if (!isF1) {
      replaceDotsSafely(element, 'f\\s*=\\s*[…\\.]+', fVal);
    }

    // --- Phân giải giá trị Loại mẫu ---
    const loaiMauVal = (sample.loaiMau || metadata.loaiMau || 'Thuỷ sản').toString().trim();
    
    // Các loại mẫu cũ
    let isTuoi = loaiMauVal === 'Nông sản tươi';
    let isKho = loaiMauVal === 'Nông sản khô';
    let isThuySan = (loaiMauVal === 'Thuỷ sản' || loaiMauVal === 'Thủy sản');
    
    // Các loại mẫu mới (Nước)
    let isUong = loaiMauVal === 'Uống';
    let isSanXuat = loaiMauVal === 'Sản xuất';
    let isSinhHoat = loaiMauVal === 'Sinh hoạt';
    let isNuoiTrong = loaiMauVal === 'Nuôi trồng';
    
    // Khác
    let isLmKhac = !isTuoi && !isKho && !isThuySan && !isUong && !isSanXuat && !isSinhHoat && !isNuoiTrong;
    let lmKhacText = isLmKhac ? loaiMauVal : '………';
    
    const isSopTbvtvThucPham = metadata.sopId === 'tbvtv-thuc-pham-gcmsms' || metadata.sopId === 'tbvtv-thuc-pham-gcmsms-rut-gon' || metadata.sourceSopId === 'tbvtv-thuc-pham-gcmsms';
    if (isSopTbvtvThucPham) {
      // SOP TBVTV Thực phẩm chỉ có: ☐ Thuỷ sản; ☐ Khác:............
      replaceCheckboxSafely(element, 'Loại mẫu:\\s*' + cbPattern, isThuySan ? '☑' : '☐');
      replaceCheckboxSafely(element, 'sản\\s*;\\s*' + cbPattern, isLmKhac ? '☑' : '☐');
    } else {
      // -- Xử lý Checkbox Nông sản / Thuỷ sản --
      replaceCheckboxSafely(element, 'Loại mẫu:\\s*' + cbPattern, (isTuoi || isUong) ? '☑' : '☐');
      replaceCheckboxSafely(element, 'tươi\\s*;\\s*' + cbPattern, isKho ? '☑' : '☐');
      replaceCheckboxSafely(element, 'khô\\s*;\\s*' + cbPattern, isThuySan ? '☑' : '☐');
      replaceCheckboxSafely(element, 'sản\\s*;\\s*' + cbPattern, isLmKhac ? '☑' : '☐'); // Note: 'sản' might match 'Thủy sản' if template has 'sản;'. The pattern is strict.
    }

    // -- Xử lý Checkbox Nước (TBVTV Trong Nước) --
    if (!isSopTbvtvThucPham) {
      replaceCheckboxSafely(element, 'Uống\\s*;\\s*' + cbPattern, isSanXuat ? '☑' : '☐');
      replaceCheckboxSafely(element, 'xuất\\s*;\\s*' + cbPattern, isSinhHoat ? '☑' : '☐');
      replaceCheckboxSafely(element, 'hoạt\\s*;\\s*' + cbPattern, isNuoiTrong ? '☑' : '☐');
      replaceCheckboxSafely(element, 'trồng\\s*;\\s*' + cbPattern, isLmKhac ? '☑' : '☐');
    }

    if (isLmKhac) {
      replaceDotsSafely(element, 'Khác\\s*:\\s*[…\\.]+', lmKhacText);
    }

    // --- Bổ sung xử lý V = 100.0 (TBVTV Trong Nước) ---
    let is100Checked = metadata.is100Checked === true || metadata.is100mlChecked === true || metadata.is100gChecked === true || metadata.is10gChecked === true || khoiLuongVal === '100.0' || khoiLuongVal === '100';
    let vCheck = is100Checked ? '☑' : '☐';
    let vOtherText = !is100Checked && (metadata.khoiLuongKhac || (khoiLuongVal !== '10.0' && khoiLuongVal !== '10')) ? (metadata.khoiLuongKhac || khoiLuongVal) : '………';

    replaceCheckboxSafely(element, 'V\\s*=\\s*' + cbPattern, vCheck);
    if (!is100Checked && vOtherText !== '………') {
      replaceDotsSafely(element, '100\\.0\\s*;\\s*[…\\.]+', vOtherText);
    }

    const ttMauVal = (sample.tinhTrangMau || metadata.tinhTrangMau || 'Bình thường').toString().trim();
    let isBinhThuong = ttMauVal === 'Bình thường';
    let isTtKhac = !isBinhThuong;
    let ttKhacText = isTtKhac ? ttMauVal : '………';
    
    const btCheck = isBinhThuong ? '☑' : '☐';
    const ttKhacCheck = isTtKhac ? '☑' : '☐';

    replaceCheckboxSafely(element, 'Tình trạng mẫu:\\s*' + cbPattern, btCheck);
    replaceCheckboxSafely(element, 'thường\\s*;\\s*' + cbPattern, ttKhacCheck);
    if (isTtKhac) {
      replaceDotsSafely(element, 'Khác\\s*:\\s*[…\\.]+', ttKhacText);
    }

    // Logic Phát hiện / Không phát hiện (Generic fallback if not specifically handled by SOP)
    let isPhatHien = sample.checkCoMauPhatHien === true || metadata.checkCoMauPhatHien === true;
    let isKhongPhatHien = sample.checkTatCaND === true || metadata.checkTatCaND === true;
    
    if (!isPhatHien && !isKhongPhatHien) {
      const hasAnyResult = hasDetectedSampleResult(sample, sopConfig, metadata);
      if (hasAnyResult) {
        isPhatHien = true;
      } else {
        isKhongPhatHien = true;
      }
    }
    
    const phCheck = isPhatHien ? '☑' : '☐';
    const kphCheck = isKhongPhatHien ? '☑' : '☐';

    replaceCheckboxSafely(element, cbPattern + '\\s*Phát hiện', phCheck);
    replaceCheckboxSafely(element, cbPattern + '\\s*Không phát hiện', kphCheck);

  } catch(e) {
    Logger.log('[fillCommonSampleCheckboxes][required-checkbox] Error: ' + e.toString());
    throw e;
  }
}
