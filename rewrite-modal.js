const fs = require('fs');
const file = 'c:/Users/chuan/OneDrive/Documents/lims/src/app/features/results/components/report-hub-modal.component.ts';
let content = fs.readFileSync(file, 'utf8');

// Add activeTab property
content = content.replace(
  'expandedChipKeys = signal<Record<string, boolean>>({});',
  "expandedChipKeys = signal<Record<string, boolean>>({});\n  activeTab = signal<'general' | 'prefix'>('general');"
);

// Add Tab Headers
const headerReplace = `          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100/50 dark:border-red-900/20 shrink-0">
                <i class="fa-solid fa-file-pdf text-sm"></i>
              </div>
              <div>
                <h3 class="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight">Trung Tâm Báo Cáo</h3>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{{ run?.sopName }}</p>
              </div>
            </div>
            <button (click)="closeModal()" class="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center transition active:scale-90 cursor-pointer border-0 bg-transparent">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Tabs -->
          <div class="flex items-center gap-6 px-6 pt-1 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
            <button (click)="activeTab.set('general')"
                    class="py-3 text-xs font-bold transition-all relative border-0 bg-transparent cursor-pointer"
                    [class.text-indigo-600]="activeTab() === 'general'"
                    [class.dark:text-indigo-400]="activeTab() === 'general'"
                    [class.text-slate-400]="activeTab() !== 'general'">
              <i class="fa-solid fa-layer-group mr-1.5"></i> Báo cáo chung
              @if (activeTab() === 'general') {
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full"></div>
              }
            </button>
            <button (click)="activeTab.set('prefix')"
                    class="py-3 text-xs font-bold transition-all relative border-0 bg-transparent cursor-pointer"
                    [class.text-fuchsia-600]="activeTab() === 'prefix'"
                    [class.dark:text-fuchsia-400]="activeTab() === 'prefix'"
                    [class.text-slate-400]="activeTab() !== 'prefix'">
              <i class="fa-solid fa-folder-tree mr-1.5"></i> Theo tiền tố
              @if (activeTab() === 'prefix') {
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-500 rounded-t-full"></div>
              }
            </button>
          </div>`;

content = content.replace(
  /<div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">([\s\S]*?)<\/button>\s*<\/div>/,
  headerReplace
);

// Wrap unifiedAllSamplesReport() in @if (activeTab() === 'general')
content = content.replace(
  /(@if \(unifiedAllSamplesReport\(\)\) \{[\s\S]*?\}|@if \(!shouldShowPrefixLoop\(\) && !unifiedAllSamplesReport\(\)\) \{[\s\S]*?\}|@if \(shouldShowPrefixLoop\(\)\) \{[\s\S]*?\})+(?=\s*<\/div>\s*<div class="space-y-2\.5">)/,
  `@if (activeTab() === 'general') {
                @if (unifiedAllSamplesReport()) {
                  <div class="flex flex-col gap-3 mb-6 last:mb-0">
                    <div class="flex items-center justify-between border-b border-indigo-100/80 dark:border-indigo-900/40 pb-2.5">
                      <div class="flex items-center gap-2.5">
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-black text-[10px] shadow-sm shadow-indigo-500/20">
                          <i class="fa-solid fa-layer-group"></i>
                        </span>
                        <span class="font-black text-slate-800 dark:text-slate-150 uppercase tracking-widest text-[11px]">
                          BÁO CÁO CHUNG
                        </span>
                      </div>
                      <button (click)="triggerCreateReport(undefined)"
                              class="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl text-[10px] font-black transition active:scale-95 shadow-sm shadow-indigo-500/5 cursor-pointer">
                        <i class="fa-solid fa-plus text-[9px]"></i> TẠO LẠI BẢN IN
                      </button>
                    </div>
                    <!-- Reuse grid from unifiedAllSamplesReport content -->
                    $1
                  </div>
                } @else {
                  @if (runStatus === 'completed') {
                    <div class="bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                      <div>
                        <div class="text-xs font-bold text-slate-700 dark:text-slate-300">Mẻ hoàn thành nhưng chưa có file in</div>
                        <div class="text-[10px] text-slate-400 mt-0.5">Bản in chưa được tạo hoặc bị lỗi khi xuất.</div>
                      </div>
                      <button (click)="triggerCreateReport(undefined)"
                              class="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95 shrink-0 cursor-pointer border-0">
                        <i class="fa-solid fa-file-invoice text-[11px]"></i> TẠO FILE IN
                      </button>
                    </div>
                  } @else {
                    <div class="text-center py-6 text-slate-400 dark:text-slate-500 font-semibold text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                      Chưa có báo cáo chung nào.
                    </div>
                  }
                }
              }

              @if (activeTab() === 'prefix') {
                @if (shouldShowPrefixLoop()) {
                  $3
                } @else {
                  <div class="text-center py-6 text-slate-400 dark:text-slate-500 font-semibold text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                    <i class="fa-solid fa-folder-tree text-xl block mb-2 opacity-40"></i>
                    Không có phân nhóm báo cáo theo tiền tố.
                  </div>
                }
              }`
);

// Wait, the regex $1 and $3 might not match perfectly.
// Let's use string manipulation instead for safety.
