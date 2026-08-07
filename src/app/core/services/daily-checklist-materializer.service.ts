import { Injectable, inject } from '@angular/core';
import {
  deleteField,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { Subject } from 'rxjs';
import { Request } from '../models/request.model';
import { DailyChecklistEntry } from '../models/daily-checklist.model';
import { FirebaseService } from './firebase.service';
import { sanitizeForFirebase } from '../../shared/utils/utils';
import {
  DAILY_CHECKLIST_SCHEMA_VERSION,
  buildDailyChecklistEntry,
  isValidDailyChecklistDate
} from '../utils/daily-checklist-projection';
import {
  buildDailyChecklistSetPayload,
  groupDailyChecklistEntriesByDate,
  runDailyChecklistProjectionBestEffort
} from '../utils/daily-checklist-materialization';

@Injectable({ providedIn: 'root' })
export class DailyChecklistMaterializerService {
  private readonly fb = inject(FirebaseService);
  private readonly invalidatedDateSubject = new Subject<string>();
  readonly invalidatedDates$ = this.invalidatedDateSubject.asObservable();

  async materializeRequest(request: Request): Promise<void> {
    const entry = buildDailyChecklistEntry(request);
    if (!entry || !request.analysisDate) return;
    await this.materializeEntries(request.analysisDate, [entry]);
  }

  async materializeRequests(requests: Request[]): Promise<void> {
    const entriesByDate = groupDailyChecklistEntriesByDate(requests);
    await Promise.all(
      Array.from(entriesByDate.entries()).map(([analysisDate, entries]) =>
        this.materializeEntries(analysisDate, entries)
      )
    );
  }

  async materializeEntries(analysisDate: string, entries: DailyChecklistEntry[]): Promise<void> {
    if (!isValidDailyChecklistDate(analysisDate) || entries.length === 0) return;
    await setDoc(
      this.dailyDocRef(analysisDate),
      this.buildSetPayload(analysisDate, entries),
      { merge: true }
    );
    this.invalidatedDateSubject.next(analysisDate);
  }

  async deleteEntry(analysisDate: string | undefined, requestId: string): Promise<void> {
    if (!isValidDailyChecklistDate(analysisDate) || !requestId) return;
    await setDoc(this.dailyDocRef(analysisDate), sanitizeForFirebase({
      schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
      analysisDate,
      updatedAt: serverTimestamp(),
      entries: { [requestId]: deleteField() }
    }), { merge: true });
    this.invalidatedDateSubject.next(analysisDate);
  }

  materializeRequestBestEffort(request: Request, context: string): Promise<boolean> {
    return runDailyChecklistProjectionBestEffort(() => this.materializeRequest(request), context);
  }

  materializeRequestsBestEffort(requests: Request[], context: string): Promise<boolean> {
    return runDailyChecklistProjectionBestEffort(() => this.materializeRequests(requests), context);
  }

  materializeEntryGroupsBestEffort(
    entriesByDate: Map<string, DailyChecklistEntry[]>,
    context: string
  ): Promise<boolean> {
    return runDailyChecklistProjectionBestEffort(async () => {
      await Promise.all(
        Array.from(entriesByDate.entries()).map(([analysisDate, entries]) =>
          this.materializeEntries(analysisDate, entries)
        )
      );
    }, context);
  }

  deleteEntryBestEffort(
    analysisDate: string | undefined,
    requestId: string,
    context: string
  ): Promise<boolean> {
    return runDailyChecklistProjectionBestEffort(() => this.deleteEntry(analysisDate, requestId), context);
  }

  syncRequestBestEffort(
    request: Request,
    previousAnalysisDate: string | undefined,
    context: string
  ): Promise<boolean> {
    return runDailyChecklistProjectionBestEffort(async () => {
      const operations: Promise<void>[] = [];
      if (previousAnalysisDate && previousAnalysisDate !== request.analysisDate) {
        operations.push(this.deleteEntry(previousAnalysisDate, request.id));
      }
      operations.push(this.materializeRequest(request));
      await Promise.all(operations);
    }, context);
  }

  private dailyDocRef(analysisDate: string) {
    return doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'daily_checklists', analysisDate);
  }

  private buildSetPayload(analysisDate: string, entries: DailyChecklistEntry[]) {
    return buildDailyChecklistSetPayload(analysisDate, entries, serverTimestamp());
  }
}
