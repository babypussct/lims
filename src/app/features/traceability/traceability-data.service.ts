import { Injectable, inject } from '@angular/core';
import {
  collection, doc, getDoc, getDocs, query, where, limit, startAfter,
  type DocumentReference, type DocumentSnapshot, type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ReferenceStandard, StandardRequest, UsageLog } from '../../core/models/standard.model';
import { Log } from '../../core/models/log.model';
import { getActivityActionDefinition, isRegisteredActivityAction } from '../../core/activity/activity-event-registry';

export interface StandardTraceRecord {
  recordType: 'STANDARD_REQUEST' | 'STANDARD_USAGE';
  id: string;
  request: StandardRequest | null;
  usage: UsageLog | null;
  standard: ReferenceStandard | null;
}
export interface StandardHistorySource {
  key: string;
  collection: 'standard_usages' | 'logs';
  filters: [string, string | boolean][];
  cursor?: QueryDocumentSnapshot;
  done?: boolean;
}
export interface StandardHistoryPage {
  usages: UsageLog[];
  events: Log[];
  sources: StandardHistorySource[];
  notes: string[];
}

export function isStandardActivity(log: Log): boolean {
  const record = log as Log & { targetType?: string };
  return ['STANDARD', 'STANDARDS'].includes(log.module || '')
    || record.targetType?.startsWith('STANDARD') === true
    || (isRegisteredActivityAction(log.action) && getActivityActionDefinition(log.action).module === 'STANDARD');
}

export function standardAuditFilters(
  requestId: string, manager: boolean, hasPermission: (permission: string) => boolean,
): [string, string | boolean][][] {
  const base: [string, string | boolean][] = [['requestId', requestId], ['module', 'STANDARD']];
  if (manager) return [base];
  if (hasPermission('report_view')) return [[...base, ['auditClass', 'BUSINESS']]];
  const scopes: [string, string | boolean][][] = [];
  if (['standard_view', 'standard_edit', 'standard_approve', 'standard_log_view'].some(hasPermission)) {
    scopes.push([...base, ['audience', 'STANDARD_VIEW'], ['activityVisible', true]]);
  }
  if (['standard_edit', 'standard_approve'].some(hasPermission)) {
    scopes.push([...base, ['audience', 'STANDARD_OPERATOR'], ['activityVisible', true]]);
  }
  return scopes;
}

@Injectable({ providedIn: 'root' })
export class TraceabilityDataService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);

  async readDocument(ref: DocumentReference): Promise<DocumentSnapshot | null> {
    try { return await getDoc(ref); }
    catch (error: unknown) {
      if (this.permissionDenied(error)) return null;
      throw error;
    }
  }

  private permissionDenied(error: unknown): boolean {
    return /^(firestore\/)?permission-denied$/.test((error as { code?: string })?.code || '');
  }

  private async read<T>(source: string, id: string): Promise<T | null> {
    const snapshot = await this.readDocument(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/${source}/${id}`));
    if (!snapshot?.exists() || snapshot.data()['_isDeleted'] === true) return null;
    return { ...snapshot.data(), id: snapshot.id } as T;
  }

  async findStandardRecord(id: string, usageOnly = false): Promise<StandardTraceRecord | null> {
    const uid = this.auth.currentUser()?.uid;
    const validViewer = () => !!uid && this.auth.currentUser()?.uid === uid && !this.auth.isStandardAuditMode();
    if (!validViewer()) return null;
    const request = usageOnly ? null : await this.read<StandardRequest>('standard_requests', id);
    if (!validViewer()) return null;
    const usage = request ? null : await this.read<UsageLog>('standard_usages', id);
    if (!validViewer() || (!request && !usage)) return null;
    let parent = request;
    if (!parent && usage?.requestId) {
      try { parent = await this.read<StandardRequest>('standard_requests', usage.requestId); }
      catch { /* The authorized usage remains useful without its optional parent. */ }
    }
    if (!validViewer()) return null;
    let standard: ReferenceStandard | null = null;
    const standardId = parent?.standardId || usage?.standardId;
    // Optional current stock information must not prevent displaying an authorized record.
    if (standardId) {
      try { standard = await this.read<ReferenceStandard>('reference_standards', standardId); }
      catch { /* The summary explicitly marks current stock information as unavailable. */ }
    }
    if (!validViewer()) return null;
    return { recordType: usage ? 'STANDARD_USAGE' : 'STANDARD_REQUEST', id, request: parent, usage, standard };
  }

  historySources(requestId: string): StandardHistorySource[] {
    if (!this.auth.currentUser() || this.auth.isStandardAuditMode()) return [];
    const allowed = (permission: string) => this.auth.hasPermission(permission);
    const sources: StandardHistorySource[] = [];
    if (['standard_edit', 'standard_approve', 'standard_log_view', 'standard_log_delete'].some(allowed)) {
      sources.push({ key: 'usage', collection: 'standard_usages', filters: [['requestId', requestId]] });
    }
    standardAuditFilters(requestId, this.auth.isManager(), allowed).forEach((filters, index) => {
      sources.push({ key: `audit:${index}`, collection: 'logs', filters });
    });
    return sources;
  }

  async loadHistory(sources: StandardHistorySource[]): Promise<StandardHistoryPage> {
    const uid = this.auth.currentUser()?.uid;
    if (!uid || this.auth.isStandardAuditMode()) return { usages: [], events: [], sources: [], notes: [] };
    const page: StandardHistoryPage = { usages: [], events: [], sources: [], notes: [] };
    for (const source of sources) {
      if (source.done) { page.sources.push(source); continue; }
      if (this.auth.currentUser()?.uid !== uid || this.auth.isStandardAuditMode()) break;
      try {
        // Equality filters use the existing single-field indexes. Pagination is
        // by document ID; chronological ordering happens after merging sources.
        const constraints = source.filters.map(([field, value]) => where(field, '==', value));
        const ref = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/${source.collection}`);
        const snapshot = await getDocs(query(ref, ...constraints, ...(source.cursor ? [startAfter(source.cursor)] : []), limit(100)));
        if (this.auth.currentUser()?.uid !== uid || this.auth.isStandardAuditMode()) break;
        page.sources.push({ ...source, cursor: snapshot.docs.at(-1), done: snapshot.size < 100 });
        for (const entry of snapshot.docs) {
          if (source.collection === 'standard_usages') page.usages.push({ ...entry.data(), id: entry.id } as UsageLog);
          else if (entry.data()['_isDeleted'] !== true) page.events.push({ ...entry.data(), id: entry.id } as Log);
        }
      } catch (error) {
        const denied = this.permissionDenied(error);
        page.sources.push({ ...source, done: denied });
        page.notes.push(denied
          ? 'Một phần lịch sử không được cấp quyền xem. Dữ liệu trong phiếu vẫn được hiển thị.'
          : 'Chưa tải được một phần lịch sử. Bạn có thể tải lại.');
      }
    }
    return page;
  }
}
