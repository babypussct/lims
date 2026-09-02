import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, PERMISSIONS, PERMISSION_NAMES, getUserRoleLabel } from '../../../core/services/auth.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { getAvatarUrl } from '../../../shared/utils/utils';

@Component({
  selector: 'app-account-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AppButtonComponent],
  template: `
    <div class="space-y-6 fade-in">
      <section>
        <div class="relative h-40 overflow-hidden rounded-2xl bg-gradient-soft sm:h-48">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.38),transparent_24%),radial-gradient(circle_at_15%_85%,rgba(255,255,255,0.18),transparent_30%)]"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
        </div>

        <div class="relative mx-3 -mt-14 rounded-2xl border-0 bg-white/85 p-4 shadow-soft-xl backdrop-blur-2xl backdrop-saturate-200 dark:bg-slate-900/85 sm:mx-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div class="h-20 w-20 shrink-0 rounded-xl bg-white p-1 shadow-soft-sm dark:bg-slate-800">
              <img
                [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)"
                alt="Ảnh đại diện tài khoản"
                class="h-full w-full rounded-lg bg-slate-100 object-cover dark:bg-slate-700">
            </div>

            <div class="min-w-0 flex-1">
              <h1 class="truncate text-xl font-bold text-gray-700 dark:text-white">{{ auth.currentUser()?.displayName }}</h1>
              <p class="mt-1 truncate text-sm font-semibold text-slate-500 dark:text-slate-400">
                {{ getUserRoleLabel(auth.currentUser()?.role) }} · {{ auth.currentUser()?.email }}
              </p>
            </div>

            <div class="w-full rounded-xl bg-gray-50 p-1 shadow-soft-md dark:bg-slate-800 sm:w-auto">
              <div class="grid grid-cols-3 gap-1 text-center">
                <a class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-soft-md dark:bg-slate-900 dark:text-white" routerLink="/settings/account/profile">
                  <i class="fa-solid fa-user mr-1.5 text-[10px]" aria-hidden="true"></i>Hồ sơ
                </a>
                <a class="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-gray-700 hover:shadow-soft-md dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white" routerLink="/settings/account/security">
                  <i class="fa-solid fa-shield-halved mr-1.5 text-[10px]" aria-hidden="true"></i>Bảo mật
                </a>
                <a class="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-gray-700 hover:shadow-soft-md dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white" routerLink="/settings/account/notifications">
                  <i class="fa-solid fa-bell mr-1.5 text-[10px]" aria-hidden="true"></i>Thông báo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="grid gap-6 xl:grid-cols-3">
        <section class="flex h-full flex-col rounded-2xl border-0 bg-white p-4 shadow-soft-xl dark:bg-slate-900">
          <h2 class="text-sm font-bold text-gray-700 dark:text-white">Cá nhân hóa</h2>
          <p class="mt-1 text-xs leading-relaxed text-slate-400">Điều chỉnh cách tài khoản của bạn xuất hiện trong LIMS.</p>

          <div class="mt-5">
            <label for="account-avatar-style" class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kiểu ảnh đại diện</label>
            <select
              id="account-avatar-style"
              [ngModel]="auth.currentUser()?.avatarStyle || ''"
              (ngModelChange)="saveAvatarStyle($event)"
              class="h-10 w-full rounded-xl border-0 bg-gray-50 px-3 text-sm font-semibold text-slate-600 shadow-soft-md outline-none transition focus:ring-2 focus:ring-fuchsia-500/15 dark:bg-slate-800 dark:text-slate-200">
              <option value="">Mặc định hệ thống</option>
              <option value="google">📷 Ảnh Google cá nhân</option>
              <option value="bottts-neutral">🤖 Robot (Bottts)</option>
              <option value="fun-emoji">😊 Biểu cảm (Fun Emoji)</option>
              <option value="micah">🎨 Hiện đại (Micah)</option>
              <option value="notionists">✏️ Vẽ tay (Notionists)</option>
              <option value="initials">🔤 Chữ cái tên</option>
            </select>
          </div>

          <div class="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-slate-800/70">
            <div class="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tài khoản hiện tại</div>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-soft text-white shadow-soft-md">
                <i class="fa-solid fa-user-check" aria-hidden="true"></i>
              </div>
              <div class="min-w-0">
                <div class="truncate text-sm font-semibold text-gray-700 dark:text-white">{{ getUserRoleLabel(auth.currentUser()?.role) }}</div>
                <div class="truncate text-xs text-slate-400">Phiên làm việc đã xác thực</div>
              </div>
            </div>
          </div>
        </section>

        <section class="flex h-full flex-col rounded-2xl border-0 bg-white p-4 shadow-soft-xl dark:bg-slate-900">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-sm font-bold text-gray-700 dark:text-white">Thông tin hồ sơ</h2>
            <i class="fa-solid fa-user-pen text-xs text-slate-400" aria-hidden="true"></i>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Thông tin định danh được dùng trong audit trail và các thao tác có kiểm soát của hệ thống.</p>
          <div class="my-5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700"></div>

          <dl class="space-y-3 text-sm">
            <div class="flex gap-2">
              <dt class="shrink-0 font-semibold text-gray-700 dark:text-white">Họ tên:</dt>
              <dd class="min-w-0 truncate text-slate-500 dark:text-slate-400">{{ auth.currentUser()?.displayName }}</dd>
            </div>
            <div class="flex gap-2">
              <dt class="shrink-0 font-semibold text-gray-700 dark:text-white">Email:</dt>
              <dd class="min-w-0 truncate text-slate-500 dark:text-slate-400">{{ auth.currentUser()?.email }}</dd>
            </div>
            <div class="flex gap-2">
              <dt class="shrink-0 font-semibold text-gray-700 dark:text-white">Vai trò:</dt>
              <dd class="text-slate-500 dark:text-slate-400">{{ getUserRoleLabel(auth.currentUser()?.role) }}</dd>
            </div>
            <div class="flex items-start gap-2">
              <dt class="shrink-0 font-semibold text-gray-700 dark:text-white">App:</dt>
              <dd class="min-w-0 break-all text-xs text-slate-500 dark:text-slate-400">{{ fb.APP_ID }}</dd>
            </div>
          </dl>

          <div class="mt-auto pt-5">
            <div class="rounded-xl bg-gray-50 p-3 dark:bg-slate-800/70">
              <div class="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">User ID (UID)</div>
              <div class="flex items-center gap-2">
                <code class="min-w-0 flex-1 truncate font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300">{{ auth.currentUser()?.uid }}</code>
                <app-button variant="secondary" size="sm" (click)="copyUid()" title="Sao chép UID">
                  <i class="fa-regular fa-copy" aria-hidden="true"></i>
                </app-button>
              </div>
            </div>
          </div>
        </section>

        <section class="flex h-full flex-col rounded-2xl border-0 bg-white p-4 shadow-soft-xl dark:bg-slate-900">
          <h2 class="text-sm font-bold text-gray-700 dark:text-white">Quyền truy cập hiệu lực</h2>
          <p class="mt-1 text-xs leading-relaxed text-slate-400">Các quyền nghiệp vụ đang áp dụng cho tài khoản này.</p>

          @if (auth.currentUser()?.role === 'manager') {
            <div class="mt-5 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
              <div class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <i class="fa-solid fa-check-double" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="text-sm font-bold text-emerald-800 dark:text-emerald-300">Toàn quyền quản trị hệ thống</div>
                  <div class="mt-1 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">Vận hành, phê duyệt tài khoản, cấu hình dữ liệu và backup.</div>
                </div>
              </div>
            </div>
          } @else {
            <div class="mt-5 space-y-4">
              @for (group of permissionGroups; track group.label) {
                <div>
                  <div class="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ group.label }}</div>
                  <div class="flex flex-wrap gap-1.5">
                    @for (permission of group.permissions; track permission) {
                      @if (auth.hasPermission(permission)) {
                        <span class="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <i class="fa-solid fa-circle-check text-[9px] text-emerald-500" aria-hidden="true"></i>{{ permissionLabel(permission) }}
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
        </section>
      </div>
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
