import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireBackupAuthorization, writeBackupAuditLog } from '../_lib/backup-auth.js';
import { getBackupDriveAccess, DriveBackupClient } from '../_lib/backup-drive.js';
import { backupEncryptionKey } from '../_lib/backup-crypto.js';
import { verifyBackup } from '../_lib/backup-restore.js';

function requestedFolderId(req: VercelRequest): string {
  if (typeof req.body === 'object' && req.body && typeof (req.body as Record<string, unknown>)['backupFolderId'] === 'string') {
    return ((req.body as Record<string, unknown>)['backupFolderId'] as string).trim();
  }
  if (typeof req.body === 'string') {
    try {
      const body = JSON.parse(req.body) as Record<string, unknown>;
      return typeof body['backupFolderId'] === 'string' ? body['backupFolderId'].trim() : '';
    } catch {
      return '';
    }
  }
  return typeof req.query['backupFolderId'] === 'string' ? req.query['backupFolderId'].trim() : '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Allow', 'POST,GET,OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const authorization = await requireBackupAuthorization(req, res, 'backup_verify');
  if (!authorization) return;
  const backupFolderId = requestedFolderId(req);
  if (!/^[A-Za-z0-9_-]+$/.test(backupFolderId)) return res.status(400).json({ error: 'backupFolderId không hợp lệ.' });
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup.' });
    const result = await verifyBackup(new DriveBackupClient(access.accessToken), backupFolderId, backupEncryptionKey());
    let auditLogged = true;
    try {
      await writeBackupAuditLog(authorization, 'BACKUP_VERIFY', `Kiểm tra integrity backup ${backupFolderId}: ${result.verified ? 'đạt' : 'không đạt'}.`, {
        backupFolderId,
        verified: result.verified,
        checkedParts: result.checkedParts,
        checkedAssets: result.checkedAssets,
        checkedBytes: result.checkedBytes,
        errors: result.errors.length,
      });
    } catch (error) {
      auditLogged = false;
      console.warn('[BackupVerify] Audit log failed:', error instanceof Error ? error.message : error);
    }
    const warnings = auditLogged ? result.warnings : [...result.warnings, 'Không ghi được audit log kiểm tra backup; cần kiểm tra quyền ghi Firestore logs.'];
    return res.status(result.verified ? 200 : 422).json({ success: result.verified, auditLogged, ...result, warnings });
  } catch (error) {
    console.error('[BackupVerify] Failed:', error instanceof Error ? error.message : error);
    return res.status(422).json({ success: false, error: error instanceof Error ? error.message : 'Backup không hợp lệ.' });
  }
}
