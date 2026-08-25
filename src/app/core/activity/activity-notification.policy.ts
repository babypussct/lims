import type { NotificationChannel, NotificationType } from '../models/notification.model';
import { getActivityActionDefinition } from './activity-event-registry';
import type { ActivityEvent } from './activity-event.model';

export interface ActivityNotificationDecision {
  enabled: boolean;
  type?: NotificationType;
  channels: NotificationChannel[];
  suppressActor: boolean;
}

export function resolveActivityNotificationDecision(action: string): ActivityNotificationDecision {
  const notification = getActivityActionDefinition(action).notification;
  if (!notification || notification.mode === 'NONE') {
    return { enabled: false, channels: [], suppressActor: false };
  }

  return {
    enabled: true,
    type: notification.type,
    channels: [...(notification.defaultChannels || [])],
    suppressActor: notification.suppressActor === true
  };
}

export function shouldSuppressActivityActor(event: Pick<ActivityEvent, 'action' | 'actorUid'>, recipientUid: string): boolean {
  const decision = resolveActivityNotificationDecision(event.action);
  return decision.enabled && decision.suppressActor && Boolean(event.actorUid) && event.actorUid === recipientUid;
}

export function filterActivityNotificationRecipients(
  event: Pick<ActivityEvent, 'action' | 'actorUid'>,
  recipientUids: readonly string[]
): string[] {
  const uniqueRecipients = [...new Set(recipientUids.filter(Boolean))];
  return uniqueRecipients.filter(uid => !shouldSuppressActivityActor(event, uid));
}
