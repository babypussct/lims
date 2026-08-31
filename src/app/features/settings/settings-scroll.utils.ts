export interface HorizontalScrollMetrics {
  scrollLeft: number;
  scrollWidth: number;
  containerLeft: number;
  containerWidth: number;
  itemLeft: number;
  itemWidth: number;
}

export interface VerticalScrollMetrics {
  scrollTop: number;
  scrollHeight: number;
  containerTop: number;
  containerHeight: number;
  itemTop: number;
  itemHeight: number;
  padding?: number;
}

function clampScroll(value: number, maxScroll: number): number {
  return Math.min(Math.max(0, maxScroll), Math.max(0, value));
}

export function calculateCenteredScrollLeft(metrics: HorizontalScrollMetrics): number {
  const containerCenter = metrics.containerLeft + (metrics.containerWidth / 2);
  const itemCenter = metrics.itemLeft + (metrics.itemWidth / 2);
  const target = metrics.scrollLeft + (itemCenter - containerCenter);
  const maxScroll = metrics.scrollWidth - metrics.containerWidth;
  return clampScroll(target, maxScroll);
}

export function calculateVisibleScrollTop(metrics: VerticalScrollMetrics): number | null {
  const padding = Math.max(0, metrics.padding ?? 16);
  const containerBottom = metrics.containerTop + metrics.containerHeight;
  const itemBottom = metrics.itemTop + metrics.itemHeight;
  const visibleTop = metrics.containerTop + padding;
  const visibleBottom = containerBottom - padding;

  let target: number | null = null;
  if (metrics.itemTop < visibleTop) {
    target = metrics.scrollTop - (visibleTop - metrics.itemTop);
  } else if (itemBottom > visibleBottom) {
    target = metrics.scrollTop + (itemBottom - visibleBottom);
  }

  if (target === null) return null;
  const maxScroll = metrics.scrollHeight - metrics.containerHeight;
  return clampScroll(target, maxScroll);
}
