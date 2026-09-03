const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

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

test('keeps Git metadata available to the Vercel ignore command', () => {
  const vercelIgnore = readFileSync(join(__dirname, '..', '.vercelignore'), 'utf8');
  const activeRules = vercelIgnore
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  assert.equal(activeRules.includes('.git/'), false);
  assert.equal(activeRules.includes('.git'), false);
});
