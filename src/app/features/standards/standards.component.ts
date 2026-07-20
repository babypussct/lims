import { Component, inject, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { StandardService } from './standard.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ReferenceStandard, UsageLog, ImportPreviewItem, ImportUsageLogPreviewItem, StandardRequest, PurchaseRequest, CoaMatchItem } from '../../core/models/standard.model';
import { formatNum, calculateSimilarityScore } from '../../shared/utils/utils';
import { getSameStandardLots, isFefoCandidate, sortStandardsByFefo } from '../../shared/utils/standard-fefo';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { PrintService } from '../../core/services/print.service';
import { ProgressService } from '../../core/services/progress.service';
import { Unsubscribe } from 'firebase/firestore';

import { StandardsFormModalComponent } from './components/standards-form-modal.component';
import { StandardsPrintModalComponent } from './components/standards-print-modal.component';
import { StandardsImportDataModalComponent, StandardsImportUsageModalComponent } from './components/standards-import-modal.component';
import { StandardsHistoryModalComponent } from './components/standards-history-modal.component';
import { StandardsPurchaseModalComponent } from './components/standards-purchase-modal.component';
import { StandardsBulkCoaModalComponent } from './components/standards-bulk-coa-modal.component';
import { StandardsToolbarComponent } from './components/standards-toolbar.component';
import { StandardsFilterComponent } from './components/standards-filter.component';
import { StandardsListViewComponent } from './components/standards-list-view.component';
import { StandardsGridViewComponent } from './components/standards-grid-view.component';
import { StandardsAssignModalComponent } from './components/standards-assign-modal.component';
import { ExportModalComponent } from '../../shared/components/export-modal/export-modal.component';
@Component({
  selector: 'app-standards',
  standalone: true,
  imports: [CommonModule, FormsModule, StandardsFormModalComponent, StandardsPrintModalComponent, StandardsImportDataModalComponent, StandardsImportUsageModalComponent, StandardsHistoryModalComponent, StandardsPurchaseModalComponent, StandardsBulkCoaModalComponent, StandardsToolbarComponent, StandardsFilterComponent, StandardsListViewComponent, StandardsGridViewComponent, StandardsAssignModalComponent, ExportModalComponent],
  providers: [DatePipe],
  templateUrl: './standards.component.html'
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
  printService = inject(PrintService);
  progressService = inject(ProgressService);
  datePipe = inject(DatePipe);
  Math = Math;
  isLoading = signal(true);
  quickUploadStdId = signal<string>(''); // Track which std is being quick-uploaded
  private quickUploadStd: ReferenceStandard | null = null;
  isImporting = signal(false);
  isProcessing = signal(false); // Hardened UX State

  // Responsive view mode: mobile (touch device) defaults to grid, desktop defaults to list
  private mobileMediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
  viewMode = signal<'list' | 'grid'>(this.stdService.listState.viewMode || (this.mobileMediaQuery.matches ? 'grid' : 'list'));
  private onMediaChange = (e: MediaQueryListEvent) => this.viewMode.set(e.matches ? 'grid' : 'list');
  searchTerm = signal(this.stdService.listState.searchTerm || '');
  sortOption = signal<string>(this.stdService.listState.sortOption || 'received_desc');
  searchSubject = new Subject<string>();

  // --- CHANGED: CLIENT-SIDE STATE ---
  allStandards = signal<ReferenceStandard[]>([]); // Holds ALL data from Firebase stream
  displayLimit = signal<number>(50); // Virtual scroll limit
  activeWidgetFilter = signal<'all' | 'expired' | 'expiring_soon' | 'expiring_3months' | 'low_stock'>('all');
  private snapshotUnsub?: Unsubscribe;

  // --- Export State ---
  showExportModal = signal(false);
  exportType = signal<'full' | 'expiry'>('full');
  exportDataSource = signal<'selected' | 'filtered'>('filtered');
  isExporting = signal(false);
  exportCompleted = signal(false);

  // --- Purchase Requests State (Staff) ---
  showPurchaseRequestModal = signal(false);
  selectedPurchaseStd = signal<ReferenceStandard | null>(null);

  // Stats Computed
  stats = computed(() => {
      const data = this.allStandards();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;
      // Logic 3 tháng: lấy tháng hiện tại + 3 tháng, bất kể ngày
      const threeMonthsEnd = new Date(now.getFullYear(), now.getMonth() + 4, 1).getTime(); // exclusive
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

      let expired = 0;
      let expiringSoon = 0;
      let expiring3Months = 0;
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
              if (expDate >= thisMonthStart && expDate < threeMonthsEnd) {
                  expiring3Months++;
              }
          }
      });

      return { expired, expiringSoon, expiring3Months, lowStock, total: data.length };
  });

  filteredItems = computed(() => {
      let data = this.allStandards().filter(item => !item._isDeleted && (item.status as any) !== 'DELETED');
      const term = this.searchTerm().trim().toLowerCase();
      const widgetFilter = this.activeWidgetFilter();
      
      // 1. WIDGET FILTER
      if (widgetFilter !== 'all') {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;
          const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
          const threeMonthsEnd = new Date(now.getFullYear(), now.getMonth() + 4, 1).getTime(); // exclusive

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
              if (widgetFilter === 'expiring_3months') {
                  return expDate >= thisMonthStart && expDate < threeMonthsEnd;
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

  /** Danh sách lọ cùng tên với selectedStd(), đã sắp xếp FEFO. Dùng cho Assign Modal. */
  sameNameAsSelected = computed(() => {
    const sel = this.selectedStd();
    if (!sel) return [];
    return sortStandardsByFefo(getSameStandardLots(sel, this.allStandards(), false));
  });

  /** Dữ liệu thực tế sẽ xuất: các chuẩn đã chọn (nếu có) hoặc toàn bộ filteredItems */
  exportItems = computed(() => {
    if (this.exportDataSource() === 'selected' && this.selectedIds().size > 0) {
      return this.filteredItems().filter(item => this.selectedIds().has(item.id));
    }
    return this.filteredItems();
  });

  /** Mô tả ngắn bộ lọc đang áp dụng — hiển thị trong modal header */
  exportSubtitle = computed(() => {
    const src = this.exportDataSource();
    const cnt = src === 'selected' ? this.selectedIds().size : this.filteredItems().length;
    const filter = this.activeWidgetFilter();
    const search = this.searchTerm();
    const filterLabels: Record<string, string> = {
      expired: 'Đã hết hạn',
      expiring_soon: 'Sắp hết hạn 30 ngày',
      expiring_3months: 'Sắp hết hạn 3 tháng tới',
      low_stock: 'Tồn kho thấp',
    };
    let desc = src === 'selected' ? `${cnt} chuẩn đã chọn` : `${cnt} kết quả`;
    if (filter !== 'all') desc += ` · Lọc: ${filterLabels[filter] || filter}`;
    if (search) desc += ` · Tìm: “${search}”`;
    return desc;
  });

  // Import Preview State
  importPreviewData = signal<ImportPreviewItem[]>([]);
  importUsageLogPreviewData = signal<ImportUsageLogPreviewItem[]>([]);
  validUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => i.isValid && !i.isDuplicate).length);
  duplicateUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => i.isDuplicate).length);
  errorUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => !i.isValid && !i.isDuplicate).length);

  selectedStd = signal<ReferenceStandard | null>(null);
  selectedStandardsToPrint = signal<ReferenceStandard[]>([]);

  historyStd = signal<ReferenceStandard | null>(null);
  historyLogs = signal<UsageLog[]>([]);
  loadingHistory = signal(false);
  
  showModal = signal(false);
  isEditing = signal(false);
  
  showAssignModal = signal(false);
  isAssignMode = signal(true);
  userList = signal<UserProfile[]>([]);
  
  showPrintModal = signal(false);

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

      // Sync state to service so it persists when navigating away
      effect(() => {
          this.stdService.listState.searchTerm = this.searchTerm();
          this.stdService.listState.sortOption = this.sortOption();
          this.stdService.listState.viewMode = this.viewMode();
      });
  }

  ngOnInit() { 
      this.isLoading.set(true);
      // Pre-load Google Drive SDK script in background so when user interacts, we don't block for network request
      this.googleDriveService.ensureInitialized().catch(e => console.warn('GIS preload deferred:', e));
      // Reactive view mode listener (updates on window resize / device rotation)
      this.mobileMediaQuery.addEventListener('change', this.onMediaChange);
      // Setup Real-time Listener (Load All)
      const cached = this.stdService.getAllStandardsFromCache();
      if (cached && cached.length > 0) {
          this.allStandards.set(cached);
      }
      
      this.snapshotUnsub = this.stdService.listenToStandards((items) => {
          this.allStandards.set([...items]);
          this.isLoading.set(false);
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

  // --- HARDENED: Bulk Delete ---
  async deleteSelected() {
      if (this.isProcessing()) return;
      const ids = Array.from(this.selectedIds());
      if (ids.length === 0) return;
      const active = this.allStandards().filter(standard => ids.includes(standard.id) && (
          standard.status === 'IN_USE' || standard.current_holder || standard.current_holder_uid ||
          standard.current_request_id || standard.has_pending_request
      ));
      if (active.length) {
          this.toast.show(`Không thể ẩn ${active.length} lô đang mượn/trả hoặc chờ duyệt.`, 'error');
          return;
      }
      
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
      
      if (this.googleDriveService.hasValidToken) {
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
      } else {
          // XÁC THỰC TRƯỚC: Nếu chưa có token, xác thực xong yêu cầu user nhấn lại để có user activation
          this.googleDriveService.authenticateSync(
              () => {
                  this.toast.show('Đã kết nối Google Drive! Vui lòng nhấn lại nút Upload để chọn file.', 'success');
              },
              (err) => {
                  this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
                  this.quickUploadStd = null;
              }
          );
      }
  }

  async handleQuickDriveUpload(event: any) {
      const file = event.target.files[0];
      const std = this.quickUploadStd;
      if (!file || !std) {
          event.target.value = '';
          return;
      }

      this.quickUploadStdId.set(std.id);
      try {
          const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', file.name);
          this.toast.show(`Đang upload CoA cho "${std.name}"...`);

          // Đã có token rồi nên hàm này sẽ upload luôn mà không bị hỏi lại
          const previewUrl = await this.googleDriveService.uploadFile(file, fileName);

          // Tìm tất cả các chuẩn cùng Tên và Số Lô
          const lot = (std.lot_number || '').trim().toLowerCase();
          const siblings = lot
              ? this.allStandards().filter(s =>
                  s.name?.trim().toLowerCase() === std.name?.trim().toLowerCase() &&
                  (s.lot_number || '').trim().toLowerCase() === lot &&
                  !s._isDeleted
              )
              : [std];
          await this.stdService.completeCoaUpload(siblings.length ? siblings : [std], previewUrl);

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
  }

  // --- Bulk CoA Match & Upload Logic ---
  handleBulkCoaSelect(event: any) {
     const files = event.target.files as FileList;
     if (!files || files.length === 0) return;

     const newItems: CoaMatchItem[] = [];
     const standards = this.allStandards();

     for (const file of Array.from(files)) {
        if (!file.name.toLowerCase().match(/\.(pdf|jpeg|jpg|png|webp|bmp|doc|docx)$/)) continue;

        const nameLower = file.name.toLowerCase();
        
        // Match logic: Generate suggested standards sorted by global similarity score
        const scoredStandards = standards.map(s => {
            const score = calculateSimilarityScore(nameLower, s);
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
      const items = this.bulkCoaItems();
      const toUpload = items.filter(i => i.matchedStandard && i.status !== 'success');
      if (toUpload.length === 0 || this.isBulkUploading()) return;
      const targetKeys = toUpload.map(item => {
          const standard = item.matchedStandard!;
          const lot = (standard.lot_number || '').trim().toLowerCase();
          return lot ? `${standard.name.trim().toLowerCase()}|${lot}` : standard.id;
      });
      if (new Set(targetKeys).size !== targetKeys.length) {
          this.toast.show('Có nhiều file cùng ghép vào một chuẩn/lô. Vui lòng chỉ giữ một file cho mỗi lô.', 'error');
          return;
      }

      // NÚT "XÁC NHẬN UPLOAD" TRONG MODAL SẼ KÍCH HOẠT HÀM NÀY, TỨC LÀ MỘT USER GESTURE.
      this.googleDriveService.authenticateSync(
          async () => {
              this.isBulkUploading.set(true);
              this.bulkUploadComplete.set(false);
              
              this.progressService.start('Đang tải lên CoA hàng loạt', 'Vui lòng không đóng trình duyệt', toUpload.length);
              let processed = 0;

              try {
                  for (const item of toUpload) {
                      processed++;
                      this.progressService.update(processed, `Đang xử lý tải lên cho chuẩn ${item.matchedStandard?.name}`);
                      
                      item.status = 'uploading';
                      this.bulkCoaItems.set([...items]); // Trigger UI update
                      
                      const std = item.matchedStandard!;
                      const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', item.file.name);
                      
                      try {
                          const previewUrl = await this.googleDriveService.uploadFile(item.file, fileName);
                          
                          // Tìm tất cả các chuẩn cùng Tên và Số Lô (1-to-N matching)
                          const lot = (std.lot_number || '').trim().toLowerCase();
                          const siblings = lot
                              ? this.allStandards().filter(s =>
                                  s.name?.trim().toLowerCase() === std.name?.trim().toLowerCase() &&
                                  (s.lot_number || '').trim().toLowerCase() === lot &&
                                  !s._isDeleted
                              )
                              : [std];
                          await this.stdService.completeCoaUpload(siblings.length ? siblings : [std], previewUrl);

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
                  const successCount = items.filter(item => item.status === 'success').length;
                  const errorCount = items.filter(item => item.status === 'error').length;
                  this.toast.show(
                      errorCount > 0
                          ? `Hoàn tất: ${successCount} thành công, ${errorCount} lỗi.`
                          : `Hoàn tất ${successCount} file CoA.`,
                      errorCount > 0 ? 'error' : 'success'
                  );
                  this.progressService.complete();
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

  async confirmAssign(data: {userId: string, userName: string, purpose: string, expectedAmount: number | null}) {
      const std = this.selectedStd();
      
      if (!std || !data.userId || !data.purpose) {
          this.toast.show('Vui lòng điền đầy đủ thông tin bắt buộc (*)', 'error');
          return;
      }
      if (!isFefoCandidate(std)) {
          this.toast.show('Lô chuẩn không còn sẵn sàng để cấp. Vui lòng tải lại và chọn lô khác.', 'error');
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
      this.selectedStandardsToPrint.set([]);
      this.showPrintModal.set(true);
  }

  openBatchPrintModal() {
      const ids = Array.from(this.selectedIds());
      const list = this.allStandards().filter(s => s.id && ids.includes(s.id));
      if (list.length === 0) return;
      this.selectedStd.set(null);
      this.selectedStandardsToPrint.set(list);
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
      this.printService.openCoaPreview(url, 'Chứng chỉ chất lượng (CoA)');
  }

  // ─── EXPORT EXCEL ───────────────────────────────────────────

  openExportModal() {
      // Nếu đang có chuẩn được tick, ưu tiên xuất đã chọn; ngược lại xuất theo lọc
      this.exportDataSource.set(this.selectedIds().size > 0 ? 'selected' : 'filtered');
      this.exportType.set('full');
      this.exportCompleted.set(false);
      this.showExportModal.set(true);
  }

  async runExport() {
      const items = this.exportItems();
      if (items.length === 0) {
          this.toast.show('Không có dữ liệu để xuất.', 'info');
          return;
      }
      this.isExporting.set(true);
      this.exportCompleted.set(false);

      try {
          const XLSX = await import('xlsx');
          const wb = XLSX.utils.book_new();

          // ─── Sheet 1: Dữ liệu chi tiết ───
          let detailData: Record<string, any>[];

          if (this.exportType() === 'expiry') {
              const now = new Date();
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
              detailData = items
                  .filter(item => item.expiry_date)
                  .map((item, i) => {
                      const expMs = new Date(item.expiry_date!).getTime();
                      const daysLeft = Math.ceil((expMs - today) / 86400000);
                      const expiryStatus = daysLeft < 0 ? 'Đã hết hạn'
                          : daysLeft <= 30 ? 'Sắp hết hạn (30 ngày)'
                          : daysLeft <= 90 ? 'Sắp hết hạn (3 tháng)'
                          : 'Còn hạn';
                      return {
                          'STT': i + 1,
                          'Mã quản lý': item.internal_id || '',
                          'Tên chuẩn': item.name,
                          'Số lô': item.lot_number || '',
                          'Hãng sản xuất': item.manufacturer || '',
                          'Mã Catalog': item.product_code || '',
                          'Lượng còn lại': item.current_amount,
                          'Đơn vị': item.unit,
                          'Hạn sử dụng': item.expiry_date || '',
                          'Còn lại (ngày)': daysLeft,
                          'Trạng thái hạn': expiryStatus,
                          'Vị trí lưu trữ': item.location || '',
                          'Điều kiện bảo quản': item.storage_condition || '',
                      };
                  });
          } else {
              detailData = items.map((item, i) => ({
                  'STT': i + 1,
                  'Mã quản lý': item.internal_id || '',
                  'Tên chuẩn': item.name,
                  'Tên hóa học': item.chemical_name || '',
                  'Số CAS': item.cas_number || '',
                  'Mã Catalog': item.product_code || '',
                  'Số lô': item.lot_number || '',
                  'Độ tinh khiết': item.purity || '',
                  'Hãng sản xuất': item.manufacturer || '',
                  'Quy cách': item.pack_size || '',
                  'Lượng ban đầu': item.initial_amount,
                  'Lượng còn lại': item.current_amount,
                  'Đơn vị': item.unit,
                  'Ngày nhận': item.received_date || '',
                  'Hạn sử dụng': item.expiry_date || '',
                  'Ngày mở nắp': item.date_opened || '',
                  'Vị trí lưu trữ': item.location || '',
                  'Điều kiện bảo quản': item.storage_condition || '',
                  'Trạng thái': item.status || '',
                  'Link CoA': item.certificate_ref || '',
                  'Số hợp đồng': item.contract_ref || '',
              }));
          }

          if (detailData.length === 0) {
              this.toast.show('Không có dữ liệu phù hợp để xuất (ví dụ: xuất Báo cáo hạn nhưng không có chuẩn nào có hạn dùng).', 'info');
              return;
          }

          const ws1 = XLSX.utils.json_to_sheet(detailData);
          // Tự động căn độ rộng cột
          ws1['!cols'] = Object.keys(detailData[0]).map(key => ({
              wch: Math.max(key.length, ...detailData.map(row => String(row[key] ?? '').length)) + 2
          }));
          // Đóng băng hàng tiêu đề (để dễ đọc khi cuộn)
          (ws1 as any)['!freeze'] = { xSplit: 0, ySplit: 1 };
          XLSX.utils.book_append_sheet(wb, ws1, this.exportType() === 'expiry' ? 'Bao cao han dung' : 'Danh sach chuan');

          // ─── Sheet 2: Tổng hợp ───
          const allFiltered = this.filteredItems();
          const now2 = new Date();
          const today2 = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate()).getTime();
          const thirtyDays2 = today2 + 30 * 24 * 60 * 60 * 1000;
          const thisMonthStart2 = new Date(now2.getFullYear(), now2.getMonth(), 1).getTime();
          const threeMonthsEnd2 = new Date(now2.getFullYear(), now2.getMonth() + 4, 1).getTime();

          let sumExpired = 0, sumSoon = 0, sum3m = 0, sumLow = 0;
          allFiltered.forEach(item => {
              if ((item.current_amount / (item.initial_amount || 1)) <= 0.2) sumLow++;
              if (item.expiry_date) {
                  const d = new Date(item.expiry_date).getTime();
                  if (d < today2) sumExpired++;
                  else if (d <= thirtyDays2) sumSoon++;
                  if (d >= thisMonthStart2 && d < threeMonthsEnd2) sum3m++;
              }
          });

          const summaryData = [
              { 'Chỉ tiêu': 'Tổng số chuẩn trong danh sách lọc', 'Giá trị': allFiltered.length },
              { 'Chỉ tiêu': 'Số chuẩn xuất trong báo cáo này', 'Giá trị': detailData.length },
              { 'Chỉ tiêu': '', 'Giá trị': '' },
              { 'Chỉ tiêu': 'Đã hết hạn', 'Giá trị': sumExpired },
              { 'Chỉ tiêu': 'Sắp hết hạn (30 ngày tới)', 'Giá trị': sumSoon },
              { 'Chỉ tiêu': 'Sắp hết hạn (3 tháng tới)', 'Giá trị': sum3m },
              { 'Chỉ tiêu': 'Tồn kho thấp (≤20%)', 'Giá trị': sumLow },
              { 'Chỉ tiêu': '', 'Giá trị': '' },
              { 'Chỉ tiêu': 'Ngày xuất báo cáo', 'Giá trị': this.datePipe.transform(Date.now(), 'dd/MM/yyyy HH:mm') || '' },
              { 'Chỉ tiêu': 'Bộ lọc / Ghi chú', 'Giá trị': this.exportSubtitle() },
          ];
          const ws2 = XLSX.utils.json_to_sheet(summaryData);
          ws2['!cols'] = [{ wch: 40 }, { wch: 28 }];
          XLSX.utils.book_append_sheet(wb, ws2, 'Tong hop');

          // Ghi file
          const typeSuffix = this.exportType() === 'expiry' ? 'HanDung' : 'DanhSach';
          XLSX.writeFile(wb, `ChuanDoiChieu_${typeSuffix}_${this.datePipe.transform(Date.now(), 'yyyyMMdd_HHmm')}.xlsx`);

          this.exportCompleted.set(true);
          this.toast.show('Xuất file Excel thành công!', 'success');
      } catch (err: any) {
          console.error('Lỗi xuất Excel:', err);
          this.toast.show('Lỗi xuất file Excel: ' + (err.message || ''), 'error');
      } finally {
          this.isExporting.set(false);
      }
  }
}
