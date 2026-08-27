import { Injectable, inject, signal } from '@angular/core';
import {
  collection,
  documentId,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Unsubscribe
} from 'firebase/firestore';
import type { Log, PrintData } from '../models/log.model';
import type { Request } from '../models/request.model';
import { timestampToMillis } from '../../shared/utils/timestamp';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';

const AUDIT_LISTENER_LIMIT = 200;

/**
 * Read model for audit/reporting. This service intentionally owns an
 * independent `/logs` query so Statistics never depends on Activity Feed
 * listener scope or cache semantics.
 */
@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly readMonitor = inject(FirestoreReadMonitor);

  readonly logs = signal<Log[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private unsubscribe?: Unsubscribe;
  private scopeKey = '';

  ensureListener(): void {
    const user = this.auth.currentUser();
    const nextScope = user && this.auth.canViewReports() ? `${user.uid}:business-audit` : '';
    if (nextScope === this.scopeKey && this.unsubscribe) return;

    this.stopListener();
    this.logs.set([]);
    this.error.set(null);
    this.scopeKey = nextScope;
    if (!nextScope) return;

    const path = `artifacts/${this.fb.APP_ID}/logs`;
    const auditQuery = query(
      collection(this.fb.db, path),
      where('auditClass', '==', 'BUSINESS'),
      orderBy('timestamp', 'desc'),
      limit(AUDIT_LISTENER_LIMIT)
    );
    this.loading.set(true);
    let firstSnapshot = true;
    this.unsubscribe = onSnapshot(auditQuery, snapshot => {
      this.readMonitor.record(
        'onSnapshot',
        path,
        firstSnapshot
          ? snapshot.size
          : snapshot.docChanges().filter(change => change.type !== 'removed').length,
        { phase: firstSnapshot ? 'initial' : 'delta', fromCache: snapshot.metadata.fromCache }
      );
      firstSnapshot = false;
      this.logs.set(snapshot.docs.map(document => ({ id: document.id, ...document.data() } as Log)));
      this.loading.set(false);
      this.error.set(null);
    }, error => {
      this.loading.set(false);
      this.error.set(error.message || 'Không thể tải nhật ký audit.');
      console.warn('[AuditLogService] listener failed:', error.message);
    });
  }

  stopListener(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.scopeKey = '';
    this.loading.set(false);
  }

  async getLogsByDateRange(startDate: Date, endDate: Date): Promise<Log[]> {
    if (!this.auth.canViewReports()) throw new Error('Bạn không có quyền xem báo cáo audit.');
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const path = `artifacts/${this.fb.APP_ID}/logs`;
    const logs: Log[] = [];
    const pageSize = 500;
    let cursor: QueryDocumentSnapshot | null = null;

    while (true) {
      const snapshot: QuerySnapshot<DocumentData> = await getDocs(query(
        collection(this.fb.db, path),
        where('auditClass', '==', 'BUSINESS'),
        where('timestamp', '>=', start),
        where('timestamp', '<=', end),
        orderBy('timestamp', 'desc'),
        ...(cursor ? [startAfter(cursor)] : []),
        limit(pageSize)
      ));
      this.readMonitor.record('getDocs', path, snapshot.size, {
        phase: 'report-page',
        fromCache: snapshot.metadata.fromCache
      });
      snapshot.forEach(document => logs.push({ id: document.id, ...document.data() } as Log));
      if (snapshot.size < pageSize) break;
      cursor = snapshot.docs[snapshot.docs.length - 1];
    }

    return logs
      .sort((a, b) => (timestampToMillis(a.timestamp) ?? 0) - (timestampToMillis(b.timestamp) ?? 0));
  }

  /**
   * Resolve immutable print snapshots referenced by audit logs.
   * Legacy logs may embed printData directly; V2 logs reference print_jobs.
   * Results are keyed by log id so callers cannot accidentally double-count
   * a shared or repeated print-job id.
   */
  async getPrintDataForLogs(logs: readonly Log[]): Promise<Map<string, PrintData>> {
    if (!this.auth.canViewReports()) throw new Error('Bạn không có quyền xem dữ liệu báo cáo.');

    const resolved = new Map<string, PrintData>();
    const logIdsByJobId = new Map<string, string[]>();

    for (const log of logs) {
      if (log.printData) {
        resolved.set(log.id, log.printData);
        continue;
      }
      if (!log.printJobId) continue;
      const related = logIdsByJobId.get(log.printJobId) || [];
      related.push(log.id);
      logIdsByJobId.set(log.printJobId, related);
    }

    const jobIds = [...logIdsByJobId.keys()];
    if (jobIds.length === 0) return resolved;

    const path = `artifacts/${this.fb.APP_ID}/print_jobs`;
    const chunkSize = 30;
    for (let i = 0; i < jobIds.length; i += chunkSize) {
      const chunk = jobIds.slice(i, i + chunkSize);
      const snapshot = await getDocs(query(
        collection(this.fb.db, path),
        where(documentId(), 'in', chunk)
      ));
      this.readMonitor.record('getDocs', path, snapshot.size, {
        phase: 'report-print-data',
        fromCache: snapshot.metadata.fromCache
      });

      snapshot.forEach(document => {
        const printData = document.data() as PrintData;
        for (const logId of logIdsByJobId.get(document.id) || []) {
          resolved.set(logId, printData);
        }
      });
    }

    return resolved;
  }

  /**
   * Load request projections only for legacy audit rows whose immutable print
   * snapshot is no longer available. The caller decides whether a projection
   * is safe to use as an N-X-T compatibility fallback.
   */
  async getRequestsForLogs(logs: readonly Log[]): Promise<Map<string, Request>> {
    if (!this.auth.canViewReports()) throw new Error('Bạn không có quyền xem dữ liệu báo cáo.');

    const requestIds = Array.from(new Set(
      logs
        .map(log => log.requestId)
        .filter((requestId): requestId is string => typeof requestId === 'string' && requestId.length > 0)
    ));
    const resolved = new Map<string, Request>();
    if (requestIds.length === 0) return resolved;

    const path = `artifacts/${this.fb.APP_ID}/requests`;
    const chunkSize = 30;
    for (let i = 0; i < requestIds.length; i += chunkSize) {
      const chunk = requestIds.slice(i, i + chunkSize);
      const snapshot = await getDocs(query(
        collection(this.fb.db, path),
        where(documentId(), 'in', chunk)
      ));
      this.readMonitor.record('getDocs', path, snapshot.size, {
        phase: 'report-legacy-request-fallback',
        fromCache: snapshot.metadata.fromCache
      });
      snapshot.forEach(document => {
        resolved.set(document.id, { id: document.id, ...document.data() } as Request);
      });
    }

    return resolved;
  }
}
