import type { ConcentrationDraft, PrepSourceType } from './prep-domain.types';
import { parseChemicalFormula, normalizeFormulaText } from './chemical-formula';
import { PRESET_CHEMICALS } from './prep-calculation.engine';
import { LAB_REAGENT_GROUPS, LAB_REAGENTS, type LabReagentGroupId } from './prep-substance-data';

export const PREP_SUBSTANCE_GROUPS: readonly { id: LabReagentGroupId; label: string }[] = LAB_REAGENT_GROUPS;

export interface PrepSubstanceOption {
  id: string;
  name: string;
  origin: 'library' | 'formula';
  group: LabReagentGroupId | null;
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
  return raw.trim().replace(/[₀-₉]/g, digit => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(digit)))
    .replace(/[·∙]/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd').toLowerCase().replace(/\s+/g, ' ');
}

export function matchesSubstanceSearch(item: PrepSubstanceOption, raw: string): boolean {
  const query = normalizeSubstanceSearch(raw);
  return !query || query.split(' ').every(token => item.searchText.includes(token));
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

const SOLID_DISPLAY_NAMES: Readonly<Record<string, string>> = {
  NaCl: 'Natri clorid', NaOH: 'Natri hydroxid', CaCO3: 'Calci carbonat',
  'CuSO4.5H2O': 'Đồng(II) sulfat pentahydrat',
  'FeSO4.7H2O': 'Sắt(II) sulfat heptahydrat',
  'Na2S2O3.5H2O': 'Natri thiosulfat pentahydrat',
  K2Cr2O7: 'Kali dicromat', KMnO4: 'Kali permanganat',
  AgNO3: 'Bạc nitrat', Na2CO3: 'Natri carbonat khan',
  'C10H14N2Na2O8.2H2O': 'EDTA-2Na dihydrat',
  KH2PO4: 'Kali dihydrogen phosphat',
  'Na2HPO4.12H2O': 'Dinatri hydrogen phosphat dodecahydrat',
  'CH3COONa.3H2O': 'Natri acetat trihydrat'
};

/** CAS identifies the substance; it never supplies lot-specific assay or density. */
const PRESET_CAS: Readonly<Record<string, string>> = {
  'hno3-65': '7697-37-2', 'hcl-37': '7647-01-0', 'h2so4-98': '7664-93-9',
  'acetic-99-8': '64-19-7', 'nh3-25': '7664-41-7', 'h3po4-85': '7664-38-2',
  'hclo4-70': '7601-90-3', 'hf-40': '7664-39-3', 'h2o2-30': '7722-84-1'
};

const SOLID_CAS: Readonly<Record<string, string>> = {
  NaCl: '7647-14-5', NaOH: '1310-73-2', CaCO3: '471-34-1',
  'CuSO4.5H2O': '7758-99-8', 'FeSO4.7H2O': '7782-63-0',
  'Na2S2O3.5H2O': '10102-17-7', K2Cr2O7: '7778-50-9',
  KMnO4: '7722-64-7', AgNO3: '7761-88-8', Na2CO3: '497-19-8',
  'C10H14N2Na2O8.2H2O': '6381-92-6', KH2PO4: '7778-77-0',
  'Na2HPO4.12H2O': '10039-32-4', 'CH3COONa.3H2O': '6131-90-4'
};

export const PREP_SUBSTANCE_LIBRARY: readonly PrepSubstanceOption[] = [
  ...PRESET_CHEMICALS.map(preset => ({
    id: preset.id, name: preset.name, origin: 'library' as const, group: 'acid_base' as const, sourceType: 'concentrate' as const,
    formula: normalizeFormulaText(preset.name.split(' ')[0]), molarMass: preset.molarMass,
    densityGPerMl: preset.densityGPerMl, potencyPercent: null,
    concentration: { value: preset.massPercent, unit: '% w/w', basis: 'mass_fraction' as const, densityGPerMl: preset.densityGPerMl },
    species: [], detail: `CAS ${PRESET_CAS[preset.id]} · Thông số tham khảo; chỉnh theo nhãn/CoA và nhiệt độ áp dụng`,
    searchText: normalizeSubstanceSearch(preset.name + ' ' + PRESET_CAS[preset.id] + ' ' + ({ 'hno3-65': 'acid nitric', 'hcl-37': 'acid clohydric hydrochloric', 'h2so4-98': 'acid sulfuric', 'acetic-99-8': 'acid acetic', 'nh3-25': 'amoniac ammonia', 'h3po4-85': 'acid phosphoric', 'hclo4-70': 'acid perchloric', 'hf-40': 'acid hydrofluoric', 'h2o2-30': 'hydrogen peroxide oxy già' } as Record<string, string>)[preset.id])
  })),
  ...SOLIDS.map(([formula, aliases, species]) => ({
    id: 'solid-' + formula, name: formula + ' · ' + SOLID_DISPLAY_NAMES[formula],
    origin: 'library' as const, group: (['KH2PO4', 'Na2HPO4.12H2O', 'CH3COONa.3H2O', 'C10H14N2Na2O8.2H2O'].includes(formula) ? 'buffers' : ['NaOH', 'K2Cr2O7', 'KMnO4'].includes(formula) ? 'acid_base' : 'salts') as LabReagentGroupId, sourceType: 'solid' as const, formula,
    molarMass: parseChemicalFormula(formula)!.molarMass, densityGPerMl: null,
    potencyPercent: null, concentration: null, species,
    detail: `CAS ${SOLID_CAS[formula]} · Nhập độ tinh khiết của lô; chọn tính theo toàn chất hoặc ion/dạng khan`,
    searchText: normalizeSubstanceSearch(formula + ' ' + aliases + ' ' + SOLID_CAS[formula])
  })),
  ...LAB_REAGENTS.map(entry => {
    const parsed = parseChemicalFormula(entry.formula);
    // Fail early if a curated formula cannot be used for correct mass calculations.
    if (!parsed) throw new Error(`Công thức hóa học trong thư viện chưa hợp lệ: ${entry.formula}`);
    const isLiquid = entry.physicalForm === 'liquid';
    const groupLabel = PREP_SUBSTANCE_GROUPS.find(group => group.id === entry.group)!.label;
    return {
      id: `${entry.group}-${entry.formula}-${entry.name}`, name: `${entry.formula} · ${entry.name}`,
      origin: 'library' as const, group: entry.group,
      sourceType: (isLiquid ? 'concentrate' : 'solid') as PrepSourceType,
      formula: parsed.formula, molarMass: parsed.molarMass,
      densityGPerMl: null, potencyPercent: null, concentration: null, species: entry.species,
      detail: `${groupLabel}${entry.cas ? ' · CAS ' + entry.cas : ''} · ${isLiquid ? 'Nhập nồng độ và khối lượng riêng theo lô/SDS' : 'Nhập độ tinh khiết theo nhãn/CoA'}`,
      searchText: normalizeSubstanceSearch([entry.formula, entry.name, entry.aliases, entry.cas ?? '', groupLabel].join(' '))
    };
  })
];

export function formulaSubstanceOption(raw: string): PrepSubstanceOption | null {
  const parsed = parseChemicalFormula(raw);
  if (!parsed) return null;
  return { id: 'formula-' + parsed.formula, name: parsed.formula, origin: 'formula', group: null, sourceType: 'solid',
    formula: parsed.formula, molarMass: parsed.molarMass, densityGPerMl: null, potencyPercent: null,
    concentration: null, species: parsed.anhydrousFormula ? [parsed.anhydrousFormula] : [],
    detail: 'M tính từ công thức · độ tinh khiết lấy theo lô thực tế', searchText: normalizeSubstanceSearch(raw) };
}
