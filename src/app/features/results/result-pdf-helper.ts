/**
 * Helper utility to build action payload for generating PDF reports for different SOPs.
 * Isolates complex QC sequencing and formatting from the main ResultEntryComponent.
 */
import { isCompoundAssigned, resolveTargetMasterInfo } from './shared/compound-id-resolver';
import { formatSampleList } from '../../shared/utils/utils';

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

export function buildFipronilPdfPayload(currentDraft: any, currentRun: any, activeFilter: string, currentConf: any, formatAnalysisDate: (d: string) => string, getRunDate: () => string): any {
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

  return {
    action: 'generate_pdf',
    sopId: 'fipronil-chlorpyrifos',
    metadata: {
      ...currentDraft.page1Data,
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

export function buildDefaultSopPdfPayload(currentDraft: any, currentRun: any, activeFilter: string, currentConf: any, formatAnalysisDate: (d: string) => string, getRunDate: () => string): any {
  const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
  const samplesPayload: any[] = [];
  const sampleList = currentRun.sampleList || [];
  const sampleTargetMap = currentRun.sampleTargetMap || (currentRun.inputs && currentRun.inputs.sampleTargetMap) || {};

  const chlorMap: Record<string, string> = {
    'BHC-alpha': 'BHCa',
    'BHC-beta': 'BHCb',
    'BHC-delta': 'BHCd',
    'BHC-epsilon': 'BHCe',
    'BHC-gamma': 'BHCg',
    'Chlordane-cis': 'Chlordane_cis',
    'Chlordane-oxy': 'Chlordane_oxy',
    'Chlordane-trans': 'Chlordane_trans',
    'DDD-o,p': 'DDD_op',
    'DDD-p,p': 'DDD_pp',
    'DDE-o,p': 'DDE_op',
    'DDE-p,p': 'DDE_pp',
    'DDT-o,p': 'DDT_op',
    'DDT-p,p': 'DDT_pp',
    'Endosulfan-I': 'Endosulfan1',
    'Endosulfan-II': 'Endosulfan2',
    'Endosulfan-sulfate': 'EndosulfanS',
    'Heptachlor-epoxide-trans': 'HeptachlorA',
    'Heptachlor-epoxide-cis': 'HeptachlorB',
    'Hexachlorobenzene': 'HCB'
  };

  const mapCompoundToKey = (c: string): string => {
    if (chlorMap[c]) return chlorMap[c];
    if (c === 'Parathion-ethyl') return 'Parathion';
    if (c === 'Ipobenfos') return 'Iprobenfos';
    return c.replace(/-([a-z])/gi, (_, letter) => letter.toUpperCase()).replace(/[-_,\s']/g, '');
  };

  const isAssigned = (sampleCode: string, compound: string): boolean => {
    const assigned = sampleTargetMap[sampleCode];
    if (!assigned) return true;
    return isCompoundAssigned(assigned, compound) || isCompoundAssigned(assigned, mapCompoundToKey(compound));
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

  const mapCompoundToKey = (c: string): string => {
    const info = resolveTargetMasterInfo(c, masterTargets);
    if (info) return info.name;
    return c.replace(/-([a-z])/gi, (_, letter) => letter.toUpperCase()).replace(/[-_,\s']/g, '');
  };

  const sampleTargetMap = currentRun.sampleTargetMap || (currentRun.inputs && currentRun.inputs.sampleTargetMap) || {};

  const isAssigned = (sampleCode: string, compound: string): boolean => {
    const assigned = sampleTargetMap[sampleCode];
    if (!assigned) return true;
    return isCompoundAssigned(assigned, compound) || isCompoundAssigned(assigned, mapCompoundToKey(compound));
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
    });
  }

  // Helper to build compound results and notes maps for runSamplesList
  const buildCompoundMaps = (resKey: string) => {
    const resObj = currentDraft.resultData[resKey] || {};
    const results: Record<string, string> = {};
    const notes: Record<string, string> = {};
    currentConf.compounds.forEach((c: string) => {
      const backendKey = mapCompoundToKey(c);
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
      const backendKey = mapCompoundToKey(c);
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
      const backendKey = mapCompoundToKey(c);
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
  const compoundsToPrint = activeCompoundsConfig.map((c: string) => mapCompoundToKey(c));

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

  const mapCompoundToKey = (c: string): string => {
    const info = resolveTargetMasterInfo(c, masterTargets);
    if (info) return info.name;
    return c.replace(/-([a-z])/gi, (_, letter) => letter.toUpperCase()).replace(/[-_,\s']/g, '');
  };

  const sampleTargetMap = currentRun.sampleTargetMap || (currentRun.inputs && currentRun.inputs.sampleTargetMap) || {};

  const isAssigned = (sampleCode: string, compound: string): boolean => {
    const assigned = sampleTargetMap[sampleCode];
    if (!assigned) return true;
    return isCompoundAssigned(assigned, compound) || isCompoundAssigned(assigned, mapCompoundToKey(compound));
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
      const backendKey = mapCompoundToKey(c);
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
      const backendKey = mapCompoundToKey(c);
      acc[backendKey] = allKph ? 'N/A' : vals.join('; ');
      return acc;
    }, {});

    const compoundNotes = currentConf.compounds.reduce((acc: any, c: string) => {
      const notes = filteredSamples.map((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        return sRes[`${c}_ghiChu`] || sRes['ghiChu'] || '';
      });
      const backendKey = mapCompoundToKey(c);
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

  const mapCompoundToKey = (c: string): string => {
    const info = resolveTargetMasterInfo(c, masterTargets);
    if (info) return info.name;
    return c.replace(/-([a-z])/gi, (_, letter) => letter.toUpperCase()).replace(/[-_,\s'()]/g, '');
  };

  const sampleTargetMap = currentRun.sampleTargetMap || (currentRun.inputs && currentRun.inputs.sampleTargetMap) || {};

  const isAssigned = (sampleCode: string, compound: string): boolean => {
    const assigned = sampleTargetMap[sampleCode];
    if (!assigned) return true;
    return isCompoundAssigned(assigned, compound) || isCompoundAssigned(assigned, mapCompoundToKey(compound));
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
      const backendKey = mapCompoundToKey(c);
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
      const backendKey = mapCompoundToKey(c);
      acc[backendKey] = allKph ? 'N/A' : vals.join('; ');
      return acc;
    }, {});

    const compoundNotes = currentConf.compounds.reduce((acc: any, c: string) => {
      const notes = filteredSamples.map((sCode: string) => {
        const sRes = currentDraft.resultData[sCode] || {};
        return sRes[`${c}_ghiChu`] || sRes['ghiChu'] || '';
      });
      const backendKey = mapCompoundToKey(c);
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



