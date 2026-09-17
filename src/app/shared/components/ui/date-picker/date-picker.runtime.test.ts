import '@angular/compiler';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ElementRef,
  Injector,
  runInInjectionContext,
  signal,
  ɵChangeDetectionScheduler as ChangeDetectionScheduler,
  ɵEffectScheduler as EffectScheduler,
  ɵMicrotaskEffectScheduler as MicrotaskEffectScheduler,
  ɵPendingTasksInternal as PendingTasksInternal
} from '@angular/core';
import {
  AppDatePickerComponent,
  resolveDatePickerAlignment,
  resolveDatePickerPopoverPosition
} from './date-picker.component';
import { formatIsoToDisplay, parseDisplayToIso, addCalendarDate, isValidIsoDate } from '../../../utils/date-only';

function createDatePickerInstance() {
  const mockElement = {
    nativeElement: {
      querySelector: (selector: string) => ({
        focus: () => {},
        getAttribute: () => selector
      })
    }
  };

  const injector = Injector.create({
    providers: [
      { provide: ElementRef, useValue: mockElement },
      { provide: ChangeDetectionScheduler, useValue: { notify() {}, runningTick: false } },
      PendingTasksInternal,
      { provide: EffectScheduler, useClass: MicrotaskEffectScheduler }
    ]
  });

  return runInInjectionContext(injector, () => {
    const component = new AppDatePickerComponent();
    // The production effect runs as part of Angular's change-detection turn.
    // Expose the test scheduler so signal-driven updates can be flushed without
    // mounting a full application in this lightweight runtime test.
    (component as any).flushEffects = () => injector.get(EffectScheduler).flush();
    return component;
  });
}

