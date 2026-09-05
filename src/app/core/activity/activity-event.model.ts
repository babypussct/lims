export type ActivityModule =
  | 'RESULT'
  | 'INVENTORY'
  | 'STANDARD'
  | 'DUTY'
  | 'SYSTEM';

export type ActivityAudience =
  | 'RESULT_VIEW'
  | 'RESULT_OPERATOR'
  | 'INVENTORY_VIEW'
  | 'INVENTORY_OPERATOR'
  | 'STANDARD_VIEW'
  | 'STANDARD_OPERATOR'
  | 'DUTY_OPERATOR'
  | 'SYSTEM_ADMIN';

export type ActivityImportance = 'NORMAL' | 'IMPORTANT' | 'WARNING';

export type ActivityAuditClass = 'BUSINESS' | 'SYSTEM';

/**
 * Canonical V2 activity/audit event persisted in artifacts/{appId}/logs.
 *
 * `user`, `printable`, and `printJobId` are intentionally retained during the
 * compatibility window so legacy Dashboard/Statistics/Print consumers can
 * continue reading new writes before their readers are migrated.
 */
export interface ActivityEvent {
  id: string;
  eventId: string;
  schemaVersion: 2;

  action: string;
  module: ActivityModule;
  audience: ActivityAudience;
  importance: ActivityImportance;
  auditClass: ActivityAuditClass;
  activityVisible: boolean;

  actorUid: string;
  actorName: string;

  targetType?: string;
  targetId?: string;
  targetName?: string;
  requestId?: string;

  actionUrl?: string;
  details: string;
  metadata?: Record<string, unknown>;

  timestamp: unknown;
  lastUpdated?: unknown;

  publicTraceable?: boolean;

  // Compatibility fields used by legacy readers during rollout.
  user: string;
  printable?: boolean;
  printJobId?: string;
}

export interface ActivityViewerContext {
  role: 'manager' | 'staff' | 'viewer' | 'pending';
  permissions: readonly string[];
}
