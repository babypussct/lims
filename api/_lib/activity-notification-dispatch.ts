export type DispatchModule = 'RESULT' | 'INVENTORY' | 'STANDARD' | 'SYSTEM';
export type DispatchAudience =
  | 'RESULT_VIEW' | 'RESULT_OPERATOR'
  | 'INVENTORY_VIEW' | 'INVENTORY_OPERATOR'
  | 'STANDARD_VIEW' | 'STANDARD_OPERATOR'
  | 'SYSTEM_ADMIN';
export type DispatchNotificationType =
  | 'COA_REQUEST'
  | 'BORROW_REQUEST'
  | 'REQUEST_APPROVED'
  | 'REQUEST_REJECTED'
  | 'RETURN_OVERDUE'
  | 'STOCK_LOW_ALERT'
  | 'SYSTEM_INFO'
  | 'SYSTEM_UPDATE'
  | 'RESULT_PUBLISHED'
  | 'RESULT_RESET'
  | 'RESULT_REVERTED'
  | 'STANDARD_RETURN_PENDING';

export type DispatchRecipientStrategy =
  | 'RESULT_STAKEHOLDERS'
  | 'STANDARD_APPROVERS'
  | 'STANDARD_REQUESTER'
  | 'STANDARD_COA_REQUESTERS'
  | 'INVENTORY_OPERATORS'
  | 'SYSTEM_ADMINS'
  | 'SYSTEM_ALL_USERS';

export interface ActivityDispatchContract {
  module: DispatchModule;
  audience: DispatchAudience;
  type: DispatchNotificationType;
  channels: readonly ('inbox' | 'push')[];
  suppressActor: boolean;
  recipientStrategy: DispatchRecipientStrategy;
  actorPermissionsAny: readonly string[];
  managerOnly: boolean;
}

export interface CanonicalDispatchEvent {
  eventId?: unknown;
  schemaVersion?: unknown;
  action?: unknown;
  module?: unknown;
  audience?: unknown;
  actorUid?: unknown;
  actorName?: unknown;
  targetType?: unknown;
  targetId?: unknown;
  targetName?: unknown;
  requestId?: unknown;
  actionUrl?: unknown;
  details?: unknown;
  activityVisible?: unknown;
}

const workflow = (
  module: DispatchModule,
  audience: DispatchAudience,
  type: DispatchNotificationType,
  recipientStrategy: DispatchRecipientStrategy,
  actorPermissionsAny: readonly string[],
  managerOnly = false
): ActivityDispatchContract => ({
  module,
  audience,
  type,
  channels: ['inbox', 'push'],
  suppressActor: true,
  recipientStrategy,
  actorPermissionsAny,
  managerOnly
});

/**
 * Server-side allowlist for the notification projection of canonical events.
 * The frontend registry is still the product source of truth; a contract test
 * compares every WORKFLOW entry against this security boundary so drift fails CI.
 */
