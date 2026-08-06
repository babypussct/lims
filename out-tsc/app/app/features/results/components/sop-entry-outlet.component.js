import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
const _c0 = ["host"];
function SopEntryOutletComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 1);
    i0.ɵɵtext(1, " \u0110ang t\u1EA3i bi\u1EC3u m\u1EABu SOP... ");
    i0.ɵɵelementEnd();
} }
export class SopEntryOutletComponent {
    constructor() {
        this.configKey = null;
        this.formType = null;
        this.activeFilter = 'ALL';
        this.isReadOnly = false;
        this.publishedSampleSet = null;
        this.draftChanged = new EventEmitter();
        this.isLoading = false;
        this.activeComponentId = null;
        this.loadGeneration = 0;
    }
    async ngOnChanges(changes) {
        const nextDefinition = this.resolveDefinition();
        const nextComponentId = this.resolveComponentId();
        if (changes['configKey'] || changes['formType'] || !this.componentRef || nextComponentId !== this.activeComponentId) {
            await this.mount(nextComponentId, nextDefinition);
            return;
        }
        this.applyInputs(nextDefinition.inputs);
    }
    ngOnDestroy() {
        this.destroyActiveComponent();
        this.loadGeneration++;
    }
    async mount(componentId, definition) {
        const generation = ++this.loadGeneration;
        this.destroyActiveComponent();
        this.isLoading = true;
        try {
            const componentType = await definition.load();
            if (generation !== this.loadGeneration)
                return;
            this.host.clear();
            this.componentRef = this.host.createComponent(componentType);
            this.activeComponentId = componentId;
            this.applyInputs(definition.inputs);
            const emitter = this.componentRef.instance?.draftChanged;
            if (emitter?.subscribe) {
                this.outputSub = emitter.subscribe((draft) => this.draftChanged.emit(draft));
            }
        }
        finally {
            if (generation === this.loadGeneration) {
                this.isLoading = false;
            }
        }
    }
    applyInputs(inputs) {
        if (!this.componentRef)
            return;
        const values = {
            run: this.run,
            draft: this.draft,
            config: this.config,
            publishedSampleSet: this.publishedSampleSet,
            activeFilter: this.activeFilter,
            isReadOnly: this.isReadOnly
        };
        inputs.forEach(input => this.componentRef.setInput(input, values[input]));
        this.componentRef.changeDetectorRef.detectChanges();
    }
    destroyActiveComponent() {
        if (this.outputSub) {
            this.outputSub.unsubscribe();
            this.outputSub = undefined;
        }
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = undefined;
        }
        this.host?.clear();
        this.activeComponentId = null;
    }
    resolveComponentId() {
        return `${this.formType || 'type2'}:${this.configKey || 'default'}`;
    }
    resolveDefinition() {
        const key = this.configKey || '';
        if (this.formType === 'type3b') {
            if (key === 'chlor-huu-co') {
                return {
                    load: () => import('../sops/sop-nhom-lan-huu-co-gc-msms-copy-1768036876719/sop-nhom-lan-huu-co-gc-msms-copy-1768036876719-entry.component').then(m => m.SopNhomLanHuuCoGcMsmsCopy1768036876719EntryComponent),
                    inputs: ['run', 'draft', 'config', 'isReadOnly', 'publishedSampleSet']
                };
            }
            if (key === 'lan-huu-co') {
                return {
                    load: () => import('../sops/sop-lan-huu-co/sop-lan-huu-co-entry.component').then(m => m.SopLanHuuCoEntryComponent),
                    inputs: ['run', 'draft', 'config', 'isReadOnly', 'publishedSampleSet']
                };
            }
            if (key === 'nhom-cuc') {
                return {
                    load: () => import('../sops/sop-1767856825928/sop-1767856825928-entry.component').then(m => m.Sop1767856825928EntryComponent),
                    inputs: ['run', 'draft', 'config', 'isReadOnly', 'publishedSampleSet']
                };
            }
            if (key === 'nhom-i') {
                return {
                    load: () => import('../sops/sop-nhom-i/sop-nhom-i-entry.component').then(m => m.SopNhomIEntryComponent),
                    inputs: ['run', 'draft', 'config', 'isReadOnly', 'publishedSampleSet']
                };
            }
            if (key === 'tbvtv-trong-nuoc-gcmsms') {
                return {
                    load: () => import('../sops/sop-tbvtv-trong-nuoc-gcmsms/sop-tbvtv-trong-nuoc-gcmsms-entry.component').then(m => m.SopTbvtvTrongNuocGcmsmsEntryComponent),
                    inputs: ['run', 'draft', 'config', 'isReadOnly', 'publishedSampleSet']
                };
            }
            if (key === 'tbvtv-thuc-pham-gcmsms') {
                return {
                    load: () => import('../sops/sop-tbvtv-thuc-pham-gcmsms/sop-tbvtv-thuc-pham-gcmsms-entry.component').then(m => m.SopTbvtvThucPhamGcmsmsEntryComponent),
                    inputs: ['run', 'draft', 'config', 'isReadOnly', 'publishedSampleSet']
                };
            }
            return {
                load: () => import('../result-entry-type3b.component').then(m => m.ResultEntryType3bComponent),
                inputs: ['run', 'draft', 'config', 'isReadOnly', 'publishedSampleSet']
            };
        }
        if (key === 'fipronil-chlorpyrifos') {
            return {
                load: () => import('../sops/sop-01/sop-01-entry.component').then(m => m.Sop01EntryComponent),
                inputs: ['run', 'draft', 'config', 'isReadOnly', 'publishedSampleSet']
            };
        }
        if (key === 'dichlorvos-gcms') {
            return {
                load: () => import('../sops/sop-1767857760184/sop-1767857760184-entry.component').then(m => m.Sop1767857760184EntryComponent),
                inputs: ['run', 'draft', 'config', 'activeFilter', 'isReadOnly']
            };
        }
        if (key === 'chloroform-gcms') {
            return {
                load: () => import('../sops/sop-chloroform/sop-chloroform-entry.component').then(m => m.SopChloroformEntryComponent),
                inputs: ['run', 'draft', 'config', 'activeFilter', 'isReadOnly', 'publishedSampleSet']
            };
        }
        if (key === 'trifluralin-gcms') {
            return {
                load: () => import('../sops/sop-03/sop-03-entry.component').then(m => m.Sop03EntryComponent),
                inputs: ['run', 'draft', 'config', 'activeFilter', 'isReadOnly', 'publishedSampleSet']
            };
        }
        return {
            load: () => import('../sops/sop-default-type2/sop-default-type2-entry.component').then(m => m.SopDefaultType2EntryComponent),
            inputs: ['run', 'draft', 'config', 'isReadOnly', 'publishedSampleSet']
        };
    }
    static { this.ɵfac = function SopEntryOutletComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SopEntryOutletComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SopEntryOutletComponent, selectors: [["app-sop-entry-outlet"]], viewQuery: function SopEntryOutletComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 7, ViewContainerRef);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.host = _t.first);
        } }, inputs: { configKey: "configKey", formType: "formType", run: "run", draft: "draft", config: "config", activeFilter: "activeFilter", isReadOnly: "isReadOnly", publishedSampleSet: "publishedSampleSet" }, outputs: { draftChanged: "draftChanged" }, features: [i0.ɵɵNgOnChangesFeature], decls: 3, vars: 1, consts: [["host", ""], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "p-6", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400"]], template: function SopEntryOutletComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementContainer(0, null, 0);
            i0.ɵɵtemplate(2, SopEntryOutletComponent_Conditional_2_Template, 2, 0, "div", 1);
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.isLoading ? 2 : -1);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SopEntryOutletComponent, [{
        type: Component,
        args: [{
                selector: 'app-sop-entry-outlet',
                standalone: true,
                template: `
    <ng-container #host></ng-container>
    @if (isLoading) {
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">
        Đang tải biểu mẫu SOP...
      </div>
    }
  `
            }]
    }], null, { configKey: [{
            type: Input
        }], formType: [{
            type: Input
        }], run: [{
            type: Input
        }], draft: [{
            type: Input
        }], config: [{
            type: Input
        }], activeFilter: [{
            type: Input
        }], isReadOnly: [{
            type: Input
        }], publishedSampleSet: [{
            type: Input
        }], draftChanged: [{
            type: Output
        }], host: [{
            type: ViewChild,
            args: ['host', { read: ViewContainerRef, static: true }]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SopEntryOutletComponent, { className: "SopEntryOutletComponent", filePath: "src/app/features/results/components/sop-entry-outlet.component.ts", lineNumber: 41 }); })();
//# sourceMappingURL=sop-entry-outlet.component.js.map