import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { type BackupPartManifest } from './backup-contract.js';
import { decryptBackupPayload, encryptBackupPayload, sha256, type BackupKey } from './backup-crypto.js';
import { DriveBackupClient } from './backup-drive.js';
import { advanceBackupSession, type BackupSession } from './backup-resumable.js';

const key: BackupKey = { keyId: 'test-key', key: Buffer.alloc(32, 3) };

function deploymentPart(fileId = 'deployment-existing'): BackupPartManifest {
  return {
    name: 'apps-script-deployment.json.enc',
    driveFileId: fileId,
    category: 'deployment',
    recordCount: 1,
    plaintextBytes: 10,
    ciphertextBytes: 20,
    plaintextSha256: 'a'.repeat(64),
    ciphertextSha256: 'b'.repeat(64),
  };
}

function fakeDatabase(): any {
  return {
    doc: () => ({ id: 'lock' }),
    runTransaction: async (work: (transaction: any) => Promise<unknown>) => work({
      get: async () => ({ exists: false, data: () => undefined }),
      set: () => undefined,
      delete: () => undefined,
    }),
  };
}

function failedSession(): BackupSession {
  const now = new Date().toISOString();
  const assetError = 'Cannot backup Drive file report.pdf: Google Drive download 500: Internal Error';
  return {
    version: 1,
    backupId: 'bkp_test_repair',
    projectId: 'demo-project',
    appId: 'lims-cloud-fixed',
    actor: { uid: 'admin-1', appId: 'lims-cloud-fixed' },
    releaseVersion: 'test-release',
    startedAt: now,
    updatedAt: now,
    phase: 'FAILED',
    backupParentFolderId: 'backup-parent',
    folders: {
      backup: 'backup-folder',
      firestore: 'firestore-folder',
      auth: 'auth-folder',
      drive: 'drive-folder',
      encryptedAssets: 'encrypted-folder',
      nativeCopies: 'native-folder',
      deployment: 'deployment-folder',
    },
    firestore: {
      complete: true,
      pathCounts: [{ path: 'sops', collection: 'sops', documentCount: 1, bytes: 2 }],
      excludedCounts: [],
      unknownCollections: [],
      orphanSubcollectionCount: 0,
      scrubbedFieldCount: 0,
      firestoreReads: 1,
      parts: [],
      profileIds: [],
      driveReferences: [{ fileId: 'file-1', referencedBy: ['reports/report-1'] }],
    },
    auth: {
      complete: true,
      partIndex: 0,
      parts: [],
      userCount: 0,
      passwordHashesIncluded: false,
      uids: [],
    },
    appsScript: {
      complete: true,
      liveCapture: 'PASSED',
    },
    drive: {
      planned: true,
      folders: [],
      files: [{ fileId: 'file-1', referencedBy: ['reports/report-1'] }],
      nextAssetIndex: 1,
      assets: [{
        sourceFileId: 'file-1',
        sourceName: 'report.pdf',
        sourceMimeType: 'application/pdf',
        sourceParentIds: ['source-folder'],
        exportMimeType: 'application/pdf',
        exportExtension: 'bin',
        encryptedPayloadFileId: '',
        encryptedPayloadFileName: '',
        payloadPlaintextBytes: 0,
        payloadPlaintextSha256: '',
        payloadCiphertextSha256: '',
        referencedBy: ['reports/report-1'],
        isTemplate: false,
        status: 'INACCESSIBLE',
        error: assetError,
      }],
      warnings: [],
      errors: [assetError],
    },
    quota: {
      firestoreReads: 1,
      driveApiRequests: 10,
      driveBytesUploaded: 100,
    },
    manifestFileId: 'manifest-existing',
    verification: {
      status: 'FAILED',
      checkedParts: 0,
      checkedAssets: 0,
      checkedBytes: 0,
      errors: ['old verification failure'],
      warnings: [],
    },
    error: assetError,
  };
}

