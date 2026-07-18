import { Injectable } from '@angular/core';
import { AnalysisResultDraft } from '../../../core/models/analysis-result.model';
import {
  getAssignedTargetsForSample,
  isCompoundAssigned
} from '../shared/compound-id-resolver';

export interface CreateInitialDraftOptions {
  requestId: string;
  updatedBy?: string;
  masterTargets?: any[];
  now?: Date;
}

/**
 * Nguồn duy nhất để tạo draft ban đầu của một mẻ.
 *
 * Component SOP vẫn chịu trách nhiệm chạy các hook khởi tạo chuyên biệt trong
 * ngOnInit. Khi reset, form được remount nên cùng factory + cùng hook sẽ tạo ra
 * đúng trạng thái như lần mở mẻ đầu tiên.
 */
@Injectable({ providedIn: 'root' })
export class SopDraftFactoryService {
  createInitialDraft(
    runDoc: any,
    sopConf: any,
    options: CreateInitialDraftOptions
  ): AnalysisResultDraft {
    const now = options.now ?? new Date();
    const today = now.toISOString().split('T')[0];
    const masterTargets = options.masterTargets ?? [];

    const isTrifluralin = runDoc.sopId === 'SOP-03'
      || (sopConf.columns && sopConf.columns.kqTrifluralin !== undefined);
    const isFipronil = runDoc.sopId === 'SOP-01'
      || (sopConf.columns && sopConf.columns.kqFip !== undefined);
    const isDichlorvos = runDoc.sopId === 'sop_1767857760184'
      || (sopConf.columns && sopConf.columns.kqDichlorvos !== undefined);
    const isChloroform = runDoc.sopId === '9.20-chloroform'
      || (sopConf.columns && sopConf.columns.kqChloroform !== undefined);

    const defaultPage1: Record<string, any> = {
      ngayNguoiPhanTich: today,
      ngayNguoiThamTra: today,
      checkTatCaND: true,
      checkCoMauPhatHien: false
    };

    if (isTrifluralin) {
      defaultPage1['r2'] = '0.999';
      defaultPage1['hasFinal'] = true;
      defaultPage1['blankName'] = '';
      defaultPage1['spikeName'] = '';
      defaultPage1['calibPoints'] = [
        { loSo: '41', hamLuong: '0' },
        { loSo: '42', hamLuong: '0.5' },
        { loSo: '43', hamLuong: '1.0' },
        { loSo: '44', hamLuong: '5.0' },
        { loSo: '45', hamLuong: '10.0' },
        { loSo: '46', hamLuong: '30.0' }
      ];
    } else if (isDichlorvos) {
      defaultPage1['r2'] = '0.999';
      defaultPage1['dichlorvosMethod'] = 'GC/MS';
      defaultPage1['hasFinal'] = false;
      defaultPage1['blankName'] = '';
      defaultPage1['spikeName'] = '';
      defaultPage1['calibPoints'] = [
        { loSo: '51', hamLuong: '0' },
        { loSo: '52', hamLuong: '5' },
        { loSo: '53', hamLuong: '10' },
        { loSo: '54', hamLuong: '20' },
        { loSo: '55', hamLuong: '30' },
        { loSo: '56', hamLuong: '40' }
      ];
    } else if (isFipronil) {
      defaultPage1['hasCheckSample'] = false;
      defaultPage1['maHoSo'] = '';
      defaultPage1['heSoPhaLoang'] = '1';
      defaultPage1['loaiMau'] = 'Thủy sản';
      defaultPage1['tinhTrangMau'] = 'Bình thường';
      defaultPage1['calibPoints'] = [
        { loSo: '1.1', vialNo: '1.1' },
        { loSo: '1.2', vialNo: '1.2' },
        { loSo: '1.3', vialNo: '1.3' },
        { loSo: '1.4', vialNo: '1.4' },
        { loSo: '1.5', vialNo: '1.5' }
      ];
      defaultPage1['qcR2'] = true;
      defaultPage1['qcThoiGianLuu'] = true;
      defaultPage1['qcThemChuan'] = true;
      defaultPage1['qcThuHoi'] = true;
      defaultPage1['qcDanhGiaChung'] = true;
      defaultPage1['qcKiemTraNoiBo'] = null;
      defaultPage1['qcNhanDang'] = null;
    } else if (isChloroform) {
      defaultPage1['r2'] = '0.999';
      defaultPage1['blankName'] = '';
      defaultPage1['spikeName'] = '';
      defaultPage1['calibPoints'] = [
        { loSo: '1', hamLuong: '0' },
        { loSo: '2', hamLuong: '2' },
        { loSo: '3', hamLuong: '5' },
        { loSo: '4', hamLuong: '10' },
        { loSo: '5', hamLuong: '20' },
        { loSo: '6', hamLuong: '50' }
      ];
    } else if (sopConf.checkboxLines) {
      Object.values(sopConf.checkboxLines).forEach((field: any) => {
        if (field === 'checkTatCaND' || field === 'checkCoMauPhatHien') return;
        if (field === 'qcNhanDang') defaultPage1[field] = null;
        else if (typeof field === 'string' && field.startsWith('qc')) defaultPage1[field] = true;
        else defaultPage1[field] = false;
      });
    }

    if (sopConf.formType === 'type3b') {
      defaultPage1['checkGopInChung'] = true;
      defaultPage1['printFormType'] = 'formCheck';
      defaultPage1['loaiMau'] = 'Thủy sản';
      defaultPage1['tinhTrangMau'] = 'Bình thường';
      defaultPage1['khoiLuong'] = '10.0';
    }

    const defaultResultData: Record<string, Record<string, any>> = {};
    const sampleList: string[] = runDoc.sampleList || [];

    if (isTrifluralin) {
      defaultResultData['QC_BLANK'] = { loSo: '47', kqTrifluralin: 'ND', ghiChu: '', selected: true };
      defaultResultData['QC_SPIKE'] = { loSo: '48', kqTrifluralin: '', ghiChu: '', selected: true };
      sampleList.forEach((sampleCode, idx) => {
        defaultResultData[sampleCode] = {
          loSo: String(idx + 1),
          kqTrifluralin: '',
          ghiChu: '',
          selected: true
        };
      });
    } else if (isDichlorvos) {
      sampleList.forEach((sampleCode, idx) => {
        const randomMass = (10.01 + Math.random() * 0.09).toFixed(2);
        defaultResultData[sampleCode] = {
          loSo: String(idx + 1),
          selected: true,
          khoiLuong: randomMass,
          heSoPhaLoang: '1'
        };
        Object.keys(sopConf.columns || {}).forEach(col => {
          if (!['loSo', 'maSoMau', 'ghiChu', 'khoiLuong', 'heSoPhaLoang'].includes(col)) {
            defaultResultData[sampleCode][col] = '';
          }
        });
        defaultResultData[sampleCode]['ghiChu'] = '';
      });
    } else if (isFipronil) {
      const activeCols = Object.keys(sopConf.columns || {})
        .filter(col => !['loSo', 'maSoMau', 'ghiChu'].includes(col));

      const createQcRow = (loSo: string) => {
        const row: Record<string, any> = { loSo, selected: true };
        activeCols.forEach(col => row[col] = '');
        row['ghiChu'] = '';
        return row;
      };

      defaultResultData['QC_BLANK'] = createQcRow('1.7');
      defaultResultData['QC_SPIKE'] = createQcRow('1.8');
      defaultResultData['QC_CHECK_SAMPLE'] = createQcRow('1.9');
      defaultResultData['QC_FINAL'] = createQcRow('1.8');

      sampleList.forEach((sampleCode, idx) => {
        const currentVial = 10 + idx;
        const rack = 1 + Math.floor((currentVial - 1) / 54);
        const vial = ((currentVial - 1) % 54) + 1;
        defaultResultData[sampleCode] = createQcRow(`${rack}.${vial}`);
      });
    } else {
      const sampleTargetMap = runDoc.sampleTargetMap || runDoc.inputs?.sampleTargetMap || {};
      sampleList.forEach((sampleCode, idx) => {
        const row: Record<string, any> = {};
        defaultResultData[sampleCode] = row;

        if (sopConf.formType === 'type3b') {
          const assigned = getAssignedTargetsForSample(sampleCode, sampleTargetMap);
          const isAssigned = (compound: string) => {
            if (!assigned || assigned.length === 0) return true;
            if (assigned.includes(compound)) return true;
            return isCompoundAssigned(assigned, compound, masterTargets);
          };

          (sopConf.compounds || []).forEach((compound: string) => {
            if (isAssigned(compound)) {
              row[compound] = '';
              row[`${compound}_nd`] = true;
              row[`${compound}_qc1`] = 'Đạt';
              row[`${compound}_qc2`] = 'Đạt';
              row[`${compound}_qc3`] = 'Đạt';
            } else {
              row[compound] = 'N/A';
              row[`${compound}_nd`] = false;
              row[`${compound}_qc1`] = 'N/A';
              row[`${compound}_qc2`] = 'N/A';
              row[`${compound}_qc3`] = 'N/A';
            }
          });

          // Các mặc định chung mà AbstractSopEntry áp dụng khi component mount.
          row['selected'] = true;
          row['khoiLuong'] = '10.0';
          row['heSoPhaLoang'] = '1';
          row['hSoPhaLoang'] = '1';
          row['loSo'] = String(9 + idx);
          row['checkBoSungNuoc'] = 'không';
          row['checkHonHopLamSach'] = 'B1';
        } else {
          Object.keys(sopConf.columns || {}).forEach(col => {
            if (!['loSo', 'maSoMau', 'ghiChu'].includes(col)) row[col] = '';
          });
        }
      });
    }

    return {
      id: options.requestId,
      requestId: options.requestId,
      sopId: runDoc.sopId,
      sopName: runDoc.sopName,
      status: 'draft',
      version: 0,
      page1Data: defaultPage1,
      resultData: defaultResultData,
      updatedAt: now.toISOString(),
      updatedBy: options.updatedBy || 'System'
    };
  }
}
