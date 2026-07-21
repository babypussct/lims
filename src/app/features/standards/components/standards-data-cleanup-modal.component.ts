import { Component, inject, signal, effect, input, output, computed, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { PubchemService, formatChemicalName } from '../../../core/services/pubchem.service';
import { StandardService } from '../standard.service';
import { ToastService } from '../../../core/services/toast.service';
import { ProgressService } from '../../../core/services/progress.service';

interface CleanupGroup {
    id: string; // CAS number lowercased
    standards: ReferenceStandard[];
    cas: string;
    originalNames: string[];
    suggestedName: string;
    suggestedSynonyms: string;
    selected: boolean;
    status: 'pending' | 'loading' | 'ready' | 'success' | 'error';
    errorMsg?: string;
}

@Component({
  selector: 'app-standards-data-cleanup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
      @if (isOpen()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200/80 dark:border-slate-800 animate-slide-up">
                
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg shadow-sm">
                            <i class="fa-solid fa-broom"></i>
                        </div>
                        <div>
                            <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                                Công cụ Chuẩn hóa Dữ liệu (Data Cleanup)
                            </h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tự động gom nhóm các chuẩn cùng Số CAS & đồng bộ Tên thương mại / Synonyms chuẩn quốc tế từ PubChem.</p>
                        </div>
                    </div>
                    <button (click)="onClose()" [disabled]="isProcessing() || isFetchingAll()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>

                <!-- Stats Summary Banner -->
                <div class="px-6 py-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100/60 dark:border-indigo-900/30 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                    <div class="flex items-center gap-4 flex-wrap">
                        <span class="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-bold">
                            <i class="fa-solid fa-boxes-stacked text-indigo-500"></i> Tổng kho: <strong class="text-indigo-600 dark:text-indigo-400 font-extrabold">{{totalStandardsCount()}}</strong> lọ chuẩn
                        </span>
                        <span class="text-slate-300 dark:text-slate-700">|</span>
                        <span class="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                            <i class="fa-solid fa-object-group text-emerald-500"></i> Phân thành: <strong class="font-extrabold">{{groups().length}}</strong> nhóm CAS
                        </span>
                        @if (noCasCount() > 0) {
                            <span class="text-slate-300 dark:text-slate-700">|</span>
                            <span class="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                                <i class="fa-solid fa-triangle-exclamation"></i> Không có CAS: <strong>{{noCasCount()}}</strong> lọ (đã bỏ qua)
                            </span>
                        }
                    </div>
                    <div class="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                        Đã chọn hợp lệ: <span class="text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">{{selectedCount()}}</span> / {{groups().length}} nhóm
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="flex-1 overflow-y-auto p-0 custom-scrollbar bg-white dark:bg-slate-900 flex flex-col">
                    
                    <!-- Search & Action Toolbar -->
                    <div class="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                        <div class="flex items-center gap-2 flex-1 min-w-[280px]">
                            <!-- Search input -->
                            <div class="relative flex-1 max-w-sm">
                                <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs"></i>
                                <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Tìm theo CAS, tên cũ, tên đề xuất..." class="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition">
                                @if (searchQuery()) {
                                    <button (click)="searchQuery.set('')" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1">
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                }
                            </div>

                            <!-- Quick Status Filter Tabs -->
                            <div class="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700 text-[11px] font-bold">
                                <button (click)="statusFilter.set('all')" [class.bg-white]="statusFilter() === 'all'" [class.dark:bg-slate-700]="statusFilter() === 'all'" [class.shadow-xs]="statusFilter() === 'all'" [class.text-indigo-600]="statusFilter() === 'all'" [class.dark:text-indigo-400]="statusFilter() === 'all'" class="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 transition">Tất cả ({{groups().length}})</button>
                                <button (click)="statusFilter.set('unnamed')" [class.bg-white]="statusFilter() === 'unnamed'" [class.dark:bg-slate-700]="statusFilter() === 'unnamed'" [class.shadow-xs]="statusFilter() === 'unnamed'" [class.text-amber-600]="statusFilter() === 'unnamed'" class="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 transition">Chưa tên ({{unnamedCount()}})</button>
                                <button (click)="statusFilter.set('ready')" [class.bg-white]="statusFilter() === 'ready'" [class.dark:bg-slate-700]="statusFilter() === 'ready'" [class.shadow-xs]="statusFilter() === 'ready'" [class.text-emerald-600]="statusFilter() === 'ready'" class="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 transition">Sẵn sàng ({{readyCount()}})</button>
                                <button (click)="statusFilter.set('error')" [class.bg-white]="statusFilter() === 'error'" [class.dark:bg-slate-700]="statusFilter() === 'error'" [class.shadow-xs]="statusFilter() === 'error'" [class.text-red-600]="statusFilter() === 'error'" class="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 transition">Lỗi ({{errorCount()}})</button>
                                <button (click)="statusFilter.set('success')" [class.bg-white]="statusFilter() === 'success'" [class.dark:bg-slate-700]="statusFilter() === 'success'" [class.shadow-xs]="statusFilter() === 'success'" [class.text-emerald-700]="statusFilter() === 'success'" class="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 transition">Đã lưu ({{successCount()}})</button>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-2">
                            <button (click)="scanData()" [disabled]="isFetchingAll() || isProcessing()" class="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 disabled:opacity-50">
                                <i class="fa-solid fa-rotate"></i> Quét lại
                            </button>
                            <button (click)="fetchPubchemForAll()" [disabled]="groups().length === 0 || isFetchingAll() || isProcessing()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                @if(isFetchingAll()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang quét... }
                                @else { <i class="fa-solid fa-wand-magic-sparkles"></i> Gợi ý tất cả qua PubChem }
                            </button>
                        </div>
                    </div>

                    <!-- Data Table -->
                    @if (groups().length === 0) {
                        <div class="py-20 text-center text-slate-400 dark:text-slate-500 italic">
                            <i class="fa-solid fa-clipboard-check text-5xl mb-3 text-slate-300 dark:text-slate-700"></i>
                            <p class="font-bold text-sm">Chưa có dữ liệu phân tích kho chuẩn.</p>
                            <p class="text-xs text-slate-400 mt-1">Vui lòng kiểm tra lại bộ dữ liệu chuẩn trong hệ thống.</p>
                        </div>
                    } @else if (filteredGroups().length === 0) {
                        <div class="py-16 text-center text-slate-400 dark:text-slate-500">
                            <i class="fa-solid fa-filter text-4xl mb-2 text-slate-300 dark:text-slate-700"></i>
                            <p class="font-bold text-sm">Không tìm thấy nhóm chuẩn nào phù hợp với bộ lọc.</p>
                            <button (click)="searchQuery.set(''); statusFilter.set('all')" class="mt-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-100 transition">Xóa bộ lọc</button>
                        </div>
                    } @else {
                        <div class="flex-1 overflow-x-auto">
                            <table class="w-full text-sm text-left border-collapse">
                                <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/90 sticky top-[65px] z-10 border-b border-slate-200 dark:border-slate-700 font-bold shadow-2xs">
                                    <tr>
                                        <th class="px-4 py-3 w-10 text-center"><input type="checkbox" [checked]="isAllSelected()" (change)="toggleAll()" class="w-4 h-4 accent-indigo-600 cursor-pointer rounded"></th>
                                        <th class="px-4 py-3 w-1/4">Nhóm (Số CAS / Tên cũ)</th>
                                        <th class="px-4 py-3 w-1/4">Đề xuất Tên Thương Mại</th>
                                        <th class="px-4 py-3 w-1/3">Đề xuất Synonyms</th>
                                        <th class="px-4 py-3 w-[10%] text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                    @for (group of filteredGroups(); track group.id) {
                                        <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group/row" [ngClass]="{'bg-indigo-50/40 dark:bg-indigo-900/15': group.selected}">
                                            <td class="px-4 py-4 text-center align-top">
                                                <input type="checkbox" [ngModel]="group.selected" (ngModelChange)="toggleGroupSelected(group.id, $event)" class="w-4 h-4 accent-indigo-600 cursor-pointer rounded mt-1">
                                            </td>
                                            <td class="px-4 py-4 align-top">
                                                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                                                    <span class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">CAS: {{group.cas || 'Không có'}}</span>
                                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{{group.standards.length}} lọ</span>
                                                </div>
                                                <div class="text-xs text-slate-500 dark:text-slate-400">
                                                    <div class="font-bold text-[11px] text-slate-600 dark:text-slate-300 mb-1">Các tên hiện dùng:</div>
                                                    <ul class="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                                                        @for (name of group.originalNames; track name) {
                                                            <li>{{name}}</li>
                                                        }
                                                    </ul>
                                                </div>
                                            </td>
                                            <td class="px-4 py-4 align-top">
                                                <div class="relative">
                                                    <input type="text" [ngModel]="group.suggestedName" (ngModelChange)="updateSuggestedName(group.id, $event)" [class.border-amber-400]="!group.suggestedName" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition pr-12" placeholder="Nhập tên chuẩn thương mại...">
                                                    @if (!group.suggestedName && group.status !== 'loading') {
                                                        <button (click)="fetchGroupInfo(group)" class="absolute right-2 top-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 px-2 py-0.5 rounded text-[10px] font-extrabold transition border border-indigo-200 dark:border-indigo-800">API</button>
                                                    } @else if (group.suggestedName) {
                                                        <button (click)="updateSuggestedName(group.id, '')" class="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 text-xs px-1" title="Xóa tên">
                                                            <i class="fa-solid fa-xmark"></i>
                                                        </button>
                                                    }
                                                </div>
                                                @if (!group.suggestedName) {
                                                    <p class="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                                                        <i class="fa-solid fa-circle-exclamation"></i> Cần nhập tên đề xuất để ghi đè
                                                    </p>
                                                }
                                            </td>
                                            <td class="px-4 py-4 align-top">
                                                <textarea [ngModel]="group.suggestedSynonyms" (ngModelChange)="updateSuggestedSynonyms(group.id, $event)" rows="3" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition resize-none custom-scrollbar" placeholder="Nhập synonyms cách nhau bởi dấu phẩy..."></textarea>
                                            </td>
                                            <td class="px-4 py-4 align-top text-center">
                                                @if (group.status === 'pending') { <span class="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 font-bold inline-flex items-center gap-1"><i class="fa-solid fa-circle-pause"></i> Chờ</span> }
                                                @if (group.status === 'loading') { <span class="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-xs text-blue-600 dark:text-blue-400 font-bold inline-flex items-center gap-1"><i class="fa-solid fa-spinner fa-spin"></i> Đang lấy</span> }
                                                @if (group.status === 'ready') { <span class="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-xs text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1"><i class="fa-solid fa-check"></i> Sẵn sàng</span> }
                                                @if (group.status === 'success') { <span class="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-xs text-emerald-700 dark:text-emerald-300 font-extrabold inline-flex items-center gap-1"><i class="fa-solid fa-check-double"></i> Đã lưu</span> }
                                                @if (group.status === 'error') { <span class="px-2 py-1 rounded-md bg-red-50 dark:bg-red-950 text-xs text-red-600 dark:text-red-400 font-bold inline-flex items-center gap-1" [title]="group.errorMsg"><i class="fa-solid fa-triangle-exclamation"></i> Lỗi</span> }
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    }
                </div>

                <!-- Footer Actions -->
                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex flex-wrap justify-between gap-3 shrink-0 items-center">
                    <div class="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-bold">
                        <i class="fa-solid fa-shield-halved text-amber-500"></i>
                        <span>Chú ý: Dữ liệu thật sẽ bị ghi đè. Hãy kiểm tra kỹ trước khi lưu.</span>
                        @if (totalSelectedCount() > selectedCount()) {
                            <span class="text-amber-500 font-normal">({{totalSelectedCount() - selectedCount()}} nhóm chưa điền tên sẽ bị bỏ qua)</span>
                        }
                    </div>
                    <div class="flex items-center gap-3">
                        <button (click)="onClose()" [disabled]="isProcessing() || isFetchingAll()" class="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-xs transition disabled:opacity-50">Đóng bảng</button>
                        <button (click)="applyChanges()" [disabled]="selectedCount() === 0 || isProcessing() || isFetchingAll()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu Firebase... } 
                            @else { <i class="fa-solid fa-floppy-disk"></i> Lưu & Ghi đè ({{selectedCount()}}) }
                        </button>
                    </div>
                </div>
            </div>
         </div>
      }
  `
})
export class StandardsDataCleanupModalComponent {
  isOpen = input<boolean>(false);
  allStandards = input<ReferenceStandard[]>([]);
  closeModal = output<void>();

  private pubchemService = inject(PubchemService);
  private standardService = inject(StandardService);
  private toast = inject(ToastService);
  private progressService = inject(ProgressService);

  groups = signal<CleanupGroup[]>([]);
  isFetchingAll = signal(false);
  isProcessing = signal(false);

  // Search & Filter
  searchQuery = signal('');
  statusFilter = signal<'all' | 'unnamed' | 'ready' | 'success' | 'error'>('all');
  noCasCount = signal(0);
  totalStandardsCount = signal(0);

  constructor() {
    // Untracked auto-scan to prevent infinite reactive effect loops
    effect(() => {
      const open = this.isOpen();
      if (open) {
        untracked(() => {
          if (this.allStandards().length > 0 && this.groups().length === 0) {
            this.scanData();
          }
        });
      }
    });
  }

  // Filtered list computed
  filteredGroups = computed(() => {
    let list = this.groups();
    const query = this.searchQuery().trim().toLowerCase();
    const filter = this.statusFilter();

    if (query) {
      list = list.filter(g =>
        g.cas.toLowerCase().includes(query) ||
        g.suggestedName.toLowerCase().includes(query) ||
        g.suggestedSynonyms.toLowerCase().includes(query) ||
        g.originalNames.some(n => n.toLowerCase().includes(query))
      );
    }

    if (filter === 'unnamed') {
      list = list.filter(g => !g.suggestedName.trim());
    } else if (filter === 'ready') {
      list = list.filter(g => g.status === 'ready');
    } else if (filter === 'success') {
      list = list.filter(g => g.status === 'success');
    } else if (filter === 'error') {
      list = list.filter(g => g.status === 'error');
    }

    return list;
  });

  // Valid selected groups (must have selected = true AND a non-empty suggestedName)
  validSelectedGroups = computed(() => this.groups().filter(g => g.selected && g.suggestedName.trim().length > 0));
  selectedCount = computed(() => this.validSelectedGroups().length);
  totalSelectedCount = computed(() => this.groups().filter(g => g.selected).length);

  // Accurate Status counts
  unnamedCount = computed(() => this.groups().filter(g => !g.suggestedName.trim()).length);
  readyCount = computed(() => this.groups().filter(g => g.status === 'ready').length);
  errorCount = computed(() => this.groups().filter(g => g.status === 'error').length);
  successCount = computed(() => this.groups().filter(g => g.status === 'success').length);

  isAllSelected(): boolean {
      const visible = this.filteredGroups();
      return visible.length > 0 && visible.every(g => g.selected);
  }

  toggleAll() {
      const visibleIds = new Set(this.filteredGroups().map(g => g.id));
      const allSelected = this.isAllSelected();
      this.groups.update(groups =>
        groups.map(g => visibleIds.has(g.id) ? { ...g, selected: !allSelected } : g)
      );
  }

  toggleGroupSelected(groupId: string, selected: boolean) {
      this.groups.update(grps => 
        grps.map(g => g.id === groupId ? { ...g, selected } : g)
      );
  }

  updateSuggestedName(groupId: string, newName: string) {
      this.groups.update(grps =>
        grps.map(g => {
          if (g.id !== groupId) return g;
          const trimmed = newName.trim();
          const hasName = trimmed.length > 0;
          return {
            ...g,
            suggestedName: newName,
            status: hasName ? (g.status === 'pending' || g.status === 'error' ? 'ready' : g.status) : 'pending',
            selected: hasName ? true : g.selected
          };
        })
      );
  }

  updateSuggestedSynonyms(groupId: string, newSynonyms: string) {
      this.groups.update(grps =>
        grps.map(g => g.id === groupId ? { ...g, suggestedSynonyms: newSynonyms } : g)
      );
  }

  onClose() {
      if (!this.isProcessing() && !this.isFetchingAll()) {
          this.closeModal.emit();
          setTimeout(() => {
              this.groups.set([]);
              this.searchQuery.set('');
              this.statusFilter.set('all');
          }, 300);
      }
  }

  scanData() {
      const data = this.allStandards();
      const activeStandards = data.filter(std => !std._isDeleted);
      const grouped = new Map<string, ReferenceStandard[]>();
      let withCas = 0;
      let withoutCas = 0;

      activeStandards.forEach(std => {
          if (std.cas_number && std.cas_number.trim()) {
              withCas++;
              const cas = std.cas_number.trim().toLowerCase();
              if (!grouped.has(cas)) grouped.set(cas, []);
              grouped.get(cas)!.push(std);
          } else {
              withoutCas++;
          }
      });

      this.noCasCount.set(withoutCas);
      this.totalStandardsCount.set(activeStandards.length);

      const result: CleanupGroup[] = [];
      grouped.forEach((standards, casKey) => {
          const originalNames = Array.from(new Set(standards.map(s => s.name?.trim()).filter(Boolean)));
          
          let currentSyns = new Set<string>();
          standards.forEach(s => {
              if (s.chemical_name) {
                  s.chemical_name.split(',').map(x => x.trim()).filter(Boolean).forEach(x => currentSyns.add(x));
              }
          });
          originalNames.slice(1).forEach(n => currentSyns.add(n));

          result.push({
              id: casKey,
              cas: standards[0].cas_number!,
              standards,
              originalNames,
              suggestedName: '',
              suggestedSynonyms: Array.from(currentSyns).join(', '),
              selected: false,
              status: 'pending'
          });
      });

      // Sort by number of duplicates (highest first)
      result.sort((a, b) => b.standards.length - a.standards.length);
      this.groups.set(result);
  }

  async fetchGroupInfo(group: CleanupGroup) {
      if (group.status === 'loading') return;
      
      this.groups.update(grps =>
          grps.map(g => g.id === group.id ? { ...g, status: 'loading' } : g)
      );

      const info = await this.pubchemService.getChemicalInfo(group.cas);
      
      this.groups.update(grps =>
          grps.map(g => {
              if (g.id !== group.id) return g;

              if (info && info.commercialName) {
                  let synSet = new Set<string>();
                  if (g.suggestedSynonyms) g.suggestedSynonyms.split(',').map(x => x.trim()).filter(Boolean).forEach(x => synSet.add(x));
                  
                  g.originalNames.forEach(n => {
                      if (n.toLowerCase() !== info.commercialName.toLowerCase()) synSet.add(n);
                  });

                  info.synonyms.slice(0, 5).forEach(s => synSet.add(s));
                  
                  return {
                      ...g,
                      suggestedName: formatChemicalName(info.commercialName),
                      suggestedSynonyms: Array.from(synSet).map(s => formatChemicalName(s)).join(', '),
                      status: 'ready',
                      selected: true
                  };
              } else {
                  const rawFallback = (!g.suggestedName && g.originalNames.length > 0) ? g.originalNames[0] : g.suggestedName;
                  const fallbackName = formatChemicalName(rawFallback);
                  return {
                      ...g,
                      suggestedName: fallbackName,
                      status: fallbackName ? 'ready' : 'error',
                      errorMsg: info ? undefined : 'PubChem API không tìm thấy CAS này',
                      selected: fallbackName ? true : g.selected
                  };
              }
          })
      );
  }

  async fetchPubchemForAll() {
      if (this.groups().length === 0) return;
      this.isFetchingAll.set(true);
      
      this.progressService.start('Đang tải dữ liệu từ PubChem', 'Vui lòng đợi', this.groups().length);

      try {
          for (let i = 0; i < this.groups().length; i++) {
              const group = this.groups()[i];
              if (group.status !== 'ready' && group.status !== 'success') {
                 this.progressService.update(i + 1, `Đang xử lý CAS: ${group.cas}`);
                 await this.fetchGroupInfo(group);
                 await new Promise(r => setTimeout(r, 200));
              }
          }
          this.toast.show('Hoàn tất quét API PubChem. Vui lòng kiểm tra Bảng Đề xuất trước khi lưu.', 'info');
      } catch (error) {
          console.error('Error in fetchPubchemForAll:', error);
          this.toast.show('Có lỗi xảy ra khi truy vấn API PubChem.', 'error');
      } finally {
          this.progressService.complete();
          this.isFetchingAll.set(false);
      }
  }

  async applyChanges() {
      const selectedGroups = this.validSelectedGroups();
      if (selectedGroups.length === 0) return;

      if (!confirm(`Bạn sắp ghi đè dữ liệu cho ${selectedGroups.length} nhóm hóa chất.\nHành động me này sẽ cập nhật trực tiếp lên Firebase.\n\nTiếp tục?`)) return;

      this.isProcessing.set(true);
      this.progressService.start('Đang lưu dữ liệu...', 'Cập nhật Firebase', selectedGroups.length);

      let success = 0;
      let fails = 0;

      try {
          for (let i = 0; i < selectedGroups.length; i++) {
              const group = selectedGroups[i];
              this.progressService.update(i + 1, `Đang cập nhật: ${group.suggestedName}`);
              try {
                  const updates = group.standards.map(std => {
                      const updatedStd = { ...std };
                      updatedStd.name = group.suggestedName.trim();
                      updatedStd.chemical_name = group.suggestedSynonyms.trim();
                      return this.standardService.updateStandard(updatedStd);
                  });
                  
                  await Promise.all(updates);
                  
                  this.groups.update(grps =>
                      grps.map(g => g.id === group.id ? { ...g, status: 'success', selected: false } : g)
                  );
                  success++;
              } catch (e: any) {
                  console.error('Update failed for group', group.id, e);
                  fails++;
                  this.groups.update(grps =>
                      grps.map(g => g.id === group.id ? { ...g, status: 'error', errorMsg: e.message } : g)
                  );
              }
          }

          if (fails > 0) {
              this.toast.show(`Hoàn tất: ${success} nhóm thành công, ${fails} lỗi.`, 'error');
          } else {
              this.toast.show(`Thành công! Đã ghi đè ${success} nhóm chuẩn.`, 'success');
          }
      } finally {
          this.progressService.complete();
          this.isProcessing.set(false);
      }
  }
}
