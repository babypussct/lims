import { randomBytes } from 'node:crypto';
import { getAuth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type {
  BackupActor,
  BackupManifest,
  BackupPartManifest,
} from './backup-contract.js';
import {
  BACKUP_FORMAT_VERSION,
  BACKUP_SCHEMA_VERSION,
  BACKUP_SERIALIZER_VERSION,
  DEFAULT_BACKUP_APP_ID,
  FIRESTORE_COLLECTION_CATALOG,
  FIRESTORE_ROOT_COLLECTION_CATALOG,
  FIRESTORE_SUBCOLLECTION_CATALOG,
  NEVER_RESTORE_COLLECTIONS,
  NEVER_RESTORE_FIELD_NAMES,
  safeBackupName,
} from './backup-contract.js';
import { backupEncryptionKey, encryptBackupPayload, sha256, type BackupKey } from './backup-crypto.js';
import { backupDriveFolderId, driveSourceFolderIds, driveTemplateIds, DriveBackupClient, type DriveStorageQuota } from './backup-drive.js';
import { backupDriveAssets, type DriveReference } from './drive-assets-backup.js';
import { collectFirestoreBackup, extractDriveFileIds, type FirestoreBackupRecord } from './firestore-backup.js';
import { EncryptedNdjsonPartWriter } from './backup-writer.js';
import { verifyBackup } from './backup-restore.js';
import { readAppsScriptLiveSnapshot, readAppsScriptSourceSnapshot, type AppsScriptLiveSnapshot } from './apps-script-backup.js';

export interface RunBackupInput {
  db: Firestore;
  client: DriveBackupClient;
  actor: BackupActor;
  projectId: string;
  appId?: string;
  releaseVersion?: string;
  backupParentFolderId?: string;
  key?: BackupKey;
}

export interface RunBackupResult {
  manifest: BackupManifest;
  backupFolderId: string;
  manifestFileId: string;
}

const DEFAULT_DRIVE_ROOT_FOLDER_ID = '1B8KctFU-KDCPAwxrg8N75Sipk5SlGJkE';
const DEFAULT_DRIVE_COA_FOLDER_ID = '1Lf9E9Hn8300oveEH0LKVj_iibftodzU8';
const DEFAULT_DRIVE_TEMPLATE_IDS = [
  '1FN0onAiYBuSBiQk3DWQQGXTxvhHaI8VSaxD2qgUUAxY',
  '1LTP7q3pIW9IBIbJPzFmX43Sr3QxGj70MoBLity0HLVw',
  '15Vg_kdrEx1DQ-LyLuZVo8sKnjW7JFV7mQDAEE3xKywY',
  '1Qfg1k_Y3GLWhOj9oCoQW6sahMNoVN7GhU6u5NMSYrBo',
  '1xQNkNRcPtfmQjwyv5F2qx1E2VbCmeuPbnfCK3_AgAGQ',
  '1JhO-qVV6-KFw9zq2ARCYyVwlQoj6xFjFHlrBsjNGbH8',
  '1nSWI-KDXhcnzZK3k0X5o0Wn2rXQ2XeRx87jx8WJAM60',
  '1kR2sljh1LPoXj8jkmYq5f3ZZapkBg4XlWqQTO5Z3c1Y',
  '1ugk8Xx-LHYD7xrarxE01pG96fIA5Po7OMdjQ8htrys0',
  '1rlN0iNEG_beYHBX7VRsoJ6QQsMerKxian8OJni0Ha9A',
  '10mLbrtKEa7g9wSfT-Iprjfm4KuOY9YBd-yfof_Z-Ckw',
  '14mDxiC6v8Xf_Eq4s-WC1xgxvjBvF2lWHMnNNB_qH-UE',
  '1IOPpgtydsZegD0RNP246c0Rq5asvdU6RJZ7MJ1c1KCs',
  '1cF4lX-lotjbV2GSDOqpsfwFuQK2TJcxg8w1RsCMMBLE',
  '1a-6dDufswdWaOJ2oqtzZD4j6ncj5EEvtbi8xo3019K4',
  '1b-bv_9mAxnTNWz2ve0n0OeBj4UrhCB5X3DHXsG5EOc4',
];

function maxFirestoreReads(): number {
  const raw = process.env['LIMS_BACKUP_MAX_FIRESTORE_READS'];
  if (!raw) return 40_000;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 49_000) {
    throw new Error('LIMS_BACKUP_MAX_FIRESTORE_READS phải là số nguyên từ 1 đến 49000.');
  }
  return value;
}

