import { Sop, CalculatedItem } from './sop.model';

export interface PrintData {
  sop: Sop;
  inputs: any;
  margin: number;
  items: CalculatedItem[];
  analysisDate?: string;
  requestId?: string; // Reference to 'requests' collection
}

export interface LogDiff {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface Log {
  id: string;
  action: string;
  details: string;
  timestamp: any;
  lastUpdated?: any;
  user: string;

  // Enhanced Audit Fields
  targetId?: string; // ID of the item affected
  reason?: string;   // Mandatory for manual adjustments
  diff?: LogDiff[];  // JSON Diff for auditing

  // Print Logic
  printable?: boolean;
  
  // Legacy Data (Will be migrated)
  printData?: PrintData; 

  // New Architecture (Split Data)
  printJobId?: string; // Reference to 'print_jobs' collection
  requestId?: string; // Reference to 'requests' collection
  metadata?: Record<string, unknown>;
  module?: string; // e.g. 'STANDARDS', 'SOP'
  finalStock?: number; // Captured snapshot for deletions
  /**
   * Immutable stock deltas produced by the business action.
   * Positive values add stock; negative values consume stock.
   * New activity writers populate this so historical NXT reports do not
   * depend on mutable request/print-job documents.
   */
  inventoryDeltas?: Record<string, number>;
  sopBasicInfo?: {     // Lightweight info for list display
      name: string;
      category: string;
      ref?: string;
  };
  status?: string; // Live request status computed for traceability view
}
