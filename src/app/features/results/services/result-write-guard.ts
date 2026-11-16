import { timestampToDate } from '../../../shared/utils/timestamp';

export type ResultWriteOperation =
  | 'autosave'
  | 'manual_save'
  | 'import'
  | 'publish'
  | 'restore'
  | 'reset'
  | 'unlock'
  | 'delete_master'
  | 'merge'
  | 'acquire_lock';

export type ResultWriteBlockCode =
  | 'no_permission'
  | 'locked_by_others'
  | 'completed'
  | 'publishing'
  | 'missing_run'
  | 'invalid_state';

export interface ResultWriteGuardResult {
  allowed: boolean;
  code?: ResultWriteBlockCode;
  reason?: string;
}

export interface ResultEditCapability {
  isManager?: boolean;
  canRunBatch?: boolean;
  canApprove?: boolean;
  permissions?: readonly string[];
}

export interface EvaluateResultWriteArgs {
  capability: ResultEditCapability;
  userEmail?: string | null;
  run: any;
  draftStatus?: string | null;
  isPublishing?: boolean;
  operation: ResultWriteOperation;
  nowMs?: number;
}

export const RESULT_LOCK_LEASE_MS = 3 * 60 * 1000;

/**
 * Result writes require `batch_run`, matching validBatchRequestUpdate.
 * SOP approval alone only permits worksheet and approval operations.
 */
export function canUserEditResults(capability: ResultEditCapability | null | undefined): boolean {
  if (!capability) return false;
  if (capability.isManager || capability.canRunBatch) return true;
  const perms = capability.permissions || [];
  return perms.includes('*') || perms.includes('batch_run');
}

export function isRunActivelyLockedByOthers(
  run: any,
  userEmail: string | null | undefined,
  nowMs = Date.now()
): boolean {
  const lockedBy = typeof run?.lockedBy === 'string' ? run.lockedBy.trim() : '';
  if (!lockedBy) return false;

  const normalizedUser = typeof userEmail === 'string' ? userEmail.trim().toLowerCase() : '';
  if (normalizedUser && lockedBy.toLowerCase() === normalizedUser) {
    return false;
  }

  if (run?.lastActiveAt) {
    const lastActive = timestampToDate(run.lastActiveAt);
    if (lastActive && (nowMs - lastActive.getTime()) > RESULT_LOCK_LEASE_MS) {
      return false;
    }
  }

  return true;
}

export function evaluateResultWriteGuard(args: EvaluateResultWriteArgs): ResultWriteGuardResult {
  const {
    capability,
    userEmail,
    run,
    draftStatus,
    isPublishing = false,
    operation,
    nowMs = Date.now(),
  } = args;

  if (!canUserEditResults(capability)) {
    return {
      allowed: false,
      code: 'no_permission',
      reason: 'Bạn chỉ có quyền xem, không có quyền chỉnh sửa hoặc xuất bản kết quả phân tích.',
    };
  }

  if (!run && operation !== 'merge') {
    return {
      allowed: false,
      code: 'missing_run',
      reason: 'Không tìm thấy thông tin mẻ phân tích.',
    };
  }

  if (isPublishing && operation !== 'publish') {
    return {
      allowed: false,
      code: 'publishing',
      reason: 'Hệ thống đang xuất bản báo cáo PDF, tạm khóa thay đổi dữ liệu.',
    };
  }

  const effectiveStatus = draftStatus ?? run?.status ?? 'approved';

  if (operation === 'acquire_lock') {
    if (effectiveStatus === 'completed') {
      return {
        allowed: false,
        code: 'completed',
        reason: 'Mẻ đã hoàn thành, cần mở khóa trước khi chỉnh sửa.',
      };
    }
    return { allowed: true };
  }

  if (operation !== 'merge' && isRunActivelyLockedByOthers(run, userEmail, nowMs)) {
    const locker = run?.lockedByName || run?.lockedBy || 'người dùng khác';
    return {
      allowed: false,
      code: 'locked_by_others',
      reason: `Mẻ đang được mở chỉnh sửa bởi ${locker}.`,
    };
  }

  if (operation === 'unlock') {
    if (effectiveStatus !== 'completed') {
      return {
        allowed: false,
        code: 'invalid_state',
        reason: 'Mẻ chạy không ở trạng thái hoàn thành.',
      };
    }
    return { allowed: true };
  }

  if (operation === 'delete_master') {
    if (!run?.isVirtualMaster) {
      return {
        allowed: false,
        code: 'invalid_state',
        reason: 'Chỉ được gỡ gộp đối với mẻ tổng hợp.',
      };
    }
    return { allowed: true };
  }

  if (
    (operation === 'autosave' || operation === 'manual_save' || operation === 'import' || operation === 'publish')
    && effectiveStatus === 'completed'
  ) {
    return {
      allowed: false,
      code: 'completed',
      reason: 'Mẻ đã hoàn thành và khóa sửa. Dùng "Mở khóa và chỉnh sửa" để tạo thay đổi mới.',
    };
  }

  return { allowed: true };
}
