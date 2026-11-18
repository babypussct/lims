import { Component, Input, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GoogleDriveService } from '../../../core/services/google-drive.service';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { ReportCardProjection } from '../services/result-reports-projection';
import { defaultPrintReports, drivePdfId, duplicatePrintSamples, mergeReportPdfs, orderPrintReports } from '../services/report-bulk-print.utils';

@Component({
  selector: 'app-report-bulk-print',
  standalone: true,
  imports: [CommonModule, AppModalShellComponent],
  template: `
    <button type="button" (click)="open(true)" [disabled]="!cards.length"
      class="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold disabled:opacity-50">
      {{ label }}
    </button>
    <button type="button" (click)="open()" [disabled]="!cards.length" class="px-3 py-2 text-indigo-700 text-xs font-bold disabled:opacity-50">Chọn phiếu</button>
    @if (opened()) {
      <app-modal-shell title="In nhanh các phiếu PDF" size="lg" (closed)="close()">
        <div modalBody class="space-y-3">
          <p class="text-sm">Chọn phiếu, chuẩn bị PDF gộp rồi bấm biểu tượng In trong bản xem trước để in toàn bộ một lần.</p>
          @if (incomplete || missing().length) {
            <p role="alert" class="text-amber-700">Bộ phiếu chưa đầy đủ. {{ missing().length }} mẫu chưa nằm trong lựa chọn: {{ missing().join(', ') }}</p>
          }
          <div class="max-h-52 overflow-auto space-y-2">
            @for (card of snapshot; track $index) {
              <label class="flex items-start gap-2 border rounded-xl p-2 text-xs">
                <input type="checkbox" [checked]="chosen().includes(card)" [disabled]="busy()"
                  (change)="toggle(card)" />
                <span>{{ card.title }} · {{ card.subtitle }} · v{{ card.version }}
                  <span class="block">{{ card.publishedBy }} · {{ dateText(card.publishedAt) }} · {{ card.status || 'Hiện hành' }}</span>
                  @if (card.isStale || card.status === 'archived') { <strong class="text-amber-700">Bản cũ / cần xuất lại</strong> }
                  @if (!card.pdfUrl && !card.pdfViewUrl) { <strong class="text-red-700">Thiếu PDF</strong> }
                </span>
              </label>
            }
          </div>
          <p aria-live="polite" class="text-sm">{{ chosen().length }} PDF · {{ sampleCount() }} mẫu @if (pages()) { · {{ pages() }} trang }</p>
          @if (duplicates().length) { <p role="alert" class="text-red-700">Trùng mẫu: {{ duplicates().join(', ') }}. Bỏ chọn phiếu chồng nhau trước khi ghép.</p> }
          @if (needsAcknowledgement()) {
            <label class="flex gap-2 text-xs text-amber-700"><input type="checkbox" [checked]="acknowledged()" [disabled]="busy()" (change)="acknowledged.set(!acknowledged())" />Tôi đã kiểm tra và chủ động in bộ phiếu chưa đầy đủ hoặc bản cũ đã chọn.</label>
          }
          @if (busy()) { <p role="status">Đang chuẩn bị {{ done() }}/{{ chosen().length }} PDF…</p> }
          @if (error()) {
            <p role="alert" class="text-red-700">{{ error() }}. Có thể thử lại hoặc bỏ chọn phiếu lỗi để chuẩn bị phần còn lại.</p>
            <button type="button" (click)="authenticate()" class="text-indigo-700 underline">Xác thực lại Google Drive</button>
          }
          @if (preview()) {
            <p class="text-xs">Dùng nút In của trình xem PDF bên dưới. Bản gộp chỉ phục vụ in; chữ ký số cần đối chiếu trên PDF gốc.</p>
            <iframe [src]="preview()!" title="Xem trước và in PDF gộp" class="w-full h-[55vh] border rounded-xl"></iframe>
            <a [href]="objectUrl" download="bao-cao-gop.pdf" class="inline-block px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs">Tải PDF gộp</a>
            <a [href]="objectUrl" target="_blank" rel="noopener" class="inline-block px-3 py-2 text-indigo-700 text-xs">Mở bản xem trước trong tab mới</a>
          }
        </div>
        <div modalFooter class="flex gap-3">
          @if (busy()) { <button type="button" (click)="cancel()">Hủy chuẩn bị</button> }
          @else { <button type="button" (click)="prepare()" [disabled]="!canPrepare()" class="px-3 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50">{{ error() ? 'Thử lại' : 'Chuẩn bị PDF gộp' }}</button> }
          <button type="button" (click)="close()">Đóng</button>
        </div>
      </app-modal-shell>
    }
  `,
})
export class ReportBulkPrintComponent implements OnDestroy {
  @Input() cards: ReportCardProjection[] = [];
  @Input() samples: string[] = [];
  @Input() label = 'In nhanh tất cả phiếu';
  @Input() incomplete = false;
  private drive = inject(GoogleDriveService);
  private sanitizer = inject(DomSanitizer);
  snapshot: ReportCardProjection[] = [];
  private sampleSnapshot: string[] = [];
  opened = signal(false);
  chosen = signal<ReportCardProjection[]>([]);
  busy = signal(false);
  done = signal(0);
  pages = signal(0);
  error = signal('');
  acknowledged = signal(false);
  preview = signal<SafeResourceUrl | null>(null);
  objectUrl = '';
  private controller?: AbortController;

