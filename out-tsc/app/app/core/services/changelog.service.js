import { Injectable, inject, signal } from '@angular/core';
import { ReleaseService } from './release.service';
import * as i0 from "@angular/core";
export class ChangelogService {
    constructor() {
        this.releaseService = inject(ReleaseService);
        this.isOpen = signal(false);
        this.activeVersion = signal(null);
        this.latestReleases = signal([]);
        this.allReleases = signal([]);
        this.loading = signal(false);
        this.error = signal(null);
    }
    async loadLatest() {
        await this.load(() => this.releaseService.getLatestReleases(3), this.latestReleases);
    }
    async loadAll() {
        await this.load(() => this.releaseService.getAllReleases(), this.allReleases);
    }
    open(version) {
        this.activeVersion.set(version || null);
        this.isOpen.set(true);
    }
    close() {
        this.isOpen.set(false);
    }
    toggle() {
        this.isOpen.update(value => !value);
    }
    async load(loader, target) {
        this.loading.set(true);
        this.error.set(null);
        try {
            target.set(await loader());
        }
        catch (error) {
            console.warn('[Changelog] Không thể tải release từ Firestore:', error);
            target.set([]);
            this.error.set('Không thể tải nhật ký phiên bản lúc này.');
        }
        finally {
            this.loading.set(false);
        }
    }
    static { this.ɵfac = function ChangelogService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ChangelogService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ChangelogService, factory: ChangelogService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ChangelogService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=changelog.service.js.map