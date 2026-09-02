import { Component, inject, OnInit, OnDestroy, signal, computed, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { StateService } from '../../core/services/state.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import {
  AppButtonComponent,
  AppEmptyStateComponent,
  AppPageHeaderComponent,
  AppToolbarComponent,
} from '../../shared/components/ui';
import { DocumentPreviewModalComponent } from './document-preview-modal.component';
import { DriveItem } from './document-viewer.models';
import { formatDocumentSize, removeDiacritics } from './document-viewer.utils';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  CellDoubleClickedEvent,
  CellKeyDownEvent,
  ColDef,
  FullWidthCellKeyDownEvent,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  PostSortRowsParams,
  SortChangedEvent,
  themeBalham,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface Breadcrumb {
  id: string;
  name: string;
}

type SortColumn = 'name' | 'modifiedTime' | 'size';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'list' | 'grid';
type DensityMode = 'comfortable' | 'compact';

function readStoredOption<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = localStorage.getItem(key) as T | null;
    return value && allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AgGridAngular,
    SkeletonComponent,
    AppButtonComponent,
    AppEmptyStateComponent,
    AppPageHeaderComponent,
    AppToolbarComponent,
    DocumentPreviewModalComponent,
  ],
  host: {
    '[class.document-preview-active]': 'previewItem() !== null'
  },
  template: `
    <div class="documents-page-enter h-full min-h-0 w-full flex flex-col bg-slate-50 dark:bg-slate-900 p-2 md:p-3 relative overflow-hidden">
      
      <app-page-header
        class="mb-2 block shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"
        title="Phiếu giao nhận mẫu"
        subtitle="Quản lý tài liệu giao nhận mẫu phòng thí nghiệm."
        icon="fa-folder-open">
        <div pageHeaderActions class="flex items-center gap-1.5">
          <!-- View Toggle -->
          <div class="hidden sm:flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700" role="group" aria-label="Chế độ hiển thị">
            <button (click)="setViewMode('list')"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                    [class.bg-white]="viewMode() === 'list'" [class.dark:bg-slate-800]="viewMode() === 'list'"
                    [class.text-fuchsia-600]="viewMode() === 'list'" [class.text-slate-400]="viewMode() !== 'list'"
                    title="Chế độ danh sách" aria-label="Chế độ danh sách">
              <i class="fa-solid fa-list"></i>
            </button>
            <button (click)="setViewMode('grid')"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                    [class.bg-white]="viewMode() === 'grid'" [class.dark:bg-slate-800]="viewMode() === 'grid'"
                    [class.text-fuchsia-600]="viewMode() === 'grid'" [class.text-slate-400]="viewMode() !== 'grid'"
                    title="Chế độ lưới" aria-label="Chế độ lưới">
              <i class="fa-solid fa-border-all"></i>
            </button>
          </div>

          <button (click)="toggleDensity()"
                  class="hidden md:flex w-9 h-9 items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 rounded-lg hover:text-fuchsia-600 dark:hover:text-fuchsia-300 transition-colors"
                  [title]="density() === 'compact' ? 'Chuyển sang hiển thị thoáng' : 'Chuyển sang hiển thị gọn'"
                  [attr.aria-label]="density() === 'compact' ? 'Chuyển sang hiển thị thoáng' : 'Chuyển sang hiển thị gọn'">
            <i class="fa-solid" [class.fa-compress]="density() === 'compact'" [class.fa-arrows-up-down]="density() !== 'compact'"></i>
          </button>

          <!-- Refresh Button -->
          <button (click)="forceRefresh()" 
                  [disabled]="!isOnline()"
                  class="w-9 h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Làm mới dữ liệu" aria-label="Làm mới dữ liệu">
            <i class="fa-solid fa-rotate-right" [class.fa-spin]="loading() && isOnline()"></i>
          </button>
        </div>
      </app-page-header>

      <!-- Breadcrumbs -->
      <nav class="mb-2 min-h-9 flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none shrink-0"
           aria-label="Đường dẫn thư mục">
        @for (bcItem of collapsedFolderStack(); track bcItem.item.id || bcItem.originalIndex; let i = $index; let last = $last) {
          @if (bcItem.isEllipsis) {
            <div class="flex items-center text-slate-400 cursor-default select-none px-1">
              <span>...</span>
            </div>
          } @else {
            <button class="flex items-center cursor-pointer hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors whitespace-nowrap max-w-[180px] md:max-w-[320px]"
                 [class.text-fuchsia-600]="last"
                 [class.dark:text-fuchsia-400]="last"
                 (click)="goToBreadcrumb(bcItem.originalIndex)"
                 [title]="bcItem.item.name">
              @if (bcItem.originalIndex === 0) {
                <i class="fa-solid fa-home mr-1.5"></i>
              }
              <span class="truncate">{{ bcItem.item.name }}</span>
            </button>
          }
          @if (!last) {
            <i class="fa-solid fa-chevron-right mx-2 text-slate-400 text-xs shrink-0"></i>
          }
        }
      </nav>

      <!-- Content Area -->
      <div class="flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-xl shadow-soft-xl border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden">
        @if (loading() && files().length > 0) {
          <div class="absolute top-0 inset-x-0 h-0.5 bg-fuchsia-100 dark:bg-fuchsia-950 z-30 overflow-hidden">
            <div class="h-full w-1/3 bg-fuchsia-500 animate-[loading-bar_1.2s_ease-in-out_infinite]"></div>
          </div>
        }
        
        <!-- Toolbar: Search & Filter -->
        <app-toolbar>
          <div toolbarSearch class="relative max-w-md flex-1">
            <div class="relative flex-1">
              <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input #searchInput
                     type="text" 
                     [ngModel]="searchInputValue()" 
                     (ngModelChange)="onSearchChange($event)"
                     [placeholder]="isMobile() ? 'Tìm tài liệu...' : 'Tìm tài liệu trong thư mục hiện tại...'" 
                     class="w-full h-9 pl-9 pr-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-fuchsia-500/40 dark:text-white transition-shadow">
              @if (searchInputValue()) {
                <button type="button"
                        aria-label="Xóa tìm kiếm"
                        (click)="clearSearch()"
                        class="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              }
            </div>
          </div>
          <div toolbarActions class="text-xs text-slate-500 dark:text-slate-400 shrink-0 font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-full">
            {{ displayFiles().length }} mục
          </div>
        </app-toolbar>

        @if (!isOnline()) {
          <!-- Offline State -->
          <div class="flex flex-1 items-center justify-center animate-fade-in">
            <app-empty-state
              icon="fa-plug-circle-xmark"
              title="Không có kết nối mạng"
              message="Vui lòng kiểm tra lại kết nối Internet để duyệt và tải tài liệu từ Google Drive.">
            </app-empty-state>
          </div>
        } @else {
          <!-- Error State -->
          @if (folderError() && files().length === 0) {
            <div class="flex flex-1 items-center justify-center animate-fade-in">
              <app-empty-state icon="fa-triangle-exclamation" title="Lỗi tải dữ liệu" [message]="folderError() || ''">
                <app-button emptyStateActions variant="secondary" size="sm" (click)="forceRefresh()">Thử lại</app-button>
              </app-empty-state>
            </div>
          }

          @if (folderError() && files().length > 0) {
            <div class="mx-2.5 mt-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2 shrink-0">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span class="flex-1 truncate" [title]="folderError() || ''">Không thể cập nhật. Đang hiển thị dữ liệu gần nhất.</span>
              <button (click)="forceRefresh()" class="font-bold hover:underline">Thử lại</button>
            </div>
          }

          <!-- Empty State (No loading, no files) -->
          @if (!loading() && !folderError() && files().length === 0) {
            <div class="flex flex-1 items-center justify-center animate-fade-in">
              <app-empty-state
                icon="fa-folder-open"
                title="Thư mục trống"
                message="Không có tài liệu nào trong thư mục này.">
              </app-empty-state>
            </div>
          }

          <!-- Search Empty State -->
          @if (!loading() && !folderError() && files().length > 0 && displayFiles().length === 0) {
            <div class="flex flex-1 items-center justify-center animate-fade-in">
              <app-empty-state
                icon="fa-magnifying-glass"
                title="Không tìm thấy kết quả"
                message="Thử tìm với từ khóa khác xem sao.">
              </app-empty-state>
            </div>
          }

          <!-- File List (List View) -->
          @if ((!folderError() || files().length > 0) && (displayFiles().length > 0 || (loading() && files().length === 0)) && viewMode() === 'list') {
            <div class="flex-1 min-h-0">
              
              <!-- Mobile List View (visible on <640px screens) -->
              <div #fileScroller class="block sm:hidden h-full overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-700/50" (scroll)="onFileScroll($event)">
                @if (loading() && files().length === 0) {
                  @for (item of [1, 2, 3, 4, 5]; track item) {
                    <div class="p-4 flex items-center gap-3">
                      <app-skeleton shape="rect" width="40px" height="40px" class="shrink-0"></app-skeleton>
                      <div class="flex-1 space-y-2">
                        <app-skeleton width="66%" height="16px"></app-skeleton>
                        <app-skeleton width="33%" height="12px"></app-skeleton>
                      </div>
                    </div>
                  }
                } @else {
                  @for (item of displayFiles(); track item.id) {
                    <div class="flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer active:bg-slate-100 dark:active:bg-slate-700"
                         [class.p-3]="density() === 'comfortable'"
                         [class.p-2]="density() === 'compact'"
                         (click)="onItemClick(item)">
                      <div class="rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"
                           [class.w-10]="density() === 'comfortable'" [class.h-10]="density() === 'comfortable'"
                           [class.w-8]="density() === 'compact'" [class.h-8]="density() === 'compact'">
                        <i class="fa-solid {{ getFileTypeStyle(item).icon }}" [class.text-lg]="density() === 'comfortable'" [class.text-sm]="density() === 'compact'"></i>
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
                      <div class="shrink-0 flex items-center gap-1 text-slate-400 dark:text-slate-600 pr-1">
                        @if (!isFolder(item) && item.webContentLink) {
                          <button (click)="downloadItem(item, $event)" class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-fuchsia-50 hover:text-fuchsia-600 dark:hover:bg-fuchsia-900/30" title="Tải xuống" [attr.aria-label]="'Tải ' + item.name">
                            <i class="fa-solid fa-download text-xs"></i>
                          </button>
                        }
                        @if (isFolder(item)) {
                          <i class="fa-solid fa-chevron-right text-xs"></i>
                        }
                      </div>
                    </div>
                  }
                }
              </div>

              <!-- Excel-style desktop grid -->
              <div class="hidden sm:block h-full min-h-0" [attr.data-ag-theme-mode]="state.darkMode() ? 'dark' : 'light'">
                <ag-grid-angular
                  class="w-full h-full"
                  [theme]="gridTheme"
                  [rowData]="displayFiles()"
                  [columnDefs]="columnDefs"
                  [defaultColDef]="defaultColDef"
                  [rowHeight]="density() === 'compact' ? 34 : 44"
                  [headerHeight]="38"
                  [loading]="loading() && files().length === 0"
                  [rowSelection]="rowSelection"
                  [getRowId]="getRowId"
                  [postSortRows]="postSortRows"
                  [animateRows]="false"
                  [suppressCellFocus]="false"
                  [ensureDomOrder]="true"
                  (gridReady)="onGridReady($event)"
                  (sortChanged)="onGridSortChanged($event)"
                  (cellDoubleClicked)="onGridCellDoubleClicked($event)"
                  (cellKeyDown)="onGridCellKeyDown($event)"
                  (bodyScroll)="onGridBodyScroll()"
                  (rowDataUpdated)="restoreGridScroll()">
                </ag-grid-angular>
              </div>
            </div>
          }

          <!-- Grid View -->
          @if ((!folderError() || files().length > 0) && (displayFiles().length > 0 || (loading() && files().length === 0)) && viewMode() === 'grid') {
            <div #fileScroller class="overflow-y-auto flex-1 custom-scrollbar" (scroll)="onFileScroll($event)" [class.p-4]="density() === 'comfortable'" [class.p-2]="density() === 'compact'">
              @if (loading() && files().length === 0) {
                <!-- Skeleton Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  @for (item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track item) {
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col">
                      <div class="flex-1 flex flex-col items-center justify-center py-4">
                        <app-skeleton shape="rect" width="64px" height="64px"></app-skeleton>
                      </div>
                      <div class="mt-2 border-t border-slate-100 dark:border-slate-700/50 pt-3 space-y-2">
                        <app-skeleton width="75%" height="16px" class="mx-auto block"></app-skeleton>
                        <div class="flex justify-between items-center mt-2">
                          <app-skeleton width="48px" height="12px"></app-skeleton>
                          <app-skeleton width="32px" height="12px"></app-skeleton>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-fade-in" [class.gap-4]="density() === 'comfortable'" [class.gap-2]="density() === 'compact'">
                  @for (item of displayFiles(); track item.id) {
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:shadow-md transition-all cursor-pointer group"
                         [class.p-4]="density() === 'comfortable'" [class.p-2.5]="density() === 'compact'"
                         (click)="onItemClick(item)">
                      
                      <div class="flex-1 flex flex-col items-center justify-center py-4 relative min-h-[96px]">
                        @if (isFolder(item)) {
                          <i class="fa-solid fa-folder text-yellow-400 text-5xl group-hover:scale-110 transition-transform"></i>
                        } @else if (item.thumbnailLink) {
                          <img [src]="item.thumbnailLink" class="w-16 h-16 rounded shadow-sm border border-slate-200 dark:border-slate-700 object-cover group-hover:scale-110 transition-transform" onerror="this.style.display='none'" alt="thumbnail">
                        } @else {
                          <i class="fa-solid {{ getFileTypeStyle(item).icon }} text-5xl group-hover:scale-110 transition-transform"></i>
                        }
                        
                        @if (!isFolder(item) && item.webContentLink) {
                          <button type="button" (click)="downloadItem(item, $event)" aria-label="Tải tài liệu xuống"
                                  class="flex absolute top-0 right-0 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-sm text-slate-500 hover:bg-fuchsia-500 hover:text-white transition-colors items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus-visible:opacity-100"
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

    </div>

    @if (previewItem(); as item) {
      <app-document-preview-modal [item]="item" (closed)="closePreview()"></app-document-preview-modal>
    }
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      min-height: 0;
    }
    :host(.document-preview-active) {
      position: relative;
      z-index: 200;
    }
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
    @keyframes loading-bar {
      0% { transform: translateX(-120%); }
      100% { transform: translateX(420%); }
    }
    :host ::ng-deep .ag-root-wrapper {
      border: 0;
      border-radius: 0;
    }
    :host ::ng-deep .ag-header-cell-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    :host ::ng-deep .ag-cell {
      display: flex;
      align-items: center;
      border-right: 1px solid color-mix(in srgb, var(--ag-border-color) 65%, transparent);
    }
    :host ::ng-deep .ag-row {
      cursor: default;
    }
    :host ::ng-deep .ag-row:hover .documents-grid-name {
      color: #c026d3;
    }
    :host ::ng-deep .ag-row-selected::before {
      background-color: color-mix(in srgb, #c026d3 10%, transparent);
    }
    :host ::ng-deep .documents-grid-row-number {
      justify-content: center;
      color: #94a3b8;
      font-variant-numeric: tabular-nums;
    }
    :host ::ng-deep .documents-grid-type,
    :host ::ng-deep .documents-grid-actions {
      justify-content: center;
    }
    :host ::ng-deep .documents-grid-name {
      font-size: 13px;
      font-weight: 650;
    }
    :host ::ng-deep .documents-grid-meta {
      color: #64748b;
      font-variant-numeric: tabular-nums;
    }
    :host-context(.dark) ::ng-deep .documents-grid-meta {
      color: #94a3b8;
    }
    /* Keep the route host free of transform so preview dialogs remain fixed
       to the viewport while the page enters. */
    .documents-page-enter {
      animation: documents-page-enter 180ms ease-out;
    }
    @keyframes documents-page-enter {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class DocumentsComponent implements OnInit, OnDestroy {
  private readonly pendingPreviewKey = '__gd_pending_document_preview';
  private readonly navigationStateKey = '__documents_navigation_state';
  private readonly viewModeKey = 'documents_view_mode';
  private readonly densityKey = 'documents_density';
  private readonly sortColumnKey = 'documents_sort_column';
  private readonly sortDirectionKey = 'documents_sort_direction';
  private readonly scrollPositionsKey = '__documents_scroll_positions';
  private driveService = inject(GoogleDriveService);
  readonly state = inject(StateService);

  @ViewChild('searchInput') searchInputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('fileScroller') fileScroller?: ElementRef<HTMLDivElement>;

  readonly ROOT_FOLDER_ID = '19N6TRGCUuWX9N7ZaB1H5P3hygeeCUJUN';
  readonly ROOT_FOLDER_NAME = 'Phiếu giao nhận mẫu';

  // Signals
  files = signal<DriveItem[]>([]);
  loading = signal<boolean>(true);
  folderError = signal<string | null>(null);
  isOnline = signal<boolean>(navigator.onLine);
  windowWidth = signal<number>(window.innerWidth);
  isMobile = computed(() => this.windowWidth() < 640);
  
  folderStack = signal<Breadcrumb[]>([{ id: this.ROOT_FOLDER_ID, name: this.ROOT_FOLDER_NAME }]);
  currentFolderId = signal<string>(this.ROOT_FOLDER_ID);
  
  viewMode = signal<ViewMode>(readStoredOption(this.viewModeKey, ['list', 'grid'] as const, 'list'));
  density = signal<DensityMode>(readStoredOption(this.densityKey, ['comfortable', 'compact'] as const, 'compact'));

  // Search state (decoupled with debounce)
  searchInputValue = signal<string>('');
  searchTerm = signal<string>('');
  private searchSubject = new Subject<string>();
  
  sortCol = signal<SortColumn>(readStoredOption(this.sortColumnKey, ['name', 'modifiedTime', 'size'] as const, 'modifiedTime'));
  sortDir = signal<SortDirection>(readStoredOption(this.sortDirectionKey, ['asc', 'desc'] as const, 'desc'));

  readonly gridTheme = themeBalham
    .withParams({
      accentColor: '#c026d3',
      backgroundColor: '#ffffff',
      foregroundColor: '#334155',
      borderColor: '#e2e8f0',
      headerBackgroundColor: '#f8fafc',
      headerTextColor: '#64748b',
      oddRowBackgroundColor: '#fafafa',
      fontFamily: 'inherit',
      fontSize: 12,
      spacing: 4,
    }, 'light')
    .withParams({
      accentColor: '#e879f9',
      backgroundColor: '#1e293b',
      foregroundColor: '#e2e8f0',
      borderColor: '#334155',
      headerBackgroundColor: '#0f172a',
      headerTextColor: '#94a3b8',
      oddRowBackgroundColor: '#1b2637',
      fontFamily: 'inherit',
      fontSize: 12,
      spacing: 4,
    }, 'dark');

  readonly defaultColDef: ColDef<DriveItem> = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 90,
  };

  readonly rowSelection = {
    mode: 'singleRow' as const,
    checkboxes: false,
    enableClickSelection: true,
  };

  readonly getRowId = (params: GetRowIdParams<DriveItem>) => params.data.id;

  readonly postSortRows = (params: PostSortRowsParams<DriveItem>) => {
    params.nodes.sort((left, right) => {
      const leftFolder = !!left.data && this.isFolder(left.data);
      const rightFolder = !!right.data && this.isFolder(right.data);
      if (leftFolder === rightFolder) return 0;
      return leftFolder ? -1 : 1;
    });
  };

  readonly columnDefs: ColDef<DriveItem>[] = [
    {
      headerName: '#',
      colId: 'rowNumber',
      width: 54,
      minWidth: 54,
      maxWidth: 54,
      pinned: 'left',
      sortable: false,
      filter: false,
      resizable: false,
      suppressMovable: true,
      valueGetter: params => (params.node?.rowIndex ?? 0) + 1,
      cellClass: 'documents-grid-row-number',
    },
    {
      headerName: 'Loại',
      colId: 'fileType',
      width: 70,
      minWidth: 70,
      maxWidth: 85,
      pinned: 'left',
      sortable: false,
      filter: false,
      suppressMovable: true,
      cellRenderer: (params: ICellRendererParams<DriveItem>) => {
        if (!params.data) return '';
        const icon = document.createElement('i');
        icon.className = `fa-solid ${this.getFileTypeStyle(params.data).icon}`;
        icon.setAttribute('aria-hidden', 'true');
        return icon;
      },
      cellClass: 'documents-grid-type',
    },
    {
      headerName: 'Tên tài liệu',
      field: 'name',
      colId: 'name',
      flex: 1,
      minWidth: 260,
      tooltipField: 'name',
      cellClass: 'documents-grid-name',
    },
    {
      headerName: 'Kích thước',
      field: 'size',
      colId: 'size',
      width: 130,
      minWidth: 110,
      comparator: (left, right) => (parseInt(left || '0', 10) || 0) - (parseInt(right || '0', 10) || 0),
      valueFormatter: params => this.formatSize(params.value, params.data),
      cellClass: 'documents-grid-meta',
    },
    {
      headerName: 'Ngày cập nhật',
      field: 'modifiedTime',
      colId: 'modifiedTime',
      width: 180,
      minWidth: 150,
      valueFormatter: params => this.formatDate(params.value),
      cellClass: 'documents-grid-meta',
    },
    {
      headerName: '',
      colId: 'actions',
      width: 64,
      minWidth: 64,
      maxWidth: 64,
      pinned: 'right',
      sortable: false,
      filter: false,
      resizable: false,
      suppressMovable: true,
      cellRenderer: (params: ICellRendererParams<DriveItem>) => this.createGridActionButton(params.data),
      cellClass: 'documents-grid-actions',
    },
  ];

  previewItem = signal<DriveItem | null>(null);

  // Subscriptions
  private searchSub?: Subscription;
  private onlineListener?: () => void;
  private offlineListener?: () => void;
  private folderAbortController?: AbortController;
  private folderRequestId = 0;
  private scrollPositions: Record<string, number> = {};
  private gridApi?: GridApi<DriveItem>;

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

  @HostListener('window:resize')
  onResize() {
    this.windowWidth.set(window.innerWidth);
  }

  ngOnInit() {
    this.restoreScrollPositions();
    this.restoreNavigationState();
    this.loadFolder(this.currentFolderId());

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
    this.offlineListener = () => {
      this.isOnline.set(false);
      this.folderAbortController?.abort();
      this.loading.set(false);
    };
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
    this.folderRequestId++;
    this.folderAbortController?.abort();
    this.closePreview();
    if (this.searchSub) this.searchSub.unsubscribe();
    if (this.onlineListener) window.removeEventListener('online', this.onlineListener);
    if (this.offlineListener) window.removeEventListener('offline', this.offlineListener);
  }

  async loadFolder(folderId: string, skipCache = false) {
    const previousFolderId = this.currentFolderId();
    const requestId = ++this.folderRequestId;
    this.folderAbortController?.abort();
    const controller = new AbortController();
    this.folderAbortController = controller;

    this.loading.set(true);
    this.folderError.set(null);
    this.currentFolderId.set(folderId);

    // Reset local search inputs
    this.searchInputValue.set('');
    this.searchTerm.set('');

    // If offline, abort API load immediately
    if (!this.isOnline()) {
      if (requestId === this.folderRequestId) this.loading.set(false);
      return;
    }

    // Check service cache
    if (!skipCache) {
      const cached = this.driveService.getCachedFolder(folderId);
      if (cached) {
        if (requestId === this.folderRequestId && folderId === this.currentFolderId()) {
          this.files.set(cached);
          this.loading.set(false);
          this.restoreFolderScroll();
        }
        return;
      }
    }

    if (previousFolderId !== folderId) this.files.set([]);

    try {
      const items = await this.driveService.getFolderContents(folderId, controller.signal);
      if (requestId !== this.folderRequestId || folderId !== this.currentFolderId()) return;
      this.files.set(items);
      this.driveService.setCachedFolder(folderId, items);
      this.restoreFolderScroll();
    } catch (err: any) {
      if (err?.name === 'AbortError' || requestId !== this.folderRequestId) return;
      this.folderError.set(err?.message || 'Có lỗi xảy ra khi tải thư mục.');
    } finally {
      if (requestId === this.folderRequestId) {
        this.loading.set(false);
        if (this.folderAbortController === controller) this.folderAbortController = undefined;
      }
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
    this.storePreference(this.sortColumnKey, this.sortCol());
    this.storePreference(this.sortDirectionKey, this.sortDir());
  }

  setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
    this.storePreference(this.viewModeKey, mode);
    this.restoreFolderScroll();
  }

  toggleDensity() {
    const next = this.density() === 'compact' ? 'comfortable' : 'compact';
    this.density.set(next);
    this.storePreference(this.densityKey, next);
    setTimeout(() => this.gridApi?.resetRowHeights());
  }

  onGridReady(event: GridReadyEvent<DriveItem>) {
    this.gridApi = event.api;
    event.api.applyColumnState({
      state: [{ colId: this.sortCol(), sort: this.sortDir() }],
      defaultState: { sort: null },
    });
    this.restoreGridScroll();
  }

  onGridSortChanged(event: SortChangedEvent<DriveItem>) {
    const sortedColumn = event.api.getColumnState().find(column => !!column.sort);
    if (!sortedColumn) return;
    const colId = sortedColumn?.colId;
    if (colId !== 'name' && colId !== 'size' && colId !== 'modifiedTime') return;

    this.sortCol.set(colId);
    this.sortDir.set(sortedColumn.sort === 'asc' ? 'asc' : 'desc');
    this.storePreference(this.sortColumnKey, this.sortCol());
    this.storePreference(this.sortDirectionKey, this.sortDir());
  }

  onGridCellDoubleClicked(event: CellDoubleClickedEvent<DriveItem>) {
    if (event.data) this.onItemClick(event.data);
  }

  onGridCellKeyDown(event: CellKeyDownEvent<DriveItem> | FullWidthCellKeyDownEvent<DriveItem>) {
    const keyboardEvent = event.event as KeyboardEvent;
    if (!event.data) return;

    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this.onItemClick(event.data);
      return;
    }

    if ((keyboardEvent.ctrlKey || keyboardEvent.metaKey) && keyboardEvent.key.toLowerCase() === 'f') {
      keyboardEvent.preventDefault();
      this.searchInputElement?.nativeElement?.focus();
      this.searchInputElement?.nativeElement?.select();
    }
  }

  onGridBodyScroll() {
    if (!this.gridApi) return;
    this.scrollPositions[this.currentFolderId()] = this.gridApi.getVerticalPixelRange().top;
    this.persistScrollPositions();
  }

  restoreGridScroll() {
    if (!this.gridApi || this.isMobile() || this.viewMode() !== 'list') return;
    const rowCount = this.gridApi.getDisplayedRowCount();
    if (rowCount === 0) return;
    const rowHeight = this.density() === 'compact' ? 34 : 44;
    const scrollTop = this.scrollPositions[this.currentFolderId()] || 0;
    const rowIndex = Math.min(Math.max(0, Math.floor(scrollTop / rowHeight)), rowCount - 1);
    setTimeout(() => this.gridApi?.ensureIndexVisible(rowIndex, 'top'));
  }

  isFolder(item: DriveItem): boolean {
    return item.mimeType === 'application/vnd.google-apps.folder';
  }

  async onItemClick(item: DriveItem) {
    if (this.isFolder(item)) {
      this.folderStack.update(stack => [...stack, { id: item.id, name: item.name }]);
      this.saveNavigationState();
      this.loadFolder(item.id);
    } else {
      if (!this.isOnline()) return;
      this.previewItem.set(item);
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
    this.previewItem.set(null);
  }

  goToBreadcrumb(index: number) {
    const stack = this.folderStack();
    if (index === stack.length - 1) return; 

    const targetStack = stack.slice(0, index + 1);
    this.folderStack.set(targetStack);
    this.saveNavigationState();
    this.loadFolder(targetStack[targetStack.length - 1].id);
  }

  onSearchChange(value: string) {
    this.searchInputValue.set(value);
    this.searchSubject.next(value);
  }

  clearSearch() {
    this.searchInputValue.set('');
    this.searchTerm.set('');
    this.searchSubject.next('');
    if (this.searchInputElement?.nativeElement) {
      this.searchInputElement.nativeElement.value = '';
    }
    setTimeout(() => {
      this.searchInputElement?.nativeElement?.focus();
    }, 50);
  }

  onFileScroll(event: Event) {
    const element = event.target as HTMLElement | null;
    if (!element) return;
    this.scrollPositions[this.currentFolderId()] = element.scrollTop;
    this.persistScrollPositions();
  }

  private createGridActionButton(item?: DriveItem): HTMLElement | string {
    if (!item) return '';

    if (this.isFolder(item)) {
      const folderHint = document.createElement('i');
      folderHint.className = 'fa-solid fa-chevron-right text-slate-400 text-xs';
      folderHint.setAttribute('aria-hidden', 'true');
      return folderHint;
    }

    if (!item.webContentLink) return '';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'w-7 h-7 rounded-md text-slate-400 hover:bg-fuchsia-100 hover:text-fuchsia-600 dark:hover:bg-fuchsia-900/40 dark:hover:text-fuchsia-300 transition-colors flex items-center justify-center';
    button.title = `Tải ${item.name}`;
    button.setAttribute('aria-label', `Tải ${item.name}`);

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-download text-xs';
    icon.setAttribute('aria-hidden', 'true');
    button.appendChild(icon);
    button.addEventListener('click', event => this.downloadItem(item, event));
    return button;
  }

  private saveNavigationState() {
    try {
      sessionStorage.setItem(this.navigationStateKey, JSON.stringify(this.folderStack()));
    } catch {
      // Navigation persistence is optional.
    }
  }

  private restoreScrollPositions() {
    try {
      const raw = sessionStorage.getItem(this.scrollPositionsKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;
      this.scrollPositions = Object.fromEntries(
        Object.entries(parsed).filter((entry): entry is [string, number] =>
          /^[a-zA-Z0-9_-]+$/.test(entry[0]) &&
          typeof entry[1] === 'number' &&
          Number.isFinite(entry[1]) &&
          entry[1] >= 0
        )
      );
    } catch {
      sessionStorage.removeItem(this.scrollPositionsKey);
    }
  }

  private persistScrollPositions() {
    try {
      sessionStorage.setItem(this.scrollPositionsKey, JSON.stringify(this.scrollPositions));
    } catch {
      // Scroll restoration is optional.
    }
  }

  private restoreFolderScroll() {
    const folderId = this.currentFolderId();
    const scrollTop = this.scrollPositions[folderId] || 0;
    setTimeout(() => {
      if (folderId === this.currentFolderId() && this.fileScroller?.nativeElement) {
        this.fileScroller.nativeElement.scrollTop = scrollTop;
      }
      if (folderId === this.currentFolderId()) this.restoreGridScroll();
    });
  }

  private restoreNavigationState() {
    try {
      const raw = sessionStorage.getItem(this.navigationStateKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const isValid = parsed.every(item =>
        item &&
        typeof item.id === 'string' &&
        /^[a-zA-Z0-9_-]+$/.test(item.id) &&
        typeof item.name === 'string'
      );
      if (!isValid || parsed[0].id !== this.ROOT_FOLDER_ID) return;

      const restored = parsed as Breadcrumb[];
      this.folderStack.set(restored);
      this.currentFolderId.set(restored[restored.length - 1].id);
    } catch {
      sessionStorage.removeItem(this.navigationStateKey);
    }
  }

  private storePreference(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Preferences are non-critical when storage is unavailable.
    }
  }

  formatSize(bytes?: string, item?: DriveItem): string {
    return formatDocumentSize(bytes, Boolean(item && this.isFolder(item)));
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
    return removeDiacritics(str);
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
