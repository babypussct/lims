
import { Injectable, inject, signal, computed } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

// --- RBAC DEFINITIONS ---
// Defined granular permissions for the entire system
export const PERMISSIONS = {
  // Inventory (Kho hóa chất)
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_EDIT: 'inventory.edit', // Create, Update, Delete Items
  
  // Standards (Chuẩn đối chiếu)
  STANDARD_VIEW: 'standard.view',
  STANDARD_EDIT: 'standard.edit', // Create, Update, Delete Standards & Logs

  // Recipes (Thư viện công thức)
  RECIPE_VIEW: 'recipe.view',
  RECIPE_EDIT: 'recipe.edit',

  // SOPs (Quy trình)
  SOP_VIEW: 'sop.view',
  SOP_EDIT: 'sop.edit', // Create/Edit SOP Structure
  SOP_APPROVE: 'sop.approve', // Approve Requests & Direct Print (Managerial Task)
  
  // Reports & System
  REPORT_VIEW: 'report.view', // Access Statistics
  USER_MANAGE: 'user.manage', // Manage Users & Config (Highest Level)
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'manager' | 'staff' | 'viewer' | 'pending'; // Added 'pending'
  permissions?: string[]; // Granular permissions
  lastLogin?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fb = inject(FirebaseService);
  private auth = getAuth(this.fb.db.app);

  // Signal holding current user state
  currentUser = signal<UserProfile | null>(null);
  loading = signal<boolean>(true);

  // Computed Permission Checkers for UI Convenience
  // Note: 'Manager' role automatically returns TRUE for all these via hasPermission()
  
  canViewInventory = computed(() => this.hasPermission(PERMISSIONS.INVENTORY_VIEW));
  canEditInventory = computed(() => this.hasPermission(PERMISSIONS.INVENTORY_EDIT));
  
  canViewStandards = computed(() => this.hasPermission(PERMISSIONS.STANDARD_VIEW));
  canEditStandards = computed(() => this.hasPermission(PERMISSIONS.STANDARD_EDIT));

  canViewRecipes = computed(() => this.hasPermission(PERMISSIONS.RECIPE_VIEW));
  canEditRecipes = computed(() => this.hasPermission(PERMISSIONS.RECIPE_EDIT));

  canViewSop = computed(() => this.hasPermission(PERMISSIONS.SOP_VIEW));
  canEditSop = computed(() => this.hasPermission(PERMISSIONS.SOP_EDIT));
  canApprove = computed(() => this.hasPermission(PERMISSIONS.SOP_APPROVE));
  
  canViewReports = computed(() => this.hasPermission(PERMISSIONS.REPORT_VIEW));
  canManageSystem = computed(() => this.hasPermission(PERMISSIONS.USER_MANAGE));

  constructor() {
    // Restore session on load
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        await this.fetchUserProfile(user);
      } else {
        this.currentUser.set(null);
      }
      this.loading.set(false);
    });
  }

  // Core Permission Check Logic
  hasPermission(perm: string): boolean {
    const user = this.currentUser();
    if (!user) return false;
    
    // 0. Pending users have NO permissions
    if (user.role === 'pending') return false;

    // 1. Manager has ALL permissions overrides
    if (user.role === 'manager') return true;
    
    // 2. Check explicit permissions array
    return user.permissions?.includes(perm) || false;
  }

  async login(email: string, pass: string) {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, pass);
      await this.fetchUserProfile(credential.user);
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(this.auth, provider);
      await this.fetchUserProfile(credential.user);
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (e) {
      console.error('Logout error (ignored)', e);
    } finally {
      window.location.reload();
    }
  }

  private async fetchUserProfile(user: User) {
    try {
      const userDocRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/users`, user.uid);
      const snapshot = await getDoc(userDocRef);

      let profile: UserProfile;

      if (snapshot.exists()) {
        const data = snapshot.data();
        profile = {
          uid: user.uid,
          email: user.email!,
          displayName: data['displayName'] || user.displayName || user.email?.split('@')[0] || 'User',
          role: data['role'] || 'pending', // Default fallback to pending if data missing
          permissions: data['permissions'] || []
        };
      } else {
        // ZERO TRUST DEFAULT:
        // New users get 'pending' role and NO permissions.
        profile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email?.split('@')[0] || 'Guest',
          role: 'pending',
          permissions: [] 
        };
      }

      // Update basic info (last login, display name) without overwriting permissions if existing
      try {
          await setDoc(userDocRef, {
              email: profile.email,
              displayName: profile.displayName,
              lastLogin: serverTimestamp(),
              // Only set default role/permissions if document didn't exist
              ...(!snapshot.exists() ? { role: profile.role, permissions: profile.permissions } : {})
          }, { merge: true });
      } catch (writeErr: any) {
          console.warn('Could not update user profile (likely permission issue):', writeErr.message);
      }

      this.currentUser.set(profile);

    } catch (e: any) {
      if (e.code === 'permission-denied') {
        console.warn('Profile read denied. Using default Pending role.');
      }
      // Fallback for restricted users / errors
      this.currentUser.set({
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        role: 'pending',
        permissions: []
      });
    }
  }
}
