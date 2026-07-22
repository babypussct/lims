import { Component, inject, HostListener, signal, computed, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationPanelService } from '../../../core/services/notification-panel.service';
import { StateService } from '../../../core/services/state.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppNotification, NotificationType } from '../../../core/models/notification.model';

type TabId = 'all' | 'unread' | 'actionable' | 'system';

interface DateGroup {
  label: string;
  items: AppNotification[];
}

/**
 * NotificationPanelComponent — Premium Inbox v3 (Floating Popover + Mobile Bottom Sheet)
 *
 * Rendered at app root level (app.component.ts) to avoid sidebar stacking context z-index clipping.
 * Anchor-based placement on Desktop (adjacent to Bell button at sidebar bottom) and Bottom Sheet on Mobile.
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

      <!-- Main Drawer / Popover Container -->
      <div
        role="dialog"
        aria-label="Trung tâm Thông báo"
        class="notif-drawer fixed z-[200] flex flex-col"
        [style.left]="panelPos.left"
        [style.bottom]="panelPos.bottom">

        <!-- Mobile Drag Indicator -->
        <div class="md:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div class="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>

        <!-- ── Header ── -->
        <div class="notif-header shrink-0">
          <div class="flex items-center gap-3">
            <div class="notif-header-icon">
              <i class="fa-solid fa-bell text-sm"></i>
            </div>
            <div>
              <h2 class="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight tracking-tight">Thông báo</h2>
              <div class="flex items-center gap-1.5 mt-0.5">
                @if (unreadCount() > 0) {
                  <span class="notif-unread-pill">
                    <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    {{ unreadCount() }} chưa đọc
                  </span>
                } @else {
                  <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Tất cả đã đọc</span>
                }
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1">
            @if (unreadCount() > 0) {
              <button
                (click)="markAllAsRead()"
                class="text-[11px] font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300
                       px-2.5 py-1.5 rounded-xl hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/40 transition-all active:scale-95 flex items-center gap-1">
                <i class="fa-solid fa-check-double text-[10px]"></i>
                Đọc tất cả
              </button>
            }

            @if (totalCount() > 0) {
              <div class="relative notif-actions-wrapper">
                <button
                  (click)="toggleActionsMenu()"
                  class="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500
                         hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-700 dark:hover:text-slate-200
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
                     hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-700 dark:hover:text-slate-200
                     transition-all active:scale-90">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        <!-- ── Segmented Control Tab Filter Bar ── -->
        <div class="notif-tab-bar shrink-0">
          <div class="notif-tab-container">
            @for (tab of tabs; track tab.id) {
              <button
                (click)="activeTab.set(tab.id)"
                class="notif-tab"
                [class.notif-tab--active]="activeTab() === tab.id">
                <span>{{ tab.label }}</span>
                @if (tab.count() > 0) {
                  <span class="notif-tab-count" [class.notif-tab-count--active]="activeTab() === tab.id">
                    {{ tab.count() }}
                  </span>
                }
              </button>
            }
          </div>
        </div>

        <!-- ── Notification List ── -->
        <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          @if (filteredGroups().length === 0) {
            <!-- Empty State -->
            <div class="h-full flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
              <div class="notif-empty-icon">
                <i class="fa-solid text-3xl text-slate-400 dark:text-slate-500" [ngClass]="emptyIcon()"></i>
              </div>
              <div class="max-w-[260px]">
                <p class="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  {{ emptyTitle() }}
                </p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
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
                  class="notif-item group relative"
                  [class.notif-item--unread]="!n.isRead">

                  <!-- Color Accent Left Bar -->
                  <span class="notif-accent-bar" [ngClass]="getAccentBarClass(n.type)"></span>

                  <div class="flex gap-3 items-start pl-3.5 pr-3 py-3">
                    <!-- Type Icon Container -->
                    <div class="notif-type-icon shrink-0" [ngClass]="getIconClass(n.type)">
                      <i class="fa-solid" [ngClass]="getIcon(n.type)"></i>
                    </div>

                    <!-- Main Body Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start gap-2 mb-0.5">
                        <h4 class="font-bold text-[13px] text-slate-800 dark:text-slate-100 leading-snug"
                            [class.truncate]="!isExpanded(n)">
                          {{ n.title }}
                        </h4>
                        <span class="text-[10px] whitespace-nowrap text-slate-400 dark:text-slate-500 shrink-0 font-medium pt-0.5"
                              [title]="getFullDate(n.createdAt)">
                          {{ getTimeAgo(n.createdAt) }}
                        </span>
                      </div>

                      <div class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words"
                           [class.line-clamp-2]="!isExpanded(n)">
                        {{ n.message }}
                      </div>

                      @if (n.message && n.message.length > 90) {
                        <button (click)="toggleExpand(n, $event)"
                                class="text-[10px] font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:underline mt-1 inline-block">
                          {{ isExpanded(n) ? 'Ẩn bớt ↑' : 'Xem thêm ↓' }}
                        </button>
                      }

                      <!-- Action Button Chip -->
                      @if (n.actionUrl) {
                        <div class="mt-2 flex items-center justify-between">
                          <span class="notif-action-chip" [ngClass]="getChipClass(n.type)">
                            <span>{{ getActionLabel(n.type) }}</span>
                            <i class="fa-solid fa-arrow-right text-[9px] transition-transform group-hover:translate-x-0.5"></i>
                          </span>
                        </div>
                      }
                    </div>

                    <!-- Quick Hover Action Buttons -->
                    <div class="notif-item-actions shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      @if (!n.isRead) {
                        <button
                          (click)="markAsRead(n.id!, $event)"
                          class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-950/60 text-slate-500 hover:text-fuchsia-600 dark:text-slate-400 dark:hover:text-fuchsia-300 flex items-center justify-center transition-all"
                          title="Đánh dấu đã đọc">
                          <i class="fa-solid fa-check text-[10px]"></i>
                        </button>
                      }
                      <button
                        (click)="deleteNotification(n, $event)"
                        class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 flex items-center justify-center transition-all"
                        title="Xoá thông báo">
                        <i class="fa-solid fa-trash-can text-[10px]"></i>
                      </button>
                    </div>
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
          <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            @if (totalCount() > displayLimit()) {
              Hiển thị {{ notifications().length }} / {{ totalCount() }} thông báo
            } @else {
              {{ totalCount() }} thông báo
            }
          </span>
          <button
            (click)="goToSettings()"
            class="text-[11px] font-bold text-fuchsia-600 hover:text-fuchsia-700 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 transition-colors flex items-center gap-1.5">
            <i class="fa-solid fa-gear text-[10px]"></i>
            Cài đặt thông báo
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    /* === Backdrop === */
    .notif-backdrop {
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      animation: notifFadeIn 0.22s ease-out forwards;
    }

    /* === Popover Container ===
     * Desktop: Premium Floating Popover attached to Bell button at sidebar bottom.
     * Dimensions: width 420px, max-height 70vh, border-radius 24px.
     */
    .notif-drawer {
      width: min(420px, calc(100vw - 24px));
      max-height: min(680px, 70vh);
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 24px;
      border: 1px solid rgba(226, 232, 240, 0.9);
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.03),
        0 24px 60px -12px rgba(15, 23, 42, 0.22),
        0 0 0 1px rgba(0, 0, 0, 0.03);
      animation: notifPopUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      overflow: hidden;
    }

    :host-context(.dark) .notif-drawer {
      background: rgba(15, 23, 42, 0.96);
      border-color: rgba(51, 65, 85, 0.8);
      box-shadow:
        0 25px 65px -12px rgba(0, 0, 0, 0.65),
        0 0 0 1px rgba(255, 255, 255, 0.08);
    }

    /* === Header === */
    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px 14px;
      border-bottom: 1px solid rgba(241, 245, 249, 0.9);
    }

    :host-context(.dark) .notif-header {
      border-bottom-color: rgba(30, 41, 59, 0.9);
    }

    .notif-header-icon {
      width: 38px;
      height: 38px;
      border-radius: 14px;
      background: linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(217, 70, 239, 0.35);
      flex-shrink: 0;
    }

    .notif-unread-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: linear-gradient(135deg, #d946ef, #ec4899);
      color: white;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 999px;
      letter-spacing: 0.01em;
      box-shadow: 0 2px 6px rgba(217, 70, 239, 0.25);
    }

    /* === Actions Dropdown === */
    .notif-actions-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 6px;
      width: 200px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06);
      padding: 6px;
      z-index: 50;
      animation: notifPopUp 0.18s ease-out forwards;
    }

    :host-context(.dark) .notif-actions-dropdown {
      background: #1e293b;
      box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .notif-action-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 12px;
      border-radius: 10px;
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
      background: rgba(127, 29, 29, 0.3);
      color: #f87171;
    }

    /* === Segmented Control Tab Bar === */
    .notif-tab-bar {
      padding: 8px 14px;
      border-bottom: 1px solid rgba(241, 245, 249, 0.9);
      background: rgba(248, 250, 252, 0.8);
    }

    :host-context(.dark) .notif-tab-bar {
      border-bottom-color: rgba(30, 41, 59, 0.9);
      background: rgba(15, 23, 42, 0.6);
    }

    .notif-tab-container {
      display: flex;
      gap: 4px;
      padding: 3px;
      background: rgba(226, 232, 240, 0.6);
      border-radius: 14px;
    }

    :host-context(.dark) .notif-tab-container {
      background: rgba(30, 41, 59, 0.8);
    }

    .notif-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 7px 6px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      border: none;
      cursor: pointer;
      white-space: nowrap;
    }

    :host-context(.dark) .notif-tab {
      color: #94a3b8;
    }

    .notif-tab:hover {
      color: #1e293b;
    }

    :host-context(.dark) .notif-tab:hover {
      color: #f1f5f9;
    }

    .notif-tab--active {
      background: white;
      color: #a21caf;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    :host-context(.dark) .notif-tab--active {
      background: #1e1030;
      color: #e879f9;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
      background: rgba(100, 116, 139, 0.15);
      color: #64748b;
    }

    .notif-tab-count--active {
      background: linear-gradient(135deg, #d946ef, #ec4899);
      color: white;
    }

    /* === Date Separator === */
    .notif-date-separator {
      position: sticky;
      top: 0;
      z-index: 10;
      padding: 6px 18px 4px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(241, 245, 249, 0.8);
    }

    :host-context(.dark) .notif-date-separator {
      background: rgba(15, 23, 42, 0.9);
      border-bottom-color: rgba(30, 41, 59, 0.8);
    }

    .notif-date-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
    }

    :host-context(.dark) .notif-date-label {
      color: #64748b;
    }

    /* === Notification Item === */
    .notif-item {
      transition: background-color 0.18s ease;
      border-bottom: 1px solid rgba(241, 245, 249, 0.8);
      cursor: pointer;
    }

    :host-context(.dark) .notif-item {
      border-bottom-color: rgba(30, 41, 59, 0.8);
    }

    .notif-item:hover {
      background: rgba(248, 250, 252, 0.9);
    }

    :host-context(.dark) .notif-item:hover {
      background: rgba(30, 41, 59, 0.6);
    }

    .notif-item--unread {
      background: linear-gradient(90deg, rgba(250, 245, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
    }

    :host-context(.dark) .notif-item--unread {
      background: linear-gradient(90deg, rgba(147, 51, 234, 0.1) 0%, rgba(15, 23, 42, 0.2) 100%);
    }

    .notif-item--unread:hover {
      background: linear-gradient(90deg, rgba(243, 232, 255, 0.9) 0%, rgba(250, 245, 255, 0.6) 100%);
    }

    :host-context(.dark) .notif-item--unread:hover {
      background: linear-gradient(90deg, rgba(147, 51, 234, 0.16) 0%, rgba(30, 41, 59, 0.5) 100%);
    }

    /* === Accent Left Bar === */
    .notif-accent-bar {
      position: absolute;
      left: 0;
      top: 12px;
      bottom: 12px;
      width: 4px;
      border-radius: 0 4px 4px 0;
    }

    /* === Type Icon Container === */
    .notif-type-icon {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    /* === Action Chip Button === */
    .notif-action-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: 700;
      border: 1px solid transparent;
      transition: all 0.18s ease;
    }

    /* === Load More Button === */
    .notif-load-more-btn {
      width: 100%;
      padding: 9px 14px;
      border-radius: 14px;
      border: 1.5px dashed #cbd5e1;
      background: #fafafa;
      color: #64748b;
      font-size: 11px;
      font-weight: 700;
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

    /* === Footer === */
    .notif-footer {
      padding: 12px 20px;
      border-top: 1px solid rgba(241, 245, 249, 0.9);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    :host-context(.dark) .notif-footer {
      border-top-color: rgba(30, 41, 59, 0.9);
    }

    /* === Empty State Icon === */
    .notif-empty-icon {
      width: 72px;
      height: 72px;
      border-radius: 24px;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host-context(.dark) .notif-empty-icon {
      background: #1e293b;
    }

    /* === Animations === */
    @keyframes notifFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes notifPopUp {
      from { transform: translateY(20px) scale(0.97); opacity: 0; }
      to   { transform: translateY(0)    scale(1);    opacity: 1; }
    }

    /* === Mobile Native Bottom Sheet === */
    @media (max-width: 767px) {
      .notif-drawer {
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        max-height: 85vh !important;
        border-radius: 24px 24px 0 0 !important;
        animation: notifSheetSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes notifSheetSlideUp {
        from { transform: translateY(100%); }
        to   { transform: translateY(0); }
      }
    }

    /* Performance Lite override */
    :host-context(html.performance-lite) .notif-backdrop,
    :host-context(html.performance-lite) .notif-drawer {
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
      count: computed(() => this.totalCount())
    },
    {
      id: 'unread' as TabId,
      label: 'Chưa đọc',
      count: computed(() => this.unreadCount())
    },
    {
      id: 'actionable' as TabId,
      label: 'Cần xử lý',
      count: computed(() => this.notifications().filter(n => !n.isRead && this.ACTIONABLE_TYPES.has(n.type)).length)
    },
    {
      id: 'system' as TabId,
      label: 'Hệ thống',
      count: computed(() => this.notifications().filter(n => this.SYSTEM_TYPES.has(n.type)).length)
    }
  ];

  emptyIcon = computed(() => {
    if (this.activeTab() === 'unread') return 'fa-circle-check';
    if (this.activeTab() === 'actionable') return 'fa-clipboard-check';
    if (this.activeTab() === 'system') return 'fa-shield-check';
    return 'fa-bell-slash';
  });

  emptyTitle = computed(() => {
    if (this.activeTab() === 'unread') return 'Tất cả đã đọc! 🎉';
    if (this.activeTab() === 'actionable') return 'Không có yêu cầu chờ duyệt 👍';
    if (this.activeTab() === 'system') return 'Không có cảnh báo hệ thống';
    return 'Chưa có thông báo nào';
  });

  emptySubtitle = computed(() => {
    if (this.activeTab() === 'unread') return 'Bạn đã xử lý hết tất cả thông báo.';
    if (this.activeTab() === 'actionable') return 'Tất cả yêu cầu COA và mượn trả thiết bị đã được xử lý.';
    if (this.activeTab() === 'system') return 'Không có cảnh báo tồn kho thấp hay cập nhật hệ thống nào.';
    return 'Các thông báo mới sẽ xuất hiện ở đây khi có hoạt động liên quan.';
  });

  // ── Filtered + grouped ────────────────────────────────────────────────────
  filteredGroups = computed<DateGroup[]>(() => {
    const tab = this.activeTab();
    let items = this.notifications();

    if (tab === 'unread') {
      items = items.filter(n => !n.isRead);
    } else if (tab === 'actionable') {
      items = items.filter(n => this.ACTIONABLE_TYPES.has(n.type));
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
      if (ts >= startOfToday)          groups['Hôm nay'].push(n);
      else if (ts >= startOfYesterday) groups['Hôm qua'].push(n);
      else if (ts >= startOfWeek)     groups['Tuần này'].push(n);
      else                            groups['Cũ hơn'].push(n);
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
   * Vị trí Popover desktop (Anchor tại vị trí nút Bell góc dưới sidebar):
   * - left: sát bên phải sidebar + 12px margin
   * - bottom: 12px cách mép dưới viewport
   */
  get panelPos(): { left: string; bottom: string } {
    if (typeof window === 'undefined' || window.innerWidth < 768) {
      return { left: '0px', bottom: '0px' };
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

  async markAsRead(id: string, event: Event) {
    event.stopPropagation();
    if (id) await this.notificationService.markAsRead(id);
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

  // ── Icon & Color Accent maps ─────────────────────────────────────────────
  getAccentBarClass(type: string): string {
    const map: Record<string, string> = {
      'COA_REQUEST':      'bg-purple-600 dark:bg-purple-400',
      'BORROW_REQUEST':   'bg-blue-600 dark:bg-blue-400',
      'REQUEST_APPROVED': 'bg-emerald-600 dark:bg-emerald-400',
      'REQUEST_REJECTED': 'bg-rose-600 dark:bg-rose-400',
      'STOCK_LOW_ALERT':  'bg-amber-500 dark:bg-amber-400',
      'RETURN_OVERDUE':   'bg-amber-500 dark:bg-amber-400',
      'SYSTEM_UPDATE':    'bg-orange-500 dark:bg-orange-400',
      'SYSTEM_INFO':      'bg-sky-500 dark:bg-sky-400',
    };
    return map[type] ?? 'bg-slate-400 dark:bg-slate-500';
  }

  getIconClass(type: string): string {
    const map: Record<string, string> = {
      'COA_REQUEST':      'bg-purple-100/90 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 ring-1 ring-purple-500/20',
      'BORROW_REQUEST':   'bg-blue-100/90 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 ring-1 ring-blue-500/20',
      'REQUEST_APPROVED': 'bg-emerald-100/90 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-500/20',
      'REQUEST_REJECTED': 'bg-rose-100/90 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 ring-1 ring-rose-500/20',
      'STOCK_LOW_ALERT':  'bg-amber-100/90 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-500/20',
      'RETURN_OVERDUE':   'bg-amber-100/90 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-500/20',
      'SYSTEM_UPDATE':    'bg-orange-100/90 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300 ring-1 ring-orange-500/20',
      'SYSTEM_INFO':      'bg-sky-100/90 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300 ring-1 ring-sky-500/20',
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
      'COA_REQUEST':      'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50',
      'BORROW_REQUEST':   'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50',
      'REQUEST_APPROVED': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
      'REQUEST_REJECTED': 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50',
      'STOCK_LOW_ALERT':  'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
      'RETURN_OVERDUE':   'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
    };
    return map[type] ?? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-800/50';
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
