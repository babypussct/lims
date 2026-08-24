import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import * as XLSX from 'xlsx';
import { StateService } from '../../core/services/state.service';
import { ExcelDocumentViewerComponent } from './excel-document-viewer.component';

const EXCEL_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Component({
  selector: 'app-excel-document-demo',
  standalone: true,
  imports: [CommonModule, ExcelDocumentViewerComponent],
  template: `
    <main class="excel-demo-page">
      <header class="excel-demo-header">
        <div class="min-w-0">
          <div class="excel-demo-eyebrow">
            <i class="fa-solid fa-flask-vial"></i>
            LIMS NAFIQPM6 · DEV DEMO
          </div>
          <h1>Trình diễn Excel</h1>
      <p>Workbook mẫu với nhiều sheet, ô hợp nhất, công thức, ngày giờ và kích thước hàng/cột tùy chỉnh.</p>
        </div>
        <div class="excel-demo-actions">
          <button type="button" (click)="regenerate()" title="Dựng lại workbook mẫu">
            <i class="fa-solid fa-rotate-right"></i>
            <span class="hidden sm:inline">Dựng lại</span>
          </button>
          <button type="button" (click)="state.toggleDarkMode()"
                  [attr.aria-label]="state.darkMode() ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'"
                  [title]="state.darkMode() ? 'Giao diện sáng' : 'Giao diện tối'">
            <i class="fa-solid" [class.fa-sun]="state.darkMode()" [class.fa-moon]="!state.darkMode()"></i>
          </button>
        </div>
      </header>

      <div class="excel-demo-meta" role="status" aria-live="polite">
        <span class="excel-demo-status" [class.is-ready]="ready()" [class.is-error]="!!error()">
          <i class="fa-solid" [class.fa-circle-check]="ready()" [class.fa-triangle-exclamation]="!!error()"
             [class.fa-circle-notch]="!ready() && !error()" [class.fa-spin]="!ready() && !error()"></i>
          {{ error() || (ready() ? 'Đã nạp workbook · bản xem trước chỉ đọc' : 'Đang nạp workbook mẫu...') }}
        </span>
        <span class="excel-demo-tip"><i class="fa-solid fa-lightbulb"></i> Ctrl+A chọn vùng, Ctrl+Shift+L mở Filter, Ctrl+F tìm kiếm.</span>
      </div>

      <section class="excel-demo-viewer" aria-label="Vùng trình diễn Excel">
        @if (demoBlob(); as blob) {
          <app-excel-document-viewer
            [blob]="blob"
            fileName="LIMS_Excel_Preview_Demo.xlsx"
            (ready)="onReady()"
            (failed)="onFailed($event)">
          </app-excel-document-viewer>
        } @else {
          <div class="excel-demo-reloading" aria-live="polite">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
            <span>Đang dựng lại workbook...</span>
          </div>
        }
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 0;
    }

    .excel-demo-page {
      width: 100%;
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: .55rem;
      padding: .75rem;
      overflow: hidden;
      background: #f1f5f9;
      color: #0f172a;
    }

    .excel-demo-header,
    .excel-demo-meta {
      flex: 0 0 auto;
      border: 1px solid #dbe4ee;
      background: rgba(255, 255, 255, .94);
      box-shadow: 0 4px 16px rgba(15, 23, 42, .06);
    }

    .excel-demo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: .75rem 1rem;
      border-radius: 1rem;
    }

    .excel-demo-eyebrow {
      display: flex;
      align-items: center;
      gap: .4rem;
      color: #047857;
      font-size: .62rem;
      font-weight: 900;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    h1 {
      margin: .2rem 0 0;
      color: #0f172a;
      font-size: clamp(1.05rem, 2vw, 1.45rem);
      font-weight: 900;
      letter-spacing: -.025em;
    }

    .excel-demo-header p {
      margin: .2rem 0 0;
      color: #64748b;
      font-size: .72rem;
    }

    .excel-demo-actions {
      display: flex;
      flex: 0 0 auto;
      gap: .4rem;
    }

    .excel-demo-actions button {
      min-height: 2.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: .4rem;
      padding: .35rem .7rem;
      border: 1px solid #cbd5e1;
      border-radius: .6rem;
      background: #fff;
      color: #475569;
      font-size: .7rem;
      font-weight: 800;
    }

    .excel-demo-actions button:hover {
      border-color: #6ee7b7;
      background: #ecfdf5;
      color: #047857;
    }

    .excel-demo-meta {
      min-height: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .75rem;
      padding: .35rem .7rem;
      border-radius: .7rem;
      color: #64748b;
      font-size: .66rem;
      font-weight: 700;
    }

    .excel-demo-status,
    .excel-demo-tip {
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      min-width: 0;
    }

    .excel-demo-status {
      color: #64748b;
    }

    .excel-demo-status.is-ready { color: #047857; }
    .excel-demo-status.is-error { color: #b91c1c; }

    .excel-demo-tip {
      color: #64748b;
      white-space: nowrap;
    }

    .excel-demo-viewer {
      position: relative;
      flex: 1 1 auto;
      min-height: 0;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      border-radius: 1rem;
      background: #fff;
      box-shadow: 0 12px 34px rgba(15, 23, 42, .1);
    }

    .excel-demo-reloading {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      color: #64748b;
      font-size: .75rem;
      font-weight: 700;
    }

    .excel-demo-reloading i { color: #16a34a; font-size: 1.6rem; }

    :host-context(.dark) .excel-demo-page {
      background: #020617;
      color: #e2e8f0;
    }

    :host-context(.dark) .excel-demo-header,
    :host-context(.dark) .excel-demo-meta {
      border-color: #334155;
      background: rgba(15, 23, 42, .94);
      box-shadow: none;
    }

    :host-context(.dark) h1 { color: #f8fafc; }
    :host-context(.dark) .excel-demo-header p,
    :host-context(.dark) .excel-demo-meta,
    :host-context(.dark) .excel-demo-tip { color: #94a3b8; }
    :host-context(.dark) .excel-demo-status.is-ready { color: #6ee7b7; }
    :host-context(.dark) .excel-demo-status.is-error { color: #fca5a5; }

    :host-context(.dark) .excel-demo-actions button {
      border-color: #475569;
      background: #1e293b;
      color: #cbd5e1;
    }

    :host-context(.dark) .excel-demo-actions button:hover {
      border-color: #34d399;
      background: #064e3b;
      color: #a7f3d0;
    }

    :host-context(.dark) .excel-demo-viewer {
      border-color: #334155;
      background: #0f172a;
      box-shadow: none;
    }

    @media (max-width: 767px) {
      .excel-demo-page { padding: .45rem; gap: .4rem; }
      .excel-demo-header { padding: .65rem .7rem; border-radius: .8rem; }
      .excel-demo-header p { display: none; }
      .excel-demo-meta { min-height: 2.15rem; padding-inline: .55rem; }
      .excel-demo-tip { display: none; }
      .excel-demo-viewer { border-radius: .75rem; }
    }
  `],
})
export class ExcelDocumentDemoComponent {
  readonly state = inject(StateService);
  readonly demoBlob = signal<Blob | null>(this.buildDemoWorkbook());
  readonly ready = signal(false);
  readonly error = signal('');

