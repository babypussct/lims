import { Injectable, signal, computed } from '@angular/core';
import { Sop } from '../models/sop.model';

export interface BatchItem {
  sop: Sop;
  inputs: any;
  margin: number;
}

@Injectable({ providedIn: 'root' })
export class BatchService {
  // Map of SopID -> BatchItem
  private selectedMap = signal<Map<string, BatchItem>>(new Map());

  count = computed(() => this.selectedMap().size);

  toggle(sop: Sop, inputs: any, margin: number) {
    this.selectedMap.update(map => {
      const newMap = new Map(map);
      if (newMap.has(sop.id)) {
        newMap.delete(sop.id);
      } else {
        // Store a snapshot of current inputs
        newMap.set(sop.id, { sop, inputs: { ...inputs }, margin });
      }
      return newMap;
    });
  }

  isSelected(sopId: string | undefined) {
    if (!sopId) return false;
    return this.selectedMap().has(sopId);
  }

  getSelectedItems(): BatchItem[] {
    return Array.from(this.selectedMap().values());
  }

  clear() {
    this.selectedMap.set(new Map());
  }
}