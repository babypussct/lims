import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangelogService } from '../../core/services/changelog.service';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-full w-full bg-slate-50 dark:bg-slate-900 py-4 sm:py-8 px-2 sm:px-4 lg:px-6 transition-colors duration-300">
      <div class="w-full max-w-5xl mx-auto">
        
        <!-- Header & Back Button -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-8">
          <div class="flex items-start sm:items-center gap-3 min-w-0">
            <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <i class="fa-solid fa-scroll text-2xl"></i>
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">Nhật Ký Cập Nhật</h1>
                <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {{ state.systemVersion() }}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Cổng Thông Tin Công Khai &bull; LIMS Cloud</p>
            </div>
          </div>
          <button (click)="goBack()" 
                  class="self-start sm:self-auto px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm active:scale-95">
            <i class="fa-solid fa-arrow-left"></i> Quay Lại
          </button>
        </div>

        <!-- Main Card -->
        <div class="bg-white dark:bg-slate-800 shadow-soft-xl border border-slate-100 dark:border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 transition-all duration-300 overflow-hidden">
          
          <div class="border-b border-slate-100 dark:border-slate-700/80 pb-5 sm:pb-6 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="min-w-0">
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">Lịch Sử Nâng Cấp Hệ Thống</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Toàn bộ tính năng mới, cải tiến hiệu năng và bản sửa lỗi của LIMS Cloud.</p>
            </div>
            
            <!-- Search Bar -->
            <div class="relative w-full md:w-72 shrink-0">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input type="text" [(ngModel)]="searchQuery" 
                     placeholder="Tìm phiên bản, tính năng..." 
                     class="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition">
              @if (searchQuery()) {
                <button (click)="searchQuery.set('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              }
            </div>
          </div>

          <!-- Timeline -->
          <div>
            @if (changelogService.loading()) {
              <div class="relative ml-2 sm:ml-3 border-l-2 border-blue-200 dark:border-blue-900/60 pl-5 sm:pl-8 space-y-8 animate-pulse" aria-live="polite" aria-busy="true">
                @for (placeholder of [1, 2, 3]; track placeholder) {
                  <div class="relative space-y-3 min-w-0">
                    <div class="absolute -left-[31px] sm:-left-[43px] top-1 w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-900"></div>
                    <div class="h-6 w-32 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                    <div class="h-7 w-2/3 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div class="h-24 w-full rounded-2xl bg-slate-100 dark:bg-slate-900"></div>
                  </div>
                }
              </div>
            } @else {
              <div class="relative ml-2 sm:ml-3 border-l-2 border-blue-500/30 dark:border-blue-500/20 pl-5 sm:pl-8 space-y-8 sm:space-y-10">
                @for (item of filteredList(); track item.version) {
              <article class="relative min-w-0">
                
                <!-- Dot -->
                <div class="absolute -left-[31px] sm:-left-[43px] top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white dark:border-slate-800 shadow-md"></div>

                <div class="flex flex-wrap items-center gap-3 mb-2">
                  <span class="text-sm font-black font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                    {{ item.version }}
                  </span>
                  <span class="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <i class="fa-regular fa-calendar"></i> {{ item.date }}
                  </span>
                </div>

                <h3 class="text-xl font-extrabold text-slate-850 dark:text-white mb-3 tracking-tight">{{ item.title }}</h3>

                @if (item.highlights && item.highlights.length > 0) {
                  <div class="bg-gradient-to-r from-blue-50/70 to-indigo-50/50 dark:from-slate-900/70 dark:to-slate-900/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 mb-4">
                    <h4 class="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <i class="fa-solid fa-sparkles text-amber-500"></i> Điểm Nổi Bật Bản Này
                    </h4>
                    <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                      @for (hl of item.highlights; track hl) {
                        <li class="flex items-start gap-2.5">
                          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                          <span>{{ hl }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                }

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  @if (item.features && item.features.length > 0) {
                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <h4 class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="fa-solid fa-rocket"></i> Tính Năng Mới
                      </h4>
                      <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        @for (f of item.features; track f) { <li>{{ f }}</li> }
                      </ul>
                    </div>
                  }

                  @if (item.improvements && item.improvements.length > 0) {
                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <h4 class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="fa-solid fa-bolt"></i> Cải Tiến & Tối Ưu
                      </h4>
                      <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        @for (imp of item.improvements; track imp) { <li>{{ imp }}</li> }
                      </ul>
                    </div>
                  }

                  @if (item.fixes && item.fixes.length > 0) {
                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 md:col-span-2">
                      <h4 class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="fa-solid fa-bug"></i> Sửa Lỗi Hệ Thống
                      </h4>
                      <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        @for (fix of item.fixes; track fix) { <li>{{ fix }}</li> }
                      </ul>
                    </div>
                  }
                </div>

              </article>
                }
              </div>

              @if (filteredList().length === 0) {
                <div class="text-center py-12 text-slate-400 dark:text-slate-500">
                  <i class="fa-solid fa-scroll text-4xl mb-3 block opacity-40"></i>
                  <p class="text-sm font-semibold">Không tìm thấy bản ghi phù hợp từ khóa "{{ searchQuery() }}"</p>
                </div>
              }
            }
          </div>

        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-xs text-slate-400 dark:text-slate-500 select-none">
          <div class="mb-2 flex items-center justify-center gap-3">
            <a routerLink="/privacy-policy" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold">Chính sách bảo mật</a>
            <span>&bull;</span>
            <a routerLink="/terms-of-service" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold">Điều khoản sử dụng</a>
          </div>
          &copy; {{year}} NAFIQPM6 LIMS Cloud. Bảo lưu mọi quyền.
        </div>
      </div>
    </div>
  `
})
export class ChangelogComponent {
  state = inject(StateService);
  changelogService = inject(ChangelogService);
  router = inject(Router);
  year = new Date().getFullYear();

  searchQuery = signal<string>('');

  constructor() {
    void this.changelogService.loadAll();
  }

  filteredList = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const releases = this.changelogService.allReleases();
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

  goBack() {
    this.router.navigate(['/']);
  }
}
