import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { after, before, beforeEach, test } from 'node:test';
import {
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from '@firebase/rules-unit-testing';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';

const PROJECT_ID = 'demo-lims-smart-batch-rules';
const APP_ID = 'lims-rules-test-app';
const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');

const users = {
  viewer: { uid: 'viewer', email: 'viewer@example.test', displayName: 'Viewer', role: 'viewer', roleId: 'role_viewer' },
  pending: { uid: 'pending', email: 'pending@example.test', displayName: 'Pending', role: 'pending', roleId: 'role_pending' },
  batchA: { uid: 'batch-a', email: 'batch-a@example.test', displayName: 'Batch A', role: 'staff', roleId: 'role_lab_technician' },
  batchB: { uid: 'batch-b', email: 'batch-b@example.test', displayName: 'Batch B', role: 'staff', roleId: 'role_lab_technician' },
  approver: { uid: 'approver', email: 'approver@example.test', displayName: 'Approver', role: 'staff', roleId: 'role_qc_lead' },
  manager: { uid: 'manager', email: 'manager@example.test', displayName: 'Manager', role: 'manager', roleId: 'role_manager' }
} as const;

type TestUser = (typeof users)[keyof typeof users];

let env: RulesTestEnvironment;

function dbFor(user: TestUser) {
  return env.authenticatedContext(user.uid, { email: user.email }).firestore();
}

async function seedBaseData(): Promise<void> {
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await Promise.all(Object.values(users).map(user => setDoc(
      doc(db, `artifacts/${APP_ID}/users/${user.uid}`),
      {
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        roleId: user.roleId,
        permissions: [],
        customPermissions: []
      }
    )));

    const seedTime = Timestamp.fromMillis(1_700_000_000_000);
    await Promise.all([
      setDoc(doc(db, `artifacts/${APP_ID}/print_jobs/owned-by-a`), {
        requestId: 'request-a',
        createdByUid: users.batchA.uid,
        createdBy: users.batchA.displayName,
        createdAt: seedTime,
        lastUpdated: seedTime
      }),
      setDoc(doc(db, `artifacts/${APP_ID}/print_jobs/owned-by-b`), {
        requestId: 'request-b',
        createdByUid: users.batchB.uid,
        createdBy: users.batchB.displayName,
        createdAt: seedTime,
        lastUpdated: seedTime
      }),
      setDoc(doc(db, `artifacts/${APP_ID}/requests/pending-request`), {
        sopId: 'sop-1',
        sopName: 'SOP 1',
        items: [],
        status: 'pending',
        user: users.batchA.displayName,
        timestamp: seedTime,
        lastUpdated: seedTime
      }),
      setDoc(doc(db, `artifacts/${APP_ID}/requests/pending-manager-request`), {
        sopId: 'sop-1',
        sopName: 'SOP 1',
        items: [],
        status: 'pending',
        user: users.batchA.displayName,
        timestamp: seedTime,
        lastUpdated: seedTime
      }),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/log-a`), {
        user: users.batchA.displayName,
        action: 'PRINT',
        details: 'Batch A print job',
        printable: true,
        timestamp: seedTime
      }),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/log-b`), {
        user: users.batchB.displayName,
        action: 'PRINT',
        details: 'Batch B print job',
        printable: true,
        timestamp: seedTime
      })
    ]);
  });
}

before(async () => {
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules }
  });
});

beforeEach(async () => {
  await env.clearFirestore();
  await seedBaseData();
});

after(async () => {
  await env.cleanup();
});

test('viewer and pending profiles cannot use SmartBatch operational collections', async () => {
  for (const user of [users.viewer, users.pending]) {
    const db = dbFor(user);
    await assertFails(getDocs(collection(db, `artifacts/${APP_ID}/print_jobs`)));
    await assertFails(getDocs(collection(db, `artifacts/${APP_ID}/requests`)));
    await assertFails(setDoc(doc(db, `artifacts/${APP_ID}/requests/new-${user.uid}`), {
      sopId: 'sop-1',
      sopName: 'SOP 1',
      items: [],
      status: 'pending',
      user: user.displayName,
      timestamp: serverTimestamp(),
      lastUpdated: serverTimestamp()
    }));
  }
});

