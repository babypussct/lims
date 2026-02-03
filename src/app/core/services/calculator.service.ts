
import { Injectable } from '@angular/core';
import { Sop, CalculatedItem, CapacityResult, CapacityDetail } from '../models/sop.model';
import { InventoryItem } from '../models/inventory.model';
import { Recipe } from '../models/recipe.model';
import { SafetyConfig } from '../models/config.model';
import { getStandardizedAmount } from '../../shared/utils/utils';

// Helper object exposed to the Formula Evaluator as 'Chem'
const ChemHelper = {
  dilute: (cStock: number, cTarget: number, vTarget: number) => {
    if (cStock === 0) return 0;
    return (cTarget * vTarget) / cStock;
  },
  molarMass: (molarity: number, mw: number, volMl: number) => {
    return molarity * mw * (volMl / 1000);
  },
  max: Math.max,
  min: Math.min,
  round: (num: number, decimals: number = 2) => {
    const f = Math.pow(10, decimals);
    return Math.round(num * f) / f;
  }
};

@Injectable({ providedIn: 'root' })
export class CalculatorService {

  // Safe formula evaluator
  private evalFormula(formula: string, context: Record<string, number | boolean>): number | boolean | null {
    if (!formula) return 0;
    try {
      const keys = [...Object.keys(context), 'Math', 'Chem'];
      const values = [...Object.values(context), Math, ChemHelper];
      const func = new Function(...keys, `"use strict"; return (${formula});`);
      return func(...values);
    } catch (e) { return null; }
  }

