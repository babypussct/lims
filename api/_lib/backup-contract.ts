export const BACKUP_FORMAT_VERSION = 1;
export const BACKUP_SCHEMA_VERSION = 1;
export const BACKUP_SERIALIZER_VERSION = 1;
export const DEFAULT_BACKUP_APP_ID = 'lims-cloud-fixed';

/**
 * Every top-level collection used by the LIMS namespace. Keep this list
 * intentionally explicit: the runtime discovery pass compares Firestore's
 * actual collection IDs with this catalog and fails closed on drift.
 */
export const FIRESTORE_COLLECTION_CATALOG = [
  'auth_sessions',
  'config',
  'daily_checklists',
  'inventory',
  'logs',
  'master_analytes',
  'master_devices',
  'master_targets',
  'matrix_types',
  'monthly_stats',
  'notifications',
  'print_jobs',
  'purchase_requests',
  'recipes',
  'reference_standards',
  'requests',
  'results_details',
  'roles_config',
  'sample_description_master',
  'sops',
  'standard_cleanup_batches',
  'standard_code_registry',
  'standard_code_sync_batches',
  'standard_requests',
  'standard_tags',
  'standard_usages',
  'stats',
  'system',
  'system_updates',
  'target_groups',
  'user_preferences',
  'users',
] as const;

export const FIRESTORE_ROOT_COLLECTION_CATALOG = ['releases'] as const;

export const FIRESTORE_SUBCOLLECTION_CATALOG = [
  { parentCollection: 'inventory', collection: 'history' },
  { parentCollection: 'reference_standards', collection: 'logs' },
  { parentCollection: 'sops', collection: 'history' },
  { parentCollection: 'requests', collection: 'history' },
] as const;

/** Ephemeral session records are counted for visibility but never restored. */
export const NEVER_RESTORE_COLLECTIONS = new Set(['auth_sessions']);

export const NEVER_RESTORE_FIELD_NAMES = new Set([
  'fcmTokens',
  'accessToken',
  'refreshToken',
  'idToken',
  'sessionCookie',
  'oauthCookie',
]);

export type RestoreMode = 'DRY_RUN' | 'RECOVER_MISSING' | 'RESTORE_SELECTED' | 'FULL_REPLACE';

export type BackupStatus = 'RUNNING' | 'COMPLETED' | 'COMPLETED_WITH_WARNINGS' | 'FAILED';

export interface BackupPathCount {
  path: string;
  collection: string;
  documentCount: number;
  excludedCount?: number;
  bytes: number;
}

export interface BackupPartManifest {
  name: string;
  driveFileId: string;
  category: 'firestore' | 'auth' | 'drive' | 'deployment' | 'manifest';
  recordCount: number;
  plaintextBytes: number;
  ciphertextBytes: number;
  plaintextSha256: string;
  ciphertextSha256: string;
}

export interface DriveAssetManifest {
  sourceFileId: string;
  sourceName: string;
  sourceMimeType: string;
  sourceParentIds: string[];
  sourceModifiedTime?: string;
  sourceSize?: string;
  exportMimeType: string;
  exportExtension: string;
  encryptedPayloadFileId: string;
  encryptedPayloadFileName: string;
  payloadPlaintextBytes: number;
  payloadPlaintextSha256: string;
  payloadCiphertextSha256: string;
  nativeCopyFileId?: string;
  referencedBy: string[];
  isTemplate: boolean;
  status: 'BACKED_UP' | 'INACCESSIBLE' | 'UNSUPPORTED';
  error?: string;
}

export interface BackupManifest {
  backupId: string;
  formatVersion: number;
  schemaVersion: number;
  serializerVersion: number;
  status: BackupStatus;
  projectId: string;
  appId: string;
  releaseVersion?: string;
  actorUid?: string;
  actorEmail?: string;
  startedAt: string;
  completedAt?: string;
  /** Custom Spark-compatible backup is a logical read, not a Firestore transaction snapshot. */
  snapshot?: {
    consistency: 'LOGICAL_CONSISTENT_READ';
    startedAt: string;
    completedAt?: string;
  };
  driveBackupFolderId: string;
  firestore: {
    topLevelCollections: string[];
    rootCollections: string[];
    nestedPatterns: string[];
    pathCounts: BackupPathCount[];
    totalDocuments: number;
    excludedCollections: Array<{ collection: string; reason: string; documentCount: number }>;
    unknownCollections: string[];
    orphanSubcollectionCount: number;
    scrubbedFieldCount: number;
  };
  auth: {
    userCount: number;
    passwordHashesIncluded: boolean;
    firestoreProfileCount?: number;
    authWithoutProfileCount?: number;
    profileWithoutAuthCount?: number;
  };
  drive: {
    assetCount: number;
    templateCount: number;
    folderCount: number;
    inaccessibleCount: number;
    unsupportedCount: number;
    folders: Array<{
      sourceFolderId: string;
      name: string;
      parentIds: string[];
      status: 'BACKED_UP' | 'INACCESSIBLE';
      error?: string;
    }>;
    assets: DriveAssetManifest[];
  };
  parts: BackupPartManifest[];
  warnings: string[];
  errors: string[];
  quotaUsage: {
    firestoreReads: number;
    firestoreWrites: number;
    driveApiRequests: number;
    driveBytesUploaded: number;
    driveStorageBefore?: {
      limit?: string;
      usage?: string;
      usageInDrive?: string;
      usageInDriveTrash?: string;
    };
    driveStorageAfter?: {
      limit?: string;
      usage?: string;
      usageInDrive?: string;
      usageInDriveTrash?: string;
    };
  };
  restorePolicies: {
    defaultMode: RestoreMode;
    neverRestoreCollections: string[];
    neverRestoreFields: string[];
  };
  encryption: {
    algorithm: 'aes-256-gcm';
    keyId: string;
    perPartIv: true;
  };
  verification?: {
    status: 'PASSED' | 'FAILED';
    checkedAt: string;
    checkedParts: number;
    checkedAssets: number;
    checkedBytes: number;
    errors?: string[];
  };
}

export interface BackupActor {
  uid: string;
  email?: string;
  appId: string;
}

export interface RestoreCheckpoint {
  restoreId: string;
  backupId: string;
  backupFolderId: string;
  mode: RestoreMode;
  phase: 'STARTED' | 'DRIVE' | 'FIRESTORE' | 'AUTH' | 'COMPLETED' | 'FAILED';
  firestoreBatchesCommitted: number;
  firestoreWritesCommitted: number;
  driveFoldersProcessed: number;
  driveAssetsProcessed: number;
  authBatchesProcessed: number;
  lastPath?: string;
  error?: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function configuredBackupAppId(): string {
  const appId = process.env['LIMS_APP_ID'] || process.env['APP_ID'] || DEFAULT_BACKUP_APP_ID;
  if (!/^[A-Za-z0-9_-]+$/.test(appId)) {
    throw new Error('LIMS_APP_ID/APP_ID contains unsupported characters.');
  }
  return appId;
}

export function appPath(appId: string): string {
  return `artifacts/${appId}`;
}

export function pathBelongsToApp(path: string, appId: string): boolean {
  return path === appPath(appId) || path.startsWith(`${appPath(appId)}/`);
}

export function safeBackupName(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, '_').slice(0, 140) || 'unnamed';
}
