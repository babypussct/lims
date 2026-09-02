import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangelogService } from '../../core/services/changelog.service';
import { StateService } from '../../core/services/state.service';
import { AppButtonComponent } from '../../shared/components/ui/button/button.component';
import { AppEmptyStateComponent } from '../../shared/components/ui/empty-state/empty-state.component';
import { AppPageHeaderComponent } from '../../shared/components/ui/page-header/page-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { AppToolbarComponent } from '../../shared/components/ui/toolbar/toolbar.component';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AppButtonComponent, AppEmptyStateComponent, AppPageHeaderComponent, SkeletonComponent, AppToolbarComponent],
  template: `
    <div class="min-h-full w-full bg-slate-50 dark:bg-slate-900 py-4 sm:py-8 px-2 sm:px-4 lg:px-6 transition-colors duration-300">
      <div class="w-full max-w-5xl mx-auto">
        
        <app-page-header
          class="mb-5 block overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700 sm:mb-8"
          title="Nhật ký cập nhật"
          [subtitle]="'Cổng thông tin công khai · LIMS Cloud · ' + state.systemVersion()"
          icon="fa-scroll">
          <div pageHeaderActions class="flex items-center gap-2">
            <span class="hidden rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 sm:inline-flex">
              {{ state.systemVersion() }}
            </span>
            <app-button variant="secondary" size="sm" (click)="goBack()">
              <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Quay lại
            </app-button>
          </div>
        </app-page-header>

        <!-- Main Card -->
        <div class="bg-white dark:bg-slate-800 shadow-soft-xl border border-slate-100 dark:border-slate-700/50 rounded-2xl sm:rounded-2xl p-4 sm:p-8 lg:p-10 transition-all duration-300 overflow-hidden">
          
          <div class="border-b border-slate-100 dark:border-slate-700/80 pb-5 sm:pb-6 mb-6 sm:mb-8">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">Lịch sử nâng cấp hệ thống</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Toàn bộ tính năng mới, cải tiến hiệu năng và bản sửa lỗi của LIMS Cloud.</p>
            <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
              <app-toolbar>
                <label toolbarSearch class="relative block w-full md:max-w-sm">
                  <span class="sr-only">Tìm phiên bản hoặc tính năng</span>
                  <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" aria-hidden="true"></i>
                  <input type="search" [(ngModel)]="searchQuery"
                         placeholder="Tìm phiên bản, tính năng..."
                         class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-semibold text-slate-700 transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                </label>
                @if (searchQuery()) {
                  <div toolbarActions>
                    <app-button variant="ghost" size="sm" (click)="searchQuery.set('')">
                      <i class="fa-solid fa-xmark" aria-hidden="true"></i> Xóa tìm kiếm
                    </app-button>
                  </div>
                }
              </app-toolbar>
            </div>
          </div>

          <!-- Timeline -->
          <div>
            @if (changelogService.loading()) {
              <div class="relative ml-2 sm:ml-3 border-l-2 border-blue-200 dark:border-blue-900/60 pl-5 sm:pl-8 space-y-8" aria-live="polite" aria-busy="true">
                @for (placeholder of [1, 2, 3]; track placeholder) {
                  <div class="relative space-y-3 min-w-0">
                    <app-skeleton class="absolute -left-[31px] sm:-left-[43px] top-1" shape="circle" width="20px" height="20px"></app-skeleton>
                    <app-skeleton width="128px" height="24px"></app-skeleton>
                    <app-skeleton width="66%" height="28px"></app-skeleton>
                    <app-skeleton width="100%" height="96px"></app-skeleton>
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

                <div class="bg-gradient-to-r from-blue-50/70 to-fuchsia-50/50 dark:from-slate-900/70 dark:to-slate-900/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 mb-4">
                  <h4 class="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <i class="fa-solid fa-sparkles text-amber-500"></i> Điểm Nổi Bật Bản Này
                  </h4>
                  <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    @if (item.highlights && item.highlights.length > 0) {
                      @for (hl of item.highlights; track hl) {
                        <li class="flex items-start gap-2.5">
                          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                          <span>{{ hl }}</span>
                        </li>
                      }
                    } @else {
                      <li class="text-slate-400 dark:text-slate-500">Không có thay đổi trong nhóm này.</li>
                    }
                  </ul>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <h4 class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <i class="fa-solid fa-rocket"></i> Tính Năng Mới
                    </h4>
                    <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      @if (item.features && item.features.length > 0) {
                        @for (f of item.features; track f) { <li>{{ f }}</li> }
                      } @else {
                        <li class="list-none -ml-4 text-slate-400 dark:text-slate-500">Không có thay đổi trong nhóm này.</li>
                      }
                    </ul>
                  </div>

                  <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <h4 class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <i class="fa-solid fa-bolt"></i> Cải Tiến & Tối Ưu
                    </h4>
                    <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      @if (item.improvements && item.improvements.length > 0) {
                        @for (imp of item.improvements; track imp) { <li>{{ imp }}</li> }
                      } @else {
                        <li class="list-none -ml-4 text-slate-400 dark:text-slate-500">Không có thay đổi trong nhóm này.</li>
                      }
                    </ul>
                  </div>

                  <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 md:col-span-2">
                    <h4 class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <i class="fa-solid fa-bug"></i> Sửa Lỗi Hệ Thống
                    </h4>
                    <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      @if (item.fixes && item.fixes.length > 0) {
                        @for (fix of item.fixes; track fix) { <li>{{ fix }}</li> }
                      } @else {
                        <li class="list-none -ml-4 text-slate-400 dark:text-slate-500">Không có thay đổi trong nhóm này.</li>
                      }
                    </ul>
                  </div>
                </div>

              </article>
                }
              </div>

              @if (filteredList().length === 0) {
                <app-empty-state
                  icon="fa-scroll"
                  title="Không tìm thấy bản ghi"
                  [message]="'Không có phiên bản hoặc tính năng phù hợp với từ khóa ' + searchQuery() + '.'">
                  <app-button emptyStateActions variant="secondary" size="sm" (click)="searchQuery.set('')">
                    Xóa tìm kiếm
                  </app-button>
                </app-empty-state>
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
