import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { collection, getCountFromServer } from 'firebase/firestore';
import { PERMISSIONS, AuthService } from '../../../core/services/auth.service';
import { BackupService, type BackupListItem, type BackupStatusResponse } from '../../../core/services/backup.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { StateService } from '../../../core/services/state.service';

type MasterCounts = {
  analytes: number;
  targetGroups: number;
  matrices: number;
  sampleDescriptions: number;
  devices: number;
};

@Component({
  selector: 'app-manager-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-5 fade-in">
      <section class="rounded-2xl bg-white p-5 shadow-soft-xl dark:bg-slate-900 sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-soft text-white shadow-soft-md">
                <i class="fa-solid fa-gauge-high"></i>
              </span>
              <div>
                <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Tổng quan quản trị</h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Ưu tiên các việc cần xử lý thay vì lặp lại menu điều hướng.</p>
              </div>
            </div>
          </div>
          @if (loading()) {
            <span class="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <i class="fa-solid fa-spinner fa-spin"></i>Đang tổng hợp trạng thái
            </span>
          } @else if (actionCount() === 0) {
            <span class="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <i class="fa-solid fa-circle-check"></i>Hệ thống vận hành bình thường · Không có việc tồn đọng
            </span>
          } @else {
            <span class="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              <i class="fa-solid fa-triangle-exclamation"></i>{{ actionCount() }} việc cần chú ý
            </span>
          }
        </div>
      </section>

      @if (actionCount() > 0) {
        <section class="grid gap-3 lg:grid-cols-2">
          @if (canManageUsers() && userSummaryAvailable() === false) {
            <a routerLink="/settings/access/users" class="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 transition hover:-translate-y-0.5 hover:shadow-soft-md dark:border-rose-900/50 dark:bg-rose-950/20">
              <div class="flex items-start gap-3">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300"><i class="fa-solid fa-users-slash"></i></span>
                <div><div class="text-xs font-black text-rose-800 dark:text-rose-300">Không đọc được trạng thái người dùng</div><div class="mt-1 text-[11px] text-rose-700/70 dark:text-rose-300/70">Không dùng số 0 thay cho dữ liệu bị lỗi. Mở module để tải lại và kiểm tra quyền truy cập.</div></div>
              </div>
              <span class="shrink-0 text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">Kiểm tra <i class="fa-solid fa-arrow-right ml-1"></i></span>
            </a>
          } @else if (canManageUsers() && pendingUsers() > 0) {
            <a routerLink="/settings/access/users" class="flex items-start justify-between gap-4 rounded-2xl border border-orange-200 bg-orange-50/80 p-4 transition hover:-translate-y-0.5 hover:shadow-soft-md dark:border-orange-900/50 dark:bg-orange-950/20">
              <div class="flex items-start gap-3">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300"><i class="fa-solid fa-user-clock"></i></span>
                <div><div class="text-xs font-black text-orange-800 dark:text-orange-300">{{pendingUsers()}} tài khoản đang chờ duyệt</div><div class="mt-1 text-[11px] text-orange-700/70 dark:text-orange-300/70">Mở danh sách người dùng để gán vai trò hoặc từ chối quyền truy cập.</div></div>
              </div>
              <span class="shrink-0 text-[10px] font-black uppercase tracking-wider text-orange-700 dark:text-orange-300">Xử lý <i class="fa-solid fa-arrow-right ml-1"></i></span>
            </a>
          }

          @if (canManageSystem() && state.maintenanceMode()) {
            <a routerLink="/settings/system" class="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 transition hover:-translate-y-0.5 hover:shadow-soft-md dark:border-rose-900/50 dark:bg-rose-950/20">
              <div class="flex items-start gap-3">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300"><i class="fa-solid fa-person-digging"></i></span>
                <div><div class="text-xs font-black text-rose-800 dark:text-rose-300">Chế độ bảo trì đang BẬT</div><div class="mt-1 text-[11px] text-rose-700/70 dark:text-rose-300/70">Người dùng không có quyền bypass maintenance đang bị chặn truy cập.</div></div>
              </div>
              <span class="shrink-0 text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">Xem cấu hình <i class="fa-solid fa-arrow-right ml-1"></i></span>
            </a>
          }

          @if (hasBackupAccess() && backupNeedsAttention()) {
            <a routerLink="/settings/data/backups" class="flex items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 transition hover:-translate-y-0.5 hover:shadow-soft-md dark:border-amber-900/50 dark:bg-amber-950/20">
              <div class="flex items-start gap-3">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300"><i class="fa-solid fa-cloud-arrow-up"></i></span>
                <div><div class="text-xs font-black text-amber-800 dark:text-amber-300">Backup cần chú ý</div><div class="mt-1 text-[11px] text-amber-700/70 dark:text-amber-300/70">{{ backupAttentionText() }}</div></div>
              </div>
              <span class="shrink-0 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">Kiểm tra <i class="fa-solid fa-arrow-right ml-1"></i></span>
            </a>
          }

          @if (canManageMasterData() && masterDataSummaryAvailable() === false) {
            <a routerLink="/settings/data/master/analytes" class="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 transition hover:-translate-y-0.5 hover:shadow-soft-md dark:border-rose-900/50 dark:bg-rose-950/20">
              <div class="flex items-start gap-3">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300"><i class="fa-solid fa-database"></i></span>
                <div><div class="text-xs font-black text-rose-800 dark:text-rose-300">Không đọc được số liệu dữ liệu nền</div><div class="mt-1 text-[11px] text-rose-700/70 dark:text-rose-300/70">Số đếm đang ở trạng thái không khả dụng, không được diễn giải thành dữ liệu rỗng.</div></div>
              </div>
              <span class="shrink-0 text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">Kiểm tra <i class="fa-solid fa-arrow-right ml-1"></i></span>
            </a>
          }
        </section>
      }

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        @if (canManageUsers()) {
          <a routerLink="/settings/access/users" class="rounded-2xl bg-white p-4 shadow-soft-xl transition hover:-translate-y-0.5 dark:bg-slate-900">
            <div class="flex items-center justify-between"><span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Người dùng</span><i class="fa-solid fa-users text-fuchsia-500"></i></div>
            @if (userSummaryAvailable() === false) {
              <div class="mt-2 text-sm font-black text-rose-600">Không khả dụng</div>
              <div class="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Không thể đọc danh sách người dùng/vai trò.</div>
            } @else {
              <div class="mt-2 text-2xl font-black text-slate-800 dark:text-slate-100">{{ userCount() }}</div>
              <div class="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{{ roleCount() }} vai trò · {{ customPermissionUsers() }} tài khoản có quyền cấp riêng</div>
            }
          </a>
        }

        @if (hasBackupAccess()) {
          <a routerLink="/settings/data/backups" class="rounded-2xl bg-white p-4 shadow-soft-xl transition hover:-translate-y-0.5 dark:bg-slate-900">
            <div class="flex items-center justify-between"><span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Backup</span><i class="fa-solid fa-shield-halved text-emerald-500"></i></div>
            <div class="mt-2 text-sm font-black text-slate-800 dark:text-slate-100">{{ latestBackup() ? backupDate(latestBackup()?.completedAt || latestBackup()?.createdTime) : 'Chưa có bản sao lưu' }}</div>
            <div class="mt-1 text-[11px] font-semibold" [class.text-emerald-600]="latestBackup()?.verified" [class.text-amber-600]="!latestBackup()?.verified">{{ latestBackup()?.verified ? 'Integrity: Đạt' : 'Integrity: Chưa xác nhận' }}</div>
          </a>
        }

        @if (canManageSystem()) {
          <a routerLink="/settings/system" class="rounded-2xl bg-white p-4 shadow-soft-xl transition hover:-translate-y-0.5 dark:bg-slate-900">
            <div class="flex items-center justify-between"><span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Hệ thống</span><i class="fa-solid fa-server text-blue-500"></i></div>
            <div class="mt-2 text-lg font-black" [class.text-emerald-600]="!state.maintenanceMode()" [class.text-rose-600]="state.maintenanceMode()">{{ state.maintenanceMode() ? 'Maintenance' : 'Operational' }}</div>
            <div class="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">v{{state.systemVersion()}} · {{ state.maintenanceScheduledTime() ? 'Có lịch bảo trì' : 'Không có lịch bảo trì' }}</div>
          </a>
        }

        @if (canManageMasterData()) {
          <a routerLink="/settings/data/master/analytes" class="rounded-2xl bg-white p-4 shadow-soft-xl transition hover:-translate-y-0.5 dark:bg-slate-900">
            <div class="flex items-center justify-between"><span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Dữ liệu nền</span><i class="fa-solid fa-layer-group text-teal-500"></i></div>
            @if (masterDataSummaryAvailable() === false) {
              <div class="mt-2 text-sm font-black text-rose-600">Không khả dụng</div>
              <div class="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Không thể đọc số đếm dữ liệu nền.</div>
            } @else {
              <div class="mt-2 text-2xl font-black text-slate-800 dark:text-slate-100">{{ masterCounts().analytes }}</div>
              <div class="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">chỉ tiêu · {{masterCounts().targetGroups}} nhóm · {{masterCounts().matrices}} nền mẫu · {{masterCounts().devices}} thiết bị</div>
            }
          </a>
        }
      </section>

      <section class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/70">
        <div class="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <span class="mr-1 uppercase tracking-wider text-slate-400">Phạm vi quản trị hiện có:</span>
          @if (canManageSystem()) { <span class="rounded-lg bg-white px-2 py-1 dark:bg-slate-800">Hệ thống</span> }
          @if (canManageMasterData()) { <span class="rounded-lg bg-white px-2 py-1 dark:bg-slate-800">Dữ liệu nền</span> }
          @if (canManageUsers()) { <span class="rounded-lg bg-white px-2 py-1 dark:bg-slate-800">Người dùng & quyền</span> }
          @if (hasBackupAccess()) { <span class="rounded-lg bg-white px-2 py-1 dark:bg-slate-800">Backup</span> }
          @if (canManagePolicy()) { <span class="rounded-lg bg-white px-2 py-1 dark:bg-slate-800">Chính sách hao hụt</span> }
        </div>
      </section>
    </div>
  `,
})
export class ManagerSettingsComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly fb = inject(FirebaseService);
  readonly state = inject(StateService);
  readonly backupService = inject(BackupService);

  readonly loading = signal(true);
  readonly pendingUsers = signal(0);
  readonly userCount = signal(0);
  readonly roleCount = signal(0);
  readonly customPermissionUsers = signal(0);
  readonly userSummaryAvailable = signal<boolean | null>(null);
  readonly backupStatus = signal<BackupStatusResponse | null>(null);
  readonly latestBackup = signal<BackupListItem | null>(null);
  readonly backupSummaryAvailable = signal<boolean | null>(null);
  readonly masterCounts = signal<MasterCounts>({ analytes: 0, targetGroups: 0, matrices: 0, sampleDescriptions: 0, devices: 0 });
  readonly masterDataSummaryAvailable = signal<boolean | null>(null);

  readonly actionCount = computed(() =>
    (this.canManageUsers() && (this.userSummaryAvailable() === false || this.pendingUsers() > 0) ? 1 : 0) +
    (this.canManageSystem() && this.state.maintenanceMode() ? 1 : 0) +
    (this.hasBackupAccess() && this.backupNeedsAttention() ? 1 : 0) +
    (this.canManageMasterData() && this.masterDataSummaryAvailable() === false ? 1 : 0),
  );

  async ngOnInit(): Promise<void> {
    const tasks: Promise<unknown>[] = [];
    if (this.canManageUsers()) tasks.push(this.loadWithAvailability(() => this.loadAccessSummary(), this.userSummaryAvailable));
    if (this.hasBackupAccess()) tasks.push(this.loadWithAvailability(() => this.loadBackupSummary(), this.backupSummaryAvailable));
    if (this.canManageMasterData()) tasks.push(this.loadWithAvailability(() => this.loadMasterCounts(), this.masterDataSummaryAvailable));
    await Promise.all(tasks);
    this.loading.set(false);
  }

  canManageUsers(): boolean { return this.auth.hasPermission(PERMISSIONS.USER_MANAGE); }
  canManageSystem(): boolean { return this.auth.hasPermission(PERMISSIONS.SYSTEM_MANAGE); }
  canManageMasterData(): boolean { return this.auth.hasPermission(PERMISSIONS.MASTER_DATA_MANAGE); }
  canManagePolicy(): boolean { return this.auth.hasPermission(PERMISSIONS.POLICY_MANAGE); }
  hasBackupAccess(): boolean {
    return this.auth.hasPermission(PERMISSIONS.BACKUP_CREATE) || this.auth.hasPermission(PERMISSIONS.BACKUP_VERIFY) || this.auth.hasPermission(PERMISSIONS.BACKUP_RESTORE);
  }

  backupNeedsAttention(): boolean {
    if (this.backupSummaryAvailable() === false) return true;
    const status = this.backupStatus();
    const latest = this.latestBackup();
    return status === null || !status.ready || latest === null || !latest.verified;
  }

  backupAttentionText(): string {
    if (this.backupSummaryAvailable() === false || !this.backupStatus()) return 'Không đọc được trạng thái backup.';
    if (!this.backupStatus()?.ready) return 'Hạ tầng backup chưa sẵn sàng.';
    if (!this.latestBackup()) return 'Chưa có bản sao lưu hoàn tất.';
    if (!this.latestBackup()?.verified) return 'Bản sao lưu gần nhất chưa đạt hoặc chưa chạy integrity check.';
    return 'Cần kiểm tra trạng thái backup.';
  }

  backupDate(value?: string | null): string {
    if (!value) return 'Chưa ghi nhận';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Chưa ghi nhận' : date.toLocaleString('vi-VN');
  }

  private async loadAccessSummary(): Promise<void> {
    const [users, roles] = await Promise.all([this.fb.getAllUsers(false), this.fb.getRolesConfig(true)]);
    this.userCount.set(users.length);
    this.pendingUsers.set(users.filter(user => user.role === 'pending').length);
    this.customPermissionUsers.set(users.filter(user => (user.customPermissions?.length || 0) > 0).length);
    this.roleCount.set(roles.length);
  }

  private async loadBackupSummary(): Promise<void> {
    const [status, list] = await Promise.all([this.backupService.getStatus(), this.backupService.listBackups()]);
    this.backupStatus.set(status);
    this.latestBackup.set(list.backups[0] || null);
  }

  private async loadMasterCounts(): Promise<void> {
    const base = `artifacts/${this.fb.APP_ID}`;
    const names: Array<[keyof MasterCounts, string]> = [
      ['analytes', 'master_analytes'],
      ['targetGroups', 'target_groups'],
      ['matrices', 'matrix_types'],
      ['sampleDescriptions', 'sample_description_master'],
      ['devices', 'master_devices'],
    ];
    const results = await Promise.all(names.map(async ([key, collectionName]) => {
      const snapshot = await getCountFromServer(collection(this.fb.db, `${base}/${collectionName}`));
      return [key, snapshot.data().count] as const;
    }));
    this.masterCounts.set(Object.fromEntries(results) as MasterCounts);
  }

  private async loadWithAvailability(
    loader: () => Promise<void>,
    availability: { set(value: boolean): void },
  ): Promise<void> {
    try {
      await loader();
      availability.set(true);
    } catch {
      availability.set(false);
    }
  }
}
