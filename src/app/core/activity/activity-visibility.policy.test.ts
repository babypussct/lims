import assert from 'node:assert/strict';
import test from 'node:test';
import { canViewActivityEvent, canViewAuditEvent, resolveAllowedActivityAudiences } from './activity-visibility.policy';

test('viewer and pending roles fail closed even when permission strings are present', () => {
  assert.deepEqual(resolveAllowedActivityAudiences({ role: 'viewer', permissions: ['sop_view', 'report_view'] }), []);
  assert.deepEqual(resolveAllowedActivityAudiences({ role: 'pending', permissions: ['*'] }), []);
});

test('manager receives every activity audience including SYSTEM_ADMIN', () => {
  const audiences = resolveAllowedActivityAudiences({ role: 'manager', permissions: [] });
  assert.ok(audiences.includes('RESULT_VIEW'));
  assert.ok(audiences.includes('INVENTORY_OPERATOR'));
  assert.ok(audiences.includes('STANDARD_OPERATOR'));
  assert.ok(audiences.includes('SYSTEM_ADMIN'));
});

test('staff audiences are permission-based and operators retain high-level visibility', () => {
  const resultOperator = resolveAllowedActivityAudiences({ role: 'staff', permissions: ['batch_run'] });
  assert.ok(resultOperator.includes('RESULT_VIEW'));
  assert.ok(resultOperator.includes('RESULT_OPERATOR'));

  const inventoryOperator = resolveAllowedActivityAudiences({ role: 'staff', permissions: ['inventory_edit'] });
  assert.ok(inventoryOperator.includes('INVENTORY_VIEW'));
  assert.ok(inventoryOperator.includes('INVENTORY_OPERATOR'));

  const standardOperator = resolveAllowedActivityAudiences({ role: 'staff', permissions: ['standard_approve'] });
  assert.ok(standardOperator.includes('STANDARD_VIEW'));
  assert.ok(standardOperator.includes('STANDARD_OPERATOR'));
});

test('report_view does not open global Activity Feed visibility', () => {
  const context = { role: 'staff' as const, permissions: ['report_view'] };
  assert.deepEqual(resolveAllowedActivityAudiences(context), []);
  assert.equal(canViewActivityEvent(context, { audience: 'RESULT_VIEW', activityVisible: true }), false);
  assert.equal(canViewAuditEvent(context, { auditClass: 'BUSINESS' }), true);
  assert.equal(canViewAuditEvent(context, { auditClass: 'SYSTEM' }), false);
});

test('audit policy separates BUSINESS report access from SYSTEM administration', () => {
  assert.equal(canViewAuditEvent({ role: 'staff', permissions: ['user_manage'] }, { auditClass: 'SYSTEM' }), true);
  assert.equal(canViewAuditEvent({ role: 'staff', permissions: ['user_manage'] }, { auditClass: 'BUSINESS' }), false);
  assert.equal(canViewAuditEvent({ role: 'manager', permissions: [] }, { auditClass: 'BUSINESS' }), true);
});

test('activityVisible=false always suppresses Dashboard visibility', () => {
  const manager = { role: 'manager' as const, permissions: ['*'] };
  assert.equal(canViewActivityEvent(manager, { audience: 'RESULT_VIEW', activityVisible: false }), false);
});
