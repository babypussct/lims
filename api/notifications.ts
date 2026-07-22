import { VercelRequest, VercelResponse } from '@vercel/node';

const NOTIFICATION_TYPES = new Set([
  'COA_REQUEST', 'BORROW_REQUEST', 'REQUEST_APPROVED', 'REQUEST_REJECTED',
  'RETURN_OVERDUE', 'STOCK_LOW_ALERT', 'SYSTEM_INFO', 'SYSTEM_UPDATE'
]);

const USER_INITIATED_ADMIN_EVENTS = new Set([
  'COA_REQUEST', 'BORROW_REQUEST'
]);

function chunks<T>(items: T[] | null | undefined, size: number): T[][] {
  if (!items || !items.length) return [];
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

function cleanObject(value: Record<string, unknown>): Record<string, unknown> {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}

async function removeStaleTokens(
  appId: string,
  staleTokens: string[],
  usersCollection: FirebaseFirestore.CollectionReference,
  loadedUsersMap: Map<string, FirebaseFirestore.DocumentData> | null,
  recipientUids: string[]
): Promise<void> {
  if (!staleTokens || !staleTokens.length) return;
  const admin = await import('firebase-admin');
  const FieldValue = admin.firestore.FieldValue;
  const staleSet = new Set(staleTokens);

  const uidsToClean: string[] = [];
  if (loadedUsersMap) {
    for (const [uid, userData] of loadedUsersMap) {
      if (!userData) continue;
      const tokens: string[] = Array.isArray(userData['fcmTokens']) ? userData['fcmTokens'] : [];
      if (tokens.some(t => staleSet.has(t))) uidsToClean.push(uid);
    }
  } else if (Array.isArray(recipientUids)) {
    uidsToClean.push(...recipientUids);
  }

  for (const uid of uidsToClean) {
    if (!uid) continue;
    const userRef = usersCollection.doc(uid);
    await userRef.update({ fcmTokens: FieldValue.arrayRemove(...staleTokens) })
      .catch(() => {});
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Allow', 'POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    if (!body || typeof body !== 'object') body = {};

    const authorization = req.headers?.authorization || '';
    const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!idToken) return res.status(401).json({ error: 'Thiếu Firebase ID token.' });

    const admin = await import('firebase-admin');
    if (!admin.apps.length) {
      const serviceAccountJson = process.env['FIREBASE_SERVICE_ACCOUNT'];
      if (!serviceAccountJson) throw new Error('FIREBASE_SERVICE_ACCOUNT is not configured.');
      
      let serviceAccount: any;
      try {
        serviceAccount = typeof serviceAccountJson === 'string'
          ? JSON.parse(serviceAccountJson)
          : serviceAccountJson;
      } catch (e: any) {
        throw new Error(`FIREBASE_SERVICE_ACCOUNT JSON parse error: ${e.message}`);
      }

      if (serviceAccount && typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const db = admin.firestore();
    const appId = typeof body.appId === 'string' ? body.appId : 'lims-cloud-fixed';
    const profileRef = db.doc(`artifacts/${appId}/users/${decoded.uid}`);
    const profileSnap = await profileRef.get();
    if (!profileSnap.exists) return res.status(403).json({ error: 'Tài khoản không thuộc hệ thống này.' });

    const profile = profileSnap.data() || {};
    const isManager = profile['role'] === 'manager';
    const directPermissions = [
      ...(Array.isArray(profile['permissions']) ? profile['permissions'] : []),
      ...(Array.isArray(profile['customPermissions']) ? profile['customPermissions'] : [])
    ];
    let rolePermissions: string[] = [];
    if (profile['role'] === 'staff') {
      const roleId = typeof profile['roleId'] === 'string' && profile['roleId']
        ? profile['roleId']
        : 'role_staff_default';
      const roleConfig = await db.doc(`artifacts/${appId}/roles_config/${roleId}`).get();
      if (roleConfig.exists && Array.isArray(roleConfig.data()?.['permissions'])) {
        rolePermissions = roleConfig.data()?.['permissions'] || [];
      } else if (roleId === 'role_qc_lead') {
        rolePermissions = ['standard_edit', 'standard_approve'];
      }
    }
    const canManageStandards = isManager
      || directPermissions.includes('standard_edit')
      || directPermissions.includes('standard_approve')
      || rolePermissions.includes('standard_edit')
      || rolePermissions.includes('standard_approve');
    const action = body.action;

    if (action === 'deleteGroup') {
      if (!isManager) return res.status(403).json({ error: 'Chỉ quản trị viên được thu hồi broadcast.' });
      const groupId = typeof body.groupId === 'string' ? body.groupId : '';
      if (!groupId) return res.status(400).json({ error: 'Thiếu groupId.' });

      const snapshot = await db.collection(`artifacts/${appId}/notifications`)
        .where('groupId', '==', groupId).get();
      for (const group of chunks(snapshot.docs, 400)) {
        const batch = db.batch();
        group.forEach(item => batch.delete(item.ref));
        await batch.commit();
      }
      return res.status(200).json({ success: true, deletedCount: snapshot.size });
    }

    if (action !== 'publish') return res.status(400).json({ error: 'Action không hợp lệ.' });

    const input = (body.notification && typeof body.notification === 'object') ? body.notification : {};
    const recipientUid = typeof input.recipientUid === 'string' ? input.recipientUid : '';
    const type = typeof input.type === 'string' ? input.type : '';
    const title = typeof input.title === 'string' ? input.title.trim() : '';
    const message = typeof input.message === 'string' ? input.message.trim() : '';

    if (!recipientUid || !NOTIFICATION_TYPES.has(type) || !title || !message) {
      return res.status(400).json({ error: 'Notification thiếu recipient, type, title hoặc message.' });
    }
    if (title.length > 160 || message.length > 4000) {
      return res.status(400).json({ error: 'Nội dung thông báo vượt quá giới hạn.' });
    }

    if (recipientUid === 'role:all' && (!isManager || type !== 'SYSTEM_UPDATE')) {
      return res.status(403).json({ error: 'Không có quyền gửi broadcast toàn hệ thống.' });
    }
    if (recipientUid === 'role:admin' && !isManager && !canManageStandards && !USER_INITIATED_ADMIN_EVENTS.has(type)) {
      return res.status(403).json({ error: 'Không có quyền gửi loại thông báo này đến quản trị viên.' });
    }
    if (!recipientUid.startsWith('role:') && !canManageStandards && recipientUid !== decoded.uid) {
      return res.status(403).json({ error: 'Không có quyền gửi thông báo trực tiếp cho người dùng khác.' });
    }

    const usersCollection = db.collection(`artifacts/${appId}/users`);
    let recipientUids: string[];
    let loadedUsersMap: Map<string, FirebaseFirestore.DocumentData> | null = null;

    if (recipientUid === 'role:all' || recipientUid === 'role:admin') {
      const users = await usersCollection.get();
      const roles = recipientUid === 'role:admin'
        ? await db.collection(`artifacts/${appId}/roles_config`).get()
        : null;
      const permissionsByRole = new Map<string, string[]>(
        roles?.docs ? roles.docs.map(roleDoc => {
          const data = roleDoc.data() || {};
          return [
            roleDoc.id,
            Array.isArray(data['permissions']) ? (data['permissions'] as string[]) : []
          ];
        }) : []
      );

      loadedUsersMap = new Map();
      const matchingUids: string[] = [];

      for (const userDoc of users.docs) {
        const userData = userDoc.data() || {};
        loadedUsersMap.set(userDoc.id, userData);

        if (recipientUid === 'role:all') {
          matchingUids.push(userDoc.id);
        } else {
          const configuredRolePermissions = permissionsByRole.get(userData['roleId'] || 'role_staff_default') || [];
          const roleStr = typeof userData['role'] === 'string' ? userData['role'].toLowerCase() : '';
          const isAdmin = roleStr === 'manager'
            || (Array.isArray(userData['permissions']) && userData['permissions'].includes('standard_approve'))
            || (Array.isArray(userData['customPermissions']) && userData['customPermissions'].includes('standard_approve'))
            || (Array.isArray(configuredRolePermissions) && configuredRolePermissions.includes('standard_approve'))
            || (userData['roleId'] === 'role_qc_lead' && !permissionsByRole.has('role_qc_lead'));

          if (isAdmin) {
            matchingUids.push(userDoc.id);
          }
        }
      }

      recipientUids = matchingUids;
      console.log(`[Notifications API] Resolved ${recipientUid} to ${recipientUids.length} users:`, recipientUids);
    } else {
      recipientUids = [recipientUid];
    }

    if (!recipientUids.length) return res.status(200).json({ success: true, recipientCount: 0, sentCount: 0 });

    const notificationCollection = db.collection(`artifacts/${appId}/notifications`);
    const eventId = typeof input.eventId === 'string' && input.eventId
      ? input.eventId
      : (typeof input.groupId === 'string' && input.groupId ? input.groupId : notificationCollection.doc().id);
    const createdAt = Date.now();
    const storedPayload = cleanObject({
      type,
      level: input.level,
      title,
      message,
      targetId: input.targetId,
      actionUrl: input.actionUrl,
      senderUid: decoded.uid,
      senderName: (typeof input.senderName === 'string' && input.senderName.trim())
        ? input.senderName.trim()
        : (profile['displayName'] || decoded['name'] || 'Người dùng'),
      groupId: eventId,
      eventId,
      isRead: false,
      createdAt
    });

    for (const group of chunks(recipientUids, 400)) {
      const batch = db.batch();
      group.forEach(uid => {
        const ref = notificationCollection.doc();
        batch.set(ref, { ...storedPayload, id: ref.id, recipientUid: uid });
      });
      await batch.commit();
    }

    let sentCount = 0;
    let failureCount = 0;
    let pushError: string | undefined;

    if (body.sendPush !== false) {
      try {
        let tokens: string[] = [];
        if (loadedUsersMap) {
          tokens = [...new Set(recipientUids.flatMap(uid => {
            const userData = loadedUsersMap!.get(uid);
            const fcmTokens = userData?.['fcmTokens'];
            return Array.isArray(fcmTokens) ? fcmTokens.filter((token): token is string => typeof token === 'string') : [];
          }))];
        } else {
          const userDocs = await Promise.all(recipientUids.map(uid => usersCollection.doc(uid).get()));
          tokens = [...new Set(userDocs.flatMap(userDoc => {
            const fcmTokens = userDoc.data()?.['fcmTokens'];
            return Array.isArray(fcmTokens) ? fcmTokens.filter((token): token is string => typeof token === 'string') : [];
          }))];
        }

        console.log(`[Notifications API] Found ${tokens.length} FCM tokens to push.`);

        for (const tokenGroup of chunks(tokens, 500)) {
          if (!tokenGroup || tokenGroup.length === 0) continue;
          const response = await admin.messaging().sendEachForMulticast({
            notification: { title, body: message },
            data: {
              eventId,
              level: typeof input.level === 'string' ? input.level : 'info',
              actionUrl: typeof input.actionUrl === 'string' ? input.actionUrl : ''
            },
            webpush: { fcmOptions: { link: typeof input.actionUrl === 'string' && input.actionUrl ? input.actionUrl : '/' } },
            tokens: tokenGroup
          });
          sentCount += response?.successCount || 0;
          failureCount += response?.failureCount || 0;

          if (response && response.failureCount > 0 && Array.isArray(response.responses)) {
            const staleTokens = tokenGroup.filter((_, idx) => {
              const r = response.responses[idx];
              return r && !r.success && (
                r.error?.code === 'messaging/registration-token-not-registered' ||
                r.error?.code === 'messaging/invalid-registration-token'
              );
            });
            if (staleTokens.length > 0) {
              console.log(`[Notifications API] Cleaning ${staleTokens.length} stale FCM tokens.`);
              removeStaleTokens(appId, staleTokens, usersCollection, loadedUsersMap, recipientUids)
                .catch(e => console.warn('[Notifications API] Stale token cleanup failed:', e));
            }
          }
        }
      } catch (pErr: any) {
        pushError = pErr?.message || String(pErr);
        console.error('[Notifications API] Push notification failed (inbox notification saved):', pushError);
      }
    }

    return res.status(200).json({
      success: true,
      eventId,
      recipientCount: recipientUids.length,
      sentCount,
      failureCount,
      ...(pushError ? { pushError } : {})
    });
  } catch (error: any) {
    console.error('[Notifications API] Error:', error);
    const status = error?.code?.startsWith?.('auth/') ? 401 : 500;
    const errorMessage = error?.message || 'Không thể gửi thông báo.';
    return res.status(status).json({
      error: status === 401 ? 'Firebase ID token không hợp lệ.' : errorMessage
    });
  }
}

