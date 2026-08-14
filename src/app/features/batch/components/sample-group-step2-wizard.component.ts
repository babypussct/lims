import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatrixType, Sop, TargetGroup } from '../../../core/models/sop.model';
import {
  SampleDescriptionMap,
  SampleDescriptionMaster,
  SampleDescriptionSnapshot
} from '../../../core/models/sample-description.model';
import { SampleGroupWizardGroup } from '../../../core/models/sample-group.model';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AppEmptyStateComponent } from '../../../shared/components/ui/empty-state/empty-state.component';
import { getSampleDescriptionSnapshot } from '../../../shared/utils/sample-description.utils';
import { getCanonicalId } from '../../results/shared/compound-id-resolver';
import { getForcedSopAssignmentIssue, isSopMatrixCompatible } from '../smart-batch.utils';
import {
  ANY_MATRIX_LABEL,
  ANY_MATRIX_SELECTION,
  canonicalTargetIds,
  cloneSampleGroupWizardGroups,
  normalizeWizardSamples,
  parseWizardSampleEntries,
  sampleGroupCompletionIssues
} from '../sample-group.utils';

export interface SampleGroupWizardTarget {
  id: string;
  name: string;
  uniqueKey?: string;
}

type WizardStep = 1 | 2;

interface GroupWizardState {
  step: WizardStep;
  completed: boolean;
  matrixConfirmed: boolean;
}

interface WizardSopSuggestion {
  sop: Sop;
  coverageCount: number;
  totalRequired: number;
  coverageRatio: number;
  coveredTargets: string[];
  missingTargets: string[];
  extraTargets: string[];
  isMissingStock: boolean;
  isPartial: boolean;
  isBest: boolean;
}

