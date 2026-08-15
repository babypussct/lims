import '@angular/compiler';
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
  deleteField,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  where
} from 'firebase/firestore';
import { StatsService } from './stats.service';

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
      }),
      setDoc(doc(db, `artifacts/${APP_ID}/reference_standards/std-requester`), {
        id: 'std-requester',
        name: 'Requester Standard',
        internal_id: 'AA01',
        lot_number: 'LOT-SECURE-1',
        initial_amount: 100,
        current_amount: 100,
        unit: 'mg',
        status: 'IN_USE',
        current_holder: users.batchA.displayName,
        current_holder_uid: users.batchA.uid,
        current_request_id: 'requester-lifecycle',
        has_pending_request: false,
        restock_requested: false,
        lastUpdated: seedTime
      }),
      setDoc(doc(db, `artifacts/${APP_ID}/reference_standards/std-create`), {
        id: 'std-create',
        name: 'Create Standard',
        internal_id: 'AA02',
        lot_number: 'LOT-CREATE-1',
        initial_amount: 50,
        current_amount: 50,
        unit: 'mg',
        status: 'AVAILABLE',
        has_pending_request: false,
        lastUpdated: seedTime
      }),
      setDoc(doc(db, `artifacts/${APP_ID}/standard_requests/requester-lifecycle`), {
        id: 'requester-lifecycle',
        requestedBy: users.batchA.uid,
        requestedByName: users.batchA.displayName,
        standardId: 'std-requester',
        standardName: 'Requester Standard',
        lotNumber: 'LOT-SECURE-1',
        requestDate: 1_700_000_000_000,
        purpose: 'Secure usage test',
        status: 'IN_PROGRESS',
        totalAmountUsed: 0,
        sopTags: [],
        usageLogs: [],
        createdAt: 1_700_000_000_000,
        updatedAt: 1_700_000_000_000,
        _isDeleted: false,
        lastUpdated: seedTime
      }),
      setDoc(doc(db, 'releases/v26.08.11-b03'), {
        version: 'v26.08.11-b03',
        date: '11/08/2026',
        title: 'Release test',
        releaseOrder: 26081100003
      })
    ]);
  });
}

function requesterCreatePayload(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id,
    standardId: 'std-create',
    standardName: 'Create Standard',
    lotNumber: 'LOT-CREATE-1',
    requestedBy: users.batchA.uid,
    requestedByName: users.batchA.displayName,
    requestDate: 1_786_182_400_000,
    purpose: 'Requester create test',
    status: 'PENDING_APPROVAL',
    totalAmountUsed: 0,
    usageLogs: [],
    createdAt: 1_786_182_400_000,
    updatedAt: 1_786_182_400_000,
    _isDeleted: false,
    lastUpdated: serverTimestamp(),
    ...overrides
  };
}

function secureUsageJournal(logId: string, amount = 10, overrides: Record<string, unknown> = {}) {
  return {
    id: logId,
    date: '2026-08-08T10:00:00.000Z',
    timestamp: 1_786_182_400_000,
    user: users.batchA.displayName,
    userId: users.batchA.uid,
    amount_used: amount,
    unit: 'mg',
    normalized_amount: amount,
    normalized_unit: 'mg',
    purpose: 'Secure usage event',
    standardId: 'std-requester',
    standardName: 'Requester Standard',
    lotNumber: 'LOT-SECURE-1',
    requestId: 'requester-lifecycle',
    lastUpdated: serverTimestamp(),
    ...overrides
  };
}

