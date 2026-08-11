import assert from 'node:assert/strict';
import test from 'node:test';
import { getReleaseOrder, mergeReleaseDocs, selectReleaseFallback } from './changelog-fallback';

test('sorts public fallback releases by semantic version order', () => {
  const result = selectReleaseFallback([
    { version: 'v26.08.11-b03', date: '11/08/2026', title: 'Hiện tại' },
    { version: 'v26.08.11-b02', date: '11/08/2026', title: 'Trước đó' },
    { version: 'v26.08.07-b02', date: '07/08/2026', title: 'Cũ hơn' }
  ]);

  assert.deepEqual(result.map(item => item.version), [
    'v26.08.11-b03',
    'v26.08.11-b02',
    'v26.08.07-b02'
  ]);
  assert.equal(getReleaseOrder('v26.08.11-b03') > getReleaseOrder('v26.08.11-b02'), true);
});

test('accepts an object payload and keeps the first copy of a version', () => {
  const result = selectReleaseFallback({
    releases: [
      { version: '26.08.11-b04', title: 'Nội dung mới', features: ['A'] },
      { version: 'v26.08.11-b04', title: 'Bản trùng cũ', features: ['B'] }
    ]
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].version, 'v26.08.11-b04');
  assert.equal(result[0].title, 'Nội dung mới');
  assert.deepEqual(result[0].features, ['A']);
});

test('limits modal fallback to the requested number of newest releases', () => {
  const result = selectReleaseFallback([
    { version: 'v26.08.11-b03', title: 'Mới nhất' },
    { version: 'v26.08.11-b02', title: 'Thứ hai' },
    { version: 'v26.08.11-b01', title: 'Thứ ba' }
  ], 2);

  assert.deepEqual(result.map(item => item.title), ['Mới nhất', 'Thứ hai']);
});

test('merges a stale online history with the packaged current release', () => {
  const result = mergeReleaseDocs(
    [{ version: 'v26.08.07-b02', date: '07/08/2026', title: 'Đã có trên mạng' }],
    [{ version: 'v26.08.11-b04', date: '11/08/2026', title: 'Bản hiện tại' }],
    3
  );

  assert.deepEqual(result.map(item => item.version), ['v26.08.11-b04', 'v26.08.07-b02']);
});
