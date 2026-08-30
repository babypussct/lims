import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import { BACKUP_APPS_SCRIPT_SCOPES, getValidGoogleSession } from './google-oauth.js';
import { safeBackupName } from './backup-contract.js';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';
const APPS_SCRIPT_API = 'https://script.googleapis.com/v1';
const GOOGLE_WORKSPACE_MIME_PREFIX = 'application/vnd.google-apps.';

export interface DriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  modifiedTime?: string;
  createdTime?: string;
  size?: string;
  trashed?: boolean;
  md5Checksum?: string;
  webViewLink?: string;
}

export interface DrivePermission {
  id?: string;
  type?: string;
  role?: string;
  emailAddress?: string;
  domain?: string;
  allowFileDiscovery?: boolean;
}

export interface DriveAccess {
  accessToken: string;
  source: 'browser-session' | 'refresh-token';
  scope?: string;
}

export interface DriveClientStats {
  apiRequests: number;
  bytesUploaded: number;
}

export interface DriveStorageQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`${name} is not configured.`);
  return value.trim();
}

function configuredValue(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function backupDriveFolderId(): string {
  return requiredEnv('LIMS_BACKUP_DRIVE_FOLDER_ID');
}

export function driveSourceFolderIds(): string[] {
  return [...new Set((configuredValue('LIMS_DRIVE_SOURCE_FOLDER_IDS', 'LIMS_DRIVE_ROOT_FOLDER_ID', 'GOOGLE_DRIVE_FOLDER_ID') || '')
    .split(',')
    .map(value => value.trim())
    .filter(value => /^[A-Za-z0-9_-]+$/.test(value)))];
}

export function driveTemplateIds(): string[] {
  return [...new Set((configuredValue('LIMS_DRIVE_TEMPLATE_IDS') || '')
    .split(',')
    .map(value => value.trim())
    .filter(value => /^[A-Za-z0-9_-]+$/.test(value)))];
}

export async function getBackupDriveAccess(req: VercelRequest, res: VercelResponse): Promise<DriveAccess | null> {
  let browserAccess: DriveAccess | undefined;
  try {
    const session = await getValidGoogleSession(req, res);
    const scopes = new Set((session?.scope || '').split(/\s+/).filter(Boolean));
    // drive.file is sufficient for the normal report uploader but cannot
    // enumerate arbitrary pre-existing CoA/template files. Backup therefore
    // accepts only a full Drive grant in the browser session.
    if (session?.accessToken && scopes.has('https://www.googleapis.com/auth/drive')) {
      browserAccess = { accessToken: session.accessToken, source: 'browser-session', scope: session.scope };
      // A browser session that can enumerate Drive but cannot read the live
      // Apps Script project must not shadow a correctly scoped server token.
      // Prefer the browser token only when it proves the complete backup
      // surface; otherwise keep it as a final fallback for Drive-only status.
      if (BACKUP_APPS_SCRIPT_SCOPES.every(scope => scopes.has(scope))) return browserAccess;
    }
  } catch (error) {
    console.warn('[BackupDrive] Browser Drive session unavailable:', error instanceof Error ? error.message : error);
  }

  const refreshToken = configuredValue('LIMS_BACKUP_DRIVE_REFRESH_TOKEN', 'GOOGLE_DRIVE_BACKUP_REFRESH_TOKEN');
  if (!refreshToken) return browserAccess || null;
  const clientId = requiredEnv('GOOGLE_OAUTH_CLIENT_ID');
  const clientSecret = requiredEnv('GOOGLE_OAUTH_CLIENT_SECRET');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const payload = await response.json().catch(() => ({})) as { access_token?: string; scope?: string; error_description?: string };
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || `Drive refresh token failed (${response.status}).`);
  }
  return { accessToken: payload.access_token, source: 'refresh-token', scope: payload.scope };
}

export class DriveBackupClient {
  readonly stats: DriveClientStats = { apiRequests: 0, bytesUploaded: 0 };