function buildSecureUsageBatch(logId: string, amount = 10) {
  const batchDb = dbFor(users.batchA);
  const batch = writeBatch(batchDb);
  const journal = secureUsageJournal(logId, amount);
  batch.update(doc(batchDb, `artifacts/${APP_ID}/reference_standards/std-requester`), {
    current_amount: 100 - amount,
    status: amount === 100 ? 'DEPLETED' : 'IN_USE',
    lastUpdated: serverTimestamp()
  });
  batch.update(doc(batchDb, `artifacts/${APP_ID}/standard_requests/requester-lifecycle`), {
    totalAmountUsed: amount,
    lastUsageLogId: logId,
    updatedAt: 1_786_182_400_001,
    lastUpdated: serverTimestamp()
  });
  batch.set(
    doc(batchDb, `artifacts/${APP_ID}/reference_standards/std-requester/logs/${logId}`),
    journal
  );
  batch.set(doc(batchDb, `artifacts/${APP_ID}/standard_usages/${logId}`), journal);
  return batch;
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

test('release history is readable before authentication for the public changelog route', async () => {
  const publicDb = env.unauthenticatedContext().firestore();
  const snapshot = await assertSucceeds(getDocs(collection(publicDb, 'releases')));
  assert.equal(snapshot.size, 1);
  assert.equal(snapshot.docs[0].data()['version'], 'v26.08.11-b03');
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

test('stats writes require batch_run, sop_approve or manager privileges', async () => {
  const statsPaths = [
    `artifacts/${APP_ID}/stats/master`,
    `artifacts/${APP_ID}/monthly_stats/2026-08`
  ];

  for (const statsPath of statsPaths) {
    await assertFails(setDoc(doc(dbFor(users.viewer), statsPath), {
      '2026-08-08': { totalSamples: 1, totalBatches: 1, totalQcs: 0, sops: {} }
    }));

    for (const user of [users.batchA, users.approver, users.manager]) {
      await assertSucceeds(setDoc(doc(dbFor(user), statsPath), {
        '2026-08-08': { totalSamples: 1, totalBatches: 1, totalQcs: 0, sops: {} }
      }));
    }
  }
});

test('monthly stats atomic increments tolerate concurrent writers on the same month document', async () => {
  const db = dbFor(users.batchA);
  const statsRef = doc(db, `artifacts/${APP_ID}/monthly_stats/2026-08`);
  const statsService = Object.create(StatsService.prototype) as StatsService;
  (statsService as any).fb = { db, APP_ID };
  const writerCount = 24;
  const sopKey = 'SOP.01 GC-MS/MS';
  const statsDate = new Date(2026, 7, 13, 12, 0, 0);

  await Promise.all(Array.from(
    { length: writerCount },
    () => statsService.incrementStats(statsDate, 'sop-01', sopKey, 1, 1, 2)
  ));

  const snapshot = await assertSucceeds(getDoc(statsRef));
  const day = snapshot.data()?.['2026-08-13'];
  assert.equal(day?.totalSamples, writerCount);
  assert.equal(day?.totalBatches, writerCount);
  assert.equal(day?.totalQcs, writerCount * 2);
  assert.equal(day?.sops?.[sopKey]?.samples, writerCount);
  assert.equal(day?.sops?.[sopKey]?.batches, writerCount);
  assert.equal(day?.sops?.[sopKey]?.qcs, writerCount * 2);
});

test('monthly stats increment surfaces Firestore write failures to the caller', async () => {
  const db = dbFor(users.viewer);
  const statsService = Object.create(StatsService.prototype) as StatsService;
  (statsService as any).fb = { db, APP_ID };

  await assert.rejects(
    statsService.incrementStats(new Date(2026, 7, 13, 12, 0, 0), 'sop-01', 'SOP 01', 1)
  );
});

test('requester usage succeeds only as one correlated atomic accounting transaction', async () => {
  const batchDb = dbFor(users.batchA);
  const standardRef = doc(batchDb, `artifacts/${APP_ID}/reference_standards/std-requester`);
  const requestRef = doc(batchDb, `artifacts/${APP_ID}/standard_requests/requester-lifecycle`);
  const subLogRef = doc(batchDb, `artifacts/${APP_ID}/reference_standards/std-requester/logs/usage-good`);
  const globalLogRef = doc(batchDb, `artifacts/${APP_ID}/standard_usages/usage-good`);
  const journal = secureUsageJournal('usage-good', 10);
  const batch = writeBatch(batchDb);

  batch.update(standardRef, {
    current_amount: 90,
    status: 'IN_USE',
    lastUpdated: serverTimestamp()
  });
  batch.update(requestRef, {
    totalAmountUsed: 10,
    lastUsageLogId: 'usage-good',
    updatedAt: 1_786_182_400_001,
    lastUpdated: serverTimestamp()
  });
  batch.set(subLogRef, journal);
  batch.set(globalLogRef, journal);

  await assertSucceeds(batch.commit());

  const [standardSnap, requestSnap, subLogSnap, globalLogSnap] = await Promise.all([
    getDoc(standardRef),
    getDoc(requestRef),
    getDoc(subLogRef),
    getDoc(doc(dbFor(users.manager), `artifacts/${APP_ID}/standard_usages/usage-good`))
  ]);
  assert.equal(standardSnap.data()?.['current_amount'], 90);
  assert.equal(requestSnap.data()?.['totalAmountUsed'], 10);
  assert.equal(requestSnap.data()?.['lastUsageLogId'], 'usage-good');
  assert.equal(subLogSnap.data()?.['normalized_amount'], 10);
  assert.equal(globalLogSnap.data()?.['requestId'], 'requester-lifecycle');
});

test('requester cannot mutate stock or accounting aggregate without the complete journal protocol', async () => {
  const batchDb = dbFor(users.batchA);
  const standardRef = doc(batchDb, `artifacts/${APP_ID}/reference_standards/std-requester`);
  const requestRef = doc(batchDb, `artifacts/${APP_ID}/standard_requests/requester-lifecycle`);

  await assertFails(updateDoc(standardRef, {
    current_amount: 90,
    status: 'IN_USE',
    lastUpdated: serverTimestamp()
  }));
  await assertFails(updateDoc(requestRef, {
    totalAmountUsed: 10,
    lastUsageLogId: 'aggregate-only',
    updatedAt: 1_786_182_400_002,
    lastUpdated: serverTimestamp()
  }));

  const missingJournals = writeBatch(batchDb);
  missingJournals.update(standardRef, {
    current_amount: 90,
    status: 'IN_USE',
    lastUpdated: serverTimestamp()
  });
  missingJournals.update(requestRef, {
    totalAmountUsed: 10,
    lastUsageLogId: 'missing-journals',
    updatedAt: 1_786_182_400_003,
    lastUpdated: serverTimestamp()
  });
  await assertFails(missingJournals.commit());
});

test('requester journal creation is denied without matching stock and request writes', async () => {
  const batchDb = dbFor(users.batchA);
  await assertFails(setDoc(
    doc(batchDb, `artifacts/${APP_ID}/reference_standards/std-requester/logs/journal-only`),
    secureUsageJournal('journal-only', 10)
  ));
  await assertFails(setDoc(
    doc(batchDb, `artifacts/${APP_ID}/standard_usages/journal-only`),
    secureUsageJournal('journal-only', 10)
  ));
});

test('requester secure usage rejects mismatched journal amount, identity and ownership', async () => {
  const batchDb = dbFor(users.batchA);
  const cases = [
    { logId: 'bad-amount', journal: secureUsageJournal('bad-amount', 9) },
    { logId: 'bad-user', journal: secureUsageJournal('bad-user', 10, { userId: users.batchB.uid }) },
    { logId: 'bad-request', journal: secureUsageJournal('bad-request', 10, { requestId: 'other-request' }) }
  ];

  for (const item of cases) {
    const batch = writeBatch(batchDb);
    batch.update(doc(batchDb, `artifacts/${APP_ID}/reference_standards/std-requester`), {
      current_amount: 90,
      status: 'IN_USE',
      lastUpdated: serverTimestamp()
    });
    batch.update(doc(batchDb, `artifacts/${APP_ID}/standard_requests/requester-lifecycle`), {
      totalAmountUsed: 10,
      lastUsageLogId: item.logId,
      updatedAt: 1_786_182_400_004,
      lastUpdated: serverTimestamp()
    });
    batch.set(doc(batchDb, `artifacts/${APP_ID}/reference_standards/std-requester/logs/${item.logId}`), item.journal);
    batch.set(doc(batchDb, `artifacts/${APP_ID}/standard_usages/${item.logId}`), item.journal);
    await assertFails(batch.commit());
  }
});

test('requester secure usage rejects another user request, wrong holder and wrong current request', async () => {
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await updateDoc(doc(db, `artifacts/${APP_ID}/standard_requests/requester-lifecycle`), {
      requestedBy: users.batchB.uid,
      requestedByName: users.batchB.displayName
    });
  });
  await assertFails(buildSecureUsageBatch('wrong-request-owner').commit());

  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await updateDoc(doc(db, `artifacts/${APP_ID}/standard_requests/requester-lifecycle`), {
      requestedBy: users.batchA.uid,
      requestedByName: users.batchA.displayName
    });
    await updateDoc(doc(db, `artifacts/${APP_ID}/reference_standards/std-requester`), {
      current_holder_uid: users.batchB.uid,
      current_holder: users.batchB.displayName
    });
  });
  await assertFails(buildSecureUsageBatch('wrong-holder').commit());

  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await updateDoc(doc(db, `artifacts/${APP_ID}/reference_standards/std-requester`), {
      current_holder_uid: users.batchA.uid,
      current_holder: users.batchA.displayName,
      current_request_id: 'other-request'
    });
    await setDoc(doc(db, `artifacts/${APP_ID}/standard_requests/other-request`), {
      id: 'other-request',
      requestedBy: users.batchA.uid,
      requestedByName: users.batchA.displayName,
      standardId: 'std-requester',
      standardName: 'Requester Standard',
      requestDate: 1_700_000_000_000,
      purpose: 'Other secure request',
      status: 'IN_PROGRESS',
      totalAmountUsed: 0,
      usageLogs: [],
      createdAt: 1_700_000_000_000,
      updatedAt: 1_700_000_000_000,
      _isDeleted: false,
      lastUpdated: Timestamp.fromMillis(1_700_000_000_000)
    });
  });
  await assertFails(buildSecureUsageBatch('wrong-current-request').commit());
});

