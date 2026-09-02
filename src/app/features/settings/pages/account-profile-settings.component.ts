import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, PERMISSIONS, PERMISSION_NAMES, getUserRoleLabel } from '../../../core/services/auth.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { getAvatarUrl } from '../../../shared/utils/utils';
import { SettingsSectionComponent } from '../components/settings-section.component';

@Component({
  selector: 'app-account-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, AppButtonComponent, SettingsSectionComponent],
  template: `
    <div class="space-y-5 fade-in">
      <!-- Profile Hero Banner -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <div class="h-28 bg-gradient-soft opacity-90 relative">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]"></div>
        </div>
        <div class="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <div class="-mt-12 h-24 w-24 shrink-0 rounded-2xl border-4 border-white bg-white p-1 shadow-md dark:border-slate-800 dark:bg-slate-800">
            <img
              [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
              alt="Ảnh đại diện tài khoản"
              class="h-full w-full rounded-xl bg-slate-100 object-cover dark:bg-slate-700">
          </div>
          <div class="min-w-0 flex-1 sm:pb-1">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="truncate text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">{{ auth.currentUser()?.displayName }}</h1>
              <span class="inline-flex rounded-xl bg-fuchsia-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
                <i class="fa-solid fa-award mr-1.5 self-center text-fuchsia-500" aria-hidden="true"></i>{{ getUserRoleLabel(auth.currentUser()?.role) }}
              </span>
            </div>
            <p class="mt-1 truncate text-sm font-medium text-slate-500 dark:text-slate-400">
              <i class="fa-solid fa-envelope mr-1 text-xs text-slate-400" aria-hidden="true"></i>{{ auth.currentUser()?.email }}
            </p>
          </div>
        </div>
      </div>

      <app-settings-section
        title="Định danh tài khoản"
        description="Thông tin nhận dạng dùng trong nhật ký kiểm toán (audit trail) và phân quyền nghiệp vụ LIMS."
        icon="fa-id-card">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-700/60 dark:bg-slate-900/40">
            <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">User ID (UID)</label>
            <div class="flex items-center gap-2">
              <code class="min-w-0 flex-1 truncate font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{{ auth.currentUser()?.uid }}</code>
              <app-button variant="secondary" size="sm" (click)="copyUid()" title="Sao chép UID">
                <i class="fa-regular fa-copy" aria-hidden="true"></i>
                <span class="text-xs">Sao chép</span>
              </app-button>
            </div>
          </div>
          <div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-700/60 dark:bg-slate-900/40">
            <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Môi trường dữ liệu (App Context)</label>
            <div class="flex items-center text-xs font-bold text-slate-700 dark:text-slate-300 py-1.5">
              <i class="fa-solid fa-database mr-2 text-fuchsia-500" aria-hidden="true"></i>{{ fb.APP_ID }}
            </div>
          </div>
        </div>
      </app-settings-section>

      <app-settings-section
        title="Cá nhân hóa"
        description="Tùy chọn phong cách avatar hiển thị trên thiết bị và phiên làm việc của bạn."
        icon="fa-palette">
        <div class="max-w-md">
          <label for="account-avatar-style" class="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">Kiểu ảnh đại diện</label>
          <select
            id="account-avatar-style"
            [ngModel]="auth.currentUser()?.avatarStyle || ''"
            (ngModelChange)="saveAvatarStyle($event)"
            class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-fuchsia-500 focus:bg-white focus:ring-2 focus:ring-fuchsia-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-fuchsia-500">
            <option value="">Mặc định hệ thống</option>
            <option value="google">📷 Ảnh Google cá nhân</option>
            <option value="bottts-neutral">🤖 Robot (Bottts)</option>
            <option value="fun-emoji">😊 Biểu cảm (Fun Emoji)</option>
            <option value="micah">🎨 Hiện đại (Micah)</option>
            <option value="notionists">✏️ Vẽ tay (Notionists)</option>
            <option value="initials">🔤 Chữ cái tên</option>
          </select>
        </div>
      </app-settings-section>

      <app-settings-section
        title="Quyền truy cập hiệu lực"
        description="Các quyền hạn và vai trò thực tế đang được áp dụng cho tài khoản của bạn."
        icon="fa-key">
        @if (auth.currentUser()?.role === 'manager') {
          <div class="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm font-bold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
              <i class="fa-solid fa-check-double" aria-hidden="true"></i>
            </div>
            <div>
              <div class="font-black">Toàn quyền quản trị hệ thống</div>
              <div class="text-xs font-normal text-emerald-700 dark:text-emerald-400">Bạn có đầy đủ thẩm quyền vận hành, duyệt tài khoản, cấu hình dữ liệu và backup.</div>
            </div>
          </div>
        } @else {
          <div class="space-y-4">
            @for (group of permissionGroups; track group.label) {
              <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-700/50 dark:bg-slate-900/30">
                <div class="mb-2.5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <i class="fa-solid fa-layer-group text-[11px]"></i>
                  {{ group.label }}
                </div>
                <div class="flex flex-wrap gap-2">
                  @for (permission of group.permissions; track permission) {
                    @if (auth.hasPermission(permission)) {
                      <span class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                        <i class="fa-solid fa-circle-check text-[10px]" aria-hidden="true"></i>{{ permissionLabel(permission) }}
                      </span>
                    }
                  }
                </div>
              </div>
            }
            @if (auth.userPermissions().length === 0) {
              <p class="text-sm italic text-slate-400">Chưa được cấp quyền chi tiết.</p>
            }
          </div>
        }
      </app-settings-section>
    </div>
  `,
})
export class AccountProfileSettingsComponent {
  readonly auth = inject(AuthService);
  readonly state = inject(StateService);
  readonly getUserRoleLabel = getUserRoleLabel;
  readonly fb = inject(FirebaseService);
  private readonly toast = inject(ToastService);
  readonly getAvatarUrl = getAvatarUrl;

