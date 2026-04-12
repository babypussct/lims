
export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  unit: string;
  category?: string;
  threshold?: number;
  location?: string;
  supplier?: string;
  ref_code?: string;
  gtin?: string;
  lotNumber?: string;
  expiryDate?: string;
  casNumber?: string;
  englishName?: string;
  ghsWarnings?: string[]; // Arrays of GHS codes e.g. 'GHS02', 'GHS06'
  lastUpdated?: any;
  notes?: string;
}

export interface StockHistoryItem {
  id?: string;
  timestamp: any;
  actionType: 'IMPORT' | 'EXPORT' | 'ADJUST' | 'SOP_DEDUCT' | 'SOP_RETURN' | 'CREATE';
  amountChange: number;
  stockAfter: number;
  reference: string; // SOP Name or Note
  user: string;
}