@Component({
  selector: 'app-sample-group-step2-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, AppButtonComponent, AppEmptyStateComponent],
  template: `
    <section class="smartbatch-group-wizard w-full h-full min-h-0 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/30 shadow-sm overflow-hidden flex flex-col">
      <header class="shrink-0 min-h-[40px] px-3 sm:px-5 py-1.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-[9px] uppercase tracking-[0.14em] font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
            <i class="fa-solid fa-list-check mr-1"></i>SmartBatch · Nhóm mẻ
          </span>
          <span class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-[9px] font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">
            {{completedGroupCount()}}/{{drafts().length}} hoàn tất
          </span>
        </div>
        <app-button variant="secondary" size="sm" class="whitespace-nowrap" (click)="close.emit()">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Đổi cách lập mẻ
        </app-button>
      </header>

      <div class="flex-1 min-h-0 p-3 sm:p-4 grid grid-cols-1 grid-rows-[minmax(170px,0.3fr)_minmax(0,1fr)] lg:grid-cols-[minmax(250px,0.32fr)_minmax(0,1fr)] lg:grid-rows-1 gap-4 overflow-hidden">
        <aside class="min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-3">
          <div class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-950 pb-2 flex items-center justify-between gap-2">
            <div>
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100">Danh sách nhóm mẻ</h3>
              <p class="mt-0.5 text-[10px] text-slate-400">Mỗi thẻ là một nhóm độc lập.</p>
            </div>
          </div>

          @for (group of drafts(); track group.id; let i = $index) {
            <article class="rounded-2xl border bg-white dark:bg-slate-800 transition shadow-sm"
                     [class.border-indigo-400]="activeGroupId() === group.id"
                     [class.ring-2]="activeGroupId() === group.id"
                     [class.ring-indigo-100]="activeGroupId() === group.id"
                     [class.border-emerald-300]="isGroupCompleted(group.id) && activeGroupId() !== group.id"
                     [class.border-slate-200]="!isGroupCompleted(group.id) && activeGroupId() !== group.id"
                     [class.dark:border-slate-700]="!isGroupCompleted(group.id) && activeGroupId() !== group.id">
              <button type="button" (click)="openGroup(group.id)" class="w-full text-left p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                <div class="flex items-start gap-3">
                  <span class="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                        [class.bg-emerald-100]="isGroupCompleted(group.id)"
                        [class.text-emerald-700]="isGroupCompleted(group.id)"
                        [class.bg-indigo-100]="!isGroupCompleted(group.id)"
                        [class.text-indigo-700]="!isGroupCompleted(group.id)">
                    @if (isGroupCompleted(group.id)) { <i class="fa-solid fa-check"></i> } @else { {{i + 1}} }
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-2">
                      <span class="truncate text-xs font-black text-slate-800 dark:text-slate-100">{{group.name}}</span>
                      <i class="fa-solid fa-chevron-right text-[10px] text-slate-400 transition-transform" [class.rotate-90]="activeGroupId() === group.id"></i>
                    </span>
                    <span class="mt-1 flex flex-wrap gap-1.5 text-[9px] text-slate-400">
                      <span>{{sampleCodes(group).length}} mã</span><span>·</span><span>{{group.selectedTargets.size}} chỉ tiêu</span>
                      <span class="ml-auto font-black" [class.text-emerald-600]="isGroupCompleted(group.id)" [class.text-amber-600]="!isGroupCompleted(group.id)">
                        {{isGroupCompleted(group.id) ? 'Đã hoàn tất' : 'Chưa hoàn tất'}}
                      </span>
                    </span>
                  </span>
                </div>
              </button>
              @if (!singleMode && drafts().length > 1) {
                <div class="px-3.5 pb-3 flex justify-end">
                  <button type="button" (click)="removeGroup(group.id); $event.stopPropagation()" class="text-[10px] font-black text-slate-400 hover:text-red-600 transition"><i class="fa-solid fa-trash mr-1"></i>Xóa</button>
                </div>
              }
            </article>
          }

          <app-button variant="secondary" size="sm" [fullWidth]="true" (click)="addGroup()" [disabled]="singleMode">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
            Thêm nhóm mới
          </app-button>
        </aside>

        <main class="min-w-0 min-h-0">
          @if (activeGroup(); as group) {
            <div class="h-full min-h-0 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm flex flex-col">
              <div class="shrink-0 px-4 sm:px-5 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <h3 class="text-sm font-black text-slate-900 dark:text-slate-100 truncate">{{group.name}}</h3>
                <div class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black shadow-sm whitespace-nowrap">Bước {{activeStep()}}/2</div>
              </div>

              <div class="shrink-0 px-3 sm:px-5 py-1.5 border-b border-slate-200 dark:border-slate-700">
                <div class="grid grid-cols-2 gap-2">
                  @for (label of stepLabels; track label; let i = $index) {
                    <button type="button" (click)="goToStep((i + 1) === 1 ? 1 : 2)" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-black transition text-left"
                            [class.bg-indigo-50]="activeStep() >= i + 1" [class.dark:bg-indigo-950]="activeStep() >= i + 1"
                            [class.text-indigo-700]="activeStep() >= i + 1" [class.dark:text-indigo-300]="activeStep() >= i + 1"
                            [class.text-slate-400]="activeStep() < i + 1">
                      <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                            [class.bg-indigo-600]="activeStep() >= i + 1" [class.text-white]="activeStep() >= i + 1"
                            [class.bg-slate-100]="activeStep() < i + 1" [class.dark:bg-slate-700]="activeStep() < i + 1">{{i + 1}}</span>
                      <span>{{label}}</span>
                    </button>
                  }
                </div>
              </div>

              <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/20">
                @if (activeStep() === 1) {
                  <section class="max-w-5xl mx-auto space-y-4 animate-fade-in">
                    <div class="rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/70 dark:bg-indigo-950/20 px-3 py-2.5">
                      <h4 class="text-xs font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-2"><i class="fa-solid fa-vials"></i> 1. Thông tin mẫu</h4>
                      <p class="mt-0.5 text-[10px] text-indigo-800/80 dark:text-indigo-300/80">Nhập mã mẫu · xác nhận nền mẫu · kiểm tra mô tả từ <b>mã[TAB]mô tả</b>.</p>
                    </div>

                    <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)] gap-4 items-start">
                      <label class="block">
                        <span class="block text-[10px] uppercase tracking-wide font-black text-slate-500 dark:text-slate-400 mb-1.5">Danh sách mã số mẫu <span class="text-red-500">*</span></span>
                        <textarea rows="5" [ngModel]="group.rawSamples" (ngModelChange)="updateSamples($event)" aria-label="Danh sách mã số mẫu *"
                                  class="w-full min-h-[132px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-mono font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 focus:border-indigo-500"
                                  placeholder="VD:&#10;0311&#9;Cá tra&#10;0411&#9;Cá tra"></textarea>
                        <div class="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                          <span><i class="fa-solid fa-circle-info mr-1"></i>{{sampleCodes(group).length}} mã mẫu hợp lệ</span>
                          @if (singleMode) { <span class="font-bold text-indigo-600 dark:text-indigo-400">Chế độ một mẫu</span> }
                        </div>
                      </label>

                      <label class="block">
                        <span class="block text-[10px] uppercase tracking-wide font-black text-slate-500 dark:text-slate-400 mb-1.5">Nền mẫu <span class="text-red-500">*</span></span>
                        <select [ngModel]="matrixSelectionValue(group)" (ngModelChange)="updateMatrix($event)" aria-label="Nền mẫu *"
                                class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500">
                          <option [value]="anyMatrixValue">{{anyMatrixLabel}} — mặc định</option>
                          @for (matrix of availableMatrices; track matrix.id) { <option [value]="matrix.id">{{matrix.name}}</option> }
                        </select>
                        <div class="mt-2 rounded-xl border px-3 py-2 text-[10px]"
                             [class.border-cyan-200]="isMatrixConfirmed(group.id)" [class.bg-cyan-50]="isMatrixConfirmed(group.id)"
                             [class.text-cyan-800]="isMatrixConfirmed(group.id)" [class.border-amber-200]="!isMatrixConfirmed(group.id)"
                             [class.bg-amber-50]="!isMatrixConfirmed(group.id)" [class.text-amber-700]="!isMatrixConfirmed(group.id)">
                          @if (isMatrixConfirmed(group.id)) {
                            <i class="fa-solid fa-filter mr-1"></i>Đã chọn: <b>{{matrixName(group.matrixType)}}</b>
                          } @else {
                            <i class="fa-solid fa-triangle-exclamation mr-1"></i>Cần chọn nền mẫu trước khi tiếp tục.
                          }
                        </div>
                      </label>
                    </div>

                    <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                      <div class="px-3.5 py-2.5 bg-fuchsia-50/70 dark:bg-fuchsia-950/20 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div>
                          <div class="text-xs font-black text-fuchsia-800 dark:text-fuchsia-300"><i class="fa-solid fa-tags mr-1"></i>Mô tả từng mẫu</div>
                          <div class="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Mô tả dán bằng TAB hiển thị ngay để kiểm tra.</div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                          <span class="text-[10px] font-black text-fuchsia-700 dark:text-fuchsia-300">{{describedSampleCount(group)}}/{{sampleCodes(group).length}}</span>
                          <button type="button" (click)="toggleSampleDescriptions()" class="px-2 py-1 rounded-lg border border-fuchsia-200 dark:border-fuchsia-900 text-[9px] font-black text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-950/40" [attr.aria-expanded]="showSampleDescriptions()" aria-label="Thu gọn hoặc mở rộng mô tả từng mẫu">
                            <i class="fa-solid mr-1" [class.fa-chevron-up]="showSampleDescriptions()" [class.fa-chevron-down]="!showSampleDescriptions()"></i>{{showSampleDescriptions() ? 'Thu gọn' : 'Mở rộng'}}
                          </button>
                        </div>
                      </div>
                      @if (showSampleDescriptions()) {
                        <div class="grid grid-cols-[minmax(82px,0.45fr)_minmax(150px,1.35fr)_auto] gap-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[9px] uppercase tracking-wide font-black text-slate-500 dark:text-slate-400">
                          <span>Mã số mẫu</span><span>Mô tả mẫu <span class="text-red-500">*</span></span><span>Thao tác</span>
                        </div>
                        <div class="max-h-[250px] overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800">
                          @for (sample of sampleCodes(group); track sample) {
                            <div class="grid grid-cols-[minmax(82px,0.45fr)_minmax(150px,1.35fr)_auto] gap-2 items-center px-3.5 py-2">
                              <span class="font-mono text-sm font-black text-slate-800 dark:text-slate-100 break-all">{{sample}}</span>
                              <div class="flex items-center gap-2 min-w-0">
                                <input [attr.list]="descriptionListId" [ngModel]="descriptionFor(group, sample)" (ngModelChange)="updateDescription(sample, $event)"
                                       class="flex-1 min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
                                       placeholder="VD: Cá tra nguyên con" [attr.aria-label]="'Mô tả mẫu ' + sample">
                                @if (descriptionFor(group, sample)) {
                                  <span class="shrink-0 text-[9px] font-black text-emerald-600" title="Đã có mô tả"><i class="fa-solid fa-circle-check"></i></span>
                                }
                              </div>
                              <button type="button" (click)="copyDescriptionToAll(sample)" [disabled]="!descriptionFor(group, sample)" class="shrink-0 px-2 py-1.5 rounded-lg border border-fuchsia-200 dark:border-fuchsia-900 text-[9px] font-black text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-950/40 disabled:opacity-35 disabled:cursor-not-allowed" [attr.aria-label]="'Sao chép mô tả của ' + sample + ' cho tất cả'" title="Sao chép mô tả này cho tất cả mẫu">
                                <i class="fa-regular fa-copy mr-1"></i><span class="hidden sm:inline">Copy tất cả</span>
                              </button>
                            </div>
                          } @empty {
                            <div class="p-6 text-center text-xs text-slate-400">Nhập mã mẫu để xem và xác nhận mô tả tại đây.</div>
                          }
                        </div>
                      }
                    </div>
                    <datalist [id]="descriptionListId">
                      @for (description of availableSampleDescriptions; track description.id) { <option [value]="description.name">{{description.description || description.aliases?.join(', ') || ''}}</option> }
                    </datalist>
                  </section>
                }

                @if (activeStep() === 2) {
                  <section class="max-w-6xl mx-auto space-y-4 animate-fade-in">
                    <div class="rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/20 p-4">
                      <h4 class="font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2"><i class="fa-solid fa-route"></i> 2. Chỉ tiêu kiểm nghiệm và phân phối SOP</h4>
                      <p class="mt-1 text-xs text-emerald-800/80 dark:text-emerald-300/80">Tất cả mẫu trong nhóm dùng chung bộ chỉ tiêu. SOP chỉ định phải đúng nền và phủ đủ toàn bộ bộ chỉ tiêu này.</p>
                    </div>

                    <div class="grid grid-cols-1 2xl:grid-cols-[minmax(360px,0.9fr)_minmax(420px,1.1fr)] gap-4 items-start">
                      <div class="space-y-3">
                        <div class="flex flex-wrap items-center gap-2">
                          <div class="relative flex-1 min-w-[180px]">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
                            <input [ngModel]="targetSearch()" (ngModelChange)="targetSearch.set($event)" class="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:border-emerald-500" placeholder="Tìm chỉ tiêu...">
                          </div>
                          <button type="button" (click)="toggleTargetGroupPicker()" class="px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 text-[10px] font-black">
                            <i class="fa-solid fa-layer-group mr-1"></i> Chọn Nhóm Chỉ Tiêu
                          </button>
                          <button type="button" (click)="selectAllTargets()" class="px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black">Chọn hết</button>
                          <button type="button" (click)="clearTargets()" class="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700 text-[10px] font-black">Bỏ chọn</button>
                        </div>

                        @if (showTargetGroupPicker()) {
                          <div class="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/20 p-3 space-y-2">
                            <div class="flex items-center justify-between gap-2">
                              <div class="text-xs font-black text-indigo-800 dark:text-indigo-300">Chọn Nhóm Chỉ Tiêu</div>
                              <button type="button" (click)="showTargetGroupPicker.set(false)" class="text-slate-400 hover:text-red-500"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                            <input [ngModel]="targetGroupSearch()" (ngModelChange)="targetGroupSearch.set($event)" class="w-full px-3 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-900 text-xs font-bold outline-none" placeholder="Tìm nhóm chỉ tiêu...">
                            <div class="max-h-[210px] overflow-y-auto custom-scrollbar space-y-1">
                              @for (targetGroup of filteredTargetGroups(); track targetGroup.id) {
                                <button type="button" (click)="importTargetGroup(targetGroup)" class="w-full text-left rounded-xl border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-900 px-3 py-2 hover:border-indigo-400 transition">
                                  <div class="text-xs font-black text-slate-800 dark:text-slate-100">{{targetGroup.name}}</div>
                                  <div class="mt-0.5 text-[9px] text-slate-400">{{targetGroup.targets.length}} chỉ tiêu{{targetGroup.description ? ' · ' + targetGroup.description : ''}}</div>
                                </button>
                              } @empty {
                                <div class="p-4 text-center text-xs text-slate-400">Không có Nhóm Chỉ Tiêu phù hợp.</div>
                              }
                            </div>
                          </div>
                        }

                        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 max-h-[310px] overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800">
                          @for (target of filteredTargets(); track target.uniqueKey || target.id) {
                            <label class="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 cursor-pointer" [class.bg-emerald-50]="isTargetSelected(target)">
                              <input type="checkbox" [checked]="isTargetSelected(target)" (change)="toggleTarget(target)" class="w-4 h-4 accent-emerald-600 rounded" [attr.aria-label]="target.name + ' ' + (target.uniqueKey || target.id)">
                              <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{target.name}}</span>
                              <span class="ml-auto text-[9px] font-mono text-slate-400">{{target.uniqueKey || target.id}}</span>
                            </label>
                          } @empty {
                            <div class="p-8 text-center text-xs text-slate-400">Không tìm thấy chỉ tiêu phù hợp.</div>
                          }
                        </div>
                        <div class="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <span>Đã chọn {{group.selectedTargets.size}} chỉ tiêu cho toàn bộ nhóm</span>
                          @if (selectedTargetGroupName(group)) { <span class="text-indigo-600 dark:text-indigo-400"><i class="fa-solid fa-layer-group mr-1"></i>{{selectedTargetGroupName(group)}}</span> }
                        </div>
                      </div>

                      <div class="space-y-3">
                        <div class="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/70 dark:bg-indigo-950/20 p-3">
                          <div class="flex items-center justify-between gap-3">
                            <div class="text-[10px] uppercase tracking-wide font-black text-indigo-700 dark:text-indigo-300"><i class="fa-solid fa-code-branch mr-1"></i>Gợi ý Quy trình (SOP)</div>
                            <span class="text-[9px] font-bold text-slate-400">Tối đa 5 SOP phù hợp nhất</span>
                          </div>

                          @if (group.selectedTargets.size === 0) {
                            <p class="mt-3 text-[11px] text-slate-500 dark:text-slate-400 italic">Chọn ít nhất một chỉ tiêu để xem SOP phù hợp.</p>
                          } @else if (sopSuggestions(group).length === 0) {
                            <p class="mt-3 text-[11px] text-orange-600 dark:text-orange-400 font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Không tìm thấy SOP tương thích nền mẫu và các chỉ tiêu đã chọn.</p>
                          } @else {
                            @if (sopSuggestions(group)[0].isPartial) {
                              <p class="mt-3 text-[10px] text-orange-600 dark:text-orange-400"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Chưa có SOP đơn lẻ phủ đủ. Các SOP dưới đây là gợi ý gần nhất; SmartBatch vẫn có thể gom/tách nhiều batch khi để tự phân phối.</p>
                            }
                            <div class="mt-3 grid grid-cols-1 xl:grid-cols-2 gap-2">
                              @for (suggestion of sopSuggestions(group); track suggestion.sop.id) {
                                <article class="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-150"
                                         [class.cursor-pointer]="!suggestion.isPartial"
                                         [class.hover:border-indigo-400]="!suggestion.isPartial && group.forcedSopId !== suggestion.sop.id"
                                         [class.hover:bg-indigo-50]="!suggestion.isPartial && group.forcedSopId !== suggestion.sop.id"
                                         [class.hover:shadow-md]="!suggestion.isPartial && group.forcedSopId !== suggestion.sop.id"
                                         [class.border-indigo-600]="group.forcedSopId === suggestion.sop.id"
                                         [class.bg-indigo-50]="group.forcedSopId === suggestion.sop.id"
                                         [class.dark:bg-indigo-950]="group.forcedSopId === suggestion.sop.id"
                                         [class.shadow-lg]="group.forcedSopId === suggestion.sop.id"
                                         [class.ring-2]="group.forcedSopId === suggestion.sop.id"
                                         [class.ring-indigo-500]="group.forcedSopId === suggestion.sop.id"
                                         [class.ring-offset-2]="group.forcedSopId === suggestion.sop.id"
                                         [attr.tabindex]="suggestion.isPartial ? null : 0"
                                         [attr.aria-pressed]="suggestion.isPartial ? null : group.forcedSopId === suggestion.sop.id"
                                         [attr.aria-label]="suggestion.isPartial ? null : 'Nhấn để chỉ định SOP ' + suggestion.sop.name"
                                         (click)="selectSuggestedSop(suggestion.sop.id, suggestion.isPartial)"
                                         (keydown.enter)="selectSuggestedSop(suggestion.sop.id, suggestion.isPartial)"
                                         (keydown.space)="$event.preventDefault(); selectSuggestedSop(suggestion.sop.id, suggestion.isPartial)">
                                  <div class="p-3">
                                    <div class="flex items-start gap-2">
                                      <div class="min-w-0 flex-1">
                                        <div class="flex flex-wrap items-center gap-1.5">
                                          @if (suggestion.isBest && !suggestion.isPartial) { <span class="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[8px] font-black uppercase"><i class="fa-solid fa-star mr-0.5"></i>Tốt nhất</span> }
                                          @if (group.forcedSopId === suggestion.sop.id) { <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[8px] font-black uppercase"><i class="fa-solid fa-check mr-0.5"></i>Đang chọn</span> }
                                          <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{suggestion.sop.name}}</span>
                                        </div>
                                        <div class="mt-1.5 flex flex-wrap gap-2 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                                          <span [class.text-red-500]="suggestion.isPartial"><i class="fa-solid fa-bullseye mr-0.5"></i>{{suggestion.coverageCount}}/{{suggestion.totalRequired}}</span>
                                          <span>{{sopMatrixLabel(suggestion.sop)}}</span>
                                          @if (suggestion.isMissingStock) { <span class="text-red-500"><i class="fa-solid fa-triangle-exclamation mr-0.5"></i>Thiếu kho</span> } @else { <span class="text-teal-600"><i class="fa-solid fa-check mr-0.5"></i>Kho</span> }
                                        </div>
                                      </div>
                                    </div>
                                    <button type="button" (click)="toggleSopPreview(suggestion.sop.id); $event.stopPropagation()" class="mt-2 text-[9px] font-black text-indigo-600 dark:text-indigo-400 hover:underline"><i class="fa-regular fa-eye mr-1"></i>Xem chi tiết</button>
                                    @if (previewSopId() === suggestion.sop.id) {
                                      <div class="mt-2 rounded-lg bg-slate-50 dark:bg-slate-800 p-2 text-[9px] text-slate-600 dark:text-slate-300 space-y-1">
                                        <div><b>Đã phủ:</b> {{suggestion.coveredTargets.join(', ') || '—'}}</div>
                                        @if (suggestion.missingTargets.length > 0) { <div class="text-red-600"><b>Còn thiếu:</b> {{suggestion.missingTargets.join(', ')}}</div> }
                                        @if (suggestion.extraTargets.length > 0) { <div><b>SOP có thêm:</b> {{suggestion.extraTargets.join(', ')}}</div> }
                                      </div>
                                    }
                                  </div>
                                </article>
                              }
                            </div>
                          }
                        </div>

                        <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 space-y-2.5">
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-[10px] uppercase tracking-wide font-black text-slate-600 dark:text-slate-300"><i class="fa-solid fa-route mr-1"></i>SOP hiện tại</div>
                            <span class="text-[9px] font-bold text-slate-400">Nhấn thẻ SOP để chỉ định</span>
                          </div>
                          <label class="block">
                            <span class="sr-only">SOP áp dụng cho nhóm</span>
                            <select [ngModel]="group.forcedSopId || ''" (ngModelChange)="updateForcedSop($event === '' ? undefined : $event)" aria-label="SOP hiện tại"
                                    class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500">
                              <option value="">Tự phân phối bởi SmartBatch</option>
                              @for (sop of assignableSops(group); track sop.id) { <option [value]="sop.id">{{sop.isManualOnly ? 'Thủ công: ' : 'Chỉ định: '}}{{sop.name}}</option> }
                            </select>
                          </label>
                          <p class="text-[9px] text-slate-500 dark:text-slate-400">
                            {{group.forcedSopId ? 'SOP này áp dụng cho toàn bộ chỉ tiêu của nhóm.' : 'SmartBatch tự tối ưu và có thể gom/tách batch vật lý.'}}
                          </p>

                          @if (sopSelectionError()) {
                            <div class="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-3 py-2 text-[10px] font-bold text-red-700 dark:text-red-300"><i class="fa-solid fa-circle-exclamation mr-1"></i>{{sopSelectionError()}}</div>
                          }
                          @if (forcedSopIssue(group)) {
                            <div class="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-3 py-2 text-[10px] font-bold text-red-700 dark:text-red-300"><i class="fa-solid fa-triangle-exclamation mr-1"></i>{{forcedSopIssue(group)}}</div>
                          }
                        </div>
                      </div>
                    </div>
                  </section>
                }

                @if (stepError()) {
                  <div class="max-w-5xl mx-auto mt-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-xs font-bold text-red-700 dark:text-red-300"><i class="fa-solid fa-circle-exclamation mr-1"></i>{{stepError()}}</div>
                }
              </div>

              <footer class="sticky bottom-0 z-20 shrink-0 px-4 sm:px-6 py-2.5 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur flex flex-wrap items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(15,23,42,0.08)]">
                <app-button variant="secondary" (click)="previousStep()" [disabled]="activeStep() === 1">
                  <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                  Quay lại
                </app-button>
                <div class="text-[10px] text-center hidden sm:block"
                     [class.text-emerald-600]="activeGroupIsCompleted()"
                     [class.text-slate-400]="!activeGroupIsCompleted()">
                  @if (activeStep() === 2 && activeGroupIsCompleted()) {
                    <span><i class="fa-solid fa-circle-check mr-1"></i>Đã đủ thông tin; optimizer đã sẵn sàng.</span>
                  } @else {
                    <span>Nhập đủ thông tin để SmartBatch tự hoàn tất nhóm.</span>
                  }
                </div>
                @if (activeStep() === 1) {
                  <app-button variant="primary" (click)="nextStep()">
                    Tiếp tục: Chỉ tiêu &amp; SOP
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </app-button>
                }
              </footer>
            </div>
          } @else {
            <div class="h-full rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 flex items-center justify-center">
              <app-empty-state
                icon="fa-check-double"
                title="Các nhóm mẻ đã được lưu trong bước 2"
                message="Mở lại một nhóm ở danh sách bên trái để kiểm tra hoặc chỉnh sửa. Dùng nút Thêm nhóm mới ở cuối danh sách khi cần tạo nhóm tiếp theo.">
              </app-empty-state>
            </div>
          }
        </main>
      </div>

    </section>
  `
})
export class SampleGroupStep2WizardComponent implements OnInit {
  @Input({ required: true }) initialGroups: SampleGroupWizardGroup[] = [];
  @Input() availableMatrices: MatrixType[] = [];
  @Input() availableTargets: SampleGroupWizardTarget[] = [];
  @Input() availableSops: Sop[] = [];
  @Input() availableTargetGroups: TargetGroup[] = [];
  @Input() availableSampleDescriptions: SampleDescriptionMaster[] = [];
  @Input() inventoryMap: Record<string, { stock?: number }> = {};
  @Input() singleMode = false;

