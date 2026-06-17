/**
 * Helper utility to build action payload for generating PDF reports for different SOPs.
 * Isolates complex QC sequencing and formatting from the main ResultEntryComponent.
 */
import { isCompoundAssigned, resolveTargetMasterInfo, getCanonicalId, SOP01_COLUMN_TO_CANONICAL, getSop01DisplayName } from './shared/compound-id-resolver';
import { formatSampleList } from '../../shared/utils/utils';

export function mapCompoundToKey(c: string): string {
  return getCanonicalId(c);
}

export function getAssignedTargetsForSample(sampleCode: string, sampleTargetMap: Record<string, string[]>): string[] | null {
  if (!sampleTargetMap || !sampleCode) return null;
  const matchKey = Object.keys(sampleTargetMap)
    .find(k => k.toLowerCase().trim() === sampleCode.toLowerCase().trim());
  return matchKey ? sampleTargetMap[matchKey] : null;
}

export function buildTargetMetadata(compounds: string[], masterTargets: any[], sopIdOrConfigKey?: string | null) {
  const targetInfo: any = {};
  if (!compounds) return targetInfo;
  compounds.forEach(c => {
      const canonical = getCanonicalId(c);
      const master = resolveTargetMasterInfo(c, masterTargets || []);
      let displayName = master?.name || c;
      if (sopIdOrConfigKey !== '9.16-tbvtv-water' && sopIdOrConfigKey !== 'tbvtv-trong-nuoc-gcmsms') {
          if (displayName === 'Fipronil (nhóm I)' || displayName === 'Fipronil (nhóm Lân)') {
              displayName = 'Fipronil';
          }
      }
      targetInfo[canonical] = {
          displayName: displayName,
          unit: master?.default_unit || 'ppb',
          lod: master?.default_lod || '',
          loq: master?.default_loq || ''
      };
  });
  return targetInfo;
}

export function buildTrifluralinPdfPayload(currentDraft: any, currentRun: any, activeFilter: string, formatAnalysisDate: (d: string) => string, getRunDate: () => string): any {
  const sampleList = currentRun.sampleList || [];
  const checkedSamples = sampleList.filter((s: string) => {
    const resObj = currentDraft.resultData[s] || {};
    const startsWithLetter = /^[a-zA-Z]/.test(s);
    const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
    const isSelected = resObj['selected'] !== false;
    const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
    return isSelected && matchesFilter;
  });

  const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
  const prefixSamples = checkedSamples;

  const samplesPayload: any[] = [];

  // 1. ThÃƒÂªm Blank vÃƒÂ o Ã„â€˜Ã¡ÂºÂ§u danh sÃƒÂ¡ch
  const blankObj = currentDraft.resultData['QC_BLANK'] || {};
  samplesPayload.push({
    loSo: blankObj['loSo'] || '1',
    maSoMau: currentDraft.page1Data['blankName'] || 'Blank',
    kqTrifluralin: blankObj['kqTrifluralin'] === 'N/A' ? '' : (blankObj['kqTrifluralin'] || ''),
    ghiChu: blankObj['ghiChu'] || ''
  });

  // 2. ThÃƒÂªm Spike vÃƒÂ o vÃ¡Â»â€¹ trÃƒÂ­ thÃ¡Â»Â© 2
  const spikeObj = currentDraft.resultData['QC_SPIKE'] || {};
  samplesPayload.push({
    loSo: spikeObj['loSo'] || '2',
    maSoMau: currentDraft.page1Data['spikeName'] || 'Spike',
    kqTrifluralin: spikeObj['kqTrifluralin'] === 'N/A' ? '' : (spikeObj['kqTrifluralin'] || ''),
    ghiChu: spikeObj['ghiChu'] || ''
  });

  // 3. ThÃƒÂªm cÃƒÂ¡c mÃ¡ÂºÂ«u vÃƒÂ  cÃƒÂ¡c mÃ¡ÂºÂ«u SPIKE_N xen kÃ¡ÂºÂ½
  let selectedCount = 0;
  prefixSamples.forEach((sampleCode: string) => {
    const resObj = currentDraft.resultData[sampleCode] || {};
    samplesPayload.push({
      loSo: resObj['loSo'] || '',
      maSoMau: sampleCode,
      kqTrifluralin: resObj['kqTrifluralin'] === 'N/A' ? '' : (resObj['kqTrifluralin'] || ''),
      ghiChu: resObj['ghiChu'] || ''
    });

    selectedCount++;
    if (selectedCount % 10 === 0) {
      const isLastSelected = selectedCount === prefixSamples.length;
      if (!isLastSelected) {
        const n = selectedCount / 10;
        const spikeNKey = `QC_SPIKE_${n}_QC_${prefixForReport}`;
        const spikeNObj = currentDraft.resultData[spikeNKey] || {};
        samplesPayload.push({
          loSo: spikeNObj['loSo'] || spikeObj['loSo'] || '2',
          maSoMau: `SPIKE_${n}`,
          kqTrifluralin: spikeNObj['kqTrifluralin'] === 'N/A' ? '' : (spikeNObj['kqTrifluralin'] || ''),
          ghiChu: spikeNObj['ghiChu'] || ''
        });
      }
    }
  });

  // 4. FINAL row
  if (selectedCount > 0) {
    const finalKey = `QC_FINAL_QC_${prefixForReport}`;
    const mainFinal = currentDraft.resultData['QC_FINAL_QC_'] || {};
    const prefixFinal = currentDraft.resultData[finalKey] || {};
    const finalObj = {
      loSo: prefixFinal['loSo'] || mainFinal['loSo'] || spikeObj['loSo'] || '2',
      kqTrifluralin: prefixFinal['kqTrifluralin'] !== undefined && prefixFinal['kqTrifluralin'] !== '' 
        ? prefixFinal['kqTrifluralin'] 
        : (mainFinal['kqTrifluralin'] || ''),
      ghiChu: prefixFinal['ghiChu'] !== undefined && prefixFinal['ghiChu'] !== ''
        ? prefixFinal['ghiChu']
        : (mainFinal['ghiChu'] || '')
    };
    samplesPayload.push({
      loSo: finalObj.loSo,
      maSoMau: 'FINAL',
      kqTrifluralin: finalObj.kqTrifluralin === 'N/A' ? '' : finalObj.kqTrifluralin,
      ghiChu: finalObj.ghiChu || ''
    });
  }

  return {
    action: 'generate_pdf',
    sopId: 'trifluralin-gcms',
    metadata: {
      ...currentDraft.page1Data,
      prefix: prefixForReport,
      ngayNguoiPhanTich: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      ngayNguoiThamTra: formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
      ngayBaoCao: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate())
    },
    samples: samplesPayload
  };
}

export function buildFipronilPdfPayload(currentDraft: any, currentRun: any, activeFilter: string, currentConf: any, formatAnalysisDate: (d: string) => string, getRunDate: () => string, masterTargets: any[] = []): any {
  const activeCols = Object.keys(currentConf.columns || {}).filter((c: string) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
  const samplesPayload: any[] = [];

  const ensureKeyAndGet = (key: string, defaultVial: string, label: string) => {
    const resObj = currentDraft.resultData[key] || {};
    const rowData: Record<string, any> = {
      loSo: resObj['loSo'] || defaultVial,
      maSoMau: label,
      ghiChu: resObj['ghiChu'] || ''
    };
    activeCols.forEach((col: string) => {
      const val = resObj[col];
      rowData[col] = (val !== undefined && val !== null && val !== 'N/A') ? val : '';
    });
    return rowData;
  };

  // 1. BLANK (vial 1.7)
  const blankName = currentDraft.page1Data['blankName'] || 'BLANK';
  samplesPayload.push(ensureKeyAndGet('QC_BLANK', '1.7', blankName));

  // 2. SPIKE (vial 1.8)
  const spikeName = currentDraft.page1Data['spikeName'] || 'SPIKE';
  samplesPayload.push(ensureKeyAndGet('QC_SPIKE', '1.8', spikeName));

  // 3. CHECK_SAMPLE (vial 1.9, optional)
  if (currentDraft.page1Data['hasCheckSample']) {
    const checkSampleName = currentDraft.page1Data['checkSampleName'] || 'CHECK_SAMPLE';
    samplesPayload.push(ensureKeyAndGet('QC_CHECK_SAMPLE', '1.9', checkSampleName));
  }

  // 4. Regular samples & dynamic SP_N every 10 samples
  const sampleList = currentRun.sampleList || [];
  let regularCount = 0;
  sampleList.forEach((sampleCode: string) => {
    const resObj = currentDraft.resultData[sampleCode] || {};
    const rowData: Record<string, any> = {
      loSo: resObj['loSo'] || '',
      maSoMau: sampleCode,
      ghiChu: resObj['ghiChu'] || ''
    };
    activeCols.forEach((col: string) => {
      const val = resObj[col];
      rowData[col] = (val !== undefined && val !== null && val !== 'N/A') ? val : '';
    });
    samplesPayload.push(rowData);

    regularCount++;
    if (regularCount % 10 === 0) {
      const isLastSample = regularCount === sampleList.length;
      if (!isLastSample) {
        const n = regularCount / 10;
        const spikeNKey = `QC_SPIKE_${n}`;
        const spikeNObj = currentDraft.resultData[spikeNKey] || {};
        const spikeVial = currentDraft.resultData['QC_SPIKE']?.['loSo'] || '1.8';

        const spRowData: Record<string, any> = {
          loSo: spikeNObj['loSo'] || spikeVial,
          maSoMau: `SP_${n}`,
          ghiChu: spikeNObj['ghiChu'] || ''
        };
        activeCols.forEach((col: string) => {
          const val = spikeNObj[col];
          spRowData[col] = (val !== undefined && val !== null && val !== 'N/A') ? val : '';
        });
        samplesPayload.push(spRowData);
      }
    }
  });

  // 5. FINAL (vial 1.8)
  samplesPayload.push(ensureKeyAndGet('QC_FINAL', '1.8', 'FINAL'));

  // Build targetInfo: các column key → canonical id + display name
  // Để backend/template biết tên hiển thị đúng cho từng cột kết quả
  const targetInfo: Record<string, { canonicalId: string; displayName: string }> = {};
  activeCols.forEach((col: string) => {
    const canonicalId = SOP01_COLUMN_TO_CANONICAL[col] || col;
    targetInfo[col] = {
      canonicalId,
      displayName: getSop01DisplayName(col, masterTargets)
    };
  });

  return {
    action: 'generate_pdf',
    sopId: 'fipronil-chlorpyrifos',
    metadata: {
      ...currentDraft.page1Data,
      targetInfo,
      ngayNguoiPhanTich: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      ngayNguoiThamTra: formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
      ngayBaoCao: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate())
    },
    samples: samplesPayload
  };
}

