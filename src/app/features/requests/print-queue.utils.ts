import type { Log } from '../../core/models/log.model';
import type { PrintJob } from '../../core/services/print.service';
import { timestampToDate } from '../../shared/utils/timestamp';

export class IncompletePrintDataError extends Error {
  constructor(readonly logIds: readonly string[]) {
    super(`Không tải đủ dữ liệu của ${logIds.length} phiếu: ${logIds.join(', ')}. Vui lòng thử lại.`);
    this.name = 'IncompletePrintDataError';
  }
}

function isPrintData(value: unknown): value is Omit<PrintJob, 'date'> {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return !!data['sop'] && typeof data['sop'] === 'object'
    && !!data['inputs'] && typeof data['inputs'] === 'object'
    && Array.isArray(data['items']);
}

/** Return every selected slip in display order, or fail without a partial result. */
export async function loadOrderedPrintJobs(
  logs: readonly Log[],
  fetchChunk: (ids: readonly string[]) => Promise<ReadonlyMap<string, unknown>>,
): Promise<PrintJob[]> {
  const ids = [...new Set(logs.filter(log => !isPrintData(log.printData) && log.printJobId)
    .map(log => log.printJobId!))];
  const fetched = new Map<string, unknown>();
  for (let offset = 0; offset < ids.length; offset += 30) {
    const chunk = ids.slice(offset, offset + 30);
    try {
      for (const [id, data] of await fetchChunk(chunk)) fetched.set(id, data);
    } catch {
      // Resolve all missing log IDs below; no partial preview is returned.
    }
  }

  const jobs: PrintJob[] = [];
  const missing: string[] = [];
  for (const log of logs) {
    const data = isPrintData(log.printData) ? log.printData : fetched.get(log.printJobId || '');
    if (!isPrintData(data)) {
      missing.push(log.id);
      continue;
    }
    jobs.push({
      ...data,
      date: timestampToDate(log.timestamp) ?? '',
      user: log.user,
      requestId: log.requestId || data.requestId || log.id,
      batchCode: data.inputs['batchCode'] || log.requestId || data.requestId || '',
    });
  }
  if (missing.length) throw new IncompletePrintDataError(missing);
  return jobs;
}
