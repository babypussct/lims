import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('auth/public shared UI primitive integration', () => {
  it('uses the shared button for the forbidden-page recovery action', () => {
    const source = read('./forbidden.component.ts');
    assert.match(source, /AppButtonComponent/);
    assert.match(source, /<app-button\b[^>]*\[fullWidth\]="true"/);
    assert.match(source, /title|Chưa có quyền truy cập/);
    assert.doesNotMatch(source, /fa-times/);
  });

  it('uses shared page headers and buttons for public policy pages', () => {
    for (const file of ['../public/privacy-policy.component.ts', '../public/terms-of-service.component.ts', '../public/changelog.component.ts']) {
      const source = read(file);
      assert.match(source, /AppButtonComponent/);
      assert.match(source, /AppPageHeaderComponent/);
      assert.match(source, /<app-page-header\b/);
      assert.match(source, /pageHeaderActions/);
      assert.match(source, /<app-button\b/);
    }
  });

  it('keeps the mobile QR scanner dark-mode safe while using shared confirmation actions', () => {
    const source = read('./mobile-qr-login.component.ts');
    assert.match(source, /AppButtonComponent/);
    assert.match(source, /dark:bg-slate-950/);
    assert.match(source, /<app-button\b[^>]*\(click\)="approve\(\)"/);
    assert.match(source, /<app-button\b[^>]*\(click\)="cancel\(\)"/);
  });
});
