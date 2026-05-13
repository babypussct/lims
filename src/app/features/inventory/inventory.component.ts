
import { Component, inject, signal, computed, effect, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { InventoryService } from './inventory.service';
import { InventoryItem } from '../../core/models/inventory.model';
import { Sop } from '../../core/models/sop.model';
import { Recipe } from '../../core/models/recipe.model'; // Import Recipe
import { CalculatorService } from '../../core/services/calculator.service';
import { RecipeService } from '../recipes/recipe.service'; // Import Service
import { cleanName, formatNum, UNIT_OPTIONS, generateSlug, formatSmartUnit, parseQuantityInput } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { AuthService } from '../../core/services/auth.service';
import { LabelPrintComponent } from '../labels/label-print.component';
import { PubchemService, GHS_DICTIONARY } from '../../core/services/pubchem.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, LabelPrintComponent],
  templateUrl: './inventory.component.html',
  styles: [`
    @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
  `]
})
export class InventoryComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  inventoryService = inject(InventoryService);
  recipeService = inject(RecipeService); // Inject RecipeService
  auth = inject(AuthService); 
  pubchem = inject(PubchemService);
  toast = inject(ToastService);
  calcService = inject(CalculatorService);
  confirmationService = inject(ConfirmationService);
  route = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);

  // Added 'labels' to type definition
  activeTab = signal<'list' | 'capacity' | 'labels'>('list');
  
  // Data & Pagination (Client-side filtering for instant UX)
  allItems = this.state.inventory; 
  displayLimit = signal(20);
  isInitialLoading = computed(() => this.allItems().length === 0); 
  isProcessing = signal(false); 

  filteredItems = computed(() => {
      let items = this.allItems();
      const term = this.searchTerm().toLowerCase().trim();
      const filter = this.filterType();

      // 1. Lọc theo Phân loại
      if (filter !== 'all') {
          if (filter === 'low') {
              items = items.filter(i => i.stock <= (i.threshold || 5));
          } else {
              items = items.filter(i => i.category === filter);
          }
      }

      // 2. Lọc theo Từ khóa (Tìm trên cả Tên và ID, bỏ qua dấu tiếng Việt)
      if (term) {
          const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const normalizedTerm = removeAccents(term);
          
          items = items.filter(i => {
              const nameMatch = i.name ? removeAccents(i.name.toLowerCase()).includes(normalizedTerm) : false;
              const idMatch = i.id ? removeAccents(i.id.toLowerCase()).includes(normalizedTerm) : false;
              return nameMatch || idMatch;
          });
      }

      // 3. Sắp xếp mới nhất lên đầu
      return items.sort((a, b) => {
          const timeA = a.lastUpdated?.seconds || 0;
          const timeB = b.lastUpdated?.seconds || 0;
          return timeB - timeA;
      });
  });

  items = computed(() => this.filteredItems().slice(0, this.displayLimit()));
  hasMore = computed(() => this.displayLimit() < this.filteredItems().length);
  totalCount = computed(() => this.allItems().length);

  // Filters
  searchTerm = signal('');
  filterType = signal('all');
  searchSubject = new Subject<string>();
  
  selectedIds = signal<Set<string>>(new Set());

  // Capacity - Local Inventory Snapshot
  capacityInventoryMap = signal<Record<string, InventoryItem>>({}); 
  capacityRecipeMap = signal<Record<string, Recipe>>({}); // New Signal for Recipes
  capacityLoading = signal(false);
  selectedSopForCap = signal<Sop | null>(null);
  capacityMode = signal<'marginal' | 'standard'>('marginal');
  
  capacityResult = computed(() => { 
      const s = this.selectedSopForCap(); 
      // Use the locally fetched maps
      return s ? this.calcService.calculateCapacity(
          s, 
          this.capacityMode(), 
          this.capacityInventoryMap(), 
          this.capacityRecipeMap() // Pass Recipe Map
      ) : null; 
  });

  // Modal
  showModal = signal(false);
  isEditing = signal(false);
  oldStock = signal(0); // Theo dõi tồn kho cũ để ghi log
  form = this.fb.group({
    id: ['', Validators.required], 
    name: ['', Validators.required], 
    category: ['reagent'], 
    stock: [0, [Validators.required, Validators.min(0)]],
    unit: ['ml', Validators.required], 
    threshold: [10], 
    location: [''], 
    supplier: [''], 
    notes: [''],
    reason: ['', Validators.required],
    gtin: [''],
    lotNumber: [''],
    expiryDate: [''],
    casNumber: [''],
    englishName: [''],
    ghsWarnings: [[] as string[]],
    hazardStatements: [[] as string[]],
    precautionaryStatements: [[] as string[]]
  });
  
  unitOptions = UNIT_OPTIONS;
  isFetchingGhs = signal(false);
  get GHS_DICT() { return GHS_DICTIONARY; }
  get ghsKeys() { return Object.keys(GHS_DICTIONARY); }

  constructor() {
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => { 
          this.searchTerm.set(term); 
          this.displayLimit.set(20); // Reset trang khi tìm kiếm
      });
  }

  ngOnInit() {
      // Check query params for GS1 auto-fill
      this.route.queryParams.subscribe(params => {
          if (params['action'] === 'scan_gs1') {
              this.handleGs1Scan(params);
          } else if (params['search']) {
              this.searchTerm.set(params['search']);
          }
      });
  }

  ngOnDestroy() { this.searchSubject.complete(); }

  // --- GS1 Auto-fill Logic ---
  handleGs1Scan(params: any) {
      const gtin = params['gtin'];
      const lot = params['lot'];
      const exp = params['exp'];
      
      // Try to find existing item by GTIN
      let existingItem = null;
      if (gtin) {
          existingItem = this.allItems().find(i => i.gtin === gtin || i.ref_code === gtin);
      }
      
      if (existingItem) {
          // Found item, open edit modal
          this.openModal(existingItem);
          this.toast.show(`Tìm thấy hóa chất: ${existingItem.name}`, 'success');
      } else {
          // Not found, open create modal
          this.openModal();
          this.toast.show('Hóa chất mới, vui lòng nhập thông tin', 'info');
      }
      
      // Auto-fill form fields
      this.form.patchValue({
          gtin: gtin || '',
          lotNumber: lot || '',
          expiryDate: exp || '',
          reason: 'Nhập kho (Scan QR)'
      });
  }

  // --- TAB SWITCH LOGIC ---
  async switchTab(tab: 'list' | 'capacity' | 'labels') {
      this.activeTab.set(tab);
      if (tab === 'capacity' && Object.keys(this.capacityInventoryMap()).length === 0) {
          // Lazy load full inventory AND recipes for capacity calculation
          this.capacityLoading.set(true);
          try {
              // Fetch Both
              const [allItems, allRecipes] = await Promise.all([
                  this.inventoryService.getAllInventory(),
                  this.recipeService.getAllRecipes()
              ]);

              const invMap: Record<string, InventoryItem> = {};
              allItems.forEach(i => invMap[i.id] = i);
              this.capacityInventoryMap.set(invMap);

              const recMap: Record<string, Recipe> = {};
              allRecipes.forEach(r => recMap[r.id] = r);
              this.capacityRecipeMap.set(recMap);

          } catch(e) {
              console.error("Error loading full inventory for capacity", e);
          } finally {
              this.capacityLoading.set(false);
          }
      }
  }

  // Helpers
  formatNum = formatNum;
  formatSmartUnit = formatSmartUnit; 
  
  // Updated Icon Logic
  getIcon(cat: string | undefined): string { 
      if (!cat) return 'fa-flask';
      const c = cat.toLowerCase();
      if (c === 'solvent') return 'fa-droplet';
      if (c === 'standard') return 'fa-award'; // or fa-star
      if (c === 'reagent') return 'fa-flask';
      if (c === 'consumable') return 'fa-vial';
      if (c === 'kit') return 'fa-box-open';
      return 'fa-cube'; 
  }

  getIconGradient(item: InventoryItem): string {
      if (item.stock <= 0) return 'bg-gradient-to-tl from-red-600 to-rose-400';
      if (this.isLowStock(item)) return 'bg-gradient-to-tl from-orange-500 to-yellow-400';
      
      const c = (item.category || '').toLowerCase();
      if (c === 'solvent') return 'bg-gradient-to-tl from-cyan-600 to-blue-400';
      if (c === 'standard') return 'bg-gradient-to-tl from-amber-500 to-yellow-300';
      
      return 'bg-gradient-to-tl from-purple-700 to-pink-500';
  }

  isLowStock(item: InventoryItem) { return item.stock <= (item.threshold || 5); }
  
  // Stock Percentage for Gauge
  getStockPercent(item: InventoryItem): number {
      const safeLevel = (item.threshold || 5) * 3; // Assume 3x threshold is "Safe/Full"
      const ratio = item.stock / safeLevel;
      return Math.min(ratio * 100, 100);
  }
  
  // Resolve name specifically for capacity tab using local map
  resolveCapacityName(id: string): string {
    const item = this.capacityInventoryMap()[id];
    return item ? (item.name || item.id) : id;
  }

  // Data Loading
  async refreshData() {
      // No-op: Data is automatically synchronized via StateService reactive cache.
      this.displayLimit.set(20);
      this.selectedIds.set(new Set());
  }

  loadMore() {
      this.displayLimit.update(l => l + 20);
  }

  onSearchInput(val: string) { this.searchSubject.next(val); }
  onFilterChange(val: string) { 
      this.filterType.set(val); 
      this.displayLimit.set(20); // Reset trang khi đổi bộ lọc
  }

  // Actions
  toggleSelection(id: string) { this.selectedIds.update(c => { const n = new Set(c); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  
  openModal(item?: InventoryItem) {
    if (!this.auth.canEditInventory()) {
        this.toast.show('Bạn không có quyền sửa kho.', 'error');
        return;
    }
    this.showModal.set(true);
    if(item) { 
        this.isEditing.set(true); 
        this.oldStock.set(item.stock);
        this.form.patchValue({ ...item, reason: '' }); 
        this.form.controls.id.disable(); 
    }
    else { 
        this.isEditing.set(false); 
        this.oldStock.set(0);
        this.form.reset({ category: 'reagent', stock: 0, unit: 'ml', threshold: 5, reason: 'Tạo mới', ghsWarnings: [], hazardStatements: [], precautionaryStatements: [] }); 
        this.form.controls.id.enable(); 
    }
  }
  closeModal() { 
      if (!this.isProcessing()) {
          this.showModal.set(false); 
      }
  }
  onNameChange(e: any) { if(!this.isEditing()) this.form.patchValue({ id: generateSlug(e.target.value) }); }
  
  // --- Pubchem Integration ---
  async fetchPubChem() {
      const cas = this.form.get('casNumber')?.value;
      const engName = this.form.get('englishName')?.value;
      const query = cas || engName;
      
      if (!query) {
          this.toast.show('Vui lòng nhập Tên Tiếng Anh hoặc mã CAS để tự động bắt GHS.', 'error');
          return;
      }
      
      this.isFetchingGhs.set(true);
      try {
          const result = await this.pubchem.fetchGHS(query);
          if (result && (result.pictograms.length > 0 || result.hazardStatements.length > 0 || result.precautionaryStatements.length > 0)) {
              this.form.patchValue({ 
                  ghsWarnings: result.pictograms,
                  hazardStatements: result.hazardStatements,
                  precautionaryStatements: result.precautionaryStatements
              });
              this.toast.show(`Thành công! Tìm thấy ${result.pictograms.length} GHS, ${result.hazardStatements.length} H-statements từ PubChem.`, 'success');
          } else {
              this.toast.show('PubChem không có thẻ GHS cho hóa chất này.', 'info');
          }
      } catch (e) {
          this.toast.show('Lỗi kết nối PubChem.', 'error');
      } finally {
          this.isFetchingGhs.set(false);
      }
  }

  toggleGhs(code: string) {
      const current = this.form.get('ghsWarnings')?.value as string[] || [];
      if (current.includes(code)) {
          this.form.patchValue({ ghsWarnings: current.filter(c => c !== code) });
      } else {
          this.form.patchValue({ ghsWarnings: [...current, code] });
      }
  }
  
  // --- HARDENED UX: Save Item ---
  async save() {
      if (this.isProcessing()) return; 
      if (this.form.invalid) {
          this.toast.show('Vui lòng nhập đầy đủ thông tin và Lý do thay đổi!', 'error');
          return;
      }
      this.isProcessing.set(true); 
      try { 
          const raw = this.form.getRawValue();
          const reason = raw.reason || ''; 
          const { reason: _, ...itemData } = raw; 
          await this.inventoryService.upsertItem(itemData as any, !this.isEditing(), reason, this.oldStock()); 
          this.toast.show(this.isEditing() ? 'Đã cập nhật' : 'Đã thêm mới', 'success');
          this.showModal.set(false); 
          this.refreshData(); 
      } catch (e: any) {
          if (e.code === 'resource-exhausted') {
             this.toast.show('Lỗi: Hết dung lượng lưu trữ (Quota).', 'error');
          } else {
             this.toast.show('Lỗi lưu kho: ' + (e.message || 'Unknown'), 'error');
          }
      } finally { 
          this.isProcessing.set(false); 
      }
  }
  
  // --- HARDENED UX: Delete Item ---
  async deleteItem(item: InventoryItem) {
      if (this.isProcessing()) return; 
      if(await this.confirmationService.confirm({ message: 'Xóa mục này? Hành động này cần được ghi nhận.', confirmText: 'Xác nhận Xóa', isDangerous: true })) {
          this.isProcessing.set(true); 
          try {
              await this.inventoryService.deleteItem(item.id, 'Xóa thủ công');
              this.toast.show('Đã xóa thành công', 'success');
              this.showModal.set(false);
              this.refreshData();
          } catch (e: any) {
              this.toast.show('Lỗi xóa: ' + e.message, 'error');
          } finally {
              this.isProcessing.set(false); 
          }
      }
  }
  
  // --- HARDENED UX: Quick Update ---
  async quickUpdate(item: InventoryItem, valStr: string) {
    if (this.isProcessing()) return; 
    const val = parseQuantityInput(valStr, item.unit); 
    if (val === null) {
        this.toast.show(`Lỗi: Đơn vị không khớp hoặc định dạng sai. Yêu cầu nhập theo (${item.unit}) hoặc quy đổi tương đương.`, 'error');
        return;
    }
    if (val === 0) return;
    this.isProcessing.set(true); 
    try {
      const reason = val > 0 ? 'Nhập nhanh' : 'Xuất nhanh';
      await this.inventoryService.updateStock(item.id, item.stock, val, reason);
      const msg = val > 0 ? `Đã nhập +${val} ${item.unit}` : `Đã xuất ${val} ${item.unit}`;
      this.toast.show(msg, 'success');
      this.refreshData();
    } catch (e: any) {
      this.toast.show('Lỗi cập nhật kho: ' + e.message, 'error');
    } finally {
      this.isProcessing.set(false); 
    }
  }
}