  @Output() close = new EventEmitter<void>();
  @Output() complete = new EventEmitter<SampleGroupWizardGroup[]>();

  readonly anyMatrixValue = ANY_MATRIX_SELECTION;
  readonly anyMatrixLabel = ANY_MATRIX_LABEL;
  readonly descriptionListId = `sample-group-description-options-${Math.random().toString(36).slice(2)}`;
  readonly stepLabels = ['Thông tin mẫu', 'Chỉ tiêu & SOP'];

  drafts = signal<SampleGroupWizardGroup[]>([]);
  activeGroupId = signal<string | null>(null);
  targetSearch = signal('');
  targetGroupSearch = signal('');
  showTargetGroupPicker = signal(false);
  showSampleDescriptions = signal(true);
  previewSopId = signal<string | null>(null);
  sopSelectionError = signal('');
  groupStates = signal<Record<string, GroupWizardState>>({});
  private groupSequence = 1;
  private sampleCodesCache = new Map<string, { rawSamples: string; codes: string[] }>();

  activeGroup = computed(() => this.drafts().find(group => group.id === this.activeGroupId()) || null);

  ngOnInit(): void {
    const groups = cloneSampleGroupWizardGroups(this.initialGroups);
    const initial = groups.length > 0 ? groups : [this.newGroup('Nhóm mẻ 1')];
    const states: Record<string, GroupWizardState> = {};
    initial.forEach(group => states[group.id] = {
      step: 1,
      completed: false,
      // Any matrix is the safe default and means "do not filter SOP by matrix".
      matrixConfirmed: true
    });
    this.drafts.set(initial);
    this.groupStates.set(states);
    this.activeGroupId.set(initial[0].id);
  }

