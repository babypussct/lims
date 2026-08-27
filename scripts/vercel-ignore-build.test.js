const test = require('node:test');
const assert = require('node:assert/strict');

const { shouldIgnoreBuild } = require('./vercel-ignore-build');

test('ignores commits limited to documentation, CI and tests', () => {
  assert.equal(shouldIgnoreBuild([
    'DEPLOYMENT.md',
    '.github/workflows/release-gate.yml',
    'src/app/app.component.test.ts'
  ]), true);
});

test('builds commits containing application or production configuration changes', () => {
  assert.equal(shouldIgnoreBuild(['DEPLOYMENT.md', 'src/app/app.component.ts']), false);
  assert.equal(shouldIgnoreBuild(['vercel.json']), false);
  assert.equal(shouldIgnoreBuild(['firestore.rules']), false);
});
