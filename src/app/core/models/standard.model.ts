import { QueryDocumentSnapshot } from 'firebase/firestore';

export type StandardTagSource = 'SOP' | 'TARGET_GROUP' | 'CUSTOM';
export type StandardTagCatalogOrigin = 'MANUAL' | 'ACCREDITATION_SCOPE';
export type StandardTagTemplateKind = 'TEST_METHOD';

export type StandardDeviceCode =
  | 'GC'
  | 'GCECD'
  | 'GCMS'
  | 'GCMSMS'
  | 'GCHRMS'
  | 'LCMSMS'
  | 'ICPMS'
  | 'HPLC'
  | 'HPLCUVVIS'
  | 'HPLCFLD'
  | 'HPLCDAD'
  | 'HPLCPDA'
  | 'IC'
  | 'UVVIS'
  | 'AASFLAME'
  | 'ELISA';

export interface StandardDeviceOption {
  key: string;
  code: StandardDeviceCode;
  label: string;
  aliases: string[];
  color: string;
  sortOrder: number;
}

export interface StandardTagOption {
  key: string;
  label: string;
  description?: string;
  source: StandardTagSource;
  origin?: StandardTagCatalogOrigin;
  templateKind?: StandardTagTemplateKind;
  methodCode?: string;
  methodSeries?: string;
  deviceCodes?: StandardDeviceCode[];
  sourceLabCode?: string;
  sourceDecision?: string;
  sourceValidFrom?: string;
  sourceValidTo?: string;
  supersededByDecision?: string;
  color?: string;
  selectable: boolean;
  archived?: boolean;
}

export interface StandardTagCatalogItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  color?: string;
  origin?: StandardTagCatalogOrigin;
  templateKind?: StandardTagTemplateKind;
  methodCode?: string;
  deviceCodes?: StandardDeviceCode[];
  sourceAgency?: string;
  sourceDecision?: string;
  sourceLabCode?: string;
  sourceDocument?: string;
  sourceSha256?: string;
  sourceValidFrom?: string;
  sourceValidTo?: string;
  sourcePages?: string;
  supersededByDecision?: string;
  supersededAt?: string;
  seedVersion?: string;
  sortOrder?: number;
  locked?: boolean;
  createdAt?: any;
  createdBy?: string;
  lastUpdated?: any;
  _isDeleted?: boolean;
}

export type StandardTagMergeStatus = 'NOT_REQUESTED' | 'MERGED' | 'SKIPPED_LIMIT';

export interface ReturnStandardResult {
  tagMergeStatus: StandardTagMergeStatus;
  tagMergeWarning?: string;
}

export interface BulkTagFailure {
  standardId: string;
  reason: string;
}

export interface BulkTagUpdateResult {
  successIds: string[];
  failed: BulkTagFailure[];
  skippedIds: string[];
}

export interface UsageLog {
  id?: string;
  date: string;
  user: string; 
  /** Stable identity of the employee attributed to this usage. */
  userId?: string;
  amount_used: number;
  unit?: string; // e.g. mg, ul
  /** Amount converted exactly once into normalized_unit (normally the standard unit). */
  normalized_amount?: number;
  normalized_unit?: string;
  purpose?: string; 
  timestamp?: number;
  
  // Extended Tracking (Added for global usage logs)
  standardId?: string;
  standardName?: string;
  lotNumber?: string;
  cas_number?: string;
  internalId?: string;
  manufacturer?: string;

