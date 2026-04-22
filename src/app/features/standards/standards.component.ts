
import { Component, inject, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { StandardService } from './standard.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ReferenceStandard, UsageLog, ImportPreviewItem, ImportUsageLogPreviewItem, StandardRequest, PurchaseRequest, CoaMatchItem } from '../../core/models/standard.model';
import { formatNum, calculateSimilarityScore } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { Unsubscribe, onSnapshot, query, collection, where } from 'firebase/firestore';
import { GoogleDriveService } from '../../core/services/google-drive.service';

import { StandardsFormModalComponent } from './components/standards-form-modal.component';
import { StandardsPrintModalComponent } from './components/standards-print-modal.component';
import { StandardsImportDataModalComponent, StandardsImportUsageModalComponent } from './components/standards-import-modal.component';
import { StandardsHistoryModalComponent } from './components/standards-history-modal.component';
import { StandardsPurchaseModalComponent } from './components/standards-purchase-modal.component';
import { StandardsCoaModalComponent } from './components/standards-coa-modal.component';
import { StandardsBulkCoaModalComponent } from './components/standards-bulk-coa-modal.component';
import { StandardsToolbarComponent } from './components/standards-toolbar.component';
import { StandardsFilterComponent } from './components/standards-filter.component';
import { StandardsListViewComponent } from './components/standards-list-view.component';
import { StandardsGridViewComponent } from './components/standards-grid-view.component';
import { StandardsAssignModalComponent } from './components/standards-assign-modal.component';
@Component({
  selector: 'app-standards',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonComponent, StandardsFormModalComponent, StandardsPrintModalComponent, StandardsImportDataModalComponent, StandardsImportUsageModalComponent, StandardsHistoryModalComponent, StandardsPurchaseModalComponent, StandardsCoaModalComponent, StandardsBulkCoaModalComponent, StandardsToolbarComponent, StandardsFilterComponent, StandardsListViewComponent, StandardsGridViewComponent, StandardsAssignModalComponent],
  template: `
    <div class="flex flex-col space-y-2 md:space-y-3 fade-in h-full relative">
      <!-- Header -->
      <app-standards-toolbar
          [selectedCount]="selectedIds().size"
          [isProcessing]="isProcessing()"
          [canEditStandards]="auth.canEditStandards()"
          (deleteSelected)="deleteSelected()"
          (openAddModal)="openAddModal()"
          (autoZeroAllSdhet)="autoZeroAllSdhet()"
          (importStandardsFile)="handleFileSelect($event)"
          (importUsageLogFile)="handleUsageLogFileSelect($event)"
          (bulkCoaSelect)="handleBulkCoaSelect($event)">
      </app-standards-toolbar>

      <!-- Main Content -->
      <div class="flex-1 min-h-0 overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col relative">
          
          <app-standards-filter
              [searchTerm]="searchTerm()"
              [activeWidgetFilter]="activeWidgetFilter()"
              [sortOption]="sortOption()"
              [viewMode]="viewMode()"
              [stats]="stats()"
              [visibleCount]="visibleItems().length"
              [filteredCount]="filteredItems().length"
              [isLoading]="isLoading()"
              (searchTermChange)="onSearchInput($event)"
              (activeWidgetFilterChange)="activeWidgetFilter.set($event)"
              (sortOptionChange)="onSortChange($event)"
              (viewModeChange)="viewMode.set($event)">
          </app-standards-filter>

          <!-- Content Body -->
          <div class="flex-1 min-h-0 overflow-auto custom-scrollbar relative bg-slate-50/30 dark:bg-slate-900/50">
             
             @if (viewMode() === 'list') {
                 <app-standards-list-view
                    [items]="visibleItems()"
                    [isLoading]="isLoading()"
                    [allStandardsLength]="allStandards().length"
                    [selectedIds]="selectedIds()"
                    [quickUploadStdId]="quickUploadStdId()"
                    [canEditStandards]="auth.canEditStandards()"
                    [currentUser]="auth.currentUser()"
                    (toggleSelection)="toggleSelection($event)"
                    (toggleAll)="toggleAll()"
                    (navigateToDetail)="navigateToDetail($event)"
                    (copyText)="copyText($event.text, $event.event)"
                    (openCoaPreview)="openCoaPreview($event.url, $event.event)"
                    (triggerQuickDriveUpload)="triggerQuickDriveUpload($event.std, $event.event)"
                    (autoZeroStock)="autoZeroStock($event)"
                    (openAssignModal)="openAssignModal($event.std, $event.isAssign)"
                    (goToReturn)="goToReturn($event)"
                    (openPurchaseRequestModal)="openPurchaseRequestModal($event)"
                    (openPrintModal)="openPrintModal($event)"
                    (viewHistory)="viewHistory($event)"
                    (openEditModal)="openEditModal($event)">
                 </app-standards-list-view>
             } @else {
                 <app-standards-grid-view
                    [items]="visibleItems()"
                    [isLoading]="isLoading()"
                    [allStandardsLength]="allStandards().length"
                    [selectedIds]="selectedIds()"
                    [quickUploadStdId]="quickUploadStdId()"
                    [canEditStandards]="auth.canEditStandards()"
                    [currentUser]="auth.currentUser()"
                    (toggleSelection)="toggleSelection($event)"
                    (navigateToDetail)="navigateToDetail($event)"
                    (copyText)="copyText($event.text, $event.event)"
                    (openCoaPreview)="openCoaPreview($event.url, $event.event)"
                    (triggerQuickDriveUpload)="triggerQuickDriveUpload($event.std, $event.event)"
                    (autoZeroStock)="autoZeroStock($event)"
                    (openAssignModal)="openAssignModal($event.std, $event.isAssign)"
                    (goToReturn)="goToReturn($event)"
                    (openPurchaseRequestModal)="openPurchaseRequestModal($event)"
                    (openPrintModal)="openPrintModal($event)"
                    (viewHistory)="viewHistory($event)">
                 </app-standards-grid-view>
             }
             
             <!-- Hidden input for quick Drive upload from list/grid -->
             <input id="quickDriveInput" #quickDriveInput type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" (change)="handleQuickDriveUpload($event)">

             @if (hasMore() && !isLoading()) {
                <div class="text-center p-4">
                    <button (click)="loadMore()" class="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition active:scale-95 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-sm dark:shadow-none">
                        Xem thêm...
                    </button>
                </div>
             }
          </div>
      </div>

      <!-- ADD/EDIT MODAL -->
      <app-standards-form-modal [isOpen]="showModal()" [std]="isEditing() ? selectedStd() : null" [allStandards]="allStandards()" (closeModal)="closeModal()"></app-standards-form-modal>

      <!-- IMPORT PREVIEW MODAL -->
      <app-standards-import-data-modal [data]="importPreviewData()" [isImporting]="isImporting()" (cancel)="cancelImport()" (confirm)="confirmImport()"></app-standards-import-data-modal>

      <!-- IMPORT USAGE LOG PREVIEW MODAL -->
      <app-standards-import-usage-modal [data]="importUsageLogPreviewData()" [validCount]="validUsageLogsCount()" [duplicateCount]="duplicateUsageLogsCount()" [errorCount]="errorUsageLogsCount()" [isImporting]="isImporting()" (cancel)="cancelImport()" (confirm)="confirmUsageLogImport()"></app-standards-import-usage-modal>

      <!-- BULK COA MODAL -->
      <app-standards-bulk-coa-modal [isOpen]="showBulkCoaModal()" [items]="bulkCoaItems()" [allStandards]="allStandards()" [isUploading]="isBulkUploading()" [uploadComplete]="bulkUploadComplete()" (cancel)="cancelBulkCoa()" (confirm)="confirmBulkCoaUpload()"></app-standards-bulk-coa-modal>

      <app-standards-assign-modal
          [isOpen]="showAssignModal()"
          [std]="selectedStd()"
          [isAssignMode]="isAssignMode()"
          [userList]="userList()"
          [isProcessing]="isProcessing()"
          [currentUserUid]="auth.currentUser()?.uid || ''"
          [currentUserName]="auth.currentUser()?.displayName || ''"
          (closeModal)="showAssignModal.set(false)"
          (confirm)="confirmAssign($event)">
      </app-standards-assign-modal>

      <!-- PRINT MODAL -->
      <app-standards-print-modal [isOpen]="showPrintModal()" [std]="selectedStd()" (closeModal)="showPrintModal.set(false)"></app-standards-print-modal>

      <!-- HISTORY MODAL -->
      <app-standards-history-modal [historyStd]="historyStd()" [loadingHistory]="loadingHistory()" [historyLogs]="historyLogs()" [isProcessing]="isProcessing()" (closeModal)="historyStd.set(null)" (deleteLogEvent)="deleteLog($event)"></app-standards-history-modal>

      <!-- COA PREVIEW MODAL -->
      <app-standards-coa-modal [previewUrl]="previewUrl()" [previewImgUrl]="previewImgUrl()" [previewType]="previewType()" [previewRawUrl]="previewRawUrl()" (closeModal)="closeCoaPreview()"></app-standards-coa-modal>
      <!-- PURCHASE REQUEST MODAL -->
      <app-standards-purchase-modal [isOpen]="showPurchaseRequestModal()" [selectedStd]="selectedPurchaseStd()" (closeModal)="closePurchaseRequestModal()"></app-standards-purchase-modal>


    </div>
  `
})
export class StandardsComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  auth = inject(AuthService);
  stdService = inject(StandardService);
  firebaseService = inject(FirebaseService); 
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  sanitizer: DomSanitizer = inject(DomSanitizer); 
  router = inject(Router);
  googleDriveService = inject(GoogleDriveService);
  Math = Math;
  isLoading = signal(true);
  quickUploadStdId = signal<string>(''); // Track which std is being quick-uploaded
  private quickUploadStd: ReferenceStandard | null = null;
  isImporting = signal(false);
  isProcessing = signal(false); // Hardened UX State

  // Responsive view mode: mobile (touch device) defaults to grid, desktop defaults to list
  private mobileMediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
  viewMode = signal<'list' | 'grid'>(this.mobileMediaQuery.matches ? 'grid' : 'list');
  private onMediaChange = (e: MediaQueryListEvent) => this.viewMode.set(e.matches ? 'grid' : 'list');
  searchTerm = signal('');
  sortOption = signal<string>('received_desc');
  searchSubject = new Subject<string>();

  // --- CHANGED: CLIENT-SIDE STATE ---
  allStandards = signal<ReferenceStandard[]>([]); // Holds ALL data from Firebase stream
  displayLimit = signal<number>(50); // Virtual scroll limit
  activeWidgetFilter = signal<'all' | 'expired' | 'expiring_soon' | 'low_stock'>('all');
  private snapshotUnsub?: Unsubscribe;

  // --- Purchase Requests State (Staff) ---
  showPurchaseRequestModal = signal(false);
  selectedPurchaseStd = signal<ReferenceStandard | null>(null);



  // Stats Computed
  stats = computed(() => {
      const data = this.allStandards();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;

      let expired = 0;
      let expiringSoon = 0;
      let lowStock = 0;

      data.forEach(item => {
          if ((item.current_amount / (item.initial_amount || 1)) <= 0.2) {
              lowStock++;
          }
          if (item.expiry_date) {
              const expDate = new Date(item.expiry_date).getTime();
              if (expDate < today) {
                  expired++;
              } else if (expDate <= thirtyDays) {
                  expiringSoon++;
              }
          }
      });

      return { expired, expiringSoon, lowStock, total: data.length };
  });

  // Computed: Filter -> Sort -> Slice
  filteredItems = computed(() => {
      let data = [...this.allStandards()]; // Clone array to avoid in-place mutation issues
      const term = this.searchTerm().trim().toLowerCase();
      const widgetFilter = this.activeWidgetFilter();
      
      // 1. WIDGET FILTER
      if (widgetFilter !== 'all') {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;

          data = data.filter(item => {
              if (widgetFilter === 'low_stock') {
                  return (item.current_amount / (item.initial_amount || 1)) <= 0.2;
              }
              
              if (!item.expiry_date) return false;
              const expDate = new Date(item.expiry_date).getTime();
              
              if (widgetFilter === 'expired') {
                  return expDate < today;
              }
              if (widgetFilter === 'expiring_soon') {
                  return expDate >= today && expDate <= thirtyDays;
              }
              return true;
          });
      }

      // 2. SEARCH FILTER
      if (term) {
          const normalize = (s: any) => s ? String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
          const searchTerms = term.split('+').map(t => normalize(t.trim())).filter(t => t.length > 0);
          
          data = data.filter(item => {
              // Cover ALL information of the standard by concatenating all values
              // Additionally, format YYYY-MM-DD dates as DD/MM/YYYY so user can search exactly what they see
              const searchStr = Object.values(item)
                  .filter(val => val !== null && val !== undefined && typeof val !== 'object')
                  .map(val => {
                      let str = String(val);
                      if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
                          const parts = val.split('T')[0].split('-');
                          if (parts.length === 3) str += ` ${parts[2]}/${parts[1]}/${parts[0]}`;
                      }
                      return normalize(str);
                  })
                  .join(' ');
                  
              return searchTerms.every(t => searchStr.includes(t));
          });

          // Inject search score if search term is active
          data = data.map(item => ({
              ...item,
              search_score: calculateSimilarityScore(term, item)
          }));
      }

      // 3. SORT
      const option = this.sortOption();
      return data.sort((a, b) => {
          // If searching, prioritize search score over fallback sort method
          if (term && (b as any).search_score !== (a as any).search_score) {
              return ((b as any).search_score || 0) - ((a as any).search_score || 0);
          }

          switch (option) {
              case 'name_asc': return (a.name || '').localeCompare(b.name || '');
              case 'name_desc': return (b.name || '').localeCompare(a.name || '');
              case 'received_desc': return (b.received_date || '').localeCompare(a.received_date || '');
              case 'expiry_asc': return (a.expiry_date || '9999').localeCompare(b.expiry_date || '9999');
              case 'expiry_desc': return (b.expiry_date || '').localeCompare(a.expiry_date || '');
              case 'updated_desc': 
                  const ta = (a.lastUpdated?.seconds || 0);
                  const tb = (b.lastUpdated?.seconds || 0);
                  return tb - ta;
              default: return (b.received_date || '').localeCompare(a.received_date || '');
          }
      });
  });

  // Display subset for DOM performance
  visibleItems = computed(() => {
      return this.filteredItems().slice(0, this.displayLimit());
  });

  hasMore = computed(() => this.visibleItems().length < this.filteredItems().length);

  selectedIds = signal<Set<string>>(new Set());

  // Import Preview State
  importPreviewData = signal<ImportPreviewItem[]>([]);
  importUsageLogPreviewData = signal<ImportUsageLogPreviewItem[]>([]);
  validUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => i.isValid && !i.isDuplicate).length);
  duplicateUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => i.isDuplicate).length);
  errorUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => !i.isValid && !i.isDuplicate).length);

  selectedStd = signal<ReferenceStandard | null>(null);

  historyStd = signal<ReferenceStandard | null>(null);
  historyLogs = signal<UsageLog[]>([]);
  loadingHistory = signal(false);
  
  showModal = signal(false);
  isEditing = signal(false);
  
  showAssignModal = signal(false);
  isAssignMode = signal(true);
  userList = signal<UserProfile[]>([]);
  
  showPrintModal = signal(false);
    
  previewUrl = signal<SafeResourceUrl | null>(null);
  previewImgUrl = signal<string>('');
  previewType = signal<'iframe' | 'image'>('iframe');
  previewRawUrl = signal<string>('');

  // Bulk CoA Upload State
  bulkCoaItems = signal<CoaMatchItem[]>([]);
  showBulkCoaModal = signal(false);
  isBulkUploading = signal(false);
  bulkUploadComplete = signal(false);



  formatNum = formatNum;

  constructor() {
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
          this.searchTerm.set(term); 
          // Reset pagination on search
          this.displayLimit.set(50);
      });
  }

  ngOnInit() { 
      this.isLoading.set(true);
      // Pre-load Google Drive SDK script in background so when user interacts, we don't block for network request
      this.googleDriveService.ensureInitialized().catch(e => console.warn('GIS preload deferred:', e));
      // Reactive view mode listener (updates on window resize / device rotation)
      this.mobileMediaQuery.addEventListener('change', this.onMediaChange);
      // Setup Real-time Listener (Load All)
      this.stdService.loadStandardsWithDeltaSync().then((items) => {
          this.allStandards.set(items);
          this.isLoading.set(false);
          
          this.snapshotUnsub = this.stdService.startRealtimeDeltaListener(() => {
              this.allStandards.set([...this.stdService.getAllStandardsFromCache()]);
          });
      }).catch((e) => {
          this.isLoading.set(false);
          this.toast.show('Lỗi tải dữ liệu: ' + e.message, 'error');
      });
  }

  ngOnDestroy() { 
      this.searchSubject.complete(); 
      if (this.snapshotUnsub) this.snapshotUnsub();
      this.mobileMediaQuery.removeEventListener('change', this.onMediaChange);
  }

  // --- Purchase Requests Logic (Staff) ---
  openPurchaseRequestModal(std: ReferenceStandard) {
      if (this.isProcessing()) return;
      this.selectedPurchaseStd.set(std);
      this.showPurchaseRequestModal.set(true);
  }

  closePurchaseRequestModal() {
      this.showPurchaseRequestModal.set(false);
      this.selectedPurchaseStd.set(null);
  }


  onInternalIdChange(event: any) {
      // Logic removed as per user request (Internal ID is manual, Location is based on Storage Condition)
  }

  toggleSelection(id: string) {
      this.selectedIds.update(set => {
          const newSet = new Set(set);
          if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
          return newSet;
      });
  }

  isAllSelected() { return this.visibleItems().length > 0 && this.visibleItems().every(i => this.selectedIds().has(i.id)); }
  toggleAll() {
      if (this.isAllSelected()) this.selectedIds.set(new Set());
      else this.selectedIds.set(new Set(this.visibleItems().map(i => i.id)));
  }

  refreshData() {
      // Just reset the view limit, data is live synced
      this.displayLimit.set(50);
  }

  loadMore() {
      // Increase visible limit
      this.displayLimit.update(l => l + 50);
  }

  onSearchInput(val: string) { this.searchSubject.next(val); }
  onSortChange(val: string) { this.sortOption.set(val); }

  openAddModal() { 
      this.isEditing.set(false); 
      this.selectedStd.set(null);
      this.showModal.set(true); 
  }
  
  openEditModal(std: ReferenceStandard) { 
      if (!this.auth.canEditStandards()) return; 
      this.selectedStd.set(std);
      this.isEditing.set(true); 
      this.showModal.set(true); 
  }
  
  closeModal() { 
      if (!this.isProcessing()) {
          this.showModal.set(false); 
      }
  }
  

  async autoZeroAllSdhet() {
      const targets = this.allStandards().filter(s => (s.id === 'SDHET' || s.internal_id === 'SDHET') && s.current_amount > 0);
      if (targets.length === 0) {
          this.toast.show('Không có chuẩn SDHET nào cần trừ kho.', 'info');
          return;
      }

      this.isProcessing.set(true);
      try {
          for (const std of targets) {
              if (await this.confirmationService.confirm({ message: `Bạn có muốn tự động xuất toàn bộ tồn kho (${std.current_amount} ${std.unit}) của chuẩn [${std.name} - Lô: ${std.lot_number || 'N/A'}] với lý do KIỂM KHO?`, confirmText: 'Trừ kho', cancelText: 'Bỏ qua' })) {
                  const log: UsageLog = {
                      id: '',
                      date: new Date().toISOString().split('T')[0],
                      timestamp: Date.now(),
                      user: 'HỆ THỐNG',
                      amount_used: std.current_amount,
                      unit: std.unit || 'mg',
                      purpose: 'KIỂM KHO'
                  };
                  await this.stdService.recordUsage(std.id!, log);
                  this.toast.show(`Đã trừ kho: ${std.name}`, 'success');
              }
          }
          this.toast.show('Đã duyệt xong danh sách SDHET.', 'success');
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async autoZeroStock(std: ReferenceStandard) {
      if (this.isProcessing() || std.current_amount <= 0) return;
      if (await this.confirmationService.confirm({ message: `Bạn có chắc chắn muốn xuất toàn bộ lượng tồn kho còn lại (${std.current_amount} ${std.unit}) của chuẩn này với lý do KIỂM KHO?`, confirmText: 'Xác nhận trừ kho' })) {
          this.isProcessing.set(true);
          try {
              const log: UsageLog = {
                  id: '',
                  date: new Date().toISOString().split('T')[0],
                  timestamp: Date.now(),
                  user: 'HỆ THỐNG',
                  amount_used: std.current_amount,
                  unit: std.unit || 'mg',
                  purpose: 'KIỂM KHO'
              };
              await this.stdService.recordUsage(std.id!, log);
              this.toast.show('Đã trừ kho thành công', 'success');
          } catch(e: any) {
              this.toast.show('Lỗi trừ kho: ' + e.message, 'error');
          } finally {
              this.isProcessing.set(false);
          }
      }
  }

  // --- HARDENED: Bulk Delete ---
  async deleteSelected() {
      if (this.isProcessing()) return;
      const ids = Array.from(this.selectedIds());
      if (ids.length === 0) return;
      
      if (await this.confirmationService.confirm({ message: `Bạn có chắc muốn ẩn ${ids.length} chuẩn đã chọn khỏi danh sách?\n\n• Lịch sử sử dụng vẫn được lưu giữ đầy đủ.\n• Dữ liệu có thể khôi phục từ Thùng rác (Admin).`, confirmText: 'Xác nhận ẩn', isDangerous: true })) {
          this.isProcessing.set(true);
          try { 
              await this.stdService.deleteSelectedStandards(ids); 
              this.toast.show(`Đã ẩn ${ids.length} chuẩn. Lịch sử sử dụng vẫn được giữ lại.`, 'success'); 
              this.selectedIds.set(new Set());
          } catch(e: any) { 
              this.toast.show('Lỗi xóa: ' + e.message, 'error'); 
          } finally {
              this.isProcessing.set(false);
          }
      }
  }

  // --- NEW IMPORT LOGIC ---
  async handleFileSelect(event: any) {
     const file = event.target.files[0];
     if (!file) return;
     this.isLoading.set(true);
     try {
         const data = await this.stdService.parseExcelData(file);
         this.importPreviewData.set(data);
         this.toast.show(`Đã đọc ${data.length} dòng. Vui lòng kiểm tra ngày tháng.`);
     } catch (e: any) {
         this.toast.show('Lỗi đọc file: ' + e.message, 'error');
     } finally {
         this.isLoading.set(false);
         event.target.value = ''; // Reset input
     }
  }

  async handleUsageLogFileSelect(event: any) {
     const file = event.target.files[0];
     if (!file) return;
     this.isLoading.set(true);
     try {
         const data = await this.stdService.parseUsageLogExcelData(file);
         this.importUsageLogPreviewData.set(data);
         this.toast.show(`Đã đọc ${data.length} dòng nhật ký.`);
     } catch (e: any) {
         this.toast.show('Lỗi đọc file: ' + e.message, 'error');
     } finally {
         this.isLoading.set(false);
         event.target.value = ''; // Reset input
     }
  }

  cancelImport() {
      this.importPreviewData.set([]);
      this.importUsageLogPreviewData.set([]);
  }

  // --- HARDENED: Confirm Import ---
  async confirmImport() {
      if (this.importPreviewData().length === 0 || this.isImporting()) return;
      this.isImporting.set(true);
      try {
          await this.stdService.saveImportedData(this.importPreviewData());
          this.toast.show('Import thành công!', 'success');
          this.importPreviewData.set([]);
      } catch (e: any) {
          this.toast.show('Lỗi lưu import: ' + e.message, 'error');
      } finally {
          this.isImporting.set(false);
      }
  }

  async confirmUsageLogImport() {
      if (this.importUsageLogPreviewData().length === 0 || this.isImporting()) return;
      this.isImporting.set(true);
      try {
          await this.stdService.saveImportedUsageLogs(this.importUsageLogPreviewData());
          this.toast.show('Import nhật ký thành công!', 'success');
          this.importUsageLogPreviewData.set([]);
      } catch (e: any) {
          this.toast.show('Lỗi lưu import nhật ký: ' + e.message, 'error');
      } finally {
          this.isImporting.set(false);
      }
  }

  // --- Quick Drive Upload (from list/grid view) ---
  triggerQuickDriveUpload(std: ReferenceStandard, event: Event) {
      event.stopPropagation();
      this.quickUploadStd = std;
      // Find and click the hidden file input
      const input = document.querySelector('#quickDriveInput') as HTMLInputElement;
      if (input) {
          input.click();
          return;
      }
      // Fallback: try by ref
      const inputs = document.querySelectorAll('input[type="file"][accept]');
      const driveInput = Array.from(inputs).find(el => (el as HTMLInputElement).accept.includes('.pdf')) as HTMLInputElement;
      if (driveInput && driveInput.classList.contains('hidden')) {
          driveInput.click();
          return;
      }
      this.toast.show('Không tìm thấy input upload', 'error');
  }

  handleQuickDriveUpload(event: any) {
      const file = event.target.files[0];
      const std = this.quickUploadStd;
      if (!file || !std) {
          event.target.value = '';
          return;
      }

      // XÁC THỰC NGAY LẬP TỨC TRONG SỰ KIỆN (CHANGE) CỦA INPUT FILE ĐỂ TRÁNH BỊ CHẶN POPUP
      this.googleDriveService.authenticateSync(
          async () => {
              this.quickUploadStdId.set(std.id);
              try {
                  const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', file.name);
                  this.toast.show(`Đang upload CoA cho "${std.name}"...`);

                  // Đã có token rồi nên hàm này sẽ upload luôn mà không bị hỏi lại
                  const previewUrl = await this.googleDriveService.uploadFile(file, fileName);

                  // Tìm tất cả các chuẩn cùng Tên và Số Lô
                  const siblings = this.allStandards().filter(s => 
                      s.name?.trim().toLowerCase() === std.name?.trim().toLowerCase() && 
                      (s.lot_number || '').trim().toLowerCase() === (std.lot_number || '').trim().toLowerCase()
                  );

                  // Cập nhật URL cho tất cả
                  for (const sibling of siblings) {
                      await this.stdService.quickUpdateField(sibling.id, { certificate_ref: previewUrl });
                  }

                  if (siblings.length > 1) {
                      this.toast.show(`Upload thành công! Đã tự động áp dụng CoA cho ${siblings.length} lọ chuẩn cùng lô.`);
                  } else {
                      this.toast.show(`Upload CoA thành công! ${fileName}`);
                  }
              } catch (e: any) {
                  console.error('Quick Drive upload error:', e);
                  this.toast.show('Upload CoA lỗi: ' + (e.message || 'Không xác định'), 'error');
              } finally {
                  this.quickUploadStdId.set('');
                  this.quickUploadStd = null;
                  event.target.value = '';
              }
          },
          (err) => {
              this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
              this.quickUploadStd = null;
              event.target.value = '';
          }
      );
  }

  // --- Bulk CoA Match & Upload Logic ---
  handleBulkCoaSelect(event: any) {
     const files = event.target.files as FileList;
     if (!files || files.length === 0) return;

     const newItems: CoaMatchItem[] = [];
     const standards = this.allStandards();

     for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.name.toLowerCase().match(/\.(pdf|jpeg|jpg|png|webp|bmp|doc|docx)$/)) continue;

        const nameLower = file.name.toLowerCase();
        
        // Match logic: Generate suggested standards sorted by global similarity score
        const scoredStandards = standards.map(s => {
            let score = calculateSimilarityScore(nameLower, s);
            return { std: s, score };
        });

        // Top ones first, fallback to alphabetical on tie
        scoredStandards.sort((a, b) => b.score - a.score || (a.std.name || '').localeCompare(b.std.name || ''));
        const suggestedStandards = scoredStandards.map(ss => ({ std: ss.std, score: ss.score }));
        
        // Define matched standard as top 1 IF the score is reasonably high enough 
        // (to avoid forcing a match when nothing is actually similar)
        let matched: ReferenceStandard | null = null;
        let matchScore = 0;
        if (scoredStandards[0] && scoredStandards[0].score >= 80) { // arbitrary threshold for confident auto-match
            matched = scoredStandards[0].std;
            matchScore = scoredStandards[0].score;
        }

        newItems.push({
            file,
            fileName: file.name,
            matchedStandard: matched,
            matchScore: matchScore,
            suggestedStandards: suggestedStandards, // Feed sorted array to dropdown
            status: 'pending'
        });
     }
     
     if (newItems.length > 0) {
         this.bulkCoaItems.set(newItems);
         this.showBulkCoaModal.set(true);
         this.bulkUploadComplete.set(false);
     } else {
         this.toast.show('Không tìm thấy file tài liệu hợp lệ trong thư mục/số file đã chọn (yêu cầu .pdf, .jpg, v.v.)', 'error');
     }
     event.target.value = '';
  }

  cancelBulkCoa() {
      if (this.isBulkUploading()) return;
      this.showBulkCoaModal.set(false);
      this.bulkCoaItems.set([]);
  }

  // Xóa hàm triggerBulkUpload vì không cần nữa

  async confirmBulkCoaUpload() {
      let items = this.bulkCoaItems();
      const toUpload = items.filter(i => i.matchedStandard && i.status !== 'success');
      if (toUpload.length === 0 || this.isBulkUploading()) return;

      // NÚT "XÁC NHẬN UPLOAD" TRONG MODAL SẼ KÍCH HOẠT HÀM NÀY, TỨC LÀ MỘT USER GESTURE.
      this.googleDriveService.authenticateSync(
          async () => {
              this.isBulkUploading.set(true);
              this.bulkUploadComplete.set(false);

              try {
                  for (const item of toUpload) {
                      item.status = 'uploading';
                      this.bulkCoaItems.set([...items]); // Trigger UI update
                      
                      const std = item.matchedStandard!;
                      const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', item.file.name);
                      
                      try {
                          const previewUrl = await this.googleDriveService.uploadFile(item.file, fileName);
                          
                          // Tìm tất cả các chuẩn cùng Tên và Số Lô (1-to-N matching)
                          const siblings = this.allStandards().filter(s => 
                              s.name?.trim().toLowerCase() === std.name?.trim().toLowerCase() && 
                              (s.lot_number || '').trim().toLowerCase() === (std.lot_number || '').trim().toLowerCase()
                          );

                          // Cập nhật URL cho tất cả các lọ chuẩn đó
                          for (const sibling of siblings) {
                              await this.stdService.quickUpdateField(sibling.id, { certificate_ref: previewUrl });
                          }

                          item.status = 'success';
                      } catch(e: any) {
                          item.status = 'error';
                          item.uploadError = e.message || 'Lỗi kết nối';
                      }
                      this.bulkCoaItems.set([...items]); // Update progress for this file
                  }
              } finally {
                  this.isBulkUploading.set(false);
                  this.bulkUploadComplete.set(true);
                  this.toast.show('Hoàn tất quá trình tải lên CoA hàng loạt', 'success');
              }
          },
          (err) => {
              this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
          }
      );
  }

  // --- Helpers ---


  copyText(text: string | undefined, event: Event) {
      event.stopPropagation();
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => this.toast.show('Đã copy: ' + text));
  }

  goToReturn(std: ReferenceStandard) {
      if (!std.current_request_id) {
          this.toast.show('Không tìm thấy yêu cầu mượn chuẩn này', 'error');
          return;
      }
      this.toast.show('Chuyển đến trang Yêu cầu để trả chuẩn');
      this.router.navigate(['/standard-requests']);
  }

   async openAssignModal(std: ReferenceStandard, isAssign = true) {
      if (this.isProcessing()) return;
      this.selectedStd.set(std);
      this.isAssignMode.set(isAssign);
      
      this.showAssignModal.set(true);
      
      if (isAssign && this.userList().length === 0) {
          try {
              const users = await this.firebaseService.getAllUsers();
              this.userList.set(users);
          } catch (error) {
              console.error('Error fetching users:', error);
          }
      }
  }

  async confirmAssign(data: {userId: string, userName: string, purpose: string, expectedDate: string, expectedAmount: number | null}) {
      const std = this.selectedStd();
      
      if (!std || !data.userId || !data.purpose) {
          this.toast.show('Vui lòng điền đầy đủ thông tin bắt buộc (*)', 'error');
          return;
      }

      this.isProcessing.set(true);
      try {
          const request: StandardRequest = {
              standardId: std.id!,
              standardName: std.name,
              lotNumber: std.lot_number,
              requestedBy: data.userId,
              requestedByName: data.userName,
              requestDate: Date.now(),
              purpose: data.purpose.trim(),
              expectedReturnDate: data.expectedDate ? new Date(data.expectedDate).getTime() : null,
              expectedAmount: data.expectedAmount || 0,
              status: 'PENDING_APPROVAL',
              totalAmountUsed: 0
          };

          // If it's "Assign Mode", it implies an admin is giving it to someone, 
          // but we still follow the request workflow for tracking.
          await this.stdService.createRequest(request, this.isAssignMode());
          
          if (this.isAssignMode()) {
              // Automatically dispense if assigning directly
              await this.stdService.dispenseStandard(request.id!, std.id!, this.auth.currentUser()?.uid || '', this.auth.currentUser()?.displayName || 'QTV', true);
              this.toast.show('Đã gán chuẩn thành công', 'success');
          } else {
              this.toast.show('Đã gửi yêu cầu mượn chuẩn', 'success');
          }
          
          this.showAssignModal.set(false);
      } catch (error: any) {
          this.toast.show(error.message || 'Lỗi khi xử lý', 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  openPrintModal(std: ReferenceStandard) {
      this.selectedStd.set(std);
      this.showPrintModal.set(true);
  }





  getQrCodeUrl(std: ReferenceStandard | null): string {
      if (!std) return '';
      const baseUrl = window.location.origin;
      return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(baseUrl + '/standards/' + std.id)}`;
  }

  navigateToDetail(std: ReferenceStandard) {
      this.router.navigate(['/standards', std.id]);
  }




  async viewHistory(std: ReferenceStandard) { 
      this.historyStd.set(std); 
      this.loadingHistory.set(true); 
      try { 
          const logs = await this.stdService.getUsageHistory(std.id); 
          this.historyLogs.set(logs); 
      } finally { 
          this.loadingHistory.set(false); 
      } 
  }

  async deleteLog(log: UsageLog) {
      if (this.isProcessing()) return;
      if (!this.historyStd() || !log.id) return;
      
      if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
          this.isProcessing.set(true);
          try { 
              await this.stdService.deleteUsageLog(this.historyStd()!.id, log.id); 
              this.toast.show('Đã xóa', 'success'); 
              await this.viewHistory(this.historyStd()!); 
          } catch (e: any) { 
              this.toast.show('Lỗi: ' + e.message, 'error'); 
          } finally {
              this.isProcessing.set(false);
          }
      }
  }

  openCoaPreview(url: string, event: Event) {
      event.stopPropagation(); 
      if (!url) return; 
      this.previewRawUrl.set(url);
      const cleanUrl = url.split('?')[0].toLowerCase();
      const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(cleanUrl);
      if (isImage) { 
          this.previewType.set('image'); 
          this.previewImgUrl.set(url); 
      } else { 
          this.previewType.set('iframe'); 
          this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url)); 
      }
  }

  closeCoaPreview() { 
      this.previewUrl.set(null); 
      this.previewImgUrl.set(''); 
  }
}
