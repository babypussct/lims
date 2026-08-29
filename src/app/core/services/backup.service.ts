import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

export interface BackupStatusResponse {
  appId: string;
  ready: boolean;
  encryption: { configured: boolean; keyIdConfigured: boolean };
  drive: {
    backupFolderConfigured: boolean;
    accessAvailable: boolean;
    accessSource: string | null;
    sourceFolderCount: number;
    templateCount: number;
    restoreTargetConfigured: boolean;
  };
  appsScript: {
    scriptIdConfigured: boolean;
    sourceBundleAvailable: boolean;
    scopesKnown: boolean;
    scopesConfigured: boolean;
    requiredScopes: string[];
  };
  firestore: {
    topLevelCollectionCount: number;
    rootCollectionCount: number;
    nestedPatternCount: number;
  };
  policies: {
    defaultRestoreMode: string;
    firebaseManagedExportRequired: boolean;
    billingRequiredForDesign: boolean;
  };
}

export interface BackupListItem {
  backupId: string;
  backupFolderId: string;
  manifestFileId: string | null;
  status: string;
  verified: boolean;
  createdTime?: string;
  completedAt?: string | null;
  projectId?: string | null;
  releaseVersion?: string;
  firestoreDocuments: number | null;
  authUsers: number | null;
  driveAssets: number | null;
  driveFolders: number | null;
  warnings: number;
  errors: number;
  error?: string;
  restoreCheckpoints?: RestoreCheckpointListItem[];
}

export interface RestoreCheckpointListItem {
  restoreId: string;
  backupId: string;
  backupFolderId: string;
  mode: string;
  phase: string;
  firestoreBatchesCommitted: number;
  firestoreWritesCommitted: number;
  driveFoldersProcessed: number;
  driveAssetsProcessed: number;
  authBatchesProcessed: number;
  lastPath?: string;
  error?: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BackupListResponse {
  backups: BackupListItem[];
}

export interface BackupCreateResponse {
  success: boolean;
  backupId: string;
  backupFolderId: string;
  manifestFileId: string;
  status: string;
  summary: {
    firestoreDocuments: number;
    firestoreCollections: number;
    authUsers: number;
    driveAssets: number;
    driveFolders: number;
    warnings: number;
    errors: number;
  };
  quotaUsage: {
    firestoreReads: number;
    firestoreWrites: number;
    driveApiRequests: number;
    driveBytesUploaded: number;
    driveStorageBefore?: { limit?: string; usage?: string; usageInDrive?: string; usageInDriveTrash?: string };
    driveStorageAfter?: { limit?: string; usage?: string; usageInDrive?: string; usageInDriveTrash?: string };
  };
  warnings: string[];
  errors: string[];
  auditLogged?: boolean;
}

interface BackupCreateStepResponse extends Partial<BackupCreateResponse> {
  done?: boolean;
  phase?: string;
  progress?: Record<string, unknown>;
  backupId?: string;
  backupFolderId?: string;
}

export interface BackupVerificationResponse {
  success: boolean;
  verified: boolean;
  backupFolderId: string;
  checkedParts: number;
  checkedAssets: number;
  checkedBytes: number;
  errors: string[];
  warnings: string[];
  auditLogged?: boolean;
}

export interface RestoreResponse {
  success: boolean;
  auditLogged?: boolean;
  report: {
    backupId: string;
    backupFolderId: string;
    mode: string;
    verified: boolean;
    firestore: {
      scanned: number;
      missing: number;
      different: number;
      unchanged: number;
      skippedExisting: number;
      created: number;
      updated: number;
      deleted: number;
      plannedWrites: number;
      firestoreReads: number;
    };
    auth: {
      scanned: number;
      existing: number;
      missing: number;
      imported: number;
      updated: number;
      deleted: number;
      failed: number;
      skipped: boolean;
      errors: string[];
    };
    drive: {
      scanned: number;
      existing: number;
      restoredFromTrash: number;
      recreated: number;
      skipped: number;
      failed: number;
      errors: string[];
    };
    warnings: string[];
    checkpoint?: {
      restoreId: string;
      backupId: string;
      backupFolderId: string;
      mode: string;
      phase: string;
      firestoreBatchesCommitted: number;
      firestoreWritesCommitted: number;
      driveFoldersProcessed: number;
      driveAssetsProcessed: number;
      authBatchesProcessed: number;
      lastPath?: string;
      error?: string;
      startedAt: string;
      updatedAt: string;
      completedAt?: string;
    };
  };
}

export interface BackupRequestError extends Error {
  status?: number;
  payload?: any;
}

@Injectable({ providedIn: 'root' })
export class BackupService {
  private readonly auth = inject(AuthService);

