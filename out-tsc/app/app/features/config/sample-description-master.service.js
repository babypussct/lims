import { Injectable, inject } from '@angular/core';
import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { FirebaseService } from '../../core/services/firebase.service';
import * as i0 from "@angular/core";
export class SampleDescriptionMasterService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.cacheTtlMs = 5 * 60 * 1000;
        this.cachedAll = null;
        this.cachedAt = 0;
    }
    get collectionRef() {
        return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/sample_description_master`);
    }
    async getAll(forceRefresh = false) {
        if (!forceRefresh && this.cachedAll && Date.now() - this.cachedAt < this.cacheTtlMs) {
            return this.cachedAll;
        }
        if (this.inFlight)
            return this.inFlight;
        const load = (async () => {
            const snapshot = await getDocs(query(this.collectionRef, orderBy('name')));
            const items = snapshot.docs.map(item => ({
                id: item.id,
                ...item.data(),
                isActive: item.data()['isActive'] !== false
            }));
            this.cachedAll = items;
            this.cachedAt = Date.now();
            return items;
        })();
        this.inFlight = load;
        try {
            return await load;
        }
        finally {
            if (this.inFlight === load)
                this.inFlight = undefined;
        }
    }
    invalidateCache() {
        this.cachedAll = null;
        this.cachedAt = 0;
    }
    async getActive() {
        return (await this.getAll()).filter(item => item.isActive);
    }
    async save(item, actorName = '') {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/sample_description_master/${item.id}`);
        await setDoc(ref, {
            ...item,
            aliases: (item.aliases || []).map(alias => alias.trim()).filter(Boolean),
            isActive: item.isActive !== false,
            updatedAt: serverTimestamp(),
            updatedBy: actorName || null
        }, { merge: true });
        this.invalidateCache();
    }
    async saveBatch(items, actorName = '') {
        for (let index = 0; index < items.length; index += 400) {
            const batch = writeBatch(this.fb.db);
            items.slice(index, index + 400).forEach(item => {
                const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/sample_description_master/${item.id}`);
                batch.set(ref, {
                    ...item,
                    aliases: (item.aliases || []).map(alias => alias.trim()).filter(Boolean),
                    isActive: item.isActive !== false,
                    updatedAt: serverTimestamp(),
                    updatedBy: actorName || null
                }, { merge: true });
            });
            await batch.commit();
        }
        this.invalidateCache();
    }
    async setActive(item, isActive, actorName = '') {
        await this.save({ ...item, isActive }, actorName);
    }
    static { this.ɵfac = function SampleDescriptionMasterService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SampleDescriptionMasterService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: SampleDescriptionMasterService, factory: SampleDescriptionMasterService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SampleDescriptionMasterService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=sample-description-master.service.js.map