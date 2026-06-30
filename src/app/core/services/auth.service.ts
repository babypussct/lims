
import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { environment } from '../../../environments/environment';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signInWithCredential,
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  EmailAuthProvider,
  reauthenticateWithCredential,
  linkWithCredential,
  type User,
  type Auth
} from 'firebase/auth';
import { 
  doc, getDoc, setDoc, serverTimestamp, onSnapshot, deleteDoc, updateDoc, arrayRemove,
  collection, query, limit, getDocs, writeBatch 
} from 'firebase/firestore';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { AuthSession } from '../models/auth.model';
import { DeltaSyncService } from './delta-sync.service';

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
  BATCH_RUN: 'batch_run',  // Chạy Smart Batch & Trạm Pha Chế (thao tác tiêu hao kho)
  REPORT_VIEW: 'report_view',
  USER_MANAGE: 'user_manage',
  STANDARD_REQUEST: 'standard_request', // Đăng ký mượn chuẩn
  BYPASS_MAINTENANCE: 'bypass_maintenance' // Quyền truy cập khi bảo trì (Whitelist)
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
  private deltaSync = inject(DeltaSyncService);
  private auth: Auth;
  private readonly CRED_KEY = 'lims_local_c'; // Key for local storage

  currentUser = signal<UserProfile | null>(null);
  isAuthReady = signal<boolean>(false);
  /** true trong khi đang xử lý token trả về từ Google redirect — dùng để ẩn màn hình Login */
  isProcessingRedirect = signal<boolean>(false);
  private userUnsub: any = null;
  private rolesUnsub: any = null;
  readonly rolesConfig = signal<Record<string, string[]>>({});

  constructor() {
    this.auth = getAuth(this.fb.app);

    // Yêu cầu LIMS tự động thoát khi đóng trình duyệt/tab (hoặc giữ nếu lưu trạng thái)
    const rememberSession = localStorage.getItem('lims_remember_session') === 'true';
    setPersistence(this.auth, rememberSession ? browserLocalPersistence : browserSessionPersistence).catch((err: any) => {
      console.warn('[Auth] Failed to set session persistence:', err);
    });

    // Tự động đồng bộ/di chuyển quyền của chính user đăng nhập lên Firestore nếu chưa khớp
    effect(() => {
      const u = this.currentUser();
      const roles = this.rolesConfig();
      if (u && Object.keys(roles).length > 0) {
        this.autoMigrateUserPermissionsIfNeeded(u, roles);
      }
    });

    // --- DIRECT OIDC LOGIN FALLBACK INTERCEPTOR ---
    // If the manual redirect fallback was used, index.html will capture the id_token
    // from the URL hash and place it in sessionStorage. We process it here BEFORE
    // regular auth state logic.
    const pendingIdToken = sessionStorage.getItem('__google_id_token');
    if (pendingIdToken) {
      sessionStorage.removeItem('__google_id_token'); // Clear immediately
      console.log('[Auth] Intercepted Google ID Token from redirect. Authenticating...');
      this.isProcessingRedirect.set(true); // ← Khoá màn hình Login
      
      const credential = GoogleAuthProvider.credential(pendingIdToken);
      signInWithCredential(this.auth, credential).then((result: any) => {
          console.log('[Auth] Successfully authenticated with ID Token:', result.user.email);
          // onAuthStateChanged sẽ set isProcessingRedirect = false sau khi syncUser xong
      }).catch((e: any) => {
          console.error('[Auth] Failed to authenticate with ID Token:', e);
          this.isProcessingRedirect.set(false); // Mở lại Login nếu lỗi
      });
    }

    // 2. Lắng nghe trạng thái đăng nhập
    onAuthStateChanged(this.auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        this.isProcessingRedirect.set(false); // Tắt overlay khi đã có user
        this.syncUser(firebaseUser);
      } else {
        if (this.userUnsub) { this.userUnsub(); this.userUnsub = null; }
        if (this.rolesUnsub) { this.rolesUnsub(); this.rolesUnsub = null; }
        this.currentUser.set(null);
        this.isAuthReady.set(true);
      }
    });
  }

  // --- LOCAL CREDENTIAL CACHING (For Seamless QR Login) ---
  saveLocalCredentials(email: string, pass: string) {
      // Simple obfuscation for local storage (Not military grade, but prevents casual reading)
      // In a real app, use the device's secure storage (Keychain/Keystore) via Ionic/Capacitor
      try {
          const payload = btoa(encodeURIComponent(`${email}|${pass}`));
          localStorage.setItem(this.CRED_KEY, payload);
      } catch (e) { console.error("Could not save local creds"); }
  }

  getLocalCredentials(): {email: string, pass: string} | null {
      const raw = localStorage.getItem(this.CRED_KEY);
      if(!raw) return null;
      try {
          const decoded = decodeURIComponent(atob(raw));
          const parts = decoded.split('|');
          if (parts.length === 2) {
              return { email: parts[0], pass: parts[1] };
          }
      } catch { return null; }
      return null;
  }

  clearLocalCredentials() {
      localStorage.removeItem(this.CRED_KEY);
  }

  // --- AUTH METHODS ---

  async login(email: string, pass: string) {
    const rememberSession = localStorage.getItem('lims_remember_session') === 'true';
    await setPersistence(this.auth, rememberSession ? browserLocalPersistence : browserSessionPersistence).catch((err: any) => {
      console.warn('[Auth] Failed to set session persistence dynamically:', err);
    });

    await signInWithEmailAndPassword(this.auth, email, pass);
    // Save for QR functionality
    this.saveLocalCredentials(email, pass);
    
    // Fallback: If they were already logged in, onAuthStateChanged might not fire.
    // Force a sync to break out of the stuck state.
    if (!this.currentUser() && this.auth.currentUser) {
        this.syncUser(this.auth.currentUser);
    }
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    // Force account picker — important for shared workstations
    provider.setCustomParameters({ prompt: 'select_account' });

    const rememberSession = localStorage.getItem('lims_remember_session') === 'true';
    await setPersistence(this.auth, rememberSession ? browserLocalPersistence : browserSessionPersistence).catch((err: any) => {
      console.warn('[Auth] Failed to set session persistence dynamically:', err);
    });

    try {
        // ── 1. Try popup first ──
        await signInWithPopup(this.auth, provider);
        if (!this.currentUser() && this.auth.currentUser) {
            this.syncUser(this.auth.currentUser);
        }
    } catch (e: any) {
        if (e.code === 'auth/popup-closed-by-user') {
            throw e; // Trả về cho component xử lý (không chuyển hướng)
        }
        if (e.code === 'auth/popup-blocked') {
            // ── 2. Popup blocked → Bulletproof Direct OpenID Connect Redirect ──
            console.warn('[Auth] Popup blocked or COOP issue. Falling back to manual OpenID Connect redirect.');
            this._authViaDirectOidc();
            // Page navigates away — no further code runs here
            return;
        }
        throw e; // Re-throw real errors
    }
  }

  /**
   * Directly navigates the browser to Google OAuth to get an ID Token.
   * Completely bypasses Firebase's cross-domain redirect handlers.
   */
  private _authViaDirectOidc(): void {
      const config = environment.googleDrive;
      if (!config?.clientId) {
          console.error('[Auth] No clientId found for manual OIDC redirect.');
          return;
      }

      // Save current route so index.html knows where to put the user back
      sessionStorage.setItem('__gd_route', window.location.hash || '#/');

      // Redirect URI must be EXACTLY what is registered in Google Cloud Console
      const redirectUri = window.location.origin; 
      const params = new URLSearchParams({
          client_id: config.clientId,
          redirect_uri: redirectUri,
          response_type: 'id_token',
          scope: 'email profile openid',
          prompt: 'select_account',
          nonce: Math.random().toString(36).substring(2) + Date.now() // Required for id_token
      });

      const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString();
      console.log('[Auth] Redirecting directly to Google OpenID Connect...');
      window.location.href = authUrl;
  }

  async logout() {
    if (this.userUnsub) { this.userUnsub(); this.userUnsub = null; }
    if (this.rolesUnsub) { this.rolesUnsub(); this.rolesUnsub = null; }
    try {
        this.deltaSync.destroyAll(); // Hủy toàn bộ DeltaSync real-time listeners
    } catch (e) {
        console.warn('[Auth] Failed to destroy DeltaSync singletons:', e);
    }
    this.clearLocalCredentials(); // Security cleanup
    localStorage.removeItem('lims_remember_session'); // Clear remember session flag
    
    // Xóa FCM token của thiết bị này để ngừng nhận Push Notifications
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
    
    // Automatically link password provider in background for Google Auth users
    this.linkPasswordProviderIfNeeded(firebaseUser).catch(err => {
        console.warn("[Auth] linkPasswordProviderIfNeeded error:", err);
    });

    // Đồng bộ cấu hình nhóm quyền động
    this.syncRolesConfig().catch(err => {
        console.warn("[Auth] Failed to sync roles_config:", err);
    });
    
    this.userUnsub = onSnapshot(userRef, async (snap: any) => {
        try {
            if (snap.exists()) {
              const data = snap.data() as UserProfile;
              data.uid = firebaseUser.uid; // Ensure uid is present
              
              // Ensure we sync Google Avatar to Firestore so others can see it
              if (firebaseUser.photoURL && data.photoURL !== firebaseUser.photoURL) {
                  data.photoURL = firebaseUser.photoURL;
                  // Don't await here to avoid blocking UI sync, let it update in background
                  updateDoc(userRef, { photoURL: firebaseUser.photoURL }).catch((e: any) => console.error("Could not sync photoURL to Firestore", e));
              }
              
              this.currentUser.set(data);
            } else {
              const newUser: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                role: 'pending',
                permissions: [],
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

  // --- QR LOGIN HANDSHAKE METHODS ---

  async createAuthSession(sessionId: string) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/auth_sessions/${sessionId}`);
      await setDoc(ref, {
          status: 'waiting',
          timestamp: serverTimestamp()
      });
  }

  listenToAuthSession(sessionId: string, onUpdate: (session: AuthSession) => void) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/auth_sessions/${sessionId}`);
      return onSnapshot(ref, (snap: any) => {
          if (snap.exists()) {
              onUpdate({ id: snap.id, ...snap.data() } as AuthSession);
          }
      });
  }

  async deleteAuthSession(sessionId: string) {
      try {
          const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/auth_sessions/${sessionId}`);
          await deleteDoc(ref);
      } catch(e) { console.warn("Cleanup error", e); }
  }

  async approveAuthSession(sessionId: string, email: string, encryptedPass: string, deviceName: string) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/auth_sessions/${sessionId}`);
      const payload = `${email}|${encryptedPass}`;
      await setDoc(ref, {
          status: 'approved',
          encryptedCreds: payload,
          deviceInfo: deviceName,
          timestamp: serverTimestamp()
      }, { merge: true });
  }

  async verifyPassword(email: string, pass: string): Promise<boolean> {
      const authObj = getAuth(this.fb.app);
      if (authObj.currentUser) {
          const credential = EmailAuthProvider.credential(email, pass);
          await reauthenticateWithCredential(authObj.currentUser, credential);
          return true;
      }
      return false;
  }

  isGoogleUser(): boolean {
      const authObj = getAuth(this.fb.app);
      return authObj.currentUser?.providerData?.some((p: any) => p.providerId === 'google.com') || false;
  }

  generateDeterministicPassword(uid: string): string {
      const salt = "lims_secure_salt_2026_nafiqpm6";
      return btoa(uid + salt).substring(0, 30);
  }

  async linkPasswordProviderIfNeeded(user: User) {
      try {
          const hasPassword = user.providerData.some((p: any) => p.providerId === 'password');
          if (!hasPassword && user.email) {
              const pass = this.generateDeterministicPassword(user.uid);
              const credential = EmailAuthProvider.credential(user.email, pass);
              await linkWithCredential(user, credential);
              console.log("[Auth] Successfully linked background password provider for QR login.");
          }
      } catch (e) {
          console.warn("[Auth] Failed to link password provider (provider might already be linked or error):", e);
      }
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
  
  hasPermission(perm: string): boolean {
    const perms = this.userPermissions();
    return perms.includes('*') || perms.includes(perm);
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

  private async autoMigrateUserPermissionsIfNeeded(u: UserProfile, roles: Record<string, string[]>) {
    if (!u || !u.role || u.role === 'manager' || u.role === 'pending') return;
    
    let resolvedPerms: string[] = [];
    let needsUpdate = false;

    if (u.role === 'viewer') {
      const viewerPerms: string[] = [];
      if (!u.permissions || u.permissions.length !== viewerPerms.length) {
        resolvedPerms = viewerPerms;
        needsUpdate = true;
      }
    } else if (u.role === 'staff') {
      const roleId = u.roleId || 'role_staff_default';
      const rolePerms = roles[roleId];
      if (rolePerms) {
        const custom = u.customPermissions || [];
        resolvedPerms = Array.from(new Set([...rolePerms, ...custom]));
        if (!u.permissions || u.permissions.length !== resolvedPerms.length || !resolvedPerms.every(p => u.permissions!.includes(p))) {
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      console.log(`[Auth] Auto-migrating/updating permissions for logged-in user ${u.displayName}...`);
      try {
        const userRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/users/${u.uid}`);
        await updateDoc(userRef, { 
          permissions: resolvedPerms,
          lastUpdated: serverTimestamp()
        });
        console.log(`[Auth] Auto-migration complete for ${u.displayName}.`);
      } catch (e) {
        console.warn("[Auth] Failed to auto-migrate user permissions:", e);
      }
    }
  }

  canApprove(): boolean { return this.hasPermission(PERMISSIONS.SOP_APPROVE); }
  canApproveStandards(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_APPROVE); }
  canViewStandardLogs(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_LOG_VIEW); }
  canDeleteStandardLogs(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_LOG_DELETE); }
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
  /** Chạy Smart Batch hoặc Trạm Pha Chế (thao tác tiêu hao kho thực tế) */
  canRunBatch(): boolean { return this.hasPermission(PERMISSIONS.BATCH_RUN); }
}
