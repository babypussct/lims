/**
 * Opens a URL in a new tab while the current user activation is still active.
 * If a browser or managed-device policy blocks the new tab, navigation falls
 * back to the current tab so the requested action is never lost.
 */
export function openInNewTab(url: string): boolean {
  const newTab = window.open(url, '_blank');

  if (newTab) {
    // Prevent the opened page from gaining access to the LIMS window.
    try {
      newTab.opener = null;
    } catch {
      // Cross-origin browser policies may make WindowProxy properties opaque.
    }
    return true;
  }

  window.location.assign(url);
  return false;
}
