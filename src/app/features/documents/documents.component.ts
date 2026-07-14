import { Component, inject, OnInit, OnDestroy, signal, computed, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
  thumbnailLink?: string;
}

interface Breadcrumb {
  id: string;
  name: string;
}

type SortColumn = 'name' | 'modifiedTime' | 'size';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'list' | 'grid';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full w-full flex flex-col bg-slate-50 dark:bg-slate-900 p-4 md:p-6 relative animate-fade-in">
      
      <!-- Header Card -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center border border-fuchsia-100 dark:border-fuchsia-800/30 shadow-sm shrink-0">
            <i class="fa-solid fa-folder-open text-base"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight">Phiếu Giao Nhận Mẫu</h2>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Quản lý và theo dõi các tài liệu giao nhận mẫu phòng thí nghiệm.</p>
          </div>
        </div>

        <!-- Toolbar Actions -->
        <div class="flex items-center gap-2">
          <!-- View Toggle -->
          <div class="flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
            <button (click)="viewMode.set('list')" 
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                    [class.bg-white]="viewMode() === 'list'" [class.dark:bg-slate-800]="viewMode() === 'list'"
                    [class.text-fuchsia-600]="viewMode() === 'list'" [class.text-slate-450]="viewMode() !== 'list'"
                    title="Chế độ danh sách">
              <i class="fa-solid fa-list"></i>
            </button>
            <button (click)="viewMode.set('grid')" 
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                    [class.bg-white]="viewMode() === 'grid'" [class.dark:bg-slate-800]="viewMode() === 'grid'"
                    [class.text-fuchsia-600]="viewMode() === 'grid'" [class.text-slate-455]="viewMode() !== 'grid'"
                    title="Chế độ lưới">
              <i class="fa-solid fa-border-all"></i>
            </button>
          </div>

          <!-- Refresh Button -->
          <button (click)="forceRefresh()" 
                  [disabled]="!isOnline()"
                  class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold"
                  title="Làm mới dữ liệu">
            <i class="fa-solid fa-rotate-right" [class.fa-spin]="loading() && isOnline()"></i>
            <span class="hidden sm:inline font-bold">Làm mới</span>
          </button>
        </div>
      </div>

      <!-- Breadcrumbs -->
      <div class="mb-6 flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none">
        @for (bcItem of collapsedFolderStack(); track bcItem.item.id || bcItem.originalIndex; let i = $index; let last = $last) {
          @if (bcItem.isEllipsis) {
            <div class="flex items-center text-slate-400 cursor-default select-none px-1">
              <span>...</span>
            </div>
          } @else {
            <div class="flex items-center cursor-pointer hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors whitespace-nowrap"
                 [class.text-fuchsia-600]="last"
                 [class.dark:text-fuchsia-400]="last"
                 (click)="goToBreadcrumb(bcItem.originalIndex)">
              @if (bcItem.originalIndex === 0) {
                <i class="fa-solid fa-home mr-1.5"></i>
              }
              <span>{{ bcItem.item.name }}</span>
            </div>
          }
          @if (!last) {
            <i class="fa-solid fa-chevron-right mx-2 text-slate-400 text-xs shrink-0"></i>
          }
        }
      </div>

      <!-- Content Area -->
      <div class="flex-1 min-h-[500px] bg-white dark:bg-slate-800 rounded-xl shadow-soft-xl border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden">
        
        <!-- Toolbar: Search & Filter -->
        <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div class="relative w-full max-w-md flex items-center gap-2">
            <div class="relative flex-1">
              <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input #searchInput
                     type="text" 
                     [ngModel]="searchInputValue()" 
                     (ngModelChange)="onSearchChange($event)"
                     [placeholder]="isMobile() ? 'Tìm tài liệu...' : 'Tìm tài liệu trong thư mục hiện tại...'" 
                     class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 dark:text-white transition-shadow">
              @if (searchInputValue()) {
                <button (click)="clearSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <i class="fa-solid fa-times"></i>
                </button>
              }
            </div>
          </div>
          <div class="text-sm text-slate-500 dark:text-slate-400 sm:ml-auto shrink-0 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            {{ displayFiles().length }} mục
          </div>
        </div>

        @if (!isOnline()) {
          <!-- Offline State -->
          <div class="p-8 text-center flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div class="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 flex items-center justify-center text-2xl mb-4">
              <i class="fa-solid fa-wifi-slash"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Không có kết nối mạng</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm">Vui lòng kiểm tra lại kết nối Internet để duyệt và tải tài liệu từ Google Drive.</p>
          </div>
        } @else {
          <!-- Error State -->
          @if (error()) {
            <div class="p-8 text-center flex-1 flex flex-col items-center justify-center animate-fade-in">
              <div class="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-2xl mb-4">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Lỗi tải dữ liệu</h3>
              <p class="text-slate-500">{{ error() }}</p>
              <button (click)="forceRefresh()" class="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors font-semibold">
                Thử lại
              </button>
            </div>
          }

          <!-- Empty State (No loading, no files) -->
          @if (!loading() && !error() && files().length === 0) {
            <div class="p-8 text-center flex-1 flex flex-col items-center justify-center animate-fade-in">
              <i class="fa-regular fa-folder-open text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
              <h3 class="text-lg font-medium text-slate-600 dark:text-slate-400">Thư mục trống</h3>
              <p class="text-sm text-slate-400 mt-1">Không có tài liệu nào trong thư mục này.</p>
            </div>
          }

          <!-- Search Empty State -->
          @if (!loading() && !error() && files().length > 0 && displayFiles().length === 0) {
            <div class="p-8 text-center flex-1 flex flex-col items-center justify-center animate-fade-in">
              <i class="fa-solid fa-search text-5xl text-slate-300 dark:text-slate-600 mb-4"></i>
              <h3 class="text-lg font-medium text-slate-600 dark:text-slate-400">Không tìm thấy kết quả</h3>
              <p class="text-sm text-slate-400 mt-1">Thử tìm với từ khóa khác xem sao.</p>
            </div>
          }

          <!-- File List (List View) -->
          @if (!error() && (displayFiles().length > 0 || (loading() && files().length === 0)) && viewMode() === 'list') {
            <div class="overflow-y-auto flex-1 custom-scrollbar">
              
              <!-- Mobile List View (visible on <640px screens) -->
              <div class="block sm:hidden divide-y divide-slate-100 dark:divide-slate-700/50">
                @if (loading() && files().length === 0) {
                  @for (item of [1, 2, 3, 4, 5]; track item) {
                    <div class="p-4 flex items-center gap-3 animate-pulse">
                      <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                      </div>
                    </div>
                  }
                } @else {
                  @for (item of displayFiles(); track item.id) {
                    <div class="p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer active:bg-slate-100 dark:active:bg-slate-700"
                         (click)="onItemClick(item)">
                      <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <i class="fa-solid {{ getFileTypeStyle(item).icon }} text-lg"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-slate-800 dark:text-slate-200 text-sm line-clamp-2 leading-snug">
                          {{ item.name }}
                        </div>
                        <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5">
                          <span>{{ formatSize(item.size, item) }}</span>
                          @if (item.modifiedTime) {
                            <span>•</span>
                            <span>{{ formatDate(item.modifiedTime, true) }}</span>
                          }
                        </div>
                      </div>
                      <div class="shrink-0 text-slate-400 dark:text-slate-600 pr-1">
                        @if (isFolder(item)) {
                          <i class="fa-solid fa-chevron-right text-xs"></i>
                        }
                      </div>
                    </div>
                  }
                }
              </div>

              <!-- Desktop table view (hidden on mobile, visible on sm and larger) -->
              <table class="hidden sm:table w-full text-left border-collapse min-w-[700px]">
                <thead class="sticky top-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm z-10 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4 w-12 text-center">Loại</th>
                    
                    <th class="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none group" 
                        [class.bg-slate-100]="sortCol() === 'name'" [class.dark:bg-slate-800]="sortCol() === 'name'"
                        [class.text-fuchsia-600]="sortCol() === 'name'" [class.dark:text-fuchsia-400]="sortCol() === 'name'"
                        (click)="toggleSort('name')">
                      <div class="flex items-center gap-2">
                        Tên tài liệu
                        <i class="fa-solid" 
                           [class.text-fuchsia-500]="sortCol() === 'name'"
                           [class.fa-sort]="sortCol() !== 'name'"
                           [class.fa-sort-up]="sortCol() === 'name' && sortDir() === 'asc'"
                           [class.fa-sort-down]="sortCol() === 'name' && sortDir() === 'desc'"></i>
                      </div>
                    </th>
                    
                    <th class="py-3 px-4 w-28 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none group hidden sm:table-cell" 
                        [class.bg-slate-100]="sortCol() === 'size'" [class.dark:bg-slate-800]="sortCol() === 'size'"
                        [class.text-fuchsia-600]="sortCol() === 'size'" [class.dark:text-fuchsia-400]="sortCol() === 'size'"
                        (click)="toggleSort('size')">
                      <div class="flex items-center gap-2">
                        Kích thước
                        <i class="fa-solid" 
                           [class.text-fuchsia-500]="sortCol() === 'size'"
                           [class.fa-sort]="sortCol() !== 'size'"
                           [class.fa-sort-up]="sortCol() === 'size' && sortDir() === 'asc'"
                           [class.fa-sort-down]="sortCol() === 'size' && sortDir() === 'desc'"></i>
                      </div>
                    </th>
                    
                    <th class="py-3 px-4 w-44 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none group hidden md:table-cell" 
                        [class.bg-slate-100]="sortCol() === 'modifiedTime'" [class.dark:bg-slate-800]="sortCol() === 'modifiedTime'"
                        [class.text-fuchsia-600]="sortCol() === 'modifiedTime'" [class.dark:text-fuchsia-400]="sortCol() === 'modifiedTime'"
                        (click)="toggleSort('modifiedTime')">
                      <div class="flex items-center gap-2">
                        Ngày cập nhật
                        <i class="fa-solid" 
                           [class.text-fuchsia-500]="sortCol() === 'modifiedTime'"
                           [class.fa-sort]="sortCol() !== 'modifiedTime'"
                           [class.fa-sort-up]="sortCol() === 'modifiedTime' && sortDir() === 'asc'"
                           [class.fa-sort-down]="sortCol() === 'modifiedTime' && sortDir() === 'desc'"></i>
                      </div>
                    </th>
                    
                    <th class="py-3 px-4 w-16 text-center">Tải</th>
                  </tr>
                </thead>

                <!-- Skeleton rows -->
                @if (loading() && files().length === 0) {
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50 animate-pulse">
                    @for (item of [1, 2, 3, 4, 5]; track item) {
                      <tr>
                        <td class="py-4 px-4 text-center">
                          <div class="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 mx-auto"></div>
                        </td>
                        <td class="py-4 px-4">
                          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                        </td>
                        <td class="py-4 px-4 hidden sm:table-cell">
                          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                        </td>
                        <td class="py-4 px-4 hidden md:table-cell">
                          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
                        </td>
                        <td class="py-4 px-4 text-center">
                          <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto"></div>
                        </td>
                      </tr>
                    }
                  </tbody>
                } @else {
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50 animate-fade-in">
                    @for (item of displayFiles(); track item.id) {
                      <tr class="group hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer active:bg-slate-100 dark:active:bg-slate-700"
                          (click)="onItemClick(item)">
                        <td class="py-3 px-4 text-center">
                          <i class="fa-solid {{ getFileTypeStyle(item).icon }} text-xl group-hover:scale-110 transition-transform"></i>
                        </td>
                        <td class="py-3 px-4">
                          <div class="font-medium text-slate-800 dark:text-slate-200 text-[14px] group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors line-clamp-2"
                               [class.text-fuchsia-600]="sortCol() === 'name'"
                               [class.dark:text-fuchsia-400]="sortCol() === 'name'">
                            {{ item.name }}
                          </div>
                        </td>
                        <td class="py-3 px-4 text-sm text-slate-500 hidden sm:table-cell whitespace-nowrap"
                            [class.text-fuchsia-600]="sortCol() === 'size'"
                            [class.dark:text-fuchsia-400]="sortCol() === 'size'">
                          {{ formatSize(item.size, item) }}
                        </td>
                        <td class="py-3 px-4 text-sm text-slate-500 hidden md:table-cell whitespace-nowrap"
                            [class.text-fuchsia-600]="sortCol() === 'modifiedTime'"
                            [class.dark:text-fuchsia-400]="sortCol() === 'modifiedTime'">
                          {{ formatDate(item.modifiedTime) }}
                        </td>
                        <td class="py-3 px-4 text-center">
                          @if (!isFolder(item) && item.webContentLink) {
                            <button (click)="downloadItem(item, $event)" 
                                    class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-fuchsia-100 hover:text-fuchsia-600 dark:hover:bg-fuchsia-900/50 dark:hover:text-fuchsia-400 transition-colors flex items-center justify-center mx-auto"
                                    title="Tải xuống">
                              <i class="fa-solid fa-download"></i>
                            </button>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                }
              </table>
            </div>
          }

          <!-- Grid View -->
          @if (!error() && (displayFiles().length > 0 || (loading() && files().length === 0)) && viewMode() === 'grid') {
            <div class="overflow-y-auto flex-1 custom-scrollbar p-4">
              @if (loading() && files().length === 0) {
                <!-- Skeleton Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse">
                  @for (item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track item) {
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col">
                      <div class="flex-1 flex flex-col items-center justify-center py-4">
                        <div class="w-16 h-16 rounded bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                      <div class="mt-2 border-t border-slate-100 dark:border-slate-700/50 pt-3 space-y-2">
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
                        <div class="flex justify-between items-center mt-2">
                          <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                          <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-8"></div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
                  @for (item of displayFiles(); track item.id) {
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:shadow-md transition-all cursor-pointer group"
                         (click)="onItemClick(item)">
                      
                      <div class="flex-1 flex flex-col items-center justify-center py-4 relative min-h-[96px]">
                        @if (isFolder(item)) {
                          <i class="fa-solid fa-folder text-yellow-400 text-5xl group-hover:scale-110 transition-transform"></i>
                        } @else if (item.thumbnailLink) {
                          <img [src]="item.thumbnailLink" class="w-16 h-16 rounded shadow-sm border border-slate-150 dark:border-slate-700 object-cover group-hover:scale-110 transition-transform" onerror="this.style.display='none'" alt="thumbnail">
                        } @else {
                          <i class="fa-solid {{ getFileTypeStyle(item).icon }} text-5xl group-hover:scale-110 transition-transform"></i>
                        }
                        
                        @if (!isFolder(item) && item.webContentLink) {
                          <button (click)="downloadItem(item, $event)" 
                                  class="hidden sm:flex absolute top-0 right-0 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-sm text-slate-500 hover:bg-fuchsia-500 hover:text-white transition-colors items-center justify-center opacity-0 group-hover:opacity-100"
                                  title="Tải xuống">
                            <i class="fa-solid fa-download text-xs"></i>
                          </button>
                        }
                      </div>
                      
                      <div class="mt-2 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                        <div class="font-medium text-slate-800 dark:text-slate-200 text-sm line-clamp-2 text-center group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors" 
                             [class.text-fuchsia-600]="sortCol() === 'name'"
                             [class.dark:text-fuchsia-400]="sortCol() === 'name'"
                             [title]="item.name">
                          {{ item.name }}
                        </div>
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mt-2">
                          <span class="text-[11px] text-slate-400"
                                [class.text-fuchsia-500]="sortCol() === 'modifiedTime'"
                                [class.dark:text-fuchsia-400]="sortCol() === 'modifiedTime'">
                            {{ formatDate(item.modifiedTime, true) }}
                          </span>
                          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 sm:text-right"
                                [class.text-fuchsia-500]="sortCol() === 'size'"
                                [class.dark:text-fuchsia-400]="sortCol() === 'size'">
                            {{ formatSize(item.size, item) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }
      </div>

      <!-- File Preview Modal -->
      @if (previewUrl()) {
        <div class="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex flex-col p-4 md:p-8 animate-fade-in">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shrink-0">
            <h3 class="text-white font-bold text-base md:text-lg px-2 text-center sm:text-left line-clamp-2 flex-1">{{ previewName() }}</h3>
            <div class="flex items-center gap-3 justify-end w-full sm:w-auto">
               <!-- Print button -->
               <button (click)="printFile()" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shadow-lg animate-fade-in" title="In tài liệu">
                 <i class="fa-solid fa-print"></i>
               </button>
              <!-- Download button in modal (hidden on mobile, visible on desktop) -->
               @if (previewContentLink()) {
                <a [href]="previewContentLink()" class="hidden sm:flex w-10 h-10 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white items-center justify-center transition-colors shadow-lg" title="Tải xuống">
                  <i class="fa-solid fa-download"></i>
                </a>
               }
              <a [href]="originalLink()" target="_blank" rel="noopener noreferrer" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" title="Mở trong tab mới">
                <i class="fa-solid fa-external-link-alt"></i>
              </a>
              <button (click)="closePreview()" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg" title="Đóng">
                <i class="fa-solid fa-times text-xl"></i>
              </button>
            </div>
          </div>
          <div class="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex relative">
            @if (previewLoading()) {
              <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 z-10 animate-fade-in">
                <i class="fa-solid fa-circle-notch fa-spin text-4xl text-fuchsia-500 mb-2"></i>
                <span class="text-slate-500 dark:text-slate-400 text-sm">Đang tải bản xem trước...</span>
              </div>
            }
            <iframe [src]="previewUrl()" (load)="previewLoading.set(false)" class="w-full h-full border-none flex-1"></iframe>
          </div>
          <!-- Fallback Help Note -->
          <div class="mt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 px-2 shrink-0">
            <span class="flex items-center gap-1.5 text-center sm:text-left">
              <i class="fa-solid fa-circle-info text-fuchsia-400 text-sm"></i>
              Trình xem trước không hiển thị? Hãy đảm bảo đã đăng nhập Google hoặc tắt chặn cookie bên thứ ba.
            </span>
            <a [href]="originalLink()" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-fuchsia-600/20 hover:bg-fuchsia-600/30 text-fuchsia-400 hover:text-fuchsia-300 font-bold flex items-center gap-1.5 rounded-lg border border-fuchsia-500/30 transition-colors cursor-pointer">
              Mở tệp trong tab mới <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #475569;
    }
    .scrollbar-none::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-none {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class DocumentsComponent implements OnInit, OnDestroy {
  private readonly pendingPreviewKey = '__gd_pending_document_preview';
  private driveService = inject(GoogleDriveService);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('searchInput') searchInputElement!: ElementRef<HTMLInputElement>;

  readonly ROOT_FOLDER_ID = '19N6TRGCUuWX9N7ZaB1H5P3hygeeCUJUN';
  readonly ROOT_FOLDER_NAME = 'Phiếu giao nhận mẫu';

  // Signals
  files = signal<DriveItem[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  isOnline = signal<boolean>(navigator.onLine);
  windowWidth = signal<number>(window.innerWidth);
  isMobile = computed(() => this.windowWidth() < 640);
  
  folderStack = signal<Breadcrumb[]>([{ id: this.ROOT_FOLDER_ID, name: this.ROOT_FOLDER_NAME }]);
  currentFolderId = signal<string>(this.ROOT_FOLDER_ID);
  
  viewMode = signal<ViewMode>('list');

  // Search state (decoupled with debounce)
  searchInputValue = signal<string>('');
  searchTerm = signal<string>('');
  private searchSubject = new Subject<string>();
  
  sortCol = signal<SortColumn>('modifiedTime');
  sortDir = signal<SortDirection>('desc');

  // Preview signals
  previewUrl = signal<SafeResourceUrl | null>(null);
  previewName = signal<string>('');
  originalLink = signal<string>('');
  previewContentLink = signal<string>('');
  previewLoading = signal<boolean>(true);

  // Subscriptions
  private searchSub?: Subscription;
  private onlineListener?: () => void;
  private offlineListener?: () => void;

  // Collapsed breadcrumbs computed
  collapsedFolderStack = computed(() => {
    const stack = this.folderStack();
    if (stack.length <= 3) {
      return stack.map((item, index) => ({ item, originalIndex: index, isEllipsis: false }));
    }
    return [
      { item: stack[0], originalIndex: 0, isEllipsis: false },
      { item: { id: '', name: '...' }, originalIndex: -1, isEllipsis: true },
      { item: stack[stack.length - 2], originalIndex: stack.length - 2, isEllipsis: false },
      { item: stack[stack.length - 1], originalIndex: stack.length - 1, isEllipsis: false }
    ];
  });

  // Display files computed
  displayFiles = computed(() => {
    let arr = [...this.files()];
    const term = this.removeDiacritics(this.searchTerm().trim().toLowerCase());
    
    // 1. Filter
    if (term) {
      arr = arr.filter(f => this.removeDiacritics(f.name).toLowerCase().includes(term));
    }

    // 2. Sort
    const col = this.sortCol();
    const dir = this.sortDir() === 'asc' ? 1 : -1;

    arr.sort((a, b) => {
      const aIsFolder = this.isFolder(a);
      const bIsFolder = this.isFolder(b);
      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;

      let valA: any = a[col] || '';
      let valB: any = b[col] || '';

      if (col === 'size') {
        valA = parseInt(valA, 10) || 0;
        valB = parseInt(valB, 10) || 0;
      } else if (col === 'modifiedTime') {
        valA = new Date(valA).getTime() || 0;
        valB = new Date(valB).getTime() || 0;
      } else {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      }

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });

    return arr;
  });

  @HostListener('window:keydown.escape')
  handleEscape() {
    if (this.previewUrl()) {
      this.closePreview();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.windowWidth.set(window.innerWidth);
  }

  ngOnInit() {
    // Load root folder
    this.loadFolder(this.ROOT_FOLDER_ID);

    // 2. Search debouncing
    this.searchSub = this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(term => {
      this.searchTerm.set(term);
    });

    // 3. Monitor Network Status
    this.onlineListener = () => {
      this.isOnline.set(true);
      this.forceRefresh();
    };
    this.offlineListener = () => this.isOnline.set(false);
    window.addEventListener('online', this.onlineListener);
    window.addEventListener('offline', this.offlineListener);

    const pending = sessionStorage.getItem(this.pendingPreviewKey);
    if (pending) {
      sessionStorage.removeItem(this.pendingPreviewKey);
      try {
        const item = JSON.parse(pending) as DriveItem;
        setTimeout(() => this.onItemClick(item));
      } catch (_) {}
    }
  }

  ngOnDestroy() {
    this.closePreview();
    if (this.searchSub) this.searchSub.unsubscribe();
    if (this.onlineListener) window.removeEventListener('online', this.onlineListener);
    if (this.offlineListener) window.removeEventListener('offline', this.offlineListener);
  }

  async loadFolder(folderId: string, skipCache = false) {
    this.loading.set(true);
    this.error.set(null);
    this.currentFolderId.set(folderId);

    // Reset local search inputs
    this.searchInputValue.set('');
    this.searchTerm.set('');

    // If offline, abort API load immediately
    if (!this.isOnline()) {
      this.loading.set(false);
      return;
    }

    // Check service cache
    if (!skipCache) {
      const cached = this.driveService.getCachedFolder(folderId);
      if (cached) {
        this.files.set(cached);
        this.loading.set(false);
        return;
      }
    }

    try {
      const items = await this.driveService.getFolderContents(folderId);
      this.files.set(items);
      this.driveService.setCachedFolder(folderId, items);
    } catch (err: any) {
      this.error.set(err.message || 'Có lỗi xảy ra khi tải thư mục.');
    } finally {
      this.loading.set(false);
    }
  }

  forceRefresh() {
    if (!this.isOnline()) return;
    // Clear service cache for the current folder
    this.driveService.clearCache(this.currentFolderId());
    this.loadFolder(this.currentFolderId(), true);
  }

  toggleSort(col: SortColumn) {
    if (this.sortCol() === col) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortCol.set(col);
      this.sortDir.set(col === 'modifiedTime' ? 'desc' : 'asc');
    }
  }

  isFolder(item: DriveItem): boolean {
    return item.mimeType === 'application/vnd.google-apps.folder';
  }

  async onItemClick(item: DriveItem) {
    if (this.isFolder(item)) {
      this.folderStack.update(stack => [...stack, { id: item.id, name: item.name }]);
      this.loadFolder(item.id);
    } else {
      if (!this.isOnline()) {
        return;
      }
      if (item.mimeType.startsWith('application/vnd.google-apps.')) {
        const docsUrl = (item.webViewLink || `https://drive.google.com/open?id=${item.id}`).replace(/\/edit.*$/, '/preview');
        openInNewTab(docsUrl);
        return;
      }

      this.previewLoading.set(true);
      this.previewName.set(item.name);
      this.originalLink.set(`https://drive.google.com/file/d/${item.id}/view`);
      this.previewContentLink.set('');

      try {
        if (!await this.driveService.hasServerOAuthSession()) {
          sessionStorage.setItem(this.pendingPreviewKey, JSON.stringify(item));
          this.driveService.beginRedirectAuth();
          return;
        }
        const blob = await this.driveService.downloadFile(item.id);
        const objectUrl = URL.createObjectURL(blob);
        this.previewContentLink.set(objectUrl);
        this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl));
      } catch (err: any) {
        this.previewLoading.set(false);
        this.error.set(err?.message || 'Không thể tải bản xem trước tài liệu.');
      }
    }
  }

  downloadItem(item: DriveItem, event: Event) {
    event.stopPropagation();
    if (!this.isOnline()) {
      return;
    }
    if (item.webContentLink) {
      openInNewTab(item.webContentLink);
    }
  }

  closePreview() {
    const objectUrl = this.previewContentLink();
    if (objectUrl?.startsWith('blob:')) URL.revokeObjectURL(objectUrl);
    this.previewUrl.set(null);
    this.previewName.set('');
    this.originalLink.set('');
    this.previewContentLink.set('');
    this.previewLoading.set(false);
  }

  goToBreadcrumb(index: number) {
    const stack = this.folderStack();
    if (index === stack.length - 1) return; 

    const targetStack = stack.slice(0, index + 1);
    this.folderStack.set(targetStack);
    this.loadFolder(targetStack[targetStack.length - 1].id);
  }

  onSearchChange(value: string) {
    this.searchInputValue.set(value);
    this.searchSubject.next(value);
  }

  clearSearch() {
    this.searchInputValue.set('');
    this.searchTerm.set('');
    setTimeout(() => {
      this.searchInputElement?.nativeElement?.focus();
    }, 50);
  }

  printFile() {
    const link = this.originalLink();
    if (link) {
      openInNewTab(link);
    }
  }

  formatSize(bytes?: string, item?: DriveItem): string {
    if (item && this.isFolder(item)) return 'Thư mục';
    if (!bytes) return '--';
    const b = parseInt(bytes, 10);
    if (isNaN(b)) return '--';
    if (b < 1024) return b + ' B';
    else if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    else return (b / 1048576).toFixed(1) + ' MB';
  }

  formatDate(dateStr?: string, short = false): string {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    if (short) {
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private removeDiacritics(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd');
  }

  getFileTypeStyle(item: DriveItem): { icon: string, color: string } {
    if (this.isFolder(item)) {
      return { icon: 'fa-folder text-yellow-400', color: 'text-yellow-400' };
    }
    const name = item.name.toLowerCase();
    if (name.endsWith('.pdf')) {
      return { icon: 'fa-file-pdf text-red-500', color: 'text-red-500' };
    }
    if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv') || item.mimeType === 'application/vnd.google-apps.spreadsheet') {
      return { icon: 'fa-file-excel text-emerald-600', color: 'text-emerald-600' };
    }
    if (name.endsWith('.docx') || name.endsWith('.doc') || item.mimeType === 'application/vnd.google-apps.document') {
      return { icon: 'fa-file-word text-blue-500', color: 'text-blue-500' };
    }
    if (name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.7z')) {
      return { icon: 'fa-file-zipper text-amber-600', color: 'text-amber-600' };
    }
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif')) {
      return { icon: 'fa-file-image text-teal-500', color: 'text-teal-500' };
    }
    return { icon: 'fa-file text-slate-400', color: 'text-slate-400' };
  }
}
