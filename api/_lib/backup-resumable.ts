import { randomBytes } from 'node:crypto';
import { getAuth } from 'firebase-admin/auth';
import type {
  BackupActor,
  BackupManifest,
  BackupPartManifest,
  BackupPathCount,
} from './backup-contract.js';
import {
  BACKUP_FORMAT_VERSION,
  BACKUP_SCHEMA_VERSION,
  BACKUP_SERIALIZER_VERSION,
  appPath,
  FIRESTORE_COLLECTION_CATALOG,
  FIRESTORE_ROOT_COLLECTION_CATALOG,
  FIRESTORE_SUBCOLLECTION_CATALOG,
  NEVER_RESTORE_COLLECTIONS,
  NEVER_RESTORE_FIELD_NAMES,
  safeBackupName,
} from './backup-contract.js';
import {
  backupEncryptionKey,
  encryptBackupPayload,
  decryptBackupPayload,
  sha256,
  type BackupKey,
} from './backup-crypto.js';
import {
  backupDriveFolderId,
  DriveBackupClient,
  type DriveStorageQuota,
} from './backup-drive.js';
import {
  collectDriveBackupPlan,
  backupSingleDriveAsset,
  type DriveFolderManifest,
} from './drive-assets-backup.js';
import {
  collectFirestoreBackupChunk,
  collectFirestoreBackup,
  createFirestoreBackupQueue,
  extractDriveFileIds,
  type FirestoreBackupQueueState,
  type FirestoreBackupRecord,
} from './firestore-backup.js';
import { EncryptedNdjsonPartWriter } from './backup-writer.js';
import {
  readAppsScriptLiveSnapshot,
  readAppsScriptSourceSnapshot,
  type AppsScriptLiveSnapshot,
} from './apps-script-backup.js';
import { maxAuthUsersPerPage, resolvedBackupSourceFolderIds, resolvedBackupTemplateIds } from './backup-engine.js';

const SESSION_FILE_NAME = 'backup-session-v1.json.enc';
export type BackupSessionPhase =
  | 'FIRESTORE'
  | 'AUTH'
  | 'APPS_SCRIPT'
  | 'DRIVE_PLAN'
  | 'DRIVE_ASSETS'
  | 'FINALIZE'
  | 'VERIFY'
  | 'COMPLETED'
  | 'FAILED';

interface SerializableDriveReference {
  fileId: string;
  referencedBy: string[];
}

export interface BackupSession {
  version: 1;
  backupId: string;
  projectId: string;
  appId: string;
  actor: BackupActor;
  releaseVersion?: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  phase: BackupSessionPhase;
  backupParentFolderId: string;
  folders: {
    backup: string;
    firestore: string;
    auth: string;
    drive: string;
    encryptedAssets: string;
    nativeCopies: string;
    deployment: string;
  };
  firestore: {
    complete: boolean;
    queue?: FirestoreBackupQueueState;
    pathCounts: BackupPathCount[];
    excludedCounts: Array<{ collection: string; documentCount: number }>;
    unknownCollections: string[];
    orphanSubcollectionCount: number;
    scrubbedFieldCount: number;
    firestoreReads: number;
    parts: BackupPartManifest[];
    profileIds: string[];
    driveReferences: SerializableDriveReference[];
  };
  auth: {
    complete: boolean;
    nextPageToken?: string;
    partIndex: number;
    parts: BackupPartManifest[];
    userCount: number;
    passwordHashesIncluded: boolean;
    uids: string[];
  };
  appsScript: {
    complete: boolean;
    scriptId?: string;
    liveCapture: 'PASSED' | 'FAILED' | 'NOT_ATTEMPTED';
    liveError?: string;
    part?: BackupPartManifest;
  };
  drive: {
    planned: boolean;
    folders: DriveFolderManifest[];
    files: SerializableDriveReference[];
    nextAssetIndex: number;
    assets: BackupManifest['drive']['assets'];
    warnings: string[];
    errors: string[];
  };
  quota: {
    firestoreReads: number;
    driveApiRequests: number;
    driveBytesUploaded: number;
    driveStorageBefore?: DriveStorageQuota;
    driveStorageAfter?: DriveStorageQuota;
  };
  manifestFileId?: string;
  verification?: {
    status: 'PASSED' | 'FAILED';
    checkedParts: number;
    checkedAssets: number;
    checkedBytes: number;
    errors: string[];
    warnings: string[];
  };
  auditLogged?: boolean;
  error?: string;
}

export interface BackupSessionStep {
  session: BackupSession;
  done: boolean;
  result?: {
    manifest: BackupManifest;
    manifestFileId: string;
  };
}

function validDriveId(value: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(value);
}

function assertRecord(value: unknown): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Backup session không phải object.');
}

