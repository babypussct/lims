import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireBackupAuthorization } from '../_lib/backup-auth.js';
import { backupEncryptionKey } from '../_lib/backup-crypto.js';
import { DriveBackupClient, getBackupDriveAccess } from '../_lib/backup-drive.js';
import { loadBackupManifest } from '../_lib/backup-restore.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Allow', 'GET');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const authorization = await requireBackupAuthorization(req, res, 'backup_verify');
  if (!authorization) return;
  const backupFolderId = typeof req.query['backupFolderId'] === 'string' ? req.query['backupFolderId'].trim() : '';
  if (!/^[A-Za-z0-9_-]+$/.test(backupFolderId)) return res.status(400).json({ error: 'backupFolderId không hợp lệ.' });
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup.' });
    const loaded = await loadBackupManifest(new DriveBackupClient(access.accessToken), backupFolderId, backupEncryptionKey());
    return res.status(200).json(loaded);
  } catch (error) {
    console.error('[BackupInspect] Failed:', error instanceof Error ? error.message : error);
    return res.status(422).json({ error: error instanceof Error ? error.message : 'Không thể đọc manifest backup.' });
  }
}
