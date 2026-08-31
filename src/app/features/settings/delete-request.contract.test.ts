import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('../../../../api/account/delete-request.ts', import.meta.url), 'utf8');

describe('account anonymization contract', () => {
  it('does not modify Firestore when Firebase Auth anonymization fails', () => {
    const authUpdateBlock = source.match(/try \{\s*await auth\.updateUser[\s\S]*?\n    \} catch \(authErr: any\) \{[\s\S]*?\n    \}/)?.[0] || '';
    assert.match(authUpdateBlock, /status\(502\)/);
    assert.match(authUpdateBlock, /AUTH_UPDATE_FAILED/);
    assert.doesNotMatch(authUpdateBlock, /userRef\.update/);
  });

  it('rolls back Firebase Auth when the Firestore profile update fails', () => {
    assert.match(source, /const originalAuthProfile =/);
    assert.match(source, /await userRef\.update\(/);
    assert.match(source, /Auth rollback failed after Firestore error/);
    assert.match(source, /FIRESTORE_UPDATE_FAILED/);
  });

  it('does not report a successful anonymization after a partial failure', () => {
    const failureSection = source.match(/\} catch \(firestoreErr: any\) \{[\s\S]*?\n    \}\n\n    console\.log/)?.[0] || '';
    assert.match(failureSection, /status\(502\)/);
    assert.doesNotMatch(failureSection, /status\(200\)/);
  });

  it('uses the same default artifact namespace as the client and other APIs', () => {
    assert.match(source, /process\.env\['APP_ID'\]\s*\|\|\s*'lims-cloud-fixed'/);
    assert.doesNotMatch(source, /\|\|\s*'default'/);
  });
});
