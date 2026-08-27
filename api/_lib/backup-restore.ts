import { randomBytes } from 'node:crypto';
import { getApp } from 'firebase-admin/app';
import {
  getAuth,
  type HashAlgorithmType,
  type UpdateRequest,
  type UserImportOptions,
  type UserImportRecord,
  type UserRecord,
} from 'firebase-admin/auth';
import type { DocumentData, Firestore } from 'firebase-admin/firestore';
import type {
  BackupManifest,
  BackupPartManifest,
  DriveAssetManifest,
  RestoreCheckpoint,
  RestoreMode,
} from './backup-contract.js';
import {
  BACKUP_FORMAT_VERSION,
  BACKUP_SCHEMA_VERSION,
  BACKUP_SERIALIZER_VERSION,
  FIRESTORE_COLLECTION_CATALOG,
  FIRESTORE_ROOT_COLLECTION_CATALOG,
  FIRESTORE_SUBCOLLECTION_CATALOG,
  NEVER_RESTORE_COLLECTIONS,
  safeBackupName,
  configuredBackupAppId,
  pathBelongsToApp,
} from './backup-contract.js';
import {
  backupEncryptionKey,
  decryptBackupPayload,
  encryptBackupPayload,
  sha256,
  type BackupKey,
} from './backup-crypto.js';
import {
  DriveBackupClient,
  type DriveFileMetadata,
} from './backup-drive.js';
import {
  collectFirestoreBackup,
  deserializeFirestoreValue,
  isRestoreablePath,
  sanitizeFirestoreDataForBackup,
  serializeFirestoreValue,
  stableJson,
  type FirestoreBackupRecord,
} from './firestore-backup.js';

const FIRESTORE_BATCH_SIZE = 400;
const DEFAULT_MAX_FIRESTORE_WRITES = 18_000;
const DEFAULT_MAX_FIRESTORE_READS = 40_000;
const DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';
const RESTORE_MODES: RestoreMode[] = ['DRY_RUN', 'RECOVER_MISSING', 'RESTORE_SELECTED', 'FULL_REPLACE'];

export interface LoadedBackupManifest {
  manifest: BackupManifest;
  backupFolderId: string;
  manifestFileId: string;
}

export interface BackupVerificationResult {
  verified: boolean;
  backupFolderId: string;
  manifestFileId: string;
  manifest: BackupManifest;
  checkedParts: number;
  checkedAssets: number;
  checkedBytes: number;
  errors: string[];
  warnings: string[];
}

export interface RestoreInput {
  db: Firestore;
  client: DriveBackupClient;
  backupFolderId: string;
  mode: RestoreMode;
  selectedPaths?: string[];
  confirmation?: string;
  projectId?: string;
  key?: BackupKey;
  restoreDrive?: boolean;
  restoreAuth?: boolean;
  replaceAuth?: boolean;
  resumeRestoreId?: string;
}

export interface FirestoreRestoreSummary {
  scanned: number;
  missing: number;
  different: number;
  unchanged: number;
  skippedExisting: number;
  created: number;
  updated: number;
  deleted: number;
  plannedWrites: number;
  firestoreReads: number;
}

export interface AuthRestoreSummary {
  scanned: number;
  existing: number;
  missing: number;
  imported: number;
  updated: number;
  deleted: number;
  failed: number;
  skipped: boolean;
  errors: string[];
}

export interface DriveRestoreSummary {
  scanned: number;
  existing: number;
  restoredFromTrash: number;
  recreated: number;
  skipped: number;
  failed: number;
  idMap: Record<string, string>;
  errors: string[];
}

export interface RestoreReport {
  backupId: string;
  backupFolderId: string;
  mode: RestoreMode;
  verified: boolean;
  firestore: FirestoreRestoreSummary;
  auth: AuthRestoreSummary;
  drive: DriveRestoreSummary;
  warnings: string[];
  checkpoint?: RestoreCheckpoint;
}

interface ParsedBackupRecord {
  path: string;
  collection: string;
  documentId: string;
  parentPath?: string;
  data?: unknown;
  excluded?: boolean;
}

interface AuthBackupRecord {
  uid: string;
  data: Record<string, unknown>;
}

interface PlannedFirestoreSet {
  kind: 'set';
  path: string;
  data: DocumentData;
}

interface PlannedFirestoreDelete {
  kind: 'delete';
  path: string;
}

type PlannedFirestoreOperation = PlannedFirestoreSet | PlannedFirestoreDelete;

interface RestoreCheckpointContext {
  state: RestoreCheckpoint;
  fileId: string;
  update(patch: Partial<RestoreCheckpoint>): Promise<void>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requiredDriveId(value: string, label: string): string {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error(`${label} không hợp lệ.`);
  return value;
}

const RESTORE_CHECKPOINT_PREFIX = 'restore-checkpoint-';

function restoreCheckpointName(restoreId: string): string {
  return `${RESTORE_CHECKPOINT_PREFIX}${safeBackupName(restoreId)}.json.enc`;
}

function restoreId(): string {
  return `rst_${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}_${randomBytes(5).toString('hex')}`;
}

function configuredMaxFirestoreWrites(): number {
  const raw = process.env['LIMS_BACKUP_MAX_FIRESTORE_WRITES'];
  if (!raw) return DEFAULT_MAX_FIRESTORE_WRITES;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 19_500) {
    throw new Error('LIMS_BACKUP_MAX_FIRESTORE_WRITES phải là số nguyên từ 1 đến 19500.');
  }
  return value;
}

function configuredMaxFirestoreReads(): number {
  const raw = process.env['LIMS_BACKUP_MAX_FIRESTORE_READS'];
  if (!raw) return DEFAULT_MAX_FIRESTORE_READS;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 49_000) {
    throw new Error('LIMS_BACKUP_MAX_FIRESTORE_READS phải là số nguyên từ 1 đến 49000.');
  }
  return value;
}

function assertNonNegativeInteger(value: unknown, label: string): asserts value is number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error(`${label} không hợp lệ.`);
}

function assertStringArray(value: unknown, label: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
    throw new Error(`${label} không hợp lệ.`);
  }
}

function assertExactStringSet(actual: string[], expected: readonly string[], label: string): void {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  if (actualSet.size !== actual.length || actualSet.size !== expectedSet.size || [...expectedSet].some(item => !actualSet.has(item))) {
    throw new Error(`${label} không khớp catalog backup hiện tại.`);
  }
}

function parseJsonBuffer(buffer: Buffer, label: string): unknown {
  try {
    return JSON.parse(buffer.toString('utf8')) as unknown;
  } catch (error) {
    throw new Error(`${label} không phải JSON hợp lệ: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function parseNdjson(buffer: Buffer, label: string): unknown[] {
  const lines = buffer.toString('utf8').split('\n').map(line => line.trim()).filter(Boolean);
  const records: unknown[] = [];
  for (let index = 0; index < lines.length; index++) {
    try {
      records.push(JSON.parse(lines[index]) as unknown);
    } catch (error) {
      throw new Error(`${label} có dòng ${index + 1} không phải JSON hợp lệ: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return records;
}

async function readEncryptedPayload(
  client: DriveBackupClient,
  fileId: string,
  key: BackupKey,
  expectedCiphertextSha256?: string,
  expectedPlaintextSha256?: string,
  label = 'Backup payload',
): Promise<{ ciphertext: Buffer; plaintext: Buffer }> {
  const ciphertext = await client.download(requiredDriveId(fileId, `${label} Drive file ID`));
  const ciphertextHash = sha256(ciphertext);
  if (expectedCiphertextSha256 && ciphertextHash !== expectedCiphertextSha256) {
    throw new Error(`${label} sai checksum ciphertext.`);
  }
  const plaintext = decryptBackupPayload(ciphertext, key);
  if (expectedPlaintextSha256 && sha256(plaintext) !== expectedPlaintextSha256) {
    throw new Error(`${label} sai checksum plaintext.`);
  }
  return { ciphertext, plaintext };
}

function checkpointError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/Bearer\s+[^\s]+/gi, 'Bearer [redacted]').slice(0, 800);
}

