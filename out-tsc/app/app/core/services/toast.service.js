import { Injectable, signal } from '@angular/core';
import * as i0 from "@angular/core";
export class ToastService {
    constructor() {
        this.toasts = signal([]);
        this.sequence = 0;
        this.maxVisible = 3;
        this.queue = [];
        this.timers = new Map();
    }
    show(message, type = 'success', persistent = false, action) {
        return this.showEvent({ message, type, persistent, action });
    }
    showEvent(options) {
        const type = options.type ?? 'success';
        const id = `${Date.now()}-${++this.sequence}`;
        const groupKey = options.dedupeKey || `${type}:${options.message}`;
        const existing = [...this.toasts(), ...this.queue].find(t => (t.dedupeKey || `${t.type}:${t.message}`) === groupKey);
        if (existing) {
            this.toasts.update(current => current.map(t => t.id === existing.id
                ? { ...t, count: (t.count || 1) + 1 }
                : t));
            const timer = this.timers.get(existing.id);
            if (timer) {
                if (timer.handle)
                    clearTimeout(timer.handle);
                timer.remainingMs = this.defaultDuration(type);
                timer.startedAt = Date.now();
                timer.handle = setTimeout(() => this.remove(existing.id), timer.remainingMs);
            }
            return existing.id;
        }
        const durationMs = options.durationMs ?? this.defaultDuration(type);
        const toast = {
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
        }
        else {
            this.queue.push(toast);
        }
        return id;
    }
    remove(id) {
        const timer = this.timers.get(id);
        if (timer?.handle)
            clearTimeout(timer.handle);
        this.timers.delete(id);
        this.toasts.update(current => current.filter(t => t.id !== id));
        const queuedIndex = this.queue.findIndex(t => t.id === id);
        if (queuedIndex >= 0)
            this.queue.splice(queuedIndex, 1);
        this.activateNext();
    }
    runAction(toast) {
        toast.action?.();
        this.remove(toast.id);
    }
    pause(id) {
        const timer = this.timers.get(id);
        if (!timer?.handle)
            return;
        clearTimeout(timer.handle);
        timer.handle = undefined;
        timer.remainingMs = Math.max(0, timer.remainingMs - (Date.now() - timer.startedAt));
        this.toasts.update(current => current.map(t => t.id === id ? { ...t, paused: true } : t));
    }
    resume(id) {
        const timer = this.timers.get(id);
        if (!timer || timer.handle || timer.remainingMs <= 0)
            return;
        timer.startedAt = Date.now();
        timer.handle = setTimeout(() => this.remove(id), timer.remainingMs);
        this.toasts.update(current => current.map(t => t.id === id ? { ...t, paused: false } : t));
    }
    // Xóa tất cả toast chứa đoạn text nhất định (dùng để chống duplicate persistent toast)
    removeByMessage(partial) {
        const ids = this.toasts().filter(t => t.message.includes(partial)).map(t => t.id);
        this.queue
            .filter(t => t.message.includes(partial))
            .forEach(t => ids.push(t.id));
        ids.forEach(id => this.remove(id));
    }
    startTimer(toast) {
        if (toast.persistent || !toast.durationMs)
            return;
        const timer = {
            remainingMs: toast.durationMs,
            startedAt: Date.now(),
            handle: undefined
        };
        timer.handle = setTimeout(() => this.remove(toast.id), timer.remainingMs);
        this.timers.set(toast.id, timer);
    }
    activateNext() {
        if (this.toasts().length >= this.maxVisible)
            return;
        const next = this.queue.shift();
        if (!next)
            return;
        this.toasts.update(current => [...current, next]);
        this.startTimer(next);
    }
    defaultDuration(type) {
        if (type === 'success')
            return 3000;
        if (type === 'warning')
            return 7000;
        if (type === 'error')
            return 9000;
        return 5000;
    }
    static { this.ɵfac = function ToastService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ToastService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ToastService, factory: ToastService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ToastService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=toast.service.js.map