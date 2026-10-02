
import { Component, inject, signal, computed, effect, Input, OnInit, OnDestroy, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { doc, getDoc, collection, query, where, getDocs, type DocumentReference, type DocumentSnapshot } from 'firebase/firestore';
import { formatDate, formatNum, formatSampleList, naturalCompare, getAvatarUrl } from '../../shared/utils/utils';
import { Log } from '../../core/models/log.model';
import { ToastService } from '../../core/services/toast.service';
import { MasterTargetService } from '../targets/master-target.service';
import { resolveCompoundDisplayName, getAssignedTargetsForSample, getCanonicalId } from '../results/shared/compound-id-resolver';
import { getSampleDescriptionSnapshot } from '../../shared/utils/sample-description.utils';
import { TargetService } from '../targets/target.service';
import { TargetGroup } from '../../core/models/sop.model';
import { classifyTargetScope, buildTargetScopePresentation, TargetScopePresentation } from '../targets/target-scope-classifier';
import { ensureQrious } from '../../shared/utils/external-script-loader';
import { normalizeTraceabilityLookup } from '../../shared/utils/traceability-lookup';
import { QrGlobalService } from '../../core/services/qr-global.service';
import { AppButtonComponent } from '../../shared/components/ui/button/button.component';
import { BatchWorksheetService } from '../../core/services/batch-worksheet.service';
import { Request } from '../../core/models/request.model';
import { canEditWorksheet, isWorksheetData, worksheetReference } from '../../shared/utils/batch-worksheet';
import { AppEmptyStateComponent } from '../../shared/components/ui/empty-state/empty-state.component';
import { AppPageHeaderComponent } from '../../shared/components/ui/page-header/page-header.component';
import { AppUiTimelineComponent } from '../../shared/components/ui/timeline/timeline.component';
import { TimelineItem, TimelineStatus } from '../../shared/components/ui/timeline/timeline.model';
import { getActivityActionLabel } from '../../core/activity/activity-feed.utils';
import { isRegisteredActivityAction } from '../../core/activity/activity-event-registry';
import { TraceabilityDataService, StandardTraceRecord, StandardHistorySource, isStandardActivity } from './traceability-data.service';
import { buildStandardTraceTimeline, mergeStandardUsages, standardTraceSummary, standardTraceTitle } from './standard-traceability.utils';
import { UsageLog } from '../../core/models/standard.model';
import { A4DocumentPreviewComponent } from '../../shared/components/a4-document-preview/a4-document-preview.component';
import { A4Document } from '../../shared/utils/a4-document';
import { buildTraceDocument } from '../../shared/utils/business-print-documents';

export interface TraceabilitySampleRow {
  sampleId: string;
  description: string;
  targetScope: TargetScopePresentation;
  targetNames: string[];
  totalTargets: number;
}

@Component({
  selector: 'app-traceability',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AppButtonComponent, AppEmptyStateComponent, AppPageHeaderComponent, AppUiTimelineComponent, A4DocumentPreviewComponent],
  template: `
    @if (tracePrintDocument(); as document) { <app-a4-document-preview [document]="document" (closed)="tracePrintDocument.set(null)" /> }
    <div class="relative mx-auto min-h-full w-full max-w-7xl shrink-0 p-4 md:p-6 pb-20 fade-in">
        <app-page-header
          [variant]="id ? 'detail' : 'page'"
          [sticky]="!!id"
          [title]="id ? 'Chi tiết truy xuất hồ sơ' : 'Truy xuất nguồn gốc'"
          [subtitle]="id ? 'Nhật ký hoạt động và dữ liệu toàn vẹn của hồ sơ LIMS.' : 'Tra cứu nhật ký hoạt động và thông tin minh bạch.'"
          icon="fa-qrcode"
          class="mb-6 block">
          @if (id) {
            <app-button pageHeaderLeading variant="ghost" size="sm" (click)="openLookup()" title="Quay lại tra cứu hồ sơ">
              <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
              <span class="sr-only">Quay lại tra cứu hồ sơ</span>
            </app-button>
          }

          @if (id) {
            <div pageHeaderActions class="contents">
              <app-button variant="secondary" size="sm" (click)="startQrScan()" [disabled]="isLoading() || isVerifying()">
                <i class="fa-solid fa-qrcode" aria-hidden="true"></i>
                Quét QR
              </app-button>
              <app-button size="sm" (click)="openLookup()">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                Tra cứu mã khác
              </app-button>
            </div>
          } @else {
            <app-button pageHeaderActions variant="secondary" size="sm" (click)="returnToApp()" [disabled]="!auth.isAuthReady()">
              <i class="fa-solid" [ngClass]="auth.currentUser() ? 'fa-house' : 'fa-right-to-bracket'" aria-hidden="true"></i>
              {{ auth.currentUser() ? 'Về Dashboard' : 'Đăng nhập' }}
            </app-button>
          }

          @if (logData(); as headerLog) {
            <div pageHeaderMeta class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <i class="fa-solid fa-shield-halved text-[10px]" aria-hidden="true"></i>
                  Đã xác thực
                </span>
                <span class="inline-flex min-w-0 items-center gap-2">
                  <i class="fa-solid fa-fingerprint text-slate-400" aria-hidden="true"></i>
                  <span class="min-w-0">
                    <span class="mr-1 text-[9px] font-black uppercase tracking-wider text-slate-400">Mã truy xuất</span>
                    <span class="font-mono font-bold text-slate-700 dark:text-slate-300">{{ headerLog.id }}</span>
                  </span>
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <i class="fa-regular fa-clock text-slate-400" aria-hidden="true"></i>
                  <span>
                    <span class="mr-1 text-[9px] font-black uppercase tracking-wider text-slate-400">Ghi nhận</span>
                    {{ formatDate(headerLog.timestamp) }}
                  </span>
                </span>
                @if (getDistinctAssociatedRequestId(); as requestId) {
                  <span class="inline-flex items-center gap-1.5">
                    <i class="fa-solid fa-barcode text-slate-400" aria-hidden="true"></i>
                    <span>
                      <span class="mr-1 text-[9px] font-black uppercase tracking-wider text-slate-400">Hồ sơ liên quan</span>
                      <span class="font-mono font-semibold text-slate-700 dark:text-slate-300">{{ requestId }}</span>
                    </span>
                  </span>
                }
            </div>
          }
          @if (auth.currentUser() && logData() && !isLoading() && !isVerifying()) {
            <ng-container pageHeaderActions>
            @if (canPrintWorksheet()) {
              <app-button pageHeaderActions variant="secondary" size="sm" [loading]="worksheets.loading()" (click)="printWorksheet()"><i class="fa-solid fa-print" aria-hidden="true"></i> Phiếu phân tích</app-button>
              @if (canEditBatch()) {
                <app-button pageHeaderActions variant="secondary" size="sm" (click)="editBatch()"><i class="fa-solid fa-pen" aria-hidden="true"></i> Sửa thông số mẻ</app-button>
              }
            }
            <app-button pageHeaderActions variant="secondary" size="sm" (click)="printTraceRecord()"><i class="fa-solid fa-print" aria-hidden="true"></i> Xem & In hồ sơ</app-button>
            </ng-container>
          }
        </app-page-header>

        <!-- SMART LOOKUP -->
        @if (!id) {
        <section
          class="mx-auto mb-6 w-full max-w-2xl pt-8 transition-all duration-300 md:pt-14">
          <div
            class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
            [ngClass]="!isLoading() && !isVerifying() && !logData() && !errorMsg()
              ? 'rounded-2xl p-5 md:p-6'
              : 'rounded-xl p-3'">

            @if (!isLoading() && !isVerifying() && !logData() && !errorMsg()) {
              <div class="mb-4">
                <h3 class="text-base font-extrabold text-slate-800 dark:text-slate-100">Tra cứu hồ sơ LIMS</h3>
                <p class="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Nhập mã yêu cầu, mã nhật ký, mã phiếu in hoặc dán liên kết truy xuất.
                </p>
              </div>
            }

            <form (ngSubmit)="submitLookup()" class="flex flex-col sm:flex-row items-stretch gap-2">
              <label class="relative flex-1 min-w-0">
                <span class="sr-only">Mã hồ sơ cần truy xuất</span>
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                <input
                  #lookupInput
                  type="text"
                  name="traceabilityLookup"
                  [(ngModel)]="lookupValue"
                  (input)="inputError.set('')"
                  [disabled]="isLoading() || isVerifying()"
                  placeholder="Ví dụ: REQ-..., LOG-... hoặc URL truy xuất"
                  autocomplete="off"
                  spellcheck="false"
                  class="w-full h-11 pl-9 pr-9 rounded-xl border bg-slate-50 dark:bg-slate-900
                         text-sm font-mono font-semibold text-slate-700 dark:text-slate-200
                         placeholder:font-sans placeholder:font-normal placeholder:text-slate-400
                         outline-none transition focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500
                         disabled:opacity-60"
                  [ngClass]="inputError()
                    ? 'border-red-400 dark:border-red-600'
                    : 'border-slate-200 dark:border-slate-700'">
                @if (lookupValue && !isLoading() && !isVerifying()) {
                  <button
                    type="button"
                    (click)="clearLookupInput()"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                           text-slate-400 hover:text-slate-700 hover:bg-slate-200
                           dark:hover:text-slate-200 dark:hover:bg-slate-700 transition"
                    title="Xóa mã">
                    <i class="fa-solid fa-xmark text-[10px]"></i>
                  </button>
                }
              </label>

              <div class="flex gap-2">
                <app-button
                  variant="secondary"
                  type="button"
                  (click)="startQrScan()"
                  [disabled]="isLoading() || isVerifying()"
                  title="Quét mã QR">
                  <i class="fa-solid fa-qrcode text-sm"></i>
                  <span class="sm:hidden text-xs font-bold">Quét QR</span>
                </app-button>
                <app-button
                  [loading]="isLoading() || isVerifying()"
                  type="submit"
                  [disabled]="isLoading() || isVerifying()"
                  class="flex-1 sm:flex-none">
                  <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  <span>{{ isLoading() || isVerifying() ? 'Đang truy xuất' : 'Truy xuất' }}</span>
                </app-button>
              </div>
            </form>

            @if (inputError()) {
              <p class="mt-2 text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                {{ inputError() }}
              </p>
            } @else if (!logData() && !errorMsg()) {
              <p class="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
                Có thể dán trực tiếp liên kết chứa <span class="font-mono">#/traceability/...</span>
              </p>
            }
          </div>
        </section>
        }

        @if (!id && !isLoading() && !isVerifying() && !logData() && !errorMsg()) {
          <aside class="max-w-2xl mx-auto mb-6 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 overflow-hidden">
            <div class="px-5 py-4 border-b border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-circle-info text-xs"></i>
              </div>
              <div>
                <h3 class="text-sm font-extrabold text-slate-800 dark:text-slate-100">Tìm mã truy xuất ở đâu?</h3>
                <p class="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Mã được hiển thị tại các điểm sau trong quy trình làm việc.
                </p>
              </div>
            </div>

            <ol class="divide-y divide-blue-100 dark:divide-blue-900/40">
              <li class="px-5 py-3.5 flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-print text-[11px]"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Hàng Đợi In <i class="fa-solid fa-chevron-right mx-1 text-[8px] text-slate-400"></i> Xem &amp; In
                  </div>
                  <p class="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Trên phiếu in, xem <b class="text-slate-600 dark:text-slate-300">góc phải phần đầu trang</b>,
                    cạnh mã QR, tại nhãn <b class="text-slate-600 dark:text-slate-300">MÃ TRUY XUẤT</b>.
                  </p>
                </div>
              </li>

              <li class="px-5 py-3.5 flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-square-poll-vertical text-[11px]"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Kết Quả Phân Tích <i class="fa-solid fa-chevron-right mx-1 text-[8px] text-slate-400"></i> Chi Tiết Mẻ
                  </div>
                  <p class="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Sao chép dòng <b class="text-slate-600 dark:text-slate-300">Mã mẻ</b> dưới tiêu đề,
                    hoặc dùng nút <b class="text-slate-600 dark:text-slate-300">Mã QR</b> ở góc phải.
                  </p>
                </div>
              </li>

              <li class="px-5 py-3.5 flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-clock-rotate-left text-[11px]"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Trang Chủ <i class="fa-solid fa-chevron-right mx-1 text-[8px] text-slate-400"></i> Hoạt Động Gần Đây
                  </div>
                  <p class="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Với hoạt động có liên kết hồ sơ, nhấn <b class="text-slate-600 dark:text-slate-300">Truy Xuất</b>
                    để mở trực tiếp, không cần nhập lại mã.
                  </p>
                </div>
              </li>
            </ol>

            <div class="px-5 py-3 bg-white/60 dark:bg-slate-900/30 text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <i class="fa-solid fa-lightbulb mt-0.5 text-amber-500"></i>
              <span>Bạn có thể nhập nguyên mã, dán toàn bộ liên kết truy xuất hoặc quét QR trên phiếu.</span>
            </div>
          </aside>
        }

        @if(isVerifying() || isLoading()) {
            <div class="py-20 max-w-md mx-auto fade-in">
                <div class="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-left relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-fuchsia-100">
                        <div class="h-full bg-fuchsia-600 transition-all duration-500 ease-out" [style.width]="(verifyStep() / 3 * 100) + '%'"></div>
                    </div>
                    <div class="flex items-center gap-3 mb-6 mt-2">
                        <div class="w-8 h-8 rounded-full bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
                            <i class="fa-solid fa-server text-sm"></i>
                        </div>
                        <span class="text-slate-800 font-black tracking-wider uppercase text-sm">Truy xuất hồ sơ LIMS</span>
                    </div>
                    
                    <div class="space-y-4 text-xs font-medium">
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 0">
                            @if(verifyStep() >= 0) {
                                <i class="fa-solid fa-circle-check text-fuchsia-500"></i>
                                <span class="text-slate-600">Đã kết nối hệ thống máy chủ LIMS...</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-400"></i>
                                <span class="text-slate-500">Đang kết nối hệ thống máy chủ LIMS...</span>
                            }
                        </div>
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 1">
                            @if(verifyStep() >= 1) {
                                <i class="fa-solid fa-circle-check text-fuchsia-500"></i>
                                <span class="text-slate-600">Đã đồng bộ hồ sơ nhật ký mẻ phân tích...</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-400"></i>
                                <span class="text-slate-500">Đang đồng bộ hồ sơ nhật ký mẻ phân tích...</span>
                            }
                        </div>
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 2">
                            @if(verifyStep() >= 2) {
                                <i class="fa-solid fa-circle-check text-fuchsia-500"></i>
                                <span class="text-slate-600">Kiểm tra tính toàn vẹn dữ liệu...</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-400"></i>
                                <span class="text-slate-500">Kiểm tra tính toàn vẹn dữ liệu...</span>
                            }
                        </div>
                        <div class="flex items-center gap-3 transition-opacity duration-300" [class.opacity-40]="verifyStep() < 3">
                            @if(verifyStep() >= 3) {
                                <i class="fa-solid fa-circle-check text-fuchsia-500"></i>
                                <span class="text-fuchsia-700 font-black text-[13px]">Truy xuất hoàn tất!</span>
                            } @else {
                                <i class="fa-solid fa-spinner fa-spin text-slate-400"></i>
                                <span class="text-slate-500">Đang trích xuất báo cáo...</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        } @else if(errorMsg()) {
            <div class="max-w-2xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm text-center">
                <app-empty-state
                  icon="fa-magnifying-glass-minus"
                  title="Không tìm thấy hồ sơ"
                  [message]="errorMsg()">
                  @if (id) {
                    <app-button emptyStateActions size="sm" (click)="submitLookup()">
                      <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Thử lại
                    </app-button>
                  }
                  @if (!id) {
                    <app-button emptyStateActions size="sm" (click)="focusLookupInput()">Sửa mã</app-button>
                  }
                  @if (!id) {
                    <app-button emptyStateActions variant="secondary" size="sm" (click)="startQrScan()">
                      <i class="fa-solid fa-qrcode" aria-hidden="true"></i> Quét QR
                    </app-button>
                  }
                  @if (!id) {
                    <app-button emptyStateActions variant="secondary" size="sm" (click)="submitLookup()">
                      <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Tìm lại
                    </app-button>
                  }
                </app-empty-state>
            </div>
        } @else if (standardRecord(); as record) {
          <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6" aria-labelledby="standard-trace-heading">
            <div class="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="mb-1 text-xs font-bold text-sky-700 dark:text-sky-300">{{ record.recordType === 'STANDARD_USAGE' ? 'Nhật ký sử dụng chất chuẩn' : 'Phiếu mượn chất chuẩn' }}</p>
                <h2 id="standard-trace-heading" class="break-words text-lg font-extrabold text-slate-800 dark:text-slate-100">{{ standardTraceTitle(record) }}</h2>
                <p class="mt-1 break-all font-mono text-xs text-slate-500">{{ record.id }}</p>
              </div>
              @if (record.request?.status) {
                <span class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ standardStatusLabel(record.request?.status) }}</span>
              }
            </div>
            <dl class="grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              @for (field of standardSummary(); track field.label) {
                <div class="min-w-0"><dt class="text-xs text-slate-500 dark:text-slate-400">{{ field.label }}</dt><dd class="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-800 dark:text-slate-100">{{ field.value }}</dd></div>
              }
            </dl>
            @if (record.usage?.requestId) {
              <a [routerLink]="['/traceability', record.usage?.requestId]" class="mt-4 inline-flex min-h-10 max-w-full items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-200">
                <i class="fa-solid fa-arrow-up-right-from-square shrink-0" aria-hidden="true"></i><span class="break-all">Truy xuất phiếu: {{ record.usage?.requestId }}</span>
              </a>
            }
          </section>
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6" aria-labelledby="standard-trace-history-heading">
            <h3 id="standard-trace-history-heading" class="mb-4 text-base font-extrabold text-slate-800 dark:text-slate-100">Lịch sử mượn và sử dụng chất chuẩn</h3>
            @for (note of standardHistoryNotes(); track note) {
              <p class="mb-3 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:bg-amber-950 dark:text-amber-200" role="status">{{ note }}</p>
            }
            @if (standardHistoryLoading()) { <p class="mb-3 text-sm text-slate-500" role="status">Đang tải lịch sử được cấp quyền...</p> }
            @if (timelineItems().length) {
              <app-ui-timeline [items]="timelineItems()" ariaLabel="Lịch sử mượn, duyệt, sử dụng và trả chất chuẩn" />
            } @else if (!standardHistoryLoading()) {
              <app-empty-state icon="fa-clock-rotate-left" title="Chưa có mốc lịch sử được tải" message="Hồ sơ hiện có chưa cung cấp đủ nhật ký để hiển thị các lần sử dụng." />
            }
            @if (standardHistoryHasMore()) {
              <p class="mb-3 text-xs text-slate-500">Đang hiển thị phần lịch sử đã tải, sắp xếp theo thời điểm thực hiện.</p>
              <app-button variant="secondary" size="sm" [loading]="standardHistoryLoading()" (click)="loadMoreStandardHistory()">Tải thêm / tải lại lịch sử</app-button>
            }
          </section>
        } @else if(logData()) {
            <!-- HERO SUMMARY CARD (SoftUI Panel, Shadow mượt) -->
            <section class="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:p-7 relative overflow-hidden" aria-labelledby="traceability-hero-heading">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div class="flex-1 min-w-0">
                        <!-- Top Metadata Row: Status & Tag -->
                        <div class="flex flex-wrap items-center gap-2 mb-3">
                            @if (logData()?.status; as status) {
                                <span [class]="getStatusBadgeClass(status)"
                                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
                                    <i class="fa-solid" [ngClass]="getStatusIcon(status)"></i>
                                    {{ getStatusLabel(status) }}
                                </span>
                            }
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200/70 rounded-full text-[10px] font-black uppercase tracking-wider dark:bg-fuchsia-950/40 dark:border-fuchsia-900/40 dark:text-fuchsia-300">
                                <i class="fa-solid fa-shield-halved text-[10px]"></i> Hồ sơ gốc LIMS
                            </span>
                        </div>

                        <!-- Main Title: SOP / Record Name -->
                        <h2 id="traceability-hero-heading" class="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug break-words">
                            {{ getRecordHeadline() }}
                        </h2>

                        <!-- Secondary Meta Chips -->
                        <div class="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
                            <!-- Traceability Code with copy button -->
                            <div class="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Mã:</span>
                                <span class="font-mono font-bold text-slate-700 dark:text-slate-200">{{ logData()?.id }}</span>
                                <button
                                    type="button"
                                    (click)="copyText(logData()?.id || '')"
                                    class="ml-1 text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition cursor-pointer"
                                    [title]="copiedCode() ? 'Đã sao chép!' : 'Sao chép mã'">
                                    <i class="fa-solid text-xs" [ngClass]="copiedCode() ? 'fa-check text-emerald-500' : 'fa-copy'"></i>
                                </button>
                            </div>

                            <!-- Analysis Date (only when exists) -->
                            @if (getAnalysisDate(); as aDate) {
                                <div class="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                                    <i class="fa-regular fa-calendar text-slate-400"></i>
                                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Ngày phân tích:</span>
                                    <span class="font-bold">{{ aDate | date:'dd/MM/yyyy' }}</span>
                                </div>
                            }

                            <!-- Total sample count -->
                            @if (totalSampleCount() > 0) {
                                <div class="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                                    <i class="fa-solid fa-vial text-slate-400"></i>
                                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Quy mô:</span>
                                    <span class="font-bold">{{ totalSampleCount() }} mẫu</span>
                                </div>
                            }

                            <!-- View Batch Results Button (if permitted) -->
                            @if (getAssociatedRequestId(); as reqId) {
                                @if (auth.currentUser() && auth.canViewSop()) {
                                    <app-button size="sm" variant="secondary" (click)="viewBatchResults(reqId)">
                                        <i class="fa-solid fa-square-poll-vertical"></i>
                                        <span>Xem kết quả mẻ</span>
                                    </app-button>
                                }
                            }
                        </div>
                    </div>

                    <!-- Right QR Code Tile -->
                    <div class="shrink-0 bg-slate-50 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/70 text-center self-center md:self-auto shadow-xs">
                        <canvas #qrCanvas class="w-28 h-28 mx-auto"></canvas>
                        <div class="mt-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mã QR truy xuất</div>
                    </div>
                </div>
            </section>

            <!-- WORKSPACE 2-COLUMN (~62% / 38% on desktop, 1-column on mobile) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <!-- LEFT COLUMN: Lab Analysis Data (~62% desktop) -->
                <div class="lg:col-span-7 xl:col-span-8 space-y-6">

                    @if (allSampleRows().length > 0) {
                        <!-- SAMPLE & SCOPE MATRIX CARD -->
                        <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6" aria-labelledby="sample-matrix-heading">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <div class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-fuchsia-600 dark:text-fuchsia-400">
                                        <i class="fa-solid fa-vials" aria-hidden="true"></i> Nghiệp vụ phân tích
                                    </div>
                                    <h3 id="sample-matrix-heading" class="text-base font-black text-slate-800 dark:text-slate-100">
                                        Ma trận Mẫu &amp; Chỉ tiêu phân tích
                                    </h3>
                                </div>
                                <span class="inline-flex h-7 items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 text-[10px] font-bold tabular-nums text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 self-start sm:self-auto">
                                    {{ filteredSampleRows().length }} / {{ allSampleRows().length }} mẫu
                                </span>
                            </div>

                            <!-- Search Inside Matrix -->
                            @if (allSampleRows().length > 1) {
                                <div class="relative mb-3">
                                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                                    <input
                                        type="text"
                                        [ngModel]="sampleFilterQuery()"
                                        (ngModelChange)="sampleFilterQuery.set($event)"
                                        placeholder="Tìm mã hoặc tên mẫu..."
                                        class="w-full h-9 pl-8 pr-8 rounded-xl border border-slate-200/80 bg-slate-50 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900">
                                    @if (sampleFilterQuery()) {
                                        <button
                                            type="button"
                                            (click)="sampleFilterQuery.set('')"
                                            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                                            title="Xóa tìm kiếm">
                                            <i class="fa-solid fa-xmark text-xs"></i>
                                        </button>
                                    }
                                </div>
                            }

                            <!-- Scrollable Table with Sticky Header (max-h 480px) -->
                            <div class="max-h-[480px] overflow-y-auto custom-scrollbar rounded-xl border border-slate-100 dark:border-slate-800">
                                <table class="w-full text-left text-xs border-collapse">
                                    <thead class="sticky top-0 bg-slate-50 dark:bg-slate-800/95 backdrop-blur z-10 border-b border-slate-200/80 dark:border-slate-700">
                                        <tr>
                                            <th scope="col" class="py-2.5 px-3 font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] w-28 sm:w-36">Mã mẫu</th>
                                            <th scope="col" class="py-2.5 px-3 font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">Mô tả mẫu</th>
                                            <th scope="col" class="py-2.5 px-3 font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">Chỉ tiêu yêu cầu</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                                        @for (row of filteredSampleRows(); track row.sampleId) {
                                            <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                <!-- Sample ID -->
                                                <td class="py-3 px-3 align-top">
                                                    <span class="font-mono font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs inline-block">
                                                        {{ row.sampleId }}
                                                    </span>
                                                </td>
                                                <!-- Description -->
                                                <td class="py-3 px-3 align-top">
                                                    @if (row.description) {
                                                        <span class="font-semibold text-slate-700 dark:text-slate-200 leading-snug block">
                                                            {{ row.description }}
                                                        </span>
                                                    } @else {
                                                        <span class="text-slate-400 italic text-[11px]">—</span>
                                                    }
                                                </td>
                                                <!-- Target Scope -->
                                                <td class="py-3 px-3 align-top">
                                                    <div class="space-y-1.5">
                                                        @if (row.targetScope.compact) {
                                                            <div class="flex items-center gap-1.5 flex-wrap">
                                                                <span class="inline-flex items-center gap-1 bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-100/70 dark:border-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                                                    <i class="fa-solid fa-list-check text-[9px]"></i>
                                                                    {{ row.targetScope.headline }}
                                                                </span>
                                                                @if (row.targetNames.length > 0) {
                                                                    <button
                                                                        type="button"
                                                                        (click)="toggleSampleTargetExpand(row.sampleId)"
                                                                        class="text-[10px] font-bold text-fuchsia-600 hover:text-fuchsia-700 dark:text-fuchsia-400 underline underline-offset-2 cursor-pointer">
                                                                        {{ isSampleExpanded(row.sampleId) ? 'Thu gọn' : 'Xem chi tiết' }}
                                                                    </button>
                                                                }
                                                            </div>
                                                        } @else {
                                                            <div class="flex flex-wrap gap-1">
                                                                @for (tName of row.targetNames; track tName) {
                                                                    <span class="bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-100/70 dark:border-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 px-2 py-0.5 rounded-md text-[10px] font-medium">
                                                                        {{ tName }}
                                                                    </span>
                                                                } @empty {
                                                                    <span class="text-slate-400 italic text-[11px]">Chưa chỉ định chỉ tiêu</span>
                                                                }
                                                            </div>
                                                        }

                                                        <!-- Expanded target list when compact -->
                                                        @if (row.targetScope.compact && isSampleExpanded(row.sampleId)) {
                                                            <div class="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-1">
                                                                @for (tName of row.targetNames; track tName) {
                                                                    <span class="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                                                        {{ tName }}
                                                                    </span>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        } @empty {
                                            <tr>
                                                <td colspan="3" class="py-8 text-center text-slate-400">
                                                    <i class="fa-solid fa-magnifying-glass mb-1 text-sm block"></i>
                                                    Không tìm thấy mẫu phù hợp từ khóa "{{ sampleFilterQuery() }}"
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <!-- Additional input parameters if any -->
                            @if (getInputKeyValues().length > 0) {
                                <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Thông số kèm theo</div>
                                    <div class="flex flex-wrap gap-2">
                                        @for (item of getInputKeyValues(); track item.key) {
                                            <span class="bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                                                <span class="text-slate-400 font-medium">{{ item.key }}:</span> <b class="font-mono text-slate-700 dark:text-slate-200">{{ item.val }}</b>
                                            </span>
                                        }
                                    </div>
                                </div>
                            }
                        </section>
                    } @else {
                        <!-- RECORD CONTENT (When no sample list is associated) -->
                        <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                            <div class="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <i class="fa-solid fa-circle-info text-xs text-fuchsia-600 dark:text-fuchsia-400"></i>
                                <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                                    Nội Dung Hồ Sơ
                                </h3>
                            </div>
                            @if (logData()?.details) {
                                <p class="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    {{ logData()?.details }}
                                </p>
                            }
                            @if (getInputKeyValues().length > 0) {
                                <div class="mt-4">
                                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Thông số kèm theo</div>
                                    <div class="flex flex-wrap gap-2">
                                        @for (item of getInputKeyValues(); track item.key) {
                                            <span class="bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                                                <span class="text-slate-400 font-medium">{{ item.key }}:</span> <b class="font-mono text-slate-700 dark:text-slate-200">{{ item.val }}</b>
                                            </span>
                                        }
                                    </div>
                                </div>
                            }
                        </section>
                    }

                    <!-- REAGENTS & CONSUMABLES CARD (Auto-hidden if empty) -->
                    @if (logData()?.printData?.items?.length) {
                        <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6" aria-labelledby="chemicals-heading">
                            <div class="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <i class="fa-solid fa-flask text-xs text-fuchsia-600 dark:text-fuchsia-400"></i>
                                <h3 id="chemicals-heading" class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                                    Danh Sách Hóa Chất Sử Dụng
                                </h3>
                            </div>
                            <div class="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                                <table class="w-full text-xs text-left">
                                    <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                                        <tr>
                                            <th class="px-3.5 py-2.5">Tên hóa chất</th>
                                            <th class="px-3.5 py-2.5 text-right">Lượng dùng</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                        @for (item of logData()?.printData?.items; track item.name) {
                                            <tr>
                                                <td class="px-3.5 py-2.5 font-medium text-slate-700 dark:text-slate-200">{{ item.displayName || item.name }}</td>
                                                <td class="px-3.5 py-2.5 text-right font-mono font-bold text-slate-600 dark:text-slate-300">
                                                    {{ formatNum(item.stockNeed) }} {{ item.stockUnit }}
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    }
                </div>

                <!-- RIGHT COLUMN: Audit Trail Timeline (~38% desktop) -->
                <div class="lg:col-span-5 xl:col-span-4">
                    <section class="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/45 sm:p-5 lg:sticky lg:top-20" aria-labelledby="traceability-audit-heading">
                        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div class="mb-1 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--soft-ui-accent-strong)]">
                                    <i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Audit Trail
                                </div>
                                <h3 id="traceability-audit-heading" class="text-base font-black text-slate-800 dark:text-slate-100">Dòng thời gian hồ sơ LIMS</h3>
                                <p class="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Chuỗi thao tác được ghi nhận tự động để đảm bảo tính toàn vẹn và minh bạch.
                                </p>
                            </div>
                            <span class="inline-flex h-7 items-center rounded-full border border-slate-200 bg-white px-2.5 text-[10px] font-bold tabular-nums text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {{ timelineItems().length }} sự kiện
                            </span>
                        </div>
                        <app-ui-timeline [items]="timelineItems()" ariaLabel="Lịch sử truy xuất hồ sơ LIMS" />
                    </section>
                </div>
            </div>
        }
    </div>
  `
})
export class TraceabilityComponent implements OnInit, OnDestroy {
  // Input Binding from Router (Angular 16+)
  private routeId?: string;
  private initialized = false;

