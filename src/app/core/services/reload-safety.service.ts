import { Injectable, computed, signal } from '@angular/core';

/**
 * Tracks transient states that make an automatic app reload unsafe.
 * Feature components register blockers while data is dirty or still saving.
 */
@Injectable({ providedIn: 'root' })
export class ReloadSafetyService {
  private readonly blockers = signal<Record<string, string>>({});

  readonly isSafe = computed(() => Object.keys(this.blockers()).length === 0);
  readonly reasons = computed(() => Object.values(this.blockers()));

  setBlocker(key: string, blocked: boolean, reason = 'Có dữ liệu chưa được lưu xong.'): void {
    if (!key) return;

    if (!blocked) {
      this.clearBlocker(key);
      return;
    }

    const current = this.blockers();
    if (current[key] === reason) return;
    this.blockers.set({ ...current, [key]: reason });
  }

  clearBlocker(key: string): void {
    const current = this.blockers();
    if (!(key in current)) return;

    const next = { ...current };
    delete next[key];
    this.blockers.set(next);
  }
}
