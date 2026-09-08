import assert from 'node:assert/strict';
import test from 'node:test';
import { archiveExportRows, uniqueSheetName } from './excel-export';
import { collectExportPages } from '../../core/services/export-history';

test('archive preserves nested and long values in reconstructible chunks', () => {
  const nested = { sample: { label: 'A' }, long: 'x'.repeat(65000) };
  const result = archiveExportRows([{ id: 'record-1', nested, timestamp: { toDate: () => new Date('2026-09-08T00:00:00Z') } }]);
  assert.equal(result.rows[0]['timestamp'], '2026-09-08T00:00:00.000Z');
  assert.equal(result.details.length, 3);
  assert.ok(result.details.every(part => part.ID === 'record-1' && part.JSON.length <= 30000));
  assert.deepEqual(JSON.parse(result.details.map(part => part.JSON).join('')), nested);
});

test('sheet names are valid and remain unique after sanitizing and truncation', () => {
  const first = uniqueSheetName('SOP_' + 'A'.repeat(40) + ':/*?', []);
  const second = uniqueSheetName('SOP_' + 'A'.repeat(40) + ':/*?', [first.toLowerCase()]);
  assert.equal(first.length, 31); assert.equal(second.length, 31); assert.notEqual(first, second);
  assert.equal(uniqueSheetName('[]:*?/\\', []), 'Sheet');
});

test('export accumulates all pages and never returns partial data after a failed page', async () => {
  assert.deepEqual(await collectExportPages<number, number>(async cursor => cursor === null
    ? { items: [1, 2], cursor: 1, hasMore: true }
    : { items: [3], cursor: 2, hasMore: false }), [1, 2, 3]);
  await assert.rejects(collectExportPages<number, number>(async cursor => {
    if (cursor !== null) throw new Error('Page failed');
    return { items: [1], cursor: 1, hasMore: true };
  }), /Page failed/);
  await assert.rejects(collectExportPages(async () => ({ items: [], cursor: null, hasMore: true })), /đầy đủ/);
});
