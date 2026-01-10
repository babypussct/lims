
export const UNIT_DATA: Record<string, { type: 'mass' | 'vol' | 'qty'; val: number }> = {
  // Mass
  'g': { type: 'mass', val: 1 }, 'gram': { type: 'mass', val: 1 },
  'mg': { type: 'mass', val: 0.001 }, 'milligram': { type: 'mass', val: 0.001 },
  'kg': { type: 'mass', val: 1000 }, 'kilogram': { type: 'mass', val: 1000 },
  'µg': { type: 'mass', val: 0.000001 }, 'ug': { type: 'mass', val: 0.000001 }, 'mcg': { type: 'mass', val: 0.000001 },
  // Volume
  'ml': { type: 'vol', val: 1 }, 'milliliter': { type: 'vol', val: 1 },
  'l': { type: 'vol', val: 1000 }, 'liter': { type: 'vol', val: 1000 },
  'µl': { type: 'vol', val: 0.001 }, 'ul': { type: 'vol', val: 0.001 }, 'microliter': { type: 'vol', val: 0.001 },
  // Quantity
  'ống': { type: 'qty', val: 1 }, 'tube': { type: 'qty', val: 1 },
  'cái': { type: 'qty', val: 1 }, 'piece': { type: 'qty', val: 1 }, 'pcs': { type: 'qty', val: 1 },
  'bộ': { type: 'qty', val: 1 }, 'set': { type: 'qty', val: 1 },
  'hộp': { type: 'qty', val: 1 }, 'box': { type: 'qty', val: 1 },
  'kit': { type: 'qty', val: 1 }, 'test': { type: 'qty', val: 1 }, 'rxn': { type: 'qty', val: 1 }
};

// Standard list for Dropdowns - Prioritize ML and G
export const UNIT_OPTIONS = [
  { value: 'ml', label: 'ml (Milliliter) - Chuẩn' },
  { value: 'g', label: 'g (Gram) - Chuẩn' },
  { value: 'µl', label: 'µl (Microliter)' },
  { value: 'l', label: 'l (Liter)' },
  { value: 'mg', label: 'mg (Milligram)' },
  { value: 'kg', label: 'kg (Kilogram)' },
  { value: 'pcs', label: 'pcs (Cái)' },
  { value: 'tube', label: 'tube (Ống)' },
  { value: 'box', label: 'box (Hộp)' },
  { value: 'kit', label: 'kit (Bộ Kit)' },
  { value: 'test', label: 'test (Phản ứng)' }
];

export function getStandardizedAmount(amount: number, fromUnit: string, toUnit: string): number | null {
  if (!fromUnit || !toUnit) return amount;
  if (fromUnit.toLowerCase() === toUnit.toLowerCase()) return amount;

  // Case insensitive lookup
  const findKey = (u: string) => Object.keys(UNIT_DATA).find(k => k.toLowerCase() === u.toLowerCase().trim());
  const u1Key = findKey(fromUnit);
  const u2Key = findKey(toUnit);

  if (!u1Key || !u2Key) return null; // Unit not found

  const u1 = UNIT_DATA[u1Key];
  const u2 = UNIT_DATA[u2Key];

  if (u1.type !== u2.type) return null; // Incompatible types (e.g. mass vs vol)

  return (amount * u1.val) / u2.val;
}

export function cleanName(str: string): string {
  return str ? str.replace(/_per_/g, '/') : '';
}

export function formatNum(n: any): string {
  const val = parseFloat(n);
  return isNaN(val) ? "0" : val.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function formatDate(timestamp: any): string {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('vi-VN', { 
    hour: '2-digit', minute: '2-digit', 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  });
}

// Slugify helper for ID generation
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Change diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '_') // Spaces to underscores
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\_\_+/g, '_') // Replace multiple underscores
    .replace(/^_+/, '') // Trim underscores from start
    .replace(/_+$/, ''); // Trim underscores from end
}

/**
 * Recursively removes properties with `undefined` values from an object.
 * Firestore does not support `undefined` and will throw an error.
 * This is a defensive measure to ensure data written to Firestore is clean.
 * @param obj The object to sanitize.
 * @returns A new object with `undefined` properties removed.
 */
export function sanitizeForFirebase<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirebase(item)) as any;
  }

  // We only want to sanitize plain JavaScript objects, not special classes like Timestamps.
  if (typeof obj === 'object' && obj.constructor === Object) {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      // Use hasOwnProperty to ensure we don't process properties from the prototype chain.
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = (obj as any)[key];
        if (value !== undefined) {
          newObj[key] = sanitizeForFirebase(value);
        }
        // Properties with `undefined` are implicitly skipped.
      }
    }
    return newObj as T;
  }

  return obj;
}
