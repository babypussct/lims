const DRIVE_HOST = 'drive.google.com';
const DRIVE_DOWNLOAD_HOST = 'drive.usercontent.google.com';
const DOCS_HOST = 'docs.google.com';
const GOOGLE_ID_RE = /^[A-Za-z0-9_-]{10,}$/;

function parseHttpsUrl(raw: string | null | undefined): URL | null {
  if (!raw || typeof raw !== 'string') return null;
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return null;
    return parsed;
  } catch {
    return null;
  }
}

function normalizeGoogleId(id: string | null | undefined): string | null {
  if (!id || !GOOGLE_ID_RE.test(id)) return null;
  return id;
}

function getDriveFileId(url: URL): string | null {
  if (url.hostname === DRIVE_HOST) {
    const pathMatch = url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)(?:\/|$)/);
    if (pathMatch) return normalizeGoogleId(pathMatch[1]);

    if (url.pathname === '/open' || url.pathname === '/uc' || url.pathname === '/file/d') {
      return normalizeGoogleId(url.searchParams.get('id'));
    }
  }

  if (url.hostname === DRIVE_DOWNLOAD_HOST && url.pathname === '/download') {
    return normalizeGoogleId(url.searchParams.get('id'));
  }

  return null;
}

function getDocsDocumentId(url: URL): string | null {
  if (url.hostname !== DOCS_HOST) return null;
  const pathMatch = url.pathname.match(/^\/document\/d\/([A-Za-z0-9_-]+)(?:\/|$)/);
  return pathMatch ? normalizeGoogleId(pathMatch[1]) : null;
}

/**
 * Canonical allow-list for report links persisted by the application.
 * Invalid schemes, hosts and malformed Google IDs are rejected as an empty URL.
 */
export function getSafeGoogleUrl(
  raw: string | null | undefined,
  type: 'pdf' | 'doc'
): string {
  const parsed = parseHttpsUrl(raw);
  if (!parsed) return '';

  if (type === 'doc') {
    const docId = getDocsDocumentId(parsed);
    return docId ? `https://${DOCS_HOST}/document/d/${docId}/preview` : '';
  }

  const fileId = getDriveFileId(parsed);
  return fileId ? `https://${DRIVE_HOST}/file/d/${fileId}/view` : '';
}

/** Safe iframe URL for Google Drive PDFs or Google Docs documents. */
export function getSafeGooglePreviewUrl(raw: string | null | undefined): string {
  const parsed = parseHttpsUrl(raw);
  if (!parsed) return '';

  const docId = getDocsDocumentId(parsed);
  if (docId) return `https://${DOCS_HOST}/document/d/${docId}/preview`;

  const fileId = getDriveFileId(parsed);
  if (fileId) return `https://${DRIVE_HOST}/file/d/${fileId}/preview`;

  return '';
}

export function sanitizeReportMapUrls<T extends Record<string, any> | undefined>(reports: T): T {
  if (!reports || typeof reports !== 'object') return reports;
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(reports)) {
    if (!value || typeof value !== 'object') {
      sanitized[key] = value;
      continue;
    }
    sanitized[key] = {
      ...value,
      pdfUrl: value.pdfUrl == null ? value.pdfUrl : getSafeGoogleUrl(value.pdfUrl, 'pdf'),
      pdfViewUrl: value.pdfViewUrl == null ? value.pdfViewUrl : getSafeGoogleUrl(value.pdfViewUrl, 'pdf'),
      docsUrl: value.docsUrl == null ? value.docsUrl : getSafeGoogleUrl(value.docsUrl, 'doc'),
    };
  }
  return sanitized as T;
}
