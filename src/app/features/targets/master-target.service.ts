
import { Injectable, inject, signal, effect } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { DeltaSyncService, DeltaSyncConfig } from '../../core/services/delta-sync.service';
import { AuthService } from '../../core/services/auth.service';
import { 
  collection, doc, setDoc, deleteDoc, 
  serverTimestamp, getDoc, writeBatch
} from 'firebase/firestore';
import { MasterAnalyte } from '../../core/models/sop.model';

@Injectable({ providedIn: 'root' })
export class MasterTargetService {
  private fb = inject(FirebaseService);
  private deltaSync = inject(DeltaSyncService);
  private auth = inject(AuthService);

  /** Reactive signal cho components subscribe trực tiếp */
  readonly analytes = signal<MasterAnalyte[]>([]);

  private singletonStarted = false;

  private get collectionPath() {
    return `artifacts/${this.fb.APP_ID}/master_analytes`;
  }

  private get collectionRef() {
    return collection(this.fb.db, this.collectionPath);
  }

  private get _deltaCacheKey() {
    return `delta_master_analytes_${this.fb.APP_ID}`;
  }

  private get _deltaCursorKey() {
    return `delta_master_analytes_cursor_${this.fb.APP_ID}`;
  }

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (!user) {
        this.singletonStarted = false;
        this.analytes.set([]);
      }
    });
  }

  /**
   * Khởi tạo singleton DeltaSync listener (chỉ gọi 1 lần).
   * Tất cả SOP components chỉ cần gọi getAll() — nếu singleton chưa chạy sẽ tự start.
   */
  private ensureSingleton(): void {
    if (this.singletonStarted) return;
    this.singletonStarted = true;

    const config: DeltaSyncConfig = {
      cacheKey: this._deltaCacheKey,
      cursorKey: this._deltaCursorKey,
      collectionPath: this.collectionPath,
      orderByField: 'lastUpdated',
      orderDirection: 'desc',
      maxCacheSize: 500
    };

    this.deltaSync.startSingletonListener<MasterAnalyte>(config, (data) => {
      // Sort by name cho hiển thị
      const sorted = [...data].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      this.analytes.set(sorted);
    });
  }

  /**
   * Trả về danh sách master analytes.
   * - Lần đầu: start singleton listener, trả cache hoặc đợi fetch
   * - Lần sau: trả từ memCache (0 reads)
   */
  async getAll(): Promise<MasterAnalyte[]> {
    this.ensureSingleton();

    // Nếu signal đã có data → trả ngay (0 reads)
    const current = this.analytes();
    if (current.length > 0) return current;

    // Chưa có data → đọc từ DeltaSync cache (localStorage)
    const cached = this.deltaSync.getCache<MasterAnalyte>(this._deltaCacheKey);
    if (cached.length > 0) {
      const sorted = [...cached].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      this.analytes.set(sorted);
      return sorted;
    }

    // Cache hoàn toàn rỗng → đợi singleton fetch xong (chỉ lần đầu tiên)
    return new Promise<MasterAnalyte[]>((resolve) => {
      const check = setInterval(() => {
        const data = this.analytes();
        if (data.length > 0) {
          clearInterval(check);
          resolve(data);
        }
      }, 100);
      // Timeout sau 5s → trả rỗng
      setTimeout(() => { clearInterval(check); resolve([]); }, 5000);
    });
  }

  async getById(id: string): Promise<MasterAnalyte | undefined> {
    // Thử từ cache trước
    const cached = this.analytes();
    const found = cached.find(a => a.id === id);
    if (found) return found;

    // Fallback: đọc trực tiếp từ Firestore
    const ref = doc(this.fb.db, `${this.collectionPath}/${id}`);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as MasterAnalyte) : undefined;
  }

  async save(item: MasterAnalyte): Promise<void> {
    const ref = doc(this.fb.db, `${this.collectionPath}/${item.id}`);
    await setDoc(ref, { ...item, lastUpdated: serverTimestamp() });
    await this.fb.updateMetadata('master_analytes');
    // DeltaSync listener sẽ tự nhận thay đổi và cập nhật analytes signal
  }

  async saveBatch(items: MasterAnalyte[], options: { merge?: boolean } = {}): Promise<void> {
    const MAX_BATCH_SIZE = 450;
    let opCount = 0;
    let currentBatch = writeBatch(this.fb.db);

    for (const item of items) {
        const ref = doc(this.fb.db, `${this.collectionPath}/${item.id}`);
        const data = { ...item, lastUpdated: serverTimestamp() };
        if (options.merge) {
            currentBatch.set(ref, data, { merge: true });
        } else {
            currentBatch.set(ref, data);
        }
        opCount++;

        if (opCount >= MAX_BATCH_SIZE) {
            await currentBatch.commit();
            currentBatch = writeBatch(this.fb.db);
            opCount = 0;
        }
    }

    if (opCount > 0) {
        await currentBatch.commit();
    }
    await this.fb.updateMetadata('master_analytes');
    // DeltaSync listener sẽ tự nhận thay đổi
  }

  async delete(id: string): Promise<void> {
    const ref = doc(this.fb.db, `${this.collectionPath}/${id}`);
    await deleteDoc(ref);
    await this.fb.updateMetadata('master_analytes');
    // DeltaSync listener sẽ tự nhận thay đổi
  }
}
