import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { Request } from '../../core/models/request.model';
import { SopTarget } from '../../core/models/sop.model';

// ─── Internal interfaces ──────────────────────────────────────────────────────

interface ChecklistSample {
  sampleId: string;
  /** Status comes from the batch (mẻ) this sample belongs to */
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
  /** Collapse state — per SOP card */
  collapsed: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract the 2-digit date suffix from a sample ID.
 * Standard LIMS format: [prefix][middle digits][2-digit suffix = day]
 * e.g. "U0110" → "10", "WA2507" → "07"
 * Returns '' if the sample ID does not match the standard format.
 */
function getDaySuffix(sampleId: string): string {
  if (sampleId.length >= 3 && /^\d{2}$/.test(sampleId.slice(-2))) {
    const rest = sampleId.slice(0, -2);
    if (/^[a-zA-Z]*\d+$/.test(rest)) {
      return sampleId.slice(-2);
    }
  }
  return '';
}

// ─── Component ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-daily-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-checklist.component.html'
})
export class DailyChecklistComponent {
  state = inject(StateService);

  // ── State ──────────────────────────────────────────────────────────────────

  /** Selected day — stored as YYYY-MM-DD, defaults to today */
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);

  /** Per-SOP collapsed state keyed by sopId */
  collapsedGroups = signal<Record<string, boolean>>({});

  /** Optional quick-filter by request status */
  statusFilter = signal<string | null>(null);

  // ── Derived: targetMap from all SOPs ──────────────────────────────────────

  /** All SOP targets indexed by targetId — recomputed only when SOPs change */
  private targetMap = computed<Map<string, SopTarget>>(() => {
    const map = new Map<string, SopTarget>();
    this.state.sops().forEach(sop => {
      (sop.targets || []).forEach(t => map.set(t.id, t));
    });
    return map;
  });

  // ── Derived: the 2-digit day string for the selected date ─────────────────

  private selectedDay = computed<string>(() => {
    const d = this.selectedDate();
    // day part of YYYY-MM-DD, zero-padded to 2 digits
    const day = parseInt(d.split('-')[2], 10);
    return day.toString().padStart(2, '0');
  });

  // ── Derived: grouped checklist ─────────────────────────────────────────────

  /**
   * Core pipeline:
   * 1. For each request, collect only samples whose 2-digit suffix matches the selected day.
   * 2. Group those samples by SOP → Target.
   * 3. A single sample may appear in multiple requests (re-runs) — all entries kept.
   */
  groupedChecklist = computed<ChecklistSopGroup[]>(() => {
    const allRequests = [...this.state.requests(), ...this.state.approvedRequests()];
    const dayStr = this.selectedDay();
    const targetMap = this.targetMap();
    const collapsed = this.collapsedGroups();
    const statusFilter = this.statusFilter();

    const sopGroupsMap = new Map<string, Omit<ChecklistSopGroup, 'collapsed'>>();

    allRequests.forEach(req => {
      if (!req.sampleList?.length) return;
      if (!req.sampleTargetMap) return;

      // Apply optional status filter
      if (statusFilter && req.status !== statusFilter) return;

      // ── Filter samples by day suffix ──────────────────────────────────────
      const matchingSamples = req.sampleList.filter(sid => getDaySuffix(sid) === dayStr);
      if (matchingSamples.length === 0) return;

      // ── Ensure SOP group exists ───────────────────────────────────────────
      if (!sopGroupsMap.has(req.sopId)) {
        sopGroupsMap.set(req.sopId, {
          sopId: req.sopId,
          sopName: req.sopName,
          targets: []
        });
      }
      const sopGroup = sopGroupsMap.get(req.sopId)!;

      // ── Distribute samples to target groups ───────────────────────────────
      matchingSamples.forEach(sampleId => {
        const assignedTargets = req.sampleTargetMap![sampleId] || [];

        assignedTargets.forEach(targetId => {
          let tg = sopGroup.targets.find(t => t.targetId === targetId);
          if (!tg) {
            const info = targetMap.get(targetId);
            tg = {
              targetId,
              targetName: info?.name ?? targetId,
              samples: []
            };
            sopGroup.targets.push(tg);
          }

          // Allow duplicate sampleId from different requests (re-runs)
          const alreadyFromSameRequest = tg.samples.some(
            s => s.sampleId === sampleId && s.requestId === req.id
          );
          if (!alreadyFromSameRequest) {
            tg.samples.push({ sampleId, status: req.status, requestId: req.id });
          }
        });
      });
    });

    // ── Build & sort result ────────────────────────────────────────────────
    const result: ChecklistSopGroup[] = Array.from(sopGroupsMap.values()).map(g => {
      g.targets.sort((a, b) => a.targetName.localeCompare(b.targetName));
      g.targets.forEach(t =>
        t.samples.sort((a, b) => a.sampleId.localeCompare(b.sampleId))
      );
      return {
        ...g,
        collapsed: collapsed[g.sopId] ?? false
      };
    });

    return result.sort((a, b) => a.sopName.localeCompare(b.sopName));
  });

  // ── Derived: summary counts ───────────────────────────────────────────────

  summary = computed(() => {
    const groups = this.groupedChecklist();
    const counts = { total: 0, completed: 0, approved: 0, pending: 0, draft: 0, rejected: 0 };
    groups.forEach(g =>
      g.targets.forEach(t =>
        t.samples.forEach(s => {
          counts.total++;
          if (s.status === 'completed') counts.completed++;
          else if (s.status === 'approved') counts.approved++;
          else if (s.status === 'pending') counts.pending++;
          else if (s.status === 'draft') counts.draft++;
          else if (s.status === 'rejected') counts.rejected++;
        })
      )
    );
    return counts;
  });

  // ── Actions ───────────────────────────────────────────────────────────────

  toggleCollapse(sopId: string): void {
    this.collapsedGroups.update(prev => ({ ...prev, [sopId]: !prev[sopId] }));
  }

  collapseAll(): void {
    const all: Record<string, boolean> = {};
    this.groupedChecklist().forEach(g => (all[g.sopId] = true));
    this.collapsedGroups.set(all);
  }

  expandAll(): void {
    this.collapsedGroups.set({});
  }

  goToToday(): void {
    this.selectedDate.set(new Date().toISOString().split('T')[0]);
  }

  setStatusFilter(s: string | null): void {
    this.statusFilter.set(this.statusFilter() === s ? null : s);
  }

  // ── Helpers: display ──────────────────────────────────────────────────────

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
      case 'approved':  return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300';
      case 'pending':   return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
      case 'draft':     return 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300';
      case 'rejected':  return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300';
      default:          return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Đã xong';
      case 'approved':  return 'Đã duyệt';
      case 'pending':   return 'Chờ duyệt';
      case 'draft':     return 'Đang chạy';
      case 'rejected':  return 'Từ chối';
      default:          return status;
    }
  }

  getStatusDot(status: string): string {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'approved':  return 'bg-blue-500';
      case 'pending':   return 'bg-amber-500';
      case 'draft':     return 'bg-violet-500';
      case 'rejected':  return 'bg-red-500';
      default:          return 'bg-slate-400';
    }
  }

  totalSamples(targets: { samples: ChecklistSample[] }[]): number {
    return targets.reduce((acc, t) => acc + t.samples.length, 0);
  }
}
