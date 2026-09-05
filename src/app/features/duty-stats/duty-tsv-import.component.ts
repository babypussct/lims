import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppButtonComponent, AppModalShellComponent } from '../../shared/components/ui';
import { ToastService } from '../../core/services/toast.service';
import { DutyScheduleService } from './duty-schedule.service';
import {
  buildDutyGeminiPrompt,
  buildDutyGeminiVerificationPrompt,
  compareDutyImportRuns,
  DUTY_TSV_HEADER,
  parseDutyTsv,
  type DutyImportPlanRow,
} from './duty-tsv-import';

@Component({
  selector: 'app-duty-tsv-import', standalone: true,
  imports: [FormsModule, AppButtonComponent, AppModalShellComponent],
  templateUrl: './duty-tsv-import.component.html',
})
export class DutyTsvImportComponent {
  readonly month = input.required<string>();
  readonly closed = output<void>();
  readonly duty = inject(DutyScheduleService);
  private readonly toast = inject(ToastService);
  readonly text = signal('');
  readonly rows = signal<DutyImportPlanRow[]>([]);
  readonly errors = signal<string[]>([]);
  readonly busy = signal(false);
  readonly reviewed = signal(false);
  readonly previewReady = signal(false);
  readonly result = signal<{ created: number; replaced: number; kept: number } | null>(null);
  readonly promptCopied = signal(false);
  readonly verificationPromptCopied = signal(false);
  readonly independentRunConfirmed = signal(false);
  readonly verificationText = signal('');
  readonly verificationErrors = signal<string[]>([]);
  readonly verificationMismatches = signal<string[]>([]);
  readonly verificationChecked = signal(false);
  readonly prompt = computed(() => buildDutyGeminiPrompt(this.month(), this.duty.staff()));
  readonly verificationPrompt = computed(() => buildDutyGeminiVerificationPrompt(this.month(), this.duty.staff()));
  readonly created = computed(() => this.rows().filter(row => !row.previous).length);
  readonly replaced = computed(() => this.rows().filter(row => row.previous && row.replace).length);
  readonly kept = computed(() => this.rows().filter(row => row.previous && !row.replace).length);
  readonly assignments = computed(() => this.rows().filter(row => !row.previous || row.replace).reduce((sum, row) => sum + row.staffIds.length, 0));
  readonly unresolvedAssignments = computed(() => this.rows()
    .filter(row => !row.previous || row.replace)
    .reduce((sum, row) => sum + row.unresolvedAssignees.length, 0));
  readonly verificationRows = computed(() => this.rows()
    .filter(row => (!row.previous || row.replace) && row.warnings.length > 0).length);
  readonly totalAssignmentSlots = computed(() => this.assignments() + this.unresolvedAssignments());
  readonly verificationMatched = computed(() => this.verificationChecked()
    && !this.verificationErrors().length && !this.verificationMismatches().length);
  readonly canImport = computed(() => this.previewReady() && this.verificationMatched() && this.independentRunConfirmed() && this.reviewed() && !this.busy() && !this.result()
    && !this.errors().length && !this.rows().some(row => row.errors.length) && this.created() + this.replaced() > 0);

