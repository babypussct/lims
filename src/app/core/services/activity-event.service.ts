import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type DocumentReference,
  type Transaction,
  type WriteBatch
} from 'firebase/firestore';
import type { ActivityEvent } from '../activity/activity-event.model';
import {
  canBePublicTraceableActivityAction,
  getActivityActionDefinition,
  resolveDefaultActivityActionUrl
} from '../activity/activity-event-registry';
import { sanitizeActivityDetails, sanitizeActivityMetadata } from '../activity/activity-event.sanitize';
import { sanitizeForFirebase } from '../../shared/utils/utils';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

export type ActivityEventRecord = ActivityEvent & Record<string, unknown>;

export interface ActivityEventBuildInput {
  action: string;
  details: string;
  eventId?: string;
  actorUid?: string;
  actorName?: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  requestId?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  timestamp?: unknown;
  lastUpdated?: unknown;
  publicTraceable?: boolean;
  printable?: boolean;
  printJobId?: string;
  /**
   * Top-level compatibility fields required by legacy readers during rollout
   * (for example printData, sopBasicInfo, reason, diff, finalStock).
   * Canonical V2 fields always win if a key collides.
   */
  legacyFields?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class ActivityEventService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);

  createRef(eventId?: string): DocumentReference<DocumentData> {
    const logs = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs');
    if (eventId === undefined) return doc(logs);
    const normalized = eventId.trim();
    if (!normalized || normalized.includes('/')) throw new Error('Invalid activity eventId.');
    return doc(logs, normalized);
  }

  build(input: ActivityEventBuildInput): ActivityEventRecord {
    const definition = getActivityActionDefinition(input.action);
    const currentUser = this.auth.currentUser();
    const eventId = input.eventId?.trim() || this.createRef().id;
    if (!eventId || eventId.includes('/')) throw new Error('Invalid activity eventId.');

    const actorUid = (input.actorUid || currentUser?.uid || 'system').trim();
    const actorName = (input.actorName || currentUser?.displayName || currentUser?.email || currentUser?.uid || 'Hệ thống')
      .trim()
      .slice(0, 200);
    const timestamp = input.timestamp ?? serverTimestamp();
    const lastUpdated = input.lastUpdated ?? serverTimestamp();
    const targetType = normalizeOptionalText(input.targetType, 100);
    const requestId = normalizeOptionalText(input.requestId, 300);
    const actionUrl = normalizeInternalActivityActionUrl(input.actionUrl);

    if (input.publicTraceable === true && (
      !canBePublicTraceableActivityAction(definition.action) ||
      targetType !== 'REQUEST' ||
      !requestId
    )) {
      throw new Error('Public traceability requires an allowlisted action, REQUEST targetType, and requestId.');
    }

    const canonical: ActivityEventRecord = {
      ...(sanitizeForFirebase(input.legacyFields || {}) as Record<string, unknown>),
      id: eventId,
      eventId,
      schemaVersion: 2,
      action: definition.action,
      module: definition.module,
      audience: definition.audience,
      importance: definition.importance,
      auditClass: definition.auditClass,
      activityVisible: definition.activityVisible,
      actorUid,
      actorName,
      targetType,
      targetId: normalizeOptionalText(input.targetId, 300),
      targetName: normalizeOptionalText(input.targetName, 500),
      requestId,
      actionUrl,
      details: sanitizeActivityDetails(input.details),
      metadata: sanitizeActivityMetadata(input.metadata),
      timestamp,
      lastUpdated,
      publicTraceable: input.publicTraceable === true,
      user: actorName,
      printable: input.printable,
      printJobId: normalizeOptionalText(input.printJobId, 300)
    };

    if (!canonical.actionUrl) canonical.actionUrl = resolveDefaultActivityActionUrl(canonical);
    return sanitizeForFirebase(canonical);
  }

  async write(event: ActivityEventRecord): Promise<void> {
    await setDoc(this.createRef(event.id || event.eventId), sanitizeForFirebase(event));
  }

  setInTransaction(
    transaction: Transaction,
    ref: DocumentReference<DocumentData>,
    event: ActivityEventRecord
  ): void {
    transaction.set(ref, sanitizeForFirebase(event));
  }

  setInBatch(
    batch: WriteBatch,
    ref: DocumentReference<DocumentData>,
    event: ActivityEventRecord
  ): void {
    batch.set(ref, sanitizeForFirebase(event));
  }
}

function normalizeOptionalText(value: unknown, maxLength: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim();
  return normalized ? normalized.slice(0, maxLength) : undefined;
}

/**
 * Activity links are consumed by the SPA router and may be copied into
 * notification payloads. Persist only same-origin paths; action-specific
 * registry defaults fill the value when a caller supplies an unsafe URL.
 */
export function normalizeInternalActivityActionUrl(value: unknown): string | undefined {
  const normalized = normalizeOptionalText(value, 1_000);
  return normalized && normalized.startsWith('/') && !normalized.startsWith('//')
    ? normalized
    : undefined;
}
