/**
 * StandardService — THIN FAÇADE
 *
 * File này không còn chứa business logic.
 * Toàn bộ logic đã được chuyển sang 5 service chuyên biệt trong ./services/:
 *   - StandardCacheService   (Delta sync, live listener, cache)
 *   - StandardCrudService    (CRUD, COA, global activity log)
 *   - StandardUsageService   (Usage logs, calculations)
 *   - StandardRequestService (Request workflow, purchase requests)
 *   - StandardImportService  (Excel import/export)
 *
 * Façade này giữ nguyên public API để 8 component hiện tại KHÔNG CẦN sửa
 * import. Khi muốn migrate component nào, chỉ cần đổi inject sang service
 * cụ thể tương ứng.
 */
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { AuthService } from '../../core/services/auth.service';
import { QueryDocumentSnapshot, QueryConstraint, Unsubscribe } from 'firebase/firestore';
import {
  ReferenceStandard, StandardCleanupBatch, StandardNameUpdate, UsageLog, StandardsPage,
  ImportPreviewItem, ImportUsageLogPreviewItem,
  StandardRequest, StandardRequestStatus, PurchaseRequest, PurchaseRequestStatus, BulkTagUpdateResult, ReturnStandardResult,
  StandardInternalIdSyncBatch, StandardInternalIdSyncReport
} from '../../core/models/standard.model';

import { StandardCacheService }   from './services/standard-cache.service';
import { StandardCrudService }    from './services/standard-crud.service';
import { StandardUsageService }   from './services/standard-usage.service';
import { StandardRequestService } from './services/standard-request.service';
import { StandardBulkTagMode } from './services/standard-tag.utils';
import {
  StandardImportSaveResult,
  StandardImportService,
  StandardImportWorkbookPreview
} from './services/standard-import.service';
import { StandardInternalIdSyncService } from './services/standard-internal-id-sync.service';
import { SyncBatchProgress } from '../../shared/utils/standard-internal-id';

@Injectable({ providedIn: 'root' })
export class StandardService {
  // Giữ fb/auth để tương thích với component trực tiếp dùng stdService.fb
  fb   = inject(FirebaseService);
  auth = inject(AuthService);

  private cache    = inject(StandardCacheService);
  private crud     = inject(StandardCrudService);
  private usage    = inject(StandardUsageService);
  private request  = inject(StandardRequestService);
  private importer = inject(StandardImportService);
  private internalIdSync = inject(StandardInternalIdSyncService);

  // ─── Expose deltaSync cho component dùng stdService.deltaSync ────────────────
  get deltaSync() { return this.cache.deltaSync; }

  // ─── listState (trạng thái lưới — giữ khi Back từ detail) ───────────────────
  get listState() { return this.cache.listState; }

  // ═══════════════════════════════════════════════════════════════════════════
  // CACHE & LISTENER
  // ═══════════════════════════════════════════════════════════════════════════
  startRealtimeDeltaListener(cb: () => void): () => void {
    return this.cache.startRealtimeDeltaListener(cb);
  }
  /** Listener nhận callback không tham số (tương thích standard-detail.component) */
  listenToStandards(callback: (() => void) | ((standards: ReferenceStandard[]) => void)): Unsubscribe {
    return this.cache.listenToStandards(callback as (standards: ReferenceStandard[]) => void);
  }
  invalidateLocalStandardsCache(): void {
    return this.cache.invalidateLocalStandardsCache();
  }
  /** @deprecated Dùng invalidateLocalStandardsCache() */
  invalidateStandardsCache(): void { this.cache.invalidateLocalStandardsCache(); }

