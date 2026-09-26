const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const test = require('node:test');

test('iOS declares one non-empty camera usage description', () => {
  const plist = readFileSync(resolve(process.cwd(), 'ios/App/App/Info.plist'), 'utf8');
  const matches = [...plist.matchAll(
    /<key>\s*NSCameraUsageDescription\s*<\/key>\s*<string>([^<]*)<\/string>/g
  )];
  assert.equal(matches.length, 1);
  assert.ok(matches[0][1].trim().length > 0);
});
