import type { Firestore } from 'firebase-admin/firestore';
import { appPath } from './backup-contract.js';

/**
 * This is a backup-only reservation budget. It is deliberately below the
 * documented Spark daily read allowance so normal application reads, rules,
 * retries, and other operational activity retain headroom. It is not a
 * project-wide Firestore quota counter.
 */
export const DEFAULT_BACKUP_DAILY_FIRESTORE_READ_BUDGET = 10_000;
export const MAX_BACKUP_DAILY_FIRESTORE_READ_BUDGET = 40_000;
export const BACKUP_READ_BUDGET_TIME_ZONE = 'America/Los_Angeles';
export const BACKUP_READ_BUDGET_ENV = 'LIMS_BACKUP_DAILY_FIRESTORE_READ_BUDGET';

const BACKUP_READ_BUDGET_COLLECTION = 'backup_locks';
const BACKUP_READ_BUDGET_PREFIX = 'backup-read-budget-';
const PACIFIC_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: BACKUP_READ_BUDGET_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const PACIFIC_OFFSET_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: BACKUP_READ_BUDGET_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'shortOffset',
});

interface PacificDateParts {
  year: number;
  month: number;
  day: number;
}

export interface BackupPacificDayWindow {
  dayKey: string;
  nextResetAt: Date;
}

export interface BackupReadBudgetReservation {
  dayKey: string;
  dailyLimit: number;
  requestedReads: number;
  reservedReads: number;
  remainingReads: number;
  nextResetAt: Date;
}

export interface BackupReadBudgetOptions {
  now?: Date;
  dailyLimit?: number;
}

interface BackupReadBudgetDocument {
  version: 1;
  kind: 'backup-firestore-read-budget';
  appId: string;
  dayKey: string;
  dailyLimit: number;
  reservedReads: number;
  createdAt: string;
  updatedAt: string;
}

function assertSafePositiveInteger(value: number, label: string): number {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`${label} phải là số nguyên dương.`);
  }
  return value;
}

function validateDailyLimit(value: number): number {
  assertSafePositiveInteger(value, 'Ngân sách đọc Firestore backup');
  if (value > MAX_BACKUP_DAILY_FIRESTORE_READ_BUDGET) {
    throw new Error(
      `${BACKUP_READ_BUDGET_ENV} phải là số nguyên từ 1 đến ${MAX_BACKUP_DAILY_FIRESTORE_READ_BUDGET}; đây là ngân sách riêng cho backup, không phải quota toàn project.`,
    );
  }
  return value;
}

export function configuredBackupDailyFirestoreReadBudget(
  environment: NodeJS.ProcessEnv = process.env,
): number {
  const raw = environment[BACKUP_READ_BUDGET_ENV]?.trim();
  if (!raw) return DEFAULT_BACKUP_DAILY_FIRESTORE_READ_BUDGET;
  const value = Number(raw);
  return validateDailyLimit(value);
}

function assertValidDate(value: Date): void {
  if (Number.isNaN(value.getTime())) throw new Error('Thời điểm tính ngân sách đọc Firestore backup không hợp lệ.');
}

function dateParts(value: Date): PacificDateParts {
  assertValidDate(value);
  const parts = Object.fromEntries(
    PACIFIC_DATE_FORMATTER.formatToParts(value)
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, part.value]),
  ) as Record<string, string>;
  const result = {
    year: Number(parts['year']),
    month: Number(parts['month']),
    day: Number(parts['day']),
  };
  if (!Number.isSafeInteger(result.year) || !Number.isSafeInteger(result.month) || !Number.isSafeInteger(result.day)) {
    throw new Error('Không thể xác định ngày Pacific cho ngân sách đọc Firestore backup.');
  }
  return result;
}

