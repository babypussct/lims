import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GoogleDriveService } from '../../core/services/google-drive.service';

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
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
    <div class="h-full w-full flex flex-col bg-slate-50 dark:bg-slate-900 p-4 md:p-6 relative">
      
      <!-- Header -->
      <div class="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
            <i class="fa-solid fa-folder-open text-fuchsia-500"></i>
            Phiếu giao nhận mẫu
          </h1>
        </div>

        <!-- Toolbar Actions -->
        <div class="flex items-center gap-2">
          <!-- View Toggle -->
          <div class="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button (click)="viewMode.set('list')" 
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                    [class.bg-slate-100]="viewMode() === 'list'" [class.dark:bg-slate-700]="viewMode() === 'list'"
                    [class.text-fuchsia-600]="viewMode() === 'list'" [class.text-slate-400]="viewMode() !== 'list'"
                    title="Chế độ danh sách">
              <i class="fa-solid fa-list"></i>
            </button>
            <button (click)="viewMode.set('grid')" 
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                    [class.bg-slate-100]="viewMode() === 'grid'" [class.dark:bg-slate-700]="viewMode() === 'grid'"
                    [class.text-fuchsia-600]="viewMode() === 'grid'" [class.text-slate-400]="viewMode() !== 'grid'"
                    title="Chế độ lưới">
              <i class="fa-solid fa-border-all"></i>
            </button>
          </div>

          <!-- Refresh Button -->
          <button (click)="forceRefresh()" 
                  class="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                  title="Làm mới dữ liệu">
            <i class="fa-solid fa-rotate-right" [class.fa-spin]="loading()"></i>
            <span class="hidden sm:inline text-sm font-medium">Làm mới</span>
          </button>
        </div>
      </div>

      <!-- Breadcrumbs -->
      <div class="mb-6 flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar">
        @if (isGlobalSearch()) {
          <div class="flex items-center text-fuchsia-600 dark:text-fuchsia-400">
            <i class="fa-solid fa-globe mr-2"></i>
            <span>Kết quả tìm kiếm toàn cục</span>
            <button (click)="cancelGlobalSearch()" class="ml-4 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
              <i class="fa-solid fa-times mr-1"></i>Đóng
            </button>
          </div>
        } @else {
          @for (bc of folderStack(); track bc.id; let i = $index; let last = $last) {
            <div class="flex items-center cursor-pointer hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors whitespace-nowrap"
                 [class.text-fuchsia-600]="last"
                 [class.dark:text-fuchsia-400]="last"
                 (click)="goToBreadcrumb(i)">
              @if (i === 0) {
                <i class="fa-solid fa-home mr-1.5"></i>
              }
              <span>{{ bc.name }}</span>
            </div>
            @if (!last) {
              <i class="fa-solid fa-chevron-right mx-2 text-slate-400 text-xs shrink-0"></i>
            }
          }
        }
      </div>

      <!-- Content Area -->
      <div class="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-soft-xl border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden">
        
        <!-- Toolbar: Search & Filter -->
        <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div class="relative w-full max-w-md flex items-center gap-2">
            <div class="relative flex-1">
              <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" 
                     [ngModel]="searchTerm()" 
                     (ngModelChange)="searchTerm.set($event)"
                     (keyup.enter)="triggerGlobalSearch()"
                     placeholder="Tìm tài liệu..." 
                     class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 dark:text-white transition-shadow">
              @if (searchTerm()) {
                <button (click)="searchTerm.set('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <i class="fa-solid fa-times"></i>
                </button>
              }
            </div>
            
            <button (click)="triggerGlobalSearch()" 
                    [disabled]="!searchTerm().trim()"
                    class="h-[38px] px-3 bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100 dark:bg-fuchsia-900/30 dark:text-fuchsia-400 dark:hover:bg-fuchsia-900/50 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800/50 transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Tìm sâu trên toàn bộ Drive">
              <i class="fa-solid fa-bolt"></i>
              <span class="text-sm font-semibold hidden md:inline">Tìm Toàn cục</span>
            </button>
          </div>
          <div class="text-sm text-slate-500 dark:text-slate-400 sm:ml-auto shrink-0 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            {{ displayFiles().length }} mục
          </div>
        </div>

        @if (loading()) {
          <div class="absolute inset-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center">
            <div class="flex flex-col items-center">
              <i class="fa-solid fa-circle-notch fa-spin text-3xl text-fuchsia-500 mb-3"></i>
              <span class="text-slate-600 dark:text-slate-300 font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        }

        <!-- Error State -->
        @if (error()) {
          <div class="p-8 text-center flex-1 flex flex-col items-center justify-center">
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

        <!-- Empty State -->
        @if (!loading() && !error() && files().length === 0) {
          <div class="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <i class="fa-regular fa-folder-open text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
            <h3 class="text-lg font-medium text-slate-600 dark:text-slate-400">Thư mục trống</h3>
            <p class="text-sm text-slate-400 mt-1">Không có tài liệu nào trong thư mục này.</p>
          </div>
        }

        <!-- Search Empty State -->
        @if (!loading() && !error() && files().length > 0 && displayFiles().length === 0) {
          <div class="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <i class="fa-solid fa-search text-5xl text-slate-300 dark:text-slate-600 mb-4"></i>
            <h3 class="text-lg font-medium text-slate-600 dark:text-slate-400">Không tìm thấy kết quả</h3>
            <p class="text-sm text-slate-400 mt-1">Thử tìm với từ khóa khác xem sao.</p>
          </div>
        }

        <!-- File List (List View) -->
        @if (!loading() && !error() && displayFiles().length > 0 && viewMode() === 'list') {
          <div class="overflow-y-auto flex-1 custom-scrollbar">
            <table class="w-full text-left border-collapse min-w-[700px]">
              <thead class="sticky top-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm z-10 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th class="py-3 px-4 w-12 text-center">Loại</th>
                  
                  <th class="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none group"
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
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                @for (item of displayFiles(); track item.id) {
                  <tr class="group hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer active:bg-slate-100 dark:active:bg-slate-700"
                      (click)="onItemClick(item)">
                    <td class="py-3 px-4 text-center">
                      @if (isFolder(item)) {
                        <i class="fa-solid fa-folder text-yellow-400 text-xl group-hover:scale-110 transition-transform"></i>
                      } @else {
                        <img [src]="item.iconLink" class="w-6 h-6 mx-auto" onerror="this.src='assets/images/file.png'" alt="icon">
                      }
                    </td>
                    <td class="py-3 px-4">
                      <div class="font-medium text-slate-800 dark:text-slate-200 text-[14px] group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors line-clamp-2">
                        {{ item.name }}
                      </div>
                    </td>
                    <td class="py-3 px-4 text-sm text-slate-500 hidden sm:table-cell whitespace-nowrap">
                      {{ formatSize(item.size) }}
                    </td>
                    <td class="py-3 px-4 text-sm text-slate-500 hidden md:table-cell whitespace-nowrap">
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
            </table>
          </div>
        }

        <!-- Grid View -->
        @if (!loading() && !error() && displayFiles().length > 0 && viewMode() === 'grid') {
          <div class="overflow-y-auto flex-1 custom-scrollbar p-4">
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (item of displayFiles(); track item.id) {
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:shadow-md transition-all cursor-pointer group"
                     (click)="onItemClick(item)">
                  
                  <div class="flex-1 flex flex-col items-center justify-center py-4 relative">
                    @if (isFolder(item)) {
                      <i class="fa-solid fa-folder text-yellow-400 text-5xl group-hover:scale-110 transition-transform"></i>
                    } @else {
                      <img [src]="item.iconLink?.replace('16', '64')" class="w-16 h-16 group-hover:scale-110 transition-transform object-contain" onerror="this.src='assets/images/file.png'" alt="icon">
                    }
                    
                    @if (!isFolder(item) && item.webContentLink) {
                      <button (click)="downloadItem(item, $event)" 
                              class="absolute top-0 right-0 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-sm text-slate-500 hover:bg-fuchsia-500 hover:text-white transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                              title="Tải xuống">
                        <i class="fa-solid fa-download text-xs"></i>
                      </button>
                    }
                  </div>
                  
                  <div class="mt-2 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                    <div class="font-medium text-slate-800 dark:text-slate-200 text-sm line-clamp-2 text-center group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors" [title]="item.name">
                      {{ item.name }}
                    </div>
                    <div class="flex justify-between items-center mt-2">
                      <span class="text-xs text-slate-400">{{ formatDate(item.modifiedTime, true) }}</span>
                      <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">{{ formatSize(item.size) }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- File Preview Modal -->
      @if (previewUrl()) {
        <div class="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex flex-col p-4 md:p-8 animate-fade-in">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-white font-bold text-lg px-2 line-clamp-1 flex-1">{{ previewName() }}</h3>
            <div class="flex items-center gap-3">
              <!-- Download button in modal -->
               @if (previewContentLink()) {
                <a [href]="previewContentLink()" class="w-10 h-10 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white flex items-center justify-center transition-colors shadow-lg" title="Tải xuống">
                  <i class="fa-solid fa-download"></i>
                </a>
               }
              <a [href]="originalLink()" target="_blank" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" title="Mở trong tab mới">
                <i class="fa-solid fa-external-link-alt"></i>
              </a>
              <button (click)="closePreview()" class="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg" title="Đóng">
                <i class="fa-solid fa-times text-xl"></i>
              </button>
            </div>
          </div>
          <div class="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex">
            <iframe [src]="previewUrl()" class="w-full h-full border-none flex-1"></iframe>
          </div>
        </div>
      }
    </div>
  `
})
export class DocumentsComponent implements OnInit {
  private driveService = inject(GoogleDriveService);
  private sanitizer = inject(DomSanitizer);

  readonly ROOT_FOLDER_ID = '19N6TRGCUuWX9N7ZaB1H5P3hygeeCUJUN';
  readonly ROOT_FOLDER_NAME = 'Phiếu giao nhận mẫu';

  // ⚡ 1. Caching
  private folderCache = new Map<string, DriveItem[]>();

  // Raw State
  files = signal<DriveItem[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  folderStack = signal<Breadcrumb[]>([{ id: this.ROOT_FOLDER_ID, name: this.ROOT_FOLDER_NAME }]);
  currentFolderId = signal<string>(this.ROOT_FOLDER_ID);
  
  // View & Mode State
  viewMode = signal<ViewMode>('list');
  isGlobalSearch = signal<boolean>(false);

  // Search & Sort State
  searchTerm = signal<string>('');
  sortCol = signal<SortColumn>('modifiedTime'); // Đặt sort mặc định là Ngày cập nhật
  sortDir = signal<SortDirection>('desc');      // Mới nhất lên đầu

  // Preview State
  previewUrl = signal<SafeResourceUrl | null>(null);
  previewName = signal<string>('');
  originalLink = signal<string>('');
  previewContentLink = signal<string>('');

  // Computed state for UI display
  displayFiles = computed(() => {
    let arr = [...this.files()];
    const term = this.searchTerm().toLowerCase().trim();
    
    // 1. Filter (Local filter)
    if (term && !this.isGlobalSearch()) {
      arr = arr.filter(f => f.name.toLowerCase().includes(term));
    }

    // 2. Sort
    const col = this.sortCol();
    const dir = this.sortDir() === 'asc' ? 1 : -1;

    arr.sort((a, b) => {
      // Folders always on top
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

  ngOnInit() {
    this.loadFolder(this.ROOT_FOLDER_ID);
  }

  async loadFolder(folderId: string, skipCache = false) {
    this.loading.set(true);
    this.error.set(null);
    this.searchTerm.set('');
    this.isGlobalSearch.set(false);
    this.currentFolderId.set(folderId);

    // Kiểm tra Cache trước (nếu không bắt buộc làm mới)
    if (!skipCache && this.folderCache.has(folderId)) {
      this.files.set(this.folderCache.get(folderId)!);
      this.loading.set(false);
      return;
    }

    try {
      const items = await this.driveService.getFolderContents(folderId);
      this.files.set(items);
      this.folderCache.set(folderId, items); // Lưu vào Cache
    } catch (err: any) {
      this.error.set(err.message || 'Có lỗi xảy ra khi tải thư mục.');
    } finally {
      this.loading.set(false);
    }
  }

  forceRefresh() {
    if (this.isGlobalSearch()) {
      this.triggerGlobalSearch();
    } else {
      this.loadFolder(this.currentFolderId(), true); // skip cache
    }
  }

  async triggerGlobalSearch() {
    const term = this.searchTerm().trim();
    if (!term) return;

    this.loading.set(true);
    this.error.set(null);
    this.isGlobalSearch.set(true);

    try {
      const items = await this.driveService.searchGlobal(term);
      this.files.set(items);
    } catch (err: any) {
      this.error.set(err.message || 'Lỗi tìm kiếm toàn cục.');
    } finally {
      this.loading.set(false);
    }
  }

  cancelGlobalSearch() {
    this.isGlobalSearch.set(false);
    this.searchTerm.set('');
    // Quay lại thư mục đang xem dở
    this.loadFolder(this.currentFolderId());
  }

  toggleSort(col: SortColumn) {
    if (this.sortCol() === col) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortCol.set(col);
      // Nếu chọn cột Date, mặc định desc tốt hơn. Các cột khác asc.
      this.sortDir.set(col === 'modifiedTime' ? 'desc' : 'asc');
    }
  }

  isFolder(item: DriveItem): boolean {
    return item.mimeType === 'application/vnd.google-apps.folder';
  }

  onItemClick(item: DriveItem) {
    if (this.isFolder(item)) {
      if (this.isGlobalSearch()) {
        // Nếu tìm toàn cục mà ấn vào folder, ta lấy đó làm gốc mới và dọn breadcrumb cũ
        this.folderStack.set([{ id: this.ROOT_FOLDER_ID, name: this.ROOT_FOLDER_NAME }, { id: item.id, name: item.name }]);
        this.loadFolder(item.id);
      } else {
        this.folderStack.update(stack => [...stack, { id: item.id, name: item.name }]);
        this.loadFolder(item.id);
      }
    } else {
      const url = `https://drive.google.com/file/d/${item.id}/preview`;
      this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      this.previewName.set(item.name);
      this.originalLink.set(item.webViewLink || '');
      this.previewContentLink.set(item.webContentLink || '');
    }
  }

  downloadItem(item: DriveItem, event: Event) {
    event.stopPropagation(); // Không cho nổi bọt làm mở Preview Modal
    if (item.webContentLink) {
      // Dùng thẻ a ẩn để kích hoạt tải xuống
      const a = document.createElement('a');
      a.href = item.webContentLink;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  closePreview() {
    this.previewUrl.set(null);
    this.previewName.set('');
    this.originalLink.set('');
    this.previewContentLink.set('');
  }

  goToBreadcrumb(index: number) {
    const stack = this.folderStack();
    if (index === stack.length - 1 && !this.isGlobalSearch()) return; 

    const targetFolder = stack[index];
    this.folderStack.set(stack.slice(0, index + 1));
    this.loadFolder(targetFolder.id); // Sẽ load tức thì vì có cache
  }

  formatSize(bytes?: string): string {
    if (!bytes) return '--';
    const b = parseInt(bytes, 10);
    if (isNaN(b)) return '--';
    if (b < 1024) return b + ' B';
    else if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    else return (b / 1048576).toFixed(1) + ' MB';
  }

  formatDate(dateStr?: string, short: boolean = false): string {
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
}
