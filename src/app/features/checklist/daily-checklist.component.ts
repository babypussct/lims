import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { Request } from '../../core/models/request.model';
import { SopTarget } from '../../core/models/sop.model';

interface ChecklistSample {
  sampleId: string;
  status: Request['status'];
  requestId: string;
}

interface ChecklistTargetGroup {
  targetId: string;
  targetName: string;
  samples: ChecklistSample[];
}

interface ChecklistSopGroup {
  sopId: string;
  sopName: string;
  targets: ChecklistTargetGroup[];
}

@Component({
  selector: 'app-daily-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-checklist.component.html'
})
export class DailyChecklistComponent {
  state = inject(StateService);

  // Default to today in YYYY-MM-DD
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);

  // Compute the grouped checklist data
  groupedChecklist = computed<ChecklistSopGroup[]>(() => {
    const allRequests = this.state.requests();
    const dateStr = this.selectedDate();
    
    // Build a map of all targets from SOPs
    const targetMap = new Map<string, SopTarget>();
    this.state.sops().forEach(sop => {
        if (sop.targets) {
            sop.targets.forEach(t => targetMap.set(t.id, t));
        }
    });

    // Filter requests by the selected date (using timestamp or approvedAt)
    // Here we check if the request timestamp matches the date string
    const filteredRequests = allRequests.filter(req => {
      // Helper to format firestore timestamp to YYYY-MM-DD
      let reqDateStr = '';
      if (req.timestamp) {
        let dateObj: Date;
        if (req.timestamp.toDate) {
            dateObj = req.timestamp.toDate();
        } else if (typeof req.timestamp === 'string') {
            dateObj = new Date(req.timestamp);
        } else if (typeof req.timestamp === 'number') {
            dateObj = new Date(req.timestamp);
        } else if (req.timestamp.seconds) {
            dateObj = new Date(req.timestamp.seconds * 1000);
        } else {
            return false;
        }
        
        reqDateStr = dateObj.toISOString().split('T')[0];
        
        // Also check analysisDate if that's preferred, but usually we filter by request creation/approval
        if (req.analysisDate && req.analysisDate === dateStr) {
           return true;
        }
      }
      return reqDateStr === dateStr;
    });

    const sopGroupsMap = new Map<string, ChecklistSopGroup>();

    filteredRequests.forEach(req => {
      if (!req.sampleList || req.sampleList.length === 0) return;
      if (!req.sampleTargetMap) return;

      const sopId = req.sopId;
      if (!sopGroupsMap.has(sopId)) {
        sopGroupsMap.set(sopId, {
          sopId: req.sopId,
          sopName: req.sopName,
          targets: []
        });
      }

      const sopGroup = sopGroupsMap.get(sopId)!;
      
      // Iterate through samples in this request
      req.sampleList.forEach(sampleId => {
        const assignedTargets = req.sampleTargetMap![sampleId] || [];
        
        assignedTargets.forEach(targetId => {
          let targetGroup = sopGroup.targets.find(t => t.targetId === targetId);
          if (!targetGroup) {
            const targetInfo = targetMap.get(targetId);
            targetGroup = {
              targetId: targetId,
              targetName: targetInfo ? targetInfo.name : targetId,
              samples: []
            };
            sopGroup.targets.push(targetGroup);
          }

          // Avoid duplicates if sample already added for this target (shouldn't happen per request, but could across requests)
          if (!targetGroup.samples.find(s => s.sampleId === sampleId)) {
             targetGroup.samples.push({
               sampleId,
               status: req.status,
               requestId: req.id
             });
          }
        });
      });
    });

    // Convert map to array and sort
    const result = Array.from(sopGroupsMap.values());
    result.forEach(group => {
       group.targets.sort((a, b) => a.targetName.localeCompare(b.targetName));
       group.targets.forEach(t => t.samples.sort((a, b) => a.sampleId.localeCompare(b.sampleId)));
    });
    
    return result.sort((a, b) => a.sopName.localeCompare(b.sopName));
  });

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
      case 'approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
      case 'draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Đã xong';
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'draft': return 'Đang chạy';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  }
}
