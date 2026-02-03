
import { Component, inject, signal, Input, OnInit, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../core/services/firebase.service';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { formatDate, formatNum, formatSampleList } from '../../shared/utils/utils';
import { Log } from '../../core/models/log.model';
import { ToastService } from '../../core/services/toast.service';

declare var QRious: any;

@Component({
  selector: 'app-traceability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-20 fade-in px-4 md:px-0">
        <!-- HEADER -->
        <div class="flex items-center gap-4 mb-8 pt-6">
            <div class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-300">
                <i class="fa-solid fa-qrcode text-xl"></i>
            </div>
            <div>
                <h1 class="text-2xl font-black text-slate-800 tracking-tight">Truy xuất Nguồn gốc</h1>
                <p class="text-sm text-slate-500 font-medium">Chi tiết nhật ký hoạt động và thông tin minh bạch.</p>
            </div>
        </div>

        @if(isLoading()) {
            <div class="py-20 text-center">
                <div class="inline-block w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p class="text-slate-400 font-bold text-sm">Đang truy xuất dữ liệu blockchain...</p>
            </div>
        } @else if(errorMsg()) {
            <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                <div class="flex items-center gap-3 mb-2">
                    <i class="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>
                    <h3 class="text-lg font-bold text-red-800">Không tìm thấy dữ liệu</h3>
                </div>
                <p class="text-red-600 text-sm">{{errorMsg()}}</p>
            </div>
        } @else if(logData()) {
            <!-- DATA CARD -->
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
                <!-- Status Stripe -->
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div class="p-8">
                    <!-- Top Row: ID & QR -->
                    <div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-slate-100 pb-8">
                        <div>
                            <span class="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                Transaction ID
                            </span>
                            <div class="font-mono text-xl md:text-3xl font-black text-slate-800 break-all">
                                {{logData()?.id}}
                            </div>
                            <div class="mt-2 text-sm text-slate-500 font-medium flex items-center gap-2">
                                <i class="fa-solid fa-clock"></i> {{formatDate(logData()?.timestamp)}}
                            </div>
                        </div>
                        <div class="shrink-0 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                            <canvas #qrCanvas class="w-32 h-32"></canvas>
                        </div>
                    </div>

                    <!-- Main Info Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Left: Actor & Action -->
                        <div class="space-y-6">
                            <div>
                                <h4 class="text-xs font-bold text-slate-400 uppercase mb-2">Người thực hiện</h4>
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200">
                                        {{logData()?.user?.charAt(0)}}
                                    </div>
                                    <div>
                                        <div class="font-bold text-slate-800">{{logData()?.user}}</div>
                                        <div class="text-xs text-slate-400">Authorized Staff</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 class="text-xs font-bold text-slate-400 uppercase mb-2">Hành động</h4>
                                <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                    <div class="font-bold text-blue-800 text-lg mb-1">{{logData()?.action}}</div>
                                    <p class="text-sm text-blue-600">{{logData()?.details}}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Context Details -->
                        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <h4 class="text-xs font-bold text-slate-400 uppercase mb-4">Chi tiết ngữ cảnh</h4>
                            
                            <div class="space-y-4">
                                @if(logData()?.sopBasicInfo?.name || logData()?.printData?.sop?.name) {
                                    <div>
                                        <span class="text-xs text-slate-500 block">Quy trình (SOP)</span>
                                        <span class="font-bold text-slate-800">
                                            {{ logData()?.sopBasicInfo?.name || logData()?.printData?.sop?.name }}
                                        </span>
                                    </div>
                                }

                                @if(logData()?.printData?.inputs) {
                                    <div>
                                        <span class="text-xs text-slate-500 block mb-1">Thông số đầu vào</span>
                                        <div class="flex flex-wrap gap-2">
                                            @for(key of objectKeys(logData()?.printData?.inputs); track key) {
                                                @if(key !== 'sampleList' && key !== 'targetIds') {
                                                    <span class="bg-white px-2 py-1 rounded border border-slate-200 text-xs font-mono text-slate-600">
                                                        {{key}}: <b>{{logData()?.printData?.inputs[key]}}</b>
                                                    </span>
                                                }
                                            }
                                        </div>
                                    </div>
                                }

                                <!-- Sample List -->
                                @if(logData()?.printData?.inputs?.sampleList?.length > 0) {
                                   <div>
                                       <span class="text-xs text-slate-500 block">Danh sách mẫu</span>
                                       <span class="font-bold text-slate-800 break-words font-mono text-sm leading-snug">{{ formatSampleList(logData()?.printData?.inputs?.sampleList) }}</span>
                                   </div>
                                }

                                @if(logData()?.printData?.analysisDate) {
                                    <div>
                                        <span class="text-xs text-slate-500 block">Ngày phân tích</span>
                                        <span class="font-bold text-slate-800">{{ logData()?.printData?.analysisDate | date:'dd/MM/yyyy' }}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <!-- Items List (If Batch Approval) -->
                    @if(logData()?.printData?.items) {
                        <div class="mt-8 pt-8 border-t border-slate-100">
                            <h4 class="text-xs font-bold text-slate-400 uppercase mb-4">Danh sách hóa chất sử dụng</h4>
                            <div class="overflow-hidden rounded-xl border border-slate-200">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                        <tr>
                                            <th class="px-4 py-3">Tên hóa chất</th>
                                            <th class="px-4 py-3 text-right">Lượng dùng</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        @for(item of logData()?.printData?.items; track item.name) {
                                            <tr class="bg-white">
                                                <td class="px-4 py-3 font-medium text-slate-700">{{item.displayName || item.name}}</td>
                                                <td class="px-4 py-3 text-right font-mono font-bold text-slate-600">
                                                    {{formatNum(item.stockNeed)}} {{item.stockUnit}}
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </div>
            </div>
        }
    </div>
  `
})
export class TraceabilityComponent implements OnInit {
  // Input Binding from Router (Angular 16+)
  @Input() id?: string;

  fb = inject(FirebaseService);
  toast = inject(ToastService);
  formatDate = formatDate;
  formatNum = formatNum;
  formatSampleList = formatSampleList;
  objectKeys = Object.keys;

  logData = signal<Log | null>(null);
  isLoading = signal(false);
  errorMsg = signal('');

  qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');

  ngOnInit() {
      if (this.id) {
          this.loadData(this.id);
      } else {
          this.errorMsg.set('Không có mã ID được cung cấp.');
      }
  }

  async loadData(id: string) {
      this.isLoading.set(true);
      this.errorMsg.set('');
      
      try {
          // 1. Try Direct Log Lookup (Priority 1)
          const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/logs/${id}`);
          let snap = await getDoc(logRef);

          if (snap.exists()) {
              this.handleLogData({ id: snap.id, ...snap.data() } as Log);
              return;
          }

          // 2. Try Lookup by Print Job ID (Legacy or linked) (Priority 2)
          const jobRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs/${id}`);
          let jobSnap = await getDoc(jobRef);
          
          if (jobSnap.exists()) {
              const jobData = jobSnap.data() as any;
              const mockLog: Log = {
                  id: id,
                  action: 'PRINT_JOB_RECORD',
                  details: 'Hồ sơ in ấn lưu trữ',
                  timestamp: jobData.createdAt || new Date(),
                  user: jobData.createdBy || 'System',
                  printable: true,
                  printData: jobData // Embed full data
              };
              this.handleLogData(mockLog);
              return;
          }

          // 3. Try Lookup by REQUEST ID (Dashboard links point here) (Priority 3)
          const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/requests/${id}`);
          let reqSnap = await getDoc(reqRef);

          if (reqSnap.exists()) {
              const reqData = reqSnap.data() as any;
              
              // Map Request format to Log format for display consistency
              // RequestItem needs to be mapped to CalculatedItem-like structure for the template
              const mappedItems = (reqData.items || []).map((item: any) => ({
                  name: item.name,
                  displayName: item.displayName,
                  stockNeed: item.amount, // Request stores 'amount' as stock deduction
                  stockUnit: item.stockUnit || item.unit,
                  // Request items are usually flattened, so no breakdown
                  isComposite: false
              }));

              const mockLog: Log = {
                  id: reqSnap.id,
                  action: reqData.status === 'approved' ? 'APPROVED_REQUEST' : 'PENDING_REQUEST',
                  details: `Yêu cầu phân tích: ${reqData.sopName}`,
                  timestamp: reqData.approvedAt || reqData.timestamp,
                  user: reqData.user || 'Unknown',
                  printable: true,
                  sopBasicInfo: {
                      name: reqData.sopName,
                      category: 'Request Record'
                  },
                  printData: {
                      // We might not have the full SOP object here, but we have inputs
                      sop: { name: reqData.sopName, category: 'Request', id: reqData.sopId } as any,
                      inputs: { 
                          ...reqData.inputs, 
                          sampleList: reqData.sampleList,
                          targetIds: reqData.targetIds
                      },
                      items: mappedItems,
                      margin: reqData.margin,
                      analysisDate: reqData.analysisDate
                  }
              };
              
              this.handleLogData(mockLog);
              return;
          }

          // 4. Not Found
          this.errorMsg.set(`Không tìm thấy dữ liệu cho mã: ${id}`);

      } catch (e: any) {
          console.error(e);
          this.errorMsg.set('Lỗi kết nối: ' + e.message);
      } finally {
          this.isLoading.set(false);
      }
  }

  handleLogData(log: Log) {
      // Hydrate if printJobId exists but printData is missing (New Arch)
      if (log.printJobId && !log.printData) {
          const jobRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs/${log.printJobId}`);
          getDoc(jobRef).then(s => {
              if (s.exists()) {
                  log.printData = s.data() as any;
                  this.logData.set(log);
                  setTimeout(() => this.generateQr(log.id), 100);
              }
          });
      } else {
          this.logData.set(log);
          setTimeout(() => this.generateQr(log.id), 100);
      }
  }

  generateQr(text: string) {
      if (typeof QRious === 'undefined' || !this.qrCanvas()) return;
      
      // Use same URL structure as print layout
      const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
      const fullUrl = baseUrl + text;

      new QRious({
          element: this.qrCanvas()!.nativeElement,
          value: fullUrl,
          size: 150,
          level: 'M'
      });
  }
}
