
export interface SopInput {
  var: string;
  label: string;
  type: 'number' | 'checkbox';
  default: number | boolean;
  step?: number;
  unitLabel?: string;
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
