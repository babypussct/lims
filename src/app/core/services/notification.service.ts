import { Injectable, inject, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import {
    collection, doc, setDoc, updateDoc, writeBatch,
    query, where, onSnapshot, Unsubscribe, deleteDoc, getDocs, arrayUnion
} from 'firebase/firestore';
import { onMessage } from 'firebase/messaging';
import { AppNotification } from '../models/notification.model';

// Notifications older than 90 days are auto-cleaned up on listener start
const CLEANUP_AGE_MS = 90 * 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private fb = inject(FirebaseService);
    private auth = inject(AuthService);
    private toast = inject(ToastService);

    // Reactive state
    notifications = signal<AppNotification[]>([]);
    unreadCount = signal(0);

    private unsub?: Unsubscribe;
    private fcmUnsub?: () => void;

    // Cache of admin/manager UIDs — populated once per session on first broadcast
    private adminUidsCache: string[] | null = null;
    // Cache of all UIDs — populated once per session on first global broadcast
    private allUidsCache: string[] | null = null;

    constructor() {
        // Initialise empty; startListener() is called by AppComponent after login
    }

    // ── Fan-out: resolve all admin/manager UIDs (cached per session) ──────────
    private async getAdminUids(): Promise<string[]> {
        if (this.adminUidsCache) return this.adminUidsCache;
        try {
            const users = await this.fb.getAllUsers();
            this.adminUidsCache = users
                .filter(u => u.role === 'manager' || u.permissions?.includes('standard_approve'))
                .map(u => u.uid);
        } catch {
            this.adminUidsCache = [];
        }
        return this.adminUidsCache;
    }

    // ── Fan-out: resolve ALL UIDs (cached per session) ──────────
    private async getAllUids(): Promise<string[]> {
        if (this.allUidsCache) return this.allUidsCache;
        try {
            const users = await this.fb.getAllUsers();
            this.allUidsCache = users.map(u => u.uid);
        } catch {
            this.allUidsCache = [];
        }
        return this.allUidsCache;
    }

    // ── Push a notification ───────────────────────────────────────────────────
    /**
     * Send a notification to one or more recipients.
     *
     * - Pass a specific UID in `recipientUid` for personal notifications.
     * - Pass `'role:admin'` to fan-out to all admin/manager users
     *   (each gets their own independent Firestore document).
     */
    async notify(notification: Omit<AppNotification, 'createdAt' | 'isRead'>) {
        try {
            const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`);
            const groupId = doc(colRef).id; // Shared event ID for all fan-out copies
            const createdAt = Date.now();

            const cleanPayload = Object.fromEntries(
                Object.entries(notification).filter(([_, v]) => v !== undefined)
            );

            if (notification.recipientUid === 'role:admin' || notification.recipientUid === 'role:all') {
                // ── BROADCAST: fan-out — one document per recipient ──────
                const uids = notification.recipientUid === 'role:all' 
                    ? await this.getAllUids() 
                    : await this.getAdminUids();

                if (uids.length === 0) {
                    console.warn(`[NotificationService] No UIDs found for broadcast (${notification.recipientUid}).`);
                    return;
                }

                const batch = writeBatch(this.fb.db);
                for (const uid of uids) {
                    const newDocRef = doc(colRef);
                    batch.set(newDocRef, {
                        ...cleanPayload,
                        id: newDocRef.id,
                        recipientUid: uid,   // Replace role placeholder with real UID
                        groupId,             // Link all copies to the same event
                        isRead: false,
                        createdAt,
                    });
                }
                await batch.commit();
                
                // ── Trigger Web Push API ──
                this._triggerWebPush(uids, cleanPayload);

            } else {
                // ── PERSONAL: single document for a specific user ─────────────
                const newDocRef = doc(colRef);
                await setDoc(newDocRef, {
                    ...cleanPayload,
                    id: newDocRef.id,
                    isRead: false,
                    createdAt,
                });
                
                // ── Trigger Web Push API ──
                if (notification.recipientUid) {
                    this._triggerWebPush([notification.recipientUid], cleanPayload);
                }
            }
        } catch (e: any) {
            console.error('Failed to push notification:', e);
            this.toast.show('Lỗi lưu thông báo: ' + e.message, 'error');
        }
    }

    // ── Call Vercel Serverless Function to send Web Push ─────────────
    private async _triggerWebPush(recipientUids: string[], notification: any) {
        if (!recipientUids || recipientUids.length === 0) return;
        try {
            // Using absolute URL to ensure it works properly
            const url = window.location.origin + '/api/push';
            const payload = {
                recipientUids,
                title: notification.title || 'LIMS Thông báo',
                body: notification.message || 'Bạn có một thông báo mới.',
                url: notification.link || '/',
                appId: this.fb.APP_ID
            };

            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(e => console.warn('[WebPush] fetch error:', e)); // Fire and forget
            
        } catch (e) {
            console.warn('[NotificationService] Web Push API call failed:', e);
        }
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

            // Sort newest first, limit to 50
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            const recent = items.slice(0, 50);

            this.notifications.set(recent);
            const currentUnread = recent.filter(n => !n.isRead).length;
            this.unreadCount.set(currentUnread);
            this.updateAppBadge(currentUnread);

            // Trigger 90-day cleanup in background (fire-and-forget)
            this._cleanupOldNotifications(items);

        }, (error) => {
            console.error('[NotificationService] Listener error:', error.message);
        });

        // Request FCM Push Token
        this.fb.requestPushToken().then(token => {
            if (token) {
                console.log('[NotificationService] FCM Token received:', token);
                localStorage.setItem('lims_fcm_token', token); // Lưu token của thiết bị này
                const userRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/users`, user.uid);
                updateDoc(userRef, { fcmTokens: arrayUnion(token) }).catch(() => {});
            }
        });

        // Listen for foreground FCM messages
        if (this.fb.messaging) {
            this.fcmUnsub = onMessage(this.fb.messaging, (payload) => {
                console.log('[NotificationService] Foreground message received:', payload);
                const title = payload.notification?.title || 'Thông báo';
                const body = payload.notification?.body || 'Bạn có thông báo mới.';
                this.toast.show(`${title}: ${body}`, 'info');
                
                // Trình duyệt hỗ trợ Notification API và đã cấp quyền, có thể gọi system notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(title, {
                        body: body,
                        icon: '/icons/icon-192x192.png'
                    });
                }
            });
        }
    }

    stopListener() {
        if (this.unsub) { this.unsub(); this.unsub = undefined; }
        if (this.fcmUnsub) { this.fcmUnsub(); this.fcmUnsub = undefined; }
        this.notifications.set([]);
        this.unreadCount.set(0);
        this.updateAppBadge(0);
        this.adminUidsCache = null; // Reset cache on logout
        this.allUidsCache = null;
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
        const unreadList = this.notifications().filter(n => !n.isRead && n.id);
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
}