  activeStep(): WizardStep {
    const id = this.activeGroupId();
    return id ? (this.groupStates()[id]?.step || 1) : 1;
  }

  completedGroupCount(): number {
    return this.drafts().filter(group => this.isGroupCompleted(group.id)).length;
  }

  allGroupsCompleted(): boolean {
    return this.drafts().length > 0 && this.drafts().every(group => this.isGroupCompleted(group.id));
  }

  isGroupCompleted(groupId: string): boolean {
    const group = this.drafts().find(item => item.id === groupId);
    return Boolean(group && this.isGroupReady(group));
  }

  activeGroupIsCompleted(): boolean {
    const group = this.activeGroup();
    return Boolean(group && this.isGroupCompleted(group.id));
  }

  isMatrixConfirmed(groupId: string): boolean {
    return this.groupStates()[groupId]?.matrixConfirmed !== false;
  }

  private completionIssuesForGroup(group: SampleGroupWizardGroup): string[] {
    const issues: string[] = [];
    if (!this.isMatrixConfirmed(group.id)) {
      issues.push('Cần chọn nền mẫu trước khi tiếp tục.');
    }
    const forcedSop = group.forcedSopId
      ? this.availableSops.find(sop => sop.id === group.forcedSopId)
      : undefined;
    issues.push(...sampleGroupCompletionIssues(group, {
      singleMode: this.singleMode,
      step: 5,
      forcedSop
    }));
    return issues;
  }

