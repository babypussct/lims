import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  doc,
  documentId,
  getDoc,
  getDocFromServer,
  getDocs,
  getDocsFromServer,
  limit,
  orderBy,
  query,
  startAfter,
  where
} from 'firebase/firestore';
import { Request } from '../../core/models/request.model';
import { DailyChecklistDocument } from '../../core/models/daily-checklist.model';
import { FirebaseService } from '../../core/services/firebase.service';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
import { DailyChecklistMaterializerService } from '../../core/services/daily-checklist-materializer.service';
import {
  dailyChecklistDocumentToRequests,
  isDailyChecklistRequest,
  isValidDailyChecklistDate
} from '../../core/utils/daily-checklist-projection';
import {
  DailyChecklistDateResult,
  DailyChecklistResultCache,
  shouldFallbackToLegacyRequests
} from './daily-checklist-data-cache';

export type { DailyChecklistDateResult } from './daily-checklist-data-cache';

/**
 * Reads the materialized daily document first and falls back to `requests`
 * whenever that document is absent. An existing-but-empty document is an
 * authoritative empty day.
 */
@Injectable({ providedIn: 'root' })
export class DailyChecklistDataService {
  private readonly fb = inject(FirebaseService);
  private readonly readMonitor = inject(FirestoreReadMonitor);
  private readonly dailyChecklistMaterializer = inject(DailyChecklistMaterializerService);
  private readonly requestCacheTtlMs = 5 * 60 * 1000;
  private readonly requestCache = new DailyChecklistResultCache(this.requestCacheTtlMs);
  private readonly requestLoads = new Map<string, Promise<DailyChecklistDateResult>>();
  private readonly legacyPageSize = 100;
  private readonly documentSizeWarningBytes = 800 * 1024;
  private readonly invalidationSubscription = this.dailyChecklistMaterializer.invalidatedDates$.subscribe(
    analysisDate => this.invalidateDate(analysisDate)
  );

  async loadRequestsForDate(
    analysisDate: string,
    onPage?: (loadedCount: number) => void,
    forceRefresh = false
  ): Promise<DailyChecklistDateResult> {
    if (!isValidDailyChecklistDate(analysisDate)) {
      return { requests: [], source: 'server', materialized: true };
    }

    const cached = this.requestCache.get(analysisDate);
    if (!forceRefresh && cached) {
      onPage?.(cached.requests.length);
      return this.cloneDateResult(cached);
    }

    const inFlight = this.requestLoads.get(analysisDate);
    if (!forceRefresh && inFlight) {
      const result = await inFlight;
      onPage?.(result.requests.length);
      return this.cloneDateResult(result);
    }

    if (forceRefresh) this.invalidateDate(analysisDate);
    const cacheGeneration = this.requestCache.generation(analysisDate);
    const load = this.fetchRequestsForDate(analysisDate, onPage);
    this.requestLoads.set(analysisDate, load);
    try {
      const result = await load;
      this.requestCache.setIfCurrent(analysisDate, result, cacheGeneration);
      return this.cloneDateResult(result);
    } finally {
      if (this.requestLoads.get(analysisDate) === load) this.requestLoads.delete(analysisDate);
    }
  }

  private async fetchRequestsForDate(
    analysisDate: string,
    onPage?: (loadedCount: number) => void
  ): Promise<DailyChecklistDateResult> {
    const dailyPath = `artifacts/${this.fb.APP_ID}/daily_checklists/${analysisDate}`;
    const dailyRef = doc(this.fb.db, dailyPath);
    const dailySnapshot = await this.getDailyDocumentPreferServer(dailyRef, dailyPath);

    if (dailySnapshot.snapshot.exists()) {
      const data = dailySnapshot.snapshot.data() as Partial<DailyChecklistDocument>;
      this.warnIfLargeDocument(dailyPath, data);
      const requests = dailyChecklistDocumentToRequests(data, analysisDate);
      onPage?.(requests.length);
      return { requests, source: dailySnapshot.source, materialized: true };
    }

    return shouldFallbackToLegacyRequests(analysisDate, false)
      ? this.fetchLegacyRequestsForDate(analysisDate, onPage)
      : { requests: [], source: dailySnapshot.source, materialized: true };
  }