function assertCheckpointShape(value: unknown, backupFolderId: string, backupId: string, mode: RestoreMode): asserts value is RestoreCheckpoint {
  if (!isRecord(value)
    || typeof value['restoreId'] !== 'string'
    || !/^rst_[A-Za-z0-9_-]+$/.test(value['restoreId'])
    || value['backupId'] !== backupId
    || value['backupFolderId'] !== backupFolderId
    || value['mode'] !== mode
    || !['STARTED', 'DRIVE', 'FIRESTORE', 'AUTH', 'COMPLETED', 'FAILED'].includes(String(value['phase']))
    || typeof value['startedAt'] !== 'string'
    || Number.isNaN(Date.parse(value['startedAt']))
    || typeof value['updatedAt'] !== 'string'
    || Number.isNaN(Date.parse(value['updatedAt']))) {
    throw new Error('Restore checkpoint không hợp lệ hoặc không khớp backup/mode hiện tại.');
  }
  for (const [key, item] of [
    ['firestoreBatchesCommitted', value['firestoreBatchesCommitted']],
    ['firestoreWritesCommitted', value['firestoreWritesCommitted']],
    ['driveFoldersProcessed', value['driveFoldersProcessed']],
    ['driveAssetsProcessed', value['driveAssetsProcessed']],
    ['authBatchesProcessed', value['authBatchesProcessed']],
  ] as const) {
    assertNonNegativeInteger(item, `checkpoint.${key}`);
  }
  if (value['completedAt'] !== undefined && (typeof value['completedAt'] !== 'string' || Number.isNaN(Date.parse(value['completedAt'] as string)))) {
    throw new Error('Restore checkpoint có completedAt không hợp lệ.');
  }
  if (value['lastPath'] !== undefined && typeof value['lastPath'] !== 'string') throw new Error('Restore checkpoint có lastPath không hợp lệ.');
  if (value['error'] !== undefined && typeof value['error'] !== 'string') throw new Error('Restore checkpoint có error không hợp lệ.');
}

