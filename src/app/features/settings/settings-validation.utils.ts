import { CategoryItem, SafetyConfig } from '../../core/models/config.model';

export type SettingsValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

type SafetyRuleDraft = {
  category: string;
  margin: number;
};

function finitePercentage(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric < 0 || numeric > 100) return null;
  return numeric;
}

export function validateCategoriesDraft(items: CategoryItem[]): SettingsValidationResult<CategoryItem[]> {
  if (items.length === 0) {
    return { ok: false, message: 'Phân loại không được để trống hoàn toàn.' };
  }

  const normalized = items.map(item => ({
    id: (item.id || '').trim(),
    name: (item.name || '').trim(),
  }));

  const incompleteIndex = normalized.findIndex(item => !item.id || !item.name);
  if (incompleteIndex >= 0) {
    return {
      ok: false,
      message: `Phân loại dòng ${incompleteIndex + 1} chưa đủ Mã ID và Tên hiển thị.`,
    };
  }

  const seen = new Set<string>();
  for (const item of normalized) {
    const key = item.id.toLocaleLowerCase('vi');
    if (seen.has(key)) {
      return { ok: false, message: `Mã phân loại “${item.id}” đang bị trùng.` };
    }
    seen.add(key);
  }

  return { ok: true, value: normalized };
}

export function validateSafetyConfigDraft(
  defaultMargin: unknown,
  rules: SafetyRuleDraft[],
): SettingsValidationResult<SafetyConfig> {
  const normalizedDefault = finitePercentage(defaultMargin);
  if (normalizedDefault === null) {
    return { ok: false, message: 'Mức hao hụt mặc định phải nằm trong khoảng 0–100%.' };
  }

  const normalizedRules: Record<string, number> = {};
  const seen = new Set<string>();

  for (let index = 0; index < rules.length; index++) {
    const category = (rules[index].category || '').trim();
    if (!category) {
      return { ok: false, message: `Quy tắc dòng ${index + 1} chưa chọn phân loại hóa chất.` };
    }

    const key = category.toLocaleLowerCase('vi');
    if (seen.has(key)) {
      return { ok: false, message: `Phân loại “${category}” đang có nhiều hơn một quy tắc hao hụt.` };
    }
    seen.add(key);

    const margin = finitePercentage(rules[index].margin);
    if (margin === null) {
      return { ok: false, message: `Hao hụt của “${category}” phải nằm trong khoảng 0–100%.` };
    }
    normalizedRules[category] = margin;
  }

  return {
    ok: true,
    value: {
      defaultMargin: normalizedDefault,
      rules: normalizedRules,
    },
  };
}

export function findUsersReferencingRole<T extends { role?: string | null; roleId?: string | null }>(users: T[], roleId: string): T[] {
  return users.filter(user => user.role === 'staff' && (user.roleId || '') === roleId);
}
