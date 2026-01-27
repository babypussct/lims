
export interface SopInput {
  var: string;
  label: string;
  type: 'number' | 'checkbox' | 'select';
  default: number | boolean | string;
  step?: number;
  unitLabel?: string;
  // Options for 'select' type. Structure: { label: 'Option A', value: 1 }
  options?: { label: string; value: string | number }[];
}

export interface SopTarget {
  id: string;
  name: string;
  unit?: string;
  lod?: string; // Limit of Detection (e.g. "0.1 ppb")
  loq?: string; // Limit of Quantitation (e.g. "0.3 ppb")
  isMasterLinked?: boolean; // Flag to lock ID if imported from Master Library
}

export interface TargetGroup {
  id: string;
  name: string;
  description?: string;
  targets: SopTarget[];
  lastUpdated?: any;
}

// NEW: Master Data for Analytes
export interface MasterAnalyte {
  id: string; // Unique slug (e.g., 'chloramphenicol')
  name: string; // Standard Name (e.g., 'Chloramphenicol')
  cas_number?: string; // CAS Registry Number
  chemical_formula?: string; // e.g., 'C11H12Cl2N2O5'
  default_unit?: string; // e.g., 'ppb' or 'µg/kg'
  description?: string;
  lastUpdated?: any;
}

export interface Ingredient {
  /**
   * The ID of the chemical from the inventory. Must match an `InventoryItem.id`.
   */
  name: string;
  amount: number;
  unit: string;
  // UI Helper (not saved to DB)
  _displayName?: string;
}

export interface Consumable {
  /**
   * For 'simple': Inventory ID.
   * For 'composite': Internal unique ID (slug).
   * For 'shared_recipe': Internal unique ID (slug).
   */
  name: string;
  formula: string; // e.g. "total_n * 2"
  unit: string;
  base_note?: string; 
  type: 'simple' | 'composite' | 'shared_recipe';
  
  condition?: string; // e.g. "!use_b2"
  
  /**
   * Used only if type is 'composite'. Lists the raw chemicals from inventory.
   */
  ingredients?: Ingredient[];

  /**
   * Used only if type is 'shared_recipe'. Points to artifacts/recipes/{id}
   */
  recipeId?: string;
  
  // UI Helper (not saved to DB, used for display in Editor)
  _displayName?: string;
}

export interface Sop {
  id: string;
  category: string;
  name: string;
  ref?: string;
  inputs: SopInput[];
  variables: { [key: string]: string }; 
  consumables: Consumable[];
  
  // New Feature: Targets (Analytes)
  targets?: SopTarget[];

  // Version Control Fields
  version?: number;
  lastModified?: any;
  archivedAt?: any; // Used only for history records
  
  // Soft Delete Flag
  isArchived?: boolean; 
}

// --- Calculated Results ---

export interface CalculatedIngredient {
  name: string; // ID
  displayName?: string; // Human readable name (Hydrated)
  unit: string;
  amountPerUnit: number;
  totalNeed: number; // In stock unit
  displayAmount: number; // In ingredient unit
  stockUnit: string;
  displayWarning?: string;
  isMissing?: boolean; // Flag if not found in inventory
}

export interface CalculatedItem extends Consumable {
  displayName?: string; // Tên hiển thị (Hydrated)
  totalQty: number;
  stockNeed: number; 
  stockUnit: string;
  
  // Composite details
  isComposite: boolean;
  breakdown: CalculatedIngredient[];
  
  displayWarning?: string;
  validationError?: string;
  isMissing?: boolean; // Flag if simple item not found in inventory
}

export interface CapacityResult {
  maxBatches: number;
  limitingFactor: string;
  details: CapacityDetail[];
}

export interface CapacityDetail {
  name: string;
  stock: number;
  need: number;
  batches: number;
}
