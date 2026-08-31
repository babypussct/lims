import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const usersSource = readFileSync(new URL('../config/components/config-users.component.ts', import.meta.url), 'utf8');
const rolesSource = readFileSync(new URL('../config/components/config-roles.component.ts', import.meta.url), 'utf8');
const generalSource = readFileSync(new URL('../config/components/config-general.component.ts', import.meta.url), 'utf8');
const profileSource = readFileSync(new URL('./pages/account-profile-settings.component.ts', import.meta.url), 'utf8');

describe('Settings production hardening contracts', () => {
  it('distinguishes user loading errors from a genuinely empty user list', () => {
    assert.match(usersSource, /usersLoadError = signal\(''\)/);
    assert.match(usersSource, /Không thể tải danh sách người dùng/);
    assert.match(usersSource, /Dữ liệu người dùng chưa tải được/);
    assert.match(usersSource, /getAllUsers\(forceRefresh\)/);
  });

  it('keeps failed batch user updates selected for an explicit retry', () => {
    assert.match(usersSource, /const failedUids = new Set<string>\(\)/);
    assert.match(usersSource, /failedUids\.add\(u\.uid\)/);
    assert.match(usersSource, /this\.selectedUids\.set\(failedUids\)/);
    assert.match(usersSource, /vẫn được giữ chọn để thử lại/);
  });

  it('does not persist the default staff role id onto viewer, pending, or manager accounts', () => {
    const persistBlock = usersSource.match(/private async persistUser[\s\S]*?\n  async saveUser/)?.[0] || '';
    assert.match(persistBlock, /let roleId = ''/);
    assert.match(persistBlock, /else if \(u\.role === 'staff'\)/);
    assert.match(persistBlock, /roleId = u\.roleId \|\| 'role_staff_default'/);
    assert.doesNotMatch(persistBlock, /u\.roleId \|\| 'role_staff_default',[\s\n]*u\.customPermissions/);
  });

  it('blocks role deletion while any user still references that role', () => {
    const deleteBlock = rolesSource.match(/async deleteRole\(role: any\)[\s\S]*?\n  }\n}/)?.[0] || '';
    assert.match(deleteBlock, /getAllUsers\(true\)/);
    assert.match(deleteBlock, /findUsersReferencingRole\(users, role\.id\)/);
    assert.match(deleteBlock, /referencedUsers\.length > 0/);
    assert.match(deleteBlock, /Hãy gán họ sang vai trò khác trước/);
  });

  it('rejects duplicate role ids instead of overwriting an existing role document', () => {
    assert.match(rolesSource, /this\.rolesList\(\)\.some\(role => role\.id === roleId\)/);
    assert.match(rolesSource, /Mã vai trò .* đã tồn tại/);
  });

  it('reports save failures for profile and system settings instead of emitting false success', () => {
    assert.match(profileSource, /Không thể cập nhật ảnh đại diện/);
    assert.match(generalSource, /Không thể lưu danh mục phân loại/);
    assert.match(generalSource, /Không thể lưu cấu hình bảo trì/);
    assert.match(generalSource, /Không thể lưu cấu hình hiển thị tính năng khóa/);
  });
});
