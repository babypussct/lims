
import { Injectable, inject, signal, computed, NgZone } from '@angular/core';
import { GoogleDriveService } from './google-drive.service';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithRedirect,
  linkWithRedirect,
  linkWithCredential,
  getRedirectResult,
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  unlink,
  updatePassword,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type AuthCredential,
  type User,
  type Auth
} from 'firebase/auth';
import { 
  doc, getDoc, setDoc, serverTimestamp, onSnapshot, updateDoc, arrayRemove,
  collection, query, limit, getDocs, writeBatch 
} from 'firebase/firestore';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';

import { buildDeltaAuthScope, DeltaSyncService } from './delta-sync.service';

const GOOGLE_REDIRECT_PENDING_KEY = '__lims_google_redirect_pending';
const GOOGLE_LINK_REDIRECT_PENDING_KEY = '__lims_google_link_redirect_pending';

export const PERMISSIONS = {
  INVENTORY_VIEW: 'inventory_view',
  INVENTORY_EDIT: 'inventory_edit',
  STANDARD_VIEW: 'standard_view',
  STANDARD_EDIT: 'standard_edit',
  STANDARD_APPROVE: 'standard_approve', // Phê duyệt yêu cầu chuẩn
  STANDARD_LOG_VIEW: 'standard_log_view', // Xem nhật ký dùng toàn hệ thống
  STANDARD_LOG_DELETE: 'standard_log_delete', // Xóa nhật ký / yêu cầu mượn chuẩn
  RECIPE_VIEW: 'recipe_view',
  RECIPE_EDIT: 'recipe_edit',
  SOP_VIEW: 'sop_view',
  SOP_EDIT: 'sop_edit',
  SOP_APPROVE: 'sop_approve',
  BATCH_RUN: 'batch_run',  // Chạy Smart Batch & Trạm pha chế (thao tác tiêu hao kho)
  REPORT_VIEW: 'report_view',
  USER_MANAGE: 'user_manage',
  STANDARD_REQUEST: 'standard_request', // Đăng ký mượn chuẩn
  BYPASS_MAINTENANCE: 'bypass_maintenance' // Quyền truy cập khi bảo trì (Whitelist)
};

export const PERMISSION_NAMES: Record<string, string> = {
  [PERMISSIONS.INVENTORY_VIEW]: 'Xem Kho',
  [PERMISSIONS.INVENTORY_EDIT]: 'Sửa Kho',
  [PERMISSIONS.STANDARD_VIEW]: 'Xem Chất Chuẩn',
  [PERMISSIONS.STANDARD_EDIT]: 'Sửa Chất Chuẩn',
  [PERMISSIONS.STANDARD_APPROVE]: 'Duyệt Chuẩn',
  [PERMISSIONS.STANDARD_LOG_VIEW]: 'Xem Nhật Ký Chuẩn',
  [PERMISSIONS.STANDARD_LOG_DELETE]: 'Xóa Nhật Ký Chuẩn',
  [PERMISSIONS.RECIPE_VIEW]: 'Xem Công Thức',
  [PERMISSIONS.RECIPE_EDIT]: 'Sửa Công Thức',
  [PERMISSIONS.SOP_VIEW]: 'Xem SOP & Nhập KQ',
  [PERMISSIONS.SOP_EDIT]: 'Sửa SOP',
  [PERMISSIONS.SOP_APPROVE]: 'Duyệt SOP',
  [PERMISSIONS.BATCH_RUN]: 'Vận Hành Mẻ',
  [PERMISSIONS.REPORT_VIEW]: 'Xem Báo Cáo',
  [PERMISSIONS.USER_MANAGE]: 'Quản Lý Hệ Thống',
  [PERMISSIONS.STANDARD_REQUEST]: 'Mượn Chuẩn',
  [PERMISSIONS.BYPASS_MAINTENANCE]: 'Vượt Bảo Trì'
};

