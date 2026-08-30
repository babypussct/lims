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
        title="Phương thức đăng nhập"
        description="Quản lý các phương thức có thể dùng để truy cập cùng một tài khoản LIMS."
        icon="fa-shield-halved">
        <div class="divide-y divide-slate-100 dark:divide-slate-700">
          <div class="flex flex-col gap-3 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900">
                <i class="fa-brands fa-google text-red-500" aria-hidden="true"></i>
              </span>
              <div>
                <div class="text-sm font-black text-slate-800 dark:text-slate-100">Tài khoản Google</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">Đăng nhập một chạm bằng tài khoản Google đã liên kết.</div>
              </div>
            </div>
            @if (auth.hasGoogleProvider()) {
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-circle-check mr-1" aria-hidden="true"></i>Đã liên kết</span>
                <app-button
                  variant="secondary"
                  size="sm"
                  [disabled]="!auth.canUnlinkProvider('google.com') || unlinkingProvider() === 'google.com'"
                  [loading]="unlinkingProvider() === 'google.com'"
                  (click)="unlinkProvider('google.com')">
                  Hủy liên kết
                </app-button>
              </div>
            } @else {
              <app-button size="sm" (click)="linkGoogle()">Liên kết Google</app-button>
            }
          </div>

          <div class="flex flex-col gap-3 py-3 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-fuchsia-500 dark:bg-slate-900">
                <i class="fa-solid fa-key" aria-hidden="true"></i>
              </span>
              <div>
                <div class="text-sm font-black text-slate-800 dark:text-slate-100">Mật khẩu LIMS</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">Mật khẩu dự phòng riêng của LIMS, không phải mật khẩu Google.</div>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              @if (auth.needsPasswordSetup()) {
                <span class="text-xs font-bold text-amber-600 dark:text-amber-400">Cần thiết lập</span>
                <app-button size="sm" (click)="auth.openPasswordSetup()">Thiết lập</app-button>
              } @else if (auth.hasPasswordProvider()) {
                <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-circle-check mr-1" aria-hidden="true"></i>Đã bật</span>
                <app-button variant="secondary" size="sm" (click)="auth.openPasswordSetup()">Đổi mật khẩu</app-button>
                <app-button
                  variant="secondary"
                  size="sm"
                  [disabled]="!auth.canUnlinkProvider('password') || unlinkingProvider() === 'password'"
                  [loading]="unlinkingProvider() === 'password'"
                  (click)="unlinkProvider('password')">
                  Xóa mật khẩu
                </app-button>
              } @else {
                <span class="text-xs font-bold text-slate-400">Chưa bật</span>
              }
            </div>
          </div>
        </div>

        @if (auth.googleRedirectError()) {
          <div class="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{{ auth.googleRedirectError() }}</div>
        }
      </app-settings-section>

      <app-settings-section
        title="Nhật ký bảo mật"
        description="Các mốc bảo mật quan trọng gần nhất của tài khoản."
        icon="fa-clock-rotate-left">
        <div class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900">
          <span class="text-sm text-slate-500 dark:text-slate-400">Mật khẩu LIMS cập nhật lần cuối</span>
          <span class="text-sm font-bold text-slate-800 dark:text-slate-200">{{ formatAuditDate(auth.currentUser()?.lastPasswordChangedAt) }}</span>
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