  @Input()
  set id(value: string | undefined) {
      this.routeId = value;
      if (this.initialized) {
          this.handleRouteId(value);
      }
  }

  get id(): string | undefined {
      return this.routeId;
  }

  auth = inject(AuthService);
  state = inject(StateService);
  fb = inject(FirebaseService);
  toast = inject(ToastService);
  qrService = inject(QrGlobalService);
  private masterTargetService = inject(MasterTargetService);
  private targetService = inject(TargetService);
  private router = inject(Router);
  private data = inject(TraceabilityDataService);
  
  formatDate = formatDate;
  formatNum = formatNum;
  formatSampleList = formatSampleList;
  getAvatarUrl = getAvatarUrl;
  objectKeys = Object.keys;

  logData = signal<Log | null>(null);
  readonly worksheets = inject(BatchWorksheetService);
  readonly worksheetRequest = signal<Request | null>(null);
  canPrintWorksheet(): boolean {
    if (this.standardRecord() || !this.worksheets.canRead()) return false;
    const request = this.worksheetRequest();
    const log = this.logData();
    const eligible = !!request && !request.isVirtualMaster && !request._isDeleted
      && ['approved', 'draft', 'completed'].includes(request.status);
    if (this.recordType() === 'SOP_REQUEST' || (!!request && this.worksheetLookupId === request.id)) return eligible;
    return eligible || !!log?.printJobId || isWorksheetData(log?.printData);
  }
  canEditBatch(): boolean {
    const request = this.worksheetRequest();
    return !!request && this.auth.canApprove() && canEditWorksheet(request, this.auth.currentUser()?.email);
  }
  editBatch(): void {
    const request = this.worksheetRequest();
    if (request && this.canEditBatch()) void this.router.navigate(['/calculator'], { queryParams: { editRequestId: request.id } });
  }
  printWorksheet(): void {
    const log = this.logData();
    if (!log || this.standardRecord() || !this.worksheets.canRead()) return;
    if (this.worksheetRequest() && (this.recordType() === 'SOP_REQUEST' || this.worksheetLookupId === this.worksheetRequest()!.id
      || (!log.printJobId && !isWorksheetData(log.printData)))) {
      void this.worksheets.open([worksheetReference(this.worksheetRequest()!)]);
    } else {
      void this.worksheets.open([{ requestId: log.requestId || log.printData?.requestId,
        traceLogId: this.recordType() === 'ACTIVITY_LOG' ? log.id : undefined,
        printJobId: log.printJobId || (this.recordType() === 'PRINT_JOB' ? log.id : undefined),
        printData: log.printData, timestamp: log.timestamp, user: log.user }]);
    }
  }
  readonly tracePrintDocument = signal<A4Document | null>(null);
  printTraceRecord(): void {
    const log = this.logData();
    if (!this.auth.currentUser() || !log || this.isLoading() || this.isVerifying()) return;
    const summary = this.standardRecord() ? this.standardSummary() : [
      { label: 'Mã truy xuất', value: log.id },
      { label: 'Hồ sơ liên quan', value: this.getDistinctAssociatedRequestId() || 'Chưa có thông tin' },
      { label: 'Phương pháp', value: log.sopBasicInfo?.name || log.printData?.sop?.name || 'Chưa có thông tin' },
      { label: 'Người ghi nhận', value: log.user || 'Chưa có thông tin' },
    ];
    this.tracePrintDocument.set(buildTraceDocument(log.id, summary, this.timelineItems(), this.standardHistoryNotes(), this.standardHistoryHasMore() || this.standardHistoryLoading()));
  }
  timelineItems = signal<TimelineItem[]>([]);
  recordType = signal<'SOP_REQUEST' | 'STANDARD_REQUEST' | 'STANDARD_USAGE' | 'PRINT_JOB' | 'ACTIVITY_LOG' | null>(null);
  standardRecord = signal<StandardTraceRecord | null>(null);
  standardHistoryNotes = signal<string[]>([]);
  standardHistoryLoading = signal(false);
  standardHistoryHasMore = signal(false);
  private standardUsages = signal<UsageLog[]>([]);
  private standardEvents: Log[] = [];
  private standardSources: StandardHistorySource[] = [];
  private standardBaseNotes: string[] = [];
  standardSummary = computed(() => {
      const record = this.standardRecord();
      return record ? standardTraceSummary(record) : [];
  });
  standardTraceTitle = standardTraceTitle;
  masterTargets = signal<any[]>([]);
  availableTargetGroups = signal<TargetGroup[]>([]);
  isLoading = signal(false);
  isVerifying = signal(false);
  verifyStep = signal(0);
  errorMsg = signal('');
  inputError = signal('');
  lookupValue = '';

  qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');
  lookupInput = viewChild<ElementRef<HTMLInputElement>>('lookupInput');

  private lookupRequest = 0;
  private worksheetLookupId = '';
  private viewerScope(): string {
      return `${this.auth.currentUser()?.uid || ''}|${this.auth.isStandardAuditMode()}|${this.auth.isManager()}|${['standard_view', 'standard_edit', 'standard_approve', 'standard_log_view', 'standard_log_delete', 'report_view', 'sop_view', 'sop_approve', 'batch_run'].map(permission => this.auth.hasPermission(permission)).join(',')}`;
  }
  private currentScope = this.viewerScope();
  private scopeWatcher = effect(() => {
      this.handleViewerScopeChange(this.viewerScope());
  });
  private handleViewerScopeChange(next: string): void {
      if (next !== this.currentScope) {
          this.currentScope = next;
          this.lookupRequest++;
          this.stopVerificationTimers();
          this.resetStandardTrace();
          this.logData.set(null);
          this.worksheetRequest.set(null);
          this.timelineItems.set([]);
          this.isLoading.set(false);
          this.isVerifying.set(false);
          if (this.initialized && this.routeId && this.auth.currentUser() && !this.auth.isStandardAuditMode()) {
              const code = this.normalizeLookupValue(this.routeId);
              if (code) void this.loadData(code);
          } else if (this.routeId) {
              this.errorMsg.set('Phiên đăng nhập hoặc quyền truy cập đã thay đổi. Vui lòng tra cứu lại hồ sơ.');
          }
      }
  }
  private lookupIsCurrent(token: number, scope = this.currentScope): boolean {
      return token === this.lookupRequest && scope === this.viewerScope();
  }
  private verificationInterval?: ReturnType<typeof setInterval>;
  private verificationTimeout?: ReturnType<typeof setTimeout>;

