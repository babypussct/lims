import { QueryDocumentSnapshot } from 'firebase/firestore';

export interface UsageLog {
  id?: string;
  date: string;
  user: string; 
  amount_used: number;
  unit?: string; // e.g. mg, ul
  purpose?: string; 
  timestamp?: number;
  
  // Extended Tracking (Added for global usage logs)
  standardId?: string;
  standardName?: string;
  lotNumber?: string;
  cas_number?: string;
  internalId?: string;
  manufacturer?: string;

  // [NEW-4] Request linkage — cho phép deleteUsageLog cập nhật đúng request khi chuẩn đã trả về
  requestId?: string;
}

export interface ReferenceStandard {
  id: string; 
  name: string; 
  
  // Tab 1: Identity & Pack
  internal_id?: string; // Manage Code (e.g. AA01)
  cas_number?: string;
  product_code?: string; // Catalog Code
  purity?: string; 
  chemical_name?: string;
  manufacturer?: string; 
  pack_size?: string; 
  lot_number?: string; 

  // Tab 2: Stock & Storage
  initial_amount: number;
  current_amount: number;
  unit: string;
  location?: string; 
  storage_condition?: string; // FT, CT, RT...
  storage_status?: string; 
  
  // Tab 3: Docs & Expiry
  expiry_date?: string;   
  received_date?: string;
  date_opened?: string;   
  contract_ref?: string; 
  certificate_ref?: string; // URL
  
  // Search Optimization
  search_key?: string; 

  // Workflow Status
  status?: 'AVAILABLE' | 'IN_USE' | 'DEPLETED';
  current_holder?: string; // User ID or Name holding the standard
  current_holder_uid?: string; // User ID holding the standard
  current_request_id?: string; // ID of the active request

  restock_requested?: boolean; // Flag if purchased has been requested
  coa_requested_by?: string; // UID of user who requested CoA upload
  lastUpdated?: any;
  _isDeleted?: boolean;
}

export type PurchaseRequestStatus = 'PENDING' | 'ORDERED' | 'COMPLETED' | 'REJECTED';

export interface PurchaseRequest {
  id?: string;
  standardId: string;    // ID chuẩn gốc đã hết
  standardName: string;
  manufacturer?: string; // Hãng hiện tại
  product_code?: string;
  lot_number?: string;
  
  requestedBy: string;   // UID nhân viên tạo
  requestedByName: string;
  requestDate: number;   // Timestamp
  
  priority: 'NORMAL' | 'HIGH';
  expectedAmount: string; // Số lượng cần
  
  // Khảo sát thêm từ NV
  preferred_manufacturer?: string; // Hãng cần mua
  required_level?: string;         // Yêu cầu cấp độ (VD: ISO17034)
  required_purity?: string;        // Yêu cầu độ tinh khiết (VD: > 99%)
  
  notes?: string;        // Lý do/Ghi chú thêm
  
  status: PurchaseRequestStatus;
  
  processedBy?: string;
  processedByName?: string;
  processedDate?: number;
}

export type StandardRequestStatus = 'PENDING_APPROVAL' | 'IN_PROGRESS' | 'PENDING_RETURN' | 'PENDING_DEPLETION' | 'COMPLETED' | 'REJECTED';

export interface StandardRequest {
  id?: string;
  standardId: string;
  standardName: string;
  lotNumber?: string;
  
  requestedBy: string; // userId
  requestedByName: string;
  requestDate: number; // timestamp
  purpose: string;
  expectedAmount?: number;
  expectedReturnDate?: number | null; // timestamp
  
  status: StandardRequestStatus;
  
  // Approval/Dispense
  approvedBy?: string;
  approvedByName?: string;
  approvalDate?: number;
  rejectionReason?: string;
  
  // Return/Depletion
  returnDate?: number;
  disposalReason?: string;
  receivedBy?: string;
  receivedByName?: string;
  
  // Usage tracking
  totalAmountUsed: number;
  reportedDepleted?: boolean;
  usageLogs?: UsageLog[];
  
  createdAt?: number;
  updatedAt?: number;

  // UI mapping
  standardDetails?: ReferenceStandard;
}

export interface StandardsPage {
  items: ReferenceStandard[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

export interface ImportPreviewItem {
    raw: any; 
    parsed: ReferenceStandard; 
    logs: any[]; 
    isValid: boolean;
}

export interface ImportUsageLogPreviewItem {
    raw: any;
    standard: ReferenceStandard | null; // Null if standard not found
    log: UsageLog;
    isDuplicate: boolean;
    isValid: boolean;
    errorMessage?: string;
}

export interface CoaMatchItem {
    file: File;
    fileName: string;
    matchedStandard: ReferenceStandard | null;
    matchScore?: number;
    suggestedStandards?: { std: ReferenceStandard, score: number }[]; // Pre-sorted list with scores
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress?: number;
    uploadError?: string;
}
