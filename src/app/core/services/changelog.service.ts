import { Injectable, inject, signal } from '@angular/core';
import { ReleaseDoc, ReleaseService } from './release.service';

export type ChangelogItem = ReleaseDoc;

@Injectable({ providedIn: 'root' })
export class ChangelogService {
  private readonly releaseService = inject(ReleaseService);

  readonly isOpen = signal(false);
  readonly activeVersion = signal<string | null>(null);
  readonly latestReleases = signal<ChangelogItem[]>([]);
  readonly allReleases = signal<ChangelogItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async loadLatest(): Promise<void> {
    await this.load(() => this.releaseService.getLatestReleases(3), this.latestReleases);
  }

  async loadAll(): Promise<void> {
    await this.load(() => this.releaseService.getAllReleases(), this.allReleases);
  }

  open(version?: string): void {
    this.activeVersion.set(version || null);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update(value => !value);
  }

  private async load(
    loader: () => Promise<ChangelogItem[]>,
    target: ReturnType<typeof signal<ChangelogItem[]>>
  ): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      target.set(await loader());
    } catch (error) {
      console.warn('[Changelog] Không thể tải release từ Firestore:', error);
      target.set([]);
      this.error.set('Không thể tải nhật ký phiên bản lúc này.');
    } finally {
      this.loading.set(false);
    }
  }
}
