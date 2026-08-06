import { Injectable, inject } from '@angular/core';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import * as i0 from "@angular/core";
export class ReleaseService {
    constructor() {
        this.fb = inject(FirebaseService);
    }
    get releasesCollection() {
        return collection(this.fb.db, 'releases');
    }
    async getRelease(version) {
        const normalizedVersion = this.normalizeVersion(version);
        const snapshot = await getDoc(doc(this.releasesCollection, normalizedVersion));
        return snapshot.exists() ? this.toReleaseDoc(snapshot.id, snapshot.data()) : null;
    }
    async getLatestReleases(limitCount = 3) {
        const safeLimit = Math.max(1, Math.min(Math.floor(limitCount), 20));
        try {
            const snapshot = await getDocs(query(this.releasesCollection, orderBy('releaseOrder', 'desc'), limit(safeLimit)));
            return snapshot.docs.map(item => this.toReleaseDoc(item.id, item.data()));
        }
        catch (error) {
            // Older migrated data may not have releaseOrder yet. A one-time fallback
            // keeps the UI usable while the migration is being completed.
            console.warn('[ReleaseService] Không thể query releaseOrder, dùng fallback:', error);
            const snapshot = await getDocs(this.releasesCollection);
            return snapshot.docs
                .map(item => this.toReleaseDoc(item.id, item.data()))
                .sort((a, b) => this.compareReleases(a, b))
                .slice(0, safeLimit);
        }
    }
    async getAllReleases() {
        try {
            const snapshot = await getDocs(query(this.releasesCollection, orderBy('releaseOrder', 'desc')));
            return snapshot.docs.map(item => this.toReleaseDoc(item.id, item.data()));
        }
        catch (error) {
            console.warn('[ReleaseService] Không thể query releaseOrder, dùng fallback:', error);
            const snapshot = await getDocs(this.releasesCollection);
            return snapshot.docs
                .map(item => this.toReleaseDoc(item.id, item.data()))
                .sort((a, b) => this.compareReleases(a, b));
        }
    }
    async ensureReleaseExists(version, appData) {
        const normalizedVersion = this.normalizeVersion(version);
        const existing = await this.getRelease(normalizedVersion);
        if (existing)
            return;
        const release = {
            version: normalizedVersion,
            date: appData.date?.trim() || new Intl.DateTimeFormat('vi-VN').format(new Date()),
            title: appData.title?.trim() || 'Cập nhật hệ thống',
            highlights: this.normalizeItems(appData.highlights),
            features: this.normalizeItems(appData.features),
            improvements: this.normalizeItems(appData.improvements),
            fixes: this.normalizeItems(appData.fixes),
            releaseOrder: this.getReleaseOrder(normalizedVersion)
        };
        await setDoc(doc(this.releasesCollection, normalizedVersion), {
            ...release,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }
    toReleaseDoc(id, data) {
        const version = this.normalizeVersion(String(data['version'] || id));
        return {
            id,
            version,
            date: typeof data['date'] === 'string' ? data['date'] : '',
            title: typeof data['title'] === 'string' ? data['title'] : 'Cập nhật hệ thống',
            highlights: this.normalizeItems(data['highlights']),
            features: this.normalizeItems(data['features']),
            improvements: this.normalizeItems(data['improvements']),
            fixes: this.normalizeItems(data['fixes']),
            releaseOrder: typeof data['releaseOrder'] === 'number'
                ? data['releaseOrder']
                : this.getReleaseOrder(version),
            createdAt: data['createdAt'],
            updatedAt: data['updatedAt'],
            migratedAt: data['migratedAt']
        };
    }
    normalizeItems(value) {
        return Array.isArray(value)
            ? value.filter((item) => typeof item === 'string' && item.trim().length > 0)
                .map(item => item.trim())
            : [];
    }
    normalizeVersion(version) {
        const value = version.trim();
        return value.startsWith('v') ? value : `v${value}`;
    }
    getReleaseOrder(version) {
        const match = version.match(/^v(\d{2})\.(\d{2})\.(\d{2})-b(\d+)$/);
        if (!match)
            return 0;
        return Number(match[1]) * 1_000_000_000
            + Number(match[2]) * 10_000_000
            + Number(match[3]) * 100_000
            + Number(match[4]);
    }
    compareReleases(a, b) {
        return (b.releaseOrder || this.getReleaseOrder(b.version))
            - (a.releaseOrder || this.getReleaseOrder(a.version));
    }
    static { this.ɵfac = function ReleaseService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ReleaseService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ReleaseService, factory: ReleaseService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ReleaseService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=release.service.js.map