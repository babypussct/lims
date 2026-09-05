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
import { persistDutyMonthImport } from '../../features/duty-stats/duty-tsv-import.persistence';
import { DUTY_TSV_HEADER, parseDutyTsv } from '../../features/duty-stats/duty-tsv-import';
import type { DutyScheduleEntry } from '../../features/duty-stats/duty-schedule.model';

const PROJECT_ID = 'demo-lims-smart-batch-rules';
const APP_ID = 'lims-rules-test-app';
test('monthly TSV import commits 31 dates, keeps existing, replaces selected and rejects stale or unauthorized writes atomically', async () => {
  const people = Array.from({ length: 21 }, (_, i) => ({ id: `tsv-person-${i}`, displayName: `Người ${i}`, active: true }));
  await env.withSecurityRulesDisabled(async context => {
    const seedDb = context.firestore();
    await Promise.all(people.map(person => setDoc(doc(seedDb, `artifacts/${APP_ID}/duty_staff/${person.id}`), person)));
  });
  const month = '2027-01';
  const tsv = [DUTY_TSV_HEADER, ...Array.from({ length: 31 }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}\tNgười ${i % 21}\t18:00\t`)].join('\n');
  const plan = parseDutyTsv(tsv, month, people).rows.map(row => ({ ...row, previous: null as DutyScheduleEntry | null, replace: false }));
  const db = dbFor(users.customDutyManage);
  const save = (text = tsv, rows = plan, uid: string = users.customDutyManage.uid, database = db, verificationText = text) => persistDutyMonthImport(database as never, APP_ID, uid, people, text, month, rows, verificationText);
  const mismatchedVerification = tsv.replace('Người 0\t18:00', 'Người 1\t18:00');
  await assert.rejects(() => save(tsv, plan, users.customDutyManage.uid, db, mismatchedVerification), /xác minh lần 2.*khớp/i);
  assert.deepEqual(await save(), { created: 31, replaced: 0, kept: 0 });
  const current = await Promise.all(plan.map(async row => {
    const snapshot = await getDoc(doc(db, `artifacts/${APP_ID}/duty_schedules/${row.date}`));
    return { ...row, previous: { id: snapshot.id, ...snapshot.data() } as DutyScheduleEntry };
  }));
  assert.equal(current[0].previous.updatedByUid, users.customDutyManage.uid);
  await assert.rejects(() => save(tsv, current), /Không có ngày/);
  const editedTsv = tsv.replace('Người 0\t18:00', 'Người 1\t19:00');
  const editedRows = parseDutyTsv(editedTsv, month, people).rows.map((row, i) => ({ ...row, previous: current[i].previous, replace: i === 0 }));
  assert.deepEqual(await save(editedTsv, editedRows), { created: 0, replaced: 1, kept: 30 });
  const changed = await getDoc(doc(db, `artifacts/${APP_ID}/duty_schedules/2027-01-01`));
  assert.equal(changed.data()?.startTime, '19:00');
  assert.deepEqual(changed.data()?.createdAt, current[0].previous.createdAt);
  // The second selected day must remain untouched when the first review is stale.
  const beforeSecond = current[1].previous;
  await assert.rejects(() => save(tsv, current.map((row, i) => ({ ...row, replace: i < 2 }))), /vừa thay đổi/);
  assert.deepEqual((await getDoc(doc(db, `artifacts/${APP_ID}/duty_schedules/2027-01-02`))).data()?.updatedAt, beforeSecond.updatedAt);
  const denied = dbFor(users.staffDefault);
  await assert.rejects(() => save(tsv, current.map((row, i) => ({ ...row, replace: i === 1 })), users.staffDefault.uid, denied), /permission|PERMISSION/i);
  await env.withSecurityRulesDisabled(async context => {
    await updateDoc(doc(context.firestore(), `artifacts/${APP_ID}/duty_staff/tsv-person-1`), { active: false });
  });
  await assert.rejects(() => save(tsv, current.map((row, i) => ({ ...row, replace: i === 1 }))), /nhân sự vừa thay đổi/);
});

test('monthly TSV import stores unresolved duty positions for later verification without creating fake staff', async () => {
  const person = { id: 'tsv-known-person', displayName: 'Phương', active: true };
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), `artifacts/${APP_ID}/duty_staff/${person.id}`), person);
  });

  const month = '2026-09';
  const tsv = `${DUTY_TSV_HEADER}\n2026-09-16\tPhương | ?\t18:00\tCHƯA RÕ`;
  const parsed = parseDutyTsv(tsv, month, [person]);
  assert.deepEqual(parsed.errors, []);
  assert.deepEqual(parsed.rows[0].errors, []);
  assert.deepEqual(parsed.rows[0].staffIds, [person.id]);
  assert.deepEqual(parsed.rows[0].unresolvedAssignees, ['?']);

  const reviewed = parsed.rows.map(row => ({ ...row, previous: null as DutyScheduleEntry | null, replace: false }));
  const db = dbFor(users.customDutyManage);
  assert.deepEqual(
    await persistDutyMonthImport(db as never, APP_ID, users.customDutyManage.uid, [person], tsv, month, reviewed, tsv),
    { created: 1, replaced: 0, kept: 0 },
  );

  const stored = (await getDoc(doc(db, `artifacts/${APP_ID}/duty_schedules/2026-09-16`))).data();
  assert.deepEqual(stored?.staffIds, [person.id]);
  assert.deepEqual(stored?.unresolvedAssignees, ['?']);
  assert.equal(stored?.needsVerification, true);
  assert.equal(stored?.sourceAssignees, 'Phương | ?');
  assert.equal(stored?.note, 'CHƯA RÕ');

  await assertFails(setDoc(doc(db, `artifacts/${APP_ID}/duty_schedules/2026-09-17`), {
    date: '2026-09-17',
    staffIds: [person.id],
    unresolvedAssignees: '?',
    needsVerification: true,
    sourceAssignees: 'Phương | ?',
    startTime: '18:00',
    status: 'planned',
    note: 'CHƯA RÕ',
    source: 'import',
    createdAt: serverTimestamp(),
    createdByUid: users.customDutyManage.uid,
    updatedAt: serverTimestamp(),
    updatedByUid: users.customDutyManage.uid,
  }));
});
const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');

const users = {
  viewer: { uid: 'viewer', email: 'viewer@example.test', displayName: 'Viewer', role: 'viewer', roleId: 'role_viewer', permissions: [], customPermissions: [] },
  pending: { uid: 'pending', email: 'pending@example.test', displayName: 'Pending', role: 'pending', roleId: 'role_pending', permissions: [], customPermissions: [] },
  batchA: { uid: 'batch-a', email: 'batch-a@example.test', displayName: 'Batch A', role: 'staff', roleId: 'role_lab_technician', permissions: [], customPermissions: [] },
  batchB: { uid: 'batch-b', email: 'batch-b@example.test', displayName: 'Batch B', role: 'staff', roleId: 'role_lab_technician', permissions: [], customPermissions: [] },
  approver: { uid: 'approver', email: 'approver@example.test', displayName: 'Approver', role: 'staff', roleId: 'role_qc_lead', permissions: [], customPermissions: [] },
  staffDefault: { uid: 'staff-default', email: 'staff-default@example.test', displayName: 'Staff Default', role: 'staff', roleId: 'role_staff_default', permissions: [], customPermissions: [] },
  customReportOnly: { uid: 'report-only', email: 'report-only@example.test', displayName: 'Report Only', role: 'staff', roleId: 'role_custom_report_only', permissions: [], customPermissions: ['report_view'] },
  customUserManage: { uid: 'user-manage', email: 'user-manage@example.test', displayName: 'User Manage', role: 'staff', roleId: 'role_custom_user_manage', permissions: [], customPermissions: ['user_manage'] },
  customSystemManage: { uid: 'system-manage', email: 'system-manage@example.test', displayName: 'System Manage', role: 'staff', roleId: 'role_custom_system_manage', permissions: [], customPermissions: ['system_manage'] },
  customMasterDataManage: { uid: 'master-data-manage', email: 'master-data-manage@example.test', displayName: 'Master Data Manage', role: 'staff', roleId: 'role_custom_master_data_manage', permissions: [], customPermissions: ['master_data_manage'] },
  customPolicyManage: { uid: 'policy-manage', email: 'policy-manage@example.test', displayName: 'Policy Manage', role: 'staff', roleId: 'role_custom_policy_manage', permissions: [], customPermissions: ['policy_manage'] },
  customDutyManage: { uid: 'duty-manage', email: 'duty-manage@example.test', displayName: 'Duty Manager', role: 'staff', roleId: 'role_custom_duty_manage', permissions: [], customPermissions: ['duty_manage'] },
  inventoryViewer: { uid: 'inventory-viewer', email: 'inventory-viewer@example.test', displayName: 'Inventory Viewer', role: 'staff', roleId: 'role_custom_inventory_viewer', permissions: [], customPermissions: ['inventory_view'] },
  standardViewer: { uid: 'standard-viewer', email: 'standard-viewer@example.test', displayName: 'Standard Viewer', role: 'staff', roleId: 'role_custom_standard_viewer', permissions: [], customPermissions: ['standard_view'] },
  manager: { uid: 'manager', email: 'manager@example.test', displayName: 'Manager', role: 'manager', roleId: 'role_manager', permissions: [], customPermissions: [] }
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
        permissions: [...user.permissions],
        customPermissions: [...user.customPermissions]
      }
    )));

    const seedTime = Timestamp.fromMillis(1_700_000_000_000);
    const activityEvent = (
      id: string,
      actor: TestUser,
      action: string,
      module: 'RESULT' | 'INVENTORY' | 'STANDARD' | 'SYSTEM',
      audience: 'RESULT_VIEW' | 'RESULT_OPERATOR' | 'INVENTORY_VIEW' | 'INVENTORY_OPERATOR' | 'STANDARD_VIEW' | 'STANDARD_OPERATOR' | 'SYSTEM_ADMIN',
      importance: 'NORMAL' | 'IMPORTANT' | 'WARNING',
      auditClass: 'BUSINESS' | 'SYSTEM',
      activityVisible = true,
      publicTraceable = false,
      extra: Record<string, unknown> = {}
    ) => ({
      id,
      eventId: id,
      schemaVersion: 2,
      action,
      module,
      audience,
      importance,
      auditClass,
      activityVisible,
      actorUid: actor.uid,
      actorName: actor.displayName,
      user: actor.displayName,
      details: `${action} test event`,
      timestamp: seedTime,
      lastUpdated: seedTime,
      publicTraceable,
      ...extra
    });
    await Promise.all([
      setDoc(doc(db, `artifacts/${APP_ID}/roles_config/role_custom_report_only`), { permissions: [] }),
      setDoc(doc(db, `artifacts/${APP_ID}/roles_config/role_custom_user_manage`), { permissions: [] }),
      setDoc(doc(db, `artifacts/${APP_ID}/roles_config/role_custom_system_manage`), { permissions: [] }),
      setDoc(doc(db, `artifacts/${APP_ID}/roles_config/role_custom_master_data_manage`), { permissions: [] }),
      setDoc(doc(db, `artifacts/${APP_ID}/roles_config/role_custom_policy_manage`), { permissions: [] }),
      setDoc(doc(db, `artifacts/${APP_ID}/roles_config/role_custom_duty_manage`), { permissions: [] }),
      setDoc(doc(db, `artifacts/${APP_ID}/roles_config/role_custom_inventory_viewer`), { permissions: [] }),
      setDoc(doc(db, `artifacts/${APP_ID}/roles_config/role_custom_standard_viewer`), { permissions: [] }),
      setDoc(doc(db, `artifacts/${APP_ID}/roles_config/role_downgraded`), { permissions: [] }),
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
      setDoc(doc(db, `artifacts/${APP_ID}/logs/result-op-manager`), activityEvent(
        'result-op-manager', users.manager, 'SAVE_RESULT_DRAFT', 'RESULT', 'RESULT_OPERATOR', 'NORMAL', 'BUSINESS'
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/result-op-qc`), activityEvent(
        'result-op-qc', users.approver, 'SAVE_RESULT_DRAFT', 'RESULT', 'RESULT_OPERATOR', 'NORMAL', 'BUSINESS'
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/result-op-lab-b`), activityEvent(
        'result-op-lab-b', users.batchB, 'SAVE_RESULT_DRAFT', 'RESULT', 'RESULT_OPERATOR', 'NORMAL', 'BUSINESS'
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/result-view-manager`), activityEvent(
        'result-view-manager', users.manager, 'PUBLISH_RESULT_REPORT', 'RESULT', 'RESULT_VIEW', 'IMPORTANT', 'BUSINESS'
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/inventory-view-manager`), activityEvent(
        'inventory-view-manager', users.manager, 'UPDATE_INFO', 'INVENTORY', 'INVENTORY_VIEW', 'NORMAL', 'BUSINESS'
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/inventory-operator-manager`), activityEvent(
        'inventory-operator-manager', users.manager, 'SOFT_DELETE_ITEM', 'INVENTORY', 'INVENTORY_OPERATOR', 'WARNING', 'BUSINESS'
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/standard-view-manager`), activityEvent(
        'standard-view-manager', users.manager, 'UPDATE_STANDARD', 'STANDARD', 'STANDARD_VIEW', 'NORMAL', 'BUSINESS'
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/standard-operator-manager`), activityEvent(
        'standard-operator-manager', users.manager, 'NORMALIZE_STANDARD_NAMES', 'STANDARD', 'STANDARD_OPERATOR', 'IMPORTANT', 'BUSINESS'
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/system-maintenance`), activityEvent(
        'system-maintenance', users.manager, 'MAINTENANCE_ON', 'SYSTEM', 'SYSTEM_ADMIN', 'WARNING', 'SYSTEM'
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/public-trace`), activityEvent(
        'public-trace', users.manager, 'DIRECT_APPROVE', 'RESULT', 'RESULT_VIEW', 'IMPORTANT', 'BUSINESS', true, true,
        { targetType: 'REQUEST', requestId: 'public-request', printable: true }
      )),
      setDoc(doc(db, `artifacts/${APP_ID}/logs/private-business`), activityEvent(
        'private-business', users.manager, 'APPROVE_REQUEST', 'RESULT', 'RESULT_VIEW', 'IMPORTANT', 'BUSINESS'
      )),
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

function canonicalActivityCreatePayload(
  id: string,
  user: TestUser,
  overrides: Record<string, unknown> = {}
) {
  return {
    id,
    eventId: id,
    schemaVersion: 2,
    action: 'SAVE_RESULT_DRAFT',
    module: 'RESULT',
    audience: 'RESULT_OPERATOR',
    importance: 'NORMAL',
    auditClass: 'BUSINESS',
    activityVisible: true,
    actorUid: user.uid,
    actorName: user.displayName,
    user: user.displayName,
    details: 'Canonical activity create test',
    metadata: { source: 'rules-emulator' },
    timestamp: serverTimestamp(),
    lastUpdated: serverTimestamp(),
    publicTraceable: false,
    ...overrides
  };
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

test('self-registration cannot inject permissions or protected-admin state', async () => {
  const elevatedDb = env.authenticatedContext('register-elevated', { email: 'register-elevated@example.test' }).firestore();
  await assertFails(setDoc(doc(elevatedDb, `artifacts/${APP_ID}/users/register-elevated`), {
    email: 'register-elevated@example.test',
    displayName: 'Register Elevated',
    role: 'pending',
    permissions: [],
    customPermissions: ['system_manage']
  }));

  const protectedDb = env.authenticatedContext('register-protected', { email: 'register-protected@example.test' }).firestore();
  await assertFails(setDoc(doc(protectedDb, `artifacts/${APP_ID}/users/register-protected`), {
    email: 'register-protected@example.test',
    displayName: 'Register Protected',
    role: 'pending',
    permissions: [],
    customPermissions: [],
    protectedAdmin: true
  }));

  const cleanDb = env.authenticatedContext('register-clean', { email: 'register-clean@example.test' }).firestore();
  await assertSucceeds(setDoc(doc(cleanDb, `artifacts/${APP_ID}/users/register-clean`), {
    email: 'register-clean@example.test',
    displayName: 'Register Clean',
    role: 'pending',
    permissions: [],
    customPermissions: []
  }));
});

test('pending and viewer profiles ignore forged custom administrative permissions', async () => {
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await updateDoc(doc(db, `artifacts/${APP_ID}/users/${users.pending.uid}`), {
      customPermissions: ['system_manage']
    });
    await updateDoc(doc(db, `artifacts/${APP_ID}/users/${users.viewer.uid}`), {
      customPermissions: ['system_manage']
    });
  });

  await assertFails(setDoc(doc(dbFor(users.pending), `artifacts/${APP_ID}/config/system`), { maintenanceMode: false }));
  await assertFails(setDoc(doc(dbFor(users.viewer), `artifacts/${APP_ID}/config/system`), { maintenanceMode: false }));
});

