import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import {
    collection, doc, updateDoc, writeBatch,
    query, where, onSnapshot, Unsubscribe, deleteDoc, arrayUnion
} from 'firebase/firestore';
import { AppNotification, NotificationLevel } from '../models/notification.model';

// Notifications older than 90 days are auto-cleaned up on listener start
const CLEANUP_AGE_MS = 90 * 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private fb = inject(FirebaseService);
    private auth = inject(AuthService);
    private router = inject(Router);

    // Reactive state
    notifications = signal<AppNotification[]>([]);
    unreadCount = signal(0);
    totalCount = signal(0);
    displayLimit = signal(50);

    foregroundMessage = signal<{
        eventId?: string;
        title: string;
        message: string;
        level: NotificationLevel;
        actionUrl?: string;
    } | null>(null);

    private unsub?: Unsubscribe;
    private fcmUnsub?: () => void;
    private foregroundGeneration = 0;
    private _allItems: AppNotification[] = [];

    private readonly _onSwMessage = (event: MessageEvent) => {
        if (event.data?.type === 'SW_NAVIGATE' && typeof event.data.url === 'string') {
            this.router.navigateByUrl(event.data.url);
        }
    };

    constructor() {
        // Initialise empty; startListener() is called by AppComponent after login
    }

    // ── Push a notification ───────────────────────────────────────────────────
    /**
     * Send a notification to one or more recipients.
     *
     * - Pass a specific UID in `recipientUid` for personal notifications.
     * - Pass `'role:admin'` to fan-out to all admin/manager users
     *   (each gets their own independent Firestore document).
     */
    async notify(
        notification: Omit<AppNotification, 'createdAt' | 'isRead'>,
        options: { sendPush?: boolean } = {}
    ) {
        await this.callNotificationApi({
            action: 'publish',
            appId: this.fb.APP_ID,
            notification,
            sendPush: options.sendPush !== false
        });
    }

    // ── Listener ──────────────────────────────────────────────────────────────
    startListener() {
        this.stopListener(); // Ensure clean state

        const user = this.auth.currentUser();
        if (!user) return;

        const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`);

        // Single query: only this user's own notification documents
        const q = query(colRef, where('recipientUid', '==', user.uid));

        this.unsub = onSnapshot(q, (snapshot) => {
            const items: AppNotification[] = [];
            snapshot.forEach(d => items.push({ ...d.data(), id: d.id } as AppNotification));

            // Sort newest first
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this._allItems = items;

            const trueUnread = items.filter(n => !n.isRead).length;
            this.totalCount.set(items.length);
            this.unreadCount.set(trueUnread);
            this.updateAppBadge(trueUnread);

            // Render items up to the current displayLimit
            this.notifications.set(items.slice(0, this.displayLimit()));

            // Trigger 90-day cleanup in background (fire-and-forget)
            this._cleanupOldNotifications(items);

        }, (error) => {
            console.error('[NotificationService] Listener error:', error.message);
        });

        // Không tự bật prompt khi đăng nhập. Chỉ đăng ký lại nếu user đã cấp quyền trước đó.
        if ('Notification' in window && Notification.permission === 'granted') {
          this.fb.requestPushToken().then(token => {
            if (token) {
                localStorage.setItem('lims_fcm_token', token); // Lưu token của thiết bị này
                const userRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/users`, user.uid);
                updateDoc(userRef, { fcmTokens: arrayUnion(token) }).catch(() => {});
            }
          }).catch(e => console.warn('[NotificationService] Could not refresh FCM token:', e));
        }

        // Listen for foreground FCM messages
        const foregroundGeneration = ++this.foregroundGeneration;
        void this.startForegroundMessaging(foregroundGeneration);

        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', this._onSwMessage);
        }
    }

    private async startForegroundMessaging(foregroundGeneration: number) {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        const messaging = await this.fb.getMessagingInstance();
        if (foregroundGeneration !== this.foregroundGeneration) return;

        if (messaging) {
            const { onMessage } = await import('firebase/messaging');
            if (foregroundGeneration !== this.foregroundGeneration) return;
            this.fcmUnsub = onMessage(messaging, (payload) => {
                console.log('[NotificationService] Foreground message received:', payload);
                this.foregroundMessage.set({
                    eventId: payload.data?.['eventId'],
                    title: payload.notification?.title || 'Thông báo',
                    message: payload.notification?.body || 'Bạn có thông báo mới.',
                    level: this.parseLevel(payload.data?.['level']),
                    actionUrl: payload.data?.['actionUrl']
                });
            });
        }
    }

    stopListener() {
        this.foregroundGeneration++;
        if (this.unsub) { this.unsub(); this.unsub = undefined; }
        if (this.fcmUnsub) { this.fcmUnsub(); this.fcmUnsub = undefined; }
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.removeEventListener('message', this._onSwMessage);
        }
        this.displayLimit.set(50);
        this._allItems = [];
        this.notifications.set([]);
        this.unreadCount.set(0);
        this.totalCount.set(0);
        this.updateAppBadge(0);
        this.foregroundMessage.set(null);
    }

    // ── Pagination ─────────────────────────────────────────────────────────────
    loadMore(increment = 50): void {
        const next = Math.min(this.displayLimit() + increment, this._allItems.length);
        this.displayLimit.set(next);
        this.notifications.set(this._allItems.slice(0, next));
    }

    // ── App Badge API ─────────────────────────────────────────────────────────
    private updateAppBadge(count: number) {
        if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
            try {
                if (count > 0) {
                    (navigator as any).setAppBadge(count);
                } else {
                    (navigator as any).clearAppBadge();
                }
            } catch (e) {
                console.warn('[NotificationService] Failed to update app badge', e);
            }
        }
    }

    // ── Read / Delete ─────────────────────────────────────────────────────────
    async markAsRead(notificationId: string) {
        if (!notificationId) return;
        try {
            const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`, notificationId);
            await updateDoc(docRef, { isRead: true });
        } catch (e) {
            console.error('Failed to mark notification as read:', e);
        }
    }

    async markAllAsRead() {
        const unreadList = this._allItems.filter(n => !n.isRead && n.id);
        if (!unreadList.length) return;

        try {
            const batch = writeBatch(this.fb.db);
            unreadList.forEach(n => {
                const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`, n.id!);
                batch.update(docRef, { isRead: true });
            });
            await batch.commit();
        } catch (e) {
            console.error('Failed to mark all as read:', e);
        }
    }

    async deleteNotification(notificationId: string) {
        if (!notificationId) return;
        try {
            const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`, notificationId);
            await deleteDoc(docRef);
        } catch (e) {
            console.error('Failed to delete notification:', e);
        }
    }

    async deleteReadNotifications(): Promise<number> {
        const readList = this._allItems.filter(n => n.isRead && n.id);
        if (!readList.length) return 0;

        try {
            const chunks: AppNotification[][] = [];
            for (let i = 0; i < readList.length; i += 400) {
                chunks.push(readList.slice(i, i + 400));
            }
            for (const chunk of chunks) {
                const batch = writeBatch(this.fb.db);
                chunk.forEach(n => {
                    const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`, n.id!);
                    batch.delete(docRef);
                });
                await batch.commit();
            }
            return readList.length;
        } catch (e) {
            console.error('Failed to delete read notifications:', e);
            throw e;
        }
    }

    async deleteAllNotifications(): Promise<number> {
        const allList = this._allItems.filter(n => n.id);
        if (!allList.length) return 0;

        try {
            const chunks: AppNotification[][] = [];
            for (let i = 0; i < allList.length; i += 400) {
                chunks.push(allList.slice(i, i + 400));
            }
            for (const chunk of chunks) {
                const batch = writeBatch(this.fb.db);
                chunk.forEach(n => {
                    const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`, n.id!);
                    batch.delete(docRef);
                });
                await batch.commit();
            }
            return allList.length;
        } catch (e) {
            console.error('Failed to delete all notifications:', e);
            throw e;
        }
    }

    async deleteBroadcastByGroupId(groupId: string) {
        if (!groupId) return;
        await this.callNotificationApi({
            action: 'deleteGroup',
            appId: this.fb.APP_ID,
            groupId
        });
    }

    // ── Auto-cleanup: delete notifications older than 90 days ────────────────
    private _isCleaningUp = false;

    private async _cleanupOldNotifications(allItems: AppNotification[]) {
        if (this._isCleaningUp) return;

        const cutoff = Date.now() - CLEANUP_AGE_MS;
        const stale = allItems.filter(n => n.id && (n.createdAt || 0) < cutoff);
        if (stale.length === 0) return;

        this._isCleaningUp = true;
        try {
            const batch = writeBatch(this.fb.db);
            stale.forEach(n => {
                const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`, n.id!);
                batch.delete(docRef);
            });
            await batch.commit();
            console.log(`[NotificationService] Auto-cleaned ${stale.length} notifications older than 90 days.`);
        } catch (e) {
            console.warn('[NotificationService] Cleanup failed (non-critical):', e);
        } finally {
            this._isCleaningUp = false;
        }
    }

    private parseLevel(value: unknown): NotificationLevel {
        return value === 'success' || value === 'error' || value === 'warning' ? value : 'info';
    }

    private async callNotificationApi(payload: Record<string, unknown>): Promise<void> {
        const doFetch = async (forceRefresh: boolean) => {
            const token = await this.auth.getIdToken(forceRefresh);
            if (!token) throw new Error('Phiên đăng nhập không hợp lệ.');
            return fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
        };

        let response = await doFetch(false);

        // Retry một lần với fresh token nếu token hết hạn (401)
        if (response.status === 401) {
            response = await doFetch(true);
        }

        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            throw new Error(result?.error || `Không thể gửi thông báo (${response.status}).`);
        }
    }
}
