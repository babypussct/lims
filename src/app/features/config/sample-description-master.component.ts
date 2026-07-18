import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SampleDescriptionMaster } from '../../core/models/sample-description.model';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { ToastService } from '../../core/services/toast.service';
import { generateSlug } from '../../shared/utils/utils';
import { SampleDescriptionMasterService } from './sample-description-master.service';

@Component({
  selector: 'app-sample-description-master',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sample-description-master.component.html'
})
export class SampleDescriptionMasterComponent implements OnInit {
  private readonly service = inject(SampleDescriptionMasterService);
  private readonly toast = inject(ToastService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly auth = inject(AuthService);

  readonly items = signal<SampleDescriptionMaster[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showModal = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly statusFilter = signal<'all' | 'active' | 'inactive'>('active');
  readonly importPreview = signal<SampleDescriptionMaster[]>([]);

  formData = this.emptyForm();

  readonly filteredItems = computed(() => {
    const term = normalizeText(this.searchTerm());
    const status = this.statusFilter();
    return this.items().filter(item => {
      if (status === 'active' && !item.isActive) return false;
      if (status === 'inactive' && item.isActive) return false;
      if (!term) return true;
      return normalizeText([item.id, item.name, ...(item.aliases || []), item.description || ''].join(' ')).includes(term);
    });
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      this.items.set(await this.service.getAll());
    } catch (error: any) {
      this.toast.show(`Không thể tải Master mô tả mẫu: ${error?.message || error}`, 'error');
    } finally {
      this.loading.set(false);
    }
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.formData = this.emptyForm();
    this.showModal.set(true);
  }

  openEditModal(item: SampleDescriptionMaster): void {
    this.editingId.set(item.id);
    this.formData = {
      id: item.id,
      name: item.name,
      aliasesText: (item.aliases || []).join('\n'),
      description: item.description || '',
      isActive: item.isActive
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
  }

  onNameChange(): void {
    if (!this.editingId()) this.formData.id = generateSlug(this.formData.name);
  }

  async save(): Promise<void> {
    const item = this.buildItemFromForm();
    if (!item.id || !item.name) {
      this.toast.show('Vui lòng nhập mã và tên mô tả mẫu.', 'error');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(item.id)) {
      this.toast.show('Mã ID phải dùng chữ thường không dấu, số và dấu gạch dưới (_), ví dụ: ca_tra.', 'error');
      return;
    }
    const duplicateId = this.items().find(existing =>
      existing.id === item.id && existing.id !== this.editingId()
    );
    if (duplicateId) {
      this.toast.show(`Mã ID “${item.id}” đã được sử dụng cho “${duplicateId.name}”.`, 'error');
      return;
    }
    const duplicate = this.items().find(existing =>
      existing.id !== this.editingId() && normalizeText(existing.name) === normalizeText(item.name)
    );
    if (duplicate) {
      this.toast.show(`Tên mô tả đã tồn tại với mã “${duplicate.id}”.`, 'error');
      return;
    }

    this.saving.set(true);
    try {
      await this.service.save(item, this.auth.currentUser()?.displayName || '');
      this.toast.show('Đã lưu Master mô tả mẫu.', 'success');
      this.closeModal();
      await this.loadData();
    } catch (error: any) {
      this.toast.show(`Không thể lưu: ${error?.message || error}`, 'error');
    } finally {
      this.saving.set(false);
    }
  }

  async toggleActive(item: SampleDescriptionMaster): Promise<void> {
    const nextActive = !item.isActive;
    if (!nextActive) {
      const confirmed = await this.confirmation.confirm({
        message: `Ngừng sử dụng “${item.name}”? Dữ liệu đã lưu trong các mẻ cũ vẫn được giữ nguyên.`,
        confirmText: 'Ngừng sử dụng'
      });
      if (!confirmed) return;
    }
    try {
      await this.service.setActive(item, nextActive, this.auth.currentUser()?.displayName || '');
      this.toast.show(nextActive ? 'Đã kích hoạt mô tả mẫu.' : 'Đã ngừng sử dụng mô tả mẫu.', 'success');
      await this.loadData();
    } catch (error: any) {
      this.toast.show(`Không thể cập nhật trạng thái: ${error?.message || error}`, 'error');
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const XLSX = await import('xlsx');
      const data = new Uint8Array(await file.arrayBuffer());
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
      const parsed = rows.map(row => this.parseImportRow(row)).filter((item): item is SampleDescriptionMaster => Boolean(item));
      this.importPreview.set(parsed);
      this.toast.show(`Đã đọc ${parsed.length} dòng hợp lệ.`, parsed.length ? 'success' : 'info');
    } catch (error: any) {
      this.toast.show(`Không thể đọc file: ${error?.message || error}`, 'error');
    } finally {
      input.value = '';
    }
  }

  async confirmImport(): Promise<void> {
    const preview = this.importPreview();
    if (!preview.length) return;
    this.saving.set(true);
    try {
      await this.service.saveBatch(preview, this.auth.currentUser()?.displayName || '');
      this.importPreview.set([]);
      this.toast.show(`Đã import ${preview.length} mô tả mẫu.`, 'success');
      await this.loadData();
    } catch (error: any) {
      this.toast.show(`Không thể import: ${error?.message || error}`, 'error');
    } finally {
      this.saving.set(false);
    }
  }

  async exportToExcel(): Promise<void> {
    try {
      const XLSX = await import('xlsx');
      const rows = this.items().map(item => ({
        'Mã ID': item.id,
        'Tên mô tả mẫu': item.name,
        'Bí danh': (item.aliases || []).join('; '),
        'Mô tả / Ghi chú': item.description || '',
        'Đang sử dụng': item.isActive ? 'Có' : 'Không'
      }));
      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet['!cols'] = [{ wch: 24 }, { wch: 32 }, { wch: 36 }, { wch: 48 }, { wch: 16 }];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'MoTaMau');
      XLSX.writeFile(workbook, 'LIMS_Master_Mo_Ta_Mau.xlsx');
    } catch (error: any) {
      this.toast.show(`Không thể xuất Excel: ${error?.message || error}`, 'error');
    }
  }

  private parseImportRow(row: Record<string, unknown>): SampleDescriptionMaster | null {
    let id = '';
    let name = '';
    let aliasesText = '';
    let description = '';
    let isActive = true;
    Object.entries(row).forEach(([rawKey, rawValue]) => {
      const key = normalizeText(rawKey);
      const value = String(rawValue ?? '').trim();
      if ((key.includes('ma id') || key === 'id') && value) id = value;
      else if ((key.includes('ten mo ta') || key === 'name' || key === 'ten') && value) name = value;
      else if (key.includes('bi danh') || key.includes('alias')) aliasesText = value;
      else if (key.includes('ghi chu') || key === 'mo ta' || key.includes('description')) description = value;
      else if (key.includes('dang su dung') || key.includes('active')) isActive = !['khong', 'no', 'false', '0'].includes(normalizeText(value));
    });
    if (!name) return null;
    return {
      id: generateSlug(id || name),
      name,
      aliases: splitAliases(aliasesText),
      description,
      isActive
    };
  }

  private buildItemFromForm(): SampleDescriptionMaster {
    return {
      id: this.formData.id.trim(),
      name: this.formData.name.trim(),
      aliases: splitAliases(this.formData.aliasesText),
      description: this.formData.description.trim(),
      isActive: this.formData.isActive
    };
  }

  private emptyForm() {
    return { id: '', name: '', aliasesText: '', description: '', isActive: true };
  }
}

function splitAliases(value: string): string[] {
  return Array.from(new Set(value.split(/[;\n,]/).map(item => item.trim()).filter(Boolean)));
}

function normalizeText(value: string): string {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
