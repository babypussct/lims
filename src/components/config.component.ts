
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { HealthCheckItem } from '../models/config.model';
import { ConfirmationService } from '../services/confirmation.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 pb-20 fade-in">
        <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-gears text-slate-500"></i> Cấu hình Hệ thống
        </h2>

        <!-- 0. User & RBAC Info -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 class="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-id-card text-teal-600"></i> Thông tin Tài khoản & Phân quyền (RBAC)
            </h3>
            
            @if (auth.currentUser(); as user) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <!-- User Info -->
                 <div class="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div class="flex justify-between items-start">
                        <div>
                           <label class="text-[10px] uppercase font-bold text-slate-400">Display Name</label>
                           <div class="font-bold text-slate-800">{{user.displayName}}</div>
                        </div>
                        <div class="text-right">
                           <label class="text-[10px] uppercase font-bold text-slate-400">Role Hiện tại</label>
                           <div>
                              <span class="px-2 py-0.5 rounded text-xs font-bold uppercase"
                                    [class]="user.role === 'manager' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'">
                                 {{user.role}}
                              </span>
                           </div>
                        </div>
                    </div>
                    
                    <div>
                       <label class="text-[10px] uppercase font-bold text-slate-400">Email</label>
                       <div class="text-sm font-mono text-slate-600">{{user.email}}</div>
                    </div>
                    
                    <div>
                       <label class="text-[10px] uppercase font-bold text-slate-400">User ID (UID) - Dùng để cấp quyền</label>
                       <div class="flex gap-2">
                          <code class="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-mono text-slate-600 flex-1 overflow-hidden text-ellipsis">{{user.uid}}</code>
                          <button (click)="copyUid(user.uid)" class="text-blue-600 hover:text-blue-800 text-xs font-bold px-2">Copy</button>
                       </div>
                    </div>
                 </div>

                 <!-- Guide -->
                 <div class="space-y-2 text-sm text-slate-600">
                    <p class="font-bold text-slate-800"><i class="fa-solid fa-circle-info text-blue-500"></i> Logic Phân Quyền:</p>
                    <ul class="list-disc list-inside space-y-1 ml-1 text-xs">
                       <li><b>Staff (Mặc định):</b> Xem kho, tính toán SOP, gửi yêu cầu.</li>
                       <li><b>Manager:</b> Sửa kho, sửa SOP, duyệt yêu cầu, xem thống kê, xóa dữ liệu.</li>
                    </ul>
                    
                    <div class="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-xs">
                        <b>Cách nâng cấp lên Manager:</b>
                        <ol class="list-decimal list-inside mt-1 space-y-1">
                           <li>Copy <b>UID</b> bên cạnh.</li>
                           <li>Vào Firebase Console > Firestore Database.</li>
                           <li>Tạo Document: <code>artifacts/{{fb.APP_ID}}/users/<b>[PASTE_UID]</b></code></li>
                           <li>Thêm field: <code>role: "manager"</code> (string).</li>
                        </ol>
                    </div>
                 </div>
              </div>
            }
        </div>

        <!-- 1. Firestore Security Rules Generator -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 class="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-shield-cat text-orange-500"></i> Cấu hình Bảo mật (Firestore Rules)
            </h3>
            <p class="text-sm text-slate-600 mb-3">
                <span class="text-red-600 font-bold">Quan trọng:</span> Hãy copy đoạn mã mới dưới đây và dán vào tab <b>Rules</b> trong Firebase Console để khắc phục lỗi phân quyền (bao gồm lỗi xóa hàng loạt).
            </p>

            <div class="relative group">
                <textarea readonly class="w-full h-64 bg-slate-800 text-green-400 font-mono text-xs p-4 rounded-lg focus:outline-none" spellcheck="false">{{firestoreRules()}}</textarea>
                <button (click)="copyRules()" class="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs font-bold backdrop-blur-sm transition">
                    <i class="fa-regular fa-copy"></i> Copy Rules
                </button>
            </div>
        </div>

        <!-- 2. App ID Context -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 class="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-server text-blue-500"></i> App Context (Data ID)
            </h3>
            <div class="flex gap-4 items-end">
                <div class="flex-1 space-y-1">
                    <label class="text-xs font-bold text-slate-500 uppercase">Current App ID</label>
                    <input [formControl]="appIdControl" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none">
                    <p class="text-[10px] text-slate-400">Thay đổi ID sẽ chuyển sang kho dữ liệu khác (Refresh required).</p>
                </div>
                <button (click)="saveAppId()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition h-10">
                    Switch Context
                </button>
            </div>
        </div>

        <!-- 3. System Health -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-slate-700 flex items-center gap-2">
                    <i class="fa-solid fa-heart-pulse text-red-500"></i> Trạng thái Kết nối
                </h3>
                <button (click)="checkHealth()" class="text-xs text-blue-600 hover:underline"><i class="fa-solid fa-rotate"></i> Refresh</button>
            </div>

            <div class="overflow-hidden border border-slate-200 rounded-lg">
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                        <tr>
                            <th class="px-4 py-2 border-b">Collection</th>
                            <th class="px-4 py-2 border-b">Path</th>
                            <th class="px-4 py-2 border-b text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @if (loadingHealth()) {
                            <tr><td colspan="3" class="p-4 text-center text-slate-400 italic">Checking connectivity...</td></tr>
                        } @else {
                            @for (item of healthItems(); track item.collection) {
                                <tr class="hover:bg-slate-50">
                                    <td class="px-4 py-2 font-bold text-slate-700 capitalize">{{item.collection}}</td>
                                    <td class="px-4 py-2 font-mono text-xs text-slate-500">{{item.path}}</td>
                                    <td class="px-4 py-2 text-center">
                                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                                              [class]="item.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                                            <i class="fa-solid" [class]="item.status === 'Online' ? 'fa-check' : 'fa-xmark'"></i> {{item.status}}
                                        </span>
                                    </td>
                                </tr>
                            }
                        }
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 4. Backup & Restore -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 class="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-database text-purple-500"></i> Sao lưu & Phục hồi
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button (click)="exportData()" class="p-4 border border-slate-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition flex items-center justify-center gap-3 group">
                     <i class="fa-solid fa-download text-2xl group-hover:scale-110 transition"></i>
                     <div class="text-left">
                        <div class="font-bold">Backup Data</div>
                        <div class="text-xs text-slate-500 font-normal group-hover:text-purple-600">Download inventory & SOPs as JSON</div>
                     </div>
                </button>

                <label class="p-4 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition flex items-center justify-center gap-3 cursor-pointer group">
                     <i class="fa-solid fa-upload text-2xl group-hover:scale-110 transition"></i>
                     <div class="text-left">
                        <div class="font-bold">Restore Data</div>
                        <div class="text-xs text-slate-500 font-normal group-hover:text-blue-600">Import .JSON to overwrite current data</div>
                     </div>
                     <input type="file" class="hidden" accept=".json" (change)="importData($event)">
                </label>
            </div>
        </div>

        <!-- 5. Danger Zone -->
        <div class="bg-red-50 rounded-xl border border-red-200 p-6">
            <h3 class="font-bold text-red-800 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation"></i> Danger Zone
            </h3>
            <div class="flex flex-col md:flex-row gap-4">
                <button (click)="loadSampleData()" class="flex-1 bg-white border border-red-300 text-red-600 px-4 py-3 rounded-lg text-sm font-bold hover:bg-red-50 transition shadow-sm flex items-center justify-center gap-2">
                    <i class="fa-solid fa-flask-vial"></i> Nạp Dữ liệu Mẫu (NAFI6 SOPs)
                </button>
                
                <button (click)="resetDefaults()" class="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-sm flex items-center justify-center gap-2">
                    <i class="fa-solid fa-eraser"></i> Xóa sạch Dữ liệu (Wipe All)
                </button>
            </div>
            <p class="text-xs text-red-500 mt-2 text-center">Thao tác Nạp mẫu sẽ ghi đè dữ liệu hiện tại. Hãy sao lưu trước khi thực hiện.</p>
        </div>
    </div>
  `
})
export class ConfigComponent implements OnInit {
  fb = inject(FirebaseService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);

  appIdControl = new FormControl('');
  
  loadingHealth = signal(false);
  healthItems = signal<HealthCheckItem[]>([]);

  // Generate Rules based on current App ID
  firestoreRules = computed(() => {
    const appId = this.fb.APP_ID;
    return `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is manager
    function isManager() {
      return exists(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid))
          && get(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)).data.role == 'manager';
    }

    // 1. User Profiles (For RBAC)
    match /artifacts/${appId}/users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; 
    }

    // 2. Inventory (Public Read, Manager Write/Delete)
    match /artifacts/${appId}/inventory/{itemId} {
      allow read: if request.auth != null;
      allow write, delete: if isManager();
    }

    // 3. SOPs (Public Read, Manager Write/Delete)
    match /artifacts/${appId}/sops/{sopId} {
      allow read: if request.auth != null;
      allow write, delete: if isManager();
    }

    // 4. Requests (Staff create, Manager approve/update/delete)
    match /artifacts/${appId}/requests/{reqId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null; 
      allow update, delete: if isManager(); 
    }

    // 5. Logs (Manager Read/Write/Delete)
    match /artifacts/${appId}/logs/{logId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null; 
      allow delete: if isManager(); 
    }

    // 6. Stats (Read All, Manager Write/Delete)
    match /artifacts/${appId}/stats/{statId} {
      allow read: if request.auth != null;
      allow write, delete: if isManager();
    }
    
    // 7. Config (Read All for Health Check, Manager Write)
    match /artifacts/${appId}/config/{docId} {
      allow read: if request.auth != null;
      allow write, delete: if isManager();
    }
  }
}`;
  });

  ngOnInit() {
      this.appIdControl.setValue(this.fb.APP_ID);
      this.checkHealth();
  }

  async saveAppId() {
      const val = this.appIdControl.value;
      if (val && val !== this.fb.APP_ID) {
          const confirmed = await this.confirmationService.confirm('Chuyển đổi App Context sẽ tải lại trang. Tiếp tục?');
          if(confirmed) {
              this.fb.setAppId(val);
          }
      }
  }

  checkHealth() {
      this.loadingHealth.set(true);
      this.fb.checkSystemHealth().subscribe({
          next: (res) => {
              this.healthItems.set(res);
              this.loadingHealth.set(false);
          },
          error: () => this.loadingHealth.set(false)
      });
  }

  copyUid(uid: string) {
    navigator.clipboard.writeText(uid).then(() => {
      this.toast.show('Đã copy UID!');
    });
  }

  copyRules() {
    navigator.clipboard.writeText(this.firestoreRules()).then(() => {
        this.toast.show('Đã copy Rules! Hãy dán vào Firebase Console.');
    });
  }

  async exportData() {
      try {
          const data = await this.fb.exportData();
          const json = JSON.stringify(data, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `LIMS_Backup_${this.fb.APP_ID}_${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
          this.toast.show('Backup downloaded successfully');
      } catch (e) {
          this.toast.show('Export failed', 'error');
      }
  }

  async importData(event: any) {
      const file = event.target.files[0];
      if (!file) return;
      
      const confirmed = await this.confirmationService.confirm({
        message: 'CẢNH BÁO: Restore sẽ GHI ĐÈ dữ liệu hiện tại. Bạn có chắc chắn?',
        confirmText: 'Restore & Ghi đè',
        isDangerous: true
      });

      if (!confirmed) {
          event.target.value = '';
          return;
      }

      const reader = new FileReader();
      reader.onload = async (e: any) => {
          try {
              const json = JSON.parse(e.target.result);
              await this.fb.importData(json);
              this.toast.show('Restore successful! Please refresh.', 'success');
              setTimeout(() => window.location.reload(), 1500);
          } catch (err) {
              console.error(err);
              this.toast.show('Invalid JSON file or structure', 'error');
          }
      };
      reader.readAsText(file);
  }

  async resetDefaults() {
      const confirmed = await this.confirmationService.confirm({
        message: 'CỰC KỲ NGUY HIỂM: Bạn có chắc chắn muốn XÓA SẠCH toàn bộ dữ liệu (inventory, sops, logs, stats, phiếu in...)?\n\nHành động này không thể hoàn tác.',
        confirmText: 'Xóa Sạch Dữ Liệu',
        isDangerous: true
      });
      
      if (confirmed) {
          try {
              await this.fb.resetToDefaults();
              this.toast.show('System wiped successfully.', 'info');
              setTimeout(() => window.location.reload(), 1500);
          } catch (e) {
              console.error(e);
              this.toast.show('Wipe failed: ' + (e as any).message, 'error');
          }
      }
  }

  async loadSampleData() {
    const confirmed = await this.confirmationService.confirm({
      message: 'Hành động này sẽ XÓA dữ liệu hiện tại và nạp bộ SOP mẫu NAFI6. Tiếp tục?',
      confirmText: 'Xóa và Nạp Mẫu',
      isDangerous: true
    });

    if (confirmed) {
        try {
            await this.fb.loadSampleData();
            this.toast.show('Đã nạp dữ liệu mẫu! Đang tải lại...', 'success');
            setTimeout(() => window.location.reload(), 1500);
        } catch (e) {
            console.error(e);
            this.toast.show('Lỗi nạp mẫu', 'error');
        }
    }
  }
}