function parseSession(value: unknown, folderId: string): BackupSession {
  assertRecord(value);
  if (value['version'] !== 1 || typeof value['backupId'] !== 'string' || typeof value['projectId'] !== 'string'
    || typeof value['appId'] !== 'string' || typeof value['startedAt'] !== 'string'
    || typeof value['updatedAt'] !== 'string' || typeof value['phase'] !== 'string'
    || !validDriveId(folderId) || !validDriveId(String(value['backupParentFolderId'] || ''))) {
    throw new Error('Backup session thiếu trường định danh bắt buộc.');
  }
  if (!['FIRESTORE', 'AUTH', 'APPS_SCRIPT', 'DRIVE_PLAN', 'DRIVE_ASSETS', 'FINALIZE', 'VERIFY', 'COMPLETED', 'FAILED'].includes(value['phase'] as string)) {
    throw new Error('Backup session có phase không hợp lệ.');
  }
  const session = value as unknown as BackupSession;
  if (session.folders?.backup !== folderId) throw new Error('Backup session không khớp thư mục backup.');
  if (!validDriveId(session.folders.firestore) || !validDriveId(session.folders.auth)
    || !validDriveId(session.folders.drive) || !validDriveId(session.folders.encryptedAssets)
    || !validDriveId(session.folders.nativeCopies) || !validDriveId(session.folders.deployment)) {
    throw new Error('Backup session có thư mục con không hợp lệ.');
  }
  return session;
}

export class BackupSessionStore {
  private fileId?: string;

  constructor(
    private readonly client: DriveBackupClient,
    private readonly key: BackupKey,
    private readonly folderId: string,
  ) {}

  async load(): Promise<BackupSession> {
    let matches = [] as Awaited<ReturnType<DriveBackupClient['listChildren']>>;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      matches = (await this.client.listChildren(this.folderId)).filter(item => item.name === SESSION_FILE_NAME);
      if (matches.length === 1 || matches.length > 1) break;
      if (attempt < 3) {
        await new Promise<void>(resolve => setTimeout(resolve, 250 * (attempt + 1)));
      }
    }
    if (matches.length !== 1) throw new Error('Không tìm thấy duy nhất backup session trong thư mục backup.');
    this.fileId = matches[0].id;
    const ciphertext = await this.client.download(this.fileId);
    return parseSession(JSON.parse(decryptBackupPayload(ciphertext, this.key).toString('utf8')), this.folderId);
  }

  async save(session: BackupSession): Promise<void> {
    session.updatedAt = new Date().toISOString();
    const ciphertext = encryptBackupPayload(Buffer.from(JSON.stringify(session), 'utf8'), this.key);
    if (this.fileId) {
      await this.client.updateBytes(this.fileId, 'application/octet-stream', ciphertext);
      return;
    }
    const uploaded = await this.client.uploadBytes(SESSION_FILE_NAME, 'application/octet-stream', this.folderId, ciphertext);
    this.fileId = uploaded.id;
  }
}

function backupId(): string {
  return `bkp_${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}_${randomBytes(5).toString('hex')}`;
}

function maxFirestoreReads(): number {
  const raw = process.env['LIMS_BACKUP_MAX_FIRESTORE_READS'];
  if (!raw) return 40_000;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 49_000) {
    throw new Error('LIMS_BACKUP_MAX_FIRESTORE_READS phải là số nguyên từ 1 đến 49000.');
  }
  return value;
}

function firestoreDocumentsPerRequest(): number {
  const raw = process.env['LIMS_BACKUP_FIRESTORE_DOCS_PER_REQUEST'];
  // Keep enough headroom for Drive part uploads while avoiding a long series
  // of tiny serverless invocations for a production-sized LIMS dataset.
  if (!raw) return 500;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 1000) {
    throw new Error('LIMS_BACKUP_FIRESTORE_DOCS_PER_REQUEST phải là số nguyên từ 1 đến 1000.');
  }
  return value;
}

function driveAssetsPerRequest(): number {
  const raw = process.env['LIMS_BACKUP_DRIVE_ASSETS_PER_REQUEST'];
  if (!raw) return 3;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 25) {
    throw new Error('LIMS_BACKUP_DRIVE_ASSETS_PER_REQUEST phải là số nguyên từ 1 đến 25.');
  }
  return value;
}

function driveAssetsConcurrency(): number {
  const raw = process.env['LIMS_BACKUP_DRIVE_ASSET_CONCURRENCY'];
  if (!raw) return 5;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 10) {
    throw new Error('LIMS_BACKUP_DRIVE_ASSET_CONCURRENCY phải là số nguyên từ 1 đến 10.');
  }
  return value;
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

