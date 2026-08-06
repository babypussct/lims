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
import { StandardCacheService } from './services/standard-cache.service';
import { StandardCrudService } from './services/standard-crud.service';
import { StandardUsageService } from './services/standard-usage.service';
import { StandardRequestService } from './services/standard-request.service';
import { StandardImportService } from './services/standard-import.service';
import * as i0 from "@angular/core";
export class StandardService {
    constructor() {
        // Giữ fb/auth để tương thích với component trực tiếp dùng stdService.fb
        this.fb = inject(FirebaseService);
        this.auth = inject(AuthService);
        this.cache = inject(StandardCacheService);
        this.crud = inject(StandardCrudService);
        this.usage = inject(StandardUsageService);
        this.request = inject(StandardRequestService);
        this.importer = inject(StandardImportService);
    }
    // ─── Expose deltaSync cho component dùng stdService.deltaSync ────────────────
    get deltaSync() { return this.cache.deltaSync; }
    // ─── listState (trạng thái lưới — giữ khi Back từ detail) ───────────────────
    get listState() { return this.cache.listState; }
    // ═══════════════════════════════════════════════════════════════════════════
    // CACHE & LISTENER
    // ═══════════════════════════════════════════════════════════════════════════
    startRealtimeDeltaListener(cb) {
        return this.cache.startRealtimeDeltaListener(cb);
    }
    /** Listener nhận callback không tham số (tương thích standard-detail.component) */
    listenToStandards(callback) {
        return this.cache.listenToStandards(callback);
    }
    invalidateLocalStandardsCache() {
        return this.cache.invalidateLocalStandardsCache();
    }
    /** @deprecated Dùng invalidateLocalStandardsCache() */
    invalidateStandardsCache() { this.cache.invalidateLocalStandardsCache(); }
    async getStandardById(stdId) {
        return this.cache.getStandardById(stdId);
    }
    getAllStandardsFromCache() {
        return this.cache.getAllStandardsFromCache();
    }
    async getNearestExpiry() {
        return this.cache.getNearestExpiry();
    }
    async fetchAllAndCache() {
        return this.cache.fetchAllAndCache();
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // CRUD
    // ═══════════════════════════════════════════════════════════════════════════
    generateSearchKey(std) {
        return this.crud.generateSearchKey(std);
    }
    async getStandardsPage(pageSize, lastDoc, searchTerm, sortOption) {
        return this.crud.getStandardsPage(pageSize, lastDoc, searchTerm, sortOption);
    }
    async addStandard(std) {
        return this.crud.addStandard(std);
    }
    async updateStandard(std, tagDelta) {
        return this.crud.updateStandard(std, tagDelta);
    }
    async updateStandardNames(updates) {
        return this.crud.updateStandardNames(updates);
    }
    async getRecentStandardNameCleanupBatches(limitCount = 20) {
        return this.crud.getRecentStandardNameCleanupBatches(limitCount);
    }
    async undoStandardNameCleanupBatch(batchId) {
        return this.crud.undoStandardNameCleanupBatch(batchId);
    }
    async quickUpdateField(stdId, fields) {
        return this.crud.quickUpdateField(stdId, fields);
    }
    async updateStandardStock(stdId, newAmount, reason) {
        return this.crud.updateStandardStock(stdId, newAmount, reason);
    }
    async bulkUpdateStandardTags(ids, tags, mode) {
        return this.crud.bulkUpdateStandardTags(ids, tags, mode);
    }
    async deleteStandard(id, name) {
        return this.crud.deleteStandard(id, name);
    }
    async deleteSelectedStandards(ids) {
        return this.crud.deleteSelectedStandards(ids);
    }
    async restoreStandard(id, name) {
        return this.crud.restoreStandard(id, name);
    }
    async requestCoa(std) {
        return this.crud.requestCoa(std);
    }
    async completeCoaUpload(standards, certificateUrl) {
        return this.crud.completeCoaUpload(standards, certificateUrl);
    }
    async logGlobalActivity(action, details, targetId) {
        return this.crud.logGlobalActivity(action, details, targetId);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // USAGE LOGS
    // ═══════════════════════════════════════════════════════════════════════════
    listenToGlobalUsageLogs(callback) {
        return this.usage.listenToGlobalUsageLogs(callback);
    }
    async getUsageHistory(stdId) {
        return this.usage.getUsageHistory(stdId);
    }
    async getUsageHistoryPage(stdId, pageSize, lastDoc) {
        return this.usage.getUsageHistoryPage(stdId, pageSize, lastDoc);
    }
    async getEarliestUsageLog(stdId) {
        return this.usage.getEarliestUsageLog(stdId);
    }
    async queryUsageLogsByDateRange(fromTimestamp, toTimestamp, pageSize, lastDoc) {
        return this.usage.queryUsageLogsByDateRange(fromTimestamp, toTimestamp, pageSize, lastDoc);
    }
    async queryUsageLogsPage(pageSize, lastDoc) {
        return this.usage.queryUsageLogsPage(pageSize, lastDoc);
    }
    async queryUsageLogsBeforeTimestamp(beforeTimestamp, pageSize) {
        return this.usage.queryUsageLogsBeforeTimestamp(beforeTimestamp, pageSize);
    }
    async recordUsage(stdId, log) {
        return this.usage.recordUsage(stdId, log);
    }
    async recordBackfillUsage(stdId, log, actorUserId, actorUserName) {
        return this.usage.recordBackfillUsage(stdId, log, actorUserId, actorUserName);
    }
    async logUsageForRequest(requestId, standardId, amount, unit, purpose, userId, userName) {
        return this.usage.logUsageForRequest(requestId, standardId, amount, unit, purpose, userId, userName);
    }
    async deleteUsageLog(stdId, logId, requestId) {
        return this.usage.deleteUsageLog(stdId, logId, requestId);
    }
    async fixHistoricalUsageLogsUsers() {
        return this.usage.fixHistoricalUsageLogsUsers();
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // REQUESTS
    // ═══════════════════════════════════════════════════════════════════════════
    startRequestsListener(callback) {
        return this.request.startRequestsListener(callback);
    }
    getRequestsFromCache() {
        return this.request.getRequestsFromCache();
    }
    /** @deprecated Dùng startRequestsListener() */
    listenToRequests(callback) {
        return this.request.listenToRequests(callback);
    }
    async createRequest(request, isAssign) {
        return this.request.createRequest(request, isAssign);
    }
    async updateRequestStatus(requestId, status, updates) {
        return this.request.updateRequestStatus(requestId, status, updates);
    }
    async dispenseStandard(requestId, standardId, approverId, approverName, isAssign) {
        return this.request.dispenseStandard(requestId, standardId, approverId, approverName, isAssign);
    }
    async returnStandard(requestId, standardId, receiverId, receiverName, isDepleted, amountUsed, unit, disposalReason, finalSopTags) {
        return this.request.returnStandard(requestId, standardId, receiverId, receiverName, isDepleted, amountUsed, unit, disposalReason, finalSopTags);
    }
    async hardDeleteRequest(request) {
        return this.request.hardDeleteRequest(request);
    }
    // ─── Purchase Requests ────────────────────────────────────────────────────
    async createPurchaseRequest(req) {
        return this.request.createPurchaseRequest(req);
    }
    listenToPendingPurchaseRequests(callback) {
        return this.request.listenToPendingPurchaseRequests(callback);
    }
    async completePurchaseRequest(reqId, stdId, processedBy, processedByName) {
        return this.request.completePurchaseRequest(reqId, stdId, processedBy, processedByName);
    }
    async updatePurchaseRequestStatus(reqId, stdId, status) {
        return this.request.updatePurchaseRequestStatus(reqId, stdId, status);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // IMPORT / EXPORT
    // ═══════════════════════════════════════════════════════════════════════════
    parseExcelDate(val) {
        return this.importer.parseExcelDate(val);
    }
    async parseExcelWorkbook(file, sheetName) {
        return this.importer.parseExcelWorkbook(file, sheetName);
    }
    async parseExcelData(file, sheetName) {
        return this.importer.parseExcelData(file, sheetName);
    }
    async saveImportedData(data) {
        return this.importer.saveImportedData(data);
    }
    async parseUsageLogExcelData(file) {
        return this.importer.parseUsageLogExcelData(file);
    }
    async saveImportedUsageLogs(data) {
        return this.importer.saveImportedUsageLogs(data);
    }
    static { this.ɵfac = function StandardService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: StandardService, factory: StandardService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=standard.service.js.map