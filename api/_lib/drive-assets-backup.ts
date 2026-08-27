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
  const folders = new Map<string, DriveFileMetadata>();
  const folderManifest: DriveFolderManifest[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const visitedFolders = new Set<string>();
  for (const folderId of sourceFolderIds) {
    await descendants(client, folderId, folders, visitedFolders, folderManifest, errors);
  }
  const files = uniqueFileMap(references, folders, templateIds, appsScriptIds);
  const assets: DriveAssetManifest[] = [];
  let index = 0;
  for (const reference of files.values()) {
    let source: DriveFileMetadata | undefined;
    try {
      source = await client.getMetadata(reference.fileId);
      if (source.mimeType === 'application/vnd.google-apps.folder') continue;
      let plaintext: Buffer;
      let exportMimeType = source.mimeType;
      let exportExtension = extensionForMime(source.mimeType);
      const exportSpec = DriveBackupClient.exportSpec(source.mimeType);
      const isAppsScriptProject = source.mimeType === 'application/vnd.google-apps.script' || appsScriptIds.includes(source.id);
      if (isAppsScriptProject) {
        exportMimeType = 'application/json';
        exportExtension = 'json';
        plaintext = appsScriptContentById.get(source.id) || Buffer.from(JSON.stringify(await client.getAppsScriptProjectContent(source.id)), 'utf8');
      } else if (exportSpec) {
        exportMimeType = exportSpec.mimeType;
        exportExtension = exportSpec.extension;
        plaintext = await client.exportFile(source.id, exportMimeType);
      } else if (DriveBackupClient.isWorkspaceFile(source.mimeType)) {
        throw new Error(`Unsupported Google Workspace MIME type ${source.mimeType}.`);
      } else {
        plaintext = await client.download(source.id);
      }
      const encrypted = encryptBackupPayload(plaintext, key);
      const payloadName = `asset-${String(index++).padStart(5, '0')}-${safeBackupName(source.name)}.${exportExtension}.enc`;
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
      assets.push({
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
      });
    } catch (error) {
      const message = `Cannot backup Drive file ${source?.name || reference.fileId}: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(message);
      const unsupported = Boolean(source
        && DriveBackupClient.isWorkspaceFile(source.mimeType)
        && source.mimeType !== 'application/vnd.google-apps.script'
        && !DriveBackupClient.exportSpec(source.mimeType));
      assets.push({
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
        referencedBy: [...reference.referencedBy].sort(),
        isTemplate: templateIds.includes(reference.fileId),
        status: unsupported ? 'UNSUPPORTED' : 'INACCESSIBLE',
        error: message,
      });
    }
  }
  return { assets, folders: folderManifest, warnings, errors };
}
