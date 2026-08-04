
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
  private recipesCache: Recipe[] | null = null;
  private recipesLoadedAt = 0;
  private recipesRequest?: Promise<Recipe[]>;
  private readonly cacheTtlMs = 2 * 60 * 1000;

  private get collectionRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes`);
  }

  async getAllRecipes(forceRefresh = false): Promise<Recipe[]> {
    if (!forceRefresh && this.recipesCache && Date.now() - this.recipesLoadedAt < this.cacheTtlMs) {
      return [...this.recipesCache];
    }
    if (!forceRefresh && this.recipesRequest) return this.recipesRequest;

    const request = getDocs(query(this.collectionRef, orderBy('name')))
      .then(snapshot => snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Recipe)))
      .then(items => {
        this.recipesCache = items;
        this.recipesLoadedAt = Date.now();
        return [...items];
      });
    this.recipesRequest = request;
    try {
      return await request;
    } finally {
      if (this.recipesRequest === request) this.recipesRequest = undefined;
    }
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
    this.recipesCache = null;
    this.recipesLoadedAt = 0;
    await this.fb.updateMetadata('recipes');
  }

  async deleteRecipe(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${id}`);
    await deleteDoc(ref);
    this.recipesCache = null;
    this.recipesLoadedAt = 0;
    await this.fb.updateMetadata('recipes');
  }
}
