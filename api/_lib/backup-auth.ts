import { randomBytes } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { FieldValue, getFirestore, type DocumentData, type Firestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdminIfNeeded } from './firebase-admin.js';
import { configuredBackupAppId, type BackupActor } from './backup-contract.js';
import { fallbackRolePermissions } from './activity-notification-dispatch.js';

export interface BackupAuthorization {
  actor: BackupActor;
  decoded: DecodedIdToken;
  profile: DocumentData;
  db: Firestore;
}

export type BackupAuditAction = 'BACKUP_CREATE' | 'BACKUP_VERIFY' | 'BACKUP_RESTORE' | 'BACKUP_RETENTION';

function scrubAuditValue(value: unknown, key = '', depth = 0): unknown {
  if (depth > 4) return '[truncated]';
  if (/token|cookie|secret|password|credential|authorization/i.test(key)) return '[redacted]';
  if (Array.isArray(value)) return value.slice(0, 50).map(item => scrubAuditValue(item, '', depth + 1));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).slice(0, 50)
      .map(([childKey, childValue]) => [childKey, scrubAuditValue(childValue, childKey, depth + 1)]));
  }
  if (typeof value === 'string') return value.slice(0, 500);
  return value;
}

/** Write a small, token-free audit event using the existing immutable /logs model. */
export async function writeBackupAuditLog(
  authorization: BackupAuthorization,
  action: BackupAuditAction,
  details: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  const actorName = typeof authorization.profile['displayName'] === 'string' && authorization.profile['displayName']
    ? authorization.profile['displayName'] as string
    : authorization.actor.email || authorization.actor.uid;
  const eventId = `backup-${Date.now()}-${randomBytes(5).toString('hex')}`;
  await authorization.db.doc(`artifacts/${authorization.actor.appId}/logs/${eventId}`).set({
    id: eventId,
    eventId,
    schemaVersion: 2,
    action,
    module: 'SYSTEM',
    audience: 'SYSTEM_ADMIN',
    importance: action === 'BACKUP_RESTORE' ? 'WARNING' : 'IMPORTANT',
    auditClass: 'SYSTEM',
    activityVisible: true,
    actorUid: authorization.actor.uid,
    actorName: actorName.slice(0, 200),
    targetType: 'BACKUP',
    details: details.slice(0, 2_000),
    metadata: scrubAuditValue(metadata),
    timestamp: FieldValue.serverTimestamp(),
    lastUpdated: FieldValue.serverTimestamp(),
    publicTraceable: false,
    user: actorName.slice(0, 200),
  });
}

export async function requireBackupAuthorization(
  req: VercelRequest,
  res: VercelResponse,
  requiredPermission: 'backup_create' | 'backup_verify' | 'backup_restore' = 'backup_create',
): Promise<BackupAuthorization | null> {
  const authorization = req.headers?.authorization || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!idToken) {
    res.status(401).json({ error: 'Thiếu Firebase ID token.' });
    return null;
  }

  try {
    initializeFirebaseAdminIfNeeded();
    const decoded = await getAuth().verifyIdToken(idToken);
    const appId = configuredBackupAppId();
    const db = getFirestore();
    const profileSnapshot = await db.doc(`artifacts/${appId}/users/${decoded.uid}`).get();
    if (!profileSnapshot.exists) {
      res.status(403).json({ error: 'Tài khoản không thuộc namespace LIMS này.' });
      return null;
    }
    const profile = profileSnapshot.data() || {};
    const direct = [
      ...(Array.isArray(profile['permissions']) ? profile['permissions'] : []),
      ...(Array.isArray(profile['customPermissions']) ? profile['customPermissions'] : []),
    ].filter((value): value is string => typeof value === 'string');
    let rolePermissions: string[] = [];
    if (profile['role'] === 'staff') {
      const roleId = typeof profile['roleId'] === 'string' && profile['roleId'].trim()
        ? profile['roleId'].trim()
        : 'role_staff_default';
      const roleConfig = await db.doc(`artifacts/${appId}/roles_config/${roleId}`).get();
      rolePermissions = roleConfig.exists && Array.isArray(roleConfig.data()?.['permissions'])
        ? (roleConfig.data()?.['permissions'] as unknown[]).filter((value): value is string => typeof value === 'string')
        : fallbackRolePermissions(roleId);
    }
    const allowed = profile['role'] === 'manager'
      || (profile['role'] === 'staff' && [...direct, ...rolePermissions].includes(requiredPermission));
    if (!allowed) {
      res.status(403).json({ error: 'Bạn không có quyền thực hiện thao tác backup/restore.' });
      return null;
    }
    return {
      actor: { uid: decoded.uid, email: decoded.email, appId },
      decoded,
      profile,
      db,
    };
  } catch (error) {
    console.error('[BackupAuth] Authorization failed:', error instanceof Error ? error.message : error);
    res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
    return null;
  }
}
