
export interface RequestItem {
  name: string;
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
  analysisDate?: string; // New field YYYY-MM-DD
}