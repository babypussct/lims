import { Injectable, inject } from '@angular/core';
import { collection, onSnapshot, orderBy, query, serverTimestamp, setDoc, doc, type Unsubscribe } from 'firebase/firestore';
import { AuthService, PERMISSIONS } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { FirestoreReadMonitor } from '../../core/services/firestore-read-monitor.service';
import type { DutyAiReview } from './duty-ai-review';
import { isDutyDateKey } from './duty-schedule.utils';

@Injectable({ providedIn: 'root' })
export class DutyAiReviewService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);
  private readonly readMonitor = inject(FirestoreReadMonitor);

  private path(staffId: string): string {
    if (!staffId || staffId.includes('/')) throw new Error('Mã nhân sự không hợp lệ.');
    return `artifacts/${this.fb.APP_ID}/duty_ai_profiles/${staffId}/reviews`;
  }

  watch(staffId: string, onReviews: (reviews: DutyAiReview[]) => void, onError: (message: string) => void): Unsubscribe {
    const path = this.path(staffId);
    let initial = true;
    return onSnapshot(query(collection(this.fb.db, path), orderBy('createdAt', 'desc')), snapshot => {
      this.readMonitor.record('onSnapshot', path,
        initial ? snapshot.size : snapshot.docChanges().filter(change => change.type !== 'removed').length,
        { phase: initial ? 'initial' : 'delta', fromCache: snapshot.metadata.fromCache });
      initial = false;
      onReviews(snapshot.docs.map(item => {
        const data = item.data();
        return {
          id: item.id,
          staffId: data['staffId'] as string,
          periodStart: data['periodStart'] as string,
          periodEnd: data['periodEnd'] as string,
          window: data['window'] as string,
          analysisText: data['analysisText'] as string,
          dataFingerprint: data['dataFingerprint'] as string,
          createdByUid: data['createdByUid'] as string,
          createdAtDate: data['createdAt']?.toDate?.() ?? null,
        };
      }));
    }, error => onError(error.message || 'Không thể tải lịch sử đánh giá AI.'));
  }

  async publish(input: Omit<DutyAiReview, 'id' | 'createdAtDate' | 'createdByUid'>): Promise<void> {
    if (!(this.auth.isManager() || this.auth.hasPermission(PERMISSIONS.DUTY_MANAGE))) {
      throw new Error('Chỉ người quản lý lịch trực mới được công bố đánh giá AI.');
    }
    const uid = this.auth.currentUser()?.uid;
    if (!uid) throw new Error('Cần đăng nhập trước khi công bố.');
    if (!isDutyDateKey(input.periodStart) || !isDutyDateKey(input.periodEnd) || input.periodStart > input.periodEnd) {
      throw new Error('Kỳ phân tích không hợp lệ.');
    }
    if (!['3', '6', '12', 'all'].includes(input.window) || !/^[a-f0-9]{8}$/.test(input.dataFingerprint)) {
      throw new Error('Thông tin đối chiếu dữ liệu không hợp lệ.');
    }
    const analysisText = input.analysisText.trim();
    if (analysisText.length < 30 || analysisText.length > 16000) {
      throw new Error('Bài phân tích cần có 30–16.000 ký tự.');
    }
    const path = this.path(input.staffId);
    await setDoc(doc(collection(this.fb.db, path)), {
      staffId: input.staffId,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      window: input.window,
      analysisText,
      dataFingerprint: input.dataFingerprint,
      createdByUid: uid,
      createdAt: serverTimestamp(),
    });
  }
}