test('delegated Settings permissions write only their intended configuration domains', async () => {
  await assertSucceeds(setDoc(doc(dbFor(users.customSystemManage), `artifacts/${APP_ID}/config/system`), { maintenanceMode: false }));
  await assertFails(setDoc(doc(dbFor(users.customSystemManage), `artifacts/${APP_ID}/config/safety`), { rules: [] }));
  await assertFails(setDoc(doc(dbFor(users.customSystemManage), `artifacts/${APP_ID}/master_analytes/system-nope`), { id: 'system-nope' }));

  await assertSucceeds(setDoc(doc(dbFor(users.customMasterDataManage), `artifacts/${APP_ID}/master_analytes/master-ok`), { id: 'master-ok' }));
  await assertFails(setDoc(doc(dbFor(users.customMasterDataManage), `artifacts/${APP_ID}/config/system`), { maintenanceMode: false }));

  await assertSucceeds(setDoc(doc(dbFor(users.customPolicyManage), `artifacts/${APP_ID}/config/safety`), { rules: [] }));
  await assertFails(setDoc(doc(dbFor(users.customPolicyManage), `artifacts/${APP_ID}/master_analytes/policy-nope`), { id: 'policy-nope' }));
});

test('user_manage cannot grant, demote, or delete Manager accounts while Manager retains non-protected control', async () => {
  const userManagerDb = dbFor(users.customUserManage);
  const managerPath = `artifacts/${APP_ID}/users/${users.manager.uid}`;
  const staffPath = `artifacts/${APP_ID}/users/${users.staffDefault.uid}`;

  await assertFails(updateDoc(doc(userManagerDb, managerPath), { role: 'staff', roleId: 'role_staff_default' }));
  await assertFails(updateDoc(doc(userManagerDb, staffPath), { role: 'manager', roleId: '' }));
  await assertFails(deleteDoc(doc(userManagerDb, managerPath)));

  await assertSucceeds(updateDoc(doc(dbFor(users.manager), staffPath), { role: 'manager', roleId: '' }));
});

