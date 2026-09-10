import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FIRESTORE_COLLECTION_CATALOG, FIRESTORE_ROOT_COLLECTION_CATALOG, FIRESTORE_SUBCOLLECTION_CATALOG, type BackupManifest, type BackupPartManifest } from './backup-contract.js';
import { encryptBackupPayload, sha256, type BackupKey } from './backup-crypto.js';
import { DriveBackupClient } from './backup-drive.js';
import {
  advanceBackupVerification,
  isDriveOnlyRecoveryDifference,
  listRestoreCheckpoints,
  runRestore,
  verifyBackup,
} from './backup-restore.js';

const key: BackupKey = { keyId: 'test-key', key: Buffer.alloc(32, 9) };

function encryptedPart(name: string, category: BackupPartManifest['category'], value: string): { part: BackupPartManifest; payload: Buffer } {
  const plaintext = Buffer.from(value, 'utf8');
  const payload = encryptBackupPayload(plaintext, key);
  return {
    payload,
    part: {
      name,
      driveFileId: `id-${category}-${name.replace(/[^A-Za-z0-9_-]/g, '-')}`,
      category,
      recordCount: value.split('\n').filter(Boolean).length,
      plaintextBytes: plaintext.byteLength,
      ciphertextBytes: payload.byteLength,
      plaintextSha256: sha256(plaintext),
      ciphertextSha256: sha256(payload),
    },
  };
}

