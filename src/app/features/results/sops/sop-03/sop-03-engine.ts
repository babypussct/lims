export interface Sop03Row {
  kqTrifluralin?: string;
  [key: string]: any;
}

/**
 * Tính toán hiệu suất thu hồi (Recovery %) cho Trifluralin.
 * @param row Bản ghi dữ liệu của dòng mẫu thử
 * @param sampleCode Mã số mẫu thử hoặc key dòng mẫu
 * @param spikeName Tên mẫu thêm chuẩn cấu hình (mặc định là 'Spike')
 * @returns Chuỗi ghi chú phần trăm thu hồi (ví dụ: "95%") hoặc chuỗi rỗng
 */
export function calculateSop03Recovery(row: Sop03Row, sampleCode: string, spikeName: string = 'Spike'): string {
  const isSpike = sampleCode.toLowerCase().includes('spike') || 
                  sampleCode.toLowerCase().includes('sp') ||
                  sampleCode === 'QC_SPIKE' || 
                  sampleCode.includes('_QC_') ||
                  spikeName.toLowerCase().includes('spike') || 
                  spikeName.toLowerCase().includes('sp');

  if (!isSpike) {
    return '';
  }

  const valStr = row['kqTrifluralin'];
  if (valStr !== undefined && valStr !== null) {
    const val = parseFloat(String(valStr));
    if (!isNaN(val)) {
      const rec = val * 100;
      const recFormatted = rec % 1 === 0 ? rec.toFixed(0) : rec.toFixed(1);
      return `${recFormatted}%`;
    }
  }

  return '';
}
