import assert from 'node:assert/strict';
import test from 'node:test';
import { initializeApp as initializeAdmin, deleteApp as deleteAdmin } from 'firebase-admin/app';
import { getFirestore as adminFirestore, Timestamp } from 'firebase-admin/firestore';
import { readActivityFeedFromHttp } from '../src/app/core/activity/activity-feed-http';

// Real HTTP queries and Auth SDK, against demo emulators only. Never production.
test('Activity HTTP recovery reuses authentication, enforces audience Rules, ordering and limits', async () => {
  const { initializeApp, deleteApp } = await import('firebase/app');
  const { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signOut } = await import('firebase/auth');
  const { getFirestore, connectFirestoreEmulator, setLogLevel, terminate } = await import('firebase/firestore/lite');
  const projectId = process.env['GCLOUD_PROJECT'] || 'demo-lims-notification';
  const authHost = process.env['FIREBASE_AUTH_EMULATOR_HOST'];
  const firestoreHost = process.env['FIRESTORE_EMULATOR_HOST'];
  assert.ok(projectId.startsWith('demo-') && authHost && firestoreHost);
  const admin = initializeAdmin({ projectId }, 'activity-http-fixture-admin');
  const app = initializeApp({ projectId, apiKey: 'demo-api-key' }, 'activity-http-fixture');
  const auth = getAuth(app);
  connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });
  setLogLevel('silent');
  const [host, port] = firestoreHost!.split(':');
  const lite = getFirestore(app);
  connectFirestoreEmulator(lite, host, Number(port));
  const appId = 'activity-http-fixture';
  const db = adminFirestore(admin);
  const path = `artifacts/${appId}/logs`;
  try {
    const credential = await createUserWithEmailAndPassword(auth, 'activity-http@example.test', 'fixture-password-123');
    await db.doc(`artifacts/${appId}/users/${credential.user.uid}`).set({
      uid: credential.user.uid, role: 'staff', customPermissions: ['sop_view'],
    });
    const batch = db.batch();
    for (let i = 0; i < 4; i++) batch.set(db.doc(`${path}/result-${i}`), {
      audience: 'RESULT_VIEW', activityVisible: true, timestamp: Timestamp.fromMillis(1000 + i),
    });
    batch.set(db.doc(`${path}/hidden`), { audience: 'RESULT_VIEW', activityVisible: false, timestamp: Timestamp.now() });
    batch.set(db.doc(`${path}/system`), { audience: 'SYSTEM_ADMIN', activityVisible: true, timestamp: Timestamp.now() });
    await batch.commit();
    const data = await readActivityFeedFromHttp(app, path, 'RESULT_VIEW', 2);
    assert.deepEqual(data.docs.map(doc => doc.id), ['result-3', 'result-2']);
    await assert.rejects(readActivityFeedFromHttp(app, path, 'SYSTEM_ADMIN', 2), (error: any) => error.code === 'permission-denied');
    await signOut(auth);
    await assert.rejects(readActivityFeedFromHttp(app, path, 'RESULT_VIEW', 2), (error: any) => error.code === 'permission-denied');
  } finally {
    await terminate(lite); await deleteApp(app); await deleteAdmin(admin);
  }
});
