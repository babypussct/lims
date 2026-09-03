import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SettingsSectionComponent } from '../components/settings-section.component';

@Component({
  selector: 'app-account-security-settings',
  standalone: true,
  imports: [AppButtonComponent, SettingsSectionComponent],
  template: `
    <div class="space-y-5 fade-in">
      <app-settings-section
        title="Đăng nhập & xác thực"
        description="Quản lý các cách bạn có thể đăng nhập vào LIMS. Nên duy trì ít nhất một phương thức hoạt động để tránh mất quyền truy cập."
        icon="fa-shield-halved">
        <div class="grid gap-4 xl:grid-cols-2">
          <article class="flex h-full flex-col rounded-xl bg-gray-50 p-4 dark:bg-slate-800/70">
            <div class="flex items-start gap-3.5">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-soft-sm dark:bg-slate-900">
                <i class="fa-brands fa-google text-lg text-red-500" aria-hidden="true"></i>
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-sm font-black text-slate-800 dark:text-slate-100">Google</h3>
                  @if (auth.hasGoogleProvider()) {
                    <span class="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <i class="fa-solid fa-circle-check text-[9px]" aria-hidden="true"></i>Đã liên kết
                    </span>
                  } @else {
                    <span class="inline-flex items-center rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-slate-400 dark:bg-slate-900">Chưa liên kết</span>
                  }
                </div>
                <p class="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Đăng nhập bằng tài khoản Google đang liên kết với hồ sơ LIMS này.</p>
              </div>
            </div>

            <div class="mt-auto flex flex-wrap items-center gap-2 pt-4">
              @if (auth.hasGoogleProvider()) {
                <app-button
                  variant="secondary"
                  size="sm"
                  [disabled]="!auth.canUnlinkProvider('google.com') || unlinkingProvider() === 'google.com'"
                  [loading]="unlinkingProvider() === 'google.com'"
                  (click)="unlinkProvider('google.com')">
                  Hủy liên kết
                </app-button>
                @if (!auth.canUnlinkProvider('google.com')) {
                  <span class="text-[10px] font-semibold text-slate-400">Cần giữ ít nhất một phương thức đăng nhập.</span>
                }
              } @else {
                <app-button size="sm" (click)="linkGoogle()">Liên kết Google</app-button>
              }
            </div>
          </article>

          <article class="flex h-full flex-col rounded-xl bg-gray-50 p-4 dark:bg-slate-800/70">
            <div class="flex items-start gap-3.5">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-fuchsia-600 shadow-soft-sm dark:bg-slate-900 dark:text-fuchsia-300">
                <i class="fa-solid fa-key" aria-hidden="true"></i>
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-sm font-black text-slate-800 dark:text-slate-100">Mật khẩu LIMS</h3>
                  @if (auth.needsPasswordSetup()) {
                    <span class="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                      <i class="fa-solid fa-triangle-exclamation text-[9px]" aria-hidden="true"></i>Cần thiết lập
                    </span>
                  } @else if (auth.hasPasswordProvider()) {
                    <span class="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <i class="fa-solid fa-circle-check text-[9px]" aria-hidden="true"></i>Đã thiết lập
                    </span>
                  } @else {
                    <span class="inline-flex items-center rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-slate-400 dark:bg-slate-900">Chưa thiết lập</span>
                  }
                </div>
                <p class="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Dùng email của tài khoản này cùng mật khẩu riêng của LIMS để đăng nhập mà không cần Google.</p>
                <p class="mt-2 text-[11px] font-semibold text-slate-400"><i class="fa-solid fa-circle-info mr-1.5 text-fuchsia-500" aria-hidden="true"></i>Mật khẩu mới bắt buộc có ít nhất 8 ký tự.</p>
              </div>
            </div>

            <div class="mt-auto flex flex-wrap items-center gap-2 pt-4">
              <app-button size="sm" (click)="auth.openPasswordSetup()">
                {{ auth.hasPasswordProvider() ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu' }}
              </app-button>
              @if (auth.hasPasswordProvider()) {
                <app-button
                  variant="secondary"
                  size="sm"
                  [disabled]="!auth.canUnlinkProvider('password') || unlinkingProvider() === 'password'"
                  [loading]="unlinkingProvider() === 'password'"
                  (click)="unlinkProvider('password')">
                  Xóa mật khẩu
                </app-button>
              }
            </div>
          </article>
        </div>

        @if (auth.googleRedirectError()) {
          <div class="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation text-sm"></i>
            <span>{{ auth.googleRedirectError() }}</span>
          </div>
        }
      </app-settings-section>

      <app-settings-section
        title="Hoạt động bảo mật"
        description="Thông tin gần nhất giúp bạn kiểm tra thay đổi quan trọng trên tài khoản."
        icon="fa-clock-rotate-left">
        <div class="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-800/70">
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-fuchsia-500 shadow-soft-sm dark:bg-slate-900">
              <i class="fa-solid fa-key" aria-hidden="true"></i>
            </span>
            <div>
              <div class="text-xs font-bold text-slate-700 dark:text-slate-200">Lần đổi mật khẩu gần nhất</div>
              <div class="mt-0.5 text-[11px] text-slate-400">Chỉ áp dụng cho mật khẩu đăng nhập riêng của LIMS.</div>
            </div>
          </div>
          <span class="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{{ formatAuditDate(auth.currentUser()?.lastPasswordChangedAt) }}</span>
        </div>
      </app-settings-section>
    </div>
  `,
})
export class AccountSecuritySettingsComponent {
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  readonly unlinkingProvider = signal<'google.com' | 'password' | null>(null);

  async linkGoogle(): Promise<void> {
    try {
      await this.auth.linkGoogleToCurrentUser();
    } catch (error: any) {
      this.toast.show(this.auth.googleRedirectError() || error?.message || 'Không thể liên kết Google.', 'error');
    }
  }

  async unlinkProvider(providerId: 'google.com' | 'password'): Promise<void> {
    if (!this.auth.canUnlinkProvider(providerId)) {
      this.toast.show('Không thể xóa phương thức đăng nhập cuối cùng.', 'error');
      return;
    }

    this.unlinkingProvider.set(providerId);
    try {
      await this.auth.unlinkProvider(providerId);
      this.toast.show(providerId === 'google.com' ? 'Đã hủy liên kết Google.' : 'Đã xóa mật khẩu LIMS.', 'success');
    } catch (error: any) {
      const message = error?.code === 'auth/requires-recent-login'
        ? 'Phiên bảo mật đã cũ. Vui lòng đăng nhập lại rồi thử lại.'
        : error?.message || 'Không thể thay đổi phương thức đăng nhập.';
      this.toast.show(message, 'error');
    } finally {
      this.unlinkingProvider.set(null);
    }
  }

  formatAuditDate(value: any): string {
    if (!value) return 'Chưa ghi nhận';
    const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? 'Chưa ghi nhận' : date.toLocaleString('vi-VN');
  }
}
