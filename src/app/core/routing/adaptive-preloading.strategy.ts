import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, catchError, mergeMap, of, timer } from 'rxjs';

/**
 * Warms lazy route chunks gradually after the first screen is usable.
 * Slow/save-data devices keep true on-demand loading and use the global
 * navigation feedback instead of competing for bandwidth and memory.
 */
@Injectable({ providedIn: 'root' })
export class AdaptivePreloadingStrategy implements PreloadingStrategy {
  private queueIndex = 0;
  private readonly commonRoutes = new Set([
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
    'settings',
    'traceability'
  ]);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (!this.shouldPreload(route)) return of(null);

    const index = this.queueIndex++;
    const delay = 1_200 + index * 320;

    return timer(delay).pipe(
      mergeMap(() => load()),
      catchError(() => of(null))
    );
  }

  private shouldPreload(route: Route): boolean {
    // Heavy specialist screens and detail views retain true on-demand loading.
    if (!route.path || !this.commonRoutes.has(route.path)) return false;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { effectiveType?: string; saveData?: boolean };
    };

    if (nav.connection?.saveData) return false;
    if (nav.connection?.effectiveType === 'slow-2g' || nav.connection?.effectiveType === '2g') return false;
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return false;
    if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) return false;

    return true;
  }
}
