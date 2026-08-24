const test = require('node:test');
const assert = require('node:assert/strict');

const {
  selectReleaseVersion,
  mergeReleaseHistory
} = require('./release-pipeline');

const notes = {
  title: 'Release mới',
  highlights: ['Điểm nổi bật'],
  features: ['Tính năng'],
  improvements: ['Cải tiến'],
  fixes: ['Sửa lỗi']
};

test('re-running sync for the same prepared release does not bump again', () => {
  const result = selectReleaseVersion({
    currentVersion: '26.08.24-b04',
    headVersion: '26.08.24-b04',
    releaseNotes: notes,
    existingHistory: [{ version: 'v26.08.24-b04', ...notes }],
    now: new Date(2026, 7, 24, 12, 0, 0)
  });

  assert.equal(result.version, '26.08.24-b04');
  assert.equal(result.bumped, false);
});

test('an uncommitted version bump is reused after a partial release sync', () => {
  const result = selectReleaseVersion({
    currentVersion: '26.08.24-b05',
    headVersion: '26.08.24-b04',
    releaseNotes: notes,
    existingHistory: [],
    now: new Date(2026, 7, 24, 12, 0, 0)
  });

  assert.equal(result.version, '26.08.24-b05');
  assert.equal(result.bumped, false);
});

test('new release notes bump exactly one build number', () => {
  const result = selectReleaseVersion({
    currentVersion: '26.08.24-b04',
    headVersion: '26.08.24-b04',
    releaseNotes: notes,
    existingHistory: [{ version: 'v26.08.24-b04', title: 'Release cũ', highlights: [], features: [], improvements: [], fixes: [] }],
    now: new Date(2026, 7, 24, 12, 0, 0)
  });

  assert.equal(result.version, '26.08.24-b05');
  assert.equal(result.bumped, true);
});

test('release history preserves prior current releases and enriches sparse duplicates', () => {
  const current = { version: 'v26.08.24-b05', date: '24/8/2026', ...notes };
  const existing = [
    { version: 'v26.08.24-b04', date: '24/8/2026', title: 'Cập nhật hệ thống', highlights: [], features: [], improvements: [], fixes: [] },
    { version: 'v26.08.24-b02', date: '24/8/2026', title: 'Excel', highlights: ['Xem Excel'], features: [], improvements: [], fixes: [] }
  ];
  const legacy = [
    { version: 'v26.08.24-b04', date: '24/8/2026', title: 'Sửa changelog', highlights: ['Tự phục hồi changelog'], features: [], improvements: [], fixes: ['Không còn bản ghi rỗng'] },
    { version: 'v26.08.23-b01', date: '23/8/2026', title: 'Release trước', highlights: [], features: [], improvements: [], fixes: [] }
  ];

  const result = mergeReleaseHistory(current, existing, legacy);

  assert.deepEqual(result.map(item => item.version), [
    'v26.08.24-b05',
    'v26.08.24-b04',
    'v26.08.24-b02',
    'v26.08.23-b01'
  ]);
  assert.equal(result[1].title, 'Sửa changelog');
  assert.deepEqual(result[1].fixes, ['Không còn bản ghi rỗng']);
});

test('release history can recover a release that only exists in an older Git snapshot', () => {
  const current = { version: 'v26.08.24-b05', date: '24/8/2026', ...notes };
  const currentHistory = [
    { version: 'v26.08.24-b04', date: '24/8/2026', title: 'Sửa changelog', highlights: [], features: [], improvements: [], fixes: ['Đã sửa'] }
  ];
  const olderGitSnapshot = [
    { version: 'v26.08.24-b02', date: '24/8/2026', title: 'Excel', highlights: ['Xem Excel'], features: [], improvements: [], fixes: [] }
  ];

  const result = mergeReleaseHistory(current, currentHistory, olderGitSnapshot);

  assert.deepEqual(result.map(item => item.version), [
    'v26.08.24-b05',
    'v26.08.24-b04',
    'v26.08.24-b02'
  ]);
});
