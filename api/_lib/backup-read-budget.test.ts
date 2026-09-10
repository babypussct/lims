import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Firestore } from 'firebase-admin/firestore';
import {
  BACKUP_READ_BUDGET_ENV,
  BackupReadBudgetExhaustedError,
  backupReadBudgetDocumentPath,
  configuredBackupDailyFirestoreReadBudget,
  getBackupPacificDayWindow,
  reserveBackupFirestoreReads,
} from './backup-read-budget.js';

interface FakeSnapshot {
  exists: boolean;
  data: () => Record<string, unknown> | undefined;
}

interface FakeReference {
  path: string;
}

class InMemoryFirestore {
  readonly documents = new Map<string, Record<string, unknown>>();
  private transactionTail = Promise.resolve();

  doc(path: string): FakeReference {
    return { path };
  }

  async runTransaction<T>(work: (transaction: {
    get: (reference: FakeReference) => Promise<FakeSnapshot>;
    set: (reference: FakeReference, value: Record<string, unknown>) => void;
  }) => Promise<T>): Promise<T> {
    const run = this.transactionTail.then(async () => {
      const writes = new Map<string, Record<string, unknown>>();
      const transaction = {
        get: async (reference: FakeReference): Promise<FakeSnapshot> => {
          const value = writes.get(reference.path) || this.documents.get(reference.path);
          return {
            exists: Boolean(value),
            data: () => (value ? { ...value } : undefined),
          };
        },
        set: (reference: FakeReference, value: Record<string, unknown>) => {
          writes.set(reference.path, { ...value });
        },
      };
      const result = await work(transaction);
      for (const [path, value] of writes) this.documents.set(path, value);
      return result;
    });
    this.transactionTail = run.then(() => undefined, () => undefined);
    return run;
  }

  read(path: string): Record<string, unknown> | undefined {
    return this.documents.get(path);
  }
}

function fakeFirestore(): Firestore {
  return new InMemoryFirestore() as unknown as Firestore;
}

describe('backup-only Firestore daily read budget', () => {
  it('uses the configured conservative limit and rejects exhaustion without changing the counter', async () => {
    const db = new InMemoryFirestore();
    const now = new Date('2026-01-15T12:00:00.000Z');
    const first = await reserveBackupFirestoreReads(db as unknown as Firestore, 'lims-cloud-fixed', 700, {
      now,
      dailyLimit: 1_000,
    });

    assert.equal(first.dayKey, '2026-01-15');
    assert.equal(first.reservedReads, 700);
    assert.equal(first.remainingReads, 300);
    await assert.rejects(
      () => reserveBackupFirestoreReads(db as unknown as Firestore, 'lims-cloud-fixed', 301, {
        now,
        dailyLimit: 1_000,
      }),
      (error: unknown) => {
        assert.ok(error instanceof BackupReadBudgetExhaustedError);
        assert.equal(error.dayKey, '2026-01-15');
        assert.equal(error.reservedReads, 700);
        assert.equal(error.dailyLimit, 1_000);
        assert.match(error.message, /tiếp tục session sau/);
        return true;
      },
    );
    assert.equal(
      db.read(backupReadBudgetDocumentPath('lims-cloud-fixed', '2026-01-15'))?.['reservedReads'],
      700,
    );
  });

  it('serializes concurrent reservations so retries and separate backups share one daily counter', async () => {
    const db = new InMemoryFirestore();
    const now = new Date('2026-01-15T12:00:00.000Z');
    const outcomes = await Promise.allSettled([
      reserveBackupFirestoreReads(db as unknown as Firestore, 'lims-cloud-fixed', 600, { now, dailyLimit: 1_000 }),
      reserveBackupFirestoreReads(db as unknown as Firestore, 'lims-cloud-fixed', 600, { now, dailyLimit: 1_000 }),
    ]);
    assert.equal(outcomes.filter(outcome => outcome.status === 'fulfilled').length, 1);
    assert.equal(outcomes.filter(outcome => outcome.status === 'rejected').length, 1);
    const rejected = outcomes.find(outcome => outcome.status === 'rejected');
    assert.ok(rejected && rejected.status === 'rejected');
    assert.ok(rejected.reason instanceof BackupReadBudgetExhaustedError);
    assert.equal(
      db.read(backupReadBudgetDocumentPath('lims-cloud-fixed', '2026-01-15'))?.['reservedReads'],
      600,
    );

    const resumed = await reserveBackupFirestoreReads(db as unknown as Firestore, 'lims-cloud-fixed', 400, {
      now,
      dailyLimit: 1_000,
    });
    assert.equal(resumed.reservedReads, 1_000);
    await assert.rejects(
      () => reserveBackupFirestoreReads(db as unknown as Firestore, 'lims-cloud-fixed', 1, {
        now,
        dailyLimit: 1_000,
      }),
      BackupReadBudgetExhaustedError,
    );
  });

  it('rolls over at Pacific midnight and calculates DST-aware reset times', async () => {
    const db = new InMemoryFirestore();
    const beforeSpringMidnight = new Date('2026-03-08T07:59:59.000Z');
    const atSpringMidnight = new Date('2026-03-08T08:00:00.000Z');
    const before = getBackupPacificDayWindow(beforeSpringMidnight);
    const after = getBackupPacificDayWindow(atSpringMidnight);
    assert.equal(before.dayKey, '2026-03-07');
    assert.equal(after.dayKey, '2026-03-08');
    assert.equal(after.nextResetAt.toISOString(), '2026-03-09T07:00:00.000Z');

    await reserveBackupFirestoreReads(db as unknown as Firestore, 'lims-cloud-fixed', 900, {
      now: beforeSpringMidnight,
      dailyLimit: 1_000,
    });
    const nextDay = await reserveBackupFirestoreReads(db as unknown as Firestore, 'lims-cloud-fixed', 900, {
      now: atSpringMidnight,
      dailyLimit: 1_000,
    });
    assert.equal(nextDay.dayKey, '2026-03-08');
    assert.equal(
      db.read(backupReadBudgetDocumentPath('lims-cloud-fixed', '2026-03-07'))?.['reservedReads'],
      900,
    );
    assert.equal(
      db.read(backupReadBudgetDocumentPath('lims-cloud-fixed', '2026-03-08'))?.['reservedReads'],
      900,
    );

    const fallWindow = getBackupPacificDayWindow(new Date('2026-11-01T12:00:00.000Z'));
    assert.equal(fallWindow.dayKey, '2026-11-01');
    assert.equal(fallWindow.nextResetAt.toISOString(), '2026-11-02T08:00:00.000Z');
  });

  it('accepts a controlled environment override without allowing an unsafe value', () => {
    assert.equal(
      configuredBackupDailyFirestoreReadBudget({ [BACKUP_READ_BUDGET_ENV]: '1234' }),
      1_234,
    );
    assert.equal(
      configuredBackupDailyFirestoreReadBudget({}),
      10_000,
    );
    assert.throws(
      () => configuredBackupDailyFirestoreReadBudget({ [BACKUP_READ_BUDGET_ENV]: '40001' }),
      /ngân sách riêng cho backup/,
    );
  });
});