function mergePathCounts(
  existing: BackupPathCount[],
  stats: Awaited<ReturnType<typeof collectFirestoreBackupChunk>>['stats'],
): BackupPathCount[] {
  const merged = new Map(existing.map(item => [item.path, { ...item }]));
  for (const item of stats.pathCounts.values()) {
    const current = merged.get(item.collection) || {
      path: item.collection,
      collection: item.collection,
      documentCount: 0,
      bytes: 0,
    };
    current.documentCount += item.documentCount;
    current.bytes += item.bytes;
    merged.set(item.collection, current);
  }
  return [...merged.values()].sort((left, right) => left.collection.localeCompare(right.collection));
}

function mergeCountMaps(
  existing: Array<{ collection: string; documentCount: number }>,
  additions: Map<string, number>,
): Array<{ collection: string; documentCount: number }> {
  const merged = new Map(existing.map(item => [item.collection, item.documentCount]));
  for (const [collection, count] of additions) merged.set(collection, (merged.get(collection) || 0) + count);
  return [...merged.entries()].map(([collection, documentCount]) => ({ collection, documentCount }))
    .sort((left, right) => left.collection.localeCompare(right.collection));
}

function uniqueStrings(...groups: string[][]): string[] {
  return [...new Set(groups.flat().filter(Boolean))];
}

const BACKUP_SESSION_LOCK_TTL_MS = 240_000;
const BACKUP_SESSION_BUSY_ERROR = 'BACKUP_SESSION_BUSY';

type BackupDatabase = Parameters<typeof collectFirestoreBackup>[0]['db'];

async function withBackupSessionLock<T>(
  db: BackupDatabase,
  session: BackupSession,
  work: () => Promise<T>,
): Promise<T> {
  const lockRef = db.doc(`${appPath(session.appId)}/backup_locks/${safeBackupName(session.backupId)}`);
  const owner = randomBytes(16).toString('hex');
  const now = Date.now();
  const expiresAt = now + BACKUP_SESSION_LOCK_TTL_MS;

  await db.runTransaction(async transaction => {
    const snapshot = await transaction.get(lockRef);
    const current = snapshot.data() as { owner?: string; expiresAt?: number } | undefined;
    if (current && typeof current.expiresAt === 'number' && current.expiresAt > now) {
      throw new Error(BACKUP_SESSION_BUSY_ERROR);
    }
    transaction.set(lockRef, {
      owner,
      backupId: session.backupId,
      updatedAt: new Date(now).toISOString(),
      expiresAt,
    });
  });

  try {
    return await work();
  } finally {
    try {
      await db.runTransaction(async transaction => {
        const snapshot = await transaction.get(lockRef);
        const current = snapshot.data() as { owner?: string } | undefined;
        if (snapshot.exists && current?.owner === owner) transaction.delete(lockRef);
      });
    } catch (error) {
      console.warn('[BackupLock] Could not release session lock:', error instanceof Error ? error.message : error);
    }
  }
}

function accountForClientStats(session: BackupSession, client: DriveBackupClient): void {
  session.quota.driveApiRequests += client.stats.apiRequests;
  session.quota.driveBytesUploaded += client.stats.bytesUploaded;
}

async function createFolders(
  client: DriveBackupClient,
  key: BackupKey,
  actor: BackupActor,
  projectId: string,
  releaseVersion?: string,
): Promise<{ session: BackupSession; store: BackupSessionStore }> {
  const parentFolderId = backupDriveFolderId();
  const storageBefore = await client.getStorageQuota();
  const freeDriveBytes = driveFreeBytes(storageBefore);
  if (freeDriveBytes !== undefined && freeDriveBytes < minimumDriveFreeBytes()) {
    throw new Error(`Google Drive còn ${freeDriveBytes} bytes trống, thấp hơn ngưỡng backup ${minimumDriveFreeBytes()} bytes.`);
  }
  const id = backupId();
  const backupFolder = await client.createFolder(`LIMS_BACKUP_${id}`, parentFolderId);
  const firestoreFolder = await client.createFolder('firestore', backupFolder.id);
  const authFolder = await client.createFolder('auth', backupFolder.id);
  const driveFolder = await client.createFolder('drive', backupFolder.id);
  const encryptedAssets = await client.createFolder('encrypted-assets', driveFolder.id);
  const nativeCopies = await client.createFolder('native-workspace-copies', driveFolder.id);
  const deployment = await client.createFolder('deployment', backupFolder.id);
  const now = new Date().toISOString();
  const session: BackupSession = {
    version: 1,
    backupId: id,
    projectId,
    appId: actor.appId,
    actor,
    releaseVersion,
    startedAt: now,
    updatedAt: now,
    phase: 'FIRESTORE',
    backupParentFolderId: parentFolderId,
    folders: {
      backup: backupFolder.id,
      firestore: firestoreFolder.id,
      auth: authFolder.id,
      drive: driveFolder.id,
      encryptedAssets: encryptedAssets.id,
      nativeCopies: nativeCopies.id,
      deployment: deployment.id,
    },
    firestore: {
      complete: false,
      pathCounts: [],
      excludedCounts: [],
      unknownCollections: [],
      orphanSubcollectionCount: 0,
      scrubbedFieldCount: 0,
      firestoreReads: 0,
      parts: [],
      profileIds: [],
      driveReferences: [],
    },
    auth: {
      complete: false,
      partIndex: 0,
      parts: [],
      userCount: 0,
      passwordHashesIncluded: false,
      uids: [],
    },
    appsScript: {
      complete: false,
      liveCapture: 'NOT_ATTEMPTED',
    },
    drive: {
      planned: false,
      folders: [],
      files: [],
      nextAssetIndex: 0,
      assets: [],
      warnings: [],
      errors: [],
    },
    quota: {
      firestoreReads: 0,
      driveApiRequests: 0,
      driveBytesUploaded: 0,
      driveStorageBefore: storageBefore,
    },
  };
  const store = new BackupSessionStore(client, key, backupFolder.id);
  accountForClientStats(session, client);
  await store.save(session);
  return { session, store };
}

