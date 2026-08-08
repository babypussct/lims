import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { doc, getDoc, runTransaction, collection, query, getDocs, orderBy, limit, startAfter, writeBatch } from 'firebase/firestore';
import { timestampToDate } from '../../shared/utils/timestamp';
import * as i0 from "@angular/core";
export class StatsService {
    constructor() {
        this.fb = inject(FirebaseService);
        this.auth = inject(AuthService);
    }
    getMonthKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
    }
    getDayKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    /**
     * Cập nhật (tăng/giảm) chỉ số vào document thống kê của tháng.
     * Sử dụng runTransaction để đảm bảo tính nhất quán (Atomicity) khi có nhiều người duyệt cùng lúc.
     */
    async incrementStats(date, sopId, sopName, samples, batches = 1, qcs = 0, isDecrement = false) {
        const monthKey = this.getMonthKey(date);
        const dayKey = this.getDayKey(date);
        const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/monthly_stats`, monthKey);
        const multiplier = isDecrement ? -1 : 1;
        const sDelta = samples * multiplier;
        const bDelta = batches * multiplier;
        const qDelta = qcs * multiplier;
        try {
            await runTransaction(this.fb.db, async (transaction) => {
                const sfDoc = await transaction.get(docRef);
                let data = {};
                if (sfDoc.exists()) {
                    data = sfDoc.data();
                }
                if (!data[dayKey]) {
                    data[dayKey] = { totalSamples: 0, totalBatches: 0, totalQcs: 0, sops: {} };
                }
                // Đảm bảo không bị âm nếu dữ liệu bị lệch
                data[dayKey].totalSamples = Math.max(0, data[dayKey].totalSamples + sDelta);
                data[dayKey].totalBatches = Math.max(0, data[dayKey].totalBatches + bDelta);
                data[dayKey].totalQcs = Math.max(0, (data[dayKey].totalQcs || 0) + qDelta);
                // Lưu tên SOP làm key để dễ nhóm trên biểu đồ (hoặc kết hợp id+name)
                const sopKey = sopName || sopId || 'Unknown';
                if (!data[dayKey].sops[sopKey]) {
                    data[dayKey].sops[sopKey] = { samples: 0, batches: 0, qcs: 0 };
                }
                data[dayKey].sops[sopKey].samples = Math.max(0, data[dayKey].sops[sopKey].samples + sDelta);
                data[dayKey].sops[sopKey].batches = Math.max(0, data[dayKey].sops[sopKey].batches + bDelta);
                data[dayKey].sops[sopKey].qcs = Math.max(0, (data[dayKey].sops[sopKey].qcs || 0) + qDelta);
                // Dọn dẹp nếu bằng 0
                if (data[dayKey].sops[sopKey].samples === 0 && data[dayKey].sops[sopKey].batches === 0 && data[dayKey].sops[sopKey].qcs === 0) {
                    delete data[dayKey].sops[sopKey];
                }
                transaction.set(docRef, data, { merge: true });
            });
        }
        catch (e) {
            console.error('Failed to update stats: ', e);
        }
    }
    /**
     * Lấy dữ liệu thống kê của nhiều tháng liên tiếp (Ví dụ: để vẽ biểu đồ 60 ngày)
     */
    async getStatsForMonths(monthKeys) {
        const result = {};
        if (!this.auth.canViewReports())
            return result;
        for (const key of Array.from(new Set(monthKeys))) {
            try {
                const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/monthly_stats`, key);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    result[key] = snap.data();
                }
                else {
                    result[key] = {};
                }
            }
            catch (e) {
                console.error(`Error fetching stats for ${key}:`, e);
                result[key] = {};
            }
        }
        return result;
    }
    /** Load the complete monthly aggregate history for the All time dashboard view. */
    async getAllMonthlyStats() {
        const result = {};
        if (!this.auth.canViewReports())
            return result;
        try {
            const statsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/monthly_stats`);
            const snapshot = await getDocs(statsRef);
            snapshot.forEach(monthDoc => {
                result[monthDoc.id] = monthDoc.data();
            });
        }
        catch (e) {
            console.error('Error fetching all monthly stats:', e);
        }
        return result;
    }
    /**
     * Script Backfill có thể gọi nhiều lần, phân trang theo thời gian để không làm treo UI.
     * Quét tất cả Requests từ startDate đến endDate và ghi đè vào bảng monthly_stats.
     */
    async runBackfill(startDateStr, endDateStr, onProgress) {
        const start = new Date(startDateStr);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDateStr);
        end.setHours(23, 59, 59, 999);
        try {
            // Đã loại bỏ code xóa toàn bộ bảng monthly_stats ở đây để tránh làm mất dữ liệu lịch sử
            // khi người dùng chỉ chạy backfill cho một khoảng thời gian ngắn.
            onProgress('Đang tải dữ liệu... (0)');
            const reqCol = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/requests`);
            // Tính toán dữ liệu trên bộ nhớ trước khi ghi
            const statsMap = {};
            let processed = 0;
            let lastDoc = null;
            let hasMore = true;
            while (hasMore) {
                let currentQuery;
                if (lastDoc) {
                    currentQuery = query(reqCol, orderBy('__name__'), startAfter(lastDoc), limit(500));
                }
                else {
                    currentQuery = query(reqCol, orderBy('__name__'), limit(500));
                }
                const snap = await getDocs(currentQuery);
                if (snap.empty) {
                    hasMore = false;
                    break;
                }
                snap.docs.forEach(docSnap => {
                    const req = docSnap.data();
                    // Client-side status filter to avoid requiring composite Firestore indexes
                    if (!['approved', 'completed', 'draft'].includes(req['status']))
                        return;
                    let date = timestampToDate(req['approvedAt'] ?? req['timestamp']);
                    if (req['analysisDate']) {
                        const parts = req['analysisDate'].split('-');
                        if (parts.length === 3) {
                            date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                        }
                    }
                    // Bỏ qua nếu ko có ngày hoặc không nằm trong khoảng thời gian
                    if (!date || date < start || date > end || req['isVirtualMaster'])
                        return;
                    const monthKey = this.getMonthKey(date);
                    const dayKey = this.getDayKey(date);
                    if (!statsMap[monthKey])
                        statsMap[monthKey] = {};
                    let s = 1;
                    let q = 0;
                    if (req['inputs']?.['n_sample'])
                        s = Number(req['inputs']['n_sample']);
                    if (req['inputs']?.['n_qc'])
                        q = Number(req['inputs']['n_qc']);
                    else if (req['sampleList']?.length > 0)
                        s = req['sampleList'].length;
                    if (!statsMap[monthKey][dayKey]) {
                        statsMap[monthKey][dayKey] = { totalSamples: 0, totalBatches: 0, totalQcs: 0, sops: {} };
                    }
                    const dayStats = statsMap[monthKey][dayKey];
                    dayStats.totalSamples += s;
                    dayStats.totalBatches += 1;
                    dayStats.totalQcs = (dayStats.totalQcs || 0) + q;
                    const sopKey = req['sopName'] || req['sopId'] || 'Unknown';
                    if (!dayStats.sops[sopKey]) {
                        dayStats.sops[sopKey] = { samples: 0, batches: 0, qcs: 0 };
                    }
                    dayStats.sops[sopKey].samples += s;
                    dayStats.sops[sopKey].batches += 1;
                    dayStats.sops[sopKey].qcs = (dayStats.sops[sopKey].qcs || 0) + q;
                });
                processed += snap.size;
                lastDoc = snap.docs[snap.docs.length - 1];
                if (onProgress) {
                    onProgress('Đang quét dữ liệu... (' + processed + ')');
                }
            }
            // Ghi dữ liệu đã tổng hợp vào Firestore bằng Batch
            const batch = writeBatch(this.fb.db);
            for (const [monthKey, monthData] of Object.entries(statsMap)) {
                const docRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/monthly_stats`, monthKey);
                batch.set(docRef, monthData, { merge: true });
            }
            await batch.commit();
            if (onProgress) {
                onProgress('Hoàn tất ghi dữ liệu! (' + processed + ')');
            }
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    static { this.ɵfac = function StatsService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StatsService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: StatsService, factory: StatsService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StatsService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=stats.service.js.map