test('protectedAdmin cannot be changed or deleted through client rules, including by Manager', async () => {
  const protectedUid = 'protected-manager';
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), `artifacts/${APP_ID}/users/${protectedUid}`), {
      email: 'protected-manager@example.test',
      displayName: 'Protected Manager',
      role: 'manager',
      roleId: 'role_manager',
      permissions: [],
      customPermissions: [],
      protectedAdmin: true
    });
  });

  const managerDb = dbFor(users.manager);
  await assertFails(updateDoc(doc(managerDb, `artifacts/${APP_ID}/users/${protectedUid}`), { role: 'staff', roleId: 'role_staff_default' }));
  await assertFails(deleteDoc(doc(managerDb, `artifacts/${APP_ID}/users/${protectedUid}`)));
});

test('release history is readable before authentication for the public changelog route', async () => {
  const publicDb = env.unauthenticatedContext().firestore();
  const snapshot = await assertSucceeds(getDocs(collection(publicDb, 'releases')));
  assert.equal(snapshot.size, 1);
  assert.equal(snapshot.docs[0].data()['version'], 'v26.08.11-b03');
});

test('Activity RESULT_OPERATOR is actor-independent and viewer/pending fail closed', async () => {
  const resultOperatorQuery = (user: TestUser) => query(
    collection(dbFor(user), `artifacts/${APP_ID}/logs`),
    where('audience', '==', 'RESULT_OPERATOR'),
    where('activityVisible', '==', true)
  );

  const labSnapshot = await assertSucceeds(getDocs(resultOperatorQuery(users.batchA)));
  assert.deepEqual(
    new Set(labSnapshot.docs.map(document => document.data()['actorUid'])),
    new Set([users.manager.uid, users.approver.uid, users.batchB.uid])
  );

  await assertFails(getDocs(resultOperatorQuery(users.staffDefault)));
  await assertFails(getDocs(resultOperatorQuery(users.viewer)));
  await assertFails(getDocs(resultOperatorQuery(users.pending)));

  const managerSnapshot = await assertSucceeds(
    getDocs(collection(dbFor(users.manager), `artifacts/${APP_ID}/logs`))
  );
  assert.equal(managerSnapshot.size, 11);
});

