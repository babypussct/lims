import { Injectable, inject, signal } from '@angular/core';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type QueryConstraint,
  type Unsubscribe
} from 'firebase/firestore';
import type { Log } from '../models/log.model';
import { timestampToMillis } from '../../shared/utils/timestamp';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';
import { ToastService } from './toast.service';

const PRINT_QUEUE_LIMIT = 300;

/**
 * Independent print read model. It intentionally does not consume
 * StateService.logs()/printableLogs(), so Activity Feed reader changes cannot
 * alter queue contents or request badges.
 */
@Injectable({ providedIn: 'root' })
export class PrintQueueService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly readMonitor = inject(FirestoreReadMonitor);
  private readonly toast = inject(ToastService);

  readonly printableLogs = signal<Log[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly listeners: Unsubscribe[] = [];
  private readonly snapshots = new Map<string, Log[]>();
  private scopeKey = '';

  ensureListener(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.stopListener();
      this.printableLogs.set([]);
      return;
    }

    // Manager sees all printable jobs. Non-manager users use canonical UID
    // ownership; all production printable documents were backfilled before
    // this UID-only reader was released.
    const isManager = user.role === 'manager';
    const nextScope = isManager ? `${user.uid}:manager` : `${user.uid}:self`;
    if (nextScope === this.scopeKey && this.listeners.length > 0) return;

    this.stopListener();
    this.printableLogs.set([]);
    this.error.set(null);
    this.scopeKey = nextScope;

    const path = `artifacts/${this.fb.APP_ID}/logs`;
    this.loading.set(true);
    if (isManager) {
      this.startListener('manager', path, [
        where('printable', '==', true),
        limit(PRINT_QUEUE_LIMIT)
      ]);
      return;
    }

    this.startListener('uid', path, [
      where('printable', '==', true),
      where('actorUid', '==', user.uid),
      limit(PRINT_QUEUE_LIMIT)
    ]);
  }

  stopListener(): void {
    for (const unsubscribe of this.listeners.splice(0)) unsubscribe();
    this.snapshots.clear();
    this.scopeKey = '';
    this.loading.set(false);
  }

  private startListener(key: string, path: string, constraints: QueryConstraint[]): void {
    let firstSnapshot = true;
    const queueQuery = query(collection(this.fb.db, path), ...constraints);
    const unsubscribe = onSnapshot(queueQuery, snapshot => {
      this.readMonitor.record(
        'onSnapshot',
        path,
        firstSnapshot
          ? snapshot.size
          : snapshot.docChanges().filter(change => change.type !== 'removed').length,
        { phase: firstSnapshot ? 'initial' : 'delta', fromCache: snapshot.metadata.fromCache }
      );
      firstSnapshot = false;
      this.snapshots.set(
        key,
        snapshot.docs.map(document => ({ id: document.id, ...document.data() } as Log))
      );
      this.publishMergedLogs();
      this.loading.set(false);
      this.error.set(null);
    }, error => {
      this.loading.set(false);
      this.error.set(error.message || 'Không thể tải hàng đợi in.');
      console.warn(`[PrintQueueService] ${key} listener failed:`, error.message);
    });
    this.listeners.push(unsubscribe);
  }

  private publishMergedLogs(): void {
    const byId = new Map<string, Log>();
    for (const logs of this.snapshots.values()) {
      for (const log of logs) byId.set(log.id, log);
    }
    const merged = [...byId.values()];
    merged.sort((a, b) => (timestampToMillis(b.timestamp) ?? 0) - (timestampToMillis(a.timestamp) ?? 0));
    this.printableLogs.set(merged.slice(0, PRINT_QUEUE_LIMIT));
  }

  async remove(log: Log): Promise<void> {
    try {
      const batch = writeBatch(this.fb.db);
      batch.update(
        doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', log.id),
        { printable: false, lastUpdated: serverTimestamp() }
      );
      if (log.printJobId) {
        batch.delete(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs', log.printJobId));
      }
      await batch.commit();
      this.toast.show('Đã xóa phiếu in khỏi hàng đợi');
    } catch (error: any) {
      this.toast.show('Lỗi xóa phiếu: ' + error.message, 'error');
    }
  }

  async removeMany(logs: readonly Log[]): Promise<void> {
    if (logs.length === 0) return;
    try {
      const batch = writeBatch(this.fb.db);
      logs.forEach(log => {
        batch.update(
          doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', log.id),
          { printable: false, lastUpdated: serverTimestamp() }
        );
        if (log.printJobId) {
          batch.delete(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs', log.printJobId));
        }
      });
      await batch.commit();
      this.toast.show(`Đã xóa ${logs.length} phiếu khỏi hàng đợi`);
    } catch (error: any) {
      this.toast.show('Lỗi xóa phiếu: ' + error.message, 'error');
    }
  }
}
