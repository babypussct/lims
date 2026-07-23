import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  doc, collection, getDocs, getDoc, updateDoc, setDoc, writeBatch,
  serverTimestamp, deleteField, query, orderBy, limit, startAfter,
  where, QueryDocumentSnapshot, QueryConstraint, runTransaction
} from 'firebase/firestore';
import {
  ReferenceStandard,
  StandardCleanupBatch,
  StandardCleanupBatchChange,
  StandardNameSnapshot,
  StandardNameUpdate,
  StandardsPage,
} from '../../../core/models/standard.model';
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
      std.name, std.canonical_name, std.original_name, std.chemical_name, std.internal_id,
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

  /**
   * Atomically updates only nomenclature fields for Data Cleanup. Reading the
   * current documents inside the transaction keeps every unrelated field intact
   * and lets search_key be rebuilt from fresh data.
   */
  async updateStandardNames(updates: StandardNameUpdate[]): Promise<string> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền chuẩn hóa tên chất chuẩn.');

    const uniqueUpdates = [...new Map(
      updates
        .filter(update => update.standardId && update.name.trim())
        .map(update => [update.standardId, {
          ...update,
          name: update.name.trim(),
          chemicalName: update.chemicalName.trim(),
        }])
    ).values()];

    if (uniqueUpdates.length === 0) throw new Error('Không có tên chất chuẩn hợp lệ để cập nhật.');
    if (uniqueUpdates.length > 400) {
      throw new Error('Một nhóm chỉ được cập nhật tối đa 400 lọ để bảo đảm toàn vẹn dữ liệu.');
    }

    const refs = uniqueUpdates.map(update =>
      doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${update.standardId}`)
    );
    const batchRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_cleanup_batches`));
    const currentUser = this.auth.currentUser();

    await runTransaction(this.fb.db, async transaction => {
      const snapshots = await Promise.all(refs.map(ref => transaction.get(ref)));
      const missingIds = snapshots
        .map((snapshot, index) => snapshot.exists() ? null : uniqueUpdates[index].standardId)
        .filter((id): id is string => Boolean(id));
      if (missingIds.length > 0) {
        throw new Error(`Không tìm thấy ${missingIds.length} lọ chất chuẩn; chưa có dữ liệu nào được cập nhật.`);
      }

      const changes: StandardCleanupBatchChange[] = [];
      snapshots.forEach((snapshot, index) => {
        const update = uniqueUpdates[index];
        const fresh = { id: snapshot.id, ...snapshot.data() } as ReferenceStandard;
        const canonicalName = update.canonicalName?.trim() || fresh.canonical_name || '';
        const originalName = fresh.original_name?.trim() || update.originalName?.trim() || fresh.name;
        const casNumber = update.casNumber?.trim() || fresh.cas_number || '';
        const after: StandardNameSnapshot = {
          name: update.name,
          cas_number: casNumber,
          chemical_name: update.chemicalName,
          canonical_name: canonicalName,
          original_name: originalName,
          name_source: update.nameSource || fresh.name_source || 'cleanup',
          cas_status: update.casStatus || fresh.cas_status || 'valid',
          standard_form: update.standardForm || fresh.standard_form || 'neat',
          normalization_version: update.normalizationVersion || '2026.07.1',
          normalization_batch_id: batchRef.id,
          normalized_by: currentUser?.displayName || currentUser?.uid || 'Hệ thống',
        };
        const updated = {
          ...fresh,
          ...after,
        };
        transaction.update(refs[index], sanitizeForFirebase({
          ...after,
          normalized_at: serverTimestamp(),
          search_key: this.generateSearchKey(updated),
          lastUpdated: serverTimestamp(),
        }));
        changes.push({
          standardId: fresh.id,
          internalId: fresh.internal_id,
          before: this.snapshotStandardName(fresh),
          after,
        });
      });

      const casValues = [...new Set(changes.map(change => String(change.after.cas_number || '').trim()).filter(Boolean))];
      if (JSON.stringify(changes).length > 750_000) {
        throw new Error('Ảnh chụp phiên chuẩn hóa quá lớn; hãy giảm số hồ sơ trong một lần lưu.');
      }
      transaction.set(batchRef, sanitizeForFirebase({
        id: batchRef.id,
        cas: casValues.length === 1 ? casValues[0] : 'NHIỀU CAS',
        status: 'APPLIED',
        recordCount: changes.length,
        changes,
        createdAt: serverTimestamp(),
        createdBy: currentUser?.uid || '',
        createdByName: currentUser?.displayName || 'Người dùng',
      }));
    });

    this.cache.invalidateLocalStandardsCache();
    const maintenanceResults = await Promise.allSettled([
      this.logGlobalActivity(
        'NORMALIZE_STANDARD_NAMES',
        `Chuẩn hóa tên cho ${uniqueUpdates.length} lọ chất chuẩn đối chiếu (phiên ${batchRef.id}).`
      ),
      this.fb.updateMetadata('standards'),
    ]);
    maintenanceResults.forEach(result => {
      if (result.status === 'rejected') console.warn('[StandardCrudService] Post-cleanup maintenance failed:', result.reason);
    });
    return batchRef.id;
  }

  async getRecentStandardNameCleanupBatches(limitCount = 20): Promise<StandardCleanupBatch[]> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền xem lịch sử chuẩn hóa.');
    const batchesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_cleanup_batches`);
    const snapshot = await getDocs(query(batchesRef, orderBy('createdAt', 'desc'), limit(Math.min(Math.max(limitCount, 1), 50))));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() } as StandardCleanupBatch));
  }

  async undoStandardNameCleanupBatch(batchId: string): Promise<void> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền hoàn tác chuẩn hóa tên.');
    if (!batchId?.trim()) throw new Error('Mã phiên hoàn tác không hợp lệ.');

    const batchRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_cleanup_batches/${batchId}`);
    const currentUser = this.auth.currentUser();
    await runTransaction(this.fb.db, async transaction => {
      const batchSnapshot = await transaction.get(batchRef);
      if (!batchSnapshot.exists()) throw new Error('Không tìm thấy phiên chuẩn hóa.');
      const batch = { id: batchSnapshot.id, ...batchSnapshot.data() } as StandardCleanupBatch;
      if (batch.status === 'UNDONE') throw new Error('Phiên này đã được hoàn tác trước đó.');
      if (!Array.isArray(batch.changes) || batch.changes.length === 0) throw new Error('Phiên không có dữ liệu để hoàn tác.');
      if (batch.changes.length > 400) throw new Error('Phiên vượt quá giới hạn hoàn tác an toàn.');

      const refs = batch.changes.map(change =>
        doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${change.standardId}`)
      );
      const snapshots = await Promise.all(refs.map(ref => transaction.get(ref)));
      const missingCount = snapshots.filter(snapshot => !snapshot.exists()).length;
      if (missingCount > 0) throw new Error(`${missingCount} hồ sơ không còn tồn tại; chưa hoàn tác dữ liệu nào.`);

      const conflictCount = snapshots.filter((snapshot, index) => {
        const fresh = { id: snapshot.id, ...snapshot.data() } as ReferenceStandard;
        return !this.matchesStandardNameSnapshot(fresh, batch.changes[index].after);
      }).length;
      if (conflictCount > 0) {
        throw new Error(`${conflictCount} hồ sơ đã được sửa sau phiên này; hoàn tác bị chặn để tránh ghi đè thay đổi mới.`);
      }

      snapshots.forEach((snapshot, index) => {
        const fresh = { id: snapshot.id, ...snapshot.data() } as ReferenceStandard;
        const before = batch.changes[index].before;
        const hasCasSnapshot = Object.prototype.hasOwnProperty.call(before, 'cas_number');
        const restored = {
          ...fresh,
          name: before.name,
          chemical_name: before.chemical_name,
          canonical_name: before.canonical_name,
          original_name: before.original_name,
          name_source: before.name_source,
          cas_status: before.cas_status,
          standard_form: before.standard_form,
          normalization_version: before.normalization_version,
          normalization_batch_id: before.normalization_batch_id,
          normalized_at: before.normalized_at,
          normalized_by: before.normalized_by,
        } as ReferenceStandard;
        if (hasCasSnapshot) restored.cas_number = before.cas_number;
        const restoreData: Record<string, any> = {
          name: before.name,
          chemical_name: before.chemical_name ?? deleteField(),
          canonical_name: before.canonical_name ?? deleteField(),
          original_name: before.original_name ?? deleteField(),
          name_source: before.name_source ?? deleteField(),
          cas_status: before.cas_status ?? deleteField(),
          standard_form: before.standard_form ?? deleteField(),
          normalization_version: before.normalization_version ?? deleteField(),
          normalization_batch_id: before.normalization_batch_id ?? deleteField(),
          normalized_at: before.normalized_at ?? deleteField(),
          normalized_by: before.normalized_by ?? deleteField(),
          search_key: this.generateSearchKey(restored),
          lastUpdated: serverTimestamp(),
        };
        if (hasCasSnapshot) restoreData['cas_number'] = before.cas_number ?? deleteField();
        transaction.update(refs[index], sanitizeForFirebase(restoreData));
      });

      transaction.update(batchRef, {
        status: 'UNDONE',
        undoneAt: serverTimestamp(),
        undoneBy: currentUser?.uid || '',
        undoneByName: currentUser?.displayName || 'Người dùng',
      });
    });

    this.cache.invalidateLocalStandardsCache();
    const maintenanceResults = await Promise.allSettled([
      this.logGlobalActivity('UNDO_NORMALIZE_STANDARD_NAMES', `Hoàn tác phiên chuẩn hóa tên ${batchId}.`),
      this.fb.updateMetadata('standards'),
    ]);
    maintenanceResults.forEach(result => {
      if (result.status === 'rejected') console.warn('[StandardCrudService] Post-undo maintenance failed:', result.reason);
    });
  }

  private snapshotStandardName(standard: ReferenceStandard): StandardNameSnapshot {
    return sanitizeForFirebase({
      name: standard.name,
      cas_number: standard.cas_number,
      chemical_name: standard.chemical_name,
      canonical_name: standard.canonical_name,
      original_name: standard.original_name,
      name_source: standard.name_source,
      cas_status: standard.cas_status,
      standard_form: standard.standard_form,
      normalization_version: standard.normalization_version,
      normalization_batch_id: standard.normalization_batch_id,
      normalized_at: standard.normalized_at,
      normalized_by: standard.normalized_by,
    });
  }

  private matchesStandardNameSnapshot(standard: ReferenceStandard, snapshot: StandardNameSnapshot): boolean {
    const fields: (keyof StandardNameSnapshot)[] = [
      'name', 'chemical_name', 'canonical_name', 'original_name', 'name_source',
      'cas_status', 'standard_form', 'normalization_version', 'normalization_batch_id', 'normalized_by',
    ];
    if (Object.prototype.hasOwnProperty.call(snapshot, 'cas_number')) fields.push('cas_number');
    return fields.every(field => (standard[field] ?? '') === (snapshot[field] ?? ''));
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
