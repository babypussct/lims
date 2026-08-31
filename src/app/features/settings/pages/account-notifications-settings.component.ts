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
            @if (pushEnabled()) {
              <p class="mt-1 text-sm leading-relaxed text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-circle-check mr-1" aria-hidden="true"></i>Đang nhận thông báo đẩy trên thiết bị này.</p>
            } @else {
              <p class="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Trình duyệt sẽ yêu cầu quyền thông báo nếu thiết bị chưa được đăng ký.</p>
            }
          </div>
          @if (pushEnabled()) {
            <app-button
              variant="secondary"
              [loading]="disabling()"
              (click)="disableNotifications()">
              <i class="fa-regular fa-bell-slash" aria-hidden="true"></i>Tắt trên thiết bị này
            </app-button>
          } @else {
            <app-button [loading]="enabling()" (click)="enableNotifications()">
              <i class="fa-regular fa-bell" aria-hidden="true"></i>Bật thông báo
            </app-button>
          }
        </div>
        <p class="mt-3 text-xs leading-relaxed text-slate-400 dark:text-slate-500">Tắt tại đây sẽ gỡ đăng ký thiết bị khỏi LIMS. Quyền thông báo của trình duyệt vẫn giữ nguyên và có thể được thay đổi trong cài đặt trình duyệt.</p>
      </app-settings-section>
    </div>
  `,
})
export class AccountNotificationsSettingsComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly toast = inject(ToastService);
  readonly enabling = signal(false);
  readonly disabling = signal(false);
  readonly pushEnabled = this.notificationService.currentDevicePushEnabled;

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

  async disableNotifications(): Promise<void> {
    if (this.disabling()) return;
    this.disabling.set(true);
    try {
      const removed = await this.notificationService.disableCurrentDevicePushNotifications();
      this.toast.show(
        removed ? 'Đã tắt thông báo đẩy trên thiết bị này.' : 'Thiết bị này chưa được đăng ký nhận thông báo.',
        'success',
      );
    } catch (error: any) {
      this.toast.show(`Không thể tắt thông báo: ${error?.message || error}`, 'error');
    } finally {
      this.disabling.set(false);
    }
  }
}
