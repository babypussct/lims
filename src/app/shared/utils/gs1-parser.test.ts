import assert from 'node:assert/strict';
import test from 'node:test';
import { generateHybridGs1Code, parseGs1Data } from './gs1-parser';
import { normalizeInventoryItem } from './utils';

test('keeps GTIN and lot parsing without exposing an inventory expiry field', () => {
  const parsed = parseGs1Data('01089345678901281727010110LOT-001\x1D');

  assert.equal(parsed.isGs1, true);
  assert.equal(parsed.gtin, '08934567890128');
  assert.equal(parsed.lotNumber, 'LOT-001');
  assert.equal(Object.prototype.hasOwnProperty.call(parsed, 'expiryDate'), false);
});

test('hybrid GS1 generation keeps identity and lot but omits expiry AI', () => {
  const code = generateHybridGs1Code({
    id: 'acetonitrile',
    gtin: '8934567890128',
    lotNumber: 'LOT-001',
    expiryDate: '2027-01-01'
  });

  assert.match(code, /\/01\/08934567890128\/10\/LOT-001/);
  assert.match(code, /240=acetonitrile/);
  assert.doesNotMatch(code, /(?:^|[?&])17=/);
});

test('inventory normalization strips a legacy expiry field before persistence', () => {
  const normalized = normalizeInventoryItem({
    id: 'acetonitrile',
    name: 'Acetonitrile',
    stock: 10,
    unit: 'ml',
    expiryDate: '2027-01-01'
  });

  assert.equal(Object.prototype.hasOwnProperty.call(normalized, 'expiryDate'), false);
});
