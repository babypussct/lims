
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MasterTargetService } from './master-target.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { MasterAnalyte } from '../../core/models/sop.model';
import { generateSlug, formatDate } from '../../shared/utils/utils';
import { Router } from '@angular/router';
import { FormLabelA11yDirective } from '../../shared/directives/form-label-a11y.directive';
import { AppButtonComponent, AppEmptyStateComponent, AppModalShellComponent, AppPageHeaderComponent, AppToolbarComponent } from '../../shared/components/ui';

@Component({
  selector: 'app-master-target-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FormLabelA11yDirective, AppButtonComponent, AppEmptyStateComponent, AppModalShellComponent, AppPageHeaderComponent, AppToolbarComponent],
  template: `
    <div class="h-full flex flex-col fade-in bg-slate-50 dark:bg-slate-900 relative pb-10">
        
        <!-- Header -->
        <app-page-header
            title="Thư viện chỉ tiêu gốc"
            subtitle="Danh mục chỉ tiêu gốc dùng để đồng bộ tên, mã và đơn vị chuẩn."
            icon="fa-book-medical">
            <div pageHeaderActions class="contents">
                <app-button variant="ghost" size="sm" (click)="goBack()">
                    <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> <span class="hidden md:inline">Cấu hình</span>
                </app-button>
                <!-- Migrate Button -->
                <app-button variant="danger" size="sm" (click)="migrateHyphenToUnderscore()" [disabled]="isProcessing()">
                    <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Migrate data (- to _)
                </app-button>

                <!-- Export Button -->
                <app-button variant="secondary" size="sm" (click)="exportToExcel()" [disabled]="isProcessing() || isLoading() || items().length === 0">
                    <i class="fa-solid fa-file-export" aria-hidden="true"></i> Export Excel
                </app-button>

                <!-- Import Button -->
                <app-button variant="secondary" size="sm" (click)="fileInput.click()">
                    <i class="fa-solid fa-file-excel" aria-hidden="true"></i> Import Excel
                </app-button>
                <input #fileInput type="file" class="hidden" accept=".xlsx, .csv" (change)="onFileSelected($event)">

                <app-button size="sm" (click)="openModal()">
                    <i class="fa-solid fa-plus" aria-hidden="true"></i> Thêm chỉ tiêu
                </app-button>
            </div>
        </app-page-header>

        <app-toolbar>
            <div toolbarSearch class="relative">
                <i class="fa-solid fa-search absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                <input [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)"
                       class="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm"
                       placeholder="Tìm kiếm tên chất, CAS number, công thức hóa học...">
            </div>
        </app-toolbar>

        <div class="flex-1 p-6 overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900">
            <!-- List -->
            <div class="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <div class="overflow-y-auto custom-scrollbar flex-1 p-2">
                    @if (isLoading()) {
                        <div class="p-10 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-2xl"></i></div>
                    } @else {
                        <table class="w-full text-sm text-left border-collapse">
                            <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/70 sticky top-0 z-10 font-bold">
                                <tr>
                                    <th class="px-4 py-3 border-b border-slate-100 dark:border-slate-700">Tên chỉ tiêu / ID</th>
                                    <th class="px-4 py-3 border-b border-slate-100 dark:border-slate-700">Thông tin hóa học</th>
                                    <th class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 text-center">Đơn vị Chuẩn</th>
                                    <th class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 text-right">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                @for (item of filteredItems(); track item.id) {
                                    <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition group">
                                        <td class="px-4 py-3">
                                            <div class="font-bold text-slate-800 dark:text-slate-100 text-sm">{{item.name}}</div>
                                            <div class="text-[10px] font-mono text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded w-fit mt-1 border border-slate-200 dark:border-slate-600">{{item.id}}</div>
                                            @if (item.aliases?.length) {
                                                <div class="text-[10px] text-indigo-500 mt-1.5 line-clamp-2" [title]="item.aliases!.join(', ')">
                                                    Alias: {{item.aliases!.join(', ')}}
                                                </div>
                                            }
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="flex flex-col gap-1 text-xs">
                                                @if(item.cas_number) { <span class="text-slate-600 dark:text-slate-300"><span class="font-bold text-slate-400 w-8 inline-block">CAS:</span> {{item.cas_number}}</span> }
                                                @if(item.chemical_formula) { <span class="text-slate-600 dark:text-slate-300"><span class="font-bold text-slate-400 w-8 inline-block">CT:</span> <span class="font-serif">{{item.chemical_formula}}</span></span> }
                                            </div>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <span class="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded text-xs font-bold">{{item.default_unit || '-'}}</span>
                                        </td>
                                        <td class="px-4 py-3 text-right">
                                            <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button (click)="openModal(item)" aria-label="Sửa chỉ tiêu" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition shadow-sm flex items-center justify-center">
                                                    <i class="fa-solid fa-pen"></i>
                                                </button>
                                                <button (click)="deleteItem(item)" aria-label="Xóa chỉ tiêu" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition shadow-sm flex items-center justify-center">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr><td colspan="4"><app-empty-state icon="fa-magnifying-glass" title="Không tìm thấy dữ liệu" message="Thử thay đổi từ khóa tìm kiếm." /></td></tr>
                                }
                            </tbody>
                        </table>
                    }
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">
                    Tổng số: {{filteredItems().length}} chỉ tiêu
                </div>
            </div>
        </div>

        <!-- ADD/EDIT MODAL -->
        @if (showModal()) {
            <app-modal-shell
                [title]="isEditing() ? 'Cập nhật chỉ tiêu' : 'Thêm chỉ tiêu mới'"
                size="sm"
                (closed)="closeModal()"
            >
                    <form modalBody id="master-target-form" appFormLabelA11y [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Tên chỉ tiêu <span class="text-red-500">*</span></label>
                                <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-indigo-500 transition" placeholder="VD: Chloramphenicol">
                            </div>
                            
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Mã định danh (tự tạo)</label>
                                <input formControlName="id" class="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-indigo-500 transition bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100" placeholder="Auto-generated hoặc tự điền...">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Số CAS</label>
                                <input formControlName="cas_number" class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition" placeholder="56-75-7">
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Đơn vị mặc định</label>
                                <input formControlName="default_unit" class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition" placeholder="ppb, µg/kg">
                                </div>
                            </div>

                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Công thức hóa học</label>
                                <input formControlName="chemical_formula" class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 text-xs font-serif outline-none focus:border-indigo-500 transition" placeholder="C11H12Cl2N2O5">
                            </div>

                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Tên khác / Alias khi import</label>
                                <textarea formControlName="aliasesText" rows="3"
                                          class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition resize-none"
                                          placeholder="Mỗi alias một dòng hoặc phân cách bằng dấu chấm phẩy"></textarea>
                            </div>

                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Mô tả / Ghi chú</label>
                                <textarea formControlName="description" rows="2" class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition resize-none"></textarea>
                            </div>
                    </form>

                    <div modalFooter class="contents">
                        <app-button variant="secondary" (click)="closeModal()">Hủy</app-button>
                        <app-button type="submit" (click)="save()" [loading]="isProcessing()" [disabled]="form.invalid">
                            {{ isEditing() ? 'Lưu thay đổi' : 'Tạo mới' }}
                        </app-button>
                    </div>
            </app-modal-shell>
        }

        <!-- IMPORT PREVIEW MODAL -->
        @if (importPreview().length > 0) {
            <app-modal-shell title="Xem trước import" size="lg" (closed)="cancelImport()">
                <div modalBody class="space-y-4">
                    <div class="rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-xs text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200 flex items-start gap-2">
                        <i class="fa-solid fa-circle-info mt-0.5" aria-hidden="true"></i>
                        <div>
                            Kiểm tra dữ liệu bên dưới. Các dòng có <b>ID</b> trùng sẽ bị ghi đè.
                            <br>Tổng cộng: <b>{{importPreview().length}}</b> chỉ tiêu hợp lệ.
                        </div>
                    </div>

                    <div class="max-h-[58vh] overflow-auto custom-scrollbar rounded-xl border border-slate-200 dark:border-slate-700">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-100 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 font-bold uppercase sticky top-0">
                                <tr>
                                    <th class="p-3 border-b border-slate-200 dark:border-slate-700">Tên chỉ tiêu</th>
                                    <th class="p-3 border-b border-slate-200 dark:border-slate-700">Mã định danh (tự động)</th>
                                    <th class="p-3 border-b border-slate-200 dark:border-slate-700">CAS</th>
                                    <th class="p-3 border-b border-slate-200 dark:border-slate-700">Formula</th>
                                    <th class="p-3 border-b border-slate-200 dark:border-slate-700">Alias</th>
                                    <th class="p-3 border-b border-slate-200 dark:border-slate-700 text-center">Unit</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                @for (item of importPreview(); track $index) {
                                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/60">
                                        <td class="p-3 font-bold text-slate-700 dark:text-slate-200">{{item.name}}</td>
                                        <td class="p-3 font-mono text-slate-500 dark:text-slate-400">{{item.id}}</td>
                                        <td class="p-3 text-slate-600 dark:text-slate-300">{{item.cas_number || '-'}}</td>
                                        <td class="p-3 font-serif text-slate-600 dark:text-slate-300">{{item.chemical_formula || '-'}}</td>
                                        <td class="p-3 text-indigo-500">{{item.aliases?.join(', ') || '-'}}</td>
                                        <td class="p-3 text-center bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200">{{item.default_unit || '-'}}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div modalFooter class="contents">
                    <app-button variant="secondary" (click)="cancelImport()">Hủy</app-button>
                    <app-button (click)="confirmImport()" [loading]="isProcessing()">
                        @if(!isProcessing()) { <i class="fa-solid fa-check" aria-hidden="true"></i> } Xác nhận import
                    </app-button>
                </div>
            </app-modal-shell>
        }
    </div>
  `
})
export class MasterTargetManagerComponent implements OnInit {
  masterService = inject(MasterTargetService);
  firebase = inject(FirebaseService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder); // Explicitly type FormBuilder

