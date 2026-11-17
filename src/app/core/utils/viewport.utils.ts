export const MOBILE_VIEWPORT_MAX_WIDTH = 767;

/**
 * Safely detects whether the current browser viewport matches a narrow/mobile
 * breakpoint once on initialization. Safe under SSR/Node test execution.
 */
export function isMobileViewport(maxWidth = MOBILE_VIEWPORT_MAX_WIDTH): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
  }
  return typeof window.innerWidth === 'number' ? window.innerWidth <= maxWidth : false;
}

/**
 * Detects devices where coarse touch input is primary and hover is unavailable.
 */
export function isCoarsePointerDevice(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}
