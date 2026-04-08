import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenceStandard } from '../../../core/models/standard.model';

@Component({
  selector: 'app-standards-print-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
      @if (isOpen()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden animate-bounce-in max-h-[90vh]">
                <!-- Left: Settings -->
                <div class="w-1/2 p-8 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar flex flex-col">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                            <i class="fa-solid fa-print"></i>
                        </div>
                        <div>
                            <h3 class="font-black text-xl text-slate-800 dark:text-slate-100 leading-tight">In Nhãn Chuẩn</h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-words" [title]="std()?.name">{{std()?.name}}</p>
                        </div>
                    </div>
                    
                    <div class="space-y-6 flex-1">
                        <!-- Template Selection -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mẫu nhãn</label>
                            <div class="grid grid-cols-3 gap-2">
                                <button (click)="onTemplateChange('standard')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30': printTemplate() === 'standard'}" class="p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                    <div class="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Tiêu chuẩn</div>
                                    <div class="text-[10px] text-slate-500 dark:text-slate-400">Thông tin cơ bản</div>
                                </button>
                                <button (click)="onTemplateChange('detailed')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30': printTemplate() === 'detailed'}" class="p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                    <div class="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Chi tiết</div>
                                    <div class="text-[10px] text-slate-500 dark:text-slate-400">Đầy đủ thông tin</div>
                                </button>
                                <button (click)="onTemplateChange('qr')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30': printTemplate() === 'qr'}" class="p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                    <div class="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Mã QR</div>
                                    <div class="text-[10px] text-slate-500 dark:text-slate-400">Kèm mã QR code</div>
                                </button>
                            </div>
                        </div>

                        <!-- Dimensions -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Kích thước nhãn</label>
                            <select [ngModel]="printPaperSize()" (ngModelChange)="onPaperSizeChange($event)" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition mb-3">
                                <option value="22x12">22 x 12 mm (Tem nhỏ)</option>
                                <option value="35x22">35 x 22 mm (Tem chuẩn)</option>
                                <option value="50x30">50 x 30 mm (Tem trung)</option>
                                <option value="70x50">70 x 50 mm (Tem lớn)</option>
                                <option value="custom">Tùy chỉnh...</option>
                            </select>
                            
                            @if (printPaperSize() === 'custom') {
                                <div class="grid grid-cols-3 gap-3">
                                    <div>
                                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rộng (mm)</label>
                                        <input type="number" [ngModel]="printWidth()" (ngModelChange)="printWidth.set($event)" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cao (mm)</label>
                                        <input type="number" [ngModel]="printHeight()" (ngModelChange)="printHeight.set($event)" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cỡ chữ (pt)</label>
                                        <input type="number" [ngModel]="printFontSize()" (ngModelChange)="printFontSize.set($event)" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
                                    </div>
                                </div>
                            }
                        </div>

                        <!-- Fields to Include -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Thông tin hiển thị</label>
                            <div class="grid grid-cols-2 gap-y-3 gap-x-4">
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeName()" (ngModelChange)="printIncludeName.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Tên chuẩn</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeLot()" (ngModelChange)="printIncludeLot.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Số Lot</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludePurity()" (ngModelChange)="printIncludePurity.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Độ tinh khiết</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeOpened()" (ngModelChange)="printIncludeOpened.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Ngày mở</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeExpiry()" (ngModelChange)="printIncludeExpiry.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Hạn sử dụng</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeStorage()" (ngModelChange)="printIncludeStorage.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Bảo quản</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeManufacturer()" (ngModelChange)="printIncludeManufacturer.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Nhà SX</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeCas()" (ngModelChange)="printIncludeCas.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Số CAS</span>
                                </label>
                            </div>
                        </div>

                        <!-- Copies -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Số bản in</label>
                            <div class="flex items-center gap-2 w-32">
                                <button (click)="printCopies.set(Math.max(1, printCopies() - 1))" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition"><i class="fa-solid fa-minus text-xs"></i></button>
                                <input type="number" [ngModel]="printCopies()" (ngModelChange)="printCopies.set($event)" min="1" class="flex-1 w-full text-center border-none bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:ring-0 p-0">
                                <button (click)="printCopies.set(printCopies() + 1)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition"><i class="fa-solid fa-plus text-xs"></i></button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <button (click)="onClose()" class="px-5 py-2.5 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">Hủy bỏ</button>
                        <button (click)="printLabel()" class="px-8 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none transition flex items-center gap-2">
                            <i class="fa-solid fa-print"></i> In {{printCopies()}} nhãn
                        </button>
                    </div>
                </div>

                <!-- Right: Preview -->
                <div class="w-1/2 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center relative" id="print-preview-container">
                    <div class="absolute top-4 left-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-eye"></i> Xem trước
                    </div>
                    
                    <!-- Preview Container (Scaled to fit) -->
                    <div class="bg-white shadow-sm border border-slate-200 flex flex-col justify-center text-black overflow-hidden relative print-content"
                         [style.width.mm]="printWidth()"
                         [style.height.mm]="printHeight()"
                         [style.padding.mm]="2"
                         [style.transform]="'scale(' + getPreviewScale() + ')'"
                         style="transform-origin: center center; transition: all 0.3s ease;">
                         
                         <div [style.font-size.pt]="printFontSize()" style="line-height: 1.2; width: 100%; height: 100%;">
                            @if (printTemplate() === 'qr') {
                                <div style="display: flex; height: 100%; gap: 4px;">
                                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
                                        @if (printIncludeName()) { <div style="font-weight: bold; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" [style.font-size.pt]="printFontSize() + 2">{{std()?.name}}</div> }
                                        @if (printIncludeLot()) { <div style="display: flex; justify-content: space-between; margin-bottom: 1px;"><span>Lot: <span style="font-weight: bold;">{{std()?.lot_number || 'N/A'}}</span></span></div> }
                                        @if (printIncludePurity()) { <div style="display: flex; justify-content: space-between; margin-bottom: 1px;"><span>Pur: <span style="font-weight: bold;">{{std()?.purity || 'N/A'}}</span></span></div> }
                                        @if (printIncludeExpiry()) { <div style="display: flex; justify-content: space-between; margin-bottom: 1px;"><span>Exp: <span style="font-weight: bold;">{{std()?.expiry_date ? (std()?.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</span></span></div> }
                                    </div>
                                    <div style="width: 30%; display: flex; align-items: center; justify-content: center;">
                                        <img [src]="getQrCodeUrl()" style="width: 100%; height: auto; max-height: 100%;" />
                                    </div>
                                </div>
                            } @else {
                                <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; overflow: hidden;">
                                    @if (printIncludeName()) { <div style="font-weight: bold; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" [style.font-size.pt]="printFontSize() + 2">{{std()?.name}}</div> }
                                    
                                    @if (printTemplate() === 'detailed') {
                                        @if (printIncludeCas() || printIncludeManufacturer()) {
                                            <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                                                @if(printIncludeCas()) { <span>CAS: <span style="font-weight: bold;">{{std()?.cas_number || 'N/A'}}</span></span> }
                                                @if(printIncludeManufacturer()) { <span>Mfr: <span style="font-weight: bold;">{{std()?.manufacturer || 'N/A'}}</span></span> }
                                            </div>
                                        }
                                    }

                                    @if (printIncludeLot() || printIncludePurity()) {
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                                            @if(printIncludeLot()) { <span>Lot: <span style="font-weight: bold;">{{std()?.lot_number || 'N/A'}}</span></span> }
                                            @if(printIncludePurity()) { <span>Pur: <span style="font-weight: bold;">{{std()?.purity || 'N/A'}}</span></span> }
                                        </div>
                                    }
                                    
                                    @if (printIncludeOpened() || printIncludeExpiry()) {
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                                            @if(printIncludeOpened()) { <span>Opn: <span style="font-weight: bold;">{{std()?.date_opened ? (std()?.date_opened | date:'dd/MM/yy') : '__/__/__'}}</span></span> }
                                            @if(printIncludeExpiry()) { <span>Exp: <span style="font-weight: bold;">{{std()?.expiry_date ? (std()?.expiry_date | date:'dd/MM/yy') : 'N/A'}}</span></span> }
                                        </div>
                                    }

                                    @if (printIncludeStorage()) {
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                                            <span>Store: <span style="font-weight: bold;">{{std()?.storage_condition || 'N/A'}}</span></span>
                                        </div>
                                    }
                                </div>
                            }
                         </div>
                    </div>
                    
                    <div class="mt-6 text-[10px] text-slate-400 dark:text-slate-500 text-center max-w-[250px]">
                        Bản xem trước mang tính tương đối. Kết quả in thực tế phụ thuộc vào máy in và trình duyệt.
                    </div>
                </div>
            </div>
         </div>
      }
  `,
  styles: [`
    @media print {
        @page {
            margin: 0 !important;
            padding: 0 !important;
        }
        body, html {
            margin: 0; padding: 0; background-color: white; width: 100%; height: 100%;
        }
        body > *:not(#print-area) { display: none !important; }
        #print-area { display: flex !important; }
    }
  `]
})
export class StandardsPrintModalComponent {
  std = input<ReferenceStandard | null>(null);
  isOpen = input<boolean>(false);
  closeModal = output<void>();

  // ---- PRINT LABEL SETTINGS ----
  printPaperSize = signal('35x22');
  printWidth = signal(35); // in mm
  printHeight = signal(22); // in mm
  printTemplate = signal('detailed'); // standard, detailed, qr
  printCopies = signal(1);
  printFontSize = signal(6); // pt
  Math = Math;

  // Toggleable Print Fields
  printIncludeName = signal(true);
  printIncludeLot = signal(true);
  printIncludePurity = signal(true);
  printIncludeOpened = signal(true);
  printIncludeExpiry = signal(true);
  printIncludeStorage = signal(true);
  printIncludeManufacturer = signal(false);
  printIncludeCas = signal(false);

  onClose() {
    this.closeModal.emit();
  }

  getQrCodeUrl(): string {
    const stdData = this.std();
    if (!stdData) return '';
    const originUrl = window.location.origin;
    const url = `${originUrl}/standards?search=${stdData.lot_number || stdData.id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
  }

  onPaperSizeChange(size: string) {
    this.printPaperSize.set(size);
    if (size === '35x22') { this.printWidth.set(35); this.printHeight.set(22); this.printFontSize.set(6); }
    else if (size === '22x12') { this.printWidth.set(22); this.printHeight.set(12); this.printFontSize.set(4); }
    else if (size === '50x30') { this.printWidth.set(50); this.printHeight.set(30); this.printFontSize.set(8); }
    else if (size === '70x50') { this.printWidth.set(70); this.printHeight.set(50); this.printFontSize.set(10); }
  }

  onTemplateChange(template: string) {
    this.printTemplate.set(template);
    if (template === 'standard') {
        this.printIncludeManufacturer.set(false);
        this.printIncludeCas.set(false);
    } else if (template === 'detailed') {
        this.printIncludeManufacturer.set(true);
        this.printIncludeCas.set(true);
    } else if (template === 'qr') {
        this.printIncludeManufacturer.set(false);
        this.printIncludeCas.set(false);
        if (this.printPaperSize() === '22x12') {
            // Force template change to fit QR because 22x12 is too small
            this.printIncludeStorage.set(false);
            this.printIncludeOpened.set(false);
        }
    }
  }

  getPreviewScale(): number {
    const currentW = this.printWidth();
    // Max width inside preview panel is approx 300px (which is ~79mm). 
    // We scale it up for better visual clarity while maintaining aspect ratio mm
    if (currentW <= 35) return 2.5;
    if (currentW <= 50) return 2;
    return 1.5;
  }

  printLabel() {
    const contentToPrint = document.querySelector('.print-content');
    if (!contentToPrint) return;

    const copies = this.printCopies();
    
    // Create print area correctly
    const printArea = document.createElement('div');
    printArea.id = 'print-area';
    printArea.style.position = 'fixed';
    printArea.style.top = '0';
    printArea.style.left = '0';
    printArea.style.width = '100vw'; // Need to be 100vw so page uses the element size
    printArea.style.display = 'flex';
    printArea.style.flexDirection = 'column';
    printArea.style.alignItems = 'flex-start'; // Align left top for label printer
    printArea.style.gap = '2mm';
    printArea.style.zIndex = '99999';
    printArea.style.backgroundColor = 'white';

    for (let i = 0; i < copies; i++) {
        const clonedNode = contentToPrint.cloneNode(true) as HTMLElement;
        // remove shadow/border
        clonedNode.style.boxShadow = 'none';
        clonedNode.style.border = 'none';
        // Reset transform since scale is only for preview
        clonedNode.style.transform = 'none';
        // Ensure no breaking page strictly for standard label rolls
        clonedNode.style.pageBreakAfter = 'always';
        printArea.appendChild(clonedNode);
    }

    document.body.appendChild(printArea);

    const style = document.createElement('style');
    style.id = 'print-style';
    style.textContent = `
        @page { size: ${this.printWidth()}mm ${this.printHeight()}mm; margin: 0; }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        window.print();
        setTimeout(() => {
            document.body.removeChild(printArea);
            document.head.removeChild(style);
        }, 1000);
    }, 100);
  }
}
