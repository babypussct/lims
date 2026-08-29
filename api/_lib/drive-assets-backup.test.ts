import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { type BackupKey } from './backup-crypto.js';
import { DriveBackupClient } from './backup-drive.js';
import { backupSingleDriveAsset } from './drive-assets-backup.js';

const key: BackupKey = { keyId: 'test-key', key: Buffer.alloc(32, 7) };
const originalRetryBaseMs = process.env['LIMS_BACKUP_DRIVE_RETRY_BASE_MS'];

afterEach(() => {
  if (originalRetryBaseMs === undefined) delete process.env['LIMS_BACKUP_DRIVE_RETRY_BASE_MS'];
  else process.env['LIMS_BACKUP_DRIVE_RETRY_BASE_MS'] = originalRetryBaseMs;
});

describe('Drive asset backup retry policy', () => {
  it('retries transient Workspace export failures and keeps one manifest asset', async () => {
    process.env['LIMS_BACKUP_DRIVE_RETRY_BASE_MS'] = '0';
    const client = new DriveBackupClient('test-token') as any;
    let exportAttempts = 0;
    client.getMetadata = async () => ({
      id: 'doc-1',
      name: 'Report',
      mimeType: 'application/vnd.google-apps.document',
      parents: ['source-folder'],
    });
    client.exportFile = async () => {
      exportAttempts++;
      if (exportAttempts < 3) throw new Error('Google Drive export 500: Internal Error');
      return Buffer.from('report-body');
    };
    client.uploadBytes = async (name: string) => ({ id: 'payload-1', name, mimeType: 'application/octet-stream' });
    client.copyFile = async () => ({ id: 'native-1', name: 'native-Report', mimeType: 'application/vnd.google-apps.document' });

    const result = await backupSingleDriveAsset(
      client,
      key,
      'encrypted-folder',
      'native-folder',
      { fileId: 'doc-1', referencedBy: ['reports/doc-1'] },
      4,
      [],
    );

    assert.equal(exportAttempts, 3);
    assert.equal(result.asset.status, 'BACKED_UP');
    assert.equal(result.errors.length, 0);
    assert.equal(result.asset.encryptedPayloadFileName.startsWith('asset-00004-Report.docx.enc'), true);
  });

  it('does not retry a permanent 404 metadata failure', async () => {
    process.env['LIMS_BACKUP_DRIVE_RETRY_BASE_MS'] = '0';
    const client = new DriveBackupClient('test-token') as any;
    let metadataAttempts = 0;
    client.getMetadata = async () => {
      metadataAttempts++;
      throw new Error('Google Drive API 404: File not found');
    };

    const result = await backupSingleDriveAsset(
      client,
      key,
      'encrypted-folder',
      'native-folder',
      { fileId: 'missing-file', referencedBy: ['results/result-1'] },
      0,
      [],
    );

    assert.equal(metadataAttempts, 1);
    assert.equal(result.asset.status, 'INACCESSIBLE');
    assert.match(result.errors[0], /404/);
    assert.match(result.errors[0], /results\/result-1/);
    assert.deepEqual(result.asset.referencedBy, ['results/result-1']);
  });
});
