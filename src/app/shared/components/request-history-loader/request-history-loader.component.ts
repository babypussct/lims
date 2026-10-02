import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { RequestHistoryPageService } from '../../../core/services/request-history-page.service';
import { AppButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-request-history-loader', standalone: true, imports: [AppButtonComponent],
  template: `
    @if (enabled()) {
      <div class="flex flex-wrap items-center gap-3 py-2 text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
        @if (error()) { <span role="alert" class="text-red-600">{{error()}}</span> }
        @if (!complete()) {
          <span>Bộ lọc áp dụng trên các mẻ đã tải. Tải thêm để xem các mẻ còn lại trong khoảng ngày.</span>
          <app-button variant="secondary" size="sm" [loading]="loading()" (click)="load(true)">Tải thêm mẻ</app-button>
        }
        <app-button variant="ghost" size="sm" [disabled]="loading()" (click)="load(false, true)">Tải lại danh sách</app-button>
      </div>
    }
  `,
})
export class RequestHistoryLoaderComponent {
  readonly startDate = input.required<string>();
  readonly endDate = input.required<string>();
  readonly enabled = input(true);
  readonly loading = signal(false);
  readonly complete = signal(true);
  readonly error = signal('');
  private readonly history = inject(RequestHistoryPageService);
  private readonly state = inject(StateService);
  private revision = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.revision++);
    effect(() => { this.startDate(); this.endDate(); if (this.enabled()) void this.load(); else this.revision++; });
  }

  async load(more = false, refresh = false): Promise<void> {
    const revision = ++this.revision;
    this.loading.set(true); this.error.set('');
    try {
      const page = await this.history.load(this.startDate(), this.endDate(), more, refresh);
      if (revision !== this.revision) return;
      this.state.mergeApprovedHistoryPage(page.items, this.startDate(), this.endDate());
      this.complete.set(page.complete);
    } catch (error) {
      if (revision === this.revision) this.error.set(error instanceof Error ? error.message : 'Không tải được danh sách mẻ.');
    } finally { if (revision === this.revision) this.loading.set(false); }
  }
}