async function findLatestOpenSession(
  client: DriveBackupClient,
  actor: BackupActor,
  projectId: string,
  key: BackupKey,
): Promise<{ session: BackupSession; store: BackupSessionStore } | undefined> {
  const children = await client.listChildren(backupDriveFolderId());
  const folders = children
    .filter(item => item.mimeType === 'application/vnd.google-apps.folder' && item.name.startsWith('LIMS_BACKUP_'))
    .sort((left, right) => String(right.createdTime || '').localeCompare(String(left.createdTime || '')));
  for (const folder of folders) {
    try {
      const store = new BackupSessionStore(client, key, folder.id);
      const session = await store.load();
      if (session.actor.uid !== actor.uid || session.projectId !== projectId) continue;
      if (session.phase === 'COMPLETED' || session.phase === 'FAILED') continue;
      return { session, store };
    } catch {
      // Old/manual backup folders and invalid partial attempts do not contain
      // a resumable session; leave them untouched and inspect the next one.
    }
  }
  return undefined;
}

export async function createBackupSession(
  client: DriveBackupClient,
  actor: BackupActor,
  projectId: string,
  releaseVersion?: string,
  key = backupEncryptionKey(),
): Promise<{ session: BackupSession; store: BackupSessionStore }> {
  const open = await findLatestOpenSession(client, actor, projectId, key);
  if (open) {
    accountForClientStats(open.session, client);
    await open.store.save(open.session);
    return { session: open.session, store: open.store };
  }
  const created = await createFolders(client, key, actor, projectId, releaseVersion);
  return created;
}

async function runFirestorePhase(
  session: BackupSession,
  store: BackupSessionStore,
  client: DriveBackupClient,
  db: Parameters<typeof collectFirestoreBackup>[0]['db'],
  key: BackupKey,
): Promise<void> {
  if (session.firestore.complete) {
    session.phase = 'AUTH';
    await store.save(session);
    return;
  }
  if (!session.firestore.queue) {
    session.firestore.queue = await createFirestoreBackupQueue(db, session.appId);
    session.firestore.unknownCollections = uniqueStrings(
      session.firestore.unknownCollections,
      session.firestore.queue.unknownCollections,
    );
    await store.save(session);
  }
  const parts: BackupPartManifest[] = [];
  const profileIds = new Set(session.firestore.profileIds);
  const referenceMap = new Map<string, { fileId: string; referencedBy: Set<string> }>(
    session.firestore.driveReferences.map(reference => [reference.fileId, {
      fileId: reference.fileId,
      referencedBy: new Set(reference.referencedBy),
    }]),
  );
  const writer = new EncryptedNdjsonPartWriter({
    client,
    key,
    parentId: session.folders.firestore,
    category: 'firestore',
    partPrefix: 'firestore',
    initialPartIndex: session.firestore.parts.length,
    onPart: part => parts.push(part),
  });
  const chunk = await collectFirestoreBackupChunk({
    db,
    appId: session.appId,
    onRecord: async (record: FirestoreBackupRecord) => {
      if (!record.excluded) await writer.append(record);
      if (!record.excluded && record.collection === 'users') profileIds.add(record.documentId);
    },
    onDriveReference: (value: unknown, path: string) => {
      for (const reference of extractDriveFileIds(value)) {
        const existing = referenceMap.get(reference.fileId) || { fileId: reference.fileId, referencedBy: new Set<string>() };
        existing.referencedBy.add(`${path}#${reference.fieldPath}`);
        referenceMap.set(reference.fileId, existing);
      }
    },
    maxFirestoreReads: maxFirestoreReads(),
    initialFirestoreReads: session.firestore.firestoreReads,
    queue: session.firestore.queue,
    maxDocumentsPerChunk: firestoreDocumentsPerRequest(),
    pageSize: Math.min(50, firestoreDocumentsPerRequest()),
  });
  await writer.finish();
  const stats = chunk.stats;
  const complete = chunk.queue.phase === 'COMPLETE';
  session.firestore = {
    ...session.firestore,
    complete,
    queue: chunk.queue,
    pathCounts: mergePathCounts(session.firestore.pathCounts, stats),
    excludedCounts: mergeCountMaps(session.firestore.excludedCounts, stats.excludedCounts),
    unknownCollections: uniqueStrings(session.firestore.unknownCollections, [...stats.unknownCollections]),
    orphanSubcollectionCount: session.firestore.orphanSubcollectionCount + stats.orphanSubcollectionCount,
    scrubbedFieldCount: session.firestore.scrubbedFieldCount + stats.scrubbedFieldCount,
    firestoreReads: session.firestore.firestoreReads + stats.firestoreReads,
    parts: [...session.firestore.parts, ...parts],
    profileIds: [...profileIds].sort(),
    driveReferences: [...referenceMap.values()].map(reference => ({
      fileId: reference.fileId,
      referencedBy: [...reference.referencedBy].sort(),
    })),
  };
  session.quota.firestoreReads = session.firestore.firestoreReads;
  session.phase = complete ? 'AUTH' : 'FIRESTORE';
  accountForClientStats(session, client);
  await store.save(session);
}