function localDateKey(value: PacificDateParts): string {
  return `${String(value.year).padStart(4, '0')}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
}

function offsetMilliseconds(value: Date): number {
  const part = PACIFIC_OFFSET_FORMATTER.formatToParts(value).find(item => item.type === 'timeZoneName')?.value || 'GMT';
  if (part === 'GMT') return 0;
  const match = /^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/.exec(part);
  if (!match) throw new Error(`Không thể xác định UTC offset Pacific từ ${part}.`);
  const hours = Number(match[2]);
  const minutes = Number(match[3] || 0);
  const offset = (hours * 60 + minutes) * 60 * 1000;
  return match[1] === '+' ? offset : -offset;
}

/** Convert a Pacific local midnight to its correct UTC instant across DST. */
function pacificMidnightUtc(value: PacificDateParts): Date {
  const localAsUtc = Date.UTC(value.year, value.month - 1, value.day, 0, 0, 0, 0);
  let candidate = localAsUtc;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const corrected = localAsUtc - offsetMilliseconds(new Date(candidate));
    if (corrected === candidate) return new Date(candidate);
    candidate = corrected;
  }
  return new Date(candidate);
}

export function getBackupPacificDayWindow(now = new Date()): BackupPacificDayWindow {
  const current = dateParts(now);
  const nextLocalDate = new Date(Date.UTC(current.year, current.month - 1, current.day + 1));
  const next = {
    year: nextLocalDate.getUTCFullYear(),
    month: nextLocalDate.getUTCMonth() + 1,
    day: nextLocalDate.getUTCDate(),
  };
  return {
    dayKey: localDateKey(current),
    nextResetAt: pacificMidnightUtc(next),
  };
}

function assertValidAppId(appId: string): void {
  if (!/^[A-Za-z0-9_-]+$/.test(appId)) throw new Error('appId không hợp lệ cho ngân sách đọc Firestore backup.');
}

function assertValidDayKey(dayKey: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) throw new Error('dayKey không hợp lệ cho ngân sách đọc Firestore backup.');
}

export function backupReadBudgetDocumentPath(appId: string, dayKey: string): string {
  assertValidAppId(appId);
  assertValidDayKey(dayKey);
  // backup_locks is already excluded from the backup catalog. Keeping the
  // guard metadata there avoids a new collection, rules change, or catalog
  // exception while preserving the existing runtime-only policy.
  return `${appPath(appId)}/${BACKUP_READ_BUDGET_COLLECTION}/${BACKUP_READ_BUDGET_PREFIX}${dayKey}`;
}

function parseExistingBudget(value: unknown, appId: string, dayKey: string): BackupReadBudgetDocument | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Ngân sách đọc Firestore backup bị hỏng; dừng để bảo vệ quota.');
  }
  const document = value as Partial<BackupReadBudgetDocument>;
  if (document.version !== 1 || document.kind !== 'backup-firestore-read-budget'
    || document.appId !== appId || document.dayKey !== dayKey) {
    throw new Error('Ngân sách đọc Firestore backup không khớp app/ngày; dừng để bảo vệ quota.');
  }
  validateDailyLimit(Number(document.dailyLimit));
  assertSafePositiveInteger(Number(document.reservedReads), 'reservedReads');
  if (typeof document.createdAt !== 'string' || typeof document.updatedAt !== 'string') {
    throw new Error('Ngân sách đọc Firestore backup thiếu timestamp; dừng để bảo vệ quota.');
  }
  return document as BackupReadBudgetDocument;
}

export class BackupReadBudgetExhaustedError extends Error {
  readonly code = 'BACKUP_DAILY_READ_BUDGET_EXHAUSTED';
  readonly dayKey: string;
  readonly dailyLimit: number;
  readonly reservedReads: number;
  readonly requestedReads: number;
  readonly retryAt: string;
  readonly retryAfterMs: number;

  constructor(input: {
    dayKey: string;
    dailyLimit: number;
    reservedReads: number;
    requestedReads: number;
    retryAt: Date;
    now: Date;
  }) {
    const retryAt = input.retryAt.toISOString();
    const retryAfterMs = Math.max(0, input.retryAt.getTime() - input.now.getTime());
    super(
      `Ngân sách đọc Firestore riêng cho backup ngày Pacific ${input.dayKey} đã hết `
      + `(${input.reservedReads}/${input.dailyLimit} reads đã đặt chỗ; cần thêm ${input.requestedReads}). `
      + `Backup vẫn chưa hoàn tất và chưa được đánh dấu thành công. Hãy tạm dừng và tiếp tục session sau ${retryAt} `
      + `hoặc giảm LIMS_BACKUP_FIRESTORE_DOCS_PER_REQUEST; ngân sách này chỉ bảo vệ reads do backup đặt chỗ, `
      + `không đo hoặc khóa tổng reads của project.`,
    );
    this.name = 'BackupReadBudgetExhaustedError';
    this.dayKey = input.dayKey;
    this.dailyLimit = input.dailyLimit;
    this.reservedReads = input.reservedReads;
    this.requestedReads = input.requestedReads;
    this.retryAt = retryAt;
    this.retryAfterMs = retryAfterMs;
  }
}

export async function reserveBackupFirestoreReads(
  db: Firestore,
  appId: string,
  requestedReads: number,
  options: BackupReadBudgetOptions = {},
): Promise<BackupReadBudgetReservation> {
  assertValidAppId(appId);
  assertSafePositiveInteger(requestedReads, 'Số reads cần đặt chỗ cho backup');
  const now = options.now || new Date();
  assertValidDate(now);
  const configuredLimit = validateDailyLimit(options.dailyLimit ?? configuredBackupDailyFirestoreReadBudget());
  const window = getBackupPacificDayWindow(now);
  const documentPath = backupReadBudgetDocumentPath(appId, window.dayKey);
  const budgetRef = db.doc(documentPath);

  const result = await db.runTransaction(async transaction => {
    const snapshot = await transaction.get(budgetRef);
    const current = parseExistingBudget(snapshot.exists ? snapshot.data() : undefined, appId, window.dayKey);
    // Never raise an already-created day's limit if an operator changes the
    // environment during that day. Lowering it remains immediately safe.
    const dailyLimit = current ? Math.min(configuredLimit, current.dailyLimit) : configuredLimit;
    const reservedReads = current?.reservedReads || 0;
    if (reservedReads + requestedReads > dailyLimit) {
      throw new BackupReadBudgetExhaustedError({
        dayKey: window.dayKey,
        dailyLimit,
        reservedReads,
        requestedReads,
        retryAt: window.nextResetAt,
        now,
      });
    }
    const nextReservedReads = reservedReads + requestedReads;
    const payload: BackupReadBudgetDocument = {
      version: 1,
      kind: 'backup-firestore-read-budget',
      appId,
      dayKey: window.dayKey,
      dailyLimit,
      reservedReads: nextReservedReads,
      createdAt: current?.createdAt || now.toISOString(),
      updatedAt: now.toISOString(),
    };
    transaction.set(budgetRef, payload);
    return {
      dayKey: window.dayKey,
      dailyLimit,
      requestedReads,
      reservedReads: nextReservedReads,
      remainingReads: dailyLimit - nextReservedReads,
      nextResetAt: window.nextResetAt,
    } satisfies BackupReadBudgetReservation;
  });
  return result;
}
