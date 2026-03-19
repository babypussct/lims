import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QrGlobalService } from '../../../core/services/qr-global.service';
import { InventoryService } from '../../../features/inventory/inventory.service';
import { InventoryItem } from '../../../core/models/inventory.model';
import { formatNum, formatSmartUnit } from '../../utils/utils';

@Component({
  selector: 'app-gs1-info-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (qrService.scannedGs1Data()) {
      <div class="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-200 dark:border-slate-700">
          
          <!-- Header -->
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
                <i class="fa-solid fa-barcode"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 dark:text-white text-lg leading-tight">Thông tin GS1</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Quét từ Data Matrix</p>
              </div>
            </div>
            <button (click)="close()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            @if (isLoading()) {
              <div class="flex flex-col items-center justify-center py-8">
                <i class="fa-solid fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
                <p class="text-sm text-slate-500">Đang tra cứu thông tin...</p>
              </div>
            } @else {
              <!-- Product Info -->
              <div class="mb-6">
                @if (qrService.scannedGs1Data()?.error) {
                  <div class="flex items-start gap-3 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl">
                    <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Lỗi phân tích mã vạch</div>
                      <div class="font-medium text-slate-700 dark:text-slate-300 text-sm">{{ qrService.scannedGs1Data()?.error }}</div>
                    </div>
                  </div>
                } @else if (!qrService.scannedGs1Data()?.gtin) {
                  <div class="flex items-start gap-3 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl">
                    <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-barcode"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Thiếu thông tin GTIN</div>
                      <div class="font-medium text-slate-700 dark:text-slate-300 text-sm">Mã vạch này không chứa mã sản phẩm (GTIN). Không thể tra cứu.</div>
                    </div>
                  </div>
                } @else if (matchedItem()) {
                  <div class="flex items-start gap-3 mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-check"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Đã có trong hệ thống</div>
                      <div class="font-bold text-slate-800 dark:text-white text-lg">{{ matchedItem()?.name }}</div>
                      <div class="text-sm text-slate-500 mt-1">
                        Tồn kho hiện tại: 
                        <span class="font-bold text-slate-700 dark:text-slate-300" [innerHTML]="formatSmartUnit(matchedItem()?.stock || 0, matchedItem()?.unit || '')"></span>
                      </div>
                    </div>
                  </div>
                } @else {
                  <div class="flex items-start gap-3 mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl">
                    <div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-box-open"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Chưa có trong hệ thống</div>
                      <div class="font-medium text-slate-700 dark:text-slate-300 text-sm">Hóa chất này chưa được khai báo hoặc không tìm thấy GTIN.</div>
                    </div>
                  </div>
                }
              </div>

              <!-- GS1 Data Grid -->
              <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">GTIN</div>
                  <div class="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">{{ qrService.scannedGs1Data()?.gtin || 'N/A' }}</div>
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Số Lô (Lot)</div>
                  <div class="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">{{ qrService.scannedGs1Data()?.lotNumber || 'N/A' }}</div>
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 col-span-2">
                  <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Hạn sử dụng (EXP)</div>
                  <div class="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">{{ qrService.scannedGs1Data()?.expiryDate || 'N/A' }}</div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3">
                <button (click)="close()" class="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                  Đóng
                </button>
                <button (click)="goToInventory()" 
                        [disabled]="qrService.scannedGs1Data()?.error || !qrService.scannedGs1Data()?.gtin"
                        class="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600">
                  <i class="fa-solid fa-boxes-stacked"></i>
                  {{ matchedItem() ? 'Cập nhật Kho' : 'Nhập Kho Mới' }}
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  `]
})
export class Gs1InfoModalComponent {
  qrService = inject(QrGlobalService);
  inventoryService = inject(InventoryService);
  router = inject(Router);

  isLoading = signal(false);
  matchedItem = signal<InventoryItem | null>(null);

  formatSmartUnit = formatSmartUnit;

  constructor() {
    effect(() => {
      const data = this.qrService.scannedGs1Data();
      if (data && data.gtin) {
        this.lookupItem(data.gtin);
      } else {
        this.matchedItem.set(null);
      }
    }, { allowSignalWrites: true });
  }

  async lookupItem(gtin: string) {
    this.isLoading.set(true);
    try {
      const item = await this.inventoryService.getItemByGtin(gtin);
      this.matchedItem.set(item);
    } catch (e) {
      console.error("Error looking up GTIN", e);
      this.matchedItem.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  close() {
    this.qrService.scannedGs1Data.set(null);
  }

  goToInventory() {
    const data = this.qrService.scannedGs1Data();
    if (data) {
      this.router.navigate(['/inventory'], { 
        queryParams: { 
            action: 'scan_gs1',
            gtin: data.gtin,
            lot: data.lotNumber,
            exp: data.expiryDate,
            raw: data.raw
        } 
      });
      this.close();
    }
  }
}
