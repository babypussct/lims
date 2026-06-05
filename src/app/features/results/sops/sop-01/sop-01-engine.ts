export interface Sop01Row {
  kqFip?: string;
  kqFipDesl?: string;
  kqFipSulf?: string;
  kqFipSulf2?: string;
  kqClp?: string;
  kqClpMe?: string;
  kqClpMeDes?: string;
  [key: string]: any;
}

/**
 * Tính toán phần trăm thu hồi (Spike Recovery) cho 7 hoạt chất của Fipronil/Chlorpyrifos ở nồng độ thêm chuẩn 5 ppb.
 * @param row Bản ghi dữ liệu của dòng mẫu thử
 * @param sampleCode Mã số mẫu thử hoặc key dòng mẫu
 * @returns Chuỗi hiển thị kết quả hiệu suất thu hồi (ví dụ: "Fip: 98%, FipDesl: 101%...")
 */
export function calculateSop01Recovery(row: Sop01Row, sampleCode: string): string {
  const isSpike = sampleCode === 'QC_SPIKE' || 
                  sampleCode === 'QC_FINAL' || 
                  sampleCode === 'QC_CHECK_SAMPLE' || 
                  sampleCode.toLowerCase().includes('spike');
                  
  if (!isSpike) {
    return '';
  }

  const recoveries: string[] = [];
  const compounds = ['kqFip', 'kqFipDesl', 'kqFipSulf', 'kqFipSulf2', 'kqClp', 'kqClpMe', 'kqClpMeDes'];

  compounds.forEach(comp => {
    const valStr = row[comp];
    if (valStr !== undefined && valStr !== null) {
      const val = parseFloat(String(valStr));
      if (!isNaN(val)) {
        const rec = (val / 5) * 100;
        const recFormatted = rec.toFixed(1);
        const cleanName = comp.replace(/^kq/, '');
        recoveries.push(`${cleanName}: ${recFormatted}%`);
      }
    }
  });

  return recoveries.join(', ');
}
