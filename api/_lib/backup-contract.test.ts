import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  FIRESTORE_BACKUP_COLLECTION_CATALOG,
  FIRESTORE_COLLECTION_CATALOG,
  FIRESTORE_RETAINED_LEGACY_COLLECTION_CATALOG,
  FIRESTORE_ROOT_COLLECTION_CATALOG,
  FIRESTORE_SUBCOLLECTION_CATALOG,
  appPath,
  pathBelongsToApp,
  safeBackupName,
} from './backup-contract.js';
import { isRestoreablePath } from './firestore-backup.js';

describe('LIMS backup coverage contract', () => {
  it('keeps the audited Firestore catalog explicit and unique', () => {
    assert.equal(FIRESTORE_COLLECTION_CATALOG.length, 32);
    assert.equal(new Set(FIRESTORE_COLLECTION_CATALOG).size, 32);
    assert.deepEqual(FIRESTORE_RETAINED_LEGACY_COLLECTION_CATALOG, [
      'daily_checks',
      'public',
      'stats_aggregates',
    ]);
    assert.equal(FIRESTORE_BACKUP_COLLECTION_CATALOG.length, 35);
    assert.equal(new Set(FIRESTORE_BACKUP_COLLECTION_CATALOG).size, 35);
    assert.deepEqual(FIRESTORE_ROOT_COLLECTION_CATALOG, ['releases']);
    assert.deepEqual(FIRESTORE_SUBCOLLECTION_CATALOG, [
      { parentCollection: 'inventory', collection: 'history' },
      { parentCollection: 'reference_standards', collection: 'logs' },
      { parentCollection: 'sops', collection: 'history' },
      { parentCollection: 'requests', collection: 'history' },
    ]);
  });

  it('accepts only document paths in the LIMS namespace or releases', () => {
    assert.equal(appPath('lims-cloud-fixed'), 'artifacts/lims-cloud-fixed');
    assert.equal(pathBelongsToApp('artifacts/lims-cloud-fixed/sops/sop-1', 'lims-cloud-fixed'), true);
    assert.equal(isRestoreablePath('artifacts/lims-cloud-fixed/sops/sop-1', 'lims-cloud-fixed'), true);
    assert.equal(isRestoreablePath('artifacts/lims-cloud-fixed/sops/sop-1/history/h-1', 'lims-cloud-fixed'), true);
    assert.equal(isRestoreablePath('releases/v1', 'lims-cloud-fixed'), true);
    assert.equal(isRestoreablePath('artifacts/other-app/sops/sop-1', 'lims-cloud-fixed'), false);
    assert.equal(isRestoreablePath('artifacts/lims-cloud-fixed/auth_sessions/session-1', 'lims-cloud-fixed'), false);
    assert.equal(isRestoreablePath('artifacts/lims-cloud-fixed/sops/../users/admin', 'lims-cloud-fixed'), false);
    assert.equal(safeBackupName('LIMS / backup: 2026'), 'LIMS_backup_2026');
  });
});
