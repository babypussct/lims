import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GoogleDriveService } from '../../core/services/google-drive.service';

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
}

interface Breadcrumb {
  id: string;
  name: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full w-full flex flex-col bg-slate-50 dark:bg-slate-900 p-4 md:p-6 relative">
      
      <!-- Header & Breadcrumb -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
          <i class="fa-solid fa-folder-open text-fuchsia-500"></i>
          Phiếu giao nhận mẫu
        </h1>
        
        <!-- Breadcrumbs -->
        <div class="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          @for (bc of folderStack(); track bc.id; let i = $index; let last = $last) {
            <div class="flex items-center cursor-pointer hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors"
                 [class.text-fuchsia-600]="last"
                 [class.dark:text-fuchsia-400]="last"
                 (click)="goToBreadcrumb(i)">
              @if (i === 0) {
                <i class="fa-solid fa-home mr-1.5"></i>
              }
              <span>{{ bc.name }}</span>
            </div>
            @if (!last) {
              <i class="fa-solid fa-chevron-right mx-2 text-slate-400 text-xs"></i>
            }
          }
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-soft-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col relative">
        
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
            <button (click)="loadFolder(currentFolderId())" class="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors font-semibold">
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

        <!-- File List -->
        @if (!loading() && !error() && files().length > 0) {
          <div class="overflow-y-auto flex-1 custom-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead class="sticky top-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm z-10 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th class="py-3 px-4 w-12 text-center">Loại</th>
                  <th class="py-3 px-4">Tên tài liệu</th>
                  <th class="py-3 px-4 w-32 hidden sm:table-cell">Kích thước</th>
                  <th class="py-3 px-4 w-40 hidden md:table-cell">Ngày cập nhật</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                @for (item of files(); track item.id) {
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
                    <td class="py-3 px-4 text-sm text-slate-500 hidden sm:table-cell">
                      {{ formatSize(item.size) }}
                    </td>
                    <td class="py-3 px-4 text-sm text-slate-500 hidden md:table-cell">
                      {{ formatDate(item.modifiedTime) }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- File Preview Modal -->
      @if (previewUrl()) {
        <div class="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex flex-col p-4 md:p-8 animate-fade-in">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-white font-bold text-lg px-2 line-clamp-1 flex-1">{{ previewName() }}</h3>
            <div class="flex items-center gap-3">
              <!-- Nút mở tab mới nếu muốn -->
              <a [href]="originalLink()" target="_blank" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" title="Mở trong tab mới">
                <i class="fa-solid fa-external-link-alt"></i>
              </a>
              <button (click)="closePreview()" class="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg" title="Đóng">
                <i class="fa-solid fa-times text-xl"></i>
              </button>
            </div>
          </div>
          <div class="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex">
            <!-- Iframe xem trước file -->
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

  files = signal<DriveItem[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  folderStack = signal<Breadcrumb[]>([{ id: this.ROOT_FOLDER_ID, name: this.ROOT_FOLDER_NAME }]);
  currentFolderId = signal<string>(this.ROOT_FOLDER_ID);

  // Preview State
  previewUrl = signal<SafeResourceUrl | null>(null);
  previewName = signal<string>('');
  originalLink = signal<string>('');

  ngOnInit() {
    this.loadFolder(this.ROOT_FOLDER_ID);
  }

  async loadFolder(folderId: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const items = await this.driveService.getFolderContents(folderId);
      this.files.set(items);
    } catch (err: any) {
      this.error.set(err.message || 'Có lỗi xảy ra khi tải thư mục.');
    } finally {
      this.loading.set(false);
    }
  }

  isFolder(item: DriveItem): boolean {
    return item.mimeType === 'application/vnd.google-apps.folder';
  }

  onItemClick(item: DriveItem) {
    if (this.isFolder(item)) {
      // Navigate into folder
      this.currentFolderId.set(item.id);
      this.folderStack.update(stack => [...stack, { id: item.id, name: item.name }]);
      this.loadFolder(item.id);
    } else {
      // Preview file inside the app
      const url = `https://drive.google.com/file/d/${item.id}/preview`;
      this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      this.previewName.set(item.name);
      this.originalLink.set(item.webViewLink || '');
    }
  }

  closePreview() {
    this.previewUrl.set(null);
    this.previewName.set('');
    this.originalLink.set('');
  }

  goToBreadcrumb(index: number) {
    const stack = this.folderStack();
    if (index === stack.length - 1) return; // Already here

    const targetFolder = stack[index];
    this.currentFolderId.set(targetFolder.id);
    
    // Trim stack
    this.folderStack.set(stack.slice(0, index + 1));
    this.loadFolder(targetFolder.id);
  }

  formatSize(bytes?: string): string {
    if (!bytes) return '--';
    const b = parseInt(bytes, 10);
    if (isNaN(b)) return '--';
    if (b < 1024) return b + ' B';
    else if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    else return (b / 1048576).toFixed(1) + ' MB';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
