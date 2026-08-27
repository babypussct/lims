const test = require('node:test');
const assert = require('node:assert/strict');

const {
  evaluateReleaseDiscipline,
  isProductionRelevantPath,
  resolveBaseRef
} = require('./release-discipline');

test('classifies runtime and infrastructure files but ignores docs, workflow and tests', () => {
  assert.equal(isProductionRelevantPath('src/app/app.component.ts'), true);
  assert.equal(isProductionRelevantPath('api/notifications.ts'), true);
  assert.equal(isProductionRelevantPath('firestore.rules'), true);
  assert.equal(isProductionRelevantPath('vercel.json'), true);
  assert.equal(isProductionRelevantPath('tsconfig.app.json'), true);
  assert.equal(isProductionRelevantPath('index.html'), true);
  assert.equal(isProductionRelevantPath('scripts/backfill-daily-checklists.ts'), true);
  assert.equal(isProductionRelevantPath('src/app/app.component.test.ts'), false);
  assert.equal(isProductionRelevantPath('docs/plan.md'), false);
  assert.equal(isProductionRelevantPath('.github/workflows/release-gate.yml'), false);
  assert.equal(isProductionRelevantPath('scripts/release-gate.js'), false);
});

test('blocks production changes without a new version and release notes', () => {
  const result = evaluateReleaseDiscipline({
    changedFiles: ['src/app/app.component.ts'],
    baseVersion: '26.08.26-b04',
    headVersion: '26.08.26-b04',
    releaseNotesChanged: false
  });

  assert.equal(result.errors.length, 2);
});

test('accepts production changes covered by one prepared release', () => {
  const result = evaluateReleaseDiscipline({
    changedFiles: ['src/app/app.component.ts', 'release-notes.json', 'package.json'],
    baseVersion: '26.08.26-b04',
    headVersion: '26.08.27-b01',
    releaseNotesChanged: true
  });

  assert.deepEqual(result.errors, []);
});

test('allows docs, CI and tests without creating a release', () => {
  const result = evaluateReleaseDiscipline({
    changedFiles: ['docs/runbook.md', '.github/workflows/release-gate.yml', 'src/app/app.component.test.ts'],
    baseVersion: '26.08.26-b04',
    headVersion: '26.08.26-b04',
    releaseNotesChanged: false
  });

  assert.deepEqual(result, { relevantFiles: [], errors: [] });
});

test('resolves explicit base before environment and upstream default', () => {
  assert.equal(resolveBaseRef(['--base=abc'], { RELEASE_BASE_REF: 'def' }), 'abc');
  assert.equal(resolveBaseRef([], { RELEASE_BASE_REF: 'def' }), 'def');
  assert.equal(resolveBaseRef([], {}), '@{u}');
});