export function buildDichlorvosPdfPayload(currentDraft: any, currentRun: any, activeFilter: string, currentConf: any, formatAnalysisDate: (d: string) => string, getRunDate: () => string): any {
  const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
  const samplesPayload: any[] = [];

  const getQcRow = (key: string, label: string) => {
    const resObj = currentDraft.resultData[key] || {};
    const rowData: Record<string, any> = {
      loSo: resObj['loSo'] || '',
      maSoMau: label,
      ghiChu: resObj['ghiChu'] || ''
    };
    Object.keys(currentConf.columns).forEach((col: string) => {
      if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
        if (col === 'kqDichlorvos') {
          let mergedVal = resObj['kqDichlorvos'] || '';
          let note = (resObj['ghiChu'] || '').trim();
          if (note) {
            if (!note.startsWith('(') || !note.endsWith(')')) {
              note = `(${note})`;
            }
            mergedVal = mergedVal ? `${mergedVal} ${note}` : note;
          }
          rowData[col] = mergedVal;
        } else {
          const val = resObj[col];
      rowData[col] = (val !== undefined && val !== null && val !== 'N/A') ? val : '';
        }
      }
    });
    return rowData;
  };

  // 1. Blank
  const blankName = currentDraft.page1Data['blankName'] || 'Blank';
  samplesPayload.push(getQcRow('QC_BLANK', blankName));

  // 2. Spike
  const spikeName = currentDraft.page1Data['spikeName'] || 'Spike';
  samplesPayload.push(getQcRow('QC_SPIKE', spikeName));

  // 3. Regular samples
  const sampleList = currentRun.sampleList || [];
  const filteredSamples = sampleList.filter((s: string) => {
    const resObj = currentDraft.resultData[s] || {};
    const startsWithLetter = /^[a-zA-Z]/.test(s);
    const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
    const isSelected = resObj['selected'] !== false;
    const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
    return isSelected && matchesFilter;
  });

  filteredSamples.forEach((sampleCode: string) => {
    const resObj = currentDraft.resultData[sampleCode] || {};
    const rowData: Record<string, any> = {
      loSo: resObj['loSo'] || '',
      maSoMau: sampleCode,
      ghiChu: resObj['ghiChu'] || ''
    };
    Object.keys(currentConf.columns).forEach((col: string) => {
      if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
        if (col === 'kqDichlorvos') {
          let mergedVal = resObj['kqDichlorvos'] || '';
          let note = (resObj['ghiChu'] || '').trim();
          if (note) {
            if (!note.startsWith('(') || !note.endsWith(')')) {
              note = `(${note})`;
            }
            mergedVal = mergedVal ? `${mergedVal} ${note}` : note;
          }
          rowData[col] = mergedVal;
        } else {
          const val = resObj[col];
      rowData[col] = (val !== undefined && val !== null && val !== 'N/A') ? val : '';
        }
      }
    });
    samplesPayload.push(rowData);
  });

  // 4. FINAL (optional)
  if (currentDraft.page1Data['hasFinal']) {
    samplesPayload.push(getQcRow('QC_FINAL', 'FINAL'));
  }

  return {
    action: 'generate_pdf',
    sopId: 'dichlorvos-gcms',
    metadata: {
      ...currentDraft.page1Data,
      prefix: prefixForReport,
      ngayNguoiPhanTich: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      ngayNguoiThamTra: formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
      ngayBaoCao: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate())
    },
    samples: samplesPayload
  };
}

export function buildDefaultSopPdfPayload(currentDraft: any, currentRun: any, activeFilter: string, currentConf: any, formatAnalysisDate: (d: string) => string, getRunDate: () => string, masterTargets?: any[]): any {
  const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
  const samplesPayload: any[] = [];
  const sampleList = currentRun.sampleList || [];
  const sampleTargetMap = currentRun.sampleTargetMap || (currentRun.inputs && currentRun.inputs.sampleTargetMap) || {};

  const isAssigned = (sampleCode: string, compound: string): boolean => {
    const assigned = getAssignedTargetsForSample(sampleCode, sampleTargetMap);
    if (!assigned) return true;
    return isCompoundAssigned(assigned, compound, masterTargets) || isCompoundAssigned(assigned, mapCompoundToKey(compound), masterTargets);
  };

  const filteredSamples = sampleList.filter((s: string) => {
    const resObj = currentDraft.resultData[s] || {};
    const startsWithLetter = /^[a-zA-Z]/.test(s);
    const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
    const isSelected = resObj['selected'] !== false;
    const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
    return isSelected && matchesFilter;
  });

  const isGop = currentDraft.page1Data && currentDraft.page1Data['checkGopInChung'] === true && currentConf.formType === 'type3b';

  if (isGop && filteredSamples.length > 0) {
    const mergedSampleCode = filteredSamples.join('; ');
    const rowData: Record<string, any> = {
      maSoMau: mergedSampleCode
    };

    const isAssignedToAny = (compound: string): boolean => {
      return filteredSamples.some((s: string) => isAssigned(s, compound));
    };

    currentConf.compounds.forEach((c: string) => {
      const backendKey = mapCompoundToKey(c);
      const assigned = isAssignedToAny(c);

      if (!assigned) {
        rowData[backendKey] = '';
        rowData[`${backendKey}_nd`] = false;
        rowData[`${backendKey}_qc1`] = 'N/A';
        rowData[`${backendKey}_qc2`] = 'N/A';
        rowData[`${backendKey}_qc3`] = 'N/A';
      } else {
        const uniqueVals = new Set<string>(filteredSamples.map((s: string) => {
          const sRes = currentDraft.resultData[s] || {};
          const isNd = sRes[`${c}_nd`] === true;
          const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
          return isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
        }));

        if (uniqueVals.size === 1) {
          const commonVal = Array.from(uniqueVals)[0];
          if (commonVal === 'KPH') {
            rowData[`${backendKey}_nd`] = true;
            rowData[backendKey] = '';
          } else if (commonVal === 'N/A') {
            rowData[`${backendKey}_nd`] = false;
            rowData[backendKey] = '';
          } else {
            rowData[`${backendKey}_nd`] = false;
            rowData[backendKey] = commonVal;
          }
        } else {
          rowData[`${backendKey}_nd`] = false;
          const resultParts = filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            const isNd = sRes[`${c}_nd`] === true;
            const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
            const displayVal = isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
            return displayVal ? `${s}: ${displayVal}` : `${s}:`;
          });
          rowData[backendKey] = resultParts.filter((p: string) => !p.endsWith(':')).join('; ');
        }

        const getMergedQc = (qcKey: string): string => {
          const uniqueQcs = new Set<string>(filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            return (sRes[`${c}_${qcKey}`] as string) || 'Ã„ÂÃ¡ÂºÂ¡t';
          }));
          if (uniqueQcs.size === 1) {
            return Array.from(uniqueQcs)[0];
          }
          return filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            return `${s}: ${(sRes[`${c}_${qcKey}`] as string) || 'Ã„ÂÃ¡ÂºÂ¡t'}`;
          }).join('; ');
        };

        rowData[`${backendKey}_qc1`] = getMergedQc('qc1');
        rowData[`${backendKey}_qc2`] = getMergedQc('qc2');
        rowData[`${backendKey}_qc3`] = getMergedQc('qc3');
      }
    });

    samplesPayload.push(rowData);
  } else {
    const isDon = (currentDraft.page1Data['printFormType'] || 'formCheck') === 'formDon';
    let formDonSamples = [...filteredSamples];
    if (isDon && currentConf.formType === 'type3b') {
      formDonSamples.unshift('QC_BLANK', 'QC_SPIKE');
      if (currentDraft.page1Data['hasFinal']) formDonSamples.push('QC_FINAL');
    }

    formDonSamples.forEach((sampleCode: string, idx: number) => {
      const resObj = currentDraft.resultData[sampleCode] || {};

      if (currentConf.formType === 'type3b') {
        let displayMaSoMau = sampleCode;
        if (sampleCode === 'QC_BLANK') displayMaSoMau = currentDraft.page1Data['blankName'] || 'Blank';
        else if (sampleCode === 'QC_SPIKE') displayMaSoMau = currentDraft.page1Data['spikeName'] || 'Spike';
        else if (sampleCode === 'QC_FINAL') displayMaSoMau = 'FINAL';

        const rowData: Record<string, any> = {
          maSoMau: displayMaSoMau
        };



        currentConf.compounds.forEach((c: string) => {
          const backendKey = mapCompoundToKey(c);
          const val = resObj[c] !== undefined && resObj[c] !== null ? String(resObj[c]) : '';
          const assigned = isAssigned(sampleCode, c);
          
          if (!assigned) {
            rowData[backendKey] = '';
            rowData[`${backendKey}_nd`] = false;
            rowData[`${backendKey}_qc1`] = 'N/A';
            rowData[`${backendKey}_qc2`] = 'N/A';
            rowData[`${backendKey}_qc3`] = 'N/A';
          } else {
            const isNd = resObj[`${c}_nd`] === true;
            rowData[backendKey] = isNd ? '' : (val === 'N/A' || val === 'N/A' ? '' : val);
            rowData[`${backendKey}_nd`] = isNd;
            rowData[`${backendKey}_qc1`] = resObj[`${c}_qc1`] || '';
            rowData[`${backendKey}_qc2`] = resObj[`${c}_qc2`] || '';
            rowData[`${backendKey}_qc3`] = resObj[`${c}_qc3`] || '';
          }
        });

        samplesPayload.push(rowData);
      } else {
        const rowData: Record<string, any> = {
          loSo: String(idx + 1),
          maSoMau: sampleCode,
          ghiChu: resObj['ghiChu'] || ''
        };
        Object.keys(currentConf.columns).forEach((col: string) => {
          if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
            const val = resObj[col];
      rowData[col] = (val !== undefined && val !== null && val !== 'N/A') ? val : '';
          }
        });
        samplesPayload.push(rowData);
      }
    });
  }

  return {
    action: 'generate_pdf',
    sopId: currentConf.id || '',
    metadata: {
      ...currentDraft.page1Data,
      prefix: prefixForReport,
      sampleTargetMap: sampleTargetMap,
      targetInfo: buildTargetMetadata(currentConf.compounds, masterTargets || [], currentConf.id),
      ngayNguoiPhanTich: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      ngayNguoiThamTra: formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
      ngayBaoCao: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate())
    },
    samples: samplesPayload
  };
}

