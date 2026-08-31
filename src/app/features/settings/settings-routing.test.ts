import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { routes } from '../../app.routes';

const notificationServiceSource = readFileSync(new URL('../../core/services/notification.service.ts', import.meta.url), 'utf8');
const notificationSettingsSource = readFileSync(new URL('./pages/account-notifications-settings.component.ts', import.meta.url), 'utf8');
const appIndexSource = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');

function route(path: string) {
  const match = routes.find(item => item.path === path);
  assert.ok(match, `Không tìm thấy route /${path}`);
  return match;
}

function settingsChild(path: string) {
  const settings = route('settings');
  const match = settings.children?.find(item => item.path === path);
  assert.ok(match, `Không tìm thấy route /settings/${path}`);
  return match;
}

describe('Settings routing contract', () => {
  it('keeps the Settings Center as the canonical entry point and preserves /config', () => {
    const settings = route('settings');
    const legacyConfig = route('config');

    assert.ok(settings.loadComponent);
    assert.ok(settings.canActivate);
    assert.equal(legacyConfig.redirectTo, 'settings/account/profile');
    assert.equal(legacyConfig.pathMatch, 'full');
    assert.match(appIndexSource, /<base href="\/">/);
  });

  it('allows authenticated account pages without manager-only metadata', () => {
    for (const path of ['account/profile', 'account/security', 'account/notifications', 'account/privacy']) {
      const child = settingsChild(path);
      assert.ok(child.loadComponent, `/settings/${path} phải lazy-load component`);
      assert.equal(child.data?.['role'], undefined);
      assert.equal(child.data?.['permission'], undefined);
      assert.equal(child.canActivate, undefined);
    }
  });

  it('protects every administrative Settings page with the manager guard', () => {
    const managerOnlyPaths = [
      'system',
      'data/master',
      'data/backups',
      'data/lifecycle',
      'access/users',
      'access/roles',
      'policies/consumption',
      'diagnostics',
    ];

    for (const path of managerOnlyPaths) {
      const child = settingsChild(path);
      assert.ok(child.loadComponent, `/settings/${path} phải lazy-load component`);
      assert.ok(child.canActivate?.length, `/settings/${path} phải có guard`);
      assert.equal(child.data?.['role'], 'manager');
    }
  });

  it('keeps the Settings aliases and data hub redirects deterministic', () => {
    assert.equal(settingsChild('').redirectTo, 'account/profile');
    assert.equal(settingsChild('account').redirectTo, 'account/profile');
    assert.equal(settingsChild('data').redirectTo, 'data/master');
    assert.equal(settingsChild('access').redirectTo, 'access/users');
  });

  it('supports a persistent per-user device opt-out for push notifications', () => {
    assert.match(notificationServiceSource, /disableCurrentDevicePushNotifications\(\)/);
    assert.match(notificationServiceSource, /arrayRemove\(token\)/);
    assert.match(notificationServiceSource, /lims_fcm_disabled_\$\{userId\}/);
    assert.match(notificationServiceSource, /if \(!force && localStorage\.getItem\(this\.pushOptOutStorageKey\(user\.uid\)\) === '1'\)/);
    assert.match(notificationSettingsSource, /Tắt trên thiết bị này/);
    assert.match(notificationSettingsSource, /disableNotifications\(\)/);
  });
});