export const ACTIVITY_NOTIFICATION_DISPATCH_CONTRACT = {
  PUBLISH_RESULT_REPORT: workflow('RESULT', 'RESULT_VIEW', 'RESULT_PUBLISHED', 'RESULT_STAKEHOLDERS', ['batch_run', 'sop_approve']),
  REVERT_RESULT_DRAFT: workflow('RESULT', 'RESULT_VIEW', 'RESULT_REVERTED', 'RESULT_STAKEHOLDERS', ['batch_run', 'sop_approve']),
  RESET_RESULT_DATA: workflow('RESULT', 'RESULT_OPERATOR', 'RESULT_RESET', 'RESULT_STAKEHOLDERS', ['batch_run', 'sop_approve']),
  DIRECT_APPROVE: workflow('RESULT', 'RESULT_VIEW', 'SYSTEM_INFO', 'RESULT_STAKEHOLDERS', ['sop_approve']),
  APPROVE_REQUEST: workflow('RESULT', 'RESULT_VIEW', 'REQUEST_APPROVED', 'RESULT_STAKEHOLDERS', ['sop_approve']),
  REVOKE_APPROVE: workflow('RESULT', 'RESULT_VIEW', 'SYSTEM_INFO', 'RESULT_STAKEHOLDERS', ['sop_approve']),
  REVOKE_AND_REJECT: workflow('RESULT', 'RESULT_VIEW', 'REQUEST_REJECTED', 'RESULT_STAKEHOLDERS', ['sop_approve']),

  BULK_ZERO: workflow('INVENTORY', 'INVENTORY_OPERATOR', 'STOCK_LOW_ALERT', 'INVENTORY_OPERATORS', ['inventory_edit']),
  INVENTORY_LOW_STOCK: workflow('INVENTORY', 'INVENTORY_VIEW', 'STOCK_LOW_ALERT', 'INVENTORY_OPERATORS', ['inventory_edit']),

  REQUEST_COA: workflow('STANDARD', 'STANDARD_VIEW', 'COA_REQUEST', 'STANDARD_APPROVERS', ['standard_request']),
  REQUEST_STANDARD: workflow('STANDARD', 'STANDARD_VIEW', 'BORROW_REQUEST', 'STANDARD_APPROVERS', ['standard_request']),
  CREATE_STANDARD_REQUEST: workflow('STANDARD', 'STANDARD_VIEW', 'BORROW_REQUEST', 'STANDARD_APPROVERS', ['standard_request']),
  ASSIGN_STANDARD: workflow('STANDARD', 'STANDARD_VIEW', 'REQUEST_APPROVED', 'STANDARD_REQUESTER', ['standard_approve', 'standard_edit']),
  APPROVE_STANDARD_REQUEST: workflow('STANDARD', 'STANDARD_VIEW', 'REQUEST_APPROVED', 'STANDARD_REQUESTER', ['standard_approve', 'standard_edit']),
  REJECT_STANDARD_REQUEST: workflow('STANDARD', 'STANDARD_VIEW', 'REQUEST_REJECTED', 'STANDARD_REQUESTER', ['standard_approve', 'standard_edit']),
  REPORT_RETURN_STANDARD: workflow('STANDARD', 'STANDARD_VIEW', 'STANDARD_RETURN_PENDING', 'STANDARD_APPROVERS', ['standard_request']),
  RETURN_STANDARD: workflow('STANDARD', 'STANDARD_VIEW', 'SYSTEM_INFO', 'STANDARD_REQUESTER', ['standard_approve', 'standard_edit']),
  UPLOAD_STANDARD_COA: workflow('STANDARD', 'STANDARD_VIEW', 'SYSTEM_INFO', 'STANDARD_COA_REQUESTERS', ['standard_edit', 'standard_approve']),
  STANDARD_LOW_STOCK: workflow(
    'STANDARD',
    'STANDARD_VIEW',
    'STOCK_LOW_ALERT',
    'STANDARD_APPROVERS',
    ['standard_request', 'standard_edit', 'standard_approve']
  ),

  MAINTENANCE_ON: workflow('SYSTEM', 'SYSTEM_ADMIN', 'SYSTEM_UPDATE', 'SYSTEM_ADMINS', ['user_manage'], true),
  MAINTENANCE_OFF: workflow('SYSTEM', 'SYSTEM_ADMIN', 'SYSTEM_UPDATE', 'SYSTEM_ADMINS', ['user_manage'], true),
  POST_SYSTEM_UPDATE: workflow('SYSTEM', 'SYSTEM_ADMIN', 'SYSTEM_UPDATE', 'SYSTEM_ALL_USERS', ['user_manage'], true)
} as const satisfies Record<string, ActivityDispatchContract>;

export type DispatchActivityAction = keyof typeof ACTIVITY_NOTIFICATION_DISPATCH_CONTRACT;

export function getActivityDispatchContract(action: unknown): ActivityDispatchContract | null {
  if (typeof action !== 'string') return null;
  return Object.prototype.hasOwnProperty.call(ACTIVITY_NOTIFICATION_DISPATCH_CONTRACT, action)
    ? ACTIVITY_NOTIFICATION_DISPATCH_CONTRACT[action as DispatchActivityAction]
    : null;
}

export function validateCanonicalDispatchEvent(
  documentId: string,
  event: CanonicalDispatchEvent
): { ok: true; action: DispatchActivityAction; contract: ActivityDispatchContract } | { ok: false; reason: string } {
  if (event.schemaVersion !== 2) return { ok: false, reason: 'schemaVersion' };
  if (typeof event.eventId !== 'string' || event.eventId !== documentId) return { ok: false, reason: 'eventId' };
  if (typeof event.actorUid !== 'string' || !event.actorUid.trim()) return { ok: false, reason: 'actorUid' };
  if (typeof event.actorName !== 'string' || !event.actorName.trim() || event.actorName.trim().length > 200) {
    return { ok: false, reason: 'actorName' };
  }
  if (event.activityVisible !== true) return { ok: false, reason: 'activityVisible' };
  const contract = getActivityDispatchContract(event.action);
  if (!contract) return { ok: false, reason: 'notificationPolicy' };
  if (event.module !== contract.module) return { ok: false, reason: 'module' };
  if (event.audience !== contract.audience) return { ok: false, reason: 'audience' };
  if (typeof event.details !== 'string' || !event.details.trim() || event.details.trim().length > 2_000) {
    return { ok: false, reason: 'details' };
  }
  return { ok: true, action: event.action as DispatchActivityAction, contract };
}

export function effectivePermissions(
  userData: Record<string, unknown>,
  rolePermissions: readonly string[] = []
): Set<string> {
  const direct = Array.isArray(userData['permissions']) ? userData['permissions'] : [];
  const custom = Array.isArray(userData['customPermissions']) ? userData['customPermissions'] : [];
  return new Set([...direct, ...custom, ...rolePermissions].filter((item): item is string => typeof item === 'string'));
}

