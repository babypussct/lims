export const PERMISSIONS = {
  INVENTORY_VIEW: 'inventory_view',
  INVENTORY_EDIT: 'inventory_edit',
  STANDARD_VIEW: 'standard_view',
  STANDARD_EDIT: 'standard_edit',
  STANDARD_APPROVE: 'standard_approve',
  STANDARD_LOG_VIEW: 'standard_log_view',
  STANDARD_LOG_DELETE: 'standard_log_delete',
  RECIPE_VIEW: 'recipe_view',
  RECIPE_EDIT: 'recipe_edit',
  SOP_VIEW: 'sop_view',
  SOP_EDIT: 'sop_edit',
  SOP_APPROVE: 'sop_approve',
  BATCH_RUN: 'batch_run',
  REPORT_VIEW: 'report_view',
  DUTY_MANAGE: 'duty_manage',
  USER_MANAGE: 'user_manage',
  STANDARD_REQUEST: 'standard_request',
  BYPASS_MAINTENANCE: 'bypass_maintenance',
  SYSTEM_MANAGE: 'system_manage',
  MASTER_DATA_MANAGE: 'master_data_manage',
  POLICY_MANAGE: 'policy_manage',
  BACKUP_CREATE: 'backup_create',
  BACKUP_VERIFY: 'backup_verify',
  BACKUP_RESTORE: 'backup_restore',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type PermissionRisk = 'normal' | 'elevated' | 'high' | 'critical';

export type PermissionDefinition = {
  code: PermissionCode;
  label: string;
  description: string;
  group: 'inventory' | 'standards' | 'sop' | 'reporting' | 'system' | 'master-data' | 'policy' | 'backup';
  risk: PermissionRisk;
};

export const PERMISSION_CATALOG: readonly PermissionDefinition[] = [
  { code: PERMISSIONS.INVENTORY_VIEW, label: 'Xem kho', description: 'Xem dữ liệu hóa chất và tồn kho.', group: 'inventory', risk: 'normal' },
  { code: PERMISSIONS.INVENTORY_EDIT, label: 'Sửa kho', description: 'Thêm, sửa, nhập xuất và thay đổi dữ liệu kho.', group: 'inventory', risk: 'elevated' },
  { code: PERMISSIONS.BATCH_RUN, label: 'Vận hành mẻ', description: 'Lập và vận hành mẻ phân tích có tiêu hao kho.', group: 'inventory', risk: 'elevated' },
  { code: PERMISSIONS.STANDARD_VIEW, label: 'Xem chất chuẩn', description: 'Xem thư viện chất chuẩn đối chiếu.', group: 'standards', risk: 'normal' },
  { code: PERMISSIONS.STANDARD_REQUEST, label: 'Mượn chất chuẩn', description: 'Tạo yêu cầu mượn chất chuẩn.', group: 'standards', risk: 'normal' },
  { code: PERMISSIONS.STANDARD_EDIT, label: 'Sửa chất chuẩn', description: 'Sửa thông tin chất chuẩn và dữ liệu liên quan.', group: 'standards', risk: 'elevated' },
  { code: PERMISSIONS.STANDARD_APPROVE, label: 'Duyệt chất chuẩn', description: 'Duyệt và giao nhận yêu cầu chất chuẩn.', group: 'standards', risk: 'elevated' },
  { code: PERMISSIONS.STANDARD_LOG_VIEW, label: 'Xem nhật ký chất chuẩn', description: 'Xem báo cáo và nhật ký sử dụng chất chuẩn.', group: 'standards', risk: 'normal' },
  { code: PERMISSIONS.STANDARD_LOG_DELETE, label: 'Xóa nhật ký chất chuẩn', description: 'Xóa yêu cầu hoặc nhật ký sử dụng chất chuẩn.', group: 'standards', risk: 'high' },
  { code: PERMISSIONS.SOP_VIEW, label: 'Xem SOP & nhập kết quả', description: 'Xem SOP và các luồng kết quả được cấp quyền.', group: 'sop', risk: 'normal' },
  { code: PERMISSIONS.SOP_EDIT, label: 'Biên soạn SOP', description: 'Tạo và sửa SOP.', group: 'sop', risk: 'elevated' },
  { code: PERMISSIONS.SOP_APPROVE, label: 'Phê duyệt SOP', description: 'Phê duyệt SOP và các thao tác nghiệp vụ liên quan.', group: 'sop', risk: 'high' },
  { code: PERMISSIONS.RECIPE_VIEW, label: 'Xem công thức', description: 'Xem thư viện công thức.', group: 'sop', risk: 'normal' },
  { code: PERMISSIONS.RECIPE_EDIT, label: 'Sửa công thức', description: 'Tạo và sửa công thức.', group: 'sop', risk: 'elevated' },
  { code: PERMISSIONS.REPORT_VIEW, label: 'Xem báo cáo tổng hợp', description: 'Xem báo cáo và thống kê toàn hệ thống.', group: 'reporting', risk: 'normal' },
  { code: PERMISSIONS.DUTY_MANAGE, label: 'Quản lý lịch trực', description: 'Thêm, sửa, hủy ca trực và quản lý danh mục nhân sự trực.', group: 'reporting', risk: 'elevated' },
  { code: PERMISSIONS.USER_MANAGE, label: 'Quản lý người dùng & quyền', description: 'Duyệt tài khoản, gán vai trò và quản lý phân quyền.', group: 'system', risk: 'critical' },
  { code: PERMISSIONS.SYSTEM_MANAGE, label: 'Quản lý cấu hình hệ thống', description: 'Thay đổi cấu hình vận hành, in ấn, thông báo và bảo trì.', group: 'system', risk: 'critical' },
  { code: PERMISSIONS.BYPASS_MAINTENANCE, label: 'Truy cập khi bảo trì', description: 'Cho phép tiếp tục sử dụng LIMS khi chế độ bảo trì đang bật.', group: 'system', risk: 'high' },
  { code: PERMISSIONS.MASTER_DATA_MANAGE, label: 'Quản lý dữ liệu nền', description: 'Quản lý chỉ tiêu, nhóm chỉ tiêu, nền mẫu, mô tả mẫu và thiết bị.', group: 'master-data', risk: 'high' },
  { code: PERMISSIONS.POLICY_MANAGE, label: 'Quản lý chính sách hao hụt', description: 'Thay đổi ngưỡng và quy tắc hao hụt dùng trong các luồng tính toán.', group: 'policy', risk: 'high' },
  { code: PERMISSIONS.BACKUP_CREATE, label: 'Tạo backup toàn diện', description: 'Tạo hoặc tiếp tục một bản backup toàn diện.', group: 'backup', risk: 'high' },
  { code: PERMISSIONS.BACKUP_VERIFY, label: 'Kiểm tra backup', description: 'Liệt kê và kiểm tra tính toàn vẹn của các bản backup.', group: 'backup', risk: 'elevated' },
  { code: PERMISSIONS.BACKUP_RESTORE, label: 'Phục hồi backup', description: 'Dry-run, phục hồi dữ liệu thiếu và tiếp tục restore dở dang.', group: 'backup', risk: 'critical' },
] as const;

export const PERMISSION_NAMES: Record<string, string> = Object.fromEntries(
  PERMISSION_CATALOG.map(permission => [permission.code, permission.label]),
);

export const PERMISSION_GROUPS = [
  { id: 'inventory', name: 'Kho và hóa chất', icon: 'fa-box-open', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800/30', ring: '#10b981' },
  { id: 'standards', name: 'Chất chuẩn đối chiếu', icon: 'fa-vial-circle-check', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20', border: 'border-fuchsia-100 dark:border-fuchsia-800/30', ring: '#6366f1' },
  { id: 'sop', name: 'Quy trình SOP và công thức', icon: 'fa-book-open', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800/30', ring: '#f59e0b' },
  { id: 'reporting', name: 'Báo cáo', icon: 'fa-chart-pie', color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-100 dark:border-sky-800/30', ring: '#0ea5e9' },
  { id: 'system', name: 'Hệ thống & truy cập', icon: 'fa-server', color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800/50', border: 'border-slate-100 dark:border-slate-700/50', ring: '#64748b' },
  { id: 'master-data', name: 'Dữ liệu nền', icon: 'fa-layer-group', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-100 dark:border-teal-800/30', ring: '#14b8a6' },
  { id: 'policy', name: 'Chính sách vận hành', icon: 'fa-gauge-high', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-800/30', ring: '#f97316' },
  { id: 'backup', name: 'Backup & phục hồi', icon: 'fa-cloud-arrow-up', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800/30', ring: '#6366f1' },
] as const;

export const PERMISSION_EDITOR_GROUPS = PERMISSION_GROUPS.map(group => ({
  ...group,
  perms: PERMISSION_CATALOG
    .filter(permission => permission.group === group.id)
    .map(permission => ({
      val: permission.code,
      label: permission.label,
      description: permission.description,
      risk: permission.risk,
    })),
}));

export function permissionDefinition(code: string): PermissionDefinition | undefined {
  return PERMISSION_CATALOG.find(permission => permission.code === code);
}

export function permissionLabel(code: string): string {
  return permissionDefinition(code)?.label ?? code;
}
