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
      @page { size: A4 landscape; margin: 8mm; }

      html, body { background: white !important; }
      body.daily-checklist-printing {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body.daily-checklist-printing #print-container,
      body.daily-checklist-printing #print-container * {
        visibility: visible !important;
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
      body.daily-checklist-printing .daily-document-header > div {
        padding: 16px 24px !important;
        gap: 16px !important;
      }
      body.daily-checklist-printing .daily-document-header h2 {
        font-size: 24px !important;
        margin-top: 4px !important;
      }
      body.daily-checklist-printing .daily-document-header p {
        font-size: 13px !important;
        margin-top: 4px !important;
      }
      body.daily-checklist-printing .daily-document-header .grid > div {
        padding: 8px 12px !important;
        border-radius: 12px !important;
      }
      body.daily-checklist-printing .daily-document-header .grid > div > div:first-child {
        font-size: 18px !important;
      }
      body.daily-checklist-printing .daily-document-header .grid > div > div:last-child {
        font-size: 9px !important;
        margin-top: 2px !important;
      }
      body.daily-checklist-printing .daily-board-root > div {
        padding: 20px 24px !important;
      }
      body.daily-checklist-printing .daily-board-root > div > * + * {
        margin-top: 20px !important;
      }
      body.daily-checklist-printing .daily-sop-section {
        break-inside: auto;
      }
      body.daily-checklist-printing .daily-sop-heading {
        break-after: avoid;
        page-break-after: avoid;
        margin-bottom: 12px !important;
        gap: 12px !important;
      }
      body.daily-checklist-printing .daily-sop-heading > div:first-child {
        width: 32px !important;
        height: 32px !important;
        font-size: 13px !important;
        border-radius: 8px !important;
      }
      body.daily-checklist-printing .daily-sop-heading h3 {
        font-size: 16px !important;
      }
      body.daily-checklist-printing .daily-sop-heading p {
        font-size: 11px !important;
        margin-top: 2px !important;
      }
      body.daily-checklist-printing .daily-sop-section > div {
        padding-left: 44px !important;
      }
      body.daily-checklist-printing .daily-sop-section > div > * + * {
        margin-top: 12px !important;
      }
      body.daily-checklist-printing .daily-work-group {
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: none !important;
        font-size: 13px !important;
      }
      body.daily-checklist-printing .daily-work-group > div:first-child:not(.grid) {
        padding: 6px 16px !important;
      }
      body.daily-checklist-printing .daily-work-group > div.grid {
        grid-template-columns: 240px 1fr !important;
        display: grid !important;
      }
      body.daily-checklist-printing .daily-work-group > div.grid > div {
        padding: 12px 16px !important;
        border-bottom: 0 !important;
        border-right: 1px solid #e2e8f0 !important;
      }
      body.daily-checklist-printing .daily-work-group > div.grid > div:last-child {
        border-right: 0 !important;
      }
      body.daily-checklist-printing .daily-work-group div.font-mono {
        font-size: 13px !important;
        line-height: 1.5 !important;
      }
      body.daily-checklist-printing .daily-target-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }
      body.daily-checklist-printing .daily-target-grid > div {
        padding: 4px 8px !important;
        gap: 6px !important;
        border-radius: 6px !important;
      }
      body.daily-checklist-printing .daily-target-grid > div > span:first-child {
        width: 18px !important;
        height: 18px !important;
        font-size: 10px !important;
        border-radius: 4px !important;
      }
      body.daily-checklist-printing .daily-target-grid > div > span:last-child {
        font-size: 11px !important;
        line-height: 1.4 !important;
      }
      body.daily-checklist-printing .daily-document-footer {
        display: flex !important;
        padding: 10px 16px !important;
        font-size: 10px !important;
      }

      /* ========================================================================= */
      /* CHẾ ĐỘ IN THÔNG MINH - COMPACT MODE (Áp dụng khi dữ liệu lớn)            */
      /* ========================================================================= */
      body.daily-checklist-printing .daily-board-root.print-compact .daily-document-header > div {
        padding: 8px 12px !important;
        gap: 8px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-document-header h2 {
        font-size: 18px !important;
        margin-top: 2px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-document-header p {
        font-size: 10px !important;
        margin-top: 1px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-document-header .grid > div {
        padding: 3px 5px !important;
        border-radius: 6px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-document-header .grid > div > div:first-child {
        font-size: 13px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-document-header .grid > div > div:last-child {
        font-size: 8px !important;
        margin-top: 0px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact > div {
        padding: 10px 14px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact > div > * + * {
        margin-top: 8px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-sop-heading {
        margin-bottom: 4px !important;
        gap: 6px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-sop-heading > div:first-child {
        width: 20px !important;
        height: 20px !important;
        font-size: 10px !important;
        border-radius: 4px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-sop-heading h3 {
        font-size: 12px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-sop-heading p {
        font-size: 9px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-sop-section > div {
        padding-left: 26px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-sop-section > div > * + * {
        margin-top: 6px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-work-group {
        font-size: 10px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-work-group > div:first-child:not(.grid) {
        padding: 3px 8px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-work-group > div.grid {
        grid-template-columns: 180px 1fr !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-work-group > div.grid > div {
        padding: 6px 10px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-work-group div.font-mono {
        font-size: 10px !important;
        line-height: 1.3 !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-target-grid {
        gap: 4px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-target-grid > div {
        padding: 2px 5px !important;
        gap: 3px !important;
        border-radius: 3px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-target-grid > div > span:first-child {
        width: 14px !important;
        height: 14px !important;
        font-size: 8px !important;
        border-radius: 2px !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-target-grid > div > span:last-child {
        font-size: 9px !important;
        line-height: 1.2 !important;
      }
      body.daily-checklist-printing .daily-board-root.print-compact .daily-document-footer {
        padding: 4px 10px !important;
        font-size: 8px !important;
      }
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

    const printContainer = document.getElementById('print-container');
    if (!printContainer) {
      window.print();
      return;
    }

    const source = document.querySelector('.daily-page-shell');
    if (!source) {
      console.warn('daily-page-shell not found');
      return;
    }

    const clone = source.cloneNode(true) as HTMLElement;
    printContainer.innerHTML = '';
    printContainer.appendChild(clone);

    const cleanupPrintMode = (): void => {
      document.body.classList.remove('daily-checklist-printing');
      printContainer.innerHTML = '';
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
