import { Component, inject, signal, OnInit, OnDestroy, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../core/services/firebase.service';
import { ToastService } from '../../../core/services/toast.service';
import { StateService } from '../../../core/services/state.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { CategoryItem, PrintConfig } from '../../../core/models/config.model';
import { InventoryService } from '../../inventory/inventory.service';
import { StandardService } from '../../standards/standard.service';
import { collection, getDocs, writeBatch, doc, query, where, onSnapshot, deleteDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { NotificationCenterService } from '../../../core/services/notification-center.service';
import { BackupService, type BackupListItem, type BackupStatusResponse, type BackupCreateResponse, type BackupVerificationResponse, type RestoreResponse, type RestoreCheckpointListItem } from '../../../core/services/backup.service';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { validateCategoriesDraft } from '../../settings/settings-validation.utils';

@Component({
  selector: 'app-config-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AppButtonComponent, AppModalShellComponent],
  templateUrl: './config-general.component.html'
})
export class ConfigGeneralComponent implements OnInit, OnDestroy {
  readonly view = input.required<'system' | 'master' | 'backup' | 'data' | 'diagnostics'>();
  fb = inject(FirebaseService);
  state = inject(StateService);

  isCategoriesDirty = signal(false);
  isPrintConfigDirty = signal(false);
  isMaintenanceModeDirty = signal(false);
  isShowLockedFeaturesDirty = signal(false);

  constructor() {
    effect(() => {
      const v = this.state.systemVersion();
      if (!this.versionControl.dirty) {
        this.versionControl.setValue(v, { emitEvent: false });
      }
    });
    effect(() => {
      const m = this.state.maintenanceMode();
      if (!this.isMaintenanceModeDirty()) {
        this.maintenanceModeLocal.set(m);
      }
    });
    effect(() => {
      const msg = this.state.maintenanceMessage() || '';
      if (!this.maintenanceMessageLocal.dirty) {
        this.maintenanceMessageLocal.setValue(msg, { emitEvent: false });
      }
    });
    effect(() => {
      const st = this.state.maintenanceScheduledTime() || '';
      if (!this.maintenanceScheduledTimeLocal.dirty) {
        this.maintenanceScheduledTimeLocal.setValue(st, { emitEvent: false });
      }
    });
    effect(() => {
      const s = this.state.showLockedFeatures();
      if (!this.isShowLockedFeaturesDirty()) {
        this.showLockedFeaturesLocal.set(s);
      }
    });
    effect(() => {
      const cats = this.state.categories();
      if (!this.isCategoriesDirty()) {
        this.categoriesLocal.set(JSON.parse(JSON.stringify(cats)));
      }
    });
    effect(() => {
      const cfg = this.state.printConfig();
      if (cfg && !this.isPrintConfigDirty()) {
        this.printConfig.set(JSON.parse(JSON.stringify(cfg)));
      }
    });
  }

  onMaintenanceModeChange() {
    this.isMaintenanceModeDirty.set(true);
  }

  onShowLockedFeaturesChange() {
    this.isShowLockedFeaturesDirty.set(true);
  }

  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  inventoryService = inject(InventoryService);
  standardService = inject(StandardService);
  router = inject(Router);
  notificationCenter = inject(NotificationCenterService);
  backupService = inject(BackupService);

  versionControl = new FormControl('');
  maintenanceModeLocal = signal(false);
  maintenanceMessageLocal = new FormControl('');
  maintenanceScheduledTimeLocal = new FormControl('');
  showLockedFeaturesLocal = signal(false);
  categoriesLocal = signal<CategoryItem[]>([]);

  archiverData = signal<any>(null);
  archiverStatus = signal<'idle' | 'fetching' | 'exporting' | 'ready_to_delete' | 'deleting' | 'restoring'>('idle');
  archiverDays = signal(180);
  storageEstimate = signal<{ totalDocs: number; estimatedSizeKB: number; details: any } | null>(null);
  usageBusy = signal(false);
  printConfig = signal<PrintConfig>({
    showSignature: true,
    footerText: ''
  });
  isRecycling = signal(false);
  showRecycleBin = signal(false);
  recycleItems = signal<any[]>([]);
  private xlsxLoader?: Promise<typeof import('xlsx')>;

  backupStatus = signal<BackupStatusResponse | null>(null);
  backupList = signal<BackupListItem[]>([]);
  backupSelectedId = signal('');
  backupBusy = signal<'idle' | 'status' | 'list' | 'create' | 'verify' | 'dry-run' | 'restore'>('idle');
  backupLastCreate = signal<BackupCreateResponse | null>(null);
  backupLastVerification = signal<BackupVerificationResponse | null>(null);
  backupLastRestore = signal<RestoreResponse | null>(null);
  backupRestoreDrive = signal(true);
  backupRestoreAuth = signal(true);

  readonly firestoreRulesNotice =
    'Rules triển khai được quản lý trong file firestore.rules của mã nguồn. Màn hình Config không còn nhúng hoặc sao chép bản rules để tránh phát tán cấu hình cũ.';

  newUpdateContent = '';
  newUpdateType = 'info';
  newUpdateActionUrl = '';
  systemUpdates = signal<any[]>([]);
  systemUpdatesSub: any;

  ngOnInit() {
    this.versionControl.setValue(this.state.systemVersion());
    this.maintenanceModeLocal.set(this.state.maintenanceMode());
    this.maintenanceMessageLocal.setValue(this.state.maintenanceMessage());
    this.maintenanceScheduledTimeLocal.setValue(this.state.maintenanceScheduledTime() || '');
    this.showLockedFeaturesLocal.set(this.state.showLockedFeatures());
    this.categoriesLocal.set(JSON.parse(JSON.stringify(this.state.categories())));
    this.printConfig.set(this.state.printConfig() || {
      showSignature: true,
      footerText: ''
    });
    if (this.view() === 'system') {
      this.listenSystemUpdates();
    }
    if (this.view() === 'backup') {
      void this.loadBackupStatus();
    }
  }

  ngOnDestroy() {
      if (this.systemUpdatesSub) this.systemUpdatesSub();
  }

  listenSystemUpdates() {
      const updatesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates`);
      const q = query(updatesRef, orderBy('timestamp', 'desc'), limit(50));
      this.systemUpdatesSub = onSnapshot(q, (snap) => {
          this.systemUpdates.set(snap.docs.map(d => {
              const data = d.data();
              return {
                  id: d.id,
                  content: data['content'],
                  type: data['type'] || 'info',
                  actionUrl: data['actionUrl'] || '',
                  timestamp: data['timestamp'] ? data['timestamp'].toDate() : new Date()
              };
          }));
      });
  }

  async postSystemUpdate() {
      if (!this.newUpdateContent.trim()) return;
      const content = this.newUpdateContent.trim();
      const actionUrl = this.newUpdateActionUrl.trim();
      try {
        await this.state.postSystemUpdate(content, this.newUpdateType, actionUrl);
        this.newUpdateContent = '';
        this.newUpdateActionUrl = '';
        this.toast.show('Đã đăng thông báo hệ thống!', 'success');
      } catch (e: any) {
        this.toast.show(`Không thể đăng thông báo hệ thống: ${e?.message || e}`, 'error');
      }
  }

  async deleteSystemUpdate(id: string) {
      if (!await this.confirmationService.confirm({
          message: 'Xóa bài đăng này và thu hồi thông báo trong Hộp thư? (Lưu ý: Thông báo đẩy đã phát trên thiết bị không thể thu hồi)',
          confirmText: 'Xóa & Thu hồi',
          isDangerous: true
      })) return;

      try {
        await this.notificationCenter.deleteBroadcastByGroupId(id);
      } catch (e) {
        console.error('Revoke broadcast error:', e);
        this.toast.show('Không thể thu hồi thông báo qua API. Bài đăng hệ thống CHƯA bị xóa để bạn có thể thử lại.', 'error');
        return;
      }

      try {
        await deleteDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates/${id}`));
        this.toast.show('Đã xóa bài đăng hệ thống và thu hồi thông báo trong Hộp thư thành công.', 'success');
      } catch (e: any) {
        console.error('deleteDoc error:', e);
        this.toast.show(`Đã thu hồi thông báo Hộp thư nhưng không thể xóa bài đăng khỏi Firestore: ${e?.message || e}`, 'error');
      }
  }

  async saveAvatarStyle(event: any) {
      const style = typeof event === 'string' ? event : event?.target?.value;
      if (style) {
          try {
            await this.state.saveAvatarStyle(style);
            this.toast.show('Đã cập nhật kiểu avatar.', 'success');
          } catch (e: any) {
            this.toast.show(`Không thể cập nhật kiểu avatar: ${e?.message || e}`, 'error');
          }
      }
  }

  addCategory() {
      this.isCategoriesDirty.set(true);
      this.categoriesLocal.update(c => [...c, { id: '', name: '' }]);
  }
  removeCategory(index: number) {
      this.isCategoriesDirty.set(true);
      this.categoriesLocal.update(c => c.filter((_, i) => i !== index));
  }
  onCategoryChange() {
      this.isCategoriesDirty.set(true);
  }
  onPrintConfigChange() {
      this.isPrintConfigDirty.set(true);
  }
  async saveCategories() {
      const validation = validateCategoriesDraft(this.categoriesLocal());
      if (!validation.ok) {
        this.toast.show(validation.message, 'error');
        return;
      }
      try {
        await this.state.saveCategoriesConfig(validation.value);
        this.categoriesLocal.set(validation.value);
        this.isCategoriesDirty.set(false);
        this.toast.show('Đã cập nhật danh mục phân loại.', 'success');
      } catch (e: any) {
        this.toast.show(`Không thể lưu danh mục phân loại: ${e?.message || e}`, 'error');
      }
  }

  async fetchArchiverData() {
    this.archiverStatus.set('fetching');
    try {
      const logs = await this.fb.fetchOldData('logs', this.archiverDays());
      const requests = await this.fb.fetchOldData('requests', this.archiverDays());
      this.archiverData.set({logs, requests});
      if (logs.length === 0 && requests.length === 0) {
        this.toast.show('Không có dữ liệu cũ nào được tìm thấy.', 'info');
        this.archiverStatus.set('idle');
        return;
      }
      await this.exportArchiverToExcel(logs, requests);
    } catch (e) {
      this.toast.show('Lỗi khi tải dữ liệu cũ.', 'error');
      this.archiverStatus.set('idle');
    }
  }

  private async exportArchiverToExcel(logs: any[], requests: any[]) {
    this.archiverStatus.set('exporting');
    try {
      const XLSX = await this.loadXlsx();
      const wb = XLSX.utils.book_new();
      if (logs.length > 0) {
        const wsLogs = XLSX.utils.json_to_sheet(logs);
        XLSX.utils.book_append_sheet(wb, wsLogs, "Logs");
      }
      if (requests.length > 0) {
        const wsReqs = XLSX.utils.json_to_sheet(requests);
        XLSX.utils.book_append_sheet(wb, wsReqs, "Requests");
      }
      const fileName = `LIMS_Archive_${this.archiverDays()}days_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(wb, fileName);
      this.archiverStatus.set('ready_to_delete');
    } catch (e) {
      this.toast.show('Lỗi khi tạo tệp Excel.', 'error');
      this.archiverStatus.set('idle');
    }
  }

  cancelArchiver() {
      this.archiverStatus.set('idle');
      this.archiverData.set({logs: [], requests: []});
  }

  async confirmDeleteArchiver() {
    const data = this.archiverData();
    if (!data || (data.logs?.length === 0 && data.requests?.length === 0)) return;
    const count = (data.logs?.length || 0) + (data.requests?.length || 0);
    if (!await this.confirmationService.confirm({
      message: `CẢNH BÁO: Tác vụ này sẽ XÓA VĨNH VIỄN ${count} bản ghi cũ khỏi Firebase. Bạn CHẮC CHẮN MÌNH ĐÃ TẢI LƯU TRỮ CHƯA?`,
      confirmText: 'XÓA THẬT KỸ',
      isDangerous: true
    })) return;

    this.archiverStatus.set('deleting');
    try {
      if (data.logs?.length > 0) {
        await this.fb.deleteDocsInBatch('logs', data.logs.map((d: any) => d.id));
      }
      if (data.requests?.length > 0) {
        await this.fb.deleteDocsInBatch('requests', data.requests.map((d: any) => d.id));
      }
      this.toast.show(`Thành công! Đã dọn dẹp ${count} bản ghi cũ rác.`, 'success');
      this.archiverStatus.set('idle');
      this.archiverData.set({logs: [], requests: []});
      this.loadUsage();
    } catch (e) {
      this.toast.show('Lỗi khi xóa dữ liệu.', 'error');
      this.archiverStatus.set('ready_to_delete');
    }
  }

  async importArchiverData(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!await this.confirmationService.confirm({
        message: `Bạn chuẩn bị khôi phục lại dữ liệu từ File Excel: ${file.name}. Quá trình này sẽ nạp lại các bản ghi cũ lên hệ thống (có thể tốn thời gian). Bạn chắc chắn chứ?`,
        confirmText: 'Bắt đầu Nạp'
    })) {
        event.target.value = '';
        return;
    }
    this.archiverStatus.set('restoring');
    const reader = new FileReader();
    reader.onload = async (e: any) => {
        try {
            const data = new Uint8Array(e.target.result);
            const XLSX = await this.loadXlsx();
            const workbook = XLSX.read(data, { type: 'array' });
            let logsToRestore: any[] = [];
            let reqsToRestore: any[] = [];
            if (workbook.SheetNames.includes('Logs')) {
                logsToRestore = XLSX.utils.sheet_to_json(workbook.Sheets['Logs']);
            }
            if (workbook.SheetNames.includes('Requests')) {
                reqsToRestore = XLSX.utils.sheet_to_json(workbook.Sheets['Requests']);
            }
            if (logsToRestore.length === 0 && reqsToRestore.length === 0) {
                this.toast.show('Không tìm thấy dữ liệu hợp lệ trong tệp Excel.', 'error');
                this.archiverStatus.set('idle');
                return;
            }
            let restoredCount = 0;
            if (logsToRestore.length > 0) restoredCount += await this.fb.restoreArchivedData('logs', logsToRestore);
            if (reqsToRestore.length > 0) restoredCount += await this.fb.restoreArchivedData('requests', reqsToRestore);
            this.toast.show(`Thành công! Đã nạp lại ${restoredCount} bản ghi vào hệ thống.`, 'success');
            this.archiverStatus.set('idle');
            this.loadUsage();
        } catch (err) {
            this.toast.show('Lỗi định dạng File Excel.', 'error');
            this.archiverStatus.set('idle');
        } finally {
            event.target.value = '';
        }
    };
    reader.onerror = () => {
        this.toast.show('Không thể đọc file.', 'error');
        this.archiverStatus.set('idle');
        event.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  }

  private loadXlsx(): Promise<typeof import('xlsx')> {
    this.xlsxLoader ??= import('xlsx');
    return this.xlsxLoader;
  }

  async loadUsage() {
      if (this.usageBusy()) return;
      this.usageBusy.set(true);
      try {
          const estimate = await this.fb.getFirestoreDataEstimate();
          this.storageEstimate.set(estimate);
      } catch (e) {
          this.toast.show('Lỗi tính dung lượng.', 'error');
      } finally {
          this.usageBusy.set(false);
      }
  }

  private backupErrorMessage(error: any): string {
    return error?.message || error?.error || 'Không thể thực hiện thao tác backup.';
  }

  async loadBackupStatus(showError = false) {
    this.backupBusy.set('status');
    try {
      const status = await this.backupService.getStatus();
      this.backupStatus.set(status);
      if (status.drive.accessAvailable && status.drive.backupFolderConfigured && status.encryption.configured) {
        await this.refreshBackupList(false);
      }
    } catch (error) {
      if (showError) this.toast.show(this.backupErrorMessage(error), 'error');
    } finally {
      if (this.backupBusy() === 'status') this.backupBusy.set('idle');
    }
  }

  async refreshBackupList(showError = true) {
    this.backupBusy.set('list');
    try {
      const result = await this.backupService.listBackups();
      this.backupList.set(result.backups);
      const selected = this.backupSelectedId();
      if (!selected || !result.backups.some(item => item.backupFolderId === selected)) {
        const firstValid = result.backups.find(item => item.status === 'COMPLETED' || item.status === 'COMPLETED_WITH_WARNINGS');
        this.backupSelectedId.set(firstValid?.backupFolderId || result.backups[0]?.backupFolderId || '');
      }
    } catch (error) {
      if (showError) this.toast.show(this.backupErrorMessage(error), 'error');
    } finally {
      if (this.backupBusy() === 'list') this.backupBusy.set('idle');
    }
  }

  connectBackupDrive() {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.assign(`/api/oauth/google/start?mode=backup&returnTo=${encodeURIComponent(returnTo)}`);
  }

  async createComprehensiveBackup() {
    if (!await this.confirmationService.confirm({
      message: 'Tạo backup toàn diện gồm Firestore, Firebase Auth, các liên kết Drive, tệp CoA, Google Docs, Google Sheets/Excel, PDF và cấu hình Apps Script. Dữ liệu sẽ được mã hóa trước khi tải lên Drive. Tiếp tục?',
      confirmText: 'Tạo Backup Toàn Diện'
    })) return;
    this.backupBusy.set('create');
    try {
      const result = await this.backupService.createBackup(this.state.systemVersion(), undefined, true);
      this.backupLastCreate.set(result);
      await this.refreshBackupList(false);
      const label = result.status === 'COMPLETED' ? 'Backup toàn diện đã hoàn tất.' : `Backup hoàn tất với trạng thái ${result.status}.`;
      const detail = result.errors?.[0] ? ` Lỗi: ${result.errors[0]}` : '';
      this.toast.show(`${label} Firestore ${result.summary.firestoreDocuments} docs, Drive ${result.summary.driveAssets} tệp.${detail}`, result.status === 'COMPLETED' ? 'success' : result.status === 'FAILED' ? 'error' : 'info');
    } catch (error) {
      this.toast.show(this.backupErrorMessage(error), 'error');
    } finally {
      this.backupBusy.set('idle');
    }
  }

  async resumeSelectedBackup() {
    const backupFolderId = this.backupSelectedId();
    if (!backupFolderId) {
      this.toast.show('Chưa chọn backup dở dang để tiếp tục.', 'info');
      return;
    }
    const selectedBackup = this.backupList().find(item => item.backupFolderId === backupFolderId);
    const rebuildFirestorePayload = Boolean(selectedBackup?.manifestFileId && (
      selectedBackup.status === 'COMPLETED'
      || selectedBackup.status === 'COMPLETED_WITH_WARNINGS'
      || selectedBackup.status === 'FAILED'
    ));
    if (!await this.confirmationService.confirm({
      message: rebuildFirestorePayload
        ? 'Backup đang chọn đã có manifest. Hệ thống sẽ tái dựng payload Firestore ngay trên thư mục hiện có, chỉ loại bản sao hoàn toàn giống nhau và dữ liệu runtime tạm, giữ nguyên dữ liệu nghiệp vụ; sau đó sẽ chốt manifest và kiểm tra integrity lại. Tiếp tục?'
        : 'Tiếp tục đúng backup đang chọn từ checkpoint đã lưu. Thao tác này không tạo backup mới nếu session đã chọn không thể resume. Tiếp tục?',
      confirmText: 'Tiếp tục backup dở dang'
    })) return;
    this.backupBusy.set('create');
    try {
      const result = await this.backupService.createBackup(this.state.systemVersion(), backupFolderId, false, rebuildFirestorePayload);
      this.backupLastCreate.set(result);
      await this.refreshBackupList(false);
      const label = result.status === 'COMPLETED' ? 'Backup dở dang đã hoàn tất.' : `Backup tiếp tục xong với trạng thái ${result.status}.`;
      const detail = result.errors?.[0] ? ` Lỗi: ${result.errors[0]}` : '';
      this.toast.show(`${label} Firestore ${result.summary.firestoreDocuments} docs, Drive ${result.summary.driveAssets} tệp.${detail}`, result.status === 'COMPLETED' ? 'success' : result.status === 'FAILED' ? 'error' : 'info');
    } catch (error) {
      this.toast.show(this.backupErrorMessage(error), 'error');
    } finally {
      this.backupBusy.set('idle');
    }
  }

  private selectedBackupFolderId(): string {
    return this.backupSelectedId() || this.backupList().find(item => item.status === 'COMPLETED' || item.status === 'COMPLETED_WITH_WARNINGS')?.backupFolderId || '';
  }

  async verifySelectedBackup() {
    const backupFolderId = this.selectedBackupFolderId();
    if (!backupFolderId) {
      this.toast.show('Chưa có backup để kiểm tra.', 'info');
      return;
    }
    this.backupBusy.set('verify');
    try {
      const result = await this.backupService.verifyBackup(backupFolderId);
      this.backupLastVerification.set(result);
      this.toast.show(result.verified ? `Integrity đạt: ${result.checkedParts} phân đoạn, ${result.checkedAssets} tệp Drive.` : `Integrity không đạt: ${result.errors.length} lỗi.`, result.verified ? 'success' : 'error');
    } catch (error) {
      this.toast.show(this.backupErrorMessage(error), 'error');
    } finally {
      this.backupBusy.set('idle');
    }
  }

  async dryRunSelectedBackup() {
    const backupFolderId = this.selectedBackupFolderId();
    if (!backupFolderId) {
      this.toast.show('Chưa có backup để đối chiếu.', 'info');
      return;
    }
    this.backupBusy.set('dry-run');
    try {
      const result = await this.backupService.restoreBackup({
        backupFolderId,
        mode: 'DRY_RUN',
        restoreDrive: false,
        restoreAuth: false,
      });
      this.backupLastRestore.set(result);
      const report = result.report.firestore;
      this.toast.show(`Dry-run xong: thiếu ${report.missing}, khác ${report.different}, không đổi ${report.unchanged}.`, 'info');
    } catch (error) {
      this.toast.show(this.backupErrorMessage(error), 'error');
    } finally {
      this.backupBusy.set('idle');
    }
  }

  resumableRestoreCheckpoint(): RestoreCheckpointListItem | null {
    const selected = this.backupList().find(item => item.backupFolderId === this.selectedBackupFolderId());
    const checkpoint = selected?.restoreCheckpoints?.find(item => item.mode === 'RECOVER_MISSING' && item.phase !== 'COMPLETED');
    return checkpoint || null;
  }

  async recoverMissingFromSelectedBackup(resumeRestoreId?: string) {
    const backupFolderId = this.selectedBackupFolderId();
    if (!backupFolderId) {
      this.toast.show('Chưa có backup để restore.', 'info');
      return;
    }
    if (!await this.confirmationService.confirm({
      message: resumeRestoreId
        ? 'Tiếp tục restore an toàn từ checkpoint. Hệ thống sẽ chạy lại các bước theo cơ chế idempotent và không ghi đè dữ liệu nghiệp vụ hiện có ngoài việc sửa liên kết Drive bị đổi ID. Tiếp tục?'
        : 'Restore an toàn sẽ chỉ bổ sung document Firestore, Auth user và tệp Drive đang bị thiếu; dữ liệu hiện có không bị ghi đè. Nên chạy Dry-run trước. Tiếp tục?',
      confirmText: resumeRestoreId ? 'Tiếp Tục Restore' : 'Khôi Phục Phần Thiếu'
    })) return;
    this.backupBusy.set('restore');
    try {
      const result = await this.backupService.restoreBackup({
        backupFolderId,
        mode: 'RECOVER_MISSING',
        restoreDrive: this.backupRestoreDrive(),
        restoreAuth: this.backupRestoreAuth(),
        resumeRestoreId,
      });
      this.backupLastRestore.set(result);
      const report = result.report.firestore;
      this.toast.show(`Restore xong: thêm ${report.created} Firestore docs, tạo lại ${result.report.drive.recreated} tệp/thư mục Drive, import ${result.report.auth.imported} Auth user.`, result.success ? 'success' : 'error');
      await this.refreshBackupList(false);
    } catch (error) {
      this.toast.show(this.backupErrorMessage(error), 'error');
    } finally {
      this.backupBusy.set('idle');
    }
  }

  async resumeMissingRestore() {
    const checkpoint = this.resumableRestoreCheckpoint();
    if (checkpoint) await this.recoverMissingFromSelectedBackup(checkpoint.restoreId);
  }

  backupBusyLabel(): string {
    switch (this.backupBusy()) {
      case 'status': return 'Đang kiểm tra cấu hình...';
      case 'list': return 'Đang đọc danh sách backup...';
      case 'create': return 'Đang tạo backup toàn diện...';
      case 'verify': return 'Đang kiểm tra checksum...';
      case 'dry-run': return 'Đang đối chiếu, chưa ghi dữ liệu...';
      case 'restore': return 'Đang restore an toàn...';
      default: return '';
    }
  }

  backupDate(value?: string | null): string {
    if (!value) return 'Chưa ghi nhận';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Chưa ghi nhận' : date.toLocaleString('vi-VN');
  }

  backupStatusLabel(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'Hoàn tất';
      case 'COMPLETED_WITH_WARNINGS': return 'Hoàn tất, có cảnh báo';
      case 'FAILED': return 'Thất bại';
      case 'INVALID': return 'Không hợp lệ';
      default: return status;
    }
  }

  async savePrintConfig() {
      try {
          await this.state.savePrintConfig(this.printConfig());
          this.isPrintConfigDirty.set(false);
          this.toast.show('Đã lưu cấu hình in thành công.', 'success');
      } catch (e: any) {
          this.toast.show(`Không thể lưu cấu hình in: ${e?.message || e}`, 'error');
      }
  }
  async saveMaintenanceConfig() {
      const msg = this.maintenanceMessageLocal.value || 'Hệ thống đang được bảo trì. Vui lòng quay lại sau ít phút.';
      const scheduledVal = this.maintenanceScheduledTimeLocal.value || null;
      try {
        await this.state.saveMaintenanceConfig(this.maintenanceModeLocal(), msg, scheduledVal);
        this.isMaintenanceModeDirty.set(false);
        this.maintenanceMessageLocal.markAsPristine();
        this.maintenanceScheduledTimeLocal.markAsPristine();

        if (this.maintenanceModeLocal()) {
            this.toast.show('Đã BẬT chế độ bảo trì! Người dùng thông thường sẽ bị chặn.', 'info', true);
        } else if (scheduledVal) {
            const formatted = new Date(scheduledVal).toLocaleString('vi-VN');
            this.toast.show(`Đã hẹn giờ bảo trì vào lúc ${formatted}`, 'info');
        } else {
            this.toast.show('Đã cập nhật cấu hình bảo trì thành công!', 'success');
        }
      } catch (e: any) {
        this.toast.show(`Không thể lưu cấu hình bảo trì: ${e?.message || e}`, 'error');
      }
  }

  async openRecycleBin() {
      this.isRecycling.set(true);
      this.showRecycleBin.set(true);
      this.recycleItems.set([]);

      try {
          const inventoryRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/inventory`);
          const standardsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`);

          const [invSnap, stdSnap] = await Promise.all([
              getDocs(query(inventoryRef, where('_isDeleted', '==', true))),
              getDocs(query(standardsRef, where('_isDeleted', '==', true)))
          ]);

          const results: any[] = [];
          invSnap.forEach((d: any) => results.push({ type: 'inventory', id: d.id, name: d.data()['name'] || '', lastUpdated: d.data()['lastUpdated'] || null }));
          stdSnap.forEach((d: any) => results.push({ type: 'standard', id: d.id, name: d.data()['name'] || '', lastUpdated: d.data()['lastUpdated'] || null }));

          results.sort((a, b) => {
              const ta = a.lastUpdated?.toMillis() || 0;
              const tb = b.lastUpdated?.toMillis() || 0;
              return tb - ta;
          });

          this.recycleItems.set(results);
      } catch (e) {
          console.error("Lỗi khi tải dữ liệu thùng rác:", e);
          this.toast.show('Không thể tải thùng rác do Firebase từ chối truy vấn. Cần index!', 'error');
      } finally {
          this.isRecycling.set(false);
      }
  }

  async saveShowLockedFeaturesConfig() {
      try {
        await this.state.saveShowLockedFeaturesConfig(this.showLockedFeaturesLocal());
        this.isShowLockedFeaturesDirty.set(false);
        this.toast.show(
          this.showLockedFeaturesLocal()
            ? 'Đã BẬT chế độ hiển thị tính năng bị khóa (🔒) cho toàn hệ thống!'
            : 'Đã TẮT chế độ hiển thị tính năng bị khóa (quay lại chế độ ẩn mặc định).',
          'info'
        );
      } catch (e: any) {
        this.toast.show(`Không thể lưu cấu hình hiển thị tính năng khóa: ${e?.message || e}`, 'error');
      }
  }

  clearScheduledTime() {
      this.maintenanceScheduledTimeLocal.setValue('');
      this.maintenanceScheduledTimeLocal.markAsDirty();
      this.toast.show('Đã xóa thời gian hẹn giờ bảo trì. Nhấn Lưu để áp dụng.', 'info');
  }

  async restoreRecycleItem(item: any) {
      if (!await this.confirmationService.confirm({ message: `Bạn muốn khôi phục dữ liệu: ${item.name}?`, confirmText: 'Khôi phục' })) return;
      this.isRecycling.set(true);
      try {
          if (item.type === 'inventory') {
              await this.inventoryService.restoreItem(item.id);
          } else {
              await this.standardService.restoreStandard(item.id, item.name);
          }
          this.toast.show('Đã khôi phục thành công!');
          this.recycleItems.update(list => list.filter(i => i !== item));

          if (item.type === 'inventory') await this.fb.updateMetadata('inventory');
          if (item.type === 'standard') await this.fb.updateMetadata('standards');
      } catch (e) {
          console.error(e);
          this.toast.show('Lỗi khi khôi phục.', 'error');
      } finally {
          this.isRecycling.set(false);
      }
  }

  async emptyRecycleBin() {
      if (!await this.confirmationService.confirm({ message: 'Thao tác này là KHÔNG THỂ PHỤC HỒI. Nó gửi lệnh ÉP TOÀN BỘ NHÂN VIÊN phải khởi động lại ứng dụng. Tiếp tục?', confirmText: 'DỌN RÁC NGAY', isDangerous: true })) return;

      this.isRecycling.set(true);
      try {
          const BATCH_SIZE = 400;
          let batch = writeBatch(this.fb.db);
          let opCount = 0;

          const items = this.recycleItems();
          for (const item of items) {
              const path = item.type === 'inventory' ? `artifacts/${this.fb.APP_ID}/inventory/${item.id}` : `artifacts/${this.fb.APP_ID}/reference_standards/${item.id}`;
              batch.delete(doc(this.fb.db, path));
              opCount++;

              if (opCount >= BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
          }
          if (opCount > 0) await batch.commit();

          await this.fb.adminForceSyncCache();

          this.toast.show('Đã xóa vĩnh viễn rác và phát tín hiệu F5.');
          this.recycleItems.set([]);
          setTimeout(() => this.showRecycleBin.set(false), 500);

      } catch (e) {
          console.error(e);
          this.toast.show('Lỗi dọn rác.', 'error');
          this.isRecycling.set(false);
      }
  }

  // ─── Migration: Đặt lastUpdated cho legacy docs ─────────────────────────────
  isMigrating = signal(false);
  migrationLog = signal<string[]>([]);

  async runLastUpdatedMigration() {
    if (!await this.confirmationService.confirm({
      message: 'Migration sẽ quét inventory, sops và logs để ghi lastUpdated cho các document cũ chưa có field này. Thao tác này an toàn và idempotent (có thể chạy lại). Tiếp tục?',
      confirmText: 'Chạy Migration'
    })) return;

    this.isMigrating.set(true);
    this.migrationLog.set([]);
    const appId = this.fb.APP_ID;
    const BATCH_SIZE = 400;
    const logs: string[] = [];
    const addLog = (msg: string) => {
      logs.push(msg);
      this.migrationLog.set([...logs]);
    };

    try {
      const collectionsToMigrate: { name: string; path: string }[] = [
        { name: 'inventory', path: `artifacts/${appId}/inventory` },
        { name: 'sops', path: `artifacts/${appId}/sops` },
        { name: 'logs', path: `artifacts/${appId}/logs` },
      ];

      for (const col of collectionsToMigrate) {
        addLog(`🔍 Đang quét ${col.name}...`);
        const colRef = collection(this.fb.db, col.path);
        const snap = await getDocs(colRef);

        let batchOps = writeBatch(this.fb.db);
        let opCount = 0;
        let updatedCount = 0;

        for (const docSnap of snap.docs) {
          const data = docSnap.data();
          // Idempotent: chỉ migrate docs THỰC SỰ thiếu lastUpdated
          if (data['lastUpdated'] != null) continue;

          // Với sops: dùng lastModified làm gốc nếu có, tránh ghi đè thông tin cũ
          const fallbackTs = data['lastModified'] ?? serverTimestamp();
          batchOps.update(docSnap.ref, { lastUpdated: fallbackTs });
          opCount++;
          updatedCount++;

          if (opCount >= BATCH_SIZE) {
            await batchOps.commit();
            batchOps = writeBatch(this.fb.db);
            opCount = 0;
            addLog(`  ✅ Đã commit batch (${updatedCount} docs xử lý...)`);
          }
        }

        if (opCount > 0) await batchOps.commit();
        addLog(`✅ ${col.name}: ${updatedCount}/${snap.size} docs đã được cập nhật lastUpdated`);
      }

      addLog('🎉 Migration hoàn tất! Hệ thống DeltaSync cursor sẽ hoạt động đúng cho tất cả collections.');
      this.toast.show('Migration lastUpdated hoàn tất!', 'success');
    } catch (e: any) {
      addLog(`❌ Lỗi: ${e?.message || e}`);
      this.toast.show('Lỗi trong quá trình migration.', 'error');
      console.error('[Migration] Error:', e);
    } finally {
      this.isMigrating.set(false);
    }
  }
}
