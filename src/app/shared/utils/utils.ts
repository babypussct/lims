import { ReferenceStandard } from '../../core/models/standard.model';
import { isStandardExpired, parseStandardDate, startOfLocalDay } from './standard-fefo';
export { canAssign } from './standard-fefo';

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
  return isNaN(val) ? "0" : val.toLocaleString('en-US', { maximumFractionDigits: 6 });
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
    .replace(/[\s\-]+/g, '_')
    .replace(/[^\w_]+/g, '')
    .replace(/\_+/g, '_')
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
export function getAvatarUrl(name: string | undefined | null, style = 'bottts-neutral', photoUrl?: string | null): string {
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
export function formatSampleList(
    samplesInput: string[] | Set<string> | undefined | null,
    options: { prefixFirst?: boolean } = {}
): string {
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

    interface SampleParts {
        prefix: string;
        middleStr: string;
        middleVal: number;
        suffix: string;
        isStandard: boolean;
    }

    const parseSampleName = (s: string): SampleParts => {
        // Case A: Standard LIMS format ending in 2-digit suffix (e.g. U0123 -> prefix "U", middle "01", suffix "23")
        if (s.length >= 3 && /^\d{2}$/.test(s.slice(-2))) {
            const suffix = s.slice(-2);
            const rest = s.slice(0, -2);
            const match = rest.match(/^([a-zA-Z]*)(\d+)$/);
            if (match) {
                return {
                    prefix: match[1],
                    middleStr: match[2],
                    middleVal: parseInt(match[2], 10),
                    suffix: suffix,
                    isStandard: true
                };
            }
        }

        // Case B: Simple sequential ending in digits (e.g. U1 -> prefix "U", middle "1", suffix "")
        const match = s.match(/^([a-zA-Z]*)(\d+)$/);
        if (match) {
            return {
                prefix: match[1],
                middleStr: match[2],
                middleVal: parseInt(match[2], 10),
                suffix: '',
                isStandard: true
            };
        }

        // Case C: Fallback for non-standard labels
        return {
            prefix: s,
            middleStr: '',
            middleVal: NaN,
            suffix: '',
            isStandard: false
        };
    };

    const parsed = samples.map(s => ({
        orig: s,
        parts: parseSampleName(s)
    }));

    // Sort parsed samples: Standard first (by prefix, then suffix, then middleVal numerically), then non-standard naturally
    parsed.sort((a, b) => {
        const ap = a.parts;
        const bp = b.parts;
        if (ap.isStandard && bp.isStandard) {
            if (ap.prefix !== bp.prefix) {
                if (options.prefixFirst) {
                    if (!ap.prefix && bp.prefix) return 1;
                    if (ap.prefix && !bp.prefix) return -1;
                }
                return ap.prefix.localeCompare(bp.prefix);
            }
            if (ap.suffix !== bp.suffix) {
                return ap.suffix.localeCompare(bp.suffix);
            }
            return ap.middleVal - bp.middleVal;
        }
        if (ap.isStandard !== bp.isStandard) {
            return ap.isStandard ? -1 : 1;
        }
        return a.orig.localeCompare(b.orig, undefined, { numeric: true, sensitivity: 'base' });
    });

    const isSequential = (prev: typeof parsed[0], curr: typeof parsed[0]): boolean => {
        const pp = prev.parts;
        const cp = curr.parts;
        if (pp.isStandard && cp.isStandard) {
            return pp.prefix === cp.prefix &&
                   pp.suffix === cp.suffix &&
                   cp.middleVal === pp.middleVal + 1;
        }
        return false;
    };

    const ranges: string[] = [];
    let start = parsed[0];
    let prev = parsed[0];
    let count = 1;

    for (let i = 1; i < parsed.length; i++) {
        const curr = parsed[i];
        if (isSequential(prev, curr)) {
            prev = curr;
            count++;
        } else {
            if (count === 1) { ranges.push(start.orig); } 
            else if (count === 2) { ranges.push(`${start.orig}; ${prev.orig}`); } 
            else { ranges.push(`${start.orig} -> ${prev.orig}`); } 
            
            start = curr;
            prev = curr;
            count = 1;
        }
    }

    if (count === 1) { ranges.push(start.orig); } 
    else if (count === 2) { ranges.push(`${start.orig}; ${prev.orig}`); } 
    else { ranges.push(`${start.orig} -> ${prev.orig}`); } 
    
    return ranges.join('; ');
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

// --- STANDARD UI HELPERS ---

export function getExpiryBarClass(dateStr: string | undefined): string {
    if (!dateStr) return 'bg-slate-300';
    const exp = parseStandardDate(dateStr);
    if (exp === null) return 'bg-slate-300';
    const today = startOfLocalDay();
    if (exp < today) return 'bg-red-500';
    const diffDays = (exp - today) / (1000 * 3600 * 24);
    if (diffDays < 180) return 'bg-orange-500'; 
    return 'bg-emerald-500';
}

export function getExpiryStatus(dateStr: string | undefined): string {
    if (!dateStr) return 'N/A';
    const exp = parseStandardDate(dateStr);
    if (exp === null) return 'N/A';
    const today = startOfLocalDay();
    if (exp < today) return 'Hết hạn';
    const diffMonths = (exp - today) / (1000 * 3600 * 24 * 30);
    if (diffMonths < 6) return '< 6 Tháng'; 
    return 'Còn hạn';
}

export function getExpiryStatusClass(dateStr: string | undefined): string {
    if (!dateStr) return 'border-slate-200 text-slate-400 bg-slate-50';
    const exp = parseStandardDate(dateStr);
    if (exp === null) return 'border-slate-200 text-slate-400 bg-slate-50';
    const today = startOfLocalDay();
    if (exp < today) return 'border-red-200 text-red-600 bg-red-50';
    const diffMonths = (exp - today) / (1000 * 3600 * 24 * 30);
    if (diffMonths < 6) return 'border-orange-200 text-orange-600 bg-orange-50';
    return 'border-emerald-200 text-emerald-600 bg-emerald-50';
}

export function getStorageInfo(condition: string | undefined): { icon: string, color: string, bg: string, border: string, text: string }[] {
    if (!condition) return [];
    const items: { icon: string, color: string, bg: string, border: string, text: string }[] = [];
    const lower = condition.toLowerCase();
    
    if (lower.includes('ft') || lower.includes('tủ đông') || lower.includes('-20')) { 
        items.push({ icon: 'fa-snowflake', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', text: 'Tủ đông (-20°C)' }); 
    }
    if (lower.includes('df') || lower.includes('-80') || lower.includes('-70')) { 
        items.push({ icon: 'fa-icicles', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', text: 'Đông sâu (-70°C)' }); 
    }
    if (lower.includes('ct') || lower.includes('tủ mát') || lower.includes('2-8')) { 
        items.push({ icon: 'fa-temperature-low', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'Tủ mát (2-8°C)' }); 
    }
    if (lower.includes('rt') || lower.includes('tủ c') || lower.includes('thường')) { 
        items.push({ icon: 'fa-sun', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', text: 'Nhiệt độ phòng' }); 
    }
    if (lower.includes('d:') || lower.match(/\bd\b/) || lower.includes('tối') || lower.includes('dark')) { 
        items.push({ icon: 'fa-moon', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', text: 'Tránh ánh sáng' }); 
    }
    
    if (items.length === 0 && condition.trim().length > 0) {
        items.push({ icon: 'fa-box', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', text: condition });
    }

    return items;
}

export function getExpiryClass(dateStr: string | undefined): string {
    if (!dateStr) return 'text-slate-400';
    const exp = parseStandardDate(dateStr);
    if (exp === null) return 'text-slate-400';
    const today = startOfLocalDay();
    if (exp < today) return 'text-red-600 line-through decoration-2';
    const diffMonths = (exp - today) / (1000 * 3600 * 24 * 30);
    if (diffMonths < 6) return 'text-orange-600'; 
    return 'text-indigo-600'; 
}

export function getExpiryTimeClass(dateStr: string | undefined): string {
    if (!dateStr) return 'text-slate-400 italic';
    const exp = parseStandardDate(dateStr);
    if (exp === null) return 'text-slate-400 italic';
    const diffDays = Math.round((exp - startOfLocalDay()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'text-red-600 font-bold';
    if (diffDays < 180) return 'text-orange-600 font-bold';
    return 'text-emerald-600 font-bold';
}

export function getExpiryTimeLeft(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const exp = parseStandardDate(dateStr);
    if (exp === null) return 'Hạn dùng không hợp lệ';
    const diffDays = Math.round((exp - startOfLocalDay()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Đã hết hạn ${Math.abs(diffDays)} ngày`;
    if (diffDays === 0) return 'Hết hạn hôm nay';
    return `Còn ${diffDays} ngày`;
}

export function getStandardStatus(std: ReferenceStandard): { label: string, class: string } {
    if (std.status === 'IN_USE') return { label: 'Đang dùng', class: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' };
    if (std.status === 'DEPLETED' || std.current_amount <= 0) return { label: 'Sử dụng hết', class: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' };
    // Guard: nếu standard đang có current_holder (đã được cấp phát), ưu tiên trạng thái Firestore thực
    // hơn flag has_pending_request có thể còn stale trong cache
    if (std.has_pending_request && !std.current_holder && !std.current_request_id) return { label: 'Chờ duyệt', class: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50' };
    
    if (!std.expiry_date) return { label: 'Chưa rõ hạn', class: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' };
    
    const exp = parseStandardDate(std.expiry_date);
    if (exp === null) return { label: 'Hạn không hợp lệ', class: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50' };
    const today = startOfLocalDay();

    if (isStandardExpired(std.expiry_date)) return { label: 'Hết hạn SD', class: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50' };
    
    const diffDays = (exp - today) / (1000 * 3600 * 24);
    if (diffDays < 180) return { label: 'Sắp hết hạn', class: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' };
    
    if ((std.current_amount / (std.initial_amount || 1)) <= 0.2) return { label: 'Sắp hết hàng', class: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' };

    return { label: 'Sẵn sàng', class: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' };
}

export function getSafeGoogleUrl(url: string | null | undefined, type: 'pdf' | 'doc'): string {
    if (!url) return '';
    
    // For PDFs: transform drive.usercontent.com/download?id=... or export=download to drive.google.com/file/d/.../view
    if (type === 'pdf') {
        if (url.includes('drive.usercontent.com/download') || url.includes('export=download')) {
            try {
                const urlObj = new URL(url);
                const id = urlObj.searchParams.get('id');
                if (id) {
                    return `https://drive.google.com/file/d/${id}/view`;
                }
            } catch(e) {
                // Ignore parse errors and fallback to original
            }
        }
        return url;
    }
    
    // For Docs (View Only): transform /edit to /preview to enforce Read-Only mode
    if (type === 'doc') {
        if (url.includes('docs.google.com/document/d/')) {
            return url.replace(/\/edit.*$/, '/preview');
        }
        return url;
    }
    
    return url;
}
