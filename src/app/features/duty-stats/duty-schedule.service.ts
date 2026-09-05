import { Injectable, computed, inject, signal } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
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
import { ActivityEventService } from '../../core/services/activity-event.service';
import { NotificationCenterService } from '../../core/services/notification-center.service';
import type {
  DutyScheduleDraft,
  DutyScheduleEntry,
  DutyStaff,
  DutyStaffDraft,
} from './duty-schedule.model';
import {
  isDutyDateKey,
  normalizeDutyStaffName,
} from './duty-schedule.utils';
import { type DutyImportPlanRow } from './duty-tsv-import';
import { persistDutyMonthImport } from './duty-tsv-import.persistence';

type DutyComparableSchedule = Pick<
  DutyScheduleEntry,
  'date' | 'staffIds' | 'unresolvedAssignees' | 'needsVerification' | 'startTime' | 'status' | 'note' | 'source' | 'sourceAssignees'
>;

interface DutyScheduleChange {
  previous: DutyComparableSchedule | null;
  next: DutyComparableSchedule;
}

function sameStringArray(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

@Injectable({ providedIn: 'root' })
export class DutyScheduleService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly readMonitor = inject(FirestoreReadMonitor);
  private readonly notificationCenter = inject(NotificationCenterService);
  private readonly activityEvents = inject(ActivityEventService);

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

  async loadScheduleRange(start: string, end: string): Promise<DutyScheduleEntry[]> {
    if (!isDutyDateKey(start) || !isDutyDateKey(end) || start > end) {
      throw new Error('Khoảng ngày lịch trực không hợp lệ.');
    }
    const path = `artifacts/${this.fb.APP_ID}/duty_schedules`;
    const snapshot = await getDocs(query(
      collection(this.fb.db, path),
      where('date', '>=', start),
      where('date', '<=', end),
      orderBy('date'),
    ));
    this.readMonitor.record('getDocs', path, snapshot.size, { phase: 'history' });
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() } as DutyScheduleEntry));
  }

  async saveStaff(draft: DutyStaffDraft): Promise<string> {
    this.assertCanManage();
    const displayName = normalizeDutyStaffName(draft.displayName);
    if (!displayName) throw new Error('Tên nhân viên không được để trống.');

    const linkedUserUid = (draft.linkedUserUid || '').trim() || null;
    const note = (draft.note || '').trim().slice(0, 500);

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
    const unresolvedAssignees = (draft.unresolvedAssignees || [])
      .map(value => value.trim().replace(/\s+/g, ' ').slice(0, 100))
      .filter(Boolean)
      .slice(0, 50);
    if (staffIds.length + unresolvedAssignees.length === 0) {
      throw new Error('Ca trực phải có ít nhất một nhân viên hoặc vị trí cần xác minh.');
    }
    if (staffIds.length + unresolvedAssignees.length > 50) {
      throw new Error('Một ca trực không được quá 50 vị trí phân công.');
    }
    const missing = staffIds.filter(staffId => !this.staff().some(item => item.id === staffId));
    if (missing.length > 0) throw new Error('Ca trực có nhân viên không còn tồn tại trong danh mục.');

    const startTime = (draft.startTime || '18:00').trim();
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) {
      throw new Error('Giờ bắt đầu phải có dạng HH:mm.');
    }

    const user = this.auth.currentUser();
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_schedules`, draft.date);
    const change = await runTransaction(this.fb.db, async transaction => {
      const snapshot = await transaction.get(ref);
      if (draft.originalDate && !snapshot.exists()) {
        throw new Error('Ca trực này không còn tồn tại. Hãy tải lại dữ liệu.');
      }
      if (!draft.originalDate && snapshot.exists()) {
        throw new Error(`Ngày ${draft.date} đã có ca trực. Hãy mở ca đó để chỉnh sửa.`);
      }

      const current = snapshot.exists() ? snapshot.data() as Partial<DutyScheduleEntry> : undefined;
      const sourceAssignees = (draft.sourceAssignees ?? current?.sourceAssignees ?? '').trim().slice(0, 2000);
      const needsVerification = unresolvedAssignees.length > 0 || draft.needsVerification === true;
      const payload = {
        date: draft.date,
        staffIds,
        unresolvedAssignees,
        needsVerification,
        sourceAssignees,
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
      return {
        previous: snapshot.exists() ? this.comparableSchedule(snapshot.id, snapshot.data()) : null,
        next: this.comparableSchedule(draft.date, payload),
      } satisfies DutyScheduleChange;
    });
    await this.afterDutyScheduleChanges([change], 'single');
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

  async importMonthTsv(text: string, month: string, reviewed: readonly DutyImportPlanRow[], verificationText: string): Promise<{ created: number; replaced: number; kept: number }> {
    this.assertCanManage();
    const uid = this.auth.currentUser()?.uid;
    if (!uid) throw new Error('Cần đăng nhập để nhập lịch.');
    const result = await persistDutyMonthImport(this.fb.db, this.fb.APP_ID, uid, this.staff(), text, month, reviewed, verificationText);
    const changes = reviewed
      .filter(row => !row.previous || row.replace)
      .map(row => ({
        previous: row.previous ? this.comparableSchedule(row.previous.id, row.previous) : null,
        next: this.comparableSchedule(row.date, {
          date: row.date,
          staffIds: row.staffIds,
          unresolvedAssignees: row.unresolvedAssignees,
          needsVerification: row.unresolvedAssignees.length > 0 || row.warnings.length > 0,
          sourceAssignees: row.names.join(' | '),
          startTime: row.startTime,
          note: row.note,
          status: 'planned',
          source: 'import',
        }),
      } satisfies DutyScheduleChange));
    await this.afterDutyScheduleChanges(changes, 'month', month, result);
    return result;
  }

  async cancelSchedule(date: string): Promise<void> {
    this.assertCanManage();
    if (!isDutyDateKey(date)) throw new Error('Ngày trực không hợp lệ.');
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/duty_schedules`, date);
    const change = await runTransaction(this.fb.db, async transaction => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) throw new Error('Ca trực này không còn tồn tại. Hãy tải lại dữ liệu.');
      const previous = this.comparableSchedule(snapshot.id, snapshot.data());
      transaction.update(ref, {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
        updatedByUid: this.auth.currentUser()?.uid || '',
      });
      return {
        previous,
        next: { ...previous, status: 'cancelled' as const },
      } satisfies DutyScheduleChange;
    });
    await this.afterDutyScheduleChanges([change], 'single');
  }

  private comparableSchedule(id: string, value: Partial<DutyScheduleEntry> | Record<string, unknown>): DutyComparableSchedule {
    const data = value as Partial<DutyScheduleEntry>;
    return {
      date: data.date || id,
      staffIds: Array.isArray(data.staffIds) ? [...data.staffIds] : [],
      unresolvedAssignees: Array.isArray(data.unresolvedAssignees) ? [...data.unresolvedAssignees] : [],
      needsVerification: data.needsVerification === true,
      sourceAssignees: typeof data.sourceAssignees === 'string' ? data.sourceAssignees : '',
      startTime: typeof data.startTime === 'string' ? data.startTime : '18:00',
      status: data.status === 'cancelled' ? 'cancelled' : 'planned',
      note: typeof data.note === 'string' ? data.note : '',
      source: data.source === 'import' || data.source === 'batch' ? data.source : 'manual',
    };
  }

  private async afterDutyScheduleChanges(
    changes: readonly DutyScheduleChange[],
    mode: 'single' | 'month',
    month?: string,
    importResult?: { created: number; replaced: number; kept: number },
  ): Promise<void> {
    if (!changes.length) return;

    await Promise.all([
      this.publishDutyNotifications(changes, mode, month),
      this.writeDutyActivity(changes, mode, month, importResult),
    ]);
  }

  private async publishDutyNotifications(
    changes: readonly DutyScheduleChange[],
    mode: 'single' | 'month',
    month?: string,
  ): Promise<void> {
    const staff = this.staff();
    const personById = new Map(staff.map(person => [person.id, person]));
    interface RecipientChange {
      kind: 'added' | 'updated' | 'removed' | 'cancelled';
      schedule: DutyComparableSchedule;
    }
    const recipients = new Map<string, { displayName: string; items: RecipientChange[] }>();

    const addRecipient = (staffId: string, item: RecipientChange) => {
      const person = personById.get(staffId);
      const uid = person?.linkedUserUid?.trim();
      if (!person || !uid) return;
      const bucket = recipients.get(uid) || { displayName: person.displayName, items: [] };
      bucket.items.push(item);
      recipients.set(uid, bucket);
    };

    for (const change of changes) {
      const oldIds = change.previous?.status === 'planned' ? change.previous.staffIds : [];
      const newIds = change.next.status === 'planned' ? change.next.staffIds : [];
      const oldSet = new Set(oldIds);
      const newSet = new Set(newIds);
      const teamChanged = !sameStringArray(oldIds, newIds)
        || !sameStringArray(change.previous?.unresolvedAssignees || [], change.next.unresolvedAssignees || []);
      const timeChanged = Boolean(change.previous && change.previous.startTime !== change.next.startTime);
      const restored = change.previous?.status === 'cancelled' && change.next.status === 'planned';

      for (const staffId of newIds) {
        if (!oldSet.has(staffId) || restored) addRecipient(staffId, { kind: 'added', schedule: change.next });
        else if (teamChanged || timeChanged) addRecipient(staffId, { kind: 'updated', schedule: change.next });
      }
      for (const staffId of oldIds) {
        if (newSet.has(staffId)) continue;
        addRecipient(staffId, {
          kind: change.next.status === 'cancelled' ? 'cancelled' : 'removed',
          schedule: change.next,
        });
      }
    }

    const publishes = [...recipients.entries()].map(([uid, recipient]) => {
      const onlyCancelled = recipient.items.every(item => item.kind === 'cancelled');
      const onlyAdded = recipient.items.every(item => item.kind === 'added');
      const notificationType = onlyCancelled
        ? 'DUTY_ASSIGNMENT_CANCELLED' as const
        : (onlyAdded ? 'DUTY_SCHEDULE_PUBLISHED' as const : 'DUTY_ASSIGNMENT_CHANGED' as const);
      const monthLabel = month ? `${month.slice(5, 7)}/${month.slice(0, 4)}` : '';
      const title = mode === 'month'
        ? `Lịch trực ${monthLabel} của ${recipient.displayName}`
        : this.singleDutyNotificationTitle(recipient.displayName, recipient.items[0]?.kind);
      const message = this.buildDutyRecipientMessage(recipient.displayName, recipient.items, personById, mode);
      return this.notificationCenter.publish({
        recipientUid: uid,
        type: notificationType,
        module: 'DUTY',
        title,
        message,
        actionUrl: '/duty-stats',
        actionLabel: 'Xem lịch trực',
        channels: ['inbox', 'push'],
      });
    });

    const verificationChanges = changes.filter(change =>
      change.next.needsVerification === true && (
        change.previous?.needsVerification !== true
        || !sameStringArray(change.previous?.unresolvedAssignees || [], change.next.unresolvedAssignees || [])
        || change.previous?.note !== change.next.note
      )
    );
    if (verificationChanges.length) {
      const dates = verificationChanges.map(change => this.formatDutyDate(change.next.date)).join(', ');
      const unresolved = verificationChanges.reduce((sum, change) => sum + (change.next.unresolvedAssignees?.length || 0), 0);
      publishes.push(this.notificationCenter.publish({
        recipientUid: 'role:duty-manager',
        type: 'DUTY_VERIFICATION_REQUIRED',
        module: 'DUTY',
        title: `${verificationChanges.length} ca trực cần xác minh`,
        message: `${dates}. ${unresolved} vị trí chưa xác định. Mở Lịch trực để kiểm tra thông tin nguồn và cập nhật khi có xác nhận chính thức.`,
        actionUrl: '/duty-stats',
        actionLabel: 'Xử lý lịch cần xác minh',
        channels: ['inbox', 'push'],
      }));
    }

    await Promise.all(publishes);
  }

  private buildDutyRecipientMessage(
    displayName: string,
    items: readonly { kind: 'added' | 'updated' | 'removed' | 'cancelled'; schedule: DutyComparableSchedule }[],
    personById: ReadonlyMap<string, DutyStaff>,
    mode: 'single' | 'month',
  ): string {
    const lines = items.slice(0, 6).map(item => {
      const status = item.kind === 'added' ? 'được phân công'
        : item.kind === 'updated' ? 'đã cập nhật'
          : item.kind === 'cancelled' ? 'đã hủy'
            : 'đã bỏ phân công';
      const names = item.schedule.staffIds
        .map(id => personById.get(id)?.displayName || `[${id}]`)
        .concat(item.schedule.unresolvedAssignees || [])
        .join(' · ');
      return `${this.formatDutyDate(item.schedule.date)} ${item.schedule.startTime} — ${status} — ${names || 'Chưa xác định'}`;
    });
    const more = items.length > lines.length ? `; và ${items.length - lines.length} ca khác` : '';
    const prefix = mode === 'month'
      ? `${displayName}: lịch trực của bạn vừa được cập nhật (${items.length} thay đổi). `
      : `${displayName}: `;
    return `${prefix}${lines.join('; ')}${more}`.slice(0, 3900);
  }

  private singleDutyNotificationTitle(displayName: string, kind?: 'added' | 'updated' | 'removed' | 'cancelled'): string {
    if (kind === 'added') return `Ca trực mới của ${displayName}`;
    if (kind === 'cancelled') return `Ca trực của ${displayName} đã hủy`;
    return `Lịch trực của ${displayName} đã thay đổi`;
  }

  private formatDutyDate(date: string): string {
    return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
  }

  private async writeDutyActivity(
    changes: readonly DutyScheduleChange[],
    mode: 'single' | 'month',
    month?: string,
    importResult?: { created: number; replaced: number; kept: number },
  ): Promise<void> {
    try {
      const action = mode === 'month' ? 'IMPORT_DUTY_SCHEDULE' : 'UPDATE_DUTY_SCHEDULE';
      const details = mode === 'month'
        ? `Đã nhập lịch trực tháng ${month || changes[0].next.date.slice(0, 7)}: ${importResult?.created || 0} ca mới, ${importResult?.replaced || 0} ca thay thế, ${importResult?.kept || 0} ca giữ nguyên.`
        : `Đã cập nhật ca trực ${this.formatDutyDate(changes[0].next.date)} lúc ${changes[0].next.startTime}.`;
      await this.activityEvents.write(this.activityEvents.build({
        action,
        details,
        targetType: mode === 'month' ? 'DUTY_MONTH' : 'DUTY_SCHEDULE',
        targetId: mode === 'month' ? (month || changes[0].next.date.slice(0, 7)) : changes[0].next.date,
        targetName: mode === 'month' ? `Lịch trực ${month || changes[0].next.date.slice(0, 7)}` : `Ca trực ${changes[0].next.date}`,
        actionUrl: '/duty-stats',
        metadata: {
          changedSchedules: changes.length,
          verificationSchedules: changes.filter(change => change.next.needsVerification === true).length,
        },
      }));
    } catch (error) {
      console.warn('[DutySchedule] Không ghi được Activity event sau khi lịch đã lưu:', error);
    }
  }

  private assertCanManage(): void {
    if (!this.canManage()) throw new Error('Bạn không có quyền quản lý lịch trực.');
  }
}
