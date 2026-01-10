
import { Injectable, inject } from '@angular/core';
import { StateService } from './state.service';
import { Sop, CalculatedItem, CapacityResult, CapacityDetail } from '../models/sop.model';
import { getStandardizedAmount } from '../../shared/utils/utils';

const ChemHelper = {
  dilute: (cStock: number, cTarget: number, vTarget: number) => cStock === 0 ? 0 : (cTarget * vTarget) / cStock,
  molarMass: (molarity: number, mw: number, volMl: number) => molarity * mw * (volMl / 1000),
  max: Math.max,
  min: Math.min,
  round: (num: number, decimals: number = 2) => { const f = Math.pow(10, decimals); return Math.round(num * f) / f; }
};

@Injectable({ providedIn: 'root' })
export class CalculatorService {
  private state = inject(StateService);

  private evalFormula(formula: string, context: Record<string, number | boolean>): number | boolean | null {
    if (!formula) return 0;
    try {
      const keys = [...Object.keys(context), 'Math', 'Chem'];
      const values = [...Object.values(context), Math, ChemHelper];
      const func = new Function(...keys, `"use strict"; return (${formula});`);
      return func(...values);
    } catch (e) { return null; }
  }

  calculateSopNeeds(sop: Sop, inputValues: Record<string, any>, safetyMargin: number = 0): CalculatedItem[] {
    const inventory = this.state.inventoryMap();
    let ctx: Record<string, any> = { ...inputValues };
    sop.inputs.forEach(inp => { if (ctx[inp.var] === undefined) ctx[inp.var] = inp.default; });

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
          if (val !== null) { ctx[key] = val; resolvedKeys.add(key); changedInPass = true; }
        }
        passes++;
      }
      if (resolvedKeys.size < varEntries.length) varEntries.forEach(([key]) => { if(!resolvedKeys.has(key)) ctx[key] = 0; });
    }

    const factor = 1 + (safetyMargin / 100);

    return sop.consumables.map(item => {
      if (item.condition) {
        const condResult = this.evalFormula(item.condition, ctx);
        if (!condResult) return null;
      }
      let baseQty = 0;
      let formulaResult: any = null;
      try { formulaResult = this.evalFormula(item.formula, ctx); } catch (e) { }
      baseQty = (typeof formulaResult === 'number') ? formulaResult : 0;
      const totalQty = baseQty * factor;
      
      let stockUnit = item.unit;
      let stockNeed = 0;
      let displayWarning: string | undefined = undefined;
      const stockItem = inventory[item.name];

      if (stockItem) {
        stockUnit = stockItem.unit;
        const converted = getStandardizedAmount(totalQty, item.unit, stockUnit);
        if (converted === null) { displayWarning = `(Khác ĐV: ${item.unit} != ${stockUnit})`; stockNeed = totalQty; } 
        else { stockNeed = converted; }
      } else { stockNeed = totalQty; }

      if (item.type !== 'composite' || !item.ingredients || item.ingredients.length === 0) {
        return { ...item, totalQty, stockNeed, stockUnit, isComposite: false, breakdown: [], displayWarning } as CalculatedItem;
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
          if (converted === null) { ingWarning = `(Khác ĐV: ${ing.unit} != ${ingStockUnit})`; ingTotalNeed = amountPerBatch; } 
          else { ingTotalNeed = converted; }
        } else { ingTotalNeed = amountPerBatch; }
        return { name: ing.name, unit: ing.unit, amountPerUnit: ing.amount, totalNeed: ingTotalNeed, displayAmount: amountPerBatch, stockUnit: ingStockUnit, displayWarning: ingWarning };
      });

      return { ...item, totalQty, stockNeed, stockUnit, isComposite: true, breakdown, displayWarning } as CalculatedItem;
    }).filter(i => i !== null) as CalculatedItem[];
  }

  calculateCapacity(sop: Sop, mode: 'marginal' | 'standard' = 'marginal'): CapacityResult {
    const capacityInputs: Record<string, any> = {};
    sop.inputs.forEach(inp => { capacityInputs[inp.var] = inp.default; });
    if (mode === 'marginal') {
        sop.inputs.forEach(inp => { if (inp.var.includes('sample')) capacityInputs[inp.var] = 1; if (inp.var.includes('qc')) capacityInputs[inp.var] = 0; });
    }
    const needs = this.calculateSopNeeds(sop, capacityInputs, 0);
    const inventory = this.state.inventoryMap();
    const aggregatedNeeds = new Map<string, number>();

    needs.forEach(item => {
      const itemsToCheck = item.isComposite ? item.breakdown : [item];
      itemsToCheck.forEach((ing: any) => {
          if (ing.name && (ing.totalNeed ?? ing.stockNeed) > 0) {
             aggregatedNeeds.set(ing.name, (aggregatedNeeds.get(ing.name) || 0) + (ing.totalNeed ?? ing.stockNeed));
          }
      });
    });

    let maxBatches = Infinity;
    let limitingFactor = '';
    const details: CapacityDetail[] = [];

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

    if (maxBatches === Infinity) { maxBatches = 9999; limitingFactor = ''; }
    details.sort((a, b) => a.batches - b.batches);
    return { maxBatches, limitingFactor, details };
  }
}