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

      // Public two-layer shell and borderless page header contract
      assert.match(source, /p-4 md:p-6/);
      assert.match(source, /max-w-5xl/);
      assert.doesNotMatch(source, /<app-page-header[^>]*border/);
      assert.doesNotMatch(source, /<app-page-header[^>]*shadow/);
    }

    const appComponent = read('../../app.component.ts');
    assert.match(appComponent, /data-public-scroll-owner/);
  });

  it('keeps the mobile QR scanner dark-mode safe while using shared confirmation actions', () => {
    const source = read('./mobile-qr-login.component.ts');
    assert.match(source, /AppButtonComponent/);
    assert.match(source, /dark:bg-slate-950/);
    assert.match(source, /<app-button\b[^>]*\(click\)="approve\(\)"/);
    assert.match(source, /<app-button\b[^>]*\(click\)="cancel\(\)"/);
  });

  it('uses a single unified segmented control (radiogroup) for device mode in login', () => {
    const source = read('./login.component.ts');

    // Contract: Encapsulated into a single ng-template and rendered at 3 mutually exclusive tab outlets
    assert.match(source, /<ng-template\s+#deviceModeSwitch>/, 'Login must declare reusable <ng-template #deviceModeSwitch>');
    const outletMatches = source.match(/ngTemplateOutlet="deviceModeSwitch"/g);
    assert.equal(outletMatches?.length, 3, 'deviceModeSwitch should be rendered in 3 tabs (Google, Password, QR)');

    // Contract: Exactly one radiogroup instance and no boolean switch role
    const radiogroupMatches = source.match(/role="radiogroup"/g);
    assert.equal(radiogroupMatches?.length, 1, 'Login should contain exactly 1 radiogroup instance');
    assert.doesNotMatch(source, /role="switch"/, 'Device mode must not use switch role');

    // Contract: The thumb must have a real width and align to the track padding.
    assert.match(source, /device-mode-thumb/);
    assert.match(source, /width:\s*calc\(50%\s*-\s*0\.5rem\)/);
    assert.match(source, /translateX\(100%\)/);
    assert.doesNotMatch(source, /calc\(50%-/);
    assert.match(source, /device-mode-option-label/);
    assert.match(source, /@media\s*\(max-width:\s*360px\)/);
    assert.doesNotMatch(source, /<span class="truncate tracking-tight">/);

    // Contract: Distinct icons for shared vs personal
    assert.match(source, /fa-users\b/);
    assert.match(source, /fa-user-lock\b/);

    // Contract: Exactly 1 session-help id (no duplicate HTML ids)
    const helpIdMatches = source.match(/id="session-help"/g);
    assert.equal(helpIdMatches?.length, 1, 'Login must have at most 1 element with id="session-help"');

    // Contract: Uses authoritative selectDeviceMode API without legacy toggle duplication
    assert.match(source, /selectDeviceMode\(/);
    assert.doesNotMatch(source, /toggleSharedDevice\(/);
    assert.doesNotMatch(source, /toggleRememberSession\(/);
  });
});
