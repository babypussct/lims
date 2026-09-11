import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceStandard } from '../../core/models/standard.model';
import { AuthService } from '../../core/services/auth.service';
import { PrintService } from '../../core/services/print.service';
import { StandardService } from './standard.service';
import { formatNum } from '../../shared/utils/utils';

/**
 * Detail route for Audit accounts. The route deliberately has its own view so
 * a user with only `standard_audit_view` cannot fall through to the full
 * operational standard-detail surface.
 */
@Component({
  selector: 'app-standard-audit-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-full flex-col gap-4 overflow-y-auto bg-slate-50 p-4 custom-scrollbar dark:bg-slate-900/50 md:p-6">
      <header class="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <div class="min-w-0">
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-300">
              <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
              Audit · chỉ xem
            </span>
          </div>
          <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 md:text-2xl">Chi tiết chất chuẩn</h1>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Chỉ hiển thị 10 trường được phê duyệt; có thể mở CoA nếu chất chuẩn đã được đính kèm tài liệu.</p>
        </div>
        <button type="button" (click)="goBack()" class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-fuchsia-300 hover:text-fuchsia-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-fuchsia-700 dark:hover:text-fuchsia-300">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          Quay lại danh sách
        </button>
      </header>

      @if (isLoading()) {
        <div class="flex min-h-56 items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white text-xs font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
          <i class="fa-solid fa-circle-notch animate-spin" aria-hidden="true"></i>
          Đang đọc dữ liệu từ cache hiện tại...
        </div>
      } @else if (notFound() || !standard()) {
        <div class="flex min-h-56 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white text-center dark:border-slate-700 dark:bg-slate-800">
          <i class="fa-solid fa-flask-vial text-2xl text-slate-300 dark:text-slate-600" aria-hidden="true"></i>
          <p class="text-sm font-bold text-slate-600 dark:text-slate-300">Không tìm thấy chất chuẩn</p>
          <button type="button" (click)="goBack()" class="mt-2 rounded-xl bg-fuchsia-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-fuchsia-700 active:scale-95">Quay lại danh sách</button>
        </div>
      } @else {
        @if (standard(); as item) {
          <section class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-6" aria-labelledby="standard-audit-fields-title">
          <h2 id="standard-audit-fields-title" class="sr-only">Thông tin chất chuẩn được phép xem</h2>
          @if (item.certificate_ref) {
            <div class="mb-4 flex justify-end">
              <button type="button" (click)="openCoaPreview(item.certificate_ref)" class="inline-flex h-9 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-black text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 active:scale-95 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:focus:ring-red-900/40">
                <i class="fa-solid fa-file-pdf" aria-hidden="true"></i>
                Xem CoA
              </button>
            </div>
          }
          <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Tên chuẩn</dt>
              <dd class="mt-1 break-words text-sm font-bold text-slate-700 dark:text-slate-200">{{ item.name || '—' }}</dd>
            </div>
            <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Khối lượng chai</dt>
              <dd class="mt-1 font-mono text-sm text-slate-700 dark:text-slate-200">{{ formatNum(item.initial_amount) }}</dd>
            </div>
            <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Quy cách</dt>
              <dd class="mt-1 text-sm text-slate-700 dark:text-slate-200">{{ item.unit || '—' }}</dd>
            </div>
            <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Mã số sản phẩm</dt>
              <dd class="mt-1 break-words font-mono text-sm text-slate-700 dark:text-slate-200">{{ item.product_code || '—' }}</dd>
            </div>
            <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Số lô</dt>
              <dd class="mt-1 font-mono text-sm text-slate-700 dark:text-slate-200">{{ item.lot_number || '—' }}</dd>
            </div>
            <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Hãng</dt>
              <dd class="mt-1 break-words text-sm text-slate-700 dark:text-slate-200">{{ item.manufacturer || '—' }}</dd>
            </div>
            <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">CAS Number</dt>
              <dd class="mt-1 font-mono text-sm text-slate-700 dark:text-slate-200">{{ item.cas_number || '—' }}</dd>
            </div>
            <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Hạn sử dụng</dt>
              <dd class="mt-1 text-sm text-slate-700 dark:text-slate-200">{{ (item.expiry_date | date: 'dd/MM/yyyy') || '—' }}</dd>
            </div>
            <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
              <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Điều kiện bảo quản</dt>
              <dd class="mt-1 break-words text-sm text-slate-700 dark:text-slate-200">{{ item.storage_condition || '—' }}</dd>
            </div>
            <div class="rounded-xl border border-fuchsia-100 bg-fuchsia-50/60 p-3 dark:border-fuchsia-800/50 dark:bg-fuchsia-900/10">
              <dt class="text-[10px] font-black uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-300">Số nhận diện</dt>
              <dd class="mt-1 font-mono text-sm font-bold text-fuchsia-700 dark:text-fuchsia-200">{{ item.internal_id || '—' }}</dd>
            </div>
          </dl>
          </section>
        }
      }
    </div>
  `,
})
export class StandardAuditDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly standardService = inject(StandardService);
  private readonly auth = inject(AuthService);
  private readonly printService = inject(PrintService);

  readonly standard = signal<ReferenceStandard | null>(null);
  readonly isLoading = signal(true);
  readonly notFound = signal(false);
  readonly formatNum = formatNum;

  ngOnInit(): void {
    // Keep the route defensive if a future navigation path reaches this
    // component without the dedicated permission guard.
    if (!this.auth.canViewStandardAudit() && this.auth.currentUser()?.role !== 'manager') {
      this.goBack();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      this.notFound.set(true);
      return;
    }

    void this.loadStandard(id);
  }

  private async loadStandard(id: string): Promise<void> {
    try {
      const standard = await this.standardService.getStandardById(id);
      if (!standard || standard._isDeleted || standard.status === 'DELETED') {
        this.notFound.set(true);
      } else {
        this.standard.set(standard);
      }
    } catch (error) {
      console.warn('[Standards Audit] Không tải được chi tiết chất chuẩn:', error);
      this.notFound.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack(): void {
    void this.router.navigate(['/standards']);
  }

  openCoaPreview(url: string | undefined): void {
    if (!url) return;
    this.printService.openCoaPreview(url, 'Chứng chỉ chất lượng (CoA)');
  }
}
