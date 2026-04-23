
import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  persistent?: boolean; // Không tự đóng, dùng cho thông báo quan trọng
  action?: () => void;  // Hành động khi bấm vào Toast
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' = 'success', persistent = false, action?: () => void) {
    const id = Date.now();
    this.toasts.update(current => [...current, { id, message, type, persistent, action }]);
    if (!persistent) {
      setTimeout(() => this.remove(id), 5000);
    }
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}