  copiedCode = signal(false);
  sampleFilterQuery = signal('');
  expandedSampleIds = signal<Set<string>>(new Set());

  allSampleRows = computed<TraceabilitySampleRow[]>(() => {
      const log = this.logData() as any;
      if (!log) return [];

      const targetMap = this.getSampleTargetMap() || {};
      const fallbackTargets = log.targetIds || log.inputs?.targetIds || log.printData?.targetIds || log.printData?.inputs?.targetIds || [];
      const sampleList: string[] = log.sampleList || log.inputs?.sampleList || log.printData?.sampleList || log.printData?.inputs?.sampleList || [];
      const descMap = log?.sampleDescriptionMap || log?.printData?.inputs?.sampleDescriptionMap || log?.inputs?.sampleDescriptionMap;

      const allSamples = Array.from(new Set([
          ...sampleList,
          ...Object.keys(targetMap),
          ...Object.keys(descMap || {})
      ])).sort(naturalCompare);

      if (!allSamples.length) return [];

      const sopId = log.printData?.sop?.id || (log.sopBasicInfo as any)?.id || log.sopId;
      const sopVersion = log.printData?.sop?.version || (log.sopBasicInfo as any)?.version || log.sopVersion;
      const sopTargetSnapshot = log.targetNames || log.printData?.targetNames || log.printData?.sop?.targets;

      return allSamples.map(sampleId => {
          const descSnapshot = getSampleDescriptionSnapshot(descMap, sampleId);
          const description = descSnapshot?.nameSnapshot || '';
          const assignedTargets = getAssignedTargetsForSample(sampleId, targetMap);
          const targetIds = assignedTargets?.length ? assignedTargets : fallbackTargets;

          const canonicalTargets = new Map<string, string>();
          targetIds.forEach((tId: string) => {
              const canonicalId = getCanonicalId(tId);
              if (canonicalId && !canonicalTargets.has(canonicalId)) {
                  canonicalTargets.set(canonicalId, tId);
              }
          });
          const dedupedTargetIds = Array.from(canonicalTargets.values()).sort((a, b) =>
              naturalCompare(this.resolveCompoundName(a), this.resolveCompoundName(b))
          );

          const classification = classifyTargetScope({
              assignedTargetIds: dedupedTargetIds,
              sopId,
              sopVersion,
              sopTargetSnapshot,
              availableGroups: this.availableTargetGroups()
          });
          const targetNames = dedupedTargetIds.map(tId => this.resolveCompoundName(tId));
          const targetScope = buildTargetScopePresentation(targetNames, classification);

          return {
              sampleId,
              description,
              targetScope,
              targetNames,
              totalTargets: dedupedTargetIds.length
          };
      });
  });

