export type TimelineStatus = 'primary' | 'success' | 'info' | 'warning' | 'danger';

export interface TimelineItemAction {
  label: string;
  icon?: string;
  callback?: () => void;
  routerLink?: string | any[];
  href?: string;
}

export interface TimelineMetadataItem {
  label: string;
  value: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string | number | Date | null | { toDate?: () => Date };
  actorName?: string | null;
  actorRole?: string | null;
  icon: string;
  status: TimelineStatus;
  metadata?: TimelineMetadataItem[];
  action?: TimelineItemAction;
  isCurrent?: boolean;
}
