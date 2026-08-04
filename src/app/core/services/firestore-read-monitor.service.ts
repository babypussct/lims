import { Injectable } from '@angular/core';

export type FirestoreReadOperation = 'getDoc' | 'getDocs' | 'onSnapshot' | 'aggregate';
export type FirestoreReadPhase = 'single' | 'initial' | 'delta' | 'cache' | 'page' | 'earliest';

export interface FirestoreReadMetric {
  operation: FirestoreReadOperation;
  phase: FirestoreReadPhase;
  path: string;
  calls: number;
  documents: number;
  networkDocuments: number;
  cacheDocuments: number;
  lastAt: number;
}

interface FirestoreReadOptions {
  phase?: FirestoreReadPhase;
  fromCache?: boolean;
}

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
@Injectable({ providedIn: 'root' })
export class FirestoreReadMonitor {
  private readonly metrics = new Map<string, FirestoreReadMetric>();
  private persistTimer?: ReturnType<typeof setTimeout>;
  private debugEnabled = this.readDebugFlag();

  constructor() {
    this.exposeDebugHandle();
  }

  record(
    operation: FirestoreReadOperation,
    path: string,
    documents = 0,
    options: FirestoreReadOptions = {}
  ): void {
    if (!path) return;

    const phase = options.phase || 'single';
    const key = `${operation}|${phase}|${path}`;
    const count = Math.max(0, Math.floor(Number(documents) || 0));
    const existing = this.metrics.get(key);
    const metric: FirestoreReadMetric = existing || {
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
    if (options.fromCache) metric.cacheDocuments += count;
    else metric.networkDocuments += count;
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

  snapshot(): FirestoreReadMetric[] {
    return [...this.metrics.values()]
      .map(metric => ({ ...metric }))
      .sort((a, b) => b.networkDocuments - a.networkDocuments || b.lastAt - a.lastAt);
  }

  reset(): void {
    this.metrics.clear();
    this.persistNow();
  }

  enableDebug(): void {
    this.debugEnabled = true;
    try {
      localStorage.setItem('lims_read_diagnostics', '1');
    } catch {
      // Diagnostics are optional.
    }
  }

  disableDebug(): void {
    this.debugEnabled = false;
    try {
      localStorage.removeItem('lims_read_diagnostics');
    } catch {
      // Diagnostics are optional.
    }
  }

  private readDebugFlag(): boolean {
    try {
      return localStorage.getItem('lims_read_diagnostics') === '1'
        || new URLSearchParams(window.location.search).has('readDiagnostics');
    } catch {
      return false;
    }
  }

  private schedulePersist(): void {
    if (this.persistTimer) return;
    this.persistTimer = setTimeout(() => {
      this.persistTimer = undefined;
      this.persistNow();
    }, 1000);
  }

  private persistNow(): void {
    try {
      const metrics = this.snapshot().slice(0, MAX_METRICS);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        updatedAt: Date.now(),
        metrics
      }));
    } catch {
      // Diagnostics must never affect the application.
    }
  }

  private exposeDebugHandle(): void {
    if (typeof window === 'undefined') return;
    const debugWindow = window as Window & {
      __limsFirestoreReads?: {
        snapshot: () => FirestoreReadMetric[];
        reset: () => void;
        enable: () => void;
        disable: () => void;
      };
    };
    debugWindow.__limsFirestoreReads = {
      snapshot: () => this.snapshot(),
      reset: () => this.reset(),
      enable: () => this.enableDebug(),
      disable: () => this.disableDebug()
    };
  }
}
