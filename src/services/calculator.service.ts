
import { Injectable, inject } from '@angular/core';
import { StateService } from './state.service';
import { Sop, CalculatedItem, CapacityResult, CapacityDetail } from '../models/sop.model';
import { getStandardizedAmount } from '../utils/utils';

@Injectable({ providedIn: 'root' })
export class CalculatorService {
  private state = inject(StateService);

  // Safe formula evaluator
  private evalFormula(formula: string, context: Record<string, number | boolean>): number | boolean | null {
    if (!formula) return 0;
    try {
      const keys = [...Object.keys(context), 'Math'];
      const values = [...Object.values(context), Math];
      // Use new Function with strict mode
      const func = new Function(...keys, `"use strict"; return (${formula});`);
      return func(...values);
    } catch (e) {
      console.warn(`Formula error: ${formula}`, e);
      return null;
    }
  }

  calculateSopNeeds(sop: Sop, inputValues: Record<string, any>, safetyMargin: number = 0): CalculatedItem[] {
    const inventory = this.state.inventoryMap(); // Snapshot of inventory
    
    // 1. Prepare Context (Inputs)
    let ctx = { ...inputValues };
    sop.inputs.forEach(inp => {
      if (ctx[inp.var] === undefined) ctx[inp.var] = inp.default;
    });

    // 2. Resolve Intermediate Variables (3 Passes)
    if (sop.variables) {
      let passes = 0;
      while (passes < 3) {
        for (const [key, formula] of Object.entries(sop.variables)) {
          const val = this.evalFormula(formula, ctx);
          ctx[key] = (val === null) ? 0 : val;
        }
        passes++;
      }
    }

    const factor = 1 + (safetyMargin / 100);

    // 3. Calculate Consumables
    return sop.consumables.map(item => {
      // Check Condition
      if (item.condition) {
        const condResult = this.evalFormula(item.condition, ctx);
        if (!condResult) return null;
      }

      let baseQty = 0;
      let validationError: string | undefined = undefined;

      // Calculate Base Quantity
      const formulaResult = this.evalFormula(item.formula, ctx);
      if (typeof formulaResult === 'number') {
        baseQty = formulaResult;
      } else {
        baseQty = 0;
        validationError = "Lỗi công thức";
      }

      const totalQty = baseQty * factor;
      
      // Stock Check & Unit Compatibility (Parent Item)
      let stockUnit = item.unit;
      let stockNeed = 0;
      let displayWarning: string | undefined = undefined;
      const stockItem = inventory[item.name];

      if (stockItem) {
        stockUnit = stockItem.unit;
        const converted = getStandardizedAmount(totalQty, item.unit, stockUnit);
        if (converted === null) {
          displayWarning = `(Khác ĐV: ${item.unit} != ${stockUnit})`;
          stockNeed = totalQty; // Fallback 1:1
        } else {
          stockNeed = converted;
        }
      } else {
        stockNeed = totalQty; // Virtual or not in stock
      }

      // Handle Composites
      if (item.type !== 'composite' && (!item.ingredients || item.ingredients.length === 0)) {
        return { 
          ...item, 
          totalQty, 
          stockNeed,
          stockUnit,
          isComposite: false, 
          breakdown: [],
          displayWarning, 
          validationError 
        } as CalculatedItem;
      }

      // Process Ingredients
      const breakdown = (item.ingredients || []).map(ing => {
        let ingStockUnit = ing.unit;
        let ingWarning: string | undefined = undefined;
        let ingTotalNeed = 0;
        const ingStockItem = inventory[ing.name];

        const amountPerBatch = totalQty * ing.amount; // totalQty here is usually "Number of Reactions"

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
          name: ing.name,
          unit: ing.unit,
          amountPerUnit: ing.amount,
          totalNeed: ingTotalNeed, // Stock Unit
          displayAmount: amountPerBatch, // Display Unit
          stockUnit: ingStockUnit,
          displayWarning: ingWarning
        };
      });

      return {
        ...item, 
        totalQty, 
        stockNeed, // Usually 0 for virtual composites, or Box count if stocked
        stockUnit,
        isComposite: true, 
        breakdown,
        displayWarning, 
        validationError
      } as CalculatedItem;

    }).filter(i => i !== null) as CalculatedItem[];
  }

  // Calculate Capacity (simplified for updated logic)
  calculateCapacity(sop: Sop, inputValues: any): CapacityResult {
    const needs = this.calculateSopNeeds(sop, inputValues, 0);
    const inventory = this.state.inventoryMap();
    
    let maxBatches = Infinity;
    let limitingFactor = '';
    const details: CapacityDetail[] = [];

    needs.forEach(item => {
      const itemsToCheck = item.isComposite ? item.breakdown : [item];
      
      itemsToCheck.forEach((ing: any) => {
        // ing is either CalculatedIngredient or CalculatedItem
        const need = ing.totalNeed ?? ing.stockNeed;
        const name = ing.name;
        if(!name) return;

        const stockItem = inventory[name];
        if(!stockItem) {
           details.push({ name, stock: 0, need, batches: 0 });
           if(maxBatches > 0) { maxBatches = 0; limitingFactor = name + ' (N/A)'; }
           return;
        }

        if(need > 0) {
           const possible = Math.floor(stockItem.stock / need);
           details.push({ name, stock: stockItem.stock, need, batches: possible });
           if(possible < maxBatches) { maxBatches = possible; limitingFactor = name; }
        }
      });
    });

    if(maxBatches === Infinity) maxBatches = 0;
    if(needs.length === 0) maxBatches = 9999;

    return { maxBatches, limitingFactor, details };
  }
}
