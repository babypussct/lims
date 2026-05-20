import { Injectable, inject } from '@angular/core';
import { FirebaseService as CoreFirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
    return doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'analysis_results', requestId);
  }

  /**
   * Tải bản ghi nháp từ Firestore
   */
  async getDraft(requestId: string): Promise<AnalysisResultDraft | null> {
    try {
      const docSnap = await getDoc(this.getDocRef(requestId));
      if (docSnap.exists()) {
        return docSnap.data() as AnalysisResultDraft;
      }
      return null;
    } catch (e: any) {
      console.error('Error fetching result draft:', e);
      this.toast.show('Không thể tải dữ liệu nháp: ' + e.message, 'error');
      return null;
    }
  }

  /**
   * Lưu nháp kết quả phân tích vào Firestore
   */
  async saveDraft(requestId: string, draft: Partial<AnalysisResultDraft>): Promise<boolean> {
    try {
      const ref = this.getDocRef(requestId);
      const dataToSave = {
        ...draft,
        updatedAt: serverTimestamp(),
        updatedBy: this.auth.currentUser()?.displayName || 'Unknown'
      };
      await setDoc(ref, dataToSave, { merge: true });
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
          updatedAt: new Date()
        } as AnalysisResultDraft;
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
   * Xuất bản PDF báo cáo và lưu backup trong Firestore
   */
  async publishReport(
    requestId: string,
    draftData: Partial<AnalysisResultDraft>,
    payload: GenerateReportPayload
  ): Promise<boolean> {
    try {
      // 1. Gọi API GAS tạo báo cáo PDF trước
      this.toast.show('Đang gửi lệnh tạo báo cáo PDF sang Google Docs...', 'info');
      const response = await this.reportService.generateReport(payload);
      
      if (!response.success) {
        throw new Error(response.error || 'GAS Web App returned success = false');
      }

      // 2. Lưu trạng thái completed và tạo bản backup hồi phục (Fallback backup)
      const ref = this.getDocRef(requestId);
      const backup = {
        page1Data: draftData.page1Data,
        resultData: draftData.resultData,
        publishedAt: serverTimestamp(),
        publishedBy: this.auth.currentUser()?.displayName || 'Unknown'
      };

      const finalData: Partial<AnalysisResultDraft> = {
        ...draftData,
        status: 'completed',
        publishedBackup: backup,
        updatedAt: serverTimestamp(),
        updatedBy: this.auth.currentUser()?.displayName || 'Unknown'
      };

      await setDoc(ref, finalData, { merge: true });
      
      // 3. Mở tệp PDF mới tạo trong tab mới
      if (response.pdfUrl) {
        window.open(response.pdfUrl, '_blank');
        this.toast.show('Báo cáo PDF đã được tạo và hiển thị ở cửa sổ mới!', 'success');
      } else {
        this.toast.show('Tạo thành công nhưng không nhận được liên kết PDF!', 'info');
      }
      return true;
    } catch (e: any) {
      console.error('Error publishing report:', e);
      this.toast.show('Lỗi xuất bản báo cáo: ' + e.message, 'error');
      return false;
    }
  }
}
