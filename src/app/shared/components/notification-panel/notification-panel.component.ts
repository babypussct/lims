import { Component, inject, HostListener, signal, computed, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationPanelService } from '../../../core/services/notification-panel.service';
import { StateService } from '../../../core/services/state.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppNotification, NotificationType } from '../../../core/models/notification.model';

type TabId = 'all' | 'unread' | 'system';

interface DateGroup {
  label: string;
  items: AppNotification[];
}

/**
 * NotificationPanelComponent — Premium Inbox v2
 *
 * Rendered once at the app root level (app.component.ts), completely outside
 * the sidebar DOM tree. This ensures no stacking-context / z-index clipping.
 *
 * Features:
 *  - 3-tab filter: Tất cả | Chưa đọc | Hệ thống
 *  - Date grouping: Hôm nay | Hôm qua | Tuần này | Cũ hơn
 *  - Action chip per notification (if actionUrl present)
 *  - Gradient header with unread badge
 *  - Actions dropdown: Xóa đã đọc / Xóa tất cả với dialog xác nhận
 *  - Pagination / Load More
 *  - Expand/collapse long messages
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
        [style.left]="panelPos.left"
        [style.bottom]="panelPos.bottom">

        <!-- ── Header ── -->
        <div class="notif-header shrink-0">
          <div class="flex items-center gap-3">
            <div class="notif-header-icon">
              <i class="fa-solid fa-bell text-sm"></i>
            </div>
            <div>
              <h2 class="font-bold text-slate-800 dark:text-slate-100 text-[15px] leading-tight">Thông báo</h2>
              @if (unreadCount() > 0) {
                <p class="text-[10px] font-bold mt-0.5 flex items-center gap-1">
                  <span class="notif-unread-pill">{{ unreadCount() }} chưa đọc</span>
                </p>
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

            @if (totalCount() > 0) {
              <div class="relative notif-actions-wrapper">
                <button
                  (click)="toggleActionsMenu()"
                  class="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500
                         hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300
                         transition-all active:scale-90"
                  title="Tùy chọn">
                  <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
                </button>

                @if (showActionsMenu()) {
                  <div class="notif-actions-dropdown">
                    @if (readCount() > 0) {
                      <button (click)="onDeleteRead()" class="notif-action-item">
                        <i class="fa-solid fa-check-double text-emerald-500"></i>
                        <span>Xóa đã đọc ({{ readCount() }})</span>
                      </button>
                    }
                    <button (click)="onDeleteAll()" class="notif-action-item notif-action-item--danger">
                      <i class="fa-solid fa-trash-can text-red-500"></i>
                      <span>Xóa tất cả ({{ totalCount() }})</span>
                    </button>
                  </div>
                }
              </div>
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

        <!-- ── Tab Filter Bar ── -->
        <div class="notif-tab-bar shrink-0">
          @for (tab of tabs; track tab.id) {
            <button
              (click)="activeTab.set(tab.id)"
              class="notif-tab"
              [class.notif-tab--active]="activeTab() === tab.id">
              {{ tab.label }}
              @if (tab.count() > 0) {
                <span class="notif-tab-count" [class.notif-tab-count--active]="activeTab() === tab.id">
                  {{ tab.count() }}
                </span>
              }
            </button>
          }
        </div>

        <!-- ── Notification List ── -->
        <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          @if (filteredGroups().length === 0) {
            <!-- Empty State -->
            <div class="h-full flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
              <div class="notif-empty-icon">
                <i class="fa-regular text-3xl text-slate-300 dark:text-slate-600" [ngClass]="emptyIcon()"></i>
              </div>
              <div>
                <p class="font-bold text-slate-500 dark:text-slate-400 text-sm">
                  {{ emptyTitle() }}
                </p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
                  {{ emptySubtitle() }}
                </p>
              </div>
            </div>
          } @else {
            <!-- Date Groups -->
            @for (group of filteredGroups(); track group.label) {
              <!-- Sticky date separator -->
              <div class="notif-date-separator">
                <span class="notif-date-label">{{ group.label }}</span>
              </div>

              <!-- Items in group -->
              @for (n of group.items; track n.id) {
                <div
                  (click)="onNotificationClick(n)"
                  class="notif-item group"
                  [class.notif-item--unread]="!n.isRead"
                  [class.notif-item--actionable]="!n.isRead && isActionable(n.type)"
                  [class.notif-item--informational]="isInformational(n.type)">

                  <!-- Unread accent bar -->
                  @if (!n.isRead) {
                    <span class="notif-accent-bar"></span>
                  }

                  <div class="flex gap-3 items-start" [class.pl-3]="!n.isRead" [class.pl-5]="n.isRead">
                    <!-- Type Icon -->
                    <div class="notif-type-icon shrink-0" [ngClass]="getIconClass(n.type)">
                      <i class="fa-solid" [ngClass]="getIcon(n.type)"></i>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start gap-2 mb-0.5">
                        <h4 class="font-bold text-[13px] text-slate-800 dark:text-slate-200 leading-snug"
                            [class.truncate]="!isExpanded(n)">{{ n.title }}</h4>
                        <span class="text-[10px] whitespace-nowrap text-slate-400 dark:text-slate-500 shrink-0 pt-0.5 font-medium"
                              [title]="getFullDate(n.createdAt)">{{ getTimeAgo(n.createdAt) }}</span>
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap break-words"
                           [class.line-clamp-2]="!isExpanded(n)">{{ n.message }}</div>
                      @if (n.message && n.message.length > 90) {
                        <button (click)="toggleExpand(n, $event)"
                                class="text-[10px] font-bold text-blue-500 hover:text-blue-600 mt-0.5 transition inline-block">
                          {{ isExpanded(n) ? 'Ẩn bớt ↑' : 'Xem thêm ↓' }}
                        </button>
                      }

                      <!-- Action Chip -->
                      @if (n.actionUrl) {
                        <div class="mt-1.5">
                          <span class="notif-action-chip" [ngClass]="getChipClass(n.type)">
                            <i class="fa-solid fa-arrow-right text-[8px]"></i>
                            {{ getActionLabel(n.type) }}
                          </span>
                        </div>
                      }
                    </div>

                    <!-- Delete (hover) -->
                    <button
                      (click)="deleteNotification(n, $event)"
                      class="notif-delete-btn shrink-0"
                      title="Xoá thông báo">
                      <i class="fa-solid fa-trash-can text-[10px]"></i>
                    </button>
                  </div>
                </div>
              }
            }

            @if (hasMore()) {
              <div class="p-3">
                <button (click)="loadMore()" class="notif-load-more-btn">
                  <i class="fa-solid fa-chevron-down text-[10px]"></i>
                  <span>Xem thêm {{ totalCount() - displayLimit() }} thông báo</span>
                </button>
              </div>
            }
          }
        </div>

        <!-- ── Footer ── -->
        <div class="notif-footer shrink-0">
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            @if (totalCount() > displayLimit()) {
              Hiển thị {{ notifications().length }} / {{ totalCount() }} thông báo
            } @else {
              {{ totalCount() }} thông báo
            }
          </span>
          <button
            (click)="goToSettings()"
            class="text-[10px] font-bold text-fuchsia-500 hover:text-fuchsia-600 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 transition-colors flex items-center gap-1">
            <i class="fa-solid fa-gear text-[9px]"></i>
            Cài đặt thông báo
          </button>
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

    /* === Drawer ===
     * Desktop: popup cạnh sidebar, gắn dưới (gần bell), slide lên.
     * Bottom căn theo footer sidebar (~70px) + margin 12px.
     */
    .notif-drawer {
      bottom: 0;           /* overridden by [style.bottom] */
      left: 0;             /* overridden by [style.left]   */
      width: min(380px, calc(100vw - 2rem));
      max-height: min(680px, calc(100vh - 80px));
      background: white;
      border-radius: 20px;
      box-shadow:
        0 -4px 6px -1px rgba(0,0,0,0.04),
        0 20px 50px -8px rgba(0, 0, 0, 0.22),
        0 0 0 1px rgba(0, 0, 0, 0.04);
      animation: notifPopUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
      padding: 16px 20px 14px;
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
      flex-shrink: 0;
    }

    /* Unread pill badge in header */
    .notif-unread-pill {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, #f0abfc, #d946ef);
      color: white;
      font-size: 9px;
      font-weight: 800;
      padding: 1px 7px;
      border-radius: 999px;
      letter-spacing: 0.02em;
      animation: notifPillPulse 2s ease-in-out infinite;
    }

    @keyframes notifPillPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.75; }
    }

    /* === Actions Dropdown === */
    .notif-actions-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 6px;
      width: 190px;
      background: white;
      border-radius: 14px;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
      padding: 6px;
      z-index: 50;
      animation: notifPopUp 0.18s ease-out forwards;
    }

    :host-context(.dark) .notif-actions-dropdown {
      background: #1e293b;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .notif-action-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      transition: background 0.15s ease;
      cursor: pointer;
    }

    :host-context(.dark) .notif-action-item {
      color: #cbd5e1;
    }

    .notif-action-item:hover {
      background: #f1f5f9;
    }

    :host-context(.dark) .notif-action-item:hover {
      background: #334155;
    }

    .notif-action-item--danger:hover {
      background: #fef2f2;
      color: #ef4444;
    }

    :host-context(.dark) .notif-action-item--danger:hover {
      background: rgba(127, 29, 29, 0.25);
      color: #f87171;
    }

    /* === Load More Button === */
    .notif-load-more-btn {
      width: 100%;
      padding: 8px 12px;
      border-radius: 12px;
      border: 1.5px dashed #cbd5e1;
      background: #fafafa;
      color: #64748b;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.18s ease;
      cursor: pointer;
    }

    :host-context(.dark) .notif-load-more-btn {
      border-color: #334155;
      background: #0f172a;
      color: #94a3b8;
    }

    .notif-load-more-btn:hover {
      border-color: #d946ef;
      color: #a21caf;
      background: #fdf4ff;
    }

    :host-context(.dark) .notif-load-more-btn:hover {
      border-color: #c084fc;
      color: #e879f9;
      background: rgba(192, 132, 252, 0.1);
    }

    /* === Actionable & Informational variants === */
    .notif-item--actionable {
      background: linear-gradient(90deg, rgba(254, 243, 199, 0.6) 0%, rgba(255, 251, 235, 0.4) 100%);
    }

    :host-context(.dark) .notif-item--actionable {
      background: linear-gradient(90deg, rgba(180, 83, 9, 0.15) 0%, rgba(180, 83, 9, 0.05) 100%);
    }

    .notif-item--informational .notif-type-icon {
      width: 30px;
      height: 30px;
      font-size: 11px;
    }

    /* === Tab Bar === */
    .notif-tab-bar {
      display: flex;
      gap: 2px;
      padding: 8px 12px;
      border-bottom: 1px solid #f1f5f9;
      background: #fafafa;
    }

    :host-context(.dark) .notif-tab-bar {
      border-bottom-color: #1e293b;
      background: #0c1526;
    }

    .notif-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 6px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      transition: all 0.18s ease;
      border: 1.5px solid transparent;
      cursor: pointer;
      white-space: nowrap;
    }

    :host-context(.dark) .notif-tab {
      color: #64748b;
    }

    .notif-tab:hover {
      background: #f1f5f9;
      color: #334155;
    }

    :host-context(.dark) .notif-tab:hover {
      background: #1e293b;
      color: #cbd5e1;
    }

    .notif-tab--active {
      background: white;
      color: #a21caf;
      border-color: #f0abfc;
      font-weight: 700;
      box-shadow: 0 1px 4px rgba(217, 70, 239, 0.12);
    }

    :host-context(.dark) .notif-tab--active {
      background: #1e1030;
      color: #e879f9;
      border-color: #6b21a8;
    }

    .notif-tab-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 999px;
      font-size: 9px;
      font-weight: 800;
      background: #e2e8f0;
      color: #64748b;
    }

    .notif-tab-count--active {
      background: linear-gradient(135deg, #f0abfc, #d946ef);
      color: white;
    }

    /* === Date Separator === */
    .notif-date-separator {
      position: sticky;
      top: 0;
      z-index: 10;
      padding: 6px 16px 4px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-bottom: 1px solid #f1f5f9;
    }

    :host-context(.dark) .notif-date-separator {
      background: rgba(15, 23, 42, 0.85);
      border-bottom-color: #1e293b;
    }

    .notif-date-label {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
    }

    :host-context(.dark) .notif-date-label {
      color: #475569;
    }

    /* === Footer === */
    .notif-footer {
      padding: 10px 20px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      padding: 12px 14px 12px 0;
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
      background: linear-gradient(90deg, rgba(250, 245, 255, 0.7) 0%, #faf5ff 100%);
    }

    :host-context(.dark) .notif-item--unread {
      background: linear-gradient(90deg, rgba(76, 29, 149, 0.08) 0%, rgba(76, 29, 149, 0.04) 100%);
    }

    .notif-item--unread:hover {
      background: linear-gradient(90deg, #f3e8ff 0%, #f5f3ff 100%);
    }

    :host-context(.dark) .notif-item--unread:hover {
      background: linear-gradient(90deg, rgba(76, 29, 149, 0.14) 0%, rgba(76, 29, 149, 0.08) 100%);
    }

    .notif-item:last-child {
      border-bottom: none;
    }

    /* === Unread Accent Bar === */
    .notif-accent-bar {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      border-radius: 0 3px 3px 0;
      background: linear-gradient(180deg, #f0abfc 0%, #d946ef 100%);
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
      margin-top: 1px;
    }

    /* === Action Chip === */
    .notif-action-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 9px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      border: 1px solid transparent;
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
      align-self: flex-start;
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

    @keyframes notifPopUp {
      from { transform: translateY(16px) scale(0.97); opacity: 0; }
      to   { transform: translateY(0)    scale(1);    opacity: 1; }
    }

    /* Mobile: slide up from bottom nav */
    @media (max-width: 767px) {
      .notif-drawer {
        bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important;
        left: 8px !important;
        right: 8px !important;
        width: auto !important;
        max-height: 70vh;
        border-radius: 20px;
        animation: notifPopUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    }

    /* performance-lite: no animations */
    :host-context(html.performance-lite) .notif-backdrop,
    :host-context(html.performance-lite) .notif-drawer {
      animation: none !important;
    }

    :host-context(html.performance-lite) .notif-unread-pill {
      animation: none !important;
    }
  `]
})
export class NotificationPanelComponent {
  panel               = inject(NotificationPanelService);
  notificationService = inject(NotificationService);
  state               = inject(StateService);
  router              = inject(Router);
  confirmation        = inject(ConfirmationService);
  toast               = inject(ToastService);
  elementRef          = inject(ElementRef);

  notifications = this.notificationService.notifications;
  unreadCount   = this.notificationService.unreadCount;
  totalCount    = this.notificationService.totalCount;
  displayLimit  = this.notificationService.displayLimit;

  hasMore   = computed(() => this.displayLimit() < this.totalCount());
  readCount = computed(() => Math.max(0, this.totalCount() - this.unreadCount()));

  activeTab = signal<TabId>('all');
  showActionsMenu = signal(false);
  expandedIds = new Set<string>();

  // ── Tab definitions ──────────────────────────────────────────────────────
  readonly SYSTEM_TYPES = new Set<NotificationType>(['SYSTEM_INFO', 'SYSTEM_UPDATE', 'STOCK_LOW_ALERT', 'RETURN_OVERDUE']);
  readonly ACTIONABLE_TYPES = new Set<NotificationType>(['COA_REQUEST', 'BORROW_REQUEST']);

  tabs = [
    {
      id: 'all' as TabId,
      label: 'Tất cả',
      count: computed(() => 0)
    },
    {
      id: 'unread' as TabId,
      label: 'Chưa đọc',
      count: computed(() => this.unreadCount())
    },
    {
      id: 'system' as TabId,
      label: 'Hệ thống',
      count: computed(() => this.notifications().filter(n => this.SYSTEM_TYPES.has(n.type)).length)
    }
  ];

  emptyIcon = computed(() => {
    if (this.activeTab() === 'unread') return 'fa-circle-check';
    if (this.activeTab() === 'system') return 'fa-shield-check';
    return 'fa-bell-slash';
  });

  emptyTitle = computed(() => {
    if (this.activeTab() === 'unread') return 'Tất cả đã đọc! 🎉';
    if (this.activeTab() === 'system') return 'Không có cảnh báo hệ thống';
    return 'Chưa có thông báo nào';
  });

  emptySubtitle = computed(() => {
    if (this.activeTab() === 'unread') return 'Bạn đã xử lý hết tất cả thông báo.';
    if (this.activeTab() === 'system') return 'Không có cảnh báo tồn kho thấp hay cập nhật hệ thống nào.';
    return 'Các thông báo mới sẽ xuất hiện ở đây khi có hoạt động liên quan.';
  });

  // ── Filtered + grouped ────────────────────────────────────────────────────
  filteredGroups = computed<DateGroup[]>(() => {
    const tab = this.activeTab();
    let items = this.notifications();

    if (tab === 'unread') {
      items = items.filter(n => !n.isRead);
    } else if (tab === 'system') {
      items = items.filter(n => this.SYSTEM_TYPES.has(n.type));
    }

    if (!items.length) return [];

    const now = Date.now();
    const startOfToday    = this.startOfDay(now);
    const startOfYesterday= startOfToday - 86_400_000;
    const startOfWeek     = startOfToday - 6 * 86_400_000;

    const groups: Record<string, AppNotification[]> = {
      'Hôm nay': [],
      'Hôm qua': [],
      'Tuần này': [],
      'Cũ hơn': []
    };

    for (const n of items) {
      const ts = n.createdAt || 0;
      if (ts >= startOfToday)     groups['Hôm nay'].push(n);
      else if (ts >= startOfYesterday) groups['Hôm qua'].push(n);
      else if (ts >= startOfWeek) groups['Tuần này'].push(n);
      else                        groups['Cũ hơn'].push(n);
    }

    return Object.entries(groups)
      .filter(([, list]) => list.length > 0)
      .map(([label, list]) => ({ label, items: list }));
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  private startOfDay(ts: number): number {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  isActionable(type: NotificationType): boolean {
    return this.ACTIONABLE_TYPES.has(type);
  }

  isInformational(type: NotificationType): boolean {
    return type === 'SYSTEM_INFO' || type === 'SYSTEM_UPDATE';
  }

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

  toggleActionsMenu() {
    this.showActionsMenu.set(!this.showActionsMenu());
  }

  loadMore() {
    this.notificationService.loadMore();
  }

  async onDeleteRead() {
    this.showActionsMenu.set(false);
    if (this.readCount() === 0) return;
    const confirmed = await this.confirmation.confirm({
      message: `Xóa ${this.readCount()} thông báo đã đọc? Thao tác này không thể hoàn tác.`,
      confirmText: 'Xóa đã đọc',
      isDangerous: true
    });
    if (!confirmed) return;
    try {
      const count = await this.notificationService.deleteReadNotifications();
      this.toast.show(`Đã xóa ${count} thông báo đã đọc.`, 'info');
    } catch (e: any) {
      this.toast.show('Lỗi xóa thông báo: ' + (e?.message || e), 'error');
    }
  }

  async onDeleteAll() {
    this.showActionsMenu.set(false);
    if (this.totalCount() === 0) return;
    const confirmed = await this.confirmation.confirm({
      message: `Xóa toàn bộ ${this.totalCount()} thông báo? Thao tác này không thể hoàn tác.`,
      confirmText: 'Xóa tất cả',
      isDangerous: true
    });
    if (!confirmed) return;
    try {
      const count = await this.notificationService.deleteAllNotifications();
      this.toast.show(`Đã xóa toàn bộ ${count} thông báo.`, 'info');
    } catch (e: any) {
      this.toast.show('Lỗi xóa thông báo: ' + (e?.message || e), 'error');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showActionsMenu()) {
      const target = event.target as HTMLElement;
      if (!this.elementRef.nativeElement.querySelector('.notif-actions-wrapper')?.contains(target)) {
        this.showActionsMenu.set(false);
      }
    }
  }

  /**
   * Vị trí panel desktop:
   * - left: sát phải sidebar + 12px margin
   * - bottom: 12px cách mép dưới viewport (panel mở lên trên)
   */
  get panelPos(): { left: string; bottom: string } {
    if (typeof window === 'undefined' || window.innerWidth < 768) {
      return { left: '8px', bottom: `calc(80px + env(safe-area-inset-bottom, 0px))` };
    }
    const sidebarEl = document.querySelector('aside');
    const w = sidebarEl
      ? sidebarEl.getBoundingClientRect().width
      : (this.state.sidebarCollapsed() ? 80 : 256);
    return { left: `${w + 12}px`, bottom: '12px' };
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

  goToSettings() {
    this.panel.close();
    this.router.navigateByUrl('/config');
  }

  // ── Icon & color maps ──────────────────────────────────────────────────────
  getIconClass(type: string): string {
    const map: Record<string, string> = {
      'COA_REQUEST':      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'BORROW_REQUEST':   'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'REQUEST_APPROVED': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      'REQUEST_REJECTED': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      'STOCK_LOW_ALERT':  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      'RETURN_OVERDUE':   'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      'SYSTEM_UPDATE':    'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      'SYSTEM_INFO':      'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
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
      'RETURN_OVERDUE':   'fa-clock-rotate-left',
      'SYSTEM_UPDATE':    'fa-bullhorn',
      'SYSTEM_INFO':      'fa-circle-info',
    };
    return map[type] ?? 'fa-bell';
  }

  getChipClass(type: string): string {
    const map: Record<string, string> = {
      'COA_REQUEST':      'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/40',
      'BORROW_REQUEST':   'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40',
      'REQUEST_APPROVED': 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40',
      'REQUEST_REJECTED': 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40',
      'STOCK_LOW_ALERT':  'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40',
      'RETURN_OVERDUE':   'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40',
    };
    return map[type] ?? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-900/20 dark:text-fuchsia-400 dark:border-fuchsia-800/40';
  }

  getActionLabel(type: string): string {
    const map: Record<string, string> = {
      'COA_REQUEST':      'Xem yêu cầu CoA',
      'BORROW_REQUEST':   'Xem yêu cầu mượn',
      'REQUEST_APPROVED': 'Xem chi tiết',
      'REQUEST_REJECTED': 'Xem lý do',
      'STOCK_LOW_ALERT':  'Xem kho',
      'RETURN_OVERDUE':   'Xem lịch hoàn trả',
      'SYSTEM_UPDATE':    'Xem cập nhật',
      'SYSTEM_INFO':      'Xem thông tin',
    };
    return map[type] ?? 'Xem chi tiết';
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

  getFullDate(timestamp: number): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
