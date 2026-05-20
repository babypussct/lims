import { Injectable, inject } from '@angular/core';
import { FirebaseService as CoreFirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { doc, getDoc, updateDoc, collection, query, orderBy, getDocs, setDoc, deleteDoc, deleteField } from 'firebase/firestore';
import { AnalysisResultDraft } from '../../../core/models/analysis-result.model';
import { ReportService, GenerateReportPayload } from '../../../core/services/report.service';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private fb = inject(CoreFirebaseService);
  private auth = inject(AuthService);
  private reportService = inject(ReportService);
  private toast = inject(ToastService);

  private getDocRef(requestId: string) {
    // Tái sử dụng collection 'requests' đã có đầy đủ quyền đọc/ghi trên Production
    return doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId);
  }

  /**
   * Tải bản ghi nháp từ trường analysisResult trong Request document
   */
  async getDraft(requestId: string): Promise<AnalysisResultDraft | null> {
    try {
      const docSnap = await getDoc(this.getDocRef(requestId));
      if (docSnap.exists()) {
        const reqData = docSnap.data();
        return reqData['analysisResult'] || null;
      }
      return null;
    } catch (e: any) {
      console.error('Error fetching result draft:', e);
      this.toast.show('Không thể tải dữ liệu nháp: ' + e.message, 'error');
      return null;
    }
  }

  /**
   * Lưu nháp kết quả phân tích vào trường analysisResult trong Request document
   */
  async saveDraft(requestId: string, draft: Partial<AnalysisResultDraft>): Promise<boolean> {
    try {
      const ref = this.getDocRef(requestId);
      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) {
        throw new Error('Mẻ chạy không tồn tại trên hệ thống!');
      }

      const reqData = docSnap.data();
      const currentResult = reqData['analysisResult'] || {};

      // Merge dữ liệu cũ và mới để tránh mất thông tin
      const updatedResult = {
        ...currentResult,
        ...draft,
        updatedAt: new Date().toISOString(),
        updatedBy: this.auth.currentUser()?.displayName || 'Unknown'
      };

      await updateDoc(ref, { analysisResult: updatedResult });
      return true;
    } catch (e: any) {
      console.error('Error saving result draft:', e);
      this.toast.show('Lỗi lưu nháp: ' + e.message, 'error');
      return false;
    }
  }

  /**
   * Khôi phục kết quả từ bản xuất bản gần nhất (Backup Fallback)
   */
  async restoreFromBackup(requestId: string): Promise<AnalysisResultDraft | null> {
    try {
      const draft = await this.getDraft(requestId);
      if (draft && draft.publishedBackup) {
        // Ghi đè page1Data và resultData hiện tại bằng bản backup
        const restoredData: Partial<AnalysisResultDraft> = {
          page1Data: draft.publishedBackup.page1Data,
          resultData: draft.publishedBackup.resultData,
          status: 'draft'
        };
        await this.saveDraft(requestId, restoredData);
        this.toast.show('Đã khôi phục dữ liệu từ bản xuất bản gần nhất!', 'success');
        return {
          ...draft,
          ...restoredData,
          updatedAt: new Date().toISOString()
        } as any;
      }
      this.toast.show('Không tìm thấy bản xuất bản trước đó để khôi phục!', 'info');
      return null;
    } catch (e: any) {
      console.error('Error restoring backup:', e);
      this.toast.show('Lỗi khôi phục: ' + e.message, 'error');
      return null;
    }
  }

  /**
   * Lấy danh sách lịch sử in của mẻ chạy từ Sub-collection history
   */
  async getHistory(requestId: string): Promise<any[]> {
    try {
      const historyColRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history');
      const q = query(historyColRef, orderBy('version', 'desc'));
      const querySnap = await getDocs(q);
      const historyList: any[] = [];
      querySnap.forEach(docSnap => {
        historyList.push(docSnap.data());
      });
      return historyList;
    } catch (e) {
      console.error('Error getting history:', e);
      return [];
    }
  }

  /**
   * Khôi phục số liệu từ một phiên bản in cụ thể (Rollback)
   */
  async restoreFromVersion(requestId: string, versionNumber: number): Promise<AnalysisResultDraft | null> {
    try {
      const draft = await this.getDraft(requestId);
      if (!draft) return null;

      let page1DataBackup = null;
      let resultDataBackup = null;

      if (draft.version === versionNumber) {
        page1DataBackup = draft.publishedBackup?.page1Data || draft.page1Data;
        resultDataBackup = draft.publishedBackup?.resultData || draft.resultData;
      } else {
        const historyDocRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${versionNumber}`);
        const historySnap = await getDoc(historyDocRef);
        if (historySnap.exists()) {
          const histData = historySnap.data();
          page1DataBackup = histData['page1DataBackup'];
          resultDataBackup = histData['resultDataBackup'];
        }
      }

      if (page1DataBackup && resultDataBackup) {
        const restoredData: Partial<AnalysisResultDraft> = {
          page1Data: page1DataBackup,
          resultData: resultDataBackup,
          status: 'draft'
        };
        await this.saveDraft(requestId, restoredData);
        this.toast.show(`Đã khôi phục dữ liệu từ bản v${versionNumber}!`, 'success');
        return {
          ...draft,
          ...restoredData,
          updatedAt: new Date().toISOString()
        } as any;
      }
      
      this.toast.show(`Không tìm thấy dữ liệu sao lưu cho bản v${versionNumber}!`, 'info');
      return null;
    } catch (e: any) {
      console.error('Error restoring version:', e);
      this.toast.show('Lỗi khôi phục: ' + e.message, 'error');
      return null;
    }
  }

  /**
   * Xuất bản PDF báo cáo và lưu backup trực tiếp vào Sub-collection history
   */
  async publishReport(
    requestId: string,
    draftData: Partial<AnalysisResultDraft>,
    payload: GenerateReportPayload,
    prefix?: string
  ): Promise<{ success: boolean; pdfUrl?: string; pdfViewUrl?: string }> {
    try {
      // 1. Lấy thông tin phiên bản hiện tại từ Firestore để xác định số phiên bản tiếp theo
      const ref = this.getDocRef(requestId);
      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) {
        throw new Error('Mẻ chạy không tồn tại!');
      }

      const reqData = docSnap.data();
      const currentResult = reqData['analysisResult'] || {};
      
      let nextVersion = 1;
      const reports = currentResult.reports || {};
      const currentVersion = currentResult.version || 0;

      // Xác định xem đây là báo cáo theo nhóm tiền tố hay báo cáo chung (Tất cả mẫu)
      const isPrefixReport = prefix !== undefined && prefix !== null && prefix !== 'ALL';

      if (isPrefixReport) {
        const prefixKey = prefix!;
        const prefixReport = reports[prefixKey] || {};
        nextVersion = (prefixReport.version || 0) + 1;
      } else {
        nextVersion = currentVersion + 1;
      }

      // Gán version vào payload gửi sang Google Apps Script
      payload.version = nextVersion;

      // 2. Gọi API GAS tạo báo cáo PDF
      this.toast.show(`Đang gửi lệnh tạo báo cáo PDF bản v${nextVersion}${isPrefixReport ? ' (nhóm ' + (prefix === '' ? 'Không tiền tố' : prefix) + ')' : ''} sang Google Docs...`, 'info');
      const response = await this.reportService.generateReport(payload);
      
      if (!response.success) {
        throw new Error(response.error || 'GAS Web App returned success = false');
      }

      // 3. Đóng gói và lưu phiên bản cũ vào Sub-collection history nếu bản in cũ đã tồn tại
      if (isPrefixReport) {
        const prefixKey = prefix!;
        const prefixReport = reports[prefixKey];
        if (prefixReport && prefixReport.pdfUrl) {
          const historyDocRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${prefixReport.version}_${prefixKey}`);
          await setDoc(historyDocRef, {
            version: prefixReport.version || 1,
            prefix: prefixKey,
            pdfUrl: prefixReport.pdfUrl,
            pdfViewUrl: prefixReport.pdfViewUrl || '',
            docsUrl: prefixReport.docsUrl || '',
            pdfFileName: prefixReport.pdfFileName || `KQ_Nhóm_${prefixKey || 'Không_tiền_tố'}_Bản_v${prefixReport.version}`,
            publishedAt: prefixReport.pdfCreatedAt || currentResult.updatedAt || new Date().toISOString(),
            publishedBy: currentResult.updatedBy || 'Unknown',
            page1DataBackup: prefixReport.publishedBackup?.page1Data || {},
            resultDataBackup: prefixReport.publishedBackup?.resultData || {},
            status: 'published'
          });
        }
      } else if (currentResult.pdfUrl) {
        const historyDocRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${currentVersion}`);
        await setDoc(historyDocRef, {
          version: currentVersion || 1,
          pdfUrl: currentResult.pdfUrl,
          pdfViewUrl: currentResult.pdfViewUrl || '',
          docsUrl: currentResult.docsUrl || '',
          pdfFileName: currentResult.pdfFileName || `KQ_Bản_v${currentVersion}`,
          publishedAt: currentResult.pdfCreatedAt || currentResult.updatedAt || new Date().toISOString(),
          publishedBy: currentResult.updatedBy || 'Unknown',
          page1DataBackup: currentResult.publishedBackup?.page1Data || currentResult.page1Data || {},
          resultDataBackup: currentResult.publishedBackup?.resultData || currentResult.resultData || {},
          status: 'published'
        });
      }

      // 4. Lưu trạng thái completed + phiên bản mới nhất và dữ liệu backup vào Request document chính
      const backup = {
        page1Data: draftData.page1Data,
        resultData: draftData.resultData,
        publishedAt: new Date().toISOString(),
        publishedBy: this.auth.currentUser()?.displayName || 'Unknown'
      };

      let finalResult: any;
      if (isPrefixReport) {
        const prefixKey = prefix!;
        const updatedReports = {
          ...reports,
          [prefixKey]: {
            pdfUrl: response.pdfUrl || null,
            pdfViewUrl: response.pdfViewUrl || null,
            docsUrl: response.docsUrl || null,
            pdfFileName: response.fileName || null,
            pdfCreatedAt: new Date().toISOString(),
            version: nextVersion,
            status: 'completed',
            publishedBackup: backup
          }
        };
        finalResult = {
          ...currentResult,
          ...draftData,
          status: 'completed',
          reports: updatedReports,
          updatedAt: new Date().toISOString(),
          updatedBy: this.auth.currentUser()?.displayName || 'Unknown'
        };
      } else {
        finalResult = {
          ...currentResult,
          ...draftData,
          status: 'completed',
          version: nextVersion,
          publishedBackup: backup,
          // Lưu PDF URLs phiên bản mới nhất để hiển thị nhanh
          pdfUrl: response.pdfUrl || null,
          pdfViewUrl: response.pdfViewUrl || null,
          docsUrl: response.docsUrl || null,
          pdfFileName: response.fileName || null,
          pdfCreatedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedBy: this.auth.currentUser()?.displayName || 'Unknown'
        };
      }

      await updateDoc(ref, { analysisResult: finalResult });

      this.toast.show(`Báo cáo PDF ${isPrefixReport ? (prefix === '' ? 'Không tiền tố' : 'nhóm ' + prefix) : 'chung'} bản v${nextVersion} đã được tạo và lưu thành công!`, 'success');
      return { success: true, pdfUrl: response.pdfUrl, pdfViewUrl: response.pdfViewUrl };
    } catch (e: any) {
      console.error('Error publishing report:', e);
      this.toast.show('Lỗi xuất bản báo cáo: ' + e.message, 'error');
      return { success: false };
    }
  }

  /**
   * Hủy xuất bản kết quả (Chuyển về trạng thái nháp để sửa và lưu trữ file cũ)
   */
  async revertToDraft(requestId: string): Promise<AnalysisResultDraft | null> {
    try {
      const ref = this.getDocRef(requestId);
      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) {
        throw new Error('Mẻ chạy không tồn tại!');
      }

      const reqData = docSnap.data();
      const currentResult = reqData['analysisResult'] || {};

      if (currentResult.status !== 'completed') {
        this.toast.show('Mẻ chạy chưa xuất bản kết quả!', 'info');
        return null;
      }

      const currentVersion = currentResult.version || 1;

      // 1. Gửi yêu cầu sang GAS dọn dẹp các tệp bản completed hiện tại (thu thập cả reports map)
      const filesToArchive: { pdfUrl?: string; docsUrl?: string }[] = [];
      if (currentResult.pdfUrl || currentResult.docsUrl) {
        filesToArchive.push({ pdfUrl: currentResult.pdfUrl, docsUrl: currentResult.docsUrl });
      }
      if (currentResult.reports) {
        Object.keys(currentResult.reports).forEach(prefix => {
          const rep = currentResult.reports[prefix];
          if (rep.pdfUrl || rep.docsUrl) {
            filesToArchive.push({ pdfUrl: rep.pdfUrl, docsUrl: rep.docsUrl });
          }
        });
      }

      if (filesToArchive.length > 0) {
        this.toast.show('Đang di chuyển tệp cũ vào thư mục lưu trữ (Archived)...', 'info');
        await this.reportService.archiveReports(filesToArchive);
      }

      // 2. Sao lưu bản vừa hủy vào Sub-collection history
      if (currentResult.reports) {
        for (const prefix of Object.keys(currentResult.reports)) {
          const rep = currentResult.reports[prefix];
          const historyRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${rep.version}_${prefix}`);
          await setDoc(historyRef, {
            version: rep.version,
            prefix: prefix,
            pdfUrl: rep.pdfUrl || '',
            pdfViewUrl: rep.pdfViewUrl || '',
            docsUrl: rep.docsUrl || '',
            pdfFileName: rep.pdfFileName || `[HUY]_KQ_Nhóm_${prefix}_Bản_v${rep.version}`,
            publishedAt: rep.pdfCreatedAt || currentResult.updatedAt || new Date().toISOString(),
            publishedBy: currentResult.updatedBy || 'Unknown',
            page1DataBackup: rep.publishedBackup?.page1Data || {},
            resultDataBackup: rep.publishedBackup?.resultData || {},
            status: 'archived'
          });
        }
      } else {
        const historyRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${currentVersion}`);
        await setDoc(historyRef, {
          version: currentVersion,
          pdfUrl: currentResult.pdfUrl || '',
          pdfViewUrl: currentResult.pdfViewUrl || '',
          docsUrl: currentResult.docsUrl || '',
          pdfFileName: currentResult.pdfFileName || `[HUY]_KQ_Bản_v${currentVersion}`,
          publishedAt: currentResult.pdfCreatedAt || currentResult.updatedAt || new Date().toISOString(),
          publishedBy: currentResult.updatedBy || 'Unknown',
          page1DataBackup: currentResult.publishedBackup?.page1Data || currentResult.page1Data || {},
          resultDataBackup: currentResult.publishedBackup?.resultData || currentResult.resultData || {},
          status: 'archived'
        });
      }

      // 3. Đưa tài liệu chính về trạng thái nháp (draft), xóa các trường URL in hiện tại
      const updatedResult = {
        ...currentResult,
        status: 'draft',
        pdfUrl: null,
        pdfViewUrl: null,
        docsUrl: null,
        pdfFileName: null,
        pdfCreatedAt: null,
        reports: null, // Clear reports map on revert to draft so they start fresh
        updatedAt: new Date().toISOString(),
        updatedBy: this.auth.currentUser()?.displayName || 'Unknown'
      };

      await updateDoc(ref, { analysisResult: updatedResult });
      this.toast.show('Đã mở khóa kết quả mẻ chạy để chỉnh sửa!', 'success');
      return updatedResult;
    } catch (e: any) {
      console.error('Error reverting to draft:', e);
      this.toast.show('Lỗi hủy xuất bản: ' + e.message, 'error');
      return null;
    }
  }

  /**
   * Xóa sạch kết quả nhập liệu và dọn dẹp toàn bộ file báo cáo cũ trên Drive
   */
  async resetResults(requestId: string): Promise<AnalysisResultDraft | null> {
    try {
      const ref = this.getDocRef(requestId);
      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) {
        throw new Error('Mẻ chạy không tồn tại!');
      }

      const reqData = docSnap.data();
      const currentResult = reqData['analysisResult'] || {};

      // 1. Thu thập tất cả file in của bản hiện tại + các bản in trong lịch sử
      const filesToArchive: { pdfUrl?: string; docsUrl?: string }[] = [];
      if (currentResult.pdfUrl || currentResult.docsUrl) {
        filesToArchive.push({ pdfUrl: currentResult.pdfUrl, docsUrl: currentResult.docsUrl });
      }
      if (currentResult.reports) {
        Object.keys(currentResult.reports).forEach(prefix => {
          const rep = currentResult.reports[prefix];
          if (rep.pdfUrl || rep.docsUrl) {
            filesToArchive.push({ pdfUrl: rep.pdfUrl, docsUrl: rep.docsUrl });
          }
        });
      }

      const historyList = await this.getHistory(requestId);
      historyList.forEach(hist => {
        if (hist.pdfUrl || hist.docsUrl) {
          filesToArchive.push({ pdfUrl: hist.pdfUrl, docsUrl: hist.docsUrl });
        }
      });

      // 2. Gọi sang GAS để dọn dẹp lưu trữ toàn bộ các file này
      if (filesToArchive.length > 0) {
        this.toast.show('Đang di chuyển toàn bộ file báo cáo liên quan vào thư mục Archived...', 'info');
        await this.reportService.archiveReports(filesToArchive);
      }

      // 3. Nếu bản hiện tại là completed, hãy sao lưu nó vào sub-collection history trước khi xóa sạch
      if (currentResult.status === 'completed') {
        if (currentResult.reports) {
          for (const prefix of Object.keys(currentResult.reports)) {
            const rep = currentResult.reports[prefix];
            const historyRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${rep.version}_${prefix}`);
            await setDoc(historyRef, {
              version: rep.version,
              prefix: prefix,
              pdfUrl: rep.pdfUrl || '',
              pdfViewUrl: rep.pdfViewUrl || '',
              docsUrl: rep.docsUrl || '',
              pdfFileName: rep.pdfFileName || `[HUY]_KQ_Nhóm_${prefix}_Bản_v${rep.version}`,
              publishedAt: rep.pdfCreatedAt || currentResult.updatedAt || new Date().toISOString(),
              publishedBy: currentResult.updatedBy || 'Unknown',
              page1DataBackup: rep.publishedBackup?.page1Data || {},
              resultDataBackup: rep.publishedBackup?.resultData || {},
              status: 'archived'
            });
          }
        } else {
          const currentVersion = currentResult.version || 1;
          const historyRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${currentVersion}`);
          await setDoc(historyRef, {
            version: currentVersion,
            pdfUrl: currentResult.pdfUrl || '',
            pdfViewUrl: currentResult.pdfViewUrl || '',
            docsUrl: currentResult.docsUrl || '',
            pdfFileName: currentResult.pdfFileName || `[HUY]_KQ_Bản_v${currentVersion}`,
            publishedAt: currentResult.pdfCreatedAt || currentResult.updatedAt || new Date().toISOString(),
            publishedBy: currentResult.updatedBy || 'Unknown',
            page1DataBackup: currentResult.publishedBackup?.page1Data || currentResult.page1Data || {},
            resultDataBackup: currentResult.publishedBackup?.resultData || currentResult.resultData || {},
            status: 'archived'
          });
        }
      }

      // 4. Khởi dựng lại page1Data và resultData an toàn để tránh crash lưới nhập kết quả (Grid Spreadsheet)
      const resetPage1Data: Record<string, any> = {
        ngayNguoiPhanTich: new Date().toISOString().split('T')[0],
        ngayNguoiThamTra: new Date().toISOString().split('T')[0],
        checkTatCaND: true,
        checkCoMauPhatHien: false
      };
      
      if (currentResult.page1Data) {
        Object.keys(currentResult.page1Data).forEach(key => {
          if (key !== 'ngayNguoiPhanTich' && key !== 'ngayNguoiThamTra' && key !== 'checkTatCaND' && key !== 'checkCoMauPhatHien') {
            resetPage1Data[key] = false;
          }
        });
      }

      const resetResultData: Record<string, any> = {};
      const sampleList = reqData['sampleList'] || currentResult.sampleList || [];
      
      let activeCols: string[] = [];
      if (currentResult.resultData) {
        const firstSample = Object.keys(currentResult.resultData)[0];
        if (firstSample && currentResult.resultData[firstSample]) {
          activeCols = Object.keys(currentResult.resultData[firstSample]);
        }
      }

      sampleList.forEach((sample: string) => {
        resetResultData[sample] = {};
        activeCols.forEach(col => {
          resetResultData[sample][col] = '';
        });
      });

      const resetResult: AnalysisResultDraft = {
        id: requestId,
        requestId: requestId,
        sopId: currentResult.sopId || reqData['sopId'] || '',
        sopName: currentResult.sopName || reqData['sopName'] || '',
        status: 'draft',
        version: 0,
        page1Data: resetPage1Data,
        resultData: resetResultData,
        pdfUrl: '',
        pdfViewUrl: '',
        docsUrl: '',
        pdfFileName: '',
        pdfCreatedAt: '',
        updatedAt: new Date().toISOString(),
        updatedBy: this.auth.currentUser()?.displayName || 'Unknown'
      };

      await updateDoc(ref, { analysisResult: deleteField() });
      this.toast.show('Đã reset và xóa toàn bộ số liệu của mẻ chạy thành công!', 'success');
      return resetResult;
    } catch (e: any) {
      console.error('Error resetting results:', e);
      this.toast.show('Lỗi reset kết quả: ' + e.message, 'error');
      return null;
    }
  }
}


