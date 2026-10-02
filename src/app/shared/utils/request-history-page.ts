import type { Request } from '../../core/models/request.model';
import { timestampToLocalDateKey } from './timestamp';

export type RequestDateField = 'analysisDate' | 'approvedAt' | 'timestamp';
export interface RequestHistoryPage {
  items: Request[];
  complete: boolean;
  reads: number;
}
export interface RequestHistoryChunk {
  items: Request[];
  cursor?: unknown;
  complete: boolean;
}

export function requestDateKey(request: Request): string {
  return request.analysisDate || timestampToLocalDateKey(request.approvedAt ?? request.timestamp) || '';
}

function primaryField(request: Request): RequestDateField {
  return request.analysisDate ? 'analysisDate' : request.approvedAt ? 'approvedAt' : 'timestamp';
}

/** A user-requested load reads at most one bounded chunk from each legacy date shape. */
export class RequestHistoryPager {
  private readonly rows = new Map<string, Request>();
  private readonly sources = (['analysisDate', 'approvedAt', 'timestamp'] as RequestDateField[])
    .map(field => ({ field, cursor: undefined as unknown, complete: false }));
  private pending?: Promise<RequestHistoryPage>;

  constructor(private readonly start: string, private readonly end: string,
    private readonly reader: (field: RequestDateField, cursor: unknown, size: number) => Promise<RequestHistoryChunk>,
    private readonly pageSize = 24) {}

  load(): Promise<RequestHistoryPage> {
    if (this.pending) return this.pending;
    let reads = 0;
    const work = Promise.all(this.sources.filter(source => !source.complete).map(async source => {
      const chunk = await this.reader(source.field, source.cursor, this.pageSize);
      reads += chunk.items.length;
      source.cursor = chunk.cursor;
      source.complete = chunk.complete;
      for (const request of chunk.items) {
        const date = requestDateKey(request);
        if (primaryField(request) === source.field && !request._isDeleted
          && ['approved', 'draft', 'completed'].includes(request.status) && date >= this.start && date <= this.end) {
          this.rows.set(request.id, request);
        }
      }
    })).then(() => this.snapshot(reads));
    this.pending = work.finally(() => { this.pending = undefined; });
    return this.pending;
  }

  snapshot(reads = 0): RequestHistoryPage {
    return { items: [...this.rows.values()].sort((a, b) => requestDateKey(b).localeCompare(requestDateKey(a)) || b.id.localeCompare(a.id)),
      complete: this.sources.every(source => source.complete), reads };
  }
}