test('SYSTEM Activity is visible to user_manage, system_manage or Manager', async () => {
  const systemQuery = (user: TestUser) => query(
    collection(dbFor(user), `artifacts/${APP_ID}/logs`),
    where('audience', '==', 'SYSTEM_ADMIN'),
    where('activityVisible', '==', true)
  );

  await assertFails(getDocs(systemQuery(users.batchA)));
  await assertFails(getDocs(systemQuery(users.approver)));
  await assertFails(getDocs(systemQuery(users.customReportOnly)));

  const userManageSnapshot = await assertSucceeds(getDocs(systemQuery(users.customUserManage)));
  assert.equal(userManageSnapshot.size, 1);
  assert.equal(userManageSnapshot.docs[0]?.id, 'system-maintenance');

  const systemManageSnapshot = await assertSucceeds(getDocs(systemQuery(users.customSystemManage)));
  assert.equal(systemManageSnapshot.size, 1);
  assert.equal(systemManageSnapshot.docs[0]?.id, 'system-maintenance');

  const managerSnapshot = await assertSucceeds(getDocs(systemQuery(users.manager)));
  assert.equal(managerSnapshot.size, 1);
});

test('inventory and standard Activity audiences follow view/operator permissions', async () => {
  const audienceQuery = (user: TestUser, audience: string) => query(
    collection(dbFor(user), `artifacts/${APP_ID}/logs`),
    where('audience', '==', audience),
    where('activityVisible', '==', true)
  );

  const inventoryView = await assertSucceeds(getDocs(audienceQuery(users.inventoryViewer, 'INVENTORY_VIEW')));
  assert.equal(inventoryView.size, 1);
  await assertFails(getDocs(audienceQuery(users.inventoryViewer, 'INVENTORY_OPERATOR')));

  const standardView = await assertSucceeds(getDocs(audienceQuery(users.standardViewer, 'STANDARD_VIEW')));
  assert.equal(standardView.size, 1);
  await assertFails(getDocs(audienceQuery(users.standardViewer, 'STANDARD_OPERATOR')));
});

