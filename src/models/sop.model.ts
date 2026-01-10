
export interface SopInput {
  var: string;
  label: string;
  type: 'number' | 'checkbox';
  default: number | boolean;
  step?: number;
  unitLabel?: string; // New field for display unit (e.g. "g", "ml")
}

export interface Ingredient {
  /**
   * The ID of the chemical from the inventory. Must match an `InventoryItem.id`.
   */
  name: string;
  amount: number;
  unit: string;
}

export interface Consumable {
  /**
   * For 'simple' type: The ID of the item from inventory. Must match an `InventoryItem.id`.
   * For 'composite' type: A descriptive name for the mixture (e.g., "Hỗn hợp làm sạch B").
   */
  name: string;
  formula: string; // e.g. "total_n * 2"
  unit: string;
  base_note?: string; 
  type: 'simple' | 'composite';
  condition?: string; // e.g. "!use_b2"
  /**
   * Used only if type is 'composite'. Lists the raw chemicals from inventory.
   */
  ingredients?: Ingredient[];
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
}

// --- Calculated Results ---

export interface CalculatedIngredient {
  name: string;
  unit: string;
  amountPerUnit: number;
  totalNeed: number; // In stock unit
  displayAmount: number; // In ingredient unit
  stockUnit: string;
  displayWarning?: string;
}

export interface CalculatedItem extends Consumable {
  totalQty: number;
  stockNeed: number; 
  stockUnit: string;
  
  // Composite details
  isComposite: boolean;
  breakdown: CalculatedIngredient[];
  
  displayWarning?: string;
  validationError?: string;
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
