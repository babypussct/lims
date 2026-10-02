import type { PrintJob } from '../../core/services/print.service';
import type { Request } from '../../core/models/request.model';
import { timestampToDate, timestampToMillis } from './timestamp';

export interface WorksheetReference {
  requestId?: string;
  printJobId?: string;
  traceLogId?: string;
  printData?: unknown;
  timestamp?: unknown;
  user?: string;
}

export interface WorksheetSnapshot {
  id: string;
  data: Record<string, any>;
}

export interface WorksheetReader {
  snapshots(ids: readonly string[]): Promise<WorksheetSnapshot[]>;
  legacy(requestId: string): Promise<WorksheetSnapshot[]>;
}

export function isWorksheetData(value: unknown): value is Record<string, any> {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, any>;
  return !!data['sop']?.name && typeof data['inputs'] === 'object' && !!data['inputs']
    && Array.isArray(data['items']) && (data['margin'] === undefined || Number.isFinite(data['margin']));
}

export function worksheetReference(request: Pick<Request, 'id' | 'currentPrintJobId'>): WorksheetReference {
  return { requestId: request.id, printJobId: request.currentPrintJobId };
}

export function canEditWorksheet(request: Request, actorEmail?: string): boolean {
  return request.status === 'approved' && !request._isDeleted && !request.isVirtualMaster
    && !request.parentMasterId && !request.analysisResult && !request.analysisResultSummary
    && (!request.lockedBy || request.lockedBy === actorEmail);
}

function toJob(data: Record<string, any>, reference: WorksheetReference, id?: string): PrintJob {
  const requestId = reference.requestId || data['requestId'];
  return {
    sop: structuredClone(data['sop']), inputs: structuredClone(data['inputs']),
    items: structuredClone(data['items']), margin: data['margin'] ?? 0,
    analysisDate: data['analysisDate'],
    date: timestampToDate(reference.timestamp ?? data['createdAt']) ?? '',
    user: reference.user ?? data['createdBy'], requestId,
    batchCode: data['inputs']?.['batchCode'] || requestId || '',
    printJobId: id,
    traceLogId: reference.traceLogId || data['traceLogId'],
  };
}

/** Bounded session cache for immutable snapshots; errors and missing jobs are retryable. */
export class BatchWorksheetLoader {
  private readonly cache = new Map<string, WorksheetSnapshot>();
  private readonly pending = new Map<string, Promise<WorksheetSnapshot | undefined>>();
  private readonly legacyCache = new Map<string, { at: number; snapshot: WorksheetSnapshot }>();
  private readonly legacyPending = new Map<string, Promise<WorksheetSnapshot | undefined>>();
  private generation = 0;

  constructor(private readonly reader: WorksheetReader, private readonly maxEntries = 100,
    private readonly now: () => number = Date.now) {}

  clear(): void {
    this.generation++;
    this.cache.clear(); this.pending.clear(); this.legacyCache.clear(); this.legacyPending.clear();
  }

  seed(snapshot: WorksheetSnapshot): void { this.remember(snapshot); }

  private remember(snapshot: WorksheetSnapshot): void {
    if (!isWorksheetData(snapshot.data)) return;
    this.cache.delete(snapshot.id);
    this.cache.set(snapshot.id, snapshot);
    while (this.cache.size > this.maxEntries) this.cache.delete(this.cache.keys().next().value!);
  }

  private async loadSnapshots(ids: readonly string[]): Promise<Map<string, WorksheetSnapshot>> {
    const generation = this.generation;
    const missing = [...new Set(ids)].filter(id => !this.cache.has(id) && !this.pending.has(id));
    if (missing.length) {
      const batch = this.reader.snapshots(missing).then(snapshots => {
        if (generation !== this.generation) throw new Error('Phiên truy cập đã thay đổi. Vui lòng mở lại phiếu.');
        snapshots.forEach(snapshot => this.remember(snapshot));
        return new Map(snapshots.map(snapshot => [snapshot.id, snapshot]));
      });
      for (const id of missing) {
        const promise = batch.then(snapshots => snapshots.get(id));
        this.pending.set(id, promise);
      }
    }
    const results = await Promise.all(ids.map(async id => {
      const cached = this.cache.get(id);
      if (cached) return cached;
      const promise = this.pending.get(id)!;
      try { return await promise; }
      finally { if (this.pending.get(id) === promise) this.pending.delete(id); }
    }));
    return new Map(results.filter((snapshot): snapshot is WorksheetSnapshot => !!snapshot)
      .map(snapshot => [snapshot.id, snapshot]));
  }

  private async legacy(requestId: string): Promise<WorksheetSnapshot | undefined> {
    const cached = this.legacyCache.get(requestId);
    if (cached && this.now() - cached.at < 30_000) return cached.snapshot;
    let promise = this.legacyPending.get(requestId);
    if (!promise) {
      const generation = this.generation;
      promise = this.reader.legacy(requestId).then(snapshots => {
        if (generation !== this.generation) throw new Error('Phiên truy cập đã thay đổi. Vui lòng mở lại phiếu.');
        const snapshot = snapshots
          .sort((a, b) => (timestampToMillis(b.data['createdAt']) ?? 0) - (timestampToMillis(a.data['createdAt']) ?? 0)
            || b.id.localeCompare(a.id))[0];
        if (snapshot && isWorksheetData(snapshot.data)) {
          this.remember(snapshot);
          this.legacyCache.delete(requestId);
          this.legacyCache.set(requestId, { at: this.now(), snapshot });
          while (this.legacyCache.size > this.maxEntries) this.legacyCache.delete(this.legacyCache.keys().next().value!);
        }
        return snapshot;
      });
      this.legacyPending.set(requestId, promise);
    }
    try { return await promise; }
    finally { if (this.legacyPending.get(requestId) === promise) this.legacyPending.delete(requestId); }
  }

  async load(references: readonly WorksheetReference[]): Promise<PrintJob[]> {
    const generation = this.generation;
    const snapshots = await this.loadSnapshots(references.filter(ref => ref.printJobId)
      .map(ref => ref.printJobId!));
    const jobs = await Promise.all(references.map(async reference => {
      // An explicit snapshot always wins, including historical QR links.
      const snapshot = reference.printJobId ? snapshots.get(reference.printJobId)
        : !isWorksheetData(reference.printData) && reference.requestId ? await this.legacy(reference.requestId) : undefined;
      const data = snapshot?.data ?? (reference.printJobId ? undefined : reference.printData);
      if (!isWorksheetData(data)) throw new Error(
        `Không có snapshot phiếu đầy đủ cho ${reference.requestId || reference.printJobId || 'hồ sơ này'}. Không thể mở bản in thiếu dữ liệu.`);
      if (reference.requestId && data['requestId'] && reference.requestId !== data['requestId']) {
        throw new Error('Phiếu không khớp với mã mẻ. Vui lòng tải lại hồ sơ.');
      }
      return toJob(data, reference, snapshot?.id);
    }));
    if (generation !== this.generation) throw new Error('Phiên truy cập đã thay đổi. Vui lòng mở lại phiếu.');
    return jobs;
  }
}
