import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

test('activity log list access is not granted to every signed-in user', () => {
  const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');
  const marker = 'match /artifacts/{appId}/logs/{logId} {';
  const start = rules.indexOf(marker);
  assert.notEqual(start, -1, 'global activity-log rule block must exist');

  const block = rules.slice(start, rules.indexOf('\n    }', start) + 6);
  assert.doesNotMatch(block, /allow list:\s*if\s+isSignedIn\(\)\s*;/);
  assert.match(block, /allow list:\s*if\s+hasPermission\(appId,\s*'report_view'\)/);
  assert.match(
    block,
    /isCurrentActorName\(appId,\s*resource\.data\.get\('user',\s*''\)\)/
  );
});

test('non-report activity feed does not retain the global listener or its caches', () => {
  const stateSource = readFileSync(
    resolve(process.cwd(), 'src/app/core/services/state.service.ts'),
    'utf8'
  );

  assert.match(
    stateSource,
    /ensureLogsListener\(\): void \{\s*if \(this\.logsSub \|\| !this\.auth\.currentUser\(\) \|\| !this\.auth\.canViewReports\(\)\) return;/
  );
  assert.match(
    stateSource,
    /if \(this\.logsSub\) this\.logsSub\(\);\s*this\.clearGlobalActivityLogCache\(\);/
  );
  assert.match(stateSource, /this\.deltaSync\.destroySingleton\(keys\.cacheKey\);/);
  assert.match(stateSource, /this\.deltaSync\.clearCache\(keys\.cacheKey, keys\.cursorKey\);/);
});
