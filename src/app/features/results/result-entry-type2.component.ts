import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';

@Component({
  selector: 'app-result-entry-type2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- 1. Metadata Form & Checkboxes -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">
          <i class="fa-solid fa-file-invoice mr-2 text-indigo-500"></i> Thông tin chung & Đánh giá
        </h4>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Ngày ký Người phân tích</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data.ngayNguoiPhanTich" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Ngày ký Người thẩm tra</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data.ngayNguoiThamTra" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
          </div>
        </div>

        <!-- Checkbox grid (Dynamic from SOP metadata configuration) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            <label class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700/30 cursor-pointer select-none transition">
              <input type="checkbox" 
                     [(ngModel)]="draft.page1Data[checkbox.key]" 
                     (ngModelChange)="onCheckboxChange(checkbox.key)"
                     class="mt-1 w-4 h-4 rounded text-fuchsia-600 border-slate-300 focus:ring-fuchsia-500 focus:ring-2 dark:bg-slate-900 dark:border-slate-700">
              <div>
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
              </div>
            </label>
          }
        </div>
      </div>

      <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-3">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <i class="fa-solid fa-table-cells mr-1 text-fuchsia-500"></i> Lưới nhập kết quả (Grid Spreadsheet)
          </h4>

          <!-- Premium Bulk Actions Panel -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Thao tác nhanh:</span>
            
            <button (click)="bulkFillND()" 
                    class="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    title="Đặt toàn bộ các ô kết quả chưa điền là ND">
              <i class="fa-solid fa-pen-clip"></i>
              <span>Điền ND ô trống</span>
            </button>

            <button (click)="bulkClearAll()" 
                    class="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    title="Xóa toàn bộ các ô kết quả của bảng">
              <i class="fa-solid fa-trash-can"></i>
              <span>Xóa hết bảng</span>
            </button>
          </div>
        </div>

        <!-- Spreadsheet Table Grid -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200 dark:border-slate-700 rounded-xl">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs w-16">Lọ số</th>
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[120px]">Mẫu thử</th>
                
                <!-- Dynamic active columns -->
                @for (col of activeColumns; track col) {
                  <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[110px] uppercase">
                    {{ formatColumnName(col) }}
                  </th>
                }
                
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[150px]">Ghi chú</th>
                <th class="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400 text-xs w-28">Hàng</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              @for (sample of run.sampleList; track sample; let rowIdx = $index) {
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td class="py-2.5 px-4 font-mono text-xs text-slate-400 font-bold">{{ rowIdx + 1 }}</td>
                  <td class="py-2.5 px-4 font-mono font-bold text-xs text-slate-700 dark:text-slate-300 break-all">{{ sample }}</td>
                  
                  <!-- Dynamic active columns inputs -->
                  @for (col of activeColumns; track col; let colIdx = $index) {
                    <td class="py-1 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData[sample][col]"
                             (ngModelChange)="onDataChanged()"
                             [id]="'cell-' + rowIdx + '-' + col"
                             (keydown)="handleGridNavigation($event, rowIdx, col, colIdx)"
                             placeholder="..."
                             class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none text-center">
                    </td>
                  }
                  
                  <!-- Note Note Note -->
                  <td class="py-1 px-2">
                    <input type="text"
                           [(ngModel)]="draft.resultData[sample]['ghiChu']"
                           (ngModelChange)="onDataChanged()"
                           [id]="'cell-' + rowIdx + '-ghiChu'"
                           (keydown)="handleGridNavigation($event, rowIdx, 'ghiChu', activeColumns.length)"
                           placeholder="Ghi chú..."
                           class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none">
                  </td>

                  <!-- Row Bulk Action copy -->
                  <td class="py-1 px-4 text-center">
                    <button (click)="copyRowToAll(sample)" 
                            class="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-black transition-colors"
                            title="Sao chép kết quả của dòng này cho tất cả các dòng còn lại">
                      <i class="fa-solid fa-copy mr-1"></i> Sao chép
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ResultEntryType2Component implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;

  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];

  ngOnInit() {
    // Trích lọc các cột hoạt chất thực sự (loại trừ lọ số, mẫu thử, ghi chú)
    const cols = Object.keys(this.config.columns || {});
    this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');

    // Chuyển hóa checkbox configuration
    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }
  }

  formatColumnName(colKey: string): string {
    // Chuyển từ kqTrifluralin -> Trifluralin, kqFip -> Fipronil
    let name = colKey.replace(/^kq/, '');
    // Tách hoa/thường viết hoa từ đầu
    name = name.replace(/([A-Z])/g, ' $1').trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  onDataChanged() {
    this.draftChanged.emit(this.draft);
  }

  /**
   * Thay đổi trạng thái checkbox checkTatCaND và checkCoMauPhatHien (luôn trái ngược nhau)
   */
  onCheckboxChange(changedKey: string) {
    if (changedKey === 'checkTatCaND' && this.draft.page1Data.checkTatCaND) {
      this.draft.page1Data.checkCoMauPhatHien = false;
    } else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data.checkCoMauPhatHien) {
      this.draft.page1Data.checkTatCaND = false;
    }
    this.onDataChanged();
  }

  /**
   * Bulk Action: Điền 'ND' (Không phát hiện) cho tất cả các ô trống
   */
  bulkFillND() {
    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      const row = this.draft.resultData[sampleCode];
      if (row) {
        this.activeColumns.forEach(col => {
          if (!row[col] || row[col]?.trim() === '') {
            row[col] = 'ND';
          }
        });
      }
    });
    this.draft.page1Data.checkTatCaND = true;
    this.draft.page1Data.checkCoMauPhatHien = false;
    this.onDataChanged();
  }

  /**
   * Bulk Action: Xóa sạch toàn bộ bảng để nhập lại
   */
  bulkClearAll() {
    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      const row = this.draft.resultData[sampleCode];
      if (row) {
        this.activeColumns.forEach(col => {
          row[col] = '';
        });
        row['ghiChu'] = '';
      }
    });
    this.onDataChanged();
  }

  /**
   * Bulk Action: Sao chép toàn bộ hoạt chất của dòng (mẫu) này cho các mẫu khác
   */
  copyRowToAll(sourceSampleCode: string) {
    const sourceData = this.draft.resultData[sourceSampleCode];
    if (!sourceData) return;

    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      if (sampleCode !== sourceSampleCode) {
        const destRow = this.draft.resultData[sampleCode];
        if (destRow) {
          // Chỉ sao chép hoạt chất kết quả
          this.activeColumns.forEach(col => {
            destRow[col] = sourceData[col] || '';
          });
        }
      }
    });
    this.onDataChanged();
  }

  /**
   * Spreadsheet Inline Cell Keyboard Navigation
   */
  handleGridNavigation(event: KeyboardEvent, rowIdx: number, col: string, colIdx: number) {
    const totalRows = this.run.sampleList.length;
    let targetRow = rowIdx;
    let targetCol = col;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      targetRow = Math.min(rowIdx + 1, totalRows - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      targetRow = Math.max(rowIdx - 1, 0);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      // Nhấn Enter nhảy xuống dòng dưới
      targetRow = Math.min(rowIdx + 1, totalRows - 1);
    } else {
      return;
    }

    const nextCellId = `cell-${targetRow}-${targetCol}`;
    const element = document.getElementById(nextCellId);
    if (element) {
      element.focus();
      // Tự động bôi đen để tiện nhập đè
      (element as HTMLInputElement).select();
    }
  }
}
