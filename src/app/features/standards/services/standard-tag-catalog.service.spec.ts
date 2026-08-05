import assert from 'node:assert/strict';
import test from 'node:test';
import {
  VLAT_11669_CHEMICAL_METHOD_TAGS,
  VLAT_11669_SOURCE,
} from './vlat-1-1669-487-20251015-chemical-method-tags';
import { buildTagKey, deriveMethodSeries } from './standard-tag.utils';

test('VLAT catalog contains only the reviewed 119 chemical methods', () => {
  assert.equal(VLAT_11669_CHEMICAL_METHOD_TAGS.length, 119);
  const counts = new Map<string, number>();
  const keys = new Set<string>();
  for (const item of VLAT_11669_CHEMICAL_METHOD_TAGS) {
    assert.match(item.methodCode || '', /^NAFI6\/H-\d+\.\d+$/);
    assert.equal(item.origin, 'ACCREDITATION_SCOPE');
    assert.equal(item.templateKind, 'TEST_METHOD');
    assert.equal(item.name, item.methodCode);
    assert.equal(item.code, item.methodCode);
    assert.equal(item.sourceDecision, '487/QĐ-AOSC');
    assert.equal(item.sourceLabCode, 'VLAT-1.1669');
    assert.equal(item.sourceSha256, VLAT_11669_SOURCE.sourceSha256);
    assert.equal(item.locked, true);
    assert.ok(item.deviceCodes);
    assert.ok(item.deviceCodes!.length <= 5);
    const key = buildTagKey('CUSTOM', item.id);
    assert.equal(keys.has(key), false);
    keys.add(key);
    const series = deriveMethodSeries(item.methodCode!);
    counts.set(series, (counts.get(series) || 0) + 1);
  }
  assert.deepEqual(Object.fromEntries(counts), {
    'H-1': 15,
    'H-2': 4,
    'H-3': 1,
    'H-5': 5,
    'H-6': 11,
    'H-7': 16,
    'H-8': 47,
    'H-9': 17,
    'H-13': 3,
  });
});

test('VLAT catalog keeps the reviewed device overrides as secondary metadata', () => {
  const byCode = new Map(VLAT_11669_CHEMICAL_METHOD_TAGS.map(item => [item.methodCode, item]));
  assert.deepEqual(byCode.get('NAFI6/H-8.41')?.deviceCodes, ['LCMSMS']);
  assert.deepEqual(byCode.get('NAFI6/H-9.21')?.deviceCodes, ['GCMSMS']);
  assert.deepEqual(byCode.get('NAFI6/H-9.22')?.deviceCodes, ['GCECD']);
  assert.deepEqual(byCode.get('NAFI6/H-9.10')?.deviceCodes, ['GCHRMS']);
  assert.deepEqual(byCode.get('NAFI6/H-7.22')?.deviceCodes, ['HPLCDAD']);
  assert.deepEqual(byCode.get('NAFI6/H-7.17')?.deviceCodes, ['HPLCPDA']);
  assert.equal(byCode.has('NAFI6/H-8.15'), false);
  assert.deepEqual(byCode.get('NAFI6/H-8.31')?.deviceCodes, undefined);
});