  // Delta Sync & Soft Delete
  lastUpdated?: any;
  _isDeleted?: boolean;
  requestId?: string;
  isDepleted?: boolean;
  isBackfill?: boolean;
  backfilledAt?: number;
  backfilledByUid?: string;
  backfilledByName?: string;
  rolledBackAt?: number;
  rolledBackBy?: string;
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
  /** Canonical chemical identity; product concentration/solvent stays in name. */
  canonical_name?: string;
  /** First product name captured before controlled nomenclature cleanup. */
  original_name?: string;
  name_source?: 'supplier' | 'coa' | 'pubchem' | 'manual' | 'cleanup';
  cas_status?: 'valid' | 'missing' | 'placeholder' | 'date_corrupted' | 'annotated' | 'invalid';
  standard_form?: 'neat' | 'solution' | 'mixture' | 'isotope' | 'salt_or_hydrate';
  normalization_version?: string;
  normalization_batch_id?: string;
  normalized_at?: any;
  normalized_by?: string;
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
  status?: 'AVAILABLE' | 'IN_USE' | 'DEPLETED' | 'ACTIVE' | 'DELETED';
  current_holder?: string; // User ID or Name holding the standard
  current_holder_uid?: string; // User ID holding the standard
  current_request_id?: string; // ID of the active request
  has_pending_request?: boolean; // Flag if there is a pending borrowing request

  /** Canonical accumulated tag keys (sop:, target-group:, custom:). */
  sop_tags?: string[];
  /** UI-only derived secondary labels; never persisted to Firestore. */
  derivedDeviceCodes?: StandardDeviceCode[];
  /** UI-only method labels; canonical persisted values remain sop_tags. */
  derivedMethodLabels?: string[];

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

  /** Optional staff proposal when reporting a return. */
  sopTags?: string[];
  /** Final tag decision recorded by Admin for this return. */
  finalSopTags?: string[];
  tagMergeStatus?: StandardTagMergeStatus;
  tagMergeWarning?: string;
  
  // Usage tracking
  totalAmountUsed: number;
  /** Confirmed cumulative consumption, expressed in confirmedUnit. */
  confirmedAmountUsed?: number;
  confirmedUnit?: string;
  reportedDepleted?: boolean;
  usageLogs?: UsageLog[];

  // Historical backfill provenance
  isBackfill?: boolean;
  backfilledAt?: number;
  backfilledByUid?: string;
  backfilledByName?: string;
  
  createdAt?: number;
  updatedAt?: number;

  // Soft Delete / DeltaSync
  _isDeleted?: boolean;
  lastUpdated?: any;
  rolledBackAt?: number;
  rolledBackBy?: string;

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
    logs: UsageLog[];
    isValid: boolean;
    mode?: 'CREATE' | 'UPDATE_SAFE' | 'RESTORE' | 'CONFLICT';
    errorMessage?: string;
    warnings?: string[];
    rowNumber?: number;
    sourceSheet?: string;
    presentFields?: (keyof ReferenceStandard)[];
    changes?: StandardImportFieldChange[];
}

export interface StandardImportFieldChange {
    field: keyof ReferenceStandard;
    label: string;
    before: string | number | boolean | null;
    after: string | number | boolean | null;
}

export interface StandardNameUpdate {
  standardId: string;
  name: string;
  chemicalName: string;
  /** Normalized CAS replacement. Omitted when the cleanup only changes nomenclature. */
  casNumber?: string;
  canonicalName?: string;
  originalName?: string;
  nameSource?: ReferenceStandard['name_source'];
  casStatus?: ReferenceStandard['cas_status'];
  standardForm?: ReferenceStandard['standard_form'];
  normalizationVersion?: string;
}

export interface StandardNameSnapshot {
  name: string;
  cas_number?: string;
  chemical_name?: string;
  canonical_name?: string;
  original_name?: string;
  name_source?: ReferenceStandard['name_source'];
  cas_status?: ReferenceStandard['cas_status'];
  standard_form?: ReferenceStandard['standard_form'];
  normalization_version?: string;
  normalization_batch_id?: string;
  normalized_at?: any;
  normalized_by?: string;
}

export interface StandardCleanupBatchChange {
  standardId: string;
  internalId?: string;
  before: StandardNameSnapshot;
  after: StandardNameSnapshot;
}

export interface StandardCleanupBatch {
  id: string;
  cas: string;
  status: 'APPLIED' | 'UNDONE';
  recordCount: number;
  changes: StandardCleanupBatchChange[];
  createdAt?: any;
  createdBy?: string;
  createdByName?: string;
  undoneAt?: any;
  undoneBy?: string;
  undoneByName?: string;
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
