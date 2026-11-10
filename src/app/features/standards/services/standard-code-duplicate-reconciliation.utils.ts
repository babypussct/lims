import { ReferenceStandard, StandardCodeRegistry } from '../../../core/models/standard.model';
import {
  hasUnreleasedCodeLifecycle,
  isSpecialInternalId,
  isStandardVisibleInCatalogue,
  isValidInternalId,
  normalizeInternalId,
} from '../../../shared/utils/standard-internal-id';

export interface HiddenDuplicateCodeCase {
  internalId: string;
  unreleasedCount: number;
  oldStandard?: ReferenceStandard;
  newStandard?: ReferenceStandard;
  registry?: StandardCodeRegistry;
  status: 'READY' | 'BLOCKED';
  reason: string;
}

/**
 * Evaluate the physical-code collision, not the number of sync issue rows.
 * Only an unambiguous hidden/visible pair may be reconciled. This predicate
 * is used both in the preview and again on freshly read transaction data.
 */
export function assessHiddenDuplicateCode(
  internalId: string,
  standards: readonly ReferenceStandard[],
  registry: StandardCodeRegistry | undefined,
  openRequestIds: ReadonlySet<string> = new Set(),
): HiddenDuplicateCodeCase {
  const code = normalizeInternalId(internalId);
  const current = standards.filter(record =>
    normalizeInternalId(record.internal_id) === code && hasUnreleasedCodeLifecycle(record),
  );
  const blocked = (reason: string, oldStandard?: ReferenceStandard, newStandard?: ReferenceStandard): HiddenDuplicateCodeCase => ({
    internalId: code, unreleasedCount: current.length, oldStandard, newStandard, registry, status: 'BLOCKED', reason,
  });

  if (!isValidInternalId(code) || isSpecialInternalId(code)) return blocked('Không phải mã vật lý được phép đối soát.');
  if (current.length !== 2) return blocked(`Có ${current.length} hồ sơ chưa trả mã; chỉ xử lý được đúng một cặp cũ/mới.`);

  const oldRecords = current.filter(record => !isStandardVisibleInCatalogue(record));
  const newRecords = current.filter(isStandardVisibleInCatalogue);
  if (oldRecords.length !== 1 || newRecords.length !== 1) {
    return blocked('Không xác định duy nhất một hồ sơ trong thùng rác và một hồ sơ đang hiển thị.');
  }
  const oldStandard = oldRecords[0];
  const newStandard = newRecords[0];
  if (oldStandard.id === newStandard.id) return blocked('Hai hồ sơ có cùng định danh kỹ thuật.', oldStandard, newStandard);
  if (oldStandard.internal_id !== code || newStandard.internal_id !== code) {
    return blocked('Mã của hồ sơ chưa được chuẩn hóa; cần đồng bộ dữ liệu trước.', oldStandard, newStandard);
  }
  if ((oldStandard.lifecycle_status && oldStandard.lifecycle_status !== 'ACTIVE') ||
      (newStandard.lifecycle_status && newStandard.lifecycle_status !== 'ACTIVE')) {
    return blocked('Trạng thái vòng đời không còn là đang hoạt động.', oldStandard, newStandard);
  }
  if (oldStandard.status === 'IN_USE' || oldStandard.current_holder || oldStandard.current_holder_uid ||
      oldStandard.current_request_id || oldStandard.has_pending_request || openRequestIds.has(oldStandard.id)) {
    return blocked('Hồ sơ cũ còn người giữ, yêu cầu mượn hoặc quy trình đang mở.', oldStandard, newStandard);
  }
  if (!registry || registry.id !== code || registry.internal_id !== code || registry.status !== 'ASSIGNED' ||
      (registry.currentStandardId !== oldStandard.id && registry.currentStandardId !== newStandard.id)) {
    return blocked('Sổ mã không xác nhận quyền sở hữu của một trong hai hồ sơ; cần kiểm tra thủ công.', oldStandard, newStandard);
  }
  return {
    internalId: code, unreleasedCount: 2, oldStandard, newStandard, registry,
    status: 'READY', reason: 'Có thể đóng vòng đời hồ sơ cũ và xác nhận hồ sơ mới là chủ mã.',
  };
}

export function listHiddenDuplicateCodeCases(
  standards: readonly ReferenceStandard[],
  registries: readonly StandardCodeRegistry[],
  openRequestIds: ReadonlySet<string>,
): HiddenDuplicateCodeCase[] {
  const byCode = new Map<string, ReferenceStandard[]>();
  for (const standard of standards) {
    const code = normalizeInternalId(standard.internal_id);
    if (!isValidInternalId(code) || isSpecialInternalId(code) || !hasUnreleasedCodeLifecycle(standard)) continue;
    byCode.set(code, [...(byCode.get(code) || []), standard]);
  }
  const result: HiddenDuplicateCodeCase[] = [];
  for (const [code, records] of byCode) {
    if (records.length < 2) continue;
    const associatedRegistries = registries.filter(item => normalizeInternalId(item.id) === code &&
      item.migrationStatus !== 'MIGRATED');
    const canonical = associatedRegistries.length === 1 ? associatedRegistries[0] : undefined;
    result.push(assessHiddenDuplicateCode(code, records, canonical, openRequestIds));
  }
  return result.sort((a, b) => a.internalId.localeCompare(b.internalId, 'vi', { numeric: true }));
}