test('batch_run can query only its personal log feed while manager can query the global feed', async () => {
  const batchDb = dbFor(users.batchA);
  const personalLogs = query(
    collection(batchDb, `artifacts/${APP_ID}/logs`),
    where('user', '==', users.batchA.displayName)
  );
  const personalSnapshot = await assertSucceeds(getDocs(personalLogs));
  assert.equal(personalSnapshot.size, 1);
  assert.equal(personalSnapshot.docs[0]?.data()['user'], users.batchA.displayName);

  await assertFails(getDocs(collection(batchDb, `artifacts/${APP_ID}/logs`)));

  const managerDb = dbFor(users.manager);
  const globalSnapshot = await assertSucceeds(getDocs(collection(managerDb, `artifacts/${APP_ID}/logs`)));
  assert.equal(globalSnapshot.size, 2);
});

test('batch_run, sop_approve and manager can read print jobs but viewer cannot', async () => {
  const printJobPath = `artifacts/${APP_ID}/print_jobs/owned-by-a`;
  for (const user of [users.batchA, users.approver, users.manager]) {
    await assertSucceeds(getDoc(doc(dbFor(user), printJobPath)));
  }
  await assertFails(getDoc(doc(dbFor(users.viewer), printJobPath)));
});

test('print job creation binds ownership to the authenticated creator', async () => {
  const batchDb = dbFor(users.batchA);
  await assertSucceeds(setDoc(doc(batchDb, `artifacts/${APP_ID}/print_jobs/new-owned`), {
    requestId: 'request-new',
    createdByUid: users.batchA.uid,
    createdBy: users.batchA.displayName,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  }));

  await assertFails(setDoc(doc(batchDb, `artifacts/${APP_ID}/print_jobs/spoofed-owner`), {
    requestId: 'request-new',
    createdByUid: users.batchB.uid,
    createdBy: users.batchB.displayName,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  }));
});

test('batch_run can delete only its own print jobs; approver and manager can delete others', async () => {
  await assertSucceeds(deleteDoc(doc(dbFor(users.batchA), `artifacts/${APP_ID}/print_jobs/owned-by-a`)));
  await assertFails(deleteDoc(doc(dbFor(users.batchA), `artifacts/${APP_ID}/print_jobs/owned-by-b`)));

  await assertSucceeds(deleteDoc(doc(dbFor(users.approver), `artifacts/${APP_ID}/print_jobs/owned-by-b`)));

  await env.withSecurityRulesDisabled(async context => {
    const seedTime = Timestamp.fromMillis(1_700_000_000_000);
    await setDoc(doc(context.firestore(), `artifacts/${APP_ID}/print_jobs/manager-delete`), {
      requestId: 'request-manager-delete',
      createdByUid: users.batchB.uid,
      createdBy: users.batchB.displayName,
      createdAt: seedTime,
      lastUpdated: seedTime
    });
  });
  await assertSucceeds(deleteDoc(doc(dbFor(users.manager), `artifacts/${APP_ID}/print_jobs/manager-delete`)));
});

test('batch_run cannot promote pending to approved, while sop_approve and manager can', async () => {
  const pendingPath = `artifacts/${APP_ID}/requests/pending-request`;
  await assertFails(updateDoc(doc(dbFor(users.batchA), pendingPath), {
    status: 'approved',
    resultStatusReason: 'approved by technician',
    approvedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  }));

  await assertSucceeds(updateDoc(doc(dbFor(users.approver), pendingPath), {
    status: 'approved',
    approvedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  }));

  await assertSucceeds(updateDoc(doc(dbFor(users.manager), `artifacts/${APP_ID}/requests/pending-manager-request`), {
    status: 'approved',
    approvedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  }));
});
