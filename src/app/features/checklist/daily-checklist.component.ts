import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { ToastService } from '../../core/services/toast.service';
import { Request } from '../../core/models/request.model';
import { TargetGroup } from '../../core/models/sop.model';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { DailyChecklistDataService } from './daily-checklist-data.service';
import {
  ApprovedBatchOverview,
  DailyBatchView,
  DailyPrintModePreference,
  DailyPrintOrientationPreference
} from './daily-checklist.model';
import {
  buildApprovedBatchOverviews,
  buildDailyBatchViews,
  isValidDateInput,
  toLocalDateInputValue
} from './daily-checklist.utils';
import { buildDailyCompactPrintPages, planDailyPrintLayout } from './daily-print-layout-planner';
import {
  computeDailyBatchLayoutHint,
  DailyBatchLayoutHint,
  DailyBatchViewMode
} from './daily-screen-layout-planner';
import { TargetService } from '../targets/target.service';
import { getCanonicalId } from '../results/shared/compound-id-resolver';

interface AvailableDateOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-daily-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-checklist.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    /* ============================================================ */
    /* SCREEN STYLES                                                */
    /* ============================================================ */

    @keyframes cl-enter-anim {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cl-board-enter { animation: cl-enter-anim 0.28s ease-out both; }

    /* Document article wrapper – không border/shadow trên màn hình */
    .cl-board-root {
      width: 100%;
      max-width: none;
      margin-inline: auto;
    }

    .cl-batch-grid-shell { container: batch-grid-shell / inline-size; }
    .cl-batch-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
      gap: 12px;
      align-items: start;
      grid-auto-flow: row;
    }
    .cl-batch-card {
      min-width: 0;
      container-type: inline-size;
    }
    .cl-batch-card.cl-card-standard { grid-column: span 2; }
    .cl-batch-card.cl-card-wide { grid-column: 1 / -1; }
    .cl-batch-grid[data-view-mode='compact'] .cl-batch-card { grid-column: span 1; }
    .cl-batch-grid[data-view-mode='list'] .cl-batch-card { grid-column: 1 / -1; }

    .cl-assignment-row { grid-template-columns: minmax(0, 1fr); }
    .cl-assignment-samples { min-width: 0; }
    .cl-assignment-targets { border-top: 1px solid rgb(241 245 249); padding-top: 12px; }
    .dark .cl-assignment-targets { border-color: rgb(51 65 85 / 0.7); }
    .cl-card-header { padding-block: 10px; }
    .cl-card-body-row { padding: 12px; gap: 10px; }
    .cl-card-footer { padding: 8px 16px; }

    @container (min-width: 520px) {
      .cl-card-header { flex-direction: row; align-items: flex-start; }
      .cl-card-body-row { padding: 14px 16px; gap: 12px; }
      .cl-assignment-row {
        grid-template-columns: minmax(140px, max-content) minmax(0, 1fr);
        max-width: 100%;
      }
      .cl-assignment-samples { max-width: min(45cqi, 340px); }
      .cl-assignment-targets {
        border-top: 0;
        border-left: 1px solid rgb(241 245 249);
        padding-top: 0;
        padding-left: 16px;
      }
      .dark .cl-assignment-targets { border-color: rgb(51 65 85 / 0.7); }
    }

    @container (max-width: 459px) {
      .cl-copy-label { display: none; }
      .cl-card-header { padding-inline: 12px; }
    }

    @container batch-grid-shell (max-width: 759px) {
      .cl-batch-card.cl-card-standard { grid-column: 1 / -1; }
    }

    /* Target chips grid layout */
    .cl-target-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
    }
    @media (min-width: 640px) {
      .cl-target-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 1024px) {
      .cl-target-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }

    /* Work group – tránh ngắt trang */
    .cl-work-group { break-inside: avoid; page-break-inside: avoid; }

    /* SOP heading – text wrap */
    .cl-sop-heading h3 { overflow-wrap: anywhere; }

    /* Print-only elements: ẩn hoàn toàn trên màn hình */
    .cl-print-only { display: none !important; }

    .cl-sample-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
      gap: 6px;
    }

    @media (prefers-reduced-motion: reduce) {
      .cl-board-enter { animation: none; }
    }

    /* ============================================================ */
    /* PRINT STYLES                                                 */
    /* ============================================================ */
    @media print {
      @page { size: A4 portrait; margin: 6mm; }

      /* Vô hiệu hóa khóa cứng kích thước dọc của index.html */
      body.daily-checklist-printing,
      body.daily-checklist-printing html {
        width: auto !important;
        height: auto !important;
        background: white !important;
        overflow: visible !important;
      }

      /* Ẩn ứng dụng gốc khi in, chỉ hiện print-container */
      body.daily-checklist-printing app-root { display: none !important; }
      
      body.daily-checklist-printing #print-container {
        display: block !important;
        position: relative !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
        z-index: auto !important;
        background: white !important;
      }

      body.daily-checklist-printing #print-container * {
        visibility: visible !important;
      }

      /* Ẩn các nút bấm, bộ lọc khi in */
      body.daily-checklist-printing #print-container .cl-screen-only { display: none !important; }
      body.daily-checklist-printing #print-container .cl-print-only { display: flex !important; }

      /* Reset Page Shell và container cuộn của bản in (QUAN TRỌNG: Sửa lỗi 2 trang in đầu bị trắng) */
      body.daily-checklist-printing #print-container .cl-page-shell,
      body.daily-checklist-printing #print-container .cl-board-scroll {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      /* Thiết lập Header tài liệu thu nhỏ gọn gàng để tiết kiệm giấy */
      body.daily-checklist-printing #print-container .cl-doc-header {
        background: white !important;
        border-bottom: 1px solid #cbd5e1 !important;
        margin-bottom: 6px !important;
        display: block !important;
      }

      body.daily-checklist-printing #print-container .cl-doc-header > div {
        padding: 4px 6px !important;
        gap: 6px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }

      body.daily-checklist-printing #print-container .cl-doc-header h2 {
        font-size: 11px !important;
        font-weight: 800 !important;
        margin: 0 !important;
      }

      body.daily-checklist-printing #print-container .cl-doc-header span {
        margin: 0 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-stats-grid {
        display: flex !important;
        gap: 4px !important;
      }

      body.daily-checklist-printing #print-container .cl-print-stats-grid > div {
        padding: 1.5px 4px !important;
        border-radius: 4px !important;
        border: 1px solid #cbd5e1 !important;
        background: #f8fafc !important;
        display: flex !important;
        align-items: center !important;
        gap: 2.5px !important;
        font-size: 8px !important;
        font-weight: 700 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-stats-grid > div span {
        font-size: 8px !important;
      }

      /* Khối bao ngoài của bản in */
      body.daily-checklist-printing #print-container .cl-board-root {
        width: 100% !important;
        max-width: none !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 10px !important;
        overflow: hidden !important;
        display: block !important;
        background: white !important;
      }

      /* Thiết lập block dọc 100% cho container body in ấn */
      body.daily-checklist-printing #print-container .cl-board-body {
        display: block !important;
        width: 100% !important;
        padding: 6px 8px !important;
      }

      /* CẤU HÌNH SỐ CỘT KANBAN MASONRY THEO HƯỚNG GIẤY */
      body.daily-checklist-printing.print-portrait-mode #print-container .cl-board-root.print-layout-auto .cl-board-body {
        column-count: 2 !important;
        column-gap: 10px !important;
      }
      body.daily-checklist-printing.print-landscape-mode #print-container .cl-board-root.print-layout-auto .cl-board-body {
        column-count: 3 !important;
        column-gap: 12px !important;
      }
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-auto .cl-board-body {
        column-count: 2 !important;
        column-gap: 10px !important;
      }
      
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-1 .cl-board-body {
        column-count: 1 !important;
      }
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-2 .cl-board-body {
        column-count: 2 !important;
        column-gap: 10px !important;
      }
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-3 .cl-board-body {
        column-count: 3 !important;
        column-gap: 12px !important;
      }
      body.daily-checklist-printing #print-container .cl-board-root.print-layout-4 .cl-board-body {
        column-count: 4 !important;
        column-gap: 8px !important;
      }

      /* SOP Card dạng block siêu nén, ôm khít nội dung */
      body.daily-checklist-printing #print-container .cl-sop-section {
        display: block !important;
        width: 100% !important;
        margin-bottom: 6px !important;
        break-inside: avoid !important;
        -webkit-column-break-inside: avoid !important;
        page-break-inside: avoid !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 6px !important;
        background-color: #ffffff !important;
        box-shadow: none !important;
      }

      /* Tối ưu hóa container chứa các nhóm chỉ tiêu khi in (Bỏ padding, margin dư thừa) */
      body.daily-checklist-printing #print-container .cl-sop-section > div.overflow-y-auto {
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
      }

      /* Thêm gạch đứt ngăn cách nhẹ giữa các nhóm chỉ tiêu thay vì khoảng trống lớn */
      body.daily-checklist-printing #print-container .cl-sop-section > div.overflow-y-auto > * + * {
        margin-top: 0 !important;
        border-top: 1px dashed #e2e8f0 !important;
      }

      /* SOP Header trên trang in */
      body.daily-checklist-printing #print-container .cl-sop-heading {
        display: block !important;
        width: 100% !important;
        padding: 5px 8px !important;
        background-color: #f8fafc !important;
        border-bottom: 1px solid #cbd5e1 !important;
      }

      body.daily-checklist-printing #print-container .cl-sop-heading > div {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }

      body.daily-checklist-printing #print-container .cl-sop-heading h3 {
        font-weight: 800 !important;
        color: #0f172a !important;
      }

      body.daily-checklist-printing #print-container .cl-sop-heading span {
        font-weight: 700 !important;
        color: #475569 !important;
      }

      /* Nhóm mẫu và chỉ tiêu */
      body.daily-checklist-printing #print-container .cl-work-group {
        display: block !important;
        width: 100% !important;
        padding: 5px 8px !important;
        margin: 0 !important;
      }

      body.daily-checklist-printing #print-container .cl-work-group div.font-mono {
        line-height: 1.25 !important;
        color: #1e293b !important;
        margin-bottom: 3px !important;
      }

      body.daily-checklist-printing #print-container .cl-work-group div.font-mono span.font-sans {
        color: #64748b !important;
      }

      /* Thẻ badge chỉ tiêu trên trang in */
      body.daily-checklist-printing #print-container .cl-work-group .flex-wrap {
        display: block !important;
        width: 100% !important;
        margin-top: 3px !important;
      }

      body.daily-checklist-printing #print-container .cl-work-group .flex-wrap span {
        display: inline-block !important;
        background-color: #f1f5f9 !important;
        border: 1px solid #cbd5e1 !important;
        color: #0f172a !important;
        padding: 0.5px 3.5px !important;
        margin: 1px 2px 1px 0 !important;
        border-radius: 3px !important;
        font-weight: 700 !important;
      }

      /* CẤU HÌNH CỠ CHỮ IN */
      /* XS - Siêu nhỏ (Khuyên dùng khi có nhiều SOP để vừa 1 trang) */
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-sop-heading h3 { font-size: 8px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-sop-heading span { font-size: 7px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-work-group { font-size: 7px !important; padding: 2px 4px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-work-group .flex-wrap span { font-size: 6px !important; padding: 0px 1.5px !important; margin: 0.5px 1px 0.5px 0 !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-sop-section { margin-bottom: 4px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header { margin-bottom: 4px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header > div { padding: 3px 5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header h2 { font-size: 9.5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-doc-header span { font-size: 8px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-print-stats-grid > div { padding: 1px 3px !important; gap: 2px !important; font-size: 7px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-xs .cl-print-stats-grid > div span { font-size: 7px !important; }

      /* Small - Nhỏ */
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-sop-heading h3 { font-size: 9.5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-work-group { font-size: 8px !important; padding: 3px 5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-work-group .flex-wrap span { font-size: 7px !important; padding: 0.5px 2px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-sop-section { margin-bottom: 5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header { margin-bottom: 5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header > div { padding: 3.5px 5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header h2 { font-size: 10.5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-doc-header span { font-size: 8.5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-print-stats-grid > div { padding: 1px 3.5px !important; gap: 2px !important; font-size: 7.5px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-small .cl-print-stats-grid > div span { font-size: 7.5px !important; }

      /* Medium - Vừa */
      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-sop-heading h3 { font-size: 12px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-work-group { font-size: 10px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-medium .cl-work-group .flex-wrap span { font-size: 8.5px !important; }

      /* Large - Lớn */
      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-sop-heading h3 { font-size: 14px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-work-group { font-size: 11px !important; }
      body.daily-checklist-printing #print-container .cl-board-root.print-text-large .cl-work-group .flex-wrap span { font-size: 10px !important; }

      /* CẤU HÌNH ẨN BẢNG THỐNG KÊ */
      body.daily-checklist-printing #print-container .cl-board-root.print-stats-hide .cl-doc-header .cl-print-stats-grid {
        display: none !important;
      }

      /* Document footer (print-only) */
      body.daily-checklist-printing #print-container .cl-doc-footer {
        padding: 2px 4px !important;
        font-size: 7px !important;
        margin-top: 4px !important;
        color: #64748b !important;
        display: flex !important;
      }

      /* Adaptive batch table: print renderer độc lập với card màn hình */
      body.daily-checklist-printing #print-container .cl-adaptive-root {
        display: block !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        color: #0f172a !important;
        background: #ffffff !important;
      }

      body.daily-checklist-printing #print-container .cl-print-document {
        display: block !important;
        width: 100% !important;
      }

      body.daily-checklist-printing #print-container .cl-print-header {
        display: flex !important;
        align-items: baseline !important;
        justify-content: space-between !important;
        gap: 8px !important;
        padding: 0 0 4mm !important;
        border-bottom: 1.5px solid #334155 !important;
        margin-bottom: 3mm !important;
      }

      body.daily-checklist-printing #print-container .cl-print-header h2 {
        margin: 0 !important;
        font-size: 12pt !important;
        line-height: 1.2 !important;
        font-weight: 800 !important;
        letter-spacing: 0.02em !important;
      }

      body.daily-checklist-printing #print-container .cl-print-header div {
        font-size: 9pt !important;
        white-space: nowrap !important;
      }

      body.daily-checklist-printing #print-container .cl-print-list-layout,
      body.daily-checklist-printing #print-container .cl-print-compact-layout {
        display: none !important;
      }

      body.daily-checklist-printing #print-container .cl-print-mode-list .cl-print-list-layout {
        display: block !important;
      }

      body.daily-checklist-printing #print-container .cl-print-mode-compact .cl-print-compact-layout {
        display: block !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-page {
        display: block !important;
        position: relative !important;
        box-sizing: border-box !important;
        break-inside: avoid-page !important;
        page-break-inside: avoid !important;
        break-after: page !important;
        page-break-after: always !important;
      }

      body.daily-checklist-printing.print-portrait-mode #print-container .cl-print-compact-page {
        height: 265mm !important;
      }

      body.daily-checklist-printing.print-landscape-mode #print-container .cl-print-compact-page {
        height: 178mm !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-page-last {
        break-after: auto !important;
        page-break-after: auto !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-columns {
        display: grid !important;
        align-items: start !important;
        gap: 4mm !important;
        box-sizing: border-box !important;
      }

      body.daily-checklist-printing.print-portrait-mode #print-container .cl-print-compact-columns {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      body.daily-checklist-printing.print-landscape-mode #print-container .cl-print-compact-columns {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-column {
        display: block !important;
        min-width: 0 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-card {
        display: block !important;
        width: 100% !important;
        margin: 0 0 4mm !important;
        border: 1px solid #94a3b8 !important;
        border-radius: 2.5mm !important;
        overflow: hidden !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        background: white !important;
        font-size: 8pt !important;
        line-height: 1.3 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-head {
        display: flex !important;
        align-items: flex-start !important;
        gap: 2mm !important;
        padding: 2.2mm !important;
        border-bottom: 1px solid #cbd5e1 !important;
        background: #f8fafc !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-index {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 5mm !important;
        height: 5mm !important;
        flex: 0 0 5mm !important;
        border-radius: 50% !important;
        color: white !important;
        background: #2563eb !important;
        font-size: 7pt !important;
        font-weight: 800 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-title {
        min-width: 0 !important;
        flex: 1 1 auto !important;
        font-size: 8.5pt !important;
        font-weight: 800 !important;
        overflow-wrap: anywhere !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-title small {
        display: block !important;
        margin-top: 0.7mm !important;
        color: #64748b !important;
        font-size: 6.5pt !important;
        font-weight: 600 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-group {
        padding: 2.2mm !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-group + .cl-print-compact-group {
        border-top: 1px dashed #cbd5e1 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-label {
        margin-bottom: 0.7mm !important;
        color: #64748b !important;
        font-size: 6.7pt !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.03em !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-samples {
        margin-bottom: 1.5mm !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-size: 8.5pt !important;
        font-weight: 800 !important;
        overflow-wrap: anywhere !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-targets {
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-targets li {
        display: inline !important;
      }

      body.daily-checklist-printing #print-container .cl-print-compact-targets li:not(:last-child)::after {
        content: '; ' !important;
      }

      body.daily-checklist-printing #print-container .cl-print-table {
        display: table !important;
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
        border: 1px solid #64748b !important;
        font-size: 9pt !important;
        line-height: 1.3 !important;
      }

      body.daily-checklist-printing.print-portrait-mode #print-container .cl-col-batch { width: 24% !important; }
      body.daily-checklist-printing.print-portrait-mode #print-container .cl-col-samples { width: 38% !important; }
      body.daily-checklist-printing.print-portrait-mode #print-container .cl-col-targets { width: 38% !important; }
      body.daily-checklist-printing.print-landscape-mode #print-container .cl-col-batch { width: 22% !important; }
      body.daily-checklist-printing.print-landscape-mode #print-container .cl-col-samples { width: 40% !important; }
      body.daily-checklist-printing.print-landscape-mode #print-container .cl-col-targets { width: 38% !important; }

      body.daily-checklist-printing #print-container .cl-print-table thead {
        display: table-header-group !important;
      }

      body.daily-checklist-printing #print-container .cl-print-table th {
        padding: 2.2mm 2.5mm !important;
        border: 1px solid #64748b !important;
        background: #e2e8f0 !important;
        color: #0f172a !important;
        text-align: left !important;
        text-transform: uppercase !important;
        letter-spacing: 0.04em !important;
        font-size: 8pt !important;
        font-weight: 800 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-table td {
        padding: 2.5mm !important;
        border: 1px solid #94a3b8 !important;
        vertical-align: top !important;
        overflow-wrap: anywhere !important;
      }

      body.daily-checklist-printing #print-container .cl-print-assignment-row {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      body.daily-checklist-printing #print-container .cl-print-batch-start td {
        border-top-width: 1.5px !important;
        border-top-color: #334155 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-batch-cell {
        display: flex !important;
        align-items: flex-start !important;
        gap: 2.5mm !important;
      }

      body.daily-checklist-printing #print-container .cl-print-batch-info {
        min-width: 0 !important;
        flex: 1 1 auto !important;
      }

      body.daily-checklist-printing #print-container .cl-print-sop {
        font-weight: 700 !important;
        color: #334155 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-meta,
      body.daily-checklist-printing #print-container .cl-print-count {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 1.5mm !important;
        margin-top: 1mm !important;
        color: #64748b !important;
        font-size: 7.5pt !important;
        font-weight: 600 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-samples + .cl-print-meta {
        color: #86198f !important;
      }

      body.daily-checklist-printing #print-container .cl-print-samples {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-size: 9pt !important;
        font-weight: 800 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-targets {
        margin: 0 !important;
        padding-left: 4mm !important;
      }

      body.daily-checklist-printing #print-container .cl-print-targets li {
        margin: 0 0 0.7mm !important;
      }

      body.daily-checklist-printing #print-container .cl-print-missing {
        font-style: italic !important;
        color: #92400e !important;
      }

      body.daily-checklist-printing #print-container .cl-print-scope {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.8mm !important;
        color: #172554 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-scope strong {
        font-size: 8.5pt !important;
        line-height: 1.2 !important;
      }

      body.daily-checklist-printing #print-container .cl-print-scope span {
        color: #64748b !important;
        font-size: 7.5pt !important;
        font-weight: 700 !important;
      }

    }
  `]
})
export class DailyChecklistComponent implements OnDestroy {
  @Input() embedded = false;
  readonly state = inject(StateService);
  readonly router = inject(Router);
  private readonly dataService = inject(DailyChecklistDataService);
  private readonly toast = inject(ToastService);
  private readonly targetService = inject(TargetService);

  readonly selectedDate = signal(toLocalDateInputValue());
  readonly dateRequests = signal<Request[]>([]);
  readonly availableDates = signal<string[]>([]);
  readonly loading = signal(true);
  readonly loadingDates = signal(false);
  readonly loadedBatchCount = signal(0);
  readonly dataError = signal<string | null>(null);
  readonly usingOfflineCache = signal(false);
  readonly lastLoadedAt = signal<Date | null>(null);
  readonly hasMoreDates = signal(false);
  readonly sopFilter = signal('all');
  readonly searchTerm = signal('');
  readonly printGeneratedAt = signal(new Date());

  // Print Configuration Signals
  readonly showPrintSettings = signal(false);
  readonly printOrientation = signal<DailyPrintOrientationPreference>('auto');
  readonly printMode = signal<DailyPrintModePreference>('auto');
  readonly printGroupSamples = signal(true);
  readonly expandedBatchIds = signal<Set<string>>(new Set());
  readonly openSourceBatchCardKeys = signal<Set<string>>(new Set());
  readonly viewMode = signal<DailyBatchViewMode>(this.loadStoredViewMode());
  readonly batchGridWidth = signal(0);
  readonly availableTargetGroups = signal<TargetGroup[]>([]);
  readonly openTargetDetailKeys = signal<Set<string>>(new Set());

  readonly printOrientationOptions: { v: DailyPrintOrientationPreference, l: string }[] = [
    { v: 'auto', l: 'Tự động' },
    { v: 'portrait', l: 'Chiều dọc' },
    { v: 'landscape', l: 'Chiều ngang' }
  ];
  readonly printModeOptions: { v: DailyPrintModePreference, l: string, icon: string }[] = [
    { v: 'auto', l: 'Tự động', icon: 'fa-wand-magic-sparkles' },
    { v: 'compact', l: 'Lưới gọn', icon: 'fa-grip' },
    { v: 'list', l: 'Danh sách', icon: 'fa-bars' }
  ];
  readonly viewModeOptions: { value: DailyBatchViewMode, label: string, icon: string }[] = [
    { value: 'auto', label: 'Tự động', icon: 'fa-wand-magic-sparkles' },
    { value: 'compact', label: 'Lưới gọn', icon: 'fa-grip' },
    { value: 'list', label: 'Danh sách', icon: 'fa-bars' }
  ];

  private batchGridResizeObserver?: ResizeObserver;

  @ViewChild('batchGrid')
  set batchGrid(element: ElementRef<HTMLElement> | undefined) {
    this.batchGridResizeObserver?.disconnect();
    this.batchGridResizeObserver = undefined;
    if (!element) return;

    const updateWidth = () => this.batchGridWidth.set(Math.round(element.nativeElement.getBoundingClientRect().width));
    updateWidth();
    if (typeof ResizeObserver !== 'undefined') {
      this.batchGridResizeObserver = new ResizeObserver(entries => {
        const width = entries[0]?.contentRect.width;
        if (width !== undefined) this.batchGridWidth.set(Math.round(width));
      });
      this.batchGridResizeObserver.observe(element.nativeElement);
    }
  }

  private dateOptionsCursor: QueryDocumentSnapshot | null = null;
  private dateLoadToken = 0;

  private readonly targetNameMap = computed(() => {
    const map = new Map<string, string>();
    this.state.sops().forEach(sop => {
      (sop.targets || []).forEach(target => {
        map.set(`${sop.id}\u0000${target.id}`, target.name);
        map.set(`${sop.id}\u0000${getCanonicalId(target.id || target.name)}`, target.name);
      });
    });
    return map;
  });

  readonly availableDateOptions = computed<AvailableDateOption[]>(() =>
    this.availableDates().map(value => ({ value, label: this.formatDate(value) }))
  );

  readonly hasOlderDate = computed(() => {
    const index = this.availableDates().indexOf(this.selectedDate());
    return index >= 0 && (index < this.availableDates().length - 1 || this.hasMoreDates());
  });

  readonly hasNewerDate = computed(() => this.availableDates().indexOf(this.selectedDate()) > 0);

  readonly dayBatches = computed<ApprovedBatchOverview[]>(() => {
    const targetNames = this.targetNameMap();
    return buildApprovedBatchOverviews(
      this.dateRequests(),
      this.selectedDate(),
      (request, targetId) => request.targetNames?.[targetId]
        || Object.entries(request.targetNames || {}).find(([id]) => getCanonicalId(id) === getCanonicalId(targetId))?.[1]
        || targetNames.get(`${request.sopId}\u0000${targetId}`)
        || targetNames.get(`${request.sopId}\u0000${getCanonicalId(targetId)}`)
        || targetId
    );
  });

  readonly sopOptions = computed(() => {
    const map = new Map<string, string>();
    this.dayBatches().forEach(batch => map.set(batch.sopId, batch.sopName));
    return Array.from(map, ([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  });

  readonly scopedBatches = computed(() => {
    const sop = this.sopFilter();
    return sop === 'all' ? this.dayBatches() : this.dayBatches().filter(batch => batch.sopId === sop);
  });

  readonly boardBatches = computed<DailyBatchView[]>(() => {
    const batches = buildDailyBatchViews(this.scopedBatches(), this.availableTargetGroups());
    const search = normalizeSearch(this.searchTerm());
    if (!search) return batches;

    return batches
      .map(batch => {
        if (normalizeSearch([
          batch.sopName,
          batch.sopRef || '',
          ...batch.sourceBatches.map(source => source.requestId),
          ...batch.groups.map(group => group.formattedDescriptions)
        ].join(' ')).includes(search)) {
          return batch;
        }
        const matchingGroups = batch.groups.filter(group => normalizeSearch([
          ...group.targetNames,
          group.targetScope.headline,
          ...group.sampleIds,
          group.formattedSamples,
          group.formattedDescriptions
        ].join(' ')).includes(search));
        if (matchingGroups.length === 0) return null;
        return {
          ...batch,
          groups: matchingGroups,
          uniqueSamples: new Set(matchingGroups.flatMap(group => group.sampleIds)).size,
          uniqueTargets: new Set(matchingGroups.flatMap(group => group.targetIds)).size
        };
      })
      .filter((batch): batch is DailyBatchView => batch !== null);
  });

  readonly batchLayoutHints = computed<ReadonlyMap<string, DailyBatchLayoutHint>>(() => {
    const containerWidth = this.batchGridWidth();
    const expandedBatchIds = this.expandedBatchIds();
    const viewMode = this.viewMode();
    return new Map(this.boardBatches().map(batch => [
      batch.cardKey,
      computeDailyBatchLayoutHint(
        batch,
        containerWidth,
        expandedBatchIds.has(batch.cardKey),
        viewMode
      )
    ]));
  });

  readonly boardSummary = computed(() => {
    const batches = this.boardBatches();
    const samples = new Set<string>();
    const targets = new Set<string>();
    const sops = new Set<string>();
    let groups = 0;
    batches.forEach(batch => {
      sops.add(batch.sopId);
      groups += batch.groups.length;
      batch.groups.forEach(group => {
        group.sampleIds.forEach(sample => samples.add(normalizeSearch(sample)));
        group.targetIds.forEach(target => targets.add(`${batch.sopId}\u0000${target}`));
      });
    });
    return {
      batches: batches.reduce((total, batch) => total + batch.physicalBatchCount, 0),
      cards: batches.length,
      sops: sops.size,
      samples: samples.size,
      targets: targets.size,
      groups
    };
  });

  readonly printPlan = computed(() => planDailyPrintLayout(
    this.boardBatches(),
    this.printGroupSamples(),
    this.printOrientation(),
    this.printMode()
  ));

  readonly compactPrintPages = computed(() => buildDailyCompactPrintPages(
    this.boardBatches(),
    this.printGroupSamples(),
    this.printPlan().orientation
  ));

  readonly activeFilterCount = computed(() =>
    Number(this.sopFilter() !== 'all') + Number(Boolean(this.searchTerm().trim()))
  );

  readonly selectedDateLabel = computed(() => this.formatDate(this.selectedDate(), true));

  constructor() {
    void this.initializeTracker();
  }

  ngOnDestroy(): void {
    this.batchGridResizeObserver?.disconnect();
  }

  onDateChange(value: string): void {
    if (!isValidDateInput(value) || !this.availableDates().includes(value)) return;
    this.selectedDate.set(value);
    this.clearFilters();
    void this.loadSelectedDate();
  }

  async moveAvailableDate(direction: 'older' | 'newer'): Promise<void> {
    let dates = this.availableDates();
    let currentIndex = dates.indexOf(this.selectedDate());
    if (currentIndex < 0) return;

    if (direction === 'older' && currentIndex === dates.length - 1 && this.hasMoreDates()) {
      try {
        do {
          await this.loadMoreDateOptions();
        } while (
          !this.availableDates().some(date => date < this.selectedDate())
          && this.hasMoreDates()
        );
      } catch (error) {
        this.handleLoadError(error);
        return;
      }
      dates = this.availableDates();
      currentIndex = dates.indexOf(this.selectedDate());
    }

    const targetIndex = direction === 'older' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < dates.length) this.onDateChange(dates[targetIndex]);
  }

  refreshData(): void {
    void this.refreshTracker();
  }

  clearFilters(): void {
    this.sopFilter.set('all');
    this.searchTerm.set('');
  }

  setViewMode(mode: DailyBatchViewMode): void {
    this.viewMode.set(mode);
    try {
      localStorage.setItem('daily-sample-board-view-mode', mode);
    } catch {
      // Chế độ vẫn có hiệu lực trong phiên nếu trình duyệt chặn storage.
    }
  }

  visibleBatchGroups(batch: DailyBatchView) {
    return this.isBatchExpanded(batch.cardKey) ? batch.groups : batch.groups.slice(0, 2);
  }

  visibleTargetNames(batch: DailyBatchView, targetNames: string[]): string[] {
    return this.isBatchExpanded(batch.cardKey) ? targetNames : targetNames.slice(0, 6);
  }

  isTargetDetailOpen(requestId: string, signature: string): boolean {
    return this.openTargetDetailKeys().has(this.targetDetailKey(requestId, signature));
  }

  toggleTargetDetail(requestId: string, signature: string): void {
    const key = this.targetDetailKey(requestId, signature);
    this.openTargetDetailKeys.update(current => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  hasHiddenBatchContent(batch: DailyBatchView): boolean {
    return batch.uniqueSamples > 12
      || batch.groups.length > 2
      || batch.groups.some(group => !group.targetScope.compact && group.targetNames.length > 6);
  }

  hiddenBatchGroupCount(batch: DailyBatchView): number {
    return Math.max(0, batch.groups.length - 2);
  }

  isSourceBatchListOpen(cardKey: string): boolean {
    return this.openSourceBatchCardKeys().has(cardKey);
  }

  toggleSourceBatchList(cardKey: string): void {
    this.openSourceBatchCardKeys.update(current => {
      const next = new Set(current);
      if (next.has(cardKey)) next.delete(cardKey);
      else next.add(cardKey);
      return next;
    });
  }

  sourceBatchStatusLabel(status: string): string {
    if (status === 'completed') return 'Có kết quả';
    if (status === 'draft') return 'Đang nhập KQ';
    return 'Chưa có KQ';
  }

  printDocument(): void {
    if (this.boardBatches().length === 0) return;
    this.showPrintSettings.set(true);
  }

  executePrint(): void {
    this.showPrintSettings.set(false);
    this.printGeneratedAt.set(new Date());

    const printContainer = document.getElementById('print-container');
    if (!printContainer) {
      window.print();
      return;
    }

    const source = document.querySelector('.cl-page-shell');
    if (!source) {
      console.warn('cl-page-shell not found');
      return;
    }

    const orientation = this.printPlan().orientation;
    if (orientation === 'portrait') {
      document.body.classList.add('daily-checklist-printing', 'print-portrait-mode');
    } else {
      document.body.classList.add('daily-checklist-printing', 'print-landscape-mode');
    }
    
    // SỬA LỖI TRANG TRẮNG: Gỡ bỏ khóa cứng kích thước 210x297mm của thẻ html trong index.html
    // (CSS class binding không thể target trực tiếp thẻ html outside component ViewEncapsulation)
    document.documentElement.style.setProperty('height', 'auto', 'important');
    document.documentElement.style.setProperty('width', 'auto', 'important');
    document.body.style.setProperty('height', 'auto', 'important');
    document.body.style.setProperty('width', 'auto', 'important');
    document.body.style.setProperty('overflow', 'visible', 'important');

    // Thêm dynamic style để khống chế hướng giấy in (Portrait / Landscape)
    const styleEl = document.createElement('style');
    styleEl.id = 'print-orientation-style';
    styleEl.innerHTML = `@page { size: A4 ${orientation}; margin: 8mm; }`;
    document.head.appendChild(styleEl);

    // Đợi góc render của Angular cập nhật lại dải mẫu nếu tắt/bật gom mẫu
    setTimeout(async () => {
      const clone = source.cloneNode(true) as HTMLElement;
      
      // Khử animation và transform để tránh phá vỡ thuật toán phân trang CSS Columns của trình duyệt
      clone.style.animation = 'none';
      clone.style.transform = 'none';
      const animatedElements = clone.querySelectorAll('.cl-board-enter, .animate-fade-in');
      animatedElements.forEach((el: any) => {
        el.style.animation = 'none';
        el.style.transform = 'none';
      });

      printContainer.innerHTML = '';
      printContainer.appendChild(clone);

      const cleanupPrintMode = () => {
        document.body.classList.remove('daily-checklist-printing', 'print-portrait-mode', 'print-landscape-mode');
        document.documentElement.style.removeProperty('height');
        document.documentElement.style.removeProperty('width');
        document.body.style.removeProperty('height');
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('overflow');
        printContainer.innerHTML = '';
        
        const styleElToRemove = document.getElementById('print-orientation-style');
        if (styleElToRemove) styleElToRemove.remove();
      };

      window.addEventListener('afterprint', cleanupPrintMode, { once: true });
      window.print();
    }, 120);
  }

  joinWithCommas(ids: string[]): string {
    return ids.join(', ');
  }

  isBatchExpanded(requestId: string): boolean {
    return this.expandedBatchIds().has(requestId);
  }

  toggleBatchSamples(requestId: string): void {
    this.expandedBatchIds.update(current => {
      const next = new Set(current);
      if (next.has(requestId)) next.delete(requestId);
      else next.add(requestId);
      return next;
    });
  }

  async copyBatchId(requestId: string): Promise<void> {
    if (!requestId) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(requestId);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = requestId;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) throw new Error('Clipboard API unavailable');
      }
      this.toast.show('Đã sao chép mã mẻ.', 'success');
    } catch {
      this.toast.show('Không thể sao chép mã mẻ trên thiết bị này.', 'error');
    }
  }

  formatTimestamp(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  navigateToResult(requestId: string, status?: string): void {
    if (!requestId) return;
    this.router.navigate(['/results-view', requestId]);
  }

  editBatch(requestId: string): void {
    if (!requestId) return;
    this.router.navigate(['/calculator'], { queryParams: { editRequestId: requestId } });
  }

  private targetDetailKey(requestId: string, signature: string): string {
    return `${requestId}\u0000${signature}`;
  }

  private loadStoredViewMode(): DailyBatchViewMode {
    try {
      const stored = localStorage.getItem('daily-sample-board-view-mode');
      if (stored === 'compact' || stored === 'list') return stored;
    } catch {
      // Dùng mặc định khi storage không khả dụng.
    }
    return 'auto';
  }

  formatDate(value: string, includeWeekday = false): string {
    if (!isValidDateInput(value)) return value;
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: includeWeekday ? 'long' : undefined,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(year, month - 1, day));
  }

  private async initializeTracker(): Promise<void> {
    this.loading.set(true);
    try {
      const targetGroupsPromise = this.targetService.getAllGroups().catch(error => {
        console.warn('[DailySampleTracker] Target groups unavailable:', error);
        return [] as TargetGroup[];
      });
      do {
        await this.loadMoreDateOptions(this.availableDates().length === 0);
      } while (this.availableDates().length === 0 && this.hasMoreDates());

      const dates = this.availableDates();
      const today = toLocalDateInputValue();
      this.selectedDate.set(dates.includes(today) ? today : (dates[0] || today));
      const [, targetGroups] = await Promise.all([this.loadSelectedDate(), targetGroupsPromise]);
      this.availableTargetGroups.set(targetGroups);
    } catch (error) {
      this.handleLoadError(error);
    } finally {
      this.loading.set(false);
    }
  }

  private async refreshTracker(): Promise<void> {
    try {
      this.dateOptionsCursor = null;
      this.hasMoreDates.set(false);
      await this.loadMoreDateOptions(true);
      if (!this.availableDates().includes(this.selectedDate())) {
        this.availableDates.update(dates => [this.selectedDate(), ...dates].sort((a, b) => b.localeCompare(a)));
      }
      await this.loadSelectedDate();
    } catch (error) {
      this.handleLoadError(error);
      this.loading.set(false);
    }
  }

  private async loadMoreDateOptions(reset = false): Promise<void> {
    if (this.loadingDates()) return;
    this.loadingDates.set(true);
    try {
      if (reset) this.dateOptionsCursor = null;
      const page = await this.dataService.loadDateOptionsPage(this.dateOptionsCursor);
      const nextDates = reset
        ? page.dates
        : Array.from(new Set([...this.availableDates(), ...page.dates]));
      this.availableDates.set(nextDates.sort((a, b) => b.localeCompare(a)));
      this.dateOptionsCursor = page.cursor;
      this.hasMoreDates.set(page.hasMore);
      if (page.source === 'cache') this.usingOfflineCache.set(true);
    } finally {
      this.loadingDates.set(false);
    }
  }

  private async loadSelectedDate(): Promise<void> {
    const selectedDate = this.selectedDate();
    const token = ++this.dateLoadToken;
    this.loading.set(true);
    this.loadedBatchCount.set(0);
    this.dataError.set(null);
    try {
      const result = await this.dataService.loadRequestsForDate(
        selectedDate,
        count => {
          if (token === this.dateLoadToken) this.loadedBatchCount.set(count);
        }
      );
      if (token !== this.dateLoadToken) return;
      this.dateRequests.set(result.requests);
      this.usingOfflineCache.set(result.source === 'cache');
      this.lastLoadedAt.set(new Date());
    } catch (error) {
      if (token === this.dateLoadToken) this.handleLoadError(error);
    } finally {
      if (token === this.dateLoadToken) this.loading.set(false);
    }
  }

  private handleLoadError(error: unknown): void {
    console.error('[DailySampleTracker] Load failed:', error);
    this.dataError.set('Không thể tải dữ liệu theo ngày. Vui lòng kiểm tra kết nối và thử làm mới.');
    this.dateRequests.set([]);
  }
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}
