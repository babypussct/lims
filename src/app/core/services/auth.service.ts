
import { Injectable, inject, signal, computed } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signInWithCredential,
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  type User,
  type Auth
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AuthSession } from '../models/auth.model';

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
  USER_MANAGE: 'user_manage'
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'manager' | 'staff' | 'viewer' | 'pending';
  permissions?: string[];
  photoURL?: string;
  createdAt?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fb = inject(FirebaseService);
  private auth: Auth;
  private readonly CRED_KEY = 'lims_local_c'; // Key for local storage

  currentUser = signal<UserProfile | null>(null);
  isAuthReady = signal<boolean>(false);
  /** true trong khi đang xử lý token trả về từ Google redirect — dùng để ẩn màn hình Login */
  isProcessingRedirect = signal<boolean>(false);
  private userUnsub: any = null;

  constructor() {
    this.auth = getAuth(this.fb.app);

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
      signInWithCredential(this.auth, credential).then(result => {
          console.log('[Auth] Successfully authenticated with ID Token:', result.user.email);
          // onAuthStateChanged sẽ set isProcessingRedirect = false sau khi syncUser xong
      }).catch(e => {
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

    try {
        // ── 1. Try popup first ──
        await signInWithPopup(this.auth, provider);
        if (!this.currentUser() && this.auth.currentUser) {
            this.syncUser(this.auth.currentUser);
        }
    } catch (e: any) {
        if (e.code === 'auth/popup-blocked') {
            // ── 2. Popup blocked → Bulletproof Direct OpenID Connect Redirect ──
            console.warn('[Auth] Popup blocked. Falling back to manual OpenID Connect redirect.');
            this._authViaDirectOidc();
            // Page navigates away — no further code runs here
            return;
        }
        if (e.code !== 'auth/popup-closed-by-user') {
            throw e; // Re-throw real errors
        }
    }
  }

  /**
   * Directly navigates the browser to Google OAuth to get an ID Token.
   * Completely bypasses Firebase's cross-domain redirect handlers.
   */
  private _authViaDirectOidc(): void {
      const config = require('../../../environments/environment').environment.googleDrive;
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
    this.clearLocalCredentials(); // Security cleanup
    await signOut(this.auth);
  }

  private syncUser(firebaseUser: User) {
    if (this.userUnsub) { this.userUnsub(); }
    const userRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/users/${firebaseUser.uid}`);
    
    this.userUnsub = onSnapshot(userRef, async (snap) => {
        try {
            if (snap.exists()) {
              const data = snap.data() as UserProfile;
              data.uid = firebaseUser.uid; // Ensure uid is present
              
              // Ensure we sync Google Avatar to Firestore so others can see it
              if (firebaseUser.photoURL && data.photoURL !== firebaseUser.photoURL) {
                  data.photoURL = firebaseUser.photoURL;
                  // Don't await here to avoid blocking UI sync, let it update in background
                  updateDoc(userRef, { photoURL: firebaseUser.photoURL }).catch(e => console.error("Could not sync photoURL to Firestore", e));
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
    }, async (error) => {
        console.error("Error listening to user:", error);
        
        // Critical Fix: If we get a permission denied or listener is cancelled, 
        // we must completely log the user out of Firebase to prevent them from
        // getting stuck on the login page in a half-authenticated state.
        if (error.code === 'permission-denied') {
            console.warn("User access denied by Firestore Rules. Forcing logout.");
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
      return onSnapshot(ref, (snap) => {
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

  // --- Permission Checks ---
  
  hasPermission(perm: string): boolean {
    const u = this.currentUser();
    if (!u) return false;
    if (u.role === 'manager') return true;
    return u.permissions?.includes(perm) || false;
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
