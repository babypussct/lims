import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('shared UI date picker primitive contract', () => {
  it('ensures AppDatePickerComponent meets the shared UI primitive contract', () => {
    const source = read('./date-picker.component.ts');
    const barrel = read('../index.ts');

    // Basic Angular component setup
    assert.match(source, /selector:\s*['"]app-date-picker['"]/);
    assert.match(source, /standalone:\s*true/);
    assert.match(source, /implements\s+ControlValueAccessor/);
    assert.match(source, /NG_VALUE_ACCESSOR/);

    // Two-way signal model and inputs
    assert.match(source, /value\s*=\s*model<string>\(['"]['"]\)/);
    assert.match(source, /presets\s*=\s*input<DatePickerPresets>\(['"]none['"]\)/);
    assert.match(source, /align\s*=\s*input<DatePickerAlign>\(['"]auto['"]\)/);
    assert.match(source, /size\s*=\s*input<DatePickerSize>\(['"]md['"]\)/);

    // Must strictly NOT use native type="date"
    assert.doesNotMatch(source, /type\s*=\s*['"]date['"]/i);
    // Uses text input with numeric inputmode
    assert.match(source, /type="text"/);
    assert.match(source, /inputmode="numeric"/);

    // Vietnamese weekdays and Soft UI indicators
    assert.match(source, /Th 2/);
    assert.match(source, /CN/);
    assert.match(source, /aria-label="Xóa ngày"/);
    assert.match(source, /aria-label="Mở lịch chọn ngày"/);
    assert.match(source, /min-w-\[136px\]/);
    assert.match(source, /max-w-\[calc\(100vw-1\.5rem\)\]/);
    assert.match(source, /touch-manipulation/);
    assert.match(source, /\[class\.h-11\]="size\(\) === 'sm' \|\| size\(\) === 'md'"/);
    assert.match(source, /\[class\.sm:h-8\]="size\(\) === 'sm'"/);
    assert.match(source, /\[class\.sm:h-10\]="size\(\) === 'md'"/);
    assert.match(source, /class="h-full flex-1 min-w-0/);
    assert.match(source, /\[class\.w-10\]="size\(\) === 'sm' \|\| size\(\) === 'md'"/);
    assert.match(source, /\[class\.h-10\]="size\(\) === 'sm' \|\| size\(\) === 'md'"/);
    assert.match(source, /\[class\.sm:w-5\]="size\(\) === 'sm'"/);
    assert.match(source, /\[class\.sm:w-7\]="size\(\) === 'md'"/);
    assert.match(source, /resolveDatePickerAlignment/);
    assert.match(source, /resolveDatePickerPopoverPosition/);
    assert.match(source, /\[style\.left\.px\]/);
    assert.match(source, /\[style\.right\.px\]/);

    // Check barrel export
    assert.match(barrel, /export \* from '\.\/date-picker\/date-picker\.component'/);
    assert.match(barrel, /export \* from '\.\/date-picker\/date-picker\.model'/);
  });

  it('verifies date picker models and preset definitions', () => {
    const modelSource = read('./date-picker.model.ts');

    assert.match(modelSource, /export type DatePickerPresetGroup\s*=\s*'standard'\s*\|\s*'prep'\s*\|\s*'simple'\s*\|\s*'none'/);
    assert.match(modelSource, /export type DatePickerAlign\s*=\s*'left'\s*\|\s*'right'\s*\|\s*'auto'/);
    assert.match(modelSource, /export type DatePickerSize\s*=\s*'sm'\s*\|\s*'md'/);
    assert.match(modelSource, /export interface DatePickerPresetItem/);
  });
});
