import { Injectable, inject } from '@angular/core';
import { deleteField, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Subject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { sanitizeForFirebase } from '../../shared/utils/utils';
import { DAILY_CHECKLIST_SCHEMA_VERSION, buildDailyChecklistEntry, isValidDailyChecklistDate } from '../utils/daily-checklist-projection';
import { buildDailyChecklistSetPayload, groupDailyChecklistEntriesByDate, runDailyChecklistProjectionBestEffort } from '../utils/daily-checklist-materialization';
import * as i0 from "@angular/core";
export class DailyChecklistMaterializerService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.invalidatedDateSubject = new Subject();
        this.invalidatedDates$ = this.invalidatedDateSubject.asObservable();
    }
    async materializeRequest(request) {
        const entry = buildDailyChecklistEntry(request);
        if (!entry || !request.analysisDate)
            return;
        await this.materializeEntries(request.analysisDate, [entry]);
    }
    async materializeRequests(requests) {
        const entriesByDate = groupDailyChecklistEntriesByDate(requests);
        await Promise.all(Array.from(entriesByDate.entries()).map(([analysisDate, entries]) => this.materializeEntries(analysisDate, entries)));
    }
    async materializeEntries(analysisDate, entries) {
        if (!isValidDailyChecklistDate(analysisDate) || entries.length === 0)
            return;
        await setDoc(this.dailyDocRef(analysisDate), this.buildSetPayload(analysisDate, entries), { merge: true });
        this.invalidatedDateSubject.next(analysisDate);
    }
    async deleteEntry(analysisDate, requestId) {
        if (!isValidDailyChecklistDate(analysisDate) || !requestId)
            return;
        await setDoc(this.dailyDocRef(analysisDate), sanitizeForFirebase({
            schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
            analysisDate,
            updatedAt: serverTimestamp(),
            entries: { [requestId]: deleteField() }
        }), { merge: true });
        this.invalidatedDateSubject.next(analysisDate);
    }
    materializeRequestBestEffort(request, context) {
        return runDailyChecklistProjectionBestEffort(() => this.materializeRequest(request), context);
    }
    materializeRequestsBestEffort(requests, context) {
        return runDailyChecklistProjectionBestEffort(() => this.materializeRequests(requests), context);
    }
    materializeEntryGroupsBestEffort(entriesByDate, context) {
        return runDailyChecklistProjectionBestEffort(async () => {
            await Promise.all(Array.from(entriesByDate.entries()).map(([analysisDate, entries]) => this.materializeEntries(analysisDate, entries)));
        }, context);
    }
    deleteEntryBestEffort(analysisDate, requestId, context) {
        return runDailyChecklistProjectionBestEffort(() => this.deleteEntry(analysisDate, requestId), context);
    }
    syncRequestBestEffort(request, previousAnalysisDate, context) {
        return runDailyChecklistProjectionBestEffort(async () => {
            const operations = [];
            if (previousAnalysisDate && previousAnalysisDate !== request.analysisDate) {
                operations.push(this.deleteEntry(previousAnalysisDate, request.id));
            }
            operations.push(this.materializeRequest(request));
            await Promise.all(operations);
        }, context);
    }
    dailyDocRef(analysisDate) {
        return doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'daily_checklists', analysisDate);
    }
    buildSetPayload(analysisDate, entries) {
        return buildDailyChecklistSetPayload(analysisDate, entries, serverTimestamp());
    }
    static { this.ɵfac = function DailyChecklistMaterializerService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DailyChecklistMaterializerService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DailyChecklistMaterializerService, factory: DailyChecklistMaterializerService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DailyChecklistMaterializerService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=daily-checklist-materializer.service.js.map