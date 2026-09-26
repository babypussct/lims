import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import {
  doc,
  getDoc,
  increment,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  setDoc,
  writeBatch,
  deleteField,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { timestampToDate } from '../../shared/utils/timestamp';
import { createInclusiveDateRange, enumerateInclusiveDates, toLocalDateKey } from '../../shared/utils/date-range';
import { isRequestCountedInStats, resolveRequestStatsCounts } from './request-stats.utils';
import {
  buildStatsProjectionForDays,
  collectReconciliationDays,
  type StatsProjectionRow,
} from './stats-reconciliation.utils';

export interface DailyStats {
  totalSamples: number;
  totalBatches: number;
  totalQcs: number;
  sops: Record<string, { samples: number; batches: number; qcs: number }>;
}

export type MonthlyStatsDoc = Record<string, DailyStats>; // '2026-07-31'

@Injectable({ providedIn: 'root' })
export class StatsService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private reconciliationPromise: Promise<void> | null = null;
  private lastReconciliationAttempt = 0;

  private getMonthKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  private getDayKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private getRequestStatsDate(req: Record<string, any>): Date | null {
    if (typeof req['analysisDate'] === 'string') {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(req['analysisDate']);
      if (match) {
        const local = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
        if (!Number.isNaN(local.getTime())) return local;
      }
    }
    return timestampToDate(req['approvedAt'] ?? req['timestamp']);
  }

  /**
   * Cập nhật (tăng/giảm) chỉ số vào document thống kê của tháng.
   * Đường tăng dùng server-side increment để các writer cùng tháng không tranh chấp
   * version precondition. Đường giảm vẫn dùng transaction vì cần clamp về 0.
   */
  async incrementStats(
    date: Date,
    sopId: string,
    sopName: string,
    samples: number,
    batches = 1,
    qcs = 0,
    isDecrement = false
  ): Promise<void> {
    const monthKey = this.getMonthKey(date);
    const dayKey = this.getDayKey(date);
    const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/monthly_stats`, monthKey);

    const multiplier = isDecrement ? -1 : 1;
    const sDelta = samples * multiplier;
    const bDelta = batches * multiplier;
    const qDelta = qcs * multiplier;

    if (!isDecrement) {
      const sopKey = sopName || sopId || 'Unknown';
      await setDoc(docRef, {
        [dayKey]: {
          totalSamples: increment(sDelta),
          totalBatches: increment(bDelta),
          totalQcs: increment(qDelta),
          sops: {
            [sopKey]: {
              samples: increment(sDelta),
              batches: increment(bDelta),
              qcs: increment(qDelta)
            }
          }
        }
      }, { merge: true });
      return;
    }

    try {
      await runTransaction(this.fb.db, async (transaction) => {
        const sfDoc = await transaction.get(docRef);
        let data: MonthlyStatsDoc = {};
        
        if (sfDoc.exists()) {
          data = sfDoc.data() as MonthlyStatsDoc;
        }

        if (!data[dayKey]) {
          data[dayKey] = { totalSamples: 0, totalBatches: 0, totalQcs: 0, sops: {} };
        }

        // Đảm bảo không bị âm nếu dữ liệu bị lệch
        data[dayKey].totalSamples = Math.max(0, data[dayKey].totalSamples + sDelta);
        data[dayKey].totalBatches = Math.max(0, data[dayKey].totalBatches + bDelta);
        data[dayKey].totalQcs = Math.max(0, (data[dayKey].totalQcs || 0) + qDelta);

        // Lưu tên SOP làm key để dễ nhóm trên biểu đồ (hoặc kết hợp id+name)
        const sopKey = sopName || sopId || 'Unknown';
        if (!data[dayKey].sops[sopKey]) {
          data[dayKey].sops[sopKey] = { samples: 0, batches: 0, qcs: 0 };
        }

        data[dayKey].sops[sopKey].samples = Math.max(0, data[dayKey].sops[sopKey].samples + sDelta);
        data[dayKey].sops[sopKey].batches = Math.max(0, data[dayKey].sops[sopKey].batches + bDelta);
        data[dayKey].sops[sopKey].qcs = Math.max(0, (data[dayKey].sops[sopKey].qcs || 0) + qDelta);

        // Dọn dẹp nếu bằng 0
        if (data[dayKey].sops[sopKey].samples === 0 && data[dayKey].sops[sopKey].batches === 0 && data[dayKey].sops[sopKey].qcs === 0) {
            delete data[dayKey].sops[sopKey];
        }

        transaction.set(docRef, data, { merge: true });
      });
    } catch (e) {
      console.error('Failed to update stats: ', e);
      throw e;
    }
  }

  /**
   * Projection writes must never make the primary Request transaction fail.
   * Persist a replayable reconciliation item instead of swallowing failures.
   */
  async incrementStatsWithReconciliation(
    date: Date,
    sopId: string,
    sopName: string,
    samples: number,
    batches = 1,
    qcs = 0,
    isDecrement = false,
    context: { requestId?: string; operation?: string } = {}
  ): Promise<void> {
    try {
      await this.incrementStats(date, sopId, sopName, samples, batches, qcs, isDecrement);
      this.scheduleStatsReconciliation(false);
    } catch (error: any) {
      console.error('[Stats] Projection update failed; queuing reconciliation.', error);
      try {
        await addDoc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/stats_reconciliation`), {
          status: 'pending',
          statsDate: this.getDayKey(date),
          sopId,
          sopName,
          samples,
          batches,
          qcs,
          isDecrement,
          requestId: context.requestId || null,
          operation: context.operation || 'unknown',
          errorCode: typeof error?.code === 'string' ? error.code : null,
          createdAt: serverTimestamp(),
          createdByUid: this.auth.currentUser()?.uid || null,
        });
        this.scheduleStatsReconciliation(true);
      } catch (queueError) {
        console.error('[Stats] Failed to persist reconciliation item:', queueError);
      }
    }
  }

  private scheduleStatsReconciliation(force: boolean): void {
    if (!this.auth.canApprove() && !this.auth.canRunBatch()) return;
    if (this.reconciliationPromise) return;
    const now = Date.now();
    if (!force && now - this.lastReconciliationAttempt < 60_000) return;
    this.lastReconciliationAttempt = now;
    this.reconciliationPromise = this.reconcilePendingStats()
      .catch(error => console.warn('[Stats] Reconciliation retry deferred:', error))
      .finally(() => { this.reconciliationPromise = null; });
  }

  /**
   * Rebuild affected days from canonical Request documents, then resolve queue
   * entries only after the overwrite succeeds. Re-running after a crash is safe.
   */
  async reconcilePendingStats(maxItems = 200): Promise<void> {
    if (!this.auth.canApprove() && !this.auth.canRunBatch()) return;
    const queueRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/stats_reconciliation`);
    const pending = await getDocs(query(queueRef, where('status', '==', 'pending'), limit(maxItems)));
    if (pending.empty) return;

    const days = collectReconciliationDays(pending.docs.map(item => ({
      id: item.id,
      statsDate: item.data()['statsDate']
    })));
    if (days.length === 0) return;

    await this.rebuildStatsDays(days);

    const resolvedAt = serverTimestamp();
    const resolvedByUid = this.auth.currentUser()?.uid || '';
    const resolveBatch = writeBatch(this.fb.db);
    for (const item of pending.docs) {
      const statsDate = item.data()['statsDate'];
      if (typeof statsDate === 'string' && days.includes(statsDate)) {
        resolveBatch.update(item.ref, {
          status: 'resolved',
          resolvedAt,
          resolvedByUid,
        });
      }
    }
    await resolveBatch.commit();
  }

  private async rebuildStatsDays(dayKeys: readonly string[]): Promise<void> {
    const targets = new Set(dayKeys);
    const rows: StatsProjectionRow[] = [];
    const reqCol = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
    let lastDoc: any = null;

    while (true) {
      const currentQuery = lastDoc
        ? query(reqCol, orderBy('__name__'), startAfter(lastDoc), limit(500))
        : query(reqCol, orderBy('__name__'), limit(500));
      const snap = await getDocs(currentQuery);
      if (snap.empty) break;

      for (const requestDoc of snap.docs) {
        const req = requestDoc.data();
        const date = this.getRequestStatsDate(req);
        if (!date) continue;
        const dateKey = this.getDayKey(date);
        if (!targets.has(dateKey)) continue;
        rows.push({
          dateKey,
          status: req['status'],
          isVirtualMaster: req['isVirtualMaster'],
          sopId: req['sopId'],
          sopName: req['sopName'],
          sampleList: req['sampleList'],
          inputs: req['inputs'],
        });
      }

      lastDoc = snap.docs[snap.docs.length - 1];
      if (snap.size < 500) break;
    }

    const projection = buildStatsProjectionForDays(rows, dayKeys);
    const daysByMonth = new Map<string, string[]>();
    for (const dayKey of dayKeys) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) continue;
      const monthKey = dayKey.slice(0, 7);
      const monthDays = daysByMonth.get(monthKey) || [];
      monthDays.push(dayKey);
      daysByMonth.set(monthKey, monthDays);
    }

    const batch = writeBatch(this.fb.db);
    for (const [monthKey, monthDays] of daysByMonth) {
      const monthlyRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/monthly_stats`, monthKey);
      const patch: Record<string, DailyStats | ReturnType<typeof deleteField>> = {};
      for (const dayKey of monthDays) {
        patch[dayKey] = projection[dayKey] || deleteField();
      }
      batch.set(monthlyRef, patch, { merge: true });
    }
    await batch.commit();
  }

  /**
   * Lấy dữ liệu thống kê của nhiều tháng liên tiếp (Ví dụ: để vẽ biểu đồ 60 ngày)
   */
  async getStatsForMonths(monthKeys: string[]): Promise<Record<string, MonthlyStatsDoc>> {
    const result: Record<string, MonthlyStatsDoc> = {};
    if (!this.auth.canViewReports() && !this.auth.canViewSop()) return result;

    for (const key of Array.from(new Set(monthKeys))) {
      try {
        const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/monthly_stats`, key);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          result[key] = snap.data() as MonthlyStatsDoc;
        } else {
          result[key] = {};
        }
      } catch (e) {
        console.error(`Error fetching stats for ${key}:`, e);
        throw e;
      }
    }
    return result;
  }

  /** Load the complete monthly aggregate history for the All time dashboard view. */
  async getAllMonthlyStats(): Promise<Record<string, MonthlyStatsDoc>> {
    const result: Record<string, MonthlyStatsDoc> = {};
    if (!this.auth.canViewReports() && !this.auth.canViewSop()) return result;

    try {
      const statsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/monthly_stats`);
      const snapshot = await getDocs(statsRef);
      snapshot.forEach(monthDoc => {
        result[monthDoc.id] = monthDoc.data() as MonthlyStatsDoc;
      });
    } catch (e) {
      console.error('Error fetching all monthly stats:', e);
      throw e;
    }
    return result;
  }

  /**
   * Script Backfill có thể gọi nhiều lần, phân trang theo thời gian để không làm treo UI.
   * Quét tất cả Requests từ startDate đến endDate và ghi đè vào bảng monthly_stats.
   */
  async runBackfill(startDateStr: string, endDateStr: string, onProgress: (msg: string) => void): Promise<void> {
    const range = createInclusiveDateRange(startDateStr, endDateStr);
    if (!range) throw new Error('Khoảng ngày backfill không hợp lệ.');
    const { start, end } = range;

    try {
      // Đã loại bỏ code xóa toàn bộ bảng monthly_stats ở đây để tránh làm mất dữ liệu lịch sử
      // khi người dùng chỉ chạy backfill cho một khoảng thời gian ngắn.

      onProgress('Đang tải dữ liệu... (0)');
      const reqCol = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
    
    // Tính toán dữ liệu trên bộ nhớ trước khi ghi
    const statsMap: Record<string, MonthlyStatsDoc> = {};

    let processed = 0;
    let lastDoc: any = null;
    let hasMore = true;

    while (hasMore) {
        let currentQuery;
        if (lastDoc) {
            currentQuery = query(reqCol, orderBy('__name__'), startAfter(lastDoc), limit(500));
        } else {
            currentQuery = query(reqCol, orderBy('__name__'), limit(500));
        }

        const snap = await getDocs(currentQuery);
        if (snap.empty) {
            hasMore = false;
            break;
        }

        snap.docs.forEach(docSnap => {
            const req = docSnap.data();

            // Client-side status filter to avoid requiring composite Firestore indexes
            if (!isRequestCountedInStats(req['status'])) return;

            const date = this.getRequestStatsDate(req);
            
            // Bỏ qua nếu ko có ngày hoặc không nằm trong khoảng thời gian
            if (!date || date < start || date > end || req['isVirtualMaster']) return;

            const monthKey = this.getMonthKey(date);
            const dayKey = this.getDayKey(date);

            if (!statsMap[monthKey]) statsMap[monthKey] = {};

            const { samples: s, qcs: q } = resolveRequestStatsCounts({
              sampleList: req['sampleList'],
              inputs: req['inputs']
            });

            if (!statsMap[monthKey][dayKey]) {
                statsMap[monthKey][dayKey] = { totalSamples: 0, totalBatches: 0, totalQcs: 0, sops: {} };
            }
            const dayStats = statsMap[monthKey][dayKey];
            
            dayStats.totalSamples += s;
            dayStats.totalBatches += 1;
            dayStats.totalQcs = (dayStats.totalQcs || 0) + q;

            const sopKey = req['sopName'] || req['sopId'] || 'Unknown';
            if (!dayStats.sops[sopKey]) {
                dayStats.sops[sopKey] = { samples: 0, batches: 0, qcs: 0 };
            }
            dayStats.sops[sopKey].samples += s;
            dayStats.sops[sopKey].batches += 1;
            dayStats.sops[sopKey].qcs = (dayStats.sops[sopKey].qcs || 0) + q;
        });

        processed += snap.size;
        lastDoc = snap.docs[snap.docs.length - 1];
        
        if (onProgress) {
            onProgress('Đang quét dữ liệu... (' + processed + ')');
        }
    }

    // Ghi dữ liệu đã tổng hợp vào Firestore bằng Batch.
    // Mọi ngày thuộc đúng khoảng backfill đều được ghi lại hoặc xóa trường cũ
    // nếu hiện không còn request tương ứng. Cách này tránh dữ liệu ngày bị stale
    // nhưng vẫn giữ nguyên các ngày ngoài khoảng backfill trong cùng document tháng.
    const daysByMonth = new Map<string, string[]>();
    for (const date of enumerateInclusiveDates(range)) {
        const dayKey = toLocalDateKey(date);
        const monthKey = dayKey.slice(0, 7);
        const monthDays = daysByMonth.get(monthKey) || [];
        monthDays.push(dayKey);
        daysByMonth.set(monthKey, monthDays);
    }

    const batch = writeBatch(this.fb.db);
    for (const [monthKey, dayKeys] of daysByMonth.entries()) {
        const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/monthly_stats`, monthKey);
        const monthData = statsMap[monthKey] || {};
        const patch: Record<string, DailyStats | ReturnType<typeof deleteField>> = {};
        dayKeys.forEach(dayKey => {
            patch[dayKey] = monthData[dayKey] || deleteField();
        });
        batch.set(docRef, patch, { merge: true });
    }

    await batch.commit();
    if (onProgress) {
        onProgress('Hoàn tất ghi dữ liệu! (' + processed + ')');
    }
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

}
