import { Component, Input, Output, EventEmitter, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferenceStandard } from '../../../../core/models/standard.model';
import {
    getFefoUnavailableReason,
    getFefoPriorityStandard,
    getSameStandardLots,
    isFefoCandidate,
    isFefoPriorityStandard,
    isStandardExpired,
    parseStandardDate,
    sortStandardsByFefo
} from '../../../../shared/utils/standard-fefo';

function removeAccents(str: string): string {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

@Component({
  selector: 'app-create-request-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <!-- REQUEST MODAL (Tạo yêu cầu mới - Drawer) -->
    @if (isOpen) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
        <!-- Overlay click to close -->
        <div class="absolute inset-0" (click)="onClose()"></div>
        
        <div class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden animate-slide-up max-h-[95vh] md:h-[85vh] border border-slate-100 dark:border-slate-800">
            
            <!-- Left Column: Standards Selection -->
            <div class="w-full md:w-1/2 h-[55vh] md:h-auto md:flex-1 flex flex-col bg-slate-50 dark:bg-slate-800/30 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 shrink-0 md:min-h-0">
                <div class="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2 mb-4">
                        <i class="fa-solid fa-flask-vial text-indigo-600"></i>
                        Chọn Chuẩn Đối Chiếu
                    </h3>
                    
                    <!-- Search Input -->
                    <div class="relative">
                        <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input type="text" [ngModel]="standardSearchTerm()" (ngModelChange)="standardSearchTerm.set($event)" 
                                placeholder="Tìm theo tên, lot, cas, mã..." 
                                class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    @if (standardSearchTerm().length > 0) {
                        <div class="space-y-2">
                            @for(std of filteredAvailableStandards(); track std.id) {
                                <div class="p-3 border rounded-2xl transition-all duration-200 flex items-start gap-3 group relative overflow-hidden"
                                        [ngClass]="{
                                        'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-400 dark:border-indigo-500 shadow-[0_0_0_1px_rgba(99,102,241,0.2)] dark:shadow-[0_0_0_1px_rgba(99,102,241,0.3)] z-10 cursor-pointer': selectedStandardIds().has(std.id) && isSelectable(std),
                                        'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 hover:shadow-md hover:shadow-indigo-100/30 dark:hover:shadow-none cursor-pointer bg-white dark:bg-slate-900': !selectedStandardIds().has(std.id) && isSelectable(std),
                                        'opacity-50 grayscale cursor-not-allowed border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50': !isSelectable(std)
                                        }"
                                        (click)="isSelectable(std) && toggleStandardSelection(std.id)">

                                    <!-- Selection Indicator Overlay -->
                                    @if(selectedStandardIds().has(std.id)) {
                                        <div class="absolute top-3 right-3 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-sm animate-bounce-in z-20">
                                            <i class="fa-solid fa-check text-[11px] font-black"></i>
                                        </div>
                                    }

                                    <!-- Standard Icon/Letter -->
                                    <div class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 relative z-10"
                                            [ngClass]="selectedStandardIds().has(std.id) ? 'bg-indigo-600 text-white border-none shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 rotate-12 scale-105' : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-500 group-hover:scale-105 group-hover:text-indigo-600'">
                                        <i class="fa-solid fa-flask-vial text-base"></i>
                                    </div>

                                    <div class="flex-1 min-w-0 relative z-10">
                                        <div class="flex items-center justify-between gap-1 mb-1 pr-6">
                                            <div class="font-black text-base truncate transition-colors text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 leading-tight" 
                                                    [title]="std.name">{{std.name}}</div>
                                            @if(std.internal_id) {
                                                <span class="shrink-0 px-2 py-0.5 text-xs font-black rounded-md uppercase border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 shadow-sm leading-none mt-0.5 tracking-wide">
                                                    {{std.internal_id}}
                                                </span>
                                            }
                                        </div>

                                        <!-- Detail Grid: Compact with all info -->
                                        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                                            <div class="flex items-center gap-1 truncate" [title]="std.product_code || 'N/A'">
                                                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase">Mã:</span>
                                                <span class="font-medium text-slate-600 dark:text-slate-300 truncate">{{std.product_code || 'N/A'}}</span>
                                            </div>
                                            <div class="flex items-center gap-1 truncate" [title]="std.lot_number || 'N/A'">
                                                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase">Lot:</span>
                                                <span class="font-medium text-slate-600 dark:text-slate-300 truncate">{{std.lot_number || 'N/A'}}</span>
                                            </div>
                                            <div class="flex items-center gap-1 truncate" [title]="std.cas_number || 'N/A'">
                                                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase">CAS:</span>
                                                <span class="font-medium text-slate-600 dark:text-slate-300 truncate">{{std.cas_number || 'N/A'}}</span>
                                            </div>
                                            <div class="flex items-center gap-1 truncate" [title]="std.manufacturer || 'N/A'">
                                                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase">Hãng:</span>
                                                <span class="font-medium text-slate-600 dark:text-slate-300 truncate">{{std.manufacturer || 'N/A'}}</span>
                                            </div>
                                        </div>

                                            <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                                 <div class="flex items-center gap-1.5 flex-wrap">
                                                     @if(!isSelectable(std)) {
                                                         <div class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-black rounded flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                                                             <i class="fa-solid fa-ban text-red-400"></i> {{unavailableReason(std)}}
                                                         </div>
                                                         @if(isDepleted(std)) {
                                                             <button (click)="$event.stopPropagation(); requestPurchase.emit(std)" class="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[11px] font-black rounded flex items-center gap-1 border border-amber-200 dark:border-amber-700/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition">
                                                                 <i class="fa-solid fa-cart-plus"></i> Đề Nghị Mua
                                                             </button>
                                                         }
                                                     } @else {
                                                         <div class="text-sm font-black flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                                             {{std.current_amount}} <span class="text-[11px] text-emerald-500 uppercase">{{std.unit}}</span>
                                                         </div>
                                                         @if(isFefoTopForName(std)) {
                                                             <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50 whitespace-nowrap">
                                                                 <i class="fa-solid fa-star text-[9px]"></i> Ưu tiên
                                                             </span>
                                                         }
                                                         @if(isExpiringSoon(std)) {
                                                             <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 whitespace-nowrap">
                                                                 <i class="fa-solid fa-triangle-exclamation text-[9px]"></i> Sắp HH
                                                             </span>
                                                         }
                                                         @if(isLowStock(std)) {
                                                             <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 whitespace-nowrap">
                                                                 <i class="fa-solid fa-droplet-slash text-[9px]"></i> Sắp hết
                                                             </span>
                                                         }
                                                     }
                                                 </div>
                                                 @if(std.expiry_date) {
                                                     <div class="text-[11px] font-bold flex items-center gap-1" 
                                                             [ngClass]="isExpired(std.expiry_date) ? 'text-red-500' : isExpiringSoon(std) ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'">
                                                         <i class="fa-regular fa-calendar-xmark"></i>
                                                         {{std.expiry_date | date:'dd/MM/yyyy'}}
                                                     </div>
                                                 }
                                             </div>
                                        </div>
                                    </div>
                            }
                            @if(filteredAvailableStandards().length === 0) {
                                <div class="py-12 text-center">
                                    <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <i class="fa-solid fa-layer-group text-2xl"></i>
                                    </div>
                                    <p class="text-slate-500 dark:text-slate-400 font-medium">Không tìm thấy chuẩn nào phù hợp</p>
                                </div>
                            }
                        </div>
                    } @else {
                        <div class="py-20 text-center flex flex-col items-center justify-center">
                            <div class="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] flex items-center justify-center mb-6 text-indigo-300 dark:text-indigo-700 animate-pulse">
                                <i class="fa-solid fa-search text-4xl"></i>
                            </div>
                            <h4 class="text-slate-800 dark:text-slate-100 font-black text-lg mb-2">Tìm Kiếm Chất Chuẩn</h4>
                            <p class="text-slate-500 dark:text-slate-400 text-base max-w-[250px] mx-auto font-medium">Nhập tên, số lô hoặc mã CAS để bắt đầu chọn chuẩn mượn.</p>
                        </div>
                    }
                </div>
            </div>

            <!-- Right Column: Form & Confirmation -->
            <div class="w-full md:w-1/2 md:flex-1 flex flex-col bg-white dark:bg-slate-900 shrink-0 md:min-h-0">
                <div class="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg">Hoàn Tất Yêu Cầu</h3>
                        <p class="text-sm text-slate-500 font-medium">Vui lòng cung cấp mục đích và thời gian dự kiến</p>
                    </div>
                    <button (click)="onClose()" class="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 md:overflow-y-auto p-6 md:p-8">
                    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
                        <!-- Compact Selected Standards Panel -->
                        <div class="rounded-xl border border-indigo-100 dark:border-indigo-800/30 bg-white dark:bg-slate-800 shadow-sm overflow-hidden flex flex-col">
                            <!-- Group Header -->
                            <div class="bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2.5 border-b border-indigo-100 dark:border-indigo-800/30 flex items-center justify-between shrink-0">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <i class="fa-solid fa-list-check text-xs"></i>
                                    </div>
                                    <div class="text-sm font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                                        {{selectedStandardIds().size}} chuẩn đã chọn
                                    </div>
                                </div>
                                <button type="button" (click)="clearSelection()" [disabled]="selectedStandardIds().size === 0" class="text-[11px] font-bold text-red-500 hover:text-red-600 uppercase transition disabled:opacity-30 flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded">
                                    <i class="fa-solid fa-trash-can"></i> Xóa Hết
                                </button>
                            </div>
                            <!-- Chip List -->
                            <div class="bg-slate-50/50 dark:bg-slate-900/30">
                                @if (selectedStandardsList().length === 0) {
                                    <div class="py-3 px-4 flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                        <i class="fa-regular fa-hand-pointer text-sm"></i>
                                        <span class="text-xs font-medium italic">Click chọn chuẩn ở danh sách bên trái.</span>
                                    </div>
                                } @else {
                                    <div class="p-2.5 max-h-[120px] overflow-y-auto custom-scrollbar flex flex-wrap gap-1.5">
                                        @for (std of selectedStandardsList(); track std.id) {
                                            <div class="animate-bounce-in flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-700/50 shadow-sm shrink-0">
                                                <div class="flex flex-col min-w-0">
                                                    <span class="text-xs font-bold text-indigo-700 dark:text-indigo-300 truncate max-w-[130px] leading-tight" [title]="std.name">{{std.name}}</span>
                                                    @if (std.internal_id || std.lot_number) {
                                                        <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate mt-px">
                                                            {{std.internal_id || ''}}{{std.internal_id && std.lot_number ? ' · ' : ''}}{{std.lot_number ? 'Lot ' + std.lot_number : ''}}
                                                        </span>
                                                    }
                                                </div>
                                                <button type="button" (click)="toggleStandardSelection(std.id)"
                                                        class="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition ml-0.5">
                                                    <i class="fa-solid fa-times text-[10px]"></i>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>

                        <!-- FEFO Warning: lô được chọn không phải ưu tiên đầu tiên -->
                        @if (fefoWarnings().length > 0) {
                            <div class="rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 px-3.5 py-3 space-y-1.5">
                                <div class="flex items-center gap-1.5">
                                    <i class="fa-solid fa-triangle-exclamation text-amber-500 text-xs"></i>
                                    <span class="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide">Gợi ý FEFO</span>
                                </div>
                                @for (warn of fefoWarnings(); track warn.selectedId) {
                                    <p class="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                                        Lô <strong>{{warn.selectedLabel}}</strong> — nên dùng lô
                                        <strong>{{warn.priorityLabel}}</strong>
                                        (hạn: {{warn.priorityExpiry}}) trước.
                                    </p>
                                }
                            </div>
                        }

                        <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                                    <textarea formControlName="purpose" rows="3" 
                                            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" 
                                            placeholder="VD: Pha chuẩn cho máy HPLC-MS/MS..."></textarea>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        <button type="button" (click)="form.patchValue({purpose: 'Pha chuẩn mới'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Pha Chuẩn Mới</button>
                                        <button type="button" (click)="form.patchValue({purpose: 'Kiểm tra định kỳ'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm Tra Định Kỳ</button>
                                        <button type="button" (click)="form.patchValue({purpose: 'Ngoại kiểm'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Ngoại Kiểm</button>
                                        <button type="button" (click)="form.patchValue({purpose: 'Nghiên cứu phát triển'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Nghiên Cứu Phát Triển</button>
                                        <button type="button" (click)="form.patchValue({purpose: 'Kiểm nghiệm mẫu'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm Nghiệm Mẫu</button>
                                    </div>
                                </div>

                        </div>
                    </form>
                </div>

                <!-- Actions attached to bottom -->
                <div class="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
                    <div class="flex justify-end gap-3">
                        <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-base hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition">Hủy Bỏ</button>
                        <button (click)="onSubmit()" [disabled]="selectedStandardIds().size === 0 || isProcessing" 
                                class="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-base rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2 active:scale-95">
                            @if(isProcessing) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý... } 
                            @else { <i class="fa-solid fa-paper-plane text-sm"></i> Gửi yêu cầu }
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    }
  `
})
export class CreateRequestDrawerComponent {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() isProcessing = false;
  @Input() set availableStandards(val: ReferenceStandard[]) {
      this._availableStandards.set(val || []);
  }

  @Output() close = new EventEmitter<void>();
  @Output() submitRequest = new EventEmitter<{ standardIds: string[], purpose: string }>();
  @Output() requestPurchase = new EventEmitter<ReferenceStandard>();

  form: FormGroup;
  
  _availableStandards = signal<ReferenceStandard[]>([]);
  standardSearchTerm = signal('');
  selectedStandardIds = signal<Set<string>>(new Set());

  constructor() {
    this.form = this.fb.group({
      purpose: ['', Validators.required]
    });
  }

  // Filter UI logic
  filteredAvailableStandards = computed(() => {
      let stds = this._availableStandards();
      const st = this.standardSearchTerm().trim();
      
      if (st) {
          const searchTerms = removeAccents(st.toLowerCase()).split(' ').filter(v => v);
          
          stds = stds.filter(s => {
              const searchStr = Object.values(s)
                  .filter(val => val !== null && val !== undefined && typeof val !== 'object')
                  .map(val => {
                      let str = String(val);
                      if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
                          const parts = val.split('T')[0].split('-');
                          if (parts.length === 3) str += ` ${parts[2]}/${parts[1]}/${parts[0]}`;
                      }
                      return removeAccents(str.toLowerCase());
                  })
                  .join(' ');
              
              return searchTerms.every(t => searchStr.includes(t));
          });
      }
      
      return sortStandardsByFefo(stds);
  });

  /** Danh sách cảnh báo FEFO cho các lô đã chọn không theo thứ tự tối ưu */
  fefoWarnings = computed(() => {
      const selected = this.selectedStandardsList();
      if (selected.length === 0) return [];
      const all = this._availableStandards();
      const warnings: { selectedId: string; selectedLabel: string; priorityLabel: string; priorityExpiry: string }[] = [];
      for (const std of selected) {
          if (!isFefoCandidate(std)) continue;
          const priority = getFefoPriorityStandard(std, all);
          if (priority && priority.id !== std.id) {
              warnings.push({
                  selectedId: std.id,
                  selectedLabel: std.internal_id || std.lot_number || std.name,
                  priorityLabel: priority.internal_id || priority.lot_number || priority.id,
                  priorityExpiry: priority.expiry_date || 'N/A'
              });
          }
      }
      return warnings;
  });

  /** Kiểm tra lọ có phải lọ nên ưu tiên nhất trong danh sách cùng tên không */
  isFefoTopForName(std: ReferenceStandard): boolean {
      const all = this._availableStandards();
      const sameName = getSameStandardLots(std, all, true);
      return sameName.length > 1 && isFefoPriorityStandard(std, all);
  }

  isExpiringSoon(std: ReferenceStandard): boolean {
      if (!std.expiry_date) return false;
      const exp = parseStandardDate(std.expiry_date);
      if (exp === null) return false;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;
      return exp >= today && exp <= thirtyDays;
  }

  isLowStock(std: ReferenceStandard): boolean {
      return !this.isDepleted(std) && (std.current_amount || 0) / (std.initial_amount || 1) <= 0.2 && (std.initial_amount || 0) > 0;
  }

  selectedStandardsList = computed(() => {
      const ids = this.selectedStandardIds();
      return this._availableStandards().filter(s => ids.has(s.id));
  });

  isDepleted(std: ReferenceStandard): boolean {
      return std.status === 'DEPLETED' || (std.current_amount ?? 0) <= 0;
  }

  isExpired(expiryDate: string | undefined): boolean {
      return isStandardExpired(expiryDate);
  }

  isSelectable(std: ReferenceStandard): boolean {
      return isFefoCandidate(std);
  }

  unavailableReason(std: ReferenceStandard): string {
      return getFefoUnavailableReason(std) || 'Không khả dụng';
  }

  toggleStandardSelection(stdId: string) {
      const current = new Set(this.selectedStandardIds());
      if (current.has(stdId)) {
          current.delete(stdId);
      } else {
          current.add(stdId);
      }
      this.selectedStandardIds.set(current);
  }

  clearSelection() {
      this.selectedStandardIds.set(new Set());
  }

  onClose() {
      // Reset that internal view when closed
      this.form.reset();
      this.selectedStandardIds.set(new Set());
      this.standardSearchTerm.set('');
      this.close.emit();
  }

  onSubmit() {
      if (this.selectedStandardIds().size === 0 || this.isProcessing) return;
      const val = this.form.value;
      const selectableIds = Array.from(this.selectedStandardIds()).filter(id => {
          const std = this._availableStandards().find(item => item.id === id);
          return !!std && this.isSelectable(std);
      });
      if (selectableIds.length === 0) return;
      this.submitRequest.emit({
          standardIds: selectableIds,
          purpose: val.purpose?.trim() || 'Pha chuẩn mới'
      });
  }
}