test('BUSINESS and SYSTEM audit classes are independently authorized', async () => {
  const auditQuery = (user: TestUser, auditClass: 'BUSINESS' | 'SYSTEM') => query(
    collection(dbFor(user), `artifacts/${APP_ID}/logs`),
    where('auditClass', '==', auditClass)
  );

  const businessSnapshot = await assertSucceeds(getDocs(auditQuery(users.customReportOnly, 'BUSINESS')));
  assert.equal(businessSnapshot.size, 10);
  await assertFails(getDocs(auditQuery(users.customReportOnly, 'SYSTEM')));

  const systemSnapshot = await assertSucceeds(getDocs(auditQuery(users.customUserManage, 'SYSTEM')));
  assert.equal(systemSnapshot.size, 1);
  const delegatedSystemSnapshot = await assertSucceeds(getDocs(auditQuery(users.customSystemManage, 'SYSTEM')));
  assert.equal(delegatedSystemSnapshot.size, 1);
  await assertFails(getDocs(auditQuery(users.customUserManage, 'BUSINESS')));

  const managerSnapshot = await assertSucceeds(
    getDocs(collection(dbFor(users.manager), `artifacts/${APP_ID}/logs`))
  );
  assert.equal(managerSnapshot.size, 11);
});

test('permission downgrade immediately removes Activity audience access', async () => {
  const batchDb = dbFor(users.batchA);
  const resultOperatorQuery = query(
    collection(batchDb, `artifacts/${APP_ID}/logs`),
    where('audience', '==', 'RESULT_OPERATOR'),
    where('activityVisible', '==', true)
  );
  await assertSucceeds(getDocs(resultOperatorQuery));

  await env.withSecurityRulesDisabled(async context => {
    await updateDoc(doc(context.firestore(), `artifacts/${APP_ID}/users/${users.batchA.uid}`), {
      roleId: 'role_downgraded',
      permissions: [],
      customPermissions: []
    });
  });

  await assertFails(getDocs(resultOperatorQuery));
});

test('public traceability is get-only and requires publicTraceable BUSINESS data', async () => {
  const publicDb = env.unauthenticatedContext().firestore();

  const traceSnapshot = await assertSucceeds(
    getDoc(doc(publicDb, `artifacts/${APP_ID}/logs/public-trace`))
  );
  assert.equal(traceSnapshot.data()?.['publicTraceable'], true);

  await assertFails(getDoc(doc(publicDb, `artifacts/${APP_ID}/logs/private-business`)));
  await assertFails(getDoc(doc(publicDb, `artifacts/${APP_ID}/logs/system-maintenance`)));
  await assertFails(getDocs(collection(publicDb, `artifacts/${APP_ID}/logs`)));
});

test('personal printable logs require canonical UID ownership after display-name changes', async () => {
  const renamedDisplayName = 'Batch A Renamed';
  const seedTime = Timestamp.fromMillis(1_700_000_000_000);
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, `artifacts/${APP_ID}/logs/printable-v2-owned`), {
      id: 'printable-v2-owned',
      eventId: 'printable-v2-owned',
      schemaVersion: 2,
      action: 'DIRECT_APPROVE',
      module: 'RESULT',
      audience: 'RESULT_VIEW',
      importance: 'IMPORTANT',
      auditClass: 'BUSINESS',
      activityVisible: true,
      actorUid: users.batchA.uid,
      actorName: users.batchA.displayName,
      user: users.batchA.displayName,
      details: 'Printable event created before profile rename',
      timestamp: seedTime,
      lastUpdated: seedTime,
      publicTraceable: false,
      printable: true
    });
    await setDoc(doc(db, `artifacts/${APP_ID}/logs/printable-legacy-renamed`), {
      action: 'PRINT',
      user: renamedDisplayName,
      details: 'Legacy printable event',
      timestamp: seedTime,
      printable: true
    });
    await updateDoc(doc(db, `artifacts/${APP_ID}/users/${users.batchA.uid}`), {
      displayName: renamedDisplayName
    });
  });

  const db = dbFor(users.batchA);
  const v2Snapshot = await assertSucceeds(getDocs(query(
    collection(db, `artifacts/${APP_ID}/logs`),
    where('printable', '==', true),
    where('actorUid', '==', users.batchA.uid)
  )));
  assert.deepEqual(v2Snapshot.docs.map(item => item.id), ['printable-v2-owned']);

  await assertFails(getDocs(query(
    collection(db, `artifacts/${APP_ID}/logs`),
    where('printable', '==', true),
    where('user', '==', renamedDisplayName)
  )));
});

test('lastActivitySeenAt preference is private to its owner and server-timestamped', async () => {
  const batchDb = dbFor(users.batchA);
  const preferencePath = `artifacts/${APP_ID}/user_preferences/${users.batchA.uid}`;
  const preferenceRef = doc(batchDb, preferencePath);

  await assertSucceeds(setDoc(preferenceRef, { lastActivitySeenAt: serverTimestamp() }));
  const ownPreference = await assertSucceeds(getDoc(preferenceRef));
  assert.ok(ownPreference.data()?.['lastActivitySeenAt']);

  await assertFails(getDoc(doc(dbFor(users.batchB), preferencePath)));
  await assertFails(getDoc(doc(dbFor(users.manager), preferencePath)));
  await assertFails(setDoc(preferenceRef, {
    lastActivitySeenAt: Timestamp.fromMillis(1_786_182_400_000)
  }, { merge: true }));
  await assertFails(setDoc(preferenceRef, {
    lastActivitySeenAt: serverTimestamp(),
    notificationReadState: true
  }, { merge: true }));
});

