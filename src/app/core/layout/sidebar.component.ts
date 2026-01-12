
import { Component, inject, Output, EventEmitter, input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';
import { Sop } from '../../models/sop.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <aside class="w-80 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40">
      <!-- Logo Area -->
      <div class="p-6 pb-2">
          <div class="flex items-center gap-3 px-2">
              <div class="w-8 h-8 rounded-lg bg-gradient-soft flex items-center justify-center text-white shadow-soft-md">
                  <i class="fa-solid fa-dna"></i>
              </div>
              <h1 class="font-display font-bold text-slate-800 text-lg tracking-tight">LIMS Cloud <span class="text-fuchsia-600">Pro</span></h1>
          </div>
      </div>

      <!-- Search -->
      <div class="px-6 py-4">
        <div class="relative group">
          <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-400 group-focus-within:text-fuchsia-500 transition-colors"></i>
          <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Tìm nhanh quy trình..." 
            class="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-100 focus:border-fuchsia-300 transition shadow-inner">
        </div>
        <!-- Create SOP Button (Protected by SOP_EDIT) -->
        @if(auth.canEditSop()) {
          <button (click)="createNewSop.emit()" 
                  class="w-full mt-3 bg-slate-800 text-white rounded-xl py-2.5 hover:bg-slate-700 flex items-center justify-center gap-2 transition shadow-lg shadow-slate-200 active:scale-95 text-xs font-bold uppercase tracking-wide">
             <i class="fa-solid fa-plus"></i> Tạo Quy Trình Mới
          </button>
        }
      </div>
      
      <!-- SOP List -->
      <div class="flex-1 overflow-y-auto px-4 pb-2 space-y-1 custom-scrollbar">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-2">Danh sách SOP</div>
        @for (sop of filteredSops(); track sop.id) {
          <div (click)="selectSop.emit(sop)" 
               class="px-4 py-3 rounded-xl transition border cursor-pointer relative group flex flex-col gap-1"
               [class]="activeSopId() === sop.id ? 'bg-white shadow-soft-md border-fuchsia-100 ring-1 ring-fuchsia-50' : 'border-transparent hover:bg-slate-50'">
            
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 rounded border border-slate-200">{{sop.category}}</span>
              @if(activeSopId() === sop.id) {
                 <i class="fa-solid fa-circle-check text-fuchsia-500 text-xs animate-bounce-in"></i>
              }
            </div>
            <div class="text-sm font-bold text-slate-700 group-hover:text-fuchsia-700 transition-colors line-clamp-2 leading-snug">
                {{sop.name}}
            </div>
          </div>
        } @empty {
            <div class="text-center py-8 text-slate-400 italic text-xs">
                Không tìm thấy quy trình nào.
            </div>
        }
      </div>

      <!-- Bottom Navigation -->
      <div class="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
        
        <button (click)="viewChange.emit('printing')" class="w-full flex items-center justify-between px-4 py-3 hover:bg-white text-slate-600 hover:text-fuchsia-700 hover:shadow-soft-sm rounded-xl transition group relative border border-transparent hover:border-slate-100">
          <div class="flex items-center gap-3">
             <div class="w-6 text-center"><i class="fa-solid fa-print text-fuchsia-500 group-hover:scale-110 transition-transform"></i></div>
             <div class="text-xs font-bold uppercase tracking-wide">Hàng đợi In</div>
          </div>
          @if (state.printableLogs().length > 0) {
            <span class="bg-fuchsia-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-soft-md">{{state.printableLogs().length}}</span>
          }
        </button>

        <button (click)="viewChange.emit('requests')" class="w-full flex items-center justify-between px-4 py-3 hover:bg-white text-slate-600 hover:text-blue-600 hover:shadow-soft-sm rounded-xl transition group relative border border-transparent hover:border-slate-100">
          <div class="flex items-center gap-3">
             <div class="w-6 text-center"><i class="fa-solid fa-clipboard-check text-blue-500 group-hover:scale-110 transition-transform"></i></div>
             <div class="text-xs font-bold uppercase tracking-wide">Yêu cầu Duyệt</div>
          </div>
          @if (state.requests().length > 0) {
            <span class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-soft-md animate-pulse">{{state.requests().length}}</span>
          }
        </button>

        <!-- Stats -->
        @if(auth.canViewReports()) {
          <button (click)="viewChange.emit('stats')" class="w-full flex items-center justify-between px-4 py-3 hover:bg-white text-slate-600 hover:text-orange-600 hover:shadow-soft-sm rounded-xl transition group relative border border-transparent hover:border-slate-100">
            <div class="flex items-center gap-3">
               <div class="w-6 text-center"><i class="fa-solid fa-chart-pie text-orange-500 group-hover:scale-110 transition-transform"></i></div>
               <div class="text-xs font-bold uppercase tracking-wide">Báo cáo</div>
            </div>
          </button>
        }

        <!-- Inventory -->
        <button (click)="viewChange.emit('inventory')" class="w-full flex items-center justify-between px-4 py-3 bg-white text-slate-700 shadow-soft-sm border border-slate-100 rounded-xl transition hover:shadow-soft-md group">
          <div class="flex items-center gap-3">
            <div class="w-6 text-center"><i class="fa-solid fa-boxes-stacked text-indigo-500 group-hover:scale-110 transition-transform"></i></div>
            <div class="text-left">
              <div class="text-xs font-bold uppercase tracking-wide">Quản lý Kho</div>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:text-indigo-500"></i>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit, OnDestroy {
  state: StateService = inject(StateService);
  auth: AuthService = inject(AuthService);
  
  // Inputs
  activeSopId = input<string | null>(null);
  
  // Outputs
  @Output() selectSop = new EventEmitter<Sop>();
  @Output() viewChange = new EventEmitter<string>();
  @Output() createNewSop = new EventEmitter<void>();

  searchTerm = signal('');
  filteredSops = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const items = this.state.sops().filter(sop => sop.name.toLowerCase().includes(term) || sop.category.toLowerCase().includes(term));
    return items.sort((a,b) => a.category.localeCompare(b.category));
  });

  isOnline = signal(navigator.onLine);
  private onlineListener: any;
  private offlineListener: any;

  ngOnInit() {
      this.onlineListener = () => this.isOnline.set(true);
      this.offlineListener = () => this.isOnline.set(false);
      window.addEventListener('online', this.onlineListener);
      window.addEventListener('offline', this.offlineListener);
  }

  ngOnDestroy() {
      window.removeEventListener('online', this.onlineListener);
      window.removeEventListener('offline', this.offlineListener);
  }
}
