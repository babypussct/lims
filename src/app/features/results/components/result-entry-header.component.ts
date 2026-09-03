import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppPageHeaderComponent } from '../../../shared/components/ui/page-header/page-header.component';
import { AppHeaderSyncComponent } from '../../../shared/components/ui/header-sync/header-sync.component';

@Component({
  selector: 'app-result-entry-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppPageHeaderComponent, AppHeaderSyncComponent],
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
  @Output() restoreVersion = new EventEmitter<{ version: number; prefix?: string; reportId?: string }>();
  @Output() toggleRestoreMenu = new EventEmitter<void>();
  @Output() closeRestoreMenu = new EventEmitter<void>();
  @Output() toggleActionsMenu = new EventEmitter<void>();
  @Output() closeActionsMenu = new EventEmitter<void>();
  @Output() importExcel = new EventEmitter<File>();

  selectExcelFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.importExcel.emit(file);
    // Cho phép chọn lại chính file vừa đóng modal.
    input.value = '';
  }
}
