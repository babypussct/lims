import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../core/services/firebase.service';
import { ToastService } from '../../../core/services/toast.service';
import { StateService } from '../../../core/services/state.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { CategoryItem } from '../../../core/models/config.model';
import { InventoryService } from '../../inventory/inventory.service';
import { StandardService } from '../../standards/standard.service';
import { collection, getDocs, writeBatch, doc, query, where, onSnapshot, deleteDoc, setDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-config-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './config-general.component.html'
})
export class ConfigGeneralComponent implements OnInit, OnDestroy {
  fb = inject(FirebaseService);
  state = inject(StateService);
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  inventoryService = inject(InventoryService);
  standardService = inject(StandardService);
  router = inject(Router);
  notificationService = inject(NotificationService);

  versionControl = new FormControl(''); 
  printConfig = this.state.printConfig;
  
  categoriesLocal = signal<CategoryItem[]>([]);
  storageEstimate = signal<{ totalDocs: number, estimatedSizeKB: number, details: any } | null>(null);

  archiverDays = signal<number>(180);
  archiverStatus = signal<'idle' | 'fetching' | 'exporting' | 'ready_to_delete' | 'deleting' | 'restoring'>('idle');
  archiverData = signal<{logs: any[], requests: any[]}>({logs: [], requests: []});

  showRecycleBin = signal<boolean>(false);
  recycleItems = signal<any[]>([]);
  isRecycling = signal<boolean>(false);

