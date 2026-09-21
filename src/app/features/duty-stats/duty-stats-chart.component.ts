import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import type { Chart, Plugin } from 'chart.js';
import type { DutyPersonStat } from './duty-schedule.model';

@Component({
  selector: 'app-duty-stats-chart',
  standalone: true,
  templateUrl: './duty-stats-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyStatsChartComponent implements OnDestroy {
  readonly stats = input.required<readonly DutyPersonStat[]>();
  readonly rangeLabel = input('');
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;
  private renderVersion = 0;
  private readonly themeObserver: MutationObserver | null;

  constructor() {
    effect(() => {
      this.stats();
      this.canvas();
      void this.render();
    });

    if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
      this.themeObserver = new MutationObserver(() => void this.render());
      this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    } else {
      this.themeObserver = null;
    }
  }

  ngOnDestroy(): void {
    this.renderVersion += 1;
    this.themeObserver?.disconnect();
    this.chart?.destroy();
  }

  private async render(): Promise<void> {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas) return;
    const version = ++this.renderVersion;
    const [{ default: ChartConstructor }] = await Promise.all([import('chart.js/auto')]);
    if (version !== this.renderVersion) return;

    this.chart?.destroy();
    const stats = this.stats();
    const dark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const textColor = dark ? '#cbd5e1' : '#475569';
    const gridColor = dark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(100, 116, 139, 0.16)';
    const leadCounts = stats.map(item => item.leadCount);
    const leadLabelPlugin: Plugin<'bar'> = {
      id: 'dutyLeadLabels',
      afterDatasetsDraw: chart => {
        const meta = chart.getDatasetMeta(0);
        const yScale = chart.scales['y'];
        if (!yScale) return;
        const ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = dark ? '#fbbf24' : '#b45309';
        ctx.font = '600 10px system-ui, sans-serif';
        ctx.textAlign = 'center';
        stats.forEach((item, index) => {
          if (!item.leadCount) return;
          const element = meta.data[index];
          if (!element) return;
          const { x } = element.getProps(['x'], true) as { x: number };
          const y = yScale.getPixelForValue(item.total) - 8;
          ctx.fillText(`★ ${item.leadCount}`, x, y);
        });
        ctx.restore();
      },
    };

    this.chart = new ChartConstructor(canvas, {
      type: 'bar',
      data: {
        labels: stats.map(item => item.displayName),
        datasets: [
          {
            label: 'Ngày thường',
            data: stats.map(item => item.weekdayCount),
            backgroundColor: dark ? 'rgba(96, 165, 250, 0.72)' : 'rgba(37, 99, 235, 0.78)',
            borderRadius: 5,
            stack: 'assignments',
          },
          {
            label: 'Cuối tuần',
            data: stats.map(item => item.weekendCount),
            backgroundColor: dark ? 'rgba(251, 146, 60, 0.78)' : 'rgba(234, 88, 12, 0.78)',
            borderRadius: 5,
            stack: 'assignments',
          },
          {
            type: 'line',
            label: 'Mức kỳ vọng',
            data: stats.map(item => item.expectedAssignments),
            borderColor: dark ? '#94a3b8' : '#64748b',
            borderDash: [6, 5],
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 22 } },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, boxWidth: 12, boxHeight: 12, usePointStyle: true },
          },
          tooltip: {
            callbacks: {
              footer: items => items.length ? `★ Chủ trì: ${leadCounts[items[0].dataIndex] ?? 0}` : '',
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { color: textColor, maxRotation: 55, minRotation: 0, autoSkip: false },
            grid: { display: false },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { color: textColor, precision: 0 },
            grid: { color: gridColor },
          },
        },
      },
      plugins: [leadLabelPlugin],
    });
  }
}
