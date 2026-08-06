import { Injectable, signal, computed } from '@angular/core';
import * as i0 from "@angular/core";
export class ProgressService {
    constructor() {
        this.isVisible = signal(false);
        this.title = signal('Đang xử lý');
        this.message = signal('Vui lòng đợi trong giây lát...');
        this.current = signal(0);
        this.total = signal(0);
        this.progressPercentage = computed(() => {
            if (this.total() === 0)
                return 0;
            return (this.current() / this.total()) * 100;
        });
    }
    /**
     * Khởi động quá trình với overlay.
     * @param title Tiêu đề của overlay
     * @param message Tin nhắn phụ
     * @param total Tổng số lượng mục cần xử lý (mặc định 0 nếu không biết trước)
     */
    start(title, message, total = 0) {
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
    update(current, message) {
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
    static { this.ɵfac = function ProgressService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ProgressService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ProgressService, factory: ProgressService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProgressService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=progress.service.js.map