export function buildLanHuuCoPdfPayload(currentDraft: any, currentRun: any, activeFilter: string, currentConf: any, formatAnalysisDate: (d: string) => string, getRunDate: () => string, masterTargets: any[] = []): any {
  const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
  const samplesPayload: any[] = [];
  const sampleList = currentRun.sampleList || [];

  const filteredSamples = sampleList.filter((s: string) => {
    const resObj = currentDraft.resultData[s] || {};
    const startsWithLetter = /^[a-zA-Z]/.test(s);
    const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
    const isSelected = resObj['selected'] !== false;
    const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
    return isSelected && matchesFilter;
  });

  const sampleTargetMap = currentRun.sampleTargetMap || (currentRun.inputs && currentRun.inputs.sampleTargetMap) || {};

  const isAssigned = (sampleCode: string, compound: string): boolean => {
    const assigned = getAssignedTargetsForSample(sampleCode, sampleTargetMap);
    if (!assigned) return true;
    return isCompoundAssigned(assigned, compound, masterTargets);
  };

  const isDon = (currentDraft.page1Data['printFormType'] || 'formCheck') === 'formDon';
  const isGop = !isDon && currentDraft.page1Data && currentDraft.page1Data['checkGopInChung'] === true;

  if (isGop && filteredSamples.length > 0) {
    const mergedSampleCode = filteredSamples.join('; ');
    const rowData: Record<string, any> = {
      maSoMau: mergedSampleCode,
      khoiLuong: currentDraft.resultData[filteredSamples[0]]?.['khoiLuong'] || '10.0',
      heSoPhaLoang: currentDraft.resultData[filteredSamples[0]]?.['heSoPhaLoang'] || '1',
      hSoPhaLoang: currentDraft.resultData[filteredSamples[0]]?.['hSoPhaLoang'] || '1',
      loSo: currentDraft.resultData[filteredSamples[0]]?.['loSo'] || '',
      checkBoSungNuoc: currentDraft.resultData[filteredSamples[0]]?.['checkBoSungNuoc'] || 'khÃƒÂ´ng',
      checkHonHopLamSach: currentDraft.resultData[filteredSamples[0]]?.['checkHonHopLamSach'] || 'B1'
    };

    const isAssignedToAny = (compound: string): boolean => {
      return filteredSamples.some((s: string) => isAssigned(s, compound));
    };

    currentConf.compounds.forEach((c: string) => {
      const backendKey = c;
      const assigned = isAssignedToAny(c);

      if (!assigned) {
        rowData[backendKey] = '';
        rowData[`${backendKey}_nd`] = false;
        rowData[`${backendKey}_qc1`] = 'N/A';
        rowData[`${backendKey}_qc2`] = 'N/A';
        rowData[`${backendKey}_qc3`] = 'N/A';
      } else {
        const uniqueVals = new Set<string>(filteredSamples.map((s: string) => {
          const sRes = currentDraft.resultData[s] || {};
          const isNd = sRes[`${c}_nd`] === true;
          const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
          return isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
        }));

        if (uniqueVals.size === 1) {
          const commonVal = Array.from(uniqueVals)[0];
          if (commonVal === 'KPH') {
            rowData[`${backendKey}_nd`] = true;
            rowData[backendKey] = '';
          } else if (commonVal === 'N/A') {
            rowData[`${backendKey}_nd`] = false;
            rowData[backendKey] = '';
          } else {
            rowData[`${backendKey}_nd`] = false;
            rowData[backendKey] = commonVal;
          }
        } else {
          rowData[`${backendKey}_nd`] = false;
          const resultParts = filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            const isNd = sRes[`${c}_nd`] === true;
            const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
            const displayVal = isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
            return displayVal ? `${s}: ${displayVal}` : `${s}:`;
          });
          rowData[backendKey] = resultParts.filter((p: string) => !p.endsWith(':')).join('; ');
        }

        const getMergedQc = (qcKey: string): string => {
          const uniqueQcs = new Set<string>(filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            return (sRes[`${c}_${qcKey}`] as string) || 'Ã„ÂÃ¡ÂºÂ¡t';
          }));
          if (uniqueQcs.size === 1) {
            return Array.from(uniqueQcs)[0];
          }
          return filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            return `${s}: ${(sRes[`${c}_${qcKey}`] as string) || 'Ã„ÂÃ¡ÂºÂ¡t'}`;
          }).join('; ');
        };

        rowData[`${backendKey}_qc1`] = getMergedQc('qc1');
        rowData[`${backendKey}_qc2`] = getMergedQc('qc2');
        rowData[`${backendKey}_qc3`] = getMergedQc('qc3');
      }
    });

    samplesPayload.push(rowData);
  } else {
    let formDonSamples = [...filteredSamples];
    if (isDon) {
      formDonSamples.unshift('QC_BLANK', 'QC_SPIKE');
      if (currentDraft.page1Data['hasFinal']) formDonSamples.push('QC_FINAL');
    }

    formDonSamples.forEach((sampleCode: string) => {
      const resObj = currentDraft.resultData[sampleCode] || {};
      let displayMaSoMau = sampleCode;
      if (sampleCode === 'QC_BLANK') displayMaSoMau = currentDraft.page1Data['blankName'] || 'Blank';
      else if (sampleCode === 'QC_SPIKE') displayMaSoMau = currentDraft.page1Data['spikeName'] || 'Spike';
      else if (sampleCode === 'QC_FINAL') displayMaSoMau = 'FINAL';

      const rowData: Record<string, any> = {
        maSoMau: displayMaSoMau,
        khoiLuong: resObj['khoiLuong'] || '10.0',
        heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
        hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
        loSo: resObj['loSo'] || '',
        checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'khÃƒÂ´ng',
        checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1'
      };

      currentConf.compounds.forEach((c: string) => {
        const backendKey = c;
        const val = resObj[c] !== undefined && resObj[c] !== null ? String(resObj[c]) : '';
        const assigned = isAssigned(sampleCode, c);
        
        if (!assigned) {
          rowData[backendKey] = '';
          rowData[`${backendKey}_nd`] = false;
          rowData[`${backendKey}_qc1`] = 'N/A';
          rowData[`${backendKey}_qc2`] = 'N/A';
          rowData[`${backendKey}_qc3`] = 'N/A';
        } else {
          const isNd = resObj[`${c}_nd`] === true;
          rowData[backendKey] = isNd ? '' : (val === 'N/A' || val === 'N/A' ? '' : val);
          rowData[`${backendKey}_nd`] = isNd;
          rowData[`${backendKey}_qc1`] = resObj[`${c}_qc1`] || '';
          rowData[`${backendKey}_qc2`] = resObj[`${c}_qc2`] || '';
          rowData[`${backendKey}_qc3`] = resObj[`${c}_qc3`] || '';
        }
      });

      samplesPayload.push(rowData);
    });
  }

  // Helper to build compound results and notes maps for runSamplesList
  const buildCompoundMaps = (resKey: string) => {
    const resObj = currentDraft.resultData[resKey] || {};
    const results: Record<string, string> = {};
    const notes: Record<string, string> = {};
    currentConf.compounds.forEach((c: string) => {
      const backendKey = c;
      const isNd = resObj[`${c}_nd`] === true || resObj[c] === 'ND' || resObj[c] === 'N/A' || resObj[c] === 'N/A';
      const val = resObj[c];
      const displayVal = (val === 'N/A') ? '' : (val !== undefined && val !== null && String(val).trim() !== '' ? String(val) : 'ND');
      results[backendKey] = (val === 'N/A') ? '' : (isNd ? 'ND' : displayVal);
      notes[backendKey] = resObj[`${c}_ghiChu`] || resObj['ghiChu'] || '';
    });
    return { results, notes };
  };

  // Build chromatography runs list
  const runSamplesList: any[] = [];
  
  // 1. QC_BLANK
  const blankName = currentDraft.page1Data['blankName'] || 'BLANK';
  const blankRes = currentDraft.resultData['QC_BLANK'] || {};
  const blankMaps = buildCompoundMaps('QC_BLANK');
  runSamplesList.push({
    key: 'QC_BLANK',
    maSoMau: blankName,
    khoiLuong: blankRes['khoiLuong'] || '10.0',
    heSoPhaLoang: blankRes['heSoPhaLoang'] || '1',
    hSoPhaLoang: blankRes['hSoPhaLoang'] || '1',
    loSo: blankRes['loSo'] || '6',
    checkBoSungNuoc: blankRes['checkBoSungNuoc'] || 'khÃƒÂ´ng',
    checkHonHopLamSach: blankRes['checkHonHopLamSach'] || 'B1',
    summaryResult: 'N/A',
    compoundResults: blankMaps.results,
    compoundNotes: blankMaps.notes
  });

  // 2. QC_SPIKE
  const spikeName = currentDraft.page1Data['spikeName'] || 'SPIKE';
  const spikeRes = currentDraft.resultData['QC_SPIKE'] || {};
  const spikeMaps = buildCompoundMaps('QC_SPIKE');
  runSamplesList.push({
    key: 'QC_SPIKE',
    maSoMau: spikeName,
    khoiLuong: spikeRes['khoiLuong'] || '10.0',
    heSoPhaLoang: spikeRes['heSoPhaLoang'] || '1',
    hSoPhaLoang: spikeRes['hSoPhaLoang'] || '1',
    loSo: spikeRes['loSo'] || '7',
    checkBoSungNuoc: spikeRes['checkBoSungNuoc'] || 'khÃƒÂ´ng',
    checkHonHopLamSach: spikeRes['checkHonHopLamSach'] || 'B1',
    summaryResult: 'N/A',
    compoundResults: spikeMaps.results,
    compoundNotes: spikeMaps.notes
  });

  // 3. Regular samples
  if (isGop && filteredSamples.length > 0) {
    const mergedSampleCode = filteredSamples.join('; ');
    const s0 = filteredSamples[0];
    const resObj = currentDraft.resultData[s0] || {};
    const detected: string[] = [];
    currentConf.compounds.forEach((c: string) => {
      const isDet = filteredSamples.some((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        return isAssigned(sCode, c) && sRes[`${c}_nd`] !== true && sRes[c] && sRes[c] !== 'N/A';
      });
      if (isDet) {
        const vals = filteredSamples.map((sCode: string) => {
          const sRes = currentDraft.resultData[sCode] || {};
          return (sRes[c] === 'N/A') ? '' : (sRes[c] || 'N/A');
        }).join('; ');
        detected.push(`${c}: ${vals}`);
      }
    });
    const summaryResult = detected.length > 0 ? detected.join('; ') : 'N/A';

    const compoundResults = currentConf.compounds.reduce((acc: any, c: string) => {
      const backendKey = c;
      const vals = filteredSamples.map((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        const isNd = sRes[`${c}_nd`] === true;
        return isNd ? 'N/A' : ((sRes[c] === 'N/A') ? '' : (sRes[c] || 'N/A'));
      });
      const allKph = vals.every((v: string) => v === 'N/A' || v === '');
      acc[backendKey] = allKph ? 'N/A' : vals.join('; ');
      return acc;
    }, {});

    const compoundNotes = currentConf.compounds.reduce((acc: any, c: string) => {
      const backendKey = c;
      const notes = filteredSamples.map((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        return sRes[`${c}_ghiChu`] || sRes['ghiChu'] || '';
      });
      acc[backendKey] = notes.join('; ');
      return acc;
    }, {});

    runSamplesList.push({
      key: 'GROUPED',
      maSoMau: mergedSampleCode,
      khoiLuong: resObj['khoiLuong'] || '10.0',
      heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
      hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
      loSo: resObj['loSo'] || '',
      checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'khÃƒÂ´ng',
      checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1',
      summaryResult: summaryResult,
      compoundResults: compoundResults,
      compoundNotes: compoundNotes
    });
  } else {
    filteredSamples.forEach((s: string) => {
      const resObj = currentDraft.resultData[s] || {};
      const detected: string[] = [];
      currentConf.compounds.forEach((c: string) => {
        if (isAssigned(s, c) && resObj[`${c}_nd`] !== true && resObj[c] && resObj[c] !== 'N/A') {
          detected.push(`${c}: ${resObj[c]}`);
        }
      });
      const summaryResult = detected.length > 0 ? detected.join('; ') : 'N/A';
      
      const sMaps = buildCompoundMaps(s);
      runSamplesList.push({
        key: s,
        maSoMau: s,
        khoiLuong: resObj['khoiLuong'] || '10.0',
        heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
        hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
        loSo: resObj['loSo'] || '',
        checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'khÃƒÂ´ng',
        checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1',
        summaryResult: summaryResult,
        compoundResults: sMaps.results,
        compoundNotes: sMaps.notes
      });
    });
  }

  // 4. QC_FINAL
  if (currentDraft.page1Data['hasFinal']) {
    const finalRes = currentDraft.resultData['QC_FINAL'] || {};
    const finalMaps = buildCompoundMaps('QC_FINAL');
    runSamplesList.push({
      key: 'QC_FINAL',
      maSoMau: 'FINAL',
      khoiLuong: finalRes['khoiLuong'] || '10.0',
      heSoPhaLoang: finalRes['heSoPhaLoang'] || '1',
      hSoPhaLoang: finalRes['hSoPhaLoang'] || '1',
      loSo: finalRes['loSo'] || '7',
      checkBoSungNuoc: finalRes['checkBoSungNuoc'] || 'khÃƒÂ´ng',
      checkHonHopLamSach: finalRes['checkHonHopLamSach'] || 'B1',
      summaryResult: 'N/A',
      compoundResults: finalMaps.results,
      compoundNotes: finalMaps.notes
    });
  }

  // Get active compounds to print (for formDon, only print the selected activeCompound)
  const activeCompoundsConfig = isDon 
    ? [currentDraft.page1Data['activeCompound'] || currentConf.compounds[0]] 
    : currentConf.compounds.filter((c: string) => {
        return filteredSamples.some((s: string) => isAssigned(s, c));
      });
  const compoundsToPrint = activeCompoundsConfig;

  return {
    action: 'generate_pdf',
    sopId: 'lan-huu-co',
    metadata: {
      ...currentDraft.page1Data,
      printFormType: currentDraft.page1Data['printFormType'] || 'formCheck',
      blankName: currentDraft.page1Data['blankName'] || 'BLANK',
      spikeName: currentDraft.page1Data['spikeName'] || 'SPIKE',
      hasFinal: currentDraft.page1Data['hasFinal'] === true,
      calibPoints: currentDraft.page1Data['calibPoints'] || [],
      r2: currentDraft.page1Data['r2'] || '',
      compoundsToPrint: compoundsToPrint,
      targetInfo: buildTargetMetadata(currentConf.compounds, masterTargets || [], currentConf.id),
      prefix: prefixForReport,
      sampleTargetMap: sampleTargetMap,
      ngayNguoiPhanTich: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      ngayNguoiThamTra: formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
      ngayBaoCao: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      runSamplesList: runSamplesList
    },
    samples: samplesPayload
  };
}

