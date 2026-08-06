import { Injectable } from '@angular/core';
import { catchError, mergeMap, of, timer } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Warms lazy route chunks gradually after the first screen is usable.
 * Slow/save-data devices keep true on-demand loading and use the global
 * navigation feedback instead of competing for bandwidth and memory.
 */
export class AdaptivePreloadingStrategy {
    constructor() {
        this.queueIndex = 0;
        this.commonRoutes = new Set([
            'calculator',
            'smart-batch',
            'prep',
            'inventory',
            'standards',
            'daily-checklist',
            'standard-requests',
            'standard-usage',
            'requests',
            'results',
            'stats',
            'printing',
            'labels',
            'config',
            'traceability'
        ]);
    }
    preload(route, load) {
        if (!this.shouldPreload(route))
            return of(null);
        const index = this.queueIndex++;
        const delay = 1_200 + index * 320;
        return timer(delay).pipe(mergeMap(() => load()), catchError(() => of(null)));
    }
    shouldPreload(route) {
        // Heavy specialist screens and detail views retain true on-demand loading.
        if (!route.path || !this.commonRoutes.has(route.path))
            return false;
        const nav = navigator;
        if (nav.connection?.saveData)
            return false;
        if (nav.connection?.effectiveType === 'slow-2g' || nav.connection?.effectiveType === '2g')
            return false;
        if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4)
            return false;
        if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4)
            return false;
        return true;
    }
    static { this.ɵfac = function AdaptivePreloadingStrategy_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdaptivePreloadingStrategy)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AdaptivePreloadingStrategy, factory: AdaptivePreloadingStrategy.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdaptivePreloadingStrategy, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=adaptive-preloading.strategy.js.map