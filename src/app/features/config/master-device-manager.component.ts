import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDeviceService } from './master-device.service';
import { MasterDevice } from '../../core/models/sop.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { generateSlug } from '../../shared/utils/utils';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-master-device-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './master-device-manager.component.html'
})
export class MasterDeviceManagerComponent implements OnInit {
  deviceService = inject(MasterDeviceService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);

  devices = signal<MasterDevice[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);

  showModal = signal(false);
  editingItem = signal<MasterDevice | null>(null);
  
  formData = {
    id: '',
    name: '',
    description: ''
  };
  
  isEditMode = false;

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      await this.deviceService.seedDefaults(); // Auto seed
      const data = await this.deviceService.getAll();
      this.devices.set(data);
    } catch (e: any) {
      this.toast.show('Lỗi tải danh sách thiết bị', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.formData = { id: '', name: '', description: '' };
    this.showModal.set(true);
  }

  openEditModal(item: MasterDevice) {
    this.isEditMode = true;
    this.formData = { 
      id: item.id, 
      name: item.name, 
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
      this.toast.show('Vui lòng nhập mã và tên thiết bị', 'error');
      return;
    }

    this.isSaving.set(true);
    try {
      const payload: MasterDevice = {
        id: this.formData.id,
        name: this.formData.name,
        description: this.formData.description
      };
      await this.deviceService.save(payload);
      this.toast.show('Đã lưu thiết bị thành công', 'success');
      this.closeModal();
      await this.loadData();
    } catch (e: any) {
      this.toast.show('Lỗi khi lưu: ' + e.message, 'error');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteItem(item: MasterDevice) {
    const ok = await this.confirmation.confirm({
      message: `Bạn có chắc chắn muốn xóa thiết bị "${item.name}" không?`,
      isDangerous: true
    });
    if (!ok) return;

    try {
      await this.deviceService.delete(item.id);
      this.toast.show('Đã xóa thiết bị', 'success');
      await this.loadData();
    } catch (e: any) {
      this.toast.show('Lỗi khi xóa: ' + e.message, 'error');
    }
  }

  async setDefault(item: MasterDevice) {
    try {
      await this.deviceService.toggleDefault(item);
      const msg = item.isDefault ? `Đã gỡ bỏ mặc định của "${item.name}"` : `Đã đặt "${item.name}" làm thiết bị mặc định`;
      this.toast.show(msg, 'success');
      await this.loadData();
    } catch (e: any) {
      this.toast.show('Lỗi: ' + e.message, 'error');
    }
  }
}
