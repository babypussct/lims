
import { Component, inject, signal, OnInit, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase.service';
import { doc, getDoc } from 'firebase/firestore';
import { Log } from '../../core/models/log.model';
import { PrintService } from '../../core/services/print.service';
import { formatDate, formatNum } from '../../shared/utils/utils';

declare var QRious: any;

@Component({
  selector: 'app-traceability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-100 p-4 md:p-8 flex items-center justify-center fade-in">
        
        <!-- LOADING STATE -->
        @if(isLoading()) {
            <div class="text-center">
                <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-slate-500 font-bold animate-pulse">Đang truy xuất dữ liệu...</p>
            </div>
        }

        <!-- ERROR STATE -->
        @else if (errorMsg()) {
            <div class="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border-t-4 border-red-500">
                <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
                </div>
                <h2 class="text-xl font-black text-slate-800 mb-2">Không tìm thấy dữ liệu</h2>
                <p class="text-slate-500 mb-6 text-sm">Mã ID <b>{{searchId()}}</b> không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
                <button (click)="goHome()" class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
                    <i class="fa-solid fa-arrow-left mr-2"></i> Quay về trang chủ
                </button>
            </div>
        }

        <!-- SUCCESS STATE: DIGITAL CERTIFICATE -->
        @else if (logData(); as log) {
            <div class="bg-white w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden relative print:shadow-none print:w-full">
                
                <!-- Decorative Top Border -->
                <div class="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div class="p-8 md:p-10 relative">
                    <!-- Watermark -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                        <i class="fa-solid fa-flask text-[300px]"></i>
                    </div>

                    <!-- Header -->
                    <div class="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <i class="fa-solid fa-certificate text-yellow-500 text-xl"></i>
                                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Certificate</span>
                            </div>
                            <h1 class="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Chứng nhận Kiểm nghiệm</h1>
                            <p class="text-sm text-slate-500 font-medium mt-1">Hệ thống Quản lý Phòng thí nghiệm (LIMS)</p>
                        </div>
                        <div class="text-right">
                            <canvas #qrCanvas class="w-20 h-20 md:w-24 md:h-24"></canvas>
                            <div class="text-[10px] font-mono text-slate-400 mt-1">{{log.id}}</div>
                        </div>
                    </div>

                    <!-- Status Banner -->
                    <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8 flex items-center gap-4">
                        <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                            <i class="fa-solid fa-check-double text-xl"></i>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-emerald-600 uppercase">Trạng thái</div>
                            <div class="text-lg font-bold text-emerald-800">ĐÃ ĐƯỢC PHÊ DUYỆT & GHI NHẬN</div>
                            <div class="text-xs text-emerald-600">Dữ liệu toàn vẹn trên hệ thống Cloud.</div>
                        </div>
                    </div>

                    <!-- Details Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8 relative z-10">
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Quy trình (SOP)</div>
                            <div class="text-base font-bold text-slate-800 border-b border-slate-100 pb-1">
                                {{log.printData?.sop?.name || 'N/A'}}
                            </div>
                        </div>
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Thời gian thực hiện</div>
                            <div class="text-base font-bold text-slate-800 border-b border-slate-100 pb-1">
                                {{formatDate(log.timestamp)}}
                            </div>
                        </div>
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Người thực hiện / Duyệt</div>
                            <div class="text-base font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-2">
                                <i class="fa-solid fa-user-check text-slate-400"></i> {{log.user}}
                            </div>
                        </div>
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Mã tham chiếu (Ref ID)</div>
                            <div class="text-base font-mono font-bold text-slate-600 border-b border-slate-100 pb-1">
                                {{log.id}}
                            </div>
                        </div>
                    </div>

                    <!-- Usage Table -->
                    <div class="mb-8 relative z-10">
                        <h3 class="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                            <i class="fa-solid fa-list-ul"></i> Chi tiết Hóa chất sử dụng
                        </h3>
                        <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                                    <tr>
                                        <th class="px-4 py-2">Tên Hóa chất</th>
                                        <th class="px-4 py-2 text-right">Lượng dùng</th>
                                        <th class="px-4 py-2 text-center">Đơn vị</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    @for (item of log.printData?.items; track item.name) {
                                        <tr>
                                            <td class="px-4 py-2 font-medium text-slate-700">
                                                {{item.displayName || item.name}}
                                                @if(item.isComposite) { <span class="text-[10px] text-slate-400 ml-1">(Hỗn hợp)</span> }
                                            </td>
                                            <td class="px-4 py-2 text-right font-mono font-bold">{{formatNum(item.totalQty)}}</td>
                                            <td class="px-4 py-2 text-center text-xs text-slate-500">{{item.unit}}</td>
                                        </tr>
                                        <!-- Show sub-ingredients if composite -->
                                        @if(item.isComposite) {
                                            @for (sub of item.breakdown; track sub.name) {
                                                <tr class="bg-slate-50/50">
                                                    <td class="px-4 py-1 pl-8 text-xs text-slate-500 italic">• {{sub.displayName || sub.name}}</td>
                                                    <td class="px-4 py-1 text-right text-xs text-slate-500 font-mono">{{formatNum(sub.displayAmount)}}</td>
                                                    <td class="px-4 py-1 text-center text-[10px] text-slate-400">{{sub.unit}}</td>
                                                </tr>
                                            }
                                        }
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="text-center border-t border-slate-100 pt-6">
                        <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Xác thực điện tử bởi Otada LIMS</p>
                        <p class="text-[9px] text-slate-300">Chứng nhận này được tạo tự động và có giá trị truy xuất nguồn gốc.</p>
                    </div>
                </div>

                <!-- Action Bar (Hidden when printing) -->
                <div class="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center print:hidden">
                    <button (click)="goHome()" class="text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center gap-2 transition">
                        <i class="fa-solid fa-arrow-left"></i> Quay lại
                    </button>
                    <button (click)="reprint()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-xs shadow-md shadow-blue-200 transition flex items-center gap-2 transform active:scale-95">
                        <i class="fa-solid fa-print"></i> In Bản sao
                    </button>
                </div>
            </div>
        }
    </div>
  `
})
export class TraceabilityComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FirebaseService);
  private printService = inject(PrintService);

  searchId = signal('');
  isLoading = signal(true);
  errorMsg = signal('');
  logData = signal<Log | null>(null);
  
  formatDate = formatDate;
  formatNum = formatNum;

  qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');

  ngOnInit() {
    this.route.params.subscribe(params => {
        const id = params['id'];
        if (id) {
            this.searchId.set(id);
            this.fetchLog(id);
        } else {
            this.isLoading.set(false);
            this.errorMsg.set('Vui lòng cung cấp mã ID.');
        }
    });
  }

  async fetchLog(id: string) {
      this.isLoading.set(true);
      this.errorMsg.set('');
      try {
          // 1. Try finding in Logs collection (Primary)
          const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/logs/${id}`);
          const logSnap = await getDoc(logRef);

          if (logSnap.exists()) {
              const data = { id: logSnap.id, ...logSnap.data() } as Log;
              if (data.printData) {
                  this.logData.set(data);
                  setTimeout(() => this.generateQr(id), 100);
              } else {
                  this.errorMsg.set('Dữ liệu này không chứa thông tin chi tiết (Print Data).');
              }
          } else {
              // 2. Fallback: Try finding in Requests collection (If scanned a Request ID)
              // (Future improvement)
              this.errorMsg.set('Không tìm thấy bản ghi.');
          }
      } catch (e: any) {
          this.errorMsg.set('Lỗi kết nối: ' + e.message);
      } finally {
          this.isLoading.set(false);
      }
  }

  generateQr(text: string) {
      if (typeof QRious === 'undefined' || !this.qrCanvas()) return;
      new QRious({
          element: this.qrCanvas()!.nativeElement,
          value: text,
          size: 100,
          level: 'L'
      });
  }

  reprint() {
      const data = this.logData();
      if (!data || !data.printData) return;
      
      const printJob = {
          ...data.printData,
          date: data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
          user: data.user,
          requestId: data.id // Ensure QR on print matches this ID
      };
      
      this.printService.printDocument([printJob]);
  }

  goHome() {
      this.router.navigate(['/dashboard']);
  }
}
