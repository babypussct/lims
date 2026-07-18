import { effect, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AppNotification,
  NotificationEvent,
  NotificationLevel
} from '../models/notification.model';
import { levelForNotificationType, selectForegroundSurface } from './notification-policy';
import { NotificationService } from './notification.service';
import { ToastService } from './toast.service';

const DEFAULT_TITLE: Record<NotificationLevel, string> = {
  success: 'Thành công',
  error: 'Lỗi',
  info: 'Thông báo',
  warning: 'Cảnh báo'
};

@Injectable({ providedIn: 'root' })
export class NotificationCenterService {
  private readonly toast = inject(ToastService);
  private readonly inbox = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly seenEvents = new Map<string, number>();

  constructor() {
    effect(() => {
      const incoming = this.inbox.foregroundMessage();
      if (!incoming) return;

      queueMicrotask(() => this.inbox.foregroundMessage.set(null));
      if (incoming.eventId && this.wasSeen(incoming.eventId)) return;

      const permission = 'Notification' in window ? Notification.permission : 'default';
      const surface = selectForegroundSurface(document.visibilityState, permission);
      if (surface === 'toast') {
        this.toast.showEvent({
          title: incoming.title,
          message: incoming.message,
          type: incoming.level,
          dedupeKey: incoming.eventId,
          actionLabel: incoming.actionUrl ? 'Xem chi tiết' : undefined,
          action: incoming.actionUrl ? () => this.router.navigateByUrl(incoming.actionUrl!) : undefined
        });
      } else if (surface === 'browser') {
        const browserNotification = new Notification(incoming.title, {
          body: incoming.message,
          icon: '/icons/icon-192x192.png',
          tag: incoming.eventId
        });
        if (incoming.actionUrl) {
          browserNotification.onclick = () => {
            window.focus();
            this.router.navigateByUrl(incoming.actionUrl!);
            browserNotification.close();
          };
        }
      }
    });
  }

  async publish(event: NotificationEvent): Promise<string> {
    const eventId = event.eventId || this.createEventId();
    const level = event.level ?? levelForNotificationType(event.type);
    const title = event.title || DEFAULT_TITLE[level];

    if (event.channels.includes('toast')) {
      this.toast.showEvent({
        title,
        message: event.message,
        type: level,
        persistent: event.persistent,
        durationMs: event.durationMs,
        dedupeKey: event.dedupeKey || eventId,
        actionLabel: event.actionLabel,
        action: event.actionUrl ? () => this.router.navigateByUrl(event.actionUrl!) : undefined
      });
    }

    if (event.channels.includes('inbox')) {
      if (!event.recipientUid || !event.type) {
        throw new Error('Notification inbox cần recipientUid và type.');
      }

      const notification: Omit<AppNotification, 'createdAt' | 'isRead'> = {
        recipientUid: event.recipientUid,
        senderUid: event.senderUid,
        senderName: event.senderName,
        type: event.type,
        level,
        title,
        message: event.message,
        targetId: event.targetId,
        actionUrl: event.actionUrl,
        groupId: eventId,
        eventId
      };

      try {
        await this.inbox.notify(notification, { sendPush: event.channels.includes('push') });
      } catch (error) {
        console.error('[NotificationCenter] Could not publish durable notification:', error);
        this.toast.showEvent({
          message: 'Tác vụ đã hoàn thành nhưng không thể gửi thông báo đến người nhận.',
          type: 'warning',
          dedupeKey: `notification-error:${eventId}`
        });
      }
    }

    return eventId;
  }

  private createEventId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  private wasSeen(eventId: string): boolean {
    const now = Date.now();
    for (const [id, timestamp] of this.seenEvents) {
      if (now - timestamp > 5 * 60_000) this.seenEvents.delete(id);
    }
    if (this.seenEvents.has(eventId)) return true;
    this.seenEvents.set(eventId, now);
    return false;
  }
}
