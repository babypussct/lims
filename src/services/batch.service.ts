
import { Injectable, signal, computed } from '@angular/core';
import { Sop } from '../models/sop.model';

export interface BatchItem {
  sop: Sop;
  inputs: any;
  margin: number;
}

@Injectable({ providedIn: 'root' })
export class BatchService {
  private selectedMap = signal<Map<string, BatchItem>>(new Map());

  count = computed(() => this.selectedMap().size);

  toggle(sop: Sop, inputs: any, margin: number) {
    this.selectedMap.update(map => {
      const newMap = new Map(map);
      if (newMap.has(sop.id)) {
        newMap.delete(sop.id);
      } else {
        newMap.set(sop.id, { sop, inputs: { ...inputs }, margin });
      }
      return newMap;
    });
  }

  updateItem(sopId: string, inputs: any, margin: number) {
    this.selectedMap.update(map => {
      const existingItem = map.get(sopId);
      if (existingItem) {
        const newMap = new Map(map);
        newMap.set(sopId, { ...existingItem, inputs: { ...inputs }, margin });
        return newMap;
      }
      return map;
    });
  }

  isSelected(sopId: string | undefined): boolean {
    if (!sopId) return false;
    return this.selectedMap().has(sopId);
  }

  getItem(sopId: string): BatchItem | undefined {
    return this.selectedMap().get(sopId);
  }

  getSelectedItems(): BatchItem[] {
    return Array.from(this.selectedMap().values());
  }

  clear() {
    this.selectedMap.set(new Map());
  }
}
