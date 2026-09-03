import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { routes } from '../../app.routes';
import { calculateCenteredScrollLeft } from './settings-scroll.utils';

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

  it('protects administrative Settings pages with granular delegated permissions and manager override', () => {
    const singlePermissionRoutes: Array<[string, string]> = [
      ['system', 'system_manage'],
      ['data/master/analytes', 'master_data_manage'],
      ['data/master/target-groups', 'master_data_manage'],
      ['data/master/matrices', 'master_data_manage'],
      ['data/master/sample-descriptions', 'master_data_manage'],
      ['data/master/devices', 'master_data_manage'],
      ['data/master/categories', 'master_data_manage'],
      ['access/users', 'user_manage'],
      ['access/roles', 'user_manage'],
      ['policies/consumption', 'policy_manage'],
    ];

    for (const [path, permission] of singlePermissionRoutes) {
      const child = settingsChild(path);
      assert.ok(child.loadComponent, `/settings/${path} phải lazy-load component`);
      assert.ok(child.canActivate?.length, `/settings/${path} phải có guard`);
      assert.equal(child.data?.['permission'], permission);
      assert.equal(child.data?.['role'], undefined);
    }

    const manager = settingsChild('manager');
    assert.ok(manager.canActivate?.length);
    assert.deepEqual(manager.data?.['permissionsAny'], [
      'system_manage',
      'master_data_manage',
      'user_manage',
      'backup_create',
      'backup_verify',
      'backup_restore',
      'policy_manage',
    ]);
    assert.equal(manager.data?.['role'], undefined);

    const backups = settingsChild('data/backups');
    assert.ok(backups.canActivate?.length);
    assert.deepEqual(backups.data?.['permissionsAny'], ['backup_create', 'backup_verify', 'backup_restore']);
    assert.equal(backups.data?.['role'], undefined);
  });

  it('keeps the Settings aliases and data hub redirects deterministic', () => {
    assert.equal(settingsChild('').redirectTo, 'account/profile');
    assert.equal(settingsChild('account').redirectTo, 'account/profile');
    assert.equal(settingsChild('data').redirectTo, 'data/master');
    assert.equal(settingsChild('data/master').redirectTo, 'data/master/analytes');
    assert.equal(settingsChild('data/lifecycle').redirectTo, 'data/backups');
    assert.equal(settingsChild('data/lifecycle').pathMatch, 'full');
    assert.equal(settingsChild('access').redirectTo, 'access/users');

    assert.equal(route('master-targets').redirectTo, 'settings/data/master/analytes');
    assert.equal(route('target-groups').redirectTo, 'settings/data/master/target-groups');
    assert.equal(route('matrix-types').redirectTo, 'settings/data/master/matrices');
    assert.equal(route('sample-description-master').redirectTo, 'settings/data/master/sample-descriptions');
    assert.equal(route('master-devices').redirectTo, 'settings/data/master/devices');
  });

  it('keeps Master Data internal links canonical and preserves searchable list state in the URL', () => {
    const masterAnalytesSource = readFileSync(new URL('../targets/master-target-manager.component.ts', import.meta.url), 'utf8');
    const sampleDescriptionsSource = readFileSync(new URL('../config/sample-description-master.component.ts', import.meta.url), 'utf8');
    const sampleDescriptionsTemplate = readFileSync(new URL('../config/sample-description-master.component.html', import.meta.url), 'utf8');
    const sopEditorTemplate = readFileSync(new URL('../sop/editor/sop-editor.component.html', import.meta.url), 'utf8');

    assert.match(masterAnalytesSource, /queryParamMap\.get\('q'\)/);
    assert.match(masterAnalytesSource, /queryParams:\s*\{ q: value\.trim\(\) \|\| null \}/);
    assert.match(masterAnalytesSource, /queryParamsHandling:\s*'merge'/);
    assert.match(sampleDescriptionsSource, /queryParamMap\.get\('q'\)/);
    assert.match(sampleDescriptionsSource, /queryParamMap\.get\('status'\)/);
    assert.match(sampleDescriptionsSource, /updateListQueryParams/);
    assert.match(sampleDescriptionsTemplate, /onSearchTermChange\(\$event\)/);
    assert.match(sampleDescriptionsTemplate, /onStatusFilterChange\(\$event\)/);
    assert.match(sopEditorTemplate, /routerLink="\/settings\/data\/master\/target-groups"/);
    assert.doesNotMatch(sopEditorTemplate, /routerLink="\/target-groups"/);
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

  it('tracks and automatically scrolls active top navigation items into view', () => {
    const settingsShellSource = readFileSync(new URL('./settings-shell.component.ts', import.meta.url), 'utf8');

    assert.match(settingsShellSource, /#accountNavContainer/);
    assert.match(settingsShellSource, /#adminNavContainer/);
    assert.match(settingsShellSource, /accountNavContainer = viewChild/);
    assert.match(settingsShellSource, /adminNavContainer = viewChild/);
    assert.match(settingsShellSource, /scrollActiveIntoView/);
    assert.match(settingsShellSource, /scrollHorizontalActiveIntoView/);
    assert.match(settingsShellSource, /NavigationEnd/);
    assert.match(settingsShellSource, /ngAfterViewInit/);
    assert.match(settingsShellSource, /getBoundingClientRect/);
    assert.match(settingsShellSource, /calculateCenteredScrollLeft/);
    assert.doesNotMatch(settingsShellSource, /calculateVisibleScrollTop/);
    assert.doesNotMatch(settingsShellSource, /offsetLeft/);
  });

  it('uses one Soft UI-style top navigation system across every Settings route', () => {
    const settingsShellSource = readFileSync(new URL('./settings-shell.component.ts', import.meta.url), 'utf8');
    const profileSettingsSource = readFileSync(new URL('./pages/account-profile-settings.component.ts', import.meta.url), 'utf8');

    assert.match(settingsShellSource, /aria-label="Điều hướng cấu hình tài khoản"/);
    assert.match(settingsShellSource, /aria-label="Điều hướng quản trị hệ thống"/);
    assert.match(settingsShellSource, /accountNavItems/);
    assert.match(settingsShellSource, /managerNavItems/);
    assert.match(settingsShellSource, /filteredManagerNavItems/);
    assert.match(settingsShellSource, /isAdminArea/);
    assert.match(settingsShellSource, /contextSubNavItems/);
    assert.match(settingsShellSource, /url === '\/settings\/manager'/);
    assert.match(settingsShellSource, /Tìm nhanh cài đặt/);
    assert.match(settingsShellSource, /\/settings\/account\/privacy/);
    assert.match(settingsShellSource, /label: 'Quản trị'[\s\S]*path: '\/settings\/manager'[\s\S]*permissionsAny: ADMIN_PERMISSIONS/);
    assert.match(settingsShellSource, /label: 'Hệ thống'[\s\S]*path: '\/settings\/system'[\s\S]*PERMISSIONS\.SYSTEM_MANAGE/);
    assert.match(settingsShellSource, /label: 'Người dùng & quyền'[\s\S]*path: '\/settings\/access\/users'[\s\S]*PERMISSIONS\.USER_MANAGE/);
    assert.match(settingsShellSource, /label: 'Chính sách hao hụt'[\s\S]*path: '\/settings\/policies\/consumption'[\s\S]*PERMISSIONS\.POLICY_MANAGE/);
    assert.match(settingsShellSource, /label: 'Chỉ tiêu'[\s\S]*\/settings\/data\/master\/analytes/);
    assert.match(settingsShellSource, /label: 'Vai trò & quyền'[\s\S]*\/settings\/access\/roles/);
    assert.doesNotMatch(settingsShellSource, /<aside/);
    assert.doesNotMatch(settingsShellSource, /Desktop Sticky Navigation Sidebar/);
    assert.doesNotMatch(settingsShellSource, /isAccountArea/);
    assert.doesNotMatch(profileSettingsSource, /routerLink="\/settings\/account\//);
    assert.doesNotMatch(profileSettingsSource, /relative h-40 overflow-hidden rounded-2xl bg-gradient-soft/);
  });

  it('keeps the security page non-duplicative and the manager overview action-driven', () => {
    const securitySource = readFileSync(new URL('./pages/account-security-settings.component.ts', import.meta.url), 'utf8');
    const managerSource = readFileSync(new URL('./pages/manager-settings.component.ts', import.meta.url), 'utf8');

    assert.equal((securitySource.match(/<h3 class="text-sm font-black text-slate-800 dark:text-slate-100">Mật khẩu LIMS<\/h3>/g) || []).length, 1);
    assert.match(securitySource, /title="Đăng nhập & xác thực"/);
    assert.match(securitySource, /title="Hoạt động bảo mật"/);
    assert.doesNotMatch(securitySource, /title="Nhật ký bảo mật"/);
    assert.doesNotMatch(securitySource, /Yêu cầu mật khẩu/);

    assert.match(managerSource, /Tổng quan quản trị/);
    assert.match(managerSource, /Ưu tiên các việc cần xử lý/);
    assert.match(managerSource, /Hệ thống vận hành bình thường/);
    assert.match(managerSource, /pendingUsers/);
    assert.match(managerSource, /backupNeedsAttention/);
    assert.match(managerSource, /masterCounts/);
    assert.match(managerSource, /userSummaryAvailable/);
    assert.match(managerSource, /masterDataSummaryAvailable/);
    assert.match(managerSource, /PERMISSIONS\.USER_MANAGE/);
    assert.match(managerSource, /PERMISSIONS\.BACKUP_RESTORE/);
    assert.match(managerSource, /\/settings\/access\/users/);
    assert.match(managerSource, /\/settings\/system/);
    assert.match(managerSource, /\/settings\/data\/master/);
    assert.match(managerSource, /\/settings\/data\/backups/);
    assert.doesNotMatch(managerSource, /\/settings\/data\/lifecycle/);
    assert.doesNotMatch(managerSource, /\/settings\/diagnostics/);
    assert.doesNotMatch(managerSource, /shortcut/i);
  });

  it('removes diagnostics and folds lifecycle tools into Backup & phục hồi', () => {
    const settings = route('settings');
    const shell = readFileSync(new URL('./settings-shell.component.ts', import.meta.url), 'utf8');
    const manager = readFileSync(new URL('./pages/manager-settings.component.ts', import.meta.url), 'utf8');
    const general = readFileSync(new URL('../config/components/config-general.component.html', import.meta.url), 'utf8');
    const generalSource = readFileSync(new URL('../config/components/config-general.component.ts', import.meta.url), 'utf8');

    assert.equal(settings.children?.some(item => item.path === 'diagnostics'), false);
    assert.doesNotMatch(shell, /Chẩn đoán|\/settings\/diagnostics/);
    assert.doesNotMatch(manager, /Chẩn đoán|\/settings\/diagnostics/);
    assert.doesNotMatch(general, /Tài Nguyên|Migration Dữ Liệu Hệ Thống|runLastUpdatedMigration/);
    assert.doesNotMatch(generalSource, /runLastUpdatedMigration|isMigrating|migrationLog|storageEstimate|usageBusy/);
    assert.match(general, /view\(\) === 'backup'[\s\S]*Backup & Phục Hồi/);
    assert.doesNotMatch(generalSource, /'data' \| 'diagnostics'/);
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

});