  filteredSampleRows = computed<TraceabilitySampleRow[]>(() => {
      const rows = this.allSampleRows();
      const q = this.sampleFilterQuery().trim().toLowerCase();
      if (!q) return rows;
      return rows.filter(r =>
          r.sampleId.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.targetScope.headline.toLowerCase().includes(q) ||
          r.targetNames.some(t => t.toLowerCase().includes(q))
      );
  });

  totalSampleCount = computed<number>(() => this.allSampleRows().length);

  async ngOnInit() {
      this.state.ensureUserInfoCacheListener();
      this.initialized = true;
      this.handleRouteId(this.routeId);

      try {
          const [analytes, groups] = await Promise.all([
              this.masterTargetService.getAll(),
              this.targetService.getAllGroups()
          ]);
          this.masterTargets.set(analytes);
          this.availableTargetGroups.set(groups);
      } catch (e) {
          console.warn('Failed to load master analytes or target groups in TraceabilityComponent', e);
      }
  }

  ngOnDestroy() {
      this.lookupRequest++;
      this.stopVerificationTimers();
  }

  submitLookup() {
      const code = this.normalizeLookupValue(this.lookupValue);
      this.inputError.set('');

      if (!code) {
          this.inputError.set('Vui lòng nhập mã hồ sơ cần truy xuất.');
          this.focusLookupInput();
          return;
      }

      if (code.length > 200 || code.includes('/')) {
          this.inputError.set('Mã hồ sơ không hợp lệ. Vui lòng kiểm tra lại mã hoặc liên kết.');
          this.focusLookupInput();
          return;
      }

      this.lookupValue = code;

      if (this.routeId === code) {
          void this.loadData(code);
          return;
      }

      void this.router.navigate(['/traceability', code]);
  }

  clearLookupInput() {
      this.lookupValue = '';
      this.sampleFilterQuery.set('');
      this.expandedSampleIds.set(new Set());
      this.inputError.set('');
      this.focusLookupInput();
  }

  focusLookupInput() {
      setTimeout(() => {
          const input = this.lookupInput()?.nativeElement;
          input?.focus();
          input?.select();
      });
  }

  startQrScan() {
      this.qrService.startScan();
  }

  openLookup() {
      void this.router.navigate(['/traceability']);
  }

  returnToApp(): void {
      if (!this.auth.isAuthReady()) return;
      void this.router.navigate([this.auth.currentUser() ? '/dashboard' : '/']);
  }

  private handleRouteId(value: string | undefined) {
      const code = this.normalizeLookupValue(value || '');

      if (!code) {
          this.lookupRequest++;
          this.stopVerificationTimers();
          this.resetStandardTrace();
          this.lookupValue = '';
          this.sampleFilterQuery.set('');
          this.expandedSampleIds.set(new Set());
          this.logData.set(null);
          this.worksheetRequest.set(null);
          this.timelineItems.set([]);
          this.errorMsg.set('');
          this.inputError.set('');
          this.isLoading.set(false);
          this.isVerifying.set(false);
          this.verifyStep.set(0);
          this.focusLookupInput();
          return;
      }

      this.lookupValue = code;
      this.sampleFilterQuery.set('');
      this.expandedSampleIds.set(new Set());
      this.inputError.set('');
      void this.loadData(code);
  }

