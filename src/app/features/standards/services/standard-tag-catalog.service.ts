import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  deleteField,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { StateService } from '../../../core/services/state.service';
import { TargetService } from '../../targets/target.service';
import { Sop, TargetGroup } from '../../../core/models/sop.model';
import {
  StandardTagCatalogItem,
  StandardTagOption,
  StandardDeviceCode,
  StandardDeviceOption,
} from '../../../core/models/standard.model';
import {
  buildTagKey,
  normalizeTagKeysStrict,
  parseTagKeyStrict,
  sanitizeLegacyTagKeys,
  MAX_BULK_WRITES,
  deriveMethodSeries,
  compareChemicalMethodCodes,
  normalizeNafi6ChemicalMethodCode,
  STANDARD_DEVICE_OPTIONS,
} from './standard-tag.utils';
import {
  VLAT_11669_CHEMICAL_METHOD_TAGS,
  VLAT_11669_SOURCE,
} from './vlat-1-1669-487-20251015-chemical-method-tags';
import { getVlatMethodName } from './vlat-1-1669-20251015-chemical-method-names';

export interface AccreditationMethodImportOptions {
  restoreArchivedFromSameSeed?: boolean;
}

export interface AccreditationMethodImportPreview {
  createIds: string[];
  updateIds: string[];
  unchangedIds: string[];
  restoreIds: string[];
  conflictIds: string[];
}