  private isGroupReady(group: SampleGroupWizardGroup): boolean {
    return this.completionIssuesForGroup(group).length === 0;
  }

  private newGroup(name: string): SampleGroupWizardGroup {
    return {
      id: `wizard-group-${Date.now()}-${this.groupSequence++}`,
      name,
      rawSamples: '',
      matrixType: undefined,
      sampleDescriptionMap: {},
      selectedTargets: new Set(),
      forcedSopId: undefined,
      sourceGroupId: undefined,
      sourceGroupModified: false
    };
  }

  addGroup(): void {
    if (this.singleMode) return;
    const group = this.newGroup(`Nhóm mẻ ${this.drafts().length + 1}`);
    this.drafts.update(groups => [...groups, group]);
    this.groupStates.update(states => ({
      ...states,
      [group.id]: { step: 1, completed: false, matrixConfirmed: true }
    }));
    this.openGroup(group.id);
  }

  removeGroup(groupId: string): void {
    if (this.singleMode || this.drafts().length <= 1) return;
    this.drafts.update(groups => groups.filter(group => group.id !== groupId));
    this.groupStates.update(states => {
      const next = { ...states };
      delete next[groupId];
      return next;
    });
    if (this.activeGroupId() === groupId) this.activeGroupId.set(null);
  }

