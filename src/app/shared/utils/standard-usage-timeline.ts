import { UsageLog, ReferenceStandard } from '../../core/models/standard.model';
import { TimelineItem, TimelineMetadataItem, TimelinePill } from '../components/ui/timeline/timeline.model';
import { formatNum, getAvatarUrl } from './utils';

export type UsageAvatarResolver = (uid: string | undefined, name: string) => {
  displayName?: string; style?: string; photoURL?: string | null;
};

export function usageEventTimestamp(log: UsageLog): number | string {
  // Backfilled records retain their business date, separate from their entry date.
  return log.isBackfill ? (log.date || log.timestamp || '') : (log.timestamp ?? log.date);
}

export function buildStandardUsageTimelineItem(
  log: UsageLog, index: number, standard: Partial<ReferenceStandard> | null,
  resolveAvatar: UsageAvatarResolver,
): TimelineItem {
  const options = resolveAvatar(log.userId, log.user);
  const name = log.user?.trim() || options.displayName?.trim() || 'Chưa ghi nhận người sử dụng';
  const unit = log.unit?.trim() || '';
  const validAmount = typeof log.amount_used === 'number' && Number.isFinite(log.amount_used) && log.amount_used >= 0;
  // A normalized unit describes normalized_amount, never the original amount_used.
  const pills: TimelinePill[] = [{
    prefix: 'Lượng dùng:',
    label: validAmount ? `${formatNum(log.amount_used)} ${unit || '(chưa rõ đơn vị)'}`.trim() : 'Chưa ghi nhận',
    variant: validAmount && unit ? 'success' : 'neutral',
  }];
  if (log.isDepleted === true) pills.push({ label: 'Hết chuẩn', variant: 'warning' });
  const metadata: TimelineMetadataItem[] = [];
  const internalId = log.internalId || standard?.internal_id;
  if (internalId) metadata.push({ label: 'Mã chuẩn', value: internalId });
  if (log.requestId) metadata.push({
    label: 'Phiếu', value: log.requestId, routerLink: ['/traceability', log.requestId],
    actionTitle: 'Truy xuất phiếu mượn chất chuẩn',
  });
  if (log.isBackfill) metadata.push({ label: 'Nguồn', value: 'Nhập bù' });
  let actorSubtext: string | undefined;
  if (log.isBackfill) {
    const entrant = resolveAvatar(log.backfilledByUid, log.backfilledByName || '').displayName;
    actorSubtext = `Nhập bù bởi ${log.backfilledByName?.trim() || entrant || 'chưa ghi nhận'}`;
    if (log.backfilledAt) {
      const date = new Date(log.backfilledAt);
      if (!Number.isNaN(date.getTime())) actorSubtext += ` vào ${date.toLocaleString('vi-VN')}`;
    }
  }
  return {
    id: log.id ? `usage:${log.id}` : `usage:embedded:${index}`,
    title: 'Ghi nhận sử dụng', pills, description: log.purpose?.trim() || 'Chưa ghi nhận mục đích sử dụng.',
    timestamp: usageEventTimestamp(log), actorName: name, actorRole: 'Người sử dụng chuẩn',
    actorAvatarUrl: getAvatarUrl(options.displayName || name, options.style, options.photoURL),
    actorFallbackInitials: name.split(/\s+/).slice(-2).map(part => part[0]).join('').toLocaleUpperCase('vi-VN'),
    actorSubtext, icon: log.isDepleted === true ? 'fa-flask-vial' : log.isBackfill ? 'fa-clock-rotate-left' : 'fa-vial',
    status: log.isDepleted === true ? 'warning' : log.isBackfill ? 'primary' : 'info', metadata,
  };
}
