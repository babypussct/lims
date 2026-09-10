
import { Injectable, inject, signal, effect } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { 
  collection, doc, setDoc, updateDoc, serverTimestamp, getDoc
} from 'firebase/firestore';
import { TargetGroup } from '../../core/models/sop.model';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
import { AuthService } from '../../core/services/auth.service';
import { buildScopedDeltaKey, DeltaSyncService } from '../../core/services/delta-sync.service';

@Injectable({ providedIn: 'root' })
export class TargetService {
  private fb = inject(FirebaseService);
  private readMonitor = inject(FirestoreReadMonitor);
  private auth = inject(AuthService);
  private deltaSync = inject(DeltaSyncService);
  private readonly groupsSignal = signal<TargetGroup[]>([]);
  readonly groups = this.groupsSignal.asReadonly();
  private singletonStarted = false;
  private activeCacheKey: string | null = null;

  private get collectionPath() {
    return `artifacts/${this.fb.APP_ID}/target_groups`;
  }

  private get cacheKey() {
    return buildScopedDeltaKey(`lims_target_groups_cache_${this.fb.APP_ID}`, this.auth.getDeltaCacheScope());
  }

  private get cursorKey() {
    return buildScopedDeltaKey(`lims_target_groups_cursor_${this.fb.APP_ID}`, this.auth.getDeltaCacheScope());
  }

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      const nextKey = user ? this.cacheKey : null;
      if (this.activeCacheKey && this.activeCacheKey !== nextKey) {
        this.deltaSync.destroySingleton(this.activeCacheKey);
        this.singletonStarted = false;
        this.activeCacheKey = null;
        this.groupsSignal.set([]);
      }
      if (!user) {
        this.singletonStarted = false;
        this.activeCacheKey = null;
        this.groupsSignal.set([]);
      }
    });
  }

  private ensureSingleton(): void {
    if (this.singletonStarted || !this.auth.currentUser()) return;
    this.singletonStarted = true;
    this.activeCacheKey = this.cacheKey;
    this.deltaSync.startSingletonListener<TargetGroup>({
      cacheKey: this.cacheKey,
      cursorKey: this.cursorKey,
      collectionPath: this.collectionPath,
      maxCacheSize: 500,
      orderByField: 'lastUpdated',
      orderDirection: 'desc',
      initialCollectionScan: true,
      isDeletedFn: group => group._isDeleted === true
    }, groups => {
      this.groupsSignal.set([...groups].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    });
  }

  async getAllGroups(forceRefresh = false): Promise<TargetGroup[]> {
    if (forceRefresh && this.activeCacheKey) {
      this.deltaSync.destroySingleton(this.activeCacheKey);
      this.deltaSync.clearCache(this.cacheKey, this.cursorKey);
      this.singletonStarted = false;
      this.activeCacheKey = null;
      this.groupsSignal.set([]);
    }
    this.ensureSingleton();
    if (this.groupsSignal().length > 0) return this.groupsSignal();
    if (await this.deltaSync.waitForSingletonReady(this.cacheKey, 5000)) return this.groupsSignal();
    return this.groupsSignal();
  }

  async getGroupById(id: string): Promise<TargetGroup | undefined> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${id}`);
    const snap = await getDoc(ref);
    this.readMonitor.record(
      'getDoc',
      `artifacts/${this.fb.APP_ID}/target_groups/${id}`,
      snap.exists() ? 1 : 0,
      { fromCache: snap.metadata.fromCache }
    );
    if (!snap.exists() || snap.data()['_isDeleted'] === true) return undefined;
    return { id: snap.id, ...snap.data() } as TargetGroup;
  }

  async saveGroup(group: TargetGroup): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${group.id}`);
    await setDoc(ref, { ...group, _isDeleted: false, lastUpdated: serverTimestamp() });
    this.ensureSingleton();
    this.deltaSync.mergeSingletonCache<TargetGroup>(
      this.cacheKey,
      [{ ...group, _isDeleted: false, lastUpdated: Date.now() }],
      []
    );
  }

  async deleteGroup(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${id}`);
    await updateDoc(ref, { _isDeleted: true, lastUpdated: serverTimestamp() });
    this.ensureSingleton();
    this.deltaSync.mergeSingletonCache<TargetGroup>(this.cacheKey, [], [id]);
  }
}
