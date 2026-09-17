export type DatePickerPresetGroup = 'standard' | 'prep' | 'simple' | 'none';
export type DatePickerSize = 'sm' | 'md';
export type DatePickerAlign = 'left' | 'right' | 'auto';
export type DatePickerPresetUnit = 'day' | 'month' | 'year';
export type DatePickerPresetResolver = (baseIso: string) => string;

export interface DatePickerPresetItem {
  id: string;
  label: string;
  amount?: number;
  unit?: DatePickerPresetUnit;
  resolver?: DatePickerPresetResolver;
}

export type DatePickerPresets = DatePickerPresetGroup | DatePickerPresetItem[];
