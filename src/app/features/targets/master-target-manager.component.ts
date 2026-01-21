
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MasterTargetService } from './master-target.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { MasterAnalyte } from '../../core/models/sop.model';
import { generateSlug, formatDate } from '../../shared/utils/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master-target-manager',
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
                <div>
                    <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-book-medical text-indigo-600"></i> Thư viện Chỉ tiêu Gốc
                    </h2>
                    <p class="text-[10px] text-slate-500 mt-0.5 font-medium">Master Analyte Library</p>
                </div>
            </div>
            
            <div class="flex gap-2">
                <!-- Import Button -->
                <button (click)="fileInput.click()" class="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-bold text-xs transition flex items-center gap-2 active:scale-95">
                    <i class="fa-solid fa-file-excel"></i> Import Excel
                </button>
                <input #fileInput type="file" class="hidden" accept=".xlsx, .csv" (change)="onFileSelected($event)">

                <button (click)="openModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-md transition flex items-center gap-2 active:scale-95">
                    <i class="fa-solid fa-plus"></i> Thêm Chỉ tiêu
                </button>
            </div>
        </div>

        <div class="flex-1 p-6 overflow-hidden flex flex-col">
            <!-- Search Bar -->
            <div class="mb-4 relative">
                <i class="fa-solid fa-search absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                <input [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                       class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm"
                       placeholder="Tìm kiếm tên chất, CAS number, công thức hóa học...">
            </div>

            <!-- List -->
            <div class="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div class="overflow-y-auto custom-scrollbar flex-1 p-2">
                    @if (isLoading()) {
                        <div class="p-10 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-2xl"></i></div>
                    } @else {
                        <table class="w-full text-sm text-left border-collapse">
                            <thead class="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 font-bold">
                                <tr>
                                    <th class="px-4 py-3 border-b border-slate-100">Tên Chỉ tiêu / ID</th>
                                    <th class="px-4 py-3 border-b border-slate-100">Thông tin Hóa học</th>
                                    <th class="px-4 py-3 border-b border-slate-100 text-center">Đơn vị Chuẩn</th>
                                    <th class="px-4 py-3 border-b border-slate-100 text-right">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @for (item of filteredItems(); track item.id) {
                                    <tr class="hover:bg-indigo-50/30 transition group">
                                        <td class="px-4 py-3">
                                            <div class="font-bold text-slate-800 text-sm">{{item.name}}</div>
                                            <div class="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1 border border-slate-200">{{item.id}}</div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="flex flex-col gap-1 text-xs">
                                                @if(item.cas_number) { <span class="text-slate-600"><span class="font-bold text-slate-400 w-8 inline-block">CAS:</span> {{item.cas_number}}</span> }
                                                @if(item.chemical_formula) { <span class="text-slate-600"><span class="font-bold text-slate-400 w-8 inline-block">CT:</span> <span class="font-serif">{{item.chemical_formula}}</span></span> }
                                            </div>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <span class="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{{item.default_unit || '-'}}</span>
                                        </td>
                                        <td class="px-4 py-3 text-right">
                                            <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button (click)="openModal(item)" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition shadow-sm flex items-center justify-center">
                                                    <i class="fa-solid fa-pen"></i>
                                                </button>
                                                <button (click)="deleteItem(item)" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-red-500 hover:bg-red-50 transition shadow-sm flex items-center justify-center">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr><td colspan="4" class="p-8 text-center text-slate-400 italic">Không tìm thấy dữ liệu phù hợp.</td></tr>
                                }
                            </tbody>
                        </table>
                    }
                </div>
                <div class="p-3 bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-500 text-right">
                    Tổng số: {{filteredItems().length}} chỉ tiêu
                </div>
            </div>
        </div>

        <!-- ADD/EDIT MODAL -->
        @if (showModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-slide-up">
                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <h3 class="font-black text-slate-800 text-lg">
                            {{ isEditing() ? 'Cập nhật Chỉ tiêu' : 'Thêm Chỉ tiêu Mới' }}
                        </h3>
                        <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times"></i></button>
                    </div>
                    
                    <div class="p-6 overflow-y-auto">
                        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Tên Chỉ tiêu <span class="text-red-500">*</span></label>
                                <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-indigo-500 transition" placeholder="VD: Chloramphenicol">
                            </div>
                            
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Mã ID (Slug)</label>
                                <input formControlName="id" class="w-full border border-slate-200 bg-slate-100 rounded-lg p-2.5 text-xs font-mono text-slate-600 outline-none" readonly placeholder="Auto-generated">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Số CAS</label>
                                    <input formControlName="cas_number" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition" placeholder="56-75-7">
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Đơn vị mặc định</label>
                                    <input formControlName="default_unit" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition" placeholder="ppb, µg/kg">
                                </div>
                            </div>

                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Công thức hóa học</label>
                                <input formControlName="chemical_formula" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-serif outline-none focus:border-indigo-500 transition" placeholder="C11H12Cl2N2O5">
                            </div>

                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Mô tả / Ghi chú</label>
                                <textarea formControlName="description" rows="2" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition resize-none"></textarea>
                            </div>

                            <div class="pt-4 flex justify-end gap-3">
                                <button type="button" (click)="closeModal()" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-xs transition">Hủy</button>
                                <button type="submit" [disabled]="form.invalid || isProcessing()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-md transition disabled:opacity-50">
                                    {{ isEditing() ? 'Lưu Thay Đổi' : 'Tạo Mới' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        }

        <!-- IMPORT PREVIEW MODAL -->
        @if (importPreview().length > 0) {
            <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-file-import text-emerald-600"></i> Xem trước Import
                        </h3>
                        <button (click)="cancelImport()" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times"></i></button>
                    </div>

                    <div class="p-4 bg-yellow-50 border-b border-yellow-100 text-xs text-yellow-800 flex items-start gap-2">
                        <i class="fa-solid fa-circle-info mt-0.5"></i>
                        <div>
                            Kiểm tra dữ liệu bên dưới. Các dòng có <b>ID</b> trùng sẽ bị ghi đè.
                            <br>Tổng cộng: <b>{{importPreview().length}}</b> chỉ tiêu hợp lệ.
                        </div>
                    </div>

                    <div class="flex-1 overflow-auto custom-scrollbar">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-100 text-slate-500 font-bold uppercase sticky top-0">
                                <tr>
                                    <th class="p-3 border-b border-slate-200">Tên Chỉ tiêu</th>
                                    <th class="p-3 border-b border-slate-200">Mã ID (Tự động)</th>
                                    <th class="p-3 border-b border-slate-200">CAS</th>
                                    <th class="p-3 border-b border-slate-200">Formula</th>
                                    <th class="p-3 border-b border-slate-200 text-center">Unit</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @for (item of importPreview(); track $index) {
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-bold text-slate-700">{{item.name}}</td>
                                        <td class="p-3 font-mono text-slate-500">{{item.id}}</td>
                                        <td class="p-3 text-slate-600">{{item.cas_number || '-'}}</td>
                                        <td class="p-3 font-serif text-slate-600">{{item.chemical_formula || '-'}}</td>
                                        <td class="p-3 text-center bg-slate-50/50">{{item.default_unit || '-'}}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                        <button (click)="cancelImport()" class="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                        <button (click)="confirmImport()" [disabled]="isProcessing()" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center gap-2">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... } 
                            @else { <i class="fa-solid fa-check"></i> Xác nhận Import }
                        </button>
                    </div>
                </div>
            </div>
        }
    </div>
  `
})
export class MasterTargetManagerComponent implements OnInit {
  masterService = inject(MasterTargetService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  router: Router = inject(Router);
  fb = inject(FormBuilder);

  items = signal<MasterAnalyte[]>([]);
  isLoading = signal(false);
  isProcessing = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  searchTerm = signal('');

  // Import State
  importPreview = signal<MasterAnalyte[]>([]);

  form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      cas_number: [''],
      chemical_formula: [''],
      default_unit: [''],
      description: ['']
  });

  filteredItems = computed(() => {
      const term = this.searchTerm().toLowerCase().trim();
      if (!term) return this.items();
      return this.items().filter(i => 
          i.name.toLowerCase().includes(term) || 
          i.id.includes(term) ||
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
      this.router.navigate(['/config']);
  }

  openModal(item?: MasterAnalyte) {
      this.showModal.set(true);
      if (item) {
          this.isEditing.set(true);
          this.form.patchValue(item);
          this.form.controls.id.disable(); // ID is immutable
      } else {
          this.isEditing.set(false);
          this.form.reset();
          this.form.controls.id.enable();
      }
  }

  closeModal() {
      this.showModal.set(false);
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
          id: val.id!,
          name: val.name!,
          cas_number: val.cas_number || '',
          chemical_formula: val.chemical_formula || '',
          default_unit: val.default_unit || '',
          description: val.description || ''
      };

      try {
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

          // Loop through keys to find matches
          Object.keys(row).forEach(key => {
              const k = normalize(key);
              const val = (row[key] || '').toString().trim();
              
              if (k.includes('name') || k.includes('tên') || k.includes('chất')) name = val;
              if (k.includes('cas')) cas = val;
              if (k.includes('formula') || k.includes('công thức') || k.includes('cthh')) formula = val;
              if (k.includes('unit') || k.includes('đơn vị')) unit = val;
              if (k.includes('desc') || k.includes('mô tả') || k.includes('note')) desc = val;
          });

          if (name) {
              parsed.push({
                  id: generateSlug(name),
                  name: name,
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
          this.toast.show('Lỗi lưu import: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }
}
