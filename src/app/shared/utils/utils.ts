
export const UNIT_DATA: Record<string, { type: 'mass' | 'vol' | 'qty'; val: number }> = {
  // Mass (Base: g)
  'g': { type: 'mass', val: 1 }, 'gram': { type: 'mass', val: 1 },
  'mg': { type: 'mass', val: 0.001 }, 'milligram': { type: 'mass', val: 0.001 },
  'kg': { type: 'mass', val: 1000 }, 'kilogram': { type: 'mass', val: 1000 },
  'µg': { type: 'mass', val: 0.000001 }, 'ug': { type: 'mass', val: 0.000001 }, 'mcg': { type: 'mass', val: 0.000001 },
  // Volume (Base: ml)
  'ml': { type: 'vol', val: 1 }, 'milliliter': { type: 'vol', val: 1 },
  'l': { type: 'vol', val: 1000 }, 'liter': { type: 'vol', val: 1000 },
  'µl': { type: 'vol', val: 0.001 }, 'ul': { type: 'vol', val: 0.001 }, 'microliter': { type: 'vol', val: 0.001 },
  // Quantity (Base: pcs)
  'ống': { type: 'qty', val: 1 }, 'tube': { type: 'qty', val: 1 },
  'cái': { type: 'qty', val: 1 }, 'piece': { type: 'qty', val: 1 }, 'pcs': { type: 'qty', val: 1 },
  'bộ': { type: 'qty', val: 1 }, 'set': { type: 'qty', val: 1 },
  'hộp': { type: 'qty', val: 1 }, 'box': { type: 'qty', val: 1 },
  'kit': { type: 'qty', val: 1 }, 'test': { type: 'qty', val: 1 }, 'rxn': { type: 'qty', val: 1 }
};

export const UNIT_OPTIONS = [
  { value: 'ml', label: 'ml (Milliliter)' },
  { value: 'l', label: 'l (Lít)' },
  { value: 'µl', label: 'µl (Microliter)' },
  { value: 'g', label: 'g (Gram)' },
  { value: 'kg', label: 'kg (Kilogram)' },
  { value: 'mg', label: 'mg (Milligram)' },
  { value: 'pcs', label: 'pcs (Cái)' },
  { value: 'tube', label: 'tube (Ống)' },
  { value: 'box', label: 'box (Hộp)' },
  { value: 'kit', label: 'kit (Bộ Kit)' },
  { value: 'test', label: 'test (Phản ứng)' }
];

export function getStandardizedAmount(amount: number, fromUnit: string, toUnit: string): number | null {
  if (!fromUnit || !toUnit) return amount;
  if (fromUnit.toLowerCase() === toUnit.toLowerCase()) return amount;

  const findKey = (u: string) => Object.keys(UNIT_DATA).find(k => k.toLowerCase() === u.toLowerCase().trim());
  const u1Key = findKey(fromUnit);
  const u2Key = findKey(toUnit);

  if (!u1Key || !u2Key) return null;

  const u1 = UNIT_DATA[u1Key];
  const u2 = UNIT_DATA[u2Key];

  if (u1.type !== u2.type) return null;

  return (amount * u1.val) / u2.val;
}

export function parseQuantityInput(inputStr: string, baseUnit: string): number | null {
    if (!inputStr) return null;
    const cleanStr = inputStr.trim().toLowerCase().replace(',', '.');
    const match = cleanStr.match(/^([+-]?\d*(?:\.\d+)?)\s*([a-zA-Z\u00C0-\u024F\u1E00-\u1EFF%]*)$/);
    if (!match) return null;
    const val = parseFloat(match[1]);
    const unitSuffix = match[2].trim();
    if (isNaN(val)) return null;
    if (!unitSuffix) return val;
    return getStandardizedAmount(val, unitSuffix, baseUnit);
}

