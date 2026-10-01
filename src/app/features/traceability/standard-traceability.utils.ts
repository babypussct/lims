import { Log } from '../../core/models/log.model';
import { UsageLog } from '../../core/models/standard.model';
import { TimelineItem } from '../../shared/components/ui/timeline/timeline.model';
import { buildStandardUsageTimelineItem, UsageAvatarResolver } from '../../shared/utils/standard-usage-timeline';
import { getActivityActionLabel } from '../../core/activity/activity-feed.utils';
import { isRegisteredActivityAction } from '../../core/activity/activity-event-registry';
import { formatNum, getAvatarUrl } from '../../shared/utils/utils';
import { readStandardText, standardDateText, standardText } from '../standards/standard-detail.utils';
import { StandardTraceRecord } from './traceability-data.service';

export function standardTraceTitle(record: StandardTraceRecord): string {
  return [record.request?.standardName, record.usage?.standardName, record.standard?.name]
    .map(readStandardText).find(Boolean) || 'Chất chuẩn đối chiếu';
}

export function traceTimestamp(value: unknown): number {
  if (value && typeof (value as { toDate?: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().getTime();
  }
  const date = new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function mergeStandardUsages(embedded: UsageLog[], loaded: UsageLog[]): UsageLog[] {
  const identified = new Map<string, UsageLog>();
  const anonymous: UsageLog[] = [];
  // The canonical journal overrides an embedded snapshot, including rollbacks.
  for (const log of [...embedded, ...loaded]) {
    if (log.id) identified.set(log.id, log);
    else anonymous.push(log);
  }
  return [...identified.values(), ...anonymous].filter(log => !log._isDeleted);
}

export function buildStandardTraceTimeline(
  record: StandardTraceRecord, usages: UsageLog[], events: Log[], resolveAvatar: UsageAvatarResolver,
): TimelineItem[] {
  const items = usages.map((usage, index) => buildStandardUsageTimelineItem(usage, index, record.standard, resolveAvatar));
  const byUsageId = new Map(usages.map((usage, index) => [usage.id, items[index]]).filter(([id]) => !!id) as [string, TimelineItem][]);
  const actions = new Set(events.map(event => event.action));
  const distinctEvents = new Map(events.map(event => [event.id, event]));
  for (const event of distinctEvents.values()) {
    const data = event as Log & { actorName?: string; actorUid?: string };
    const usageId = event.metadata?.['usageLogId'];
    const usageItem = typeof usageId === 'string' ? byUsageId.get(usageId) : undefined;
    if (usageItem && ['LOG_USAGE_STANDARD', 'BACKFILL_USAGE_LOG'].includes(event.action)) {
      usageItem.metadata = [...(usageItem.metadata || []), { label: 'Nhật ký kiểm toán', value: event.id }];
      if (data.actorName && data.actorName !== usageItem.actorName && !usageItem.actorSubtext) {
        usageItem.actorSubtext = `Ghi nhận bởi ${data.actorName}`;
      }
      continue;
    }
    const name = data.actorName || event.user || '';
    const avatar = resolveAvatar(data.actorUid, name);
    const danger = /REJECT|DELETE|ROLLBACK|CANCEL/.test(event.action);
    items.push({
      id: `audit:${event.id}`,
      title: isRegisteredActivityAction(event.action) ? getActivityActionLabel(event.action) : event.action,
      description: event.details, timestamp: event.timestamp, actorName: name,
      actorRole: 'Người thực hiện thao tác', actorAvatarUrl: getAvatarUrl(avatar.displayName || name, avatar.style, avatar.photoURL),
      actorFallbackInitials: (name || 'LIMS').split(/\s+/).slice(-2).map(part => part[0]).join(''),
      icon: danger ? 'fa-triangle-exclamation' : /RETURN/.test(event.action) ? 'fa-box-archive' : 'fa-clipboard-check',
      status: danger ? 'danger' : /APPROVE|RETURN/.test(event.action) ? 'success' : 'info',
      metadata: [{ label: 'Nhật ký kiểm toán', value: event.id }],
    });
  }
  const req = record.request;
  if (req) {
    const fallback = (key: string, action: string, title: string, timestamp: number | undefined, name: string | undefined, uid: string | undefined) => {
      if (!timestamp || actions.has(action)) return;
      const avatar = resolveAvatar(uid, name || '');
      items.push({ id: `request:${req.id}:${key}`, title, timestamp, actorName: name || 'Chưa ghi nhận người thực hiện',
        actorAvatarUrl: getAvatarUrl(avatar.displayName || name || '', avatar.style, avatar.photoURL),
        actorFallbackInitials: (name || 'LIMS').split(/\s+/).slice(-2).map(part => part[0]).join(''),
        icon: 'fa-file-lines', status: 'info', metadata: [{ label: 'Nguồn', value: 'Dữ liệu phiếu mượn' }],
      });
    };
    if (req.isBackfill) {
      fallback('backfill', 'BACKFILL_USAGE_LOG', 'Nhập hồ sơ sử dụng lịch sử', req.backfilledAt, req.backfilledByName, req.backfilledByUid);
    } else {
      if (!actions.has('ASSIGN_STANDARD')) {
        fallback('request', 'REQUEST_STANDARD', 'Gửi yêu cầu mượn chất chuẩn', req.requestDate, req.requestedByName, req.requestedBy);
        fallback('approval', 'APPROVE_STANDARD_REQUEST', 'Phê duyệt phiếu mượn', req.approvalDate, req.approvedByName, req.approvedBy);
      }
      // A return timestamp alone does not identify who received the stock.
      fallback('return', 'RETURN_STANDARD', req.receivedBy ? 'Nhận lại chất chuẩn' : 'Ghi nhận trả chất chuẩn', req.returnDate,
        req.receivedByName || req.requestedByName, req.receivedBy || req.requestedBy);
    }
  }
  return items.sort((a, b) => traceTimestamp(b.timestamp) - traceTimestamp(a.timestamp));
}

function amountText(value: unknown, unit: string): string {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? `${formatNum(value)} ${unit || '(chưa rõ đơn vị)'}`.trim() : 'Chưa ghi nhận';
}

export function standardTraceSummary(record: StandardTraceRecord): { label: string; value: string }[] {
  const req = record.request;
  const usage = record.usage;
  const std = record.standard;
  // A partial journal cannot establish the unit of a request's aggregate.
  const unit = std?.unit?.trim() || '';
  const rows = [
    { label: 'Tên chất chuẩn', value: standardText(req?.standardName || usage?.standardName || std?.name) },
    { label: 'Mã nội bộ tại thời điểm ghi nhận', value: standardText(req?.internalId || usage?.internalId) },
    { label: 'Số lô', value: standardText(req?.lotNumber || usage?.lotNumber) },
    { label: 'Hạn dùng trong hồ sơ kho hiện tại', value: std ? standardDateText(std.expiry_date) : 'Chưa đọc được hồ sơ kho' },
    { label: 'Người mượn', value: standardText(req?.requestedByName) },
    { label: 'Người duyệt', value: standardText(req?.approvedByName) },
    { label: 'Ngày mượn', value: req?.requestDate && traceTimestamp(req.requestDate) ? new Date(req.requestDate).toLocaleString('vi-VN') : 'Chưa ghi nhận' },
    { label: 'Lượng đăng ký', value: amountText(req?.expectedAmount, unit) },
    { label: 'Tổng lượng đã dùng theo phiếu', value: amountText(req?.totalAmountUsed, unit) },
    { label: 'Mục đích', value: standardText(req?.purpose || usage?.purpose) },
  ];
  if (req?.confirmedAmountUsed !== undefined) rows.push({ label: 'Lượng đã xác nhận', value: amountText(req.confirmedAmountUsed, req.confirmedUnit || '') });
  if (usage) rows.push({ label: 'Người sử dụng trong nhật ký', value: standardText(usage.user) },
    { label: 'Lượng dùng của lần này', value: amountText(usage.amount_used, usage.unit || '') });
  return rows;
}