async function runAuthPhase(
  session: BackupSession,
  store: BackupSessionStore,
  client: DriveBackupClient,
  key: BackupKey,
): Promise<void> {
  if (session.auth.complete) {
    session.phase = 'APPS_SCRIPT';
    await store.save(session);
    return;
  }
  const pageToken = session.auth.nextPageToken;
  const page = await getAuth().listUsers(maxAuthUsersPerPage(), pageToken);
  console.info(`[BackupAuth] Session ${session.backupId}: read ${page.users.length} user(s) from one page.`);
  const pageParts: BackupPartManifest[] = [];
  const writer = new EncryptedNdjsonPartWriter({
    client,
    key,
    parentId: session.folders.auth,
    category: 'auth',
    partPrefix: 'auth-users',
    initialPartIndex: session.auth.partIndex,
    onPart: part => pageParts.push(part),
  });
  for (const user of page.users) {
    const raw = user.toJSON() as Record<string, unknown>;
    const data = Object.fromEntries(Object.entries(raw).filter(([key]) =>
      !['refreshToken', 'accessToken', 'idToken', 'sessionCookie'].includes(key)));
    if (typeof data['passwordHash'] === 'string' || typeof data['passwordSalt'] === 'string') session.auth.passwordHashesIncluded = true;
    await writer.append({ uid: user.uid, data });
    session.auth.userCount++;
    session.auth.uids.push(user.uid);
  }
  await writer.finish();
  session.auth.parts.push(...pageParts);
  session.auth.partIndex += pageParts.length;
  session.auth.nextPageToken = page.pageToken;
  if (!page.pageToken) {
    session.auth.complete = true;
    session.phase = 'APPS_SCRIPT';
  }
  accountForClientStats(session, client);
  await store.save(session);
}

async function runAppsScriptPhase(
  session: BackupSession,
  store: BackupSessionStore,
  client: DriveBackupClient,
  key: BackupKey,
): Promise<void> {
  if (session.appsScript.complete) {
    session.phase = 'DRIVE_PLAN';
    await store.save(session);
    return;
  }
  const source = readAppsScriptSourceSnapshot();
  const sourceFolderIds = resolvedBackupSourceFolderIds();
  const templateIds = [...new Set([...resolvedBackupTemplateIds(), ...source.templateIds])];
  const scriptId = source.deployment.scriptId;
  let live: AppsScriptLiveSnapshot | undefined;
  let liveError: string | undefined;
  if (scriptId) {
    try {
      live = await readAppsScriptLiveSnapshot(client, scriptId);
    } catch (error) {
      liveError = `Không thể chụp project/deployment Apps Script đang chạy (${scriptId}): ${error instanceof Error ? error.message : String(error)}`;
    }
  } else {
    liveError = 'Không xác định được Apps Script scriptId từ LIMS_APPS_SCRIPT_ID hoặc .clasp.json.';
  }
  const deploymentManifest = {
    manifestVersion: 1,
    projectId: session.projectId,
    appId: session.appId,
    releaseVersion: session.releaseVersion || process.env['RELEASE_VERSION'] || undefined,
    sourceFolderIds,
    templateIds,
    backupParentFolderId: session.backupParentFolderId,
    backupFolderId: session.folders.backup,
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
    sourceFiles: source.files,
    deployment: source.deployment,
    live: live || null,
    liveCapture: live
      ? { status: 'PASSED' as const, capturedAt: live.capturedAt }
      : { status: 'FAILED' as const, error: liveError },
    restoreNotes: [
      'OAuth/session tokens are not restored.',
      'FCM tokens are not restored; clients register again.',
      'Native Google Workspace copies are private convenience copies; encrypted exported payloads are authoritative for disaster recovery.',
      'Apps Script live content and deployment metadata are encrypted in this part; redeployment after disaster recovery remains a controlled operator action.',
    ],
  };
  const part = await partFromEncryptedJson(client, key, session.folders.deployment, 'apps-script-deployment', 'deployment', deploymentManifest);
  session.appsScript = {
    complete: true,
    scriptId,
    liveCapture: live ? 'PASSED' : 'FAILED',
    liveError,
    part,
  };
  session.phase = 'DRIVE_PLAN';
  session.quota.driveApiRequests += client.stats.apiRequests;
  session.quota.driveBytesUploaded += client.stats.bytesUploaded;
  await store.save(session);
}

