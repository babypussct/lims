import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintService } from '../services/print.service';
import { formatDate, formatNum, cleanName } from '../utils/utils';

@Component({
  selector: 'app-print-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hidden container on screen, Visible on Print -->
    <div class="print-container font-serif text-black leading-tight">
       @for (job of printService.jobs(); track job.sop.id) {
         <div class="print-page bg-white p-0 relative">
           
           <!-- ISO Header -->
           <div class="flex border border-black mb-4">
              <div class="w-24 flex items-center justify-center border-r border-black p-2">
                 <i class="fa-solid fa-flask text-3xl text-black"></i>
              </div>
              <div class="flex-1 flex flex-col items-center justify-center border-r border-black p-2 text-center">
                 <h1 class="text-lg font-bold uppercase tracking-wide">Phiếu Dự Trù Hóa Chất & Vật Tư</h1>
                 <div class="text-xs uppercase mt-1">Phòng Thí Nghiệm Trung Tâm (LIMS Lab)</div>
              </div>
              <div class="w-32 text-[10px] p-2 flex flex-col justify-center gap-1">
                 <div class="flex justify-between"><span>Mã BM:</span> <span class="font-bold">BM.04.01</span></div>
                 <div class="flex justify-between"><span>Lần BH:</span> <span class="font-bold">03</span></div>
                 <div class="flex justify-between"><span>Ngày:</span> <span>01/2024</span></div>
              </div>
           </div>

           <!-- General Info -->
           <div class="mb-4">
              <div class="flex justify-between items-end mb-2">
                 <h2 class="text-xl font-bold uppercase">{{job.sop.name}}</h2>
                 <div class="text-xs text-right">
                    <div>Ref: <span class="font-bold">{{job.sop.ref || 'N/A'}}</span> | ID: {{job.sop.id}}</div>
                    <div>Ngày in: {{formatDate(job.date)}}</div>
                 </div>
              </div>
              
              <!-- Inputs Summary Box -->
              <div class="border border-black p-2 text-xs flex flex-wrap gap-y-2 gap-x-6 bg-slate-50">
                 @for (inp of job.sop.inputs; track inp.var) {
                    <div class="flex gap-1 min-w-[120px]">
                       <span class="italic text-slate-600">{{inp.label}}:</span>
                       <span class="font-bold">{{job.inputs[inp.var]}}</span>
                    </div>
                 }
                 <div class="flex gap-1 min-w-[120px] ml-auto border-l border-slate-400 pl-4">
                    <span class="italic text-slate-600">Hệ số an toàn:</span>
                    <span class="font-bold">+{{job.margin}}%</span>
                 </div>
              </div>
           </div>

           <!-- Main Table -->
           <table class="w-full text-xs border-collapse border border-black mb-4">
             <thead>
                <tr class="bg-gray-100">
                   <th class="border border-black px-2 py-1.5 text-center w-10">STT</th>
                   <th class="border border-black px-2 py-1.5 text-left">Tên Hóa chất / Vật tư / Kit</th>
                   <th class="border border-black px-2 py-1.5 text-right w-24">Định mức</th>
                   <th class="border border-black px-2 py-1.5 text-right w-24">Tổng Cần</th>
                   <th class="border border-black px-2 py-1.5 text-center w-16">Đơn vị</th>
                   <th class="border border-black px-2 py-1.5 text-left w-32">Ghi chú Kho</th>
                </tr>
             </thead>
             <tbody>
                @for (item of job.items; track item.name; let i = $index) {
                   <tr class="break-inside-avoid">
                      <td class="border border-black px-2 py-1.5 text-center align-top">{{i + 1}}</td>
                      <td class="border border-black px-2 py-1.5 align-top">
                        <div class="font-bold">{{cleanName(item.name || '')}}</div>
                        @if(item.displayWarning) { 
                           <div class="text-[9px] text-red-700 italic"><i class="fa-solid fa-triangle-exclamation"></i> {{item.displayWarning}}</div> 
                        }
                      </td>
                      <td class="border border-black px-2 py-1.5 text-right font-mono align-top">{{item.base_note || item.formula}}</td>
                      <td class="border border-black px-2 py-1.5 text-right font-bold text-sm align-top">{{formatNum(item.totalQty)}}</td>
                      <td class="border border-black px-2 py-1.5 text-center align-top">{{item.unit}}</td>
                      <td class="border border-black px-2 py-1.5 text-[10px] italic text-slate-400 align-top">
                         <!-- Empty space for manual check -->
                         @if(item.stockUnit !== item.unit) { (Kho: {{item.stockUnit}}) }
                      </td>
                   </tr>
                   
                   <!-- Composite Ingredients Details -->
                   @if (item.isComposite) {
                      @for (sub of item.breakdown; track sub.name) {
                         <tr class="break-inside-avoid bg-gray-50/50 text-slate-600">
                            <td class="border border-black px-2 py-0.5 border-t-0"></td>
                            <td class="border border-black px-2 py-0.5 border-t-0 pl-6 text-[10px] italic">
                               - {{cleanName(sub.name)}}
                            </td>
                            <td class="border border-black px-2 py-0.5 border-t-0 text-right text-[9px]">
                               {{sub.amountPerUnit}}/{{item.unit}}
                            </td>
                            <td class="border border-black px-2 py-0.5 border-t-0 text-right font-medium text-[10px]">
                               {{formatNum(sub.displayAmount)}}
                            </td>
                            <td class="border border-black px-2 py-0.5 border-t-0 text-center text-[9px]">{{sub.unit}}</td>
                            <td class="border border-black px-2 py-0.5 border-t-0"></td>
                         </tr>
                      }
                   }
                }
             </tbody>
           </table>

           <!-- Footer / Signatures -->
           <div class="mt-8 break-inside-avoid">
              <div class="flex justify-between text-center text-xs">
                 <div class="w-1/3">
                    <div class="font-bold uppercase mb-16">Người Lập Phiếu</div>
                    <div class="border-t border-black w-32 mx-auto pt-1 italic">Ký & Ghi rõ họ tên</div>
                 </div>
                 <div class="w-1/3">
                    <div class="font-bold uppercase mb-16">Phụ Trách Kho</div>
                    <div class="border-t border-black w-32 mx-auto pt-1 italic">Ký & Ghi rõ họ tên</div>
                 </div>
                 <div class="w-1/3">
                    <div class="font-bold uppercase mb-16">Trưởng Phòng Lab</div>
                    <div class="border-t border-black w-32 mx-auto pt-1 italic">Ký & Ghi rõ họ tên</div>
                 </div>
              </div>
              
              <div class="mt-8 pt-2 border-t border-black text-[9px] text-center italic text-slate-500">
                 Biểu mẫu được in tự động từ hệ thống LIMS Cloud V4.0. Ngày giờ hệ thống: {{formatDate(job.date)}}.
              </div>
           </div>

           <!-- Page Break for Batch -->
           <div class="page-break"></div>
         </div>
       }
    </div>
  `,
  styles: [`
    @media print {
      .print-container { display: block; width: 100%; }
      .print-page { 
         width: 210mm; 
         min-height: 297mm; 
         padding: 0; 
         margin: 0 auto; 
         page-break-after: always;
      }
      .page-break { page-break-after: always; }
      .print-page:last-child .page-break { page-break-after: auto; }
      
      /* Table Printing Optimization */
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; page-break-after: auto; }
      thead { display: table-header-group; }
      tfoot { display: table-footer-group; }
    }
  `]
})
export class PrintLayoutComponent {
  printService = inject(PrintService);
  formatDate = formatDate;
  formatNum = formatNum;
  cleanName = cleanName;
}