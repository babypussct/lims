import { Injectable, inject, signal } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import * as i0 from "@angular/core";
export class TargetService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.groupsSignal = signal([]);
        this.groups = this.groupsSignal.asReadonly();
    }
    get collectionRef() {
        return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups`);
    }
    getAllGroups(forceRefresh = false) {
        if (!this.groupsPromise || forceRefresh) {
            const q = query(this.collectionRef, orderBy('name'));
            this.groupsPromise = getDocs(q)
                .then(snapshot => {
                const groups = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                this.groupsSignal.set(groups);
                return groups;
            })
                .catch(error => {
                this.groupsPromise = undefined;
                throw error;
            });
        }
        return this.groupsPromise;
    }
    async getGroupById(id) {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${id}`);
        const snap = await getDoc(ref);
        return snap.exists() ? { id: snap.id, ...snap.data() } : undefined;
    }
    async saveGroup(group) {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${group.id}`);
        await setDoc(ref, { ...group, lastUpdated: serverTimestamp() });
        this.groupsPromise = undefined;
        await this.getAllGroups(true);
    }
    async deleteGroup(id) {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${id}`);
        await deleteDoc(ref);
        this.groupsPromise = undefined;
        await this.getAllGroups(true);
    }
    static { this.ɵfac = function TargetService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TargetService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: TargetService, factory: TargetService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TargetService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=target.service.js.map