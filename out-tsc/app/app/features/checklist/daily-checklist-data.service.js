import { Injectable, inject } from '@angular/core';
import { collection, documentId, getDocs, getDocsFromServer, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { FirebaseService } from '../../core/services/firebase.service';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
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
        this.readMonitor = inject(FirestoreReadMonitor);
        this.requestsPageSize = 100;
        this.dateScanPageSize = 50;
        this.requestCacheTtlMs = 5 * 60 * 1000;
        this.dateOptionsCacheTtlMs = 10 * 60 * 1000;
        this.requestCache = new Map();
        this.requestLoads = new Map();
        this.dateOptionsCache = new Map();
    }
    async loadRequestsForDate(analysisDate, onPage, forceRefresh = false) {
        if (!isValidDateInput(analysisDate))
            return { requests: [], source: 'server' };
        const cached = this.requestCache.get(analysisDate);
        if (!forceRefresh && cached && Date.now() - cached.cachedAt < this.requestCacheTtlMs) {
            onPage?.(cached.result.requests.length);
            return this.cloneDateResult(cached.result);
        }
        const inFlight = this.requestLoads.get(analysisDate);
        if (!forceRefresh && inFlight) {
            const result = await inFlight;
            onPage?.(result.requests.length);
            return this.cloneDateResult(result);
        }
        if (forceRefresh)
            this.requestCache.delete(analysisDate);
        const load = this.fetchRequestsForDate(analysisDate, onPage);
        this.requestLoads.set(analysisDate, load);
        try {
            const result = await load;
            this.requestCache.set(analysisDate, { result, cachedAt: Date.now() });
            return this.cloneDateResult(result);
        }
        finally {
            if (this.requestLoads.get(analysisDate) === load)
                this.requestLoads.delete(analysisDate);
        }
    }
    async fetchRequestsForDate(analysisDate, onPage) {
        const requestsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
        const metricPath = `artifacts/${this.fb.APP_ID}/requests?analysisDate=${analysisDate}`;
        const requests = new Map();
        let cursor = null;
        let source = 'server';
        do {
            const pageQuery = cursor
                ? query(requestsRef, where('analysisDate', '==', analysisDate), orderBy(documentId()), startAfter(cursor), limit(this.requestsPageSize))
                : query(requestsRef, where('analysisDate', '==', analysisDate), orderBy(documentId()), limit(this.requestsPageSize));
            const page = await this.getPreferServer(pageQuery, metricPath, 'page');
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
    async loadDateOptionsPage(cursor = null, forceRefresh = false) {
        const cacheKey = cursor
            ? `${cursor.id}|${String(cursor.get('analysisDate') || '')}`
            : '__first__';
        const cached = this.dateOptionsCache.get(cacheKey);
        if (!forceRefresh && cached && Date.now() - cached.cachedAt < this.dateOptionsCacheTtlMs) {
            return { ...cached.page, dates: [...cached.page.dates] };
        }
        if (forceRefresh)
            this.dateOptionsCache.delete(cacheKey);
        const requestsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
        const pageQuery = cursor
            ? query(requestsRef, orderBy('analysisDate', 'desc'), startAfter(cursor), limit(this.dateScanPageSize))
            : query(requestsRef, orderBy('analysisDate', 'desc'), limit(this.dateScanPageSize));
        const page = await this.getPreferServer(pageQuery, `artifacts/${this.fb.APP_ID}/requests?orderBy=analysisDate:desc`, 'page');
        const dates = Array.from(new Set(page.snapshot.docs
            .map(item => ({ id: item.id, ...item.data() }))
            .filter(isTrackablePhysicalBatch)
            .map(request => request.analysisDate || '')
            .filter(isValidDateInput))).sort((a, b) => b.localeCompare(a));
        const result = {
            dates,
            cursor: page.snapshot.docs.length > 0 ? page.snapshot.docs[page.snapshot.docs.length - 1] : null,
            hasMore: page.snapshot.docs.length === this.dateScanPageSize,
            source: page.source
        };
        this.dateOptionsCache.set(cacheKey, { page: result, cachedAt: Date.now() });
        return { ...result, dates: [...result.dates] };
    }
    async getPreferServer(queryRef, metricPath, phase) {
        try {
            const snapshot = await getDocsFromServer(queryRef);
            this.readMonitor.record('getDocs', metricPath, snapshot.size, { phase });
            return { snapshot, source: 'server' };
        }
        catch {
            const snapshot = await getDocs(queryRef);
            const fromCache = snapshot.metadata.fromCache;
            this.readMonitor.record('getDocs', metricPath, snapshot.size, { phase, fromCache });
            return { snapshot, source: fromCache ? 'cache' : 'server' };
        }
    }
    cloneDateResult(result) {
        return { requests: [...result.requests], source: result.source };
    }
    static { this.ɵfac = function DailyChecklistDataService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DailyChecklistDataService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DailyChecklistDataService, factory: DailyChecklistDataService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DailyChecklistDataService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=daily-checklist-data.service.js.map