test('requester secure usage requires an IN_PROGRESS request', async () => {
  await env.withSecurityRulesDisabled(async context => {
    await updateDoc(
      doc(context.firestore(), `artifacts/${APP_ID}/standard_requests/requester-lifecycle`),
      { status: 'PENDING_RETURN' }
    );
  });
  await assertFails(buildSecureUsageBatch('wrong-request-status').commit());
});

test('requester cannot edit or delete historical usage journals', async () => {
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    const seedTime = Timestamp.fromMillis(1_700_000_000_000);
    const journal = {
      ...secureUsageJournal('historic-log', 10),
      lastUpdated: seedTime
    };
    await Promise.all([
      setDoc(doc(db, `artifacts/${APP_ID}/reference_standards/std-requester/logs/historic-log`), journal),
      setDoc(doc(db, `artifacts/${APP_ID}/standard_usages/historic-log`), journal)
    ]);
  });

  const batchDb = dbFor(users.batchA);
  for (const path of [
    `artifacts/${APP_ID}/reference_standards/std-requester/logs/historic-log`,
    `artifacts/${APP_ID}/standard_usages/historic-log`
  ]) {
    const ref = doc(batchDb, path);
    await assertFails(updateDoc(ref, { purpose: 'tampered', lastUpdated: serverTimestamp() }));
    await assertFails(deleteDoc(ref));
  }
});

