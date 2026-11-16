import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RecoveryCheckEntry {
  id: string;
  label: string;
  spikeConc: unknown;
  blankConc?: unknown;
  addedConc: number;
  unit?: string;
  minPercent?: number;
  maxPercent?: number;
}

export interface EvaluatedRecoveryEntry {
  id: string;
  label: string;
  percent: number | null;
  status: 'unassessed' | 'pass' | 'fail' | 'calculated';
  statusLabel: string;
  detailText: string;
  rangeLabel: string | null;
}

function parseOptionalNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  if (upper === 'ND' || upper === 'KPH' || upper === 'N/A' || upper === '-' || upper === '—') {
    return null;
  }
  const normalized = trimmed.includes(',') && !trimmed.includes('.')
    ? trimmed.replace(',', '.')
    : trimmed.replace(/,/g, '');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

/**
 * Compute recovery H% = ((C_spike - C_blank) / C_added) * 100.
 * Guards against division by zero / non-positive C_added and non-numeric spike inputs.
 */
export function computeSpikeRecoveryPercent(args: {
  spikeConc: unknown;
  blankConc?: unknown;
  addedConc: number;
}): number | null {
  const { spikeConc, blankConc, addedConc } = args;
  if (!Number.isFinite(addedConc) || addedConc <= 0) return null;
  const spikeVal = parseOptionalNumber(spikeConc);
  if (spikeVal === null) return null;
  const blankVal = parseOptionalNumber(blankConc) ?? 0;
  const pct = ((spikeVal - blankVal) / addedConc) * 100;
  if (!Number.isFinite(pct)) return null;
  return Number(pct.toFixed(1));
}

export function evaluateRecoveryEntry(entry: RecoveryCheckEntry): EvaluatedRecoveryEntry {
  const percent = computeSpikeRecoveryPercent({
    spikeConc: entry.spikeConc,
    blankConc: entry.blankConc,
    addedConc: entry.addedConc,
  });

  const hasRange = entry.minPercent !== undefined && entry.maxPercent !== undefined;
  const rangeLabel = hasRange ? `${entry.minPercent}% – ${entry.maxPercent}%` : null;

  if (percent === null) {
    return {
      id: entry.id,
      label: entry.label,
      percent: null,
      status: 'unassessed',
      statusLabel: 'Chưa đánh giá',
      detailText: entry.addedConc <= 0 ? 'Thiếu nồng độ thêm chuẩn (> 0)' : 'Chưa có nồng độ spike hợp lệ',
      rangeLabel,
    };
  }

  if (!hasRange) {
    return {
      id: entry.id,
      label: entry.label,
      percent,
      status: 'calculated',
      statusLabel: 'Đã tính',
      detailText: `C_spike = ${entry.spikeConc}${entry.unit ? ' ' + entry.unit : ''}`,
      rangeLabel: null,
    };
  }

  const inRange = percent >= entry.minPercent! && percent <= entry.maxPercent!;
  return {
    id: entry.id,
    label: entry.label,
    percent,
    status: inRange ? 'pass' : 'fail',
    statusLabel: inRange ? 'Đạt' : 'Không đạt',
    detailText: inRange ? `Trong ngưỡng (${rangeLabel})` : `Ngoài ngưỡng (${rangeLabel})`,
    rangeLabel,
  };
}

@Component({
  selector: 'app-sop-recovery-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (entries.length > 0) {
      <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-percent text-xs text-indigo-600 dark:text-indigo-400" aria-hidden="true"></i>
            <h5 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 m-0">
              {{ title }}
            </h5>
          </div>
          @if (showFormula) {
            <span class="rounded-lg border border-indigo-200/70 dark:border-indigo-900/40 bg-indigo-50/70 dark:bg-indigo-950/30 px-2.5 py-1 font-mono text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
              H% = (C_spike - C_nền) / C_thêm × 100
            </span>
          }
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          @for (item of evaluatedEntries(); track item.id) {
            <div class="rounded-xl border px-3 py-2.5 transition"
                 [class]="item.status === 'pass'
                   ? 'border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20'
                   : (item.status === 'fail'
                     ? 'border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20'
                     : (item.status === 'calculated'
                       ? 'border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20'
                       : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60'))">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ item.label }}</span>
                <span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      [class]="item.status === 'pass'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                        : (item.status === 'fail'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                          : (item.status === 'calculated'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'))">
                  {{ item.statusLabel }}
                </span>
              </div>
              <div class="mt-1 flex items-baseline justify-between gap-2">
                <span class="font-mono text-sm font-bold"
                      [class]="item.percent !== null ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'">
                  {{ item.percent !== null ? item.percent.toFixed(1) + '%' : '—' }}
                </span>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 truncate">{{ item.detailText }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class SopRecoverySectionComponent {
  @Input() title = 'Đánh giá độ thu hồi QC (Spike)';
  @Input() entries: RecoveryCheckEntry[] = [];
  @Input() showFormula = false;

  evaluatedEntries(): EvaluatedRecoveryEntry[] {
    return (this.entries || []).map(evaluateRecoveryEntry);
  }
}
