import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { AnalysisResultDraft } from '../../../core/models/analysis-result.model';

type SopEntryInput =
  | 'run'
  | 'draft'
  | 'config'
  | 'publishedSampleSet'
  | 'activeFilter'
  | 'isReadOnly';

interface SopEntryDefinition {
  load: () => Promise<Type<any>>;
  inputs: SopEntryInput[];
}

@Component({
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
})
export class SopEntryOutletComponent implements OnChanges, OnDestroy {
  @Input() configKey: string | null = null;
  @Input() formType: string | null = null;
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Input() activeFilter = 'ALL';
  @Input() isReadOnly = false;
  @Input() publishedSampleSet: Set<string> | null = null;

  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  @ViewChild('host', { read: ViewContainerRef, static: true }) host!: ViewContainerRef;

  isLoading = false;

  private componentRef?: ComponentRef<any>;
  private activeComponentId: string | null = null;
  private outputSub?: { unsubscribe: () => void };
  private loadGeneration = 0;

  async ngOnChanges(changes: SimpleChanges) {
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

  private async mount(componentId: string, definition: SopEntryDefinition) {
    const generation = ++this.loadGeneration;
    this.destroyActiveComponent();
    this.isLoading = true;

    try {
      const componentType = await definition.load();
      if (generation !== this.loadGeneration) return;

      this.host.clear();
      this.componentRef = this.host.createComponent(componentType);
      this.activeComponentId = componentId;
      this.applyInputs(definition.inputs);

      const emitter = this.componentRef.instance?.draftChanged;
      if (emitter?.subscribe) {
        this.outputSub = emitter.subscribe((draft: AnalysisResultDraft) => this.draftChanged.emit(draft));
      }
    } finally {
      if (generation === this.loadGeneration) {
        this.isLoading = false;
      }
    }
  }

  private applyInputs(inputs: SopEntryInput[]) {
    if (!this.componentRef) return;

    const values: Record<SopEntryInput, unknown> = {
      run: this.run,
      draft: this.draft,
      config: this.config,
      publishedSampleSet: this.publishedSampleSet,
      activeFilter: this.activeFilter,
      isReadOnly: this.isReadOnly
    };

    inputs.forEach(input => this.componentRef!.setInput(input, values[input]));
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private destroyActiveComponent() {
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

  private resolveComponentId(): string {
    return `${this.formType || 'type2'}:${this.configKey || 'default'}`;
  }

  private resolveDefinition(): SopEntryDefinition {
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
        inputs: ['run', 'draft', 'config', 'publishedSampleSet']
      };
    }

    if (key === 'fipronil-chlorpyrifos') {
      return {
        load: () => import('../sops/sop-01/sop-01-entry.component').then(m => m.Sop01EntryComponent),
        inputs: ['run', 'draft', 'config', 'publishedSampleSet']
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
        inputs: ['run', 'draft', 'config', 'activeFilter', 'publishedSampleSet']
      };
    }
    if (key === 'trifluralin-gcms') {
      return {
        load: () => import('../sops/sop-03/sop-03-entry.component').then(m => m.Sop03EntryComponent),
        inputs: ['run', 'draft', 'config', 'activeFilter', 'publishedSampleSet']
      };
    }

    return {
      load: () => import('../sops/sop-default-type2/sop-default-type2-entry.component').then(m => m.SopDefaultType2EntryComponent),
      inputs: ['run', 'draft', 'config', 'publishedSampleSet']
    };
  }
}