describe('resumable backup Drive repair', () => {
  it('reopens Apps Script capture before Drive repair when both failed', async () => {
    const session = failedSession();
    session.completedAt = new Date().toISOString();
    session.appsScript = {
      complete: true,
      scriptId: 'script-test-123',
      liveCapture: 'FAILED',
      liveError: 'Apps Script API 403',
      part: deploymentPart(),
    };
    const savedPhases: string[] = [];
    const store = { save: async (value: BackupSession) => { savedPhases.push(value.phase); } } as any;
    const client = new DriveBackupClient('test-token') as any;

    const reopened = await advanceBackupSession(session, client, fakeDatabase(), key, store);

    assert.equal(reopened.done, false);
    assert.equal(session.phase, 'APPS_SCRIPT');
    assert.equal(session.appsScript.complete, false);
    assert.equal(session.appsScript.liveCapture, 'NOT_ATTEMPTED');
    assert.equal(session.appsScript.liveError, undefined);
    assert.equal(session.appsScript.part?.driveFileId, 'deployment-existing');
    assert.equal(session.verification, undefined);
    assert.equal(session.completedAt, undefined);
    assert.equal(session.error, undefined);
    assert.deepEqual(savedPhases, ['APPS_SCRIPT']);
  });

  it('updates the Apps Script deployment part in place and then enters Drive repair', async () => {
    const session = failedSession();
    session.phase = 'APPS_SCRIPT';
    session.appsScript = {
      complete: false,
      scriptId: 'script-test-123',
      liveCapture: 'NOT_ATTEMPTED',
      part: deploymentPart(),
    };
    const store = { save: async () => undefined } as any;
    const client = new DriveBackupClient('test-token') as any;
    client.getAppsScriptProject = async () => ({ title: 'LIMS' });
    client.getAppsScriptProjectContent = async () => ({ files: [] });
    client.listAppsScriptDeployments = async () => [];
    let updateCalls = 0;
    let uploadCalls = 0;
    client.updateBytes = async (fileId: string) => {
      updateCalls++;
      assert.equal(fileId, 'deployment-existing');
      return { id: fileId, name: 'apps-script-deployment.json.enc', mimeType: 'application/octet-stream' };
    };
    client.uploadBytes = async () => {
      uploadCalls++;
      return { id: 'deployment-duplicate', name: 'apps-script-deployment.json.enc', mimeType: 'application/octet-stream' };
    };
    const previousScriptId = process.env['LIMS_APPS_SCRIPT_ID'];
    process.env['LIMS_APPS_SCRIPT_ID'] = 'script-test-123';

    try {
      const retried = await advanceBackupSession(session, client, fakeDatabase(), key, store);

      assert.equal(retried.done, false);
      assert.equal(session.appsScript.complete, true);
      assert.equal(session.appsScript.liveCapture, 'PASSED');
      assert.equal(session.appsScript.liveError, undefined);
      assert.equal(session.appsScript.part?.driveFileId, 'deployment-existing');
      assert.equal(session.phase, 'DRIVE_REPAIR');
      assert.deepEqual(session.drive.repair?.assetIndexes, [0]);
      assert.equal(updateCalls, 1);
      assert.equal(uploadCalls, 0);
    } finally {
      if (previousScriptId === undefined) delete process.env['LIMS_APPS_SCRIPT_ID'];
      else process.env['LIMS_APPS_SCRIPT_ID'] = previousScriptId;
    }
  });

  it('reopens a failed session and replaces only the failed Drive asset in place', async () => {
    const session = failedSession();
    const savedPhases: string[] = [];
    const store = { save: async (value: BackupSession) => { savedPhases.push(value.phase); } } as any;
    const client = new DriveBackupClient('test-token') as any;
    client.getMetadata = async () => ({
      id: 'file-1',
      name: 'report.pdf',
      mimeType: 'application/pdf',
      parents: ['source-folder'],
    });
    client.download = async () => Buffer.from('repaired-report');
    client.uploadBytes = async (name: string) => ({ id: 'payload-repaired', name, mimeType: 'application/octet-stream' });

    const reopened = await advanceBackupSession(session, client, fakeDatabase(), key, store);
    assert.equal(reopened.done, false);
    assert.equal(session.phase, 'DRIVE_REPAIR');
    assert.equal(session.verification, undefined);

    const repaired = await advanceBackupSession(session, client, fakeDatabase(), key, store);
    assert.equal(repaired.done, false);
    assert.equal(session.phase, 'FINALIZE');
    assert.equal(session.drive.assets.length, 1);
    assert.equal(session.drive.assets[0].status, 'BACKED_UP');
    assert.equal(session.drive.assets[0].encryptedPayloadFileId, 'payload-repaired');
    assert.deepEqual(session.drive.errors, []);
    assert.deepEqual(savedPhases, ['DRIVE_REPAIR', 'FINALIZE']);
  });

  it('updates the existing manifest after repair instead of creating a duplicate manifest', async () => {
    const session = failedSession();
    session.phase = 'FINALIZE';
    session.error = undefined;
    session.verification = undefined;
    session.drive.errors = [];
    session.firestore.unknownCollections = [
      'artifacts/lims-cloud-fixed/daily_checks',
      'artifacts/lims-cloud-fixed/public',
      'artifacts/lims-cloud-fixed/stats_aggregates',
    ];
    session.drive.assets[0] = {
      ...session.drive.assets[0],
      encryptedPayloadFileId: 'payload-repaired',
      encryptedPayloadFileName: 'asset-00000-report.pdf.enc',
      payloadPlaintextBytes: 15,
      payloadPlaintextSha256: 'a'.repeat(64),
      payloadCiphertextSha256: 'b'.repeat(64),
      status: 'BACKED_UP',
      error: undefined,
    };
    const store = { save: async () => undefined } as any;
    const client = new DriveBackupClient('test-token') as any;
    let updateCalls = 0;
    let uploadCalls = 0;
    client.getStorageQuota = async () => ({ usage: '123' });
    client.updateBytes = async (fileId: string) => {
      updateCalls++;
      assert.equal(fileId, 'manifest-existing');
      return { id: fileId, name: 'manifest.json.enc', mimeType: 'application/octet-stream' };
    };
    client.uploadBytes = async () => {
      uploadCalls++;
      return { id: 'manifest-duplicate', name: 'manifest.json.enc', mimeType: 'application/octet-stream' };
    };

    const result = await advanceBackupSession(session, client, fakeDatabase(), key, store);

    assert.equal(result.done, false);
    assert.equal(session.phase, 'VERIFY');
    assert.equal(session.manifestFileId, 'manifest-existing');
    assert.equal(updateCalls, 1);
    assert.equal(uploadCalls, 0);
  });

  it('re-finalizes a failed manifest after a stale policy error is corrected', async () => {
    const session = failedSession();
    session.error = 'Unknown Firestore collections found: artifacts/lims-cloud-fixed/backup_locks';
    session.firestore.unknownCollections = ['artifacts/lims-cloud-fixed/backup_locks'];
    session.drive.errors = [];
    session.drive.assets[0] = {
      ...session.drive.assets[0],
      encryptedPayloadFileId: 'payload-repaired',
      encryptedPayloadFileName: 'asset-00000-report.pdf.enc',
      payloadPlaintextBytes: 15,
      payloadPlaintextSha256: 'a'.repeat(64),
      payloadCiphertextSha256: 'b'.repeat(64),
      status: 'BACKED_UP',
      error: undefined,
    };
    const store = { save: async () => undefined } as any;
    const client = new DriveBackupClient('test-token') as any;
    client.getStorageQuota = async () => ({ usage: '123' });
    let updateCalls = 0;
    client.updateBytes = async (fileId: string) => {
      updateCalls++;
      assert.equal(fileId, 'manifest-existing');
      return { id: fileId, name: 'manifest.json.enc', mimeType: 'application/octet-stream' };
    };

    const reopened = await advanceBackupSession(session, client, fakeDatabase(), key, store);
    assert.equal(reopened.done, false);
    assert.equal(session.phase, 'FINALIZE');
    assert.equal(session.error, undefined);

    const finalized = await advanceBackupSession(session, client, fakeDatabase(), key, store);
    assert.equal(finalized.done, false);
    assert.equal(session.phase, 'VERIFY');
    assert.equal(updateCalls, 1);
  });

  it('keeps unrelated and nested legacy collection drift fail-closed during finalize', async () => {
    const session = failedSession();
    session.phase = 'FINALIZE';
    session.error = undefined;
    session.verification = undefined;
    session.drive.errors = [];
    session.firestore.unknownCollections = [
      'artifacts/lims-cloud-fixed/uncatalogued',
      'artifacts/lims-cloud-fixed/daily_checks/day-1/history',
      'artifacts/lims-cloud-fixed/public/data/history',
    ];
    session.drive.assets[0] = {
      ...session.drive.assets[0],
      encryptedPayloadFileId: 'payload-repaired',
      encryptedPayloadFileName: 'asset-00000-report.pdf.enc',
      payloadPlaintextBytes: 15,
      payloadPlaintextSha256: 'a'.repeat(64),
      payloadCiphertextSha256: 'b'.repeat(64),
      status: 'BACKED_UP',
      error: undefined,
    };
    const store = { save: async () => undefined } as any;
    const client = new DriveBackupClient('test-token') as any;
    client.getStorageQuota = async () => ({ usage: '123' });
    client.updateBytes = async (fileId: string) => ({
      id: fileId,
      name: 'manifest.json.enc',
      mimeType: 'application/octet-stream',
    });

    const result = await advanceBackupSession(session, client, fakeDatabase(), key, store);

    assert.equal(result.done, true);
    assert.equal(result.result?.manifest.status, 'FAILED');
    assert.deepEqual(result.result?.manifest.firestore.unknownCollections, [
      'artifacts/lims-cloud-fixed/uncatalogued',
      'artifacts/lims-cloud-fixed/daily_checks/day-1/history',
      'artifacts/lims-cloud-fixed/public/data/history',
    ]);
    assert.equal(result.result?.manifest.errors.some(error => error.includes('Unknown Firestore collections found')), true);
  });

  it('strips runtime-only Firestore lock records and rewrites the existing part in place', async () => {
    const session = failedSession();
    session.phase = 'FIRESTORE_REPAIR';
    session.error = undefined;
    session.firestore.pathCounts = [
      { path: 'backup_locks', collection: 'backup_locks', documentCount: 1, bytes: 80 },
      // Deliberately stale metadata: the rewritten payloads are the source of
      // truth when a legacy session's collection labels/counts drifted.
      { path: 'sops', collection: 'sops', documentCount: 999, bytes: 999 },
    ];
    session.firestore.unknownCollections = ['artifacts/lims-cloud-fixed/backup_locks'];
    const plaintext = Buffer.from([
      JSON.stringify({
        path: 'artifacts/lims-cloud-fixed/backup_locks/bkp_test_repair',
        collection: 'backup_locks',
        documentId: 'bkp_test_repair',
        data: { owner: 'temporary', expiresAt: 123 },
      }),
      JSON.stringify({
        path: 'artifacts/lims-cloud-fixed/sops/sop-1',
        collection: 'sops/history',
        documentId: 'sop-1',
        parentPath: 'artifacts/lims-cloud-fixed/sops',
        data: { title: 'Keep me' },
      }),
      JSON.stringify({
        path: 'artifacts/lims-cloud-fixed/sops/sop-1',
        collection: 'sops',
        documentId: 'sop-1',
        data: { title: 'Keep me' },
      }),
      '',
    ].join('\n'), 'utf8');
    let storedBytes = encryptBackupPayload(plaintext, key);
    const part: BackupPartManifest = {
      name: 'firestore-00000.ndjson.enc',
      driveFileId: 'firestore-part-existing',
      category: 'firestore',
      recordCount: 3,
      plaintextBytes: plaintext.byteLength,
      ciphertextBytes: storedBytes.byteLength,
      plaintextSha256: sha256(plaintext),
      ciphertextSha256: sha256(storedBytes),
    };
    session.firestore.parts = [part];
    session.firestore.repair = { nextPartIndex: 0, removedRecords: 0 };
    const store = { save: async () => undefined } as any;
    const client = new DriveBackupClient('test-token') as any;
    client.download = async () => storedBytes;
    client.updateBytes = async (fileId: string, _mimeType: string, bytes: Buffer) => {
      assert.equal(fileId, 'firestore-part-existing');
      storedBytes = Buffer.from(bytes);
      return { id: fileId, name: part.name, mimeType: 'application/octet-stream' };
    };

    const repaired = await advanceBackupSession(session, client, fakeDatabase(), key, store);

    assert.equal(repaired.done, false);
    assert.equal(session.phase, 'FINALIZE');
    assert.equal(session.firestore.repair, undefined);
    assert.equal(session.firestore.parts[0].recordCount, 1);
    assert.deepEqual(session.firestore.unknownCollections, []);
    assert.deepEqual(session.firestore.pathCounts.map(item => item.collection), ['sops']);
    const remaining = decryptBackupPayload(storedBytes, key).toString('utf8').trim().split('\n');
    assert.equal(remaining.length, 1);
    assert.equal(JSON.parse(remaining[0]).path, 'artifacts/lims-cloud-fixed/sops/sop-1');
  });
});
