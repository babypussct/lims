
export interface SopInput {
  var: string;
  label: string;
  type: 'number' | 'checkbox';
  default: number | boolean;
  step?: number;
  unitLabel?: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Consumable {
  name: string;
  formula: string;
  unit: string;
  base_note?: string; 
  type: 'simple' | 'composite';
  condition?: string;
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
  
  // Version Control
  version?: number;
  lastModified?: any; // Timestamp
  archivedAt?: any;   // Timestamp (For history records)
}

export interface CalculatedIngredient {
  name: string;
  unit: string;
  amountPerUnit: number;
  totalNeed: number;
  displayAmount: number;
  stockUnit: string;
  displayWarning?: string;
}

export interface CalculatedItem extends Consumable {
  totalQty: number;
  stockNeed: number; 
  stockUnit: string;
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