// Preserve existing calibration profiles until physical paper is measured.
// Tomy 145 has distinct sample/standard calibrations; their values are intentional legacy data.
export interface TomyTemplate {
  id: string;
  name: string;
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
  marginTop: number;
  marginLeft: number;
  gapX: number;
  gapY: number;
}

export const SAMPLE_TOMY_TEMPLATES: TomyTemplate[] = [
  { id: 'tomy_145', name: 'Tomy 145 (65 tem - 38x21mm)', cols: 5, rows: 13, cellW: 38, cellH: 21, marginTop: 12, marginLeft: 10, gapX: 0, gapY: 0 },
  { id: 'tomy_149', name: 'Tomy 149 (21 tem - 70x42.5mm)', cols: 3, rows: 7, cellW: 70, cellH: 42.5, marginTop: 0, marginLeft: 0, gapX: 0, gapY: 0 },
  { id: 'tomy_144', name: 'Tomy 144 (30 tem - 67x28mm)', cols: 3, rows: 10, cellW: 67, cellH: 28, marginTop: 8.5, marginLeft: 4.5, gapX: 0, gapY: 0 },
  { id: 'tomy_109', name: 'Tomy 109 (96 tem - 22x14mm)', cols: 8, rows: 12, cellW: 22, cellH: 14, marginTop: 64.5, marginLeft: 17, gapX: 0, gapY: 0 },
];

export interface GridPreset {
  id: string;
  name: string;
  rows: number;
  cols: number;
  width: number;       // width of label in mm
  height: number;      // height of label in mm
  topMargin: number;   // top margin of sheet in mm
  leftMargin: number;  // left margin of sheet in mm
  rowGap: number;      // vertical space between labels in mm
  colGap: number;      // horizontal space between labels in mm
  fontSize: number;    // default font size in pt
}

export interface RollPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  fontSize: number;
}

export const STANDARD_GRID_PRESETS: Record<string, GridPreset> = {
    tomy_145: {
      id: 'tomy_145',
      name: 'Tomy 145 (65 nhãn - 5x13)',
      rows: 13,
      cols: 5,
      width: 38.1,
      height: 21.2,
      topMargin: 10.5,
      leftMargin: 9.5,
      rowGap: 0,
      colGap: 2.5,
      fontSize: 5.5
    },
    tomy_138: {
      id: 'tomy_138',
      name: 'Tomy 138 (100 nhãn - 5x20)',
      rows: 20,
      cols: 5,
      width: 40.0,
      height: 14.0,
      topMargin: 8.5,
      leftMargin: 5.0,
      rowGap: 0.5,
      colGap: 2.5,
      fontSize: 4.5
    },
    tomy_135: {
      id: 'tomy_135',
      name: 'Tomy 135 (24 nhãn - 3x8)',
      rows: 8,
      cols: 3,
      width: 47.0,
      height: 22.0,
      topMargin: 20.0,
      leftMargin: 34.5,
      rowGap: 0,
      colGap: 2.0,
      fontSize: 6.5
    },
    tomy_146: {
      id: 'tomy_146',
      name: 'Tomy 146 (18 nhãn - 3x6)',
      rows: 6,
      cols: 3,
      width: 62.0,
      height: 42.0,
      topMargin: 22.0,
      leftMargin: 12.0,
      rowGap: 0,
      colGap: 2.0,
      fontSize: 8.0
    }
  };

export const STANDARD_ROLL_PRESETS: Record<string, RollPreset> = {
    '62x29_ql800': { id: '62x29_ql800', name: 'Brother QL-800 DK-22205 (62 x 29 mm)', width: 62, height: 29, fontSize: 7 },
    '90x29_ql800': { id: '90x29_ql800', name: 'Brother QL-800 DK-11201 (90 x 29 mm)', width: 90, height: 29, fontSize: 7 },
    '62x62_ql800': { id: '62x62_ql800', name: 'Brother QL-800 DK-11209 (62 x 62 mm)', width: 62, height: 62, fontSize: 9 },
    '35x22': { id: '35x22', name: 'Tem chuẩn (35 x 22 mm)', width: 35, height: 22, fontSize: 6 },
    '22x12': { id: '22x12', name: 'Tem nhỏ (22 x 12 mm)', width: 22, height: 12, fontSize: 4.5 },
    '50x30': { id: '50x30', name: 'Tem trung (50 x 30 mm)', width: 50, height: 30, fontSize: 8 },
    '70x50': { id: '70x50', name: 'Tem lớn (70 x 50 mm)', width: 70, height: 50, fontSize: 10 }
  };

export interface LabelSheetGeometry { width: number; height: number; cols: number; rows: number; left: number; top: number; gapX: number; gapY: number; }

export function labelSheetError(value: LabelSheetGeometry): string | null {
  if (!Object.values(value).every(Number.isFinite) || value.width <= 0 || value.height <= 0 || !Number.isInteger(value.cols) || !Number.isInteger(value.rows) || value.cols < 1 || value.rows < 1 || [value.left,value.top,value.gapX,value.gapY].some(number => number < 0)) return 'Kích thước hoặc số ô nhãn chưa hợp lệ.';
  const right = value.left + value.width * value.cols + value.gapX * (value.cols - 1);
  const bottom = value.top + value.height * value.rows + value.gapY * (value.rows - 1);
  return right > 210.01 || bottom > 297.01 ? 'Bố cục nhãn vượt khổ A4. Điều chỉnh lề, khoảng cách hoặc chọn preset khác trước khi in.' : null;
}
