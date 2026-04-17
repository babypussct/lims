import { Component, Input, Output, EventEmitter, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardRequest } from '../../../../core/models/standard.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-requests-kanban',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-4 h-full p-2 overflow-x-auto custom-scrollbar items-start relative min-h-[500px]">
      
      <!-- COLUMN 1: PENDING_APPROVAL -->
      <div class="flex-shrink-0 w-[320px] max-w-[85vw] flex flex-col bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 h-full max-h-full overflow-hidden shadow-sm">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-amber-50/50 dark:bg-amber-900/10">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <h3 class="font-black text-amber-700 dark:text-amber-500 text-sm">Chờ Duyệt</h3>
          </div>
          <span class="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-lg text-xs font-black">{{ pendingApprovalReqs().length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          @for (req of pendingApprovalReqs(); track req.id) {
            <ng-container *ngTemplateOutlet="cardTemplate; context: { $implicit: req }"></ng-container>
          }
          @if (pendingApprovalReqs().length === 0) {
            <div class="p-6 text-center text-slate-400 text-xs font-bold italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">Không có yêu cầu</div>
          }
        </div>
      </div>

      <!-- COLUMN 2: IN_PROGRESS -->
      <div class="flex-shrink-0 w-[320px] max-w-[85vw] flex flex-col bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 h-full max-h-full overflow-hidden shadow-sm">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h3 class="font-black text-emerald-700 dark:text-emerald-500 text-sm">Đang Dùng</h3>
          </div>
          <span class="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500 rounded-lg text-xs font-black">{{ inProgressReqs().length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          @for (req of inProgressReqs(); track req.id) {
            <ng-container *ngTemplateOutlet="cardTemplate; context: { $implicit: req }"></ng-container>
          }
          @if (inProgressReqs().length === 0) {
            <div class="p-6 text-center text-slate-400 text-xs font-bold italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">Không có yêu cầu</div>
          }
        </div>
      </div>

      <!-- COLUMN 3: PENDING_RETURN -->
      <div class="flex-shrink-0 w-[320px] max-w-[85vw] flex flex-col bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 h-full max-h-full overflow-hidden shadow-sm">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-900/10">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <h3 class="font-black text-indigo-700 dark:text-indigo-400 text-sm">Chờ Nhận Trả</h3>
          </div>
          <span class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-black">{{ pendingReturnReqs().length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          @for (req of pendingReturnReqs(); track req.id) {
            <ng-container *ngTemplateOutlet="cardTemplate; context: { $implicit: req }"></ng-container>
          }
          @if (pendingReturnReqs().length === 0) {
            <div class="p-6 text-center text-slate-400 text-xs font-bold italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">Không có yêu cầu</div>
          }
        </div>
      </div>

      <!-- COLUMN 4: COMPLETED / REJECTED -->
      <div class="flex-shrink-0 w-[320px] max-w-[85vw] flex flex-col bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 h-full max-h-full overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-100 dark:bg-slate-800/50">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-slate-400 text-sm"></div>
            <h3 class="font-black text-slate-600 dark:text-slate-400 text-sm">Đã Hoàn Tất</h3>
          </div>
          <span class="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-black">{{ completedReqs().length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          @for (req of completedReqs(); track req.id) {
            <ng-container *ngTemplateOutlet="cardTemplate; context: { $implicit: req }"></ng-container>
          }
          @if (completedReqs().length === 0) {
            <div class="p-6 text-center text-slate-400 text-xs font-bold italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">Không có yêu cầu</div>
          }
        </div>
      </div>

    </div>

    <!-- REUSABLE CARD TEMPLATE -->
    <ng-template #cardTemplate let-req>
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 transition-all flex flex-col gap-3 group relative cursor-default" [class.ring-2]="isOverdue(req) && req.status === 'IN_PROGRESS'" [class.ring-rose-400]="isOverdue(req) && req.status === 'IN_PROGRESS'">
        
        <!-- Header: User & Time -->
        <div class="flex justify-between items-start gap-2">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 uppercase font-black text-[10px] shrink-0 border border-slate-200 dark:border-slate-700">
                {{req.requestedByName.charAt(0)}}
            </div>
            <div class="flex flex-col">
              <span class="font-black text-slate-700 dark:text-slate-200 text-xs">{{req.requestedByName}}</span>
              <span class="text-[9px] text-slate-400 font-bold">{{req.requestDate | date:'dd/MM/yyyy HH:mm'}}</span>
            </div>
          </div>
          
          <!-- End/Return Date Indicator -->
          @if(req.expectedReturnDate && req.status === 'IN_PROGRESS') {
            <div class="px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap" [ngClass]="isOverdue(req) ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'">
              <i class="fa-regular fa-clock mr-0.5"></i> {{req.expectedReturnDate | date:'dd/MM'}}
            </div>
          }
        </div>
        
        <!-- Center: Standard Name -->
        <div>
          <h4 class="font-black text-sm text-slate-800 dark:text-slate-100 leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{req.standardName}}</h4>
          <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic line-clamp-2" [title]="req.purpose">{{req.purpose}}</p>
        </div>

        <!-- Detail Grid -->
        <div class="grid grid-cols-2 gap-1.5 mt-1 bg-slate-50/50 dark:bg-slate-800/30 p-2 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
          <div class="flex flex-col">
              <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Số Lô (LOT)</span>
              <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate">{{req.lotNumber || 'N/A'}}</span>
          </div>
          <div class="flex flex-col">
              <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hạn dùng (EXP)</span>
              <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate" [class.text-rose-500]="isExpOverdue(req.standardDetails?.expiry_date)">{{req.standardDetails?.expiry_date | date:'dd/MM/yyyy' || 'N/A'}}</span>
          </div>
          <div class="flex flex-col col-span-2 mt-1">
              <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Kho / Vị trí</span>
              <div class="text-[10px] leading-snug">
                  <span class="font-black text-slate-700 dark:text-slate-300">{{req.standardDetails?.current_amount}}{{req.standardDetails?.unit}}</span>
                  <span class="text-slate-400 mx-1">•</span>
                  <span class="font-bold text-slate-600 dark:text-slate-400 break-words">{{req.standardDetails?.location || '?'}}</span>
              </div>
          </div>
        </div>

        <!-- Amount Used Bar (If any) -->
        @if(req.totalAmountUsed) {
          <div class="flex items-center gap-2 bg-rose-50 dark:bg-rose-900/10 p-1.5 rounded-lg border border-rose-100 dark:border-rose-900/30 mt-1">
              <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-rose-500 rounded-full" [style.width.%]="(req.totalAmountUsed / (req.expectedAmount || 1)) * 100"></div>
              </div>
              <span class="text-[10px] font-black text-rose-600 dark:text-rose-400 whitespace-nowrap px-1">Dùng: {{req.totalAmountUsed}} {{req.standardDetails?.unit || ''}}</span>
          </div>
        }

        <!-- Actions -->
        <div class="flex items-center justify-end gap-1 mt-1 pt-2 border-t border-slate-100 dark:border-slate-800/50">
          @if(req.status === 'PENDING_APPROVAL' && auth.canApproveStandards()) {
              <button (click)="actionApprove.emit(req)" class="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm active:scale-95" title="Duyệt & Giao"><i class="fa-solid fa-check text-[10px]"></i></button>
              <button (click)="actionReject.emit(req)" class="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition active:scale-95" title="Từ chối"><i class="fa-solid fa-times text-[10px]"></i></button>
          }
          @if(req.status === 'IN_PROGRESS') {
              @if(req.requestedBy === auth.currentUser()?.uid) {
                  <button (click)="actionLogUsage.emit(req)" class="px-2 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm active:scale-95 text-[9px] font-bold" title="Ghi nhận dùng"><i class="fa-solid fa-pen-nib mr-1"></i> GHI NHẬN</button>
                  <button (click)="actionReturn.emit({req: req, isForce: false})" class="px-2 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-sm active:scale-95 text-[9px] font-bold" title="Báo cáo trả"><i class="fa-solid fa-reply mr-1"></i> BÁO TRẢ</button>
              }
              @if(auth.canApproveStandards() && req.requestedBy !== auth.currentUser()?.uid) {
                  <button (click)="actionReturn.emit({req: req, isForce: true})" class="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition active:scale-95 text-[9px] font-bold" title="Thu hồi trực tiếp"><i class="fa-solid fa-hand-holding-hand mr-1"></i> THU HỒI</button>
              }
          }
          @if(req.status === 'PENDING_RETURN' && auth.canApproveStandards()) {
              <button (click)="actionAdminReceive.emit(req)" class="px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm active:scale-95 text-[9px] font-bold"><i class="fa-solid fa-check-to-slot mr-1"></i> NHẬN TRẢ</button>
          }
          @if(req.status === 'COMPLETED' || req.status === 'REJECTED') {
              <div class="text-[9px] font-bold text-slate-400 flex items-center gap-1 px-1"><i class="fa-solid fa-lock"></i> Đã khóa</div>
          }
          @if(auth.canDeleteStandardLogs()) {
              <button (click)="actionDelete.emit(req)" class="p-1.5 text-rose-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition active:scale-95 ml-auto" title="Xóa yêu cầu"><i class="fa-solid fa-trash-can text-[10px]"></i></button>
          }
        </div>
      </div>
    </ng-template>
  `
})
export class RequestsKanbanComponent {
  auth = inject(AuthService);

  @Input() set requests(value: StandardRequest[]) {
    this._requests.set(value);
  }
  get requests() {
    return this._requests();
  }
  private _requests = signal<StandardRequest[]>([]);

  @Output() actionApprove = new EventEmitter<StandardRequest>();
  @Output() actionReject = new EventEmitter<StandardRequest>();
  @Output() actionLogUsage = new EventEmitter<StandardRequest>();
  @Output() actionReturn = new EventEmitter<{req: StandardRequest, isForce: boolean}>();
  @Output() actionAdminReceive = new EventEmitter<StandardRequest>();
  @Output() actionDelete = new EventEmitter<StandardRequest>();

  Date = Date;

  pendingApprovalReqs = computed(() => this._requests().filter(r => r.status === 'PENDING_APPROVAL'));
  inProgressReqs = computed(() => this._requests().filter(r => r.status === 'IN_PROGRESS'));
  pendingReturnReqs = computed(() => this._requests().filter(r => r.status === 'PENDING_RETURN'));
  completedReqs = computed(() => this._requests().filter(r => ['COMPLETED', 'REJECTED'].includes(r.status)));

  isOverdue(req: StandardRequest): boolean {
    if (!req.expectedReturnDate) return false;
    return req.expectedReturnDate < Date.now();
  }

  isExpOverdue(expiryDate?: string | null): boolean {
    if (!expiryDate) return false;
    return new Date(expiryDate).getTime() < Date.now();
  }
}