test('requester create enforces the trusted request schema and canonical identities', async () => {
  const batchDb = dbFor(users.batchA);
  const goodId = 'requester-create-good';
  await assertSucceeds(setDoc(
    doc(batchDb, `artifacts/${APP_ID}/standard_requests/${goodId}`),
    requesterCreatePayload(goodId)
  ));

  const invalidCases: [string, Record<string, unknown>][] = [
    ['spoof-user', { requestedBy: users.batchB.uid }],
    ['spoof-user-name', { requestedByName: users.batchB.displayName }],
    ['spoof-standard-name', { standardName: 'Forged Standard' }],
    ['spoof-lot', { lotNumber: 'FORGED-LOT' }],
    ['empty-purpose', { purpose: '' }],
    ['admin-final-tags', { finalSopTags: [] }],
    ['admin-confirmed', { confirmedAmountUsed: 0 }],
    ['admin-received', { receivedBy: users.batchA.uid, receivedByName: users.batchA.displayName }],
    ['deleted-on-create', { _isDeleted: true }],
    ['unknown-field', { attackerControlled: true }],
    ['nonzero-total', { totalAmountUsed: 1 }],
    ['seeded-usage-logs', { usageLogs: [{ id: 'fake' }] }]
  ];

  for (const [suffix, overrides] of invalidCases) {
    const id = `requester-create-${suffix}`;
    await assertFails(setDoc(
      doc(batchDb, `artifacts/${APP_ID}/standard_requests/${id}`),
      requesterCreatePayload(id, overrides)
    ));
  }

  for (const field of ['standardName', 'requestedByName', 'purpose'] as const) {
    const id = `requester-create-missing-${field}`;
    const payload = requesterCreatePayload(id) as Record<string, unknown>;
    delete payload[field];
    await assertFails(setDoc(
      doc(batchDb, `artifacts/${APP_ID}/standard_requests/${id}`),
      payload
    ));
  }
});

