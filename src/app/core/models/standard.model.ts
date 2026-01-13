
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
  
  // Identity (Tab 1)
  internal_id?: string; // Mã quản lý / Mã nội bộ
  cas_number?: string;
  product_code?: string; // Mã Catalog
  purity?: string; // Hàm lượng / Độ tinh khiết
  chemical_name?: string;

  // Stock & Storage (Tab 2)
  initial_amount: number;
  current_amount: number;
  unit: string;
  location?: string; // Vị trí lưu kho (Tủ, Ngăn) - Quan trọng
  storage_condition?: string; // FT, CT, RT, d...
  storage_status?: string; 
  expiry_date?: string;   
  date_opened?: string;   

  // Origin & Docs (Tab 3)
  manufacturer?: string;
  lot_number?: string;
  pack_size?: string; 
  received_date?: string; 
  contract_ref?: string; // Số Hợp đồng / Dự án
  certificate_ref?: string; // Link đến file COA (URL)
  
  lastUpdated?: any;
}
