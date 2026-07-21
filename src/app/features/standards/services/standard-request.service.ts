import { Injectable, inject, effect } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  doc, collection, getDoc, writeBatch,
  serverTimestamp, runTransaction, deleteField, query,
  where, Unsubscribe, onSnapshot, getDocs
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog, StandardRequest, StandardRequestStatus, PurchaseRequest, PurchaseRequestStatus } from '../../../core/models/standard.model';
import { NotificationCenterService } from '../../../core/services/notification-center.service';
import { getStandardizedAmount } from '../../../shared/utils/utils';
import { canAssign, getFefoPriorityStandard } from '../../../shared/utils/standard-fefo';
import {
  normalizeNonNegativeStandardAmount,
  reconcileStandardReturn
} from '../../../shared/utils/standard-amount';
import {
  assertPurchaseRequestTransition,
  assertStandardRequestTransition,
  canCompleteStandardReturn,
  normalizeLegacyStandardRequestStatus
} from '../../../shared/utils/standard-workflow';
import { DeltaSyncService } from '../../../core/services/delta-sync.service';
import { StandardCrudService } from './standard-crud.service';
import { StandardCacheService } from './standard-cache.service';

/**
 * StandardRequestService — Vòng đời đầy đủ của StandardRequest.
 *
 * Bao gồm: tạo, duyệt, cấp, trả, hủy, xóa cứng request.
 * Cũng bao gồm PurchaseRequest (đặt mua chuẩn khi tồn kho thấp).
 *
 * v2: Dùng DeltaSyncService singleton mode thay vì tự quản lý listener.
 */
