
import { Injectable, inject, signal, computed } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  type User,
  type Auth
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, deleteDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AuthSession } from '../models/auth.model';

export const PERMISSIONS = {
  INVENTORY_VIEW: 'inventory_view',
  INVENTORY_EDIT: 'inventory_edit',
  STANDARD_VIEW: 'standard_view',
  STANDARD_EDIT: 'standard_edit',
  RECIPE_VIEW: 'recipe_view',
  RECIPE_EDIT: 'recipe_edit',
  SOP_VIEW: 'sop_view',
  SOP_EDIT: 'sop_edit',
  SOP_APPROVE: 'sop_approve',
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

  currentUser = signal<UserProfile | null>(null);

  constructor() {
    this.auth = getAuth(this.fb.app);
    
    onAuthStateChanged(this.auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        await this.syncUser(firebaseUser);
      } else {
        this.currentUser.set(null);
      }
    });
  }

  async login(email: string, pass: string) {
    await signInWithEmailAndPassword(this.auth, email, pass);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  async logout() {
    await signOut(this.auth);
  }

  private async syncUser(firebaseUser: User) {
    const userRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/users/${firebaseUser.uid}`);
    try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          this.currentUser.set(snap.data() as UserProfile);
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
        console.error("Error syncing user:", e);
        this.currentUser.set(null);
    }
  }

  // --- QR LOGIN HANDSHAKE METHODS ---

  // 1. Desktop: Create a session waiting for mobile
  async createAuthSession(sessionId: string) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/auth_sessions/${sessionId}`);
      await setDoc(ref, {
          status: 'waiting',
          timestamp: serverTimestamp()
      });
  }

  // 2. Desktop: Listen for mobile approval
  listenToAuthSession(sessionId: string, onUpdate: (session: AuthSession) => void) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/auth_sessions/${sessionId}`);
      return onSnapshot(ref, (snap) => {
          if (snap.exists()) {
              onUpdate({ id: snap.id, ...snap.data() } as AuthSession);
          }
      });
  }

  // 3. Desktop: Cleanup
  async deleteAuthSession(sessionId: string) {
      try {
          const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/auth_sessions/${sessionId}`);
          await deleteDoc(ref);
      } catch(e) { console.warn("Cleanup error", e); }
  }

  // 4. Mobile: Approve and send credentials (Encrypted)
  async approveAuthSession(sessionId: string, email: string, encryptedPass: string, deviceName: string) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/auth_sessions/${sessionId}`);
      // Write the credentials securely (Client-side encryption logic applies here)
      // We store: email|encrypted_password
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
  canEditInventory(): boolean { return this.hasPermission(PERMISSIONS.INVENTORY_EDIT); }
  canViewInventory(): boolean { return this.hasPermission(PERMISSIONS.INVENTORY_VIEW); }
  canEditSop(): boolean { return this.hasPermission(PERMISSIONS.SOP_EDIT); }
  canViewSop(): boolean { return this.hasPermission(PERMISSIONS.SOP_VIEW); }
  canEditRecipes(): boolean { return this.hasPermission(PERMISSIONS.RECIPE_EDIT); }
  canViewRecipes(): boolean { return this.hasPermission(PERMISSIONS.RECIPE_VIEW); }
  canEditStandards(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_EDIT); }
  canViewStandards(): boolean { return this.hasPermission(PERMISSIONS.STANDARD_VIEW); }
  canViewReports(): boolean { return this.hasPermission(PERMISSIONS.REPORT_VIEW); }
  canManageSystem(): boolean { return this.hasPermission(PERMISSIONS.USER_MANAGE); }
}
