import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild, computed, inject, signal } from '@angular/core';
import { AppModalShellComponent } from '../ui/modal-shell/modal-shell.component';
import { AppButtonComponent } from '../ui/button/button.component';
import { ToastService } from '../../../core/services/toast.service';
import { A4Document } from '../../utils/a4-document';
import { paginateA4Document } from '../../utils/a4-document-pagination';
import { paginateHtmlA4 } from '../../utils/a4-html-pagination';
import { waitForPrintAssets } from '../../utils/print-dom';
import { downloadPreparedA4, printPreparedA4 } from '../../utils/a4-output';

@Component({
  selector: 'app-a4-document-preview',
  standalone: true,
  imports: [AppModalShellComponent, AppButtonComponent],
  template: `
    <app-modal-shell [title]="document.title" [description]="pageCount() + ' trang A4 · Xem trước khi in'"
      size="xl" [closeDisabled]="busy()" (closed)="close()">
      <div modalBody class="print-workspace flex min-h-0 flex-col gap-3" style="height:min(65vh,760px)">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span role="status" class="text-xs text-slate-600 dark:text-slate-300">{{ready() ? 'Bản in đã sẵn sàng' : error() ? 'Bản in chưa sẵn sàng' : 'Đang chuẩn bị bản in…'}}</span>
          <div class="flex items-center gap-2">
            <app-button variant="ghost" size="sm" [disabled]="busy()" (click)="zoom.set(Math.max(25, zoom() - 10))"><i class="fa-solid fa-minus" aria-hidden="true"></i><span class="sr-only">Thu nhỏ</span></app-button>
            <span class="w-12 text-center text-xs text-slate-600 dark:text-slate-300">{{zoom()}}%</span>
            <app-button variant="ghost" size="sm" [disabled]="busy()" (click)="zoom.set(Math.min(150, zoom() + 10))"><i class="fa-solid fa-plus" aria-hidden="true"></i><span class="sr-only">Phóng to</span></app-button>
            <app-button variant="secondary" size="sm" [disabled]="busy()" (click)="fitWidth()">Vừa chiều rộng</app-button>
          </div>
        </div>
        @if (error()) {
          <div role="alert" class="rounded-xl bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">{{error()}} <app-button variant="secondary" size="sm" (click)="prepare()">Thử lại</app-button></div>
        }
        <div #viewport class="min-h-0 flex-1 overflow-auto rounded-xl bg-slate-200 p-3 dark:bg-slate-950">
          <div class="mx-auto" [style.width.px]="paperWidth * zoom()/100" [style.height.px]="(paperHeight + 16) * pageCount() * zoom()/100">
            <div #prepared class="origin-top-left" [style.transform]="'scale(' + zoom()/100 + ')'"></div>
          </div>
        </div>
        <div #source class="a4-document-root a4-document-source" [style.width.mm]="document.orientation === 'landscape' ? 297 : 210" aria-hidden="true">
          <article class="print-page a4-document-page" [style.width.mm]="document.orientation === 'landscape' ? 297 : 210" [style.height.mm]="document.orientation === 'landscape' ? 210 : 297">
            <header>
              <div class="a4-document-brand">{{document.brand || 'LIMS · PHIẾU TÍNH'}}</div>
              <h2>{{document.title}}</h2>
              <p class="a4-document-subtitle">{{document.subtitle}}</p>
              <p class="a4-document-notice">{{document.notice}}</p>
            </header>
            <div class="a4-document-body">
              @for (section of document.sections; track $index) {
                <section>
                  <h3>{{section.title}}</h3>
                  <table>
                    <thead><tr>@for (column of section.columns; track $index) { <th>{{column}}</th> }</tr></thead>
                    <tbody>
                      @for (row of section.rows; track $index) {
                        <tr [attr.data-row-key]="row.key">@for (cell of row.cells; track $index) { <td>{{cell}}</td> }</tr>
                      }
                    </tbody>
                  </table>
                </section>
              }
            </div>
            <footer><span>Chuẩn bị bản in: {{document.preparedAt}}</span><span data-page-number></span></footer>
          </article>
        </div>
      </div>
      <div modalFooter class="print-workspace flex w-full flex-wrap justify-end gap-2">
        <app-button variant="secondary" [disabled]="busy()" (click)="close()">Đóng</app-button>
        <app-button variant="secondary" [disabled]="!ready() || isPrinting()" [loading]="isExporting()" (click)="exportPdf()"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> Tải PDF</app-button>
        <app-button class="print-primary" [disabled]="!ready() || isExporting()" [loading]="isPrinting()" (click)="print()"><i class="fa-solid fa-print" aria-hidden="true"></i> In</app-button>
      </div>
    </app-modal-shell>
  `,
  styles: [`
    .a4-document-source{position:absolute;left:-100000px;top:0;width:210mm;pointer-events:none}
    .a4-document-root{width:210mm;color:#172033;text-align:left;font-family:'Open Sans',Arial,sans-serif;font-size:12px;line-height:1.45}
    .a4-document-page{box-sizing:border-box;width:210mm;height:297mm;padding:12mm 15mm 14mm;position:relative;display:flex;flex-direction:column;background:white;margin-bottom:16px}
    .a4-document-source .a4-document-page{height:auto}
    header{flex-shrink:0;border-bottom:2px solid #334155;padding-bottom:8px;margin-bottom:10px}
    .a4-document-brand{font-size:9px;font-weight:700;letter-spacing:.7px;color:#4f46e5}
    h2{font-size:19px;line-height:1.25;font-weight:700;margin:6px 0}
    .a4-document-subtitle{font-weight:600;white-space:pre-line;overflow-wrap:anywhere;margin:3px 0}
    .a4-document-notice{font-size:10px;color:#475569;margin:5px 0 0}
    .a4-document-body{flex:1;min-height:0}
    section{margin-bottom:12px}
    h3{font-size:12px;font-weight:700;margin:0;padding:4px 8px 12px;background:#eef2ff;border:1px solid #cbd5e1;border-bottom:0}
    table{width:100%;border-collapse:collapse;table-layout:fixed}
    th,td{border:1px solid #cbd5e1;padding:4px 8px 12px;vertical-align:top;white-space:pre-line;overflow-wrap:anywhere}
    th{font-size:10px;font-weight:700;background:#f8fafc}
    td{font-size:11px}
    footer{position:absolute;left:15mm;right:15mm;bottom:7mm;display:flex;justify-content:space-between;border-top:1px solid #cbd5e1;padding-top:4px;font-size:9px;color:#475569}
    @media print{.a4-document-page{margin:0;break-after:page}.a4-document-page:last-child{break-after:auto}}
  `],
})
export class A4DocumentPreviewComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) document!: A4Document;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('source') source!: ElementRef<HTMLElement>;
  @ViewChild('prepared') prepared!: ElementRef<HTMLElement>;
  @ViewChild('viewport') viewport!: ElementRef<HTMLElement>;
  private toast = inject(ToastService);
  readonly Math = Math;
  ready = signal(false);
  error = signal<string | null>(null);
  pageCount = signal(0);
  zoom = signal(75);
  isPrinting = signal(false);
  isExporting = signal(false);
  busy = computed(() => this.isPrinting() || this.isExporting());
  private revision = 0;
  private controller?: AbortController;
  ngAfterViewInit() { this.prepare(); }
  ngOnChanges() { if (this.source) this.prepare(); }
  ngOnDestroy() { this.revision++; this.controller?.abort(); }
  close() { if (!this.busy()) this.closed.emit(); }
  get paperWidth() { return this.document.orientation === 'landscape' ? 1123 : 794; }
  get paperHeight() { return this.document.orientation === 'landscape' ? 794 : 1123; }
  fitWidth() { this.zoom.set(Math.max(25, Math.min(100, Math.floor((this.viewport.nativeElement.clientWidth - 24) / this.paperWidth * 100)))); }
  prepare() {
    const revision = ++this.revision;
    this.ready.set(false);
    this.error.set(null);
    this.pageCount.set(0);
    queueMicrotask(async () => {
      try {
        await waitForPrintAssets(this.source.nativeElement);
        if (revision !== this.revision) return;
        const pages = this.document.html
          ? paginateHtmlA4(this.document.html, this.document.orientation || 'portrait', this.document.preparedAt)
          : paginateA4Document(this.source.nativeElement);
        this.prepared.nativeElement.replaceChildren(pages);
        this.pageCount.set(pages.querySelectorAll('.print-page').length);
        this.ready.set(true);
        if (window.innerWidth < 1024) this.fitWidth();
      } catch (error) {
        if (revision !== this.revision) return;
        this.prepared.nativeElement.replaceChildren();
        this.error.set(error instanceof Error ? error.message : 'Không chuẩn bị được bản in.');
      }
    });
  }
  private content(): HTMLElement {
    const content = this.prepared.nativeElement.firstElementChild as HTMLElement | null;
    if (!this.ready() || !content) throw new Error('Bản in chưa sẵn sàng.');
    return content;
  }
  async print() {
    if (!this.ready() || this.busy()) return;
    this.isPrinting.set(true);
    this.controller = new AbortController();
    try { await printPreparedA4(this.content(), this.controller.signal, this.document.orientation); }
    catch (error) { this.toast.show(error instanceof Error ? error.message : 'Không mở được bản in.', 'error'); }
    finally { this.controller = undefined; this.isPrinting.set(false); }
  }
  async exportPdf() {
    if (!this.ready() || this.busy()) return;
    this.isExporting.set(true);
    try { await downloadPreparedA4(this.content(), this.document.fileName || 'LIMS_Phieu_pha_che.pdf', this.document.orientation); this.toast.show('Đã tải PDF.', 'success'); }
    catch (error) { this.toast.show(error instanceof Error ? error.message : 'Không tạo được PDF.', 'error'); }
    finally { this.isExporting.set(false); }
  }
}
