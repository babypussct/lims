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
  ReferenceStandard, UsageLog, StandardsPage,
  ImportPreviewItem, ImportUsageLogPreviewItem,
  StandardRequest, StandardRequestStatus, PurchaseRequest
} from '../../core/models/standard.model';

import { StandardCacheService }   from './services/standard-cache.service';
import { StandardCrudService }    from './services/standard-crud.service';
import { StandardUsageService }   from './services/standard-usage.service';
import { StandardRequestService } from './services/standard-request.service';
import { StandardImportService }  from './services/standard-import.service';
import { NotificationService }    from '../../core/services/notification.service';

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
  private notif    = inject(NotificationService);

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
  async updateStandard(std: ReferenceStandard): Promise<void> {
    return this.crud.updateStandard(std);
  }
  async quickUpdateField(stdId: string, fields: Record<string, unknown>): Promise<void> {
    return this.crud.quickUpdateField(stdId, fields);
  }
  async updateStandardStock(stdId: string, newAmount: number, reason: string): Promise<void> {
    return this.crud.updateStandardStock(stdId, newAmount, reason);
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
  /** requestCoa — notificationService là optional, mặc định dùng NotificationService inject */
  async requestCoa(std: ReferenceStandard, notificationService?: any): Promise<void> {
    return this.crud.requestCoa(std, notificationService ?? this.notif);
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
  async recordUsage(stdId: string, log: UsageLog): Promise<void> {
    return this.usage.recordUsage(stdId, log);
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
  async recalculateInventoryFromLogs(onProgress?: (current: number, total: number) => void): Promise<number> {
    return this.usage.recalculateInventoryFromLogs(onProgress);
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
    isDepleted?: boolean, amountUsed?: number, unit?: string, disposalReason?: string
  ): Promise<void> {
    return this.request.returnStandard(requestId, standardId, receiverId, receiverName, isDepleted, amountUsed, unit, disposalReason);
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

  // ═══════════════════════════════════════════════════════════════════════════
  // IMPORT / EXPORT
  // ═══════════════════════════════════════════════════════════════════════════
  parseExcelDate(val: unknown): string {
    return this.importer.parseExcelDate(val);
  }
  async parseExcelData(file: File): Promise<ImportPreviewItem[]> {
    return this.importer.parseExcelData(file);
  }
  async saveImportedData(data: ImportPreviewItem[]): Promise<void> {
    return this.importer.saveImportedData(data);
  }
  async parseUsageLogExcelData(file: File): Promise<ImportUsageLogPreviewItem[]> {
    return this.importer.parseUsageLogExcelData(file);
  }
  async saveImportedUsageLogs(data: ImportUsageLogPreviewItem[]): Promise<void> {
    return this.importer.saveImportedUsageLogs(data);
  }
}
