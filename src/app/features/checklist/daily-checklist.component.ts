import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import {
  ApprovedBatchOverview,
  ApprovedBatchStatus,
  DailyApprovedSummary,
  DailyPrintSopGroup
} from './daily-checklist.model';
import {
  buildApprovedBatchOverviews,
  buildDailyPrintSopGroups,
  getAvailableApprovedDates,
  isValidDateInput,
  toLocalDateInputValue
} from './daily-checklist.utils';

interface AvailableDateOption {
  value: string;
  label: string;
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

    @keyframes daily-board-enter {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .daily-board-enter { animation: daily-board-enter 0.28s ease-out both; }

    .daily-board-root {
      width: 100%;
      max-width: 1280px;
      margin-inline: auto;
    }

    .daily-target-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
    }

    .daily-work-group {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .daily-sop-heading h3 { overflow-wrap: anywhere; }

    @media (min-width: 640px) {
      .daily-target-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (min-width: 1024px) {
      .daily-target-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }

    @media print {
      @page { size: A4 landscape; margin: 9mm; }

      html, body { background: white !important; }
      body.daily-checklist-printing {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body.daily-checklist-printing * { visibility: hidden !important; }
      body.daily-checklist-printing app-daily-checklist,
      body.daily-checklist-printing app-daily-checklist *,
      body.daily-checklist-printing .daily-board-root,
      body.daily-checklist-printing .daily-board-root * { visibility: visible !important; }
      body.daily-checklist-printing app-daily-checklist {
        position: absolute !important;
        inset: 0 auto auto 0 !important;
        display: block !important;
        width: 100% !important;
        height: auto !important;
      }
      body.daily-checklist-printing .daily-page-shell,
      body.daily-checklist-printing .daily-board-scroll {
        display: block !important;
        height: auto !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      body.daily-checklist-printing .daily-screen-only { display: none !important; }
      body.daily-checklist-printing .daily-board-root {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        color: #0f172a !important;
      }
      body.daily-checklist-printing .daily-document-header {
        border-color: #c7d2fe !important;
      }
      body.daily-checklist-printing .daily-sop-section { break-inside: auto; }
      body.daily-checklist-printing .daily-sop-heading { break-after: avoid; page-break-after: avoid; }
      body.daily-checklist-printing .daily-work-group {
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: none !important;
      }
      body.daily-checklist-printing .daily-target-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
      body.daily-checklist-printing .daily-document-footer { display: flex !important; }
    }

    @media (prefers-reduced-motion: reduce) {
      .daily-board-enter { animation: none; }
    }
  `]
})
export class DailyChecklistComponent {
  readonly state = inject(StateService);

  readonly selectedDate = signal(toLocalDateInputValue());
  readonly sopFilter = signal('all');
  readonly searchTerm = signal('');
  readonly printGeneratedAt = signal(new Date());

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

  readonly availableDateOptions = computed<AvailableDateOption[]>(() =>
    this.availableDates().map(value => ({ value, label: this.formatDate(value) }))
  );

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

  readonly scopedBatches = computed(() => {
    const sop = this.sopFilter();
    return sop === 'all' ? this.dayBatches() : this.dayBatches().filter(batch => batch.sopId === sop);
  });

  readonly boardSopGroups = computed<DailyPrintSopGroup[]>(() => {
    const groups = buildDailyPrintSopGroups(this.scopedBatches());
    const search = normalizeSearch(this.searchTerm());
    if (!search) return groups;

    return groups
      .map(sop => {
        if (normalizeSearch(sop.sopName).includes(search)) return sop;
        const matchingGroups = sop.groups.filter(group => normalizeSearch([
          ...group.targetNames,
          ...group.sampleIds,
          group.formattedSamples
        ].join(' ')).includes(search));
        if (matchingGroups.length === 0) return null;
        return {
          ...sop,
          groups: matchingGroups,
          uniqueSamples: new Set(matchingGroups.flatMap(group => group.sampleIds)).size,
          uniqueTargets: new Set(matchingGroups.flatMap(group => group.targetIds)).size
        };
      })
      .filter((sop): sop is DailyPrintSopGroup => sop !== null);
  });

  readonly boardSummary = computed(() => {
    const sops = this.boardSopGroups();
    const samples = new Set<string>();
    const targets = new Set<string>();
    let groups = 0;
    sops.forEach(sop => {
      groups += sop.groups.length;
      sop.groups.forEach(group => {
        group.sampleIds.forEach(sample => samples.add(sample));
        group.targetIds.forEach(target => targets.add(`${sop.sopId}\u0000${target}`));
      });
    });
    return { sops: sops.length, samples: samples.size, targets: targets.size, groups };
  });

  readonly activeFilterCount = computed(() =>
    Number(this.sopFilter() !== 'all') + Number(Boolean(this.searchTerm().trim()))
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
    this.clearFilters();
  }

  moveAvailableDate(direction: 'older' | 'newer'): void {
    const dates = this.availableDates();
    const currentIndex = dates.indexOf(this.selectedDate());
    if (currentIndex < 0) return;
    const targetIndex = direction === 'older' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < dates.length) this.onDateChange(dates[targetIndex]);
  }

  clearFilters(): void {
    this.sopFilter.set('all');
    this.searchTerm.set('');
  }

  printDocument(): void {
    if (this.boardSopGroups().length === 0) return;
    this.printGeneratedAt.set(new Date());

    const cleanupPrintMode = (): void => {
      document.body.classList.remove('daily-checklist-printing');
      window.removeEventListener('afterprint', cleanupPrintMode);
    };

    document.body.classList.add('daily-checklist-printing');
    window.addEventListener('afterprint', cleanupPrintMode, { once: true });
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  }

  formatTimestamp(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
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
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}
