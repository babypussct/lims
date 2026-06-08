import { Injectable, inject } from '@angular/core';
import { FirebaseService as CoreFirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { doc, getDoc, updateDoc, collection, query, orderBy, getDocs, setDoc, deleteDoc, deleteField, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore';
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

  private async logActivity(
    action: string,
    details: string,
    requestId: string,
    sopId: string,
    sopName: string
  ): Promise<void> {
    try {
      const logRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
      await setDoc(logRef, {
        id: logRef.id,
        action,
        details,
        timestamp: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        user: this.auth.currentUser()?.displayName || 'Hệ thống',
        targetId: requestId,
        requestId,
        sopId,
        printable: false,
        printData: {
          sop: {
            id: sopId,
            name: sopName
          }
        }
      });
    } catch (e) {
      console.error('Lỗi khi ghi nhật ký hoạt động kết quả:', e);
    }
  }

  private async autoHealVirtualMaster(masterId: string, masterData: any): Promise<void> {
    if (!masterData.childRequestIds || masterData.childRequestIds.length === 0) return;
    
    console.log(`[AutoHeal] Bắt đầu vá dữ liệu targetIds cho mẻ gộp ảo: ${masterId}`);
    try {
      const allTargetIds = new Set<string>();
      const combinedSampleTargetMap: Record<string, string[]> = {};
      
      const childPromises = masterData.childRequestIds.map((id: string) => getDoc(this.getDocRef(id)));
      const childSnaps = await Promise.all(childPromises);
      
      childSnaps.forEach(snap => {
        if (snap.exists()) {
          const r = snap.data() as any;
          if (r['targetIds']) {
            r['targetIds'].forEach((t: string) => allTargetIds.add(t));
          }
          const rMap = r['sampleTargetMap'] || r['inputs']?.['sampleTargetMap'];
          if (rMap) {
            Object.keys(rMap).forEach(sampleId => {
              if (!combinedSampleTargetMap[sampleId]) {
                combinedSampleTargetMap[sampleId] = [];
              }
              const existingTargets = new Set(combinedSampleTargetMap[sampleId]);
              rMap[sampleId].forEach((t: string) => existingTargets.add(t));
              combinedSampleTargetMap[sampleId] = Array.from(existingTargets);
            });
          }
        }
      });
      
      await updateDoc(this.getDocRef(masterId), {
        targetIds: Array.from(allTargetIds),
        sampleTargetMap: combinedSampleTargetMap
      });
      console.log(`[AutoHeal] Vá dữ liệu thành công cho ${masterId}`);
    } catch (e) {
      console.error(`[AutoHeal] Lỗi vá dữ liệu ${masterId}:`, e);
    }
  }

  /**
   * Đăng ký lắng nghe thay đổi thời gian thực của mẻ chạy (Request document)
   */
  subscribeToDraft(requestId: string, callback: (draft: AnalysisResultDraft | null, run: any | null) => void) {
    const metaRef = this.getDocRef(requestId);
    const detailRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', requestId);
    
    let lastMeta: any = null;
    let lastDetail: any = null;
    let metaLoaded = false;
    let detailLoaded = false;
    
    const emitMerged = () => {
      if (!metaLoaded || !detailLoaded) {
        return;
      }
      if (!lastMeta) {
        callback(null, null);
        return;
      }
      
      const needsHealing = !lastMeta.targetIds || 
                           lastMeta.targetIds.length === 0 || 
                           !lastMeta.sampleTargetMap || 
                           Object.keys(lastMeta.sampleTargetMap).length === 0 ||
                           (lastMeta.sampleList && Object.keys(lastMeta.sampleTargetMap).length < lastMeta.sampleList.length);
      
      if (lastMeta.isVirtualMaster && needsHealing && lastMeta.childRequestIds && !lastMeta._isHealing) {
        lastMeta._isHealing = true; // prevent infinite loop before db updates
        this.autoHealVirtualMaster(requestId, lastMeta).then(() => {
          // Khi updateDoc xong, onSnapshot sẽ tự động kích hoạt lại emitMerged với dữ liệu mới
        }).catch(err => console.error('Failed to auto-heal master:', err));
      }
      
      // Hỗ trợ tương thích ngược cho tài liệu cũ chưa thực hiện di chuyển
      if (lastMeta['analysisResult']) {
        callback(lastMeta['analysisResult'], { id: requestId, ...lastMeta });
        return;
      }
      
      const hasDetail = !!lastDetail;
      const hasSummary = !!lastMeta['analysisResultSummary'];
      if (!hasDetail && !hasSummary) {
        callback(null, { id: requestId, ...lastMeta });
        return;
      }
      
      const mergedDraft: AnalysisResultDraft = {
        id: requestId,
        requestId: requestId,
        sopId: lastMeta['sopId'],
        sopName: lastMeta['sopName'],
        status: lastMeta['status'] || 'draft',
        page1Data: lastDetail?.['page1Data'] || {},
        resultData: lastDetail?.['resultData'] || {},
        publishedBackup: lastDetail?.['publishedBackup'],
        updatedAt: lastDetail?.['updatedAt'] || new Date().toISOString(),
        updatedBy: lastDetail?.['updatedBy'] || 'System',
        version: lastMeta['analysisResultSummary']?.['version'] || 0,
        pdfUrl: lastMeta['analysisResultSummary']?.['pdfUrl'] || '',
        pdfViewUrl: lastMeta['analysisResultSummary']?.['pdfViewUrl'] || '',
        docsUrl: lastMeta['analysisResultSummary']?.['docsUrl'] || '',
        reports: lastMeta['analysisResultSummary']?.['reports']
      };
      
      callback(mergedDraft, { id: requestId, ...lastMeta });
    };
    
    const unsubMeta = onSnapshot(metaRef, (docSnap) => {
      metaLoaded = true;
      if (docSnap.exists()) {
        lastMeta = docSnap.data();
      } else {
        lastMeta = null;
      }
      emitMerged();
    }, (error) => {
      console.error('Error listening to metadata changes:', error);
    });
    
    const unsubDetail = onSnapshot(detailRef, (docSnap) => {
      detailLoaded = true;
      if (docSnap.exists()) {
        lastDetail = docSnap.data();
      } else {
        lastDetail = null;
      }
      emitMerged();
    }, (error) => {
      console.error('Error listening to details changes:', error);
    });
    
    return () => {
      unsubMeta();
      unsubDetail();
    };
  }

  /**
   * Tải bản ghi nháp bằng cách gộp song song tài liệu metadata và dữ liệu lưới nặng
   */
  async getDraft(requestId: string): Promise<AnalysisResultDraft | null> {
    try {
      const metaRef = this.getDocRef(requestId);
      const detailRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', requestId);
      
      const [metaSnap, detailSnap] = await Promise.all([
        getDoc(metaRef),
        getDoc(detailRef)
      ]);
      
      if (!metaSnap.exists()) return null;
      const metaData = metaSnap.data();
      
      // Hỗ trợ tương thích ngược cho dữ liệu cũ chưa tách biệt
      if (metaData['analysisResult']) {
        return metaData['analysisResult'];
      }
      
      const detailData = detailSnap.exists() ? detailSnap.data() : null;
      
      return {
        id: requestId,
        requestId: requestId,
        sopId: metaData['sopId'],
        sopName: metaData['sopName'],
        status: metaData['status'] || 'draft',
        page1Data: detailData?.['page1Data'] || {},
        resultData: detailData?.['resultData'] || {},
        publishedBackup: detailData?.['publishedBackup'],
        updatedAt: detailData?.['updatedAt'] || new Date().toISOString(),
        updatedBy: detailData?.['updatedBy'] || 'Unknown',
        version: metaData['analysisResultSummary']?.['version'] || 0,
        pdfUrl: metaData['analysisResultSummary']?.['pdfUrl'] || '',
        pdfViewUrl: metaData['analysisResultSummary']?.['pdfViewUrl'] || '',
        docsUrl: metaData['analysisResultSummary']?.['docsUrl'] || '',
        reports: metaData['analysisResultSummary']?.['reports']
      } as any;
    } catch (e: any) {
      console.error('Error fetching split draft:', e);
      this.toast.show('Không thể tải dữ liệu nháp: ' + e.message, 'error');
      return null;
    }
  }

  /**
   * Lưu nháp kết quả phân tích: Tách dữ liệu lưới và metadata bằng cách thực hiện nguyên tử qua writeBatch
   */
  async saveDraft(requestId: string, draft: Partial<AnalysisResultDraft>, isManualSave = false): Promise<boolean> {
    try {
      const metaRef = this.getDocRef(requestId);
      const detailRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', requestId);
      
      const metaSnap = await getDoc(metaRef);
      if (!metaSnap.exists()) {
        throw new Error('Mẻ chạy không tồn tại trên hệ thống!');
      }
      
      const metaData = metaSnap.data();
      const userName = this.auth.currentUser()?.displayName || 'Unknown';
      const timestampStr = new Date().toISOString();
      
      // Nạp dữ liệu lưới chi tiết hiện tại để merge an toàn
      const detailSnap = await getDoc(detailRef);
      const currentDetail = detailSnap.exists() ? detailSnap.data() : {};
      
      // Hỗ trợ di trú tự động: Đọc phân tách dữ liệu cũ nếu có
      const legacyResult = metaData['analysisResult'] || {};
      
      const mergedPage1Data = JSON.parse(JSON.stringify({
        ...(legacyResult['page1Data'] || {}),
        ...(currentDetail['page1Data'] || {}),
        ...(draft.page1Data || {})
      }));
      
      const mergedResultData = JSON.parse(JSON.stringify({
        ...(legacyResult['resultData'] || {}),
        ...(currentDetail['resultData'] || {}),
        ...(draft.resultData || {})
      }));
      
      const mergedPublishedBackup = draft.publishedBackup || currentDetail['publishedBackup'] || legacyResult['publishedBackup'] || null;
      
      const batch = writeBatch(this.fb.db);
      
      // 1. Cập nhật tài liệu metadata ( requests )
      const summaryPayload: any = {
        version: draft.version !== undefined ? draft.version : (metaData['analysisResultSummary']?.['version'] || legacyResult['version'] || 0),
        updatedAt: timestampStr,
        updatedBy: userName
      };
      
      if (draft.pdfUrl !== undefined) summaryPayload.pdfUrl = draft.pdfUrl;
      else if (metaData['analysisResultSummary']?.['pdfUrl'] !== undefined) summaryPayload.pdfUrl = metaData['analysisResultSummary']['pdfUrl'];
      else if (legacyResult['pdfUrl'] !== undefined) summaryPayload.pdfUrl = legacyResult['pdfUrl'];
      
      if (draft.pdfViewUrl !== undefined) summaryPayload.pdfViewUrl = draft.pdfViewUrl;
      else if (metaData['analysisResultSummary']?.['pdfViewUrl'] !== undefined) summaryPayload.pdfViewUrl = metaData['analysisResultSummary']['pdfViewUrl'];
      else if (legacyResult['pdfViewUrl'] !== undefined) summaryPayload.pdfViewUrl = legacyResult['pdfViewUrl'];
      
      if (draft.docsUrl !== undefined) summaryPayload.docsUrl = draft.docsUrl;
      else if (metaData['analysisResultSummary']?.['docsUrl'] !== undefined) summaryPayload.docsUrl = metaData['analysisResultSummary']['docsUrl'];
      else if (legacyResult['docsUrl'] !== undefined) summaryPayload.docsUrl = legacyResult['docsUrl'];
      
      if (draft.reports !== undefined) summaryPayload.reports = draft.reports;
      else if (metaData['analysisResultSummary']?.['reports'] !== undefined) summaryPayload.reports = metaData['analysisResultSummary']['reports'];
      else if (legacyResult['reports'] !== undefined) summaryPayload.reports = legacyResult['reports'];
      
      batch.update(metaRef, {
        status: draft.status || metaData['status'] || 'draft',
        lastUpdated: serverTimestamp(),
        analysisResultSummary: summaryPayload,
        // Dọn dẹp trường dữ liệu nặng nguyên khối cũ để giảm tải băng thông
        analysisResult: deleteField()
      });
      
      // 2. Lưu trữ dữ liệu lưới kết quả chi tiết ( results_details )
      const detailPayload: any = {
        requestId,
        sopId: metaData['sopId'],
        page1Data: mergedPage1Data,
        resultData: mergedResultData,
        updatedAt: timestampStr,
        updatedBy: userName
      };
      if (mergedPublishedBackup) {
        detailPayload.publishedBackup = mergedPublishedBackup;
      }
      
      batch.set(detailRef, detailPayload, { merge: true });
      
      // 3. Tự động đồng bộ Dữ liệu từ Master -> Child (nếu mẻ chạy này là Master Ảo)
      if (metaData['isVirtualMaster'] && Array.isArray(metaData['childRequestIds']) && metaData['childRequestIds'].length > 0) {
        const childIds: string[] = metaData['childRequestIds'];
        for (const childId of childIds) {
          const childMetaSnap = await getDoc(this.getDocRef(childId));
          if (childMetaSnap.exists()) {
            const childMeta = childMetaSnap.data();
            const childSamples: string[] = childMeta['sampleList'] || [];
            
            const childDetailRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', childId);
            const childDetailSnap = await getDoc(childDetailRef);
            let childResultData = childDetailSnap.exists() ? (childDetailSnap.data()['resultData'] || {}) : {};
            
            let childUpdated = false;
            childSamples.forEach(sampleCode => {
              if (mergedResultData[sampleCode]) {
                childResultData[sampleCode] = { ...mergedResultData[sampleCode] };
                childUpdated = true;
              } else {
                // Support pooled samples in master batch (e.g., "M1; M2")
                const pooledKey = Object.keys(mergedResultData).find(k => 
                  k.split(';').map(s => s.trim()).includes(sampleCode)
                );
                if (pooledKey) {
                  childResultData[sampleCode] = { ...mergedResultData[pooledKey] };
                  childUpdated = true;
                }
              }
            });
            
            if (childUpdated) {
              batch.set(childDetailRef, {
                resultData: childResultData,
                updatedAt: timestampStr,
                updatedBy: userName + ' (via Master Sync)'
              }, { merge: true });
            }
            
            // Đồng bộ trạng thái, báo cáo (analysisResultSummary) và liên kết cha-con xuống mẻ con
            const childReqRef = this.getDocRef(childId);
            batch.update(childReqRef, {
              status: draft.status || metaData['status'] || 'draft',
              parentMasterId: requestId, // Tự động phục hồi liên kết cho các mẻ cũ
              lastUpdated: serverTimestamp(),
              analysisResultSummary: summaryPayload
            });
          }
        }
      }
      
      await batch.commit();

      if (isManualSave) {
        const sopId = metaData['sopId'] || legacyResult['sopId'] || '';
        const sopName = metaData['sopName'] || legacyResult['sopName'] || '';
        await this.logActivity(
          'SAVE_RESULT_DRAFT',
          `Lưu nháp kết quả phân tích mẻ chạy: ${sopName} (ID: ${requestId})`,
          requestId,
          sopId,
          sopName
        );
      }

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

        await this.logActivity(
          'RESTORE_RESULT_BACKUP',
          `Khôi phục kết quả từ bản backup gần nhất: ${draft.sopName} (ID: ${requestId})`,
          requestId,
          draft.sopId || '',
          draft.sopName || ''
        );

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
      
      // Lấy thêm lịch sử báo cáo từ Master Ảo (nếu có)
      const reqRef = this.getDocRef(requestId);
      const reqSnap = await getDoc(reqRef);
      if (reqSnap.exists()) {
        const reqData = reqSnap.data();
        if (reqData['parentMasterId']) {
          const parentHistoryColRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', reqData['parentMasterId'], 'history');
          const parentQ = query(parentHistoryColRef, orderBy('version', 'desc'));
          const parentQuerySnap = await getDocs(parentQ);
          parentQuerySnap.forEach(docSnap => {
            const data = docSnap.data();
            data['isFromMaster'] = true;
            data['masterId'] = reqData['parentMasterId'];
            historyList.push(data);
          });
        }
      }
      
      // Sắp xếp lại danh sách theo thời gian mới nhất (vì có thể có cả bản của con và của cha)
      historyList.sort((a, b) => {
        const dateA = new Date(a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
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
  async restoreFromVersion(requestId: string, versionNumber: number, prefix?: string): Promise<AnalysisResultDraft | null> {
    try {
      const draft = await this.getDraft(requestId);
      if (!draft) return null;

      let page1DataBackup = null;
      let resultDataBackup = null;

      if (draft.version === versionNumber && !prefix) {
        page1DataBackup = draft.publishedBackup?.page1Data || draft.page1Data;
        resultDataBackup = draft.publishedBackup?.resultData || draft.resultData;
      } else {
        const docId = prefix ? `v${versionNumber}_${prefix}` : `v${versionNumber}`;
        const historyDocRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', docId);
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
        const displayName = prefix ? (prefix === '_NO_PREFIX_' ? ' (Không tiền tố)' : ` (${prefix})`) : '';
        this.toast.show(`Đã khôi phục dữ liệu từ bản v${versionNumber}${displayName}!`, 'success');

        await this.logActivity(
          'RESTORE_RESULT_VERSION',
          `Rollback kết quả về bản v${versionNumber}${displayName}: ${draft.sopName} (ID: ${requestId})`,
          requestId,
          draft.sopId || '',
          draft.sopName || ''
        );

        return {
          ...draft,
          ...restoredData,
          updatedAt: new Date().toISOString()
        } as any;
      }
      
      const displayName = prefix ? (prefix === '_NO_PREFIX_' ? ' (Không tiền tố)' : ` (${prefix})`) : '';
      this.toast.show(`Không tìm thấy dữ liệu sao lưu cho bản v${versionNumber}${displayName}!`, 'info');
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
      const ref = this.getDocRef(requestId);
      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) {
        throw new Error('Mẻ chạy không tồn tại!');
      }

      const currentDraft = await this.getDraft(requestId);
      if (!currentDraft) {
        throw new Error('Không thể nạp dữ liệu nháp của mẻ chạy!');
      }
      
      let nextVersion = 1;
      const reports = currentDraft.reports || {};
      const currentVersion = currentDraft.version || 0;

      // Xác định xem đây là báo cáo theo nhóm tiền tố hay báo cáo chung (Tất cả mẫu)
      const isPrefixReport = prefix !== undefined && prefix !== null && prefix !== 'ALL';

      if (isPrefixReport) {
        const prefixKey = prefix! === '' ? '_NO_PREFIX_' : prefix!;
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
        const prefixKey = prefix! === '' ? '_NO_PREFIX_' : prefix!;
        const prefixReport = reports[prefixKey];
        if (prefixReport && prefixReport.pdfUrl) {
          const historyDocRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${prefixReport.version}_${prefixKey}`);
          await setDoc(historyDocRef, {
            version: prefixReport.version || 1,
            prefix: prefixKey,
            pdfUrl: prefixReport.pdfUrl,
            pdfViewUrl: prefixReport.pdfViewUrl || '',
            docsUrl: prefixReport.docsUrl || '',
            pdfFileName: prefixReport.pdfFileName || `KQ_Nhóm_${prefix === '' ? 'Không_tiền_tố' : prefix}_Bản_v${prefixReport.version}`,
            publishedAt: prefixReport.pdfCreatedAt || currentDraft.updatedAt || new Date().toISOString(),
            publishedBy: currentDraft.updatedBy || 'Unknown',
            page1DataBackup: prefixReport.publishedBackup?.page1Data || {},
            resultDataBackup: prefixReport.publishedBackup?.resultData || {},
            status: 'published'
          });
        }
      } else if (currentDraft.pdfUrl) {
        const historyDocRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${currentVersion}`);
        await setDoc(historyDocRef, {
          version: currentVersion || 1,
          pdfUrl: currentDraft.pdfUrl,
          pdfViewUrl: currentDraft.pdfViewUrl || '',
          docsUrl: currentDraft.docsUrl || '',
          pdfFileName: currentDraft.pdfFileName || `KQ_Bản_v${currentVersion}`,
          publishedAt: currentDraft.pdfCreatedAt || currentDraft.updatedAt || new Date().toISOString(),
          publishedBy: currentDraft.updatedBy || 'Unknown',
          page1DataBackup: currentDraft.publishedBackup?.page1Data || currentDraft.page1Data || {},
          resultDataBackup: currentDraft.publishedBackup?.resultData || currentDraft.resultData || {},
          status: 'published'
        });
      }

      // 4. Lưu trạng thái completed + phiên bản mới nhất và dữ liệu backup chi tiết
      const backup = {
        page1Data: draftData.page1Data || currentDraft.page1Data,
        resultData: draftData.resultData || currentDraft.resultData,
        publishedAt: new Date().toISOString(),
        publishedBy: this.auth.currentUser()?.displayName || 'Unknown'
      };

      let updatePayload: Partial<AnalysisResultDraft>;

      if (isPrefixReport) {
        const prefixKey = prefix! === '' ? '_NO_PREFIX_' : prefix!;
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
        } as AnalysisResultDraft['reports'];
        updatePayload = {
          ...draftData,
          status: 'completed' as const,
          reports: updatedReports
        };
      } else {
        updatePayload = {
          ...draftData,
          status: 'completed' as const,
          version: nextVersion,
          publishedBackup: backup,
          pdfUrl: response.pdfUrl || undefined,
          pdfViewUrl: response.pdfViewUrl || undefined,
          docsUrl: response.docsUrl || undefined,
          pdfFileName: response.fileName || undefined,
          pdfCreatedAt: new Date().toISOString()
        };
      }

      const saved = await this.saveDraft(requestId, updatePayload);
      if (!saved) {
        throw new Error('Không thể cập nhật thông tin xuất bản mới vào cơ sở dữ liệu!');
      }

      const displayName = prefix !== undefined && prefix !== null && prefix !== 'ALL'
        ? (prefix === '' ? ' (Không tiền tố)' : ` (nhóm ${prefix})`)
        : ' (Tất cả mẫu)';

      await this.logActivity(
        'PUBLISH_RESULT_REPORT',
        `Xuất bản báo cáo kết quả bản v${nextVersion}${displayName}: ${currentDraft.sopName} (ID: ${requestId})`,
        requestId,
        currentDraft.sopId || '',
        currentDraft.sopName || ''
      );

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
      const currentDraft = await this.getDraft(requestId);
      if (!currentDraft) {
        throw new Error('Mẻ chạy không tồn tại!');
      }

      if (currentDraft.status !== 'completed') {
        this.toast.show('Mẻ chạy chưa xuất bản kết quả!', 'info');
        return null;
      }

      const currentVersion = currentDraft.version || 1;

      // 1. Gửi yêu cầu sang GAS dọn dẹp các tệp bản completed hiện tại (thu thập cả reports map)
      const filesToArchive: { pdfUrl?: string; docsUrl?: string }[] = [];
      if (currentDraft.pdfUrl || currentDraft.docsUrl) {
        filesToArchive.push({ pdfUrl: currentDraft.pdfUrl, docsUrl: currentDraft.docsUrl });
      }
      if (currentDraft.reports) {
        Object.keys(currentDraft.reports).forEach(prefix => {
          const rep = currentDraft.reports![prefix];
          if (rep.pdfUrl || rep.docsUrl) {
            filesToArchive.push({ pdfUrl: rep.pdfUrl || undefined, docsUrl: rep.docsUrl || undefined });
          }
        });
      }

      if (filesToArchive.length > 0) {
        this.toast.show('Đang di chuyển tệp cũ vào thư mục lưu trữ (Archived)...', 'info');
        await this.reportService.archiveReports(filesToArchive);
      }

      // 2. Sao lưu bản vừa hủy vào Sub-collection history
      const currentReports = currentDraft.reports || {};
      if (Object.keys(currentReports).length > 0) {
        for (const prefix of Object.keys(currentReports)) {
          const rep = currentReports[prefix];
          const historyRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${rep.version}_${prefix}`);
          await setDoc(historyRef, {
            version: rep.version,
            prefix: prefix,
            pdfUrl: rep.pdfUrl || '',
            pdfViewUrl: rep.pdfViewUrl || '',
            docsUrl: rep.docsUrl || '',
            pdfFileName: rep.pdfFileName || `[HUY]_KQ_Nhóm_${prefix}_Bản_v${rep.version}`,
            publishedAt: rep.pdfCreatedAt || currentDraft.updatedAt || new Date().toISOString(),
            publishedBy: currentDraft.updatedBy || 'Unknown',
            page1DataBackup: rep.publishedBackup?.page1Data || {},
            resultDataBackup: rep.publishedBackup?.resultData || {},
            status: 'archived'
          });
        }
      } else {
        const historyRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${currentVersion}`);
        await setDoc(historyRef, {
          version: currentVersion,
          pdfUrl: currentDraft.pdfUrl || '',
          pdfViewUrl: currentDraft.pdfViewUrl || '',
          docsUrl: currentDraft.docsUrl || '',
          pdfFileName: currentDraft.pdfFileName || `[HUY]_KQ_Bản_v${currentVersion}`,
          publishedAt: currentDraft.pdfCreatedAt || currentDraft.updatedAt || new Date().toISOString(),
          publishedBy: currentDraft.updatedBy || 'Unknown',
          page1DataBackup: currentDraft.publishedBackup?.page1Data || currentDraft.page1Data || {},
          resultDataBackup: currentDraft.publishedBackup?.resultData || currentDraft.resultData || {},
          status: 'archived'
        });
      }

      // 3. Đưa tài liệu chính về trạng thái nháp (draft), xóa các trường URL in hiện tại
      const updatedResult: Partial<AnalysisResultDraft> = {
        status: 'draft',
        pdfUrl: null as any,
        pdfViewUrl: null as any,
        docsUrl: null as any,
        pdfFileName: null as any,
        pdfCreatedAt: null as any,
        reports: null as any
      };

      const saved = await this.saveDraft(requestId, updatedResult);
      if (!saved) {
        throw new Error('Không thể cập nhật trạng thái nháp của mẻ chạy!');
      }

      await this.logActivity(
        'REVERT_RESULT_DRAFT',
        `Hủy xuất bản báo cáo kết quả mẻ chạy: ${currentDraft.sopName} (ID: ${requestId})`,
        requestId,
        currentDraft.sopId || '',
        currentDraft.sopName || ''
      );

      this.toast.show('Đã mở khóa kết quả mẻ chạy để chỉnh sửa!', 'success');
      return await this.getDraft(requestId);
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
      const currentDraft = await this.getDraft(requestId);
      if (!currentDraft) {
        throw new Error('Không thể nạp dữ liệu nháp của mẻ chạy!');
      }

      // 1. Thu thập tất cả file in của bản hiện tại + các bản in trong lịch sử
      const filesToArchive: { pdfUrl?: string; docsUrl?: string }[] = [];
      if (currentDraft.pdfUrl || currentDraft.docsUrl) {
        filesToArchive.push({ pdfUrl: currentDraft.pdfUrl, docsUrl: currentDraft.docsUrl });
      }
      if (currentDraft.reports) {
        Object.keys(currentDraft.reports).forEach(prefix => {
          const rep = currentDraft.reports![prefix];
          if (rep.pdfUrl || rep.docsUrl) {
            filesToArchive.push({ pdfUrl: rep.pdfUrl || undefined, docsUrl: rep.docsUrl || undefined });
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
      if (currentDraft.status === 'completed') {
        const currentReports2 = currentDraft.reports || {};
        if (Object.keys(currentReports2).length > 0) {
          for (const prefix of Object.keys(currentReports2)) {
            const rep = currentReports2[prefix];
            const historyRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${rep.version}_${prefix}`);
            await setDoc(historyRef, {
              version: rep.version,
              prefix: prefix,
              pdfUrl: rep.pdfUrl || '',
              pdfViewUrl: rep.pdfViewUrl || '',
              docsUrl: rep.docsUrl || '',
              pdfFileName: rep.pdfFileName || `[HUY]_KQ_Nhóm_${prefix}_Bản_v${rep.version}`,
              publishedAt: rep.pdfCreatedAt || currentDraft.updatedAt || new Date().toISOString(),
              publishedBy: currentDraft.updatedBy || 'Unknown',
              page1DataBackup: rep.publishedBackup?.page1Data || {},
              resultDataBackup: rep.publishedBackup?.resultData || {},
              status: 'archived'
            });
          }
        } else {
          const currentVersion = currentDraft.version || 1;
          const historyRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', requestId, 'history', `v${currentVersion}`);
          await setDoc(historyRef, {
            version: currentVersion,
            pdfUrl: currentDraft.pdfUrl || '',
            pdfViewUrl: currentDraft.pdfViewUrl || '',
            docsUrl: currentDraft.docsUrl || '',
            pdfFileName: currentDraft.pdfFileName || `[HUY]_KQ_Bản_v${currentVersion}`,
            publishedAt: currentDraft.pdfCreatedAt || currentDraft.updatedAt || new Date().toISOString(),
            publishedBy: currentDraft.updatedBy || 'Unknown',
            page1DataBackup: currentDraft.publishedBackup?.page1Data || currentDraft.page1Data || {},
            resultDataBackup: currentDraft.publishedBackup?.resultData || currentDraft.resultData || {},
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
      
      if (currentDraft.page1Data) {
        Object.keys(currentDraft.page1Data).forEach(key => {
          if (key !== 'ngayNguoiPhanTich' && key !== 'ngayNguoiThamTra' && key !== 'checkTatCaND' && key !== 'checkCoMauPhatHien') {
            if (key === 'qcR2' || key === 'qcThoiGianLuu' || key === 'qcThemChuan' || key === 'qcThuHoi' || key === 'qcDanhGiaChung') {
              resetPage1Data[key] = true;
            } else if (key === 'qcKiemTraNoiBo') {
              resetPage1Data[key] = currentDraft.page1Data['hasCheckSample'] ? true : null;
            } else if (key === 'qcNhanDang') {
              resetPage1Data[key] = null;
            } else {
              resetPage1Data[key] = false;
            }
          }
        });
      }

      const resetResultData: Record<string, any> = {};
      const sampleList = reqData['sampleList'] || [];
      
      let activeCols: string[] = [];
      if (currentDraft.resultData) {
        const firstSample = Object.keys(currentDraft.resultData)[0];
        if (firstSample && currentDraft.resultData[firstSample]) {
          activeCols = Object.keys(currentDraft.resultData[firstSample]);
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
        sopId: currentDraft.sopId || reqData['sopId'] || '',
        sopName: currentDraft.sopName || reqData['sopName'] || '',
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

      const detailRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'results_details', requestId);
      
      const batch = writeBatch(this.fb.db);
      batch.update(ref, {
        status: 'draft',
        lastUpdated: serverTimestamp(),
        analysisResultSummary: {
          version: 0,
          updatedAt: resetResult.updatedAt,
          updatedBy: resetResult.updatedBy
        },
        analysisResult: deleteField()
      });
      
      batch.set(detailRef, {
        requestId,
        sopId: resetResult.sopId,
        page1Data: resetPage1Data,
        resultData: resetResultData,
        updatedAt: resetResult.updatedAt,
        updatedBy: resetResult.updatedBy
      });
      
      await batch.commit();

      await this.logActivity(
        'RESET_RESULT_DATA',
        `Reset toàn bộ dữ liệu kết quả mẻ chạy: ${currentDraft.sopName || reqData['sopName']} (ID: ${requestId})`,
        requestId,
        currentDraft.sopId || reqData['sopId'] || '',
        currentDraft.sopName || reqData['sopName'] || ''
      );

      this.toast.show('Đã reset và xóa toàn bộ số liệu của mẻ chạy thành công!', 'success');
      return resetResult;
    } catch (e: any) {
      console.error('Error resetting results:', e);
      this.toast.show('Lỗi reset kết quả: ' + e.message, 'error');
      return null;
    }
  }
}