  openGroup(groupId: string): void {
    if (!this.groupStates()[groupId]) return;
    this.activeGroupId.set(groupId);
    this.targetSearch.set('');
    this.targetGroupSearch.set('');
    this.showTargetGroupPicker.set(false);
    this.previewSopId.set(null);
    this.sopSelectionError.set('');
  }

  sampleCodes(group: SampleGroupWizardGroup): string[] {
    const cached = this.sampleCodesCache.get(group.id);
    if (cached?.rawSamples === group.rawSamples) return cached.codes;
    const codes = parseWizardSampleEntries(group.rawSamples).map(entry => entry.code);
    this.sampleCodesCache.set(group.id, { rawSamples: group.rawSamples, codes });
    return codes;
  }

  describedSampleCount(group: SampleGroupWizardGroup): number {
    return this.sampleCodes(group).filter(sample => this.descriptionFor(group, sample).trim()).length;
  }

  matrixName(matrixType?: string): string {
    return matrixType
      ? this.availableMatrices.find(matrix => matrix.id === matrixType)?.name || matrixType
      : this.anyMatrixLabel;
  }

  matrixSelectionValue(group: SampleGroupWizardGroup): string {
    return group.matrixType || this.anyMatrixValue;
  }

  forcedSopIssue(group: SampleGroupWizardGroup): string | null {
    if (!group.forcedSopId) return null;
    return getForcedSopAssignmentIssue(
      this.availableSops.find(sop => sop.id === group.forcedSopId),
      group.selectedTargets,
      group.matrixType
    );
  }

  selectedTargetGroupName(group: SampleGroupWizardGroup): string {
    if (!group.sourceGroupId || group.sourceGroupModified) return '';
    return this.availableTargetGroups.find(item => item.id === group.sourceGroupId)?.name || '';
  }

  private updateGroupState(groupId: string, update: Partial<GroupWizardState>): void {
    this.groupStates.update(states => ({
      ...states,
      [groupId]: {
        ...(states[groupId] || { step: 1, completed: false, matrixConfirmed: false }),
        ...update
      }
    }));
  }

  private updateActiveGroup(update: (group: SampleGroupWizardGroup) => SampleGroupWizardGroup): void {
    const groupId = this.activeGroupId();
    if (!groupId) return;
    let updatedGroup: SampleGroupWizardGroup | undefined;
    this.drafts.update(groups => groups.map(group => {
      if (group.id !== groupId) return group;
      updatedGroup = update(group);
      return updatedGroup;
    }));
    this.updateGroupState(groupId, { completed: Boolean(updatedGroup && this.isGroupReady(updatedGroup)) });
  }

