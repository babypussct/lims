import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { PDFDocumentProxy, RenderTask, TextLayer as PdfTextLayer } from 'pdfjs-dist';

type PdfFitMode = 'width' | 'page' | 'custom';

interface PdfPageDescriptor {
  number: number;
  width: number;
  height: number;
}

@Component({
  selector: 'app-pdf-document-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full min-h-0 flex flex-col bg-slate-100 dark:bg-slate-950">
      <div class="h-11 shrink-0 flex items-center gap-1.5 px-2 md:px-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none">
        <button type="button" (click)="previousPage()" [disabled]="pageNumber() <= 1"
                class="viewer-tool-button" aria-label="Trang trước" title="Trang trước">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <label class="flex items-center h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs font-bold text-slate-600 dark:text-slate-200 shrink-0">
          <span class="hidden sm:inline mr-1.5 text-slate-400">Trang</span>
          <input type="number" min="1" [max]="pageCount()" [ngModel]="pageNumber()"
                 (change)="goToPage(($any($event.target)).value)"
                 (keydown.enter)="goToPage(($any($event.target)).value)"
                 class="w-8 bg-transparent text-center outline-none tabular-nums">
          <span class="text-slate-400 mx-1">/</span>
          <span class="tabular-nums">{{ pageCount() || '—' }}</span>
        </label>

        <button type="button" (click)="nextPage()" [disabled]="pageNumber() >= pageCount()"
                class="viewer-tool-button" aria-label="Trang sau" title="Trang sau">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        <span class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0"></span>

        <button type="button" (click)="zoomOut()" class="viewer-tool-button" aria-label="Thu nhỏ" title="Thu nhỏ">
          <i class="fa-solid fa-minus"></i>
        </button>
        <span class="h-8 min-w-[62px] px-2 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-200 shrink-0">
          {{ zoomLabel() }}
        </span>
        <button type="button" (click)="zoomIn()" class="viewer-tool-button" aria-label="Phóng to" title="Phóng to">
          <i class="fa-solid fa-plus"></i>
        </button>

        <button type="button" (click)="setFitMode('width')"
                class="viewer-tool-button"
                [class.viewer-tool-active]="fitMode() === 'width'"
                aria-label="Vừa chiều rộng" title="Vừa chiều rộng">
          <i class="fa-solid fa-arrows-left-right-to-line"></i>
        </button>
        <button type="button" (click)="setFitMode('page')"
                class="viewer-tool-button hidden sm:flex"
                [class.viewer-tool-active]="fitMode() === 'page'"
                aria-label="Vừa trang" title="Vừa trang">
          <i class="fa-regular fa-file"></i>
        </button>
        <button type="button" (click)="rotate()" class="viewer-tool-button" aria-label="Xoay tài liệu" title="Xoay tài liệu">
          <i class="fa-solid fa-rotate-right"></i>
        </button>

        <div class="ml-auto flex items-center gap-1 shrink-0">
          @if (searchOpen()) {
            <div class="flex items-center h-8 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800 bg-white dark:bg-slate-800 overflow-hidden">
              <input #pdfSearchInput type="search" [ngModel]="searchQuery()"
                     (ngModelChange)="searchQuery.set($event)"
                     (keydown.enter)="runSearch()"
                     placeholder="Tìm trong PDF"
                     class="w-32 md:w-48 h-full px-2.5 bg-transparent text-xs outline-none dark:text-white">
              @if (searching()) {
                <i class="fa-solid fa-circle-notch fa-spin text-fuchsia-500 mr-2"></i>
              } @else if (searchQuery()) {
                <span class="text-[10px] font-bold text-slate-400 mr-1.5 tabular-nums">
                  {{ searchResultLabel() }}
                </span>
              }
              <button type="button" (click)="previousMatch()" [disabled]="matchPages().length === 0"
                      class="w-7 h-full text-slate-400 hover:text-fuchsia-600 disabled:opacity-30" aria-label="Kết quả trước">
                <i class="fa-solid fa-chevron-up text-[10px]"></i>
              </button>
              <button type="button" (click)="nextMatch()" [disabled]="matchPages().length === 0"
                      class="w-7 h-full text-slate-400 hover:text-fuchsia-600 disabled:opacity-30" aria-label="Kết quả sau">
                <i class="fa-solid fa-chevron-down text-[10px]"></i>
              </button>
            </div>
          }
          <button type="button" (click)="toggleSearch()" class="viewer-tool-button"
                  [class.viewer-tool-active]="searchOpen()" aria-label="Tìm trong PDF" title="Tìm trong PDF">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      <div #pdfViewport
           class="flex-1 min-h-0 overflow-auto overscroll-contain"
           (scroll)="onViewportScroll()"
           (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)">
        @if (loading()) {
          <div class="sticky top-0 left-0 z-30 w-full h-full min-h-64 flex items-center justify-center text-fuchsia-500">
            <i class="fa-solid fa-circle-notch fa-spin text-2xl"></i>
          </div>
        }
        <div class="pdf-pages p-2 md:p-5">
          @for (page of pages(); track page.number) {
            <section #pdfPageShell
                     class="pdf-page-shell relative bg-white shadow-xl ring-1 ring-slate-900/10"
                     [attr.data-page]="page.number"
                     [style.width.px]="pageWidth(page)"
                     [style.height.px]="pageHeight(page)"
                     [style.--total-scale-factor]="zoom()"
                     style="--scale-round-x: 1px; --scale-round-y: 1px;"
                     [attr.aria-label]="'Trang ' + page.number">
              @if (isPageRendering(page.number)) {
                <div class="absolute inset-0 z-10 bg-white/55 flex items-center justify-center pointer-events-none">
                  <i class="fa-solid fa-circle-notch fa-spin text-xl text-fuchsia-500"></i>
                </div>
              }
              <span class="absolute top-2 right-2 z-[3] px-2 py-1 rounded-md bg-slate-900/55 text-white text-[10px] font-bold pointer-events-none">
                {{ page.number }}
              </span>
              <canvas #pdfCanvas class="block max-w-none" [attr.aria-label]="'Nội dung trang ' + page.number"></canvas>
              <div #pdfTextLayer class="pdf-text-layer textLayer" [attr.aria-label]="'Văn bản trang ' + page.number"></div>
            </section>
          }
        </div>
      </div>

      <div class="h-7 shrink-0 px-3 flex items-center justify-between gap-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-400">
        <span class="truncate">
          @if (hasSelectableText()) {
            <i class="fa-regular fa-copy mr-1"></i>Chọn chữ và Ctrl/⌘ C để sao chép
          } @else {
            Chỉ đọc
          }
        </span>
        <span class="tabular-nums shrink-0">Trang {{ pageNumber() }} / {{ pageCount() || '—' }}</span>
        <span class="hidden sm:inline shrink-0"><i class="fa-solid fa-arrow-down mr-1"></i>Cuộn dọc để xem trang tiếp theo</span>
      </div>
    </div>
  `,
  styles: [`
    .viewer-tool-button {
      width: 2rem;
      height: 2rem;
      border-radius: .5rem;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      transition: color .15s, background-color .15s;
    }
    .viewer-tool-button:hover:not(:disabled) {
      color: #c026d3;
      background: #f8fafc;
    }
    .viewer-tool-button:disabled { opacity: .35; cursor: not-allowed; }
    .viewer-tool-active { color: #c026d3; background: #fdf4ff; }
    :host-context(.dark) .viewer-tool-button { color: #cbd5e1; }
    :host-context(.dark) .viewer-tool-button:hover:not(:disabled) { color: #f0abfc; background: #1e293b; }
    :host-context(.dark) .viewer-tool-active { color: #f0abfc; background: rgba(112,26,117,.35); }
    .pdf-pages {
      min-width: 100%;
      width: max-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .pdf-page-shell {
      flex: 0 0 auto;
      overflow: hidden;
      transition: width .12s ease, height .12s ease;
    }
    @media (min-width: 768px) {
      .pdf-pages { gap: 20px; }
    }
    .pdf-text-layer {
      position: absolute;
      inset: 0;
      overflow: clip;
      line-height: 1;
      text-align: initial;
      transform-origin: 0 0;
      z-index: 2;
      pointer-events: auto;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
      forced-color-adjust: none;
      --min-font-size: 1;
      --text-scale-factor: calc(var(--total-scale-factor) * var(--min-font-size));
      --min-font-size-inv: calc(1 / var(--min-font-size));
    }
    :host ::ng-deep .pdf-text-layer :is(span, br) {
      color: transparent;
      position: absolute;
      white-space: pre;
      cursor: text;
      transform-origin: 0% 0%;
      user-select: text;
    }
    :host ::ng-deep .pdf-text-layer > :not(.markedContent),
    :host ::ng-deep .pdf-text-layer .markedContent span:not(.markedContent) {
      z-index: 1;
      --font-height: 0;
      font-size: calc(var(--text-scale-factor) * var(--font-height));
      --scale-x: 1;
      --rotate: 0deg;
      transform: rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv));
    }
    :host ::ng-deep .pdf-text-layer .markedContent { display: contents; }
    :host ::ng-deep .pdf-text-layer ::selection {
      background: rgba(37, 99, 235, .38);
      color: transparent;
    }
    :host ::ng-deep .pdf-text-layer .pdf-search-match {
      background: rgba(250, 204, 21, .45);
      border-radius: 2px;
      box-shadow: 0 0 0 1px rgba(202, 138, 4, .35);
    }
    :host ::ng-deep .pdf-text-layer .pdf-search-active {
      background: rgba(251, 146, 60, .62);
      box-shadow: 0 0 0 2px #f97316;
    }
  `],
})
export class PdfDocumentViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) blob!: Blob;
  @Output() ready = new EventEmitter<void>();
  @Output() failed = new EventEmitter<string>();

  @ViewChildren('pdfCanvas') pdfCanvases?: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChildren('pdfPageShell') pdfPageShells?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('pdfTextLayer') pdfTextLayers?: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChild('pdfViewport') pdfViewport?: ElementRef<HTMLDivElement>;
  @ViewChild('pdfSearchInput') pdfSearchInput?: ElementRef<HTMLInputElement>;

  pageNumber = signal(1);
  pageCount = signal(0);
  pages = signal<PdfPageDescriptor[]>([]);
  zoom = signal(1);
  rotation = signal(0);
  fitMode = signal<PdfFitMode>('width');
  loading = signal(true);
  renderingPages = signal<Set<number>>(new Set());
  searchOpen = signal(false);
  searchQuery = signal('');
  searching = signal(false);
  matchPages = signal<number[]>([]);
  activeMatchIndex = signal(-1);
  hasSelectableText = signal(false);

  zoomLabel = computed(() => `${Math.round(this.zoom() * 100)}%`);
  searchResultLabel = computed(() => {
    const matches = this.matchPages();
    return matches.length ? `${this.activeMatchIndex() + 1}/${matches.length}` : '0';
  });

  private pdfDocument?: PDFDocumentProxy;
  private pdfjs?: typeof import('pdfjs-dist/legacy/build/pdf.mjs');
  private renderTasks = new Map<number, RenderTask>();
  private textLayers = new Map<number, PdfTextLayer>();
  private renderedSignatures = new Map<number, string>();
  private searchMatches: { page: number; item: number }[] = [];
  private pageObserver?: IntersectionObserver;
  private viewReady = false;
  private loadToken = 0;
  private touchStartX = 0;
  private touchStartY = 0;
  private resizeTimer?: ReturnType<typeof setTimeout>;
  private scrollFrame = 0;
  private readyEmitted = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    void this.loadDocument();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blob'] && !changes['blob'].firstChange && this.viewReady) {
      void this.loadDocument();
    }
  }

  ngOnDestroy(): void {
    this.loadToken++;
    this.cancelRendering();
    this.pageObserver?.disconnect();
    void this.pdfDocument?.loadingTask.destroy();
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    if (this.scrollFrame) cancelAnimationFrame(this.scrollFrame);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.fitMode() === 'custom') return;
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.refreshLayout(), 120);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      this.openSearch();
      return;
    }
    if (isTyping) return;
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      this.previousPage();
    } else if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      this.nextPage();
    }
  }

  pageWidth(page: PdfPageDescriptor): number {
    return Math.floor(this.rotatedWidth(page) * this.zoom());
  }

  pageHeight(page: PdfPageDescriptor): number {
    return Math.floor(this.rotatedHeight(page) * this.zoom());
  }

  isPageRendering(page: number): boolean {
    return this.renderingPages().has(page);
  }

  previousPage(): void {
    this.goToPage(this.pageNumber() - 1);
  }

  nextPage(): void {
    this.goToPage(this.pageNumber() + 1);
  }

  goToPage(value: number | string): void {
    if (!this.pageCount()) return;
    const page = Math.min(this.pageCount(), Math.max(1, Number(value) || 1));
    this.pageNumber.set(page);
    const shell = this.pdfPageShells?.get(page - 1)?.nativeElement;
    const viewport = this.pdfViewport?.nativeElement;
    if (shell && viewport) {
      viewport.scrollTo({ top: Math.max(0, shell.offsetTop - 12), behavior: 'smooth' });
    }
    void this.renderPage(page);
  }

  zoomIn(): void {
    this.fitMode.set('custom');
    this.zoom.set(Math.min(4, Math.round((this.zoom() + 0.15) * 100) / 100));
    this.invalidateAndRender();
  }

  zoomOut(): void {
    this.fitMode.set('custom');
    this.zoom.set(Math.max(0.25, Math.round((this.zoom() - 0.15) * 100) / 100));
    this.invalidateAndRender();
  }

  setFitMode(mode: PdfFitMode): void {
    this.fitMode.set(mode);
    this.refreshLayout();
  }

  rotate(): void {
    this.rotation.update(value => (value + 90) % 360);
    this.refreshLayout();
  }

  toggleSearch(): void {
    if (this.searchOpen()) {
      this.searchOpen.set(false);
      return;
    }
    this.openSearch();
  }

  runSearch(): void {
    void this.searchDocument();
  }

  previousMatch(): void {
    this.moveToMatch(-1);
  }

  nextMatch(): void {
    this.moveToMatch(1);
  }

  onViewportScroll(): void {
    if (this.scrollFrame) return;
    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = 0;
      const viewport = this.pdfViewport?.nativeElement;
      const shells = this.pdfPageShells?.toArray() || [];
      if (!viewport || !shells.length) return;
      const viewportRect = viewport.getBoundingClientRect();
      const targetY = viewportRect.top + Math.min(96, viewportRect.height * 0.18);
      let bestPage = this.pageNumber();
      let bestDistance = Number.POSITIVE_INFINITY;
      shells.forEach((shellRef, index) => {
        const rect = shellRef.nativeElement.getBoundingClientRect();
        const distance = rect.bottom < viewportRect.top
          ? viewportRect.top - rect.bottom
          : rect.top > targetY
            ? rect.top - targetY
            : 0;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPage = index + 1;
        }
      });
      if (bestPage !== this.pageNumber()) this.pageNumber.set(bestPage);
    });
  }

  onTouchStart(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    this.touchStartX = touch?.clientX ?? 0;
    this.touchStartY = touch?.clientY ?? 0;
  }

  onTouchEnd(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    if (Math.abs(deltaX) < 80 || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return;
    if (deltaX < 0) this.nextPage();
    else this.previousPage();
  }

  private async loadDocument(): Promise<void> {
    if (!this.blob || !this.pdfViewport) return;
    const token = ++this.loadToken;
    this.loading.set(true);
    this.readyEmitted = false;
    this.cancelRendering();
    this.pageObserver?.disconnect();
    try {
      // The legacy bundle includes the Map/WeakMap compatibility layer required
      // by Chrome versions that do not yet implement getOrInsertComputed.
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      this.pdfjs = pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('assets/pdfjs/pdf.worker.min.mjs', document.baseURI).toString();
      const data = new Uint8Array(await this.blob.arrayBuffer());
      if (token !== this.loadToken) return;
      const loadedDocument = await pdfjs.getDocument({ data }).promise;
      if (token !== this.loadToken) {
        await loadedDocument.loadingTask.destroy();
        return;
      }
      await this.pdfDocument?.loadingTask.destroy();
      this.pdfDocument = loadedDocument;

      const descriptors: PdfPageDescriptor[] = [];
      for (let number = 1; number <= loadedDocument.numPages; number++) {
        const page = await loadedDocument.getPage(number);
        const viewport = page.getViewport({ scale: 1, rotation: 0 });
        descriptors.push({ number, width: viewport.width, height: viewport.height });
      }
      if (token !== this.loadToken) return;

      this.pageCount.set(loadedDocument.numPages);
      this.pageNumber.set(1);
      this.pages.set(descriptors);
      this.rotation.set(0);
      this.fitMode.set('width');
      this.matchPages.set([]);
      this.searchMatches = [];
      this.activeMatchIndex.set(-1);
      this.hasSelectableText.set(false);
      this.updateFitScale();
      this.loading.set(false);

      setTimeout(() => {
        if (token !== this.loadToken) return;
        this.setupPageObserver();
        void this.renderPage(1);
        if (loadedDocument.numPages > 1) void this.renderPage(2);
      });
    } catch (error) {
      if (token !== this.loadToken) return;
      this.loading.set(false);
      this.failed.emit(error instanceof Error ? error.message : 'Không thể đọc tài liệu PDF.');
    }
  }

  private setupPageObserver(): void {
    this.pageObserver?.disconnect();
    const viewport = this.pdfViewport?.nativeElement;
    const shells = this.pdfPageShells?.toArray() || [];
    if (!viewport || !shells.length) return;
    this.pageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const page = Number((entry.target as HTMLElement).dataset['page']);
        if (page) void this.renderPage(page);
      });
    }, { root: viewport, rootMargin: '700px 300px', threshold: 0.01 });
    shells.forEach(shell => this.pageObserver?.observe(shell.nativeElement));
  }

  private async renderPage(pageNumber: number): Promise<void> {
    const document = this.pdfDocument;
    const pdfjs = this.pdfjs;
    const canvas = this.pdfCanvases?.get(pageNumber - 1)?.nativeElement;
    const textContainer = this.pdfTextLayers?.get(pageNumber - 1)?.nativeElement;
    const shell = this.pdfPageShells?.get(pageNumber - 1)?.nativeElement;
    const signature = `${this.zoom().toFixed(4)}:${this.rotation()}`;
    if (!document || !pdfjs || !canvas || !textContainer || !shell) return;
    if (this.renderedSignatures.get(pageNumber) === signature || this.renderTasks.has(pageNumber)) return;

    const token = this.loadToken;
    this.setPageRendering(pageNumber, true);
    try {
      const page = await document.getPage(pageNumber);
      if (token !== this.loadToken) return;
      const viewport = page.getViewport({ scale: this.zoom(), rotation: this.rotation() });
      shell.style.setProperty('--total-scale-factor', String(this.zoom()));
      const outputScale = Math.min(window.devicePixelRatio || 1, 2);
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) throw new Error('Trình duyệt không hỗ trợ canvas PDF.');

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      const transform = outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0];
      const renderTask = page.render({ canvasContext: context, canvas, transform, viewport });
      this.renderTasks.set(pageNumber, renderTask);
      await renderTask.promise;
      this.renderTasks.delete(pageNumber);
      if (token !== this.loadToken) return;

      this.textLayers.get(pageNumber)?.cancel();
      textContainer.replaceChildren();
      textContainer.style.setProperty('--total-scale-factor', String(this.zoom()));
      const textContent = await page.getTextContent();
      const textLayer = new pdfjs.TextLayer({
        textContentSource: textContent,
        container: textContainer,
        viewport,
      });
      this.textLayers.set(pageNumber, textLayer);
      await textLayer.render();
      textContainer.style.width = `${Math.floor(viewport.width)}px`;
      textContainer.style.height = `${Math.floor(viewport.height)}px`;
      if (textLayer.textContentItemsStr.some(value => value.trim().length > 0)) {
        this.hasSelectableText.set(true);
      }
      this.renderedSignatures.set(pageNumber, signature);
      this.applySearchHighlights(pageNumber);
      if (!this.readyEmitted) {
        this.readyEmitted = true;
        this.ready.emit();
      }
    } catch (error: any) {
      this.renderTasks.delete(pageNumber);
      if (error?.name !== 'RenderingCancelledException' && error?.name !== 'AbortException') {
        this.failed.emit(error instanceof Error ? error.message : `Không thể hiển thị trang ${pageNumber}.`);
      }
    } finally {
      this.setPageRendering(pageNumber, false);
    }
  }

  private refreshLayout(): void {
    this.updateFitScale();
    this.invalidateAndRender();
  }

  private updateFitScale(): void {
    const viewport = this.pdfViewport?.nativeElement;
    const pages = this.pages();
    if (!viewport || !pages.length || this.fitMode() === 'custom') return;
    const page = pages[Math.max(0, this.pageNumber() - 1)] || pages[0];
    const padding = window.innerWidth < 640 ? 16 : 40;
    const availableWidth = Math.max(120, viewport.clientWidth - padding);
    const widest = Math.max(...pages.map(item => this.rotatedWidth(item)));
    let scale = availableWidth / widest;
    if (this.fitMode() === 'page') {
      const availableHeight = Math.max(160, viewport.clientHeight - padding);
      scale = Math.min(
        availableWidth / this.rotatedWidth(page),
        availableHeight / this.rotatedHeight(page),
      );
    }
    this.zoom.set(Math.min(4, Math.max(0.25, scale)));
  }

  private invalidateAndRender(): void {
    const currentPage = this.pageNumber();
    const currentShell = this.pdfPageShells?.get(currentPage - 1)?.nativeElement;
    const viewport = this.pdfViewport?.nativeElement;
    const relativeOffset = currentShell && viewport
      ? currentShell.getBoundingClientRect().top - viewport.getBoundingClientRect().top
      : 0;
    this.cancelRendering();
    this.renderedSignatures.clear();
    setTimeout(() => {
      this.setupPageObserver();
      const refreshedShell = this.pdfPageShells?.get(currentPage - 1)?.nativeElement;
      if (refreshedShell && viewport) {
        viewport.scrollTop += refreshedShell.getBoundingClientRect().top -
          viewport.getBoundingClientRect().top - relativeOffset;
      }
      this.renderPagesNearViewport();
    });
  }

  private renderPagesNearViewport(): void {
    const viewport = this.pdfViewport?.nativeElement;
    const shells = this.pdfPageShells?.toArray() || [];
    if (!viewport) return;
    const viewportRect = viewport.getBoundingClientRect();
    let renderedAny = false;
    shells.forEach((shell, index) => {
      const rect = shell.nativeElement.getBoundingClientRect();
      if (rect.bottom >= viewportRect.top - 700 && rect.top <= viewportRect.bottom + 700) {
        renderedAny = true;
        void this.renderPage(index + 1);
      }
    });
    if (!renderedAny) void this.renderPage(this.pageNumber());
  }

  private cancelRendering(): void {
    this.renderTasks.forEach(task => task.cancel());
    this.textLayers.forEach(layer => layer.cancel());
    this.renderTasks.clear();
    this.textLayers.clear();
    this.renderingPages.set(new Set());
  }

  private setPageRendering(page: number, active: boolean): void {
    const pages = new Set<number>();
    this.renderingPages().forEach(p => pages.add(p));
    if (active) pages.add(page);
    else pages.delete(page);
    this.renderingPages.set(pages);
  }

  private openSearch(): void {
    this.searchOpen.set(true);
    setTimeout(() => {
      this.pdfSearchInput?.nativeElement.focus();
      this.pdfSearchInput?.nativeElement.select();
    });
  }

  private async searchDocument(): Promise<void> {
    const document = this.pdfDocument;
    const query = this.normalize(this.searchQuery().trim());
    if (!document || !query) {
      this.matchPages.set([]);
      this.searchMatches = [];
      this.activeMatchIndex.set(-1);
      this.applySearchHighlights();
      return;
    }

    const token = this.loadToken;
    this.searching.set(true);
    const matches: number[] = [];
    const detailedMatches: { page: number; item: number }[] = [];
    try {
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
        if (token !== this.loadToken) return;
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        let textItemIndex = 0;
        content.items.forEach(item => {
          if (!('str' in item)) return;
          const text = this.normalize(item.str);
          let start = 0;
          while ((start = text.indexOf(query, start)) !== -1) {
            matches.push(pageNumber);
            detailedMatches.push({ page: pageNumber, item: textItemIndex });
            start += Math.max(1, query.length);
          }
          textItemIndex++;
        });
      }
      this.searchMatches = detailedMatches;
      this.matchPages.set(matches);
      this.activeMatchIndex.set(matches.length ? 0 : -1);
      if (matches.length) this.focusActiveMatch();
      else this.applySearchHighlights();
    } finally {
      this.searching.set(false);
    }
  }

  private moveToMatch(direction: number): void {
    const matches = this.matchPages();
    if (!matches.length) return;
    const current = this.activeMatchIndex();
    this.activeMatchIndex.set((current + direction + matches.length) % matches.length);
    this.focusActiveMatch();
  }

  private focusActiveMatch(): void {
    const match = this.searchMatches[this.activeMatchIndex()];
    if (!match) return;
    this.pageNumber.set(match.page);
    const shell = this.pdfPageShells?.get(match.page - 1)?.nativeElement;
    const viewport = this.pdfViewport?.nativeElement;
    if (shell && viewport) viewport.scrollTo({ top: Math.max(0, shell.offsetTop - 12), behavior: 'smooth' });
    void this.renderPage(match.page).then(() => this.applySearchHighlights(match.page));
  }

  private applySearchHighlights(pageNumber?: number): void {
    const active = this.searchMatches[this.activeMatchIndex()];
    const layers: [number, PdfTextLayer | undefined][] = [];
    if (pageNumber) {
      layers.push([pageNumber, this.textLayers.get(pageNumber)]);
    } else {
      this.textLayers.forEach((layer, page) => layers.push([page, layer]));
    }
    layers.forEach(([page, layer]) => {
      if (!layer) return;
      layer.textDivs.forEach(element => element.classList.remove('pdf-search-match', 'pdf-search-active'));
      this.searchMatches.forEach(match => {
        if (match.page !== page) return;
        const element = layer.textDivs[match.item];
        if (!element) return;
        element.classList.add('pdf-search-match');
        if (active?.page === match.page && active.item === match.item) {
          element.classList.add('pdf-search-active');
          setTimeout(() => element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' }));
        }
      });
    });
  }

  private rotatedWidth(page: PdfPageDescriptor): number {
    return this.rotation() % 180 === 0 ? page.width : page.height;
  }

  private rotatedHeight(page: PdfPageDescriptor): number {
    return this.rotation() % 180 === 0 ? page.height : page.width;
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase();
  }
}