  private normalizeLookupValue(rawValue: string): string {
      return normalizeTraceabilityLookup(rawValue);
  }

  private stopVerificationTimers() {
      if (this.verificationInterval) {
          clearInterval(this.verificationInterval);
          this.verificationInterval = undefined;
      }
      if (this.verificationTimeout) {
          clearTimeout(this.verificationTimeout);
          this.verificationTimeout = undefined;
      }
  }

  resolveCompoundName(compoundId: string): string {
      const sopId = this.logData()?.printData?.sop?.id || (this.logData()?.sopBasicInfo as any)?.id || null;
      return resolveCompoundDisplayName(compoundId, this.masterTargets(), sopId);
  }

  getAssociatedRequestId(): string | null {
      const log = this.logData();
      if (!log) return null;
      if (log.requestId) return log.requestId;
      if ((log.printData as any)?.requestId) return (log.printData as any).requestId;
      if (log.printData?.inputs?.['batchCode']) return log.printData.inputs['batchCode'];
      return log.id || null;
  }

  getDistinctAssociatedRequestId(): string | null {
      const requestId = this.getAssociatedRequestId();
      const logId = this.logData()?.id;
      return requestId && requestId !== logId ? requestId : null;
  }

  viewBatchResults(requestId: string) {
      this.router.navigate(['/results-view', requestId]);
  }