export function buildChlorHuuCoPdfPayload(currentDraft: any, currentRun: any, activeFilter: string, currentConf: any, formatAnalysisDate: (d: string) => string, getRunDate: () => string, masterTargets: any[] = []): any {
  const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
  const samplesPayload: any[] = [];
  const sampleList = currentRun.sampleList || [];

  const filteredSamples = sampleList.filter((s: string) => {
    const resObj = currentDraft.resultData[s] || {};
    const startsWithLetter = /^[a-zA-Z]/.test(s);
    const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
    const isSelected = resObj['selected'] !== false;
    const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
    return isSelected && matchesFilter;
  });

  const sampleTargetMap = currentRun.sampleTargetMap || (currentRun.inputs && currentRun.inputs.sampleTargetMap) || {};

  const isAssigned = (sampleCode: string, compound: string): boolean => {
    const assigned = getAssignedTargetsForSample(sampleCode, sampleTargetMap);
    if (!assigned) return true;
    return isCompoundAssigned(assigned, compound, masterTargets);
  };

  const isDon = (currentDraft.page1Data['printFormType'] || 'formCheck') === 'formDon';
  const isGop = !isDon && currentDraft.page1Data && currentDraft.page1Data['checkGopInChung'] === true;

  if (isGop && filteredSamples.length > 0) {
    const mergedSampleCode = filteredSamples.join('; ');
    const rowData: Record<string, any> = {
      maSoMau: mergedSampleCode,
      khoiLuong: currentDraft.resultData[filteredSamples[0]]?.['khoiLuong'] || '10.0',
      heSoPhaLoang: currentDraft.resultData[filteredSamples[0]]?.['heSoPhaLoang'] || '1',
      hSoPhaLoang: currentDraft.resultData[filteredSamples[0]]?.['hSoPhaLoang'] || '1',
      loSo: currentDraft.resultData[filteredSamples[0]]?.['loSo'] || '',
      checkBoSungNuoc: currentDraft.resultData[filteredSamples[0]]?.['checkBoSungNuoc'] || 'khÃƒÂ´ng',
      checkHonHopLamSach: currentDraft.resultData[filteredSamples[0]]?.['checkHonHopLamSach'] || 'B1'
    };

    const isAssignedToAny = (compound: string): boolean => {
      return filteredSamples.some((s: string) => isAssigned(s, compound));
    };

    currentConf.compounds.forEach((c: string) => {
      const backendKey = c;
      const assigned = isAssignedToAny(c);

      if (!assigned) {
        rowData[backendKey] = '';
        rowData[`${backendKey}_nd`] = false;
        rowData[`${backendKey}_qc1`] = 'N/A';
        rowData[`${backendKey}_qc2`] = 'N/A';
        rowData[`${backendKey}_qc3`] = 'N/A';
      } else {
        const uniqueVals = new Set<string>(filteredSamples.map((s: string) => {
          const sRes = currentDraft.resultData[s] || {};
          const isNd = sRes[`${c}_nd`] === true;
          const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
          return isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
        }));

        if (uniqueVals.size === 1) {
          const commonVal = Array.from(uniqueVals)[0];
          if (commonVal === 'KPH') {
            rowData[`${backendKey}_nd`] = true;
            rowData[backendKey] = '';
          } else if (commonVal === 'N/A') {
            rowData[`${backendKey}_nd`] = false;
            rowData[backendKey] = '';
          } else {
            rowData[`${backendKey}_nd`] = false;
            rowData[backendKey] = commonVal;
          }
        } else {
          rowData[`${backendKey}_nd`] = false;
          const resultParts = filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            const isNd = sRes[`${c}_nd`] === true;
            const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
            const displayVal = isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
            return displayVal ? `${s}: ${displayVal}` : `${s}:`;
          });
          rowData[backendKey] = resultParts.filter((p: string) => !p.endsWith(':')).join('; ');
        }

        const getMergedQc = (qcKey: string): string => {
          const uniqueQcs = new Set<string>(filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            return (sRes[`${c}_${qcKey}`] as string) || 'Ã„ÂÃ¡ÂºÂ¡t';
          }));
          if (uniqueQcs.size === 1) {
            return Array.from(uniqueQcs)[0];
          }
          return filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            return `${s}: ${(sRes[`${c}_${qcKey}`] as string) || 'Ã„ÂÃ¡ÂºÂ¡t'}`;
          }).join('; ');
        };

        rowData[`${backendKey}_qc1`] = getMergedQc('qc1');
        rowData[`${backendKey}_qc2`] = getMergedQc('qc2');
        rowData[`${backendKey}_qc3`] = getMergedQc('qc3');
      }
    });

    samplesPayload.push(rowData);
  } else {
    let formDonSamples = [...filteredSamples];
    if (isDon) {
      formDonSamples.unshift('QC_BLANK', 'QC_SPIKE');
      if (currentDraft.page1Data['hasFinal']) formDonSamples.push('QC_FINAL');
    }

    formDonSamples.forEach((sampleCode: string) => {
      const resObj = currentDraft.resultData[sampleCode] || {};
      let displayMaSoMau = sampleCode;
      if (sampleCode === 'QC_BLANK') displayMaSoMau = currentDraft.page1Data['blankName'] || 'Blank';
      else if (sampleCode === 'QC_SPIKE') displayMaSoMau = currentDraft.page1Data['spikeName'] || 'Spike';
      else if (sampleCode === 'QC_FINAL') displayMaSoMau = 'FINAL';

      const rowData: Record<string, any> = {
        maSoMau: displayMaSoMau,
        khoiLuong: resObj['khoiLuong'] || '10.0',
        heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
        hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
        loSo: resObj['loSo'] || '',
        checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'khÃƒÂ´ng',
        checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1'
      };

      currentConf.compounds.forEach((c: string) => {
        const backendKey = c;
        const val = resObj[c] !== undefined && resObj[c] !== null ? String(resObj[c]) : '';
        const assigned = isAssigned(sampleCode, c);

        if (!assigned) {
          rowData[backendKey] = '';
          rowData[`${backendKey}_nd`] = false;
          rowData[`${backendKey}_qc1`] = 'N/A';
          rowData[`${backendKey}_qc2`] = 'N/A';
          rowData[`${backendKey}_qc3`] = 'N/A';
        } else {
          const isNd = resObj[`${c}_nd`] === true;
          rowData[backendKey] = isNd ? '' : (val === 'N/A' || val === 'N/A' ? '' : val);
          rowData[`${backendKey}_nd`] = isNd;
          rowData[`${backendKey}_qc1`] = resObj[`${c}_qc1`] || '';
          rowData[`${backendKey}_qc2`] = resObj[`${c}_qc2`] || '';
          rowData[`${backendKey}_qc3`] = resObj[`${c}_qc3`] || '';
        }
      });

      samplesPayload.push(rowData);
    });
  }

  // Helper to build compound results and notes maps for runSamplesList
  const buildCompoundMaps = (resKey: string) => {
    const resObj = currentDraft.resultData[resKey] || {};
    const results: Record<string, string> = {};
    const notes: Record<string, string> = {};
    currentConf.compounds.forEach((c: string) => {
      const isNd = resObj[`${c}_nd`] === true || resObj[c] === 'ND' || resObj[c] === 'N/A' || resObj[c] === 'N/A';
      const val = resObj[c];
      const backendKey = c;
      const displayVal = (val === 'N/A') ? '' : (val !== undefined && val !== null && String(val).trim() !== '' ? String(val) : 'ND');
      results[backendKey] = (val === 'N/A') ? '' : (isNd ? 'ND' : displayVal);
      notes[backendKey] = resObj[`${c}_ghiChu`] || resObj['ghiChu'] || '';
    });
    return { results, notes };
  };

  // Build chromatography runs list
  const runSamplesList: any[] = [];

  // 1. QC_BLANK
  const blankName = currentDraft.page1Data['blankName'] || 'BLANK';
  const blankRes = currentDraft.resultData['QC_BLANK'] || {};
  const blankMaps = buildCompoundMaps('QC_BLANK');
  runSamplesList.push({
    key: 'QC_BLANK',
    maSoMau: blankName,
    khoiLuong: blankRes['khoiLuong'] || '10.0',
    heSoPhaLoang: blankRes['heSoPhaLoang'] || '1',
    hSoPhaLoang: blankRes['hSoPhaLoang'] || '1',
    loSo: blankRes['loSo'] || '7',
    checkBoSungNuoc: blankRes['checkBoSungNuoc'] || 'khÃƒÂ´ng',
    checkHonHopLamSach: blankRes['checkHonHopLamSach'] || 'B1',
    summaryResult: 'N/A',
    compoundResults: blankMaps.results,
    compoundNotes: blankMaps.notes
  });

  // 2. QC_SPIKE
  const spikeName = currentDraft.page1Data['spikeName'] || 'SPIKE';
  const spikeRes = currentDraft.resultData['QC_SPIKE'] || {};
  const spikeMaps = buildCompoundMaps('QC_SPIKE');
  runSamplesList.push({
    key: 'QC_SPIKE',
    maSoMau: spikeName,
    khoiLuong: spikeRes['khoiLuong'] || '10.0',
    heSoPhaLoang: spikeRes['heSoPhaLoang'] || '1',
    hSoPhaLoang: spikeRes['hSoPhaLoang'] || '1',
    loSo: spikeRes['loSo'] || '8',
    checkBoSungNuoc: spikeRes['checkBoSungNuoc'] || 'khÃƒÂ´ng',
    checkHonHopLamSach: spikeRes['checkHonHopLamSach'] || 'B1',
    summaryResult: 'N/A',
    compoundResults: spikeMaps.results,
    compoundNotes: spikeMaps.notes
  });

  // 3. Regular samples
  if (isGop && filteredSamples.length > 0) {
    const mergedSampleCode = filteredSamples.join('; ');
    const s0 = filteredSamples[0];
    const resObj = currentDraft.resultData[s0] || {};
    const detected: string[] = [];
    currentConf.compounds.forEach((c: string) => {
      const isDet = filteredSamples.some((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        return isAssigned(sCode, c) && sRes[`${c}_nd`] !== true && sRes[c] && sRes[c] !== 'N/A';
      });
      if (isDet) {
        const vals = filteredSamples.map((sCode: string) => {
          const sRes = currentDraft.resultData[sCode] || {};
          return (sRes[c] === 'N/A') ? '' : (sRes[c] || 'N/A');
        }).join('; ');
        detected.push(`${c}: ${vals}`);
      }
    });
    const summaryResult = detected.length > 0 ? detected.join('; ') : 'N/A';

    const compoundResults = currentConf.compounds.reduce((acc: any, c: string) => {
      const vals = filteredSamples.map((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        const isNd = sRes[`${c}_nd`] === true;
        return isNd ? 'N/A' : ((sRes[c] === 'N/A') ? '' : (sRes[c] || 'N/A'));
      });
      const allKph = vals.every((v: string) => v === 'N/A' || v === '');
      const backendKey = c;
      acc[backendKey] = allKph ? 'N/A' : vals.join('; ');
      return acc;
    }, {});

    const compoundNotes = currentConf.compounds.reduce((acc: any, c: string) => {
      const notes = filteredSamples.map((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        return sRes[`${c}_ghiChu`] || sRes['ghiChu'] || '';
      });
      const backendKey = c;
      acc[backendKey] = notes.join('; ');
      return acc;
    }, {});

    runSamplesList.push({
      key: 'GROUPED',
      maSoMau: mergedSampleCode,
      khoiLuong: resObj['khoiLuong'] || '10.0',
      heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
      hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
      loSo: resObj['loSo'] || '',
      checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'khÃƒÂ´ng',
      checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1',
      summaryResult: summaryResult,
      compoundResults: compoundResults,
      compoundNotes: compoundNotes
    });
  } else {
    filteredSamples.forEach((s: string) => {
      const resObj = currentDraft.resultData[s] || {};
      const detected: string[] = [];
      currentConf.compounds.forEach((c: string) => {
        if (isAssigned(s, c) && resObj[`${c}_nd`] !== true && resObj[c] && resObj[c] !== 'N/A') {
          detected.push(`${c}: ${resObj[c]}`);
        }
      });
      const summaryResult = detected.length > 0 ? detected.join('; ') : 'N/A';

      const sMaps = buildCompoundMaps(s);
      runSamplesList.push({
        key: s,
        maSoMau: s,
        khoiLuong: resObj['khoiLuong'] || '10.0',
        heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
        hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
        loSo: resObj['loSo'] || '',
        checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'khÃƒÂ´ng',
        checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1',
        summaryResult: summaryResult,
        compoundResults: sMaps.results,
        compoundNotes: sMaps.notes
      });
    });
  }

  // 4. QC_FINAL
  if (currentDraft.page1Data['hasFinal']) {
    const finalRes = currentDraft.resultData['QC_FINAL'] || {};
    const finalMaps = buildCompoundMaps('QC_FINAL');
    runSamplesList.push({
      key: 'QC_FINAL',
      maSoMau: 'FINAL',
      khoiLuong: finalRes['khoiLuong'] || '10.0',
      heSoPhaLoang: finalRes['heSoPhaLoang'] || '1',
      hSoPhaLoang: finalRes['hSoPhaLoang'] || '1',
      loSo: finalRes['loSo'] || '8',
      checkBoSungNuoc: finalRes['checkBoSungNuoc'] || 'khÃƒÂ´ng',
      checkHonHopLamSach: finalRes['checkHonHopLamSach'] || 'B1',
      summaryResult: 'N/A',
      compoundResults: finalMaps.results,
      compoundNotes: finalMaps.notes
    });
  }

  // Get active compounds to print (for formDon, only print the selected activeCompound)
  const activeCompoundsConfig = isDon 
    ? [currentDraft.page1Data['activeCompound'] || currentConf.compounds[0]] 
    : currentConf.compounds.filter((c: string) => {
        return filteredSamples.some((s: string) => isAssigned(s, c));
      });
  const compoundsToPrint = activeCompoundsConfig.map((c: string) => mapCompoundToKey(c));

  return {
    action: 'generate_pdf',
    sopId: 'chlor-huu-co',
    metadata: {
      ...currentDraft.page1Data,
      printFormType: currentDraft.page1Data['printFormType'] || 'formCheck',
      blankName: currentDraft.page1Data['blankName'] || 'BLANK',
      spikeName: currentDraft.page1Data['spikeName'] || 'SPIKE',
      hasFinal: currentDraft.page1Data['hasFinal'] === true,
      calibPoints: currentDraft.page1Data['calibPoints'] || [],
      r2: currentDraft.page1Data['r2'] || '',
      compoundsToPrint: compoundsToPrint,
      targetInfo: buildTargetMetadata(currentConf.compounds, masterTargets || [], currentConf.id),
      prefix: prefixForReport,
      sampleTargetMap: sampleTargetMap,
      ngayNguoiPhanTich: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      ngayNguoiThamTra: formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
      ngayBaoCao: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      runSamplesList: runSamplesList
    },
    samples: samplesPayload
  };
}

