import { Injectable, inject, signal, effect } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { collection, doc, setDoc, updateDoc, writeBatch, query, where, onSnapshot, Unsubscribe, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);

  // Reactive state
  notifications = signal<AppNotification[]>([]);
  unreadCount = signal(0);
  
  private unsub?: Unsubscribe;

  constructor() {
    // Autostart listener when user logs in, stop when logging out
    effect(() => {
        const user = this.auth.currentUser();
        if (user) {
            this.startRealtimeListener();
        } else {
            this.stopListener();
        }
    });
  }

  /** Push a new notification to the system */
  async notify(notification: Omit<AppNotification, 'createdAt' | 'isRead'>) {
    try {
        const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`);
        const newDocRef = doc(colRef);
        
        await setDoc(newDocRef, {
            ...notification,
            id: newDocRef.id,
            isRead: false,
            createdAt: Date.now()
        });
    } catch (e) {
        console.error('Failed to push notification:', e);
    }
  }

  private startRealtimeListener() {
      this.stopListener(); // Ensure clean start
      
      const user = this.auth.currentUser();
      if (!user) return;

      const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`);
      
      // We want notifications strictly for this user UID OR targeted at 'role:admin' if they are an admin
      const isSystemAdmin = ['admin', 'manager'].includes((user.role || '').toLowerCase());
      
      // Lấy thông báo theo recipientUid để đảm bảo luôn lấy được thông báo của user thay vì bị lấp bởi user khác
      // Sau đó sort in-memory để tránh yêu cầu Composite Index từ Firestore.
      const q = isSystemAdmin 
          ? query(colRef, where('recipientUid', 'in', [user.uid, 'role:admin']))
          : query(colRef, where('recipientUid', '==', user.uid));

      this.unsub = onSnapshot(q, (snapshot) => {
          const items: AppNotification[] = [];
          let unread = 0;
          
          snapshot.forEach(d => {
              const data = d.data() as AppNotification;
              items.push({ ...data, id: d.id });
          });
          
          // Sort in-memory theo createdAt desc
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          
          // Giới hạn 50 thông báo mới nhất
          const recentItems = items.slice(0, 50);
          
          recentItems.forEach(n => {
              if (!n.isRead) unread++;
          });
          
          this.notifications.set(recentItems);
          this.unreadCount.set(unread);
      }, (err) => {
          console.error("Error listening to notifications:", err);
      });
  }

  private stopListener() {
      if (this.unsub) {
          this.unsub();
          this.unsub = undefined;
      }
      this.notifications.set([]);
      this.unreadCount.set(0);
  }

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
}