export function normalizeInventoryItem(item: any): any {
    const unitKey = Object.keys(UNIT_DATA).find(k => k.toLowerCase() === (item.unit || '').toLowerCase().trim());
    if (!unitKey) return item; 
    const type = UNIT_DATA[unitKey].type;
    let targetUnit = item.unit;
    if (type === 'mass') targetUnit = 'g';
    else if (type === 'vol') targetUnit = 'ml';
    else return item; 
    if (targetUnit !== item.unit) {
        const newStock = getStandardizedAmount(item.stock || 0, item.unit, targetUnit);
        const newThreshold = getStandardizedAmount(item.threshold || 0, item.unit, targetUnit);
        return {
            ...item,
            unit: targetUnit,
            stock: newStock !== null ? newStock : item.stock,
            threshold: newThreshold !== null ? newThreshold : item.threshold
        };
    }
    return item;
}

export function formatSmartUnit(amount: number, unit: string): string {
    if (amount === 0) return `0 <span class="text-[10px] text-slate-400">${unit}</span>`;
    if (unit === 'ml') {
        if (amount >= 1000) return `${formatNum(amount / 1000)} <span class="text-[10px] text-slate-400">L</span>`;
        if (amount < 1 && amount > 0) return `${formatNum(amount * 1000)} <span class="text-[10px] text-slate-400">µl</span>`;
    }
    if (unit === 'g') {
        if (amount >= 1000) return `${formatNum(amount / 1000)} <span class="text-[10px] text-slate-400">kg</span>`;
        if (amount < 1 && amount > 0) return `${formatNum(amount * 1000)} <span class="text-[10px] text-slate-400">mg</span>`;
    }
    return `${formatNum(amount)} <span class="text-[10px] text-slate-400">${unit}</span>`;
}

export function cleanName(str: string): string {
  return str ? str.replace(/_per_/g, '/') : '';
}

export function formatNum(n: any): string {
  const val = parseFloat(n);
  return isNaN(val) ? "0" : val.toLocaleString('en-US', { maximumFractionDigits: 3 });
}

export function formatDate(timestamp: any): string {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('vi-VN', { 
    hour: '2-digit', minute: '2-digit', 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  });
}

export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .replace(/\_\_+/g, '_')
    .replace(/^_+/, '')
    .replace(/_+$/, '');
}

export function sanitizeForFirebase<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(item => sanitizeForFirebase(item)) as any;
  if (typeof obj === 'object' && obj.constructor === Object) {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = (obj as any)[key];
        if (value !== undefined) newObj[key] = sanitizeForFirebase(value);
      }
    }
    return newObj as T;
  }
  return obj;
}

/**
 * Generates an avatar URL.
 * - If style is 'google': use the real Google photo (photoUrl) if available, fallback to initials.
 * - Otherwise: always use DiceBear with the selected style (ignore photoUrl).
 */
export function getAvatarUrl(name: string | undefined | null, style = 'initials', photoUrl?: string | null): string {
  // 1. When user explicitly chose Google photo style
  if (style === 'google') {
      if (photoUrl && photoUrl.trim() !== '') {
          return photoUrl;
      }
      // Fallback to initials if no Google photo
      const seed = encodeURIComponent(name || 'User');
      return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
  }

  // 2. Use DiceBear with the selected style
  const seed = encodeURIComponent(name || 'User');
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
}

export function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Smartly compresses a list of samples.
 * Uses '->' (ASCII) instead of unicode arrow to ensure PDF compatibility.
 */
