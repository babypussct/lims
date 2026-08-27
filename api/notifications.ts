import { VercelRequest, VercelResponse } from '@vercel/node';
import { getAuth } from 'firebase-admin/auth';
import {
  CollectionReference,
  DocumentData,
  FieldValue,
  getFirestore
} from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { initializeFirebaseAdminIfNeeded } from './_lib/firebase-admin.js';
import { notificationDocumentId, shouldClaimNotificationPush, uniqueStringValues } from './_lib/notification-utils.js';
import {
  actorMayDispatchContract,
  canonicalDispatchActionUrl,
  fallbackRolePermissions,
  notificationTitleForType,
  resultStakeholderUids,
  standardCoaRequesterUids,
  standardRequesterUids,
  suppressActorUid,
  userHasAnyPermission,
  validateCanonicalDispatchEvent,
  type ActivityDispatchContract,
  type CanonicalDispatchEvent
} from './_lib/activity-notification-dispatch.js';

const NOTIFICATION_TYPES = new Set([
  'COA_REQUEST', 'BORROW_REQUEST', 'REQUEST_APPROVED', 'REQUEST_REJECTED',
  'RETURN_OVERDUE', 'STOCK_LOW_ALERT', 'SYSTEM_INFO', 'SYSTEM_UPDATE',
  'RESULT_PUBLISHED', 'RESULT_RESET', 'RESULT_REVERTED', 'STANDARD_RETURN_PENDING'
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

function sameStringArray(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

async function removeStaleTokens(
  appId: string,
  staleTokens: string[],
  usersCollection: CollectionReference,
  loadedUsersMap: Map<string, DocumentData> | null,
  recipientUids: string[]
): Promise<void> {
  if (!staleTokens || !staleTokens.length) return;
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

    initializeFirebaseAdminIfNeeded();

    const decoded = await getAuth().verifyIdToken(idToken);
    const db = getFirestore();
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
      } else {
        rolePermissions = fallbackRolePermissions(roleId);
      }
    }
    const canManageStandards = isManager
      || directPermissions.includes('standard_edit')
      || directPermissions.includes('standard_approve')
      || rolePermissions.includes('standard_edit')
      || rolePermissions.includes('standard_approve');
    const action = body.action;

    const usersCollection = db.collection(`artifacts/${appId}/users`);

    if (action === 'registerToken') {
      const token = typeof body.token === 'string' ? body.token.trim() : '';
      const previousToken = typeof body.previousToken === 'string' ? body.previousToken.trim() : '';
      if (token.length < 20 || token.length > 4096) {
        return res.status(400).json({ error: 'FCM token không hợp lệ.' });
      }

      const [owners, previousOwners] = await Promise.all([
        usersCollection.where('fcmTokens', 'array-contains', token).get(),
        previousToken && previousToken !== token
          ? usersCollection.where('fcmTokens', 'array-contains', previousToken).get()
          : Promise.resolve(null)
      ]);
      const batch = db.batch();
      const tokensToRemoveByUid = new Map<string, Set<string>>();
      owners.docs.forEach(owner => {
        if (owner.id !== decoded.uid) {
          tokensToRemoveByUid.set(owner.id, new Set([token]));
        }
      });
      previousOwners?.docs.forEach(owner => {
        if (owner.id === decoded.uid) return;
        const removals = tokensToRemoveByUid.get(owner.id) || new Set<string>();
        removals.add(previousToken);
        tokensToRemoveByUid.set(owner.id, removals);
      });
      tokensToRemoveByUid.forEach((tokensToRemove, uid) => {
        batch.update(usersCollection.doc(uid), {
          fcmTokens: FieldValue.arrayRemove(...tokensToRemove)
        });
      });
      const currentTokens = uniqueStringValues(profile['fcmTokens']);
      const tokenAlreadyRegistered = currentTokens.includes(token);
      const previousTokenNeedsRemoval = Boolean(
        previousToken && previousToken !== token && currentTokens.includes(previousToken)
      );
      const nextTokens = tokenAlreadyRegistered && !previousTokenNeedsRemoval
        ? currentTokens
        : [...currentTokens.filter(item => item !== token && item !== previousToken), token];
      if (!sameStringArray(currentTokens, nextTokens)) {
        batch.update(profileRef, { fcmTokens: nextTokens });
      }
      if (!sameStringArray(currentTokens, nextTokens) || tokensToRemoveByUid.size > 0) {
        await batch.commit();
      }

      return res.status(200).json({
        success: true,
        reassignedCount: tokensToRemoveByUid.size
      });
    }

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

    if (action !== 'publish' && action !== 'dispatchEvent') {
      return res.status(400).json({ error: 'Action không hợp lệ.' });
    }

    let input: any;
    let recipientUids: string[] = [];
    let loadedUsersMap: Map<string, DocumentData> | null = null;
    let dispatchContract: ActivityDispatchContract | null = null;
    let dispatchAction = '';

    const loadRecipientDirectory = async () => {
      const [users, roles] = await Promise.all([
        usersCollection.get(),
        db.collection(`artifacts/${appId}/roles_config`).get()
      ]);
      loadedUsersMap = new Map(users.docs.map(userDoc => [userDoc.id, userDoc.data() || {}]));
      const permissionsByRole = new Map<string, string[]>(roles.docs.map(roleDoc => {
        const data = roleDoc.data() || {};
        return [roleDoc.id, Array.isArray(data['permissions']) ? data['permissions'] as string[] : []];
      }));
      return { users, permissionsByRole };
    };

    const resolvePermissionRecipients = async (requiredPermissions: readonly string[]) => {
      const { users, permissionsByRole } = await loadRecipientDirectory();
      return users.docs.filter(userDoc => {
        const userData = userDoc.data() || {};
        const roleId = typeof userData['roleId'] === 'string' && userData['roleId']
          ? userData['roleId']
          : 'role_staff_default';
        const configured = permissionsByRole.has(roleId)
          ? permissionsByRole.get(roleId) || []
          : fallbackRolePermissions(roleId);
        return userHasAnyPermission(userData, configured, requiredPermissions);
      }).map(userDoc => userDoc.id);
    };

    if (action === 'dispatchEvent') {
      const requestedEventId = typeof body.eventId === 'string' ? body.eventId.trim() : '';
      if (!requestedEventId || requestedEventId.length > 500 || requestedEventId.includes('/')) {
        return res.status(400).json({ error: 'eventId không hợp lệ.' });
      }

      const eventSnapshot = await db.doc(`artifacts/${appId}/logs/${requestedEventId}`).get();
      if (!eventSnapshot.exists) return res.status(404).json({ error: 'Activity event không tồn tại.' });
      const event = eventSnapshot.data() as CanonicalDispatchEvent;
      const validation = validateCanonicalDispatchEvent(requestedEventId, event);
      if (!validation.ok) {
        return res.status(400).json({ error: `Activity event không đủ điều kiện dispatch (${validation.reason}).` });
      }
      if (event.actorUid !== decoded.uid) {
        return res.status(403).json({ error: 'Chỉ actor của Activity event được dispatch/retry notification.' });
      }

      dispatchContract = validation.contract;
      dispatchAction = validation.action;
      if (!actorMayDispatchContract(profile, rolePermissions, dispatchContract)) {
        return res.status(403).json({ error: 'Actor không có quyền dispatch workflow notification này.' });
      }
      if (dispatchContract.recipientStrategy === 'STANDARD_APPROVERS') {
        recipientUids = await resolvePermissionRecipients(['standard_approve', 'standard_edit']);
      } else if (dispatchContract.recipientStrategy === 'INVENTORY_OPERATORS') {
        recipientUids = await resolvePermissionRecipients(['inventory_edit']);
      } else if (dispatchContract.recipientStrategy === 'SYSTEM_ADMINS') {
        recipientUids = await resolvePermissionRecipients(['user_manage']);
      } else if (dispatchContract.recipientStrategy === 'SYSTEM_ALL_USERS') {
        const { users } = await loadRecipientDirectory();
        recipientUids = users.docs.map(userDoc => userDoc.id);
      } else if (dispatchContract.recipientStrategy === 'STANDARD_REQUESTER') {
        const requestId = typeof event.requestId === 'string' ? event.requestId.trim() : '';
        if (requestId) {
          const requestSnapshot = await db.doc(`artifacts/${appId}/standard_requests/${requestId}`).get();
          if (requestSnapshot.exists) recipientUids = standardRequesterUids(requestSnapshot.data() || {});
        }
      } else if (dispatchContract.recipientStrategy === 'STANDARD_COA_REQUESTERS') {
        const standards = await db.collection(`artifacts/${appId}/reference_standards`)
          .where('lastCoaNotificationEventId', '==', requestedEventId)
          .get();
        recipientUids = standardCoaRequesterUids(standards.docs.map(item => item.data() || {}));
      } else if (dispatchContract.recipientStrategy === 'RESULT_STAKEHOLDERS') {
        const requestId = typeof event.requestId === 'string' && event.requestId.trim()
          ? event.requestId.trim()
          : (typeof event.targetId === 'string' ? event.targetId.trim() : '');
        if (requestId) {
          const requestSnapshot = await db.doc(`artifacts/${appId}/requests/${requestId}`).get();
          if (requestSnapshot.exists) recipientUids = resultStakeholderUids(requestSnapshot.data() || {});
        }
      }

      recipientUids = suppressActorUid(
        recipientUids,
        String(event.actorUid),
        dispatchContract.suppressActor
      );
      const title = notificationTitleForType(dispatchContract.type);
      const message = typeof event.details === 'string' ? event.details.trim() : '';
      input = cleanObject({
        eventId: requestedEventId,
        type: dispatchContract.type,
        title,
        message,
        level: event.module === 'SYSTEM' || dispatchContract.type === 'STOCK_LOW_ALERT' ? 'warning' : 'info',
        targetId: typeof event.targetId === 'string' ? event.targetId : undefined,
        targetType: typeof event.targetType === 'string' ? event.targetType : undefined,
        targetName: typeof event.targetName === 'string' ? event.targetName : undefined,
        requestId: typeof event.requestId === 'string' ? event.requestId : undefined,
        activityAction: validation.action,
        module: dispatchContract.module,
        actionUrl: canonicalDispatchActionUrl(validation.action, event),
        senderUid: decoded.uid,
        senderName: typeof event.actorName === 'string' && event.actorName.trim()
          ? event.actorName.trim()
          : (profile['displayName'] || decoded['name'] || 'Người dùng')
      });
    } else {
      input = (body.notification && typeof body.notification === 'object') ? body.notification : {};
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

            if (isAdmin) matchingUids.push(userDoc.id);
          }
        }

        recipientUids = [...new Set(matchingUids)];
        console.log(`[Notifications API] Resolved ${recipientUid} to ${recipientUids.length} users:`, recipientUids);
      } else {
        recipientUids = [recipientUid];
      }
    }

    const type = typeof input.type === 'string' ? input.type : '';
    const title = typeof input.title === 'string' ? input.title.trim() : '';
    const message = typeof input.message === 'string' ? input.message.trim() : '';
    if (!NOTIFICATION_TYPES.has(type) || !title || !message || title.length > 160 || message.length > 4000) {
      return res.status(400).json({ error: 'Notification projection không hợp lệ.' });
    }

    if (!recipientUids.length) return res.status(200).json({ success: true, recipientCount: 0, sentCount: 0 });

    const notificationCollection = db.collection(`artifacts/${appId}/notifications`);
    const eventId = typeof input.eventId === 'string' && input.eventId
      ? input.eventId
      : (typeof input.groupId === 'string' && input.groupId ? input.groupId : notificationCollection.doc().id);
    if (eventId.length > 500) {
      return res.status(400).json({ error: 'eventId vượt quá giới hạn.' });
    }
    const createdAt = Date.now();
    const storedPayload = cleanObject({
      type,
      level: input.level,
      title,
      message,
      targetId: input.targetId,
      targetType: input.targetType,
      targetName: input.targetName,
      requestId: input.requestId,
      activityAction: input.activityAction,
      module: input.module,
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

    const sendPush = dispatchContract
      ? dispatchContract.channels.includes('push')
      : body.sendPush !== false;
    const pushClaimId = notificationCollection.doc().id;
    const claimedRecipientUids: string[] = [];
    let createdCount = 0;

    for (const group of chunks(recipientUids, 400)) {
      const refs = group.map(uid =>
        notificationCollection.doc(notificationDocumentId(eventId, uid))
      );
      const result = await db.runTransaction(async transaction => {
        const snapshots = await transaction.getAll(...refs);
        const claimed: string[] = [];
        let created = 0;

        snapshots.forEach((snapshot, index) => {
          const uid = group[index];
          const ref = refs[index];
          if (snapshot.exists) {
            const existing = snapshot.data() || {};
            if (shouldClaimNotificationPush(existing, sendPush, createdAt)) {
              transaction.update(ref, {
                pushStatus: 'sending',
                pushClaimId,
                pushClaimedAt: createdAt,
                pushError: FieldValue.delete()
              });
              claimed.push(uid);
            }
            return;
          }

          transaction.create(ref, {
            ...storedPayload,
            id: ref.id,
            recipientUid: uid,
            pushStatus: sendPush ? 'sending' : 'not_requested',
            ...(sendPush ? { pushClaimId, pushClaimedAt: createdAt } : {})
          });
          created++;
          if (sendPush) claimed.push(uid);
        });

        return { claimed, created };
      });
      claimedRecipientUids.push(...result.claimed);
      createdCount += result.created;
    }

    let sentCount = 0;
    let failureCount = 0;
    let pushError: string | undefined;

    if (sendPush && claimedRecipientUids.length > 0) {
      try {
        let tokens: string[] = [];
        if (loadedUsersMap) {
          tokens = uniqueStringValues(claimedRecipientUids.flatMap(uid => {
            const userData = loadedUsersMap!.get(uid);
            const fcmTokens = userData?.['fcmTokens'];
            return Array.isArray(fcmTokens) ? fcmTokens : [];
          }));
        } else {
          const userDocs = await Promise.all(claimedRecipientUids.map(uid => usersCollection.doc(uid).get()));
          tokens = uniqueStringValues(userDocs.flatMap(userDoc => {
            const fcmTokens = userDoc.data()?.['fcmTokens'];
            return Array.isArray(fcmTokens) ? fcmTokens : [];
          }));
        }

        console.log(`[Notifications API] Found ${tokens.length} FCM tokens to push.`);

        for (const tokenGroup of chunks(tokens, 500)) {
          if (!tokenGroup || tokenGroup.length === 0) continue;
          const response = await getMessaging().sendEachForMulticast({
            data: {
              eventId,
              title,
              body: message,
              level: typeof input.level === 'string' ? input.level : 'info',
              actionUrl: typeof input.actionUrl === 'string' ? input.actionUrl : '',
              activityAction: typeof input.activityAction === 'string' ? input.activityAction : '',
              module: typeof input.module === 'string' ? input.module : '',
              requestId: typeof input.requestId === 'string' ? input.requestId : ''
            },
            webpush: {
              headers: { Urgency: 'high' },
              fcmOptions: { link: typeof input.actionUrl === 'string' && input.actionUrl ? input.actionUrl : '/' }
            },
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

        for (const group of chunks(claimedRecipientUids, 400)) {
          const batch = db.batch();
          group.forEach(uid => {
            const ref = notificationCollection.doc(notificationDocumentId(eventId, uid));
            batch.update(ref, {
              pushStatus: tokens.length > 0 ? 'sent' : 'no_token',
              pushSentAt: Date.now(),
              pushClaimId: FieldValue.delete(),
              pushClaimedAt: FieldValue.delete()
            });
          });
          await batch.commit();
        }
      } catch (pErr: any) {
        pushError = pErr?.message || String(pErr);
        console.error('[Notifications API] Push notification failed (inbox notification saved):', pushError);
        for (const group of chunks(claimedRecipientUids, 400)) {
          const batch = db.batch();
          group.forEach(uid => {
            const ref = notificationCollection.doc(notificationDocumentId(eventId, uid));
            batch.update(ref, {
              pushStatus: 'failed',
              pushError,
              pushClaimId: FieldValue.delete(),
              pushClaimedAt: FieldValue.delete()
            });
          });
          await batch.commit().catch(() => {});
        }
      }
    }

    console.log('[Notifications API] Dispatch result', {
      eventId,
      action: dispatchAction || 'legacy-publish',
      recipientCount: recipientUids.length,
      createdCount,
      pushSentCount: sentCount,
      pushFailureCount: failureCount
    });

    return res.status(200).json({
      success: true,
      eventId,
      ...(dispatchAction ? { activityAction: dispatchAction } : {}),
      recipientCount: recipientUids.length,
      createdCount,
      deduplicatedCount: recipientUids.length - createdCount,
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
