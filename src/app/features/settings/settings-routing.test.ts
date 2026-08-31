import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { routes } from '../../app.routes';
import { calculateCenteredScrollLeft, calculateVisibleScrollTop } from './settings-scroll.utils';

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

  it('exhaustively maps all user roles to friendly labels across Settings and Auth', () => {
    const authServiceSource = readFileSync(new URL('../../core/services/auth.service.ts', import.meta.url), 'utf8');
    const settingsShellSource = readFileSync(new URL('./settings-shell.component.ts', import.meta.url), 'utf8');
    const profileSettingsSource = readFileSync(new URL('./pages/account-profile-settings.component.ts', import.meta.url), 'utf8');

    assert.match(authServiceSource, /ROLE_LABELS: Record<UserProfile\['role'\], string>/);
    assert.match(authServiceSource, /manager: 'Quản trị viên'/);
    assert.match(authServiceSource, /staff: 'Nhân viên'/);
    assert.match(authServiceSource, /viewer: 'Chỉ xem'/);
    assert.match(authServiceSource, /pending: 'Chờ phê duyệt'/);

    // Both settings views must use the unified role mapping
    assert.match(settingsShellSource, /getUserRoleLabel/);
    assert.match(profileSettingsSource, /getUserRoleLabel/);
    assert.doesNotMatch(settingsShellSource, /role === 'manager' \? 'Quản trị viên' : 'Nhân viên'/);
    assert.doesNotMatch(profileSettingsSource, /role === 'manager' \? 'Quản trị viên' : 'Nhân viên'/);
  });

  it('tracks and automatically scrolls active navigation items into view on mobile and desktop', () => {
    const settingsShellSource = readFileSync(new URL('./settings-shell.component.ts', import.meta.url), 'utf8');

    assert.match(settingsShellSource, /#mobileNavContainer/);
    assert.match(settingsShellSource, /#desktopNavContainer/);
    assert.match(settingsShellSource, /mobileNavContainer = viewChild/);
    assert.match(settingsShellSource, /desktopNavContainer = viewChild/);
    assert.match(settingsShellSource, /scrollActiveIntoView/);
    assert.match(settingsShellSource, /NavigationEnd/);
    assert.match(settingsShellSource, /ngAfterViewInit/);
    assert.match(settingsShellSource, /getBoundingClientRect/);
    assert.match(settingsShellSource, /calculateCenteredScrollLeft/);
    assert.match(settingsShellSource, /calculateVisibleScrollTop/);
    assert.doesNotMatch(settingsShellSource, /activeMob\.offsetLeft/);
    assert.doesNotMatch(settingsShellSource, /activeDesk\.offsetTop/);
  });

  it('calculates mobile centering from container-relative viewport geometry and clamps to bounds', () => {
    assert.equal(calculateCenteredScrollLeft({
      scrollLeft: 200,
      scrollWidth: 1000,
      containerLeft: 100,
      containerWidth: 320,
      itemLeft: 390,
      itemWidth: 100,
    }), 380);

    assert.equal(calculateCenteredScrollLeft({
      scrollLeft: 0,
      scrollWidth: 1000,
      containerLeft: 100,
      containerWidth: 320,
      itemLeft: 90,
      itemWidth: 80,
    }), 0);

    assert.equal(calculateCenteredScrollLeft({
      scrollLeft: 650,
      scrollWidth: 1000,
      containerLeft: 100,
      containerWidth: 320,
      itemLeft: 430,
      itemWidth: 120,
    }), 680);
  });

  it('scrolls the desktop nav only when the active item is outside the container viewport', () => {
    const base = {
      scrollTop: 300,
      scrollHeight: 1200,
      containerTop: 200,
      containerHeight: 400,
      padding: 16,
    };

    assert.equal(calculateVisibleScrollTop({ ...base, itemTop: 300, itemHeight: 44 }), null);
    assert.equal(calculateVisibleScrollTop({ ...base, itemTop: 150, itemHeight: 44 }), 234);
    assert.equal(calculateVisibleScrollTop({ ...base, itemTop: 590, itemHeight: 50 }), 356);

    assert.equal(calculateVisibleScrollTop({
      ...base,
      scrollTop: 20,
      itemTop: 100,
      itemHeight: 44,
    }), 0);
  });
});