async function createRestoreCheckpoint(
  client: DriveBackupClient,
  backupFolderId: string,
  manifest: BackupManifest,
  mode: RestoreMode,
  key: BackupKey,
  requestedRestoreId?: string,
): Promise<RestoreCheckpointContext> {
  const folderId = requiredDriveId(backupFolderId, 'backupFolderId');
  let fileId: string | undefined;
  let state: RestoreCheckpoint;
  if (requestedRestoreId) {
    if (!/^rst_[A-Za-z0-9_-]+$/.test(requestedRestoreId)) throw new Error('resumeRestoreId không hợp lệ.');
    const children = await client.listChildren(folderId);
    const matches = children.filter(file => file.name === restoreCheckpointName(requestedRestoreId));
    if (matches.length !== 1) throw new Error('Không tìm thấy duy nhất restore checkpoint được yêu cầu.');
    fileId = matches[0].id;
    const payload = await readEncryptedPayload(client, fileId, key, undefined, undefined, 'Restore checkpoint');
    const parsed = parseJsonBuffer(payload.plaintext, 'Restore checkpoint');
    assertCheckpointShape(parsed, folderId, manifest.backupId, mode);
    if (parsed.phase === 'COMPLETED') throw new Error('Restore checkpoint đã COMPLETED; hãy tạo restore mới nếu cần chạy lại.');
    state = {
      ...parsed,
      phase: 'STARTED',
      firestoreBatchesCommitted: 0,
      firestoreWritesCommitted: 0,
      driveFoldersProcessed: 0,
      driveAssetsProcessed: 0,
      authBatchesProcessed: 0,
      lastPath: undefined,
      error: undefined,
      completedAt: undefined,
      updatedAt: new Date().toISOString(),
    };
  } else {
    const now = new Date().toISOString();
    state = {
      restoreId: restoreId(),
      backupId: manifest.backupId,
      backupFolderId: folderId,
      mode,
      phase: 'STARTED',
      firestoreBatchesCommitted: 0,
      firestoreWritesCommitted: 0,
      driveFoldersProcessed: 0,
      driveAssetsProcessed: 0,
      authBatchesProcessed: 0,
      startedAt: now,
      updatedAt: now,
    };
  }

  const save = async (next: RestoreCheckpoint): Promise<void> => {
    const ciphertext = encryptBackupPayload(Buffer.from(JSON.stringify(next), 'utf8'), key);
    if (fileId) {
      await client.updateBytes(fileId, 'application/octet-stream', ciphertext);
    } else {
      const uploaded = await client.uploadBytes(restoreCheckpointName(next.restoreId), 'application/octet-stream', folderId, ciphertext);
      fileId = uploaded.id;
    }
  };
  // Persist the reset state for both a new restore and a resumed attempt. A
  // process timeout can therefore be distinguished from the previous failed
  // attempt before the next batch starts.
  await save(state);
  const context: RestoreCheckpointContext = {
    state,
    fileId: fileId as string,
    update: async (patch: Partial<RestoreCheckpoint>): Promise<void> => {
      const next: RestoreCheckpoint = {
        ...context.state,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      await save(next);
      context.state = next;
    },
  };
  return context;
}

export async function listRestoreCheckpoints(
  client: DriveBackupClient,
  backupFolderId: string,
  backupId: string,
  key = backupEncryptionKey(),
): Promise<RestoreCheckpoint[]> {
  const folderId = requiredDriveId(backupFolderId, 'backupFolderId');
  const checkpoints: RestoreCheckpoint[] = [];
  for (const file of await client.listChildren(folderId)) {
    if (!file.name.startsWith(RESTORE_CHECKPOINT_PREFIX) || !file.name.endsWith('.json.enc')) continue;
    try {
      const payload = await readEncryptedPayload(client, file.id, key, undefined, undefined, 'Restore checkpoint');
      const parsed = parseJsonBuffer(payload.plaintext, 'Restore checkpoint');
      if (!isRecord(parsed) || !RESTORE_MODES.includes(parsed['mode'] as RestoreMode)) continue;
      assertCheckpointShape(parsed, folderId, backupId, parsed['mode'] as RestoreMode);
      checkpoints.push(parsed);
    } catch {
      // A corrupt/stale checkpoint must never prevent the administrator from
      // seeing or selecting a valid backup. It simply cannot be resumed.
    }
  }
  return checkpoints.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function validateManifest(value: unknown, backupFolderId: string, key: BackupKey): BackupManifest {
  if (!isRecord(value)) throw new Error('Manifest backup không phải object.');
  const manifest = value as unknown as BackupManifest;
  if (typeof manifest.backupId !== 'string' || !manifest.backupId) throw new Error('Manifest thiếu backupId.');
  if (typeof manifest.appId !== 'string' || !manifest.appId) throw new Error('Manifest thiếu appId.');
  if (manifest.formatVersion !== BACKUP_FORMAT_VERSION) throw new Error(`Manifest formatVersion ${manifest.formatVersion} không được hỗ trợ.`);
  if (manifest.schemaVersion !== BACKUP_SCHEMA_VERSION) throw new Error(`Manifest schemaVersion ${manifest.schemaVersion} không được hỗ trợ.`);
  if (manifest.serializerVersion !== BACKUP_SERIALIZER_VERSION) throw new Error(`Manifest serializerVersion ${manifest.serializerVersion} không được hỗ trợ.`);
  if (!['RUNNING', 'COMPLETED', 'COMPLETED_WITH_WARNINGS', 'FAILED'].includes(manifest.status)) throw new Error('Manifest có status không hợp lệ.');
  if (typeof manifest.projectId !== 'string' || !manifest.projectId) throw new Error('Manifest thiếu projectId.');
  if (typeof manifest.startedAt !== 'string' || Number.isNaN(Date.parse(manifest.startedAt))) throw new Error('Manifest có startedAt không hợp lệ.');
  if (manifest.snapshot !== undefined) {
    if (!isRecord(manifest.snapshot) || manifest.snapshot.consistency !== 'LOGICAL_CONSISTENT_READ'
      || typeof manifest.snapshot.startedAt !== 'string' || Number.isNaN(Date.parse(manifest.snapshot.startedAt))
      || (manifest.snapshot.completedAt !== undefined && (typeof manifest.snapshot.completedAt !== 'string' || Number.isNaN(Date.parse(manifest.snapshot.completedAt))))) {
      throw new Error('Manifest có snapshot boundary không hợp lệ.');
    }
  }
  if (manifest.driveBackupFolderId !== backupFolderId) throw new Error('Manifest không khớp thư mục backup.');
  if (!Array.isArray(manifest.parts)) throw new Error('Manifest thiếu danh sách phân đoạn.');
  if (!manifest.encryption || !isRecord(manifest.encryption) || manifest.encryption.algorithm !== 'aes-256-gcm' || manifest.encryption.perPartIv !== true) {
    throw new Error('Manifest dùng thuật toán mã hóa không được hỗ trợ.');
  }
  if (manifest.encryption.keyId !== key.keyId) {
    throw new Error(`Manifest dùng keyId ${manifest.encryption.keyId}, không khớp keyId đang cấu hình.`);
  }
  if (!manifest.firestore || !isRecord(manifest.firestore) || !manifest.auth || !isRecord(manifest.auth) || !manifest.drive || !isRecord(manifest.drive)) {
    throw new Error('Manifest thiếu phạm vi dữ liệu bắt buộc.');
  }
  if (!Array.isArray(manifest.warnings) || manifest.warnings.some(item => typeof item !== 'string')
    || !Array.isArray(manifest.errors) || manifest.errors.some(item => typeof item !== 'string')) {
    throw new Error('Manifest thiếu warnings/errors hợp lệ.');
  }
  assertNonNegativeInteger(manifest.firestore.totalDocuments, 'firestore.totalDocuments');
  assertNonNegativeInteger(manifest.firestore.orphanSubcollectionCount, 'firestore.orphanSubcollectionCount');
  assertNonNegativeInteger(manifest.firestore.scrubbedFieldCount, 'firestore.scrubbedFieldCount');
  assertStringArray(manifest.firestore.topLevelCollections, 'firestore.topLevelCollections');
  assertStringArray(manifest.firestore.rootCollections, 'firestore.rootCollections');
  assertStringArray(manifest.firestore.nestedPatterns, 'firestore.nestedPatterns');
  assertStringArray(manifest.firestore.unknownCollections, 'firestore.unknownCollections');
  assertExactStringSet(manifest.firestore.topLevelCollections, FIRESTORE_COLLECTION_CATALOG, 'firestore.topLevelCollections');
  assertExactStringSet(manifest.firestore.rootCollections, FIRESTORE_ROOT_COLLECTION_CATALOG, 'firestore.rootCollections');
  assertExactStringSet(manifest.firestore.nestedPatterns, FIRESTORE_SUBCOLLECTION_CATALOG.map(item => `${item.parentCollection}/{id}/${item.collection}`), 'firestore.nestedPatterns');
  if (!Array.isArray(manifest.firestore.pathCounts)) throw new Error('Manifest thiếu firestore.pathCounts.');
  for (const item of manifest.firestore.pathCounts) {
    if (!isRecord(item) || typeof item.path !== 'string' || typeof item.collection !== 'string') throw new Error('Manifest có firestore.pathCounts không hợp lệ.');
    assertNonNegativeInteger(item.documentCount, `documentCount của ${item.path}`);
    assertNonNegativeInteger(item.bytes, `bytes của ${item.path}`);
  }
  assertNonNegativeInteger(manifest.auth.userCount, 'auth.userCount');
  if (typeof manifest.auth.passwordHashesIncluded !== 'boolean') throw new Error('Manifest có auth.passwordHashesIncluded không hợp lệ.');
  assertNonNegativeInteger(manifest.drive.assetCount, 'drive.assetCount');
  assertNonNegativeInteger(manifest.drive.templateCount, 'drive.templateCount');
  assertNonNegativeInteger(manifest.drive.folderCount, 'drive.folderCount');
  assertNonNegativeInteger(manifest.drive.inaccessibleCount, 'drive.inaccessibleCount');
  assertNonNegativeInteger(manifest.drive.unsupportedCount, 'drive.unsupportedCount');
  if (!Array.isArray(manifest.drive.assets) || !Array.isArray(manifest.drive.folders)) throw new Error('Manifest thiếu danh sách Drive.');
  if (manifest.drive.assetCount !== manifest.drive.assets.length || manifest.drive.folderCount !== manifest.drive.folders.length) {
    throw new Error('Manifest có count Drive không khớp danh sách.');
  }
  for (const part of manifest.parts) assertPartShape(part);
  if (manifest.parts.filter(part => part.category === 'deployment').length !== 1) {
    throw new Error('Manifest phải có đúng một deployment part để chứng minh Apps Script/config đã được snapshot.');
  }
  for (const asset of manifest.drive.assets) assertDriveAssetShape(asset);
  for (const folder of manifest.drive.folders) assertDriveFolderShape(folder);
  return manifest;
}

export async function loadBackupManifest(
  client: DriveBackupClient,
  backupFolderId: string,
  key = backupEncryptionKey(),
): Promise<LoadedBackupManifest> {
  const folderId = requiredDriveId(backupFolderId, 'backupFolderId');
  const folder = await client.getMetadata(folderId);
  if (folder.mimeType !== DRIVE_FOLDER_MIME) throw new Error('backupFolderId không trỏ tới thư mục Google Drive.');
  const children = await client.listChildren(folderId);
  const manifestFiles = children.filter(file => file.name === 'manifest.json.enc');
  if (manifestFiles.length !== 1) throw new Error('Không tìm thấy duy nhất một manifest.json.enc trong backup.');
  const manifestFile = manifestFiles[0];
  const payload = await readEncryptedPayload(client, manifestFile.id, key, undefined, undefined, 'Manifest');
  const manifest = validateManifest(parseJsonBuffer(payload.plaintext, 'Manifest'), folderId, key);
  return { manifest, backupFolderId: folderId, manifestFileId: manifestFile.id };
}

function partLabel(part: unknown): string {
  if (isRecord(part)) {
    if (typeof part['name'] === 'string' && part['name']) return part['name'];
    if (typeof part['driveFileId'] === 'string' && part['driveFileId']) return part['driveFileId'];
  }
  return 'unknown-part';
}

function validateParsedPartRecords(
  part: BackupPartManifest,
  records: unknown[],
  appId: string,
): void {
  if (part.category === 'firestore') {
    for (const value of records) {
      if (!isRecord(value) || typeof value['path'] !== 'string' || typeof value['collection'] !== 'string' || typeof value['documentId'] !== 'string' || value['data'] === undefined) {
        throw new Error('Có Firestore record thiếu path/collection/documentId/data.');
      }
      if (!isRestoreablePath(value['path'] as string, appId)) throw new Error(`Firestore path không được restore: ${value['path']}`);
    }
  }
  if (part.category === 'auth') {
    for (const value of records) {
      if (!isRecord(value) || typeof value['uid'] !== 'string' || !isRecord(value['data'])) {
        throw new Error('Có Auth record thiếu uid/data.');
      }
    }
  }
}

function assertPartShape(part: unknown): asserts part is BackupPartManifest {
  if (!isRecord(part) || typeof part['name'] !== 'string' || typeof part['driveFileId'] !== 'string') {
    throw new Error('Manifest có phân đoạn không hợp lệ.');
  }
  if (!part['name'] || !part['driveFileId'] || !/^[A-Za-z0-9_-]+$/.test(part['driveFileId'] as string)) {
    throw new Error(`Manifest có Drive file ID không hợp lệ ở ${partLabel(part)}.`);
  }
  if (!['firestore', 'auth', 'drive', 'deployment', 'manifest'].includes(String(part['category']))) {
    throw new Error(`Category không hợp lệ ở ${partLabel(part)}.`);
  }
  if (!Number.isSafeInteger(part['recordCount']) || (part['recordCount'] as number) < 0) throw new Error(`Record count không hợp lệ ở ${partLabel(part)}.`);
  if (!Number.isSafeInteger(part['plaintextBytes']) || (part['plaintextBytes'] as number) < 0) throw new Error(`Plaintext size không hợp lệ ở ${partLabel(part)}.`);
  if (!Number.isSafeInteger(part['ciphertextBytes']) || (part['ciphertextBytes'] as number) < 0) throw new Error(`Ciphertext size không hợp lệ ở ${partLabel(part)}.`);
  if (!/^[a-f0-9]{64}$/i.test(String(part['plaintextSha256'] || '')) || !/^[a-f0-9]{64}$/i.test(String(part['ciphertextSha256'] || ''))) {
    throw new Error(`Checksum không hợp lệ ở ${partLabel(part)}.`);
  }
}

function assetLabel(asset: unknown): string {
  return isRecord(asset) && typeof asset['sourceName'] === 'string' && asset['sourceName']
    ? asset['sourceName']
    : 'unknown-asset';
}

function assertDriveAssetShape(asset: unknown): asserts asset is DriveAssetManifest {
  if (!isRecord(asset)
    || typeof asset['sourceFileId'] !== 'string'
    || !asset['sourceFileId']
    || typeof asset['sourceName'] !== 'string'
    || typeof asset['sourceMimeType'] !== 'string'
    || !Array.isArray(asset['sourceParentIds'])
    || (asset['sourceParentIds'] as unknown[]).some(item => typeof item !== 'string')
    || typeof asset['exportMimeType'] !== 'string'
    || typeof asset['exportExtension'] !== 'string'
    || typeof asset['encryptedPayloadFileId'] !== 'string'
    || typeof asset['encryptedPayloadFileName'] !== 'string'
    || typeof asset['payloadPlaintextSha256'] !== 'string'
    || typeof asset['payloadCiphertextSha256'] !== 'string'
    || !Array.isArray(asset['referencedBy'])
    || (asset['referencedBy'] as unknown[]).some(item => typeof item !== 'string')
    || typeof asset['isTemplate'] !== 'boolean'
    || !['BACKED_UP', 'INACCESSIBLE', 'UNSUPPORTED'].includes(String(asset['status']))) {
    throw new Error(`Manifest có Drive asset không hợp lệ: ${assetLabel(asset)}.`);
  }
  assertNonNegativeInteger(asset['payloadPlaintextBytes'], `payloadPlaintextBytes của ${assetLabel(asset)}`);
  if (asset['status'] === 'BACKED_UP') {
    if (!(asset['encryptedPayloadFileId'] as string) || !/^[a-f0-9]{64}$/i.test(asset['payloadPlaintextSha256'] as string) || !/^[a-f0-9]{64}$/i.test(asset['payloadCiphertextSha256'] as string)) {
      throw new Error(`Drive asset ${assetLabel(asset)} thiếu checksum/payload.`);
    }
  }
}

function assertDriveFolderShape(folder: unknown): asserts folder is BackupManifest['drive']['folders'][number] {
  if (!isRecord(folder)
    || typeof folder['sourceFolderId'] !== 'string'
    || !folder['sourceFolderId']
    || typeof folder['name'] !== 'string'
    || !Array.isArray(folder['parentIds'])
    || (folder['parentIds'] as unknown[]).some(item => typeof item !== 'string')
    || !['BACKED_UP', 'INACCESSIBLE'].includes(String(folder['status']))) {
    throw new Error('Manifest có Drive folder không hợp lệ.');
  }
}

export async function verifyBackup(
  client: DriveBackupClient,
  backupFolderId: string,
  key = backupEncryptionKey(),
): Promise<BackupVerificationResult> {
  const loaded = await loadBackupManifest(client, backupFolderId, key);
  const { manifest } = loaded;
  const errors: string[] = [...(manifest.errors || [])];
  const warnings: string[] = [...(manifest.warnings || [])];
  let checkedParts = 0;
  let checkedAssets = 0;
  let checkedBytes = 0;
  let firestoreRecordCount = 0;
  let authRecordCount = 0;
  if (manifest.drive.assetCount !== manifest.drive.assets.length) errors.push('drive.assetCount không khớp danh sách assets.');
  if (manifest.drive.folderCount !== manifest.drive.folders.length) errors.push('drive.folderCount không khớp danh sách folders.');
  if (manifest.drive.templateCount !== manifest.drive.assets.filter(asset => asset.isTemplate).length) errors.push('drive.templateCount không khớp assets.');
  if (manifest.drive.inaccessibleCount !== manifest.drive.assets.filter(asset => asset.status === 'INACCESSIBLE').length + manifest.drive.folders.filter(folder => folder.status === 'INACCESSIBLE').length) errors.push('drive.inaccessibleCount không khớp assets/folders.');
  if (manifest.drive.unsupportedCount !== manifest.drive.assets.filter(asset => asset.status === 'UNSUPPORTED').length) errors.push('drive.unsupportedCount không khớp assets.');
  if (manifest.firestore.totalDocuments !== manifest.firestore.pathCounts.reduce((sum, item) => sum + item.documentCount, 0)) errors.push('firestore.totalDocuments không khớp pathCounts.');
  const seenPartIds = new Set<string>();
  for (const part of manifest.parts) {
    try {
      assertPartShape(part);
      if (seenPartIds.has(part.driveFileId)) throw new Error('Drive file ID bị lặp trong manifest.');
      seenPartIds.add(part.driveFileId);
      const payload = await readEncryptedPayload(
        client,
        part.driveFileId,
        key,
        part.ciphertextSha256,
        part.plaintextSha256,
        `Phân đoạn ${partLabel(part)}`,
      );
      if (payload.plaintext.byteLength !== part.plaintextBytes) throw new Error('Plaintext size không khớp manifest.');
      if (payload.ciphertext.byteLength !== part.ciphertextBytes) throw new Error('Ciphertext size không khớp manifest.');
      const parsed = part.name.endsWith('.ndjson.enc')
        ? parseNdjson(payload.plaintext, `Phân đoạn ${partLabel(part)}`)
        : [parseJsonBuffer(payload.plaintext, `Phân đoạn ${partLabel(part)}`)];
      if (parsed.length !== part.recordCount) throw new Error(`Số record thực tế ${parsed.length} khác manifest ${part.recordCount}.`);
      validateParsedPartRecords(part, parsed, manifest.appId);
      if (part.category === 'firestore') firestoreRecordCount += parsed.length;
      if (part.category === 'auth') authRecordCount += parsed.length;
      checkedParts++;
      checkedBytes += payload.ciphertext.byteLength;
    } catch (error) {
      errors.push(`${partLabel(part)}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (firestoreRecordCount !== manifest.firestore.totalDocuments) errors.push('Tổng Firestore record trong part không khớp manifest.');
  if (authRecordCount !== manifest.auth.userCount) errors.push('Tổng Auth record trong part không khớp manifest.');

  const seenAssetPayloadIds = new Set<string>();
  for (const asset of manifest.drive.assets || []) {
    if (asset.status !== 'BACKED_UP') {
      errors.push(`Drive asset ${asset.sourceName || asset.sourceFileId} có trạng thái ${asset.status}.`);
      continue;
    }
    try {
      if (!asset.encryptedPayloadFileId) throw new Error('Thiếu encryptedPayloadFileId.');
      if (seenAssetPayloadIds.has(asset.encryptedPayloadFileId)) throw new Error('Encrypted payload ID bị lặp.');
      seenAssetPayloadIds.add(asset.encryptedPayloadFileId);
      const payload = await readEncryptedPayload(
        client,
        asset.encryptedPayloadFileId,
        key,
        asset.payloadCiphertextSha256,
        asset.payloadPlaintextSha256,
        `Drive asset ${asset.sourceName || asset.sourceFileId}`,
      );
      if (payload.plaintext.byteLength !== asset.payloadPlaintextBytes) throw new Error('Kích thước plaintext không khớp manifest.');
      checkedAssets++;
      checkedBytes += payload.ciphertext.byteLength;
    } catch (error) {
      errors.push(`Drive asset ${asset.sourceName || asset.sourceFileId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  for (const folder of manifest.drive.folders || []) {
    if (folder.status !== 'BACKED_UP') errors.push(`Drive folder ${folder.name || folder.sourceFolderId} không truy cập được.`);
  }
  let backupObjectIds: string[] = [];
  try {
    // Check every object below the backup root, including internal folders.
    // A child can receive an explicit `anyone` ACL while the root stays private.
    backupObjectIds = await listBackupObjectIds(client, loaded.backupFolderId);
  } catch (error) {
    errors.push(`Không thể kiểm tra đầy đủ cây object của backup: ${error instanceof Error ? error.message : String(error)}`);
  }
  const aclFileIds = [...new Set([
    ...backupObjectIds,
    loaded.backupFolderId,
    loaded.manifestFileId,
    ...manifest.parts.map(part => part.driveFileId),
    ...(manifest.drive.assets || []).filter(asset => asset.status === 'BACKED_UP').flatMap(asset => [
      asset.encryptedPayloadFileId,
      ...(asset.nativeCopyFileId ? [asset.nativeCopyFileId] : []),
    ]),
  ].filter(Boolean))];
  for (const fileId of aclFileIds) {
    try {
      const permissions = await client.listPermissions(fileId);
      if (permissions.some(permission => permission.type === 'anyone')) {
        errors.push(`Backup Drive object ${fileId} đang có ACL anyone; backup không private.`);
      }
      if (permissions.some(permission => permission.type === 'domain')) {
        warnings.push(`Backup Drive object ${fileId} có ACL domain; cần review phạm vi chia sẻ.`);
      }
    } catch (error) {
      errors.push(`Không thể kiểm tra ACL Drive object ${fileId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (manifest.status === 'FAILED') errors.push('Manifest có trạng thái FAILED; không được restore.');
  if (manifest.status === 'RUNNING') errors.push('Manifest chưa được chốt; backup vẫn ở trạng thái RUNNING.');
  if (manifest.verification?.status === 'FAILED') errors.push('Manifest đã ghi nhận verification FAILED; không được restore.');
  return {
    verified: errors.length === 0,
    backupFolderId: loaded.backupFolderId,
    manifestFileId: loaded.manifestFileId,
    manifest,
    checkedParts,
    checkedAssets,
    checkedBytes,
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
  };
}

async function readPartRecords(
  client: DriveBackupClient,
  part: BackupPartManifest,
  key: BackupKey,
): Promise<unknown[]> {
  const payload = await readEncryptedPayload(
    client,
    part.driveFileId,
    key,
    part.ciphertextSha256,
    part.plaintextSha256,
    `Phân đoạn ${partLabel(part)}`,
  );
  if (payload.plaintext.byteLength !== part.plaintextBytes) throw new Error(`Kích thước plaintext không khớp ở ${partLabel(part)}.`);
  const records = part.name.endsWith('.ndjson.enc')
    ? parseNdjson(payload.plaintext, `Phân đoạn ${partLabel(part)}`)
    : [parseJsonBuffer(payload.plaintext, `Phân đoạn ${partLabel(part)}`)];
  if (records.length !== part.recordCount) throw new Error(`Số record không khớp ở ${partLabel(part)}.`);
  return records;
}

async function readFirestoreRecords(
  client: DriveBackupClient,
  manifest: BackupManifest,
  key: BackupKey,
): Promise<ParsedBackupRecord[]> {
  const records: ParsedBackupRecord[] = [];
  for (const part of manifest.parts.filter(item => item.category === 'firestore')) {
    for (const value of await readPartRecords(client, part, key)) {
      if (!isRecord(value) || typeof value['path'] !== 'string' || typeof value['collection'] !== 'string' || typeof value['documentId'] !== 'string') {
        throw new Error(`Phân đoạn ${partLabel(part)} chứa Firestore record không hợp lệ.`);
      }
      records.push(value as unknown as ParsedBackupRecord);
    }
  }
  if (records.length !== manifest.firestore.totalDocuments) {
    throw new Error(`Tổng Firestore record ${records.length} khác manifest ${manifest.firestore.totalDocuments}.`);
  }
  return records;
}

async function readAuthRecords(
  client: DriveBackupClient,
  manifest: BackupManifest,
  key: BackupKey,
): Promise<AuthBackupRecord[]> {
  const records: AuthBackupRecord[] = [];
  for (const part of manifest.parts.filter(item => item.category === 'auth')) {
    for (const value of await readPartRecords(client, part, key)) {
      if (!isRecord(value) || typeof value['uid'] !== 'string' || !isRecord(value['data'])) {
        throw new Error(`Phân đoạn ${partLabel(part)} chứa Auth record không hợp lệ.`);
      }
      records.push({ uid: value['uid'] as string, data: value['data'] as Record<string, unknown> });
    }
  }
  if (records.length !== manifest.auth.userCount) {
    throw new Error(`Tổng Auth record ${records.length} khác manifest ${manifest.auth.userCount}.`);
  }
  return records;
}

async function listBackupObjectIds(client: DriveBackupClient, rootId: string): Promise<string[]> {
  const ids: string[] = [rootId];
  const queue = [rootId];
  const visited = new Set<string>([rootId]);
  while (queue.length) {
    const parentId = queue.shift() as string;
    for (const child of await client.listChildren(parentId)) {
      if (visited.has(child.id)) continue;
      visited.add(child.id);
      ids.push(child.id);
      if (child.mimeType === DRIVE_FOLDER_MIME) queue.push(child.id);
    }
  }
  return ids;
}

function normaliseSelection(value: string, appId: string): string {
  const result = value.trim().replace(/\/+$/, '');
  if (!result || result.includes('..') || result.split('/').some(segment => !segment || segment === '.')) {
    throw new Error('selectedPaths chứa path không hợp lệ.');
  }
  if (!result.startsWith('releases') && !pathBelongsToApp(result, appId)) {
    throw new Error(`selectedPaths nằm ngoài namespace LIMS: ${result}`);
  }
  if (result === 'releases' || result.startsWith('releases/')) return result;
  const parts = result.split('/');
  if (parts.length < 2) throw new Error(`selectedPaths không hợp lệ: ${result}`);
  return result;
}

function matchesSelection(path: string, selectedPaths: string[]): boolean {
  if (!selectedPaths.length) return true;
  return selectedPaths.some(prefix => path === prefix || path.startsWith(`${prefix}/`));
}

function replaceDriveIds(value: unknown, idMap: Map<string, string>): unknown {
  if (!idMap.size) return value;
  if (typeof value === 'string') {
    let result = value;
    for (const [oldId, newId] of idMap) {
      if (oldId === newId) continue;
      result = result.split(oldId).join(newId);
    }
    return result;
  }
  if (Array.isArray(value)) return value.map(item => replaceDriveIds(item, idMap));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key, replaceDriveIds(item, idMap)]));
  }
  return value;
}

export function isDriveOnlyRecoveryDifference(
  currentSerialised: unknown,
  desiredSerialised: unknown,
  idMap: Map<string, string>,
): boolean {
  return stableJson(replaceDriveIds(currentSerialised, idMap)) === stableJson(desiredSerialised);
}

function stripUndefined(value: unknown, inArray = false): unknown {
  if (Array.isArray(value)) return value.map(item => item === undefined ? (inArray ? null : null) : stripUndefined(item, true));
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (item === undefined) continue;
      result[key] = stripUndefined(item, false);
    }
    return result;
  }
  return value;
}

function asDocumentData(value: unknown, db: Firestore, label: string): DocumentData {
  const deserialised = stripUndefined(deserializeFirestoreValue(value, db));
  if (!isRecord(deserialised)) throw new Error(`${label} không phải Firestore document object.`);
  return deserialised as DocumentData;
}

function protectedCollection(path: string): boolean {
  return NEVER_RESTORE_COLLECTIONS.has(path.split('/').at(-2) || '');
}

async function restoreFirestore(
  input: RestoreInput,
  manifest: BackupManifest,
  records: ParsedBackupRecord[],
  idMap: Map<string, string>,
  selectedPaths: string[],
  checkpoint?: RestoreCheckpointContext,
): Promise<FirestoreRestoreSummary> {
  const summary: FirestoreRestoreSummary = {
    scanned: 0,
    missing: 0,
    different: 0,
    unchanged: 0,
    skippedExisting: 0,
    created: 0,
    updated: 0,
    deleted: 0,
    plannedWrites: 0,
    firestoreReads: 0,
  };
  const operations: PlannedFirestoreOperation[] = [];
  const backupPaths = new Set<string>();
  const seenPaths = new Set<string>();
  const maxFirestoreReads = configuredMaxFirestoreReads();
  for (const record of records) {
    if (record.excluded || record.data === undefined) continue;
    if (!isRestoreablePath(record.path, manifest.appId) || protectedCollection(record.path)) {
      throw new Error(`Backup chứa Firestore path không được restore: ${record.path}`);
    }
    if (seenPaths.has(record.path)) throw new Error(`Backup chứa Firestore path lặp: ${record.path}`);
    seenPaths.add(record.path);
    if (!matchesSelection(record.path, selectedPaths)) continue;
    backupPaths.add(record.path);
    summary.scanned++;
    const current = await input.db.doc(record.path).get();
    summary.firestoreReads++;
    if (summary.firestoreReads > maxFirestoreReads) {
      throw new Error(`Restore vượt ngưỡng ${maxFirestoreReads} Firestore document reads; dừng để bảo vệ quota Spark.`);
    }
    const desiredSerialised = replaceDriveIds(record.data, idMap);
    const desired = asDocumentData(desiredSerialised, input.db, record.path);
    if (!current.exists) {
      summary.missing++;
      if (input.mode !== 'DRY_RUN') {
        operations.push({ kind: 'set', path: record.path, data: desired });
        summary.created++;
      }
      continue;
    }
    const currentSerialised = serializeFirestoreValue(sanitizeFirestoreDataForBackup(current.data()), input.db);
    const same = stableJson(currentSerialised) === stableJson(desiredSerialised);
    if (same) {
      summary.unchanged++;
      if (input.mode === 'RECOVER_MISSING') summary.skippedExisting++;
      continue;
    }
    summary.different++;
    if (input.mode === 'RECOVER_MISSING' || input.mode === 'DRY_RUN') {
      // A missing Drive object may be recreated with a new ID. In that case
      // the existing Firestore document must receive the URL/ID remap even in
      // the otherwise non-overwriting recovery mode. Only permit this update
      // when replacing IDs makes the live document byte-for-byte equal to the
      // backup; unrelated edits remain protected and are skipped.
      if (input.mode === 'RECOVER_MISSING' && isDriveOnlyRecoveryDifference(currentSerialised, desiredSerialised, idMap)) {
        operations.push({ kind: 'set', path: record.path, data: desired });
        summary.updated++;
      } else {
        summary.skippedExisting++;
      }
      continue;
    }
    operations.push({ kind: 'set', path: record.path, data: desired });
    summary.updated++;
  }

  if (input.mode === 'FULL_REPLACE') {
    const currentPaths = new Set<string>();
    const currentStats = await collectFirestoreBackup({
      db: input.db,
      appId: manifest.appId,
      onRecord: async record => {
        if (!record.excluded && isRestoreablePath(record.path, manifest.appId) && !protectedCollection(record.path)) currentPaths.add(record.path);
      },
      onDriveReference: () => undefined,
      maxFirestoreReads: Math.max(0, maxFirestoreReads - summary.firestoreReads),
    });
    summary.firestoreReads += currentStats.firestoreReads;
    for (const path of currentPaths) {
      if (matchesSelection(path, selectedPaths) && !backupPaths.has(path)) {
        operations.push({ kind: 'delete', path });
        summary.deleted++;
      }
    }
  }

  // Preserve parent-before-child creation across batch boundaries. Deletions
  // are placed after sets so a retry cannot leave a newly restored child
  // pointing at a parent that has not been written yet.
  operations.sort((left, right) => {
    if (left.kind !== right.kind) return left.kind === 'set' ? -1 : 1;
    return left.path.split('/').length - right.path.split('/').length;
  });
  summary.plannedWrites = operations.length;
  if (summary.plannedWrites > configuredMaxFirestoreWrites()) {
    throw new Error(`Restore cần ${summary.plannedWrites} Firestore writes, vượt ngưỡng an toàn. Giảm phạm vi hoặc tăng LIMS_BACKUP_MAX_FIRESTORE_WRITES có kiểm soát.`);
  }
  if (input.mode === 'DRY_RUN' || operations.length === 0) {
    if (checkpoint) await checkpoint.update({ phase: 'FIRESTORE', lastPath: operations.at(-1)?.path });
    return summary;
  }

  for (let index = 0; index < operations.length; index += FIRESTORE_BATCH_SIZE) {
    const batchOperations = operations.slice(index, index + FIRESTORE_BATCH_SIZE);
    const batch = input.db.batch();
    for (const operation of batchOperations) {
      const ref = input.db.doc(operation.path);
      if (operation.kind === 'delete') batch.delete(ref);
      else batch.set(ref, operation.data);
    }
    await batch.commit();
    if (checkpoint) {
      await checkpoint.update({
        phase: 'FIRESTORE',
        firestoreBatchesCommitted: checkpoint.state.firestoreBatchesCommitted + 1,
        firestoreWritesCommitted: checkpoint.state.firestoreWritesCommitted + batchOperations.length,
        lastPath: batchOperations.at(-1)?.path,
      });
    }
  }
  return summary;
}

function bufferFromEncoded(value: unknown): Buffer | undefined {
  if (typeof value === 'string' && value) return Buffer.from(value, 'base64');
  if (isRecord(value) && Array.isArray(value['data'])) return Buffer.from(value['data'].filter(item => Number.isInteger(item)) as number[]);
  if (Array.isArray(value) && value.every(item => Number.isInteger(item))) return Buffer.from(value as number[]);
  return undefined;
}

function optionalString(data: Record<string, unknown>, key: string): string | undefined {
  return typeof data[key] === 'string' && data[key] ? data[key] as string : undefined;
}

function optionalBoolean(data: Record<string, unknown>, key: string): boolean | undefined {
  return typeof data[key] === 'boolean' ? data[key] as boolean : undefined;
}

function parseCustomClaims(value: unknown): Record<string, unknown> | undefined {
  if (isRecord(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return isRecord(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function importOptionsFromEnvironment(): UserImportOptions | undefined {
  const algorithm = process.env['LIMS_BACKUP_AUTH_HASH_ALGORITHM']?.trim();
  if (!algorithm) return undefined;
  const hash: UserImportOptions['hash'] = { algorithm: algorithm as HashAlgorithmType };
  const key = bufferFromEncoded(process.env['LIMS_BACKUP_AUTH_HASH_KEY']);
  const saltSeparator = bufferFromEncoded(process.env['LIMS_BACKUP_AUTH_SALT_SEPARATOR']);
  if (key) hash.key = key;
  if (saltSeparator) hash.saltSeparator = saltSeparator;
  for (const [envName, property] of [
    ['LIMS_BACKUP_AUTH_HASH_ROUNDS', 'rounds'],
    ['LIMS_BACKUP_AUTH_HASH_MEMORY_COST', 'memoryCost'],
    ['LIMS_BACKUP_AUTH_HASH_PARALLELIZATION', 'parallelization'],
    ['LIMS_BACKUP_AUTH_HASH_BLOCK_SIZE', 'blockSize'],
    ['LIMS_BACKUP_AUTH_HASH_DERIVED_KEY_LENGTH', 'derivedKeyLength'],
  ] as const) {
    const raw = process.env[envName];
    if (raw) {
      const number = Number(raw);
      if (!Number.isSafeInteger(number) || number < 1) throw new Error(`${envName} không hợp lệ.`);
      (hash as Record<string, unknown>)[property] = number;
    }
  }
  return { hash };
}

function authImportRecord(record: AuthBackupRecord): UserImportRecord {
  const data = record.data;
  const metadata = isRecord(data['metadata']) ? data['metadata'] : {};
  const rawProviderData = Array.isArray(data['providerData']) ? data['providerData'] : [];
  const providerData = rawProviderData.filter(isRecord).map(provider => ({
    uid: optionalString(provider, 'uid') || optionalString(provider, 'rawId') || record.uid,
    providerId: optionalString(provider, 'providerId') || 'unknown',
    displayName: optionalString(provider, 'displayName'),
    email: optionalString(provider, 'email'),
    phoneNumber: optionalString(provider, 'phoneNumber'),
    photoURL: optionalString(provider, 'photoURL') || optionalString(provider, 'photoUrl'),
  }));
  const importRecord: UserImportRecord = {
    uid: record.uid,
    email: optionalString(data, 'email'),
    emailVerified: optionalBoolean(data, 'emailVerified'),
    displayName: optionalString(data, 'displayName'),
    phoneNumber: optionalString(data, 'phoneNumber'),
    photoURL: optionalString(data, 'photoURL') || optionalString(data, 'photoUrl'),
    disabled: optionalBoolean(data, 'disabled'),
    metadata: {
      creationTime: optionalString(metadata, 'creationTime') || optionalString(data, 'createdAt'),
      lastSignInTime: optionalString(metadata, 'lastSignInTime') || optionalString(data, 'lastLoginAt'),
    },
    providerData: providerData.length ? providerData : undefined,
    customClaims: parseCustomClaims(data['customClaims']),
    tenantId: optionalString(data, 'tenantId'),
  };
  const passwordHash = bufferFromEncoded(data['passwordHash']);
  const passwordSalt = bufferFromEncoded(data['passwordSalt'] || data['salt']);
  if (passwordHash) importRecord.passwordHash = passwordHash;
  if (passwordSalt) importRecord.passwordSalt = passwordSalt;
  return Object.fromEntries(Object.entries(importRecord).filter(([, value]) => value !== undefined)) as UserImportRecord;
}

function authUpdateRequest(record: AuthBackupRecord): UpdateRequest {
  const data = record.data;
  const update: UpdateRequest = {};
  const email = optionalString(data, 'email');
  const displayName = optionalString(data, 'displayName');
  const phoneNumber = optionalString(data, 'phoneNumber');
  const photoURL = optionalString(data, 'photoURL') || optionalString(data, 'photoUrl');
  const emailVerified = optionalBoolean(data, 'emailVerified');
  const disabled = optionalBoolean(data, 'disabled');
  if (email) update.email = email;
  if (displayName !== undefined) update.displayName = displayName;
  if (phoneNumber) update.phoneNumber = phoneNumber;
  if (photoURL !== undefined) update.photoURL = photoURL;
  if (emailVerified !== undefined) update.emailVerified = emailVerified;
  if (disabled !== undefined) update.disabled = disabled;
  return update;
}

async function listAllAuthUsers(): Promise<Map<string, UserRecord>> {
  const result = new Map<string, UserRecord>();
  let pageToken: string | undefined;
  do {
    const page = await getAuth().listUsers(1000, pageToken);
    for (const user of page.users) result.set(user.uid, user);
    pageToken = page.pageToken;
  } while (pageToken);
  return result;
}

async function restoreAuthUsers(
  input: RestoreInput,
  manifest: BackupManifest,
  records: AuthBackupRecord[],
  checkpoint?: RestoreCheckpointContext,
): Promise<AuthRestoreSummary> {
  const summary: AuthRestoreSummary = {
    scanned: records.length,
    existing: 0,
    missing: 0,
    imported: 0,
    updated: 0,
    deleted: 0,
    failed: 0,
    skipped: input.mode === 'DRY_RUN' || input.restoreAuth === false,
    errors: [],
  };
  if (input.restoreAuth === false) return summary;
  const authUsers = await listAllAuthUsers();
  const backupByUid = new Map<string, AuthBackupRecord>();
  for (const record of records) {
    if (!/^[A-Za-z0-9:_-]{1,128}$/.test(record.uid)) throw new Error(`Auth UID không hợp lệ: ${record.uid}`);
    if (backupByUid.has(record.uid)) throw new Error(`Backup chứa Auth UID lặp: ${record.uid}`);
    backupByUid.set(record.uid, record);
  }
  const importOptions = importOptionsFromEnvironment();
  const hasPasswordHash = records.some(record => Boolean(bufferFromEncoded(record.data['passwordHash'])));
  if (input.mode !== 'DRY_RUN' && manifest.auth.passwordHashesIncluded && hasPasswordHash && !importOptions) {
    throw new Error('Backup có password hash nhưng thiếu LIMS_BACKUP_AUTH_HASH_ALGORITHM và tham số hash; dừng restore Auth để không làm mất khả năng đăng nhập.');
  }
  summary.existing = records.filter(record => authUsers.has(record.uid)).length;
  summary.missing = records.length - summary.existing;

  if (input.mode === 'DRY_RUN') return summary;

  if (checkpoint) await checkpoint.update({ phase: 'AUTH' });

  if (input.mode === 'FULL_REPLACE') {
    for (const [uid] of authUsers) {
      if (!backupByUid.has(uid) || input.replaceAuth) {
        try {
          await getAuth().deleteUser(uid);
          summary.deleted++;
        } catch (error) {
          summary.failed++;
          summary.errors.push(`Không thể xóa Auth ${uid}: ${error instanceof Error ? error.message : String(error)}`);
        }
        if (checkpoint) await checkpoint.update({ phase: 'AUTH', lastPath: `auth/${uid}` });
      }
    }
  }

  if (input.mode === 'FULL_REPLACE' && input.replaceAuth) {
    const allRecords = records.map(authImportRecord);
    for (let index = 0; index < allRecords.length; index += 1000) {
      const result = await getAuth().importUsers(allRecords.slice(index, index + 1000), importOptions);
      summary.imported += result.successCount;
      summary.failed += result.failureCount;
      summary.errors.push(...result.errors.map(error => `Auth import index ${error.index}: ${error.error?.message || 'unknown error'}`));
      if (checkpoint) {
        await checkpoint.update({ phase: 'AUTH', authBatchesProcessed: checkpoint.state.authBatchesProcessed + 1, lastPath: `auth/import/${index}` });
      }
    }
    return summary;
  }

  const missingRecords = records.filter(record => !authUsers.has(record.uid));
  for (let index = 0; index < missingRecords.length; index += 1000) {
    const result = await getAuth().importUsers(missingRecords.slice(index, index + 1000).map(authImportRecord), importOptions);
    summary.imported += result.successCount;
    summary.failed += result.failureCount;
    summary.errors.push(...result.errors.map(error => `Auth import index ${error.index}: ${error.error?.message || 'unknown error'}`));
    if (checkpoint) {
      await checkpoint.update({ phase: 'AUTH', authBatchesProcessed: checkpoint.state.authBatchesProcessed + 1, lastPath: `auth/import/${index}` });
    }
  }
  if (input.mode !== 'RECOVER_MISSING') {
    for (const record of records.filter(item => authUsers.has(item.uid))) {
      try {
        const update = authUpdateRequest(record);
        if (Object.keys(update).length) {
          await getAuth().updateUser(record.uid, update);
          summary.updated++;
        }
        const claims = parseCustomClaims(record.data['customClaims']);
        if (claims) await getAuth().setCustomUserClaims(record.uid, claims);
      } catch (error) {
        summary.failed++;
        summary.errors.push(`Không thể cập nhật Auth ${record.uid}: ${error instanceof Error ? error.message : String(error)}`);
      }
      if (checkpoint) await checkpoint.update({ phase: 'AUTH', lastPath: `auth/${record.uid}` });
    }
  }
  return summary;
}

function orderDriveFolders(folders: BackupManifest['drive']['folders']): BackupManifest['drive']['folders'] {
  const pending = [...folders];
  const known = new Set(folders.map(folder => folder.sourceFolderId));
  const resolved = new Set<string>();
  const ordered: BackupManifest['drive']['folders'] = [];
  while (pending.length) {
    const index = pending.findIndex(folder =>
      folder.parentIds.length === 0
      || folder.parentIds.some(parentId => resolved.has(parentId))
      || folder.parentIds.every(parentId => !known.has(parentId))
    );
    if (index < 0) throw new Error('Manifest có cây Drive folder bị vòng lặp hoặc thiếu parent resolution.');
    const [folder] = pending.splice(index, 1);
    ordered.push(folder);
    resolved.add(folder.sourceFolderId);
  }
  return ordered;
}

function assertKnownParentsAvailable(
  parentIds: string[],
  knownFolderIds: Set<string>,
  folderMap: Map<string, string>,
  label: string,
): void {
  const unavailable = parentIds.filter(parentId => knownFolderIds.has(parentId) && !folderMap.has(parentId));
  if (unavailable.length) throw new Error(`${label} có parent folder chưa khôi phục: ${unavailable.join(', ')}`);
}

function restoredAssetSelected(asset: DriveAssetManifest, selectedPaths: string[]): boolean {
  if (!selectedPaths.length) return true;
  if (asset.isTemplate) return true;
  return asset.referencedBy.some(reference => matchesSelection(reference.split('#')[0], selectedPaths));
}

function foldersNeededForSelection(
  manifest: BackupManifest,
  selectedPaths: string[],
): Set<string> {
  const foldersById = new Map(manifest.drive.folders.map(folder => [folder.sourceFolderId, folder]));
  if (!selectedPaths.length) return new Set(foldersById.keys());
  const needed = new Set<string>();
  for (const asset of manifest.drive.assets) {
    if (!restoredAssetSelected(asset, selectedPaths)) continue;
    for (const parentId of asset.sourceParentIds) {
      if (foldersById.has(parentId)) needed.add(parentId);
    }
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const folderId of [...needed]) {
      for (const parentId of foldersById.get(folderId)?.parentIds || []) {
        if (foldersById.has(parentId) && !needed.has(parentId)) {
          needed.add(parentId);
          changed = true;
        }
      }
    }
  }
  return needed;
}

function sourceParentFor(
  sourceParentIds: string[],
  folderMap: Map<string, string>,
  fallback: string,
): string {
  for (const sourceParentId of sourceParentIds) {
    const mapped = folderMap.get(sourceParentId);
    if (mapped) return mapped;
  }
  return fallback;
}

function outputAssetName(asset: DriveAssetManifest): string {
  const extension = asset.exportExtension ? `.${asset.exportExtension}` : '';
  const lower = asset.sourceName.toLowerCase();
  return asset.sourceMimeType.startsWith('application/vnd.google-apps.') && extension && !lower.endsWith(extension)
    ? `${asset.sourceName}${extension}`
    : asset.sourceName || `restored-${asset.sourceFileId}${extension}`;
}

async function restoreDriveAssets(
  input: RestoreInput,
  manifest: BackupManifest,
  key: BackupKey,
  selectedPaths: string[],
  checkpoint?: RestoreCheckpointContext,
): Promise<DriveRestoreSummary> {
  const summary: DriveRestoreSummary = {
    scanned: 0,
    existing: 0,
    restoredFromTrash: 0,
    recreated: 0,
    skipped: 0,
    failed: 0,
    idMap: {},
    errors: [],
  };
  const idMap = new Map<string, string>();
  const folderMap = new Map<string, string>();
  const knownFolderIds = new Set(manifest.drive.folders.map(folder => folder.sourceFolderId));
  const selectedFolderIds = foldersNeededForSelection(manifest, selectedPaths);
  if (checkpoint) await checkpoint.update({ phase: 'DRIVE' });
  for (const folder of orderDriveFolders(manifest.drive.folders).filter(item => selectedFolderIds.has(item.sourceFolderId))) {
    if (folder.status !== 'BACKED_UP') continue;
    try {
      const existing = await input.client.tryGetMetadata(folder.sourceFolderId);
      if (existing) {
        if (existing.mimeType !== DRIVE_FOLDER_MIME) throw new Error('Object hiện tại cùng ID không phải folder.');
        if (existing.trashed) {
          await input.client.restoreTrashedFile(existing.id);
          summary.restoredFromTrash++;
        }
        folderMap.set(folder.sourceFolderId, existing.id);
        idMap.set(folder.sourceFolderId, existing.id);
        continue;
      }
      const targetRoot = process.env['LIMS_BACKUP_DRIVE_RESTORE_FOLDER_ID']?.trim();
      if (!targetRoot) throw new Error('Thiếu LIMS_BACKUP_DRIVE_RESTORE_FOLDER_ID để tạo lại thư mục Drive bị mất.');
      requiredDriveId(targetRoot, 'LIMS_BACKUP_DRIVE_RESTORE_FOLDER_ID');
      assertKnownParentsAvailable(folder.parentIds, knownFolderIds, folderMap, `Drive folder ${folder.name || folder.sourceFolderId}`);
      const parentId = sourceParentFor(folder.parentIds, folderMap, targetRoot);
      const created = await input.client.createFolder(folder.name, parentId);
      folderMap.set(folder.sourceFolderId, created.id);
      idMap.set(folder.sourceFolderId, created.id);
      summary.recreated++;
    } catch (error) {
      summary.failed++;
      summary.errors.push(`Không thể khôi phục Drive folder ${folder.name || folder.sourceFolderId}: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (checkpoint) {
      await checkpoint.update({ phase: 'DRIVE', driveFoldersProcessed: checkpoint.state.driveFoldersProcessed + 1, lastPath: folder.sourceFolderId });
    }
  }

  for (const asset of manifest.drive.assets) {
    if (!restoredAssetSelected(asset, selectedPaths)) {
      summary.skipped++;
      continue;
    }
    summary.scanned++;
    if (asset.status !== 'BACKED_UP') {
      summary.failed++;
      summary.errors.push(`Drive asset ${asset.sourceName || asset.sourceFileId} không có bản backup hoàn chỉnh.`);
      continue;
    }
    try {
      const existing = await input.client.tryGetMetadata(asset.sourceFileId);
      if (existing) {
        if (existing.mimeType === DRIVE_FOLDER_MIME) throw new Error('Object hiện tại cùng ID là folder, không phải asset.');
        if (existing.trashed) {
          await input.client.restoreTrashedFile(existing.id);
          summary.restoredFromTrash++;
        }
        idMap.set(asset.sourceFileId, existing.id);
        summary.existing++;
        continue;
      }
      const targetRoot = process.env['LIMS_BACKUP_DRIVE_RESTORE_FOLDER_ID']?.trim();
      if (!targetRoot) throw new Error('Thiếu LIMS_BACKUP_DRIVE_RESTORE_FOLDER_ID để khôi phục tệp Drive bị mất.');
      requiredDriveId(targetRoot, 'LIMS_BACKUP_DRIVE_RESTORE_FOLDER_ID');
      assertKnownParentsAvailable(asset.sourceParentIds, knownFolderIds, folderMap, `Drive asset ${asset.sourceName || asset.sourceFileId}`);
      const parentId = sourceParentFor(asset.sourceParentIds, folderMap, targetRoot);
      let restored: DriveFileMetadata | undefined;
      if (asset.nativeCopyFileId) {
        try {
          const nativeCopy = await input.client.tryGetMetadata(asset.nativeCopyFileId);
          if (nativeCopy) {
            if (nativeCopy.mimeType === DRIVE_FOLDER_MIME) throw new Error('Native copy cùng ID là folder, không phải asset.');
            if (nativeCopy.trashed) await input.client.restoreTrashedFile(nativeCopy.id);
            restored = await input.client.copyFile(nativeCopy.id, parentId, asset.sourceName);
          }
        } catch (error) {
          // The encrypted export is authoritative. A missing/expired native
          // convenience copy must not prevent disaster recovery from using
          // the verified payload that is already in the backup tree.
          console.warn('[BackupRestore] Native Drive copy unavailable; using encrypted payload:', error instanceof Error ? error.message : error);
        }
      }
      if (!restored) {
        const payload = await readEncryptedPayload(
          input.client,
          asset.encryptedPayloadFileId,
          key,
          asset.payloadCiphertextSha256,
          asset.payloadPlaintextSha256,
          `Drive asset ${asset.sourceName || asset.sourceFileId}`,
        );
        restored = await input.client.uploadBytes(outputAssetName(asset), asset.exportMimeType || 'application/octet-stream', parentId, payload.plaintext);
      }
      idMap.set(asset.sourceFileId, restored.id);
      summary.recreated++;
    } catch (error) {
      summary.failed++;
      summary.errors.push(`Không thể khôi phục Drive asset ${asset.sourceName || asset.sourceFileId}: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (checkpoint) {
      await checkpoint.update({ phase: 'DRIVE', driveAssetsProcessed: checkpoint.state.driveAssetsProcessed + 1, lastPath: asset.sourceFileId });
    }
  }
  summary.idMap = Object.fromEntries(idMap);
  return summary;
}

function projectIdFromAdmin(): string | undefined {
  const projectId = getApp().options.projectId;
  return typeof projectId === 'string' && projectId ? projectId : undefined;
}

export async function runRestore(input: RestoreInput): Promise<RestoreReport> {
  const key = input.key || backupEncryptionKey();
  if (input.mode === 'RESTORE_SELECTED' && !(input.selectedPaths || []).length) {
    throw new Error('RESTORE_SELECTED bắt buộc có selectedPaths.');
  }
  if (input.mode === 'FULL_REPLACE' && input.confirmation !== 'FULL_REPLACE_LIMS') {
    throw new Error('FULL_REPLACE bắt buộc confirmation đúng là FULL_REPLACE_LIMS.');
  }
  if (input.replaceAuth && input.mode !== 'FULL_REPLACE') throw new Error('replaceAuth chỉ được dùng với FULL_REPLACE.');
  const selectedPaths = [...new Set((input.selectedPaths || []).map(value => normaliseSelection(value, configuredBackupAppId())))];
  const verification = await verifyBackup(input.client, input.backupFolderId, key);
  if (!verification.verified) throw new Error(`Backup không đạt kiểm tra integrity: ${verification.errors.join(' | ')}`);
  const manifest = verification.manifest;
  if (manifest.appId !== configuredBackupAppId()) {
    throw new Error(`Backup thuộc appId ${manifest.appId}, không khớp appId hiện tại.`);
  }
  const expectedProjectId = input.projectId || projectIdFromAdmin();
  if (expectedProjectId && manifest.projectId && expectedProjectId !== manifest.projectId) {
    throw new Error(`Backup thuộc project ${manifest.projectId}, không khớp project hiện tại.`);
  }
  let checkpoint: RestoreCheckpointContext | undefined;
  try {
    checkpoint = input.mode === 'DRY_RUN'
      ? undefined
      : await createRestoreCheckpoint(input.client, input.backupFolderId, manifest, input.mode, key, input.resumeRestoreId);
    const records = await readFirestoreRecords(input.client, manifest, key);
    const authRecords = await readAuthRecords(input.client, manifest, key);
    const drive = input.mode === 'DRY_RUN' || input.restoreDrive === false
      ? {
          scanned: 0,
          existing: 0,
          restoredFromTrash: 0,
          recreated: 0,
          skipped: manifest.drive.assets.length,
          failed: 0,
          idMap: {},
          errors: [],
        } satisfies DriveRestoreSummary
      : await restoreDriveAssets(input, manifest, key, selectedPaths, checkpoint);
    if (drive.errors.length) throw new Error(`Drive restore chưa hoàn chỉnh: ${drive.errors.join(' | ')}`);
    const firestore = await restoreFirestore(input, manifest, records, new Map(Object.entries(drive.idMap)), selectedPaths, checkpoint);
    const auth = await restoreAuthUsers(input, manifest, authRecords, checkpoint);
    const warnings = [...verification.warnings];
    if (manifest.auth.passwordHashesIncluded && !input.replaceAuth && input.mode !== 'DRY_RUN') {
      warnings.push('Password hash của Auth user đang tồn tại được giữ nguyên; chỉ user mới được import đầy đủ hash.');
    }
    if (input.restoreDrive === false && input.mode !== 'DRY_RUN') warnings.push('Drive restore bị tắt theo yêu cầu; các liên kết Drive không được remap.');
    if (checkpoint) {
      await checkpoint.update({
        phase: auth.errors.length ? 'FAILED' : 'COMPLETED',
        error: auth.errors.length ? `Auth restore có ${auth.errors.length} lỗi.` : undefined,
        completedAt: auth.errors.length ? undefined : new Date().toISOString(),
      });
    }
    return {
      backupId: manifest.backupId,
      backupFolderId: input.backupFolderId,
      mode: input.mode,
      verified: true,
      firestore,
      auth,
      drive,
      warnings: [...new Set(warnings)],
      checkpoint: checkpoint?.state,
    };
  } catch (error) {
    if (checkpoint) {
      try {
        await checkpoint.update({ phase: 'FAILED', error: checkpointError(error) });
      } catch (checkpointFailure) {
        console.warn('[BackupRestore] Cannot persist failed restore checkpoint:', checkpointError(checkpointFailure));
      }
    }
    throw error;
  }
}
