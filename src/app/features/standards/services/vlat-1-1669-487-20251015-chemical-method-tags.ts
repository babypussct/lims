import {
  StandardDeviceCode,
  StandardTagCatalogItem,
} from '../../../core/models/standard.model';
import {
  buildAccreditationMethodTagId,
  buildTagKey,
  compareChemicalMethodCodes,
  deriveMethodSeries,
  normalizeNafi6ChemicalMethodCode,
} from './standard-tag.utils';
import { getVlatMethodName } from './vlat-1-1669-20251015-chemical-method-names';

export const VLAT_11669_SOURCE = {
  origin: 'ACCREDITATION_SCOPE' as const,
  templateKind: 'TEST_METHOD' as const,
  sourceAgency: 'AOSC',
  sourceDecision: '487/QĐ-AOSC',
  sourceLabCode: 'VLAT-1.1669',
  sourceDocument: 'qd_1.1669_20251015.pdf',
  sourceSha256: '477E814DE9ECAAD0E91B77D6FCDE6C5620EF2CB911E1DBFA7A36280331CA84BA',
  sourceValidFrom: '2025-10-15',
  sourceValidTo: '2029-09-24',
  seedVersion: 'vlat-1-1669-487-20251015',
} as const;

const METHOD_CODES = [
  // H-1 (15)
  'NAFI6/H-1.2', 'NAFI6/H-1.6', 'NAFI6/H-1.8', 'NAFI6/H-1.13', 'NAFI6/H-1.16',
  'NAFI6/H-1.17', 'NAFI6/H-1.20', 'NAFI6/H-1.21', 'NAFI6/H-1.22', 'NAFI6/H-1.23',
  'NAFI6/H-1.24', 'NAFI6/H-1.25', 'NAFI6/H-1.26', 'NAFI6/H-1.27', 'NAFI6/H-1.28',
  // H-2 (4)
  'NAFI6/H-2.1', 'NAFI6/H-2.2', 'NAFI6/H-2.14', 'NAFI6/H-2.15',
  // H-3 (1)
  'NAFI6/H-3.1',
  // H-5 (5)
  'NAFI6/H-5.1', 'NAFI6/H-5.2', 'NAFI6/H-5.5', 'NAFI6/H-5.6', 'NAFI6/H-5.7',
  // H-6 (11)
  'NAFI6/H-6.1', 'NAFI6/H-6.3', 'NAFI6/H-6.4', 'NAFI6/H-6.5', 'NAFI6/H-6.10',
  'NAFI6/H-6.11', 'NAFI6/H-6.12', 'NAFI6/H-6.13', 'NAFI6/H-6.14', 'NAFI6/H-6.16', 'NAFI6/H-6.19',
  // H-7 (16)
  'NAFI6/H-7.2', 'NAFI6/H-7.3', 'NAFI6/H-7.4', 'NAFI6/H-7.5', 'NAFI6/H-7.9',
  'NAFI6/H-7.15', 'NAFI6/H-7.16', 'NAFI6/H-7.17', 'NAFI6/H-7.18', 'NAFI6/H-7.19',
  'NAFI6/H-7.20', 'NAFI6/H-7.21', 'NAFI6/H-7.22', 'NAFI6/H-7.23', 'NAFI6/H-7.24', 'NAFI6/H-7.25',
  // H-8 (47)
  'NAFI6/H-8.1', 'NAFI6/H-8.2', 'NAFI6/H-8.3', 'NAFI6/H-8.4', 'NAFI6/H-8.5',
  'NAFI6/H-8.6', 'NAFI6/H-8.7', 'NAFI6/H-8.8', 'NAFI6/H-8.9', 'NAFI6/H-8.10',
  'NAFI6/H-8.11', 'NAFI6/H-8.12', 'NAFI6/H-8.13', 'NAFI6/H-8.14', 'NAFI6/H-8.16',
  'NAFI6/H-8.17', 'NAFI6/H-8.18', 'NAFI6/H-8.19', 'NAFI6/H-8.20', 'NAFI6/H-8.21',
  'NAFI6/H-8.22', 'NAFI6/H-8.23', 'NAFI6/H-8.24', 'NAFI6/H-8.25', 'NAFI6/H-8.26',
  'NAFI6/H-8.27', 'NAFI6/H-8.28', 'NAFI6/H-8.29', 'NAFI6/H-8.30', 'NAFI6/H-8.32',
  'NAFI6/H-8.33', 'NAFI6/H-8.34', 'NAFI6/H-8.35', 'NAFI6/H-8.36', 'NAFI6/H-8.37',
  'NAFI6/H-8.38', 'NAFI6/H-8.39', 'NAFI6/H-8.40', 'NAFI6/H-8.41', 'NAFI6/H-8.42',
  'NAFI6/H-8.43', 'NAFI6/H-8.44', 'NAFI6/H-8.45', 'NAFI6/H-8.46', 'NAFI6/H-8.47',
  'NAFI6/H-8.48', 'NAFI6/H-8.52',
  // H-9 (17)
  'NAFI6/H-9.1', 'NAFI6/H-9.2', 'NAFI6/H-9.3', 'NAFI6/H-9.4', 'NAFI6/H-9.5',
  'NAFI6/H-9.6', 'NAFI6/H-9.7', 'NAFI6/H-9.10', 'NAFI6/H-9.11', 'NAFI6/H-9.14',
  'NAFI6/H-9.16', 'NAFI6/H-9.17', 'NAFI6/H-9.20', 'NAFI6/H-9.21', 'NAFI6/H-9.22',
  'NAFI6/H-9.23', 'NAFI6/H-9.24',
  // H-13 (3)
  'NAFI6/H-13.1', 'NAFI6/H-13.2', 'NAFI6/H-13.4',
] as const;

