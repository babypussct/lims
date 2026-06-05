import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName, isCompoundAssigned } from '../../shared/compound-id-resolver';

@Component({
  selector: 'app-sop-lan-huu-co-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Form Selection Switcher -->
      <div class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm mb-4">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider">Hình thức in kết quả:</span>
          <div class="inline-flex bg-slate-100 dark:bg-slate-955 p-1 rounded-xl border border-slate-200 dark:border-slate-800 select-none items-center shadow-3xs">
            <button type="button"
                    (click)="setPrintFormType('formCheck')"
                    [class]="draft.page1Data['printFormType'] === 'formCheck'
                      ? 'px-3.5 py-2 text-xs font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95' 
                      : 'px-3.5 py-2 text-xs font-bold rounded-lg text-slate-550 hover:text-slate-850 dark:hover:text-slate-250 transition duration-155'">
              FORM CHECK
            </button>
            <button type="button"
                    (click)="setPrintFormType('formDon')"
                    [class]="draft.page1Data['printFormType'] === 'formDon'
                      ? 'px-3.5 py-2 text-xs font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95' 
                      : 'px-3.5 py-2 text-xs font-bold rounded-lg text-slate-550 hover:text-slate-850 dark:hover:text-slate-250 transition duration-155'">
              FORM ĐƠN
            </button>
          </div>
        </div>
      </div>
      
      <!-- TAB 1: COMPOUND RESULTS GRID -->
      <div *ngIf="draft.page1Data['printFormType'] === 'formCheck'" class="space-y-6">
        
        <!-- 1. Metadata Form & Checkboxes -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
          <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
            <i class="fa-solid fa-file-invoice mr-2 text-violet-500 text-sm"></i> Thông tin chung & Đánh giá (SOP: {{ run?.sopCode || 'Lân hữu cơ' }})
          </h4>

          <!-- Signature Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người phân tích</label>
              <input type="date" 
                     [(ngModel)]="draft.page1Data.ngayNguoiPhanTich" 
                     (ngModelChange)="onDataChanged()"
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none">
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người thẩm tra</label>
              <input type="date" 
                     [(ngModel)]="draft.page1Data.ngayNguoiThamTra" 
                     (ngModelChange)="onDataChanged()"
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none">
            </div>
          </div>

          <!-- Additional Metadata Fields (Khối lượng, Loại mẫu, Tình trạng mẫu) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            <!-- Khối lượng mẫu -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">2. Khối lượng mẫu (g)</label>
              <div class="flex items-center gap-1.5">
                <button type="button"
                        (click)="draft.page1Data['khoiLuong'] = '10.0'; onDataChanged()"
                        [class]="draft.page1Data['khoiLuong'] === '10.0'
                          ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' 
                          : 'px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'"
                        title="Chọn 10.0 g">
                  10.0g
                </button>
                <input type="text" 
                       [(ngModel)]="draft.page1Data['khoiLuong']" 
                       (ngModelChange)="onDataChanged()"
                       placeholder="Khối lượng..."
                       class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none">
              </div>
            </div>

            <!-- Loại mẫu -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">3. Loại mẫu</label>
              <div class="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full custom-scrollbar">
                <button type="button"
                        (click)="draft.page1Data['loaiMau'] = 'Nông sản tươi'; onDataChanged()"
                        [class]="draft.page1Data['loaiMau'] === 'Nông sản tươi'
                          ? 'px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' 
                          : 'px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'"
                        title="Chọn Nông sản tươi">
                  Tươi
                </button>
                <button type="button"
                        (click)="draft.page1Data['loaiMau'] = 'Nông sản khô'; onDataChanged()"
                        [class]="draft.page1Data['loaiMau'] === 'Nông sản khô'
                          ? 'px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' 
                          : 'px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'"
                        title="Chọn Nông sản khô">
                  Khô
                </button>
                <button type="button"
                        (click)="draft.page1Data['loaiMau'] = 'Thủy sản'; onDataChanged()"
                        [class]="draft.page1Data['loaiMau'] === 'Thủy sản' || draft.page1Data['loaiMau'] === 'Thuỷ sản'
                          ? 'px-2.5 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' 
                          : 'px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'"
                        title="Chọn Thủy sản">
                  Thủy sản
                </button>
                <input type="text" 
                       [(ngModel)]="draft.page1Data['loaiMau']" 
                       (ngModelChange)="onDataChanged()"
                       placeholder="Khác..."
                       class="w-full min-w-[70px] bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none">
              </div>
            </div>

            <!-- Tình trạng mẫu -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">4. Tình trạng mẫu</label>
              <div class="flex items-center gap-1.5">
                <button type="button"
                        (click)="draft.page1Data['tinhTrangMau'] = 'Bình thường'; onDataChanged()"
                        [class]="draft.page1Data['tinhTrangMau'] === 'Bình thường'
                          ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-violet-600 text-white shadow-sm border border-violet-600 transition shrink-0 active:scale-95' 
                          : 'px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'"
                        title="Chọn Bình thường">
                  Bình thường
                </button>
                <input type="text" 
                       [(ngModel)]="draft.page1Data['tinhTrangMau']" 
                       (ngModelChange)="onDataChanged()"
                       placeholder="Khác..."
                       class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none">
              </div>
            </div>
          </div>

          <!-- Checkbox & QC segment controls grid (Dynamic from SOP metadata configuration) -->
          <div *ngIf="draft.page1Data['printFormType'] === 'formCheck'" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            @for (checkbox of checkboxList; track checkbox.key) {
              @if (isGeneralObservation(checkbox.key)) {
                <!-- Standard observation checkbox -->
                <label class="flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-855 border border-slate-100 dark:border-slate-800/60 cursor-pointer select-none transition bg-slate-50/20 dark:bg-slate-900/10">
                  <input type="checkbox" 
                         [(ngModel)]="draft.page1Data[checkbox.key]" 
                         (ngModelChange)="onCheckboxChange(checkbox.key)"
                         class="mt-0.5 w-4 h-4 rounded text-violet-650 border-slate-350 dark:border-slate-700 focus:ring-violet-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700">
                  <div>
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
                  </div>
                </label>
              }
            }
          </div>
        </div>
        
        <!-- 2. Sample Navigation Tabs
 & Print Configuration -->
        <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 shadow-2xs">
          <div class="flex flex-wrap items-center gap-3 overflow-x-auto custom-scrollbar flex-1 min-w-0">
            <span class="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mr-1 shrink-0">Danh sách mẫu:</span>
            
            <!-- Select All / None Toggle Button -->
            <button (click)="toggleSelectAllSamples()" 
                    type="button"
                    class="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-extrabold transition shrink-0 active:scale-95 shadow-2xs">
              <i class="fa-solid" [class.fa-check-double]="!isAllSamplesSelected()" [class.fa-minus]="isAllSamplesSelected()"></i>
              <span class="ml-1.5">{{ isAllSamplesSelected() ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}</span>
            </button>

            @for (sampleCode of run.sampleList; track sampleCode; let idx = $index) {
              <div class="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-2xs hover:border-slate-350 dark:hover:border-slate-700 transition shrink-0">
                <!-- Checkbox to toggle inclusion in PDF -->
                <input type="checkbox" 
                       [ngModel]="draft.resultData[sampleCode]['selected'] !== false"
                       (ngModelChange)="toggleSampleSelected(sampleCode, $event)"
                       title="Bao gồm mẫu này trong báo cáo in PDF"
                       class="ml-1.5 w-4 h-4 rounded text-violet-650 border-slate-300 dark:border-slate-700 focus:ring-violet-500 cursor-pointer">
                
                <button (click)="selectSample(sampleCode)"
                        [class]="activeSampleCode() === sampleCode 
                          ? 'bg-violet-600 text-white font-extrabold shadow-sm border border-violet-655 transition shrink-0 active:scale-95' 
                          : 'bg-transparent text-slate-655 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800 border-0 transition shrink-0 active:scale-95'"
                        class="px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                        [class.opacity-50]="draft.resultData[sampleCode]['selected'] === false">
                  <span [class]="activeSampleCode() === sampleCode
                          ? 'w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white'
                          : 'w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80'">
                    {{ idx + 1 }}
                  </span>
                  <span class="font-mono font-bold">{{ sampleCode }}</span>
                </button>
              </div>
            }
          </div>

          <!-- Unified Print Configuration Toggle -->
          <div class="flex items-center gap-3 pl-4 md:border-l border-slate-200 dark:border-slate-800 shrink-0">
            <label class="flex items-center gap-2.5 p-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 cursor-not-allowed select-none transition bg-slate-50 dark:bg-slate-900/50 shadow-2xs opacity-80"
                   title="Tự động tính toán dựa trên số lượng mẫu được chọn in">
              <input type="checkbox" 
                     [ngModel]="draft.page1Data['checkGopInChung']" 
                     disabled
                     class="w-4 h-4 rounded text-violet-650 border-slate-300 dark:border-slate-700 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed">
              <div class="flex flex-col">
                <span class="text-xs font-black text-violet-750 dark:text-violet-400 tracking-wide">Gộp in chung các mẫu</span>
                <span class="text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5">Tự động ({{ (getSelectedSampleCount() > 1) ? 'Bật vì chọn > 1 mẫu' : 'Tắt vì chọn 1 mẫu' }})</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 3. Compound Checklist & QCs -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in">
          <!-- Panel Header -->
          <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div class="flex-1 min-w-[200px]">
              <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                <i class="fa-solid fa-flask-vial mr-2 text-violet-500 text-sm"></i>
                Bảng kết quả mẫu: <span class="font-mono text-violet-600 dark:text-violet-400 font-extrabold ml-1 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded-lg border border-violet-100 dark:border-violet-900/30">{{ activeSampleCode() }}</span>
              </h4>
              <p class="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 tracking-wide">
                Tổng cộng {{ config.compounds?.length || 0 }} hoạt chất cần kiểm nghiệm.
              </p>
            </div>

            <!-- Search box -->
            <div class="w-full md:w-64 relative">
              <input type="text"
                     [ngModel]="searchQuery()"
                     (ngModelChange)="searchQuery.set($event)"
                     placeholder="Tìm hoạt chất..."
                     class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/15 focus:border-violet-500 transition outline-none">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
            </div>

            <!-- Bulk Actions for the Selected Sample -->
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Mẫu này:</span>
              
              <button (click)="sampleBulkFillND()" 
                      type="button"
                      class="px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs">
                <i class="fa-solid fa-pen-nib text-amber-500"></i>
                <span>Đặt tất cả ND</span>
              </button>

              <button *ngIf="draft.page1Data['printFormType'] === 'formCheck'"
                      (click)="sampleBulkQC()" 
                      type="button"
                      class="px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-955/20 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs">
                <i class="fa-solid fa-circle-check text-emerald-500"></i>
                <span>Tất cả QC Đạt</span>
              </button>

              <button (click)="copyActiveSampleToAll()" 
                      type="button"
                      class="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 active:scale-95"
                      title="Sao chép toàn bộ kết quả của mẫu đang hiển thị cho tất cả các mẫu khác trong mẻ chạy này">
                <i class="fa-solid fa-copy"></i>
                <span>Sao chép mẫu cho cả mẻ</span>
              </button>
            </div>
          </div>

          <!-- Compound List Table -->
          <div class="overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[550px] overflow-y-auto">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-955 border-b border-slate-255/80 dark:border-slate-800 sticky top-0 z-20 shadow-2xs">
                  <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-16">STT</th>
                  <th class="py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[150px]">Hoạt chất</th>
                  <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-28">KPH / ND</th>
                  <th class="py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[130px]">Kết quả (µg/kg)</th>
                  <th *ngIf="draft.page1Data['printFormType'] === 'formCheck'" class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-32">QC1 (Độ thu hồi)</th>
                  <th *ngIf="draft.page1Data['printFormType'] === 'formCheck'" class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-32">QC2 (Độ tuyến tính R2)</th>
                  <th *ngIf="draft.page1Data['printFormType'] === 'formCheck'" class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-32">QC3 (Kết luận)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
                @for (compound of filteredCompounds(); track compound; let idx = $index) {
                  <tr [class]="!isTargetAssigned(activeSampleCode(), compound)
                        ? 'bg-slate-50/50 dark:bg-slate-950/20 text-slate-400/80 dark:text-slate-600 transition-all border-l-4 border-l-transparent duration-150'
                        : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-violet-50/10 dark:focus-within:bg-violet-500/5 border-l-4 border-l-transparent focus-within:border-l-violet-500 duration-150'">
                    <td class="py-2.5 px-4 font-mono text-xs text-slate-400 font-bold text-center">{{ idx + 1 }}</td>
                    <td class="py-2.5 px-4 font-extrabold text-xs flex items-center">
                      @if (!isTargetAssigned(activeSampleCode(), compound)) {
                        <i class="fa-solid fa-lock text-[10px] text-slate-400/80 dark:text-slate-600 mr-1.5" title="Không thuộc chỉ tiêu kiểm nghiệm của mẫu này"></i>
                        <span class="text-slate-400 dark:text-slate-550 line-through decoration-slate-250 dark:decoration-slate-800/60">{{ compoundDisplayNames()[compound] || compound }}</span>
                      } @else {
                        <span class="text-slate-700 dark:text-slate-200">{{ compoundDisplayNames()[compound] || compound }}</span>
                      }
                    </td>
                    
                    <!-- ND Checkbox -->
                    <td class="py-2.5 px-4 text-center">
                      <input type="checkbox"
                             [disabled]="!isTargetAssigned(activeSampleCode(), compound)"
                             [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_nd']"
                             (ngModelChange)="onNdCheckboxChanged(compound)"
                             class="w-4 h-4 rounded text-violet-650 border-slate-350 dark:border-slate-700 focus:ring-violet-500 dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed">
                    </td>

                    <!-- Result Input -->
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [disabled]="!isTargetAssigned(activeSampleCode(), compound)"
                             [(ngModel)]="draft.resultData[activeSampleCode()][compound]"
                             (ngModelChange)="onResultInputChanged(compound)"
                             placeholder="ND / Số lượng..."
                             class="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-center shadow-inner disabled:bg-slate-100/50 dark:disabled:bg-slate-900/30 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-slate-100 dark:disabled:border-slate-850 disabled:cursor-not-allowed">
                    </td>

                    <!-- QC1 Toggle Button Group -->
                    <td *ngIf="draft.page1Data['printFormType'] === 'formCheck'" class="py-1 px-1.5 text-center">
                      <div class="inline-flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80 select-none items-center shadow-3xs"
                           [class.opacity-40]="!isTargetAssigned(activeSampleCode(), compound)"
                           [class.pointer-events-none]="!isTargetAssigned(activeSampleCode(), compound)">
                        <button type="button"
                                (click)="setCompoundQc(compound, 'qc1', 'Đạt')"
                                [class]="draft.resultData[activeSampleCode()][compound + '_qc1'] === 'Đạt'
                                  ? 'px-2 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-3xs transition duration-150 active:scale-95' 
                                  : 'px-2 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                                class="min-w-[32px]">
                          Đạt
                        </button>
                        <button type="button"
                                (click)="setCompoundQc(compound, 'qc1', 'Không đạt')"
                                [class]="draft.resultData[activeSampleCode()][compound + '_qc1'] === 'Không đạt'
                                  ? 'px-2 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-3xs transition duration-150 active:scale-95' 
                                  : 'px-2 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                                class="min-w-[32px]">
                          KĐ
                        </button>
                        <button type="button"
                                (click)="setCompoundQc(compound, 'qc1', 'N/A')"
                                [class]="!draft.resultData[activeSampleCode()][compound + '_qc1'] || draft.resultData[activeSampleCode()][compound + '_qc1'] === 'N/A'
                                  ? 'px-1.5 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-3xs transition duration-150 active:scale-95' 
                                  : 'px-1.5 py-1 text-[9px] font-bold rounded text-slate-450 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95'"
                                class="min-w-[24px]">
                          N/A
                        </button>
                      </div>
                    </td>

                    <!-- QC2 Toggle Button Group -->
                    <td *ngIf="draft.page1Data['printFormType'] === 'formCheck'" class="py-1 px-1.5 text-center">
                      <div class="inline-flex bg-slate-100 dark:bg-slate-955 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80 select-none items-center shadow-3xs"
                           [class.opacity-40]="!isTargetAssigned(activeSampleCode(), compound)"
                           [class.pointer-events-none]="!isTargetAssigned(activeSampleCode(), compound)">
                        <button type="button"
                                (click)="setCompoundQc(compound, 'qc2', 'Đạt')"
                                [class]="draft.resultData[activeSampleCode()][compound + '_qc2'] === 'Đạt'
                                  ? 'px-2 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-3xs transition duration-150 active:scale-95' 
                                  : 'px-2 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                                class="min-w-[32px]">
                          Đạt
                        </button>
                        <button type="button"
                                (click)="setCompoundQc(compound, 'qc2', 'Không đạt')"
                                [class]="draft.resultData[activeSampleCode()][compound + '_qc2'] === 'Không đạt'
                                  ? 'px-2 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-3xs transition duration-150 active:scale-95' 
                                  : 'px-2 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                                class="min-w-[32px]">
                          KĐ
                        </button>
                        <button type="button"
                                (click)="setCompoundQc(compound, 'qc2', 'N/A')"
                                [class]="!draft.resultData[activeSampleCode()][compound + '_qc2'] || draft.resultData[activeSampleCode()][compound + '_qc2'] === 'N/A'
                                  ? 'px-1.5 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-3xs transition duration-150 active:scale-95' 
                                  : 'px-1.5 py-1 text-[9px] font-bold rounded text-slate-450 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95'"
                                class="min-w-[24px]">
                          N/A
                        </button>
                      </div>
                    </td>

                    <!-- QC3 Toggle Button Group -->
                    <td *ngIf="draft.page1Data['printFormType'] === 'formCheck'" class="py-1 px-1.5 text-center">
                      <div class="inline-flex bg-slate-100 dark:bg-slate-955 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80 select-none items-center shadow-3xs"
                           [class.opacity-40]="!isTargetAssigned(activeSampleCode(), compound)"
                           [class.pointer-events-none]="!isTargetAssigned(activeSampleCode(), compound)">
                        <button type="button"
                                (click)="setCompoundQc(compound, 'qc3', 'Đạt')"
                                [class]="draft.resultData[activeSampleCode()][compound + '_qc3'] === 'Đạt'
                                  ? 'px-2 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-3xs transition duration-150 active:scale-95' 
                                  : 'px-2 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                                class="min-w-[32px]">
                          Đạt
                        </button>
                        <button type="button"
                                (click)="setCompoundQc(compound, 'qc3', 'Không đạt')"
                                [class]="draft.resultData[activeSampleCode()][compound + '_qc3'] === 'Không đạt'
                                  ? 'px-2 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-3xs transition duration-150 active:scale-95' 
                                  : 'px-2 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                                class="min-w-[32px]">
                          KĐ
                        </button>
                        <button type="button"
                                (click)="setCompoundQc(compound, 'qc3', 'N/A')"
                                [class]="!draft.resultData[activeSampleCode()][compound + '_qc3'] || draft.resultData[activeSampleCode()][compound + '_qc3'] === 'N/A'
                                  ? 'px-1.5 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-3xs transition duration-150 active:scale-95' 
                                  : 'px-1.5 py-1 text-[9px] font-bold rounded text-slate-450 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95'"
                                class="min-w-[24px]">
                          N/A
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: CALIBRATION CURVE & SAMPLE RUNS -->
      <div *ngIf="draft.page1Data['printFormType'] === 'formDon'" class="space-y-6">
        
        <!-- 0. Signature Dates & General Metadata -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
          <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
            <i class="fa-solid fa-calendar mr-2 text-violet-500 text-sm"></i> Thông tin chung & Đánh giá (SOP: {{ run?.sopCode || 'Lân hữu cơ' }})
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người phân tích</label>
              <input type="date" 
                     [(ngModel)]="draft.page1Data.ngayNguoiPhanTich" 
                     (ngModelChange)="onDataChanged()"
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none">
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người thẩm tra</label>
              <input type="date" 
                     [(ngModel)]="draft.page1Data.ngayNguoiThamTra" 
                     (ngModelChange)="onDataChanged()"
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none">
            </div>
          </div>
        </div>

        <!-- 1. Calibration Curve Parameters -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
          <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
            <i class="fa-solid fa-chart-line mr-2 text-violet-500 text-sm"></i>
            Khai báo Đường chuẩn & QC sắc ký
          </h4>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left Side: R^2, Blank Name, Spike Name, QC FINAL -->
            <div class="lg:col-span-4 space-y-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Tên mẫu Trắng (Blank)</label>
                <input type="text" 
                       [(ngModel)]="draft.page1Data['blankName']" 
                       (ngModelChange)="onDataChanged()"
                       (focus)="$any($event.target).select()"
                       placeholder="BLANK"
                       class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition">
              </div>
              
              <div>
                <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Tên mẫu Thêm chuẩn (Spike)</label>
                <input type="text" 
                       [(ngModel)]="draft.page1Data['spikeName']" 
                       (ngModelChange)="onDataChanged()"
                       (focus)="$any($event.target).select()"
                       placeholder="SPIKE"
                       class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition">
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Hệ số xác định R²</label>
                <input type="text" 
                       [(ngModel)]="draft.page1Data['r2']" 
                       (ngModelChange)="onDataChanged()"
                       (focus)="$any($event.target).select()"
                       placeholder="0.999..."
                       class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-extrabold text-indigo-655 dark:text-indigo-400 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition">
              </div>
              
              <div>
                <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Mẫu QC FINAL</label>
                <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 cursor-pointer select-none transition hover:bg-slate-50 dark:hover:bg-slate-855">
                  <input type="checkbox" 
                         [(ngModel)]="draft.page1Data['hasFinal']" 
                         (ngModelChange)="onFinalToggled()"
                         class="w-4 h-4 rounded text-violet-650 border-slate-350 dark:border-slate-700 focus:ring-violet-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700">
                  <span class="text-xs font-bold text-slate-750 dark:text-slate-250">Thêm mẫu kiểm tra cuối mẻ (FINAL)</span>
                </label>
              </div>
            </div>

            <!-- Right Side: Calibration points (5 points C0-C4) -->
            <div class="lg:col-span-8">
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">
                Các Điểm Đường chuẩn (Calibration Curve Points)
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                @for (pt of draft.page1Data['calibPoints']; track $index) {
                  <div class="bg-slate-50/40 dark:bg-slate-955/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col gap-2 hover:shadow-xs hover:border-violet-400/50 dark:hover:border-violet-500/40 transition duration-200 group">
                    <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                      <span class="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 group-hover:text-violet-500 transition duration-200">Chuẩn C{{ $index }}</span>
                      <span class="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                    </div>
                    <div>
                      <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Số vial</label>
                      <input type="text" 
                             [(ngModel)]="pt['loSo']" 
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             placeholder="..."
                             class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none text-center transition">
                    </div>
                    <div>
                      <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Nồng độ (ng/mL)</label>
                      <input type="text" 
                             [(ngModel)]="pt['hamLuong']" 
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             placeholder="..."
                             class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 outline-none text-center transition">
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Sample Spreadsheet and Parameters -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
              <i class="fa-solid fa-table mr-2 text-violet-500 text-sm"></i>
              Bảng thông số chạy mẫu & Kết quả
            </h4>

            <div class="flex flex-wrap items-center gap-2">
              <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Hoạt chất:</label>
              <select [(ngModel)]="draft.page1Data['activeCompound']"
                      (ngModelChange)="onDataChanged()"
                      class="bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-xs font-bold text-violet-600 dark:text-violet-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition cursor-pointer max-w-[200px]">
                @for (c of assignedCompoundsForFormDon(); track c) {
                  <option [value]="c">{{ compoundDisplayNames()[c] || c }}</option>
                }
              </select>

              <button (click)="bulkFillNDFormDon()" 
                      class="px-2 py-1 bg-slate-50 dark:bg-slate-955 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-slate-800 hover:border-amber-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
                      title="Đặt toàn bộ các ô kết quả chưa điền là ND">
                <i class="fa-solid fa-pen-clip"></i>
                <span>Điền ND</span>
              </button>
            </div>
          </div>

          <!-- Spreadsheet Table -->
          <div class="overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl">
            <table class="w-full text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800">
                  <th class="py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-12">STT</th>
                  <th class="py-2.5 px-3 text-left font-bold text-slate-500 dark:text-slate-400 min-w-[120px]">Mã số mẫu</th>
                  <th class="py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-32">Khối lượng (g)</th>
                  <th class="py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-32">HS pha loãng F</th>
                  <th class="py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-28">Số lọ (Vial)</th>
                  <th class="py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 w-32">Kết quả (ng/g)</th>
                  <th class="py-2.5 px-3 text-left font-bold text-slate-500 dark:text-slate-400 min-w-[140px]">Ghi chú</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                @for (row of getChromatographyRows(); track row.key; let idx = $index) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10"
                      [class.opacity-60]="draft.resultData[row.key]['selected'] === false"
                      [ngClass]="{
                        'bg-indigo-50/15 dark:bg-indigo-955/5 border-l-4 border-l-indigo-500/60': row.type === 'QC'
                      }">
                    <td class="py-2 px-3 font-mono text-slate-400 text-center font-bold">{{ idx + 1 }}</td>
                    <td class="py-2 px-3 font-bold text-slate-700 dark:text-slate-200 font-mono flex items-center gap-1.5">
                      <input type="checkbox"
                             [(ngModel)]="draft.resultData[row.key]['selected']"
                             (ngModelChange)="onDataChanged()"
                             class="w-3.5 h-3.5 rounded text-violet-650 border-slate-350 dark:border-slate-700 focus:ring-violet-500">
                      <span>{{ row.label }}</span>
                    </td>
                    
                    <!-- Weight (khoiLuong) -->
                    <td class="py-1 px-1.5">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['khoiLuong']"
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             class="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition">
                    </td>

                    <!-- Dilution (heSoPhaLoang / hSoPhaLoang) -->
                    <td class="py-1 px-1.5">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['heSoPhaLoang']"
                             (ngModelChange)="syncDilution(row.key)"
                             (focus)="$any($event.target).select()"
                             class="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition">
                    </td>

                    <!-- Vial Number (loSo) -->
                    <td class="py-1 px-1.5">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['loSo']"
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             class="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-center font-mono font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition">
                    </td>

                    <!-- Kết quả (ng/g) -->
                    <td class="py-1 px-1.5">
                      <input type="text"
                             [disabled]="row.type === 'REGULAR' && !isTargetAssigned(row.key, draft.page1Data['activeCompound'])"
                             [(ngModel)]="draft.resultData[row.key][draft.page1Data['activeCompound']]"
                             (ngModelChange)="onChromResultChanged(row.key)"
                             (focus)="$any($event.target).select()"
                             placeholder="ND/Kết quả"
                             class="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition disabled:bg-slate-100/50 dark:disabled:bg-slate-900/30 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-slate-100 dark:disabled:border-slate-850 disabled:cursor-not-allowed">
                    </td>

                    <!-- Ghi chú -->
                    <td class="py-1 px-1.5">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key][draft.page1Data['activeCompound'] + '_ghiChu']"
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             placeholder="Ghi chú..."
                             class="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-left text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none transition">
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

      `
})
export class SopLanHuuCoEntryComponent implements OnInit, OnChanges {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;

  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private masterTargetService = inject(MasterTargetService);
  masterTargets = signal<any[]>([]);
  compoundDisplayNames = signal<Record<string, string>>({});
  checkboxList: { key: string; label: string }[] = [];
  
  activeTab = signal<'compounds' | 'chromatography'>('compounds');
  activeSampleCode = signal<string>('');
  searchQuery = signal<string>('');

  filteredCompounds = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const compounds = this.config?.compounds || [];
    if (!q) return compounds;
    return compounds.filter((c: string) => {
      const displayName = (this.compoundDisplayNames()[c] || c).toLowerCase();
      return c.toLowerCase().includes(q) || displayName.includes(q);
    });
  });

  /** Danh sách hoạt chất được giao cho ít nhất 1 mẫu trong mẻ này (dùng cho Form Đơn) */
  assignedCompoundsForFormDon = computed(() => {
    const compounds: string[] = this.config?.compounds || [];
    const sampleList: string[] = this.run?.sampleList || [];
    if (!sampleList.length) return compounds;
    const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
    if (!targetMap) return compounds;
    return compounds.filter((c: string) =>
      sampleList.some((s: string) => this.isTargetAssigned(s, c))
    );
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['run'] && !changes['run'].firstChange) {
      const newRun = changes['run'].currentValue;
      if (newRun && newRun.sampleList && newRun.sampleList.length > 0) {
        // Reset to first sample of the new filtered list when prefix filter changes
        const currentActive = this.activeSampleCode();
        if (!newRun.sampleList.includes(currentActive)) {
          this.activeSampleCode.set(newRun.sampleList[0]);
        }
      }
    }
  }

  async ngOnInit() {
    if (this.run.sampleList && this.run.sampleList.length > 0) {
      this.activeSampleCode.set(this.run.sampleList[0]);
    }

    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }
    if (!this.draft.page1Data) {
      this.draft.page1Data = {};
    }
    if (!this.draft.resultData) {
      this.draft.resultData = {};
    }

    // Initialize printFormType (default: formCheck)
    if (this.draft.page1Data['printFormType'] === undefined) {
      this.draft.page1Data['printFormType'] = 'formCheck';
    }

    // Initialize activeCompound: ưu tiên hoạt chất đầu tiên được giao cho ít nhất 1 mẫu
    if (!this.draft.page1Data['activeCompound']) {
      const compounds: string[] = this.config?.compounds || [];
      const sampleList: string[] = this.run?.sampleList || [];
      const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
      const firstAssigned = targetMap
        ? compounds.find((c: string) => sampleList.some((s: string) => this.isTargetAssigned(s, c)))
        : compounds[0];
      if (firstAssigned) {
        this.draft.page1Data['activeCompound'] = firstAssigned;
      }
    }

    // Initialize R^2 if formDon
    if (this.draft.page1Data['printFormType'] === 'formDon') {
      if (!this.draft.page1Data['r2']) {
        this.draft.page1Data['r2'] = '0.999';
      }
    }

    // Initialize default page1Data.khoiLuong to '10.0'
    if (this.draft.page1Data['khoiLuong'] === undefined || this.draft.page1Data['khoiLuong'] === null || this.draft.page1Data['khoiLuong'] === '') {
      this.draft.page1Data['khoiLuong'] = '10.0';
    }

    // Initialize calibration points (C0-C4: 5 points)
    const defaultCalib = [
      { loSo: '1', hamLuong: '0' },
      { loSo: '2', hamLuong: '5' },
      { loSo: '3', hamLuong: '10' },
      { loSo: '4', hamLuong: '20' },
      { loSo: '5', hamLuong: '50' }
    ];
    if (!this.draft.page1Data['calibPoints'] || this.draft.page1Data['calibPoints'].length !== 5) {
      this.draft.page1Data['calibPoints'] = defaultCalib;
    } else {
      this.draft.page1Data['calibPoints'].forEach((pt: any, idx: number) => {
        if (pt.hamLuong === undefined || pt.hamLuong === null || String(pt.hamLuong).trim() === '') {
          pt.hamLuong = defaultCalib[idx].hamLuong;
        }
        if (pt.loSo === undefined || pt.loSo === null || String(pt.loSo).trim() === '') {
          pt.loSo = defaultCalib[idx].loSo;
        }
      });
    }

    if (this.draft.page1Data['r2'] === undefined) {
      this.draft.page1Data['r2'] = '';
    }

    if (this.draft.page1Data['blankName'] === undefined) {
      this.draft.page1Data['blankName'] = '';
    }

    if (this.draft.page1Data['spikeName'] === undefined) {
      this.draft.page1Data['spikeName'] = '';
    }

    if (this.draft.page1Data['hasFinal'] === undefined) {
      this.draft.page1Data['hasFinal'] = false;
    }


    if (this.run.sampleList) {
      this.run.sampleList.forEach((sampleCode: string, idx: number) => {
        if (!this.draft.resultData[sampleCode]) {
          this.draft.resultData[sampleCode] = {};
        }
        const sRes = this.draft.resultData[sampleCode];
        if (sRes['selected'] === undefined) {
          sRes['selected'] = true;
        }
        if (sRes['khoiLuong'] === undefined) {
          sRes['khoiLuong'] = '10.0';
        }
        if (sRes['heSoPhaLoang'] === undefined || sRes['heSoPhaLoang'] === null || String(sRes['heSoPhaLoang']).trim() === '') {
          sRes['heSoPhaLoang'] = '1';
        }
        if (sRes['hSoPhaLoang'] === undefined || sRes['hSoPhaLoang'] === null || String(sRes['hSoPhaLoang']).trim() === '') {
          sRes['hSoPhaLoang'] = '1';
        }
        if (sRes['loSo'] === undefined || sRes['loSo'] === null || String(sRes['loSo']).trim() === '') {
          sRes['loSo'] = (9 + idx).toString();
        }
        if (sRes['checkBoSungNuoc'] === undefined) {
          sRes['checkBoSungNuoc'] = 'không';
        }
        if (sRes['checkHonHopLamSach'] === undefined) {
          sRes['checkHonHopLamSach'] = 'B1';
        }
      });
    }

    this.updateGopInChungState();

    // Set default value for loaiMau if not set (default Thủy sản)
    if (this.draft.page1Data['loaiMau'] === undefined || this.draft.page1Data['loaiMau'] === null || this.draft.page1Data['loaiMau'] === '') {
      this.draft.page1Data['loaiMau'] = 'Thủy sản';
    }

    // Set default value for tinhTrangMau if not set (default Bình thường)
    if (this.draft.page1Data['tinhTrangMau'] === undefined || this.draft.page1Data['tinhTrangMau'] === null || this.draft.page1Data['tinhTrangMau'] === '') {
      this.draft.page1Data['tinhTrangMau'] = 'Bình thường';
    }

    // Set other evaluation checkboxes to true (Đạt) if not set
    if (this.checkboxList) {
      this.checkboxList.forEach(cb => {
        if (cb.key !== 'checkTatCaND' && cb.key !== 'checkCoMauPhatHien' && cb.key !== 'qcNhanDang' && cb.key !== 'checkGopInChung') {
          if (this.draft.page1Data[cb.key] === undefined || this.draft.page1Data[cb.key] === null) {
            this.draft.page1Data[cb.key] = true;
          }
        }
      });
    }

    try {
      const analytes = await this.masterTargetService.getAll();
      this.masterTargets.set(analytes);
      this.buildDisplayNameMap();
    } catch (e) {
      console.warn('Failed to load master analytes', e);
    }
    this.prefillUnassignedTargets();
  }

  buildDisplayNameMap() {
    if (!this.config.compounds) return;
    const map: Record<string, string> = {};
    for (const compound of this.config.compounds) {
      map[compound] = this.getCompoundDisplayName(compound);
    }
    this.compoundDisplayNames.set(map);
  }

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets());
  }

  selectSample(sampleCode: string) {
    this.activeSampleCode.set(sampleCode);
  }

  updateRecovery(key: string, compound: string) {
    const row = this.draft.resultData[key];
    if (!row) return;
    const val = parseFloat(row[compound] || '');
    if (!isNaN(val)) {
      const rec = ((val / 10.0) * 100).toFixed(1);
      row[compound + '_ghiChu'] = `${rec}%`;
    } else {
      row[compound + '_ghiChu'] = '';
    }
  }

  onChromResultChanged(key: string) {
    if (key === 'QC_SPIKE' || key === 'QC_FINAL') {
      this.updateRecovery(key, this.draft.page1Data['activeCompound']);
    }
    this.onDataChanged();
  }

  onDataChanged() {
    if (this.draft.resultData && this.draft.resultData['QC_SPIKE'] && this.draft.resultData['QC_FINAL']) {
      this.draft.resultData['QC_FINAL']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || '';
      this.draft.resultData['QC_FINAL']['khoiLuong'] = this.draft.resultData['QC_SPIKE']['khoiLuong'] || '';
      this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = this.draft.resultData['QC_SPIKE']['heSoPhaLoang'] || '';
      this.draft.resultData['QC_FINAL']['checkBoSungNuoc'] = this.draft.resultData['QC_SPIKE']['checkBoSungNuoc'] || 'không';
      this.draft.resultData['QC_FINAL']['checkHonHopLamSach'] = this.draft.resultData['QC_SPIKE']['checkHonHopLamSach'] || 'B1';
    }

    if (this.config?.compounds) {
      this.config.compounds.forEach((c: string) => {
        this.updateRecovery('QC_SPIKE', c);
        this.updateRecovery('QC_FINAL', c);
      });
    }

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

  isTargetAssigned(sampleCode: string, compound: string): boolean {
    if (!this.run) return true;
    const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
    if (!targetMap) return true;
    const assigned = targetMap[sampleCode];
    if (!assigned || assigned.length === 0) return true;
    return isCompoundAssigned(assigned, compound);
  }

  prefillUnassignedTargets() {
    const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
    if (!this.run || !targetMap || !this.config.compounds) return;
    const sampleList = this.run.sampleList || [];
    let changed = false;

    sampleList.forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {};
      }
      const row = this.draft.resultData[sampleCode];
      this.config.compounds.forEach((c: string) => {
        if (!this.isTargetAssigned(sampleCode, c)) {
          if (row[c] !== 'N/A' && row[c] !== '—') {
            row[c] = 'N/A';
            row[`${c}_nd`] = false;
            row[`${c}_qc1`] = 'N/A';
            row[`${c}_qc2`] = 'N/A';
            row[`${c}_qc3`] = 'N/A';
            changed = true;
          }
        }
      });
    });

    if (changed) {
      this.onDataChanged();
    }
  }

  onNdCheckboxChanged(compound: string) {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      if (row[`${compound}_nd`]) {
        row[compound] = '';
        row[`${compound}_qc1`] = 'Đạt';
        row[`${compound}_qc2`] = 'Đạt';
        row[`${compound}_qc3`] = 'Đạt';
      } else {
        row[compound] = '';
        row[`${compound}_qc1`] = 'N/A';
        row[`${compound}_qc2`] = 'N/A';
        row[`${compound}_qc3`] = 'N/A';
      }
    }
    this.onDataChanged();
  }

  onResultInputChanged(compound: string) {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      const rawVal = row[compound];
      const val = rawVal !== undefined && rawVal !== null ? String(rawVal) : '';
      if (val.trim() !== '') {
        row[`${compound}_nd`] = false;
        row[`${compound}_qc1`] = 'N/A';
        row[`${compound}_qc2`] = 'N/A';
        row[`${compound}_qc3`] = 'N/A';
      } else {
        row[`${compound}_nd`] = false;
        row[`${compound}_qc1`] = 'N/A';
        row[`${compound}_qc2`] = 'N/A';
        row[`${compound}_qc3`] = 'N/A';
      }
    }
    this.onDataChanged();
  }

  sampleBulkFillND() {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.config.compounds) {
      this.config.compounds.forEach((c: string) => {
        if (this.isTargetAssigned(active, c)) {
          row[c] = '';
          row[`${c}_nd`] = true;
          row[`${c}_qc1`] = 'Đạt';
          row[`${c}_qc2`] = 'Đạt';
          row[`${c}_qc3`] = 'Đạt';
        }
      });
    }
    this.onDataChanged();
  }

  sampleBulkQC() {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.config.compounds) {
      this.config.compounds.forEach((c: string) => {
        if (this.isTargetAssigned(active, c)) {
          row[`${c}_qc1`] = 'Đạt';
          row[`${c}_qc2`] = 'Đạt';
          row[`${c}_qc3`] = 'Đạt';
        }
      });
    }
    this.onDataChanged();
  }

  copyActiveSampleToAll() {
    const sourceSample = this.activeSampleCode();
    const sourceData = this.draft.resultData[sourceSample];
    if (!sourceData || !this.config.compounds) return;

    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      if (sampleCode !== sourceSample) {
        const destRow = this.draft.resultData[sampleCode];
        if (destRow) {
          this.config.compounds.forEach((c: string) => {
            if (this.isTargetAssigned(sampleCode, c)) {
              const sourceValue = this.isTargetAssigned(sourceSample, c) ? sourceData[c] : '';
              const sourceNd = this.isTargetAssigned(sourceSample, c) ? sourceData[`${c}_nd`] : true;
              const sourceQc1 = this.isTargetAssigned(sourceSample, c) ? sourceData[`${c}_qc1`] : 'Đạt';
              const sourceQc2 = this.isTargetAssigned(sourceSample, c) ? sourceData[`${c}_qc2`] : 'Đạt';
              const sourceQc3 = this.isTargetAssigned(sourceSample, c) ? sourceData[`${c}_qc3`] : 'Đạt';

              destRow[c] = sourceValue || '';
              destRow[`${c}_nd`] = sourceNd !== false;
              destRow[`${c}_qc1`] = sourceQc1 || 'Đạt';
              destRow[`${c}_qc2`] = sourceQc2 || 'Đạt';
              destRow[`${c}_qc3`] = sourceQc3 || 'Đạt';
            }
          });
          // Sync sample metadata as well
          destRow['khoiLuong'] = sourceData['khoiLuong'] || '10.0';
          destRow['heSoPhaLoang'] = sourceData['heSoPhaLoang'] || '1';
          destRow['hSoPhaLoang'] = sourceData['hSoPhaLoang'] || '1';
          destRow['checkBoSungNuoc'] = sourceData['checkBoSungNuoc'] || 'không';
          destRow['checkHonHopLamSach'] = sourceData['checkHonHopLamSach'] || 'B1';
        }
      }
    });
    this.onDataChanged();
  }

  getSelectedSampleCount(): number {
    const sampleList = this.run?.sampleList || [];
    return sampleList.filter((s: string) => this.draft.resultData[s]?.['selected'] !== false).length;
  }

  private updateGopInChungState() {
    const shouldGop = this.getSelectedSampleCount() > 1;
    if (this.draft.page1Data['checkGopInChung'] !== shouldGop) {
      this.draft.page1Data['checkGopInChung'] = shouldGop;
    }
  }

  toggleSampleSelected(sampleCode: string, checked: boolean) {
    if (!this.draft.resultData[sampleCode]) {
      this.draft.resultData[sampleCode] = {};
    }
    this.draft.resultData[sampleCode]['selected'] = checked;
    this.updateGopInChungState();
    this.onDataChanged();
  }

  isAllSamplesSelected(): boolean {
    const sampleList = this.run?.sampleList || [];
    if (sampleList.length === 0) return false;
    return sampleList.every((s: string) => this.draft.resultData[s]?.['selected'] !== false);
  }

  toggleSelectAllSamples() {
    const targetState = !this.isAllSamplesSelected();
    const sampleList = this.run?.sampleList || [];
    sampleList.forEach((s: string) => {
      if (!this.draft.resultData[s]) {
        this.draft.resultData[s] = {};
      }
      this.draft.resultData[s]['selected'] = targetState;
    });
    this.updateGopInChungState();
    this.onDataChanged();
  }

  isGeneralObservation(key: string): boolean {
    return key === 'checkTatCaND' || key === 'checkCoMauPhatHien' || key === 'checkGopInChung';
  }

  setQcStatus(key: string, value: boolean | null) {
    this.draft.page1Data[key] = value;
    this.onDataChanged();
  }

  setCompoundQc(compound: string, qcKey: 'qc1' | 'qc2' | 'qc3', status: 'Đạt' | 'Không đạt' | 'N/A') {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      row[`${compound}_${qcKey}`] = status;
      this.onDataChanged();
    }
  }

  setPrepField(sampleCode: string, fieldName: string, value: string) {
    if (this.draft.resultData[sampleCode]) {
      this.draft.resultData[sampleCode][fieldName] = value;
      this.onDataChanged();
    }
  }

  syncDilution(sampleCode: string) {
    const val = this.draft.resultData[sampleCode]['heSoPhaLoang'] || '1';
    this.draft.resultData[sampleCode]['hSoPhaLoang'] = val;
    this.onDataChanged();
  }

  setPrintFormType(type: 'formCheck' | 'formDon') {
    this.draft.page1Data['printFormType'] = type;

    // Automatically assign appropriate vials when switching form type
    const defaultBlankVial = '7';
    const defaultSpikeVial = '8';
    
    if (this.draft.resultData['QC_BLANK']) {
      this.draft.resultData['QC_BLANK']['loSo'] = defaultBlankVial;
    }
    if (this.draft.resultData['QC_SPIKE']) {
      this.draft.resultData['QC_SPIKE']['loSo'] = defaultSpikeVial;
    }
    if (this.draft.resultData['QC_FINAL']) {
      this.draft.resultData['QC_FINAL']['loSo'] = defaultSpikeVial;
    }

    if (type === 'formCheck') {
      this.activeTab.set('compounds');
    } else {
      this.activeTab.set('chromatography');
      if (!this.draft.page1Data['r2']) {
        this.draft.page1Data['r2'] = '0.999';
      }
    }
    this.onDataChanged();
  }

  onFinalToggled() {
    if (this.draft.page1Data['hasFinal']) {
      const spike = this.draft.resultData['QC_SPIKE'];
      this.draft.resultData['QC_FINAL'] = {
        loSo: spike?.['loSo'] || '8',
        selected: true,
        khoiLuong: spike?.['khoiLuong'] || '10.0',
        heSoPhaLoang: spike?.['heSoPhaLoang'] || '1',
        checkBoSungNuoc: spike?.['checkBoSungNuoc'] || 'không',
        checkHonHopLamSach: spike?.['checkHonHopLamSach'] || 'B1'
      };
    } else {
      delete this.draft.resultData['QC_FINAL'];
    }
    this.onDataChanged();
  }

  bulkFillNDFormDon() {
    const active = this.draft.page1Data['activeCompound'];
    if (!active) return;
    const rows = this.getChromatographyRows();
    rows.forEach((row: any) => {
      const rowData = this.draft.resultData[row.key];
      if (rowData && rowData['selected'] !== false) {
        if (!rowData[active] || rowData[active]?.trim() === '') {
          rowData[active] = 'ND';
        }
      }
    });
    this.onDataChanged();
  }

  bulkClearAllFormDon() {
    const active = this.draft.page1Data['activeCompound'];
    if (!active) return;
    const rows = this.getChromatographyRows();
    rows.forEach((row: any) => {
      const rowData = this.draft.resultData[row.key];
      if (rowData) {
        rowData[active] = '';
        rowData[active + '_ghiChu'] = '';
      }
    });
    this.onDataChanged();
  }

  getChromatographyRows(): any[] {
    const list = [];
    const isDon = this.draft.page1Data['printFormType'] === 'formDon';
    const defaultBlankVial = '7';
    const defaultSpikeVial = '8';
    
    // 1. QC_BLANK
    const blankName = this.draft.page1Data['blankName'] || 'BLANK';
    if (!this.draft.resultData['QC_BLANK']) {
      const randW = isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0';
      this.draft.resultData['QC_BLANK'] = {
        loSo: defaultBlankVial,
        selected: true,
        khoiLuong: randW,
        heSoPhaLoang: '1',
        checkBoSungNuoc: 'không',
        checkHonHopLamSach: 'B1'
      };
    } else {
      this.draft.resultData['QC_BLANK']['loSo'] = this.draft.resultData['QC_BLANK']['loSo'] || defaultBlankVial;
      if (isDon && (this.draft.resultData['QC_BLANK']['khoiLuong'] === undefined || this.draft.resultData['QC_BLANK']['khoiLuong'] === '' || this.draft.resultData['QC_BLANK']['khoiLuong'] === '10.0')) {
        this.draft.resultData['QC_BLANK']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
      }
    }
    list.push({ key: 'QC_BLANK', label: blankName, type: 'QC' });

    // 2. QC_SPIKE
    const spikeName = this.draft.page1Data['spikeName'] || 'SPIKE';
    if (!this.draft.resultData['QC_SPIKE']) {
      const randW = isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0';
      this.draft.resultData['QC_SPIKE'] = {
        loSo: defaultSpikeVial,
        selected: true,
        khoiLuong: randW,
        heSoPhaLoang: '1',
        checkBoSungNuoc: 'không',
        checkHonHopLamSach: 'B1'
      };
    } else {
      this.draft.resultData['QC_SPIKE']['loSo'] = this.draft.resultData['QC_SPIKE']['loSo'] || defaultSpikeVial;
      if (isDon && (this.draft.resultData['QC_SPIKE']['khoiLuong'] === undefined || this.draft.resultData['QC_SPIKE']['khoiLuong'] === '' || this.draft.resultData['QC_SPIKE']['khoiLuong'] === '10.0')) {
        this.draft.resultData['QC_SPIKE']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
      }
    }
    list.push({ key: 'QC_SPIKE', label: spikeName, type: 'QC' });

    // 3. Regular samples
    if (this.run && this.run.sampleList) {
      this.run.sampleList.forEach((sampleCode: string, idx: number) => {
        if (!this.draft.resultData[sampleCode]) {
          const randW = isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0';
          this.draft.resultData[sampleCode] = {
            loSo: (9 + idx).toString(),
            selected: true,
            khoiLuong: randW,
            heSoPhaLoang: '1',
            checkBoSungNuoc: 'không',
            checkHonHopLamSach: 'B1'
          };
        } else {
          if (isDon && (this.draft.resultData[sampleCode]['khoiLuong'] === undefined || this.draft.resultData[sampleCode]['khoiLuong'] === '' || this.draft.resultData[sampleCode]['khoiLuong'] === '10.0')) {
            this.draft.resultData[sampleCode]['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
          }
          if (this.draft.resultData[sampleCode]['heSoPhaLoang'] === undefined || this.draft.resultData[sampleCode]['heSoPhaLoang'] === null || String(this.draft.resultData[sampleCode]['heSoPhaLoang']).trim() === '') {
            this.draft.resultData[sampleCode]['heSoPhaLoang'] = '1';
          }
          if (this.draft.resultData[sampleCode]['hSoPhaLoang'] === undefined || this.draft.resultData[sampleCode]['hSoPhaLoang'] === null || String(this.draft.resultData[sampleCode]['hSoPhaLoang']).trim() === '') {
            this.draft.resultData[sampleCode]['hSoPhaLoang'] = '1';
          }
          if (this.draft.resultData[sampleCode]['loSo'] === undefined || this.draft.resultData[sampleCode]['loSo'] === null || String(this.draft.resultData[sampleCode]['loSo']).trim() === '') {
            this.draft.resultData[sampleCode]['loSo'] = (9 + idx).toString();
          }
        }
        list.push({ key: sampleCode, label: sampleCode, type: 'REGULAR' });
      });
    }

    // 4. QC_FINAL (optional)
    if (this.draft.page1Data['hasFinal']) {
      if (!this.draft.resultData['QC_FINAL']) {
        const spike = this.draft.resultData['QC_SPIKE'];
        const finalVial = spike?.['loSo'] || defaultSpikeVial;
        const finalW = spike?.['khoiLuong'] || (isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0');
        const finalF = spike?.['heSoPhaLoang'] || '1';
        this.draft.resultData['QC_FINAL'] = {
          loSo: finalVial,
          selected: true,
          khoiLuong: finalW,
          heSoPhaLoang: finalF,
          checkBoSungNuoc: 'không',
          checkHonHopLamSach: 'B1'
        };
      } else {
        const spike = this.draft.resultData['QC_SPIKE'];
        if (spike) {
          this.draft.resultData['QC_FINAL']['loSo'] = spike['loSo'] || defaultSpikeVial;
          this.draft.resultData['QC_FINAL']['khoiLuong'] = spike['khoiLuong'] || (isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0');
          this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = spike['heSoPhaLoang'] || '1';
        }
      }
      list.push({ key: 'QC_FINAL', label: 'FINAL', type: 'QC' });
    }

    return list;
  }
}