  constructor(private readonly accessToken: string) {}

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    this.stats.apiRequests++;
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${this.accessToken}`);
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    const response = await fetch(path.startsWith('http') ? path : `${DRIVE_API}${path}`, { ...init, headers });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Google Drive API ${response.status}: ${body.slice(0, 400)}`);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  /**
   * Apps Script is a separate Google API surface. Keeping it on the same
   * access client lets a single administrator backup prove both the checked-in
   * bundle and the live project/deployment state without storing OAuth tokens.
   */
  async appsScriptRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
    this.stats.apiRequests++;
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${this.accessToken}`);
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    const response = await fetch(path.startsWith('http') ? path : `${APPS_SCRIPT_API}${path}`, { ...init, headers });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Google Apps Script API ${response.status}: ${body.slice(0, 400)}`);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  async getAppsScriptProject(scriptId: string): Promise<Record<string, unknown>> {
    return this.appsScriptRequest<Record<string, unknown>>(`/projects/${encodeURIComponent(scriptId)}`);
  }

  async getAppsScriptProjectContent(scriptId: string): Promise<Record<string, unknown>> {
    return this.appsScriptRequest<Record<string, unknown>>(`/projects/${encodeURIComponent(scriptId)}/content`);
  }

  async listAppsScriptDeployments(scriptId: string): Promise<Array<Record<string, unknown>>> {
    const result: Array<Record<string, unknown>> = [];
    let pageToken = '';
    do {
      const params = new URLSearchParams({ pageSize: '50' });
      if (pageToken) params.set('pageToken', pageToken);
      const page = await this.appsScriptRequest<{ deployments?: Array<Record<string, unknown>>; nextPageToken?: string }>(
        `/projects/${encodeURIComponent(scriptId)}/deployments?${params.toString()}`,
      );
      result.push(...(page.deployments || []));
      pageToken = page.nextPageToken || '';
    } while (pageToken);
    return result;
  }

  async getMetadata(fileId: string): Promise<DriveFileMetadata> {
    const fields = 'id,name,mimeType,parents,modifiedTime,createdTime,size,trashed,md5Checksum,webViewLink';
    return this.request<DriveFileMetadata>(`/files/${encodeURIComponent(fileId)}?fields=${encodeURIComponent(fields)}&supportsAllDrives=true`);
  }

  /**
   * A deleted Drive object returns 404, while permission/rate-limit failures
   * must still surface. This helper is used by restore to distinguish the two
   * cases without hiding operational errors.
   */
  async tryGetMetadata(fileId: string): Promise<DriveFileMetadata | null> {
    try {
      return await this.getMetadata(fileId);
    } catch (error) {
      if (error instanceof Error && /Google Drive API 404\b/.test(error.message)) return null;
      throw error;
    }
  }

  async listPermissions(fileId: string): Promise<DrivePermission[]> {
    const fields = 'permissions(id,type,role,emailAddress,domain,allowFileDiscovery)';
    const result = await this.request<{ permissions?: DrivePermission[] }>(`/files/${encodeURIComponent(fileId)}?fields=${encodeURIComponent(fields)}&supportsAllDrives=true`);
    return result.permissions || [];
  }

  async getStorageQuota(): Promise<DriveStorageQuota> {
    const result = await this.request<{ storageQuota?: DriveStorageQuota }>('/about?fields=storageQuota');
    return result.storageQuota || {};
  }

  async createFolder(name: string, parentId: string): Promise<DriveFileMetadata> {
    return this.request<DriveFileMetadata>('/files?supportsAllDrives=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: safeBackupName(name),
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      }),
    });
  }

  async listChildren(parentId: string): Promise<DriveFileMetadata[]> {
    const result: DriveFileMetadata[] = [];
    let pageToken = '';
    do {
      const params = new URLSearchParams({
        q: `'${parentId}' in parents and trashed = false`,
        pageSize: '1000',
        fields: 'nextPageToken,files(id,name,mimeType,parents,modifiedTime,createdTime,size,trashed,md5Checksum,webViewLink)',
        spaces: 'drive',
        includeItemsFromAllDrives: 'true',
        supportsAllDrives: 'true',
      });
      if (pageToken) params.set('pageToken', pageToken);
      const page = await this.request<{ files?: DriveFileMetadata[]; nextPageToken?: string }>(`/files?${params.toString()}`);
      result.push(...(page.files || []));
      pageToken = page.nextPageToken || '';
    } while (pageToken);
    return result;
  }

  async copyFile(fileId: string, parentId: string, name: string): Promise<DriveFileMetadata> {
    return this.request<DriveFileMetadata>(`/files/${encodeURIComponent(fileId)}/copy?supportsAllDrives=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: safeBackupName(name), parents: [parentId] }),
    });
  }

  async restoreTrashedFile(fileId: string): Promise<DriveFileMetadata> {
    return this.request<DriveFileMetadata>(`/files/${encodeURIComponent(fileId)}?supportsAllDrives=true`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trashed: false }),
    });
  }

  /**
   * Move a backup folder to Drive trash. Retention uses trash instead of a
   * permanent delete so an administrator can recover a backup during Drive's
   * retention window if a rotation was triggered by mistake.
   */
  async trashFile(fileId: string): Promise<DriveFileMetadata> {
    return this.request<DriveFileMetadata>(`/files/${encodeURIComponent(fileId)}?supportsAllDrives=true`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trashed: true }),
    });
  }

  async download(fileId: string): Promise<Buffer> {
    this.stats.apiRequests++;
    const response = await fetch(`${DRIVE_API}/files/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Google Drive download ${response.status}: ${body.slice(0, 400)}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async exportFile(fileId: string, mimeType: string): Promise<Buffer> {
    this.stats.apiRequests++;
    const response = await fetch(`${DRIVE_API}/files/${encodeURIComponent(fileId)}/export?mimeType=${encodeURIComponent(mimeType)}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Google Drive export ${response.status}: ${body.slice(0, 400)}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async uploadBytes(name: string, mimeType: string, parentId: string, content: Buffer): Promise<DriveFileMetadata> {
    const metadata = { name: safeBackupName(name), parents: [parentId], mimeType };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: mimeType }));
    this.stats.apiRequests++;
    const response = await fetch(`${DRIVE_UPLOAD_API}?uploadType=multipart&supportsAllDrives=true&fields=${encodeURIComponent('id,name,mimeType,parents,size,md5Checksum,modifiedTime')}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.accessToken}` },
      body: form,
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Google Drive upload ${response.status}: ${body.slice(0, 400)}`);
    }
    this.stats.bytesUploaded += content.byteLength;
    return response.json() as Promise<DriveFileMetadata>;
  }

  async updateBytes(fileId: string, mimeType: string, content: Buffer): Promise<DriveFileMetadata> {
    this.stats.apiRequests++;
    const response = await fetch(`${DRIVE_UPLOAD_API}/${encodeURIComponent(fileId)}?uploadType=media&supportsAllDrives=true&fields=${encodeURIComponent('id,name,mimeType,parents,size,md5Checksum,modifiedTime')}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': mimeType,
      },
      body: content,
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Google Drive update ${response.status}: ${body.slice(0, 400)}`);
    }
    this.stats.bytesUploaded += content.byteLength;
    return response.json() as Promise<DriveFileMetadata>;
  }

  async uploadJson(name: string, parentId: string, value: unknown): Promise<DriveFileMetadata> {
    return this.uploadBytes(name, 'application/json', parentId, Buffer.from(JSON.stringify(value), 'utf8'));
  }

  static isWorkspaceFile(mimeType: string): boolean {
    return mimeType.startsWith(GOOGLE_WORKSPACE_MIME_PREFIX);
  }

  static exportSpec(mimeType: string): { mimeType: string; extension: string } | null {
    if (mimeType === 'application/vnd.google-apps.document') return { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extension: 'docx' };
    if (mimeType === 'application/vnd.google-apps.spreadsheet') return { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extension: 'xlsx' };
    if (mimeType === 'application/vnd.google-apps.presentation') return { mimeType: 'application/pdf', extension: 'pdf' };
    if (mimeType === 'application/vnd.google-apps.drawing') return { mimeType: 'image/png', extension: 'png' };
    return null;
  }
}

export function sha256Buffer(value: Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

export function parseDriveFileId(value: string): string | null {
  const patterns = [
    /drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/i,
    /docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/([A-Za-z0-9_-]+)/i,
    /[?&](?:id|fileId)=([A-Za-z0-9_-]+)/i,
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return match[1];
  }
  return null;
}
