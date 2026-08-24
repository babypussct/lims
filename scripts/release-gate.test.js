const test = require('node:test');
const assert = require('node:assert/strict');

const {
  parseAheadBehind,
  splitUpstream,
  evaluateReleaseGate
} = require('./release-gate');

function state(overrides = {}) {
  return {
    branch: 'main',
    head: 'aaaaaaaa',
    upstream: 'origin/main',
    upstreamHead: 'bbbbbbbb',
    remoteHead: 'bbbbbbbb',
    ahead: 1,
    behind: 0,
    dirty: [],
    conflicts: [],
    ...overrides
  };
}

test('parses git ahead/behind counts', () => {
  assert.deepEqual(parseAheadBehind('3\t2'), { ahead: 3, behind: 2 });
  assert.deepEqual(splitUpstream('origin/feature/release'), {
    remote: 'origin',
    branch: 'feature/release'
  });
});

test('prepush accepts a clean branch that is only ahead of a fresh upstream', () => {
  assert.deepEqual(evaluateReleaseGate('prepush', state()), []);
});

test('prepush blocks dirty working trees and stale remote tracking state', () => {
  const errors = evaluateReleaseGate('prepush', state({
    dirty: [' M package.json'],
    remoteHead: 'cccccccc'
  }));

  assert.equal(errors.some(error => error.includes('Working tree chưa sạch')), true);
  assert.equal(errors.some(error => error.includes('Remote đã thay đổi')), true);
});

test('predeploy requires main, a clean synchronized branch and the exact pushed commit', () => {
  const cleanPushedState = state({
    head: 'aaaaaaaa',
    upstreamHead: 'aaaaaaaa',
    remoteHead: 'aaaaaaaa',
    ahead: 0,
    behind: 0
  });

  assert.deepEqual(evaluateReleaseGate('predeploy', cleanPushedState), []);
});

test('predeploy blocks an unpushed commit or a non-production branch', () => {
  const errors = evaluateReleaseGate('predeploy', state({
    branch: 'feature/release',
    remoteHead: 'bbbbbbbb'
  }));

  assert.equal(errors.some(error => error.includes('Chỉ được deploy production từ branch main')), true);
  assert.equal(errors.some(error => error.includes('HEAD chưa đồng bộ upstream')), true);
  assert.equal(errors.some(error => error.includes('HEAD local chưa trùng')), true);
});
