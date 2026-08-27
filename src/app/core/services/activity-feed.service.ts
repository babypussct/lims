import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe
} from 'firebase/firestore';
import type { ActivityAudience, ActivityEvent } from '../activity/activity-event.model';
import {
  mergeActivityFeedEvents,
  parseActivityFeedEvent,
  resolveActivityFeedScope
} from '../activity/activity-feed.utils';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';

export type ActivityFeedStatus = 'disabled' | 'loading' | 'ready' | 'denied' | 'error';

@Injectable({ providedIn: 'root' })
export class ActivityFeedService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly readMonitor = inject(FirestoreReadMonitor);
  private readonly enabled = signal(false);
  private readonly audienceSnapshots = new Map<ActivityAudience, ActivityEvent[]>();
  private readonly listeners = new Map<ActivityAudience, Unsubscribe>();
  private generation = 0;
  private readonly perAudienceLimit = 75;

  readonly events = signal<ActivityEvent[]>([]);
  readonly status = signal<ActivityFeedStatus>('disabled');
  readonly errorMessage = signal<string | null>(null);
  readonly allowedAudiences = signal<ActivityAudience[]>([]);
  readonly scopeKey = signal<string | null>(null);
  readonly lastActivitySeenAt = signal<unknown | null>(null);
  readonly denied = computed(() => this.status() === 'denied');
  readonly hasFeedAccess = computed(() => this.allowedAudiences().length > 0 && !this.denied());
  constructor() {
    effect(() => {
      const enabled = this.enabled();
      const profile = this.auth.currentUser();
      const permissions = this.auth.userPermissions();
      this.reconcileScope(enabled, profile?.uid, profile?.role, permissions);
    });
  }

  setEnabled(enabled: boolean): void {
    // Invalidate listeners and in-flight last-seen reads synchronously when
    // the Dashboard is torn down. Angular effects are scheduled, so waiting
    // for reconcileScope() here would let a fast route change reuse the old
    // view session.
    if (!enabled && this.enabled()) {
      this.stopListenersAndClear();
      this.status.set('disabled');
    }
    this.enabled.set(enabled);
  }

  /**
   * Records the previous marker and starts a new Activity-view session.
   * Dashboard calls this once after the feed panel is actually visible; the
   * caller owns the per-component visit guard so returning to Dashboard in
   * the same app session still creates a new visit.
   */
  async recordDashboardView(): Promise<void> {
    const uid = this.auth.currentUser()?.uid;
    const scope = this.scopeKey();
    if (!uid || !scope || this.status() !== 'ready') return;

    const generation = this.generation;
    const path = `artifacts/${this.fb.APP_ID}/user_preferences/${uid}`;
    const preferenceRef = doc(this.fb.db, path);
    try {
      const snapshot = await getDoc(preferenceRef);
      this.readMonitor.record('getDoc', path, snapshot.exists() ? 1 : 0);
      if (generation !== this.generation || scope !== this.scopeKey()) return;
      this.lastActivitySeenAt.set(snapshot.data()?.['lastActivitySeenAt'] ?? null);
      await setDoc(preferenceRef, { lastActivitySeenAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      if (generation !== this.generation || scope !== this.scopeKey()) return;
      console.warn('Activity Feed last-seen preference error:', error);
    }
  }

  private reconcileScope(
    enabled: boolean,
    uid: string | undefined,
    role: 'manager' | 'staff' | 'viewer' | 'pending' | undefined,
    permissions: readonly string[]
  ): void {
    const { audiences, scopeKey: nextScope } = resolveActivityFeedScope(enabled, uid, role, permissions);

    if (nextScope && nextScope === this.scopeKey() && this.listeners.size > 0) return;

    this.stopListenersAndClear();
    this.allowedAudiences.set(audiences);
    this.scopeKey.set(nextScope);
    this.errorMessage.set(null);
    this.lastActivitySeenAt.set(null);

    if (!enabled) {
      this.status.set('disabled');
      return;
    }
    if (!uid || audiences.length === 0) {
      this.status.set('denied');
      return;
    }

    this.status.set('loading');
    const generation = this.generation;
    const pendingInitial = new Set(audiences);
    for (const audience of audiences) {
      this.startAudienceListener(audience, generation, pendingInitial);
    }
  }

  private startAudienceListener(
    audience: ActivityAudience,
    generation: number,
    pendingInitial: Set<ActivityAudience>
  ): void {
    const path = `artifacts/${this.fb.APP_ID}/logs`;
    const feedQuery = query(
      collection(this.fb.db, path),
      where('audience', '==', audience),
      where('activityVisible', '==', true),
      orderBy('timestamp', 'desc'),
      limit(this.perAudienceLimit)
    );
    let isInitial = true;
    const unsubscribe = onSnapshot(feedQuery, snapshot => {
      if (generation !== this.generation) return;
      this.readMonitor.record(
        'onSnapshot',
        path,
        isInitial ? snapshot.size : snapshot.docChanges().filter(change => change.type !== 'removed').length,
        { phase: isInitial ? 'initial' : 'delta', fromCache: snapshot.metadata.fromCache }
      );
      isInitial = false;

      const events = snapshot.docs
        .map(document => parseActivityFeedEvent(document.id, document.data()))
        .filter((event): event is ActivityEvent => event !== null);
      this.audienceSnapshots.set(audience, events);
      this.publishMergedEvents();
      pendingInitial.delete(audience);
      if (pendingInitial.size === 0) this.status.set('ready');
    }, error => {
      if (generation !== this.generation) return;
      const code = String((error as { code?: unknown })?.code || '');
      this.failScope(code === 'permission-denied' ? 'denied' : 'error', error);
    });
    this.listeners.set(audience, unsubscribe);
  }

  private publishMergedEvents(): void {
    this.events.set(mergeActivityFeedEvents(this.audienceSnapshots.values()));
  }

  private failScope(status: 'denied' | 'error', error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.stopListenersAndClear();
    this.status.set(status);
    this.errorMessage.set(message);
  }

  private stopListenersAndClear(): void {
    this.generation += 1;
    for (const unsubscribe of this.listeners.values()) unsubscribe();
    this.listeners.clear();
    this.audienceSnapshots.clear();
    this.events.set([]);
    this.lastActivitySeenAt.set(null);
  }
}
