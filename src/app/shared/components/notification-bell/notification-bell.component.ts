import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationPanelService } from '../../../core/services/notification-panel.service';

/**
 * NotificationBellComponent
 *
 * Chỉ là một trigger button — không chứa dropdown hay panel.
 * Mọi logic hiển thị thông báo đã được chuyển vào NotificationPanelComponent
 * (render ở root level) thông qua NotificationPanelService.
 *
 * Modes:
 *  - Default:       Nút tròn với icon chuông (dùng trong sidebar desktop)
 *  - bottomNavMode: Nút bottom-nav dạng tab (dùng trong mobile bottom bar)
 *  - asBadge:       Badge nhỏ gắn vào avatar
 */
@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  host: {
    '(click)': '$event.stopPropagation()'
  },
  template: `
    @if (bottomNavMode) {
      <!-- Bottom Nav Tab -->
      <button
        id="notif-bell-mobile"
        (click)="onToggle($event)"
        class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform">
        <div class="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
             [class]="panel.isOpen() ? 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm'
                                     : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
          <i class="fa-solid fa-bell text-base transition-transform duration-200"
             [class.-translate-y-0.5]="panel.isOpen()"
             [class.fa-shake]="unreadCount() > 0 && panel.isOpen()"></i>
          @if (unreadCount() > 0) {
            <span class="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          }
        </div>
        <span class="text-[9px] font-bold transition-colors"
              [class]="panel.isOpen() ? 'text-fuchsia-600 dark:text-fuchsia-400'
                                      : 'text-slate-400 dark:text-slate-500'">Thông báo</span>
      </button>

    } @else if (asBadge) {
      <!-- Badge on Avatar (sidebar footer) -->
      <button
        id="notif-bell-badge"
        (click)="onToggle($event)"
        class="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-transform hover:scale-110 active:scale-95 z-10"
        [ngClass]="unreadCount() > 0 ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'">
        @if (unreadCount() > 0) {
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-full w-full bg-red-500 text-white text-[9px] font-bold items-center justify-center">
            {{ unreadCount() > 9 ? '9+' : unreadCount() }}
          </span>
        } @else {
          <i class="fa-solid fa-bell text-[9px]"></i>
        }
      </button>

    } @else {
      <!-- Default: Standalone round button -->
      <button
        id="notif-bell-default"
        (click)="onToggle($event)"
        class="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95">
        <i class="fa-solid fa-bell text-slate-600 dark:text-slate-300 text-[18px]"
           [class.fa-shake]="unreadCount() > 0 && panel.isOpen()"></i>
        @if (unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[9px] font-bold items-center justify-center border-2 border-white dark:border-slate-800">
              {{ unreadCount() > 9 ? '9+' : unreadCount() }}
            </span>
          </span>
        }
      </button>
    }
  `
})
export class NotificationBellComponent {
  @Input() asBadge      = false;
  @Input() bottomNavMode = false;

  panel         = inject(NotificationPanelService);
  notifications = inject(NotificationService);
  unreadCount   = this.notifications.unreadCount;

  /** stopPropagation ngăn click bubble lên parent (sidebar toggleProfileMenu) */
  onToggle(event: Event) {
    event.stopPropagation();
    this.panel.toggle();
  }
}
