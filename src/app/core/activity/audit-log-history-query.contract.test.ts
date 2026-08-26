import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync('src/app/core/services/audit-log.service.ts', 'utf8');

test('audit history query uses the deployed BUSINESS/timestamp-desc index while returning chronological rows', () => {
  const method = source.match(/async getLogsByDateRange\([\s\S]*?\n  }\n}/)?.[0] ?? '';

  assert.match(method, /where\('auditClass',\s*'==',\s*'BUSINESS'\)/);
  assert.match(method, /where\('timestamp',\s*'>=',\s*start\)/);
  assert.match(method, /where\('timestamp',\s*'<=',\s*end\)/);
  assert.match(method, /orderBy\('timestamp',\s*'desc'\)/);
  assert.doesNotMatch(method, /orderBy\('timestamp',\s*'asc'\)/);
  assert.match(method, /\.sort\(\(a, b\) => \(timestampToMillis\(a\.timestamp\) \?\? 0\) - \(timestampToMillis\(b\.timestamp\) \?\? 0\)\)/);
});