  async getStandardById(stdId: string): Promise<ReferenceStandard | null> {
    return this.cache.getStandardById(stdId);
  }
  getAllStandardsFromCache(): ReferenceStandard[] {
    return this.cache.getAllStandardsFromCache();
  }
  async getNearestExpiry(): Promise<ReferenceStandard | null> {
    return this.cache.getNearestExpiry();
  }
  async fetchAllAndCache(): Promise<ReferenceStandard[]> {
    return this.cache.fetchAllAndCache();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CRUD
  // ═══════════════════════════════════════════════════════════════════════════
  generateSearchKey(std: ReferenceStandard): string {
    return this.crud.generateSearchKey(std);
  }
  async getStandardsPage(
    pageSize: number, lastDoc: QueryDocumentSnapshot | null,
    searchTerm: string, sortOption?: string
  ): Promise<StandardsPage> {
    return this.crud.getStandardsPage(pageSize, lastDoc, searchTerm, sortOption);
  }
  async addStandard(std: ReferenceStandard): Promise<void> {
    return this.crud.addStandard(std);
  }
  async updateStandard(std: ReferenceStandard, tagDelta?: { originalTags: readonly string[] }): Promise<void> {
    return this.crud.updateStandard(std, tagDelta);
  }
  async releaseInternalId(standardId: string, reason: string): Promise<void> {
    return this.crud.releaseInternalId(standardId, reason);
  }
  async scanInternalIdSync(): Promise<StandardInternalIdSyncReport> {
    return this.internalIdSync.scan();
  }
  async applyInternalIdSync(
    report: StandardInternalIdSyncReport,
    corrections: Record<string, string> = {},
    selectedChangeKeys?: readonly string[],
    onProgress?: (progress: SyncBatchProgress) => void,
  ): Promise<string[]> {
    return this.internalIdSync.apply(report, corrections, selectedChangeKeys, onProgress);
  }
  async getRecentInternalIdSyncBatches(limitCount = 20): Promise<StandardInternalIdSyncBatch[]> {
    return this.internalIdSync.getRecentBatches(limitCount);
  }
  async getRecentBatches(limitCount = 20): Promise<StandardInternalIdSyncBatch[]> {
    return this.internalIdSync.getRecentBatches(limitCount);
  }
  async updateStandardNames(updates: StandardNameUpdate[]): Promise<string> {
    return this.crud.updateStandardNames(updates);
  }
  async getRecentStandardNameCleanupBatches(limitCount = 20): Promise<StandardCleanupBatch[]> {
    return this.crud.getRecentStandardNameCleanupBatches(limitCount);
  }
  async undoStandardNameCleanupBatch(batchId: string): Promise<void> {
    return this.crud.undoStandardNameCleanupBatch(batchId);
  }
  async quickUpdateField(stdId: string, fields: Record<string, unknown>): Promise<void> {
    return this.crud.quickUpdateField(stdId, fields);
  }
  async updateStandardStock(stdId: string, newAmount: number, reason: string): Promise<void> {
    return this.crud.updateStandardStock(stdId, newAmount, reason);
  }
  async bulkUpdateStandardTags(ids: readonly string[], tags: unknown, mode: StandardBulkTagMode): Promise<BulkTagUpdateResult> {
    return this.crud.bulkUpdateStandardTags(ids, tags, mode);
  }
  async deleteStandard(id: string, name?: string): Promise<void> {
    return this.crud.deleteStandard(id, name);
  }
  async deleteSelectedStandards(ids: string[]): Promise<void> {
    return this.crud.deleteSelectedStandards(ids);
  }
  async restoreStandard(id: string, name?: string): Promise<void> {
    return this.crud.restoreStandard(id, name);
  }
  async requestCoa(std: ReferenceStandard): Promise<void> {
    return this.crud.requestCoa(std);
  }
  async completeCoaUpload(standards: ReferenceStandard[], certificateUrl: string): Promise<void> {
    return this.crud.completeCoaUpload(standards, certificateUrl);
  }
  async logGlobalActivity(action: string, details: string, targetId?: string): Promise<void> {
    return this.crud.logGlobalActivity(action, details, targetId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // USAGE LOGS
  // ═══════════════════════════════════════════════════════════════════════════
  listenToGlobalUsageLogs(callback: (logs: UsageLog[]) => void): Unsubscribe {
    return this.usage.listenToGlobalUsageLogs(callback);
  }
  async getUsageHistory(stdId: string): Promise<UsageLog[]> {
    return this.usage.getUsageHistory(stdId);
  }
  async getUsageHistoryPage(
    stdId: string,
    pageSize?: number,
    lastDoc?: QueryDocumentSnapshot | null
  ): Promise<{ items: UsageLog[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> {
    return this.usage.getUsageHistoryPage(stdId, pageSize, lastDoc);
  }
  async getEarliestUsageLog(stdId: string): Promise<UsageLog | null> {
    return this.usage.getEarliestUsageLog(stdId);
  }
  async queryUsageLogsByDateRange(
    fromTimestamp: number, toTimestamp: number,
    pageSize?: number, lastDoc?: QueryDocumentSnapshot | null
  ): Promise<{ items: UsageLog[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> {
    return this.usage.queryUsageLogsByDateRange(fromTimestamp, toTimestamp, pageSize, lastDoc);
  }
  async queryUsageLogsPage(
    pageSize?: number, lastDoc?: QueryDocumentSnapshot | null
  ): Promise<{ items: UsageLog[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> {
    return this.usage.queryUsageLogsPage(pageSize, lastDoc);
  }
  async queryUsageLogsBeforeTimestamp(
    beforeTimestamp: number,
    pageSize?: number
  ): Promise<{ items: UsageLog[]; hasMore: boolean }> {
    return this.usage.queryUsageLogsBeforeTimestamp(beforeTimestamp, pageSize);
  }
  async recordUsage(stdId: string, log: UsageLog): Promise<void> {
    return this.usage.recordUsage(stdId, log);
  }
  async recordBackfillUsage(stdId: string, log: UsageLog, actorUserId: string, actorUserName: string): Promise<void> {
    return this.usage.recordBackfillUsage(stdId, log, actorUserId, actorUserName);
  }
  async logUsageForRequest(
    requestId: string, standardId: string, amount: number,
    unit: string, purpose: string, userId: string, userName: string
  ): Promise<void> {
    return this.usage.logUsageForRequest(requestId, standardId, amount, unit, purpose, userId, userName);
  }
  async deleteUsageLog(stdId: string, logId: string, requestId?: string): Promise<void> {
    return this.usage.deleteUsageLog(stdId, logId, requestId);
  }
  async fixHistoricalUsageLogsUsers(): Promise<void> {
    return this.usage.fixHistoricalUsageLogsUsers();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REQUESTS
  // ═══════════════════════════════════════════════════════════════════════════
  startRequestsListener(callback: (requests: StandardRequest[]) => void): () => void {
    return this.request.startRequestsListener(callback);
  }
  getRequestsFromCache(): StandardRequest[] {
    return this.request.getRequestsFromCache();
  }
  /** @deprecated Dùng startRequestsListener() */
  listenToRequests(callback: (requests: StandardRequest[]) => void): Unsubscribe {
    return this.request.listenToRequests(callback);
  }
  async createRequest(request: StandardRequest, isAssign?: boolean): Promise<void> {
    return this.request.createRequest(request, isAssign);
  }
  async updateRequestStatus(
    requestId: string, status: StandardRequestStatus,
    updates?: Partial<StandardRequest>
  ): Promise<void> {
    return this.request.updateRequestStatus(requestId, status, updates);
  }
  async dispenseStandard(
    requestId: string, standardId: string,
    approverId: string, approverName: string, isAssign?: boolean
  ): Promise<void> {
    return this.request.dispenseStandard(requestId, standardId, approverId, approverName, isAssign);
  }
  async returnStandard(
    requestId: string, standardId: string,
    receiverId: string, receiverName: string,
    isDepleted?: boolean, amountUsed?: number, unit?: string, disposalReason?: string,
    finalSopTags?: string[]
  ): Promise<ReturnStandardResult> {
    return this.request.returnStandard(requestId, standardId, receiverId, receiverName, isDepleted, amountUsed, unit, disposalReason, finalSopTags);
  }
  async hardDeleteRequest(request: StandardRequest): Promise<void> {
    return this.request.hardDeleteRequest(request);
  }

  // ─── Purchase Requests ────────────────────────────────────────────────────
  async createPurchaseRequest(req: Partial<PurchaseRequest>): Promise<string> {
    return this.request.createPurchaseRequest(req);
  }
  listenToPendingPurchaseRequests(callback: (reqs: PurchaseRequest[]) => void): Unsubscribe {
    return this.request.listenToPendingPurchaseRequests(callback);
  }
  async completePurchaseRequest(reqId: string, stdId: string, processedBy: string, processedByName: string): Promise<void> {
    return this.request.completePurchaseRequest(reqId, stdId, processedBy, processedByName);
  }
  async updatePurchaseRequestStatus(
    reqId: string,
    stdId: string,
    status: Extract<PurchaseRequestStatus, 'ORDERED' | 'REJECTED'>
  ): Promise<void> {
    return this.request.updatePurchaseRequestStatus(reqId, stdId, status);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // IMPORT / EXPORT
  // ═══════════════════════════════════════════════════════════════════════════
  parseExcelDate(val: unknown): string {
    return this.importer.parseExcelDate(val);
  }
  async parseExcelWorkbook(file: File, sheetName?: string): Promise<StandardImportWorkbookPreview> {
    return this.importer.parseExcelWorkbook(file, sheetName);
  }
  async parseExcelData(file: File, sheetName?: string): Promise<ImportPreviewItem[]> {
    return this.importer.parseExcelData(file, sheetName);
  }
  async saveImportedData(data: ImportPreviewItem[]): Promise<StandardImportSaveResult> {
    return this.importer.saveImportedData(data);
  }
  async parseUsageLogExcelData(file: File): Promise<ImportUsageLogPreviewItem[]> {
    return this.importer.parseUsageLogExcelData(file);
  }
  async saveImportedUsageLogs(data: ImportUsageLogPreviewItem[]): Promise<void> {
    return this.importer.saveImportedUsageLogs(data);
  }
}