  private async waitBeforeRetry(milliseconds: number): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, milliseconds));
  }

  private async request<T>(url: string, init: RequestInit = {}): Promise<T> {
    const token = await this.auth.getIdToken(false);
    if (!token) throw new Error('Phiên Firebase đã hết hạn. Hãy đăng nhập lại.');
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    const response = await fetch(url, {
      ...init,
      headers,
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload?.error || `Backup API HTTP ${response.status}`) as BackupRequestError;
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload as T;
  }

  getStatus(): Promise<BackupStatusResponse> {
    return this.request<BackupStatusResponse>('/api/backup/status');
  }

  listBackups(): Promise<BackupListResponse> {
    return this.request<BackupListResponse>('/api/backup/list');
  }

  async createBackup(releaseVersion?: string, initialBackupFolderId?: string): Promise<BackupCreateResponse> {
    let backupFolderId = initialBackupFolderId?.trim() || '';
    let transientRetries = 0;

    // The server advances one resumable phase per request so a complete backup
    // does not depend on a single serverless invocation staying alive for the
    // whole Firestore/Auth/Drive workload.
    for (let iteration = 0; iteration < 10_000; iteration++) {
      try {
        const payload = {
          releaseVersion: releaseVersion || undefined,
          ...(backupFolderId ? { backupFolderId } : {}),
        };
        const step = await this.request<BackupCreateStepResponse>('/api/backup/create', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (step.done === true) return step as BackupCreateResponse;
        if (!step.backupFolderId) throw new Error('Backup session không trả về thư mục để tiếp tục.');
        backupFolderId = step.backupFolderId;
        transientRetries = 0;
      } catch (error) {
        // A dropped response can happen after the server has committed a
        // phase. Replaying the same session is safe because the API loads the
        // encrypted session state from Drive before advancing it.
        const requestError = error as BackupRequestError;
        if (backupFolderId && requestError.status === 409) {
          await this.waitBeforeRetry(Number(requestError.payload?.retryAfterMs) || 3000);
          continue;
        }
        if (backupFolderId && transientRetries < 2) {
          transientRetries++;
          await this.waitBeforeRetry(1500 * transientRetries);
          continue;
        }
        throw error;
      }
    }
    throw new Error('Backup vượt quá số pha an toàn cho phép.');
  }

  verifyBackup(backupFolderId: string): Promise<BackupVerificationResponse> {
    return this.request<BackupVerificationResponse>('/api/backup/verify', {
      method: 'POST',
      body: JSON.stringify({ backupFolderId }),
    });
  }

  restoreBackup(options: {
    backupFolderId: string;
    mode: 'DRY_RUN' | 'RECOVER_MISSING' | 'RESTORE_SELECTED' | 'FULL_REPLACE';
    selectedPaths?: string[];
    confirmation?: string;
    preRestoreBackupFolderId?: string;
    restoreDrive?: boolean;
    restoreAuth?: boolean;
    replaceAuth?: boolean;
    resumeRestoreId?: string;
  }): Promise<RestoreResponse> {
    return this.request<RestoreResponse>('/api/backup/restore', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }
}
