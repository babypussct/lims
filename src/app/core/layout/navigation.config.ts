import { PERMISSIONS } from '../services/auth.service';

export type NavigationAccess = string | 'role:manager';

export interface NavigationItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  activeMatch: string[];
  access?: NavigationAccess;
  lockPermission?: string;
  badgeKey?: 'requests';
}

export interface NavigationGroup {
  id: string;
  title: string;
  icon: string;
  items: NavigationItem[];
}

/** Shared page-title map — single source of truth for Header breadcrumbs, Bottom Nav label, etc. */
export const ROUTE_TITLES: Record<string, string> = {
  'dashboard': 'Trang Chủ',
  'inventory': 'Kho Hóa Chất',
  'calculator': 'Vận Hành SOP',
  'requests': 'Quản Lý Yêu Cầu',
  'stats': 'Báo Cáo',
  'config': 'Cấu Hình',
  'standards': 'Chất Chuẩn Đối Chiếu',
  'recipes': 'Thư Viện Công Thức',
  'prep': 'Trạm Pha Chế',
  'daily-checklist': 'Theo Dõi Mẫu Ngày',
  'smart-batch': 'Lập Mẻ Phân Tích',
  'traceability': 'Truy Xuất Nguồn Gốc',
  'documents': 'Giao Nhận Mẫu',
  'results': 'Kết Quả Phân Tích',
  'labels': 'In Tem Nhãn',
  'standard-requests': 'Yêu Cầu Chất Chuẩn',
  'standard-usage': 'Nhật Ký Chất Chuẩn',
  'editor': 'Trình Soạn SOP',
  'target-groups': 'Nhóm Chỉ Tiêu',
  'master-targets': 'Master Chỉ Tiêu',
  'matrix-types': 'Loại Nền Mẫu',
  'master-devices': 'Thiết Bị Phân Tích',
  'results-view': 'Xem Kết Quả',
  'printing': 'In Ấn',
};

/** Shared page-icon map — FA icon class for each route segment */
export const ROUTE_ICONS: Record<string, string> = {
  'dashboard': 'fa-house',
  'inventory': 'fa-boxes-stacked',
  'calculator': 'fa-calculator',
  'requests': 'fa-clipboard-list',
  'stats': 'fa-chart-pie',
  'config': 'fa-gear',
  'standards': 'fa-vial-circle-check',
  'recipes': 'fa-book-bookmark',
  'prep': 'fa-flask-vial',
  'daily-checklist': 'fa-calendar-check',
  'smart-batch': 'fa-layer-group',
  'traceability': 'fa-route',
  'documents': 'fa-file-signature',
  'results': 'fa-square-poll-vertical',
  'labels': 'fa-barcode',
  'standard-requests': 'fa-clipboard-check',
  'standard-usage': 'fa-clock-rotate-left',
  'editor': 'fa-pen-ruler',
  'target-groups': 'fa-bullseye',
  'master-targets': 'fa-crosshairs',
  'matrix-types': 'fa-table-cells',
  'master-devices': 'fa-microscope',
  'results-view': 'fa-square-poll-vertical',
  'printing': 'fa-print',
};

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    id: 'overview',
    title: 'Tổng quan',
    icon: 'fa-chart-pie',
    items: [
      { id: 'stats', name: 'Báo Cáo', icon: 'fa-chart-pie', path: 'stats', activeMatch: ['/stats'], access: PERMISSIONS.REPORT_VIEW, lockPermission: PERMISSIONS.REPORT_VIEW },
      { id: 'documents', name: 'Phiếu Giao Nhận Mẫu', icon: 'fa-file-signature', path: 'documents', activeMatch: ['/documents'] }
    ]
  },
  {
    id: 'operation',
    title: 'Vận hành',
    icon: 'fa-layer-group',
    items: [
      { id: 'smart-batch', name: 'Lập Mẻ Phân Tích', icon: 'fa-layer-group', path: 'smart-batch', activeMatch: ['/smart-batch'], access: PERMISSIONS.BATCH_RUN, lockPermission: PERMISSIONS.BATCH_RUN },
      { id: 'prep', name: 'Trạm Pha Chế', icon: 'fa-flask-vial', path: 'prep', activeMatch: ['/prep'] },
      { id: 'requests', name: 'Quản Lý Yêu Cầu', icon: 'fa-clipboard-list', path: 'requests', activeMatch: ['/requests', '/printing'], access: PERMISSIONS.SOP_VIEW, lockPermission: PERMISSIONS.SOP_VIEW, badgeKey: 'requests' },
      { id: 'results', name: 'Kết Quả Phân Tích', icon: 'fa-square-poll-vertical', path: 'results', activeMatch: ['/results', '/results-view'], access: PERMISSIONS.SOP_VIEW, lockPermission: PERMISSIONS.SOP_VIEW }
    ]
  },
  {
    id: 'storage',
    title: 'Lưu trữ',
    icon: 'fa-boxes-stacked',
    items: [
      { id: 'inventory', name: 'Kho Hóa Chất', icon: 'fa-boxes-stacked', path: 'inventory', activeMatch: ['/inventory', '/labels'], access: PERMISSIONS.INVENTORY_VIEW, lockPermission: PERMISSIONS.INVENTORY_VIEW },
      { id: 'standards', name: 'Chất Chuẩn Đối Chiếu', icon: 'fa-vial-circle-check', path: 'standards', activeMatch: ['/standards'], access: PERMISSIONS.STANDARD_VIEW, lockPermission: PERMISSIONS.STANDARD_VIEW },
      { id: 'standard-requests', name: 'Yêu Cầu Chất Chuẩn', icon: 'fa-clipboard-check', path: 'standard-requests', activeMatch: ['/standard-requests'], access: PERMISSIONS.STANDARD_VIEW, lockPermission: PERMISSIONS.STANDARD_VIEW },
      { id: 'standard-usage', name: 'Nhật ký dùng chuẩn', icon: 'fa-clock-rotate-left', path: 'standard-usage', activeMatch: ['/standard-usage'], access: PERMISSIONS.STANDARD_LOG_VIEW, lockPermission: PERMISSIONS.STANDARD_LOG_VIEW }
    ]
  }
];
