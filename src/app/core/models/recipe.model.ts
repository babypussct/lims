
export interface RecipeIngredient {
  name: string; // Inventory ID
  displayName?: string; // Cache name for display
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string; // Slug
  name: string;
  baseUnit: string; // e.g., 'tube', 'ml'
  note?: string;
  ingredients: RecipeIngredient[];
  lastUpdated?: any;
}