export function formatSampleList(samplesInput: string[] | Set<string> | undefined | null): string {
    if (!samplesInput) return '';
    
    let samples: string[] = [];
    if (samplesInput instanceof Set) {
        samples = Array.from(samplesInput);
    } else if (Array.isArray(samplesInput)) {
        samples = [...samplesInput];
    } else {
        return '';
    }

    if (samples.length === 0) return '';

    samples.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    const isSequential = (prev: string, curr: string): boolean => {
        if (!prev || !curr) return false;
        let pLen = 0;
        const minLen = Math.min(prev.length, curr.length);
        while (pLen < minLen && prev[pLen] === curr[pLen]) { pLen++; }
        let sLen = 0;
        while (sLen < minLen - pLen && prev[prev.length - 1 - sLen] === curr[curr.length - 1 - sLen]) { sLen++; }
        const prevMid = prev.substring(pLen, prev.length - sLen);
        const currMid = curr.substring(pLen, curr.length - sLen);
        if (!prevMid || !currMid || !/^\d+$/.test(prevMid) || !/^\d+$/.test(currMid)) { return false; }
        const prevNum = parseInt(prevMid, 10);
        const currNum = parseInt(currMid, 10);
        return currNum === prevNum + 1;
    };

    const ranges: string[] = [];
    let start = samples[0];
    let prev = samples[0];
    let count = 1;

    for (let i = 1; i < samples.length; i++) {
        const curr = samples[i];
        if (isSequential(prev, curr)) {
            prev = curr;
            count++;
        } else {
            if (count === 1) { ranges.push(start); } 
            else if (count === 2) { ranges.push(`${start}, ${prev}`); } 
            else { ranges.push(`${start} -> ${prev}`); } 
            
            start = curr;
            prev = curr;
            count = 1;
        }
    }

    if (count === 1) { ranges.push(start); } 
    else if (count === 2) { ranges.push(`${start}, ${prev}`); } 
    else { ranges.push(`${start} -> ${prev}`); } 
    
    return ranges.join(', ');
}

/**
 * Calculates a similarity score between a search query (such as a search term or a filename)
 * and a standard's database properties. Used for search relevance and auto-matching.
 */
export function calculateSimilarityScore(query: string, std: any): number {
    if (!query || !std) return 0;
    let score = 0;
    
    // Normalize and strip non-alphanumeric from both query and properties
    const queryClean = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    if (!queryClean) return 0;

    const lotClean = (std.lot_number || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const codeClean = (std.product_code || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const casClean = (std.cas_number || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const nameClean = (std.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const chemicalClean = (std.chemical_name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const manufacturerClean = (std.manufacturer || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

    // High Priority Match: Exact Match on identifiers (Useful when searching exact Lot)
    if (lotClean && lotClean.length > 2 && lotClean === queryClean) score += 200;
    // Query contains the standard's lot (Useful when parsing Filename)
    else if (lotClean && lotClean !== 'na' && lotClean.length > 2 && queryClean.includes(lotClean)) score += 100;
    
    if (codeClean && codeClean.length > 2 && codeClean === queryClean) score += 150;
    else if (codeClean && codeClean !== 'na' && codeClean.length > 2 && queryClean.includes(codeClean)) score += 80;
    
    if (casClean && casClean.length > 4 && casClean === queryClean) score += 100;
    else if (casClean && casClean.length > 4 && queryClean.includes(casClean)) score += 40;

    // Medium Priority: Name matching
    if (nameClean && nameClean === queryClean) score += 120;
    else if (nameClean && nameClean.length > 5 && queryClean.includes(nameClean.substring(0, 10))) score += 50;
    else if (nameClean && nameClean.length > 3 && queryClean.includes(nameClean.substring(0, 5))) score += 20;

    // Medium/Low Priority: Chemical Name & Manufacturer
    if (chemicalClean && chemicalClean === queryClean) score += 60;
    else if (chemicalClean && chemicalClean.length > 5 && queryClean.includes(chemicalClean.substring(0, 10))) score += 30;
    
    if (manufacturerClean && manufacturerClean === queryClean) score += 30;
    
    // Reverse inclusion (Standard's property contains the query) - Used for global SEARCH typed by user
    if (queryClean.length >= 2) {
        if (lotClean.includes(queryClean)) score += 60;
        if (codeClean.includes(queryClean)) score += 50;
        if (nameClean.includes(queryClean)) score += 40;
        if (chemicalClean.includes(queryClean)) score += 20;
    }

    return score;
}