  readonly permissionGroups = [
    { label: 'Kho & vận hành', permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_EDIT, PERMISSIONS.BATCH_RUN] },
    { label: 'Chất chuẩn', permissions: [PERMISSIONS.STANDARD_VIEW, PERMISSIONS.STANDARD_EDIT, PERMISSIONS.STANDARD_APPROVE, PERMISSIONS.STANDARD_LOG_VIEW, PERMISSIONS.STANDARD_LOG_DELETE] },
    { label: 'Tài liệu & báo cáo', permissions: [PERMISSIONS.RECIPE_VIEW, PERMISSIONS.RECIPE_EDIT, PERMISSIONS.SOP_VIEW, PERMISSIONS.SOP_EDIT, PERMISSIONS.SOP_APPROVE, PERMISSIONS.REPORT_VIEW] },
    { label: 'Quản trị', permissions: [PERMISSIONS.USER_MANAGE, PERMISSIONS.BYPASS_MAINTENANCE, PERMISSIONS.BACKUP_CREATE, PERMISSIONS.BACKUP_VERIFY, PERMISSIONS.BACKUP_RESTORE] },
  ];

  permissionLabel(permission: string): string {
    return PERMISSION_NAMES[permission] || permission;
  }

  copyUid(): void {
    const uid = this.auth.currentUser()?.uid || '';
    navigator.clipboard.writeText(uid)
      .then(() => this.toast.show('Đã sao chép UID.', 'success'))
      .catch(() => this.toast.show('Không thể sao chép UID.', 'error'));
  }

  async saveAvatarStyle(style: string): Promise<void> {
    try {
      await this.state.saveMyAvatarStyle(style);
      this.toast.show('Đã cập nhật ảnh đại diện.', 'success');
    } catch (error: any) {
      this.toast.show(`Không thể cập nhật ảnh đại diện: ${error?.message || error}`, 'error');
    }
  }
}