  invalidateDate(analysisDate: string): void {
    if (!isValidDailyChecklistDate(analysisDate)) return;
    this.requestCache.invalidate(analysisDate);
    this.requestLoads.delete(analysisDate);
  }

  private async fetchLegacyRequestsForDate(
    analysisDate: string,
    onPage?: (loadedCount: number) => void
  ): Promise<DailyChecklistDateResult> {
    const requestsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
    const metricPath = `artifacts/${this.fb.APP_ID}/requests?analysisDate=${analysisDate}&legacyFallback=1`;
    const requests = new Map<string, Request>();
    let cursor: QueryDocumentSnapshot | null = null;
    let source: 'server' | 'cache' = 'server';

    do {
      const pageQuery = cursor
        ? query(
            requestsRef,
            where('analysisDate', '==', analysisDate),
            orderBy(documentId()),
            startAfter(cursor),
            limit(this.legacyPageSize)
          )
        : query(
            requestsRef,
            where('analysisDate', '==', analysisDate),
            orderBy(documentId()),
            limit(this.legacyPageSize)
          );
      const page = await this.getLegacyPagePreferServer(pageQuery, metricPath);
      if (page.source === 'cache') source = 'cache';
      page.snapshot.docs.forEach(item => {
        const request = { id: item.id, ...item.data() } as Request;
        if (isDailyChecklistRequest(request)) requests.set(request.id, request);
      });
      onPage?.(requests.size);
      cursor = page.snapshot.docs.length === this.legacyPageSize
        ? page.snapshot.docs[page.snapshot.docs.length - 1]
        : null;
    } while (cursor);

    return { requests: Array.from(requests.values()), source, materialized: false };
  }

  private async getDailyDocumentPreferServer(
    documentRef: ReturnType<typeof doc>,
    metricPath: string
  ): Promise<{
    snapshot: DocumentSnapshot<DocumentData, DocumentData>;
    source: 'server' | 'cache';
  }> {
    try {
      const snapshot = await getDocFromServer(documentRef);
      this.readMonitor.record('getDoc', metricPath, 1);
      return { snapshot, source: 'server' };
    } catch {
      const snapshot = await getDoc(documentRef);
      const fromCache = snapshot.metadata.fromCache;
      this.readMonitor.record('getDoc', metricPath, 1, { fromCache });
      return { snapshot, source: fromCache ? 'cache' : 'server' };
    }
  }

  private async getLegacyPagePreferServer(
    queryRef: Query<DocumentData, DocumentData>,
    metricPath: string
  ): Promise<{
    snapshot: QuerySnapshot<DocumentData, DocumentData>;
    source: 'server' | 'cache';
  }> {
    try {
      const snapshot = await getDocsFromServer(queryRef);
      this.readMonitor.record('getDocs', metricPath, snapshot.size, { phase: 'page' });
      return { snapshot, source: 'server' };
    } catch {
      const snapshot = await getDocs(queryRef);
      const fromCache = snapshot.metadata.fromCache;
      this.readMonitor.record('getDocs', metricPath, snapshot.size, { phase: 'page', fromCache });
      return { snapshot, source: fromCache ? 'cache' : 'server' };
    }
  }

  private warnIfLargeDocument(path: string, data: Partial<DailyChecklistDocument>): void {
    try {
      const bytes = new TextEncoder().encode(JSON.stringify(data)).byteLength;
      if (bytes >= this.documentSizeWarningBytes) {
        console.warn(`[DailyChecklist] Document ${path} is approximately ${Math.round(bytes / 1024)} KiB; consider sharding.`);
      }
    } catch {
      // Diagnostics must never block the daily board.
    }
  }

  private cloneDateResult(result: DailyChecklistDateResult): DailyChecklistDateResult {
    return { ...result, requests: [...result.requests] };
  }
}
