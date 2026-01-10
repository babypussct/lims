
import { Sop, CalculatedItem } from './sop.model';

// This data structure captures everything needed to reprint a form.
export interface PrintData {
  sop: Sop;
  inputs: any;
  margin: number;
  items: CalculatedItem[];
}

export interface Log {
  id: string;
  action: string;
  details: string;
  timestamp: any;
  user: string;

  // Optional fields for printable logs
  printable?: boolean;
  printData?: PrintData;
}
