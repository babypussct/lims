import type { NotificationChannel, NotificationType } from '../models/notification.model';
import type {
  ActivityAudience,
  ActivityAuditClass,
  ActivityEvent,
  ActivityImportance,
  ActivityModule
} from './activity-event.model';

export interface ActivityActionDefinition {
  action: string;
  module: ActivityModule;
  audience: ActivityAudience;
  importance: ActivityImportance;
  auditClass: ActivityAuditClass;
  activityVisible: boolean;
  label: string;
  iconKey: string;
  /**
   * The action may participate in public traceability only when the event
   * also carries a validated request identity. This is an allowlist, not a
   * promise that every event of the action is public.
   */
  publicTraceableAllowed?: boolean;
  defaultActionUrl?: (event: ActivityEvent) => string | undefined;
  aggregation?: {
    enabled: boolean;
    windowMs?: number;
    keyParts?: ('actorUid' | 'targetId' | 'requestId' | 'action')[];
  };
  notification?: {
    mode: 'NONE' | 'WORKFLOW';
    type?: NotificationType;
    suppressActor?: boolean;
    defaultChannels?: NotificationChannel[];
  };
}

const resultUrl = (event: ActivityEvent): string | undefined => {
  const id = event.requestId || event.targetId;
  return id ? `/results/${encodeURIComponent(id)}` : '/results';
};

const requestUrl = (): string => '/requests';

const inventoryUrl = (): string => '/inventory';

const standardUrl = (event: ActivityEvent): string =>
  event.targetId ? `/standards/${encodeURIComponent(event.targetId)}` : '/standards';

const configUrl = (): string => '/settings/system';

const systemUpdateUrl = (event: ActivityEvent): string =>
  typeof event.actionUrl === 'string' && event.actionUrl.startsWith('/') && !event.actionUrl.startsWith('//')
    ? event.actionUrl
    : '/settings/system';

const printingUrl = (): string => '/printing';

const none = (): ActivityActionDefinition['notification'] => ({ mode: 'NONE' });

const workflow = (
  type: NotificationType,
  channels: NotificationChannel[] = ['inbox', 'push'],
  suppressActor = true
): ActivityActionDefinition['notification'] => ({
  mode: 'WORKFLOW',
  type,
  suppressActor,
  defaultChannels: channels
});

type DefinitionInput = Omit<ActivityActionDefinition, 'action' | 'auditClass'> & {
  auditClass?: ActivityAuditClass;
};

function define(action: string, input: DefinitionInput): ActivityActionDefinition {
  return {
    action,
    auditClass: input.module === 'SYSTEM' ? 'SYSTEM' : 'BUSINESS',
    ...input
  };
}

/**
 * Central action registry. Writers must fail closed when an action is absent;
 * module/audience/notification classification must never be inferred from the
 * action string or from the actor's role.
 */
