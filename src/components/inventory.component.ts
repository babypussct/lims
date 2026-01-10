
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../services/state.service';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory.model';
import { Sop } from '../models/sop.model';
import { CalculatorService } from '../services/calculator.service';
import { cleanName, formatNum, UNIT_OPTIONS, generateSlug } from '../utils/utils';
import { ToastService } from '../services/toast.service';
import { ConfirmationService } from '../services/confirmation.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-4 pb-20 fade-in h-full flex flex-col relative">
      <!-- Header & Tabs -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-warehouse text-blue-500"></i> Quản lý Kho & Năng lực
          </h2>
        </div>
        
        <div class="flex bg-slate-200 p-1 rounded-lg self-start md:self-auto">
          <button (click)="activeTab.set('list')" 
            class="px-4 py-1.5 text-sm font-bold rounded-md transition"
            [class]="activeTab() === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
            <i class="fa-solid fa-list mr-1"></i> Danh sách
          </button>
          <button (click)="activeTab.set('capacity')"
            class="px-4 py-1.5 text-sm font-bold rounded-md transition"
            [class]="activeTab() === 'capacity' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
            <i class="fa-solid fa-chart-pie mr-1"></i> Phân tích Năng lực
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col relative">
        
        <!-- TAB: LIST -->
        @if (activeTab() === 'list') {
          <div class="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
            <div class="flex gap-2 w-full md:w-auto items-center">
                <div class="relative w-full md:w-64 group">
                   <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition"></i>
                   <input type="text" [ngModel]="searchTerm()" (ngModelChange)="onSearch($event)" placeholder="Tìm tên hoặc mã..." 
                          class="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                </div>
                <select [ngModel]="filterType()" (ngModelChange)="onFilter($event)" class="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">Tất cả</option>
                    <option value="reagent">Hóa chất</option>
                    <option value="consumable">Vật tư</option>
                    <option value="kit">Sinh phẩm</option>
                    <option value="low">Cảnh báo (Low)</option>
                </select>
            </div>
            
            <div class="flex gap-2">
               @if (state.isAdmin() && selectedIds().size > 0) {
                  <button (click)="zeroOutSelected()" 
                          class="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition font-bold text-sm flex items-center gap-2">
                     <i class="fa-solid fa-ban"></i> Đặt về 0 ({{selectedIds().size}})
                  </button>
               }
               
               @if (state.isAdmin()) {
                 <button (click)="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-bold text-sm flex items-center gap-2">
                    <i class="fa-solid fa-plus"></i> Thêm Hóa chất
                 </button>
               }
            </div>
          </div>

          <div class="flex-1 overflow-y-auto">
            <table class="w-full text-sm text-left border-collapse">
              <thead class="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th class="px-3 py-3 border-b w-10 text-center">
                     <input type="checkbox" [checked]="areAllSelected()" (change)="toggleSelectAll()" class="w-4 h-4 accent-blue-600">
                  </th>
                  <th class="px-5 py-3 border-b">Tên Hóa chất (Name)</th>
                  <th class="px-5 py-3 border-b w-40">Mã ID</th>
                  <th class="px-5 py-3 border-b w-32">Phân loại</th>
                  <th class="px-5 py-3 border-b w-24 text-center">Đơn vị</th>
                  <th class="px-5 py-3 border-b w-40 text-right">Tồn kho</th>
                  <th class="px-5 py-3 border-b w-48 text-right">Cập nhật nhanh</th>
                  <th class="px-5 py-3 border-b w-24 text-center">H.động</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (item of paginatedItems(); track item.id) {
                  <tr class="hover:bg-slate-50 transition border-b border-slate-100 group" 
                      [class.bg-blue-50]="selectedIds().has(item.id)">
                    <td class="px-3 py-3 border-b text-center align-middle">
                       <input type="checkbox" [checked]="selectedIds().has(item.id)" (change)="toggleSelection(item.id)" class="w-4 h-4 accent-blue-600">
                    </td>
                    <td class="px-5 py-3 border-b align-middle">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm"
                             [class]="getIconClass(item)">
                          <i class="fa-solid" [class]="getIcon(item.category)"></i>
                        </div>
                        <div class="flex flex-col cursor-pointer" (click)="openModal(item)">
                          <!-- Display Name is Primary -->
                          <span class="font-bold text-slate-700 hover:text-blue-600 transition">{{item.name || item.id}}</span>
                          <div class="flex gap-2">
                             @if (item.stock <= 0) {
                               <span class="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">HẾT HÀNG</span>
                             }
                             @if (isLowStock(item) && item.stock > 0) {
                               <span class="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold">SẮP HẾT (< {{item.threshold}})</span>
                             }
                             @if (item.location) {
                               <span class="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200"><i class="fa-solid fa-location-dot"></i> {{item.location}}</span>
                             }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-5 py-3 border-b font-mono text-xs text-slate-500">
                        {{item.id}}
                    </td>
                    <td class="px-5 py-3 border-b">
                         <span class="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                            {{item.category || 'General'}}
                         </span>
                    </td>
                    <td class="px-5 py-3 border-b w-24 text-center">
                      <span class="text-xs font-bold text-slate-500">{{item.unit}}</span>
                    </td>
                    <td class="px-5 py-3 border-b w-40 text-right">
                      <span class="font-bold text-base font-mono" [class.text-red-600]="item.stock <= 0" [class.text-slate-700]="item.stock > 0">
                        {{formatNum(item.stock)}}
                      </span>
                    </td>
                    <td class="px-5 py-3 border-b w-48 text-right">
                      @if (state.isAdmin()) {
                        <div class="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition">
                           <input #updateInput type="number" class="w-16 px-1 py-1 text-xs border border-slate-300 rounded text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="+/-">
                           <button (click)="quickUpdate(item, updateInput.value); updateInput.value=''" class="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-100 hover:bg-blue-600 hover:text-white transition shadow-sm">
                             <i class="fa-solid fa-check"></i>
                           </button>
                        </div>
                      }
                    </td>
                    <td class="px-5 py-3 border-b text-center">
                       @if (state.isAdmin()) {
                        <div class="flex items-center justify-center gap-1 opacity-50 group-hover:opacity-100">
                          <button (click)="openModal(item)" class="text-slate-400 hover:text-blue-600 p-2 transition rounded-md" title="Sửa">
                              <i class="fa-solid fa-pen"></i>
                          </button>
                          <button (click)="deleteItem(item)" class="text-slate-400 hover:text-red-600 p-2 transition rounded-md" title="Xóa">
                              <i class="fa-solid fa-trash"></i>
                          </button>
                        </div>
                       }
                    </td>
                  </tr>
                } @empty {
                    <tr>
                        <td colspan="8" class="text-center py-12 text-slate-400">
                            <i class="fa-solid fa-box-open text-3xl mb-2 opacity-50"></i>
                            <p>Không tìm thấy hóa chất nào.</p>
                        </td>
                    </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div class="border-t border-slate-200 px-5 py-3 bg-slate-50 flex items-center justify-between shrink-0">
             <div class="text-xs text-slate-500">
                Hiển thị <span class="font-bold">{{paginatedItems().length}}</span> / <span class="font-bold">{{totalItems()}}</span> kết quả
             </div>
             
             @if (totalPages() > 1) {
                <div class="flex items-center gap-1">
                   <button (click)="changePage(-1)" [disabled]="currentPage() === 1" 
                           class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600">
                      <i class="fa-solid fa-chevron-left text-xs"></i>
                   </button>
                   
                   <span class="text-xs font-bold text-slate-700 px-2">
                      Trang {{currentPage()}} / {{totalPages()}}
                   </span>

                   <button (click)="changePage(1)" [disabled]="currentPage() === totalPages()"
                           class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600">
                      <i class="fa-solid fa-chevron-right text-xs"></i>
                   </button>
                </div>
             }
          </div>
        }

        <!-- TAB: CAPACITY (Unchanged) -->
        @if (activeTab() === 'capacity') {
           <div class="flex flex-col md:flex-row h-full">
              <!-- Left: SOP Selector -->
              <div class="w-full md:w-80 border-r border-slate-200 bg-slate-50 overflow-y-auto p-4 flex-shrink-0">
                 <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Chọn Quy trình</h3>
                 <div class="space-y-2">
                   @for (sop of state.sops(); track sop.id) {
                     <div (click)="selectedSopForCap.set(sop)" 
                          class="p-3 rounded-lg border cursor-pointer transition hover:bg-white hover:shadow-sm"
                          [class]="selectedSopForCap()?.id === sop.id ? 'bg-white border-blue-400 shadow-sm ring-1 ring-blue-400' : 'bg-slate-100 border-transparent'">
                        <div class="text-xs font-bold text-slate-500 mb-0.5">{{sop.category}}</div>
                        <div class="font-semibold text-slate-700 text-sm">{{sop.name}}</div>
                     </div>
                   }
                 </div>
              </div>

              <!-- Right: Result -->
              <div class="flex-1 p-6 overflow-y-auto bg-white">
                 @if (selectedSopForCap(); as sop) {
                    <div class="flex items-start justify-between mb-6">
                       <div>
                           <h3 class="text-xl font-bold text-slate-800">{{sop.name}}</h3>
                           <!-- Calculation Mode Switch -->
                           <div class="flex items-center bg-slate-100 rounded-lg p-1 mt-2 w-fit border border-slate-200">
                              <button (click)="capacityMode.set('marginal')" 
                                      class="px-3 py-1.5 text-xs font-bold rounded-md transition"
                                      [class]="capacityMode() === 'marginal' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                                 Theo Từng Mẫu (1 Mẫu)
                              </button>
                              <button (click)="capacityMode.set('standard')"
                                      class="px-3 py-1.5 text-xs font-bold rounded-md transition"
                                      [class]="capacityMode() === 'standard' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                                 Theo Mẻ Chuẩn (SOP Default)
                              </button>
                           </div>
                       </div>
                       <div class="text-right">
                          <div class="text-xs text-slate-500 uppercase">Năng lực tối đa</div>
                          <div class="text-3xl font-bold text-blue-600">{{capacityResult()?.maxBatches || 0}} <span class="text-sm text-slate-400 font-medium">mẻ</span></div>
                       </div>
                    </div>

                    @if (capacityResult()?.limitingFactor) {
                       <div class="mb-6 bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-start gap-3">
                          <i class="fa-solid fa-triangle-exclamation text-orange-500 mt-1"></i>
                          <div>
                             <div class="text-sm font-bold text-orange-800">Yếu tố giới hạn (Bottleneck)</div>
                             <p class="text-sm text-orange-700 mt-1">
                                Quy trình bị giới hạn bởi <b>{{resolveName(capacityResult()?.limitingFactor || '')}}</b>. 
                                Vui lòng bổ sung kho để chạy thêm mẫu.
                             </p>
                          </div>
                       </div>
                    }

                    <div class="border rounded-lg overflow-hidden">
                       <table class="w-full text-sm text-left">
                          <thead class="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                             <tr>
                                <th class="px-4 py-3">Hóa chất</th>
                                <th class="px-4 py-3 text-right">Tồn kho</th>
                                <th class="px-4 py-3 text-right">Cần / Mẻ</th>
                                <th class="px-4 py-3 text-center">Đáp ứng (Mẻ)</th>
                             </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-100">
                             @for (row of capacityResult()?.details; track row.name) {
                                <tr class="hover:bg-slate-50">
                                   <td class="px-4 py-3 font-medium text-slate-700">{{resolveName(row.name)}}</td>
                                   <td class="px-4 py-3 text-right text-slate-600">{{formatNum(row.stock)}}</td>
                                   <td class="px-4 py-3 text-right text-slate-600">{{formatNum(row.need)}}</td>
                                   <td class="px-4 py-3 text-center font-bold" 
                                       [class.text-red-500]="row.batches === capacityResult()?.maxBatches"
                                       [class.text-blue-600]="row.batches > capacityResult()?.maxBatches">
                                      {{formatNum(row.batches)}}
                                   </td>
                                </tr>
                             }
                          </tbody>
                       </table>
                    </div>

                 } @else {
                    <div class="h-full flex flex-col items-center justify-center text-slate-400">
                       <i class="fa-solid fa-chart-pie text-5xl mb-4 text-slate-200"></i>
                       <p>Chọn quy trình để phân tích năng lực kho</p>
                    </div>
                 }
              </div>
           </div>
        }
      </div>

      <!-- CREATE/EDIT MODAL -->
      @if (showModal()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-full">
               <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                  <h3 class="font-bold text-slate-800 text-lg">
                    {{ isEditing() ? 'Cập nhật Hóa chất' : 'Thêm mới Hóa chất' }}
                  </h3>
                  <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-times text-xl"></i></button>
               </div>
               
               <form [formGroup]="form" (ngSubmit)="save()" class="p-6 space-y-4 overflow-y-auto">
                  
                  <!-- ID & Name -->
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tên Hóa chất (Hiển thị) <span class="text-red-500">*</span></label>
                    <input formControlName="name" (input)="onNameChange($event)" 
                           class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                           placeholder="VD: Axit Clohydric 0.1N">
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mã Định Danh (ID) <span class="text-red-500">*</span></label>
                    <div class="flex gap-2">
                        <input formControlName="id" [readonly]="isEditing()" 
                               class="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                               [class.bg-slate-100]="isEditing()"
                               placeholder="tu_dong_tao_hoac_nhap">
                    </div>
                    @if(!isEditing()) {
                         <p class="text-[10px] text-slate-400 mt-1 italic">Mã ID được tạo tự động từ tên. Bạn có thể sửa thủ công trước khi lưu.</p>
                    }
                  </div>

                  <!-- Category & Unit -->
                  <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Phân loại <span class="text-red-500">*</span></label>
                        <select formControlName="category" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                           <option value="reagent">Hóa chất (Reagent)</option>
                           <option value="consumable">Vật tư (Consumable)</option>
                           <option value="kit">Sinh phẩm (Kit)</option>
                           <option value="other">Khác</option>
                        </select>
                     </div>
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Đơn vị tính <span class="text-red-500">*</span></label>
                        <select formControlName="unit" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                            @for (opt of unitOptions; track opt.value) {
                                <option [value]="opt.value">{{opt.label}}</option>
                            }
                        </select>
                     </div>
                  </div>

                  <!-- Stock & Threshold -->
                  <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tồn kho hiện tại <span class="text-red-500">*</span></label>
                        <input type="number" formControlName="stock" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-blue-600 outline-none">
                     </div>
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Ngưỡng báo động</label>
                        <input type="number" formControlName="threshold" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-orange-600 outline-none">
                     </div>
                  </div>

                  <!-- Extra Info (Explicitly marked Optional) -->
                  <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Vị trí (Location) <span class="text-slate-400 font-normal lowercase italic">(tùy chọn)</span></label>
                        <input formControlName="location" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none" placeholder="VD: Tủ lạnh A">
                     </div>
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Hãng / NCC <span class="text-slate-400 font-normal lowercase italic">(tùy chọn)</span></label>
                        <input formControlName="supplier" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none" placeholder="VD: Merck">
                     </div>
                  </div>
                  
                  <div>
                     <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Ghi chú <span class="text-slate-400 font-normal lowercase italic">(tùy chọn)</span></label>
                     <textarea formControlName="notes" rows="2" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"></textarea>
                  </div>

                  <div class="pt-4 flex justify-end gap-3 shrink-0">
                     <button type="button" (click)="closeModal()" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-sm transition">Hủy</button>
                     <button type="submit" [disabled]="form.invalid" class="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-sm shadow-lg shadow-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isEditing() ? 'Lưu Thay đổi' : 'Tạo Mới' }}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      }
    </div>
  `
})
export class InventoryComponent {
  state = inject(StateService);
  inventoryService = inject(InventoryService);
  toast = inject(ToastService);
  calcService = inject(CalculatorService);
  confirmationService = inject(ConfirmationService);
  private fb: FormBuilder = inject(FormBuilder);

  activeTab = signal<'list' | 'capacity'>('list');
  unitOptions = UNIT_OPTIONS;
  
  // List Filters & Pagination
  searchTerm = signal('');
  filterType = signal('all');
  
  // Selection
  selectedIds = signal<Set<string>>(new Set());

  // Pagination State
  currentPage = signal(1);
  pageSize = signal(20);

  // Capacity Tab State
  selectedSopForCap = signal<Sop | null>(null);
  capacityMode = signal<'marginal' | 'standard'>('marginal'); // 'marginal' = 1 sample, 'standard' = SOP default

  capacityResult = computed(() => {
    const s = this.selectedSopForCap();
    const mode = this.capacityMode();
    if (!s) return null;
    return this.calcService.calculateCapacity(s, mode);
  });

  // Modal State
  showModal = signal(false);
  isEditing = signal(false);

  form = this.fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    category: ['reagent'],
    stock: [0, [Validators.required, Validators.min(0)]],
    unit: ['ml', Validators.required],
    threshold: [10],
    location: [''],
    supplier: [''],
    notes: ['']
  });

  // 1. Get All Filtered Items
  allFilteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.filterType();
    
    return this.state.inventory().filter(item => {
      const itemName = (item.name || '').toLowerCase();
      const itemId = item.id.toLowerCase();
      const matchesSearch = itemName.includes(term) || itemId.includes(term);
      
      let matchesType = true;
      if (type === 'low') {
        matchesType = this.isLowStock(item);
      } else if (type !== 'all') {
        matchesType = item.category === type;
      }

      return matchesSearch && matchesType;
    });
  });

  // 2. Paginate Result
  paginatedItems = computed(() => {
     const start = (this.currentPage() - 1) * this.pageSize();
     return this.allFilteredItems().slice(start, start + this.pageSize());
  });

  totalItems = computed(() => this.allFilteredItems().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  // 3. Selection Logic
  areAllSelected = computed(() => {
    const visibleItems = this.paginatedItems();
    return visibleItems.length > 0 && visibleItems.every(i => this.selectedIds().has(i.id));
  });

  toggleSelection(id: string) {
    this.selectedIds.update(current => {
      const newSet = new Set(current);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  toggleSelectAll() {
    const visibleItems = this.paginatedItems();
    if (this.areAllSelected()) {
       // Deselect all visible
       this.selectedIds.update(current => {
          const newSet = new Set(current);
          visibleItems.forEach(i => newSet.delete(i.id));
          return newSet;
       });
    } else {
       // Select all visible
       this.selectedIds.update(current => {
          const newSet = new Set(current);
          visibleItems.forEach(i => newSet.add(i.id));
          return newSet;
       });
    }
  }

  async zeroOutSelected() {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    const confirmed = await this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn đặt tồn kho về 0 cho ${ids.length} mục đã chọn?`,
      confirmText: 'Xác nhận (Zero Out)',
      isDangerous: true
    });

    if (confirmed) {
       try {
          await this.inventoryService.bulkZeroStock(ids);
          this.toast.show(`Đã cập nhật ${ids.length} mục về 0.`, 'success');
          this.selectedIds.set(new Set());
       } catch (e) {
          this.toast.show('Lỗi cập nhật', 'error');
       }
    }
  }

  // Events to reset pagination
  onSearch(val: string) {
    this.searchTerm.set(val);
    this.currentPage.set(1);
    this.selectedIds.set(new Set()); // Reset selection on search
  }

  onFilter(val: string) {
    this.filterType.set(val);
    this.currentPage.set(1);
    this.selectedIds.set(new Set());
  }

  changePage(delta: number) {
     const next = this.currentPage() + delta;
     if (next >= 1 && next <= this.totalPages()) {
        this.currentPage.set(next);
        this.selectedIds.set(new Set()); // Optional: Reset selection on page change
     }
  }

  // Auto Generate ID from Name
  onNameChange(event: any) {
    if (!this.isEditing()) {
        const val = event.target.value;
        const slug = generateSlug(val);
        this.form.patchValue({ id: slug });
    }
  }

  // --- Helpers ---

  cleanName = cleanName;
  formatNum = formatNum; // Uses standard formatter (up to 2 decimals)

  resolveName(id: string): string {
    return this.state.inventoryMap()[id]?.name || id;
  }

  isLowStock(item: InventoryItem): boolean {
    return item.stock <= (item.threshold || 5);
  }

  getIcon(category: string | undefined): string {
    switch(category) {
      case 'reagent': return 'fa-flask';
      case 'consumable': return 'fa-vial';
      case 'kit': return 'fa-box-open';
      default: return 'fa-cube';
    }
  }

  getIconClass(item: InventoryItem): string {
    if (item.stock <= 0) return 'bg-red-50 text-red-500 border border-red-100';
    if (this.isLowStock(item)) return 'bg-orange-50 text-orange-500 border border-orange-100';
    return 'bg-blue-50 text-blue-500 border border-blue-100';
  }

  // --- Actions ---

  openModal(item?: InventoryItem) {
    this.showModal.set(true);
    if (item) {
      this.isEditing.set(true);
      this.form.patchValue({
        id: item.id,
        name: item.name || item.id, // Fallback
        category: item.category || 'reagent',
        stock: item.stock,
        unit: item.unit,
        threshold: item.threshold || 5,
        location: item.location || '',
        supplier: item.supplier || '',
        notes: item.notes || ''
      });
      this.form.controls.id.disable(); // Lock ID
    } else {
      this.isEditing.set(false);
      this.form.reset({
        id: '',
        name: '',
        category: 'reagent',
        stock: 0,
        unit: 'ml',
        threshold: 5,
        location: '',
        supplier: '',
        notes: ''
      });
      this.form.controls.id.enable();
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.form.reset();
  }

  async save() {
    if (this.form.invalid) return;

    const val = this.form.getRawValue(); // getRawValue to get disabled ID
    
    // Ensure ID is set
    if (!val.id) {
        this.toast.show('Mã ID không được để trống', 'error');
        return;
    }

    const item: InventoryItem = {
      id: val.id!,
      name: val.name!,
      stock: val.stock!,
      unit: val.unit!,
      category: val.category || 'reagent',
      threshold: val.threshold || 0,
      location: val.location || '',
      supplier: val.supplier || '',
      notes: val.notes || ''
    };

    try {
      await this.inventoryService.upsertItem(item, !this.isEditing());
      this.toast.show(this.isEditing() ? 'Cập nhật thành công' : 'Tạo mới thành công');
      this.closeModal();
    } catch (e) {
      this.toast.show('Lỗi lưu dữ liệu', 'error');
    }
  }

  async deleteItem(item: InventoryItem) {
    if (!item) return;
    const confirmed = await this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa hóa chất "${item.name || item.id}"? Hành động này không thể hoàn tác.`,
      confirmText: 'Xác nhận Xóa',
      isDangerous: true
    });

    if (confirmed) {
      try {
        await this.inventoryService.deleteItem(item.id);
        this.toast.show('Đã xóa hóa chất');
      } catch (e) {
        this.toast.show('Lỗi khi xóa', 'error');
      }
    }
  }

  async quickUpdate(item: InventoryItem, valStr: string) {
    const val = parseFloat(valStr);
    if (isNaN(val) || val === 0) return;

    try {
      await this.inventoryService.updateStock(item.id, item.stock, val);
      const msg = val > 0 ? `Đã nhập +${val} ${item.unit}` : `Đã xuất ${val} ${item.unit}`;
      this.toast.show(msg, 'success');
    } catch (e) {
      this.toast.show('Lỗi cập nhật kho', 'error');
    }
  }
}
