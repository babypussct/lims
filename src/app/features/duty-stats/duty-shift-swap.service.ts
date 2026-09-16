import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { NotificationService } from '../../core/services/notification.service';
import { ActivityEventService } from '../../core/services/activity-event.service';
import { DutyScheduleService } from './duty-schedule.service';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import type {
  DutyShiftSnapshot,
  DutySwapAuditEntry,
  DutySwapRequest,
  DutySwapRequestDraft,
  DutySwapRequestStatus,
} from './duty-shift-swap.model';
import {
  asDutyScheduleEntry,
  dutyShiftSnapshot,
  dutyShiftSnapshotMatches,
  isDutySwapExpired,
  replaceDutyStaffAtExactIndex,
} from './duty-shift-swap.utils';
import { findLinkedDutyStaff, isDutyDateKey } from './duty-schedule.utils';

const DUTY_SWAP_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class DutyShiftSwapService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly duty = inject(DutyScheduleService);
  private readonly notifications = inject(NotificationService);
  private readonly activity = inject(ActivityEventService);

  readonly requests = signal<DutySwapRequest[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pendingCount = computed(() => this.requests().filter(item => this.isPending(item) && !isDutySwapExpired(item.expiresAt)).length);

  private unsubscribe?: Unsubscribe;
  private listenerKey = '';

  watchRelevantRequests(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.stopListener();
      return;
    }
    const manager = this.duty.canManage();
    const key = `${user.uid}|${manager ? 'manager' : 'participant'}`;
    if (key === this.listenerKey && this.unsubscribe) return;
    this.stopListener();
    this.listenerKey = key;
    this.loading.set(true);
    const base = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_swap_requests`);
    const source = manager ? base : query(base, where('participantUids', 'array-contains', user.uid));
    this.unsubscribe = onSnapshot(source, snapshot => {
      this.requests.set(snapshot.docs
        .map(item => ({ id: item.id, ...item.data() } as DutySwapRequest))
        .sort((a, b) => this.timestampMillis(b.createdAt) - this.timestampMillis(a.createdAt)));
      this.loading.set(false);
      this.error.set(null);
    }, error => {
      this.loading.set(false);
      this.error.set(error.message || 'Không thể tải yêu cầu đổi ca.');
    });
  }

  stopListener(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.listenerKey = '';
    this.loading.set(false);
  }

  async createRequest(draft: DutySwapRequestDraft): Promise<string> {
    const user = this.requireUser();
    const requester = this.requireLinkedStaff(user.uid);
    const target = this.requireTargetStaff(draft.targetStaffId);
    const reason = draft.reason.trim().slice(0, 1000);
    if (!reason) throw new Error('Vui lòng nhập lý do đổi ca.');
    if (target.id === requester.id) throw new Error('Người nhận đề nghị phải khác người yêu cầu.');
    if (!target.linkedUserUid) throw new Error('Đồng nghiệp được chọn chưa liên kết tài khoản LIMS.');
    if (!isDutyDateKey(draft.sourceDate)) throw new Error('Ngày ca cần đổi không hợp lệ.');
    if (draft.type === 'SWAP' && (!draft.targetDate || !isDutyDateKey(draft.targetDate))) {
      throw new Error('Đổi ca hai chiều cần chọn ca đối ứng hợp lệ.');
    }
    if (draft.type === 'SWAP' && draft.targetDate === draft.sourceDate) {
      throw new Error('Hai ca đổi chỗ phải ở hai ngày khác nhau.');
    }

    const requestRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_swap_requests`));
    const auditRef = doc(collection(requestRef, 'audit'));
    const sourceRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_schedules`, draft.sourceDate);
    const targetRef = draft.type === 'SWAP'
      ? doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_schedules`, draft.targetDate!)
      : null;
    const nowMs = Date.now();
    const expiresAt = Timestamp.fromMillis(nowMs + DUTY_SWAP_TTL_MS);

    await runTransaction(this.fb.db, async transaction => {
      const sourceSnap = await transaction.get(sourceRef);
      if (!sourceSnap.exists()) throw new Error('Ca cần đổi không còn tồn tại.');
      const sourceSchedule = asDutyScheduleEntry(sourceSnap.id, sourceSnap.data());
      this.assertPlannedMember(sourceSchedule, requester.id, 'Bạn không còn được phân công trong ca cần đổi.');
      if (sourceSchedule.staffIds.includes(target.id)) throw new Error('Đồng nghiệp đã có trong ca cần đổi.');

      let targetSnapshot: DutyShiftSnapshot | null = null;
      if (targetRef) {
        const targetSnap = await transaction.get(targetRef);
        if (!targetSnap.exists()) throw new Error('Ca đối ứng không còn tồn tại.');
        const targetSchedule = asDutyScheduleEntry(targetSnap.id, targetSnap.data());
        this.assertPlannedMember(targetSchedule, target.id, 'Đồng nghiệp không còn được phân công trong ca đối ứng.');
        if (targetSchedule.staffIds.includes(requester.id)) throw new Error('Bạn đã có trong ca đối ứng.');
        targetSnapshot = dutyShiftSnapshot(targetSchedule);
      }

      const requestPayload: Omit<DutySwapRequest, 'id'> = {
        type: draft.type,
        status: 'PENDING_TARGET',
        requesterUid: user.uid,
        requesterStaffId: requester.id,
        requesterName: requester.displayName,
        targetUid: target.linkedUserUid!,
        targetStaffId: target.id,
        targetName: target.displayName,
        participantUids: [user.uid, target.linkedUserUid!],
        sourceDate: draft.sourceDate,
        targetDate: draft.type === 'SWAP' ? draft.targetDate! : '',
        reason,
        sourceSnapshot: dutyShiftSnapshot(sourceSchedule),
        targetSnapshot,
        expiresAt,
        createdAt: serverTimestamp(),
        createdByUid: user.uid,
        updatedAt: serverTimestamp(),
        updatedByUid: user.uid,
        targetRespondedAt: null,
        targetResponseByUid: '',
        managerReviewedAt: null,
        managerUid: '',
        decisionNote: '',
      };
      transaction.set(requestRef, requestPayload);
      transaction.set(auditRef, this.auditPayload(requestRef.id, 'CREATED', '', 'PENDING_TARGET', reason));
    });

    await this.bestEffortNotify(requestRef.id, 'REQUESTED');
    return requestRef.id;
  }

  async respondAsTarget(request: DutySwapRequest, accept: boolean, decisionNote = ''): Promise<void> {
    const user = this.requireUser();
    const requestRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_swap_requests`, request.id);
    const auditRef = doc(collection(requestRef, 'audit'));
    const nextStatus: DutySwapRequestStatus = accept ? 'PENDING_MANAGER' : 'REJECTED_TARGET';
    const action: DutySwapAuditEntry['action'] = accept ? 'TARGET_ACCEPTED' : 'TARGET_REJECTED';

    await runTransaction(this.fb.db, async transaction => {
      const snap = await transaction.get(requestRef);
      if (!snap.exists()) throw new Error('Yêu cầu đổi ca không còn tồn tại.');
      const current = { id: snap.id, ...snap.data() } as DutySwapRequest;
      if (current.targetUid !== user.uid) throw new Error('Bạn không phải người được đề nghị đổi ca.');
      if (current.status !== 'PENDING_TARGET') throw new Error('Yêu cầu này đã được xử lý.');
      if (isDutySwapExpired(current.expiresAt)) throw new Error('Yêu cầu đổi ca đã hết hạn.');
      transaction.update(requestRef, {
        status: nextStatus,
        targetRespondedAt: serverTimestamp(),
        targetResponseByUid: user.uid,
        decisionNote: decisionNote.trim().slice(0, 1000),
        updatedAt: serverTimestamp(),
        updatedByUid: user.uid,
      });
      transaction.set(auditRef, this.auditPayload(request.id, action, 'PENDING_TARGET', nextStatus, decisionNote));
    });

    await this.bestEffortNotify(request.id, accept ? 'TARGET_ACCEPTED' : 'TARGET_REJECTED');
  }

  async decideAsManager(request: DutySwapRequest, approve: boolean, decisionNote = ''): Promise<void> {
    this.assertCanManage();
    const user = this.requireUser();
    const requestRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_swap_requests`, request.id);
    const auditRef = doc(collection(requestRef, 'audit'));
    const sourceRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_schedules`, request.sourceDate);
    const targetRef = request.type === 'SWAP'
      ? doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_schedules`, request.targetDate)
      : null;
    const nextStatus: DutySwapRequestStatus = approve ? 'APPROVED' : 'REJECTED_MANAGER';
    const action: DutySwapAuditEntry['action'] = approve ? 'MANAGER_APPROVED' : 'MANAGER_REJECTED';

    await runTransaction(this.fb.db, async transaction => {
      const requestSnap = await transaction.get(requestRef);
      if (!requestSnap.exists()) throw new Error('Yêu cầu đổi ca không còn tồn tại.');
      const current = { id: requestSnap.id, ...requestSnap.data() } as DutySwapRequest;
      if (current.status !== 'PENDING_MANAGER') throw new Error('Yêu cầu chưa ở trạng thái chờ quản lý duyệt.');
      if (isDutySwapExpired(current.expiresAt)) throw new Error('Yêu cầu đổi ca đã hết hạn.');

      if (approve) {
        const sourceSnap = await transaction.get(sourceRef);
        if (!sourceSnap.exists()) throw new Error('Ca nguồn không còn tồn tại.');
        const sourceSchedule = asDutyScheduleEntry(sourceSnap.id, sourceSnap.data());
        if (!dutyShiftSnapshotMatches(current.sourceSnapshot, sourceSchedule)) {
          throw new Error(`Ca ${current.sourceDate} đã thay đổi sau khi gửi yêu cầu. Chưa cập nhật lịch.`);
        }
        const sourceStaffIds = replaceDutyStaffAtExactIndex(
          sourceSchedule.staffIds,
          current.requesterStaffId,
          current.targetStaffId,
        );
        transaction.update(sourceRef, {
          staffIds: sourceStaffIds,
          updatedAt: serverTimestamp(),
          updatedByUid: user.uid,
        });

        if (current.type === 'SWAP') {
          if (!targetRef || !current.targetSnapshot) throw new Error('Yêu cầu SWAP thiếu snapshot ca đối ứng.');
          const targetSnap = await transaction.get(targetRef);
          if (!targetSnap.exists()) throw new Error('Ca đối ứng không còn tồn tại.');
          const targetSchedule = asDutyScheduleEntry(targetSnap.id, targetSnap.data());
          if (!dutyShiftSnapshotMatches(current.targetSnapshot, targetSchedule)) {
            throw new Error(`Ca ${current.targetDate} đã thay đổi sau khi gửi yêu cầu. Chưa cập nhật lịch.`);
          }
          const targetStaffIds = replaceDutyStaffAtExactIndex(
            targetSchedule.staffIds,
            current.targetStaffId,
            current.requesterStaffId,
          );
          transaction.update(targetRef, {
            staffIds: targetStaffIds,
            updatedAt: serverTimestamp(),
            updatedByUid: user.uid,
          });
        }
      }

      transaction.update(requestRef, {
        status: nextStatus,
        managerReviewedAt: serverTimestamp(),
        managerUid: user.uid,
        decisionNote: decisionNote.trim().slice(0, 1000),
        updatedAt: serverTimestamp(),
        updatedByUid: user.uid,
      });
      transaction.set(auditRef, this.auditPayload(request.id, action, 'PENDING_MANAGER', nextStatus, decisionNote));
    });

    await this.bestEffortNotify(request.id, approve ? 'MANAGER_APPROVED' : 'MANAGER_REJECTED');
    if (approve) await this.bestEffortManagerActivity(request);
  }

  async cancelOwnRequest(request: DutySwapRequest): Promise<void> {
    const user = this.requireUser();
    const requestRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_swap_requests`, request.id);
    const auditRef = doc(collection(requestRef, 'audit'));
    await runTransaction(this.fb.db, async transaction => {
      const snap = await transaction.get(requestRef);
      if (!snap.exists()) throw new Error('Yêu cầu đổi ca không còn tồn tại.');
      const current = { id: snap.id, ...snap.data() } as DutySwapRequest;
      if (current.requesterUid !== user.uid) throw new Error('Bạn không phải người tạo yêu cầu này.');
      if (!['PENDING_TARGET', 'PENDING_MANAGER'].includes(current.status)) throw new Error('Yêu cầu này không thể hủy.');
      if (isDutySwapExpired(current.expiresAt)) throw new Error('Yêu cầu đổi ca đã hết hạn.');
      transaction.update(requestRef, {
        status: 'CANCELLED',
        updatedAt: serverTimestamp(),
        updatedByUid: user.uid,
      });
      transaction.set(auditRef, this.auditPayload(request.id, 'CANCELLED', current.status, 'CANCELLED', 'Người yêu cầu hủy.'));
    });
    await this.bestEffortNotify(request.id, 'CANCELLED');
  }

  async expireIfNeeded(request: DutySwapRequest): Promise<boolean> {
    if (!this.isPending(request) || !isDutySwapExpired(request.expiresAt)) return false;
    const user = this.requireUser();
    const allowed = this.duty.canManage() || request.participantUids.includes(user.uid);
    if (!allowed) return false;
    const requestRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_swap_requests`, request.id);
    const auditRef = doc(collection(requestRef, 'audit'));
    await runTransaction(this.fb.db, async transaction => {
      const snap = await transaction.get(requestRef);
      if (!snap.exists()) return;
      const current = { id: snap.id, ...snap.data() } as DutySwapRequest;
      if (!this.isPending(current) || !isDutySwapExpired(current.expiresAt)) return;
      transaction.update(requestRef, {
        status: 'EXPIRED',
        updatedAt: serverTimestamp(),
        updatedByUid: user.uid,
      });
      transaction.set(auditRef, this.auditPayload(request.id, 'EXPIRED', current.status, 'EXPIRED', 'Yêu cầu tự hết hạn.'));
    });
    return true;
  }

  async directReplace(sourceDate: string, outgoingStaffId: string, incomingStaffId: string, reason: string): Promise<void> {
    this.assertCanManage();
    const user = this.requireUser();
    if (!isDutyDateKey(sourceDate)) throw new Error('Ngày ca trực không hợp lệ.');
    if (outgoingStaffId === incomingStaffId) throw new Error('Người nhận ca phải khác người đang trực.');
    this.requireTargetStaff(incomingStaffId);
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_schedules`, sourceDate);
    await runTransaction(this.fb.db, async transaction => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) throw new Error('Ca trực không còn tồn tại.');
      const current = asDutyScheduleEntry(snap.id, snap.data());
      const nextStaffIds = replaceDutyStaffAtExactIndex(current.staffIds, outgoingStaffId, incomingStaffId);
      transaction.update(ref, {
        staffIds: nextStaffIds,
        updatedAt: serverTimestamp(),
        updatedByUid: user.uid,
      });
    });
    try {
      await this.activity.write(this.activity.build({
        action: 'UPDATE_DUTY_SCHEDULE',
        details: `Đổi ca trực tiếp ${sourceDate}: thay nhân sự tại đúng vị trí phân công. ${reason.trim().slice(0, 500)}`.trim(),
        targetType: 'DUTY_SCHEDULE',
        targetId: sourceDate,
        targetName: `Ca trực ${sourceDate}`,
        actionUrl: '/duty-stats',
        metadata: { directDutySwap: true },
      }));
    } catch (error) {
      console.warn('[DutySwap] Không ghi được activity cho đổi ca trực tiếp:', error);
    }
  }

  canTargetRespond(request: DutySwapRequest): boolean {
    const uid = this.auth.currentUser()?.uid;
    return Boolean(uid && request.targetUid === uid && request.status === 'PENDING_TARGET' && !isDutySwapExpired(request.expiresAt));
  }

  canRequesterCancel(request: DutySwapRequest): boolean {
    const uid = this.auth.currentUser()?.uid;
    return Boolean(uid && request.requesterUid === uid && this.isPending(request) && !isDutySwapExpired(request.expiresAt));
  }

  isPending(request: DutySwapRequest): boolean {
    return request.status === 'PENDING_TARGET' || request.status === 'PENDING_MANAGER';
  }

  private requireUser() {
    const user = this.auth.currentUser();
    if (!user) throw new Error('Cần đăng nhập để thao tác đổi ca.');
    return user;
  }

  private requireLinkedStaff(uid: string): DutyStaff {
    const staff = findLinkedDutyStaff(uid, this.duty.staff());
    if (!staff) throw new Error('Tài khoản của bạn chưa liên kết với nhân sự trực.');
    if (!staff.active) throw new Error('Nhân sự của bạn đang ngừng xếp lịch.');
    return staff;
  }

  private requireTargetStaff(staffId: string): DutyStaff {
    const staff = this.duty.staff().find(item => item.id === staffId && item.active);
    if (!staff) throw new Error('Không tìm thấy nhân sự nhận ca đang hoạt động.');
    return staff;
  }

  private assertPlannedMember(schedule: DutyScheduleEntry, staffId: string, message: string): void {
    if (schedule.status !== 'planned' || !schedule.staffIds.includes(staffId)) throw new Error(message);
  }

  private assertCanManage(): void {
    if (!this.duty.canManage()) throw new Error('Bạn không có quyền quản lý lịch trực.');
  }

  private auditPayload(
    requestId: string,
    action: DutySwapAuditEntry['action'],
    fromStatus: DutySwapRequestStatus | '',
    toStatus: DutySwapRequestStatus,
    details: string,
  ): Omit<DutySwapAuditEntry, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } {
    const user = this.requireUser();
    return {
      requestId,
      action,
      actorUid: user.uid,
      actorName: user.displayName || user.email,
      fromStatus,
      toStatus,
      details: details.trim().slice(0, 1000),
      createdAt: serverTimestamp(),
    };
  }

  private async bestEffortNotify(requestId: string, event: 'REQUESTED' | 'TARGET_ACCEPTED' | 'TARGET_REJECTED' | 'MANAGER_APPROVED' | 'MANAGER_REJECTED' | 'CANCELLED'): Promise<void> {
    try {
      await this.notifications.notifyDutySwap(requestId, event);
    } catch (error) {
      console.warn('[DutySwap] Trạng thái đã lưu nhưng chưa gửi được notification:', error);
    }
  }

  private async bestEffortManagerActivity(request: DutySwapRequest): Promise<void> {
    try {
      await this.activity.write(this.activity.build({
        action: 'UPDATE_DUTY_SCHEDULE',
        details: request.type === 'SWAP'
          ? `Đã duyệt đổi ca ${request.sourceDate} ↔ ${request.targetDate} giữa ${request.requesterName} và ${request.targetName}.`
          : `Đã duyệt ${request.targetName} trực hộ ${request.requesterName} ngày ${request.sourceDate}.`,
        targetType: 'DUTY_SWAP_REQUEST',
        targetId: request.id,
        targetName: `Yêu cầu đổi ca ${request.sourceDate}`,
        actionUrl: '/duty-stats',
        metadata: { dutySwapRequestId: request.id, dutySwapType: request.type },
      }));
    } catch (error) {
      console.warn('[DutySwap] Không ghi được activity sau phê duyệt:', error);
    }
  }

  private timestampMillis(value: unknown): number {
    if (value && typeof value === 'object' && 'toMillis' in value && typeof (value as { toMillis?: unknown }).toMillis === 'function') {
      return (value as { toMillis: () => number }).toMillis();
    }
    return 0;
  }
}
