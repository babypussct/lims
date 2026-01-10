
import { Sop, CalculatedItem } from './sop.model';

export interface PrintData {
  sop: Sop;
  inputs: any;
  margin: number;
  items: CalculatedItem[];
  analysisDate?: string;
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
  user: string;

  // Enhanced Audit Fields
  targetId?: string; // ID of the item affected
  reason?: string;   // Mandatory for manual adjustments
  diff?: LogDiff[];  // JSON Diff for auditing

  // Optional fields for printable logs
  printable?: boolean;
  printData?: PrintData;
}
