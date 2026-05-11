import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  doc, collection, getDoc, setDoc, updateDoc, writeBatch,
  serverTimestamp, runTransaction, deleteField, query,
  where, QueryConstraint, Unsubscribe, onSnapshot, getDocs,
  orderBy, limit
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog, StandardRequest, StandardRequestStatus, PurchaseRequest } from '../../../core/models/standard.model';
import { NotificationService } from '../../../core/services/notification.service';
import { getStandardizedAmount } from '../../../shared/utils/utils';
import { DeltaSyncService } from '../../../core/services/delta-sync.service';
import { StandardCrudService } from './standard-crud.service';
import { StandardCacheService } from './standard-cache.service';

/**
 * StandardRequestService — Vòng đời đầy đủ của StandardRequest.
 *
 * Bao gồm: tạo, duyệt, cấp, trả, hủy, xóa cứng request.
 * Cũng bao gồm PurchaseRequest (đặt mua chuẩn khi tồn kho thấp).
 */
@Injectable({ providedIn: 'root' })
export class StandardRequestService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private crud = inject(StandardCrudService);
  private cache = inject(StandardCacheService);
  private deltaSync = inject(DeltaSyncService);
  private notificationService = inject(NotificationService);

  // ─── Listeners ────────────────────────────────────────────────────────────────
  listenToRequests(callback: (requests: StandardRequest[]) => void): Unsubscribe {
    const isApprover = this.auth.canApproveStandards();
    const currentUser = this.auth.currentUser();
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(300)];
    
    // Nếu không phải là người duyệt, chỉ tải yêu cầu của chính mình
    if (!isApprover && currentUser) {
      constraints.unshift(where('requestedBy', '==', currentUser.uid));
    }
    
    const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests`);
    const q = query(colRef, ...constraints);
    
    // Sử dụng onSnapshot thuần túy cho tất cả mọi người để tránh hoàn toàn 
    // các lỗi kẹt cache (localStorage) hoặc thiếu Composite Index trên thiết bị di động.
    return onSnapshot(q, (snap) => {
      const reqs = snap.docs.map(d => ({ id: d.id, ...d.data() } as StandardRequest));
      callback(reqs);
    }, (err) => {
      console.error('[StandardRequestService] listenToRequests error:', err);
    });
  }

  listenToPendingPurchaseRequests(callback: (reqs: PurchaseRequest[]) => void): Unsubscribe {
    const reqRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests`);
    const q = query(reqRef, where('status', '==', 'PENDING'));
    
    return onSnapshot(q, (snapshot: any) => {
      const reqs: PurchaseRequest[] = [];
      snapshot.forEach((d: any) => reqs.push({ ...d.data(), id: d.id } as PurchaseRequest));
      callback(reqs);
    });
  }

  // ─── Data Migration ────────────────────────────────────────────────────────
  async runMigrationToFixPendingRequests(): Promise<number> {
    const q = query(
      collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests`), 
      where('status', '==', 'PENDING_APPROVAL')
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(this.fb.db);
    let count = 0;
    
    snapshot.forEach(docSnap => {
      const req = docSnap.data();
      if (req['standardId']) {
        const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${req['standardId']}`);
        batch.update(stdRef, { has_pending_request: true });
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
    }
    return count;
  }

  // ─── Create / Update Request ─────────────────────────────────────────────────
  async createRequest(request: StandardRequest, isAssign = false): Promise<void> {
    const reqRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests`));
    request.id = reqRef.id;
    request.createdAt = Date.now();
    request.updatedAt = Date.now();
    
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${request.standardId}`);
    const batch = writeBatch(this.fb.db);
    batch.set(reqRef, { ...request, lastUpdated: serverTimestamp() });
    if (!isAssign) {
      batch.update(stdRef, { has_pending_request: true, lastUpdated: serverTimestamp() });
    }
    await batch.commit();

    if (isAssign) {
      await this.crud.logGlobalActivity('ASSIGN_STANDARD', `Gán chuẩn: ${request.standardName} cho ${request.requestedByName}`, request.id);
    } else {
      await this.crud.logGlobalActivity('REQUEST_STANDARD', `Yêu cầu chuẩn: ${request.standardName}`, request.id);
      const currentUser = this.auth.currentUser();
      await this.notificationService.notify({
        recipientUid: 'role:admin', senderUid: currentUser?.uid,
        senderName: currentUser?.displayName || 'Người dùng',
        type: 'BORROW_REQUEST', title: 'Yêu cầu mượn chuẩn',
        message: `${currentUser?.displayName || 'Ai đó'} vừa đăng ký mượn lô chuẩn ${request.standardName}.`,
        targetId: request.standardId, actionUrl: `/standards/${request.standardId}`
      });
    }
  }

  async updateRequestStatus(
    requestId: string,
    status: StandardRequestStatus,
    updates: Partial<StandardRequest> = {}
  ): Promise<void> {
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
    await updateDoc(reqRef, { status, ...updates, updatedAt: Date.now(), lastUpdated: serverTimestamp() });

    const reqDoc = await getDoc(reqRef);
    if (reqDoc.exists()) {
      const reqData = reqDoc.data() as StandardRequest;
      let action = 'UPDATE_STANDARD_REQUEST';
      let details = `Cập nhật yêu cầu: ${reqData.standardName} -> ${status}`;

      if (status === 'REJECTED') {
        const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${reqData.standardId}`);
        await updateDoc(stdRef, { has_pending_request: deleteField(), lastUpdated: serverTimestamp() });
        
        action = 'REJECT_STANDARD_REQUEST';
        details = `Từ chối yêu cầu: ${reqData.standardName}`;
        const currentUser = this.auth.currentUser();
        await this.notificationService.notify({
          recipientUid: reqData.requestedBy, senderUid: currentUser?.uid,
          senderName: currentUser?.displayName || 'Hệ thống',
          type: 'REQUEST_REJECTED', title: 'Yêu cầu bị từ chối',
          message: `Yêu cầu mượn lô chuẩn ${reqData.standardName} của bạn không được phê duyệt.`,
          targetId: reqData.standardId, actionUrl: `/standards/${reqData.standardId}`
        });
      } else if (status === 'PENDING_RETURN') {
        action = 'REPORT_RETURN_STANDARD';
        details = `Báo cáo trả chuẩn: ${reqData.standardName}`;
      }
      await this.crud.logGlobalActivity(action, details, requestId);
    }
  }

  // ─── Dispense Standard ────────────────────────────────────────────────────────
  async dispenseStandard(
    requestId: string, standardId: string,
    approverId: string, approverName: string, isAssign = false
  ): Promise<void> {
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
    let reqData: StandardRequest | null = null;

    await runTransaction(this.fb.db, async (transaction) => {
      const stdDoc = await transaction.get(stdRef);
      const reqDoc = await transaction.get(reqRef);
      if (!stdDoc.exists()) throw new Error('Chuẩn không tồn tại!');
      if (!reqDoc.exists()) throw new Error('Yêu cầu không tồn tại!');

      const stdData = stdDoc.data();
      if (stdData['status'] === 'IN_USE' || stdData['status'] === 'DEPLETED') {
        throw new Error('Chuẩn đang được sử dụng hoặc đã hết!');
      }

      reqData = reqDoc.data() as StandardRequest;
      transaction.update(stdRef, {
        status: 'IN_USE', current_holder: reqData.requestedByName,
        current_holder_uid: reqData.requestedBy, current_request_id: requestId,
        has_pending_request: deleteField(),
        lastUpdated: serverTimestamp()
      });
      transaction.update(reqRef, {
        status: 'IN_PROGRESS', approvedBy: approverId, approvedByName: approverName,
        approvalDate: Date.now(), updatedAt: Date.now(), lastUpdated: serverTimestamp()
      });
    });

    if (reqData && !isAssign) {
      await this.crud.logGlobalActivity('APPROVE_STANDARD_REQUEST', `Duyệt cấp chuẩn: ${(reqData as StandardRequest).standardName}`, requestId);
      const currentUser = this.auth.currentUser();
      await this.notificationService.notify({
        recipientUid: (reqData as StandardRequest).requestedBy, senderUid: currentUser?.uid,
        senderName: currentUser?.displayName || 'Quản trị viên',
        type: 'REQUEST_APPROVED', title: 'Yêu cầu được duyệt',
        message: `Yêu cầu mượn lô chuẩn ${(reqData as StandardRequest).standardName} đã được phê duyệt. Xin hãy bảo quản cẩn thận!`,
        targetId: standardId, actionUrl: `/standards/${standardId}`
      });
    }
    // Merge ngay document mới vào cache KHÔNG xóa trước — để giữ nguyên toàn bộ danh sách chuẩn
    // (Xóa cache trước rồi merge sẽ ghi lại chỉ 1 doc, làm mất toàn bộ danh sách)
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

      const hasPreviousLogs = (reqData.usageLogs || []).length > 0;
      let newAmount = stdData.current_amount || 0;
      const finalUnit = unit || stdData.unit || 'mg';
      const finalAmountUsed = amountUsed !== undefined ? amountUsed : (hasPreviousLogs ? (reqData.totalAmountUsed || 0) : 0);

      if (!hasPreviousLogs && finalAmountUsed > 0) {
        const stockUnit = stdData.unit || 'mg';
        const amountToDeduct = getStandardizedAmount(finalAmountUsed, finalUnit, stockUnit);
        if (amountToDeduct === null) throw new Error(`Không thể quy đổi từ ${finalUnit} sang ${stockUnit}`);
        newAmount -= amountToDeduct;
        if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho!`);
      }

      transaction.update(stdRef, {
        status: isDepleted ? 'DEPLETED' : 'AVAILABLE',
        current_amount: newAmount,
        current_holder: deleteField(), current_holder_uid: deleteField(),
        current_request_id: deleteField(), lastUpdated: serverTimestamp()
      });

      const currentLogs = reqData.usageLogs || [];
      const reqUpdateData: Record<string, any> = {
        status: 'COMPLETED', returnDate: Date.now(),
        receivedBy: receiverId, receivedByName: receiverName, updatedAt: Date.now()
      };
      if (disposalReason) reqUpdateData['disposalReason'] = disposalReason;

      if (!hasPreviousLogs || disposalReason) {
        const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}/logs`);
        const newLogRef = doc(logsRef);
        const logAmount = !hasPreviousLogs ? finalAmountUsed : 0;
        const logPurpose = disposalReason || reqData.disposalReason || reqData.purpose || 'Hoàn trả chuẩn';

        const log: UsageLog = {
          id: newLogRef.id, timestamp: Date.now(), date: new Date().toISOString(),
          user: reqData.requestedByName || receiverName, amount_used: logAmount, unit: finalUnit,
          purpose: logPurpose, standardId: stdData.id, standardName: stdData.name,
          lotNumber: stdData.lot_number, cas_number: stdData.cas_number,
          internalId: stdData.internal_id, manufacturer: stdData.manufacturer, requestId
        };

        reqUpdateData['usageLogs'] = [...currentLogs, log];
        transaction.set(newLogRef, log);
        const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
        transaction.set(globalLogRef, { ...log, lastUpdated: serverTimestamp() });
      }

      reqUpdateData['totalAmountUsed'] = !hasPreviousLogs ? finalAmountUsed : (reqData.totalAmountUsed || 0);
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
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${request.id}`);
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${request.standardId}`);
    let reqExisted = false;

    await runTransaction(this.fb.db, async (transaction) => {
      const reqDoc = await transaction.get(reqRef);
      const stdDoc = await transaction.get(stdRef);
      reqExisted = reqDoc.exists();

      if (stdDoc.exists()) {
        const stdData = stdDoc.data() as ReferenceStandard;
        const stockUnit = stdData.unit || 'mg';
        let newAmount = stdData.current_amount || 0;
        const updates: Record<string, any> = { lastUpdated: serverTimestamp() };

        if (request.totalAmountUsed > 0) {
          let amountToRestore = 0;
          (request.usageLogs || []).forEach(log => {
            const standardized = getStandardizedAmount(log.amount_used, log.unit || stockUnit, stockUnit);
            if (standardized !== null) amountToRestore += standardized;
          });
          if (amountToRestore > 0) {
            newAmount += amountToRestore;
            updates['current_amount'] = newAmount;
            if (stdData.status === 'DEPLETED' && newAmount > 0) updates['status'] = 'AVAILABLE';
          }
        }

        if (stdData.current_request_id === request.id) {
          updates['status'] = 'AVAILABLE';
          updates['current_holder'] = deleteField();
          updates['current_holder_uid'] = deleteField();
          updates['current_request_id'] = deleteField();
        }
        if (request.status === 'PENDING_APPROVAL') {
          updates['has_pending_request'] = deleteField();
        }
        transaction.update(stdRef, updates);

        (request.usageLogs || []).forEach(log => {
          if (log.id) {
            const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${request.standardId}/logs/${log.id}`);
            transaction.delete(logRef);
            const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
            transaction.set(globalLogRef, { _isDeleted: true, lastUpdated: serverTimestamp() }, { merge: true });
          }
        });
      }

      if (reqExisted) {
        transaction.update(reqRef, { _isDeleted: true, lastUpdated: serverTimestamp() });
      } else {
        transaction.set(reqRef, { _isDeleted: true, lastUpdated: serverTimestamp() });
      }
    });

    if (!reqExisted) this.cache.purgeFromRequestsCache(request.id!);
    await this.crud.logGlobalActivity('HARD_DELETE_REQUEST', `Xóa hoàn toàn lịch sử yêu cầu: ${request.standardName} (Người yêu cầu: ${request.requestedByName})`, request.id);
  }

  // ─── Purchase Requests ────────────────────────────────────────────────────────
  async createPurchaseRequest(req: Partial<PurchaseRequest>): Promise<string> {
    const id = doc(collection(this.fb.db, 'artifacts')).id;
    const newReq: PurchaseRequest = { ...req, id, requestDate: Date.now(), status: 'PENDING' } as PurchaseRequest;
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests/${id}`);
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${req.standardId}`);
    await runTransaction(this.fb.db, async (transaction) => {
      transaction.set(reqRef, newReq);
      transaction.update(stdRef, { restock_requested: true, lastUpdated: serverTimestamp() });
    });
    return id;
  }

  async completePurchaseRequest(reqId: string, stdId: string, processedBy: string, processedByName: string): Promise<void> {
    const batch = writeBatch(this.fb.db);
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests/${reqId}`);
    batch.update(reqRef, { status: 'COMPLETED', processedDate: Date.now(), processedBy, processedByName, lastUpdated: serverTimestamp() });
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
    batch.update(stdRef, { restock_requested: false, lastUpdated: serverTimestamp() });
    await batch.commit();
  }
}
