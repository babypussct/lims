import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { UserProfile } from '../../../core/services/auth.service';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { formatNum, getStorageInfo, getExpiryClass, getExpiryTimeClass, getExpiryTimeLeft, getStandardStatus, canAssign } from '../../../shared/utils/utils';

@Component({
  selector: 'app-standards-list-view',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="min-w-[1000px]"> 
       <table class="w-full text-sm text-left relative border-collapse">
          <thead class="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none h-12 tracking-wide">
             <tr>
                <th class="px-4 py-3 w-10 text-center"><input type="checkbox" [checked]="isAllSelected()" (change)="toggleAll.emit()" class="w-4 h-4 accent-indigo-600 dark:accent-indigo-500 cursor-pointer"></th>
                <th class="px-4 py-3 w-[25%]">Định danh & Vị trí</th>
                <th class="px-4 py-3 w-[20%]">Thông tin Lô/SX</th>
                <th class="px-4 py-3 w-[15%]">Tồn kho & Bảo quản</th>
                <th class="px-4 py-3 w-[15%]">Hạn dùng & Hồ sơ</th>
                <th class="px-4 py-3 w-[10%] text-center">Trạng thái</th>
                <th class="px-4 py-3 w-[10%] text-center">Tác vụ</th>
             </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
             @if (isLoading() && allStandardsLength() === 0) {
                  @for (i of [1,2,3,4,5]; track i) {
                      <tr class="h-24">
                          <td class="px-4"><app-skeleton width="16px" height="16px"></app-skeleton></td>
                          <td class="px-4 space-y-2"><app-skeleton width="80%" height="16px"></app-skeleton><app-skeleton width="40%" height="12px"></app-skeleton></td>
                          <td class="px-4 space-y-2"><app-skeleton width="90%" height="12px"></app-skeleton><app-skeleton width="60%" height="12px"></app-skeleton></td>
                          <td class="px-4 space-y-2"><app-skeleton width="50%" height="20px"></app-skeleton><app-skeleton width="100%" height="6px"></app-skeleton></td>
                          <td class="px-4 space-y-2"><app-skeleton width="70%" height="14px"></app-skeleton><app-skeleton width="40%" height="10px"></app-skeleton></td>
                          <td class="px-4 text-center"><app-skeleton width="80px" height="24px" class="mx-auto rounded-full"></app-skeleton></td>
                          <td class="px-4 text-center"><app-skeleton width="60px" height="24px" class="mx-auto"></app-skeleton></td>
                      </tr>
                  }
             } @else {
                 @for (std of items(); track std.id) {
                    <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition group h-24" [ngClass]="{'bg-indigo-50 dark:bg-indigo-900/30': selectedIds().has(std.id!), 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0': std.status === 'DEPLETED' || std.current_amount <= 0}">
                       <td class="px-4 py-3 text-center align-top pt-4">
                           <input type="checkbox" [checked]="selectedIds().has(std.id!)" (change)="toggleSelection.emit(std.id!)" class="w-4 h-4 accent-indigo-600 dark:accent-indigo-500 cursor-pointer">
                       </td>
                       <td class="px-4 py-3 align-top">
                          <div class="flex flex-col h-full">
                              <div class="font-bold text-slate-800 dark:text-slate-200 text-base mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer leading-snug break-words" (click)="navigateToDetail.emit(std)" [title]="std.name">
                                  {{std.name}}
                              </div>
                              @if(std.chemical_name) { <div class="text-sm text-slate-500 dark:text-slate-400 italic mb-2 break-words" [title]="std.chemical_name">{{std.chemical_name}}</div> }
                              <div class="flex flex-wrap gap-2 mt-auto">
                                  @if(std.internal_id) { <span class="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-black border border-indigo-100 dark:border-indigo-800/50 tracking-tight">{{std.internal_id}}</span> }
                                  @if(std.location) { <span class="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-location-dot text-[10px]"></i> {{std.location}}</span> }
                              </div>
                          </div>
                       </td>
                       <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                          <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 truncate" [title]="std.manufacturer">{{std.manufacturer || 'N/A'}}</div>
                          <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                              <span class="font-bold text-slate-400 dark:text-slate-500">LOT:</span><span class="font-mono text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-dotted" title="Click để copy" (click)="copyText.emit({text: std.lot_number || '', event: $event})">{{std.lot_number || '-'}}</span>
                              <span class="font-bold text-slate-400 dark:text-slate-500">CODE:</span><span class="font-mono text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-dotted" title="Click để copy" (click)="copyText.emit({text: std.product_code || '', event: $event})">{{std.product_code || '-'}}</span>
                              @if(std.cas_number) { <span class="font-bold text-slate-400 dark:text-slate-500">CAS:</span><span class="font-mono text-slate-700 dark:text-slate-300">{{std.cas_number}}</span> }
                          </div>
                          <div class="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              @if(std.purity) { <span>Pur: <b class="text-slate-700 dark:text-slate-300">{{std.purity}}</b></span> }
                              @if(std.pack_size) { <span>Pack: <b class="text-slate-700 dark:text-slate-300">{{std.pack_size}}</b></span> }
                          </div>
                       </td>
                       <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                          <div class="flex items-baseline justify-between mb-1"><span class="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">{{formatNum(std.current_amount)}}</span><span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 ml-1">{{std.unit}}</span></div>
                          <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden relative"><div class="h-full rounded-full transition-all duration-500" [style.width.%]="Math.min((std.current_amount / (std.initial_amount || 1)) * 100, 100)" [class.bg-emerald-500]="(std.current_amount / (std.initial_amount || 1)) > 0.2" [class.bg-rose-500]="(std.current_amount / (std.initial_amount || 1)) <= 0.2"></div></div>
                          <div class="flex flex-col gap-1 mt-1">
                              @for (info of getStorageInfo(std.storage_condition); track $index) { <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1.5 border w-fit" [ngClass]="[info.bg, info.border, info.color]"><i class="fa-solid" [ngClass]="info.icon"></i><span class="font-bold">{{info.text}}</span></div> }
                          </div>
                          @if(std.received_date) {
                              <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                                  <i class="fa-solid fa-calendar-check text-[9px] text-blue-400 dark:text-blue-500"></i>
                                  <span class="font-medium">Nhận: <b class="text-slate-700 dark:text-slate-300">{{std.received_date | date:'dd/MM/yyyy'}}</b></span>
                              </div>
                          }
                       </td>
                       <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                          <div class="flex flex-col gap-0.5 mb-2">
                              <div class="font-mono font-bold text-xs" [class]="getExpiryClass(std.expiry_date)">{{std.expiry_date ? (std.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</div>
                              <div class="text-[10px] font-medium" [class]="getExpiryTimeClass(std.expiry_date)">{{ getExpiryTimeLeft(std.expiry_date) }}</div>
                          </div>
                          <div class="flex flex-col gap-1.5">
                              @if(std.certificate_ref) { <button (click)="openCoaPreview.emit({url: std.certificate_ref, event: $event})" class="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition w-fit"><i class="fa-solid fa-file-pdf"></i> CoA</button> }
                              @else if(currentUser()?.role === 'manager') { <button (click)="triggerQuickDriveUpload.emit({std: std, event: $event})" [disabled]="quickUploadStdId() === std.id" class="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition w-fit" title="Upload CoA nhanh qua Google Drive">
                                  @if(quickUploadStdId() === std.id) { <i class="fa-solid fa-spinner fa-spin"></i> Đang upload... } @else { <i class="fa-brands fa-google-drive"></i> Upload CoA }
                              </button> }
                              @if(std.contract_ref) { <div class="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[120px] flex items-center gap-1" title="Hợp đồng"><i class="fa-solid fa-file-contract"></i> {{std.contract_ref}}</div> }
                          </div>
                       </td>
                       <td class="px-4 py-3 align-top text-center border-l border-slate-50 dark:border-slate-800">
                           <span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide whitespace-nowrap" [ngClass]="getStandardStatus(std).class">{{getStandardStatus(std).label}}</span>
                           @if(std.status === 'IN_USE' && std.current_holder) {
                               <div class="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                                   <div class="font-bold">Người giữ:</div>
                                   <div class="truncate max-w-[100px] mx-auto" [title]="std.current_holder">{{std.current_holder}}</div>
                               </div>
                           }
                       </td>
                       <td class="px-4 py-3 align-top text-center border-l border-slate-50 dark:border-slate-800">
                          <div class="flex flex-col items-center gap-2">
                             <div class="flex gap-1">
                                 @if(canAssign(std)) {
                                     @if(canEditStandards()) {
                                         <button (click)="openAssignModal.emit({std: std, isAssign: true})" class="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-md shadow-emerald-200 dark:shadow-none transition active:scale-95" title="Gán cho mượn"><i class="fa-solid fa-hand-holding-hand text-xs"></i></button>
                                     } @else {
                                         <button (click)="openAssignModal.emit({std: std, isAssign: false})" class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none transition active:scale-95" title="Mượn chuẩn này"><i class="fa-solid fa-hand-holding-hand text-xs"></i></button>
                                     }
                                 } @else if (std.status === 'IN_USE' && (canEditStandards() || std.current_holder_uid === currentUser()?.uid)) {
                                     <button (click)="goToReturn.emit(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition active:scale-95" title="Trả chuẩn"><i class="fa-solid fa-rotate-left text-xs"></i></button>
                                 } @else if (std.status === 'DEPLETED' || std.current_amount <= 0) {
                                     @if (std.restock_requested) {
                                          <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed" title="Đã có người yêu cầu mua"><i class="fa-solid fa-cart-arrow-down text-xs"></i></button>
                                     } @else {
                                          <button (click)="openPurchaseRequestModal.emit(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-500 shadow-md shadow-amber-200 dark:shadow-none transition active:scale-95" title="Đề nghị mua"><i class="fa-solid fa-cart-plus text-xs"></i></button>
                                     }
                                 }
                                 @if(canEditStandards()) {
                                     <button (click)="openPrintModal.emit(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 shadow-md shadow-slate-200 dark:shadow-none transition active:scale-95" title="In nhãn"><i class="fa-solid fa-print text-xs"></i></button>
                                 }
                             </div>
                             <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                 <button (click)="viewHistory.emit(std)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700" title="Lịch sử"><i class="fa-solid fa-clock-rotate-left text-[10px]"></i></button>
                                 @if(canEditStandards()) { <button (click)="openEditModal.emit(std)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition" title="Sửa"><i class="fa-solid fa-pen text-[10px]"></i></button> }
                             </div>
                          </div>
                       </td>
                    </tr>
                 } 
                 @if (items().length === 0) { <tr><td colspan="7" class="p-16 text-center text-slate-400 dark:text-slate-500 italic">Không tìm thấy dữ liệu.</td></tr> }
             }
          </tbody>
       </table>
    </div>
  `
})
export class StandardsListViewComponent {
  items = input.required<ReferenceStandard[]>();
  isLoading = input<boolean>(false);
  allStandardsLength = input<number>(0);
  selectedIds = input<Set<string>>(new Set());
  quickUploadStdId = input<string>('');
  canEditStandards = input<boolean>(true);
  currentUser = input<UserProfile | null>(null);

  toggleSelection = output<string>();
  toggleAll = output<void>();
  navigateToDetail = output<ReferenceStandard>();
  copyText = output<{text: string, event: Event}>();
  openCoaPreview = output<{url: string, event: Event}>();
  triggerQuickDriveUpload = output<{std: ReferenceStandard, event: Event}>();
  openAssignModal = output<{std: ReferenceStandard, isAssign: boolean}>();
  goToReturn = output<ReferenceStandard>();
  openPurchaseRequestModal = output<ReferenceStandard>();
  openPrintModal = output<ReferenceStandard>();
  viewHistory = output<ReferenceStandard>();
  openEditModal = output<ReferenceStandard>();

  // Helpers exposed to template
  Math = Math;
  formatNum = formatNum;
  getStorageInfo = getStorageInfo;
  getExpiryClass = getExpiryClass;
  getExpiryTimeClass = getExpiryTimeClass;
  getExpiryTimeLeft = getExpiryTimeLeft;
  getStandardStatus = getStandardStatus;
  canAssign = canAssign;

  isAllSelected() {
      return this.items().length > 0 && this.items().every(i => this.selectedIds().has(i.id!));
  }
}
