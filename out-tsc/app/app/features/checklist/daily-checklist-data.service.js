import { Injectable, inject } from '@angular/core';
import { collection, doc, documentId, getDoc, getDocFromServer, getDocs, getDocsFromServer, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { FirebaseService } from '../../core/services/firebase.service';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
import { DailyChecklistMaterializerService } from '../../core/services/daily-checklist-materializer.service';
import { dailyChecklistDocumentToRequests, isDailyChecklistRequest, isValidDailyChecklistDate } from '../../core/utils/daily-checklist-projection';
import { DailyChecklistResultCache, shouldFallbackToLegacyRequests } from './daily-checklist-data-cache';
import * as i0 from "@angular/core";
/**
 * Reads the materialized daily document first and falls back to `requests`
 * whenever that document is absent. An existing-but-empty document is an
 * authoritative empty day.
 */
export class DailyChecklistDataService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.readMonitor = inject(FirestoreReadMonitor);
        this.dailyChecklistMaterializer = inject(DailyChecklistMaterializerService);
        this.requestCacheTtlMs = 5 * 60 * 1000;
        this.requestCache = new DailyChecklistResultCache(this.requestCacheTtlMs);
        this.requestLoads = new Map();
        this.legacyPageSize = 100;
        this.documentSizeWarningBytes = 800 * 1024;
        this.invalidationSubscription = this.dailyChecklistMaterializer.invalidatedDates$.subscribe(analysisDate => this.invalidateDate(analysisDate));
    }
    async loadRequestsForDate(analysisDate, onPage, forceRefresh = false) {
        if (!isValidDailyChecklistDate(analysisDate)) {
            return { requests: [], source: 'server', materialized: true };
        }
        const cached = this.requestCache.get(analysisDate);
        if (!forceRefresh && cached) {
            onPage?.(cached.requests.length);
            return this.cloneDateResult(cached);
        }
        const inFlight = this.requestLoads.get(analysisDate);
        if (!forceRefresh && inFlight) {
            const result = await inFlight;
            onPage?.(result.requests.length);
            return this.cloneDateResult(result);
        }
        if (forceRefresh)
            this.invalidateDate(analysisDate);
        const cacheGeneration = this.requestCache.generation(analysisDate);
        const load = this.fetchRequestsForDate(analysisDate, onPage);
        this.requestLoads.set(analysisDate, load);
        try {
            const result = await load;
            this.requestCache.setIfCurrent(analysisDate, result, cacheGeneration);
            return this.cloneDateResult(result);
        }
        finally {
            if (this.requestLoads.get(analysisDate) === load)
                this.requestLoads.delete(analysisDate);
        }
    }
    async fetchRequestsForDate(analysisDate, onPage) {
        const dailyPath = `artifacts/${this.fb.APP_ID}/daily_checklists/${analysisDate}`;
        const dailyRef = doc(this.fb.db, dailyPath);
        const dailySnapshot = await this.getDailyDocumentPreferServer(dailyRef, dailyPath);
        if (dailySnapshot.snapshot.exists()) {
            const data = dailySnapshot.snapshot.data();
            this.warnIfLargeDocument(dailyPath, data);
            const requests = dailyChecklistDocumentToRequests(data, analysisDate);
            onPage?.(requests.length);
            return { requests, source: dailySnapshot.source, materialized: true };
        }
        return shouldFallbackToLegacyRequests(analysisDate, false)
            ? this.fetchLegacyRequestsForDate(analysisDate, onPage)
            : { requests: [], source: dailySnapshot.source, materialized: true };
    }
    invalidateDate(analysisDate) {
        if (!isValidDailyChecklistDate(analysisDate))
            return;
        this.requestCache.invalidate(analysisDate);
        this.requestLoads.delete(analysisDate);
    }
    async fetchLegacyRequestsForDate(analysisDate, onPage) {
        const requestsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
        const metricPath = `artifacts/${this.fb.APP_ID}/requests?analysisDate=${analysisDate}&legacyFallback=1`;
        const requests = new Map();
        let cursor = null;
        let source = 'server';
        do {
            const pageQuery = cursor
                ? query(requestsRef, where('analysisDate', '==', analysisDate), orderBy(documentId()), startAfter(cursor), limit(this.legacyPageSize))
                : query(requestsRef, where('analysisDate', '==', analysisDate), orderBy(documentId()), limit(this.legacyPageSize));
            const page = await this.getLegacyPagePreferServer(pageQuery, metricPath);
            if (page.source === 'cache')
                source = 'cache';
            page.snapshot.docs.forEach(item => {
                const request = { id: item.id, ...item.data() };
                if (isDailyChecklistRequest(request))
                    requests.set(request.id, request);
            });
            onPage?.(requests.size);
            cursor = page.snapshot.docs.length === this.legacyPageSize
                ? page.snapshot.docs[page.snapshot.docs.length - 1]
                : null;
        } while (cursor);
        return { requests: Array.from(requests.values()), source, materialized: false };
    }
    async getDailyDocumentPreferServer(documentRef, metricPath) {
        try {
            const snapshot = await getDocFromServer(documentRef);
            this.readMonitor.record('getDoc', metricPath, 1);
            return { snapshot, source: 'server' };
        }
        catch {
            const snapshot = await getDoc(documentRef);
            const fromCache = snapshot.metadata.fromCache;
            this.readMonitor.record('getDoc', metricPath, 1, { fromCache });
            return { snapshot, source: fromCache ? 'cache' : 'server' };
        }
    }
    async getLegacyPagePreferServer(queryRef, metricPath) {
        try {
            const snapshot = await getDocsFromServer(queryRef);
            this.readMonitor.record('getDocs', metricPath, snapshot.size, { phase: 'page' });
            return { snapshot, source: 'server' };
        }
        catch {
            const snapshot = await getDocs(queryRef);
            const fromCache = snapshot.metadata.fromCache;
            this.readMonitor.record('getDocs', metricPath, snapshot.size, { phase: 'page', fromCache });
            return { snapshot, source: fromCache ? 'cache' : 'server' };
        }
    }
    warnIfLargeDocument(path, data) {
        try {
            const bytes = new TextEncoder().encode(JSON.stringify(data)).byteLength;
            if (bytes >= this.documentSizeWarningBytes) {
                console.warn(`[DailyChecklist] Document ${path} is approximately ${Math.round(bytes / 1024)} KiB; consider sharding.`);
            }
        }
        catch {
            // Diagnostics must never block the daily board.
        }
    }
    cloneDateResult(result) {
        return { ...result, requests: [...result.requests] };
    }
    static { this.ɵfac = function DailyChecklistDataService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DailyChecklistDataService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DailyChecklistDataService, factory: DailyChecklistDataService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DailyChecklistDataService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=daily-checklist-data.service.js.map