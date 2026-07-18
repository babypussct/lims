import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ReferenceStandard } from '../../core/models/standard.model';
import {
  canAssign,
  getFefoPredecessor,
  getFefoPriorityStandard,
  isFefoCandidate,
  isFefoPriorityStandard,
  isStandardExpired,
  normalizeStandardName,
  parseStandardDate,
  sortStandardsByFefo
} from './standard-fefo';

describe('standard FEFO helpers', () => {
  const today = new Date(2026, 6, 18, 13, 40);

  function standard(overrides: Partial<ReferenceStandard> = {}): ReferenceStandard {
    return {
      id: 'std-1',
      name: 'Atrazine',
      current_amount: 100,
      initial_amount: 100,
      unit: 'mg',
      status: 'AVAILABLE',
      expiry_date: '2027-01-01',
      received_date: '2024-01-01',
      ...overrides
    };
  }

  it('parses date-only values at local midnight and rejects impossible dates', () => {
    assert.equal(parseStandardDate('2026-07-18'), new Date(2026, 6, 18).getTime());
    assert.equal(parseStandardDate('2026-02-30'), null);
    assert.equal(parseStandardDate('not-a-date'), null);
  });

  it('treats an expiry date as valid through the end of that calendar day', () => {
    assert.equal(isStandardExpired('2026-07-18', today), false);
    assert.equal(isStandardExpired('2026-07-17', today), true);
    assert.equal(canAssign(standard({ expiry_date: '2026-07-18' }), today), true);
  });

  it('excludes used, depleted, expired and reserved lots from FEFO candidates', () => {
    assert.equal(isFefoCandidate(standard({ status: 'IN_USE' }), today), false);
    assert.equal(isFefoCandidate(standard({ current_amount: 0 }), today), false);
    assert.equal(isFefoCandidate(standard({ expiry_date: '2026-07-17' }), today), false);
    assert.equal(isFefoCandidate(standard({ has_pending_request: true }), today), false);
    assert.equal(isFefoCandidate(standard({ current_holder: 'Analyst' }), today), false);
  });

  it('orders candidates by expiry, then amount, receipt date and natural id', () => {
    const sorted = sortStandardsByFefo([
      standard({ id: 'late', internal_id: 'CZ10', expiry_date: '2028-01-01' }),
      standard({ id: 'more', internal_id: 'CZ3', expiry_date: '2027-01-01', current_amount: 80 }),
      standard({ id: 'newer', internal_id: 'CZ20', expiry_date: '2027-01-01', current_amount: 40, received_date: '2025-01-01' }),
      standard({ id: 'natural-10', internal_id: 'CZ10', expiry_date: '2027-01-01', current_amount: 40 }),
      standard({ id: 'natural-2', internal_id: 'CZ2', expiry_date: '2027-01-01', current_amount: 40 }),
      standard({ id: 'unknown', internal_id: 'CZ1', expiry_date: '' })
    ], today);

    assert.deepEqual(sorted.map(item => item.id), [
      'natural-2', 'natural-10', 'newer', 'more', 'late', 'unknown'
    ]);
  });

  it('puts non-candidates behind every candidate even if they expire earlier', () => {
    const available = standard({ id: 'available', expiry_date: '2028-01-01' });
    const inUse = standard({ id: 'in-use', expiry_date: '2026-08-01', status: 'IN_USE' });
    const pending = standard({ id: 'pending', expiry_date: '2026-09-01', has_pending_request: true });

    assert.equal(sortStandardsByFefo([inUse, pending, available], today)[0].id, 'available');
  });

  it('selects CZ26 as the next FEFO lot when the earlier CZ05 lot is already in use', () => {
    const cz05 = standard({
      id: 'cz05',
      internal_id: 'CZ05',
      name: 'Perchlorates (ClO4-) 1000 mg/l in H2O for IC',
      expiry_date: '2027-01-12',
      status: 'IN_USE',
      current_holder: 'Vandi Nguyen'
    });
    const cz26 = standard({
      id: 'cz26',
      internal_id: 'CZ26',
      name: 'Perchlorates (ClO4-) 1000 mg/l in H2O for IC',
      expiry_date: '2028-02-09',
      current_amount: 80
    });

    assert.equal(getFefoPriorityStandard(cz05, [cz05, cz26], today)?.id, 'cz26');
    assert.equal(isFefoPriorityStandard(cz26, [cz05, cz26], today), true);
  });

  it('keeps the current lot as priority when the detail-page cache only contains a later sibling', () => {
    const current = standard({ id: 'current', internal_id: 'CZ01', expiry_date: '2027-01-01' });
    const sibling = standard({ id: 'sibling', internal_id: 'CZ02', expiry_date: '2028-01-01' });

    assert.equal(getFefoPriorityStandard(current, [sibling], today)?.id, 'current');
    assert.equal(isFefoPriorityStandard(current, [sibling], today), true);
    assert.equal(isFefoPriorityStandard(sibling, [current, sibling], today), false);
  });

  it('uses the fresh current lot instead of a stale cached copy with the same id', () => {
    const current = standard({ id: 'current', internal_id: 'CZ01', expiry_date: '2027-01-01' });
    const staleCurrent = standard({
      id: 'current',
      internal_id: 'CZ01',
      expiry_date: '2027-01-01',
      status: 'IN_USE'
    });
    const sibling = standard({ id: 'sibling', internal_id: 'CZ02', expiry_date: '2028-01-01' });

    assert.equal(getFefoPriorityStandard(current, [staleCurrent, sibling], today)?.id, 'current');
  });

  it('normalizes names and finds one priority across the complete same-name group', () => {
    const current = standard({ id: 'later', name: '  Chất   chuẩn Đối chiếu ', expiry_date: '2028-01-01' });
    const priority = standard({ id: 'priority', name: 'chat chuan doi chieu', expiry_date: '2027-01-01' });
    const unrelated = standard({ id: 'other', name: 'Other', expiry_date: '2026-01-01' });
    const group = [current, priority, unrelated];

    assert.equal(normalizeStandardName(current.name), 'chat chuan doi chieu');
    assert.equal(getFefoPriorityStandard(current, group, today)?.id, 'priority');
    assert.equal(getFefoPredecessor(current, group, today)?.id, 'priority');
    assert.equal(isFefoPriorityStandard(priority, group, today), true);
  });
});
