import { getStandardizedAmount, UNIT_DATA } from './utils';

export interface ParsedStandardQuantity {
  /** Numeric value as entered by the user. */
  amount: number;
  /** Unit as entered (normalized to a supported alias). */
  unit: string;
  /** Value converted into normalizedUnit. */
  normalizedAmount: number;
  normalizedUnit: string;
}

export function normalizeStandardUnit(unit: string): string {
  const cleaned = (unit || '').trim().toLowerCase().replace(/μ/g, 'µ');
  return Object.keys(UNIT_DATA).find(key => key.toLowerCase() === cleaned) || cleaned;
}

export function parseStandardQuantity(
  value: unknown,
  normalizedUnit: string
): ParsedStandardQuantity | null {
  const targetUnit = normalizeStandardUnit(normalizedUnit);
  if (!targetUnit || !UNIT_DATA[targetUnit]) return null;

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return { amount: value, unit: targetUnit, normalizedAmount: value, normalizedUnit: targetUnit };
  }

  const raw = String(value ?? '').trim().replace(',', '.');
  if (!raw) return null;
  const match = raw.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*(.*?)$/u);
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = normalizeStandardUnit(match[2] || targetUnit);
  if (!Number.isFinite(amount) || !unit || !UNIT_DATA[unit]) return null;

  const converted = getStandardizedAmount(amount, unit, targetUnit);
  if (converted === null || !Number.isFinite(converted)) return null;
  return { amount, unit, normalizedAmount: converted, normalizedUnit: targetUnit };
}

export function normalizePositiveStandardAmount(
  amount: number,
  fromUnit: string,
  toUnit: string,
  fieldLabel = 'Số lượng'
): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${fieldLabel} phải là một số lớn hơn 0.`);
  }
  const converted = getStandardizedAmount(amount, normalizeStandardUnit(fromUnit), normalizeStandardUnit(toUnit));
  if (converted === null || !Number.isFinite(converted)) {
    throw new Error(`Không thể quy đổi đơn vị từ ${fromUnit} sang ${toUnit}.`);
  }
  return converted;
}

export function normalizeNonNegativeStandardAmount(
  amount: number,
  fromUnit: string,
  toUnit: string,
  fieldLabel = 'Số lượng'
): number {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(`${fieldLabel} phải là một số không âm.`);
  }
  if (amount === 0) return 0;
  return normalizePositiveStandardAmount(amount, fromUnit, toUnit, fieldLabel);
}

export interface StandardReturnReconciliation {
  previouslyLogged: number;
  confirmedUsed: number;
  adjustmentAmount: number;
  disposalAmount: number;
  remainingAmount: number;
  accountedTotal: number;
}

export function reconcileStandardReturn(
  currentStock: number,
  normalizedLogAmounts: readonly number[],
  confirmedUsed: number,
  isDepleted: boolean
): StandardReturnReconciliation {
  if (!Number.isFinite(currentStock) || currentStock < 0) throw new Error('Tồn kho hiện tại không hợp lệ.');
  if (!Number.isFinite(confirmedUsed) || confirmedUsed < 0) throw new Error('Tổng lượng xác nhận không hợp lệ.');
  if (normalizedLogAmounts.some(amount => !Number.isFinite(amount) || amount < 0)) {
    throw new Error('Nhật ký sử dụng chứa số lượng không hợp lệ.');
  }

  const previouslyLogged = normalizedLogAmounts.reduce((sum, amount) => sum + amount, 0);
  if (confirmedUsed + 1e-9 < previouslyLogged) {
    throw new Error(`Tổng xác nhận không thể nhỏ hơn ${previouslyLogged} đã ghi nhận.`);
  }
  const adjustmentAmount = Math.max(0, confirmedUsed - previouslyLogged);
  if (adjustmentAmount > currentStock + 1e-9) throw new Error('Không đủ lượng tồn kho để xác nhận trả chuẩn.');

  const remainingAfterAdjustment = Math.max(0, currentStock - adjustmentAmount);
  const disposalAmount = isDepleted ? remainingAfterAdjustment : 0;
  return {
    previouslyLogged,
    confirmedUsed,
    adjustmentAmount,
    disposalAmount,
    remainingAmount: isDepleted ? 0 : remainingAfterAdjustment,
    accountedTotal: confirmedUsed + disposalAmount
  };
}