describe('LIMS backup integrity verification', () => {
  it('allows RECOVER_MISSING to repair only a Drive ID remap', () => {
    const idMap = new Map([['old-file', 'new-file']]);
    assert.equal(
      isDriveOnlyRecoveryDifference(
        { pdfUrl: 'https://drive.google.com/file/d/old-file/view', count: 1 },
        { pdfUrl: 'https://drive.google.com/file/d/new-file/view', count: 1 },
        idMap,
      ),
      true,
    );
    assert.equal(
      isDriveOnlyRecoveryDifference(
        { pdfUrl: 'https://drive.google.com/file/d/old-file/view', count: 2 },
        { pdfUrl: 'https://drive.google.com/file/d/new-file/view', count: 1 },
        idMap,
      ),
      false,
    );
  });

  it('validates manifest, encrypted parts, typed records and checksums', async () => {
    const firestore = encryptedPart(
      'firestore-00000.ndjson.enc',
      'firestore',
      [
        '{"path":"artifacts/lims-cloud-fixed/sops/sop-1","collection":"sops","documentId":"sop-1","data":{}}',
        '{"path":"artifacts/lims-cloud-fixed/duty_schedules/2026-09-01","collection":"duty_schedules","documentId":"2026-09-01","data":{"staffId":"staff-1"}}',
        '{"path":"artifacts/lims-cloud-fixed/duty_staff/staff-1","collection":"duty_staff","documentId":"staff-1","data":{"displayName":"Test staff"}}',
      ].join('\n') + '\n',
    );
    const auth = encryptedPart('auth-users-00000.ndjson.enc', 'auth', '{"uid":"user-1","data":{}}\n');
    const deployment = encryptedPart('apps-script-deployment.json.enc', 'deployment', '{}');
    const manifest: BackupManifest = {
      backupId: 'bkp_test',
      formatVersion: 1,
      schemaVersion: 1,
      serializerVersion: 1,
      status: 'COMPLETED',
      projectId: 'demo-project',
      appId: 'lims-cloud-fixed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      driveBackupFolderId: 'backup-folder',
      firestore: {
        // Keep these names explicit in the fixture so restore validation fails
        // if production collections drift out of the catalog again.
        topLevelCollections: [...new Set([...FIRESTORE_COLLECTION_CATALOG, 'duty_schedules', 'duty_staff'])],
        rootCollections: [...FIRESTORE_ROOT_COLLECTION_CATALOG],
        nestedPatterns: FIRESTORE_SUBCOLLECTION_CATALOG.map(item => `${item.parentCollection}/{id}/${item.collection}`),
        pathCounts: [
          { path: 'sops', collection: 'sops', documentCount: 1, bytes: 2 },
          { path: 'duty_schedules', collection: 'duty_schedules', documentCount: 1, bytes: 2 },
          { path: 'duty_staff', collection: 'duty_staff', documentCount: 1, bytes: 2 },
        ],
        totalDocuments: 3,
        excludedCollections: [],
        unknownCollections: [],
        orphanSubcollectionCount: 0,
        scrubbedFieldCount: 0,
      },
      auth: { userCount: 1, passwordHashesIncluded: false },
      drive: { assetCount: 0, templateCount: 0, folderCount: 0, inaccessibleCount: 0, unsupportedCount: 0, folders: [], assets: [] },
      parts: [firestore.part, auth.part, deployment.part],
      warnings: [],
      errors: [],
      quotaUsage: { firestoreReads: 1, firestoreWrites: 0, driveApiRequests: 0, driveBytesUploaded: 0 },
      restorePolicies: { defaultMode: 'RECOVER_MISSING', neverRestoreCollections: ['auth_sessions'], neverRestoreFields: [] },
      encryption: { algorithm: 'aes-256-gcm', keyId: key.keyId, perPartIv: true },
    };
    const manifestPlaintext = Buffer.from(JSON.stringify(manifest), 'utf8');
    const manifestPayload = encryptBackupPayload(manifestPlaintext, key);
    const checkpointPayload = encryptBackupPayload(Buffer.from(JSON.stringify({
      restoreId: 'rst_test',
      backupId: 'bkp_test',
      backupFolderId: 'backup-folder',
      mode: 'RECOVER_MISSING',
      phase: 'FAILED',
      firestoreBatchesCommitted: 1,
      firestoreWritesCommitted: 2,
      driveFoldersProcessed: 3,
      driveAssetsProcessed: 4,
      authBatchesProcessed: 5,
      lastPath: 'artifacts/lims-cloud-fixed/sops/sop-1',
      error: 'test failure',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }), 'utf8'), key);
    const payloads = new Map<string, Buffer>([
      [firestore.part.driveFileId, firestore.payload],
      [auth.part.driveFileId, auth.payload],
      [deployment.part.driveFileId, deployment.payload],
      ['manifest-id', manifestPayload],
      ['checkpoint-id', checkpointPayload],
    ]);
    const client = new DriveBackupClient('test-token') as any;
    client.getMetadata = async (id: string) => ({ id, name: id === 'backup-folder' ? 'LIMS_BACKUP_test' : id, mimeType: id === 'backup-folder' ? 'application/vnd.google-apps.folder' : 'application/octet-stream' });
    client.listChildren = async (id: string) => id === 'backup-folder'
      ? [
          { id: 'manifest-id', name: 'manifest.json.enc', mimeType: 'application/octet-stream' },
          { id: 'checkpoint-id', name: 'restore-checkpoint-rst_test.json.enc', mimeType: 'application/octet-stream' },
        ]
      : [];
    client.download = async (id: string) => payloads.get(id);
    client.listPermissions = async () => [];
    const result = await verifyBackup(client, 'backup-folder', key);
    assert.equal(result.verified, true);
    assert.equal(result.checkedParts, 3);
    assert.equal(result.checkedAssets, 0);
    assert.equal(result.errors.length, 0);
    const checkpoints = await listRestoreCheckpoints(client, 'backup-folder', 'bkp_test', key);
    assert.equal(checkpoints.length, 1);
    assert.equal(checkpoints[0].restoreId, 'rst_test');
    assert.equal(checkpoints[0].phase, 'FAILED');

    const restoreWrites: Array<{ path: string; data: unknown }> = [];
    let committedBatches = 0;
    const restoreDb = {
      doc: (path: string) => ({ path }),
      getAll: async (...refs: Array<{ path: string }>) => refs.map(ref => ({ exists: false, ref })),
      batch: () => ({
        set: (ref: { path: string }, data: unknown) => restoreWrites.push({ path: ref.path, data }),
        delete: () => { throw new Error('The selected restore fixture should not delete documents.'); },
        commit: async () => { committedBatches++; },
      }),
    } as any;
    client.uploadBytes = async (name: string) => ({ id: 'restore-checkpoint-id', name, mimeType: 'application/octet-stream' });
    client.updateBytes = async (id: string) => ({ id, name: 'restore-checkpoint.json.enc', mimeType: 'application/octet-stream' });

    const restore = await runRestore({
      db: restoreDb,
      client,
      backupFolderId: 'backup-folder',
      mode: 'RESTORE_SELECTED',
      selectedPaths: [
        'artifacts/lims-cloud-fixed/duty_schedules',
        'artifacts/lims-cloud-fixed/duty_staff',
      ],
      projectId: 'demo-project',
      key,
      restoreDrive: false,
      restoreAuth: false,
    });

    assert.equal(restore.verified, true);
    assert.equal(restore.firestore.scanned, 2);
    assert.equal(restore.firestore.missing, 2);
    assert.equal(restore.firestore.created, 2);
    assert.equal(restore.firestore.plannedWrites, 2);
    assert.equal(restore.checkpoint?.firestoreWritesCommitted, 2);
    assert.equal(committedBatches, 1);
    assert.deepEqual(restoreWrites.map(item => item.path).sort(), [
      'artifacts/lims-cloud-fixed/duty_schedules/2026-09-01',
      'artifacts/lims-cloud-fixed/duty_staff/staff-1',
    ]);
    assert.equal(restoreWrites.some(item => item.path === 'artifacts/lims-cloud-fixed/sops/sop-1'), false);
  });

  it('resumes verification from a persisted checkpoint and finalises after ACL batches', async () => {
    const deployment = encryptedPart('apps-script-deployment.json.enc', 'deployment', '{}');
    const manifest: BackupManifest = {
      backupId: 'bkp_checkpoint',
      formatVersion: 1,
      schemaVersion: 1,
      serializerVersion: 1,
      status: 'COMPLETED',
      projectId: 'demo-project',
      appId: 'lims-cloud-fixed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      driveBackupFolderId: 'checkpoint-folder',
      firestore: {
        topLevelCollections: [...FIRESTORE_COLLECTION_CATALOG],
        rootCollections: [...FIRESTORE_ROOT_COLLECTION_CATALOG],
        nestedPatterns: FIRESTORE_SUBCOLLECTION_CATALOG.map(item => `${item.parentCollection}/{id}/${item.collection}`),
        pathCounts: [],
        totalDocuments: 0,
        excludedCollections: [],
        unknownCollections: [],
        orphanSubcollectionCount: 0,
        scrubbedFieldCount: 0,
      },
      auth: { userCount: 0, passwordHashesIncluded: false },
      drive: { assetCount: 0, templateCount: 0, folderCount: 0, inaccessibleCount: 0, unsupportedCount: 0, folders: [], assets: [] },
      parts: [deployment.part],
      warnings: [],
      errors: [],
      quotaUsage: { firestoreReads: 0, firestoreWrites: 0, driveApiRequests: 0, driveBytesUploaded: 0 },
      restorePolicies: { defaultMode: 'RECOVER_MISSING', neverRestoreCollections: ['auth_sessions'], neverRestoreFields: [] },
      encryption: { algorithm: 'aes-256-gcm', keyId: key.keyId, perPartIv: true },
    };
    const manifestPayload = encryptBackupPayload(Buffer.from(JSON.stringify(manifest), 'utf8'), key);
    const payloads = new Map<string, Buffer>([
      [deployment.part.driveFileId, deployment.payload],
      ['checkpoint-manifest', manifestPayload],
    ]);
    const client = new DriveBackupClient('test-token') as any;
    client.getMetadata = async (id: string) => ({
      id,
      name: id === 'checkpoint-folder' ? 'LIMS_BACKUP_checkpoint' : id,
      mimeType: id === 'checkpoint-folder' ? 'application/vnd.google-apps.folder' : 'application/octet-stream',
    });
    client.listChildren = async (id: string) => id === 'checkpoint-folder'
      ? [{ id: 'checkpoint-manifest', name: 'manifest.json.enc', mimeType: 'application/octet-stream' }]
      : [];
    client.download = async (id: string) => payloads.get(id);
    client.listPermissions = async () => [];

    const first = await advanceBackupVerification(client, 'checkpoint-folder', key, undefined, { partsPerChunk: 1, assetsPerChunk: 1, aclPerChunk: 1, concurrency: 1 });
    assert.equal(first.done, false);
    assert.equal(first.state.stage, 'ASSETS');
    const second = await advanceBackupVerification(client, 'checkpoint-folder', key, first.state, { partsPerChunk: 1, assetsPerChunk: 1, aclPerChunk: 1, concurrency: 1 });
    assert.equal(second.done, false);
    assert.equal(second.state.stage, 'ACL');
    const final = await advanceBackupVerification(client, 'checkpoint-folder', key, second.state, { partsPerChunk: 1, assetsPerChunk: 1, aclPerChunk: 1, concurrency: 1 });
    assert.equal(final.done, false);
    assert.equal(final.state.aclFileIds.length, 3);
    const completed = await advanceBackupVerification(client, 'checkpoint-folder', key, final.state, { partsPerChunk: 1, assetsPerChunk: 1, aclPerChunk: 10, concurrency: 1 });
    assert.equal(completed.done, true);
    assert.equal(completed.result?.verified, true);
    assert.equal(completed.state.status, 'PASSED');
    assert.equal(completed.state.checkedParts, 1);
  });
});
