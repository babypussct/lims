import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { Injector, runInInjectionContext, signal } from '@angular/core';
import { assertFails, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { collection, doc, getDoc, getDocs, query, setDoc, setLogLevel, where, writeBatch } from 'firebase/firestore';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { TraceabilityDataService } from './traceability-data.service';

setLogLevel('silent');
test('standard traceability reads and paginated queries obey real Firestore permissions', async () => {
  const host = process.env['FIRESTORE_EMULATOR_HOST'];
  assert.ok(host, 'Run using the Firestore emulator harness');
  const [hostname, port] = host!.split(':');
  const env = await initializeTestEnvironment({ projectId: 'demo-lims-standard-trace',
    firestore: { host: hostname, port: Number(port), rules: readFileSync('firestore.rules', 'utf8') } });
  const appId = 'trace-fixture';
  const path = (source: string, id?: string) => `artifacts/${appId}/${source}${id ? '/' + id : ''}`;
  const profiles = {
    borrower: ['standard_request'], outsider: ['standard_request'], viewer: ['standard_log_view'],
    operator: ['standard_edit'], reporter: ['report_view'], manager: ['*'], auditor: ['standard_edit', 'standard_audit_view'],
  };
  try {
    await env.withSecurityRulesDisabled(async context => {
      const db = context.firestore();
      const batch = writeBatch(db);
      batch.set(doc(db, path('roles_config', 'role_trace_fixture')), { permissions: [] });
      for (const [uid, permissions] of Object.entries(profiles)) batch.set(doc(db, path('users', uid)), {
        uid, role: uid === 'manager' ? 'manager' : 'staff', roleId: 'role_trace_fixture', customPermissions: permissions,
      });
      batch.set(doc(db, path('reference_standards', 'standard')), { id: 'standard', name: 'Chuẩn thử', unit: 'mg' });
      batch.set(doc(db, path('standard_requests', 'borrow')), {
        id: 'borrow', requestedBy: 'borrower', requestedByName: 'Người mượn', standardId: 'standard',
        standardName: 'Chuẩn thử', status: 'IN_PROGRESS', totalAmountUsed: 105, usageLogs: [],
      });
      for (let i = 0; i < 105; i++) batch.set(doc(db, path('standard_usages', `usage-${i.toString().padStart(3, '0')}`)), {
        id: `usage-${i.toString().padStart(3, '0')}`, requestId: 'borrow', standardId: 'standard', user: 'Người mượn', amount_used: 1, unit: 'mg',
      });
      for (const [id, audience, visible, module] of [
        ['view-event', 'STANDARD_VIEW', true, 'STANDARD'], ['operator-event', 'STANDARD_OPERATOR', true, 'STANDARD'],
        ['hidden-event', 'STANDARD_VIEW', false, 'STANDARD'], ['other-module', 'INVENTORY_VIEW', true, 'INVENTORY'],
      ] as const) batch.set(doc(db, path('logs', id)), { id, requestId: 'borrow', module, audience, activityVisible: visible, auditClass: 'BUSINESS' });
      await batch.commit();
    });
    function service(uid: keyof typeof profiles | null) {
      const db = uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore();
      const audit = signal(uid === 'auditor');
      const injector = Injector.create({ providers: [
        { provide: FirebaseService, useValue: { db, APP_ID: appId } },
        { provide: AuthService, useValue: {
          currentUser: () => uid ? { uid } : null, isStandardAuditMode: audit,
          isManager: () => uid === 'manager', hasPermission: (permission: string) => uid === 'manager' || !!uid && profiles[uid].includes(permission),
        } },
      ] });
      return { data: runInInjectionContext(injector, () => new TraceabilityDataService()), db };
    }
    const borrower = service('borrower');
    assert.equal((await borrower.data.findStandardRecord('borrow'))?.recordType, 'STANDARD_REQUEST');
    assert.equal((await borrower.data.findStandardRecord('borrow'))?.standard, null, 'Current stock is optional and denied to this borrower');
    assert.deepEqual(borrower.data.historySources('borrow'), []);
    await assertFails(getDoc(doc(borrower.db, path('standard_usages', 'usage-000'))));
    assert.equal(await service('outsider').data.findStandardRecord('borrow'), null);
    assert.equal(await service(null).data.findStandardRecord('borrow'), null);
    assert.equal(await service('auditor').data.findStandardRecord('borrow'), null, 'Audit UI guard takes precedence over additional edit permission');
    await assertFails(getDoc(doc(service(null).db, path('standard_requests', 'borrow'))));
    const viewer = service('viewer');
    const first = await viewer.data.loadHistory(viewer.data.historySources('borrow'));
    assert.equal(first.usages.length, 100);
    assert.deepEqual(first.events.map(event => event.id), ['view-event']);
    assert.deepEqual(first.notes, []);
    const second = await viewer.data.loadHistory(first.sources);
    assert.equal(second.usages.length, 5);
    assert.ok(second.sources.every(source => source.done));
    assert.equal(new Set([...first.usages, ...second.usages].map(usage => usage.id)).size, 105);
    assert.equal((await viewer.data.findStandardRecord('usage-000'))?.recordType, 'STANDARD_USAGE');
    await assertFails(getDocs(query(collection(viewer.db, path('logs')), where('requestId', '==', 'borrow'))));
    await assertFails(getDoc(doc(viewer.db, path('logs', 'operator-event'))));
    for (const uid of ['operator', 'reporter', 'manager'] as const) {
      const scoped = service(uid);
      const page = await scoped.data.loadHistory(scoped.data.historySources('borrow'));
      assert.deepEqual(page.notes, []);
      assert.ok(page.events.some(event => event.id === 'view-event'));
      assert.ok(page.events.some(event => event.id === 'operator-event'));
      assert.equal(page.events.some(event => event.id === 'other-module'), false);
    }
    const denied = await borrower.data.loadHistory([{ key: 'forbidden-audit', collection: 'logs', filters: [['requestId', 'borrow']] }]);
    assert.equal(denied.events.length, 0);
    assert.ok(denied.notes.some(note => note.includes('cấp quyền')));
    assert.equal((await borrower.data.findStandardRecord('borrow'))?.request?.totalAmountUsed, 105);
  } finally { await env.cleanup(); }
});
