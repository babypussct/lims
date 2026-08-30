import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, PERMISSIONS, PERMISSION_NAMES } from '../../../core/services/auth.service';
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
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <div class="h-24 bg-[linear-gradient(110deg,#3b82f6,#8b5cf6,#d946ef)]"></div>
        <div class="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end">
          <div class="-mt-10 h-24 w-24 shrink-0 rounded-2xl border-4 border-white bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-800">
            <img
              [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
              alt="Ảnh đại diện tài khoản"
              class="h-full w-full rounded-xl bg-slate-100 object-cover dark:bg-slate-700">
          </div>
          <div class="min-w-0 flex-1 sm:pb-1">
            <h1 class="truncate text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">{{ auth.currentUser()?.displayName }}</h1>
            <p class="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{{ auth.currentUser()?.email }}</p>
          </div>
          <span class="inline-flex self-start rounded-xl bg-indigo-50 px-3 py-2 text-xs font-black uppercase tracking-wider text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 sm:self-auto sm:mb-1">
            {{ auth.currentUser()?.role }}
          </span>
        </div>
      </div>

      <app-settings-section
        title="Định danh tài khoản"
        description="Thông tin nhận dạng dùng trong audit và liên kết dữ liệu LIMS."
        icon="fa-id-card">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">User ID (UID)</label>
            <div class="flex gap-2">
              <code class="min-w-0 flex-1 truncate rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{{ auth.currentUser()?.uid }}</code>
              <app-button variant="secondary" size="sm" (click)="copyUid()">
                <i class="fa-regular fa-copy" aria-hidden="true"></i>
                <span class="sr-only">Sao chép UID</span>
              </app-button>
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">App context</label>
            <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <i class="fa-solid fa-database mr-2 text-slate-400" aria-hidden="true"></i>{{ fb.APP_ID }}
            </div>
          </div>
        </div>
      </app-settings-section>

      <app-settings-section
        title="Cá nhân hóa"
        description="Tùy chọn avatar chỉ áp dụng cho tài khoản của bạn."
        icon="fa-palette">
        <div class="max-w-xl">
          <label for="account-avatar-style" class="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">Kiểu ảnh đại diện</label>
          <select
            id="account-avatar-style"
            [ngModel]="auth.currentUser()?.avatarStyle || ''"
            (ngModelChange)="saveAvatarStyle($event)"
            class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500">
            <option value="">Mặc định hệ thống</option>
            <option value="google">Ảnh Google</option>
            <option value="bottts-neutral">Robot</option>
            <option value="fun-emoji">Biểu cảm</option>
            <option value="micah">Hiện đại</option>
            <option value="notionists">Vẽ tay</option>
            <option value="initials">Chữ cái</option>
          </select>
        </div>
      </app-settings-section>

      <app-settings-section
        title="Quyền truy cập"
        description="Quyền hiệu lực của tài khoản trong hệ thống hiện tại."
        icon="fa-key">
        @if (auth.currentUser()?.role === 'manager') {
          <div class="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-bold text-indigo-700 dark:border-indigo-800/40 dark:bg-indigo-500/10 dark:text-indigo-300">
            <i class="fa-solid fa-check-double mr-2 text-emerald-500" aria-hidden="true"></i>Toàn quyền quản trị hệ thống
          </div>
        } @else {
          <div class="space-y-4">
            @for (group of permissionGroups; track group.label) {
              <div>
                <div class="mb-2 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ group.label }}</div>
                <div class="flex flex-wrap gap-2">
                  @for (permission of group.permissions; track permission) {
                    @if (auth.hasPermission(permission)) {
                      <span class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                        <i class="fa-solid fa-check" aria-hidden="true"></i>{{ permissionLabel(permission) }}
                      </span>
                    }
                  }
                </div>
              </div>
            }
            @if (auth.userPermissions().length === 0) {
              <p class="text-sm italic text-slate-400">Chưa được cấp quyền cụ thể.</p>
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
    await this.state.saveMyAvatarStyle(style);
    this.toast.show('Đã cập nhật ảnh đại diện.', 'success');
  }
}