  open(quick = false): void {
    this.cancel(); this.clearPreview(); this.error.set(''); this.acknowledged.set(false);
    this.sampleSnapshot = this.samples.filter(s => !s.startsWith('QC_'));
    this.snapshot = orderPrintReports(this.cards, this.sampleSnapshot);
    this.chosen.set(defaultPrintReports(this.snapshot, this.sampleSnapshot));
    this.opened.set(true);
    if (quick && this.canPrepare()) void this.prepare();
  }
  toggle(card: ReportCardProjection): void {
    this.clearPreview(); this.error.set(''); this.acknowledged.set(false);
    this.chosen.update(list => list.includes(card) ? list.filter(c => c !== card) : orderPrintReports([...list, card], this.sampleSnapshot));
  }
  duplicates(): string[] { return duplicatePrintSamples(this.chosen()); }
  missing(): string[] { const covered = new Set(this.chosen().flatMap(c => c.samples)); return this.sampleSnapshot.filter(s => !covered.has(s)); }
  sampleCount(): number { return new Set(this.chosen().flatMap(c => c.samples)).size; }
  needsAcknowledgement(): boolean { return this.incomplete || this.missing().length > 0 || this.chosen().some(c => c.isStale || c.status === 'archived' || !c.samples.length); }
  canPrepare(): boolean { return !this.busy() && this.chosen().length > 0 && !this.duplicates().length && (!this.needsAcknowledgement() || this.acknowledged()); }
  dateText(value: any): string {
    const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
    return date && !isNaN(date.getTime()) ? date.toLocaleString('vi-VN') : 'Chưa rõ ngày xuất';
  }
  authenticate(): void { this.drive.beginRedirectAuth(); }
  async prepare(): Promise<void> {
    if (!this.canPrepare()) return;
    this.clearPreview(); this.error.set(''); this.done.set(0); this.busy.set(true);
    const controller = new AbortController(); this.controller = controller;
    try {
      const result = await mergeReportPdfs(this.chosen(), (card, signal) => {
        const id = drivePdfId(card.pdfUrl || card.pdfViewUrl || '');
        if (!id) throw new Error('Thiếu liên kết PDF Drive hợp lệ');
        return this.drive.downloadFile(id, signal);
      }, controller.signal, done => this.done.set(done));
      controller.signal.throwIfAborted();
      this.objectUrl = URL.createObjectURL(result.blob);
      this.preview.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
      this.pages.set(result.pages);
    } catch (error) {
      if (!controller.signal.aborted) { this.error.set(error instanceof Error ? error.message : 'Không ghép được PDF'); controller.abort(); }
    } finally { if (this.controller === controller) { this.busy.set(false); this.controller = undefined; } }
  }
  cancel(): void { this.controller?.abort(); this.controller = undefined; this.busy.set(false); }
  close(): void { this.cancel(); this.clearPreview(); this.opened.set(false); }
  private clearPreview(): void { this.preview.set(null); this.pages.set(0); if (this.objectUrl) URL.revokeObjectURL(this.objectUrl); this.objectUrl = ''; }
  ngOnDestroy(): void { this.close(); }
}