export const DEFAULT_ROLES = {
  role_staff_default: {
    name: 'Nhân viên mặc định',
    description: 'Quyền cơ bản của nhân viên LIMS (Chỉ xem và mượn chuẩn)',
    permissions: [
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.STANDARD_VIEW,
      PERMISSIONS.SOP_VIEW,
      PERMISSIONS.RECIPE_VIEW,
      PERMISSIONS.STANDARD_REQUEST
    ],
    isSystemRole: true
  },
  role_lab_technician: {
    name: 'Kiểm nghiệm viên',
    description: 'Kỹ thuật viên phòng thí nghiệm (Xem/Sửa kho, đăng ký mượn chuẩn)',
    permissions: [
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.INVENTORY_EDIT,
      PERMISSIONS.STANDARD_VIEW,
      PERMISSIONS.RECIPE_VIEW,
      PERMISSIONS.SOP_VIEW,
      PERMISSIONS.BATCH_RUN,
      PERMISSIONS.STANDARD_REQUEST
    ],
    isSystemRole: true
  },
  role_qc_lead: {
    name: 'Trưởng nhóm QC',
    description: 'Trưởng nhóm QC (Phê duyệt chuẩn/SOP, Quản lý kho)',
    permissions: [
      PERMISSIONS.INVENTORY_VIEW,
      PERMISSIONS.INVENTORY_EDIT,
      PERMISSIONS.STANDARD_VIEW,
      PERMISSIONS.STANDARD_EDIT,
      PERMISSIONS.STANDARD_APPROVE,
      PERMISSIONS.STANDARD_LOG_VIEW,
      PERMISSIONS.STANDARD_LOG_DELETE,
      PERMISSIONS.RECIPE_VIEW,
      PERMISSIONS.RECIPE_EDIT,
      PERMISSIONS.SOP_VIEW,
      PERMISSIONS.SOP_EDIT,
      PERMISSIONS.SOP_APPROVE,
      PERMISSIONS.BATCH_RUN,
      PERMISSIONS.REPORT_VIEW
    ],
    isSystemRole: true
  }
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'manager' | 'staff' | 'viewer' | 'pending';
  roleId?: string; // Khóa liên kết Dynamic RBAC
  permissions?: string[]; // Fallback hoặc Quyền cá nhân
  customPermissions?: string[]; // Quyền ghi đè cá nhân cho Staff
  photoURL?: string;
  avatarStyle?: string;
  createdAt?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fb = inject(FirebaseService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private deltaSync = inject(DeltaSyncService);
  private googleDriveService = inject(GoogleDriveService);
  private auth: Auth;
  // CRED_KEY removed: password caching in localStorage was a security vulnerability.

  currentUser = signal<UserProfile | null>(null);
  isAuthReady = signal<boolean>(false);
  /** true trong khi đang xử lý token trả về từ Google redirect — dùng để ẩn màn hình Login */
  isProcessingRedirect = signal<boolean>(false);
  /** Lỗi Google redirect gần nhất, hiển thị lại trên màn hình đăng nhập. */
  googleRedirectError = signal<string | null>(null);
  /** Email của tài khoản local cần xác thực để hoàn tất liên kết Google. */
  pendingGoogleLinkEmail = signal<string | null>(null);
  private pendingGoogleCredential: AuthCredential | null = null;
  private authProviderIds = signal<string[]>([]);
  readonly hasGoogleProvider = computed(() => this.authProviderIds().includes('google.com'));
  readonly hasPasswordProvider = computed(() => this.authProviderIds().includes('password'));
  /** Google-only accounts must create a local password before using ID/password login. */
  readonly needsPasswordSetup = computed(() =>
    !!this.currentUser() && this.hasGoogleProvider() && !this.hasPasswordProvider()
  );
  private userUnsub: any = null;
  private rolesUnsub: any = null;
  readonly rolesConfig = signal<Record<string, string[]>>({});

  constructor() {
    this.auth = getAuth(this.fb.app);

    // Yêu cầu LIMS tự động thoát khi đóng trình duyệt/tab (hoặc giữ nếu lưu trạng thái)
    const rememberSession = localStorage.getItem('lims_remember_session') === 'true';
    const persistenceReady = setPersistence(this.auth, rememberSession ? browserLocalPersistence : browserSessionPersistence).catch((err: any) => {
      console.warn('[Auth] Failed to set session persistence:', err);
    });

    const legacyRedirectError = sessionStorage.getItem('__google_redirect_error');
    if (legacyRedirectError) {
      sessionStorage.removeItem('__google_redirect_error');
      this.googleRedirectError.set(this.googleAuthErrorMessage(legacyRedirectError));
    }

    const hasPendingGoogleRedirect = sessionStorage.getItem(GOOGLE_REDIRECT_PENDING_KEY) === 'true';
    const hasPendingGoogleLink = sessionStorage.getItem(GOOGLE_LINK_REDIRECT_PENDING_KEY) === 'true';
    if (hasPendingGoogleRedirect || hasPendingGoogleLink) {
      this.isProcessingRedirect.set(true);
    }

    // Let Firebase own the redirect transaction and credential exchange. This
    // avoids exposing a Google ID token to the application URL or hand-rolling
    // state/nonce validation in index.html.
    void persistenceReady.then(() => this.processGoogleRedirectResult(hasPendingGoogleRedirect, hasPendingGoogleLink));

    // 2. Lắng nghe trạng thái đăng nhập
    onAuthStateChanged(this.auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        this.isProcessingRedirect.set(false); // Tắt overlay khi đã có user
        this.updateAuthProviderState(firebaseUser);
        this.syncUser(firebaseUser);

        // Restore intended route nếu guard đã lưu route ý định trước khi redirect về login.
        // Key này chỉ được guard set khi cần, nên chỉ có khi user bị forced redirect.
        const intendedRoute = sessionStorage.getItem('__lims_intended_route');
        if (intendedRoute) {
          sessionStorage.removeItem('__lims_intended_route');
          // Delay nhỏ để đảm bảo Firestore snapshot của syncUser đã set currentUser
          setTimeout(() => {
            this.ngZone.run(() => {
              this.router.navigateByUrl(intendedRoute.replace(/^#/, ''));
            });
          }, 500);
        }
      } else {
        if (this.userUnsub) { this.userUnsub(); this.userUnsub = null; }
        if (this.rolesUnsub) { this.rolesUnsub(); this.rolesUnsub = null; }
        // Bao phủ cả trường hợp token hết hạn / phiên bị thu hồi ngoài nút Logout.
        this.deltaSync.destroyAll(true);
        this.clearQrLoginCache();
        this.authProviderIds.set([]);
        this.currentUser.set(null);
        this.isAuthReady.set(true);
      }
    });
  }

  private processGoogleRedirectResult(hasPendingGoogleRedirect: boolean, hasPendingGoogleLink: boolean): void {

    void getRedirectResult(this.auth)
      .then(async (result) => {
        if (result?.user) {
          this.googleRedirectError.set(null);
          console.log('[Auth] Firebase Google redirect completed:', result.user.email);

          if (hasPendingGoogleLink) {
            await this.validateCompletedGoogleLink(result.user);
          }

          // Normally onAuthStateChanged handles this. Keep a guarded fallback
          // for browsers where the auth observer was initialized first.
          this.ngZone.run(() => {
            if (!this.currentUser() && this.auth.currentUser) {
              this.syncUser(this.auth.currentUser);
            }
          });
        } else if (hasPendingGoogleRedirect && !this.auth.currentUser) {
          this.googleRedirectError.set(this.googleRedirectNoResultMessage());
        } else if (hasPendingGoogleLink) {
          this.googleRedirectError.set('Không nhận được kết quả liên kết Google. Vui lòng thử lại.');
        }
      })
      .catch((error: any) => {
        console.error('[Auth] Firebase Google redirect failed:', error);
        if (hasPendingGoogleRedirect && this.capturePendingGoogleCredential(error)) {
          this.googleRedirectError.set(
            `Email ${this.pendingGoogleLinkEmail()} đã có tài khoản mật khẩu. Nhập mật khẩu hiện tại để liên kết Google.`
          );
        } else if (hasPendingGoogleLink) {
          this.googleRedirectError.set(this.googleLinkErrorMessage(error));
        } else {
          this.googleRedirectError.set(this.googleAuthErrorMessage(error));
        }
      })
      .finally(() => {
        if (hasPendingGoogleRedirect) {
          sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
        }
        if (hasPendingGoogleLink) {
          sessionStorage.removeItem(GOOGLE_LINK_REDIRECT_PENDING_KEY);
        }
        if (hasPendingGoogleRedirect || hasPendingGoogleLink) {
          this.isProcessingRedirect.set(false);
        }
      });
  }

  private googleAuthErrorMessage(error: any): string {
    const code = typeof error === 'string' ? error : error?.code;

    switch (code) {
      case 'auth/unauthorized-domain':
        return 'Tên miền hiện tại chưa được cấp phép đăng nhập Firebase. Vui lòng liên hệ quản trị viên.';
      case 'auth/operation-not-supported-in-this-environment':
        return 'Trình duyệt hiện tại không hỗ trợ đăng nhập chuyển hướng. Hãy mở ứng dụng bằng trình duyệt ngoài.';
      case 'auth/network-request-failed':
        return 'Không thể kết nối Google. Vui lòng kiểm tra mạng và thử lại.';
      case 'auth/account-exists-with-different-credential':
        return 'Email Google này đã có tài khoản. Hãy đăng nhập bằng mật khẩu hiện tại rồi liên kết Google trong Hồ sơ cá nhân.';
      case 'auth/no-auth-event':
        return 'Phiên đăng nhập Google đã bị hủy hoặc hết hạn. Vui lòng thử lại.';
      case 'auth/cancelled-popup-request':
      case 'auth/popup-closed-by-user':
        return 'Đã hủy đăng nhập Google.';
      default:
        return 'Không thể hoàn tất đăng nhập Google. Vui lòng thử lại hoặc mở bằng trình duyệt ngoài.';
    }
  }

  private googleRedirectNoResultMessage(): string {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return 'Firebase chưa cấp quyền cho localhost. Vào Firebase Console → Authentication → Settings → Authorized domains, thêm "localhost" (không thêm :4200), rồi tải lại ứng dụng.';
    }
    return 'Không nhận được kết quả đăng nhập Google. Vui lòng thử lại hoặc mở bằng trình duyệt ngoài.';
  }

  clearGoogleRedirectError(): void {
    this.googleRedirectError.set(null);
  }


  // --- AUTH METHODS ---


  /** Cập nhật persistence ngay khi user thay đổi checkbox "Duy trì đăng nhập" */
  updatePersistence(rememberSession: boolean) {
    setPersistence(this.auth, rememberSession ? browserLocalPersistence : browserSessionPersistence).catch((err: any) => {
      console.warn('[Auth] Failed to update session persistence:', err);
    });
  }

  async login(email: string, pass: string) {
    const rememberSession = localStorage.getItem('lims_remember_session') === 'true';
    await setPersistence(this.auth, rememberSession ? browserLocalPersistence : browserSessionPersistence).catch((err: any) => {
      console.warn('[Auth] Failed to set session persistence dynamically:', err);
    });

    await signInWithEmailAndPassword(this.auth, this.normalizeAuthEmail(email), pass);
    if (this.auth.currentUser) {
      this.updateAuthProviderState(this.auth.currentUser);
    }
    
    // Fallback: If they were already logged in, onAuthStateChanged might not fire.
    // Force a sync to break out of the stuck state.
    if (!this.currentUser() && this.auth.currentUser) {
        this.syncUser(this.auth.currentUser);
    }
  }


  async loginWithGoogle(): Promise<void> {
    this.googleRedirectError.set(null);
    this.clearPendingGoogleLink();

    const rememberSession = localStorage.getItem('lims_remember_session') === 'true';
    await setPersistence(this.auth, rememberSession ? browserLocalPersistence : browserSessionPersistence).catch((err: any) => {
      console.warn('[Auth] Failed to set Google session persistence dynamically:', err);
    });

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    console.log('[Auth] loginWithGoogle: starting Firebase redirect');
    sessionStorage.removeItem(GOOGLE_LINK_REDIRECT_PENDING_KEY);
    sessionStorage.setItem(GOOGLE_REDIRECT_PENDING_KEY, 'true');
    try {
      await signInWithRedirect(this.auth, provider);
    } catch (error) {
      sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
      this.googleRedirectError.set(this.googleAuthErrorMessage(error));
      throw error;
    }
  }

  /**
   * Liên kết mật khẩu nội bộ vào tài khoản Google hiện tại.
   * Firebase giữ nguyên UID nên toàn bộ hồ sơ, quyền và dữ liệu LIMS không đổi.
   */
  async setLocalPassword(password: string): Promise<void> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser?.email) {
      throw new Error('Không tìm thấy email tài khoản để tạo mật khẩu.');
    }

    this.updateAuthProviderState(firebaseUser);
    if (!this.hasGoogleProvider()) {
      throw new Error('Chỉ tài khoản đăng nhập bằng Google mới cần thao tác này.');
    }
    this.validateNewPassword(password);

    try {
      if (this.hasPasswordProvider()) {
        await updatePassword(firebaseUser, password);
      } else {
        const credential = EmailAuthProvider.credential(
          this.normalizeAuthEmail(firebaseUser.email),
          password
        );
        await linkWithCredential(firebaseUser, credential);
      }
    } catch (error: any) {
      // Race condition-safe: another tab may have linked the provider first.
      if (error?.code === 'auth/provider-already-linked') {
        await updatePassword(firebaseUser, password);
      } else {
        throw error;
      }
    }

    await firebaseUser.reload();
    const refreshedUser = this.auth.currentUser || firebaseUser;
    this.updateAuthProviderState(refreshedUser);
  }

  /**
   * Hoàn tất trường hợp Google email đã có sẵn tài khoản email/password.
   * Credential Google chỉ sống trong memory của tab hiện tại, không ghi vào storage.
   */
  async linkPendingGoogleAccount(password: string): Promise<void> {
    const googleCredential = this.pendingGoogleCredential;
    const email = this.pendingGoogleLinkEmail();
    if (!googleCredential || !email) {
      throw new Error('Phiên liên kết Google đã hết hạn. Vui lòng đăng nhập Google lại.');
    }
    this.validateNewPassword(password, false);

    const result = await signInWithEmailAndPassword(this.auth, email, password);
    const localUser = result.user;
    if (this.normalizeAuthEmail(localUser.email || '') !== email) {
      await signOut(this.auth);
      throw this.createAuthError('auth/email-mismatch', 'Tài khoản email không khớp với Google.');
    }

    try {
      await linkWithCredential(localUser, googleCredential);
    } catch (error: any) {
      // Do not leave a partially authenticated local session when linking fails.
      await signOut(this.auth);
      if (error?.code === 'auth/credential-already-in-use') {
        this.clearPendingGoogleLink();
      }
      throw error;
    }
    await localUser.reload();
    const refreshedUser = this.auth.currentUser || localUser;
    this.updateAuthProviderState(refreshedUser);
    this.clearPendingGoogleLink();
    this.googleRedirectError.set(null);
    this.syncUser(refreshedUser);
  }

  /** Bắt đầu liên kết Google từ tài khoản email/password đang đăng nhập. */
  async linkGoogleToCurrentUser(): Promise<void> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) {
      throw new Error('Bạn cần đăng nhập trước khi liên kết Google.');
    }

    this.updateAuthProviderState(firebaseUser);
    if (this.hasGoogleProvider()) return;
    if (!this.hasPasswordProvider()) {
      throw new Error('Tài khoản chưa có phương thức mật khẩu để làm phương thức dự phòng.');
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      ...(firebaseUser.email ? { login_hint: firebaseUser.email } : {})
    });

    this.googleRedirectError.set(null);
    sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
    sessionStorage.setItem(GOOGLE_LINK_REDIRECT_PENDING_KEY, 'true');
    this.isProcessingRedirect.set(true);
    try {
      await linkWithRedirect(firebaseUser, provider);
    } catch (error: any) {
      sessionStorage.removeItem(GOOGLE_LINK_REDIRECT_PENDING_KEY);
      this.isProcessingRedirect.set(false);
      this.googleRedirectError.set(this.googleLinkErrorMessage(error));
      throw error;
    }
  }

  /** Gửi email khôi phục mật khẩu cho login ID hiện tại. */
  async sendPasswordReset(email: string): Promise<void> {
    const normalizedEmail = this.normalizeAuthEmail(email);
    if (!normalizedEmail.includes('@')) {
      throw this.createAuthError('auth/invalid-email', 'Email không hợp lệ.');
    }
    await sendPasswordResetEmail(this.auth, normalizedEmail);
  }

  private normalizeAuthEmail(email: string | null | undefined): string {
    const normalized = (email || '').trim().toLowerCase();
    return normalized && !normalized.includes('@') ? `${normalized}@lims.com` : normalized;
  }

  private validateNewPassword(password: string, requireStrongLength = true): void {
    const minLength = requireStrongLength ? 8 : 1;
    if (!password || password.length < minLength) {
      throw this.createAuthError(
        'auth/weak-password',
        requireStrongLength ? 'Mật khẩu phải có ít nhất 8 ký tự.' : 'Vui lòng nhập mật khẩu.'
      );
    }
    if (/^\s|\s$/.test(password)) {
      throw this.createAuthError('auth/weak-password', 'Mật khẩu không được có khoảng trắng ở đầu hoặc cuối.');
    }
  }

  private createAuthError(code: string, message: string): Error & { code: string } {
    const error = new Error(message) as Error & { code: string };
    error.code = code;
    return error;
  }

  private updateAuthProviderState(firebaseUser: User): void {
    this.authProviderIds.set(
      (firebaseUser.providerData || [])
        .map(provider => provider.providerId)
        .filter((providerId): providerId is string => !!providerId)
    );
  }

  private capturePendingGoogleCredential(error: any): boolean {
    const credential = (error?.credential ||
      (GoogleAuthProvider as any).credentialFromError?.(error) || null) as AuthCredential | null;
    const email = this.normalizeAuthEmail(error?.customData?.email || error?.email || '');
    if (!credential || !email.includes('@')) return false;

    this.pendingGoogleCredential = credential;
    this.pendingGoogleLinkEmail.set(email);
    return true;
  }

  private clearPendingGoogleLink(): void {
    this.pendingGoogleCredential = null;
    this.pendingGoogleLinkEmail.set(null);
  }

  private async validateCompletedGoogleLink(firebaseUser: User): Promise<void> {
    const googleProvider = firebaseUser.providerData.find(provider => provider.providerId === 'google.com');
    const googleEmail = this.normalizeAuthEmail(googleProvider?.email || '');
    const accountEmail = this.normalizeAuthEmail(firebaseUser.email || '');

    // The LIMS login ID remains the verified email. Do not silently attach a
    // different Google identity to an existing local account.
    if (!googleEmail || googleEmail !== accountEmail) {
      try {
        await unlink(firebaseUser, 'google.com');
      } catch (unlinkError) {
        console.error('[Auth] Could not roll back mismatched Google link:', unlinkError);
      }
      this.updateAuthProviderState(this.auth.currentUser || firebaseUser);
      throw this.createAuthError(
        'auth/google-email-mismatch',
        'Tài khoản Google phải dùng đúng email đang là ID đăng nhập LIMS.'
      );
    }

    this.updateAuthProviderState(firebaseUser);
  }

  private googleLinkErrorMessage(error: any): string {
    const code = typeof error === 'string' ? error : error?.code;
    switch (code) {
      case 'auth/credential-already-in-use':
        return 'Tài khoản Google này đã liên kết với một tài khoản LIMS khác.';
      case 'auth/google-email-mismatch':
        return 'Email Google phải trùng với ID email đang dùng trong LIMS.';
      case 'auth/requires-recent-login':
        return 'Phiên đăng nhập đã cũ. Vui lòng đăng nhập lại rồi thử liên kết Google.';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Đã hủy liên kết Google.';
      default:
        return this.googleAuthErrorMessage(error);
    }
  }

  async logout() {
    if (this.userUnsub) { this.userUnsub(); this.userUnsub = null; }
    if (this.rolesUnsub) { this.rolesUnsub(); this.rolesUnsub = null; }
    try {
        // Hủy listener và xóa mọi cache DeltaSync đã đăng ký trước khi đổi phiên.
        // Điều này ngăn dữ liệu của tài khoản trước xuất hiện trong phiên kế tiếp.
        this.deltaSync.destroyAll(true);
    } catch (e) {
        console.warn('[Auth] Failed to destroy DeltaSync singletons:', e);
    }
    this.clearQrLoginCache(); // Security cleanup
    this.clearPendingGoogleLink();
    localStorage.removeItem('lims_remember_session'); // Clear remember session flag
    
    // Clear Google Drive session state
    try {
        this.googleDriveService.clearSession();
    } catch (e) {}

    // Xóa FCM token của thiết bị này để ngừng nhận thông báo đẩy
    const currentUser = this.currentUser();
    const currentToken = localStorage.getItem('lims_fcm_token');
    if (currentUser && currentToken) {
        try {
            const userRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/users/${currentUser.uid}`);
            await updateDoc(userRef, { fcmTokens: arrayRemove(currentToken) });
            localStorage.removeItem('lims_fcm_token');
        } catch(e) {
            console.warn('[Auth] Failed to remove FCM token on logout', e);
        }
    }

    const isGoogle = this.isGoogleUser();
    const isSharedDevice = localStorage.getItem('lims_shared_device') === 'true';
    await signOut(this.auth);

    if (isGoogle && isSharedDevice) {
        // Đăng xuất hoàn toàn khỏi tài khoản Google trên trình duyệt
        window.location.href = 'https://accounts.google.com/Logout';
    } else {
        this.router.navigate(['/']);
    }
  }

  private syncUser(firebaseUser: User) {
    if (this.userUnsub) { this.userUnsub(); }
    const userRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/users/${firebaseUser.uid}`);
    
    // Đồng bộ cấu hình nhóm quyền động
    this.syncRolesConfig().catch(err => {
        console.warn("[Auth] Failed to sync roles_config:", err);
    });
    
    this.userUnsub = onSnapshot(userRef, async (snap: any) => {
        try {
            if (snap.exists()) {
              const data = snap.data() as UserProfile;
              data.uid = firebaseUser.uid; // Ensure uid is present

              // Auto-upgrade existing Super Admin account to Manager if not already
              if ((data.email || '').toLowerCase() === 'oneloveonepeopleforever@gmail.com' && data.role !== 'manager') {
                  data.role = 'manager';
                  data.permissions = Object.values(PERMISSIONS);
                  updateDoc(userRef, { 
                      role: 'manager', 
                      permissions: Object.values(PERMISSIONS) 
                  }).catch((e: any) => console.error("Could not auto-promote Super Admin in Firestore", e));
              }
              
              // Ensure we sync Google Avatar to Firestore so others can see it
              if (firebaseUser.photoURL && data.photoURL !== firebaseUser.photoURL) {
                  data.photoURL = firebaseUser.photoURL;
                  // Don't await here to avoid blocking UI sync, let it update in background
                  updateDoc(userRef, { photoURL: firebaseUser.photoURL }).catch((e: any) => console.error("Could not sync photoURL to Firestore", e));
              }
              
              this.currentUser.set(data);
            } else {
              const isSuperAdmin = (firebaseUser.email || '').toLowerCase() === 'oneloveonepeopleforever@gmail.com';
              const newUser: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                role: isSuperAdmin ? 'manager' : 'pending',
                permissions: isSuperAdmin ? Object.values(PERMISSIONS) : [],
                photoURL: firebaseUser.photoURL || '',
                createdAt: serverTimestamp()
              };
              await setDoc(userRef, newUser);
              this.currentUser.set(newUser);
            }
        } catch (e) {
            console.error("Error processing user sync:", e);
        } finally {
            this.isAuthReady.set(true);
        }
    }, async (error: any) => {
        console.error("Error listening to user:", error);
        
        // Critical Fix: If we get a permission denied or listener is cancelled, 
        // we must completely log the user out of Firebase to prevent them from
        // getting stuck on the login page in a half-authenticated state.
        if (error.code === 'permission-denied') {
            console.warn("User access denied by Firestore Rules. Forcing logout.");
            localStorage.setItem('lims_logout_reason', 'permission-denied');
        }
        
        await this.logout(); // This will trigger onAuthStateChanged(null) and clean up state safely
    });
  }

  // --- QR LOGIN HANDSHAKE METHODS (Secure Redesign) ---
  // Luồng mới: Desktop tạo session qua /api/qr/create (Admin SDK),
  // Mobile gửi Firebase ID Token lên /api/qr/approve,
  // Desktop poll /api/qr/status và nhận customToken để đăng nhập.
  // Không có password nào được truyền giữa các thiết bị.

  // Desktop: lắng nghe kết quả từ polling API (không dùng Firestore client)
  // Placeholder - được xử lý hoàn toàn trong login.component.ts qua /api/qr/status

  // Mobile: Xoá session sau khi đã approve thành công (cleanup)
  async deleteAuthSession(sessionId: string) {
      // Session cleanup được xử lý server-side bởi /api/qr/status sau khi cấp customToken.
      // Client chỉ gọi hàm này nếu user cancel thủ công.
      console.log('[Auth] Session cleanup requested for:', sessionId);
  }

  // Placeholder - sẽ bị xoá sau khi mobile-qr-login.component.ts được cập nhật
  /** @deprecated Dùng /api/qr/approve thay thế. Sẽ xoá sau khi redesign hoàn tất. */
  async approveAuthSession(sessionId: string, _email: string, _encryptedPass: string, _deviceName: string) {
      console.warn('[Auth] approveAuthSession is deprecated. Use /api/qr/approve API endpoint.');
  }

  async verifyPassword(email: string, pass: string): Promise<boolean> {
      const authObj = getAuth(this.fb.app);
      if (authObj.currentUser) {
          const credential = EmailAuthProvider.credential(this.normalizeAuthEmail(email), pass);
          await reauthenticateWithCredential(authObj.currentUser, credential);
          return true;
      }
      return false;
  }

  /** Xoá bất kỳ dữ liệu QR login tạm nào còn sót trong localStorage. */
  clearQrLoginCache() {
      localStorage.removeItem('lims_qr_session');
  }

  isGoogleUser(): boolean {
      return this.hasGoogleProvider();
  }

  // --- Permission Checks ---

  // Quyền hạn thời gian thực được tính toán động (Dynamic RBAC)
  readonly userPermissions = computed(() => {
    const u = this.currentUser();
    if (!u) return [];
    if (u.role === 'manager') return ['*']; // Full quyền
    if (u.role === 'viewer') return [];
    if (u.role === 'pending') return [];

    // Người dùng thuộc nhóm Staff
    const roleId = u.roleId;
    const rolePerms = (roleId && this.rolesConfig()[roleId]) || [];
    const customPerms = u.customPermissions || [];
    const combined = Array.from(new Set([...rolePerms, ...customPerms]));
    
    // Fallback: Sử dụng danh sách permissions tĩnh gán trực tiếp nếu chưa đồng bộ config
    if (combined.length === 0 && u.permissions && u.permissions.length > 0) {
      return u.permissions;
    }
    
    return combined;
  });

  /** Phạm vi bảo mật dùng để tách cache DeltaSync theo đúng người dùng và quyền hiện tại. */
  getDeltaCacheScope(): string {
    return buildDeltaAuthScope(this.currentUser(), this.userPermissions());
  }
  
  hasPermission(perm: string): boolean {
    const perms = this.userPermissions();
    return perms.includes('*') || perms.includes(perm);
  }

  getPermissionName(permCode: string): string {
    return PERMISSION_NAMES[permCode] || permCode;
  }

  private async syncRolesConfig() {
    if (this.rolesUnsub) { this.rolesUnsub(); }
    
    // Khởi tạo các vai trò hệ thống mặc định nếu trống
    await this.initializeDefaultRolesIfNeeded();
    
    const rolesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/roles_config`);
    this.rolesUnsub = onSnapshot(rolesRef, (snap: any) => {
        const config: Record<string, string[]> = {};
        snap.forEach((doc: any) => {
            const data = doc.data();
            config[doc.id] = data['permissions'] || [];
        });
        this.rolesConfig.set(config);
    }, (err: any) => {
        console.warn("[Auth] Failed to listen to roles_config:", err);
    });
  }

  private async initializeDefaultRolesIfNeeded() {
    try {
        const rolesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/roles_config`);
        const snap = await getDocs(query(rolesRef, limit(1)));
        if (snap.empty) {
            console.log("[Auth] roles_config is empty. Initializing default system roles...");
            const batch = writeBatch(this.fb.db);
            for (const [roleId, data] of Object.entries(DEFAULT_ROLES)) {
                const roleDocRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/roles_config/${roleId}`);
                batch.set(roleDocRef, data);
            }
            await batch.commit();
            console.log("[Auth] Successfully initialized default system roles.");
        }
    } catch (e) {
        console.warn("[Auth] Failed to initialize default roles:", e);
    }
  }

  canApprove(): boolean { return this.hasPermission(PERMISSIONS.SOP_APPROVE); }
  canApproveStandards(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_APPROVE); }
  canViewStandardLogs(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_LOG_VIEW); }
  canDeleteStandardLogs(): boolean {
    return this.hasPermission(PERMISSIONS.STANDARD_LOG_DELETE) || this.hasPermission(PERMISSIONS.STANDARD_EDIT);
  }

  /** Firebase ID token dùng cho các API server-side cần xác thực. */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    return this.auth.currentUser?.getIdToken(forceRefresh) ?? null;
  }
  canEditInventory(): boolean { return this.hasPermission(PERMISSIONS.INVENTORY_EDIT); }
  canViewInventory(): boolean { return this.hasPermission(PERMISSIONS.INVENTORY_VIEW); }
  canEditSop(): boolean { return this.hasPermission(PERMISSIONS.SOP_EDIT); }
  canViewSop(): boolean { return this.hasPermission(PERMISSIONS.SOP_VIEW); }
  canEditRecipes(): boolean { return this.hasPermission(PERMISSIONS.RECIPE_EDIT); }
  canViewRecipes(): boolean { return this.hasPermission(PERMISSIONS.RECIPE_VIEW); }
  canEditStandards(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_EDIT); }
  canAssignStandards(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_EDIT) || this.hasPermission(PERMISSIONS.STANDARD_APPROVE); }
  canViewStandards(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_VIEW); }
  canViewReports(): boolean { return this.hasPermission(PERMISSIONS.REPORT_VIEW); }
  canManageSystem(): boolean { return this.hasPermission(PERMISSIONS.USER_MANAGE); }
  /** Chạy Smart Batch hoặc Trạm pha chế (thao tác tiêu hao kho thực tế) */
  canRunBatch(): boolean { return this.hasPermission(PERMISSIONS.BATCH_RUN); }
}
