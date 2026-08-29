import { encryptBackupPayload, sha256, type BackupKey } from './backup-crypto.js';
import type { DriveAssetManifest } from './backup-contract.js';
import { safeBackupName } from './backup-contract.js';
import { DriveBackupClient, sha256Buffer, type DriveFileMetadata } from './backup-drive.js';

export interface DriveReference {
  fileId: string;
  referencedBy: Set<string>;
}

export interface DriveFolderManifest {
  sourceFolderId: string;
  name: string;
  parentIds: string[];
  status: 'BACKED_UP' | 'INACCESSIBLE';
  error?: string;
}

export interface DriveBackupResult {
  assets: DriveAssetManifest[];
  folders: DriveFolderManifest[];
  warnings: string[];
  errors: string[];
}

export interface DriveBackupPlan {
  folders: DriveFolderManifest[];
  files: Array<{ fileId: string; referencedBy: string[] }>;
  errors: string[];
}

export interface DriveAssetBackupOutcome {
  asset: DriveAssetManifest;
  warnings: string[];
  errors: string[];
}

const DRIVE_READ_RETRY_LIMIT = 3;

function driveReadRetryBaseMs(): number {
  const raw = process.env['LIMS_BACKUP_DRIVE_RETRY_BASE_MS'];
  if (!raw) return 250;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0 || value > 5_000) {
    throw new Error('LIMS_BACKUP_DRIVE_RETRY_BASE_MS phải là số nguyên từ 0 đến 5000.');
  }
  return value;
}

function isTransientDriveReadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /Google Drive (?:API|download|export) (?:429|5\d\d)\b/.test(error.message);
}

async function withDriveReadRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= DRIVE_READ_RETRY_LIMIT; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isTransientDriveReadError(error) || attempt === DRIVE_READ_RETRY_LIMIT) throw error;
      const delayMs = driveReadRetryBaseMs() * (2 ** (attempt - 1));
      if (delayMs > 0) await new Promise<void>(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

function extensionForMime(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'xlsx';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'text/plain') return 'txt';
  return 'bin';
}

async function descendants(
  client: DriveBackupClient,
  rootId: string,
  folderMap: Map<string, DriveFileMetadata>,
  visited: Set<string>,
  result: DriveFolderManifest[],
  errors: string[],
): Promise<void> {
  if (visited.has(rootId)) return;
  visited.add(rootId);
  try {
    const root = await client.getMetadata(rootId);
    if (root.mimeType !== 'application/vnd.google-apps.folder') {
      errors.push(`Drive source ${rootId} is not a folder.`);
      return;
    }
    folderMap.set(root.id, root);
    result.push({ sourceFolderId: root.id, name: root.name, parentIds: root.parents || [], status: 'BACKED_UP' });
    for (const child of await client.listChildren(rootId)) {
      if (child.mimeType === 'application/vnd.google-apps.folder') {
        // A deployment may place the backup folder below the report root.
        // Never recurse into current or previous backup trees, otherwise a
        // backup can accidentally back up its own encrypted parts.
        if (child.name.startsWith('LIMS_BACKUP_')) continue;
        await descendants(client, child.id, folderMap, visited, result, errors);
      } else {
        folderMap.set(child.id, child);
      }
    }
  } catch (error) {
    errors.push(`Cannot enumerate Drive folder ${rootId}: ${error instanceof Error ? error.message : String(error)}`);
    result.push({ sourceFolderId: rootId, name: rootId, parentIds: [], status: 'INACCESSIBLE', error: String(error) });
  }
}

function uniqueFileMap(
  references: Map<string, DriveReference>,
  folders: Map<string, DriveFileMetadata>,
  templateIds: string[],
  appsScriptIds: string[],
): Map<string, DriveReference> {
  const result = new Map<string, DriveReference>();
  for (const [id, reference] of references) result.set(id, { fileId: id, referencedBy: new Set(reference.referencedBy) });
  for (const [id, metadata] of folders) {
    if (metadata.mimeType === 'application/vnd.google-apps.folder') continue;
    if (!result.has(id)) result.set(id, { fileId: id, referencedBy: new Set() });
  }
  for (const templateId of templateIds) {
    const existing = result.get(templateId) || { fileId: templateId, referencedBy: new Set<string>() };
    existing.referencedBy.add('deployment.template');
    result.set(templateId, existing);
  }
  for (const scriptId of appsScriptIds) {
    const existing = result.get(scriptId) || { fileId: scriptId, referencedBy: new Set<string>() };
    existing.referencedBy.add('deployment.apps-script');
    result.set(scriptId, existing);
  }
  return result;
}

/** Enumerate the complete configured Drive surface before any asset upload. */
export async function collectDriveBackupPlan(
  client: DriveBackupClient,
  references: Map<string, DriveReference>,
  sourceFolderIds: string[],
  templateIds: string[],
  appsScriptIds: string[] = [],
): Promise<DriveBackupPlan> {
  const folders = new Map<string, DriveFileMetadata>();
  const folderManifest: DriveFolderManifest[] = [];
  const errors: string[] = [];
  const visitedFolders = new Set<string>();
  for (const folderId of sourceFolderIds) {
    await descendants(client, folderId, folders, visitedFolders, folderManifest, errors);
  }
  const files = uniqueFileMap(references, folders, templateIds, appsScriptIds);
  return {
    folders: folderManifest,
    files: [...files.values()].map(reference => ({
      fileId: reference.fileId,
      referencedBy: [...reference.referencedBy].sort(),
    })),
    errors,
  };
}

