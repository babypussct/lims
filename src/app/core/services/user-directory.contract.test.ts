import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const source = readFileSync(resolve(process.cwd(), 'src/app/core/services/state.service.ts'), 'utf8');

test('avatar directory pages through all users instead of silently capping at 100', () => {
  const start = source.indexOf('ensureUserInfoCacheListener(): void');
  const end = source.indexOf('// ─── CONFIG:', start);
  const block = source.slice(start, end);
  assert.match(block, /USER_DIRECTORY_PAGE_SIZE/);
  assert.match(block, /orderBy\(documentId\(\)\)/);
  assert.match(block, /startAfter\(cursor\)/);
  assert.match(block, /do \{[\s\S]*\} while \(cursor\)/);
  assert.doesNotMatch(block, /limit\(100\)/);
});
