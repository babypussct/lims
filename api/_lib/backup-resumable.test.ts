import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { type BackupKey } from './backup-crypto.js';
import { DriveBackupClient } from './backup-drive.js';
import { advanceBackupSession, type BackupSession } from './backup-resumable.js';

const key: BackupKey = { keyId: 'test-key', key: Buffer.alloc(32, 3) };

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
});
