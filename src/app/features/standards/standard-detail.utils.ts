import { ReferenceStandard } from '../../core/models/standard.model';
import { canAssign, parseStandardDate } from '../../shared/utils/standard-fefo';
import { formatNum, getStandardStatus } from '../../shared/utils/utils';

export function readStandardText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
}

export function standardText(value: unknown, fallback = 'Chưa ghi nhận'): string {
  return readStandardText(value) || fallback;
}

export function standardTextList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(readStandardText).filter(Boolean) : [];
}

export function parseStandardAmount(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !value.trim()) return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function hasStandardAmount(value: unknown): boolean {
  const amount = parseStandardAmount(value);
  return amount !== null && amount >= 0;
}

export function standardAmountText(value: unknown): string {
  if (value == null || (typeof value === 'string' && !value.trim())) return 'Chưa ghi nhận';
  const amount = parseStandardAmount(value);
  return amount !== null && amount >= 0 ? formatNum(amount) : 'Lượng không hợp lệ';
}

export function standardDateState(value: unknown): { kind: 'missing' | 'invalid' | 'valid'; timestamp: number | null } {
  if (value == null || (typeof value === 'string' && !value.trim())) return { kind: 'missing', timestamp: null };
  const timestamp = typeof value === 'string' ? parseStandardDate(value.trim()) : null;
  return { kind: timestamp === null ? 'invalid' : 'valid', timestamp };
}

export function standardDateText(value: unknown): string {
  const date = standardDateState(value);
  if (date.kind === 'missing') return 'Chưa ghi nhận';
  if (date.timestamp === null) return 'Ngày không hợp lệ — cần kiểm tra';
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date.timestamp);
}

export function standardStockPercentage(std: ReferenceStandard): number | null {
  const current = parseStandardAmount(std.current_amount);
  const initial = parseStandardAmount(std.initial_amount);
  if (current === null || initial === null || current < 0 || initial <= 0 || current > initial) return null;
  return current / initial * 100;
}

export function canAssignDetailStandard(std: ReferenceStandard): boolean {
  const current = parseStandardAmount(std.current_amount);
  return current !== null && current > 0 && !!readStandardText(std.unit)
    && canAssign({ ...std, current_amount: current, expiry_date: readStandardText(std.expiry_date) });
}

export function canPurchaseDetailStandard(std: ReferenceStandard): boolean {
  return std.status === 'DEPLETED' || parseStandardAmount(std.current_amount) === 0;
}

export function detailStandardStatus(std: ReferenceStandard): ReturnType<typeof getStandardStatus> {
  const amount = parseStandardAmount(std.current_amount);
  const initial = parseStandardAmount(std.initial_amount);
  const normalized = {
    ...std,
    current_amount: amount !== null && amount >= 0 ? amount : Number.NaN,
    initial_amount: initial !== null && initial > 0 ? initial : (amount || 1),
    expiry_date: readStandardText(std.expiry_date),
    current_holder: readStandardText(std.current_holder),
    current_request_id: readStandardText(std.current_request_id),
  };
  const unresolvedRequest = std.has_pending_request && !normalized.current_holder && !normalized.current_request_id;
  if (std.status === 'IN_USE' || std.status === 'DEPLETED' || unresolvedRequest || amount === 0) return getStandardStatus(normalized);
  const neutralClass = 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
  if (!hasStandardAmount(std.current_amount)) return {
    label: standardAmountText(std.current_amount) === 'Chưa ghi nhận' ? 'Chưa rõ lượng' : 'Lượng không hợp lệ',
    class: neutralClass,
  };
  if (!readStandardText(std.unit)) return { label: 'Chưa rõ đơn vị', class: neutralClass };
  return getStandardStatus(normalized);
}

export function standardDataIssues(std: ReferenceStandard): string[] {
  const issues: string[] = [];
  if (!readStandardText(std.name)) issues.push('Tên chất chuẩn');
  if (!readStandardText(std.internal_id) && std.lifecycle_status !== 'RELEASED' && std.lifecycle_status !== 'CLOSED') issues.push('Mã nội bộ');
  if (!readStandardText(std.lot_number)) issues.push('Số lô');
  if (!hasStandardAmount(std.current_amount)) issues.push('Lượng hiện tại');
  if (!hasStandardAmount(std.initial_amount)) issues.push('Lượng ban đầu');
  const current = parseStandardAmount(std.current_amount);
  const initial = parseStandardAmount(std.initial_amount);
  if (current !== null && initial !== null && current > initial) issues.push('Lượng hiện tại lớn hơn lượng ban đầu');
  if (!readStandardText(std.unit)) issues.push('Đơn vị');
  if (standardDateState(std.expiry_date).kind !== 'valid') issues.push('Hạn sử dụng');
  if (standardDateState(std.received_date).kind === 'invalid') issues.push('Ngày nhận không hợp lệ');
  if (standardDateState(std.date_opened).kind === 'invalid') issues.push('Ngày mở nắp không hợp lệ');
  if (!readStandardText(std.storage_condition)) issues.push('Điều kiện bảo quản');
  if (!readStandardText(std.location)) issues.push('Vị trí lưu trữ');
  return issues;
}
