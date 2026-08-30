import { backupDriveFolderId, DriveBackupClient, type DriveFileMetadata } from './backup-drive.js';

export const BACKUP_FOLDER_NAME_PREFIX = 'LIMS_BACKUP_';

export interface BackupRetentionItem {
  id: string;
  name: string;
}

export interface BackupRetentionFailure extends BackupRetentionItem {
  error: string;
}

export interface BackupRetentionResult {
  applied: boolean;
  keepBackupFolderId: string;
  scanned: number;
  trashed: BackupRetentionItem[];
  failed: BackupRetentionFailure[];
  warnings: string[];
}

function emptyResult(keepBackupFolderId: string, warning?: string): BackupRetentionResult {
  return {
    applied: false,
    keepBackupFolderId,
    scanned: 0,
    trashed: [],
    failed: [],
    warnings: warning ? [warning] : [],
  };
}

function isBackupFolder(item: DriveFileMetadata): boolean {
  return item.mimeType === 'application/vnd.google-apps.folder'
    && item.name.startsWith(BACKUP_FOLDER_NAME_PREFIX);
}

/**
 * Keep the newly verified backup as the only active backup folder.
 *
 * The function fails closed: it will not trash anything unless the folder to
 * keep is present as a direct child of the configured backup root and has the
 * expected LIMS backup prefix. Individual trash failures are collected so one
 * stale/permission-blocked folder does not prevent the remaining safe cleanup.
 */
export async function retainOnlyVerifiedBackup(
  client: DriveBackupClient,
  keepBackupFolderId: string,
  parentFolderId = backupDriveFolderId(),
): Promise<BackupRetentionResult> {
  let children: DriveFileMetadata[];
  try {
    children = await client.listChildren(parentFolderId);
  } catch (error) {
    return emptyResult(
      keepBackupFolderId,
      `Không thể đọc danh sách backup để áp dụng retention: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const current = children.find(item => item.id === keepBackupFolderId);
  if (!current || !isBackupFolder(current)) {
    return emptyResult(
      keepBackupFolderId,
      'Không xác nhận được backup vừa verify là thư mục con hợp lệ của kho backup; không dọn các bản cũ.',
    );
  }

  const candidates = children
    .filter(item => item.id !== keepBackupFolderId && isBackupFolder(item))
    .sort((left, right) => left.name.localeCompare(right.name));
  const result: BackupRetentionResult = {
    applied: true,
    keepBackupFolderId,
    scanned: candidates.length,
    trashed: [],
    failed: [],
    warnings: [],
  };

  for (const candidate of candidates) {
    try {
      await client.trashFile(candidate.id);
      result.trashed.push({ id: candidate.id, name: candidate.name });
    } catch (error) {
      const failure = {
        id: candidate.id,
        name: candidate.name,
        error: error instanceof Error ? error.message : String(error),
      };
      result.failed.push(failure);
      result.warnings.push(`Không đưa được backup cũ ${candidate.name} vào Thùng rác: ${failure.error}`);
    }
  }

  return result;
}