export function userHasAnyPermission(
  userData: Record<string, unknown>,
  rolePermissions: readonly string[],
  required: readonly string[]
): boolean {
  if (userData['role'] === 'manager') return true;
  const permissions = effectivePermissions(userData, rolePermissions);
  return required.some(permission => permissions.has(permission));
}

export function actorMayDispatchContract(
  userData: Record<string, unknown>,
  rolePermissions: readonly string[],
  contract: ActivityDispatchContract
): boolean {
  if (contract.managerOnly && userData['role'] !== 'manager') return false;
  return userHasAnyPermission(userData, rolePermissions, contract.actorPermissionsAny);
}

export function fallbackRolePermissions(roleId: unknown): string[] {
  if (roleId === 'role_staff_default') return ['inventory_view', 'standard_view', 'sop_view', 'recipe_view', 'standard_request'];
  if (roleId === 'role_lab_technician') {
    return ['inventory_view', 'inventory_edit', 'standard_view', 'recipe_view', 'sop_view', 'batch_run', 'standard_request'];
  }
  if (roleId === 'role_qc_lead') {
    return [
      'inventory_view', 'inventory_edit', 'standard_view', 'standard_edit', 'standard_approve',
      'standard_log_view', 'standard_log_delete', 'recipe_view', 'recipe_edit', 'sop_view',
      'sop_edit', 'sop_approve', 'batch_run', 'report_view'
    ];
  }
  return [];
}

export function resultStakeholderUids(requestData: Record<string, unknown>): string[] {
  return uniqueUids([
    requestData['createdByUid'],
    requestData['requesterUid'],
    requestData['requestedByUid'],
    requestData['assignedToUid'],
    requestData['assigneeUid'],
    requestData['ownerUid']
  ]);
}

export function standardRequesterUids(requestData: Record<string, unknown>): string[] {
  return uniqueUids([requestData['requestedBy']]);
}

export function standardCoaRequesterUids(standards: readonly Record<string, unknown>[]): string[] {
  return uniqueUids(standards.map(standard => standard['lastCoaRequestedByUid']));
}

export function suppressActorUid(recipientUids: readonly string[], actorUid: string, suppressActor: boolean): string[] {
  const unique = uniqueUids(recipientUids);
  return suppressActor ? unique.filter(uid => uid !== actorUid) : unique;
}

export function notificationTitleForType(type: DispatchNotificationType): string {
  if (type === 'RESULT_PUBLISHED') return 'Báo cáo kết quả đã xuất bản';
  if (type === 'RESULT_RESET') return 'Dữ liệu kết quả đã được reset';
  if (type === 'RESULT_REVERTED') return 'Báo cáo kết quả đã được hoàn tác';
  if (type === 'COA_REQUEST') return 'Yêu cầu bổ sung CoA';
  if (type === 'BORROW_REQUEST') return 'Yêu cầu mượn chuẩn';
  if (type === 'REQUEST_APPROVED') return 'Yêu cầu được duyệt';
  if (type === 'REQUEST_REJECTED') return 'Yêu cầu bị từ chối';
  if (type === 'STANDARD_RETURN_PENDING') return 'Chuẩn đang chờ nhận trả';
  if (type === 'STOCK_LOW_ALERT') return 'Cảnh báo tồn kho';
  if (type === 'SYSTEM_UPDATE') return 'Thông báo hệ thống';
  return 'Thông báo';
}

export function canonicalDispatchActionUrl(action: DispatchActivityAction, event: CanonicalDispatchEvent): string {
  if (action === 'DIRECT_APPROVE' || action === 'APPROVE_REQUEST' || action === 'REVOKE_APPROVE' || action === 'REVOKE_AND_REJECT') {
    return '/requests';
  }
  const requestId = typeof event.requestId === 'string' ? event.requestId.trim() : '';
  const targetId = typeof event.targetId === 'string' ? event.targetId.trim() : '';
  const module = ACTIVITY_NOTIFICATION_DISPATCH_CONTRACT[action].module;
  if (module === 'RESULT') return requestId || targetId ? `/results/${encodeURIComponent(requestId || targetId)}` : '/results';
  if (module === 'INVENTORY') return '/inventory';
  if (module === 'STANDARD') return targetId ? `/standards/${encodeURIComponent(targetId)}` : '/standards';
  if (action === 'POST_SYSTEM_UPDATE') {
    const configured = typeof event.actionUrl === 'string' ? event.actionUrl.trim() : '';
    return configured.startsWith('/') && !configured.startsWith('//') ? configured : '/config';
  }
  return '/config';
}

function uniqueUids(values: readonly unknown[]): string[] {
  return [...new Set(values
    .filter((value): value is string => typeof value === 'string')
    .map(value => value.trim())
    .filter(Boolean))];
}