export const ACTIVITY_ACTION_REGISTRY = {
  SAVE_RESULT_DRAFT: define('SAVE_RESULT_DRAFT', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'NORMAL', activityVisible: true,
    label: 'đã lưu nháp kết quả', iconKey: 'save', defaultActionUrl: resultUrl,
    aggregation: { enabled: true, windowMs: 10 * 60_000, keyParts: ['actorUid', 'requestId', 'action'] },
    notification: none()
  }),
  PUBLISH_RESULT_REPORT: define('PUBLISH_RESULT_REPORT', {
    module: 'RESULT', audience: 'RESULT_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã xuất bản báo cáo', iconKey: 'file-circle-check', defaultActionUrl: resultUrl,
    notification: workflow('RESULT_PUBLISHED')
  }),
  REVERT_RESULT_DRAFT: define('REVERT_RESULT_DRAFT', {
    module: 'RESULT', audience: 'RESULT_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã hủy xuất bản báo cáo', iconKey: 'rotate-left', defaultActionUrl: resultUrl,
    notification: workflow('RESULT_REVERTED')
  }),
  RESET_RESULT_DATA: define('RESET_RESULT_DATA', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã reset số liệu kết quả', iconKey: 'trash-arrow-up', defaultActionUrl: resultUrl,
    notification: workflow('RESULT_RESET')
  }),
  RESTORE_RESULT_BACKUP: define('RESTORE_RESULT_BACKUP', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'NORMAL', activityVisible: true,
    label: 'đã khôi phục số liệu lưu trữ', iconKey: 'clock-rotate-left', defaultActionUrl: resultUrl,
    notification: none()
  }),
  RESTORE_RESULT_VERSION: define('RESTORE_RESULT_VERSION', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã khôi phục phiên bản cũ', iconKey: 'code-compare', defaultActionUrl: resultUrl,
    notification: none()
  }),
  RECONCILE_RESULT_STATUS: define('RECONCILE_RESULT_STATUS', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'NORMAL', activityVisible: false,
    label: 'đã đồng bộ trạng thái kết quả', iconKey: 'arrows-rotate', defaultActionUrl: resultUrl,
    notification: none()
  }),
  UNLOCK_RESULT_EDIT: define('UNLOCK_RESULT_EDIT', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã mở khóa chỉnh sửa kết quả', iconKey: 'lock-open', defaultActionUrl: resultUrl,
    notification: none()
  }),
  CREATE_VIRTUAL_MASTER: define('CREATE_VIRTUAL_MASTER', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'NORMAL', activityVisible: true,
    label: 'đã tạo mẻ master ảo', iconKey: 'layer-group', defaultActionUrl: resultUrl,
    publicTraceableAllowed: true, notification: none()
  }),
  DELETE_VIRTUAL_MASTER: define('DELETE_VIRTUAL_MASTER', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã xóa mẻ master ảo', iconKey: 'trash', defaultActionUrl: resultUrl, notification: none()
  }),
  DIRECT_APPROVE: define('DIRECT_APPROVE', {
    module: 'RESULT', audience: 'RESULT_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã duyệt và đưa phiếu vào hàng đợi in', iconKey: 'circle-check', defaultActionUrl: requestUrl,
    publicTraceableAllowed: true,
    notification: workflow('SYSTEM_INFO')
  }),
  DIRECT_APPROVE_PLAN: define('DIRECT_APPROVE_PLAN', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'NORMAL', activityVisible: true,
    label: 'đã duyệt kế hoạch trực tiếp', iconKey: 'list-check', defaultActionUrl: requestUrl,
    publicTraceableAllowed: true, notification: none()
  }),
  APPROVE_REQUEST: define('APPROVE_REQUEST', {
    module: 'RESULT', audience: 'RESULT_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã duyệt yêu cầu', iconKey: 'clipboard-check', defaultActionUrl: requestUrl,
    publicTraceableAllowed: true,
    notification: workflow('REQUEST_APPROVED')
  }),
  REVOKE_APPROVE: define('REVOKE_APPROVE', {
    module: 'RESULT', audience: 'RESULT_VIEW', importance: 'WARNING', activityVisible: true,
    label: 'đã thu hồi phê duyệt', iconKey: 'ban', defaultActionUrl: requestUrl,
    notification: workflow('SYSTEM_INFO')
  }),
  REVOKE_AND_REJECT: define('REVOKE_AND_REJECT', {
    module: 'RESULT', audience: 'RESULT_VIEW', importance: 'WARNING', activityVisible: true,
    label: 'đã thu hồi và từ chối yêu cầu', iconKey: 'circle-xmark', defaultActionUrl: requestUrl,
    notification: workflow('REQUEST_REJECTED')
  }),
  EDIT_REQUEST: define('EDIT_REQUEST', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'NORMAL', activityVisible: true,
    label: 'đã chỉnh sửa phiếu yêu cầu', iconKey: 'pen-to-square', defaultActionUrl: requestUrl,
    publicTraceableAllowed: true,
    notification: none()
  }),
  DAILY_CHECK_ITEM: define('DAILY_CHECK_ITEM', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'NORMAL', activityVisible: true,
    label: 'đã đánh dấu kiểm tra mẫu', iconKey: 'list-check', defaultActionUrl: resultUrl,
    notification: none()
  }),
  DAILY_UNCHECK_ITEM: define('DAILY_UNCHECK_ITEM', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã bỏ đánh dấu kiểm tra mẫu', iconKey: 'list-check', defaultActionUrl: resultUrl,
    notification: none()
  }),
  DAILY_CHECK_BULK: define('DAILY_CHECK_BULK', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'NORMAL', activityVisible: true,
    label: 'đã đánh dấu kiểm tra mẫu hàng loạt', iconKey: 'list-check', defaultActionUrl: resultUrl,
    notification: none()
  }),
  DAILY_UNCHECK_BULK: define('DAILY_UNCHECK_BULK', {
    module: 'RESULT', audience: 'RESULT_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã bỏ đánh dấu kiểm tra mẫu hàng loạt', iconKey: 'list-check', defaultActionUrl: resultUrl,
    notification: none()
  }),

  CREATE_ITEM: define('CREATE_ITEM', {
    module: 'INVENTORY', audience: 'INVENTORY_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã tạo vật tư', iconKey: 'box', defaultActionUrl: inventoryUrl, notification: none()
  }),
  UPDATE_INFO: define('UPDATE_INFO', {
    module: 'INVENTORY', audience: 'INVENTORY_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã cập nhật vật tư', iconKey: 'pen', defaultActionUrl: inventoryUrl, notification: none()
  }),
  STOCK_IN: define('STOCK_IN', {
    module: 'INVENTORY', audience: 'INVENTORY_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã nhập kho', iconKey: 'arrow-down', defaultActionUrl: inventoryUrl,
    aggregation: { enabled: true, windowMs: 5 * 60_000, keyParts: ['actorUid', 'targetId', 'action'] }, notification: none()
  }),
  STOCK_OUT: define('STOCK_OUT', {
    module: 'INVENTORY', audience: 'INVENTORY_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã xuất kho', iconKey: 'arrow-up', defaultActionUrl: inventoryUrl,
    aggregation: { enabled: true, windowMs: 5 * 60_000, keyParts: ['actorUid', 'targetId', 'action'] }, notification: none()
  }),
  SOFT_DELETE_ITEM: define('SOFT_DELETE_ITEM', {
    module: 'INVENTORY', audience: 'INVENTORY_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã đưa vật tư vào thùng rác', iconKey: 'trash', defaultActionUrl: inventoryUrl, notification: none()
  }),
  RESTORE_ITEM: define('RESTORE_ITEM', {
    module: 'INVENTORY', audience: 'INVENTORY_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã khôi phục vật tư', iconKey: 'trash-arrow-up', defaultActionUrl: inventoryUrl, notification: none()
  }),
  BULK_ZERO: define('BULK_ZERO', {
    module: 'INVENTORY', audience: 'INVENTORY_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã đặt tồn kho hàng loạt về 0', iconKey: 'boxes-stacked', defaultActionUrl: inventoryUrl,
    notification: workflow('STOCK_LOW_ALERT')
  }),
  INVENTORY_LOW_STOCK: define('INVENTORY_LOW_STOCK', {
    module: 'INVENTORY', audience: 'INVENTORY_VIEW', importance: 'WARNING', activityVisible: true,
    label: 'có vật tư sắp hết', iconKey: 'triangle-exclamation', defaultActionUrl: inventoryUrl,
    notification: workflow('STOCK_LOW_ALERT')
  }),

  CREATE_STANDARD: define('CREATE_STANDARD', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã tạo chất chuẩn', iconKey: 'vial', defaultActionUrl: standardUrl, notification: none()
  }),
  UPDATE_STANDARD: define('UPDATE_STANDARD', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã cập nhật chất chuẩn', iconKey: 'pen', defaultActionUrl: standardUrl, notification: none()
  }),
  UPDATE_STOCK: define('UPDATE_STOCK', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã cập nhật tồn chất chuẩn', iconKey: 'scale-balanced', defaultActionUrl: standardUrl,
    aggregation: { enabled: true, windowMs: 5 * 60_000, keyParts: ['actorUid', 'targetId', 'action'] }, notification: none()
  }),
  STANDARD_LOW_STOCK: define('STANDARD_LOW_STOCK', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'WARNING', activityVisible: true,
    label: 'có chất chuẩn sắp hết', iconKey: 'triangle-exclamation', defaultActionUrl: standardUrl,
    notification: workflow('STOCK_LOW_ALERT')
  }),
  RESTORE_STANDARD: define('RESTORE_STANDARD', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã khôi phục chất chuẩn', iconKey: 'trash-arrow-up', defaultActionUrl: standardUrl, notification: none()
  }),
  SOFT_DELETE_BATCH: define('SOFT_DELETE_BATCH', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã xóa lô chất chuẩn', iconKey: 'trash', defaultActionUrl: standardUrl, notification: none()
  }),
  BULK_UPDATE_STANDARD_TAGS: define('BULK_UPDATE_STANDARD_TAGS', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã cập nhật nhãn chất chuẩn hàng loạt', iconKey: 'tags', defaultActionUrl: standardUrl, notification: none()
  }),
  NORMALIZE_STANDARD_NAMES: define('NORMALIZE_STANDARD_NAMES', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã chuẩn hóa tên chất chuẩn', iconKey: 'wand-magic-sparkles', defaultActionUrl: standardUrl, notification: none()
  }),
  UNDO_NORMALIZE_STANDARD_NAMES: define('UNDO_NORMALIZE_STANDARD_NAMES', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã hoàn tác chuẩn hóa tên chất chuẩn', iconKey: 'rotate-left', defaultActionUrl: standardUrl, notification: none()
  }),
  RELEASE_STANDARD_INTERNAL_ID: define('RELEASE_STANDARD_INTERNAL_ID', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã giải phóng mã nội bộ chất chuẩn', iconKey: 'key', defaultActionUrl: standardUrl, notification: none()
  }),
  IMPORT_STANDARDS: define('IMPORT_STANDARDS', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã nhập dữ liệu chất chuẩn', iconKey: 'file-import', defaultActionUrl: standardUrl, notification: none()
  }),
  IMPORT_STANDARD_USAGE_LOGS: define('IMPORT_STANDARD_USAGE_LOGS', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã nhập nhật ký sử dụng chất chuẩn', iconKey: 'file-import', defaultActionUrl: standardUrl, notification: none()
  }),
  REQUEST_COA: define('REQUEST_COA', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã yêu cầu bổ sung CoA', iconKey: 'file-circle-question', defaultActionUrl: standardUrl,
    notification: workflow('COA_REQUEST')
  }),
  UPLOAD_STANDARD_COA: define('UPLOAD_STANDARD_COA', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã cập nhật CoA', iconKey: 'file-arrow-up', defaultActionUrl: standardUrl,
    notification: workflow('SYSTEM_INFO')
  }),
  REQUEST_STANDARD: define('REQUEST_STANDARD', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã yêu cầu mượn chuẩn', iconKey: 'hand', defaultActionUrl: standardUrl,
    notification: workflow('BORROW_REQUEST')
  }),
  CREATE_STANDARD_REQUEST: define('CREATE_STANDARD_REQUEST', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã yêu cầu mượn chuẩn', iconKey: 'hand', defaultActionUrl: standardUrl,
    notification: workflow('BORROW_REQUEST')
  }),
  UPDATE_STANDARD_REQUEST: define('UPDATE_STANDARD_REQUEST', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã cập nhật yêu cầu chất chuẩn', iconKey: 'pen-to-square', defaultActionUrl: standardUrl, notification: none()
  }),
  ASSIGN_STANDARD: define('ASSIGN_STANDARD', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã gán chuẩn cho mượn', iconKey: 'user-tag', defaultActionUrl: standardUrl,
    notification: workflow('REQUEST_APPROVED')
  }),
  APPROVE_STANDARD_REQUEST: define('APPROVE_STANDARD_REQUEST', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã duyệt mượn chuẩn', iconKey: 'circle-check', defaultActionUrl: standardUrl,
    notification: workflow('REQUEST_APPROVED')
  }),
  REJECT_STANDARD_REQUEST: define('REJECT_STANDARD_REQUEST', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'WARNING', activityVisible: true,
    label: 'đã từ chối mượn chuẩn', iconKey: 'circle-xmark', defaultActionUrl: standardUrl,
    notification: workflow('REQUEST_REJECTED')
  }),
  REPORT_RETURN_STANDARD: define('REPORT_RETURN_STANDARD', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã báo cáo trả chuẩn', iconKey: 'reply', defaultActionUrl: standardUrl,
    notification: workflow('STANDARD_RETURN_PENDING')
  }),
  RETURN_STANDARD: define('RETURN_STANDARD', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã nhận lại chuẩn', iconKey: 'rotate-left', defaultActionUrl: standardUrl,
    notification: workflow('SYSTEM_INFO')
  }),
  LOG_USAGE_STANDARD: define('LOG_USAGE_STANDARD', {
    module: 'STANDARD', audience: 'STANDARD_VIEW', importance: 'NORMAL', activityVisible: true,
    label: 'đã khai báo sử dụng chuẩn', iconKey: 'droplet', defaultActionUrl: standardUrl,
    aggregation: { enabled: true, windowMs: 5 * 60_000, keyParts: ['actorUid', 'targetId', 'action'] }, notification: none()
  }),
  BACKFILL_USAGE_LOG: define('BACKFILL_USAGE_LOG', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã nhập bù hồ sơ mượn chuẩn', iconKey: 'clock-rotate-left', defaultActionUrl: standardUrl, notification: none()
  }),
  DELETE_USAGE_LOG: define('DELETE_USAGE_LOG', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã hoàn tác nhật ký sử dụng chuẩn', iconKey: 'trash-arrow-up', defaultActionUrl: standardUrl, notification: none()
  }),
  HARD_DELETE_REQUEST: define('HARD_DELETE_REQUEST', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'WARNING', activityVisible: true,
    label: 'đã xóa vĩnh viễn yêu cầu chất chuẩn', iconKey: 'trash-can', defaultActionUrl: standardUrl, notification: none()
  }),
  CREATE_STANDARD_TAG: define('CREATE_STANDARD_TAG', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'NORMAL', activityVisible: false,
    label: 'đã tạo nhãn danh mục chuẩn', iconKey: 'tag', defaultActionUrl: standardUrl, notification: none()
  }),
  UPDATE_STANDARD_TAG: define('UPDATE_STANDARD_TAG', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'NORMAL', activityVisible: false,
    label: 'đã cập nhật nhãn danh mục chuẩn', iconKey: 'tag', defaultActionUrl: standardUrl, notification: none()
  }),
  SOFT_DELETE_STANDARD_TAG: define('SOFT_DELETE_STANDARD_TAG', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã ẩn nhãn danh mục chuẩn', iconKey: 'tag', defaultActionUrl: standardUrl, notification: none()
  }),
  RESTORE_STANDARD_TAG: define('RESTORE_STANDARD_TAG', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã khôi phục nhãn danh mục chuẩn', iconKey: 'tag', defaultActionUrl: standardUrl, notification: none()
  }),
  IMPORT_ACCREDITATION_TAG_SEED: define('IMPORT_ACCREDITATION_TAG_SEED', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: false,
    label: 'đã import seed nhãn công nhận', iconKey: 'seedling', defaultActionUrl: standardUrl, notification: none()
  }),
  ARCHIVE_ACCREDITATION_TAG_SEED: define('ARCHIVE_ACCREDITATION_TAG_SEED', {
    module: 'STANDARD', audience: 'STANDARD_OPERATOR', importance: 'IMPORTANT', activityVisible: false,
    label: 'đã lưu trữ seed nhãn công nhận', iconKey: 'box-archive', defaultActionUrl: standardUrl, notification: none()
  }),

  MAINTENANCE_ON: define('MAINTENANCE_ON', {
    module: 'SYSTEM', audience: 'SYSTEM_ADMIN', importance: 'WARNING', activityVisible: true,
    label: 'đã bật chế độ bảo trì', iconKey: 'screwdriver-wrench', defaultActionUrl: configUrl,
    notification: workflow('SYSTEM_UPDATE')
  }),
  MAINTENANCE_OFF: define('MAINTENANCE_OFF', {
    module: 'SYSTEM', audience: 'SYSTEM_ADMIN', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã tắt chế độ bảo trì', iconKey: 'power-off', defaultActionUrl: configUrl,
    notification: workflow('SYSTEM_UPDATE')
  }),
  POST_SYSTEM_UPDATE: define('POST_SYSTEM_UPDATE', {
    module: 'SYSTEM', audience: 'SYSTEM_ADMIN', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã đăng thông báo hệ thống', iconKey: 'bullhorn', defaultActionUrl: systemUpdateUrl,
    notification: workflow('SYSTEM_UPDATE')
  }),
  SHOW_LOCKED_ON: define('SHOW_LOCKED_ON', {
    module: 'SYSTEM', audience: 'SYSTEM_ADMIN', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã bật hiển thị tính năng khóa', iconKey: 'eye', defaultActionUrl: configUrl, notification: none()
  }),
  SHOW_LOCKED_OFF: define('SHOW_LOCKED_OFF', {
    module: 'SYSTEM', audience: 'SYSTEM_ADMIN', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã tắt hiển thị tính năng khóa', iconKey: 'eye-slash', defaultActionUrl: configUrl, notification: none()
  }),
  BACKUP_CREATE: define('BACKUP_CREATE', {
    module: 'SYSTEM', audience: 'SYSTEM_ADMIN', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã tạo backup toàn diện', iconKey: 'cloud-arrow-up', defaultActionUrl: configUrl, notification: none()
  }),
  BACKUP_VERIFY: define('BACKUP_VERIFY', {
    module: 'SYSTEM', audience: 'SYSTEM_ADMIN', importance: 'IMPORTANT', activityVisible: true,
    label: 'đã kiểm tra integrity backup', iconKey: 'shield-check', defaultActionUrl: configUrl, notification: none()
  }),
  BACKUP_RESTORE: define('BACKUP_RESTORE', {
    module: 'SYSTEM', audience: 'SYSTEM_ADMIN', importance: 'WARNING', activityVisible: true,
    label: 'đã restore từ backup', iconKey: 'cloud-arrow-down', defaultActionUrl: configUrl, notification: none()
  }),

  PRINT: define('PRINT', {
    module: 'RESULT', audience: 'RESULT_VIEW', importance: 'NORMAL', activityVisible: false,
    label: 'đã tạo hồ sơ in', iconKey: 'print', defaultActionUrl: printingUrl, notification: none()
  }),
  PRINT_JOB_RECORD: define('PRINT_JOB_RECORD', {
    module: 'RESULT', audience: 'RESULT_VIEW', importance: 'NORMAL', activityVisible: false,
    label: 'hồ sơ in ấn lưu trữ', iconKey: 'print', defaultActionUrl: printingUrl, notification: none()
  })
} satisfies Record<string, ActivityActionDefinition>;

export type ActivityAction = keyof typeof ACTIVITY_ACTION_REGISTRY;

export function isRegisteredActivityAction(action: string): action is ActivityAction {
  return Object.prototype.hasOwnProperty.call(ACTIVITY_ACTION_REGISTRY, action);
}

export function getActivityActionDefinition(action: string): ActivityActionDefinition {
  if (!isRegisteredActivityAction(action)) {
    throw new Error(`Unregistered activity action: ${action}`);
  }
  return ACTIVITY_ACTION_REGISTRY[action];
}

export function canBePublicTraceableActivityAction(action: string): boolean {
  return isRegisteredActivityAction(action)
    && ACTIVITY_ACTION_REGISTRY[action].publicTraceableAllowed === true;
}

export function resolveDefaultActivityActionUrl(event: ActivityEvent): string | undefined {
  return getActivityActionDefinition(event.action).defaultActionUrl?.(event);
}
