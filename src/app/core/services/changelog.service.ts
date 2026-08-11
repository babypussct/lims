import { Injectable, inject, signal } from '@angular/core';
import { ReleaseDoc, ReleaseService } from './release.service';
import { mergeReleaseDocs, selectReleaseFallback } from './changelog-fallback';

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
    await this.load(() => this.releaseService.getLatestReleases(3), this.latestReleases, 3);
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
    target: ReturnType<typeof signal<ChangelogItem[]>>,
    limitCount = Number.POSITIVE_INFINITY
  ): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const releases = await loader();
      const fallback = await this.loadFallback(limitCount);
      const resolved = mergeReleaseDocs(releases, fallback, limitCount);
      target.set(resolved);
      if (resolved.length === 0) this.error.set('Chưa có dữ liệu nhật ký phiên bản.');
    } catch (error) {
      console.warn('[Changelog] Không thể tải release từ Firestore:', error);
      const fallback = await this.loadFallback(limitCount);
      target.set(fallback);
      if (fallback.length === 0) this.error.set('Không thể tải nhật ký phiên bản lúc này.');
    } finally {
      this.loading.set(false);
    }
  }

  private async loadFallback(limitCount: number): Promise<ChangelogItem[]> {
    if (typeof fetch !== 'function') return [];

    for (const path of ['/release-history.json', '/ngsw.json']) {
      try {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) continue;
        const payload = await response.json();
        const releases = selectReleaseFallback(payload, limitCount);
        if (releases.length > 0) return releases;

        const appData = payload?.appData;
        if (path === '/ngsw.json' && appData?.version && appData?.title) {
          const embedded = selectReleaseFallback([{
            version: appData.version,
            date: new Intl.DateTimeFormat('vi-VN').format(new Date()),
            title: appData.title,
            highlights: Array.isArray(appData.features) ? appData.features : []
          }], limitCount);
          if (embedded.length > 0) return embedded;
        }
      } catch {
        // Try the next local fallback without blocking the changelog surface.
      }
    }

    return [];
  }
}
