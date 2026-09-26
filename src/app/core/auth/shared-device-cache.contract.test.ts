import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const firebaseSource = readFileSync(resolve(process.cwd(), 'src/app/core/services/firebase.service.ts'), 'utf8');
const authSource = readFileSync(resolve(process.cwd(), 'src/app/core/services/auth.service.ts'), 'utf8');

test('Firestore documents are memory-only in every device mode', () => {
  assert.match(firebaseSource, /localCache:\s*memoryLocalCache\(\)/);
  assert.doesNotMatch(firebaseSource, /persistentLocalCache|persistentMultipleTabManager/);
});

test('shared-device logout terminates Firestore and clears historical IndexedDB persistence', () => {
  assert.match(firebaseSource, /clearPersistentCacheForSharedDevice[\s\S]*terminate\(this\.db\)[\s\S]*clearIndexedDbPersistence\(this\.db\)/);
  assert.match(authSource, /if \(isSharedDevice\)[\s\S]*clearPersistentCacheForSharedDevice\(\)/);
  assert.match(authSource, /window\.location\.replace\('\/'\)/);
});
