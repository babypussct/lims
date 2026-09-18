import {
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {
  addCalendarDate,
  compareIsoDates,
  formatIsoToDisplay,
  formatPartsToIso,
  getDaysInMonth,
  getTodayIso,
  getWeekday,
  isValidIsoDate,
  parseDisplayToIso,
  parseIsoDateParts
} from '../../../utils/date-only';
import {
  DatePickerPresetGroup,
  DatePickerAlign,
  DatePickerPresetItem,
  DatePickerPresets,
  DatePickerSize
} from './date-picker.model';

interface CalendarDayView {
  key: string;
  iso: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  ariaLabel: string;
  isPlaceholder?: boolean;
}

export type ResolvedDatePickerAlign = Exclude<DatePickerAlign, 'auto'>;

const DATE_PICKER_POPOVER_MAX_WIDTH = 310;
const DATE_PICKER_VIEWPORT_GUTTER = 24;
const DATE_PICKER_ALIGNMENT_MARGIN = 12;

/**
 * Choose the side that keeps the calendar inside the viewport when possible.
 * This helper is deliberately DOM-free so the responsive behavior can be
 * tested without mounting Angular or depending on a browser window.
 */
export function resolveDatePickerAlignment(
  requested: DatePickerAlign,
  triggerRect: { left: number; right: number } | null,
  viewportWidth: number
): ResolvedDatePickerAlign {
  if (requested === 'left' || requested === 'right') return requested;
  if (
    !triggerRect ||
    !Number.isFinite(triggerRect.left) ||
    !Number.isFinite(triggerRect.right) ||
    !Number.isFinite(viewportWidth) ||
    viewportWidth <= 0
  ) {
    return 'left';
  }

  const popoverWidth = Math.min(
    DATE_PICKER_POPOVER_MAX_WIDTH,
    Math.max(0, viewportWidth - DATE_PICKER_VIEWPORT_GUTTER)
  );
  const availableForLeftAlignment = viewportWidth - DATE_PICKER_ALIGNMENT_MARGIN - triggerRect.left;
  const availableForRightAlignment = triggerRect.right - DATE_PICKER_ALIGNMENT_MARGIN;
  const fitsLeft = availableForLeftAlignment >= popoverWidth;
  const fitsRight = availableForRightAlignment >= popoverWidth;

  if (fitsLeft && !fitsRight) return 'left';
  if (fitsRight && !fitsLeft) return 'right';
  if (fitsLeft && fitsRight) {
    const triggerCenter = (triggerRect.left + triggerRect.right) / 2;
    return triggerCenter > viewportWidth / 2 ? 'right' : 'left';
  }

  // If the trigger is too close to both edges, use the side with more room.
  // The popover itself is still capped by the viewport width in the template.
  return availableForRightAlignment >= availableForLeftAlignment ? 'right' : 'left';
}

export interface DatePickerPopoverPosition {
  alignment: ResolvedDatePickerAlign;
  offsetX: number;
}

/**
 * Resolve both the preferred side and the small horizontal correction needed
 * when the component itself is not flush with the viewport edge. The offset
 * is relative to the chosen left/right anchor and keeps the final popover
 * inside the viewport gutter.
 */
export function resolveDatePickerPopoverPosition(
  requested: DatePickerAlign,
  anchorRect: { left: number; right: number } | null,
  triggerRect: { left: number; right: number } | null,
  viewportWidth: number
): DatePickerPopoverPosition {
  const alignment = resolveDatePickerAlignment(requested, triggerRect, viewportWidth);
  if (
    !anchorRect ||
    !Number.isFinite(anchorRect.left) ||
    !Number.isFinite(anchorRect.right) ||
    !Number.isFinite(viewportWidth) ||
    viewportWidth <= 0
  ) {
    return { alignment, offsetX: 0 };
  }

  const popoverWidth = Math.min(
    DATE_PICKER_POPOVER_MAX_WIDTH,
    Math.max(0, viewportWidth - DATE_PICKER_VIEWPORT_GUTTER)
  );
  const viewportMinLeft = DATE_PICKER_ALIGNMENT_MARGIN;
  const viewportMaxLeft = Math.max(
    viewportMinLeft,
    viewportWidth - popoverWidth - DATE_PICKER_ALIGNMENT_MARGIN
  );
  const anchoredLeft = alignment === 'left'
    ? anchorRect.left
    : anchorRect.right - popoverWidth;
  const clampedLeft = Math.min(Math.max(anchoredLeft, viewportMinLeft), viewportMaxLeft);

  return { alignment, offsetX: clampedLeft - anchoredLeft };
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDatePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AppDatePickerComponent),
      multi: true
    }
  ],
  host: {
    class: 'block relative'
  },
  template: `
    <div class="w-full flex flex-col gap-1">
      @if (label()) {
        <label [attr.for]="inputId()" class="text-xs font-bold text-slate-600 dark:text-slate-300">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      <!-- Input control wrapper -->
      <div
        class="flex items-center transition-all duration-150 border rounded-xl bg-white dark:bg-slate-800"
        [class.gap-1]="size() === 'sm'"
        [class.gap-1.5]="size() === 'md'"
        [class.border-red-400]="isInvalid() || !!error()"
        [class.dark:border-red-500]="isInvalid() || !!error()"
        [class.border-slate-200]="!isInvalid() && !error()"
        [class.dark:border-slate-700]="!isInvalid() && !error()"
        [class.focus-within:border-fuchsia-500]="!isInvalid() && !error()"
        [class.dark:focus-within:border-fuchsia-500]="!isInvalid() && !error()"
        [class.focus-within:ring-2]="true"
        [class.focus-within:ring-fuchsia-100]="!isInvalid() && !error()"
        [class.dark:focus-within:ring-fuchsia-900/30]="!isInvalid() && !error()"
        [class.focus-within:ring-red-100]="isInvalid() || !!error()"
        [class.dark:focus-within:ring-red-900/30]="isInvalid() || !!error()"
        [class.opacity-50]="effectiveDisabled()"
        [class.cursor-not-allowed]="effectiveDisabled()"
        [class.h-11]="size() === 'sm' || size() === 'md'"
        [class.sm:h-8]="size() === 'sm'"
        [class.px-1.5]="size() === 'sm'"
        [class.min-w-[136px]]="size() === 'sm'"
        [class.sm:h-10]="size() === 'md'"
        [class.px-3]="size() === 'md'"
        [class.min-w-[160px]]="size() === 'md'"
      >
        <input
          #textInput
          type="text"
          inputmode="numeric"
          [id]="inputId()"
          [name]="name()"
          [placeholder]="placeholder()"
          [disabled]="effectiveDisabled()"
          [readOnly]="readonly()"
          [required]="required()"
          [value]="displayValue()"
          (input)="onTextInput($event)"
          (blur)="onTextBlur()"
          (keydown)="onInputKeydown($event)"
          [attr.aria-label]="ariaLabel() || label() || 'Ngày'"
          [attr.aria-describedby]="describedBy()"
          [attr.aria-controls]="isOpen() ? popoverId() : null"
          [attr.aria-required]="required() ? 'true' : null"
          [attr.aria-invalid]="isInvalid() || !!error() ? 'true' : null"
          class="h-full flex-1 min-w-0 bg-transparent border-none p-0 font-bold outline-none text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          [class.sm:text-xs]="size() === 'sm'"
          [class.sm:text-sm]="size() === 'md'"
        />

        @if (!effectiveDisabled() && !readonly() && displayValue()) {
          <button
            type="button"
            (click)="clear($event)"
            class="text-slate-400 hover:text-red-500 p-1 rounded-md transition flex items-center justify-center cursor-pointer touch-manipulation"
            [class.w-10]="size() === 'sm' || size() === 'md'"
            [class.h-10]="size() === 'sm' || size() === 'md'"
            [class.sm:w-5]="size() === 'sm'"
            [class.sm:h-5]="size() === 'sm'"
            [class.text-[10px]]="size() === 'sm'"
            [class.sm:w-6]="size() === 'md'"
            [class.sm:h-6]="size() === 'md'"
            [class.text-xs]="size() === 'md'"
            aria-label="Xóa ngày"
            title="Xóa ngày"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        }

        <button
          #triggerButton
          type="button"
          (click)="togglePopover($event)"
          [disabled]="effectiveDisabled() || readonly()"
          class="text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 p-1 rounded-md transition flex items-center justify-center cursor-pointer disabled:cursor-not-allowed touch-manipulation"
          [class.w-10]="size() === 'sm' || size() === 'md'"
          [class.h-10]="size() === 'sm' || size() === 'md'"
          [class.sm:w-5]="size() === 'sm'"
          [class.sm:h-5]="size() === 'sm'"
          [class.text-xs]="size() === 'sm'"
          [class.sm:w-7]="size() === 'md'"
          [class.sm:h-7]="size() === 'md'"
          [class.text-sm]="size() === 'md'"
          [attr.aria-expanded]="isOpen()"
          aria-haspopup="dialog"
          [attr.aria-controls]="isOpen() ? popoverId() : null"
          data-date-picker-trigger
          aria-label="Mở lịch chọn ngày"
          title="Mở lịch"
        >
          <i class="fa-regular fa-calendar"></i>
        </button>
      </div>

      @if (error()) {
        <p [id]="errorId()" aria-live="polite" class="text-[10px] font-bold text-red-500 dark:text-red-400 leading-none mt-0.5">
          {{ error() }}
        </p>
      }

      <!-- Soft UI Popover -->
      @if (isOpen()) {
        <div
          [id]="popoverId()"
          class="absolute top-full mt-1.5 z-50 box-border bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl border border-slate-200/80 dark:border-slate-700 p-3 min-w-0 max-w-[calc(100vw-1.5rem)] animate-fade-in select-none"
          style="width: min(310px, calc(100vw - 1.5rem));"
          [class.left-0]="effectiveAlign() === 'left'"
          [class.right-0]="effectiveAlign() === 'right'"
          [style.left.px]="effectiveAlign() === 'left' ? popoverOffsetX() : null"
          [style.right.px]="effectiveAlign() === 'right' ? -popoverOffsetX() : null"
          role="dialog"
          [attr.aria-label]="'Lịch chọn ngày: ' + monthYearTitle()"
          (keydown)="onPopoverKeydown($event)"
        >
          <!-- Presets bar if enabled -->
          @if (resolvedPresets().length > 0) {
            <div class="flex flex-wrap gap-1 mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-700/60">
              @for (preset of resolvedPresets(); track preset.id) {
                <button
                  type="button"
                  (click)="applyPreset(preset)"
                  class="px-2 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 hover:text-fuchsia-600 dark:hover:bg-fuchsia-900/30 dark:hover:text-fuchsia-400 transition cursor-pointer touch-manipulation"
                >
                  {{ preset.label }}
                </button>
              }
            </div>
          }

          <!-- Header -->
          <div class="flex items-center justify-between mb-2">
            <button
              type="button"
              (click)="prevMonth()"
              class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer touch-manipulation"
              aria-label="Tháng trước"
            >
              <i class="fa-solid fa-chevron-left text-xs"></i>
            </button>

            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">
              {{ monthYearTitle() }}
            </span>

            <div class="flex items-center gap-1">
              <button
                type="button"
                (click)="goToToday()"
                class="px-1.5 py-0.5 text-[10px] font-bold rounded text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 transition cursor-pointer touch-manipulation"
                title="Về hôm nay"
              >
                Hôm nay
              </button>

              <button
              type="button"
              (click)="nextMonth()"
              class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer touch-manipulation"
                aria-label="Tháng sau"
              >
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Weekday Headers -->
          <div class="grid grid-cols-7 text-center mb-1" role="row">
            @for (wd of weekDays; track wd) {
              <div role="columnheader" class="text-[10px] font-bold text-slate-400 dark:text-slate-500 py-1">
                {{ wd }}
              </div>
            }
          </div>

          <!-- Days Grid -->
          <div class="space-y-1 text-center" role="grid" [attr.aria-label]="'Các ngày trong ' + monthYearTitle()">
            @for (week of calendarWeeks(); track $index) {
              <div class="grid grid-cols-7 gap-1" role="row">
                @for (day of week; track day.key) {
                  @if (day.isPlaceholder) {
                    <span class="h-8 w-8 sm:h-9 sm:w-9 mx-auto" aria-hidden="true"></span>
                  } @else {
                    <button
                      type="button"
                      role="gridcell"
                      (click)="selectDay(day)"
                      [disabled]="day.isDisabled"
                      [attr.data-iso]="day.iso"
                      [attr.tabindex]="day.iso === (focusedIso() || value() || todayIso) ? 0 : -1"
                      class="h-8 w-8 sm:h-9 sm:w-9 mx-auto flex items-center justify-center rounded-xl text-xs font-bold transition cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                      [class.bg-gradient-soft]="day.isSelected"
                      [class.text-white]="day.isSelected"
                      [class.shadow-soft-md]="day.isSelected"
                      [class.ring-2]="day.iso === focusedIso() && !day.isSelected"
                      [class.ring-fuchsia-500]="day.iso === focusedIso() && !day.isSelected"
                      [class.dark:ring-fuchsia-400]="day.iso === focusedIso() && !day.isSelected"
                      [class.ring-1]="day.isToday && !day.isSelected && day.iso !== focusedIso()"
                      [class.ring-fuchsia-400]="day.isToday && !day.isSelected && day.iso !== focusedIso()"
                      [class.text-fuchsia-600]="day.isToday && !day.isSelected"
                      [class.dark:text-fuchsia-400]="day.isToday && !day.isSelected"
                      [class.text-slate-700]="day.isCurrentMonth && !day.isSelected && !day.isToday"
                      [class.dark:text-slate-200]="day.isCurrentMonth && !day.isSelected && !day.isToday"
                      [class.text-slate-300]="!day.isCurrentMonth && !day.isSelected"
                      [class.dark:text-slate-600]="!day.isCurrentMonth && !day.isSelected"
                      [class.hover:bg-slate-100]="!day.isSelected && !day.isDisabled"
                      [class.dark:hover:bg-slate-700]="!day.isSelected && !day.isDisabled"
                      [class.opacity-25]="day.isDisabled"
                      [class.cursor-not-allowed]="day.isDisabled"
                      [attr.aria-label]="day.ariaLabel"
                      [attr.aria-selected]="day.isSelected ? 'true' : 'false'"
                      [attr.aria-current]="day.isToday ? 'date' : null"
                    >
                      {{ day.dayNumber }}
                    </button>
                  }
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class AppDatePickerComponent implements ControlValueAccessor, Validator {
  private static nextId = 0;
  private elementRef = inject(ElementRef);
  private readonly generatedInputId = `datepicker-${++AppDatePickerComponent.nextId}`;

  // Model & Inputs
  value = model<string>('');
  presets = input<DatePickerPresets>('none');
  label = input<string | null>(null);
  placeholder = input<string>('DD/MM/YYYY');
  min = input<string | null>(null);
  max = input<string | null>(null);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  required = input<boolean>(false);
  align = input<DatePickerAlign>('auto');
  size = input<DatePickerSize>('md');
  error = input<string | null>(null);
  ariaLabel = input<string | null>(null);
  ariaDescribedBy = input<string | null>(null);
  id = input<string>('');
  name = input<string>('');

  // Outputs
  commit = output<string>();

  // State
  isOpen = signal<boolean>(false);
  displayValue = signal<string>('');
  isInvalid = signal<boolean>(false);
  viewYear = signal<number>(new Date().getFullYear());
  viewMonth = signal<number>(new Date().getMonth() + 1);
  focusedIso = signal<string>('');
  protected popoverAlign = signal<ResolvedDatePickerAlign>('left');
  protected popoverOffsetX = signal(0);

  private cvaDisabled = signal<boolean>(false);
  protected effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly todayIso = getTodayIso();

  // Weekdays in Vietnamese (Monday-first)
  readonly weekDays = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor() {
    // Sync external model updates with displayValue and calendar position
    // whenever model() changes from parent
    effect(() => {
      const v = this.value();
      untracked(() => {
        if (isValidIsoDate(v)) {
          this.displayValue.set(formatIsoToDisplay(v));
          this.setInvalid(false);
          const parts = parseIsoDateParts(v);
          if (parts) {
            this.viewYear.set(parts.year);
            this.viewMonth.set(parts.month);
            this.focusedIso.set(v);
          }
        } else if (!v.trim()) {
          this.displayValue.set('');
          this.setInvalid(false);
        } else {
          // Keep an externally supplied invalid value visible so the control
          // can explain/fix it instead of silently replacing it with empty.
          this.displayValue.set(v);
          this.setInvalid(true);
        }
      });
    });

    // Notify parent FormControl / Form when validation inputs change
    effect(() => {
      this.required();
      this.min();
      this.max();
      untracked(() => {
        this.onValidatorChange();
      });
    });
  }

  protected inputId = computed(() => this.id() || this.generatedInputId);
  protected popoverId = computed(() => `${this.inputId()}-popover`);
  protected errorId = computed(() => `${this.inputId()}-error`);
  protected describedBy = computed(() => {
    const ids = [this.ariaDescribedBy(), this.error() ? this.errorId() : null]
      .filter((id): id is string => Boolean(id));
    return ids.length > 0 ? ids.join(' ') : null;
  });
  protected effectiveAlign = computed<ResolvedDatePickerAlign>(() => {
    const requested = this.align();
    return requested === 'auto' ? this.popoverAlign() : requested;
  });

  protected monthYearTitle = computed(() => {
    const m = String(this.viewMonth()).padStart(2, '0');
    return `Tháng ${m}, ${this.viewYear()}`;
  });

  protected resolvedPresets = computed<DatePickerPresetItem[]>(() => {
    const p = this.presets();
    if (!p || p === 'none') return [];
    if (Array.isArray(p)) return p;

    switch (p) {
      case 'standard':
        return [
          { id: 'today', label: 'Hôm nay', amount: 0, unit: 'day' },
          { id: 'plus6m', label: '+6 tháng', amount: 6, unit: 'month' },
          { id: 'plus1y', label: '+1 năm', amount: 1, unit: 'year' },
          { id: 'plus2y', label: '+2 năm', amount: 2, unit: 'year' },
          { id: 'plus3y', label: '+3 năm', amount: 3, unit: 'year' }
        ];
      case 'prep':
        return [
          { id: 'today', label: 'Hôm nay', amount: 0, unit: 'day' },
          { id: 'plus24h', label: '+24 giờ', amount: 1, unit: 'day' },
          { id: 'plus7d', label: '+7 ngày', amount: 7, unit: 'day' },
          { id: 'plus1m', label: '+1 tháng', amount: 1, unit: 'month' },
          { id: 'plus3m', label: '+3 tháng', amount: 3, unit: 'month' }
        ];
      case 'simple':
        return [
          { id: 'yesterday', label: 'Hôm qua', amount: -1, unit: 'day' },
          { id: 'today', label: 'Hôm nay', amount: 0, unit: 'day' },
          { id: 'tomorrow', label: 'Ngày mai', amount: 1, unit: 'day' }
        ];
      default:
        return [];
    }
  });

  protected calendarDays = computed<CalendarDayView[]>(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const selectedIso = this.value();
    const todayIso = getTodayIso();
    const minIso = this.min();
    const maxIso = this.max();

    const daysInMonth = getDaysInMonth(year, month);
    // Determine weekday of the 1st day (0 = Sunday, 1 = Monday ... 6 = Saturday).
    const firstDayWeekday = getWeekday(year, month, 1);
    // Monday-first offset: Mon -> 0, Tue -> 1 ... Sun -> 6
    const startOffset = (firstDayWeekday + 6) % 7;

    const days: CalendarDayView[] = [];

    // 1. Previous month trailing days
    if (startOffset > 0) {
      const prevMonthYear = month === 1 ? year - 1 : year;
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevMonthDays = getDaysInMonth(prevMonthYear, prevMonth);

      if (prevMonthDays > 0) {
        for (let i = startOffset - 1; i >= 0; i--) {
          const dayNum = prevMonthDays - i;
          const iso = formatPartsToIso({ year: prevMonthYear, month: prevMonth, day: dayNum });
          days.push({
            key: iso,
            iso,
            dayNumber: dayNum,
            isCurrentMonth: false,
            isToday: iso === todayIso,
            isSelected: iso === selectedIso,
            isDisabled: this.isDateOutOfRange(iso, minIso, maxIso),
            ariaLabel: this.buildDayAriaLabel(prevMonthYear, prevMonth, dayNum, iso === todayIso, iso === selectedIso)
          });
        }
      } else {
        for (let index = 0; index < startOffset; index++) {
          days.push({
            key: `placeholder-before-${index}`,
            iso: '',
            dayNumber: 0,
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
            isDisabled: true,
            ariaLabel: '',
            isPlaceholder: true
          });
        }
      }
    }

    // 2. Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const iso = formatPartsToIso({ year, month, day: dayNum });
      days.push({
        key: iso,
        iso,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: iso === todayIso,
        isSelected: iso === selectedIso,
        isDisabled: this.isDateOutOfRange(iso, minIso, maxIso),
        ariaLabel: this.buildDayAriaLabel(year, month, dayNum, iso === todayIso, iso === selectedIso)
      });
    }

    // 3. Next month leading days to complete grid (multiples of 7, up to 35 or 42)
    const remaining = (7 - (days.length % 7)) % 7;
    if (remaining > 0) {
      const nextMonthYear = month === 12 ? year + 1 : year;
      const nextMonth = month === 12 ? 1 : month + 1;

      if (getDaysInMonth(nextMonthYear, nextMonth) > 0) {
        for (let dayNum = 1; dayNum <= remaining; dayNum++) {
          const iso = formatPartsToIso({ year: nextMonthYear, month: nextMonth, day: dayNum });
          days.push({
            key: iso,
            iso,
            dayNumber: dayNum,
            isCurrentMonth: false,
            isToday: iso === todayIso,
            isSelected: iso === selectedIso,
            isDisabled: this.isDateOutOfRange(iso, minIso, maxIso),
            ariaLabel: this.buildDayAriaLabel(nextMonthYear, nextMonth, dayNum, iso === todayIso, iso === selectedIso)
          });
        }
      } else {
        for (let index = 0; index < remaining; index++) {
          days.push({
            key: `placeholder-after-${index}`,
            iso: '',
            dayNumber: 0,
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
            isDisabled: true,
            ariaLabel: '',
            isPlaceholder: true
          });
        }
      }
    }

    return days;
  });

  protected calendarWeeks = computed<CalendarDayView[][]>(() => {
    const days = this.calendarDays();
    const weeks: CalendarDayView[][] = [];
    for (let index = 0; index < days.length; index += 7) {
      weeks.push(days.slice(index, index + 7));
    }
    return weeks;
  });

  private buildDayAriaLabel(year: number, month: number, day: number, isToday: boolean, isSelected: boolean): string {
    const m = String(month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    let label = `Ngày ${d} tháng ${m} năm ${year}`;
    if (isToday) label += ', Hôm nay';
    if (isSelected) label += ', Đang chọn';
    return label;
  }

  private getDateRangeError(
    iso: string,
    minIso: string | null = this.min(),
    maxIso: string | null = this.max()
  ): ValidationErrors | null {
    if (minIso && isValidIsoDate(minIso) && compareIsoDates(iso, minIso) < 0) {
      return { minDate: { min: minIso, actual: iso } };
    }
    if (maxIso && isValidIsoDate(maxIso) && compareIsoDates(iso, maxIso) > 0) {
      return { maxDate: { max: maxIso, actual: iso } };
    }
    return null;
  }

  private isDateOutOfRange(iso: string, minIso: string | null, maxIso: string | null): boolean {
    return this.getDateRangeError(iso, minIso, maxIso) !== null;
  }

  private setInvalid(invalid: boolean): void {
    if (this.isInvalid() === invalid) return;
    this.isInvalid.set(invalid);
    this.onValidatorChange();
  }

  // --- ControlValueAccessor & Validator Implementation ---

  writeValue(value: any): void {
    if (typeof value === 'string' && isValidIsoDate(value)) {
      this.value.set(value);
      this.displayValue.set(formatIsoToDisplay(value));
      this.setInvalid(false);
      const parts = parseIsoDateParts(value);
      if (parts) {
        this.viewYear.set(parts.year);
        this.viewMonth.set(parts.month);
        this.focusedIso.set(value);
      }
    } else {
      const invalidValue = typeof value === 'string' ? value : '';
      this.value.set(invalidValue);
      this.displayValue.set(invalidValue);
      this.setInvalid(invalidValue.trim().length > 0);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const v = control.value;
    if (v === null || v === undefined || (typeof v === 'string' && !v.trim())) {
      if (this.required()) return { required: true };
      return this.isInvalid() ? { invalidDate: true } : null;
    }
    if (typeof v !== 'string' || !isValidIsoDate(v)) {
      return { invalidDate: true };
    }
    const rangeError = this.getDateRangeError(v);
    if (rangeError) {
      return rangeError;
    }
    if (this.isInvalid()) {
      // Keep the previous valid CVA model while the user is typing, but still
      // expose a precise range error for a complete out-of-range date shown in
      // the input instead of collapsing it into a generic invalidDate error.
      const typedIso = parseDisplayToIso(this.displayValue());
      const typedRangeError = typedIso ? this.getDateRangeError(typedIso) : null;
      if (typedRangeError) return typedRangeError;
      return { invalidDate: true };
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  // --- Actions & User Interactions ---

  togglePopover(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.effectiveDisabled() || this.readonly()) return;

    const next = !this.isOpen();
    this.isOpen.set(next);
    if (next) {
      this.updatePopoverAlignment();
      const current = this.value();
      const preferred = isValidIsoDate(current) ? current : getTodayIso();
      const targetIso = this.clampToAllowedRange(preferred) ?? preferred;
      const parts = parseIsoDateParts(targetIso);
      if (parts) {
        this.viewYear.set(parts.year);
        this.viewMonth.set(parts.month);
        this.focusedIso.set(targetIso);
      }
      this.focusDayButton(targetIso);
    } else {
      this.onTouched();
    }
  }

  closePopover(restoreFocus = false): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.onTouched();
      if (restoreFocus) this.focusTriggerButton();
    }
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.isOpen()) return;
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.closePopover();
    }
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  onViewportChange(): void {
    if (this.isOpen()) this.updatePopoverAlignment();
  }

  prevMonth(): void {
    this.changeMonth(-1);
  }

  nextMonth(): void {
    this.changeMonth(1);
  }

  goToToday(): void {
    const targetIso = this.clampToAllowedRange(getTodayIso()) ?? getTodayIso();
    const parts = parseIsoDateParts(targetIso);
    if (!parts) return;
    this.viewYear.set(parts.year);
    this.viewMonth.set(parts.month);
    this.focusedIso.set(targetIso);
    this.focusDayButton(targetIso);
  }

  selectDay(day: CalendarDayView): void {
    if (day.isDisabled) return;
    this.commitDate(day.iso, true);
    this.closePopover(true);
  }

  applyPreset(preset: DatePickerPresetItem): void {
    const baseIso = getTodayIso();
    let targetIso: string;

    if (preset.resolver) {
      targetIso = preset.resolver(baseIso);
    } else if (preset.amount !== undefined && preset.unit) {
      targetIso = addCalendarDate(baseIso, preset.amount, preset.unit);
    } else {
      targetIso = baseIso;
    }

    if (isValidIsoDate(targetIso) && !this.isDateOutOfRange(targetIso, this.min(), this.max())) {
      this.commitDate(targetIso, true);
      this.closePopover(true);
    }
  }

  clear(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.effectiveDisabled() || this.readonly()) return;

    this.commitDate('', true);
    this.displayValue.set('');
    this.setInvalid(false);
  }

  private commitDate(iso: string, emitCommit = false): void {
    this.value.set(iso);
    this.displayValue.set(formatIsoToDisplay(iso));
    this.onChange(iso);
    this.setInvalid(false);
    if (emitCommit) {
      this.commit.emit(iso);
    }
  }

  // --- Input Typing & Validation ---

  onTextInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    let raw = inputEl.value;

    // Fast typing: if 8 consecutive digits typed e.g. 17092026, auto-insert /
    if (/^\d{8}$/.test(raw)) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4)}`;
      inputEl.value = raw;
    }

    this.displayValue.set(raw);

    if (!raw.trim()) {
      this.setInvalid(false);
      this.commitDate('', false);
      return;
    }

    const iso = parseDisplayToIso(raw);
    if (iso && isValidIsoDate(iso)) {
      if (this.isDateOutOfRange(iso, this.min(), this.max())) {
        this.setInvalid(true);
      } else {
        this.setInvalid(false);
        this.commitDate(iso, false);
      }
    } else {
      // Incomplete or invalid: do NOT overwrite model ISO, keep user typing
      this.setInvalid(false);
    }
  }

  onTextBlur(): void {
    this.onTouched();
    const raw = this.displayValue().trim();
    if (!raw) {
      this.commitDate('', false);
      this.setInvalid(this.required());
      return;
    }

    const iso = parseDisplayToIso(raw);
    if (!iso || !isValidIsoDate(iso) || this.isDateOutOfRange(iso, this.min(), this.max())) {
      this.setInvalid(true);
    } else {
      this.setInvalid(false);
      this.commitDate(iso, false);
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onTextBlur();
      if (!this.isInvalid()) {
        this.commit.emit(this.value());
      }
    } else if (event.key === 'Escape') {
      this.closePopover();
    }
  }

  onPopoverKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePopover(true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.stepFocusedDay(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.stepFocusedDay(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.stepFocusedDay(-7);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.stepFocusedDay(7);
    } else if (event.key === 'PageUp') {
      event.preventDefault();
      this.prevMonth();
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      this.nextMonth();
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.focusMonthBoundary('start');
    } else if (event.key === 'End') {
      event.preventDefault();
      this.focusMonthBoundary('end');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const cur = this.focusedIso();
      if (cur && isValidIsoDate(cur) && !this.isDateOutOfRange(cur, this.min(), this.max())) {
        this.commitDate(cur, true);
        this.closePopover(true);
      }
    }
  }

  private changeMonth(delta: -1 | 1): void {
    const currentMonthStart = formatPartsToIso({
      year: this.viewYear(),
      month: this.viewMonth(),
      day: 1
    });
    const targetMonthStart = addCalendarDate(currentMonthStart, delta, 'month');
    if (targetMonthStart === currentMonthStart) return;

    const currentFocus = this.focusedIso() || this.value() || getTodayIso();
    const currentParts = parseIsoDateParts(currentFocus);
    const targetParts = parseIsoDateParts(targetMonthStart);
    if (!targetParts) return;

    const targetDay = Math.min(currentParts?.day ?? 1, getDaysInMonth(targetParts.year, targetParts.month));
    const targetIso = formatPartsToIso({
      year: targetParts.year,
      month: targetParts.month,
      day: targetDay
    });
    const focusIso = this.clampToAllowedRange(targetIso);
    if (!focusIso) return;

    const focusParts = parseIsoDateParts(focusIso);
    if (!focusParts) return;
    this.viewYear.set(focusParts.year);
    this.viewMonth.set(focusParts.month);
    this.focusedIso.set(focusIso);
    this.focusDayButton(focusIso);
  }

  private focusMonthBoundary(edge: 'start' | 'end'): void {
    const daysInMonth = getDaysInMonth(this.viewYear(), this.viewMonth());
    const firstDay = edge === 'start' ? 1 : daysInMonth;
    const step = edge === 'start' ? 1 : -1;

    for (let offset = 0; offset < daysInMonth; offset++) {
      const day = firstDay + offset * step;
      const iso = formatPartsToIso({ year: this.viewYear(), month: this.viewMonth(), day });
      if (!this.isDateOutOfRange(iso, this.min(), this.max())) {
        this.focusedIso.set(iso);
        this.focusDayButton(iso);
        return;
      }
    }
  }

  private clampToAllowedRange(iso: string): string | null {
    if (!isValidIsoDate(iso)) return null;

    const minIso = this.min();
    const maxIso = this.max();
    const hasMin = !!minIso && isValidIsoDate(minIso);
    const hasMax = !!maxIso && isValidIsoDate(maxIso);

    if (hasMin && hasMax && compareIsoDates(minIso!, maxIso!) > 0) return null;
    if (hasMin && compareIsoDates(iso, minIso!) < 0) return minIso!;
    if (hasMax && compareIsoDates(iso, maxIso!) > 0) return maxIso!;
    return iso;
  }

  private focusTriggerButton(): void {
    setTimeout(() => {
      const btn = this.elementRef?.nativeElement?.querySelector('button[data-date-picker-trigger]') as HTMLButtonElement | null;
      btn?.focus();
    }, 0);
  }

  private updatePopoverAlignment(): void {
    const requested = this.align();
    const anchorRect = this.elementRef?.nativeElement?.getBoundingClientRect?.();
    const trigger = this.elementRef?.nativeElement?.querySelector('button[data-date-picker-trigger]') as
      | (HTMLElement & { getBoundingClientRect?: () => { left: number; right: number } })
      | null;
    const rect = trigger?.getBoundingClientRect?.();
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    const position = resolveDatePickerPopoverPosition(
      requested,
      anchorRect ? { left: anchorRect.left, right: anchorRect.right } : null,
      rect ? { left: rect.left, right: rect.right } : null,
      viewportWidth
    );
    this.popoverAlign.set(position.alignment);
    this.popoverOffsetX.set(position.offsetX);
  }

  private stepFocusedDay(days: number): void {
    let base = this.focusedIso() || this.value() || getTodayIso();
    if (!isValidIsoDate(base)) base = getTodayIso();
    const nextIso = addCalendarDate(base, days, 'day');
    const focusIso = this.clampToAllowedRange(nextIso);
    if (!focusIso) return;

    this.focusedIso.set(focusIso);

    const parts = parseIsoDateParts(focusIso);
    if (parts && (parts.year !== this.viewYear() || parts.month !== this.viewMonth())) {
      this.viewYear.set(parts.year);
      this.viewMonth.set(parts.month);
    }
    this.focusDayButton(focusIso);
  }

  private focusDayButton(iso: string): void {
    if (!isValidIsoDate(iso)) return;
    setTimeout(() => {
      const btn = this.elementRef?.nativeElement?.querySelector(`button[data-iso="${iso}"]`) as HTMLButtonElement | null;
      btn?.focus();
    }, 0);
  }
}
