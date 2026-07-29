import assert from 'node:assert/strict';
import test from 'node:test';
import { buildStandardBackfillRecords } from './standard-backfill';

test('builds a completed historical request linked to its usage log', () => {
  const eventTimestamp = new Date('2026-07-20T12:00:00+07:00').getTime();
  const result = buildStandardBackfillRecords({
    requestId: 'request-1',
    logId: 'log-1',
    standard: {
      id: 'standard-1',
      name: 'Propoxur (Baygon)',
      internal_id: 'CA48',
      lot_number: 'P-009NB-250',
      manufacturer: 'AccuStandard (USA)',
      initial_amount: 250,
      current_amount: 230.2,
      unit: 'mg'
    },
    employeeUid: 'employee-1',
    employeeName: 'Nhân viên A',
    enteredByUid: 'manager-1',
    enteredByName: 'Quản lý B',
    eventTimestamp,
    backfilledAt: eventTimestamp + 1000,
    amountUsed: 19.8,
    usageUnit: 'mg',
    normalizedAmount: 19.8,
    stockUnit: 'mg',
    purpose: 'Pha chuẩn mới',
    isDepleted: false
  });

  assert.equal(result.request.status, 'COMPLETED');
  assert.equal(result.request.requestedBy, 'employee-1');
  assert.equal(result.request.isBackfill, true);
  assert.equal(result.request.totalAmountUsed, 19.8);
  assert.equal(result.request.usageLogs?.length, 1);
  assert.equal(result.usageLog.requestId, result.request.id);
  assert.equal(result.usageLog.userId, result.request.requestedBy);
  assert.equal(result.usageLog.standardId, result.request.standardId);
  assert.equal(result.usageLog.backfilledByUid, 'manager-1');
});

test('rejects a backfill without stable employee identity', () => {
  assert.throws(() => buildStandardBackfillRecords({
    requestId: 'request-1',
    logId: 'log-1',
    standard: {
      id: 'standard-1',
      name: 'Propoxur',
      initial_amount: 250,
      current_amount: 230.2,
      unit: 'mg'
    },
    employeeUid: '',
    employeeName: 'Nhân viên A',
    enteredByUid: 'manager-1',
    enteredByName: 'Quản lý B',
    eventTimestamp: Date.now(),
    backfilledAt: Date.now(),
    amountUsed: 1,
    usageUnit: 'mg',
    normalizedAmount: 1,
    stockUnit: 'mg',
    purpose: 'Pha chuẩn',
    isDepleted: false
  }), /Thiếu người sử dụng/);
});