  getActionLabel(action: string | undefined): string {
      if (!action) return 'Không xác định';
      if (isRegisteredActivityAction(action)) return getActivityActionLabel(action);
      const map: Record<string, string> = {
          'PENDING_REQUEST': 'Yêu cầu chờ duyệt',
          'APPROVED_REQUEST': 'Yêu cầu đã duyệt',
          'REJECTED_REQUEST': 'Yêu cầu bị từ chối',
          'COMPLETED_REQUEST': 'Yêu cầu đã hoàn thành',
          'DRAFT_REQUEST': 'Phiếu yêu cầu lưu nháp',
          'EDIT_REQUEST': 'Chỉnh sửa phiếu yêu cầu',
          'PRINT_JOB_RECORD': 'Lưu trữ phiếu in',
          'DIRECT_APPROVE': 'Duyệt & xếp hàng in',
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
          'RESET_RESULT_DATA': 'Đặt lại số liệu kết quả',
          'RESTORE_RESULT_BACKUP': 'Khôi phục số liệu lưu trữ',
          'RESTORE_RESULT_VERSION': 'Khôi phục phiên bản cũ',
          
          'generate_pdf': 'Tạo tệp PDF',
          'archive_reports': 'Lưu trữ báo cáo'
      };
      return map[action] || action;
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

  getSampleDescriptionRows(): { sampleId: string; description: string }[] {
      const log = this.logData() as any;
      const inputs = log?.printData?.inputs || log?.inputs || {};
      const map = log?.sampleDescriptionMap || inputs.sampleDescriptionMap;
      const samples: string[] = inputs.sampleList || log?.sampleList || Object.keys(map || {});
      return samples.map(sampleId => ({
          sampleId,
          description: getSampleDescriptionSnapshot(map, sampleId)?.nameSnapshot || ''
      })).filter(item => item.description).sort((a, b) => naturalCompare(a.sampleId, b.sampleId));
  }

  getSortedTargets(tIds: string[] | undefined): string[] {
      if (!tIds || !Array.isArray(tIds)) return [];
      return [...tIds].sort((a, b) => naturalCompare(this.resolveCompoundName(a), this.resolveCompoundName(b)));
  }

  toggleSampleTargetExpand(sampleId: string) {
      const current = new Set(this.expandedSampleIds());
      if (current.has(sampleId)) {
          current.delete(sampleId);
      } else {
          current.add(sampleId);
      }
      this.expandedSampleIds.set(current);
  }

  isSampleExpanded(sampleId: string): boolean {
      return this.expandedSampleIds().has(sampleId);
  }

  async copyText(text: string) {
      if (!text) return;
      try {
          await navigator.clipboard.writeText(text);
          this.copiedCode.set(true);
          setTimeout(() => this.copiedCode.set(false), 2000);
          this.toast.show('Đã sao chép mã truy xuất', 'info');
      } catch {
          this.toast.show('Không thể sao chép mã', 'warning');
      }
  }

  getRecordHeadline(): string {
      const log = this.logData();
      if (!log) return 'Hồ sơ LIMS';
      return log.sopBasicInfo?.name
          || log.printData?.sop?.name
          || (log.details ? log.details.replace(/^Yêu cầu phân tích:\s*/i, '') : '')
          || log.action
          || 'Hồ sơ kiểm nghiệm';
  }

  getAnalysisDate(): any {
      const log = this.logData();
      return log?.printData?.analysisDate || (log as any)?.analysisDate || null;
  }

  getStatusLabel(status: string | undefined): string {
      switch (status) {
          case 'approved': return 'Đã duyệt';
          case 'completed': return 'Đã hoàn thành';
          case 'pending': return 'Chờ duyệt';
          case 'draft': return 'Lưu nháp';
          case 'rejected': return 'Bị từ chối';
          default: return status || 'Đã ghi nhận';
      }
  }

  getStatusBadgeClass(status: string | undefined): string {
      switch (status) {
          case 'approved':
          case 'completed':
              return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40';
          case 'pending':
              return 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40';
          case 'rejected':
              return 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40';
          case 'draft':
              return 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200/80 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-900/40';
          default:
              return 'bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      }
  }

  getStatusIcon(status: string | undefined): string {
      switch (status) {
          case 'approved':
          case 'completed':
              return 'fa-check';
          case 'pending':
          case 'draft':
              return 'fa-clock';
          case 'rejected':
              return 'fa-xmark';
          default:
              return 'fa-circle-info';
      }
  }

  getInputKeyValues(): { key: string; val: any }[] {
      const inputs = this.logData()?.printData?.inputs || (this.logData() as any)?.inputs;
      if (!inputs || typeof inputs !== 'object') return [];
      const excluded = new Set(['sampleList', 'targetIds', 'sampleTargetMap', 'sampleDescriptionMap', 'batchCode']);
      return Object.entries(inputs)
          .filter(([k, v]) => !excluded.has(k) && v !== null && v !== undefined && v !== '')
          .map(([key, val]) => ({ key, val: String(val) }));
  }

  async loadData(id: string) {
      this.worksheetLookupId = id;
      const requestToken = ++this.lookupRequest;
      const viewerScope = this.viewerScope();
      this.currentScope = viewerScope;
      this.stopVerificationTimers();
      this.resetStandardTrace();
      this.isLoading.set(true);
      this.isVerifying.set(false);
      this.verifyStep.set(-1);
      this.errorMsg.set('');
      this.logData.set(null);
      this.worksheetRequest.set(null);
      this.timelineItems.set([]);
      
      try {
          // Public traceability is intentionally limited to canonical Activity
          // documents marked publicTraceable by Firestore rules. A denied/missing
          // log is treated as non-public so it cannot block the public-safe path.
          const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/logs/${id}`);
          const snap = await this.getTraceabilityDoc(logRef);
          if (!this.lookupIsCurrent(requestToken)) return;

          if (snap?.exists()) {
              const log = { ...snap.data(), id: snap.id } as Log;
              if (isStandardActivity(log)) {
                  if (!this.auth.currentUser() || this.auth.isStandardAuditMode()) {
                      this.errorMsg.set('Hồ sơ chất chuẩn này không thuộc phạm vi được cấp quyền xem.');
                      return;
                  }
                  const requestId = log.requestId || ((log as any).targetType === 'STANDARD_REQUEST' ? log.targetId : undefined);
                  const record = requestId ? await this.data.findStandardRecord(requestId) : null;
                  if (!this.lookupIsCurrent(requestToken, viewerScope)) return;
                  if (record) {
                      this.displayStandardRecord(record, requestToken, [log]);
                      this.recordType.set('ACTIVITY_LOG');
                      this.logData.set(log);
                  } else {
                      // Keep the authorized activity without probing a SOP request.
                      this.recordType.set('ACTIVITY_LOG');
                      this.logData.set(log);
                      const options = this.state.getUserAvatarOptionsByUid((log as any).actorUid, (log as any).actorName || log.user);
                      const item = this.toTimelineItem(log, true);
                      item.action = undefined;
                      item.actorAvatarUrl = this.getAvatarUrl(options.displayName, options.style, options.photoURL);
                      this.timelineItems.set([item]);
                  }
              } else {
                  this.recordType.set('ACTIVITY_LOG');
                  this.startVerificationProcess(log, requestToken);
              }
              return;
          }

          // Request-id QR routes resolve through a minimal exact-get projection.
          // The projection contains no operational request payload and points only
          // to a log that Firestore independently marks publicTraceable.
          const projectionRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/public_traceability/${id}`);
          const projectionSnap = await this.getTraceabilityDoc(projectionRef);
          if (!this.lookupIsCurrent(requestToken)) return;
          if (projectionSnap?.exists()) {
              const projection = projectionSnap.data() as { logId?: unknown; status?: unknown };
              if (typeof projection.logId === 'string' && projection.logId) {
                  const projectedLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/logs/${projection.logId}`);
                  const projectedLogSnap = await this.getTraceabilityDoc(projectedLogRef);
                  if (!this.lookupIsCurrent(requestToken)) return;
                  if (projectedLogSnap?.exists()) {
                      const projectedLog = { id: projectedLogSnap.id, ...projectedLogSnap.data() } as Log;
                      if (typeof projection.status === 'string') projectedLog.status = projection.status;
                      this.startVerificationProcess(projectedLog, requestToken);
                      return;
                  }
              }
          }

          // Anonymous/public lookup must never probe operational collections.
          if (!this.auth.currentUser()) {
              this.errorMsg.set(`Không tìm thấy dữ liệu công khai cho mã: ${id}`);
              return;
          }

          if (!this.auth.isStandardAuditMode()) {
              const standardRecord = await this.data.findStandardRecord(id);
              if (!this.lookupIsCurrent(requestToken, viewerScope)) return;
              if (standardRecord) {
                  this.displayStandardRecord(standardRecord, requestToken);
                  return;
              }
          }

          // 2. Try Lookup by Print Job ID (Legacy or linked) (Priority 2)
          const jobRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs/${id}`);
          const jobSnap = await this.getTraceabilityDoc(jobRef);
          if (!this.lookupIsCurrent(requestToken)) return;
          
          if (jobSnap?.exists()) {
              this.worksheets.rememberSnapshot({ id: jobSnap.id, data: jobSnap.data() });
              this.recordType.set('PRINT_JOB');
              const jobData = jobSnap.data() as any;
              const mockLog: Log = {
                  id: id,
                  action: 'PRINT_JOB_RECORD',
                  printJobId: jobSnap.id,
                  requestId: jobData.requestId,
                  details: 'Hồ sơ in ấn lưu trữ',
                  timestamp: jobData.createdAt || new Date(),
                  user: jobData.createdBy || 'System',
                  printData: jobData // Embed full data
              };
              this.startVerificationProcess(mockLog, requestToken);
              return;
          }

          // 3. Try Lookup by REQUEST ID (Dashboard links point here) (Priority 3)
          const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/requests/${id}`);
          const reqSnap = await this.getTraceabilityDoc(reqRef);
          if (!this.lookupIsCurrent(requestToken)) return;

          if (reqSnap?.exists()) {
              this.recordType.set('SOP_REQUEST');
              const reqData = reqSnap.data() as any;
              this.worksheetRequest.set({ ...reqData, id: reqSnap.id } as Request);
              
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
                          sampleTargetMap: reqData.sampleTargetMap,
                          sampleDescriptionMap: reqData.sampleDescriptionMap
                      },
                      items: mappedItems,
                      margin: reqData.margin,
                      analysisDate: reqData.analysisDate
                  }
              };
              
              this.startVerificationProcess(mockLog, requestToken);
              return;
          }

          // 4. Not Found
          this.errorMsg.set(`Không tìm thấy dữ liệu cho mã: ${id}`);

      } catch (e: any) {
          if (!this.lookupIsCurrent(requestToken)) return;
          console.error(e);
          console.error('[Traceability] Không thể tải dữ liệu:', e);
          this.errorMsg.set('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.');
      } finally {
          if (this.lookupIsCurrent(requestToken)) {
              this.isLoading.set(false);
          }
      }
  }

  private async getTraceabilityDoc(ref: DocumentReference): Promise<DocumentSnapshot | null> {
      try {
          return await this.data.readDocument(ref);
      } catch (error: any) {
          if (error?.code === 'permission-denied' || error?.code === 'firestore/permission-denied') {
              return null;
          }
          throw error;
      }
  }

  startVerificationProcess(log: Log, requestToken = this.lookupRequest) {
      if (!this.lookupIsCurrent(requestToken)) return;
      if (!this.recordType()) this.recordType.set('ACTIVITY_LOG');
      if (isStandardActivity(log) && (!this.auth.currentUser() || this.auth.isStandardAuditMode())) {
          this.errorMsg.set('Hồ sơ chất chuẩn này không thuộc phạm vi được cấp quyền xem.');
          return;
      }
      this.stopVerificationTimers();
      this.isVerifying.set(true);
      this.isLoading.set(false);
      this.verifyStep.set(0);
      
      let step = 0;
      this.verificationInterval = setInterval(() => {
          if (!this.lookupIsCurrent(requestToken)) {
              this.stopVerificationTimers();
              return;
          }
          step++;
          this.verifyStep.set(step);
          if (step >= 3) {
              if (this.verificationInterval) {
                  clearInterval(this.verificationInterval);
                  this.verificationInterval = undefined;
              }
              this.verificationTimeout = setTimeout(() => {
                  if (!this.lookupIsCurrent(requestToken)) return;
                  this.isVerifying.set(false);
                  this.handleLogData(log, requestToken);
              }, 300);
          }
      }, 250);
  }

  handleLogData(log: Log, requestToken = this.lookupRequest) {
      const viewerScope = this.viewerScope();
      const getStatusAndHydrate = async () => {
          const canHydratePrivateData = !!this.auth.currentUser();
          // If log has requestId and no status, fetch request status
          if (canHydratePrivateData && log.requestId && !isStandardActivity(log)) {
              try {
                  const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/requests/${log.requestId}`);
                  const reqSnap = await this.getTraceabilityDoc(reqRef);
                  if (!this.lookupIsCurrent(requestToken, viewerScope)) return;
                  if (reqSnap?.exists()) {
                      log.status = reqSnap.data()['status'];
                      this.worksheetRequest.set({ ...reqSnap.data(), id: reqSnap.id } as Request);
                  }
              } catch (e) {
                  console.warn('Failed to fetch request status in Traceability', e);
              }
          }

          // Hydrate if printJobId exists but printData is missing (New Arch)
          if (!this.lookupIsCurrent(requestToken, viewerScope)) return;
          if (canHydratePrivateData && log.printJobId && !log.printData && !isStandardActivity(log)) {
              try {
                  const jobRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs/${log.printJobId}`);
                  const jobSnap = await this.getTraceabilityDoc(jobRef);
                  if (!this.lookupIsCurrent(requestToken, viewerScope)) return;
                  if (jobSnap?.exists()) {
                      this.worksheets.rememberSnapshot({ id: jobSnap.id, data: jobSnap.data() });
                      log.printData = jobSnap.data() as any;
                  }
              } catch (e) {
                  console.warn('Failed to fetch print job in Traceability', e);
              }
          }

          if (!this.lookupIsCurrent(requestToken, viewerScope)) return;
          
          this.logData.set(log);
          this.timelineItems.set([this.toTimelineItem(log, true)]);
          void this.loadAuditTimeline(log, requestToken);
          setTimeout(() => {
              if (this.lookupIsCurrent(requestToken, viewerScope)) void this.generateQr(log.id, requestToken);
          }, 100);
      };

      getStatusAndHydrate();
  }

  private async loadAuditTimeline(currentLog: Log, requestToken: number): Promise<void> {
      const viewerScope = this.viewerScope();
      const requestId = this.resolveAssociatedRequestId(currentLog);
      if (!requestId || !this.auth.currentUser()) return;

      try {
          const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`);
          const relatedSnapshot = await getDocs(query(logsRef, where('requestId', '==', requestId)));
          if (!this.lookupIsCurrent(requestToken, viewerScope)) return;

          const relatedLogs = relatedSnapshot.docs.map(snapshot => ({
              id: snapshot.id,
              ...snapshot.data()
          } as Log));

          const isRequestProjection = !currentLog.requestId
              && currentLog.id === requestId
              && currentLog.sopBasicInfo?.category === 'Request Record';
          const merged = new Map<string, Log>();
          for (const event of relatedLogs) merged.set(event.id, event);
          if (!isRequestProjection || relatedLogs.length === 0) merged.set(currentLog.id, currentLog);

          const sorted = Array.from(merged.values()).sort((a, b) =>
              this.timelineTimestamp(a.timestamp) - this.timelineTimestamp(b.timestamp)
          );
          if (sorted.length === 0) return;

          this.timelineItems.set(sorted.map((event, index) =>
              this.toTimelineItem(event, index === sorted.length - 1)
          ));
      } catch (error) {
          // Some public traceability routes intentionally have get-only access.
          // Keep the already-rendered current event as a safe fallback.
          console.warn('Could not load related traceability audit events', error);
      }
  }

