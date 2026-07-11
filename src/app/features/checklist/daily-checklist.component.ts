import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import {
  ApprovedBatchOverview,
  ApprovedBatchStatus,
  DailyApprovedSummary,
  DailyOverviewMode,
  DailyPrintSopGroup,
  DailySampleOverview
} from './daily-checklist.model';
import {
  buildApprovedBatchOverviews,
  buildDailyPrintSopGroups,
  buildDailySampleOverviews,
  getAvailableApprovedDates,
  getRequestDateValue,
  isValidDateInput,
  toLocalDateInputValue
} from './daily-checklist.utils';

interface BatchStatusOption {
  value: ApprovedBatchStatus;
  label: string;
  description: string;
  dotClass: string;
  chipClass: string;
}

interface AvailableDateOption {
  value: string;
  label: string;
  batches: number;
  samples: number;
}

@Component({
  selector: 'app-daily-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-checklist.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    @keyframes daily-overview-enter {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .daily-overview-enter { animation: daily-overview-enter 0.24s ease-out both; }

    .daily-print-paper {
      width: 1120px;
      max-width: none;
      min-height: 720px;
    }

    .daily-print-table thead { display: table-header-group; }
    .daily-print-row { break-inside: avoid; page-break-inside: avoid; }

    @media print {
      @page { size: A4 landscape; margin: 9mm; }

      body.daily-checklist-printing { background: white !important; }
      body.daily-checklist-printing * { visibility: hidden !important; }
      body.daily-checklist-printing .daily-print-root,
      body.daily-checklist-printing .daily-print-root * { visibility: visible !important; }
      body.daily-checklist-printing .daily-print-overlay {
        position: static !important;
        display: block !important;
        background: white !important;
        padding: 0 !important;
        overflow: visible !important;
      }
      body.daily-checklist-printing .daily-print-shell {
        width: 100% !important;
        max-width: none !important;
        height: auto !important;
        max-height: none !important;
        box-shadow: none !important;
        border: 0 !important;
        border-radius: 0 !important;
        overflow: visible !important;
      }
      body.daily-checklist-printing .daily-print-controls { display: none !important; }
      body.daily-checklist-printing .daily-print-scroll {
        display: block !important;
        overflow: visible !important;
        padding: 0 !important;
        background: white !important;
      }
      body.daily-checklist-printing .daily-print-paper {
        position: absolute !important;
        inset: 0 auto auto 0 !important;
        width: 100% !important;
        min-height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        color: #0f172a !important;
      }
      body.daily-checklist-printing .daily-print-sop { break-inside: auto; }
    }

    @media (prefers-reduced-motion: reduce) {
      .daily-overview-enter { animation: none; }
    }
  `]
})
export class DailyChecklistComponent {
  readonly state = inject(StateService);
  private readonly router = inject(Router);

  readonly selectedDate = signal(toLocalDateInputValue());
  readonly viewMode = signal<DailyOverviewMode>('samples');
  readonly statusFilter = signal<ApprovedBatchStatus | 'all'>('all');
  readonly sopFilter = signal('all');
  readonly searchTerm = signal('');
  readonly mobileFiltersOpen = signal(false);
  readonly expandedSamples = signal<Set<string>>(new Set());
  readonly expandedBatches = signal<Set<string>>(new Set());
  readonly printPreviewOpen = signal(false);
  readonly printScope = signal<'day' | 'filtered'>('day');
  readonly printGeneratedAt = signal(new Date());

  readonly statusOptions: BatchStatusOption[] = [
    {
      value: 'approved',
      label: 'Đã duyệt',
      description: 'Chờ thực hiện',
      dotClass: 'bg-blue-500',
      chipClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20'
    },
    {
      value: 'draft',
      label: 'Đang xử lý',
      description: 'Đã nhập dữ liệu',
      dotClass: 'bg-violet-500',
      chipClass: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20'
    },
    {
      value: 'completed',
      label: 'Hoàn thành',
      description: 'Đã hoàn tất kết quả',
      dotClass: 'bg-emerald-500',
      chipClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
    }
  ];

  private didInitializeDate = false;

  private readonly targetNameMap = computed(() => {
    const map = new Map<string, string>();
    this.state.sops().forEach(sop => {
      (sop.targets || []).forEach(target => map.set(`${sop.id}\u0000${target.id}`, target.name));
    });
    return map;
  });

  readonly approvedRequests = computed(() => this.state.approvedRequests());

  readonly availableDates = computed(() => getAvailableApprovedDates(this.approvedRequests()));

  readonly availableDateOptions = computed<AvailableDateOption[]>(() => {
    const dateMap = new Map<string, { batches: number; samples: Set<string> }>();
    this.approvedRequests().forEach(request => {
      if (request.isVirtualMaster) return;
      const value = getRequestDateValue(request);
      if (!value) return;
      let entry = dateMap.get(value);
      if (!entry) {
        entry = { batches: 0, samples: new Set<string>() };
        dateMap.set(value, entry);
      }
      entry.batches++;
      (request.sampleList || []).forEach(sampleId => {
        const normalized = String(sampleId).trim();
        if (normalized) entry!.samples.add(normalized);
      });
    });

    return this.availableDates().map(value => {
      const entry = dateMap.get(value)!;
      return {
        value,
        label: this.formatDate(value),
        batches: entry.batches,
        samples: entry.samples.size
      };
    });
  });

  readonly hasOlderDate = computed(() => {
    const index = this.availableDates().indexOf(this.selectedDate());
    return index >= 0 && index < this.availableDates().length - 1;
  });

  readonly hasNewerDate = computed(() => this.availableDates().indexOf(this.selectedDate()) > 0);

  readonly dayBatches = computed<ApprovedBatchOverview[]>(() => {
    const targetNames = this.targetNameMap();
    return buildApprovedBatchOverviews(
      this.approvedRequests(),
      this.selectedDate(),
      (sopId, targetId) => targetNames.get(`${sopId}\u0000${targetId}`) || targetId
    );
  });

  readonly sopOptions = computed(() => {
    const map = new Map<string, string>();
    this.dayBatches().forEach(batch => map.set(batch.sopId, batch.sopName));
    return Array.from(map, ([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  });

  readonly summary = computed<DailyApprovedSummary>(() => {
    const batches = this.dayBatches();
    const samples = new Set<string>();
    const sops = new Set<string>();
    let sampleOccurrences = 0;
    let targetAssignments = 0;
    const statuses: Record<ApprovedBatchStatus, number> = { approved: 0, draft: 0, completed: 0 };

    batches.forEach(batch => {
      sops.add(batch.sopId);
      statuses[batch.status]++;
      sampleOccurrences += batch.samples.length;
      targetAssignments += batch.targetAssignments;
      batch.samples.forEach(sample => samples.add(sample.sampleId));
    });

    return {
      batches: batches.length,
      uniqueSamples: samples.size,
      sampleOccurrences,
      sops: sops.size,
      targetAssignments,
      statuses
    };
  });

  readonly filteredBatches = computed(() => {
    const status = this.statusFilter();
    const sop = this.sopFilter();
    const search = normalizeSearch(this.searchTerm());

    return this.dayBatches().filter(batch => {
      if (status !== 'all' && batch.status !== status) return false;
      if (sop !== 'all' && batch.sopId !== sop) return false;
      if (!search) return true;
      const haystack = normalizeSearch([
        batch.requestId,
        batch.sopName,
        batch.ownerName || '',
        ...batch.samples.flatMap(sample => [sample.sampleId, ...sample.targetNames])
      ].join(' '));
      return haystack.includes(search);
    });
  });

  readonly sampleOverviews = computed<DailySampleOverview[]>(() =>
    buildDailySampleOverviews(this.filteredBatches())
  );

  readonly filteredSummary = computed(() => ({
    batches: this.filteredBatches().length,
    samples: this.sampleOverviews().length
  }));

  readonly printBatches = computed(() =>
    this.printScope() === 'filtered' ? this.filteredBatches() : this.dayBatches()
  );

  readonly printSopGroups = computed<DailyPrintSopGroup[]>(() =>
    buildDailyPrintSopGroups(this.printBatches())
  );

  readonly printSummary = computed(() => {
    const samples = new Set<string>();
    this.printBatches().forEach(batch => batch.samples.forEach(sample => samples.add(sample.sampleId)));
    return {
      sops: this.printSopGroups().length,
      samples: samples.size,
      targetSets: this.printSopGroups().reduce((total, sop) => total + sop.groups.length, 0),
      targets: this.printSopGroups().reduce((total, sop) => total + sop.uniqueTargets, 0)
    };
  });

  readonly activeFilterCount = computed(() =>
    Number(this.statusFilter() !== 'all') +
    Number(this.sopFilter() !== 'all') +
    Number(Boolean(this.searchTerm().trim()))
  );

  readonly selectedDateLabel = computed(() => this.formatDate(this.selectedDate(), true));

  constructor() {
    effect(() => {
      const dates = this.availableDates();
      if (this.didInitializeDate || dates.length === 0) return;
      this.didInitializeDate = true;
      if (!dates.includes(this.selectedDate())) this.selectedDate.set(dates[0]);
    });
  }

  onDateChange(value: string): void {
    if (!isValidDateInput(value) || !this.availableDates().includes(value)) return;
    this.selectedDate.set(value);
    this.resetViewState();
  }

  moveAvailableDate(direction: 'older' | 'newer'): void {
    const dates = this.availableDates();
    const currentIndex = dates.indexOf(this.selectedDate());
    if (currentIndex < 0) return;
    const targetIndex = direction === 'older' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < dates.length) this.onDateChange(dates[targetIndex]);
  }

  goToLatestDate(): void {
    const latest = this.availableDates()[0];
    if (latest) this.onDateChange(latest);
  }

  openPrintPreview(): void {
    if (this.dayBatches().length === 0) return;
    this.printScope.set('day');
    this.printGeneratedAt.set(new Date());
    this.printPreviewOpen.set(true);
  }

  closePrintPreview(): void {
    this.printPreviewOpen.set(false);
  }

  setPrintScope(scope: 'day' | 'filtered'): void {
    this.printScope.set(scope);
  }

  printDocument(): void {
    if (this.printSopGroups().length === 0) return;
    document.body.classList.add('daily-checklist-printing');
    try {
      window.print();
    } finally {
      document.body.classList.remove('daily-checklist-printing');
    }
  }

  setViewMode(mode: DailyOverviewMode): void {
    this.viewMode.set(mode);
  }

  setStatusFilter(status: ApprovedBatchStatus | 'all'): void {
    this.statusFilter.set(status);
    this.expandedSamples.set(new Set());
    this.expandedBatches.set(new Set());
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen.update(open => !open);
  }

  clearFilters(): void {
    this.statusFilter.set('all');
    this.sopFilter.set('all');
    this.searchTerm.set('');
  }

  toggleSample(sampleId: string): void {
    this.expandedSamples.update(current => toggleSetValue(current, sampleId));
  }

  toggleBatch(requestId: string): void {
    this.expandedBatches.update(current => toggleSetValue(current, requestId));
  }

  isSampleExpanded(sampleId: string): boolean {
    return this.expandedSamples().has(sampleId);
  }

  isBatchExpanded(requestId: string): boolean {
    return this.expandedBatches().has(requestId);
  }

  openBatch(requestId: string): void {
    this.router.navigate(['/results-view', requestId]);
  }

  getStatusOption(status: ApprovedBatchStatus): BatchStatusOption {
    return this.statusOptions.find(option => option.value === status) || this.statusOptions[0];
  }

  shortBatchId(requestId: string): string {
    return requestId.length > 10 ? `${requestId.slice(0, 8)}…` : requestId;
  }

  formatTimestamp(date?: Date): string {
    return date
      ? new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(date)
      : 'Không rõ thời điểm';
  }

  formatDate(value: string, includeWeekday = false): string {
    if (!isValidDateInput(value)) return value;
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: includeWeekday ? 'long' : undefined,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(year, month - 1, day));
  }

  private resetViewState(): void {
    this.clearFilters();
    this.expandedSamples.set(new Set());
    this.expandedBatches.set(new Set());
    this.mobileFiltersOpen.set(false);
  }
}

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase('vi');
}

function toggleSetValue(current: Set<string>, value: string): Set<string> {
  const next = new Set(current);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}