async function runDrivePlanPhase(
  session: BackupSession,
  store: BackupSessionStore,
  client: DriveBackupClient,
): Promise<void> {
  if (session.drive.planned) {
    session.phase = session.drive.nextAssetIndex < session.drive.files.length ? 'DRIVE_ASSETS' : 'FINALIZE';
    await store.save(session);
    return;
  }
  const references = new Map(session.firestore.driveReferences.map(reference => [reference.fileId, {
    fileId: reference.fileId,
    referencedBy: new Set(reference.referencedBy),
  }]));
  const source = readAppsScriptSourceSnapshot();
  const templateIds = [...new Set([...resolvedBackupTemplateIds(), ...source.templateIds])];
  const plan = await collectDriveBackupPlan(
    client,
    references,
    resolvedBackupSourceFolderIds(),
    templateIds,
    session.appsScript.scriptId ? [session.appsScript.scriptId] : [],
  );
  session.drive = {
    planned: true,
    folders: plan.folders,
    files: plan.files,
    nextAssetIndex: 0,
    assets: [],
    warnings: [],
    errors: [...plan.errors],
  };
  session.phase = plan.files.length ? 'DRIVE_ASSETS' : 'FINALIZE';
  accountForClientStats(session, client);
  await store.save(session);
}

async function runDriveAssetsPhase(
  session: BackupSession,
  store: BackupSessionStore,
  client: DriveBackupClient,
  key: BackupKey,
): Promise<void> {
  if (session.drive.nextAssetIndex >= session.drive.files.length) {
    session.phase = 'FINALIZE';
    await store.save(session);
    return;
  }
  const start = session.drive.nextAssetIndex;
  const end = Math.min(session.drive.files.length, start + driveAssetsPerRequest());
  const templateIds = [...new Set([...resolvedBackupTemplateIds(), ...readAppsScriptSourceSnapshot().templateIds])];
  const appsScriptIds = session.appsScript.scriptId ? [session.appsScript.scriptId] : [];
  const outcomes: Array<Awaited<ReturnType<typeof backupSingleDriveAsset>>> = [];
  for (let batchStart = start; batchStart < end; batchStart += driveAssetsConcurrency()) {
    const batchEnd = Math.min(end, batchStart + driveAssetsConcurrency());
    const batch = await Promise.all(Array.from({ length: batchEnd - batchStart }, (_, offset) => {
      const index = batchStart + offset;
      return backupSingleDriveAsset(
        client,
        key,
        session.folders.encryptedAssets,
        session.folders.nativeCopies,
        session.drive.files[index],
        index,
        templateIds,
        appsScriptIds,
      );
    }));
    outcomes.push(...batch);
  }
  for (const outcome of outcomes) {
    session.drive.assets.push(outcome.asset);
    session.drive.warnings.push(...outcome.warnings);
    session.drive.errors.push(...outcome.errors);
    session.drive.nextAssetIndex++;
  }
  if (session.drive.nextAssetIndex >= session.drive.files.length) session.phase = 'FINALIZE';
  accountForClientStats(session, client);
  await store.save(session);
}

