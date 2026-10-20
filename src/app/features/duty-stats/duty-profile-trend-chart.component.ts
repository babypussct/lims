import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import type { Chart } from 'chart.js';
import type { DutyProfileMonth } from './duty-personal-analytics';

@Component({
  selector: 'app-duty-profile-trend-chart',
  standalone: true,
  template: `<div class="h-72 min-w-0 overflow-x-auto" role="group" aria-label="Xu hướng trực thực tế so với trung bình phòng và kỳ vọng">
    <div class="h-full" [style.min-width.px]="months().length > 12 ? months().length * 45 : null">
      <canvas #chartCanvas role="img" aria-label="Biểu đồ đường lượt trực hằng tháng: cá nhân, bình quân phòng và kỳ vọng riêng"></canvas>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyProfileTrendChartComponent implements OnDestroy {
  readonly months = input.required<readonly DutyProfileMonth[]>();
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;
  private version = 0;
  private readonly observer: MutationObserver | null;

  constructor() {
    effect(() => {
      this.months();
      this.canvas();
      void this.render();
    });
    if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => void this.render());
      this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    } else this.observer = null;
  }

  ngOnDestroy(): void {
    this.version++;
    this.observer?.disconnect();
    this.chart?.destroy();
  }

  private async render(): Promise<void> {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas) return;
    const version = ++this.version;
    const [{ default: ChartConstructor }] = await Promise.all([import('chart.js/auto')]);
    if (version !== this.version) return;
    this.chart?.destroy();
    const months = this.months();
    const dark = document.documentElement.classList.contains('dark');
    this.chart = new ChartConstructor(canvas, {
      type: 'line',
      data: {
        labels: months.map(month => month.key.slice(5) + '/' + month.key.slice(0, 4)),
        datasets: [
          { label: 'Cá nhân', data: months.map(month => month.actual), borderColor: '#2563eb', backgroundColor: '#2563eb', borderWidth: 2.5, tension: 0.25 },
          { label: 'Bình quân phòng', data: months.map(month => month.teamAverage), borderColor: '#0d9488', backgroundColor: '#0d9488', borderWidth: 1.8, tension: 0.25 },
          { label: 'Kỳ vọng riêng (ước tính)', data: months.map(month => month.expected), borderColor: '#ea580c', backgroundColor: '#ea580c', borderDash: [5, 4], borderWidth: 1.8, tension: 0.25, spanGaps: false },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0, color: dark ? '#cbd5e1' : '#475569' }, grid: { color: dark ? '#334155' : '#e2e8f0' } },
          x: { ticks: { autoSkip: true, maxTicksLimit: 12, color: dark ? '#cbd5e1' : '#475569' }, grid: { display: false } },
        },
        plugins: { legend: { position: 'bottom', labels: { color: dark ? '#cbd5e1' : '#475569', usePointStyle: true, boxWidth: 10 } } },
      },
    });
  }
}
