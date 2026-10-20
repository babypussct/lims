import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import type { DutyScheduleEntry, DutyStaff } from './duty-schedule.model';
import { computeDutyPersonalAnalytics, type DutyProfileWindow } from './duty-personal-analytics';
import { buildDutyAiPrompt, dutyAiDataFingerprint, type DutyAiReview } from './duty-ai-review';
import { DutyAiReviewService } from './duty-ai-review.service';
import { DutyProfileTrendChartComponent } from './duty-profile-trend-chart.component';

@Component({
  selector: 'app-duty-personal-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, DutyProfileTrendChartComponent],
  templateUrl: './duty-personal-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DutyPersonalProfileComponent {
  private readonly aiReviews = inject(DutyAiReviewService);
  private readonly toast = inject(ToastService);
  readonly staff = input.required<readonly DutyStaff[]>();
  readonly schedules = input.required<readonly DutyScheduleEntry[]>();
  readonly staffId = input.required<string>();
  readonly startDate = input.required<string>();
  readonly endDate = input.required<string>();
  readonly loading = input(false);
  readonly window = input.required<DutyProfileWindow>();
  readonly canManage = input(false);

  readonly reviews = signal<DutyAiReview[]>([]);
  readonly reviewsLoading = signal(true);
  readonly reviewsError = signal<string | null>(null);
  readonly draftText = signal('');
  readonly confirmedIdentity = signal(false);
  readonly preparedFingerprint = signal<string | null>(null);
  readonly showPrompt = signal(false);
  readonly savingReview = signal(false);

  readonly report = computed(() => computeDutyPersonalAnalytics(
    this.schedules(), this.staff(), this.staffId(), { start: this.startDate(), end: this.endDate() },
  ));
  readonly dataFingerprint = computed(() => dutyAiDataFingerprint(
    this.schedules(), this.staff(), { start: this.startDate(), end: this.endDate() },
  ));
  readonly promptText = computed(() => {
    const data = this.report();
    return data ? buildDutyAiPrompt(this.staffId(), this.window(), data, this.dataFingerprint()) : '';
  });
  readonly periodReviews = computed(() => this.reviews().filter(item =>
    item.staffId === this.staffId() && item.periodStart === this.startDate()
      && item.periodEnd === this.endDate() && item.window === String(this.window()),
  ));
  readonly otherReviews = computed(() => this.reviews().filter(item => !this.periodReviews().some(match => match.id === item.id)));
  readonly recentWeeks = computed(() => (this.report()?.weekly || []).slice(-16));
  readonly weeklyPeak = computed(() => Math.max(1, ...this.recentWeeks().flatMap(week => [week.actual, week.teamAverage])));

  readonly heatmapRows = computed(() => {
    const dates = this.report()?.days || [];
    const offset = dates.length ? (new Date(`${dates[0].date}T12:00:00+07:00`).getDay() + 6) % 7 : 0;
    return [...Array.from({ length: offset }, () => null), ...dates];
  });

  constructor() {
    effect(onCleanup => {
      const staffId = this.staffId();
      this.reviews.set([]);
      this.reviewsLoading.set(true);
      this.reviewsError.set(null);
      const unsubscribe = this.aiReviews.watch(staffId,
        reviews => { this.reviews.set(reviews); this.reviewsLoading.set(false); },
        message => { this.reviewsError.set(message); this.reviewsLoading.set(false); });
      onCleanup(unsubscribe);
    });
    effect(() => {
      this.staffId();
      this.startDate();
      this.endDate();
      this.window();
      this.draftText.set('');
      this.confirmedIdentity.set(false);
      this.preparedFingerprint.set(null);
      this.showPrompt.set(false);
    });
  }

  async copyPrompt(): Promise<void> {
    if (!this.canManage() || this.loading() || !this.report()) return;
    this.preparedFingerprint.set(this.dataFingerprint());
    this.showPrompt.set(true);
    try {
      await navigator.clipboard.writeText(this.promptText());
      this.toast.show('Đã sao chép prompt AI. Dán vào mô hình AI bạn muốn sử dụng.', 'success');
    } catch {
      this.toast.show('Không sao chép tự động được. Hãy chọn và sao chép prompt trong ô bên dưới.', 'warning');
    }
  }

  setDraftText(value: string): void {
    this.draftText.set(value);
    this.confirmedIdentity.set(false);
  }

  async publishReview(): Promise<void> {
    if (!this.canManage() || !this.confirmedIdentity() || this.savingReview() || this.loading() || !this.report()) return;
    if (this.preparedFingerprint() !== this.dataFingerprint()) {
      this.toast.show('Dữ liệu lịch trực đã thay đổi hoặc chưa tạo prompt. Hãy sao chép prompt mới trước khi công bố.', 'warning');
      return;
    }
    const staffId = this.staffId();
    const periodStart = this.startDate();
    const periodEnd = this.endDate();
    const window = String(this.window());
    const analysisText = this.draftText();
    this.savingReview.set(true);
    try {
      await this.aiReviews.publish({
        staffId, periodStart, periodEnd, window, analysisText,
        dataFingerprint: this.dataFingerprint(),
      });
      if (this.staffId() === staffId && this.startDate() === periodStart && this.endDate() === periodEnd && String(this.window()) === window) {
        this.draftText.set('');
        this.confirmedIdentity.set(false);
      }
      this.toast.show('Đã công bố đánh giá AI lên tường nhân sự.', 'success');
    } catch (error) {
      this.toast.show(error instanceof Error ? error.message : 'Không thể công bố đánh giá AI.', 'error');
    } finally {
      this.savingReview.set(false);
    }
  }
}