  /**
   * Calculates needs for an SOP.
   * Updated to support `shared_recipe` and Dynamic Safety Margin.
   * @param safetyMargin - If -1 (or < 0), use dynamic calculation from `safetyConfig`. Else use strictly as %.
   */
  calculateSopNeeds(
      sop: Sop, 
      inputValues: Record<string, any>, 
      safetyMargin: number = 0,
      inventoryMap: Record<string, InventoryItem> = {},
      recipeMap: Record<string, Recipe> = {},
      safetyConfig?: SafetyConfig
  ): CalculatedItem[] {
    
    // 1. Prepare Context from Inputs
    let ctx: Record<string, any> = { ...inputValues };
    sop.inputs.forEach(inp => {
      if (ctx[inp.var] === undefined) {
        ctx[inp.var] = inp.default;
      }
    });

    // 1.5 Pre-scan formulas to default missing vars to 0
    const allFormulas = [
      ...Object.values(sop.variables || {}),
      ...sop.consumables.map(c => c.formula),
      ...sop.consumables.map(c => c.condition || '')
    ].filter(f => f);

    const allIdentifiers = new Set<string>();
    const identifierRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    const knownGlobals = ['Math', 'Chem', 'true', 'false', 'null', 'undefined'];

    allFormulas.forEach(formula => {
      const matches = formula.match(identifierRegex);
      if (matches) {
        matches.forEach(match => {
          if (isNaN(parseFloat(match)) && !knownGlobals.includes(match) && typeof Math[match as keyof typeof Math] !== 'function' && !(match in ChemHelper)) {
            allIdentifiers.add(match);
          }
        });
      }
    });

    const variableKeys = new Set(Object.keys(sop.variables || {}));
    allIdentifiers.forEach(id => {
      if (ctx[id] === undefined && !variableKeys.has(id)) {
        ctx[id] = 0;
      }
    });

    // 2. Resolve Intermediate Variables
    if (sop.variables) {
      const varEntries = Object.entries(sop.variables);
      const resolvedKeys = new Set<string>();
      let changedInPass = true;
      let passes = 0;

      while (changedInPass && passes < 10) {
        changedInPass = false;
        for (const [key, formula] of varEntries) {
          if (resolvedKeys.has(key)) continue; 
          const val = this.evalFormula(formula, ctx);
          if (val !== null) {
            ctx[key] = val;
            resolvedKeys.add(key);
            changedInPass = true; 
          }
        }
        passes++;
      }
      
      if (resolvedKeys.size < varEntries.length) {
         varEntries.forEach(([key]) => { if(!resolvedKeys.has(key)) ctx[key] = 0; });
      }
    }

    // 3. Calculate Consumables
    return sop.consumables.map(item => {
      // Condition Check
      if (item.condition) {
        const condResult = this.evalFormula(item.condition, ctx);
        if (!condResult) return null;
      }

      // Formula Check
      let baseQty = 0;
      let validationError: string | undefined = undefined;
      let formulaResult: number | boolean | null = null;
      
      try { formulaResult = this.evalFormula(item.formula, ctx); } catch (e) { }
      
      if (typeof formulaResult === 'number') {
        baseQty = formulaResult;
      } else {
        baseQty = 0;
        validationError = "Lỗi công thức";
      }

      // Inventory Lookup & Dynamic Margin
      let stockUnit = item.unit;
      let stockNeed = 0;
      let displayWarning: string | undefined = undefined;
      let isMissing = false;
      let displayName = item._displayName || item.name;

      const stockItem = inventoryMap[item.name]; 

      // --- DYNAMIC MARGIN LOGIC ---
      let appliedMargin = 0;
      if (safetyMargin < 0) {
          // AUTO MODE
          if (safetyConfig) {
              // Try to find category rule
              if (stockItem && stockItem.category && safetyConfig.rules[stockItem.category] !== undefined) {
                  appliedMargin = safetyConfig.rules[stockItem.category];
                  displayWarning = displayWarning ? `${displayWarning} ` : '';
                  // Uncomment to show margin source: displayWarning += `(Margin: ${stockItem.category} ${appliedMargin}%)`;
              } else {
                  appliedMargin = safetyConfig.defaultMargin || 0;
              }
          } else {
              appliedMargin = 10; // Default fallback if config missing
          }
      } else {
          // MANUAL MODE (Override)
          appliedMargin = safetyMargin;
      }

      const factor = 1 + (appliedMargin / 100);
      const totalQty = baseQty * factor;

      // Handle Display Name & Unit conversion for direct items
      if (stockItem) {
        displayName = stockItem.name;
        stockUnit = stockItem.unit;
        
        // --- SMART UNIT CONVERSION ---
        const converted = getStandardizedAmount(totalQty, item.unit, stockUnit);
        
        if (converted === null) {
          displayWarning = `(Khác ĐV: ${item.unit} != ${stockUnit})`;
          stockNeed = totalQty;
        } else {
          stockNeed = converted;
        }
      } else {
        stockUnit = item.unit; 
        stockNeed = totalQty;
      }

      // Determine Type
      const isComposite = item.type === 'composite' || (item.ingredients && item.ingredients.length > 0);
      const isSharedRecipe = item.type === 'shared_recipe';

      // --- SIMPLE ITEM ---
      if (!isComposite && !isSharedRecipe) {
        if (!stockItem) isMissing = true;
        
        return { 
          ...item, displayName, totalQty, stockNeed, stockUnit, isComposite: false, breakdown: [],
          displayWarning, validationError, isMissing
        } as CalculatedItem;
      }

      // --- COMPOSITE / SHARED RECIPE ---
      let rawIngredients: any[] = [];
      
      if (isSharedRecipe && item.recipeId && recipeMap[item.recipeId]) {
          const recipe = recipeMap[item.recipeId];
          rawIngredients = recipe.ingredients;
          
          if (item._displayName && item._displayName.trim() !== recipe.name.trim()) {
              displayName = `${recipe.name} (${item._displayName})`;
          } else {
              displayName = recipe.name;
          }
      } else {
          rawIngredients = item.ingredients || [];
          if (item.name.startsWith('mix_')) {
             if (item._displayName) {
                 displayName = item._displayName;
             } else {
                 const raw = item.name.substring(4).replace(/_/g, ' '); 
                 displayName = raw.charAt(0).toUpperCase() + raw.slice(1);
             }
          }
      }

      const breakdown = rawIngredients.map(ing => {
        let ingStockUnit = ing.unit;
        let ingWarning: string | undefined = undefined;
        let ingTotalNeed = 0;
        let ingIsMissing = false;

        const ingStockItem = inventoryMap[ing.name];
        const ingDisplayName = ingStockItem ? ingStockItem.name : (ing.displayName || ing.name);
        
        // --- DYNAMIC MARGIN FOR INGREDIENTS ---
        let ingMargin = 0;
        if (safetyMargin < 0) {
            // Auto Mode
            if (safetyConfig && ingStockItem && ingStockItem.category && safetyConfig.rules[ingStockItem.category] !== undefined) {
                ingMargin = safetyConfig.rules[ingStockItem.category];
            } else if (safetyConfig) {
                ingMargin = safetyConfig.defaultMargin || 0;
            } else {
                ingMargin = 10;
            }
        } else {
            // Manual Mode
            ingMargin = safetyMargin;
        }
        
        // Recalculate amountPerBatch with ingredient specific margin
        // Note: The parent 'totalQty' already has a margin applied (e.g. Volume of Mix). 
        // We usually don't double apply margin (Margin on Mix Volume AND Margin on Ingredient).
        // Standard practice: Margin applies to the FINAL quantity needed.
        // For composite, we need X amount of Mix. The ingredients make up that X amount. 
        // If we made X amount exactly, we might lose some. 
        // So 'totalQty' of parent is (Base * Factor). Ingredients are proportional to that.
        // So ingredients effectively inherit the Parent's margin.
        
        // HOWEVER: If "Dynamic Margin" means "Solvent needs +15% but Salt needs +2%", then applying margin at Parent level is wrong if Parent is just a logical grouping.
        // But here 'Parent' is usually a physical solution (Buffer A). You prepare Buffer A with margin.
        // So the margin of the SOLUTION determines the margin of ingredients.
        
        const amountPerBatch = totalQty * ing.amount; 
        // amountPerBatch is now: (Base * ParentMargin) * ratio. 
        // This is correct for "Making a Solution". The solution type determines the loss.

        if (ingStockItem) {
          ingStockUnit = ingStockItem.unit;
          const converted = getStandardizedAmount(amountPerBatch, ing.unit, ingStockUnit);
          
          if (converted === null) {
            ingWarning = `(Khác ĐV: ${ing.unit} != ${ingStockUnit})`;
            ingTotalNeed = amountPerBatch;
          } else {
            ingTotalNeed = converted;
          }
        } else {
          ingStockUnit = ing.unit;
          ingTotalNeed = amountPerBatch;
          ingIsMissing = true;
        }

        return {
          name: ing.name, displayName: ingDisplayName, unit: ing.unit, amountPerUnit: ing.amount,
          totalNeed: ingTotalNeed, displayAmount: amountPerBatch,
          stockUnit: ingStockUnit, displayWarning: ingWarning, isMissing: ingIsMissing
        };
      });

      return {
        ...item, displayName, totalQty, stockNeed, stockUnit, isComposite: true, breakdown,
        displayWarning, validationError, isMissing: false 
      } as CalculatedItem;

    }).filter(i => i !== null) as CalculatedItem[];
  }

