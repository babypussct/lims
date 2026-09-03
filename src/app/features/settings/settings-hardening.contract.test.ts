import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { PERMISSIONS, PERMISSION_CATALOG } from '../../core/auth/permission-catalog';

const usersSource = readFileSync(new URL('../config/components/config-users.component.ts', import.meta.url), 'utf8');
const rolesSource = readFileSync(new URL('../config/components/config-roles.component.ts', import.meta.url), 'utf8');
const generalSource = readFileSync(new URL('../config/components/config-general.component.ts', import.meta.url), 'utf8');
const profileSource = readFileSync(new URL('./pages/account-profile-settings.component.ts', import.meta.url), 'utf8');
const authSource = readFileSync(new URL('../../core/services/auth.service.ts', import.meta.url), 'utf8');
const masterTargetSource = readFileSync(new URL('../targets/master-target-manager.component.ts', import.meta.url), 'utf8');
const confirmationSource = readFileSync(new URL('../../core/services/confirmation.service.ts', import.meta.url), 'utf8');
const confirmationModalSource = readFileSync(new URL('../../shared/components/confirmation-modal/confirmation-modal.component.ts', import.meta.url), 'utf8');
const printSource = readFileSync(new URL('../../core/services/print.service.ts', import.meta.url), 'utf8');
const safetySource = readFileSync(new URL('../config/components/config-safety.component.ts', import.meta.url), 'utf8');

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

  it('keeps one shared permission catalog as the complete editor source of truth', () => {
    assert.deepEqual(
      new Set(PERMISSION_CATALOG.map(permission => permission.code)),
      new Set(Object.values(PERMISSIONS)),
    );
    assert.match(usersSource, /PERMISSION_EDITOR_GROUPS/);
    assert.match(rolesSource, /PERMISSION_EDITOR_GROUPS/);
    assert.match(rolesSource, /PERMISSION_CATALOG/);
    assert.match(usersSource, /bypass_maintenance|PERMISSION_EDITOR_GROUPS/);
  });

  it('removes client-side protected-admin identity heuristics and locks protected profiles in user management', () => {
    assert.doesNotMatch(authSource, /oneloveonepeopleforever@gmail\.com/i);
    assert.match(usersSource, /u\.protectedAdmin === true/);
    assert.match(usersSource, /\[disabled\]="isSuperAdmin\(u\)"/);
    assert.match(usersSource, /Tài khoản quản trị gốc được bảo vệ/);
    assert.match(usersSource, /filter\(u => selected\.has\(u\.uid\) && !this\.isSuperAdmin\(u\)\)/);
  });

  it('removes the completed hyphen-id migration from runtime UI', () => {
    assert.doesNotMatch(masterTargetSource, /migrateHyphenToUnderscore|Migrate data \(- to _\)|Run migration/);
  });

  it('requires exact typed confirmation before permanent recycle-bin deletion', () => {
    assert.match(generalSource, /requiredText: 'XAC NHAN XOA'/);
    assert.match(confirmationSource, /return !requiredText \|\| this\.typedText\(\) === requiredText/);
    assert.match(confirmationSource, /if \(!this\.canConfirm\(\)\) return/);
    assert.match(confirmationModalSource, /\[disabled\]="!confirmationService\.canConfirm\(\)"/);
  });

  it('keeps backup permissions action-scoped while allowing shared status visibility', () => {
    assert.match(generalSource, /hasPermission\(PERMISSIONS\.BACKUP_CREATE\)/);
    assert.match(generalSource, /hasPermission\(PERMISSIONS\.BACKUP_VERIFY\)/);
    assert.match(generalSource, /hasPermission\(PERMISSIONS\.BACKUP_RESTORE\)/);
  });

  it('wires global print signature configuration into preview defaults', () => {
    assert.match(printSource, /private state = inject\(StateService\)/);
    assert.match(printSource, /showSignature: this\.state\.printConfig\(\)\?\.showSignature \?\? true/);
  });

  it('shows consumption-policy impact and orphan warnings before policy edits', () => {
    assert.match(safetySource, /affectedInventoryCount\(category: string\)/);
    assert.match(safetySource, /isOrphanRule\(category: string\)/);
    assert.match(safetySource, /Áp dụng cho \{\{ affectedInventoryCount\(rule\.category\) \}\}/);
    assert.match(safetySource, /Phân loại này không còn tồn tại trong danh mục/);
  });
});
