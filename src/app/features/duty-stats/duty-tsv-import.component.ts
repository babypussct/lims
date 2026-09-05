import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppButtonComponent, AppModalShellComponent } from '../../shared/components/ui';
import { ToastService } from '../../core/services/toast.service';
import { DutyScheduleService } from './duty-schedule.service';
import { buildDutyGeminiPrompt, DUTY_TSV_HEADER, parseDutyTsv, type DutyImportPlanRow } from './duty-tsv-import';

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
  readonly filename = signal('');
  readonly rows = signal<DutyImportPlanRow[]>([]);
  readonly errors = signal<string[]>([]);
  readonly busy = signal(false);
  readonly reviewed = signal(false);
  readonly previewReady = signal(false);
  readonly result = signal<{ created: number; replaced: number; kept: number } | null>(null);
  readonly prompt = computed(() => buildDutyGeminiPrompt(this.month(), this.duty.staff()));
  readonly created = computed(() => this.rows().filter(row => !row.previous).length);
  readonly replaced = computed(() => this.rows().filter(row => row.previous && row.replace).length);
  readonly kept = computed(() => this.rows().filter(row => row.previous && !row.replace).length);
  readonly assignments = computed(() => this.rows().filter(row => !row.previous || row.replace).reduce((sum, row) => sum + row.staffIds.length, 0));
  readonly canImport = computed(() => this.previewReady() && this.reviewed() && !this.busy() && !this.result()
    && !this.errors().length && !this.rows().some(row => row.errors.length) && this.created() + this.replaced() > 0);

  changeText(value: string): void {
    this.text.set(value); this.previewReady.set(false); this.reviewed.set(false); this.rows.set([]); this.errors.set([]); this.result.set(null);
  }
  async upload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.changeText(''); this.filename.set('');
    if (file.size > 100_000 || !/\.(tsv|txt)$/i.test(file.name)) {
      this.errors.set(['Chọn tệp .tsv hoặc .txt UTF-8, tối đa 100 KB.']); input.value = ''; return;
    }
    this.busy.set(true);
    try { const content = await file.text(); this.changeText(content); this.filename.set(file.name); }
    catch { this.errors.set(['Không đọc được tệp. Hãy lưu lại dưới dạng UTF-8 hoặc dán nội dung.']); }
    finally { this.busy.set(false); input.value = ''; }
  }
  async copyPrompt(): Promise<void> {
    try { await navigator.clipboard.writeText(this.prompt()); this.toast.show('Đã sao chép prompt Gemini cho tháng ' + this.month(), 'success'); }
    catch { this.toast.show('Hãy chọn và sao chép nội dung trong ô prompt.', 'warning'); }
  }
  download(content: string, name: string): void {
    const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/tab-separated-values;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
  }
  downloadTemplate(): void { this.download(DUTY_TSV_HEADER + '\n', `lich-truc-${this.month()}-mau.tsv`); }
  downloadReviewed(): void {
    const rows = this.rows().filter(row => !row.previous || row.replace);
    this.download([DUTY_TSV_HEADER, ...rows.map(row => [row.date, row.names.join(' | '), row.startTime, row.note].join('\t'))].join('\n'), `lich-truc-${this.month()}-da-doi-chieu.tsv`);
  }
  async preview(): Promise<void> {
    this.busy.set(true); this.previewReady.set(false); this.reviewed.set(false); this.result.set(null);
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
      const result = await this.duty.importMonthTsv(this.text(), this.month(), this.rows());
      this.result.set(result); this.previewReady.set(false);
      this.toast.show(`Đã nhập tháng ${this.month()}: ${result.created} ca mới, ${result.replaced} ca thay thế.`, 'success');
    } catch (error) {
      this.errors.set([error instanceof Error ? error.message : 'Không nhập được lịch. Hãy xem trước lại để kiểm tra trạng thái hiện tại.']);
      this.previewReady.set(false); this.reviewed.set(false);
    } finally { this.busy.set(false); }
  }
}
