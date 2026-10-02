import { Injectable, effect, inject, signal } from '@angular/core';
import { collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore';
import { BatchWorksheetLoader, WorksheetReference, WorksheetSnapshot } from '../../shared/utils/batch-worksheet';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';
import { PrintService } from './print.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class BatchWorksheetService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly prints = inject(PrintService);
  private readonly monitor = inject(FirestoreReadMonitor);
  private readonly toast = inject(ToastService);
  readonly loading = signal(false);
  private scope = '';
  private ownsPreview = false;
  private readonly loader = new BatchWorksheetLoader({
    snapshots: ids => this.fetchSnapshots(ids), legacy: id => this.fetchLegacy(id),
  });

  constructor() {
    effect(() => { this.syncScope(); });
  }

  private syncScope(): string {
    const scope = this.currentScope();
    if (scope !== this.scope) {
      this.loader.clear(); this.scope = scope;
      if (this.ownsPreview) this.prints.closePreview();
      this.ownsPreview = false;
    }
    return scope;
  }

  private currentScope(): string {
    return `${this.fb.APP_ID}|${this.auth.currentUser()?.uid || ''}|${this.auth.getDeltaCacheScope()}|${this.auth.isStandardAuditMode()}`;
  }

  canRead(): boolean {
    return !!this.auth.currentUser() && !this.auth.isStandardAuditMode()
      && (this.auth.hasPermission('sop_view') || this.auth.canApprove() || this.auth.canRunBatch() || this.auth.canViewReports());
  }

  rememberSnapshot(snapshot: WorksheetSnapshot): void {
    if (!this.canRead()) return;
    this.syncScope();
    this.loader.seed(snapshot);
  }

  async open(references: readonly WorksheetReference[]): Promise<boolean> {
    if (!references.length || this.loading() || this.prints.isPrinting()) return false;
    if (!this.canRead()) { this.toast.show('Bạn không có quyền xem phiếu phân tích.', 'warning'); return false; }
    const scope = this.syncScope();
    this.loading.set(true);
    try {
      const jobs = await this.loader.load(references);
      if (scope !== this.currentScope() || !this.canRead()) return false;
      this.prints.openPreview(jobs);
      this.ownsPreview = true;
      return true;
    } catch (error) {
      if (scope === this.currentScope()) this.toast.show(error instanceof Error ? error.message : 'Không tải được phiếu phân tích.', 'error');
      return false;
    } finally { this.loading.set(false); }
  }

  private async fetchSnapshots(ids: readonly string[]): Promise<WorksheetSnapshot[]> {
    const path = `artifacts/${this.fb.APP_ID}/print_jobs`;
    const result: WorksheetSnapshot[] = [];
    for (let offset = 0; offset < ids.length; offset += 30) {
      const snapshot = await getDocs(query(collection(this.fb.db, path), where(documentId(), 'in', ids.slice(offset, offset + 30))));
      this.monitor.record('getDocs', path, snapshot.size, { phase: 'batch', fromCache: snapshot.metadata.fromCache });
      result.push(...snapshot.docs.map(entry => ({ id: entry.id, data: entry.data() })));
    }
    return result;
  }

  private async fetchLegacy(requestId: string): Promise<WorksheetSnapshot[]> {
    const path = `artifacts/${this.fb.APP_ID}/print_jobs`;
    const snapshot = await getDocs(query(collection(this.fb.db, path), where('requestId', '==', requestId)));
    this.monitor.record('getDocs', path, snapshot.size, { phase: 'history', fromCache: snapshot.metadata.fromCache });
    if (!snapshot.empty) return snapshot.docs.map(entry => ({ id: entry.id, data: entry.data() }));
    // Pre-splitting records may only have the original payload embedded in a log.
    // The public projection resolves a known ID without a broad logs query.
    const projection = await getDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/public_traceability/${requestId}`));
    this.monitor.record('getDoc', `artifacts/${this.fb.APP_ID}/public_traceability`, 1, { fromCache: projection.metadata.fromCache });
    const logId = projection.data()?.['logId'];
    if (!logId) return [];
    const log = await getDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/logs/${logId}`));
    this.monitor.record('getDoc', `artifacts/${this.fb.APP_ID}/logs`, 1, { fromCache: log.metadata.fromCache });
    const data = log.data();
    if (data?.['printJobId']) return this.fetchSnapshots([data['printJobId']]);
    return data?.['printData'] ? [{ id: logId, data: { ...data['printData'], traceLogId: logId, createdAt: data['timestamp'], createdBy: data['user'] } }] : [];
  }
}
