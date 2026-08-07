import { Injectable, inject } from '@angular/core';
import {
  Transaction,
  WriteBatch,
  deleteField,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { Request } from '../models/request.model';
import { DailyChecklistEntry } from '../models/daily-checklist.model';
import { FirebaseService } from './firebase.service';
import {
  DAILY_CHECKLIST_SCHEMA_VERSION,
  buildDailyChecklistEntry,
  isValidDailyChecklistDate
} from '../utils/daily-checklist-projection';

@Injectable({ providedIn: 'root' })
export class DailyChecklistMaterializerService {
  private readonly fb = inject(FirebaseService);

  setTransactionEntry(transaction: Transaction, request: Request): void {
    const entry = buildDailyChecklistEntry(request);
    if (!entry || !request.analysisDate) return;
    this.setTransactionEntries(transaction, request.analysisDate, [entry]);
  }

  setTransactionEntries(transaction: Transaction, analysisDate: string, entries: DailyChecklistEntry[]): void {
    if (!isValidDailyChecklistDate(analysisDate) || entries.length === 0) return;
    transaction.set(this.dailyDocRef(analysisDate), this.buildSetPayload(analysisDate, entries), { merge: true });
  }

  deleteTransactionEntry(transaction: Transaction, analysisDate: string | undefined, requestId: string): void {
    if (!isValidDailyChecklistDate(analysisDate) || !requestId) return;
    transaction.set(this.dailyDocRef(analysisDate), {
      schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
      analysisDate,
      updatedAt: serverTimestamp(),
      entries: { [requestId]: deleteField() }
    }, { merge: true });
  }

  setBatchEntry(batch: WriteBatch, request: Request): void {
    const entry = buildDailyChecklistEntry(request);
    if (!entry || !request.analysisDate) return;
    this.setBatchEntries(batch, request.analysisDate, [entry]);
  }

  setBatchEntries(batch: WriteBatch, analysisDate: string, entries: DailyChecklistEntry[]): void {
    if (!isValidDailyChecklistDate(analysisDate) || entries.length === 0) return;
    batch.set(this.dailyDocRef(analysisDate), this.buildSetPayload(analysisDate, entries), { merge: true });
  }

  deleteBatchEntry(batch: WriteBatch, analysisDate: string | undefined, requestId: string): void {
    if (!isValidDailyChecklistDate(analysisDate) || !requestId) return;
    batch.set(this.dailyDocRef(analysisDate), {
      schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
      analysisDate,
      updatedAt: serverTimestamp(),
      entries: { [requestId]: deleteField() }
    }, { merge: true });
  }

  private dailyDocRef(analysisDate: string) {
    return doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'daily_checklists', analysisDate);
  }

  private buildSetPayload(analysisDate: string, entries: DailyChecklistEntry[]) {
    return {
      schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
      analysisDate,
      updatedAt: serverTimestamp(),
      entries: Object.fromEntries(entries.map(entry => [entry.requestId, entry]))
    };
  }
}
