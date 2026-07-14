import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  isVisible = signal<boolean>(false);
  title = signal<string>('Đang xử lý');
  message = signal<string>('Vui lòng đợi trong giây lát...');
  current = signal<number>(0);
  total = signal<number>(0);

  progressPercentage = computed(() => {
    if (this.total() === 0) return 0;
    return (this.current() / this.total()) * 100;
  });

  /**
   * Khởi động quá trình với overlay.
   * @param title Tiêu đề của overlay
   * @param message Tin nhắn phụ
   * @param total Tổng số lượng mục cần xử lý (mặc định 0 nếu không biết trước)
   */
  start(title: string, message: string, total = 0) {
    this.title.set(title);
    this.message.set(message);
    this.total.set(total);
    this.current.set(0);
    this.isVisible.set(true);
  }

  /**
   * Cập nhật tiến trình
   * @param current Số lượng hiện tại
   * @param message (Tuỳ chọn) Thông báo phụ muốn thay đổi
   */
  update(current: number, message?: string) {
    this.current.set(current);
    if (message !== undefined) {
      this.message.set(message);
    }
  }

  /**
   * Hoàn thành và đóng overlay
   */
  complete() {
    this.isVisible.set(false);
    // Có thể delay reset data nếu muốn, nhưng không bắt buộc vì sẽ bị override ở lần start sau
  }

  /**
   * Tắt overlay ngay lập tức (dùng khi có lỗi hoặc huỷ)
   */
  stop() {
    this.isVisible.set(false);
  }
}
