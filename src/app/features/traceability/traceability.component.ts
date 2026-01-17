import { Component, inject, signal, OnInit, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase.service';
import { doc, getDoc } from 'firebase/firestore';
import { Log, PrintData } from '../../core/models/log.model';
import { PrintService } from '../../core/services/print.service';
import { formatDate, formatNum } from '../../shared/utils/utils';

declare var QRious: any;

@Component({
  selector: 'app-traceability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-100 p-4 md:p-8 flex items-center justify-center fade-in print:p-0 print:bg-white">
        
        <!-- LOADING STATE -->
        @if(isLoading()) {
            <div class="text-center print:hidden">
                <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-slate-500 font-bold animate-pulse">Đang truy xuất dữ liệu...</p>
            </div>
        }

        <!-- ERROR STATE -->
        @else if (errorMsg()) {
            <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-center relative border border-red-100 print:hidden">
                <div class="h-2 bg-red-600 w-full"></div>
                <div class="p-10">
                    <div class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 animate-bounce-in shadow-inner">
                        <i class="fa-solid fa-shield-halved text-5xl"></i>
                        <div class="absolute text-2xl font-black text-red-600 bg-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-red-50 bottom-0 right-0">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    
                    <h2 class="text-2xl font-black text-red-600 mb-2 uppercase tracking-tight">Chứng nhận Vô hiệu</h2>
                    <div class="bg-red-50 text-red-800 px-4 py-3 rounded-xl text-sm font-medium mb-6 border border-red-100">
                        <i class="fa-solid fa-circle-exclamation mr-1"></i>
                        Mã định danh <b>{{searchId()}}</b> không tồn tại hoặc dữ liệu bị lỗi.
                    </div>
                    
                    <p class="text-slate-500 text-xs mb-8 leading-relaxed">
                        {{errorMsg()}}
                    </p>

                    <button (click)="goHome()" class="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition shadow-lg">
                        <i class="fa-solid fa-house mr-2"></i> Về trang chủ
                    </button>
                </div>
            </div>
        }

        <!-- SUCCESS STATE -->
        @else {
            @if (logData(); as log) {
                <!-- SAFE GUARD: Ensure printData exists and alias it to 'pd' for strict checking -->
                @if (log.printData; as pd) {
                    <div class="bg-white w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden relative print:shadow-none print:w-full print:max-w-none print:rounded-none">
                        
                        <!-- Decorative Top Border (Hidden on Print to save ink) -->
                        <div class="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 print:hidden"></div>
                        <div class="h-1 bg-black w-full hidden print:block"></div>

                        <div class="p-8 md:p-10 relative print:p-0">
                            <!-- Watermark (Hidden on Print) -->
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] print:hidden">
                                <i class="fa-solid fa-flask text-[300px]"></i>
                            </div>

                            <!-- 1. Header -->
                            <div class="flex justify-between items-start mb-8 relative z-10 print:mb-4">
                                <div>
                                    <div class="flex items-center gap-2 mb-1 print:hidden">
                                        <i class="fa-solid fa-certificate text-yellow-500 text-xl"></i>
                                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Certificate</span>
                                    </div>
                                    <h1 class="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight print:text-black">Chứng nhận Kiểm nghiệm</h1>
                                    <p class="text-sm text-slate-500 font-medium mt-1 print:text-black">Hệ thống Quản lý Phòng thí nghiệm (LIMS)</p>
                                </div>
                                <div class="text-right">
                                    <canvas #qrCanvas class="w-20 h-20 md:w-24 md:h-24"></canvas>
                                    <div class="text-[10px] font-mono text-slate-400 mt-1 print:text-black">{{log.id}}</div>
                                </div>
                            </div>

                            <!-- 2. Status Banner (Simplified for Print) -->
                            <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8 flex items-center gap-4 print:bg-white print:border-black print:rounded-none print:p-2 print:mb-4">
                                <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0 print:hidden">
                                    <i class="fa-solid fa-check-double text-xl"></i>
                                </div>
                                <div>
                                    <div class="text-xs font-bold text-emerald-600 uppercase print:text-black">Trạng thái</div>
                                    <div class="text-lg font-bold text-emerald-800 print:text-black">ĐÃ ĐƯỢC PHÊ DUYỆT & GHI NHẬN</div>
                                    <div class="text-xs text-emerald-600 print:hidden">Dữ liệu toàn vẹn trên hệ thống Cloud.</div>
                                </div>
                            </div>

                            <!-- 3. General Details Grid -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8 relative z-10 print:gap-y-2 print:mb-4">
                                <div>
                                    <div class="text-[10px] font-bold text-slate-400 uppercase mb-1 print:text-black">Quy trình (SOP)</div>
                                    <div class="text-base font-bold text-slate-800 border-b border-slate-100 pb-1 print:text-black print:border-black">
                                        {{pd.sop?.name || 'N/A'}}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-[10px] font-bold text-slate-400 uppercase mb-1 print:text-black">Ngày phân tích</div>
                                    <div class="text-base font-bold text-slate-800 border-b border-slate-100 pb-1 print:text-black print:border-black">
                                        {{ pd.analysisDate ? formatDate(pd.analysisDate) : formatDate(log.timestamp) }}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-[10px] font-bold text-slate-400 uppercase mb-1 print:text-black">Người thực hiện / Duyệt</div>
                                    <div class="text-base font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-2 print:text-black print:border-black">
                                        <i class="fa-solid fa-user-check text-slate-400 print:hidden"></i> {{log.user}}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-[10px] font-bold text-slate-400 uppercase mb-1 print:text-black">Mã tham chiếu (Ref ID)</div>
                                    <div class="text-base font-mono font-bold text-slate-600 border-b border-slate-100 pb-1 print:text-black print:border-black">
                                        {{log.id}}
                                    </div>
                                </div>
                            </div>

                            <!-- 4. Operational Parameters (Using 'pd' alias) -->
                            <div class="mb-8 relative z-10 print:mb-4">
                                <h3 class="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2 print:text-black">
                                    <i class="fa-solid fa-sliders print:hidden"></i> Thông số Vận hành
                                </h3>
                                <div class="bg-slate-50 rounded-xl border border-slate-200 p-4 print:bg-white print:border-black print:rounded-none print:p-2">
                                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 print:gap-2">
                                        @for (inp of (pd.sop?.inputs || []); track inp.var) {
                                            @if (inp.var !== 'safetyMargin' && pd.inputs?.[inp.var] !== undefined) {
                                                <div>
                                                    <div class="text-[10px] font-bold text-slate-400 uppercase mb-0.5 print:text-black">{{inp.label}}</div>
                                                    <div class="text-sm font-bold text-slate-700 print:text-black">
                                                        @if(inp.type === 'checkbox') {
                                                            {{ pd.inputs[inp.var] ? 'Có' : 'Không' }}
                                                        } @else {
                                                            {{ pd.inputs[inp.var] }} <span class="text-xs font-normal text-slate-500 print:text-black">{{inp.unitLabel}}</span>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        }
                                        @if (!pd.sop?.inputs || pd.sop.inputs.length === 0) {
                                            <div class="col-span-full text-xs text-slate-400 italic">Không có thông số đặc biệt.</div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <!-- 5. Usage Table (Using 'pd' alias) -->
                            <div class="mb-8 relative z-10 print:mb-4">
                                <h3 class="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2 print:text-black">
                                    <i class="fa-solid fa-list-ul print:hidden"></i> Chi tiết Hóa chất sử dụng
                                </h3>
                                <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden print:bg-white print:border-black print:rounded-none">
                                    <table class="w-full text-sm text-left">
                                        <thead class="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase print:bg-white print:text-black print:border-b print:border-black">
                                            <tr>
                                                <th class="px-4 py-2 print:px-1">Tên Hóa chất</th>
                                                <th class="px-4 py-2 text-right print:px-1">Lượng dùng</th>
                                                <th class="px-4 py-2 text-center print:px-1">Đơn vị</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-200 print:divide-black">
                                            @for (item of (pd.items || []); track item.name) {
                                                <tr>
                                                    <td class="px-4 py-2 font-medium text-slate-700 print:text-black print:px-1">
                                                        {{item.displayName || item.name}}
                                                        @if(item.isComposite) { <span class="text-[10px] text-slate-400 ml-1 print:text-black">(Hỗn hợp)</span> }
                                                    </td>
                                                    <td class="px-4 py-2 text-right font-mono font-bold print:text-black print:px-1">{{formatNum(item.totalQty)}}</td>
                                                    <td class="px-4 py-2 text-center text-xs text-slate-500 print:text-black print:px-1">{{item.unit}}</td>
                                                </tr>
                                                @if(item.isComposite) {
                                                    @for (sub of item.breakdown; track sub.name) {
                                                        <tr class="bg-slate-50/50 print:bg-white">
                                                            <td class="px-4 py-1 pl-8 text-xs text-slate-500 italic print:text-black print:pl-4">• {{sub.displayName || sub.name}}</td>
                                                            <td class="px-4 py-1 text-right text-xs text-slate-500 font-mono print:text-black">{{formatNum(sub.displayAmount)}}</td>
                                                            <td class="px-4 py-1 text-center text-[10px] text-slate-400 print:text-black">{{sub.unit}}</td>
                                                        </tr>
                                                    }
                                                }
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="text-center border-t border-slate-100 pt-6 print:border-black">
                                <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1 print:text-black">Xác thực điện tử bởi Otada LIMS</p>
                                <p class="text-[9px] text-slate-300 print:hidden">Chứng nhận này được tạo tự động và có giá trị truy xuất nguồn gốc.</p>
                            </div>
                        </div>

                        <!-- Action Bar -->
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
            }
        }
    </div>
  `
})
export class TraceabilityComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private fb = inject(FirebaseService);
  private printService = inject(PrintService);

  searchId = signal('');
  isLoading = signal(true);
  errorMsg = signal('');
  logData = signal<Log | null>(null);
  
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
          const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/logs/${id}`);
          const logSnap = await getDoc(logRef);

          if (logSnap.exists()) {
              const data = { id: logSnap.id, ...logSnap.data() } as Log;
              
              // 1. New Data Structure: Fetch from 'print_jobs' if needed
              if (!data.printData && data.printJobId) {
                  try {
                      const jobRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs/${data.printJobId}`);
                      const jobSnap = await getDoc(jobRef);
                      if (jobSnap.exists()) {
                          data.printData = jobSnap.data() as PrintData;
                      } else {
                          this.errorMsg.set('Dữ liệu chi tiết của phiếu này đã bị xóa.');
                          return;
                      }
                  } catch (jobErr) {
                      this.errorMsg.set('Lỗi tải chi tiết lệnh in.');
                      return;
                  }
              }

              // 2. Validate Data Presence
              if (data.printData) {
                  this.logData.set(data);
                  setTimeout(() => this.generateQr(id), 100);
              } else {
                  this.errorMsg.set('Dữ liệu này không chứa thông tin chi tiết (Print Data).');
              }
          } else {
              this.errorMsg.set('Không tìm thấy bản ghi với ID này.');
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
          requestId: data.id 
      };
      
      this.printService.printDocument([printJob]);
  }

  goHome() {
      this.router.navigate(['/dashboard']);
  }

  formatDate(val: any): string {
      if (!val) return '';
      if (val.toDate && typeof val.toDate === 'function') {
          const d = val.toDate();
          return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } 
      if (typeof val === 'string' && val.includes('-')) {
          const parts = val.split('-');
          if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
      return val;
  }
}