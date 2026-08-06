import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { doc, collection, getDocs, getDoc, updateDoc, setDoc, writeBatch, serverTimestamp, deleteField, query, orderBy, limit, startAfter, where, runTransaction, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ToastService } from '../../../core/services/toast.service';
import { sanitizeForFirebase } from '../../../shared/utils/utils';
import { StandardCacheService } from './standard-cache.service';
import { NotificationCenterService } from '../../../core/services/notification-center.service';
import { StandardTagCatalogService } from './standard-tag-catalog.service';
import { applyTagMode, assertTagLimit, MAX_BULK_WRITES, MAX_STANDARD_TAGS, mergeUniqueTagKeys, normalizeTagKeysStrict, sanitizeLegacyTagKeys, } from './standard-tag.utils';
import * as i0 from "@angular/core";
/**
 * StandardCrudService — Các thao tác CRUD cơ bản trên ReferenceStandard.
 *
 * Bao gồm: thêm, sửa, xóa mềm, khôi phục, phân trang, yêu cầu CoA,
 * và ghi nhật ký hoạt động toàn cục.
 */
export class StandardCrudService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.auth = inject(AuthService);
        this.toast = inject(ToastService);
        this.cache = inject(StandardCacheService);
        this.notificationCenter = inject(NotificationCenterService);
        this.tagCatalog = inject(StandardTagCatalogService);
    }
    // ─── Search Key ──────────────────────────────────────────────────────────────
    generateSearchKey(std) {
        const parts = [
            std.name, std.canonical_name, std.original_name, std.chemical_name, std.internal_id,
            std.cas_number, std.product_code, std.lot_number,
            std.manufacturer, std.id
        ];
        return parts.filter(p => p).join(' ').toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
    }
    // ─── Paginated Read ───────────────────────────────────────────────────────────
    async getStandardsPage(pageSize, lastDoc, searchTerm, sortOption = 'received_desc') {
        const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
        const constraints = [];
        if (searchTerm) {
            const term = searchTerm.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            constraints.push(where('search_key', '>=', term));
            constraints.push(where('search_key', '<=', term + '\uf8ff'));
            constraints.push(orderBy('search_key'));
        }
        else {
            switch (sortOption) {
                case 'name_asc':
                    constraints.push(orderBy('name', 'asc'));
                    break;
                case 'name_desc':
                    constraints.push(orderBy('name', 'desc'));
                    break;
                case 'received_desc':
                    constraints.push(orderBy('received_date', 'desc'));
                    break;
                case 'expiry_asc':
                    constraints.push(where('expiry_date', '!=', ''));
                    constraints.push(orderBy('expiry_date', 'asc'));
                    break;
                case 'expiry_desc':
                    constraints.push(where('expiry_date', '!=', ''));
                    constraints.push(orderBy('expiry_date', 'desc'));
                    break;
                case 'updated_desc':
                    constraints.push(orderBy('lastUpdated', 'desc'));
                    break;
                default:
                    constraints.push(orderBy('received_date', 'desc'));
                    break;
            }
        }
        if (lastDoc)
            constraints.push(startAfter(lastDoc));
        constraints.push(limit(pageSize));
        const snapshot = await getDocs(query(colRef, ...constraints));
        return {
            items: snapshot.docs.map(d => ({ id: d.id, ...d.data() })),
            lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
            hasMore: snapshot.docs.length === pageSize
        };
    }
    // ─── Write Operations ────────────────────────────────────────────────────────
    async addStandard(std) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền thêm chuẩn.');
        this.validateStandardAmounts(std);
        if (std.sop_tags !== undefined) {
            std.sop_tags = normalizeTagKeysStrict(std.sop_tags, 'Nhãn chất chuẩn');
            assertTagLimit(std.sop_tags, MAX_STANDARD_TAGS, 'Nhãn chất chuẩn');
            await this.tagCatalog.refresh();
            std.sop_tags = this.tagCatalog.assertSelectableKeys(std.sop_tags, 'Nhãn chất chuẩn');
        }
        std.search_key = this.generateSearchKey(std);
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
        const { derivedDeviceCodes: _derivedDeviceCodes, derivedMethodLabels: _derivedMethodLabels, ...persistedStandard } = std;
        await runTransaction(this.fb.db, async (transaction) => {
            const snapshot = await transaction.get(ref);
            if (snapshot.exists())
                throw new Error('Mã chuẩn đã tồn tại; không thể ghi đè bằng thao tác thêm mới.');
            transaction.set(ref, sanitizeForFirebase({
                ...persistedStandard,
                status: std.current_amount <= 0 ? 'DEPLETED' : 'AVAILABLE',
                _isDeleted: false,
                lastUpdated: serverTimestamp()
            }));
        });
        await this.logGlobalActivity('CREATE_STANDARD', `Thêm chuẩn mới: ${std.name} (Lô: ${std.lot_number})`, std.id);
        await this.fb.updateMetadata('standards');
    }
    async updateStandard(std, tagDelta) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền cập nhật chuẩn.');
        this.validateStandardAmounts(std);
        if (std.sop_tags !== undefined) {
            std.sop_tags = normalizeTagKeysStrict(std.sop_tags, 'Nhãn chất chuẩn');
            assertTagLimit(std.sop_tags, MAX_STANDARD_TAGS, 'Nhãn chất chuẩn');
            await this.tagCatalog.refresh();
        }
        std.search_key = this.generateSearchKey(std);
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
        await runTransaction(this.fb.db, async (transaction) => {
            const snapshot = await transaction.get(ref);
            if (!snapshot.exists())
                throw new Error('Chuẩn không tồn tại.');
            const fresh = { id: snapshot.id, ...snapshot.data() };
            let tagsToPersist;
            if (std.sop_tags !== undefined) {
                const requestedTags = this.tagCatalog.assertKnownOrExistingKeys(std.sop_tags, fresh.sop_tags || [], 'Nhãn chất chuẩn');
                if (tagDelta) {
                    // Recompute the user's add/remove intent against the transaction's
                    // fresh snapshot so a concurrent return or bulk ADD is preserved.
                    const originalTags = sanitizeLegacyTagKeys(tagDelta.originalTags);
                    const added = requestedTags.filter(key => !originalTags.includes(key));
                    const removed = new Set(originalTags.filter(key => !requestedTags.includes(key)));
                    const freshTags = sanitizeLegacyTagKeys(fresh.sop_tags);
                    tagsToPersist = mergeUniqueTagKeys(freshTags.filter(key => !removed.has(key)), added);
                    assertTagLimit(tagsToPersist, MAX_STANDARD_TAGS, 'Nhãn chất chuẩn');
                }
                else {
                    tagsToPersist = requestedTags;
                }
            }
            const workflowActive = fresh.status === 'IN_USE' || Boolean(fresh.current_holder || fresh.current_holder_uid || fresh.current_request_id || fresh.has_pending_request);
            const { id: _id, status: _status, current_holder: _holder, current_holder_uid: _holderUid, current_request_id: _requestId, has_pending_request: _pending, restock_requested: _restock, coa_requested_by: _coaRequester, lastUpdated: _lastUpdated, _isDeleted: _deleted, derivedDeviceCodes: _derivedDeviceCodes, derivedMethodLabels: _derivedMethodLabels, sop_tags: _sopTags, initial_amount: requestedInitialAmount, current_amount: requestedCurrentAmount, unit: requestedUnit, ...metadata } = std;
            const currentAmount = workflowActive ? fresh.current_amount : requestedCurrentAmount;
            const persistedMetadata = {
                ...metadata,
                initial_amount: workflowActive ? fresh.initial_amount : requestedInitialAmount,
                current_amount: currentAmount,
                unit: workflowActive ? fresh.unit : requestedUnit,
                status: workflowActive ? fresh.status : (currentAmount <= 0 ? 'DEPLETED' : 'AVAILABLE'),
                lastUpdated: serverTimestamp()
            };
            if (tagsToPersist !== undefined)
                persistedMetadata['sop_tags'] = tagsToPersist;
            transaction.update(ref, sanitizeForFirebase(persistedMetadata));
        });
        await this.logGlobalActivity('UPDATE_STANDARD', `Cập nhật chuẩn: ${std.name} (ID: ${std.id})`, std.id);
        await this.fb.updateMetadata('standards');
    }
    /**
     * Atomically updates only nomenclature fields for Data Cleanup. Reading the
     * current documents inside the transaction keeps every unrelated field intact
     * and lets search_key be rebuilt from fresh data.
     */
    async updateStandardNames(updates) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền chuẩn hóa tên chất chuẩn.');
        const uniqueUpdates = [...new Map(updates
                .filter(update => update.standardId && update.name.trim())
                .map(update => [update.standardId, {
                    ...update,
                    name: update.name.trim(),
                    chemicalName: update.chemicalName.trim(),
                }])).values()];
        if (uniqueUpdates.length === 0)
            throw new Error('Không có tên chất chuẩn hợp lệ để cập nhật.');
        if (uniqueUpdates.length > 400) {
            throw new Error('Một nhóm chỉ được cập nhật tối đa 400 lọ để bảo đảm toàn vẹn dữ liệu.');
        }
        const refs = uniqueUpdates.map(update => doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${update.standardId}`));
        const batchRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_cleanup_batches`));
        const currentUser = this.auth.currentUser();
        await runTransaction(this.fb.db, async (transaction) => {
            const snapshots = await Promise.all(refs.map(ref => transaction.get(ref)));
            const missingIds = snapshots
                .map((snapshot, index) => snapshot.exists() ? null : uniqueUpdates[index].standardId)
                .filter((id) => Boolean(id));
            if (missingIds.length > 0) {
                throw new Error(`Không tìm thấy ${missingIds.length} lọ chất chuẩn; chưa có dữ liệu nào được cập nhật.`);
            }
            const changes = [];
            snapshots.forEach((snapshot, index) => {
                const update = uniqueUpdates[index];
                const fresh = { id: snapshot.id, ...snapshot.data() };
                const canonicalName = update.canonicalName?.trim() || fresh.canonical_name || '';
                const originalName = fresh.original_name?.trim() || update.originalName?.trim() || fresh.name;
                const casNumber = update.casNumber?.trim() || fresh.cas_number || '';
                const after = {
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
            this.logGlobalActivity('NORMALIZE_STANDARD_NAMES', `Chuẩn hóa tên cho ${uniqueUpdates.length} lọ chất chuẩn đối chiếu (phiên ${batchRef.id}).`),
            this.fb.updateMetadata('standards'),
        ]);
        maintenanceResults.forEach(result => {
            if (result.status === 'rejected')
                console.warn('[StandardCrudService] Post-cleanup maintenance failed:', result.reason);
        });
        return batchRef.id;
    }
    async getRecentStandardNameCleanupBatches(limitCount = 20) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền xem lịch sử chuẩn hóa.');
        const batchesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_cleanup_batches`);
        const snapshot = await getDocs(query(batchesRef, orderBy('createdAt', 'desc'), limit(Math.min(Math.max(limitCount, 1), 50))));
        return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    }
    async undoStandardNameCleanupBatch(batchId) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền hoàn tác chuẩn hóa tên.');
        if (!batchId?.trim())
            throw new Error('Mã phiên hoàn tác không hợp lệ.');
        const batchRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_cleanup_batches/${batchId}`);
        const currentUser = this.auth.currentUser();
        await runTransaction(this.fb.db, async (transaction) => {
            const batchSnapshot = await transaction.get(batchRef);
            if (!batchSnapshot.exists())
                throw new Error('Không tìm thấy phiên chuẩn hóa.');
            const batch = { id: batchSnapshot.id, ...batchSnapshot.data() };
            if (batch.status === 'UNDONE')
                throw new Error('Phiên này đã được hoàn tác trước đó.');
            if (!Array.isArray(batch.changes) || batch.changes.length === 0)
                throw new Error('Phiên không có dữ liệu để hoàn tác.');
            if (batch.changes.length > 400)
                throw new Error('Phiên vượt quá giới hạn hoàn tác an toàn.');
            const refs = batch.changes.map(change => doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${change.standardId}`));
            const snapshots = await Promise.all(refs.map(ref => transaction.get(ref)));
            const missingCount = snapshots.filter(snapshot => !snapshot.exists()).length;
            if (missingCount > 0)
                throw new Error(`${missingCount} hồ sơ không còn tồn tại; chưa hoàn tác dữ liệu nào.`);
            const conflictCount = snapshots.filter((snapshot, index) => {
                const fresh = { id: snapshot.id, ...snapshot.data() };
                return !this.matchesStandardNameSnapshot(fresh, batch.changes[index].after);
            }).length;
            if (conflictCount > 0) {
                throw new Error(`${conflictCount} hồ sơ đã được sửa sau phiên này; hoàn tác bị chặn để tránh ghi đè thay đổi mới.`);
            }
            snapshots.forEach((snapshot, index) => {
                const fresh = { id: snapshot.id, ...snapshot.data() };
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
                };
                if (hasCasSnapshot)
                    restored.cas_number = before.cas_number;
                const restoreData = {
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
                if (hasCasSnapshot)
                    restoreData['cas_number'] = before.cas_number ?? deleteField();
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
            if (result.status === 'rejected')
                console.warn('[StandardCrudService] Post-undo maintenance failed:', result.reason);
        });
    }
    snapshotStandardName(standard) {
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
    matchesStandardNameSnapshot(standard, snapshot) {
        const fields = [
            'name', 'chemical_name', 'canonical_name', 'original_name', 'name_source',
            'cas_status', 'standard_form', 'normalization_version', 'normalization_batch_id', 'normalized_by',
        ];
        if (Object.prototype.hasOwnProperty.call(snapshot, 'cas_number'))
            fields.push('cas_number');
        return fields.every(field => (standard[field] ?? '') === (snapshot[field] ?? ''));
    }
    async quickUpdateField(stdId, fields) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền cập nhật nhanh chuẩn.');
        const allowed = new Set([
            'certificate_ref', 'date_opened', 'location', 'storage_condition',
            'storage_status', 'contract_ref', 'expiry_date', 'received_date'
        ]);
        const invalidKey = Object.keys(fields).find(key => !allowed.has(key));
        if (invalidKey)
            throw new Error(`Trường không được phép cập nhật nhanh: ${invalidKey}.`);
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
        await updateDoc(ref, { ...fields, lastUpdated: serverTimestamp() });
        await this.fb.updateMetadata('standards');
    }
    async updateStandardStock(stdId, newAmount, reason) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền cập nhật tồn kho chuẩn.');
        if (!Number.isFinite(newAmount) || newAmount < 0)
            throw new Error('Tồn kho mới phải là số không âm.');
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
        await runTransaction(this.fb.db, async (transaction) => {
            const snapshot = await transaction.get(ref);
            if (!snapshot.exists())
                throw new Error('Chuẩn không tồn tại.');
            const fresh = snapshot.data();
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
    /**
     * Safe bulk tag assignment. ADD/REMOVE use Firestore array transforms to
     * avoid clobbering concurrent edits; REPLACE intentionally writes the full
     * array and is limited to the same bounded batch size.
     */
    async bulkUpdateStandardTags(ids, tags, mode) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền gán nhãn chất chuẩn.');
        const selected = normalizeTagKeysStrict(tags, 'Nhãn bulk');
        if (selected.length > MAX_STANDARD_TAGS)
            throw new Error(`Nhãn bulk tối đa ${MAX_STANDARD_TAGS} nhãn.`);
        await this.tagCatalog.refresh();
        const uniqueIds = [...new Set(ids.map(id => String(id || '').trim()).filter(Boolean))];
        if (!uniqueIds.length)
            return { successIds: [], failed: [], skippedIds: [] };
        const successIds = [];
        const failed = [];
        const skippedIds = [];
        for (let offset = 0; offset < uniqueIds.length; offset += MAX_BULK_WRITES) {
            const chunk = uniqueIds.slice(offset, offset + MAX_BULK_WRITES);
            const refs = chunk.map(id => doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`));
            const snapshots = await Promise.all(refs.map(ref => getDoc(ref)));
            const batch = writeBatch(this.fb.db);
            let writeCount = 0;
            const chunkSuccessIds = [];
            snapshots.forEach((snapshot, index) => {
                const id = chunk[index];
                if (!snapshot.exists()) {
                    skippedIds.push(id);
                    return;
                }
                const fresh = { id: snapshot.id, ...snapshot.data() };
                try {
                    if (selected.length === 0 && mode !== 'REPLACE') {
                        // ADD/REMOVE with an empty selection is a true no-op: do not
                        // touch lastUpdated or create an unnecessary Firestore write.
                        successIds.push(id);
                        return;
                    }
                    if (mode === 'ADD' || mode === 'REPLACE') {
                        this.tagCatalog.assertSelectableKeys(selected, `Nhãn bulk ${mode}`);
                    }
                    else {
                        this.tagCatalog.assertKnownOrExistingKeys(selected, fresh.sop_tags || [], 'Nhãn bulk REMOVE');
                    }
                    const next = applyTagMode(fresh.sop_tags, selected, mode);
                    const ref = refs[index];
                    if (mode === 'ADD') {
                        // For malformed legacy arrays, replace with the sanitized result;
                        // otherwise arrayUnion preserves concurrent additions.
                        const legacy = sanitizeLegacyTagKeys(fresh.sop_tags);
                        const currentRaw = Array.isArray(fresh.sop_tags) ? fresh.sop_tags : [];
                        const updateValue = JSON.stringify(legacy) === JSON.stringify(currentRaw)
                            ? arrayUnion(...selected)
                            : next;
                        batch.update(ref, { sop_tags: updateValue, lastUpdated: serverTimestamp() });
                    }
                    else if (mode === 'REMOVE') {
                        const legacy = sanitizeLegacyTagKeys(fresh.sop_tags);
                        const currentRaw = Array.isArray(fresh.sop_tags) ? fresh.sop_tags : [];
                        const updateValue = JSON.stringify(legacy) === JSON.stringify(currentRaw)
                            ? arrayRemove(...selected)
                            : next;
                        batch.update(ref, { sop_tags: updateValue, lastUpdated: serverTimestamp() });
                    }
                    else {
                        batch.update(ref, { sop_tags: next, lastUpdated: serverTimestamp() });
                    }
                    successIds.push(id);
                    chunkSuccessIds.push(id);
                    writeCount++;
                }
                catch (error) {
                    failed.push({ standardId: id, reason: error?.message || 'Không thể tính tập nhãn mới.' });
                }
            });
            if (writeCount > 0) {
                try {
                    await batch.commit();
                }
                catch (error) {
                    for (const id of chunkSuccessIds) {
                        const successIndex = successIds.indexOf(id);
                        if (successIndex >= 0)
                            successIds.splice(successIndex, 1);
                        failed.push({ standardId: id, reason: error?.message || 'Batch commit thất bại.' });
                    }
                }
            }
        }
        this.cache.invalidateLocalStandardsCache();
        await this.logGlobalActivity('BULK_UPDATE_STANDARD_TAGS', `Gán nhãn ${mode} cho ${successIds.length} lô chuẩn.`);
        return { successIds, failed, skippedIds };
    }
    async deleteStandard(id, name = '') {
        await this.deleteSelectedStandards([id]);
    }
    async deleteSelectedStandards(ids) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền ẩn chuẩn.');
        const uniqueIds = [...new Set(ids.filter(Boolean))];
        if (uniqueIds.length === 0)
            return;
        if (uniqueIds.length > 200)
            throw new Error('Chỉ có thể ẩn tối đa 200 chuẩn trong một lần.');
        const refs = uniqueIds.map(id => doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`));
        await runTransaction(this.fb.db, async (transaction) => {
            const snapshots = await Promise.all(refs.map(ref => transaction.get(ref)));
            const active = snapshots
                .filter(snapshot => snapshot.exists())
                .map(snapshot => ({ id: snapshot.id, ...snapshot.data() }))
                .filter(standard => standard.status === 'IN_USE' || Boolean(standard.current_holder || standard.current_holder_uid ||
                standard.current_request_id || standard.has_pending_request));
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
    async restoreStandard(id, name = '') {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
        const currentSnapshot = await getDoc(ref);
        if (!currentSnapshot.exists())
            throw new Error('Chuẩn cần khôi phục không còn tồn tại.');
        const current = { id: currentSnapshot.id, ...currentSnapshot.data() };
        const internalId = (current.internal_id || '').trim();
        const candidateRefs = internalId
            ? (await getDocs(query(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`), where('internal_id', 'in', [...new Set([internalId, internalId.toUpperCase(), internalId.toLowerCase()])])))).docs
                .filter(snapshot => snapshot.id !== id)
                .map(snapshot => snapshot.ref)
            : [];
        await runTransaction(this.fb.db, async (transaction) => {
            const [freshSnapshot, ...candidateSnapshots] = await Promise.all([
                transaction.get(ref),
                ...candidateRefs.map(candidateRef => transaction.get(candidateRef))
            ]);
            if (!freshSnapshot.exists())
                throw new Error('Chuẩn cần khôi phục không còn tồn tại.');
            const fresh = { id: freshSnapshot.id, ...freshSnapshot.data() };
            const occupied = candidateSnapshots
                .filter(snapshot => snapshot.exists())
                .map(snapshot => ({ id: snapshot.id, ...snapshot.data() }))
                .find(standard => standard._isDeleted !== true && standard.status !== 'DELETED');
            if (occupied) {
                throw new Error(`Không thể khôi phục vì slot ${fresh.internal_id || '(trống)'} đang được cấp cho ` +
                    `"${occupied.name}" (${occupied.internal_id || occupied.id}).`);
            }
            transaction.update(ref, {
                _isDeleted: deleteField(),
                status: Number(fresh.current_amount || 0) <= 0 ? 'DEPLETED' : 'AVAILABLE',
                lastUpdated: serverTimestamp()
            });
        });
        await this.logGlobalActivity('RESTORE_STANDARD', `Khôi phục chuẩn đối chiếu: ${name || id}`, id);
        await this.fb.updateMetadata('standards');
        this.cache.invalidateLocalStandardsCache();
    }
    // ─── CoA Request ─────────────────────────────────────────────────────────────
    async requestCoa(std) {
        const user = this.auth.currentUser();
        if (!user || !this.auth.hasPermission('standard_request')) {
            throw new Error('Bạn không có quyền yêu cầu cập nhật CoA.');
        }
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
        await runTransaction(this.fb.db, async (transaction) => {
            const snap = await transaction.get(ref);
            if (!snap.exists())
                throw new Error('Chuẩn không tồn tại.');
            if (snap.data()['certificate_ref'])
                throw new Error('Chuẩn đã có CoA.');
            if (snap.data()['coa_requested_by'])
                throw new Error('Yêu cầu CoA cho chuẩn này đã được gửi trước đó.');
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
    async completeCoaUpload(standards, certificateUrl) {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền cập nhật CoA.');
        if (!certificateUrl)
            throw new Error('URL CoA không hợp lệ.');
        const unique = [...new Map(standards.filter(item => item?.id).map(item => [item.id, item])).values()];
        if (unique.length === 0)
            throw new Error('Không tìm thấy chuẩn để cập nhật CoA.');
        if (unique.length > 400)
            throw new Error('Chỉ có thể cập nhật tối đa 400 lô trong một lần.');
        const snapshots = await Promise.all(unique.map(standard => getDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standard.id}`))));
        const freshStandards = snapshots
            .filter(snapshot => snapshot.exists())
            .map(snapshot => ({ id: snapshot.id, ...snapshot.data() }));
        if (freshStandards.length === 0)
            throw new Error('Các chuẩn cần cập nhật không còn tồn tại.');
        const batch = writeBatch(this.fb.db);
        freshStandards.forEach(standard => {
            batch.update(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standard.id}`), {
                certificate_ref: certificateUrl,
                coa_requested_by: deleteField(),
                lastUpdated: serverTimestamp()
            });
        });
        await batch.commit();
        await this.fb.updateMetadata('standards');
        this.cache.invalidateLocalStandardsCache();
        const admin = this.auth.currentUser();
        const recipients = [...new Set(freshStandards.map(item => item.coa_requested_by).filter(Boolean))];
        const coaEventId = `coa-upload:${freshStandards[0].id}:${encodeURIComponent(certificateUrl).slice(-160)}`;
        await Promise.all(recipients.map(recipientUid => this.notificationCenter.publish({
            eventId: coaEventId,
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
        await this.logGlobalActivity('UPLOAD_STANDARD_COA', `Cập nhật CoA cho ${freshStandards.length} lô chuẩn: ${freshStandards[0].name}`, freshStandards[0].id);
    }
    validateStandardAmounts(std) {
        if (!std.id?.trim() || !std.name?.trim())
            throw new Error('Mã và tên chuẩn là bắt buộc.');
        if (!std.unit?.trim())
            throw new Error('Đơn vị chuẩn là bắt buộc.');
        if (!Number.isFinite(std.initial_amount) || std.initial_amount < 0) {
            throw new Error('Lượng ban đầu phải là số không âm.');
        }
        if (!Number.isFinite(std.current_amount) || std.current_amount < 0) {
            throw new Error('Lượng hiện tại phải là số không âm.');
        }
    }
    // ─── Global Activity Logging ──────────────────────────────────────────────────
    async logGlobalActivity(action, details, targetId) {
        const logRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`));
        await setDoc(logRef, {
            id: logRef.id, action, details,
            timestamp: serverTimestamp(), lastUpdated: serverTimestamp(),
            user: this.auth.currentUser()?.displayName || 'Hệ thống',
            targetId: targetId ?? null
        });
    }
    static { this.ɵfac = function StandardCrudService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardCrudService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: StandardCrudService, factory: StandardCrudService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardCrudService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=standard-crud.service.js.map