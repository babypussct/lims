import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenceStandard, CoaMatchItem } from '../../../core/models/standard.model';

@Component({
  selector: 'app-standards-bulk-coa-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
         <div class="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800 max-h-[90vh]">
            
            <!-- Header -->
            <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
               <div>
                  <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 tracking-tight">
                      <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
                          <i class="fa-solid fa-file-contract"></i>
                      </div>
                      Trình ghép nối CoA Hàng loạt
                  </h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Kiểm tra kết quả nhận diện tự động và tải tài liệu lên Google Drive.</p>
               </div>
               @if(!isUploading) {
                 <button (click)="cancel.emit()" class="w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition">
                    <i class="fa-solid fa-times text-lg"></i>
                 </button>
               }
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-hidden flex flex-col p-6 bg-slate-50/30 dark:bg-slate-900/50 relative">
               
               <!-- Summary Stats -->
               <div class="flex gap-4 mb-4">
                  <div class="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 flex-1 shadow-sm flex items-center justify-between">
                     <span class="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Tổng số Files</span>
                     <span class="text-xl font-black text-slate-800 dark:text-slate-100">{{items.length}}</span>
                  </div>
                  <div class="bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800/30 flex-1 shadow-sm flex items-center justify-between">
                     <span class="text-emerald-600 dark:text-emerald-500 font-bold text-xs uppercase tracking-wider">Ghép thành công</span>
                     <span class="text-xl font-black text-emerald-600 dark:text-emerald-400">{{matchedCount()}}</span>
                  </div>
                  <div class="bg-amber-50 dark:bg-amber-900/10 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800/30 flex-1 shadow-sm flex items-center justify-between">
                     <span class="text-amber-600 dark:text-amber-500 font-bold text-xs uppercase tracking-wider">Chưa xác định</span>
                     <span class="text-xl font-black text-amber-600 dark:text-amber-400">{{unmatchedCount()}}</span>
                  </div>
               </div>

               @if(isUploading) {
                   <!-- Upload Progress -->
                   <div class="mb-4 bg-white dark:bg-slate-800 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
                       <div class="flex justify-between items-center mb-2">
                           <span class="font-bold text-slate-700 dark:text-slate-300">Đang tải lên Drive...</span>
                           <span class="font-black text-indigo-600 dark:text-indigo-400">{{successCount()}} / {{itemsToUpload()}}</span>
                       </div>
                       <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                           <div class="bg-indigo-500 h-full rounded-full transition-all duration-300 relative overflow-hidden" [style.width.%]="(successCount() / (itemsToUpload() || 1)) * 100">
                               <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                           </div>
                       </div>
                       @if (errorCount() > 0) {
                           <div class="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                               <i class="fa-solid fa-triangle-exclamation"></i> Có {{errorCount()}} file tải lỗi.
                           </div>
                       }
                   </div>
               }

               <!-- Table container -->
               <div class="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
                   <table class="w-full text-sm text-left border-collapse">
                       <thead class="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-900 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                           <tr>
                               <th class="px-4 py-3 w-12 text-center">STT</th>
                               <th class="px-4 py-3 w-[40%]">Tên File (CoA)</th>
                               <th class="px-4 py-3 w-[40%]">Chuẩn đối chiếu Tự động Nhận diện</th>
                               <th class="px-4 py-3 w-[15%] text-center">Trạng thái Upload</th>
                           </tr>
                       </thead>
                       <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                           @for (item of items; track $index) {
                               <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition group" [ngClass]="{'bg-red-50/50 dark:bg-red-900/10': !item.matchedStandard}">
                                   <td class="px-4 py-3 text-center text-slate-400 font-medium">{{$index + 1}}</td>
                                   <td class="px-4 py-3">
                                       <div class="flex items-center gap-2">
                                           <i class="fa-regular text-lg" [ngClass]="getFileIcon(item.fileName)"></i>
                                           <span class="font-bold text-slate-700 dark:text-slate-300 break-all text-xs" [title]="item.fileName">
                                               @for (seg of getHighlightedFilenameSegments(item.fileName, item); track $index) {
                                                   @if (seg.isMatch) {
                                                       <span class="bg-yellow-200 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-200 px-0.5 rounded shadow-sm border border-yellow-300 dark:border-yellow-600/50">{{seg.text}}</span>
                                                   } @else {
                                                       <span>{{seg.text}}</span>
                                                   }
                                               }
                                           </span>
                                       </div>
                                       @if(item.file.size) { <div class="text-[10px] text-slate-400 mt-0.5 ml-6">{{(item.file.size / 1024).toFixed(1)}} KB</div> }
                                   </td>
                                   <td class="px-4 py-3">
                                       @if (!isUploading) {
                                           <select 
                                               [ngModel]="item.matchedStandard?.id || ''" 
                                               (ngModelChange)="onManualMatchChange(item, $event)"
                                               class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg text-xs font-medium transition"
                                               [ngClass]="item.matchedStandard ? 'border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 focus:border-emerald-500' : 'border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 focus:border-amber-500'">
                                               <option value="">-- [Bỏ qua] Không nhận diện được --</option>
                                               @if (item.suggestedStandards) {
                                                   @for (s of item.suggestedStandards; track s.std.id) {
                                                       <option [value]="s.std.id" class="dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                           [{{s.score}} điểm] {{s.std.name}} (LOT: {{s.std.lot_number || 'N/A'}}) - {{s.std.product_code || 'No Code'}}
                                                       </option>
                                                   }
                                               } @else {
                                                   @for (std of allStandards; track std.id) {
                                                       <option [value]="std.id" class="dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                           {{std.name}} (LOT: {{std.lot_number || 'N/A'}}) - {{std.product_code || 'No Code'}}
                                                       </option>
                                                   }
                                               }
                                           </select>
                                           @if(item.matchedStandard) {
                                               <div class="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-between font-medium px-1">
                                                   <span class="flex items-center gap-1 truncate"><i class="fa-solid fa-check"></i> Đã chọn: {{item.matchedStandard.name}}</span>
                                                   @if(item.matchScore !== undefined) {
                                                       <span class="font-bold bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded ml-1 shrink-0">{{item.matchScore}}đ</span>
                                                   }
                                               </div>
                                           } @else {
                                               <div class="mt-1 text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium px-1">
                                                   <i class="fa-solid fa-triangle-exclamation"></i> Sẽ bị bỏ qua khi Tải lên
                                               </div>
                                           }
                                       } @else {
                                           <!-- Readonly Mode During Upload -->
                                           @if(item.matchedStandard) {
                                               <div class="bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center">
                                                   <span class="truncate">{{item.matchedStandard.name}} (LOT: {{item.matchedStandard.lot_number || 'N/A'}})</span>
                                                   @if(item.matchScore !== undefined) {
                                                       <span class="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded ml-1 shrink-0">{{item.matchScore}}đ</span>
                                                   }
                                               </div>
                                           } @else {
                                               <span class="text-xs italic text-slate-400">Đã bỏ qua</span>
                                           }
                                       }
                                   </td>
                                   <td class="px-4 py-3 text-center">
                                       @if(item.status === 'pending') {
                                           <span class="px-2 py-1 bg-slate-100 text-slate-500 dark:bg-slate-800 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-sm">Chờ xử lý</span>
                                       } @else if(item.status === 'uploading') {
                                           <span class="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded text-[10px] font-bold border border-blue-200 dark:border-blue-800/50 shadow-sm flex items-center gap-1 w-fit mx-auto">
                                                <i class="fa-solid fa-spinner fa-spin"></i> Đang tải
                                           </span>
                                       } @else if(item.status === 'success') {
                                           <span class="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/50 shadow-sm"><i class="fa-solid fa-check"></i> Hoàn tất</span>
                                       } @else if(item.status === 'error') {
                                           <span class="px-2 py-1 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded text-[10px] font-bold border border-red-200 dark:border-red-800/50 shadow-sm" [title]="item.uploadError"><i class="fa-solid fa-xmark"></i> Lỗi</span>
                                       }
                                   </td>
                               </tr>
                           }
                           @if (items.length === 0) {
                               <tr>
                                   <td colspan="4" class="p-8 text-center text-slate-400 italic bg-slate-50/50 dark:bg-slate-900/50">Không có dữ liệu.</td>
                               </tr>
                           }
                       </tbody>
                   </table>
               </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
               <div class="text-xs text-slate-500 font-medium">
                  Tính năng sử dụng Upload Queue của Google Drive API. Các file không được ghép chuẩn sẽ bị bỏ qua.
               </div>
               
               <div class="flex gap-3">
                   @if(!isUploading && uploadComplete) {
                       <button (click)="cancel.emit()" class="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition shadow-sm">
                           Đóng
                       </button>
                   } @else {
                       <button (click)="cancel.emit()" [disabled]="isUploading" class="px-6 py-2.5 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition disabled:opacity-50">
                           Hủy bỏ thao tác
                       </button>
                       <button (click)="onConfirm()" [disabled]="isUploading || itemsToUpload() === 0" class="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none transition flex items-center gap-2 disabled:opacity-50">
                           <i class="fa-solid fa-cloud-arrow-up"></i> Bắt đầu Tải lên ({{itemsToUpload()}})
                       </button>
                   }
               </div>
            </div>
         </div>
      </div>
    }
  `
})
export class StandardsBulkCoaModalComponent {
  @Input() isOpen = false;
  @Input() items: CoaMatchItem[] = [];
  @Input() allStandards: ReferenceStandard[] = [];
  @Input() isUploading = false;
  @Input() uploadComplete = false;
  
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  // Use functions instead of signals so it updates dynamically with input items array modifications
  matchedCount() {
    return this.items.filter(i => i.matchedStandard).length;
  }
  
  unmatchedCount() {
    return this.items.filter(i => !i.matchedStandard).length;
  }
  
  itemsToUpload() {
      return this.items.filter(i => i.matchedStandard).length;
  }

  successCount() {
      return this.items.filter(i => i.status === 'success').length;
  }

  errorCount() {
      return this.items.filter(i => i.status === 'error').length;
  }

  onConfirm() {
    this.confirm.emit();
  }

  onManualMatchChange(item: CoaMatchItem, stdId: string) {
      if (!stdId) {
          item.matchedStandard = null;
          return;
      }
      const found = this.allStandards.find(s => s.id === stdId);
      if (found) {
          item.matchedStandard = found;
      }
  }

  getFileIcon(filename: string): string {
      const lower = filename.toLowerCase();
      if (lower.endsWith('.pdf')) return 'fa-file-pdf text-rose-500';
      if (lower.match(/\.(jpg|jpeg|png|webp|bmp)$/)) return 'fa-file-image text-blue-500';
      if (lower.match(/\.(doc|docx)$/)) return 'fa-file-word text-blue-600';
      return 'fa-file text-slate-500';
  }

  getHighlightedFilenameSegments(filename: string, item: CoaMatchItem): { text: string; isMatch: boolean }[] {
      const std = item.matchedStandard;
      if (!std) return [{ text: filename, isMatch: false }];

      const matchWords: string[] = [];
      const addWords = (str: any) => {
          if (!str || typeof str !== 'string' || str === '-' || str === 'na' || str === 'n/a' || str === 'N/A') return;
          
          // Exact text
          if (str.length >= 3 && filename.toLowerCase().includes(str.toLowerCase())) {
              matchWords.push(str);
          }
          // Stripped text (e.g. "Lot-123" -> "Lot123")
          const clean = str.replace(/[^a-zA-Z0-9]/g, '');
          if (clean !== str && clean.length >= 3 && filename.toLowerCase().includes(clean.toLowerCase())) {
              matchWords.push(clean);
          }
      };

      addWords(std.lot_number);
      addWords(std.product_code);

      if (matchWords.length === 0) return [{ text: filename, isMatch: false }];

      // Sort by length desc to match longer tokens first
      matchWords.sort((a, b) => b.length - a.length);

      // Escape regex chars
      const escape = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // Create pattern matching dynamically any of the strings
      const pattern = new RegExp(`(${matchWords.map(escape).join('|')})`, 'gi');

      const parts = filename.split(pattern);
      return parts.filter(p => p.length > 0).map(p => {
          const isMatch = matchWords.some(w => w.toLowerCase() === p.toLowerCase());
          return { text: p, isMatch };
      });
  }
}
