import { Component, inject, computed, signal, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangelogService } from '../../../core/services/changelog.service';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'app-changelog-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (changelogService.isOpen()) {
      <div (click)="onBackdropClick($event)" 
           class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print cursor-pointer">
        
        <!-- Modal Card Container -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[85vh] animate-bounce-in cursor-default"
             (click)="$event.stopPropagation()">
          
          <!-- Modal Header -->
          <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start sm:items-center gap-3 bg-fuchsia-50/60 dark:bg-slate-900">
            <div class="flex items-start sm:items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 shrink-0">
                <i class="fa-solid fa-scroll text-lg"></i>
              </div>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight">Nhật Ký Cập Nhật</h3>
                  <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {{ state.systemVersion() }}
                  </span>
                </div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Lịch sử nâng cấp & cải tiến hệ thống LIMS Cloud</p>
              </div>
            </div>
            
            <button (click)="changelogService.close()" 
                    title="Đóng (Esc)"
                    class="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition active:scale-95">
              <i class="fa-solid fa-xmark text-base"></i>
            </button>
          </div>

          <!-- Search / Filter Bar -->
          <div class="px-4 sm:px-6 py-3 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 flex-1">
              <i class="fa-solid fa-magnifying-glass text-slate-400 text-xs pl-1"></i>
              <input type="text" [(ngModel)]="searchQuery" 
                     placeholder="Tìm kiếm tính năng, phiên bản (ví dụ: b02, SmartBatch...)..."
                     class="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none">
              @if (searchQuery()) {
                <button (click)="searchQuery.set('')" class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <i class="fa-solid fa-circle-xmark"></i>
                </button>
              }
            </div>
            
            @if (!searchQuery()) {
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Top 3 bản mới nhất
              </span>
            }
          </div>

          <!-- Modal Body (Timeline List) -->
          <div class="px-4 sm:px-6 py-5 sm:py-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
            @if (changelogService.loading()) {
              <div class="relative ml-2 border-l-2 border-blue-200 dark:border-blue-900/60 pl-5 space-y-6 animate-pulse" aria-live="polite" aria-busy="true">
                @for (placeholder of [1, 2, 3]; track placeholder) {
                  <div class="relative space-y-3 min-w-0">
                    <div class="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-900"></div>
                    <div class="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800"></div>
                    <div class="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
                    <div class="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/70"></div>
                  </div>
                }
              </div>
            } @else {
              <div class="relative ml-2 border-l-2 border-blue-500/30 dark:border-blue-500/20 pl-5 space-y-6">
                @for (item of filteredList(); track item.version) {
              <article class="relative min-w-0">
                <!-- Timeline Dot -->
                <div class="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-sm"></div>

                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                      {{ item.version }}
                    </span>
                    <span class="text-xs text-slate-400 font-medium"><i class="fa-regular fa-calendar-check mr-1"></i>{{ item.date }}</span>
                  </div>
                </div>

                <h4 class="text-sm font-extrabold text-slate-800 dark:text-white mb-2 leading-snug">{{ item.title }}</h4>

                <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 mb-3">
                  <span class="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block mb-1.5">🚀 Điểm Nổi Bật Bản Này</span>
                  <ul class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    @if (item.highlights && item.highlights.length > 0) {
                      @for (hl of item.highlights; track hl) {
                        <li class="flex items-start gap-2">
                          <i class="fa-solid fa-sparkles text-amber-500 text-[10px] mt-1 shrink-0"></i>
                          <span>{{ hl }}</span>
                        </li>
                      }
                    } @else {
                      <li class="text-slate-400 dark:text-slate-500">Không có thay đổi trong nhóm này.</li>
                    }
                  </ul>
                </div>

                <div class="mb-2">
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">✨ Tính Năng Mới</span>
                  <ul class="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    @if (item.features && item.features.length > 0) {
                      @for (f of item.features; track f) { <li>{{ f }}</li> }
                    } @else {
                      <li class="list-none -ml-4 text-slate-400 dark:text-slate-500">Không có thay đổi trong nhóm này.</li>
                    }
                  </ul>
                </div>

                <div class="mb-2">
                  <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">⚡ Cải Tiến & Tối Ưu</span>
                  <ul class="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    @if (item.improvements && item.improvements.length > 0) {
                      @for (imp of item.improvements; track imp) { <li>{{ imp }}</li> }
                    } @else {
                      <li class="list-none -ml-4 text-slate-400 dark:text-slate-500">Không có thay đổi trong nhóm này.</li>
                    }
                  </ul>
                </div>

                <div class="mb-2">
                  <span class="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">🐛 Sửa Lỗi Hệ Thống</span>
                  <ul class="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    @if (item.fixes && item.fixes.length > 0) {
                      @for (fix of item.fixes; track fix) { <li>{{ fix }}</li> }
                    } @else {
                      <li class="list-none -ml-4 text-slate-400 dark:text-slate-500">Không có thay đổi trong nhóm này.</li>
                    }
                  </ul>
                </div>
              </article>
                }
              </div>

              @if (filteredList().length === 0) {
                <div class="text-center py-10 text-slate-400 dark:text-slate-500">
                  <i class="fa-solid fa-scroll text-3xl mb-2 opacity-50 block"></i>
                  <p class="text-xs font-semibold">Không tìm thấy bản ghi phù hợp từ khóa "{{ searchQuery() }}"</p>
                </div>
              }
            }
          </div>

          <!-- Modal Footer -->
          <div class="px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-4">
            <button (click)="navigateToFullChangelog()" 
                    class="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Xem Toàn Bộ Lịch Sử
            </button>

            <button (click)="changelogService.close()" 
                    class="px-5 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-sm">
              Đóng
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ChangelogModalComponent {
  changelogService = inject(ChangelogService);
  state = inject(StateService);
  router = inject(Router);

  searchQuery = signal<string>('');

  constructor() {
    effect(() => {
      if (this.changelogService.isOpen()) {
        void this.changelogService.loadLatest();
      }
    });
  }

  filteredList = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const releases = this.changelogService.latestReleases();
    if (!q) return releases;
    return releases.filter(item =>
      item.version.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      (item.highlights && item.highlights.some(h => h.toLowerCase().includes(q))) ||
      (item.features && item.features.some(f => f.toLowerCase().includes(q))) ||
      (item.improvements && item.improvements.some(imp => imp.toLowerCase().includes(q))) ||
      (item.fixes && item.fixes.some(fx => fx.toLowerCase().includes(q)))
    );
  });

  @HostListener('document:keydown.escape')
  onEscKey() {
    if (this.changelogService.isOpen()) {
      this.changelogService.close();
    }
  }

  onBackdropClick(event: MouseEvent) {
    this.changelogService.close();
  }

  navigateToFullChangelog() {
    this.changelogService.close();
    this.router.navigate(['/changelog']);
  }
}
