import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { PrintService } from '../../../core/services/print.service';
import { formatNum } from '../../../shared/utils/utils';

export type StandardAuditSort = 'name_asc' | 'name_desc' | 'expiry_asc' | 'expiry_desc' | 'manufacturer' | 'internal_id';

/**
 * Read-only surface for the dedicated standard-audit permission.
 *
 * This component intentionally renders a whitelist of fields plus the
 * explicitly permitted CoA preview action. It reuses the parent list/cache
 * and does not create a projection, collection, or storage entry of its own.
 */
@Component({
  selector: 'app-standards-audit-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="flex h-full min-h-0 flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-slate-800 dark:shadow-none md:p-6" aria-labelledby="standards-audit-title">
      <header class="flex shrink-0 flex-col gap-4 border-b border-slate-100 pb-4 dark:border-slate-700 md:flex-row md:items-center md:justify-between">
        <div class="min-w-0">
          <div class="mb-1 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-300">
              <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
              Audit · chỉ xem
            </span>
            <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">{{ totalCount() }} chuẩn</span>
          </div>
          <h1 id="standards-audit-title" class="truncate text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 md:text-2xl">Chất chuẩn đối chiếu</h1>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Chỉ hiển thị các trường được phê duyệt cho kiểm tra Audit.</p>
        </div>

        <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          <label class="relative min-w-0 flex-1 sm:w-72" for="standards-audit-search">
            <span class="sr-only">Tìm trong dữ liệu Audit</span>
            <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" aria-hidden="true"></i>
            <input
              id="standards-audit-search"
              type="search"
              [value]="searchTerm()"
              (input)="searchTermChange.emit(($any($event.target)).value)"
              placeholder="Tìm tên, mã, lô, CAS..."
              class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:border-fuchsia-500 dark:focus:ring-fuchsia-900/30">
          </label>
          <label class="sr-only" for="standards-audit-sort">Sắp xếp Audit</label>
          <select
            id="standards-audit-sort"
            [value]="sortOption()"
            (change)="sortOptionChange.emit(($any($event.target)).value)"
            class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:focus:border-fuchsia-500">
            <option value="name_asc">Tên A → Z</option>
            <option value="name_desc">Tên Z → A</option>
            <option value="expiry_asc">Hạn dùng tăng dần</option>
            <option value="expiry_desc">Hạn dùng giảm dần</option>
            <option value="manufacturer">Hãng</option>
            <option value="internal_id">Số nhận diện</option>
          </select>
        </div>
      </header>

      <div class="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-100 bg-slate-50/30 custom-scrollbar dark:border-slate-700 dark:bg-slate-900/30" role="region" aria-label="Bảng chất chuẩn chế độ Audit" tabindex="0">
        @if (isLoading() && items().length === 0) {
          <div class="flex min-h-48 items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <i class="fa-solid fa-circle-notch animate-spin" aria-hidden="true"></i>
            Đang đồng bộ dữ liệu chất chuẩn...
          </div>
        } @else if (items().length === 0) {
          <div class="flex min-h-48 flex-col items-center justify-center gap-2 px-6 text-center">
            <i class="fa-solid fa-magnifying-glass text-2xl text-slate-300 dark:text-slate-600" aria-hidden="true"></i>
            <p class="text-sm font-bold text-slate-600 dark:text-slate-300">Không có chất chuẩn phù hợp</p>
            <p class="text-xs text-slate-400">Thử thay đổi từ khóa tìm kiếm.</p>
          </div>
        } @else {
          <table class="min-w-[1480px] w-full border-collapse text-left text-xs">
            <caption class="sr-only">Danh sách chất chuẩn với 10 trường được phép xem trong chế độ Audit</caption>
            <thead class="sticky top-0 z-10 bg-slate-100/95 text-[10px] font-black uppercase tracking-wider text-slate-500 backdrop-blur dark:bg-slate-800/95 dark:text-slate-400">
              <tr>
                <th class="whitespace-nowrap px-3 py-3">Tên chuẩn</th>
                <th class="whitespace-nowrap px-3 py-3">Khối lượng chai</th>
                <th class="whitespace-nowrap px-3 py-3">Quy cách</th>
                <th class="whitespace-nowrap px-3 py-3">Mã số sản phẩm</th>
                <th class="whitespace-nowrap px-3 py-3">Số lô</th>
                <th class="whitespace-nowrap px-3 py-3">Hãng</th>
                <th class="whitespace-nowrap px-3 py-3">CAS Number</th>
                <th class="whitespace-nowrap px-3 py-3">Hạn sử dụng</th>
                <th class="whitespace-nowrap px-3 py-3">Điều kiện bảo quản</th>
                <th class="whitespace-nowrap px-3 py-3">Số nhận diện</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/70">
              @for (standard of items(); track standard.id) {
                <tr
                  class="cursor-pointer bg-white transition-colors hover:bg-fuchsia-50/60 focus-within:bg-fuchsia-50/60 dark:bg-slate-800 dark:hover:bg-fuchsia-900/10 dark:focus-within:bg-fuchsia-900/10"
                  tabindex="0"
                  (click)="navigateToDetail.emit(standard)"
                  (keydown.enter)="navigateToDetail.emit(standard)"
                  (keydown.space)="$event.preventDefault(); navigateToDetail.emit(standard)">
                  <td class="max-w-[260px] px-3 py-3 font-bold text-slate-700 dark:text-slate-200" [title]="standard.name">
                    <div class="flex min-w-0 items-center gap-2">
                      <span class="min-w-0 truncate">{{ standard.name || '—' }}</span>
                      @if (standard.certificate_ref) {
                        <button
                          type="button"
                          class="inline-flex h-7 shrink-0 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 text-[10px] font-black text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 active:scale-95 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:focus:ring-red-900/40"
                          title="Xem CoA"
                          aria-label="Xem CoA"
                          (click)="openCoaPreview(standard.certificate_ref, $event)"
                          (keydown)="$event.stopPropagation()">
                          <i class="fa-solid fa-file-pdf" aria-hidden="true"></i>
                          <span>CoA</span>
                        </button>
                      }
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-3 font-mono text-slate-600 dark:text-slate-300">{{ formatNum(standard.initial_amount) }}</td>
                  <td class="whitespace-nowrap px-3 py-3 text-slate-600 dark:text-slate-300">{{ standard.unit || '—' }}</td>
                  <td class="whitespace-nowrap px-3 py-3 font-mono text-slate-600 dark:text-slate-300">{{ standard.product_code || '—' }}</td>
                  <td class="whitespace-nowrap px-3 py-3 font-mono text-slate-600 dark:text-slate-300">{{ standard.lot_number || '—' }}</td>
                  <td class="max-w-[220px] truncate px-3 py-3 text-slate-600 dark:text-slate-300" [title]="standard.manufacturer || ''">{{ standard.manufacturer || '—' }}</td>
                  <td class="whitespace-nowrap px-3 py-3 font-mono text-slate-600 dark:text-slate-300">{{ standard.cas_number || '—' }}</td>
                  <td class="whitespace-nowrap px-3 py-3 text-slate-600 dark:text-slate-300">{{ (standard.expiry_date | date: 'dd/MM/yyyy') || '—' }}</td>
                  <td class="max-w-[220px] truncate px-3 py-3 text-slate-600 dark:text-slate-300" [title]="standard.storage_condition || ''">{{ standard.storage_condition || '—' }}</td>
                  <td class="whitespace-nowrap px-3 py-3 font-mono font-bold text-fuchsia-700 dark:text-fuchsia-300">{{ standard.internal_id || '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      @if (hasMore() && !isLoading()) {
        <div class="shrink-0 text-center">
          <button type="button" (click)="loadMore.emit()" class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm transition hover:border-fuchsia-300 hover:text-fuchsia-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-fuchsia-700 dark:hover:text-fuchsia-300">
            Xem thêm
          </button>
        </div>
      }
    </section>
  `,
})
export class StandardsAuditViewComponent {
  private readonly printService = inject(PrintService);

  readonly items = input.required<ReferenceStandard[]>();
  readonly totalCount = input.required<number>();
  readonly isLoading = input(false);
  readonly hasMore = input(false);
  readonly searchTerm = input('');
  readonly sortOption = input<StandardAuditSort>('name_asc');

  readonly searchTermChange = output<string>();
  readonly sortOptionChange = output<StandardAuditSort>();
  readonly navigateToDetail = output<ReferenceStandard>();
  readonly loadMore = output<void>();

  readonly formatNum = formatNum;

  openCoaPreview(url: string | undefined, event: Event): void {
    event.stopPropagation();
    if (!url) return;
    this.printService.openCoaPreview(url, 'Chứng chỉ chất lượng (CoA)');
  }
}