export function buildNhomCucPdfPayload(currentDraft: any, currentRun: any, activeFilter: string, currentConf: any, formatAnalysisDate: (d: string) => string, getRunDate: () => string, masterTargets: any[] = []): any {
  const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
  const samplesPayload: any[] = [];
  const sampleList = currentRun.sampleList || [];

  const filteredSamples = sampleList.filter((s: string) => {
    const resObj = currentDraft.resultData[s] || {};
    const startsWithLetter = /^[a-zA-Z]/.test(s);
    const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
    const isSelected = resObj['selected'] !== false;
    const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
    return isSelected && matchesFilter;
  });

  const sampleTargetMap = currentRun.sampleTargetMap || (currentRun.inputs && currentRun.inputs.sampleTargetMap) || {};

  const isAssigned = (sampleCode: string, compound: string): boolean => {
    const assigned = getAssignedTargetsForSample(sampleCode, sampleTargetMap);
    if (!assigned) return true;
    return isCompoundAssigned(assigned, compound, masterTargets);
  };

  const isDon = (currentDraft.page1Data['printFormType'] || 'formCheck') === 'formDon';
  const isGop = !isDon && currentDraft.page1Data && currentDraft.page1Data['checkGopInChung'] === true;

  if (isGop && filteredSamples.length > 0) {
    const mergedSampleCode = filteredSamples.join('; ');
    const rowData: Record<string, any> = {
      maSoMau: mergedSampleCode,
      khoiLuong: currentDraft.resultData[filteredSamples[0]]?.['khoiLuong'] || '10.0',
      heSoPhaLoang: currentDraft.resultData[filteredSamples[0]]?.['heSoPhaLoang'] || '1',
      hSoPhaLoang: currentDraft.resultData[filteredSamples[0]]?.['hSoPhaLoang'] || '1',
      loSo: currentDraft.resultData[filteredSamples[0]]?.['loSo'] || '',
      checkBoSungNuoc: currentDraft.resultData[filteredSamples[0]]?.['checkBoSungNuoc'] || 'khÃƒÂ´ng',
      checkHonHopLamSach: currentDraft.resultData[filteredSamples[0]]?.['checkHonHopLamSach'] || 'B1'
    };

    const isAssignedToAny = (compound: string): boolean => {
      return filteredSamples.some((s: string) => isAssigned(s, compound));
    };

    currentConf.compounds.forEach((c: string) => {
      const backendKey = c;
      const assigned = isAssignedToAny(c);

      if (!assigned) {
        rowData[backendKey] = '';
        rowData[`${backendKey}_nd`] = false;
        rowData[`${backendKey}_qc1`] = 'N/A';
        rowData[`${backendKey}_qc2`] = 'N/A';
        rowData[`${backendKey}_qc3`] = 'N/A';
      } else {
        const uniqueVals = new Set<string>(filteredSamples.map((s: string) => {
          const sRes = currentDraft.resultData[s] || {};
          const isNd = sRes[`${c}_nd`] === true;
          const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
          return isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
        }));

        if (uniqueVals.size === 1) {
          const commonVal = Array.from(uniqueVals)[0];
          if (commonVal === 'KPH') {
            rowData[`${backendKey}_nd`] = true;
            rowData[backendKey] = '';
          } else if (commonVal === 'N/A') {
            rowData[`${backendKey}_nd`] = false;
            rowData[backendKey] = '';
          } else {
            rowData[`${backendKey}_nd`] = false;
            rowData[backendKey] = commonVal;
          }
        } else {
          rowData[`${backendKey}_nd`] = false;
          const resultParts = filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            const isNd = sRes[`${c}_nd`] === true;
            const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
            const displayVal = isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
            return displayVal ? `${s}: ${displayVal}` : `${s}:`;
          });
          rowData[backendKey] = resultParts.filter((p: string) => !p.endsWith(':')).join('; ');
        }

        const getMergedQc = (qcKey: string): string => {
          const uniqueQcs = new Set<string>(filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            return (sRes[`${c}_${qcKey}`] as string) || 'Ã„ÂÃ¡ÂºÂ¡t';
          }));
          if (uniqueQcs.size === 1) {
            return Array.from(uniqueQcs)[0];
          }
          return filteredSamples.map((s: string) => {
            const sRes = currentDraft.resultData[s] || {};
            return `${s}: ${(sRes[`${c}_${qcKey}`] as string) || 'Ã„ÂÃ¡ÂºÂ¡t'}`;
          }).join('; ');
        };

        rowData[`${backendKey}_qc1`] = getMergedQc('qc1');
        rowData[`${backendKey}_qc2`] = getMergedQc('qc2');
        rowData[`${backendKey}_qc3`] = getMergedQc('qc3');
      }
    });

    samplesPayload.push(rowData);
  } else {
    let formDonSamples = [...filteredSamples];
    if (isDon) {
      formDonSamples.unshift('QC_BLANK', 'QC_SPIKE');
      if (currentDraft.page1Data['hasFinal']) formDonSamples.push('QC_FINAL');
    }

    formDonSamples.forEach((sampleCode: string) => {
      const resObj = currentDraft.resultData[sampleCode] || {};
      let displayMaSoMau = sampleCode;
      if (sampleCode === 'QC_BLANK') displayMaSoMau = currentDraft.page1Data['blankName'] || 'Blank';
      else if (sampleCode === 'QC_SPIKE') displayMaSoMau = currentDraft.page1Data['spikeName'] || 'Spike';
      else if (sampleCode === 'QC_FINAL') displayMaSoMau = 'FINAL';

      const rowData: Record<string, any> = {
        maSoMau: displayMaSoMau,
        khoiLuong: resObj['khoiLuong'] || '10.0',
        heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
        hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
        loSo: resObj['loSo'] || '',
        checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'khÃƒÂ´ng',
        checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1'
      };

      currentConf.compounds.forEach((c: string) => {
        const backendKey = c;
        const val = resObj[c] !== undefined && resObj[c] !== null ? String(resObj[c]) : '';
        const assigned = isAssigned(sampleCode, c);

        if (!assigned) {
          rowData[backendKey] = '';
          rowData[`${backendKey}_nd`] = false;
          rowData[`${backendKey}_qc1`] = 'N/A';
          rowData[`${backendKey}_qc2`] = 'N/A';
          rowData[`${backendKey}_qc3`] = 'N/A';
        } else {
          const isNd = resObj[`${c}_nd`] === true;
          rowData[backendKey] = isNd ? '' : (val === 'N/A' || val === 'N/A' ? '' : val);
          rowData[`${backendKey}_nd`] = isNd;
          rowData[`${backendKey}_qc1`] = resObj[`${c}_qc1`] || '';
          rowData[`${backendKey}_qc2`] = resObj[`${c}_qc2`] || '';
          rowData[`${backendKey}_qc3`] = resObj[`${c}_qc3`] || '';
        }
      });

      samplesPayload.push(rowData);
    });
  }

  // Helper to build compound results and notes maps for runSamplesList
  const buildCompoundMaps = (resKey: string) => {
    const resObj = currentDraft.resultData[resKey] || {};
    const results: Record<string, string> = {};
    const notes: Record<string, string> = {};
    currentConf.compounds.forEach((c: string) => {
      const isNd = resObj[`${c}_nd`] === true || resObj[c] === 'ND' || resObj[c] === 'N/A' || resObj[c] === 'N/A';
      const val = resObj[c];
      const backendKey = c;
      const displayVal = (val === 'N/A') ? '' : (val !== undefined && val !== null && String(val).trim() !== '' ? String(val) : 'ND');
      results[backendKey] = (val === 'N/A') ? '' : (isNd ? 'ND' : displayVal);
      notes[backendKey] = resObj[`${c}_ghiChu`] || resObj['ghiChu'] || '';
    });
    return { results, notes };
  };

  // Build chromatography runs list
  const runSamplesList: any[] = [];

  // 1. QC_BLANK
  const blankName = currentDraft.page1Data['blankName'] || 'BLANK';
  const blankRes = currentDraft.resultData['QC_BLANK'] || {};
  const blankMaps = buildCompoundMaps('QC_BLANK');
  runSamplesList.push({
    key: 'QC_BLANK',
    maSoMau: blankName,
    khoiLuong: blankRes['khoiLuong'] || '10.0',
    heSoPhaLoang: blankRes['heSoPhaLoang'] || '1',
    hSoPhaLoang: blankRes['hSoPhaLoang'] || '1',
    loSo: blankRes['loSo'] || '7',
    checkBoSungNuoc: blankRes['checkBoSungNuoc'] || 'khÃƒÂ´ng',
    checkHonHopLamSach: blankRes['checkHonHopLamSach'] || 'B1',
    summaryResult: 'N/A',
    compoundResults: blankMaps.results,
    compoundNotes: blankMaps.notes
  });

  // 2. QC_SPIKE
  const spikeName = currentDraft.page1Data['spikeName'] || 'SPIKE';
  const spikeRes = currentDraft.resultData['QC_SPIKE'] || {};
  const spikeMaps = buildCompoundMaps('QC_SPIKE');
  runSamplesList.push({
    key: 'QC_SPIKE',
    maSoMau: spikeName,
    khoiLuong: spikeRes['khoiLuong'] || '10.0',
    heSoPhaLoang: spikeRes['heSoPhaLoang'] || '1',
    hSoPhaLoang: spikeRes['hSoPhaLoang'] || '1',
    loSo: spikeRes['loSo'] || '8',
    checkBoSungNuoc: spikeRes['checkBoSungNuoc'] || 'khÃƒÂ´ng',
    checkHonHopLamSach: spikeRes['checkHonHopLamSach'] || 'B1',
    summaryResult: 'N/A',
    compoundResults: spikeMaps.results,
    compoundNotes: spikeMaps.notes
  });

  // 3. Regular samples
  if (isGop && filteredSamples.length > 0) {
    const mergedSampleCode = filteredSamples.join('; ');
    const s0 = filteredSamples[0];
    const resObj = currentDraft.resultData[s0] || {};
    const detected: string[] = [];
    currentConf.compounds.forEach((c: string) => {
      const isDet = filteredSamples.some((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        return isAssigned(sCode, c) && sRes[`${c}_nd`] !== true && sRes[c] && sRes[c] !== 'N/A';
      });
      if (isDet) {
        const vals = filteredSamples.map((sCode: string) => {
          const sRes = currentDraft.resultData[sCode] || {};
          return (sRes[c] === 'N/A') ? '' : (sRes[c] || 'N/A');
        }).join('; ');
        detected.push(`${c}: ${vals}`);
      }
    });
    const summaryResult = detected.length > 0 ? detected.join('; ') : 'N/A';

    const compoundResults = currentConf.compounds.reduce((acc: any, c: string) => {
      const vals = filteredSamples.map((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        const isNd = sRes[`${c}_nd`] === true;
        return isNd ? 'N/A' : ((sRes[c] === 'N/A') ? '' : (sRes[c] || 'N/A'));
      });
      const allKph = vals.every((v: string) => v === 'N/A' || v === '');
      const backendKey = c;
      acc[backendKey] = allKph ? 'N/A' : vals.join('; ');
      return acc;
    }, {});

    const compoundNotes = currentConf.compounds.reduce((acc: any, c: string) => {
      const notes = filteredSamples.map((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        return sRes[`${c}_ghiChu`] || sRes['ghiChu'] || '';
      });
      const backendKey = c;
      acc[backendKey] = notes.join('; ');
      return acc;
    }, {});

    runSamplesList.push({
      key: 'GROUPED',
      maSoMau: mergedSampleCode,
      khoiLuong: resObj['khoiLuong'] || '10.0',
      heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
      hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
      loSo: resObj['loSo'] || '',
      checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'khÃƒÂ´ng',
      checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1',
      summaryResult: summaryResult,
      compoundResults: compoundResults,
      compoundNotes: compoundNotes
    });
  } else {
    filteredSamples.forEach((s: string) => {
      const resObj = currentDraft.resultData[s] || {};
      const detected: string[] = [];
      currentConf.compounds.forEach((c: string) => {
        if (isAssigned(s, c) && resObj[`${c}_nd`] !== true && resObj[c] && resObj[c] !== 'N/A') {
          detected.push(`${c}: ${resObj[c]}`);
        }
      });
      const summaryResult = detected.length > 0 ? detected.join('; ') : 'N/A';

      const sMaps = buildCompoundMaps(s);
      runSamplesList.push({
        key: s,
        maSoMau: s,
        khoiLuong: resObj['khoiLuong'] || '10.0',
        heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
        hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
        loSo: resObj['loSo'] || '',
        checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'khÃƒÂ´ng',
        checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1',
        summaryResult: summaryResult,
        compoundResults: sMaps.results,
        compoundNotes: sMaps.notes
      });
    });
  }

  // 4. QC_FINAL
  if (currentDraft.page1Data['hasFinal']) {
    const finalRes = currentDraft.resultData['QC_FINAL'] || {};
    const finalMaps = buildCompoundMaps('QC_FINAL');
    runSamplesList.push({
      key: 'QC_FINAL',
      maSoMau: 'FINAL',
      khoiLuong: finalRes['khoiLuong'] || '10.0',
      heSoPhaLoang: finalRes['heSoPhaLoang'] || '1',
      hSoPhaLoang: finalRes['hSoPhaLoang'] || '1',
      loSo: finalRes['loSo'] || '8',
      checkBoSungNuoc: finalRes['checkBoSungNuoc'] || 'khÃƒÂ´ng',
      checkHonHopLamSach: finalRes['checkHonHopLamSach'] || 'B1',
      summaryResult: 'N/A',
      compoundResults: finalMaps.results,
      compoundNotes: finalMaps.notes
    });
  }

  // Get active compounds to print (for formDon, only print the selected activeCompound)
  const activeCompoundsConfig = isDon 
    ? [currentDraft.page1Data['activeCompound'] || currentConf.compounds[0]] 
    : currentConf.compounds.filter((c: string) => {
        return filteredSamples.some((s: string) => isAssigned(s, c));
      });
  const compoundsToPrint = activeCompoundsConfig.map((c: string) => mapCompoundToKey(c));

  return {
    action: 'generate_pdf',
    sopId: 'nhom-cuc',
    metadata: {
      ...currentDraft.page1Data,
      printFormType: currentDraft.page1Data['printFormType'] || 'formCheck',
      blankName: currentDraft.page1Data['blankName'] || 'BLANK',
      spikeName: currentDraft.page1Data['spikeName'] || 'SPIKE',
      hasFinal: currentDraft.page1Data['hasFinal'] === true,
      calibPoints: currentDraft.page1Data['calibPoints'] || [],
      r2: currentDraft.page1Data['r2'] || '',
      compoundsToPrint: compoundsToPrint,
      targetInfo: buildTargetMetadata(currentConf.compounds, masterTargets || [], currentConf.id),
      prefix: prefixForReport,
      sampleTargetMap: sampleTargetMap,
      ngayNguoiPhanTich: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      ngayNguoiThamTra: formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
      ngayBaoCao: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      runSamplesList: runSamplesList
    },
    samples: samplesPayload
  };
}

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  UNIFIED TYPE-3B PDF PAYLOAD BUILDER                                    ║
 * ║  Thay thế buildLanHuuCoPdfPayload, buildChlorHuuCoPdfPayload,           ║
 * ║  buildNhomCucPdfPayload — tất cả có cấu trúc giống hệt nhau.           ║
 * ║                                                                          ║
 * ║  Key insight (DATA_VERSION 2):                                           ║
 * ║  - compounds[] = canonical master_analyte.id                             ║
 * ║  - resultData keys = canonical master_analyte.id (sau migration)         ║
 * ║  - sampleTargetMap values = canonical master_analyte.id[]               ║
 * ║  → Không cần mapCompoundToKey() / getCanonicalId() shim                 ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
