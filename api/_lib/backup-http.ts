import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  configuredBackupAppId,
  FIRESTORE_COLLECTION_CATALOG,
  FIRESTORE_RETAINED_LEGACY_COLLECTION_CATALOG,
  FIRESTORE_ROOT_COLLECTION_CATALOG,
  FIRESTORE_SUBCOLLECTION_CATALOG,
} from './backup-contract.js';
import { requireBackupAuthorization, writeBackupAuditLog } from './backup-auth.js';
import { backupEncryptionKey } from './backup-crypto.js';
import {
  backupDriveFolderId,
  DriveBackupClient,
  getBackupDriveAccess,
} from './backup-drive.js';
import { resolvedBackupSourceFolderIds, resolvedBackupTemplateIds } from './backup-engine.js';
import { configuredAppsScriptId, readAppsScriptSourceSnapshot } from './apps-script-backup.js';
import { listRestoreCheckpoints, loadBackupManifest, runRestore, verifyBackup } from './backup-restore.js';
import type { RestoreMode } from './backup-contract.js';
import {
  advanceBackupSession,
  createBackupSession,
  loadBackupSessionWithStore,
  type BackupSessionStore,
  type BackupSession,
} from './backup-resumable.js';

export type BackupHttpHandler = (req: VercelRequest, res: VercelResponse) => Promise<unknown>;

const REQUIRED_APPS_SCRIPT_SCOPES = [
  'https://www.googleapis.com/auth/script.projects.readonly',
  'https://www.googleapis.com/auth/script.deployments.readonly',
];
const RESTORE_MODES = new Set<RestoreMode>(['DRY_RUN', 'RECOVER_MISSING', 'RESTORE_SELECTED', 'FULL_REPLACE']);

function backupProgress(session: BackupSession): Record<string, unknown> {
  return {
    phase: session.phase,
    firestoreDocuments: session.firestore.pathCounts.reduce((sum, item) => sum + item.documentCount, 0),
    firestoreParts: session.firestore.parts.length,
    authUsers: session.auth.userCount,
    authParts: session.auth.parts.length,
    driveAssets: session.drive.assets.length,
    driveAssetsPlanned: session.drive.files.length,
    driveFolders: session.drive.folders.length,
  };
}

function bodyObject(req: VercelRequest): Record<string, unknown> {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try {
      const value = JSON.parse(req.body) as unknown;
      return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
    } catch {
      return {};
    }
  }
  return {};
}

function requestedFolderId(req: VercelRequest): string {
  const body = bodyObject(req);
  if (typeof body['backupFolderId'] === 'string') return body['backupFolderId'].trim();
  return typeof req.query['backupFolderId'] === 'string' ? req.query['backupFolderId'].trim() : '';
}

function validDriveFolderId(value: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(value);
}

