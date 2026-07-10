import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Request } from '../../core/models/request.model';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { StateService } from '../../core/services/state.service';
import { ToastService } from '../../core/services/toast.service';
import {
  ChecklistCheckFilter,
  ChecklistRequestStatus,
  ChecklistSample,
  ChecklistSopGroup,
  ChecklistTargetGroup,
  DailyChecklistAssignment,
  DailyChecklistSummary
} from './daily-checklist.model';
import { DailyChecklistService } from './daily-checklist.service';
import {
  buildAssignments,
  toLocalDaySuffix,
  uniqueSampleKey
} from './daily-checklist.utils';

interface StatusOption {
  value: ChecklistRequestStatus;
  label: string;
  dotClass: string;
  chipClass: string;
  ringClass: string;
}

@Component({
  selector: 'app-daily-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DailyChecklistService],
  templateUrl: './daily-checklist.component.html',
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    @keyframes checklist-fade-in-up {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .checklist-fade-in-up { animation: checklist-fade-in-up 0.3s ease-out both; }
    .checklist-fade-in { animation: checklist-fade-in-up 0.2s ease-out both; }

    @media (prefers-reduced-motion: reduce) {
      .checklist-fade-in-up,
      .checklist-fade-in { animation: none; }
    }
  `]
})
export class DailyChecklistComponent implements OnDestroy {
  readonly state = inject(StateService);
  readonly auth = inject(AuthService);
  readonly checklist = inject(DailyChecklistService);
  private readonly router = inject(Router);
  private readonly confirmation = inject(ConfirmationService);
  private readonly toast = inject(ToastService);

  readonly selectedDay = signal(toLocalDaySuffix());
  readonly dayOptions = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0'));
  readonly collapsedGroups = signal<Record<string, boolean>>({});
  readonly statusFilter = signal<ChecklistRequestStatus | null>(null);
  readonly checkFilter = signal<ChecklistCheckFilter>('all');
  readonly searchTerm = signal('');
  readonly pendingKeys = signal<Set<string>>(new Set());

  readonly statusOptions: StatusOption[] = [
    {
      value: 'completed', label: 'Đã xong', dotClass: 'bg-emerald-500',
      chipClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
      ringClass: 'ring-emerald-400'
    },
    {
      value: 'approved', label: 'Đã duyệt', dotClass: 'bg-blue-500',
      chipClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
      ringClass: 'ring-blue-400'
    },
    {
      value: 'draft', label: 'Đang chạy', dotClass: 'bg-violet-500',
      chipClass: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20',
      ringClass: 'ring-violet-400'
    },
    {
      value: 'pending', label: 'Chờ duyệt', dotClass: 'bg-amber-500',
      chipClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
      ringClass: 'ring-amber-400'
    },
    {
      value: 'rejected', label: 'Từ chối', dotClass: 'bg-red-500',
      chipClass: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
      ringClass: 'ring-red-400'
    }
  ];

  readonly canCheck = computed(() => this.auth.canRunBatch() && !this.checklist.error());

  private readonly targetNameMap = computed(() => {
    const map = new Map<string, string>();
    this.state.sops().forEach(sop => {
      (sop.targets || []).forEach(target => map.set(`${sop.id}\u0000${target.id}`, target.name));
    });
    return map;
  });

  private readonly effectiveRequests = computed<Request[]>(() => {
    const map = new Map<string, Request>();
    const cached = [...this.state.requests(), ...this.state.approvedRequests()];
    cached.forEach(request => map.set(request.id, request));

    return Array.from(map.values());
  });

  readonly baseAssignments = computed<DailyChecklistAssignment[]>(() => {
    const names = this.targetNameMap();
    return buildAssignments(
      this.effectiveRequests(),
      this.selectedDay(),
      (sopId, targetId) => names.get(`${sopId}\u0000${targetId}`) ?? targetId
    );
  });

  readonly summary = computed<DailyChecklistSummary>(() => {
    const assignments = this.baseAssignments();
    const uniqueSamples = new Set<string>();
    const batches = new Set<string>();
    const statusSamples = new Map<ChecklistRequestStatus, Set<string>>();
    this.statusOptions.forEach(option => statusSamples.set(option.value, new Set()));

    let checkedAssignments = 0;
    let legacyAssignments = 0;
    let dayMismatches = 0;

    assignments.forEach(assignment => {
      const sampleKey = uniqueSampleKey(assignment.requestId, assignment.sampleId);
      uniqueSamples.add(sampleKey);
      batches.add(assignment.requestId);
      statusSamples.get(assignment.status)?.add(sampleKey);
      if (this.checklist.isChecked(assignment)) checkedAssignments++;
      if (assignment.isLegacyDate) legacyAssignments++;
      if (assignment.hasDayMismatch) dayMismatches++;
    });

    return {
      uniqueSamples: uniqueSamples.size,
      assignments: assignments.length,
      checkedAssignments,
      batches: batches.size,
      legacyAssignments,
      dayMismatches,
      statuses: {
        pending: statusSamples.get('pending')?.size ?? 0,
        approved: statusSamples.get('approved')?.size ?? 0,
        rejected: statusSamples.get('rejected')?.size ?? 0,
        draft: statusSamples.get('draft')?.size ?? 0,
        completed: statusSamples.get('completed')?.size ?? 0
      }
    };
  });

  readonly filteredAssignments = computed(() => {
    const status = this.statusFilter();
    const check = this.checkFilter();
    const search = this.searchTerm().trim().toLocaleLowerCase('vi');

    return this.baseAssignments().filter(assignment => {
      const checked = this.checklist.isChecked(assignment);
      if (status && assignment.status !== status) return false;
      if (check === 'checked' && !checked) return false;
      if (check === 'unchecked' && checked) return false;
      if (search) {
        const haystack = [
          assignment.sampleId,
          assignment.requestId,
          assignment.sopName,
          assignment.targetName
        ].join(' ').toLocaleLowerCase('vi');
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  });

  readonly groupedChecklist = computed<ChecklistSopGroup[]>(() => {
    const collapsed = this.collapsedGroups();
    const sopMap = new Map<string, ChecklistSopGroup>();

    this.filteredAssignments().forEach(assignment => {
      let sopGroup = sopMap.get(assignment.sopId);
      if (!sopGroup) {
        sopGroup = {
          sopId: assignment.sopId,
          sopName: assignment.sopName,
          targets: [],
          collapsed: collapsed[assignment.sopId] ?? false
        };
        sopMap.set(assignment.sopId, sopGroup);
      }

      let targetGroup = sopGroup.targets.find(target => target.targetId === assignment.targetId);
      if (!targetGroup) {
        targetGroup = {
          targetId: assignment.targetId,
          targetName: assignment.targetName,
          samples: []
        };
        sopGroup.targets.push(targetGroup);
      }

      targetGroup.samples.push({
        ...assignment,
        checked: this.checklist.isChecked(assignment)
      });
    });

    const result = Array.from(sopMap.values());
    result.forEach(group => {
      group.targets.sort((a, b) => a.targetName.localeCompare(b.targetName, 'vi'));
      group.targets.forEach(target => target.samples.sort(
        (a, b) => a.sampleId.localeCompare(b.sampleId, 'vi', { numeric: true })
      ));
    });
    return result.sort((a, b) => a.sopName.localeCompare(b.sopName, 'vi'));
  });

  readonly hasActiveFilters = computed(() => Boolean(
    this.statusFilter() || this.checkFilter() !== 'all' || this.searchTerm().trim()
  ));

  readonly checkedPercent = computed(() => {
    const summary = this.summary();
    return summary.assignments ? Math.round(summary.checkedAssignments / summary.assignments * 100) : 0;
  });

  constructor() {
    effect(() => {
      this.checklist.watchDay(this.selectedDay());
    });
  }

  onDayChange(value: string): void {
    this.selectedDay.set(this.dayOptions.includes(value) ? value : toLocalDaySuffix());
    this.clearFilters();
  }

  goToToday(): void {
    this.selectedDay.set(toLocalDaySuffix());
    this.clearFilters();
  }

  retryCheckState(): void {
    this.checklist.retry(this.selectedDay());
  }

  setStatusFilter(status: ChecklistRequestStatus): void {
    this.statusFilter.set(this.statusFilter() === status ? null : status);
  }

  setCheckFilter(filter: ChecklistCheckFilter): void {
    this.checkFilter.set(filter);
  }

  clearFilters(): void {
    this.statusFilter.set(null);
    this.checkFilter.set('all');
    this.searchTerm.set('');
  }

  toggleCollapse(sopId: string): void {
    this.collapsedGroups.update(current => ({ ...current, [sopId]: !current[sopId] }));
  }

  collapseAll(): void {
    const all: Record<string, boolean> = {};
    this.groupedChecklist().forEach(group => all[group.sopId] = true);
    this.collapsedGroups.set(all);
  }

  expandAll(): void {
    this.collapsedGroups.set({});
  }

  openBatch(requestId: string): void {
    this.router.navigate(['/results-view', requestId]);
  }

  async toggleSampleCheck(sample: ChecklistSample): Promise<void> {
    if (!this.canCheck() || this.isPending(sample)) return;
    this.setPending([sample], true);
    try {
      await this.checklist.setChecked(sample, !sample.checked);
    } catch (error: any) {
      this.toast.show(error?.message || 'Không thể cập nhật trạng thái check mẫu.', 'error');
    } finally {
      this.setPending([sample], false);
    }
  }

  async setTargetChecked(target: ChecklistTargetGroup, checked: boolean): Promise<void> {
    await this.setManyChecked(target.samples, checked, `${target.samples.length} lượt của chỉ tiêu ${target.targetName}`);
  }

  async setGroupChecked(group: ChecklistSopGroup, checked: boolean): Promise<void> {
    const samples = group.targets.flatMap(target => target.samples);
    await this.setManyChecked(samples, checked, `${samples.length} lượt thuộc SOP ${group.sopName}`);
  }

  async setAllVisibleChecked(checked: boolean): Promise<void> {
    await this.setManyChecked(
      this.filteredAssignments(),
      checked,
      `${this.filteredAssignments().length} lượt đang hiển thị`
    );
  }

  private async setManyChecked(
    assignments: DailyChecklistAssignment[],
    checked: boolean,
    description: string
  ): Promise<void> {
    if (!this.canCheck() || !assignments.length) return;
    const changed = assignments.filter(item => this.checklist.isChecked(item) !== checked);
    if (!changed.length) {
      this.toast.show(checked ? 'Tất cả mục đã được check.' : 'Tất cả mục đã được bỏ check.', 'info');
      return;
    }

    const confirmed = await this.confirmation.confirm({
      message: `${checked ? 'Check' : 'Bỏ check'} ${description}?`,
      confirmText: checked ? 'Check tất cả' : 'Bỏ check',
      isDangerous: !checked
    });
    if (!confirmed) return;

    this.setPending(changed, true);
    try {
      await this.checklist.setManyChecked(changed, checked);
      this.toast.show(`Đã ${checked ? 'check' : 'bỏ check'} ${changed.length} lượt mẫu/chỉ tiêu.`, 'success');
    } catch (error: any) {
      this.toast.show(error?.message || 'Không thể cập nhật hàng loạt.', 'error');
    } finally {
      this.setPending(changed, false);
    }
  }

  isPending(assignment: DailyChecklistAssignment): boolean {
    return this.pendingKeys().has(assignment.key);
  }

  targetCheckedCount(target: ChecklistTargetGroup): number {
    return target.samples.filter(sample => sample.checked).length;
  }

  groupCheckedCount(group: ChecklistSopGroup): number {
    return group.targets.reduce((total, target) => total + this.targetCheckedCount(target), 0);
  }

  groupAssignmentCount(group: ChecklistSopGroup): number {
    return group.targets.reduce((total, target) => total + target.samples.length, 0);
  }

  groupUniqueSampleCount(group: ChecklistSopGroup): number {
    const keys = new Set<string>();
    group.targets.forEach(target => target.samples.forEach(sample => {
      keys.add(uniqueSampleKey(sample.requestId, sample.sampleId));
    }));
    return keys.size;
  }

  getCheckTooltip(sample: ChecklistSample): string {
    const entry = this.checklist.getCheckEntry(sample);
    if (!entry?.checked) return this.canCheck() ? 'Đánh dấu đã kiểm tra' : 'Bạn chỉ có quyền xem';
    const date = this.formatCheckDate(entry.checkedAt);
    return `Đã check bởi ${entry.checkedByName || 'Không rõ'}${date ? ` lúc ${date}` : ''}`;
  }

  getStatusClass(status: ChecklistRequestStatus): string {
    return this.statusOptions.find(option => option.value === status)?.chipClass ??
      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
  }

  getStatusLabel(status: ChecklistRequestStatus): string {
    return this.statusOptions.find(option => option.value === status)?.label ?? status;
  }

  getStatusDot(status: ChecklistRequestStatus): string {
    return this.statusOptions.find(option => option.value === status)?.dotClass ?? 'bg-slate-400';
  }

  private formatCheckDate(value: unknown): string {
    if (!value) return '';
    const candidate = value as { toDate?: () => Date };
    const date = typeof candidate.toDate === 'function'
      ? candidate.toDate()
      : value instanceof Date ? value : null;
    return date ? date.toLocaleString('vi-VN') : '';
  }

  private setPending(assignments: DailyChecklistAssignment[], pending: boolean): void {
    this.pendingKeys.update(current => {
      const next = new Set(current);
      assignments.forEach(item => pending ? next.add(item.key) : next.delete(item.key));
      return next;
    });
  }

  ngOnDestroy(): void {
    this.checklist.stop();
  }
}
