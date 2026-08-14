import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  StandardInternalIdSyncChange,
  StandardInternalIdSyncIssue,
  StandardInternalIdSyncReport,
} from '../../../core/models/standard.model';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { normalizeInternalId } from '../../../shared/utils/standard-internal-id';
import { StandardService } from '../standard.service';

type SyncFilter = 'all' | 'manual' | 'safe' | 'duplicate' | 'registry' | 'reference';

/**
 * Manager-facing repair workspace for legacy internal-id data. The service
 * always re-scans immediately before writing; this component is only the
 * review/approval surface and never writes directly to Firestore.
 */
@Component({
  selector: 'app-standards-internal-id-sync-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[620] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm" role="dialog" aria-modal="true">
        <div class="relative w-full max-w-6xl max-h-[94vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col">
          <header class="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-start justify-between gap-4 shrink-0">
            <div class="flex items-start gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-arrows-rotate"></i>
              </div>
              <div class="min-w-0">
                <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg">Đồng bộ Mã quản lý nội bộ</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                  Quét cả hồ sơ vật lý, yêu cầu mượn và nhật ký. Chỉ thay đổi lỗi xác định được duy nhất; mã thiếu/sai cần người quản lý đối chiếu thủ công.
                </p>
              </div>
            </div>
            <button type="button" (click)="close.emit()" [disabled]="isBusy()" class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 disabled:opacity-40" aria-label="Đóng">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>

          <div class="px-5 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div class="flex flex-wrap gap-2 text-[11px] font-bold">
              @if (report(); as current) {
                <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-600 dark:text-slate-300">{{current.standardsCount}} hồ sơ vật lý</span>
                <span class="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">{{current.safeChanges.length}} thay đổi an toàn</span>
                @if (manualIssues().length > 0) { <span class="rounded-full bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 text-amber-700 dark:text-amber-300">{{manualIssues().length}} cần nhập mã</span> }
                <span class="rounded-full bg-red-50 dark:bg-red-950/30 px-2.5 py-1 text-red-700 dark:text-red-300">{{nonManualConflicts().length}} xung đột/lỗi</span>
                <span class="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 text-indigo-700 dark:text-indigo-300">{{current.usageCount + (current.nestedUsageCount || 0)}} nhật ký</span>
                <span class="rounded-full bg-violet-50 dark:bg-violet-950/30 px-2.5 py-1 text-violet-700 dark:text-violet-300">{{current.purchaseRequestsCount || 0}} yêu cầu mua</span>
              } @else {
                <span class="text-slate-500 dark:text-slate-400">Chưa có kết quả quét.</span>
              }
            </div>
            <button type="button" (click)="scan()" [disabled]="isBusy()" class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40">
              @if (isScanning()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang quét } @else { <i class="fa-solid fa-rotate mr-1"></i>Quét lại }
            </button>
          </div>

          @if (report()) {
            <section class="px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="relative flex-1 min-w-[240px] max-w-xl">
                  <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input type="search" [ngModel]="searchQuery()" (ngModelChange)="setSearchQuery($event)" placeholder="Tìm hồ sơ, mã, loại cảnh báo hoặc nội dung gợi ý..." class="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40">
                  @if (searchQuery()) {
                    <button type="button" (click)="setSearchQuery('')" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1" aria-label="Xóa tìm kiếm"><i class="fa-solid fa-xmark"></i></button>
                  }
                </div>
                <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">Hiển thị {{filteredItemCount()}} mục phù hợp</span>
              </div>
              <div class="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] font-bold" role="tablist" aria-label="Bộ lọc đồng bộ mã nội bộ">
                @for (option of filterOptions; track option.key) {
                  <button type="button" role="tab" [attr.aria-selected]="activeFilter() === option.key" (click)="setFilter(option.key)" [class]="filterClass(option.key)" [title]="option.description">
                    <i [class]="option.icon + ' mr-1'"></i>{{option.label}} ({{filterCount(option.key)}})
                  </button>
                }
              </div>
            </section>
          }

          <main class="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/60 dark:bg-slate-950/30 p-4 sm:p-6 space-y-4">
            @if (errorMessage()) {
              <div class="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 px-4 py-3 text-xs font-bold">{{errorMessage()}}</div>
            }

            @if (report(); as current) {
              @if (showFilter('manual') && filteredManualIssues().length > 0) {
                <section class="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 overflow-hidden">
                  <div class="px-4 py-3 border-b border-amber-200/70 dark:border-amber-900/40">
                    <h4 class="text-sm font-black text-amber-800 dark:text-amber-200"><i class="fa-solid fa-user-check mr-2"></i>{{filteredManualIssues().length}} hồ sơ cần đối chiếu mã</h4>
                    <p class="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-1">Không tự gán theo tên/lô vì có thể là hai chuẩn vật lý khác nhau. Mã chuẩn có 4 ký tự bắt đầu A/B/C; riêng nghiệp vụ SDHET nhập đúng SDHET.</p>
                  </div>
                  <div class="divide-y divide-amber-200/70 dark:divide-amber-900/40">
                    @for (issue of filteredManualIssues(); track issue.id) {
                      <div class="px-4 py-3 grid lg:grid-cols-[minmax(0,1fr)_200px] gap-3 items-start">
                        <div class="min-w-0">
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="font-mono text-xs font-black text-slate-700 dark:text-slate-200">{{issue.documentId}}</span>
                            @if (issue.internalId) { <span class="font-mono text-[10px] text-red-600 dark:text-red-300">Mã hiện tại: {{issue.internalId}}</span> }
                            @else { <span class="font-mono text-[10px] text-amber-700 dark:text-amber-300">Mã hiện tại: (trống)</span> }
                            <span class="rounded-full px-2 py-0.5 text-[9px] font-black bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">{{issue.kind}}</span>
                          </div>
                          <p class="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{{issue.message}}</p>
                          @if (issue.detail) { <p class="text-[11px] text-slate-600 dark:text-slate-300 mt-1"><strong>Chi tiết:</strong> {{issue.detail}}</p> }
                          @if (issue.suggestion) { <p class="text-[11px] text-amber-800 dark:text-amber-200 mt-1"><strong>Gợi ý sửa:</strong> {{issue.suggestion}}</p> }
                          <p class="text-[10px] text-slate-400 mt-1">Bản ghi kỹ thuật: {{issue.collection}}/{{issue.documentId}}</p>
                        </div>
                        <label class="block">
                          <span class="block text-[10px] font-black uppercase tracking-wide text-amber-800/80 dark:text-amber-200/80 mb-1">Mã sau khi đối chiếu</span>
                          <input [ngModel]="correctionValue(issue.documentId)" (ngModelChange)="setCorrection(issue.documentId, $event)" maxlength="5" autocomplete="off" placeholder="AA01 hoặc SDHET" class="w-full rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm font-black font-mono uppercase tracking-wider text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/40">
                        </label>
                      </div>
                    }
                  </div>
                </section>
              }

              @if (showFilter('safe') && filteredSafeChanges().length > 0) {
                <section class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-900 overflow-hidden">
                  <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">Thay đổi có thể đồng bộ tự động</h4>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Chuẩn hóa chữ hoa/khoảng trắng, sửa registry khi chỉ có đúng một chủ sở hữu, và cập nhật snapshot lịch sử.</p>
                    </div>
                    <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">{{filteredSafeChanges().length}}</span>
                  </div>
                  <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    @for (change of visibleSafeChanges(); track change.collection + '/' + change.documentId + '/' + change.field) {
                      <div class="px-4 py-2.5 grid md:grid-cols-[170px_120px_1fr] gap-2 text-[11px]">
                        <span class="font-mono text-slate-500 dark:text-slate-400 truncate" [title]="change.collection + '/' + change.documentId">{{change.collection}}/{{change.documentId}}</span>
                        <span class="font-black text-slate-700 dark:text-slate-200">{{change.field}}</span>
                        <span class="text-slate-500 dark:text-slate-400 break-words"><span class="block">{{formatValue(change.before)}} → <strong class="text-emerald-700 dark:text-emerald-300">{{formatValue(change.after)}}</strong></span><span class="block text-[10px] text-slate-400 mt-0.5">{{change.reason}}</span></span>
                      </div>
                    }
                  </div>
                  @if (filteredSafeChanges().length > visibleSafeChanges().length) {
                    <p class="px-4 py-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">Đang hiển thị {{visibleSafeChanges().length}}/{{filteredSafeChanges().length}} mục phù hợp; toàn bộ thay đổi vẫn sẽ được ghi trong batch.</p>
                  }
                </section>
              }

              @if (showConflictGroup() && filteredConflicts().length > 0) {
                <section class="rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 overflow-hidden">
                  <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 class="text-sm font-black text-red-700 dark:text-red-300"><i class="fa-solid fa-triangle-exclamation mr-2"></i>{{filteredConflicts().length}} cảnh báo cần xử lý nghiệp vụ</h4>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Mỗi cảnh báo nêu rõ giá trị đang gặp vấn đề, nguyên nhân và hướng đối chiếu; công cụ không tự ghi đè các trường hợp chưa xác định duy nhất.</p>
                  </div>
                  <div class="max-h-[32rem] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    @for (issue of visibleConflicts(); track issue.id) {
                      <div class="px-4 py-3 text-xs">
                        <div class="flex flex-wrap gap-2 items-center"><span class="font-black text-slate-700 dark:text-slate-200">{{issue.collection}}/{{issue.documentId}}</span><span class="font-mono text-[10px] text-red-600 dark:text-red-300">{{issue.kind}}</span>@if (issue.internalId) { <span class="font-mono text-[10px] text-slate-500 dark:text-slate-400">Mã: {{issue.internalId}}</span> }</div>
                        <p class="text-slate-700 dark:text-slate-300 mt-1">{{issue.message}}</p>
                        @if (issue.detail) { <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-1"><strong>Chi tiết:</strong> {{issue.detail}}</p> }
                        @if (issue.suggestion) { <p class="text-[11px] text-amber-700 dark:text-amber-300 mt-1"><strong>Gợi ý xử lý:</strong> {{issue.suggestion}}</p> }
                        @if (issue.suggestedInternalId) { <p class="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1"><strong>Mã tham chiếu đề xuất:</strong> {{issue.suggestedInternalId}}</p> }
                      </div>
                    }
                  </div>
                  @if (filteredConflicts().length > visibleConflicts().length) {
                    <p class="px-4 py-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">Đang hiển thị {{visibleConflicts().length}}/{{filteredConflicts().length}} mục phù hợp; hãy thu hẹp bộ lọc hoặc tìm kiếm để xử lý từng nhóm.</p>
                  }
                </section>
              }

              @if (filteredItemCount() === 0) {
                <section class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/20 px-4 py-4">
                  <p class="text-sm font-black text-emerald-800 dark:text-emerald-200"><i class="fa-solid fa-circle-check mr-2"></i>{{activeFilter() === 'all' ? 'Không có cảnh báo hoặc thay đổi cần xử lý.' : 'Không có mục nào trong bộ lọc hiện tại.'}}</p>
                </section>
              }
            } @else if (isScanning()) {
              <div class="py-20 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl mb-3"></i><p class="text-sm font-bold">Đang đọc danh sách mã và các bản sao lịch sử...</p></div>
            }
          </main>

          <footer class="px-5 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <p class="text-[10px] text-slate-400 max-w-2xl"><i class="fa-solid fa-lock mr-1"></i>Batch được ghi kèm người thực hiện, thời điểm và before/after. Không xóa hồ sơ cũ và không đổi mã hợp lệ đang tồn tại.</p>
            <div class="flex gap-2">
              <button type="button" (click)="close.emit()" [disabled]="isBusy()" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black disabled:opacity-40">Đóng</button>
              <button type="button" (click)="apply()" [disabled]="isBusy() || !canApply()" class="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-black disabled:opacity-40">
                @if (isApplying()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang đồng bộ } @else { <i class="fa-solid fa-check mr-1"></i>Áp dụng đồng bộ }
              </button>
            </div>
          </footer>
        </div>
      </div>
    }
  `,
})
export class StandardsInternalIdSyncModalComponent {
  readonly stdService = inject(StandardService);
  readonly confirmation = inject(ConfirmationService);
  readonly toast = inject(ToastService);

  isOpen = input(false);
  close = output<void>();

  report = signal<StandardInternalIdSyncReport | null>(null);
  corrections = signal<Record<string, string>>({});
  isScanning = signal(false);
  isApplying = signal(false);
  errorMessage = signal('');
  isBusy = computed(() => this.isScanning() || this.isApplying());
  activeFilter = signal<SyncFilter>('all');
  searchQuery = signal('');

  readonly filterOptions: readonly {
    key: SyncFilter;
    label: string;
    icon: string;
    description: string;
  }[] = [
    { key: 'all', label: 'Tất cả', icon: 'fa-solid fa-layer-group', description: 'Hiển thị mọi nhóm cần xem xét.' },
    { key: 'manual', label: 'Cần nhập mã', icon: 'fa-solid fa-pen-to-square', description: 'Hồ sơ vật lý thiếu hoặc sai định dạng mã.' },
    { key: 'safe', label: 'Thay đổi an toàn', icon: 'fa-solid fa-circle-check', description: 'Các thay đổi deterministic có thể ghi trong batch.' },
    { key: 'duplicate', label: 'Trùng mã', icon: 'fa-solid fa-clone', description: 'Nhiều hồ sơ hiện tại cùng sở hữu một mã.' },
    { key: 'registry', label: 'Registry', icon: 'fa-solid fa-database', description: 'Mã và sổ sở hữu kỹ thuật không khớp.' },
    { key: 'reference', label: 'Tham chiếu', icon: 'fa-solid fa-link', description: 'Request hoặc nhật ký không khớp hồ sơ vật lý.' },
  ];

  manualIssues = computed(() => (this.report()?.issues || []).filter(issue =>
    issue.collection === 'reference_standards' &&
    (issue.kind === 'MISSING' || issue.kind === 'INVALID_FORMAT')
  ));
  safeChanges = computed(() => this.report()?.safeChanges || []);
  nonManualConflicts = computed(() => {
    const manualIds = new Set(this.manualIssues().map(issue => issue.id));
    return (this.report()?.conflicts || []).filter(issue => !manualIds.has(issue.id));
  });
  filteredManualIssues = computed(() => this.manualIssues().filter(issue =>
    (this.activeFilter() === 'all' || this.activeFilter() === 'manual') && this.matchesSearch([
      issue.collection, issue.documentId, issue.standardId, issue.internalId, issue.kind,
      issue.message, issue.detail, issue.suggestion, issue.suggestedInternalId,
    ])
  ));
  filteredSafeChanges = computed(() => this.safeChanges().filter(change =>
    (this.activeFilter() === 'all' || this.activeFilter() === 'safe') && this.matchesSearch([
      change.collection, change.documentId, change.field, change.before, change.after, change.reason,
    ])
  ));
  filteredConflicts = computed(() => this.nonManualConflicts().filter(issue =>
    this.conflictMatchesActiveFilter(issue) && this.matchesSearch([
      issue.collection, issue.documentId, issue.standardId, issue.internalId, issue.kind,
      issue.message, issue.detail, issue.suggestion, issue.suggestedInternalId,
    ])
  ));
  visibleSafeChanges = computed(() => this.filteredSafeChanges().slice(0, 80));
  visibleConflicts = computed(() => this.filteredConflicts().slice(0, 120));
  filteredItemCount = computed(() => this.filteredManualIssues().length + this.filteredSafeChanges().length + this.filteredConflicts().length);

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        // scan() reads the busy signals before it changes them. Keep those
        // signals out of this effect so finishing one scan cannot start a new
        // scan indefinitely.
        untracked(() => {
          void this.scan();
        });
      } else {
        this.report.set(null);
        this.corrections.set({});
        this.errorMessage.set('');
        this.activeFilter.set('all');
        this.searchQuery.set('');
      }
    });
  }

  async scan(): Promise<void> {
    if (this.isScanning() || this.isApplying()) return;
    this.isScanning.set(true);
    this.errorMessage.set('');
    try {
      this.report.set(await this.stdService.scanInternalIdSync());
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Không thể quét dữ liệu mã nội bộ.');
    } finally {
      this.isScanning.set(false);
    }
  }

  correctionValue(documentId: string): string {
    return this.corrections()[documentId] || '';
  }

  setCorrection(documentId: string, value: string): void {
    const normalized = normalizeInternalId(value).slice(0, 5);
    this.corrections.update(current => ({ ...current, [documentId]: normalized }));
  }

  setFilter(filter: SyncFilter): void {
    this.activeFilter.set(filter);
  }

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  filterClass(filter: SyncFilter): string {
    const active = this.activeFilter() === filter;
    return active
      ? 'shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-2.5 py-1.5 ring-1 ring-amber-300/80 dark:ring-amber-700/80'
      : 'shrink-0 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5';
  }

  filterCount(filter: SyncFilter): number {
    switch (filter) {
      case 'all':
        return this.manualIssues().length + this.safeChanges().length + this.nonManualConflicts().length;
      case 'manual':
        return this.manualIssues().length;
      case 'safe':
        return this.safeChanges().length;
      case 'duplicate':
        return this.nonManualConflicts().filter(issue => issue.kind === 'DUPLICATE_ACTIVE').length;
      case 'registry':
        return this.nonManualConflicts().filter(issue => issue.kind === 'REGISTRY_MISMATCH').length;
      case 'reference':
        return this.nonManualConflicts().filter(issue => issue.kind === 'REQUEST_REFERENCE' || issue.kind === 'USAGE_REFERENCE').length;
    }
  }

  showFilter(filter: 'manual' | 'safe'): boolean {
    return this.activeFilter() === 'all' || this.activeFilter() === filter;
  }

  showConflictGroup(): boolean {
    return this.activeFilter() === 'all'
      || this.activeFilter() === 'duplicate'
      || this.activeFilter() === 'registry'
      || this.activeFilter() === 'reference';
  }

  private conflictMatchesActiveFilter(issue: StandardInternalIdSyncIssue): boolean {
    const active = this.activeFilter();
    if (active === 'all') return true;
    if (active === 'duplicate') return issue.kind === 'DUPLICATE_ACTIVE';
    if (active === 'registry') return issue.kind === 'REGISTRY_MISMATCH';
    if (active === 'reference') return issue.kind === 'REQUEST_REFERENCE' || issue.kind === 'USAGE_REFERENCE';
    return false;
  }

  private matchesSearch(values: readonly unknown[]): boolean {
    const query = this.searchQuery().trim().toLocaleLowerCase('vi-VN');
    if (!query) return true;
    return values.some(value => value !== null && value !== undefined
      && String(value).toLocaleLowerCase('vi-VN').includes(query));
  }

  canApply(): boolean {
    const current = this.report();
    if (!current) return false;
    const correctionCount = Object.values(this.corrections()).filter(Boolean).length;
    return current.safeChanges.length > 0 || correctionCount > 0;
  }

  async apply(): Promise<void> {
    const current = this.report();
    if (!current || !this.canApply() || this.isBusy()) return;
    if (!await this.confirmation.confirm({
      message: 'Áp dụng các thay đổi mã nội bộ an toàn và các mã sửa thủ công đã nhập? Hệ thống sẽ quét lại ngay trước khi ghi.',
      confirmText: 'Áp dụng đồng bộ'
    })) return;

    this.isApplying.set(true);
    this.errorMessage.set('');
    try {
      const batchId = await this.stdService.applyInternalIdSync(current, this.corrections());
      this.toast.show(`Đã đồng bộ mã nội bộ. Batch: ${batchId}`, 'success');
      this.corrections.set({});
      this.report.set(await this.stdService.scanInternalIdSync());
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Không thể áp dụng đồng bộ mã nội bộ.');
    } finally {
      this.isApplying.set(false);
    }
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return '(trống)';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
}
