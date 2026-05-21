import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';

@Component({
  selector: 'app-sop-default-type2-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- 1. Metadata Form & Checkboxes -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">
          <i class="fa-solid fa-file-invoice mr-2 text-indigo-500"></i> Thông tin chung & Đánh giá (Tiêu chuẩn)
        </h4>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Ngày ký Người phân tích</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Ngày ký Người thẩm tra</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiThamTra']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none">
          </div>
        </div>

        <!-- Checkbox list -->
        @if (checkboxList.length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            @for (checkbox of checkboxList; track checkbox.key) {
              <label class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700/30 cursor-pointer select-none transition bg-slate-50/20 dark:bg-slate-900/10">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data[checkbox.key]" 
                       (ngModelChange)="onCheckboxChange(checkbox.key)"
                       class="mt-1 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-2 dark:bg-slate-900 dark:border-slate-700">
                <div>
                  <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
                </div>
              </label>
            }
          </div>
        }
      </div>

      <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-3">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <i class="fa-solid fa-table-cells mr-1 text-indigo-500"></i> Lưới nhập kết quả sắc ký (Spreadsheet)
          </h4>

          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Thao tác nhanh:</span>
            
            <button (click)="bulkFillND()" 
                    class="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
              <i class="fa-solid fa-pen-clip"></i>
              <span>Điền ND ô trống</span>
            </button>

            <button (click)="bulkClearAll()" 
                    class="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
              <i class="fa-solid fa-trash-can"></i>
              <span>Xóa hết bảng</span>
            </button>
          </div>
        </div>

        <!-- Spreadsheet Table Grid -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs w-28">Lọ số</th>
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[150px]">Mẫu thử</th>
                
                @for (col of activeColumns; track col) {
                  <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[120px] uppercase">
                    {{ formatColumnName(col) }}
                  </th>
                }
                
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[150px]">Ghi chú</th>
                <th class="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400 text-xs w-28">Hàng</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              @for (row of getDisplayRows(); track row.key; let rowIdx = $index) {
                @if (draft.resultData[row.key]) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td class="py-1 px-2 w-28">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['loSo']"
                             (ngModelChange)="onDataChanged()"
                             [id]="'cell-' + rowIdx + '-loSo'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'loSo', 0)"
                             placeholder="..."
                             class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-indigo-500 outline-none text-center">
                    </td>
                    <td class="py-2.5 px-4 font-mono font-bold text-xs text-slate-700 dark:text-slate-300 break-all">{{ row.label }}</td>
                    
                    @for (col of activeColumns; track col; let colIdx = $index) {
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData[row.key][col]"
                               (ngModelChange)="onDataChanged()"
                               [id]="'cell-' + rowIdx + '-' + col"
                               (keydown)="handleGridNavigation($event, rowIdx, col, colIdx + 1)"
                               placeholder="..."
                               class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-indigo-500 outline-none text-center">
                      </td>
                    }
                    
                    <td class="py-1 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['ghiChu']"
                             (ngModelChange)="onDataChanged()"
                             [id]="'cell-' + rowIdx + '-ghiChu'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'ghiChu', activeColumns.length + 1)"
                             placeholder="Ghi chú..."
                             class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none">
                    </td>
                    <td class="py-1 px-4 text-center">
                      <button (click)="copyRowToAll(row.key)" 
                              class="px-2 py-1 bg-indigo-55 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-black transition-colors">
                        <i class="fa-solid fa-copy"></i>
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class SopDefaultType2EntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;

  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];

  ngOnInit() {
    const cols = Object.keys(this.config.columns || {});
    this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');

    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }
  }

  formatColumnName(colKey: string): string {
    let name = colKey.replace(/^kq/, '');
    name = name.replace(/([A-Z])/g, ' $1').trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  onDataChanged() {
    this.draftChanged.emit(this.draft);
  }

  onCheckboxChange(changedKey: string) {
    if (changedKey === 'checkTatCaND' && this.draft.page1Data['checkTatCaND']) {
      this.draft.page1Data['checkCoMauPhatHien'] = false;
    } else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data['checkCoMauPhatHien']) {
      this.draft.page1Data['checkTatCaND'] = false;
    }
    this.onDataChanged();
  }

  getDisplayRows(): any[] {
    const list: any[] = [];
    (this.run.sampleList || []).forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {
          loSo: '',
          selected: true
        };
      }
      list.push({
        key: sampleCode,
        type: 'REGULAR',
        label: sampleCode,
        isQC: false
      });
    });
    return list;
  }

  bulkFillND() {
    const visible = this.run.sampleList || [];
    visible.forEach((sampleCode: string) => {
      const row = this.draft.resultData[sampleCode];
      if (row) {
        this.activeColumns.forEach(col => {
          if (!row[col] || row[col]?.trim() === '') {
            row[col] = 'ND';
          }
        });
      }
    });
    this.onDataChanged();
  }

  bulkClearAll() {
    const visible = this.run.sampleList || [];
    visible.forEach((sampleCode: string) => {
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

  copyRowToAll(sourceKey: string) {
    const source = this.draft.resultData[sourceKey];
    if (!source) return;

    const visible = this.run.sampleList || [];
    visible.forEach((targetKey: string) => {
      if (targetKey !== sourceKey) {
        if (!this.draft.resultData[targetKey]) {
          this.draft.resultData[targetKey] = { selected: true };
        }
        this.activeColumns.forEach(col => {
          this.draft.resultData[targetKey][col] = source[col];
        });
      }
    });
    this.onDataChanged();
  }

  handleGridNavigation(event: KeyboardEvent, rowIdx: number, colName: string, colIdx: number) {
    const key = event.key;
    let targetRowIdx = rowIdx;
    let targetColIdx = colIdx;

    const rows = this.getDisplayRows();
    const colsCount = this.activeColumns.length + 2; // loSo + active cols + ghiChu

    if (key === 'ArrowUp') {
      targetRowIdx = Math.max(0, rowIdx - 1);
      event.preventDefault();
    } else if (key === 'ArrowDown') {
      targetRowIdx = Math.min(rows.length - 1, rowIdx + 1);
      event.preventDefault();
    } else if (key === 'ArrowLeft') {
      targetColIdx = Math.max(0, colIdx - 1);
    } else if (key === 'ArrowRight') {
      targetColIdx = Math.min(colsCount - 1, colIdx + 1);
    } else {
      return;
    }

    const targetColName = targetColIdx === 0 ? 'loSo' : (targetColIdx === colsCount - 1 ? 'ghiChu' : this.activeColumns[targetColIdx - 1]);
    setTimeout(() => {
      const el = document.getElementById(`cell-${targetRowIdx}-${targetColName}`);
      if (el) {
        el.focus();
        if (el instanceof HTMLInputElement) {
          el.select();
        }
      }
    }, 10);
  }
}
