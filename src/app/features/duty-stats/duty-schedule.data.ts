import { parseDutyScheduleOcr } from './duty-stats.utils';

/**
 * Transcribed and verified directly from the 14 duty-schedule source images.
 * Keep the source-file headings because the parser exposes them as provenance.
 */
export const DUTY_SCHEDULE_OCR = `
### t6 2025.jpg
2025-06-02\tHồ | Trãi
2025-06-03\tHuỳnh | Phong
2025-06-04\tPhương | H.Anh
2025-06-05\tViệt | Nghĩa
2025-06-06\tSơn | Thiệt
2025-06-09\tHồ | Đạt(N)
2025-06-10\tTrãi | Đạt(O)
2025-06-11\tMinh | Nhã
2025-06-12\tHuỳnh | Chương
2025-06-13\tPhương | Tâm
2025-06-16\tSơn | Bến
2025-06-17\tViệt | Đạt(O)
2025-06-18\tMinh | Nhã
2025-06-19\tPhong | Dĩ
2025-06-20\tThiệt | H.Anh
2025-06-23\tTâm | Chương
2025-06-24\tNghĩa | Bến
2025-06-25\tĐạt(N) | Dĩ
2025-06-26\tSơn | Thiệt
2025-06-27\tPhong | Đạt(O)
2025-06-30\tHồ | Chương
### t7 2025.jpg
2025-07-01\tPhương | Sơn
2025-07-02\tTrãi | Thiệt
2025-07-03\tPhong | H.Anh
2025-07-04\tViệt | Bến
2025-07-07\tHồ | Huỳnh
2025-07-08\tChương | Dĩ
2025-07-09\tMinh | Nhã
2025-07-10\tPhương | Tâm
2025-07-11\tTrãi | Đạt(O)
2025-07-14\tHồ | Sơn
2025-07-15\tPhong | Đạt(N)
2025-07-16\tMinh | Chương
2025-07-17\tViệt | Dĩ
2025-07-18\tHuỳnh | Nhã
2025-07-21\tThiệt | H.Anh
2025-07-22\tBến | Đạt(O)
2025-07-23\tTâm | Đạt(N)
2025-07-24\tChương | Dĩ
2025-07-25\tTrãi | Phong
2025-07-28\tHồ | Sơn
2025-07-29\tNhã | Thiệt
2025-07-30\tBến | Đạt(O)
2025-07-31\tTâm | Đạt(N)
### t8 2025.jpg
2025-08-01\tHuỳnh | Phương
2025-08-04\tPhong | H.Anh
2025-08-05\tSơn | Dĩ
2025-08-06\tMinh | Đạt(N)
2025-08-07\tPhương | Tâm
2025-08-08\tThiệt | Bến
2025-08-11\tTrãi | Chương
2025-08-12\tPhong | Đạt(O)
2025-08-13\tViệt | H.Anh
2025-08-14\tHuỳnh | Tâm
2025-08-15\tNhã | Đạt(N)
2025-08-18\tHồ | Sơn
2025-08-19\tTrãi | Thiệt
2025-08-20\tMinh | Chương
2025-08-21\tPhong | Dĩ
2025-08-22\tViệt | Đạt(O)
2025-08-25\tHồ | Đạt(N)
2025-08-26\tSơn | Tâm
2025-08-27\tBến | Chương
2025-08-28\tNhã | Thiệt
2025-08-29\tH.Anh | Dĩ
### t10 2025.jpg
2025-10-01\tNhã | Minh
2025-10-02\tH.Anh | Huỳnh
2025-10-03\tViệt | Phong
2025-10-06\tHồ | Phương
2025-10-07\tSơn | Bến
2025-10-08\tĐạt(O) | Tâm
2025-10-09\tViệt | Nhã
2025-10-10\tHuỳnh | Thiệt
2025-10-13\tHồ | Đạt(N)
2025-10-14\tPhong | Dĩ
2025-10-15\tMinh | Chương
2025-10-16\tSơn | Đạt(O)
2025-10-17\tBến | Tâm
2025-10-20\tHuỳnh | Thiệt
2025-10-21\tPhương | H.Anh
2025-10-22\tViệt | Đạt(N)
2025-10-23\tChương | Dĩ
2025-10-24\tPhong | Sơn
2025-10-27\tHồ | Tâm
2025-10-28\tBến | Đạt(O)
2025-10-29\tPhương | Đạt(N)
2025-10-30\tThiệt | H.Anh
2025-10-31\tChương | Dĩ
### t11 2025.jpg
2025-11-03\tHồ | Sơn
2025-11-04\tTâm | Đạt(N)
2025-11-05\tMinh | Nhã
2025-11-06\tPhương | Khôi
2025-11-07\tĐạt(O) | Dĩ
2025-11-10\tHồ | Đạt(N)
2025-11-11\tThiệt | H.Anh
2025-11-12\tMinh | Chương
2025-11-13\tHuỳnh | Khôi
2025-11-14\tPhương | Bến
2025-11-17\tViệt | Chương
2025-11-18\tNhã | Phong
2025-11-19\tTâm | Dĩ
2025-11-20\tH.Anh | Sơn
2025-11-21\tBến | Đạt(O)
2025-11-24\tHuỳnh | Phong
2025-11-25\tViệt | Sơn
2025-11-26\tThiệt | Chương
2025-11-27\tDĩ | Khôi
2025-11-28\tTâm | Đạt(N)
### t12 2025.jpg
2025-12-01\tPhương | Hồ
2025-12-02\tHuỳnh | Phong
2025-12-03\tMinh | Nhã
2025-12-04\tViệt | Sơn
2025-12-05\tH.Anh | Bến
2025-12-08\tTâm | Chương
2025-12-09\tPhương | Khôi
2025-12-10\tMinh | Dĩ
2025-12-11\tHuỳnh | Thiệt
2025-12-12\tViệt | Đạt(N)
2025-12-15\tHồ | Đạt(O)
2025-12-16\tH.Anh | Khôi
2025-12-17\tTâm | Chương
2025-12-18\tNhã | Phong
2025-12-19\tSơn | Bến
2025-12-22\tĐạt(N) | Dĩ
2025-12-23\tThiệt | Đạt(O)
2025-12-24\tChương | Khôi
2025-12-25\tSơn | H.Anh
2025-12-26\tBến | Tâm
2025-12-29\tHồ | Phong
2025-12-30\tĐạt(N) | Dĩ
2025-12-31\tViệt | Đạt(O)
### t1 2026.jpg
2026-01-05\tHồ | Phương
2026-01-06\tHuỳnh | Nhã
2026-01-07\tPhong | Sơn
2026-01-08\tThiệt | Đạt(O)
2026-01-09\tH.Anh | Khôi
2026-01-10\tĐạt(N) | Dĩ
2026-01-12\tPhương | Chương
2026-01-13\tNhã | Sơn
2026-01-14\tMinh | Tâm
2026-01-15\tViệt | Khôi
2026-01-16\tHuỳnh | Bến
2026-01-19\tPhong | Đạt(N)
2026-01-20\tThiệt | Chương
2026-01-21\tMinh | Dĩ
2026-01-22\tH.Anh | Đạt(O)
2026-01-23\tBến | Tâm
2026-01-26\tHồ | Việt
2026-01-27\tĐạt(N) | Chương
2026-01-28\tDĩ | Khôi
2026-01-29\tSơn | Thiệt
2026-01-30\tĐạt(O) | Tâm
### t2 2026.jpg
2026-02-02\tHồ | Đạt(N)
2026-02-03\tNhã | Thiệt
2026-02-04\tPhong | Phương
2026-02-05\tMinh | Dĩ
2026-02-06\tBến | Sơn
2026-02-09\tH.Anh | Tâm
2026-02-10\tChương | Khôi
2026-02-11\tHuỳnh | Đạt(O)
2026-02-12\tPhong | Thiệt
2026-02-23\tViệt | Đạt(N)
2026-02-24\tChương | Dĩ
2026-02-25\tH.Anh | Bến
2026-02-26\tSơn | Tâm
2026-02-27\tĐạt(O) | Khôi
### t3 2026.jpg
2026-03-02\tĐạt(O) | Dĩ
2026-03-03\tPhong | Chương
2026-03-04\tViệt | Sơn
2026-03-05\tTâm | Đạt(N)
2026-03-06\tThiệt | Bến
2026-03-09\tHồ | Đạt(O)
2026-03-10\tNhã | Phong
2026-03-11\tHuỳnh | H.Anh
2026-03-12\tViệt | Khôi
2026-03-13\tPhương | Chương
2026-03-16\tBến | Sơn
2026-03-17\tThiệt | Đạt(N)
2026-03-18\tH.Anh | Đạt(O)
2026-03-19\tMinh | Tâm
2026-03-20\tChương | Khôi
2026-03-23\tHồ | Bến | Huỳnh
2026-03-24\tNhã | H.Anh | Phong
2026-03-25\tPhương | Khôi | Việt
2026-03-26\tMinh | Đạt(N) | Dĩ
2026-03-27\tSơn | Huỳnh | Thiệt
2026-03-30\tTâm | Nhã | Khôi
2026-03-31\tDĩ | Phương | Minh
### t4 2026.jpg
2026-04-01\tHồ | Phong | Bến
2026-04-02\tHuỳnh | Minh | Tâm
2026-04-03\tNhã | Sơn | Đạt(N)
2026-04-06\tThiệt | Đạt(O) | Khôi
2026-04-07\tViệt | H.Anh | Bến
2026-04-08\tTâm | Dĩ | Chương
2026-04-09\tHuỳnh | Nhã | Phong
2026-04-10\tPhương | Sơn | Khôi
2026-04-13\tHồ | Việt | Đạt(N)
2026-04-14\tThiệt | Đạt(O) | Tâm
2026-04-15\tPhương | Sơn | H.Anh
2026-04-16\tMinh | Nhã | Dĩ
2026-04-17\tPhong | Chương | Khôi
2026-04-20\tViệt | Thiệt | Đạt(O)
2026-04-21\tPhương | Đạt(N) | Dĩ
2026-04-22\tHồ | Huỳnh | Phong
2026-04-23\tMinh | Bến | Chương
2026-04-24\tH.Anh | Tâm | Khôi
2026-04-27\tSơn | Thiệt | Đạt(O)
2026-04-28\tĐạt(N) | Chương | Dĩ
2026-04-29\tViệt | Bến | Nhã
### t5 2026.jpg
2026-05-04\tHồ | Phong | Đạt(O)
2026-05-05\tPhương | Huỳnh | Dĩ
2026-05-06\tSơn | Bến | Đạt(N)
2026-05-07\tMinh | Tâm | Khôi
2026-05-08\tThiệt | H.Anh | Chương
2026-05-11\tNhã | Phong | Đạt(O)
2026-05-12\tPhương | Tâm | Đạt(N)
2026-05-13\tHồ | Sơn | Khôi
2026-05-14\tMinh | Việt | Dĩ
2026-05-15\tHuỳnh | Thiệt | Bến
2026-05-18\tPhong | Sơn | H.Anh
2026-05-19\tNhã | Chương | Khôi
2026-05-20\tViệt | Bến | Dĩ
2026-05-21\tMinh | Đạt(O) | Tâm
2026-05-22\tHồ | Phương | Đạt(N)
2026-05-25\tPhong | Thiệt | Khôi
2026-05-26\tSơn | H.Anh | Dĩ
2026-05-27\tHuỳnh | Nhã | Chương
2026-05-28\tViệt | Bến | Đạt(O)
2026-05-29\tTâm | Đạt(N) | Chương
### t6 2026.jpg
2026-06-01\tHồ | Huỳnh
2026-06-02\tViệt | Sơn
2026-06-03\tMinh | Nhã
2026-06-04\tPhong | H.Anh
2026-06-05\tĐạt(O) | Tâm
2026-06-08\tHồ | Phương
2026-06-09\tChương | Khôi
2026-06-10\tViệt | Thiệt
2026-06-11\tSơn | H.Anh
2026-06-12\tPhong | Bến
2026-06-15\tHuỳnh | Nhã
2026-06-16\tĐạt(O) | Đạt(N)
2026-06-17\tMinh | Dĩ
2026-06-18\tTâm | Chương
2026-06-19\tPhương | Thiệt
2026-06-22\tBến | Khôi
2026-06-23\tPhong | Sơn
2026-06-24\tĐạt(O) | Đạt(N)
2026-06-25\tTâm | Dĩ
2026-06-26\tThiệt | Chương
2026-06-29\tBến | Khôi
2026-06-30\tĐạt(N) | Dĩ
### t7 2026.jpg
2026-07-01\tPhương | Hồ
2026-07-02\tNhã | Huỳnh
2026-07-03\tViệt | Phong
2026-07-06\tH.Anh | Sơn
2026-07-07\tChương | Khôi
2026-07-08\tPhương | Tâm
2026-07-09\tMinh | Dĩ
2026-07-10\tHồ | Đạt(O)
2026-07-13\tNhã | Việt
2026-07-14\tHuỳnh | Bến
2026-07-15\tPhong | Đạt(N)
2026-07-16\tTâm | Sơn
2026-07-17\tH.Anh | Chương
2026-07-20\tThiệt | Bến
2026-07-21\tĐạt(O) | Khôi
2026-07-22\tPhương | Đạt(N)
2026-07-23\tMinh | Dĩ
2026-07-24\tViệt | Sơn
2026-07-27\tHồ | Huỳnh
2026-07-28\tNhã | H.Anh
2026-07-29\tChương | Khôi
2026-07-30\tThiệt | Tâm
2026-07-31\tDĩ | Đạt(N)
### t8 2026.jpg
2026-08-03\tSơn | Tâm | Huynh
2026-08-04\tHồ | Huỳnh
2026-08-05\tPhương | H.Anh
2026-08-06\tMinh | Dĩ
2026-08-07\tViệt | Đạt(O)
2026-08-10\tĐạt(N) | Chương | Thành
2026-08-11\tPhong | Bến
2026-08-12\tNhã | Khôi
2026-08-13\tPhương | Tâm
2026-08-14\tDĩ | Đạt(O)
2026-08-17\tHuỳnh | Sơn | Thành
2026-08-18\tViệt | Chương
2026-08-19\tPhong | Đạt(N)
2026-08-20\tNhã | H.Anh
2026-08-21\tThiệt | Bến
2026-08-24\tHồ | Khôi | Huynh
2026-08-25\tĐạt(O) | Tâm
2026-08-26\tĐạt(N) | Chương
2026-08-27\tMinh | Dĩ
2026-08-28\tThiệt | Bến
2026-08-31\tSơn | Khôi | Huynh
`.trim();

export const DUTY_SCHEDULE_DATA = parseDutyScheduleOcr(DUTY_SCHEDULE_OCR);
export const DUTY_SHIFTS = DUTY_SCHEDULE_DATA.shifts;