  regenerate(): void {
    this.ready.set(false);
    this.error.set('');
    this.demoBlob.set(null);
    setTimeout(() => this.demoBlob.set(this.buildDemoWorkbook()), 0);
  }

  onReady(): void {
    this.ready.set(true);
    this.error.set('');
  }

  onFailed(message: string): void {
    this.ready.set(false);
    this.error.set(message || 'Không thể dựng workbook mẫu.');
  }

  private buildDemoWorkbook(): Blob {
    const workbook = XLSX.utils.book_new();
    const results = XLSX.utils.aoa_to_sheet([
      ['LIMS NAFIQPM6 — KẾT QUẢ PHÂN TÍCH', null, null, null, null],
      ['Mã mẫu', 'Chỉ tiêu', 'Kết quả', 'Đơn vị', 'Đánh giá'],
      ['M-260822-01', 'Caffeine', 1.25, 'mg/L', { f: 'IF(C3>=1,"VƯỢT","ĐẠT")', v: 'VƯỢT' }],
      ['M-260822-02', 'Pesticide', 0.2, 'mg/L', { f: 'IF(C4>=1,"VƯỢT","ĐẠT")', v: 'ĐẠT' }],
      ['M-260822-03', 'Lead', 0.012, 'mg/L', { f: 'IF(C5>=0.05,"VƯỢT","ĐẠT")', v: 'ĐẠT' }],
      ['M-260822-04', 'Mercury', 0.08, 'mg/L', { f: 'IF(C6>=0.05,"VƯỢT","ĐẠT")', v: 'VƯỢT' }],
      ['Ngày chạy', new Date(2026, 7, 22, 15, 30, 45, 250), null, null, null],
      ['Trung bình', null, { f: 'AVERAGE(C3:C6)', v: 0.3855 }, 'mg/L', null],
    ]);
    results['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    results['!autofilter'] = { ref: 'A2:E6' };
    results['A3'].l = { Target: 'https://example.com/lims/sample/M-260822-01' };
    results['!cols'] = [
      { wpx: 122 },
      { wpx: 142 },
      { wpx: 88 },
      { wpx: 72 },
      { wpx: 92 },
    ];
    results['!rows'] = [{ hpx: 28 }, { hpx: 26 }];
    results['B7'].z = 'yyyy-mm-dd hh:mm:ss.000';
    XLSX.utils.book_append_sheet(workbook, results, 'Kết quả');

    const summary = XLSX.utils.aoa_to_sheet([
      ['TÓM TẮT MẺ PHÂN TÍCH', null, null],
      ['Thông tin', 'Giá trị', 'Ghi chú'],
      ['Số mẫu', 4, 'Đã hoàn tất'],
      ['Số chỉ tiêu', 4, 'Theo workbook mẫu'],
      ['Ngày cập nhật', new Date(2026, 7, 22), 'Ngày local'],
      ['Kết luận', { f: 'IF(\'Kết quả\'!E3="VƯỢT","CẦN XEM XÉT","ĐẠT")', v: 'CẦN XEM XÉT' }, 'Công thức liên sheet'],
    ]);
    summary['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
    summary['!cols'] = [{ wpx: 150 }, { wpx: 170 }, { wpx: 160 }];
    summary['B5'].z = 'yyyy-mm-dd';
    XLSX.utils.book_append_sheet(workbook, summary, 'Tóm tắt');

    const guide = XLSX.utils.aoa_to_sheet([
      ['HƯỚNG DẪN THAO TÁC', null],
      ['Tác vụ', 'Mô tả'],
      ['Chọn ô', 'Dùng chuột hoặc phím mũi tên để di chuyển trong bảng.'],
      ['Chọn vùng dữ liệu', 'Nhấn Ctrl+A để chọn nhanh vùng có dữ liệu của sheet.'],
      ['Filter', 'Nhấn Ctrl+Shift+L để tạo hoặc mở bộ lọc tạm trong bản xem trước.'],
      ['Tìm kiếm', 'Nhấn Ctrl+F để mở công cụ tìm kiếm của Univer.'],
      ['Chỉ đọc', 'Mọi thao tác chỉ diễn ra trong bản xem trước, không ghi lại tệp gốc.'],
    ]);
    guide['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
    guide['!cols'] = [{ wpx: 120 }, { wpx: 360 }];
    XLSX.utils.book_append_sheet(workbook, guide, 'Hướng dẫn');

    const bytes = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([bytes], { type: EXCEL_MIME });
  }
}