describe('AppDatePickerComponent runtime behavior', () => {
  it('keeps the calendar inside the viewport by resolving explicit and automatic alignment', () => {
    assert.equal(resolveDatePickerAlignment('left', { left: 240, right: 376 }, 393), 'left');
    assert.equal(resolveDatePickerAlignment('right', { left: 0, right: 136 }, 393), 'right');
    assert.equal(resolveDatePickerAlignment('auto', { left: 16, right: 152 }, 393), 'left');
    assert.equal(resolveDatePickerAlignment('auto', { left: 241, right: 377 }, 393), 'right');
    assert.equal(resolveDatePickerAlignment('auto', { left: 160, right: 296 }, 320), 'right');
    assert.equal(resolveDatePickerAlignment('auto', null, 320), 'left');

    assert.deepEqual(
      resolveDatePickerPopoverPosition(
        'auto',
        { left: 53, right: 252 },
        { left: 215, right: 240 },
        320
      ),
      { alignment: 'right', offsetX: 56 }
    );

    const comp = createDatePickerInstance();
    (comp as any).align = signal('right');
    assert.equal((comp as any).effectiveAlign(), 'right');
  });

  it('synchronizes externally assigned model values into the display and calendar state', async () => {
    const comp = createDatePickerInstance();

    comp.value.set('2026-09-17');
    (comp as any).flushEffects();

    assert.equal(comp.displayValue(), '17/09/2026');
    assert.equal(comp.viewYear(), 2026);
    assert.equal(comp.viewMonth(), 9);
    assert.equal(comp.focusedIso(), '2026-09-17');
  });

  it('implements ControlValueAccessor writeValue, registerOnChange and setDisabledState', () => {
    const comp = createDatePickerInstance();

    let emitted = '';
    comp.registerOnChange((val: string) => {
      emitted = val;
    });

    // Initial state
    assert.equal(comp.value(), '');
    assert.equal(comp.displayValue(), '');

    // writeValue with valid ISO
    comp.writeValue('2026-09-17');
    assert.equal(comp.value(), '2026-09-17');
    assert.equal(comp.displayValue(), '17/09/2026');
    assert.equal(comp.viewYear(), 2026);
    assert.equal(comp.viewMonth(), 9);

    // writeValue with empty / invalid string
    comp.writeValue('');
    assert.equal(comp.value(), '');
    assert.equal(comp.displayValue(), '');

    // Invalid external CVA values remain visible and invalid instead of being
    // cleared by the model synchronization effect.
    comp.writeValue('2026-02-31');
    (comp as any).flushEffects();
    assert.equal(comp.value(), '2026-02-31');
    assert.equal(comp.displayValue(), '2026-02-31');
    assert.equal(comp.isInvalid(), true);

    // Disabled state
    comp.setDisabledState(true);
    assert.equal(comp.effectiveDisabled(), true);
    comp.setDisabledState(false);
    assert.equal(comp.effectiveDisabled(), false);
  });

  it('implements Validator for FormControl and validates required, invalid format, and range', () => {
    const comp = createDatePickerInstance();

    // Not required, empty value -> null
    assert.equal(comp.validate({ value: '' } as any), null);

    // Valid ISO date -> null
    assert.equal(comp.validate({ value: '2026-09-17' } as any), null);

    // Invalid format -> { invalidDate: true }
    assert.deepEqual(comp.validate({ value: 'invalid-date' } as any), { invalidDate: true });

    // When isInvalid signal is true -> { invalidDate: true }
    comp.isInvalid.set(true);
    assert.deepEqual(comp.validate({ value: '' } as any), { invalidDate: true });
    comp.isInvalid.set(false);

    // Date bounds are exposed as distinct validation keys for form consumers.
    (comp as any).min = signal('2026-09-18');
    (comp as any).max = signal('2026-09-25');
    assert.deepEqual(comp.validate({ value: '2026-09-17' } as any), {
      minDate: { min: '2026-09-18', actual: '2026-09-17' }
    });
    assert.deepEqual(comp.validate({ value: '2026-09-26' } as any), {
      maxDate: { max: '2026-09-25', actual: '2026-09-26' }
    });
  });

  it('preserves precise range errors while an out-of-range date is being typed', () => {
    const comp = createDatePickerInstance();
    (comp as any).min = signal('2026-09-18');
    (comp as any).max = signal('2026-09-25');

    comp.writeValue('2026-09-20');
    const inputEl = { value: '17092026' } as HTMLInputElement;
    comp.onTextInput({ target: inputEl } as any);

    assert.equal(comp.value(), '2026-09-20');
    assert.deepEqual(comp.validate({ value: '2026-09-20' } as any), {
      minDate: { min: '2026-09-18', actual: '2026-09-17' }
    });
  });

  it('does not emit commit event while typing, only on explicit actions (Enter, day selection, preset)', () => {
    const comp = createDatePickerInstance();

    const commitEmissions: string[] = [];
    comp.commit.subscribe((val: string) => {
      commitEmissions.push(val);
    });

    let modelValue = '';
    comp.registerOnChange((val: string) => {
      modelValue = val;
    });

    // 1. Simulate typing 8 digits
    const inputEl = { value: '17092026' } as HTMLInputElement;
    comp.onTextInput({ target: inputEl } as any);

    // Input auto-formatted
    assert.equal(inputEl.value, '17/09/2026');
    // Model updated
    assert.equal(comp.value(), '2026-09-17');
    assert.equal(modelValue, '2026-09-17');
    // BUT commit was NOT emitted during typing!
    assert.equal(commitEmissions.length, 0);

    // 2. Simulate pressing Enter -> NOW commit emits exactly once
    comp.onInputKeydown({ key: 'Enter', preventDefault: () => {} } as KeyboardEvent);
    assert.equal(commitEmissions.length, 1);
    assert.equal(commitEmissions[0], '2026-09-17');

    // 3. Simulate day selection in calendar popover -> emits commit
    comp.selectDay({
      key: '2026-09-20',
      iso: '2026-09-20',
      dayNumber: 20,
      isCurrentMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: false,
      ariaLabel: 'Ngày 20 tháng 09 năm 2026'
    });
    assert.equal(commitEmissions.length, 2);
    assert.equal(commitEmissions[1], '2026-09-20');

    // 4. Simulate clear -> emits commit with empty string
    comp.clear();
    assert.equal(commitEmissions.length, 3);
    assert.equal(commitEmissions[2], '');
    assert.equal(comp.value(), '');
  });

  it('generates accurate aria labels across previous, current and next month boundaries', () => {
    const comp = createDatePickerInstance();

    // Set view to September 2026
    comp.viewYear.set(2026);
    comp.viewMonth.set(9);

    const days = comp['calendarDays']();
    assert.ok(days.length >= 35);

    // First day of grid (trailing from August 2026)
    const firstDay = days[0];
    assert.equal(firstDay.isCurrentMonth, false);
    assert.equal(firstDay.dayNumber, 31);
    assert.equal(firstDay.iso, '2026-08-31');
    assert.match(firstDay.ariaLabel, /Ngày 31 tháng 08 năm 2026/);

    // A middle day (September 2026)
    const sep17 = days.find(d => d.iso === '2026-09-17');
    assert.ok(sep17);
    assert.equal(sep17.isCurrentMonth, true);
    assert.match(sep17.ariaLabel, /Ngày 17 tháng 09 năm 2026/);

    // Last days of grid (leading into October 2026)
    const octDay = days.find(d => d.iso === '2026-10-01');
    assert.ok(octDay);
    assert.equal(octDay.isCurrentMonth, false);
    assert.match(octDay.ariaLabel, /Ngày 01 tháng 10 năm 2026/);
  });

  it('keeps calendar grids valid at the supported year boundaries', () => {
    const comp = createDatePickerInstance();

    comp.viewYear.set(9999);
    comp.viewMonth.set(12);
    const lastSupportedMonth = comp['calendarDays']();

    assert.equal(lastSupportedMonth.length % 7, 0);
    assert.ok(lastSupportedMonth.some(day => day.isPlaceholder));
    assert.ok(lastSupportedMonth.filter(day => !day.isPlaceholder).every(day => isValidIsoDate(day.iso)));

    comp.viewYear.set(1);
    comp.viewMonth.set(1);
    const firstSupportedMonth = comp['calendarDays']();
    assert.equal(firstSupportedMonth.length % 7, 0);
    assert.ok(firstSupportedMonth.every(day => day.isPlaceholder || isValidIsoDate(day.iso)));
  });

  it('navigates focused date correctly on keyboard arrows and roving focus', () => {
    const comp = createDatePickerInstance();
    comp.focusedIso.set('2026-09-17');
    comp.viewYear.set(2026);
    comp.viewMonth.set(9);

    // Step day right (+1)
    comp['stepFocusedDay'](1);
    assert.equal(comp.focusedIso(), '2026-09-18');

    // Step day down (+7)
    comp['stepFocusedDay'](7);
    assert.equal(comp.focusedIso(), '2026-09-25');

    // Step month cross boundary (+7 from 25th -> Oct 02)
    comp['stepFocusedDay'](7);
    assert.equal(comp.focusedIso(), '2026-10-02');
    assert.equal(comp.viewMonth(), 10);
  });

  it('supports Home and End month navigation and clamps focus to date bounds', () => {
    const comp = createDatePickerInstance();
    comp.viewYear.set(2026);
    comp.viewMonth.set(2);
    comp.focusedIso.set('2026-02-15');

    comp.onPopoverKeydown({ key: 'Home', preventDefault: () => {} } as KeyboardEvent);
    assert.equal(comp.focusedIso(), '2026-02-01');

    comp.onPopoverKeydown({ key: 'End', preventDefault: () => {} } as KeyboardEvent);
    assert.equal(comp.focusedIso(), '2026-02-28');

    (comp as any).min = signal('2026-02-10');
    (comp as any).max = signal('2026-02-20');
    comp.focusedIso.set('2026-02-15');
    comp['stepFocusedDay'](-1);
    assert.equal(comp.focusedIso(), '2026-02-14');
    comp['stepFocusedDay'](-10);
    assert.equal(comp.focusedIso(), '2026-02-10');
    comp['stepFocusedDay'](20);
    assert.equal(comp.focusedIso(), '2026-02-20');
  });

  it('notifies Angular validation when an empty required field is blurred', () => {
    const comp = createDatePickerInstance();
    (comp as any).required = signal(true);

    let validationChanges = 0;
    comp.registerOnValidatorChange(() => validationChanges++);
    comp.onTextBlur();

    assert.equal(comp.isInvalid(), true);
    assert.ok(validationChanges >= 1);
    assert.deepEqual(comp.validate({ value: '' } as any), { required: true });
  });

  it('emits an explicit commit for clearing with Enter when the field is optional', () => {
    const comp = createDatePickerInstance();
    const emissions: string[] = [];
    comp.commit.subscribe(value => emissions.push(value));

    comp.onInputKeydown({ key: 'Enter', preventDefault: () => {} } as KeyboardEvent);

    assert.deepEqual(emissions, ['']);
  });
});
