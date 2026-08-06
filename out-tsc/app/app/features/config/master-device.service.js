import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { collection, doc, getDocs, setDoc, deleteDoc, writeBatch, query, orderBy, serverTimestamp } from 'firebase/firestore';
import * as i0 from "@angular/core";
export class MasterDeviceService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.cacheTtlMs = 5 * 60 * 1000;
        this.cachedAll = null;
        this.cachedAt = 0;
    }
    get colRef() {
        return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices`);
    }
    async getAll(forceRefresh = false) {
        if (!forceRefresh && this.cachedAll && Date.now() - this.cachedAt < this.cacheTtlMs) {
            return this.cachedAll;
        }
        if (this.inFlight)
            return this.inFlight;
        const load = (async () => {
            const q = query(this.colRef, orderBy('name'));
            const snap = await getDocs(q);
            const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
    async save(device) {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices/${device.id}`);
        await setDoc(ref, { ...device, lastUpdated: serverTimestamp() });
        this.invalidateCache();
    }
    async delete(id) {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices/${id}`);
        await deleteDoc(ref);
        this.invalidateCache();
    }
    async toggleDefault(item) {
        const all = await this.getAll();
        const batch = writeBatch(this.fb.db);
        const willBeDefault = !item.isDefault; // Toggle
        for (const d of all) {
            const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices/${d.id}`);
            if (d.id === item.id) {
                batch.update(ref, { isDefault: willBeDefault, lastUpdated: serverTimestamp() });
            }
            else if (d.isDefault) {
                batch.update(ref, { isDefault: false, lastUpdated: serverTimestamp() });
            }
        }
        await batch.commit();
        this.invalidateCache();
    }
    async seedDefaults() {
        const existing = await this.getAll();
        if (existing.length > 0)
            return;
        await this.save({ id: 'gcmsms', name: 'GC-MS/MS' });
        await this.save({ id: 'gcms', name: 'GC-MS' });
        await this.save({ id: 'lcmsms', name: 'LC-MS/MS' });
    }
    static { this.ɵfac = function MasterDeviceService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MasterDeviceService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: MasterDeviceService, factory: MasterDeviceService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MasterDeviceService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=master-device.service.js.map