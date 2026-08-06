import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import * as i0 from "@angular/core";
export class RecipeService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.recipesCache = null;
        this.recipesLoadedAt = 0;
        this.cacheTtlMs = 2 * 60 * 1000;
    }
    get collectionRef() {
        return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes`);
    }
    async getAllRecipes(forceRefresh = false) {
        if (!forceRefresh && this.recipesCache && Date.now() - this.recipesLoadedAt < this.cacheTtlMs) {
            return [...this.recipesCache];
        }
        if (!forceRefresh && this.recipesRequest)
            return this.recipesRequest;
        const request = getDocs(query(this.collectionRef, orderBy('name')))
            .then(snapshot => snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
            .then(items => {
            this.recipesCache = items;
            this.recipesLoadedAt = Date.now();
            return [...items];
        });
        this.recipesRequest = request;
        try {
            return await request;
        }
        finally {
            if (this.recipesRequest === request)
                this.recipesRequest = undefined;
        }
    }
    async getRecipesByIds(ids) {
        if (!ids || ids.length === 0)
            return [];
        // Firestore 'in' query supports max 10, manual filter for small sets is fine or chunking.
        // Since recipes are usually few, fetching all or simple loop is okay for now.
        // Optimized: Fetch specific docs parallelly
        const uniqueIds = [...new Set(ids)];
        const refs = uniqueIds.map(id => doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${id}`));
        const snapshots = await Promise.all(refs.map(ref => getDoc(ref)));
        return snapshots.filter(s => s.exists()).map(s => ({ id: s.id, ...s.data() }));
    }
    async saveRecipe(recipe) {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${recipe.id}`);
        await setDoc(ref, { ...recipe, lastUpdated: serverTimestamp() });
        this.recipesCache = null;
        this.recipesLoadedAt = 0;
        await this.fb.updateMetadata('recipes');
    }
    async deleteRecipe(id) {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/recipes/${id}`);
        await deleteDoc(ref);
        this.recipesCache = null;
        this.recipesLoadedAt = 0;
        await this.fb.updateMetadata('recipes');
    }
    static { this.ɵfac = function RecipeService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RecipeService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: RecipeService, factory: RecipeService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RecipeService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=recipe.service.js.map