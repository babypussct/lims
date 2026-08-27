import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireBackupAuthorization, writeBackupAuditLog } from '../_lib/backup-auth.js';
import { getBackupDriveAccess, backupDriveFolderId, DriveBackupClient } from '../_lib/backup-drive.js';
import { runBackup } from '../_lib/backup-engine.js';

function bodyObject(req: VercelRequest): Record<string, unknown> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body) as unknown;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Allow', 'POST,OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const authorization = await requireBackupAuthorization(req, res, 'backup_create');
  if (!authorization) return;
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup. Hãy đăng nhập Google hoặc cấu hình refresh token dành riêng cho backup.' });
    const body = bodyObject(req);
    const releaseVersion = typeof body['releaseVersion'] === 'string'
      ? body['releaseVersion'].trim().slice(0, 120)
      : undefined;
    const client = new DriveBackupClient(access.accessToken);
    const result = await runBackup({
      db: authorization.db,
      client,
      actor: authorization.actor,
      projectId: typeof authorization.decoded.aud === 'string' ? authorization.decoded.aud : String(authorization.decoded.aud || ''),
      releaseVersion: releaseVersion || undefined,
      backupParentFolderId: backupDriveFolderId(),
    });
    const manifest = result.manifest;
    let auditLogged = true;
    try {
      await writeBackupAuditLog(authorization, 'BACKUP_CREATE', `Tạo backup ${manifest.backupId} với trạng thái ${manifest.status}.`, {
        backupId: manifest.backupId,
        status: manifest.status,
        firestoreDocuments: manifest.firestore.totalDocuments,
        authUsers: manifest.auth.userCount,
        driveAssets: manifest.drive.assetCount,
        driveFolders: manifest.drive.folderCount,
      });
    } catch (error) {
      auditLogged = false;
      console.warn('[BackupCreate] Audit log failed:', error instanceof Error ? error.message : error);
    }
    const warnings = auditLogged ? manifest.warnings : [...manifest.warnings, 'Không ghi được audit log backup; cần kiểm tra quyền ghi Firestore logs.'];
    return res.status(result.manifest.status === 'FAILED' ? 422 : 200).json({
      success: manifest.status !== 'FAILED',
      backupId: manifest.backupId,
      backupFolderId: result.backupFolderId,
      manifestFileId: result.manifestFileId,
      status: manifest.status,
      verified: manifest.verification?.status === 'PASSED',
      summary: {
        firestoreDocuments: manifest.firestore.totalDocuments,
        firestoreCollections: manifest.firestore.pathCounts.length,
        authUsers: manifest.auth.userCount,
        driveAssets: manifest.drive.assetCount,
        driveFolders: manifest.drive.folderCount,
        warnings: manifest.warnings.length,
        errors: manifest.errors.length,
      },
      quotaUsage: manifest.quotaUsage,
      auditLogged,
      warnings,
      errors: manifest.errors,
    });
  } catch (error) {
    console.error('[BackupCreate] Failed:', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Không thể tạo backup.' });
  }
}
