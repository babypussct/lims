import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

// Declare global Google Identity Services type
declare const google: any;

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

@Injectable({ providedIn: 'root' })
export class GoogleDriveService {
  private tokenClient: any = null;
  private accessToken: string = '';
  private tokenExpiry: number = 0;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private scriptLoaded = false;

  isReady = signal(false);
  isAuthenticated = signal(false); // true once an access token is obtained

  /** Whether tokenClient is redy to accept a synchronous requestAccessToken call */
  get canAuthSync(): boolean {
      return this.initialized && !!this.tokenClient;
  }

  /** True if we currently have a valid cached access token */
  get hasValidToken(): boolean {
      return !!this.accessToken && Date.now() < this.tokenExpiry;
  }

  /**
   * Initialize Google Identity Services (GIS).
   * Safe to call multiple times — only runs once.
   */
  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._initialize();
    try {
      await this.initPromise;
    } catch (e) {
      // Reset so user can retry
      this.initPromise = null;
      throw e;
    }
  }

  private async _initialize(): Promise<void> {
    await this.loadGisScript();

    const config = (environment as any).googleDrive;
    if (!config?.clientId) {
      throw new Error('Chưa cấu hình Google Drive Client ID trong environment.');
    }

    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: config.clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: () => {} // Dynamically set per request
    });

    this.initialized = true;
    this.isReady.set(true);
    console.log('[GoogleDrive] Initialized successfully.');
  }

  /**
   * Dynamically load the Google Identity Services script.
   * Uses onload/onerror for reliable detection instead of polling.
   */
  private loadGisScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Already loaded?
      if (this.scriptLoaded && typeof google !== 'undefined' && google?.accounts?.oauth2) {
        resolve();
        return;
      }

      // Check if script tag already exists (e.g., from index.html)
      const existing = document.querySelector(`script[src="${GIS_SCRIPT_URL}"]`);
      if (existing) {
        // Script tag exists but may not have finished loading
        this.waitForGoogleGlobal(resolve, reject);
        return;
      }

      // Dynamically inject the script
      const script = document.createElement('script');
      script.src = GIS_SCRIPT_URL;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('[GoogleDrive] GIS script loaded.');
        this.waitForGoogleGlobal(resolve, reject);
      };

      script.onerror = () => {
        reject(new Error(
          'Không thể tải Google Identity Services.\n' +
          '→ Kiểm tra kết nối Internet.\n' +
          '→ Tắt AdBlock/AdGuard nếu đang bật.\n' +
          '→ Thử mở trực tiếp: ' + GIS_SCRIPT_URL
        ));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Wait for the `google.accounts.oauth2` global to become available
   * after the script has loaded.
   */
  private waitForGoogleGlobal(
    resolve: () => void,
    reject: (err: Error) => void
  ): void {
    // Immediate check
    if (typeof google !== 'undefined' && google?.accounts?.oauth2) {
      this.scriptLoaded = true;
      resolve();
      return;
    }

    // Poll with timeout (script loaded but global not ready yet)
    let attempts = 0;
    const maxAttempts = 150; // 30 seconds max
    const interval = setInterval(() => {
      attempts++;
      if (typeof google !== 'undefined' && google?.accounts?.oauth2) {
        clearInterval(interval);
        this.scriptLoaded = true;
        resolve();
        return;
      }
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        reject(new Error(
          'Google Identity Services tải xong nhưng không khởi tạo được (timeout 30s).\n' +
          '→ Thử refresh trang (Ctrl+Shift+R).\n' +
          '→ Kiểm tra Console (F12) có lỗi nào không.'
        ));
      }
    }, 200);
  }

  /**
   * Request an OAuth access token from Google.
   * Shows consent/login popup if needed.
   */
  private requestAccessToken(): Promise<string> {
    // Reuse valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return Promise.resolve(this.accessToken);
    }

    return new Promise((resolve, reject) => {
      // Set up timeout for the entire auth flow
      const timeout = setTimeout(() => {
        reject(new Error('Đăng nhập Google quá thời gian (60s). Hãy thử lại.'));
      }, 60000);

      this.tokenClient.callback = (response: any) => {
        clearTimeout(timeout);
        if (response.error) {
          if (response.error === 'access_denied') {
            reject(new Error('Bạn đã từ chối quyền truy cập Google Drive. Hãy thử lại và nhấn "Allow".'));
          } else {
            reject(new Error(`Google Auth lỗi: ${response.error_description || response.error}`));
          }
          return;
        }
        this.accessToken = response.access_token;
        // Token valid for ~3600s, cache with 5-min buffer
        this.tokenExpiry = Date.now() + ((response.expires_in || 3600) - 300) * 1000;
        console.log('[GoogleDrive] Access token obtained.');
        this.isAuthenticated.set(true);
        resolve(response.access_token);
      };

      this.tokenClient.error_callback = (error: any) => {
        clearTimeout(timeout);
        if (error?.type === 'popup_closed') {
          reject(new Error('Cửa sổ đăng nhập Google đã bị đóng. Hãy thử lại.'));
        } else if (error?.type === 'popup_failed_to_open') {
          reject(new Error(
            'Không thể mở popup đăng nhập Google.\n' +
            '→ Kiểm tra trình duyệt có chặn popup không.\n' +
            '→ Cho phép popup từ trang này.'
          ));
        } else {
          reject(new Error(`Đăng nhập Google lỗi: ${error?.type || error?.message || 'Không xác định'}`));
        }
      };

      // prompt: '' → shows account chooser first time, silent refresh after
      this.tokenClient.requestAccessToken({ prompt: '' });
    });
  }

  /**
   * Explicitly request authentication to bypass browser popup blockers
   */
  async ensureAuthenticated(): Promise<string> {
      await this.ensureInitialized();
      return this.requestAccessToken();
  }

  /**
   * SYNCHRONOUS auth trigger — call directly from a (click) handler WITHOUT await.
   * `tokenClient.requestAccessToken` opens the Google popup SYNCHRONOUSLY,
   * preserving the user gesture context (no popup-blocker issues).
   *
   * @param onSuccess called with the access token after auth
   * @param onError   called with an error message if auth fails
   */
  authenticateSync(
      onSuccess: (token: string) => void,
      onError: (message: string) => void
  ): void {
      // Already have a valid cached token — skip popup entirely
      if (this.accessToken && Date.now() < this.tokenExpiry) {
          onSuccess(this.accessToken);
          return;
      }

      if (!this.tokenClient) {
          // GIS not ready yet — should not happen if ensureInitialized() ran in ngOnInit
          onError('Google Drive SDK ch\u01b0a s\u1eb5n s\u00e0ng. H\u00e3y th\u1eed l\u1ea1i sau v\u00e0i gi\u00e2y.');
          return;
      }

      const timeout = setTimeout(() => {
          onError('\u0110\u0103ng nh\u1eadp Google qu\u00e1 th\u1eddi gian (60s). H\u00e3y th\u1eed l\u1ea1i.');
      }, 60000);

      this.tokenClient.callback = (response: any) => {
          clearTimeout(timeout);
          if (response.error) {
              onError(response.error_description || response.error);
              return;
          }
          this.accessToken = response.access_token;
          this.tokenExpiry = Date.now() + ((response.expires_in || 3600) - 300) * 1000;
          console.log('[GoogleDrive] authenticateSync: token obtained.');
          this.isAuthenticated.set(true);
          onSuccess(this.accessToken);
      };

      this.tokenClient.error_callback = (error: any) => {
          clearTimeout(timeout);
          if (error?.type === 'popup_closed') {
              onError('C\u1eeda s\u1ed5 \u0111\u0103ng nh\u1eadp Google \u0111\u00e3 b\u1ecb \u0111\u00f3ng. H\u00e3y th\u1eed l\u1ea1i.');
          } else if (error?.type === 'popup_failed_to_open') {
              onError('Kh\u00f4ng th\u1ec3 m\u1edf popup. H\u00e3y cho ph\u00e9p popup t\u1eeb trang n\u00e0y.');
          } else {
              onError(error?.type || 'L\u1ed7i \u0111\u0103ng nh\u1eadp kh\u00f4ng x\u00e1c \u0111\u1ecbnh');
          }
      };

      // THIS LINE IS SYNCHRONOUS — opens the Google popup immediately in the click context
      this.tokenClient.requestAccessToken({ prompt: '' });
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

    const fileId = await this.uploadToDrive(file, fileName, token);

    // Set permission (non-fatal if fails)
    await this.setPublicPermission(fileId, token);

    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  /**
   * Upload file to Google Drive via multipart upload.
   * Handles token expiry with one retry.
   */
  private async uploadToDrive(file: File, fileName: string, token: string): Promise<string> {
    const config = (environment as any).googleDrive;
    const metadata = {
      name: fileName,
      parents: [config.folderId]
    };

    const doUpload = async (authToken: string): Promise<string> => {
      const form = new FormData();
      form.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      );
      form.append('file', file);

      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
          body: form
        }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const errMsg = errBody?.error?.message || `HTTP ${res.status}`;

        if (res.status === 401) {
          throw { code: 401, message: errMsg };
        }
        if (res.status === 403) {
          throw new Error(
            `Không có quyền upload vào thư mục Drive.\n` +
            `→ Kiểm tra thư mục LIMS_CoA_Files đã share "Editor" cho email bạn chưa.\n` +
            `→ Chi tiết: ${errMsg}`
          );
        }
        throw new Error(`Upload Drive thất bại: ${errMsg}`);
      }

      const data = await res.json();
      return data.id;
    };

    try {
      return await doUpload(token);
    } catch (e: any) {
      // Token expired? Re-authenticate and retry ONCE
      if (e?.code === 401) {
        console.warn('[GoogleDrive] Token expired, re-authenticating...');
        this.accessToken = '';
        this.tokenExpiry = 0;
        const newToken = await this.requestAccessToken();
        return await doUpload(newToken);
      }
      throw e;
    }
  }

  /**
   * Set file permission to "anyone with the link can view".
   */
  private async setPublicPermission(fileId: string, token: string): Promise<void> {
    try {
      const res = await fetch(
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
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn('[GoogleDrive] Set permission warning:', err?.error?.message || res.status);
      }
    } catch (e) {
      // Non-fatal: file uploaded but may not be publicly viewable via link
      console.warn('[GoogleDrive] Could not set public permission:', e);
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
