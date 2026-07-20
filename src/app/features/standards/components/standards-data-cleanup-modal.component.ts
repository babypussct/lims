import { Component, inject, signal, effect, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { PubchemService } from '../../../core/services/pubchem.service';
import { StandardService } from '../standard.service';
import { ToastService } from '../../../core/services/toast.service';
import { ProgressService } from '../../../core/services/progress.service';

interface CleanupGroup {
    id: string; // usually CAS number or unique key
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
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-broom text-indigo-600 dark:text-indigo-400"></i>
                            Công cụ Chuẩn hóa Dữ liệu (Data Cleanup)
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Tự động gom nhóm các chuẩn có cùng Số CAS và gợi ý Tên thương mại / Synonyms chuẩn quốc tế từ PubChem.</p>
                    </div>
                    <button (click)="onClose()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-y-auto p-0 custom-scrollbar bg-white dark:bg-slate-900">
                    <!-- Toolbar -->
                    <div class="p-4 bg-white dark:bg-slate-900 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
                        <div class="flex gap-2 items-center">
                            <button (click)="scanData()" class="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center gap-2">
                                <i class="fa-solid fa-magnifying-glass"></i> Quét kho & Phân tích
                            </button>
                            <button (click)="fetchPubchemForAll()" [disabled]="groups().length === 0 || isFetchingAll()" class="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                @if(isFetchingAll()) { <i class="fa-solid fa-spinner fa-spin"></i> }
                                @else { <i class="fa-solid fa-wand-magic-sparkles"></i> }
                                Gợi ý tất cả qua PubChem
                            </button>
                        </div>
                        <div class="text-sm font-bold text-slate-500">
                            Đã chọn: <span class="text-indigo-600 dark:text-indigo-400">{{selectedCount()}}</span> / {{groups().length}} nhóm
                        </div>
                    </div>

                    <!-- Data Table -->
                    @if (groups().length === 0) {
                        <div class="py-20 text-center text-slate-400 dark:text-slate-500 italic">
                            <i class="fa-solid fa-clipboard-check text-4xl mb-3 text-slate-300 dark:text-slate-600"></i>
                            <p>Chưa có dữ liệu. Hãy bấm "Quét kho & Phân tích" để bắt đầu.</p>
                        </div>
                    } @else {
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/80 sticky top-[65px] z-10 border-b border-slate-200 dark:border-slate-700 font-bold shadow-sm">
                                <tr>
                                    <th class="px-4 py-3 w-10 text-center"><input type="checkbox" [checked]="isAllSelected()" (change)="toggleAll()" class="w-4 h-4 accent-indigo-600 cursor-pointer"></th>
                                    <th class="px-4 py-3 w-1/4">Nhóm (Số CAS / Tên cũ)</th>
                                    <th class="px-4 py-3 w-1/4">Đề xuất Tên Thương Mại</th>
                                    <th class="px-4 py-3 w-1/3">Đề xuất Synonyms</th>
                                    <th class="px-4 py-3 w-[10%] text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                @for (group of groups(); track group.id; let i = $index) {
                                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition group/row" [ngClass]="{'bg-indigo-50/30 dark:bg-indigo-900/10': group.selected}">
                                        <td class="px-4 py-4 text-center align-top">
                                            <input type="checkbox" [(ngModel)]="group.selected" class="w-4 h-4 accent-indigo-600 cursor-pointer mt-1">
                                        </td>
                                        <td class="px-4 py-4 align-top">
                                            <div class="flex items-center gap-2 mb-2">
                                                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">CAS: {{group.cas || 'Không có'}}</span>
                                                <span class="text-xs text-slate-400 font-bold">{{group.standards.length}} lọ</span>
                                            </div>
                                            <div class="text-xs text-slate-500 dark:text-slate-400">
                                                <div class="font-bold mb-1">Các tên đang dùng:</div>
                                                <ul class="list-disc pl-4 space-y-0.5">
                                                    @for (name of group.originalNames; track name) {
                                                        <li>{{name}}</li>
                                                    }
                                                </ul>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 align-top">
                                            <div class="relative">
                                                <input type="text" [(ngModel)]="group.suggestedName" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition" placeholder="Nhập tên chuẩn...">
                                                @if (!group.suggestedName && group.status !== 'loading') {
                                                    <button (click)="fetchGroupInfo(group)" class="absolute right-2 top-2 text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded text-[10px] font-bold transition">API</button>
                                                }
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 align-top">
                                            <textarea [(ngModel)]="group.suggestedSynonyms" rows="3" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-600 dark:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition resize-none custom-scrollbar" placeholder="Nhập synonyms cách nhau bởi dấu phẩy..."></textarea>
                                        </td>
                                        <td class="px-4 py-4 align-top text-center">
                                            @if (group.status === 'pending') { <span class="text-xs text-slate-400 font-bold"><i class="fa-solid fa-circle-pause"></i> Chờ</span> }
                                            @if (group.status === 'loading') { <span class="text-xs text-blue-500 font-bold"><i class="fa-solid fa-spinner fa-spin"></i> Đang lấy</span> }
                                            @if (group.status === 'ready') { <span class="text-xs text-emerald-500 font-bold"><i class="fa-solid fa-check"></i> Sẵn sàng</span> }
                                            @if (group.status === 'success') { <span class="text-xs text-emerald-600 font-black"><i class="fa-solid fa-check-double"></i> Đã lưu</span> }
                                            @if (group.status === 'error') { <span class="text-xs text-red-500 font-bold" [title]="group.errorMsg"><i class="fa-solid fa-triangle-exclamation"></i> Lỗi</span> }
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    }
                </div>

                <!-- Footer Actions -->
                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0 items-center">
                    <span class="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 mr-auto">
                        <i class="fa-solid fa-triangle-exclamation"></i> Chú ý: Dữ liệu thật sẽ bị ghi đè. Hãy kiểm tra kỹ Bảng Đề xuất trước khi lưu.
                    </span>
                    <button (click)="onClose()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Đóng bảng</button>
                    <button (click)="applyChanges()" [disabled]="selectedCount() === 0 || isProcessing()" class="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... } 
                        @else { <i class="fa-solid fa-floppy-disk"></i> Lưu & Ghi đè ({{selectedCount()}}) }
                    </button>
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

  selectedCount = computed(() => this.groups().filter(g => g.selected).length);

  isAllSelected(): boolean {
      return this.groups().length > 0 && this.groups().every(g => g.selected);
  }

  toggleAll() {
      const allSelected = this.isAllSelected();
      this.groups.update(groups => groups.map(g => ({ ...g, selected: !allSelected })));
  }

  onClose() {
      if (!this.isProcessing()) {
          this.closeModal.emit();
          // Reset after short delay to allow closing animation
          setTimeout(() => this.groups.set([]), 300);
      }
  }

  scanData() {
      const data = this.allStandards();
      const grouped = new Map<string, ReferenceStandard[]>();

      // Group by CAS. Ignore empty CAS for this auto-tool to keep it focused and safe.
      data.forEach(std => {
          if (std.cas_number && std.cas_number.trim() && !std._isDeleted) {
              const cas = std.cas_number.trim().toLowerCase();
              if (!grouped.has(cas)) grouped.set(cas, []);
              grouped.get(cas)!.push(std);
          }
      });

      const result: CleanupGroup[] = [];
      grouped.forEach((standards, cas) => {
          // Get unique names used currently
          const originalNames = Array.from(new Set(standards.map(s => s.name?.trim()).filter(Boolean)));
          
          // Pre-fill suggested Synonyms with current chemical_name + other names
          let currentSyns = new Set<string>();
          standards.forEach(s => {
              if (s.chemical_name) {
                  s.chemical_name.split(',').map(x => x.trim()).filter(Boolean).forEach(x => currentSyns.add(x));
              }
          });
          // Also add all original names except the first one to synonyms by default (as a fallback if API fails)
          originalNames.slice(1).forEach(n => currentSyns.add(n));

          result.push({
              id: cas,
              cas: standards[0].cas_number!, // Original case
              standards,
              originalNames,
              suggestedName: '', // Let API fill this or admin type
              suggestedSynonyms: Array.from(currentSyns).join(', '),
              selected: false,
              status: 'pending'
          });
      });

      // Sort by number of duplicates (highest first)
      result.sort((a, b) => b.standards.length - a.standards.length);
      this.groups.set(result);
      this.toast.show(`Tìm thấy ${result.length} nhóm chuẩn có Số CAS.`);
  }

  async fetchGroupInfo(group: CleanupGroup) {
      if (group.status === 'loading') return;
      
      const idx = this.groups().findIndex(g => g.id === group.id);
      if (idx === -1) return;

      this.groups.update(grps => { grps[idx].status = 'loading'; return [...grps]; });

      const info = await this.pubchemService.getChemicalInfo(group.cas);
      
      this.groups.update(grps => {
          const g = grps[idx];
          if (info && info.commercialName) {
              g.suggestedName = info.commercialName;
              
              // Merge old synonyms with new ones from pubchem
              let synSet = new Set<string>();
              if (g.suggestedSynonyms) g.suggestedSynonyms.split(',').map(x => x.trim()).filter(Boolean).forEach(x => synSet.add(x));
              
              // Add original names (except if it matches commercialName)
              g.originalNames.forEach(n => {
                  if (n.toLowerCase() !== info.commercialName.toLowerCase()) synSet.add(n);
              });

              // Add some top pubchem synonyms
              info.synonyms.slice(0, 5).forEach(s => synSet.add(s));
              
              g.suggestedSynonyms = Array.from(synSet).join(', ');
              g.status = 'ready';
              g.selected = true; // Auto select if API success
          } else {
              g.status = 'error';
              g.errorMsg = 'PubChem API không tìm thấy CAS này';
              // Fallback to first original name
              if (!g.suggestedName && g.originalNames.length > 0) {
                  g.suggestedName = g.originalNames[0];
              }
          }
          return [...grps];
      });
  }

  async fetchPubchemForAll() {
      if (this.groups().length === 0) return;
      this.isFetchingAll.set(true);
      
      let successCount = 0;
      this.progressService.start('Đang tải dữ liệu từ PubChem', 'Vui lòng đợi', this.groups().length);

      for (let i = 0; i < this.groups().length; i++) {
          const group = this.groups()[i];
          if (group.status !== 'ready' && group.status !== 'success') {
             this.progressService.update(i + 1, `Đang xử lý CAS: ${group.cas}`);
             await this.fetchGroupInfo(group);
             // Small delay to prevent rate limit (though pubchem is generous)
             await new Promise(r => setTimeout(r, 200));
          }
      }

      this.progressService.complete();
      this.isFetchingAll.set(false);
      this.toast.show('Hoàn tất quét API. Hãy kiểm tra Bảng Đề xuất trước khi lưu.');
  }

  async applyChanges() {
      const selectedGroups = this.groups().filter(g => g.selected && g.suggestedName.trim().length > 0);
      if (selectedGroups.length === 0) return;

      if (!confirm(`Bạn sắp ghi đè dữ liệu cho ${selectedGroups.length} nhóm hóa chất.\nHành động này sẽ cập nhật trực tiếp lên Firebase.\n\nTiếp tục?`)) return;

      this.isProcessing.set(true);
      this.progressService.start('Đang lưu dữ liệu...', 'Cập nhật Firebase', selectedGroups.length);

      let success = 0;
      let fails = 0;

      for (let i = 0; i < selectedGroups.length; i++) {
          const group = selectedGroups[i];
          this.progressService.update(i + 1, `Đang cập nhật: ${group.suggestedName}`);
          try {
              // Batch update all standards in this group
              const updates = group.standards.map(std => {
                  const updatedStd = { ...std };
                  updatedStd.name = group.suggestedName.trim();
                  // We store synonyms in chemical_name field
                  updatedStd.chemical_name = group.suggestedSynonyms.trim();
                  return this.standardService.updateStandard(updatedStd);
              });
              
              await Promise.all(updates);
              
              this.groups.update(grps => {
                  const idx = grps.findIndex(g => g.id === group.id);
                  grps[idx].status = 'success';
                  grps[idx].selected = false;
                  return [...grps];
              });
              success++;
          } catch (e: any) {
              console.error('Update failed for group', group.id, e);
              fails++;
              this.groups.update(grps => {
                  const idx = grps.findIndex(g => g.id === group.id);
                  grps[idx].status = 'error';
                  grps[idx].errorMsg = e.message;
                  return [...grps];
              });
          }
      }

      this.progressService.complete();
      this.isProcessing.set(false);
      
      if (fails > 0) {
          this.toast.show(`Hoàn tất: ${success} nhóm thành công, ${fails} lỗi.`, 'error');
      } else {
          this.toast.show(`Thành công! Đã ghi đè ${success} nhóm chuẩn.`, 'success');
      }
  }
}