  items = signal<MasterAnalyte[]>([]);
  isLoading = signal(false);
  isProcessing = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  searchTerm = signal('');
  editingItem = signal<MasterAnalyte | null>(null);

  // Import State
  importPreview = signal<MasterAnalyte[]>([]);

  form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      cas_number: [''],
      chemical_formula: [''],
      default_unit: [''],
      aliasesText: [''],
      description: ['']
  });

  async migrateHyphenToUnderscore() {
      if (!await this.confirmation.confirm({
          message: 'Are you sure you want to run the full migration replacing hyphens with underscores in IDs? This will modify master_analytes, targetGroups, sops, and requests.',
          confirmText: 'Run migration',
          isDangerous: true
      })) return;
      this.isProcessing.set(true);
      try {
          const { getDocs, collection, writeBatch, doc, serverTimestamp } = await import('firebase/firestore');
          const db = this.firebase.db;
          const appId = this.firebase.APP_ID;
          let batch = writeBatch(db);
          let opCount = 0;

          const commitBatch = async () => {
              if (opCount > 0) {
                  await batch.commit();
                  batch = writeBatch(db);
                  opCount = 0;
              }
          };

          console.log('Đang chuyển đổi danh mục chỉ tiêu...');
          const analytesSnap = await getDocs(collection(db, `artifacts/${appId}/master_analytes`));
          for (const d of analytesSnap.docs) {
              const docId = d.id;
              const data = d.data() as any;
              let changed = false;
              let newDocId = docId;

              if (docId.includes('-')) {
                  newDocId = docId.replace(/-/g, '_');
                  changed = true;
              }
              if (data.id && data.id.includes('-')) {
                  data.id = data.id.replace(/-/g, '_');
                  changed = true;
              }

              if (changed) {
                  data.lastUpdated = serverTimestamp(); // BẮT BUỘC ĐỂ DELTASYNC NHẬN DIỆN THAY ĐỔI
                  if (newDocId !== docId) {
                      batch.set(doc(db, `artifacts/${appId}/master_analytes`, newDocId), {
                          ...data,
                          _isDeleted: false,
                          lastUpdated: serverTimestamp()
                      });
                      batch.set(doc(db, `artifacts/${appId}/master_analytes`, docId), {
                          _isDeleted: true,
                          lastUpdated: serverTimestamp()
                      }, { merge: true });
                      opCount += 2;
                  } else {
                      batch.set(doc(db, `artifacts/${appId}/master_analytes`, docId), data);
                      opCount++;
                  }
                  if (opCount > 400) await commitBatch();
              }
          }
          await commitBatch();

          console.log('Đang chuyển đổi nhóm chỉ tiêu...');
          const tgSnap = await getDocs(collection(db, `artifacts/${appId}/target_groups`));
          for (const d of tgSnap.docs) {
              const data = d.data() as any;
              let changed = false;
              if (data.id && data.id.includes('-')) {
                  data.id = data.id.replace(/-/g, '_');
                  changed = true;
              }
              if (data.targets && Array.isArray(data.targets)) {
                  data.targets.forEach((t: any) => {
                      if (t.id && t.id.includes('-')) {
                          t.id = t.id.replace(/-/g, '_');
                          changed = true;
                      }
                  });
              }
              if (changed) {
                  data.lastUpdated = serverTimestamp();
                  if (d.id.includes('-')) {
                      const newId = d.id.replace(/-/g, '_');
                      batch.set(doc(db, `artifacts/${appId}/target_groups`, newId), data);
                      batch.delete(doc(db, `artifacts/${appId}/target_groups`, d.id));
                      opCount += 2;
                  } else {
                      batch.set(doc(db, `artifacts/${appId}/target_groups`, d.id), data);
                      opCount++;
                  }
                  if (opCount > 400) await commitBatch();
              }
          }
          await commitBatch();

          console.log('Migrating SOPs...');
          const sopsSnap = await getDocs(collection(db, `artifacts/${appId}/sops`));
          for (const d of sopsSnap.docs) {
              const data = d.data() as any;
              let changed = false;
              if (data.targets && Array.isArray(data.targets)) {
                  data.targets.forEach((t: any) => {
                      if (t.id && t.id.includes('-')) {
                          t.id = t.id.replace(/-/g, '_');
                          changed = true;
                      }
                  });
              }
              if (changed) {
                  data.lastUpdated = serverTimestamp();
                  batch.set(doc(db, `artifacts/${appId}/sops`, d.id), data);
                  opCount++;
                  if (opCount > 400) await commitBatch();
              }
          }
          await commitBatch();

          console.log('Migrating Requests...');
          const reqsSnap = await getDocs(collection(db, `artifacts/${appId}/requests`));
          for (const d of reqsSnap.docs) {
              const data = d.data() as any;
              let changed = false;

              if (data.targetIds && Array.isArray(data.targetIds)) {
                  const newTargetIds = data.targetIds.map((tid: string) => tid.includes('-') ? tid.replace(/-/g, '_') : tid);
                  if (JSON.stringify(newTargetIds) !== JSON.stringify(data.targetIds)) {
                      data.targetIds = newTargetIds;
                      changed = true;
                  }
              }

              if (data.tests && Array.isArray(data.tests)) {
                  data.tests.forEach((test: any) => {
                      if (test.targets && Array.isArray(test.targets)) {
                          test.targets.forEach((t: any) => {
                              if (t.id && t.id.includes('-')) {
                                  t.id = t.id.replace(/-/g, '_');
                                  changed = true;
                              }
                          });
                      }
                  });
              }

              if (data.sampleTargetMap) {
                  for (const sampleId of Object.keys(data.sampleTargetMap)) {
                      const arr = data.sampleTargetMap[sampleId];
                      if (Array.isArray(arr)) {
                          const newArr = arr.map((id: string) => id.includes('-') ? id.replace(/-/g, '_') : id);
                          if (JSON.stringify(newArr) !== JSON.stringify(arr)) {
                              data.sampleTargetMap[sampleId] = newArr;
                              changed = true;
                          }
                      } else if (typeof arr === 'object' && arr !== null) {
                          // In case it's a map not an array
                          const tMap: any = arr;
                          for (const k of Object.keys(tMap)) {
                              if (k.includes('-')) {
                                  const newK = k.replace(/-/g, '_');
                                  tMap[newK] = tMap[k];
                                  delete tMap[k];
                                  changed = true;
                              }
                          }
                      }
                  }
              }

              if (data.analysisResult && data.analysisResult.resultData) {
                  for (const sampleId of Object.keys(data.analysisResult.resultData)) {
                      const rData = data.analysisResult.resultData[sampleId];
                      for (const k of Object.keys(rData)) {
                          if (k.includes('-')) {
                              const newK = k.replace(/-/g, '_');
                              rData[newK] = rData[k];
                              delete rData[k];
                              changed = true;
                          }
                      }
                  }
              }
              
              if (changed) {
                  data.lastUpdated = serverTimestamp();
                  batch.set(doc(db, `artifacts/${appId}/requests`, d.id), data);
                  opCount++;
                  if (opCount > 400) await commitBatch();
              }
          }
          await commitBatch();

          this.toast.show('Migration completed successfully! Reloading...', 'success');
          
          // Xóa cache cục bộ để DeltaSync tải lại toàn bộ danh sách mới nhất
          localStorage.removeItem(`delta_master_analytes_${appId}`);
          localStorage.removeItem(`delta_master_analytes_cursor_${appId}`);
          
          setTimeout(() => window.location.reload(), 1500);
      } catch (error: any) {
          console.error('Migration error:', error);
          this.toast.show('Migration failed: ' + error.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  filteredItems = computed(() => {
      const term = this.searchTerm().toLowerCase().trim();
      if (!term) return this.items();
      return this.items().filter(i => 
          i.name.toLowerCase().includes(term) || 
          i.id.includes(term) ||
          (i.aliases || []).some(alias => alias.toLowerCase().includes(term)) ||
          i.cas_number?.includes(term) ||
          i.chemical_formula?.toLowerCase().includes(term)
      );
  });

  ngOnInit() {
      this.loadData();
  }

  async loadData() {
      this.isLoading.set(true);
      try {
          const data = await this.masterService.getAll();
          this.items.set(data);
      } catch (e) {
          this.toast.show('Lỗi tải dữ liệu', 'error');
      } finally {
          this.isLoading.set(false);
      }
  }

  goBack() {
      this.router.navigate(['/settings/data/master']);
  }

  openModal(item?: MasterAnalyte) {
      this.showModal.set(true);
      if (item) {
          this.isEditing.set(true);
          this.editingItem.set(item);
          this.form.patchValue({
              ...item,
              aliasesText: (item.aliases || []).join('\n')
          });
      } else {
          this.isEditing.set(false);
          this.editingItem.set(null);
          this.form.reset();
      }
      this.form.controls.id.enable();
  }

  closeModal() {
      this.showModal.set(false);
      this.editingItem.set(null);
  }

  onNameChange(event: any) {
      if (!this.isEditing()) {
          this.form.patchValue({ id: generateSlug(event.target.value) });
      }
  }

  async save() {
      if (this.form.invalid) return;
      this.isProcessing.set(true);
      
      const val = this.form.getRawValue();
      const item: MasterAnalyte = {
          id: (val.id || '').trim(),
          name: (val.name || '').trim(),
          cas_number: (val.cas_number || '').trim(),
          chemical_formula: (val.chemical_formula || '').trim(),
          default_unit: (val.default_unit || '').trim(),
          aliases: splitAliases(val.aliasesText || ''),
          description: (val.description || '').trim()
      };

      try {
          const oldItem = this.editingItem();
          if (this.isEditing() && oldItem && oldItem.id !== item.id) {
              // ID changed: delete old document first
              await this.masterService.delete(oldItem.id);
          }
          await this.masterService.save(item);
          this.toast.show('Đã lưu thành công', 'success');
          this.closeModal();
          this.loadData();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async deleteItem(item: MasterAnalyte) {
      if (await this.confirmation.confirm(`Xóa chỉ tiêu gốc "${item.name}"?`)) {
          try {
              await this.masterService.delete(item.id);
              this.toast.show('Đã xóa');
              this.loadData();
          } catch (e: any) {
              this.toast.show('Lỗi: ' + e.message, 'error');
          }
      }
  }

  // --- EXCEL IMPORT LOGIC ---

  async onFileSelected(event: any) {
      const file = event.target.files[0];
      if (!file) return;

      this.isLoading.set(true);
      try {
          const XLSX = await import('xlsx');
          const reader = new FileReader();
          
          reader.onload = (e: any) => {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
              const rawData: any[] = XLSX.utils.sheet_to_json(firstSheet);
              
              this.parseImportData(rawData);
              this.isLoading.set(false);
              event.target.value = ''; // Reset input
          };
          reader.readAsArrayBuffer(file);
          
      } catch(e: any) {
          this.toast.show('Lỗi đọc file: ' + e.message, 'error');
          this.isLoading.set(false);
      }
  }

  parseImportData(data: any[]) {
      const parsed: MasterAnalyte[] = [];
      const normalize = (k: string) => k.toLowerCase().trim();

      for(const row of data) {
          // Flexible Column Matching
          let name = '';
          let cas = '';
          let formula = '';
          let unit = '';
          let desc = '';
          let aliases: string[] = [];

          // Loop through keys to find matches
          Object.keys(row).forEach(key => {
              const k = normalize(key);
              const val = (row[key] || '').toString().trim();
              
              if (k.includes('alias') || k.includes('bí danh') || k.includes('tên khác')) aliases = splitAliases(val);
              else if (k.includes('name') || k.includes('tên') || k.includes('chất')) name = val;
              else if (k.includes('cas')) cas = val;
              else if (k.includes('formula') || k.includes('công thức') || k.includes('cthh')) formula = val;
              else if (k.includes('unit') || k.includes('đơn vị')) unit = val;
              else if (k.includes('desc') || k.includes('mô tả') || k.includes('note')) desc = val;
          });

          if (name) {
              parsed.push({
                  id: generateSlug(name),
                  name: name,
                  aliases,
                  cas_number: cas,
                  chemical_formula: formula,
                  default_unit: unit || 'ppb',
                  description: desc
              });
          }
      }

      if (parsed.length > 0) {
          this.importPreview.set(parsed);
          this.toast.show(`Tìm thấy ${parsed.length} dòng hợp lệ.`);
      } else {
          this.toast.show('Không tìm thấy dữ liệu hợp lệ trong file.', 'info');
      }
  }

  cancelImport() {
      this.importPreview.set([]);
  }

  async confirmImport() {
      const data = this.importPreview();
      if (data.length === 0) return;

      this.isProcessing.set(true);
      try {
          await this.masterService.saveBatch(data);
          this.toast.show(`Đã import thành công ${data.length} chỉ tiêu.`, 'success');
          this.importPreview.set([]);
          this.loadData();
      } catch (e: any) {
          this.toast.show('Không thể lưu dữ liệu nhập: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async exportToExcel() {
      this.isProcessing.set(true);
      try {
          const XLSX = await import('xlsx');
          const dataToExport = this.items().map(item => ({
              'Mã định danh': item.id,
              'Tên chỉ tiêu': item.name,
              'Tên khác / Alias': (item.aliases || []).join('; '),
              'Số CAS': item.cas_number || '',
              'Công thức hóa học': item.chemical_formula || '',
              'Đơn vị mặc định': item.default_unit || 'ppb',
              'Mô tả / Ghi chú': item.description || ''
          }));

          const ws = XLSX.utils.json_to_sheet(dataToExport);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Danh mục chỉ tiêu gốc");

          // Auto-adjust column width
          const maxLens = dataToExport.reduce((acc: any, row: any) => {
              Object.keys(row).forEach(key => {
                  const val = row[key]?.toString() || '';
                  acc[key] = Math.max(acc[key] || 10, val.length, key.length);
              });
              return acc;
          }, {});
          ws['!cols'] = Object.keys(maxLens).map(key => ({ wch: maxLens[key] + 3 }));

          const fileName = `LIMS_Master_Analytes.xlsx`;
          XLSX.writeFile(wb, fileName);
          this.toast.show('Xuất tệp Excel thành công!', 'success');
      } catch (e: any) {
          this.toast.show('Lỗi xuất file: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }
}

function splitAliases(value: string): string[] {
  return Array.from(new Set(
    String(value || '')
      .split(/\r?\n|;/)
      .map(alias => alias.trim())
      .filter(Boolean)
  ));
}
