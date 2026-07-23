import { Component, inject, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationPanelService } from '../../../core/services/notification-panel.service';

/**
 * NotificationBellComponent
 *
 * Trigger button cho Notification Panel.
 *
 * Modes:
 *  - asBadge:       Badge nhỏ gắn góc trên Avatar (Sidebar footer) — [Xác nhận giữ nguyên]
 *  - bottomNavMode: Tab thông báo trên thanh di động (Mobile Bottom Nav)
 *  - Default:       Nút vuông độc lập bo góc
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

      <!-- ════ BOTTOM NAV TAB (Mobile) ════ -->
      <button
        id="notif-bell-mobile"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform select-none">

        <div class="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
             [class]="panel.isOpen()
               ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-md shadow-fuchsia-500/25'
               : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
          <i class="fa-solid fa-bell text-base transition-all duration-200"
             [class]="panel.isOpen() ? 'text-white -translate-y-0.5' : ''"
             [class.bell-gentle-swing]="unreadCount() > 0 && !panel.isOpen()"></i>

          @if (unreadCount() > 0) {
            <span class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
              <span class="bell-soft-pulse absolute inline-flex h-full w-full rounded-full opacity-65"
                    [class]="hasActionableUnread() ? 'bg-amber-400' : 'bg-red-400'"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 text-white text-[8.5px] font-extrabold items-center justify-center border-2"
                    [class]="panel.isOpen() ? 'border-fuchsia-500' : 'border-white dark:border-slate-900'"
                    [ngClass]="hasActionableUnread() ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm shadow-amber-500/40' : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-sm shadow-red-500/40'">
                {{ unreadCount() > 9 ? '9+' : unreadCount() }}
              </span>
            </span>
          }
        </div>

        <span class="text-[9.5px] font-bold transition-all duration-200"
              [class]="panel.isOpen() ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-slate-400 dark:text-slate-500'">
          Thông Báo
        </span>
      </button>

    } @else if (asBadge) {

      <!-- ════ BADGE ON AVATAR (Sidebar Footer) ════ -->
      <button
        id="notif-bell-badge"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-md transition-all hover:scale-115 active:scale-90 z-10 select-none cursor-pointer"
        [ngClass]="unreadCount() > 0
          ? (hasActionableUnread()
              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/40'
              : 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/40')
          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'">

        @if (unreadCount() > 0) {
          <!-- Soft ambient glow ring -->
          <span class="bell-soft-pulse absolute -inset-0.5 rounded-full opacity-70"
                [class]="hasActionableUnread() ? 'bg-amber-400' : 'bg-rose-500'"></span>
          <span class="relative inline-flex rounded-full h-full w-full text-white text-[8.5px] font-black items-center justify-center"
                [ngClass]="hasActionableUnread() ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-red-500 to-rose-600'">
            {{ unreadCount() > 9 ? '9+' : unreadCount() }}
          </span>
        } @else {
          <i class="fa-solid fa-bell text-[8.5px]"></i>
        }
      </button>

    } @else {

      <!-- ════ DEFAULT: STANDALONE BUTTON ════ -->
      <button
        id="notif-bell-default"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="bell-btn relative w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 overflow-visible select-none"
        [class.bell-btn--active]="panel.isOpen()"
        [class.bell-btn--idle]="!panel.isOpen()">

        <!-- Glow ring khi panel dang mo -->
        @if (panel.isOpen()) {
          <span class="bell-glow-ring"></span>
        }

        <!-- Bell icon với 1-swing animation nhe -->
        <i class="fa-solid fa-bell text-[17px] relative z-10 transition-all duration-200"
           [class]="panel.isOpen() ? 'text-white -translate-y-px' : 'text-slate-500 dark:text-slate-400'"
           [class.bell-gentle-swing]="unreadCount() > 0 && !panel.isOpen()"></i>

        <!-- Unread badge -->
        @if (unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center z-20">
            <span class="bell-soft-pulse absolute inline-flex h-full w-full rounded-full opacity-65"
                  [class]="hasActionableUnread() ? 'bg-amber-400' : 'bg-red-400'"></span>
            <span class="relative inline-flex rounded-full h-[18px] w-[18px] text-white text-[9px] font-black items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm"
                  [ngClass]="hasActionableUnread()
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/40'
                    : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40'">
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    :host-context(.dark) .bell-btn--idle {
      background: #1e293b;
      border-color: #334155;
      box-shadow: none;
    }

    .bell-btn--idle:hover {
      background: #f8fafc;
      border-color: #f0abfc;
      box-shadow: 0 4px 14px rgba(217, 70, 239, 0.15);
    }

    :host-context(.dark) .bell-btn--idle:hover {
      background: #283548;
      border-color: #8b5cf6;
    }

    /* ── Default button: active (panel open) ── */
    .bell-btn--active {
      background: linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%);
      border: 1px solid transparent;
      box-shadow:
        0 4px 16px rgba(217, 70, 239, 0.4),
        0 0 0 3px rgba(217, 70, 239, 0.15);
    }

    :host-context(.dark) .bell-btn--active {
      box-shadow:
        0 4px 16px rgba(217, 70, 239, 0.35),
        0 0 0 3px rgba(217, 70, 239, 0.2);
    }

    /* ── Glow ring pulse khi active ── */
    .bell-glow-ring {
      position: absolute;
      inset: -4px;
      border-radius: 18px;
      border: 2px solid rgba(217, 70, 239, 0.4);
      animation: bellRingPulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
      pointer-events: none;
    }

    /* ── Ambient Soft Pulse cho badge ── */
    .bell-soft-pulse {
      animation: bellSoftPulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }

    /* ── Gentle Swing (chao nhẹ 1 nhịp tự nhiên) ── */
    .bell-gentle-swing {
      animation: bellGentleSwing 2.5s ease-in-out infinite;
      transform-origin: top center;
    }

    @keyframes bellRingPulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50%       { opacity: 0.9; transform: scale(1.05); }
    }

    @keyframes bellSoftPulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50%       { opacity: 0.75; transform: scale(1.25); }
    }

    @keyframes bellGentleSwing {
      0%, 70%, 100% { transform: rotate(0deg); }
      75%           { transform: rotate(10deg); }
      80%           { transform: rotate(-8deg); }
      85%           { transform: rotate(6deg); }
      90%           { transform: rotate(-4deg); }
      95%           { transform: rotate(2deg); }
    }

    /* Performance Lite override */
    :host-context(html.performance-lite) .bell-glow-ring,
    :host-context(html.performance-lite) .bell-soft-pulse,
    :host-context(html.performance-lite) .bell-gentle-swing {
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

  hasActionableUnread = computed(() =>
    this.notifications.notifications()
      .some(n => !n.isRead && (n.type === 'COA_REQUEST' || n.type === 'BORROW_REQUEST'))
  );

  /** stopPropagation ngăn click bubble lên parent (sidebar toggleProfileMenu) */
  onToggle(event: Event) {
    event.stopPropagation();
    this.panel.toggle();
  }
}
