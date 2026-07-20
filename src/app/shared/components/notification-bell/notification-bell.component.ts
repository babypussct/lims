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
 *  - Default:       Nút vuông bo góc với icon chuông (dùng trong sidebar desktop)
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

      <!-- ════ BOTTOM NAV TAB ════ -->
      <button
        id="notif-bell-mobile"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform">

        <div class="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
             [class]="panel.isOpen()
               ? 'bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-md shadow-fuchsia-400/30'
               : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
          <i class="fa-solid fa-bell text-base transition-all duration-200"
             [class]="panel.isOpen() ? 'text-white -translate-y-0.5' : ''"
             [class.fa-shake]="unreadCount() > 0 && !panel.isOpen()"></i>

          @if (unreadCount() > 0) {
            <span class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[8px] font-black items-center justify-center border-2"
                    [class]="panel.isOpen() ? 'border-fuchsia-500' : 'border-white dark:border-slate-900'">
                {{ unreadCount() > 9 ? '9+' : unreadCount() }}
              </span>
            </span>
          }
        </div>

        <span class="text-[9px] font-bold transition-all duration-200"
              [class]="panel.isOpen() ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-slate-400 dark:text-slate-500'">
          Thông báo
        </span>
      </button>

    } @else if (asBadge) {

      <!-- ════ BADGE ON AVATAR (sidebar footer) ════ -->
      <button
        id="notif-bell-badge"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-all hover:scale-110 active:scale-95 z-10"
        [ngClass]="unreadCount() > 0
          ? 'bg-gradient-to-br from-red-500 to-rose-500 text-white'
          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'">

        @if (unreadCount() > 0) {
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
          <span class="relative inline-flex rounded-full h-full w-full bg-gradient-to-br from-red-500 to-rose-500 text-white text-[8px] font-black items-center justify-center">
            {{ unreadCount() > 9 ? '9+' : unreadCount() }}
          </span>
        } @else {
          <i class="fa-solid fa-bell text-[8px]"></i>
        }
      </button>

    } @else {

      <!-- ════ DEFAULT: SIDEBAR DESKTOP BUTTON ════ -->
      <button
        id="notif-bell-default"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="bell-btn relative w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 overflow-visible"
        [class.bell-btn--active]="panel.isOpen()"
        [class.bell-btn--idle]="!panel.isOpen()">

        <!-- Glow ring khi active -->
        @if (panel.isOpen()) {
          <span class="bell-glow-ring"></span>
        }

        <!-- Bell icon -->
        <i class="fa-solid fa-bell text-[17px] relative z-10 transition-all duration-200"
           [class]="panel.isOpen() ? 'text-white -translate-y-px' : 'text-slate-500 dark:text-slate-400'"
           [class.fa-shake]="unreadCount() > 0 && !panel.isOpen()"></i>

        <!-- Unread badge -->
        @if (unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center z-20">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-[18px] w-[18px] bg-gradient-to-br from-red-500 to-rose-500
                         text-white text-[9px] font-black items-center justify-center
                         border-2 border-white dark:border-slate-900 shadow-sm shadow-red-500/30">
              {{ unreadCount() > 9 ? '9+' : unreadCount() }}
            </span>
          </span>
        }
      </button>
    }
  `,
  styles: [`
    /* ── Default button: idle ── */
    .bell-btn--idle {
      background: white;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    :host-context(.dark) .bell-btn--idle {
      background: #1e293b;
      border-color: #334155;
      box-shadow: none;
    }

    .bell-btn--idle:hover {
      background: #f8fafc;
      border-color: #e9d5ff;
      box-shadow: 0 2px 12px rgba(217, 70, 239, 0.12);
    }

    :host-context(.dark) .bell-btn--idle:hover {
      background: #283548;
      border-color: #6b21a8;
    }

    /* ── Default button: active (panel open) ── */
    .bell-btn--active {
      background: linear-gradient(135deg, #d946ef 0%, #ec4899 100%);
      border: 1px solid transparent;
      box-shadow:
        0 4px 14px rgba(217, 70, 239, 0.4),
        0 0 0 3px rgba(217, 70, 239, 0.12);
    }

    :host-context(.dark) .bell-btn--active {
      box-shadow:
        0 4px 14px rgba(217, 70, 239, 0.35),
        0 0 0 3px rgba(217, 70, 239, 0.15);
    }

    /* ── Glow ring pulse ── */
    .bell-glow-ring {
      position: absolute;
      inset: -4px;
      border-radius: 18px;
      border: 2px solid rgba(217, 70, 239, 0.35);
      animation: bellRingPulse 1.8s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes bellRingPulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.04); }
    }

    /* performance-lite: tắt mọi animation */
    :host-context(html.performance-lite) .bell-glow-ring {
      animation: none !important;
    }
  `]
})
export class NotificationBellComponent {
  @Input() asBadge       = false;
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