  updateSamples(raw: unknown): void {
    const entries = parseWizardSampleEntries(raw);
    this.updateActiveGroup(group => {
      const sampleDescriptions: SampleDescriptionMap = {};
      entries.forEach(entry => {
        const snapshot = entry.description
          ? { nameSnapshot: entry.description }
          : getSampleDescriptionSnapshot(group.sampleDescriptionMap, entry.code);
        if (snapshot) sampleDescriptions[entry.code] = snapshot;
      });
      const normalized = normalizeWizardSamples(entries.map(entry => entry.code), sampleDescriptions);
      return {
        ...group,
        rawSamples: normalized.sampleCodes.join('\n'),
        sampleDescriptionMap: normalized.sampleDescriptions
      };
    });
  }

  updateMatrix(value: string): void {
    const groupId = this.activeGroupId();
    if (!groupId || !value) return;
    const matrixType = value === this.anyMatrixValue ? undefined : value;
    this.updateActiveGroup(group => {
      const forcedSop = group.forcedSopId
        ? this.availableSops.find(sop => sop.id === group.forcedSopId)
        : undefined;
      const forcedSopId = group.forcedSopId
        && !getForcedSopAssignmentIssue(forcedSop, group.selectedTargets, matrixType)
          ? group.forcedSopId
          : undefined;
      return { ...group, matrixType, forcedSopId };
    });
    this.updateGroupState(groupId, { matrixConfirmed: true });
    this.sopSelectionError.set('');
  }

  toggleSampleDescriptions(): void {
    this.showSampleDescriptions.update(value => !value);
  }

  descriptionFor(group: SampleGroupWizardGroup, sample: string): string {
    return getSampleDescriptionSnapshot(group.sampleDescriptionMap, sample)?.nameSnapshot || '';
  }

  updateDescription(sample: string, value: string): void {
    const name = String(value || '').trim();
    this.updateActiveGroup(group => {
      const sampleDescriptionMap = { ...group.sampleDescriptionMap };
      if (!name) {
        delete sampleDescriptionMap[sample];
      } else {
        const normalizedName = name.toLocaleLowerCase();
        const master = this.availableSampleDescriptions.find(item =>
          item.name.toLocaleLowerCase() === normalizedName
          || (item.aliases || []).some(alias => alias.toLocaleLowerCase() === normalizedName)
        );
        const snapshot: SampleDescriptionSnapshot = master
          ? { masterId: master.id, nameSnapshot: master.name }
          : { nameSnapshot: name };
        sampleDescriptionMap[sample] = snapshot;
      }
      const normalized = normalizeWizardSamples(this.sampleCodes(group), sampleDescriptionMap);
      return {
        ...group,
        rawSamples: normalized.sampleCodes.join('\n'),
        sampleDescriptionMap: normalized.sampleDescriptions
      };
    });
  }

  copyDescriptionToAll(sourceSample: string): void {
    const group = this.activeGroup();
    if (!group) return;
    const sourceSnapshot = getSampleDescriptionSnapshot(group.sampleDescriptionMap, sourceSample);
    if (!sourceSnapshot?.nameSnapshot?.trim()) return;
    const sampleDescriptionMap = { ...group.sampleDescriptionMap };
    this.sampleCodes(group).forEach(sample => {
      sampleDescriptionMap[sample] = { ...sourceSnapshot };
    });
    const normalized = normalizeWizardSamples(this.sampleCodes(group), sampleDescriptionMap);
    this.updateActiveGroup(current => ({
      ...current,
      rawSamples: normalized.sampleCodes.join('\n'),
      sampleDescriptionMap: normalized.sampleDescriptions
    }));
  }

  filteredTargets(): SampleGroupWizardTarget[] {
    const term = this.targetSearch().trim().toLocaleLowerCase();
    if (!term) return this.availableTargets;
    return this.availableTargets.filter(target =>
      target.name.toLocaleLowerCase().includes(term)
      || (target.uniqueKey || target.id).toLocaleLowerCase().includes(term)
    );
  }

  filteredTargetGroups(): TargetGroup[] {
    const term = this.targetGroupSearch().trim().toLocaleLowerCase();
    if (!term) return this.availableTargetGroups;
    return this.availableTargetGroups.filter(group =>
      group.name.toLocaleLowerCase().includes(term)
      || (group.description || '').toLocaleLowerCase().includes(term)
    );
  }

  toggleTargetGroupPicker(): void {
    this.showTargetGroupPicker.update(value => !value);
    this.targetGroupSearch.set('');
  }

  importTargetGroup(targetGroup: TargetGroup): void {
    const groupTargetIds = canonicalTargetIds(targetGroup.targets.map(target => target.name || target.id));
    this.updateActiveGroup(group => {
      const hadTargets = group.selectedTargets.size > 0;
      const selectedTargets = new Set(canonicalTargetIds([...group.selectedTargets, ...groupTargetIds]));
      const importedExactly = !hadTargets && selectedTargets.size === groupTargetIds.length;
      return {
        ...group,
        selectedTargets,
        forcedSopId: undefined,
        sourceGroupId: importedExactly ? targetGroup.id : undefined,
        sourceGroupModified: hadTargets
      };
    });
    this.showTargetGroupPicker.set(false);
    this.sopSelectionError.set('');
  }

  isTargetSelected(target: SampleGroupWizardTarget): boolean {
    const group = this.activeGroup();
    if (!group) return false;
    return group.selectedTargets.has(getCanonicalId(target.name || target.id));
  }

  toggleTarget(target: SampleGroupWizardTarget): void {
    const id = getCanonicalId(target.name || target.id);
    this.updateActiveGroup(group => {
      const selectedTargets = new Set(group.selectedTargets);
      if (selectedTargets.has(id)) selectedTargets.delete(id);
      else selectedTargets.add(id);
      return {
        ...group,
        selectedTargets: new Set(canonicalTargetIds(selectedTargets)),
        forcedSopId: undefined,
        sourceGroupId: undefined,
        sourceGroupModified: true
      };
    });
    this.sopSelectionError.set('');
  }

