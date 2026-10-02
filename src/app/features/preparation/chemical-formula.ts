/** Conventional atomic weights for common laboratory elements, g/mol.
 * Source: https://ciaaw.org/abridged-atomic-weights.htm (2024).
 * Unsupported elements, charges and isotope notation are rejected, never guessed.
 */
const ATOMIC_WEIGHTS: Readonly<Record<string, number>> = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011,
  N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
  Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.95,
  K: 39.098, Ca: 40.078, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938,
  Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, As: 74.922,
  Se: 78.971, Br: 79.904, Sr: 87.62, Mo: 95.95, Ag: 107.87, Cd: 112.41,
  Sn: 118.71, Sb: 121.76, I: 126.90, Ba: 137.33, W: 183.84, Hg: 200.59,
  Pb: 207.2, Bi: 208.98
};

export interface ParsedChemicalFormula {
  formula: string;
  molarMass: number;
  atoms: Readonly<Record<string, number>>;
  anhydrousFormula: string | null;
}

export function normalizeFormulaText(raw: string): string {
  return raw.trim().replace(/[₀-₉]/g, digit => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(digit)))
    .replace(/[·∙]/g, '.').replace(/\s+/g, '');
}

/** Parses nested groups and dot hydrates, including CuSO4.5H2O and Ca(NO3)2. */
export function parseChemicalFormula(raw: string): ParsedChemicalFormula | null {
  const formula = normalizeFormulaText(raw);
  if (!formula || formula.length > 200 || !/^[A-Za-z0-9()[\].]+$/.test(formula)) return null;
  const atoms: Record<string, number> = {};
  const parts = formula.split('.');
  try {
    for (const [partIndex, part] of parts.entries()) {
      let pos = 0;
      const count = (): number => {
        const digits = part.slice(pos).match(/^\d+/)?.[0];
        if (!digits) return 1;
        pos += digits.length;
        const value = Number(digits);
        if (!Number.isSafeInteger(value) || value <= 0 || value > 100000) throw new Error('Invalid count');
        return value;
      };
      // A leading coefficient is only supported in dot adducts, not isotope notation.
      const multiplier = partIndex === 0 ? 1 : count();
      const group = (closing = ''): Record<string, number> => {
        const result: Record<string, number> = {};
        let terms = 0;
        while (pos < part.length && part[pos] !== closing) {
          let term: Record<string, number>;
          if (part[pos] === '(' || part[pos] === '[') {
            const end = part[pos++] === '(' ? ')' : ']';
            term = group(end);
          } else {
            const element = part.slice(pos).match(/^[A-Z][a-z]?/)?.[0];
            if (!element || !Object.hasOwn(ATOMIC_WEIGHTS, element)) throw new Error('Unknown element');
            pos += element.length;
            term = { [element]: 1 };
          }
          const n = count();
          for (const [element, amount] of Object.entries(term)) result[element] = (result[element] ?? 0) + amount * n;
          terms++;
        }
        if (!terms || (closing && part[pos++] !== closing)) throw new Error('Unbalanced group');
        return result;
      };
      const parsed = group();
      if (pos !== part.length) return null;
      for (const [element, amount] of Object.entries(parsed)) atoms[element] = (atoms[element] ?? 0) + amount * multiplier;
    }
    const molarMass = Object.entries(atoms).reduce((sum, [element, n]) => sum + ATOMIC_WEIGHTS[element] * n, 0);
    if (!Number.isFinite(molarMass) || molarMass <= 0) return null;
    const anhydrousFormula = parts.length > 1 && parts.slice(1).every(part => /^\d*H2O$/.test(part)) ? parts[0] : null;
    return { formula, molarMass, atoms, anhydrousFormula };
  } catch {
    return null;
  }
}

/** Explicit species selection is required: hydrate notation alone cannot identify the analyte. */
export function formulaSpeciesFactor(source: string, species: string): { factor: number; molarMass: number; count: number } | null {
  const salt = parseChemicalFormula(source);
  const base = parseChemicalFormula(species);
  if (!salt || !base) return null;
  const count = Math.min(...Object.entries(base.atoms).map(([element, n]) => (salt.atoms[element] ?? 0) / n));
  if (!Number.isInteger(count) || count <= 0) return null;
  const factor = count * base.molarMass / salt.molarMass;
  return factor > 0 && factor <= 1 ? { factor, molarMass: base.molarMass, count } : null;
}
