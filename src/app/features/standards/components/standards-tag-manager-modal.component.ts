import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StandardTagOption } from '../../../core/models/standard.model';
import { StandardTagCatalogService } from '../services/standard-tag-catalog.service';
import { compareChemicalMethodCodes, parseTagKeyStrict } from '../services/standard-tag.utils';

type SeedPreview = Awaited<ReturnType<StandardTagCatalogService['previewAccreditationMethodImport']>>;

/** Admin-only lifecycle UI for manual and accreditation-scope catalog tags. */
@Component({
  selector: 'app-standards-tag-manager-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[610] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" role="dialog" aria-modal="true">
        <div class="w-full max-w-4xl max-h-[90vh] rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col">
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-lg font-black text-slate-800 dark:text-slate-100">Danh mục nhãn trung tâm</h3>
              <p class="text-xs text-slate-500 mt-1">Nhãn phương pháp hóa học được nạp theo seed có truy vết; nhãn thủ công dùng soft-delete.</p>
            </div>
            <button type="button" (click)="close.emit()" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><i class="fa-solid fa-times"></i></button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6">
              <section class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-black text-slate-700 dark:text-slate-200">{{ editingId() ? 'Sửa nhãn thủ công' : 'Tạo nhãn thủ công' }}</h4>
                  @if (editingId()) { <button type="button" (click)="resetForm()" class="text-xs font-bold text-slate-400 hover:text-indigo-600">Tạo mới</button> }
                </div>
                <input [ngModel]="name()" (ngModelChange)="name.set($event)" maxlength="100" placeholder="Tên nhãn" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                <textarea [ngModel]="description()" (ngModelChange)="description.set($event)" rows="3" placeholder="Mô tả (không bắt buộc)" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm"></textarea>
                <div class="flex items-center gap-2">
                  <label class="text-xs font-bold text-slate-500">Màu</label>
                  <input [ngModel]="color()" (ngModelChange)="color.set($event)" type="text" maxlength="7" placeholder="#4F46E5" class="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono">
                </div>
                <button type="button" (click)="saveManualTag()" [disabled]="isBusy() || !name().trim()" class="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-black disabled:opacity-50">
                  @if (isBusy()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { {{ editingId() ? 'Lưu thay đổi' : 'Tạo nhãn' }} }
                </button>
                @if (message()) { <p class="text-xs font-bold" [class.text-red-500]="messageType() === 'error'" [class.text-emerald-600]="messageType() === 'success'">{{message()}}</p> }
              </section>

              <section class="rounded-2xl border border-fuchsia-200 dark:border-fuchsia-900/40 bg-fuchsia-50/50 dark:bg-fuchsia-900/10 p-4 space-y-3">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h4 class="text-sm font-black text-fuchsia-800 dark:text-fuchsia-200">VLAT-1.1669 · 487/QĐ-AOSC</h4>
                    <p class="text-xs text-fuchsia-700/80 dark:text-fuchsia-300/80 mt-1">119 mã NAFI6/H-* hóa học, không bao gồm phần sinh học. Thiết bị chỉ là metadata dẫn xuất.</p>
                  </div>
                  <button type="button" (click)="loadPreview()" [disabled]="isBusy()" class="shrink-0 rounded-xl border border-fuchsia-300 dark:border-fuchsia-700 px-3 py-2 text-xs font-black text-fuchsia-700 dark:text-fuchsia-200 hover:bg-white/70 disabled:opacity-50">Preview</button>
                </div>
                @if (preview()) {
                  <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div class="rounded-lg bg-white/70 dark:bg-slate-800/70 p-2"><div class="text-lg font-black">{{preview()!.createIds.length}}</div><div class="text-[10px] uppercase text-slate-500">Tạo</div></div>
                    <div class="rounded-lg bg-white/70 dark:bg-slate-800/70 p-2"><div class="text-lg font-black">{{preview()!.updateIds.length}}</div><div class="text-[10px] uppercase text-slate-500">Cập nhật</div></div>
                    <div class="rounded-lg bg-white/70 dark:bg-slate-800/70 p-2"><div class="text-lg font-black">{{preview()!.unchangedIds.length}}</div><div class="text-[10px] uppercase text-slate-500">Giữ nguyên</div></div>
                    <div class="rounded-lg bg-white/70 dark:bg-slate-800/70 p-2"><div class="text-lg font-black">{{preview()!.restoreIds.length}}</div><div class="text-[10px] uppercase text-slate-500">Khôi phục</div></div>
                    <div class="rounded-lg bg-red-100 dark:bg-red-900/30 p-2"><div class="text-lg font-black text-red-600 dark:text-red-300">{{preview()!.conflictIds.length}}</div><div class="text-[10px] uppercase text-red-600 dark:text-red-300">Xung đột</div></div>
                  </div>
                  <label class="flex items-center gap-2 text-xs font-bold text-fuchsia-800 dark:text-fuchsia-200">
                    <input type="checkbox" [ngModel]="restoreArchivedFromSameSeed()" (ngModelChange)="restoreArchivedFromSameSeed.set($event); loadPreview()" [disabled]="isBusy()">
                    Khôi phục nhãn đã soft-delete cùng seed nếu còn hiệu lực
                  </label>
                  <button type="button" (click)="importSeed()" [disabled]="isBusy() || preview()!.conflictIds.length > 0" class="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2.5 text-sm font-black disabled:opacity-50">Nạp/đồng bộ seed hóa học</button>
                }
              </section>
            </div>

            <section>
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-black text-slate-700 dark:text-slate-200">Các nhãn trong danh mục ({{customOptions().length}})</h4>
                <button type="button" (click)="refreshCatalog()" [disabled]="isBusy()" class="text-xs font-bold text-indigo-600 hover:text-indigo-700">Làm mới</button>
              </div>
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                @for (option of customOptions(); track option.key) {
                  <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800/60" [class.opacity-60]="option.archived">
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0">
                        <div class="font-bold text-sm text-slate-700 dark:text-slate-200 truncate" [title]="option.key">{{option.label}}</div>
                        @if (option.methodName) { <div class="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2" [title]="option.methodName">{{option.methodName}}</div> }
                        <div class="text-[10px] font-mono text-slate-400 truncate" [title]="option.key">{{option.key}}</div>
                        <div class="flex flex-wrap gap-1 mt-1">
                          @if (option.origin === 'ACCREDITATION_SCOPE') { <span class="rounded-full bg-fuchsia-100 text-fuchsia-700 px-1.5 py-0.5 text-[9px] font-black">ACCREDITATION</span> }
                          @if (option.archived) { <span class="rounded-full bg-slate-100 text-slate-500 px-1.5 py-0.5 text-[9px] font-black">ĐÃ ẨN</span> }
                          @for (device of option.deviceCodes || []; track device) { <span class="rounded-full bg-fuchsia-50 text-fuchsia-700 px-1.5 py-0.5 text-[9px] font-black">{{device}}</span> }
                        </div>
                      </div>
                      @if (option.origin !== 'ACCREDITATION_SCOPE') {
                        <div class="flex gap-1 shrink-0">
                          @if (option.archived) {
                            <button type="button" (click)="restore(option.key)" [disabled]="isBusy()" class="text-xs text-emerald-600 hover:text-emerald-700" title="Khôi phục"><i class="fa-solid fa-rotate-left"></i></button>
                          } @else {
                            <button type="button" (click)="edit(option)" [disabled]="isBusy()" class="text-xs text-indigo-600 hover:text-indigo-700" title="Sửa"><i class="fa-solid fa-pen"></i></button>
                            <button type="button" (click)="softDelete(option.key)" [disabled]="isBusy()" class="text-xs text-red-500 hover:text-red-600" title="Ẩn"><i class="fa-solid fa-eye-slash"></i></button>
                          }
                        </div>
                      }
                    </div>
                  </div>
                } @empty {
                  <div class="col-span-full text-xs text-slate-400 italic">Chưa có nhãn custom trong danh mục.</div>
                }
              </div>
            </section>
          </div>
        </div>
      </div>
    }
  `,
})
export class StandardsTagManagerModalComponent {
  isOpen = input(false);
  close = output<void>();

  readonly catalog = inject(StandardTagCatalogService);
  readonly customOptions = computed<StandardTagOption[]>(() => [...this.catalog.lookupMap().values()]
    .filter(option => option.source === 'CUSTOM')
    .sort((a, b) => a.methodCode && b.methodCode
      ? compareChemicalMethodCodes(a.methodCode, b.methodCode)
      : a.label.localeCompare(b.label, 'vi', { sensitivity: 'base', numeric: true })));

  name = signal('');
  description = signal('');
  color = signal('');
  editingId = signal<string | null>(null);
  preview = signal<SeedPreview | null>(null);
  restoreArchivedFromSameSeed = signal(false);
  isBusy = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error'>('success');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.preview.set(null);
        this.clearMessage();
      }
    });
  }

  edit(option: StandardTagOption): void {
    try {
      this.editingId.set(parseTagKeyStrict(option.key).id);
      this.name.set(option.label);
      this.description.set(option.description || '');
      this.color.set(option.color || '');
    } catch {
      this.showMessage('Key nhãn không hợp lệ.', 'error');
    }
  }

  resetForm(): void {
    this.editingId.set(null);
    this.name.set('');
    this.description.set('');
    this.color.set('');
  }

  async saveManualTag(): Promise<void> {
    if (this.isBusy()) return;
    this.isBusy.set(true);
    try {
      const input = { name: this.name(), description: this.description(), color: this.color() };
      if (this.editingId()) await this.catalog.updateCustomTag(this.editingId()!, input);
      else await this.catalog.createCustomTag(input);
      this.showMessage(this.editingId() ? 'Đã cập nhật nhãn.' : 'Đã tạo nhãn.', 'success');
      this.resetForm();
    } catch (error: any) {
      this.showMessage(error?.message || 'Không thể lưu nhãn.', 'error');
    } finally {
      this.isBusy.set(false);
    }
  }

  async softDelete(key: string): Promise<void> {
    if (this.isBusy() || !window.confirm('Ẩn nhãn này? Lịch sử cũ vẫn giữ nguyên label.')) return;
    await this.runCatalogAction(() => this.catalog.softDeleteCustomTag(parseTagKeyStrict(key).id), 'Đã ẩn nhãn.');
  }

  async restore(key: string): Promise<void> {
    if (this.isBusy()) return;
    await this.runCatalogAction(() => this.catalog.restoreCustomTag(parseTagKeyStrict(key).id), 'Đã khôi phục nhãn.');
  }

  async refreshCatalog(): Promise<void> {
    if (this.isBusy()) return;
    await this.runCatalogAction(() => this.catalog.refresh(true), 'Đã làm mới danh mục.');
  }

  async loadPreview(): Promise<void> {
    if (this.isBusy()) return;
    this.isBusy.set(true);
    try {
      this.preview.set(await this.catalog.previewAccreditationMethodImport({ restoreArchivedFromSameSeed: this.restoreArchivedFromSameSeed() }));
      this.clearMessage();
    } catch (error: any) {
      this.showMessage(error?.message || 'Không thể đọc preview seed.', 'error');
    } finally {
      this.isBusy.set(false);
    }
  }

  async importSeed(): Promise<void> {
    if (this.isBusy() || !this.preview() || this.preview()!.conflictIds.length > 0) return;
    if (!window.confirm(`Nạp ${this.preview()!.createIds.length + this.preview()!.updateIds.length + this.preview()!.restoreIds.length} nhãn phương pháp?`)) return;
    this.isBusy.set(true);
    try {
      const result = await this.catalog.upsertAccreditationMethodTags({ restoreArchivedFromSameSeed: this.restoreArchivedFromSameSeed() });
      this.showMessage(`Đã đồng bộ seed: tạo ${result.createIds.length}, cập nhật ${result.updateIds.length}, khôi phục ${result.restoreIds.length}, giữ nguyên ${result.unchangedIds.length}.`, 'success');
      this.preview.set(await this.catalog.previewAccreditationMethodImport({ restoreArchivedFromSameSeed: this.restoreArchivedFromSameSeed() }));
    } catch (error: any) {
      this.showMessage(error?.message || 'Không thể import seed.', 'error');
    } finally {
      this.isBusy.set(false);
    }
  }

  private async runCatalogAction(action: () => Promise<unknown>, success: string): Promise<void> {
    this.isBusy.set(true);
    try {
      await action();
      this.showMessage(success, 'success');
    } catch (error: any) {
      this.showMessage(error?.message || 'Thao tác danh mục thất bại.', 'error');
    } finally {
      this.isBusy.set(false);
    }
  }

  private showMessage(value: string, type: 'success' | 'error'): void {
    this.message.set(value);
    this.messageType.set(type);
  }

  private clearMessage(): void {
    this.message.set('');
  }
}
