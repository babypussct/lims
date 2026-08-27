import type { VercelRequest, VercelResponse } from '@vercel/node';
import { configuredBackupAppId, FIRESTORE_COLLECTION_CATALOG, FIRESTORE_ROOT_COLLECTION_CATALOG, FIRESTORE_SUBCOLLECTION_CATALOG } from '../_lib/backup-contract.js';
import { requireBackupAuthorization } from '../_lib/backup-auth.js';
import { getBackupDriveAccess, backupDriveFolderId } from '../_lib/backup-drive.js';
import { resolvedBackupSourceFolderIds, resolvedBackupTemplateIds } from '../_lib/backup-engine.js';
import { configuredAppsScriptId, readAppsScriptSourceSnapshot } from '../_lib/apps-script-backup.js';

const REQUIRED_APPS_SCRIPT_SCOPES = [
  'https://www.googleapis.com/auth/script.projects.readonly',
  'https://www.googleapis.com/auth/script.deployments.readonly',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Allow', 'GET');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const authorization = await requireBackupAuthorization(req, res, 'backup_verify');
  if (!authorization) return;
  try {
    let backupFolderConfigured = false;
    try {
      backupDriveFolderId();
      backupFolderConfigured = true;
    } catch {
      // Report configuration state without echoing secret values.
    }
    let driveAccess = false;
    let driveAccessSource: string | null = null;
    let driveScope = '';
    try {
      const access = await getBackupDriveAccess(req, res);
      driveAccess = Boolean(access?.accessToken);
      driveAccessSource = access?.source || null;
      driveScope = access?.scope || '';
    } catch {
      // The create/verify endpoints return the actionable error. Status stays
      // safe to call so an administrator can see which prerequisite is absent.
    }
    const encryptionConfigured = Boolean(process.env['LIMS_BACKUP_ENCRYPTION_KEY']);
    const restoreTargetConfigured = Boolean(process.env['LIMS_BACKUP_DRIVE_RESTORE_FOLDER_ID']?.trim());
    const appsScriptIdConfigured = Boolean(configuredAppsScriptId());
    let appsScriptSourceAvailable = false;
    try {
      const source = readAppsScriptSourceSnapshot();
      appsScriptSourceAvailable = source.files.length > 0 && source.templateIds.length > 0;
    } catch {
      // The create endpoint will return the actionable error; status only
      // exposes a safe boolean so the administrator can complete deployment.
    }
    const grantedScopes = new Set(driveScope.split(/\s+/).filter(Boolean));
    const appsScriptScopesKnown = Boolean(driveScope);
    const appsScriptScopesConfigured = REQUIRED_APPS_SCRIPT_SCOPES.every(scope => grantedScopes.has(scope));
    return res.status(200).json({
      appId: configuredBackupAppId(),
      ready: encryptionConfigured && backupFolderConfigured && driveAccess && appsScriptIdConfigured && appsScriptSourceAvailable && appsScriptScopesConfigured,
      encryption: {
        configured: encryptionConfigured,
        keyIdConfigured: Boolean(process.env['LIMS_BACKUP_ENCRYPTION_KEY_ID']?.trim()),
      },
      drive: {
        backupFolderConfigured,
        accessAvailable: driveAccess,
        accessSource: driveAccessSource,
        sourceFolderCount: resolvedBackupSourceFolderIds().length,
        templateCount: resolvedBackupTemplateIds().length,
        restoreTargetConfigured,
      },
      appsScript: {
        scriptIdConfigured: appsScriptIdConfigured,
        sourceBundleAvailable: appsScriptSourceAvailable,
        scopesKnown: appsScriptScopesKnown,
        scopesConfigured: appsScriptScopesConfigured,
        requiredScopes: REQUIRED_APPS_SCRIPT_SCOPES,
      },
      firestore: {
        topLevelCollectionCount: FIRESTORE_COLLECTION_CATALOG.length,
        rootCollectionCount: FIRESTORE_ROOT_COLLECTION_CATALOG.length,
        nestedPatternCount: FIRESTORE_SUBCOLLECTION_CATALOG.length,
      },
      policies: {
        defaultRestoreMode: 'RECOVER_MISSING',
        firebaseManagedExportRequired: false,
        billingRequiredForDesign: false,
      },
      actorUid: authorization.actor.uid,
    });
  } catch (error) {
    console.error('[BackupStatus] Failed:', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: 'Không thể đọc trạng thái backup.' });
  }
}
