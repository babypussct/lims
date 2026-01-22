
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormArray, Validators, FormsModule } from '@angular/forms';
import { TargetService } from './target.service';
import { MasterTargetService } from './master-target.service'; // Use Master Service
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { TargetGroup, SopTarget, MasterAnalyte } from '../../core/models/sop.model';
import { generateSlug } from '../../shared/utils/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-target-group-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="h-full flex flex-col fade-in bg-slate-50 relative pb-10">
        
        <!-- Header -->
        <div class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-30">
            <div class="flex items-center gap-4">
                <button (click)="goBack()" class="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2 transition">
                    <i class="fa-solid fa-arrow-left"></i> <span class="hidden md:inline">Cấu hình</span>
                </button>
                <div class="h-6 w-px bg-slate-200"></div>
                <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
                    <i class="fa-solid fa-layer-group text-teal-600"></i> Quản lý Bộ Chỉ tiêu (Target Groups)
                </h2>
            </div>
            
            <div class="flex gap-2">
                @if(isEditing()) {
                    <button (click)="cancelEdit()" class="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold text-xs transition">Hủy</button>
                    <button (click)="saveGroup()" [disabled]="form.invalid || isProcessing()" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-md transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-save"></i> } Lưu
                    </button>
                } @else {
                    <button (click)="createNew()" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-md transition flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i> Tạo Mới
                    </button>
                }
            </div>
        </div>

        <div class="flex-1 flex overflow-hidden">
            <!-- LIST SIDEBAR -->
            <div class="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                @if (isLoading()) {
                    <div class="p-4 text-center text-slate-400 text-xs"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>
                } @else {
                    @for (group of groups(); track group.id) {
                        <div (click)="selectGroup(group)" 
                             class="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition group relative"
                             [class.bg-teal-50]="selectedGroup()?.id === group.id"
                             [class.border-l-4]="selectedGroup()?.id === group.id"
                             [class.border-l-teal-500]="selectedGroup()?.id === group.id"
                             [class.border-l-transparent]="selectedGroup()?.id !== group.id">
                            
                            <div class="font-bold text-sm text-slate-700 mb-1">{{group.name}}</div>
                            <div class="text-[10px] text-slate-500 flex justify-between items-center">
                                <span>{{group.targets.length}} chỉ tiêu</span>
                                <button (click)="deleteGroup(group, $event)" class="w-6 h-6 rounded-full hover:bg-red-100 text-slate-300 hover:text-red-500 transition flex items-center justify-center">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    } @empty {
                        <div class="p-8 text-center text-slate-400 italic text-xs">Chưa có bộ chỉ tiêu nào.</div>
                    }
                }
            </div>

            <!-- EDITOR AREA -->
            <div class="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
                @if (isEditing()) {
                    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <form [formGroup]="form" class="max-w-4xl mx-auto space-y-6">
                            
                            <!-- Header Info -->
                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tên Bộ Chỉ tiêu <span class="text-red-500">*</span></label>
                                        <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-teal-500 transition" placeholder="VD: Nhóm Kháng sinh (Sulfonamides)">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mã ID (Slug)</label>
                                        <input formControlName="id" class="w-full border border-slate-200 bg-slate-100 rounded-lg p-2.5 text-xs font-mono text-slate-600 outline-none" readonly>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả / Ghi chú</label>
                                    <input formControlName="description" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-teal-500 transition" placeholder="Mô tả ngắn về nhóm này...">
                                </div>
                            </div>

                            <!-- Targets List -->
                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="font-bold text-slate-700 text-sm uppercase flex items-center gap-2">
                                        <i class="fa-solid fa-list-ul text-teal-500"></i> Danh sách Chỉ tiêu
                                    </h3>
                                    <div class="flex gap-2">
                                        <!-- NEW: Import from Master Library -->
                                        <button type="button" (click)="openLibraryModal()" class="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 active:scale-95">
                                            <i class="fa-solid fa-book-medical"></i> Chọn từ Master Library
                                        </button>
                                        <button type="button" (click)="addTarget()" class="text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 active:scale-95">
                                            <i class="fa-solid fa-plus"></i> Thêm dòng
                                        </button>
                                    </div>
                                </div>

                                <div formArrayName="targets" class="space-y-2">
                                    @for (t of targets.controls; track t; let i = $index) {
                                        <div [formGroupName]="i" class="flex gap-2 items-center p-2 bg-slate-50 rounded-lg border border-slate-100 group hover:border-teal-200 transition">
                                            <div class="w-6 h-6 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold">{{i+1}}</div>
                                            
                                            <!-- Logic for Linked ID -->
                                            @let isLinked = targets.at(i).get('isMasterLinked')?.value;

                                            <div class="flex-1 grid grid-cols-12 gap-2">
                                                <div class="col-span-4">
                                                    <input formControlName="name" (input)="onTargetNameChange(i, $event)" placeholder="Tên chất" class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-500">
                                                </div>
                                                <div class="col-span-3 relative">
                                                    <input formControlName="id" 
                                                           placeholder="ID (Auto)" 
                                                           [readonly]="isLinked"
                                                           class="w-full border border-slate-200 rounded px-2 py-1.5 text-xs font-mono text-slate-500 outline-none focus:border-teal-500"
                                                           [class.bg-slate-100]="isLinked"
                                                           [class.bg-white]="!isLinked"
                                                           [class.cursor-not-allowed]="isLinked">
                                                    @if(isLinked) {
                                                        <i class="fa-solid fa-link absolute right-2 top-2 text-[10px] text-teal-500" title="Linked to Master Library"></i>
                                                    }
                                                </div>
                                                <div class="col-span-2">
                                                    <input formControlName="unit" placeholder="Đơn vị" class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-teal-500 text-center">
                                                </div>
                                                <div class="col-span-3 grid grid-cols-2 gap-1">
                                                    <input formControlName="lod" placeholder="LOD" class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-teal-500 text-center">
                                                    <input formControlName="loq" placeholder="LOQ" class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-teal-500 text-center">
                                                </div>
                                            </div>
                                            
                                            <button type="button" (click)="targets.removeAt(i)" class="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-red-500 transition"><i class="fa-solid fa-times"></i></button>
                                        </div>
                                    }
                                </div>
                            </div>

                        </form>
                    </div>
                } @else {
                    <div class="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <i class="fa-solid fa-layer-group text-4xl mb-4 text-slate-300"></i>
                        <p class="text-sm font-medium">Chọn một bộ chỉ tiêu để sửa hoặc tạo mới.</p>
                    </div>
                }
            </div>
        </div>

        <!-- MASTER LIBRARY SELECTION MODAL -->
        @if (showLibraryModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh] animate-slide-up">
                    <div class="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <div>
                            <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                                <i class="fa-solid fa-book-medical text-teal-600"></i> Thư viện Master Data
                            </h3>
                            <p class="text-xs text-slate-500 mt-0.5">Danh mục chỉ tiêu gốc của hệ thống.</p>
                        </div>
                        <button (click)="showLibraryModal.set(false)" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times"></i></button>
                    </div>
                    
                    <div class="p-4 border-b border-slate-100 flex gap-2">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                            <input [ngModel]="librarySearchTerm()" (ngModelChange)="librarySearchTerm.set($event)" 
                                   class="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition" 
                                   placeholder="Tìm kiếm..." autofocus>
                        </div>
                        <button (click)="selectAllLibraryFiltered()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold whitespace-nowrap transition">Chọn hết</button>
                    </div>

                    <div class="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        @if (isLibraryLoading()) {
                            <div class="py-10 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>
                        } @else {
                            <div class="grid grid-cols-1 gap-1">
                                @for (analyte of filteredLibraryTargets(); track analyte.id) {
                                    <label class="flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition group"
                                           [class]="selectedLibraryIds().has(analyte.id) ? 'bg-teal-50 border-teal-200' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'">
                                        <input type="checkbox" [checked]="selectedLibraryIds().has(analyte.id)" (change)="toggleLibrarySelection(analyte.id)" class="w-4 h-4 accent-teal-600 rounded cursor-pointer">
                                        <div class="flex-1 min-w-0">
                                            <div class="font-bold text-sm text-slate-700 group-hover:text-teal-700 truncate">{{analyte.name}}</div>
                                            <div class="flex gap-2 mt-0.5 text-[10px]">
                                                <span class="font-mono text-slate-400 bg-slate-100 px-1.5 rounded">ID: {{analyte.id}}</span>
                                                @if(analyte.chemical_formula) { <span class="text-slate-500 font-serif">{{analyte.chemical_formula}}</span> }
                                            </div>
                                        </div>
                                        <div class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{{analyte.default_unit || 'N/A'}}</div>
                                    </label>
                                }
                                @if (filteredLibraryTargets().length === 0) {
                                    <div class="py-10 text-center text-slate-400 italic text-xs">Không tìm thấy kết quả.</div>
                                }
                            </div>
                        }
                    </div>

                    <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <div class="text-xs font-bold text-slate-500">
                            Đã chọn: <span class="text-teal-600 text-sm">{{selectedLibraryIds().size}}</span>
                        </div>
                        <div class="flex gap-2">
                            <button (click)="showLibraryModal.set(false)" class="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-bold text-xs transition">Đóng</button>
                            <button (click)="importSelectedLibraryTargets()" [disabled]="selectedLibraryIds().size === 0" class="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2">
                                <i class="fa-solid fa-file-import"></i> Import ({{selectedLibraryIds().size}})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
  `
})
export class TargetGroupManagerComponent implements OnInit {
  targetService = inject(TargetService);
  masterService = inject(MasterTargetService); // New Service
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder); // Explicitly type FormBuilder

  groups = signal<TargetGroup[]>([]);
  selectedGroup = signal<TargetGroup | null>(null);
  
  isLoading = signal(false);
  isProcessing = signal(false);
  isEditing = signal(false);

  // Library Modal State
  showLibraryModal = signal(false);
  isLibraryLoading = signal(false);
  libraryTargets = signal<MasterAnalyte[]>([]); // Changed to MasterAnalyte
  selectedLibraryIds = signal<Set<string>>(new Set());
  librarySearchTerm = signal('');

  form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      targets: this.fb.array([])
  });

  get targets() { return this.form.get('targets') as FormArray; }

  ngOnInit() {
      this.loadGroups();
  }

  async loadGroups() {
      this.isLoading.set(true);
      try {
          const data = await this.targetService.getAllGroups();
          this.groups.set(data);
      } catch (e) {
          this.toast.show('Lỗi tải dữ liệu', 'error');
      } finally {
          this.isLoading.set(false);
      }
  }

  goBack() {
      this.router.navigate(['/config']);
  }

  selectGroup(g: TargetGroup) {
      this.selectedGroup.set(g);
      this.isEditing.set(true);
      this.form.patchValue({ id: g.id, name: g.name, description: g.description });
      this.targets.clear();
      g.targets.forEach(t => this.addTargetRaw(t));
  }

  createNew() {
      this.selectedGroup.set(null);
      this.isEditing.set(true);
      this.form.reset({ id: '', name: '', description: '' });
      this.targets.clear();
      this.addTargetRaw({ id: '', name: '', unit: 'ppb' });
  }

  cancelEdit() {
      this.isEditing.set(false);
      this.selectedGroup.set(null);
  }

  addTarget() { this.addTargetRaw({ id: '', name: '', unit: 'ppb' }); }
  
  private addTargetRaw(t: Partial<SopTarget>) {
      this.targets.push(this.fb.group({
          id: [t.id || '', Validators.required],
          name: [t.name || '', Validators.required],
          unit: [t.unit || ''],
          lod: [t.lod || ''],
          loq: [t.loq || ''],
          isMasterLinked: [t.isMasterLinked || false] // Include hidden flag
      }));
  }

  onNameChange(event: any) {
      if (!this.selectedGroup()) {
          this.form.patchValue({ id: 'group_' + generateSlug(event.target.value) });
      }
  }

  onTargetNameChange(index: number, event: any) {
      const isLinked = this.targets.at(index).get('isMasterLinked')?.value;
      
      // Only auto-generate ID if NOT linked to Master
      if (!isLinked) {
          const val = event.target.value;
          const idControl = this.targets.at(index).get('id');
          if (idControl && (idControl.pristine || !idControl.value)) {
              idControl.setValue(generateSlug(val));
          }
      }
  }

  async saveGroup() {
      if (this.form.invalid) {
          this.form.markAllAsTouched();
          this.toast.show('Vui lòng kiểm tra các trường bắt buộc', 'error');
          return;
      }

      this.isProcessing.set(true);
      const val = this.form.value;
      
      const cleanTargets = (val.targets as SopTarget[])
          .filter(t => t.name)
          .map(t => {
              if (!t.id) t.id = generateSlug(t.name);
              return t;
          });

      const group: TargetGroup = {
          id: val.id!,
          name: val.name!,
          description: val.description || '',
          targets: cleanTargets
      };

      try {
          await this.targetService.saveGroup(group);
          this.toast.show('Đã lưu thành công', 'success');
          this.loadGroups();
          if(!this.selectedGroup()) this.selectGroup(group); 
      } catch (e: any) {
          this.toast.show('Lỗi lưu: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async deleteGroup(g: TargetGroup, event: Event) {
      event.stopPropagation();
      if(await this.confirmation.confirm(`Xóa bộ chỉ tiêu "${g.name}"?`)) {
          await this.targetService.deleteGroup(g.id);
          this.toast.show('Đã xóa');
          this.loadGroups();
          if (this.selectedGroup()?.id === g.id) this.cancelEdit();
      }
  }

  // --- CHANGED: LIBRARY MODAL LOGIC (Fetch from Master) ---

  filteredLibraryTargets = computed(() => {
      const term = this.librarySearchTerm().toLowerCase().trim();
      if (!term) return this.libraryTargets();
      return this.libraryTargets().filter(t => 
          t.name.toLowerCase().includes(term) || 
          t.id.toLowerCase().includes(term)
      );
  });

  async openLibraryModal() {
      this.selectedLibraryIds.set(new Set());
      this.librarySearchTerm.set('');
      this.showLibraryModal.set(true);
      
      if (this.libraryTargets().length === 0) {
          this.isLibraryLoading.set(true);
          try {
              const data = await this.masterService.getAll();
              this.libraryTargets.set(data);
          } catch(e) {
              this.toast.show('Lỗi kết nối Master Library', 'error');
          } finally {
              this.isLibraryLoading.set(false);
          }
      }
  }

  toggleLibrarySelection(id: string) {
      this.selectedLibraryIds.update(ids => {
          const newSet = new Set(ids);
          if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
          return newSet;
      });
  }

  selectAllLibraryFiltered() {
      const currentFilteredIds = this.filteredLibraryTargets().map(t => t.id);
      this.selectedLibraryIds.update(ids => {
          const newSet = new Set(ids);
          currentFilteredIds.forEach(id => newSet.add(id));
          return newSet;
      });
  }

  importSelectedLibraryTargets() {
      const selectedIds = this.selectedLibraryIds();
      if (selectedIds.size === 0) return;

      const currentTargets = this.form.get('targets') as FormArray;
      const existingIds = new Set(
          (currentTargets.value as SopTarget[]).map(t => t.id)
      );

      let addedCount = 0;
      this.libraryTargets().forEach(t => {
          if (selectedIds.has(t.id)) {
              if (!existingIds.has(t.id)) {
                  // Map MasterAnalyte to SopTarget with LINKED flag
                  this.addTargetRaw({
                      id: t.id,
                      name: t.name,
                      unit: t.default_unit || 'ppb',
                      isMasterLinked: true // <-- LOCK THIS ID
                  });
                  existingIds.add(t.id);
                  addedCount++;
              }
          }
      });

      if (addedCount > 0) {
          this.toast.show(`Đã thêm ${addedCount} chỉ tiêu từ Master Library.`, 'success');
      } else {
          this.toast.show('Các chỉ tiêu đã chọn đều có sẵn trong danh sách.', 'info');
      }
      this.showLibraryModal.set(false);
  }
}
