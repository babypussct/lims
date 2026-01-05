
export interface SopInput {
  var: string;
  label: string;
  type: 'number' | 'checkbox';
  default: number | boolean;
  step?: number;
  unitLabel?: string; // New field for display unit (e.g. "g", "ml")
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Consumable {
  name: string;
  formula: string; // e.g. "total_n * 2"
  unit: string;
  base_note?: string; 
  type: 'simple' | 'composite';
  condition?: string; // e.g. "!use_b2"
  ingredients?: Ingredient[]; // If type is composite
}

export interface Sop {
  id: string;
  category: string;
  name: string;
  ref?: string;
  inputs: SopInput[];
  variables: { [key: string]: string }; 
  consumables: Consumable[];
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
