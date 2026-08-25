import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import {
    collection, doc, updateDoc, writeBatch,
    query, where, limit, onSnapshot, Unsubscribe, deleteDoc
} from 'firebase/firestore';
import { AppNotification, NotificationLevel } from '../models/notification.model';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';
import { syncAppBadge } from './notification-badge';

// Notifications older than 15 days are auto-cleaned up on listener start
const CLEANUP_AGE_MS = 15 * 24 * 60 * 60 * 1000;
// Inbox realtime chỉ cần một cửa sổ hữu hạn. Các thông báo cũ hơn vẫn được
// dọn nền theo retention policy, nhưng không được phép làm listener login đọc
// vô hạn nếu dữ liệu cũ còn tồn tại.
const NOTIFICATION_LISTENER_LIMIT = 100;

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private fb = inject(FirebaseService);
    private auth = inject(AuthService);
    private router = inject(Router);
    private readMonitor = inject(FirestoreReadMonitor);

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
    private pushTokenRegistration?: Promise<string | null>;
    private pushTokenRegistrationUserId?: string;
    private registeredPushToken: { userId: string; token: string } | null = null;
    private pushTokenFailureUserId?: string;
    private pushTokenFailureAt = 0;
    private readonly pushTokenFailureCooldownMs = 5 * 60 * 1000;

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

    /**
     * Server-authoritative projection of an already committed canonical event.
     * The client supplies only eventId; policy, recipients and deep-link are
     * resolved by /api/notifications from the stored Activity event.
     */
    async dispatchEvent(eventId: string): Promise<Record<string, unknown>> {
        const normalized = eventId.trim();
        if (!normalized || normalized.includes('/')) throw new Error('eventId không hợp lệ.');
        return this.callNotificationApi({
            action: 'dispatchEvent',
            appId: this.fb.APP_ID,
            eventId: normalized
        });
    }

    // ── Listener ──────────────────────────────────────────────────────────────
    startListener() {
        this.stopListener(); // Ensure clean state

        const user = this.auth.currentUser();
        if (!user) return;

        const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`);

        // Single query: only this user's own notification documents
        const q = query(
            colRef,
            where('recipientUid', '==', user.uid),
            limit(NOTIFICATION_LISTENER_LIMIT)
        );

        let isFirstSnapshot = true;
        this.unsub = onSnapshot(q, (snapshot) => {
            this.readMonitor.record(
                'onSnapshot',
                `artifacts/${this.fb.APP_ID}/notifications`,
                isFirstSnapshot
                    ? snapshot.size
                    : snapshot.docChanges().filter(change => change.type !== 'removed').length,
                { phase: isFirstSnapshot ? 'initial' : 'delta', fromCache: snapshot.metadata.fromCache }
            );
            isFirstSnapshot = false;
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
          this.registerCurrentDevicePushToken()
            .catch(e => console.warn('[NotificationService] Could not refresh FCM token:', e));
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
                    title: payload.data?.['title'] || payload.notification?.title || 'Thông báo',
                    message: payload.data?.['body'] || payload.notification?.body || 'Bạn có thông báo mới.',
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
        if (!this.auth.currentUser()) {
            this.registeredPushToken = null;
            this.pushTokenFailureUserId = undefined;
            this.pushTokenFailureAt = 0;
        }
    }

    // ── Pagination ─────────────────────────────────────────────────────────────
    loadMore(increment = 50): void {
        const next = Math.min(this.displayLimit() + increment, this._allItems.length);
        this.displayLimit.set(next);
        this.notifications.set(this._allItems.slice(0, next));
    }

    // ── App Badge API ─────────────────────────────────────────────────────────
    private updateAppBadge(count: number) {
        if (typeof navigator === 'undefined') return;
        void syncAppBadge(navigator, count)
            .catch(e => console.warn('[NotificationService] Failed to update app badge', e));
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
            console.log(`[NotificationService] Auto-cleaned ${stale.length} notifications older than 15 days.`);
        } catch (e) {
            console.warn('[NotificationService] Cleanup failed (non-critical):', e);
        } finally {
            this._isCleaningUp = false;
        }
    }

    private parseLevel(value: unknown): NotificationLevel {
        return value === 'success' || value === 'error' || value === 'warning' ? value : 'info';
    }

    async registerCurrentDevicePushToken(options: { force?: boolean } = {}): Promise<string | null> {
        const user = this.auth.currentUser();
        if (!user) throw new Error('Phiên đăng nhập không hợp lệ.');
        const force = options.force === true;

        if (!force && this.registeredPushToken?.userId === user.uid) {
            return this.registeredPushToken.token;
        }

        if (this.pushTokenRegistration && this.pushTokenRegistrationUserId === user.uid) {
            return this.pushTokenRegistration;
        }

        if (!force &&
            this.pushTokenFailureUserId === user.uid &&
            Date.now() - this.pushTokenFailureAt < this.pushTokenFailureCooldownMs
        ) {
            return null;
        }

        const userId = user.uid;
        const registration = (async () => {
            try {
                const token = await this.registerCurrentDevicePushTokenInternal(userId);
                if (token) {
                    this.registeredPushToken = { userId, token };
                    this.pushTokenFailureUserId = undefined;
                    this.pushTokenFailureAt = 0;
                }
                return token;
            } catch (error) {
                this.pushTokenFailureUserId = userId;
                this.pushTokenFailureAt = Date.now();
                throw error;
            } finally {
                if (this.pushTokenRegistrationUserId === userId) {
                    this.pushTokenRegistration = undefined;
                    this.pushTokenRegistrationUserId = undefined;
                }
            }
        })();

        this.pushTokenRegistration = registration;
        this.pushTokenRegistrationUserId = userId;
        return registration;
    }

    private async registerCurrentDevicePushTokenInternal(userId: string): Promise<string | null> {
        const user = this.auth.currentUser();
        if (!user || user.uid !== userId) return null;

        const token = await this.fb.requestPushToken();
        if (!token) return null;

        const previousToken = localStorage.getItem('lims_fcm_token');
        await this.callNotificationApi({
            action: 'registerToken',
            appId: this.fb.APP_ID,
            token,
            previousToken: previousToken && previousToken !== token ? previousToken : undefined
        });
        localStorage.setItem('lims_fcm_token', token);
        return token;
    }

    private async callNotificationApi(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
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
        return response.json().catch(() => ({}));
    }
}
