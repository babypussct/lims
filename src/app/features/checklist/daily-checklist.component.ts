import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
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
      @page { size: A4 landscape; margin: 6mm; }

      /* Vô hiệu hóa khóa cứng kích thước dọc của index.html */
      body.daily-checklist-printing,
      body.daily-checklist-printing html {
        width: auto !important;
        height: auto !important;
        background: white !important;
        overflow: visible !important;
      }

      /* Ẩn ứng dụng gốc khi in, chỉ hiện print-container */
      body.daily-checklist-printing app-root { display: none !important; }
      
      body.daily-checklist-printing #print-container {
        display: block !important;
        position: relative !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
        z-index: auto !important;
        background: white !important;
      }

      body.daily-checklist-printing #print-container * {
        visibility: visible !important;
      }

      /* Ẩn các nút bấm, bộ lọc khi in */
      body.daily-checklist-printing #print-container .cl-screen-only { display: none !important; }
      body.daily-checklist-printing #print-container .cl-print-only { display: flex !important; }

      /* Reset Page Shell và container cuộn của bản in (QUAN TRỌNG: Sửa lỗi 2 trang in đầu bị trắng) */
      body.daily-checklist-printing #print-container .cl-page-shell,
      body.daily-checklist-printing #print-container .cl-board-scroll {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      /* Thiết lập Header tài liệu thu nhỏ gọn gàng để tiết kiệm giấy */
      body.daily-checklist-printing #print-container .cl-doc-header {
        background: white !important;
        border-bottom: 2px solid #cbd5e1 !important;
        margin-bottom: 12px !important;
        display: block !important;
      }

      body.daily-checklist-printing #print-container .cl-doc-header > div {
        padding: 8px 12px !important;
        gap: 12px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }

      body.daily-checklist-printing #print-container .cl-doc-header h2 {
        font-size: 18px !important;
        font-weight: 900 !important;
        margin: 0 !important;
      }

      body.daily-checklist-printing #print-container .cl-doc-header p {
        font-size: 11px !important;
        margin: 2px 0 0 0 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-stats-grid {
        display: flex !important;
        gap: 8px !important;
      }

      body.daily-checklist-printing #print-container .cl-print-stats-grid > div {
        padding: 4px 8px !important;
        border-radius: 8px !important;
        border: 1px solid #e2e8f0 !important;
        background: #f8fafc !important;
        text-align: center !important;
        min-width: 60px !important;
      }

      body.daily-checklist-printing #print-container .cl-print-stats-grid > div > div:first-child {
        font-size: 14px !important;
        font-weight: 800 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-stats-grid > div > div:last-child {
        font-size: 8px !important;
        font-weight: 700 !important;
      }

      /* Khối bao ngoài của bản in */
      body.daily-checklist-printing #print-container .cl-board-root {
        width: 100% !important;
        max-width: none !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        display: block !important;
        background: white !important;
      }

      /* Thiết lập block dọc 100% cho container body in ấn */
      body.daily-checklist-printing #print-container .cl-board-body {
        display: block !important;
        width: 100% !important;
        padding: 8px 10px !important;
      }

      /* CẤU HÌNH SỐ CỘT KANBAN MASONRY */
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-auto .cl-board-body {
        column-count: 3 !important;
        column-gap: 12px !important;
      }
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-1 .cl-board-body {
        column-count: 1 !important;
      }
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-2 .cl-board-body {
        column-count: 2 !important;
        column-gap: 12px !important;
      }
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-3 .cl-board-body {
        column-count: 3 !important;
        column-gap: 12px !important;
      }
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-4 .cl-board-body {
        column-count: 4 !important;
        column-gap: 8px !important;
      }

      /* SOP Card dạng block siêu nén, ôm khít nội dung (QUAN TRỌNG: Sửa lỗi khoảng trắng lớn đầu trang của Chrome) */
      body.daily-checklist-printing #print-container .cl-sop-section {
        display: block !important;
        width: 100% !important;
        margin-bottom: 8px !important;
        break-inside: avoid !important;
        -webkit-column-break-inside: avoid !important;
        page-break-inside: avoid !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 8px !important;
        background-color: #ffffff !important;
        box-shadow: none !important;
      }

      /* SOP Header trên trang in */
      body.daily-checklist-printing #print-container .cl-sop-heading {
        display: block !important;
        width: 100% !important;
        padding: 6px 8px !important;
        background-color: #f8fafc !important;
        border-bottom: 1px solid #cbd5e1 !important;
      }

      body.daily-checklist-printing #print-container .cl-sop-heading > div {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }

      body.daily-checklist-printing #print-container .cl-sop-heading h3 {
        font-weight: 800 !important;
        color: #0f172a !important;
      }

      body.daily-checklist-printing #print-container .cl-sop-heading span {
        font-weight: 700 !important;
        color: #475569 !important;
      }

      /* Nhóm mẫu và chỉ tiêu */
      body.daily-checklist-printing #print-container .cl-work-group {
        display: block !important;
        width: 100% !important;
        padding: 6px 8px !important;
      }

      body.daily-checklist-printing #print-container .cl-work-group div.font-mono {
        line-height: 1.3 !important;
        color: #1e293b !important;
        margin-bottom: 4px !important;
      }

      body.daily-checklist-printing #print-container .cl-work-group div.font-mono span.font-sans {
        color: #64748b !important;
      }

      /* Thẻ badge chỉ tiêu trên trang in */
      body.daily-checklist-printing #print-container .cl-work-group .flex-wrap {
        display: block !important;
        width: 100% !important;
        margin-top: 4px !important;
      }

      body.daily-checklist-printing #print-container .cl-work-group .flex-wrap span {
        display: inline-block !important;
        background-color: #f1f5f9 !important;
        border: 1px solid #cbd5e1 !important;
        color: #0f172a !important;
        padding: 1px 4px !important;
        margin: 1px 3px 1px 0 !important;
        border-radius: 4px !important;
        font-weight: 700 !important;
      }

      /* CẤU HÌNH CỠ CHỮ IN */
      body.daily-checklist-printing #print-container .cl-board-root.print-text-auto .cl-sop-heading h3 { font-size: 11.5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-auto .cl-work-group { font-size: 9.5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-auto .cl-work-group .flex-wrap span { font-size: 8.5px !important; }

      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-sop-heading h3 { font-size: 10px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-work-group { font-size: 8px !important; padding: 4px 6px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-work-group .flex-wrap span { font-size: 7.5px !important; padding: 0.5px 3px !important; }

      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-sop-heading h3 { font-size: 13px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-work-group { font-size: 10.5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-work-group .flex-wrap span { font-size: 9.5px !important; }

      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-sop-heading h3 { font-size: 15px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-work-group { font-size: 12px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-work-group .flex-wrap span { font-size: 11px !important; }

      /* CẤU HÌNH ẨN BẢNG THỐNG KÊ */
      body.daily-checklist-printing #print-container .cl-board-root.print-stats-hide .cl-doc-header .cl-print-stats-grid {
        display: none !important;
      }

      /* Document footer (print-only) */
      body.daily-checklist-printing #print-container .cl-doc-footer {
        padding: 6px 12px !important;
        font-size: 8px !important;
        margin-top: 8px !important;
        display: flex !important;
      }
    }
  `]
})
export class DailyChecklistComponent {
  @Input() embedded = false;
  readonly state = inject(StateService);

  readonly selectedDate = signal(toLocalDateInputValue());
  readonly sopFilter = signal('all');
  readonly searchTerm = signal('');
  readonly printGeneratedAt = signal(new Date());

  // Print Configuration Signals
  readonly showPrintSettings = signal(false);
  readonly printCols = signal<string | number>('auto');
  readonly printFontSize = signal<string>('auto');
  readonly printShowStats = signal(true);
  readonly printGroupSamples = signal(true);

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
    this.showPrintSettings.set(true);
  }

  executePrint(): void {
    this.showPrintSettings.set(false);
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

    // Gán class chỉ thị in vào body trước khi clone để CSS ăn theo
    document.body.classList.add('daily-checklist-printing');
    
    // SỬA LỖI TRANG TRẮNG: Gỡ bỏ khóa cứng kích thước 210x297mm của thẻ html trong index.html
    // (CSS class binding không thể target trực tiếp thẻ html outside component ViewEncapsulation)
    document.documentElement.style.setProperty('height', 'auto', 'important');
    document.documentElement.style.setProperty('width', 'auto', 'important');
    document.body.style.setProperty('height', 'auto', 'important');
    document.body.style.setProperty('width', 'auto', 'important');
    document.body.style.setProperty('overflow', 'visible', 'important');

    // Đợi góc render của Angular cập nhật lại dải mẫu nếu tắt/bật gom mẫu
    setTimeout(() => {
      const clone = source.cloneNode(true) as HTMLElement;
      
      // Khử animation và transform để tránh phá vỡ thuật toán phân trang CSS Columns của trình duyệt
      clone.style.animation = 'none';
      clone.style.transform = 'none';
      const animatedElements = clone.querySelectorAll('.cl-board-enter, .animate-fade-in');
      animatedElements.forEach((el: any) => {
        el.style.animation = 'none';
        el.style.transform = 'none';
      });

      const boardRoot = clone.querySelector('.cl-board-root');
      if (boardRoot) {
        // Cấu hình số cột
        if (this.printCols() !== 'auto') {
          boardRoot.classList.add(`print-layout-${this.printCols()}`);
        } else {
          boardRoot.classList.add('print-layout-auto');
        }

        // Cấu hình cỡ chữ
        if (this.printFontSize() !== 'auto') {
          boardRoot.classList.add(`print-text-${this.printFontSize()}`);
        } else {
          boardRoot.classList.add('print-text-auto');
        }

        // Cấu hình ẩn thống kê
        if (!this.printShowStats()) {
          boardRoot.classList.add('print-stats-hide');
        }
      }

      printContainer.innerHTML = '';
      printContainer.appendChild(clone);

      const cleanupPrintMode = () => {
        document.body.classList.remove('daily-checklist-printing');
        document.documentElement.style.removeProperty('height');
        document.documentElement.style.removeProperty('width');
        document.body.style.removeProperty('height');
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('overflow');
        printContainer.innerHTML = '';
      };

      window.addEventListener('afterprint', cleanupPrintMode, { once: true });
      window.print();
    }, 120);
  }

  joinWithCommas(ids: string[]): string {
    return ids.join(', ');
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
