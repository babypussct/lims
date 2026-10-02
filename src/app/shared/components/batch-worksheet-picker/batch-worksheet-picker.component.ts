import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Request } from '../../../core/models/request.model';
import { BatchWorksheetService } from '../../../core/services/batch-worksheet.service';
import { worksheetReference } from '../../utils/batch-worksheet';
import { AppButtonComponent } from '../ui/button/button.component';
import { AppModalShellComponent } from '../ui/modal-shell/modal-shell.component';

@Component({
  selector: 'app-batch-worksheet-picker', standalone: true,
  imports: [AppButtonComponent, AppModalShellComponent],
  template: `
    @if (worksheets.canRead()) {
      <app-button variant="secondary" size="sm" [disabled]="!available().length || worksheets.loading()" (click)="open()">
        <i class="fa-solid fa-print" aria-hidden="true"></i> In nhiều phiếu
      </app-button>
    }
    @if (isOpen()) {
      <app-modal-shell title="In phiếu phân tích" description="Chọn các mẻ trong danh sách đang lọc. Phiếu được mở theo thứ tự dưới đây."
        [closeDisabled]="worksheets.loading()" (closed)="isOpen.set(false)">
        <div modalBody class="space-y-3">
          <label class="flex min-h-11 items-center gap-3 text-sm font-semibold">
            <input type="checkbox" [checked]="allSelected()" (change)="toggleAll()" [disabled]="worksheets.loading()" />
            Chọn tất cả {{available().length}} mẻ trong danh sách
          </label>
          <div class="max-h-[50vh] overflow-y-auto space-y-2">
            @for (request of available(); track request.id) {
              <label class="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <input class="mt-1" type="checkbox" [checked]="selected().has(request.id)"
                  [disabled]="worksheets.loading()" (change)="toggle(request.id)" [attr.aria-label]="'Chọn mẻ ' + request.id" />
                <span class="min-w-0 text-sm"><span class="block font-semibold break-words">{{request.sopName}}</span>
                  <span class="block break-all text-xs text-slate-500">{{request.inputs?.['batchCode'] || request.id}} · {{request.analysisDate || 'Hồ sơ lịch sử'}}</span>
                </span>
              </label>
            }
          </div>
        </div>
        <div modalFooter class="flex flex-wrap items-center justify-between gap-3">
          <span class="text-sm text-slate-500">Đã chọn {{selected().size}} mẻ</span>
          <app-button [loading]="worksheets.loading()" [disabled]="!selected().size" (click)="printSelected()">
            <i class="fa-solid fa-print" aria-hidden="true"></i> Xem & in phiếu đã chọn
          </app-button>
        </div>
      </app-modal-shell>
    }
  `,
})
export class BatchWorksheetPickerComponent {
  readonly requests = input.required<readonly Request[]>();
  readonly worksheets = inject(BatchWorksheetService);
  readonly isOpen = signal(false);
  readonly selected = signal(new Set<string>());
  readonly available = computed(() => this.requests().filter(request => !request.isVirtualMaster && !request._isDeleted
    && ['approved', 'draft', 'completed'].includes(request.status)));
  readonly allSelected = computed(() => !!this.available().length && this.available().every(request => this.selected().has(request.id)));

  constructor() {
    effect(() => {
      const ids = new Set(this.available().map(request => request.id));
      this.selected.update(selected => new Set([...selected].filter(id => ids.has(id))));
    });
  }

  open(): void { this.selected.set(new Set()); this.isOpen.set(true); }
  toggle(id: string): void {
    this.selected.update(selected => { const next = new Set(selected); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }
  toggleAll(): void { this.selected.set(this.allSelected() ? new Set() : new Set(this.available().map(request => request.id))); }
  async printSelected(): Promise<void> {
    const references = this.available().filter(request => this.selected().has(request.id)).map(worksheetReference);
    if (await this.worksheets.open(references)) this.isOpen.set(false);
  }
}
