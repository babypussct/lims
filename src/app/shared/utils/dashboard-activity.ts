export type DashboardActivityCategory = 'ALL' | 'SOP' | 'STOCK' | 'STANDARD' | 'APPROVE' | 'SYSTEM';

export interface DashboardActivityLog {
  action: string;
  user: string;
  details?: string;
}

const STANDARD_ACTIONS = new Set([
  'BACKFILL_USAGE_LOG',
  'DELETE_USAGE_LOG'
]);

export function isStandardActivityAction(action: string): boolean {
  return action.includes('STANDARD') || action.includes('COA') || STANDARD_ACTIONS.has(action);
}

export function isSopActivityAction(action: string): boolean {
  return action.includes('RESULT')
    || action === 'PUBLISH_RESULT_REPORT'
    || action === 'CREATE_VIRTUAL_MASTER'
    || action === 'EDIT_REQUEST'
    || action === 'DIRECT_APPROVE'
    || action === 'APPROVE_REQUEST';
}

export function matchesDashboardActivityCategory(
  action: string,
  category: DashboardActivityCategory
): boolean {
  if (category === 'ALL') return true;
  if (category === 'APPROVE') {
    return action.includes('APPROVE') && !action.includes('STANDARD') && !action.includes('RESULT');
  }
  if (category === 'STOCK') return action.includes('STOCK');
  if (category === 'STANDARD') return isStandardActivityAction(action);
  if (category === 'SOP') return isSopActivityAction(action);
  return !action.includes('APPROVE')
    && !action.includes('STOCK')
    && !isStandardActivityAction(action)
    && !isSopActivityAction(action);
}

/**
 * Search and category filtering must happen before the display limit so a busy
 * SOP feed cannot hide older standard activity.
 */
export function filterDashboardActivityLogs<T extends DashboardActivityLog>(
  logs: readonly T[],
  searchTerm: string,
  category: DashboardActivityCategory,
  getActionText: (action: string) => string,
  maxItems = 50
): T[] {
  const term = searchTerm.toLowerCase().trim();
  return logs
    .filter(log => !term
      || (log.user || '').toLowerCase().includes(term)
      || (log.details || '').toLowerCase().includes(term)
      || getActionText(log.action).toLowerCase().includes(term))
    .filter(log => matchesDashboardActivityCategory(log.action, category))
    .slice(0, maxItems);
}
