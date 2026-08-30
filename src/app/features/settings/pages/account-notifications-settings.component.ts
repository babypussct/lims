import { Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SettingsSectionComponent } from '../components/settings-section.component';

@Component({
  selector: 'app-account-notifications-settings',
  standalone: true,
  imports: [AppButtonComponent, SettingsSectionComponent],
  template: `
    <div class="space-y-5 fade-in">
      <app-settings-section
        title="Thông báo đẩy"
        description="Cho phép thiết bị hiện tại nhận cảnh báo và cập nhật từ LIMS."
        icon="fa-bell">
        <div class="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900">
          <div>
            <div class="text-sm font-black text-slate-800 dark:text-slate-100">Thiết bị hiện tại</div>
            <p class="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Trình duyệt sẽ yêu cầu quyền thông báo nếu thiết bị chưa được đăng ký.</p>
          </div>
          <app-button [loading]="enabling()" (click)="enableNotifications()">
            <i class="fa-regular fa-bell" aria-hidden="true"></i>Bật thông báo
          </app-button>
        </div>
      </app-settings-section>
    </div>
  `,
})
export class AccountNotificationsSettingsComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly toast = inject(ToastService);
  readonly enabling = signal(false);

  async enableNotifications(): Promise<void> {
    if (this.enabling()) return;
    this.enabling.set(true);
    try {
      const token = await this.notificationService.registerCurrentDevicePushToken({ force: true });
      this.toast.show(
        token ? 'Đã bật thông báo đẩy trên thiết bị này.' : 'Bạn đã từ chối quyền hoặc trình duyệt không hỗ trợ.',
        token ? 'success' : 'error',
      );
    } catch (error: any) {
      this.toast.show(`Lỗi: ${error?.message || error}`, 'error');
    } finally {
      this.enabling.set(false);
    }
  }
}
