import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { UserProfile } from '../../../core/services/auth.service';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { formatNum, getStorageInfo, getExpiryClass, getExpiryTimeClass, getExpiryTimeLeft, getStandardStatus, canAssign, getExpiryBarClass } from '../../../shared/utils/utils';

@Component({
  selector: 'app-standards-grid-view',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="p-4 bg-slate-50/30 dark:bg-slate-900/50">
       @if (isLoading() && allStandardsLength() === 0) { 
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               @for(i of [1,2,3,4]; track i) { <app-skeleton height="280px"></app-skeleton> }
           </div> 
       } @else {
           @if (items().length === 0) {
               <div class="py-16 text-center text-slate-400 dark:text-slate-500 italic w-full border-t border-transparent">
                   <i class="fa-solid fa-box-open text-4xl mb-2 text-slate-300 dark:text-slate-600"></i>
                   <p>Không tìm thấy dữ liệu chuẩn phù hợp.</p>
               </div>
           } @else {
               <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                   @for (std of items(); track std.id) {
                       <div class="bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 flex flex-col relative group h-full hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none overflow-hidden"
                            [ngClass]="{
                                'border-slate-200 dark:border-slate-700': !selectedIds().has(std.id!),
                                'border-indigo-400 dark:border-indigo-500 shadow-md bg-indigo-50 dark:bg-indigo-900/30': selectedIds().has(std.id!),
                                'opacity-50 grayscale hover:opacity-100 hover:grayscale-0': std.status === 'DEPLETED' || std.current_amount <= 0
                            }">
                           
                           <!-- Header: Status Bar -->
                           <div class="w-full h-1.5 flex bg-slate-100 dark:bg-slate-700 shrink-0">
                               <div class="h-full w-full" [class]="getExpiryBarClass(std.expiry_date)"></div>
                           </div>

                           <div class="p-4 flex flex-col h-full">
                               <!-- Top: ID, Location & Checkbox -->
                               <div class="flex justify-between items-start mb-3">
                                   <div class="flex flex-wrap gap-1.5 items-start pr-2">
                                       <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide whitespace-nowrap shadow-sm dark:shadow-none" [ngClass]="getStandardStatus(std).class">
                                           {{getStandardStatus(std).label}}
                                       </span>
                                       @if(std.internal_id) {
                                           <span class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-md text-sm font-black uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50 shadow-sm dark:shadow-none whitespace-nowrap">
                                               {{std.internal_id}}
                                           </span>
                                       }
                                       @if(std.location) {
                                           <span class="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap">
                                               <i class="fa-solid fa-location-dot text-[10px]"></i> {{std.location}}
                                           </span>
                                       }
                                   </div>
                                   <input type="checkbox" [checked]="selectedIds().has(std.id!)" (change)="toggleSelection.emit(std.id!)" class="w-5 h-5 accent-indigo-600 dark:accent-indigo-500 cursor-pointer shrink-0 mt-0.5">
                               </div>

                               <!-- Identity -->
                               <div class="mb-4 cursor-pointer" (click)="navigateToDetail.emit(std)">
                                   <h3 class="font-bold text-slate-800 dark:text-slate-200 text-base leading-snug mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition break-words">{{std.name}}</h3>
                                   @if(std.chemical_name) { <p class="text-sm text-slate-500 dark:text-slate-400 italic font-medium break-words">{{std.chemical_name}}</p> }
                               </div>

                               <!-- Data Grid (Click to copy) -->
                               <div class="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 mb-4 text-[11px]">
                                   <div class="bg-white dark:bg-slate-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer group/cell" (click)="copyText.emit({text: std.lot_number || '', event: $event})" title="Copy Lot">
                                       <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5 flex justify-between">Lot <i class="fa-regular fa-copy opacity-0 group-hover/cell:opacity-100"></i></div>
                                       <div class="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{std.lot_number || '-'}}</div>
                                   </div>
                                   <div class="bg-white dark:bg-slate-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer group/cell" (click)="copyText.emit({text: std.product_code || '', event: $event})" title="Copy Code">
                                       <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5 flex justify-between">Code <i class="fa-regular fa-copy opacity-0 group-hover/cell:opacity-100"></i></div>
                                       <div class="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{std.product_code || '-'}}</div>
                                   </div>
                                   <div class="bg-white dark:bg-slate-800 p-2">
                                       <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Mfg</div>
                                       <div class="font-bold text-slate-700 dark:text-slate-300 truncate" [title]="std.manufacturer">{{std.manufacturer || '-'}}</div>
                                   </div>
                                   <div class="bg-white dark:bg-slate-800 p-2">
                                       <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">CAS</div>
                                       <div class="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{std.cas_number || '-'}}</div>
                                   </div>
                               </div>

                               <!-- Stock & Storage -->
                               <div class="mt-auto">
                                   <div class="flex justify-between items-end mb-1">
                                       <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tồn kho</span>
                                       <span class="font-black text-indigo-600 dark:text-indigo-400 text-lg leading-none">{{formatNum(std.current_amount)}} <small class="text-xs font-bold text-slate-400 dark:text-slate-500">{{std.unit}}</small></span>
                                   </div>
                                   <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden mb-3">
                                       <div class="bg-indigo-500 h-1.5 rounded-full transition-all" [style.width.%]="(std.current_amount / (std.initial_amount || 1)) * 100"></div>
                                   </div>
                                   
                                   <!-- Storage Badges -->
                                   <div class="flex flex-wrap gap-1 mb-2 min-h-[22px]">
                                       @for (info of getStorageInfo(std.storage_condition); track $index) {
                                           <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1 border" [ngClass]="[info.bg, info.border, info.color]">
                                               <i class="fa-solid" [ngClass]="info.icon"></i>
                                               <span class="font-bold">{{info.text}}</span>
                                           </div>
                                       }
                                       @if(std.status === 'IN_USE' && std.current_holder) {
                                           <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1 border bg-blue-50 text-blue-600 border-blue-200" title="Người đang giữ">
                                               <i class="fa-solid fa-user"></i>
                                               <span class="font-bold truncate max-w-[80px]">{{std.current_holder}}</span>
                                           </div>
                                       }
                                   </div>
                                   @if(std.received_date) {
                                       <div class="text-[10px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                                           <i class="fa-solid fa-calendar-check text-[9px] text-blue-400 dark:text-blue-500"></i>
                                           <span class="font-medium">Nhận: <b class="text-slate-700 dark:text-slate-300">{{std.received_date | date:'dd/MM/yyyy'}}</b></span>
                                       </div>
                                   }
                               </div>

                               <!-- Footer Actions -->
                               <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                                   <div class="flex flex-col">
                                       <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Hết hạn</span>
                                       <span class="text-xs font-bold" [class]="getExpiryTimeClass(std.expiry_date)">{{getExpiryTimeLeft(std.expiry_date) || 'N/A'}}</span>
                                   </div>
                                   
                                   <div class="flex gap-1 flex-wrap justify-end">
                                       @if(std.certificate_ref) {
                                           <button (click)="$event.stopPropagation(); openCoaPreview.emit({url: std.certificate_ref, event: $event})" class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition flex items-center justify-center" title="Xem CoA">
                                               <i class="fa-solid fa-file-pdf text-xs"></i>
                                           </button>
                                       } @else if(currentUser()?.role === 'manager') {
                                           <button (click)="$event.stopPropagation(); triggerQuickDriveUpload.emit({std: std, event: $event})" [disabled]="quickUploadStdId() === std.id" class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition flex items-center justify-center" title="Upload CoA qua Google Drive">
                                               @if(quickUploadStdId() === std.id) { <i class="fa-solid fa-spinner fa-spin text-xs"></i> } @else { <i class="fa-brands fa-google-drive text-xs"></i> }
                                           </button>
                                       }
                                       <button (click)="$event.stopPropagation(); viewHistory.emit(std)" class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center" title="Lịch sử">
                                           <i class="fa-solid fa-clock-rotate-left text-xs"></i>
                                       </button>
                                       @if(canEditStandards()) {
                                           <button (click)="$event.stopPropagation(); openPrintModal.emit(std)" class="w-8 h-8 rounded-lg bg-slate-800 dark:bg-slate-700 text-white border border-slate-700 dark:border-slate-600 hover:bg-slate-900 dark:hover:bg-slate-600 transition flex items-center justify-center" title="In nhãn">
                                               <i class="fa-solid fa-print text-xs"></i>
                                           </button>
                                       }
                                       @if(canAssign(std)) {
                                           @if(canEditStandards()) {
                                               <button (click)="$event.stopPropagation(); openAssignModal.emit({std: std, isAssign: true})" class="w-auto px-3 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-md shadow-emerald-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Gán cho mượn">
                                                   <i class="fa-solid fa-hand-holding-hand"></i> Gán
                                               </button>
                                           } @else {
                                               <button (click)="$event.stopPropagation(); openAssignModal.emit({std: std, isAssign: false})" class="w-auto px-3 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Mượn chuẩn này">
                                                   <i class="fa-solid fa-hand-holding-hand"></i> Mượn
                                               </button>
                                           }
                                       } @else if (std.status === 'IN_USE' && (canEditStandards() || std.current_holder_uid === currentUser()?.uid)) {
                                           <button (click)="$event.stopPropagation(); goToReturn.emit(std)" class="w-auto px-3 h-8 rounded-lg bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Trả chuẩn">
                                               <i class="fa-solid fa-rotate-left"></i> Trả chuẩn
                                          </button>
                                       } @else if (std.status === 'DEPLETED' || std.current_amount <= 0) {
                                           @if (std.restock_requested) {
                                               <button class="w-auto px-3 h-8 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 flex items-center justify-center gap-1 font-bold text-xs cursor-not-allowed" title="Đã có người yêu cầu mua">
                                                   <i class="fa-solid fa-cart-arrow-down"></i> Đã Y/C
                                               </button>
                                           } @else {
                                               <button (click)="$event.stopPropagation(); openPurchaseRequestModal.emit(std)" class="w-auto px-3 h-8 rounded-lg bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-500 shadow-md shadow-amber-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Đề nghị mua sắm">
                                                   <i class="fa-solid fa-cart-plus"></i> Đề nghị mua
                                               </button>
                                           }
                                       }
                                   </div>
                               </div>
                           </div>
                       </div>
                   }
               </div>
           }
       }
    </div>
  `
})
export class StandardsGridViewComponent {
  items = input.required<ReferenceStandard[]>();
  isLoading = input<boolean>(false);
  allStandardsLength = input<number>(0);
  selectedIds = input<Set<string>>(new Set());
  quickUploadStdId = input<string>('');
  canEditStandards = input<boolean>(true);
  currentUser = input<UserProfile | null>(null);

  toggleSelection = output<string>();
  navigateToDetail = output<ReferenceStandard>();
  copyText = output<{text: string, event: Event}>();
  openCoaPreview = output<{url: string, event: Event}>();
  triggerQuickDriveUpload = output<{std: ReferenceStandard, event: Event}>();
  openAssignModal = output<{std: ReferenceStandard, isAssign: boolean}>();
  goToReturn = output<ReferenceStandard>();
  openPurchaseRequestModal = output<ReferenceStandard>();
  openPrintModal = output<ReferenceStandard>();
  viewHistory = output<ReferenceStandard>();

  // Helpers exposed to template
  Math = Math;
  formatNum = formatNum;
  getStorageInfo = getStorageInfo;
  getExpiryClass = getExpiryClass;
  getExpiryTimeClass = getExpiryTimeClass;
  getExpiryTimeLeft = getExpiryTimeLeft;
  getStandardStatus = getStandardStatus;
  getExpiryBarClass = getExpiryBarClass;
  canAssign = canAssign;
}