export async function backupStatusHandler(req: VercelRequest, res: VercelResponse): Promise<unknown> {
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
      ready: encryptionConfigured
        && backupFolderConfigured
        && driveAccess
        && appsScriptIdConfigured
        && appsScriptSourceAvailable
        && appsScriptScopesConfigured,
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
        retainedLegacyCollectionCount: FIRESTORE_RETAINED_LEGACY_COLLECTION_CATALOG.length,
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

export async function backupListHandler(req: VercelRequest, res: VercelResponse): Promise<unknown> {
  res.setHeader('Allow', 'GET');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const authorization = await requireBackupAuthorization(req, res, 'backup_verify');
  if (!authorization) return;
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup.' });
    const key = backupEncryptionKey();
    const client = new DriveBackupClient(access.accessToken);
    const children = await client.listChildren(backupDriveFolderId());
    const backupFolders = children
      .filter(item => item.mimeType === 'application/vnd.google-apps.folder' && item.name.startsWith('LIMS_BACKUP_'))
      .sort((left, right) => String(right.createdTime || '').localeCompare(String(left.createdTime || '')))
      .slice(0, 50);
    const backups = [];
    for (const folder of backupFolders) {
      try {
        const loaded = await loadBackupManifest(client, folder.id, key);
        const manifest = loaded.manifest;
        const restoreCheckpoints = await listRestoreCheckpoints(client, folder.id, manifest.backupId, key);
        backups.push({
          backupId: manifest.backupId,
          backupFolderId: folder.id,
          manifestFileId: loaded.manifestFileId,
          status: manifest.status,
          verified: manifest.verification?.status === 'PASSED',
          createdTime: folder.createdTime,
          completedAt: manifest.completedAt,
          projectId: manifest.projectId,
          releaseVersion: manifest.releaseVersion,
          firestoreDocuments: manifest.firestore.totalDocuments,
          authUsers: manifest.auth.userCount,
          driveAssets: manifest.drive.assetCount,
          driveFolders: manifest.drive.folderCount,
          warnings: manifest.warnings.length,
          errors: manifest.errors.length,
          restoreCheckpoints,
        });
      } catch (error) {
        backups.push({
          backupId: folder.name,
          backupFolderId: folder.id,
          manifestFileId: null,
          status: 'INVALID',
          verified: false,
          createdTime: folder.createdTime,
          completedAt: null,
          projectId: null,
          releaseVersion: null,
          firestoreDocuments: null,
          authUsers: null,
          driveAssets: null,
          driveFolders: null,
          warnings: 0,
          errors: 1,
          error: error instanceof Error ? error.message : 'Không đọc được manifest.',
        });
      }
    }
    return res.status(200).json({ backups });
  } catch (error) {
    console.error('[BackupList] Failed:', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Không thể đọc danh sách backup.' });
  }
}

export async function backupCreateHandler(req: VercelRequest, res: VercelResponse): Promise<unknown> {
  res.setHeader('Allow', 'POST,OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const authorization = await requireBackupAuthorization(req, res, 'backup_create');
  if (!authorization) return;
  let session: BackupSession | undefined;
  let sessionStore: BackupSessionStore | undefined;
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup. Hãy đăng nhập Google hoặc cấu hình refresh token dành riêng cho backup.' });
    const body = bodyObject(req);
    const releaseVersion = typeof body['releaseVersion'] === 'string'
      ? body['releaseVersion'].trim().slice(0, 120)
      : undefined;
    const client = new DriveBackupClient(access.accessToken);
    const key = backupEncryptionKey();
    const projectId = typeof authorization.decoded.aud === 'string' ? authorization.decoded.aud : String(authorization.decoded.aud || '');
    const requestedFolderId = typeof body['backupFolderId'] === 'string' ? body['backupFolderId'].trim() : '';
    if (requestedFolderId) {
      const loaded = await loadBackupSessionWithStore(client, requestedFolderId, key);
      session = loaded.session;
      sessionStore = loaded.store;
      if (session.actor.uid !== authorization.actor.uid) {
        return res.status(403).json({ error: 'Backup session thuộc tài khoản quản trị khác.' });
      }
    } else {
      const started = await createBackupSession(client, authorization.actor, projectId, releaseVersion, key);
      session = started.session;
      sessionStore = started.store;
    }
    console.info('[BackupCreate] Session progress before phase:', {
      backupId: session.backupId,
      phase: session.phase,
      firestoreDocuments: session.firestore.pathCounts.reduce((sum, item) => sum + item.documentCount, 0),
      firestoreParts: session.firestore.parts.length,
      authUsers: session.auth.userCount,
      driveAssets: session.drive.assets.length,
      driveAssetsPlanned: session.drive.files.length,
      nextAssetIndex: session.drive.nextAssetIndex,
    });
    const step = await advanceBackupSession(session, client, authorization.db, key, sessionStore);
    console.info('[BackupCreate] Session progress after phase:', {
      backupId: step.session.backupId,
      phase: step.session.phase,
      done: step.done,
      firestoreDocuments: step.session.firestore.pathCounts.reduce((sum, item) => sum + item.documentCount, 0),
      firestoreParts: step.session.firestore.parts.length,
      authUsers: step.session.auth.userCount,
      driveAssets: step.session.drive.assets.length,
      driveAssetsPlanned: step.session.drive.files.length,
      nextAssetIndex: step.session.drive.nextAssetIndex,
    });
    if (!step.done) {
      return res.status(202).json({
        success: false,
        done: false,
        status: 'RUNNING',
        backupId: step.session.backupId,
        backupFolderId: step.session.folders.backup,
        phase: step.session.phase,
        progress: backupProgress(step.session),
      });
    }
    const result = step.result;
    if (!result) throw new Error('Backup session hoàn tất nhưng thiếu manifest kết quả.');
    const manifest = result.manifest;
    let auditLogged = true;
    try {
      await writeBackupAuditLog(authorization, 'BACKUP_CREATE', `Tạo backup ${manifest.backupId} với trạng thái ${manifest.status}.`, {
        backupId: manifest.backupId,
        status: manifest.status,
        firestoreDocuments: manifest.firestore.totalDocuments,
        authUsers: manifest.auth.userCount,
        driveAssets: manifest.drive.assetCount,
        driveFolders: manifest.drive.folderCount,
      });
    } catch (error) {
      auditLogged = false;
      console.warn('[BackupCreate] Audit log failed:', error instanceof Error ? error.message : error);
    }
    const warnings = auditLogged ? manifest.warnings : [...manifest.warnings, 'Không ghi được audit log backup; cần kiểm tra quyền ghi Firestore logs.'];
    return res.status(result.manifest.status === 'FAILED' ? 422 : 200).json({
      success: manifest.status !== 'FAILED',
      done: true,
      backupId: manifest.backupId,
      backupFolderId: result.manifest.driveBackupFolderId,
      manifestFileId: result.manifestFileId,
      status: manifest.status,
      verified: manifest.verification?.status === 'PASSED',
      summary: {
        firestoreDocuments: manifest.firestore.totalDocuments,
        firestoreCollections: manifest.firestore.pathCounts.length,
        authUsers: manifest.auth.userCount,
        driveAssets: manifest.drive.assetCount,
        driveFolders: manifest.drive.folderCount,
        warnings: manifest.warnings.length,
        errors: manifest.errors.length,
      },
      quotaUsage: manifest.quotaUsage,
      auditLogged,
      warnings,
      errors: manifest.errors,
    });
  } catch (error) {
    console.error('[BackupCreate] Failed:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.message === 'BACKUP_SESSION_BUSY') {
      return res.status(409).json({ error: 'Backup session đang được một request khác xử lý; hãy tiếp tục sau ít giây.', retryAfterMs: 3000 });
    }
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Không thể tạo backup.' });
  }
}

export async function backupInspectHandler(req: VercelRequest, res: VercelResponse): Promise<unknown> {
  res.setHeader('Allow', 'GET');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const authorization = await requireBackupAuthorization(req, res, 'backup_verify');
  if (!authorization) return;
  const backupFolderId = requestedFolderId(req);
  if (!validDriveFolderId(backupFolderId)) return res.status(400).json({ error: 'backupFolderId không hợp lệ.' });
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup.' });
    const loaded = await loadBackupManifest(new DriveBackupClient(access.accessToken), backupFolderId, backupEncryptionKey());
    return res.status(200).json(loaded);
  } catch (error) {
    console.error('[BackupInspect] Failed:', error instanceof Error ? error.message : error);
    return res.status(422).json({ error: error instanceof Error ? error.message : 'Không thể đọc manifest backup.' });
  }
}

