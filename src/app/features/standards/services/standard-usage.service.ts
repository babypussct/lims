import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  doc, collection, getDocs, getDoc, setDoc, updateDoc,
  serverTimestamp, runTransaction, query, orderBy, limit,
  startAfter, where, QueryDocumentSnapshot, QueryConstraint,
  Unsubscribe
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog, StandardRequest } from '../../../core/models/standard.model';
import { NotificationCenterService } from '../../../core/services/notification-center.service';
import { getStandardizedAmount, formatNum } from '../../../shared/utils/utils';
import { normalizePositiveStandardAmount } from '../../../shared/utils/standard-amount';
import { DeltaSyncService } from '../../../core/services/delta-sync.service';
import { StandardCrudService } from './standard-crud.service';
import { StandardCacheService } from './standard-cache.service';

/**
 * StandardUsageService — Quản lý toàn bộ vòng đời nhật ký sử dụng chuẩn.
 *
 * Bao gồm: ghi nhận sử dụng trực tiếp, ghi nhận theo yêu cầu,
 * xóa log, truy vấn lịch sử, cảnh báo tồn kho thấp.
 */
@Injectable({ providedIn: 'root' })
export class StandardUsageService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private crud = inject(StandardCrudService);
  private cache = inject(StandardCacheService);
  private deltaSync = inject(DeltaSyncService);
  private notificationCenter = inject(NotificationCenterService);

  // ─── Listen to Global Usage Logs ─────────────────────────────────────────────
  listenToGlobalUsageLogs(callback: (logs: UsageLog[]) => void): Unsubscribe {
    return this.deltaSync.startListener<UsageLog>({
      cacheKey: 'lims_usage_cache_' + this.fb.APP_ID,
      cursorKey: 'lims_usage_sync_seconds_' + this.fb.APP_ID,
      collectionPath: `artifacts/${this.fb.APP_ID}/standard_usages`,
      maxCacheSize: 1000,
      orderByField: 'timestamp',
      orderDirection: 'desc'
    }, logs => callback(logs.filter(log => !log._isDeleted)));
  }

  // ─── Paginated Queries ────────────────────────────────────────────────────────
  async getUsageHistory(stdId: string): Promise<UsageLog[]> {
    const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
    const snapshot = await getDocs(query(logsRef, orderBy('timestamp', 'desc')));
    return snapshot.docs
      .map(d => ({ id: d.id, ...d.data() } as UsageLog))
      .filter(log => !log._isDeleted);
  }

  async queryUsageLogsByDateRange(
    fromTimestamp: number,
    toTimestamp: number,
    pageSize = 500,
    lastDoc: QueryDocumentSnapshot | null = null
  ): Promise<{ items: UsageLog[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> {
    const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages`);
    const constraints: QueryConstraint[] = [
      where('timestamp', '>=', fromTimestamp),
      where('timestamp', '<=', toTimestamp),
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    ];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const snapshot = await getDocs(query(colRef, ...constraints));
    return {
      items: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsageLog)).filter(log => !log._isDeleted),
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === pageSize
    };
  }

  async queryUsageLogsPage(
    pageSize = 50,
    lastDoc: QueryDocumentSnapshot | null = null
  ): Promise<{ items: UsageLog[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> {
    const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages`);
    const constraints: QueryConstraint[] = [orderBy('timestamp', 'desc'), limit(pageSize)];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const snapshot = await getDocs(query(colRef, ...constraints));
    return {
      items: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsageLog)).filter(log => !log._isDeleted),
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === pageSize
    };
  }

  // ─── Record Usage (Direct — không qua request) ───────────────────────────────
  async recordUsage(stdId: string, log: UsageLog): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.auth.canEditStandards()) {
      throw new Error('Bạn không có quyền ghi nhận sử dụng trực tiếp.');
    }
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
    const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
    const newLogRef = doc(logsRef);

    await runTransaction(this.fb.db, async (transaction) => {
      const stdDoc = await transaction.get(stdRef);
      if (!stdDoc.exists()) throw new Error('Standard does not exist!');
      const stdData = stdDoc.data() as ReferenceStandard;

      if (stdData.status === 'IN_USE') {
        throw new Error(
          `Chuẩn "${stdData.name}" đang được ${stdData.current_holder || 'nhân viên khác'} mượn theo yêu cầu. ` +
          `Vui lòng ghi nhận sử dụng qua màn hình Quản lý yêu cầu.`
        );
      }

      const currentAmount = stdData.current_amount || 0;
      const stockUnit = stdData.unit || 'mg';
      const usageUnit = log.unit || stockUnit;
      const amountToDeduct = normalizePositiveStandardAmount(log.amount_used, usageUnit, stockUnit, 'Lượng sử dụng');

      const newAmount = currentAmount - amountToDeduct;
      if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho!`);

      const updateData: Record<string, any> = { current_amount: newAmount, lastUpdated: serverTimestamp() };
      if (newAmount <= 0) updateData['status'] = 'DEPLETED';

      log.id = newLogRef.id;
      if (!log.timestamp) log.timestamp = Date.now();
      if (!log.date) log.date = new Date().toISOString();
      log.standardId = stdData.id;
      log.standardName = stdData.name;
      log.lotNumber = stdData.lot_number;
      log.cas_number = stdData.cas_number;
      log.internalId = stdData.internal_id;
      log.manufacturer = stdData.manufacturer;
      log.user = currentUser.displayName || currentUser.email || log.user || 'Người dùng';
      log.normalized_amount = amountToDeduct;
      log.normalized_unit = stockUnit;

      const newLogDate = log.date.split('T')[0];
      const existingDateOpened = stdData.date_opened || '';
      if (!existingDateOpened || newLogDate < existingDateOpened) {
        updateData['date_opened'] = newLogDate;
      }

      transaction.update(stdRef, updateData);
      transaction.set(newLogRef, log);
      const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
      transaction.set(globalLogRef, { ...log, lastUpdated: serverTimestamp() });
    });
  }

  // ─── Log Usage For Request ────────────────────────────────────────────────────
  async logUsageForRequest(
    requestId: string, standardId: string, amount: number,
    unit: string, purpose: string, userId: string, userName: string
  ): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser) throw new Error('Phiên đăng nhập không còn hợp lệ.');
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
    const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
    const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}/logs`);
    const newLogRef = doc(logsRef);

    await runTransaction(this.fb.db, async (transaction) => {
      const stdDoc = await transaction.get(stdRef);
      const reqDoc = await transaction.get(reqRef);
      if (!stdDoc.exists()) throw new Error('Chuẩn không tồn tại!');
      if (!reqDoc.exists()) throw new Error('Yêu cầu không tồn tại!');

      const stdData = stdDoc.data() as ReferenceStandard;
      const reqData = reqDoc.data() as StandardRequest;

      if (reqData.status !== 'IN_PROGRESS') {
        throw new Error(`Không thể ghi nhận: yêu cầu đang ở trạng thái "${reqData.status}". Chỉ được ghi khi đang sử dụng.`);
      }
      if (reqData.requestedBy !== currentUser.uid) {
        throw new Error('Bạn không có quyền ghi nhận sử dụng cho yêu cầu của người khác.');
      }
      if (
        reqData.standardId !== standardId ||
        stdData.current_request_id !== requestId ||
        stdData.current_holder_uid !== currentUser.uid
      ) {
        throw new Error('Chuẩn không còn được cấp cho tài khoản hiện tại theo yêu cầu này.');
      }

      const stockUnit = stdData.unit || 'mg';
      const amountToDeduct = normalizePositiveStandardAmount(amount, unit, stockUnit, 'Lượng sử dụng');

      const newAmount = (stdData.current_amount || 0) - amountToDeduct;
      if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho!`);

      const log: UsageLog = {
        id: newLogRef.id, timestamp: Date.now(), date: new Date().toISOString(),
        user: currentUser.displayName || currentUser.email || userName || userId,
        amount_used: amount,
        unit,
        normalized_amount: amountToDeduct,
        normalized_unit: stockUnit,
        purpose: purpose || 'Báo cáo sử dụng',
        standardId: stdData.id, standardName: stdData.name, lotNumber: stdData.lot_number,
        cas_number: stdData.cas_number, internalId: stdData.internal_id,
        manufacturer: stdData.manufacturer, requestId
      };

      transaction.set(newLogRef, log);
      const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
      transaction.set(globalLogRef, { ...log, lastUpdated: serverTimestamp() });

      const logDateStr = new Date().toISOString().split('T')[0];
      const stdUpdates: Record<string, any> = {
        current_amount: newAmount,
        status: newAmount <= 0 ? 'DEPLETED' : stdData.status,
        lastUpdated: serverTimestamp()
      };
      if (!stdData.date_opened || logDateStr < stdData.date_opened) stdUpdates['date_opened'] = logDateStr;
      transaction.update(stdRef, stdUpdates);

      const currentLogs = reqData.usageLogs || [];
      transaction.update(reqRef, {
        totalAmountUsed: (reqData.totalAmountUsed || 0) + amountToDeduct,
        usageLogs: [...currentLogs, log],
        updatedAt: Date.now(), lastUpdated: serverTimestamp()
      });
    });

    await this.crud.logGlobalActivity('LOG_USAGE_STANDARD', `Khai báo sử dụng ${amount}${unit} chuẩn: ${standardId}`, requestId);

    // Cảnh báo tồn kho thấp (< 20%)
    const afterSnap = await getDoc(stdRef);
    if (afterSnap.exists()) {
      const s = afterSnap.data() as ReferenceStandard;
      const initial = s.initial_amount || 0;
      const current = s.current_amount || 0;
      if (current > 0 && current <= initial * 0.2) {
        await this.notificationCenter.publish({
          recipientUid: 'role:admin', senderUid: 'system', senderName: 'Hệ thống LIMS',
          type: 'STOCK_LOW_ALERT', title: 'Cảnh báo tồn kho thấp',
          message: `Lô chuẩn ${s.name} chỉ còn ${formatNum(current)} ${s.unit} (dưới 20%). Vui lòng cân nhắc đặt mua thêm.`,
          targetId: standardId, actionUrl: `/standards/${standardId}`,
          channels: ['inbox', 'push']
        });
      }
    }
  }

  // ─── Delete Usage Log ────────────────────────────────────────────────────────
  async deleteUsageLog(stdId: string, logId: string, requestId?: string): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.auth.canDeleteStandardLogs()) {
      throw new Error('Bạn không có quyền rollback nhật ký sử dụng chuẩn.');
    }
    const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
    const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs/${logId}`);
    const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${logId}`);

    let didRollback = false;
    await runTransaction(this.fb.db, async (transaction) => {
      const stdDoc = await transaction.get(stdRef);
      const logDoc = await transaction.get(logRef);
      const globalLogDoc = await transaction.get(globalLogRef);

      if (!logDoc.exists() && !globalLogDoc.exists()) {
        throw new Error('Không tìm thấy dữ liệu nhật ký trên hệ thống.');
      }

      const logData = (logDoc.exists() ? logDoc.data() : globalLogDoc.data()) as UsageLog;
      if (logData._isDeleted || logData.rolledBackAt) return;

      const stdData = stdDoc.exists() ? stdDoc.data() as ReferenceStandard : null;
      const effectiveRequestId = requestId || logData.requestId || stdData?.current_request_id;
      const reqRef = effectiveRequestId
        ? doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${effectiveRequestId}`)
        : null;
      // Firestore transactions require every read to happen before the first write.
      const reqDoc = reqRef ? await transaction.get(reqRef) : null;

      if (stdData) {
        const stockUnit = stdData.unit || 'mg';
        const amountUsed = logData.amount_used || 0;
        const unitUsed = logData.unit || stockUnit;
        const currentStock = stdData.current_amount || 0;

        const amountToRestore = logData.normalized_unit === stockUnit && Number.isFinite(logData.normalized_amount)
          ? Number(logData.normalized_amount)
          : getStandardizedAmount(amountUsed, unitUsed, stockUnit);
        if (amountToRestore !== null && Number.isFinite(amountToRestore) && amountToRestore >= 0) {
          const newStock = currentStock + amountToRestore;
          const updateData: Record<string, any> = { current_amount: newStock, lastUpdated: serverTimestamp() };
          if (stdData.status === 'DEPLETED' && newStock > 0) {
            updateData['status'] = stdData.current_request_id ? 'IN_USE' : 'AVAILABLE';
          }
          transaction.update(stdRef, updateData);
          if (reqRef && reqDoc?.exists()) {
            const reqData = reqDoc.data() as StandardRequest;
            transaction.update(reqRef, {
              usageLogs: (reqData.usageLogs || []).filter(item => item.id !== logId),
              totalAmountUsed: Math.max(0, (reqData.totalAmountUsed || 0) - amountToRestore),
              updatedAt: Date.now(),
              lastUpdated: serverTimestamp()
            });
          }
        }
      }

      const rollbackFields = {
        _isDeleted: true,
        rolledBackAt: Date.now(),
        rolledBackBy: currentUser.uid,
        lastUpdated: serverTimestamp()
      };
      if (logDoc.exists()) transaction.update(logRef, rollbackFields);
      if (globalLogDoc.exists()) {
        transaction.update(globalLogRef, rollbackFields);
      } else {
        transaction.set(globalLogRef, { ...logData, ...rollbackFields });
      }
      didRollback = true;
    });

    if (didRollback) {
      await this.crud.logGlobalActivity('DELETE_USAGE_LOG', `Rollback nhật ký và hoàn trả tồn kho chuẩn: ${stdId}`, logId);
    }
  }

  async queryUsageLogsBeforeTimestamp(
    beforeTimestamp: number,
    pageSize = 100
  ): Promise<{ items: UsageLog[]; hasMore: boolean }> {
    const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages`);
    const snapshot = await getDocs(query(
      colRef,
      orderBy('timestamp', 'desc'),
      startAfter(beforeTimestamp),
      limit(pageSize)
    ));
    return {
      items: snapshot.docs
        .map(d => ({ id: d.id, ...d.data() } as UsageLog))
        .filter(log => !log._isDeleted),
      hasMore: snapshot.docs.length === pageSize
    };
  }

  // ─── Admin Utilities ─────────────────────────────────────────────────────────
  async fixHistoricalUsageLogsUsers(): Promise<void> {
    const q = query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests'));
    const snapshot = await getDocs(q);
    let count = 0;
    for (const d of snapshot.docs) {
      const reqData = d.data() as StandardRequest;
      if (!reqData.usageLogs || reqData.usageLogs.length === 0) continue;
      let changed = false;
      const updatedLogs = reqData.usageLogs.map(log => {
        if (log.user !== reqData.requestedByName && reqData.requestedByName) {
          log.user = reqData.requestedByName;
          changed = true;
          if (log.id && reqData.standardId) {
            const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${reqData.standardId}/logs/${log.id}`);
            updateDoc(logRef, { user: reqData.requestedByName }).catch(() => {});
            const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
            updateDoc(globalLogRef, { user: reqData.requestedByName, lastUpdated: serverTimestamp() }).catch(() => {});
          }
        }
        return log;
      });
      if (changed) {
        const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${d.id}`);
        await updateDoc(reqRef, { usageLogs: updatedLogs, lastUpdated: serverTimestamp() });
        count++;
      }
    }
    console.log(`[StandardUsageService] Cập nhật tên cho ${count} yêu cầu.`);
  }

}