  changeText(value: string): void {
    this.text.set(value); this.previewReady.set(false); this.reviewed.set(false); this.rows.set([]); this.errors.set([]); this.result.set(null); this.resetVerification();
  }
  changeVerificationText(value: string): void {
    this.verificationText.set(value);
    this.verificationErrors.set([]);
    this.verificationMismatches.set([]);
    this.verificationChecked.set(false);
  }
  async copyPrompt(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.prompt());
      this.promptCopied.set(true);
      this.toast.show('Đã sao chép prompt Gemini cho tháng ' + this.month(), 'success');
      window.setTimeout(() => this.promptCopied.set(false), 2000);
    }
    catch { this.toast.show('Hãy chọn và sao chép nội dung trong ô prompt.', 'warning'); }
  }
  async copyVerificationPrompt(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.verificationPrompt());
      this.verificationPromptCopied.set(true);
      this.toast.show('Đã sao chép prompt xác minh độc lập. Hãy dùng trong một chat Gemini mới.', 'success');
      window.setTimeout(() => this.verificationPromptCopied.set(false), 2000);
    }
    catch { this.toast.show('Hãy chọn và sao chép prompt xác minh độc lập trong ô.', 'warning'); }
  }
  download(content: string, name: string): void {
    const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/tab-separated-values;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
  }
  downloadReviewed(): void {
    const rows = this.rows().filter(row => !row.previous || row.replace);
    this.download([DUTY_TSV_HEADER, ...rows.map(row => [row.date, row.names.join(' | '), row.startTime, row.note].join('\t'))].join('\n'), `lich-truc-${this.month()}-da-doi-chieu.tsv`);
  }
  async preview(): Promise<void> {
    this.busy.set(true); this.previewReady.set(false); this.reviewed.set(false); this.result.set(null); this.resetVerification();
    const parsed = parseDutyTsv(this.text(), this.month(), this.duty.staff());
    this.errors.set(parsed.errors);
    this.rows.set(parsed.rows.map(row => ({ ...row, previous: null, replace: false })));
    try {
      if (parsed.errors.length || parsed.rows.some(row => row.errors.length)) return;
      const existing = await this.duty.loadScheduleDates(parsed.rows.map(row => row.date));
      this.rows.set(parsed.rows.map(row => ({ ...row, previous: existing.find(item => item.date === row.date) || null, replace: false })));
      this.previewReady.set(true);
    } catch { this.errors.set(['Không tải được lịch hiện có. Kiểm tra kết nối rồi xem trước lại.']); }
    finally { this.busy.set(false); }
  }
  validateVerification(): void {
    if (!this.previewReady()) return;
    const parsed = parseDutyTsv(this.verificationText(), this.month(), this.duty.staff());
    const rowErrors = parsed.rows.flatMap(row => row.errors.map(error => `Dòng ${row.line} (${row.date || 'chưa có ngày'}): ${error}`));
    const errors = [...parsed.errors, ...rowErrors];
    this.verificationErrors.set(errors);
    this.verificationMismatches.set(errors.length ? [] : compareDutyImportRuns(this.rows(), parsed.rows));
    this.verificationChecked.set(true);
    this.reviewed.set(false);
    if (!errors.length && !this.verificationMismatches().length) {
      this.toast.show('TSV Gemini lần 2 khớp hoàn toàn với bản đã xem trước.', 'success');
    }
  }
  replaceDate(date: string, replace: boolean): void {
    this.rows.update(rows => rows.map(row => row.date === date ? { ...row, replace } : row)); this.reviewed.set(false);
  }
  existingNames(row: DutyImportPlanRow): string {
    return row.previous?.staffIds.map(id => this.duty.staff().find(person => person.id === id)?.displayName || `[${id}]`).join(' · ') || 'Chưa phân công';
  }
  async submit(): Promise<void> {
    if (!this.canImport()) return;
    this.busy.set(true);
    try {
      const result = await this.duty.importMonthTsv(this.text(), this.month(), this.rows(), this.verificationText());
      this.result.set(result); this.previewReady.set(false);
      this.toast.show(`Đã nhập tháng ${this.month()}: ${result.created} ca mới, ${result.replaced} ca thay thế.`, 'success');
    } catch (error) {
      this.errors.set([error instanceof Error ? error.message : 'Không nhập được lịch. Hãy xem trước lại để kiểm tra trạng thái hiện tại.']);
      this.previewReady.set(false); this.reviewed.set(false);
    } finally { this.busy.set(false); }
  }

  private resetVerification(): void {
    this.verificationText.set('');
    this.verificationErrors.set([]);
    this.verificationMismatches.set([]);
    this.verificationChecked.set(false);
    this.independentRunConfirmed.set(false);
  }
}
