import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standards-import-data-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
      <!-- IMPORT PREVIEW MODAL -->
      @if (data().length > 0) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-file-import text-emerald-600 dark:text-emerald-500"></i> Xác nhận Import
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Vui lòng kiểm tra kỹ ngày tháng trước khi lưu.</p>
                    </div>
                    <button (click)="onCancel()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-auto custom-scrollbar p-6">
                    <div class="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/50 rounded-lg p-3 flex gap-3 text-sm text-yellow-800 dark:text-yellow-500">
                        <i class="fa-solid fa-triangle-exclamation mt-0.5"></i>
                        <div>
                            <span class="font-bold">Lưu ý ngày tháng:</span> Hệ thống đang ép kiểu ngày tháng theo định dạng <b>dd/mm/yyyy</b> (Việt Nam).<br>
                            Ví dụ: Chuỗi <b>05/10/2024</b> sẽ được hiểu là ngày <b>5 tháng 10</b>. Hãy kiểm tra cột "Kết quả (Hệ thống hiểu)" bên dưới.
                        </div>
                    </div>

                    <table class="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700">
                        <thead class="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase sticky top-0">
                            <tr>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Tên Chuẩn</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Lô (Lot)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 w-32">Ngày nhận (Gốc)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 w-32">Kết quả (Hệ thống hiểu)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Hạn dùng (Parsed)</th>
                            </tr>
                        </thead>
                        <tbody class="text-slate-700 dark:text-slate-300">
                            @for (item of data().slice(0, 10); track $index) {
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 break-words" [title]="item.parsed.name">{{item.parsed.name}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono">{{item.parsed.lot_number}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono bg-red-50/30 dark:bg-red-900/10">{{item.raw['Ngày nhận (Gốc)']}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-bold font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10">
                                        {{item.parsed.received_date ? (item.parsed.received_date | date:'dd/MM/yyyy') : '---'}}
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono">
                                        {{item.parsed.expiry_date ? (item.parsed.expiry_date | date:'dd/MM/yyyy') : '---'}}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    @if(data().length > 10) {
                        <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-2 italic">... và {{data().length - 10}} dòng khác.</p>
                    }
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="onCancel()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                    <button (click)="onConfirm()" [disabled]="isImporting()" class="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                        @if(isImporting()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... }
                        @else { <i class="fa-solid fa-check"></i> Xác nhận Import }
                    </button>
                </div>
            </div>
         </div>
      }
  `
})
export class StandardsImportDataModalComponent {
  data = input<any[]>([]);
  isImporting = input<boolean>(false);
  cancel = output<void>();
  confirm = output<void>();

  onCancel() { this.cancel.emit(); }
  onConfirm() { this.confirm.emit(); }
}


@Component({
  selector: 'app-standards-import-usage-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
      <!-- IMPORT USAGE LOG PREVIEW MODAL -->
      @if (data().length > 0) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-book-open text-teal-600 dark:text-teal-500"></i> Xác nhận Import Nhật ký
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Vui lòng kiểm tra dữ liệu trước khi lưu. Các dòng lỗi hoặc trùng lặp sẽ bị bỏ qua.</p>
                    </div>
                    <button (click)="onCancel()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-auto p-6 bg-white dark:bg-slate-900">
                    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-500 p-4 rounded-xl text-sm flex items-start gap-3">
                        <i class="fa-solid fa-triangle-exclamation mt-0.5 text-amber-500 dark:text-amber-400"></i>
                        <div>
                            <strong>Lưu ý quan trọng:</strong>
                            <ul class="list-disc pl-5 mt-1 space-y-1 text-amber-700/80 dark:text-amber-400/80">
                                <li>Hệ thống sẽ tự động tìm kiếm chất chuẩn dựa trên <strong>Số nhận diện</strong> hoặc <strong>Tên + Số lô</strong>.</li>
                                <li>Nếu nhật ký (cùng ngày, người pha, lượng dùng) đã tồn tại, dòng đó sẽ bị bỏ qua (trùng lặp).</li>
                                <li>Lượng dùng sẽ được tự động trừ vào tồn kho hiện tại của chất chuẩn.</li>
                            </ul>
                        </div>
                    </div>

                    <table class="w-full text-sm text-left mt-4">
                        <thead>
                            <tr class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800">
                                <th class="p-2 border border-slate-200 dark:border-slate-700 w-10 text-center">STT</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Chất chuẩn (Excel)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Ngày pha</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Người pha</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700 text-right">Lượng dùng</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody class="text-slate-700 dark:text-slate-300">
                            @for (item of data().slice(0, 15); track $index) {
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50" [ngClass]="{'bg-red-50 dark:bg-red-900/10': !item.isValid, 'bg-amber-50 dark:bg-amber-900/10': item.isDuplicate}">
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 text-center text-slate-400 dark:text-slate-500">{{$index + 1}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">
                                        <div class="font-bold text-slate-700 dark:text-slate-200 break-words" [title]="item.raw['Tên']">{{item.raw['Tên']}}</div>
                                        <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">Lô: {{item.raw['Lô']}}</div>
                                        @if(item.standard) {
                                            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1"><i class="fa-solid fa-check-circle"></i> Map: {{item.standard.internal_id || 'OK'}}</div>
                                        }
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono">{{item.raw['Ngày']}} <br> <span class="text-xs text-slate-400 dark:text-slate-500">{{item.log.date | date:'dd/MM/yyyy'}}</span></td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">{{item.raw['Người']}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 text-right font-mono font-bold">
                                        {{item.raw['Lượng']}}
                                        @if(item.standard) { <span class="text-xs font-normal text-slate-500 dark:text-slate-400">{{item.standard.unit}}</span> }
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">
                                        @if(item.isValid && !item.isDuplicate) {
                                            <span class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-bold"><i class="fa-solid fa-check"></i> Hợp lệ</span>
                                        } @else if (item.isDuplicate) {
                                            <span class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-bold" title="Nhật ký này đã có trong hệ thống"><i class="fa-solid fa-copy"></i> Trùng lặp</span>
                                        } @else {
                                            <span class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-bold" [title]="item.errorMessage"><i class="fa-solid fa-xmark"></i> Lỗi</span>
                                            <div class="text-[10px] text-red-500 dark:text-red-400 mt-1">{{item.errorMessage}}</div>
                                        }
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    @if(data().length > 15) {
                        <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-2 italic">... và {{data().length - 15}} dòng khác.</p>
                    }
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div class="text-sm font-bold text-slate-600 dark:text-slate-400">
                        Tổng: {{data().length}} | 
                        <span class="text-emerald-600 dark:text-emerald-400">Hợp lệ: {{validCount()}}</span> | 
                        <span class="text-amber-600 dark:text-amber-400">Trùng: {{duplicateCount()}}</span> | 
                        <span class="text-red-500 dark:text-red-400">Lỗi: {{errorCount()}}</span>
                    </div>
                    <div class="flex gap-3">
                        <button (click)="onCancel()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                        <button (click)="onConfirm()" [disabled]="isImporting() || validCount() === 0" class="px-6 py-2.5 bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                            @if(isImporting()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... }
                            @else { <i class="fa-solid fa-check"></i> Import Hợp lệ }
                        </button>
                    </div>
                </div>
            </div>
         </div>
      }
  `
})
export class StandardsImportUsageModalComponent {
  data = input<any[]>([]);
  validCount = input<number>(0);
  duplicateCount = input<number>(0);
  errorCount = input<number>(0);
  isImporting = input<boolean>(false);
  
  cancel = output<void>();
  confirm = output<void>();

  onCancel() { this.cancel.emit(); }
  onConfirm() { this.confirm.emit(); }
}
