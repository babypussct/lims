import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireBackupAuthorization } from '../_lib/backup-auth.js';
import { backupDriveFolderId, DriveBackupClient, getBackupDriveAccess } from '../_lib/backup-drive.js';
import { listRestoreCheckpoints, loadBackupManifest } from '../_lib/backup-restore.js';
import { backupEncryptionKey } from '../_lib/backup-crypto.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Allow', 'GET');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const authorization = await requireBackupAuthorization(req, res, 'backup_verify');
  if (!authorization) return;
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup.' });
    const key = backupEncryptionKey();
    const client = new DriveBackupClient(access.accessToken);
    const children = await client.listChildren(backupDriveFolderId());
    const backupFolders = children
      .filter(item => item.mimeType === 'application/vnd.google-apps.folder' && item.name.startsWith('LIMS_BACKUP_'))
      .sort((left, right) => String(right.createdTime || '').localeCompare(String(left.createdTime || '')))
      .slice(0, 50);
    const backups = [];
    for (const folder of backupFolders) {
      try {
        const loaded = await loadBackupManifest(client, folder.id, key);
        const manifest = loaded.manifest;
        const restoreCheckpoints = await listRestoreCheckpoints(client, folder.id, manifest.backupId, key);
        backups.push({
          backupId: manifest.backupId,
          backupFolderId: folder.id,
          manifestFileId: loaded.manifestFileId,
          status: manifest.status,
          verified: manifest.verification?.status === 'PASSED',
          createdTime: folder.createdTime,
          completedAt: manifest.completedAt,
          projectId: manifest.projectId,
          releaseVersion: manifest.releaseVersion,
          firestoreDocuments: manifest.firestore.totalDocuments,
          authUsers: manifest.auth.userCount,
          driveAssets: manifest.drive.assetCount,
          driveFolders: manifest.drive.folderCount,
          warnings: manifest.warnings.length,
          errors: manifest.errors.length,
          restoreCheckpoints,
        });
      } catch (error) {
        backups.push({
          backupId: folder.name,
          backupFolderId: folder.id,
          manifestFileId: null,
          status: 'INVALID',
          verified: false,
          createdTime: folder.createdTime,
          completedAt: null,
          projectId: null,
          releaseVersion: null,
          firestoreDocuments: null,
          authUsers: null,
          driveAssets: null,
          driveFolders: null,
          warnings: 0,
          errors: 1,
          error: error instanceof Error ? error.message : 'Không đọc được manifest.',
        });
      }
    }
    return res.status(200).json({ backups });
  } catch (error) {
    console.error('[BackupList] Failed:', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Không thể đọc danh sách backup.' });
  }
}
