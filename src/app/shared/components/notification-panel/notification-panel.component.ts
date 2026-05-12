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
 * Layout:
 *   - Backdrop: fixed inset-0, semi-transparent, closes panel on click
 *   - Drawer:   fixed, left-aligned next to sidebar, slides in from the left
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
        class="fixed inset-0 z-[190] bg-black/30 backdrop-blur-[2px] fade-in md:bg-black/20"
        (click)="panel.close()"
        aria-hidden="true">
      </div>

      <!-- Drawer Panel -->
      <div
        role="dialog"
        aria-label="Thông báo"
        class="fixed top-0 bottom-0 z-[200] w-[calc(100vw-3rem)] max-w-sm bg-white dark:bg-slate-900
               shadow-2xl flex flex-col slide-in-left
               border-r border-slate-100 dark:border-slate-800"
        [style.left]="drawerLeft">

        <!-- Header -->
        <div class="h-16 shrink-0 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/40 flex items-center justify-center">
              <i class="fa-solid fa-bell text-fuchsia-600 dark:text-fuchsia-400 text-sm"></i>
            </div>
            <div>
              <h2 class="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">Thông báo</h2>
              @if (unreadCount() > 0) {
                <p class="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 font-semibold">{{ unreadCount() }} chưa đọc</p>
              } @else {
                <p class="text-[10px] text-slate-400 font-medium">Tất cả đã đọc</p>
              }
            </div>
          </div>

          <div class="flex items-center gap-2">
            @if (unreadCount() > 0) {
              <button
                (click)="markAllAsRead()"
                class="text-[11px] font-semibold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 transition-colors px-2 py-1 rounded-lg hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20">
                Đọc tất cả
              </button>
            }
            <button
              (click)="panel.close()"
              class="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors active:scale-90">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Notification List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          @if (notifications().length === 0) {
            <div class="h-full flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
              <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <i class="fa-regular fa-bell-slash text-2xl text-slate-300 dark:text-slate-600"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-500 dark:text-slate-400 text-sm">Không có thông báo</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Mọi thứ đã cập nhật!</p>
              </div>
            </div>
          } @else {
            <div class="divide-y divide-slate-50 dark:divide-slate-800">
              @for (n of notifications(); track n.id) {
                <div
                  (click)="onNotificationClick(n)"
                  class="px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors relative group"
                  [ngClass]="{'bg-blue-50 dark:bg-blue-950/20': !n.isRead}">

                  <!-- Unread indicator -->
                  @if (!n.isRead) {
                    <span class="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  }

                  <div class="flex gap-3 items-start ml-2">
                    <!-- Icon -->
                    <div class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm" [ngClass]="getIconClass(n.type)">
                      <i class="fa-solid" [ngClass]="getIcon(n.type)"></i>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start gap-2 mb-0.5">
                        <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{{ n.title }}</h4>
                        <span class="text-[10px] whitespace-nowrap text-slate-400 shrink-0 pt-0.5">{{ getTimeAgo(n.createdAt) }}</span>
                      </div>
                      <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{{ n.message }}</p>
                    </div>

                    <!-- Delete (hover) -->
                    <button
                      (click)="deleteNotification(n, $event)"
                      class="shrink-0 w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400
                             flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 dark:hover:bg-red-900/50">
                      <i class="fa-solid fa-trash-can text-[10px]"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .fade-in {
      animation: fadeIn 0.2s ease forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .slide-in-left {
      animation: slideInLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideInLeft {
      from { transform: translateX(-100%); opacity: 0.6; }
      to   { transform: translateX(0);     opacity: 1;   }
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

  /** Căn drawer ngay sát phải sidebar trên desktop, sát mép trái trên mobile */
  get drawerLeft(): string {
    if (typeof window === 'undefined' || window.innerWidth < 768) return '0px';
    const sidebarEl = document.querySelector('aside');
    const w = sidebarEl ? sidebarEl.getBoundingClientRect().width
                        : (this.state.sidebarCollapsed() ? 80 : 256);
    return `${w}px`;
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
