
import { Component, inject, signal, Input, OnInit, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { formatDate, formatNum, formatSampleList, naturalCompare } from '../../shared/utils/utils';
import { Log } from '../../core/models/log.model';
import { ToastService } from '../../core/services/toast.service';
import { MasterTargetService } from '../targets/master-target.service';
import { resolveCompoundDisplayName } from '../results/shared/compound-id-resolver';

declare let QRious: any;

@Component({
  selector: 'app-traceability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-screen overflow-y-auto max-w-7xl mx-auto pb-20 fade-in px-4 md:px-0">
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
                <p class="text-slate-400 font-bold text-sm">Đang tải dữ liệu gốc...</p>
            </div>
        } @else if(isVerifying()) {
            <div class="py-20 max-w-md mx-auto fade-in">
                <div class="bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800 text-left font-mono relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-emerald-500/20">
                        <div class="h-full bg-emerald-500 transition-all duration-500 ease-out" [style.width]="(verifyStep() / 3 * 100) + '%'"></div>
                    </div>
                    <div class="flex items-center gap-3 mb-6 mt-2">
                        <i class="fa-solid fa-shield-halved text-emerald-400 text-xl"></i>
                        <span class="text-emerald-400 font-bold tracking-widest uppercase text-sm">Blockchain Verification</span>
                    </div>
                    
                    <div class="space-y-4 text-xs">
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 0">
                            <i class="fa-solid fa-circle-check text-emerald-500"></i>
                            <span class="text-slate-300">Đang thiết lập kết nối mã hóa...</span>
                        </div>
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 1">
                            @if(verifyStep() >= 1) {
                                <i class="fa-solid fa-circle-check text-emerald-500"></i>
                                <span class="text-slate-300">Đang đối chiếu chữ ký điện tử...</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-500"></i>
                                <span class="text-slate-500">Đang đối chiếu chữ ký điện tử...</span>
                            }
                        </div>
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 2">
                            @if(verifyStep() >= 2) {
                                <i class="fa-solid fa-circle-check text-emerald-500"></i>
                                <span class="text-slate-300">Xác thực tính toàn vẹn dữ liệu gốc...</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-500"></i>
                                <span class="text-slate-500">Xác thực tính toàn vẹn dữ liệu gốc...</span>
                            }
                        </div>
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 3">
                            @if(verifyStep() >= 3) {
                                <i class="fa-solid fa-circle-check text-emerald-500"></i>
                                <span class="text-emerald-400 font-bold text-[13px]">Xác minh hoàn tất!</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-500"></i>
                                <span class="text-slate-500">Hoàn thiện đối chiếu...</span>
                            }
                        </div>
                    </div>
                </div>
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
                            <div class="flex items-center gap-2 mb-2">
                                <span class="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Transaction ID
                                </span>
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                                    <i class="fa-solid fa-shield-check"></i> Verified
                                </span>
                            </div>
                            <div class="font-mono text-xl md:text-3xl font-black text-slate-800 break-all">
                                {{logData()?.id}}
                            </div>
                            <div class="mt-2 text-sm text-slate-500 font-medium flex items-center gap-2">
                                <i class="fa-solid fa-clock"></i> {{formatDate(logData()?.timestamp)}}
                            </div>
                            @if (getAssociatedRequestId(); as reqId) {
                                <div class="mt-4">
                                    @if (auth.currentUser()) {
                                        <button (click)="viewBatchResults(reqId)" 
                                                class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-500/20 active:scale-95 transition">
                                            <i class="fa-solid fa-square-poll-vertical"></i>
                                            <span>Xem Kết Quả Mẻ Phân Tích</span>
                                        </button>
                                    } @else {
                                        <div class="inline-flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-sm">
                                            <div class="mt-0.5 w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                                                <i class="fa-solid fa-lock text-[10px]"></i>
                                            </div>
                                            <div>
                                                <p class="text-[10px] font-bold text-slate-700 leading-tight mb-1">Kết quả thuộc chế độ bảo mật.</p>
                                                <p class="text-[9px] text-slate-500 leading-tight">Yêu cầu đăng nhập hệ thống LIMS để xem chi tiết.</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        <div class="shrink-0 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                            <canvas #qrCanvas class="w-32 h-32"></canvas>
                        </div>
                    </div>

                    <!-- Workflow Stepper -->
                    @if(logData()?.status; as status) {
                        <div class="mb-8 pb-8 border-b border-slate-100 fade-in">
                            <h4 class="text-xs font-bold text-slate-400 uppercase mb-4">Tiến độ quy trình</h4>
                            <div class="flex items-center justify-between relative max-w-2xl mx-auto px-4 mt-6">
                                <!-- Background Line -->
                                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
                                <!-- Active Line -->
                                <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-1000 ease-out"
                                     [style.width]="status === 'completed' ? '100%' : (status === 'approved' ? '100%' : (status === 'draft' ? '66%' : (status === 'pending' ? '33%' : '0%')))"></div>
                                
                                <!-- Step 1: Request -->
                                <div class="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-500 border-2"
                                         [ngClass]="status !== 'unknown' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'">
                                        <i class="fa-solid fa-clipboard-list"></i>
                                    </div>
                                    <span class="text-[10px] font-bold" [ngClass]="status !== 'unknown' ? 'text-emerald-700' : 'text-slate-400'">Tiếp nhận</span>
                                </div>

                                <!-- Step 2: Prepare -->
                                <div class="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-500 border-2"
                                         [ngClass]="(status === 'pending' || status === 'draft' || status === 'approved' || status === 'completed') ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'">
                                        <i class="fa-solid fa-flask"></i>
                                    </div>
                                    <span class="text-[10px] font-bold" [ngClass]="(status === 'pending' || status === 'draft' || status === 'approved' || status === 'completed') ? 'text-emerald-700' : 'text-slate-400'">Chuẩn bị mẫu</span>
                                </div>

                                <!-- Step 3: Analyze -->
                                <div class="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-500 border-2"
                                         [ngClass]="(status === 'draft' || status === 'approved' || status === 'completed') ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'">
                                        <i class="fa-solid fa-microscope"></i>
                                    </div>
                                    <span class="text-[10px] font-bold" [ngClass]="(status === 'draft' || status === 'approved' || status === 'completed') ? 'text-emerald-700' : 'text-slate-400'">Phân tích máy</span>
                                </div>

                                <!-- Step 4: Approve -->
                                <div class="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-500 border-2"
                                         [ngClass]="(status === 'approved' || status === 'completed') ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'">
                                        <i class="fa-solid fa-check-double"></i>
                                    </div>
                                    <span class="text-[10px] font-bold" [ngClass]="(status === 'approved' || status === 'completed') ? 'text-emerald-700' : 'text-slate-400'">Phê duyệt</span>
                                </div>
                            </div>
                        </div>
                    }

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
                                <div class="bg-blue-50/70 border border-blue-100/70 rounded-2xl p-4.5 relative overflow-hidden group shadow-3xs">
                                    <div class="flex justify-between items-start gap-4">
                                        <div>
                                            <div class="font-bold text-blue-800 text-lg mb-1">{{getActionLabel(logData()?.action)}}</div>
                                            <p class="text-sm text-blue-600 font-medium leading-relaxed">{{logData()?.details}}</p>
                                        </div>
                                        
                                        <!-- Tình trạng Phiếu Badge -->
                                        @if(logData()?.status; as status) {
                                            <span [class]="status === 'pending' ? 'bg-amber-100/90 text-amber-800 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30' :
                                                           status === 'approved' ? 'bg-emerald-100/90 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30' :
                                                           status === 'rejected' ? 'bg-rose-100/90 text-rose-800 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30' :
                                                           status === 'completed' ? 'bg-fuchsia-100/90 text-fuchsia-800 border-fuchsia-200/60 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 dark:border-fuchsia-900/30' :
                                                           status === 'draft' ? 'bg-slate-100/90 text-slate-800 border-slate-200/60 dark:bg-slate-800/40 dark:text-slate-450 dark:border-slate-700/50' : 'bg-slate-100/90 text-slate-800 border-slate-200/60'"
                                                  class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border shrink-0 shadow-3xs">
                                                {{ status === 'pending' ? 'Chờ duyệt' :
                                                   status === 'approved' ? 'Đã duyệt' :
                                                   status === 'rejected' ? 'Bị từ chối' :
                                                   status === 'completed' ? 'Đã hoàn thành' :
                                                   status === 'draft' ? 'Lưu nháp' : status }}
                                            </span>
                                        }
                                    </div>
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
                                                @if(key !== 'sampleList' && key !== 'targetIds' && key !== 'sampleTargetMap') {
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

                                <!-- Target Map -->
                                @if(getSampleTargetMap()) {
                                    <div class="pt-2">
                                        <span class="text-xs text-slate-500 block mb-2 font-bold uppercase tracking-wider text-slate-400">Chỉ tiêu phân tích theo từng mẫu</span>
                                        <div class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                                            @for(sample of getSortedSamples(getSampleTargetMap()); track sample) {
                                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-xs">
                                                    <span class="font-mono font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded self-start shrink-0">{{ sample }}</span>
                                                    <div class="flex flex-wrap gap-1.5 justify-end">
                                                        @for(tId of getSortedTargets(getSampleTargetMap()![sample]); track tId) {
                                                            <span class="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-350 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                                                {{ resolveCompoundName(tId) }}
                                                            </span>
                                                        } @empty {
                                                            <span class="text-xs text-slate-400 dark:text-slate-500 italic">Không có chỉ tiêu</span>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
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

  auth = inject(AuthService);
  fb = inject(FirebaseService);
  toast = inject(ToastService);
  private masterTargetService = inject(MasterTargetService);
  private router = inject(Router);
  
  formatDate = formatDate;
  formatNum = formatNum;
  formatSampleList = formatSampleList;
  objectKeys = Object.keys;

  logData = signal<Log | null>(null);
  masterTargets = signal<any[]>([]);
  isLoading = signal(false);
  isVerifying = signal(false);
  verifyStep = signal(0);
  errorMsg = signal('');

  qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');

  async ngOnInit() {
      if (this.id) {
          this.loadData(this.id);
      } else {
          this.errorMsg.set('Không có mã ID được cung cấp.');
      }

      try {
          const analytes = await this.masterTargetService.getAll();
          this.masterTargets.set(analytes);
      } catch (e) {
          console.warn('Failed to load master analytes in TraceabilityComponent', e);
      }
  }

  resolveCompoundName(compoundId: string): string {
      return resolveCompoundDisplayName(compoundId, this.masterTargets());
  }

  getAssociatedRequestId(): string | null {
      const log = this.logData();
      if (!log) return null;
      if (log.action.includes('REQUEST') || log.sopBasicInfo) {
          return log.id;
      }
      return log.requestId || (log.printData as any)?.requestId || log.id || null;
  }

  viewBatchResults(requestId: string) {
      this.router.navigate(['/results-view', requestId]);
  }

  getActionLabel(action: string | undefined): string {
      if (!action) return 'Không xác định';
      const map: Record<string, string> = {
          'PENDING_REQUEST': 'Yêu cầu chờ duyệt',
          'APPROVED_REQUEST': 'Yêu cầu đã duyệt',
          'REJECTED_REQUEST': 'Yêu cầu bị từ chối',
          'COMPLETED_REQUEST': 'Yêu cầu đã hoàn thành',
          'DRAFT_REQUEST': 'Phiếu yêu cầu lưu nháp',
          'EDIT_REQUEST': 'Chỉnh sửa phiếu yêu cầu',
          'PRINT_JOB_RECORD': 'Lưu trữ phiếu in',
          'DIRECT_APPROVE': 'Duyệt & In trực tiếp',
          'APPROVE_REQUEST': 'Duyệt yêu cầu',
          'REVOKE_APPROVE': 'Hoàn tác phê duyệt',
          
          'CREATE_STANDARD_REQUEST': 'Yêu cầu mượn chuẩn',
          'REQUEST_STANDARD': 'Yêu cầu mượn chuẩn',
          'APPROVE_STANDARD_REQUEST': 'Duyệt mượn chuẩn',
          'REJECT_STANDARD_REQUEST': 'Từ chối mượn chuẩn',
          'REPORT_RETURN_STANDARD': 'Báo cáo trả chuẩn',
          'RETURN_STANDARD': 'Nhận lại chuẩn',
          'ASSIGN_STANDARD': 'Gán chuẩn cho mượn',
          
          'SAVE_RESULT_DRAFT': 'Lưu nháp kết quả',
          'PUBLISH_RESULT_REPORT': 'Xuất bản báo cáo kết quả',
          'REVERT_RESULT_DRAFT': 'Hủy xuất bản báo cáo',
          'RESET_RESULT_DATA': 'Reset số liệu kết quả',
          'RESTORE_RESULT_BACKUP': 'Khôi phục số liệu lưu trữ',
          'RESTORE_RESULT_VERSION': 'Khôi phục phiên bản cũ',
          
          'generate_pdf': 'Tạo tệp PDF',
          'archive_reports': 'Lưu trữ báo cáo'
      };
      if (map[action]) return map[action];
      if (action.includes('APPROVE')) return 'Phê duyệt';
      if (action.includes('CREATE')) return 'Tạo mới';
      if (action.includes('UPDATE')) return 'Cập nhật';
      if (action.includes('DELETE')) return 'Xóa';
      return action;
  }

  getSampleTargetMap(): Record<string, string[]> | null {
      const log = this.logData() as any;
      if (!log) return null;
      
      const targetMap = log.sampleTargetMap 
          || log.inputs?.sampleTargetMap
          || log.printData?.sampleTargetMap
          || log.printData?.inputs?.sampleTargetMap;
          
      if (targetMap && typeof targetMap === 'object' && !Array.isArray(targetMap)) {
          return targetMap as Record<string, string[]>;
      }
      return null;
  }

  getSortedSamples(map: Record<string, string[]> | null): string[] {
      if (!map) return [];
      return Object.keys(map).sort(naturalCompare);
  }

  getSortedTargets(tIds: string[] | undefined): string[] {
      if (!tIds || !Array.isArray(tIds)) return [];
      return [...tIds].sort((a, b) => naturalCompare(this.resolveCompoundName(a), this.resolveCompoundName(b)));
  }

  async loadData(id: string) {
      this.isLoading.set(true);
      this.errorMsg.set('');
      
      try {
          // 1. Try Direct Log Lookup (Priority 1)
          const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/logs/${id}`);
          const snap = await getDoc(logRef);

          if (snap.exists()) {
              this.startVerificationProcess({ id: snap.id, ...snap.data() } as Log);
              return;
          }

          // 2. Try Lookup by Print Job ID (Legacy or linked) (Priority 2)
          const jobRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs/${id}`);
          const jobSnap = await getDoc(jobRef);
          
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
              this.startVerificationProcess(mockLog);
              return;
          }

          // 3. Try Lookup by REQUEST ID (Dashboard links point here) (Priority 3)
          const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/requests/${id}`);
          const reqSnap = await getDoc(reqRef);

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
                  action: reqData.status === 'pending' ? 'PENDING_REQUEST' :
                          reqData.status === 'approved' ? 'APPROVED_REQUEST' :
                          reqData.status === 'rejected' ? 'REJECTED_REQUEST' :
                          reqData.status === 'completed' ? 'COMPLETED_REQUEST' :
                          reqData.status === 'draft' ? 'DRAFT_REQUEST' : 'APPROVED_REQUEST',
                  details: `Yêu cầu phân tích: ${reqData.sopName}`,
                  timestamp: reqData.approvedAt || reqData.timestamp,
                  user: reqData.user || 'Unknown',
                  printable: true,
                  status: reqData.status, // Custom field stored in Log type!
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
                          targetIds: reqData.targetIds,
                          sampleTargetMap: reqData.sampleTargetMap
                      },
                      items: mappedItems,
                      margin: reqData.margin,
                      analysisDate: reqData.analysisDate
                  }
              };
              
              this.startVerificationProcess(mockLog);
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

  startVerificationProcess(log: Log) {
      this.isLoading.set(false);
      this.isVerifying.set(true);
      this.verifyStep.set(0);
      
      let step = 0;
      const interval = setInterval(() => {
          step++;
          this.verifyStep.set(step);
          if (step >= 3) {
              clearInterval(interval);
              setTimeout(() => {
                  this.isVerifying.set(false);
                  this.handleLogData(log);
              }, 600);
          }
      }, 500);
  }

  handleLogData(log: Log) {
      const getStatusAndHydrate = async () => {
          // If log has requestId and no status, fetch request status
          if (log.requestId && !log.status) {
              try {
                  const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/requests/${log.requestId}`);
                  const reqSnap = await getDoc(reqRef);
                  if (reqSnap.exists()) {
                      log.status = reqSnap.data()['status'];
                  }
              } catch (e) {
                  console.warn('Failed to fetch request status in Traceability', e);
              }
          }

          // Hydrate if printJobId exists but printData is missing (New Arch)
          if (log.printJobId && !log.printData) {
              try {
                  const jobRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs/${log.printJobId}`);
                  const jobSnap = await getDoc(jobRef);
                  if (jobSnap.exists()) {
                      log.printData = jobSnap.data() as any;
                  }
              } catch (e) {
                  console.warn('Failed to fetch print job in Traceability', e);
              }
          }
          
          this.logData.set(log);
          setTimeout(() => this.generateQr(log.id), 100);
      };

      getStatusAndHydrate();
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