@Injectable({ providedIn: 'root' })
export class StandardTagCatalogService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly state = inject(StateService);
  private readonly targetService = inject(TargetService);

  private readonly customTags = signal<StandardTagCatalogItem[]>([]);
  private readonly targetGroups = signal<TargetGroup[]>([]);
  private loading?: Promise<void>;

  readonly deviceOptions: readonly StandardDeviceOption[] = STANDARD_DEVICE_OPTIONS;
  readonly isReady = signal(false);
  readonly loadWarning = signal<string | null>(null);

  /**
   * Operational pickers expose only the 119 reviewed chemical test methods.
   * SOPs, target groups and old manual catalog entries remain resolvable for
   * history, but are not presented as method labels for new assignments.
   */
  readonly methodOptions = computed<StandardTagOption[]>(() => {
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
  readonly selectableOptions = this.methodOptions;

  readonly lookupMap = computed<ReadonlyMap<string, StandardTagOption>>(() => {
    const map = new Map<string, StandardTagOption>();
    // Keep the reviewed method catalog resolvable even before an Admin runs
    // the idempotent Firestore seed import. Persisted documents override the
    // static metadata when they exist (e.g. archive/supersede state).
    for (const item of VLAT_11669_CHEMICAL_METHOD_TAGS) {
      map.set(buildTagKey('CUSTOM', item.id), this.toCustomOption(item, true));
    }
    for (const item of this.state.sops()) map.set(buildTagKey('SOP', item.id), this.toSopOption(item));
    for (const item of this.targetGroups()) map.set(buildTagKey('TARGET_GROUP', item.id), this.toTargetOption(item));
    for (const item of this.customTags()) map.set(buildTagKey('CUSTOM', item.id), this.toCustomOption(item, this.isSelectableCustomTag(item, this.todayIso())));
    return map;
  });

  constructor() {
    // TargetService owns the source signal so renames/additions/deletions are
    // reflected immediately without coupling this catalog to StateService's
    // unrelated data shape.
    effect(() => {
      const user = this.auth.currentUser();
      const groups = this.targetService.groups();
      if (user) this.targetGroups.set(groups);
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

  async refresh(forceTargets = false): Promise<void> {
    if (this.loading) return this.loading;
    this.loading = (async () => {
      try {
        const [customSnapshot, groups] = await Promise.all([
          getDocs(query(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags`))),
          this.targetService.getAllGroups(forceTargets),
        ]);
        this.customTags.set(customSnapshot.docs.map(item => ({ id: item.id, ...item.data() } as StandardTagCatalogItem)));
        this.targetGroups.set(groups);
        this.loadWarning.set(null);
        this.isReady.set(true);
      } finally {
        this.loading = undefined;
      }
    })();
    return this.loading;
  }

  resolveTag(key: string): StandardTagOption {
    try {
      const parsed = parseTagKeyStrict(key);
      const found = this.lookupMap().get(parsed.key);
      if (found) return found;
      return {
        key: parsed.key,
        label: `[Đã lưu trữ] ${parsed.key}`,
        source: parsed.source,
        selectable: false,
        archived: true,
      };
    } catch {
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

  assertSelectableKeys(keys: unknown, contextLabel = 'Nhãn'): string[] {
    const normalized = normalizeTagKeysStrict(keys, contextLabel);
    const selectable = new Set(this.selectableOptions().map(item => item.key));
    const unknown = normalized.filter(key => !selectable.has(key));
    if (unknown.length) throw new Error(`${contextLabel} không có trong danh mục đang hoạt động: ${unknown.join(', ')}`);
    return normalized;
  }

  assertKnownOrExistingKeys(keys: unknown, existingKeys: readonly string[], contextLabel = 'Nhãn'): string[] {
    const normalized = normalizeTagKeysStrict(keys, contextLabel);
    const existing = new Set(sanitizeLegacyTagKeys(existingKeys));
    const selectable = new Set(this.selectableOptions().map(item => item.key));
    const invalid = normalized.filter(key => !selectable.has(key) && !existing.has(key));
    if (invalid.length) throw new Error(`${contextLabel} không hợp lệ hoặc đã lưu trữ: ${invalid.join(', ')}`);
    return normalized;
  }

  deriveDeviceCodes(keys: unknown): StandardDeviceCode[] {
    const result = new Set<StandardDeviceCode>();
    for (const key of sanitizeLegacyTagKeys(keys)) {
      for (const code of this.resolveTag(key).deviceCodes || []) result.add(code);
    }
    return [...result].sort((a, b) => a.localeCompare(b));
  }

  async createCustomTag(input: Pick<StandardTagCatalogItem, 'name' | 'description' | 'color'>): Promise<StandardTagCatalogItem> {
    this.requireEditPermission();
    const name = String(input.name || '').trim();
    this.assertCustomName(name);
    const id = await this.allocateCustomId(name);
    const color = this.normalizeColor(input.color);
    const item: StandardTagCatalogItem = {
      id,
      name,
      description: input.description?.trim() || '',
      origin: 'MANUAL',
      locked: false,
      _isDeleted: false,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    };
    if (color) item.color = color;
    const uid = this.auth.currentUser()?.uid;
    if (uid) item.createdBy = uid;
    await setDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags/${id}`), item);
    void this.logActivity('CREATE_STANDARD_TAG', `Tạo nhãn danh mục: ${name}`, id);
    await this.refresh();
    return item;
  }

  async updateCustomTag(id: string, input: Pick<StandardTagCatalogItem, 'name' | 'description' | 'color'>): Promise<void> {
    this.requireEditPermission();
    const existing = this.requireCustomTag(id);
    if (existing.locked) throw new Error('Nhãn nguồn công nhận bị khóa; chỉ được cập nhật qua seed revision.');
    const name = String(input.name || '').trim();
    this.assertCustomName(name);
    const color = this.normalizeColor(input.color);
    const updateData: Record<string, any> = {
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

  async softDeleteCustomTag(id: string): Promise<void> {
    this.requireEditPermission();
    const existing = this.requireCustomTag(id);
    if (existing.locked) throw new Error('Nhãn nguồn công nhận bị khóa; không thể xóa thủ công.');
    await updateDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags/${id}`), {
      _isDeleted: true,
      lastUpdated: serverTimestamp(),
    });
    void this.logActivity('SOFT_DELETE_STANDARD_TAG', `Ẩn nhãn danh mục: ${existing.name}`, id);
    await this.refresh();
  }

  async restoreCustomTag(id: string): Promise<void> {
    this.requireEditPermission();
    const existing = this.requireCustomTag(id);
    if (existing.locked) throw new Error('Nhãn nguồn công nhận bị khóa; không thể khôi phục thủ công.');
    await updateDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_tags/${id}`), {
      _isDeleted: false,
      lastUpdated: serverTimestamp(),
    });
    void this.logActivity('RESTORE_STANDARD_TAG', `Khôi phục nhãn danh mục: ${existing.name}`, id);
    await this.refresh();
  }

  async previewAccreditationMethodImport(options: AccreditationMethodImportOptions = {}): Promise<AccreditationMethodImportPreview> {
    this.validateAccreditationManifest();
    await this.refresh();
    const current = new Map(this.customTags().map(item => [item.id, item]));
    const preview: AccreditationMethodImportPreview = {
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
      } else if (this.sameSeedItem(old, item)) {
        preview.unchangedIds.push(item.id);
      } else {
        preview.updateIds.push(item.id);
      }
    }
    return preview;
  }

  /** Backward-compatible preview shape used by older catalog screens. */
  async previewAccreditationSeed(): Promise<{ create: string[]; update: string[]; unchanged: string[]; archive: string[]; conflicts: string[] }> {
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

  async upsertAccreditationMethodTags(options: AccreditationMethodImportOptions = {}): Promise<AccreditationMethodImportPreview> {
    this.requireEditPermission();
    const preview = await this.previewAccreditationMethodImport(options);
    if (preview.conflictIds.length) throw new Error(`Phát hiện ${preview.conflictIds.length} xung đột seed; đã dừng import.`);
    const writeIds = new Set([...preview.createIds, ...preview.updateIds, ...preview.restoreIds]);
    if (!writeIds.size) return preview;

    const current = new Map(this.customTags().map(item => [item.id, item]));
    const writes: { ref: any; data: Record<string, any>; restore: boolean }[] = [];
    for (const item of VLAT_11669_CHEMICAL_METHOD_TAGS) {
      if (!writeIds.has(item.id)) continue;
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
    await this.logActivity(
      'IMPORT_ACCREDITATION_TAG_SEED',
      `Import seed ${VLAT_11669_SOURCE.seedVersion}, SHA-256 ${VLAT_11669_SOURCE.sourceSha256}: tổng ${VLAT_11669_CHEMICAL_METHOD_TAGS.length}, tạo ${preview.createIds.length}, cập nhật ${preview.updateIds.length}, restore ${preview.restoreIds.length}.`
    );
    await this.refresh();
    return preview;
  }

  /** Backward-compatible count result for existing callers. */
  async importAccreditationSeed(options: AccreditationMethodImportOptions = {}): Promise<{ created: number; updated: number; restored: number; archived: number; unchanged: number }> {
    const preview = await this.upsertAccreditationMethodTags(options);
    return {
      created: preview.createIds.length,
      updated: preview.updateIds.length,
      restored: preview.restoreIds.length,
      archived: 0,
      unchanged: preview.unchangedIds.length,
    };
  }

  async archiveAccreditationMethodSeed(seedVersion: string, supersededByDecision: string, supersededAt: string): Promise<void> {
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
      for (const write of writes.slice(offset, offset + MAX_BULK_WRITES)) batch.update(write.ref, write.data);
      await batch.commit();
    }
    if (writes.length) {
      await this.logActivity('ARCHIVE_ACCREDITATION_TAG_SEED', `Archive seed ${seedVersion} -> ${supersededByDecision} (${supersededAt}), ${writes.length} nhãn.`);
      await this.refresh();
    }
  }

  private validateAccreditationManifest(): void {
    if (VLAT_11669_CHEMICAL_METHOD_TAGS.length !== 119) {
      throw new Error(`Manifest phương pháp phải có đúng 119 item, hiện có ${VLAT_11669_CHEMICAL_METHOD_TAGS.length}.`);
    }
    const expectedSeries: Record<string, number> = {
      'H-1': 15, 'H-2': 4, 'H-3': 1, 'H-5': 5, 'H-6': 11,
      'H-7': 16, 'H-8': 47, 'H-9': 17, 'H-13': 3,
    };
    const counts = new Map<string, number>();
    const ids = new Set<string>();
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
      if (ids.has(item.id)) throw new Error(`Document ID seed bị trùng: ${item.id}.`);
      ids.add(item.id);
    }
    for (const [series, expected] of Object.entries(expectedSeries)) {
      if (counts.get(series) !== expected) throw new Error(`Series ${series} phải có ${expected} mã, hiện có ${counts.get(series) || 0}.`);
    }
  }

  private canRestoreSeedItem(old: StandardTagCatalogItem, item: StandardTagCatalogItem): boolean {
    const today = this.todayIso();
    return old.seedVersion === item.seedVersion && !old.supersededByDecision &&
      (!item.sourceValidTo || item.sourceValidTo >= today);
  }

  private toSopOption(sop: Sop): StandardTagOption {
    return { key: buildTagKey('SOP', sop.id), label: sop.ref?.trim() || sop.name, source: 'SOP', selectable: !sop.isArchived, archived: Boolean(sop.isArchived) };
  }

  private toTargetOption(group: TargetGroup): StandardTagOption {
    return { key: buildTagKey('TARGET_GROUP', group.id), label: group.name, source: 'TARGET_GROUP', selectable: true };
  }

  private toCustomOption(item: StandardTagCatalogItem, selectable: boolean): StandardTagOption {
    const methodName = item.methodName || (item.methodCode ? getVlatMethodName(item.methodCode) : undefined);
    const seed = item.origin === 'ACCREDITATION_SCOPE'
      ? VLAT_11669_CHEMICAL_METHOD_TAGS.find(candidate => candidate.id === item.id)
      : undefined;
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
      // Seeded accreditation methods are locked catalog entries. Prefer the
      // reviewed in-app mapping so older Firestore documents with incomplete
      // deviceCodes cannot make the technique facet/counts stale.
      deviceCodes: seed?.deviceCodes ? [...seed.deviceCodes] : (item.deviceCodes || []),
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

  private isSelectableCustomTag(item: StandardTagCatalogItem, today: string): boolean {
    if (item._isDeleted) return false;
    if (item.supersededByDecision || (item.sourceValidTo && item.sourceValidTo < today)) return false;
    return true;
  }

  private isChemicalMethodTag(item: StandardTagCatalogItem): boolean {
    return item.origin === 'ACCREDITATION_SCOPE'
      && item.templateKind === 'TEST_METHOD'
      && typeof item.methodCode === 'string';
  }

  private todayIso(): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${values['year']}-${values['month']}-${values['day']}`;
  }

  private requireEditPermission(): void {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền quản lý danh mục nhãn chuẩn.');
  }

  private requireCustomTag(id: string): StandardTagCatalogItem {
    const item = this.customTags().find(tag => tag.id === id);
    if (!item) throw new Error('Không tìm thấy nhãn trong danh mục.');
    return item;
  }

  private assertCustomName(name: string): void {
    if (!name || name.length > 100) throw new Error('Tên nhãn bắt buộc và tối đa 100 ký tự.');
    if (/[\u0000-\u001f]/.test(name)) throw new Error('Tên nhãn chứa ký tự điều khiển không hợp lệ.');
    if (name.toLowerCase().startsWith('device:')) throw new Error('Không được tạo nhãn thiết bị tự do.');
  }

  private normalizeColor(color?: string): string | undefined {
    if (color === undefined || color === '') return undefined;
    if (!/^#[0-9a-f]{6}$/i.test(color.trim())) throw new Error('Màu nhãn phải là mã hex 6 ký tự.');
    return color.trim().toUpperCase();
  }

  private async allocateCustomId(name: string): Promise<string> {
    const base = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'tag';
    let id = base;
    let index = 2;
    while (this.customTags().some(item => item.id === id)) id = `${base}-${index++}`;
    return id;
  }

  private sameSeedItem(a: StandardTagCatalogItem, b: StandardTagCatalogItem): boolean {
    const fields: (keyof StandardTagCatalogItem)[] = [
      'id', 'name', 'code', 'description', 'color', 'origin', 'templateKind',
      'methodName', 'methodCode', 'deviceCodes', 'sourceAgency', 'sourceDecision', 'sourceLabCode',
      'sourceDocument', 'sourceSha256', 'sourceValidFrom', 'sourceValidTo', 'sourcePages',
      'seedVersion', 'sortOrder', 'locked'
    ];
    return fields.every(field => JSON.stringify(a[field] ?? null) === JSON.stringify(b[field] ?? null));
  }

  private async logActivity(action: string, details: string, targetId?: string): Promise<void> {
    try {
      const ref = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`));
      await setDoc(ref, {
        id: ref.id,
        action,
        details,
        targetId: targetId || null,
        timestamp: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        user: this.auth.currentUser()?.displayName || this.auth.currentUser()?.email || this.auth.currentUser()?.uid || 'Hệ thống',
      });
    } catch (error) {
      console.warn('[StandardTagCatalogService] Activity log failed:', error);
    }
  }
}