@Injectable({ providedIn: 'root' })
export class StandardRequestService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private crud = inject(StandardCrudService);
  private cache = inject(StandardCacheService);
  private deltaSync = inject(DeltaSyncService);
  private notificationCenter = inject(NotificationCenterService);

  constructor() {
    // Cleanup singleton khi user logout hoặc đổi account
    effect(() => {
      const user = this.auth.currentUser();
      if (!user) {
        this.deltaSync.destroySingleton(this._getCacheKey('admin'));
      }
    });
  }

  // Cache key phân biệt theo role để tránh data leak giữa admin/user
  private _getCacheKey(roleKey: string): string {
    return `lims_std_req_cache_${roleKey}_${this.fb.APP_ID}`;
  }
  private _getCursorKey(roleKey: string): string {
    return `lims_std_req_cursor_${roleKey}_${this.fb.APP_ID}`;
  }
  private _getRoleKey(): string {
    const isApprover = this.auth.canAssignStandards();
    const uid = this.auth.currentUser()?.uid;
    return isApprover ? 'admin' : (uid || 'guest');
  }

  // ─── Singleton Listener via DeltaSync v2 ───────────────────────────────────

  /**
   * Subscribe vào singleton listener cho standard_requests.
   * Delegates to DeltaSyncService.startSingletonListener().
   * @returns Hàm unregister callback (KHÔNG hủy listener singleton)
   */
  startRequestsListener(callback: (requests: StandardRequest[]) => void): () => void {
    const isApprover = this.auth.canAssignStandards();
    const uid = this.auth.currentUser()?.uid;
    const roleKey = this._getRoleKey();

    return this.deltaSync.startSingletonListener<StandardRequest>({
      cacheKey: this._getCacheKey(roleKey),
      cursorKey: this._getCursorKey(roleKey),
      collectionPath: `artifacts/${this.fb.APP_ID}/standard_requests`,
      maxCacheSize: 1000,
      orderByField: 'createdAt',
      orderDirection: 'desc',
      queryConstraints: (!isApprover && uid) ? [where('requestedBy', '==', uid)] : []
    }, data => callback(data
      .filter(request => !request._isDeleted)
      .map(request => ({ ...request, status: normalizeLegacyStandardRequestStatus(request.status) }))
    ));
  }

  /**
   * Đọc requests từ cache (0 Firestore reads).
   * Ưu tiên in-memory (singleton đang chạy) → fallback localStorage.
   */
  getRequestsFromCache(): StandardRequest[] {
    const roleKey = this._getRoleKey();
    const cacheKey = this._getCacheKey(roleKey);
    return (this.deltaSync.getMemCache<StandardRequest>(cacheKey)
      ?? this.deltaSync.getCache<StandardRequest>(cacheKey))
      .filter(request => !request._isDeleted)
      .map(request => ({ ...request, status: normalizeLegacyStandardRequestStatus(request.status) }));
  }

  /**
   * @deprecated Dùng startRequestsListener() thay thế.
   */
  listenToRequests(callback: (requests: StandardRequest[]) => void): Unsubscribe {
    const unregister = this.startRequestsListener(callback);
    return unregister as unknown as Unsubscribe;
  }


  listenToPendingPurchaseRequests(callback: (reqs: PurchaseRequest[]) => void): Unsubscribe {
    const reqRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests`);
    const q = query(reqRef, where('status', 'in', ['PENDING', 'ORDERED']));
    
    return onSnapshot(q, (snapshot: any) => {
      const reqs: PurchaseRequest[] = [];
      snapshot.forEach((d: any) => reqs.push({ ...d.data(), id: d.id } as PurchaseRequest));
      callback(reqs);
    });
  }

  async createRequest(request: StandardRequest, isAssign = false): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser) throw new Error('Phiên đăng nhập không còn hợp lệ.');
    if (isAssign && !this.auth.canAssignStandards()) {
      throw new Error('Bạn không có quyền gán chuẩn trực tiếp.');
    }
    if (!isAssign && !this.auth.hasPermission('standard_request')) {
      throw new Error('Bạn không có quyền đăng ký mượn chuẩn.');
    }
    if (!request.purpose?.trim()) throw new Error('Mục đích sử dụng là bắt buộc.');
    if (request.expectedAmount !== undefined && (
      !Number.isFinite(request.expectedAmount) || request.expectedAmount < 0
    )) {
      throw new Error('Lượng dự kiến phải là số không âm.');
    }
    if (isAssign && (!request.requestedBy || !request.requestedByName?.trim())) {
      throw new Error('Thiếu người được gán chuẩn.');
    }

    const reqRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests`));
    request.id = reqRef.id;
    request.createdAt = Date.now();
    request.updatedAt = Date.now();
    let fefoStandards = this.cache.getAllStandardsFromCache();
    if (fefoStandards.length === 0) fefoStandards = await this.cache.fetchAllAndCache();
    
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${request.standardId}`);
    await runTransaction(this.fb.db, async transaction => {
      const stdDoc = await transaction.get(stdRef);
      if (!stdDoc.exists()) throw new Error('Chuẩn không tồn tại!');

      const standard = { ...stdDoc.data(), id: stdDoc.id } as ReferenceStandard;
      if (!canAssign(standard)) {
        throw new Error('Lô chuẩn không còn sẵn sàng để cấp (đang dùng, đã hết hoặc hết hạn).');
      }
      if (standard.has_pending_request) {
        throw new Error('Lô chuẩn đã có yêu cầu đang chờ duyệt.');
      }
      const priority = getFefoPriorityStandard({ ...standard, has_pending_request: false }, fefoStandards);
      if (priority && priority.id !== standard.id) {
        throw new Error(`FEFO: cần dùng lô ${priority.internal_id || priority.lot_number || priority.id} trước.`);
      }

      const trustedRequest: StandardRequest = {
        ...request,
        standardId: standard.id,
        standardName: standard.name,
        lotNumber: standard.lot_number,
        requestedBy: isAssign ? request.requestedBy : currentUser.uid,
        requestedByName: isAssign
          ? request.requestedByName
          : (currentUser.displayName || currentUser.email || 'Người dùng'),
        status: 'PENDING_APPROVAL',
        totalAmountUsed: 0,
        usageLogs: [],
        _isDeleted: false
      };
      transaction.set(reqRef, { ...trustedRequest, lastUpdated: serverTimestamp() });
      // Reserve the lot atomically for both normal requests and direct assignment.
      // dispenseStandard() clears this flag immediately after a direct assignment.
      transaction.update(stdRef, { has_pending_request: true, lastUpdated: serverTimestamp() });
    });

    if (isAssign) {
      await this.crud.logGlobalActivity('ASSIGN_STANDARD', `Gán chuẩn: ${request.standardName} cho ${request.requestedByName}`, request.id);
    } else {
      await this.crud.logGlobalActivity('REQUEST_STANDARD', `Yêu cầu chuẩn: ${request.standardName}`, request.id);
      await this.notificationCenter.publish({
        recipientUid: 'role:admin', senderUid: currentUser?.uid,
        senderName: currentUser?.displayName || 'Người dùng',
        type: 'BORROW_REQUEST', title: 'Yêu cầu mượn chuẩn',
        message: `${currentUser?.displayName || 'Ai đó'} vừa đăng ký mượn lô chuẩn ${request.standardName}.`,
        targetId: request.standardId, actionUrl: `/standards/${request.standardId}`,
        channels: ['inbox', 'push']
      });
    }
  }

  async updateRequestStatus(
    requestId: string,
    status: StandardRequestStatus,
    updates: Partial<StandardRequest> = {}
  ): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser) throw new Error('Phiên đăng nhập không còn hợp lệ.');
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
    let reqData: StandardRequest | null = null;

    await runTransaction(this.fb.db, async transaction => {
      const reqDoc = await transaction.get(reqRef);
      if (!reqDoc.exists()) throw new Error('Yêu cầu không tồn tại.');
      const freshRequest = { ...reqDoc.data(), id: reqDoc.id } as StandardRequest;
      if (freshRequest._isDeleted) throw new Error('Yêu cầu đã bị xóa.');

      const isOwner = freshRequest.requestedBy === currentUser.uid;
      const isApprover = this.auth.canAssignStandards();
      if (!isOwner && !isApprover) throw new Error('Bạn không có quyền cập nhật yêu cầu này.');
      if (status === 'REJECTED' && !isApprover) throw new Error('Chỉ người duyệt mới có thể từ chối yêu cầu.');
      assertStandardRequestTransition(freshRequest.status, status);

      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${freshRequest.standardId}`);
      const stdDoc = await transaction.get(stdRef);
      const stockUnit = stdDoc.exists() ? ((stdDoc.data() as ReferenceStandard).unit || 'mg') : 'mg';
      const safeUpdates: Record<string, unknown> = {};

      if (isApprover) {
        for (const key of ['purpose', 'expectedAmount', 'rejectionReason'] as const) {
          if (updates[key] !== undefined) safeUpdates[key] = updates[key];
        }
      }
      if (updates.reportedDepleted !== undefined) safeUpdates['reportedDepleted'] = Boolean(updates.reportedDepleted);

      if (status === 'PENDING_RETURN') {
        const reported = normalizeNonNegativeStandardAmount(
          Number(updates.totalAmountUsed ?? freshRequest.totalAmountUsed ?? 0),
          stockUnit,
          stockUnit,
          'Tổng lượng đã dùng'
        );
        const logged = (freshRequest.usageLogs || [])
          .filter(log => !log._isDeleted)
          .reduce((sum, log) => {
            const normalized = log.normalized_unit === stockUnit && Number.isFinite(log.normalized_amount)
              ? Number(log.normalized_amount)
              : getStandardizedAmount(log.amount_used, log.unit || stockUnit, stockUnit);
            return sum + (normalized !== null && Number.isFinite(normalized) && normalized > 0 ? normalized : 0);
          }, 0);
        if (reported + 1e-9 < logged) {
          throw new Error(`Tổng lượng báo trả không thể nhỏ hơn ${logged} ${stockUnit} đã ghi nhận.`);
        }
        safeUpdates['totalAmountUsed'] = reported;
      } else if (status === 'IN_PROGRESS' && freshRequest.status === 'PENDING_RETURN') {
        safeUpdates['reportedDepleted'] = false;
        safeUpdates['totalAmountUsed'] = (freshRequest.usageLogs || [])
          .filter(log => !log._isDeleted)
          .reduce((sum, log) => {
            const normalized = log.normalized_unit === stockUnit && Number.isFinite(log.normalized_amount)
              ? Number(log.normalized_amount)
              : getStandardizedAmount(log.amount_used, log.unit || stockUnit, stockUnit);
            return sum + (normalized !== null && Number.isFinite(normalized) && normalized > 0 ? normalized : 0);
          }, 0);
      }

      transaction.update(reqRef, {
        status,
        ...safeUpdates,
        updatedAt: Date.now(),
        lastUpdated: serverTimestamp()
      });
      if (status === 'REJECTED' && stdDoc.exists()) {
        transaction.update(stdRef, { has_pending_request: deleteField(), lastUpdated: serverTimestamp() });
      }
      reqData = { ...freshRequest, status, ...safeUpdates } as StandardRequest;
    });

    if (reqData) {
      let action = 'UPDATE_STANDARD_REQUEST';
      let details = `Cập nhật yêu cầu: ${(reqData as StandardRequest).standardName} -> ${status}`;

      if (status === 'REJECTED') {
        action = 'REJECT_STANDARD_REQUEST';
        details = `Từ chối yêu cầu: ${(reqData as StandardRequest).standardName}`;
        await this.notificationCenter.publish({
          recipientUid: (reqData as StandardRequest).requestedBy, senderUid: currentUser.uid,
          senderName: currentUser.displayName || 'Hệ thống',
          type: 'REQUEST_REJECTED', title: 'Yêu cầu bị từ chối',
          message: `Yêu cầu mượn lô chuẩn ${(reqData as StandardRequest).standardName} của bạn không được phê duyệt.`,
          targetId: (reqData as StandardRequest).standardId, actionUrl: `/standards/${(reqData as StandardRequest).standardId}`,
          channels: ['inbox', 'push']
        });
      } else if (status === 'PENDING_RETURN') {
        action = 'REPORT_RETURN_STANDARD';
        details = `Báo cáo trả chuẩn: ${(reqData as StandardRequest).standardName}`;
      }
      await this.crud.logGlobalActivity(action, details, requestId);
    }
  }

  // ─── Dispense Standard ────────────────────────────────────────────────────────
  async dispenseStandard(
    requestId: string, standardId: string,
    approverId: string, approverName: string, isAssign = false
  ): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.auth.canAssignStandards()) {
      throw new Error('Bạn không có quyền duyệt hoặc cấp chuẩn.');
    }
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
    let reqData: StandardRequest | null = null;
    let fefoStandards = this.cache.getAllStandardsFromCache();
    if (fefoStandards.length === 0) fefoStandards = await this.cache.fetchAllAndCache();

    await runTransaction(this.fb.db, async (transaction) => {
      const stdDoc = await transaction.get(stdRef);
      const reqDoc = await transaction.get(reqRef);
      if (!stdDoc.exists()) throw new Error('Chuẩn không tồn tại!');
      if (!reqDoc.exists()) throw new Error('Yêu cầu không tồn tại!');

      const stdData = stdDoc.data();
      const standard = { ...stdData, id: stdDoc.id } as ReferenceStandard;
      if (!canAssign(standard)) {
        throw new Error('Chuẩn đang được sử dụng, đã hết hoặc hết hạn!');
      }
      // Ignore the reservation made by this request while still respecting other reserved lots.
      const priority = getFefoPriorityStandard({ ...standard, has_pending_request: false }, fefoStandards);
      if (priority && priority.id !== standard.id) {
        throw new Error(`FEFO: cần cấp lô ${priority.internal_id || priority.lot_number || priority.id} trước.`);
      }

      reqData = reqDoc.data() as StandardRequest;
      if (reqData.standardId !== standardId || reqData.status !== 'PENDING_APPROVAL') {
        throw new Error('Yêu cầu không còn hợp lệ để cấp chuẩn!');
      }
      assertStandardRequestTransition(reqData.status, 'IN_PROGRESS');
      transaction.update(stdRef, {
        status: 'IN_USE', current_holder: reqData.requestedByName,
        current_holder_uid: reqData.requestedBy, current_request_id: requestId,
        has_pending_request: deleteField(),
        lastUpdated: serverTimestamp()
      });
      transaction.update(reqRef, {
        status: 'IN_PROGRESS', approvedBy: currentUser.uid,
        approvedByName: currentUser.displayName || currentUser.email || approverName || approverId,
        approvalDate: Date.now(), updatedAt: Date.now(), lastUpdated: serverTimestamp()
      });
    });

    if (reqData) {
      if (!isAssign) {
        await this.crud.logGlobalActivity('APPROVE_STANDARD_REQUEST', `Duyệt cấp chuẩn: ${(reqData as StandardRequest).standardName}`, requestId);
        await this.notificationCenter.publish({
          recipientUid: (reqData as StandardRequest).requestedBy, senderUid: currentUser.uid,
          senderName: currentUser.displayName || 'Quản trị viên',
          type: 'REQUEST_APPROVED', title: 'Yêu cầu được duyệt',
          message: `Yêu cầu mượn lô chuẩn ${(reqData as StandardRequest).standardName} đã được phê duyệt. Xin hãy bảo quản cẩn thận!`,
          targetId: standardId, actionUrl: `/standards/${standardId}`,
          channels: ['inbox', 'push']
        });
      } else {
        // Send to the person who received it
        if (currentUser.uid !== (reqData as StandardRequest).requestedBy) {
          await this.notificationCenter.publish({
            recipientUid: (reqData as StandardRequest).requestedBy, senderUid: currentUser.uid,
            senderName: currentUser.displayName || 'Quản trị viên',
            type: 'REQUEST_APPROVED', title: 'Được cấp chuẩn',
            message: `Quản trị viên đã trực tiếp cấp cho bạn lô chuẩn ${(reqData as StandardRequest).standardName}. Xin hãy bảo quản cẩn thận!`,
            targetId: standardId, actionUrl: `/standards/${standardId}`,
            channels: ['inbox', 'push']
          });
        }
        
        // Also send to all admins (manager) so they know a standard was assigned, 
        // and so the person testing can see the notification themselves.
        await this.notificationCenter.publish({
          recipientUid: 'role:admin', senderUid: currentUser.uid,
          senderName: currentUser.displayName || 'Quản trị viên',
          type: 'SYSTEM_INFO', title: 'Gán chuẩn trực tiếp',
          message: `Quản trị viên ${currentUser.displayName} vừa gán trực tiếp lô chuẩn ${(reqData as StandardRequest).standardName} cho ${(reqData as StandardRequest).requestedByName}.`,
          targetId: standardId, actionUrl: `/standards/${standardId}`,
          channels: ['inbox', 'push']
        });
      }
    }

    // Tự động từ chối các request PENDING_APPROVAL còn sót cho cùng chuẩn
    // (ngăn UI hiển thị cùng 1 chuẩn vừa "Chờ duyệt" vừa "Đang dùng")
    try {
      const staleQuery = query(
        collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests`),
        where('standardId', '==', standardId),
        where('status', '==', 'PENDING_APPROVAL')
      );
      const staleSnap = await getDocs(staleQuery);
      if (!staleSnap.empty) {
        const cleanupBatch = writeBatch(this.fb.db);
        staleSnap.forEach(d => {
          if (d.id !== requestId) { // không đụng đến request vừa được duyệt
            cleanupBatch.update(d.ref, {
              status: 'REJECTED',
              rejectionReason: 'Chuẩn đã được cấp cho người khác.',
              updatedAt: Date.now(),
              lastUpdated: serverTimestamp()
            });
          }
        });
        await cleanupBatch.commit();
      }
    } catch (e) { console.warn('[StandardRequestService] cleanup stale requests failed:', e); }

    // Merge ngay document mới vào cache KHÔNG xóa trước — để giữ nguyên toàn bộ danh sách chuẩn
    try {
      const freshSnap = await getDoc(stdRef);
      if (freshSnap.exists()) {
        const freshStd = { id: freshSnap.id, ...freshSnap.data() } as ReferenceStandard;
        this.cache._mergeAndSave([freshStd], []);
      }
    } catch (e) { console.warn('[StandardRequestService] post-dispense cache merge failed:', e); }
  }

  // ─── Return Standard ──────────────────────────────────────────────────────────
  async returnStandard(
    requestId: string, standardId: string,
    receiverId: string, receiverName: string,
    isDepleted = false, amountUsed?: number, unit?: string, disposalReason?: string
  ): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.auth.canAssignStandards()) {
      throw new Error('Bạn không có quyền xác nhận nhận lại chuẩn.');
    }
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
    let reqData: StandardRequest | null = null;

    await runTransaction(this.fb.db, async (transaction) => {
      const stdDoc = await transaction.get(stdRef);
      const reqDoc = await transaction.get(reqRef);
      if (!stdDoc.exists()) throw new Error('Chuẩn không tồn tại!');
      if (!reqDoc.exists()) throw new Error('Yêu cầu không tồn tại!');

      const stdData = stdDoc.data() as ReferenceStandard;
      reqData = reqDoc.data() as StandardRequest;

      if (reqData.standardId !== standardId || !canCompleteStandardReturn(reqData.status)) {
        throw new Error('Yêu cầu không còn hợp lệ để nhận lại chuẩn.');
      }
      if (stdData.current_request_id !== requestId || stdData.current_holder_uid !== reqData.requestedBy) {
        throw new Error('Chuẩn không còn được cấp theo yêu cầu này.');
      }

      const stockUnit = stdData.unit || 'mg';
      const currentLogs = (reqData.usageLogs || []).filter(log => !log._isDeleted);
      const normalizedLogAmounts = currentLogs.map(log => {
        const normalized = log.normalized_unit === stockUnit && Number.isFinite(log.normalized_amount)
          ? Number(log.normalized_amount)
          : getStandardizedAmount(log.amount_used, log.unit || stockUnit, stockUnit);
        if (normalized === null || !Number.isFinite(normalized) || normalized < 0) {
          throw new Error(`Nhật ký ${log.id || ''} có đơn vị không tương thích.`);
        }
        return normalized;
      });
      const previouslyLogged = normalizedLogAmounts.reduce((sum, amount) => sum + amount, 0);
      const finalUnit = unit || stockUnit;
      const enteredTotal = amountUsed ?? (reqData.totalAmountUsed || previouslyLogged);
      const confirmedTotal = normalizeNonNegativeStandardAmount(enteredTotal, finalUnit, stockUnit, 'Tổng lượng đã dùng');
      const reconciliation = reconcileStandardReturn(
        stdData.current_amount || 0,
        normalizedLogAmounts,
        confirmedTotal,
        isDepleted
      );
      const { adjustmentAmount, disposalAmount, remainingAmount: newAmount } = reconciliation;

      transaction.update(stdRef, {
        status: isDepleted || newAmount <= 0 ? 'DEPLETED' : 'AVAILABLE',
        current_amount: newAmount,
        current_holder: deleteField(), current_holder_uid: deleteField(),
        current_request_id: deleteField(), lastUpdated: serverTimestamp()
      });

      const reqUpdateData: Record<string, any> = {
        status: 'COMPLETED', returnDate: Date.now(),
        receivedBy: currentUser.uid,
        receivedByName: currentUser.displayName || currentUser.email || receiverName || receiverId,
        updatedAt: Date.now()
      };
      if (disposalReason) reqUpdateData['disposalReason'] = disposalReason;

      const appendedLogs: UsageLog[] = [];
      const appendLog = (normalizedAmount: number, purpose: string) => {
        if (normalizedAmount <= 1e-9) return;
        const newLogRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}/logs`));
        const log: UsageLog = {
          id: newLogRef.id,
          timestamp: Date.now(),
          date: new Date().toISOString(),
          user: reqData!.requestedByName || receiverName,
          amount_used: normalizedAmount,
          unit: stockUnit,
          normalized_amount: normalizedAmount,
          normalized_unit: stockUnit,
          purpose,
          standardId,
          standardName: stdData.name,
          lotNumber: stdData.lot_number,
          cas_number: stdData.cas_number,
          internalId: stdData.internal_id,
          manufacturer: stdData.manufacturer,
          requestId
        };
        appendedLogs.push(log);
        transaction.set(newLogRef, log);
        transaction.set(
          doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`),
          { ...log, lastUpdated: serverTimestamp() }
        );
      };
      appendLog(adjustmentAmount, reqData.purpose || 'Điều chỉnh lượng dùng khi hoàn trả');
      appendLog(disposalAmount, disposalReason || reqData.disposalReason || 'Xác nhận sử dụng hết / tiêu hủy phần còn lại');
      if (appendedLogs.length) reqUpdateData['usageLogs'] = [...currentLogs, ...appendedLogs];

      reqUpdateData['totalAmountUsed'] = reconciliation.accountedTotal;
      reqUpdateData['confirmedAmountUsed'] = confirmedTotal;
      reqUpdateData['confirmedUnit'] = stockUnit;
      reqUpdateData['lastUpdated'] = serverTimestamp();
      transaction.update(reqRef, reqUpdateData);
    });

    if (reqData) {
      await this.crud.logGlobalActivity('RETURN_STANDARD', `Nhận lại chuẩn: ${(reqData as StandardRequest).standardName}`, requestId);
    }
    // Merge ngay document mới vào cache KHÔNG xóa trước — để giữ nguyên toàn bộ danh sách chuẩn
    try {
      const freshSnap = await getDoc(stdRef);
      if (freshSnap.exists()) {
        const freshStd = { id: freshSnap.id, ...freshSnap.data() } as ReferenceStandard;
        this.cache._mergeAndSave([freshStd], []);
      }
    } catch (e) { console.warn('[StandardRequestService] post-return cache merge failed:', e); }
  }

  // ─── Hard Delete Request ──────────────────────────────────────────────────────
  async hardDeleteRequest(request: StandardRequest): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.auth.canDeleteStandardLogs()) {
      throw new Error('Bạn không có quyền xóa lịch sử yêu cầu chuẩn.');
    }
    if (!request.id) throw new Error('Yêu cầu không có mã định danh.');
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${request.id}`);
    let didRollback = false;
    let freshRequest: StandardRequest | null = null;

    await runTransaction(this.fb.db, async (transaction) => {
      const reqDoc = await transaction.get(reqRef);
      if (!reqDoc.exists()) return;
      freshRequest = { ...reqDoc.data(), id: reqDoc.id } as StandardRequest;
      if (freshRequest._isDeleted || freshRequest.rolledBackAt) return;
      if ((freshRequest.usageLogs || []).length > 200) {
        throw new Error('Yêu cầu có quá nhiều nhật ký để rollback an toàn trong một giao dịch.');
      }

      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${freshRequest.standardId}`);
      const stdDoc = await transaction.get(stdRef);

      if (stdDoc.exists()) {
        const stdData = stdDoc.data() as ReferenceStandard;
        const stockUnit = stdData.unit || 'mg';
        let newAmount = stdData.current_amount || 0;
        const updates: Record<string, any> = { lastUpdated: serverTimestamp() };

        if (freshRequest.totalAmountUsed > 0) {
          let amountToRestore = 0;
          (freshRequest.usageLogs || []).filter(log => !log._isDeleted).forEach(log => {
            const standardized = log.normalized_unit === stockUnit && Number.isFinite(log.normalized_amount)
              ? Number(log.normalized_amount)
              : getStandardizedAmount(log.amount_used, log.unit || stockUnit, stockUnit);
            if (standardized !== null && Number.isFinite(standardized) && standardized > 0) {
              amountToRestore += standardized;
            }
          });
          if (amountToRestore > 0) {
            newAmount += amountToRestore;
            updates['current_amount'] = newAmount;
            if (stdData.status === 'DEPLETED' && newAmount > 0) updates['status'] = 'AVAILABLE';
          }
        }

        if (stdData.current_request_id === freshRequest.id) {
          updates['status'] = 'AVAILABLE';
          updates['current_holder'] = deleteField();
          updates['current_holder_uid'] = deleteField();
          updates['current_request_id'] = deleteField();
        }
        if (freshRequest.status === 'PENDING_APPROVAL') {
          updates['has_pending_request'] = deleteField();
        }
        transaction.update(stdRef, updates);

        (freshRequest.usageLogs || []).filter(log => !log._isDeleted).forEach(log => {
          if (log.id) {
            const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${freshRequest!.standardId}/logs/${log.id}`);
            transaction.set(logRef, {
              _isDeleted: true,
              rolledBackAt: Date.now(),
              rolledBackBy: currentUser.uid,
              lastUpdated: serverTimestamp()
            }, { merge: true });
            const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
            transaction.set(globalLogRef, {
              _isDeleted: true,
              rolledBackAt: Date.now(),
              rolledBackBy: currentUser.uid,
              lastUpdated: serverTimestamp()
            }, { merge: true });
          }
        });
      }

      const deletedStatus = freshRequest.status === 'PENDING_APPROVAL' ? 'REJECTED' : freshRequest.status;
      transaction.update(reqRef, {
        _isDeleted: true,
        status: deletedStatus,
        rolledBackAt: Date.now(),
        rolledBackBy: currentUser.uid,
        lastUpdated: serverTimestamp()
      });
      didRollback = true;
    });

    this.cache.purgeFromRequestsCache(request.id);
    if (didRollback && freshRequest) {
      await this.crud.logGlobalActivity(
        'HARD_DELETE_REQUEST',
        `Rollback lịch sử yêu cầu: ${(freshRequest as StandardRequest).standardName} (Người yêu cầu: ${(freshRequest as StandardRequest).requestedByName})`,
        request.id
      );
    }
  }

  // ─── Purchase Requests ────────────────────────────────────────────────────────
  async createPurchaseRequest(req: Partial<PurchaseRequest>): Promise<string> {
    const currentUser = this.auth.currentUser();
    if (!currentUser) throw new Error('Phiên đăng nhập không còn hợp lệ.');
    if (!this.auth.hasPermission('standard_request') && !this.auth.canAssignStandards()) {
      throw new Error('Bạn không có quyền tạo yêu cầu mua chuẩn.');
    }
    if (!req.standardId) throw new Error('Thiếu mã chuẩn cần mua.');
    if (!req.expectedAmount?.trim()) throw new Error('Số lượng cần mua là bắt buộc.');
    if (req.priority && !['NORMAL', 'HIGH'].includes(req.priority)) throw new Error('Mức ưu tiên không hợp lệ.');
    const id = doc(collection(this.fb.db, 'artifacts')).id;
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests/${id}`);
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${req.standardId}`);
    await runTransaction(this.fb.db, async (transaction) => {
      const stdDoc = await transaction.get(stdRef);
      if (!stdDoc.exists()) throw new Error('Chuẩn không tồn tại.');
      const standard = { ...stdDoc.data(), id: stdDoc.id } as ReferenceStandard;
      if (standard.restock_requested) throw new Error('Chuẩn này đã có yêu cầu mua đang xử lý.');
      const newReq: PurchaseRequest = {
        ...req,
        id,
        standardId: standard.id,
        standardName: standard.name,
        manufacturer: standard.manufacturer,
        product_code: standard.product_code,
        lot_number: standard.lot_number,
        requestedBy: currentUser.uid,
        requestedByName: currentUser.displayName || currentUser.email || 'Người dùng',
        requestDate: Date.now(),
        status: 'PENDING'
      } as PurchaseRequest;
      transaction.set(reqRef, { ...newReq, lastUpdated: serverTimestamp() });
      transaction.update(stdRef, { restock_requested: true, lastUpdated: serverTimestamp() });
    });
    return id;
  }

  async completePurchaseRequest(reqId: string, stdId: string, processedBy: string, processedByName: string): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.auth.canAssignStandards()) {
      throw new Error('Bạn không có quyền hoàn tất yêu cầu mua chuẩn.');
    }
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests/${reqId}`);
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
    await runTransaction(this.fb.db, async transaction => {
      const reqDoc = await transaction.get(reqRef);
      const stdDoc = await transaction.get(stdRef);
      if (!reqDoc.exists() || !stdDoc.exists()) throw new Error('Yêu cầu mua hoặc chuẩn không tồn tại.');
      const freshRequest = reqDoc.data() as PurchaseRequest;
      if (freshRequest.standardId !== stdId) throw new Error('Yêu cầu mua không thuộc chuẩn đã chọn.');
      assertPurchaseRequestTransition(freshRequest.status, 'COMPLETED');
      transaction.update(reqRef, {
        status: 'COMPLETED',
        processedDate: Date.now(),
        processedBy: currentUser.uid,
        processedByName: currentUser.displayName || currentUser.email || processedByName || processedBy,
        lastUpdated: serverTimestamp()
      });
      transaction.update(stdRef, { restock_requested: false, lastUpdated: serverTimestamp() });
    });
  }

  async updatePurchaseRequestStatus(
    reqId: string,
    stdId: string,
    status: Extract<PurchaseRequestStatus, 'ORDERED' | 'REJECTED'>
  ): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.auth.canAssignStandards()) {
      throw new Error('Bạn không có quyền xử lý yêu cầu mua chuẩn.');
    }
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests/${reqId}`);
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
    await runTransaction(this.fb.db, async transaction => {
      const reqDoc = await transaction.get(reqRef);
      const stdDoc = await transaction.get(stdRef);
      if (!reqDoc.exists() || !stdDoc.exists()) throw new Error('Yêu cầu mua hoặc chuẩn không tồn tại.');
      const request = reqDoc.data() as PurchaseRequest;
      if (request.standardId !== stdId) throw new Error('Yêu cầu mua không thuộc chuẩn đã chọn.');
      assertPurchaseRequestTransition(request.status, status);
      transaction.update(reqRef, {
        status,
        processedBy: currentUser.uid,
        processedByName: currentUser.displayName || currentUser.email || 'Người xử lý',
        processedDate: Date.now(),
        lastUpdated: serverTimestamp()
      });
      transaction.update(stdRef, {
        restock_requested: status === 'ORDERED',
        lastUpdated: serverTimestamp()
      });
    });
  }
}
