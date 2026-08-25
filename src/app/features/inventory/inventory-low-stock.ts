export function resolveInventoryLowStockThreshold(threshold: unknown): number {
  const value = Number(threshold || 5);
  return Number.isFinite(value) ? value : 5;
}

/**
 * Emit only on the transition from healthy stock to low stock. Remaining
 * below the threshold must not create another alert on every subsequent write.
 */
export function crossedInventoryLowStockThreshold(
  previousStock: number,
  nextStock: number,
  threshold: unknown
): boolean {
  const resolvedThreshold = resolveInventoryLowStockThreshold(threshold);
  return Number.isFinite(previousStock)
    && Number.isFinite(nextStock)
    && previousStock > resolvedThreshold
    && nextStock <= resolvedThreshold;
}
