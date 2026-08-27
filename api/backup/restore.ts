import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireBackupAuthorization, writeBackupAuditLog } from '../_lib/backup-auth.js';
import { getBackupDriveAccess, DriveBackupClient } from '../_lib/backup-drive.js';
import { backupEncryptionKey } from '../_lib/backup-crypto.js';
import { runRestore, verifyBackup } from '../_lib/backup-restore.js';
import type { RestoreMode } from '../_lib/backup-contract.js';

const RESTORE_MODES = new Set<RestoreMode>(['DRY_RUN', 'RECOVER_MISSING', 'RESTORE_SELECTED', 'FULL_REPLACE']);

function bodyObject(req: VercelRequest): Record<string, unknown> {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try {
      const value = JSON.parse(req.body) as unknown;
      return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
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
  const authorization = await requireBackupAuthorization(req, res, 'backup_restore');
  if (!authorization) return;
  const body = bodyObject(req);
  const backupFolderId = typeof body['backupFolderId'] === 'string' ? body['backupFolderId'].trim() : '';
  const mode = typeof body['mode'] === 'string' ? body['mode'] as RestoreMode : 'DRY_RUN';
  if (!/^[A-Za-z0-9_-]+$/.test(backupFolderId)) return res.status(400).json({ error: 'backupFolderId không hợp lệ.' });
  if (!RESTORE_MODES.has(mode)) return res.status(400).json({ error: 'Restore mode không hợp lệ.' });
  const selectedPaths = Array.isArray(body['selectedPaths'])
    ? body['selectedPaths'].filter((value): value is string => typeof value === 'string').map(value => value.trim()).filter(Boolean).slice(0, 100)
    : [];
  const resumeRestoreId = typeof body['resumeRestoreId'] === 'string' ? body['resumeRestoreId'].trim() : '';
  if (resumeRestoreId && !/^rst_[A-Za-z0-9_-]+$/.test(resumeRestoreId)) return res.status(400).json({ error: 'resumeRestoreId không hợp lệ.' });
  if (mode === 'RESTORE_SELECTED' && !selectedPaths.length) return res.status(400).json({ error: 'RESTORE_SELECTED cần selectedPaths.' });
  if (mode === 'FULL_REPLACE' && body['confirmation'] !== 'FULL_REPLACE_LIMS') {
    return res.status(400).json({ error: 'FULL_REPLACE cần confirmation = FULL_REPLACE_LIMS.' });
  }
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup.' });
    const key = backupEncryptionKey();
    const client = new DriveBackupClient(access.accessToken);
    if (mode === 'FULL_REPLACE') {
      const preRestoreBackupFolderId = typeof body['preRestoreBackupFolderId'] === 'string' ? body['preRestoreBackupFolderId'].trim() : '';
      if (!/^[A-Za-z0-9_-]+$/.test(preRestoreBackupFolderId) || preRestoreBackupFolderId === backupFolderId) {
        return res.status(400).json({ error: 'FULL_REPLACE cần một backup dự phòng khác và đã kiểm tra integrity.' });
      }
      const preflight = await verifyBackup(client, preRestoreBackupFolderId, key);
      if (!preflight.verified) return res.status(422).json({ success: false, error: 'Backup dự phòng không đạt integrity.', verification: preflight });
    }
    const report = await runRestore({
      db: authorization.db,
      client,
      backupFolderId,
      mode,
      selectedPaths,
      confirmation: typeof body['confirmation'] === 'string' ? body['confirmation'] : undefined,
      projectId: typeof authorization.decoded.aud === 'string' ? authorization.decoded.aud : String(authorization.decoded.aud || ''),
      key,
      restoreDrive: body['restoreDrive'] !== false,
      restoreAuth: body['restoreAuth'] !== false,
      replaceAuth: body['replaceAuth'] === true,
      resumeRestoreId: resumeRestoreId || undefined,
    });
    const success = report.auth.errors.length === 0;
    let auditLogged = true;
    try {
      await writeBackupAuditLog(authorization, 'BACKUP_RESTORE', `Restore backup ${report.backupId} theo chế độ ${report.mode}.`, {
        backupId: report.backupId,
        mode: report.mode,
        firestore: report.firestore,
        auth: {
          scanned: report.auth.scanned,
          imported: report.auth.imported,
          updated: report.auth.updated,
          failed: report.auth.failed,
        },
        drive: {
          scanned: report.drive.scanned,
          recreated: report.drive.recreated,
          restoredFromTrash: report.drive.restoredFromTrash,
          failed: report.drive.failed,
        },
      });
    } catch (error) {
      auditLogged = false;
      console.warn('[BackupRestore] Audit log failed:', error instanceof Error ? error.message : error);
      report.warnings.push('Không ghi được audit log restore; cần kiểm tra quyền ghi Firestore logs.');
    }
    return res.status(success ? 200 : 422).json({ success, auditLogged, report });
  } catch (error) {
    console.error('[BackupRestore] Failed:', error instanceof Error ? error.message : error);
    return res.status(422).json({ success: false, error: error instanceof Error ? error.message : 'Restore không hoàn tất.' });
  }
}
