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
        title="Thông báo đẩy (Push Notifications)"
        description="Cho phép thiết bị và trình duyệt hiện tại nhận cảnh báo tức thời từ các sự kiện trong hệ thống LIMS."
        icon="fa-bell">
        <div class="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700/60 dark:bg-slate-900/40">
          <div class="flex items-start gap-3.5">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 border border-slate-200/60 dark:border-slate-700">
              <i class="fa-solid" [class]="pushEnabled() ? 'fa-mobile-screen-button' : 'fa-bell-slash'" aria-hidden="true"></i>
            </div>
            <div>
              <div class="text-sm font-black text-slate-800 dark:text-slate-100">Thiết bị & trình duyệt này</div>
              @if (pushEnabled()) {
                <p class="mt-0.5 text-xs leading-relaxed text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <i class="fa-solid fa-circle-check text-[11px]" aria-hidden="true"></i>Đang nhận thông báo đẩy trên thiết bị này.
                </p>
              } @else {
                <p class="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Thiết bị chưa được kích hoạt nhận thông báo từ hệ thống.
                </p>
              }
            </div>
          </div>
          @if (pushEnabled()) {
            <app-button
              variant="secondary"
              size="sm"
              [loading]="disabling()"
              (click)="disableNotifications()">
              <i class="fa-regular fa-bell-slash" aria-hidden="true"></i>Tắt trên thiết bị này
            </app-button>
          } @else {
            <app-button size="sm" [loading]="enabling()" (click)="enableNotifications()">
              <i class="fa-regular fa-bell" aria-hidden="true"></i>Bật thông báo
            </app-button>
          }
        </div>
        <div class="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
          <i class="fa-solid fa-circle-info mt-0.5 shrink-0 text-slate-400" aria-hidden="true"></i>
          <span>Khi tắt tại đây, LIMS sẽ gỡ mã định danh thiết bị này khỏi danh sách gửi. Quyền hệ thống của trình duyệt vẫn giữ nguyên và có thể tùy chỉnh trong phần cài đặt trang của trình duyệt.</span>
        </div>
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
