import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-result-entry-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './result-entry-header.component.html'
})
export class ResultEntryHeaderComponent {
  // ── Data Inputs ──────────────────────────────────────────────────────────
  @Input() run: any = null;
  @Input() draft: any = null;
  @Input() historyList: any[] = [];

  // ── State Inputs ─────────────────────────────────────────────────────────
  @Input() autoSaveStatus: 'synced' | 'modified' | 'saving' | 'error' = 'synced';
  @Input() lastSavedAt: Date | null = null;
  @Input() hasExistingReport = false;
  @Input() isProcessing = false;
  @Input() isPublishing = false;
  @Input() isReadOnly = false;
  @Input() showRestoreMenu = false;
  @Input() showActionsMenu = false;
  @Input() samplesPerReport: number | null = null;
  @Input() currentPdfUrl: string | null = null;
  @Input() currentDocsUrl: string | null = null;
  @Input() printButtonLabel = 'Xuất báo cáo';

  // ── Action Outputs ────────────────────────────────────────────────────────
  @Output() goBack = new EventEmitter<void>();
  @Output() saveDraft = new EventEmitter<void>();
  @Output() publishReport = new EventEmitter<void>();
  @Output() unlockToEdit = new EventEmitter<void>();
  @Output() openResetModal = new EventEmitter<void>();
  @Output() deleteVirtualMaster = new EventEmitter<void>();
  @Output() openPdf = new EventEmitter<{ pdfUrl: string | null | undefined; docsUrl?: string | null | undefined }>();
  @Output() restoreVersion = new EventEmitter<{ version: number; prefix?: string }>();
  @Output() samplesPerReportChange = new EventEmitter<number | null>();
  @Output() toggleRestoreMenu = new EventEmitter<void>();
  @Output() closeRestoreMenu = new EventEmitter<void>();
  @Output() toggleActionsMenu = new EventEmitter<void>();
  @Output() closeActionsMenu = new EventEmitter<void>();
}