const DEVICE_OVERRIDES: Readonly<Record<string, readonly StandardDeviceCode[]>> = {
  'NAFI6/H-8.41': ['LCMSMS'],
  'NAFI6/H-9.21': ['GCMSMS'],
  'NAFI6/H-9.22': ['GCECD'],
  'NAFI6/H-9.10': ['GCHRMS'],
  'NAFI6/H-7.22': ['HPLCDAD'],
  'NAFI6/H-7.17': ['HPLCPDA'],
};

const SOURCE_PAGE_OVERRIDES: Readonly<Record<string, string>> = {
  'NAFI6/H-8.41': 'PDF 30',
  'NAFI6/H-9.21': 'PDF 19',
  'NAFI6/H-9.22': 'PDF 9',
  'NAFI6/H-9.10': 'PDF 11',
  'NAFI6/H-7.22': 'PDF 32',
  'NAFI6/H-7.17': 'PDF 24',
  'NAFI6/H-5.1': 'PDF 27, 55',
  'NAFI6/H-5.5': 'PDF 56, 58',
  'NAFI6/H-8.5': 'PDF 57, 62',
  'NAFI6/H-8.24': 'PDF 29, 31',
  'NAFI6/H-8.45': 'PDF 43, 68',
};

const SORTED_METHOD_CODES = [...METHOD_CODES].sort(compareChemicalMethodCodes);

export const VLAT_11669_CHEMICAL_METHOD_CODES: readonly string[] = SORTED_METHOD_CODES;

export const VLAT_11669_CHEMICAL_METHOD_TAGS: readonly StandardTagCatalogItem[] = SORTED_METHOD_CODES.map((rawCode, index) => {
  const methodCode = normalizeNafi6ChemicalMethodCode(rawCode);
  const id = `${VLAT_11669_SOURCE.seedVersion}-${buildAccreditationMethodTagId(methodCode)}`;
  return {
    id,
    name: methodCode,
    code: methodCode,
    methodName: getVlatMethodName(methodCode),
    origin: VLAT_11669_SOURCE.origin,
    templateKind: VLAT_11669_SOURCE.templateKind,
    methodCode,
    deviceCodes: [...(DEVICE_OVERRIDES[methodCode] || [])],
    sourceAgency: VLAT_11669_SOURCE.sourceAgency,
    sourceDecision: VLAT_11669_SOURCE.sourceDecision,
    sourceLabCode: VLAT_11669_SOURCE.sourceLabCode,
    sourceDocument: VLAT_11669_SOURCE.sourceDocument,
    sourceSha256: VLAT_11669_SOURCE.sourceSha256,
    sourceValidFrom: VLAT_11669_SOURCE.sourceValidFrom,
    sourceValidTo: VLAT_11669_SOURCE.sourceValidTo,
    sourcePages: SOURCE_PAGE_OVERRIDES[methodCode] || 'PDF 4-73',
    seedVersion: VLAT_11669_SOURCE.seedVersion,
    sortOrder: index,
    locked: true,
    _isDeleted: false,
  };
});

export const VLAT_11669_CHEMICAL_METHOD_KEYS: readonly string[] =
  VLAT_11669_CHEMICAL_METHOD_TAGS.map(item => buildTagKey('CUSTOM', item.id));

export const VLAT_11669_CHEMICAL_METHOD_DEVICE_MAP: ReadonlyMap<string, readonly StandardDeviceCode[]> =
  new Map(VLAT_11669_CHEMICAL_METHOD_TAGS.map(item => [item.methodCode!, item.deviceCodes || []]));

export function getVlatMethodSeries(methodCode: string): string {
  return deriveMethodSeries(methodCode);
}
