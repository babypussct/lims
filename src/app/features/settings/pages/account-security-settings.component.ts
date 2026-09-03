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
        description="Quản lý các phương thức dùng để xác thực và truy cập vào tài khoản LIMS của bạn."
        icon="fa-shield-halved">
        <div class="space-y-3">
          <!-- Google Account Row -->
          <div class="flex flex-col gap-3.5 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/30 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3.5">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <i class="fa-brands fa-google text-red-500 text-lg" aria-hidden="true"></i>
              </span>
              <div>
                <div class="text-sm font-black text-slate-800 dark:text-slate-100">Tài khoản Google</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">Đăng nhập một chạm tiện lợi và bảo mật bằng tài khoản Google đã liên kết.</div>
              </div>
            </div>
            @if (auth.hasGoogleProvider()) {
              <div class="flex items-center gap-3 sm:shrink-0">
                <span class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <i class="fa-solid fa-circle-check text-[10px]" aria-hidden="true"></i>Đã liên kết
                </span>
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
              <div class="sm:shrink-0">
                <app-button size="sm" (click)="linkGoogle()">Liên kết Google</app-button>
              </div>
            }
          </div>

          <!-- LIMS Password Row -->
          <div class="flex flex-col gap-3.5 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/30 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3.5">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-fuchsia-600 dark:text-fuchsia-400">
                <i class="fa-solid fa-key text-base" aria-hidden="true"></i>
              </span>
              <div>
                <div class="text-sm font-black text-slate-800 dark:text-slate-100">Mật khẩu LIMS dự phòng</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">Mật khẩu dự phòng riêng của hệ thống LIMS khi không dùng Google.</div>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:shrink-0">
              @if (auth.needsPasswordSetup()) {
                <span class="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
                  <i class="fa-solid fa-triangle-exclamation text-[10px]" aria-hidden="true"></i>Cần thiết lập
                </span>
                <app-button size="sm" (click)="auth.openPasswordSetup()">Thiết lập ngay</app-button>
              } @else if (auth.hasPasswordProvider()) {
                <span class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <i class="fa-solid fa-circle-check text-[10px]" aria-hidden="true"></i>Đã bật
                </span>
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
          <div class="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation text-sm"></i>
            <span>{{ auth.googleRedirectError() }}</span>
          </div>
        }

        <div class="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div class="rounded-xl bg-gray-50 p-4 dark:bg-slate-800/70">
            <div class="text-sm font-bold text-slate-700 dark:text-slate-200">Mật khẩu LIMS</div>
            <p class="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Dùng cùng email tài khoản để đăng nhập dự phòng khi không sử dụng Google. Việc đổi mật khẩu được thực hiện trong hộp thoại bảo mật chuyên biệt.
            </p>
            <div class="mt-3">
              <app-button size="sm" (click)="auth.openPasswordSetup()">
                <i class="fa-solid fa-key" aria-hidden="true"></i>{{ auth.hasPasswordProvider() ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu' }}
              </app-button>
            </div>
          </div>
          <div class="rounded-xl bg-gray-50 p-4 dark:bg-slate-800/70">
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Yêu cầu mật khẩu</div>
            <ul class="mt-3 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <li class="flex items-start gap-2"><i class="fa-solid fa-circle-check mt-0.5 text-emerald-500" aria-hidden="true"></i><span>Bắt buộc ít nhất 8 ký tự.</span></li>
              <li class="flex items-start gap-2"><i class="fa-solid fa-lightbulb mt-0.5 text-fuchsia-500" aria-hidden="true"></i><span>Nên tránh khoảng trắng và dùng nhiều nhóm ký tự.</span></li>
              <li class="flex items-start gap-2"><i class="fa-solid fa-shield-halved mt-0.5 text-fuchsia-500" aria-hidden="true"></i><span>Đổi mật khẩu yêu cầu xác thực phù hợp với trạng thái tài khoản.</span></li>
            </ul>
          </div>
        </div>
      </app-settings-section>

      <app-settings-section
        title="Nhật ký bảo mật"
        description="Các mốc bảo mật quan trọng gần nhất của tài khoản."
        icon="fa-clock-rotate-left">
        <div class="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700/60 dark:bg-slate-900/40">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Mật khẩu LIMS cập nhật lần cuối:</span>
          <span class="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{{ formatAuditDate(auth.currentUser()?.lastPasswordChangedAt) }}</span>
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
