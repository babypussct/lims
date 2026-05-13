
import { Component, inject, signal, computed, effect, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { StateService } from '../../core/services/state.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import JsBarcode from 'jsbarcode';
import * as QRCode from 'qrcode';

type PrintMode = 'brother' | 'tomy_a4' | 'plain_a4';
type DisplayFormat = 'text' | 'barcode' | 'barcode_text' | 'qrcode' | 'qrcode_text' | 'qrcode_hybrid';

interface TomyTemplate {
  id: string;
  name: string;
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
  marginTop: number;
  marginLeft: number;
  gapX: number;
  gapY: number;
}

const TOMY_TEMPLATES: TomyTemplate[] = [
  { id: 'tomy_145', name: 'Tomy 145 (65 tem - 38x21mm)', cols: 5, rows: 13, cellW: 38, cellH: 21, marginTop: 12, marginLeft: 10, gapX: 0, gapY: 0 },
  { id: 'tomy_149', name: 'Tomy 149 (21 tem - 70x42.5mm)', cols: 3, rows: 7, cellW: 70, cellH: 42.5, marginTop: 0, marginLeft: 0, gapX: 0, gapY: 0 },
  { id: 'tomy_144', name: 'Tomy 144 (30 tem - 67x28mm)', cols: 3, rows: 10, cellW: 67, cellH: 28, marginTop: 8.5, marginLeft: 4.5, gapX: 0, gapY: 0 },
  { id: 'tomy_109', name: 'Tomy 109 (96 tem - 22x14mm)', cols: 8, rows: 12, cellW: 22, cellH: 14, marginTop: 64.5, marginLeft: 17, gapX: 0, gapY: 0 },
];

interface LabelCell {
  subLabels: string[];
  isEmpty: boolean;
  index: number;
}

interface LabelPage {
  cells: LabelCell[];
  pageIndex: number;
}

@Component({
  selector: 'app-label-print',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './label-print.component.html',
  styles: [`
    .label-std { display: block; font-size: 11px; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }
    .label-mini { display: block; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }
    .input-std { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; font-size: 13px; font-weight: 600; color: #1e293b; outline: none; transition: all; }
    .input-std:focus { border-color: #3b82f6; ring: 2px; ring-color: #bfdbfe; }
    .input-mini { width: 100%; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px; font-size: 11px; font-weight: 700; text-align: center; outline: none; }
    .input-mini:focus { background-color: white; border-color: #3b82f6; }
    
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  `]
})
export class LabelPrintComponent implements AfterViewInit {
  Math = Math;
  toast = inject(ToastService);
  state = inject(StateService);

  @ViewChild('previewContainer') previewContainer!: ElementRef;

  @Input() set initialData(value: string) {
    if (value) {
      this.rawInput.set(value);
      this.displayFormat.set('qrcode_text');
    }
  }

  // Core State
  printMode = signal<PrintMode>('tomy_a4');
  rawInput = signal('');
  zoomLevel = signal(1.0);
  
  // Input Debounce
  private inputSubject = new Subject<string>();

  // Fetch Data State
  fetchDate = signal<string>(new Date().toISOString().split('T')[0]);
  
  // Layout Config
  splitCount = signal<number>(1);
  fontSize = signal<number>(12);
  rotateText = signal<boolean>(false);
  displayFormat = signal<DisplayFormat>('text');
  barcodeWidth = signal<number>(1.5);
  barcodeHeight = signal<number>(30);
  
  // Content Alignment & Padding
  alignX = signal<'flex-start' | 'center' | 'flex-end'>('center');
  alignY = signal<'flex-start' | 'center' | 'flex-end'>('center');
  padTop = signal<number>(2);
  padBottom = signal<number>(2);
  padLeft = signal<number>(2);
  padRight = signal<number>(2);
  
  // Tomy Config
  tomyTemplates = TOMY_TEMPLATES;
  selectedTomyId = signal<string>('tomy_145');
  
  // Plain A4 Config
  plainCols = signal<number>(4);
  plainRows = signal<number>(10);
  showCutLines = signal<boolean>(true);
  
  // Sheet Calibration (A4/A5)
  marginTop = signal<number>(10); 
  marginLeft = signal<number>(5); 
  gapX = signal<number>(2);
  gapY = signal<number>(2);
  skippedCells = signal<number>(0);
  showAdvanced = signal(false);

  // GS1 Config
  gs1Domain = signal<string>('https://nafiqpm6.vercel.app');
  gs1Gtin = signal<string>('08934567890128');

  // Brother Config
  brotherPaperType = signal<string>('62');
  brotherWidth = signal<number>(62);
  brotherLabelHeight = signal<number>(25); // For continuous
  brotherPageHeight = signal<number>(90); // For fixed
  brotherCols = signal<number>(1);
  brotherRows = signal<number>(1);
  brotherShowCutLines = signal<boolean>(false);

  isBrotherFixed = computed(() => ['29x90', '29x42', '32x32', '23x23'].includes(this.brotherPaperType()));

  actualBrotherPageHeight = computed(() => {
      if (this.isBrotherFixed()) return this.brotherPageHeight();
      const labels = this.parseInput(this.rawInput());
      const cols = Math.max(1, this.brotherCols());
      const rows = Math.max(1, Math.ceil(labels.length / cols));
      return this.brotherLabelHeight() * rows;
  });

  actualBrotherLabelHeight = computed(() => {
      if (this.isBrotherFixed()) return this.brotherPageHeight() / Math.max(1, this.brotherRows());
      return this.brotherLabelHeight();
  });

  // Computed
  rawInputCount = computed(() => this.parseInput(this.rawInput()).length);

  brotherPages = computed(() => {
      const labels = this.parseInput(this.rawInput());
      if (labels.length === 0) return [];
      const cols = Math.max(1, this.brotherCols());
      
      if (!this.isBrotherFixed()) {
          // Continuous roll: All labels in ONE single page
          const totalCells = Math.ceil(labels.length / cols) * cols;
          const page = [...labels];
          while (page.length < totalCells) page.push('');
          return [page];
      } else {
          // Fixed size: Split into multiple pages
          const rows = Math.max(1, this.brotherRows());
          const perPage = cols * rows;
          const pages: string[][] = [];
          for (let i = 0; i < labels.length; i += perPage) {
              const chunk = labels.slice(i, i + perPage);
              while (chunk.length < perPage) {
                  chunk.push(''); // Fill empty cells
              }
              pages.push(chunk);
          }
          return pages;
      }
  });

  layoutDims = computed(() => {
      const mode = this.printMode();

      if (mode === 'tomy_a4') {
          const tmpl = this.tomyTemplates.find(t => t.id === this.selectedTomyId()) || this.tomyTemplates[0];
          return { pageW: 210, pageH: 297, cellW: tmpl.cellW, cellH: tmpl.cellH, cols: tmpl.cols, rows: tmpl.rows }; 
      } else if (mode === 'plain_a4') {
          const c = this.plainCols();
          const r = this.plainRows();
          const w = (210 - this.marginLeft() * 2 - this.gapX() * (c - 1)) / c;
          const h = (297 - this.marginTop() * 2 - this.gapY() * (r - 1)) / r;
          return { pageW: 210, pageH: 297, cellW: w, cellH: h, cols: c, rows: r };
      }
      return { pageW: 0, pageH: 0, cellW: 0, cellH: 0, cols: 0, rows: 0 };
  });

  constructor() {
      // Setup Debounce for Input
      this.inputSubject.pipe(
          debounceTime(300),
          distinctUntilChanged()
      ).subscribe(val => {
          this.rawInput.set(val);
      });

      // Load saved config from localStorage
      this.loadProfile('tomy_a4'); // Load default profile first

      // Save config to localStorage whenever it changes
      effect(() => {
          this.saveCurrentProfile();
      });
  }

  ngAfterViewInit() {
      // Auto fit to screen on load
      setTimeout(() => this.fitToScreen(), 100);
  }

  // --- PROFILE MANAGEMENT ---
  private getProfileKey(mode: PrintMode): string {
      return `labelPrintConfig_${mode}`;
  }

  private loadProfile(mode: PrintMode) {
      const saved = localStorage.getItem(this.getProfileKey(mode));
      if (saved) {
          try {
              const config = JSON.parse(saved);
              // Common
              if (config.fontSize) this.fontSize.set(config.fontSize);
              if (config.rotateText !== undefined) this.rotateText.set(config.rotateText);
              if (config.splitCount) this.splitCount.set(config.splitCount);
              if (config.displayFormat) this.displayFormat.set(config.displayFormat);
              if (config.barcodeWidth) this.barcodeWidth.set(config.barcodeWidth);
              if (config.barcodeHeight) this.barcodeHeight.set(config.barcodeHeight);
              if (config.alignX) this.alignX.set(config.alignX);
              if (config.alignY) this.alignY.set(config.alignY);
              if (config.padTop !== undefined) this.padTop.set(config.padTop);
              if (config.padBottom !== undefined) this.padBottom.set(config.padBottom);
              if (config.padLeft !== undefined) this.padLeft.set(config.padLeft);
              if (config.padRight !== undefined) this.padRight.set(config.padRight);
              
              // Brother
              if (mode === 'brother') {
                  if (config.brotherPaperType) this.brotherPaperType.set(config.brotherPaperType);
                  if (config.brotherCols) this.brotherCols.set(config.brotherCols);
                  if (config.brotherRows) this.brotherRows.set(config.brotherRows);
                  if (config.brotherShowCutLines !== undefined) this.brotherShowCutLines.set(config.brotherShowCutLines);
                  if (config.brotherWidth) this.brotherWidth.set(config.brotherWidth);
                  if (config.brotherLabelHeight) this.brotherLabelHeight.set(config.brotherLabelHeight);
                  if (config.brotherPageHeight) this.brotherPageHeight.set(config.brotherPageHeight);
                  
                  // Migration from old brotherHeight
                  if (config.brotherHeight && !config.brotherLabelHeight && !config.brotherPageHeight) {
                      if (['29x90', '29x42', '32x32', '23x23'].includes(config.brotherPaperType)) {
                          this.brotherPageHeight.set(config.brotherHeight);
                      } else {
                          this.brotherLabelHeight.set(config.brotherHeight);
                      }
                  }
              }
              
              // Tomy
              if (mode === 'tomy_a4') {
                  if (config.selectedTomyId) this.selectedTomyId.set(config.selectedTomyId);
                  if (config.marginTop !== undefined) this.marginTop.set(config.marginTop);
                  if (config.marginLeft !== undefined) this.marginLeft.set(config.marginLeft);
                  if (config.gapX !== undefined) this.gapX.set(config.gapX);
                  if (config.gapY !== undefined) this.gapY.set(config.gapY);
              }
              
              // Plain A4
              if (mode === 'plain_a4') {
                  if (config.plainCols) this.plainCols.set(config.plainCols);
                  if (config.plainRows) this.plainRows.set(config.plainRows);
                  if (config.marginTop !== undefined) this.marginTop.set(config.marginTop);
                  if (config.marginLeft !== undefined) this.marginLeft.set(config.marginLeft);
                  if (config.gapX !== undefined) this.gapX.set(config.gapX);
                  if (config.gapY !== undefined) this.gapY.set(config.gapY);
                  if (config.showCutLines !== undefined) this.showCutLines.set(config.showCutLines);
              }
          } catch (e) {
              console.error(`Failed to load print config for ${mode}`, e);
          }
      } else {
          // Apply defaults if no profile exists
          this.applyDefaultsForMode(mode);
      }
  }

  private saveCurrentProfile() {
      const mode = this.printMode();
      const config: any = {
          fontSize: this.fontSize(),
          rotateText: this.rotateText(),
          splitCount: this.splitCount(),
          displayFormat: this.displayFormat(),
          barcodeWidth: this.barcodeWidth(),
          barcodeHeight: this.barcodeHeight(),
          alignX: this.alignX(),
          alignY: this.alignY(),
          padTop: this.padTop(),
          padBottom: this.padBottom(),
          padLeft: this.padLeft(),
          padRight: this.padRight()
      };

      if (mode === 'brother') {
          config.brotherPaperType = this.brotherPaperType();
          config.brotherCols = this.brotherCols();
          config.brotherRows = this.brotherRows();
          config.brotherShowCutLines = this.brotherShowCutLines();
          config.brotherWidth = this.brotherWidth();
          config.brotherLabelHeight = this.brotherLabelHeight();
          config.brotherPageHeight = this.brotherPageHeight();
      } else if (mode === 'tomy_a4') {
          config.selectedTomyId = this.selectedTomyId();
          config.marginTop = this.marginTop();
          config.marginLeft = this.marginLeft();
          config.gapX = this.gapX();
          config.gapY = this.gapY();
      } else if (mode === 'plain_a4') {
          config.plainCols = this.plainCols();
          config.plainRows = this.plainRows();
          config.marginTop = this.marginTop();
          config.marginLeft = this.marginLeft();
          config.gapX = this.gapX();
          config.gapY = this.gapY();
          config.showCutLines = this.showCutLines();
      }

      localStorage.setItem(this.getProfileKey(mode), JSON.stringify(config));
      // Also save the last used mode
      localStorage.setItem('labelPrintLastMode', mode);
  }

  private applyDefaultsForMode(mode: PrintMode) {
      if (mode === 'brother') {
          this.onBrotherPaperChange('62');
      } else if (mode === 'tomy_a4') {
          this.onTomyChange('tomy_145');
      } else if (mode === 'plain_a4') {
          this.marginTop.set(10);
          this.marginLeft.set(10);
          this.gapX.set(0);
          this.gapY.set(0);
          this.splitCount.set(1);
          this.rotateText.set(false);
          this.fontSize.set(10);
          this.plainCols.set(4);
          this.plainRows.set(10);
          this.showCutLines.set(true);
      }
  }

  setMode(mode: PrintMode) {
      if (this.printMode() === mode) return;
      
      // Save current profile before switching
      this.saveCurrentProfile();
      
      this.printMode.set(mode);
      
      // Load profile for new mode
      this.loadProfile(mode);
      
      // Reset view defaults
      setTimeout(() => this.fitToScreen(), 50);
  }

  onTomyChange(id: string) {
      this.selectedTomyId.set(id);
      const tmpl = this.tomyTemplates.find(t => t.id === id);
      if (tmpl) {
          this.marginTop.set(tmpl.marginTop);
          this.marginLeft.set(tmpl.marginLeft);
          this.gapX.set(tmpl.gapX);
          this.gapY.set(tmpl.gapY);
          this.splitCount.set(1);
          this.rotateText.set(false);
      }
  }

  onBrotherPaperChange(type: string) {
      this.brotherPaperType.set(type);
      if (type === '62') {
          this.brotherWidth.set(62);
          this.brotherLabelHeight.set(25);
          this.fontSize.set(16);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
      } else if (type === '29') {
          this.brotherWidth.set(29);
          this.brotherLabelHeight.set(15);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
      } else if (type === '29x90') {
          this.brotherWidth.set(29);
          this.brotherPageHeight.set(90);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(6); // 6 labels of 15mm
      } else if (type === '29x42') {
          this.brotherWidth.set(29);
          this.brotherPageHeight.set(42);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(3); // 3 labels of 14mm
      } else if (type === '32x32') {
          this.brotherWidth.set(32);
          this.brotherPageHeight.set(32);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
      } else if (type === '23x23') {
          this.brotherWidth.set(23);
          this.brotherPageHeight.set(23);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
      } else if (type === '12') {
          this.brotherWidth.set(12);
          this.brotherLabelHeight.set(30);
          this.fontSize.set(10);
          this.rotateText.set(true);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
      }
  }

  fetchFromRequests() {
      const targetDate = this.fetchDate();
      if (!targetDate) return;

      const approvedReqs = this.state.approvedRequests();
      const samples = new Set<string>();

      approvedReqs.forEach(req => {
          // Lấy ngày phân tích hoặc ngày duyệt
          let reqDateStr = '';
          if (req.analysisDate) {
              reqDateStr = req.analysisDate;
          } else {
              const ts = req.approvedAt || req.timestamp;
              const d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
              reqDateStr = d.toISOString().split('T')[0];
          }

          if (reqDateStr === targetDate && req.sampleList && req.sampleList.length > 0) {
              req.sampleList.forEach(s => samples.add(s));
          }
      });

      if (samples.size === 0) {
          this.toast.show(`Không tìm thấy mẫu nào trong các yêu cầu đã duyệt ngày ${targetDate}`, 'info');
          return;
      }

      const currentInput = this.rawInput().trim();
      const newSamples = Array.from(samples).join('\n');
      
      if (currentInput) {
          this.rawInput.set(currentInput + '\n' + newSamples);
      } else {
          this.rawInput.set(newSamples);
      }
      
      this.toast.show(`Đã thêm ${samples.size} mã mẫu từ ngày ${targetDate}`, 'success');
  }

  onInputChanged(val: string) {
      this.inputSubject.next(val);
  }

  updateInput(val: string) { this.rawInput.set(val); }
  clearInput() { 
      this.rawInput.set(''); 
      this.inputSubject.next('');
  }
  
  removeDuplicates() {
      const labels = this.parseInput(this.rawInput());
      const unique = [...new Set(labels)];
      const newVal = unique.join('\n');
      this.rawInput.set(newVal);
      this.inputSubject.next(newVal);
      this.toast.show(`Đã lọc bỏ ${labels.length - unique.length} mã trùng lặp`, 'success');
  }

  sortInput() {
      const labels = this.parseInput(this.rawInput());
      const sorted = labels.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      const newVal = sorted.join('\n');
      this.rawInput.set(newVal);
      this.inputSubject.next(newVal);
      this.toast.show('Đã sắp xếp danh sách A-Z', 'success');
  }

  addExample() {
      const ex = Array.from({length: 15}, (_, i) => `STD-${(i+1).toString().padStart(3,'0')}`).join('\n');
      this.rawInput.set(ex);
      this.inputSubject.next(ex);
  }

  adjustZoom(delta: number) {
      this.zoomLevel.update(z => Math.max(0.3, Math.min(3.0, z + delta)));
  }

  fitToScreen() {
      if (!this.previewContainer) return;
      
      const containerWidth = this.previewContainer.nativeElement.clientWidth - 64; // 64px padding
      const mode = this.printMode();
      
      let targetWidthMM = 210; // A4 width
      if (mode === 'brother') {
          targetWidthMM = this.brotherWidth();
      }
      
      // Convert mm to pixels (approximate 1mm = 3.78px)
      const targetWidthPx = targetWidthMM * 3.78;
      
      if (targetWidthPx > 0) {
          // Calculate zoom to fit width (with a max of 2.0)
          const newZoom = Math.min(2.0, Math.max(0.3, containerWidth / targetWidthPx));
          // Round to 1 decimal place
          this.zoomLevel.set(Math.round(newZoom * 10) / 10);
      }
  }

  parseInput(text: string): string[] {
      return text.split(/[\n,;]+/).map(s => s.trim()).filter(s => s !== '');
  }

  // --- SHEET LOGIC ---
  pages = computed<LabelPage[]>(() => {
      if (this.printMode() === 'brother') return [];

      const rawIds = this.parseInput(this.rawInput());
      const split = this.splitCount();
      const skipped = this.skippedCells();
      
      // Calculate cells per page based on layout
      const dims = this.layoutDims();
      const cols = dims.cols || 1;
      const rows = dims.rows || 1;
      const CELLS_PER_PAGE = cols * rows;
      
      const allCells: LabelCell[] = [];
      let globalCellIndex = 0;

      // Fill Skipped
      for(let i=0; i<skipped; i++) {
          allCells.push({ subLabels: [], isEmpty: true, index: globalCellIndex++ });
      }

      // Fill Data
      let currentSub: string[] = [];
      for(const id of rawIds) {
          currentSub.push(id);
          if(currentSub.length === split) {
              allCells.push({ subLabels: [...currentSub], isEmpty: false, index: globalCellIndex++ });
              currentSub = [];
          }
      }
      if(currentSub.length > 0) {
          allCells.push({ subLabels: [...currentSub], isEmpty: false, index: globalCellIndex++ });
      }

      // Pagination
      const pages: LabelPage[] = [];
      for (let i = 0; i < allCells.length; i += CELLS_PER_PAGE) {
          const pageCells = allCells.slice(i, i + CELLS_PER_PAGE);
          while(pageCells.length < CELLS_PER_PAGE) {
              pageCells.push({ subLabels: [], isEmpty: true, index: -1 });
          }
          pages.push({ cells: pageCells, pageIndex: pages.length });
      }
      
      if (pages.length === 0 && rawIds.length === 0) {
           const emptyCells = Array(CELLS_PER_PAGE).fill(null).map((_, idx) => ({ 
               subLabels: [], isEmpty: true, index: idx < skipped ? idx : -1 
           }));
           pages.push({ cells: emptyCells, pageIndex: 0 });
      }

      return pages;
  });

  generateBarcode(text: string): string {
      if (!text) return '';
      
      const format = this.displayFormat();
      if (format === 'qrcode' || format === 'qrcode_text' || format === 'qrcode_hybrid') {
          try {
              let qrText = text;
              if (format === 'qrcode_hybrid') {
                  const domain = this.gs1Domain().replace(/\/$/, '');
                  const gtin = this.gs1Gtin();
                  // We use the text as LIMS ID. We don't have lot/expiry here easily, 
                  // but we can construct the basic URL.
                  qrText = `${domain}/01/${gtin}?240=${encodeURIComponent(text)}`;
              }
              const qrcode = QRCode.create(qrText, { errorCorrectionLevel: 'M' });
              const canvas = document.createElement('canvas');
              const size = qrcode.modules.size;
              const scale = Math.max(1, Math.floor(this.barcodeWidth() * 2)); // Use barcodeWidth as scale factor
              const margin = 2;
              const actualSize = size + margin * 2;
              canvas.width = actualSize * scale;
              canvas.height = actualSize * scale;
              const ctx = canvas.getContext('2d');
              if (!ctx) return '';
              
              // Fill background
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Draw modules
              ctx.fillStyle = '#000000';
              for (let row = 0; row < size; row++) {
                  for (let col = 0; col < size; col++) {
                      if (qrcode.modules.get(row, col)) {
                          ctx.fillRect((col + margin) * scale, (row + margin) * scale, scale, scale);
                      }
                  }
              }
              return canvas.toDataURL('image/png');
          } catch (e) {
              console.error('QR Code error:', e);
              return '';
          }
      }

      try {
          const canvas = document.createElement('canvas');
          JsBarcode(canvas, text, {
              format: "CODE128",
              width: this.barcodeWidth(),
              height: this.barcodeHeight(),
              displayValue: false,
              margin: 0,
              background: "transparent"
          });
          return canvas.toDataURL('image/png');
      } catch (e) {
          console.error('Barcode error:', e);
          return '';
      }
  }

  // --- HELPER: Print HTML via hidden iframe (bypass popup blocker) ---
  private printViaIframe(htmlContent: string) {
      // Remove any existing print iframe
      const existingFrame = document.getElementById('lims-print-frame');
      if (existingFrame) existingFrame.remove();

      const iframe = document.createElement('iframe');
      iframe.id = 'lims-print-frame';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
          this.toast.show('Không thể tạo khung in. Thử lại.', 'error');
          return;
      }

      doc.open();
      doc.write(htmlContent);
      doc.close();

      // Wait for iframe content (especially images) to fully load before printing
      const iframeWin = iframe.contentWindow;
      if (!iframeWin) return;

      const doPrint = () => {
          try {
              iframeWin.focus();
              iframeWin.print();
          } catch (e) {
              console.error('Print error:', e);
              this.toast.show('Lỗi khi in. Vui lòng thử lại.', 'error');
          }
          // Clean up after print dialog closes
          setTimeout(() => iframe.remove(), 2000);
      };

      const format = this.displayFormat();
      if (format !== 'text') {
          // Images need time to render - use load event with fallback
          let loaded = false;
          iframeWin.onload = () => {
              if (!loaded) { loaded = true; setTimeout(doPrint, 200); }
          };
          // Fallback in case onload already fired
          setTimeout(() => { if (!loaded) { loaded = true; doPrint(); } }, 800);
      } else {
          // Text-only: can print immediately after DOM write
          setTimeout(doPrint, 100);
      }
  }

  // --- BROTHER PRINTING LOGIC ---
  printBrother() {
      const pages = this.brotherPages();
      if (pages.length === 0) return;

      const w = this.brotherWidth();
      const h = this.actualBrotherPageHeight();
      const fs = this.fontSize() || 16;
      const rotate = this.rotateText();
      const cols = Math.max(1, this.brotherCols());
      const rows = this.isBrotherFixed() ? Math.max(1, this.brotherRows()) : Math.max(1, Math.ceil(pages[0].length / cols));
      const showCut = this.brotherShowCutLines();

      const css = `
        @page { size: ${w}mm ${h}mm; margin: 0; padding: 0; }
        html, body { 
            margin: 0; 
            padding: 0; 
            width: ${w}mm; 
            height: ${h}mm; 
            overflow: hidden; /* Ngăn chặn trình duyệt tự sinh trang trắng thừa */
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
            background: white; 
            color: black; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
        }
        * { box-sizing: border-box; }
        .page-container {
            width: ${w}mm;
            height: ${h}mm;
            page-break-inside: avoid;
            overflow: hidden;
            position: relative;
            display: grid;
            grid-template-columns: repeat(${cols}, 1fr);
            grid-template-rows: repeat(${rows}, 1fr);
        }
        .page-container:not(:last-child) {
            page-break-after: always;
        }
        .cell {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 2px;
            container-type: size;
            width: 100%;
            height: 100%;
        }
        ${showCut ? `
        .cell {
            border-right: 1px dashed #475569;
            border-bottom: 1px dashed #475569;
        }
        .cell:nth-child(${cols}n) { border-right: none; }
        .cell:nth-last-child(-n+${cols}) { border-bottom: none; }
        ` : ''}
        .label-content {
            display: flex;
            flex-direction: column;
            align-items: ${this.alignX()};
            justify-content: ${this.alignY()};
            padding: ${this.padTop()}mm ${this.padRight()}mm ${this.padBottom()}mm ${this.padLeft()}mm;
            box-sizing: border-box;
            overflow: hidden;
            ${rotate ? `
            transform: rotate(-90deg);
            width: 100cqh;
            height: 100cqw;
            ` : `
            width: 100cqw;
            height: 100cqh;
            `}
        }
        .label-text {
            font-size: ${fs}pt;
            font-weight: bold;
            text-align: ${this.alignX() === 'flex-start' ? 'left' : this.alignX() === 'flex-end' ? 'right' : 'center'};
            line-height: 1.2;
            word-break: break-all;
            width: 100%;
        }
        @media print {
            @page { size: ${w}mm ${h}mm; margin: 0; }
            body { margin: 0; }
        }
      `;

      let htmlContent = `<html><head><title>Brother Print</title><style>${css}</style></head><body>`;
      
      pages.forEach(page => {
          htmlContent += `<div class="page-container">`;
          page.forEach(label => {
              htmlContent += `<div class="cell"><div class="label-content">`;
              if (label) {
                  if (this.displayFormat() !== 'text') {
                      const barcodeSrc = this.generateBarcode(label);
                      htmlContent += `<img src="${barcodeSrc}" style="height: ${this.barcodeHeight()}px; max-width: 100%; object-fit: contain;" />`;
                  }
                  if (this.displayFormat() !== 'barcode' && this.displayFormat() !== 'qrcode') {
                      htmlContent += `<div class="label-text" style="${(this.displayFormat() === 'barcode_text' || this.displayFormat() === 'qrcode_text' || this.displayFormat() === 'qrcode_hybrid') ? 'margin-top: 2px;' : ''}">${label}</div>`;
                  }
              }
              htmlContent += `</div></div>`;
          });
          htmlContent += `</div>`;
      });

      htmlContent += `</body></html>`;

      this.printViaIframe(htmlContent);
  }

  // --- A4 PRINTING LOGIC (Direct Window Print) ---
  printA4() {
      const pages = this.pages();
      const validPages = pages.filter(p => p.cells.some(c => !c.isEmpty) || p.pageIndex === 0);
      
      if (this.rawInputCount() === 0 && this.skippedCells() === 0) return;

      const dims = this.layoutDims();
      const isPlain = this.printMode() === 'plain_a4';
      const showCut = isPlain && this.showCutLines();

      const css = `
        @page { size: A4 portrait; margin: 0; }
        body { margin: 0; padding: 0; font-family: 'Roboto Mono', monospace; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        * { box-sizing: border-box; }
        .page {
            width: 210mm;
            height: 297mm;
            padding-top: ${this.marginTop()}mm;
            padding-left: ${this.marginLeft()}mm;
            padding-right: ${this.marginLeft()}mm;
            padding-bottom: ${this.marginTop()}mm;
            page-break-after: always;
            page-break-inside: avoid;
            position: relative;
            overflow: hidden;
            background: white;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(${dims.cols}, ${dims.cellW}mm);
            grid-template-rows: repeat(${dims.rows}, ${dims.cellH}mm);
            gap: ${this.gapY()}mm ${this.gapX()}mm;
            align-content: start;
            justify-content: start;
        }
        .cell {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            ${showCut ? 'border: 1px dashed #475569;' : ''}
        }
        .sub-label {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 0.5mm;
            overflow: hidden;
            container-type: size;
            width: 100%;
            height: 100%;
        }
        .sub-label:not(:last-child) {
            border-bottom: 1px dashed #475569;
        }
        .label-content {
            display: flex;
            flex-direction: column;
            align-items: ${this.alignX()};
            justify-content: ${this.alignY()};
            padding: ${this.padTop()}mm ${this.padRight()}mm ${this.padBottom()}mm ${this.padLeft()}mm;
            box-sizing: border-box;
            overflow: hidden;
            ${this.rotateText() ? `
            transform: rotate(-90deg);
            width: 100cqh;
            height: 100cqw;
            ` : `
            width: 100cqw;
            height: 100cqh;
            `}
        }
        .text {
            font-size: ${this.fontSize()}pt;
            font-weight: bold;
            text-align: ${this.alignX() === 'flex-start' ? 'left' : this.alignX() === 'flex-end' ? 'right' : 'center'};
            line-height: 1.2;
            word-break: break-all;
            width: 100%;
        }
        @media print {
            @page { margin: 0; }
            body { margin: 0; }
        }
      `;

      let htmlContent = `<html><head><title>Print A4 Labels</title><style>${css}</style></head><body>`;
      
      validPages.forEach(page => {
          htmlContent += `<div class="page"><div class="grid">`;
          page.cells.forEach(cell => {
              if (cell.isEmpty) {
                  htmlContent += `<div class="cell" style="opacity: 0;"></div>`;
              } else {
                  htmlContent += `<div class="cell">`;
                  cell.subLabels.forEach((label, idx) => {
                      const isLast = idx === cell.subLabels.length - 1;
                      htmlContent += `
                        <div class="sub-label" ${!isLast ? '' : 'style="border-bottom: none;"'}>
                            <div class="label-content">
                      `;
                      if (label) {
                          if (this.displayFormat() !== 'text') {
                              const barcodeSrc = this.generateBarcode(label);
                              htmlContent += `<img src="${barcodeSrc}" style="height: ${this.barcodeHeight()}px; max-width: 100%; object-fit: contain;" />`;
                          }
                          if (this.displayFormat() !== 'barcode' && this.displayFormat() !== 'qrcode') {
                              htmlContent += `<span class="text" style="${(this.displayFormat() === 'barcode_text' || this.displayFormat() === 'qrcode_text' || this.displayFormat() === 'qrcode_hybrid') ? 'margin-top: 2px;' : ''}">${label}</span>`;
                          }
                      }
                      htmlContent += `</div></div>`;
                  });
                  htmlContent += `</div>`;
              }
          });
          htmlContent += `</div></div>`;
      });

      htmlContent += `</body></html>`;

      this.printViaIframe(htmlContent);
  }
}
