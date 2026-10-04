import { Injectable, effect, inject } from '@angular/core';
import { collection, getDocs, limit, orderBy, query, startAfter, where, QueryDocumentSnapshot, QueryConstraint } from 'firebase/firestore';
import { Request } from '../models/request.model';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';
import { RequestDateBasis, RequestDateField, RequestHistoryPage, RequestHistoryPager } from '../../shared/utils/request-history-page';

export function buildRequestHistoryConstraints(field: RequestDateField, start: string, end: string, size: number): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];
  // An open boundary has no date condition. Local midnight in year 0001 can
  // fall outside Firestore's timestamp range in a positive UTC offset.
  if (start !== '0001-01-01') constraints.push(where(field, '>=', field === 'analysisDate' ? start : new Date(`${start}T00:00:00`)));
  if (end !== '9999-12-31') constraints.push(where(field, '<=', field === 'analysisDate' ? end : new Date(`${end}T23:59:59.999`)));
  constraints.push(orderBy(field, 'desc'), limit(size));
  return constraints;
}

@Injectable({ providedIn: 'root' })
export class RequestHistoryPageService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly monitor = inject(FirestoreReadMonitor);
  private scope = '';
  private readonly ranges = new Map<string, { at: number; loaded: boolean; pager: RequestHistoryPager }>();

  constructor() {
    effect(() => { const scope = this.currentScope(); if (scope !== this.scope) { this.ranges.clear(); this.scope = scope; } });
  }

  private currentScope(): string { return `${this.fb.APP_ID}|${this.auth.currentUser()?.uid || ''}|${this.auth.getDeltaCacheScope()}|${this.auth.isStandardAuditMode()}`; }

  async load(start: string, end: string, more = false, refresh = false, basis: RequestDateBasis = 'analysisDate'): Promise<RequestHistoryPage> {
    start ||= '0001-01-01';
    end ||= '9999-12-31';
    if (!this.auth.currentUser() || this.auth.isStandardAuditMode()
      || ![start, end].every(value => /^\d{4}-\d{2}-\d{2}$/.test(value)) || start > end) {
      return { items: [], complete: true, reads: 0 };
    }
    const scope = this.currentScope();
    if (scope !== this.scope) { this.ranges.clear(); this.scope = scope; }
    const key = `${basis}:${start}:${end}`;
    let entry = this.ranges.get(key);
    if (!entry || refresh || Date.now() - entry.at > 5 * 60_000) {
      entry = { at: Date.now(), loaded: false, pager: new RequestHistoryPager(start, end, (field, cursor, size) => this.read(field, start, end, cursor, size), 24, basis) };
      this.ranges.delete(key); this.ranges.set(key, entry);
      while (this.ranges.size > 8) this.ranges.delete(this.ranges.keys().next().value!);
    } else if (!more) {
      const snapshot = entry.pager.snapshot();
      if (entry.loaded || snapshot.complete) return snapshot;
    }
    const page = await entry.pager.load();
    entry.loaded = true;
    if (scope !== this.currentScope()) throw new Error('Phiên truy cập đã thay đổi.');
    return page;
  }

  private async read(field: RequestDateField, start: string, end: string, cursor: unknown, size: number) {
    const path = `artifacts/${this.fb.APP_ID}/requests`;
    const constraints = buildRequestHistoryConstraints(field, start, end, size);
    if (cursor) constraints.push(startAfter(cursor as QueryDocumentSnapshot));
    const snapshot = await getDocs(query(collection(this.fb.db, path), ...constraints));
    this.monitor.record('getDocs', path, snapshot.size, { phase: 'page', fromCache: snapshot.metadata.fromCache });
    return { items: snapshot.docs.map(entry => ({ ...entry.data(), id: entry.id } as Request)),
      cursor: snapshot.docs.at(-1), complete: snapshot.size < size };
  }
}
