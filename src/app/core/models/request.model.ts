
export interface RequestItem {
  name: string; // ID of the item
  displayName?: string; // Human readable name (Denormalized)
  amount: number;
  displayAmount: number;
  unit: string;
  stockUnit: string;
}

export interface Request {
  id: string;
  sopId: string;
  sopName: string;
  items: RequestItem[];
  status: 'pending' | 'approved' | 'rejected';
  timestamp: any;
  approvedAt?: any;
  rejectedAt?: any;
  user?: string;
  inputs?: any;
  margin?: number;
  analysisDate?: string; 
}
