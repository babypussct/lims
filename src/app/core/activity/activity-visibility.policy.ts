import type { ActivityAudience, ActivityEvent, ActivityViewerContext } from './activity-event.model';

const AUDIENCE_PERMISSIONS: Record<ActivityAudience, readonly string[]> = {
  RESULT_VIEW: ['sop_view', 'batch_run', 'sop_approve'],
  RESULT_OPERATOR: ['batch_run', 'sop_approve'],
  INVENTORY_VIEW: ['inventory_view', 'inventory_edit'],
  INVENTORY_OPERATOR: ['inventory_edit'],
  STANDARD_VIEW: ['standard_view', 'standard_edit', 'standard_approve', 'standard_log_view'],
  STANDARD_OPERATOR: ['standard_edit', 'standard_approve'],
  SYSTEM_ADMIN: ['user_manage']
};

const ALL_AUDIENCES = Object.freeze(Object.keys(AUDIENCE_PERMISSIONS) as ActivityAudience[]);

function hasAnyPermission(permissions: readonly string[], expected: readonly string[]): boolean {
  return permissions.includes('*') || expected.some(permission => permissions.includes(permission));
}

/** Fail-closed audience resolver shared by ActivityFeedService and rules tests. */
export function resolveAllowedActivityAudiences(context: ActivityViewerContext): ActivityAudience[] {
  if (context.role === 'pending' || context.role === 'viewer') return [];
  if (context.role === 'manager') return [...ALL_AUDIENCES];

  return ALL_AUDIENCES.filter(audience =>
    hasAnyPermission(context.permissions, AUDIENCE_PERMISSIONS[audience])
  );
}

export function canViewActivityEvent(context: ActivityViewerContext, event: Pick<ActivityEvent, 'audience' | 'activityVisible'>): boolean {
  if (!event.activityVisible) return false;
  return resolveAllowedActivityAudiences(context).includes(event.audience);
}

export function canViewAuditEvent(context: ActivityViewerContext, event: Pick<ActivityEvent, 'auditClass'>): boolean {
  if (context.role === 'pending' || context.role === 'viewer') return false;
  if (context.role === 'manager') return true;
  if (event.auditClass === 'SYSTEM') return hasAnyPermission(context.permissions, ['user_manage']);
  return hasAnyPermission(context.permissions, ['report_view']);
}