export function resolvedBackupSourceFolderIds(): string[] {
  const configured = driveSourceFolderIds();
  const coaFolderId = process.env['LIMS_DRIVE_COA_FOLDER_ID']?.trim() || DEFAULT_DRIVE_COA_FOLDER_ID;
  return [...new Set([...(configured.length ? configured : [DEFAULT_DRIVE_ROOT_FOLDER_ID]), coaFolderId])];
}

export function resolvedBackupTemplateIds(): string[] {
  const configured = driveTemplateIds();
  let sourceTemplateIds: string[] = [];
  try {
    sourceTemplateIds = readAppsScriptSourceSnapshot().templateIds;
  } catch {
    // The create function fails closed if the source bundle is absent; status
    // still reports configured/default template coverage when its optional
    // source files are not mounted.
  }
  // Keep the checked-in template catalog in scope even when an environment
  // override is present; omitting a currently-used form would make the
  // resulting backup look successful while losing a report template.
  return [...new Set([...configured, ...DEFAULT_DRIVE_TEMPLATE_IDS, ...sourceTemplateIds])];
}

function backupId(): string {
  return `bkp_${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}_${randomBytes(5).toString('hex')}`;
}

function partFromEncryptedJson(
  client: DriveBackupClient,
  key: BackupKey,
  parentId: string,
  name: string,
  category: BackupPartManifest['category'],
  value: unknown,
): Promise<BackupPartManifest> {
  const plaintext = Buffer.from(JSON.stringify(value), 'utf8');
  const ciphertext = encryptBackupPayload(plaintext, key);
  return client.uploadBytes(`${safeBackupName(name)}.json.enc`, 'application/octet-stream', parentId, ciphertext)
    .then(uploaded => ({
      name: `${safeBackupName(name)}.json.enc`,
      driveFileId: uploaded.id,
      category,
      recordCount: 1,
      plaintextBytes: plaintext.byteLength,
      ciphertextBytes: ciphertext.byteLength,
      plaintextSha256: sha256(plaintext),
      ciphertextSha256: sha256(ciphertext),
    }));
}

async function uploadAuthRecords(
  client: DriveBackupClient,
  key: BackupKey,
  parentId: string,
): Promise<{ parts: BackupPartManifest[]; userCount: number; passwordHashesIncluded: boolean; uids: Set<string> }> {
  const parts: BackupPartManifest[] = [];
  let userCount = 0;
  let passwordHashesIncluded = false;
  const uids = new Set<string>();
  const writer = new EncryptedNdjsonPartWriter({
    client,
    key,
    parentId,
    category: 'auth',
    partPrefix: 'auth-users',
    onPart: part => parts.push(part),
  });
  let pageToken: string | undefined;
  do {
    const page = await getAuth().listUsers(1000, pageToken);
    for (const user of page.users) {
      const raw = user.toJSON() as Record<string, unknown>;
      // UserRecord does not contain live access/session tokens. Keep provider,
      // claims and metadata, but never copy any accidentally-added token key.
      const data = Object.fromEntries(Object.entries(raw).filter(([key]) =>
        !['refreshToken', 'accessToken', 'idToken', 'sessionCookie'].includes(key)));
      if (typeof data['passwordHash'] === 'string' || typeof data['passwordSalt'] === 'string') passwordHashesIncluded = true;
      await writer.append({ uid: user.uid, data });
      userCount++;
      uids.add(user.uid);
    }
    pageToken = page.pageToken;
  } while (pageToken);
  await writer.finish();
  return { parts, userCount, passwordHashesIncluded, uids };
}

function pathCountsFromRecords(stats: Awaited<ReturnType<typeof collectFirestoreBackup>>): BackupManifest['firestore']['pathCounts'] {
  return [...stats.pathCounts.values()].sort((left, right) => left.collection.localeCompare(right.collection)).map(item => ({
    path: item.collection,
    collection: item.collection,
    documentCount: item.documentCount,
    bytes: item.bytes,
  }));
}

function uniqueWarnings(...groups: string[][]): string[] {
  return [...new Set(groups.flat().filter(Boolean))];
}

function minimumDriveFreeBytes(): number {
  const raw = process.env['LIMS_BACKUP_MIN_DRIVE_FREE_BYTES'];
  if (!raw) return 0;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('LIMS_BACKUP_MIN_DRIVE_FREE_BYTES phải là số nguyên không âm.');
  return value;
}

