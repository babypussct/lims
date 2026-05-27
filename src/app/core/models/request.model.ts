
import { AnalysisResultDraft } from './analysis-result.model';

export interface RequestItem {
  name: string; // ID of the item
  displayName?: string; // Human readable name (Denormalized)
  amount: number;
  displayAmount: number;
  baseAmount?: number; // Theoretical amount without margin (in stock unit)
  unit: string;
  stockUnit: string;
}


export interface Request {
  id: string;
  sopId: string;
  sopName: string;
  items: RequestItem[];
  status: 'pending' | 'approved' | 'rejected' | 'draft' | 'completed';
  timestamp: any;
  lastUpdated?: any;
  approvedAt?: any;
  rejectedAt?: any;
  user?: string;
  inputs?: any;
  margin?: number;
  analysisDate?: string;
  
  // New Feature: Sample & Target Tracking
  sampleList?: string[]; // List of Sample IDs
  targetIds?: string[];  // List of Selected Target IDs
  sampleTargetMap?: Record<string, string[]>; // Maps sample ID -> assigned Target IDs

  
  // Legacy: Embed Analysis Result directly in Request (pre-Document-Splitting)
  analysisResult?: AnalysisResultDraft;

  // Post-Document-Splitting: lightweight summary stored on metadata doc
  analysisResultSummary?: {
    version?: number;
    status?: 'draft' | 'completed';
    pdfUrl?: string;
    pdfViewUrl?: string;
    docsUrl?: string;
    reports?: Record<string, any>;
    updatedAt?: string;
    updatedBy?: string;
  };

  // Virtual Master Run details (Option C merging)
  isVirtualMaster?: boolean;
  childRequestIds?: string[];
}
