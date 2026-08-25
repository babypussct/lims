import { Injectable, inject, signal } from '@angular/core';
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type Unsubscribe
} from 'firebase/firestore';
import type { Log } from '../models/log.model';
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
    const snapshot = await getDocs(query(
      collection(this.fb.db, path),
      where('auditClass', '==', 'BUSINESS'),
      where('timestamp', '>=', start),
      where('timestamp', '<=', end),
      orderBy('timestamp', 'asc')
    ));
    this.readMonitor.record('getDocs', path, snapshot.size, { phase: 'history', fromCache: snapshot.metadata.fromCache });
    return snapshot.docs
      .map(document => ({ id: document.id, ...document.data() } as Log))
      .sort((a, b) => (timestampToMillis(a.timestamp) ?? 0) - (timestampToMillis(b.timestamp) ?? 0));
  }
}
