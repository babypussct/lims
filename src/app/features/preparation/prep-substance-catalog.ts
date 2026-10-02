import type { ConcentrationDraft, PrepSourceType } from './prep-domain.types';
import { parseChemicalFormula, normalizeFormulaText } from './chemical-formula';
import { PRESET_CHEMICALS } from './prep-calculation.engine';

export interface PrepSubstanceOption {
  id: string;
  name: string;
  origin: 'library' | 'formula';
  sourceType: PrepSourceType;
  formula: string | null;
  molarMass: number | null;
  densityGPerMl: number | null;
  potencyPercent: number | null;
  concentration: ConcentrationDraft | null;
  species: readonly string[];
  detail: string;
  searchText: string;
}

export function normalizeSubstanceSearch(raw: string): string {
  return normalizeFormulaText(raw).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
}

const SOLIDS = [
  ['NaCl', 'Natri clorid sodium chloride', []],
  ['NaOH', 'Natri hydroxid sodium hydroxide', []],
  ['CaCO3', 'Calci carbonat calcium carbonate', ['Ca']],
  ['CuSO4.5H2O', 'Đồng sulfat copper sulfate pentahydrate', ['Cu', 'CuSO4']],
  ['FeSO4.7H2O', 'Sắt sulfat iron sulfate heptahydrate', ['Fe', 'FeSO4']],
  ['Na2S2O3.5H2O', 'Natri thiosulfat sodium thiosulfate pentahydrate', ['Na2S2O3']],
  ['K2Cr2O7', 'Kali dicromat potassium dichromate', ['Cr']],
  ['KMnO4', 'Kali permanganat potassium permanganate', ['Mn']],
  ['AgNO3', 'Bạc nitrat silver nitrate', ['Ag']],
  ['Na2CO3', 'Natri carbonat sodium carbonate', []],
  ['C10H14N2Na2O8.2H2O', 'EDTA-2Na dihydrat disodium EDTA', ['C10H14N2Na2O8']],
  ['KH2PO4', 'Kali dihydrogen phosphat potassium phosphate đệm buffer', []],
  ['Na2HPO4.12H2O', 'Dinatri hydrogen phosphat đệm buffer', ['Na2HPO4']],
  ['CH3COONa.3H2O', 'Natri acetat sodium acetate trihydrate đệm buffer', ['CH3COONa']]
] as const;

export const PREP_SUBSTANCE_LIBRARY: readonly PrepSubstanceOption[] = [
  ...PRESET_CHEMICALS.map(preset => ({
    id: preset.id, name: preset.name, origin: 'library' as const, sourceType: 'concentrate' as const,
    formula: normalizeFormulaText(preset.name.split(' ')[0]), molarMass: preset.molarMass,
    densityGPerMl: preset.densityGPerMl, potencyPercent: null,
    concentration: { value: preset.massPercent, unit: '% w/w', basis: 'mass_fraction' as const, densityGPerMl: preset.densityGPerMl },
    species: [], detail: 'Thông số tham khảo · chỉnh theo nhãn/CoA và nhiệt độ áp dụng',
    searchText: normalizeSubstanceSearch(preset.name + ' ' + ({ 'hno3-65': 'acid nitric', 'hcl-37': 'acid clohydric hydrochloric', 'h2so4-98': 'acid sulfuric', 'acetic-99-8': 'acid acetic', 'nh3-25': 'amoniac ammonia', 'h3po4-85': 'acid phosphoric', 'hclo4-70': 'acid perchloric', 'hf-40': 'acid hydrofluoric', 'h2o2-30': 'hydrogen peroxide oxy già' } as Record<string, string>)[preset.id])
  })),
  ...SOLIDS.map(([formula, aliases, species]) => ({
    id: 'solid-' + formula, name: formula + ' · ' + aliases.split(' ').slice(0, 3).join(' '),
    origin: 'library' as const, sourceType: 'solid' as const, formula,
    molarMass: parseChemicalFormula(formula)!.molarMass, densityGPerMl: null,
    potencyPercent: null, concentration: null, species,
    detail: 'Nhập độ tinh khiết của lô; chọn tính theo toàn chất hoặc ion/dạng khan',
    searchText: normalizeSubstanceSearch(formula + ' ' + aliases)
  }))
];

export function formulaSubstanceOption(raw: string): PrepSubstanceOption | null {
  const parsed = parseChemicalFormula(raw);
  if (!parsed) return null;
  return { id: 'formula-' + parsed.formula, name: parsed.formula, origin: 'formula', sourceType: 'solid',
    formula: parsed.formula, molarMass: parsed.molarMass, densityGPerMl: null, potencyPercent: null,
    concentration: null, species: parsed.anhydrousFormula ? [parsed.anhydrousFormula] : [],
    detail: 'M tính từ công thức · độ tinh khiết lấy theo lô thực tế', searchText: normalizeSubstanceSearch(raw) };
}
