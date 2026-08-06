import { Component, EventEmitter, HostListener, Input, Output, ViewChild, ViewChildren, computed, signal, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = ["pdfViewport"];
const _c1 = ["pdfSearchInput"];
const _c2 = ["pdfCanvas"];
const _c3 = ["pdfPageShell"];
const _c4 = ["pdfTextLayer"];
const _forTrack0 = ($index, $item) => $item.number;
function PdfDocumentViewerComponent_Conditional_28_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 42);
} }
function PdfDocumentViewerComponent_Conditional_28_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 43);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.searchResultLabel(), " ");
} }
function PdfDocumentViewerComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 29)(1, "input", 41, 1);
    i0.ɵɵlistener("ngModelChange", function PdfDocumentViewerComponent_Conditional_28_Template_input_ngModelChange_1_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.searchQuery.set($event)); })("keydown.enter", function PdfDocumentViewerComponent_Conditional_28_Template_input_keydown_enter_1_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.runSearch()); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, PdfDocumentViewerComponent_Conditional_28_Conditional_3_Template, 1, 0, "i", 42)(4, PdfDocumentViewerComponent_Conditional_28_Conditional_4_Template, 2, 1, "span", 43);
    i0.ɵɵelementStart(5, "button", 44);
    i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Conditional_28_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.previousMatch()); });
    i0.ɵɵelement(6, "i", 45);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 46);
    i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Conditional_28_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.nextMatch()); });
    i0.ɵɵelement(8, "i", 47);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", ctx_r2.searchQuery());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.searching() ? 3 : ctx_r2.searchQuery() ? 4 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r2.matchPages().length === 0);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r2.matchPages().length === 0);
} }
function PdfDocumentViewerComponent_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 33);
    i0.ɵɵelement(1, "i", 48);
    i0.ɵɵelementEnd();
} }
function PdfDocumentViewerComponent_For_36_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 50);
    i0.ɵɵelement(1, "i", 54);
    i0.ɵɵelementEnd();
} }
function PdfDocumentViewerComponent_For_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 49, 2);
    i0.ɵɵtemplate(2, PdfDocumentViewerComponent_For_36_Conditional_2_Template, 2, 0, "div", 50);
    i0.ɵɵelementStart(3, "span", 51);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(5, "canvas", 52, 3)(7, "div", 53, 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const page_r4 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("width", ctx_r2.pageWidth(page_r4), "px")("height", ctx_r2.pageHeight(page_r4), "px")("--total-scale-factor", ctx_r2.zoom());
    i0.ɵɵattribute("data-page", page_r4.number)("aria-label", "Trang " + page_r4.number);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.isPageRendering(page_r4.number) ? 2 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", page_r4.number, " ");
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-label", "N\u1ED9i dung trang " + page_r4.number);
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("aria-label", "V\u0103n b\u1EA3n trang " + page_r4.number);
} }
function PdfDocumentViewerComponent_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 55);
    i0.ɵɵtext(1, "Ch\u1ECDn ch\u1EEF v\u00E0 Ctrl/\u2318 C \u0111\u1EC3 sao ch\u00E9p ");
} }
function PdfDocumentViewerComponent_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Ch\u1EC9 \u0111\u1ECDc ");
} }
export class PdfDocumentViewerComponent {
    constructor() {
        this.ready = new EventEmitter();
        this.failed = new EventEmitter();
        this.pageNumber = signal(1);
        this.pageCount = signal(0);
        this.pages = signal([]);
        this.zoom = signal(1);
        this.rotation = signal(0);
        this.fitMode = signal('width');
        this.loading = signal(true);
        this.renderingPages = signal(new Set());
        this.searchOpen = signal(false);
        this.searchQuery = signal('');
        this.searching = signal(false);
        this.matchPages = signal([]);
        this.activeMatchIndex = signal(-1);
        this.hasSelectableText = signal(false);
        this.zoomLabel = computed(() => `${Math.round(this.zoom() * 100)}%`);
        this.searchResultLabel = computed(() => {
            const matches = this.matchPages();
            return matches.length ? `${this.activeMatchIndex() + 1}/${matches.length}` : '0';
        });
        this.renderTasks = new Map();
        this.textLayers = new Map();
        this.renderedSignatures = new Map();
        this.searchMatches = [];
        this.viewReady = false;
        this.loadToken = 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.scrollFrame = 0;
        this.readyEmitted = false;
    }
    ngAfterViewInit() {
        this.viewReady = true;
        void this.loadDocument();
    }
    ngOnChanges(changes) {
        if (changes['blob'] && !changes['blob'].firstChange && this.viewReady) {
            void this.loadDocument();
        }
    }
    ngOnDestroy() {
        this.loadToken++;
        this.cancelRendering();
        this.pageObserver?.disconnect();
        void this.pdfDocument?.loadingTask.destroy();
        if (this.resizeTimer)
            clearTimeout(this.resizeTimer);
        if (this.scrollFrame)
            cancelAnimationFrame(this.scrollFrame);
    }
    onResize() {
        if (this.fitMode() === 'custom')
            return;
        if (this.resizeTimer)
            clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => this.refreshLayout(), 120);
    }
    onKeydown(event) {
        const target = event.target;
        const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
            event.preventDefault();
            this.openSearch();
            return;
        }
        if (isTyping)
            return;
        if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
            event.preventDefault();
            this.previousPage();
        }
        else if (event.key === 'ArrowRight' || event.key === 'PageDown') {
            event.preventDefault();
            this.nextPage();
        }
    }
    pageWidth(page) {
        return Math.floor(this.rotatedWidth(page) * this.zoom());
    }
    pageHeight(page) {
        return Math.floor(this.rotatedHeight(page) * this.zoom());
    }
    isPageRendering(page) {
        return this.renderingPages().has(page);
    }
    previousPage() {
        this.goToPage(this.pageNumber() - 1);
    }
    nextPage() {
        this.goToPage(this.pageNumber() + 1);
    }
    goToPage(value) {
        if (!this.pageCount())
            return;
        const page = Math.min(this.pageCount(), Math.max(1, Number(value) || 1));
        this.pageNumber.set(page);
        const shell = this.pdfPageShells?.get(page - 1)?.nativeElement;
        const viewport = this.pdfViewport?.nativeElement;
        if (shell && viewport) {
            viewport.scrollTo({ top: Math.max(0, shell.offsetTop - 12), behavior: 'smooth' });
        }
        void this.renderPage(page);
    }
    zoomIn() {
        this.fitMode.set('custom');
        this.zoom.set(Math.min(4, Math.round((this.zoom() + 0.15) * 100) / 100));
        this.invalidateAndRender();
    }
    zoomOut() {
        this.fitMode.set('custom');
        this.zoom.set(Math.max(0.25, Math.round((this.zoom() - 0.15) * 100) / 100));
        this.invalidateAndRender();
    }
    setFitMode(mode) {
        this.fitMode.set(mode);
        this.refreshLayout();
    }
    rotate() {
        this.rotation.update(value => (value + 90) % 360);
        this.refreshLayout();
    }
    toggleSearch() {
        if (this.searchOpen()) {
            this.searchOpen.set(false);
            return;
        }
        this.openSearch();
    }
    runSearch() {
        void this.searchDocument();
    }
    previousMatch() {
        this.moveToMatch(-1);
    }
    nextMatch() {
        this.moveToMatch(1);
    }
    onViewportScroll() {
        if (this.scrollFrame)
            return;
        this.scrollFrame = requestAnimationFrame(() => {
            this.scrollFrame = 0;
            const viewport = this.pdfViewport?.nativeElement;
            const shells = this.pdfPageShells?.toArray() || [];
            if (!viewport || !shells.length)
                return;
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
            if (bestPage !== this.pageNumber())
                this.pageNumber.set(bestPage);
        });
    }
    onTouchStart(event) {
        const touch = event.changedTouches[0];
        this.touchStartX = touch?.clientX ?? 0;
        this.touchStartY = touch?.clientY ?? 0;
    }
    onTouchEnd(event) {
        const touch = event.changedTouches[0];
        if (!touch)
            return;
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        if (Math.abs(deltaX) < 80 || Math.abs(deltaX) < Math.abs(deltaY) * 1.5)
            return;
        if (deltaX < 0)
            this.nextPage();
        else
            this.previousPage();
    }
    async loadDocument() {
        if (!this.blob || !this.pdfViewport)
            return;
        const token = ++this.loadToken;
        this.loading.set(true);
        this.readyEmitted = false;
        this.cancelRendering();
        this.pageObserver?.disconnect();
        try {
            this.ensurePdfJsRuntimeCompatibility();
            // The legacy bundle includes the Map/WeakMap compatibility layer required
            // by Chrome versions that do not yet implement getOrInsertComputed.
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
            this.pdfjs = pdfjs;
            pdfjs.GlobalWorkerOptions.workerSrc = new URL('assets/pdfjs/pdf.worker.min.mjs', document.baseURI).toString();
            const data = new Uint8Array(await this.blob.arrayBuffer());
            if (token !== this.loadToken)
                return;
            const loadedDocument = await pdfjs.getDocument({ data }).promise;
            if (token !== this.loadToken) {
                await loadedDocument.loadingTask.destroy();
                return;
            }
            await this.pdfDocument?.loadingTask.destroy();
            this.pdfDocument = loadedDocument;
            const descriptors = [];
            for (let number = 1; number <= loadedDocument.numPages; number++) {
                const page = await loadedDocument.getPage(number);
                const viewport = page.getViewport({ scale: 1, rotation: 0 });
                descriptors.push({ number, width: viewport.width, height: viewport.height });
            }
            if (token !== this.loadToken)
                return;
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
                if (token !== this.loadToken)
                    return;
                this.setupPageObserver();
                void this.renderPage(1);
                if (loadedDocument.numPages > 1)
                    void this.renderPage(2);
            });
        }
        catch (error) {
            if (token !== this.loadToken)
                return;
            this.loading.set(false);
            this.failed.emit(error instanceof Error ? error.message : 'Không thể đọc tài liệu PDF.');
        }
    }
    setupPageObserver() {
        this.pageObserver?.disconnect();
        const viewport = this.pdfViewport?.nativeElement;
        const shells = this.pdfPageShells?.toArray() || [];
        if (!viewport || !shells.length || typeof IntersectionObserver !== 'function')
            return;
        this.pageObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting)
                    return;
                const page = Number(entry.target.dataset['page']);
                if (page)
                    void this.renderPage(page);
            });
        }, { root: viewport, rootMargin: '700px 300px', threshold: 0.01 });
        shells.forEach(shell => this.pageObserver?.observe(shell.nativeElement));
    }
    async renderPage(pageNumber) {
        const document = this.pdfDocument;
        const pdfjs = this.pdfjs;
        const canvas = this.pdfCanvases?.get(pageNumber - 1)?.nativeElement;
        const textContainer = this.pdfTextLayers?.get(pageNumber - 1)?.nativeElement;
        const shell = this.pdfPageShells?.get(pageNumber - 1)?.nativeElement;
        const signature = `${this.zoom().toFixed(4)}:${this.rotation()}`;
        if (!document || !pdfjs || !canvas || !textContainer || !shell)
            return;
        if (this.renderedSignatures.get(pageNumber) === signature || this.renderTasks.has(pageNumber))
            return;
        const token = this.loadToken;
        this.setPageRendering(pageNumber, true);
        try {
            const page = await document.getPage(pageNumber);
            if (token !== this.loadToken)
                return;
            const viewport = page.getViewport({ scale: this.zoom(), rotation: this.rotation() });
            shell.style.setProperty('--total-scale-factor', String(this.zoom()));
            const outputScale = Math.min(window.devicePixelRatio || 1, 2);
            const context = canvas.getContext('2d', { alpha: false });
            if (!context)
                throw new Error('Trình duyệt không hỗ trợ canvas PDF.');
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = `${Math.floor(viewport.width)}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;
            const transform = outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0];
            const renderTask = page.render({ canvasContext: context, canvas, transform, viewport });
            this.renderTasks.set(pageNumber, renderTask);
            await renderTask.promise;
            this.renderTasks.delete(pageNumber);
            if (token !== this.loadToken)
                return;
            this.clearTextLayer(textContainer);
            this.textLayers.get(pageNumber)?.cancel();
            this.textLayers.delete(pageNumber);
            // Older PWA WebViews can render the canvas but fail inside PDF.js'
            // ReadableStream/DOM text-layer path. Keep the PDF readable and make
            // text selection an optional enhancement instead of failing the page.
            if (typeof ReadableStream === 'function' && typeof pdfjs.TextLayer === 'function') {
                try {
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
                    if (Array.isArray(textLayer.textContentItemsStr) &&
                        textLayer.textContentItemsStr.some(value => value.trim().length > 0)) {
                        this.hasSelectableText.set(true);
                    }
                }
                catch (textLayerError) {
                    this.textLayers.delete(pageNumber);
                    this.clearTextLayer(textContainer);
                    console.warn('[PDF] Text layer disabled for this page:', textLayerError);
                }
            }
            this.renderedSignatures.set(pageNumber, signature);
            this.applySearchHighlights(pageNumber);
            if (!this.readyEmitted) {
                this.readyEmitted = true;
                this.ready.emit();
            }
        }
        catch (error) {
            this.renderTasks.delete(pageNumber);
            if (error?.name !== 'RenderingCancelledException' && error?.name !== 'AbortException') {
                this.failed.emit(error instanceof Error ? error.message : `Không thể hiển thị trang ${pageNumber}.`);
            }
        }
        finally {
            this.setPageRendering(pageNumber, false);
        }
    }
    refreshLayout() {
        this.updateFitScale();
        this.invalidateAndRender();
    }
    updateFitScale() {
        const viewport = this.pdfViewport?.nativeElement;
        const pages = this.pages();
        if (!viewport || !pages.length || this.fitMode() === 'custom')
            return;
        const page = pages[Math.max(0, this.pageNumber() - 1)] || pages[0];
        const padding = window.innerWidth < 640 ? 16 : 40;
        const availableWidth = Math.max(120, viewport.clientWidth - padding);
        const widest = Math.max(...pages.map(item => this.rotatedWidth(item)));
        let scale = availableWidth / widest;
        if (this.fitMode() === 'page') {
            const availableHeight = Math.max(160, viewport.clientHeight - padding);
            scale = Math.min(availableWidth / this.rotatedWidth(page), availableHeight / this.rotatedHeight(page));
        }
        this.zoom.set(Math.min(4, Math.max(0.25, scale)));
    }
    invalidateAndRender() {
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
    renderPagesNearViewport() {
        const viewport = this.pdfViewport?.nativeElement;
        const shells = this.pdfPageShells?.toArray() || [];
        if (!viewport)
            return;
        const viewportRect = viewport.getBoundingClientRect();
        let renderedAny = false;
        shells.forEach((shell, index) => {
            const rect = shell.nativeElement.getBoundingClientRect();
            if (rect.bottom >= viewportRect.top - 700 && rect.top <= viewportRect.bottom + 700) {
                renderedAny = true;
                void this.renderPage(index + 1);
            }
        });
        if (!renderedAny)
            void this.renderPage(this.pageNumber());
    }
    cancelRendering() {
        this.renderTasks.forEach(task => task.cancel());
        this.textLayers.forEach(layer => layer.cancel());
        this.renderTasks.clear();
        this.textLayers.clear();
        this.renderingPages.set(new Set());
    }
    setPageRendering(page, active) {
        const pages = new Set();
        this.renderingPages().forEach(p => pages.add(p));
        if (active)
            pages.add(page);
        else
            pages.delete(page);
        this.renderingPages.set(pages);
    }
    static { this.pdfJsPolyfilled = false; }
    clearTextLayer(container) {
        while (container.firstChild)
            container.removeChild(container.firstChild);
    }
    ensurePdfJsRuntimeCompatibility() {
        if (PdfDocumentViewerComponent.pdfJsPolyfilled)
            return;
        PdfDocumentViewerComponent.pdfJsPolyfilled = true;
        const promiseConstructor = Promise;
        if (!promiseConstructor.withResolvers) {
            Object.defineProperty(promiseConstructor, 'withResolvers', {
                value: () => {
                    let resolve;
                    let reject;
                    const promise = new Promise((resolvePromise, rejectPromise) => {
                        resolve = resolvePromise;
                        reject = rejectPromise;
                    });
                    return { promise, resolve, reject };
                },
                configurable: true,
                writable: true,
            });
        }
        const installGetOrInsert = (prototype) => {
            if (!prototype.getOrInsert) {
                Object.defineProperty(prototype, 'getOrInsert', {
                    value: function (key, value) {
                        const collection = this;
                        if (collection.has(key))
                            return collection.get(key);
                        collection.set(key, value);
                        return value;
                    },
                    configurable: true,
                    writable: true,
                });
            }
            if (!prototype.getOrInsertComputed) {
                Object.defineProperty(prototype, 'getOrInsertComputed', {
                    value: function (key, callback) {
                        const collection = this;
                        if (collection.has(key))
                            return collection.get(key);
                        const value = callback(key);
                        collection.set(key, value);
                        return value;
                    },
                    configurable: true,
                    writable: true,
                });
            }
        };
        installGetOrInsert(Map.prototype);
        if (typeof WeakMap !== 'undefined') {
            installGetOrInsert(WeakMap.prototype);
        }
    }
    openSearch() {
        this.searchOpen.set(true);
        setTimeout(() => {
            this.pdfSearchInput?.nativeElement.focus();
            this.pdfSearchInput?.nativeElement.select();
        });
    }
    async searchDocument() {
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
        const matches = [];
        const detailedMatches = [];
        try {
            for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
                if (token !== this.loadToken)
                    return;
                const page = await document.getPage(pageNumber);
                const content = await page.getTextContent();
                let textItemIndex = 0;
                const items = Array.isArray(content.items) ? content.items : [];
                items.forEach(item => {
                    if (!('str' in item))
                        return;
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
            if (matches.length)
                this.focusActiveMatch();
            else
                this.applySearchHighlights();
        }
        finally {
            this.searching.set(false);
        }
    }
    moveToMatch(direction) {
        const matches = this.matchPages();
        if (!matches.length)
            return;
        const current = this.activeMatchIndex();
        this.activeMatchIndex.set((current + direction + matches.length) % matches.length);
        this.focusActiveMatch();
    }
    focusActiveMatch() {
        const match = this.searchMatches[this.activeMatchIndex()];
        if (!match)
            return;
        this.pageNumber.set(match.page);
        const shell = this.pdfPageShells?.get(match.page - 1)?.nativeElement;
        const viewport = this.pdfViewport?.nativeElement;
        if (shell && viewport)
            viewport.scrollTo({ top: Math.max(0, shell.offsetTop - 12), behavior: 'smooth' });
        void this.renderPage(match.page).then(() => this.applySearchHighlights(match.page));
    }
    applySearchHighlights(pageNumber) {
        const active = this.searchMatches[this.activeMatchIndex()];
        const layers = [];
        if (pageNumber) {
            layers.push([pageNumber, this.textLayers.get(pageNumber)]);
        }
        else {
            this.textLayers.forEach((layer, page) => layers.push([page, layer]));
        }
        layers.forEach(([page, layer]) => {
            if (!layer)
                return;
            layer.textDivs.forEach(element => element.classList.remove('pdf-search-match', 'pdf-search-active'));
            this.searchMatches.forEach(match => {
                if (match.page !== page)
                    return;
                const element = layer.textDivs[match.item];
                if (!element)
                    return;
                element.classList.add('pdf-search-match');
                if (active?.page === match.page && active.item === match.item) {
                    element.classList.add('pdf-search-active');
                    setTimeout(() => element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' }));
                }
            });
        });
    }
    rotatedWidth(page) {
        return this.rotation() % 180 === 0 ? page.width : page.height;
    }
    rotatedHeight(page) {
        return this.rotation() % 180 === 0 ? page.height : page.width;
    }
    normalize(value) {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/gi, 'd')
            .toLowerCase();
    }
    static { this.ɵfac = function PdfDocumentViewerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PdfDocumentViewerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PdfDocumentViewerComponent, selectors: [["app-pdf-document-viewer"]], viewQuery: function PdfDocumentViewerComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
            i0.ɵɵviewQuery(_c1, 5);
            i0.ɵɵviewQuery(_c2, 5);
            i0.ɵɵviewQuery(_c3, 5);
            i0.ɵɵviewQuery(_c4, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pdfViewport = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pdfSearchInput = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pdfCanvases = _t);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pdfPageShells = _t);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pdfTextLayers = _t);
        } }, hostBindings: function PdfDocumentViewerComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("resize", function PdfDocumentViewerComponent_resize_HostBindingHandler() { return ctx.onResize(); }, false, i0.ɵɵresolveWindow)("keydown", function PdfDocumentViewerComponent_keydown_HostBindingHandler($event) { return ctx.onKeydown($event); }, false, i0.ɵɵresolveDocument);
        } }, inputs: { blob: "blob" }, outputs: { ready: "ready", failed: "failed" }, features: [i0.ɵɵNgOnChangesFeature], decls: 46, vars: 17, consts: [["pdfViewport", ""], ["pdfSearchInput", ""], ["pdfPageShell", ""], ["pdfCanvas", ""], ["pdfTextLayer", ""], [1, "h-full", "min-h-0", "flex", "flex-col", "bg-slate-100", "dark:bg-slate-950"], [1, "h-11", "shrink-0", "flex", "items-center", "gap-1.5", "px-2", "md:px-3", "bg-white", "dark:bg-slate-900", "border-b", "border-slate-200", "dark:border-slate-700", "overflow-x-auto", "scrollbar-none"], ["type", "button", "aria-label", "Trang tr\u01B0\u1EDBc", "title", "Trang tr\u01B0\u1EDBc", 1, "viewer-tool-button", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-left"], [1, "flex", "items-center", "h-8", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "px-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-200", "shrink-0"], [1, "hidden", "sm:inline", "mr-1.5", "text-slate-400"], ["type", "number", "min", "1", 1, "w-8", "bg-transparent", "text-center", "outline-none", "tabular-nums", 3, "change", "keydown.enter", "max", "ngModel"], [1, "text-slate-400", "mx-1"], [1, "tabular-nums"], ["type", "button", "aria-label", "Trang sau", "title", "Trang sau", 1, "viewer-tool-button", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-right"], [1, "w-px", "h-5", "bg-slate-200", "dark:bg-slate-700", "mx-0.5", "shrink-0"], ["type", "button", "aria-label", "Thu nh\u1ECF", "title", "Thu nh\u1ECF", 1, "viewer-tool-button", 3, "click"], [1, "fa-solid", "fa-minus"], [1, "h-8", "min-w-[62px]", "px-2", "flex", "items-center", "justify-center", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-200", "shrink-0"], ["type", "button", "aria-label", "Ph\u00F3ng to", "title", "Ph\u00F3ng to", 1, "viewer-tool-button", 3, "click"], [1, "fa-solid", "fa-plus"], ["type", "button", "aria-label", "V\u1EEBa chi\u1EC1u r\u1ED9ng", "title", "V\u1EEBa chi\u1EC1u r\u1ED9ng", 1, "viewer-tool-button", 3, "click"], [1, "fa-solid", "fa-arrows-left-right-to-line"], ["type", "button", "aria-label", "V\u1EEBa trang", "title", "V\u1EEBa trang", 1, "viewer-tool-button", "hidden", "sm:flex", 3, "click"], [1, "fa-regular", "fa-file"], ["type", "button", "aria-label", "Xoay t\u00E0i li\u1EC7u", "title", "Xoay t\u00E0i li\u1EC7u", 1, "viewer-tool-button", 3, "click"], [1, "fa-solid", "fa-rotate-right"], [1, "ml-auto", "flex", "items-center", "gap-1", "shrink-0"], [1, "flex", "items-center", "h-8", "rounded-lg", "border", "border-fuchsia-200", "dark:border-fuchsia-800", "bg-white", "dark:bg-slate-800", "overflow-hidden"], ["type", "button", "aria-label", "T\u00ECm trong PDF", "title", "T\u00ECm trong PDF", 1, "viewer-tool-button", 3, "click"], [1, "fa-solid", "fa-magnifying-glass"], [1, "flex-1", "min-h-0", "overflow-auto", "overscroll-contain", 3, "scroll", "touchstart", "touchend"], [1, "sticky", "top-0", "left-0", "z-30", "w-full", "h-full", "min-h-64", "flex", "items-center", "justify-center", "text-fuchsia-500"], [1, "pdf-pages", "p-2", "md:p-5"], [1, "pdf-page-shell", "relative", "bg-white", "shadow-xl", "ring-1", "ring-slate-900/10", 2, "--scale-round-x", "1px", "--scale-round-y", "1px", 3, "width", "height", "--total-scale-factor"], [1, "h-7", "shrink-0", "px-3", "flex", "items-center", "justify-between", "gap-2", "bg-white", "dark:bg-slate-900", "border-t", "border-slate-200", "dark:border-slate-700", "text-[10px]", "font-semibold", "text-slate-400"], [1, "truncate"], [1, "tabular-nums", "shrink-0"], [1, "hidden", "sm:inline", "shrink-0"], [1, "fa-solid", "fa-arrow-down", "mr-1"], ["type", "search", "placeholder", "T\u00ECm trong PDF", 1, "w-32", "md:w-48", "h-full", "px-2.5", "bg-transparent", "text-xs", "outline-none", "dark:text-white", 3, "ngModelChange", "keydown.enter", "ngModel"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-fuchsia-500", "mr-2"], [1, "text-[10px]", "font-bold", "text-slate-400", "mr-1.5", "tabular-nums"], ["type", "button", "aria-label", "K\u1EBFt qu\u1EA3 tr\u01B0\u1EDBc", 1, "w-7", "h-full", "text-slate-400", "hover:text-fuchsia-600", "disabled:opacity-30", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-up", "text-[10px]"], ["type", "button", "aria-label", "K\u1EBFt qu\u1EA3 sau", 1, "w-7", "h-full", "text-slate-400", "hover:text-fuchsia-600", "disabled:opacity-30", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-down", "text-[10px]"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-2xl"], [1, "pdf-page-shell", "relative", "bg-white", "shadow-xl", "ring-1", "ring-slate-900/10", 2, "--scale-round-x", "1px", "--scale-round-y", "1px"], [1, "absolute", "inset-0", "z-10", "bg-white/55", "flex", "items-center", "justify-center", "pointer-events-none"], [1, "absolute", "top-2", "right-2", "z-[3]", "px-2", "py-1", "rounded-md", "bg-slate-900/55", "text-white", "text-[10px]", "font-bold", "pointer-events-none"], [1, "block", "max-w-none"], [1, "pdf-text-layer", "textLayer"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-xl", "text-fuchsia-500"], [1, "fa-regular", "fa-copy", "mr-1"]], template: function PdfDocumentViewerComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 5)(1, "div", 6)(2, "button", 7);
            i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.previousPage()); });
            i0.ɵɵelement(3, "i", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "label", 9)(5, "span", 10);
            i0.ɵɵtext(6, "Trang");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "input", 11);
            i0.ɵɵlistener("change", function PdfDocumentViewerComponent_Template_input_change_7_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.goToPage($event.target.value)); })("keydown.enter", function PdfDocumentViewerComponent_Template_input_keydown_enter_7_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.goToPage($event.target.value)); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "span", 12);
            i0.ɵɵtext(9, "/");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "span", 13);
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "button", 14);
            i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.nextPage()); });
            i0.ɵɵelement(13, "i", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(14, "span", 16);
            i0.ɵɵelementStart(15, "button", 17);
            i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.zoomOut()); });
            i0.ɵɵelement(16, "i", 18);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "span", 19);
            i0.ɵɵtext(18);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "button", 20);
            i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.zoomIn()); });
            i0.ɵɵelement(20, "i", 21);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "button", 22);
            i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.setFitMode("width")); });
            i0.ɵɵelement(22, "i", 23);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "button", 24);
            i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.setFitMode("page")); });
            i0.ɵɵelement(24, "i", 25);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "button", 26);
            i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.rotate()); });
            i0.ɵɵelement(26, "i", 27);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "div", 28);
            i0.ɵɵtemplate(28, PdfDocumentViewerComponent_Conditional_28_Template, 9, 4, "div", 29);
            i0.ɵɵelementStart(29, "button", 30);
            i0.ɵɵlistener("click", function PdfDocumentViewerComponent_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.toggleSearch()); });
            i0.ɵɵelement(30, "i", 31);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "div", 32, 0);
            i0.ɵɵlistener("scroll", function PdfDocumentViewerComponent_Template_div_scroll_31_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onViewportScroll()); })("touchstart", function PdfDocumentViewerComponent_Template_div_touchstart_31_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onTouchStart($event)); })("touchend", function PdfDocumentViewerComponent_Template_div_touchend_31_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onTouchEnd($event)); });
            i0.ɵɵtemplate(33, PdfDocumentViewerComponent_Conditional_33_Template, 2, 0, "div", 33);
            i0.ɵɵelementStart(34, "div", 34);
            i0.ɵɵrepeaterCreate(35, PdfDocumentViewerComponent_For_36_Template, 9, 12, "section", 35, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(37, "div", 36)(38, "span", 37);
            i0.ɵɵtemplate(39, PdfDocumentViewerComponent_Conditional_39_Template, 2, 0)(40, PdfDocumentViewerComponent_Conditional_40_Template, 1, 0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "span", 38);
            i0.ɵɵtext(42);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "span", 39);
            i0.ɵɵelement(44, "i", 40);
            i0.ɵɵtext(45, "Cu\u1ED9n d\u1ECDc \u0111\u1EC3 xem trang ti\u1EBFp theo");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.pageNumber() <= 1);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("max", ctx.pageCount())("ngModel", ctx.pageNumber());
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.pageCount() || "\u2014");
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.pageNumber() >= ctx.pageCount());
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate1(" ", ctx.zoomLabel(), " ");
            i0.ɵɵadvance(3);
            i0.ɵɵclassProp("viewer-tool-active", ctx.fitMode() === "width");
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("viewer-tool-active", ctx.fitMode() === "page");
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.searchOpen() ? 28 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("viewer-tool-active", ctx.searchOpen());
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.loading() ? 33 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.pages());
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.hasSelectableText() ? 39 : 40);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate2("Trang ", ctx.pageNumber(), " / ", ctx.pageCount() || "\u2014", "");
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.MinValidator, i1.MaxValidator, i1.NgModel], styles: [".viewer-tool-button[_ngcontent-%COMP%] {\n      width: 2rem;\n      height: 2rem;\n      border-radius: .5rem;\n      color: #64748b;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      flex: 0 0 auto;\n      transition: color .15s, background-color .15s;\n    }\n    .viewer-tool-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n      color: #c026d3;\n      background: #f8fafc;\n    }\n    .viewer-tool-button[_ngcontent-%COMP%]:disabled { opacity: .35; cursor: not-allowed; }\n    .viewer-tool-active[_ngcontent-%COMP%] { color: #c026d3; background: #fdf4ff; }\n    .dark[_nghost-%COMP%]   .viewer-tool-button[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .viewer-tool-button[_ngcontent-%COMP%] { color: #cbd5e1; }\n    .dark[_nghost-%COMP%]   .viewer-tool-button[_ngcontent-%COMP%]:hover:not(:disabled), .dark   [_nghost-%COMP%]   .viewer-tool-button[_ngcontent-%COMP%]:hover:not(:disabled) { color: #f0abfc; background: #1e293b; }\n    .dark[_nghost-%COMP%]   .viewer-tool-active[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .viewer-tool-active[_ngcontent-%COMP%] { color: #f0abfc; background: rgba(112,26,117,.35); }\n    .pdf-pages[_ngcontent-%COMP%] {\n      min-width: 100%;\n      width: max-content;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      gap: 12px;\n    }\n    .pdf-page-shell[_ngcontent-%COMP%] {\n      flex: 0 0 auto;\n      overflow: hidden;\n      transition: width .12s ease, height .12s ease;\n    }\n    @media (min-width: 768px) {\n      .pdf-pages[_ngcontent-%COMP%] { gap: 20px; }\n    }\n    .pdf-text-layer[_ngcontent-%COMP%] {\n      position: absolute;\n      inset: 0;\n      overflow: clip;\n      line-height: 1;\n      text-align: initial;\n      transform-origin: 0 0;\n      z-index: 2;\n      pointer-events: auto;\n      -webkit-text-size-adjust: none;\n      text-size-adjust: none;\n      forced-color-adjust: none;\n      --min-font-size: 1;\n      --text-scale-factor: calc(var(--total-scale-factor) * var(--min-font-size));\n      --min-font-size-inv: calc(1 / var(--min-font-size));\n    }\n    [_nghost-%COMP%]     .pdf-text-layer :is(span, br) {\n      color: transparent;\n      position: absolute;\n      white-space: pre;\n      cursor: text;\n      transform-origin: 0% 0%;\n      user-select: text;\n    }\n    [_nghost-%COMP%]     .pdf-text-layer > :not(.markedContent), \n   [_nghost-%COMP%]     .pdf-text-layer .markedContent span:not(.markedContent) {\n      z-index: 1;\n      --font-height: 0;\n      font-size: calc(var(--text-scale-factor) * var(--font-height));\n      --scale-x: 1;\n      --rotate: 0deg;\n      transform: rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv));\n    }\n    [_nghost-%COMP%]     .pdf-text-layer .markedContent { display: contents; }\n    [_nghost-%COMP%]     .pdf-text-layer ::selection {\n      background: rgba(37, 99, 235, .38);\n      color: transparent;\n    }\n    [_nghost-%COMP%]     .pdf-text-layer .pdf-search-match {\n      background: rgba(250, 204, 21, .45);\n      border-radius: 2px;\n      box-shadow: 0 0 0 1px rgba(202, 138, 4, .35);\n    }\n    [_nghost-%COMP%]     .pdf-text-layer .pdf-search-active {\n      background: rgba(251, 146, 60, .62);\n      box-shadow: 0 0 0 2px #f97316;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PdfDocumentViewerComponent, [{
        type: Component,
        args: [{ selector: 'app-pdf-document-viewer', standalone: true, imports: [CommonModule, FormsModule], template: `
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
  `, styles: ["\n    .viewer-tool-button {\n      width: 2rem;\n      height: 2rem;\n      border-radius: .5rem;\n      color: #64748b;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      flex: 0 0 auto;\n      transition: color .15s, background-color .15s;\n    }\n    .viewer-tool-button:hover:not(:disabled) {\n      color: #c026d3;\n      background: #f8fafc;\n    }\n    .viewer-tool-button:disabled { opacity: .35; cursor: not-allowed; }\n    .viewer-tool-active { color: #c026d3; background: #fdf4ff; }\n    :host-context(.dark) .viewer-tool-button { color: #cbd5e1; }\n    :host-context(.dark) .viewer-tool-button:hover:not(:disabled) { color: #f0abfc; background: #1e293b; }\n    :host-context(.dark) .viewer-tool-active { color: #f0abfc; background: rgba(112,26,117,.35); }\n    .pdf-pages {\n      min-width: 100%;\n      width: max-content;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      gap: 12px;\n    }\n    .pdf-page-shell {\n      flex: 0 0 auto;\n      overflow: hidden;\n      transition: width .12s ease, height .12s ease;\n    }\n    @media (min-width: 768px) {\n      .pdf-pages { gap: 20px; }\n    }\n    .pdf-text-layer {\n      position: absolute;\n      inset: 0;\n      overflow: clip;\n      line-height: 1;\n      text-align: initial;\n      transform-origin: 0 0;\n      z-index: 2;\n      pointer-events: auto;\n      -webkit-text-size-adjust: none;\n      text-size-adjust: none;\n      forced-color-adjust: none;\n      --min-font-size: 1;\n      --text-scale-factor: calc(var(--total-scale-factor) * var(--min-font-size));\n      --min-font-size-inv: calc(1 / var(--min-font-size));\n    }\n    :host ::ng-deep .pdf-text-layer :is(span, br) {\n      color: transparent;\n      position: absolute;\n      white-space: pre;\n      cursor: text;\n      transform-origin: 0% 0%;\n      user-select: text;\n    }\n    :host ::ng-deep .pdf-text-layer > :not(.markedContent),\n    :host ::ng-deep .pdf-text-layer .markedContent span:not(.markedContent) {\n      z-index: 1;\n      --font-height: 0;\n      font-size: calc(var(--text-scale-factor) * var(--font-height));\n      --scale-x: 1;\n      --rotate: 0deg;\n      transform: rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv));\n    }\n    :host ::ng-deep .pdf-text-layer .markedContent { display: contents; }\n    :host ::ng-deep .pdf-text-layer ::selection {\n      background: rgba(37, 99, 235, .38);\n      color: transparent;\n    }\n    :host ::ng-deep .pdf-text-layer .pdf-search-match {\n      background: rgba(250, 204, 21, .45);\n      border-radius: 2px;\n      box-shadow: 0 0 0 1px rgba(202, 138, 4, .35);\n    }\n    :host ::ng-deep .pdf-text-layer .pdf-search-active {\n      background: rgba(251, 146, 60, .62);\n      box-shadow: 0 0 0 2px #f97316;\n    }\n  "] }]
    }], null, { blob: [{
            type: Input,
            args: [{ required: true }]
        }], ready: [{
            type: Output
        }], failed: [{
            type: Output
        }], pdfCanvases: [{
            type: ViewChildren,
            args: ['pdfCanvas']
        }], pdfPageShells: [{
            type: ViewChildren,
            args: ['pdfPageShell']
        }], pdfTextLayers: [{
            type: ViewChildren,
            args: ['pdfTextLayer']
        }], pdfViewport: [{
            type: ViewChild,
            args: ['pdfViewport']
        }], pdfSearchInput: [{
            type: ViewChild,
            args: ['pdfSearchInput']
        }], onResize: [{
            type: HostListener,
            args: ['window:resize']
        }], onKeydown: [{
            type: HostListener,
            args: ['document:keydown', ['$event']]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PdfDocumentViewerComponent, { className: "PdfDocumentViewerComponent", filePath: "src/app/features/documents/pdf-document-viewer.component.ts", lineNumber: 261 }); })();
//# sourceMappingURL=pdf-document-viewer.component.js.map