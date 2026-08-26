import type { MonthlyStatsDoc } from '../../core/services/stats.service';
import type { Log, PrintData } from '../../core/models/log.model';
import type { Request, RequestItem } from '../../core/models/request.model';
import {
  createInclusiveDateRange,
  enumerateInclusiveDates,
  getDateBoundsFromMonthlyStats,
  type InclusiveDateRange,
  toLocalDateKey
} from '../../shared/utils/date-range';
import { timestampToDate, timestampToMillis } from '../../shared/utils/timestamp';

export type StatisticsMonthlyStats = Record<string, MonthlyStatsDoc>;

export interface SopFrequencyReportItem {
  name: string;
  count: number;
  samples: number;
  qcs: number;
  percent: number;
}

export interface NxtMovementTotals {
  inPeriodImport: number;
  inPeriodExport: number;
  futureNetChange: number;
}

export interface ReportSopOption {
  id: string;
  name: string;
}

export interface ReportSopOptionRequest {
  sopId?: string;
  sopName?: string;
}

export interface ReportSopOptionOperational {
  id: string;
  name: string;
}

export interface ReportConsumptionItem {
  name: string;
  displayName: string;
  amount: number;
  unit: string;
}

const RESULT_APPROVAL_ACTIONS = new Set(['DIRECT_APPROVE', 'DIRECT_APPROVE_PLAN', 'APPROVE_REQUEST']);

export function getReportRequestDate(request: Pick<Request, 'analysisDate' | 'approvedAt' | 'timestamp'>): Date | null {
  if (typeof request.analysisDate === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(request.analysisDate);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day
      ) {
        return date;
      }
    }
  }
  return timestampToDate(request.approvedAt ?? request.timestamp);
}

export function matchesReportSop(
  record: {
    sopId?: unknown;
    sopName?: unknown;
    metadata?: Record<string, unknown>;
    printData?: PrintData;
  },
  selectedSopId: string,
  selectedSopName = '',
  resolvedPrintData?: PrintData
): boolean {
  if (selectedSopId === 'all') return true;

  const printData = resolvedPrintData || record.printData;
  const ids = [record.sopId, record.metadata?.['sopId'], printData?.sop?.id]
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
  if (ids.includes(selectedSopId)) return true;

  if (!selectedSopName || selectedSopName === 'Tất cả') return false;
  const names = [record.sopName, record.metadata?.['sopName'], printData?.sop?.name]
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
  return names.includes(selectedSopName);
}

export function filterReportRequests<T extends Request>(
  requests: readonly T[],
  range: InclusiveDateRange,
  selectedSopId = 'all',
  selectedSopName = '',
  specificDay?: number
): T[] {
  return requests.filter(request => {
    const date = getReportRequestDate(request);
    if (!date || date < range.start || date > range.end) return false;
    if (!matchesReportSop(request, selectedSopId, selectedSopName)) return false;
    if (specificDay !== undefined && date.getDate() !== specificDay) return false;
    return true;
  });
}

export function aggregateReportConsumption(
  requests: readonly Request[],
  amountResolver: (item: RequestItem, request: Request) => number = item => item.amount
): ReportConsumptionItem[] {
  const totals = new Map<string, Omit<ReportConsumptionItem, 'name'>>();

  for (const request of requests) {
    for (const item of request.items || []) {
      const amount = amountResolver(item, request);
      if (!Number.isFinite(amount)) continue;
      const current = totals.get(item.name) || {
        amount: 0,
        unit: item.stockUnit || item.unit,
        displayName: item.displayName || item.name
      };
      totals.set(item.name, {
        amount: current.amount + amount,
        unit: current.unit,
        displayName: item.displayName || current.displayName || item.name
      });
    }
  }

  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, ...value }))
    .sort((a, b) => b.amount - a.amount);
}

export function enrichReportLogsWithPrintData(
  logs: readonly Log[],
  printDataByLog: ReadonlyMap<string, PrintData>
): Log[] {
  return logs.map(log => {
    const printData = printDataByLog.get(log.id);
    return printData && log.printData !== printData ? { ...log, printData } : log;
  });
}

function addInventoryDelta(target: Record<string, number>, id: string, value: number): void {
  if (!id || !Number.isFinite(value) || value === 0) return;
  target[id] = (target[id] || 0) + value;
}

function normalizedInventoryDeltas(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: Record<string, number> = {};
  for (const [id, rawDelta] of Object.entries(value as Record<string, unknown>)) {
    if (typeof rawDelta === 'number') addInventoryDelta(result, id, rawDelta);
  }
  return result;
}

function metadataNumber(log: Log, key: string): number | null {
  const value = log.metadata?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function deltasFromPrintData(printData: PrintData | undefined): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of printData?.items || []) {
    if (item.isComposite && item.breakdown) {
      for (const sub of item.breakdown) addInventoryDelta(result, sub.name, -(sub.totalNeed || 0));
    } else {
      addInventoryDelta(result, item.name, -(item.stockNeed || 0));
    }
  }
  return result;
}