function driveFreeBytes(quota: DriveStorageQuota): number | undefined {
  const limit = Number(quota.limit);
  const usage = Number(quota.usage);
  if (!Number.isFinite(limit) || limit <= 0 || !Number.isFinite(usage) || usage < 0) return undefined;
  return Math.max(0, limit - usage);
}

export async function runBackup(input: RunBackupInput): Promise<RunBackupResult> {
  const appId = input.appId || input.actor.appId || DEFAULT_BACKUP_APP_ID;
  if (!/^[A-Za-z0-9_-]+$/.test(appId)) throw new Error('appId backup không hợp lệ.');
  const key = input.key || backupEncryptionKey();
  const startedAt = new Date().toISOString();
  const snapshot = {
    consistency: 'LOGICAL_CONSISTENT_READ' as const,
    startedAt,
  };
  const id = backupId();
  const parentFolderId = input.backupParentFolderId || backupDriveFolderId();
  const driveStorageBefore = await input.client.getStorageQuota();
  const freeDriveBytes = driveFreeBytes(driveStorageBefore);
  const requiredFreeDriveBytes = minimumDriveFreeBytes();
  if (freeDriveBytes !== undefined && freeDriveBytes < requiredFreeDriveBytes) {
    throw new Error(`Google Drive còn ${freeDriveBytes} bytes trống, thấp hơn ngưỡng backup ${requiredFreeDriveBytes} bytes.`);
  }
  const backupFolder = await input.client.createFolder(`LIMS_BACKUP_${id}`, parentFolderId);
  const firestoreFolder = await input.client.createFolder('firestore', backupFolder.id);
  const authFolder = await input.client.createFolder('auth', backupFolder.id);
  const driveFolder = await input.client.createFolder('drive', backupFolder.id);
  const drivePayloadFolder = await input.client.createFolder('encrypted-assets', driveFolder.id);
  const driveNativeFolder = await input.client.createFolder('native-workspace-copies', driveFolder.id);
  const deploymentFolder = await input.client.createFolder('deployment', backupFolder.id);
  const parts: BackupPartManifest[] = [];
  const driveReferences = new Map<string, DriveReference>();
  const firestoreProfileIds = new Set<string>();
  const firestoreWriter = new EncryptedNdjsonPartWriter({
    client: input.client,
    key,
    parentId: firestoreFolder.id,
    category: 'firestore',
    partPrefix: 'firestore',
    onPart: part => parts.push(part),
  });
  const firestoreStats = await collectFirestoreBackup({
    db: input.db,
    appId,
    onRecord: async (record: FirestoreBackupRecord) => {
      if (!record.excluded) await firestoreWriter.append(record);
      if (!record.excluded && record.collection === 'users') firestoreProfileIds.add(record.documentId);
    },
    onDriveReference: (value: unknown, path: string) => {
      for (const reference of extractDriveFileIds(value)) {
        const existing = driveReferences.get(reference.fileId) || { fileId: reference.fileId, referencedBy: new Set<string>() };
        existing.referencedBy.add(`${path}#${reference.fieldPath}`);
        driveReferences.set(reference.fileId, existing);
      }
    },
    maxFirestoreReads: maxFirestoreReads(),
  });
  await firestoreWriter.finish();

  const authResult = await uploadAuthRecords(input.client, key, authFolder.id);
  parts.push(...authResult.parts);
  const authWithoutProfileCount = [...authResult.uids].filter(uid => !firestoreProfileIds.has(uid)).length;
  const profileWithoutAuthCount = [...firestoreProfileIds].filter(uid => !authResult.uids.has(uid)).length;

  const appsScriptSnapshot = readAppsScriptSourceSnapshot();
  const sourceFolderIds = resolvedBackupSourceFolderIds();
  const templateIds = [...new Set([...resolvedBackupTemplateIds(), ...appsScriptSnapshot.templateIds])];
  const appsScriptId = appsScriptSnapshot.deployment.scriptId;
  let liveAppsScriptSnapshot: AppsScriptLiveSnapshot | undefined;
  let appsScriptLiveError: string | undefined;
  if (appsScriptId) {
    try {
      liveAppsScriptSnapshot = await readAppsScriptLiveSnapshot(input.client, appsScriptId);
    } catch (error) {
      appsScriptLiveError = `Không thể chụp project/deployment Apps Script đang chạy (${appsScriptId}): ${error instanceof Error ? error.message : String(error)}`;
    }
  } else {
    appsScriptLiveError = 'Không xác định được Apps Script scriptId từ LIMS_APPS_SCRIPT_ID hoặc .clasp.json; không thể chứng minh deployment đang chạy đã được backup.';
  }
  const appsScriptContentById = liveAppsScriptSnapshot
    ? new Map([[liveAppsScriptSnapshot.scriptId, Buffer.from(JSON.stringify(liveAppsScriptSnapshot.content), 'utf8')]])
    : new Map<string, Buffer>();
  const driveResult = await backupDriveAssets(
    input.client,
    key,
    drivePayloadFolder.id,
    driveNativeFolder.id,
    driveReferences,
    sourceFolderIds,
    templateIds,
    liveAppsScriptSnapshot ? [liveAppsScriptSnapshot.scriptId] : [],
    appsScriptContentById,
  );
  const deploymentManifest = {
    manifestVersion: 1,
    projectId: input.projectId,
    appId,
    releaseVersion: input.releaseVersion || process.env['RELEASE_VERSION'] || undefined,
    sourceFolderIds,
    templateIds,
    backupParentFolderId: parentFolderId,
    backupFolderId: backupFolder.id,
    requiredEnvironmentVariables: [
      'FIREBASE_SERVICE_ACCOUNT',
      'LIMS_BACKUP_ENCRYPTION_KEY',
      'LIMS_BACKUP_ENCRYPTION_KEY_ID',
      'LIMS_BACKUP_DRIVE_FOLDER_ID',
      'GOOGLE_OAUTH_CLIENT_ID',
      'GOOGLE_OAUTH_CLIENT_SECRET',
      'LIMS_BACKUP_DRIVE_REFRESH_TOKEN',
      'Google OAuth scopes: drive + script.projects.readonly + script.deployments.readonly',
    ],
    sourceFiles: appsScriptSnapshot.files,
    deployment: appsScriptSnapshot.deployment,
    live: liveAppsScriptSnapshot || null,
    liveCapture: liveAppsScriptSnapshot
      ? { status: 'PASSED' as const, capturedAt: liveAppsScriptSnapshot.capturedAt }
      : { status: 'FAILED' as const, error: appsScriptLiveError },
    restoreNotes: [
      'OAuth/session tokens are not restored.',
      'FCM tokens are not restored; clients register again.',
      'Native Google Workspace copies are private convenience copies; encrypted exported payloads are authoritative for disaster recovery.',
      'Apps Script live content and deployment metadata are encrypted in this part; redeployment after disaster recovery remains a controlled operator action.',
    ],
  };
  parts.push(await partFromEncryptedJson(input.client, key, deploymentFolder.id, 'apps-script-deployment', 'deployment', deploymentManifest));

  let driveStorageAfter: DriveStorageQuota | undefined;
  let driveStorageError: string | undefined;
  try {
    driveStorageAfter = await input.client.getStorageQuota();
  } catch (error) {
    driveStorageError = `Không thể ghi nhận Drive storage quota sau backup: ${error instanceof Error ? error.message : String(error)}`;
  }

  const unknownCollections = [...firestoreStats.unknownCollections].sort();
  const warnings = uniqueWarnings(
    driveResult.warnings,
    firestoreStats.orphanSubcollectionCount > 0 ? [`Detected ${firestoreStats.orphanSubcollectionCount} orphan nested document(s); they were included by collection-group scan.`] : [],
    authWithoutProfileCount > 0 ? [`Detected ${authWithoutProfileCount} Firebase Auth user(s) without a Firestore users profile.`] : [],
    profileWithoutAuthCount > 0 ? [`Detected ${profileWithoutAuthCount} Firestore users profile(s) without a Firebase Auth user.`] : [],
    unknownCollections.map(path => `Collection outside the catalog was included but needs schema review: ${path}`),
  );
  const errors = [...driveResult.errors];
  if (appsScriptLiveError) errors.push(appsScriptLiveError);
  if (driveStorageError) errors.push(driveStorageError);
  if (unknownCollections.length && process.env['LIMS_BACKUP_ALLOW_UNKNOWN_COLLECTIONS'] !== 'true') {
    errors.push(`Unknown Firestore collections found: ${unknownCollections.join(', ')}`);
  }
  if (!sourceFolderIds.length || !templateIds.length) {
    errors.push('Drive source folder/template catalog is empty; Drive coverage cannot be certified.');
  }
  const status = errors.length ? 'FAILED' : warnings.length ? 'COMPLETED_WITH_WARNINGS' : 'COMPLETED';
  const manifest: BackupManifest = {
    backupId: id,
    formatVersion: BACKUP_FORMAT_VERSION,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    serializerVersion: BACKUP_SERIALIZER_VERSION,
    status,
    projectId: input.projectId,
    appId,
    releaseVersion: input.releaseVersion || process.env['RELEASE_VERSION'] || undefined,
    actorUid: input.actor.uid,
    actorEmail: input.actor.email,
    startedAt,
    completedAt: new Date().toISOString(),
    snapshot: { ...snapshot, completedAt: new Date().toISOString() },
    driveBackupFolderId: backupFolder.id,
    firestore: {
      topLevelCollections: [...FIRESTORE_COLLECTION_CATALOG],
      rootCollections: [...FIRESTORE_ROOT_COLLECTION_CATALOG],
      nestedPatterns: FIRESTORE_SUBCOLLECTION_CATALOG.map(item => `${item.parentCollection}/{id}/${item.collection}`),
      pathCounts: pathCountsFromRecords(firestoreStats),
      totalDocuments: [...firestoreStats.pathCounts.values()].reduce((sum, item) => sum + item.documentCount, 0),
      excludedCollections: [...firestoreStats.excludedCounts.entries()].map(([collection, documentCount]) => ({ collection, reason: 'ephemeral session data; never restored', documentCount })),
      unknownCollections,
      orphanSubcollectionCount: firestoreStats.orphanSubcollectionCount,
      scrubbedFieldCount: firestoreStats.scrubbedFieldCount,
    },
    auth: {
      userCount: authResult.userCount,
      passwordHashesIncluded: authResult.passwordHashesIncluded,
      firestoreProfileCount: firestoreProfileIds.size,
      authWithoutProfileCount,
      profileWithoutAuthCount,
    },
    drive: {
      assetCount: driveResult.assets.length,
      templateCount: driveResult.assets.filter(item => item.isTemplate).length,
      folderCount: driveResult.folders.length,
      inaccessibleCount: driveResult.assets.filter(item => item.status === 'INACCESSIBLE').length + driveResult.folders.filter(item => item.status === 'INACCESSIBLE').length,
      unsupportedCount: driveResult.assets.filter(item => item.status === 'UNSUPPORTED').length,
      folders: driveResult.folders,
      assets: driveResult.assets,
    },
    parts,
    warnings,
    errors,
    quotaUsage: {
      firestoreReads: firestoreStats.firestoreReads,
      firestoreWrites: 0,
      driveApiRequests: input.client.stats.apiRequests,
      driveBytesUploaded: input.client.stats.bytesUploaded,
      driveStorageBefore,
      driveStorageAfter,
    },
    restorePolicies: {
      defaultMode: 'RECOVER_MISSING',
      neverRestoreCollections: [...NEVER_RESTORE_COLLECTIONS],
      neverRestoreFields: [...NEVER_RESTORE_FIELD_NAMES],
    },
    encryption: {
      algorithm: 'aes-256-gcm',
      keyId: key.keyId,
      perPartIv: true,
    },
  };
  const manifestPlaintext = Buffer.from(JSON.stringify(manifest), 'utf8');
  const manifestCiphertext = encryptBackupPayload(manifestPlaintext, key);
  const manifestFile = await input.client.uploadBytes('manifest.json.enc', 'application/octet-stream', backupFolder.id, manifestCiphertext);
  if (manifest.status === 'FAILED') return { manifest, backupFolderId: backupFolder.id, manifestFileId: manifestFile.id };

  // A backup is not certified merely because the upload request succeeded.
  // Read the encrypted objects back from Drive and verify every checksum and
  // record count before returning success to the manager UI.
  const verification = await verifyBackup(input.client, backupFolder.id, key);
  const verifiedManifest: BackupManifest = {
    ...manifest,
    status: verification.verified ? manifest.status : 'FAILED',
    warnings: [...new Set([...manifest.warnings, ...verification.warnings])],
    errors: [...new Set([...manifest.errors, ...verification.errors])],
    verification: {
      status: verification.verified ? 'PASSED' : 'FAILED',
      checkedAt: new Date().toISOString(),
      checkedParts: verification.checkedParts,
      checkedAssets: verification.checkedAssets,
      checkedBytes: verification.checkedBytes,
      errors: verification.verified ? undefined : verification.errors,
    },
  };
  const verifiedCiphertext = encryptBackupPayload(Buffer.from(JSON.stringify(verifiedManifest), 'utf8'), key);
  await input.client.updateBytes(manifestFile.id, 'application/octet-stream', verifiedCiphertext);
  return { manifest: verifiedManifest, backupFolderId: backupFolder.id, manifestFileId: manifestFile.id };
}

export { backupDriveFolderId };
