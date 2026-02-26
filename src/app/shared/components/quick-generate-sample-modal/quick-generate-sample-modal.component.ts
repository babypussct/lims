import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quick-generate-sample-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-bounce-in relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
            
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h3 class="font-black text-xl text-slate-800 mb-1">Tạo nhanh Mã Mẫu</h3>
                    <p class="text-sm text-slate-500">Tự động sinh danh sách mã mẫu theo quy tắc.</p>
                </div>
                <button (click)="close.emit()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition flex items-center justify-center">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tiền tố (Prefix)</label>
                    <input type="text" [ngModel]="prefix()" (ngModelChange)="prefix.set($event)" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition" placeholder="VD: U">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Từ số (Bắt đầu)</label>
                        <input type="text" [ngModel]="fromStr()" (ngModelChange)="fromStr.set($event)" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition" placeholder="VD: 01">
                        <p class="text-[9px] text-slate-400 mt-1 italic">Sẽ giữ nguyên số 0 ở đầu</p>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Đến số (Kết thúc)</label>
                        <input type="text" [ngModel]="toStr()" (ngModelChange)="toStr.set($event)" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition" placeholder="VD: 03">
                    </div>
                </div>

                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Hậu tố (Suffix)</label>
                    <input type="text" [ngModel]="suffix()" (ngModelChange)="suffix.set($event)" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition" placeholder="VD: 24">
                </div>
                
                <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4">
                    <div class="text-[10px] font-bold text-indigo-400 uppercase mb-2">Xem trước kết quả</div>
                    <div class="text-sm font-mono text-indigo-700 break-words max-h-24 overflow-y-auto custom-scrollbar">
                        {{ previewResult() || 'Chưa có dữ liệu' }}
                    </div>
                </div>
            </div>

            <div class="flex gap-3 mt-8">
                <button (click)="close.emit()" class="flex-1 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition">Hủy</button>
                <button (click)="generate()" [disabled]="!canGenerate()" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Chèn vào danh sách
                </button>
            </div>
        </div>
    </div>
  `
})
export class QuickGenerateSampleModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() generated = new EventEmitter<string[]>();

  prefix = signal('');
  fromStr = signal('');
  toStr = signal('');
  suffix = signal('');

  canGenerate(): boolean {
      const from = parseInt(this.fromStr(), 10);
      const to = parseInt(this.toStr(), 10);
      
      if (this.fromStr() && !isNaN(from)) {
          if (this.toStr() && !isNaN(to)) {
              return from <= to;
          }
          return true; // Only 'From' is provided
      }
      return false;
  }

  generateList(): string[] {
      if (!this.canGenerate()) return [];
      
      const from = parseInt(this.fromStr(), 10);
      const to = parseInt(this.toStr(), 10);
      const padding = this.fromStr().length;
      
      const results: string[] = [];
      const end = !isNaN(to) ? to : from;
      
      for (let i = from; i <= end; i++) {
          const numStr = i.toString().padStart(padding, '0');
          results.push(`${this.prefix()}${numStr}${this.suffix()}`);
      }
      
      return results;
  }

  previewResult(): string {
      const list = this.generateList();
      if (list.length === 0) return '';
      if (list.length > 5) {
          return list.slice(0, 5).join(', ') + ` ... (và ${list.length - 5} mẫu khác)`;
      }
      return list.join(', ');
  }

  generate() {
      const list = this.generateList();
      if (list.length > 0) {
          this.generated.emit(list);
      }
  }
}
