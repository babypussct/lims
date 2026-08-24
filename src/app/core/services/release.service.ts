import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type DocumentData
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface ReleaseDoc {
  id?: string;
  version: string;
  date: string;
  title: string;
  highlights?: string[];
  features?: string[];
  improvements?: string[];
  fixes?: string[];
  releaseOrder?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  migratedAt?: unknown;
}

export type ReleaseInput = Omit<ReleaseDoc, 'id' | 'releaseOrder' | 'createdAt' | 'updatedAt' | 'migratedAt'>;

@Injectable({ providedIn: 'root' })
export class ReleaseService {
  private readonly fb = inject(FirebaseService);

  private get releasesCollection() {
    return collection(this.fb.db, 'releases');
  }

  async getRelease(version: string): Promise<ReleaseDoc | null> {
    const normalizedVersion = this.normalizeVersion(version);
    const snapshot = await getDoc(doc(this.releasesCollection, normalizedVersion));
    return snapshot.exists() ? this.toReleaseDoc(snapshot.id, snapshot.data()) : null;
  }

  async getLatestReleases(limitCount = 3): Promise<ReleaseDoc[]> {
    const safeLimit = Math.max(1, Math.min(Math.floor(limitCount), 20));

    try {
      const snapshot = await getDocs(query(
        this.releasesCollection,
        orderBy('releaseOrder', 'desc'),
        limit(safeLimit)
      ));
      return snapshot.docs.map(item => this.toReleaseDoc(item.id, item.data()));
    } catch (error) {
      // Older migrated data may not have releaseOrder yet. A one-time fallback
      // keeps the UI usable while the migration is being completed.
      console.warn('[ReleaseService] Không thể query releaseOrder, dùng fallback:', error);
      const snapshot = await getDocs(this.releasesCollection);
      return snapshot.docs
        .map(item => this.toReleaseDoc(item.id, item.data()))
        .sort((a, b) => this.compareReleases(a, b))
        .slice(0, safeLimit);
    }
  }

  async getAllReleases(): Promise<ReleaseDoc[]> {
    try {
      const snapshot = await getDocs(query(this.releasesCollection, orderBy('releaseOrder', 'desc')));
      return snapshot.docs.map(item => this.toReleaseDoc(item.id, item.data()));
    } catch (error) {
      console.warn('[ReleaseService] Không thể query releaseOrder, dùng fallback:', error);
      const snapshot = await getDocs(this.releasesCollection);
      return snapshot.docs
        .map(item => this.toReleaseDoc(item.id, item.data()))
        .sort((a, b) => this.compareReleases(a, b));
    }
  }

  async ensureReleaseExists(version: string, appData: Partial<ReleaseInput>): Promise<void> {
    const normalizedVersion = this.normalizeVersion(version);
    const existing = await this.getRelease(normalizedVersion);
    const hasExistingContent = existing && (
      (existing.highlights && existing.highlights.length > 0) ||
      (existing.features && existing.features.length > 0) ||
      (existing.improvements && existing.improvements.length > 0) ||
      (existing.fixes && existing.fixes.length > 0)
    );
    const hasIncomingContent = (
      (appData.highlights && appData.highlights.length > 0) ||
      (appData.features && appData.features.length > 0) ||
      (appData.improvements && appData.improvements.length > 0) ||
      (appData.fixes && appData.fixes.length > 0)
    );

    if (existing && hasExistingContent && !hasIncomingContent) return;

    const release: ReleaseInput & { releaseOrder: number } = {
      version: normalizedVersion,
      date: appData.date?.trim() || existing?.date?.trim() || new Intl.DateTimeFormat('vi-VN').format(new Date()),
      title: appData.title?.trim() && appData.title !== 'Cập nhật hệ thống' ? appData.title.trim() : (existing?.title || 'Cập nhật hệ thống'),
      highlights: this.normalizeItems(appData.highlights?.length ? appData.highlights : existing?.highlights),
      features: this.normalizeItems(appData.features?.length ? appData.features : existing?.features),
      improvements: this.normalizeItems(appData.improvements?.length ? appData.improvements : existing?.improvements),
      fixes: this.normalizeItems(appData.fixes?.length ? appData.fixes : existing?.fixes),
      releaseOrder: this.getReleaseOrder(normalizedVersion)
    };

    await setDoc(doc(this.releasesCollection, normalizedVersion), {
      ...release,
      createdAt: existing?.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  private toReleaseDoc(id: string, data: DocumentData): ReleaseDoc {
    const version = this.normalizeVersion(String(data['version'] || id));
    return {
      id,
      version,
      date: typeof data['date'] === 'string' ? data['date'] : '',
      title: typeof data['title'] === 'string' ? data['title'] : 'Cập nhật hệ thống',
      highlights: this.normalizeItems(data['highlights']),
      features: this.normalizeItems(data['features']),
      improvements: this.normalizeItems(data['improvements']),
      fixes: this.normalizeItems(data['fixes']),
      releaseOrder: typeof data['releaseOrder'] === 'number'
        ? data['releaseOrder']
        : this.getReleaseOrder(version),
      createdAt: data['createdAt'],
      updatedAt: data['updatedAt'],
      migratedAt: data['migratedAt']
    };
  }

  private normalizeItems(value: unknown): string[] {
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map(item => item.trim())
      : [];
  }

  private normalizeVersion(version: string): string {
    const value = version.trim();
    return value.startsWith('v') ? value : `v${value}`;
  }

  private getReleaseOrder(version: string): number {
    const match = version.match(/^v(\d{2})\.(\d{2})\.(\d{2})-b(\d+)$/);
    if (!match) return 0;
    return Number(match[1]) * 1_000_000_000
      + Number(match[2]) * 10_000_000
      + Number(match[3]) * 100_000
      + Number(match[4]);
  }

  private compareReleases(a: ReleaseDoc, b: ReleaseDoc): number {
    return (b.releaseOrder || this.getReleaseOrder(b.version))
      - (a.releaseOrder || this.getReleaseOrder(a.version));
  }
}