export async function backupVerifyHandler(req: VercelRequest, res: VercelResponse): Promise<unknown> {
  res.setHeader('Allow', 'POST,GET,OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const authorization = await requireBackupAuthorization(req, res, 'backup_verify');
  if (!authorization) return;
  const backupFolderId = requestedFolderId(req);
  if (!validDriveFolderId(backupFolderId)) return res.status(400).json({ error: 'backupFolderId không hợp lệ.' });
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup.' });
    const result = await verifyBackup(new DriveBackupClient(access.accessToken), backupFolderId, backupEncryptionKey());
    let auditLogged = true;
    try {
      await writeBackupAuditLog(authorization, 'BACKUP_VERIFY', `Kiểm tra integrity backup ${backupFolderId}: ${result.verified ? 'đạt' : 'không đạt'}.`, {
        backupFolderId,
        verified: result.verified,
        checkedParts: result.checkedParts,
        checkedAssets: result.checkedAssets,
        checkedBytes: result.checkedBytes,
        errors: result.errors.length,
      });
    } catch (error) {
      auditLogged = false;
      console.warn('[BackupVerify] Audit log failed:', error instanceof Error ? error.message : error);
    }
    const warnings = auditLogged ? result.warnings : [...result.warnings, 'Không ghi được audit log kiểm tra backup; cần kiểm tra quyền ghi Firestore logs.'];
    return res.status(result.verified ? 200 : 422).json({ success: result.verified, auditLogged, ...result, warnings });
  } catch (error) {
    console.error('[BackupVerify] Failed:', error instanceof Error ? error.message : error);
    return res.status(422).json({ success: false, error: error instanceof Error ? error.message : 'Backup không hợp lệ.' });
  }
}

