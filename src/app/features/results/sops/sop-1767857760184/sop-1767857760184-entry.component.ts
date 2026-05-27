import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { MasterTargetService } from '../../../targets/master-target.service';

@Component({
  selector: 'app-sop-1767857760184-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      


      <!-- 1. Metadata Form & Checkboxes -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
          <i class="fa-solid fa-file-invoice mr-2 text-cyan-500 text-sm"></i> Thông tin chung & Đánh giá (SOP: {{ run?.sopCode || 'sop_1767857760184' }})
        </h4>

        <!-- Method Toggle & FINAL option -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Thiết bị phân tích</label>
            <div class="flex gap-2">
              <button type="button" 
                      (click)="setMethod('GC/MS')" 
                      [class.bg-cyan-600]="draft.page1Data['dichlorvosMethod'] === 'GC/MS'"
                      [class.text-white]="draft.page1Data['dichlorvosMethod'] === 'GC/MS'"
                      [class.border-cyan-600]="draft.page1Data['dichlorvosMethod'] === 'GC/MS'"
                      [class.bg-slate-50]="draft.page1Data['dichlorvosMethod'] !== 'GC/MS'"
                      [class.dark:bg-slate-955]="draft.page1Data['dichlorvosMethod'] !== 'GC/MS'"
                      [class.text-slate-700]="draft.page1Data['dichlorvosMethod'] !== 'GC/MS'"
                      [class.dark:text-slate-300]="draft.page1Data['dichlorvosMethod'] !== 'GC/MS'"
                      [class.border-slate-200]="draft.page1Data['dichlorvosMethod'] !== 'GC/MS'"
                      [class.dark:border-slate-800]="draft.page1Data['dichlorvosMethod'] !== 'GC/MS'"
                      class="flex-1 px-4 py-2.5 rounded-xl text-xs font-black border transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95">
                <i class="fa-solid fa-microscope text-sm"></i>
                <span>GC/MS</span>
              </button>
              
              <button type="button" 
                      (click)="setMethod('GC/MSMS')" 
                      [class.bg-cyan-600]="draft.page1Data['dichlorvosMethod'] === 'GC/MSMS'"
                      [class.text-white]="draft.page1Data['dichlorvosMethod'] === 'GC/MSMS'"
                      [class.border-cyan-600]="draft.page1Data['dichlorvosMethod'] === 'GC/MSMS'"
                      [class.bg-slate-50]="draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'"
                      [class.dark:bg-slate-955]="draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'"
                      [class.text-slate-700]="draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'"
                      [class.dark:text-slate-300]="draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'"
                      [class.border-slate-200]="draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'"
                      [class.dark:border-slate-800]="draft.page1Data['dichlorvosMethod'] !== 'GC/MSMS'"
                      class="flex-1 px-4 py-2.5 rounded-xl text-xs font-black border transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95">
                <i class="fa-solid fa-flask-vials text-sm"></i>
                <span>GC/MS/MS</span>
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Kiểm soát chất lượng (QC) mẫu</label>
            <label class="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer select-none transition hover:bg-slate-50 dark:hover:bg-slate-850 h-[42px]">
              <input type="checkbox" 
                     [(ngModel)]="draft.page1Data['hasFinal']" 
                     (ngModelChange)="onFinalToggled()"
                     class="w-4 h-4 rounded text-cyan-600 border-slate-350 focus:ring-cyan-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700">
              <span class="text-xs font-bold text-slate-750 dark:text-slate-250">Thêm mẫu kiểm tra cuối mẻ (FINAL)</span>
            </label>
          </div>
        </div>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người phân tích</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 transition outline-none">
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người thẩm tra</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiThamTra']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 transition outline-none">
          </div>
        </div>
      </div>

      <!-- 1.5. Calibration curves configuration -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in">
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
          <i class="fa-solid fa-chart-line mr-2 text-cyan-500 text-sm"></i> Khai báo Đường chuẩn & Hệ số xác định (R²)
        </h4>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left Side: R^2, Blank Name, Spike Name -->
          <div class="lg:col-span-4 space-y-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Tên mẫu Trắng (Blank)</label>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['blankName']" 
                     (ngModelChange)="onDataChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="BLANK"
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition">
            </div>
            
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Tên mẫu Thêm chuẩn (Spike)</label>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['spikeName']" 
                     (ngModelChange)="onDataChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="SPIKE"
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition">
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Hệ số xác định R²</label>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['r2']" 
                     (ngModelChange)="onDataChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="Ví dụ: 0.9992..."
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-extrabold text-indigo-655 dark:text-indigo-400 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition">
            </div>
            <div class="text-[10.5px] text-slate-400 leading-relaxed font-medium">
              <i class="fa-solid fa-circle-info text-cyan-500 mr-1"></i> Giá trị này sẽ được tự động điền vào hàng cuối cùng của bảng đường chuẩn trong báo cáo xuất bản.
            </div>
          </div>

          <!-- Calibration Points Grid -->
          <div class="lg:col-span-8">
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">
              Các Điểm Đường chuẩn (Calibration Curve Points)
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              @for (pt of draft.page1Data['calibPoints']; track $index) {
                <div class="bg-slate-50/40 dark:bg-slate-955/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col gap-2 hover:shadow-xs hover:border-cyan-400/50 dark:hover:border-cyan-500/40 transition duration-200 group">
                  <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span class="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 transition duration-200">Chuẩn C{{ $index }}</span>
                    <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  </div>
                  <div>
                    <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Số vial</label>
                    <input type="text" 
                           [(ngModel)]="pt['loSo']" 
                           (ngModelChange)="onDataChanged()"
                           (focus)="$any($event.target).select()"
                           placeholder="..."
                           class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-center transition">
                  </div>
                  <div>
                    <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Nồng độ</label>
                    <input type="text" 
                           [(ngModel)]="pt['hamLuong']" 
                           (ngModelChange)="onDataChanged()"
                           (focus)="$any($event.target).select()"
                           placeholder="..."
                           class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-center transition">
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center">
            <i class="fa-solid fa-table-cells mr-2 text-cyan-500 text-sm"></i> Lưới nhập sắc ký mẫu thử (Spreadsheet)
          </h4>

          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Thao tác nhanh:</span>
            
            <button (click)="bulkFillND()" 
                    class="px-3 py-1.5 bg-slate-50 dark:bg-slate-955 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-slate-800 hover:border-amber-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
                    title="Đặt toàn bộ các ô kết quả chưa điền là ND">
              <i class="fa-solid fa-pen-clip"></i>
              <span>Điền ND ô trống</span>
            </button>

            <button (click)="bulkClearAll()" 
                    class="px-3 py-1.5 bg-slate-50 dark:bg-slate-955 hover:bg-red-50 dark:hover:bg-red-955/20 text-slate-655 dark:text-slate-455 hover:text-red-655 dark:hover:text-red-400 border border-slate-200/60 dark:border-slate-800 hover:border-red-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
                    title="Xóa toàn bộ các ô kết quả của bảng">
              <i class="fa-solid fa-trash-can"></i>
              <span>Xóa hết bảng</span>
            </button>

            <!-- Quick Vial Input -->
            <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-955 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs">
              <span class="font-bold text-slate-500 dark:text-slate-400">Lọ số:</span>
              <input type="number" 
                     [(ngModel)]="bulkVialStart" 
                     (ngModelChange)="onBulkVialStartChange()"
                     placeholder="Bắt đầu" 
                     class="w-14 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-cyan-500 outline-none">
              <span class="text-slate-400">-</span>
              <input type="number" 
                     [(ngModel)]="bulkVialEnd" 
                     placeholder="Kết thúc" 
                     class="w-14 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-cyan-500 outline-none">
              <button (click)="applyBulkVials()" 
                      class="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm">
                <i class="fa-solid fa-check"></i>
                <span>Áp dụng</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Spreadsheet Table Grid -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200/60 dark:border-slate-800 rounded-xl max-h-[500px]">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 sticky top-0 z-20">
                <th class="py-3 px-3 text-center w-12 bg-slate-50 dark:bg-slate-900">
                  <input type="checkbox"
                         [checked]="isAllSelected()"
                         (change)="toggleSelectAll($event)"
                         class="w-4 h-4 rounded text-cyan-600 border-slate-350 focus:ring-cyan-500">
                </th>
                <th class="py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs w-28 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">Lọ số</th>
                <th class="py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs min-w-[140px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">Mẫu thử</th>
                
                @for (col of activeColumns; track col) {
                  <th class="py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs min-w-[130px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">
                    {{ getColumnLabel(col) }}
                  </th>
                }
                
                <th class="py-3 px-4 text-left font-black text-slate-455 dark:text-slate-500 text-xs min-w-[180px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">Ghi chú</th>
                <th class="py-3 px-4 text-center font-black text-slate-455 dark:text-slate-500 text-xs w-24 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">Tác vụ</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              @for (row of getDisplayRows(); track row.key; let rowIdx = $index) {
                <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-850/30 transition-colors focus-within:bg-cyan-50/10 dark:focus-within:bg-cyan-500/5 border-l-4 border-l-transparent focus-within:border-l-cyan-500 transition-all duration-150" 
                    [class.opacity-60]="draft.resultData[row.key]['selected'] === false"
                    [ngClass]="{
                      'bg-indigo-50/15 dark:bg-indigo-955/5 border-l-indigo-500/60': row.key.startsWith('QC_')
                    }">
                  <td class="py-2.5 px-3 text-center">
                    <input type="checkbox"
                           [(ngModel)]="draft.resultData[row.key]['selected']"
                           (ngModelChange)="onDataChanged()"
                           class="w-4 h-4 rounded text-cyan-600 border-slate-350 focus:ring-cyan-500">
                  </td>
                  <td class="py-1.5 px-2 w-28">
                    <input type="text"
                           [(ngModel)]="draft.resultData[row.key]['loSo']"
                           (ngModelChange)="onDataChanged()"
                           [id]="'cell-' + rowIdx + '-loSo'"
                           [disabled]="row.key === 'QC_FINAL'"
                           (keydown)="handleGridNavigation($event, rowIdx, 'loSo', 0)"
                           (focus)="$any($event.target).select()"
                           placeholder="Vial..."
                           class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-center transition disabled:opacity-75 disabled:cursor-not-allowed">
                  </td>
                  <td class="py-2.5 px-4">
                    @if (row.key.startsWith('QC_')) {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-955 dark:text-indigo-400 uppercase shadow-xs border border-indigo-200/30">
                        {{ row.label }}
                      </span>
                    } @else {
                      <span class="font-mono font-black text-xs text-slate-750 dark:text-slate-300 break-all select-all">{{ row.key }}</span>
                    }
                  </td>
                  
                  @for (col of activeColumns; track col; let colIdx = $index) {
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key][col]"
                             (ngModelChange)="onCellChanged(row.key)"
                             [id]="'cell-' + rowIdx + '-' + col"
                             [disabled]="row.key === 'QC_FINAL' && col !== 'kqDichlorvos'"
                             (keydown)="handleGridNavigation($event, rowIdx, col, colIdx + 1)"
                             (focus)="$any($event.target).select()"
                             placeholder="..."
                             class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-center transition disabled:opacity-75 disabled:cursor-not-allowed">
                    </td>
                  }
                  
                  <td class="py-1.5 px-2">
                    <input type="text"
                           [(ngModel)]="draft.resultData[row.key]['ghiChu']"
                           (ngModelChange)="onDataChanged()"
                           [id]="'cell-' + rowIdx + '-ghiChu'"
                           (keydown)="handleGridNavigation($event, rowIdx, 'ghiChu', activeColumns.length + 1)"
                           (focus)="$any($event.target).select()"
                           placeholder="Ghi chú..."
                           class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-355 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition">
                  </td>
                  <td class="py-1.5 px-4 text-center">
                    <button (click)="copyRowToAll(row.key)" 
                            class="w-7 h-7 inline-flex items-center justify-center bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg text-xs font-black transition active:scale-95 duration-100 shadow-xs"
                            title="Sao chép kết quả dòng này cho tất cả dòng khác">
                      <i class="fa-solid fa-copy"></i>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class Sop1767857760184EntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Input() activeFilter: string = 'ALL';
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private masterTargetService = inject(MasterTargetService);
  masterTargets = signal<any[]>([]);
  activeColumns: string[] = [];

  // Bulk vial properties
  bulkVialStart = 1;
  bulkVialEnd = 1;

  getStats() {
    const regularSamples = this.getVisibleRegularSamples();
    const totalCount = regularSamples.length;
    const selectedCount = regularSamples.filter((s: string) => this.draft.resultData[s]?.['selected'] !== false).length;
    
    // Fill progress (leaving blank means ND, which is a completed result)
    let filledCount = 0;
    regularSamples.forEach((s: string) => {
      const row = this.draft.resultData[s];
      if (row && row['selected'] !== false) {
        filledCount++;
      }
    });
    const progressPct = selectedCount > 0 ? Math.round((filledCount / selectedCount) * 100) : 0;
    
    // R2 Linearity
    const r2Val = this.draft.page1Data['r2'] || '';
    const r2Float = parseFloat(r2Val);
    const r2Status = !isNaN(r2Float) ? (r2Float >= 0.995 ? 'VALID' : 'WARNING') : 'NOT_SET';

    // Spike Recovery
    const spikeVal = parseFloat(this.draft.resultData['QC_SPIKE']?.['kqDichlorvos'] || '');
    const spikeRecovery = !isNaN(spikeVal) ? Math.round((spikeVal / 10.0) * 100) : null;
    const spikeQcStatus = spikeRecovery !== null ? (spikeRecovery >= 70 && spikeRecovery <= 120 ? 'PASS' : 'FAIL') : 'NONE';

    // Final Recovery
    const finalVal = parseFloat(this.draft.resultData['QC_FINAL']?.['kqDichlorvos'] || '');
    const finalRecovery = !isNaN(finalVal) ? Math.round((finalVal / 10.0) * 100) : null;
    const finalQcStatus = finalRecovery !== null ? (finalRecovery >= 70 && finalRecovery <= 120 ? 'PASS' : 'FAIL') : 'NONE';

    return {
      totalCount,
      selectedCount,
      filledCount,
      progressPct,
      r2Val,
      r2Status,
      spikeRecovery,
      spikeQcStatus,
      finalRecovery,
      finalQcStatus
    };
  }

  async ngOnInit() {
    try {
      const analytes = await this.masterTargetService.getAll();
      this.masterTargets.set(analytes);
    } catch (e) {
      console.warn('Failed to load master analytes', e);
    }

    const cols = Object.keys(this.config.columns || {});
    this.activeColumns = cols.filter((c: string) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');

    // Ensure blankName and spikeName are initialized
    if (this.draft.page1Data['blankName'] === undefined) {
      this.draft.page1Data['blankName'] = '';
    }
    if (this.draft.page1Data['spikeName'] === undefined) {
      this.draft.page1Data['spikeName'] = '';
    }

    // Ensure dichlorvosMethod is initialized
    if (!this.draft.page1Data['dichlorvosMethod']) {
      this.draft.page1Data['dichlorvosMethod'] = 'GC/MS';
      this.draft.page1Data['calibPoints'] = [
        { loSo: '51', hamLuong: '0' },
        { loSo: '52', hamLuong: '5' },
        { loSo: '53', hamLuong: '10' },
        { loSo: '54', hamLuong: '20' },
        { loSo: '55', hamLuong: '30' },
        { loSo: '56', hamLuong: '40' }
      ];
      this.bulkVialStart = 1;
    } else {
      // Set bulk start based on current method if not set
      if (this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS') {
        this.bulkVialStart = 9;
      } else {
        this.bulkVialStart = 1;
      }
    }

    // Auto fill defaults for existing samples if they are empty
    let hasChanges = false;
    this.getVisibleRegularSamples().forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        const randW = (10.01 + Math.random() * 0.09).toFixed(2);
        this.draft.resultData[sampleCode] = {
          loSo: '',
          selected: true,
          khoiLuong: randW,
          heSoPhaLoang: '1'
        };
        hasChanges = true;
      } else {
        if (this.draft.resultData[sampleCode]['khoiLuong'] === undefined || this.draft.resultData[sampleCode]['khoiLuong'] === '') {
          const randW = (10.01 + Math.random() * 0.09).toFixed(2);
          this.draft.resultData[sampleCode]['khoiLuong'] = randW;
          hasChanges = true;
        }
        if (this.draft.resultData[sampleCode]['heSoPhaLoang'] === undefined || this.draft.resultData[sampleCode]['heSoPhaLoang'] === '') {
          this.draft.resultData[sampleCode]['heSoPhaLoang'] = '1';
          hasChanges = true;
        }
      }
    });

    // Auto fill weight and dilution for QC_BLANK and QC_SPIKE
    const qcKeys = ['QC_BLANK', 'QC_SPIKE'];
    qcKeys.forEach((key: string) => {
      if (!this.draft.resultData[key]) {
        const randW = (10.01 + Math.random() * 0.09).toFixed(2);
        this.draft.resultData[key] = {
          loSo: key === 'QC_BLANK' ? (this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS' ? '7' : '57') : (this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS' ? '8' : '58'),
          kqDichlorvos: key === 'QC_BLANK' ? 'ND' : '',
          ghiChu: '',
          selected: true,
          khoiLuong: randW,
          heSoPhaLoang: '1'
        };
        hasChanges = true;
      } else {
        if (this.draft.resultData[key]['khoiLuong'] === undefined || this.draft.resultData[key]['khoiLuong'] === '') {
          const randW = (10.01 + Math.random() * 0.09).toFixed(2);
          this.draft.resultData[key]['khoiLuong'] = randW;
          hasChanges = true;
        }
        if (this.draft.resultData[key]['heSoPhaLoang'] === undefined || this.draft.resultData[key]['heSoPhaLoang'] === '') {
          this.draft.resultData[key]['heSoPhaLoang'] = '1';
          hasChanges = true;
        }
      }
    });

    // Auto sync QC_FINAL from QC_SPIKE
    if (this.draft.page1Data['hasFinal'] && this.draft.resultData['QC_FINAL']) {
      const spike = this.draft.resultData['QC_SPIKE'];
      if (spike) {
        if (this.draft.resultData['QC_FINAL']['loSo'] !== spike['loSo'] ||
            this.draft.resultData['QC_FINAL']['khoiLuong'] !== spike['khoiLuong'] ||
            this.draft.resultData['QC_FINAL']['heSoPhaLoang'] !== spike['heSoPhaLoang']) {
          this.draft.resultData['QC_FINAL']['loSo'] = spike['loSo'] || '';
          this.draft.resultData['QC_FINAL']['khoiLuong'] = spike['khoiLuong'] || '';
          this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = spike['heSoPhaLoang'] || '';
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      this.onDataChanged();
    }

    this.onBulkVialStartChange();
  }

  onBulkVialStartChange() {
    const start = parseInt(String(this.bulkVialStart), 10);
    if (!isNaN(start)) {
      const count = this.getVisibleRegularSamples().length;
      this.bulkVialEnd = start + Math.max(0, count - 1);
    }
  }

  getVisibleRegularSamples(): string[] {
    return this.run.sampleList || [];
  }

  isAllSelected(): boolean {
    const visible = this.getVisibleRegularSamples();
    if (visible.length === 0) return false;
    return visible.every((s: string) => this.draft.resultData[s]?.['selected'] !== false);
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    const visible = this.getVisibleRegularSamples();
    visible.forEach((s: string) => {
      if (!this.draft.resultData[s]) {
        this.draft.resultData[s] = {};
      }
      this.draft.resultData[s]['selected'] = checked;
    });
    this.onDataChanged();
  }

  applyBulkVials() {
    const start = parseInt(String(this.bulkVialStart), 10);
    const end = parseInt(String(this.bulkVialEnd), 10);
    if (isNaN(start) || isNaN(end) || start > end) {
      return;
    }
    const visible = this.getVisibleRegularSamples();
    visible.forEach((sample: string, idx: number) => {
      const val = start + idx;
      if (val <= end) {
        if (!this.draft.resultData[sample]) {
          this.draft.resultData[sample] = { selected: true };
        }
        this.draft.resultData[sample]['loSo'] = String(val);
      }
    });
    this.onDataChanged();
  }

  setMethod(method: 'GC/MS' | 'GC/MSMS') {
    if (this.draft.page1Data['dichlorvosMethod'] === method) return;
    this.draft.page1Data['dichlorvosMethod'] = method;
    
    // Switch default configurations
    if (method === 'GC/MS') {
      this.draft.page1Data['calibPoints'] = [
        { loSo: '51', hamLuong: '0' },
        { loSo: '52', hamLuong: '5' },
        { loSo: '53', hamLuong: '10' },
        { loSo: '54', hamLuong: '20' },
        { loSo: '55', hamLuong: '30' },
        { loSo: '56', hamLuong: '40' }
      ];
      this.bulkVialStart = 1;
      
      // Update vials for QC rows directly in resultData
      if (this.draft.resultData['QC_BLANK']) this.draft.resultData['QC_BLANK']['loSo'] = '57';
      if (this.draft.resultData['QC_SPIKE']) this.draft.resultData['QC_SPIKE']['loSo'] = '58';
      if (this.draft.resultData['QC_FINAL']) this.draft.resultData['QC_FINAL']['loSo'] = '58';
    } else {
      this.draft.page1Data['calibPoints'] = [
        { loSo: '1', hamLuong: '0' },
        { loSo: '2', hamLuong: '5' },
        { loSo: '3', hamLuong: '10' },
        { loSo: '4', hamLuong: '20' },
        { loSo: '5', hamLuong: '50' }
      ];
      this.bulkVialStart = 9;
      
      // Update vials for QC rows directly in resultData
      if (this.draft.resultData['QC_BLANK']) this.draft.resultData['QC_BLANK']['loSo'] = '7';
      if (this.draft.resultData['QC_SPIKE']) this.draft.resultData['QC_SPIKE']['loSo'] = '8';
      if (this.draft.resultData['QC_FINAL']) this.draft.resultData['QC_FINAL']['loSo'] = '8';
    }
    
    this.onBulkVialStartChange();
    this.onDataChanged();
  }

  onFinalToggled() {
    if (this.draft.page1Data['hasFinal']) {
      const spikeVial = this.draft.resultData['QC_SPIKE']?.['loSo'] || (this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS' ? '8' : '58');
      this.draft.resultData['QC_FINAL'] = {
        loSo: spikeVial,
        kqDichlorvos: '',
        ghiChu: '',
        selected: true
      };
    } else {
      delete this.draft.resultData['QC_FINAL'];
    }
    this.onDataChanged();
  }

  getColumnLabel(colKey: string): string {
    if (colKey === 'khoiLuong') return 'Khối lượng (g)';
    if (colKey === 'heSoPhaLoang') return 'Hệ số pha loãng F';
    if (colKey === 'kqDichlorvos') return 'Dichlorvos (ng/g)';
    return this.formatColumnName(colKey);
  }

  getCompoundDisplayName(compound: string): string {
    const analytes = this.masterTargets();
    if (analytes.length === 0) return compound;

    // 1. Exact id match
    const exactMatch = analytes.find(a => a.id === compound);
    if (exactMatch) return exactMatch.name;

    // 2. Token-scoring: split compound into tokens and find best match
    const searchTokens = compound.toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean);
    let bestMatch: any = null;
    let bestScore = 0;

    for (const a of analytes) {
      const haystack = `${a.id} ${a.name}`.toLowerCase();
      let score = 0;
      for (const token of searchTokens) {
        if (haystack.includes(token)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = a;
      }
    }

    const minScore = searchTokens.length === 1 ? 1 : 2;
    return (bestMatch && bestScore >= minScore) ? bestMatch.name : compound;
  }

  formatColumnName(colKey: string): string {
    let name = colKey.replace(/^kq/, '');
    name = name.replace(/([A-Z])/g, ' $1').trim();
    const defaultName = name.charAt(0).toUpperCase() + name.slice(1);
    return this.getCompoundDisplayName(defaultName);
  }

  updateDichlorvosRecovery(key: string) {
    const row = this.draft.resultData[key];
    if (!row) return;
    const val = parseFloat(row['kqDichlorvos'] || '');
    if (!isNaN(val)) {
      const rec = Math.round((val / 10.0) * 100);
      row['ghiChu'] = `${rec}%`;
    } else {
      row['ghiChu'] = '';
    }
  }

  onCellChanged(key: string) {
    if (key === 'QC_SPIKE' || key === 'QC_FINAL') {
      this.updateDichlorvosRecovery(key);
    }
    this.onDataChanged();
  }

  onDataChanged() {
    // Sync FINAL vial, weight and dilution from SPIKE
    if (this.draft.resultData['QC_SPIKE'] && this.draft.resultData['QC_FINAL']) {
      this.draft.resultData['QC_FINAL']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || '';
      this.draft.resultData['QC_FINAL']['khoiLuong'] = this.draft.resultData['QC_SPIKE']['khoiLuong'] || '';
      this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] || '';
    }
    this.updateDichlorvosRecovery('QC_SPIKE');
    this.updateDichlorvosRecovery('QC_FINAL');
    this.draftChanged.emit(this.draft);
  }

  getDisplayRows(): any[] {
    const list: any[] = [];
    
    // Determine method and vials
    const isMSMS = this.draft.page1Data['dichlorvosMethod'] === 'GC/MSMS';
    const blankVial = isMSMS ? '7' : '57';
    const spikeVial = isMSMS ? '8' : '58';
    
    // Ensure QC_BLANK and QC_SPIKE exist
    if (!this.draft.resultData['QC_BLANK']) {
      const randW = (10.01 + Math.random() * 0.09).toFixed(2);
      this.draft.resultData['QC_BLANK'] = { loSo: blankVial, kqDichlorvos: 'ND', ghiChu: '', selected: true, khoiLuong: randW, heSoPhaLoang: '1' };
    } else {
      this.draft.resultData['QC_BLANK']['loSo'] = this.draft.resultData['QC_BLANK']['loSo'] || blankVial;
      if (this.draft.resultData['QC_BLANK']['khoiLuong'] === undefined || this.draft.resultData['QC_BLANK']['khoiLuong'] === '') {
        this.draft.resultData['QC_BLANK']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
      }
      this.draft.resultData['QC_BLANK']['heSoPhaLoang'] = this.draft.resultData['QC_BLANK']['heSoPhaLoang'] || '1';
    }
    
    if (!this.draft.resultData['QC_SPIKE']) {
      const randW = (10.01 + Math.random() * 0.09).toFixed(2);
      this.draft.resultData['QC_SPIKE'] = { loSo: spikeVial, kqDichlorvos: '', selected: true, ghiChu: '', khoiLuong: randW, heSoPhaLoang: '1' };
    } else {
      this.draft.resultData['QC_SPIKE']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || spikeVial;
      if (this.draft.resultData['QC_SPIKE']['khoiLuong'] === undefined || this.draft.resultData['QC_SPIKE']['khoiLuong'] === '') {
        this.draft.resultData['QC_SPIKE']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
      }
      this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] = this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] || '1';
    }

    list.push({
      key: 'QC_BLANK',
      type: 'QC_BLANK',
      label: this.draft.page1Data['blankName'] || 'Blank'
    });

    list.push({
      key: 'QC_SPIKE',
      type: 'QC_SPIKE',
      label: this.draft.page1Data['spikeName'] || 'Spike'
    });

    // Regular samples
    this.getVisibleRegularSamples().forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        const randW = (10.01 + Math.random() * 0.09).toFixed(2);
        this.draft.resultData[sampleCode] = {
          loSo: '',
          selected: true,
          khoiLuong: randW,
          heSoPhaLoang: '1'
        };
        this.activeColumns.forEach((col: string) => {
          if (col !== 'khoiLuong' && col !== 'heSoPhaLoang') {
            this.draft.resultData[sampleCode][col] = '';
          }
        });
      } else {
        if (this.draft.resultData[sampleCode]['khoiLuong'] === undefined || this.draft.resultData[sampleCode]['khoiLuong'] === '') {
          const randW = (10.01 + Math.random() * 0.09).toFixed(2);
          this.draft.resultData[sampleCode]['khoiLuong'] = randW;
        }
        if (this.draft.resultData[sampleCode]['heSoPhaLoang'] === undefined || this.draft.resultData[sampleCode]['heSoPhaLoang'] === '') {
          this.draft.resultData[sampleCode]['heSoPhaLoang'] = '1';
        }
      }
      list.push({
        key: sampleCode,
        type: 'REGULAR',
        label: sampleCode
      });
    });

    // Optional FINAL QC
    if (this.draft.page1Data['hasFinal']) {
      const spike = this.draft.resultData['QC_SPIKE'];
      const finalVial = spike?.['loSo'] || spikeVial;
      const finalW = spike?.['khoiLuong'] || (10.01 + Math.random() * 0.09).toFixed(2);
      const finalF = spike?.['heSoPhaLoang'] || '1';
      if (!this.draft.resultData['QC_FINAL']) {
        this.draft.resultData['QC_FINAL'] = { loSo: finalVial, kqDichlorvos: '', ghiChu: '', selected: true, khoiLuong: finalW, heSoPhaLoang: finalF };
      } else {
        this.draft.resultData['QC_FINAL']['loSo'] = finalVial;
        this.draft.resultData['QC_FINAL']['khoiLuong'] = finalW;
        this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = finalF;
      }
      list.push({
        key: 'QC_FINAL',
        type: 'QC_FINAL',
        label: 'FINAL'
      });
    }

    return list;
  }

  bulkFillND() {
    const displayRows = this.getDisplayRows();
    displayRows.forEach((row: any) => {
      const rowData = this.draft.resultData[row.key];
      if (rowData && rowData['selected'] !== false) {
        if (!rowData['kqDichlorvos'] || rowData['kqDichlorvos']?.trim() === '') {
          rowData['kqDichlorvos'] = 'ND';
        }
      }
    });
    this.onDataChanged();
  }

  bulkClearAll() {
    const displayRows = this.getDisplayRows();
    displayRows.forEach((row: any) => {
      const rowData = this.draft.resultData[row.key];
      if (rowData) {
        this.activeColumns.forEach((col: string) => {
          rowData[col] = '';
        });
        rowData['ghiChu'] = '';
      }
    });
    this.onDataChanged();
  }

  copyRowToAll(sourceKey: string) {
    const source = this.draft.resultData[sourceKey];
    if (!source) return;

    const visible = this.getVisibleRegularSamples();
    visible.forEach((targetKey: string) => {
      if (targetKey !== sourceKey) {
        if (!this.draft.resultData[targetKey]) {
          this.draft.resultData[targetKey] = { selected: true };
        }
        this.activeColumns.forEach((col: string) => {
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
    const colsCount = this.activeColumns.length + 3; // checkbox + loSo + active cols + ghiChu

    if (key === 'ArrowUp') {
      targetRowIdx = Math.max(0, rowIdx - 1);
      event.preventDefault();
    } else if (key === 'ArrowDown') {
      targetRowIdx = Math.min(rows.length - 1, rowIdx + 1);
      event.preventDefault();
    } else if (key === 'ArrowLeft') {
      targetColIdx = Math.max(1, colIdx - 1); // skip checkbox
    } else if (key === 'ArrowRight') {
      targetColIdx = Math.min(colsCount - 1, colIdx + 1);
    } else {
      return;
    }

    const targetColName = targetColIdx === 1 ? 'loSo' : (targetColIdx === colsCount - 1 ? 'ghiChu' : this.activeColumns[targetColIdx - 2]);
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
