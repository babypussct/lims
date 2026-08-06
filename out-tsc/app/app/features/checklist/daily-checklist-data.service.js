import { Injectable, inject } from '@angular/core';
import { collection, documentId, getDocs, getDocsFromServer, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { FirebaseService } from '../../core/services/firebase.service';
import { isTrackablePhysicalBatch, isValidDateInput } from './daily-checklist.utils';
import * as i0 from "@angular/core";
/**
 * Date-scoped source of truth for the daily sample tracker.
 *
 * Queries are paginated by document ID so a busy analysis day is never cut off
 * by the global 100-request dashboard cache. Pages are loaded automatically for
 * the selected date; date options are loaded progressively as the user moves
 * backwards through history.
 */
export class DailyChecklistDataService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.requestsPageSize = 100;
        this.dateScanPageSize = 200;
    }
    async loadRequestsForDate(analysisDate, onPage) {
        if (!isValidDateInput(analysisDate))
            return { requests: [], source: 'server' };
        const requestsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
        const requests = new Map();
        let cursor = null;
        let source = 'server';
        do {
            const pageQuery = cursor
                ? query(requestsRef, where('analysisDate', '==', analysisDate), orderBy(documentId()), startAfter(cursor), limit(this.requestsPageSize))
                : query(requestsRef, where('analysisDate', '==', analysisDate), orderBy(documentId()), limit(this.requestsPageSize));
            const page = await this.getPreferServer(pageQuery);
            if (page.source === 'cache')
                source = 'cache';
            page.snapshot.docs.forEach(item => {
                const request = { id: item.id, ...item.data() };
                if (isTrackablePhysicalBatch(request))
                    requests.set(request.id, request);
            });
            onPage?.(requests.size);
            cursor = page.snapshot.docs.length === this.requestsPageSize
                ? page.snapshot.docs[page.snapshot.docs.length - 1]
                : null;
        } while (cursor);
        return { requests: Array.from(requests.values()), source };
    }
    async loadDateOptionsPage(cursor = null) {
        const requestsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
        const pageQuery = cursor
            ? query(requestsRef, orderBy('analysisDate', 'desc'), startAfter(cursor), limit(this.dateScanPageSize))
            : query(requestsRef, orderBy('analysisDate', 'desc'), limit(this.dateScanPageSize));
        const page = await this.getPreferServer(pageQuery);
        const dates = Array.from(new Set(page.snapshot.docs
            .map(item => ({ id: item.id, ...item.data() }))
            .filter(isTrackablePhysicalBatch)
            .map(request => request.analysisDate || '')
            .filter(isValidDateInput))).sort((a, b) => b.localeCompare(a));
        return {
            dates,
            cursor: page.snapshot.docs.length > 0 ? page.snapshot.docs[page.snapshot.docs.length - 1] : null,
            hasMore: page.snapshot.docs.length === this.dateScanPageSize,
            source: page.source
        };
    }
    async getPreferServer(queryRef) {
        try {
            return { snapshot: await getDocsFromServer(queryRef), source: 'server' };
        }
        catch {
            return { snapshot: await getDocs(queryRef), source: 'cache' };
        }
    }
    static { this.ɵfac = function DailyChecklistDataService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DailyChecklistDataService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DailyChecklistDataService, factory: DailyChecklistDataService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DailyChecklistDataService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=daily-checklist-data.service.js.map