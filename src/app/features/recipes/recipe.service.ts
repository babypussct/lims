
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { 
  collection, doc, getDocs, setDoc, deleteDoc, 
  query, where, orderBy, serverTimestamp, getDoc
} from 'firebase/firestore';
import { Recipe } from '../../core/models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private fb = inject(FirebaseService);

  private get collectionRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes`);
  }

  async getAllRecipes(): Promise<Recipe[]> {
    const q = query(this.collectionRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
  }

  async getRecipesByIds(ids: string[]): Promise<Recipe[]> {
    if (!ids || ids.length === 0) return [];
    // Firestore 'in' query supports max 10, manual filter for small sets is fine or chunking.
    // Since recipes are usually few, fetching all or simple loop is okay for now.
    // Optimized: Fetch specific docs parallelly
    const uniqueIds = [...new Set(ids)];
    const refs = uniqueIds.map(id => doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${id}`));
    const snapshots = await Promise.all(refs.map(ref => getDoc(ref)));
    return snapshots.filter(s => s.exists()).map(s => ({ id: s.id, ...s.data() } as Recipe));
  }

  async saveRecipe(recipe: Recipe): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${recipe.id}`);
    await setDoc(ref, { ...recipe, lastUpdated: serverTimestamp() });
  }

  async deleteRecipe(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${id}`);
    await deleteDoc(ref);
  }
}
