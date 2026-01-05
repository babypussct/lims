
import { Injectable, inject, signal } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, signOut, User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'manager' | 'staff';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fb = inject(FirebaseService);
  private auth = getAuth(this.fb.db.app);

  // Signal holding current user state
  currentUser = signal<UserProfile | null>(null);
  loading = signal<boolean>(true);

  constructor() {
    // Restore session on load
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.fetchUserProfile(user);
      } else {
        this.currentUser.set(null);
      }
      this.loading.set(false);
    });
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
      // Force account selection to avoid auto-login to wrong account
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
      // Reload to ensure all states (services, signals) are reset completely
      window.location.reload();
    }
  }

  private async fetchUserProfile(user: User) {
    try {
      // Fetch Role from Firestore: artifacts/{APP_ID}/users/{uid}
      const userDocRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/users`, user.uid);
      const snapshot = await getDoc(userDocRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        this.currentUser.set({
          uid: user.uid,
          email: user.email!,
          displayName: data['displayName'] || user.displayName || user.email?.split('@')[0] || 'User',
          role: data['role'] || 'staff'
        });
      } else {
        // Default for users not yet in Firestore (First time Google Login)
        this.currentUser.set({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email?.split('@')[0] || 'Staff',
          role: 'staff' // Default role is always STAFF until promoted manually in DB
        });
      }
    } catch (e: any) {
      // If permission denied, assume default staff role but don't crash
      if (e.code === 'permission-denied') {
        console.warn('Profile read denied. Using default Staff role.');
      } else {
        console.error('Error fetching user profile', e);
      }
      
      // Fallback
      this.currentUser.set({
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        role: 'staff'
      });
    }
  }
}
