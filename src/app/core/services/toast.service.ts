
import { Injectable, signal } from '@angular/core';
import { NotificationLevel } from '../models/notification.model';

export interface Toast {
  id: string;
  message: string;
  type: NotificationLevel;
  title?: string;
  persistent?: boolean; // Không tự đóng, dùng cho thông báo quan trọng
  action?: () => void;  // Hành động khi bấm vào Toast
  actionLabel?: string;
  dedupeKey?: string;
  durationMs?: number;
  paused?: boolean;
  count?: number;
}

export interface ToastOptions {
  message: string;
  type?: NotificationLevel;
  title?: string;
  persistent?: boolean;
  action?: () => void;
  actionLabel?: string;
  dedupeKey?: string;
  durationMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private sequence = 0;
  private readonly maxVisible = 3;
  private readonly queue: Toast[] = [];
  private readonly timers = new Map<string, {
    handle?: ReturnType<typeof setTimeout>;
    remainingMs: number;
    startedAt: number;
  }>();

  show(message: string, type: NotificationLevel = 'success', persistent = false, action?: () => void) {
    return this.showEvent({ message, type, persistent, action });
  }

  showEvent(options: ToastOptions): string {
    const type = options.type ?? 'success';
    const id = `${Date.now()}-${++this.sequence}`;

    const groupKey = options.dedupeKey || `${type}:${options.message}`;
    const existing = [...this.toasts(), ...this.queue].find(t => 
      (t.dedupeKey || `${t.type}:${t.message}`) === groupKey
    );

    if (existing) {
      this.toasts.update(current => 
        current.map(t => t.id === existing.id 
          ? { ...t, count: (t.count || 1) + 1 } 
          : t
        )
      );
      
      const timer = this.timers.get(existing.id);
      if (timer) {
        if (timer.handle) clearTimeout(timer.handle);
        timer.remainingMs = this.defaultDuration(type);
        timer.startedAt = Date.now();
        timer.handle = setTimeout(() => this.remove(existing.id), timer.remainingMs);
      }
      return existing.id;
    }

    const durationMs = options.durationMs ?? this.defaultDuration(type);

    const toast: Toast = {
      id,
      message: options.message,
      type,
      title: options.title,
      persistent: options.persistent,
      action: options.action,
      actionLabel: options.actionLabel,
      dedupeKey: options.dedupeKey,
      durationMs: options.persistent ? undefined : durationMs,
      paused: false,
      count: 1
    };

    if (this.toasts().length < this.maxVisible) {
      this.toasts.update(current => [...current, toast]);
      this.startTimer(toast);
    } else {
      this.queue.push(toast);
    }
    return id;
  }

  remove(id: string) {
    const timer = this.timers.get(id);
    if (timer?.handle) clearTimeout(timer.handle);
    this.timers.delete(id);
    this.toasts.update(current => current.filter(t => t.id !== id));
    const queuedIndex = this.queue.findIndex(t => t.id === id);
    if (queuedIndex >= 0) this.queue.splice(queuedIndex, 1);
    this.activateNext();
  }

  runAction(toast: Toast) {
    toast.action?.();
    this.remove(toast.id);
  }

  pause(id: string) {
    const timer = this.timers.get(id);
    if (!timer?.handle) return;
    clearTimeout(timer.handle);
    timer.handle = undefined;
    timer.remainingMs = Math.max(0, timer.remainingMs - (Date.now() - timer.startedAt));
    this.toasts.update(current => current.map(t => t.id === id ? { ...t, paused: true } : t));
  }

  resume(id: string) {
    const timer = this.timers.get(id);
    if (!timer || timer.handle || timer.remainingMs <= 0) return;
    timer.startedAt = Date.now();
    timer.handle = setTimeout(() => this.remove(id), timer.remainingMs);
    this.toasts.update(current => current.map(t => t.id === id ? { ...t, paused: false } : t));
  }

  // Xóa tất cả toast chứa đoạn text nhất định (dùng để chống duplicate persistent toast)
  removeByMessage(partial: string) {
    const ids = this.toasts().filter(t => t.message.includes(partial)).map(t => t.id);
    this.queue
      .filter(t => t.message.includes(partial))
      .forEach(t => ids.push(t.id));
    ids.forEach(id => this.remove(id));
  }

  private startTimer(toast: Toast) {
    if (toast.persistent || !toast.durationMs) return;
    const timer = {
      remainingMs: toast.durationMs,
      startedAt: Date.now(),
      handle: undefined as ReturnType<typeof setTimeout> | undefined
    };
    timer.handle = setTimeout(() => this.remove(toast.id), timer.remainingMs);
    this.timers.set(toast.id, timer);
  }

  private activateNext() {
    if (this.toasts().length >= this.maxVisible) return;
    const next = this.queue.shift();
    if (!next) return;
    this.toasts.update(current => [...current, next]);
    this.startTimer(next);
  }

  private defaultDuration(type: NotificationLevel): number {
    if (type === 'success') return 3000;
    if (type === 'warning') return 7000;
    if (type === 'error') return 9000;
    return 5000;
  }
}