/**
 * Resolve the stock effect of one audit event. Canonical immutable deltas win;
 * all other branches are compatibility fallbacks for historical events.
 */
export function resolveNxtInventoryDeltas(log: Log, printData?: PrintData): Record<string, number> {
  const canonical = normalizedInventoryDeltas(log.inventoryDeltas);
  if (Object.keys(canonical).length > 0) return canonical;

  const targetId = log.targetId || '';
  const oldValue = metadataNumber(log, 'oldValue');
  const newValue = metadataNumber(log, 'newValue');

  if (targetId && oldValue !== null && newValue !== null) {
    addInventoryDelta(canonical, targetId, newValue - oldValue);
    return canonical;
  }

  if (log.action === 'CREATE_ITEM' && targetId && newValue !== null) {
    addInventoryDelta(canonical, targetId, newValue);
    return canonical;
  }

  if (log.action === 'STOCK_IN' || log.action === 'STOCK_OUT') {
    const match = log.details?.match(/:\s*([+-]?\d+(?:\.\d+)?)/);
    if (match && targetId) addInventoryDelta(canonical, targetId, Number(match[1]));
    return canonical;
  }

  if (log.action === 'CREATE_ITEM') {
    const match = log.details?.match(/\(([-+]?\d+(?:\.\d+)?)/);
    if (match && targetId) addInventoryDelta(canonical, targetId, Number(match[1]));
    return canonical;
  }

  if (log.action === 'UPDATE_INFO') {
    const match = log.details?.match(/Tồn kho:\s*([-+]?\d+(?:\.\d+)?)\s*->\s*([-+]?\d+(?:\.\d+)?)/);
    if (match && targetId) addInventoryDelta(canonical, targetId, Number(match[2]) - Number(match[1]));
    return canonical;
  }

  if (log.action === 'DELETE_ITEM' && targetId && typeof log.finalStock === 'number') {
    addInventoryDelta(canonical, targetId, -log.finalStock);
    return canonical;
  }

  if (RESULT_APPROVAL_ACTIONS.has(log.action)) {
    return deltasFromPrintData(printData || log.printData);
  }

  return canonical;
}

export function needsLegacyNxtPrintData(log: Log): boolean {
  return RESULT_APPROVAL_ACTIONS.has(log.action)
    && Object.keys(normalizedInventoryDeltas(log.inventoryDeltas)).length === 0;
}

/**
 * Approval events without canonical inventory deltas must have an immutable
 * print snapshot available somewhere. Treat any missing snapshot as an
 * incomplete historical dataset, including very old rows that predate the
 * split-storage printJobId field entirely.
 */
export function findUnresolvedLegacyNxtApprovalLogs(
  logs: readonly Log[],
  printDataByLog: ReadonlyMap<string, PrintData>
): Log[] {
  return logs.filter(log =>
    needsLegacyNxtPrintData(log)
    && !log.printData
    && !printDataByLog.has(log.id)
  );
}

export function resolveNxtSopId(log: Log, printData?: PrintData): string {
  const metadataSopId = log.metadata?.['sopId'];
  if (typeof metadataSopId === 'string' && metadataSopId) return metadataSopId;
  const legacySopId = (log as Log & { sopId?: unknown }).sopId;
  if (typeof legacySopId === 'string' && legacySopId) return legacySopId;
  return printData?.sop?.id || log.printData?.sop?.id || '';
}

export function aggregateNxtMovements(
  logs: readonly Log[],
  printDataByLog: ReadonlyMap<string, PrintData>,
  startTime: number,
  endTime: number,
  sopId = 'all'
): Map<string, NxtMovementTotals> {
  const movements = new Map<string, NxtMovementTotals>();

  for (const log of logs) {
    const logTime = timestampToMillis(log.timestamp);
    if (logTime === null || logTime < startTime) continue;

    const printData = printDataByLog.get(log.id) || log.printData;
    if (sopId !== 'all') {
      if (logTime > endTime || resolveNxtSopId(log, printData) !== sopId) continue;
    }

    const deltas = resolveNxtInventoryDeltas(log, printData);
    for (const [id, delta] of Object.entries(deltas)) {
      const entry = movements.get(id) || { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 };

      if (sopId !== 'all') {
        // The SOP-specific view is explicitly a gross export/consumption view.
        // Returns and reversals are stock imports, not additional exports.
        if (delta < 0) entry.inPeriodExport += Math.abs(delta);
      } else if (logTime > endTime) {
        entry.futureNetChange += delta;
      } else if (delta > 0) {
        entry.inPeriodImport += delta;
      } else if (delta < 0) {
        entry.inPeriodExport += Math.abs(delta);
      }

      movements.set(id, entry);
    }
  }

  return movements;
}

export function resolveStatisticsDateRange(
  startKey: string,
  endKey: string,
  stats: StatisticsMonthlyStats,
  fallbackKey: string
): InclusiveDateRange {
  const explicitRange = createInclusiveDateRange(startKey, endKey);
  if (explicitRange) return explicitRange;

  if (!startKey && !endKey) {
    const bounds = getDateBoundsFromMonthlyStats(stats);
    if (bounds) {
      const allTimeRange = createInclusiveDateRange(bounds.start, bounds.end);
      if (allTimeRange) return allTimeRange;
    }
  }

  return createInclusiveDateRange(fallbackKey, fallbackKey)!;
}

export function getMonthKeysForStatisticsRange(range: InclusiveDateRange): string[] {
  const keys: string[] = [];
  const cursor = new Date(range.start.getFullYear(), range.start.getMonth(), 1);
  const endMonth = new Date(range.end.getFullYear(), range.end.getMonth(), 1);

  while (cursor <= endMonth) {
    keys.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return keys;
}

/**
 * Build the report SOP selector without requiring access to full SOP documents.
 * Current operational SOP names win when available, while historical request/log
 * snapshots keep archived or deleted SOPs selectable for older report ranges.
 * Monthly stats only contain the display key, so they are used as a final
 * name-only fallback when no stable id can be recovered from historical data.
 */
export function buildReportSopOptions(
  operationalSops: readonly ReportSopOptionOperational[],
  requests: readonly ReportSopOptionRequest[],
  logs: readonly Log[],
  stats: StatisticsMonthlyStats,
  range: InclusiveDateRange
): ReportSopOption[] {
  const byId = new Map<string, ReportSopOption>();
  const idByName = new Map<string, string>();
  const statsOnlyFallbackIds = new Set<string>();

  const add = (idValue: unknown, nameValue: unknown, preferName = false) => {
    const id = typeof idValue === 'string' ? idValue.trim() : '';
    const name = typeof nameValue === 'string' ? nameValue.trim() : '';
    if (!id && !name) return;

    const resolvedId = id || name;
    const resolvedName = name || id;
    const existing = byId.get(resolvedId);
    if (!existing) {
      byId.set(resolvedId, { id: resolvedId, name: resolvedName });
    } else if (preferName && name && existing.name !== name) {
      byId.set(resolvedId, { id: resolvedId, name });
    }
    if (resolvedName) idByName.set(resolvedName, resolvedId);
  };

  for (const sop of operationalSops) add(sop.id, sop.name, true);

  // approvedRequests is sorted newest-first by StateService, so the first
  // historical snapshot for a missing SOP id is the newest available label.
  for (const request of requests) add(request.sopId, request.sopName);

  for (const log of logs) {
    const legacySopId = (log as Log & { sopId?: unknown }).sopId;
    const metadataSopId = log.metadata?.['sopId'];
    const printSop = log.printData?.sop;
    add(
      typeof metadataSopId === 'string' && metadataSopId
        ? metadataSopId
        : typeof legacySopId === 'string'
          ? legacySopId
          : printSop?.id,
      printSop?.name
    );
  }

  for (const date of enumerateInclusiveDates(range)) {
    const dayKey = toLocalDateKey(date);
    const monthKey = dayKey.slice(0, 7);
    for (const sopKey of Object.keys(stats[monthKey]?.[dayKey]?.sops || {})) {
      const knownId = idByName.get(sopKey);
      if (!knownId && !byId.has(sopKey)) statsOnlyFallbackIds.add(sopKey);
      add(knownId || sopKey, sopKey);
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    const fallbackRank = Number(statsOnlyFallbackIds.has(a.id)) - Number(statsOnlyFallbackIds.has(b.id));
    return fallbackRank || a.name.localeCompare(b.name, 'vi');
  });
}

export function aggregateSopFrequency(
  stats: StatisticsMonthlyStats,
  range: InclusiveDateRange,
  sopIdFilter = 'all',
  selectedSopName = ''
): SopFrequencyReportItem[] {
  const totals = new Map<string, { count: number; samples: number; qcs: number }>();
  let totalBatches = 0;

  for (const date of enumerateInclusiveDates(range)) {
    const dayKey = toLocalDateKey(date);
    const monthKey = dayKey.slice(0, 7);
    const dayStats = stats[monthKey]?.[dayKey];
    if (!dayStats) continue;

    for (const [sopKey, sopStats] of Object.entries(dayStats.sops || {})) {
      if (
        sopIdFilter !== 'all'
        && sopKey !== sopIdFilter
        && sopKey !== selectedSopName
      ) {
        continue;
      }

      const current = totals.get(sopKey) || { count: 0, samples: 0, qcs: 0 };
      totals.set(sopKey, {
        count: current.count + sopStats.batches,
        samples: current.samples + sopStats.samples,
        qcs: current.qcs + (sopStats.qcs || 0)
      });
      totalBatches += sopStats.batches;
    }
  }

  if (totalBatches === 0) return [];

  return Array.from(totals.entries())
    .map(([name, value]) => ({
      name,
      count: value.count,
      samples: value.samples,
      qcs: value.qcs,
      percent: (value.count / totalBatches) * 100
    }))
    .sort((a, b) => b.count - a.count);
}