test('requester lifecycle can report and resume but cannot rewrite accounting or admin fields', async () => {
  const batchDb = dbFor(users.batchA);
  const lifecycleRef = doc(batchDb, `artifacts/${APP_ID}/standard_requests/requester-lifecycle`);

  await assertFails(updateDoc(lifecycleRef, {
    status: 'PENDING_RETURN',
    reportedAmountUsed: 10,
    reportedUnit: 'mg',
    reportedDepleted: false,
    sopTags: [],
    usageLogs: [{ id: 'fake', amount_used: 10 }],
    updatedAt: 1_786_182_400_009,
    lastUpdated: serverTimestamp()
  }));

  await assertSucceeds(updateDoc(lifecycleRef, {
    status: 'PENDING_RETURN',
    reportedAmountUsed: 10,
    reportedUnit: 'mg',
    reportedDepleted: false,
    sopTags: [],
    updatedAt: 1_786_182_400_010,
    lastUpdated: serverTimestamp()
  }));

  await assertFails(updateDoc(lifecycleRef, {
    totalAmountUsed: 10,
    lastUpdated: serverTimestamp()
  }));
  await assertFails(updateDoc(lifecycleRef, {
    usageLogs: [{ id: 'fake', amount_used: 10 }],
    lastUpdated: serverTimestamp()
  }));
  await assertFails(updateDoc(lifecycleRef, {
    finalSopTags: [],
    lastUpdated: serverTimestamp()
  }));

  await assertSucceeds(updateDoc(lifecycleRef, {
    status: 'IN_PROGRESS',
    reportedAmountUsed: deleteField(),
    reportedUnit: deleteField(),
    reportedDepleted: deleteField(),
    updatedAt: 1_786_182_400_011,
    lastUpdated: serverTimestamp()
  }));
});

test('approver may write admin-only return fields that requester cannot', async () => {
  const approverRef = doc(dbFor(users.approver), `artifacts/${APP_ID}/standard_requests/requester-lifecycle`);
  await assertSucceeds(updateDoc(approverRef, {
    finalSopTags: [],
    confirmedAmountUsed: 0,
    confirmedUnit: 'mg',
    receivedBy: users.approver.uid,
    receivedByName: users.approver.displayName,
    lastUpdated: serverTimestamp()
  }));
});

test('internal-id ownership cannot be rewritten without the lifecycle transaction', async () => {
  const managerDb = dbFor(users.manager);
  const oldStandardPath = `artifacts/${APP_ID}/reference_standards/registry-old`;
  const newStandardPath = `artifacts/${APP_ID}/reference_standards/registry-new`;
  const registryPath = `artifacts/${APP_ID}/standard_code_registry/AC01`;

  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, oldStandardPath), {
      id: 'registry-old', name: 'Registry old', internal_id: 'AC01',
      initial_amount: 10, current_amount: 10, unit: 'mg', status: 'AVAILABLE',
      lifecycle_status: 'ACTIVE', lastUpdated: Timestamp.now()
    });
    await setDoc(doc(db, newStandardPath), {
      id: 'registry-new', name: 'Registry new', internal_id: 'AC01',
      initial_amount: 10, current_amount: 10, unit: 'mg', status: 'AVAILABLE',
      lifecycle_status: 'ACTIVE', lastUpdated: Timestamp.now()
    });
    await setDoc(doc(db, registryPath), {
      id: 'AC01', internal_id: 'AC01', status: 'ASSIGNED',
      currentStandardId: 'registry-old', assignmentCount: 1,
      lastUpdated: Timestamp.now()
    });
  });

  await assertFails(updateDoc(doc(managerDb, oldStandardPath), {
    internal_id: 'AB01',
    lastUpdated: serverTimestamp()
  }));
  await assertFails(updateDoc(doc(managerDb, registryPath), {
    currentStandardId: 'registry-new',
    lastUpdated: serverTimestamp()
  }));

  const batch = writeBatch(managerDb);
  batch.update(doc(managerDb, oldStandardPath), {
    lifecycle_status: 'RELEASED',
    internal_id_released_at: serverTimestamp(),
    internal_id_release_reason: 'expired',
    lastUpdated: serverTimestamp()
  });
  batch.set(doc(managerDb, registryPath), {
    id: 'AC01', internal_id: 'AC01', status: 'ASSIGNED',
    currentStandardId: 'registry-new', assignmentCount: 2,
    lastReleasedAt: serverTimestamp(), lastReleasedStandardId: 'registry-old',
    lastUpdated: serverTimestamp()
  }, { merge: true });
  await assertSucceeds(batch.commit());
});

