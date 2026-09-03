import assert from 'node:assert/strict';
import test from 'node:test';
import {
  actorMayDispatchContract,
  getActivityDispatchContract,
  canonicalDispatchActionUrl,
  fallbackRolePermissions,
  resultStakeholderUids,
  standardCoaRequesterUids,
  standardRequesterUids,
  suppressActorUid,
  userHasAnyPermission,
  validateCanonicalDispatchEvent
} from './activity-notification-dispatch.js';

test('dispatch validation fails closed for unknown policy or forged classification', () => {
  const base = {
    eventId: 'evt-1', schemaVersion: 2, action: 'REQUEST_STANDARD',
    module: 'STANDARD', audience: 'STANDARD_VIEW', actorUid: 'user-a', actorName: 'Actor',
    activityVisible: true, details: 'request'
  };
  assert.equal(validateCanonicalDispatchEvent('evt-1', base).ok, true);
  assert.equal(validateCanonicalDispatchEvent('evt-1', { ...base, eventId: 'evt-2' }).ok, false);
  assert.equal(validateCanonicalDispatchEvent('evt-1', { ...base, audience: 'SYSTEM_ADMIN' }).ok, false);
  assert.equal(validateCanonicalDispatchEvent('evt-1', { ...base, action: 'UPDATE_STANDARD' }).ok, false);
  assert.equal(validateCanonicalDispatchEvent('evt-1', { ...base, actorName: '' }).ok, false);
  assert.equal(validateCanonicalDispatchEvent('evt-1', { ...base, activityVisible: false }).ok, false);
  assert.equal(validateCanonicalDispatchEvent('evt-1', { ...base, details: 'x'.repeat(2_001) }).ok, false);
});

test('recipient extraction uses UID fields only and never display names', () => {
  assert.deepEqual(resultStakeholderUids({
    createdByUid: 'user-a', assignedToUid: 'user-b', user: 'Display Name', requesterUid: 'user-a'
  }), ['user-a', 'user-b']);
  assert.deepEqual(standardRequesterUids({ requestedBy: 'user-c', requestedByName: 'Display Name' }), ['user-c']);
  assert.deepEqual(standardCoaRequesterUids([
    { lastCoaRequestedByUid: 'user-c', requestedByName: 'Display Name' },
    { lastCoaRequestedByUid: 'user-d' },
    { lastCoaRequestedByUid: 'user-c' }
  ]), ['user-c', 'user-d']);
});

test('permission resolution honors direct/custom/role permissions and manager override', () => {
  assert.equal(userHasAnyPermission({ role: 'staff', permissions: ['inventory_view'] }, ['inventory_edit'], ['inventory_edit']), true);
  assert.equal(userHasAnyPermission({ role: 'staff', customPermissions: ['user_manage'] }, [], ['user_manage']), true);
  assert.equal(userHasAnyPermission({ role: 'manager' }, [], ['anything']), true);
  assert.equal(userHasAnyPermission({ role: 'viewer', permissions: ['standard_view'] }, [], ['standard_approve']), false);
  assert.equal(fallbackRolePermissions('role_lab_technician').includes('inventory_edit'), true);
  const systemContract = getActivityDispatchContract('POST_SYSTEM_UPDATE');
  assert.ok(systemContract);
  assert.equal(actorMayDispatchContract({ role: 'staff', customPermissions: ['user_manage'] }, [], systemContract), false);
  assert.equal(actorMayDispatchContract({ role: 'staff', customPermissions: ['system_manage'] }, [], systemContract), true);
  assert.equal(actorMayDispatchContract({ role: 'manager' }, [], systemContract), true);
  const standardContract = getActivityDispatchContract('REQUEST_STANDARD');
  assert.ok(standardContract);
  assert.equal(actorMayDispatchContract({ role: 'staff', permissions: ['standard_view'] }, [], standardContract), false);
});

test('actor suppression and policy lookup are deterministic', () => {
  assert.deepEqual(suppressActorUid(['actor', 'user-b', 'user-b'], 'actor', true), ['user-b']);
  assert.equal(getActivityDispatchContract('PUBLISH_RESULT_REPORT')?.type, 'RESULT_PUBLISHED');
  assert.equal(getActivityDispatchContract('SAVE_RESULT_DRAFT'), null);
  assert.equal(canonicalDispatchActionUrl('PUBLISH_RESULT_REPORT', { requestId: 'REQ/1' }), '/results/REQ%2F1');
  assert.equal(canonicalDispatchActionUrl('APPROVE_REQUEST', { requestId: 'REQ/1' }), '/requests');
});