  calculateCapacity(
      sop: Sop, 
      mode: 'marginal' | 'standard' = 'marginal',
      inventoryMap: Record<string, InventoryItem> = {},
      recipeMap: Record<string, Recipe> = {} 
  ): CapacityResult {
    
    const capacityInputs: Record<string, any> = {};
    sop.inputs.forEach(inp => { capacityInputs[inp.var] = inp.default; });

    if (mode === 'marginal') {
        sop.inputs.forEach(inp => {
            if (inp.var.includes('sample')) capacityInputs[inp.var] = 1;
            if (inp.var.includes('qc')) capacityInputs[inp.var] = 0;
        });
    }

    // Capacity calculation usually ignores margin or uses 0 to find theoretical max
    const needs = this.calculateSopNeeds(sop, capacityInputs, 0, inventoryMap, recipeMap);
    
    const aggregatedNeeds = new Map<string, number>();

    needs.forEach(item => {
      const itemsToCheck = item.isComposite ? item.breakdown : [item];
      itemsToCheck.forEach((ing: any) => {
          const id = ing.name;
          const amount = ing.totalNeed ?? ing.stockNeed;
          
          if (id && amount > 0) {
             const current = aggregatedNeeds.get(id) || 0;
             aggregatedNeeds.set(id, current + amount);
          }
      });
    });

    let maxBatches = Infinity;
    let limitingFactor = '';
    const details: CapacityDetail[] = [];

    aggregatedNeeds.forEach((totalNeed, id) => {
        const stockItem = inventoryMap[id];
        
        if (!stockItem) {
            details.push({ name: id, stock: 0, need: totalNeed, batches: 0 });
            if (maxBatches > 0) { maxBatches = 0; limitingFactor = id + ' (Không có trong kho)'; }
        } else {
            const possible = Math.floor(stockItem.stock / totalNeed);
            details.push({ name: id, stock: stockItem.stock, need: totalNeed, batches: possible });
            if (possible < maxBatches) { maxBatches = possible; limitingFactor = id; }
        }
    });

    if (maxBatches === Infinity) { maxBatches = 9999; limitingFactor = ''; }
    details.sort((a, b) => a.batches - b.batches);

    return { maxBatches, limitingFactor, details };
  }
}
