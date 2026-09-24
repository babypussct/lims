
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { 
  collection, doc, getDocs, setDoc, deleteDoc, 
  query, orderBy, serverTimestamp, getDoc
} from 'firebase/firestore';
import { Recipe } from '../../core/models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private fb = inject(FirebaseService);
  private recipesCache: Recipe[] | null = null;
  private recipesLoadedAt = 0;
  private recipesRequest?: Promise<Recipe[]>;
  private recipeByIdCache = new Map<string, { item: Recipe | null; loadedAt: number }>();
  private recipeByIdRequests = new Map<string, Promise<Recipe | null>>();
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
        const loadedAt = Date.now();
        this.recipesCache = items;
        this.recipesLoadedAt = loadedAt;
        this.recipeByIdCache.clear();
        items.forEach(item => this.recipeByIdCache.set(item.id, { item, loadedAt }));
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
    const uniqueIds = [...new Set(ids)];

    // A fresh full-list cache is complete, so it can answer both hits and
    // misses without another Firestore lookup.
    if (this.recipesCache && Date.now() - this.recipesLoadedAt < this.cacheTtlMs) {
      const wanted = new Set(uniqueIds);
      return this.recipesCache.filter(recipe => wanted.has(recipe.id));
    }

    // Reuse an in-flight full-list request instead of racing it with per-id reads.
    if (this.recipesRequest) {
      const recipes = await this.recipesRequest;
      const wanted = new Set(uniqueIds);
      return recipes.filter(recipe => wanted.has(recipe.id));
    }

    const items = await Promise.all(uniqueIds.map(id => this.getRecipeByIdCached(id)));
    return items.filter((item): item is Recipe => Boolean(item));
  }

  private async getRecipeByIdCached(id: string): Promise<Recipe | null> {
    const cached = this.recipeByIdCache.get(id);
    if (cached && Date.now() - cached.loadedAt < this.cacheTtlMs) return cached.item;

    const inFlight = this.recipeByIdRequests.get(id);
    if (inFlight) return inFlight;

    const request = getDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${id}`))
      .then(snapshot => snapshot.exists()
        ? ({ id: snapshot.id, ...snapshot.data() } as Recipe)
        : null
      )
      .then(item => {
        this.recipeByIdCache.set(id, { item, loadedAt: Date.now() });
        return item;
      });
    this.recipeByIdRequests.set(id, request);
    try {
      return await request;
    } finally {
      if (this.recipeByIdRequests.get(id) === request) this.recipeByIdRequests.delete(id);
    }
  }

  async saveRecipe(recipe: Recipe): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${recipe.id}`);
    await setDoc(ref, { ...recipe, lastUpdated: serverTimestamp() });
    this.recipesCache = null;
    this.recipesLoadedAt = 0;
    this.recipeByIdCache.set(recipe.id, { item: recipe, loadedAt: Date.now() });
    await this.fb.updateMetadata('recipes');
  }

  async deleteRecipe(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${id}`);
    await deleteDoc(ref);
    this.recipesCache = null;
    this.recipesLoadedAt = 0;
    this.recipeByIdCache.set(id, { item: null, loadedAt: Date.now() });
    await this.fb.updateMetadata('recipes');
  }
}
