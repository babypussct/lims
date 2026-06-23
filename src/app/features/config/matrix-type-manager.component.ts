import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatrixTypeService } from './matrix-type.service';
import { MatrixType } from '../../core/models/sop.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { generateSlug } from '../../shared/utils/utils';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-matrix-type-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './matrix-type-manager.component.html'
})
export class MatrixTypeManagerComponent implements OnInit {
  matrixService = inject(MatrixTypeService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);

  matrices = signal<MatrixType[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);

  showModal = signal(false);
  editingItem = signal<MatrixType | null>(null);
  
  formData = {
    id: '',
    name: '',
    color: '#94a3b8',
    description: ''
  };
  
  isEditMode = false;

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      await this.matrixService.seedDefaults(); // Auto seed
      const data = await this.matrixService.getAll();
      this.matrices.set(data);
    } catch (e: any) {
      this.toast.show('Lỗi tải danh sách nền mẫu', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.formData = { id: '', name: '', color: '#3b82f6', description: '' };
    this.showModal.set(true);
  }

  openEditModal(item: MatrixType) {
    this.isEditMode = true;
    this.formData = { 
      id: item.id, 
      name: item.name, 
      color: item.color || '#94a3b8', 
      description: item.description || '' 
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onNameChange() {
    if (!this.isEditMode && this.formData.name) {
      this.formData.id = generateSlug(this.formData.name);
    }
  }

  async save() {
    if (!this.formData.id || !this.formData.name) {
      this.toast.show('Vui lòng nhập mã và tên nền mẫu', 'error');
      return;
    }

    this.isSaving.set(true);
    try {
      const payload: MatrixType = {
        id: this.formData.id,
        name: this.formData.name,
        color: this.formData.color,
        description: this.formData.description
      };
      await this.matrixService.save(payload);
      this.toast.show('Đã lưu nền mẫu thành công', 'success');
      this.closeModal();
      await this.loadData();
    } catch (e: any) {
      this.toast.show('Lỗi khi lưu: ' + e.message, 'error');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteItem(item: MatrixType) {
    const ok = await this.confirmation.confirm({
      message: `Bạn có chắc chắn muốn xóa nền mẫu "${item.name}" không?`,
      isDangerous: true
    });
    if (!ok) return;

    try {
      await this.matrixService.delete(item.id);
      this.toast.show('Đã xóa nền mẫu', 'success');
      await this.loadData();
    } catch (e: any) {
      this.toast.show('Lỗi khi xóa: ' + e.message, 'error');
    }
  }

  async setDefault(item: MatrixType) {
    try {
      await this.matrixService.toggleDefault(item);
      const msg = item.isDefault ? `Đã gỡ bỏ mặc định của "${item.name}"` : `Đã đặt "${item.name}" làm nền mẫu mặc định`;
      this.toast.show(msg, 'success');
      await this.loadData();
    } catch (e: any) {
      this.toast.show('Lỗi: ' + e.message, 'error');
    }
  }
}
