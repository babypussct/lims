/**
 * Helper utility to build action payload for generating PDF reports for different SOPs.
 * Isolates complex QC sequencing and formatting from the main ResultEntryComponent.
 */
import { isCompoundAssigned } from './shared/compound-id-resolver';

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

  // 1. Thêm Blank vào đầu danh sách
  const blankObj = currentDraft.resultData['QC_BLANK'] || {};
  samplesPayload.push({
    loSo: blankObj['loSo'] || '1',
    maSoMau: currentDraft.page1Data['blankName'] || 'Blank',
    kqTrifluralin: blankObj['kqTrifluralin'] || '',
    ghiChu: blankObj['ghiChu'] || ''
  });

  // 2. Thêm Spike vào vị trí thứ 2
  const spikeObj = currentDraft.resultData['QC_SPIKE'] || {};
  samplesPayload.push({
    loSo: spikeObj['loSo'] || '2',
    maSoMau: currentDraft.page1Data['spikeName'] || 'Spike',
    kqTrifluralin: spikeObj['kqTrifluralin'] || '',
    ghiChu: spikeObj['ghiChu'] || ''
  });

  // 3. Thêm các mẫu và các mẫu SPIKE_N xen kẽ
  let selectedCount = 0;
  prefixSamples.forEach((sampleCode: string) => {
    const resObj = currentDraft.resultData[sampleCode] || {};
    samplesPayload.push({
      loSo: resObj['loSo'] || '',
      maSoMau: sampleCode,
      kqTrifluralin: resObj['kqTrifluralin'] || '',
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
          kqTrifluralin: spikeNObj['kqTrifluralin'] || '',
          ghiChu: spikeNObj['ghiChu'] || ''
        });
      }
    }
  });

  // 4. FINAL row
  if (selectedCount > 0) {
    const finalKey = `QC_FINAL_QC_${prefixForReport}`;
    const finalObj = currentDraft.resultData[finalKey] || {};
    samplesPayload.push({
      loSo: finalObj['loSo'] || spikeObj['loSo'] || '2',
      maSoMau: 'FINAL',
      kqTrifluralin: finalObj['kqTrifluralin'] || '',
      ghiChu: finalObj['ghiChu'] || ''
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
      rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
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
      rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
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
          spRowData[col] = spikeNObj[col] !== undefined ? spikeNObj[col] : '';
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
          rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
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
          rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
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

  const filteredSamples = sampleList.filter((s: string) => {
    const resObj = currentDraft.resultData[s] || {};
    const startsWithLetter = /^[a-zA-Z]/.test(s);
    const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
    const isSelected = resObj['selected'] !== false;
    const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
    return isSelected && matchesFilter;
  });

  filteredSamples.forEach((sampleCode: string, idx: number) => {
    const resObj = currentDraft.resultData[sampleCode] || {};

    if (currentConf.formType === 'type3b') {
      const rowData: Record<string, any> = {
        maSoMau: sampleCode
      };

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

      const sampleTargetMap = currentRun.sampleTargetMap || (currentRun.inputs && currentRun.inputs.sampleTargetMap) || {};

      const isAssigned = (sampleCode: string, compound: string): boolean => {
        const assigned = sampleTargetMap[sampleCode];
        if (!assigned) return true;
        return isCompoundAssigned(assigned, compound) || isCompoundAssigned(assigned, mapCompoundToKey(compound));
      };

      currentConf.compounds.forEach((c: string) => {
        const backendKey = mapCompoundToKey(c);
        const val = resObj[c] !== undefined && resObj[c] !== null ? String(resObj[c]) : '';
        const assigned = isAssigned(sampleCode, c);
        
        if (!assigned) {
          // Chỉ tiêu không thực hiện -> Giữ nguyên định dạng gốc của form bằng cách để trống
          rowData[backendKey] = '';
          rowData[`${backendKey}_nd`] = false;
          rowData[`${backendKey}_qc1`] = 'N/A';
          rowData[`${backendKey}_qc2`] = 'N/A';
          rowData[`${backendKey}_qc3`] = 'N/A';
        } else {
          // Chỉ tiêu có thực hiện -> Sử dụng đúng giá trị thực tế nhập từ giao diện UI
          const isNd = resObj[`${c}_nd`] === true;
          rowData[backendKey] = isNd ? '' : (val === 'KPH' ? '' : val);
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
          rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
        }
      });
      samplesPayload.push(rowData);
    }
  });

  return {
    action: 'generate_pdf',
    sopId: currentConf.id || '',
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