export function buildUnifiedType3bPdfPayload(
  currentDraft: any,
  currentRun: any,
  activeFilter: string,
  currentConf: any,
  formatAnalysisDate: (d: string) => string,
  getRunDate: () => string,
  masterTargets: any[] = []
): any {
  const sopId: string = currentConf.id || 'type3b';
  const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
  const sampleList: string[] = currentRun.sampleList || [];
  const sampleTargetMap: Record<string, string[]> =
    currentRun.sampleTargetMap || currentRun.inputs?.sampleTargetMap || {};

  // ── Helpers ──────────────────────────────────────────────────────────────

  const filterSample = (s: string): boolean => {
    const resObj = currentDraft.resultData[s] || {};
    const prefix = /^[a-zA-Z]/.test(s) ? s.charAt(0).toUpperCase() : '';
    return resObj['selected'] !== false &&
      (activeFilter === 'ALL' || prefix === activeFilter);
  };

  /**
   * Kiểm tra canonical id compound có được giao cho mẫu không.
   * Fast path: direct array.includes() vì cả hai đều dùng canonical id.
   * Fallback: lowercase compare cho dữ liệu cũ chưa migrate.
   */
  const isAssigned = (sampleCode: string, compound: string): boolean => {
    // QC samples luôn có tất cả compounds
    if (sampleCode.startsWith('QC_')) return true;
    const assigned = getAssignedTargetsForSample(sampleCode, sampleTargetMap);
    if (!assigned || assigned.length === 0) return true;
    
    // Use the robust global resolver that handles all legacy IDs and phonetic fallbacks
    return isCompoundAssigned(assigned, compound, masterTargets);
  };

  const filteredSamples = sampleList.filter(filterSample);

  const isDon = (currentDraft.page1Data['printFormType'] || 'formCheck') === 'formDon';
  const isGop = !isDon && currentDraft.page1Data['checkGopInChung'] === true;

  const targetInfo: Record<string, { displayName: string; unit: string; lod: string; loq: string }> = {};
  (currentConf.compounds as string[]).forEach(canonicalId => {
    const master = resolveTargetMasterInfo(canonicalId, masterTargets || []);
    let displayName = master?.name || canonicalId;
    if (sopId !== '9.16-tbvtv-water' && sopId !== 'tbvtv-trong-nuoc-gcmsms') {
      if (displayName === 'Fipronil (nhóm I)' || displayName === 'Fipronil (nhóm Lân)') {
        displayName = 'Fipronil';
      }
    }
    targetInfo[canonicalId] = {
      displayName: displayName,
      unit: master?.default_unit || 'ppb',
      lod: master?.default_lod || '',
      loq: master?.default_loq || ''
    };
  });

  // ── Build samples payload (cho bảng kết quả chính của phiếu) ─────────────

  const samplesPayload: any[] = [];

  /**
   * Tạo compound field cho một hàng (mẫu/QC).
   * Với DATA_VERSION 2: compound === backendKey (canonical id)
   */
  const buildCompoundFields = (resObj: any, compound: string, sampleCode: string): Record<string, any> => {
    const assigned = isAssigned(sampleCode, compound);
    if (!assigned) {
      return {
        [compound]: '',
        [`${compound}_nd`]: false,
        [`${compound}_qc1`]: 'N/A',
        [`${compound}_qc2`]: 'N/A',
        [`${compound}_qc3`]: 'N/A'
      };
    }
    const isNd = resObj[`${compound}_nd`] === true;
    const rawVal = resObj[compound] !== undefined && resObj[compound] !== null
      ? String(resObj[compound]) : '';
    const val = (rawVal === 'N/A') ? '' : rawVal;
    return {
      [compound]: isNd ? '' : val,
      [`${compound}_nd`]: isNd,
      [`${compound}_qc1`]: resObj[`${compound}_qc1`] || '',
      [`${compound}_qc2`]: resObj[`${compound}_qc2`] || '',
      [`${compound}_qc3`]: resObj[`${compound}_qc3`] || ''
    };
  };

  /** Lấy sample metadata fields */
  const buildSampleMeta = (resObj: any): Record<string, any> => ({
    khoiLuong: resObj['khoiLuong'] || '10.0',
    heSoPhaLoang: resObj['heSoPhaLoang'] || '1',
    hSoPhaLoang: resObj['hSoPhaLoang'] || '1',
    loSo: resObj['loSo'] || '',
    checkBoSungNuoc: resObj['checkBoSungNuoc'] || 'không',
    checkHonHopLamSach: resObj['checkHonHopLamSach'] || 'B1'
  });

  /** Lấy display label cho QC key */
  const getDisplayLabel = (code: string): string => {
    if (code === 'QC_BLANK') return currentDraft.page1Data['blankName'] || 'BLANK';
    if (code === 'QC_SPIKE') return currentDraft.page1Data['spikeName'] || 'SPIKE';
    if (code === 'QC_FINAL') return 'FINAL';
    return code;
  };

  if (isGop && filteredSamples.length > 0) {
    // ── Chế độ Gộp (formCheck, nhiều mẫu in chung) ─────────────────────────
    const mergedMaSoMau = filteredSamples.join('; ');
    const firstRes = currentDraft.resultData[filteredSamples[0]] || {};
    const rowData: Record<string, any> = {
      maSoMau: mergedMaSoMau,
      ...buildSampleMeta(firstRes)
    };

    const isAssignedToAny = (compound: string): boolean =>
      filteredSamples.some(s => isAssigned(s, compound));

    const getMergedQc = (compound: string, qcKey: string): string => {
      const vals = new Set<string>(filteredSamples.map(s => {
        const sRes = currentDraft.resultData[s] || {};
        return (sRes[`${compound}_${qcKey}`] as string) || 'Đạt';
      }));
      if (vals.size === 1) return Array.from(vals)[0];
      return filteredSamples.map(s => {
        const sRes = currentDraft.resultData[s] || {};
        return `${s}: ${sRes[`${compound}_${qcKey}`] || 'Đạt'}`;
      }).join('; ');
    };

    (currentConf.compounds as string[]).forEach(c => {
      const assignedToAny = isAssignedToAny(c);
      if (!assignedToAny) {
        rowData[c] = '';
        rowData[`${c}_nd`] = false;
        rowData[`${c}_qc1`] = 'N/A';
        rowData[`${c}_qc2`] = 'N/A';
        rowData[`${c}_qc3`] = 'N/A';
      } else {
        const uniqueVals = new Set<string>(filteredSamples.map(s => {
          const sRes = currentDraft.resultData[s] || {};
          const isNd = sRes[`${c}_nd`] === true;
          const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
          return isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
        }));

        if (uniqueVals.size === 1) {
          const commonVal = Array.from(uniqueVals)[0];
          rowData[`${c}_nd`] = commonVal === 'KPH';
          rowData[c] = (commonVal === 'KPH' || commonVal === 'N/A') ? '' : commonVal;
        } else {
          rowData[`${c}_nd`] = false;
          const resultParts = filteredSamples.map(s => {
            const sRes = currentDraft.resultData[s] || {};
            const isNd = sRes[`${c}_nd`] === true;
            const sVal = sRes[c] !== undefined && sRes[c] !== null ? String(sRes[c]) : '';
            const displayVal = isNd ? 'KPH' : (sVal === 'N/A' ? 'N/A' : sVal || '');
            return displayVal ? `${s}: ${displayVal}` : `${s}:`;
          });
          rowData[c] = resultParts.filter(p => !p.endsWith(':')).join('; ');
        }

        rowData[`${c}_qc1`] = getMergedQc(c, 'qc1');
        rowData[`${c}_qc2`] = getMergedQc(c, 'qc2');
        rowData[`${c}_qc3`] = getMergedQc(c, 'qc3');
      }
    });

    samplesPayload.push(rowData);

  } else {
    // ── Chế độ từng mẫu (formCheck đơn lẻ hoặc formDon) ───────────────────
    let rows: string[] = [...filteredSamples];
    if (isDon) {
      rows = ['QC_BLANK', 'QC_SPIKE', ...filteredSamples];
      if (currentDraft.page1Data['hasFinal']) rows.push('QC_FINAL');
    }

    rows.forEach(sampleCode => {
      const resObj = currentDraft.resultData[sampleCode] || {};
      const rowData: Record<string, any> = {
        maSoMau: getDisplayLabel(sampleCode),
        ...buildSampleMeta(resObj)
      };

      (currentConf.compounds as string[]).forEach(c => {
        Object.assign(rowData, buildCompoundFields(resObj, c, sampleCode));
      });

      samplesPayload.push(rowData);
    });
  }

  // ── Build runSamplesList (cho bảng sắc ký formDon) ───────────────────────

  const buildCompoundMaps = (resKey: string) => {
    const resObj = currentDraft.resultData[resKey] || {};
    const results: Record<string, string> = {};
    const notes: Record<string, string> = {};
    (currentConf.compounds as string[]).forEach(c => {
      const isNd = resObj[`${c}_nd`] === true || resObj[c] === 'ND' || resObj[c] === 'N/A';
      const val = resObj[c];
      const displayVal = (val === 'N/A') ? '' : (val !== undefined && val !== null && String(val).trim() !== '' ? String(val) : 'ND');
      results[c] = (val === 'N/A') ? '' : (isNd ? 'ND' : displayVal);
      notes[c] = resObj[`${c}_ghiChu`] || resObj['ghiChu'] || '';
    });
    return { results, notes };
  };

  const buildRunRow = (key: string, label: string, loSoDefault: string) => {
    const resObj = currentDraft.resultData[key] || {};
    const maps = buildCompoundMaps(key);
    return {
      key,
      maSoMau: label,
      ...buildSampleMeta({ ...resObj, loSo: resObj['loSo'] || loSoDefault }),
      summaryResult: 'N/A',
      compoundResults: maps.results,
      compoundNotes: maps.notes
    };
  };

  const runSamplesList: any[] = [
    buildRunRow('QC_BLANK', currentDraft.page1Data['blankName'] || 'BLANK', '6'),
    buildRunRow('QC_SPIKE', currentDraft.page1Data['spikeName'] || 'SPIKE', '7')
  ];

  // Regular samples (with summaryResult)
  if (isGop && filteredSamples.length > 0) {
    const s0 = filteredSamples[0];
    const resObj0 = currentDraft.resultData[s0] || {};
    const detected: string[] = [];
    (currentConf.compounds as string[]).forEach(c => {
      const isDet = filteredSamples.some(sCode => {
        const sRes = currentDraft.resultData[sCode] || {};
        return isAssigned(sCode, c) && sRes[`${c}_nd`] !== true && sRes[c] && sRes[c] !== 'N/A';
      });
      if (isDet) {
        const vals = filteredSamples.map(sCode => {
          const sRes = currentDraft.resultData[sCode] || {};
          return (sRes[c] === 'N/A') ? '' : (sRes[c] || 'N/A');
        }).join('; ');
        detected.push(`${c}: ${vals}`);
      }
    });

    const compoundResults = (currentConf.compounds as string[]).reduce((acc: any, c: string) => {
      const vals = filteredSamples.map(sCode => {
        const sRes = currentDraft.resultData[sCode] || {};
        return sRes[`${c}_nd`] === true ? 'N/A' : ((sRes[c] === 'N/A') ? '' : (sRes[c] || 'N/A'));
      });
      acc[c] = vals.every(v => v === 'N/A' || v === '') ? 'N/A' : vals.join('; ');
      return acc;
    }, {});

    const compoundNotes = (currentConf.compounds as string[]).reduce((acc: any, c: string) => {
      acc[c] = filteredSamples.map(sCode => {
        const sRes = currentDraft.resultData[sCode] || {};
        return sRes[`${c}_ghiChu`] || sRes['ghiChu'] || '';
      }).join('; ');
      return acc;
    }, {});

    runSamplesList.push({
      key: 'GROUPED',
      maSoMau: filteredSamples.join('; '),
      ...buildSampleMeta(resObj0),
      summaryResult: detected.length > 0 ? detected.join('; ') : 'N/A',
      compoundResults,
      compoundNotes
    });
  } else {
    filteredSamples.forEach(s => {
      const resObj = currentDraft.resultData[s] || {};
      const detected: string[] = [];
      (currentConf.compounds as string[]).forEach(c => {
        if (isAssigned(s, c) && resObj[`${c}_nd`] !== true && resObj[c] && resObj[c] !== 'N/A') {
          detected.push(`${c}: ${resObj[c]}`);
        }
      });
      const maps = buildCompoundMaps(s);
      runSamplesList.push({
        key: s,
        maSoMau: s,
        ...buildSampleMeta(resObj),
        summaryResult: detected.length > 0 ? detected.join('; ') : 'N/A',
        compoundResults: maps.results,
        compoundNotes: maps.notes
      });
    });
  }

  if (currentDraft.page1Data['hasFinal']) {
    runSamplesList.push(buildRunRow('QC_FINAL', 'FINAL', '7'));
  }

  // ── compoundsToPrint ─────────────────────────────────────────────────────

  const compoundsToPrint = isDon
    ? [currentDraft.page1Data['activeCompound'] || (currentConf.compounds as string[])[0]]
    : (currentConf.compounds as string[]).filter(c =>
        filteredSamples.some(s => isAssigned(s, c))
      );

  // ── Final payload ────────────────────────────────────────────────────────

  return {
    action: 'generate_pdf',
    sopId,
    metadata: {
      ...currentDraft.page1Data,
      is100mlChecked: currentDraft.page1Data['is10gChecked'] !== false,
      is100gChecked: currentDraft.page1Data['is10gChecked'] !== false,
      is100Checked: currentDraft.page1Data['is10gChecked'] !== false,
      is10gChecked: currentDraft.page1Data['is10gChecked'] !== false,
      printFormType: currentDraft.page1Data['printFormType'] || 'formCheck',
      blankName: currentDraft.page1Data['blankName'] || 'BLANK',
      spikeName: currentDraft.page1Data['spikeName'] || 'SPIKE',
      hasFinal: currentDraft.page1Data['hasFinal'] === true,
      calibPoints: currentDraft.page1Data['calibPoints'] || [],
      r2: currentDraft.page1Data['r2'] || '',
      compoundsToPrint,
      targetInfo,
      prefix: prefixForReport,
      sampleTargetMap,
      ngayNguoiPhanTich: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      ngayNguoiThamTra: formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
      ngayBaoCao: formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || getRunDate()),
      runSamplesList
    },
    samples: samplesPayload
  };
}