test('canonical Activity create rejects forged identity, classification and unsafe payloads', async () => {
  const db = dbFor(users.batchA);
  const validId = 'create-valid-result';
  await assertSucceeds(setDoc(
    doc(db, `artifacts/${APP_ID}/logs/${validId}`),
    canonicalActivityCreatePayload(validId, users.batchA)
  ));

  const assertCreateDenied = async (id: string, overrides: Record<string, unknown>) => {
    await assertFails(setDoc(
      doc(db, `artifacts/${APP_ID}/logs/${id}`),
      canonicalActivityCreatePayload(id, users.batchA, overrides)
    ));
  };

  await assertCreateDenied('create-forged-uid', { actorUid: users.batchB.uid });
  await assertCreateDenied('create-forged-name', { actorName: 'Forged Actor', user: 'Forged Actor' });
  await assertCreateDenied('create-forged-user', { user: users.batchB.displayName });
  await assertCreateDenied('create-forged-audience', { audience: 'RESULT_VIEW' });
  await assertCreateDenied('create-forged-module', { module: 'SYSTEM' });
  await assertCreateDenied('create-forged-audit', { auditClass: 'SYSTEM' });
  await assertCreateDenied('create-forged-importance', { importance: 'WARNING' });
  await assertCreateDenied('create-forged-visibility', { activityVisible: false });
  await assertCreateDenied('create-unknown-action', { action: 'UNKNOWN_ACTION' });
  await assertCreateDenied('create-wrong-event-id', { eventId: 'different-id' });
  await assertCreateDenied('create-client-time', {
    timestamp: Timestamp.fromMillis(1_786_182_400_000),
    lastUpdated: Timestamp.fromMillis(1_786_182_400_000)
  });
  await assertCreateDenied('create-oversized-details', { details: 'x'.repeat(2001) });
  await assertCreateDenied('create-oversized-metadata', {
    metadata: Object.fromEntries(Array.from({ length: 41 }, (_, index) => [`key${index}`, index]))
  });
  await assertCreateDenied('create-illegal-public', { publicTraceable: true });

  const systemPayload = {
    action: 'MAINTENANCE_ON',
    module: 'SYSTEM',
    audience: 'SYSTEM_ADMIN',
    importance: 'WARNING',
    auditClass: 'SYSTEM',
    activityVisible: true,
    publicTraceable: false
  };
  await assertCreateDenied('create-system-as-lab', systemPayload);

  const managerDb = dbFor(users.manager);
  const managerSystemId = 'create-system-manager';
  await assertSucceeds(setDoc(
    doc(managerDb, `artifacts/${APP_ID}/logs/${managerSystemId}`),
    canonicalActivityCreatePayload(managerSystemId, users.manager, systemPayload)
  ));
});

test('batch_run, sop_approve, manager and report_view can read print jobs but viewer cannot', async () => {
  const printJobPath = `artifacts/${APP_ID}/print_jobs/owned-by-a`;
  for (const user of [users.batchA, users.approver, users.manager, users.customReportOnly]) {
    await assertSucceeds(getDoc(doc(dbFor(user), printJobPath)));
  }
  await assertFails(getDoc(doc(dbFor(users.viewer), printJobPath)));
});

test('report_view can read inventory for NXT reporting without inventory write access', async () => {
  const inventoryPath = `artifacts/${APP_ID}/inventory/inventory-1`;
  await assertSucceeds(getDoc(doc(dbFor(users.customReportOnly), inventoryPath)));
  await assertFails(updateDoc(doc(dbFor(users.customReportOnly), inventoryPath), {
    stock: 999,
    lastUpdated: serverTimestamp()
  }));
  await assertFails(getDoc(doc(dbFor(users.pending), inventoryPath)));
});

