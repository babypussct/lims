import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sop, TargetGroup, MatrixType } from '../../../core/models/sop.model';
import { SampleDescriptionMaster, SampleDescriptionSnapshot } from '../../../core/models/sample-description.model';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { AppEmptyStateComponent } from '../../../shared/components/ui/empty-state/empty-state.component';
import { AppDatePickerComponent } from '../../../shared/components/ui/date-picker/date-picker.component';
import { getCanonicalId } from '../../results/shared/compound-id-resolver';
import {
  SingleSampleDraft,
  SingleSamplePreview,
  TargetMasterInfo
} from '../smart-batch.models';
import { getLocalTodayDate, isValidAnalysisDate } from '../smart-batch.date.utils';
import { computeSingleSampleDraftFingerprint } from '../single-sample-dispatch.utils';

@Component({
  selector: 'app-single-sample-dispatch-workspace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppButtonComponent,
    AppModalShellComponent,
    AppEmptyStateComponent,
    AppDatePickerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-full min-h-0 flex flex-col overflow-hidden animate-fade-in relative text-slate-800 dark:text-slate-200">
      <!-- 2-COLUMN SPLIT-VIEW WORKSPACE -->
      <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3.5 p-3 overflow-hidden">

        <!-- LEFT COLUMN: SAMPLE INFO & TARGET SELECTION -->
        <div class="lg:col-span-5 flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar pr-1">

          <!-- CARD 1: SAMPLE INFO -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-4 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-750 pb-2">
              <span class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <i class="fa-solid fa-vial text-fuchsia-600 dark:text-fuchsia-400"></i>
                Thông Tin Mẫu
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200/60 dark:border-fuchsia-800/40">
                Một mẫu duy nhất
              </span>
            </div>

            <!-- Mã số mẫu -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1">
                Mã số mẫu <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  type="text"
                  [ngModel]="sampleCode()"
                  (ngModelChange)="updateSampleCode($event)"
                  placeholder="VD: M26-00389 hoặc nhập tự do"
                  class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3 py-2 text-sm font-mono font-black text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-200 dark:focus:ring-fuchsia-900/50 focus:border-fuchsia-500 transition" />
              </div>
            </div>

            <!-- Nền mẫu & Ngày kiểm nghiệm -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1">
                  Nền mẫu <span class="text-slate-400 font-normal lowercase">(tùy chọn)</span>
                </label>
                <select
                  [ngModel]="matrixType()"
                  (ngModelChange)="updateMatrixType($event)"
                  class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-200 focus:border-fuchsia-500 transition">
                  <option [ngValue]="undefined">Tất cả nền mẫu (không lọc)</option>
                  @for (m of availableMatrices; track m.id) {
                    <option [value]="m.id">{{m.name}}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center justify-between">
                  <span>Ngày kiểm nghiệm <span class="text-red-500">*</span></span>
                  <button type="button" (click)="setTodayDate()" class="text-[9px] text-fuchsia-600 hover:underline">Hôm nay</button>
                </label>
                <app-date-picker
                  size="sm"
                  [required]="true"
                  presets="simple"
                  [value]="analysisDate()"
                  (valueChange)="updateAnalysisDate($event)"
                  ariaLabel="Ngày kiểm nghiệm"
                  [error]="!isValidDate() ? 'Bắt buộc' : null"
                />
              </div>
            </div>

            <!-- Mô tả mẫu -->
            <div>
              <label class="block text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-1">
                Mô tả mẫu / Tên hàng hóa
              </label>
              <input
                type="text"
                list="single-sample-desc-master-list"
                [ngModel]="sampleDescription()"
                (ngModelChange)="updateSampleDescription($event)"
                placeholder="VD: Tôm sú nguyên con đông lạnh"
                class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-200 focus:border-fuchsia-500 transition" />
              <datalist id="single-sample-desc-master-list">
                @for (d of availableSampleDescriptions; track d.id) {
                  <option [value]="d.name">{{d.description || d.aliases?.join(', ') || ''}}</option>
                }
              </datalist>
            </div>
          </div>

          <!-- CARD 2: TARGET SELECTION -->
          <div class="flex-1 min-h-[300px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-4 shadow-sm flex flex-col space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-750 pb-2">
              <span class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <i class="fa-solid fa-bullseye text-teal-600 dark:text-teal-400"></i>
                Chỉ Tiêu Phân Tích
                <span class="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold border border-teal-200/60 dark:border-teal-800/40">
                  {{selectedTargets().size}} đã chọn
                </span>
              </span>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  (click)="showGroupModal.set(true)"
                  class="px-2 py-1 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800 bg-fuchsia-50/50 dark:bg-fuchsia-950/30 text-fuchsia-700 dark:text-fuchsia-300 text-[10px] font-bold hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/40 transition">
                  <i class="fa-solid fa-layer-group mr-1"></i>Theo bộ
                </button>
                @if (selectedTargets().size > 0) {
                  <button
                    type="button"
                    (click)="clearAllTargets()"
                    class="px-2 py-1 rounded-lg text-slate-400 hover:text-red-500 text-[10px] font-bold transition">
                    Xóa hết
                  </button>
                }
              </div>
            </div>

            <!-- CHIPS OF SELECTED TARGETS -->
            @if (selectedTargets().size > 0) {
              <div class="max-h-[100px] overflow-y-auto custom-scrollbar flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                @for (tid of selectedTargetArray(); track tid) {
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold shadow-xs">
                    {{targetDisplayName(tid)}}
                    <button type="button" (click)="toggleTarget(tid)" class="text-slate-400 hover:text-red-500 ml-0.5">
                      <i class="fa-solid fa-xmark text-[9px]"></i>
                    </button>
                  </span>
                }
              </div>
            }

            <!-- SEARCH TARGETS -->
            <div class="relative">
              <i class="fa-solid fa-search absolute left-3 top-2.5 text-xs text-slate-400"></i>
              <input
                type="text"
                [ngModel]="targetSearchTerm()"
                (ngModelChange)="targetSearchTerm.set($event)"
                placeholder="Tìm kiếm chỉ tiêu theo tên..."
                class="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 transition" />
            </div>

            <!-- TARGET PICKER LIST -->
            <div class="flex-1 min-h-[160px] max-h-[260px] overflow-y-auto custom-scrollbar border border-slate-100 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/60">
              @for (t of filteredAvailableTargets(); track t.id) {
                <label class="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
                  <input
                    type="checkbox"
                    [checked]="selectedTargets().has(canonicalId(t.name || t.id))"
                    (change)="toggleTarget(t.name || t.id)"
                    class="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5" />
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-200 flex-1">{{t.name}}</span>
                  @if (t.matrixTags && t.matrixTags.length > 0) {
                    <span class="text-[9px] text-slate-400 font-medium">{{t.matrixTags.join(', ')}}</span>
                  }
                </label>
              } @empty {
                <div class="p-6 text-center text-xs text-slate-400">Không tìm thấy chỉ tiêu nào phù hợp.</div>
              }
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: LIVE BATCH BREAKDOWN -->
        <div class="lg:col-span-7 flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar pl-1">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-4 shadow-sm flex flex-col h-full min-h-0">

            <!-- HEADER -->
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-750 pb-2.5 shrink-0">
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <i class="fa-solid fa-network-wired text-fuchsia-600 dark:text-fuchsia-400"></i>
                  Bản Đồ Phân Rã Mẻ Dự Kiến
                  @if (isCalculating) {
                    <span class="text-[10px] text-fuchsia-500 font-normal flex items-center gap-1">
                      <i class="fa-solid fa-spinner fa-spin"></i> Đang tính...
                    </span>
                  }
                </h4>
                <p class="text-[10px] text-slate-400 mt-0.5">Tự động phân bổ các chỉ tiêu đăng ký vào các mẻ chạy phù hợp</p>
              </div>

              @if (preview) {
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black px-2.5 py-1 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200/60 dark:border-fuchsia-800/40">
                    Dự kiến {{preview.proposedBatches.length}} mẻ
                  </span>
                </div>
              }
            </div>

            <!-- CONTENT AREA -->
            <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-3 space-y-3">
              @if (!preview || (selectedTargets().size === 0 && !sampleCode().trim())) {
                <app-empty-state
                  icon="fa-vial"
                  title="Chưa có dữ liệu phân tích"
                  message="Vui lòng nhập mã mẫu và chọn ít nhất 1 chỉ tiêu ở cột bên trái để hệ thống tự động phân chia mẻ chạy.">
                </app-empty-state>
              } @else {

                <!-- LIST OF PROPOSED BATCHES -->
                @for (batch of preview.proposedBatches; track batch.id; let idx = $index) {
                  <div class="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 p-3.5 transition hover:border-fuchsia-300 dark:hover:border-fuchsia-600">
                    <div class="flex items-start justify-between gap-2">
                      <div class="space-y-1">
                        <div class="flex items-center gap-2">
                          <span class="w-5 h-5 rounded-full bg-fuchsia-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                            {{idx + 1}}
                          </span>
                          <span class="text-xs font-black text-slate-800 dark:text-slate-100">
                            {{batch.name}}
                          </span>
                          @if (batch.tags?.includes('Forced-SOP')) {
                            <span class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                              Chỉ định
                            </span>
                          }
                        </div>
                        <div class="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 pl-7">
                          <span><i class="fa-solid fa-code-branch mr-1"></i>{{batch.sop.ref || batch.sop.id}}</span>
                          @if (batch.sop.device) {
                            <span>·</span>
                            <span><i class="fa-solid fa-microchip mr-1"></i>{{batch.sop.device}}</span>
                          }
                          <span>·</span>
                          <span><i class="fa-solid fa-calendar mr-1"></i>{{batch.inputValues['analysisDate'] || analysisDate()}}</span>
                        </div>
                      </div>

                      <!-- RESOURCE STATUS BADGE -->
                      <div>
                        @if (batch.resourceStatus === 'stock_insufficient') {
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 text-[10px] font-bold" title="Thiếu: {{batch.resourceIssues?.join(', ')}}">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            Thiếu {{batch.resourceIssues?.length || 1}} hóa chất
                          </span>
                        } @else if (batch.resourceStatus === 'calculation_invalid') {
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 text-[10px] font-bold">
                            <i class="fa-solid fa-circle-exclamation"></i> Lỗi công thức
                          </span>
                        } @else {
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 text-[10px] font-bold">
                            <i class="fa-solid fa-circle-check"></i> Đủ tài nguyên
                          </span>
                        }
                      </div>
                    </div>

                    <!-- TARGETS IN THIS BATCH -->
                    <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 pl-7">
                      <div class="text-[10px] uppercase tracking-wide font-black text-slate-400 mb-1">
                        Chỉ tiêu phụ trách ({{batch.tasks.length}}):
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        @for (task of batch.tasks; track task.targetId) {
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold shadow-2xs">
                            <span class="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span>
                            {{task.targetName}}
                            @if (forcedSopAssignments()[task.targetId]) {
                              <button type="button" (click)="clearForcedSop(task.targetId)" class="text-slate-400 hover:text-red-500 ml-1" title="Bỏ chỉ định">
                                <i class="fa-solid fa-xmark text-[8px]"></i>
                              </button>
                            }
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                }

                <!-- MAPPING ISSUES (UNMAPPED TARGETS) -->
                @if (preview.mappingIssues.length > 0) {
                  <div class="space-y-2 pt-2">
                    <div class="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                      <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                      Chỉ Tiêu Cần Xử Lý ({{preview.mappingIssues.length}})
                    </div>

                    @for (issue of preview.mappingIssues; track issue.targetId) {
                      <div class="rounded-xl border p-3 text-xs"
                           [class.border-blue-200]="issue.status === 'manual_assignment_required'"
                           [class.bg-blue-50/50]="issue.status === 'manual_assignment_required'"
                           [class.dark:border-blue-900/60]="issue.status === 'manual_assignment_required'"
                           [class.dark:bg-blue-950/20]="issue.status === 'manual_assignment_required'"
                           [class.border-amber-200]="issue.status === 'matrix_incompatible'"
                           [class.bg-amber-50/50]="issue.status === 'matrix_incompatible'"
                           [class.dark:border-amber-900/60]="issue.status === 'matrix_incompatible'"
                           [class.dark:bg-amber-950/20]="issue.status === 'matrix_incompatible'"
                           [class.border-slate-200]="issue.status === 'no_sop'"
                           [class.bg-slate-50/70]="issue.status === 'no_sop'"
                           [class.dark:border-slate-800]="issue.status === 'no_sop'"
                           [class.dark:bg-slate-900/40]="issue.status === 'no_sop'">

                        <div class="flex items-start justify-between gap-2">
                          <div>
                            <span class="font-black text-slate-800 dark:text-slate-100">{{issue.targetName}}</span>
                            @if (issue.status === 'manual_assignment_required') {
                              <p class="text-[10px] text-blue-700 dark:text-blue-300 mt-0.5">
                                Chỉ tiêu thuộc quy trình đặc thù (manual-only). Vui lòng xác nhận chọn SOP:
                              </p>
                              <div class="flex flex-wrap gap-2 mt-2">
                                @for (cand of issue.candidateSops; track cand.id) {
                                  <button
                                    type="button"
                                    (click)="selectForcedSop(issue.targetId, cand.id)"
                                    class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] shadow-xs transition">
                                    <i class="fa-solid fa-check mr-1"></i>Chỉ định: {{cand.name}}
                                  </button>
                                }
                              </div>
                            } @else if (issue.status === 'matrix_incompatible') {
                              <p class="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
                                Không tương thích nền mẫu đã chọn. Các SOP có chỉ tiêu này chỉ hỗ trợ nền:
                                <b class="font-bold">{{issue.supportedMatrices?.join(', ') || 'Nền khác'}}</b>.
                              </p>
                              @if (issue.candidateSops && issue.candidateSops.length > 0) {
                                <p class="text-[10px] text-amber-700 dark:text-amber-400 mt-1.5 font-bold">
                                  Có quy trình tương thích với nền mẫu này:
                                </p>
                                <div class="flex flex-wrap gap-2 mt-1">
                                  @for (cand of issue.candidateSops; track cand.id) {
                                    <button
                                      type="button"
                                      (click)="selectForcedSop(issue.targetId, cand.id)"
                                      class="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] shadow-xs transition">
                                      <i class="fa-solid fa-arrows-rotate mr-1"></i>Đổi sang: {{cand.name}}
                                    </button>
                                  }
                                </div>
                              }
                            } @else if (issue.candidateSops && issue.candidateSops.length > 0) {
                              <p class="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
                                SOP đã chỉ định không hỗ trợ chỉ tiêu này. Vui lòng chọn SOP tương thích:
                              </p>
                              <div class="flex flex-wrap gap-2 mt-2">
                                @for (cand of issue.candidateSops; track cand.id) {
                                  <button
                                    type="button"
                                    (click)="selectForcedSop(issue.targetId, cand.id)"
                                    class="px-2.5 py-1 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-[10px] shadow-xs transition">
                                    <i class="fa-solid fa-check mr-1"></i>Chọn: {{cand.name}}
                                  </button>
                                }
                              </div>
                            } @else {
                              <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Chưa có quy trình (SOP) nào trong hệ thống hỗ trợ chỉ tiêu này.
                              </p>
                            }

                            @if (forcedSopAssignments()[issue.targetId]) {
                              <button
                                type="button"
                                (click)="clearForcedSop(issue.targetId)"
                                class="mt-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                                <i class="fa-solid fa-rotate-left"></i>
                                Hủy chỉ định thủ công cho chỉ tiêu này
                              </button>
                            }
                          </div>

                          <button
                            type="button"
                            (click)="toggleTarget(issue.targetId)"
                            class="text-[10px] text-slate-400 hover:text-red-500 shrink-0 font-bold">
                            Bỏ chọn
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                }
              }
            </div>

          </div>
        </div>

      </div>

      <!-- STICKY ACTION DOCK -->
      <div class="shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3 shadow-lg z-20">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

          <div class="flex items-center gap-2 text-xs">
            <span class="font-bold text-slate-500 dark:text-slate-400">Tiến độ:</span>
            @if (canCommit()) {
              <span class="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <i class="fa-solid fa-circle-check"></i>
                Hợp lệ · Dự kiến {{preview?.proposedBatches?.length || 0}} mẻ
              </span>
            } @else {
              <span class="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <i class="fa-solid fa-triangle-exclamation text-[11px]"></i>
                {{commitBlockReason()}}
              </span>
            }
          </div>

          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <app-button
              variant="secondary"
              size="sm"
              (click)="cancel.emit()">
              <i class="fa-solid fa-arrow-left mr-1"></i>
              Đổi cách lập mẻ
            </app-button>

            <app-button
              variant="primary"
              size="sm"
              [disabled]="!canCommit() || isCommitting"
              [loading]="isCommitting"
              (click)="commit.emit()">
              <i class="fa-solid fa-wand-magic-sparkles mr-1"></i>
              Xác nhận & tạo {{preview?.proposedBatches?.length || 0}} mẻ
            </app-button>
          </div>

        </div>
      </div>

      <!-- TARGET GROUP IMPORT MODAL -->
      @if (showGroupModal()) {
        <app-modal-shell
          title="Chọn bộ chỉ tiêu đăng ký"
          size="sm"
          [showFooter]="false"
          (closed)="showGroupModal.set(false)">
          <div modalBody class="-mx-4 -my-3 sm:-mx-6 sm:-my-5 max-h-[350px] overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800">
            @for (g of availableTargetGroups; track g.id) {
              <button
                type="button"
                (click)="importGroup(g)"
                class="w-full text-left p-3.5 hover:bg-fuchsia-50/60 dark:hover:bg-fuchsia-950/30 transition flex items-center justify-between">
                <div>
                  <div class="text-xs font-black text-slate-800 dark:text-slate-100">{{g.name}}</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">{{g.targets.length}} chỉ tiêu</div>
                </div>
                <i class="fa-solid fa-plus text-xs text-fuchsia-600"></i>
              </button>
            } @empty {
              <div class="p-6 text-center text-xs text-slate-400">Chưa có bộ chỉ tiêu nào.</div>
            }
          </div>
        </app-modal-shell>
      }
    </div>
  `
})
export class SingleSampleDispatchWorkspaceComponent {
  @Input() availableMatrices: MatrixType[] = [];
  @Input() availableTargets: TargetMasterInfo[] = [];
  @Input() availableSops: Sop[] = [];
  @Input() availableTargetGroups: TargetGroup[] = [];
  @Input() availableSampleDescriptions: SampleDescriptionMaster[] = [];
  @Input() set draft(val: SingleSampleDraft | null) {
    if (!val) return;
    const currentFingerprint = computeSingleSampleDraftFingerprint(this.buildCurrentDraft());
    const incomingFingerprint = computeSingleSampleDraftFingerprint(val);
    if (currentFingerprint === incomingFingerprint) return;

    this.sampleCode.set(val.sampleCode || '');
    this.matrixType.set(val.matrixType);
    this.sampleDescription.set(val.sampleDescription?.nameSnapshot || '');
    this.selectedTargets.set(new Set(val.selectedTargets || []));
    this.forcedSopAssignments.set(val.forcedSopAssignments ? { ...val.forcedSopAssignments } : {});
    if (val.analysisDate) {
      this.analysisDate.set(val.analysisDate);
    }
  }
  @Input() set preview(val: SingleSamplePreview | null) {
    this._preview.set(val);
  }
  get preview(): SingleSamplePreview | null {
    return this._preview();
  }
  readonly _preview = signal<SingleSamplePreview | null>(null);

  @Input() set isCalculating(val: boolean) {
    this._isCalculating.set(val);
  }
  get isCalculating(): boolean {
    return this._isCalculating();
  }
  readonly _isCalculating = signal<boolean>(false);

  @Input() set isCommitting(val: boolean) {
    this._isCommitting.set(val);
  }
  get isCommitting(): boolean {
    return this._isCommitting();
  }
  readonly _isCommitting = signal<boolean>(false);

  @Output() draftChange = new EventEmitter<SingleSampleDraft>();
  @Output() forcedSopSelect = new EventEmitter<{ targetId: string; sopId: string }>();
  @Output() forcedSopClear = new EventEmitter<string>();
  @Output() commit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  sampleCode = signal<string>('');
  matrixType = signal<string | undefined>(undefined);
  sampleDescription = signal<string>('');
  selectedTargets = signal<Set<string>>(new Set());
  forcedSopAssignments = signal<Record<string, string>>({});
  analysisDate = signal<string>(getLocalTodayDate());

  targetSearchTerm = signal<string>('');
  showGroupModal = signal<boolean>(false);

  canonicalId = getCanonicalId;

  selectedTargetArray = computed(() => Array.from(this.selectedTargets()));

  filteredAvailableTargets = computed(() => {
    const term = this.targetSearchTerm().trim().toLowerCase();
    if (!term) return this.availableTargets.slice(0, 100);
    return this.availableTargets.filter(t =>
      t.name.toLowerCase().includes(term)
      || t.id.toLowerCase().includes(term)
    );
  });

  isValidDate = computed(() => isValidAnalysisDate(this.analysisDate()));

  canCommit = computed(() => {
    const preview = this._preview();
    const currentDraft = this.buildCurrentDraft();
    const isFingerprintMatch = preview?.draftFingerprint === computeSingleSampleDraftFingerprint(currentDraft);

    return (
      Boolean(this.sampleCode().trim()) &&
      this.selectedTargets().size > 0 &&
      this.isValidDate() &&
      Boolean(preview && preview.proposedBatches.length > 0) &&
      Boolean(preview?.isFullyCovered) &&
      !preview?.hasResourceIssues &&
      (preview?.mappingIssues.length ?? 0) === 0 &&
      !this._isCalculating() &&
      !this._isCommitting() &&
      isFingerprintMatch
    );
  });

  commitBlockReason = computed(() => {
    if (!this.sampleCode().trim()) return 'Vui lòng nhập mã số mẫu';
    if (this.selectedTargets().size === 0) return 'Vui lòng chọn ít nhất 1 chỉ tiêu';
    if (!this.isValidDate()) return 'Ngày kiểm nghiệm không hợp lệ (YYYY-MM-DD)';
    if (this._isCalculating()) return 'Đang tính toán phân bổ mẻ...';
    if (this._isCommitting()) return 'Đang lưu kế hoạch mẻ...';

    const preview = this._preview();
    if (!preview || preview.proposedBatches.length === 0) {
      return 'Chưa thể tạo mẻ phân tích từ các chỉ tiêu đã chọn';
    }

    const currentDraft = this.buildCurrentDraft();
    if (preview.draftFingerprint !== computeSingleSampleDraftFingerprint(currentDraft)) {
      return 'Đang tính toán lại theo thông tin mẫu mới...';
    }

    if (preview.mappingIssues.length > 0) {
      return `Còn ${preview.mappingIssues.length} chỉ tiêu chưa được phân phối SOP`;
    }
    if (preview.hasResourceIssues) {
      return 'Phát sinh thiếu hóa chất/vật tư hoặc lỗi công thức tính';
    }
    if (!preview.isFullyCovered) {
      return 'Kế hoạch chưa bao phủ đủ toàn bộ chỉ tiêu đã chọn';
    }
    return '';
  });

  targetDisplayName(targetId: string): string {
    const found = this.availableTargets.find(t => getCanonicalId(t.name || t.id) === targetId);
    return found?.name || targetId;
  }

  updateSampleCode(val: string) {
    this.sampleCode.set(val);
    this.emitDraft();
  }

  updateMatrixType(val: string | undefined) {
    this.matrixType.set(val || undefined);
    this.emitDraft();
  }

  updateSampleDescription(val: string) {
    this.sampleDescription.set(val);
    this.emitDraft();
  }

  updateAnalysisDate(val: string) {
    this.analysisDate.set(val);
    this.emitDraft();
  }

  setTodayDate() {
    this.updateAnalysisDate(getLocalTodayDate());
  }

  toggleTarget(targetNameOrId: string) {
    const cid = getCanonicalId(targetNameOrId);
    if (!cid) return;
    this.selectedTargets.update(set => {
      const next = new Set(set);
      if (next.has(cid)) {
        next.delete(cid);
        // Clear forced SOP assignment if this target was removed
        if (this.forcedSopAssignments()[cid]) {
          const nextForced = { ...this.forcedSopAssignments() };
          delete nextForced[cid];
          this.forcedSopAssignments.set(nextForced);
        }
      } else {
        next.add(cid);
      }
      return next;
    });
    this.emitDraft();
  }

  clearAllTargets() {
    this.selectedTargets.set(new Set());
    this.forcedSopAssignments.set({});
    this.emitDraft();
  }

  importGroup(g: TargetGroup) {
    const groupTargets = g.targets
      .map(t => getCanonicalId(t.name || t.id))
      .filter(Boolean);
    this.selectedTargets.update(set => {
      const next = new Set(set);
      groupTargets.forEach(t => next.add(t));
      return next;
    });
    this.showGroupModal.set(false);
    this.emitDraft();
  }

  selectForcedSop(targetId: string, sopId: string) {
    this.forcedSopAssignments.update(prev => ({
      ...prev,
      [targetId]: sopId
    }));
    this.forcedSopSelect.emit({ targetId, sopId });
    this.emitDraft();
  }

  clearForcedSop(targetId: string) {
    this.forcedSopAssignments.update(prev => {
      const next = { ...prev };
      delete next[targetId];
      return next;
    });
    this.forcedSopClear.emit(targetId);
    this.emitDraft();
  }

  buildCurrentDraft(): SingleSampleDraft {
    const descSnapshot = this.resolveDescriptionSnapshot(this.sampleDescription());
    return {
      sampleCode: this.sampleCode().trim(),
      matrixType: this.matrixType(),
      sampleDescription: descSnapshot,
      selectedTargets: new Set(this.selectedTargets()),
      forcedSopAssignments: { ...this.forcedSopAssignments() },
      analysisDate: this.analysisDate()
    };
  }

  private resolveDescriptionSnapshot(value: string): SampleDescriptionSnapshot | undefined {
    const name = String(value || '').trim();
    if (!name) return undefined;
    const normalized = normalizeDescription(name);
    const master = this.availableSampleDescriptions?.find(item =>
      normalizeDescription(item.name) === normalized
      || (item.aliases || []).some(alias => normalizeDescription(alias) === normalized)
    );
    return master
      ? { masterId: master.id, nameSnapshot: master.name }
      : { nameSnapshot: name };
  }

  private emitDraft() {
    this.draftChange.emit(this.buildCurrentDraft());
  }
}

function normalizeDescription(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