function buildManifest(session: BackupSession, key: BackupKey): BackupManifest {
  const source = readAppsScriptSourceSnapshot();
  const sourceFolderIds = resolvedBackupSourceFolderIds();
  const templateIds = [...new Set([...resolvedBackupTemplateIds(), ...source.templateIds])];
  const authWithoutProfileCount = session.auth.uids.filter(uid => !session.firestore.profileIds.includes(uid)).length;
  const profileWithoutAuthCount = session.firestore.profileIds.filter(uid => !session.auth.uids.includes(uid)).length;
  const warnings = uniqueStrings(
    session.drive.warnings,
    session.firestore.orphanSubcollectionCount > 0 ? [`Detected ${session.firestore.orphanSubcollectionCount} orphan nested document(s); they were included by collection-group scan.`] : [],
    authWithoutProfileCount > 0 ? [`Detected ${authWithoutProfileCount} Firebase Auth user(s) without a Firestore users profile.`] : [],
    profileWithoutAuthCount > 0 ? [`Detected ${profileWithoutAuthCount} Firestore users profile(s) without a Firebase Auth user.`] : [],
    session.firestore.unknownCollections.map(path => `Collection outside the catalog was included but needs schema review: ${path}`),
  );
  const errors = [...session.drive.errors];
  if (session.appsScript.liveError) errors.push(session.appsScript.liveError);
  if (session.firestore.unknownCollections.length && process.env['LIMS_BACKUP_ALLOW_UNKNOWN_COLLECTIONS'] !== 'true') {
    errors.push(`Unknown Firestore collections found: ${session.firestore.unknownCollections.join(', ')}`);
  }
  if (!sourceFolderIds.length || !templateIds.length) {
    errors.push('Drive source folder/template catalog is empty; Drive coverage cannot be certified.');
  }
  const status = errors.length ? 'FAILED' : warnings.length ? 'COMPLETED_WITH_WARNINGS' : 'COMPLETED';
  return {
    backupId: session.backupId,
    formatVersion: BACKUP_FORMAT_VERSION,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    serializerVersion: BACKUP_SERIALIZER_VERSION,
    status,
    projectId: session.projectId,
    appId: session.appId,
    releaseVersion: session.releaseVersion || process.env['RELEASE_VERSION'] || undefined,
    actorUid: session.actor.uid,
    actorEmail: session.actor.email,
    startedAt: session.startedAt,
    completedAt: new Date().toISOString(),
    snapshot: {
      consistency: 'LOGICAL_CONSISTENT_READ',
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
    },
    driveBackupFolderId: session.folders.backup,
    firestore: {
      topLevelCollections: [...FIRESTORE_COLLECTION_CATALOG],
      rootCollections: [...FIRESTORE_ROOT_COLLECTION_CATALOG],
      nestedPatterns: FIRESTORE_SUBCOLLECTION_CATALOG.map(item => `${item.parentCollection}/{id}/${item.collection}`),
      pathCounts: session.firestore.pathCounts,
      totalDocuments: session.firestore.pathCounts.reduce((sum, item) => sum + item.documentCount, 0),
      excludedCollections: session.firestore.excludedCounts.map(item => ({ collection: item.collection, reason: 'ephemeral session data; never restored', documentCount: item.documentCount })),
      unknownCollections: session.firestore.unknownCollections,
      orphanSubcollectionCount: session.firestore.orphanSubcollectionCount,
      scrubbedFieldCount: session.firestore.scrubbedFieldCount,
    },
    auth: {
      userCount: session.auth.userCount,
      passwordHashesIncluded: session.auth.passwordHashesIncluded,
      firestoreProfileCount: session.firestore.profileIds.length,
      authWithoutProfileCount,
      profileWithoutAuthCount,
    },
    drive: {
      assetCount: session.drive.assets.length,
      templateCount: session.drive.assets.filter(item => item.isTemplate).length,
      folderCount: session.drive.folders.length,
      inaccessibleCount: session.drive.assets.filter(item => item.status === 'INACCESSIBLE').length
        + session.drive.folders.filter(folder => folder.status === 'INACCESSIBLE').length,
      unsupportedCount: session.drive.assets.filter(item => item.status === 'UNSUPPORTED').length,
      folders: session.drive.folders,
      assets: session.drive.assets,
    },
    parts: [
      ...session.firestore.parts,
      ...session.auth.parts,
      ...(session.appsScript.part ? [session.appsScript.part] : []),
    ],
    warnings,
    errors: [...new Set(errors)],
    quotaUsage: {
      firestoreReads: session.quota.firestoreReads,
      firestoreWrites: 0,
      driveApiRequests: session.quota.driveApiRequests,
      driveBytesUploaded: session.quota.driveBytesUploaded,
      driveStorageBefore: session.quota.driveStorageBefore,
      driveStorageAfter: session.quota.driveStorageAfter,
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
}

async function runFinalizePhase(
  session: BackupSession,
  store: BackupSessionStore,
  client: DriveBackupClient,
  key: BackupKey,
): Promise<BackupManifest> {
  if (session.manifestFileId) {
    session.phase = 'VERIFY';
    await store.save(session);
    const loaded = await import('./backup-restore.js').then(({ loadBackupManifest }) =>
      loadBackupManifest(client, session.folders.backup, key));
    return loaded.manifest;
  }
  try {
    session.quota.driveStorageAfter = await client.getStorageQuota();
  } catch (error) {
    session.drive.warnings.push(`Không thể ghi nhận Drive storage quota sau backup: ${error instanceof Error ? error.message : String(error)}`);
  }
  const manifest = buildManifest(session, key);
  const plaintext = Buffer.from(JSON.stringify(manifest), 'utf8');
  const ciphertext = encryptBackupPayload(plaintext, key);
  const uploaded = await client.uploadBytes('manifest.json.enc', 'application/octet-stream', session.folders.backup, ciphertext);
  session.manifestFileId = uploaded.id;
  session.phase = manifest.status === 'FAILED' ? 'FAILED' : 'VERIFY';
  session.error = manifest.status === 'FAILED' ? manifest.errors.join(' | ').slice(0, 800) : undefined;
  accountForClientStats(session, client);
  await store.save(session);
  return manifest;
}

async function runVerifyPhase(
  session: BackupSession,
  store: BackupSessionStore,
  client: DriveBackupClient,
  key: BackupKey,
): Promise<BackupSessionStep> {
  if (!session.manifestFileId) throw new Error('Backup session thiếu manifestFileId trước khi verify.');
  const { verifyBackup } = await import('./backup-restore.js');
  const verification = await verifyBackup(client, session.folders.backup, key);
  const finalManifest: BackupManifest = {
    ...verification.manifest,
    status: verification.verified ? verification.manifest.status : 'FAILED',
    warnings: [...new Set([...verification.manifest.warnings, ...verification.warnings])],
    errors: [...new Set([...verification.manifest.errors, ...verification.errors])],
    verification: {
      status: verification.verified ? 'PASSED' : 'FAILED',
      checkedAt: new Date().toISOString(),
      checkedParts: verification.checkedParts,
      checkedAssets: verification.checkedAssets,
      checkedBytes: verification.checkedBytes,
      errors: verification.verified ? undefined : verification.errors,
    },
  };
  await client.updateBytes(
    session.manifestFileId,
    'application/octet-stream',
    encryptBackupPayload(Buffer.from(JSON.stringify(finalManifest), 'utf8'), key),
  );
  session.verification = {
    status: finalManifest.verification?.status || 'FAILED',
    checkedParts: verification.checkedParts,
    checkedAssets: verification.checkedAssets,
    checkedBytes: verification.checkedBytes,
    errors: verification.errors,
    warnings: verification.warnings,
  };
  session.phase = verification.verified ? 'COMPLETED' : 'FAILED';
  session.completedAt = new Date().toISOString();
  session.error = verification.verified ? undefined : verification.errors.join(' | ').slice(0, 800);
  accountForClientStats(session, client);
  await store.save(session);
  return { session, done: true, result: { manifest: finalManifest, manifestFileId: session.manifestFileId } };
}

export async function advanceBackupSession(
  session: BackupSession,
  client: DriveBackupClient,
  db: BackupDatabase,
  key = backupEncryptionKey(),
  existingStore?: BackupSessionStore,
): Promise<BackupSessionStep> {
  const store = existingStore || new BackupSessionStore(client, key, session.folders.backup);
  if (!existingStore) {
    const loaded = await store.load();
    if (loaded.backupId !== session.backupId) throw new Error('Backup session không khớp phiên đang tiếp tục.');
    session = loaded;
  }
  return withBackupSessionLock(db, session, async () => {
    switch (session.phase) {
    case 'FIRESTORE':
      await runFirestorePhase(session, store, client, db, key);
      return { session, done: false };
    case 'AUTH':
      await runAuthPhase(session, store, client, key);
      return { session, done: false };
    case 'APPS_SCRIPT':
      await runAppsScriptPhase(session, store, client, key);
      return { session, done: false };
    case 'DRIVE_PLAN':
      await runDrivePlanPhase(session, store, client);
      return { session, done: false };
    case 'DRIVE_ASSETS':
      await runDriveAssetsPhase(session, store, client, key);
      return { session, done: false };
    case 'FINALIZE':
      {
        const manifest = await runFinalizePhase(session, store, client, key);
        return manifest.status === 'FAILED'
          ? { session, done: true, result: { manifest, manifestFileId: session.manifestFileId as string } }
          : { session, done: false };
      }
    case 'VERIFY':
      return runVerifyPhase(session, store, client, key);
    case 'COMPLETED':
      throw new Error('Backup session đã hoàn tất.');
    case 'FAILED':
      throw new Error(session.error || 'Backup session thất bại.');
    }
  });
}

export async function loadBackupSessionWithStore(
  client: DriveBackupClient,
  backupFolderId: string,
  key = backupEncryptionKey(),
): Promise<{ session: BackupSession; store: BackupSessionStore }> {
  if (!validDriveId(backupFolderId)) throw new Error('backupFolderId không hợp lệ.');
  const store = new BackupSessionStore(client, key, backupFolderId);
  return { session: await store.load(), store };
}

export async function loadBackupSession(
  client: DriveBackupClient,
  backupFolderId: string,
  key = backupEncryptionKey(),
): Promise<BackupSession> {
  return (await loadBackupSessionWithStore(client, backupFolderId, key)).session;
}
