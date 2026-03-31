import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

// Declare global Google Identity Services type
declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleDriveService {
  private tokenClient: any = null;
  private accessToken: string = '';
  private tokenExpiry: number = 0;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  isReady = signal(false);

  /**
   * Initialize Google Identity Services (GIS).
   * Safe to call multiple times — only runs once.
   */
  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._initialize();
    return this.initPromise;
  }

  private async _initialize(): Promise<void> {
    await this.waitForGis();

    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: (environment as any).googleDrive.clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: () => {} // Dynamically set per request
    });

    this.initialized = true;
    this.isReady.set(true);
  }

  /**
   * Wait for the GIS <script> to finish loading.
   */
  private waitForGis(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google?.accounts?.oauth2) {
        resolve();
        return;
      }
      let attempts = 0;
      const interval = setInterval(() => {
        if (typeof google !== 'undefined' && google?.accounts?.oauth2) {
          clearInterval(interval);
          resolve();
        }
        if (++attempts > 100) { // 20 seconds max
          clearInterval(interval);
          reject(new Error('Google Identity Services không tải được. Kiểm tra kết nối Internet.'));
        }
      }, 200);
    });
  }

  /**
   * Request an OAuth access token from Google.
   * Shows consent/login popup if needed.
   */
  private requestAccessToken(): Promise<string> {
    // Reuse valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return Promise.resolve(this.accessToken);
    }

    return new Promise((resolve, reject) => {
      this.tokenClient.callback = (response: any) => {
        if (response.error) {
          reject(new Error(`Google Auth lỗi: ${response.error}`));
          return;
        }
        this.accessToken = response.access_token;
        // Token valid for ~3600s, cache with 5-min buffer
        this.tokenExpiry = Date.now() + (response.expires_in - 300) * 1000;
        resolve(response.access_token);
      };

      this.tokenClient.error_callback = (error: any) => {
        reject(new Error(`Đăng nhập Google bị hủy hoặc lỗi: ${error?.type || 'unknown'}`));
      };

      // prompt: '' → shows account chooser first time, silent after
      this.tokenClient.requestAccessToken({ prompt: '' });
    });
  }

  /**
   * Upload a file to Google Drive, set sharing, return preview URL.
   * 
   * @param file - The File object to upload
   * @param fileName - Desired filename on Drive (e.g., "CoA_Sulfadiazine_BCBW123.pdf")
   * @returns Preview URL: https://drive.google.com/file/d/{id}/preview
   */
  async uploadFile(file: File, fileName: string): Promise<string> {
    await this.ensureInitialized();
    const token = await this.requestAccessToken();

    // ── Step 1: Multipart upload to Drive ──
    const metadata = {
      name: fileName,
      parents: [(environment as any).googleDrive.folderId]
    };

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', file);

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      }
    );

    if (!uploadRes.ok) {
      // Token expired mid-session? Clear and retry ONCE
      if (uploadRes.status === 401) {
        this.accessToken = '';
        this.tokenExpiry = 0;
        const newToken = await this.requestAccessToken();
        // Retry upload with new token
        const retryForm = new FormData();
        retryForm.append(
          'metadata',
          new Blob([JSON.stringify(metadata)], { type: 'application/json' })
        );
        retryForm.append('file', file);
        const retryRes = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${newToken}` },
            body: retryForm
          }
        );
        if (!retryRes.ok) {
          const err = await retryRes.json().catch(() => ({}));
          throw new Error(err?.error?.message || `Upload thất bại (${retryRes.status})`);
        }
        const retryData = await retryRes.json();
        await this.setPublicPermission(retryData.id, newToken);
        return `https://drive.google.com/file/d/${retryData.id}/preview`;
      }

      const err = await uploadRes.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Upload thất bại (${uploadRes.status})`);
    }

    const fileData = await uploadRes.json();
    const fileId = fileData.id;

    // ── Step 2: Set "anyone with link can view" ──
    await this.setPublicPermission(fileId, token);

    // ── Step 3: Return preview URL ──
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  /**
   * Set file permission to "anyone with the link can view".
   */
  private async setPublicPermission(fileId: string, token: string): Promise<void> {
    try {
      await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role: 'reader', type: 'anyone' })
        }
      );
    } catch (e) {
      // Non-fatal: file uploaded but may not be publicly viewable
      console.warn('Không thể set quyền public cho file. File đã upload nhưng có thể không xem được qua link.', e);
    }
  }

  /**
   * Generate a clean, auto-named filename for CoA files.
   * Pattern: CoA_{StandardName}_{LotNumber}.{ext}
   * Handles Vietnamese characters by transliterating diacritics.
   */
  static generateFileName(standardName: string, lotNumber: string, originalFileName: string): string {
    const safeName = (standardName || 'Unknown')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics (á→a, ô→o, etc.)
      .replace(/đ/gi, 'd')              // Vietnamese đ → d
      .replace(/[^a-zA-Z0-9\s]/g, '')   // Remove special chars
      .trim()
      .replace(/\s+/g, '_')             // Spaces → underscores
      .substring(0, 50);                // Truncate

    const safeLot = (lotNumber || 'NoLot')
      .replace(/[^a-zA-Z0-9\-]/g, '')
      .substring(0, 30);

    const ext = originalFileName.split('.').pop()?.toLowerCase() || 'pdf';

    return `CoA_${safeName}_${safeLot}.${ext}`;
  }
}
