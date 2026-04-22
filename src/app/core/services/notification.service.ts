import { Injectable, inject, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { collection, doc, setDoc, updateDoc, writeBatch, query, where, onSnapshot, Unsubscribe, deleteDoc } from 'firebase/firestore';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);

  // Reactive state
  notifications = signal<AppNotification[]>([]);
  unreadCount = signal(0);
  
  private unsubPersonal?: Unsubscribe;
  private unsubAdmin?: Unsubscribe;
  
  private personalCache = new Map<string, AppNotification>();
  private adminCache = new Map<string, AppNotification>();

  constructor() {
     // Khởi tạo rỗng, không dùng effect() ở đây để tránh race condition
  }

  /** Push a new notification to the system */
  async notify(notification: Omit<AppNotification, 'createdAt' | 'isRead'>) {
    try {
        const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`);
        const newDocRef = doc(colRef);
        
        // Strip undefined fields which crash Firestore setDoc
        const cleanPayload = Object.fromEntries(Object.entries(notification).filter(([_, v]) => v !== undefined));
        
        await setDoc(newDocRef, {
            ...cleanPayload,
            id: newDocRef.id,
            isRead: false,
            createdAt: Date.now()
        });
    } catch (e) {
        console.error('Failed to push notification:', e);
    }
  }

  startListener() {
      this.stopListener(); // Đảm bảo trạng thái sạch
      
      const user = this.auth.currentUser();
      if (!user) return;

      const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/notifications`);
      
      // DUAL-LISTENER ARCHITECTURE: Chạy 2 luồng độc lập để triệt tiêu lỗi index/operator.
      
      // Luồng 1: Personal (Gửi đích danh)
      const qPersonal = query(colRef, where('recipientUid', '==', user.uid));
      this.unsubPersonal = onSnapshot(qPersonal, (snapshot) => {
          this.personalCache.clear();
          snapshot.forEach(d => {
              this.personalCache.set(d.id, { ...d.data(), id: d.id } as AppNotification);
          });
          this.updateState();
      });

      // Luồng 2: Admin (Gửi hệ thống chung)
      const isSystemAdmin = ['admin', 'manager'].includes((user.role || '').toLowerCase()) || 
                            this.auth.canManageSystem() || 
                            this.auth.canApproveStandards();
                            
      if (isSystemAdmin) {
          const qAdmin = query(colRef, where('recipientUid', '==', 'role:admin'));
          this.unsubAdmin = onSnapshot(qAdmin, (snapshot) => {
              this.adminCache.clear();
              snapshot.forEach(d => {
                  this.adminCache.set(d.id, { ...d.data(), id: d.id } as AppNotification);
              });
              this.updateState();
          });
      }
  }
  
  private updateState() {
      // Gộp 2 luồng lại thành 1 Map để tự động khử trùng lặp (nếu có)
      const allMap = new Map<string, AppNotification>();
      this.personalCache.forEach((v, k) => allMap.set(k, v));
      this.adminCache.forEach((v, k) => allMap.set(k, v));
      
      const items = Array.from(allMap.values());
      
      // Sort theo thời gian mới nhất
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      
      // Giới hạn 50 cái mới nhất
      const recentItems = items.slice(0, 50);
      
      let unread = 0;
      recentItems.forEach(n => {
          if (!n.isRead) unread++;
      });
      
      this.notifications.set(recentItems);
      this.unreadCount.set(unread);
  }

  stopListener() {
      if (this.unsubPersonal) { this.unsubPersonal(); this.unsubPersonal = undefined; }
      if (this.unsubAdmin) { this.unsubAdmin(); this.unsubAdmin = undefined; }
      this.personalCache.clear();
      this.adminCache.clear();
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
