import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  doc, collection, getDocs, getDoc, updateDoc, setDoc, writeBatch,
  serverTimestamp, deleteField, query, orderBy, limit, startAfter,
  where, QueryDocumentSnapshot, QueryConstraint
} from 'firebase/firestore';
import { ReferenceStandard, StandardsPage } from '../../../core/models/standard.model';
import { ToastService } from '../../../core/services/toast.service';
import { generateSlug } from '../../../shared/utils/utils';
import { StandardCacheService } from './standard-cache.service';

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
    std.search_key = this.generateSearchKey(std);
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
    await setDoc(ref, { ...std, lastUpdated: serverTimestamp() });
    await this.logGlobalActivity('CREATE_STANDARD', `Thêm chuẩn mới: ${std.name} (Lô: ${std.lot_number})`, std.id);
    await this.fb.updateMetadata('standards');
  }

  async updateStandard(std: ReferenceStandard): Promise<void> {
    std.search_key = this.generateSearchKey(std);
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
    await updateDoc(ref, { ...std, lastUpdated: serverTimestamp() });
    await this.logGlobalActivity('UPDATE_STANDARD', `Cập nhật chuẩn: ${std.name} (ID: ${std.id})`, std.id);
    await this.fb.updateMetadata('standards');
  }

  async quickUpdateField(stdId: string, fields: Record<string, any>): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
    await updateDoc(ref, { ...fields, lastUpdated: serverTimestamp() });
    await this.fb.updateMetadata('standards');
  }

  async updateStandardStock(stdId: string, newAmount: number, reason: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
    const updateData: Record<string, any> = { current_amount: newAmount, lastUpdated: serverTimestamp() };
    if (newAmount <= 0) updateData['status'] = 'DEPLETED';
    await updateDoc(ref, updateData);
    await this.logGlobalActivity('UPDATE_STOCK', `Cập nhật tồn kho: ${newAmount} (${reason})`, stdId);
    await this.fb.updateMetadata('standards');
  }

  async deleteStandard(id: string, name = ''): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
    await updateDoc(ref, { _isDeleted: true, status: 'DELETED', lastUpdated: serverTimestamp() });
    await this.logGlobalActivity('SOFT_DELETE_STANDARD', `Đưa chuẩn vào thùng rác: ${name || id}`, id);
    await this.fb.updateMetadata('standards');
  }

  async deleteSelectedStandards(ids: string[]): Promise<void> {
    const BATCH_SIZE = 400;
    let batch = writeBatch(this.fb.db);
    let opCount = 0;
    for (const id of ids) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
      batch.update(stdRef, { _isDeleted: true, status: 'DELETED', lastUpdated: serverTimestamp() });
      opCount++;
      if (opCount >= BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
    }
    if (opCount > 0) await batch.commit();
    await this.logGlobalActivity('SOFT_DELETE_BATCH', `Đã xóa lô ${ids.length} chuẩn đối chiếu.`);
    await this.fb.updateMetadata('standards');
  }

  async restoreStandard(id: string, name = ''): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
    await updateDoc(ref, { _isDeleted: deleteField(), status: 'ACTIVE', lastUpdated: serverTimestamp() });
    await this.logGlobalActivity('RESTORE_STANDARD', `Khôi phục chuẩn đối chiếu: ${name || id}`, id);
  }

  // ─── CoA Request ─────────────────────────────────────────────────────────────
  async requestCoa(std: ReferenceStandard, notificationService: any): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data()['coa_requested_by']) {
      throw new Error('Yêu cầu CoA cho chuẩn này đã được gửi trước đó.');
    }
    const user = this.auth.currentUser();
    await this.quickUpdateField(std.id, { coa_requested_by: user?.uid });
    await this.logGlobalActivity('REQUEST_COA', `Yêu cầu bổ sung CoA cho chuẩn: ${std.name} (Lô: ${std.lot_number || 'N/A'})`, std.id);
    await notificationService.notify({
      recipientUid: 'role:admin',
      senderUid: user?.uid,
      senderName: user?.displayName || 'Người dùng',
      type: 'COA_REQUEST',
      title: 'Yêu cầu bổ sung CoA',
      message: `${user?.displayName || 'Ai đó'} vừa yêu cầu cập nhật file CoA cho lô chuẩn ${std.name} (Lô: ${std.lot_number || 'N/A'}).`,
      targetId: std.id,
      actionUrl: `/standards/${std.id}`
    });
  }

  // ─── Global Activity Logging ──────────────────────────────────────────────────
  async logGlobalActivity(action: string, details: string, targetId?: string): Promise<void> {
    const logRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`));
    await setDoc(logRef, {
      id: logRef.id, action, details,
      timestamp: serverTimestamp(), lastUpdated: serverTimestamp(),
      user: this.auth.currentUser()?.displayName || 'Hệ thống',
      targetId
    });
  }
}
