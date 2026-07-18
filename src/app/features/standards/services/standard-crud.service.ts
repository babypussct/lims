import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  doc, collection, getDocs, getDoc, updateDoc, setDoc, writeBatch,
  serverTimestamp, deleteField, query, orderBy, limit, startAfter,
  where, QueryDocumentSnapshot, QueryConstraint, runTransaction
} from 'firebase/firestore';
import { ReferenceStandard, StandardsPage } from '../../../core/models/standard.model';
import { ToastService } from '../../../core/services/toast.service';
import { generateSlug, sanitizeForFirebase } from '../../../shared/utils/utils';
import { StandardCacheService } from './standard-cache.service';
import { NotificationCenterService } from '../../../core/services/notification-center.service';

/**
 * StandardCrudService — Các thao tác CRUD cơ bản trên ReferenceStandard.
 * 
 * Bao gồm: thêm, sửa, xóa mềm, khôi phục, phân trang, yêu cầu CoA,
 * và ghi nhật ký hoạt động toàn cục.
 */
@Injectable({ providedIn: 'root' })
export class StandardCrudService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private cache = inject(StandardCacheService);
  private notificationCenter = inject(NotificationCenterService);

  // ─── Search Key ──────────────────────────────────────────────────────────────
  generateSearchKey(std: ReferenceStandard): string {
    const parts = [
      std.name, std.chemical_name, std.internal_id,
      std.cas_number, std.product_code, std.lot_number,
      std.manufacturer, std.id
    ];
    return parts.filter(p => p).join(' ').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  }

  // ─── Paginated Read ───────────────────────────────────────────────────────────
  async getStandardsPage(
    pageSize: number,
    lastDoc: QueryDocumentSnapshot | null,
    searchTerm: string,
    sortOption = 'received_desc'
  ): Promise<StandardsPage> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    const constraints: QueryConstraint[] = [];

    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      constraints.push(where('search_key', '>=', term));
      constraints.push(where('search_key', '<=', term + '\uf8ff'));
      constraints.push(orderBy('search_key'));
    } else {
      switch (sortOption) {
        case 'name_asc':      constraints.push(orderBy('name', 'asc')); break;
        case 'name_desc':     constraints.push(orderBy('name', 'desc')); break;
        case 'received_desc': constraints.push(orderBy('received_date', 'desc')); break;
        case 'expiry_asc':
          constraints.push(where('expiry_date', '!=', ''));
          constraints.push(orderBy('expiry_date', 'asc')); break;
        case 'expiry_desc':
          constraints.push(where('expiry_date', '!=', ''));
          constraints.push(orderBy('expiry_date', 'desc')); break;
        case 'updated_desc':  constraints.push(orderBy('lastUpdated', 'desc')); break;
        default: constraints.push(orderBy('received_date', 'desc')); break;
      }
    }

    if (lastDoc) constraints.push(startAfter(lastDoc));
    constraints.push(limit(pageSize));

    const snapshot = await getDocs(query(colRef, ...constraints));
    return {
      items: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ReferenceStandard)),
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === pageSize
    };
  }

  // ─── Write Operations ────────────────────────────────────────────────────────
  async addStandard(std: ReferenceStandard): Promise<void> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền thêm chuẩn.');
    this.validateStandardAmounts(std);
    std.search_key = this.generateSearchKey(std);
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
    await runTransaction(this.fb.db, async transaction => {
      const snapshot = await transaction.get(ref);
      if (snapshot.exists()) throw new Error('Mã chuẩn đã tồn tại; không thể ghi đè bằng thao tác thêm mới.');
      transaction.set(ref, sanitizeForFirebase({
        ...std,
        status: std.current_amount <= 0 ? 'DEPLETED' : 'AVAILABLE',
        _isDeleted: false,
        lastUpdated: serverTimestamp()
      }));
    });
    await this.logGlobalActivity('CREATE_STANDARD', `Thêm chuẩn mới: ${std.name} (Lô: ${std.lot_number})`, std.id);
    await this.fb.updateMetadata('standards');
  }

  async updateStandard(std: ReferenceStandard): Promise<void> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền cập nhật chuẩn.');
    this.validateStandardAmounts(std);
    std.search_key = this.generateSearchKey(std);
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
    await runTransaction(this.fb.db, async transaction => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) throw new Error('Chuẩn không tồn tại.');
      const fresh = { id: snapshot.id, ...snapshot.data() } as ReferenceStandard;
      const workflowActive = fresh.status === 'IN_USE' || Boolean(
        fresh.current_holder || fresh.current_holder_uid || fresh.current_request_id || fresh.has_pending_request
      );
      const {
        id: _id,
        status: _status,
        current_holder: _holder,
        current_holder_uid: _holderUid,
        current_request_id: _requestId,
        has_pending_request: _pending,
        restock_requested: _restock,
        coa_requested_by: _coaRequester,
        lastUpdated: _lastUpdated,
        _isDeleted: _deleted,
        initial_amount: requestedInitialAmount,
        current_amount: requestedCurrentAmount,
        unit: requestedUnit,
        ...metadata
      } = std;
      const currentAmount = workflowActive ? fresh.current_amount : requestedCurrentAmount;
      transaction.update(ref, sanitizeForFirebase({
        ...metadata,
        initial_amount: workflowActive ? fresh.initial_amount : requestedInitialAmount,
        current_amount: currentAmount,
        unit: workflowActive ? fresh.unit : requestedUnit,
        status: workflowActive ? fresh.status : (currentAmount <= 0 ? 'DEPLETED' : 'AVAILABLE'),
        lastUpdated: serverTimestamp()
      }));
    });
    await this.logGlobalActivity('UPDATE_STANDARD', `Cập nhật chuẩn: ${std.name} (ID: ${std.id})`, std.id);
    await this.fb.updateMetadata('standards');
  }

  async quickUpdateField(stdId: string, fields: Record<string, any>): Promise<void> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền cập nhật nhanh chuẩn.');
    const allowed = new Set([
      'certificate_ref', 'date_opened', 'location', 'storage_condition',
      'storage_status', 'contract_ref', 'expiry_date', 'received_date'
    ]);
    const invalidKey = Object.keys(fields).find(key => !allowed.has(key));
    if (invalidKey) throw new Error(`Trường không được phép cập nhật nhanh: ${invalidKey}.`);
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
    await updateDoc(ref, { ...fields, lastUpdated: serverTimestamp() });
    await this.fb.updateMetadata('standards');
  }

  async updateStandardStock(stdId: string, newAmount: number, reason: string): Promise<void> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền cập nhật tồn kho chuẩn.');
    if (!Number.isFinite(newAmount) || newAmount < 0) throw new Error('Tồn kho mới phải là số không âm.');
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
    await runTransaction(this.fb.db, async transaction => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) throw new Error('Chuẩn không tồn tại.');
      const fresh = snapshot.data() as ReferenceStandard;
      if (fresh.current_request_id || fresh.current_holder_uid || fresh.status === 'IN_USE') {
        throw new Error('Không thể chỉnh tồn kho thủ công khi chuẩn đang được mượn.');
      }
      transaction.update(ref, {
        current_amount: newAmount,
        status: newAmount <= 0 ? 'DEPLETED' : 'AVAILABLE',
        lastUpdated: serverTimestamp()
      });
    });
    await this.logGlobalActivity('UPDATE_STOCK', `Cập nhật tồn kho: ${newAmount} (${reason})`, stdId);
    await this.fb.updateMetadata('standards');
  }

  async deleteStandard(id: string, name = ''): Promise<void> {
    await this.deleteSelectedStandards([id]);
  }

  async deleteSelectedStandards(ids: string[]): Promise<void> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền ẩn chuẩn.');
    const uniqueIds = [...new Set(ids.filter(Boolean))];
    if (uniqueIds.length === 0) return;
    if (uniqueIds.length > 200) throw new Error('Chỉ có thể ẩn tối đa 200 chuẩn trong một lần.');
    const refs = uniqueIds.map(id => doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`));

    await runTransaction(this.fb.db, async transaction => {
      const snapshots = await Promise.all(refs.map(ref => transaction.get(ref)));
      const active = snapshots
        .filter(snapshot => snapshot.exists())
        .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard))
        .filter(standard => standard.status === 'IN_USE' || Boolean(
          standard.current_holder || standard.current_holder_uid ||
          standard.current_request_id || standard.has_pending_request
        ));
      if (active.length) {
        throw new Error(`Không thể ẩn ${active.length} lô đang mượn/trả hoặc chờ duyệt: ${active.map(item => item.internal_id || item.id).join(', ')}`);
      }
      snapshots.forEach((snapshot, index) => {
        if (snapshot.exists()) {
          transaction.update(refs[index], { _isDeleted: true, status: 'DELETED', lastUpdated: serverTimestamp() });
        }
      });
    });
    await this.logGlobalActivity('SOFT_DELETE_BATCH', `Đã xóa lô ${ids.length} chuẩn đối chiếu.`);
    await this.fb.updateMetadata('standards');
    this.cache.invalidateLocalStandardsCache();
  }

  async restoreStandard(id: string, name = ''): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
    await updateDoc(ref, { _isDeleted: deleteField(), status: 'AVAILABLE', lastUpdated: serverTimestamp() });
    await this.logGlobalActivity('RESTORE_STANDARD', `Khôi phục chuẩn đối chiếu: ${name || id}`, id);
  }

  // ─── CoA Request ─────────────────────────────────────────────────────────────
  async requestCoa(std: ReferenceStandard): Promise<void> {
    const user = this.auth.currentUser();
    if (!user || !this.auth.hasPermission('standard_request')) {
      throw new Error('Bạn không có quyền yêu cầu cập nhật CoA.');
    }
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
    await runTransaction(this.fb.db, async transaction => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) throw new Error('Chuẩn không tồn tại.');
      if (snap.data()['certificate_ref']) throw new Error('Chuẩn đã có CoA.');
      if (snap.data()['coa_requested_by']) throw new Error('Yêu cầu CoA cho chuẩn này đã được gửi trước đó.');
      transaction.update(ref, { coa_requested_by: user.uid, lastUpdated: serverTimestamp() });
    });
    await this.logGlobalActivity('REQUEST_COA', `Yêu cầu bổ sung CoA cho chuẩn: ${std.name} (Lô: ${std.lot_number || 'N/A'})`, std.id);
    await this.notificationCenter.publish({
      recipientUid: 'role:admin',
      senderUid: user?.uid,
      senderName: user?.displayName || 'Người dùng',
      type: 'COA_REQUEST',
      title: 'Yêu cầu bổ sung CoA',
      message: `${user?.displayName || 'Ai đó'} vừa yêu cầu cập nhật file CoA cho lô chuẩn ${std.name} (Lô: ${std.lot_number || 'N/A'}).`,
      targetId: std.id,
      actionUrl: `/standards/${std.id}`,
      channels: ['inbox', 'push']
    });
  }

  async completeCoaUpload(standards: ReferenceStandard[], certificateUrl: string): Promise<void> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền cập nhật CoA.');
    if (!certificateUrl) throw new Error('URL CoA không hợp lệ.');
    const unique = [...new Map(standards.filter(item => item?.id).map(item => [item.id, item])).values()];
    if (unique.length === 0) throw new Error('Không tìm thấy chuẩn để cập nhật CoA.');
    if (unique.length > 400) throw new Error('Chỉ có thể cập nhật tối đa 400 lô trong một lần.');

    const snapshots = await Promise.all(unique.map(standard => getDoc(
      doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standard.id}`)
    )));
    const freshStandards = snapshots
      .filter(snapshot => snapshot.exists())
      .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard));
    if (freshStandards.length === 0) throw new Error('Các chuẩn cần cập nhật không còn tồn tại.');

    const batch = writeBatch(this.fb.db);
    freshStandards.forEach(standard => {
      batch.update(
        doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standard.id}`),
        {
          certificate_ref: certificateUrl,
          coa_requested_by: deleteField(),
          lastUpdated: serverTimestamp()
        }
      );
    });
    await batch.commit();
    await this.fb.updateMetadata('standards');
    this.cache.invalidateLocalStandardsCache();

    const admin = this.auth.currentUser();
    const recipients = [...new Set(freshStandards.map(item => item.coa_requested_by).filter(Boolean))] as string[];
    await Promise.all(recipients.map(recipientUid => this.notificationCenter.publish({
      recipientUid,
      senderUid: admin?.uid,
      senderName: admin?.displayName || 'Quản trị viên',
      type: 'SYSTEM_INFO',
      title: 'Đã cập nhật CoA',
      message: `File CoA của chuẩn "${freshStandards[0].name}" đã được tải lên thành công.`,
      targetId: freshStandards[0].id,
      actionUrl: `/standards/${freshStandards[0].id}`,
      channels: ['inbox', 'push']
    })));
    await this.logGlobalActivity(
      'UPLOAD_STANDARD_COA',
      `Cập nhật CoA cho ${freshStandards.length} lô chuẩn: ${freshStandards[0].name}`,
      freshStandards[0].id
    );
  }

  private validateStandardAmounts(std: ReferenceStandard): void {
    if (!std.id?.trim() || !std.name?.trim()) throw new Error('Mã và tên chuẩn là bắt buộc.');
    if (!std.unit?.trim()) throw new Error('Đơn vị chuẩn là bắt buộc.');
    if (!Number.isFinite(std.initial_amount) || std.initial_amount < 0) {
      throw new Error('Lượng ban đầu phải là số không âm.');
    }
    if (!Number.isFinite(std.current_amount) || std.current_amount < 0) {
      throw new Error('Lượng hiện tại phải là số không âm.');
    }
  }

  // ─── Global Activity Logging ──────────────────────────────────────────────────
  async logGlobalActivity(action: string, details: string, targetId?: string): Promise<void> {
    const logRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`));
    await setDoc(logRef, {
      id: logRef.id, action, details,
      timestamp: serverTimestamp(), lastUpdated: serverTimestamp(),
      user: this.auth.currentUser()?.displayName || 'Hệ thống',
      targetId: targetId ?? null
    });
  }
}
