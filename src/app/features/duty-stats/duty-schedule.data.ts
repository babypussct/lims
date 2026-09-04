import { parseDutyScheduleOcr } from './duty-stats.utils';

/**
 * Generated from the duty-schedule image folder.
 * Run: npm run sync:duty-schedule -- "/path/to/lich truc"
 */
export const DUTY_SCHEDULE_OCR = `
### t1 2026.jpg
2026-01-05	Hô & | Phương
2026-01-06	Huỳnh & | Nhã
2026-01-07	Phong & | Son
2026-01-08	Thiệt & | Đạt(O) | H.Anh &
2026-01-09	Khôi | Đạt (N) & | Di
2026-01-12	Phương | & Chương | Nhã &
2026-01-13	Sơn | Minh &
2026-01-14	Tâm | Việt &
2026-01-15	Khôi
2026-01-19	Phong & | Đat (N)
2026-01-20	Thiệt & | Chương | Minh &
2026-01-21	Di | H.Anh &
2026-01-22	Đạt (O) | Bên &
2026-01-23	Tâm
2026-01-26	Hồ & | Viêt | Đạt(N) &
2026-01-27	Chương | Di & Khôi
2026-01-28	Sơn &
2026-01-29	Thiệt | Đat(O) &
2026-01-30	Tâm
### t10 2025.jpg
2025-10-02	H.Anh & | Huỳnh
2025-10-03	Việt & | Phong
2025-10-06	Hồ & | Phương
2025-10-07	Sơn & | Bến
2025-10-08	Đạt(O) | & Tâm
2025-10-09	Việt & | Nhã
2025-10-10	Huỳnh & | Thiệt
2025-10-13	Hồ & | Đạt (N) | Phong &
2025-10-14	Di | Minh &
2025-10-15	Chương
2025-10-17	Bên & | Tâm
2025-10-20	Huỳnh & | Thiệt
2025-10-21	Phương | & H.Anh
2025-10-22	Việt & | Đạt (N)
2025-10-23	Chương | & Dĩ
2025-10-24	Phong & | Sơn
2025-10-27	Hồ & Tâm | Bên &
2025-10-28	Đạt (O) | Phương
2025-10-29	& Đạt (N) | Thiệt &
2025-10-30	H.Anh | Chương
2025-10-31	& Di
### t11 2025.jpg
2025-11-03	Hồ & | Sơn
2025-11-04	Tâm & | Đạt (N)
2025-11-05	Minh & | Nhã
2025-11-06	Phương | & Khôi
2025-11-07	Đạt(O) & | Di
2025-11-10	Hồ & | Đạt(N)
2025-11-11	Thiệt & | H.Anh
2025-11-12	Minh & | Chương
2025-11-13	Huỳnh & | Khôi
2025-11-14	Phương | & Bến
2025-11-17	Việt & | Chương
2025-11-18	Nhã & | Phong
2025-11-19	Tâm & | Di
2025-11-20	H.Anh & | Sơn
2025-11-21	Bến & | Đạt(O)
2025-11-24	Huỳnh &
2025-11-25	Phong | Việt & | Sơn
2025-11-26	Thiệt &
2025-11-27	Chương | Đĩ & Khôi!
2025-11-28	Tâm & | Đạt(N)
### t12 2025.jpg
2025-12-02	Huỳnh & | Phong
2025-12-03	Minh & | Nhã
2025-12-04	Việt & | Sơn
2025-12-05	H.Anh & | Bến
2025-12-08	Tâm & | Chương
2025-12-09	Phương | & Khôi
2025-12-10	Minh & | Dì
2025-12-11	Huỳnh | & Thiệt
2025-12-12	Việt & | Đạt(N)
2025-12-15	Hồ & | Đạt (O)
2025-12-17	Tâm & | Chương
2025-12-18	Nhã & | Phong
2025-12-19	Sơn & | Bến
2025-12-22	Đạt(N) & | Dĩ
2025-12-23	Thiệt & | Đạt (O)
2025-12-24	Chưong | & Khôi
2025-12-25	Sơn & | H.Anh
2025-12-26	Bến & | Tâm
2025-12-29	Hồ & | Phong
2025-12-30	Đạt(N) & | Di
2025-12-31	Việt & | Đạt (O)
### t2 2026.jpg
2026-02-02	Hô & | Đat (N)
2026-02-03	Nhà & | Thiệt
2026-02-04	Phong & | Phương
2026-02-05	Minh & | Di
2026-02-06	Bên & | Sơn
2026-02-09	H.Anh & | Tâm
2026-02-10	Chương | & Khôi
2026-02-11	Huỳnh & | Đạt(O)
2026-02-12	Phong & | Thiệt
2026-02-23	Việt & | Đat(N)
2026-02-24	Chương | & Di
2026-02-25	H.Anh & | Bến
2026-02-26	Sơn & | Tâm
2026-02-27	Đạt(O) & | Khôi
### t3 2026.jpg
2026-03-02	Đạt (O) | & Dĩ
2026-03-03	Phong & | Chương
2026-03-04	Việt & | Sơn
2026-03-05	Tâm & | Đat(N)
2026-03-06	Thiệt & | Bên
2026-03-09	Hô & | Đat(O)
2026-03-10	Nhà & | Phong
2026-03-11	Huỳnh & | H.Anh
2026-03-12	Việt & | Khôi
2026-03-13	Phương & | Chương
2026-03-17	Thiệt & | Đạt (N)
2026-03-18	H.Anh & | Đạt (O)
2026-03-19	Minh & | Tâm
2026-03-20	Chương | & Khôi
2026-03-23	Hồ, Bến | & Huỳnh
2026-03-24	Nhà | H.Anh & | Phong
2026-03-25	Phong. | Khôi & | Viêt
2026-03-26	Minh, | Đạt(N) | & Dĩ
2026-03-27	Son, | Huynh & | Thiệt
2026-03-30	Tâm, | Nhà &: | Khởi
2026-03-31	Dĩ, | Phương | & Minh
### t4 2026.jpg
2026-04-02	Huỳnh, | Minh, | Tâm
2026-04-03	Nhã, | Sơn, | Đat/N
2026-04-06	Thiệt, | Đạt (O), | Khối
2026-04-07	Việt, | HAnh, | Bền
2026-04-08	Tâm, Di, | Chương
2026-04-09	Huỳnh | Nhã, | Phong
2026-04-10	Phương. | Sơn, | Khôi.
2026-04-13	Hồ, | Việt, | Đat (AD
2026-04-14	Thiệt, | Đạt (O), | Tâm
2026-04-15	Phương, | Sơn, | HAnh
2026-04-17	Phong, | Chương. | Khôi,
2026-04-20	Việt, | Thiệt, | Đạt(O)
2026-04-21	Phương. | Đạt (N), | Di
2026-04-22	Hồ, | Huỳnh, | Phong
2026-04-23	Minh, | Bến, | Chương |
2026-04-24	H.Anh, | Tâm | Khôi
2026-04-27	Sơn, | Thiệt, | Đạt(O)
2026-04-28	Đạt (N), | Chương. | Di
2026-04-29	Việt, | Bến, | Nhã
### t5 2026.jpg
2026-05-04	HO, | Phong. | Đat(O)
2026-05-05	Phương. | Huỳnh,
2026-05-06	DI | Sơn. | Bên,
2026-05-07	Đat(N). | Minh, | Tâm,
2026-05-08	Khôi | Thiệt, | H.Anh, | Chưmme
2026-05-11	Nhà, | Phong.
2026-05-12	Đat(O) | Phương, | Tâm,
2026-05-13	Dat(N | Hồ, Sơn, | Khôi
2026-05-14	Minh, | Việt, Dĩ
2026-05-15	Huynh, | Thiệt, | Bến.
2026-05-18	Phong | Son, | H.Anh
2026-05-19	Nha, | Chương. | Khôi
2026-05-20	Việt, | Bến, Dĩ
2026-05-21	Minh, | Đạt(O), | Tâm:
2026-05-22	Hồ, | Phương, | Dat(N)
2026-05-25	Phong. | Thiệt,
2026-05-26	Khôi | Son. | H.Anh.
2026-05-27	Huỳnh, | Nhã, | Chương
2026-05-28	Việt. | Bên, | Đat(Q))
2026-05-29	Tâm, | Đại(N), | Chương
### t6 2025.jpg
2025-06-02	Hô & | Trãi
2025-06-03	Huỳnh & | Phong
2025-06-04	Phương | & H.Anh
2025-06-05	Việt & | Nghĩa
2025-06-06	Sơn & | Thiệt
2025-06-09	Hồ & | Đạt(N)
2025-06-10	Trãi & | Đat(O)
2025-06-11	Minh & | Nhã
2025-06-12	Huỳnh & | Chương
2025-06-13	Phương | & Tâm
2025-06-17	Việt & | Đạt (O)
2025-06-18	Minh & | Nhã
2025-06-19	Phong & | DI
2025-06-20	Thiệt & | H.Anh
2025-06-23	Tâm & | Chương
2025-06-24	Nghĩa & | Bên
2025-06-25	Đạt(N) &
2025-06-26	Di | Sơn &
2025-06-27	Thiệt | Phong & | Đạt (O)
2025-06-30	Hồ &
### t6 2026.jpg
2026-06-02	Việt & | Sơn
2026-06-03	Minh & | Nhã
2026-06-04	Phong | & | HAnh
2026-06-05	Đạt(O) | & Tâm
2026-06-08	Hồ & | Phương
2026-06-09	Chương | & Khôi
2026-06-10	Việt & | Thiêt
2026-06-11	Sơn & | H.Anh
2026-06-12	Phong | & Bến
2026-06-15	Huỳnh | & Nhã
2026-06-17	Minh & | Di
2026-06-18	Tâm & | Chương
2026-06-19	Phương | & Thiệt
2026-06-22	Bến & | Khối
2026-06-23	Phong | & Sơn
2026-06-24	02 Đat | (0&N)
2026-06-25	Tâm & | Di
2026-06-26	Thiệt & | Chương
2026-06-29	Bên & | Khôi
2026-06-30	Đạt (N) | & Di
### t7 2025.jpg
2025-07-02	Trãi & | Thiệt
2025-07-03	Phong & | H.Anh
2025-07-04	Việt & | Bến
2025-07-07	Hồ & | Huỳnh
2025-07-08	Chương | & Dĩ
2025-07-09	Minh &
2025-07-10	Nhã | Phương
2025-07-11	& Tâm | Trãi & | Đạt(O)
2025-07-14	IS | Hồ & Sơn
2025-07-15	Phong &
2025-07-16	Đạt (N)
2025-07-17	Việt & Dì
2025-07-18	Huỳnh & | Nhã
2025-07-21	Thiệt & | H.Anh
2025-07-22	Bên & | Đạt (O)
2025-07-23	Tâm & | Dat(N)
2025-07-24	Chương
2025-07-25	& Di | Trài & | Phong
2025-07-28	Hồ & Sơn
2025-07-29	Nhã &
2025-07-30	Thiệt | Bên &
2025-07-31	Đạt (O) | Tâm 2
### t7 2026.jpg
2026-07-02	Nhã & | Huỳnh
2026-07-03	Việt & | Phong
2026-07-06	H.Anh | & Sơn
2026-07-07	Chương & | Khôi
2026-07-08	Phương | & Tâm
2026-07-09	Minh & | Di
2026-07-10	Hồ & | Đạt(O)
2026-07-13	Nhã & | Việt
2026-07-14	Huỳnh | & Bến
2026-07-15	Phong & | Đạt (N)
2026-07-17	H.Anh & | Chương
2026-07-20	Thiệt & | Bền
2026-07-21	Đạt(O) | & Khôi
2026-07-22	Phương & | Đạt(N)
2026-07-23	Minh & | Di
2026-07-24	Việt & | Sơn
2026-07-27	Hò & | Huỳnh:
2026-07-28	Nha & | H.Anh
2026-07-29	Chương | & Khôi
2026-07-30	Thiệt & | Tâm
2026-07-31	Di & | Đạt(N)
### t8 2025.jpg
2025-08-04	Phong & | H.Anh
2025-08-05	Sơn & Di
2025-08-06	Minh & | Đạt (N)
2025-08-07	Phương & | Tâm
2025-08-08	Thiệt & | Bến
2025-08-11	Trãi & | Chương
2025-08-12	Phong & | Đạt(O)
2025-08-13	Việt & | H.Anh
2025-08-14	Huỳnh & | Tâm
2025-08-15	Nhà & | Đạt(N)
2025-08-18	Hồ & Sơn
2025-08-19	Trãi & | Thiệt
2025-08-20	Minh & | Chương
2025-08-21	Phong &
2025-08-22	Di | Việt & | Đạt (O)
2025-08-25	Hồ &
2025-08-26	Đạt(N) | Sơn & | Tâm
2025-08-27	Bến &
2025-08-28	Chương | Nhã &
2025-08-29	Thiệt | H.Anh & | Di
### t8 2026.jpg
2026-08-03	Son, | Tâm, | Huynh
2026-08-04	Hồ, | Huỳnh
2026-08-05	Phương | & H.Anh
2026-08-06	Minh, Di
2026-08-07	Việt, | Đạt (O)
2026-08-10	Đạt (N), | Chương. | Thành
2026-08-11	Phong, | Bên
2026-08-12	Nhã, | Khôi
2026-08-13	Phưong, | Tâm
2026-08-14	Di. | Đạt (O)
2026-08-17	Huỳnh, | Sơn, | Thành)
2026-08-18	Việt, | Chương
2026-08-19	Phong, | Đạt (N)
2026-08-20	Nhã, | H.Anh
2026-08-21	Thiệt, | Bên
2026-08-24	; Hồ, | Khôi, | Huwnh
2026-08-25	Đạt (O), | Tâm
2026-08-26	Đạt (N), | Chương
2026-08-27	Minh, Di
2026-08-28	Thiệt, | Bên
2026-08-31	Som, | Khsi | Husan
`.trim();

export const DUTY_SCHEDULE_DATA = parseDutyScheduleOcr(DUTY_SCHEDULE_OCR);
export const DUTY_SHIFTS = DUTY_SCHEDULE_DATA.shifts;
