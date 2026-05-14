import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationPanelService } from '../../../core/services/notification-panel.service';
import { StateService } from '../../../core/services/state.service';
import { AppNotification } from '../../../core/models/notification.model';

/**
 * NotificationPanelComponent
 *
 * Rendered once at the app root level (app.component.ts), completely outside
 * the sidebar DOM tree. This ensures no stacking-context / z-index clipping.
 *
 * Open/Close state is managed exclusively by NotificationPanelService (signal-based).
 */
@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (panel.isOpen()) {
      <!-- Backdrop -->
      <div
        class="notif-backdrop fixed inset-0 z-[190]"
        (click)="panel.close()"
        aria-hidden="true">
      </div>

      <!-- Drawer Panel -->
      <div
        role="dialog"
        aria-label="Thông báo"
        class="notif-drawer fixed z-[200] flex flex-col"
        [style.left]="drawerLeft">

        <!-- Header -->
        <div class="notif-header shrink-0">
          <div class="flex items-center gap-3">
            <div class="notif-header-icon">
              <i class="fa-solid fa-bell text-sm"></i>
            </div>
            <div>
              <h2 class="font-bold text-slate-800 dark:text-slate-100 text-[15px] leading-tight">Thông báo</h2>
              @if (unreadCount() > 0) {
                <p class="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 font-bold mt-0.5">{{ unreadCount() }} chưa đọc</p>
              } @else {
                <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Tất cả đã đọc</p>
              }
            </div>
          </div>

          <div class="flex items-center gap-1">
            @if (unreadCount() > 0) {
              <button
                (click)="markAllAsRead()"
                class="text-[11px] font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300
                       px-2.5 py-1.5 rounded-lg hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 transition-all active:scale-95">
                Đọc tất cả
              </button>
            }
            <button
              (click)="panel.close()"
              class="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500
                     hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300
                     transition-all active:scale-90">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Notification List -->
        <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          @if (notifications().length === 0) {
            <!-- Empty State -->
            <div class="h-full flex flex-col items-center justify-center gap-5 py-20 px-8 text-center">
              <div class="notif-empty-icon">
                <i class="fa-regular fa-bell-slash text-3xl text-slate-300 dark:text-slate-600"></i>
              </div>
              <div>
                <p class="font-bold text-slate-500 dark:text-slate-400 text-sm">Không có thông báo</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">Các thông báo mới sẽ xuất hiện ở đây khi có hoạt động liên quan.</p>
              </div>
            </div>
          } @else {
            <!-- Notification Items -->
            @for (n of notifications(); track n.id) {
              <div
                (click)="onNotificationClick(n)"
                class="notif-item group"
                [ngClass]="{'notif-item--unread': !n.isRead}">

                <!-- Unread indicator -->
                @if (!n.isRead) {
                  <span class="notif-unread-dot"></span>
                }

                <div class="flex gap-3 items-start ml-2">
                  <!-- Icon -->
                  <div class="notif-type-icon" [ngClass]="getIconClass(n.type)">
                    <i class="fa-solid" [ngClass]="getIcon(n.type)"></i>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start gap-2 mb-0.5">
                      <h4 class="font-bold text-[13px] text-slate-800 dark:text-slate-200 truncate">{{ n.title }}</h4>
                      <span class="text-[10px] whitespace-nowrap text-slate-400 dark:text-slate-500 shrink-0 pt-0.5 font-medium">{{ getTimeAgo(n.createdAt) }}</span>
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap break-words" [class.line-clamp-2]="!isExpanded(n)">{{ n.message }}</div>
                    @if (n.message && n.message.length > 90) {
                      <button (click)="toggleExpand(n, $event)" class="text-[10px] font-bold text-blue-500 hover:text-blue-600 mt-0.5 transition inline-block">
                        {{ isExpanded(n) ? 'Ẩn bớt' : 'Xem thêm' }}
                      </button>
                    }
                  </div>

                  <!-- Delete (hover) -->
                  <button
                    (click)="deleteNotification(n, $event)"
                    class="notif-delete-btn"
                    title="Xoá thông báo">
                    <i class="fa-solid fa-trash-can text-[10px]"></i>
                  </button>
                </div>
              </div>
            }
          }
        </div>

        <!-- Footer -->
        <div class="notif-footer shrink-0">
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{{ notifications().length }} thông báo</span>
        </div>
      </div>
    }
  `,
  styles: [`
    /* === Backdrop === */
    .notif-backdrop {
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(2px);
      animation: notifFadeIn 0.2s ease forwards;
    }

    /* === Drawer === */
    .notif-drawer {
      top: 12px;
      bottom: 12px;
      width: min(380px, calc(100vw - 2rem));
      background: white;
      border-radius: 20px;
      box-shadow:
        0 25px 60px -12px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(0, 0, 0, 0.04);
      animation: notifSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      overflow: hidden;
    }

    :host-context(.dark) .notif-drawer {
      background: #0f172a;
      box-shadow:
        0 25px 60px -12px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.06);
    }

    /* === Header === */
    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #f1f5f9;
    }

    :host-context(.dark) .notif-header {
      border-bottom-color: #1e293b;
    }

    .notif-header-icon {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: linear-gradient(135deg, #f0abfc 0%, #d946ef 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(217, 70, 239, 0.3);
    }

    /* === Footer === */
    .notif-footer {
      padding: 10px 20px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host-context(.dark) .notif-footer {
      border-top-color: #1e293b;
    }

    /* === Empty State Icon === */
    .notif-empty-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host-context(.dark) .notif-empty-icon {
      background: #1e293b;
    }

    /* === Notification Item === */
    .notif-item {
      position: relative;
      padding: 14px 16px;
      cursor: pointer;
      transition: background-color 0.15s ease;
      border-bottom: 1px solid #f8fafc;
    }

    :host-context(.dark) .notif-item {
      border-bottom-color: #1e293b;
    }

    .notif-item:hover {
      background: #f8fafc;
    }

    :host-context(.dark) .notif-item:hover {
      background: rgba(30, 41, 59, 0.6);
    }

    .notif-item--unread {
      background: #eff6ff;
    }

    :host-context(.dark) .notif-item--unread {
      background: rgba(30, 58, 138, 0.1);
    }

    .notif-item--unread:hover {
      background: #dbeafe;
    }

    :host-context(.dark) .notif-item--unread:hover {
      background: rgba(30, 58, 138, 0.18);
    }

    .notif-item:last-child {
      border-bottom: none;
    }

    /* === Unread Dot === */
    .notif-unread-dot {
      position: absolute;
      left: 7px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #3b82f6;
      box-shadow: 0 0 6px rgba(59, 130, 246, 0.4);
    }

    /* === Type Icon === */
    .notif-type-icon {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }

    /* === Delete Button === */
    .notif-delete-btn {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #fee2e2;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.15s ease;
      margin-top: 2px;
    }

    :host-context(.dark) .notif-delete-btn {
      background: rgba(127, 29, 29, 0.2);
      color: #f87171;
    }

    .notif-item:hover .notif-delete-btn {
      opacity: 1;
    }

    .notif-delete-btn:hover {
      background: #fecaca;
      transform: scale(1.1);
    }

    :host-context(.dark) .notif-delete-btn:hover {
      background: rgba(127, 29, 29, 0.35);
    }

    /* === Animations === */
    @keyframes notifFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes notifSlideIn {
      from { transform: translateX(-16px); opacity: 0; }
      to   { transform: translateX(0);     opacity: 1; }
    }

    /* Mobile: slide from bottom */
    @media (max-width: 767px) {
      .notif-drawer {
        top: auto !important;
        bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important;
        left: 8px !important;
        right: 8px !important;
        width: auto !important;
        max-height: 70vh;
        border-radius: 20px;
        animation: notifSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes notifSlideUp {
        from { transform: translateY(24px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
    }
  `]
})
export class NotificationPanelComponent {
  panel              = inject(NotificationPanelService);
  notificationService = inject(NotificationService);
  state              = inject(StateService);
  router             = inject(Router);

  notifications = this.notificationService.notifications;
  unreadCount   = this.notificationService.unreadCount;
  
  expandedIds = new Set<string>();

  isExpanded(n: AppNotification): boolean {
      return this.expandedIds.has(n.id || '');
  }

  toggleExpand(n: AppNotification, event: Event) {
      event.stopPropagation();
      const id = n.id || '';
      if (this.expandedIds.has(id)) {
          this.expandedIds.delete(id);
      } else {
          this.expandedIds.add(id);
      }
  }

  /** Căn drawer ngay sát phải sidebar trên desktop, sát mép trái trên mobile */
  get drawerLeft(): string {
    if (typeof window === 'undefined' || window.innerWidth < 768) return '0px';
    const sidebarEl = document.querySelector('aside');
    const w = sidebarEl ? sidebarEl.getBoundingClientRect().width
                        : (this.state.sidebarCollapsed() ? 80 : 256);
    return `${w + 12}px`;
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.panel.close(); }

  async markAllAsRead() {
    await this.notificationService.markAllAsRead();
  }

  async deleteNotification(n: AppNotification, event: Event) {
    event.stopPropagation();
    if (n.id) await this.notificationService.deleteNotification(n.id);
  }

  async onNotificationClick(n: AppNotification) {
    if (!n.isRead && n.id) this.notificationService.markAsRead(n.id);
    this.panel.close();
    if (n.actionUrl) this.router.navigateByUrl(n.actionUrl);
  }

  getIconClass(type: string): string {
    const map: Record<string, string> = {
      'COA_REQUEST':      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'BORROW_REQUEST':   'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'REQUEST_APPROVED': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      'REQUEST_REJECTED': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      'STOCK_LOW_ALERT':  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      'SYSTEM_UPDATE':    'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return map[type] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  }

  getIcon(type: string): string {
    const map: Record<string, string> = {
      'COA_REQUEST':      'fa-file-signature',
      'BORROW_REQUEST':   'fa-hand-holding-hand',
      'REQUEST_APPROVED': 'fa-circle-check',
      'REQUEST_REJECTED': 'fa-circle-xmark',
      'STOCK_LOW_ALERT':  'fa-triangle-exclamation',
      'SYSTEM_UPDATE':    'fa-bullhorn',
    };
    return map[type] ?? 'fa-bell';
  }

  getTimeAgo(timestamp: number): string {
    if (!timestamp) return '';
    const min = Math.floor((Date.now() - timestamp) / 60000);
    if (min < 1)  return 'Vừa xong';
    if (min < 60) return `${min} phút trước`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    return `${Math.floor(hrs / 24)} ngày trước`;
  }
}