export async function backupSingleDriveAsset(
  client: DriveBackupClient,
  key: BackupKey,
  encryptedPayloadFolderId: string,
  nativeCopyFolderId: string,
  reference: { fileId: string; referencedBy: string[] },
  index: number,
  templateIds: string[],
  appsScriptIds: string[] = [],
  appsScriptContentById: Map<string, Buffer> = new Map(),
): Promise<DriveAssetBackupOutcome> {
  const warnings: string[] = [];
  const errors: string[] = [];
  let source: DriveFileMetadata | undefined;
  try {
    source = await withDriveReadRetry(() => client.getMetadata(reference.fileId));
    if (source.mimeType === 'application/vnd.google-apps.folder') {
      throw new Error('Drive folder was included in the asset plan unexpectedly.');
    }
    let plaintext: Buffer;
    let exportMimeType = source.mimeType;
    let exportExtension = extensionForMime(source.mimeType);
    const sourceFileId = source.id;
    const exportSpec = DriveBackupClient.exportSpec(source.mimeType);
    const isAppsScriptProject = source.mimeType === 'application/vnd.google-apps.script' || appsScriptIds.includes(source.id);
    if (isAppsScriptProject) {
      exportMimeType = 'application/json';
      exportExtension = 'json';
      plaintext = appsScriptContentById.get(source.id) || Buffer.from(JSON.stringify(await client.getAppsScriptProjectContent(source.id)), 'utf8');
    } else if (exportSpec) {
      exportMimeType = exportSpec.mimeType;
      exportExtension = exportSpec.extension;
      plaintext = await withDriveReadRetry(() => client.exportFile(sourceFileId, exportMimeType));
    } else if (DriveBackupClient.isWorkspaceFile(source.mimeType)) {
      throw new Error(`Unsupported Google Workspace MIME type ${source.mimeType}.`);
    } else {
      plaintext = await withDriveReadRetry(() => client.download(sourceFileId));
    }
    const encrypted = encryptBackupPayload(plaintext, key);
    const payloadName = `asset-${String(index).padStart(5, '0')}-${safeBackupName(source.name)}.${exportExtension}.enc`;
    const uploaded = await client.uploadBytes(payloadName, 'application/octet-stream', encryptedPayloadFolderId, encrypted);
    let nativeCopyFileId: string | undefined;
    if (DriveBackupClient.isWorkspaceFile(source.mimeType)) {
      try {
        const nativeCopy = await client.copyFile(source.id, nativeCopyFolderId, `native-${safeBackupName(source.name)}`);
        nativeCopyFileId = nativeCopy.id;
      } catch (error) {
        warnings.push(`Native copy unavailable for ${source.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    return {
      asset: {
        sourceFileId: source.id,
        sourceName: source.name,
        sourceMimeType: source.mimeType,
        sourceParentIds: source.parents || [],
        sourceModifiedTime: source.modifiedTime,
        sourceSize: source.size,
        exportMimeType,
        exportExtension,
        encryptedPayloadFileId: uploaded.id,
        encryptedPayloadFileName: payloadName,
        payloadPlaintextBytes: plaintext.byteLength,
        payloadPlaintextSha256: sha256Buffer(plaintext),
        payloadCiphertextSha256: sha256(encrypted),
        nativeCopyFileId,
        referencedBy: [...reference.referencedBy].sort(),
        isTemplate: templateIds.includes(source.id),
        status: 'BACKED_UP',
      },
      warnings,
      errors,
    };
  } catch (error) {
    const referencedBy = [...reference.referencedBy].sort();
    const referenceSuffix = referencedBy.length
      ? ` Referenced by: ${referencedBy.join(', ')}.`
      : '';
    const message = `Cannot backup Drive file ${source?.name || reference.fileId}: ${error instanceof Error ? error.message : String(error)}${referenceSuffix}`;
    errors.push(message);
    const unsupported = Boolean(source
      && DriveBackupClient.isWorkspaceFile(source.mimeType)
      && source.mimeType !== 'application/vnd.google-apps.script'
      && !DriveBackupClient.exportSpec(source.mimeType));
    return {
      asset: {
        sourceFileId: reference.fileId,
        sourceName: source?.name || reference.fileId,
        sourceMimeType: source?.mimeType || 'unknown',
        sourceParentIds: source?.parents || [],
        exportMimeType: source?.mimeType || 'application/octet-stream',
        exportExtension: 'bin',
        encryptedPayloadFileId: '',
        encryptedPayloadFileName: '',
        payloadPlaintextBytes: 0,
        payloadPlaintextSha256: '',
        payloadCiphertextSha256: '',
        referencedBy,
        isTemplate: templateIds.includes(reference.fileId),
        status: unsupported ? 'UNSUPPORTED' : 'INACCESSIBLE',
        error: message,
      },
      warnings,
      errors,
    };
  }
}

export async function backupDriveAssets(
  client: DriveBackupClient,
  key: BackupKey,
  encryptedPayloadFolderId: string,
  nativeCopyFolderId: string,
  references: Map<string, DriveReference>,
  sourceFolderIds: string[],
  templateIds: string[],
  appsScriptIds: string[] = [],
  appsScriptContentById: Map<string, Buffer> = new Map(),
): Promise<DriveBackupResult> {
  const plan = await collectDriveBackupPlan(client, references, sourceFolderIds, templateIds, appsScriptIds);
  const assets: DriveAssetManifest[] = [];
  const errors: string[] = [...plan.errors];
  const warnings: string[] = [];
  for (let index = 0; index < plan.files.length; index++) {
    const outcome = await backupSingleDriveAsset(
      client,
      key,
      encryptedPayloadFolderId,
      nativeCopyFolderId,
      plan.files[index],
      index,
      templateIds,
      appsScriptIds,
      appsScriptContentById,
    );
    assets.push(outcome.asset);
    warnings.push(...outcome.warnings);
    errors.push(...outcome.errors);
  }
  return { assets, folders: plan.folders, warnings, errors };
}