export async function backupRestoreHandler(req: VercelRequest, res: VercelResponse): Promise<unknown> {
  res.setHeader('Allow', 'POST,OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const authorization = await requireBackupAuthorization(req, res, 'backup_restore');
  if (!authorization) return;
  const body = bodyObject(req);
  const backupFolderId = typeof body['backupFolderId'] === 'string' ? body['backupFolderId'].trim() : '';
  const mode = typeof body['mode'] === 'string' ? body['mode'] as RestoreMode : 'DRY_RUN';
  if (!validDriveFolderId(backupFolderId)) return res.status(400).json({ error: 'backupFolderId không hợp lệ.' });
  if (!RESTORE_MODES.has(mode)) return res.status(400).json({ error: 'Restore mode không hợp lệ.' });
  const selectedPaths = Array.isArray(body['selectedPaths'])
    ? body['selectedPaths'].filter((value): value is string => typeof value === 'string').map(value => value.trim()).filter(Boolean).slice(0, 100)
    : [];
  const resumeRestoreId = typeof body['resumeRestoreId'] === 'string' ? body['resumeRestoreId'].trim() : '';
  if (resumeRestoreId && !/^rst_[A-Za-z0-9_-]+$/.test(resumeRestoreId)) return res.status(400).json({ error: 'resumeRestoreId không hợp lệ.' });
  if (mode === 'RESTORE_SELECTED' && !selectedPaths.length) return res.status(400).json({ error: 'RESTORE_SELECTED cần selectedPaths.' });
  if (mode === 'FULL_REPLACE' && body['confirmation'] !== 'FULL_REPLACE_LIMS') {
    return res.status(400).json({ error: 'FULL_REPLACE cần confirmation = FULL_REPLACE_LIMS.' });
  }
  try {
    const access = await getBackupDriveAccess(req, res);
    if (!access) return res.status(503).json({ error: 'Chưa kết nối Google Drive backup.' });
    const key = backupEncryptionKey();
    const client = new DriveBackupClient(access.accessToken);
    if (mode === 'FULL_REPLACE') {
      const preRestoreBackupFolderId = typeof body['preRestoreBackupFolderId'] === 'string' ? body['preRestoreBackupFolderId'].trim() : '';
      if (!validDriveFolderId(preRestoreBackupFolderId) || preRestoreBackupFolderId === backupFolderId) {
        return res.status(400).json({ error: 'FULL_REPLACE cần một backup dự phòng khác và đã kiểm tra integrity.' });
      }
      const preflight = await verifyBackup(client, preRestoreBackupFolderId, key);
      if (!preflight.verified) return res.status(422).json({ success: false, error: 'Backup dự phòng không đạt integrity.', verification: preflight });
    }
    const report = await runRestore({
      db: authorization.db,
      client,
      backupFolderId,
      mode,
      selectedPaths,
      confirmation: typeof body['confirmation'] === 'string' ? body['confirmation'] : undefined,
      projectId: typeof authorization.decoded.aud === 'string' ? authorization.decoded.aud : String(authorization.decoded.aud || ''),
      key,
      restoreDrive: body['restoreDrive'] !== false,
      restoreAuth: body['restoreAuth'] !== false,
      replaceAuth: body['replaceAuth'] === true,
      resumeRestoreId: resumeRestoreId || undefined,
    });
    const success = report.auth.errors.length === 0;
    let auditLogged = true;
    try {
      await writeBackupAuditLog(authorization, 'BACKUP_RESTORE', `Restore backup ${report.backupId} theo chế độ ${report.mode}.`, {
        backupId: report.backupId,
        mode: report.mode,
        firestore: report.firestore,
        auth: {
          scanned: report.auth.scanned,
          imported: report.auth.imported,
          updated: report.auth.updated,
          failed: report.auth.failed,
        },
        drive: {
          scanned: report.drive.scanned,
          recreated: report.drive.recreated,
          restoredFromTrash: report.drive.restoredFromTrash,
          failed: report.drive.failed,
        },
      });
    } catch (error) {
      auditLogged = false;
      console.warn('[BackupRestore] Audit log failed:', error instanceof Error ? error.message : error);
      report.warnings.push('Không ghi được audit log restore; cần kiểm tra quyền ghi Firestore logs.');
    }
    return res.status(success ? 200 : 422).json({ success, auditLogged, report });
  } catch (error) {
    console.error('[BackupRestore] Failed:', error instanceof Error ? error.message : error);
    return res.status(422).json({ success: false, error: error instanceof Error ? error.message : 'Restore không hoàn tất.' });
  }
}
