import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DriveBackupClient } from './backup-drive.js';
import { retainOnlyVerifiedBackup } from './backup-retention.js';

function folder(id: string, name: string) {
  return { id, name, mimeType: 'application/vnd.google-apps.folder' as const };
}

describe('backup retention', () => {
  it('trashes every old LIMS backup while preserving the verified folder', async () => {
    const client = new DriveBackupClient('test-token');
    client.listChildren = async () => [
      folder('restore-target', 'LIMS_RESTORE_TARGET'),
      folder('keep', 'LIMS_BACKUP_bkp_new'),
      folder('old-2', 'LIMS_BACKUP_bkp_old_2'),
      folder('old-1', 'LIMS_BACKUP_bkp_old_1'),
      { id: 'other', name: 'unrelated-folder', mimeType: 'application/vnd.google-apps.folder' },
      { id: 'file', name: 'manifest.json.enc', mimeType: 'application/octet-stream' },
    ];
    const trashed: string[] = [];
    client.trashFile = async id => {
      trashed.push(id);
      return folder(id, id);
    };

    const result = await retainOnlyVerifiedBackup(client, 'keep', 'parent');

    assert.equal(result.applied, true);
    assert.equal(result.scanned, 2);
    assert.deepEqual(trashed, ['old-1', 'old-2']);
    assert.deepEqual(result.trashed.map(item => item.id), ['old-1', 'old-2']);
    assert.deepEqual(result.failed, []);
  });

  it('fails closed when the verified folder is not a direct active backup child', async () => {
    const client = new DriveBackupClient('test-token');
    client.listChildren = async () => [folder('old', 'LIMS_BACKUP_bkp_old')];
    let trashCalls = 0;
    client.trashFile = async id => {
      trashCalls += 1;
      return folder(id, id);
    };

    const result = await retainOnlyVerifiedBackup(client, 'missing', 'parent');

    assert.equal(result.applied, false);
    assert.equal(trashCalls, 0);
    assert.match(result.warnings[0], /không dọn các bản cũ/);
  });

  it('continues cleanup and reports individual Drive failures', async () => {
    const client = new DriveBackupClient('test-token');
    client.listChildren = async () => [
      folder('keep', 'LIMS_BACKUP_bkp_new'),
      folder('old-fail', 'LIMS_BACKUP_bkp_old_fail'),
      folder('old-ok', 'LIMS_BACKUP_bkp_old_ok'),
    ];
    client.trashFile = async id => {
      if (id === 'old-fail') throw new Error('Drive permission denied');
      return folder(id, id);
    };

    const result = await retainOnlyVerifiedBackup(client, 'keep', 'parent');

    assert.deepEqual(result.trashed.map(item => item.id), ['old-ok']);
    assert.deepEqual(result.failed.map(item => item.id), ['old-fail']);
    assert.match(result.warnings[0], /old_fail/);
  });
});