  firestoreRules = computed(() => {
    const appId = this.fb.APP_ID;
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper: kiểm tra user có role 'manager' không
    function isManager() { 
      return exists(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)) && 
             'role' in get(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)).data &&
             get(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)).data.role == 'manager'; 
    }
    // Helper: kiểm tra user có quyền duyệt chuẩn
    // LƯU Ý: permissions là Firestore Array => phải dùng hasAny(), KHÔNG dùng 'in' (chỉ cho Map keys)
    function isApprover() {
      return exists(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)) && 
             'permissions' in get(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)).data &&
             get(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)).data.permissions.hasAny(['standard_approve']);
    }
    // Helper: user đã đăng nhập
    function isAuth() { return request.auth != null; }

    match /artifacts/${appId} {
        // Auth sessions: public (dùng cho shared workstations)
        match /auth_sessions/{sessionId} { allow read, write: if true; }

        // Users: mọi người đăng nhập đều đọc được (avatar, tên)
        // Ghi: chỉ manager hoặc chính chủ tài khoản
        match /users/{userId} { 
          allow read: if isAuth(); 
          allow write: if isAuth() && (isManager() || request.auth.uid == userId); 
        }

        // SOP Recipes
        match /recipes/{recipeId} { allow read, write: if isAuth(); }

        // Công khai đọc (Truy xuất nguồn gốc QR), cần đăng nhập để ghi
        match /logs/{logId}      { allow read: if true; allow write: if isAuth(); }
        match /print_jobs/{jobId}{ allow read: if true; allow write: if isAuth(); }
        match /requests/{reqId}  { allow read: if true; allow write: if isAuth(); }

        // === STANDARD REQUESTS: SCOPED BY ROLE ===
        // PHÂN BIỆT list (query collection) vs get (đọc 1 doc):
        // - list: Firestore KHÔNG có resource.data => không thể check requestedBy
        //   => isAuth() là đủ vì app-level đã đảm bảo query đúng (manager query all, user query by uid)
        // - get: có resource.data => kiểm tra requestedBy được
        match /standard_requests/{reqId} {
          // LIST (query collection): không có resource.data, dùng isAuth() đơn giản
          // App-level đảm bảo: manager/approver query by status, user query by requestedBy+status
          allow list: if isAuth();

          // GET (đọc 1 document cụ thể): kiểm tra ownership hoặc quyền
          allow get: if isAuth() && (
            isManager() || isApprover() ||
            resource.data.requestedBy == request.auth.uid
          );
          
          // Khi tạo mới: người tạo phải đúng với thông tin đăng nhập (trừ khi là Manager/Approver tạo dùm)
          allow create: if isAuth() && (
            isManager() || isApprover() ||
            request.resource.data.requestedBy == request.auth.uid
          );
          
          // Khi cập nhật: chỉ được cập nhật request của mình và KHÔNG được đổi quyền sở hữu sang người khác
          allow update: if isAuth() && (
            isManager() || isApprover() ||
            (resource.data.requestedBy == request.auth.uid && request.resource.data.requestedBy == request.auth.uid)
          );
          
          // Khi xóa: chỉ được xóa request của mình
          allow delete: if isAuth() && (
            isManager() || isApprover() ||
            resource.data.requestedBy == request.auth.uid
          );
        }

        // Các collections còn lại: cần đăng nhập (inventory, SOPs, config, ...)
        // KHÔNG dùng wildcard rộng để tránh override rule ở trên
        match /inventory/{docId}            { allow read, write: if isAuth(); }
        match /inventory/{docId}/history/{historyId} { allow read, write: if isAuth(); }
        match /sops/{docId}                 { allow read, write: if isAuth(); }
        match /reference_standards/{docId}  { allow read, write: if isAuth(); }
        match /reference_standards/{docId}/logs/{logId} { allow read, write: if isAuth(); }
        match /standard_usages/{docId}      { allow read, write: if isAuth(); }
        match /purchase_requests/{docId}    { allow read, write: if isAuth(); }
        match /notifications/{docId}        { allow read, write: if isAuth(); }
        match /system_updates/{docId}       { allow read: if isAuth(); allow write: if isManager(); }
        match /system/{docId}               { allow read: if isAuth(); allow write: if isManager(); }
        match /stats/{docId}                { allow read: if isAuth(); allow write: if isAuth(); }
        match /config/{docId}               { allow read: if isAuth(); allow write: if isManager(); }
        match /master_targets/{docId}       { allow read, write: if isAuth(); }
        match /target_groups/{docId}        { allow read, write: if isAuth(); }

        // Fallback an toàn: từ chối tất cả những gì không được liệt kê
        // (Bỏ wildcard cũ: match /{document=**} { allow read, write: if isAuth(); })
    }
  }
}`;
  });

  newUpdateContent = '';
  newUpdateType = 'info';
  newUpdateActionUrl = '';
  systemUpdates = signal<any[]>([]);
  systemUpdatesSub: any;

  ngOnInit() {
    this.versionControl.setValue(this.state.systemVersion()); 
    this.categoriesLocal.set(JSON.parse(JSON.stringify(this.state.categories())));
    this.listenSystemUpdates();
  }

  ngOnDestroy() {
      if (this.systemUpdatesSub) this.systemUpdatesSub();
  }

  listenSystemUpdates() {
      const updatesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates`);
      const q = query(updatesRef, orderBy('timestamp', 'desc'));
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
      const updatesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates`);
      const newRef = doc(updatesRef);
      
      const content = this.newUpdateContent.trim();
      const actionUrl = this.newUpdateActionUrl.trim();

      await setDoc(newRef, {
          content: content,
          type: this.newUpdateType,
          actionUrl: actionUrl,
          timestamp: serverTimestamp()
      });

      // Gửi Broadcast (Push Notification) tới tất cả user
      await this.notificationService.notify({
          recipientUid: 'role:all',
          type: 'SYSTEM_UPDATE',
          title: 'Thông báo Hệ thống',
          message: content,
          actionUrl: actionUrl
      });

      this.toast.show('Đã đăng và Broadcast thông báo tới tất cả người dùng!', 'success');
      this.newUpdateContent = '';
      this.newUpdateActionUrl = '';
  }

  async deleteSystemUpdate(id: string) {
      if (await this.confirmationService.confirm({ message: 'Bạn muốn xóa thông báo này?', confirmText: 'Xóa' })) {
          const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates/${id}`);
          await deleteDoc(ref);
          this.toast.show('Đã xóa thông báo', 'info');
      }
  }

  async saveVersion() {
      const val = this.versionControl.value;
      if (val) {
          await this.state.saveSystemVersion(val);
          this.toast.show('Đã cập nhật phiên bản!');
      }
  }

  async saveAvatarStyle(style: string) {
      await this.state.saveAvatarStyle(style);
      this.toast.show('Đã cập nhật giao diện Avatar!');
  }

  async loadUsage() {
      try {
          const estimate = await this.fb.getStorageEstimate();
          this.storageEstimate.set(estimate);
      } catch (e) { this.toast.show('Lỗi tính dung lượng.', 'error'); }
  }

  savePrintConfig() { this.state.savePrintConfig(this.printConfig()); }
  copyRules() { navigator.clipboard.writeText(this.firestoreRules()).then(() => this.toast.show('Đã copy Rules!')); }
  
  async exportData() {
      try {
          const data = await this.fb.exportData();
          const json = JSON.stringify(data, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = `LIMS_Backup_${this.fb.APP_ID}.json`; a.click(); URL.revokeObjectURL(url);
          this.toast.show('Đã tải backup.');
      } catch (e) { this.toast.show('Backup lỗi', 'error'); }
  }

  async importData(event: any) {
      const file = event.target.files[0]; if (!file) return;
      if (await this.confirmationService.confirm({ message: 'Restore sẽ GHI ĐÈ dữ liệu. Tiếp tục?', confirmText: 'Restore', isDangerous: true })) {
          const reader = new FileReader();
          reader.onload = async (e: any) => {
              try { await this.fb.importData(JSON.parse(e.target.result)); this.toast.show('Restore thành công!', 'success'); setTimeout(() => window.location.reload(), 1000); } 
              catch (err) { this.toast.show('File lỗi', 'error'); }
          };
          reader.readAsText(file);
      }
  }

  addCategory() { this.categoriesLocal.update(c => [...c, { id: '', name: '' }]); }
  removeCategory(index: number) { this.categoriesLocal.update(c => c.filter((_, i) => i !== index)); }
  async saveCategories() {
      const validCategories = this.categoriesLocal().filter(c => c.id && c.id.trim() && c.name && c.name.trim());
      if (validCategories.length === 0) {
          this.toast.show('Phân loại không được để trống hoàn toàn.', 'error');
          return;
      }
      await this.state.saveCategoriesConfig(validCategories);
      this.toast.show('Đã cập nhật danh mục phân loại.', 'success');
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
      
      this.exportArchiverToExcel(logs, requests);
      
    } catch (e) {
      this.toast.show('Lỗi khi tải dữ liệu cũ.', 'error');
      this.archiverStatus.set('idle');
    }
  }

  private exportArchiverToExcel(logs: any[], requests: any[]) {
    this.archiverStatus.set('exporting');
    try {
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
      this.toast.show('Lỗi khi tạo file Excel.', 'error');
      this.archiverStatus.set('idle');
    }
  }

  cancelArchiver() {
      this.archiverStatus.set('idle');
      this.archiverData.set({logs: [], requests: []});
  }

  async confirmDeleteArchiver() {
    const data = this.archiverData();
    if (data.logs.length === 0 && data.requests.length === 0) return;
    
    const count = data.logs.length + data.requests.length;
    if (!await this.confirmationService.confirm({
      message: `CẢNH BÁO: Tác vụ này sẽ XÓA VĨNH VIỄN ${count} bản ghi cũ khỏi Firebase. Bạn CHẮC CHẮN MÌNH ĐÃ TẢI LƯU TRỮ CHƯA?`,
      confirmText: 'XÓA THẬT KỸ',
      isDangerous: true
    })) return;

    this.archiverStatus.set('deleting');
    try {
      if (data.logs.length > 0) {
        await this.fb.deleteDocsInBatch('logs', data.logs.map(d => d.id));
      }
      if (data.requests.length > 0) {
        await this.fb.deleteDocsInBatch('requests', data.requests.map(d => d.id));
      }
      this.toast.show(`Thành công! Đã dọn dẹp ${count} bản ghi cũ rác.`, 'success');
      this.archiverStatus.set('idle');
      this.archiverData.set({logs: [], requests: []});
      this.loadUsage(); // Cập nhật lại số liệu
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
            const workbook = XLSX.read(data, { type: 'array' });
            
            let logsToRestore: any[] = [];
            let reqsToRestore: any[] = [];

            if (workbook.SheetNames.includes('Logs')) {
                const ws = workbook.Sheets['Logs'];
                logsToRestore = XLSX.utils.sheet_to_json(ws);
            }
            if (workbook.SheetNames.includes('Requests')) {
                const ws = workbook.Sheets['Requests'];
                reqsToRestore = XLSX.utils.sheet_to_json(ws);
            }

            if (logsToRestore.length === 0 && reqsToRestore.length === 0) {
                this.toast.show('Không tìm thấy dữ liệu hợp lệ trong file Excel.', 'error');
                this.archiverStatus.set('idle');
                return;
            }

            let restoredCount = 0;
            if (logsToRestore.length > 0) {
                restoredCount += await this.fb.restoreArchivedData('logs', logsToRestore);
            }
            if (reqsToRestore.length > 0) {
                restoredCount += await this.fb.restoreArchivedData('requests', reqsToRestore);
            }

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
    }
    reader.readAsArrayBuffer(file);
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
      if (!await this.confirmationService.confirm({ message: 'Thao tác này là KHÔNG THỂ PHỤC HỒI. Nó gửi lệnh ÉP TOÀN BỘ NHÂN VIÊN bị Reset App. Tiếp tục?', confirmText: 'DỌN RÁC NGAY', isDangerous: true })) return;
      
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
}