  private toTimelineItem(log: Log, isCurrent = false): TimelineItem {
      const action = log.action || '';
      const status = this.timelineStatus(log);
      const requestId = this.resolveAssociatedRequestId(log);
      const metadata: { label: string; value: string }[] = [];
      const sopName = log.sopBasicInfo?.name || log.printData?.sop?.name;
      const targetName = (log as any).targetName;

      if (requestId && requestId !== log.id) metadata.push({ label: 'Hồ sơ', value: requestId });
      if (sopName) metadata.push({ label: 'SOP', value: String(sopName) });
      if (targetName) metadata.push({ label: 'Đối tượng', value: String(targetName) });
      if (log.reason) metadata.push({ label: 'Lý do', value: log.reason });

      const actionUrl = (log as any).actionUrl;
      const item: TimelineItem = {
          id: log.id,
          title: this.getActionLabel(action),
          description: log.details || undefined,
          timestamp: log.timestamp,
          actorName: (log as any).actorName || log.user || null,
          actorRole: this.timelineActorRole(log),
          icon: this.timelineIcon(action),
          status,
          metadata: metadata.slice(0, 4),
          isCurrent
      };

      if (typeof actionUrl === 'string' && actionUrl.startsWith('/') && !actionUrl.startsWith('/traceability')) {
          item.action = { label: 'Mở chi tiết', icon: 'fa-arrow-up-right-from-square', routerLink: actionUrl };
      }
      return item;
  }

  private resolveAssociatedRequestId(log: Log): string | null {
      const targetType = String((log as any).targetType || '').toUpperCase();
      return log.requestId
          || log.printData?.requestId
          || (log.printData?.inputs?.['batchCode'] as string | undefined)
          || (targetType === 'REQUEST' ? log.targetId : undefined)
          || log.id
          || null;
  }

  private timelineStatus(log: Log): TimelineStatus {
      const value = `${log.status || ''} ${log.action || ''}`.toLowerCase();
      if (/reject|revoke|cancel|delete|fail|error|hủy|từ chối/.test(value)) return 'danger';
      if (/pending|waiting|warning|chờ/.test(value)) return 'warning';
      if (/approve|complete|publish|return|restore|success|duyệt|hoàn thành/.test(value)) return 'success';
      if (/create|request|receive|print|import|scan|tiếp nhận|yêu cầu/.test(value)) return 'info';
      return 'primary';
  }

  private timelineIcon(action: string): string {
      const value = action.toLowerCase();
      if (/reject|revoke|cancel|delete/.test(value)) return 'fa-circle-xmark';
      if (/approve|complete|publish|return|restore/.test(value)) return 'fa-circle-check';
      if (/result|analysis/.test(value)) return 'fa-flask-vial';
      if (/print|pdf/.test(value)) return 'fa-print';
      if (/edit|update|save.*draft|draft/.test(value)) return 'fa-pen-to-square';
      if (/standard/.test(value)) return 'fa-vial';
      if (/inventory|stock/.test(value)) return 'fa-boxes-stacked';
      if (/request|create|receive/.test(value)) return 'fa-clipboard-check';
      return 'fa-clock-rotate-left';
  }

  private timelineActorRole(log: Log): string | null {
      const explicitRole = (log.metadata as any)?.actorRole;
      if (typeof explicitRole === 'string' && explicitRole.trim()) return explicitRole.trim();
      if (!log.module) return null;
      return log.module.replaceAll('_', ' ').toLowerCase().replace(/(^|\s)\p{L}/gu, char => char.toUpperCase());
  }

  private timelineTimestamp(value: unknown): number {
      if (value instanceof Date) return value.getTime();
      if (value && typeof value === 'object' && typeof (value as any).toDate === 'function') {
          const date = (value as any).toDate();
          return date instanceof Date ? date.getTime() : 0;
      }
      const parsed = new Date(value as any).getTime();
      return Number.isNaN(parsed) ? 0 : parsed;
  }

  async generateQr(text: string, requestToken = this.lookupRequest) {
      if (!this.lookupIsCurrent(requestToken) || !this.qrCanvas()) return;
      let QRious: any;
      try {
          QRious = await ensureQrious();
      } catch (e) {
          console.warn('QR library load error:', e);
          return;
      }
      if (!QRious || !this.lookupIsCurrent(requestToken) || this.logData()?.id !== text || !this.qrCanvas()) return;
      
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

  private resetStandardTrace(): void {
      this.tracePrintDocument.set(null);
      this.recordType.set(null);
      this.standardRecord.set(null);
      this.standardUsages.set([]);
      this.standardEvents = [];
      this.standardSources = [];
      this.standardBaseNotes = [];
      this.standardHistoryNotes.set([]);
      this.standardHistoryLoading.set(false);
      this.standardHistoryHasMore.set(false);
  }

  private displayStandardRecord(record: StandardTraceRecord, requestToken: number, events: Log[] = []): void {
      if (!this.lookupIsCurrent(requestToken) || this.auth.isStandardAuditMode() || !this.auth.currentUser()) return;
      this.recordType.set(record.recordType);
      this.standardRecord.set(record);
      this.standardUsages.set(mergeStandardUsages(record.request?.usageLogs || [], record.usage ? [record.usage] : []));
      this.standardEvents = events;
      this.logData.set({ id: record.id, action: record.recordType, module: 'STANDARD',
          details: record.request?.standardName || record.usage?.standardName || 'Chất chuẩn đối chiếu',
          timestamp: record.usage?.timestamp || record.request?.requestDate || null,
          user: record.usage?.user || record.request?.requestedByName || '',
          requestId: record.usage?.requestId, status: record.request?.status,
      });
      const requestId = record.request?.id || record.usage?.requestId;
      this.standardSources = requestId ? this.data.historySources(requestId) : [];
      this.standardBaseNotes = ['Dòng thời gian hiển thị theo dữ liệu phiếu mượn và các nhật ký được cấp quyền.'];
      if (!record.standard) {
          this.standardBaseNotes.push('Chưa đọc được hồ sơ kho hiện tại. Hạn dùng và đơn vị kho chưa được bổ sung vào phiếu.');
      }
      if (record.usage?.requestId && !record.request) {
          this.standardBaseNotes.push('Chưa đọc được phiếu mượn liên quan. Nhật ký sử dụng được cấp quyền vẫn được hiển thị.');
      }
      this.refreshStandardTimeline();
      void this.loadMoreStandardHistory();
  }

  private refreshStandardTimeline(): void {
      const record = this.standardRecord();
      if (!record) return;
      const items = buildStandardTraceTimeline(record, this.standardUsages(), this.standardEvents,
          (uid, name) => this.state.getUserAvatarOptionsByUid(uid, name));
      this.timelineItems.set(items);
      this.standardHistoryHasMore.set(this.standardSources.some(source => !source.done));
  }

  async loadMoreStandardHistory(): Promise<void> {
      if (this.standardHistoryLoading() || !this.standardRecord() || this.auth.isStandardAuditMode()) return;
      const requestToken = this.lookupRequest;
      const viewerScope = this.viewerScope();
      this.standardHistoryLoading.set(true);
      try {
          const page = await this.data.loadHistory(this.standardSources);
          if (!this.lookupIsCurrent(requestToken, viewerScope)) return;
          this.standardSources = page.sources;
          this.standardUsages.set(mergeStandardUsages(this.standardUsages(), page.usages));
          this.standardEvents = [...new Map([...this.standardEvents, ...page.events].map(event => [event.id, event])).values()];
          this.standardBaseNotes = [...new Set([...this.standardBaseNotes, ...page.notes.filter(note => note.includes('cấp quyền'))])];
          const notes = [...this.standardBaseNotes, ...page.notes.filter(note => !note.includes('cấp quyền'))];
          if ((this.standardRecord()?.request?.totalAmountUsed || 0) > 0 && !this.standardUsages().length) {
              notes.push('Phiếu ghi nhận đã sử dụng chất chuẩn, nhưng chưa tải được nhật ký từng lần. Tổng lượng dùng lấy từ phiếu mượn.');
          }
          this.standardHistoryNotes.set([...new Set(notes)]);
          this.refreshStandardTimeline();
      } catch {
          if (this.lookupIsCurrent(requestToken, viewerScope)) {
              this.standardHistoryNotes.set([...this.standardBaseNotes, 'Chưa tải được lịch sử. Vui lòng tải lại.']);
              this.standardHistoryHasMore.set(true);
          }
      } finally {
          if (this.lookupIsCurrent(requestToken, viewerScope)) this.standardHistoryLoading.set(false);
      }
  }

  standardStatusLabel(status: string | undefined): string {
      const labels: Record<string, string> = {
          PENDING_APPROVAL: 'Chờ duyệt', APPROVED: 'Đã duyệt', IN_USE: 'Đang sử dụng',
          IN_PROGRESS: 'Đang sử dụng', PENDING_DEPLETION: 'Chờ xác nhận hết chuẩn',
          PENDING_RETURN: 'Chờ nhận lại', COMPLETED: 'Đã hoàn tất', REJECTED: 'Đã từ chối', CANCELLED: 'Đã hủy',
      };
      return status ? labels[status] || status : 'Chưa ghi nhận trạng thái';
  }
}
