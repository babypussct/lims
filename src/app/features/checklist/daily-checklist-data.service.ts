import { Injectable, inject } from '@angular/core';
import {
  Query,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot,
  collection,
  documentId,
  getDocs,
  getDocsFromServer,
  limit,
  orderBy,
  query,
  startAfter,
  where
} from 'firebase/firestore';
import { Request } from '../../core/models/request.model';
import { FirebaseService } from '../../core/services/firebase.service';
import { isTrackablePhysicalBatch, isValidDateInput } from './daily-checklist.utils';

export interface DailyChecklistDateOptionsPage {
  dates: string[];
  cursor: QueryDocumentSnapshot | null;
  hasMore: boolean;
  source: 'server' | 'cache';
}

export interface DailyChecklistDateResult {
  requests: Request[];
  source: 'server' | 'cache';
}

/**
 * Date-scoped source of truth for the daily sample tracker.
 *
 * Queries are paginated by document ID so a busy analysis day is never cut off
 * by the global 100-request dashboard cache. Pages are loaded automatically for
 * the selected date; date options are loaded progressively as the user moves
 * backwards through history.
 */
@Injectable({ providedIn: 'root' })
export class DailyChecklistDataService {
  private readonly fb = inject(FirebaseService);
  private readonly requestsPageSize = 100;
  private readonly dateScanPageSize = 200;

  async loadRequestsForDate(
    analysisDate: string,
    onPage?: (loadedCount: number) => void
  ): Promise<DailyChecklistDateResult> {
    if (!isValidDateInput(analysisDate)) return { requests: [], source: 'server' };

    const requestsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
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
            limit(this.requestsPageSize)
          )
        : query(
            requestsRef,
            where('analysisDate', '==', analysisDate),
            orderBy(documentId()),
            limit(this.requestsPageSize)
          );

      const page = await this.getPreferServer(pageQuery);
      if (page.source === 'cache') source = 'cache';
      page.snapshot.docs.forEach(item => {
        const request = { id: item.id, ...item.data() } as Request;
        if (isTrackablePhysicalBatch(request)) requests.set(request.id, request);
      });
      onPage?.(requests.size);

      cursor = page.snapshot.docs.length === this.requestsPageSize
        ? page.snapshot.docs[page.snapshot.docs.length - 1]
        : null;
    } while (cursor);

    return { requests: Array.from(requests.values()), source };
  }

  async loadDateOptionsPage(cursor: QueryDocumentSnapshot | null = null): Promise<DailyChecklistDateOptionsPage> {
    const requestsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
    const pageQuery = cursor
      ? query(
          requestsRef,
          orderBy('analysisDate', 'desc'),
          startAfter(cursor),
          limit(this.dateScanPageSize)
        )
      : query(requestsRef, orderBy('analysisDate', 'desc'), limit(this.dateScanPageSize));

    const page = await this.getPreferServer(pageQuery);
    const dates = Array.from(new Set(
      page.snapshot.docs
        .map(item => ({ id: item.id, ...item.data() } as Request))
        .filter(isTrackablePhysicalBatch)
        .map(request => request.analysisDate || '')
        .filter(isValidDateInput)
    )).sort((a, b) => b.localeCompare(a));

    return {
      dates,
      cursor: page.snapshot.docs.length > 0 ? page.snapshot.docs[page.snapshot.docs.length - 1] : null,
      hasMore: page.snapshot.docs.length === this.dateScanPageSize,
      source: page.source
    };
  }

  private async getPreferServer(queryRef: Query<DocumentData, DocumentData>): Promise<{
    snapshot: QuerySnapshot<DocumentData, DocumentData>;
    source: 'server' | 'cache';
  }> {
    try {
      return { snapshot: await getDocsFromServer(queryRef), source: 'server' };
    } catch {
      return { snapshot: await getDocs(queryRef), source: 'cache' };
    }
  }
}
