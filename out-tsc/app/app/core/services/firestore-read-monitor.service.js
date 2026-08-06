import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
const STORAGE_KEY = '__lims_firestore_read_metrics_v1';
const MAX_METRICS = 200;
/**
 * Lightweight, client-only Firestore read telemetry.
 *
 * It never writes to Firestore. Metrics are kept in memory and mirrored to
 * sessionStorage so a production session can be inspected without adding
 * another billed read/write path. Counts are approximate for realtime
 * listeners because billing depends on the SDK/server change set.
 */
export class FirestoreReadMonitor {
    constructor() {
        this.metrics = new Map();
        this.debugEnabled = this.readDebugFlag();
        this.exposeDebugHandle();
    }
    record(operation, path, documents = 0, options = {}) {
        if (!path)
            return;
        const phase = options.phase || 'single';
        const key = `${operation}|${phase}|${path}`;
        const count = Math.max(0, Math.floor(Number(documents) || 0));
        const existing = this.metrics.get(key);
        const metric = existing || {
            operation,
            phase,
            path,
            calls: 0,
            documents: 0,
            networkDocuments: 0,
            cacheDocuments: 0,
            lastAt: 0
        };
        metric.calls += 1;
        metric.documents += count;
        if (options.fromCache)
            metric.cacheDocuments += count;
        else
            metric.networkDocuments += count;
        metric.lastAt = Date.now();
        this.metrics.set(key, metric);
        if (this.debugEnabled) {
            console.debug('[FirestoreRead]', {
                operation,
                phase,
                path,
                documents: count,
                fromCache: Boolean(options.fromCache)
            });
        }
        this.schedulePersist();
    }
    snapshot() {
        return [...this.metrics.values()]
            .map(metric => ({ ...metric }))
            .sort((a, b) => b.networkDocuments - a.networkDocuments || b.lastAt - a.lastAt);
    }
    reset() {
        this.metrics.clear();
        this.persistNow();
    }
    enableDebug() {
        this.debugEnabled = true;
        try {
            localStorage.setItem('lims_read_diagnostics', '1');
        }
        catch {
            // Diagnostics are optional.
        }
    }
    disableDebug() {
        this.debugEnabled = false;
        try {
            localStorage.removeItem('lims_read_diagnostics');
        }
        catch {
            // Diagnostics are optional.
        }
    }
    readDebugFlag() {
        try {
            return localStorage.getItem('lims_read_diagnostics') === '1'
                || new URLSearchParams(window.location.search).has('readDiagnostics');
        }
        catch {
            return false;
        }
    }
    schedulePersist() {
        if (this.persistTimer)
            return;
        this.persistTimer = setTimeout(() => {
            this.persistTimer = undefined;
            this.persistNow();
        }, 1000);
    }
    persistNow() {
        try {
            const metrics = this.snapshot().slice(0, MAX_METRICS);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                updatedAt: Date.now(),
                metrics
            }));
        }
        catch {
            // Diagnostics must never affect the application.
        }
    }
    exposeDebugHandle() {
        if (typeof window === 'undefined')
            return;
        const debugWindow = window;
        debugWindow.__limsFirestoreReads = {
            snapshot: () => this.snapshot(),
            reset: () => this.reset(),
            enable: () => this.enableDebug(),
            disable: () => this.disableDebug()
        };
    }
    static { this.ɵfac = function FirestoreReadMonitor_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FirestoreReadMonitor)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: FirestoreReadMonitor, factory: FirestoreReadMonitor.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FirestoreReadMonitor, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
//# sourceMappingURL=firestore-read-monitor.service.js.map