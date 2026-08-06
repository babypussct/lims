import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { collection, doc, getDocs, query, setDoc, updateDoc, deleteField, writeBatch, serverTimestamp, } from 'firebase/firestore';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { StateService } from '../../../core/services/state.service';
import { TargetService } from '../../targets/target.service';
import { buildTagKey, normalizeTagKeysStrict, parseTagKeyStrict, sanitizeLegacyTagKeys, MAX_BULK_WRITES, deriveMethodSeries, compareChemicalMethodCodes, normalizeNafi6ChemicalMethodCode, STANDARD_DEVICE_OPTIONS, } from './standard-tag.utils';
import { VLAT_11669_CHEMICAL_METHOD_TAGS, VLAT_11669_SOURCE, } from './vlat-1-1669-487-20251015-chemical-method-tags';
import { getVlatMethodName } from './vlat-1-1669-20251015-chemical-method-names';
import * as i0 from "@angular/core";
export class StandardTagCatalogService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.auth = inject(AuthService);
        this.state = inject(StateService);
        this.targetService = inject(TargetService);
        this.customTags = signal([]);
        this.targetGroups = signal([]);
        this.deviceOptions = STANDARD_DEVICE_OPTIONS;
        this.isReady = signal(false);
        this.loadWarning = signal(null);
        /**
         * Operational pickers expose only the 119 reviewed chemical test methods.
         * SOPs, target groups and old manual catalog entries remain resolvable for
         * history, but are not presented as method labels for new assignments.
         */
        this.methodOptions = computed(() => {
            const now = this.todayIso();
            const persistedById = new Map(this.customTags().map(tag => [tag.id, tag]));
            return VLAT_11669_CHEMICAL_METHOD_TAGS
                .map(seed => {
                const persisted = persistedById.get(seed.id);
                const item = persisted && this.isChemicalMethodTag(persisted)
                    ? { ...seed, ...persisted, methodName: persisted.methodName || seed.methodName }
                    : seed;
                return this.toCustomOption(item, this.isSelectableCustomTag(item, now));
            })
                .filter(option => option.selectable)
                .sort((a, b) => compareChemicalMethodCodes(a.methodCode || a.label, b.methodCode || b.label));
        });
        /** Compatibility alias used by existing standards/request pickers. */
        this.selectableOptions = this.methodOptions;
        this.lookupMap = computed(() => {
            const map = new Map();
            // Keep the reviewed method catalog resolvable even before an Admin runs
            // the idempotent Firestore seed import. Persisted documents override the
            // static metadata when they exist (e.g. archive/supersede state).
            for (const item of VLAT_11669_CHEMICAL_METHOD_TAGS) {
                map.set(buildTagKey('CUSTOM', item.id), this.toCustomOption(item, true));
            }
            for (const item of this.state.sops())
                map.set(buildTagKey('SOP', item.id), this.toSopOption(item));
            for (const item of this.targetGroups())
                map.set(buildTagKey('TARGET_GROUP', item.id), this.toTargetOption(item));
            for (const item of this.customTags())
                map.set(buildTagKey('CUSTOM', item.id), this.toCustomOption(item, this.isSelectableCustomTag(item, this.todayIso())));
            return map;
        });
        // TargetService owns the source signal so renames/additions/deletions are
        // reflected immediately without coupling this catalog to StateService's
        // unrelated data shape.
        effect(() => {
            const user = this.auth.currentUser();
            const groups = this.targetService.groups();
            if (user)
                this.targetGroups.set(groups);
        });
        effect(() => {
            const user = this.auth.currentUser();
            if (!user) {
                this.customTags.set([]);
                this.targetGroups.set([]);
                this.isReady.set(false);
                return;
            }
            void this.refresh().catch(error => {
                this.loadWarning.set(error?.message || 'Không tải được danh mục nhãn.');
            });
        });
    }
    async refresh(forceTargets = false) {
        if (this.loading)
            return this.loading;
        this.loading = (async () => {
            try {
                const [customSnapshot, groups] = await Promise.all([
                    getDocs(query(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags`))),
                    this.targetService.getAllGroups(forceTargets),
                ]);
                this.customTags.set(customSnapshot.docs.map(item => ({ id: item.id, ...item.data() })));
                this.targetGroups.set(groups);
                this.loadWarning.set(null);
                this.isReady.set(true);
            }
            finally {
                this.loading = undefined;
            }
        })();
        return this.loading;
    }
    resolveTag(key) {
        try {
            const parsed = parseTagKeyStrict(key);
            const found = this.lookupMap().get(parsed.key);
            if (found)
                return found;
            return {
                key: parsed.key,
                label: `[Đã lưu trữ] ${parsed.key}`,
                source: parsed.source,
                selectable: false,
                archived: true,
            };
        }
        catch {
            // Legacy reads must never crash list/grid rendering. The malformed key
            // remains visible as an archived diagnostic until an explicit cleanup.
            const raw = String(key ?? '').trim() || '(key rỗng)';
            return {
                key: raw,
                label: `[Đã lưu trữ] ${raw}`,
                source: 'CUSTOM',
                selectable: false,
                archived: true,
            };
        }
    }
    assertSelectableKeys(keys, contextLabel = 'Nhãn') {
        const normalized = normalizeTagKeysStrict(keys, contextLabel);
        const selectable = new Set(this.selectableOptions().map(item => item.key));
        const unknown = normalized.filter(key => !selectable.has(key));
        if (unknown.length)
            throw new Error(`${contextLabel} không có trong danh mục đang hoạt động: ${unknown.join(', ')}`);
        return normalized;
    }
    assertKnownOrExistingKeys(keys, existingKeys, contextLabel = 'Nhãn') {
        const normalized = normalizeTagKeysStrict(keys, contextLabel);
        const existing = new Set(sanitizeLegacyTagKeys(existingKeys));
        const selectable = new Set(this.selectableOptions().map(item => item.key));
        const invalid = normalized.filter(key => !selectable.has(key) && !existing.has(key));
        if (invalid.length)
            throw new Error(`${contextLabel} không hợp lệ hoặc đã lưu trữ: ${invalid.join(', ')}`);
        return normalized;
    }
    deriveDeviceCodes(keys) {
        const result = new Set();
        for (const key of sanitizeLegacyTagKeys(keys)) {
            for (const code of this.resolveTag(key).deviceCodes || [])
                result.add(code);
        }
        return [...result].sort((a, b) => a.localeCompare(b));
    }
    async createCustomTag(input) {
        this.requireEditPermission();
        const name = String(input.name || '').trim();
        this.assertCustomName(name);
        const id = await this.allocateCustomId(name);
        const color = this.normalizeColor(input.color);
        const item = {
            id,
            name,
            description: input.description?.trim() || '',
            origin: 'MANUAL',
            locked: false,
            _isDeleted: false,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
        };
        if (color)
            item.color = color;
        const uid = this.auth.currentUser()?.uid;
        if (uid)
            item.createdBy = uid;
        await setDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags/${id}`), item);
        void this.logActivity('CREATE_STANDARD_TAG', `Tạo nhãn danh mục: ${name}`, id);
        await this.refresh();
        return item;
    }
    async updateCustomTag(id, input) {
        this.requireEditPermission();
        const existing = this.requireCustomTag(id);
        if (existing.locked)
            throw new Error('Nhãn nguồn công nhận bị khóa; chỉ được cập nhật qua seed revision.');
        const name = String(input.name || '').trim();
        this.assertCustomName(name);
        const color = this.normalizeColor(input.color);
        const updateData = {
            name,
            description: input.description?.trim() || '',
            origin: 'MANUAL',
            locked: false,
            lastUpdated: serverTimestamp(),
        };
        updateData['color'] = color || null;
        await updateDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags/${id}`), updateData);
        void this.logActivity('UPDATE_STANDARD_TAG', `Cập nhật nhãn danh mục: ${name}`, id);
        await this.refresh();
    }
    async softDeleteCustomTag(id) {
        this.requireEditPermission();
        const existing = this.requireCustomTag(id);
        if (existing.locked)
            throw new Error('Nhãn nguồn công nhận bị khóa; không thể xóa thủ công.');
        await updateDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags/${id}`), {
            _isDeleted: true,
            lastUpdated: serverTimestamp(),
        });
        void this.logActivity('SOFT_DELETE_STANDARD_TAG', `Ẩn nhãn danh mục: ${existing.name}`, id);
        await this.refresh();
    }
    async restoreCustomTag(id) {
        this.requireEditPermission();
        const existing = this.requireCustomTag(id);
        if (existing.locked)
            throw new Error('Nhãn nguồn công nhận bị khóa; không thể khôi phục thủ công.');
        await updateDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags/${id}`), {
            _isDeleted: false,
            lastUpdated: serverTimestamp(),
        });
        void this.logActivity('RESTORE_STANDARD_TAG', `Khôi phục nhãn danh mục: ${existing.name}`, id);
        await this.refresh();
    }
    async previewAccreditationMethodImport(options = {}) {
        this.validateAccreditationManifest();
        await this.refresh();
        const current = new Map(this.customTags().map(item => [item.id, item]));
        const preview = {
            createIds: [], updateIds: [], unchangedIds: [], restoreIds: [], conflictIds: [],
        };
        for (const item of VLAT_11669_CHEMICAL_METHOD_TAGS) {
            const old = current.get(item.id);
            if (!old) {
                preview.createIds.push(item.id);
                continue;
            }
            if (old.origin !== 'ACCREDITATION_SCOPE' || old.sourceSha256 !== item.sourceSha256 || old.methodCode !== item.methodCode) {
                preview.conflictIds.push(item.id);
                continue;
            }
            if (old._isDeleted && options.restoreArchivedFromSameSeed && this.canRestoreSeedItem(old, item)) {
                preview.restoreIds.push(item.id);
            }
            else if (this.sameSeedItem(old, item)) {
                preview.unchangedIds.push(item.id);
            }
            else {
                preview.updateIds.push(item.id);
            }
        }
        return preview;
    }
    /** Backward-compatible preview shape used by older catalog screens. */
    async previewAccreditationSeed() {
        await this.refresh();
        const preview = await this.previewAccreditationMethodImport();
        const seedIds = new Set(VLAT_11669_CHEMICAL_METHOD_TAGS.map(item => item.id));
        const archive = this.customTags()
            .filter(item => item.origin === 'ACCREDITATION_SCOPE' && item.seedVersion === VLAT_11669_SOURCE.seedVersion && !seedIds.has(item.id))
            .map(item => item.id);
        return {
            create: preview.createIds,
            update: preview.updateIds,
            unchanged: preview.unchangedIds,
            archive,
            conflicts: preview.conflictIds,
        };
    }
    async upsertAccreditationMethodTags(options = {}) {
        this.requireEditPermission();
        const preview = await this.previewAccreditationMethodImport(options);
        if (preview.conflictIds.length)
            throw new Error(`Phát hiện ${preview.conflictIds.length} xung đột seed; đã dừng import.`);
        const writeIds = new Set([...preview.createIds, ...preview.updateIds, ...preview.restoreIds]);
        if (!writeIds.size)
            return preview;
        const current = new Map(this.customTags().map(item => [item.id, item]));
        const writes = [];
        for (const item of VLAT_11669_CHEMICAL_METHOD_TAGS) {
            if (!writeIds.has(item.id))
                continue;
            const old = current.get(item.id);
            const restoring = preview.restoreIds.includes(item.id);
            writes.push({
                ref: doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags/${item.id}`),
                restore: restoring,
                data: {
                    ...item,
                    _isDeleted: restoring ? false : (old?._isDeleted ?? item._isDeleted ?? false),
                    lastUpdated: serverTimestamp(),
                    ...(old ? {} : {
                        createdAt: serverTimestamp(),
                        createdBy: this.auth.currentUser()?.uid,
                    }),
                    ...(restoring ? { supersededByDecision: deleteField(), supersededAt: deleteField() } : {}),
                },
            });
        }
        for (let offset = 0; offset < writes.length; offset += MAX_BULK_WRITES) {
            const batch = writeBatch(this.fb.db);
            for (const write of writes.slice(offset, offset + MAX_BULK_WRITES)) {
                batch.set(write.ref, write.data, { merge: true });
            }
            await batch.commit();
        }
        await this.logActivity('IMPORT_ACCREDITATION_TAG_SEED', `Import seed ${VLAT_11669_SOURCE.seedVersion}, SHA-256 ${VLAT_11669_SOURCE.sourceSha256}: tổng ${VLAT_11669_CHEMICAL_METHOD_TAGS.length}, tạo ${preview.createIds.length}, cập nhật ${preview.updateIds.length}, restore ${preview.restoreIds.length}.`);
        await this.refresh();
        return preview;
    }
    /** Backward-compatible count result for existing callers. */
    async importAccreditationSeed(options = {}) {
        const preview = await this.upsertAccreditationMethodTags(options);
        return {
            created: preview.createIds.length,
            updated: preview.updateIds.length,
            restored: preview.restoreIds.length,
            archived: 0,
            unchanged: preview.unchangedIds.length,
        };
    }
    async archiveAccreditationMethodSeed(seedVersion, supersededByDecision, supersededAt) {
        this.requireEditPermission();
        if (!seedVersion.trim() || !supersededByDecision.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(supersededAt)) {
            throw new Error('Thông tin archive seed không hợp lệ.');
        }
        await this.refresh();
        const candidates = this.customTags().filter(item => item.origin === 'ACCREDITATION_SCOPE' && item.seedVersion === seedVersion);
        const writes = candidates
            .filter(item => item._isDeleted !== true || item.supersededByDecision !== supersededByDecision || item.supersededAt !== supersededAt)
            .map(item => ({
            ref: doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags/${item.id}`),
            data: { _isDeleted: true, supersededByDecision, supersededAt, lastUpdated: serverTimestamp() },
        }));
        for (let offset = 0; offset < writes.length; offset += MAX_BULK_WRITES) {
            const batch = writeBatch(this.fb.db);
            for (const write of writes.slice(offset, offset + MAX_BULK_WRITES))
                batch.update(write.ref, write.data);
            await batch.commit();
        }
        if (writes.length) {
            await this.logActivity('ARCHIVE_ACCREDITATION_TAG_SEED', `Archive seed ${seedVersion} -> ${supersededByDecision} (${supersededAt}), ${writes.length} nhãn.`);
            await this.refresh();
        }
    }
    validateAccreditationManifest() {
        if (VLAT_11669_CHEMICAL_METHOD_TAGS.length !== 119) {
            throw new Error(`Manifest phương pháp phải có đúng 119 item, hiện có ${VLAT_11669_CHEMICAL_METHOD_TAGS.length}.`);
        }
        const expectedSeries = {
            'H-1': 15, 'H-2': 4, 'H-3': 1, 'H-5': 5, 'H-6': 11,
            'H-7': 16, 'H-8': 47, 'H-9': 17, 'H-13': 3,
        };
        const counts = new Map();
        const ids = new Set();
        const allowedDevices = new Set(STANDARD_DEVICE_OPTIONS.map(option => option.code));
        for (const item of VLAT_11669_CHEMICAL_METHOD_TAGS) {
            const methodCode = normalizeNafi6ChemicalMethodCode(item.methodCode);
            if (item.name !== methodCode || item.code !== methodCode || item.origin !== 'ACCREDITATION_SCOPE' || item.templateKind !== 'TEST_METHOD') {
                throw new Error(`Manifest có metadata không hợp lệ tại ${item.id}.`);
            }
            if (!item.methodName || !/^X(?:á|á|a)c\s+đ/i.test(item.methodName)) {
                throw new Error(`Manifest thiếu tên phép thử tại ${item.id}.`);
            }
            if (item.sourceDecision !== VLAT_11669_SOURCE.sourceDecision || item.sourceLabCode !== VLAT_11669_SOURCE.sourceLabCode || item.sourceSha256 !== VLAT_11669_SOURCE.sourceSha256) {
                throw new Error(`Manifest sai provenance tại ${item.id}.`);
            }
            if (!Array.isArray(item.deviceCodes) || item.deviceCodes.length > 5 || new Set(item.deviceCodes).size !== item.deviceCodes.length || item.deviceCodes.some(code => !allowedDevices.has(code))) {
                throw new Error(`Mapping thiết bị không hợp lệ tại ${item.id}.`);
            }
            const series = deriveMethodSeries(methodCode);
            counts.set(series, (counts.get(series) || 0) + 1);
            if (ids.has(item.id))
                throw new Error(`Document ID seed bị trùng: ${item.id}.`);
            ids.add(item.id);
        }
        for (const [series, expected] of Object.entries(expectedSeries)) {
            if (counts.get(series) !== expected)
                throw new Error(`Series ${series} phải có ${expected} mã, hiện có ${counts.get(series) || 0}.`);
        }
    }
    canRestoreSeedItem(old, item) {
        const today = this.todayIso();
        return old.seedVersion === item.seedVersion && !old.supersededByDecision &&
            (!item.sourceValidTo || item.sourceValidTo >= today);
    }
    toSopOption(sop) {
        return { key: buildTagKey('SOP', sop.id), label: sop.ref?.trim() || sop.name, source: 'SOP', selectable: !sop.isArchived, archived: Boolean(sop.isArchived) };
    }
    toTargetOption(group) {
        return { key: buildTagKey('TARGET_GROUP', group.id), label: group.name, source: 'TARGET_GROUP', selectable: true };
    }
    toCustomOption(item, selectable) {
        const methodName = item.methodName || (item.methodCode ? getVlatMethodName(item.methodCode) : undefined);
        return {
            key: buildTagKey('CUSTOM', item.id),
            label: item.name,
            description: item.description,
            methodName,
            source: 'CUSTOM',
            origin: item.origin || 'MANUAL',
            templateKind: item.templateKind,
            methodCode: item.methodCode,
            methodSeries: item.methodCode ? item.methodCode.slice('NAFI6/'.length).split('.')[0] : undefined,
            deviceCodes: item.deviceCodes || [],
            sourceLabCode: item.sourceLabCode,
            sourceDecision: item.sourceDecision,
            sourceValidFrom: item.sourceValidFrom,
            sourceValidTo: item.sourceValidTo,
            supersededByDecision: item.supersededByDecision,
            color: item.color,
            selectable,
            archived: Boolean(item._isDeleted) || !selectable,
        };
    }
    isSelectableCustomTag(item, today) {
        if (item._isDeleted)
            return false;
        if (item.supersededByDecision || (item.sourceValidTo && item.sourceValidTo < today))
            return false;
        return true;
    }
    isChemicalMethodTag(item) {
        return item.origin === 'ACCREDITATION_SCOPE'
            && item.templateKind === 'TEST_METHOD'
            && typeof item.methodCode === 'string';
    }
    todayIso() {
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).formatToParts(new Date());
        const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
        return `${values['year']}-${values['month']}-${values['day']}`;
    }
    requireEditPermission() {
        if (!this.auth.canEditStandards())
            throw new Error('Bạn không có quyền quản lý danh mục nhãn chuẩn.');
    }
    requireCustomTag(id) {
        const item = this.customTags().find(tag => tag.id === id);
        if (!item)
            throw new Error('Không tìm thấy nhãn trong danh mục.');
        return item;
    }
    assertCustomName(name) {
        if (!name || name.length > 100)
            throw new Error('Tên nhãn bắt buộc và tối đa 100 ký tự.');
        if (/[\u0000-\u001f]/.test(name))
            throw new Error('Tên nhãn chứa ký tự điều khiển không hợp lệ.');
        if (name.toLowerCase().startsWith('device:'))
            throw new Error('Không được tạo nhãn thiết bị tự do.');
    }
    normalizeColor(color) {
        if (color === undefined || color === '')
            return undefined;
        if (!/^#[0-9a-f]{6}$/i.test(color.trim()))
            throw new Error('Màu nhãn phải là mã hex 6 ký tự.');
        return color.trim().toUpperCase();
    }
    async allocateCustomId(name) {
        const base = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'tag';
        let id = base;
        let index = 2;
        while (this.customTags().some(item => item.id === id))
            id = `${base}-${index++}`;
        return id;
    }
    sameSeedItem(a, b) {
        const fields = [
            'id', 'name', 'code', 'description', 'color', 'origin', 'templateKind',
            'methodName', 'methodCode', 'deviceCodes', 'sourceAgency', 'sourceDecision', 'sourceLabCode',
            'sourceDocument', 'sourceSha256', 'sourceValidFrom', 'sourceValidTo', 'sourcePages',
            'seedVersion', 'sortOrder', 'locked'
        ];
        return fields.every(field => JSON.stringify(a[field] ?? null) === JSON.stringify(b[field] ?? null));
    }
    async logActivity(action, details, targetId) {
        try {
            const ref = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`));
            await setDoc(ref, {
                id: ref.id,
                action,
                details,
                targetId: targetId || null,
                timestamp: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                user: this.auth.currentUser()?.displayName || 'Hệ thống',
            });
        }
        catch (error) {
            console.warn('[StandardTagCatalogService] Activity log failed:', error);
        }
    }
    static { this.ɵfac = function StandardTagCatalogService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardTagCatalogService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: StandardTagCatalogService, factory: StandardTagCatalogService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardTagCatalogService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
//# sourceMappingURL=standard-tag-catalog.service.js.map