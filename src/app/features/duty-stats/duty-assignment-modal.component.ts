import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppButtonComponent, AppDatePickerComponent, AppModalShellComponent } from '../../shared/components/ui';
import type {
  DutyRecommendationTier,
  DutyScheduleDraft,
  DutyScheduleEntry,
  DutyStaff,
  DutyStaffRecommendation,
} from './duty-schedule.model';
import { dutyAdjacentAssignment } from './duty-schedule.utils';

interface DutyRecommendationGroup {
  tier: DutyRecommendationTier;
  title: string;
  description: string;
}

@Component({
  selector: 'app-duty-assignment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AppButtonComponent, AppDatePickerComponent, AppModalShellComponent],
  templateUrl: './duty-assignment-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyAssignmentModalComponent {
  @Input({ required: true }) draft!: DutyScheduleDraft;
  @Input({ required: true }) staff: readonly DutyStaff[] = [];
  @Input({ required: true }) recommendations: readonly DutyStaffRecommendation[] = [];
  @Input({ required: true }) conflictSchedules: readonly DutyScheduleEntry[] = [];
  @Input() search = '';
  @Input() saving = false;
  @Input() rollingLoading = false;
  @Input() conflictLoading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @Output() dateChanged = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();

  readonly recommendationGroups: readonly DutyRecommendationGroup[] = [
    { tier: 'recommended', title: 'Ưu tiên xếp', description: 'Tải 90 ngày thấp hơn bình quân trên 15%.' },
    { tier: 'balanced', title: 'Cân bằng', description: 'Tải 90 ngày nằm trong khoảng ±15% so với bình quân.' },
    { tier: 'consider', title: 'Cân nhắc', description: 'Tải cao hơn bình quân trên 15% hoặc có ca liền kề.' },
    { tier: 'high', title: 'Đang nhiều', description: 'Tải 90 ngày cao hơn bình quân trên 35%.' },
  ];

  onDateChange(value: string): void {
    this.dateChanged.emit(value);
  }

  updateSearch(value: string): void {
    this.search = value;
    this.searchChange.emit(value);
  }

  isSelected(staffId: string): boolean {
    return this.draft.staffIds.includes(staffId);
  }

  addStaff(staffId: string): void {
    if (this.isSelected(staffId)) return;
    this.draft.staffIds = [...this.draft.staffIds, staffId];
  }

  removeStaff(staffId: string): void {
    this.draft.staffIds = this.draft.staffIds.filter(id => id !== staffId);
  }

  makeLead(staffId: string): void {
    const index = this.draft.staffIds.indexOf(staffId);
    if (index <= 0) return;
    const current = [...this.draft.staffIds];
    current.splice(index, 1);
    current.unshift(staffId);
    this.draft.staffIds = current;
  }

  staffName(staffId: string): string {
    return this.staff.find(item => item.id === staffId)?.displayName || `[${staffId}]`;
  }

  recommendationForStaff(staffId: string): DutyStaffRecommendation | undefined {
    return this.recommendations.find(item => item.staffId === staffId);
  }

  staffForTier(tier: DutyRecommendationTier): DutyStaff[] {
    const search = this.normalizeSearchTerm(this.search);
    const selected = new Set(this.draft.staffIds);
    const recommendationOrder = new Map(this.recommendations.map((item, index) => [item.staffId, index]));
    return this.staff
      .filter(person => person.active || selected.has(person.id))
      .filter(person => this.recommendationForStaff(person.id)?.tier === tier)
      .filter(person => !search || this.normalizeSearchTerm(person.displayName).includes(search))
      .sort((a, b) =>
        (recommendationOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER)
        - (recommendationOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)
        || a.displayName.localeCompare(b.displayName, 'vi'),
      );
  }

  otherStaff(): DutyStaff[] {
    const search = this.normalizeSearchTerm(this.search);
    const selected = new Set(this.draft.staffIds);
    return this.staff
      .filter(person => (person.active || selected.has(person.id)) && !this.recommendationForStaff(person.id))
      .filter(person => !search || this.normalizeSearchTerm(person.displayName).includes(search))
      .sort((a, b) => a.displayName.localeCompare(b.displayName, 'vi'));
  }

  hasVisibleCandidates(): boolean {
    return this.recommendationGroups.some(group => this.staffForTier(group.tier).length > 0)
      || this.otherStaff().length > 0;
  }

  recommendationLabel(tier: DutyRecommendationTier): string {
    if (tier === 'recommended') return 'Nên xếp';
    if (tier === 'balanced') return 'Cân bằng';
    if (tier === 'high') return 'Đang nhiều';
    return 'Cân nhắc';
  }

  recommendationBadgeClass(tier: DutyRecommendationTier): string {
    if (tier === 'recommended') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300';
    if (tier === 'balanced') return 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300';
    if (tier === 'high') return 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300';
    return 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300';
  }

  recommendationMarker(tier: DutyRecommendationTier): string {
    if (tier === 'recommended') return '🟢';
    if (tier === 'balanced') return '🔵';
    if (tier === 'high') return '🔴';
    return '🟠';
  }

  conflictWarningForStaff(staffId: string): string | null {
    if (!this.draft.date) return null;
    const conflict = dutyAdjacentAssignment(this.draft.date, staffId, this.conflictSchedules);
    if (conflict.previous && conflict.next) return '2 ca liền kề';
    if (conflict.previous) return 'Vừa trực hôm qua';
    if (conflict.next) return 'Đã có ca ngày mai';
    return null;
  }

  selectedConflictCount(): number {
    return this.draft.staffIds.filter(staffId => Boolean(this.conflictWarningForStaff(staffId))).length;
  }

  addUnresolvedAssignee(): void {
    this.draft.unresolvedAssignees = [...(this.draft.unresolvedAssignees || []), '?'];
    this.draft.needsVerification = true;
  }

  updateUnresolvedAssignee(index: number, value: string): void {
    const current = [...(this.draft.unresolvedAssignees || [])];
    if (index < 0 || index >= current.length) return;
    current[index] = value;
    this.draft.unresolvedAssignees = current;
    this.draft.needsVerification = true;
  }

  removeUnresolvedAssignee(index: number): void {
    const current = [...(this.draft.unresolvedAssignees || [])];
    if (index < 0 || index >= current.length) return;
    current.splice(index, 1);
    this.draft.unresolvedAssignees = current;
    if (current.length === 0) this.draft.needsVerification = false;
  }

  hasAssignment(): boolean {
    return this.draft.staffIds.length > 0 || (this.draft.unresolvedAssignees?.length || 0) > 0;
  }

  dateWithWeekday(dateKey: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return dateKey;
    const [year, month, day] = dateKey.split('-').map(Number);
    const weekday = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(year, month - 1, day)));
    return `${dateKey} (${this.capitalize(weekday)})`;
  }

  private normalizeSearchTerm(value: string): string {
    return value.trim().toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  }

  private capitalize(value: string): string {
    return value ? value.charAt(0).toLocaleUpperCase('vi-VN') + value.slice(1) : value;
  }
}
