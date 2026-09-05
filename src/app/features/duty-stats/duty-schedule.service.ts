import { Injectable, computed, inject, signal } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import type { UserProfile } from '../../core/services/auth.service';
import { AuthService, PERMISSIONS } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
import type {
  DutyScheduleDraft,
  DutyScheduleEntry,
  DutyStaff,
  DutyStaffDraft,
} from './duty-schedule.model';
import {
  isDutyDateKey,
  normalizeDutyStaffCode,
  normalizeDutyStaffName,
} from './duty-schedule.utils';

@Injectable({ providedIn: 'root' })
export class DutyScheduleService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly readMonitor = inject(FirestoreReadMonitor);

  readonly staff = signal<DutyStaff[]>([]);
  readonly schedules = signal<DutyScheduleEntry[]>([]);
  readonly accounts = signal<UserProfile[]>([]);
  readonly loadingStaff = signal(false);
  readonly loadingSchedules = signal(false);
  readonly loadingAccounts = signal(false);
  readonly error = signal<string | null>(null);
  readonly activeRange = signal<{ start: string; end: string } | null>(null);

  readonly canManage = computed(() =>
    this.auth.currentUser()?.role === 'manager'
      || this.auth.hasPermission(PERMISSIONS.DUTY_MANAGE)
  );

  private staffUnsubscribe?: Unsubscribe;
  private scheduleUnsubscribe?: Unsubscribe;
  private rangeKey = '';

  ensureStaffListener(): void {
    if (this.staffUnsubscribe) return;
    const path = `artifacts/${this.fb.APP_ID}/duty_staff`;
    this.loadingStaff.set(true);
    let firstSnapshot = true;
    this.staffUnsubscribe = onSnapshot(
      query(collection(this.fb.db, path), orderBy('displayName')),
      snapshot => {
        this.readMonitor.record(
          'onSnapshot',
          path,
          firstSnapshot
            ? snapshot.size
            : snapshot.docChanges().filter(change => change.type !== 'removed').length,
          { phase: firstSnapshot ? 'initial' : 'delta', fromCache: snapshot.metadata.fromCache },
        );
        firstSnapshot = false;
        this.staff.set(snapshot.docs.map(item => ({
          id: item.id,
          ...item.data(),
        } as DutyStaff)).sort((a, b) => a.displayName.localeCompare(b.displayName, 'vi')));
        this.loadingStaff.set(false);
        this.error.set(null);
      },
      error => {
        this.loadingStaff.set(false);
        this.error.set(error.message || 'Không thể tải danh sách nhân sự trực.');
      },
    );
  }

  watchRange(start: string, end: string): void {
    if (!isDutyDateKey(start) || !isDutyDateKey(end) || start > end) {
      throw new Error('Khoảng ngày lịch trực không hợp lệ.');
    }

    this.ensureStaffListener();
    const nextKey = `${start}|${end}`;
    if (nextKey === this.rangeKey && this.scheduleUnsubscribe) return;

    this.scheduleUnsubscribe?.();
    this.scheduleUnsubscribe = undefined;
    this.rangeKey = nextKey;
    this.activeRange.set({ start, end });
    this.schedules.set([]);
    this.loadingSchedules.set(true);
    this.error.set(null);

    const path = `artifacts/${this.fb.APP_ID}/duty_schedules`;
    const scheduleQuery = query(
      collection(this.fb.db, path),
      where('date', '>=', start),
      where('date', '<=', end),
      orderBy('date'),
    );
    let firstSnapshot = true;
    this.scheduleUnsubscribe = onSnapshot(
      scheduleQuery,
      snapshot => {
        this.readMonitor.record(
          'onSnapshot',
          path,
          firstSnapshot
            ? snapshot.size
            : snapshot.docChanges().filter(change => change.type !== 'removed').length,
          { phase: firstSnapshot ? 'initial' : 'delta', fromCache: snapshot.metadata.fromCache },
        );
        firstSnapshot = false;
        this.schedules.set(snapshot.docs.map(item => ({
          id: item.id,
          ...item.data(),
        } as DutyScheduleEntry)));
        this.loadingSchedules.set(false);
        this.error.set(null);
      },
      error => {
        this.loadingSchedules.set(false);
        this.error.set(error.message || 'Không thể tải lịch trực.');
      },
    );
  }

  stopRangeListener(): void {
    this.scheduleUnsubscribe?.();
    this.scheduleUnsubscribe = undefined;
    this.rangeKey = '';
    this.activeRange.set(null);
    this.loadingSchedules.set(false);
  }

  stopAllListeners(): void {
    this.stopRangeListener();
    this.staffUnsubscribe?.();
    this.staffUnsubscribe = undefined;
    this.loadingStaff.set(false);
  }

  async loadAccounts(forceRefresh = false): Promise<UserProfile[]> {
    if (!forceRefresh && this.accounts().length > 0) return this.accounts();
    this.loadingAccounts.set(true);
    try {
      const users = await this.fb.getAllUsers(forceRefresh);
      const sorted = [...users].sort((a, b) =>
        (a.displayName || a.email).localeCompare(b.displayName || b.email, 'vi'),
      );
      this.accounts.set(sorted);
      return sorted;
    } finally {
      this.loadingAccounts.set(false);
    }
  }

  async loadScheduleDates(dateKeys: readonly string[]): Promise<DutyScheduleEntry[]> {
    const uniqueDates = [...new Set(dateKeys.filter(isDutyDateKey))];
    if (uniqueDates.length === 0) return [];
    const path = `artifacts/${this.fb.APP_ID}/duty_schedules`;
    const snapshots = await Promise.all(uniqueDates.map(async dateKey => {
      const ref = doc(this.fb.db, path, dateKey);
      const snapshot = await getDoc(ref);
      this.readMonitor.record('getDoc', `${path}/${dateKey}`, snapshot.exists() ? 1 : 0);
      return snapshot;
    }));
    return snapshots
      .filter(snapshot => snapshot.exists())
      .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as DutyScheduleEntry));
  }

  async saveStaff(draft: DutyStaffDraft): Promise<string> {
    this.assertCanManage();
    const displayName = normalizeDutyStaffName(draft.displayName);
    if (!displayName) throw new Error('Tên nhân viên không được để trống.');

    const employeeCode = normalizeDutyStaffCode(draft.employeeCode);
    const linkedUserUid = (draft.linkedUserUid || '').trim() || null;
    const note = (draft.note || '').trim().slice(0, 500);
    const duplicateCode = employeeCode && this.staff().find(item =>
      item.id !== draft.id && normalizeDutyStaffCode(item.employeeCode) === employeeCode,
    );
    if (duplicateCode) {
      throw new Error(`Mã nhân viên ${employeeCode} đã được dùng cho ${duplicateCode.displayName}.`);
    }

    const duplicateLink = linkedUserUid && this.staff().find(item =>
      item.id !== draft.id && item.linkedUserUid === linkedUserUid,
    );
    if (duplicateLink) {
      throw new Error(`Tài khoản LIMS này đang được gán cho ${duplicateLink.displayName}.`);
    }

    const user = this.auth.currentUser();
    const path = `artifacts/${this.fb.APP_ID}/duty_staff`;
    const ref = draft.id
      ? doc(this.fb.db, path, draft.id)
      : doc(collection(this.fb.db, path));
    const payload: Record<string, unknown> = {
      displayName,
      employeeCode,
      linkedUserUid,
      active: draft.active !== false,
      note,
      updatedAt: serverTimestamp(),
      updatedByUid: user?.uid || '',
    };
    if (!draft.id) {
      payload['createdAt'] = serverTimestamp();
      payload['createdByUid'] = user?.uid || '';
    }
    await setDoc(ref, payload, { merge: Boolean(draft.id) });
    return ref.id;
  }

  async setStaffActive(staffId: string, active: boolean): Promise<void> {
    this.assertCanManage();
    const person = this.staff().find(item => item.id === staffId);
    if (!person) throw new Error('Không tìm thấy nhân viên cần cập nhật.');
    await updateDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_staff`, staffId), {
      active,
      updatedAt: serverTimestamp(),
      updatedByUid: this.auth.currentUser()?.uid || '',
    });
  }

  async saveSchedule(draft: DutyScheduleDraft): Promise<void> {
    this.assertCanManage();
    if (!isDutyDateKey(draft.date)) throw new Error('Ngày trực không hợp lệ.');
    if (draft.originalDate && draft.originalDate !== draft.date) {
      throw new Error('Không thể đổi ngày của ca trực đã tạo. Hãy hủy ca cũ và tạo ca mới.');
    }
    const staffIds = [...new Set((draft.staffIds || []).filter(Boolean))];
    if (staffIds.length === 0) throw new Error('Ca trực phải có ít nhất một nhân viên.');
    const missing = staffIds.filter(staffId => !this.staff().some(item => item.id === staffId));
    if (missing.length > 0) throw new Error('Ca trực có nhân viên không còn tồn tại trong danh mục.');

    const startTime = (draft.startTime || '18:00').trim();
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) {
      throw new Error('Giờ bắt đầu phải có dạng HH:mm.');
    }

    const user = this.auth.currentUser();
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_schedules`, draft.date);
    await runTransaction(this.fb.db, async transaction => {
      const snapshot = await transaction.get(ref);
      if (draft.originalDate && !snapshot.exists()) {
        throw new Error('Ca trực này không còn tồn tại. Hãy tải lại dữ liệu.');
      }
      if (!draft.originalDate && snapshot.exists()) {
        throw new Error(`Ngày ${draft.date} đã có ca trực. Hãy mở ca đó để chỉnh sửa.`);
      }

      const current = snapshot.exists() ? snapshot.data() as Partial<DutyScheduleEntry> : undefined;
      const payload = {
        date: draft.date,
        staffIds,
        startTime,
        status: draft.status || 'planned',
        note: (draft.note || '').trim().slice(0, 1000),
        source: draft.source || current?.source || 'manual',
        updatedAt: serverTimestamp(),
        updatedByUid: user?.uid || '',
      };

      if (snapshot.exists()) {
        transaction.update(ref, payload);
      } else {
        transaction.set(ref, {
          ...payload,
          createdAt: serverTimestamp(),
          createdByUid: user?.uid || '',
        });
      }
    });
  }

  async createMonthSkeleton(
    dateKeys: readonly string[],
    startTime = '18:00',
  ): Promise<{ created: number; skipped: number }> {
    this.assertCanManage();
    const uniqueDates = [...new Set(dateKeys)];
    if (uniqueDates.length === 0) return { created: 0, skipped: 0 };
    if (uniqueDates.length > 31 || uniqueDates.some(dateKey => !isDutyDateKey(dateKey))) {
      throw new Error('Danh sách ngày tạo khung lịch trực không hợp lệ.');
    }
    const monthKey = uniqueDates[0].slice(0, 7);
    if (uniqueDates.some(dateKey => dateKey.slice(0, 7) !== monthKey)) {
      throw new Error('Chỉ có thể tạo khung ca trong cùng một tháng.');
    }
    const normalizedStartTime = startTime.trim();
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(normalizedStartTime)) {
      throw new Error('Giờ bắt đầu phải có dạng HH:mm.');
    }

    const user = this.auth.currentUser();
    const basePath = `artifacts/${this.fb.APP_ID}/duty_schedules`;
    const refs = uniqueDates.map(dateKey => doc(this.fb.db, basePath, dateKey));
    return runTransaction(this.fb.db, async transaction => {
      const snapshots = await Promise.all(refs.map(ref => transaction.get(ref)));
      let created = 0;
      let skipped = 0;

      snapshots.forEach((snapshot, index) => {
        if (snapshot.exists()) {
          skipped += 1;
          return;
        }
        const date = uniqueDates[index];
        transaction.set(refs[index], {
          date,
          staffIds: [],
          startTime: normalizedStartTime,
          status: 'planned',
          note: '',
          source: 'batch',
          createdAt: serverTimestamp(),
          createdByUid: user?.uid || '',
          updatedAt: serverTimestamp(),
          updatedByUid: user?.uid || '',
        });
        created += 1;
      });

      return { created, skipped };
    });
  }

  async cancelSchedule(date: string): Promise<void> {
    this.assertCanManage();
    if (!isDutyDateKey(date)) throw new Error('Ngày trực không hợp lệ.');
    await updateDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_schedules`, date), {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
      updatedByUid: this.auth.currentUser()?.uid || '',
    });
  }

  private assertCanManage(): void {
    if (!this.canManage()) throw new Error('Bạn không có quyền quản lý lịch trực.');
  }
}
