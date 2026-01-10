
import { Injectable, inject } from '@angular/core';
import { StateService } from './state.service';
import { Sop, CalculatedItem, CapacityResult, CapacityDetail } from '../models/sop.model';
import { getStandardizedAmount } from '../utils/utils';

// Helper object exposed to the Formula Evaluator as 'Chem'
const ChemHelper = {
  // C1*V1 = C2*V2 -> Calculate V1 needed (Volume of Stock)
  // Usage: Chem.dilute(1000, 10, 100) -> Need 1ml of 1000ppm to make 100ml of 10ppm
  dilute: (cStock: number, cTarget: number, vTarget: number) => {
    if (cStock === 0) return 0;
    return (cTarget * vTarget) / cStock;
  },
  
  // Calculate Molarity Mass: m = M * MW * V(liters)
  // Usage: Chem.molarMass(0.1, 58.44, 500) -> Grams of NaCl needed for 500ml 0.1M
  molarMass: (molarity: number, mw: number, volMl: number) => {
    return molarity * mw * (volMl / 1000);
  },

  // Helpers
  max: Math.max,
  min: Math.min,
  round: (num: number, decimals: number = 2) => {
    const f = Math.pow(10, decimals);
    return Math.round(num * f) / f;
  }
};

@Injectable({ providedIn: 'root' })
export class CalculatorService {
  private state = inject(StateService);

  // Safe formula evaluator
  private evalFormula(formula: string, context: Record<string, number | boolean>): number | boolean | null {
    if (!formula) return 0;
    try {
      // Inject ChemHelper and Math into scope
      const keys = [...Object.keys(context), 'Math', 'Chem'];
      const values = [...Object.values(context), Math, ChemHelper];
      
      // Use new Function with strict mode
      const func = new Function(...keys, `"use strict"; return (${formula});`);
      return func(...values);
    } catch (e) {
      // Intentionally silent for dependency resolution passes.
      return null;
    }
  }

  calculateSopNeeds(sop: Sop, inputValues: Record<string, any>, safetyMargin: number = 0): CalculatedItem[] {
    const inventory = this.state.inventoryMap();
    
    // 1. Prepare Context from Inputs
    let ctx: Record<string, any> = { ...inputValues };
    sop.inputs.forEach(inp => {
      if (ctx[inp.var] === undefined) {
        ctx[inp.var] = inp.default;
      }
    });

    // 1.5 Pre-scan formulas
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
        // console.warn(`SOP "${sop.name}" uses variable "${id}" defaulting to 0.`);
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

    const factor = 1 + (safetyMargin / 100);

    // 3. Calculate Consumables
    return sop.consumables.map(item => {
      if (item.condition) {
        const condResult = this.evalFormula(item.condition, ctx);
        if (!condResult) return null;
      }

      let baseQty = 0;
      let validationError: string | undefined = undefined;
      
      let formulaResult: number | boolean | null = null;
      try {
        formulaResult = this.evalFormula(item.formula, ctx);
      } catch (e) { }
      
      if (typeof formulaResult === 'number') {
        baseQty = formulaResult;
      } else {
        baseQty = 0;
        validationError = "Lỗi công thức";
      }

      const totalQty = baseQty * factor;
      
      let stockUnit = item.unit;
      let stockNeed = 0;
      let displayWarning: string | undefined = undefined;
      const stockItem = inventory[item.name];

      if (stockItem) {
        stockUnit = stockItem.unit;
        const converted = getStandardizedAmount(totalQty, item.unit, stockUnit);
        if (converted === null) {
          displayWarning = `(Khác ĐV: ${item.unit} != ${stockUnit})`;
          stockNeed = totalQty;
        } else {
          stockNeed = converted;
        }
      } else {
        stockNeed = totalQty;
      }

      if (item.type !== 'composite' || !item.ingredients || item.ingredients.length === 0) {
        return { 
          ...item, totalQty, stockNeed, stockUnit, isComposite: false, breakdown: [],
          displayWarning, validationError 
        } as CalculatedItem;
      }

      const breakdown = (item.ingredients || []).map(ing => {
        let ingStockUnit = ing.unit;
        let ingWarning: string | undefined = undefined;
        let ingTotalNeed = 0;
        const ingStockItem = inventory[ing.name];
        const amountPerBatch = totalQty * ing.amount;

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
          ingTotalNeed = amountPerBatch;
        }

        return {
          name: ing.name, unit: ing.unit, amountPerUnit: ing.amount,
          totalNeed: ingTotalNeed, displayAmount: amountPerBatch,
          stockUnit: ingStockUnit, displayWarning: ingWarning
        };
      });

      return {
        ...item, totalQty, stockNeed, stockUnit, isComposite: true, breakdown,
        displayWarning, validationError
      } as CalculatedItem;

    }).filter(i => i !== null) as CalculatedItem[];
  }

  /**
   * Calculates capacity based on inventory.
   * @param sop The SOP to check
   * @param mode 'marginal' (1 sample, 0 QC) OR 'standard' (SOP defaults)
   */
  calculateCapacity(sop: Sop, mode: 'marginal' | 'standard' = 'marginal'): CapacityResult {
    const capacityInputs: Record<string, any> = {};
    
    // Initialize with defaults
    sop.inputs.forEach(inp => {
        capacityInputs[inp.var] = inp.default;
    });

    // Override logic based on Mode
    if (mode === 'marginal') {
        sop.inputs.forEach(inp => {
            if (inp.var.includes('sample')) capacityInputs[inp.var] = 1;
            if (inp.var.includes('qc')) capacityInputs[inp.var] = 0;
        });
    }
    // If 'standard', we just use the defaults already set above.

    const needs = this.calculateSopNeeds(sop, capacityInputs, 0);
    const inventory = this.state.inventoryMap();
    
    // --- AGGREGATION LOGIC ---
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

    // Now calculate capacity based on aggregated needs
    aggregatedNeeds.forEach((totalNeed, id) => {
        const stockItem = inventory[id];
        
        if (!stockItem) {
            details.push({ name: id, stock: 0, need: totalNeed, batches: 0 });
            if (maxBatches > 0) { maxBatches = 0; limitingFactor = id + ' (Không có trong kho)'; }
        } else {
            const possible = Math.floor(stockItem.stock / totalNeed);
            details.push({ name: id, stock: stockItem.stock, need: totalNeed, batches: possible });
            if (possible < maxBatches) { maxBatches = possible; limitingFactor = id; }
        }
    });

    if (maxBatches === Infinity) {
        maxBatches = 9999; 
        limitingFactor = '';
    }

    details.sort((a, b) => a.batches - b.batches);

    return { maxBatches, limitingFactor, details };
  }
}
