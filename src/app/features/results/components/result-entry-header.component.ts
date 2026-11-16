import { Component, Input, Output, EventEmitter, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppPageHeaderComponent } from '../../../shared/components/ui/page-header/page-header.component';
import { AppHeaderSyncComponent } from '../../../shared/components/ui/header-sync/header-sync.component';
import { LivePreflightState, PreflightActionItem } from '../result-preflight-ui';

@Component({
  selector: 'app-result-entry-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppPageHeaderComponent, AppHeaderSyncComponent],
  templateUrl: './result-entry-header.component.html'
})
export class ResultEntryHeaderComponent {
  @ViewChild('restoreMenuContainer') restoreMenuContainer?: ElementRef<HTMLElement>;
  @ViewChild('actionsMenuContainer') actionsMenuContainer?: ElementRef<HTMLElement>;
  @ViewChild('preflightContainer') preflightContainer?: ElementRef<HTMLElement>;

  showPreflightPopover = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.showPreflightPopover && this.preflightContainer && !this.preflightContainer.nativeElement.contains(target)) {
      this.showPreflightPopover = false;
    }
    if (this.showRestoreMenu && this.restoreMenuContainer && !this.restoreMenuContainer.nativeElement.contains(target)) {
      this.closeRestoreMenu.emit();
    }
    if (this.showActionsMenu && this.actionsMenuContainer && !this.actionsMenuContainer.nativeElement.contains(target)) {
      this.closeActionsMenu.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.showPreflightPopover) {
      this.showPreflightPopover = false;
    }
    if (this.showRestoreMenu) {
      this.closeRestoreMenu.emit();
    }
    if (this.showActionsMenu) {
      this.closeActionsMenu.emit();
    }
  }
  // ── Data Inputs ──────────────────────────────────────────────────────────
  @Input() run: any = null;
  @Input() draft: any = null;
  @Input() historyList: any[] = [];
  @Input() preflightState: LivePreflightState | null = null;

  // ── State Inputs ─────────────────────────────────────────────────────────
  @Input() autoSaveStatus: 'synced' | 'modified' | 'saving' | 'error' = 'synced';
  @Input() lastSavedAt: Date | null = null;
  @Input() hasExistingReport = false;
  @Input() isProcessing = false;
  @Input() isPublishing = false;
  @Input() isReadOnly = false;
  @Input() canReassignSop = false;
  @Input() canViewDetail = true;
  @Input() canEditResults = true;
  @Input() lockedByOthers = false;
  @Input() showRestoreMenu = false;
  @Input() showActionsMenu = false;
  @Input() isPdfPaneOpen = false;
  @Input() reportsCount = 0;
  @Input() hasStaleReports = false;
  @Input() isFocusMode = false;
  @Input() currentPdfUrl: string | null = null;
  @Input() currentDocsUrl: string | null = null;
  @Input() printButtonLabel = 'Xuất báo cáo';
  @Input() canPrintWorksheet = false;
  @Input() worksheetLoading = false;

  // ── Action Outputs ────────────────────────────────────────────────────────
  @Output() goBack = new EventEmitter<void>();
  @Output() printWorksheet = new EventEmitter<void>();
  @Output() saveDraft = new EventEmitter<void>();
  @Output() publishReport = new EventEmitter<void>();
  @Output() unlockToEdit = new EventEmitter<void>();
  @Output() openResetModal = new EventEmitter<void>();
  @Output() openSopReassignment = new EventEmitter<void>();
  @Output() deleteVirtualMaster = new EventEmitter<void>();
  @Output() openPdf = new EventEmitter<{ pdfUrl: string | null | undefined; docsUrl?: string | null | undefined }>();
  @Output() restoreVersion = new EventEmitter<{ version: number; prefix?: string; reportId?: string }>();
  @Output() toggleRestoreMenu = new EventEmitter<void>();
  @Output() closeRestoreMenu = new EventEmitter<void>();
  @Output() toggleActionsMenu = new EventEmitter<void>();
  @Output() closeActionsMenu = new EventEmitter<void>();
  @Output() togglePdfPane = new EventEmitter<void>();
  @Output() openReportsHistory = new EventEmitter<void>();
  @Output() toggleFocusMode = new EventEmitter<void>();
  @Output() goToViewMode = new EventEmitter<void>();
  @Output() jumpToPreflightTarget = new EventEmitter<PreflightActionItem>();
  @Output() importExcel = new EventEmitter<File>();

  togglePreflightPopover() {
    this.showPreflightPopover = !this.showPreflightPopover;
    if (this.showPreflightPopover) {
      if (this.showRestoreMenu) this.closeRestoreMenu.emit();
      if (this.showActionsMenu) this.closeActionsMenu.emit();
    }
  }

  onSelectPreflightItem(item: PreflightActionItem) {
    this.showPreflightPopover = false;
    this.jumpToPreflightTarget.emit(item);
  }

  selectExcelFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.importExcel.emit(file);
    // Cho phép chọn lại chính file vừa đóng modal.
    input.value = '';
  }
}
