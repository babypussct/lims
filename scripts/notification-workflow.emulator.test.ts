import assert from 'node:assert/strict';
import test from 'node:test';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type DocumentData } from 'firebase-admin/firestore';
import handler from '../api/notifications.ts';

const APP_ID = 'lims-notification-workflow-fixture';
const PROJECT_ID = process.env['GCLOUD_PROJECT'] || 'demo-lims-notification';
const AUTH_HOST = process.env['FIREBASE_AUTH_EMULATOR_HOST'];

if (!AUTH_HOST) {
  throw new Error('FIREBASE_AUTH_EMULATOR_HOST is required for notification workflow fixture.');
}

if (!getApps().length) initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();

type AuthSession = { uid: string; idToken: string };
type ResponseShape = { statusCode: number; body: Record<string, unknown> | undefined };

const authRequest = async (path: string, body: Record<string, unknown>): Promise<AuthSession> => {
  const response = await fetch(`http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/${path}?key=demo-api-key`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const payload = await response.json() as Record<string, unknown>;
  assert.equal(response.ok, true, `Auth emulator request failed: ${JSON.stringify(payload)}`);
  return {
    uid: String(payload['localId']),
    idToken: String(payload['idToken'])
  };
};

const createSession = async (email: string): Promise<AuthSession> => authRequest('accounts:signUp', {
  email,
  password: 'fixture-password-123',
  returnSecureToken: true
});

const invoke = async (
  session: AuthSession,
  body: Record<string, unknown>
): Promise<ResponseShape> => {
  let statusCode = 200;
  let responseBody: Record<string, unknown> | undefined;
  const req = {
    method: 'POST',
    body,
    headers: { authorization: `Bearer ${session.idToken}` }
  } as any;
  const res = {
    setHeader: () => undefined,
    status: (status: number) => {
      statusCode = status;
      return res;
    },
    json: (bodyValue: Record<string, unknown>) => {
      responseBody = bodyValue;
      return res;
    },
    end: () => res
  } as any;
  await handler(req, res);
  return { statusCode, body: responseBody };
};

const writeProfile = async (
  session: AuthSession,
  profile: Record<string, unknown>
): Promise<void> => {
  await db.doc(`artifacts/${APP_ID}/users/${session.uid}`).set({
    uid: session.uid,
    email: profile['email'],
    displayName: profile['displayName'],
    role: 'staff',
    permissions: [],
    customPermissions: [],
    ...profile
  });
};

const writeEvent = async (
  eventId: string,
  event: Record<string, unknown>
): Promise<void> => {
  await db.doc(`artifacts/${APP_ID}/logs/${eventId}`).set({
    eventId,
    schemaVersion: 2,
    actorName: 'Fixture actor',
    activityVisible: true,
    details: `Fixture event ${eventId}`,
    ...event
  });
};

const notificationDocs = async (): Promise<DocumentData[]> => {
  const snapshot = await db.collection(`artifacts/${APP_ID}/notifications`).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const recipientsFor = (docs: DocumentData[], eventId: string): string[] => docs
  .filter(doc => doc['eventId'] === eventId)
  .map(doc => String(doc['recipientUid']))
  .sort();

test('notification workflow fan-out, recipient policy, suppression and idempotence run end-to-end', async () => {
  const manager = await createSession('manager@fixture.lims');
  const lab = await createSession('lab@fixture.lims');
  const qc = await createSession('qc@fixture.lims');
  const requester = await createSession('requester@fixture.lims');

  await Promise.all([
    writeProfile(manager, {
      email: 'manager@fixture.lims', displayName: 'Fixture manager', role: 'manager'
    }),
    writeProfile(lab, {
      email: 'lab@fixture.lims', displayName: 'Fixture lab', roleId: 'role_lab_technician'
    }),
    writeProfile(qc, {
      email: 'qc@fixture.lims', displayName: 'Fixture QC', roleId: 'role_qc_lead'
    }),
    writeProfile(requester, {
      email: 'requester@fixture.lims', displayName: 'Fixture requester', roleId: 'role_staff_default'
    })
  ]);

  await db.doc(`artifacts/${APP_ID}/roles_config/role_lab_technician`).set({
    permissions: ['inventory_view', 'inventory_edit', 'standard_view', 'standard_request', 'batch_run']
  });
  await db.doc(`artifacts/${APP_ID}/roles_config/role_qc_lead`).set({
    permissions: ['inventory_view', 'inventory_edit', 'standard_view', 'standard_edit', 'standard_approve', 'batch_run']
  });
  await db.doc(`artifacts/${APP_ID}/roles_config/role_staff_default`).set({
    permissions: ['standard_view', 'standard_request']
  });

  await db.doc(`artifacts/${APP_ID}/requests/result-1`).set({
    createdByUid: requester.uid,
    assignedToUid: lab.uid
  });

  const resultPublishId = 'fixture-result-publish';
  await writeEvent(resultPublishId, {
    action: 'PUBLISH_RESULT_REPORT', module: 'RESULT', audience: 'RESULT_VIEW',
    actorUid: lab.uid, requestId: 'result-1', targetType: 'REQUEST', targetId: 'result-1'
  });
  const publish = await invoke(lab, { action: 'dispatchEvent', appId: APP_ID, eventId: resultPublishId });
  assert.equal(publish.statusCode, 200);
  assert.equal(publish.body?.['activityAction'], 'PUBLISH_RESULT_REPORT');
  assert.deepEqual(recipientsFor(await notificationDocs(), resultPublishId), [requester.uid]);

  const publishRetry = await invoke(lab, { action: 'dispatchEvent', appId: APP_ID, eventId: resultPublishId });
  assert.equal(publishRetry.statusCode, 200);
  assert.equal(publishRetry.body?.['createdCount'], 0);
  assert.deepEqual(recipientsFor(await notificationDocs(), resultPublishId), [requester.uid]);

  const resultResetId = 'fixture-result-reset';
  await writeEvent(resultResetId, {
    action: 'RESET_RESULT_DATA', module: 'RESULT', audience: 'RESULT_OPERATOR',
    actorUid: lab.uid, requestId: 'result-1', targetType: 'REQUEST', targetId: 'result-1'
  });
  const reset = await invoke(lab, { action: 'dispatchEvent', appId: APP_ID, eventId: resultResetId });
  assert.equal(reset.statusCode, 200);
  assert.deepEqual(recipientsFor(await notificationDocs(), resultResetId), [requester.uid]);

  const standardRequestId = 'standard-request-1';
  await db.doc(`artifacts/${APP_ID}/standard_requests/${standardRequestId}`).set({
    requestedBy: lab.uid
  });
  const standardRequestEventId = 'fixture-standard-request';
  await writeEvent(standardRequestEventId, {
    action: 'REQUEST_STANDARD', module: 'STANDARD', audience: 'STANDARD_VIEW',
    actorUid: lab.uid, requestId: standardRequestId, targetType: 'STANDARD', targetId: 'std-1'
  });
  const standardRequest = await invoke(lab, {
    action: 'dispatchEvent', appId: APP_ID, eventId: standardRequestEventId
  });
  assert.equal(standardRequest.statusCode, 200);
  assert.deepEqual(recipientsFor(await notificationDocs(), standardRequestEventId), [manager.uid, qc.uid].sort());

  const standardApproveId = 'fixture-standard-approve';
  await writeEvent(standardApproveId, {
    action: 'APPROVE_STANDARD_REQUEST', module: 'STANDARD', audience: 'STANDARD_VIEW',
    actorUid: qc.uid, requestId: standardRequestId, targetType: 'STANDARD', targetId: 'std-1'
  });
  const approve = await invoke(qc, { action: 'dispatchEvent', appId: APP_ID, eventId: standardApproveId });
  assert.equal(approve.statusCode, 200);
  assert.deepEqual(recipientsFor(await notificationDocs(), standardApproveId), [lab.uid]);

  const standardRejectId = 'fixture-standard-reject';
  await writeEvent(standardRejectId, {
    action: 'REJECT_STANDARD_REQUEST', module: 'STANDARD', audience: 'STANDARD_VIEW',
    actorUid: qc.uid, requestId: standardRequestId, targetType: 'STANDARD', targetId: 'std-1'
  });
  const reject = await invoke(qc, { action: 'dispatchEvent', appId: APP_ID, eventId: standardRejectId });
  assert.equal(reject.statusCode, 200);
  assert.deepEqual(recipientsFor(await notificationDocs(), standardRejectId), [lab.uid]);

  const lowStockId = 'fixture-low-stock';
  await writeEvent(lowStockId, {
    action: 'INVENTORY_LOW_STOCK', module: 'INVENTORY', audience: 'INVENTORY_VIEW',
    actorUid: lab.uid, targetType: 'INVENTORY_ITEM', targetId: 'item-1'
  });
  const lowStock = await invoke(lab, { action: 'dispatchEvent', appId: APP_ID, eventId: lowStockId });
  assert.equal(lowStock.statusCode, 200);
  assert.deepEqual(recipientsFor(await notificationDocs(), lowStockId), [manager.uid, qc.uid].sort());

  const systemUpdateId = 'fixture-system-update';
  await writeEvent(systemUpdateId, {
    action: 'POST_SYSTEM_UPDATE', module: 'SYSTEM', audience: 'SYSTEM_ADMIN', actorUid: manager.uid,
    actionUrl: '/changelog'
  });
  const systemUpdate = await invoke(manager, { action: 'dispatchEvent', appId: APP_ID, eventId: systemUpdateId });
  assert.equal(systemUpdate.statusCode, 200);
  assert.deepEqual(
    recipientsFor(await notificationDocs(), systemUpdateId),
    [lab.uid, qc.uid, requester.uid].sort()
  );

  const docs = await notificationDocs();
  const publishDoc = docs.find(doc => doc['eventId'] === resultPublishId && doc['recipientUid'] === requester.uid);
  assert.equal(publishDoc?.['activityAction'], 'PUBLISH_RESULT_REPORT');
  assert.equal(publishDoc?.['actionUrl'], '/results/result-1');
  assert.equal(publishDoc?.['pushStatus'], 'no_token');
});
