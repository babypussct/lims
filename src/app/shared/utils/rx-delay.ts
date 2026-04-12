import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Custom RxJS Operator: Trì hoãn việc bắt đầu một side-effect / fetch API.
 * 
 * Mục đích: Nếu người dùng bấm nhầm vào URL một module nặng, họ thường
 * nhận ra ngay và bấm nút "Back" hoặc chuyển sang module khác trong khoảng < 500ms.
 * Áp dụng operator này sẽ chưa gọi data ngay lập tức, và nếu UI bị destroy sớm, 
 * Observable chain sẽ bị huỷ -> không có HTTP Request dư thừa lên server.
 * 
 * Mặc định delay 300ms.
 */
export function delayFetch<T>(timeMs: number = 300) {
  return (source: Observable<T>) => source.pipe(
    // Thay vì truyền value đi ngay, bắt đầu một bộ đếm timer
    switchMap((value) => timer(timeMs).pipe(
      // Sau timeMs, mới đẩy value gốc đi tiếp
      switchMap(() => {
        return new Observable<T>(subscriber => {
          subscriber.next(value);
          subscriber.complete();
        });
      })
    ))
  );
}

/**
 * Tiện ích: Tạo nhanh một luồng gọi API có Delay bảo vệ.
 * @param delayMs Thời gian chờ trước khi thực sự gọi API (thường 200 - 400ms)
 * @param fetchFn Hàm sinh ra HTTP Request Observable
 * 
 * Cách dùng:
 * fetchWithDelay(300, () => this.dbService.getHeavyStats())
 *   .pipe(takeUntilDestroyed())
 *   .subscribe(data => this.data.set(data));
 */
export function fetchWithDelay<T>(delayMs: number, fetchFn: () => Observable<T>): Observable<T> {
  return timer(delayMs).pipe(
    switchMap(() => fetchFn())
  );
}
