import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SettingsSectionComponent } from '../components/settings-section.component';

@Component({
  selector: 'app-account-privacy-settings',
  standalone: true,
  imports: [RouterLink, AppButtonComponent, SettingsSectionComponent],
  template: `
    <div class="space-y-5 fade-in">
      <app-settings-section
        title="Quyền riêng tư"
        description="Xem chính sách và cách thức hệ thống LIMS lưu trữ thông tin nhận dạng tài khoản."
        icon="fa-user-shield">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
          <div>
            <div class="text-sm font-bold text-slate-800 dark:text-slate-200">Chính sách bảo mật dữ liệu</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tìm hiểu chi tiết về cam kết bảo vệ dữ liệu và quyền cá nhân của bạn.</div>
          </div>
          <a routerLink="/privacy-policy" class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-fuchsia-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-fuchsia-300 dark:hover:bg-slate-700">
            <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>Xem Chính sách
          </a>
        </div>
      </app-settings-section>

      <app-settings-section
        title="Vùng thao tác nhạy cảm (Danger zone)"
        description="Ẩn danh hóa email và ảnh đại diện khỏi hệ thống. Tên hiển thị và UID được bảo toàn cho nhật ký kiểm toán (audit trail)."
        icon="fa-triangle-exclamation"
        variant="danger">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-2">
          <div class="max-w-xl text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Hành động này sẽ xóa vĩnh viễn email và avatar đã liên kết với tài khoản. Sau khi hoàn tất, bạn sẽ được đăng xuất khỏi hệ thống.
          </div>
          <app-button variant="danger" [loading]="anonymizing()" (click)="anonymizeAccount()">
            <i class="fa-solid fa-user-slash" aria-hidden="true"></i>Ẩn danh hóa tài khoản
          </app-button>
        </div>
      </app-settings-section>
    </div>
  `,
})
export class AccountPrivacySettingsComponent {
  private readonly auth = inject(AuthService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly toast = inject(ToastService);
  readonly anonymizing = signal(false);

  async anonymizeAccount(): Promise<void> {
    if (this.anonymizing()) return;
    const confirmed = await this.confirmation.confirm({
      message: 'Email và ảnh đại diện sẽ bị ẩn danh hóa. Tên hiển thị và UID vẫn được giữ cho audit. Tiếp tục?',
      confirmText: 'Ẩn danh hóa tài khoản',
      isDangerous: true,
    });
    if (!confirmed) return;

    this.anonymizing.set(true);
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error('Chưa đăng nhập');
      const idToken = await user.getIdToken();
      const response = await fetch('/api/account/delete-request', {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'Lỗi máy chủ');
      }
      this.toast.show('Đã ẩn danh hóa thông tin cá nhân.', 'success');
      await this.auth.logout();
    } catch (error: any) {
      this.toast.show(`Lỗi: ${error?.message || error}`, 'error');
    } finally {
      this.anonymizing.set(false);
    }
  }
}
