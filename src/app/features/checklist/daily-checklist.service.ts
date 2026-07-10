import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import {
  Unsubscribe,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch
} from 'firebase/firestore';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { DailyCheckEntry, DailyChecklistAssignment } from './daily-checklist.model';
import { buildDailyCheckId } from './daily-checklist.utils';

@Injectable()
export class DailyChecklistService implements OnDestroy {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);

  readonly checks = signal<Map<string, DailyCheckEntry>>(new Map());
  readonly checksLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly loading = this.checksLoading.asReadonly();

  private checksUnsubscribe?: Unsubscribe;
  private activeDay = '';

  watchDay(daySuffix: string): void {
    if (daySuffix === this.activeDay) return;
    this.stopListeners();
    this.activeDay = daySuffix;
    this.checks.set(new Map());
    this.error.set(null);
    this.checksLoading.set(true);

    const checksQuery = query(
      collection(this.fb.db, `artifacts/${this.fb.APP_ID}/daily_checks`),
      where('daySuffix', '==', daySuffix)
    );

    this.checksUnsubscribe = onSnapshot(
      checksQuery,
      snapshot => {
        const next = new Map<string, DailyCheckEntry>();
        snapshot.docs.forEach(item => next.set(item.id, { id: item.id, ...item.data() } as DailyCheckEntry));
        this.checks.set(next);
        this.checksLoading.set(false);
      },
      error => {
        console.error('[DailyChecklist] Check query failed:', error);
        this.error.set('Không thể tải trạng thái check mẫu. Vui lòng kiểm tra quyền truy cập hoặc kết nối mạng.');
        this.checksLoading.set(false);
      }
    );
  }

  stop(): void {
    this.stopListeners();
    this.activeDay = '';
  }

  retry(daySuffix: string): void {
    this.activeDay = '';
    this.watchDay(daySuffix);
  }

  isChecked(assignment: DailyChecklistAssignment): boolean {
    return this.checks().get(this.getCheckId(assignment))?.checked === true;
  }

  getCheckEntry(assignment: DailyChecklistAssignment): DailyCheckEntry | undefined {
    return this.checks().get(this.getCheckId(assignment));
  }

  getCheckId(assignment: DailyChecklistAssignment): string {
    return buildDailyCheckId(assignment.requestId, assignment.sampleId, assignment.targetId);
  }

  async setChecked(assignment: DailyChecklistAssignment, checked: boolean): Promise<void> {
    if (!this.auth.canRunBatch()) {
      throw new Error('Bạn không có quyền check mẫu.');
    }

    const user = this.auth.currentUser();
    if (!user) throw new Error('Phiên đăng nhập không hợp lệ.');

    const id = this.getCheckId(assignment);
    const previous = this.checks().get(id);
    this.applyOptimisticCheck(assignment, checked, user.uid, user.displayName);

    const checkRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/daily_checks/${id}`);
    const logRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`));
    const batch = writeBatch(this.fb.db);
    batch.set(checkRef, this.buildCheckPayload(assignment, checked, user.uid, user.displayName), { merge: true });
    batch.set(logRef, {
      id: logRef.id,
      action: checked ? 'DAILY_CHECK_ITEM' : 'DAILY_UNCHECK_ITEM',
      details: `${checked ? 'Check' : 'Bỏ check'} mẫu ${assignment.sampleId} · ${assignment.targetName} · ${assignment.sopName}`,
      timestamp: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      user: user.displayName,
      userId: user.uid,
      requestId: assignment.requestId,
      sampleId: assignment.sampleId,
      targetId: assignment.targetId,
      printable: false
    });

    try {
      await batch.commit();
    } catch (error) {
      this.checks.update(current => {
        const rollback = new Map(current);
        if (previous) rollback.set(id, previous);
        else rollback.delete(id);
        return rollback;
      });
      throw error;
    }
  }

  async setManyChecked(assignments: DailyChecklistAssignment[], checked: boolean): Promise<void> {
    if (!this.auth.canRunBatch()) throw new Error('Bạn không có quyền check mẫu.');
    const user = this.auth.currentUser();
    if (!user) throw new Error('Phiên đăng nhập không hợp lệ.');

    const unique = Array.from(new Map(assignments.map(item => [this.getCheckId(item), item])).values());
    if (!unique.length) return;

    const previous = new Map(this.checks());
    unique.forEach(item => this.applyOptimisticCheck(item, checked, user.uid, user.displayName));

    try {
      for (let start = 0; start < unique.length; start += 400) {
        const chunk = unique.slice(start, start + 400);
        const batch = writeBatch(this.fb.db);
        chunk.forEach(item => {
          const id = this.getCheckId(item);
          const checkRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/daily_checks/${id}`);
          batch.set(checkRef, this.buildCheckPayload(item, checked, user.uid, user.displayName), { merge: true });
        });

        const logRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`));
        batch.set(logRef, {
          id: logRef.id,
          action: checked ? 'DAILY_CHECK_BULK' : 'DAILY_UNCHECK_BULK',
          details: `${checked ? 'Check' : 'Bỏ check'} hàng loạt ${chunk.length} lượt mẫu/chỉ tiêu`,
          timestamp: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          user: user.displayName,
          userId: user.uid,
          requestIds: Array.from(new Set(chunk.map(item => item.requestId))).slice(0, 100),
          printable: false
        });
        await batch.commit();
      }
    } catch (error) {
      this.checks.set(previous);
      throw error;
    }
  }

  private buildCheckPayload(
    assignment: DailyChecklistAssignment,
    checked: boolean,
    uid: string,
    displayName: string
  ) {
    return {
      requestId: assignment.requestId,
      sopId: assignment.sopId,
      sampleId: assignment.sampleId,
      targetId: assignment.targetId,
      analysisDate: assignment.analysisDate || null,
      daySuffix: assignment.daySuffix,
      checked,
      checkedAt: checked ? serverTimestamp() : null,
      checkedBy: checked ? uid : null,
      checkedByName: checked ? displayName : null,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
      updatedByName: displayName
    };
  }

  private applyOptimisticCheck(
    assignment: DailyChecklistAssignment,
    checked: boolean,
    uid: string,
    displayName: string
  ): void {
    const id = this.getCheckId(assignment);
    this.checks.update(current => {
      const next = new Map(current);
      next.set(id, {
        id,
        requestId: assignment.requestId,
        sopId: assignment.sopId,
        sampleId: assignment.sampleId,
        targetId: assignment.targetId,
        analysisDate: assignment.analysisDate,
        daySuffix: assignment.daySuffix,
        checked,
        checkedAt: checked ? new Date() : undefined,
        checkedBy: checked ? uid : undefined,
        checkedByName: checked ? displayName : undefined,
        updatedAt: new Date(),
        updatedBy: uid,
        updatedByName: displayName
      });
      return next;
    });
  }

  private stopListeners(): void {
    this.checksUnsubscribe?.();
    this.checksUnsubscribe = undefined;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
