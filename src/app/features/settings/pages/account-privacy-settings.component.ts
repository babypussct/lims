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
        description="Xem chính sách và cách LIMS lưu thông tin nhận dạng tài khoản."
        icon="fa-user-shield">
        <a routerLink="/privacy-policy" class="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-indigo-600 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800">
          <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>Xem Chính sách Bảo mật
        </a>
      </app-settings-section>

      <section class="rounded-2xl border border-red-200 bg-red-50/60 p-5 dark:border-red-900/50 dark:bg-red-950/20">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="max-w-2xl">
            <h2 class="text-base font-black text-red-700 dark:text-red-300">Danger zone</h2>
            <p class="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Ẩn danh hóa email và avatar khỏi hệ thống. Tên hiển thị và UID vẫn được giữ để bảo toàn audit trail.</p>
          </div>
          <app-button variant="danger" [loading]="anonymizing()" (click)="anonymizeAccount()">
            <i class="fa-solid fa-user-slash" aria-hidden="true"></i>Ẩn danh hóa
          </app-button>
        </div>
      </section>
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
