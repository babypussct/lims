
import { Component, inject, output, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../services/state.service';
import { BatchService } from '../services/batch.service';
import { PrintService } from '../services/print.service';
import { AuthService } from '../services/auth.service';
import { Sop } from '../models/sop.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <aside class="w-80 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
      <div class="p-4 border-b border-slate-100 bg-slate-50 flex gap-2">
        <div class="relative group flex-1">
          <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-400"></i>
          <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Tìm kiếm quy trình..." 
            class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm">
        </div>
        <!-- Add SOP Button (Manager Only) -->
        @if(state.isAdmin()) {
          <button (click)="viewChange.emit('editor')" 
                  class="w-10 shrink-0 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition shadow-sm"
                  title="Quản lý / Thêm mới SOP">
             <i class="fa-solid fa-plus"></i>
          </button>
        }
      </div>
      
      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        @for (sop of filteredSops(); track sop.id) {
          <div (click)="selectSop.emit(sop)" 
               class="p-3 m-2 rounded-lg cursor-pointer transition border relative"
               [class]="activeSopId() === sop.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-transparent hover:bg-slate-100'">
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{sop.category}}</span>
              <div class="flex gap-1">
                 @if(batchService.isSelected(sop.id)) {
                   <i class="fa-solid fa-check-square text-purple-500 text-xs" title="Selected for batch"></i>
                 }
                 @if(activeSopId() === sop.id) {
                   <i class="fa-solid fa-circle-check text-blue-500 text-xs"></i>
                 }
              </div>
            </div>
            <div class="text-sm font-semibold text-slate-700 mt-0.5 line-clamp-2">{{sop.name}}</div>
          </div>
        }
      </div>

      <div class="p-3 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] space-y-1">
        
        <!-- Batch Print Action -->
        <button (click)="printBatch()" 
           class="w-full flex items-center justify-center gap-2 p-2.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm font-bold transition mb-3 border border-purple-200"
           [disabled]="batchService.count() === 0" [class.opacity-50]="batchService.count() === 0">
           <i class="fa-solid fa-print"></i> 
           In các SOP đã chọn 
           @if(batchService.count() > 0) {
              <span class="bg-purple-600 text-white text-[10px] px-1.5 rounded-full">{{batchService.count()}}</span>
           }
        </button>

        <button (click)="viewChange.emit('requests')" class="w-full flex items-center justify-between p-3 hover:bg-slate-50 text-slate-700 rounded-lg transition group relative">
          <div class="flex items-center gap-3">
             <div class="w-6 text-center"><i class="fa-solid fa-clipboard-check text-blue-500"></i></div>
             <div class="text-sm font-bold">Trạng thái Yêu cầu</div>
          </div>
          @if (state.requests().length > 0) {
            <span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{{state.requests().length}}</span>
          }
        </button>

        <button (click)="viewChange.emit('stats')" class="w-full flex items-center justify-between p-3 hover:bg-slate-50 text-slate-700 rounded-lg transition group">
          <div class="flex items-center gap-3">
             <div class="w-6 text-center"><i class="fa-solid fa-chart-simple text-purple-500"></i></div>
             <div class="text-sm font-bold">Báo cáo</div>
          </div>
        </button>

        <!-- Manager Only Links -->
        @if(state.isAdmin()) {
          <button (click)="viewChange.emit('editor')" class="w-full flex items-center justify-between p-3 hover:bg-slate-50 text-slate-700 rounded-lg transition group">
            <div class="flex items-center gap-3">
               <div class="w-6 text-center"><i class="fa-solid fa-pen-ruler text-teal-600"></i></div>
               <div class="text-sm font-bold">SOP Editor</div>
            </div>
          </button>

          <button (click)="viewChange.emit('config')" class="w-full flex items-center justify-between p-3 hover:bg-slate-50 text-slate-700 rounded-lg transition group border border-transparent hover:border-slate-200">
            <div class="flex items-center gap-3">
               <div class="w-6 text-center"><i class="fa-solid fa-gears text-slate-500"></i></div>
               <div class="text-sm font-bold">Cấu hình</div>
            </div>
          </button>
        }

        <button (click)="viewChange.emit('inventory')" class="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-md transition group mt-2">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-boxes-stacked text-orange-400"></i>
            <div class="text-left">
              <div class="font-bold text-sm">Quản lý Kho</div>
              <div class="text-[10px] text-slate-400 group-hover:text-slate-200">Tồn kho & Năng lực</div>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-xs opacity-50"></i>
        </button>
        
        <!-- User Profile removed from here as it is now in Header -->
      </div>
    </aside>
  `
})
export class SidebarComponent {
  state = inject(StateService);
  auth = inject(AuthService);
  batchService = inject(BatchService);
  printService = inject(PrintService);

  activeSopId = input<string | null>(null);
  selectSop = output<Sop>();
  viewChange = output<string>();

  searchTerm = signal('');

  filteredSops = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.state.sops().filter(sop => 
      sop.name.toLowerCase().includes(term) || 
      sop.category.toLowerCase().includes(term)
    );
  });

  printBatch() {
    const items = this.batchService.getSelectedItems();
    if (items.length > 0) {
      this.printService.print(items);
    }
  }
}