test('report_view can read reporting dependencies without receiving operational write access', async () => {
  const reportDb = dbFor(users.customReportOnly);
  const pendingDb = dbFor(users.pending);
  const requestPath = `artifacts/${APP_ID}/requests/pending-request`;
  const standardPath = `artifacts/${APP_ID}/reference_standards/std-requester`;
  const standardRequestPath = `artifacts/${APP_ID}/standard_requests/requester-lifecycle`;

  await assertSucceeds(getDocs(collection(reportDb, `artifacts/${APP_ID}/requests`)));
  await assertSucceeds(getDoc(doc(reportDb, standardPath)));
  await assertSucceeds(getDocs(collection(reportDb, `artifacts/${APP_ID}/reference_standards`)));
  await assertSucceeds(getDoc(doc(reportDb, standardRequestPath)));
  await assertSucceeds(getDocs(collection(reportDb, `artifacts/${APP_ID}/standard_requests`)));

  await assertFails(getDocs(collection(pendingDb, `artifacts/${APP_ID}/requests`)));
  await assertFails(getDoc(doc(pendingDb, standardPath)));
  await assertFails(getDoc(doc(pendingDb, standardRequestPath)));

  await assertFails(updateDoc(doc(reportDb, requestPath), { status: 'approved', lastUpdated: serverTimestamp() }));
  await assertFails(updateDoc(doc(reportDb, standardPath), { current_amount: 99, lastUpdated: serverTimestamp() }));
  await assertFails(updateDoc(doc(reportDb, standardRequestPath), { status: 'APPROVED', lastUpdated: serverTimestamp() }));
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

test('sop_view can read monthly dashboard stats without report_view', async () => {
  const monthlyStatsPath = `artifacts/${APP_ID}/monthly_stats/2026-08`;

  await assertSucceeds(getDoc(doc(dbFor(users.viewer), monthlyStatsPath)));
  await assertSucceeds(getDoc(doc(dbFor(users.customReportOnly), monthlyStatsPath)));
  await assertFails(getDoc(doc(dbFor(users.pending), monthlyStatsPath)));
});

test('duty schedule is readable by signed-in users but writable only with duty_manage or Manager', async () => {
  const dutyDb = dbFor(users.customDutyManage);
  const managerDb = dbFor(users.manager);
  const staffDb = dbFor(users.staffDefault);
  const viewerDb = dbFor(users.viewer);
  const anonymousDb = env.unauthenticatedContext().firestore();

  const staffRef = doc(dutyDb, `artifacts/${APP_ID}/duty_staff/staff-huynh`);
  await assertSucceeds(setDoc(staffRef, {
    displayName: 'Huỳnh',
    employeeCode: '',
    linkedUserUid: null,
    active: true,
    note: '',
    createdAt: serverTimestamp(),
    createdByUid: users.customDutyManage.uid,
    updatedAt: serverTimestamp(),
    updatedByUid: users.customDutyManage.uid
  }));

  await assertSucceeds(getDoc(doc(viewerDb, `artifacts/${APP_ID}/duty_staff/staff-huynh`)));
  await assertFails(getDoc(doc(anonymousDb, `artifacts/${APP_ID}/duty_staff/staff-huynh`)));

  await assertFails(setDoc(doc(staffDb, `artifacts/${APP_ID}/duty_staff/staff-denied`), {
    displayName: 'Không có quyền',
    employeeCode: '',
    linkedUserUid: null,
    active: true,
    note: '',
    createdAt: serverTimestamp(),
    createdByUid: users.staffDefault.uid,
    updatedAt: serverTimestamp(),
    updatedByUid: users.staffDefault.uid
  }));

  await assertSucceeds(setDoc(doc(managerDb, `artifacts/${APP_ID}/duty_staff/staff-manager`), {
    displayName: 'Nhân sự do Manager tạo',
    employeeCode: '',
    linkedUserUid: users.viewer.uid,
    active: true,
    note: '',
    createdAt: serverTimestamp(),
    createdByUid: users.manager.uid,
    updatedAt: serverTimestamp(),
    updatedByUid: users.manager.uid
  }));

  await assertFails(setDoc(doc(managerDb, `artifacts/${APP_ID}/duty_staff/staff-bad-link`), {
    displayName: 'Liên kết sai',
    employeeCode: '',
    linkedUserUid: 'missing-user',
    active: true,
    note: '',
    createdAt: serverTimestamp(),
    createdByUid: users.manager.uid,
    updatedAt: serverTimestamp(),
    updatedByUid: users.manager.uid
  }));

  const scheduleRef = doc(dutyDb, `artifacts/${APP_ID}/duty_schedules/2026-09-04`);
  await assertSucceeds(setDoc(scheduleRef, {
    date: '2026-09-04',
    staffIds: ['staff-huynh'],
    startTime: '18:00',
    status: 'planned',
    note: '',
    source: 'manual',
    createdAt: serverTimestamp(),
    createdByUid: users.customDutyManage.uid,
    updatedAt: serverTimestamp(),
    updatedByUid: users.customDutyManage.uid
  }));

  await assertFails(setDoc(doc(managerDb, `artifacts/${APP_ID}/duty_schedules/2026-09-06`), {
    date: '2026-09-06',
    staffIds: [],
    startTime: '18:00',
    status: 'planned',
    note: '',
    source: 'manual',
    createdAt: serverTimestamp(),
    createdByUid: users.manager.uid,
    updatedAt: serverTimestamp(),
    updatedByUid: users.manager.uid
  }));

  await assertSucceeds(getDoc(doc(viewerDb, `artifacts/${APP_ID}/duty_schedules/2026-09-04`)));

  await assertSucceeds(setDoc(doc(managerDb, `artifacts/${APP_ID}/duty_schedules/2026-09-05`), {
    date: '2026-09-05',
    staffIds: [],
    startTime: '18:00',
    status: 'planned',
    note: '',
    source: 'batch',
    createdAt: serverTimestamp(),
    createdByUid: users.manager.uid,
    updatedAt: serverTimestamp(),
    updatedByUid: users.manager.uid
  }));

  const fullMonthBatch = writeBatch(managerDb);
  for (let day = 1; day <= 31; day += 1) {
    const date = `2026-10-${String(day).padStart(2, '0')}`;
    fullMonthBatch.set(doc(managerDb, `artifacts/${APP_ID}/duty_schedules/${date}`), {
      date,
      staffIds: [],
      startTime: '18:00',
      status: 'planned',
      note: '',
      source: 'batch',
      createdAt: serverTimestamp(),
      createdByUid: users.manager.uid,
      updatedAt: serverTimestamp(),
      updatedByUid: users.manager.uid
    });
  }
  await assertSucceeds(fullMonthBatch.commit());

  await assertFails(updateDoc(doc(staffDb, `artifacts/${APP_ID}/duty_schedules/2026-09-04`), {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
    updatedByUid: users.staffDefault.uid
  }));
  await assertSucceeds(updateDoc(scheduleRef, {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
    updatedByUid: users.customDutyManage.uid
  }));

  await assertFails(deleteDoc(doc(managerDb, `artifacts/${APP_ID}/duty_schedules/2026-09-04`)));
  await assertFails(deleteDoc(doc(managerDb, `artifacts/${APP_ID}/duty_staff/staff-huynh`)));
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

test('legacy registry alias migration is denied when split before its canonical target and succeeds atomically', async () => {
  const managerDb = dbFor(users.manager);
  const legacyPath = `artifacts/${APP_ID}/standard_code_registry/ba01`;
  const canonicalPath = `artifacts/${APP_ID}/standard_code_registry/BA01`;

  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    const seedTime = Timestamp.fromMillis(1_700_000_000_000);
    await setDoc(doc(db, legacyPath), {
      id: 'ba01',
      internal_id: 'ba01',
      status: 'AVAILABLE',
      assignmentCount: 0,
      lastUpdated: seedTime,
    });
  });

  // This is exactly the unsafe state produced when the planner puts the alias
  // in an earlier Firestore batch than the canonical target.
  await assertFails(updateDoc(doc(managerDb, legacyPath), {
    migrationStatus: 'MIGRATED',
    migratedTo: 'BA01',
    migratedAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
  }));

  const atomicBatch = writeBatch(managerDb);
  atomicBatch.set(doc(managerDb, canonicalPath), {
    id: 'BA01',
    internal_id: 'BA01',
    status: 'AVAILABLE',
    assignmentCount: 0,
    lastUpdated: serverTimestamp(),
  });
  atomicBatch.update(doc(managerDb, legacyPath), {
    migrationStatus: 'MIGRATED',
    migratedTo: 'BA01',
    migratedAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
  });
  await assertSucceeds(atomicBatch.commit());
});

test('internal-id snapshot repair batches are constrained by Firestore rule document-access limits', async () => {
  const managerDb = dbFor(users.manager);
  const seedTime = Timestamp.fromMillis(1_700_000_000_000);

  const seedRepairSet = async (prefix: string, count: number) => {
    await env.withSecurityRulesDisabled(async context => {
      const db = context.firestore();
      const writes: Promise<unknown>[] = [];
      for (let i = 0; i < count; i++) {
        const suffix = i.toString(36).toUpperCase().padStart(3, '0');
        const code = `A${suffix}`;
        const standardId = `${prefix}-std-${i}`;
        const logId = `${prefix}-log-${i}`;
        writes.push(setDoc(doc(db, `artifacts/${APP_ID}/reference_standards/${standardId}`), {
          id: standardId,
          name: `Rule budget ${i}`,
          internal_id: code,
          initial_amount: 10,
          current_amount: 10,
          unit: 'mg',
          status: 'AVAILABLE',
          lifecycle_status: 'ACTIVE',
          lastUpdated: seedTime,
        }));
        writes.push(setDoc(doc(db, `artifacts/${APP_ID}/reference_standards/${standardId}/logs/${logId}`), {
          id: logId,
          standardId,
          internalId: code.toLowerCase(),
          lastUpdated: seedTime,
        }));
      }
      await Promise.all(writes);
    });
  };

  const buildRepairBatch = (prefix: string, count: number) => {
    const batch = writeBatch(managerDb);
    for (let i = 0; i < count; i++) {
      const suffix = i.toString(36).toUpperCase().padStart(3, '0');
      const code = `A${suffix}`;
      const standardId = `${prefix}-std-${i}`;
      const logId = `${prefix}-log-${i}`;
      batch.update(doc(managerDb, `artifacts/${APP_ID}/reference_standards/${standardId}/logs/${logId}`), {
        internalId: code,
        lastUpdated: serverTimestamp(),
      });
    }
    batch.set(doc(managerDb, `artifacts/${APP_ID}/standard_code_sync_batches/${prefix}-audit`), {
      status: 'APPLIED',
      generatedAt: 1_700_000_000_000,
      recordCount: count,
      changes: [{ kind: 'rule-budget-regression' }],
      createdAt: serverTimestamp(),
      createdBy: users.manager.uid,
    });
    return batch;
  };

  await seedRepairSet('within-budget', 7);
  await assertSucceeds(buildRepairBatch('within-budget', 7).commit());

  await seedRepairSet('over-budget', 20);
  await assertFails(buildRepairBatch('over-budget', 20).commit());
});

test('nested log normalization can read a parent normalized in the same atomic batch', async () => {
  const managerDb = dbFor(users.manager);
  const standardPath = `artifacts/${APP_ID}/reference_standards/std-parent-normalize`;
  const logPath = `${standardPath}/logs/log-parent-normalize`;

  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    const seedTime = Timestamp.fromMillis(1_700_000_000_000);
    await setDoc(doc(db, standardPath), {
      id: 'std-parent-normalize',
      name: 'Parent normalization regression',
      internal_id: ' ba01 ',
      initial_amount: 10,
      current_amount: 10,
      unit: 'mg',
      status: 'AVAILABLE',
      lifecycle_status: 'RELEASED',
      lastUpdated: seedTime,
    });
    await setDoc(doc(db, logPath), {
      id: 'log-parent-normalize',
      standardId: 'std-parent-normalize',
      internalId: ' ba01 ',
      lastUpdated: seedTime,
    });
  });

  const splitChild = updateDoc(doc(managerDb, logPath), {
    internalId: 'BA01',
    lastUpdated: serverTimestamp(),
  });
  await assertFails(splitChild);

  const atomicBatch = writeBatch(managerDb);
  atomicBatch.update(doc(managerDb, standardPath), {
    internal_id: 'BA01',
    search_key: 'parent normalization regression ba01',
    lastUpdated: serverTimestamp(),
  });
  atomicBatch.update(doc(managerDb, logPath), {
    internalId: 'BA01',
    lastUpdated: serverTimestamp(),
  });
  await assertSucceeds(atomicBatch.commit());
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

test('print jobs are immutable historical snapshots and cannot be deleted by clients', async () => {
  await assertFails(deleteDoc(doc(dbFor(users.batchA), `artifacts/${APP_ID}/print_jobs/owned-by-a`)));
  await assertFails(deleteDoc(doc(dbFor(users.batchA), `artifacts/${APP_ID}/print_jobs/owned-by-b`)));

  await assertFails(deleteDoc(doc(dbFor(users.approver), `artifacts/${APP_ID}/print_jobs/owned-by-b`)));

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
  await assertFails(deleteDoc(doc(dbFor(users.manager), `artifacts/${APP_ID}/print_jobs/manager-delete`)));
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