  selectAllTargets(): void {
    const targets = this.availableTargets.map(target => getCanonicalId(target.name || target.id));
    this.updateActiveGroup(group => ({
      ...group,
      selectedTargets: new Set(canonicalTargetIds(targets)),
      forcedSopId: undefined,
      sourceGroupId: undefined,
      sourceGroupModified: true
    }));
    this.sopSelectionError.set('');
  }

  clearTargets(): void {
    this.updateActiveGroup(group => ({
      ...group,
      selectedTargets: new Set(),
      forcedSopId: undefined,
      sourceGroupId: undefined,
      sourceGroupModified: true
    }));
    this.sopSelectionError.set('');
  }

  private targetName(targetId: string): string {
    return this.availableTargets.find(target =>
      getCanonicalId(target.name || target.id) === targetId
    )?.name || targetId;
  }

  private buildSopSuggestion(sop: Sop, group: SampleGroupWizardGroup): WizardSopSuggestion | null {
    if (!sop.targets?.length || !isSopMatrixCompatible(sop, group.matrixType)) return null;
    const requiredIds = canonicalTargetIds(group.selectedTargets);
    const sopTargetMap = new Map(
      sop.targets.map(target => [getCanonicalId(target.name || target.id), target.name || target.id])
    );
    const coveredIds = requiredIds.filter(id => sopTargetMap.has(id));
    if (coveredIds.length === 0) return null;
    const missingIds = requiredIds.filter(id => !sopTargetMap.has(id));
    const requiredSet = new Set(requiredIds);
    const extraTargets = Array.from(sopTargetMap.entries())
      .filter(([id]) => !requiredSet.has(id))
      .map(([, name]) => name);
    const isMissingStock = (sop.consumables || []).some(consumable => {
      if (consumable.type !== 'simple') return false;
      const stockItem = this.inventoryMap[consumable.name];
      return !stockItem || Number(stockItem.stock || 0) <= 0;
    });
    return {
      sop,
      coverageCount: coveredIds.length,
      totalRequired: requiredIds.length,
      coverageRatio: coveredIds.length / Math.max(sopTargetMap.size, 1),
      coveredTargets: coveredIds.map(id => this.targetName(id)),
      missingTargets: missingIds.map(id => this.targetName(id)),
      extraTargets,
      isMissingStock,
      isPartial: missingIds.length > 0,
      isBest: false
    };
  }

  sopSuggestions(group: SampleGroupWizardGroup): WizardSopSuggestion[] {
    if (group.selectedTargets.size === 0 || !this.isMatrixConfirmed(group.id)) return [];
    const candidates = this.availableSops
      .filter(sop => !sop.isManualOnly)
      .map(sop => this.buildSopSuggestion(sop, group))
      .filter((suggestion): suggestion is WizardSopSuggestion => Boolean(suggestion));
    const fullMatches = candidates.filter(suggestion => !suggestion.isPartial);
    const source = fullMatches.length > 0 ? fullMatches : candidates;
    const sorted = [...source].sort((left, right) =>
      right.coverageCount - left.coverageCount
      || right.coverageRatio - left.coverageRatio
      || left.extraTargets.length - right.extraTargets.length
      || left.sop.name.localeCompare(right.sop.name)
    ).slice(0, 5);
    return sorted.map((suggestion, index) => ({ ...suggestion, isBest: index === 0 }));
  }

  assignableSops(group: SampleGroupWizardGroup): Sop[] {
    if (group.selectedTargets.size === 0 || !this.isMatrixConfirmed(group.id)) return [];
    return this.availableSops
      .filter(sop => !getForcedSopAssignmentIssue(sop, group.selectedTargets, group.matrixType))
      .sort((left, right) => Number(left.isManualOnly) - Number(right.isManualOnly) || left.name.localeCompare(right.name));
  }

  sopMatrixLabel(sop: Sop): string {
    if (!sop.matrixTags?.length) return 'Dùng chung';
    return sop.matrixTags.map(matrixId => this.matrixName(matrixId)).join(', ');
  }

  toggleSopPreview(sopId: string): void {
    this.previewSopId.update(current => current === sopId ? null : sopId);
  }

  selectSuggestedSop(sopId: string, isPartial: boolean): void {
    if (isPartial) return;
    this.assignSop(sopId);
  }

  assignSop(sopId: string): void {
    this.updateForcedSop(sopId);
  }

  updateForcedSop(sopId: string | undefined): void {
    const group = this.activeGroup();
    if (!group) return;
    if (sopId) {
      const issue = getForcedSopAssignmentIssue(
        this.availableSops.find(sop => sop.id === sopId),
        group.selectedTargets,
        group.matrixType
      );
      if (issue) {
        this.sopSelectionError.set(issue);
        return;
      }
    }
    this.sopSelectionError.set('');
    this.updateActiveGroup(current => ({ ...current, forcedSopId: sopId }));
  }

  stepError(): string {
    const group = this.activeGroup();
    if (!group) return '';
    if (this.activeStep() === 1) {
      if (!this.isMatrixConfirmed(group.id)) return 'Cần chọn nền mẫu trước khi tiếp tục.';
      return sampleGroupCompletionIssues(group, {
        singleMode: this.singleMode,
        step: 3
      })[0] || '';
    }
    return this.completionIssuesForGroup(group)[0] || '';
  }

  goToStep(step: WizardStep): void {
    const groupId = this.activeGroupId();
    if (!groupId || step === this.activeStep()) return;
    if (step === 2 && this.activeStep() === 1 && this.stepError()) return;
    this.updateGroupState(groupId, { step });
    this.sopSelectionError.set('');
  }

  nextStep(): void {
    if (this.stepError()) return;
    this.goToStep(2);
  }

  previousStep(): void {
    this.goToStep(1);
  }

  cloneDrafts(): SampleGroupWizardGroup[] {
    return cloneSampleGroupWizardGroups(this.drafts());
  }

  runOptimizer(): void {
    if (!this.allGroupsCompleted()) return;
    this.complete.emit(this.cloneDrafts());
  }
}
