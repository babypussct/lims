
export interface InventoryItem {
  id: string;          // Khóa chính (VD: "meoh_hplc"). Không được sửa.
  name: string;        // Tên tiếng Việt (VD: "Methanol chạy máy").
  
  stock: number;       // Số lượng tồn
  unit: string;        // Chọn từ Dropdown (ml, g, box...)
  category?: string;   // 'reagent', 'consumable', 'kit'
  threshold?: number;  // Ngưỡng báo hết (VD: 500)
  
  // Metadata for Purchasing / Management
  location?: string;   // Vị trí (Tủ A, Ngăn mát)
  supplier?: string;   // Hãng/Nhà cung cấp
  ref_code?: string;   // Mã Code trên chai hóa chất
  
  lastUpdated?: any;
  notes?: string;
}
