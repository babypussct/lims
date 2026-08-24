const test = require('node:test');
const assert = require('node:assert/strict');

const {
  parseNpmPackageManager,
  parseNodeEngine,
  evaluateRuntimePolicy
} = require('./verify-runtime');

function policy(overrides = {}) {
  return {
    packageManager: 'npm@10.9.8',
    nodeEngine: '22.x',
    nvmrc: '22',
    actualNode: '22.23.2',
    actualNpm: '10.9.8',
    ...overrides
  };
}

test('parses exact npm and Node repository policies', () => {
  assert.equal(parseNpmPackageManager('npm@10.9.8'), '10.9.8');
  assert.deepEqual(parseNodeEngine('22.x'), { major: 22, minor: null });
  assert.deepEqual(parseNodeEngine('22.23.x'), { major: 22, minor: 23 });
});

test('accepts runtime matching package.json and .nvmrc', () => {
  assert.deepEqual(evaluateRuntimePolicy(policy()), []);
});

test('blocks a Node runtime outside engines.node', () => {
  const errors = evaluateRuntimePolicy(policy({ actualNode: '20.19.5' }));
  assert.equal(errors.some(error => error.includes('không khớp engines.node=22.x')), true);
});

test('blocks npm drift from packageManager', () => {
  const errors = evaluateRuntimePolicy(policy({ actualNpm: '11.6.0' }));
  assert.equal(errors.some(error => error.includes('cần 10.9.8')), true);
});

test('blocks repository Node policy drift between .nvmrc and package.json', () => {
  const errors = evaluateRuntimePolicy(policy({ nvmrc: '20' }));
  assert.equal(errors.some(error => error.includes('.nvmrc đang dùng Node 20')), true);
});

test('rejects packageManager that does not pin an exact npm version', () => {
  const errors = evaluateRuntimePolicy(policy({ packageManager: 'npm@10' }));
  assert.equal(errors.some(error => error.includes('packageManager phải có dạng npm@x.y.z')), true);
});
