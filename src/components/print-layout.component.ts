
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintService, PrintJob } from '../services/print.service';
import { StateService } from '../services/state.service';
import { formatDate, formatNum, cleanName } from '../utils/utils';

@Component({
  selector: 'app-print-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Container -->
    <div class="print-container font-roboto text-black">
       @for (group of groupedJobs(); track $index) {
         <!-- A4 Page Container - Fixed Size for Capture -->
         <div class="print-page bg-white relative mx-auto flex flex-col overflow-hidden">
            
            <!-- Stack 2 slips vertically. Each slip is strictly 50% of A4 height -->
            @for (job of group; track job.sop.id; let i = $index) {
                <div class="h-1/2 relative flex flex-col px-6 py-4 border-slate-900 overflow-hidden box-border"
                     [class.border-b-2]="i === 0"
                     [class.border-dashed]="i === 0">
                    
                    <!-- 1. Header (Table Layout for PDF Stability) -->
                    <table class="w-full border-collapse mb-2 border-b-2 border-black">
                        <tr>
                            <!-- Left: Title & Meta -->
                            <td class="align-bottom text-left pb-2">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-[10px] font-bold border border-black px-1.5 py-0.5 rounded-sm uppercase whitespace-nowrap inline-block">
                                        {{job.sop.category}}
                                    </span>
                                    <span class="text-[10px] text-slate-700 print:text-black italic font-medium whitespace-nowrap">
                                        {{formatDate(job.date)}}
                                    </span>
                                </div>
                                <h1 class="text-xl font-black uppercase text-black leading-none m-0 pt-1">
                                    {{job.sop.name}}
                                </h1>
                            </td>
                            <!-- Right: Performer -->
                            <td class="align-bottom w-[140px] pb-2">
                                <div class="flex flex-col items-center justify-end w-full">
                                    <div class="text-[9px] font-bold text-slate-500 print:text-black uppercase mb-0.5 text-center whitespace-nowrap">
                                        Người thực hiện
                                    </div>
                                    <div class="text-sm font-bold text-black border-b border-dotted border-black text-center w-full whitespace-nowrap overflow-hidden text-ellipsis px-1">
                                        {{job.user}}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <!-- 2. Inputs Bar -->
                    <div class="shrink-0 flex items-center gap-x-4 mb-2 text-[10px] font-medium text-black bg-slate-50 print:bg-transparent py-1 px-3 rounded border border-slate-200 print:border-none print:p-0 overflow-hidden">
                        @for (inp of job.sop.inputs; track inp.var) {
                             @if (inp.type !== 'checkbox' || job.inputs[inp.var]) {
                                <div class="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                                    <span class="text-slate-500 print:text-black uppercase text-[9px] font-bold">{{inp.label}}:</span>
                                    <span class="font-bold border-b border-slate-300 print:border-black px-1 min-w-[15px] text-center">
                                        {{job.inputs[inp.var]}}
                                        @if(inp.type === 'checkbox') { <i class="fa-solid fa-check text-[8px]"></i> }
                                    </span>
                                </div>
                             }
                        }
                        <!-- Margin Info -->
                        <div class="flex items-center gap-1.5 ml-auto pl-4 border-l border-slate-300 print:border-black whitespace-nowrap shrink-0">
                            <span class="text-slate-500 print:text-black uppercase text-[9px]">Hao hụt:</span>
                            <span class="font-bold text-black text-[10px]">+{{job.margin}}%</span>
                        </div>
                    </div>

                    <!-- 3. Main Data Table -->
                    <div class="flex-1 relative">
                        <table class="w-full text-[11px] border-collapse table-fixed">
                            <thead>
                                <tr class="border-b-2 border-black">
                                    <th class="py-1 text-left font-bold w-[45%] text-black uppercase text-[9px]">Hóa chất / Vật tư</th>
                                    <th class="py-1 text-right font-bold w-[15%] text-black uppercase text-[9px]">Lượng</th>
                                    <th class="py-1 text-center font-bold w-[10%] text-black uppercase text-[9px]">ĐV</th>
                                    <th class="py-1 text-left font-bold w-[30%] pl-4 text-black uppercase text-[9px]">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-300 print:divide-slate-300 leading-snug">
                                @for (item of job.items; track item.name) {
                                    <tr class="break-inside-avoid">
                                        <td class="py-1.5 align-top pr-1">
                                            <span class="font-bold text-black text-[11px] block break-words uppercase">
                                                {{resolveName(item.name) || item.name}}
                                            </span>
                                            @if(item.displayWarning) { 
                                                <div class="text-[9px] font-bold border border-black inline-block px-1 rounded mt-0.5">{{item.displayWarning}}</div> 
                                            }
                                        </td>
                                        <td class="py-1.5 text-right align-top font-bold text-black text-sm">
                                            {{formatNum(item.totalQty)}}
                                        </td>
                                        <td class="py-1.5 text-center align-top font-bold text-[10px] text-black pt-0.5">
                                            {{stdUnit(item.unit)}}
                                        </td>
                                        <td class="py-1.5 text-left align-top pl-4 text-[10px] italic text-slate-700 print:text-black">
                                            {{item.base_note}}
                                        </td>
                                    </tr>

                                    @if(item.isComposite) {
                                        <tr class="print:bg-transparent break-inside-avoid">
                                            <td colspan="4" class="py-1 pl-4 pr-0">
                                                <div class="bg-slate-50 print:bg-transparent border-l-4 border-slate-400 print:border-black pl-3 py-1 my-0.5">
                                                    <table class="w-full text-[10px]">
                                                        @for (sub of item.breakdown; track sub.name) {
                                                            <tr>
                                                                <td class="py-0.5 w-[45%] text-slate-900 print:text-black font-medium align-top">
                                                                   • {{resolveName(sub.name)}}
                                                                </td>
                                                                <td class="py-0.5 w-[15%] text-right font-mono font-bold align-top text-black">
                                                                    {{formatNum(sub.displayAmount)}}
                                                                </td>
                                                                <td class="py-0.5 w-[10%] text-center text-[9px] align-top text-black">
                                                                    {{stdUnit(sub.unit)}}
                                                                </td>
                                                                <td class="py-0.5 w-[30%] text-[9px] italic text-slate-500 print:text-black pl-4 align-top">
                                                                    (Thành phần)
                                                                </td>
                                                            </tr>
                                                        }
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                }
                            </tbody>
                        </table>
                    </div>

                    <!-- 4. Footer -->
                    <table class="w-full mt-auto pt-2 border-t border-black border-collapse">
                        <tr>
                            <td class="align-top text-left pr-4 pt-2">
                                <div class="text-[10px] italic text-slate-500 print:text-black leading-tight">
                                    <i class="fa-solid fa-triangle-exclamation mr-1"></i> 
                                    <b>Lưu ý:</b> Kiểm tra kỹ cân lượng, hạn sử dụng & cảm quan hóa chất trước khi dùng.
                                </div>
                            </td>
                            <td class="align-bottom w-[140px] pt-1">
                                <div class="flex flex-col items-center justify-end w-full">
                                    <div class="text-[10px] uppercase font-bold mb-8 text-center whitespace-nowrap">
                                        Người pha chế
                                    </div>
                                    <div class="h-px w-full bg-black"></div>
                                    <div class="text-[9px] italic mt-1 text-slate-500 print:text-black text-center whitespace-nowrap">
                                        (Ký & ghi rõ họ tên)
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <!-- Cut Icon -->
                    @if (i === 0) { 
                        <div class="absolute -bottom-3 -left-2 text-black bg-white z-10 px-1 rotate-90 print:block">
                            <i class="fa-solid fa-scissors text-xs"></i>
                        </div> 
                    }
                </div>
            }
         </div>
       }
    </div>
  `,
  styles: [`
    :host { display: none; }
    :host.preview-mode { display: block; }

    .font-roboto { font-family: 'Roboto', sans-serif; }

    /* Fix dimensions for exact A4 capture */
    .print-page {
        width: 210mm;
        height: 296mm; /* Exact A4 */
        box-sizing: border-box;
        page-break-after: always;
        background-color: white;
        /* Padding ensures content doesn't touch the edge during capture */
        padding: 0; 
    }
    .print-page:last-child { page-break-after: auto; }

    .whitespace-nowrap { white-space: nowrap !important; }

    @media print {
        :host { display: block !important; }
        @page { 
            size: A4 portrait; 
            margin: 0; 
        }
        body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-page { margin: 0; border: none; }
        * { color: black !important; border-color: black !important; }
        .bg-slate-50 { background-color: transparent !important; }
    }

    @media screen {
        .print-page {
            margin-bottom: 2rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }
    }
  `]
})
export class PrintLayoutComponent {
  printService = inject(PrintService);
  state = inject(StateService); 
  formatDate = formatDate;
  formatNum = formatNum;
  cleanName = cleanName;

  groupedJobs = computed(() => {
    const jobs = this.printService.jobs();
    const groups: PrintJob[][] = [];
    const itemsPerPage = 2; 
    
    for (let i = 0; i < jobs.length; i += itemsPerPage) {
      groups.push(jobs.slice(i, i + itemsPerPage));
    }
    return groups;
  });

  resolveName(id: string): string {
    const item = this.state.inventoryMap()[id];
    return item ? (item.name || id) : id;
  }

  stdUnit(unit: string): string {
      if (!unit) return '';
      const u = unit.toLowerCase().trim();
      if (u === 'gram' || u === 'grams') return 'g';
      if (u === 'milliliter' || u === 'milliliters' || u === 'ml') return 'mL';
      if (u === 'microliter' || u === 'ul' || u === 'µl') return 'µL';
      if (u === 'pcs' || u === 'piece') return 'cái';
      return unit;
  }
}