test('legacy registry aliases can migrate only to a canonical target without deleting history', async () => {
  const managerDb = dbFor(users.manager);
  const legacyAcPath = `artifacts/${APP_ID}/standard_code_registry/ac01`;
  const legacyAbPath = `artifacts/${APP_ID}/standard_code_registry/ab01`;
  const legacyAdPath = `artifacts/${APP_ID}/standard_code_registry/ad01`;
  const canonicalAcPath = `artifacts/${APP_ID}/standard_code_registry/AC01`;
  const canonicalAdPath = `artifacts/${APP_ID}/standard_code_registry/AD01`;

  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    const seedTime = Timestamp.fromMillis(1_700_000_000_000);
    const legacyRow = (internalId: string) => ({
      id: internalId,
      internal_id: internalId,
      status: 'AVAILABLE',
      assignmentCount: 0,
      lastUpdated: seedTime
    });
    await Promise.all([
      setDoc(doc(db, legacyAcPath), legacyRow('ac01')),
      setDoc(doc(db, legacyAbPath), legacyRow('ab01')),
      setDoc(doc(db, legacyAdPath), legacyRow('ad01')),
      setDoc(doc(db, canonicalAdPath), {
        id: 'AD01',
        internal_id: 'AD01',
        status: 'AVAILABLE',
        assignmentCount: 0,
        lastUpdated: seedTime
      })
    ]);
  });

  const migrationBatch = writeBatch(managerDb);
  migrationBatch.set(doc(managerDb, canonicalAcPath), {
    id: 'AC01',
    internal_id: 'AC01',
    status: 'AVAILABLE',
    assignmentCount: 0,
    lastUpdated: serverTimestamp()
  });
  migrationBatch.update(doc(managerDb, legacyAcPath), {
    migrationStatus: 'MIGRATED',
    migratedTo: 'AC01',
    migratedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
  await assertSucceeds(migrationBatch.commit());

  const migratedAlias = await assertSucceeds(getDoc(doc(managerDb, legacyAcPath)));
  assert.equal(migratedAlias.exists(), true);
  assert.equal(migratedAlias.data()?.['migrationStatus'], 'MIGRATED');
  assert.equal(migratedAlias.data()?.['migratedTo'], 'AC01');

  await assertFails(updateDoc(doc(managerDb, legacyAbPath), {
    migrationStatus: 'MIGRATED',
    migratedTo: 'AB01',
    migratedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  }));

  await assertFails(updateDoc(doc(managerDb, legacyAdPath), {
    migrationStatus: 'MIGRATED',
    migratedTo: 'AD01',
    migratedAt: serverTimestamp(),
    status: 'CONFLICT',
    lastUpdated: serverTimestamp()
  }));

  await assertFails(updateDoc(doc(managerDb, canonicalAdPath), {
    migrationStatus: 'MIGRATED',
    migratedTo: 'AC01',
    migratedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  }));

  await assertFails(deleteDoc(doc(managerDb, legacyAdPath)));
});

test('the SDHET business code is accepted while unrelated malformed codes remain denied', async () => {
  const managerDb = dbFor(users.manager);
  await assertSucceeds(setDoc(doc(managerDb, `artifacts/${APP_ID}/reference_standards/std-sdhet`), {
    id: 'std-sdhet',
    name: 'SDHET business standard',
    internal_id: 'SDHET',
    initial_amount: 10,
    current_amount: 10,
    unit: 'mg',
    status: 'AVAILABLE',
    lastUpdated: serverTimestamp(),
  }));
  await assertFails(setDoc(doc(managerDb, `artifacts/${APP_ID}/reference_standards/std-malformed-special`), {
    id: 'std-malformed-special',
    name: 'Malformed special code',
    internal_id: 'SDHET1',
    initial_amount: 10,
    current_amount: 10,
    unit: 'mg',
    status: 'AVAILABLE',
    lastUpdated: serverTimestamp(),
  }));
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
