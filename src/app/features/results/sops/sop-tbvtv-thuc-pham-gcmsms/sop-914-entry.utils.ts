import {
  SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS,
  SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS
} from '../../config/sop-configs';

export function getSop914TemplateMetadata(type: 'formDayDu' | 'formRutGon' | string) {
  const isShort = type === 'formRutGon';
  return {
    templateDocId: isShort
      ? SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS.formRutGon
      : SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS.formDayDu,
    templateDocUrl: isShort
      ? SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS.formRutGon
      : SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS.formDayDu,
    reportFormLabel: isShort ? 'FORM RÚT GỌN' : 'FORM ĐẦY ĐỦ'
  };
}

export function migrateSop914QcKeys(page1Data: Record<string, any>): void {
  const legacyToCanonical: Record<string, string> = {
    qcNhanDangMauNhiem: 'qcNhanDang',
    qcNhanDangSpike: 'qcThemChuan',
    qcThuHoiIS: 'qcThuHoi'
  };

  Object.entries(legacyToCanonical).forEach(([legacyKey, canonicalKey]) => {
    const canonicalValue = page1Data[canonicalKey];
    const legacyValue = page1Data[legacyKey];
    if ((canonicalValue === undefined || canonicalValue === null || canonicalValue === '')
      && legacyValue !== undefined && legacyValue !== '') {
      page1Data[canonicalKey] = legacyValue;
    }
  });
}

export function getSop914DefaultVial(sampleIndex: number): string {
  const currentVial = 10 + sampleIndex;
  const rack = 1 + Math.floor((currentVial - 1) / 54);
  const vial = ((currentVial - 1) % 54) + 1;
  return `${rack}.${vial}`;
}

export function deriveSop914DetectionFlags(
  sampleList: string[],
  resultData: Record<string, Record<string, any>>,
  resultKeys: string[],
  isShortForm: boolean,
  isAssigned: (sampleCode: string, resultKey: string) => boolean
) {
  let hasPositive = false;
  let hasAnyResultState = false;

  for (const sample of sampleList) {
    const row = resultData[sample];
    if (!row || row['selected'] === false) continue;

    for (const key of resultKeys) {
      if (!isAssigned(sample, key)) continue;
      if (!isShortForm && row[`${key}_nd`] === true) {
        hasAnyResultState = true;
        continue;
      }

      const val = row[key];
      if (val === undefined || val === null) continue;
      const normalized = String(val).trim().toUpperCase();
      if (normalized === '') continue;
      if (normalized !== 'N/A') hasAnyResultState = true;
      if (normalized !== 'ND' && normalized !== 'N/A' && normalized !== 'KPH') {
        hasPositive = true;
        break;
      }
    }

    if (hasPositive) break;
  }

  return {
    hasPositive,
    hasAnyResultState,
    checkTatCaND: hasAnyResultState && !hasPositive,
    checkCoMauPhatHien: hasPositive
  };
}
