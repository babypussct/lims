
export interface RequestItem {
  name: string;
  amount: number; // The amount to be deducted in STOCK UNIT
  displayAmount: number;
  unit: string; // The display unit
  stockUnit: string;
}

export interface Request {
  id: string;
  sopId: string;
  sopName: string;
  items: RequestItem[];
  status: 'pending' | 'approved' | 'rejected';
  timestamp: any; // Firestore Timestamp
  approvedAt?: any;
  rejectedAt?: any;
  user?: string;

  // Added fields to store calculation context for re-printing
  inputs?: any;
  margin?: number;
}
