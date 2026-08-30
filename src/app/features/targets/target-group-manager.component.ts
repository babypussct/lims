
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormArray, Validators, FormsModule } from '@angular/forms';
import { TargetService } from './target.service';
import { MasterTargetService } from './master-target.service'; // Use Master Service
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { FormLabelA11yDirective } from '../../shared/directives/form-label-a11y.directive';
import { TargetGroup, SopTarget, MasterAnalyte } from '../../core/models/sop.model';
import { generateSlug } from '../../shared/utils/utils';
import { Router } from '@angular/router';
import { AppButtonComponent, AppEmptyStateComponent, AppModalShellComponent, AppPageHeaderComponent } from '../../shared/components/ui';

@Component({
  selector: 'app-target-group-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FormLabelA11yDirective, AppButtonComponent, AppEmptyStateComponent, AppModalShellComponent, AppPageHeaderComponent],
  template: `
    <div class="h-full flex flex-col fade-in bg-slate-50 dark:bg-slate-900 relative pb-10">
        
        <!-- Header -->
        <app-page-header
            title="Quản lý nhóm chỉ tiêu"
            subtitle="Tạo và duy trì các bộ chỉ tiêu dùng cho cấu hình SOP."
            icon="fa-layer-group">
            <div pageHeaderActions class="contents">
                <app-button variant="ghost" size="sm" (click)="goBack()">
                    <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> <span class="hidden md:inline">Cấu hình</span>
                </app-button>
                @if(isEditing()) {
                    <app-button variant="ghost" size="sm" (click)="cancelEdit()">Hủy</app-button>
                    <app-button size="sm" (click)="saveGroup()" [loading]="isProcessing()" [disabled]="form.invalid || targets.length === 0 || !areAllTargetsMatched()">
                        @if(!isProcessing()) { <i class="fa-solid fa-save" aria-hidden="true"></i> } Lưu
                    </app-button>
                } @else {
                    <app-button size="sm" (click)="createNew()"><i class="fa-solid fa-plus" aria-hidden="true"></i> Tạo mới</app-button>
                }
            </div>
        </app-page-header>

        <div class="flex-1 flex overflow-hidden">
            <!-- LIST SIDEBAR -->
            <div class="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                @if (isLoading()) {
                    <div class="p-4 text-center text-slate-400 text-xs"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>
                } @else {
                    @for (group of groups(); track group.id) {
                        <div (click)="selectGroup(group)" 
                             class="p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer transition group relative"
                             [class.bg-teal-50]="selectedGroup()?.id === group.id"
                             [class.border-l-4]="selectedGroup()?.id === group.id"
                             [class.border-l-teal-500]="selectedGroup()?.id === group.id"
                             [class.border-l-transparent]="selectedGroup()?.id !== group.id">
                            
                            <div class="font-bold text-sm text-slate-700 dark:text-slate-200 mb-1">{{group.name}}</div>
                            <div class="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
                                <span>{{group.targets.length}} chỉ tiêu</span>
                                <button (click)="deleteGroup(group, $event)" class="w-6 h-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition flex items-center justify-center">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    } @empty {
                        <app-empty-state icon="fa-layer-group" title="Chưa có bộ chỉ tiêu" message="Tạo một bộ chỉ tiêu mới để bắt đầu." />
                    }
                }
            </div>

            <!-- EDITOR AREA -->
            <div class="flex-1 bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden relative">
                @if (isEditing()) {
                    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <form id="target-group-form" appFormLabelA11y [formGroup]="form" class="max-w-4xl mx-auto space-y-6">
                            
                            <!-- Header Info -->
                            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tên nhóm chỉ tiêu <span class="text-red-500">*</span></label>
                                        <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-teal-500 transition" placeholder="VD: Nhóm Kháng sinh (Sulfonamides)">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mã định danh (tự tạo)</label>
                                        <input formControlName="id" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-600 dark:text-slate-300 outline-none" readonly>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả / Ghi chú</label>
                                    <input formControlName="description" class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2.5 text-xs outline-none focus:border-teal-500 transition" placeholder="Mô tả ngắn về nhóm này...">
                                </div>
                            </div>

                            <!-- Targets List -->
                            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase flex items-center gap-2">
                                        <i class="fa-solid fa-list-ul text-teal-500"></i> Danh Sách Chỉ Tiêu
                                    </h3>
                                    <div class="flex flex-wrap justify-end gap-2">
                                        <app-button type="button" size="sm" (click)="openLibraryModal()">
                                            <i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i> Chọn từ danh mục gốc
                                        </app-button>
                                    </div>
                                </div>

                                <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <i class="fa-solid fa-circle-info mr-1 text-teal-600"></i>
                                    Chỉ tiêu phải được chọn từ danh mục chỉ tiêu gốc. Tên, mã ID và đơn vị được khóa theo danh mục gốc để tránh sai lệch dữ liệu hệ thống.
                                </p>

                                <div formArrayName="targets" class="space-y-2">
                                    @for (t of targets.controls; track t; let i = $index) {
                                        @let masterItem = validTargetMap().get(t.get('id')?.value || '');
                                        <div [formGroupName]="i" class="flex gap-2 items-start p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border group transition-colors"
                                             [class.border-red-200]="!masterItem"
                                             [class.border-slate-100]="masterItem">
                                            <div class="w-8 h-8 rounded text-xs font-bold mt-1 flex items-center justify-center transition-colors dark:bg-slate-700 dark:text-slate-300"
                                                 [class.bg-red-100]="!masterItem"
                                                 [class.text-red-600]="!masterItem"
                                                 [class.bg-slate-200]="masterItem"
                                                 [class.text-slate-500]="masterItem">{{i+1}}</div>

                                            <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                                                <div class="md:col-span-4">
                                                    <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 flex justify-between items-center gap-2">
                                                        <span>Tên chỉ tiêu</span>
                                                        @if (masterItem) {
                                                            <div class="flex items-center gap-1">
                                                                <span class="text-[9px] bg-emerald-100 text-emerald-600 px-1 rounded flex items-center gap-1 whitespace-nowrap"><i class="fa-solid fa-check-circle"></i> Khớp Thư viện</span>
                                                                <button type="button" (click)="openLibraryModal(i)" class="text-[9px] bg-blue-100 text-blue-600 hover:bg-blue-200 px-1.5 py-0.5 rounded transition flex items-center gap-1 whitespace-nowrap">
                                                                    <i class="fa-solid fa-rotate"></i> Thay Thế
                                                                </button>
                                                            </div>
                                                        } @else {
                                                            <div class="flex items-center gap-1">
                                                                <span class="text-[9px] bg-red-100 text-red-600 px-1 rounded flex items-center gap-1 whitespace-nowrap"><i class="fa-solid fa-triangle-exclamation"></i> Không tồn tại</span>
                                                                <button type="button" (click)="openLibraryModal(i)" class="text-[9px] bg-blue-100 text-blue-600 hover:bg-blue-200 px-1.5 py-0.5 rounded transition whitespace-nowrap">Chọn Lại</button>
                                                            </div>
                                                        }
                                                    </label>
                                                    <input formControlName="name" readonly class="w-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 rounded px-2 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-300 outline-none cursor-not-allowed">
                                                </div>
                                                <div class="md:col-span-3">
                                                    <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Mã định danh (đã khóa)</label>
                                                    <input formControlName="id" readonly class="w-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 rounded px-2 py-1.5 text-xs font-mono text-slate-400 dark:text-slate-400 outline-none cursor-not-allowed">
                                                </div>
                                                <div class="md:col-span-2">
                                                    <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Đơn vị theo danh mục gốc</label>
                                                    <input formControlName="unit" readonly class="w-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 rounded px-2 py-1.5 text-xs text-slate-500 dark:text-slate-300 outline-none cursor-not-allowed text-center">
                                                </div>
                                                <div class="md:col-span-3 grid grid-cols-2 gap-1">
                                                    <div>
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">LOD</label>
                                                        <input formControlName="lod" placeholder="LOD" class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded px-2 py-1.5 text-xs outline-none focus:border-teal-500 text-center">
                                                    </div>
                                                    <div>
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">LOQ</label>
                                                        <input formControlName="loq" placeholder="LOQ" class="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded px-2 py-1.5 text-xs outline-none focus:border-teal-500 text-center">
                                                    </div>
                                                </div>
                                            </div>

                                            <button type="button" (click)="targets.removeAt(i)" class="mt-6 w-8 h-8 flex items-center justify-center text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition rounded-full hover:bg-white dark:hover:bg-slate-700"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                    } @empty {
                                        <div class="bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                            <app-empty-state icon="fa-list-ul" title="Chưa có chỉ tiêu" message="Hãy chọn chỉ tiêu từ danh mục gốc." />
                                        </div>
                                    }
                                </div>
                            </div>

                        </form>
                    </div>
                } @else {
                    <div class="flex-1 flex items-center justify-center">
                        <app-empty-state icon="fa-layer-group" title="Chưa chọn bộ chỉ tiêu" message="Chọn một bộ chỉ tiêu để sửa hoặc tạo mới." />
                    </div>
                }
            </div>
        </div>

        <!-- MASTER LIBRARY SELECTION MODAL -->
        @if (showLibraryModal()) {
            <app-modal-shell
                [title]="replacingTargetIndex() === null ? 'Chọn từ danh mục gốc' : 'Thay thế chỉ tiêu'"
                description="Tên, mã ID và đơn vị sẽ được lấy trực tiếp từ danh mục chỉ tiêu gốc."
                size="md"
                (closed)="showLibraryModal.set(false)"
            >
                <div modalBody class="space-y-4">
                    <div class="flex gap-2">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                            <input [ngModel]="librarySearchTerm()" (ngModelChange)="librarySearchTerm.set($event)" 
                                   class="w-full pl-8 pr-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition"
                                   placeholder="Tìm kiếm...">
                        </div>
                        @if(replacingTargetIndex() === null) {
                            <app-button variant="secondary" size="sm" (click)="selectAllLibraryFiltered()">Chọn hết</app-button>
                        }
                    </div>

                    <div class="max-h-[52vh] overflow-y-auto p-2 custom-scrollbar">
                        @if (isLibraryLoading()) {
                            <div class="py-10 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>
                        } @else {
                            <div class="grid grid-cols-1 gap-1">
                                @for (analyte of filteredLibraryTargets(); track analyte.id) {
                                    <label class="flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition group"
                                           [class]="selectedLibraryIds().has(analyte.id) ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800' : 'bg-white dark:bg-slate-800 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-100 dark:hover:border-slate-600'">
                                        <input type="checkbox" [checked]="selectedLibraryIds().has(analyte.id)" (change)="toggleLibrarySelection(analyte.id)" class="w-4 h-4 accent-teal-600 rounded cursor-pointer">
                                        <div class="flex-1 min-w-0">
                                            <div class="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300 truncate">{{analyte.name}}</div>
                                            <div class="flex gap-2 mt-0.5 text-[10px]">
                                                <span class="font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 rounded">ID: {{analyte.id}}</span>
                                                @if(analyte.chemical_formula) { <span class="text-slate-500 dark:text-slate-400 font-serif">{{analyte.chemical_formula}}</span> }
                                            </div>
                                        </div>
                                        <div class="text-xs font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{{analyte.default_unit || 'N/A'}}</div>
                                    </label>
                                }
                                @if (filteredLibraryTargets().length === 0) {
                                    <app-empty-state icon="fa-magnifying-glass" title="Không tìm thấy kết quả" message="Thử thay đổi từ khóa tìm kiếm." />
                                }
                            </div>
                        }
                    </div>
                </div>

                <div modalFooter class="contents">
                    <span class="mr-auto self-center text-xs font-bold text-slate-500 dark:text-slate-400">
                        Đã chọn: <span class="text-teal-600 text-sm">{{selectedLibraryIds().size}}</span>
                    </span>
                    <app-button variant="secondary" (click)="showLibraryModal.set(false)">Đóng</app-button>
                    <app-button (click)="importSelectedLibraryTargets()" [disabled]="selectedLibraryIds().size === 0">
                                <i class="fa-solid" [class.fa-rotate]="replacingTargetIndex() !== null" [class.fa-file-import]="replacingTargetIndex() === null"></i>
                                @if(replacingTargetIndex() !== null) {
                                    Thay thế
                                } @else {
                                    Thêm ({{selectedLibraryIds().size}})
                                }
                    </app-button>
                </div>
            </app-modal-shell>
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
  replacingTargetIndex = signal<number | null>(null);

  validTargetMap = computed(() => {
      const map = new Map<string, MasterAnalyte>();
      this.libraryTargets().forEach(target => map.set(target.id, target));
      return map;
  });

  form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      targets: this.fb.array([])
  });

  get targets() { return this.form.get('targets') as FormArray; }

  ngOnInit() {
      this.loadGroups();
      this.loadMasterTargets();
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
      this.router.navigate(['/settings/data/master']);
  }

  selectGroup(g: TargetGroup) {
      this.selectedGroup.set(g);
      this.isEditing.set(true);
      this.form.patchValue({ id: g.id, name: g.name, description: g.description });
      this.targets.clear();
      (g.targets || []).forEach(t => this.addTargetRaw(t));
  }

  createNew() {
      this.selectedGroup.set(null);
      this.isEditing.set(true);
      this.form.reset({ id: '', name: '', description: '' });
      this.targets.clear();
  }

  cancelEdit() {
      this.isEditing.set(false);
      this.selectedGroup.set(null);
  }

  private addTargetRaw(t: Partial<SopTarget>) {
      const masterTarget = t.id ? this.validTargetMap().get(t.id) : undefined;
      this.targets.push(this.fb.group({
          id: [masterTarget?.id || t.id || '', Validators.required],
          name: [masterTarget?.name || t.name || '', Validators.required],
          unit: [masterTarget?.default_unit || t.unit || 'ppb'],
          lod: [t.lod || ''],
          loq: [t.loq || ''],
          isMasterLinked: [!!masterTarget]
      }));
  }

  onNameChange(event: any) {
      if (!this.selectedGroup()) {
          this.form.patchValue({ id: 'group_' + generateSlug(event.target.value) });
      }
  }

  areAllTargetsMatched(): boolean {
      const masterMap = this.validTargetMap();
      return this.targets.controls.every(control => masterMap.has(control.get('id')?.value || ''));
  }

  async saveGroup() {
      if (this.form.invalid) {
          this.form.markAllAsTouched();
          this.toast.show('Vui lòng kiểm tra các trường bắt buộc', 'error');
          return;
      }

      if (this.targets.length === 0) {
          this.toast.show('Bộ chỉ tiêu phải có ít nhất một chỉ tiêu từ danh mục gốc.', 'error');
          return;
      }

      if (!this.areAllTargetsMatched()) {
          this.toast.show('Có chỉ tiêu không tồn tại trong danh mục chỉ tiêu gốc. Vui lòng chọn lại trước khi lưu.', 'error');
          return;
      }

      this.isProcessing.set(true);
      const val = this.form.getRawValue();
      const masterMap = this.validTargetMap();
      const rawTargets = val.targets as SopTarget[];
      const uniqueIds = new Set(rawTargets.map(target => target.id));

      if (uniqueIds.size !== rawTargets.length) {
          this.toast.show('Không thể lưu vì có mã ID chỉ tiêu bị trùng.', 'error');
          this.isProcessing.set(false);
          return;
      }

      // Master Target là nguồn dữ liệu duy nhất cho identity và đơn vị của chỉ tiêu.
      const cleanTargets: SopTarget[] = rawTargets.map(target => {
          const masterTarget = masterMap.get(target.id)!;
          return {
              id: masterTarget.id,
              name: masterTarget.name,
              unit: masterTarget.default_unit || 'ppb',
              lod: target.lod || '',
              loq: target.loq || '',
              isMasterLinked: true
          };
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

  // --- MASTER LIBRARY: nguồn duy nhất để tạo và thay thế Target trong Group ---

  filteredLibraryTargets = computed(() => {
      const term = this.librarySearchTerm().toLowerCase().trim();
      if (!term) return this.libraryTargets();
      return this.libraryTargets().filter(t => 
          t.name.toLowerCase().includes(term) || 
          t.id.toLowerCase().includes(term)
      );
  });

  private async loadMasterTargets() {
      if (this.isLibraryLoading()) return;
      this.isLibraryLoading.set(true);
      try {
          const data = await this.masterService.getAll();
          this.libraryTargets.set(data);
          this.hydrateTargetsFromMaster();
      } catch(e) {
          this.toast.show('Không thể kết nối đến danh mục chỉ tiêu gốc.', 'error');
      } finally {
          this.isLibraryLoading.set(false);
      }
  }

  private hydrateTargetsFromMaster() {
      const masterMap = this.validTargetMap();
      this.targets.controls.forEach(control => {
          const masterTarget = masterMap.get(control.get('id')?.value || '');
          if (masterTarget) {
              control.patchValue({
                  id: masterTarget.id,
                  name: masterTarget.name,
                  unit: masterTarget.default_unit || 'ppb',
                  isMasterLinked: true
              }, { emitEvent: false });
          } else {
              control.patchValue({ isMasterLinked: false }, { emitEvent: false });
          }
      });
  }

  async openLibraryModal(index?: number) {
      this.replacingTargetIndex.set(typeof index === 'number' ? index : null);
      this.selectedLibraryIds.set(new Set());
      this.librarySearchTerm.set('');
      this.showLibraryModal.set(true);
      
      if (this.libraryTargets().length === 0) {
          await this.loadMasterTargets();
      }
  }

  toggleLibrarySelection(id: string) {
      this.selectedLibraryIds.update(ids => {
          const newSet = new Set(ids);
          if (newSet.has(id)) {
              newSet.delete(id);
          } else {
              if (this.replacingTargetIndex() !== null) newSet.clear();
              newSet.add(id);
          }
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

      const replaceIndex = this.replacingTargetIndex();
      if (replaceIndex !== null) {
          const selectedId = Array.from(selectedIds)[0];
          const masterTarget = this.libraryTargets().find(target => target.id === selectedId);
          if (!masterTarget) return;

          const duplicateIndex = this.targets.controls.findIndex((control, index) =>
              index !== replaceIndex && control.get('id')?.value === masterTarget.id
          );
          if (duplicateIndex !== -1) {
              this.toast.show('Chỉ tiêu này đã có trong bộ.', 'info');
              return;
          }

          const currentTarget = this.targets.at(replaceIndex);
          currentTarget.patchValue({
              id: masterTarget.id,
              name: masterTarget.name,
              unit: masterTarget.default_unit || 'ppb',
              isMasterLinked: true
          });
          this.toast.show(`Đã thay thế bằng chỉ tiêu "${masterTarget.name}".`, 'success');
          this.showLibraryModal.set(false);
          this.replacingTargetIndex.set(null);
          return;
      }

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
          this.toast.show(`Đã thêm ${addedCount} chỉ tiêu từ danh mục chỉ tiêu gốc.`, 'success');
      } else {
          this.toast.show('Các chỉ tiêu đã chọn đều có sẵn trong danh sách.', 'info');
      }
      this.showLibraryModal.set(false);
      this.replacingTargetIndex.set(null);
  }
}
