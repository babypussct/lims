import { QueryDocumentSnapshot } from 'firebase/firestore';

export interface UsageLog {
  id?: string;
  date: string;
  user: string; 
  amount_used: number;
  unit?: string; // Đơn vị thực tế khi cân (VD: mg, ul)
  purpose?: string; 
  timestamp?: number;
}

export interface ReferenceStandard {
  id: string; 
  name: string; 
  
  // Tab 1: Identity & Pack
  internal_id?: string; // Mã quản lý / Mã nội bộ (VD: AA01)
  cas_number?: string;
  product_code?: string; // Mã Catalog
  purity?: string; // Hàm lượng / Độ tinh khiết
  chemical_name?: string;
  manufacturer?: string; // Hãng sản xuất
  pack_size?: string; // Quy cách đóng gói (VD: 10mg)
  lot_number?: string; // Số Lô

  // Tab 2: Stock & Storage
  initial_amount: number;
  current_amount: number;
  unit: string;
  location?: string; // Vị trí lưu kho (Tự động từ Internal ID)
  storage_condition?: string; // FT, CT, RT, d...
  storage_status?: string; 
  
  // Tab 3: Docs & Expiry
  expiry_date?: string;   
  received_date?: string;
  date_opened?: string;   
  contract_ref?: string; // Số Hợp đồng / Dự án
  certificate_ref?: string; // Link đến file COA (URL)
  
  // Search Optimization
  search_key?: string; // Chuỗi tìm kiếm tổng hợp (normalized)

  lastUpdated?: any;
}

export interface StandardsPage {
  items: ReferenceStandard[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

export interface ImportPreviewItem {
    raw: any; // Dữ liệu thô từ Excel để debug
    parsed: ReferenceStandard; // Dữ liệu đã xử lý
    logs: any[]; // Logs đi kèm
    isValid: boolean;
}
