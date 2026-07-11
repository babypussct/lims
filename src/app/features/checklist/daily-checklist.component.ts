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

    /* ============================================================ */
    /* SCREEN STYLES                                                */
    /* ============================================================ */

    @keyframes cl-enter-anim {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cl-board-enter { animation: cl-enter-anim 0.28s ease-out both; }

    /* Document article wrapper – không border/shadow trên màn hình */
    .cl-board-root {
      width: 100%;
      max-width: none;
      margin-inline: auto;
    }

    /* Target chips grid layout */
    .cl-target-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
    }
    @media (min-width: 640px) {
      .cl-target-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 1024px) {
      .cl-target-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }

    /* Work group – tránh ngắt trang */
    .cl-work-group { break-inside: avoid; page-break-inside: avoid; }

    /* SOP heading – text wrap */
    .cl-sop-heading h3 { overflow-wrap: anywhere; }

    /* Print-only elements: ẩn hoàn toàn trên màn hình */
    .cl-print-only { display: none !important; }

    @media (prefers-reduced-motion: reduce) {
      .cl-board-enter { animation: none; }
    }

    /* ============================================================ */
    /* PRINT STYLES                                                 */
    /* ============================================================ */
    @media print {
      @page { size: A4 landscape; margin: 8mm; }

      html, body {
        width: 100% !important;
        height: auto !important;
        background: white !important;
        overflow: visible !important;
      }

      body.daily-checklist-printing {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      body.daily-checklist-printing #print-container {
        display: block !important;
        position: relative !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
        z-index: auto !important;
      }

      body.daily-checklist-printing #print-container * {
        visibility: visible !important;
      }

      /* Page shell và scroll area */
      body.daily-checklist-printing .cl-page-shell,
      body.daily-checklist-printing .cl-board-scroll {
        display: block !important;
        height: auto !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      /* Ẩn các phần chỉ dành cho màn hình */
      body.daily-checklist-printing .cl-screen-only { display: none !important; }

      /* Hiện các phần chỉ dành cho in */
      body.daily-checklist-printing .cl-print-only { display: flex !important; }

      /* Board root – thêm border/rounded khi in */
      body.daily-checklist-printing .cl-board-root {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 1px solid #bfdbfe !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        color: #0f172a !important;
      }

      /* Document header (print-only) */
      body.daily-checklist-printing .cl-doc-header {
        background: linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #eef2ff 100%) !important;
        border-color: #bfdbfe !important;
      }

      body.daily-checklist-printing .cl-doc-header > div {
        padding: 16px 24px !important;
        gap: 16px !important;
      }

      body.daily-checklist-printing .cl-doc-header h2 {
        font-size: 24px !important;
        margin-top: 4px !important;
      }

      body.daily-checklist-printing .cl-doc-header p {
        font-size: 13px !important;
        margin-top: 4px !important;
      }

      body.daily-checklist-printing .cl-print-stats-grid > div {
        padding: 8px 12px !important;
        border-radius: 12px !important;
      }

      body.daily-checklist-printing .cl-print-stats-grid > div > div:first-child {
        font-size: 18px !important;
      }

      body.daily-checklist-printing .cl-print-stats-grid > div > div:last-child {
        font-size: 9px !important;
        margin-top: 2px !important;
      }

      /* Board body (content area) */
      body.daily-checklist-printing .cl-board-body {
        padding: 20px 24px !important;
        gap: 16px !important;
      }

      body.daily-checklist-printing .cl-board-body > * + * {
        margin-top: 16px !important;
      }

      /* SOP sections */
      body.daily-checklist-printing .cl-sop-section {
        break-inside: auto;
        border-color: #e2e8f0 !important;
        border-radius: 10px !important;
      }

      body.daily-checklist-printing .cl-sop-heading {
        break-after: avoid;
        page-break-after: avoid;
        padding: 10px 16px !important;
      }

      body.daily-checklist-printing .cl-sop-heading > div:first-child {
        width: 32px !important;
        height: 32px !important;
        font-size: 13px !important;
        border-radius: 8px !important;
      }

      body.daily-checklist-printing .cl-sop-heading h3 {
        font-size: 16px !important;
      }

      body.daily-checklist-printing .cl-sop-heading p {
        font-size: 11px !important;
        margin-top: 2px !important;
      }

      /* Work groups */
      body.daily-checklist-printing .cl-work-group {
        break-inside: avoid;
        page-break-inside: avoid;
        font-size: 13px !important;
        padding: 12px 16px !important;
      }

      body.daily-checklist-printing .cl-work-group div.font-mono {
        font-size: 13px !important;
        line-height: 1.5 !important;
      }

      /* Target table printing styles */
      body.daily-checklist-printing .cl-work-group table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin-top: 8px !important;
      }

      body.daily-checklist-printing .cl-work-group th {
        font-size: 10px !important;
        border-bottom: 1px solid #cbd5e1 !important;
        padding-bottom: 6px !important;
      }

      body.daily-checklist-printing .cl-work-group td {
        font-size: 11px !important;
        padding: 6px 0 !important;
        border-bottom: 1px solid #f1f5f9 !important;
      }

      /* Document footer (print-only) */
      body.daily-checklist-printing .cl-doc-footer {
        padding: 10px 16px !important;
        font-size: 10px !important;
      }

      /* ============================================================ */
      /* CHẾ ĐỘ IN THÔNG MINH – COMPACT MODE (khi dữ liệu lớn)       */
      /* ============================================================ */
      body.daily-checklist-printing .cl-board-root.print-compact .cl-doc-header > div {
        padding: 8px 12px !important;
        gap: 8px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-doc-header h2 {
        font-size: 18px !important;
        margin-top: 2px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-doc-header p {
        font-size: 10px !important;
        margin-top: 1px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-print-stats-grid > div {
        padding: 3px 5px !important;
        border-radius: 6px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-print-stats-grid > div > div:first-child {
        font-size: 13px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-print-stats-grid > div > div:last-child {
        font-size: 8px !important;
        margin-top: 0 !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-board-body {
        padding: 10px 14px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-board-body > * + * {
        margin-top: 8px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-sop-heading {
        padding: 6px 12px !important;
        gap: 6px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-sop-heading > div:first-child {
        width: 20px !important;
        height: 20px !important;
        font-size: 10px !important;
        border-radius: 4px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-sop-heading h3 {
        font-size: 12px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-sop-heading p {
        font-size: 9px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-work-group {
        font-size: 10px !important;
        padding: 8px 12px !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-work-group div.font-mono {
        font-size: 10px !important;
        line-height: 1.3 !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-work-group td {
        font-size: 9px !important;
        padding: 4px 0 !important;
      }
      body.daily-checklist-printing .cl-board-root.print-compact .cl-doc-footer {
        padding: 4px 10px !important;
        font-size: 8px !important;
      }
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

    const source = document.querySelector('.cl-page-shell');
    if (!source) {
      console.warn('cl-page-shell not found');
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
